cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## GOAL

아직 실행 전이므로, 학생 플래너/선생님용 플래너 확인 화면의 현재 문제를 한 번에 정리한다.

이번 작업은 아래 3개를 한 번에 처리한다.

1. 선생님용 반 플래너 확인 화면 UI 복구
2. 학생 플래너 AI 코치 중복 노출 제거
3. 학생 플래너 우상단 `시험 변경`을 `로그아웃`으로 변경

이번 작업은 UI 회귀 복구 + 플래너 화면 정리 작업이다.
백엔드, DB, route, schema, migration은 건드리지 않는다.

## CURRENT PROBLEMS

### 문제 1. 선생님용 반 플래너 확인 화면 UI 깨짐

현재 `반 화면 > 플래너 확인` 화면이 브라우저 기본 HTML처럼 보인다.

증상:

- `플래너 확인` 모달은 뜨지만 전체 UI가 허접하게 보임
- `반 화면`, `지난 주`, `이번 주`, `다음 주`, `요일별`, `주간별` 버튼이 기본 버튼처럼 보임
- 날짜 버튼도 기본 table/button처럼 보임
- 학생 이름과 `등록된 계획 없음`이 단순 텍스트로 나열됨
- 카드/간격/배경/테두리/스크롤/반응형 스타일이 적용되지 않은 상태

대상 화면:

- 반 화면
- 플래너 확인
- 반 전체 학생 플래너 확인 모달
- 요일별 보기
- 주간별 보기
- 이번 주 / 다음 주 이동
- 학생별 `등록된 계획 없음` 표시

### 문제 2. 학생 플래너 AI 코치 중복 노출

현재 PC 화면에서 `AI 코치`가 아래 두 위치에 동시에 나온다.

- 왼쪽 사이드 패널
- 본문 상단

한 화면에 같은 문구가 두 번 보일 필요가 없다.

정리 기준:

- PC 화면: 왼쪽 사이드 AI 코치만 유지
- PC 화면: 본문 상단 AI 코치 숨김
- 모바일 화면: 사이드 패널이 안 보이므로 본문 상단 AI 코치만 유지
- 한 화면에 `AI 코치`는 1개만 보여야 함

### 문제 3. 학생 플래너 우상단 `시험 변경` 중복

현재 우상단 `시험 변경`은 왼쪽 사이드의 `시험 일정 > 변경`과 역할이 겹친다.

정리 기준:

- 우상단 `시험 변경`은 `로그아웃`으로 바꾼다.
- 시험 일정 변경 기능은 왼쪽 `시험 일정` 카드의 `변경` 버튼으로만 유지한다.
- `openExamDateModal()`과 시험일 변경 모달은 삭제하지 않는다.
- 기존 `resetAuth()`를 재사용한다.

## RULEBOOK

작업 전 반드시 아래 문서를 읽고 원칙을 적용한다.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `docs/WANGJI_OS_ROADMAP.md`
- `docs/WANGJI_OS_STRUCTURE.md`

반드시 지킬 것:

- 기존 문구·버튼명·화면명 임의 변경 금지
- 화면은 간략하게, 한 화면에 중복 노출하지 않기
- 숨겨진 기능이나 foundation 기능을 UI로 새로 꺼내지 않기
- 이번 작업 범위 밖 신규 기능 추가 금지
- 학생용 플래너 AI 코치 문구 세트 임의 변경 금지
- 상담 AI 수정 금지
- 학생 포털 수정 금지
- OMR/시험지/archive 흐름 수정 금지
- 대시보드 신규 카드 추가 금지
- schema.sql 수정 금지
- migration 생성 금지
- Worker route 수정 금지
- git add 금지
- git commit 금지
- git push 금지

## SCOPE

### 수정 대상

- `apmath/js/classroom.js`
- `apmath/planner/index.html`
- `CODEX_RESULT.md`

### 필요 시 확인만 가능

- `apmath/js/student.js`
- `apmath/js/core.js`
- `apmath/worker-backup/worker/routes/reports-ai.js`
- `apmath/worker-backup/worker/routes/planner.js`

### 수정 금지

- `apmath/js/student.js`
- `apmath/worker-backup/worker/routes/reports-ai.js`
- `apmath/worker-backup/worker/routes/planner.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/*`
- `apmath/student/index.html`
- `apmath/js/dashboard.js`
- `apmath/js/report.js`
- `apmath/js/management.js`
- `apmath/js/timetable.js`
- archive 관련 파일
- 학생 포털 OMR route
- 수납·출납 route
- 실제 발송 provider 관련 파일

## PART A. 선생님용 반 플래너 확인 화면 UI 복구

