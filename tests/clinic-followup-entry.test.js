// 클리닉 후속(2026-11-23): (1) 보충시험 후속 후보(buildFollowUpCandidates 다른 유사 문항)에도 "틀린 유형 기준"을 적용,
// (2) 시험 결과 화면 -> 그 학생·그 시험의 오답 클리닉으로 가는 입구(시험 목록·학생 목록 미리 선택).
// 순수 함수와 화면 어댑터만 돌린다(운영 API·네트워크 없음). 후보 선정은 #2684의 selectByWrongType 한 함수를 build와 함께 쓴다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const Recs = require(path.join(__dirname, '../apmath/js/clinic-recommendations.js'));
const Derive = require(path.join(__dirname, '../archive/archive2-derive.js'));

const uid = (n) => `qid_v1_${n.toString(16).padStart(64, '0')}`;
const GRADE_RANK = { 고1: 1, 고2: 2, 고3: 3 };
const core = {
  gradeRank: (grade) => GRADE_RANK[String(grade || '')] || 0,
  generalUseEligibility: (record) => ({ ok: record.identityStatus === 'VERIFIED' && record.sourceIntegrityStatus === 'VERIFIED' }),
  difficultyEligible: (record) => Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5,
  pathKey: (meta, depth) => JSON.stringify(['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4'].slice(0, depth).map((f) => String(meta[f] || ''))),
  advancedEligible: () => true,
};
function record(n, { unit, pt, tpl, bucket = 2, grade = '고1' }) {
  return {
    questionUid: uid(n), sourceFile: 'original/high/h1/1mid/fx.js', sourceOrdinal: n, sourceQuestionNo: n, sourceGrade: grade,
    identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceFingerprint: `fp${n}`,
    curriculumKey: '2022', courseKey: 'H1', L1: unit, L2: `${unit}-2`, L3: `${unit}-3`,
    problemTypeKey: pt, templateKey: tpl, difficultyBucket: bucket,
  };
}
const WRONG = [
  record(1, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1' }),
  record(2, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1' }),
  record(3, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1' }),
];
const POOL = [
  record(12, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1' }),
  record(13, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1' }),
  record(14, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X2' }),
  record(21, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1' }),
  record(22, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1' }),
  record(31, { unit: 'A', pt: 'PT_W', tpl: 'TPL_W1' }),
  record(91, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', grade: '고2' }), // 반 학년 초과
];
const CATALOG = [...WRONG, ...POOL];

const pathOf = (rec) => ({ curriculumKey: rec.curriculumKey, courseKey: rec.courseKey, L1: rec.L1, L2: rec.L2, L3: rec.L3 });
const keyOf = (rec) => JSON.stringify(['curriculumKey', 'courseKey', 'L1', 'L2', 'L3'].map((f) => rec[f]));
function target(recs, orderNos) {
  return {
    path: pathOf(recs[0]), pathDepth: 5, pathKey: keyOf(recs[0]), difficultyBucket: 2,
    questionCount: recs.length, questionOrderNos: orderNos, observedWrongCount: recs.length,
    questionRefs: recs.map((rec, i) => ({
      orderNo: orderNos[i], sourceQuestionUid: rec.questionUid, sourceArchiveFile: rec.sourceFile,
      sourceQuestionOrdinal: rec.sourceOrdinal, sourceFingerprint: rec.sourceFingerprint,
    })),
  };
}
function followUpInput(extra = {}) {
  const targets = [target([WRONG[0], WRONG[1]], [1, 2]), target([WRONG[2]], [3])];
  return {
    studentId: 's1', mode: 'similar_uid',
    followUpContext: {
      status: 'result', coverage: { attemptStatus: 'result', recommendationEligible: true },
      recommendationInput: { eligible: true, targets },
    },
    questionResults: [
      { order_no: 1, status: 'wrong', questionUid: WRONG[0].questionUid },
      { order_no: 2, status: 'wrong', questionUid: WRONG[1].questionUid },
      { order_no: 3, status: 'wrong', questionUid: WRONG[2].questionUid },
    ],
    candidateRecords: CATALOG, archive2Core: core, canonicalAuthority: null, targetGrade: '고1',
    recommendationOptions: { countPerStudent: 4, difficultyMode: 'match_wrong', selectedDifficultyBuckets: [] },
    ...extra,
  };
}

// 화면 어댑터(clinic-print.js)를 가짜 window로 돌려 진짜 archive2-derive와 연결한다.
function loadClinicPrint(stateDb = {}) {
  const win = {
    addEventListener() {}, Archive2Core: core, Archive2Derive: Derive, ClinicRecommendations: Recs,
    Archive2UnifiedUnits: {
      buildIndex(records) {
        const byUid = new Map();
        for (const r of records) byUid.set(r.questionUid, { grade: '고1', subject: '수학', unitKey: r.L1, originalCurriculum: '2022', unclassified: false });
        return { byUid, byRecord: new Map() };
      },
    },
  };
  const toasts = [];
  const context = {
    window: win,
    document: { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
    state: { db: stateDb }, localStorage: { getItem() { return null; }, setItem() {} }, URL, URLSearchParams, console,
    toast: (message, kind) => toasts.push([message, kind]),
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8'), context);
  context.__toasts = toasts;
  return context;
}
const catalogOf = (records) => ({ records, catalog: { projectionPolicy: null } });
const num = (u) => parseInt(u.slice(-8), 16);

function followUpType(extra = {}, { records = CATALOG } = {}) {
  const c = loadClinicPrint();
  const catalog = catalogOf(records);
  const ladder = c.clinicPrintBuildTypeLadder(catalog, '고1', null);
  const prepared = c.clinicPrintGetPreparedCandidateRecords(catalog);
  return Recs.buildFollowUpCandidates(followUpInput({ candidateRecords: prepared, selectionBasis: 'wrong_type', typeLadder: ladder, ...extra }));
}

test('후속 후보: 기본 방식(개념 경로)은 selectionBasis가 없고 결과가 그대로다', () => {
  const plain = Recs.buildFollowUpCandidates(followUpInput());
  assert.equal(plain.status, 'ready');
  assert.ok(!('selectionBasis' in plain));
  assert.ok(!('selectionBasis' in plain.coverage));
  for (const item of plain.candidates[0].items) assert.equal(item.recommendationReason.basis, 'follow_up_similar_uid');
  // 명시해도(기본값) 같다
  const same = Recs.buildFollowUpCandidates(followUpInput({ selectionBasis: 'concept_path' }));
  assert.deepEqual(JSON.parse(JSON.stringify(same)), JSON.parse(JSON.stringify(plain)));
});

test('후속 후보: 틀린 유형 기준이면 틀린 유형(TPL_X1·TPL_Y1)에서 고르고 틀린 문항·상위 학년은 없다', () => {
  const result = followUpType();
  assert.equal(result.status, 'ready');
  assert.equal(result.selectionBasis, 'wrong_type');
  assert.equal(result.coverage.selectionBasis, 'wrong_type');
  const group = result.candidates[0];
  assert.equal(group.selectionBasis, 'wrong_type');
  assert.equal(group.items.length, 4);
  const picked = group.items.map((item) => num(item.sourceQuestionUid));
  assert.equal(new Set(picked).size, 4, '같은 문항이 두 번 나오지 않는다');
  for (const n of [1, 2, 3]) assert.ok(!picked.includes(n), '이번 틀린 문항 자체는 나오지 않는다');
  assert.ok(!picked.includes(91), '반 학년보다 높은 학년 문항은 나오지 않는다');
  assert.deepEqual([...picked].sort((a, b) => a - b), [12, 13, 21, 22]);
  for (const item of group.items) {
    assert.equal(item.recommendationReason.basis, 'wrong_type');
    assert.equal(item.recommendationReason.typeRung, 'template');
    // 배정 단계(clinic-assessment)가 후속 후보를 알아보는 표식과 이유는 그대로 둔다
    assert.equal(item.followUpMode, 'similar_uid');
    assert.equal(item.recommendationReason.recommendationMode, 'similar_uid');
  }
  assert.equal(group.typeBasis.baseCount, 3);
  assert.equal(group.typeBasis.rungCounts.template, 4);
});

test('후속 후보: 같은 유형이 모자라면 한 단계 위로 내려가고, 선택한 한 유형(targetScope)만 쓰면 그 유형만 본다', () => {
  const wide = followUpType({ recommendationOptions: { countPerStudent: 6, difficultyMode: 'match_wrong', selectedDifficultyBuckets: [] } });
  const items = wide.candidates[0].items;
  assert.equal(items.length, 6, '같은 세부 유형 4개 -> 같은 유형(14) -> 같은 단원(31). 반 학년 초과(91)는 쓰지 않는다');
  assert.deepEqual(items.map((item) => item.recommendationReason.typeRung).slice(0, 5), ['template', 'template', 'template', 'template', 'type']);
  assert.equal(num(items[4].sourceQuestionUid), 14);
  assert.equal(num(items[5].sourceQuestionUid), 31);
  assert.ok(!items.some((item) => num(item.sourceQuestionUid) === 91));
  const scoped = followUpType({ targetScope: { pathKey: keyOf(WRONG[2]), difficultyBucket: 2 } });
  const scopedPicked = scoped.candidates[0].items.map((item) => num(item.sourceQuestionUid));
  assert.deepEqual(scopedPicked.sort((a, b) => a - b), [21, 22], '고른 유형(단원 B)의 후보만, 단원 A 후보는 없다');
});

test('후속 후보: 유형 정보가 없는 오답은 개념 경로로 채우고 그렇게 표시된다', () => {
  const untyped = record(5, { unit: 'A', pt: '', tpl: '' });
  const records = [...CATALOG, untyped];
  const input = followUpInput();
  input.followUpContext.recommendationInput.targets = [target([untyped], [1])];
  input.questionResults = [{ order_no: 1, status: 'wrong', questionUid: untyped.questionUid }];
  const c = loadClinicPrint();
  const catalog = catalogOf(records);
  const ladder = c.clinicPrintBuildTypeLadder(catalog, '고1', null);
  const result = Recs.buildFollowUpCandidates({
    ...input, candidateRecords: c.clinicPrintGetPreparedCandidateRecords(catalog), selectionBasis: 'wrong_type', typeLadder: ladder,
  });
  const group = result.candidates[0];
  assert.equal(group.selectionBasis, 'concept_path');
  assert.equal(group.typeBasis.fallbackReason, 'no_type_info');
  assert.ok(group.items.length > 0, '유형이 없어도 개념 경로로 후보는 나온다');
  for (const item of group.items) assert.equal(item.recommendationReason.basis, 'follow_up_similar_uid');
});

test('후속 후보: 같은 UID 재연습은 틀린 유형 기준을 받아도 UID 그대로다', () => {
  const result = Recs.buildFollowUpCandidates(followUpInput({ mode: 'same_uid', selectionBasis: 'wrong_type', typeLadder: null }));
  assert.equal(result.status, 'ready');
  assert.ok(!('selectionBasis' in result));
  assert.deepEqual(result.candidates[0].items.map((item) => num(item.sourceQuestionUid)).sort((a, b) => a - b), [1, 2, 3]);
});

test('후속 후보: 사다리 모듈이 없으면 조용히 기본 방식으로 가지 않고 옵션 오류로 알린다', () => {
  const result = Recs.buildFollowUpCandidates(followUpInput({ selectionBasis: 'wrong_type' }));
  assert.equal(result.status, 'invalid_options');
  assert.ok(result.errors.some((e) => e.code === 'type_ladder_unavailable'));
});

test('후속 후보: 화면 안내문이 읽는 값(기준 응시 한 건·오답 수)이 결과에 있다', () => {
  const result = followUpType();
  assert.equal(result.coverage.evidenceSessionCount, 1);
  assert.equal(result.coverage.wrongAnswerCount, 3);
  const c = loadClinicPrint();
  const notes = c.clinicPrintTypeBasisNotes(result, 'c1');
  assert.match(notes[0], /이번 응시의 확정 오답 3개/);
  assert.ok(notes.some((line) => /같은 세부 유형 4/.test(line)));
});

test('후속 후보를 부르는 화면 함수는 틀린 유형 기준 선택을 buildFollowUpCandidates에 넘긴다(두 번째 구현 없음)', () => {
  const src = fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8');
  const body = src.slice(src.indexOf('async function clinicPrintStartFollowUpRecommendations'), src.indexOf('function clinicPrintClearFollowUpRecommendations'));
  assert.match(body, /settings\.selectionBasis === 'wrong_type'/);
  assert.match(body, /clinicPrintBuildTypeLadder\(/);
  assert.match(body, /buildFollowUpCandidates\(\{[\s\S]*\.\.\.typeExtras/);
  const recs = fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-recommendations.js'), 'utf8');
  assert.equal((recs.match(/function selectByWrongType\(/g) || []).length, 1, '유형 사다리 선정 함수는 모듈에 하나뿐');
});

// ---------- 시험 결과 화면 입구: 시험 목록·학생 목록 미리 선택 ----------
function entryApp() {
  const day = '2026-11-20';
  const archive = 'original/high/h1/1mid/25_school_h1_mid_math1.js';
  const students = [{ id: 's1', name: '가학생', status: '재원' }, { id: 's2', name: '나학생', status: '재원' }];
  const db = {
    classes: [{ id: 'c1', name: '고1A', grade: '고1', is_active: 1 }],
    students,
    class_students: students.map((s) => ({ class_id: 'c1', student_id: s.id })),
    exam_sessions: [
      { id: 'e1', student_id: 's1', class_id: 'c1', assignment_id: 'a1', exam_title: '중간고사', exam_date: day, question_count: 4, archive_file: archive },
      { id: 'e2', student_id: 's2', class_id: 'c1', assignment_id: 'a1', exam_title: '중간고사', exam_date: day, question_count: 4, archive_file: archive },
      { id: 'o1', student_id: 's1', class_id: 'c1', assignment_id: 'a2', exam_title: '쪽지시험', exam_date: '2026-11-10', question_count: 3, archive_file: 'original/high/h1/1mid/25_school_h1_mid_quiz.js' },
    ],
    wrong_answers: [
      { session_id: 'e1', question_id: '1' }, { session_id: 'e1', question_id: '3' }, { session_id: 'e2', question_id: '2' }, { session_id: 'o1', question_id: '1' },
    ],
    class_exam_assignments: [
      { id: 'a1', class_id: 'c1', exam_title: '중간고사', exam_date: day, question_count: 4, archive_file: archive, can_manage: true },
      { id: 'a2', class_id: 'c1', exam_title: '쪽지시험', exam_date: '2026-11-10', question_count: 3, archive_file: 'original/high/h1/1mid/25_school_h1_mid_quiz.js', can_manage: true },
    ],
  };
  const c = loadClinicPrint(db);
  return { c, db };
}

test('입구: 응시 id로 그 시험의 묶음 키를 찾고, 시험 목록 첫 그리기는 그 시험만 선택한다', () => {
  const { c } = entryApp();
  const pre = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionId: 'o1', examKey: 'wrong|key|that|does-not-exist' } });
  assert.ok(pre, '키가 달라도 응시 id로 찾는다');
  assert.equal(pre.studentId, 's1');
  const groups = c.clinicPrintGetClassExamGroups('c1', 'class');
  const quiz = groups.find((g) => g.sessions.some((s) => s.id === 'o1'));
  assert.equal(pre.examKey, quiz.examKey);
  assert.equal(pre.classId, 'c1');
});

test('입구: 시험 묶음에 없으면(원문 미연결 등) null을 돌려 평소처럼 열고 안내한다', () => {
  const { c, db } = entryApp();
  db.exam_sessions.push({ id: 'x1', student_id: 's1', class_id: 'c1', assignment_id: '', exam_title: '직접입력', exam_date: '2026-11-21', question_count: 5, archive_file: '' });
  const pre = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionId: 'x1', examKey: '2026-11-21|직접입력||5' } });
  assert.equal(pre, null);
  assert.equal(c.__toasts.length, 1);
  assert.equal(c.clinicPrintResolvePreselect('c1', {}), null, '선택 요청이 없으면 아무것도 하지 않는다');
});

test('입구: openClinicForStudentExam은 기존 출력 센터를 그 시험·학생 선택 값과 함께 연다', async () => {
  const { c } = entryApp();
  const calls = [];
  c.openClinicPrintCenter = async (classId, options) => { calls.push([classId, options]); return true; };
  const out = vm.runInContext(`openClinicForStudentExam('c1', 's1', { sessionId: 'e1', examDate: '2026-11-20', examTitle: '중간고사', archiveFile: 'original/high/h1/1mid/25_school_h1_mid_math1.js', questionCount: 4 })`, c);
  await out;
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'c1');
  assert.equal(calls[0][1].preselect.studentId, 's1');
  assert.equal(calls[0][1].preselect.sessionId, 'e1');
  assert.match(calls[0][1].preselect.examKey, /^2026-11-20\|중간고사\|.*25_school_h1_mid_math1\.js\|4$/);
});

test('입구: 시험·학생 첫 그리기만 선택을 쓰고 그 뒤에는 비운다(직접 연 클리닉은 그대로)', () => {
  const { c } = entryApp();
  const pre = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's2', sessionId: 'e2', examKey: '' } });
  vm.runInContext('clinicPrintPendingPreselect = __pre', Object.assign(c, { __pre: pre }));
  const exams = [];
  c.document.querySelector = () => null;
  c.document.querySelectorAll = (selector) => (selector.includes('clinic-print-exam') ? exams : []);
  const html = c.clinicPrintRenderExamListHtml('c1', 'class');
  const checkedKeys = [...html.matchAll(/name="clinic-print-exam" value="([^"]*)" (checked)?/g)].filter((m) => m[2]).map((m) => m[1]);
  assert.deepEqual(checkedKeys, [pre.examKey], '고른 시험 하나만 체크된다');
});

// ---------- 학생 상세 입구: 시험 여러 개를 한 번에 (openClinicForStudentExams) ----------
function multiExamApp() {
  const { c, db } = entryApp();
  db.exam_sessions.push({ id: 'f1', student_id: 's1', class_id: 'c1', assignment_id: 'a3', exam_title: '기말고사', exam_date: '2026-12-01', question_count: 3, archive_file: 'original/high/h1/2final/24_school_h1_final_math1.js' });
  db.wrong_answers.push({ session_id: 'f1', question_id: '2' });
  db.class_exam_assignments.push({ id: 'a3', class_id: 'c1', exam_title: '기말고사', exam_date: '2026-12-01', question_count: 3, archive_file: 'original/high/h1/2final/24_school_h1_final_math1.js', can_manage: true });
  return { c, db };
}
const MID = 'original/high/h1/1mid/25_school_h1_mid_math1.js';
const QUIZ = 'original/high/h1/1mid/25_school_h1_mid_quiz.js';

test('여러 시험 입구: 기존 출력 센터를 시험 여러 개·학생 한 명 선택 값과 함께 연다(새 센터 없음)', async () => {
  const { c } = multiExamApp();
  const calls = [];
  c.openClinicPrintCenter = async (classId, options) => { calls.push([classId, options]); return true; };
  await vm.runInContext(`openClinicForStudentExams('c1', 's1', [
    { sessionId: 'o1', examDate: '2026-11-10', examTitle: '쪽지시험', archiveFile: '${QUIZ}', questionCount: 3 },
    { sessionId: 'e1', examDate: '2026-11-20', examTitle: '중간고사', archiveFile: '${MID}', questionCount: 4 }])`, c);
  assert.equal(calls.length, 1);
  const pre = calls[0][1].preselect;
  assert.equal(pre.studentId, 's1');
  assert.deepEqual([...pre.sessionIds], ['o1', 'e1']);
  assert.equal(pre.examKeys.length, 2);
  assert.equal(calls[0][1].recommendation, undefined, '목표를 안 골랐으면 추천 입력은 건드리지 않는다');
  assert.equal(vm.runInContext(`openClinicForStudentExams('c1', 's1', [])`, c), false, '시험이 0개면 열지 않는다');
  assert.equal(c.__toasts.length, 1);
});

test('여러 시험 입구: 목표 문항을 골랐으면 추천 입력(문항 수·틀린 유형 기준)만 전달한다', async () => {
  const { c } = multiExamApp();
  const calls = [];
  c.openClinicPrintCenter = async (classId, options) => { calls.push(options); return true; };
  await vm.runInContext(`openClinicForStudentExams('c1', 's1', [{ sessionId: 'e1', examDate: '2026-11-20', examTitle: '중간고사', archiveFile: '${MID}', questionCount: 4 }], { recommendationCount: 18 })`, c);
  assert.deepEqual({ ...calls[0].recommendation }, { countPerStudent: 18, selectionBasis: 'wrong_type' });
});

test('여러 시험 입구: 시험 묶음 키를 모두 찾고 같은 시험은 한 번만, 필터는 모두 보이게 맞춘다', () => {
  const { c } = multiExamApp();
  const same = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionIds: ['o1', 'e1', 'e1'], examKeys: ['', '', ''] } });
  assert.equal(same.examKeys.length, 2, '같은 시험이 겹쳐도 한 번만');
  assert.equal(vm.runInContext("clinicPrintExamPeriodFilters.get('c1')", c), '1mid', '한 학기에 모이면 그 학기');
  const mixed = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionIds: ['o1', 'f1'], examKeys: ['', ''] } });
  assert.equal(mixed.examKeys.length, 2);
  assert.equal(vm.runInContext("clinicPrintExamPeriodFilters.get('c1')", c), 'all', '학기가 갈리면 전체');
  assert.equal(vm.runInContext("clinicPrintExamYearFilters.get('c1')", c), 'all', '연도가 갈리면 전체');
});

