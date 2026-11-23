'use strict';
// 오답 클리닉 마무리 둘: (1) 인쇄물 문항 꼬리표가 코드형 시험 이름을 한글 제목으로 보이게, (2) 반 단위 여러 시험 + "유사 다시 채우기".
// 결함 조건: 코드형 이름이 학생이 받는 종이에 그대로 나옴, 해석 못 하는 이름이 깨지거나 사라짐, 저장값(examTitle)이 바뀜,
// 유사 문항 꼬리표가 무엇의 유사인지 안 보임, 목표 없이 연 센터에 다시 채우기 단추가 생김, 다시 채우기가 옛 선택으로 계산함.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const clinicSrc = fs.readFileSync(path.join(root, 'apmath/js/clinic-print.js'), 'utf8');
const engineHtml = fs.readFileSync(path.join(root, 'apmath/wrong_print_engine.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8');
const ExamDisplayTitle = require(path.join(root, 'archive/exam-display-title.js'));

const CODE = '24_강남여고_1학기_중간_고1_기출';
const KOREAN = '2024 강남여고 고1 1학기 중간';

// ---------- 인쇄 엔진: 꼬리표 ----------
function loadEngineLabels(displayTitle) {
  const start = engineHtml.indexOf('// 보이는 시험 이름:');
  const end = engineHtml.indexOf('function getGradePrintLabel');
  assert.ok(start > 0 && end > start, '엔진에서 꼬리표 함수 구간을 찾는다');
  const context = { window: displayTitle === undefined ? {} : { ExamDisplayTitle: displayTitle } };
  vm.createContext(context);
  vm.runInContext(`${engineHtml.slice(start, end)}\nthis.out = { readableExamLabel, wrongNoteLabel, getStudentExamLabel };`, context);
  return context.out;
}

test('꼬리표: 코드형 시험 이름은 한글 제목, "기출c"는 "기출", 원본 번호는 그대로', () => {
  const e = loadEngineLabels(ExamDisplayTitle);
  assert.equal(e.wrongNoteLabel({ examTitle: CODE, questionNo: 1 }), `${KOREAN} · 원본 1번`);
  assert.equal(e.wrongNoteLabel({ examTitle: '24_강남여고_1학기_중간_고1_기출c', questionNo: 2 }), `${KOREAN} · 원본 2번`, '"기출c" 꼬리는 과목이 아니라 자료 표시');
  assert.equal(e.wrongNoteLabel({ examTitle: '24_강남여고_1학기_중간_고1_수학I_기출c', questionNo: 4 }), `${KOREAN} · 수학I · 원본 4번`);
  assert.equal(e.wrongNoteLabel({ examTitle: '자체 기출c 모음', questionNo: 6 }), '자체 기출 모음 · 원본 6번', '해석 못 하는 이름의 "기출c"도 "기출"로 보인다');
});

test('꼬리표: 사람이 쓴 이름은 원문 그대로, 비어 있으면 "시험", 스크립트가 없어도 깨지지 않는다', () => {
  const e = loadEngineLabels(ExamDisplayTitle);
  assert.equal(e.wrongNoteLabel({ examTitle: '3월 쪽지시험', questionNo: 3 }), '3월 쪽지시험 · 원본 3번');
  assert.equal(e.wrongNoteLabel({ examTitle: 'custom-pack', questionNo: 3 }), '시험지 · 원본 3번', '내부 키처럼 생겼는데 못 푸는 이름은 main(#2702) displayTitleOf의 중립 제목');
  assert.equal(e.wrongNoteLabel({ examTitle: '', questionNo: 5 }), '시험 · 원본 5번');
  assert.equal(e.wrongNoteLabel({ questionNo: 5 }), '시험 · 원본 5번');
  const none = loadEngineLabels(undefined);
  assert.equal(none.wrongNoteLabel({ examTitle: CODE, questionNo: 1 }), `${CODE} · 원본 1번`, '스크립트가 없으면 원문 그대로');
  const broken = loadEngineLabels({ readableExamTitle() { throw new Error('x'); } });
  assert.equal(broken.wrongNoteLabel({ examTitle: CODE, questionNo: 1 }), `${CODE} · 원본 1번`, '변환 오류도 원문 그대로');
});

test('꼬리표: 보이는 제목 한 벌(displayTitleOf)이 있으면 그것을 우선한다', () => {
  const e = loadEngineLabels({ ...ExamDisplayTitle, displayTitleOf: (raw, opts) => (raw === 'x_key' ? 'X 제목' : (opts && opts.fallback)) });
  assert.equal(e.readableExamLabel('x_key'), 'X 제목');
  assert.equal(e.readableExamLabel(CODE), CODE, 'displayTitleOf가 못 푼 값은 fallback(원문)');
});

test('꼬리표: 유사 추천 문항은 어느 오답의 유사인지 알면 "○○ 3번의 유사", 모르면 앞말을 지키고 시험 이름만 한글로', () => {
  const e = loadEngineLabels(ExamDisplayTitle);
  assert.equal(e.wrongNoteLabel({ examTitle: `유사 추천 · ${CODE}_유사`, questionNo: 7, similarOf: { examTitle: CODE, questionNo: 3 } }), `${KOREAN} 3번의 유사`);
  assert.equal(e.wrongNoteLabel({ examTitle: `유사 추천 · ${CODE}`, questionNo: 7 }), `유사 추천 · ${KOREAN} · 원본 7번`);
  assert.equal(e.wrongNoteLabel({ examTitle: `다른 유사문항 · ${CODE}`, questionNo: 7 }), `다른 유사문항 · ${KOREAN} · 원본 7번`);
  assert.equal(e.wrongNoteLabel({ examTitle: `같은 UID 재연습 · ${CODE}`, questionNo: 7 }), `같은 UID 재연습 · ${KOREAN} · 원본 7번`);
  assert.equal(e.wrongNoteLabel({ examTitle: '유사 추천 · 자유 이름', questionNo: 7 }), '유사 추천 · 자유 이름 · 원본 7번');
});

test('꼬리표: 학생 머리말의 시험 이름도 한글 제목이고, 시험이 여럿이면 기존 대체 제목', () => {
  const e = loadEngineLabels(ExamDisplayTitle);
  assert.equal(e.getStudentExamLabel({ printTitle: 'P' }, { wrongItems: [{ examTitle: CODE }, { examTitle: CODE }] }), KOREAN);
  assert.equal(e.getStudentExamLabel({ printTitle: 'P' }, { wrongItems: [{ examTitle: CODE }, { examTitle: '다른 시험' }] }), 'P');
});

test('엔진 소스: 꼬리표 세 곳(시험지·해설지·복습지)이 모두 같은 함수를 거치고, 저장·요청 값은 그대로다', () => {
  assert.equal(engineHtml.split('_wrongNote: wrongNoteLabel(item),').length - 1, 3);
  assert.ok(!/_wrongNote: `\$\{item\.examTitle/.test(engineHtml), '시험 이름을 날것으로 찍는 꼬리표가 남지 않는다');
  assert.match(engineHtml, /_examLabel: item\.examTitle \|\| ''/, '문항 복원 값은 원문 그대로');
  assert.match(engineHtml, /row\.push\(includeExamTitle \? String\(item\?\.examTitle \|\| ''\) : ''\)/, 'QR에 담는 값도 원문');
  const tag = /exam-display-title\.js\?v=([^"]+)"/.exec(engineHtml);
  assert.ok(tag, '엔진이 한글 제목 스크립트를 불러온다');
  assert.ok(engineHtml.indexOf('exam-display-title.js') < engineHtml.indexOf('getElementById'), '스크립트 태그는 본문 코드보다 앞');
  assert.ok(clinicSrc.includes(`exam-display-title.js?v=${tag[1]}`), '같은 파일은 같은 ?v=로 부른다');
});

// ---------- clinic-print.js ----------
function loadClinicPrint(extra = {}) {
  const context = {
    window: { addEventListener() {}, ...extra.window },
    document: extra.document || { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
    state: { db: {} }, localStorage: { getItem() { return null; }, setItem() {} }, URL, URLSearchParams, console,
    toast: (...args) => { (extra.toasts || []).push(args); },
    setTimeout, clearTimeout,
  };
  vm.createContext(context);
  vm.runInContext(clinicSrc, context);
  return context;
}

test('유사 꼬리표 자료: 기준 문항 UID가 그 학생의 틀린 문항이면 "시험·번호"를 원문으로 담고, 못 찾으면 null', () => {
  const c = loadClinicPrint();
  const base = [{ sourceQuestionUid: 'u-a', examTitle: CODE, questionNo: 3 }, { sourceQuestionUid: 'u-b', examTitle: CODE, questionNo: 8 }];
  assert.deepEqual(JSON.parse(JSON.stringify(c.clinicPrintFindSimilarBase({ recommendationReason: { baseQuestionUid: 'u-b' } }, base))), { examTitle: CODE, questionNo: 8 });
  assert.equal(c.clinicPrintFindSimilarBase({ recommendationReason: { baseQuestionUid: 'zzz' } }, base), null);
  assert.equal(c.clinicPrintFindSimilarBase({ recommendationReason: {} }, base), null, '기준 UID가 없는 추천(경로 기준)은 null');
  assert.equal(c.clinicPrintFindSimilarBase({ recommendationReason: { baseQuestionUid: 'u-a' } }, [{ sourceQuestionUid: 'u-a', examTitle: CODE }]), null, '번호가 없으면 null');
});

test('유사 추천 인쇄 항목: similarOf만 새로 얻고 examTitle(저장·요청 값)은 기존 문구 그대로', () => {
  const c = loadClinicPrint();
  vm.runInContext(`clinicPrintRecommendationState.verifiedByKey = new Map([[clinicPrintRecommendationKey('s1','uid-x'), { status: 'VERIFIED', record: { sourceFile: 'exams/${CODE}_유사.js', sourceQuestionNo: 4, sourceOrdinal: 4, questionUid: 'uid-x' } }]]);`, c);
  const candidate = { sourceQuestionUid: 'uid-x', recommendationReason: { basis: 'wrong_type', baseQuestionUid: 'u-a' } };
  const withBase = c.clinicPrintBuildRecommendationPrintItem('s1', candidate, [{ sourceQuestionUid: 'u-a', examTitle: CODE, questionNo: 3 }]);
  assert.equal(withBase.examTitle, `유사 추천 · ${CODE}_유사`, '저장값은 바뀌지 않는다');
  assert.deepEqual(JSON.parse(JSON.stringify(withBase.similarOf)), { examTitle: CODE, questionNo: 3 });
  const without = c.clinicPrintBuildRecommendationPrintItem('s1', candidate);
  assert.ok(without && !('similarOf' in without), '기준을 모르면 similarOf 없음(기존 모양 그대로)');
});

// ---------- 유사 다시 채우기 ----------
function refillApp({ checkedExams, checkedStudents, mode = 'student', wrongByExamKey }) {
  const notes = [];
  const loadCalls = [];
  const noteEl = { textContent: '', hidden: true };
  const button = { disabled: false };
  const sel = { exams: checkedExams, students: checkedStudents, mode };
  const document = {
    getElementById(id) { return id === 'clinic-print-auto-note' ? noteEl : id === 'clinic-print-refill-btn' ? button : null; },
    querySelector(selector) { return selector.includes('clinic-print-mode') ? { value: sel.mode } : null; },
    querySelectorAll() { return []; },
  };
  const c = loadClinicPrint({ document });
  Object.assign(c, { sel, notes, loadCalls, noteEl, button });
  c.__wrongByExamKey = wrongByExamKey;
  vm.runInContext(`
    clinicPrintActiveClassId = 'c1';
    clinicPrintGetCheckedValues = name => (name === 'clinic-print-exam' ? this.sel.exams : name === 'clinic-print-student' ? this.sel.students : []).slice();
    clinicPrintBuildStudentWrongItems = (classId, examKeys, studentIds) => studentIds.map(studentId => ({ studentId, wrongItems: Array.from({ length: examKeys.reduce((sum, key) => sum + (this.__wrongByExamKey[key]?.[studentId] || 0), 0) }, (_, i) => ({ i })) }));
    clinicPrintLoadRecommendations = async (classId, opts) => { this.loadCalls.push({ classId, perStudent: opts.perStudent, targetCount: opts.targetCount, exams: this.sel.exams.slice(), statusBefore: clinicPrintRecommendationState.status }); clinicPrintRecommendationState.status = 'empty'; };
    clinicPrintRenderRecommendationPanel = () => {};
    clinicPrintSchedulePreviewPush = () => {};
  `, c);
  c.self = c;
  return c;
}

test('유사 다시 채우기: 시험을 하나 더 체크한 뒤 누르면 지금 선택 기준으로 학생별 부족 문항 수를 다시 계산한다', async () => {
  const c = refillApp({ checkedExams: ['e1'], checkedStudents: ['a', 'b', 'c'], wrongByExamKey: { e1: { a: 6, b: 3 }, e2: { a: 3, b: 2, c: 2 } } });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, c);
  // 처음(시험 1개): a 6, b 3, c 0
  await c.clinicPrintRefillSimilar('c1');
  assert.deepEqual(JSON.parse(JSON.stringify(c.loadCalls[0].perStudent)), [{ studentId: 'a', need: 14 }, { studentId: 'b', need: 17 }]);
  // 시험 하나 더 체크 -> 다시 채우기: a 9, b 5, c 2
  c.sel.exams = ['e1', 'e2'];
  await c.clinicPrintRefillSimilar('c1');
  assert.equal(c.loadCalls.length, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(c.loadCalls[1].perStudent)), [{ studentId: 'a', need: 11 }, { studentId: 'b', need: 15 }, { studentId: 'c', need: 18 }]);
  assert.equal(c.loadCalls[1].targetCount, 20);
  assert.deepEqual(c.loadCalls[1].exams, ['e1', 'e2']);
  assert.equal(c.loadCalls[1].statusBefore, 'idle', '옛 추천 결과는 비운 뒤 다시 돈다');
  assert.equal(c.button.disabled, false, '끝나면 단추가 다시 눌린다');
});

test('유사 다시 채우기: 목표 없이 연 센터(설정 없음)에서는 아무것도 하지 않고, 센터 HTML에도 단추가 없다', async () => {
  const c = refillApp({ checkedExams: ['e1'], checkedStudents: ['a'], wrongByExamKey: { e1: { a: 3 } } });
  await c.clinicPrintRefillSimilar('c1');
  assert.equal(c.loadCalls.length, 0);
  // 설정은 목표가 있을 때만 만들어지고, 단추도 같은 값 하나로만 그려진다.
  assert.match(clinicSrc, /clinicPrintAutoFill = autoTargetCount \? \{ classId: String\(classId\), targetCount: autoTargetCount, classBatch \} : null;/);
  assert.match(clinicSrc, /\$\{autoTargetCount \? `<div class="clinic-print-refill">[\s\S]*?유사 다시 채우기[\s\S]*?` : ''\}/);
  assert.equal((clinicSrc.match(/clinic-print-refill-btn" type="button"/g) || []).length, 1);
});

test('유사 다시 채우기: 학생이나 시험이 비었거나 출제 기준이 학생이 아니면 안내만 하고, 한 명 센터는 한 명일 때만 돈다', async () => {
  const none = refillApp({ checkedExams: ['e1'], checkedStudents: [], wrongByExamKey: { e1: {} } });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, none);
  await none.clinicPrintRefillSimilar('c1');
  assert.equal(none.loadCalls.length, 0);
  assert.match(none.noteEl.textContent, /학생을 한 명 이상/);
  const noExam = refillApp({ checkedExams: [], checkedStudents: ['a'], wrongByExamKey: {} });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, noExam);
  await noExam.clinicPrintRefillSimilar('c1');
  assert.match(noExam.noteEl.textContent, /시험을 하나 이상/);
  const typeMode = refillApp({ checkedExams: ['e1'], checkedStudents: ['a'], mode: 'class', wrongByExamKey: { e1: { a: 1 } } });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, typeMode);
  await typeMode.clinicPrintRefillSimilar('c1');
  assert.equal(typeMode.loadCalls.length, 0);
  const single = refillApp({ checkedExams: ['e1'], checkedStudents: ['a', 'b'], wrongByExamKey: { e1: { a: 1, b: 1 } } });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: false };`, single);
  await single.clinicPrintRefillSimilar('c1');
  assert.equal(single.loadCalls.length, 0);
  assert.match(single.noteEl.textContent, /한 명만/);
});

test('유사 다시 채우기: 다른 반이면 돌지 않는다, 실행 중에 또 눌러도 한 번만 돈다', async () => {
  const c = refillApp({ checkedExams: ['e1'], checkedStudents: ['a'], wrongByExamKey: { e1: { a: 2 } } });
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, c);
  await c.clinicPrintRefillSimilar('c2');
  assert.equal(c.loadCalls.length, 0);
  await Promise.all([c.clinicPrintRefillSimilar('c1'), c.clinicPrintRefillSimilar('c1')]);
  assert.equal(c.loadCalls.length, 1);
});

