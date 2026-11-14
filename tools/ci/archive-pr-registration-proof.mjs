#!/usr/bin/env node
// The CI runner's data-only registration verdict, reused by run-tests on the same
// runner. This does not certify Chrome or modify a remote ref.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { preparePrRegistration } from './archive-pr-registration-prepare.mjs';
import { loadPatterns } from './push-touches-paths.mjs';
import { NATIVE_PREVIEW_HELPER, selectNativeRequests, emptyNativePreview, verifyNativeRequests,
  nativeOutputManifest, validateNativePreview } from './archive-pr-native-preview.mjs';

export const PROOF_SCHEMA = 'archive-pr-registration-proof/v2';
export const PROOF_FILE_NAME = 'proof.json';
export const CI_WORKFLOW_PATH = '.github/workflows/ci.yml';
export const REGISTRATION_CHECKS = Object.freeze([
  ['identity-contract', 'tests/archive-question-identity-contract.test.mjs'],
  ['identity-runtime', 'tests/archive-question-identity-runtime.test.mjs'],
  ['jeil-registration', 'tests/jeil-legacy-similar-22-registration.test.cjs'],
  ['palma-registration', 'tests/palma-legacy-similar-23-registration.test.cjs'],
  ['registration-parity', 'archive/tools/verify-archive-registration.mjs'],
].map(([id, file]) => Object.freeze({ id, file })));

const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const ALLOWLIST = 'tools/ci/archive-pages-registration.paths';
const MIXED = 'archive/data/archive2-source-verification/mixed-v1/';
const CATALOG_MANIFEST = 'archive/data/archive2-canonical-input-manifest.json';
const CHECKER_FILES = new Set([
  ...REGISTRATION_CHECKS.map(check => check.file),
  'archive/build_db.py', CI_WORKFLOW_PATH,
  'tools/ci/archive-pr-registration-prepare.mjs',
  'tools/ci/archive-pr-registration-proof.mjs',
  NATIVE_PREVIEW_HELPER,
  'tools/ci/push-touches-paths.mjs', ALLOWLIST,
  'tools/ci/archive-ci-scope.mjs', 'tools/ci/run-scoped-tests.mjs',
  'tools/run-tests.js', 'tests/archive-pr-registration-prepare.test.mjs',
  'tests/archive-pr-registration-proof.test.mjs',
  'tests/archive-pr-native-preview.test.mjs',
]);
const REQUIRED_FILES = [...REGISTRATION_CHECKS.map(check => check.file), ALLOWLIST,
  'archive/build_db.py', 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
  'archive/tools/build-archive2-catalog.mjs',
  'tools/ci/archive-pr-registration-prepare.mjs', 'tools/ci/archive-pr-registration-proof.mjs',
  NATIVE_PREVIEW_HELPER,
  'tools/ci/push-touches-paths.mjs', CI_WORKFLOW_PATH];
const DIAGNOSTIC_FILES = new Set([
  'tests/archive-meta-v2-materializer.test.mjs',
  'tests/archive2-meta-v2-semantic-authority.test.cjs',
  'tests/archive-original-search-exposure.browser.cjs',
  'tests/archive-original-exam-access.browser.cjs',
]);
const hash = value => createHash('sha256').update(value).digest('hex');
const positiveInteger = value => Number.isSafeInteger(value) && value > 0;

