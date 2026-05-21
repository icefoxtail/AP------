cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

/goal APMS Global UI Foundation + Classroom First 하네스 작업을 수행하라.

## 0. 최상위 명령

이번 작업은 “클래스룸을 예쁘게 고치는 작업”이 아니다.

이번 작업은 다음 순서로 진행한다.

1. Academy OS 디자인 언어를 확인한다.
2. APMS 전체 JS 화면에 공통 적용할 UI Foundation 계획 문서를 세분화해서 저장한다.
3. 공통 CSS Foundation을 만든다.
4. 실제 코드 적용은 classroom.js의 1차 안전 영역에만 제한한다.
5. 나머지 JS 파일은 이번 작업에서 수정하지 않고, 향후 적용 계획서만 만든다.
6. 작업 범위를 벗어나는 순간 실패다.

Codex는 임의 판단으로 전체 리뉴얼하지 마라.
Codex는 문구, 버튼명, 화면명을 바꾸지 마라.
Codex는 기능을 새로 만들지 마라.
Codex는 숨겨진 기능을 꺼내지 마라.
Codex는 Academy OS 파일을 수정하지 마라.

---

## 1. 작업명

APMS Global UI Foundation + Classroom First

정의:

Academy OS 디자인 언어를 상위 기준으로 삼아, APMS 전체 JS 화면이 앞으로 같은 UI 언어를 쓰도록 공통 UI Foundation을 만든다.

단, 이번 실제 적용은 classroom.js의 1차 안전 영역에만 제한한다.

---

## 2. 경로 기준

현재 APMS 작업 루트:

C:\Users\USER\Desktop\AP------

Academy OS 참고 루트:

C:\Users\USER\Desktop\academy-os-v2

APMS 작업 루트 기준 Academy OS 상대 경로:

..\academy-os-v2

Academy OS는 sibling repo다.
Academy OS는 참고만 한다.
Academy OS 파일은 절대 수정하지 않는다.

작업 시작 전 반드시 아래 경로 존재 여부를 확인하라.

PowerShell 기준 확인 명령:

Test-Path ..\academy-os-v2
Test-Path ..\academy-os-v2\web-react\src\components
Test-Path ..\academy-os-v2\web-react\src\styles
Test-Path ..\academy-os-v2\web-react\src\config
Test-Path ..\academy-os-v2\web-react\src\config\menuRegistry.js

만약 ..\academy-os-v2 경로가 없으면 추측해서 작업하지 말고, CODEX_RESULT.md에 “Academy OS 참고 경로 없음”으로 기록한다.
그 경우 APMS docs/design 기준과 기존 dashboard/sidebar foundation만 참고해서 작업한다.

---

## 3. 반드시 먼저 확인할 파일

APMS 기준 파일:

- apmath/js/classroom.js
- apmath/index.html
- apmath/css/dashboard-foundation.css
- apmath/css/sidebar-foundation.css
- docs/design/APMS_UI_PRINCIPLES.md
- docs/design/DASHBOARD_FOUNDATION.md
- docs/design/UI_REVIEW_SOP.md
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- CODEX_RESULT.md

Academy OS 참고 파일:

- ..\academy-os-v2\web-react\src\components\Sidebar.jsx
- ..\academy-os-v2\web-react\src\components\Layout.jsx
- ..\academy-os-v2\web-react\src\components\Card.jsx
- ..\academy-os-v2\web-react\src\components\Button.jsx
- ..\academy-os-v2\web-react\src\components\Badge.jsx
- ..\academy-os-v2\web-react\src\config\menuRegistry.js
- ..\academy-os-v2\web-react\src\config\modes.js
- ..\academy-os-v2\web-react\src\styles\design-system.css

없는 파일은 CODEX_RESULT.md에 “참고 불가”로 기록한다.
없는 파일을 있다고 가정하지 마라.

---

## 4. 수정 허용 파일

이번 작업에서 수정 또는 생성 가능한 파일은 아래로 제한한다.

