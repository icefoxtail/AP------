// 학교 모의고사 자동 선정(archive/school-mock-selection.js): 화면 없는 순수 함수의 성질을 본다.
// 운영 데이터의 정확한 개수는 고정하지 않고 결함 조건(중복·짝·자기 문항·결정성·못 채움 표시)만 검사한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../archive/school-mock-selection.js');

let counter = 0;
function rec(file, ordinal, pt, tpl, d, extra = {}) {
  counter += 1;
  return { questionUid: `uid-${counter}`, sourceFile: file, sourceOrdinal: ordinal, year: 2024, difficultyBucket: d,
    problemTypeKey: pt, templateKey: tpl, legacyStandardUnitKey: 'U1', ...extra };
}
const BASE_FILE = 'original/high/h1/1mid/26_순천고_1학기_중간_고1_수학.js';
function baseExam(n = 8) {
  return Array.from({ length: n }, (_, i) => rec(BASE_FILE, i + 1, `PT_${i % 4}`, `TPL_${i % 4}_${i % 2}`, (i % 4) + 1, { year: 2026 }));
}
function pool(count = 120) {
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    const file = `original/high/h1/1mid/${20 + (i % 6)}_학교${i % 9}_1학기_중간_고1_수학.js`;
    rows.push(rec(file, (i % 30) + 1, `PT_${i % 4}`, `TPL_${i % 4}_${i % 2}`, (i % 5) + 1, { year: 2018 + (i % 9) }));
  }
  return rows;
}

test('모드마다 기준 시험지와 같은 문항 수를 채우고 중복·자기 문항·짝이 없다', () => {
  const base = baseExam(), candidates = pool();
  // 기준 시험지의 자기 문항·그 시험지의 유사본은 후보에 섞여 들어와도 빠져야 한다.
  const own = base.map(r => ({ ...r, questionUid: `dup-${r.questionUid}` }));
  const similar = base.map(r => rec('similar/high/h1/1mid/26_순천고_1학기_중간_고1_수학_유사.js', r.sourceOrdinal, r.problemTypeKey, r.templateKey, r.difficultyBucket));
  for (const mode of S.MODES) {
    const result = S.selectSchoolMock({ base, candidates: [...candidates, ...base, ...own, ...similar], mode, seed: 'a' });
    assert.equal(result.picks.length, base.length);
    const picked = S.pickedRecords(result);
    assert.equal(picked.length, base.length, mode);
    assert.equal(new Set(picked.map(r => r.questionUid)).size, picked.length, `${mode}: 같은 문항 중복`);
    assert.equal(new Set(picked.map(S.pairKeyOf)).size, picked.length, `${mode}: 원본-유사 짝 동시 포함`);
    for (const r of picked) {
      assert.ok(!base.some(b => b.questionUid === r.questionUid), `${mode}: 기준 시험지 자기 문항`);
      assert.notEqual(S.stemOf(r), S.stemOf(base[0]), `${mode}: 기준 시험지의 유사·유형 문항`);
    }
  }
});

test('같은 seed면 같은 결과, 다른 seed면 달라질 수 있다', () => {
  const base = baseExam(), candidates = pool();
  const a = S.selectSchoolMock({ base, candidates, mode: 'applied', seed: 'x' });
  const b = S.selectSchoolMock({ base, candidates, mode: 'applied', seed: 'x' });
  assert.deepEqual(a.picks.map(p => p.pickUid), b.picks.map(p => p.pickUid));
  assert.deepEqual(a.picks.map(p => p.targetDifficulty), b.picks.map(p => p.targetDifficulty));
  const others = ['y', 'z', 'w', 'v'].map(seed => S.selectSchoolMock({ base, candidates, mode: 'applied', seed }).picks.map(p => p.pickUid).join());
  assert.ok(others.some(value => value !== a.picks.map(p => p.pickUid).join()), '다른 seed에서도 전혀 달라지지 않음');
});

test('목표 난이도: 기본 = 같게, 심화 = 한 단계 어렵게(5단계는 그대로), 응용 = 둘을 섞음', () => {
  const base = [1, 2, 3, 4, 5, 3, 2, 4].map((d, i) => rec(BASE_FILE, i + 1, 'PT_A', 'TPL_A', d, { year: 2026 }));
  const candidates = [1, 2, 3, 4, 5].flatMap(d => Array.from({ length: 12 }, (_, i) => rec(`original/high/h1/1mid/2${d}_학교${i}_1학기_중간_고1_수학.js`, i + 1, 'PT_A', 'TPL_A', d)));
  const basic = S.selectSchoolMock({ base, candidates, mode: 'basic', seed: 's' });
  assert.deepEqual(basic.picks.map(p => p.targetDifficulty), base.map(r => r.difficultyBucket));
  assert.ok(basic.picks.every(p => p.pickDifficulty === p.baseDifficulty && p.level === 'tpl'));
  const advanced = S.selectSchoolMock({ base, candidates, mode: 'advanced', seed: 's' });
  assert.deepEqual(advanced.picks.map(p => p.targetDifficulty), base.map(r => Math.min(r.difficultyBucket + 1, 5)));
  assert.ok(advanced.picks.every(p => p.pickDifficulty === p.targetDifficulty));
  const applied = S.selectSchoolMock({ base, candidates, mode: 'applied', seed: 's' });
  const deltas = applied.picks.map(p => p.targetDifficulty - p.baseDifficulty);
  assert.ok(deltas.every(delta => delta === 0 || delta === 1));
  assert.ok(deltas.some(delta => delta === 1) && deltas.some(delta => delta === 0), '응용은 같은 것과 어려운 것을 섞어야 한다');
  assert.ok(applied.picks.filter(p => p.baseDifficulty === 5).every(p => p.targetDifficulty === 5));
});

