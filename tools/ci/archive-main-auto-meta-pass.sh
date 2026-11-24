#!/usr/bin/env bash
# One atomic derived-data transaction. Failed validation publishes neither data nor cursor.
set -euo pipefail
work="${RUNNER_TEMP:-/tmp}/archive-main-auto-meta"
retry_args=()
if [[ -n "${ARCHIVE_CANONICAL_PARENT_RETRY_REQUEST:-}" || -n "${ARCHIVE_CANONICAL_PARENT_RETRY_SHA256:-}" ]]; then
  [[ -n "${ARCHIVE_CANONICAL_PARENT_RETRY_REQUEST:-}" && "${ARCHIVE_CANONICAL_PARENT_RETRY_SHA256:-}" =~ ^[a-f0-9]{64}$ ]] || { echo 'Invalid bounded parent retry arguments.' >&2; exit 1; }
  retry_args=(--canonical-parent-retry-request "$ARCHIVE_CANONICAL_PARENT_RETRY_REQUEST" --canonical-parent-retry-sha256 "$ARCHIVE_CANONICAL_PARENT_RETRY_SHA256")
fi
mkdir -p "$work"
# Stage timing (instrumentation only; never changes what runs). One JSON line per stage in stage-times.jsonl, a
# copy on stderr, so stdout that later steps parse (compile/materialize/verify JSON) is untouched. The writer reads
# the file; a failing command still records its stage through the EXIT trap.
stage_log="$work/stage-times.jsonl"
: > "$stage_log" 2>/dev/null || true
stage_name=''
stage_start=0
stage_rc=''
now_ms() {
  local t
  t=$(date +%s%3N 2>/dev/null) || t=''
  [[ "$t" =~ ^[0-9]+$ ]] || t=$(( $(date +%s 2>/dev/null || echo 0) * 1000 ))
  printf '%s' "$t"
}
# Recording is best effort: nothing in here may fail the script or change its exit code, even when $work is
# not writable. stage_rc is set by the one branch (failed verify before its retry) whose command status the
# surrounding `if !` would otherwise hide.
stage_end() {
  [[ -n "$stage_name" ]] || return 0
  local code="${stage_rc:-${1:-0}}" ms=0 adj=''
  ms=$(( $(now_ms) - stage_start )) 2>/dev/null || ms=0
  # The wall clock can be stepped back mid-stage (runner clock sync). A negative duration is meaningless: record 0 and
  # mark it so the number is not mistaken for a real zero.
  if (( ms < 0 )) 2>/dev/null; then ms=0; adj=',"clockAdjusted":true'; fi
  { printf '{"stage":"%s","durationMs":%s,"exitCode":%s%s}\n' "$stage_name" "$ms" "$code" "$adj" >> "$stage_log"; } 2>/dev/null || true
  printf '[stage-time] %s %sms exit=%s\n' "$stage_name" "$ms" "$code" >&2 2>/dev/null || true
  stage_name=''
  stage_rc=''
  return 0
}
stage() { stage_end 0; stage_name="$1"; stage_start=$(now_ms) || stage_start=0; return 0; }
trap 'rc=$?; stage_end "$rc"; exit "$rc"' EXIT
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=6144}"
report="$work/report.json"
cat tools/ci/archive-pages-registration.paths > "$work/commit.paths"
printf '\n.archive-meta-register/auto/state.json\n.archive-meta-register/auto/requests/*.json\n.archive-meta-register/auto/receipts/*.json\n.archive-meta-register/auto/last-verification.json\n' >> "$work/commit.paths"
if [[ "$(node -p "JSON.parse(require('fs').readFileSync('.archive-meta-register/auto/config.json','utf8')).enabled === true")" != true ]]; then
  echo 'Automatic metadata registration is disabled; no changes.'
  exit 0
