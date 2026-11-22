// 진단평가 시험지는 단원별 기출과 같은 단계 구역 제목('1단계' …)을 meta.sections로 싣는다(2026-11-22 사용자 결정).
// 새 꼬리표·새 플래그 없이 unit-past-exams-core의 buildStepSections를 그대로 부르고, 다른 빠른 평가 상품은 그대로다.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readWorkspace } = require('./helpers/archive2-workspace-source.cjs');
const UnitCore = require('../archive/unit-past-exams-core.js');
const Quick = require('../archive/archive2-quick-pools.js');

test('진단평가 시험지: 단계순 문항 위에 실제 단계 제목(4단계·5단계 따로)이 붙는다', () => {
  const rec = (n, bucket) => ({ questionUid: `uid-${n}`, difficultyBucket: bucket });
  const units = [{ order: 1, orderInUnit: 0, buckets: { 1: [], 2: [], 3: [], 4: [], 5: [] }, fillBuckets: {} }];
  const selected = [rec(1, 5), rec(2, 3), rec(3, 1), rec(4, 4), rec(5, 1), rec(6, 2)];
  for (const r of selected) units[0].buckets[r.difficultyBucket].push(r);
  const ordered = Quick.orderByStep(units, selected);
  const sections = UnitCore.buildStepSections(ordered);
  assert.deepEqual(sections.map(s => [s.at, s.title, s.level]), [[0, '1단계', 1], [2, '2단계', 1], [3, '3단계', 1], [4, '4단계', 1], [5, '5단계', 1]]);
  assert.ok(sections.every(s => s.uid === ordered[s.at].questionUid));
});

test('진단평가에만 구역 제목을 싣고, 다른 빠른 평가 상품·core 함수 사본은 없다', () => {
  const source = readWorkspace();
  const lines = source.split('\n').filter(line => line.includes('buildStepSections'));
  assert.equal(lines.length, 1, '호출 한 곳');
  assert.match(lines[0], /diagnostic && .*UnitPastExamsCore.*buildStepSections\(chosen\)/);
  assert.doesNotMatch(source, /function\s+(buildStepSections|stepTokenLabel)/, 'core 함수를 다시 만들지 않는다');
  assert.doesNotMatch(source, /showDifficultyStage|difficultyStageTag/, '새 표시 플래그 없음');
});
