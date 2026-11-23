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

// 12. 화면 층(diagnostic-report-view.js): 가상 응답 상·중·하 3벌, 작은 표본·문구·내부 용어·쪽 구성
const View = require(path.join(root, 'archive', 'assessment', 'diagnostic-report-view.js'));
{
  const unitNames = ['소인수분해', '정수와 유리수', '문자와 식', '좌표평면과 그래프'];
  const lv = (no) => (no <= 5 ? 1 : no <= 10 ? 2 : no <= 20 ? 3 : no <= 23 ? 4 : 5);
  const viewQuestions = (unitOf) => Array.from({ length: 24 }, (_, k) => {
    const no = k + 1;
    const u = unitOf ? unitOf(no) : unitNames[k % 4];
    return { no, questionUid: 'qid_v1_' + no, unit: u, unitOrder: unitNames.indexOf(u) + 1, difficulty: lv(no), problemTypeKey: 'PT_' + (k % 8) };
  });
  const labelOf = (key) => ({ PT_0: '정수의 대소 비교', PT_1: '절댓값', PT_2: '식의 값', PT_3: '방정식의 해', PT_4: '일차식의 계산', PT_5: '사분면' })[key] || '';
  const respond = (wrongNos) => Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, wrongNos.includes(i + 1) ? 'X' : 'O']));
  const run = (wrong, qs) => View.render(computeDiagnosticReport({ questions: qs || viewQuestions(), responses: respond(wrong), labelOf }));
  const flat = (out) => [out.donut, out.donutBig, out.summary, out.facts, out.levels, out.line, out.lineCap, out.units, out.unitCap, out.heat, out.types, out.wrong, out.plan].join('\n');

  const hi = run([24]);
  const mid = run([8, 13, 15, 17, 20, 22, 23, 24]);
  const low = run(Array.from({ length: 19 }, (_, i) => i + 6));
  for (const out of [hi, mid, low]) {
    assert.ok(out.vm.report.consistency.ok);
    assert.ok(!/PT_|TPL_|bucket|UID|qid_|undefined|NaN|null/i.test(flat(out)), '내부 용어·키·빈 값이 화면에 나오면 안 된다');
    assert.ok(out.types.includes('유형 미분류'), '이름 없는 유형은 유형 미분류로 묶는다');
  }
  assert.ok(/4단계\(심화\)까지 모두 안정적으로/.test(hi.summary), '상: 모든 단계 안정(1문항뿐인 5단계는 판정하지 않는다)');
  assert.ok(/2단계\(기본\)까지는 안정적으로/.test(mid.summary) && /3단계\(응용\)에서는 10문항 중 6문항/.test(mid.summary), '중: 3단계에서 정답이 줄기 시작');
  assert.ok(/2단계\(기본\)에서는 5문항 중 0문항/.test(low.summary) && /1단계\(기초\)까지는 안정적으로/.test(low.summary), '하: 2단계부터 보완');
  assert.ok(!/(잘못|부족|못합니다|실패)/.test(flat(hi) + flat(mid) + flat(low)), '학생·학부모를 깎아내리는 말을 쓰지 않는다');

  // 꺾은선 x축: 띠마다 글자를 찍지 않고 문항 번호 눈금 + 범례 한 줄. 단계가 번갈아 나오는 최악의 순서에서도 눈금 글자가 서로 닿지 않는다.
  for (const count of [1, 2, 3, 5, 7, 10, 12, 20, 24, 30, 50, 80, 100]) {
    for (const pattern of ['alternate', 'sorted', 'reverse']) {
      const levelOf = (no) => (pattern === 'alternate' ? (no % 2 ? 1 : 4) : pattern === 'sorted' ? Math.min(5, 1 + Math.floor((no - 1) * 5 / count)) : Math.max(1, 5 - Math.floor((no - 1) * 5 / count)));
      const qs = Array.from({ length: count }, (_, k) => ({ no: k + 1, questionUid: 'qid_v1_' + (k + 1), unit: unitNames[k % 4], unitOrder: (k % 4) + 1, difficulty: levelOf(k + 1), problemTypeKey: 'PT_' + (k % 8) }));
      const resp = Object.fromEntries(qs.map((q, i) => [q.no, i % 3 === 2 ? 'X' : 'O']));
      const out = View.render(computeDiagnosticReport({ questions: qs, responses: resp, labelOf }));
      const texts = [...out.line.matchAll(/<text x="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => ({ x: Number(m[1]), t: m[2] }));
      const ticks = texts.filter((m) => /^\d+번$/.test(m.t));
      assert.ok(ticks.length >= 1 && ticks[ticks.length - 1].t === count + '번' && ticks[0].t === '1번', `x축 눈금은 1번부터 ${count}번까지 (${pattern})`);
      for (let i = 1; i < ticks.length; i++) assert.ok(ticks[i].x - ticks[i - 1].x >= 33, `눈금 글자끼리 닿지 않는다: ${count}문항 ${pattern} ${ticks[i - 1].t}/${ticks[i].t}`);
      assert.ok(!texts.some((m) => /단계/.test(m.t)), '그래프 안에는 단계 글자를 찍지 않는다(범례 한 줄이 맡는다)');
      assert.strictEqual((out.line.match(/class="legend band-legend"/g) || []).length, 1, '단계 범례는 그래프 아래 한 줄');
    }
  }
  assert.ok(mid.plan.includes('다시 세우기') && mid.plan.includes('확인 평가') && /1~2주차/.test(mid.plan));
  assert.strictEqual(hi.wrongLayout, 'single');
  assert.strictEqual(mid.wrongLayout, 'single');
  assert.strictEqual(low.wrongLayout, 'double');
  assert.ok(low.wrong.includes('two-tables'));
  assert.ok(!/class="tag/.test(hi.heat), '단원×단계 칸에는 태그가 없고 숫자와 농도만 쓴다');

  // 단계는 문항의 실제 단계(1~5)로 나눠 보인다: 시험지 구역 제목과 같고 "4~5단계" 묶음은 어디에도 없다. 문항이 없는 5단계는 줄에서 빠진다.
  const stageNames = (out) => out.vm.groups.map((x) => x.k);
  assert.deepStrictEqual(stageNames(hi), ['1단계', '2단계', '3단계', '4단계', '5단계']);
  assert.ok(/<div class="name">4단계 /.test(hi.levels) && /<div class="name">5단계 /.test(hi.levels) && !/4~5/.test(flat(hi) + flat(mid) + flat(low)));
  assert.strictEqual(hi.vm.groups.find((x) => x.key === '4').g.total, 3);
  assert.strictEqual(hi.vm.groups.find((x) => x.key === '5').g.total, 1);
  assert.ok(/<th>4단계<\/th><th>5단계<\/th>/.test(hi.heat), '단원×단계 열도 4단계·5단계로 나뉜다');
  assert.ok(/class="legend band-legend">.*4단계.*5단계/.test(hi.line) && /bd4"/.test(hi.line) && /bd5"/.test(hi.line));
  const noFive = run([8], viewQuestions().map((q) => ({ ...q, difficulty: Math.min(q.difficulty, 4) })));
  assert.deepStrictEqual(stageNames(noFive), ['1단계', '2단계', '3단계', '4단계']);
  assert.ok(!/5단계/.test(noFive.levels) && !/<th>5단계<\/th>/.test(noFive.heat), '5단계 문항이 없으면 5단계 줄·열을 보이지 않는다');
  // 틀린 문항·유형 표의 단계 칸도 실제 단계 숫자다.
  assert.ok(/<td class="n">5<\/td>/.test(run([24]).wrong), '틀린 문항 표: 5단계 문항은 5');
  assert.ok(/<td class="n">4<\/td>/.test(run([22]).wrong));

  // 작은 표본: 3문항 미만 칸은 판정 문구·색 없이 맞은 수/문항 수만
  const small = run([1, 24], viewQuestions((no) => (no >= 23 ? '통계' : unitNames[no % 4])));
  const statsBar = small.units.split('<div class="bar">').find((s) => s.includes('통계'));
  assert.ok(statsBar && statsBar.includes('meter none') && !/\d+%/.test(statsBar), '2문항 단원은 퍼센트·색 막대 없이 맞은 수/문항 수만');
  assert.ok(/h0">1 \/ 2<|h0">2 \/ 2</.test(small.heat), '2문항 칸은 h0(판정 없음)');
  const shortLevels = run([1], viewQuestions().filter((q) => q.no > 3).map((q, i) => ({ ...q, no: i + 1 })));
  assert.ok(shortLevels.levels.includes('문항이 적어 판정하지 않습니다'), '3문항 미만 단계는 판정하지 않는다');
  // 유형 판단: 3문항 미만은 맞은 수/문항 수만, 3문항 이상은 글자 태그
  assert.strictEqual(View.typeVerdict({ n: 2, ok: 2, wrong: 0 }), null);
  assert.strictEqual(View.typeVerdict({ n: 3, ok: 3, wrong: 0 }).label, '안정');
  assert.strictEqual(View.typeVerdict({ n: 3, ok: 0, wrong: 3 }).label, '보완 권장');
  assert.strictEqual(View.typeVerdict({ n: 4, ok: 2, wrong: 2 }).label, '다시 확인');

  // 단원 강약: 차이가 2문항 이상일 때만
  const U = (name, ok, n) => ({ name, ok, n, r: ok / n });
  assert.ok(View.unitJudgement([U('가', 6, 6), U('나', 3, 6)]), '3문항 차이는 판정');
  assert.ok(View.unitJudgement([U('가', 6, 6), U('나', 4, 6)]), '2문항 차이는 판정');
  assert.strictEqual(View.unitJudgement([U('가', 5, 6), U('나', 4, 6)]), null, '1문항 차이는 판정하지 않는다');
  assert.strictEqual(View.unitJudgement([U('가', 6, 6), U('나', 1, 2)]), null, '3문항 미만 단원은 비교하지 않는다');

  // 글 이스케이프, 유형 표 상한
  const evil = run([2], viewQuestions((no) => (no % 2 ? '<b>x</b>' : '정수와 유리수')));
  assert.ok(!evil.units.includes('<b>x</b>') && evil.units.includes('&lt;b&gt;x&lt;/b&gt;'));
  const manyTypes = View.render(computeDiagnosticReport({
    questions: viewQuestions().map((q) => ({ ...q, problemTypeKey: 'PT_U' + q.no })), responses: respond([3, 9]), labelOf: (key) => '유형 ' + key.slice(4),
  }));
  assert.strictEqual((manyTypes.types.match(/<tr/g) || []).length, 1 + View.TYPE_ROWS_MAX + 1, '유형 표는 머리줄 + 상한 + 나머지 한 줄');
  assert.ok(manyTypes.types.includes('class="rest"'));
  assert.ok(manyTypes.typeRowsHidden > 0);
  // 틀린 문항 없음
  const perfect = run([]);
  assert.ok(perfect.wrong.includes('틀린 문항이 없습니다') && perfect.wrongN === '0문항');
  // 전부 정답이면 "틀린 문항이 있는 부분은 …" 꼬리 문장을 뺀다(틀린 말이 된다). 틀린 문항이 있으면 그대로 둔다.
  assert.ok(/모두 안정적으로 해결합니다\./.test(perfect.summary) && !/틀린 문항이 있는 부분/.test(perfect.summary), '전부 정답: 꼬리 문장 없음');
  assert.ok(/틀린 문항이 있는 부분은 아래 유형별 결과/.test(hi.summary), '틀린 문항이 있으면 꼬리 문장 유지');
  // 전부 오답이면 도넛 호를 그리지 않는다(길이 0 호에 둥근 끝을 주면 12시 방향에 점이 찍힌다). 일부 정답이면 호가 있다.
  const allWrong = run(Array.from({ length: 24 }, (_, i) => i + 1));
  assert.strictEqual((allWrong.donut.match(/<circle/g) || []).length, 1, '정답 0: 바탕 원만, 호 없음');
  assert.strictEqual((perfect.donut.match(/<circle/g) || []).length, 2, '정답이 있으면 바탕 원 + 호');
  assert.strictEqual((hi.donut.match(/<circle/g) || []).length, 2);
}

// 13. 화면 파일: 두 쪽 구성·인쇄 규칙·저장하지 않음·배포 목록
{
  const dir = path.join(root, 'archive', 'assessment');
  const html = fs.readFileSync(path.join(dir, 'diagnostic-report.html'), 'utf8');
  const css = fs.readFileSync(path.join(dir, 'diagnostic-report.css'), 'utf8');
  const js = fs.readFileSync(path.join(dir, 'diagnostic-report.js'), 'utf8');
  const view = fs.readFileSync(path.join(dir, 'diagnostic-report-view.js'), 'utf8');
  assert.strictEqual((html.match(/<section class="sheet"/g) || []).length, 2, 'A4 두 쪽');
  // 이 파일의 src·href는 모두 파일 위치(assessment/) 기준이다(배포 검사도 그렇게 푼다). base 태그는 쓰지 않고, archive/ 기준으로 data/…를 읽는 자료 층을 위해
  // document.baseURI만 한 칸 위로 맞춘다.
  assert.ok(!/<base\b/i.test(html), 'base 태그를 쓰지 않는다');
  assert.ok(html.includes('Object.defineProperty(document, "baseURI", { value: new URL("../", location.href).href })'), '자료 읽기 길의 기준 주소는 archive/');
  assert.ok(html.indexOf('defineProperty(document, "baseURI"') < html.indexOf('archive2-boot.js'), '기준 주소를 맞추는 줄이 자료 층 스크립트보다 먼저');
  assert.ok(!/id="inOrg"|id="inMemo"|<textarea/.test(html) && /ORG_NAME = "AP 수학학원"/.test(js), '학원명은 상수 한 곳, 선생님 의견은 입력 없이 빈칸');
  assert.ok(!/inOrg|inMemo/.test(js), '학원명·의견 입력을 읽지 않는다');
  assert.ok(/@page\s*\{\s*size:\s*A4;\s*margin:\s*0/.test(css) && /break-after:\s*page/.test(css) && /height:\s*296mm/.test(css), '인쇄 쪽 나눔 고정');
  assert.ok(/@container \(max-width: 640px\)/.test(css), '휴대폰 폭 규칙은 컨테이너 기준(쪽 맞춤 측정과 같은 배치)');
  assert.ok(/print-color-adjust:\s*exact/.test(css));
  // 쪽 맞춤: 단원이 많아도 정확히 2쪽·푸터 보임. 단계 0~5 + 마지막 수단(본문 비율 축소), 입력 진행 표시는 스크롤해도 붙어 있다.
  assert.ok(/MAX_LEVEL = 5/.test(js) && /data-fit="4"/.test(css) && /data-fit="5"/.test(css), '쪽 맞춤 단계 0~5');
  assert.ok(/\.sheet\[data-shrink\] > :not\(\.foot\) \{ zoom: var\(--shrink/.test(css) && /MIN_SHRINK/.test(js), '4·5단계로도 넘치면 푸터를 뺀 본문을 비율로 줄인다');
  assert.ok(/\.panel \.progress \{[^}]*position:\s*sticky/.test(css), '입력 N / M 진행 표시는 sticky');
  for (const file of [js, view].map((s) => s.replace(/\/\/.*$/gm, ''))) {
    assert.ok(!/localStorage|sessionStorage|indexedDB|document\.cookie|history\.(push|replace)State|sendBeacon|XMLHttpRequest|location\.(search|hash)\s*=/.test(file), '이름·O/X는 어디에도 저장하지 않는다');
  }
  assert.strictEqual((js.match(/fetch\(/g) || []).length, 1, 'fetch는 data 자료 읽기 한 곳뿐');
  assert.ok(!/document\.title\s*=/.test(js), '제목에 학생 이름을 넣지 않는다');
  assert.ok(!/\b(PT_|TPL_|bucket|UID)\b/.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), '화면 문구에 내부 용어가 없다');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'archive-pages-release-manifest.json'), 'utf8'));
  for (const name of ['diagnostic-report.html', 'diagnostic-report.css', 'diagnostic-report.js', 'diagnostic-report-view.js']) {
    assert.ok(manifest.files.includes('archive/assessment/' + name), name + ' 배포 목록에 있어야 한다');
  }
  // html이 부르는 로컬 스크립트·스타일(같은 폴더, ../ 위 폴더)이 파일 위치 기준으로 모두 있다
  let localRefs = 0;
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"#?]+)/gi)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(m[1])) continue;
    assert.ok(fs.existsSync(path.join(dir, m[1])), m[1]);
    localRefs++;
  }
  assert.ok(localRefs >= 12, '로컬 스크립트·스타일 12개 이상');
}

// 입력 규칙: 기본 전부 정답, 확인 전에는 집계 제외, 일부 입력은 자동 채움 없음, 지우면 미입력
{
  const qs = mockQuestions();
  const { allCorrectResponses, fillRemainingCorrect, applyWrongNumbers, inputStatus } = Data;
  // 새 입력: 전부 O지만 확인 전이라 집계에 쓰이지 않는다(draft, counted=false)
  const fresh = allCorrectResponses(qs);
  assert.strictEqual(Object.keys(fresh).length, 24);
  assert.ok(Object.values(fresh).every((v) => v === "O"));
  let st = inputStatus({ questions: qs, responses: fresh, confirmed: false });
  assert.deepStrictEqual([st.phase, st.correct, st.wrong, st.counted], ["draft", 24, 0, false]);
  // 확인하면 입력 완료·집계
  st = inputStatus({ questions: qs, responses: fresh, confirmed: true });
  assert.deepStrictEqual([st.phase, st.counted], ["confirmed", true]);
  // 열어 본 적 없는 학생(응답 없음)은 미입력, 집계 제외
  st = inputStatus({ questions: qs, responses: {}, confirmed: false });
  assert.deepStrictEqual([st.phase, st.answered, st.counted], ["empty", 0, false]);
  // 확인 표시가 있어도 응답이 비어 있으면(모두 지우기 뒤) 집계하지 않는다
  assert.strictEqual(inputStatus({ questions: qs, responses: {}, confirmed: true }).counted, false);
  // 기존 일부 입력 기록: 자동으로 O를 채우지 않는다. 입력 안 한 문항은 그대로 미입력
  const partial = { 1: "O", 2: "X", 5: "O" };
  const before = JSON.stringify(partial);
  st = inputStatus({ questions: qs, responses: partial, confirmed: false });
  assert.deepStrictEqual([st.phase, st.answered, st.unanswered, st.counted], ["partial", 3, 21, false]);
  assert.strictEqual(JSON.stringify(partial), before, "입력 함수가 기존 응답 객체를 바꾸지 않는다");
  // 남은 문항 모두 정답으로: 입력된 X/O는 그대로, 빈 칸만 O
  const filled = fillRemainingCorrect(qs, partial);
  assert.strictEqual(filled[2], "X");
  assert.strictEqual(filled[1], "O");
  assert.strictEqual(filled[24], "O");
  assert.strictEqual(inputStatus({ questions: qs, responses: filled }).phase, "draft");
  assert.strictEqual(JSON.stringify(partial), before);
  // 틀린 번호 한 줄
  const r = applyWrongNumbers(qs, "3 7, 12  15 7");
  assert.deepStrictEqual([r.ok, r.wrongNos], [true, [3, 7, 12, 15]]);
  assert.strictEqual(inputStatus({ questions: qs, responses: r.responses }).correct, 20);
  assert.strictEqual(applyWrongNumbers(qs, "").ok, true);
  assert.strictEqual(inputStatus({ questions: qs, responses: applyWrongNumbers(qs, "").responses }).wrong, 0);
  for (const bad of ["0", "25", "3 a", "-1", "1.5x"]) assert.strictEqual(applyWrongNumbers(qs, bad).ok, false, bad);
  assert.strictEqual(applyWrongNumbers(qs, "99").responses, null, "오류면 아무 응답도 만들지 않는다");
  // 확인된 입력은 기존 집계와 같은 결과를 낸다
  const rep = computeDiagnosticReport({ questions: qs, responses: r.responses });
  assert.strictEqual(rep.totals.wrong, 4);
  assert.strictEqual(rep.totals.unchecked, 0);
  // 적용 안 한 글 + 결과표 만들기 → 그 번호가 X로 반영된 채 확정
  const { confirmInput } = Data;
  const pendingOk = confirmInput({ questions: qs, responses: fresh, pendingText: '3 7 12' });
  assert.deepStrictEqual([pendingOk.ok, pendingOk.confirmed], [true, true]);
  assert.deepStrictEqual(['3', '7', '12'].map((n) => pendingOk.responses[n]), ['X', 'X', 'X']);
  assert.strictEqual(inputStatus({ questions: qs, responses: pendingOk.responses, confirmed: true }).wrong, 3);
  assert.ok(Object.values(fresh).every((v) => v === 'O'), '받은 응답 객체는 그대로');
  // 잘못된 글 + 확정 → 확정 안 됨(오류 문구, 응답 그대로)
  const pendingBad = confirmInput({ questions: qs, responses: fresh, pendingText: '3 99' });
  assert.deepStrictEqual([pendingBad.ok, pendingBad.confirmed], [false, false]);
  assert.ok(pendingBad.error.includes('99'));
  // 글이 없으면 현재 입력 그대로 확정, 빈 칸이 있으면 확정 안 됨
  assert.strictEqual(confirmInput({ questions: qs, responses: fresh, pendingText: '  ' }).ok, true);
  assert.strictEqual(confirmInput({ questions: qs, responses: partial, pendingText: '' }).ok, false);
  // 전각 숫자·쉼표
  assert.deepStrictEqual(applyWrongNumbers(qs, '３，７ １２').wrongNos, [3, 7, 12]);
  // 화면 파일: 확인 전 결과표 숨김·기본 O·지우기 문구가 들어 있다
  const js = fs.readFileSync(path.join(root, "archive", "assessment", "diagnostic-report.js"), "utf8");
  assert.ok(js.includes('Data.allCorrectResponses(state.questions)') && js.includes('state.confirmed = false'));
  assert.ok(js.includes('if (s.phase !== "confirmed")'), '확인 전에는 결과표를 만들지 않는다');
  assert.ok(!/localStorage|sessionStorage/.test(js.replace(/\/\/.*$/gm, '')), '저장소를 쓰지 않는다');
}

console.log('diagnostic-report-data tests passed');
