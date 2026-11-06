#!/usr/bin/env node
// Reuse the CI runner's data-only registration verdict. This does not certify
// Chrome, copy generated data into another checkout, or modify a remote ref.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { preparePrRegistration } from './archive-pr-registration-prepare.mjs';
import { loadPatterns } from './push-touches-paths.mjs';

export const PROOF_SCHEMA = 'archive-pr-registration-proof/v1';
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
const MAX_JSON_BYTES = 64 * 1024;
const MAX_ARTIFACT_BYTES = 256 * 1024;
const ALLOWLIST = 'tools/ci/archive-pages-registration.paths';
const MIXED = 'archive/data/archive2-source-verification/mixed-v1/';
const CATALOG_MANIFEST = 'archive/data/archive2-canonical-input-manifest.json';
const CHECKER_FILES = new Set([
  ...REGISTRATION_CHECKS.map(check => check.file),
  'archive/build_db.py', CI_WORKFLOW_PATH,
  '.github/workflows/archive-registration-sync.yml',
  'tools/ci/archive-pr-registration-prepare.mjs',
  'tools/ci/archive-pr-registration-proof.mjs',
  'tools/ci/push-touches-paths.mjs', ALLOWLIST,
  'tools/ci/archive-ci-scope.mjs', 'tools/ci/run-scoped-tests.mjs',
  'tools/run-tests.js', 'tests/archive-pr-registration-prepare.test.mjs',
  'tests/archive-pr-registration-proof.test.mjs',
]);
const REQUIRED_FILES = [...REGISTRATION_CHECKS.map(check => check.file), ALLOWLIST,
  'archive/build_db.py', 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
  'archive/tools/build-archive2-catalog.mjs',
  'tools/ci/archive-pr-registration-prepare.mjs', 'tools/ci/archive-pr-registration-proof.mjs',
  'tools/ci/push-touches-paths.mjs', CI_WORKFLOW_PATH, '.github/workflows/archive-registration-sync.yml'];
