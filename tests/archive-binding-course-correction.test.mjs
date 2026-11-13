import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from '../archive/tools/meta-foundation/compile-meta-foundation.mjs';
import { collectConsumerRefusals } from '../tools/ci/collect-reviewed-consumer-refusals.mjs';

// File-backed fixtures exercise the real registrar/compile/provenance code.
// Only its consumer dependency is synthetic here; production always imports
// the official loadConsumer. Real post-build parity is a separate required gate.
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANON = 'archive/data/meta-foundation/canonical', BASE = `${CANON}/packs/middle1`;
const PACK = `${BASE}/pack.json`;
const RT = 'archive/data/meta-foundation/runtime/middle1-v1.json';
const META = 'archive/data/question_metadata.json', IDS = 'archive/data/question_identity_map.json';
const SOURCE = 'original/middle/m1/2final/99_정정검증중_2학기_기말_중1.js';
const SOURCE_2 = 'original/middle/m1/2final/99_공유검증중_2학기_기말_중1.js';
const PT = 'PT_M1_PROPORTION_PARAMETER_EVALUATION', TPL = 'TPL_M1_PROPORTION_PARAMETER_EVALUATION_TWO_GRAPH_CONSTANTS';
const h = v => crypto.createHash('sha256').update(v).digest('hex');
const uid = n => `qid_v1_${h(SOURCE + '#' + n)}`;
const j = v => JSON.stringify(v, null, 2) + '\n';