test('선택을 바꾸면 목표를 골라 연 센터에만 "다시 채우세요" 안내가 뜬다', () => {
  const c = refillApp({ checkedExams: ['e1'], checkedStudents: ['a'], wrongByExamKey: {} });
  c.clinicPrintNoteAutoFillStale('c1');
  assert.equal(c.noteEl.textContent, '', '목표 없이 연 센터는 안내 없음');
  vm.runInContext(`clinicPrintAutoFill = { classId: 'c1', targetCount: 20, classBatch: true };`, c);
  c.clinicPrintNoteAutoFillStale('c1');
  assert.match(c.noteEl.textContent, /유사 다시 채우기/);
  assert.equal(c.noteEl.hidden, false);
  assert.match(clinicSrc, /function clinicPrintOnExamChange\(classId\) \{\s*clinicPrintInvalidateRecommendations\(classId\);\s*clinicPrintNoteAutoFillStale\(classId\);/);
  assert.match(clinicSrc, /function clinicPrintOnRecipientChange\(classId\) \{\s*clinicPrintInvalidateRecommendations\(classId\);\s*clinicPrintNoteAutoFillStale\(classId\);/);
});

// ---------- 반 단위 여러 시험 ----------
test('반 단위 여러 시험: openClinicForClassExams는 시험 3개와 목표 20을 한 번에 센터로 넘긴다(반 전체·틀린 유형 기준)', () => {
  const calls = [];
  const c = loadClinicPrint();
  c.openClinicPrintCenter = (classId, options) => { calls.push({ classId, options }); return true; };
  const exams = [1, 2, 3].map(n => ({ sessionId: `s${n}`, examDate: `2026-11-0${n}`, examTitle: `${CODE}_${n}`, archiveFile: `exams/${n}.js`, questionCount: 20 }));
  c.openClinicForClassExams('c1', exams, { targetCount: 20 });
  const o = JSON.parse(JSON.stringify(calls[0].options));
  assert.equal(calls[0].classId, 'c1');
  assert.equal(o.preselect.studentId, '');
  assert.equal(o.preselect.examKeys.length, 3);
  assert.deepEqual(o.preselect.sessionIds, ['s1', 's2', 's3']);
  assert.equal(o.recommendation.targetCount, 20);
  assert.equal(o.recommendation.classBatch, true);
  assert.equal(o.recommendation.selectionBasis, 'wrong_type');
  assert.equal(c.openClinicForClassExams('c1', [], {}), false, '시험이 없으면 열지 않는다');
});

test('고친 파일의 ?v=는 apmath/index.html에서 새 값이다', () => {
  assert.match(indexHtml, /js\/clinic-print\.js\?v=20261123-clinic-polish-1/);
});
