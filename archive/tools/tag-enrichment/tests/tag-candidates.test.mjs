import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCandidate } from '../scripts/build-tag-candidates.mjs';

const master = { subUnits: [{ standardUnitKey: 'H15-SA-01', subUnitKey: 'H15-SA-01-POLYNOMIAL_BASIC', subUnit: '다항식의 기본' }] };
const file = { sourceFile: 'fixture.js', examTitle: 'fixture' };

test('tag-enrichment emits only a non-authoritative subunit hint and never infers difficulty from level', () => {
  const base = {
    questionId: 1, originalIndex: 0, standardCourse: '수학(상)', standardUnitKey: 'H15-SA-01', standardUnit: '다항식',
    level: '상', questionType: '객관식', layoutTag: 'normal', tags: [], content: '다항식을 계산한다.', choices: ['①'],
    hasContent: true, hasSolution: true, hasAnswer: true, hasImage: false, image: '', wide: false,
  };
  const high = buildCandidate(base, file, master);
  const low = buildCandidate({ ...base, level: '하' }, file, master);
  assert.equal(high.subUnitKeyCandidate, 'H15-SA-01-POLYNOMIAL_BASIC');
  assert.equal(high.advancedMetaAuthority, 'RPM_ACTIVE_RESOLVER_ONLY');
  assert.equal(high.advancedMetaDisposition, 'NOT_CLASSIFIED');
  for (const field of ['conceptClusterKeyCandidate', 'problemTypeKeyCandidate', 'templateKeyCandidate', 'difficultyBucketCandidate']) {
    assert.equal(Object.hasOwn(high, field), false);
  }
  assert.equal(Object.hasOwn(high, 'difficultyBucket'), false);
  assert.equal(high.tagStatus, low.tagStatus);
  assert.equal(high.tagConfidence, low.tagConfidence);
});