async function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'binding-course-correction-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, v) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof v === 'string' ? v : j(v)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  const patch = (p, fn) => { const d = read(p); fn(d); put(p, d); };
  for (const f of ['register-binding-course-correction.mjs', 'compile-meta-foundation.mjs', 'active-registry.mjs'])
    put(`archive/tools/meta-foundation/${f}`, fs.readFileSync(path.join(repo, 'archive/tools/meta-foundation', f), 'utf8'));
  put('archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs', `
    import fs from 'node:fs'; import path from 'node:path';
    export function loadConsumer(root) {
      const d = JSON.parse(fs.readFileSync(path.join(root, 'fixture-consumer.json'), 'utf8'));
      return {resolvedBySource:new Map(d.resolved.map(r=>[r.sourceFile+'#'+r.sourceOrdinal,r])),
        pageByUid:new Map(d.page.map(r=>[r.questionUid,r]))};
    }
  `);
  const module = await import(pathToFileURL(path.join(root, 'archive/tools/meta-foundation/register-binding-course-correction.mjs')).href);
  const before = { curriculum: '2022', standardCourse: '中1 수학', standardUnitKey: 'M1-04', subUnitKey: 'M1-04-GRAPH_RELATION',
    problemTypeKey: PT, ownerPack: 'MIDDLE1', status: 'ACTIVE', supportingItemCount: 1, supportingQuestionUids: [uid(1)] };
  put(`${BASE}/pack.json`, { schemaVersion: 'meta-foundation-pack-v1', packId: 'MIDDLE1', packVersion: '1.2.3', canonicalStatus: 'ACTIVE',
    standardCourses: ['중1 수학', 'M1-1'], curricula: ['2022'], problemTypeCount: 2, templateCount: 2, bindingCount: 2, aliasCount: 0 });
  put(`${BASE}/bindings.json`, { bindings: [before, { ...before, standardCourse: '중1 수학', problemTypeKey: 'PT_OTHER', supportingQuestionUids: [uid(2)] }], bindingCount: 2 });
  put(`${BASE}/taxonomy.json`, { problemTypes: [PT, 'PT_OTHER'].map(problemTypeKey => ({ problemTypeKey, ownerPack: 'MIDDLE1', status: 'ACTIVE', canonicalLabelKo: problemTypeKey, definition: 'existing definition' })),
    templates: [{ templateKey: TPL, parentProblemTypeKey: PT, status: 'ACTIVE' }, { templateKey: 'TPL_OTHER', parentProblemTypeKey: 'PT_OTHER', status: 'ACTIVE' }] });
  put(`${BASE}/aliases.json`, { aliases: [] });
  put(`${CANON}/metadata_rules.json`, { status: 'ACTIVE', integrationPatterns: ['NONE'] });
  put(`${CANON}/condition_registry.json`, { status: 'ACTIVE', owner: 'CONDITION_CORE', conditions: [] });
  const sources = ['pack', 'taxonomy', 'bindings', 'aliases'].map(n => `${BASE}/${n}.json`).concat([`${CANON}/metadata_rules.json`, `${CANON}/condition_registry.json`]);
  put(`${CANON}/registry_index.json`, { status: 'ACTIVE', activePacks: [{ id: 'MIDDLE1', version: '1.2.3', status: 'ACTIVE' }], activeConceptShards: [],
    conditionRegistry: { id: 'CONDITION_CORE', version: '1', status: 'ACTIVE' }, canonicalSources: sources.map(path => ({ path })),
    compiledArtifacts: ['aliases', 'concept_registry', 'condition_registry', 'curriculum_bindings', 'taxonomy_registry', 'meta_foundation_compiled']
      .map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  const canonical = loadCanonical(read), outputs = compiledOutputs(canonical, buildCompiled(canonical));
  for (const [p, v] of outputs) put(p, v);
  put(`${CANON}/registry_index.json`, buildRegistryIndex(canonical, outputs, p => fs.readFileSync(path.join(root, p), 'utf8')));
  // Deliberately historical fingerprints: this operation must not re-hash or
  // re-approve the exam using the newer reviewed-exam fingerprint algorithm.
  const meta = n => ({ questionUid: uid(n), sourceArchiveFile: SOURCE, sourceOrdinal: n, sourceQuestionNo: String(n), sourceFingerprint: String(n).repeat(64),
    contentFingerprint: 'c'.repeat(64), curriculum: '2022', curriculumKey: '2022', standardCourse: '중1 수학', courseKey: 'M1-1',
    standardUnitKey: 'M1-04', subUnitKey: 'M1-04-GRAPH_RELATION', problemTypeKey: n === 1 ? PT : 'PT_OTHER',
    templateKey: n === 1 ? TPL : 'TPL_OTHER', reviewStatus: 'reviewed_pass', metadataStatus: 'approved_r2e_final',
    metadataRevision: 'historical-r2e', approvalEvidence: ['historical-r2e-reference'], fieldStatus: { subUnit: 'r2e_curriculum_binding' } });
  const rows = [meta(1), meta(2)];
  put(META, { records: rows }); put(IDS, { records: rows.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: SOURCE, sourceOrdinal: r.sourceOrdinal, sourceQuestionNo: r.sourceQuestionNo, sourceFingerprint: r.sourceFingerprint })) });
  put(RT, { schemaVersion: 'meta-foundation-runtime-overlay-v1', packId: 'MIDDLE1', packVersion: '1.2.3', runtimeVersion: 'MIDDLE1@1.2.3/reviewed-exam-v2',
    status: 'ACTIVE', generatedFrom: { original: 'historical-r2e' }, records: rows });
  const sourceRows = rows.map((r, i) => ({ id: i + 1, content: i ? '다른 기존 문항' : '기존 학생 지문',
    ...Object.fromEntries(['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'].map(k => [k, r[k]])) }));
  put(`archive/exams/${SOURCE}`, `window.questionBank=${JSON.stringify(sourceRows)};\n`);
  const proof = { schemaVersion: 'archive-review2-runtime-override/v1', questionUid: uid(1), sourceArchiveFile: SOURCE, sourceOrdinal: 1,
    sourceFingerprint: '1'.repeat(64), latestAcceptedReview2: { status: 'REPAIR', runtimePackId: 'MIDDLE1', decisionId: 'existing-r2e',
      decisionReason: 'Existing accepted metadata', evidencePath: 'historical:receipt', decisionAt: '2026-09-27' } };
  const proofPath = `archive/data/meta-foundation/evidence/review-overrides/v1/${uid(1)}.json`;
  put(proofPath, proof);
  put('archive/data/archive2-item-review-overrides.json', { schemaVersion: 'archive2-item-review-override-index-v1', records: [{ ...proof,
    evidenceReference: proofPath.slice('archive/'.length), evidenceSha256: h(j(proof)) }] });
  const resolved = rows.map(r => ({ questionUid: r.questionUid, sourceFile: SOURCE, sourceOrdinal: r.sourceOrdinal,
    canonicalAssignmentReasons: ['assignment_missing'], problemTypeKey: '', templateKey: '', reviewStatus: 'reviewed_pass',
    metaHintPT: r.problemTypeKey, metaHintTPL: r.templateKey, sourceStatus: 'VERIFIED', metadataConflicts: [] }));
  put('fixture-consumer.json', { resolved, page: resolved.map(r => ({ ...r, directSelectable: true })) });
  const req = await module.createBindingCourseCorrectionRequest({ root, requestId: 'test-binding-spelling', sourceArchiveFile: SOURCE,
    requestedBy: 'fixture-owner', reason: 'Correct the one evidenced course spelling, preserve existing approvals', before });
  const consumer = () => { const d = read('fixture-consumer.json'); return { resolvedBySource: new Map(d.resolved.map(r => [`${r.sourceFile}#${r.sourceOrdinal}`, r])), pageByUid: new Map(d.page.map(r => [r.questionUid, r])) }; };
  return { root, put, read, patch, module, req, before, proofPath, consumer, run: opts => module.registerBindingCourseCorrection({ root, request: req, ...opts }) };
}

function filesSnapshot(root) {
  const out = new Map();
  const visit = dir => { for (const name of fs.readdirSync(dir)) { const p = path.join(dir, name); if (fs.statSync(p).isDirectory()) visit(p); else out.set(path.relative(root, p), h(fs.readFileSync(p))); } };
  visit(root); return out;
}

