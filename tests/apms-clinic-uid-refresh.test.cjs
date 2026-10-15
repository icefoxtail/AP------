const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const clinicPrintSource = fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8');

function load(db) {
  const context = {
    window: {
      __clinicPrintHeaderEditBound: false,
      location: { href: 'https://fixture.local/apmath/clinic-print.html', origin: 'https://fixture.local' },
      addEventListener() {},
      open() { return {}; }
    },
    document: {
      getElementById() { return null; },
      querySelector() { return null; },
      querySelectorAll() { return []; }
    },
    state: { db, ui: {} },
    localStorage: { getItem() { return null; }, setItem() {} },
    sessionStorage: { setItem() {} },
    URL,
    URLSearchParams,
    console,
    toast() {}
  };
  vm.createContext(context);
  vm.runInContext(clinicPrintSource, context, { filename: 'clinic-print.js' });
  return context;
}

function baseDb() {
  return {
    classes: [
      { id: 'class-a', name: '고1 A반', grade: '고1', teacher_name: '선생님 A', is_active: 1 },
      { id: 'class-b', name: '고1 B반', grade: '고1', teacher_name: '선생님 B', is_active: 1 }
    ],
    students: [
      { id: 'student-a', name: '합성 학생 A', grade: '고1', status: '재원' },
      { id: 'student-b', name: '합성 학생 B', grade: '고1', status: '재원' },
      { id: 'student-c', name: '합성 학생 C', grade: '고1', status: '재원' }
    ],
    class_students: [
      { class_id: 'class-a', student_id: 'student-a' },
      { class_id: 'class-a', student_id: 'student-b' },
      { class_id: 'class-b', student_id: 'student-c' }
    ],
    class_exam_assignments: [
      { id: 'assignment-new', class_id: 'class-a', exam_date: '2026-10-14', exam_title: '이전 시험명', archive_file: 'MIXED:old-paper', question_count: 2 },
      { id: 'assignment-old', class_id: 'class-a', exam_date: '2026-10-13', exam_title: '캐시된 이전 시험', archive_file: 'MIXED:outside-paper', question_count: 2 },
      { id: 'assignment-other', class_id: 'class-b', exam_date: '2026-10-14', exam_title: '다른 반 시험', archive_file: 'MIXED:other-paper', question_count: 1 }
    ],
    exam_sessions: [
      { id: 'incoming-session', class_id: 'class-a', student_id: 'student-a', exam_date: '2026-10-14', exam_title: '이전 시험명', archive_file: 'MIXED:old-paper', question_count: 2, assignment_id: 'assignment-new' },
      { id: 'outside-limit-session', class_id: 'class-a', student_id: 'student-b', exam_date: '2026-10-13', exam_title: '캐시된 이전 시험', archive_file: 'MIXED:outside-paper', question_count: 2, assignment_id: 'assignment-old' },
      { id: 'foreign-session', class_id: 'class-b', student_id: 'student-c', exam_date: '2026-10-14', exam_title: '다른 반 시험', archive_file: 'MIXED:other-paper', question_count: 1, assignment_id: 'assignment-other' }
    ],
    wrong_answers: [
      { session_id: 'incoming-session', student_id: 'student-a', question_id: 2 },
      { session_id: 'outside-limit-session', student_id: 'student-b', question_id: 2 },
      { session_id: 'foreign-session', student_id: 'student-c', question_id: 1 }
    ],
    assessment_result_items: [
      { session_id: 'incoming-session', order_no: 1, source_question_uid: 'stale-result-uid', source_identity_status: 'VERIFIED' },
      { session_id: 'outside-limit-session', order_no: 2, source_question_uid: 'outside-result-uid', source_identity_status: 'VERIFIED' },
      { session_id: 'foreign-session', order_no: 1, source_question_uid: 'foreign-uid', source_identity_status: 'VERIFIED' }
    ],
    class_exam_assignment_questions: [
      { assignment_id: 'assignment-new', order_no: 1, question_uid: 'stale-assignment-uid', resolution_status: 'VERIFIED' },
      { assignment_id: 'assignment-old', order_no: 2, question_uid: 'outside-assignment-uid', resolution_status: 'VERIFIED' },
      { assignment_id: 'assignment-other', order_no: 1, question_uid: 'foreign-assignment-uid', resolution_status: 'VERIFIED' }
    ],
    exam_blueprints: [],
    class_exam_assignment_exclusions: []
  };
}

