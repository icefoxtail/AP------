import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  ISSUED_RPM_HISTORY_SCHEMA, hasIssuedRpmHistory, loadIssuedRpmHistory,
  assertIssuedRpmHistoricalLeaf, readIssuedRpmHistoricalEvidence, readIssuedRpmCurrentState
} from '../archive/tools/meta-foundation/native-issued-rpm-history.mjs';
import { nativeReviewedFigureRebind } from '../archive/tools/meta-foundation/native-reviewed-figure-reuse.mjs';
import { nativeReviewedRendererRebind } from '../archive/tools/meta-foundation/native-reviewed-renderer-reuse.mjs';

const CROSS = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SOURCE = 'original/middle/m2/1mid/unit-test.js';
const META = 'archive/data/question_metadata.json', IDS = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/middle2-v1.json';
const UID = 'qid_v1_issued_rpm_test_one';
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const json = x => Buffer.from(JSON.stringify(x, null, 2) + '\n');
const source = rows => Buffer.from(`window.questionBank = ${JSON.stringify(rows)};\n`);
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
function fixture(t, questionFields = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'issued-rpm-history-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (rel, value) => {
    const full = path.join(root, rel); fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, Buffer.isBuffer(value) ? value : json(value));
  };
  const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel)));
  const rpmPath = { majorUnit: 'unit', midUnit: 'subunit', l3: 'concept', l4: 'method' };
  const question = { id: 1, content: 'synthetic question', choices: ['a', 'b'], answer: 'a', solution: 'synthetic solution',
    courseKey: 'M2-1', curriculum: '2022', rpmPrimaryId: 'M2-RPM-TEST', rpmPrimaryPath: rpmPath,
    rpmL1: 'unit', rpmL2: 'subunit', rpmL3: 'concept', rpmL4: 'method', ...questionFields };
  const oldBank = [question, { id: 2, content: 'unselected synthetic neighbour', producer: 'old' }];
  const oldBytes = source(oldBank);
  const oldCross = { schemaVersion: 'rpm-primary-active-crosswalk-v1', status: 'ACTIVE_REFERENCE',
    rpmAuthority: { source: MASTER }, records: [
      { id: 'M2-RPM-TEST', curriculum: '2022', scope: 'M2-1', rpmPath },
      { id: 'M2-RPM-UNSELECTED', curriculum: '2022', scope: 'M2-1', rpmPath }
    ], summary: { count: 2 } };
  const master = { schemaVersion: 'js-archive-taxonomy-rpm-primary-v1.0', authorityStatus: 'LOCKED', records: [
    { curriculum: '2022', scope: 'M2-1', majorUnit: 'unit', midUnit: 'subunit', concepts: [
      { concept: 'concept', problemTypes: [{ problemType: 'method' }] }
    ] }
  ] };
  const proofPath = '.archive-meta-register/evidence/unit/approval.json', proof = { role: 'synthetic original immutable authority input' };
  const crosswalkRef = { path: CROSS, sha256: sha(json(oldCross)) }, masterRef = { path: MASTER, sha256: sha(json(master)) };
  const priorId = 'issued-rpm-original', priorPath = RECEIPTS + priorId + '.json';
  const approval = { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'synthetic-independent-reviewer',
    evidenceRefs: [{ path: proofPath, sha256: sha(json(proof)) }, masterRef, crosswalkRef] };
  const current = { questionUid: UID, sourceArchiveFile: SOURCE, sourceOrdinal: 1, sourceQuestionNo: '1',
    metadataApprovalType: 'FINAL_QA', metaFoundationPackId: 'MIDDLE2', metaFoundationPackVersion: '1.0.7',
    courseKey: 'M2-1', curriculum: '2022', curriculumKey: '2022', rpmPrimaryId: question.rpmPrimaryId,
    rpmPrimaryPath: rpmPath, rpmL1: 'unit', rpmL2: 'subunit', rpmL3: 'concept', rpmL4: 'method',
    metadataRevision: `meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${priorId}`, approvalEvidence: [priorPath] };
  const identity = { questionUid: UID, sourceArchiveFile: SOURCE, sourceOrdinal: 1, sourceQuestionNo: '1', sourceFingerprint: 'original' };
  const runtimeRecord = { ...current, sourceIdentity: SOURCE + '#1' };
  const prior = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
    requestId: priorId, requestSha256: 'a'.repeat(64), examUid: 'exam-unit', sourceArchiveFile: SOURCE,
    sourceBlobSha1: blob(oldBytes), sourceRawSha256: sha(oldBytes), scope: 'PARTIAL_UIDS', partialUidCount: 1,
    totalQuestions: 1, expectedQuestionCount: 2, approval, registryChanges: [], fingerprintRepairs: [],
    appliedRecords: [current], appliedIdentityRecords: [identity], runtimeRecords: [runtimeRecord],
    rpmPrimaryBindings: [{ questionUid: UID, sourceOrdinal: 1, recordId: question.rpmPrimaryId, crosswalkRef, masterRef,
      curriculum: '2022', scope: 'M2-1', rpmPath, authorityUse: 'RPM_PATH_PROVENANCE_ONLY', selectsPtTpl: false }] };
  write(CROSS, oldCross); write(MASTER, master); write(proofPath, proof); write('archive/exams/' + SOURCE, oldBytes);
  write(priorPath, prior); write(META, { records: [current] }); write(IDS, { records: [identity] });
  write(RUNTIME, { packId: 'MIDDLE2', status: 'ACTIVE', records: [runtimeRecord] });
  git(root, 'init', '--quiet'); git(root, 'config', 'user.name', 'Unit Fixture'); git(root, 'config', 'user.email', 'unit@example.invalid');
  git(root, 'add', '.'); git(root, 'commit', '--quiet', '-m', 'synthetic issued predecessor');
  const priorCommit = git(root, 'rev-parse', 'HEAD');
  const bank = structuredClone(oldBank); bank[1].producer = 'current';
  const bytes = source(bank); write('archive/exams/' + SOURCE, bytes);
  const cross = structuredClone(oldCross); cross.records.push({ id: 'M2-RPM-ADDED', curriculum: '2022', scope: 'M2-1', rpmPath });
  cross.summary.count = 3; write(CROSS, cross);
  const priorRef = { path: priorPath, sha256: sha(json(prior)) };
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'issued-rpm-preserve',
    examUid: prior.examUid, sourceArchiveFile: SOURCE, expectedSourceBlobSha1: blob(bytes), expectedQuestionCount: 2,
    scope: 'PARTIAL_UIDS', registryChanges: [], approval: { type: 'FINAL_QA', metadataReviewed: true,
      approvedBy: approval.approvedBy, evidenceRefs: [priorRef], sourceRebind: { priorReceiptRef: priorRef,
        historicalRpmEvidence: { schemaVersion: ISSUED_RPM_HISTORY_SCHEMA, priorReceiptCommit: priorCommit } } },
    items: [{ questionUid: UID, sourceOrdinal: 1, before: {}, after: {}, reason: 'source-only synthetic preservation', evidenceRefs: [priorRef] }] };
  write('.archive-meta-register/inbox/' + request.requestId + '.json', request);
  git(root, 'add', '.'); git(root, 'commit', '--quiet', '-m', 'synthetic append-only canonical update');
  const input = () => ({ root, envelope: request, bytes, bank, ...readIssuedRpmCurrentState(root, request) });
  return { root, write, read, request, prior, priorPath, priorRef, priorCommit, oldBytes, oldBank, bytes, bank, cross,
    oldCross, proofPath, current, identity, runtimeRecord, input };
}

