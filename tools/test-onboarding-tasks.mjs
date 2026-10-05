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

function countFunctionDefinitions(source, name) {
  const pattern = new RegExp(`function\\s+${name}\\s*\\(`, 'g');
  return [...source.matchAll(pattern)].length;
}

function functionBlock(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} block missing`);
  const next = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, next >= 0 ? next : undefined);
}

const dashboard = read('apmath/js/dashboard.js');
const student = read('apmath/js/student.js');
const route = read('apmath/worker-backup/worker/routes/onboarding.js');
const result = fs.existsSync('CODEX_RESULT.md') ? read('CODEX_RESULT.md') : '';

const onboardingStart = dashboard.indexOf('function ensureDashboardOnboardingState');
assert(onboardingStart >= 0, 'dashboard onboarding block start missing');
const onboardingEnd = dashboard.indexOf('function renderDashboard', onboardingStart);
assert(onboardingEnd >= 0, 'dashboard onboarding block end missing');
const onboardingBlock = dashboard.slice(onboardingStart, onboardingEnd);

assertIncludes(dashboard, "api.get('onboarding/tasks')", 'dashboard fetches onboarding tasks');
assertNotIncludes(dashboard, 'initial-data/onboarding', 'dashboard must not change initial-data shape');
assertNotIncludes(student, 'teacher_id:', 'student registration must not send teacher_id');
assertNotIncludes(student, 'teacherId:', 'student registration must not send teacherId');

for (const text of [
  '복사되었습니다.',
  '신입생과 학부모님이 학원에 처음 안착하는 가장 중요한 첫 단추입니다.',
  '가볍게 인사를 건네어 긴장감을 풀어주세요.',
  '첫 수업에 필요한 교재나 필기구',
  '학부모님의 불안감을 낮추는 데 큰 도움이 됩니다.',
  '수업 시간의 몰입도는 어땠나요?',
  '첫 주 숙제 분량은 적절히 해왔나요?',
  '잘해옴',
  '[더 볼 부분]이 눈에 밟혀',
  '성실하게 지도하겠습니다.',
  '담임인 제가 미리 알고 있으면 도움 될 만한 점',
  '학원 얘기나 수학 공부'
]) {
  assertIncludes(onboardingBlock, text, `required Round 4-3 onboarding text ${text}`);
}


for (const text of [
  '안녕하세요, 어머니! AP수학 [반명] 담임 [선생님명]선생님입니다.',
  '처음에는 학원 시스템이나 숙제 방식에 익숙해지는 시간이 조금 필요할 수 있습니다.',
  '혹시 학원에 오기 전 수학 공부를 하면서 힘들어했던 부분이나,',
  '어머니, 담임 [선생님명]선생님입니다.',
  '[학생명] 학생이 AP수학에서 첫 일주일간의 수업을 무사히 마쳤습니다.',
  '집에서 느끼신 점이 있다면 언제든 편하게 말씀해 주세요. 다음 수업도 잘 이어가겠습니다.',
  '어머니, [학생명] 학생이 저희와 함께 수업을 시작한 지 벌써 한 달이 되었습니다.',
  '전화나 카톡으로 집에서의 아이 반응을 가볍게 물어보시면, 학부모님의 불안감을 낮추는 데 큰 도움이 됩니다.',
  '한 달간 누적된 출결, 숙제, 테스트 흐름을 바탕으로 앞으로 이 아이가 우리 반에서 어떻게 공부를 이어가면 좋을지 방향을 잡아주는 시점입니다.',
  '이 단계를 넘기면 적응 확인 카드에서 조용히 사라지며, 별도의 상담 기록은 남지 않습니다.'
]) {
  assertIncludes(onboardingBlock, text, `required exact Round 4-3 text ${text}`);
}

for (const text of [
  '담임 인사',
  '1주차 적응 확인',
  '1개월 정착 상담',
  '확인하기',
  '확인 전',
  '연락 남김',
  '나중에 다시 보기',
  '복사하기',
  '이번 단계 넘기기',
  '인사 완료하기',
  '저장하고 완료하기',
  '상담 완료하기',
  '연락만 남기기',
  '저장하기',
  '별도의 상담 기록은 남지 않습니다.'
]) {
  assertIncludes(onboardingBlock, text, `required existing Korean dashboard text ${text}`);
}

for (const text of [
  '복사했습니다.',
  '첫 접점입니다.',
  '긴장감을 낮춰주세요.',
  '교재와 필기구',
  '학부모님의 불안감을 낮추는 데 도움이 됩니다.',
  '수업 시간에 몰입도는 어땠나요?',
  '첫 주 숙제 분량은 적절해 보였나요?',
  '충분해요',
  '[더 볼 부분] 면에 있어',
  '착실하게 지도하겠습니다.',
  '담임에게 미리 알리고 싶은 점',
  '담임 선생님이 미리 알고 있으면 좋을 만한 점',
  '학원 가기나 수학 공부',
  '학원 다니기나 수학 공부',
  '안녕하세요. 어머님 AP수학',
  '처음에는 학원 시스템이나 숙제 방식이 익숙해지는 시간이',
  '학원 다녀온 뒤 수학 공부',
  '어머님 담임',
  '[학생명] 학생은 AP수학',
  '집에서 발견한 점',
  '다음 수업부터 잘 이어가겠습니다.',
  '어머님 [학생명]',
  '한 달간 출결, 숙제',
  '앞으로 아이가 우리 반',
  '사라지며 별도의 상담 기록',
  '연락 대기',
  '연락 예정',
  'D+14',
  '지연',
  '경고',
  '미완료'
]) {
  assertNotIncludes(onboardingBlock, text, `forbidden onboarding text ${text}`);
}

for (const text of [
  '복사했습니다.',
  '첫 접점입니다.',
  '긴장감을 낮춰주세요.',
  '교재와 필기구',
  '수업 시간에 몰입도는 어땠나요?',
  '첫 주 숙제 분량은 적절해 보였나요?',
  '충분해요',
  '면에 있어',
  '착실하게 지도하겠습니다.',
  '담임에게 미리 알리고 싶은 점',
  '학원 가기나 수학 공부',
  '안녕하세요. 어머님 AP수학',
  '처음에는 학원 시스템이나 숙제 방식이 익숙해지는 시간이',
  '학원 다녀온 뒤 수학 공부',
  '어머님 담임',
  '[학생명] 학생은 AP수학',
  '집에서 발견한 점',
  '다음 수업부터 잘 이어가겠습니다.',
  '어머님 [학생명]',
  '한 달간 출결, 숙제',
  '앞으로 아이가 우리 반',
  '사라지며 별도의 상담 기록',
  '연락 대기',
  '연락 예정'
]) {
  assertNotIncludes(onboardingBlock, text, `Round 4-3 forbidden search text ${text}`);
}

const mojibakePatterns = [
  [0x003f, 0xb301, 0xc5eb],
  [0x003f, 0xc88e, 0xc5ef],
  [0x003f, 0xbea4, 0xc524],
  [0x003f, 0xacd5, 0xc52b],
  [0x8e42, 0xb4ed, 0xad97],
  [0x6028, 0xba83, 0xc5ef],
  [0x7b4c],
  [0x91ab],
  [0xfffd]
].map(codes => String.fromCharCode(...codes));
const testSource = read('tools/test-onboarding-tasks.mjs');
for (const pattern of mojibakePatterns) {
  assertNotIncludes(onboardingBlock, pattern, `dashboard mojibake pattern ${pattern}`);
  assertNotIncludes(testSource, pattern, `test mojibake pattern ${pattern}`);
}

const renderPanelBlock = functionBlock(dashboard, 'renderOnboardingPanel');
assertIncludes(renderPanelBlock, 'openOnboardingSkipConfirm', 'skip button opens confirm first');
assertNotIncludes(renderPanelBlock, "handleOnboardingAction('${apEscapeHtml(String(task.id || ''))}', 'skip')", 'skip button must not call skip action directly');
assertIncludes(dashboard, 'function openOnboardingSkipConfirm', 'custom skip confirm opener exists');
assertIncludes(dashboard, 'function closeOnboardingSkipConfirm', 'custom skip confirm cancel exists');
assertIncludes(dashboard, 'function confirmOnboardingSkip', 'custom skip confirm submit exists');
assertIncludes(dashboard, "await handleOnboardingAction(taskId, 'skip')", 'confirm submit calls skip action');
assertIncludes(dashboard, '취소', 'cancel button exists');

for (const name of [
  'ensureDashboardOnboardingState',
  'fetchOnboardingTasks',
  'getOnboardingStatusLabel',
  'getOnboardingTaskLabel',
  'getOnboardingTaskDescription',
  'renderOnboardingTasks',
  'openOnboardingTask',
  'renderOnboardingPanel',
  'handleOnboardingAction',
  'copyOnboardingParentMessage'
]) {
  assert(countFunctionDefinitions(dashboard, name) === 1, `${name} must be defined once`);
}
assert(countFunctionDefinitions(dashboard, 'renderOnboardingTaskPanel') === 0, 'old renderOnboardingTaskPanel must be removed');
assertNotIncludes(onboardingBlock, 'console.debug', 'old onboarding placeholder must be removed');

for (const action of ['complete', 'contact', 'defer', 'skip']) {
  assertIncludes(route, `path[4] === '${action}'`, `${action} route handling exists`);
  assertIncludes(dashboard, "api.post(`onboarding/tasks/${taskId}/" + action + "`", `${action} dashboard API call exists`);
}
assertIncludes(route, 'PATCH', 'PATCH handling exists');
assertIncludes(dashboard, 'api.patch(`onboarding/tasks/${taskId}`', 'patch dashboard API call exists');
assertIncludes(route, "const TERMINAL_STATUSES = new Set(['completed', 'skipped'])", 'terminal statuses guard exists');
assertIncludes(route, 'loadTaskForWrite', 'guarded task loader exists');
assertIncludes(route, 'INSERT INTO consultations', 'complete inserts consultation');
assertIncludes(route, 'completed_consultation_id', 'complete stores consultation id');
assertIncludes(route, 'resolveTaskTeacherId', 'teacher_id injection guard exists');
assertIncludes(route, "String(enrollment.status || '') !== 'active'", 'inactive enrollment guard exists');
assertIncludes(route, "ot.status != 'deferred'", 'deferred future filter exists');

assertIncludes(result, 'Round 4-3', 'CODEX_RESULT records this correction round');
assertIncludes(result, 'AP_ONBOARDING_ROUND_4_3_REVIEW_PACK_20260527.zip', 'CODEX_RESULT records review pack');

console.log('PASS onboarding Round 4-3 copy checks');
