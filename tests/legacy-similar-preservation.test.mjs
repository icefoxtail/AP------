import test from 'node:test';
import assert from 'node:assert/strict';
import { legacySimilarPreservationPlan } from '../archive/tools/intelligence/apply-reviewed-legacy-similar-ledgers.mjs';

// Deliberately synthetic inputs: this focused unit test must not depend on
// private review fixtures, exam identifiers, fingerprints, or curriculum data.
const syntheticCase = (qid, overrides = {}) => {
  const row = {
    qid,
    rpmStatus: 'CANONICAL_PATH_REVIEWED',
    metaDebt: ['RPM_CROSSWALK_PROJECTION_PENDING'],
    holdReasons: ['SYNTHETIC_REVIEW_HOLD'],
    conditionFieldDebts: [],
    independentDifficulty1to5: 3,
    difficultyConfidence: 'medium',
    difficultyBoundaryFlag: 'NONE',
    legacyLevelCompatibility: 'NORMAL',
    ...overrides,
  };
  const prior = {
    difficultyBucket: '중',
    rpmPathStatus: 'SEMANTIC_HOLD_OR_ROUTE_OUT',
  };
  return { row, prior };
};

const cases = [
  syntheticCase(101),
  syntheticCase(103, { independentDifficulty1to5: 1 }),
  syntheticCase(106, { independentDifficulty1to5: 4 }),
  syntheticCase(110, { independentDifficulty1to5: 2 }),
  syntheticCase(122, { independentDifficulty1to5: 5, metaDebt: ['RPM_ONLY_NO_ACTIVE_PT_TPL_PROJECTION'] }),
  syntheticCase(123, { independentDifficulty1to5: 2, rpmStatus: 'HOLD_NO_EQUIVALENT_L4',
    metaDebt: ['NO_EQUIVALENT_RPM_L4'] }),
].map(({ row, prior }) => ({ row, prior }));
const byQid = new Map(cases.map(({ row, prior }) => [row.qid, { row, prior }]));
const conditionCase = syntheticCase(116, {
  conditionFieldDebts: [{ field: 'conditionKeys', status: 'EVIDENCE_DEBT', reason: 'SYNTHETIC_EVIDENCE_GAP' }],
});
byQid.set(conditionCase.row.qid, conditionCase);
const fields = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];

test('synthetic reviewed rows upgrade legacy buckets to their reviewed difficulty tuple', () => {
  for (const qid of [101, 103, 106, 110, 122, 123]) {
    const { row, prior } = byQid.get(qid);
    const plan = legacySimilarPreservationPlan(prior, row);
    assert.ok(['하', '중', '상'].includes(prior.difficultyBucket), `q${qid} starts with legacy bucket`);
    assert.deepEqual(fields.map(field => plan[field]), [row.independentDifficulty1to5, row.difficultyConfidence,
      row.difficultyBoundaryFlag, row.legacyLevelCompatibility], `q${qid} reviewed tuple`);
    assert.equal(prior.level, undefined, `q${qid} source level is outside the metadata patch`);
  }
});

test('missing numeric difficulty is not preserved as a legacy label or guessed', () => {
  const { row, prior } = byQid.get(106);
  assert.equal(prior.difficultyBucket, '중');
  assert.equal(prior.difficultyConfidence, undefined);
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.difficultyBucket, row.independentDifficulty1to5);
  assert.equal(plan.difficultyConfidence, row.difficultyConfidence);
});

test('already-populated reviewed difficulty is accepted only when all four values match', () => {
  const { row, prior } = byQid.get(106);
  const applied = { ...prior, difficultyBucket: row.independentDifficulty1to5, difficultyConfidence: row.difficultyConfidence,
    difficultyBoundaryFlag: row.difficultyBoundaryFlag, legacyLevelCompatibility: row.legacyLevelCompatibility };
  assert.deepEqual(fields.map(field => legacySimilarPreservationPlan(applied, row)[field]),
    [row.independentDifficulty1to5, row.difficultyConfidence, row.difficultyBoundaryFlag, row.legacyLevelCompatibility]);
  assert.throws(() => legacySimilarPreservationPlan({ ...applied, difficultyBoundaryFlag: 'B12' }, row), /existing reviewed difficulty differs/);
});

test('legacy bucket-only ledger preserves existing ancillary difficulty fields', () => {
  const { row } = syntheticCase(201, { independentDifficulty1to5: 4 });
  delete row.difficultyConfidence;
  delete row.difficultyBoundaryFlag;
  delete row.legacyLevelCompatibility;
  const prior = { difficultyBucket: 4, difficultyConfidence: 'medium',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.difficultyBucket, 4);
  assert.equal(plan.difficultyConfidence, 'medium');
  assert.equal(plan.difficultyBoundaryFlag, 'NONE');
  assert.equal(plan.legacyLevelCompatibility, 'NORMAL');
});

test('legacy bucket-only ledger does not invent missing ancillary difficulty fields', () => {
  const { row } = syntheticCase(202, { independentDifficulty1to5: 3 });
  delete row.difficultyConfidence;
  delete row.difficultyBoundaryFlag;
  delete row.legacyLevelCompatibility;
  const prior = { difficultyBucket: '중' };
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.difficultyBucket, 3);
  assert.equal(Object.hasOwn(plan, 'difficultyConfidence'), false);
  assert.equal(Object.hasOwn(plan, 'difficultyBoundaryFlag'), false);
  assert.equal(Object.hasOwn(plan, 'legacyLevelCompatibility'), false);
});

