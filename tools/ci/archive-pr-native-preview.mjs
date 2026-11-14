// Apply only changed, source-bound v2 requests in a disposable PR checkout.
// The main writer, inbox consumption and approval policy remain unchanged.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const NATIVE_PREVIEW_SCHEMA = 'archive-pr-native-preview/v1';
export const NATIVE_REQUEST_SCHEMA = 'archive-reviewed-exam-meta-register-request-v2';
const PARENT_CORRECTION_SCHEMA = 'archive-basic-parent-correction-request-v1';
export const NATIVE_PREVIEW_HELPER = 'tools/ci/archive-pr-native-preview.mjs';
const INBOX = '.archive-meta-register/inbox/';
const REGISTRAR = 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs';
const CONSUMER = 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = reason => { throw Error(`PR_NATIVE_PREVIEW:${reason}`); };
const sorted = values => [...new Set(values)].sort();

export function nativeCommand(program, args, root) {
  const r = spawnSync(program, args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    timeout: 12 * 60 * 1000, stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error || r.status !== 0) fail(`COMMAND_FAILED:${args[0]}:${r.status ?? r.signal}:${String(r.stderr || '').slice(-1500)}`);
  return r.stdout || '';
}
const git = (root, ...args) => nativeCommand('git', args, root);
function gitBytes(root, ref) {
  const result = spawnSync('git', ['show', ref], { cwd: root, maxBuffer: 128 * 1024 * 1024 });
  if (result.error || result.status !== 0) fail(`GIT_INPUT_MISSING:${ref}`);
  return result.stdout;
}

function safe(root, file) {
  if (typeof file !== 'string' || !file || /[\\\r\n\0]/.test(file) || path.isAbsolute(file)
      || file.split('/').some(p => !p || p === '.' || p === '..')) fail('UNSAFE_PATH');
  let full = root;
  for (const part of file.split('/')) {
    full = path.join(full, part);
    if (fs.existsSync(full) && fs.lstatSync(full).isSymbolicLink()) fail(`SYMLINK:${file}`);
  }
  return full;
}
function fileRef(root, file) {
  const full = safe(root, file);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) fail(`MISSING_FILE:${file}`);
  const bytes = fs.readFileSync(full);
  return { path: file, sha256: sha(bytes), sizeBytes: bytes.length };
}
const dirty = root => sorted([
  ...git(root, 'diff', '--name-only', '-z', 'HEAD', '--').split('\0'),
  ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
].filter(Boolean));
function dirtySnapshot(root) {
  return new Map(dirty(root).map(file => [file, fs.existsSync(safe(root, file)) ? fileRef(root, file).sha256 : null]));
}
function noUnexpectedMutation(root, before, allowed) {
  const after = dirtySnapshot(root), names = sorted([...before.keys(), ...after.keys()]);
  if (names.some(file => before.get(file) !== after.get(file) && !allowed.has(file))) fail('UNDECLARED_NATIVE_OUTPUT');
}
function parsed(result) {
  try { return JSON.parse(result); } catch { fail('REGISTRAR_RESULT_INVALID'); }
}

// Diff selection is independent of the inbox inventory. An unchanged request
// belonging to another owner is never applied by this PR preview.
export function selectNativeRequests({ root, baseSha, headSha }) {
  const fields = git(root, 'diff', '--name-status', '--diff-filter=AM', '--no-renames', '-z', baseSha, headSha, '--', INBOX).split('\0').filter(Boolean);
  if (fields.length % 2) fail('DIFF_INVALID');
  const requests = [];
  for (let i = 0; i < fields.length; i += 2) {
    const file = fields[i + 1];
    if (!['A', 'M'].includes(fields[i]) || !file.startsWith(INBOX) || file.slice(INBOX.length).includes('/') || !file.endsWith('.json')) continue;
    safe(root, file);
    const raw = fs.readFileSync(path.join(root, file));
    if (sha(raw) !== sha(gitBytes(root, `${headSha}:${file}`))) fail(`REQUEST_NOT_FIXED:${file}`);
    let request; try { request = JSON.parse(raw); } catch { fail(`REQUEST_JSON:${file}`); }
    const correction = request.schemaVersion === PARENT_CORRECTION_SCHEMA;
    if (!correction && request.schemaVersion !== NATIVE_REQUEST_SCHEMA) continue;
    if (correction && (!Array.isArray(request.items) || !request.items.length)) fail('QUESTION_COUNT');
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(request.requestId || '')) fail('REQUEST_ID');
    if (!Number.isSafeInteger(request.expectedQuestionCount) || request.expectedQuestionCount < 1) fail('QUESTION_COUNT');
    const refs = new Map();
    for (const list of [request.approval?.evidenceRefs, ...(request.items || []).map(i => i.evidenceRefs),
      ...(request.registryChanges || []).map(i => i.evidenceRefs),
      ...(correction ? [[request.difficultyEvidence]] : [])]) {
      if (!Array.isArray(list) || !list.length) fail('EVIDENCE_REQUIRED');
      for (const item of list) {
        if (!/^[a-f0-9]{64}$/.test(item.sha256 || '')) fail('EVIDENCE_SHA');
        const ref = fileRef(root, item.path);
        if (ref.sha256 !== item.sha256 || refs.has(ref.path) && !eq(refs.get(ref.path), ref)) fail(`EVIDENCE_DRIFT:${ref.path}`);
        if (sha(gitBytes(root, `${headSha}:${ref.path}`)) !== ref.sha256) fail(`EVIDENCE_NOT_FIXED:${ref.path}`);
        refs.set(ref.path, ref);
      }
    }
    const sourcePath = `archive/exams/${request.sourceArchiveFile}`;
    const source = fileRef(root, sourcePath), blobSha1 = git(root, 'rev-parse', `${headSha}:${sourcePath}`).trim();
    if (blobSha1 !== request.expectedSourceBlobSha1 || sha(gitBytes(root, `${headSha}:${sourcePath}`)) !== source.sha256) fail('SOURCE_NOT_FIXED');
    requests.push({ ...fileRef(root, file), requestId: request.requestId, questionCount: correction ? request.items.length : request.expectedQuestionCount,
      ...(correction ? { kind: 'basic-parent-correction' } : {}), source: { ...source, blobSha1 },
      evidence: [...refs.values()].sort((a, b) => a.path.localeCompare(b.path, 'en')),
      receiptPath: `${RECEIPTS}${request.requestId}.json` });
  }
  if (new Set(requests.map(r => r.requestId)).size !== requests.length) fail('DUPLICATE_REQUEST_ID');
  return requests.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