test('issued RPM history authenticates one old FINAL_QA approval while retaining the live crosswalk', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.root, CROSS));
  const context = loadIssuedRpmHistory(f.input());
  assert.equal(context.descriptor.oldRowCount, 2); assert.equal(context.descriptor.currentRowCount, 3);
  assert.equal(context.descriptor.newMetadataApprovals, 0);
  assert.notEqual(context.descriptor.currentCrosswalkRef.sha256, context.descriptor.historicalCrosswalkRef.sha256);
  const old = readIssuedRpmHistoricalEvidence(context, f.prior, f.prior.rpmPrimaryBindings[0].crosswalkRef);
  assert.equal(sha(old), f.prior.rpmPrimaryBindings[0].crosswalkRef.sha256);
  assert.deepEqual(fs.readFileSync(path.join(f.root, CROSS)), before);
  assertIssuedRpmHistoricalLeaf({ context, receipt: f.prior, current: f.current, identity: f.identity, ordinal: 1,
    nativeSource: { root: f.root, bytes: f.oldBytes, blobSha1: f.prior.sourceBlobSha1, bank: f.oldBank, runtimeRecord: f.runtimeRecord } });
});

test('issued RPM history accepts an add-only grown LOCKED master and returns the pinned master bytes', t => {
  const f = fixture(t), grown = f.read(MASTER);
  grown.records[0].concepts.push({ concept: 'added concept', problemTypes: [{ problemType: 'added method' }] });
  grown.records.push({ curriculum: '2022', scope: 'M2-1', majorUnit: 'added unit', midUnit: 'added sub', concepts: [] });
  f.write(MASTER, grown);
  const context = loadIssuedRpmHistory(f.input()), ref = f.prior.rpmPrimaryBindings[0].masterRef;
  assert.notEqual(sha(fs.readFileSync(path.join(f.root, MASTER))), ref.sha256);
  assert.equal(sha(readIssuedRpmHistoricalEvidence(context, f.prior, ref)), ref.sha256);
  assert.equal(context.descriptor.masterRef.sha256, ref.sha256);
});

