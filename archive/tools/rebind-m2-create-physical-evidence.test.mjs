import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyHolds, deriveSourceDelta, durableReceiptPath, holdAxesFor, linkQuestionRows, lociForRow, parseArgs, preserveReviewHistory, receiptRows, receiptSchema, receiptSource, rowReviewStatus, validateConsolidatedStageEvidence, validateHoldEvidence, validateScopeOnly, validateScopedSourceRefreshV1, validateSourceRefreshReceiptV2, withExecutionMode } from './rebind-m2-create-physical-evidence.mjs';
import { validatePhysicalEvidence } from './review-evidence-gate.mjs';

const oldBank = [
  { id: 1, content: 'fixture A', choices: ['x'], answer: 'x', solution: 's1', subUnitKey: 'U1' },
  { id: 2, content: 'fixture B', choices: ['y'], answer: 'y', solution: 's2', subUnitKey: 'U2' },
];
const currentBank = [
  { id: 1, content: 'fixture A', choices: ['x'], answer: 'x', solution: 's1-fixed', subUnitKey: 'U1' },
  { id: 2, content: 'fixture B', choices: ['y'], answer: 'y', solution: 's2', subUnitKey: 'U2' },
];
const delta = deriveSourceDelta(oldBank, currentBank);
assert.deepEqual(delta.changed, [{ qid: 1, fields: ['solution'] }]);
assert.deepEqual(delta.unchangedQids, [2]);
assert.deepEqual(delta.studentPayloadUnchangedQids, [2]);

assert.equal(parseArgs(['--exam', 'a.js', '--evidence', 'e.json', '--baseline-commit', 'abc', '--r1-receipt', 'r.json']).mode, 'dry-run');
assert.equal(parseArgs(['--exam', 'a.js', '--evidence', 'e.json', '--baseline-commit', 'abc', '--r1-receipt', 'r.json', '--write']).mode, 'write');
assert.equal(withExecutionMode({ ok: true }, 'dry-run').mode, 'dry-run');
assert.equal(withExecutionMode({ ok: true }, 'write').mode, 'write');
assert.equal(withExecutionMode({ ok: true }, 'check').mode, 'check');
assert.throws(() => withExecutionMode({ ok: true }, 'other'), /INVALID_EXECUTION_MODE/);
assert.throws(() => parseArgs(['--exam', 'a.js', '--evidence', 'e.json', '--baseline-commit', 'abc', '--write', '--check']), /MODE_FLAG_CONFLICT/);
assert.throws(() => parseArgs(['--exam', 'a.js', '--evidence', 'e.json', '--baseline-commit', 'abc', '--write']), /R1_RECEIPT_REQUIRED/);

assert.equal(validateHoldEvidence({
  reason: 'SCOPED_META_HOLD', observedEvidence: ['lookup attempted'], unresolvedPoint: 'mapping unresolved',
  nextRequiredEvidenceOrCapability: 'approved mapping', repairAttempted: 'candidate mapping checked',
  authorityLookupAttempted: 'canonical sources checked', whyDeterministicClosureImpossible: 'no active exact mapping',
}), true);
assert.equal(validateHoldEvidence({ reason: 'hold', unresolvedPoint: 'x' }), false);