function registrar(root, request, run, flags = [], scriptRoot = root) {
  return parsed(run(process.execPath, [path.join(scriptRoot, REGISTRAR), '--repo-root', root, '--request', request.path, ...flags], root));
}
function planPaths(result, request) {
  if (result.status !== 'PASS' || result.requestId !== request.requestId || result.totalQuestions !== request.questionCount || !Array.isArray(result.plannedPaths)
      || typeof result.replay !== 'boolean' || result.plannedPaths.some(file => typeof file !== 'string')) fail('DRY_RUN_NOT_PASS');
  const paths = sorted(result.plannedPaths);
  if (paths.length !== result.plannedPaths.length || paths.some(file => !file.startsWith('archive/data/'))) fail('OUTPUT_SCOPE');
  for (const file of paths) safe('/', file);
  if (!result.replay && !paths.includes(request.receiptPath)) fail('RECEIPT_NOT_PLANNED');
  if (result.replay && paths.length) fail('REPLAY_WRITES');
  return paths;
}

export function applyNativeRequests({ root, requests, run = nativeCommand, scriptRoot = root, guard = true }) {
  const plans = [];
  for (const request of requests) {
    const before = guard ? dirtySnapshot(root) : null;
    const dryRun = registrar(root, request, run, [], scriptRoot), paths = planPaths(dryRun, request);
    if (guard) noUnexpectedMutation(root, before, new Set());
    const applied = registrar(root, request, run, ['--write'], scriptRoot);
    if (applied.status !== 'PASS' || applied.requestId !== request.requestId || applied.replay !== dryRun.replay
        || !eq(sorted(applied.plannedPaths || []), paths)) fail('WRITE_PLAN_MISMATCH');
    if (guard) noUnexpectedMutation(root, before, new Set(paths));
    plans.push({ requestPath: request.path, replay: dryRun.replay, plannedPaths: paths });
  }
  return plans;
}

export function verifyNativeRequests({ root, requests, run = nativeCommand }) {
  if (!requests.length) return [];
  const before = dirtySnapshot(root);
  for (const request of requests) {
    const result = registrar(root, request, run, ['--verify-projection']);
    if (result.status !== 'PASS' || result.requestId !== request.requestId || result.totalQuestions !== request.questionCount
        || result.replay !== true || result.consumerSearchStatus !== 'STATIC_VALUES_VERIFIED') fail('PROJECTION_NOT_VERIFIED');
  }
  const result = parsed(run(process.execPath, [CONSUMER, ...requests.flatMap(r => ['--request', r.path]), '--root', root], root));
  const count = requests.reduce((sum, r) => sum + r.questionCount, 0);
  const complete = (counts, total) => counts && ['changed', 'checked', 'passed', 'skippedUnchanged']
    .every(k => Number.isSafeInteger(counts[k]) && counts[k] >= 0)
    && counts.changed + counts.skippedUnchanged === total && counts.checked === counts.changed && counts.passed === counts.changed;
  // The official Consumer checks changed rows and counts legitimate KEEP rows
  // as skipped. The preceding projection check still verifies every source row.
  if (result.status !== 'PASS' || !complete(result.counts, count)
      || !Array.isArray(result.exams) || result.exams.length !== requests.length
      || requests.some(r => {
        const exams = result.exams.filter(e => e.file === r.path);
        return exams.length !== 1 || exams[0].kind !== (r.kind || 'reviewed-exam-v2')
          || `archive/exams/${exams[0].sourceFile}` !== r.source.path || !complete(exams[0], r.questionCount);
      })
      || ['changed', 'checked', 'passed', 'skippedUnchanged'].some(k => result.exams.reduce((sum, e) => sum + e[k], 0) !== result.counts[k])
      || ['failures', 'unobservedFields', 'assignmentPending'].some(k => !Array.isArray(result[k]) || result[k].length)) fail('CONSUMER_NOT_PASS');
  noUnexpectedMutation(root, before, new Set());
  return [{ id: 'native-projection', outcome: 'success' }, { id: 'native-consumer', outcome: 'success' }];
}

