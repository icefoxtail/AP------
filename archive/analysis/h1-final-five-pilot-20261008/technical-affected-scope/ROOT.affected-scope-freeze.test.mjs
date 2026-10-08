import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { physical, sha256 } from '../../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS } from '../../../tools/archive-student-bundle.mjs';
import { compareStudentBundles, discloseAffectedScope, freezeAffectedScope, preflightAffectedScope } from '../ROOT.affected-scope-freeze.mjs';

const FULL_QIDS = Array.from({ length: 20 }, (_, index) => index + 1);
const RUN = 'h1-final-five-pilot-20261008';
const UID = '21_매산고_1학기_기말_고1_기출';
const hashJson = value => sha256(Buffer.from(JSON.stringify(value), 'utf8'));
const gitBlobSha1 = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); return physical(file); };

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-affected-scope-'));
  const ev = path.join(root, 'archive/analysis', UID, RUN);
  const assignmentPath = path.join(ev, 'ROOT.assignment.R1.affected-14.prefreeze.json');
  const rosterPath = path.join(root, 'archive/analysis', RUN, 'ROOT.roster.json');
  const sourcePath = path.join(root, '.tmp/archive', RUN, UID, `${UID}.js`);
  const assetRoot = path.join(path.dirname(sourcePath), 'assets');
  const sourcePdfPath = path.join(root, 'source-root.pdf');
  const sourceExtractionProofPath = path.join(ev, 'CREATE.source-extraction-freeze.reference.bin');
  const restorationProofPath = path.join(ev, 'ROOT.source-root-pdf-restoration-proof.json');
  const sourcePreimagePath = path.join(path.dirname(sourcePath), 'history/pre-q14-source-repair', `${UID}.js`);
  const repairProvenancePath = path.join(ev, 'R1.q14-source-repair.provenance.json');
  const originalFreezePath = path.join(ev, 'R1.independent-freeze.original.opaque.bin');
  const oldBundlePath = path.join(path.dirname(sourcePath), 'R1.student-bundle.original.json');
  const currentBundlePath = path.join(path.dirname(sourcePath), 'R1.student-bundle.current.json');
  const invariancePath = path.join(ev, 'ROOT.student-source-invariance.json');
  const reviewerSessionPath = path.join(ev, 'ROOT.fresh-review-session.json');
  const assetReadProofPath = path.join(ev, 'R1.q14.asset-read-proof.json');
  const scopeFreezePath = path.join(ev, 'R1.q14.affected-scope-freeze.json');
  const disclosurePath = path.join(ev, 'R1.q14.postfreeze-disclosure.json');
  const authorityPath = path.join(ev, 'ROOT.affected-scope-freeze.authority.json');
  const reviewerIdentity = { role: 'archive_r1', reviewerId: '/root/r1_maesan2021_q14_clean' };
  const previousReviewerId = '/root/r1_maesan2021_five';
  fs.mkdirSync(ev, { recursive: true });
  const sourcePreimageBytes = Buffer.from('synthetic-original-20-qid-source-preimage');
  fs.mkdirSync(path.dirname(sourcePreimagePath), { recursive: true });
  fs.writeFileSync(sourcePreimagePath, sourcePreimageBytes);
  const oldRawSha = sha256(sourcePreimageBytes);
  const sourcePreimageRef = physical(sourcePreimagePath);
  fs.writeFileSync(repairProvenancePath, Buffer.from('synthetic ROOT source-only q14 repair provenance'));
  const repairProvenanceRef = physical(repairProvenancePath);
  const assetValues = new Map();

  fs.mkdirSync(assetRoot, { recursive: true });
  for (const qid of [13, 14]) {
    const ref = `assets/images/${UID}/q${qid}.png`;
    const bytes = Buffer.from(`synthetic-asset-${qid}`);
    const file = path.join(assetRoot, ...ref.split('/'));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
    assetValues.set(qid, { ref, path: file, sha256: sha256(bytes) });
  }

  const oldRows = [], currentRows = [];
  for (const qid of FULL_QIDS) {
    const student = { id: qid, content: qid === 14 ? 'old q14 student body' : `student-body-${qid}`, choices: ['A', 'B'], layoutTag: '', wide: false };
    const currentStudent = qid === 14 ? { ...student, content: 'corrected q14 student body' } : structuredClone(student);
    if (qid === 13 || qid === 14) {
      student.image = assetValues.get(qid).ref;
      currentStudent.image = assetValues.get(qid).ref;
    }
    const assets = qid === 13 || qid === 14 ? [assetValues.get(qid)] : [];
    oldRows.push({ qid, student, assets });
    currentRows.push({ qid, student: currentStudent, assets });
  }

  const sourceBytes = Buffer.from(`window.examTitle=${JSON.stringify(UID)};\nwindow.questionBank=${JSON.stringify(currentRows.map(row => ({
    ...row.student,
    answer: `PRIVATE_SYNTHETIC_ANSWER_${row.qid}`,
    solution: `PRIVATE_SYNTHETIC_SOLUTION_${row.qid}`,
    standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '평면좌표',
    subUnitKey: 'H15-SA-09-CIRCLE', subUnit: '원의 방정식', problemTypeKey: 'PT_CIRCLE', templateKey: 'TPL_CIRCLE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  })))};\n`);
  fs.writeFileSync(sourcePath, sourceBytes);
  const sourceRawSha256 = sha256(sourceBytes), sourceRawBufferGitBlobSha1 = gitBlobSha1(sourceBytes);
  const oldBundle = {
    schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256: oldRawSha, sourceRawBlobSha1: 'b'.repeat(40),
    questionCount: 20, qids: FULL_QIDS, whitelist: [...STUDENT_FIELDS], rows: oldRows,
    adapterProvenance: { answersRead: false, studentFieldsDropped: [] },
    extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true },
  };
  const currentBundle = {
    schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256, sourceRawBlobSha1: sourceRawBufferGitBlobSha1,
    questionCount: 20, qids: FULL_QIDS, whitelist: [...STUDENT_FIELDS], rows: currentRows,
    adapterProvenance: { answersRead: false, studentFieldsDropped: [] },
    extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true },
  };
  const oldBundleRef = writeJson(oldBundlePath, oldBundle);
  const currentBundleRef = writeJson(currentBundlePath, currentBundle);
  const normalizedOld = normalizeStudentBundle(oldBundle, { inputFile: oldBundlePath, expectedSourceRawSha256: oldRawSha });
  const normalizedCurrent = normalizeStudentBundle(currentBundle, { inputFile: currentBundlePath, expectedSourceRawSha256: sourceRawSha256 });
  const comparison = compareStudentBundles({
    oldBundle: { ...normalizedOld, sourceRef: oldBundleRef },
    currentBundle: { ...normalizedCurrent, sourceRef: currentBundleRef },
    scopeQids: [14],
  });
  const invarianceRef = writeJson(invariancePath, { ...comparison, status: 'PASS', runId: RUN, examUid: UID });

  const oldFreezeBytes = Buffer.from([0x00, 0xff, 0x80, 0x00, 0x7f]);
  fs.writeFileSync(originalFreezePath, oldFreezeBytes);
  const oldFreezeRef = physical(originalFreezePath);
  const sourcePdfBytes = Buffer.from('synthetic-locked-root-pdf');
  fs.writeFileSync(sourcePdfPath, sourcePdfBytes);
  const sourcePdfRef = physical(sourcePdfPath);
  fs.writeFileSync(sourceExtractionProofPath, Buffer.from('opaque source extraction reference bytes'));
  const sourceExtractionProofRef = physical(sourceExtractionProofPath);
  const roster = { runId: RUN, locked: true, rows: [{ examUid: UID, pdfAbsolute: sourcePdfPath, sha256: sourcePdfRef.sha256 }] };
  const rosterRef = writeJson(rosterPath, roster);
  const restorationProof = {
    schemaVersion: 'ROOT_SOURCE_ROOT_PDF_RESTORATION_PROOF_V1', runId: RUN, examUid: UID,
    disposition: 'RESTORED_FROM_LOCKED_SOURCE_ROOT_PDF',
    sourceRootPdf: { path: sourcePdfPath, sha256: sourcePdfRef.sha256 },
    sourceExtractionProof: { path: sourceExtractionProofPath, sha256: sourceExtractionProofRef.sha256 },
  };
  const restorationRef = writeJson(restorationProofPath, restorationProof);
  const assignment = {
    runId: RUN, examUid: UID, stage: 'R1', executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
    workingJsAbsolute: sourcePath, workingJsPrefreezePermission: 'HASH_ONLY_NO_TEXT_OR_PARSE',
    expectedSourceRawSha256: sourceRawSha256, expectedSourceRawBufferGitBlobSha1: sourceRawBufferGitBlobSha1,
    studentBundleAbsolute: currentBundlePath, studentBundleSha256: currentBundleRef.sha256,
    questionCount: 20, fullQidOrder: FULL_QIDS, scopeQids: [14], assetRootAbsolute: assetRoot,
  };
  const assignmentRef = writeJson(assignmentPath, assignment);
  const sessionProof = {
    schemaVersion: 'ROOT_FRESH_AFFECTED_REVIEW_SESSION_V1', runId: RUN, examUid: UID, stage: 'R1',
    reviewerIdentity, forkTurns: 'none', scopeQids: [14], sourceRawSha256, studentBundleSha256: currentBundleRef.sha256,
  };
  const sessionRef = writeJson(reviewerSessionPath, sessionProof);
  const assetReadProof = {
    schemaVersion: 'ROOT_AFFECTED_SCOPE_ASSET_READS_V1', runId: RUN, examUid: UID, stage: 'R1', reviewerIdentity,
    rows: [13, 14].map(qid => ({ qid, ref: assetValues.get(qid).ref, sha256: assetValues.get(qid).sha256, opened: true, openedAt: '2026-10-08T03:00:00.000Z' })),
  };
  const assetReadRef = writeJson(assetReadProofPath, assetReadProof);
  const authority = {
    schemaVersion: 'ROOT_AFFECTED_SCOPE_FREEZE_AUTHORITY_V1', decisionAuthority: 'ROOT_DIRECTED_AFFECTED_QID_ONLY',
    runId: RUN, examUid: UID, stage: 'R1', scopeQids: [14], expectedQidOrder: FULL_QIDS,
    invalidOriginalQids: [14], reuseOriginalQids: FULL_QIDS.filter(qid => qid !== 14),
    lockedRoster: { path: rosterPath, sha256: rosterRef.sha256 },
    assignment: { path: assignmentPath, sha256: assignmentRef.sha256 },
    freshReviewer: { reviewerIdentity, reviewerId: reviewerIdentity.reviewerId, sessionCreatedWithForkTurns: 'none', sessionProof: { path: reviewerSessionPath, sha256: sessionRef.sha256 } },
    source: { path: sourcePath, rawSha256: sourceRawSha256, rawBufferGitBlobSha1: sourceRawBufferGitBlobSha1 },
    oldBundle: { path: oldBundlePath, sha256: oldBundleRef.sha256, sourceRawSha256: oldRawSha, sourceRawBlobSha1: 'b'.repeat(40) },
    currentBundle: { path: currentBundlePath, sha256: currentBundleRef.sha256 },
    originalFreeze: { path: originalFreezePath, sha256: oldFreezeRef.sha256, stage: 'R1', sourceRawSha256: oldRawSha, reviewerId: previousReviewerId, opaque: true },
    sourcePreimage: { path: sourcePreimagePath, sha256: sourcePreimageRef.sha256, rawSha256: oldRawSha, fullQuestionCount: 20 },
    sourceRepairProvenance: { path: repairProvenancePath, sha256: repairProvenanceRef.sha256, scopeQids: [14], fullQuestionCount: 20, sourcePreimageSha256: sourcePreimageRef.sha256, currentSourceRawSha256: sourceRawSha256 },
    sourceRootPdf: { path: sourcePdfPath, sha256: sourcePdfRef.sha256 },
    sourceRestorationProof: { path: restorationProofPath, sha256: restorationRef.sha256 },
    bundleInvarianceEvidence: { path: invariancePath, sha256: invarianceRef.sha256 },
    scopeDependenciesQids: [13, 14], scopedAssetReadProof: { path: assetReadProofPath, sha256: assetReadRef.sha256 },
    assetRootAbsolute: assetRoot, evidenceRootAbsolute: ev,
    scopeFreezeOutputAbsolute: scopeFreezePath, postfreezeDisclosureOutputAbsolute: disclosurePath,
  };
  const authorityRef = writeJson(authorityPath, authority);
  const answersPath = path.join(ev, 'R1.q14.fresh-answers.json');
  const answers = { schemaVersion: 'ROOT_FRESH_AFFECTED_QID_ANSWERS_V1', reviewerIdentity, answers: [{ qid: 14, independentAnswer: 'fresh synthetic q14 answer', reasoning: 'fresh synthetic q14 reasoning' }] };
  const answersRef = writeJson(answersPath, answers);
  return {
    root, ev, authorityPath, authorityRef, assignmentPath, rosterPath, sourcePath, sourceRawSha256, sourceRawBufferGitBlobSha1,
    oldBundlePath, currentBundlePath, oldFreezePath: originalFreezePath, sourcePdfPath, sourcePreimagePath, repairProvenancePath, answersPath, answersRef,
    scopeFreezePath, disclosurePath, assetReadProofPath, invariancePath, q14AssetPath: assetValues.get(14).path,
  };
}

