#!/usr/bin/env bash
# Post-merge gate: every UID changed by the small JSON(s) this run registered must be effectively approved in
# the same consumer path the student search page uses. It runs AFTER the push, on the local checkout the push
# helper left at the pushed commit (or the reflected remote tip), so a failure never leaves an inbox request
# unconsumed on main. Inputs: RUNNER_TEMP (required; holds the request copies saved by
# reviewed-meta-register-pass.sh), ARCHIVE_META_SCOPED=true when scoped exam inputs changed.
set -euo pipefail
: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
TRIGGER_PATHS=tools/ci/archive-meta-register-trigger-paths.txt
summary="${GITHUB_STEP_SUMMARY:-/dev/null}"
sha="$(git rev-parse HEAD)"

shopt -s nullglob
copies=("$RUNNER_TEMP"/archive-meta-register-pass/requests/*.json)
shopt -u nullglob
check_args=()
access_args=()
for copy in "${copies[@]}"; do
  if [[ "$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).approval?.type || "")' "$copy")" == 'META_PIPELINE_AUDIT' ]]; then
    access_args+=(--request "$copy")
  else
    check_args+=(--request "$copy")
  fi
done
if [[ ${#access_args[@]} -gt 0 ]]; then
  node archive/tools/meta-foundation/verify-meta-pipeline-student-access.mjs "${access_args[@]}" > "$RUNNER_TEMP/meta-student-access.json"
  cat "$RUNNER_TEMP/meta-student-access.json" >> "$summary"
  if ! node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs "${access_args[@]}" --summary-file "$summary" > "$RUNNER_TEMP/meta-supplements.json"; then
    node archive/tools/meta-foundation/verify-meta-pipeline-student-access.mjs --supplement-report "$RUNNER_TEMP/meta-supplements.json"
  fi
  printf '\nstatus=STUDENT_ACCESS_APPROVED_METADATA_SUPPLEMENT_RECORDED registered_main_sha=%s browser_rendering=NOT_RUN\n' "$sha" >> "$summary"
fi
if [[ "${ARCHIVE_META_SCOPED:-false}" == "true" ]]; then
  while IFS= read -r scoped_file; do check_args+=(--scoped "$scoped_file"); done \
    < <(grep -v -e '^#' -e '^$' -e '\*' "$TRIGGER_PATHS")
fi

if [[ ${#check_args[@]} -eq 0 ]]; then
  if [[ ${#access_args[@]} -gt 0 ]]; then exit 0; fi
  # Nothing was checked, so this is not a verification claim.
  echo "No changed-UID inputs on this base (already consumed by another writer); nothing to verify."
  printf '\nstatus=NO_CHANGED_UIDS_TO_VERIFY registered_main_sha=%s changed_uids=0\n' "$sha" >> "$summary"
  exit 0
fi

if node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs "${check_args[@]}" --summary-file "$summary"; then
  printf '\nstatus=POST_MERGE_VERIFIED registered_main_sha=%s\n' "$sha" >> "$summary"
else
  {
    printf '\nstatus=REGISTERED_CONSUMER_APPROVAL_FAIL registered_main_sha=%s\n' "$sha"
    echo "next action: registration is on main; fix the listed UIDs with a new small JSON (e.g. scoped parent links), then re-run; Pages for this registration did not auto-deploy - dispatch Archive Pages Release or wait for the next main push."
  } >> "$summary"
  exit 1
fi
