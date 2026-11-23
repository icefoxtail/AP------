'use strict';
// 학생 상세(성적 탭)의 시험 한 건 옆 "오답 클리닉" 입구. 원내평가 결과 화면(#2697)과 같은 기존 함수 openClinicForStudentExam을 그대로 부른다.
// 결함 조건: 새 클리닉 화면·함수가 생기지 않았는지, 오답이 없는 시험·편집 권한이 없는 학생에게 단추가 안 붙는지, 반을 못 찾으면 조용히 실패하지 않고 안내하는지.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const student = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8');

function sliceFunction(source, header) {
  const start = source.indexOf(header);
  assert.notEqual(start, -1, `${header} exists`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`${header} not closed`);
}

function harness({ sessions, currentClass = null, hasOpener = true }) {
  const calls = { clinic: [], toasts: [] };
  const sandbox = {
    String,
    toast: (message, type) => calls.toasts.push([message, type]),
    getStudentAcademyExamSessionsForDetail: () => sessions,
    getApStudentCurrentClass: () => currentClass,
  };
  if (hasOpener) sandbox.openClinicForStudentExam = (classId, studentId, exam) => { calls.clinic.push([classId, studentId, exam]); return true; };
  vm.createContext(sandbox);
  vm.runInContext(sliceFunction(student, 'function openStudentExamClinicFromDetail(sid, sessionId)'), sandbox);
  return { sandbox, calls };
}

const session = { id: 's1', class_id: 'c1', exam_date: '2026-11-01', exam_title: '단원평가 3회', archive_file: 'exams/a.js', question_count: 20 };

test('시험 한 건의 값으로 기존 openClinicForStudentExam을 그대로 부른다', () => {
  const h = harness({ sessions: [session] });
  h.sandbox.openStudentExamClinicFromDetail('stu1', 's1');
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls.clinic)), [['c1', 'stu1', { sessionId: 's1', examDate: '2026-11-01', examTitle: '단원평가 3회', archiveFile: 'exams/a.js', questionCount: 20 }]]);
  assert.deepEqual(h.calls.toasts, []);
});

test('응시 기록에 반이 없으면 학생의 현재 반으로 연다', () => {
  const h = harness({ sessions: [{ ...session, class_id: '' }], currentClass: { id: 'c9' } });
  h.sandbox.openStudentExamClinicFromDetail('stu1', 's1');
  assert.equal(h.calls.clinic[0][0], 'c9');
});

test('반이나 기록을 못 찾으면 열지 않고 안내한다', () => {
  for (const options of [{ sessions: [{ ...session, class_id: '' }] }, { sessions: [] }, { sessions: [session], hasOpener: false }]) {
    const h = harness(options);
    h.sandbox.openStudentExamClinicFromDetail('stu1', 's1');
    assert.deepEqual(h.calls.clinic, []);
    assert.equal(h.calls.toasts.length, 1);
  }
});

