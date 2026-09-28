import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import {
  buildDecisionIsolatedInput,
  activeCandidateKeysForScope,
  buildResolverDecisionEvidence,
  makeDifficultyEvidence,
  makeMetaValidatorReceipt,
  makeR2ESourceMetaProjection,
  R2E_META_INPUT_SCHEMA_V2,
  resolveMetaRoute,
  sealR2EMetaReceipt,
  validateBlindDifficulty,
  validateMetaFinalization,
  validateR2EReceipt,
  validateR2EIntakeMetaReceipt,
  validateResolverEvidence,
  validateMetaValidatorReceipt,
  validateRuntimeMetaParity,
  questionUidForSource,
} from './rpm-active-resolver.mjs';

const root = new URL('../../../', import.meta.url).pathname.replace(/^\//, '').replaceAll('/', '\\');
const registry = loadActiveMetaRegistry(root);
const crosswalk = JSON.parse(fs.readFileSync(`${root}\\archive\\data\\meta-foundation\\crosswalks\\rpm-primary-v1.0\\high1.json`, 'utf8'));
const rowFor = id => crosswalk.records.find(row => row.id === id);

function makeInput(row, overrides = {}) {
  const sourceArchiveFile = 'original/high/h1/1final/fixture.js';
  const sourceIdentityKey = `${objectSha('source pdf')}|1`;
  const input = {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, 1),
      sourceIdentityKey,
      sourceOrdinal: 1,
      contentHash: objectSha('source content'),
      choicesHash: objectSha(['①', '②']),
      imageRefHash: objectSha(''),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha('verified student solution') },
    curriculumContext: {
      grade: 'H1', curriculum: row.curriculum, scope: row.scope, standardCourse: row.standardCourse,
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '',
    },
    semanticDecision: {
      primaryMethod: '인수의 계수를 비교해 계수를 결정한다.',
      decisiveStep: '동류항의 계수를 각각 비교한다.',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
    ...overrides,
  };
  return input;
}

function makeDifficulty(resolution, bucket = 2, extra = {}) {
  return makeDifficultyEvidence({
    status: 'PASS', blindPassStatus: 'FRESH_INDEPENDENT', sourceFingerprint: resolution.sourceFingerprint,
    solutionHash: resolution.semanticInputBundle.solutionIdentity.solutionHash, independentOfSemanticPass: true,
    difficultyBucket: bucket, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE',
    legacyLevelCompatibility: 'NORMAL', rationale: '조건 수와 독립 계산 단계로 fresh 판정.',
    blindReviewerId: 'reviewer-b', decisionSha: objectSha({ bucket, uid: resolution.semanticInputBundle.sourceIdentity.questionUid }), ...extra,
  });
}

