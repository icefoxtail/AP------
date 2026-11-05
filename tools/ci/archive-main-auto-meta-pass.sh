#!/usr/bin/env bash
# One atomic derived-data transaction. Failed validation publishes neither data nor cursor.
set -euo pipefail
work="${RUNNER_TEMP:-/tmp}/archive-main-auto-meta"
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
python archive/build_db.py > "$work/build-before.log" 2>&1
node archive/tools/meta-foundation/auto-register-merged-source.mjs --write --report "$report"
# Existing build can reach its manifest fixed point on the second pass.
python archive/build_db.py > "$work/build-after.log" 2>&1
if ! node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" > "$work/verify.json" 2> "$work/verify-error.log"; then
  python archive/build_db.py > "$work/build-fixed-point.log" 2>&1
  node archive/tools/meta-foundation/auto-register-merged-source.mjs --verify --report "$report" | tee "$work/verify.json"
fi
node tests/archive-question-identity-contract.test.mjs > "$work/identity-contract.log"
node tests/archive-question-identity-runtime.test.mjs > "$work/identity-runtime.log"
node archive/tools/verify-archive-registration.mjs > "$work/registration-parity.json"
git diff --check
git diff --exit-code -- archive/exams
# Run twice in the same transaction: an already applied input must be a no-op.
node archive/tools/meta-foundation/auto-register-merged-source.mjs --report "$work/replay.json" > "$work/replay.log"
node --input-type=module - "$work/replay.json" <<'JS'
import fs from 'node:fs';
const r=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
if((r.applied||0)!==0)throw Error('AUTO_META_REPLAY_NOT_IDEMPOTENT');
console.log('AUTO_META_REPLAY_NO_DUPLICATE: PASS');
JS
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
