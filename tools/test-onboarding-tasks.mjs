import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(source, needle, message) {
  assert(source.includes(needle), `${message}: missing ${needle}`);
}

function assertNotIncludes(source, needle, message) {
  assert(!source.includes(needle), `${message}: unexpected ${needle}`);
}

function functionBlock(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert(start >= 0, `${name} block missing`);
  const next = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, next >= 0 ? next : undefined);
}

const student = read('apmath/js/student.js');
const dashboard = read('apmath/js/dashboard.js');
const route = read('apmath/worker-backup/worker/routes/onboarding.js');
const result = fs.existsSync('CODEX_RESULT.md') ? read('CODEX_RESULT.md') : '';

assertIncludes(student, '실제 등원일', 'registration start date label');
assertIncludes(student, '신입생 적응 확인은 이 날짜를 기준으로 표시됩니다.', 'registration start date guide');
assertIncludes(student, '이미 등원 중인 학생입니다', 'already attending checkbox');
assertIncludes(student, '첫 등원 시작일을 확인해 주세요.', 'already attending guide');
assertIncludes(student, 'getDateTextDaysAgo(7)', 'already attending date suggestion');
assertIncludes(student, "api.post('onboarding/tasks/bootstrap'", 'bootstrap API call');
assertIncludes(student, 'student_id:', 'bootstrap sends student_id');
assertIncludes(student, 'class_id:', 'bootstrap sends class_id');
assertIncludes(student, 'onboarding_started_at:', 'bootstrap sends onboarding_started_at');
assertNotIncludes(student, 'teacher_id:', 'frontend must not send teacher_id');
assertNotIncludes(student, 'teacherId:', 'frontend must not send teacherId');
assertNotIncludes(student, 'String(classId) !== String(currentClassId) || isNewChecked', 'existing new student save must not re-bootstrap only because checkbox is checked');
assertIncludes(student, 'wasNewChecked', 'edit flow tracks previous new-student state');
assertIncludes(student, 'becameNew', 'edit flow compares previous/current new-student state');
assertIncludes(student, '!wasNewChecked && isNewChecked', 'edit flow only bootstraps when becoming new');
assertIncludes(student, 'classChanged', 'edit flow tracks class changes');
assertIncludes(student, 'classChanged || becameNew', 'edit bootstrap condition is narrowed');

assertIncludes(dashboard, "api.get('onboarding/tasks')", 'dashboard fetches tasks with separate API');
assertNotIncludes(dashboard, 'initial-data/onboarding', 'dashboard must not change initial-data shape');
assertIncludes(dashboard, '신입생 적응 확인', 'dashboard section title');
assertIncludes(dashboard, '담임 인사', 'intro card title');
assertIncludes(dashboard, '첫 수업 전후로 학부모님께 짧게 첫인사를 건네주세요.', 'intro card description');
assertIncludes(dashboard, '1주차 적응 확인', 'week1 card title');
assertIncludes(dashboard, '첫 주 수업 태도와 숙제 흐름을 가볍게 확인해 주세요.', 'week1 card description');
assertIncludes(dashboard, '1개월 정착 상담', 'month1 card title');
assertIncludes(dashboard, '한 달간의 적응 상태와 다음 달 공부 방향을 정리해 주세요.', 'month1 card description');
assertIncludes(dashboard, '확인하기', 'card button label');
assertIncludes(dashboard, '확인 전', 'needs_action status label');
assertIncludes(dashboard, '연락 남김', 'contacted status label');
assertNotIncludes(dashboard, '연락 예정', 'old contacted status label must not remain');
assertIncludes(dashboard, '나중에 다시 보기', 'deferred status label');
assertIncludes(dashboard, "!['completed', 'skipped'].includes", 'frontend hides closed tasks defensively');
assertIncludes(dashboard, 'openOnboardingTask', 'button is wired to no-op placeholder');
assertIncludes(dashboard, 'console.debug', 'button does not mutate state');