test('여러 시험 입구: 원문이 없는 시험은 빼고 나머지로 열며 안내하고, 전부 없으면 null', () => {
  const { c, db } = multiExamApp();
  db.exam_sessions.push({ id: 'x1', student_id: 's1', class_id: 'c1', assignment_id: '', exam_title: '직접입력', exam_date: '2026-11-21', question_count: 5, archive_file: '' });
  const pre = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionIds: ['o1', 'x1'], examKeys: ['', '2026-11-21|직접입력||5'] } });
  assert.equal(pre.examKeys.length, 1);
  assert.equal(c.__toasts.length, 1);
  assert.equal(c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionIds: ['x1'], examKeys: ['2026-11-21|직접입력||5'] } }), null);
});

test('여러 시험 입구: 시험 목록 첫 그리기는 고른 시험들을 모두 체크한다', () => {
  const { c } = multiExamApp();
  const pre = c.clinicPrintResolvePreselect('c1', { preselect: { studentId: 's1', sessionIds: ['o1', 'e1'], examKeys: ['', ''] } });
  vm.runInContext('clinicPrintPendingPreselect = __pre', Object.assign(c, { __pre: pre }));
  c.document.querySelector = () => null;
  c.document.querySelectorAll = () => [];
  const html = c.clinicPrintRenderExamListHtml('c1', 'class');
  const checkedKeys = [...html.matchAll(/name="clinic-print-exam" value="([^"]*)" (checked)?/g)].filter((m) => m[2]).map((m) => m[1]);
  assert.deepEqual(checkedKeys.sort(), [...pre.examKeys].sort());
});