test('preflight binds the full student-only bank and opaque original freeze without reading source JS or answers', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const result = preflightAffectedScope({ root: f.root, authorityFile: f.authorityPath });
  assert.equal(result.status, 'PREFLIGHT_PASS_NOT_FROZEN');
  assert.deepEqual(result.scopeQids, [14]);
  assert.deepEqual(result.fullQidOrder, FULL_QIDS);
  assert.equal(result.fullQidOrder.length, 20);
  assert.equal(result.originalFreezePayloadParsed, false);
  assert.equal(result.rawSourceJsRead, false);
  assert.equal(result.scopedAssetAckCount, 2);
});

test('freezes only fresh q14 answers, binds all 20 current student qids, and preserves the opaque original freeze', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const oldFreezeBefore = physical(f.oldFreezePath).sha256;
  const originalBundleBefore = physical(f.currentBundlePath).sha256;
  const result = freezeAffectedScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  const frozen = JSON.parse(fs.readFileSync(f.scopeFreezePath, 'utf8'));
  assert.equal(result.status, 'FRESH_SCOPE_FREEZE_ONLY');
  assert.deepEqual(frozen.scopeQids, [14]);
  assert.equal(frozen.fullQuestionCount, 20);
  assert.deepEqual(frozen.answers.map(row => row.qid), [14]);
  assert.equal(frozen.oldFullFreezeOpaque.payloadParsed, false);
  assert.equal(frozen.stagePass, false);
  assert.equal(frozen.qualityVerdictCreated, false);
  assert.equal(frozen.dispatcherSlotReleased, false);
  assert.equal(physical(f.oldFreezePath).sha256, oldFreezeBefore);
  assert.equal(physical(f.currentBundlePath).sha256, originalBundleBefore);
  assert.throws(() => freezeAffectedScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }));
});