function assignmentSnapshot(overrides = {}) {
  return {
    assignment_id: 'assignment-new',
    order_no: 1,
    question_uid: 'qid_v1_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    source_archive_file: 'source/mixed-origin.js',
    source_question_no: '17',
    source_question_ordinal: 2,
    source_fingerprint: 'sha256:fixture-fingerprint',
    standard_unit_key: 'algebraic_expression',
    difficulty_at_assignment: '2',
    metadata_revision: 'meta-r7',
    metadata_hash: 'a'.repeat(64),
    metadata_json: JSON.stringify({ standardUnitKey: 'algebraic_expression', metadataRevision: 'meta-r7', provenance: { source: 'frozen-assignment' } }),
    resolution_status: 'VERIFIED',
    ...overrides
  };
}

function resultSnapshot(sessionId, overrides = {}) {
  const bridge = assignmentSnapshot();
  return {
    session_id: sessionId,
    assignment_id: 'assignment-new',
    order_no: 1,
    question_no: 1,
    source_archive_file: bridge.source_archive_file,
    source_question_no: bridge.source_question_no,
    source_question_ordinal: bridge.source_question_ordinal,
    source_question_uid: bridge.question_uid,
    source_fingerprint: bridge.source_fingerprint,
    source_identity_status: 'VERIFIED',
    metadata_revision: bridge.metadata_revision,
    metadata_hash: bridge.metadata_hash,
    metadata_json: bridge.metadata_json,
    metadata_snapshot_status: 'CAPTURED',
    standard_unit_key: bridge.standard_unit_key,
    difficulty: bridge.difficulty_at_assignment,
    ...overrides
  };
}

const incomingSession = {
  id: 'incoming-session',
  class_id: 'class-a',
  student_id: 'student-a',
  exam_date: '2026-10-15',
  exam_title: '혼합 시험',
  archive_file: 'MIXED:uid-bridge-paper',
  question_count: 2,
  assignment_id: 'assignment-new',
  score: 50,
  updated_at: '2026-10-15T00:10:00Z'
};

const incomingAssignment = {
  id: 'assignment-new',
  class_id: 'class-a',
  exam_date: '2026-10-15',
  exam_title: '혼합 시험',
  archive_file: 'MIXED:uid-bridge-paper',
  question_count: 2
};

const outsideLimitAssignment = {
  id: 'assignment-old',
  class_id: 'class-a',
  exam_date: '2026-10-13',
  exam_title: '캐시된 이전 시험',
  archive_file: 'MIXED:outside-paper',
  question_count: 2
};