const DIAGNOSTIC_FILES = new Set([
  'tests/archive-meta-v2-materializer.test.mjs',
  'tests/archive2-meta-v2-semantic-authority.test.cjs',
  'tests/archive-original-search-exposure.browser.cjs',
  'tests/archive-original-exam-access.browser.cjs',
  'tools/check-jeil-legacy-similar-chrome.cjs',
  'tools/check-palma-legacy-similar-chrome.cjs',
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
  return ['archive/', 'shared/', 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/',
    'docs/rules/01_CANONICAL/taxonomy/'].some(prefix => file.startsWith(prefix));
}

// The CI producer serves the existing Sync inputs plus the actual data/checker
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

export function registrationProofFingerprints(root = process.cwd()) {
  const rows = treeRows(root), present = new Set(rows.map(row => row.path));
  if (REQUIRED_FILES.some(file => !present.has(file))) throw Error('REGISTRATION_PROOF_DEPENDENCY_MISSING');
  const inputs = rows.filter(row => isInput(row.path) && !isChecker(row.path));
  const checkers = rows.filter(row => isChecker(row.path));
  return { inputDigest: hash(JSON.stringify(inputs)), checkerDigest: hash(JSON.stringify(checkers)),
    inputFileCount: inputs.length, checkerFileCount: checkers.length };
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

function guardSnapshot(root, checkoutSha, allowGenerated) {
  if (git(root, 'rev-parse', 'HEAD').trim() !== checkoutSha) throw Error('REGISTRATION_HEAD_CHANGED');
  const changed = changedPaths(root);
  const allowed = allowGenerated ? loadPatterns(path.join(root, ALLOWLIST)) : [];
  if (changed.some(file => !allowed.some(pattern => pattern.test(file.normalize('NFC'))))) {
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

function outputInventory(root) {
  const allowed = loadPatterns(path.join(root, ALLOWLIST));
  const candidates = [...treeRows(root).map(row => row.path),
    ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
    ...git(root, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z', '--', 'archive').split('\0')];
  const paths = [...new Set(candidates.filter(file => file &&
    (allowed.some(pattern => pattern.test(file.normalize('NFC'))) || (file.startsWith(MIXED) && file.endsWith('.json')))))].sort();
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
    if (typeof row?.path !== 'string' || !row.path || row.path.includes('\\')
        || row.path.split('/').some(part => !part || part === '.' || part === '..')
        || !DIGEST.test(row.sha256 || '') || seen.has(row.path)) throw Error('REGISTRATION_CATALOG_MANIFEST_INVALID');
    seen.add(row.path);
    // Match the official catalog manifest's normalized-text hash contract.
    const file = `archive/${row.path}`;
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
  keys(proof, ['schemaVersion', 'scope', 'status', 'context', 'producer', 'inputs', 'preparation', 'checks', 'outputs']);
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
  const inputs = registrationProofFingerprints(root);
  const prepared = preparePrRegistration({ root, eventName: 'pull_request', event, expectedSha, run });
  guardSnapshot(root, expectedSha, true);
  let catalogStabilized = false;
  if (prepared.state === 'PREPARED' && !catalogManifestCurrent(root)) {
    // build_db validates its final catalog, then refreshes runtime readiness.
    // When that last write changes a manifest input, the old CI catalog pre-step
    // was necessary stabilization. Retain it only for that actual byte change.
    run(process.execPath, ['archive/tools/build-archive2-catalog.mjs'], root, true);
    guardSnapshot(root, expectedSha, true);
    if (!catalogManifestCurrent(root)) throw Error('REGISTRATION_CATALOG_DID_NOT_STABILIZE');
    catalogStabilized = true;
  }
  const outputs = outputInventory(root), checks = [];
  for (const { id, file } of REGISTRATION_CHECKS) {
    run(process.execPath, [file], root, true);
    checks.push({ id, outcome: 'success' });
  }
  run('git', ['diff', '--check', 'HEAD', '--'], root);
  checks.push({ id: 'diff-whitespace', outcome: 'success' });
  const generated = guardSnapshot(root, expectedSha, true);
  checks.push({ id: 'derived-scope', outcome: 'success' });
  if (JSON.stringify(outputInventory(root)) !== JSON.stringify(outputs)) throw Error('REGISTRATION_VALIDATOR_CHANGED_OUTPUT');
  const proof = { schemaVersion: PROOF_SCHEMA, scope: 'registration-data-only', status: 'PASS', context,
    producer: { workflowPath: CI_WORKFLOW_PATH, jobName: 'test', runId, runAttempt }, inputs,
    preparation: { state: prepared.state, generatedPathCount: generated.length, catalogStabilized }, checks, outputs };
  validateProof(proof, context, registrationProofFingerprints(root));
  return proof;
}

// Only this local check authorizes skipping the runner's duplicate catalog build:
// a remote proof does not put its generated files in this checkout.
export function validateLocalRegistrationProof({ root = process.cwd(), event, expectedSha, repo, proof,
  runId, runAttempt } = {}) {
  const context = registrationProofContext({ root, event, expectedSha, repo });
  guardSnapshot(root, expectedSha, true);
  validateProof(proof, context, registrationProofFingerprints(root));
  if ((runId !== undefined && proof.producer.runId !== runId)
      || (runAttempt !== undefined && proof.producer.runAttempt !== runAttempt)) throw Error('REGISTRATION_PROOF_RUN_MISMATCH');
  if (proof.preparation.state !== 'PREPARED') throw Error('REGISTRATION_CATALOG_NOT_PREPARED');
  if (JSON.stringify(outputInventory(root)) !== JSON.stringify(proof.outputs)) throw Error('REGISTRATION_PROOF_OUTPUT_MISMATCH');
  return { reusable: true, scope: proof.scope, checkoutSha: expectedSha, outputDigest: proof.outputs.digest,
    catalogAndPackagePrepared: true };
}

export function registrationProofArtifactName(checkoutSha, runAttempt) {
  if (!SHA.test(checkoutSha || '') || !positiveInteger(runAttempt)) throw Error('REGISTRATION_ARTIFACT_IDENTITY_INVALID');
  return `archive-pr-registration-proof-${checkoutSha}-${runAttempt}`;
}

// Python's existing standard-library ZIP reader checks CRC and ZIP64 correctly.
// Read one bounded JSON member in memory; never extract paths or execute artifacts.
export function decodeRegistrationProofArtifact(bytes) {
  if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > MAX_ARTIFACT_BYTES) throw Error('REGISTRATION_ARTIFACT_SIZE_INVALID');
  const python = `import io,json,sys,zipfile\nz=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))\na=z.infolist()\nassert len(a)==1 and a[0].filename=='proof.json' and not a[0].is_dir()\nassert a[0].file_size<=${MAX_JSON_BYTES} and not (a[0].flag_bits&1)\nassert a[0].compress_type in (zipfile.ZIP_STORED,zipfile.ZIP_DEFLATED)\nsys.stdout.buffer.write(z.read(a[0]))\n`;
  const result = spawnSync('python3', ['-c', python], { input: bytes, maxBuffer: MAX_JSON_BYTES, timeout: 10000 });
  if (result.error || result.status !== 0) throw Error('REGISTRATION_ARTIFACT_INVALID');
  try { return JSON.parse(result.stdout.toString('utf8')); } catch { throw Error('REGISTRATION_PROOF_JSON_INVALID'); }
}

async function boundedBytes(response, limit) {
  if (Number(response.headers.get('content-length') || 0) > limit) throw Error('GITHUB_RESPONSE_TOO_LARGE');
  const chunks = []; let length = 0;
  for await (const part of response.body) {
    length += part.length;
    if (length > limit) throw Error('GITHUB_RESPONSE_TOO_LARGE');
    chunks.push(Buffer.from(part));
  }
  return Buffer.concat(chunks);
}

export function createGitHubProofReader({ token, fetchImpl = fetch } = {}) {
  const request = async (route, binary) => {
    if (!route.startsWith('/repos/') || route.includes('://')) throw Error('GITHUB_READ_ROUTE_INVALID');
    let response;
    try { response = await fetchImpl(`https://api.github.com${route}`, { method: 'GET', redirect: 'manual',
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}) }, signal: AbortSignal.timeout(30000) }); }
    catch { throw Error('GITHUB_PROOF_READ_UNAVAILABLE'); }
    if (binary && [301, 302, 303, 307, 308].includes(response.status)) {
      let location;
      try { location = new URL(response.headers.get('location')); } catch { throw Error('GITHUB_ARTIFACT_REDIRECT_INVALID'); }
      if (location.protocol !== 'https:' || location.username || location.password) throw Error('GITHUB_ARTIFACT_REDIRECT_INVALID');
      // A GitHub-supplied signed storage URL gets no GitHub authorization header.
      try { response = await fetchImpl(location.href, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(30000) }); }
      catch { throw Error('GITHUB_ARTIFACT_DOWNLOAD_UNAVAILABLE'); }
    }
    if (!response.ok) throw Error(`GITHUB_PROOF_READ_HTTP_${response.status}`);
    const bytes = await boundedBytes(response, binary ? MAX_ARTIFACT_BYTES : 2 * 1024 * 1024);
    if (binary) return bytes;
    try { return JSON.parse(bytes.toString('utf8')); } catch { throw Error('GITHUB_PROOF_RESPONSE_INVALID'); }
  };
  return { getJson: route => request(route, false), getArtifact: route => request(route, true) };
}

function matchingRun(run, context) {
  return run?.event === 'pull_request' && run.path === CI_WORKFLOW_PATH
    && run.repository?.full_name === context.repository && run.repository?.id === context.repositoryId
    && run.head_sha === context.headSha && positiveInteger(run.id) && positiveInteger(run.run_attempt)
    && run.pull_requests?.some(pr => pr.number === context.pullRequest
      && pr.base?.sha === context.baseSha && pr.head?.sha === context.headSha);
}

export async function consumePrRegistrationProof({ root = process.cwd(), event, expectedSha, repo,
  getJson, getArtifact, timeoutMs = 900000, pollMs = 30000,
  now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), onWait = () => {} } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 0 || timeoutMs > 1800000
      || !Number.isSafeInteger(pollMs) || pollMs < 10000 || pollMs > 60000) throw Error('REGISTRATION_PROOF_WAIT_BOUND_INVALID');
  const context = registrationProofContext({ root, event, expectedSha, repo });
  guardSnapshot(root, expectedSha, false);
  const fingerprints = registrationProofFingerprints(root), deadline = now() + timeoutMs;
  const route = `/repos/${context.repository}`;
  for (;;) {
    const listing = await getJson(`${route}/actions/workflows/ci.yml/runs?event=pull_request&head_sha=${context.headSha}&per_page=30`);
    if (!Array.isArray(listing?.workflow_runs)) throw Error('CI_RUN_LIST_INVALID');
    const run = listing.workflow_runs.filter(value => matchingRun(value, context)).sort((a, b) => b.id - a.id)[0];
    if (run?.status === 'completed') {
      if (run.conclusion !== 'success') throw Error(`CI_REGISTRATION_PROOF_RUN_${String(run.conclusion || 'UNKNOWN').toUpperCase()}`);
      const jobs = await getJson(`${route}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`);
      const tests = jobs?.jobs?.filter(job => job.name === 'test');
      if (tests?.length !== 1 || tests[0].status !== 'completed' || tests[0].conclusion !== 'success') throw Error('CI_REGISTRATION_TEST_JOB_NOT_SUCCESS');
      const name = registrationProofArtifactName(expectedSha, run.run_attempt);
      const artifacts = await getJson(`${route}/actions/runs/${run.id}/artifacts?per_page=100`);
      const matches = artifacts?.artifacts?.filter(artifact => artifact.name === name);
      if (matches?.length !== 1) throw Error('CI_REGISTRATION_PROOF_ARTIFACT_MISSING_OR_AMBIGUOUS');
      const artifact = matches[0];
      if (!positiveInteger(artifact.id) || artifact.expired !== false
          || !positiveInteger(artifact.size_in_bytes) || artifact.size_in_bytes > MAX_ARTIFACT_BYTES
          || !/^sha256:[a-f0-9]{64}$/.test(artifact.digest || '')
          || artifact.workflow_run?.id !== run.id || artifact.workflow_run?.head_sha !== context.headSha
          || artifact.workflow_run?.repository_id !== context.repositoryId
          || artifact.workflow_run?.head_repository_id !== context.headRepositoryId) throw Error('CI_REGISTRATION_PROOF_ARTIFACT_INVALID');
      const bytes = await getArtifact(`${route}/actions/artifacts/${artifact.id}/zip`);
      if (!Buffer.isBuffer(bytes) || bytes.length !== artifact.size_in_bytes
          || `sha256:${hash(bytes)}` !== artifact.digest) throw Error('CI_REGISTRATION_PROOF_ARTIFACT_DIGEST_MISMATCH');
      const proof = decodeRegistrationProofArtifact(bytes);
      validateProof(proof, context, fingerprints);
      if (proof.producer.runId !== run.id || proof.producer.runAttempt !== run.run_attempt) throw Error('REGISTRATION_PROOF_RUN_MISMATCH');
      const confirmed = await getJson(`${route}/actions/runs/${run.id}`);
      if (!matchingRun(confirmed, context) || confirmed.run_attempt !== run.run_attempt
          || confirmed.status !== 'completed' || confirmed.conclusion !== 'success') throw Error('CI_REGISTRATION_PROOF_RUN_CHANGED');
      guardSnapshot(root, expectedSha, false);
      validateProof(proof, registrationProofContext({ root, event, expectedSha, repo }), registrationProofFingerprints(root));
      return { state: 'REUSED', scope: proof.scope, chrome: 'NOT_INCLUDED', proof,
        runId: run.id, runAttempt: run.run_attempt, artifactId: artifact.id, artifactDigest: artifact.digest };
    }
    if (now() >= deadline) throw Error('CI_REGISTRATION_PROOF_WAIT_TIMEOUT');
    onWait({ state: run ? 'CI_RUNNING' : 'CI_NOT_FOUND', checkoutSha: expectedSha, runId: run?.id ?? null });
    await sleep(Math.min(pollMs, deadline - now()));
  }
}