test('ordinary requests and fabricated context tokens cannot acquire historical authority', t => {
  const f = fixture(t), request = structuredClone(f.request); delete request.approval.sourceRebind.historicalRpmEvidence;
  assert.equal(hasIssuedRpmHistory(request), false);
  assert.equal(loadIssuedRpmHistory({ ...f.input(), envelope: request }), null);
  assert.throws(() => readIssuedRpmHistoricalEvidence({ descriptor: {} }, f.prior, f.priorRef), /authenticated original approval/);
});

test('issued RPM history rejects changed canonical rows, master and original evidence', async t => {
  const mutations = [
    ['selected RPM row', f => { const d = f.read(CROSS); d.records[0].rpmPath.l4 = 'changed'; f.write(CROSS, d); }, /old RPM row/],
    ['unselected old RPM row', f => { const d = f.read(CROSS); d.records[1].scope = 'M2-2'; f.write(CROSS, d); }, /old RPM row/],
    ['removed old RPM row', f => { const d = f.read(CROSS); d.records.splice(1, 1); f.write(CROSS, d); }, /old RPM row/],
    ['duplicate old RPM ID', f => { const d = f.read(CROSS); d.records.push(d.records[0]); f.write(CROSS, d); }, /duplicate or invalid RPM/],
    ['canonical authority property', f => { const d = f.read(CROSS); d.status = 'PENDING'; f.write(CROSS, d); }, /authority changed/],
    ['LOCKED master bytes', f => { const d = f.read(MASTER); d.extra = 'changed'; f.write(MASTER, d); }, /non-RPM current evidence|master bytes/],
    ['LOCKED master node renamed', f => { const d = f.read(MASTER); d.records[0].concepts[0].concept = 'renamed'; f.write(MASTER, d); }, /non-RPM current evidence|master bytes/],
    ['LOCKED master node removed', f => { const d = f.read(MASTER); d.records[0].concepts[0].problemTypes = []; f.write(MASTER, d); }, /non-RPM current evidence|master bytes/],
    ['LOCKED master status changed', f => { const d = f.read(MASTER); d.authorityStatus = 'DRAFT'; f.write(MASTER, d); }, /non-RPM current evidence|master bytes/],
    ['non-RPM evidence bytes', f => f.write(f.proofPath, { role: 'changed' }), /non-RPM current evidence/],
    ['predecessor receipt bytes', f => { const d = f.read(f.priorPath); d.approval.approvedBy = 'other'; f.write(f.priorPath, d); }, /receipt digest/],
    ['truthful replacement predecessor hash', f => { const d = f.read(f.priorPath); d.approval.approvedBy = 'other'; f.write(f.priorPath, d); const ref = { path: f.priorPath, sha256: sha(json(d)) }; f.request.approval.sourceRebind.priorReceiptRef = ref; f.request.approval.evidenceRefs = [ref]; f.request.items[0].evidenceRefs = [ref]; }, /receipt digest/]
  ];
  for (const [name, change, error] of mutations) await t.test(name, st => {
    const f = fixture(st); change(f); assert.throws(() => loadIssuedRpmHistory(f.input()), error);
  });
});