function command(program, args, root, inherit = false) {
  const result = spawnSync(program, args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    timeout: 12 * 60 * 1000, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'] });
  if (result.error || result.status !== 0) throw Error(`REGISTRATION_COMMAND_FAILED:${program}:${args[0]}:${result.status ?? result.signal}`);
  return result.stdout || '';
}
const git = (root, ...args) => command('git', args, root);

function treeRows(root) {
  return git(root, 'ls-tree', '-r', '-z', '--full-tree', 'HEAD').split('\0').filter(Boolean).map(line => {
    const tab = line.indexOf('\t'), [mode, type, oid] = line.slice(0, tab).split(' ');
    const file = line.slice(tab + 1);
    if (tab < 0 || !SHA.test(oid) || (type !== 'blob' && (isInput(file) || isChecker(file)))) throw Error('UNSUPPORTED_REGISTRATION_GIT_ENTRY');
    return type === 'blob' ? { path: file, mode, oid } : null;
  }).filter(Boolean).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

function isChecker(file) {
  return CHECKER_FILES.has(file) || file.startsWith('archive/tools/') || file.startsWith('tools/lib/')
    || ['.gitignore', '.gitattributes'].includes(path.posix.basename(file));
}
function isInput(file) {
  // These native producers traverse Archive inventories and canonical authority.
  // Keep their uncertain Archive/shared dependencies conservative; unrelated main
  // commits are not themselves an input and no moving branch ref is consulted.
  return ['archive/', '.archive-meta-register/inbox/', 'shared/', 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/',
    'docs/rules/01_CANONICAL/taxonomy/'].some(prefix => file.startsWith(prefix));
}

// The CI producer serves the registration inputs plus the actual data/checker
// dependencies it binds. A different project's files do not request an Archive
// projection. Unknown/malformed scope never authorizes skipping this path.
export function prRegistrationProofNeeded(changedFiles) {
  if (!Array.isArray(changedFiles)) return true;
  return changedFiles.some(file => {
    if (typeof file !== 'string' || !file || /[\\\r\n\0]/.test(file)
        || file.startsWith('/') || file.split('/').some(part => !part || part === '.' || part === '..')) return true;
    const normalized = file.normalize('NFC');
    // A nested ignore/attributes file governs its own subtree, so a playground
    // rule cannot change the Archive inventory despite the conservative digest.
    const localRule = ['.gitignore', '.gitattributes'].includes(path.posix.basename(normalized));
    const checker = isChecker(normalized) && (!localRule || !normalized.includes('/')
      || isInput(normalized) || normalized.startsWith('tools/lib/'));
    return isInput(normalized) || checker || DIAGNOSTIC_FILES.has(normalized);
  });
}

export function registrationProofFingerprints(root = process.cwd(), nativeRequests = []) {
  const rows = treeRows(root), present = new Set(rows.map(row => row.path));
  if (REQUIRED_FILES.some(file => !present.has(file))) throw Error('REGISTRATION_PROOF_DEPENDENCY_MISSING');
  const nativeInputs = new Set(nativeRequests.flatMap(r => [r.path, r.source.path, ...r.evidence.map(e => e.path)]));
  const inputs = rows.filter(row => (isInput(row.path) || nativeInputs.has(row.path)) && !isChecker(row.path));
  const checkers = rows.filter(row => isChecker(row.path));
  return { inputDigest: hash(JSON.stringify(inputs)), checkerDigest: hash(JSON.stringify(checkers)),
    inputFileCount: inputs.length, checkerFileCount: checkers.length, nativeInputDigest: hash(JSON.stringify(nativeRequests)) };
}

export function registrationProofContext({ root = process.cwd(), event, expectedSha, repo }) {
  const pr = event?.pull_request, repository = repo || event?.repository?.full_name;
  const context = { repository, repositoryId: event?.repository?.id,
    pullRequest: event?.number ?? pr?.number, baseSha: pr?.base?.sha, headSha: pr?.head?.sha,
    headRepositoryId: pr?.head?.repo?.id, checkoutSha: expectedSha };
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '')
      || event?.repository?.full_name !== repository
      || !positiveInteger(context.repositoryId) || !positiveInteger(context.headRepositoryId)
      || !positiveInteger(context.pullRequest)
      || [context.baseSha, context.headSha, expectedSha].some(sha => !SHA.test(sha || ''))
      || (pr?.base?.repo?.id !== undefined && pr.base.repo.id !== context.repositoryId)) {
    throw Error('EXACT_PR_REGISTRATION_CONTEXT_REQUIRED');
  }
  if (git(root, 'rev-parse', 'HEAD').trim() !== expectedSha) throw Error('REGISTRATION_CHECKOUT_MISMATCH');
  git(root, 'merge-base', '--is-ancestor', context.baseSha, expectedSha);
  git(root, 'merge-base', '--is-ancestor', context.headSha, expectedSha);
  return context;
}

