#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
// ./ci/test-shard.cjs is required lazily inside main(): tests/archive-ci-scope.test.mjs evaluates the head of this file in a vm that only resolves built-in modules.

const root = path.resolve(__dirname, '..');
const testsDir = path.join(root, 'tests');

const quarantined = new Map([
  ['assessment-grade-target-round5-1.test.js', 'pre-existing archive grade target assertion mismatch'],
  ['assessment-m1-diagnostic-packs.test.js', 'pre-existing M1 diagnostic pack count mismatch'],
  ['assessment-m1-type-source-integrity.test.js', 'pre-existing M1 source integrity mismatch'],
  ['eie-attendance-print-design-contract.test.js', 'pre-existing EIE print design contract mismatch'],
  ['eie-attendance-visual-contract.test.js', 'pre-existing EIE attendance visual contract mismatch'],
  ['eie-grade-ledger-port.test.js', 'EIE grade ledger port review-pack artifact contract requires CODEX_RESULT2.md'],
  ['print-render-authority-phase0-baseline.test.js', 'the v2.2 SHA denominator is a historical frozen closure, and its documented clinic hash is stale; do not rewrite history to green the current source (docs/evidence/internal-review-engine-20260915.md)'],
  ['archive-latex-escapes.test.js', 'an in-progress Visang textbook solution contains two JS-unescaped \\dfrac commands; do not edit archived student math without freezing and checking the official source page']
]);

// 격리(quarantined) 목록의 파일은 실패해도 막지 않고, 통과하면 FIXED 안내를 낸다. 그 밖의 실패는 그대로 실패로 센다.
// (서명으로 알려진 실패를 허용하던 KNOWN-FAIL 장치는 2026-11-18 삭제했다: docs/agents/token-efficiency.md §12)
function runPlan({ root, plan }) {
  const result = { passed: 0, failed: [], knownFailed: [], fixedKnown: [], durationsMs: {} };
  for (const item of plan) {
    const startedAt = Date.now();
    const run = spawnSync(process.execPath, item.args, { cwd: root, timeout: item.timeout, stdio: 'inherit' });
    result.durationsMs[item.failedName] = Date.now() - startedAt;
    if (run.status === 0) {
      result.passed += 1;
      if (item.quarantined) result.fixedKnown.push(item.failedName);
    } else if (item.quarantined) {
      result.knownFailed.push(item.failedName);
    } else {
      result.failed.push(item.failedName);
      console.error(`Test failed: ${item.shownName}`);
    }
  }
  return result;
}

// These complete suites exceed the old 60-second child limit.
// Keep a finite per-command limit in both the full and scoped runners.
const jsTestTimeout = file => file === 'archive2-compose-scope.test.js' || file === 'archive2-draft-rows.test.js' ? 180000
  : file === 'meta-foundation-middle-geometry-runtime.test.js' ? 300000 : 60000;

