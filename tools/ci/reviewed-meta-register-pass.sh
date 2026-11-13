#!/usr/bin/env bash
# One complete reviewed-meta registration pass on the CURRENT checkout:
#   register inbox requests -> rebuild derived data -> validate -> consume (delete) the inbox requests.
# Check actual changed-UID consumer values before consuming requests, so attributable failures can use
# the same fail-closed rejection/rebuild path as projection refusals. The independent final consumer gate
# (tools/ci/verify-registered-consumer-approval.sh) still checks the kept copies after all writer lanes converge.
# It is the workflow's first pass AND the --regenerate command of git-push-derived-with-retry.mjs, so
# a push that lost a race to another main writer re-runs ALL of this on the new base.
# Inputs: RUNNER_TEMP (required), ARCHIVE_META_SCOPED=true when the push touched a scoped exam input.
# It discovers the inbox from the checkout itself and never commits or pushes.
# Per-request isolation (tools/ci/register-reviewed-meta-requests.mjs): each request is registered on its
# own. A request the registrar refuses is fail-closed for that request only - it is moved to
# .archive-meta-register/rejected/ with a *.rejection.json record, reported as a workflow error annotation
# and summary table, and never blocks the other requests. The pass itself stays green for rejections so
# the Pages release (resumed only by a successful register run) is not deadlocked.
# Consumer-projection/actual-consumer writes cannot be undone per request, so when a check
# refuses some requests the tree is reset to HEAD, those requests are rejected with the failing stage and the
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
  has_legacy_finalqa=false
  has_difficulty5=false
  has_basic_rebind=false
  has_binding_course_correction=false
  for request in "${reqs[@]}"; do
    schema="$(node -e 'try { console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).schemaVersion || "") } catch {}' "$request")"
    if [[ "$schema" == "archive-finalqa-nonpt-register-request-v1" ]]; then
      has_legacy_finalqa=true
    fi
    if [[ "$schema" == "archive-difficulty5-register-request-v1" ]]; then
      has_difficulty5=true
    fi
    if [[ "$schema" == "archive-basic-scope-rebind-request-v1" ]]; then
      has_basic_rebind=true
    fi
    if [[ "$schema" == "archive-binding-course-correction-request-v1" ]]; then
      has_binding_course_correction=true
    fi
  done
  node --test tests/archive-reviewed-exam-registration-v2.test.mjs
  if [[ "$has_binding_course_correction" == "true" ]]; then
    node --test tests/archive-binding-course-correction.test.mjs
  fi
  if [[ "$has_basic_rebind" == "true" ]]; then
    node --test tests/archive-basic-scope-rebind.test.mjs
  fi
  if [[ "$has_difficulty5" == "true" ]]; then
    node --test tests/archive-difficulty5-register.test.mjs
  fi
  if [[ "$has_legacy_finalqa" == "true" ]]; then
    node --test tests/archive-finalqa-nonpt-register.test.mjs
    node --test tests/archive-finalqa-nonpt-real-geumdang.test.mjs
  fi
fi

applied=()
for round in 1 2; do
  applied=()
  mapfile -t reqs < <(find .archive-meta-register/inbox -maxdepth 1 -type f -name '*.json' -print 2>/dev/null | sort)
  if [[ ${#reqs[@]} -gt 0 ]]; then
    node "$isolate" --applied-file "$work/applied.txt" --rejected-file "$work/rejected.txt" --pending-file "$work/pending.txt" --summary-file "$summary" -- "${reqs[@]}"
    while IFS= read -r pending || [[ -n "$pending" ]]; do
      [[ -z "$pending" ]] || cp -- "$pending" "$work/requests/$(basename "$pending")"
    done < "$work/pending.txt"
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
  verify_failed=(); verify_errors=(); verify_stages=(); consumer_candidates=()
  for request in "${applied[@]}"; do
    schema="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).schemaVersion)' "$request")"
    if [[ "$schema" == "archive-reviewed-exam-meta-register-request-v2" || "$schema" == "archive-finalqa-pinpoint-register-request-v1" || "$schema" == "archive-finalqa-nonpt-register-request-v1" || "$schema" == "archive-difficulty5-register-request-v1" || "$schema" == "archive-basic-scope-rebind-request-v1" || "$schema" == "archive-binding-course-correction-request-v1" ]]; then
      verify_rc=0
      out="$(node "$registrar" --request "$request" --verify-projection 2>&1)" || verify_rc=$?
      if [[ "$verify_rc" -ne 0 ]]; then
        verify_failed+=("$request")
        # A refusal that prints no recognisable "...Error: " line (signal kill, non-Error throw, "AssertionError [ERR_...]")
        # must not abort the whole pass under `set -e -o pipefail` (grep exits 1): isolation is per request.
        verify_msg="$(grep -E '^(Uncaught )?[A-Za-z]*Error: ' <<<"$out" | tail -n 1 | cut -c1-500 || true)"
        verify_errors+=("${verify_msg:-consumer projection verification failed (exit status $verify_rc)}")
        verify_stages+=(projection-verify)
        continue
      fi
    fi
    consumer_candidates+=("$request")
  done
  # One shared consumer load checks all remaining requests. A global/ambiguous failure aborts,
  # leaving the inbox unconsumed; only exact request failures may be rejected and retried.
  node tools/ci/collect-reviewed-consumer-refusals.mjs --report-file "$work/consumer-preflight-$round.json" --refusals-file "$work/consumer-refusals.nul" -- "${consumer_candidates[@]}"
  mapfile -d '' -t consumer_refusals < "$work/consumer-refusals.nul"
  for ((i=0; i<${#consumer_refusals[@]}; i+=2)); do
    verify_failed+=("${consumer_refusals[$i]}")
    verify_errors+=("${consumer_refusals[$((i+1))]}")
    verify_stages+=(consumer-verify)
  done
  if [[ ${#verify_failed[@]} -eq 0 ]]; then break; fi
  if [[ "$round" == "2" ]]; then
    echo "Projection verification still refuses ${#verify_failed[@]} request(s) after the second round: ${verify_failed[*]}" >&2
    exit 1
  fi
  # Undo this round's registration, reject exactly the refused requests, and redo the others from the same base.
  node "$isolate" --reset-derived
  for i in "${!verify_failed[@]}"; do
    node "$isolate" --reject "${verify_failed[$i]}" --stage "${verify_stages[$i]}" --error "${verify_errors[$i]:-consumer projection verification failed}" --summary-file "$summary" --pending-file "$work/projection-pending.txt"
    while IFS= read -r pending || [[ -n "$pending" ]]; do
      [[ -z "$pending" ]] || cp -- "$pending" "$work/requests/$(basename "$pending")"
    done < "$work/projection-pending.txt"
  done
done
git diff --check

# Applied requests are consumed (deleted); keep copies for the post-push changed-UID check.
# Rejected requests were moved to .archive-meta-register/rejected/ and are never verified as changed UIDs.
for request in "${applied[@]}"; do cp -- "$request" "$work/requests/$(basename "$request")"; done
for request in "${applied[@]}"; do rm -f -- "$request"; done