function outputFile(root, value) {
  if (!value || /[\r\n\0]/.test(value)) throw Error('PROOF_FILE_REQUIRED');
  const file = path.resolve(value), relative = path.relative(path.resolve(root), file);
  if (!relative.startsWith(`..${path.sep}`) && relative !== '..') throw Error('PROOF_FILE_MUST_BE_OUTSIDE_CHECKOUT');
  return file;
}

async function main() {
  const [mode, ...args] = process.argv.slice(2), options = {};
  for (let n = 0; n < args.length; n += 2) {
    if (!['--proof-file', '--timeout-seconds', '--poll-seconds'].includes(args[n]) || !args[n + 1] || Object.hasOwn(options, args[n])) throw Error('REGISTRATION_PROOF_ARGUMENT_INVALID');
    options[args[n]] = args[n + 1];
  }
  if (!['produce', 'consume', 'verify-local'].includes(mode) || process.env.GITHUB_EVENT_NAME !== 'pull_request') throw Error('PR_REGISTRATION_PROOF_MODE_REQUIRED');
  const root = process.cwd(), file = outputFile(root, options['--proof-file']);
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const common = { root, event, expectedSha: process.env.GITHUB_SHA, repo: process.env.GITHUB_REPOSITORY };
  let result, proof;
  if (mode === 'produce') {
    if (path.basename(file) !== PROOF_FILE_NAME) throw Error('PROOF_ARTIFACT_MEMBER_MUST_BE_PROOF_JSON');
    fs.rmSync(file, { force: true });
    proof = producePrRegistrationProof({ ...common, runId: Number(process.env.GITHUB_RUN_ID), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT) });
    result = { state: 'PASS', scope: proof.scope, chrome: 'NOT_INCLUDED',
      artifactName: registrationProofArtifactName(common.expectedSha, proof.producer.runAttempt) };
  } else if (mode === 'consume') {
    fs.rmSync(file, { force: true });
    const reader = createGitHubProofReader({ token: process.env.GITHUB_TOKEN });
    const reused = await consumePrRegistrationProof({ ...common, ...reader,
      timeoutMs: Number(options['--timeout-seconds'] ?? 900) * 1000,
      pollMs: Number(options['--poll-seconds'] ?? 30) * 1000,
      onWait: value => console.log(JSON.stringify(value)) });
    ({ proof, ...result } = reused);
  } else {
    try { proof = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { throw Error('LOCAL_REGISTRATION_PROOF_UNAVAILABLE'); }
    result = validateLocalRegistrationProof({ ...common, proof, runId: Number(process.env.GITHUB_RUN_ID), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT) });
  }
  if (mode !== 'verify-local') {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(proof, null, 2)}\n`, { mode: 0o600 });
  }
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `registration_data=${result.state || 'LOCAL_VERIFIED'}\nproof_file=${file}\nsource_sha=${common.expectedSha}\n` +
    (result.artifactName ? `artifact_name=${result.artifactName}\n` : '') +
    (result.runId ? `ci_run_id=${result.runId}\nci_run_attempt=${result.runAttempt}\nartifact_id=${result.artifactId}\nartifact_digest=${result.artifactDigest}\n` : ''));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `Archive registration data: **${result.state || 'LOCAL_VERIFIED'}** for \`${common.expectedSha}\`. Chrome and metadata supplementation diagnostics are outside this proof.\n` +
    (result.runId ? `CI evidence: https://github.com/${common.repo}/actions/runs/${result.runId}/attempts/${result.runAttempt}; artifact ${result.artifactId} (${result.artifactDigest}).\n` : ''));
  console.log(JSON.stringify(result));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
