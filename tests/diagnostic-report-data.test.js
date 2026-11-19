const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const Data = require(path.join(root, 'archive', 'assessment', 'diagnostic-report-data.js'));
const KeyResolver = require(path.join(root, 'archive', 'archive2-key-resolver.js'));
const { computeDiagnosticReport, createLabelOf, checkConsistency } = Data;

// 가상 문항: 단계 5/5/10/4(4단계 3 + 5단계 1), 두 단원, 유형 6개.
function mockQuestions() {
  const units = ['소인수분해', '정수와 유리수'];
  const level = (i) => (i <= 5 ? 1 : i <= 10 ? 2 : i <= 20 ? 3 : i <= 23 ? 4 : 5);
  const types = ['PT_A', 'PT_B', 'PT_C', 'PT_D', 'PT_E', 'PT_F'];
  return Array.from({ length: 24 }, (_, k) => {
    const no = k + 1;
    return {
      no, questionUid: `qid_${no}`, unit: units[no % 2], subUnit: `소단원${(no % 3) + 1}`,
      problemTypeKey: types[no % 6], templateKey: `TPL_${types[no % 6].slice(3)}${no % 2}`, difficulty: level(no),
      points: 4, essay: no > 20, crossConceptKeys: no % 5 === 0 ? ['CC_X', 'CC_Y'] : [], conditionKeys: [],
    };
  });
}
const wrongSet = (list) => list.map((no) => ({ no, result: 'X' }));
const rightSet = (nos) => nos.map((no) => ({ no, result: 'O' }));
const allNos = Array.from({ length: 24 }, (_, i) => i + 1);

