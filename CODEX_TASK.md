cd /mnt/c/Users/USER/Desktop/AP------

cat > CODEX_TASK.md <<'EOF'
[AP Math OS 학생포털 → 플래너 자동 로그인 핀포인트 패치]

목표:
학생포털에서 이름 + PIN으로 로그인한 뒤 플래너 버튼을 누르면, 플래너에서 다시 PIN 로그인을 요구하지 않고 바로 진입되게 한다.

수정 대상 파일:
- apmath/student/index.html

수정 금지:
- apmath/planner/index.html 수정 금지
- Worker 수정 금지
- DB/schema 수정 금지
- 과제 기능 수정 금지
- OMR 기능 수정 금지
- UI 디자인 수정 금지
- 기존 API_BASE 수정 금지
- 불필요한 리팩터링 금지

현재 원인:
학생포털은 SESSION_KEY = 'APMATH_STUDENT_PORTAL_SESSION'으로 로그인 세션을 저장한다.
하지만 플래너는 PLANNER_SID / PLANNER_PIN 또는 URL의 student_id / pin을 기준으로 자동 로그인한다.
현재 openPlanner()는 student_id만 넘기고 pin을 넘기지 않아서 플래너가 다시 로그인 화면을 띄운다.

수정 1:
loginStudent() 안에서 로그인 성공 후 만드는 next 객체에 pin을 추가한다.

기존 형태:
const next = {
  student_id: data.student.id,
  name: data.student.name,
  grade: data.student.grade || '',
  school_name: data.student.school_name || '',
  student_token: data.student_token,
  login_at: new Date().toISOString()
};

교체 형태:
const next = {
  student_id: data.student.id,
  name: data.student.name,
  grade: data.student.grade || '',
  school_name: data.student.school_name || '',
  student_token: data.student_token,
  pin,
  login_at: new Date().toISOString()
};

수정 2:
saveSession(next) 함수를 교체한다.

기존:
function saveSession(next) {
  session = next;
  localStorage.setItem(SESSION_KEY, JSON.stringify(next));
}

교체:
function saveSession(next) {
  session = next;
  localStorage.setItem(SESSION_KEY, JSON.stringify(next));

  if (next?.student_id && next?.pin) {
    localStorage.setItem('PLANNER_SID', String(next.student_id));
    localStorage.setItem('PLANNER_PIN', String(next.pin));
    sessionStorage.setItem('PLANNER_SID', String(next.student_id));
    sessionStorage.setItem('PLANNER_PIN', String(next.pin));
  }
}

수정 3:
openPlanner() 함수를 교체한다.

기존:
function openPlanner() {
  if (!session?.student_id) return toast('로그인이 필요합니다.');
  location.href = `../planner/?student_id=${encodeURIComponent(session.student_id)}`;
}

교체:
function openPlanner() {
  if (!session?.student_id) return toast('로그인이 필요합니다.');

  if (session?.pin) {
    localStorage.setItem('PLANNER_SID', String(session.student_id));
    localStorage.setItem('PLANNER_PIN', String(session.pin));
    sessionStorage.setItem('PLANNER_SID', String(session.student_id));
    sessionStorage.setItem('PLANNER_PIN', String(session.pin));
  }

  const params = new URLSearchParams();
  params.set('student_id', String(session.student_id));
  if (session?.pin) params.set('pin', String(session.pin));

  location.href = `../planner/?${params.toString()}`;
}

수정 4:
clearSession() 함수를 교체한다.

기존:
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  session = null;
  homeData = null;
}

교체:
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('PLANNER_SID');
  localStorage.removeItem('PLANNER_PIN');
  sessionStorage.removeItem('PLANNER_SID');
  sessionStorage.removeItem('PLANNER_PIN');
  session = null;
  homeData = null;
}

검증:
1. apmath/student/index.html 문법 오류가 없어야 한다.
2. 학생포털 로그인 후 localStorage에 APMATH_STUDENT_PORTAL_SESSION, PLANNER_SID, PLANNER_PIN이 저장되어야 한다.
3. 학생포털에서 플래너 열기를 누르면 URL에 student_id와 pin이 같이 붙어야 한다.
4. 플래너에서 다시 로그인 화면이 뜨지 않아야 한다.
5. 학생포털 로그아웃 시 PLANNER_SID / PLANNER_PIN도 삭제되어야 한다.

node --check:
HTML 파일이라 node --check 직접 대상은 아니다.
대신 index.html 내부 script 문법을 별도 임시 JS로 추출해 문법 검사를 시도하거나, 불가능하면 CODEX_RESULT.md에 “HTML 내부 script 문법 수동 검토 완료”라고 기록한다.

완료 보고는 터미널에 길게 출력하지 마라.
프로젝트 루트의 CODEX_RESULT.md에만 저장하라.

CODEX_RESULT.md에는 아래 항목만 작성한다.
1. 수정 파일
2. 수정한 함수
3. 구현 완료 내용
4. 문법 검증 결과
5. 수동 테스트 체크리스트
6. 미해결/주의 항목

터미널에는 마지막에 아래 한 줄만 출력하라.
CODEX_RESULT.md에 완료 보고를 저장했습니다.
EOF