fi
# Native producers remain authoritative; no new canonical definitions or student JS are written.
stage compile-meta-foundation
node archive/tools/meta-foundation/compile-meta-foundation.mjs --write > "$work/compile.json"
stage materialize-meta-v2
node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --write > "$work/materialize.json"
# Merge run (ARCHIVE_REGISTRATION_MODE=merge, set once by the registration writer): only the questions this merge changed
# are registered. With none, nothing below can register anything, so skip the two build_db runs and the checks that
# certify a registration. The queued backlog stays untouched in state.json; the writer keeps its "work remains" flag
# and the scheduled or manual digest run drains it. A bounded canonical-parent retry always takes the full path.
if [[ "${ARCHIVE_REGISTRATION_MODE:-}" == merge ]] && (( ${#retry_args[@]} == 0 )); then
  stage plan-targets
  node archive/tools/meta-foundation/auto-register-merged-source.mjs --plan --report "$work/plan.json" > /dev/null
  if [[ "$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).targetCount" "$work/plan.json")" == 0 ]]; then
    cp "$work/plan.json" "$report"
    echo 'NO_TARGETS: this merge changed no exam question; queued backlog is left for the scheduled or manual digest run.'
    exit 0
  fi
fi
stage build-db-before
node tools/ci/archive-registration-build-db.mjs > "$work/build-before.log" 2>&1
stage auto-register-write
node archive/tools/meta-foundation/auto-register-merged-source.mjs --write --report "$report" "${retry_args[@]}"
# Existing build can reach its manifest fixed point on the second pass.
# When nothing was registered, the write step changed only state.json (not a build input) and the first build left every other
# file as it was, a second build would see exactly the same inputs and write exactly the same bytes: skip it (about 6 minutes).
# Anything else (a registered UID, any other changed or new file) takes the second build as before.
skip_second_build=$(node --input-type=module -e "
import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const report=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
const lines=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:1<<28}).split('\n').filter(Boolean);
const state='.archive-meta-register/auto/state.json';
const changed=[...lines('diff','--name-only'),...lines('ls-files','--others','--exclude-standard')];
process.stdout.write(String(report.applied===0&&Array.isArray(report.plannedPaths)&&report.plannedPaths.every(p=>p===state)&&changed.every(p=>p===state)));" "$report") || skip_second_build=false  # 판정이 실패하면 생략하지 않는다(예전 동작)
if [[ "$skip_second_build" == true ]]; then
  echo 'SECOND_BUILD_SKIPPED: nothing was registered and the first build changed no file; a second build would write the same bytes.' | tee "$work/build-after.log"
else
  stage build-db-after
  node tools/ci/archive-registration-build-db.mjs > "$work/build-after.log" 2>&1
fi
stage verify
if ! node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" > "$work/verify.json" 2> "$work/verify-error.log"; then
  stage_rc=1
  stage build-db-fixed-point
  node tools/ci/archive-registration-build-db.mjs > "$work/build-fixed-point.log" 2>&1
  stage verify-after-fixed-point
  node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" | tee "$work/verify.json"
fi
stage identity-contract-test
node tests/archive-question-identity-contract.test.mjs > "$work/identity-contract.log"
stage identity-runtime-test
node tests/archive-question-identity-runtime.test.mjs > "$work/identity-runtime.log"
stage registration-parity
node archive/tools/verify-archive-registration.mjs > "$work/registration-parity.json"
stage git-diff-checks
git diff --check
git diff --exit-code -- archive/exams
# Replay exactly this bounded batch. A normal invocation selects the NEXT batch
# after unchanged pending inputs, which is distinct work and can legitimately apply.
stage replay
node archive/tools/meta-foundation/auto-register-merged-source.mjs --replay-report "$report" --report "$work/replay.json" > "$work/replay.log"
node --input-type=module - "$work/replay.json" <<'JS'
import fs from 'node:fs';
const r=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
if(r.replayVerified!==true||r.applied!==0||r.plannedPaths?.length!==0)throw Error('AUTO_META_REPLAY_NOT_IDEMPOTENT');
console.log('AUTO_META_REPLAY_NO_DUPLICATE: PASS');
JS
stage postchecks
# Preserve the completed bounded proof before the writer continues with its ordinary next batch.
if (( ${#retry_args[@]} )); then
  proof_dir="$work/canonical-parent-${ARCHIVE_CANONICAL_PARENT_RETRY_SHA256}"
  mkdir -p "$proof_dir"
  cp "$report" "$work/verify.json" "$work/replay.json" "$proof_dir/"
fi
# Reuse the native generated-output allowlist; permit only this module's derived state/receipts.
cat tools/ci/archive-pages-registration.paths > "$work/commit.paths"
printf '\n.archive-meta-register/auto/state.json\n.archive-meta-register/auto/requests/*.json\n.archive-meta-register/auto/receipts/*.json\n.archive-meta-register/auto/last-verification.json\n' >> "$work/commit.paths"
python - "$work/commit.paths" <<'PY'
import fnmatch, subprocess, sys
patterns=[s.strip() for s in open(sys.argv[1]) if s.strip() and not s.startswith('#')]
changed=set(subprocess.check_output(['git','diff','--name-only','-z']).decode().split('\0'))
changed.update(subprocess.check_output(['git','ls-files','--others','--exclude-standard','-z']).decode().split('\0'))
bad=[p for p in changed if p and not any(fnmatch.fnmatchcase(p,x) for x in patterns)]
if bad: raise SystemExit('UNEXPECTED_GENERATED_PATHS: '+str(bad))
PY
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  { echo '### Main-merge metadata registration'; echo '```json'; cat "$report"; cat "$work/verify.json"; echo '```'; } >> "$GITHUB_STEP_SUMMARY"
fi
