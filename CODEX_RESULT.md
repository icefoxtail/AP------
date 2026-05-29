# CODEX_RESULT

작업명: 원장 대시보드 AP MATH / EIE 운영 화면 구조 통일  
작업일: 2026-05-29

---

## 1. 생성/수정 파일

| 파일 | 구분 | 내용 |
|------|------|------|
| apmath/css/dashboard-foundation.css | 수정 | owner shell 공통 CSS 클래스 추가 |
| apmath/js/dashboard.js | 수정 | adminControlCenter gate → owner-brand-tabs, owner-dashboard-shell 적용 |
| apmath/js/dashboard-admin.js | 수정 | gate 생성 함수 → owner-brand-tabs 클래스 통일 |
| eie/css/eie.css | 수정 | APMS 정렬 오버레이 추가 (폰트·카드·폭·사이드바·owner 클래스) |
| eie/js/views/eie-dashboard.js | 수정 | renderGate → owner-brand-tabs, render → owner-dashboard-shell 래퍼 |
| docs/APMS_OWNER_AP_EIE_SHELL_POLICY.md | 신규 | 원장 AP/EIE shell 정책 문서 |
| CODEX_RESULT.md | 수정 | 이번 작업 결과 기록 |

---

## 2. 구현 내용

### 공통 owner shell CSS 클래스 (dashboard-foundation.css + eie.css 양쪽)

| 클래스 | 역할 |
|--------|------|
| `.owner-dashboard-shell` | max-width 850px, auto margin, 패딩 |
| `.owner-brand-tabs` | AP/EIE 탭 컨테이너 (2열 grid, 16px radius) |
| `.owner-brand-tab` | 개별 탭 버튼/링크 (44px height, 12px radius, fw:500) |
| `.owner-brand-tab--current` | 현재 탭 상태 (cursor:default) |
| `.owner-section-card` | 섹션 카드 (16px radius) |
| `.owner-stat-grid` | 4열 통계 그리드 |

### AP MATH 원장 화면 변경

- `renderAdminControlCenter()`:
  - gate div: `owner-brand-tabs` 추가
  - EIE 버튼: `<button>` → `<a>` (링크 시맨틱)
  - `#ap-admin-dashboard`: `owner-dashboard-shell` 클래스 추가
- `apCreateAdminSystemGate()`:
  - gate div: `owner-brand-tabs` 추가
  - EIE 버튼: `<button>` → `<a>` (링크 시맨틱)

### EIE 화면 변경

- `eie.css` 추가:
  - APMS CSS 변수 앨리어스 (`--primary`, `--border`, `--surface` 등)
  - 폰트 무게 정규화 (action: 500, 카드 제목: 600)
  - `.eie-shell-main` max-width: 850px (850px로 APMS와 통일)
  - `.eie-admin-card`, `.eie-admin-status-card`, `.eie-admin-recent-list` border-radius: 16px
  - `.eie-sidebar` 배경: `rgba(255,255,255,0.92)` + backdrop-filter blur
  - owner shell 공통 클래스 (EIE 변수 기반)
- `eie-dashboard.js` 변경:
  - `renderGate()`: `owner-brand-tabs` 클래스, `owner-brand-tab` 개별 탭
  - `render()`: `owner-dashboard-shell` 래퍼 추가

---

## 3. AP MATH / EIE shell 통일 결과

| 항목 | AP MATH 원장 | EIE 원장 | 통일 여부 |
|------|-------------|---------|----------|
| 콘텐츠 max-width | 850px | 850px | ✅ |
| AP/EIE 탭 컨테이너 | owner-brand-tabs | owner-brand-tabs | ✅ |
| 탭 높이 | 44px | 44px | ✅ |
| 탭 border-radius | 12px | 12px | ✅ |
| 탭 font-weight | 500 | 500 | ✅ |
| 카드 border-radius | 16px | 16px | ✅ |
| 카드 border | 1px var(--border) | 1px var(--eie-border) | ✅ (동일 색값) |
| 카드 shadow | none | none | ✅ |
| CSS 변수 색값 | #1A5CFF / #FFFFFF / #E5E8EB | 동일 (앨리어스 적용) | ✅ |
| 폰트 무게 action | 500 | 500 (정규화) | ✅ |
| Unauthorized 처리 | — | eie-dashboard-notice 카드 | ✅ 레이아웃 보존 |

