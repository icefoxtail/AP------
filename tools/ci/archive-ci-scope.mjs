#!/usr/bin/env node
// This is an execution plan, not a cached test verdict. Unknown dependencies retain
// the existing suite. No mutable branch name participates in the comparison.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadSource, questionAssetReferences, localAssetPath } from '../../archive/tools/archive-content-inputs.mjs';

const SHA = /^[a-f0-9]{40}$/i;
const ORIGINAL = /^archive\/exams\/original\/.+\.js$/;
const IMAGE = /^archive\/assets\/images\/.+\.(?:svg|png|jpe?g|webp|gif)$/i;
const PLAYGROUND = /^apmath\/playground\//;
const SOURCE = /^archive\/(?:exams|generated|textbook)\/.*\.js$/;
const CONTENT_BROWSER_DEPENDENCIES = new Set([
  'tests/archive-original-exam-access.browser.cjs', 'tools/check-archive-content-browser.mjs',
  'tools/ci/archive-ci-scope.mjs', 'archive/tools/archive-content-inputs.mjs',
  '.github/workflows/archive2-runtime-guard.yml',
]);

// Deliberately closed path sets. New taxonomy domains, shared/js, Worker code,
// evidence-authority roots, arbitrary tools/tests and mixed content+code changes
// retain full coverage until their consumers have been mapped. These names are
// inputs, not a second test registry; run-tests.js supplies its real commands.
export const TECHNICAL_INPUTS = Object.freeze({
  metadata: Object.freeze([
    'archive/data/question_metadata.json', 'archive/data/question_identity_map.json',
    'archive/data/archive2-catalog.json', 'archive/data/archive2-canonical-input-manifest.json',
    'archive/data/archive2-canonical-projection-policy.json', 'archive/data/archive2-item-review-overrides.json',
    'archive/data/archive2-source-verification-index.json', 'archive/data/basic-scope-source-links.json',
    'archive/data/basic-scope-parent-groups.json', 'archive/data/basic-scope-parent-links.json',
    'archive/data/textbook-source-manifest-v1.json', 'archive/data/item-4slot-index.json',
    'archive/data/archive2-extension-keys.json',
    ...['algebra-2022', 'derivative', 'exponents-logarithms', 'functions-graphs', 'geometry-equations',
      'geometry', 'h1-foundation', 'h1-original-source', 'integral-calculus', 'limit-continuity',
      'middle-geometry', 'middle1', 'middle2', 'middle3', 'probability-statistics', 'sets-propositions',
      'trigonometry'].map(name => `archive/data/meta-foundation/runtime/${name}-v1.json`),
    'archive/data/meta-foundation/runtime/runtime-bridge-receipt.json',
    'archive/db.js', 'archive/question-index.js', 'archive/question-identity.js',
  ]),
  output: Object.freeze([
    'archive/engine.html', 'archive/mixed_engine.html', 'archive/mathjax_render_loop.js',
    'archive/equal-slot-engine.js', 'archive/equal-slot-engine.css', 'archive/question-image-readiness.js',
    'archive/solution-render-executor.js', 'archive/exam-render-executor.js', 'archive/answer-render-executor.js',
    'archive/layout-materializer.js', 'archive/layout-authority.js', 'archive/render-authority.js',
    'archive/render-authority.css', 'archive/render-state-normalizer.js', 'archive/render-feedback.js',
    'archive/print_guard.js', 'archive/print-runtime.js', 'archive/print-contract.js',
    'archive/print_image_optimizer.js', 'archive/native_print.js', 'archive/archive2-output.js',
    'archive/archive2-output-contract.js', 'archive/archive2-pdf-readiness.js',
    'archive/output-metadata-loader.js', 'archive/common-fast-runtime.js',
    'archive/screen-runtime.js', 'archive/screen-runtime-adapter.js',
    'tools/check-archive2-runtime.cjs', 'tools/check-archive2-finder-filter-browser.cjs',
    'tools/check-archive-rpm-middle-browser.cjs',
    'tools/check-archive-content-browser.mjs', 'tests/archive-original-exam-access.browser.cjs',
    'tests/archive2-solution-loading-browser.cjs', 'tests/archive2-output-comparison-references.json',
    'tests/fixtures/archive2-output-browser-smoke.html', 'tests/fixtures/archive2-pdf-readiness-browser-smoke.html',
  ]),
  registration: Object.freeze([
    '.github/workflows/archive-main-auto-meta.yml',
    '.github/workflows/archive-reviewed-exam-meta-register.yml', '.github/workflows/archive-reviewed-apply.yml',
    '.github/workflows/archive-pages-release.yml', '.github/workflows/auto-register-approved-qid9.yml',
    'tools/ci/archive-registration-writer.mjs', 'tools/ci/archive-registration-whitespace.mjs', 'tools/ci/archive-main-auto-meta-pass.sh',
    'tools/ci/reviewed-meta-register-pass.sh', 'tools/ci/archive-four-slot-pass.sh',
    'tools/ci/archive-pages-registration-derive.sh', 'tools/ci/archive-pr-registration-prepare.mjs',
    'tools/ci/archive-pr-registration-proof.mjs',
    'tools/ci/archive-meta-register-commit.paths', 'tools/ci/archive-meta-register-trigger-paths.txt',
    'tools/ci/archive-pages-registration.paths', 'tools/ci/git-push-derived-with-retry.mjs',
    'tools/ci/archive-pages-deploy-needed.mjs', 'tools/ci/archive-pages-release-gate.mjs',
    'tools/ci/archive-pages-release-identity.mjs', 'tools/ci/archive-pages-image-r2-gate.mjs',
    'tools/ci/push-touches-paths.mjs', 'tools/ci/register-reviewed-meta-requests.mjs',
    'tools/ci/verify-registered-consumer-approval.sh',
    'archive/build_db.py', 'archive/tools/build-question-index.mjs',
    'archive/tools/build-archive2-catalog.mjs', 'archive/tools/build-basic-scope-parent-links.mjs',
    'archive/tools/build-archive2-crosswalk-inventory.mjs', 'archive/tools/build-archive2-extension-keys.mjs',
    'archive/tools/mixed-verification-codec.mjs', 'archive/tools/materialize-archive-package-shards.mjs',
    'archive/tools/intelligence/sync-question-identity-map-v1.mjs',
    'archive/tools/intelligence/sync-pending-question-metadata-v1.mjs',
    'archive/tools/intelligence/build-question-identity-runtime.mjs',
    'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
    'archive/tools/meta-foundation/sync-runtime-source-path-renames.mjs',
    'archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs',
    // These exact fixtures are in the production registration test selection.
    // A producer plus its own regression must retain the same bounded scope;
    // arbitrary tests and changes to the shared test runner still select full.
    'tests/archive-package-only.test.js', 'tests/archive-register-isolation.test.js',
    'tests/archive-registration-whitespace.test.mjs',
    'tests/git-push-derived-with-retry.test.mjs', 'tests/archive-pr-registration-proof.test.mjs',
    'tests/archive-pr-registration-prepare.test.mjs', 'tests/archive-main-merge-meta.test.mjs',
    'tests/archive-registration-writer.test.mjs', 'tests/archive-single-writer-workflows.test.mjs',
    'tests/archive-pages-release-identity.test.mjs', 'tests/archive-pages-release-gate.test.mjs',
    'tests/archive-pages-image-r2-gate.test.mjs', 'tests/archive-pages-release-reg-commit.test.mjs',
    'tests/archive-reviewed-apply-bridge.test.mjs', 'tests/archive2-registration-contracts.test.mjs',
    'tests/archive-register-trigger-paths.test.mjs',
  ]),
});
const INPUT_GROUP = new Map(Object.entries(TECHNICAL_INPUTS).flatMap(([group, files]) => files.map(file => [file, group])));