test('여러 시험 입구: 기본 제목은 "이름 오답 클리닉 · 시험 N개"이고, 학생 상세를 거치지 않은 클리닉은 기존 제목 그대로다', () => {
  const { c } = multiExamApp();
  assert.match(c.clinicPrintGetHeaderDefaultTitle('c1'), /학생별 오답 클리닉$/);
  vm.runInContext(`clinicPrintStudentTitleHint = { classId: 'c1', studentId: 's1', examCount: 3 }`, c);
  assert.equal(c.clinicPrintGetHeaderDefaultTitle('c1'), '가학생 오답 클리닉 · 시험 3개');
  vm.runInContext(`clinicPrintStudentTitleHint = { classId: 'c1', studentId: 's1', examCount: 1 }`, c);
  assert.equal(c.clinicPrintGetHeaderDefaultTitle('c1'), '가학생 오답 클리닉');
  c.document.querySelectorAll = (selector) => (selector.includes('clinic-print-student') ? [{ value: 's1' }, { value: 's2' }] : []);
  assert.match(c.clinicPrintGetHeaderDefaultTitle('c1'), /학생별 오답 클리닉$/, '받는 학생이 여럿이면 기존 제목');
});

test('여러 시험 입구: 같은 원본 문항(UID)을 여러 시험에서 틀려도 한 번만 나온다(기존 중복 제거를 그대로 쓴다)', () => {
  const { c } = multiExamApp();
  const item = (uid, date, no) => ({ sourceQuestionUid: uid, sourceArchiveFile: MID, sourceQuestionNo: no, questionNo: no, archiveFile: MID, examDate: date, sourceOriginRefs: [{ sessionId: 'x' + date + no, orderNo: no }] });
  const out = c.clinicPrintDedupeWrongItemsBySource([item('u1', '2026-11-10', 1), item('u2', '2026-11-10', 2), item('u1', '2026-11-20', 7)]);
  assert.equal(out.length, 2);
  assert.equal(out.find((row) => row.sourceQuestionUid === 'u1').sourceOriginRefs.length, 2, '어느 시험에서 틀렸는지 출처는 합쳐 둔다');
});
