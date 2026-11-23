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
  assert.match(indexHtml, /js\/student\.js\?v=20261123-student-exam-clinic-1/);
});