export function nativeOutputManifest(root, plans) {
  return sorted(plans.flatMap(p => p.plannedPaths)).map(file => fileRef(root, file));
}

// Re-derive the *initial* official plan from the immutable Git input. A replay
// on the post-state returns plannedPaths:[] and cannot authenticate a new
// allowlist. This shadow has independent bytes; verify-local never writes its
// actual checkout, consumes inbox files or runs another catalog build.
export function rederiveNativePlans({ root, requests, run = nativeCommand }) {
  if (!requests.length) return { plans: [], outputs: [] };
  const shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pr-native-plan-'));
  try {
    nativeCommand('git', ['clone', '--quiet', '--shared', '--no-checkout', '--local', root, shadow], root);
    const restore = ['archive/data', 'docs/rules/01_CANONICAL/taxonomy'].filter(file => git(root, 'ls-tree', 'HEAD', '--', file).trim());
    const tar = spawnSync('git', ['archive', '--format=tar', 'HEAD', '--', ...restore], { cwd: root, maxBuffer: 1024 * 1024 * 1024 });
    if (tar.error || tar.status !== 0) fail('SHADOW_GIT_SNAPSHOT_FAILED');
    const extracted = spawnSync('tar', ['-xf', '-', '-C', shadow], { input: tar.stdout, maxBuffer: 1024 * 1024 });
    if (extracted.error || extracted.status !== 0) fail('SHADOW_EXTRACT_FAILED');
    const inputs = sorted(requests.flatMap(r => [r.path, r.source.path, ...r.evidence.map(e => e.path)]));
    const attrs = git(root, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n').filter(p => path.posix.basename(p) === '.gitattributes');
    for (const file of sorted([...inputs, ...attrs])) {
      const full = safe(shadow, file);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, gitBytes(root, `HEAD:${file}`));
    }
    const plans = applyNativeRequests({ root: shadow, requests, run, scriptRoot: root, guard: false });
    return { plans, outputs: nativeOutputManifest(shadow, plans) };
  } finally { fs.rmSync(shadow, { recursive: true, force: true }); }
}

export function emptyNativePreview() {
  return { schemaVersion: NATIVE_PREVIEW_SCHEMA, requests: [], plans: [], outputs: [], checks: [] };
}

export function validateNativePreview({ root, baseSha, headSha, preview, run = nativeCommand, allowedGenerated = [] }) {
  const requests = selectNativeRequests({ root, baseSha, headSha });
  if (!preview || !eq(Object.keys(preview).sort(), ['schemaVersion', 'requests', 'plans', 'outputs', 'checks'].sort())
      || preview.schemaVersion !== NATIVE_PREVIEW_SCHEMA || !eq(preview.requests, requests)) fail('INPUT_MANIFEST_MISMATCH');
  if (!requests.length) {
    if (!eq(preview, emptyNativePreview())) fail('UNEXPECTED_NATIVE_PROOF');
    return [];
  }
  const before = dirtySnapshot(root);
  const expected = rederiveNativePlans({ root, requests, run });
  if (!eq(preview.plans, expected.plans)) fail('PLAN_MANIFEST_MISMATCH');
  const actual = nativeOutputManifest(root, expected.plans);
  if (!eq(actual, preview.outputs)) fail('OUTPUT_MANIFEST_MISMATCH');
  // The ordinary builder may refresh generated counts. Newly allowed native
  // authority/receipt files must still equal the official writer's exact bytes.
  for (const ref of expected.outputs) {
    if (!allowedGenerated.some(re => re.test(ref.path)) && !eq(fileRef(root, ref.path), ref)) fail(`NATIVE_AUTHORITY_OUTPUT_DRIFT:${ref.path}`);
  }
  if (!eq(verifyNativeRequests({ root, requests, run }), preview.checks)) fail('CHECKS_INCOMPLETE');
  noUnexpectedMutation(root, before, new Set());
  return sorted(expected.plans.flatMap(p => p.plannedPaths));
}