test('dry-run writes nothing; exact correction preserves all data and does not create an approval', async t => {
  const f = await fixture(t), initial = filesSnapshot(f.root), oldRuntime = f.read(RT);
  const dry = await f.run({});
  assert.deepEqual(Object.fromEntries(['status', 'approvalCreated', 'consumerVerification', 'affectedBindingUidCount', 'checkedRuntimeUids'].map(k => [k, dry[k]])),
    { status: 'DRY_RUN', approvalCreated: false, consumerVerification: 'POST_BUILD_NOT_RUN', affectedBindingUidCount: 1, checkedRuntimeUids: 2 });
  assert.deepEqual(filesSnapshot(f.root), initial);
  const result = await f.run({ write: true }); assert.equal(result.status, 'REGISTERED_CORRECTION');
  assert.equal(f.read(`${BASE}/bindings.json`).bindings[0].standardCourse, '중1 수학');
  assert.deepEqual(f.read(RT).records, oldRuntime.records);
  for (const p of [META, IDS, `archive/exams/${SOURCE}`, f.proofPath, 'archive/data/archive2-item-review-overrides.json']) assert.equal(h(fs.readFileSync(path.join(f.root, p))), initial.get(p));
  assert.equal(f.read(`${BASE}/pack.json`).packVersion, '1.2.4'); assert.equal(f.read(RT).packVersion, '1.2.4');
  const verify = await f.run({ verifyProjection: true }); assert.equal(verify.checkedRuntimeUids, 2); assert.equal(verify.affectedBindingUidCount, 1); assert.equal(verify.approvalCreated, false);
  assert.equal((await f.run({ write: true })).status, 'REPLAY');
  assert.equal(f.read(META).records[0].sourceFingerprint, '1'.repeat(64));
  const receipt = f.read(result.receiptPath); assert.equal(receipt.metadataApprovalStatus, 'NOT_CREATED'); assert.ok(!('appliedRecords' in receipt));
});

const invalidRequests = [
  ['extra semantic change', f => { f.req.correction.after.problemTypeKey = 'PT_OTHER'; }, /only the literal/],
  ['status promotion', f => { f.req.correction.after.status = 'APPROVED'; }, /only the literal/],
  ['approval payload', f => { f.req.approval = { type: 'FINAL_QA' }; }, /no approval/],
  ['unsupported course alias', f => { f.req.correction.after.standardCourse = '중1-1'; }, /only the literal/],
  ['missing impact UID', f => { f.req.preservedConsumers = []; }, /consumer set\/hash/],
  ['extra impact UID', f => { f.req.preservedConsumers.push({ ...f.req.preservedConsumers[0], questionUid: uid(2) }); }, /consumer set\/hash/],
  ['stale identity row hash', f => { f.req.preservedConsumers[0].identityRowSha256 = '0'.repeat(64); }, /consumer set\/hash/],
  ['wrong source blob', f => { f.req.expectedSourceBlobSha1 = '0'.repeat(40); }, /expectedSourceBlob/],
  ['wrong full file hash', f => { f.req.beforeFiles[0].sha256 = '0'.repeat(64); }, /beforeFiles/],
  ['wrong parsed file hash', f => { f.req.beforeDocuments[0].sha256 = '0'.repeat(64); }, /beforeDocuments/],
  ['incomplete consumer baseline', f => { f.req.expectedConsumerStateSha256 = '0'.repeat(64); }, /consumer baseline drift/],
  ['unsafe source path', f => { f.req.sourceArchiveFile = '../secret'; }, /one original/],
  ['hidden second correction', f => { f.req.correction.extra = { before: null, after: {} }; }, /no approval/],
];
for (const [name, mutate, error] of invalidRequests) test(`refuses ${name} without writes`, async t => {
  const f = await fixture(t); mutate(f); const before = filesSnapshot(f.root);
  await assert.rejects(f.run({ write: true }), error); assert.deepEqual(filesSnapshot(f.root), before);
});

const invalidState = [
  ['preexisting pack/runtime version drift', f => f.patch(RT, d => { d.packVersion = '1.2.2'; d.runtimeVersion = 'MIDDLE1@1.2.2/reviewed-exam-v2'; }), /VERSION_PRECONDITION_FAILED/],
  ['duplicate corrected binding', f => f.patch(`${BASE}/bindings.json`, d => d.bindings.push(f.req.correction.after)), /duplicate old\/corrected/],
  ['duplicate before binding', f => f.patch(`${BASE}/bindings.json`, d => d.bindings.push(f.before)), /before binding missing\/ambiguous/],
  ['inactive pack', f => f.patch(`${BASE}/pack.json`, d => { d.canonicalStatus = 'INACTIVE'; }), /ACTIVE pack/],
  ['unknown canonical course', f => f.patch(`${BASE}/pack.json`, d => { d.standardCourses = ['M1-1']; }), /ACTIVE pack/],
  ['changed source bytes', f => f.put(`archive/exams/${SOURCE}`, fs.readFileSync(path.join(f.root, `archive/exams/${SOURCE}`), 'utf8').replace('기존 학생 지문', 'changed')), /expectedSourceBlob/],
  ['historical fingerprint drift', f => f.patch(IDS, d => { d.records[0].sourceFingerprint = '9'.repeat(64); }), /unapproved preserved/],
  ['runtime classification drift', f => f.patch(RT, d => { d.records[0].templateKey = 'TPL_OTHER'; }), /provenance mismatch/],
  ['prior proof byte drift', f => f.patch(f.proofPath, d => { d.latestAcceptedReview2.decisionId = 'fabricated'; }), /compact R2 proof mismatch/],
  ['omitted supporting UID', f => f.patch(`${BASE}/bindings.json`, d => { d.bindings[0].supportingQuestionUids.push(uid(2)); d.bindings[0].supportingItemCount = 2; }), /before binding missing/],
  ['duplicate runtime UID', f => f.patch(RT, d => d.records.push(d.records[0])), /runtime UID missing\/duplicate/],
  ['prior unapproved metadata', f => f.patch(META, d => { d.records[0].reviewStatus = 'review_required'; }), /unapproved preserved/],
];
for (const [name, mutate, error] of invalidState) test(`refuses ${name}`, async t => {
  const f = await fixture(t); mutate(f); const before = filesSnapshot(f.root);
  await assert.rejects(f.run({ write: true }), error); assert.deepEqual(filesSnapshot(f.root), before);
});