test('후보가 없으면 TPL -> PT -> 같은 단원으로 넓히고, 그래도 없으면 못 채움으로 표시한다', () => {
  const base = [
    rec(BASE_FILE, 1, 'PT_A', 'TPL_A', 2, { year: 2026 }),
    rec(BASE_FILE, 2, 'PT_B', 'TPL_B', 2, { year: 2026 }),
    rec(BASE_FILE, 3, 'PT_C', 'TPL_C', 2, { year: 2026, legacyStandardUnitKey: 'U1' }),
    rec(BASE_FILE, 4, 'PT_D', 'TPL_D', 2, { year: 2026, legacyStandardUnitKey: 'LONELY' }),
  ];
  const file = i => `original/high/h1/1mid/2${i}_학교${i}_1학기_중간_고1_수학.js`;
  const candidates = [
    rec(file(1), 1, 'PT_A', 'TPL_A', 2),            // TPL 일치
    rec(file(2), 1, 'PT_B', 'TPL_OTHER', 2),        // PT 일치(TPL 다름)
    rec(file(3), 1, 'PT_X', 'TPL_X', 2, { legacyStandardUnitKey: 'U1' }), // 같은 단원만 일치
  ];
  const result = S.selectSchoolMock({ base, candidates, mode: 'basic', seed: 'f' });
  assert.deepEqual(result.picks.map(p => p.level), ['tpl', 'pt', 'unit', 'none']);
  assert.equal(result.picks[3].pick, null);
  assert.deepEqual(result.summary.unfilledSlots, [4]);
  assert.deepEqual(result.summary.widenedSlots, [3]);
  assert.equal(result.summary.sameType, 2);
  assert.match(result.summary.text, /4문항 중 2문항 같은 유형/);
  assert.match(result.summary.text, /1문항 못 채움/);
  assert.equal(S.pickedRecords(result).length, 3);
});

test('같은 난이도가 없으면 한 단계 차이로 넓히고 난이도 불일치를 표시한다', () => {
  const base = [rec(BASE_FILE, 1, 'PT_A', 'TPL_A', 2, { year: 2026 })];
  const candidates = [rec('original/high/h1/1mid/23_학교_1학기_중간_고1_수학.js', 1, 'PT_A', 'TPL_A', 3)];
  const result = S.selectSchoolMock({ base, candidates, mode: 'basic', seed: 'n' });
  assert.equal(result.picks[0].level, 'tpl');
  assert.equal(result.picks[0].pickDifficulty, 3);
  assert.equal(result.picks[0].difficultyMatch, false);
  assert.equal(result.summary.differenceCount, 1);
});

test('같은 조건이면 최신 연도를 고르고, 원본 기출을 유사·유형보다 먼저 고른다', () => {
  const base = [rec(BASE_FILE, 1, 'PT_A', 'TPL_A', 2, { year: 2026 })];
  const old = rec('original/high/h1/1mid/16_학교1_1학기_중간_고1_수학.js', 1, 'PT_A', 'TPL_A', 2, { year: 2016 });
  const recent = rec('original/high/h1/1mid/25_학교2_1학기_중간_고1_수학.js', 1, 'PT_A', 'TPL_A', 2, { year: 2025 });
  const sim = rec('similar/high/h1/1mid/26_학교3_1학기_중간_고1_수학_유사.js', 1, 'PT_A', 'TPL_A', 2, { year: 2026 });
  for (const seed of ['1', '2', '3']) {
    const result = S.selectSchoolMock({ base, candidates: [old, sim, recent], mode: 'basic', seed });
    assert.equal(result.picks[0].pickUid, recent.questionUid);
  }
});

test('원본과 그 유사본(같은 stem+번호)은 한 벌에 함께 들어가지 않는다', () => {
  const base = [rec(BASE_FILE, 1, 'PT_A', 'TPL_A', 2, { year: 2026 }), rec(BASE_FILE, 2, 'PT_A', 'TPL_A', 2, { year: 2026 })];
  const original = rec('original/high/h1/1mid/25_학교_1학기_중간_고1_수학.js', 5, 'PT_A', 'TPL_A', 2, { year: 2025 });
  const similar = rec('similar/high/h1/1mid/25_학교_1학기_중간_고1_수학_유사.js', 5, 'PT_A', 'TPL_A', 2, { year: 2025 });
  const similar2 = rec('similar/high/h1/1mid/25_학교_1학기_중간_고1_수학_유사2.js', 5, 'PT_A', 'TPL_A', 2, { year: 2025 });
  const result = S.selectSchoolMock({ base, candidates: [original, similar, similar2], mode: 'basic', seed: 'p' });
  assert.equal(S.pickedRecords(result).length, 1, '짝은 한 자리에만 들어가고 다른 자리는 못 채움으로 남는다');
  assert.equal(result.summary.levels.none, 1);
});

test('기준 문항에 유형이 없어도 막지 않고 같은 단원으로 채운다', () => {
  const base = [rec(BASE_FILE, 1, '', '', 3, { year: 2026 })];
  const candidates = [rec('original/high/h1/1mid/25_학교_1학기_중간_고1_수학.js', 1, 'PT_A', 'TPL_A', 3)];
  const result = S.selectSchoolMock({ base, candidates, mode: 'basic', seed: 'q' });
  assert.equal(result.picks[0].level, 'unit');
});

test('입력이 비어도 오류 없이 빈 결과를 낸다', () => {
  const result = S.selectSchoolMock({});
  assert.equal(result.picks.length, 0);
  assert.equal(result.summary.total, 0);
  assert.equal(result.mode, 'basic');
});
