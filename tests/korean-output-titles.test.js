'use strict';
// 출력물·화면에 보이는 제목은 어디서나 사람이 읽는 한글 제목이다(2026-11-23 원장님 지시).
// 내부 식별자(영문 snake_case 키, `.js`, `similar/` 경로, MIXED:·unitpast_ 스냅샷 키)가 제목 자리에 남지 않는다.
// 저장되는 값은 바꾸지 않는다: 여기서는 "보이는 문자열"을 만드는 함수만 검사한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const { displayTitleOf, titleWithMode, looksInternal } = require('../archive/exam-display-title.js');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function internalLeft(text) {
  return /_/.test(text) || /\.js\b/i.test(text) || /similar\//i.test(text) || /^MIXED:/i.test(text) || /unitpast_/i.test(text) || /[A-Za-z]+_[A-Za-z0-9]+/.test(text);
}

// 소스에서 함수 하나를 그대로 잘라 낸다(복사본이 아니라 현행 소스를 검사).
function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} 함수가 있어야 한다`);
  const lineStart = source.lastIndexOf('\n', start) + 1;
  const indent = source.slice(lineStart, start).match(/^\s*/)[0];
  const end = source.indexOf(`\n${indent}}\n`, start);
  assert.ok(end > start, `${name} 함수의 끝`);
  return source.slice(start, end + indent.length + 2);
}

function loadFunctions(source, names, globals = {}) {
  const context = vm.createContext({ ...globals });
  vm.runInContext(names.map(name => extractFunction(source, name)).join('\n') + `\nthis.__out = { ${names.join(', ')} };`, context);
  return context.__out;
}

test('내부 키 표본: 영문 키·경로·확장자·스냅샷 키가 한글 제목으로 풀리거나 중립 문구가 되고 내부 키가 남지 않는다', () => {
  const cases = [
    ['25_wangji_h1_2mid_math1', '2025 고1 2학기 중간'],
    ['25_yeonhyang_m3_final.js', '2025 중3 기말'],
    ['exams/similar/high/26_복성고_1학기_기말_고1_유사.js', '2026 복성고 고1 1학기 기말 · 유사'],
    ['similar/high/25_강남여고_1학기_기말_고1_유사2.js', '2025 강남여고 고1 1학기 기말 · 유사2'],
    ['exams/original/high/22_강남여고_1학기_중간_고1_기출.js', '2022 강남여고 고1 1학기 중간'],
    ['AP수학학원_1학기_기말_중1_모의고사_1회', 'AP수학학원 1학기 기말 중1 모의고사 1회'],
    ['MIXED:unitpast_h1-through-2final-v2_H22-C2-01_13074d02', '단원별 기출'],
    ['custom-pack', '시험지'],
    ['foo_bar', '시험지'],
  ];
  for (const [raw, expected] of cases) {
    const out = displayTitleOf(raw);
    assert.equal(out, expected, raw);
    assert.ok(!internalLeft(out), `${raw} -> ${out}: 내부 키가 남지 않는다`);
  }
});

test('이미 사람이 읽는 제목은 그대로다(선생님이 붙인 제목, 오답 제목, 단원 제목)', () => {
  for (const title of ['이시온 오답', '이시온 오답 · 2025 강남여고 고1 1학기 중간', '함수 · 문제지 3', '2025학년도 2학기 기말고사 순천여자고등학교 1학년 공통수학2', '명제 외 3단원 · 1~3단계 · 1권/4권']) {
    assert.equal(displayTitleOf(title), title);
    assert.equal(looksInternal(title), false, title);
  }
  assert.equal(displayTitleOf(''), '');
  assert.equal(displayTitleOf(null, { fallback: '시험지' }), '시험지');
});

test('못 푸는 키는 사람이 읽는 다른 제목(hint)이 있으면 그것을, 없으면 중립 문구를 쓴다', () => {
  assert.equal(displayTitleOf('MIXED:unitpast_h1_x_deadbeef', { hint: '원의 방정식 · 단원별 기출' }), '원의 방정식 · 단원별 기출');
  assert.equal(displayTitleOf('custom-pack', { hint: '중간 대비 1회' }), '중간 대비 1회');
  assert.equal(displayTitleOf('custom-pack', { hint: 'another_key' }), '시험지');
});

test('원본·유사·교재·유형 시험지 전체 파일 이름: 어느 것도 내부 키가 제목에 남지 않는다(결함 조건 검사)', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? (entry.name === 'test-fixtures' ? [] : walk(path.join(dir, entry.name)))
    : (entry.name.endsWith('.js') ? [path.join(dir, entry.name)] : []));
  const files = walk(path.join(root, 'archive', 'exams'));
  assert.ok(files.length > 0);
  const bad = [];
  for (const file of files) {
    const rel = path.relative(path.join(root, 'archive', 'exams'), file).split(path.sep).join('/');
    const out = displayTitleOf(`exams/${rel}`);
    if (!out || internalLeft(out)) bad.push(`${rel} -> ${out}`);
  }
  assert.deepEqual(bad.slice(0, 10), [], `내부 키가 남은 제목 ${bad.length}개`);
});

test('해설·정답 모드는 제목 뒤에 해설/정답이 붙고 시험지 모드는 제목 그대로다', () => {
  const title = '2025 왕지고 고1 2학기 중간';
  assert.equal(titleWithMode(title, 'exam'), title);
  assert.equal(titleWithMode(title, 'sol'), `${title} 해설`);
  assert.equal(titleWithMode(title, 'ans'), `${title} 정답`);
  assert.equal(titleWithMode('', 'sol'), '시험지 해설');
});

test('엔진 연결: 원본(engine)·화면 실행기·문제지(mixed)는 탭 제목(=PDF 기본 파일 이름)을 한글 제목+모드로 만든다', () => {
  const engine = read('archive/engine.html');
  const adapter = read('archive/screen-runtime-adapter.js');
  const mixed = read('archive/mixed_engine.html');
  assert.match(engine, /document\.title = window\.ExamDisplayTitle\?\.titleWithMode\?\.\(AppState\.displayTitle, AppState\.mode\)/);
  assert.match(adapter, /document\.title = window\.ExamDisplayTitle\?\.titleWithMode\?\.\(getDisplayTitle\(AppState\), ctx\.candidate\.mode\)/);
  assert.match(mixed, /function syncMixedDocumentTitle\(\)/);
  assert.match(mixed, /exam-display-title\.js/, 'mixed_engine이 공용 제목 함수를 불러온다');
  assert.doesNotMatch(mixed, /document\.getElementById\('ctrl-title'\)\.textContent = getIdentityTitle\(\)/, '머리글·제어줄은 식별값이 아니라 보이는 제목을 쓴다');
  // 식별값은 그대로: 저장·출제 요청이 쓰는 값은 getIdentityTitle이다.
  assert.match(mixed, /const examTitle = getIdentityTitle\(\);/);
});

test('apmath 목록·상태·OMR·클리닉: 파일 이름 키 대신 한글 제목을 보인다(공용 함수가 있을 때)', () => {
  const globals = { globalThis: { ExamDisplayTitle: require('../archive/exam-display-title.js') } };
  const planner = loadFunctions(read('apmath/js/classroom-planner.js'), ['getClassroomExamArchiveDisplayTitle'], globals);
  const status = loadFunctions(read('apmath/js/classroom.js'), ['getClassroomStatusArchiveDisplayTitle', 'getClassroomStatusExamDisplayTitle'], globals);
  const omr = loadFunctions(read('apmath/js/qr-omr.js'), ['getOmrArchiveDisplayTitle', 'getOmrExamDisplayTitle'], globals);
  const clinic = loadFunctions(read('apmath/js/clinic-print.js'), ['clinicPrintGetArchiveDisplayTitle'], globals);

  const file = 'exams/similar/high/26_복성고_1학기_기말_고1_유사.js';
  const expected = '2026 복성고 고1 1학기 기말 · 유사';
  assert.equal(planner.getClassroomExamArchiveDisplayTitle(file), expected);
  assert.equal(status.getClassroomStatusExamDisplayTitle({ archive_file: file }), expected);
  assert.equal(status.getClassroomStatusExamDisplayTitle({ exam_title: '25_yeonhyang_m3_final' }), '2025 중3 기말');
  assert.equal(status.getClassroomStatusExamDisplayTitle({ exam_title: '중간 대비 1회', archive_file: file }), '중간 대비 1회');
  assert.equal(omr.getOmrExamDisplayTitle({ archive_file: file }), expected);
  assert.equal(clinic.clinicPrintGetArchiveDisplayTitle(file), expected);
  assert.equal(planner.getClassroomExamArchiveDisplayTitle('MIXED:custom-pack.js', '원의 방정식 모음'), '원의 방정식 모음');
  assert.equal(status.getClassroomStatusArchiveDisplayTitle('MIXED:unitpast_h1-through-2final-v1_H22-C2-01_567d1aab'), '단원별 기출');
  // 공용 함수가 없으면(옛 화면) 예전처럼 이름 그대로: 화면이 깨지지 않는다.
  const bare = loadFunctions(read('apmath/js/classroom.js'), ['getClassroomStatusArchiveDisplayTitle'], { globalThis: {} });
  assert.equal(bare.getClassroomStatusArchiveDisplayTitle(file), '26_복성고_1학기_기말_고1_유사');
});

test('오답 출력: 한 명이면 "이시온 오답 · 시험 제목", 여러 명이면 "반 이름 오답", 선생님이 고친 제목은 그대로, 해설·정답 꼬리', () => {
  const source = read('apmath/wrong_print_engine.html');
  const state = { payload: null, mode: 'exam' };
  const fns = loadFunctions(source, ['readableExamLabel', 'getWrongDocumentTitle', 'isAutoWrongHeaderTitle', 'getRenderHeaderTitle', 'getPrintHeaderOptions', 'shouldApplyPrintHeader'], {
    window: { ExamDisplayTitle: require('../archive/exam-display-title.js') },
    state,
    normalizePrintHeaderOptions: opts => opts || {},
  });
  const one = {
    mode: 'student', className: '중3 월수', printTitle: '중3 월수 오답 클리닉', headerOptions: { title: '중3 월수 학생별 오답 클리닉', applyToSolution: true, applyToAnswer: true },
    students: [{ studentName: '이시온', wrongItems: [{ examTitle: '25_연향중_1학기_기말_중3_수학' }, { examTitle: '25_연향중_1학기_기말_중3_수학' }] }],
  };
  assert.equal(fns.getWrongDocumentTitle(one, 'exam'), '이시온 오답 · 2025 연향중 중3 1학기 기말 · 수학');
  assert.equal(fns.getWrongDocumentTitle(one, 'sol'), '이시온 오답 · 2025 연향중 중3 1학기 기말 · 수학 해설');
  assert.equal(fns.getWrongDocumentTitle(one, 'ans'), '이시온 오답 · 2025 연향중 중3 1학기 기말 · 수학 정답');
  const many = { ...one, students: [one.students[0], { studentName: '김하늘', wrongItems: [] }] };
  assert.equal(fns.getWrongDocumentTitle(many, 'exam'), '중3 월수 오답');
  const edited = { ...one, headerOptions: { title: '기말 대비 오답 모음' } };
  assert.equal(fns.getWrongDocumentTitle(edited, 'exam'), '기말 대비 오답 모음');
  // 시험지 머리글: 자동 기본 제목이면 학생 이름 제목, 고친 제목이면 그대로
  state.payload = one;
  assert.equal(fns.getRenderHeaderTitle('exam', '이시온 오답'), '이시온 오답');
  state.payload = edited;
  assert.equal(fns.getRenderHeaderTitle('exam', '이시온 오답'), '기말 대비 오답 모음');
  for (const text of [fns.getWrongDocumentTitle(one, 'exam'), fns.getWrongDocumentTitle(many, 'exam')]) assert.ok(!internalLeft(text), text);
});

test('학생 포털·출제 내역: 저장된 exam_title이 내부 키여도 한글로 보이고 저장값은 바꾸지 않는다', () => {
  const student = read('apmath/student/index.html');
  const fn = loadFunctions(student, ['studentExamTitle'], { window: { ExamDisplayTitle: require('../archive/exam-display-title.js') } });
  assert.equal(fn.studentExamTitle({ exam_title: '26_복성고_1학기_기말_고1_유사' }, '시험지'), '2026 복성고 고1 1학기 기말 · 유사');
  assert.equal(fn.studentExamTitle({ exam_title: '중간 대비 1회' }, '시험지'), '중간 대비 1회');
  assert.equal(fn.studentExamTitle({}, '시험지'), '시험지');
  assert.doesNotMatch(student, /escapeHtml\(exam\.exam_title/, '학생 화면은 exam_title을 그대로 찍지 않는다');
  assert.match(student, /exam-display-title\.js/);
  const recent = read('archive/archive2-workspace-recent.js');
  assert.match(recent, /esc\(shownTitle\(a\.title\)\)/);
  assert.match(read('apmath/index.html'), /exam-display-title\.js/, '선생님 앱이 공용 제목 함수를 불러온다');
});