test('computes impact closure independently and refuses a foreign exact-tuple consumer', async t => {
  const f = await fixture(t);
  const extra = { ...f.read(META).records[0], questionUid: uid(3), sourceArchiveFile: 'original/middle/m1/2final/other.js', sourceOrdinal: 1 };
  f.patch(META, d => d.records.push(extra)); f.patch(IDS, d => d.records.push(extra)); f.patch(RT, d => d.records.push(extra));
  await assert.rejects(f.run({ write: true }), /foreign exam/);
});

test('refuses an existing consumer of the old spelling instead of migrating it', async t => {
  const f = await fixture(t); f.patch(META, d => { d.records[0].standardCourse = '中1 수학'; });
  f.patch(RT, d => { d.records[0].standardCourse = '中1 수학'; });
  await assert.rejects(f.run({ write: true }), /old spelling/);
});

test('post-build preservation catches unrelated consumer selection and approval changes', async t => {
  const f = await fixture(t); await f.run({ write: true });
  const initial = f.read('fixture-consumer.json');
  f.patch('fixture-consumer.json', d => { d.page[1].directSelectable = false; });
  await assert.rejects(f.run({ verifyProjection: true }), /consumer classification\/approval\/selection changed/);
  f.put('fixture-consumer.json', initial);
  f.patch('fixture-consumer.json', d => { d.resolved[0].canonicalAssignmentReasons = []; d.resolved[0].assignmentEvidence = { approvalStatus: 'APPROVED', reviewEvidence: { status: 'PASS' } }; });
  await assert.rejects(f.run({ verifyProjection: true }), /consumer classification\/approval\/selection changed/);
  f.put('fixture-consumer.json', initial);
  f.patch('fixture-consumer.json', d => { d.page[1].verifiedEligible = true; });
  await assert.rejects(f.run({ verifyProjection: true }), /consumer classification\/approval\/selection changed/);
});

test('post-write byte/record preservation and receipt collision remain fail-closed', async t => {
  const f = await fixture(t); await f.run({ write: true });
  const original = fs.readFileSync(path.join(f.root, META)); f.patch(META, d => { d.records[1].templateKey = 'UNRELATED_EDIT'; });
  await assert.rejects(f.run({ verifyProjection: true }), /receipt file drift/);
  fs.writeFileSync(path.join(f.root, META), original);
  f.req.reason = 'a different request under the same id';
  await assert.rejects(f.run({ write: true }), /receipt request\/provenance mismatch/);
});

test('write failure rolls every planned output back', async t => {
  const f = await fixture(t), before = filesSnapshot(f.root), original = fs.writeFileSync;
  let armed = true;
  fs.writeFileSync = function(file, ...args) {
    if (armed && String(file) === path.join(f.root, RT)) { armed = false; throw new Error('fixture write failure'); }
    return original.call(fs, file, ...args);
  };
  try { await assert.rejects(f.run({ write: true }), /fixture write failure/); }
  finally { fs.writeFileSync = original; }
  assert.deepEqual(filesSnapshot(f.root), before);
});

test('builder refuses a current source tuple or question number that disagrees with the preserved metadata', async t => {
  const f = await fixture(t), sourcePath = `archive/exams/${SOURCE}`;
  const original = fs.readFileSync(path.join(f.root, sourcePath), 'utf8');
  const rebuild = () => f.module.createBindingCourseCorrectionRequest({ root: f.root, requestId: 'new-source-check',
    sourceArchiveFile: SOURCE, requestedBy: 'fixture-owner', reason: 'same narrow correction', before: f.before });
  f.put(sourcePath, original.replace(`"problemTypeKey":"${PT}"`, '"problemTypeKey":"PT_OTHER"'));
  await assert.rejects(rebuild(), /current source classification mismatch/);
  f.put(sourcePath, original.replace('"id":1', '"id":99'));
  await assert.rejects(rebuild(), /current source question number\/curriculum mismatch/);
  f.put(sourcePath, original.replace('"curriculum":"2022"', '"curriculum":"2015"'));
  await assert.rejects(rebuild(), /current source question number\/curriculum mismatch/);
});

test('concurrent compiler-only input mutation cannot enter the planned transaction', async t => {
  const f = await fixture(t), initial = filesSnapshot(f.root), originalRead = fs.readFileSync;
  const target = `${CANON}/condition_registry.json`; let armed = true;
  fs.readFileSync = function(file, ...args) {
    if (armed && String(file) === path.join(f.root, 'fixture-consumer.json')) {
      armed = false;
      f.patch(target, d => d.conditions.push({ conditionKey: 'COND_UNRELATED', status: 'ACTIVE', canonicalLabelKo: 'unrelated' }));
    }
    return originalRead.call(fs, file, ...args);
  };
  try { await assert.rejects(f.run({ write: true }), /input changed during plan: .*condition_registry/); }
  finally { fs.readFileSync = originalRead; }
  const after = filesSnapshot(f.root); after.delete(target); initial.delete(target);
  assert.deepEqual(after, initial, 'registrar writes nothing; only the injected external mutation remains');
});

