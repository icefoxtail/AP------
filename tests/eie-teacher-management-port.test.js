const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'eie/js/eie-api.js'), 'utf8');
const view = fs.readFileSync(path.join(root, 'eie/js/views/eie-management.js'), 'utf8');

assert(worker.includes('async function handleGetTeachers'), 'EIE worker should expose teacher list handler');
assert(worker.includes('async function handlePostTeacher'), 'EIE worker should expose teacher create handler');
assert(worker.includes('async function handlePatchTeacher'), 'EIE worker should expose teacher update handler');
assert(worker.includes('async function handleResetTeacherPassword'), 'EIE worker should expose teacher password reset handler');
assert(worker.includes('async function handleDeleteTeacher'), 'EIE worker should expose teacher delete/disable handler');
assert(worker.includes('async function handleSeedDefaultTeachers'), 'EIE worker should expose default teacher seed handler');
assert(worker.includes("UPDATE teachers SET role = 'disabled'"), 'teacher delete should be a safe disable, not physical deletion');

for (const method of [
  'getTeachers()',
  'createTeacher(payload)',
  'updateTeacher(teacherId, payload)',
  'resetTeacherPassword(teacherId, newPassword)',
  'deleteTeacher(teacherId)',
  'seedDefaultTeachers()'
]) {
  assert(api.includes(method), `EieApi should include ${method}`);
}

for (const token of [
  '새 선생님 등록',
  'EieManagementView.startCreate',
  'EieManagementView.startEdit',
  'EieManagementView.submitForm',
  'EieManagementView.resetPassword',
  'EieManagementView.deleteTeacher',
  'EieManagementView.seedDefaultTeachers'
]) {
  assert(view.includes(token), `EIE management view should include ${token}`);
}

console.log('EIE teacher management port test passed');
