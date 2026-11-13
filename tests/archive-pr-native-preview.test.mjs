import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { NATIVE_REQUEST_SCHEMA, selectNativeRequests, applyNativeRequests,
  validateNativePreview } from '../tools/ci/archive-pr-native-preview.mjs';
import { CI_WORKFLOW_PATH, REGISTRATION_CHECKS, prRegistrationProofNeeded,
  producePrRegistrationProof, validateLocalRegistrationProof,
} from '../tools/ci/archive-pr-registration-proof.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const copy = value => structuredClone(value);
const REQUEST = '.archive-meta-register/inbox/own-reviewed-exam.json';
const OTHER = '.archive-meta-register/inbox/other-owner-course.json';
const SOURCE = 'archive/exams/original/native.js';
const EVIDENCE = 'docs/operations/own-native-proof.json';
const META = 'archive/data/question_metadata.json';
const AUTHORITY = 'archive/data/meta-foundation/canonical/fixture/pack.json';
const RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/own-reviewed-exam.json';
const PLANNED = [META, AUTHORITY, RECEIPT].sort();
const ALLOWED = [/^archive\/db\.js$/, /^archive\/data\/question_metadata\.json$/,
  /^archive\/data\/archive2-(?:catalog|canonical-input-manifest)\.json$/];

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-preview-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text, target = root) => {
    fs.mkdirSync(path.dirname(path.join(target, file)), { recursive: true });
    fs.writeFileSync(path.join(target, file), text);
  };
  const git = (...args) => {
    const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  for (const file of [...REGISTRATION_CHECKS.map(c => c.file), CI_WORKFLOW_PATH,
    'archive/build_db.py', 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
    'archive/tools/meta-foundation/compile-meta-foundation.mjs',
    'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs',
    'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs',
    'archive/tools/build-archive2-catalog.mjs', 'tools/ci/archive-pr-registration-prepare.mjs',
    'tools/ci/archive-pr-registration-proof.mjs', 'tools/ci/archive-pr-native-preview.mjs',
    'tools/ci/push-touches-paths.mjs']) write(file, '// fixed checker\n');
  write('tools/ci/archive-pages-registration.paths', [
    'archive/db.js', META, 'archive/data/archive2-catalog.json',
    'archive/data/archive2-canonical-input-manifest.json',
  ].join('\n') + '\n');
  write(SOURCE, 'window.questions = [{ id: 1 }];\n');
  write(EVIDENCE, json({ reviewed: 'fixture approval evidence, without student content' }));
  write(META, json({ records: [{ questionUid: 'fixture', before: true }] }));
  write(AUTHORITY, json({ version: 'before' }));
  write(OTHER, json({ schemaVersion: 'standalone-course-fixture', requestId: 'other-owner-course' }));
  write('archive/db.js', 'old projection\n');
  write('archive/data/archive2-catalog.json', json({ projection: 'old' }));
  const manifest = target => write('archive/data/archive2-canonical-input-manifest.json', json({
    schemaVersion: 'archive2-canonical-input-manifest-v1', files: [
      { path: 'data/archive2-catalog.json', sha256: sha(fs.readFileSync(path.join(target, 'archive/data/archive2-catalog.json'))) },
    ],
  }), target);
  manifest(root);
  git('add', '.'); git('commit', '-qm', 'fixed base including other owner inbox');
  const baseSha = git('rev-parse', 'HEAD');
  const evidenceRef = { path: EVIDENCE, sha256: sha(fs.readFileSync(path.join(root, EVIDENCE))) };
  const request = { schemaVersion: NATIVE_REQUEST_SCHEMA, requestId: 'own-reviewed-exam',
    sourceArchiveFile: 'original/native.js', expectedSourceBlobSha1: git('rev-parse', `HEAD:${SOURCE}`),
    expectedQuestionCount: 1, approval: { type: 'FINAL_QA', evidenceRefs: [evidenceRef] },
    registryChanges: [], items: [{ questionUid: 'fixture', evidenceRefs: [evidenceRef] }],
  };
  write(REQUEST, json(request)); git('add', '--', REQUEST); git('commit', '-qm', 'own request only');
  const headSha = git('rev-parse', 'HEAD'), repo = 'owner/repository';
  const event = { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
    number: 17, base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
  } };
  const calls = [], hook = {};
  const run = (program, args, target = root) => {
    calls.push({ program, args, root: target });
    if (program === 'git') {
      const r = spawnSync(program, args, { cwd: target, encoding: 'utf8' });
      if (r.status !== 0) throw Error(`FIXTURE_GIT:${r.stderr}`); return r.stdout;
    }
    if (args[0].endsWith('/register-reviewed-exam-meta-source.mjs')) {
      const requestPath = args[args.indexOf('--request') + 1];
      assert.equal(requestPath, REQUEST, 'an unchanged other-owner inbox must not run');
      const req = JSON.parse(fs.readFileSync(path.join(target, requestPath), 'utf8'));
      const replay = fs.existsSync(path.join(target, RECEIPT));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry-run';
      hook[phase]?.(target);
      if (phase === 'projection' && !replay) throw Error('FIXTURE_RECEIPT_REQUIRED');
      const result = { status: 'PASS', requestId: req.requestId, totalQuestions: 1, replay,
        plannedPaths: replay ? [] : PLANNED,
        consumerSearchStatus: phase === 'projection' ? 'STATIC_VALUES_VERIFIED' : 'NOT_RUN' };
      if (phase === 'write' && !replay) {
        write(META, json({ records: [{ questionUid: 'fixture', after: true }] }), target);
        write(AUTHORITY, json({ version: 'after' }), target);
        write(RECEIPT, json({ requestSha256: sha(fs.readFileSync(path.join(target, REQUEST))), source: req.expectedSourceBlobSha1 }), target);
        hook.afterWrite?.(target);
      }
      return json(hook.result?.(phase, result, target) || result);
    }
    if (args[0].endsWith('/verify-changed-uid-consumer-approval.mjs')) {
      hook.consumer?.(target);
      return json(hook.consumerResult || { status: 'PASS', counts: { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 },
        exams: [{ file: REQUEST, kind: 'reviewed-exam-v2', sourceFile: 'original/native.js', changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 }],
        failures: [], unobservedFields: [], assignmentPending: [] });
    }
    if (program === 'python3') {
      write('archive/db.js', 'new projection\n', target);
      write('archive/data/archive2-catalog.json', json({ projection: 'new' }), target); manifest(target);
    }
    return '';
  };
  const options = { root, repo, event, expectedSha: headSha, runId: 41, runAttempt: 1, run };
  const selected = () => selectNativeRequests({ root, baseSha, headSha });
  const produce = () => producePrRegistrationProof(options);
  const validate = proof => validateLocalRegistrationProof({ ...options, proof });
  const native = preview => validateNativePreview({ root, baseSha, headSha, preview, run, allowedGenerated: ALLOWED });
  const snapshot = () => {
    const records = [];
    const walk = dir => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === '.git') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full); else records.push([path.relative(root, full), sha(fs.readFileSync(full))]);
    } };
    walk(root); return { status: git('status', '--porcelain', '--untracked-files=all'), files: records.sort() };
  };
  const assertShadowsRemoved = () => { for (const call of calls) if (call.root !== root) assert.equal(fs.existsSync(call.root), false, call.root); };
  return { root, write, git, baseSha, headSha, request, selected, produce, validate, native, snapshot,
    assertShadowsRemoved, calls, hook, run };
}

