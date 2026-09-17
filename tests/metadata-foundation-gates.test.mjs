import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  computeDifficultyBucket,
  contentFingerprint,
  deriveDecisiveSolutionEvidence,
  validateDecisiveSolutionEvidence,
  loadCanonicalRpmMaster,
  sha256,
  sourceFingerprint,
  validateCanonicalSelection,
  validateHoldEvidence,
  validateIdentityCardinality,
  validateIndependentRecheckRecord,
  validateRepresentationRuleWitness,
  validateSourceBinding
} from '../archive/tools/intelligence/metadata-foundation-gates.mjs';
import { buildMetadata, validateClassificationArtifactBinding, validateReviewedMetadataPromotion } from '../archive/tools/intelligence/build-approved-question-metadata-v1.mjs';
import { classifyRecord } from '../archive/tools/intelligence/build-complete-subunit-classification-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = loadCanonicalRpmMaster(root);
const question = { content: 'x+1=2', choices: ['① 1', '② 2'], answer: '②', solution: 'x=1', image: '' };
const identity = { questionUid: 'q1', sourceArchiveFile: 'original/high/h1/sample.js', sourceOrdinal: 1 };

function difficulty(overrides = {}) {
  return {
    questionUid: 'q1', sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: 1,
    sourceFingerprint: sourceFingerprint(question), inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE',
    conceptCount: 1, conditionInterpretation: 'low', strategyChoice: false,
    nonRoutineTransformation: false, caseBranching: false, rangeConstraint: false,
    integerConstraint: false, existenceCheck: false, decisiveInsight: false,
    executionBurden: 'low', ...overrides
  };
}

test('decisive evidence rejects generic/conclusion-only values and accepts a source-grounded proof object', () => {
  const identityWithPayload = { ...identity, content: question.content, choices: question.choices, answer: question.answer, solution: question.solution, image: question.image };
  for (const value of ['따라서', '그러므로', '정리하면', '계산하면', '조건을 이용하면', '값을 구한다', '답을 얻는다', '위 식에서', '핵심은', '[키포인트]']) {
    assert.equal(validateDecisiveSolutionEvidence({ decisiveSolutionStep: value }, identityWithPayload).ok, false, value);
  }
  const evidence = deriveDecisiveSolutionEvidence(question, identity);
  assert.equal(evidence.validation.ok, true);
  assert.ok(evidence.usedEvidence.length > 0);
  assert.ok(evidence.mathematicalObjects.length > 0);
  assert.ok(evidence.mathematicalAction);
  assert.ok(evidence.resultingConditionOrConclusion);
  assert.equal(validateDecisiveSolutionEvidence(evidence, identityWithPayload).ok, true);
});

test('decisive evidence substantive negative control rejects heading and action without a result', () => {
  const result = deriveDecisiveSolutionEvidence({ solution: '[키포인트] 조건을 이용하여 값을 구한다.\n풀이 방향\n$x$에 대하여 정리하면' }, identity);
  assert.equal(result.validation.ok, false);
  assert.ok(result.validation.errors.includes('DECISIVE_STEP_NO_SUBSTANTIVE_SOURCE_LINE'));
});

test('decisive evidence accepts a substantive result containing a formal transition word', () => {
  const source = { ...question, solution: '$(x-1)^2=4$이므로 $x=3$ 또는 $x=-1$이다.' };
  const result = deriveDecisiveSolutionEvidence(source, identity);
  assert.equal(result.validation.ok, true);
  assert.match(result.decisiveSolutionStep, /x=3/);
});

test('legacy source-key preservation is demonstrably not semantic verification', () => {
  const legacyAdapter = value => value.subUnitKey;
  assert.equal(legacyAdapter({ subUnitKey: 'WRONG_EXISTING_KEY' }), 'WRONG_EXISTING_KEY');
  assert.equal(validateSourceBinding(identity, {
    ...identity,
    sourceFingerprint: sourceFingerprint(question),
    contentFingerprint: contentFingerprint(question)
  }, question).ok, true);
});

test('source binding rejects stale UID, path, ordinal, and payload fingerprints', () => {
  const result = validateSourceBinding(identity, {
    questionUid: 'q-other', sourceArchiveFile: 'original/high/h1/other.js', sourceOrdinal: 2,
    sourceFingerprint: 'stale', contentFingerprint: 'stale'
  }, question);
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors.sort(), ['CONTENT_FINGERPRINT_MISMATCH', 'QUESTION_UID_MISMATCH', 'SOURCE_FILE_MISMATCH', 'SOURCE_FINGERPRINT_MISMATCH', 'SOURCE_ORDINAL_MISMATCH'].sort());
});