## A-1. 관련 렌더 함수 찾기

`apmath/js/classroom.js`에서 아래 키워드로 관련 함수를 찾는다.

- `플래너 확인`
- `반 전체 학생 플래너 확인`
- `요일별`
- `주간별`
- `등록된 계획 없음`
- `planner`
- `weekly`
- `daily`

확인할 것:

- 어떤 함수가 현재 화면을 렌더하는지
- 모달 body HTML을 어디서 만드는지
- 버튼/날짜 탭/학생 목록이 어떤 class로 렌더되는지
- 스타일 주입 함수가 있는지
- 최근 수정으로 class가 빠졌는지
- 기존 showModal 구조와 충돌하는지

## A-2. 전용 스타일 주입 함수 추가 또는 복구

`classroom.js` 안에 선생님용 플래너 확인 화면 전용 스타일 주입 함수를 만든다.

권장 함수명:

- `injectClassPlannerReviewStyles()`

조건:

- 이미 비슷한 함수가 있으면 새로 만들지 말고 보강한다.
- style id 중복 방지한다.
- 예: `class-planner-review-style`
- 전역 공통 스타일을 깨지 않는다.
- 다른 모달에 영향을 최소화한다.
- selector는 전용 wrapper class 아래로 제한한다.

전용 wrapper class 예:

- `.class-planner-review`
- `.cpr-toolbar`
- `.cpr-nav`
- `.cpr-toggle`
- `.cpr-date-tabs`
- `.cpr-date-btn`
- `.cpr-student-card`
- `.cpr-student-name`
- `.cpr-empty`
- `.cpr-plan-chip`
- `.cpr-week-grid`

## A-3. 모달 전체 구조 복구

현재 화면을 아래 구조로 정리한다.

상단:

- 반 이름
- `반 전체 학생 플래너 확인`

그 아래 toolbar:

- `반 화면`
- `지난 주`
- `이번 주`
- `다음 주`

그 아래 보기 전환:

- `요일별`
- `주간별`

그 아래 날짜 탭:

- 월 05-18
- 화 05-19
- 수 05-20
- 목 05-21
- 금 05-22
- 토 05-23
- 일 05-24

그 아래 학생 목록:

- 학생 카드 단위
- 학생 이름 굵게
- 등록된 계획이 없으면 조용한 빈 상태 표시
- 계획이 있으면 과목/완료 여부/계획 제목을 chip 또는 리스트로 표시

중요:

- 기본 button/table 느낌 제거
- 카드형 UI 적용
- 날짜 탭은 가로 스크롤 가능하게
- 모바일에서도 화면 밖으로 깨지지 않게
- PC에서는 적당한 폭과 grid 사용
- 모달 내부에서만 스크롤되게

## A-4. 요일별 UI 기준

요일별 보기에서는 선택된 날짜 기준으로 반 학생 전체를 보여준다.

디자인 기준:

- 선택 날짜 헤더는 작게 표시
- 학생별 카드 반복
- 학생 이름과 계획 상태가 한눈에 보여야 함
- `등록된 계획 없음`은 회색/보조 텍스트로 작게 표시
- 불필요하게 큰 빈 박스 금지
- 학생 카드 간격 8~10px
- 전체가 너무 길면 모달 내부 스크롤

기존 문구 유지:

- `등록된 계획 없음`

## A-5. 주간별 UI 기준

주간별 보기가 이미 구현되어 있으면 스타일만 복구한다.

주간별 보기 기준:

- 학생명 왼쪽
- 월~일 열
- 각 칸에 계획 chip 표시
- 계획 없음은 `-` 또는 빈칸처럼 조용히
- 모바일에서는 가로 스크롤 허용
- table 기본 테두리 느낌 말고 AP Math 카드형 표 느낌으로 정리

주의:

- 주간별 기능 자체를 새로 갈아엎지 않는다.
- 기존 데이터 병합 로직 유지
- 완료/미완료 구분 로직 유지

## A-6. 버튼 스타일 기준

기본 버튼처럼 보이면 FAIL이다.

버튼 스타일:

- border-radius 10~14px
- min-height 34~40px
- font-size 12~13px
- font-weight 700
- active 상태 명확히
- primary 버튼은 `var(--primary)` 계열 사용
- 보조 버튼은 surface/border 계열 사용
- 모바일에서 터치 영역 충분히 확보

문구 변경 금지:

- `반 화면`
- `지난 주`
- `이번 주`
- `다음 주`
- `요일별`
- `주간별`

## A-7. 날짜 탭 스타일 기준

날짜 탭은 기본 table/button처럼 보이면 FAIL이다.

기준:

- flex row
- gap 6px
- overflow-x auto
- 선택 날짜 active 스타일
- 요일과 날짜가 한 버튼 안에서 보기 좋게 표시
- 모바일에서 가로 스크롤
- 버튼 높이 36~42px

## A-8. 학생 카드 스타일 기준

학생별 항목은 기본 텍스트 나열이면 FAIL이다.

기준:

- 학생별 카드 또는 row
- 이름은 14px 정도 굵게
- 계획 없음은 12~13px 보조색
- 계획 있으면 chip/list
- 완료 계획은 opacity 또는 체크 표시
- 미완료 계획은 일반 강조
- 카드 padding 12px 내외
- border-radius 14~16px
- border var(--border)
- background var(--surface)

## A-9. 선생님용 반 플래너 기존 기능 보존

반드시 보존:

- 반 화면으로 돌아가기
- 지난 주 이동
- 이번 주 이동
- 다음 주 이동
- 요일별 보기
- 주간별 보기
- 날짜 선택
- 학생별 플래너 조회
- 계획 없음 표시
- 계획 제목 표시
- 완료/미완료 구분
- 모바일/PC 표시

절대 금지:

- 학생용 플래너 AI 코치 수정
- 학생용 planner/index.html의 코치 문구 세트 수정
- planner route 수정
- 새 API 생성
- schema/migration 변경
- 문구 변경
- 대시보드 변경

## PART B. 학생 플래너 AI 코치 중복 노출 제거

## B-1. 현재 AI 코치 렌더 위치 확인

`apmath/planner/index.html`에서 아래를 확인한다.

- `AI 코치`
- `planner-coach-slot`
- `renderPlannerCoach`
- `updatePlannerCoach`
- `schedulePlannerCoachUpdate`
- side-panel 내부 렌더 위치
- main-panel 내부 렌더 위치

현재 PC 화면에서 좌측 사이드와 본문 상단에 같은 코치가 중복 노출된다.
이 중복을 제거한다.

## B-2. 표시 기준

PC 화면:

- 왼쪽 사이드 패널의 `AI 코치`만 표시
- 본문 상단 `AI 코치`는 숨김

모바일 화면:

- 사이드 패널이 보이지 않으므로 본문 상단 `AI 코치`만 표시

공통:

- 한 화면에 `AI 코치`는 1개만 보이게 한다.
- `PLANNER_COACH_MESSAGES`는 수정하지 않는다.
- 코치 상태 계산 로직은 수정하지 않는다.
- 코치 카드가 있는 slot이 하나든 둘이든 update 함수가 정상 갱신되게 한다.
- API 호출 추가 금지.
- Claude API 호출 금지.
- 자동 저장/자동 수정 금지.

권장 class:

- `.planner-coach-side`
- `.planner-coach-main`

권장 CSS:

- `.planner-coach-side`: PC에서만 표시
- `.planner-coach-main`: 모바일에서만 표시

## B-3. 기존 플래너 코치 기능 보존

반드시 보존:

- `AI 코치` 카드
- 로컬 규칙 기반 피드백
- 계획 입력값 반영
- 완료 체크 상태 반영
- 확정 문구 세트
- API 호출 없음
- Claude API 호출 없음
- 자동 저장/자동 수정 없음
- 상담/성적/수납/출결 데이터 미사용

금지:

- `PLANNER_COACH_MESSAGES` 문구 수정
- 새로운 AI 호출 추가
- 코치 클릭으로 계획 자동 변경
- 저장 API 호출

## PART C. 학생 플래너 우상단 `시험 변경`을 `로그아웃`으로 변경

## C-1. 우상단 시험 변경 제거

현재 우상단에 표시되는 `시험 변경` 버튼은 제거하거나 로그아웃으로 교체한다.

기준:

- 우상단에서 `시험 변경` 문구가 보이면 FAIL
- 시험 일정 변경 기능 자체는 삭제하지 않는다.
- 왼쪽 사이드 `시험 일정` 카드의 `변경` 버튼은 그대로 유지한다.
- `openExamDateModal()` 함수는 유지한다.
- 시험일 변경 모달도 유지한다.

## C-2. 우상단을 로그아웃으로 변경

우상단 버튼 문구를 `로그아웃`으로 표시한다.

기준:

- 우상단 `로그아웃` 클릭 시 기존 `resetAuth()`를 호출한다.
- 새 로그아웃 로직을 따로 만들지 않는다.
- 기존 `resetAuth()`가 localStorage/sessionStorage의 `PLANNER_SID`, `PLANNER_PIN`, `PLANNER_SUBJECT`를 제거하고 로그인 화면으로 돌아가면 그대로 사용한다.
- 로그아웃 버튼은 너무 크지 않게 한다.
- 기존 완료율 표시를 과하게 밀어내지 않는다.

