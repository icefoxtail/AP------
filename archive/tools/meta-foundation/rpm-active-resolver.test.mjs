import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import {
  buildDecisionIsolatedInput,
  buildResolverDecisionEvidence,
  makeDifficultyEvidence,
  makeMetaValidatorReceipt,
  resolveMetaRoute,
  sealR2EMetaReceipt,
  validateBlindDifficulty,
  validateMetaFinalization,
  validateR2EReceipt,
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
  assert.equal(result.disposition, 'EXISTING_REUSE');
  assert.equal(result.crosswalkFile, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json');
  assert.equal(result.crosswalkRecordId, 'H1-RPM-001');
  assert.equal(result.ownerPack, 'H1_FOUNDATION');
  assert.match(result.bindingIdentity, /^2015\|H15-SA-01\|H15-SA-01-POLYNOMIAL_BASIC\|/);
  assert.ok(result.authorityRefs.findIndex(ref => ref.path.endsWith('CANONICAL_MASTER.json')) < result.authorityRefs.findIndex(ref => ref.path.includes('/crosswalks/')));
  assert.ok(result.authorityRefs.some(ref => ref.role === 'ACTIVE_META_FOUNDATION'));
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
  assert.equal(result.disposition, 'FAMILY_REUSE');
  assert.equal(result.templateKey, row.templateCandidates[0].templateKey);
  assert.equal(validateResolverEvidence(input, result, { repoRoot: root }).status, 'PASS');
});

test('FAMILY_ACTIVE remains unclosed without post-crosswalk template selection', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-010')), { repoRoot: root });
  assert.equal(result.disposition, 'FAMILY_REUSE');
  assert.equal(result.advancedMetaEligible, false);
  assert.equal(result.dispositionReason, 'FAMILY_TEMPLATE_SELECTION_REQUIRED');
  assert.equal(result.problemTypeKey, '');
  assert.equal(result.templateKey, '');
});

test('RPM path with missing exact binding is a migration gap and emits no key', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-029')), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_PRIMARY_MIGRATION_GAP');
  assert.equal(result.problemTypeKey, '');
  assert.equal(result.templateKey, '');
});

test('RPM path without ACTIVE materialization is a migration gap and emits no key', () => {
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-009')), { repoRoot: root });
  assert.equal(result.disposition, 'RPM_PRIMARY_MIGRATION_GAP');
  assert.equal(result.problemTypeKey, '');
});

test('no RPM path and a completed empty targeted ACTIVE search is a true taxonomy gap', () => {
  const row = rowFor('H1-RPM-001');
  const input = makeInput(row);
  input.semanticDecision.rpmPath = { curriculum: row.curriculum, scope: row.scope, majorUnit: '검증용 단원', midUnit: '검증용 중단원', l3: '없는 유형', l4: '없는 풀이 구조' };
  input.activeSearchEvidence = {
    status: 'COMPLETED_NO_MATCH', searchedGlobalActive: true, candidateKeys: [], registrySha: registry.registrySha,
    searchMethod: 'GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2',
    searchedScope: { curriculum: '2015', standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey },
  };
  const result = resolveMetaRoute(input, { repoRoot: root, registry });
  assert.equal(result.disposition, 'TRUE_TAXONOMY_GAP');
  assert.equal(result.problemTypeKey, '');
});

test('candidate leakage in the first semantic decision is rejected', () => {
  const input = makeInput(rowFor('H1-RPM-001'));
  input.semanticDecision.templateKey = 'TPL_H1_POLY_OPERATION_DIRECT';
  assert.throws(() => resolveMetaRoute(input, { repoRoot: root }), /FORBIDDEN_CANDIDATE_INPUT/);
});

test('invalid ACTIVE template parent prevents reuse', () => {
  const badRegistry = { ...registry, templates: new Map(registry.templates) };
  const template = badRegistry.templates.get('TPL_H1_POLY_OPERATION_DIRECT');
  badRegistry.templates.set(template.templateKey, { ...template, parentProblemTypeKey: 'PT_WRONG_PARENT' });
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-001')), { repoRoot: root, registry: badRegistry });
  assert.equal(result.disposition, 'RPM_PRIMARY_MIGRATION_GAP');
  assert.equal(result.dispositionReason, 'ACTIVE_TEMPLATE_PARENT_OR_OWNER_MISMATCH');
});

test('missing exact curriculum binding prevents direct reuse', () => {
  const binding = registry.bindingRows.find(row => row.problemTypeKey === 'PT_H1_POLY_OPERATION_EXPANSION'
    && row.curriculum === '2015' && row.standardUnitKey === 'H15-SA-01' && row.subUnitKey === 'H15-SA-01-POLYNOMIAL_BASIC');
  assert.ok(binding, 'fixture requires the direct ACTIVE binding');
  const badRegistry = { ...registry, bindingRows: registry.bindingRows.filter(row => row !== binding) };
  const result = resolveMetaRoute(makeInput(rowFor('H1-RPM-001')), { repoRoot: root, registry: badRegistry });
  assert.equal(result.disposition, 'RPM_PRIMARY_MIGRATION_GAP');
  assert.equal(result.dispositionReason, 'EXACT_ACTIVE_BINDING_NOT_MATERIALIZED');
  assert.equal(result.problemTypeKey, '');
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
    questionUid: input.sourceIdentity.questionUid, input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence,
    validatorReceipt, r2eFinalDisposition: 'EXISTING_REUSE', runtimeRecord,
  };
  const receipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0, metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
    items: [item],
  });
  assert.equal(validateR2EReceipt(receipt, { repoRoot: root }).status, 'PASS');
  const unresolvedReceipt = sealR2EMetaReceipt({ ...receipt, receiptSha: undefined, migrationGapCount: 1 });
  assert.equal(validateR2EReceipt(unresolvedReceipt, { repoRoot: root }).status, 'FAIL');
  assert.equal(validateRuntimeMetaParity({ questionUid: item.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord }).status, 'PASS');
  assert.equal(validateRuntimeMetaParity({ questionUid: item.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord: { ...runtimeRecord, templateKey: 'TPL_WRONG' } }).status, 'FAIL');
});
