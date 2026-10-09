'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const meta = require('../archive/problem-bank-meta.js');
const recipes = require('../archive/problem-bank-assessment-recipes.js');
const source = require('../archive/archive2-source.js');

test('Compose and shared recipes use one Meta query with manual and verified profiles', () => {
  const original = meta.projectOriginal({
    questionUid: 'qid_v1_original', sourceFile: 'original/high/h1/1final/sample.js',
    L1: 'H1', L2: 'H1-06', L3: '방정식', L4: '인수분해형', difficultyBucket: 3, variantGroupKey: 'family-1',
  });
  const generated = meta.projectGenerated({
    uid: 'ALITE-SAMPLE-01', sourceKind: 'generated', l2: 'H22-C-06-HIGHER_EQUATION',
    consumerSelectable: true, approval: 'REVIEW_APPROVED', reviewStatus: 'REVIEW_PASS',
    rpmL1: 'H1', rpmL2: 'H1-06', rpmL3: '방정식', rpmL4: '인수분해형', difficultyBucket: 3,
    secondaryConceptKeys: [], crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    problemTypeKey: 'PT_SAMPLE', templateKey: 'TPL_SAMPLE',
    variantGroupKey: 'family-1',
    metaFinalSha256: 'a'.repeat(64), sourceShardGitSha: 'b'.repeat(40), metaReviewEvidenceSha256: 'c'.repeat(64),
    metaVerification: { status: 'VERIFIED_CURRENT_SOURCE', sourceBound: true, reviewBytesBound: true,
      metaFinalSha256: 'a'.repeat(64), sourceShardGitSha: 'b'.repeat(40), reviewEvidenceSha256: 'c'.repeat(64) },
  });
  const index = meta.buildIndex([original], [generated]);
  const direct = meta.query(index, { rpmL3: '방정식', difficultyBuckets: [3] }, { profile: 'DIRECT' });
  assert.deepEqual(direct.map(row => row.uid), ['qid_v1_original', 'ALITE-SAMPLE-01']);
  assert.deepEqual(meta.query(index, { rpmL3: '방정식' }, { profile: 'VERIFIED' }).map(row => row.uid), ['ALITE-SAMPLE-01']);
  for (const patch of [
    { metaFinalSha256: 'd'.repeat(64) },
    { sourceShardGitSha: 'e'.repeat(40) },
    { metaReviewEvidenceSha256: 'f'.repeat(64) },
  ]) assert.equal(meta.projectGenerated({ ...generated, ...patch }).verifiedEligible, false);
  const expected = { FIVE_MINUTE: 4, SUBUNIT: 12, UNIT: 20, MONTHLY: 24 };
  for (const [key, count] of Object.entries(expected)) {
    const result = recipes.queryRecipe(index, key, { rpmL3: '방정식' }, { uniqueFamilies: true });
    assert.equal(result.requestedCount, count);
    assert.equal(result.profile, 'VERIFIED');
    assert.equal(result.coverage.shortage, count - 1);
    assert.equal(result.coverage.distinctKnownFamilyCount, 1);
    assert.equal(result.coverage.familyUnknownUidCount, 0);
    assert.equal(result.coverage.familyShortage, count - 1);
  }
  const familyUnknown = meta.projectOriginal({
    questionUid: 'qid_v1_family_unknown', L1: 'H1', L2: 'H1-06', L3: '방정식', L4: '인수분해형',
    difficultyBucket: 3,
  });
  const familyGap = recipes.queryRecipe([familyUnknown], 'FIVE_MINUTE', { rpmL3: '방정식' }, {
    profile: 'DIRECT', uniqueFamilies: true,
  });
  assert.equal(familyGap.coverage.distinctKnownFamilyCount, 0);
  assert.equal(familyGap.coverage.familyUnknownUidCount, 1);
  assert.equal(familyGap.coverage.familyShortage, 4);
});