test('issued RPM history rejects changed selection, source and actual state before registration', async t => {
  const cases = [
    ['new approval author', f => { f.request.approval.approvedBy = 'different'; }, /approval fields/],
    ['after semantic value', f => { f.request.items[0].after.templateKey = 'NEW'; }, /value-free item/],
    ['registry mutation', f => { f.request.registryChanges.push({ path: 'new' }); }, /exclusive M2S1/],
    ['another selected UID', f => { f.request.items.push(structuredClone(f.request.items[0])); }, /one selected UID/],
    ['wrong prior commit', f => { f.request.approval.sourceRebind.historicalRpmEvidence.priorReceiptCommit = git(f.root, 'rev-parse', 'HEAD'); }, /source snapshot/],
    ['unknown marker field', f => { f.request.approval.sourceRebind.historicalRpmEvidence.bypass = true; }, /explicit historical/],
    ['wrong schema', f => { f.request.approval.sourceRebind.historicalRpmEvidence.schemaVersion = 'unknown'; }, /explicit historical/],
    ['source header mismatch', f => { f.request.expectedSourceBlobSha1 = '1'.repeat(40); }, /source snapshot/],
    ['actual metadata value', f => { const d = f.read(META); d.records[0].courseKey = 'M2-2'; f.write(META, d); }, /selected current metadata/],
    ['actual identity value', f => { const d = f.read(IDS); d.records[0].sourceFingerprint = 'changed'; f.write(IDS, d); }, /selected current metadata/],
    ['actual runtime value', f => { const d = f.read(RUNTIME); d.records[0].rpmL4 = 'changed'; f.write(RUNTIME, d); }, /selected current metadata/]
  ];
  for (const [name, change, error] of cases) await t.test(name, st => {
    const f = fixture(st); change(f); assert.throws(() => loadIssuedRpmHistory(f.input()), error);
  });
  await t.test('changed selected whole question with truthful source hashes', st => {
    const f = fixture(st), changed = structuredClone(f.bank); changed[0].answer = 'b'; const bytes = source(changed);
    f.request.expectedSourceBlobSha1 = blob(bytes); f.write('archive/exams/' + SOURCE, bytes);
    assert.throws(() => loadIssuedRpmHistory({ ...f.input(), bytes, bank: changed }), /selected whole question/);
  });
  await t.test('supplied old metadata cannot replace live changed data', st => {
    const f = fixture(st), input = f.input(), d = f.read(META); d.records[0].courseKey = 'M2-2'; f.write(META, d);
    assert.throws(() => loadIssuedRpmHistory(input), /live current tables/);
  });
  await t.test('unrelated Git history cannot authenticate the predecessor', st => {
    const f = fixture(st), tree = git(f.root, 'rev-parse', f.priorCommit + '^{tree}');
    const orphan = git(f.root, 'commit-tree', tree, '-m', 'unrelated synthetic history');
    f.request.approval.sourceRebind.historicalRpmEvidence.priorReceiptCommit = orphan;
    assert.throws(() => loadIssuedRpmHistory(f.input()), /immutable Git input unavailable/);
  });
});