test('inbox-only PR selects its fixed v2 request and leaves unchanged course inbox untouched', t => {
  const f = fixture(t), beforeHead = f.git('rev-parse', 'HEAD');
  assert.equal(prRegistrationProofNeeded([REQUEST]), true);
  assert.deepEqual(f.selected().map(r => r.path), [REQUEST]);
  const other = fs.readFileSync(path.join(f.root, OTHER)), proof = f.produce();
  assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.plans[0].plannedPaths, PLANNED);
  assert.deepEqual(proof.nativePreview.checks.map(c => c.id), ['native-projection', 'native-consumer']);
  assert.deepEqual(fs.readFileSync(path.join(f.root, OTHER)), other);
  assert.equal(fs.existsSync(path.join(f.root, REQUEST)), true, 'preview never consumes its inbox');
  assert.equal(f.git('rev-parse', 'HEAD'), beforeHead);
  const before = f.snapshot();
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before, 'successful local reuse is read-only');
  f.assertShadowsRemoved();
  const actualWrites = f.calls.filter(c => c.root === f.root && c.args.includes('--write') && c.args[0].endsWith('/register-reviewed-exam-meta-source.mjs'));
  assert.equal(actualWrites.length, 1, 'verify-local writes only its isolated shadow');
});

for (const [label, file, message] of [
  ['request', REQUEST, /REQUEST_NOT_FIXED/], ['approval evidence', EVIDENCE, /EVIDENCE_DRIFT/],
  ['source', SOURCE, /SOURCE_NOT_FIXED/],
]) test(`${label} raw SHA drift cannot reuse a proof`, t => {
  const f = fixture(t), proof = f.produce();
  fs.appendFileSync(path.join(f.root, file), '\n');
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), message);
  assert.deepEqual(f.snapshot(), before, 'a rejected reuse must not mutate current inputs or native output');
  f.assertShadowsRemoved();
});

