# CODEX_RESULT

## 1. 생성/수정 파일

### 생성

- `docs/design/APMS_GLOBAL_UI_FOUNDATION_INDEX.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_TOKENS.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_CARD_ROW.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_BUTTON_CHIP.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_SIDEBAR_BRIDGE.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_DASHBOARD_BRIDGE.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_STUDENT_PORTAL_PLAN.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_FORM_MODAL_PLAN.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_TABLE_EXCEPTION_PLAN.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_ROLLOUT_MAP.md`
- `docs/design/APMS_GLOBAL_UI_FOUNDATION_REVIEW_SOP.md`
- `apmath/css/apms-ui-foundation.css`
- `apmath/css/classroom-foundation.css`

### 수정

- `apmath/index.html`
- `apmath/js/classroom.js`
- `CODEX_RESULT.md`

## 2. 작업 내용

### Gate 0. 경로 확인

- APMS 작업 루트: `C:\Users\USER\Desktop\AP------`
- Academy OS 참고 루트: `..\academy-os-v2`
- Academy OS sibling repo 존재 확인 완료.
- Academy OS 파일은 참고만 했고 수정하지 않음.

### Gate 1. Academy OS 디자인 언어 확인

다음 파일을 읽고 APMS로 번역할 UI 언어를 추출했다.

- `..\academy-os-v2\web-react\src\components\Sidebar.jsx`
- `..\academy-os-v2\web-react\src\components\Layout.jsx`
- `..\academy-os-v2\web-react\src\components\Card.jsx`
- `..\academy-os-v2\web-react\src\components\Button.jsx`
- `..\academy-os-v2\web-react\src\components\Badge.jsx`
- `..\academy-os-v2\web-react\src\config\menuRegistry.js`
- `..\academy-os-v2\web-react\src\config\modes.js`
- `..\academy-os-v2\web-react\src\styles\design-system.css`

확인한 기준:

- sidebar는 `icon + label` row, section label, active/hover tone, role pill 구조.
- card는 outer shell과 header/body 구조.
- button은 primary/secondary/danger/ghost 계열.
- badge/chip은 작은 상태 표시 중심.
- spacing은 4/8/12/16/20/24px 계열.
- typography는 12~15px 중심, row/card title은 중간 굵기.

### Gate 2. APMS 기존 설계 문서 확인

다음 문서를 확인하고 충돌하지 않게 계획 문서를 작성했다.

- `docs/design/APMS_UI_PRINCIPLES.md`
- `docs/design/DASHBOARD_FOUNDATION.md`
- `docs/design/UI_REVIEW_SOP.md`
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

반영한 APMS 원칙:

- 기존 문구, 버튼명, 화면명 변경 금지.
- 기존 함수명, onclick, API 호출, 저장 로직 변경 금지.
- 전역 selector 수정 금지.
- card 안 card 금지.
- 반복 항목은 line row 중심.
- 상태 색상은 과하게 강조하지 않음.

### Gate 3. Global UI Foundation 계획 문서 12개 작성

`docs/design/APMS_GLOBAL_UI_FOUNDATION_*.md` 12개를 생성했다.

주요 내용:

- Foundation 전체 인덱스와 읽는 순서.
- Academy OS token을 APMS `--apms-ui-*` token으로 번역하는 기준.
- card shell, line row, clickable row, empty state 기준.
- quiet/primary/danger button과 chip 기준.
- sidebar/dashboard 기존 완료 영역과 global foundation 연결 계획.
- classroom first 적용 범위.
- student portal, form/modal, table 예외 화면의 후속 적용 계획.
- rollout map과 review SOP.

### Gate 4. 공통 CSS Foundation 생성

`apmath/css/apms-ui-foundation.css`를 생성했다.

포함한 class:

- `.apms-card`
- `.apms-card__header`
- `.apms-card__title`
- `.apms-card__meta`
- `.apms-card__body`
- `.apms-card__footer`
- `.apms-section`
- `.apms-section-title`
- `.apms-section-meta`
- `.apms-line-list`
- `.apms-line-row`
- `.apms-line-row--clickable`
- `.apms-line-row__main`
- `.apms-line-row__title`
- `.apms-line-row__meta`
- `.apms-line-row__status`
- `.apms-line-row__actions`
- `.apms-line-row__chevron`
- `.apms-chip`
- `.apms-chip--muted`
- `.apms-chip--soft`
- `.apms-button`
- `.apms-button--quiet`
- `.apms-button--primary`
- `.apms-empty`
- `.apms-muted`
- `.apms-toolbar`
- `.apms-tabs`
- `.apms-tab`
- `.apms-tab--active`

전역 금지 selector는 추가하지 않았다.

### Gate 5. Classroom 전용 CSS 생성

`apmath/css/classroom-foundation.css`를 생성했다.

포함한 class:

