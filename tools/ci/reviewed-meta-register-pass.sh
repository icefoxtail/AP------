#!/usr/bin/env bash
# One complete reviewed-meta registration pass on the CURRENT checkout:
#   register inbox requests -> rebuild derived data -> validate -> verify that every changed UID is
#   effectively approved in the student consumer -> consume (delete) the inbox requests.
# It is the workflow's first pass AND the --regenerate command of git-push-derived-with-retry.mjs, so
# a push that lost a race to another main writer re-runs ALL of this on the new base.
# Inputs: RUNNER_TEMP (required), ARCHIVE_META_SCOPED=true when the push touched a scoped exam input.
# It discovers the inbox from the checkout itself and never commits or pushes.
set -euo pipefail
: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
TRIGGER_PATHS=tools/ci/archive-meta-register-trigger-paths.txt
scoped="${ARCHIVE_META_SCOPED:-false}"
work="$RUNNER_TEMP/archive-meta-register-pass"
rm -rf "$work"
mkdir -p "$work/requests"

mapfile -t reqs < <(find .archive-meta-register/inbox -maxdepth 1 -type f -name '*.json' -print 2>/dev/null | sort)
if [[ ${#reqs[@]} -eq 0 && "$scoped" != "true" ]]; then
  echo "No reviewed-meta requests and no scoped input to register."
  exit 0
fi
# Requests are consumed (deleted) at the end; keep copies for the changed-UID check.
for request in "${reqs[@]}"; do cp -- "$request" "$work/requests/$(basename "$request")"; done

if [[ ${#reqs[@]} -gt 0 ]]; then
  node --test tests/archive-reviewed-exam-registration-v2.test.mjs
  for request in "${reqs[@]}"; do
    node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request "$request" --write
  done
fi

python archive/build_db.py

node archive/tools/verify-archive-registration.mjs
node archive/tools/build-archive2-catalog.mjs --check
node archive/tools/meta-foundation/compile-meta-foundation.mjs --canonical-only-check
for request in "${reqs[@]}"; do
  schema="$(jq -r .schemaVersion "$request")"
  if [[ "$schema" == "archive-reviewed-exam-meta-register-request-v2" || "$schema" == "archive-finalqa-pinpoint-register-request-v1" ]]; then
    node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request "$request" --verify-projection
  fi
done
git diff --check

# Every UID changed by the merged small JSON must be approved in the same consumer path the student page uses.
check_args=()
shopt -s nullglob
copies=("$work"/requests/*.json)
shopt -u nullglob
for copy in "${copies[@]}"; do check_args+=(--request "$copy"); done
if [[ "$scoped" == "true" ]]; then
  while IFS= read -r scoped_file; do check_args+=(--scoped "$scoped_file"); done \
    < <(grep -v -e '^#' -e '^$' -e '\*' "$TRIGGER_PATHS")
fi
if [[ ${#check_args[@]} -gt 0 ]]; then
  node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs "${check_args[@]}" --summary-file "${GITHUB_STEP_SUMMARY:-/dev/null}"
fi

for request in "${reqs[@]}"; do rm -f -- "$request"; done
