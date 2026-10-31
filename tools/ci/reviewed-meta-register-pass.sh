#!/usr/bin/env bash
# One complete reviewed-meta registration pass on the CURRENT checkout:
#   register inbox requests -> rebuild derived data -> validate -> consume (delete) the inbox requests.
# The changed-UID consumer approval check is deliberately NOT part of this pass: it runs after the push
# (tools/ci/verify-registered-consumer-approval.sh) so a failing approval can never leave the inbox
# request unconsumed on main. The consumed requests are copied below for that later check.
# It is the workflow's first pass AND the --regenerate command of git-push-derived-with-retry.mjs, so
# a push that lost a race to another main writer re-runs ALL of this on the new base.
# Inputs: RUNNER_TEMP (required), ARCHIVE_META_SCOPED=true when the push touched a scoped exam input.
# It discovers the inbox from the checkout itself and never commits or pushes.
# Per-request isolation (tools/ci/register-reviewed-meta-requests.mjs): each request is registered on its
# own. A request the registrar refuses is fail-closed for that request only - it is moved to
# .archive-meta-register/rejected/ with a *.rejection.json record, reported as a workflow error annotation
# and summary table, and never blocks the other requests. The pass itself stays green for rejections so
# the Pages release (resumed only by a successful register run) is not deadlocked.
# The consumer-projection verification of each applied request cannot be undone per request, so when it
# refuses some requests the tree is reset to HEAD, those requests are rejected (stage projection-verify) and the
# registration is redone once without them (at most 2 rounds). A refusal that leaves the tree changed, a second
# round that still fails, or any failure of the shared rebuild/validation (build_db, parity, catalog) fails the pass.
set -euo pipefail
: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
scoped="${ARCHIVE_META_SCOPED:-false}"
work="$RUNNER_TEMP/archive-meta-register-pass"
rm -rf "$work"
mkdir -p "$work/requests"
isolate=tools/ci/register-reviewed-meta-requests.mjs
registrar=archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs
summary="${GITHUB_STEP_SUMMARY:-/dev/null}"

mapfile -t reqs < <(find .archive-meta-register/inbox -maxdepth 1 -type f -name '*.json' -print 2>/dev/null | sort)
if [[ ${#reqs[@]} -eq 0 && "$scoped" != "true" ]]; then
  echo "No reviewed-meta requests and no scoped input to register."
  exit 0
fi
if [[ ${#reqs[@]} -gt 0 ]]; then
  only_meta_pipeline=true
  for request in "${reqs[@]}"; do
    schema="$(jq -r '.schemaVersion // ""' "$request")"
    approval="$(jq -r '.approval.type // ""' "$request")"
    if [[ "$schema" != "archive-reviewed-exam-meta-register-request-v2" || "$approval" != "META_PIPELINE_AUDIT" ]]; then
      only_meta_pipeline=false
    fi
  done
  if [[ "$only_meta_pipeline" == "true" ]]; then
    # This request family is covered by the v2 registrar suite. Legacy FINAL_QA
    # fixtures exercise separate writers and must not gate a Gemini audit handoff.
    node --test tests/archive-reviewed-exam-registration-v2.test.mjs
  else
    node --test tests/archive-reviewed-exam-registration-v2.test.mjs
    node --test tests/archive-finalqa-nonpt-register.test.mjs
    node --test tests/archive-finalqa-nonpt-real-geumdang.test.mjs
  fi
fi

applied=()
for round in 1 2; do
  applied=()
  mapfile -t reqs < <(find .archive-meta-register/inbox -maxdepth 1 -type f -name '*.json' -print 2>/dev/null | sort)
  if [[ ${#reqs[@]} -gt 0 ]]; then
    node "$isolate" --applied-file "$work/applied.txt" --rejected-file "$work/rejected.txt" --summary-file "$summary" -- "${reqs[@]}"
    mapfile -t applied < "$work/applied.txt"
  fi
  if [[ ${#applied[@]} -eq 0 && "$scoped" != "true" ]]; then
    echo "No request could be applied on this base; nothing to rebuild (rejections are recorded under .archive-meta-register/rejected/)."
    exit 0
  fi

  # compiled/ and canonical/registry_index.json are deterministic derivations of the canonical packs. A request that
  # registers rewrites them, but a base on which canonical packs were edited without recompiling (or on which every
  # request is a replay or refused) would fail the parity gate below for reasons unrelated to any request.
  # This workflow is the single writer of derived registration data, so it derives them here, as the h22/geumdang26
  # closeout workflows do before their parity check.
  node archive/tools/meta-foundation/compile-meta-foundation.mjs --write > "$work/compile-write.json"

  # build_db.py is a generator that must reach a fixed point: its last step (runtime source-readiness --write)
  # can rewrite a runtime pack (middle-geometry-v1.json counts) after the final canonical manifest was built,
  # so its own --check fails once for requests that add records to such a pack and passes on the next run.
  # One re-run is allowed; a genuine failure fails again and fails the pass.
  if ! python archive/build_db.py; then
    echo "::warning title=build_db did not converge on the first run::re-running once to reach the generator fixed point"
    python archive/build_db.py
  fi

  node archive/tools/verify-archive-registration.mjs
  node archive/tools/build-archive2-catalog.mjs --check
  node archive/tools/meta-foundation/compile-meta-foundation.mjs --canonical-only-check

  # Verify every applied request (do not stop at the first refusal) so one extra round can drop all of them.
  verify_failed=(); verify_errors=()
  for request in "${applied[@]}"; do
    schema="$(jq -r .schemaVersion "$request")"
    if [[ "$schema" == "archive-reviewed-exam-meta-register-request-v2" || "$schema" == "archive-finalqa-pinpoint-register-request-v1" || "$schema" == "archive-finalqa-nonpt-register-request-v1" || "$schema" == "archive-difficulty5-register-request-v1" ]]; then
      verify_rc=0
      out="$(node "$registrar" --request "$request" --verify-projection 2>&1)" || verify_rc=$?
      if [[ "$verify_rc" -ne 0 ]]; then
        verify_failed+=("$request")
        # A refusal that prints no recognisable "...Error: " line (signal kill, non-Error throw, "AssertionError [ERR_...]")
        # must not abort the whole pass under `set -e -o pipefail` (grep exits 1): isolation is per request.
        verify_msg="$(grep -E '^(Uncaught )?[A-Za-z]*Error: ' <<<"$out" | tail -n 1 | cut -c1-500 || true)"
        verify_errors+=("${verify_msg:-consumer projection verification failed (exit status $verify_rc)}")
      fi
    fi
  done
  if [[ ${#verify_failed[@]} -eq 0 ]]; then break; fi
  if [[ "$round" == "2" ]]; then
    echo "Projection verification still refuses ${#verify_failed[@]} request(s) after the second round: ${verify_failed[*]}" >&2
    exit 1
  fi
  # Undo this round's registration, reject exactly the refused requests, and redo the others from the same base.
  node "$isolate" --reset-derived
  for i in "${!verify_failed[@]}"; do
    node "$isolate" --reject "${verify_failed[$i]}" --stage projection-verify --error "${verify_errors[$i]:-consumer projection verification failed}" --summary-file "$summary"
  done
done
git diff --check

# Applied requests are consumed (deleted); keep copies for the post-push changed-UID check.
# Rejected requests were moved to .archive-meta-register/rejected/ and are never verified as changed UIDs.
rm -f "$work"/requests/*.json
for request in "${applied[@]}"; do cp -- "$request" "$work/requests/$(basename "$request")"; done
for request in "${applied[@]}"; do rm -f -- "$request"; done
