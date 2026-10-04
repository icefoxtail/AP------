const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routeSource = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/students.js'), 'utf8');
const editSource = fs.readFileSync(path.join(root, 'apmath/js/student-edit.js'), 'utf8');
const studentSource = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(root, 'apmath/js/core.js'), 'utf8');
const updateStart = routeSource.indexOf('async function handleUpdateStudent(');
const updateEnd = routeSource.indexOf('\nexport async function handleStudents(', updateStart);
const updateSource = routeSource.slice(updateStart, updateEnd);

assert(
  updateSource.includes("const classChanged = d.classId !== undefined") &&
    updateSource.includes("UPDATE student_enrollments") &&
    updateSource.includes("status = 'ended'") &&
    updateSource.includes("INSERT INTO student_enrollments"),
  'student detail class changes should end the former enrollment and create the new active enrollment'
);
assert(
  updateSource.includes('INSERT INTO class_transfer_history') &&
    updateSource.includes("'student detail class edit'") &&
    updateSource.includes('await env.DB.batch(stmts)'),
  'student detail class changes should record transfer history in the same atomic batch'
);
assert(
  !updateSource.includes('DELETE FROM attendance') &&
    !updateSource.includes('DELETE FROM homework') &&
    !updateSource.includes('DELETE FROM exam_sessions') &&
    !updateSource.includes('DELETE FROM consultations'),
  'class changes must preserve student-scoped learning and consultation history'
);
assert(
  editSource.includes('mergeStudentEnrollmentRowsAfterEdit(sid, r.student_enrollments)') &&
    editSource.includes("loadStudentFoundationDetails(sid, { force: true })") &&
    editSource.includes("ensureStudentDetailLazyData(sid, { force: true, refresh: false })"),
  'student edit UI should merge enrollment results and refresh transfer history after a class change'
);
assert(
  studentSource.includes("response.class_student || (response.student?.id") &&
    studentSource.includes("{ student_id: response.student.id, class_id: '' }") &&
    studentSource.includes("state[key].class_students = state[key].class_students.filter"),
  'unassigning a student should remove the former class mapping from both db and allDb UI state'
);
assert(
  editSource.includes("const classInput = document.getElementById('edit-class')") &&
    editSource.includes('if (nameChanged || classChanged)'),
  'switching edit tabs should warn when a class selection would be discarded'
);
assert(
  editSource.includes('let editStudentSubmitting = false') &&
    editSource.includes("actionBtn.textContent = '저장 중…'") &&
    editSource.includes('actionBtn.disabled = true') &&
    editSource.includes('if (cancelBtn) cancelBtn.disabled = true'),
  'student edits should prevent duplicate transfer submissions and show pending feedback'
);
assert(
  editSource.includes('function isSameStudentEditModalOpen(sid)') &&
    editSource.includes("overlay.classList.contains('show')") &&
    editSource.includes("!overlay.classList.contains('hidden')") &&
    editSource.includes('if (actionBtn && stillEditingSameStudent)') &&
    editSource.includes('if (cancelBtn && stillEditingSameStudent)'),
  'a completed save should not overwrite another modal after the user navigates away'
);
assert(
  /await loadStudentOnboardingDetails\([^;]+;\s*if \(isSameStudentEditModalOpen\(sid\)\)/s.test(editSource),
  'student edit should recheck modal state after the final asynchronous refresh before rendering'
);
assert(
  studentSource.includes('try { await entry.inFlight; } catch (e) {}') &&
    coreSource.includes('try { await store.inFlight[sid]; } catch (e) {}'),
  'forced post-transfer refreshes should wait out stale requests before loading fresh history'
);

console.log('AP Math student edit class transfer contract passed');