test('단추는 편집 권한이 있고 틀린 문항이 있는 시험에만 붙으며, 새 클리닉 함수는 없다', () => {
  assert.match(student, /\$\{canEdit && wrongRows\.length && typeof openClinicForStudentExam === 'function' \? `<button[^`]*openStudentExamClinicFromDetail\([^`]*>오답 클리닉<\/button>`/);
  assert.equal((student.match(/openClinicForStudentExam\(/g) || []).length, 1, '기존 함수를 부르는 곳은 이 입구 하나');
  assert.ok(!/function openStudentClinic|function studentOpenClinic/.test(student));
});

test('고친 student.js의 ?v=는 apmath/index.html에서 새 값이다', () => {
  assert.match(indexHtml, /js\/student\.js\?v=20261123-exam-clinic-pick-2/);
});

// ---------- 시험 여러 개 선택 -> 오답 클리닉 한 번에 ----------
function multiHarness({ sessions, wrongs, currentClass = null, hasOpener = true, checked = [], target = '0' }) {
  const calls = { clinic: [], toasts: [] };
  const sandbox = {
    String, Number, Math, Set, Map, Array,
    toast: (message, type) => calls.toasts.push([message, type]),
    state: { db: { wrong_answers: wrongs }, ui: {} },
    getStudentAcademyExamSessionsForDetail: () => sessions,
    getApStudentCurrentClass: () => currentClass,
    document: {
      querySelectorAll: () => checked.map((id) => ({ value: id })),
      getElementById: (id) => (id === 'student-exam-clinic-target' ? { value: target } : null),
    },
  };
  if (hasOpener) sandbox.openClinicForStudentExams = (classId, studentId, exams, options) => { calls.clinic.push([classId, studentId, exams, options]); return true; };
  vm.createContext(sandbox);
  for (const header of [
    'function getStudentWrongRowsForSession(sid, sessionId)',
    'function readStudentExamClinicPicks()',
    'function openStudentExamsClinicFromDetail(sid, sessionIds, target)',
  ]) vm.runInContext(sliceFunction(student, header), sandbox);
  return { sandbox, calls };
}

const mk = (id, date, classId = 'c1', file = `exams/${id}.js`) => ({ id, class_id: classId, exam_date: date, exam_title: `시험 ${id}`, archive_file: file, question_count: 20 });
const W = (sessionId, ...ids) => ids.map((question_id) => ({ session_id: sessionId, question_id }));
const THREE = [mk('s3', '2026-11-03'), mk('s1', '2026-10-01'), mk('s2', '2026-10-20'), mk('s0', '2026-09-01')];
const WRONGS = [...W('s1', 1, 2), ...W('s2', 3), ...W('s3', 4, 5, 6)];

test('여러 시험: 체크한 시험들이 날짜순으로 한 번에 넘어가고 한 번만 센다', () => {
  const h = multiHarness({ sessions: THREE, wrongs: WRONGS, checked: ['s3', 's1', 's2', 's1'] });
  h.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.equal(h.calls.clinic.length, 1);
  const [classId, studentId, exams, options] = h.calls.clinic[0];
  assert.equal(classId, 'c1');
  assert.equal(studentId, 'stu1');
  assert.deepEqual(Array.from(exams, (row) => row.sessionId), ['s1', 's2', 's3'], '날짜 오름차순, 같은 시험은 한 번');
  assert.deepEqual(JSON.parse(JSON.stringify(options)), {}, '목표를 안 골랐으면 추천 입력은 없다');
});

test('여러 시험: 목표 문항(20)을 고르면 틀린 문항을 뺀 수만큼 유사 추천 수를 넘기고, 틀린 문항이 목표 이상이어도 목표를 넘긴다', () => {
  const h = multiHarness({ sessions: THREE, wrongs: WRONGS, checked: ['s1', 's2', 's3'], target: '20' });
  h.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.equal(h.calls.clinic[0][3].recommendationCount, 14, '틀린 6개 + 유사 14개 = 20');
  assert.equal(h.calls.clinic[0][3].targetCount, 20, '센터가 열린 뒤 자동 추천에 쓸 목표');
  const over = multiHarness({ sessions: THREE, wrongs: WRONGS, checked: ['s1', 's2', 's3'], target: '5' });
  over.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.equal(over.calls.clinic[0][3].targetCount, 5, '틀린 문항이 목표 이상이어도 목표는 넘긴다(센터가 중복을 뺀 값으로 다시 판단)');
});

test('여러 시험: 선택이 0개이거나 틀린 문항이 없는 시험뿐이면 열지 않고 안내한다', () => {
  for (const checked of [[], ['s0'], ['nope']]) {
    const h = multiHarness({ sessions: THREE, wrongs: WRONGS, checked });
    h.sandbox.openStudentExamsClinicFromDetail('stu1');
    assert.deepEqual(h.calls.clinic, []);
    assert.equal(h.calls.toasts.length, 1);
  }
  const mixed = multiHarness({ sessions: THREE, wrongs: WRONGS, checked: ['s0', 's2'] });
  mixed.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.deepEqual(Array.from(mixed.calls.clinic[0][2], (row) => row.sessionId), ['s2'], '오답 없는 시험은 빠진다');
});

test('여러 시험: 시험이 여러 반에 걸치면 시험이 더 많은 반으로 열고, 반을 못 찾으면 안내한다', () => {
  const sessions = [mk('a', '2026-10-01', 'c1'), mk('b', '2026-10-02', 'c2'), mk('c', '2026-10-03', 'c2')];
  const wrongs = [...W('a', 1), ...W('b', 1), ...W('c', 1)];
  const h = multiHarness({ sessions, wrongs, checked: ['a', 'b', 'c'] });
  h.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.equal(h.calls.clinic[0][0], 'c2');
  const none = multiHarness({ sessions: [mk('a', '2026-10-01', '')], wrongs: W('a', 1), checked: ['a'] });
  none.sandbox.openStudentExamsClinicFromDetail('stu1');
  assert.deepEqual(none.calls.clinic, []);
  assert.equal(none.calls.toasts.length, 1);
});

test('성적 탭: 편집 권한이 있을 때만 시험 체크와 "선택한 시험으로 오답 클리닉" 단추가 있고, 오답 없는 시험은 체크할 수 없다', () => {
  assert.match(student, /const clinicPickable = canEdit && typeof openClinicForStudentExams === 'function';/);
  assert.match(student, /data-student-exam-pick[^`]*\$\{wrongRows\.length \? '' : 'disabled'\}/);
  assert.match(student, /id="student-exam-clinic-open"[^`]*disabled onclick="openStudentExamsClinicFromDetail\(/, '선택 0개일 때 처음엔 비활성');
  assert.match(student, /if \(button\) button\.disabled = !picks\.length;/);
  assert.match(student, /selectStudentExamClinicRecent\(3\)/);
  assert.equal((student.match(/openClinicForStudentExam\(/g) || []).length, 1, '한 건 입구는 그대로 하나');
  assert.ok(!/function openStudentClinic|function studentOpenClinic/.test(student));
});