const onboardingDashboardBlock = dashboard.slice(
  dashboard.indexOf('function ensureDashboardOnboardingState'),
  dashboard.indexOf('function renderDashboard')
);
assertNotIncludes(onboardingDashboardBlock, "api.post('onboarding/tasks/", 'confirm button must not POST action APIs');
assertNotIncludes(onboardingDashboardBlock, "api.patch('onboarding/tasks/", 'confirm button must not PATCH action APIs');
for (const forbidden of ['D+14', '빨간색 경고', '관리 대상', '스킵', '삭제', '필수 상담', '원장 확인', '대시보드 알림', '케어 시작', '후보군']) {
  assertNotIncludes(onboardingDashboardBlock, forbidden, `forbidden onboarding UI text ${forbidden}`);
}

assertIncludes(route, 'PATCH', 'PATCH handling exists');
for (const action of ['complete', 'contact', 'defer', 'skip']) {
  assertIncludes(route, `path[4] === '${action}'`, `${action} route handling exists`);
}
for (const fnName of ['completeTask', 'contactTask', 'deferTask', 'skipTask']) {
  assertIncludes(route, `async function ${fnName}`, `${fnName} exists`);
}
assertIncludes(route, "const TERMINAL_STATUSES = new Set(['completed', 'skipped'])", 'terminal statuses guard exists');
assertIncludes(route, 'loadTaskForWrite', 'guarded task loader exists');
assertIncludes(route, "Task already closed", 'terminal guard response exists');
assertIncludes(route, "status NOT IN ('completed', 'skipped')", 'write update terminal condition exists');
assertIncludes(route, 'getChangeCount', 'write update changes are checked');
assertIncludes(route, 'INSERT INTO consultations', 'complete inserts consultation');
assertIncludes(route, 'completed_consultation_id', 'complete stores consultation id');
assertIncludes(route, 'validateCompletePayload', 'complete validation exists');

const contactBlock = functionBlock(route, 'contactTask');
const deferBlock = functionBlock(route, 'deferTask');
const skipBlock = functionBlock(route, 'skipTask');
assertNotIncludes(contactBlock, 'INSERT INTO consultations', 'contact must not insert consultation');
assertNotIncludes(deferBlock, 'INSERT INTO consultations', 'defer must not insert consultation');
assertNotIncludes(skipBlock, 'INSERT INTO consultations', 'skip must not insert consultation');
assertNotIncludes(skipBlock, 'DELETE FROM onboarding_tasks', 'skip must not delete task row');

assertIncludes(route, 'SELECT id, student_id, class_id, status FROM student_enrollments WHERE id = ?', 'bootstrap validates enrollment status');
assertIncludes(route, "String(enrollment.status || '') !== 'active'", 'inactive enrollment is rejected');
assertIncludes(route, 'class_students WHERE student_id = ? AND class_id = ?', 'bootstrap validates student-class relation');
assertIncludes(route, "status = 'active'", 'bootstrap validates active enrollment relation');
assertIncludes(route, 'resolveTaskTeacherId', 'route resolves teacher id server side');
assertIncludes(route, 'body.teacher_id || body.teacherId', 'route may inspect requested teacher id');
assertIncludes(route, 'isAdminUser(actor)', 'requested teacher id requires admin path');
assertIncludes(route, 'teacher_classes WHERE teacher_id = ? AND class_id = ?', 'admin requested teacher must handle class');
assertIncludes(route, 'classTeacher?.id || actor.id', 'non-admin default teacher id order');
assertIncludes(route, "ot.status != 'deferred'", 'deferred future filter exists');
assertIncludes(route, 'ot.deferred_until <= ?', 'deferred due filter exists');

assertIncludes(route, '담임 인사', 'intro consultation type is fixed');
assertNotIncludes(route, '입회 인사', 'old intro consultation type must not remain');
for (const label of ['수업 적응 상태:', '숙제 적응 상태:', '한 달 적응 요약:', '다음 달 공부 방향:']) {
  assertIncludes(route, label, `Korean consultation label ${label}`);
}
for (const label of ['lesson_adaptation_status:', 'homework_adaptation_status:', 'month_summary:', 'next_month_plan:']) {
  assertNotIncludes(route, label, `English developer label ${label}`);
}

assertIncludes(result, 'Round 2+3-1', 'CODEX_RESULT records this correction round');
assertIncludes(result, '검수팩', 'CODEX_RESULT records review pack');

console.log('PASS onboarding Round 2+3-1 static checks');