test('postfreeze disclosure verifies full source parity and emits only q14 stored fields, Meta, and answer assets', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const frozen = freezeAffectedScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  const result = discloseAffectedScope({ root: f.root, authorityFile: f.authorityPath, scopeFreezeFile: f.scopeFreezePath, scopeFreezeSha256: frozen.freezeSha256 });
  const disclosure = JSON.parse(fs.readFileSync(f.disclosurePath, 'utf8'));
  assert.equal(result.status, 'POSTFREEZE_Q14_ONLY_DISCLOSURE');
  assert.deepEqual(result.disclosedQids, [14]);
  assert.deepEqual(disclosure.rows.map(row => row.qid), [14]);
  assert.equal(disclosure.rows[0].storedFields.answer, 'PRIVATE_SYNTHETIC_ANSWER_14');
  assert.equal(JSON.stringify(disclosure).includes('PRIVATE_SYNTHETIC_ANSWER_13'), false);
  assert.equal(JSON.stringify(disclosure).includes('PRIVATE_SYNTHETIC_SOLUTION_13'), false);
  assert.equal(disclosure.rows[0].solutionAssets.some(asset => asset.ref.endsWith('/q14.png')), true);
  assert.equal(disclosure.stagePassClaimed, false);
});

test('rejects q13 outside-scope source change and missing q13 dependency asset acknowledgment', t => {
  const first = fixture(); t.after(() => fs.rmSync(first.root, { recursive: true, force: true }));
  const current = JSON.parse(fs.readFileSync(first.currentBundlePath, 'utf8'));
  current.rows.find(row => row.qid === 13).student.content = 'changed outside scope';
  const newBundleRef = writeJson(first.currentBundlePath, current);
  const authority = JSON.parse(fs.readFileSync(first.authorityPath, 'utf8'));
  authority.currentBundle.sha256 = newBundleRef.sha256;
  authority.assignment.sha256 = newBundleRef.sha256;
  writeJson(first.assignmentPath, { ...JSON.parse(fs.readFileSync(first.assignmentPath, 'utf8')), studentBundleSha256: newBundleRef.sha256 });
  const assignmentRef = physical(first.assignmentPath); authority.assignment.sha256 = assignmentRef.sha256;
  writeJson(first.authorityPath, authority);
  assert.throws(() => preflightAffectedScope({ root: first.root, authorityFile: first.authorityPath }), /ONLY_AFFECTED_QID_STUDENT_PAYLOAD_MAY_CHANGE/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const proof = JSON.parse(fs.readFileSync(second.assetReadProofPath, 'utf8')); proof.rows = proof.rows.filter(row => row.qid !== 13);
  const proofRef = writeJson(second.assetReadProofPath, proof);
  const auth2 = JSON.parse(fs.readFileSync(second.authorityPath, 'utf8')); auth2.scopedAssetReadProof.sha256 = proofRef.sha256;
  writeJson(second.authorityPath, auth2);
  assert.throws(() => preflightAffectedScope({ root: second.root, authorityFile: second.authorityPath }), /SCOPED_ASSET_OPEN_ACK_SET_MISMATCH/);
});

test('rejects scope expansion and a current safe bundle that drops one qid from the full denominator', t => {
  const first = fixture(); t.after(() => fs.rmSync(first.root, { recursive: true, force: true }));
  const expanded = JSON.parse(fs.readFileSync(first.authorityPath, 'utf8'));
  expanded.scopeQids = [13, 14];
  writeJson(first.authorityPath, expanded);
  assert.throws(() => preflightAffectedScope({ root: first.root, authorityFile: first.authorityPath }), /EXACT_Q14_SCOPE_AND_FULL_BANK_REQUIRED/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const current = JSON.parse(fs.readFileSync(second.currentBundlePath, 'utf8'));
  current.rows = current.rows.filter(row => row.qid !== 20);
  current.qids = FULL_QIDS.slice(0, -1);
  current.questionCount = 19;
  const bundleRef = writeJson(second.currentBundlePath, current);
  const assignment = JSON.parse(fs.readFileSync(second.assignmentPath, 'utf8'));
  assignment.studentBundleSha256 = bundleRef.sha256;
  const assignmentRef = writeJson(second.assignmentPath, assignment);
  const authority = JSON.parse(fs.readFileSync(second.authorityPath, 'utf8'));
  authority.currentBundle.sha256 = bundleRef.sha256;
  authority.assignment.sha256 = assignmentRef.sha256;
  writeJson(second.authorityPath, authority);
  assert.throws(() => preflightAffectedScope({ root: second.root, authorityFile: second.authorityPath }), /FULL_CURRENT_STUDENT_QID_ORDER_REQUIRED/);
});

test('rejects unknown answer fields, extra qid answers, full-bank order loss, and stale source authority', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const answers = JSON.parse(fs.readFileSync(f.answersPath, 'utf8'));
  answers.answers[0].storedAnswer = 'synthetic-leak';
  writeJson(f.answersPath, answers);
  assert.throws(() => freezeAffectedScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }), /FRESH_AFFECTED_QID_ANSWER_FIELDS_EXACT_REQUIRED/);
  answers.answers = [{ qid: 13, independentAnswer: 'x', reasoning: 'x' }, { qid: 14, independentAnswer: 'y', reasoning: 'y' }];
  delete answers.answers[0].storedAnswer;
  writeJson(f.answersPath, answers);
  assert.throws(() => freezeAffectedScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }), /ONE_AFFECTED_QID_ANSWER_REQUIRED/);

  const auth = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
  auth.source.rawSha256 = '0'.repeat(64);
  writeJson(f.authorityPath, auth);
  assert.throws(() => preflightAffectedScope({ root: f.root, authorityFile: f.authorityPath }), /ASSIGNMENT_SOURCE_BINDING_MISMATCH/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  const leakyAuthority = JSON.parse(fs.readFileSync(third.authorityPath, 'utf8'));
  leakyAuthority.oldAnswers = [{ qid: 1, independentAnswer: 'synthetic-leak' }];
  writeJson(third.authorityPath, leakyAuthority);
  assert.throws(() => preflightAffectedScope({ root: third.root, authorityFile: third.authorityPath }), /ROOT_AUTHORITY_MUST_NOT_CARRY_ANSWER_PAYLOAD/);
});