test('cardinality excludes only fixtures and hard-fails missing production classifications', () => {
  const result = validateIdentityCardinality([
    { questionUid: 'prod', sourceArchiveFile: 'original/a.js' },
    { questionUid: 'fixture', sourceArchiveFile: 'test-fixtures/render-authority-golden.js' }
  ], [{ questionUid: 'prod', sourceArchiveFile: 'original/a.js' }]);
  assert.equal(result.ok, true);
  assert.equal(result.excludedFixtureIdentityCount, 1);
  const missing = validateIdentityCardinality([{ questionUid: 'prod', sourceArchiveFile: 'original/a.js' }], []);
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.missingClassification, ['prod']);
});

test('canonical RPM v1.0 selection validates hierarchy and forces extended candidates off', () => {
  const valid = validateCanonicalSelection({ curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '두 점 사이의 거리', L4: '거리 공식', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }, canonical);
  assert.equal(valid.ok, true);
  const extended = validateCanonicalSelection({ curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '선분의 내분·외분', L4: '외분점', curriculumApplicability: 'RPM_EXTENDED_CANDIDATE', defaultSelectable: true }, canonical);
  assert.equal(extended.ok, false);
  assert.ok(extended.errors.includes('RPM_EXTENDED_CANDIDATE_MUST_BE_FALSE'));
  const missing = validateCanonicalSelection({ curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '없는 개념', L4: '없는 유형', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }, canonical);
  assert.ok(missing.errors.includes('CANONICAL_L4_NOT_FOUND'));
});

test('difficulty ignores calculation/points/solution length/image and does not promote execution alone', () => {
  const simple = computeDifficultyBucket(difficulty({ executionBurden: 'high', points: 9.9, solutionLength: 10000, image: 'large' }));
  assert.equal(simple.difficultyBucket, 1);
  const strategic = computeDifficultyBucket(difficulty({ strategyChoice: true, conditionInterpretation: 'high', decisiveInsight: true, conceptCount: 2 }));
  assert.ok(strategic.difficultyBucket > 1);
  const unknown = computeDifficultyBucket(difficulty({ sourceFingerprint: undefined }));
  assert.equal(unknown.difficultyBucket, 'UNKNOWN');
  assert.equal(unknown.reviewStatus, 'HOLD');
  const noInsight = computeDifficultyBucket(difficulty({ strategyChoice: true, nonRoutineTransformation: true, conditionInterpretation: 'high', caseBranching: true, conceptCount: 3 }));
  assert.notEqual(noInsight.difficultyBucket, 5);
  const bucketFive = computeDifficultyBucket(difficulty({ strategyChoice: true, nonRoutineTransformation: true, conditionInterpretation: 'high', caseBranching: true, existenceCheck: true, decisiveInsight: true, conceptCount: 3 }));
  assert.equal(bucketFive.difficultyBucket, 5);
});

test('representation and HOLD states require machine evidence', () => {
  assert.equal(validateRepresentationRuleWitness({ representationRuleApplied: true }).ok, false);
  assert.equal(validateRepresentationRuleWitness({ representationRuleApplied: true, representationRuleWitness: { ruleId: 'R1', predicate: 'x>0', inputs: { x: 1 }, sourceEvidenceHash: 'sha' } }).ok, true);
  assert.equal(validateHoldEvidence({ reviewStatus: 'HOLD' }).ok, false);
  assert.equal(validateHoldEvidence({ reviewStatus: 'HOLD', holdEvidence: { reason: 'no fit', missingEvidence: ['canonical_subunit_fit'] } }).ok, true);
});

test('representation and HOLD witnesses are bound to the current source', () => {
  const expected = { questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: 1, sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question) };
  const witness = { ruleId: 'R1', predicate: 'x>0', inputs: { x: 1 }, ...expected, sourceEvidenceHash: sha256(JSON.stringify(expected)) };
  assert.equal(validateRepresentationRuleWitness({ representationRuleApplied: true, representationRuleWitness: witness }, identity, question).ok, true);
  assert.equal(validateRepresentationRuleWitness({ representationRuleApplied: true, representationRuleWitness: { ...witness, sourceFingerprint: 'stale' } }, identity, question).ok, false);
  assert.equal(validateHoldEvidence({ reviewStatus: 'HOLD', holdEvidence: { reason: 'missing', missingEvidence: ['x'], ...expected } }, identity, question).ok, true);
  assert.equal(validateHoldEvidence({ reviewStatus: 'HOLD', holdEvidence: { reason: 'missing', missingEvidence: ['x'], ...expected, contentFingerprint: 'stale' } }, identity, question).ok, false);
});

