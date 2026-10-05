const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const editor = read('apmath', 'js', 'student-edit.js');
const studentsRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'students.js');
const examsRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'exams.js');
const migration = read('apmath', 'worker-backup', 'worker', 'migrations', '20260820_high_subject_exclusions.sql');

assert.match(editor, /수강하지 않는 과목/);
assert.match(editor, /체크 여부와 무관하게 반에 출제된 시험지는 모두 학생 포털에 표시됩니다/);
assert.match(editor, /repeat\(auto-fit, minmax\(96px, 1fr\)\)/);
assert.match(editor, /high_subject_exclusions: JSON\.stringify\(highSubjectExclusions\)/);
assert.match(studentsRoute, /defaultHighSubjects = isUpperHighGrade/);
assert.match(studentsRoute, /replace\(\/고등학교\/g, '고'\)/);
assert.match(studentsRoute, /isUpperHighGrade \? defaultHighSubjects/);
assert.match(studentsRoute, /highSubjectExclusions: normalizeHighSubjects/);
assert.match(studentsRoute, /high_subject_exclusions = \?/);
assert.doesNotMatch(examsRoute, /subject_mismatch/);
assert.match(migration, /ALTER TABLE students ADD COLUMN high_subject_exclusions/);
assert.match(migration, /DELETE FROM class_exam_assignment_exclusions/);

console.log('high-subject exclusion policy checks passed');
