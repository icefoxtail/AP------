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
  const lv = (no) => (no <= 5 ? 1 : no <= 10 ? 2 : no <= 20 ? 3 : no <= 22 ? 4 : 5);
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
  assert.ok(/4~5단계\(심화\)까지 모두 안정적으로/.test(hi.summary), '상: 모든 단계 안정');
  assert.ok(/2단계\(기본\)까지는 안정적으로/.test(mid.summary) && /3단계\(응용\)에서는 10문항 중 6문항/.test(mid.summary), '중: 3단계에서 정답이 줄기 시작');
  assert.ok(/2단계\(기본\)에서는 5문항 중 0문항/.test(low.summary) && /1단계\(기초\)까지는 안정적으로/.test(low.summary), '하: 2단계부터 보완');
  assert.ok(!/(잘못|부족|못합니다|실패)/.test(flat(hi) + flat(mid) + flat(low)), '학생·학부모를 깎아내리는 말을 쓰지 않는다');
  assert.ok(mid.plan.includes('다시 세우기') && mid.plan.includes('확인 평가') && /1~2주차/.test(mid.plan));
  assert.strictEqual(hi.wrongLayout, 'single');
  assert.strictEqual(mid.wrongLayout, 'single');
  assert.strictEqual(low.wrongLayout, 'double');
  assert.ok(low.wrong.includes('two-tables'));
  assert.ok(!/class="tag/.test(hi.heat), '단원×단계 칸에는 태그가 없고 숫자와 농도만 쓴다');

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

console.log('diagnostic-report-data tests passed');