function makeCandidate(resolution) {
  const row = rowFor('H1-RPM-001');
  return {
    standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, standardCourse: row.standardCourse,
    problemTypeKey: resolution.problemTypeKey, templateKey: resolution.templateKey, crossConceptKeys: [], conditionKeys: [],
    integrationPattern: 'NONE', integrationReason: '독립된 개념 결합이 없다.',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
}

function makeRelational(resolution) {
  const evidence = {
    schemaVersion: 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1', sourceFingerprint: resolution.sourceFingerprint,
    inputBundleSha: resolution.inputBundleSha, candidateVisibleDuringDecision: false,
    crossConceptDecisions: [], conditionDecisions: [],
  };
  evidence.evidenceSha = objectSha(evidence);
  return evidence;
}

test('DIRECT_ACTIVE resolves through RPM, exact crosswalk, active owner and binding', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  const generated = buildResolverDecisionEvidence(input, { repoRoot: root });
  assert.equal(generated.validation.status, 'PASS');
  assert.equal(validateMetaValidatorReceipt(generated.validatorReceipt, generated.resolverEvidence.evidenceSha, generated.validation), true);
  const result = resolveMetaRoute(input, { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_REUSE');
  assert.equal(result.crosswalkFile, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json');
  assert.equal(result.crosswalkRecordId, 'H1-RPM-001');
  assert.equal(result.ownerPack, 'H1_FOUNDATION');
  assert.equal(result.bindingOwnerPack, 'H1_FOUNDATION');
  assert.match(result.bindingIdentity, /^2015\|H15-SA-01\|H15-SA-01-POLYNOMIAL_BASIC\|/);
  assert.ok(result.authorityRefs.findIndex(ref => ref.path.endsWith('CANONICAL_MASTER.json')) < result.authorityRefs.findIndex(ref => ref.path.includes('/crosswalks/')));
  assert.ok(result.authorityRefs.some(ref => ref.role === 'ACTIVE_META_COMPATIBILITY_PROJECTION'));
  assert.equal(validateResolverEvidence(input, result, { repoRoot: root }).status, 'PASS');
});

test('FAMILY_ACTIVE only reuses a template selected after crosswalk lookup', () => {
  const row = rowFor('H1-RPM-010');
  const input = makeInput(row);
  const bundle = buildDecisionIsolatedInput(input);
  input.familyTemplateSelection = {
    stage: 'POST_CROSSWALK', inputBundleSha: bundle.inputBundleSha, crosswalkRecordId: row.id,
    templateKey: row.templateCandidates[0].templateKey, decisiveStepReason: '합성 제수 조건을 인수 관계로 분리한다.',
  };
  const result = resolveMetaRoute(input, { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_REUSE');
  assert.equal(result.templateKey, row.templateCandidates[0].templateKey);
  assert.equal(validateResolverEvidence(input, result, { repoRoot: root }).status, 'PASS');
});

test('FAMILY_ACTIVE remains unclosed without post-crosswalk template selection', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-010')), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'META_ONLY_COMPATIBILITY_PENDING');
  assert.equal(result.advancedMetaEligible, false);
  assert.equal(result.projectionReasonCode, 'FAMILY_TEMPLATE_SELECTION_PENDING');
  assert.equal(result.problemTypeKey, '');
  assert.equal(result.templateKey, '');
});

test('RPM semantics remain final when its exact compatibility binding is missing', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-029')), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_BINDING_PENDING');
  assert.equal(result.mappedProblemTypeKey, 'PT_H1_ROOT_COEFFICIENT_RELATION');
  assert.equal(result.problemTypeKey, '');
  assert.equal(result.templateKey, '');
});

test('RPM semantics remain final when no legacy PT/TPL projection exists', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-009')), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_UNMATERIALIZED');
  assert.equal(result.problemTypeKey, '');
});

test('a path absent from RPM Primary is a true semantic hold', () => {
  const row = rowFor('H1-RPM-001');
  const input = makeInput(row);
  input.curriculumContext.standardUnitKey = 'H15-UNMAPPED-FIXTURE';
  input.curriculumContext.subUnitKey = 'H15-UNMAPPED-FIXTURE-SUB';
  input.semanticDecision.rpmPath = { curriculum: row.curriculum, scope: row.scope, majorUnit: '검증용 단원', midUnit: '검증용 중단원', l3: '없는 유형', l4: '없는 풀이 구조' };
  input.activeSearchEvidence = {
    status: 'COMPLETED_NO_MATCH', searchedGlobalActive: true, candidateKeys: [], registrySha: registry.registrySha,
    searchMethod: 'GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2',
    searchedScope: { curriculum: '2015', standardUnitKey: input.curriculumContext.standardUnitKey, subUnitKey: input.curriculumContext.subUnitKey },
  };
  const result = resolveMetaRoute(input, { repoRoot: root, registry });
  assert.equal(result.disposition, 'TRUE_META_HOLD');
  assert.equal(result.semanticStatus, 'HOLD');
  assert.equal(result.problemTypeKey, '');
});