test('rejects current bundle mutation or source drift after the q14 freeze', t => {
  const first = fixture(); t.after(() => fs.rmSync(first.root, { recursive: true, force: true }));
  const frozen = freezeAffectedScope({ root: first.root, authorityFile: first.authorityPath, answersFile: first.answersPath });
  const changedBundle = JSON.parse(fs.readFileSync(first.currentBundlePath, 'utf8'));
  changedBundle.rows.find(row => row.qid === 14).student.content = 'postfreeze mutation';
  writeJson(first.currentBundlePath, changedBundle);
  assert.throws(() => discloseAffectedScope({ root: first.root, authorityFile: first.authorityPath, scopeFreezeFile: first.scopeFreezePath, scopeFreezeSha256: frozen.freezeSha256 }), /STUDENT_BUNDLE_SHA256_MISMATCH/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const frozen2 = freezeAffectedScope({ root: second.root, authorityFile: second.authorityPath, answersFile: second.answersPath });
  fs.appendFileSync(second.sourcePath, '\n// changed after freeze\n');
  assert.throws(() => discloseAffectedScope({ root: second.root, authorityFile: second.authorityPath, scopeFreezeFile: second.scopeFreezePath, scopeFreezeSha256: frozen2.freezeSha256 }), /POSTFREEZE_SOURCE_RAW_BINDING_MISMATCH/);
});