function issued(f) {
  const receiptPath = RECEIPTS + f.request.requestId + '.json';
  const approvalEvidence = [...f.current.approvalEvidence, receiptPath];
  const metadataRevision = `meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${f.request.requestId}`;
  const current = { ...f.current, approvalEvidence, metadataRevision };
  const runtimeRecord = { ...f.runtimeRecord, approvalEvidence, metadataRevision };
  const receipt = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: f.request.requestId,
    requestSha256: sha(stable(f.request)), examUid: f.request.examUid, sourceArchiveFile: SOURCE,
    sourceBlobSha1: blob(f.bytes), sourceRawSha256: sha(f.bytes), approval: structuredClone(f.request.approval),
    metadataRegistrationStatus: 'REGISTERED', scope: 'PARTIAL_UIDS', partialUidCount: 1, totalQuestions: 1,
    expectedQuestionCount: 2, registryChanges: [], fingerprintRepairs: [], newMetadataApprovals: 0,
    preservedMetadataApprovals: 1, appliedRecords: [current], appliedIdentityRecords: [f.identity], runtimeRecords: [runtimeRecord] };
  f.write(receiptPath, receipt);
  return { receipt, receiptPath, input: { root: f.root, envelope: receipt, bytes: f.bytes, bank: f.bank, current, identity: f.identity, runtimeRecord } };
}

test('issued RPM preservation requires exact reconstructed evidence, revision, identity and values on reuse', async t => {
  const f = fixture(t), applied = issued(f);
  assert.equal(loadIssuedRpmHistory(applied.input).descriptor.newMetadataApprovals, 0);
  const cases = [
    ['revision', x => { x.appliedRecords[0].metadataRevision += '-changed'; }],
    ['evidence append', x => { x.appliedRecords[0].approvalEvidence.pop(); }],
    ['new approval count', x => { x.newMetadataApprovals = 1; }],
    ['preserved count', x => { x.preservedMetadataApprovals = 2; }],
    ['arbitrary pack version', x => { x.appliedRecords[0].metaFoundationPackVersion = '9.0.0'; }],
    ['approval value', x => { x.appliedRecords[0].rpmL4 = 'changed'; }],
    ['identity', x => { x.appliedIdentityRecords[0].sourceFingerprint = 'changed'; }],
    ['runtime', x => { x.runtimeRecords[0].courseKey = 'M2-2'; }]
  ];
  for (const [name, change] of cases) await t.test(name, st => {
    const next = fixture(st), a = issued(next); change(a.receipt); next.write(a.receiptPath, a.receipt);
    assert.throws(() => loadIssuedRpmHistory({ ...a.input, current: a.receipt.appliedRecords[0],
      identity: a.receipt.appliedIdentityRecords[0], runtimeRecord: a.receipt.runtimeRecords[0] }), /original authority or values/);
  });
});

test('historical descriptors are immutable and later unrelated appends remain independently verified', t => {
  const f = fixture(t), context = loadIssuedRpmHistory(f.input());
  assert(Object.isFrozen(context)); assert(Object.isFrozen(context.descriptor)); assert(Object.isFrozen(context.descriptor.priorReceiptRef));
  assert.throws(() => { context.descriptor.priorReceiptRef.sha256 = '0'.repeat(64); }, TypeError);
  const current = f.read(CROSS); current.records.push({ ...current.records[2], id: 'M2-RPM-LATER' }); current.summary.count++;
  f.write(CROSS, current);
  const newer = loadIssuedRpmHistory(f.input()); assert.equal(newer.descriptor.currentRowCount, 4);
  assert.equal(sha(readIssuedRpmHistoricalEvidence(context, f.prior, f.prior.rpmPrimaryBindings[0].crosswalkRef)),
    f.prior.rpmPrimaryBindings[0].crosswalkRef.sha256);
  current.records[0].scope = 'M2-2'; f.write(CROSS, current);
  assert.throws(() => readIssuedRpmHistoricalEvidence(context, f.prior, f.prior.rpmPrimaryBindings[0].crosswalkRef), /old RPM row/);
});