export function scopeChecks(scope) {
  const full = scope.mode === 'full';
  const groups = scope.groups || [];
  const technical = groups.length > 0;
  return {
    workerDependencies: full || technical,
    runtimeContract: full || groups.includes('output'),
    solutionBrowser: full || groups.includes('output'),
    // Metadata/search and direct-original Chrome retain their existing CI,
    // Shared Meta and Sync policies. The 50-solution job exercises common runtime.
    runtimeChrome: full || groups.includes('output'),
    prepareProjection: scope.mode === 'archive-content' || groups.includes('metadata') || groups.includes('output') ||
      (groups.includes('registration') && scope.changedFiles?.some(file => file.startsWith('archive/'))),
  };
}

export function git(root, args, allowNoMatch = false) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (result.error || (result.status !== 0 && !(allowNoMatch && result.status === 1))) {
    throw new Error(`git ${args[0]} failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return result.stdout;
}

export function classifyPaths(files, { exists = () => true, assetConsumers = () => null } = {}) {
  const conservative = reason => ({ mode: 'full', reason, groups: [], sources: [], assets: [] });
  if (!Array.isArray(files) || !files.length) return conservative('no proven bounded change set');
  if (files.every(file => PLAYGROUND.test(file))) {
    return { mode: 'playground', reason: 'only playground files changed; no Archive input or shared runtime dependency changed', groups: [], sources: [], assets: [] };
  }
  if (!files.every(file => ORIGINAL.test(file) || IMAGE.test(file))) {
    if (files.some(file => !INPUT_GROUP.has(file))) {
      return conservative('shared, mixed raw-content/code, or unclassified dependency changed');
    }
    if (files.some(file => !exists(file))) return conservative('deleted technical input requires existing inventory regression');
    const groups = [...new Set(files.map(file => INPUT_GROUP.get(file)))].sort();
    return { mode: groups.length === 1 ? `archive-${groups[0]}` : 'archive-technical', groups,
      reason: `only mapped Archive ${groups.join(', ')} inputs changed; use their technical and shared Consumer regressions`,
      sources: [], assets: [] };
  }
  if (files.some(file => !exists(file))) return conservative('deleted source or asset requires the existing inventory regression');
  const sources = new Set(files.filter(file => ORIGINAL.test(file)));
  const assets = files.filter(file => IMAGE.test(file));
  for (const asset of assets) {
    const consumers = assetConsumers(asset);
    if (!Array.isArray(consumers) || !consumers.length || consumers.some(file => !ORIGINAL.test(file))) {
      return conservative(`asset consumers are not proven original-only: ${asset}`);
    }
    consumers.forEach(file => sources.add(file));
  }
  if (!sources.size) return conservative('no affected original exam could be resolved');
  return { mode: 'archive-content', reason: 'only original exam JS and assets with original-only consumers changed', groups: [], sources: [...sources].sort(), assets: assets.sort() };
}

function consumersAtSnapshot(root, headSha, asset) {
  // Include both filename and folder references, including the common source
  // form that constructs filenames from ordinals. Resolve candidate data banks
  // before selecting a consumer, so unrelated exams with q01.svg are not checked.
  const matches = git(root, ['grep', '-I', '-l', '-z', '-F', '-e', path.posix.basename(asset),
    '-e', path.posix.basename(path.posix.dirname(asset)), headSha, '--',
    'archive', 'apmath', 'shared', 'eie'], true).split('\0').filter(Boolean).map(value => value.slice(headSha.length + 1));
  const candidates = matches.filter(file => SOURCE.test(file) ||
    (/\.(?:js|mjs|cjs|html|css)$/i.test(file) && !file.startsWith('archive/tools/') && file !== 'archive/db.js'));
  const consumers = [];
  for (const file of candidates) {
    if (!ORIGINAL.test(file)) return null;
    try {
      const { questions } = loadSource(root, file);
      if (questions.some(question => questionAssetReferences(question).some(ref => localAssetPath(ref) === asset))) consumers.push(file);
    } catch { return null; }
  }
  return consumers;
}

export function planCiScope({ root = process.cwd(), eventName = '', event = null, expectedSha = '', baseSha: suppliedBase = '' } = {}) {
  const headSha = git(root, ['rev-parse', '--verify', 'HEAD']).trim();
  if (!SHA.test(headSha)) throw new Error('checkout must identify an exact commit');
  if (expectedSha && (!SHA.test(expectedSha) || expectedSha.toLowerCase() !== headSha.toLowerCase())) {
    throw new Error('scope checkout does not match the expected event snapshot');
  }
  let baseSha = suppliedBase;
  if (eventName === 'pull_request') {
    baseSha = event?.pull_request?.base?.sha;
    const prHead = event?.pull_request?.head?.sha;
    if (!SHA.test(baseSha || '') || !SHA.test(prHead || '')) throw new Error('PR scope requires exact event base and head SHAs');
    git(root, ['merge-base', '--is-ancestor', baseSha, headSha]);
    git(root, ['merge-base', '--is-ancestor', prHead, headSha]);
  } else if (eventName === 'push') baseSha = event?.before;
  const common = { schemaVersion: 'archive-ci-scope-v2', headSha, baseSha: baseSha || '', eventName };
  const finish = result => ({ ...result, checks: scopeChecks(result) });
  if (!SHA.test(baseSha || '') || /^0+$/.test(baseSha)) {
    return finish({ ...common, changedFiles: null, scopedBrowserChanged: true, ...classifyPaths(null) });
  }
  let changedFiles;
  try { changedFiles = git(root, ['diff', '--name-only', '--no-renames', '-z', baseSha, headSha, '--']).split('\0').filter(Boolean).sort(); }
  catch (error) {
    if (eventName === 'pull_request') throw error;
    return finish({ ...common, changedFiles: null, scopedBrowserChanged: true, ...classifyPaths(null) });
  }
  const classification = classifyPaths(changedFiles, {
    exists: file => fs.existsSync(path.join(root, file)),
    assetConsumers: asset => consumersAtSnapshot(root, headSha, asset),
  });
  return finish({ ...common, changedFiles, scopedBrowserChanged: changedFiles.some(file => CONTENT_BROWSER_DEPENDENCIES.has(file)), ...classification });
}

export function readScope(file, root = process.cwd()) {
  const recorded = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (recorded.schemaVersion !== 'archive-ci-scope-v2') throw new Error('unsupported CI scope plan');
  const current = planCiScope({ root, expectedSha: recorded.headSha, baseSha: recorded.baseSha });
  for (const key of ['baseSha', 'headSha', 'changedFiles', 'mode', 'groups', 'sources', 'assets', 'scopedBrowserChanged', 'checks']) {
    if (JSON.stringify(recorded[key]) !== JSON.stringify(current[key])) throw new Error(`CI scope no longer matches snapshot: ${key}`);
  }
  return recorded;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--output') throw new Error('usage: archive-ci-scope.mjs --output <runner-temp-file>');
  const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : null;
  const result = planCiScope({ eventName: process.env.GITHUB_EVENT_NAME, event,
    expectedSha: process.env.CI_CHECKOUT_SHA || process.env.GITHUB_SHA, baseSha: process.env.CI_SCOPE_BASE_SHA });
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(args[1], `${JSON.stringify(result, null, 2)}\n`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `mode=${result.mode}\nscoped_browser_changed=${result.scopedBrowserChanged}\n` +
    `worker_dependencies=${result.checks.workerDependencies}\nruntime_contract=${result.checks.runtimeContract}\n` +
    `solution_browser=${result.checks.solutionBrowser}\nruntime_chrome=${result.checks.runtimeChrome}\n` +
    `prepare_projection=${result.checks.prepareProjection}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `### CI impact scope\n\nSnapshot \`${result.headSha}\`; base \`${result.baseSha || 'unavailable'}\`.\n\n` +
    `Selected **${result.mode}**: ${result.reason}. This selects checks; it is not a PASS for excluded areas.\n`);
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