test('independent recheck rejects first-pass/preselected fields and accepts blind evidence only', () => {
  const base = {
    questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
    sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question),
    inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE',
    independentSemanticClassification: { curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '두 점 사이의 거리', L4: '거리 공식', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true },
    independentDifficultyEvidence: difficulty(), representationRuleApplied: false
  };
  assert.equal(validateIndependentRecheckRecord(base, identity, question, canonical).ok, true);
  const contaminated = { ...base, firstPassEvidence: {}, difficultyBucket: 3 };
  const result = validateIndependentRecheckRecord(contaminated, identity, question, canonical);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('RECHECK_PRESELECTED_FIELDS_PRESENT'));
});

test('HIGH1 source regression is identity-bound and source metadata is not semantic proof', () => {
  const sourcePath = path.join(root, 'archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js');
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { timeout: 1500 });
  const q7 = context.window.questionBank[6];
  assert.match(q7.content, /내분하는 점.*외분하는 점/);
  assert.equal(q7.subUnitKey, 'H22-C2-01-COORDINATE_METRIC');
  const exact = { questionUid: 'h1-q7', sourceArchiveFile: 'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', sourceOrdinal: 7 };
  const bound = validateSourceBinding(exact, { ...exact, sourceFingerprint: sourceFingerprint(q7), contentFingerprint: contentFingerprint(q7) }, q7);
  assert.equal(bound.ok, true);
});

test('exact 2025 source identity uses c.js names and an unseen HIGH1 sample validates canonically', () => {
  assert.equal(fs.existsSync(path.join(root, 'archive/exams/original/high/h1/1final/25_제일고_1학기_기말_고1_기출c.js')), true);
  assert.equal(fs.existsSync(path.join(root, 'archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출c.js')), true);
  const unseen = validateCanonicalSelection({ curriculumKey: '2022', L1: '도형의 방정식', L2: '원의 방정식', L3: '원과 직선', L4: '현의 길이', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }, canonical);
  assert.equal(unseen.ok, true);
});

test('actual classifier output can enter injectable builder without fingerprint failures and remains non-writable when preserved', () => {
  const sourcePath = path.join(root, 'archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js');
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { timeout: 1500 });
  const sourceQuestion = context.window.questionBank[6];
  const sourceRecord = { questionUid: 'integration-q7', sourceArchiveFile: 'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', sourceOrdinal: 7, sourceFingerprint: sourceFingerprint(sourceQuestion) };
  const classified = classifyRecord(sourceRecord, sourceQuestion, [], null);
  const report = buildMetadata({
    identityInput: { records: [sourceRecord] },
    classificationInput: { records: [classified] },
    sourceQuestionsInput: new Map([[sourceRecord.questionUid, sourceQuestion]]),
    previousMetadataInput: { records: [] },
    reviewedPassInput: new Map(),
    canonicalInput: canonical
  });
  assert.equal(report.consistency.sourceFingerprintFailures, 0);
  assert.equal(report.productionWriteAllowed, false);
  assert.equal(report.records[0].sourceMetadataVerification, 'PRESERVED_SOURCE_UNVERIFIED');
  assert.equal(report.records[0].fieldStatus.subUnit, 'preserved_unverified');
  assert.equal(classified.classification.confidence, 'existing_preserved');
});

test('actual classifier no-fit output is held before normal metadata record acceptance', () => {
  const noFitQuestion = { ...question, standardUnitKey: 'UNMAPPED-TEST', subUnitKey: undefined, subUnit: undefined };
  const noFitIdentity = { questionUid: 'no-fit', sourceArchiveFile: 'original/high/h1/no-fit.js', sourceOrdinal: 1 };
  const classified = classifyRecord(noFitIdentity, noFitQuestion, [], null);
  assert.equal(classified.classification.status, 'FOUNDATION_DEFECT_CANDIDATE');
  assert.equal(classified.classification.classificationDepth, 'no_fit');
  assert.throws(() => buildMetadata({
    identityInput: { records: [noFitIdentity] }, classificationInput: { records: [classified] },
    sourceQuestionsInput: new Map([[noFitIdentity.questionUid, noFitQuestion]]), previousMetadataInput: { records: [] }, reviewedPassInput: new Map(), canonicalInput: canonical
  }), /classification foundation defect hold/);
});

test('builder integration accepts a valid preserved classification only with current fingerprints', () => {
  const sourcePath = path.join(root, 'archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js');
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { timeout: 1500 });
  const sourceQuestion = context.window.questionBank[6];
  const sourceRecord = {
    questionUid: 'h1-q7', sourceArchiveFile: 'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', sourceOrdinal: 7
  };
  const classification = {
    ...sourceRecord,
    sourceFingerprint: sourceFingerprint(sourceQuestion),
    contentFingerprint: contentFingerprint(sourceQuestion),
    classification: { subUnitKey: sourceQuestion.subUnitKey, subUnit: sourceQuestion.subUnit }
  };
  assert.equal(validateClassificationArtifactBinding(sourceRecord, classification, sourceQuestion).ok, true);
});

