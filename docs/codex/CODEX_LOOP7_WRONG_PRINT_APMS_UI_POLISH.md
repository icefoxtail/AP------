# CODEX_LOOP7 — 오답 출력 센터 UI/UX APMS 기준 정렬

> 기능 추가/변경 없음. 이미 구현된 오답 출력 센터 기능을 그대로 두고
> UI/UX만 APMS 공통 디자인 기준에 맞춰 정렬했다.

## 1. APMS 기준으로 참고한 파일

- `apmath/css/apms-ui-foundation.css`
  - `.apms-card`(radius 16px / surface / 1px border / shadow), `.apms-line-row`(min-height 44px / padding 9px 12px / hover), `.apms-button`(min-height 34px / padding 7px 12px / radius 10px / font 13px), `.apms-button--primary`, `.apms-empty` 기준.
- `apmath/css/apms-theme-override.css`
  - 토큰 정의(`--surface`/`--surface-2`/`--bg`/`--border`/`--text`/`--secondary`/`--primary`/`--primary-soft`/`--primary-rgb`/`--error`), `.btn` 트랜지션, `.btn-primary` hover/active `scale(0.98)`, focus-visible 링(`0 0 0 4px rgba(var(--primary-rgb),0.14)`), 모달 surface/border/radius/shadow 기준.
- `apmath/css/apms-warm-theme.scope.css`
  - `<body class="apms-warm-scope">` 하위 실제 활성 토큰값(웜 중립 + 데이터 색) 및 primary 버튼 near-black remap. 모든 색은 이 토큰을 통해 자동 해석된다.
- `apmath/index.html`
  - 공통 CSS 로드 순서 / 모달(showModal) 구조 / 공통 버튼 클래스(`btn apms-button apms-button--primary`) 인터랙션.

## 2. 변경한 class 목록

신규 전용 CSS 파일 추가: **`apmath/css/apms-clinic-print.css`** (index.html에 `apms-warm-theme.scope.css` 다음으로 link). 전역 공통 CSS에 과도한 스타일을 더하지 않고, clinic print 전용 class에서 APMS token만 재사용.

추가한 class:

- 셸/요약: `clinic-print-shell`, `clinic-print-summary-card`(+`__title`/`__meta`)
- 섹션: `clinic-print-section`, `clinic-print-section-head`, `clinic-print-section-title`(+`--soft`), `clinic-print-subtitle`, `clinic-print-mini-btn`
- 출력 방식 카드: `clinic-print-mode-grid`, `clinic-print-mode-card`(+`--active`/`__radio`/`__title`/`__sub`)
- 시험 목록: `clinic-print-exam-list`, `clinic-print-exam-row`(+`--disabled`/`__check`/`__main`/`__title`/`__meta`/`__meta--error`)
- 학생 목록: `clinic-print-student-list`, `clinic-print-student-row`(+`__main`/`__name`/`__count`), `clinic-print-info-card`(+`__title`/`__meta`)
- 유형 패널: `clinic-print-type-panel`, `clinic-print-field`
- 범위 토글: `clinic-print-scope-grid`, `clinic-print-scope-btn`(+`--active`)
- 유형 카드: `clinic-print-type-grid`, `clinic-print-type-card`(+`--active`/`__title`/`__sub`)
- 미리보기: `clinic-print-result`, `clinic-print-preview-row`(+`__main`/`__title`/`__meta`/`__stat`/`__rate`/`__wrong`), `clinic-print-more`
- 정답률 토글: `clinic-print-rate-grid`, `clinic-print-rate-btn`(+`--active`)
- 단원 row: `clinic-print-unit-list`(+`--master`/`--selected`), `clinic-print-unit-row`(+`--selected`/`__main`/`__label`/`__count`), `clinic-print-unit-actions`, `clinic-print-unit-handle`, `clinic-print-unit-action`(+`--add`/`--remove`)
- 안내/빈상태: `clinic-print-note`, `clinic-print-empty`(+`--sm`)
- 제출: `clinic-print-submit`
- 진입/반선택: `clinic-print-menu-grid`, `clinic-print-menu-btn`, `clinic-print-class-list`, `clinic-print-class-btn`(+`--current`/`__name`/`__meta`)

`apmath/js/clinic-print.js`에서 상태 토글은 class 기반으로 단순화:
- `clinic-mode-card → clinic-print-mode-card` + `classList.toggle('...--active')`
- `clinic-scope-btn → clinic-print-scope-btn--active`
- `clinic-type-card → clinic-print-type-card--active`
- `clinic-unit-rate-btn → clinic-print-rate-btn--active`
- `clinic-unit-handle → clinic-print-unit-handle`

## 3. 제거하거나 축소한 inline style 목록

JS의 긴 inline style을 전용 class로 대체했다. 제거 대상 함수:

- `openClinicPrintCenter` — 모달 전체(요약/모드그리드 4카드/시험 row/학생 섹션/유형 패널/범위·유형 카드/제출 버튼) inline style 전면 제거. 모달 내부에 박혀 있던 `<style> @media` 블록도 제거(전용 CSS의 미디어쿼리로 이동).
- `clinicPrintRenderTypePanel` — empty box, 미리보기 row, 안내 박스 inline 제거.
- `clinicPrintRenderUnitMode` — 정답률 토글/마스터·출력 단원 컨테이너/안내 inline 제거.
- `clinicPrintRenderUnitLists` — 마스터 row, 출력 row, `+`/`↑`/`↓`/`×` 버튼 inline 제거.
- `clinicPrintUpdateStudentList` — 빈 상태, 학년 info card, 학생 row inline 제거.
- `clinicPrintSwitchMode`/`clinicPrintSetTypeScope`/`clinicPrintSetTypeMode`/`clinicPrintSetUnitRate` — `style.borderColor/background/color` 직접 조작 → `classList.toggle(--active)`.
- `openClinicCenter` — 메뉴 2버튼 inline + `<style>` 블록 제거.
- `openClinicClassPicker` — 반 선택 버튼/리스트 컨테이너 inline 제거.

