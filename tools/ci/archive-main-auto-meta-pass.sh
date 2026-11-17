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
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=6144}"
report="$work/report.json"
cat tools/ci/archive-pages-registration.paths > "$work/commit.paths"
printf '\n.archive-meta-register/auto/state.json\n.archive-meta-register/auto/requests/*.json\n.archive-meta-register/auto/receipts/*.json\n.archive-meta-register/auto/last-verification.json\n' >> "$work/commit.paths"
if [[ "$(node -p "JSON.parse(require('fs').readFileSync('.archive-meta-register/auto/config.json','utf8')).enabled === true")" != true ]]; then
  echo 'Automatic metadata registration is disabled; no changes.'
  exit 0
fi
# Native producers remain authoritative; no new canonical definitions or student JS are written.
node archive/tools/meta-foundation/compile-meta-foundation.mjs --write > "$work/compile.json"
node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --write > "$work/materialize.json"
node tools/ci/archive-registration-build-db.mjs > "$work/build-before.log" 2>&1
node archive/tools/meta-foundation/auto-register-merged-source.mjs --write --report "$report" "${retry_args[@]}"
# Existing build can reach its manifest fixed point on the second pass.
node tools/ci/archive-registration-build-db.mjs > "$work/build-after.log" 2>&1
if ! node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" > "$work/verify.json" 2> "$work/verify-error.log"; then
  node tools/ci/archive-registration-build-db.mjs > "$work/build-fixed-point.log" 2>&1
  node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" | tee "$work/verify.json"
fi
node tests/archive-question-identity-contract.test.mjs > "$work/identity-contract.log"
node tests/archive-question-identity-runtime.test.mjs > "$work/identity-runtime.log"
node archive/tools/verify-archive-registration.mjs > "$work/registration-parity.json"
git diff --check
git diff --exit-code -- archive/exams
# Replay exactly this bounded batch. A normal invocation selects the NEXT batch
# after unchanged pending inputs, which is distinct work and can legitimately apply.
node archive/tools/meta-foundation/auto-register-merged-source.mjs --replay-report "$report" --report "$work/replay.json" > "$work/replay.log"
node --input-type=module - "$work/replay.json" <<'JS'
import fs from 'node:fs';
const r=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
if(r.replayVerified!==true||r.applied!==0||r.plannedPaths?.length!==0)throw Error('AUTO_META_REPLAY_NOT_IDEMPOTENT');
console.log('AUTO_META_REPLAY_NO_DUPLICATE: PASS');
JS
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