test('official writer cannot change source or an undeclared canonical output', t => {
  for (const file of [SOURCE, 'archive/data/meta-foundation/canonical/unrelated.json']) {
    const f = fixture(t); f.hook.afterWrite = target => f.write(file, 'undeclared write\n', target);
    assert.throws(() => f.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  }
});

test('dry-run must be read-only and official stage failures never yield a proof', t => {
  const mutating = fixture(t);
  mutating.hook['dry-run'] = target => mutating.write(AUTHORITY, 'illegal dry-run mutation\n', target);
  assert.throws(() => mutating.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  for (const phase of ['dry-run', 'write', 'projection', 'consumer']) {
    const f = fixture(t); f.hook[phase] = () => { throw Error(`OFFICIAL_${phase}_FAILED`); };
    assert.throws(() => f.produce(), new RegExp(`OFFICIAL_${phase}_FAILED`));
  }
});

test('denominator and projection outcome are required beyond a PASS label', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 1, checked: 0, passed: 0, skippedUnchanged: 0 },
    failures: [], unobservedFields: [], assignmentPending: [] };
  assert.throws(() => f.produce(), /CONSUMER_NOT_PASS/);
  const g = fixture(t); g.hook.result = (phase, result) => phase === 'projection' ? { ...result, consumerSearchStatus: 'NOT_RUN' } : result;
  assert.throws(() => g.produce(), /PROJECTION_NOT_VERIFIED/);
});

test('official KEEP counts are accepted only with complete per-request projection and Consumer denominators', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 },
    exams: [{ file: REQUEST, kind: 'reviewed-exam-v2', sourceFile: 'original/native.js', changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 }],
    failures: [], unobservedFields: [], assignmentPending: [] };
  const proof = f.produce();
  assert.equal(f.validate(proof).reusable, true);
  f.hook.consumerResult.exams[0].sourceFile = 'original/other.js';
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), /CONSUMER_NOT_PASS/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('a forged allowlist and refreshed output hashes cannot authorize an unrelated canonical file', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const extra = 'archive/data/meta-foundation/canonical/unrelated.json'; f.write(extra, 'forged\n');
  forged.plans[0].plannedPaths.push(extra); forged.plans[0].plannedPaths.sort();
  forged.outputs.push({ path: extra, sha256: sha('forged\n'), sizeBytes: 7 }); forged.outputs.sort((a, b) => a.path.localeCompare(b.path));
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before, 'failed shadow re-plan cannot mutate actual checkout');
  f.assertShadowsRemoved();
});

test('new native authority bytes must match official HEAD re-plan despite a rewritten manifest', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const bytes = 'forged authority\n'; f.write(AUTHORITY, bytes);
  Object.assign(forged.outputs.find(r => r.path === AUTHORITY), { sha256: sha(bytes), sizeBytes: Buffer.byteLength(bytes) });
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /NATIVE_AUTHORITY_OUTPUT_DRIFT/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('missing planned output and projection failure reject reuse without checkout mutation or leaked shadow', t => {
  const f = fixture(t), proof = f.produce(), missing = copy(proof.nativePreview);
  missing.outputs = missing.outputs.filter(r => r.path !== RECEIPT);
  let before = f.snapshot();
  assert.throws(() => f.native(missing), /OUTPUT_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  f.hook.projection = () => { throw Error('PROJECTION_FAILED_DURING_REUSE'); };
  before = f.snapshot();
  assert.throws(() => f.validate(proof), /PROJECTION_FAILED_DURING_REUSE/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow registration failure cleans independent files and never writes the real checkout', t => {
  const f = fixture(t), proof = f.produce(), before = f.snapshot();
  f.hook.afterWrite = target => { if (target !== f.root) throw Error('SHADOW_WRITE_FAILED'); };
  assert.throws(() => f.validate(proof), /SHADOW_WRITE_FAILED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('post-state replay does not replace the initial official output plan with an empty list', t => {
  const f = fixture(t), proof = f.produce(), requests = f.selected();
  assert.deepEqual(applyNativeRequests({ root: f.root, requests, run: f.run }), [
    { requestPath: REQUEST, replay: true, plannedPaths: [] },
  ]);
  const forged = copy(proof.nativePreview); forged.plans[0] = { requestPath: REQUEST, replay: true, plannedPaths: [] };
  forged.outputs = [];
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});
