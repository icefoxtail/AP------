const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const utilPath = path.join(root, 'eie/js/utils/eie-grade-utils.js');
assert(fs.existsSync(utilPath), 'grade utility file should exist');

const code = fs.readFileSync(utilPath, 'utf8');
const context = { window: {} };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context, { filename: 'eie-grade-utils.js' });

assert(context.EieGradeUtils, 'EieGradeUtils should be exposed on window');

const normalize = context.EieGradeUtils.normalizeEieGrade;

[
  ['초1', '초1'],
  ['초 4', '초4'],
  ['초등학교6학년', '초6'],
  ['중1', '중1'],
  ['중 1', '중1'],
  ['중학교1학년', '중1'],
  ['중등1', '중1'],
  ['중등1학년', '중1'],
  ['중학교2', '중2'],
  ['중등2학년', '중2'],
  ['중학교3학년', '중3'],
  ['고 1', '고1'],
  ['고등학교1학년', '고1'],
  ['고등2', '고2'],
  ['고등학교2학년', '고2'],
  ['고등학교3', '고3']
].forEach(([input, expected]) => {
  assert.strictEqual(normalize(input), expected, `${input} should normalize to ${expected}`);
});

['', null, undefined, 'fp3', '영어', '학년'].forEach(value => {
  assert.strictEqual(normalize(value), '', `${value} should not become a fake grade`);
});

assert.strictEqual(context.EieGradeUtils.gradeBand('초4'), 'elementary');
assert.strictEqual(context.EieGradeUtils.gradeBand('중1'), 'middle');
assert.strictEqual(context.EieGradeUtils.gradeBand('고2'), 'high');
assert.strictEqual(context.EieGradeUtils.gradeBand('fp3'), '');

const ledger = fs.readFileSync(path.join(root, 'eie/js/views/eie-grade-ledger.js'), 'utf8');
assert(!ledger.includes("['중1', '중2', '중3', '학년']"), 'school ledger should not group unknown grades under literal 학년');
assert(!ledger.includes("return value || '학년'"), 'school ledger should not display fallback 학년 as a student grade');

const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const utilLoadIndex = index.indexOf('js/utils/eie-grade-utils.js');
assert(utilLoadIndex > 0, 'index should load EIE grade utility');
['js/views/eie-students.js', 'js/views/eie-classroom.js', 'js/views/eie-timetable.js', 'js/views/eie-attendance.js', 'js/views/eie-grade-ledger.js'].forEach(script => {
  assert(utilLoadIndex < index.indexOf(script), `grade utility should load before ${script}`);
});

const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
assert(
  students.includes("var STUDENT_GRADE_OPTIONS = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3']") &&
    students.includes('STUDENT_GRADE_OPTIONS.map(function (grade)'),
  'student detail edit grade select should expose 초1 through 고3'
);

const timetable = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
assert(timetable.includes("'초1', '초2', '초3', '초4', '초5', '초6'"), 'timetable grade select may expose elementary grades in the current EIE scope');
assert(timetable.includes("normalizeGrade(studentFieldValue('eie-v2-edit-grade'))"), 'timetable student payloads should normalize grade before save');

const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
assert(worker.includes('function normalizeEieGrade'), 'worker should normalize EIE student grade writes');
assert(worker.includes("초6: '초6'"), 'worker should accept elementary grade writes');
assert(worker.includes('normalizeEieGrade(body.grade || body.grade_raw)'), 'worker update should normalize grade payloads');

console.log('EIE grade normalization test passed');
