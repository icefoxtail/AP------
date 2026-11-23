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
  // 식별값(getIdentityTitle)은 그대로 두고 저장 요청의 시험 이름만 표시 제목을 쓴다(아래 "새로 저장되는 시험 이름" 참고).
  assert.match(mixed, /function getIdentityTitle\(\)/);
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

// ---- 후속(Worker 번들): 유사 이름 규칙 통일, 서버 PDF 파일 이름 ----
test('유사 시험지 이름은 "… · 유사"/"… · 유사2" 한 규칙이다: 카탈로그 displayTitle과 파일 이름 읽기가 같은 꼬리를 만든다', () => {
  const output = require('../archive/archive2-output.js');
  const base = { year: '25', school: '강남여고', grade: '고1', semester: '1', examType: 'final', contentType: '기출유사' };
  const numbered = output.displayTitle({ ...base, file: 'similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js' });
  const single = output.displayTitle({ ...base, file: 'similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사.js' });
  assert.equal(numbered, '2025 강남여고 고1 1학기 기말고사 · 유사2');
  assert.equal(single, '2025 강남여고 고1 1학기 기말고사 · 유사');
  for (const title of [numbered, single]) assert.doesNotMatch(title, /유사문제|유사 \d/);
  // 원본 기출은 꼬리가 없다.
  assert.equal(output.displayTitle({ ...base, contentType: '기출', file: 'original/high/h1/1final/25_강남여고_1학기_기말_고1_기출.js' }), '2025 강남여고 고1 1학기 기말고사');
  // 단원평가 유사 세트도 같은 꼬리
  assert.match(output.displayTitle({ contentType: '단원평가', grade: '고1', semester: '1', topic: '함수', file: 'x/함수_유사1.js' }), /단원평가 · 유사1$/);
  // 파일 이름 쪽 규칙(readableExamTitle)과 꼬리가 같다
  assert.match(displayTitleOf('exams/similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js'), / · 유사2$/);
  assert.match(displayTitleOf('exams/similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사.js'), / · 유사$/);
});

test('서버 PDF 파일 이름: 저장된 exam_title이 키면 한글 제목으로 풀고, 쓸 수 없는 문자는 바꾸며, filename*는 한글·특수문자를 RFC 5987로 인코딩한다', () => {
  const source = read('apmath/worker-backup/worker/routes/exam-pdf.js');
  const fns = loadFunctions(source, ['cleanText', 'readableDownloadTitle', 'encodeContentDispositionName', 'safeDownloadName'], { examDisplayTitle: require('../archive/exam-display-title.js') });
  const name = row => fns.safeDownloadName(row);
  assert.equal(name({ exam_title: '25_연향중_1학기_기말_중3_수학', exam_date: '2026-11-23' }), '2026-11-23_2025 연향중 중3 1학기 기말 · 수학.pdf');
  assert.equal(name({ exam_title: '25_wangji_h1_2mid_math1', exam_date: '2026-11-23' }), '2026-11-23_2025 고1 2학기 중간.pdf');
  assert.equal(name({ exam_title: 'unitpast_h1-through-2final-v2_H22-C2-01_13074d02', archive_file: 'MIXED:unitpast_h1-through-2final-v2_H22-C2-01_13074d02' }), '단원별 기출.pdf');
  // 키를 못 풀면 archive_file에서 읽을 수 있는 이름
  assert.equal(name({ exam_title: 'foo_bar', archive_file: 'exams/similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js' }), '2025 강남여고 고1 1학기 기말 · 유사2.pdf');
  assert.equal(name({ exam_title: '', archive_file: 'exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js' }), '2025 강남여고 고1 1학기 중간.pdf');
  // 사람이 읽는 제목은 그대로, 파일 이름에 못 쓰는 문자는 _로
  assert.equal(name({ exam_title: '중간 대비: 1회/2회?', exam_date: '2026-11-23' }), '2026-11-23_중간 대비_ 1회_2회_.pdf');
  assert.equal(name({}), '시험지.pdf');
  for (const row of [{ exam_title: '25_연향중_1학기_기말_중3_수학' }, { exam_title: 'foo_bar' }]) assert.doesNotMatch(name(row), /[A-Za-z]+_[A-Za-z0-9]+|\.js/);
  const encoded = fns.encodeContentDispositionName("2026-11-23_이시온 (오답)'s *1회.pdf");
  assert.doesNotMatch(encoded, /['()*]/);
  assert.equal(decodeURIComponent(encoded), "2026-11-23_이시온 (오답)'s *1회.pdf");
  assert.match(source, /filename\*=UTF-8''\$\{encodeContentDispositionName\(filename\)\}/);
  assert.match(source, /import examDisplayTitle from '\.\.\/\.\.\/\.\.\/\.\.\/archive\/exam-display-title\.js'/, 'Worker 번들에 공용 제목 함수를 쓴다');
  assert.ok(read('tools/ci/apms-worker-bundle-paths.txt').split('\n').includes('archive/exam-display-title.js'), '번들 경로 목록에 올라 있다');
});

test('보이는 제목이 저장·비교 값에 들어가지 않는다: Worker는 displayTitle을 부르지 않고, 저장된 snapshot은 저장된 제목으로 검증한다', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? (entry.name === 'node_modules' ? [] : walk(path.join(dir, entry.name)))
    : (entry.name.endsWith('.js') ? [path.join(dir, entry.name)] : []));
  const users = walk(path.join(root, 'apmath/worker-backup/worker')).filter(file => /\bdisplayTitle\b/.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(users.map(file => path.relative(root, file).split(path.sep).join('/')), []);
  const saved = read('apmath/worker-backup/worker/helpers/archive-saved-papers.js');
  assert.match(saved, /String\(snapshot\.meta\.title \|\| ""\) !== String\(row\.title \|\| ""\)/, '검증은 저장된 행의 제목과 snapshot의 제목을 비교한다');
});

test('새로 저장되는 시험 이름: 출제 경로마다 한글 표시 제목을 쓴다(키 저장 경로 없음)', () => {
  const engine = read('archive/engine.html');
  const mixed = read('archive/mixed_engine.html');
  assert.match(engine, /const examTitle = getDisplayTitle\(AppState\) \|\| '시험지';/);
  assert.match(mixed, /const examTitle = getDisplayTitle\(\);/);
  assert.doesNotMatch(engine + mixed, /exam_title: getIdentityTitle/);
  const assign = read('archive/archive2-assign.js');
  assert.match(assign, /exam_title: settings\.header\.title,/, '유사·원본 출제: 머리글 제목(= 카탈로그 한글 제목)');
  assert.match(assign, /exam_title: paper\.identityTitle \|\| paper\.title,/, '단원별 기출: 권 제목(한글)');
});