test('bucket-only ledger still fails closed on an actual existing numeric difficulty conflict', () => {
  const { row } = syntheticCase(203, { independentDifficulty1to5: 2 });
  delete row.difficultyConfidence;
  delete row.difficultyBoundaryFlag;
  delete row.legacyLevelCompatibility;
  assert.throws(() => legacySimilarPreservationPlan({ difficultyBucket: 4 }, row), /existing reviewed difficulty differs/);
});

test('synthetic crosswalk proposal stays unconfirmed and debt is marker-only', () => {
  const { row, prior } = byQid.get(106);
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.rpmConfirmed, false);
  assert.equal(plan.rpmPathStatus, 'SEMANTIC_HOLD_OR_ROUTE_OUT');
  assert.equal(plan.rpmSemanticStatus, 'HOLD');
  assert.equal(plan.rpmSemanticReason, row.holdReasons.join('; '));
  assert.deepEqual(plan.rpmDebt, ['RPM_CROSSWALK_PROJECTION_PENDING']);
});

test('synthetic condition debt stays separate from RPM debt', () => {
  const { row, prior } = byQid.get(116);
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.rpmConfirmed, false);
  assert.equal(plan.rpmPathStatus, 'SEMANTIC_HOLD_OR_ROUTE_OUT');
  assert.equal(plan.rpmSemanticStatus, 'HOLD');
  assert.equal(plan.rpmSemanticReason, row.holdReasons.join('; '));
  assert.deepEqual(plan.rpmDebt, ['RPM_CROSSWALK_PROJECTION_PENDING']);
  assert.deepEqual(plan.conditionDebt, row.conditionFieldDebts);
  assert.equal(plan.conditionKeysEvidenceDebt.field, 'conditionKeys');
  assert.equal(plan.conditionKeysEvidenceDebt.status, 'EVIDENCE_DEBT');
  assert.equal(typeof plan.conditionKeysEvidenceDebt.reason, 'string');
});

test('synthetic RPM-only path corrects stale affirmative status to documented hold', () => {
  const { row, prior } = byQid.get(122);
  const plan = legacySimilarPreservationPlan({ ...prior, rpmPathStatus: 'CONFIRMED', rpmSemanticStatus: 'CONFIRMED' }, row);
  assert.equal(plan.rpmConfirmed, false);
  assert.equal(plan.rpmPathStatus, 'SEMANTIC_HOLD_OR_ROUTE_OUT');
  assert.equal(plan.rpmSemanticStatus, 'HOLD');
  assert.equal(plan.rpmSemanticReason, row.holdReasons.join('; '));
  assert.deepEqual(plan.rpmDebt, ['RPM_ONLY_NO_ACTIVE_PT_TPL_PROJECTION']);
});

test('no-equivalent-L4 row uses the existing supported hold status', () => {
  const { row, prior } = byQid.get(123);
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.rpmConfirmed, false);
  assert.equal(plan.rpmPathStatus, 'HOLD_NO_EQUIVALENT_PATH');
  assert.equal(plan.rpmSemanticStatus, 'HOLD');
  assert.equal(plan.rpmSemanticReason, row.holdReasons.join('; '));
  assert.ok(plan.rpmDebt.includes('NO_EQUIVALENT_RPM_L4'));
});

test('legacy no-equivalent-L4 evidence supplies its exact hold reason without new ledger fields', () => {
  const { row, prior } = syntheticCase(204, { rpmStatus: 'HOLD_NO_EQUIVALENT_L4',
    metaDebt: ['NO_EQUIVALENT_RPM_L4'] });
  delete row.holdReasons;
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.rpmPathStatus, 'HOLD_NO_EQUIVALENT_PATH');
  assert.equal(plan.rpmSemanticStatus, 'HOLD');
  assert.equal(plan.rpmSemanticReason, 'NO_EQUIVALENT_RPM_L4');
});

test('legacy RPM hold without its specific debt remains fail-closed', () => {
  const { row, prior } = syntheticCase(205, { rpmStatus: 'HOLD_NO_EQUIVALENT_L4',
    metaDebt: ['NO_VERIFIED_PT_TPL_BINDING'] });
  delete row.holdReasons;
  assert.throws(() => legacySimilarPreservationPlan(prior, row), /reviewed RPM hold reason missing/);
});

test('exact reviewed RPM row confirms while preserving an existing path classification', () => {
  const row = { qid: 1, rpmStatus: 'CANONICAL_PATH_REVIEWED', metaDebt: [], independentDifficulty1to5: 1,
    difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
  const prior = { difficultyBucket: 1, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
  const plan = legacySimilarPreservationPlan(prior, row);
  assert.equal(plan.rpmConfirmed, true);
  assert.equal(plan.rpmPathStatus, 'CONFIRMED');
  assert.equal(plan.rpmSemanticStatus, 'FINAL');
  assert.equal(plan.rpmSemanticReason, '');
  assert.equal(legacySimilarPreservationPlan({ ...prior, rpmPathStatus: 'DIRECT' }, row).rpmPathStatus, 'DIRECT');
});