권장 구조:

- 상단 오른쪽:
  - `로그아웃`
  - `0%` 또는 기존 완료율

현재 top 영역에 있는 `top-dday` 버튼이 `시험 변경` 역할이면, 그 버튼은 로그아웃 버튼으로 바꾼다.

예시:

- 기존: `<button id="top-dday" onclick="openExamDateModal()">시험 변경</button>`
- 변경: `<button id="top-dday" onclick="resetAuth()">로그아웃</button>`

단, id 이름을 꼭 바꿀 필요는 없다.
기존 CSS/JS 영향이 크면 id는 유지하고 역할만 바꿔도 된다.
다만 D-day 표시 갱신 함수가 `top-dday`에 다시 `시험 변경` 또는 D-day 문구를 넣고 있으면 그 로직도 함께 보정한다.

## C-3. 시험 일정 변경은 왼쪽 카드만 사용

시험일 변경 기능은 왼쪽 `시험 일정` 카드에서만 접근하게 한다.

확인할 것:

- 왼쪽 `시험 일정` 카드에 `변경` 버튼이 있는지
- `변경` 버튼이 `openExamDateModal()`을 호출하는지
- 시험 일정이 미설정이면 기존처럼 `미설정` 표시 유지
- 시험일 저장 기능 유지

금지:

- 시험 일정 변경 기능 삭제 금지
- `openExamDateModal()` 삭제 금지
- 시험 일정 카드 삭제 금지
- 시험 일정 문구 변경 금지

## PART D. 기존 기능 보존

반드시 보존:

- 학생 로그인
- 학생포털 SSO 흐름
- 학생용 플래너 진입
- 주간플래너
- 월간플래너
- 리스트
- 계획 추가/수정/삭제
- 완료 체크
- 시험 일정 카드
- 시험 일정 변경 모달
- AI 코치 로컬 피드백
- AI 코치 문구 세트
- 선생님용 반 플래너 확인
- 요일별/주간별 반 플래너 확인
- 학생별 등록 계획 없음 표시

금지:

- planner route 수정
- reports-ai.js 수정
- student.js 수정
- schema/migration 수정
- 학생포털/OMR/archive 흐름 수정
- 새 API 생성
- 대시보드 수정
- 상담 AI 수정
- 수납·출납 수정

## VERIFY

반드시 실행한다.

### classroom.js 문법 확인

- `node --check apmath/js/classroom.js`

### planner inline script 검증

- `awk '/<script>/{flag=1;next}/<\\/script>/{flag=0}flag' apmath/planner/index.html > /tmp/planner-inline.js`
- `node --check /tmp/planner-inline.js`

### 검색 확인

- `Select-String -Path apmath/js/classroom.js -Pattern "플래너 확인|요일별|주간별|등록된 계획 없음|class-planner-review|injectClassPlannerReviewStyles"`
- `Select-String -Path apmath/planner/index.html -Pattern "시험 변경|시험 일정|변경|로그아웃|resetAuth|openExamDateModal|top-dday|logout-mini|planner-coach-side|planner-coach-main|AI 코치|PLANNER_COACH_MESSAGES"`
- `Select-String -Path apmath/planner/index.html -Pattern "Claude|ai/|consultation|exam_sessions|wrong_answers|attendance|billing"`
- `Select-String -Path apmath/js/student.js -Pattern "상담 흐름 요약|consultation-thread-summary"`
- `Select-String -Path apmath/worker-backup/worker/routes/reports-ai.js -Pattern "consultation-thread-summary|planner-coach"`

### git 확인

- `git status --short`
- `git diff --name-only`

## FAIL 기준

아래 중 하나라도 해당하면 FAIL이다.

### 선생님용 반 플래너 확인 화면

- 현재 화면처럼 기본 HTML 버튼/table 느낌이 남아 있으면 FAIL
- `플래너 확인` 문구 변경 시 FAIL
- `반 화면/지난 주/이번 주/다음 주/요일별/주간별` 문구 변경 시 FAIL
- `등록된 계획 없음` 문구 변경 시 FAIL
- 요일별 보기 기능이 깨지면 FAIL
- 주간별 보기 기능이 깨지면 FAIL

### 학생 플래너 AI 코치

- PC에서 AI 코치가 두 번 보이면 FAIL
- 모바일에서 AI 코치가 안 보이면 FAIL
- `PLANNER_COACH_MESSAGES` 문구를 임의 변경하면 FAIL
- Claude/API 호출이 추가되면 FAIL
- 자동 저장/자동 수정이 생기면 FAIL