- `.ap-classroom-shell`
- `.ap-classroom-card`
- `.ap-classroom-section`
- `.ap-classroom-summary`
- `.ap-classroom-roster`
- `.ap-classroom-row`
- `.ap-classroom-row__main`
- `.ap-classroom-row__title`
- `.ap-classroom-row__meta`
- `.ap-classroom-row__actions`
- `.ap-classroom-toolbar`
- `.ap-classroom-chip`
- `.ap-classroom-empty`

기존 `cls-v4-*`를 제거하지 않고, 새 foundation class와 병행되도록 만들었다.

### Gate 6. `index.html` CSS link 추가

`apmath/index.html`에 다음 CSS를 추가했다.

- `./css/apms-ui-foundation.css`
- `./css/classroom-foundation.css`

현재 순서:

1. `apms-theme-override.css`
2. `apms-ui-foundation.css`
3. `sidebar-foundation.css`
4. `dashboard-foundation.css`
5. `classroom-foundation.css`

중복 link는 없다.

### Gate 7. `classroom.js` 1차 안전 영역 적용

`apmath/js/classroom.js`에서 다음 안전 영역에만 class를 병행 적용했다.

- 반 화면 상단 요약: `renderClassTopBarV4B`
- 주요 작업 toolbar: `renderClassToolBarV4B`
- 학생 목록 board: `renderClassStudentBoardV4B`
- 학생 row: `renderClassStudentRowV4B`
- 클래스룸 shell/section: `renderClass`

적용한 대표 class:

- `ap-classroom-shell`
- `ap-classroom-section`
- `ap-classroom-summary`
- `ap-classroom-toolbar`
- `ap-classroom-card`
- `ap-classroom-roster`
- `ap-classroom-row`
- `apms-card`
- `apms-card__header`
- `apms-card__title`
- `apms-card__meta`
- `apms-toolbar`
- `apms-button`
- `apms-button--quiet`
- `apms-line-row`
- `apms-line-row--clickable`
- `apms-line-row__main`
- `apms-line-row__title`
- `apms-line-row__actions`
- `apms-chip`
- `apms-empty`

보존한 것:

- 기존 버튼명 보존.
- 기존 화면명 보존.
- 기존 toast/modal 문구 변경 없음.
- 기존 함수명 변경 없음.
- 기존 onclick/action 흐름 변경 없음.
- 출결/숙제/지각/보강/상담/플래너 API 호출 변경 없음.
- 저장 로직 변경 없음.
- 데이터 구조 변경 없음.

## 3. 수정하지 않은 파일

요청 범위 밖이므로 다음 파일과 영역은 수정하지 않았다.

- `apmath/js/dashboard.js`
- `apmath/js/cumulative.js`
- `apmath/js/timetable.js`
- `apmath/js/report.js`
- `apmath/js/ui.js`
- `apmath/student/index.html`
- `apmath/planner/index.html`
- `apmath/worker-backup`
- `apmath/worker`
- `schema.sql`
- `archive`
- Academy OS repo files under `..\academy-os-v2`

## 4. 검증 결과

- `node --check apmath/js/classroom.js`: 통과.
- `apmath/index.html`의 `apms-ui-foundation.css` link 개수: 1.
- `apmath/index.html`의 `classroom-foundation.css` link 개수: 1.
- 새 CSS 금지 selector 검색 결과: 없음.
- 금지 파일 diff 확인 결과: 없음.
- 계획 문서 개수 확인: 12개.

참고:

- `node --check apmath/js/ui.js`는 이번 작업에서 `ui.js`를 수정하지 않았으므로 실행하지 않았다.
- 브라우저 실화면 검증은 아직 수행하지 않았다.

## 5. 결과 요약

Academy OS의 디자인 언어를 APMS vanilla JS 환경에 맞게 문서화하고, 공통 UI Foundation과 Classroom 전용 Foundation CSS를 추가했다. 실제 코드 적용은 `classroom.js`의 1차 안전 영역으로 제한했으며, 기능/문구/API/저장 로직은 변경하지 않았다.

이번 작업은 전체 APMS UI 리뉴얼이 아니라, 이후 화면에 같은 UI 언어를 적용하기 위한 기반 작업과 Classroom First 적용이다.

## 6. 다음 조치

- 브라우저에서 클래스룸 진입 화면 확인.
- 학생 목록 row, 출결/숙제/지각/보강/상담 버튼 확인.
- 모달 열림/닫힘 확인.
- 모바일 폭에서 텍스트/버튼 깨짐 확인.
- 2차 작업에서 기존 `cls-v4-*` inline style 중 안전하게 CSS로 옮길 수 있는 부분만 선별.
- Student portal, 상담, 교재, 수업자료, 성적, OMR, 시간표, 출석부, 리포트는 rollout map 순서에 따라 별도 작업으로 진행.
