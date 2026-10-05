const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'migrations', '20260820_remove_subject_mismatch_filter.sql'), 'utf8');
const editor = fs.readFileSync(path.join(root, 'apmath', 'js', 'student-edit.js'), 'utf8');

assert.doesNotMatch(examsRoute, /await refreshSubjectMismatchExclusions\(env, assignment\)/);
assert.match(migration, /DELETE FROM class_exam_assignment_exclusions/);
assert.match(migration, /reason = 'subject_mismatch'/);
assert.match(editor, /체크 여부와 무관하게 반에 출제된 시험지는 모두 학생 포털에 표시됩니다/);

console.log('subject-independent student visibility checks passed');