test('post-write selection accepts only this request and its exact reconstructed issued state', async t => {
  const f = fixture(t), before = loadIssuedRpmHistory(f.input()).descriptor, applied = issued(f);
  f.write(META, { records: [applied.input.current] });
  f.write(RUNTIME, { packId: 'MIDDLE2', status: 'ACTIVE', records: [applied.input.runtimeRecord] });
  assert.deepEqual(loadIssuedRpmHistory(f.input()).descriptor, before);
  const cases = [
    ['different issued request digest', (x, a) => { a.receipt.requestSha256 = '0'.repeat(64); x.write(a.receiptPath, a.receipt); }, /post-write request/],
    ['changed issued approval', (x, a) => { a.receipt.approval.approvedBy = 'other'; x.write(a.receiptPath, a.receipt); }, /post-write request/],
    ['changed issued revision', (x, a) => { a.receipt.appliedRecords[0].metadataRevision += '-changed'; x.write(a.receiptPath, a.receipt); x.write(META, { records: a.receipt.appliedRecords }); }, /original authority or values/],
    ['changed actual state', (x, a) => { const d = x.read(META); d.records[0].rpmL4 = 'changed'; x.write(META, d); }, /selected current metadata/],
    ['unissued post-write rows', (x, a) => { fs.unlinkSync(path.join(x.root, a.receiptPath)); }, /selected current metadata/]
  ];
  for (const [name, change, expected] of cases) await t.test(name, st => {
    const x = fixture(st), a = issued(x);
    x.write(META, { records: [a.input.current] });
    x.write(RUNTIME, { packId: 'MIDDLE2', status: 'ACTIVE', records: [a.input.runtimeRecord] });
    change(x, a); assert.throws(() => loadIssuedRpmHistory(x.input()), expected);
  });
});

test('text-only historical scope refuses nested and inline renderer carriers', async t => {
  for (const [name, fields] of [
    ['nested image', { supplemental: { image: 'https://example.invalid/figure.png' } }],
    ['inline object', { content: '<object data="https://example.invalid/figure.svg"></object>' }],
    ['inline iframe', { solution: '<iframe srcdoc="renderer"></iframe>' }],
    ['srcset', { content: '<picture srcset="figure.png 2x"></picture>' }]
  ]) await t.test(name, st => {
    const f = fixture(st, fields);
    assert.throws(() => loadIssuedRpmHistory(f.input()), /text-only|renderer reference/);
  });
});

test('ordinary figure and renderer helpers use only an authenticated historical reader', async t => {
  const f = fixture(t), context = loadIssuedRpmHistory(f.input());
  const nativeSource = { root: f.root, bytes: f.oldBytes, blobSha1: f.prior.sourceBlobSha1,
    bank: f.oldBank, runtimeRecord: f.runtimeRecord, issuedRpmHistoryContext: context };
  const call = (helper, receipt = f.prior, ctx = nativeSource) => helper(receipt, ctx,
    f.oldBank[0], f.oldBank[0], f.identity, 1, f.current);
  for (const [name, helper] of [['figure', nativeReviewedFigureRebind], ['renderer', nativeReviewedRendererRebind]]) {
    await t.test(`${name} ordinary path still checks live bytes without a token`, () => {
      const ctx = { ...nativeSource }; delete ctx.issuedRpmHistoryContext;
      assert.throws(() => call(helper, f.prior, ctx), /current evidence bytes changed/);
    });
    await t.test(`${name} text-only token authenticates evidence without claiming a renderer approval`, () => {
      assert.equal(call(helper), null);
    });
    await t.test(`${name} rejects a forged context`, () => {
      assert.throws(() => call(helper, f.prior, { ...nativeSource, issuedRpmHistoryContext: { descriptor: context.descriptor } }), /authenticated original approval/);
    });
    await t.test(`${name} rejects a different receipt or reference`, () => {
      const changed = structuredClone(f.prior); changed.requestId += '-other';
      assert.throws(() => call(helper, changed), /authenticated original approval/);
      const ref = structuredClone(f.prior); ref.approval.evidenceRefs[0].sha256 = '0'.repeat(64);
      assert.throws(() => call(helper, ref), /authenticated original approval/);
    });
    await t.test(`${name} cannot add a renderer claim to an ordinary historical receipt`, () => {
      const changed = structuredClone(f.prior);
      changed.approval.evidenceRefs.push({ path: '.archive-meta-register/evidence/unit/renderer.json', sha256: '0'.repeat(64) });
      assert.throws(() => call(helper, changed), /authenticated original approval/);
    });
  }
});