async function cacheResponseAndBuild(context, response) {
  context.api = {
    async get() { return response; },
    async post(_route, body) {
      context.__postedClinic = body;
      return { success: true, public_set_key: 'SET_FIXTURE', print: { engine_url: 'https://fixture.local/wrong_print_engine.html?set=SET_FIXTURE' } };
    }
  };
  const previousClassSessions = context.state.db.exam_sessions
    .filter(row => row.class_id === 'class-a').map(row => row.id);
  const previousClassAssignmentIds = new Set(context.state.db.exam_sessions
    .filter(row => row.class_id === 'class-a').map(row => row.assignment_id).filter(Boolean));
  const refreshed = await context.clinicPrintRefreshClassAssignments('class-a');
  assert.equal(refreshed, true, 'the by-class route response should pass clinic refresh validation');

  const sessions = context.state.db.exam_sessions;
  const incomingSessionIds = new Set(response.sessions.map(row => row.id));
  for (const sessionId of incomingSessionIds)
    assert.ok(sessions.some(row => row.id === sessionId), 'incoming class sessions remain cached by session id');
  for (const sessionId of previousClassSessions.filter(id => !incomingSessionIds.has(id)))
    assert.ok(sessions.some(row => row.id === sessionId), 'cached class session outside the limited response is retained');
  assert.ok(sessions.some(row => row.id === 'foreign-session'), 'other class session remains cached');
  for (const incoming of response.sessions)
    assert.equal(JSON.stringify(sessions.filter(row => row.id === incoming.id)), JSON.stringify([incoming]),
      'incoming session replaces the stale row with the same id exactly once');
  const incomingWrongSessionIds = new Set(response.sessions.map(row => row.id));
  for (const sessionId of incomingWrongSessionIds) {
    assert.equal(
      JSON.stringify(Array.from(context.state.db.wrong_answers.filter(row => row.session_id === sessionId), row => Number(row.question_id)).sort((a, b) => a - b)),
      JSON.stringify((response.wrong_answers || []).filter(row => row.session_id === sessionId).map(row => Number(row.question_id)).sort((a, b) => a - b)),
      'incoming session wrong answers replace the stale rows'
    );
  }
  if (previousClassSessions.includes('outside-limit-session'))
    assert.ok(context.state.db.wrong_answers.some(row => row.session_id === 'outside-limit-session' && Number(row.question_id) === 2),
      'cached wrong answers for an outside-limit session are retained');
  const incomingResultSessionIds = new Set((response.result_items || []).map(row => row.session_id));
  for (const sessionId of incomingResultSessionIds)
    assert.ok(context.state.db.assessment_result_items.some(row => row.session_id === sessionId));
  for (const session of response.sessions) {
    assert.equal(
      JSON.stringify(context.state.db.assessment_result_items.filter(row => row.session_id === session.id)),
      JSON.stringify((response.result_items || []).filter(row => row.session_id === session.id)),
      'incoming session result snapshots replace stale rows exactly'
    );
  }
  for (const sessionId of previousClassSessions.filter(id => !incomingSessionIds.has(id)))
    assert.ok(context.state.db.assessment_result_items.some(row => row.session_id === sessionId), 'cached result snapshots outside the response are retained');
  assert.ok(context.state.db.assessment_result_items.some(row => row.session_id === 'foreign-session'));
  if (previousClassSessions.includes('outside-limit-session'))
    assert.ok(context.state.db.assessment_result_items.some(row => row.session_id === 'outside-limit-session' && row.source_question_uid === 'outside-result-uid'));
  const incomingAssignmentIds = new Set((response.assignments || []).map(row => row.id));
  for (const assignmentId of incomingAssignmentIds)
    if ((response.assignment_questions || []).some(row => row.assignment_id === assignmentId))
      assert.ok(context.state.db.class_exam_assignment_questions.some(row => row.assignment_id === assignmentId));
  for (const assignmentId of new Set(response.sessions.map(row => row.assignment_id).filter(Boolean))) {
    assert.equal(
      JSON.stringify(context.state.db.class_exam_assignment_questions.filter(row => row.assignment_id === assignmentId)),
      JSON.stringify((response.assignment_questions || []).filter(row => row.assignment_id === assignmentId)),
      'incoming assignment bridges replace stale rows exactly'
    );
  }
  if (previousClassAssignmentIds.has('assignment-old')) {
    assert.ok(context.state.db.class_exam_assignment_questions.some(row => row.assignment_id === 'assignment-old' && row.question_uid === 'outside-assignment-uid'),
      'cached assignment snapshot for an outside-limit session is retained even when the assignment row is returned');
  }
  assert.ok(context.state.db.class_exam_assignment_questions.some(row => row.assignment_id === 'assignment-other'));

  const group = context.clinicPrintGetClassExamGroups('class-a')[0];
  assert.equal(group.archiveFile, response.assignments[0]?.archive_file || response.sessions[0]?.archive_file);
  const payload = context.clinicPrintBuildPayload('class-a', {
    mode: 'student',
    selectedExamKeys: [group.examKey],
    selectedStudentIds: ['student-a']
  });
  return { payload, group };
}