### 우상단 로그아웃

- 우상단에 `시험 변경`이 계속 보이면 FAIL
- 로그아웃 버튼이 화면 어디에도 안 보이면 FAIL
- 로그아웃이 `resetAuth()`를 사용하지 않으면 FAIL
- 왼쪽 시험 일정 변경 기능이 사라지면 FAIL

### 공통

- route/schema/migration이 바뀌면 FAIL
- student.js 수정 시 FAIL
- reports-ai.js 수정 시 FAIL
- 학생포털/OMR/archive 흐름이 바뀌면 FAIL
- 대시보드가 바뀌면 FAIL

## OUTPUT

루트의 `CODEX_RESULT.md`를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일

실제 수정 파일만 적는다.

## 2. 구현 완료 또는 확인 완료

### 선생님용 반 플래너 확인 UI

- 선생님용 반 플래너 확인 UI 스타일 복구 여부
- 기본 HTML 버튼/table 느낌 제거 여부
- 전용 스타일 주입 함수 추가/복구 여부
- 요일별 보기 카드형 UI 복구 여부
- 주간별 보기 표/카드형 UI 복구 여부
- 날짜 탭 스타일 복구 여부
- 학생별 카드 스타일 복구 여부
- `등록된 계획 없음` 표시 보존 여부
- `반 화면/지난 주/이번 주/다음 주/요일별/주간별` 기능 보존 여부

### 학생 플래너 AI 코치

- AI 코치 PC 중복 노출 제거 여부
- PC에서는 사이드 AI 코치만 표시되는지 여부
- 모바일에서는 본문 AI 코치만 표시되는지 여부
- AI 코치 문구/로직 보존 여부
- API/Claude 호출 추가 없음 확인
- 자동 저장/자동 수정 없음 확인

### 우상단 로그아웃

- 우상단 `시험 변경` 제거 여부
- 우상단 `로그아웃` 표시 여부
- 로그아웃이 기존 `resetAuth()`를 사용하는지 여부
- 로그아웃 시 PLANNER_SID/PLANNER_PIN 제거 여부
- 왼쪽 `시험 일정` 카드의 `변경` 버튼 유지 여부
- 시험 일정 변경 모달 유지 여부

### 공통 보존

- 학생용 planner/index.html 기존 저장/수정/삭제 흐름 보존 여부
- 학생 로그인/SSO 흐름 보존 여부
- 주간플래너/월간플래너/리스트 보존 여부
- 계획 추가/수정/삭제/완료 체크 보존 여부
- 상담 AI 미수정 확인
- student.js 미수정 확인
- reports-ai.js 미수정 확인
- route/schema/migration 미수정 확인
- 기존 문구·버튼명·화면명 임의 변경 없음 확인

## 3. 실행 결과

- `node --check apmath/js/classroom.js` 결과
- planner inline script `node --check` 결과
- 검색 확인 결과
- `git status --short` 결과
- `git diff --name-only` 결과

## 4. 결과 요약

짧게 정리한다.

## 5. 다음 조치

- 사용자가 직접 반 화면 → 플래너 확인 화면 확인
- 사용자가 직접 요일별 보기 확인
- 사용자가 직접 주간별 보기 확인
- 사용자가 직접 PC에서 AI 코치가 1개만 보이는지 확인
- 사용자가 직접 모바일에서 AI 코치가 보이는지 확인
- 사용자가 직접 PC에서 우상단이 로그아웃으로 보이는지 확인
- 사용자가 직접 로그아웃 후 로그인 화면으로 돌아가는지 확인
- 사용자가 직접 왼쪽 시험 일정 변경 버튼이 정상인지 확인
- 사용자가 직접 계획 추가/수정/삭제/완료 체크 확인
- 사용자가 직접 git add/commit/push

## 6. 위험했던 점 / 보존한 점

반드시 적는다.

- 선생님용 반 플래너 확인 UI가 기본 HTML처럼 깨진 점
- 기존 문구를 보존한 점
- AI 코치가 중복 노출되어 화면이 과했던 점
- 한 화면에 AI 코치를 하나만 보이게 줄인 점
- 우상단 시험 변경과 왼쪽 시험 일정 변경이 중복이었던 점
- 우상단을 로그아웃으로 바꿔 접근성을 보강한 점
- 시험 일정 변경 기능은 왼쪽 카드에 보존한 점
- 기존 플래너 코치 문구/로직을 건드리지 않은 점
- 기존 학생 SSO/저장/수정/삭제 흐름을 보존한 점
- 상담 AI를 건드리지 않은 점
- route/schema/migration을 건드리지 않은 점

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF