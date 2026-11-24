import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { SOURCE_QUALITY_HOLD_LEDGER, SOURCE_QUALITY_HOLD_RESOLUTIONS, loadSourceQualityHolds, applySourceQualityHold, sourceQualityHoldDependencyPaths } from '../archive/tools/source-quality-holds.mjs';
const require = createRequire(import.meta.url), Core = require('../archive/archive2-core.js'), PB = require('../archive/problem-bank-meta.js');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const uid = 'qid_v1_' + 'a'.repeat(64), otherUid = 'qid_v1_' + 'b'.repeat(64);
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-quality-hold-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (p, value) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    const raw = typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value) + '\n';
    fs.writeFileSync(path.join(root, p), raw); return { path: p, sha256: sha(raw) }; };
  const sourceArchiveFile = 'original/middle/m1/2final/25_test.js';
  const imagePath = 'archive/assets/images/test/q1.png', image = Buffer.from('fixture-image'); write(imagePath, image);
  const question = { id: 1, content: 'fixture', image: 'assets/images/test/q1.png' };
  const source = 'window.questionBank=' + JSON.stringify([question, { id: 2, content: 'other-fixture' }]) + ';\n';
  write('archive/exams/' + sourceArchiveFile, source);
  const fp = sha(JSON.stringify({ content: question.content, choices: null, answer: null, solution: null, image: question.image }));
  const pending = write('docs/operations/hold-fixture/pending.json', { items: [{ sourceOrdinal: 1, disposition: 'EVIDENCE_PENDING', sourceMetadataChangeAllowed: false }] });
  const independent = write('docs/operations/hold-fixture/independent.json', { summary: { difficultyEvidencePendingOrdinals: [1] } });
  const additional = write('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/additional-native-proof.parent-labels.json', { status: 'UNCHANGED' });
  const receipt = write('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/hold-fixture.json', {
    schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
    sourceArchiveFile, sourceBlobSha1: blob(source), sourceRawSha256: sha(source), expectedQuestionCount: 2,
    totalQuestions: 1, appliedRecords: [{ questionUid: uid, sourceOrdinal: 1, sourceFingerprint: fp }],
    approval: { evidenceRefs: [pending, independent, additional] },
  });
  const unresolved = write('docs/operations/hold-fixture/unresolved.json', {
    questionUid: uid, ordinal: 1, sourcePath: 'archive/exams/' + sourceArchiveFile, sourceBlob: blob(source),
    sourceSha256: sha(source), status: 'SEMANTIC_UNJUDGED_SOURCE_CONDITION_NOT_ESTABLISHED',
    imageEvidence: { repositoryPath: imagePath, sha256: sha(image), bytes: image.length }, storedValuesAreNotNewSemanticApproval: true,
  });
  const row = { holdId: 'fixture-source-condition-hold', status: 'HOLD', reasonCode: 'SOURCE_CONDITION_NOT_ESTABLISHED',
    questionUid: uid, sourceArchiveFile, sourceOrdinal: 1, expectedQuestionCount: 2, sourceBlobSha1: blob(source), sourceSha256: sha(source),
    image: { path: imagePath, sha256: sha(image), bytes: image.length }, originalReceipt: receipt,
    pendingRootEvidence: pending, independentEvidence: independent, unresolvedEvidence: unresolved,
    releasePolicy: 'EXPLICIT_SOURCE_EVIDENCE_RESOLUTION_REQUIRED' };
  const ledger = { schemaVersion: 'archive-source-quality-holds-v1', status: 'ACTIVE', records: [row] };
  write(SOURCE_QUALITY_HOLD_LEDGER, ledger);
  const identity = { records: [{ questionUid: uid, sourceArchiveFile, sourceOrdinal: 1, status: 'VERIFIED', sourceFingerprint: fp }] };
  const record = { questionUid: uid, sourceFile: sourceArchiveFile, sourceOrdinal: 1, sourceFingerprint: fp,
    identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', difficultyBucket: 4,
    level: '상', metadataRevision: 'existing-native-r3', reviewStatus: 'reviewed_pass' };
  return { root, write, ledger, row, identity, record, additional };
}
// 2026-11-24 owner decision: a hold only marks one question. It never pins bytes, so changing the exam JS,
// figure, receipt or evidence must not fail anything because of the hold.
test('one exact UID gains a quality hold while source/native/D5 and unrelated rows stay unchanged', t => {
  const f = fixture(t), before = structuredClone(f.record), state = loadSourceQualityHolds(f);
  const other = { ...f.record, questionUid: otherUid, sourceOrdinal: 2 }, otherBefore = structuredClone(other);
  applySourceQualityHold(other, state); assert.deepEqual(other, otherBefore);
  applySourceQualityHold(f.record, state);
  assert.equal(f.record.sourceIssueHold, true); assert.equal(f.record.sourceQualityHold.status, 'HOLD');
  for (const [key, value] of Object.entries(before)) assert.deepEqual(f.record[key], value);
  // The hold's inputs are its own ledger files only; exam JS, figure, receipt and evidence are not inputs.
  const paths = sourceQualityHoldDependencyPaths(f.root);
  assert(paths.includes(SOURCE_QUALITY_HOLD_LEDGER)); assert(paths.includes('archive/tools/source-quality-holds.mjs'));
  for (const gone of [f.additional.path, f.row.unresolvedEvidence.path, f.row.originalReceipt.path, 'archive/exams/' + f.row.sourceArchiveFile, f.row.image.path])
    assert(!paths.includes(gone), gone);
  assert.deepEqual(state.manifestPaths, [SOURCE_QUALITY_HOLD_LEDGER.slice('archive/'.length)]);
});
for (const [name, mutate] of [
  ['source edition', f => fs.appendFileSync(path.join(f.root, 'archive/exams/' + f.row.sourceArchiveFile), '\n')],
  ['source file deleted', f => fs.unlinkSync(path.join(f.root, 'archive/exams/' + f.row.sourceArchiveFile))],
  ['image bytes', f => fs.appendFileSync(path.join(f.root, f.row.image.path), 'changed')],
  ['root pending evidence', f => fs.appendFileSync(path.join(f.root, f.row.pendingRootEvidence.path), ' ')],
  ['other original native proof', f => fs.appendFileSync(path.join(f.root, f.additional.path), ' ')],
  ['original receipt', f => fs.appendFileSync(path.join(f.root, f.row.originalReceipt.path), ' ')],
  ['unresolved evidence status', f => { const d = JSON.parse(fs.readFileSync(path.join(f.root, f.row.unresolvedEvidence.path))); d.status = 'PASS'; f.write(f.row.unresolvedEvidence.path, d); }],
  ['identity fingerprint', f => { f.identity.records[0].sourceFingerprint = '0'.repeat(64); }],
  ['no identity passed', f => { delete f.identity; }],
]) test('changing ' + name + ' does not fail and the hold still marks its question', t => {
  const f = fixture(t); mutate(f);
  const state = loadSourceQualityHolds(f); applySourceQualityHold(f.record, state);
  assert.equal(f.record.sourceIssueHold, true);
  sourceQualityHoldDependencyPaths(f.root);
});
test('a hold that matches no catalog row, a repeated apply, and a missing or empty ledger never fail', t => {
  const f = fixture(t), state = loadSourceQualityHolds(f);
  const nothing = { ...f.record, questionUid: otherUid };
  applySourceQualityHold(f.record, state); applySourceQualityHold(f.record, state);
  applySourceQualityHold(nothing, state);
  assert.equal(nothing.sourceIssueHold, undefined);
  f.ledger.records = []; f.write(SOURCE_QUALITY_HOLD_LEDGER, f.ledger);
  assert.equal(loadSourceQualityHolds(f).holds.size, 0);
  fs.unlinkSync(path.join(f.root, SOURCE_QUALITY_HOLD_LEDGER));
  assert.equal(loadSourceQualityHolds(f).holds.size, 0); sourceQualityHoldDependencyPaths(f.root);
});
test('basic and advanced automatic selection honor the same hold without changing general use or D5', () => {
  const sourceFile = 'original/middle/m1/2final/25_test.js', fp = 'c'.repeat(64), parent = {
    grade: '중1', curriculumKey: '2022', courseKey: '중1-2', L1: '입체도형', L2: '겉넓이와 부피' };
  const row = { ...parent, questionUid: uid, sourceFile, sourceOrdinal: 1, identityStatus: 'VERIFIED',
    sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceFingerprint: fp, assignmentFingerprint: fp,
    problemTypeKey: 'PT_TEST', templateKey: 'TPL_TEST', standardUnitKey: 'M1-09', subUnitKey: 'M1-09-02', difficultyBucket: 4 };
  const assignment = { ...row, sourceFingerprint: fp, approvalStatus: 'APPROVED', taxonomyVersion: 'v1',
    reviewEvidence: { status: 'PASS', reference: 'fixture', sha256: fp } };
  const authority = { taxonomyVersion: 'v1', identityByUid: { [uid]: { questionUid: uid, sourceArchiveFile: sourceFile, sourceOrdinal: 1, status: 'VERIFIED' } },
    examGradeByFile: { [sourceFile]: '중1' }, gradeCourses: [parent], canonicalParents: [parent],
    assignmentsByUid: { [uid]: [assignment] }, advancedAssignmentsByUid: { [uid]: [assignment] },
    problemTypeKeys: new Set(['PT_TEST']), templatesByKey: { TPL_TEST: { status: 'ACTIVE', parentProblemTypeKey: 'PT_TEST' } },
    bindingKeys: new Set(['2022\0M1-09\0M1-09-02\0PT_TEST']) };
  const options = { canonicalAuthority: authority };
  assert.equal(Core.basicEligibility(row, options).ok, true); assert.equal(Core.advancedEligible(row, options), true);
  const held = { ...row, sourceIssueHold: true };
  assert.deepEqual(Core.basicEligibility(held, options), { ok: false, reasons: ['source_issue'] });
  assert.equal(Core.advancedEligible(held, options), false);
  assert.equal(Core.generalUseEligibility(held).ok, true); assert.equal(Core.difficultyEligible(held), true);
});
test('VERIFIED profile rejects an otherwise complete source-bound row while DIRECT remains usable', () => {
  const fp = 'd'.repeat(64), row = { questionUid: uid, sourceFile: 'original/middle/m1/2final/25_test.js', sourceOrdinal: 1,
    sourceFingerprint: fp, metaFinalSha256: fp, sourceShardGitSha: fp, metaReviewEvidenceSha256: fp,
    metaVerification: { status: 'VERIFIED_CURRENT_SOURCE', sourceBound: true, reviewBytesBound: true,
      metaFinalSha256: fp, sourceShardGitSha: fp, reviewEvidenceSha256: fp } };
  for (const field of PB.FIELDS) row[field] = field === 'difficultyBucket' ? 4 : field.endsWith('Keys') ? [] : 'fixture';
  const before = PB.projectOriginal(row); assert.equal(before.verifiedEligible, true);
  const held = PB.projectOriginal({ ...row, sourceIssueHold: true });
  assert.equal(held.verifiedEligible, false); assert.equal(PB.query([held], {}, { profile: 'VERIFIED' }).length, 0);
  assert.equal(PB.query([held], {}, { profile: 'DIRECT' }).length, 1); assert.equal(held.difficultyBucket, 4);
});

// Owner-decision resolutions (append-only history). A resolved hold leaves the row as an ordinary row.
const resolution = row => ({ holdId: row.holdId, resolutionKind: 'OWNER_DECISION_MINIMAL_FIX', decidedAt: '2026-11-23',
  decisionQuote: 'fixture owner decision', basis: 'fixture minimal fix', changedOrdinals: [1] });
const resolutions = records => ({ schemaVersion: 'archive-source-quality-hold-resolutions-v1', records });
test('resolved hold leaves the row as an ordinary row', t => {
  const f = fixture(t);
  f.write(SOURCE_QUALITY_HOLD_RESOLUTIONS, resolutions([resolution(f.row)]));
  fs.appendFileSync(path.join(f.root, 'archive/exams/' + f.row.sourceArchiveFile), '/* any later edit */\n');
  const state = loadSourceQualityHolds(f), record = structuredClone(f.record); applySourceQualityHold(record, state);
  assert.equal(record.sourceIssueHold, undefined); assert.equal(record.sourceQualityHold, undefined);
  assert(state.manifestPaths.includes(SOURCE_QUALITY_HOLD_RESOLUTIONS.slice('archive/'.length)));
  assert(sourceQualityHoldDependencyPaths(f.root).includes(SOURCE_QUALITY_HOLD_RESOLUTIONS));
});
test('a malformed or duplicate resolution file never fails a build', t => {
  const f = fixture(t);
  f.write(SOURCE_QUALITY_HOLD_RESOLUTIONS, resolutions([resolution(f.row), resolution(f.row), { extra: true }]));
  assert.equal(loadSourceQualityHolds(f).holds.size, 0);
  f.write(SOURCE_QUALITY_HOLD_RESOLUTIONS, '{ not json');
  assert.equal(loadSourceQualityHolds(f).holds.size, 1);
});