test('post-verification derives protected files and rejects a receipt hiding metadata drift', async t => {
  const f = await fixture(t), result = await f.run({ write: true });
  f.patch(result.receiptPath, d => { d.protectedFiles = d.protectedFiles.filter(ref => ref.path !== META); });
  f.patch(META, d => { d.unrelatedAnnotation = 'must not be hidden'; });
  await assert.rejects(f.run({ verifyProjection: true }), /receipt output\/protected file set mismatch/);
});

test('post-verification regenerates deterministic outputs instead of trusting receipt hashes', async t => {
  const f = await fixture(t), result = await f.run({ write: true });
  const target = 'archive/data/meta-foundation/compiled/curriculum_bindings.json';
  f.patch(target, d => { d.unrelatedAnnotation = 'self-declared output'; });
  f.patch(result.receiptPath, d => { d.outputs.find(ref => ref.path === target).sha256 = h(fs.readFileSync(path.join(f.root, target))); });
  await assert.rejects(f.run({ verifyProjection: true }), /receipt output\/protected file set mismatch/);
});

test('post-verification rejects an omitted required output', async t => {
  const f = await fixture(t), result = await f.run({ write: true });
  f.patch(result.receiptPath, d => { d.outputs = d.outputs.filter(ref => ref.path !== PACK); });
  await assert.rejects(f.run({ verifyProjection: true }), /receipt output\/protected file set mismatch/);
});

test('post-verification requires exactly one patch version, not a receipt-declared version', async t => {
  const f = await fixture(t), result = await f.run({ write: true });
  f.patch(result.receiptPath, d => { d.packVersionAfter = '9.9.9'; });
  f.patch(`${BASE}/pack.json`, d => { d.packVersion = '9.9.9'; });
  f.patch(RT, d => { d.packVersion = '9.9.9'; d.runtimeVersion = 'MIDDLE1@9.9.9/reviewed-exam-v2'; });
  await assert.rejects(f.run({ verifyProjection: true }), /receipt request\/provenance mismatch/);
});

test('derived index reconstruction refuses unrelated index changes', async t => {
  const f = await fixture(t), result = await f.run({ write: true }), target = `${CANON}/registry_index.json`;
  f.patch(target, d => { d.unrelatedAnnotation = 'cannot be smuggled into a derived index'; });
  f.patch(result.receiptPath, d => { d.outputs.find(ref => ref.path === target).sha256 = h(fs.readFileSync(path.join(f.root, target))); });
  await assert.rejects(f.run({ verifyProjection: true }), /mutation beyond.*derived index/);
});