---

## 4. 선생님 화면 노출 방지 확인

- `dashboard-teacher.js` 검색: EIE, owner-brand, owner-dashboard 키워드 없음 ✅
- `apAdminDashboardRole()` 체크: `'admin'`일 때만 gate 삽입 ✅
- 선생님 화면에 AP MATH/EIE 선택 UI 없음 ✅

---

## 5. 실행 결과

**node --check:**
- dashboard.js: ✅ OK
- dashboard-admin.js: ✅ OK
- dashboard-teacher.js: ✅ OK

**git diff --name-only:**
- apmath/css/dashboard-foundation.css ✅
- apmath/js/dashboard-admin.js ✅
- apmath/js/dashboard.js ✅
- eie/css/eie.css ✅
- eie/js/views/eie-dashboard.js ✅

**금지 파일 미수정 확인:**
- apmath/index.html: 미수정 ✅
- apmath-home/index.html: 미수정 ✅
- archive/: 미수정 ✅
- apmath/student/: 미수정 ✅

---

## 6. 수동 확인 항목

1. 원장 로그인 후 AP MATH 원장 대시보드 접속
2. 상단 AP MATH / EIE 탭이 같은 크기(44px)와 위치로 표시되는지 확인
3. AP MATH 탭: 현재 상태(cursor:default), EIE 탭: hover 효과 있음
4. EIE 탭 클릭 → `../eie/index.html#dashboard` 이동
5. EIE 화면에서 상단 AP MATH / EIE 탭 확인 (EIE 현재)
6. EIE 콘텐츠 폭이 AP MATH와 유사한지 확인 (850px)
7. EIE 카드 스타일(radius 16px, font-weight 500)이 APMS와 유사한지 확인
8. EIE Unauthorized 시 `eie-dashboard-notice` 카드로 낮은 위계 표시
9. 선생님 로그인 후 AP MATH/EIE 탭이 없는지 확인
10. 기존 AP MATH 로그인/로그아웃/출석부/시간표 기능 정상 작동 확인

---

## 7. 남은 문제

- EIE는 `/eie/index.html`로 별도 페이지 이동 방식이다. APMS 앱 shell(사이드바 drawer)과 완전히 같은 HTML 구조가 되려면 EIE를 APMS SPA 안에서 동적 로딩하는 추가 작업이 필요하다. (이번 라운드는 CSS/시각적 통일에 집중)
- EIE 사이드바(236px 고정 영역)는 APMS drawer(슬라이드 오프캔버스) 방식과 다르다. 사이드바 자체를 drawer로 교체하려면 `eie/index.html` 구조 변경이 필요하다. (다음 라운드 후보)
- 다크 모드에서 EIE 사이드바 blur 배경이 올바른지 별도 확인 필요.

---

## 8. 금지 작업 준수 확인

- git add: ❌ 하지 않음
- git commit: ❌ 하지 않음
- git push: ❌ 하지 않음
- apmath/index.html 수정: ❌ 하지 않음
- 기존 dashboard 렌더링 함수 삭제: ❌ 하지 않음
- EIE iframe 삽입: ❌ 하지 않음
- 선생님 화면에 브랜드 전환 UI 노출: ❌ 하지 않음
- API 실패 무시 처리: ❌ 하지 않음

---

## 9. 자체 검수 및 검수팩

**자체 검수 결과:**
- node --check 3개 파일 통과 ✅
- 선생님 화면 EIE 노출 없음 ✅
- owner-brand-tabs 양쪽(APMS + EIE) 적용 ✅
- owner-dashboard-shell 양쪽 적용 ✅
- 금지 파일 미수정 ✅
- CSS 변수 앨리어스 EIE에 추가 ✅
- 폰트 무게 정규화 ✅

**검수팩 zip 경로:**
`C:\Users\USER\AppData\Local\Temp\AP_PATCH_WORK\owner_shell_20260529\review_pack_owner_shell.zip`