// Keep the SVG semantic regression outside the legacy CommonJS-only glob.
// CI invokes this runner, so both the verifier syntax gate and its ESM test
// become blocking checks on every normal test run.
const requiredCommands = [
  { label: 'tests/m2-closed8-issued-rpm-view.test.cjs', args: ['--test', 'tests/m2-closed8-issued-rpm-view.test.cjs'], timeout: 60000 },
  { label: 'tests/archive-m3-e052-q5-current-ui-reuse.test.mjs', args: ['--test', 'tests/archive-m3-e052-q5-current-ui-reuse.test.mjs'], timeout: 180000 },
  { label: 'tests/archive-m3s2-current-ui-reuse.test.cjs', args: ['--test', 'tests/archive-m3s2-current-ui-reuse.test.cjs'], timeout: 60000 },
  { label: 'tests/archive-m3s2-q16-current-renderer-provenance.test.cjs', args: ['--test', 'tests/archive-m3s2-q16-current-renderer-provenance.test.cjs'], timeout: 60000 },
  { label: 'tests/archive-pr-q5-current-ui-shadow.test.mjs', args: ['--test', 'tests/archive-pr-q5-current-ui-shadow.test.mjs'], timeout: 180000 },
  { label: 'tests/item-4slot-svg7-current-ui-binding.test.cjs', args: ['--test', 'tests/item-4slot-svg7-current-ui-binding.test.cjs'], timeout: 60000 },
  { label: 'tests/protected-current-ui-log-transport.test.cjs', args: ['--test', 'tests/protected-current-ui-log-transport.test.cjs'], timeout: 60000 },
  { label: 'tests/protected9-ui-log-transport.test.cjs', args: ['--test', 'tests/protected9-ui-log-transport.test.cjs'], timeout: 60000 },
  { label: 'tests/archive-completion-check.test.mjs', args: ['--test', 'tests/archive-completion-check.test.mjs'] },
  { label: 'tests/archive-similar-md-to-js.test.mjs', args: ['--test', 'tests/archive-similar-md-to-js.test.mjs'] },
  { label: 'tests/archive-similar-import-harness.test.mjs', args: ['--test', 'tests/archive-similar-import-harness.test.mjs'] },
  { label: 'tests/archive-m1s2-problem-surface.test.cjs', args: ['--test', 'tests/archive-m1s2-problem-surface.test.cjs'] },
  { label: 'tests/archive-m3s2-q16-layout-browser.test.cjs', args: ['--test', 'tests/archive-m3s2-q16-layout-browser.test.cjs'] },
  { label: 'tests/item-4slot-m1s2-problem-continuity.test.cjs', args: ['--test', 'tests/item-4slot-m1s2-problem-continuity.test.cjs'] },
  { label: 'tests/item-4slot-m1s2-ui-provenance.test.cjs', args: ['--test', 'tests/item-4slot-m1s2-ui-provenance.test.cjs'] },
  { label: 'tests/item-4slot-m1-m3-transport.test.cjs', args: ['--test', 'tests/item-4slot-m1-m3-transport.test.cjs'] },
  { label: 'tests/archive-m3s2-layout-continuity.test.cjs', args: ['--test', 'tests/archive-m3s2-layout-continuity.test.cjs'] },
  { label: 'tests/archive-assignment-board-direct-output.test.cjs', args: ['--test', 'tests/archive-assignment-board-direct-output.test.cjs'] },
  { label: 'tests/archive-renderer-continuity-writer-inputs.test.mjs', args: ['--test', 'tests/archive-renderer-continuity-writer-inputs.test.mjs'] },
  {
    label: 'tests/native-approved-renderer-consumer.test.mjs',
    args: ['--test', 'tests/native-approved-renderer-consumer.test.mjs']
  },
  {
    label: 'tests/native-approved-renderer-preservation.test.mjs',
    args: ['--test', 'tests/native-approved-renderer-preservation.test.mjs']
  },
  {
    label: 'tests/native-approved-renderer-preview.test.mjs',
    args: ['--test', 'tests/native-approved-renderer-preview.test.mjs']
  },
  {
    label: 'tests/archive-source-quality-holds.test.mjs',
    args: ['--test', 'tests/archive-source-quality-holds.test.mjs']
  },
  {
    label: 'tests/archive-m2s1-original-source-error-hold.test.cjs',
    args: ['--test', 'tests/archive-m2s1-original-source-error-hold.test.cjs']
  },
  {
    label: 'tests/archive-native-authority-correction.test.mjs',
    args: ['--test', 'tests/archive-native-authority-correction.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-parent-correction.test.mjs',
    args: ['--test', 'tests/archive-reviewed-parent-correction.test.mjs']
  },
  {
    label: 'tests/archive2-registration-contracts.test.mjs',
    args: ['--test', 'tests/archive2-registration-contracts.test.mjs']
  },
  {
    label: 'tests/archive-register-trigger-paths.test.mjs',
    args: ['--test', 'tests/archive-register-trigger-paths.test.mjs']
  },
  {
    label: 'tests/archive-registration-whitespace.test.mjs',
    args: ['--test', 'tests/archive-registration-whitespace.test.mjs']
  },
  {
    label: 'tests/git-push-derived-with-retry.test.mjs',
    args: ['--test', 'tests/git-push-derived-with-retry.test.mjs']
  },
  {
    label: 'tests/archive-pr-registration-proof.test.mjs',
    args: ['--test', 'tests/archive-pr-registration-proof.test.mjs']
  },
  {
    label: 'tests/archive-pr-registration-prepare.test.mjs',
    args: ['--test', 'tests/archive-pr-registration-prepare.test.mjs']
  },
  {
    label: 'tests/archive-native-issued-rpm-history.test.mjs',
    args: ['--test', 'tests/archive-native-issued-rpm-history.test.mjs']
  },
  {
    label: 'tests/archive-native-issued-solution-rpm-history.test.mjs',
    args: ['--test', 'tests/archive-native-issued-solution-rpm-history.test.mjs']
  },
  {
    label: 'tests/archive-native-issued-child-continuity.test.mjs',
    args: ['--test', 'tests/archive-native-issued-child-continuity.test.mjs']
  },
  {
    label: 'tests/archive-pr-native-preview.test.mjs',
    args: ['--test', 'tests/archive-pr-native-preview.test.mjs'],
    timeout: 300000
  },
  {
    label: 'tests/archive-reviewed-m2-cc-renderer.test.mjs',
    args: ['--test', 'tests/archive-reviewed-m2-cc-renderer.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-native-scope-fields.test.mjs',
    args: ['--test', 'tests/archive-reviewed-native-scope-fields.test.mjs']
  },
  {
    label: 'tests/archive-question-binding.test.mjs',
    args: ['--test', 'tests/archive-question-binding.test.mjs']
  },
  {
    label: 'tests/archive-text-binding-rebinds.test.mjs',
    args: ['--test', 'tests/archive-text-binding-rebinds.test.mjs']
  },
  {
    label: 'tests/archive-similar-choice-order.test.mjs',
    args: ['--test', 'tests/archive-similar-choice-order.test.mjs']
  },
  {
    label: 'tests/archive-source-delta.test.mjs',
    args: ['--test', 'tests/archive-source-delta.test.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/source-delta-report.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/source-delta-report.mjs']
  },
  {
    label: 'tests/archive-main-merge-meta.test.mjs',
    args: ['--test', 'tests/archive-main-merge-meta.test.mjs'],
    timeout: 300000
  },
  {
    label: 'tests/archive-main-auto-parent-retry.test.mjs',
    args: ['--test', 'tests/archive-main-auto-parent-retry.test.mjs']
  },
  {
    label: 'tests/archive-main-meta-batch-replay.test.mjs',
    args: ['--test', 'tests/archive-main-meta-batch-replay.test.mjs']
  },
  {
    label: 'tests/item-4slot-runtime.test.cjs',
    args: ['--test', 'tests/item-4slot-runtime.test.cjs']
  },
  {
    label: 'tests/archive-mathjax-enclosed-latin-font.test.cjs',
    args: ['--test', 'tests/archive-mathjax-enclosed-latin-font.test.cjs']
  },
  {
    label: 'tests/item-4slot-public-reviewed-rebind.test.cjs',
    args: ['--test', 'tests/item-4slot-public-reviewed-rebind.test.cjs']
  },
  {
    label: 'tests/item-4slot-existing-renderer-v2.test.cjs',
    args: ['--test', 'tests/item-4slot-existing-renderer-v2.test.cjs']
  },
  {
    label: 'tests/archive-existing-registered-vector-svg7-derived-continuity.test.cjs',
    args: ['--test', 'tests/archive-existing-registered-vector-svg7-derived-continuity.test.cjs']
  },
  {
    label: 'tests/archive-existing-vector-svg-index-continuity.test.cjs',
    args: ['--test', 'tests/archive-existing-vector-svg-index-continuity.test.cjs']
  },
  {
    label: 'tests/archive-m2s1-text3-fragment-ui.test.cjs',
    args: ['--test', 'tests/archive-m2s1-text3-fragment-ui.test.cjs']
  },
  {
    label: 'tests/archive-m3-e052-q5-existing-vector.test.mjs',
    args: ['--test', 'tests/archive-m3-e052-q5-existing-vector.test.mjs'],
    timeout: 300000
  },
  {
    label: 'tests/item-4slot-existing-original-text-solution3.test.cjs',
    args: ['--test', 'tests/item-4slot-existing-original-text-solution3.test.cjs'],
    timeout: 60000
  },
  {
    label: 'tests/item-4slot-m3-renderer-hold.test.cjs',
    args: ['--test', 'tests/item-4slot-m3-renderer-hold.test.cjs']
  },
  {
    label: 'tests/archive-reviewed-projection-phase.test.mjs',
    args: ['--test', 'tests/archive-reviewed-projection-phase.test.mjs']
  },
  {
    label: 'tests/meta-foundation-geometry-issued-rows.test.mjs',
    args: ['--test', 'tests/meta-foundation-geometry-issued-rows.test.mjs']
  },
  {
    label: 'tests/archive-registration-writer.test.mjs',
    args: ['--test', 'tests/archive-registration-writer.test.mjs']
  },
  {
    label: 'tests/archive-registration-build-db.test.mjs',
    args: ['--test', 'tests/archive-registration-build-db.test.mjs']
  },
  {
    label: 'tests/archive-single-writer-workflows.test.mjs',
    args: ['--test', 'tests/archive-single-writer-workflows.test.mjs']
  },
  {
    label: 'tests/archive-pages-release-identity.test.mjs',
    args: ['--test', 'tests/archive-pages-release-identity.test.mjs']
  },
  {
    label: 'tests/archive2-preview-feedback.test.cjs',
    args: ['--test', 'tests/archive2-preview-feedback.test.cjs']
  },
  {
    label: 'tests/archive2-preview-stable.test.cjs',
    args: ['--test', 'tests/archive2-preview-stable.test.cjs']
  },
  {
    label: 'tests/archive2-output-memory-bridge.test.cjs',
    args: ['--test', 'tests/archive2-output-memory-bridge.test.cjs']
  },
  {
    label: 'tests/archive2-unit-envelope-handoff.test.cjs',
    args: ['--test', 'tests/archive2-unit-envelope-handoff.test.cjs']
  },
  {
    label: 'tests/archive2-original-source-route.test.cjs',
    args: ['--test', 'tests/archive2-original-source-route.test.cjs']
  },
  {
    label: 'tests/archive2-compose-performance.test.cjs',
    args: ['--test', 'tests/archive2-compose-performance.test.cjs']
  },
  {
    label: 'tests/archive2-output-transport.test.cjs',
    args: ['--test', 'tests/archive2-output-transport.test.cjs']
  },
  {
    label: 'tests/archive2-generated-mock-selection.test.cjs',
    args: ['--test', 'tests/archive2-generated-mock-selection.test.cjs']
  },
  {
    label: 'archive/tools/solution-calibration-gate.mjs syntax',
    args: ['--check', 'archive/tools/solution-calibration-gate.mjs']
  },
  {
    label: 'archive/tools/review-evidence-gate.mjs syntax',
    args: ['--check', 'archive/tools/review-evidence-gate.mjs']
  },
  {
    label: 'archive/tools/rebind-m2-create-golden-sample-evidence.test.mjs',
    args: ['--test', 'archive/tools/rebind-m2-create-golden-sample-evidence.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-one-shot-closeout.test.mjs',
    args: ['--test', 'archive/tools/gpt2-one-shot-closeout.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-connected-stdio-host.test.mjs',
    args: ['--test', 'archive/tools/gpt2-connected-stdio-host.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-cas-distributed-smoke.test.mjs',
    args: ['--test', 'archive/tools/gpt2-cas-distributed-smoke.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-library-coordinated-adapter.test.mjs',
    args: ['--test', 'archive/tools/gpt2-library-coordinated-adapter.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-github-cas-ledger.test.mjs',
    args: ['--test', 'archive/tools/gpt2-github-cas-ledger.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-files-tool-transport.test.mjs',
    args: ['--test', 'archive/tools/gpt2-files-tool-transport.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-connected-host-adapter.test.mjs',
    args: ['--test', 'archive/tools/gpt2-connected-host-adapter.test.mjs']
  },
  {
    label: 'archive/tools/review-evidence-gate.test.mjs',
    args: ['--test', 'archive/tools/review-evidence-gate.test.mjs']
  },
  {
    label: 'archive/tools/solution-calibration-gate.test.mjs',
    args: ['--test', 'archive/tools/solution-calibration-gate.test.mjs']
  },
  {
    label: 'archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs syntax',
    args: ['--check', 'archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/reviewed-apply-core.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/reviewed-apply-core.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/apply-reviewed-meta-patch.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/apply-reviewed-meta-patch.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs']
  },
  {
    label: 'tests/archive-pages-release-gate.test.mjs',
    args: ['--test', 'tests/archive-pages-release-gate.test.mjs']
  },
  {
    label: 'tests/apms-worker-deploy.test.mjs',
    args: ['--test', 'tests/apms-worker-deploy.test.mjs']
  },
  {
    label: 'tests/apms-exam-blueprint-examdata-sync.test.mjs',
    args: ['--test', 'tests/apms-exam-blueprint-examdata-sync.test.mjs']
  },
  {
    label: 'tests/archive-pages-image-r2-gate.test.mjs',
    args: ['--test', 'tests/archive-pages-image-r2-gate.test.mjs']
  },
  {
    label: 'tests/r2-archive-assets-copy-workflow.test.mjs',
    args: ['--test', 'tests/r2-archive-assets-copy-workflow.test.mjs']
  },
  {
    label: 'tests/archive-pages-release-reg-commit.test.mjs',
    args: ['--test', 'tests/archive-pages-release-reg-commit.test.mjs']
  },
  {
    label: 'tests/ci-signal-hygiene.test.mjs',
    args: ['--test', 'tests/ci-signal-hygiene.test.mjs']
  },
  {
    label: 'tests/ci-pr-run-cancel.test.mjs',
    args: ['--test', 'tests/ci-pr-run-cancel.test.mjs']
  },
  {
    label: 'tests/archive-ci-scope.test.mjs',
    args: ['--test', 'tests/archive-ci-scope.test.mjs']
  },
  {
    label: 'tests/archive-content-scope.test.mjs',
    args: ['--test', 'tests/archive-content-scope.test.mjs']
  },
  {
    label: 'tests/archive-progress-observer-bounded.test.mjs',
    args: ['--test', 'tests/archive-progress-observer-bounded.test.mjs']
  },
  {
    label: 'tests/archive-progress-observer.test.mjs',
    args: ['--test', 'tests/archive-progress-observer.test.mjs']
  },
  {
    label: 'tests/archive-progress-cache-targets.test.mjs',
    args: ['--test', 'tests/archive-progress-cache-targets.test.mjs']
  },
  {
    label: 'tests/archive-progress-realpaths.test.mjs',
    args: ['--test', 'tests/archive-progress-realpaths.test.mjs']
  },
  {
    label: 'tests/archive-progress-recovery.test.mjs',
    args: ['--test', 'tests/archive-progress-recovery.test.mjs']
  },
  {
    label: 'archive/tools/archive-progress-observer.test.mjs',
    args: ['--test', 'archive/tools/archive-progress-observer.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-apply-bridge.test.mjs',
    args: ['--test', 'tests/archive-reviewed-apply-bridge.test.mjs']
  },
  {
    label: 'tests/archive-question-metadata-format.test.mjs',
    args: ['--test', 'tests/archive-question-metadata-format.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-exam-registration-v2.test.mjs',
    args: ['--test', 'tests/archive-reviewed-exam-registration-v2.test.mjs'],
    timeout: 300000
  },
  {
    label: 'tests/archive-reviewed-retained-scope-transport.test.mjs',
    args: ['--test', 'tests/archive-reviewed-retained-scope-transport.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-native-parent.test.mjs',
    args: ['--test', 'tests/archive-reviewed-native-parent.test.mjs']
  },
  {
    label: 'tests/archive-native-replay-registry-context.test.mjs',
    args: ['--test', 'tests/archive-native-replay-registry-context.test.mjs']
  },
  {
    label: 'tests/archive-saved-papers-runtime.mjs',
    args: ['--test', 'tests/archive-saved-papers-runtime.mjs']
  },
  {
    label: 'archive/tools/geometry-equation/tests/verify-svg-coordinate-parity.test.mjs',
    args: ['--test', 'archive/tools/geometry-equation/tests/verify-svg-coordinate-parity.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-api.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-api.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-contract.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-contract.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-course-picker.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-course-picker.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase-api.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase-api.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase-migration.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase-migration.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase.test.mjs']
  },
  {
    label: 'tests/archive2-worker-validation.test.mjs (Grade/browse contracts)',
    args: [
      '--test',
      '--test-name-pattern',
      'grade-only canonical path filters pass mixed-question validation|Worker accepts an approved high2 source in the shared high3 semantic browse pool without rewriting its grade|shared browse grade cannot replace saved snapshot source grades at deployment|target-only grade validation accepts every supported class grade and preserves fail-closed fallbacks',
      'tests/archive2-worker-validation.test.mjs'
    ]
  },
  {
    label: 'tests/archive2-saved-paper-namespace.test.mjs',
    args: ['--test', 'tests/archive2-saved-paper-namespace.test.mjs']
  },
  {
    label: 'tests/archive2-assignment-handoff.test.cjs',
    args: ['--test', 'tests/archive2-assignment-handoff.test.cjs']
  },
  {
    label: 'tests/archive2-assignment-pdf-retry.test.cjs',
    args: ['--test', 'tests/archive2-assignment-pdf-retry.test.cjs']
  },
  {
    label: 'tests/archive2-home.test.cjs',
    args: ['--test', 'tests/archive2-home.test.cjs']
  },
  {
    label: 'tests/archive2-navigation.test.cjs',
    args: ['--test', 'tests/archive2-navigation.test.cjs']
  },
  {
    label: 'tests/archive2-similar.test.cjs',
    args: ['--test', 'tests/archive2-similar.test.cjs']
  },
  {
    label: 'tests/archive2-find-similar.test.cjs',
    args: ['--test', 'tests/archive2-find-similar.test.cjs']
  },
  {
    label: 'tests/archive2-finder-direct-output.test.cjs',
    args: ['--test', 'tests/archive2-finder-direct-output.test.cjs']
  },
  {
    label: 'tests/archive2-worker-runtime.mjs (workerd + D1)',
    args: ['tests/archive2-worker-runtime.mjs']
  },
  {
    label: 'tests/apms-result-clinic-uid-bridge.test.mjs',
    args: ['--test', 'tests/apms-result-clinic-uid-bridge.test.mjs']
  },
  {
    label: 'tests/apmath-omr-result-identity.test.mjs',
    args: ['--test', 'tests/apmath-omr-result-identity.test.mjs']
  },
  {
    label: 'tests/apms-clinic-uid-refresh.test.cjs',
    args: ['--test', 'tests/apms-clinic-uid-refresh.test.cjs']
  },
  {
    label: 'tests/archive2-ux-retrieval-d1.test.mjs',
    args: ['--test', 'tests/archive2-ux-retrieval-d1.test.mjs']
  },
  {
    label: 'tests/archive2-recent-friction-ui.test.cjs',
    args: ['--test', 'tests/archive2-recent-friction-ui.test.cjs']
  },
  {
    label: 'tests/archive2-school-history.test.cjs',
    args: ['--test', 'tests/archive2-school-history.test.cjs']
  },
  {
    label: 'tests/archive2-touch-targets.test.cjs',
    args: ['--test', 'tests/archive2-touch-targets.test.cjs']
  },
  {
    label: 'tests/archive2-core.test.cjs',
    args: ['--test', 'tests/archive2-core.test.cjs']
  },
  {
    label: 'tests/archive2-finder-filters.test.cjs',
    args: ['--test', 'tests/archive2-finder-filters.test.cjs']
  },
  {
    label: 'tests/item-4slot-data.test.cjs',
    args: ['tests/item-4slot-data.test.cjs']
  },
  { label: 'tests/item-4slot-index-format.test.cjs', args: ['--test', 'tests/item-4slot-index-format.test.cjs'] },
  {
    label: 'tests/archive2-canonical-projection.test.mjs',
    args: ['--test', 'tests/archive2-canonical-projection.test.mjs']
  },
  {
    label: 'tests/archive2-shards-builder.test.mjs',
    args: ['--test', 'tests/archive2-shards-builder.test.mjs']
  },
  {
    // The register workflow runs this only when a diff5 request is in the inbox; a PR that changes the tool needs it too.
    label: 'tests/archive-difficulty5-register.test.mjs',
    args: ['--test', 'tests/archive-difficulty5-register.test.mjs']
  },
  {
    // Single-model draft difficulty: ledger -> diff5 request converter and the lane's draft label; fixture-only.
    label: 'tests/archive-draft-difficulty.test.mjs',
    args: ['--test', 'tests/archive-draft-difficulty.test.mjs']
  },
  {
    // The register pass runs this only when a DIRECT_JUDGMENT (type-only) request is in the inbox; a PR that changes the lane needs it too.
    label: 'tests/archive-type-judgment-registration.test.mjs',
    args: ['--test', 'tests/archive-type-judgment-registration.test.mjs']
  },
  {
    // Converter from the carrier branch result tables to DIRECT_JUDGMENT requests; fixture-only, runs when the tool changes.
    label: 'tests/archive-type-direct-converter.test.mjs',
    args: ['--test', 'tests/archive-type-direct-converter.test.mjs']
  },
  {
    // Course-name alias data (spelling groups and 2015/2022 successor groups) used by the type-judgment lane and its converter.
    label: 'tests/archive-course-aliases.test.mjs',
    args: ['--test', 'tests/archive-course-aliases.test.mjs']
  },
  {
    // New PT/TPL keys generated from the dots bundle tables; fixture-only, deterministic key names.
    label: 'tests/archive-new-type-keys.test.mjs',
    args: ['--test', 'tests/archive-new-type-keys.test.mjs']
  },
  {
    label: 'tests/archive-difficulty5-missing-list.test.mjs',
    args: ['--test', 'tests/archive-difficulty5-missing-list.test.mjs']
  },
  {
    // The subunit group table (archive/data/archive2-subunit-groups.json) is rebuilt from the decisions in
    // archive/data/meta-os/subunit-group-rules.json; a stale table, a key in two groups or a missing key fails here.
    label: 'tests/meta-os-subunit-groups.test.mjs',
    args: ['--test', 'tests/meta-os-subunit-groups.test.mjs']
  },
  {
    // Meta OS dictionaries are self-consistent and the read-only audit runs on the real data (no operating counts pinned).
    label: 'tests/meta-os-audit.test.mjs',
    args: ['--test', 'tests/meta-os-audit.test.mjs']
  },
  {
    label: 'tests/archive2-original-source-verification-shard.test.mjs',
    args: ['--test', 'tests/archive2-original-source-verification-shard.test.mjs']
  },
  {
    label: 'tests/generated-source-svg-namespace.test.cjs',
    args: ['--test', 'tests/generated-source-svg-namespace.test.cjs']
  },
  {
    label: 'apmath/playground/next/tools/catalog.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/catalog.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/apl-overview.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/apl-overview.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/alg-final-geometry.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/alg-final-geometry.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/hub-no-legacy.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/hub-no-legacy.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/alg-sequence-plus.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/alg-sequence-plus.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/polyhedra-names.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/polyhedra-names.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/cube-section.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/cube-section.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/polyhedra-dual.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/polyhedra-dual.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/video.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/video.test.mjs']
  },
  {
    label: 'apmath/playground/next/tools/label-sweep.test.mjs',
    args: ['--test', 'apmath/playground/next/tools/label-sweep.test.mjs']
  },
  {
    label: 'tests/archive-basic-scope-rebind.test.mjs',
    args: ['--test', 'tests/archive-basic-scope-rebind.test.mjs']
  },
  {
    label: 'tests/archive-source-metadata-materializer.test.mjs',
    args: ['--test', 'tests/archive-source-metadata-materializer.test.mjs']
  },
  {
    label: 'tests/archive-reviewed-source-candidate.test.mjs',
    args: ['--test', 'tests/archive-reviewed-source-candidate.test.mjs']
  },
  {
    label: 'tests/archive-m3-e052-q5-original-diagram-transport.test.mjs',
    // Bound the immutable Git fixture like the neighboring SVG7 contract.
    args: ['--max-old-space-size=256', 'tests/archive-m3-e052-q5-original-diagram-transport.test.mjs'],
    timeout: 240000
  },
  {
    label: 'tests/archive-m3-e052-q5-complete-given.test.mjs',
    // Exact public Git evidence and source views; no global data generation.
    args: ['--max-old-space-size=384', 'tests/archive-m3-e052-q5-complete-given.test.mjs'],
    timeout: 180000
  },
  {
    label: 'tests/edition-ledger.test.mjs',
    args: ['--test', 'tests/edition-ledger.test.mjs']
  },
  {
    label: 'tests/recapture-approved-renders.test.mjs',
    args: ['--test', 'tests/recapture-approved-renders.test.mjs']
  }
];

// The collection is exported so tests/test-inventory.test.js can prove every test
// file is either run here, run by another job, or listed (with a reason) as not run.
// Order and membership are exactly what the runner used inline before.
function collectTests({ includeQuarantined = process.env.APMATH_RUN_QUARANTINE === '1' } = {}) {
  const files = fs.readdirSync(testsDir)
    .filter(name => name.endsWith('.test.js'))
    .sort();
  const tests = includeQuarantined
    ? files
    : files.filter(name => !quarantined.has(name));
  return { includeQuarantined, files, tests, quarantined, requiredCommands, jsTestTimeout };
}

async function main() {
const argv = process.argv.slice(2);
// Options: --ci-scope <plan>  (scoped execution, see tools/ci/run-scoped-tests.mjs)
//          --shard <i>/<n>    (run only the i-th of n deterministic shares; see tools/ci/test-shard.cjs)
const usage = 'usage: run-tests.js [--ci-scope <plan>] [--shard <index>/<total>]';
let scopeFile = null;
let shard = null;
for (let i = 0; i < argv.length; i += 2) {
  if (argv[i] === '--ci-scope' && argv[i + 1] && !scopeFile) scopeFile = argv[i + 1];
  else if (argv[i] === '--shard' && argv[i + 1] && !shard) shard = require('./ci/test-shard.cjs').parseShardArg(argv[i + 1]);
  else throw new Error(usage);
}
const args = scopeFile ? ['--ci-scope', scopeFile] : [];
const shardLabel = shard ? ` [shard ${shard.index}/${shard.total}]` : '';
const { tests, includeQuarantined } = collectTests();
// A CI shard writes its counts (and per-test durations, the input of tools/ci/test-durations.json) here for the
// aggregate `test` job. Without --shard nothing changes.
const writeShardResult = summary => {
  const file = process.env.ARCHIVE_TEST_SHARD_RESULT;
  if (!shard || !file) return;
  fs.writeFileSync(file, JSON.stringify({ schema: 'archive-test-shard-result-v1', shard: shard.index, of: shard.total, ...summary }, null, 1) + '\n');
};

// Reuse only a proof produced in this exact CI runner after its native projection
// stabilized. A remote proof alone cannot supply local generated bytes.
let localRegistrationPrepared = false;
const registrationProofFile = process.env.ARCHIVE_PR_REGISTRATION_PROOF;
if (registrationProofFile) {
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') throw new Error('Registration proof is restricted to its PR event');
  const proof = JSON.parse(fs.readFileSync(registrationProofFile, 'utf8'));
  if (proof.preparation?.state === 'PREPARED') {
    const { validateLocalRegistrationProof } = await import('./ci/archive-pr-registration-proof.mjs');
    const result = validateLocalRegistrationProof({ root, proof,
      event: JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')),
      expectedSha: process.env.GITHUB_SHA, repo: process.env.GITHUB_REPOSITORY,
      runId: Number(process.env.GITHUB_RUN_ID), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
    });
    if (result.catalogAndPackagePrepared !== true) throw new Error('Registration proof cannot authorize catalog reuse');
    localRegistrationPrepared = true;
    console.log(`REGISTRATION_PREPARATION_REUSED: exact local input/checker/output bytes for ${result.checkoutSha}`);
  } else if (proof.preparation?.state !== 'NO_OP' || proof.status !== 'PASS') {
    throw new Error('Invalid registration preparation proof');
  }
}

if (args.length) {
  const { runScopedTests } = await import('./ci/run-scoped-tests.mjs');
  // Use this same registry for scoped execution. Preserve P2/P3 additions,
  // existing test-name filters, timeouts and quarantine policy verbatim.
  const availableCommands = [
    ...tests.map(file => ({ label: `tests/${file}`, args: [`tests/${file}`],
      timeout: jsTestTimeout(file) })),
    ...requiredCommands.map(command => ({ ...command, timeout: command.timeout ?? 60000 })),
  ];
  const onResult = summary => writeShardResult({ mode: 'scoped', ...summary });
  if (runScopedTests({ root, scopeFile: args[1], availableCommands, shard, onResult })) return;
}

// The pre-step below regenerates the catalog and its runtime readiness receipt
// together. While the post-merge registration bot commit is pending they are
// stale, so a run used to
// leave a dirty tree. The guard puts back ONLY these pre-step outputs, and only
// when they were clean before the run and nobody changed them since the
// pre-step wrote them; anything else is merely reported (see
// tools/lib/test-output-guard.js). The build tool exports no path list, so the
// catalog paths it writes are listed here explicitly; keep in sync with its
// fs.writeFileSync targets. The readiness writer's exact outputs are shared
// with its preparation helper. APMATH_KEEP_TEST_OUTPUT=1 turns the guard off.
const { createOutputGuard } = require('./lib/test-output-guard.js');
const { prepareArchiveTestProjection, READINESS_OUTPUT_FILES } = require('./lib/archive-test-projection.js');
const outputGuard = createOutputGuard({
  root,
  outputFiles: [
    'archive/data/archive2-canonical-input-manifest.json',
    'archive/data/archive2-canonical-input-manifest.compact.json',
    'archive/data/archive2-catalog.json',
    'archive/data/archive2-item-review-overrides.json',
    'archive/data/archive2-source-verification-index.json',
    'archive/data/archive2-source-verification-index-v2.json',
    ...READINESS_OUTPUT_FILES
  ],
  outputPrefixes: ['archive/data/archive2-source-verification/'],
  keep: process.env.APMATH_KEEP_TEST_OUTPUT === '1'
});
outputGuard.begin();
process.on('exit', () => outputGuard.finish());
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

// Source-verification tests exercise generated canonical artifacts. Build them
// from the checked-out source tree so code-only pull requests do not depend on
// already-committed shard outputs.
try {
  if (!localRegistrationPrepared) prepareArchiveTestProjection({ root });
} finally {
  // A failed generator may also have written an output. Snapshot those bytes
  // so the guard can restore only our untouched changes on either exit path.
  outputGuard.afterPrestep();
}

const fullPlan = [
  ...tests.map(file => ({
    failedName: file,
    shownName: path.join('tests', file),
    args: [path.join('tests', file)],
    // Full canonical Compose inventory now covers all grades and runtime packs.
    timeout: jsTestTimeout(file),
    files: [`tests/${file}`],
    quarantined: quarantined.has(file)
  })),
  ...requiredCommands.map(command => ({
    failedName: command.label,
    shownName: command.label,
    args: command.args,
    timeout: command.timeout ?? 60000,
    files: command.args.includes('--check') ? [] : command.args.filter(arg => /\.(?:js|mjs|cjs)$/.test(arg)),
    quarantined: false
  }))
];
// With --shard only this share runs; the shares are disjoint and together cover fullPlan exactly.
const plan = shard ? require('./ci/test-shard.cjs').selectShard(fullPlan.map(item => ({ ...item, name: item.failedName })), shard) : fullPlan;
if (shard) console.log(`Shard ${shard.index}/${shard.total}: ${plan.length} of ${fullPlan.length} test commands.`);
const { passed, failed, knownFailed, fixedKnown, durationsMs } = runPlan({ root, plan });

if (!includeQuarantined && quarantined.size > 0) {
  console.log(`${quarantined.size} quarantined test file(s) skipped; set APMATH_RUN_QUARANTINE=1 to include them`);
}

console.log(`PASS ${passed} / FAIL ${failed.length} / QUARANTINED-FAIL ${knownFailed.length} (total ${plan.length})${shardLabel}`);
writeShardResult({ mode: 'full', passed, failed, knownFailed, fixedKnown, total: plan.length, fullTotal: fullPlan.length, durationsMs });

if (failed.length > 0) {
  console.error('\nBlocking failures:');
  for (const file of failed) console.error(`  FAIL ${file}`);
}

if (knownFailed.length > 0) {
  console.log('\nKnown failures (non-blocking quarantine):');
  for (const file of knownFailed) {
    console.log(`  KNOWN ${file} - ${quarantined.get(file)}`);
  }
}

if (fixedKnown.length > 0) {
  console.log('\nQuarantined tests now passing; consider removing them from the quarantine list:');
  for (const file of fixedKnown) {
    console.log(`  FIXED ${file}`);
  }
}

if (failed.length > 0) {
  console.error(`${failed.length} test file(s) failed`);
  process.exit(1);
}
}
module.exports = { collectTests, quarantined, requiredCommands, jsTestTimeout };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
