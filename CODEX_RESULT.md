# CODEX_RESULT

작업명: EIE 원장 화면 AP MATH 원장 대시보드와 동일 구조 통일
작업일: 2026-05-30

## 1. 생성/수정 파일

| 구분 | 파일 | 변경 내용 |
|---|---|---|
| 수정 | `eie/index.html` | 전체 body 구조를 AP MATH와 동일하게 재작성 |
| 수정 | `eie/css/eie.css` | AP MATH 동일 shell CSS 추가 (EOF 앞 새 섹션) |
| 수정 | `eie/js/eie-app.js` | drawer 함수 추가, 사용자명 주입 추가 |

## 2. AP MATH 기준 구조 확인

AP MATH 원장 대시보드의 실제 DOM 구조:

| 요소 | 역할 |
|---|---|
| `<header>` (mobile) | 58px sticky, hamburger / E 로고 / 사용자명 |
| `<div class="desktop-topbar">` (desktop) | fixed, left:56px, 사용자명 우측 |
| `#app-drawer` | fixed sidebar, 56px rail → 260px expanded |
| `<main id="app-root">` | 콘텐츠 영역 |
| `.desktop-topbar` | 데스크톱 상단바 |
| `body.ap-drawer-expanded` | drawer 열릴 때 body padding-left: 260px |

## 3. EIE에 맞춘 항목

| AP MATH 요소 | EIE 대응 요소 | 일치 여부 |
|---|---|---|
| `<header>` (58px, grid 3col) | `.eie-header` | ✅ 동일 구조/높이 |
| `.desktop-topbar` (fixed, left:56px) | `.eie-desktop-topbar` | ✅ 동일 |
| `#app-drawer` (56px rail) | `#eie-drawer` | ✅ 동일 |
| `body.ap-drawer-expanded` | `body.eie-drawer-expanded` | ✅ 동일 |
| `<main>` (600px mobile / 1180px desktop) | `.eie-main` | ✅ 동일 |
| `#ap-admin-dashboard` (max-width:850px) | `.owner-dashboard-shell` | ✅ 동일 |
| drawer item 구조 | `.eie-drw-item` | ✅ 동일 |
| active 상태 `.is-active` | `.eie-drw-item.is-active` | ✅ 동일 |
| CSS `--bg`, `--surface`, `--border` 등 | `:root` alias 추가 | ✅ bridge |

## 4. 아직 다르게 남은 항목

- **AP MATH에는 다크모드 토글**이 drawer에 있으나 EIE drawer에는 없음 (기능 추가 아님, 이번 범위 외)
- AP MATH drawer는 `drw-icon` SVG에 `drw-icon` 클래스를 사용하나 EIE는 `eie-drw-icon` — 시각적으로 동일하나 클래스명 다름 (APMS CSS를 건드리지 않기 위한 의도적 분리)
- EIE 단독 페이지(`eie/index.html`) 내부 메뉴는 sidebar drawer에서 처리 — AP MATH의 상단 보조 버튼은 dashboard view 안 `renderActionGrid()`로 유지

## 5. 실행 결과

```
node --check eie/js/eie-app.js        → OK
node --check eie/js/eie-router.js     → OK
node --check eie/js/views/eie-dashboard.js → OK
```

## 6. 수동 확인 항목

| # | 항목 | 기대 결과 |
|---|---|---|
| 1 | AP MATH 원장 화면 접속 | 좌측 56px rail drawer, 상단 58px topbar |
| 2 | EIE 클릭 (eie/index.html 이동) | 동일 좌측 56px rail, 동일 상단 58px topbar |
| 3 | EIE 사이드바 구조 | 대시보드/시간표/학생관리/클래스룸/관리 + 하단 AP MATH/로그아웃 |
| 4 | 하단 "← AP Math" 뜬금없는 링크 없음 | drawer footer 안에 정렬된 item으로 존재 |
| 5 | hamburger 클릭 → drawer 열림 | 260px로 확장, body padding 변경 |
| 6 | EIE 메뉴 클릭 시 active 표시 | `is-active` 클래스 적용 |
| 7 | 우측 사용자명 | WANGJI_EIE_NAME에서 읽어 표시 |
| 8 | AP MATH 원장 화면 회귀 | 기존 구조 유지 |
| 9 | 선생님 화면 AP/EIE 탭 없음 | dashboard-admin.js의 isAdmin 조건 유지 |

## 7. 금지 작업 준수 확인

- AP MATH 기존 원장 화면 수정: ❌ 미수정
- EIE 전용 sidebar 새 디자인: ❌ AP MATH 구조 그대로 복제
- iframe 사용: ❌ 없음
- Worker/API/DB 수정: ❌ 없음
- 선생님 화면 노출: ❌ dashboard-admin.js 미수정
- git add/commit/push: ❌ 미실행

## 8. 자체 검수 및 검수팩

### 검수 결과
- 세 파일 모두 syntax check 통과
- `eie/index.html`에 `eie-sidebar`, `eie-app-shell`, `eie-shell-frame`, `eie-shell-header` 없음 확인
- drawer의 AP MATH 링크가 footer item으로 정렬됨 (뜬금없이 뜨지 않음)
- CSS variable bridge 추가로 `--bg`, `--surface`, `--border` 등이 EIE에서도 동일 값 사용
- `bootWhenReady` → `eieUpdateHeaderUser()` → 사용자명 헤더/topbar 주입 확인

### 검수팩 대상 파일
- `eie/index.html`
- `eie/css/eie.css` (EOF shell 섹션)
- `eie/js/eie-app.js`