test('builder integration requires a valid independent review packet before promotion', () => {
  const packet = difficulty();
  const reviewed = {
    questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
    sourceFingerprint: sourceFingerprint(question), independentRecheck: {
      questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
      sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question), inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE',
      independentSemanticClassification: { curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '두 점 사이의 거리', L4: '거리 공식', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true },
      independentDifficultyEvidence: packet, representationRuleApplied: false
    },
    problemTypeKey: 'TEST_TYPE'
  };
  assert.equal(validateReviewedMetadataPromotion(reviewed, identity, question, canonical).ok, true);
  const invalid = { ...reviewed, independentRecheck: null };
  const result = validateReviewedMetadataPromotion(invalid, identity, question, canonical);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('INDEPENDENT_SEMANTIC_PACKET_MISSING'));
});

test('difficulty evidence identity cannot be replaced by current overlay values', () => {
  const stale = difficulty({ questionUid: 'wrong', sourceOrdinal: 99, sourceFingerprint: 'stale' });
  const result = validateSourceBinding(identity, stale, question);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('QUESTION_UID_MISMATCH'));
  assert.ok(result.errors.includes('SOURCE_ORDINAL_MISMATCH'));
  assert.ok(result.errors.includes('SOURCE_FINGERPRINT_MISMATCH'));
});

test('builder rejects different top-level difficulty evidence from the validated independent packet', () => {
  const independent = difficulty();
  const reviewed = {
    questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
    sourceFingerprint: sourceFingerprint(question), difficultyEvidence: difficulty({ strategyChoice: true }), problemTypeKey: 'TEST_TYPE',
    independentRecheck: {
      questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
      sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question), inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE',
      independentSemanticClassification: { curriculumKey: '2022', L1: '도형의 방정식', L2: '평면좌표', L3: '두 점 사이의 거리', L4: '거리 공식', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true },
      independentDifficultyEvidence: independent, representationRuleApplied: false
    }
  };
  assert.throws(() => buildMetadata({
    identityInput: { records: [identity] }, classificationInput: { records: [{ ...identity, sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question), classification: { subUnitKey: 'M1', subUnit: 'x' } }] },
    sourceQuestionsInput: new Map([[identity.questionUid, question]]), previousMetadataInput: { records: [] }, reviewedPassInput: new Map([[identity.questionUid, reviewed]]), canonicalInput: canonical
  }), /DIFFICULTY_EVIDENCE_DIGEST_MISMATCH/);
});

test('checked-in runtime rejects stale or partial sidecars without promoting metadata', async () => {
  const runtimePath = path.join(root, 'archive/question-meta.js');
  const context = {
    window: {},
    document: { baseURI: 'https://metadata.invalid/' },
    URL,
    fetch: async () => ({ ok: true, json: async () => ({
      approvalStatus: 'APPROVED_PARTIAL_WITH_EXPLICIT_HOLDS',
      productionWriteAllowed: false,
      records: [{ questionUid: 'q1', subUnitKey: 'STALE_WRONG_KEY' }]
    }) }),
    console: { log() {}, warn() {}, error() {} }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(runtimePath, 'utf8'), context, { filename: runtimePath, timeout: 1500 });
  await context.window.__ARCHIVE_METADATA_READY__;
  const sourceQuestion = { id: 1, subUnitKey: 'SOURCE_KEY' };
  const merged = context.window.mergeArchiveQuestionMetadata(sourceQuestion, { questionUid: 'q1', sourceArchiveFile: 'original/a.js', sourceOrdinal: 1 });
  assert.equal(merged.subUnitKey, 'SOURCE_KEY');
  assert.equal(merged._archiveMetadata, undefined);
  assert.equal(context.window.getArchiveQuestionMetadata({ questionUid: 'q1' }), null);
});

test('canonical selection rejects ambiguous hierarchy when level/scope context is omitted', () => {
  const ambiguous = { master: { records: [
    { curriculum: '2022', level: 'high', scope: 'A', majorUnit: 'L1', midUnit: 'L2', concepts: [{ concept: 'L3', problemTypes: [{ problemType: 'L4', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }] }] },
    { curriculum: '2022', level: 'high', scope: 'B', majorUnit: 'L1', midUnit: 'L2', concepts: [{ concept: 'L3', problemTypes: [{ problemType: 'L4', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }] }] }
  ] } };
  const result = validateCanonicalSelection({ curriculumKey: '2022', L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true }, ambiguous);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('CANONICAL_SELECTION_AMBIGUOUS_CONTEXT'));
});