test('new schema participates in dispatch, projection verification and the shared final consumer gate', () => {
  const schema = 'archive-binding-course-correction-request-v1';
  const dispatcher = fs.readFileSync(path.join(repo, 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs'), 'utf8');
  const pass = fs.readFileSync(path.join(repo, 'tools/ci/reviewed-meta-register-pass.sh'), 'utf8');
  const gate = fs.readFileSync(path.join(repo, 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs'), 'utf8');
  const collect = fs.readFileSync(path.join(repo, 'tools/ci/collect-reviewed-consumer-refusals.mjs'), 'utf8');
  const final = fs.readFileSync(path.join(repo, 'tools/ci/verify-registered-consumer-approval.sh'), 'utf8');
  assert.ok(dispatcher.includes(schema) && dispatcher.includes('await registerBindingCourseCorrection'));
  assert.ok(pass.includes('archive-binding-course-correction.test.mjs'));
  assert.match(pass, /schema.*archive-binding-course-correction-request-v1.*\]\]; then[\s\S]*?--verify-projection/);
  assert.ok(gate.includes('verifyBindingCourseCorrectionWithConsumer({ root, request: unit.request, consumer })'));
  assert.ok(collect.includes('verifyChangedUidConsumerApproval') && collect.includes('VALUE_MISMATCH'));
  assert.ok(final.includes('verify-changed-uid-consumer-approval.mjs'));
});

async function multiSourceFixture(t) {
  const f = await fixture(t), first = f.read(META).records[0];
  const additional = [3, 4, 5, 6].map(n => ({ ...first, questionUid: uid(n),
    sourceArchiveFile: n === 6 ? SOURCE_2 : SOURCE, sourceOrdinal: n === 6 ? 1 : n,
    sourceQuestionNo: String(n === 6 ? 1 : n), sourceFingerprint: h(`historical-${n}`) }));
  // Only the original UID is in supportingQuestionUids. The builder must also
  // discover all four exact metadata/runtime consumers, including source 2.
  f.patch(META, d => d.records.push(...additional));
  f.patch(IDS, d => d.records.push(...additional.map(r => Object.fromEntries(
    ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'sourceFingerprint'].map(k => [k, r[k]])))));
  f.patch(RT, d => d.records.push(...additional));
  for (const source of [SOURCE, SOURCE_2]) {
    const rows = f.read(META).records.filter(r => r.sourceArchiveFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
    f.put(`archive/exams/${source}`, `window.questionBank=${JSON.stringify(rows.map(r => ({ id: r.sourceOrdinal,
      content: 'unchanged synthetic question', ...Object.fromEntries(['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'].map(k => [k, r[k]])) })))};\n`);
  }
  const baseProof = f.read(f.proofPath);
  for (const row of additional) {
    const proof = { ...baseProof, questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile,
      sourceOrdinal: row.sourceOrdinal, sourceFingerprint: row.sourceFingerprint };
    const file = `archive/data/meta-foundation/evidence/review-overrides/v1/${row.questionUid}.json`;
    f.put(file, proof);
    f.patch('archive/data/archive2-item-review-overrides.json', d => d.records.push({ ...proof,
      evidenceReference: file.slice('archive/'.length), evidenceSha256: h(j(proof)) }));
  }
  f.patch('fixture-consumer.json', d => {
    for (const row of additional) {
      const resolved = { ...d.resolved[0], questionUid: row.questionUid, sourceFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal };
      d.resolved.push(resolved); d.page.push({ ...resolved, directSelectable: true });
    }
  });
  f.build = () => f.module.createBindingCourseCorrectionRequestV2({ root: f.root, requestId: 'test-shared-binding-spelling',
    requestedBy: 'fixture-owner', reason: 'One shared binding spelling, all existing approvals preserved', before: f.before });
  f.req = await f.build();
  f.run = opts => f.module.registerBindingCourseCorrection({ root: f.root, request: f.req, ...opts });
  f.secondProof = `archive/data/meta-foundation/evidence/review-overrides/v1/${uid(6)}.json`;
  return f;
}

test('v2 derives all consumers and both sources, preserves every runtime row, and replays without approval', async t => {
  const f = await multiSourceFixture(t), initial = filesSnapshot(f.root), runtime = f.read(RT);
  assert.equal(f.req.schemaVersion, 'archive-binding-course-correction-request-v2');
  assert.deepEqual(f.req.sourceSnapshots.map(s => s.sourceArchiveFile), [SOURCE_2, SOURCE].sort());
  assert.deepEqual(f.req.sourceSnapshots.map(s => s.expectedQuestionCount), [1, 5]);
  assert.equal(f.req.preservedConsumers.length, 5);
  assert.equal(f.req.preservedConsumers.filter(r => r.sourceOrdinal === 1).length, 2, 'same ordinal in two sources remains two UIDs');
  assert.ok(f.req.beforeFiles.some(r => r.path === `archive/exams/${SOURCE_2}`));
  assert.ok(f.req.beforeFiles.some(r => r.path === f.secondProof));
  const dry = await f.run({});
  assert.equal(dry.affectedBindingUidCount, 5); assert.equal(dry.checkedRuntimeUids, 6);
  assert.deepEqual(filesSnapshot(f.root), initial);
  const result = await f.run({ write: true });
  assert.equal(result.status, 'REGISTERED_CORRECTION');
  assert.deepEqual(f.read(RT).records, runtime.records);
  for (const p of [META, IDS, `archive/exams/${SOURCE}`, `archive/exams/${SOURCE_2}`, f.proofPath, f.secondProof, 'archive/data/archive2-item-review-overrides.json'])
    assert.equal(h(fs.readFileSync(path.join(f.root, p))), initial.get(p));
  const receipt = f.read(result.receiptPath);
  assert.equal(receipt.schemaVersion, 'archive-binding-course-correction-receipt-v2');
  assert.equal(receipt.approvalCreated, false); assert.equal(receipt.metadataApprovalStatus, 'NOT_CREATED');
  assert.deepEqual(receipt.sourceSnapshots, f.req.sourceSnapshots);
  assert.equal((await f.run({ verifyProjection: true })).checkedRuntimeUids, 6);
  assert.equal((await f.run({ write: true })).status, 'REPLAY');
});

const invalidV2Requests = [
  ['missing source', f => { f.req.sourceSnapshots = f.req.sourceSnapshots.filter(s => s.sourceArchiveFile !== SOURCE_2); }, /sourceSnapshots/],
  ['extra source', f => { f.req.sourceSnapshots.push({ ...f.req.sourceSnapshots[0], sourceArchiveFile: SOURCE.replace('정정', '추가') }); f.req.sourceSnapshots.sort((a, b) => a.sourceArchiveFile < b.sourceArchiveFile ? -1 : 1); }, /sourceSnapshots/],
  ['duplicate source', f => { f.req.sourceSnapshots.push(f.req.sourceSnapshots[0]); }, /duplicate sourceArchiveFile/],
  ['second source raw hash', f => { f.req.sourceSnapshots.find(s => s.sourceArchiveFile === SOURCE_2).expectedSourceSha256 = '0'.repeat(64); }, /sourceSnapshots/],
  ['second source blob', f => { f.req.sourceSnapshots.find(s => s.sourceArchiveFile === SOURCE_2).expectedSourceBlobSha1 = '0'.repeat(40); }, /sourceSnapshots/],
  ['second source count', f => { f.req.sourceSnapshots.find(s => s.sourceArchiveFile === SOURCE_2).expectedQuestionCount++; }, /sourceSnapshots/],
  ['missing derived consumer', f => { f.req.preservedConsumers = f.req.preservedConsumers.filter(r => r.questionUid !== uid(6)); }, /consumer set\/hash/],
  ['cross-source consumer substitution', f => { f.req.preservedConsumers.find(r => r.questionUid === uid(6)).sourceArchiveFile = SOURCE; }, /consumer set\/hash/],
  ['arbitrary source allowlist', f => { f.req.sourceArchiveFiles = [SOURCE]; }, /no approval/],
  ['approval injection', f => { f.req.approval = { type: 'FINAL_QA' }; }, /no approval/],
  ['second binding delta', f => { f.req.correction.extra = { standardCourse: '중1 수학' }; }, /no approval/],
  ['non-course change', f => { f.req.correction.after.subUnitKey = 'DIFFERENT'; }, /only the literal/],
];
for (const [name, mutate, error] of invalidV2Requests) test(`v2 refuses ${name} without writes`, async t => {
  const f = await multiSourceFixture(t); mutate(f); const before = filesSnapshot(f.root);
  await assert.rejects(f.run({ write: true }), error); assert.deepEqual(filesSnapshot(f.root), before);
});

const invalidV2State = [
  ['second source drift', f => f.put(`archive/exams/${SOURCE_2}`, fs.readFileSync(path.join(f.root, `archive/exams/${SOURCE_2}`), 'utf8') + '// changed\n'), /sourceSnapshots/],
  ['second source missing', f => fs.rmSync(path.join(f.root, `archive/exams/${SOURCE_2}`)), /ENOENT/],
  ['second proof drift', f => f.patch(f.secondProof, d => { d.latestAcceptedReview2.decisionId = 'changed'; }), /compact R2 proof mismatch/],
  ['second proof removed', f => fs.rmSync(path.join(f.root, f.secondProof)), /ENOENT/],
  ['second consumer unapproved', f => f.patch(META, d => { d.records.find(r => r.questionUid === uid(6)).reviewStatus = 'review_required'; }), /unapproved preserved/],
  ['second identity source mismatch', f => f.patch(IDS, d => { d.records.find(r => r.questionUid === uid(6)).sourceArchiveFile = SOURCE; }), /unapproved preserved/],
  ['second historical fingerprint mismatch', f => f.patch(IDS, d => { d.records.find(r => r.questionUid === uid(6)).sourceFingerprint = '0'.repeat(64); }), /unapproved preserved/],
  ['second runtime missing', f => f.patch(RT, d => { d.records = d.records.filter(r => r.questionUid !== uid(6)); }), /incomplete consumer/],
  ['correct binding duplicate', f => f.patch(`${BASE}/bindings.json`, d => d.bindings.push(f.req.correction.after)), /duplicate old\/corrected/],
];
for (const [name, mutate, error] of invalidV2State) test(`v2 refuses ${name}`, async t => {
  const f = await multiSourceFixture(t); mutate(f); const before = filesSnapshot(f.root);
  await assert.rejects(f.run({ write: true }), error); assert.deepEqual(filesSnapshot(f.root), before);
});

test('v2 builder refuses a caller-selected source subset and an unknown derived source', async t => {
  const f = await multiSourceFixture(t);
  await assert.rejects(f.module.createBindingCourseCorrectionRequestV2({ root: f.root, requestId: 'subset', requestedBy: 'owner',
    reason: 'subset', before: f.before, sourceArchiveFiles: [SOURCE] }), /no source\/UID allowlist/);
  for (const p of [META, IDS, RT]) f.patch(p, d => { d.records.find(r => r.questionUid === uid(6)).sourceArchiveFile = 'unknown/source.js'; });
  await assert.rejects(f.build(), /derived source is not an original M1 exam/);
});

test('v2 replay re-derives closure when request and receipt jointly omit source 2', async t => {
  const f = await multiSourceFixture(t), result = await f.run({ write: true });
  f.req.sourceSnapshots = f.req.sourceSnapshots.filter(s => s.sourceArchiveFile !== SOURCE_2);
  f.req.preservedConsumers = f.req.preservedConsumers.filter(r => r.sourceArchiveFile !== SOURCE_2);
  f.patch(result.receiptPath, d => { d.sourceSnapshots = f.req.sourceSnapshots; d.preservedConsumers = f.req.preservedConsumers;
    d.requestSha256 = h(f.module.stableBindingCorrectionJson(f.req)); });
  await assert.rejects(f.run({ verifyProjection: true }), /registered source\/consumer closure mismatch/);
});

test('v2 replay refuses jointly omitted second-source protected inputs', async t => {
  const f = await multiSourceFixture(t), result = await f.run({ write: true });
  const hidden = new Set([`archive/exams/${SOURCE_2}`, f.secondProof]);
  f.req.beforeFiles = f.req.beforeFiles.filter(ref => !hidden.has(ref.path));
  f.patch(result.receiptPath, d => { d.protectedFiles = d.protectedFiles.filter(ref => !hidden.has(ref.path));
    d.requestSha256 = h(f.module.stableBindingCorrectionJson(f.req)); });
  await assert.rejects(f.run({ verifyProjection: true }), /registered source\/proof input omitted/);
});

test('v2 preserves unrelated runtime consumer approval and selection; write failure rolls back', async t => {
  const f = await multiSourceFixture(t), before = filesSnapshot(f.root), original = fs.writeFileSync;
  let armed = true;
  fs.writeFileSync = function(file, ...args) {
    if (armed && String(file) === path.join(f.root, RT)) { armed = false; throw new Error('v2 fixture write failure'); }
    return original.call(fs, file, ...args);
  };
  try { await assert.rejects(f.run({ write: true }), /v2 fixture write failure/); }
  finally { fs.writeFileSync = original; }
  assert.deepEqual(filesSnapshot(f.root), before);
  await f.run({ write: true });
  const consumer = f.read('fixture-consumer.json');
  f.patch('fixture-consumer.json', d => { d.page.find(r => r.questionUid === uid(2)).directSelectable = false; });
  await assert.rejects(f.run({ verifyProjection: true }), /consumer classification\/approval\/selection changed/);
  f.put('fixture-consumer.json', consumer);
  f.patch('fixture-consumer.json', d => { d.resolved.find(r => r.questionUid === uid(6)).assignmentEvidence = { approvalStatus: 'APPROVED' }; });
  await assert.rejects(f.run({ verifyProjection: true }), /consumer classification\/approval\/selection changed/);
});

test('v2 actual dispatch and shared gate bind both sources and retain one collector unit', async t => {
  const f = await multiSourceFixture(t);
  // Exercise the real routing/checking code with the same explicitly synthetic
  // consumer dependency used above, not a second hand-written verifier.
  const gatePath = 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
  const raw = fs.readFileSync(path.join(repo, gatePath), 'utf8');
  const loader = /export function loadConsumer\(root\) \{[\s\S]*?\n\}\n\nfunction findMetaPipelineRuntime/;
  assert.ok(loader.test(raw));
  f.put(gatePath, raw.replace(loader, `export function loadConsumer(root) {
    const d = JSON.parse(fs.readFileSync(path.join(root, 'fixture-consumer.json'), 'utf8'));
    return {resolvedBySource:new Map(d.resolved.map(r=>[r.sourceFile+'#'+r.sourceOrdinal,r])),
      pageByUid:new Map(d.page.map(r=>[r.questionUid,r]))};
  }\n\nfunction findMetaPipelineRuntime`));
  f.put('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs', 'export function loadResolvedConsumerCatalog(){throw new Error("unused fixture dependency");}\n');
  f.put('archive/tools/meta-foundation/register-difficulty5.mjs', 'export function bindDifficulty5Source(){throw new Error("unused fixture dependency");}\n');
  for (const name of ['register-reviewed-exam-meta-source.mjs', 'reviewed-runtime-summary.mjs'])
    f.put(`archive/tools/meta-foundation/${name}`, fs.readFileSync(path.join(repo, 'archive/tools/meta-foundation', name), 'utf8'));
  const requestFile = 'shared-request.json'; f.put(requestFile, f.req);
  const dispatch = flags => spawnSync(process.execPath, [path.join(f.root, 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs'),
    '--repo-root', f.root, '--request', requestFile, ...flags], { cwd: f.root, encoding: 'utf8' });
  for (const [flags, status] of [[[], 'DRY_RUN'], [['--write'], 'REGISTERED_CORRECTION'], [['--verify-projection'], 'PASS']]) {
    const out = dispatch(flags); assert.equal(out.status, 0, out.stderr); assert.equal(JSON.parse(out.stdout).status, status);
  }
  const gate = await import(pathToFileURL(path.join(f.root, gatePath)).href + '?routing-test');
  const verify = () => gate.verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [requestFile] });
  const result = verify();
  assert.equal(result.status, 'PASS', JSON.stringify(result.failures));
  assert.deepEqual(result.counts, { changed: 5, checked: 5, passed: 5, skippedUnchanged: 0 });
  assert.equal(result.exams.length, 1); assert.equal(result.exams[0].exam, f.req.requestId);
  assert.equal(result.exams[0].preservedRuntimeUids, 6); assert.equal(result.exams[0].approvalCreated, false);
  assert.deepEqual(collectConsumerRefusals(result, [requestFile], f.root), []);
  f.put(`archive/exams/${SOURCE_2}`, fs.readFileSync(path.join(f.root, `archive/exams/${SOURCE_2}`), 'utf8') + '// changed\n');
  const failed = verify();
  assert.equal(failed.status, 'FAIL'); assert.equal(failed.counts.checked, 0);
  assert.equal(failed.failures[0].reason, 'SOURCE_BLOB_MISMATCH'); assert.equal(failed.failures[0].exam, f.req.requestId);
  assert.deepEqual(collectConsumerRefusals(failed, [requestFile], f.root).map(r => r.request), [requestFile]);
  f.req.sourceSnapshots[0].sourceArchiveFile = 'original/middle/m1/2final/..\\..\\outside.js';
  f.put(requestFile, f.req);
  const malformed = verify();
  assert.equal(malformed.failures[0].reason, 'INVALID_REQUEST', 'reject a backslash path before source normalization or reading');
});