const sameName = 'scoped-r1-refresh-receipt.json';
const receiptA = durableReceiptPath('archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js', `.tmp/a/${sameName}`, `sha256:${'a'.repeat(64)}`);
const receiptB = durableReceiptPath('archive/exams/original/middle/m2/1mid/19_연향중_1학기_중간_중2_기출.js', `.tmp/b/${sameName}`, `sha256:${'a'.repeat(64)}`);
const receiptC = durableReceiptPath('archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js', `.tmp/c/${sameName}`, `sha256:${'b'.repeat(64)}`);
assert.notEqual(receiptA, receiptB, 'same-basename receipts for separate exams have unique durable names');
assert.notEqual(receiptA, receiptC, 'same-exam receipt revisions have unique durable names');
assert.equal(durableReceiptPath('archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js', receiptA, `sha256:${'a'.repeat(64)}`), receiptA, 'durable paths are stable on check');
assert.match(receiptA, /^archive\/data\/r2e-intake\/m2\/source-refresh-receipts\//);
const linkedEvidence = { questionRows: [{ qid: 1 }] };
linkQuestionRows(linkedEvidence, [{ qid: 1, changedFields: ['solution'], receiptRefs: [{ path: receiptA, sourcePath: '.tmp/a/scoped-r1-refresh-receipt.json', sha256: `sha256:${'a'.repeat(64)}` }] }]);
assert.equal(linkedEvidence.questionRows[0].sourceRefreshReceiptRefs[0].path, receiptA, 'question row points at durable receipt path');
assert.equal(linkedEvidence.questionRows[0].sourceRefreshReceiptRefs[0].sourcePath, '.tmp/a/scoped-r1-refresh-receipt.json');

const previousReview = { schemaVersion: 'JS_ARCHIVE_SOURCE_REFRESH_REVIEW_V1', current: { sha256: 'sha256:old' }, receipts: [{ sha256: 'sha256:r1' }] };
const nextReview = { schemaVersion: 'JS_ARCHIVE_SOURCE_REFRESH_REVIEW_V1', current: { sha256: 'sha256:old' }, receipts: [{ sha256: 'sha256:r2' }] };
const withHistory = preserveReviewHistory(previousReview, nextReview);
assert.equal(withHistory.history.length, 1);
assert.deepEqual(withHistory.history[0].review, previousReview);
assert.equal(preserveReviewHistory(withHistory, { ...withHistory, history: undefined }).history.length, 1, 'repeated same-signature closure preserves prior history');

const 승평Receipt = {
  schemaVersion: 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1',
  scopeOnly: true,
  fullExamR1Pass: false,
  currentSource: { path: 'archive/exams/original/middle/m2/1final/fixture.js', rawSha256: 'a'.repeat(64), rawBufferGitBlobSha1: 'b'.repeat(40), questionCount: 2 },
  baseline: { commit: 'fixture-baseline', sourceRawSha256: 'c'.repeat(64) },
  scope: { unchangedQids: [1], changedLoci: [{ qid: 2, changedFields: ['solution'], solution: { status: 'REVIEWED_STATIC', renderStatus: 'NOT_RUN' } }] },
};
const 승평Schema = receiptSchema(승평Receipt);
assert.equal(승평Schema, 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1');
validateScopeOnly(승평Receipt, 승평Schema, 'synthetic-seungpyeong');
assert.equal(receiptSource(승평Receipt, 승평Schema).sha256, 'a'.repeat(64));
const 승평Row = receiptRows(승평Receipt, 승평Schema)[0];
assert.deepEqual(lociForRow(승평Row.row, 승평Schema, 승평Row.qid, 승평Receipt), ['solution']);
assert.equal(rowReviewStatus(승평Row.row, 승평Schema, 'solution'), 'REVIEWED_STATIC');
assert.equal(승평Row.row.solution.renderStatus, 'NOT_RUN', 'static closure remains separate from rendering');

const legacyChangedRowsObject = {
  qid: 1,
  changedFields: ['solution'],
  solutionComparison: { status: 'PASS' },
  solutionStatus: 'PASS',
};
assert.equal(rowReviewStatus(legacyChangedRowsObject, 'M2_SCOPED_R1_SOURCE_REFRESH_V1', 'solution'), 'REVIEWED_STATIC',
  'legacy changedRows object rows accept explicit solutionStatus PASS as static closure');

const q16ContentFollowup = {
  schemaVersion: 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1',
  qid: 16,
  changedFieldsFromBaseline: ['content', 'solution'],
  reviewedLocus: 'content only',
  sourceExact: { status: 'PASS' },
  questionLayout: { status: 'PASS' },
  reviewedAxes: ['sourceExact', 'QUESTION_LAYOUT'],
  freezeBinding: { postfreezeParity: 'EXACT', originalFreezePreserved: true },
  scopeOnly: true,
  fullExamR1Pass: false,
  actualRenderExecuted: false,
  assetReview: { status: 'PASS' },
  currentStudentInput: { studentFields: { id: 16 }, questionPayloadSha256: 'a'.repeat(64) },
  currentContent: 'current', baselineContent: 'baseline', questionPayloadHash: 'a'.repeat(64),
  contentComparison: { taskWordingUnchanged: true, conditionAndRequestPreserved: true, choicesExactEquality: true, visualInputsExact: true, noReferencedAssets: true, sharedMaterialPresent: false },
};
assert.deepEqual(receiptRows(q16ContentFollowup, receiptSchema(q16ContentFollowup)).map(row => row.qid), [16]);
assert.deepEqual(lociForRow(q16ContentFollowup, receiptSchema(q16ContentFollowup), 16, q16ContentFollowup), ['content']);
assert.equal(rowReviewStatus(q16ContentFollowup, receiptSchema(q16ContentFollowup), 'content'), 'PASS');
assert.equal(rowReviewStatus({ ...q16ContentFollowup, questionLayout: { status: 'NOT_RUN' } }, receiptSchema(q16ContentFollowup), 'content'), 'NOT_REVIEWED');
assert.equal(rowReviewStatus({ ...q16ContentFollowup, fullExamR1Pass: true }, receiptSchema(q16ContentFollowup), 'content'), 'NOT_REVIEWED');

const yeonhyangMetaFollowup = {
  schemaVersion: 'M2_SCOPED_R1_META_FOLLOWUP_V1',
  scopeOnly: true,
  fullExamR1Pass: false,
  source: { path: 'archive/exams/original/middle/m2/1mid/fixture.js', rawSha256: 'd'.repeat(64), rawBufferBlobSha1: 'e'.repeat(40), questionCount: 21 },
  qid: 13,
  changedMetaFields: { subUnitKey: { baseline: 'old', current: 'new' }, tags: { baseline: [], current: ['fixture'] } },
  metaStatus: 'PASS',
};
const followupSchema = receiptSchema(yeonhyangMetaFollowup);
validateScopeOnly(yeonhyangMetaFollowup, followupSchema, 'synthetic-yeonhyang-meta');
assert.equal(receiptSource(yeonhyangMetaFollowup, followupSchema).sha256, 'd'.repeat(64));
const followupRow = receiptRows(yeonhyangMetaFollowup, followupSchema)[0];
assert.deepEqual(lociForRow(followupRow.row, followupSchema, followupRow.qid, yeonhyangMetaFollowup), ['subUnitKey', 'tags']);
assert.equal(rowReviewStatus(followupRow.row, followupSchema, 'subUnitKey'), 'PASS');
assert.equal(rowReviewStatus(followupRow.row, followupSchema, 'tags'), 'PASS');

const stageOldBank = [
  { id: 1, content: 'unchanged fixture', choices: ['a'], answer: 'a', solution: 'unchanged', subUnitKey: 'U1' },
  { id: 2, content: 'fixture', choices: ['b'], answer: 'b', solution: 'old solution', subUnitKey: 'U1' },
  { id: 3, content: 'fixture', choices: ['c'], answer: 'c', solution: 'same solution', subUnitKey: 'U1' },
];
const stageCurrentBank = [
  { id: 1, content: 'unchanged fixture', choices: ['a'], answer: 'a', solution: 'unchanged', subUnitKey: 'U1' },
  { id: 2, content: 'fixture', choices: ['b'], answer: 'b', solution: 'new solution', subUnitKey: 'U1' },
  { id: 3, content: 'fixture', choices: ['c'], answer: 'c', solution: 'same solution', subUnitKey: 'U2' },
];
const stageDelta = deriveSourceDelta(stageOldBank, stageCurrentBank);
const currentSolutionHash = 'sha256:' + (await import('node:crypto')).createHash('sha256').update('new solution').digest('hex');
const stageReceipt = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', scopeOnly: true, fullExamR1Pass: false,
  baselineSource: { commit: 'fixture-baseline', rawSha256: 'fixture-baseline-sha' },
  changedLoci: [
    { qid: 2, fields: ['solution'], solution: { renderStatus: 'NOT_RUN' } },
    { qid: 3, fields: ['subUnitKey'] },
  ],
  metaReviews: [{ qid: 3, disposition: 'PASS' }],
  solutionReviews: [{ qid: 2, previousDisposition: 'PASS_AFTER_ADJUDICATION', exactByteHashMatch: true, currentSolutionSha256: currentSolutionHash, priorReviewedSolutionSha256: currentSolutionHash }],
  unchangedQidDispositions: [{ qid: 1, disposition: 'UNCHANGED_BASELINE_NO_NEW_VERDICT' }],
};
assert.equal(validateConsolidatedStageEvidence(stageReceipt, stageCurrentBank, stageDelta), true);
const stageRows = receiptRows(stageReceipt, 'JS_ARCHIVE_STAGE_EVIDENCE_v2');
const stageSolutionRow = stageRows.find(row => row.qid === 2).row;
assert.equal(rowReviewStatus(stageSolutionRow, 'JS_ARCHIVE_STAGE_EVIDENCE_v2', 'solution'), 'REVIEWED_STATIC');
assert.equal(stageSolutionRow.solution.renderStatus, 'NOT_RUN', 'static solution closure does not imply render PASS');
assert.equal(rowReviewStatus(stageRows.find(row => row.qid === 3).row, 'JS_ARCHIVE_STAGE_EVIDENCE_v2', 'subUnitKey'), 'PASS');
assert.throws(() => validateConsolidatedStageEvidence({ ...stageReceipt, unchangedQidDispositions: [] }, stageCurrentBank, stageDelta), /STAGE_EVIDENCE_UNCHANGED_QID_DENOMINATOR_MISMATCH/);

const scopedOldBank = [
  { id: 1, content: 'p1', choices: ['a'], answer: 'a', solution: 's1', subUnitKey: 'U1' },
  { id: 2, content: 'p2', choices: ['b'], answer: 'b', solution: 's2', subUnitKey: 'U1' },
  { id: 3, content: 'p3', choices: ['c'], answer: 'c', solution: 's3', subUnitKey: 'U1' },
];
const scopedCurrentBank = [
  { ...scopedOldBank[0] },
  { ...scopedOldBank[1] },
  { ...scopedOldBank[2], subUnitKey: 'U2' },
];
const scopedDelta = deriveSourceDelta(scopedOldBank, scopedCurrentBank);
const scopedReceipt = {
  schemaVersion: 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1', scopeOnly: true, fullExamR1Pass: false,
  baseline: { commit: 'fixture-baseline', rawSha256: 'baseline-source-sha' },
  sourceDiff: { changedQids: [3] },
  changedScope: [{ qid: 3, fields: ['subUnitKey'] }],
  metaFindings: [{ qid: 3, disposition: 'PASS' }],
  studentParity: { result: 'EXACT', changedQids: [], unchangedQids: [1, 2, 3] },
  assetParity: { result: 'EXACT', assets: [] },
  unchangedQidDispositions: [
    { qid: 1, disposition: 'UNCHANGED_BASELINE_NO_NEW_VERDICT' },
    { qid: 2, disposition: 'UNCHANGED_BASELINE_NO_NEW_VERDICT' },
  ],
};
assert.equal(validateScopedSourceRefreshV1(scopedReceipt, '.', scopedCurrentBank, scopedDelta), true);
const scopedRow = receiptRows(scopedReceipt, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1')[0];
assert.deepEqual(lociForRow(scopedRow.row, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1', scopedRow.qid, scopedReceipt), ['subUnitKey']);
assert.equal(rowReviewStatus(scopedRow.row, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1', 'subUnitKey'), 'PASS');
assert.throws(() => validateScopedSourceRefreshV1({ ...scopedReceipt, unchangedQidDispositions: scopedReceipt.unchangedQidDispositions.slice(0, 1) }, '.', scopedCurrentBank, scopedDelta), /SOURCE_REFRESH_UNCHANGED_QID_DENOMINATOR_MISMATCH/);

const hashSolution = value => 'sha256:' + crypto.createHash('sha256').update(value).digest('hex');
const v2OldBank = [
  { id: 19, content: 'student field', choices: ['x'], answer: 'x', solution: 'unreviewed old', subUnitKey: 'U1' },
  { id: 20, content: 'student field', choices: ['y'], answer: 'y', solution: 'reviewed old', subUnitKey: 'U1' },
];
const v2CurrentBank = [
  { ...v2OldBank[0], solution: 'unreviewed current' },
  { ...v2OldBank[1], solution: 'reviewed current' },
];
const v2Delta = deriveSourceDelta(v2OldBank, v2CurrentBank);
const v2Hold = {
  qid: 19,
  status: 'SOURCE_HOLD',
  category: 'INCOMPLETE_STUDENT_SOURCE',
  reason: 'INCOMPLETE_STUDENT_SOURCE',
  observedEvidence: ['synthetic input incomplete'],
  unresolvedPoint: 'source field unavailable',
  nextRequiredEvidenceOrCapability: 'complete student source',
  repairAttempted: 'available source checked',
  authorityLookupAttempted: 'canonical source checked',
  whyDeterministicClosureImpossible: 'source field is absent',
};
const v2Receipt = {
  schemaVersion: 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2',
  scopeOnly: true,
  fullExamR1Pass: false,
  denominator: { baseline: 2, current: 2, qids: [19, 20], qidOrderParity: true },
  changedSolutionReview: {
    reviewedQids: [20],
    rows: [{ qid: 20, status: 'REVIEWED_PASS', baselineCurrentChangedFields: ['solution'], studentPayloadParity: true, storedAnswerUnchanged: true,
      baselineSolutionSha256: hashSolution(v2OldBank[1].solution), currentSolutionSha256: hashSolution(v2CurrentBank[1].solution) }],
  },
  q19Hold: v2Hold,
  unreviewedChangedSolutionQids: [19],
  baselineCurrentStudentParity: { changedStudentOrAssetRows: [], unchangedQidsStudentFieldParity: [19, 20], actualOpenedAssets: [] },
};
assert.equal(validateSourceRefreshReceiptV2(v2Receipt, '.', v2OldBank, v2CurrentBank, v2Delta), true);
const v2Rows = receiptRows(v2Receipt, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2');
const v2HoldRow = v2Rows.find(row => row.qid === 19).row;
assert.equal(rowReviewStatus(v2HoldRow, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2', 'solution'), 'HOLD');
assert.deepEqual(holdAxesFor('solution', v2HoldRow), ['sourceExact', 'solutionMath']);
assert.equal(validateHoldEvidence(v2Hold), true);
assert.equal(v2Rows.some(row => row.qid === 19 && row.row.baselineSolutionSha256), false, 'held q19 has no answer/solution freeze hash');

const holdRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'm2-source-refresh-hold-gate-'));
try {
  const holdExamFile = path.join(holdRoot, 'hold-test.js');
  const holdEvidenceFile = path.join(holdRoot, 'hold-evidence.json');
  const holdExamSource = 'window.questionBank=[{"id":19,"content":"synthetic hold fixture","choices":["x"],"answer":"①","solution":"synthetic unreviewed solution","standardCourse":"중2 수학","standardUnitKey":"M2-01","subUnitKey":"M2-01-EXPONENT_LAW","problemTypeKey":"PT_SYNTHETIC","templateKey":"TPL_SYNTHETIC"}];\n';
  fs.writeFileSync(holdExamFile, holdExamSource, 'utf8');
  const fileSha = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
  const holdEvidence = {
    reason: 'INCOMPLETE_STUDENT_SOURCE',
    observedEvidence: ['required student source field missing'],
    unresolvedPoint: 'source field cannot be determined from the available input',
    nextRequiredEvidenceOrCapability: 'complete student source input',
    repairAttempted: 'available source packet checked',
    authorityLookupAttempted: 'canonical source references checked',
    whyDeterministicClosureImpossible: 'the missing student field is absent from the supplied source bytes',
  };
  const calibrationEvidence = JSON.parse(fs.readFileSync('archive/data/r2e-intake/m2/22_왕운중_1학기_기말_중2_기출.create.physical-evidence.json', 'utf8')).solutionQualityCalibration;
  const fixture = {
    schemaVersion: 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1',
    stage: 'CREATE',
    examPath: 'hold-test.js',
    examSha256: fileSha(holdExamSource),
    questionCount: 1,
    questionRows: [{
      qid: 19,
      sourceExact: { status: 'PASS', evidence: 'pre-hold source placeholder' },
      answerMath: { status: 'PASS', evidence: 'synthetic fixture answer review' },
      solutionMath: { status: 'PASS', evidence: 'pre-hold solution placeholder' },
      smallBoard: { status: 'PASS', evidence: 'synthetic fixture board review' },
      curriculum: { status: 'PASS', evidence: 'synthetic fixture curriculum review' },
      visualNecessity: { status: 'PASS', evidence: 'no visual required by fixture' },
      meta: { status: 'PASS', evidence: 'synthetic fixture metadata review' },
      difficulty: { status: 'PASS', evidence: 'synthetic fixture difficulty review' },
      runtimeString: { status: 'PASS', evidence: 'synthetic fixture runtime review' },
    }],
    visualRows: [],
    metaRows: [{
      qid: 19, result: 'PASS', primaryMethod: 'synthetic fixture', decisiveStep: 'synthetic fixture',
      rpmDisposition: 'FINAL', projectionDisposition: 'UNMATERIALIZED', problemTypeKey: 'PT_SYNTHETIC',
      templateKey: 'TPL_SYNTHETIC', lookupRefs: ['synthetic fixture authority'],
    }],
    summary: { itemHoldCount: 1 },
    solutionQualityCalibration: { ...calibrationEvidence, qualityCompareCount: '1/1' },
  };
  applyHolds(fixture, [
    { qid: 19, axis: 'sourceExact', entry: { durablePath: 'archive/data/r2e-intake/m2/source-refresh-receipts/synthetic.receipt.json', sha256: fileSha('receipt') }, holdEvidence },
    { qid: 19, axis: 'solutionMath', entry: { durablePath: 'archive/data/r2e-intake/m2/source-refresh-receipts/synthetic.receipt.json', sha256: fileSha('receipt') }, holdEvidence },
  ]);
  assert.equal(fixture.questionRows[0].sourceExact.status, 'HOLD');
  assert.equal(fixture.questionRows[0].solutionMath.status, 'HOLD');
  assert.equal(fixture.metaRows[0].result, 'PASS', 'non-Meta source hold leaves meta row untouched');
  assert.equal(fixture.summary.itemHoldCount, 1);
  fs.writeFileSync(holdEvidenceFile, JSON.stringify(fixture, null, 2), 'utf8');
  const validGate = validatePhysicalEvidence({ examFile: holdExamFile, evidenceFile: holdEvidenceFile, stage: 'CREATE' });
  assert.equal(validGate.ok, true, JSON.stringify(validGate));
  assert.equal(validGate.disposition, 'PASS_WITH_ITEM_HOLDS');
  assert.deepEqual(validGate.itemHoldQids, [19]);

  fixture.questionRows[0].solutionMath.holdEvidence = { ...holdEvidence, whyDeterministicClosureImpossible: '' };
  fs.writeFileSync(holdEvidenceFile, JSON.stringify(fixture, null, 2), 'utf8');
  const invalidGate = validatePhysicalEvidence({ examFile: holdExamFile, evidenceFile: holdEvidenceFile, stage: 'CREATE' });
  assert.equal(invalidGate.ok, false);
  assert.equal(invalidGate.disposition, 'FAIL');
  assert.ok(invalidGate.issues.some(issue => issue.startsWith('QUESTION_AXIS_HOLD_EVIDENCE_INCOMPLETE')));
} finally {
  fs.rmSync(holdRoot, { recursive: true, force: true });
}

console.log('rebind-m2-create-physical-evidence.test.mjs PASS');
