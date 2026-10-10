import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const base = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22';
const uid = '24_순천여고_1학기_중간_고2_확률과통계';
const candidatePath = `${base}/candidate/${uid}.q22-candidate.js`;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const bytesAt = rel => fs.readFileSync(path.resolve(root, rel));
const fileRef = rel => ({ path: rel, sha256: sha256(bytesAt(rel)) });
const jsonAt = rel => JSON.parse(bytesAt(rel).toString('utf8'));
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const candidateBytes = bytesAt(candidatePath);
if (sha256(candidateBytes) !== '789e165fe1fb99aed5aa55634df1a557a7d9ac5348f3293a3b34ecd2407e6e93'
  || gitBlob(candidateBytes) !== 'a21567853ee8a2e173dd37ef10f5bfea4dead5c1') throw new Error('ROOT_Q22_CANDIDATE_SHA_MISMATCH');
const sandbox = { window: {} };
vm.runInNewContext(candidateBytes.toString('utf8'), sandbox, { timeout: 5000 });
const questions = sandbox.window.questionBank;
if (!Array.isArray(questions) || questions.length !== 23 || questions.some((q, i) => Number(q.id) !== i + 1)) throw new Error('ROOT_Q22_CANDIDATE_ROSTER_INVALID');
const question = questions.find(q => Number(q.id) === 22);
if (!question || question.questionType !== 'short_answer' || question.answer !== '(6, 3)' || question.choices?.length !== 0) throw new Error('ROOT_Q22_REPLACEMENT_PAYLOAD_INVALID');

const refs = {
  authority: fileRef(`${base}/ROOT.q22-authority.json`),
  historyLedger: fileRef(`${base}/question-only-replacement-ledger.json`),
  createValidator: fileRef(`${base}/candidate/CREATE.q22.generic-v2-final.stdout.json`),
  createEvidence: fileRef(`${base}/candidate/CREATE.q22.question-only.evidence.json`),
  r1: fileRef('archive/analysis/r1_suncheon_yeo_prob/candidate-q22-R1-scoped-review.fresh-root-r1-worker.json'),
  r1Combined: fileRef('archive/analysis/r1_suncheon_yeo_prob/R1.q22.question-only.combined-v2-evidence.bound.json'),
  r1V2Report: fileRef('archive/analysis/r1_suncheon_yeo_prob/candidate-q22-v2-validator.stdout.json'),
  r1Completion: fileRef('archive/analysis/r1_suncheon_yeo_prob/candidate-q22-R1.complete.event.json'),
  r2: fileRef('archive/analysis/r2_suncheon_yeo_prob/q22-candidate-r2-direct-review.json'),
  r2Targeted: fileRef('archive/analysis/r2_suncheon_yeo_prob/q22-candidate-targeted-r2-evidence.json'),
  r2TargetedReport: fileRef('archive/analysis/r2_suncheon_yeo_prob/q22-candidate-targeted-r2-report-final.json'),
  r2Combined: fileRef('archive/analysis/r2_suncheon_yeo_prob/R2.q22-candidate-combined.evidence.rev2.json'),
  r2V2Report: fileRef('archive/analysis/r2_suncheon_yeo_prob/R2.q22-candidate-validator-report.rev2.json'),
  r2Completion: fileRef('archive/analysis/r2_suncheon_yeo_prob/R2.q22-candidate-complete.event.rev2.json'),
  r3: fileRef(`${base}/R3_20261011/R3.q22-physical-render-review.json`),
  r3Evidence: fileRef(`${base}/R3_20261011/R3.evidence.json`),
  r3V2Report: fileRef(`${base}/R3_20261011/R3.generic.report.rev1.json`),
  r3RenderReceipt: fileRef(`${base}/R3_20261011/R3.render-receipt.json`),
  r3Completion: fileRef(`${base}/R3_20261011/R3.complete.event.json`),
  originalHold: fileRef(`${base}/history/original-q22-hold.json`),
  originalSource: fileRef(`${base}/history/original-source.js`),
};

const authority = jsonAt(refs.authority.path);
const ledger = jsonAt(refs.historyLedger.path);
const createValidation = jsonAt(refs.createValidator.path);
const r1 = jsonAt(refs.r1.path);
const r1Combined = jsonAt(refs.r1Combined.path);
const r1Validation = jsonAt(refs.r1V2Report.path);
const r2 = jsonAt(refs.r2.path);
const r2Validation = jsonAt(refs.r2TargetedReport.path);
const r2Combined = jsonAt(refs.r2Combined.path);
const r2V2Validation = jsonAt(refs.r2V2Report.path);
const r3 = jsonAt(refs.r3.path);
const r3Evidence = jsonAt(refs.r3Evidence.path);
const r3Validation = jsonAt(refs.r3V2Report.path);
const r3Receipt = jsonAt(refs.r3RenderReceipt.path);
const r3CaptureReview = jsonAt(`${base}/R3_20261011/R3.capture-review.json`);
const originalHold = jsonAt(refs.originalHold.path);

const expectedRaw = sha256(candidateBytes), expectedBlob = gitBlob(candidateBytes);
const productionPath = `archive/exams/original/high/h2/1mid/${uid}.js`;
const productionBytes = bytesAt(productionPath);
assert(sha256(productionBytes) === expectedRaw && gitBlob(productionBytes) === expectedBlob,
'ROOT_Q22_CANDIDATE_PRODUCTION_BYTE_PARITY_FAIL');
const expectedAnswerSha = sha256(Buffer.from(String(question.answer), 'utf8'));
assert(authority.schemaVersion === 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1'
  && authority.status === 'AUTHORIZED' && authority.examUid === uid && Number(authority.qid) === 22
  && authority.candidate?.rawSha256 === expectedRaw && authority.candidate?.gitBlobSha === expectedBlob,
'ROOT_Q22_AUTHORITY_BINDING_INVALID');
assert(ledger.schemaVersion === 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_LEDGER_V1'
  && ledger.examUid === uid && Number(ledger.qid) === 22 && ledger.candidateArtifactSha256 === expectedRaw
  && ledger.source?.candidateChangedOnlyQid === 22 && ledger.source?.unchangedQidsSemanticParity === '22/22'
  && Array.isArray(ledger.historyCopies) && ledger.historyCopies.every(row => row.readForReplacementAnswer === false),
'ROOT_Q22_HISTORY_LEDGER_BINDING_INVALID');
assert(originalHold.schemaVersion === 'JS_ARCHIVE_QUESTION_ONLY_Q22_ORIGINAL_HOLD_HISTORY_V1'
  && originalHold.sourceRawSha256 === authority.source.rawSha256 && originalHold.question?.itemStatus === 'HOLD',
'ROOT_Q22_ORIGINAL_HOLD_HISTORY_INVALID');
assert(createValidation.ok === true && createValidation.disposition === 'PASS'
  && createValidation.candidateScope === 'QUESTION_ONLY_QID_CANDIDATE'
  && createValidation.fullExamStageClosure === false && createValidation.artifactSha === expectedBlob
  && createValidation.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
'ROOT_Q22_CREATE_V2_NOT_PASS');
assert(r1.schemaVersion === 'JS_ARCHIVE_Q22_R1_SCOPED_REVIEW_V1' && r1.stage === 'R1'
  && r1.reviewScope === 'QID_ONLY' && Number(r1.qid) === 22 && r1.candidateRawSha256 === expectedRaw
  && r1.mathReview?.verdict === 'PASS' && r1.mathReview?.independentAnswerFrozenBeforeStoredAnswer === true
  && r1.result === 'QID_22_R1_CONTENT_AND_META_PASS'
  && r1.questionInputReview?.questionExact === true && r1.questionInputReview?.choicesExact === true
  && r1.questionInputReview?.problemAssetsExact === true
  && r1.questionInputReview?.fullWhitelistedPayloadExact === false,
'ROOT_Q22_R1_SCOPED_REVIEW_INVALID');
assert(r1Combined.stage === 'R1' && r1Combined.artifactRawSha256 === expectedRaw
  && r1Combined.rows?.length === 23 && r1Validation.ok === true && r1Validation.disposition === 'PASS'
  && r1Validation.rowCount === 23 && Array.isArray(r1Validation.issues) && r1Validation.issues.length === 0,
'ROOT_Q22_R1_COMBINED_V2_INVALID');
assert(r2.schemaVersion === 'JS_ARCHIVE_R2_Q22_DIRECT_REVIEW_V1' && r2.stage === 'R2'
  && Number(r2.qid) === 22 && r2.currentCandidate?.sha256 === expectedRaw
  && r2.studentInputParity?.disposition === 'EXACT'
  && r2.postfreezeDecision?.answerRecomputed === true && r2.postfreezeDecision?.answerFreezeReused === false
  && r2.responseForm === 'SHORT_ANSWER' && r2.writtenAnswerAudit?.status === 'PASS'
  && r2.writtenAnswerAudit?.answerSha256 === expectedAnswerSha
  && r2.writtenAnswerAudit?.answerCardinality === 1 && r2.writtenAnswerAudit?.noDistinctAlternative === true,
'ROOT_Q22_R2_DIRECT_REVIEW_INVALID');
assert(r2Validation.ok === true && r2Validation.disposition === 'PASS' && r2Validation.rowCount === 1
  && r2Combined.stage === 'R2' && r2Combined.artifactRawSha256 === expectedRaw
  && r2Combined.rows?.length === 23 && r2V2Validation.ok === true && r2V2Validation.disposition === 'PASS'
  && r2V2Validation.rowCount === 23 && Array.isArray(r2V2Validation.issues) && r2V2Validation.issues.length === 0,
'ROOT_Q22_R2_COMBINED_V2_INVALID');
assert(r3Evidence.stage === 'R3' && r3Evidence.artifactRawSha256 === expectedRaw
  && r3Evidence.artifactDispositions?.rows?.length === 23
  && r3Evidence.artifactDispositions.rows.map(row => Number(row.qid)).join(',') === Array.from({ length: 23 }, (_, i) => i + 1).join(',')
  && r3Validation.ok === true && r3Validation.disposition === 'PASS'
  && Array.isArray(r3Validation.issues) && r3Validation.issues.length === 0,
'ROOT_Q22_R3_V2_OR_FULL_ARTIFACT_DISPOSITIONS_INVALID');
assert(r3CaptureReview.schemaVersion === 'JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1'
  && r3CaptureReview.captureReportSha256 === r3Receipt.captureReport?.sha256
  && r3CaptureReview.artifactSha === expectedBlob && r3CaptureReview.cases?.length === 6
  && r3CaptureReview.cases.every(row => row.reviewedQids?.length === 23
    && row.layoutReviewStatus === 'PASS' && row.mathJaxStatus === 'PASS' && row.assetDecodeStatus === 'PASS'),
'ROOT_Q22_R3_SIX_CASE_REVIEW_INVALID');
assert(r3Receipt.status === 'RENDER_PASS' && r3Receipt.artifactSha === expectedBlob && r3Receipt.cases?.length === 6,
'ROOT_Q22_R3_RENDER_RECEIPT_INVALID');

const hashText = value => sha256(Buffer.from(String(value ?? ''), 'utf8'));
const rootDecision = {
  schemaVersion: 'JS_ARCHIVE_CREATE_QUESTION_ONLY_REPLACEMENT_ADJUDICATION_V1',
  status: 'QUESTION_ONLY_REPLACEMENT_ACCEPTED',
  executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  examUid: uid, qid: 22, stage: 'CREATE', scopeOnly: true, fullExamCreateComplete: false,
  sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT',
  currentCandidate: { path: candidatePath, rawSha256: sha256(candidateBytes), gitBlobSha1: gitBlob(candidateBytes) },
  productionMaterialization: {
    path: productionPath,
    rawSha256: sha256(productionBytes),
    gitBlobSha1: gitBlob(productionBytes),
    copiedFromCandidatePath: candidatePath,
    byteParity: 'EXACT',
  },
  sourceIdentity: {
    questionUid: String(question.questionUid || question.sourceIdentity?.questionUid || ''),
    sourceOrdinal: 22,
    sourceArchiveFile: 'original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js',
    sourceRawSha256: '984e37c7fd5687866dc3eaf5faca82657fe0b5e84b6d57e7ed8b4688b9fca24c',
    sourceGitBlobSha1: '4428950e0794ad1d6f32da603e4978083f18a2cc',
  },
  targetPayload: {
    contentSha256: hashText(question.content),
    choicesSha256: sha256(Buffer.from(JSON.stringify(question.choices ?? []), 'utf8')),
    answerSha256: hashText(question.answer),
    solutionSha256: hashText(question.solution),
    problemImageRef: null, problemImageSha256: null,
    solutionImageRef: null, solutionImageSha256: null,
    assets: [], responseForm: 'SHORT_ANSWER',
  },
  authorityRef: refs.authority,
  historyLedgerRef: refs.historyLedger,
  createValidatorRef: refs.createValidator,
  r1Ref: refs.r1,
  r2Ref: refs.r2,
  r3Ref: refs.r3,
  combinedStageEvidence: {
    create: { ...refs.createEvidence, validatorReport: refs.createValidator },
    r1: { evidence: refs.r1Combined, validatorReport: refs.r1V2Report, completionEvent: refs.r1Completion },
    r2: { evidence: refs.r2Combined, validatorReport: refs.r2V2Report, completionEvent: refs.r2Completion },
    r3: { evidence: refs.r3Evidence, validatorReport: refs.r3V2Report, renderReceipt: refs.r3RenderReceipt, completionEvent: refs.r3Completion },
  },
  originalHoldHistory: { q22: refs.originalHold, fullSource: refs.originalSource },
  priorStatuses: {
    sourceExact: { status: 'HOLD', evidence: 'R1/R2 independently confirmed the exact original prompt is non-unique; the original source and true item HOLD are retained in history.' },
    solutionMath: { status: 'HOLD', evidence: 'The original prompt permits multiple integer tuples; its original solution and HOLD remain preserved in history.' },
  },
  replacementReason: {
    sourceParityClaimed: false,
    text: 'ROOT accepts the bounded QUESTION_ONLY replacement for q22 after fresh candidate CREATE, q22 R1, q22 R2, the three direct desktop R3 cases, and the full six-case render review passed. The candidate supplies a uniquely solvable written pair (n,r) and does not assert parity with the held original prompt.',
  },
  metaDisposition: {
    status: 'KEEP_WITH_EXACT_EVIDENCE_DEBT',
    unresolvedFields: ['rpmL3', 'rpmL4'],
    reason: 'The candidate is an H15 binomial-theorem combination and adjacent-coefficient task. Exact H2 RPM rows 009/010 remain DIRECT_BINDING_GAP/MISSING; no unsupported locked or generated RPM key is assigned to this original exam slot. Retain null values and the explicit EVIDENCE_DEBT already reviewed by R1.',
    evidenceRef: fileRef(`${base}/candidate/q22.meta-binding-candidate.json`),
  },
  adjudicationBasis: {
    sourceBeforeSha256: authority.source.rawSha256,
    candidateRawSha256: expectedRaw,
    candidateGitBlobSha1: expectedBlob,
    freshR1FreezeSha256: r1.freeze?.sha256,
    freshR2FreezeSha256: r2.postfreezeDecision.freezeSha256,
    q22R1FullWhitelistedPayloadExact: false,
    q22R1MathQuestionChoicesAndAssetsExact: true,
    q22R2StudentInputParity: 'EXACT',
    r3SixCaseRenderStatus: r3Receipt.status,
    r3SixCaseCount: r3CaptureReview.cases.length,
    previousFailedAttemptsPreserved: [
      'candidate/CREATE.q22.generic-v2.stdout.json (first candidate attempt)',
      'r1_suncheon_yeo_prob/candidate-q22-postfreeze-helper-failure.json (full-exam helper does not support qid-only denominator)',
      'r1_suncheon_yeo_prob/candidate-q22-postfreeze-parity.json (field presence mismatch, retained)',
      'r2_suncheon_yeo_prob/q22-candidate-targeted-r2-evidence.bad-identity.json (malformed examUid)',
      `${base}/R3_20261011/R3.generic.report.json (initial artifactDisposition schema failure)`,
    ],
  },
};

const out = `${base}/ROOT.q22-replacement-adjudication.json`;
fs.writeFileSync(path.resolve(root, out), `${JSON.stringify(rootDecision, null, 2)}\n`);
console.log(JSON.stringify({ path: out, sha256: sha256(bytesAt(out)), candidateRawSha256: sha256(candidateBytes), candidateGitBlobSha1: gitBlob(candidateBytes), r1: refs.r1, r2: refs.r2, r3: refs.r3, renderReceipt: refs.r3RenderReceipt }, null, 2));