- docs/design/APMS_GLOBAL_UI_FOUNDATION_INDEX.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_TOKENS.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_CARD_ROW.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_BUTTON_CHIP.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_SIDEBAR_BRIDGE.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_DASHBOARD_BRIDGE.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_STUDENT_PORTAL_PLAN.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_FORM_MODAL_PLAN.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_TABLE_EXCEPTION_PLAN.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_ROLLOUT_MAP.md
- docs/design/APMS_GLOBAL_UI_FOUNDATION_REVIEW_SOP.md
- apmath/css/apms-ui-foundation.css
- apmath/css/classroom-foundation.css
- apmath/index.html
- apmath/js/classroom.js
- CODEX_RESULT.md

수정 금지 파일:

- apmath/js/dashboard.js
- apmath/js/cumulative.js
- apmath/js/timetable.js
- apmath/js/report.js
- apmath/js/ui.js
- apmath/student/index.html
- apmath/planner/index.html
- apmath/worker-backup
- apmath/worker
- schema.sql
- archive
- any worker route
- any migration
- Academy OS repo files under ..\academy-os-v2

확인만 가능한 파일:

- apmath/css/dashboard-foundation.css
- apmath/css/sidebar-foundation.css
- docs/design/*
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- Academy OS reference files

---

## 5. 절대 금지

다음은 절대 금지한다.

- git add
- git commit
- git push
- 전체 APMS 디자인 리뉴얼
- 전체 JS 파일 일괄 수정
- dashboard.js 수정
- cumulative.js 수정
- timetable.js 수정
- report.js 수정
- ui.js 수정
- student portal 수정
- worker 수정
- schema 수정
- Academy OS 파일 수정
- 전역 CSS 수정
- body selector 수정
- button selector 수정
- .card 전역 수정
- * selector 수정
- td, tr, input, textarea, select 전역 수정
- 기능 추가
- 기능 삭제
- 숨겨진 관리자 기능 노출
- 기존 문구 변경
- 기존 버튼명 변경
- 기존 화면명 변경
- 기존 toast 문구 변경
- 기존 모달명 변경
- 이모티콘 추가
- 이모지 추가
- 장식용 아이콘 추가
- classroom 저장 로직 변경
- 출결/숙제/상담/플래너 API 호출 변경
- 데이터 구조 변경
- font-weight 700/800/900 신규 추가

---

## 6. 하네스 단계

Codex는 아래 단계 순서대로만 진행한다.

### Gate 0. 경로 확인

- APMS 루트 확인
- Academy OS sibling path 확인
- 참고 파일 존재 여부 기록

### Gate 1. Academy OS 디자인 언어 추출

Academy OS 파일을 확인하고 다음만 추출한다.

- token
- sidebar 구조
- card 구조
- button 구조
- badge/chip 구조
- layout spacing
- typography
- active/hover tone

가져오면 안 되는 것:

- React component implementation
- Tailwind class
- shadcn/ui dependency
- lucide-react dependency
- Academy OS routing
- Academy OS menu names
- SaaS module on/off logic

### Gate 2. APMS 기존 design docs 확인

- APMS_UI_PRINCIPLES.md
- DASHBOARD_FOUNDATION.md
- UI_REVIEW_SOP.md
- PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md

기존 원칙과 충돌하지 않게 계획 문서를 만든다.

### Gate 3. 세분화 계획 문서 저장

먼저 docs/design 아래 계획서들을 생성한다.
이 단계에서 코드 수정하지 마라.

### Gate 4. 공통 CSS Foundation 생성

- apmath/css/apms-ui-foundation.css 생성

### Gate 5. Classroom 전용 CSS 생성

- apmath/css/classroom-foundation.css 생성

### Gate 6. index.html CSS link 추가

- apms-ui-foundation.css
- classroom-foundation.css
중복 link 없이 추가한다.

### Gate 7. classroom.js 1차 안전 영역만 적용

- 전체 classroom.js 리뉴얼 금지
- 안전 영역만 class 기반으로 전환

### Gate 8. 검증

- node --check apmath/js/classroom.js 실행
- index.html link 중복 확인
- 금지 파일 미수정 확인

### Gate 9. CODEX_RESULT.md 작성

---

## 7. 저장할 계획 문서 목록

반드시 아래 12개 문서를 만든다.

### 7.1 docs/design/APMS_GLOBAL_UI_FOUNDATION_INDEX.md

내용:

- 전체 문서 인덱스
- 이 foundation의 목적
- Academy OS와 APMS 관계
- 문서 읽는 순서
- 각 문서 역할
- 이번 작업에서 실제 적용은 classroom first라는 점
- 향후 적용 순서

### 7.2 docs/design/APMS_GLOBAL_UI_FOUNDATION_TOKENS.md

내용:

- Academy OS token을 APMS용 token으로 번역
- 색상 token
- radius token
- spacing token
- typography token
- shadow token
- hover token
- active token
- 금지 token
- APMS 기존 CSS 변수와 충돌 방지 원칙

예시 token 이름:

- --apms-ui-bg
- --apms-ui-surface
- --apms-ui-surface-soft
- --apms-ui-border
- --apms-ui-text
- --apms-ui-muted
- --apms-ui-soft
- --apms-ui-accent
- --apms-ui-radius-card
- --apms-ui-radius-row
- --apms-ui-shadow-card
- --apms-ui-hover

### 7.3 docs/design/APMS_GLOBAL_UI_FOUNDATION_CARD_ROW.md

내용:

- 카드 shell 기준
- 카드 안 카드 금지
- line row 기준
- clickable row 기준
- chevron 사용 기준
- hover 기준
- empty state 기준
- “카드 삭제 X / 카드 안 카드 삭제 O” 원칙

### 7.4 docs/design/APMS_GLOBAL_UI_FOUNDATION_BUTTON_CHIP.md

내용:

- quiet button 기준
- primary button 기준
- danger button 기준
- chip 기준
- 숫자만 bold 금지
- 상태 색상 남발 금지
- 기존 버튼명 보존 원칙

### 7.5 docs/design/APMS_GLOBAL_UI_FOUNDATION_SIDEBAR_BRIDGE.md

내용:

- Academy OS sidebar 구조 확인 결과
- APMS sidebar 이식 기준
- icon + label row 기준
- 섹션 라벨 기준
- active/hover 기준
- APMS ui.js는 이번 작업에서 수정하지 않는다는 점
- 이미 사이드바 작업 완료 상태를 향후 foundation과 연결하는 원칙

### 7.6 docs/design/APMS_GLOBAL_UI_FOUNDATION_DASHBOARD_BRIDGE.md

내용:

- dashboard-foundation.css는 특수 화면 CSS로 유지
- 수/목 journal row 기준
- 원장 선생님 카드 기준
- 오늘일지 outer card 기준
- 상담 병합 기준
- 대시보드는 이번 작업에서 수정하지 않음

### 7.7 docs/design/APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md

내용:

- classroom first 적용 범위
- 반 화면 상단 요약
- 학생 목록 row
- 출결/숙제/플래너/상담 주요 row
- 보류할 위험 영역
- 이모티콘/아이콘 금지
- 기능/문구 보존 원칙

### 7.8 docs/design/APMS_GLOBAL_UI_FOUNDATION_STUDENT_PORTAL_PLAN.md

내용:

- 학생 포털 향후 적용 기준
- 학생 화면은 더 단순하게
- 제출완료/미제출 색상 과다 금지
- 완료 상태는 조용한 텍스트
- 학생이 눌러야 하는 것만 버튼처럼 보이게
- 이번 작업에서는 수정하지 않음

### 7.9 docs/design/APMS_GLOBAL_UI_FOUNDATION_FORM_MODAL_PLAN.md

내용:

- modal 기준
- form 기준
- input 기준
- textarea 기준
- modal 안 card 안 card 금지
- 취소 버튼은 직전 단계 복귀 원칙 보존
- 문구 변경 금지
- 이번 작업에서는 일부만 참고

### 7.10 docs/design/APMS_GLOBAL_UI_FOUNDATION_TABLE_EXCEPTION_PLAN.md

내용:

- 시간표, 출석부, 리포트는 마지막 적용 대상
- 이유: 색상/표/인쇄/PDF 영향이 큼
- 전역 table CSS 금지
- timetable/report/cumulative는 이번 작업에서 수정 금지
- 나중에 별도 설계 후 적용

### 7.11 docs/design/APMS_GLOBAL_UI_FOUNDATION_ROLLOUT_MAP.md

내용:

향후 적용 순서:

1. classroom
2. student portal
3. 상담
4. 교재
5. 수업자료
6. 성적
7. OMR
8. 시간표
9. 출석부
10. 리포트

각 단계에서 필요한 검수 기준도 간단히 적는다.

### 7.12 docs/design/APMS_GLOBAL_UI_FOUNDATION_REVIEW_SOP.md

내용:

- full_files 실제 확인 원칙
- 미검수 PASS 금지
- 화면 캡처 검수 우선
- 코드 PASS와 UI PASS 분리
- Gemini/Claude 검수 요청서에 넣을 항목
- 실제 확인한 파일/함수/selector 근거 요구
- 금융 감사관 SOP 방식

---

## 8. 공통 CSS Foundation 생성 기준

생성 파일:

apmath/css/apms-ui-foundation.css

파일 목적:

Academy OS 디자인 언어를 APMS vanilla JS 환경에서 쓸 수 있게 하는 bridge CSS.

이 파일은 특정 화면만 위한 CSS가 아니다.
앞으로 APMS 전체 JS 화면이 공유할 공통 UI 언어다.

금지 selector:

- body
- button
- .card
- *
- td
- tr
- input
- textarea
- select

허용 prefix:

- .apms-

최소 class 세트:

- .apms-card
- .apms-card__header
- .apms-card__title
- .apms-card__meta
- .apms-card__body
- .apms-card__footer

- .apms-section
- .apms-section-title
- .apms-section-meta

- .apms-line-list
- .apms-line-row
- .apms-line-row--clickable
- .apms-line-row__main
- .apms-line-row__title
- .apms-line-row__meta
- .apms-line-row__status
- .apms-line-row__actions
- .apms-line-row__chevron

- .apms-chip
- .apms-chip--muted
- .apms-chip--soft

- .apms-button
- .apms-button--quiet
- .apms-button--primary

- .apms-empty
- .apms-muted
- .apms-toolbar
- .apms-tabs
- .apms-tab
- .apms-tab--active

과도하게 쓰지 않는 class를 대량 생성하지 마라.
1차에서 classroom.js에 실제로 쓰는 class와 향후 확장에 확실히 필요한 최소한만 만든다.

Typography 기준:

- section/card title: 14px / 500
- row title: 14px / 500
- row meta: 12~13px / 400
- chip: 12px / 400~500
- button: 13px / 500
- status text: 12~13px / 400
- chevron: 14px / 400

금지:

- font-weight 700/800/900 신규 추가
- 숫자만 bold
- 상태값만 bold
- 초록/주황/빨강 상태색 남발

---

## 9. Classroom 전용 CSS 생성 기준

생성 파일:

apmath/css/classroom-foundation.css

역할:

classroom 화면 전용 배치와 특수 규칙만 둔다.

허용 prefix:

- .ap-classroom-

class 후보:

- .ap-classroom-shell
- .ap-classroom-card
- .ap-classroom-section
- .ap-classroom-summary
- .ap-classroom-roster
- .ap-classroom-row
- .ap-classroom-row__main
- .ap-classroom-row__title
- .ap-classroom-row__meta
- .ap-classroom-row__actions
- .ap-classroom-toolbar
- .ap-classroom-chip
- .ap-classroom-empty

금지:

- dashboard/sidebar class 재정의 금지
- 전역 selector 금지
- 기존 button/card/body 수정 금지
- 이모티콘/아이콘 추가 금지

---

## 10. CSS link 추가 기준

apmath/index.html에 CSS link를 추가한다.

추가 대상:

- ./css/apms-ui-foundation.css
- ./css/classroom-foundation.css

중복 link 금지.

권장 순서:

1. 기존 기본 CSS
2. apms-ui-foundation.css
3. sidebar-foundation.css
4. dashboard-foundation.css
5. classroom-foundation.css

기존 CSS link 삭제 금지.

---

## 11. classroom.js 적용 기준

실제 적용은 classroom.js의 1차 안전 영역에만 한다.

수정 우선순위:

1. 반 화면 상단 요약 영역
2. 학생 목록 row
3. 주요 action row 또는 버튼 묶음
4. 출결/숙제/플래너/상담 상태 표시 영역 중 기능 로직과 분리 가능한 부분

보류:

- 전체 모달 구조
- 모든 inline style 제거
- 플래너 내부 대형 표
- 출결 저장 로직
- 숙제 저장 로직
- 상담 저장 로직
- 새 기능 추가
- 데이터 구조 변경

기능 보존:

- 기존 함수명 유지
- 기존 onclick/action 유지
- 기존 버튼명 유지
- 기존 모달 제목 유지
- 기존 toast 문구 유지
- 기존 저장 API 유지
- 기존 학생 목록 클릭 흐름 유지

---

## 12. Classroom 디자인 기준

classroom은 대시보드보다 실무형이어야 한다.

금지:

- 이모티콘
- 이모지
- 장식용 아이콘
- 과한 색상 배지
- 학생마다 작은 카드 중첩
- font-weight 700 이상
- 숫자만 bold
- 상태색 남발

허용:

- outer card
- line row
- chip
- muted meta
- quiet button
- 약한 hover
- 필요한 경우 chevron

핵심 문장:

카드 삭제 X.
카드 안 카드 삭제 O.

---

## 13. 검증 기준

필수 실행:

node --check apmath/js/classroom.js

필요 시 실행:

node --check apmath/js/ui.js

확인:

- apms-ui-foundation.css 생성됨
- classroom-foundation.css 생성됨
- index.html link 중복 없음
- classroom.js 문법 오류 없음
- 전역 selector 없음
- 이모티콘/이모지 신규 없음
- 기존 문구/버튼명/화면명 변경 없음
- dashboard.js 미수정
- cumulative.js 미수정
- timetable.js 미수정
- report.js 미수정
- student portal 미수정
- classroom 기존 기능 함수명 변경 없음
- outer card shell 유지
- card 안 card 감소
- line row 적용
- font-weight 700 이상 신규 없음

브라우저 직접 확인 필요 항목을 CODEX_RESULT.md에 남긴다.

- 클래스룸 진입 정상
- 학생 목록 정상
- 출결/숙제/플래너/상담 버튼 정상
- 모달 열림/닫힘 정상
- 모바일 폭 깨짐 없음
- 텍스트만 떠 보이지 않고 card shell 유지
- card 안 card가 과하지 않은지

---

## 14. CODEX_RESULT.md 작성 형식

작업 후 루트 CODEX_RESULT.md를 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

- 생성/수정 파일 목록

## 2. 구현 완료 또는 확인 완료

- Academy OS 참고 경로 확인 여부
- 계획서 12개 저장 여부
- apms-ui-foundation.css 생성 여부
- classroom-foundation.css 생성 여부
- index.html CSS link 추가 여부
- classroom.js 1차 안전 영역 class 적용 여부
- 이모티콘/이모지 미추가 여부
- 기존 문구/버튼명/화면명 보존 여부
- 기존 기능 흐름 보존 여부
- 전역 CSS 미수정 여부
- dashboard.js/cumulative.js/timetable.js/report.js/ui.js 미수정 여부
- card shell 유지 여부
- card 안 card 감소 여부

## 3. 실행 결과

- node --check apmath/js/classroom.js 결과
- 필요 시 node --check apmath/js/ui.js 결과

## 4. 결과 요약

- 짧게 요약

## 5. 다음 조치

- 브라우저 화면 확인 필요
- 2차 보정 후보
- 보류한 위험 영역

---

## 15. 최종 명령

APMS Global UI Foundation + Classroom First 작업을 수행하라.

Academy OS 디자인 언어를 APMS vanilla JS 환경에 맞게 번역한 공통 UI Foundation을 만들고, 실제 적용은 classroom.js의 1차 안전 영역에만 제한하라.

계획서를 먼저 저장하고, 그 계획을 벗어나지 말고 작업하라.

불확실한 영역은 수정하지 말고 보류 영역에 남겨라.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF