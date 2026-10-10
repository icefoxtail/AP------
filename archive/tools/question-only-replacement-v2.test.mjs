#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateQuestionOnlyReplacement } from './question-only-replacement-v2.mjs';
import { validateCreateEvidence } from './archive-stage-validator-create-v2.mjs';
import { validateR1Evidence } from './archive-stage-validator-r1-v2.mjs';
import { validateR2Evidence } from './archive-stage-validator-r2-v2.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'question-only-v2-'));
fs.mkdirSync(path.join(root, '.git'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const write = (rel, data) => {
  const file = path.join(root, rel); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data); return file;
};
const json = value => Buffer.from(JSON.stringify(value));
const sourcePath = 'archive/exams/original/middle/m2/1final/demo.js';
const examUid = 'demo';
const qid = 19;
const qMeta = {
  standardCourse: '중2 수학', standardUnitKey: 'M2-04', standardUnit: '일차함수와 그래프', standardUnitOrder: 4,
  subUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC', subUnit: '일차함수의 뜻과 그래프', subUnitConfidence: 'candidate_evidence',
  subUnitClassificationDepth: 'complete_candidate', problemTypeKey: 'PT_FUNCTION_GRAPH_QUADRANT',
  templateKey: 'TPL_FUNCTION_QUADRANT_FROM_OTHER_FUNCTION', crossConceptKeys: [], conditionKeys: ['COND_NEGATIVE'], integrationPattern: 'NONE',
};
const qDifficulty = { level: '상', difficultyBucket: 3, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'B34', legacyLevelCompatibility: 'BORDERLINE_REVIEW' };
const choices = ['A', 'B', 'C', 'D', 'E'];
const qOld = { id: qid, content: 'old incomplete source prompt', choices, answer: '③', solution: 'old solution', image: 'assets/images/demo/q19.png', ...qMeta, ...qDifficulty };
const qNew = { ...qOld, content: 'replacement prompt with complete definitions', answer: '④', solution: 'fresh complete proof\n\nfinal answer', solutionImage: 'assets/images/demo/q19-solution.svg' };
const sourceBank = Array.from({ length: 24 }, (_, i) => i + 1 === qid ? qOld : { id: i + 1, content: `source-${i + 1}` });
const candidateBank = sourceBank.map(question => Number(question.id) === qid ? qNew : question);
const sourceBytes = Buffer.from(`window.questionBank=${JSON.stringify(sourceBank)};`);
const candidateBytes = Buffer.from(`window.questionBank=${JSON.stringify(candidateBank)};`);
write(sourcePath, sourceBytes);
const imageBytes = Buffer.from('original problem raster');
const svgBytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><line id="case" x1="0" y1="0" x2="10" y2="5"/></svg>');
write('archive/assets/images/demo/q19.png', imageBytes);
write('.tmp/candidate/assets/images/demo/q19.png', imageBytes);
write('.tmp/candidate/assets/images/demo/q19-solution.svg', svgBytes);
write('.tmp/candidate/demo.js', candidateBytes);
write('.tmp/candidate/geometry.json', JSON.stringify({ schemaVersion: 'QUESTION_ONLY_GEOMETRY_V1', backend: 'STANDARD_SVG' }));
const screenshotBytes = Buffer.from('q19 solution capture');
write('.tmp/candidate/capture/sol-desktop.png', screenshotBytes);

const sourceHoldReceipt = {
  status: 'SCOPED_REVIEW_COMPLETE_WITH_SOURCE_HOLD', scopeOnly: true, fullExamR1Pass: false,
  current: { rawSha256: hash(sourceBytes), rawBufferBlobSha1: blob(sourceBytes) }, target: { productionRelativePath: sourcePath },
  q19Hold: { qid, status: 'SOURCE_HOLD', observedEvidence: { imageSha256: hash(imageBytes), missingFields: ['definition'] } },
};
const historyFiles = [
  ['.tmp/history/original-source.js', sourceBytes],
  ['.tmp/history/q19.png', imageBytes],
  ['.tmp/history/prior-r1/scoped-R1-current-source-refresh.receipt.json', json(sourceHoldReceipt)],
  ['.tmp/history/prior-r1/R1.changed-scope.independent-freeze.json', Buffer.from('old q19 excluded freeze')],
];
const historyCopies = historyFiles.map(([rel, bytes]) => ({ path: rel, sha256: hash(bytes), readForReplacementAnswer: false }));
for (const [rel, bytes] of historyFiles) write(rel, bytes);
const ledger = {
  schemaVersion: 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_LEDGER_V1', examUid, stage: 'CREATE', qid,
  replacementMode: 'QUESTION_ONLY', candidateArtifactSha256: hash(candidateBytes),
  source: { path: sourcePath, sha256: hash(sourceBytes), gitBlobSha: blob(sourceBytes), candidateChangedOnlyQid: qid, unchangedQidsSemanticParity: '23/23' },
  originalQ19: { problemImageRef: qOld.image, problemImageSha256: hash(imageBytes), sourceImageActuallyOpened: true, sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT' },
  replacement: { sameSlot: qid }, historyCopies,
};
write('.tmp/candidate/question-only-replacement-ledger.json', json(ledger));

const authority = {
  schemaVersion: 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX', stage: 'CREATE', authorityType: 'ROOT_DELEGATED', status: 'AUTHORIZED', examUid, qid, sourceOrdinal: qid,
  replacementScope: 'QUESTION_ONLY', userDirective: '두 건은 수정프로토콜로 수정 후 마감 처리해',
  source: { path: sourcePath, rawSha256: hash(sourceBytes), gitBlobSha: blob(sourceBytes) },
  candidate: {
    rawSha256: hash(candidateBytes), gitBlobSha: blob(candidateBytes),
    assets: [
      { kind: 'problem', ref: qOld.image, sha256: hash(imageBytes), gitBlobSha: blob(imageBytes) },
      { kind: 'solution', ref: qNew.solutionImage, sha256: hash(svgBytes), gitBlobSha: blob(svgBytes) },
    ],
  },
  sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT', reason: 'True source HOLD; one-slot replacement only.',
};
const authorityPath = 'archive/analysis/demo/question-only-authorization.json';
const authorityBytes = json(authority);
write(authorityPath, authorityBytes);
const authorityRef = { path: authorityPath, sha256: hash(authorityBytes) };
const difficultyReview = {
  schemaVersion: 'JS_ARCHIVE_DIFFICULTY_CURRENT_PASS_V1', examUid, qid,
  candidateArtifactSha256: hash(candidateBytes), sourceMode: 'QUESTION_ONLY', replacedItemDifficultyCopied: false,
  ownCurrentPass: { difficultyBucket: qDifficulty.difficultyBucket, difficultyConfidence: qDifficulty.difficultyConfidence, difficultyBoundaryFlag: qDifficulty.difficultyBoundaryFlag, legacyLevel: qDifficulty.level, legacyLevelCompatibility: qDifficulty.legacyLevelCompatibility },
};
write('.tmp/candidate/difficulty-review.json', json(difficultyReview));
const metaReview = {
  schemaVersion: 'JS_ARCHIVE_GENERATED_ONLY_BINDING_CANDIDATE_V1',
  target: { examUid, qid }, artifact: { sha256: hash(candidateBytes), gitBlobSha: blob(candidateBytes) },
  scope: { onlyThisCandidateQid: true, targetUidCount: 1 }, authorityRef,
};
write('.tmp/candidate/meta-review.json', json(metaReview));
const captureReport = {
  status: 'CAPTURED_REVIEW_REQUIRED', renderPass: false, qids: sourceBank.map(question => question.id),
  artifactSha: blob(candidateBytes), loadedJs: { sha256: hash(candidateBytes) },
  cases: [{ id: 'sol/desktop', captures: [{ qids: [qid], image: { path: '.tmp/candidate/capture/sol-desktop.png', sha256: hash(screenshotBytes) } }] }],
};
const captureBytes = json(captureReport);
write('.tmp/candidate/capture/machine-capture.json', captureBytes);
const answerReview = {
  schemaVersion: 'QUESTION_ONLY_REPLACEMENT_MATH_CHECK_V2', examUid, qid,
  candidateArtifactSha256: hash(candidateBytes), answer: qNew.answer, answerCardinality: 1,
  choicesAudit: [{ choice: '④', matches: true }], usesStoredOriginalAnswerOrSolutionAsAuthority: false,
  sourceBasis: { problemAssetRef: qOld.image, problemAssetSha256: hash(imageBytes), opened: true, studentInputSourceParity: 'NOT_APPLICABLE_QUESTION_ONLY' },
};
write('.tmp/candidate/answer-check.json', json(answerReview));

const visualSha = hash(svgBytes), imageSha = hash(imageBytes);
const row = {
  qid, sourceMode: 'QUESTION_ONLY', replacementMode: 'QUESTION_ONLY', sourceSlotUid: 'qid_v1_slot_19',
  provenanceEvidence: { questionOnlyReplacement: { originalSourceSha256: hash(sourceBytes), originalSourceGitBlobSha: blob(sourceBytes), originalTextRecovered: false, pdfReviewed: false, reason: 'Underdetermined source prompt.', preservedHistoryLedger: '.tmp/candidate/question-only-replacement-ledger.json', originalProblemImageSha256: imageSha } },
  answerAudit: { answer: qNew.answer, choices: qNew.choices, cardinality: 'ONE_CORRECT_COMBINATION', evidenceRef: '.tmp/candidate/answer-check.json' },
  solutionSha256: hash(Buffer.from(qNew.solution)), meta: { ...qMeta, disposition: 'GENERATED_ONLY_BINDING_CANDIDATE', extensionRef: '.tmp/candidate/meta-review.json' },
  difficulty: { ...qDifficulty, evidenceRef: '.tmp/candidate/difficulty-review.json' },
  visual: {
    problem: { necessity: 'VISUAL_REQUIRED', disposition: 'KEEP', ref: qNew.image, sha256: imageSha },
    solution: { necessity: 'VISUAL_OPTIONAL', disposition: 'ADD', benefitReason: 'Teaches the sign cases.', ref: qNew.solutionImage, sha256: visualSha, geometryEvidenceRef: '.tmp/candidate/geometry.json' },
  },
  axisEvidence: {
    questionLayout: { status: 'REVIEWED_CANDIDATE', disposition: 'QUESTION_ONLY_REPLACEMENT', evidence: 'Candidate prompt occupies qid 19.' },
    solutionLayout: { status: 'PASS', smallBoardContinuityStatus: 'PASS', solutionSha256: hash(Buffer.from(qNew.solution)) },
    meta: { ...qMeta, disposition: 'GENERATED_ONLY_BINDING_CANDIDATE', extensionRef: '.tmp/candidate/meta-review.json' },
    visualSvg: {
      problem: { necessity: 'VISUAL_REQUIRED', assetRef: qNew.image, assetSha256: imageSha },
      solution: { necessity: 'VISUAL_OPTIONAL', assetRef: qNew.solutionImage, assetSha256: visualSha, staticGeometryStatus: 'PASS', renderPassAsserted: false, geometryEvidenceRef: '.tmp/candidate/geometry.json' },
    },
  },
  actualRender: {
    status: 'CAPTURED_REVIEW_REQUIRED', renderPassAsserted: false, r3LayoutReviewStatus: 'PENDING',
    creatorScreenInspection: 'ACTUALLY_OPENED_AND_INSPECTED_Q19', captureReport: '.tmp/candidate/capture/machine-capture.json',
    captureReportSha256: hash(captureBytes), desktopSolutionScreenshot: '.tmp/candidate/capture/sol-desktop.png',
  },
};
const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX', stage: 'CREATE', examUid, artifactSha: blob(candidateBytes), artifactRawSha256: hash(candidateBytes),
  sourceIdentity: { sourceArchiveFile: sourcePath, sourceOrdinal: qid, baselineSourceRawSha256: hash(sourceBytes), currentCandidateQuestionUidStatus: 'RECOMPUTE_AT_REGISTRATION' },
  sourceParity: { qid, status: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT', sourceLiteralParityClaimed: false },
  targetScope: { qids: [qid], replacementOnly: true, fullExamStageClosure: false, nonTargetQidsSemanticParity: '23/23' },
  replacementProvenance: { preservedHistoryLedger: '.tmp/candidate/question-only-replacement-ledger.json' },
  questionOnlyReplacementAuthorityRef: authorityRef,
  rows: [row],
};

function run(overrides = {}) {
  return validateQuestionOnlyReplacement({
    evidence: overrides.evidence || evidence,
    row: overrides.row || row,
    questions: overrides.questions || candidateBank,
    repoRoot: root,
    assetRoot: path.join(root, '.tmp/candidate'),
    artifactRawSha256: overrides.artifactRawSha256 || hash(candidateBytes),
    artifactGitBlobSha: overrides.artifactGitBlobSha || blob(candidateBytes),
    authorityRef: overrides.authorityRef === undefined ? authorityRef : overrides.authorityRef,
    authority: overrides.authority === undefined ? authority : overrides.authority,
  });
}

const good = run();
assert.equal(good.ok, true, JSON.stringify(good.issues));
assert.equal(good.summary.changedQids.join(','), String(qid));
assert.equal(good.summary.candidateFieldBindings.qid, qid);
const createStage = validateCreateEvidence({
  examUid, artifactSha: blob(candidateBytes), actualArtifactSha: blob(candidateBytes), actualArtifactRawSha256: hash(candidateBytes),
  evidenceRef: '.tmp/candidate/CREATE.q19.evidence.bound.v2.json', evidence, expectedQids: sourceBank.map(question => question.id),
  questions: candidateBank, repoRoot: root, assetRoot: path.join(root, '.tmp/candidate'),
  questionOnlyAuthority: authority, questionOnlyAuthorityRef: authorityRef,
});
assert.equal(createStage.ok, true, JSON.stringify(createStage.issues));
assert.equal(createStage.candidateScope, 'QUESTION_ONLY_QID_CANDIDATE');
assert.equal(createStage.fullExamStageClosure, false);
const missingGenericAxes = validateCreateEvidence({
  examUid, artifactSha: blob(candidateBytes), actualArtifactSha: blob(candidateBytes), actualArtifactRawSha256: hash(candidateBytes),
  evidenceRef: '.tmp/candidate/evidence.json', evidence: { ...evidence, rows: [{ ...row, axisEvidence: { questionLayout: {}, solutionLayout: {} } }] },
  expectedQids: sourceBank.map(question => question.id), questions: candidateBank, repoRoot: root, assetRoot: path.join(root, '.tmp/candidate'),
  questionOnlyAuthority: authority, questionOnlyAuthorityRef: authorityRef,
});
assert(missingGenericAxes.issues.some(code => code.startsWith('CREATE_AXIS_EVIDENCE_REQUIRED:meta')));
const r1QuestionOnly = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', examUid, artifactSha: blob(candidateBytes),
  rows: [{ qid, sourceMode: 'QUESTION_ONLY', independentAnswer: '④', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: '④', compareResult: 'MATCH', verdict: 'PASS' }],
};
const missingR1Disposition = validateR1Evidence({ examUid, artifactSha: blob(candidateBytes), actualArtifactSha: blob(candidateBytes), evidenceRef: 'r1.json', evidence: r1QuestionOnly, expectedQids: [qid] });
assert(missingR1Disposition.issues.includes('R1_DISPOSITION_REQUIRED:q19'));
assert(validateR1Evidence({ examUid, artifactSha: blob(candidateBytes), actualArtifactSha: blob(candidateBytes), evidenceRef: 'missing-r1.json', evidence: { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', examUid, artifactSha: blob(candidateBytes), rows: [] }, expectedQids: [qid] }).issues.includes('COMMON_QID_MISSING:q19'));
assert(validateR2Evidence({ examUid, artifactSha: blob(candidateBytes), actualArtifactSha: blob(candidateBytes), evidenceRef: 'missing-r2.json', evidence: { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R2', examUid, artifactSha: blob(candidateBytes), rows: [] }, expectedQids: [qid] }).issues.includes('COMMON_QID_MISSING:q19'));

assert(run({ authority: null, authorityRef: null }).issues.includes('QUESTION_ONLY_AUTHORITY_REF_REQUIRED'));
assert(run({ authorityRef: { path: authorityPath, sha256: '0'.repeat(64) } }).issues.includes('QUESTION_ONLY_AUTHORITY_FILE_SHA_MISMATCH'));
assert(run({ authorityRef: { path: '.tmp/candidate/missing-authority.json', sha256: '0'.repeat(64) } }).issues.includes('QUESTION_ONLY_AUTHORITY_FILE_SHA_MISMATCH'));
assert(run({ authority: { ...authority, candidate: { ...authority.candidate, rawSha256: '0'.repeat(64) } } }).issues.includes('QUESTION_ONLY_CANDIDATE_SHA_MISMATCH'));
assert(run({ authority: { ...authority, replacementScope: 'ALIVE_REPLACEMENT' } }).issues.includes('QUESTION_ONLY_AUTHORITY_INVALID'));
assert(run({ authority: { ...authority, status: 'INVALID' } }).issues.includes('QUESTION_ONLY_AUTHORITY_INVALID'));
assert(run({ row: { ...row, sourceMode: 'ALIVE_REPLACEMENT' } }).issues.includes('QUESTION_ONLY_MODE_PAIR_REQUIRED'));
assert(run({ row: { ...row, replacementMode: 'ALIVE_REPLACEMENT' } }).issues.includes('QUESTION_ONLY_MODE_PAIR_REQUIRED'));
assert(run({ row: { ...row, answerAudit: { ...row.answerAudit, answer: '③' } } }).issues.includes('QUESTION_ONLY_ANSWER_BINDING_INVALID'));
assert(run({ row: { ...row, visual: { ...row.visual, solution: { ...row.visual.solution, sha256: '0'.repeat(64) } } } }).issues.includes('QUESTION_ONLY_VISUAL_SHA_MISMATCH:solution'));
assert(run({ evidence: { ...evidence, sourceParity: { status: 'PASS', sourceLiteralParityClaimed: true } } }).issues.includes('QUESTION_ONLY_SOURCE_PARITY_MUST_REMAIN_UNCLAIMED'));
assert(run({ questions: candidateBank.slice(1) }).issues.includes('QUESTION_ONLY_QID_OR_DENOMINATOR_CHANGED'));

const holdReceiptFile = path.join(root, historyFiles[2][0]);
const falseHoldReceipt = { ...sourceHoldReceipt, q19Hold: { ...sourceHoldReceipt.q19Hold, status: 'PASS' } };
const falseHoldBytes = json(falseHoldReceipt);
fs.writeFileSync(holdReceiptFile, falseHoldBytes);
assert(run().issues.includes('QUESTION_ONLY_HISTORY_COPY_SHA_MISMATCH'));
const updatedLedger = JSON.parse(fs.readFileSync(path.join(root, '.tmp/candidate/question-only-replacement-ledger.json'), 'utf8'));
const holdCopy = updatedLedger.historyCopies.find(item => item.path === historyFiles[2][0]);
holdCopy.sha256 = hash(falseHoldBytes);
write('.tmp/candidate/question-only-replacement-ledger.json', JSON.stringify(updatedLedger));
assert(run().issues.includes('QUESTION_ONLY_TRUE_HOLD_NOT_PROVEN'));

console.log('question-only-replacement-v2.test.mjs PASS');
