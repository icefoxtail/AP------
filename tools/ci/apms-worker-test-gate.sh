#!/usr/bin/env bash
# Test gate for .github/workflows/apms-worker-deploy.yml: the APMS Worker is deployed only when all of these pass.
# Run from the repository root after `npm ci --prefix apmath/worker-backup/worker`. Every command runs (no early
# exit) so one report lists all failures; the script exits 1 if any failed. No Cloudflare credentials are used
# (miniflare/workerd run locally) and nothing is skipped, quarantined or loosened here.
set -uo pipefail
cd "$(dirname "$0")/../.."

failed=()
run() {
  local label="$1"; shift
  echo "::group::$label"
  if "$@"; then echo "PASS $label"; else echo "::error title=Worker test gate::FAIL $label"; failed+=("$label"); fi
  echo "::endgroup::"
}

W=apmath/worker-backup/worker
run "node --check Worker entry" node --check "$W/index.js"
run "node --check backup workflow" node --check "$W/backup-workflow.js"

# Same generated-artifact build tools/run-tests.js performs before the source-verification tests: build from the
# checked-out source so a code-only change does not depend on already-committed shard outputs.
run "build canonical Archive2 test projection" node archive/tools/build-archive2-catalog.mjs

# Worker runtime tests that need miniflare/workerd + D1.
run "tests/archive2-worker-runtime.mjs (workerd + D1)" node tests/archive2-worker-runtime.mjs
run "tests/archive-saved-papers-runtime.mjs" node --test tests/archive-saved-papers-runtime.mjs
run "tests/archive2-ux-retrieval-d1.test.mjs" node --test tests/archive2-ux-retrieval-d1.test.mjs
run "tests/apmath-omr-result-identity.test.mjs" node --test tests/apmath-omr-result-identity.test.mjs
run "tests/apms-result-clinic-uid-bridge.test.mjs" node --test tests/apms-result-clinic-uid-bridge.test.mjs

# Worker unit tests (same selection as tools/run-tests.js).
run "tests/archive2-worker-validation.test.mjs (Grade/browse contracts)" node --test \
  --test-name-pattern 'grade-only canonical path filters pass mixed-question validation|Worker accepts an approved high2 source in the shared high3 semantic browse pool without rewriting its grade|shared browse grade cannot replace saved snapshot source grades at deployment|target-only grade validation accepts every supported class grade and preserves fail-closed fallbacks' \
  tests/archive2-worker-validation.test.mjs
run "tests/archive2-saved-paper-namespace.test.mjs" node --test tests/archive2-saved-paper-namespace.test.mjs
run "tests/archive2-saved-paper-d1-batching.test.mjs" node --test tests/archive2-saved-paper-d1-batching.test.mjs
run "tests/archive2-original-source-verification-shard.test.mjs" node --test tests/archive2-original-source-verification-shard.test.mjs
run "tests/apmath-class-progress-api.test.mjs" node --test tests/apmath-class-progress-api.test.mjs
run "tests/apmath-class-progress-phase-api.test.mjs" node --test tests/apmath-class-progress-phase-api.test.mjs
run "tests/archive2-assignment-handoff.test.cjs" node --test tests/archive2-assignment-handoff.test.cjs
run "tests/archive2-assignment-pdf-retry.test.cjs" node --test tests/archive2-assignment-pdf-retry.test.cjs

if ((${#failed[@]})); then
  echo "Worker test gate FAILED (${#failed[@]}): ${failed[*]}"
  exit 1
fi
echo "Worker test gate PASSED"