test('a verified RPM path stays semantic FINAL regardless of an empty or stale ACTIVE search receipt', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  input.activeSearchEvidence = { status: 'COMPLETED_NO_MATCH', searchedGlobalActive: true,
    candidateKeys: [], registrySha: 'sha256:stale', searchMethod: 'GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2',
    searchedScope: { curriculum: '2015', standardUnitKey: 'WRONG', subUnitKey: '' } };
  const result = resolveMetaRoute(input, { repoRoot: root, registry });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_REUSE');
});
test('M1/M2/M3 RPM semantic FINAL is independent of legacy projection gaps', () => {
  const fixtures = [
    ['M1', 'middle1.json', 'original/middle/m1/1mid/fixture.js'],
    ['M2', 'middle2.json', 'original/middle/m2/1mid/fixture.js'],
    ['M3', 'middle3.json', 'original/middle/m3/1mid/fixture.js'],
  ];
  for (const [grade, crosswalkFile] of fixtures) {
    const file = root + '\\archive\\data\\meta-foundation\\crosswalks\\rpm-primary-v1.0\\' + crosswalkFile;
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    const row = doc.records.find(candidate => candidate.mappingStatus === 'RPM_ONLY' && candidate.rpmPath?.l3 && candidate.rpmPath?.l4);
    assert.ok(row, grade + ' fixture needs an RPM_ONLY projection row');
    const input = makeInput(row);
    input.curriculumContext.grade = grade;
    input.sourceIdentity.sourceArchiveFile = 'original/middle/' + grade.toLowerCase() + '/1mid/fixture.js';
    input.sourceIdentity.questionUid = questionUidForSource(input.sourceIdentity.sourceArchiveFile, 1);
    input.sourceIdentity.sourceIdentityKey = input.sourceIdentity.questionUid;
    const evidence = resolveMetaRoute(input, { repoRoot: root });
    assert.equal(evidence.disposition, 'RPM_SEMANTIC_FINAL', grade + ' semantic disposition');
    assert.equal(evidence.semanticStatus, 'FINAL', grade + ' semantic status');
    assert.equal(evidence.projectionStatus, 'PROJECTION_UNMATERIALIZED', grade + ' projection status');
    assert.equal(validateResolverEvidence(input, evidence, { repoRoot: root }).status, 'PASS', grade + ' receipt parity');
  }
});

test('candidate leakage in the first semantic decision is rejected', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  input.semanticDecision.templateKey = 'TPL_H1_POLY_OPERATION_DIRECT';
  assert.throws(() => resolveMetaRoute(input, { repoRoot: root }), /FORBIDDEN_CANDIDATE_INPUT/);
});

test('an invalid ACTIVE template affects only the compatibility projection', () => {
  const badRegistry = { ...registry, templates: new Map(registry.templates) };
  const template = badRegistry.templates.get('TPL_H1_POLY_OPERATION_DIRECT');
  badRegistry.templates.set(template.templateKey, { ...template, parentProblemTypeKey: 'PT_WRONG_PARENT' });
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-001')), { repoRoot: root, registry: badRegistry });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_UNMATERIALIZED');
  assert.equal(result.projectionReasonCode, 'ACTIVE_TEMPLATE_PROJECTION_NOT_MATERIALIZED');
});

test('canonical PT owner may differ from exact curriculum binding owner', () => {
  const row = rowFor('H1-RPM-124');
  const result = resolveMetaRoute(makeInput(row), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_REUSE');
  assert.equal(result.ownerPack, 'PROBABILITY_STATISTICS');
  assert.equal(result.bindingOwnerPack, 'H1_FOUNDATION');
});

test('active TPL owner can differ from canonical PT owner and grade binding owner', () => {
  assert.ok(registry.activePacks.has('MIDDLE1'), 'fixture requires the active middle-school pack');
  const splitRegistry = { ...registry, templates: new Map(registry.templates) };
  const template = splitRegistry.templates.get('TPL_H1_POLY_OPERATION_DIRECT');
  splitRegistry.templates.set(template.templateKey, { ...template, ownerPack: 'MIDDLE1' });
  const input = makeInput(rowFor('H1-RPM-001'));
  const result = resolveMetaRoute(input, { repoRoot: root, registry: splitRegistry });
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_REUSE');
  assert.equal(result.ownerPack, 'H1_FOUNDATION');
  assert.equal(result.bindingOwnerPack, 'H1_FOUNDATION');
  assert.equal(validateResolverEvidence(input, result, { repoRoot: root, registry: splitRegistry }).status, 'PASS');
});

test('validator run receipt is mandatory before Meta finalization', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  const resolution = resolveMetaRoute(input, { repoRoot: root });
  const difficulty = makeDifficulty(resolution);
  const candidateMeta = makeCandidate(resolution);
  const common = { input, resolverEvidence: resolution, difficultyEvidence: difficulty, candidateMeta, semanticMetaEvidence: makeRelational(resolution), repoRoot: root };
  const preflight = validateMetaFinalization({ ...common, requireValidatorReceipt: false });
  assert.equal(preflight.status, 'PASS', JSON.stringify(preflight.errors));
  assert.ok(validateMetaFinalization(common).errors.includes('META_DETERMINISTIC_VALIDATOR_NOT_RUN'));
  const receipt = makeMetaValidatorReceipt(resolution, preflight);
  assert.equal(validateMetaFinalization({ ...common, validatorReceipt: receipt }).status, 'PASS');
});

test('candidate difficulty projection must exactly match fresh blind evidence', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  const difficultyEvidence = makeDifficulty(resolverEvidence, 2);
  const semanticMetaEvidence = makeRelational(resolverEvidence);
  const candidateMeta = makeCandidate(resolverEvidence);
  const common = { input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence, requireValidatorReceipt: false, repoRoot: root };
  assert.equal(validateMetaFinalization(common).status, 'PASS');
  const cases = [
    ['difficultyBucket', 3], ['difficultyBucket', 'UNKNOWN'], ['difficultyConfidence', 'high'],
    ['difficultyBoundaryFlag', 'B23'], ['legacyLevelCompatibility', 'BORDERLINE_ACCEPTABLE'],
  ];
  for (const [field, value] of cases) {
    const mismatched = { ...candidateMeta, [field]: value };
    const result = validateMetaFinalization({ ...common, candidateMeta: mismatched });
    assert.equal(result.status, 'FAIL', `${field}=${value} must fail`);
    assert.ok(result.errors.includes(`META_FINAL_DIFFICULTY_FIELD_PARITY_FAIL:${field}`), result.errors.join(','));
  }
});

test('difficulty is a separate fresh blind pass and may disagree with legacy level', () => {
  const resolution = resolveMetaRoute(makeInput(rowFor('H1-RPM-001')), { repoRoot: root });
  const evidence = makeDifficulty(resolution, 2, { comparedLegacyLevel: '상' });
  assert.equal(validateBlindDifficulty(evidence, { sourceFingerprint: resolution.sourceFingerprint, solutionHash: resolution.semanticInputBundle.solutionIdentity.solutionHash }).status, 'PASS');
  const inferred = makeDifficulty(resolution, 2, { derivedFromLegacyLevel: true });
  assert.ok(validateBlindDifficulty(inferred, { sourceFingerprint: resolution.sourceFingerprint, solutionHash: resolution.semanticInputBundle.solutionIdentity.solutionHash }).errors.includes('LEVEL_TO_DIFFICULTY_INFERENCE_FORBIDDEN'));
});

test('crosswalk binding gap cannot pass FINAL even if caller adds a selectable key', () => {
  const resolution = resolveMetaRoute(makeInput(rowFor('H1-RPM-029')), { repoRoot: root });
  const forged = { ...resolution, problemTypeKey: 'PT_H1_ROOT_COEFFICIENT_RELATION', templateKey: 'TPL_H1_VIETA_SYMMETRIC_VALUE' };
  const { evidenceSha, ...body } = forged;
  const evidence = { ...forged, evidenceSha: objectSha(body) };
  const result = validateResolverEvidence(makeInput(rowFor('H1-RPM-029')), evidence, { repoRoot: root });
  assert.equal(result.status, 'FAIL');
});

test('RPM semantic FINAL with a pending legacy projection is META_ONLY and does not block R2E release', () => {
  const input = makeInput(rowFor('H1-RPM-029'));
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  assert.equal(resolverEvidence.semanticStatus, 'FINAL');
  assert.equal(resolverEvidence.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(resolverEvidence.projectionStatus, 'PROJECTION_BINDING_PENDING');
  const difficultyEvidence = makeDifficulty(resolverEvidence);
  const candidateMeta = makeCandidate(resolverEvidence);
  assert.equal(candidateMeta.problemTypeKey, '');
  assert.equal(candidateMeta.templateKey, '');
  const semanticMetaEvidence = makeRelational(resolverEvidence);
  const preflight = validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta,
    semanticMetaEvidence, requireValidatorReceipt: false, repoRoot: root });
  assert.equal(preflight.status, 'PASS', JSON.stringify(preflight.errors));
  const validatorReceipt = makeMetaValidatorReceipt(resolverEvidence, preflight);
  const item = {
    questionUid: input.sourceIdentity.questionUid, input, resolverEvidence, disposition: resolverEvidence.disposition, difficultyEvidence, candidateMeta,
    semanticMetaEvidence, validatorReceipt, r2eFinalDisposition: 'META_ONLY_COMPATIBILITY_PENDING',
  };
  const receipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    rpmSemanticHoldCount: 0, projectionPendingCount: 1,
    unresolvedSemanticCount: 1, unresolvedProposalCount: 1, unresolvedCrossConceptCandidateCount: 1,
    metaHoldCount: 1, migrationGapCount: 1, runtimeParityFailureCount: 1, items: [item],
  });
  assert.equal(validateR2EReceipt(receipt, { repoRoot: root }).status, 'PASS', JSON.stringify(validateR2EReceipt(receipt, { repoRoot: root }).errors));
});
test('same resolver decision closes through R2E and an exact runtime projection', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  const difficultyEvidence = makeDifficulty(resolverEvidence);
  const candidateMeta = makeCandidate(resolverEvidence);
  const semanticMetaEvidence = makeRelational(resolverEvidence);
  const preflight = validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence, requireValidatorReceipt: false, repoRoot: root });
  assert.equal(preflight.status, 'PASS', JSON.stringify(preflight.errors));
  const validatorReceipt = makeMetaValidatorReceipt(resolverEvidence, preflight);
  const runtimeRecord = {
    questionUid: input.sourceIdentity.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidenceSha: resolverEvidence.evidenceSha, difficultyEvidenceSha: difficultyEvidence.evidenceSha,
    ...Object.fromEntries(['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'].map(key => [key, candidateMeta[key]])),
  };
  const item = {
    questionUid: input.sourceIdentity.questionUid, input, resolverEvidence, disposition: resolverEvidence.disposition, difficultyEvidence, candidateMeta, semanticMetaEvidence,
    validatorReceipt, r2eFinalDisposition: 'EXISTING_REUSE', runtimeRecord,
  };
  const receipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0, metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
    items: [item],
  });
  assert.equal(validateR2EReceipt(receipt, { repoRoot: root }).status, 'PASS', JSON.stringify(validateR2EReceipt(receipt, { repoRoot: root }).errors));
  const compatibilityPendingReceipt = sealR2EMetaReceipt({ ...receipt, receiptSha: undefined, migrationGapCount: 1, projectionPendingCount: 1 });
  assert.equal(validateR2EReceipt(compatibilityPendingReceipt, { repoRoot: root }).status, 'FAIL', 'declared compatibility gap count must match per-item projections');
  assert.equal(validateRuntimeMetaParity({ questionUid: item.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord }).status, 'PASS');
  assert.equal(validateRuntimeMetaParity({ questionUid: item.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord: { ...runtimeRecord, templateKey: 'TPL_WRONG' } }).status, 'FAIL');
});

test('v2 intake keeps frozen JS projection separate and requires exact projection at R2E final', () => {
  const row = rowFor('H1-RPM-001');
  const sourceArchiveFile = 'original/high/h1/1final/fixture-v2.js';
  const questionUid = questionUidForSource(sourceArchiveFile, 1);
  const input = makeInput(row);
  input.sourceIdentity.sourceArchiveFile = sourceArchiveFile;
  input.sourceIdentity.questionUid = questionUid;
  input.sourceIdentity.imageRefHash = objectSha({ image: '', visualAsset: '', fullPageImagePath: '', fullPageImageRelPath: '', sourceEvidencePath: '', sourcePageEvidencePaths: [] });
  const sourceQuestion = {
    id: 1, sourceIdentityKey: input.sourceIdentity.sourceIdentityKey,
    content: 'source content', choices: ['①', '②'], image: '', solution: 'verified student solution',
    curriculum: row.curriculum, standardCourse: row.standardCourse,
    standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '',
  };
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  const difficultyEvidence = makeDifficulty(resolverEvidence);
  const candidateMeta = makeCandidate(resolverEvidence);
  const semanticMetaEvidence = makeRelational(resolverEvidence);
  const sourceMetaProjection = makeR2ESourceMetaProjection(sourceQuestion);
  const resolverValidation = validateResolverEvidence(input, resolverEvidence, { repoRoot: root });
  const intakeItem = {
    questionUid, sourceOrdinal: 1, disposition: resolverEvidence.disposition, input, resolverEvidence,
    difficultyEvidence, candidateMeta, semanticMetaEvidence, sourceMetaProjection,
    sourceMetaProjectionSha: objectSha(sourceMetaProjection),
    validatorReceipt: makeMetaValidatorReceipt(resolverEvidence, resolverValidation),
  };
  const intakeReceipt = { schemaVersion: R2E_META_INPUT_SCHEMA_V2, items: [intakeItem] };
  const intakeCheck = validateR2EIntakeMetaReceipt(intakeReceipt, {
    sourceArchiveFile, sourceQuestions: [sourceQuestion], repoRoot: root,
  });
  assert.equal(intakeCheck.status, 'PASS', JSON.stringify(intakeCheck.errors));
  assert.equal(sourceQuestion.difficultyBucket, undefined);
  assert.equal(candidateMeta.difficultyBucket, difficultyEvidence.difficultyBucket);

  const finalQuestion = { ...sourceQuestion, ...candidateMeta };
  const finalPreflight = validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta,
    semanticMetaEvidence, requireValidatorReceipt: false, repoRoot: root });
  assert.equal(finalPreflight.status, 'PASS', JSON.stringify(finalPreflight.errors));
  const finalValidatorReceipt = makeMetaValidatorReceipt(resolverEvidence, finalPreflight);
  const runtimeRecord = {
    questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidenceSha: resolverEvidence.evidenceSha, difficultyEvidenceSha: difficultyEvidence.evidenceSha,
    ...Object.fromEntries(['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'].map(key => [key, candidateMeta[key]])),
  };
  const finalReceipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0,
    metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
    items: [{ ...intakeItem, validatorReceipt: finalValidatorReceipt, r2eFinalDisposition: 'EXISTING_REUSE', runtimeRecord }],
  });
  assert.equal(validateR2EReceipt(finalReceipt, { repoRoot: root, sourceArchiveFile, sourceQuestions: [finalQuestion] }).status, 'PASS');
  const notMaterialized = validateR2EReceipt(finalReceipt, { repoRoot: root, sourceArchiveFile, sourceQuestions: [sourceQuestion] });
  assert.equal(notMaterialized.status, 'FAIL');
  assert.ok(notMaterialized.errors.some(error => error.includes('R2E_META_INPUT_CANDIDATE_JS_PARITY_FAIL') && error.includes('difficultyBucket')));

  const tampered = structuredClone(intakeReceipt);
  tampered.items[0].sourceMetaProjection.difficultyBucket = 4;
  tampered.items[0].sourceMetaProjectionSha = objectSha(tampered.items[0].sourceMetaProjection);
  const badSourceProjection = validateR2EIntakeMetaReceipt(tampered, { sourceArchiveFile, sourceQuestions: [sourceQuestion], repoRoot: root });
  assert.equal(badSourceProjection.status, 'FAIL');
  assert.ok(badSourceProjection.errors.includes(`R2E_META_INPUT_SOURCE_JS_PROJECTION_PARITY_FAIL:${questionUid}`));
});
