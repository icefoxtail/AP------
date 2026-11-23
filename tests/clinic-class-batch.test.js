'use strict';
// 시험 결과 화면의 "반 전체 · 학생별 오답 클리닉" 입구와 학생마다 도는 자동 유사 추천.
// 결함 조건: 학생별 목표 계산이 틀림(틀린 문항 0개 학생에게 쪽이 생김·목표 이상인 학생에게 유사가 붙음), 한 학생 실패가 나머지를 멈춤,
// 요약 문구 오류, 기본(틀린 문항만) 동작이 바뀜, 새 선정 로직이 생김, 휴대폰 폭 미리보기가 다시 잘림.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const clinicSrc = fs.readFileSync(path.join(root, 'apmath/js/clinic-print.js'), 'utf8');
const wsxSrc = fs.readFileSync(path.join(root, 'apmath/js/ws-exam-workspace.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8');
const engineHtml = fs.readFileSync(path.join(root, 'apmath/wrong_print_engine.html'), 'utf8');

function loadClinicPrint(extra = {}) {
  const context = {
    window: { addEventListener() {}, ...extra.window },
    document: { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
    state: { db: {} }, localStorage: { getItem() { return null; }, setItem() {} }, URL, URLSearchParams, console,
    toast: () => {},
    setTimeout, clearTimeout,
  };
  vm.createContext(context);
  vm.runInContext(clinicSrc, context);
  return context;
}

const rows = (pairs) => pairs.map(([studentId, n]) => ({ studentId, wrongItems: Array.from({ length: n }, (_, i) => ({ i })) }));

// ---------- 학생별 목표 계산 ----------
test('학생별 목표: (목표 - 그 학생의 틀린 문항 수)만큼 필요하고, 틀린 문항이 0개인 학생은 건너뛰며, 목표 이상이면 유사 없이 전부 담는다', () => {
  const c = loadClinicPrint();
  const plan = c.clinicPrintPlanBatchTargets(20, rows([['a', 6], ['b', 3], ['d', 20], ['e', 25]]), ['a', 'b', 'c', 'd', 'e']);
  assert.deepEqual(JSON.parse(JSON.stringify(plan)), [
    { studentId: 'a', wrongCount: 6, need: 14, kind: 'need' },
    { studentId: 'b', wrongCount: 3, need: 17, kind: 'need' },
    { studentId: 'c', wrongCount: 0, need: 0, kind: 'skip' },
    { studentId: 'd', wrongCount: 20, need: 0, kind: 'full' },
    { studentId: 'e', wrongCount: 25, need: 0, kind: 'full' },
  ]);
});

test('학생별 목표: 추천 수는 최대 400이고 id 형식(숫자·문자)이 달라도 같은 학생으로 센다', () => {
  const c = loadClinicPrint();
  const [row] = c.clinicPrintPlanBatchTargets(1000, rows([[7, 1]]), ['7']);
  assert.equal(row.need, 400);
  assert.equal(row.studentId, '7');
  assert.equal(c.clinicPrintPlanBatchTargets(20, [], ['x'])[0].kind, 'skip', '오답 자료가 아예 없어도 빈 쪽을 만들지 않는다');
});

// ---------- 요약 문구 ----------
test('요약: "N명 중 M명 목표 채움, K명은 유사 부족", 건너뛴 학생과 오류는 따로 알린다', () => {
  const c = loadClinicPrint();
  const plan = [];
  for (let i = 0; i < 18; i++) plan.push({ studentId: `s${i}`, wrongCount: 5, need: 15, kind: 'need' });
  const picked = {};
  plan.slice(0, 15).forEach((row) => { picked[row.studentId] = 15; });
  plan.slice(15).forEach((row) => { picked[row.studentId] = 4; });
  assert.equal(c.clinicPrintBatchSummaryText(20, plan, picked), '18명 중 15명 목표 채움, 3명은 유사 부족');
  assert.equal(c.clinicPrintBatchSummaryText(20, plan, Object.fromEntries(plan.map((row) => [row.studentId, 15]))), '18명 중 18명 목표 채움');
  const withSkipAndError = [...plan.slice(0, 2), { studentId: 'z', wrongCount: 0, need: 0, kind: 'skip' }, { studentId: 'f', wrongCount: 30, need: 0, kind: 'full' }];
  const text = c.clinicPrintBatchSummaryText(20, withSkipAndError, { s0: 15 }, ['s1']);
  assert.equal(text, '3명 중 2명 목표 채움, 1명은 유사 부족 (1명은 오류로 못 채움) · 틀린 문항이 없는 1명은 뺌');
});

// ---------- 학생마다 기존 build를 부른다 ----------
function perStudentApp({ failFor = [], noItemsFor = [] } = {}) {
  const calls = [];
  const build = (input) => {
    const studentId = input.studentIds[0];
    calls.push({ studentIds: input.studentIds, count: input.countPerStudent, nested: input.recommendationOptions.countPerStudent, basis: input.selectionBasis });
    if (failFor.includes(studentId)) throw new Error('boom');
    const items = noItemsFor.includes(studentId) ? [] : Array.from({ length: input.countPerStudent }, (_, i) => ({ sourceQuestionUid: `${studentId}-u${i}` }));
    return { status: items.length ? 'ready' : 'no_candidates', contractVersion: 'v', coverage: { scope: 'class' }, evidence: [{ studentId }], candidates: [{ studentId, requestedCount: input.countPerStudent, returnedCount: items.length, shortfall: input.countPerStudent - items.length, items }], errors: [] };
  };
  const c = loadClinicPrint({ window: { ClinicRecommendations: { build } } });
  return { c, calls };
}

test('학생마다 build를 한 번씩 부르고 각자 필요한 개수를 넘기며, 이력·카탈로그 같은 입력은 그대로 공유한다', async () => {
  const { c, calls } = perStudentApp();
  const progress = [];
  const input = { sessions: ['S'], studentIds: ['all'], selectionBasis: 'wrong_type', countPerStudent: 99, recommendationOptions: { countPerStudent: 99, difficultyMode: 'match_wrong' } };
  const result = await c.clinicPrintBuildPerStudentRecommendations(input, [{ studentId: 'a', need: 14 }, { studentId: 'b', need: 17 }], { onProgress: (d, t) => progress.push([d, t]) });
  assert.deepEqual(calls.map((row) => [row.studentIds.join(), row.count, row.nested, row.basis]), [['a', 14, 14, 'wrong_type'], ['b', 17, 17, 'wrong_type']]);
  assert.deepEqual(progress, [[1, 2], [2, 2]]);
  assert.equal(result.status, 'ready');
  assert.deepEqual(JSON.parse(JSON.stringify(result.candidates.map((g) => [g.studentId, g.items.length]))), [['a', 14], ['b', 17]]);
  assert.equal(result.coverage.selectedStudentCount, 2);
  assert.deepEqual(Array.from(result.failedStudentIds), []);
});

test('한 학생에서 실패하거나 후보가 없어도 나머지는 계속 돌고, 실패한 학생이 기록된다', async () => {
  const { c, calls } = perStudentApp({ failFor: ['b'], noItemsFor: ['c'] });
  const result = await c.clinicPrintBuildPerStudentRecommendations({ recommendationOptions: {} },
    ['a', 'b', 'c', 'd'].map((studentId) => ({ studentId, need: 3 })), {});
  assert.equal(calls.length, 4, '실패 뒤에도 끝까지 돈다');
  assert.deepEqual(JSON.parse(JSON.stringify(result.candidates.map((g) => [g.studentId, g.items.length]))), [['a', 3], ['b', 0], ['c', 0], ['d', 3]]);
  assert.deepEqual(Array.from(result.failedStudentIds), ['b']);
  assert.equal(result.status, 'ready');
});

test('모든 학생이 후보 없음이면 ready가 아니다, 화면이 바뀌면(isCurrent 거짓) 중단한다', async () => {
  const { c } = perStudentApp({ noItemsFor: ['a', 'b'] });
  const none = await c.clinicPrintBuildPerStudentRecommendations({ recommendationOptions: {} }, [{ studentId: 'a', need: 2 }, { studentId: 'b', need: 2 }], {});
  assert.equal(none.status, 'no_candidates');
  let n = 0;
  const stale = await c.clinicPrintBuildPerStudentRecommendations({ recommendationOptions: {} }, [{ studentId: 'a', need: 2 }, { studentId: 'b', need: 2 }], { isCurrent: () => ++n < 2 });
  assert.equal(stale, null);
});

// ---------- 원본 확인: 학생 한 명씩, 실패해도 이어간다 ----------
test('원본 확인: 학생별로 한 번에 확인해 담고, 한 학생이 실패하면 그 학생만 빠지고 오류가 기록된다', async () => {
  const c = loadClinicPrint();
  const state = { selectedKeys: new Set(), verifiedByKey: new Map(), validationErrors: new Map() };
  vm.runInContext('clinicPrintActiveClassId = "c1"', c);
  c.__state = state;
  vm.runInContext('clinicPrintRecommendationState = __state', c);
  c.clinicPrintLoadArchive2CandidateCatalog = async () => ({ catalog: {}, records: [] });
  c.clinicPrintEnsureArchive2Source = async () => {};
  c.clinicPrintFindRecommendationRecord = (item) => ({ uid: item.sourceQuestionUid });
  c.clinicPrintMarkRecommendationVerified = () => {};
  let restoreCalls = 0;
  c.clinicPrintRestoreRecommendationSources = async (records) => {
    restoreCalls += 1;
    if (records[0].uid.startsWith('b-')) throw new Error('원본 없음');
    return records.map((record) => ({ q: record.uid }));
  };
  const groups = ['a', 'b', 'c'].map((studentId) => ({ studentId, items: [{ sourceQuestionUid: `${studentId}-1` }, { sourceQuestionUid: `${studentId}-2` }] }));
  const progress = [];
  const out = await c.clinicPrintVerifyBatchRecommendations('c1', state, groups, (d, t) => progress.push([d, t]));
  assert.equal(restoreCalls, 3, '학생 한 명에 한 번(문항마다가 아니다)');
  assert.deepEqual(JSON.parse(JSON.stringify(out)), { pickedByStudent: { a: 2, c: 2 }, failedIds: ['b'] });
  assert.equal(state.selectedKeys.size, 4);
  assert.equal(state.verifiedByKey.size, 4);
  assert.equal(state.validationErrors.size, 2, '실패한 학생의 문항에 오류 표시');
  assert.deepEqual(progress, [[1, 3], [2, 3], [3, 3]]);
});

// ---------- 전체 흐름(자동 추천 한 번) ----------
function batchApp({ wrongRows, studentIds, loadStatus = 'ready', picked = null, failedIds = [] }) {
  const c = loadClinicPrint();
  const notes = [];
  const countInput = { value: '5' };
  const basisRadio = { checked: false };
  const noteEl = { hidden: true, set textContent(v) { notes.push(v); } };
  c.document.getElementById = (id) => (id === 'clinic-print-auto-note' ? noteEl : id === 'clinic-print-recommendation-count' ? countInput : null);
  c.document.querySelector = (sel) => (sel.includes('clinic-print-mode') ? { value: 'student' } : sel.includes('recommendation-basis') ? basisRadio : null);
  c.document.querySelectorAll = (sel) => (sel.includes('clinic-print-student') ? studentIds.map((value) => ({ value })) : sel.includes('clinic-print-exam') ? [{ value: 'k1' }] : []);
  vm.runInContext('clinicPrintActiveClassId = "c1"', c);
  c.clinicPrintBuildStudentWrongItems = () => wrongRows;
  const seen = { load: [], verify: 0 };
  c.clinicPrintLoadRecommendations = async (classId, options) => {
    seen.load.push(options);
    options.onProgress(1, options.perStudent.length);
    c.__st = { scope: 'class', status: loadStatus, classId: 'c1', error: 'x', result: { failedStudentIds: failedIds, candidates: options.perStudent.map((t) => ({ studentId: t.studentId, items: [{ sourceQuestionUid: 'u' }] })) } };
    vm.runInContext('clinicPrintRecommendationState = __st', c);
  };
  c.clinicPrintVerifyBatchRecommendations = async (classId, state, groups) => {
    seen.verify += 1;
    return { pickedByStudent: picked || Object.fromEntries(wrongRows.map((r) => [r.studentId, 99])), failedIds: [] };
  };
  c.clinicPrintRenderRecommendationPanel = () => {};
  c.clinicPrintSchedulePreviewPush = () => {};
  return { c, notes, countInput, basisRadio, seen };
}

test('반 전체 자동 추천: 필요한 학생만 추천하고(목표 - 틀린 문항), 틀린 유형 기준으로 한 번 불러와 요약 한 줄을 남긴다', async () => {
  const a = batchApp({ wrongRows: rows([['a', 6], ['b', 3], ['d', 25]]), studentIds: ['a', 'b', 'c', 'd'], picked: { a: 14, b: 10 } });
  await a.c.clinicPrintAutoRecommendForTarget('c1', 20, true);
  assert.equal(a.seen.load.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(a.seen.load[0].perStudent)), [{ studentId: 'a', need: 14 }, { studentId: 'b', need: 17 }], '0개 학생(c)·목표 이상 학생(d)은 추천 대상이 아니다');
  assert.equal(a.seen.load[0].targetCount, 20);
  assert.equal(a.basisRadio.checked, true);
  assert.equal(a.countInput.value, '17', '입력 칸에는 가장 큰 필요 수(컨텍스트 키가 흔들리지 않게 한 값으로 고정)');
  assert.match(a.notes[0], /유사 문항을 고르는 중… 0\/2명/);
  assert.ok(a.notes.some((text) => /유사 문항을 고르는 중… 1\/2명/.test(text)), '진행 안내');
  assert.equal(a.seen.verify, 1);
  // a: 6+14=20 채움, b: 3+10=13 부족, d: 25 >= 20 채움, c: 0개라 뺌 -> 대상 3명 중 2명
  assert.equal(a.notes.at(-1), '3명 중 2명 목표 채움, 1명은 유사 부족 · 틀린 문항이 없는 1명은 뺌');
});

test('반 전체 자동 추천: 모든 학생이 목표 이상이면 추천을 부르지 않고, 추천이 비거나 실패해도 틀린 문항만 담는다고 알린다', async () => {
  const full = batchApp({ wrongRows: rows([['a', 20], ['b', 30]]), studentIds: ['a', 'b'] });
  await full.c.clinicPrintAutoRecommendForTarget('c1', 20, true);
  assert.equal(full.seen.load.length, 0);
  assert.match(full.notes.at(-1), /2명 중 2명 목표 채움.*유사 문항 없이 전부 담았습니다/);
  for (const loadStatus of ['empty', 'error']) {
    const a = batchApp({ wrongRows: rows([['a', 5]]), studentIds: ['a'], loadStatus });
    await a.c.clinicPrintAutoRecommendForTarget('c1', 20, true);
    assert.equal(a.seen.verify, 0);
    assert.match(a.notes.at(-1), /틀린 문항만 담았습니다/);
  }
});

test('반 전체 자동 추천: classBatch가 아니면(학생 상세 경로) 학생이 여럿일 때 아무것도 하지 않는다', async () => {
  const a = batchApp({ wrongRows: rows([['a', 5], ['b', 5]]), studentIds: ['a', 'b'] });
  await a.c.clinicPrintAutoRecommendForTarget('c1', 20);
  assert.equal(a.seen.load.length, 0);
});

// ---------- 입구와 연결 ----------
test('입구: 반 전체 열기는 학생을 고르지 않고 시험만 넘기며, 목표(20·30)가 있을 때만 classBatch 추천 설정이 붙는다', () => {
  const opened = [];
  const c = loadClinicPrint();
  c.openClinicPrintCenter = (classId, options) => { opened.push([classId, options]); return true; };
  const exam = { sessionId: 's1', examDate: '2026-11-10', examTitle: 'T', archiveFile: 'exams/a.js', questionCount: 20 };
  c.openClinicForClassExams('c1', [exam], {});
  c.openClinicForClassExams('c1', [exam], { targetCount: 30 });
  const plain = JSON.parse(JSON.stringify(opened[0][1]));
  assert.equal(plain.preselect.studentId, '', '학생 한 명을 고르지 않는다(오답 있는 학생 전원)');
  assert.ok(!('recommendation' in plain), '목표를 안 고르면 지금 단추와 같은 동작(틀린 문항만)');
  const withTarget = JSON.parse(JSON.stringify(opened[1][1]));
  assert.equal(withTarget.recommendation.targetCount, 30);
  assert.equal(withTarget.recommendation.classBatch, true);
  assert.equal(withTarget.recommendation.selectionBasis, 'wrong_type');
  const toasts = [];
  c.toast = (message) => toasts.push(message);
  assert.equal(c.openClinicForClassExams('', [exam]), false);
  assert.equal(c.openClinicForClassExams('c1', []), false);
  assert.equal(toasts.length, 2);
});

test('시험 결과 화면: "반 전체 · 학생별 오답 클리닉" 한 줄(틀린 문항만 기본 / 20 / 30)과 열기 단추, 오답 있는 제출 학생이 없으면 안 보인다', () => {
  assert.match(wsxSrc, /function wsxClassClinicHtml\(detail\)/);
  assert.match(wsxSrc, /opt\('0', '틀린 문항만'\)\}\$\{opt\('20', '20문항으로'\)\}\$\{opt\('30', '30문항으로'\)/);
  assert.match(wsxSrc, /const target = String\(wsx\.classClinicTarget \|\| '0'\);/, '기본값은 틀린 문항만');
  assert.match(wsxSrc, /wsxClassClinicRows\(detail\)[\s\S]*?!r\.pending && r\.session && r\.wrongs\.length/);
  assert.match(wsxSrc, /openClinicForClassExams\(wsx\.classId, \[\{[\s\S]*?\}\], targetCount \? \{ targetCount \} : \{\}\);/);
  assert.match(wsxSrc, /\$\{wsxClassClinicHtml\(detail\)\}/);
  // 학생 한 줄 단추(기존)는 그대로
  assert.match(wsxSrc, /openClinicForStudentExam\(wsx\.classId, row\.sid, \{/);
  // 새 선정 로직 없음: 후보는 기존 build로만 만든다
  const body = clinicSrc.slice(clinicSrc.indexOf('async function clinicPrintBuildPerStudentRecommendations'), clinicSrc.indexOf('async function clinicPrintLoadRecommendations'));
  assert.match(body, /window\.ClinicRecommendations\.build\(/);
  assert.ok(!/sort\(|shuffle|Math\.random/.test(body));
});

test('센터: 시험 목록은 한글 제목(ExamDisplayTitle)으로 보이되 저장값·요청 값은 원문이다', () => {
  const c = loadClinicPrint({ window: { ExamDisplayTitle: { readableExamTitle: (raw) => (raw === '24_매산고_1학기_중간_고1_기출' ? '2024 매산고 고1 1학기 중간' : raw) } } });
  assert.equal(c.clinicPrintGetExamGroupDisplayTitle({ archiveFile: 'exams/original/high/h1/1mid/24_매산고_1학기_중간_고1_기출.js' }), '2024 매산고 고1 1학기 중간');
  assert.equal(c.clinicPrintGetExamGroupDisplayTitle({ archiveFile: 'exams/original/high/h1/1mid/자유로운_이름.js' }), '자유로운_이름', '해석할 수 없는 이름은 원문');
  assert.equal(c.clinicPrintGetExamGroupDisplayTitle({ examDate: '2026-11-01', examTitle: '쪽지시험' }), '2026-11-01 쪽지시험');
  const none = loadClinicPrint();
  assert.equal(none.clinicPrintGetExamGroupDisplayTitle({ archiveFile: 'exams/a/24_매산고_1학기_중간_고1_기출.js' }), '24_매산고_1학기_중간_고1_기출', '스크립트가 없으면 원문 그대로');
  assert.equal(none.clinicPrintGetArchiveDisplayTitle('exams/a/24_매산고_1학기_중간_고1_기출.js'), '24_매산고_1학기_중간_고1_기출', '요청에 쓰이는 값 함수는 바뀌지 않는다');
});

test('휴대폰 폭 미리보기: 쪽 상자 가운데를 화면 가운데로 옮겨 오른쪽으로 잘리지 않는다', () => {
  assert.match(engineHtml, /transform: translateX\(var\(--screen-page-shift, 0px\)\) scale\(var\(--screen-page-scale, 1\)\); transform-origin: top center;/);
  assert.match(engineHtml, /setProperty\('--screen-page-shift'/);
  // 같은 계산: 358폭 화면, 794 상자 -> 쪽 왼쪽 8px(오른쪽 끝 350px)
  const place = (innerWidth, boxWidth, pageWidth) => {
    const scale = Math.max(0.32, Math.min(0.72, Math.max(280, innerWidth - 16) / pageWidth));
    const boxCenter = Math.max(0, (innerWidth - boxWidth) / 2) + boxWidth / 2;
    const shift = Math.round(innerWidth / 2 - boxCenter);
    const left = Math.max(0, (innerWidth - boxWidth) / 2) + boxWidth / 2 + shift - (boxWidth * scale) / 2;
    return { left: Math.round(left), right: Math.round(left + boxWidth * scale), shift };
  };
  assert.deepEqual(place(358, 794, 794), { left: 8, right: 350, shift: -218 });
  assert.equal(place(893, 794, 794).shift, 0, '이미 가운데인 넓은 화면은 그대로');
});

test('고친 파일의 ?v=는 apmath/index.html에서 새 값이다', () => {
  assert.match(indexHtml, /js\/clinic-print\.js\?v=20261123-clinic-polish-1/);
  assert.match(indexHtml, /js\/ws-exam-workspace\.js\?v=20261123-self-study-1/);
  assert.match(indexHtml, /css\/ws-exam\.css\?v=20261123-self-study-1/);
});