test('Generated restoration binds approved UID, localOrdinal, and declared fingerprint contract', async () => {
  const consumerIndex = JSON.parse(fs.readFileSync(
    path.join(root, 'archive/data/generated-lite-consumer/v1/index.json'), 'utf8'));
  const indexRow = consumerIndex.records.find(row => row.uid === 'ALITE-BSG26-B03-Q13-R01');
  const shard = JSON.parse(fs.readFileSync(path.join(root, 'archive', indexRow.shard), 'utf8'));
  const question = await source.restoreGenerated(indexRow, shard, consumerIndex.excludedHoldUids);
  assert.equal(question.questionUid, indexRow.uid);
  assert.equal(question.localOrdinal, indexRow.localOrdinal);
  assert.equal(question.sourceKind, 'generated');
  assert.equal(question.sourceFingerprint, indexRow.contentFingerprint);
  assert.equal(question.contentFingerprintAlgorithm, 'FNV1A64_UTF16_STUDENT_FIELDS_V1');
  assert.equal(question.contentFingerprintStatus, 'CONFIRMED');
  assert.equal(question.metaProjection.storageBucketKey, indexRow.l2);
  assert.equal(question.content, shard.records.find(row => row.generatedUid === indexRow.uid).question.content);

  await assert.rejects(() => source.restoreGenerated(indexRow, {
    ...shard, records: [...shard.records, shard.records.find(row => row.generatedUid === indexRow.uid)],
  }, consumerIndex.excludedHoldUids), /GENERATED_UID_ORDINAL_NOT_UNIQUE/);
  await assert.rejects(() => source.restoreGenerated(indexRow, shard, [indexRow.uid]), /GENERATED_QUESTION_NOT_SELECTABLE/);

  const legacyIndex = {
    uid: 'ALITE-LEGACY-01', localOrdinal: 4, sourceKind: 'generated', consumerSelectable: true,
    approval: 'REVIEW_APPROVED', reviewStatus: 'REVIEW_PASS', l2: 'storage-bucket',
  };
  const legacyShard = { schemaVersion: 'ALIVE_GENERATED_CONSUMER_SHARD_V1', records: [{
    generatedUid: legacyIndex.uid, localOrdinal: 4, sourceKind: 'generated',
    question: { content: 'legacy', choices: ['1', '2', '3', '4', '5'], answer: '①', solution: 'solution' },
  }] };
  const legacyQuestion = await source.restoreGenerated(legacyIndex, legacyShard);
  assert.equal(legacyQuestion.questionUid, legacyIndex.uid);
  assert.equal(legacyQuestion.contentFingerprintStatus, 'UNKNOWN');
  assert.equal(legacyQuestion.contentFingerprintAlgorithm, 'UNKNOWN_MISSING');
  assert.equal(legacyQuestion.sourceFingerprint, null);

  legacyIndex.contentFingerprint = 'sha3:historical-unknown';
  legacyShard.records[0].contentFingerprint = legacyIndex.contentFingerprint;
  const unknownAlgorithmQuestion = await source.restoreGenerated(legacyIndex, legacyShard);
  assert.equal(unknownAlgorithmQuestion.contentFingerprintStatus, 'UNKNOWN');
  assert.equal(unknownAlgorithmQuestion.contentFingerprintAlgorithm, 'UNKNOWN_UNSUPPORTED');
});

test('historical B07 SHA-256 student payload validates only under its exact producer contract', async () => {
  const consumerIndex = JSON.parse(fs.readFileSync(
    path.join(root, 'archive/data/generated-lite-consumer/v1/index.json'), 'utf8'));
  const holds = consumerIndex.excludedHoldUids;
  for (const uid of [
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP02',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP02',
  ]) {
    const indexRow = consumerIndex.records.find(row => row.uid === uid);
    const shard = JSON.parse(fs.readFileSync(path.join(root, 'archive', indexRow.shard), 'utf8'));
    const question = await source.restoreGenerated(indexRow, shard, holds);
    assert.equal(question.contentFingerprintAlgorithm, 'SHA256_JSON_UID_STUDENT_FIELDS_IMAGE_V1', uid);
    assert.equal(question.contentFingerprintStatus, 'CONFIRMED', uid);
  }
  const repaired = consumerIndex.records.find(row => row.uid === 'ALITE-PALMA25-H1-2MID-B07-Q01-BP01');
  assert.equal(repaired.contentFingerprint,
    'sha256:4c3959784820693e29b3bc959249721d3c52ed97bddd07c31d9080934d63a576');
});