// 1. 일부 오답: 단계별 수와 합계
{
  const wrong = [6, 11, 13, 15, 16, 21, 22, 24];
  const responses = [...rightSet(allNos.filter((n) => !wrong.includes(n))), ...wrongSet(wrong)];
  const r = computeDiagnosticReport({ questions: mockQuestions(), responses });
  assert.deepStrictEqual(r.consistency, { ok: true, problems: [] });
  assert.strictEqual(r.totals.total, 24);
  assert.strictEqual(r.totals.correct, 16);
  assert.strictEqual(r.totals.wrong, 8);
  assert.strictEqual(r.totals.unchecked, 0);
  assert.ok(Math.abs(r.totals.rate - 16 / 24) < 1e-12);
  assert.deepStrictEqual(r.byLevel.map((g) => g.total), [5, 5, 10, 3, 1]);
  assert.deepStrictEqual(r.byLevel.map((g) => g.correct), [5, 4, 6, 1, 0]);
  assert.strictEqual(r.band45.total, 4);
  assert.strictEqual(r.band45.correct, 1);
  assert.strictEqual(r.noLevel.total, 0);
  assert.deepStrictEqual(r.wrongList.map((w) => w.no), wrong);
  assert.deepStrictEqual(r.byLevel[2].items.map((i) => i.no), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.deepStrictEqual(r.byLevel[2].wrongNos, [11, 13, 15, 16]);
  // 단원 합 = 총 문항, 소단원·유형·템플릿 합도 같다
  for (const name of ['byUnit', 'bySubUnit', 'byProblemType', 'byTemplate']) {
    const section = r[name];
    assert.strictEqual(section.groups.reduce((a, g) => a + g.total, 0) + section.missing.total, 24, name);
  }
  assert.strictEqual(r.byUnit.groups.length, 2);
  assert.strictEqual(r.byUnit.groups[0].key, '정수와 유리수', '처음 나온 번호(1번) 순서');
  // 교차표
  const row = r.levelByUnit.rows.find((x) => x.unit === '소인수분해');
  assert.strictEqual([1, 2, 3, 4, 5].reduce((a, k) => a + row.cells[k].total, 0), row.total.total);
  assert.strictEqual(row.cells['4-5'].total, row.cells[4].total + row.cells[5].total);
  // 누적 곡선
  assert.strictEqual(r.sequence.length, 24);
  assert.deepStrictEqual(r.sequence.slice(0, 7).map((s) => s.cumulativeCorrect), [1, 2, 3, 4, 5, 5, 6]);
  assert.strictEqual(r.sequence[23].cumulativeCorrect, 16);
  // 약한 유형 순위: 오답 수 내림차순
  const weak = r.weakProblemTypes;
  assert.ok(weak.length > 0);
  for (let i = 1; i < weak.length; i += 1) assert.ok(weak[i - 1].wrong >= weak[i].wrong);
  assert.deepStrictEqual(weak.map((w) => w.rank), weak.map((_, i) => i + 1));
  assert.ok(weak.every((w) => w.wrong > 0));
  // 서술형 구분, 배점
  assert.strictEqual(r.totals.essayCount, 4);
  assert.strictEqual(r.totals.objectiveCount, 20);
  assert.strictEqual(r.totals.pointsTotal, 96);
  assert.strictEqual(r.totals.pointsEarned, 64);
  // 여러 값이 붙는 메타는 문항이 여러 묶음에 들어가며 따로 표시한다
  assert.strictEqual(r.byCrossConcept.multiValued, true);
  assert.deepStrictEqual(r.byCrossConcept.groups.map((g) => g.key), ['CC_X', 'CC_Y']);
  assert.strictEqual(r.byCrossConcept.groups[0].total, 4);
  assert.strictEqual(r.byCrossConcept.missing.total, 20);
}

// 2. 전부 정답
{
  const r = computeDiagnosticReport({ questions: mockQuestions(), responses: rightSet(allNos) });
  assert.strictEqual(r.consistency.ok, true);
  assert.strictEqual(r.totals.rate, 1);
  assert.strictEqual(r.wrongList.length, 0);
  assert.strictEqual(r.weakProblemTypes.length, 0);
  assert.strictEqual(r.weakTemplates.length, 0);
}

// 3. 전부 오답
{
  const r = computeDiagnosticReport({ questions: mockQuestions(), responses: wrongSet(allNos) });
  assert.strictEqual(r.consistency.ok, true);
  assert.strictEqual(r.totals.rate, 0);
  assert.strictEqual(r.wrongList.length, 24);
  assert.strictEqual(r.weakProblemTypes.length, 6);
  assert.strictEqual(r.weakProblemTypes[0].rank, 1);
  assert.ok(r.byLevel.every((g) => g.rate === 0));
}

// 4. 일부 미입력: 정답률은 응답한 문항 기준, 전체 대비 비율은 따로
{
  const r = computeDiagnosticReport({ questions: mockQuestions(), responses: [...rightSet([1, 2, 3]), ...wrongSet([4])] });
  assert.strictEqual(r.consistency.ok, true);
  assert.strictEqual(r.totals.unchecked, 20);
  assert.strictEqual(r.totals.answered, 4);
  assert.strictEqual(r.totals.rate, 0.75);
  assert.ok(Math.abs(r.totals.rateAll - 3 / 24) < 1e-12);
  assert.strictEqual(r.byLevel[3].rate, null, '응답이 없는 단계의 정답률은 null');
  assert.strictEqual(r.wrongList.length, 1);
}

// 5. 빈 입력
for (const input of [undefined, null, {}, { questions: [], responses: [] }, { questions: 'x', responses: 7 }]) {
  const r = computeDiagnosticReport(input);
  assert.strictEqual(r.totals.total, 0);
  assert.strictEqual(r.totals.rate, null);
  assert.strictEqual(r.totals.rateAll, null);
  assert.strictEqual(r.consistency.ok, true);
  assert.strictEqual(r.byLevel.length, 5);
  assert.deepStrictEqual(r.wrongList, []);
  assert.deepStrictEqual(r.sequence, []);
  assert.deepStrictEqual(r.levelByUnit.rows, []);
}
// 문항만 있고 응답이 없으면 전부 미응답
{
  const r = computeDiagnosticReport({ questions: mockQuestions() });
  assert.strictEqual(r.totals.unchecked, 24);
  assert.strictEqual(r.totals.rate, null);
  assert.strictEqual(r.consistency.ok, true);
}

// 6. 메타가 없는 문항: 추정하지 않고 "없음"으로 따로 센다
{
  const questions = [
    { no: 1, difficulty: 2, unit: '단원A', problemTypeKey: 'PT_A' },
    { no: 2 },
    { no: 3, level: '중', difficultyBucket: '하' }, // 옛 하/중/상은 1~5로 바꾸지 않는다
    { no: 4, difficultyBucket: 9 },
    { no: 5, difficultyBucket: '3', unit: '단원A' },
  ];
  const r = computeDiagnosticReport({ questions, responses: { 1: 'O', 2: 'X', 3: 'X', 4: 'O', 5: 'X' } });
  assert.strictEqual(r.consistency.ok, true, r.consistency.problems.join('\n'));
  assert.strictEqual(r.noLevel.total, 3, '단계 정보 없음 = 2, 3, 4번');
  assert.deepStrictEqual(r.noLevel.questionNos, [2, 3, 4]);
  assert.deepStrictEqual(r.diagnostics.invalidDifficultyNos, [3, 4]);
  assert.strictEqual(r.byLevel[1].total, 1);
  assert.strictEqual(r.byLevel[2].total, 1, '문자열 "3"은 정수 3으로 읽는다');
  assert.strictEqual(r.byUnit.missing.total, 3);
  assert.strictEqual(r.byProblemType.missing.total, 4);
  assert.strictEqual(r.diagnostics.missing.points, 5);
  assert.strictEqual(r.diagnostics.missing.essay, 5);
  assert.strictEqual(r.byFormat.unknown.total, 5);
  assert.strictEqual(r.levelByUnit.rows.length, 2, '단원 없음 행은 없는 문항이 있을 때만');
  assert.strictEqual(r.levelByUnit.rows[1].unit, null);
}

// 7. 번호 중복·응답만 있는 번호·같은 번호 응답 두 번, 순서가 뒤섞인 입력
{
  const questions = [{ no: 3, unit: 'U' }, { no: 1, unit: 'U' }, { no: 1, unit: 'V' }, { no: 2, unit: 'U' }];
  const responses = [{ no: 1, result: 'O' }, { no: 1, result: 'X' }, { no: 9, result: 'O' }, { no: 3, result: 'O' }];
  const r = computeDiagnosticReport({ questions, responses });
  assert.deepStrictEqual(r.questions.map((q) => q.no), [1, 2, 3]);
  assert.deepStrictEqual(r.diagnostics.duplicateQuestionNos, [1]);
  assert.deepStrictEqual(r.diagnostics.duplicateResponseNos, [1]);
  assert.deepStrictEqual(r.diagnostics.orphanResponseNos, [9]);
  assert.strictEqual(r.totals.total, 3);
  assert.strictEqual(r.totals.wrong, 1, '같은 번호 응답은 마지막 것');
  assert.strictEqual(r.consistency.ok, true);
}

// 8. 응답 표기 여러 가지(진단 팩 화면이 저장하는 result_status 포함)
{
  const questions = [1, 2, 3, 4, 5, 6].map((no) => ({ no }));
  const r = computeDiagnosticReport({
    questions,
    responses: [
      { order_no: 1, result_status: 'correct' }, { order_no: 2, result_status: 'wrong' }, { order_no: 3, result_status: 'unchecked' },
      { no: 4, result: true }, { no: 5, result: false }, { no: 6, result: '' },
    ],
  });
  assert.strictEqual(r.totals.correct, 2);
  assert.strictEqual(r.totals.wrong, 2);
  assert.strictEqual(r.totals.unchecked, 2);
}

// 9. 약한 유형 순위의 동률 처리: 오답 수 → 정답률 → 문항 수
{
  const q = [
    { no: 1, problemTypeKey: 'PT_ONE' }, // 1/1 오답
    { no: 2, problemTypeKey: 'PT_TWO' }, { no: 3, problemTypeKey: 'PT_TWO' }, { no: 4, problemTypeKey: 'PT_TWO' }, // 2/3 오답
    { no: 5, problemTypeKey: 'PT_THREE' }, { no: 6, problemTypeKey: 'PT_THREE' }, { no: 7, problemTypeKey: 'PT_THREE' }, { no: 8, problemTypeKey: 'PT_THREE' }, // 2/4 오답
  ];
  const resp = { 1: 'X', 2: 'X', 3: 'X', 4: 'O', 5: 'X', 6: 'X', 7: 'O', 8: 'O' };
  const r = computeDiagnosticReport({ questions: q, responses: resp });
  assert.deepStrictEqual(r.weakProblemTypes.map((w) => w.key), ['PT_TWO', 'PT_THREE', 'PT_ONE']);
}

// 10. 이름표: 저장소 이름표(키 해석기)를 그대로 쓰고, 이름이 없으면 키를 내보내지 않는다
{
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(root, 'archive', rel), 'utf8'));
  const taxonomy = read('data/meta-foundation/compiled/taxonomy_registry.json');
  const concepts = read('data/meta-foundation/compiled/concept_registry.json');
  const conditions = read('data/meta-foundation/compiled/condition_registry.json');
  const extensions = read('data/archive2-extension-keys.json');
  const labelOf = createLabelOf({ taxonomy, concepts, conditions, extensions }, KeyResolver);
  const pt = taxonomy.problemTypes.find((row) => row.status === 'ACTIVE');
  const tpl = taxonomy.templates.find((row) => row.status === 'ACTIVE');
  assert.strictEqual(labelOf(pt.problemTypeKey), pt.canonicalLabelKo);
  assert.strictEqual(labelOf(tpl.templateKey), tpl.canonicalLabelKo);
  assert.strictEqual(labelOf(concepts.concepts[0].conceptKey), concepts.concepts[0].canonicalLabelKo);
  assert.strictEqual(labelOf(conditions.conditions[0].conditionKey), conditions.conditions[0].canonicalLabelKo);
  assert.strictEqual(labelOf('PT_DOES_NOT_EXIST'), '');
  assert.strictEqual(labelOf(''), '');
  assert.throws(() => createLabelOf({}, {}), /KEY_RESOLVER_MISSING/);
  const questions = [
    { no: 1, problemTypeKey: pt.problemTypeKey, templateKey: tpl.templateKey, difficulty: 1 },
    { no: 2, problemTypeKey: 'PT_DOES_NOT_EXIST', difficulty: 2 },
  ];
  const r = computeDiagnosticReport({ questions, responses: { 1: 'O', 2: 'X' }, labelOf });
  assert.strictEqual(r.byProblemType.groups[0].label, pt.canonicalLabelKo);
  assert.strictEqual(r.byProblemType.groups[1].label, null, '이름이 없으면 null(키 글자를 이름으로 쓰지 않는다)');
  assert.deepStrictEqual(r.diagnostics.unlabeledKeys, ['PT_DOES_NOT_EXIST']);
  // 이름표 함수가 없으면 label은 모두 null
  const bare = computeDiagnosticReport({ questions, responses: { 1: 'O', 2: 'X' } });
  assert.ok(bare.byProblemType.groups.every((g) => g.label === null));
}

// 11. 일관성 검사기는 어긋난 값을 실제로 잡아낸다
{
  const r = computeDiagnosticReport({ questions: mockQuestions(), responses: wrongSet(allNos) });
  r.byLevel[0].total += 1;
  assert.strictEqual(checkConsistency(r).ok, false);
}

console.log('diagnostic-report-data tests passed');