남긴 inline (기능상 동적 상태만, 기준에서 허용):
- `clinic-print-type-panel`의 초기 `style="display:none;"` 1곳 + `clinicPrintSwitchMode`의 `display` 토글.
- 드래그 중 row `opacity`/handle `cursor` 동적 토글(`clinicPrintAttachUnitDnD`).
- 체크박스 `checked`/버튼 `disabled` 등 dynamic state.

`grep 'style="'` 결과 JS 내 inline은 동적 `display:none` 1건만 잔존.

## 4. 모바일 검수 결과 (390px)

Playwright(Chromium)로 실제 렌더 스크린샷 + 측정:

- 상위 카드(학생/반/학년/유형): **2열 유지** ✓
- 유형 카드(최다빈출/최다오답/단원별): **1열 유지** ✓
- 단원 row: 가로 스크롤 없이 표시, `+`/`↑`/`↓`/`×` 버튼 우측에서 **잘리지 않음** ✓
- 긴 단원명: **ellipsis 처리** 확인("미분계수와 도함수의 활용 단원 …", "1. 수열의 …") ✓
- 드래그 핸들 ≡ 과 액션 버튼 사이 간격 유지(`clinic-print-unit-actions` gap) ✓
- 전체 화면 **가로 스크롤 없음**: `scrollWidth(390) === clientWidth(390)`, `horizontalOverflow=false` 측정 확인 ✓
- 모달 내부 리스트는 max-height + overflow:auto로 자연스러운 내부 스크롤 유지 ✓

## 5. 다크모드 검수 결과

`body.dark` 적용 스크린샷 확인:

- 흰 박스/검은 글씨 **없음**(모든 surface/border/text가 다크 토큰으로 해석) ✓
- 선택 상태는 다크 `--primary-soft`(rgba(primary,0.15)) 톤으로 표시 ✓
- 하드코딩 `#fff`/`#000`/임의 rgba **없음** — 전부 token 사용(`--surface`/`--surface-2`/`--bg`/`--border`/`--text`/`--secondary`/`--primary`/`--primary-soft`/`--primary-rgb`/`--error`) ✓
- 제출 버튼은 기존 APMS(warm scope) primary 버튼 override를 그대로 따름(새 색 invent 없음) ✓

## 6. 기존 기능 회귀 검수 결과

- `node --check apmath/js/clinic-print.js` → **통과**.
- **데이터/로직 함수 무수정**: `clinicPrintBuildPayload`, `clinicPrintBuildTypePayload`, `clinicPrintFilterTypeItems`(50% 기준), `clinicPrintGetScopeWrongItems`, `clinicPrintComputeScopeUnits`, `clinicPrintSubmit` 등 데이터 흐름/계산부는 그대로. 변경은 렌더 마크업과 상태 class 토글, 그리고 `data-*`/id 셀렉터에 대응하는 class명 교체뿐.
- 셀렉터 정합성 확인: `data-mode`/`data-scope`/`data-type-mode`/`data-rate`/`data-unit-row`/`data-key`, id(`clinic-print-mode-cards`, `clinic-print-type-scope-toggle`, `clinic-print-type-cards`, `clinic-print-unit-rate-toggle`, `clinic-print-unit-master`, `clinic-print-unit-selected`, `clinic-print-type-result`, `clinic-print-summary`, `clinic-print-type-mode`, `clinic-print-type-scope`)와 `name`(`clinic-print-exam`/`clinic-print-student`/`clinic-print-mode`) 전부 유지. JS 토글 셀렉터를 새 class(`clinic-print-mode-card`/`clinic-print-scope-btn`/`clinic-print-type-card`/`clinic-print-rate-btn`/`clinic-print-unit-handle`)에 맞춰 동기화.
- 드래그 정렬: 핸들 셀렉터를 `clinic-print-unit-handle`로 교체, pointerdown/move/up 로직 동일.
- `wrong_print_engine.html` **무수정**, QR packer / wrapLatex / autoCompress / fitQuestionBox **무관**.

## 7. 남은 리스크

- 제출 버튼 색은 `apms-button--primary btn-primary`를 유지하므로 `apms-warm-theme.scope.css`의 near-black primary remap을 그대로 따른다(의도된 동작, 새 기준 invent 아님). 향후 warm 테마 토큰이 바뀌면 자동 반영됨.
- 검수는 실제 앱 데이터가 아닌, 생성 마크업과 동일 구조의 정적 하니스로 진행(데이터 로직 미변경이라 시각 검수 목적). 실제 데이터 경로의 동작은 기존 로직 보존으로 담보.
- 전용 CSS는 token 기반이라 별도 다크/웜 분기 규칙이 없다. 추후 새 테마 스코프가 추가되면 토큰만 정의되면 자동 대응되나, 토큰명이 달라지는 테마가 생기면 매핑 확인 필요.