test('by-class refresh replaces class rows and clinic-print preserves UID, Meta and origin in the saved payload', async () => {
  const context = load(baseDb());
  const frozen = resultSnapshot('incoming-session');
  const response = {
    success: true,
    sessions: [incomingSession],
    assignments: [incomingAssignment, outsideLimitAssignment],
    wrong_answers: [{ session_id: 'incoming-session', student_id: 'student-a', question_id: 1 }],
    result_items: [frozen],
    assignment_questions: [assignmentSnapshot()],
    blueprints: [{ archive_file: 'MIXED:uid-bridge-paper', question_no: 1, source_question_uid: 'live-blueprint-must-not-win' }],
    exclusions: []
  };
  const { payload, group } = await cacheResponseAndBuild(context, response);
  assert.equal(payload.students.length, 1);
  assert.equal(payload.students[0].studentId, 'student-a');
  const wrongItem = payload.students[0].wrongItems[0];
  assert.equal(wrongItem.questionNo, 1, 'visible OMR order remains the display question number');
  assert.equal(wrongItem.displayQuestionNo, 1);
  assert.equal(wrongItem.sourceQuestionNo, 17);
  assert.equal(wrongItem.sourceQuestionOrdinal, 2);
  assert.equal(wrongItem.sourceQuestionUid, frozen.source_question_uid);
  assert.equal(wrongItem.sourceIdentityStatus, 'VERIFIED');
  assert.equal(wrongItem.metadataRevision, 'meta-r7');
  assert.equal(wrongItem.metadataHash, 'a'.repeat(64));
  assert.equal(wrongItem.metadataJson, frozen.metadata_json);
  assert.equal(wrongItem.metadataSnapshotStatus, 'CAPTURED');
  assert.deepEqual(JSON.parse(JSON.stringify(wrongItem.sourceOriginRefs)), [{
    sessionId: 'incoming-session',
    assignmentId: 'assignment-new',
    orderNo: 1,
    examTitle: '혼합 시험',
    examDate: '2026-10-15',
    archiveFile: 'MIXED:uid-bridge-paper'
  }]);

  assert.deepEqual(
    Array.from(context.clinicPrintBuildWrongClinicTargets('class-a', payload, ['student-a']), row => row.student_id),
    ['student-a'],
    'the existing checked-student selection continues to control recipients'
  );
  assert.equal(JSON.stringify(context.clinicPrintBuildWrongClinicTargets('class-a', payload, [])), '[]', 'no checked students still means no recipients');
  await context.clinicPrintSaveAndOpen('class-a', payload, ['student-a']);
  const setPayload = context.__postedClinic.payload;
  const itemInSetPayload = setPayload.students[0].wrongItems[0];
  assert.equal(itemInSetPayload.sourceQuestionUid, wrongItem.sourceQuestionUid);
  assert.equal(itemInSetPayload.metadataRevision, 'meta-r7');
  assert.equal(itemInSetPayload.metadataHash, 'a'.repeat(64));
  assert.equal(itemInSetPayload.metadataJson, frozen.metadata_json);
  assert.deepEqual(JSON.parse(JSON.stringify(itemInSetPayload.sourceOriginRefs)), JSON.parse(JSON.stringify(wrongItem.sourceOriginRefs)));
  assert.deepEqual(context.__postedClinic.targets.map(row => row.student_id), ['student-a']);
  assert.equal(context.__postedClinic.payload.exams[0].examKey, group.examKey);
});

test('missing legacy UID/Meta stays selectable and can still produce a clinic item using its session origin', async () => {
  const legacyDb = baseDb();
  legacyDb.class_exam_assignments = legacyDb.class_exam_assignments.filter(row => row.class_id !== 'class-a');
  legacyDb.exam_sessions = legacyDb.exam_sessions.filter(row => row.class_id !== 'class-a');
  legacyDb.wrong_answers = legacyDb.wrong_answers.filter(row => row.session_id === 'foreign-session');
  legacyDb.assessment_result_items = legacyDb.assessment_result_items.filter(row => row.session_id === 'foreign-session');
  legacyDb.class_exam_assignment_questions = legacyDb.class_exam_assignment_questions.filter(row => row.assignment_id === 'assignment-other');
  const context = load(legacyDb);
  const legacySession = { ...incomingSession, id: 'legacy-session', assignment_id: 'legacy-assignment', exam_title: 'legacy 시험', archive_file: 'MIXED:legacy-paper' };
  const legacyAssignment = { ...incomingAssignment, id: 'legacy-assignment', exam_title: 'legacy 시험', archive_file: 'MIXED:legacy-paper' };
  const { payload } = await cacheResponseAndBuild(context, {
    success: true,
    sessions: [legacySession],
    assignments: [legacyAssignment],
    wrong_answers: [{ session_id: 'legacy-session', student_id: 'student-a', question_id: 2 }],
    blueprints: [{ archive_file: 'MIXED:legacy-paper', question_no: 2, source_question_uid: 'current-blueprint-is-not-a-frozen-result' }],
    exclusions: []
  });
  assert.equal(payload.students.length, 1, 'no snapshot does not block the existing selected-student flow');
  assert.equal(payload.students[0].wrongItems.length, 1);
  const item = payload.students[0].wrongItems[0];
  assert.equal(item.sourceQuestionUid, '');
  assert.equal(item.sourceIdentityStatus, 'UNRESOLVED');
  assert.equal(item.metadataRevision, null);
  assert.equal(item.metadataHash, null);
  assert.equal(item.metadataJson, null);
  assert.equal(item.metadataSnapshotStatus, 'UNRESOLVED');
  assert.deepEqual(JSON.parse(JSON.stringify(item.sourceOriginRefs)), [{
    sessionId: 'legacy-session',
    assignmentId: 'legacy-assignment',
    orderNo: 2,
    examTitle: 'legacy 시험',
    examDate: '2026-10-15',
    archiveFile: 'MIXED:legacy-paper'
  }]);
  await context.clinicPrintSaveAndOpen('class-a', payload, ['student-a']);
  assert.deepEqual(context.__postedClinic.targets.map(row => row.student_id), ['student-a']);
  assert.equal(context.__postedClinic.payload.students[0].wrongItems[0].sourceIdentityStatus, 'UNRESOLVED');
});