function changedPaths(root) {
  return [...new Set([...git(root, 'diff', '--name-only', '-z', 'HEAD', '--').split('\0'),
    ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0')].filter(Boolean))].sort();
}

function guardSnapshot(root, checkoutSha, allowGenerated, nativePaths = []) {
  if (git(root, 'rev-parse', 'HEAD').trim() !== checkoutSha) throw Error('REGISTRATION_HEAD_CHANGED');
  const changed = changedPaths(root);
  const allowed = allowGenerated ? loadPatterns(path.join(root, ALLOWLIST)) : [];
  if (changed.some(file => !(allowGenerated && nativePaths.includes(file)) && !allowed.some(pattern => pattern.test(file.normalize('NFC'))))) {
    throw Error(allowGenerated ? 'NON_DERIVED_REGISTRATION_MUTATION' : 'CLEAN_REGISTRATION_CHECKOUT_REQUIRED');
  }
  // A clean git status alone misses ignored JS/JSON which the native inventory
  // walkers can load. Only the declared generated package shards may be absent
  // from the fixed Git tree; node_modules outside these inputs is irrelevant.
  const ignored = git(root, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z', '--',
    'archive', 'shared', 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION', 'docs/rules/01_CANONICAL/taxonomy').split('\0').filter(Boolean);
  if (ignored.some(file => !allowGenerated || !(allowed.some(pattern => pattern.test(file.normalize('NFC')))
      || (file.startsWith(MIXED) && file.endsWith('.json'))))) throw Error('UNREGISTERED_IGNORED_REGISTRATION_INPUT');
  return changed;
}

function regularFile(root, relative) {
  const parts = relative.split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) throw Error('REGISTRATION_OUTPUT_PATH_INVALID');
  let current = root;
  for (const part of parts) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    if (stat.isSymbolicLink()) throw Error('REGISTRATION_OUTPUT_SYMLINK_FORBIDDEN');
  }
  const stat = fs.statSync(current);
  if (!stat.isFile()) throw Error('REGISTRATION_OUTPUT_NOT_FILE');
  const bytes = fs.readFileSync(current);
  return { path: relative, mode: stat.mode & 0o111 ? '100755' : '100644', bytes: bytes.length, sha256: hash(bytes) };
}

function outputInventory(root, nativePaths = []) {
  const allowed = loadPatterns(path.join(root, ALLOWLIST));
  const candidates = [...treeRows(root).map(row => row.path),
    ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
    ...git(root, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z', '--', 'archive').split('\0')];
  const paths = [...new Set(candidates.filter(file => file &&
    (nativePaths.includes(file) || allowed.some(pattern => pattern.test(file.normalize('NFC'))) || (file.startsWith(MIXED) && file.endsWith('.json')))))].sort();
  const records = paths.map(file => regularFile(root, file) || { path: file, deleted: true });
  return { digest: hash(JSON.stringify(records)), fileCount: records.filter(record => !record.deleted).length,
    byteCount: records.reduce((sum, record) => sum + (record.bytes || 0), 0) };
}

function catalogManifestCurrent(root) {
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(path.join(root, CATALOG_MANIFEST), 'utf8')); }
  catch { throw Error('REGISTRATION_CATALOG_MANIFEST_UNAVAILABLE'); }
  if (manifest?.schemaVersion !== 'archive2-canonical-input-manifest-v1'
      || !Array.isArray(manifest.files) || !manifest.files.length) throw Error('REGISTRATION_CATALOG_MANIFEST_INVALID');
  const seen = new Set(); let current = true;
  for (const row of manifest.files) {
    // Manifest paths are relative to archive/ and may legitimately step out of it (../docs/...),
    // but the normalized target must stay inside the repository.
    if (typeof row?.path !== 'string' || !row.path || row.path.includes('\\') || row.path.startsWith('/')
        || row.path.split('/').some(part => !part || part === '.')) throw Error('REGISTRATION_CATALOG_MANIFEST_INVALID');
    const file = path.posix.normalize(`archive/${row.path}`);
    if (file === '..' || file.startsWith('../') || !DIGEST.test(row.sha256 || '')
        || seen.has(row.path)) throw Error('REGISTRATION_CATALOG_MANIFEST_INVALID');
    seen.add(row.path);
    // Match the official catalog manifest's normalized-text hash contract.
    if (!regularFile(root, file)) throw Error('REGISTRATION_CATALOG_INPUT_MISSING');
    const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    if (hash(text) !== row.sha256) current = false;
  }
  return current;
}

function keys(object, expected) {
  if (!object || typeof object !== 'object' || Array.isArray(object)
      || Object.keys(object).sort().join('\0') !== [...expected].sort().join('\0')) throw Error('REGISTRATION_PROOF_SCHEMA_INVALID');
}

function validateProof(proof, context, fingerprints) {
  keys(proof, ['schemaVersion', 'scope', 'status', 'context', 'producer', 'inputs', 'preparation', 'checks', 'outputs', 'nativePreview']);
  if (proof.schemaVersion !== PROOF_SCHEMA || proof.scope !== 'registration-data-only' || proof.status !== 'PASS') throw Error('REGISTRATION_PROOF_NOT_PASS');
  keys(proof.context, Object.keys(context));
  if (Object.entries(context).some(([key, value]) => proof.context[key] !== value)) throw Error('REGISTRATION_PROOF_CONTEXT_MISMATCH');
  keys(proof.inputs, Object.keys(fingerprints));
  if (Object.entries(fingerprints).some(([key, value]) => proof.inputs[key] !== value)) throw Error('REGISTRATION_PROOF_INPUT_OR_CHECKER_MISMATCH');
  keys(proof.producer, ['workflowPath', 'jobName', 'runId', 'runAttempt']);
  if (proof.producer.workflowPath !== CI_WORKFLOW_PATH || proof.producer.jobName !== 'test'
      || !positiveInteger(proof.producer.runId) || !positiveInteger(proof.producer.runAttempt)) throw Error('REGISTRATION_PROOF_PRODUCER_INVALID');
  keys(proof.preparation, ['state', 'generatedPathCount', 'catalogStabilized']);
  if (!['PREPARED', 'NO_OP'].includes(proof.preparation.state)
      || !Number.isSafeInteger(proof.preparation.generatedPathCount) || proof.preparation.generatedPathCount < 0
      || typeof proof.preparation.catalogStabilized !== 'boolean') throw Error('REGISTRATION_PROOF_PREPARATION_INVALID');
  const checks = [...REGISTRATION_CHECKS.map(check => ({ id: check.id, outcome: 'success' })),
    { id: 'diff-whitespace', outcome: 'success' }, { id: 'derived-scope', outcome: 'success' }];
  if (JSON.stringify(proof.checks) !== JSON.stringify(checks)) throw Error('REGISTRATION_PROOF_CHECKS_INCOMPLETE');
  keys(proof.outputs, ['digest', 'fileCount', 'byteCount']);
  if (!DIGEST.test(proof.outputs.digest || '') || !positiveInteger(proof.outputs.fileCount)
      || !Number.isSafeInteger(proof.outputs.byteCount) || proof.outputs.byteCount < 0) throw Error('REGISTRATION_PROOF_OUTPUT_INVALID');
  return proof;
}

export function producePrRegistrationProof({ root = process.cwd(), event, expectedSha, repo,
  runId, runAttempt, run = command } = {}) {
  const context = registrationProofContext({ root, event, expectedSha, repo });
  if (!positiveInteger(runId) || !positiveInteger(runAttempt)) throw Error('CI_RUN_AND_ATTEMPT_REQUIRED');
  guardSnapshot(root, expectedSha, false);
  const nativeRequests = selectNativeRequests({ root, baseSha: context.baseSha, headSha: context.checkoutSha });
  const inputs = registrationProofFingerprints(root, nativeRequests);
  const prepared = preparePrRegistration({ root, eventName: 'pull_request', event, expectedSha, run });
  const nativePreview = prepared.nativePreview || emptyNativePreview();
  if (JSON.stringify(nativePreview.requests) !== JSON.stringify(nativeRequests)) throw Error('NATIVE_PREPARATION_INPUT_MISMATCH');
  const nativePaths = [...new Set(nativePreview.plans.flatMap(plan => plan.plannedPaths))].sort();
  guardSnapshot(root, expectedSha, true, nativePaths);
  let catalogStabilized = false;
  if (prepared.state === 'PREPARED' && !catalogManifestCurrent(root)) {
    // build_db validates its final catalog, then refreshes runtime readiness.
    // When that last write changes a manifest input, the old CI catalog pre-step
    // was necessary stabilization. Retain it only for that actual byte change.
    run(process.execPath, ['archive/tools/build-archive2-catalog.mjs'], root, true);
    guardSnapshot(root, expectedSha, true, nativePaths);
    if (!catalogManifestCurrent(root)) throw Error('REGISTRATION_CATALOG_DID_NOT_STABILIZE');
    catalogStabilized = true;
  }
  nativePreview.checks = verifyNativeRequests({ root, requests: nativeRequests, run });
  nativePreview.outputs = nativeOutputManifest(root, nativePreview.plans);
  const outputs = outputInventory(root, nativePaths), checks = [];
  for (const { id, file } of REGISTRATION_CHECKS) {
    run(process.execPath, [file], root, true);
    checks.push({ id, outcome: 'success' });
  }
  run('git', ['diff', '--check', 'HEAD', '--'], root);
  checks.push({ id: 'diff-whitespace', outcome: 'success' });
  const generated = guardSnapshot(root, expectedSha, true, nativePaths);
  checks.push({ id: 'derived-scope', outcome: 'success' });
  if (JSON.stringify(outputInventory(root, nativePaths)) !== JSON.stringify(outputs)) throw Error('REGISTRATION_VALIDATOR_CHANGED_OUTPUT');
  const proof = { schemaVersion: PROOF_SCHEMA, scope: 'registration-data-only', status: 'PASS', context,
    producer: { workflowPath: CI_WORKFLOW_PATH, jobName: 'test', runId, runAttempt }, inputs,
    preparation: { state: prepared.state, generatedPathCount: generated.length, catalogStabilized }, checks, outputs, nativePreview };
  validateProof(proof, context, registrationProofFingerprints(root, selectNativeRequests({ root, baseSha: context.baseSha, headSha: context.checkoutSha })));
  return proof;
}

// Only this local check authorizes skipping the runner's duplicate catalog build:
// the generated files must be present in this checkout.
export function validateLocalRegistrationProof({ root = process.cwd(), event, expectedSha, repo, proof,
  runId, runAttempt, run } = {}) {
  const context = registrationProofContext({ root, event, expectedSha, repo });
  const nativeRequests = selectNativeRequests({ root, baseSha: context.baseSha, headSha: context.checkoutSha });
  validateProof(proof, context, registrationProofFingerprints(root, nativeRequests));
  const nativePaths = validateNativePreview({ root, baseSha: context.baseSha, headSha: context.checkoutSha,
    preview: proof.nativePreview, run, allowedGenerated: loadPatterns(path.join(root, ALLOWLIST)) });
  guardSnapshot(root, expectedSha, true, nativePaths);
  if ((runId !== undefined && proof.producer.runId !== runId)
      || (runAttempt !== undefined && proof.producer.runAttempt !== runAttempt)) throw Error('REGISTRATION_PROOF_RUN_MISMATCH');
  if (proof.preparation.state !== 'PREPARED') throw Error('REGISTRATION_CATALOG_NOT_PREPARED');
  if (JSON.stringify(outputInventory(root, nativePaths)) !== JSON.stringify(proof.outputs)) throw Error('REGISTRATION_PROOF_OUTPUT_MISMATCH');
  return { reusable: true, scope: proof.scope, checkoutSha: expectedSha, outputDigest: proof.outputs.digest,
    catalogAndPackagePrepared: true };
}

function outputFile(root, value) {
  if (!value || /[\r\n\0]/.test(value)) throw Error('PROOF_FILE_REQUIRED');
  const file = path.resolve(value), relative = path.relative(path.resolve(root), file);
  if (!relative.startsWith(`..${path.sep}`) && relative !== '..') throw Error('PROOF_FILE_MUST_BE_OUTSIDE_CHECKOUT');
  return file;
}

function main() {
  const [mode, ...args] = process.argv.slice(2), options = {};
  for (let n = 0; n < args.length; n += 2) {
    if (!['--proof-file'].includes(args[n]) || !args[n + 1] || Object.hasOwn(options, args[n])) throw Error('REGISTRATION_PROOF_ARGUMENT_INVALID');
    options[args[n]] = args[n + 1];
  }
  if (!['produce', 'verify-local'].includes(mode) || process.env.GITHUB_EVENT_NAME !== 'pull_request') throw Error('PR_REGISTRATION_PROOF_MODE_REQUIRED');
  const root = process.cwd(), file = outputFile(root, options['--proof-file']);
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const common = { root, event, expectedSha: process.env.GITHUB_SHA, repo: process.env.GITHUB_REPOSITORY };
  let result, proof;
  if (mode === 'produce') {
    if (path.basename(file) !== PROOF_FILE_NAME) throw Error('PROOF_ARTIFACT_MEMBER_MUST_BE_PROOF_JSON');
    fs.rmSync(file, { force: true });
    proof = producePrRegistrationProof({ ...common, runId: Number(process.env.GITHUB_RUN_ID), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT) });
    result = { state: 'PASS', scope: proof.scope, chrome: 'NOT_INCLUDED' };
  } else {
    try { proof = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { throw Error('LOCAL_REGISTRATION_PROOF_UNAVAILABLE'); }
    result = validateLocalRegistrationProof({ ...common, proof, runId: Number(process.env.GITHUB_RUN_ID), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT) });
  }
  if (mode !== 'verify-local') {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(proof, null, 2)}\n`, { mode: 0o600 });
  }
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `registration_data=${result.state || 'LOCAL_VERIFIED'}\nproof_file=${file}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `Archive registration data: **${result.state || 'LOCAL_VERIFIED'}** for \`${common.expectedSha}\`. Chrome and metadata supplementation diagnostics are outside this proof.\n`);
  console.log(JSON.stringify(result));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
