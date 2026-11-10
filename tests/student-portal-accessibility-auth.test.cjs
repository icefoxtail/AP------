'use strict';

// Current Worker and current D1 schemas, with isolated synthetic identities.
// This verifies real authentication/authorization code, not a production login.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createLocalStudentWorker } = require('./student-portal-accessibility-worker.cjs');

test('current Worker authenticates the test student and keeps teacher preview reads separate from student writes', { timeout: 60000 }, async () => {
  const worker = await createLocalStudentWorker(path.resolve(__dirname, '..'));
  const jsonPost = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    let response = await worker.request('student-portal/auth', jsonPost({ name: worker.identity.name, pin: 'wrong-test-pin' }));
    assert.equal(response.status, 401, 'an incorrect PIN is not an authenticated student');
    response = await worker.request('student-portal/auth', jsonPost({ name: worker.identity.name, pin: worker.identity.pin }));
    assert.equal(response.status, 200);
    const session = await response.json();
    assert.equal(session.student.id, worker.identity.id);
    assert.ok(session.student_token);
    const studentHeaders = { 'X-Student-Token': session.student_token };
    for (const route of ['home', 'exams', 'learning-history', 'wrong-clinics']) {
      response = await worker.request('student-portal/' + route + '?student_id=' + worker.identity.id, { headers: studentHeaders });
      assert.equal(response.status, 200, 'authenticated student can read ' + route);
      const data = await response.json();
      assert.equal(data.success, true, route + ' is an actual successful Worker response');
      if (route === 'home') assert.equal(data.class_exam_assignments.length, 3);
    }
    response = await worker.request('planner-auth?' + new URLSearchParams({ student_id: worker.identity.id, pin: worker.identity.pin }));
    assert.equal(response.status, 200, 'planner uses the actual student PIN authentication');
    response = await worker.request('homework-photo/auth', jsonPost({ assignment_id: 'qa-navigation-homework', student_id: worker.identity.id, pin: worker.identity.pin }));
    assert.equal(response.status, 200, 'homework uses the actual student PIN authentication');

    const teacherHeaders = { Authorization: 'Bearer ' + worker.teacherSession.session_token };
    for (const route of ['home', 'exams', 'learning-history']) {
      response = await worker.request('student-portal/' + route + '?student_id=' + worker.identity.id, { headers: teacherHeaders });
      assert.equal(response.status, 200, 'assigned teacher can read ' + route);
      const data = await response.json();
      assert.equal(data.success, true);
      if (route === 'home') assert.equal(data.read_only, true);
    }
    response = await worker.request('student-portal/home?student_id=' + worker.identity.outsiderId, { headers: teacherHeaders });
    assert.equal(response.status, 403, 'teacher scope does not expand to an unrelated student');
    const mutation = jsonPost({ student_id: worker.identity.id, assignment_id: 'qa-navigation-pending', wrong_ids: [2] });
    mutation.headers.Authorization = teacherHeaders.Authorization;
    response = await worker.request('student-portal/omr-submit', mutation);
    assert.equal(response.status, 401, 'a teacher session cannot impersonate a student write credential');
  } finally {
    await worker.dispose();
  }
});
