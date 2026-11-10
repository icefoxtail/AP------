---
name: AP Math OS (APMS) · 학생 포털
description: 웜 중립(stone) 종이 바탕에 near-black 주요 버튼, 색은 데이터에만 쓰는 운영 화면. 모달은 4등급(C 확인 / F 폼 / W 작업 화면 / P 전체 화면) 공통 부품(apms-modal)으로 모은다. 대상 기기는 휴대폰·태블릿·PC.
colors:
  bg: "#faf9f7"
  surface: "#ffffff"
  surface-2: "#f5f3f0"
  border: "#e8e5e0"
  border-soft: "#f1efeb"
  text: "#1c1917"
  text-soft: "#44403c"
  secondary: "#6b645f"
  control-border: "#857e78"
  action-primary: "#1c1917"
  action-primary-hover: "#292524"
  on-primary: "#ffffff"
  primary: "#2563eb"
  primary-dark: "#1d4ed8"
  accent-soft: "#eef4ff"
  success: "#15803d"
  success-soft: "#ecfdf3"
  warning: "#b45309"
  warning-soft: "#fdf3e3"
  error: "#b91c1c"
  error-soft: "#fef2f2"
  dark-bg: "#0c0a09"
  dark-surface: "#1c1917"
  dark-surface-2: "#292524"
  dark-border: "#34302c"
  dark-border-soft: "#232020"
  dark-text: "#fafaf9"
  dark-text-soft: "#d6d3d1"
  dark-secondary: "#a8a29e"
  dark-action-primary: "#fafaf9"
  dark-action-primary-hover: "#e7e5e4"
  dark-on-primary: "#1c1917"
  dark-primary: "#3b82f6"
  dark-primary-dark: "#2563eb"
  dark-success: "#22c55e"
  dark-warning: "#f59e0b"
  dark-error: "#f87171"
  dark-control-border: "#7c756f"
typography:
  stat:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.25
  section:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  caption:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  button:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  row: "4px"
  sm: "6px"
  md: "8px"
  control: "8px"
  panel: "8px"
  lg: "16px"
  card: "16px"
  pill: "999px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "20px"
  space-6: "24px"
  modal-body-x: "20px"
  modal-body-x-mobile: "16px"
components:
  modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    width: "720px"
  modal-confirm:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    width: "500px"
  modal-workspace:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    width: "1180px"
    height: "860px"
  modal-workspace-single:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    width: "720px"
    height: "860px"
  modal-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  modal-context:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    typography: "{typography.section}"
    rounded: "{rounded.panel}"
    padding: "11px 14px"
  modal-context-meta:
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
  modal-label:
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
  modal-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.action-primary-hover}"
  button-quiet:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    rounded: "{rounded.md}"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
    height: "24px"
---

# Design System: AP Math OS (APMS) · 학생 포털

> **범위.** 이 문서 하나가 APMS(선생님용 `apmath/index.html`, `apmath/js/`, `apmath/css/`)와 학생 포털(`apmath/student/`), 숙제(`apmath/homework/`), 플래너(`apmath/planner/`)를 함께 다룬다(사용자 결정 2026-11-02: "하나의 기준으로 잡아도 된다").
> **제외.** `apmath/playground/`(도형실험실)은 자기 `DESIGN.md`(`apmath/playground/DESIGN.md`)가 있어 이 문서의 대상이 아니다. impeccable은 대상 파일에서 가장 가까운 DESIGN.md를 쓰므로 `apmath/playground/next/` 화면은 실험실 문서를 계속 따르고 이 문서의 영향을 받지 않는다.
> **기준(authority).** 현재 실제로 적용되는 APMS 체계, 곧 웜 테마(`css/apms-warm-theme.scope.css`)와 통합 모달 양식(`css/apms-unified-modal.css`)이다. 학생 포털·숙제·플래너가 이와 다른 부분은 "학생 포털과의 차이"에 사실로 적는다. 방향은 2026-11-02에 정했다(웜 체계로 맞춘다, 학생 화면은 휴대폰 기준으로 글자·누르는 영역을 더 크게. 아래 "결정 기록"). 실제로 맞추는 작업은 이후 단계다.
> **대상 기기 (결정 2026-11-02).** 학생은 휴대폰으로 학생 포털을 쓰고, 선생님은 휴대폰·태블릿(갤럭시 탭)으로 APMS를 관리하고, 원장은 PC로 쓴다. 그래서 모든 화면은 아래 다섯 크기에서 확인한다.
>
> | 기기 | 크기(CSS px) | 쓰는 사람 | 비고 |
> |---|---|---|---|
> | 휴대폰 | 390×844 | 학생(학생 포털), 선생님 | 모달은 C·F 시트 / W·P 화면 전체, 입력 글자 16px |
> | 태블릿 세로 | 800×1280 | 선생님(갤럭시 탭) | 601px 이상이라 중앙 대화상자. W는 두 열을 유지하고 목록 열을 좁힘 |
> | 태블릿 가로 | 1280×800 | 선생님(갤럭시 탭) | 레일 사이드바(56px)가 있다. W 폭 `100vw - 144px` |
> | PC | 1440×900, 1280×800 | 원장, 선생님 | W 1180px |
>
> 휴대폰·태블릿은 터치이므로 누르는 영역 44px(WCAG 2.2 최소 24px보다 크게)를 지킨다. 확대는 허용한다.
> **근거 표기.** 값 옆의 `파일:줄`은 정의 위치다. 여러 CSS가 겹치므로 "실제로 이기는 값"은 Chrome에서 `file://`로 `apmath/index.html`을 열어 computed style로 확인했고(2026-11-02, 1280px·390px, 라이트·다크), 확인한 값만 적었다. 문서에 있는 이름과 달리 쓰이지 않는 토큰은 그렇게 표시했다.

## Overview

**Creative North Star: (잠정 — 사용자 확정 전, 미정 1번)** 웜 테마 CSS 머리말이 말하는 "종이 느낌"과 "색감은 버튼(크롬)이 아니라 데이터에"(`apms-warm-theme.scope.css:1-19`)를 그대로 옮긴 잠정 이름은 "종이 장부"다. 새 이름을 짓지 않고, 코드에 적힌 원칙만 적는다.

APMS는 선생님이 하루에 여러 번 열어 출결·숙제·성적·클리닉을 반복 처리하는 관리 화면이다. 바탕은 따뜻한 회색(stone) 종이색(`#faf9f7`)이고 카드는 흰색이며, 구분은 그림자가 아니라 1px 선(`#e8e5e0`)으로 한다(웜 테마가 `--shadow`를 `none`으로 둔다, 23-71줄). 저장·확정 같은 주요 버튼은 파란색이 아니라 거의 검은색(`--action-primary` `#1c1917`)이고, 파란색(`--primary` `#2563eb`)은 링크·포커스·선택·오늘 표시에만 쓴다. 출결·숙제·점수 상태 같은 데이터에만 초록·주황·빨강이 들어간다. 삭제 버튼은 빨간 면이 아니라 투명 바탕에 빨간 글씨와 빨간 테두리다(`:131-143`). 다크 모드는 같은 구조를 stone 어두운 값으로 채운다(`:77-110`).

학생 포털은 같은 제품이지만 아직 같은 체계로 그려지지 않는다. 학생 포털은 웜 테마와 통합 모달 CSS를 불러오지 않고, 자기 인라인 스타일에 APMS의 옛 `apms-theme-override.css`가 겹친 모습이다. 그 차이는 아래 "학생 포털과의 차이"에 있다.

**Key Characteristics:**
- 웜 중립(stone) 바탕, 흰 카드 + 1px 선, 그림자 거의 없음. 다크 모드는 `body.dark` 클래스로 전환하고 저장된 선택(`APMATH_THEME`)이 없으면 OS 설정을 따른다(`js/ui.js:22-26`).
- 주요 행동은 near-black 버튼 하나. 파란색은 기능 표시용. 색은 데이터에.
- 입력·버튼의 터치 높이는 통합 모달에서 44px, 휴대폰 폭에서 입력 글자 16px(확대 허용 결정 때문, `index.html:967-971`).
- 글꼴 굵기는 400/500이 기본이고 600은 제목, 700은 큰 숫자·옛 제목에 남아 있다(`apms-ui-foundation.css:219-224`의 "700/800/900 굵기를 쓰지 않는다"는 신규 영역 원칙).
- 정보 밀도가 높다. 본문 13px, 보조 12px. 12px 미만 글자는 쓰지 않는다(2026-11-02 결정).

## Colors

웜 stone 중립 위에 파랑 기능색 하나와 의미색 3가지(초록·주황·빨강). 값은 `body.apms-warm-scope`(`index.html:987`의 `<body class="apms-warm-scope">`로 앱 전체에 부여)에 선언되고, `index.html:14-`의 인라인 `:root`(옛 파랑 `#1A5CFF` 계열)와 `apms-theme-override.css:6-`의 `:root`(iOS 파랑 `#007AFF` 계열)를 body 수준에서 덮어쓴다. 로드 순서는 `index.html:974-985`(`<link>`), 클래스는 `:987`.

### Primary
- **주요 행동 검정** (`#1c1917`, `--action-primary`, `apms-warm-theme.scope.css:25`): 저장·확정·추가 버튼 바탕. 위 글자 `--on-primary` `#ffffff`. 눌림 `#292524`(26줄). 다크에서는 뒤집혀 바탕 `#fafaf9`, 글자 `#1c1917`(79-81줄). `.btn-primary`·`.ap-primary-btn`·`.apms-button--primary`에 `!important`로 적용된다(`:114-129`).
- **기능 파랑** (`#2563eb`, `--primary`, 36줄): 링크, 포커스, 선택, 모달 상단 행동 글자("추가"·"저장"), 오늘 표시. 눌림 `--primary-dark` `#1d4ed8`. 다크 `#3b82f6`(88줄).

### Secondary
- 없음. 주요 행동은 검정, 기능 표시는 파랑 하나다.

### Tertiary — 데이터 의미색
- **초록** (`#15803d`, `--success`; 연한 바탕 `#ecfdf3`): 출석·완료. 다크 `#22c55e`. 2026-11-02에 `#15a34a`(글자로 3.30:1)에서 바꿨다. 글자로 써도 AA를 통과한다.
- **주황** (`#b45309`, `--warning`; 연한 바탕 `#fdf3e3`): 주의·지각·미제출. 다크 `#f59e0b`. `#d97706`(글자로 3.19:1)에서 바꿨다.
- **빨강** (`#b91c1c`, `--error`/`--danger`; 연한 바탕 `#fef2f2`): 오류·삭제·결석. 다크 `#f87171`(안쪽 면 위 AA). `#dc2626`(연한 바탕 위 4.41:1)·다크 `#ef4444`(안쪽 면 위 4.03:1)에서 바꿨다. 삭제는 투명 바탕 + 빨간 글씨 + 빨간 선이고 빨간 면을 쓰지 않는다(`:131-143`).

### Neutral
- **종이 바탕** (`#faf9f7`, `--bg`, 45줄) → **카드** `#ffffff`(`--surface`) → **안쪽 면** `#f5f3f0`(`--surface-2`, 모달 맥락 상자·분리 줄·표 머리). 선 `#e8e5e0`(`--border`, 49줄), 약한 선 `#f1efeb`.
- 글자: `#1c1917`(`--text`) · `#44403c`(`--text-soft`) · `#6b645f`(`--secondary`, 메타·라벨·모달 라벨. `#78716c`는 안쪽 면 위 4.33:1 미달이라 2026-11-02에 어둡게 했다).
- 입력칸 테두리: `#857e78`(`--control-border`, 다크 `#7c756f`). 카드·구분선용 `--border`(`#e8e5e0`, 흰 면 위 1.26:1)와 따로 둔다. 입력칸·선택 칸은 이 토큰을 쓴다.
- 다크: 바탕 `#0c0a09`, 카드 `#1c1917`, 안쪽 `#292524`, 선 `#34302c`, 글자 `#fafaf9`·`#d6d3d1`·`#a8a29e`(96-104줄).
- 오버레이: 모달 뒤 `rgba(0,0,0,0.42)` + `blur(12px)` (`apms-theme-override.css:202-206`이 `index.html:643-`의 `.5`/`blur(4px)`를 이긴다).

### 쓰이지 않거나 흐릿한 토큰 (실측 2026-11-02)
- `--shadow-modal`(`0 8px 28px rgba(0,0,0,.12)`, 웜 테마 71줄)은 어디서도 쓰이지 않는다(`grep` 결과 정의 1건). 모달의 실제 그림자는 `--shadow-lg` `0 16px 48px rgba(0,0,0,.14)`(`apms-theme-override.css:37, 217`)이고 다크에서는 `none`.
- `--radius-sm/md/lg`(웜 6/8/16px, 2026-11-02에 lg를 10→16px로)는 이제 카드(`lg`)·입력과 버튼(`md`)·작은 면(`sm`)의 기준이다. 6px를 `!important`로 강제하던 규칙을 걷어냈다(Shapes 참고).
- `--ap-*`(옛 "Wangji Compact Admin Tokens", `index.html:41-80`)는 웜 테마가 건드리지 않아 파랑·슬레이트 값 그대로다(`--ap-btn-primary-bg` `#334155` 등). `--ap-text`·`--ap-border`·`--ap-purple`·`--ap-muted`가 일부 화면에서 쓰인다(`var(--ap-…` 사용 수: `--ap-space-*` 28, `--ap-border` 12, `--ap-text` 10, `--ap-purple` 7, `--ap-muted` 6). `--ap-inactive`는 정의만 있고 쓰이지 않는다.
- 웜 테마 머리말이 가리키는 초안 `docs/design/drafts/apms-warm-theme.draft.css`·`apms-warm-mapping.md`는 이 저장소에 없다.

### 대비 (WCAG 2.2 AA: 본문 4.5:1, UI 3:1) — 주요 조합만
계산: sRGB 상대휘도 L으로 (밝은 L+0.05)/(어두운 L+0.05). 스크립트로 계산했고 반올림 2자리. 아래 값은 2026-11-02 토큰 조정 **뒤**이고, 같은 계산이 `tests/apms-modal-foundation.test.js`에 들어 있어 값이 미달로 돌아가면 테스트가 실패한다.

| 조합 | 비율 | 판정 |
|---|---|---|
| 라이트 `--text` `#1c1917` / `--bg` `#faf9f7` | 16.62 | 통과 |
| 라이트 `--secondary` `#6b645f` / 흰색 · `--bg` · `--surface-2` | 5.81 · 5.52 · 5.25 | 통과 (전: `#78716c` / `--surface-2` 4.33 미달) |
| 라이트 `--primary` `#2563eb` / 흰색 · `--surface-2` | 5.17 · 4.67 | 통과 |
| 라이트 `--success` `#15803d` / 흰색 · `--surface-2` · `--success-soft` | 5.02 · 4.53 · 4.76 | 통과 (전: `#15a34a` / 흰색 3.30 미달) |
| 라이트 `--warning` `#b45309` / 흰색 · `--surface-2` · `--warning-soft` | 5.02 · 4.53 · 4.57 | 통과 (전: `#d97706` 3.19, 소프트 면 위 2.90) |
| 라이트 `--error` `#b91c1c` / 흰색 · `--surface-2` · `--error-soft` | 6.47 · 5.84 · 5.91 | 통과 (전: `#dc2626` / 소프트 면 4.41) |
| 라이트 흰 글자 / `--action-primary` `#1c1917` | 17.49 | 통과 |
| 다크 `--secondary` `#a8a29e` / `--surface` · `--surface-2` | 6.93 · 6.01 | 통과 |
| 다크 `--success` `#22c55e` · `--warning` `#f59e0b` / `--surface-2` | 6.66 · 7.06 | 통과 |
| 다크 `--error` `#f87171` / `--surface` · `--surface-2` | 6.32 · 5.48 | 통과 (전: `#ef4444` / `--surface-2` 4.03 미달) |
| 다크 `--primary` `#3b82f6` / `--surface` | 4.75 | 통과. **`--surface-2` 위는 4.12로 본문 미달 — 남은 항목**(파랑은 채움에도 쓰여 밝히면 흰 글자 대비가 깨진다. 안쪽 면 위 파란 글자는 `--text`로 대신하거나 이후 작업에서 정한다) |
| 라이트 입력칸 테두리 `--control-border` `#857e78` / 흰색 · `--bg` · `--surface-2` (UI 3:1) | 4.00 · 3.80 · 3.61 | 통과 (전: `--border` `#e8e5e0` 1.26) |
| 다크 입력칸 테두리 `#7c756f` / `--surface` · `--bg` | 3.86 · 4.36 | 통과 (전: 1.34) |
| 포커스 고리 `outline: 2px solid var(--primary)` / 라이트 흰색 · 다크 `--surface` | 5.17 · 4.75 | 통과 (전: `rgba(primary, .14)` 4px 1.22 미달) |

초록·주황은 글자로 실제 쓰인다(`color:var(--warning)` 약 25곳, `--success` 약 20곳). 그래서 새 토큰을 따로 만들지 않고 `--success`·`--warning`·`--error` **값 자체를 글자로도 쓸 수 있는 값으로 바꿨다**. 배경·아이콘으로 쓸 때 더 밝은 면이 필요하면 `--success-soft`·`--warning-soft`·`--error-soft`를 쓴다. 학생 포털은 웜 테마를 불러오지 않아(자기 iOS 계열 값) 이 변경 대상이 아니다. 학생 포털 값은 "학생 포털과의 차이"에 있다.

### Named Rules
**The Color-On-Data Rule.** 색은 데이터(출결·숙제·점수 상태, 과목 태그)에 쓰고 버튼·툴바에는 쓰지 않는다. 다색이던 진도/숙제/QR/원내평가/클리닉 툴 버튼은 무채색으로 통일됐다(`apms-warm-theme.scope.css:148-165`).

**The Near-Black Primary Rule.** 주요 행동 버튼은 `--action-primary`다. 파랑은 링크·포커스·선택·오늘에만 쓴다.

**The No-Solid-Red Rule.** 삭제는 투명 + 빨간 글씨 + 빨간 선이다. 빨간 면 버튼을 만들지 않는다.

**The Token-Only Rule.** 색은 `var(--…)`로 읽어 라이트·다크가 함께 바뀌게 한다. 인라인 하드코딩 hex는 다크 모드에서 깨진다(`js/report-print.js` 189개, `report-center.js` 157개, `timetable.js` 50개, `cumulative.js` 40개 등. 인쇄 문서 안의 hex는 의도된 것일 수 있다).

## Typography

**글꼴:** `Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (`index.html` body). **APMS와 플래너도 이제 학생 포털·숙제와 같은 CDN·방식으로 Pretendard를 불러온다**(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">`, 결정 2026-11-02). 예전에는 불러오지 않아 기기에 설치돼 있어야만 적용됐다.

**Character:** 한글 고딕 한 가족. 굵기는 400/500이 기본이고 600은 제목, 700은 큰 숫자와 옛 제목이다. `body`의 기본 크기는 지정이 없어 16px이고(computed 확인), 실제 글자 크기는 컴포넌트 클래스와 인라인 스타일이 정한다.

### Hierarchy
크기 변수는 **한 벌**이다(`--ap-font-*`, `apms-ui-foundation.css` `:root`, 결정 2026-11-02): stat 20 · title 18 · section 15 · body 13 · meta 12 · label 12 · button 13. 예전 두 벌(인라인 `--ap-font-*` title 18/section 13.5/body 13/meta 12.5/label 12/button 12, 그리고 `--ap-ui-font-*` stat 20/section 15/body 13/small 12)을 합쳤고 12px 미만 값은 없다. 값 자체를 12px 아래로 내리는 변경은 테스트(`tests/apms-modal-foundation.test.js`)가 막는다.
- **Stat** (700, 20px, 1.25, tabular-nums, -0.02em; `.ap-card__stat` `apms-ui-foundation.css:261-266`): 대시보드 숫자.
- **Title** (600, 18px; 통합 모달·등급 모달 제목 `apms-unified-modal.css`). 일반 모달 제목은 700 20px(`index.html` `#modal-title`)이고 등급 모달만 18/600으로 낮춘다.
- **Section** (600~700, 15px, 1.35): 카드 제목 `.ap-card__title`(700), 모달 맥락 이름 `.apms-unified-context__name`(600, `apms-unified-modal.css:42-46`).
- **Body** (400~500, 13px, 1.35~1.6): 목록 행·입력 글자.
- **Label** (500, 12px): 모달 라벨 `.apms-unified-label`(`:53-59`).
- **Caption** (400, 12px, 1.4~1.45): 메타·보조. **학생이 읽는 글자는 12px 미만으로 내리지 않는다**(결정 2026-11-02). 기존 APMS 화면에는 11px·10px가 남아 있다(예: 진도 모달 전용 CSS 20여 곳). 각 묶음 작업에서 해당 화면을 옮길 때 12px로 올린다.
- **Button** (500, 13px, 1.2; `.apms-button` `:154-167`, 통합 모달 버튼 `apms-unified-modal.css:117-125`). 일반 `.btn-primary`는 computed 15px/800으로 더 굵다(통합 모달 안에서만 13/500).
- **입력 글자**: 데스크톱 13px(통합 모달), 767px 이하에서 모든 입력 16px(`index.html:967-971`, `!important`).

### Named Rules
**The Tabular Number Rule.** 바뀌는 숫자(통계·점수)는 `font-variant-numeric: tabular-nums`.

**The Weight-Ladder Rule.** 신규 영역은 400/500/600만 쓰고 700 이상은 큰 숫자에만 쓴다(`dashboard-foundation.css:1-6`, `apms-ui-foundation.css:219-224`).

## Layout

관리 화면은 가운데 한 열이다. `main#app-root`는 휴대폰에서 최대 600px, 901px 이상에서 최대 1180px, 1400px 이상 1240px이고(`index.html:292-297, 345-356`), 위·아래 여백은 16/100px(모바일), 76/80px(데스크톱), 좌우 14px/36px다. 901px 이상에서는 왼쪽에 56px 레일 사이드바(펼치면 260px)와 58px 상단 막대가 붙고(`index.html:299-345`, `css/sidebar-foundation.css`), 그 아래에서는 헤더 + 서랍(drawer)이다. 시간표 월간 화면은 `min(1440px, 100vw - 48px)`로 더 넓다(`css/timetable-months.css:1-6`).

간격은 4px 단위다. 선생님 대시보드에서만 `body.ap-teacher-dashboard-mode`가 4/8/12/16/20/24 스케일을 변수로 선언한다(`dashboard-foundation.css:386-391`): 섹션 간격 20px, 카드 안쪽 20px, 행 높이 52px, 퀵 버튼 72px(`:393-411`). 다른 화면은 변수 없이 인라인 값(8·10·12·14·16)을 쓴다. 중단점이 한 곳에 정리돼 있지 않다: 600·640·767·901·1400px가 함께 쓰인다(`index.html`, `apms-theme-override.css`, `dashboard-foundation.css`).

### Named Rules
**The Phone-First Modal Rule.** 모달은 휴대폰 폭에서 아래에서 올라오는 시트가 된다: 너비 100vw, 위쪽 모서리만 16px, 높이 92dvh까지(`index.html:931-945`, `apms-unified-modal.css:138-150`).

**The 16px Input Rule.** 767px 이하에서 입력 글자는 16px 이상이다. iOS가 16px 미만 입력칸에 포커스할 때 화면을 자동 확대하기 때문이다(확대 허용 결정, `PRODUCT.md`).

## Elevation & Depth

평평하다. 카드는 그림자 없이 1px 선과 흰 면으로 구분한다. 그림자는 모달과 서랍 같은 떠 있는 것에만 남는다.

### Shadow Vocabulary
- **카드** (`box-shadow: none`): 웜 테마가 `--shadow`·`--shadow-sm`·`--shadow-md`를 `none`으로 둔다(`apms-warm-theme.scope.css:68-70`). `apms-theme-override.css:966-986`의 `!important`도 카드 그림자를 지운다. 다크도 `none`.
- **모달** (`0 16px 48px rgba(0,0,0,.14)`, `--shadow-lg`, `apms-theme-override.css:37, 217`): 모달 바깥 상자. 다크에서는 `none`(`:77`).
- **주요 버튼** 옛 파랑 버튼은 `0 8px 20px rgba(0,122,255,.20)`(`:139-145`)이었지만 웜 테마가 `.btn-primary`의 그림자를 `none !important`로 지운다.

### Named Rules
**The Flat-By-Default Rule.** 카드·버튼은 그림자 없이 선과 색으로 구분한다. 그림자는 모달에만 쓴다.

## Shapes

모서리는 3단계다(결정 2026-11-02: "카드·모달 16px, 입력·버튼 8px"). 이전에는 카드가 6px와 16px로 갈라져 있었다.
- **16px — 카드·모달**: `.card`·`.ap-card`·`.stat-card`·`.exam-card`·`.omr-card`·관리자 대시보드 카드·`.ap-dash-card`·`.ap-classroom-card`·`.apms-card`·모달 바깥 상자. 토큰 `--radius-lg`(웜 테마), `--ap-ui-radius-card`(`apms-ui-foundation.css`). 6px를 `!important`로 강제하던 규칙(`apms-theme-override.css` 약 957~986행, 모바일 1018~1026행)은 걷어냈다.
- **8px — 입력·버튼·칩·카드 안쪽 면**: 통합 모달 컨트롤, `.btn`, `.apms-button`(예전 10px), `.ap-chip`(예전 6px), 모달 안 맥락 상자·`.ap-modal-section`·진도 모달 안쪽 카드(예전 6px). 토큰 `--radius-md`, `--ap-ui-radius-control`, `--ap-ui-radius-panel`.
- **6px — 작은 면**: `--radius-sm`(웜). 새로 쓰지 않는다.
- **4px — 목록 행**: `--ap-ui-radius-row`.
- **알약 999px**: 탭 `.apms-tab`, 배지 `.ap-badge`, `.chip`.

둥근 모양이 아니라 선과 색이 구분의 주체다. 모서리 값은 위 단계 안에서만 고른다. 카드 안에 또 들어가는 면은 한 단계 낮춰 8px로 한다(16px 안에 16px를 넣지 않는다).

## Components

### Buttons
- **Primary** (`.btn-primary`·`.apms-button--primary`·`.ap-primary-btn`): 바탕 `#1c1917`, 글자 흰색, 테두리 없음, 그림자 없음(`apms-warm-theme.scope.css:114-129`, `!important`). 통합 모달 안에서는 44px 높이·패딩 10px 14px·13px/500·8px 모서리(`apms-unified-modal.css:120-129`). 일반 `.btn-primary`는 computed로 56px·15px/800·8px.
- **Quiet** (`.apms-button--quiet`·`.apms-unified-quiet`): 연한 안쪽 면 `--surface-2` + 1px 선, 글자 `--text`.
- **Danger** (`.btn-danger`): 투명 바탕 + `--error` 글자 + 1px `--error` 선, 눌림/호버 바탕 `--error-soft`.
- **일반 `.btn`**: computed 44px 높이·패딩 12px 16px·14px/700·8px, 바탕 `--surface`, 선 `--border`. 입력칸에도 `class="btn"`을 붙여 쓰는 곳이 많다(`js/management.js`에서만 45줄 등).
- **모달 상단 행동** (`#modal-action-btn`): 헤더 오른쪽 글자 버튼, 파랑 15px/700, 최소 44x44(`index.html:748-760`). 통합 모달은 13px/500으로 낮춘다(`apms-unified-modal.css:22-25`).
- 터치 높이: `.apms-button` 최소 34px(`apms-ui-foundation.css:159`), 통합 모달 컨트롤·버튼 44px. 24px(WCAG 2.2 최소)를 넘는다.

### Cards / Containers
- **`.apms-card`**: 흰 면, 1px `--border`, 16px, 안쪽 헤더·바디·푸터 각 12px 16px(`apms-ui-foundation.css:31-73`). 제목 14px/500, 메타 12px/400.
- **`.ap-card`**: 흰 면, 1px 선, 6px, 패딩 20px 24px(`:240-250`). 제목 15px/700, 통계 20px/700.
- **`.ap-dash-card`**(선생님 대시보드): 16px, 패딩 20px, 카드 사이 20px(`dashboard-foundation.css:469-476`).
- **`.apms-line-row`**: 목록 행, 최소 44px, 안쪽 9px 12px, 아래 1px 선(`:87-101`). `.ap-list-row`·`.ap-modal-row`는 4px 모서리 행.
- 카드 두 가족(`.apms-*` 16px와 `.ap-*` 6px)이 같은 파일에 공존한다.

### Chips / Badges
- `.ap-chip`: 최소 24px, 6px 모서리, 12px/500, 보조색 글자·안쪽 면(`apms-ui-foundation.css:292-306`). `.ap-badge`: 알약, 12px/500. `.apms-tab`: 알약, 최소 32px, 13px/500(`:203-212`). 상태색 배지는 연한 의미색 바탕 + 의미색 글자지만 대비가 낮을 수 있다(대비 표 참고).

### 모달 — 통합 양식 (`apms-unified-modal`)
**공통 껍데기.** 대부분의 모달은 `index.html:1014-1024`의 한 껍데기를 `showModal(title, bodyHtml, actionText, actionFn)`로 채운다(`js/ui.js:423`). 구조: `#modal-overlay`(`role="dialog" aria-modal="true" aria-labelledby="modal-title"`, 바깥 클릭으로 닫기, Tab 가두기. Escape 키로 닫는 코드는 없다 `handleModalKeyboard` `js/ui.js:428-445`) → `#modal-content` → 헤더(왼쪽 "취소" · 가운데 제목 · 오른쪽 선택 행동 버튼, 3열 `64px 1fr 64px`) → `#modal-body`(스크롤) → `#modal-footer`(선택). 여러 단계는 `showModalStep`(이전 화면을 스택에 쌓고 "취소"가 돌아감), `replaceModalStep`(교체)이다(`js/ui.js:447-460`). 같은 모달이 열려 있으면 열림 애니메이션을 다시 하지 않고 내용만 바꾼다(`js/ui.js:372-377`).

**일반 모달 (아직 대부분)**: 너비 500px(최대), 위 18px 20px 14px 헤더, 제목 20px/700 가운데, 본문 패딩 20px 24px(모바일 16px), 모서리 16px(`index.html:692-770`, computed 확인). 입력은 모달마다 인라인 스타일이다.

**통합 모달 양식 (opt-in)**: 본문 안에 `.apms-unified-modal`이 있을 때만 `#modal-content:has(.apms-unified-modal)`이 적용된다(`css/apms-unified-modal.css`, 진도 모달을 본뜬 양식). 크기·간격(computed 1280/390px 확인):
- **크기**: 너비 `min(720px, 100vw - 32px)`, 최대 높이 `100dvh - 32px`. 휴대폰(≤600px)은 100vw 시트, 위 모서리 16px, 높이 92dvh, 하단 안전영역 포함(`:4-9, 138-150`).
- **헤더**: 패딩 14px 20px 12px(모바일 14px 16px 12px), 제목 18px/600, 상단 행동 버튼 13px/500(`:10-25`).
- **본문**: 패딩 16px 20px 20px(모바일 12px 16px + 18px + 안전영역), 안쪽 스크롤(`:17-21`).
- **폼 틀 `.apms-unified-modal` `.apms-unified-form`**: 세로 flex, 항목 간격 12px(`:26-33`).
- **맥락 상자 `.apms-unified-context`** (`__name` 15px/600, `__meta` 12px/400 보조색): 패딩 11px 14px, 1px 선, 8px 모서리(`--ap-ui-radius-panel`), `--surface-2` 바탕. 모달 맨 위에 "무엇을 하는 모달인가"(반 이름 등)를 알린다(`:33-52`).
- **라벨 `.apms-unified-label`**: 12px/500 보조색, 위 여백 3px(`:53-59`).
- **컨트롤 `.apms-unified-control`**: 폭 100%, 최소 높이 44px, 패딩 10px 12px, 8px 모서리, 흰 면 + 1px 선, 13px(휴대폰 16px), textarea 최소 96px, 포커스 2px `--primary` 실선(`:60-85`).
- **요일 선택 `.apms-unified-day`**: 최소 38px, 패딩 8px 10px, 8px 모서리, 12px, 줄바꿈 간격 6px(`:86-103`).
- **격자 `.apms-unified-grid`**: 2열, 간격 8px. `--date` 변형은 날짜+시간(`1fr / 0.4fr`, 최소 116px)(`:104-111`).
- **액션줄 `.apms-unified-actions`**: 오른쪽 정렬, 간격 8px, 위쪽 패딩 10px + 1px 윗선. 버튼은 `.apms-unified-quiet`(보조)·`.apms-unified-primary`(주요, 웜 테마가 near-black으로 칠함) 각 최소 44px, 패딩 10px 14px, 13px/500, 8px 모서리(`:112-134`).
- 현재 이 양식을 쓰는 모달은 4개이고 모두 F 등급 클래스(`apms-modal apms-modal--form`)를 붙였다: 새 반 추가·반 수정(`management.js` `openAddClassModal`·`openEditClassModal`), 숙제 등록(`classroom.js` `openHomeworkPhotoAssignmentModal`), QR 생성기(`qr-omr.js` `openQrGenerator`). 옮길 때 지키는 것: 입력 ID, 저장 함수, 돌아갈 화면(`tests/apmath-modal-design-family.test.js`).
- **저장 버튼 위치는 하나다(결정 2026-11-02).** 반 추가·수정·QR 생성기는 예전에 헤더 오른쪽 "추가/저장/생성"이었으나 숙제 등록과 같은 하단 오른쪽 액션줄(`.apms-modal__actions`)로 옮겼다. 저장 함수·입력 ID·돌아갈 화면은 그대로다.
- **전용 큰 모달**: 진도 모달 `.ap-class-progress-modal`(너비 최대 1180px, 높이 860px, `apms-theme-override.css:1036-1049`), 교재 관리, 상담 전체 보기 등은 `#modal-content:has(...)` 규칙으로 따로 크기를 정한다. 클리닉 출력은 `clinic-print-fullscreen`(`apms-clinic-print.css:1008-`)으로 전체 화면이다. 상담 전체 보기(`dashboard-foundation.css:1379`)와 플래너(`classroom-planner.js:1588`)는 1080px, 전역 교재 관리는 폭 규칙이 없어 기본 500px이다.

### 모달 등급 — 4등급 (결정 2026-11-02) 과 공통 부품

모달 약 98종의 크기가 제각각이었으므로(기본 500px / 통합 720px / 진도 1180px / 상담·플래너 1080px / 클리닉 전체 화면) 4등급으로 묶고, 공통 부품을 `css/apms-unified-modal.css`(스타일)와 `js/ui.js`(Esc·바깥 클릭·dirty)에 만들었다. 98종 배정과 근거 줄은 `docs/plans/2026-11-02-apms-modal-consolidation-appendix.md`, 통합 묶음은 `docs/plans/2026-11-02-apms-ui-upgrade-plan-v0.1.md` 3절(내용 v0.3)에 있다.

| 등급 | 클래스 | 쓰는 곳 | 데스크톱·태블릿 | 휴대폰(≤600px) | Esc | 바깥 클릭 |
|---|---|---|---|---|---|---|
| **C 확인·선택** | `apms-modal--confirm` | 한 문장+값 나열+버튼 2~3개, 항목 고르기 | 너비 `min(500px, 100vw - 32px)` · 높이 `min(90dvh, 100dvh - 32px)` | 아래 시트(100vw, 위 모서리 16px, 92dvh) | 닫기. 입력 중이면 확인 | 닫기. 입력 중이면 안 닫음 |
| **F 폼** | `apms-modal--form` | 입력 1~8개, 짧은 읽기 목록 | 너비 `min(720px, 100vw - 32px)` · 높이 `100dvh - 32px` | 시트 100vw · 92dvh, 컨트롤 44px · 글자 16px | 닫기. 입력 중이면 확인 | 닫기. 입력 중이면 안 닫음 |
| **W 작업 화면** | `apms-modal--workspace` (단열: `apms-modal--workspace-single`) | 목록+상세(+같은 자리 추가·수정). 진도 모달형. 단열은 목록+인라인 폼 | 너비 `min(1180px, 100vw - 32px)`(≥901px에서는 왼쪽 레일을 피해 `100vw - 144px`), 단열 720px · 높이 `min(860px, 100dvh - 96px)`(위·아래 48px를 비워 앱 맨 위 뒤로 가기 버튼을 피함) · 목록 `minmax(260px, 0.38fr)` + 상세 `1fr`(≤900px에서는 `minmax(220px, 0.4fr)`) | **화면 전체**(100vw × 100dvh). 목록 위·상세 아래로 쌓고 모달 하나가 한 번에 스크롤 | 닫기. 변경이 있으면 확인 | **닫지 않음** |
| **P 전체 화면 패널** | `apms-modal--panel` | 컨트롤 많은 독립 도구(클리닉 출력 센터, 교재 오답) | 위 58px(앱 맨 위 줄 아래), 오른쪽·아래 14px, 왼쪽 70px(드로어를 펼치면 274px). ≤900px는 오른쪽·아래·왼쪽 10px | **화면 전체** | 닫기. 변경이 있으면 확인 | **닫지 않음** |

저장 위치: **모든 모달에서 하단 오른쪽 고정 액션줄**(`.apms-modal__actions`, 결정 2026-11-02). 휴대폰에서는 버튼이 가로로 나눠 채워 엄지로 닿는다. 일괄 저장 화면(진도 모달)도 같은 줄을 쓰고, 항목 하나짜리 인라인 폼은 폼 안 하단에 둔다. 휴대폰 W는 목록 위 · 상세 아래로 쌓는다(결정 2026-11-02). 학생 상세만 이후 드릴다운을 검토한다.

**등급 고르는 법.** ① 한 문장 확인이거나 항목 하나를 고르면 끝나면 C. ② 입력칸이 있고 저장하면 닫히면 F. ③ 같은 대상을 목록에서 고르고 상세를 보고 같은 자리에서 추가·수정하면 W(상세 열이 필요 없으면 단열). ④ 컨트롤이 많은 독립 도구(미리보기·출력)면 P. 애매하면 F부터 시작한다.

**마크업 골격.** 등급 클래스는 `showModal` 본문의 **맨 바깥 요소 하나**에만 단다. 스크롤은 이 요소가 맡고, 저장·취소는 그 안 맨 끝 `.apms-modal__actions`에 둔다(내용이 길면 `position: sticky`로 하단에 고정, 짧으면 맨 아래에 붙는다).

```html
<!-- F 폼 -->
showModal('새 반 추가', `
  <div class="apms-modal apms-modal--form apms-unified-modal apms-unified-form">
    <div class="apms-unified-context">…</div>
    <label class="apms-unified-label" for="x">이름</label>
    <input id="x" class="apms-unified-control">
    <div class="apms-modal__actions">
      <button type="button" class="btn apms-unified-quiet" onclick="closeModal()">취소</button>
      <button type="button" class="btn btn-primary apms-unified-primary" onclick="save()">저장</button>
    </div>
  </div>`);

<!-- W 작업 화면: 모달 하나에서 목록 선택은 서버 호출 없이 상세만 바꾼다 -->
showModal('숙제', `
  <div class="apms-modal apms-modal--workspace">
    <div class="apms-workspace__bar">반 전환 탭 · 맥락 줄</div>
    <div class="apms-workspace">
      <div class="apms-workspace__list"><button class="apms-workspace__item is-active">…</button></div>
      <div class="apms-workspace__detail">…</div>
    </div>
    <div class="apms-modal__actions">…</div>
  </div>`);
```
- 위험 행동(삭제·보관)은 액션줄 첫 칸에 `class="btn btn-danger apms-modal__actions-start"`로 둔다(왼쪽 끝으로 떨어져 저장 버튼과 멀다. 휴대폰에서는 한 줄을 따로 쓴다).
- P는 본문을 `.apms-modal__body`에 넣는다(스크롤). 앞으로 필요한 다른 구조는 클래스를 추가하지 말고 이 문서에 먼저 적는다.
- 헤더 행동(`showModal(제목, 본문, '저장', fn)`)을 넘기는 옛 호출도 등급 모달에서는 하단 액션줄로 옮겨 그려진다(`ui.js` `adoptHeaderActionIntoModalActions`). 이때 모달 헤더에 "취소"가 있으므로 하단에는 주 버튼만 만든다(헤더·하단 취소 중복 금지, 사용자 결정 2026-11-02). 새 코드는 액션줄을 직접 쓴다.
- 입력은 라벨을 달고(`.apms-unified-label` + `for`), `.apms-unified-control`(최소 44px, 테두리 `--control-border`)을 쓴다.

**Esc·바깥 클릭·변경 감지 (`js/ui.js` "모달 닫기 정책" 구역).**
- Esc: `document`의 keydown 한 곳에서 받는다(`handleModalEscape`). 열린 모달 하나(맨 위)만 닫고, 단계 모달(`showModalStep`)은 한 단계만 돌아간다(`closeModal()`과 같은 의미). 한글 입력 조합 중, 로그인 화면이 위에 있을 때는 무시한다. 모달 위에 뜨는 다른 레이어(전체 화면 오버레이 등)가 Esc로 닫혀야 하면 `const off = registerEscapeLayer(() => close())`로 등록하고 닫을 때 `off()`를 부른다. 더 늦게 열린 쪽만 반응한다.
- 바깥 클릭: `#modal-overlay`의 `onpointerdown`/`onclick`이 `handleModalBackdropPress/Click`을 부른다. 누르기와 놓기가 모두 배경일 때만 처리하므로, 글자를 끌다가 밖에서 놓아도 닫히지 않는다. 판정은 순수 함수 `decideModalClose(source, tier, dirty)`(C·F·옛 모달: 변경 없을 때만 닫음 / W·P: 닫지 않음). 헤더 "취소"(`requestCloseModal('cancel')`)·앱 ←·기기 뒤로 가기(`requestCloseModal('back')`)도 Esc와 같다: 변경이 있으면 확인하고, 없으면 닫는다(N2, 2026-11-02. 전에는 확인 없이 닫아 OMR·진도 입력이 사라졌다). 코드가 부르는 `closeModal()`과 저장 성공 뒤 `closeModal(true)`는 확인하지 않는다.
- 변경 있음(dirty) 판정 우선순위: ① 모달이 등록한 콜백 `setModalDirtyChecker(() => boolean)`(있으면 이것만 본다. `showModal` **뒤에** 등록하고, 모달이 닫히면 자동으로 지워진다. 단계 모달은 단계마다 따로 보관). ② 진도 모달은 `hasUnsavedClassProgressChanges`를 자동으로 쓴다(`.ap-class-progress-modal`이 본문에 있을 때). ③ 그 밖에는 본문 안 입력·선택·텍스트 칸을 **사용자가 직접 바꿨는가**(신뢰된 `input`/`change` 이벤트. 코드로 `.value`를 넣은 것은 세지 않으므로 미리 채우는 수정 폼이 처음부터 "변경됨"이 되지 않는다). 검색창은 `type="search"`나 `data-apms-nodirty` 속성으로 뺀다. 저장이 끝나고 모달을 이어서 쓸 때는 `markModalClean()`, 코드로 바꾼 값을 변경으로 치고 싶으면 `markModalDirty()`. `setModalBody(html)`로 본문을 통째로 바꾸면 입력 중 표시가 처음으로 돌아간다.
- 확인 문구는 `입력한 내용이 저장되지 않았습니다. 닫을까요?`(`confirm`). 앱의 다른 확인과 같은 방식이다.

**공유 파일 규칙(동시 작업용).** 공통 부품(`apms-unified-modal.css`의 `.apms-modal*`·`.apms-workspace*`, `ui.js`의 닫기 정책, 전역 토큰)은 이 문서를 바꾸는 별도 작업에서만 고친다. 각 묶음은 자기 모달 함수와 그 함수만 쓰는 CSS만 고치고, 공통 부품에 필요한 것이 있으면 새 클래스를 만들지 말고 보고한다. 자세한 경계는 계획서 3.5.

현재 공통 동작(코드 사실, 2026-11-02 이후): `closeModal()`은 확인 없이 닫는다(저장 흐름이 부르기 때문). 모달 연쇄에는 대부분 뒤로 가기가 없다(`showModalStep`은 일정·시간표·학생 상세만 사용).

**기기 뒤로 가기 = 앱 ← (N2, `ui.js` "브라우저 뒤로 가기 연결").** 뒤로 갈 곳이 있는 동안(열린 모달·단계 모달·위 Esc 레이어·화면 이력 `backStack`) 브라우저 이력에 보호 항목 한 칸(`history.state.apmsGuard`)을 둔다. 뒤로 가기(popstate)는 한 겹만 닫고(맨 위 레이어 → 모달/단계 → 화면 이력 한 칸), 입력 중이면 확인한다. 코드가 닫아 갈 곳이 0이 되면 `history.go(-1)`로 보호 항목을 걷어 "두 번 눌러야 하는" 일이 없다. 첫 화면에서는 보호 항목이 없어 뒤로 가기는 기본 동작(앱 종료)이다. 보호 항목의 주소는 현재 주소 그대로다(`pushState(state, '', location.href)`). 주소에 남기는 것은 반 화면의 `#class=<id>` 하나뿐이다(아래 "새로고침 위치 복원"). 대시보드로 직접 돌아오면 화면 이력을 비우고, 학생 상세(모달)는 화면 이력에 넣지 않는다. 새 모달·화면을 만드는 코드는 따로 할 일이 없다(`showModal`·`closeModal`·`appHistoryRecordView`가 알아서 맞춘다). 모달 밖 전체 화면 레이어를 직접 만들면 `registerEscapeLayer`에 등록해야 뒤로 가기가 닫는다.

**새로고침 위치 복원 (N4, 결정 D3: 반 화면만, `ui.js` "새로고침 시 반 화면 복원").** 반 화면에 있는 동안 주소에 `#class=<반 id>`만 `replaceState`로 쓰고(이력 칸을 늘리지 않음), 대시보드 등 다른 화면으로 가면 지운다. 모달·학생 상세는 주소에 넣지 않는다. 새로고침(또는 그 주소로 열기) 뒤 `loadData(true)`가 로그인 세션이 있고 그 반이 `isClassroomClassAccessible`이면 대시보드를 화면 이력에 남기고 반 화면을 연다(뒤로 1번 = 대시보드, 2번 = 앱 종료. 새로고침으로 물려받은 보호 항목은 복원할 때만 그대로 쓰고, 복원하지 않으면 일반 항목으로 바꾼다). 접근 불가·없는 반은 조용히 대시보드 + 해시 제거. `hashchange`는 듣지 않는다: 뒤로 가기·`history.go(-1)`은 popstate가 처리하고 이동한 자리의 해시는 popstate 끝에서 현재 화면에 맞춘다. 로그인 전이면 해시를 두었다가 해시를 쓴 사용자(탭 `sessionStorage`의 id)와 같은 사용자가 로그인할 때만 복원한다. 로그아웃은 해시·열린 반(`state.ui.currentClassId`)을 모두 지워 다른 계정이 앞 사용자의 반을 보지 못한다.

**토스트·앱 ← (N2).** 모달이 열려 있으면 토스트는 모달 제목줄 바로 아래에 뜬다(`toast()`가 `#modal-header`를 재서 `--toast-top`·`--toast-left`를 넣는다). 휴대폰(≤600px)의 화면 전체 모달(W·P·클리닉 전체 화면)에서는 헤더 "취소"와 겹치므로 앱 ← 버튼을 숨긴다. `body.ap-modal-open > header`는 앱 맨 위 헤더만 잡는다(모달 안 `<header>`는 영향 없음).

**통합 작업 화면 패턴(W)** — 진도 모달(`classroom.js` `openClassRecordModal`)에서 뽑은 규칙: 대상 하나 + 전환 탭, 목록/상세 한 쌍(선택은 서버 호출 없이), 추가·수정은 인라인 폼·행 펼침, 모달 연쇄 금지·미저장 변경 확인, 늦은 응답 가드, 모달 먼저 열고 자리에서 로딩, 저장 응답으로 로컬 상태 갱신(전체 `loadData()`·재오픈 지양). 근거 줄은 계획서 3.1. **진도 모달 자체는 아직 이 공통 클래스로 옮기지 않았다**(진도·교재 묶음 M8 담당). 지금 `.ap-class-progress-*` CSS가 같은 구조를 따로 갖고 있다.

### Inputs
- 통합 모달: 위 "컨트롤"(`.apms-unified-control`). 일반: `.cls-input`(computed 최소 48px, 14px, 14px 모서리), 모달별 인라인(`min-height:42px` + 10px 모서리 등), `class="btn"`을 입력에 붙인 것(교재 등록 등). 기본 입력 규칙(`apms-theme-override.css`)은 바탕 `--surface`, 테두리 `--control-border`(UI 대비 3:1 이상, 2026-11-02), 모서리 8px이다. **포커스는 `--primary` 2px 실선 고리**(`outline: 2px solid var(--primary)`, 입력칸은 테두리도 `--primary`)로 통일했다. 인라인 스타일로 `border:1px solid var(--border)`를 쓴 입력칸은 이 토큰을 따르지 않으므로(수백 곳) 각 묶음 작업이 해당 모달을 옮길 때 통합 컨트롤로 바꾼다.
- 라벨 없이 placeholder만 쓰는 폼이 많다(신규 학생 추가 입력 7개 모두).

### Tabs
- `.tab-bar`/`.tab-btn`(옛, `apms-theme-override.css:163-176`): 선택 시 흰 면 + `--primary` 글자. `.apms-tab`: 알약, 선택 시 연한 파랑 면.

### Navigation
- 데스크톱 56px 레일(펼침 260px) + 58px 상단 막대, 휴대폰은 헤더 + 서랍(`css/sidebar-foundation.css`, `.drw-*`). 뒤로 가기 버튼은 모달이 열려 있어도 헤더 위에 남는다(휴대폰 화면 전체 모달은 제외, 위 "기기 뒤로 가기 = 앱 ←").
- **서랍·레일 (N1, 결정 2026-11-02).** 선생님 서랍은 자주 쓰는 순서로 묶는다: 수업(시간표·출석부·진도·교재·클리닉·원내평가·OMR) / 반·학생(반 관리·학생 관리·퇴원생) / 기록(일지·메모·일정관리) / 평가·리포트 / 자료 / 지원(`ui.js` `buildDrawerMenu`). 원장 서랍은 항목 구성을 바꾸지 않는다(D1) — 이름 통일·현재 위치·레일 아이콘만 같다. 이유: 같은 일에 이름이 여럿이라(학급관리/반 관리, 원내평가/OMR 입력) 같은 기능을 다른 기능으로 오해했다.
- **이름:** "학급" 대신 "반"(반 관리). 서랍의 "원내평가"와 "OMR 입력"은 작업 화면 하나이므로 "원내평가·OMR" 한 항목이다(`openExamWorkspace('')`). "교재관리"는 "진도·교재"(교재 관리 모드로 연다).
- **현재 위치:** 항목을 누르면 `drawerMark(key, kind)`가 `aria-current="page"`(+`.drw-active`)를 그 항목에 단다. 모달형은 닫히면 해제하고, 시간표·출석부·학교성적은 `appHistoryState.currentView`를 따라간다. 표시는 왼쪽 3px 막대 + 옅은 면 + 600 굵기(색만으로 알리지 않는다).
- **레일(≥901px 접힘 56px):** 항목 아이콘만 보이고 이름은 `aria-label`+`title`(터치 기기는 아이콘만). 묶음 사이는 1px 선. 항목 44px, 낮은 화면(1280×800 선생님)은 레일 안에서 스크롤하고 로그아웃은 맨 아래에 붙는다. 이유: ☰ 하나뿐인 레일은 태블릿 가로에서 매번 펼쳐야 했다. 주의: `ui.js` `installDrawerSizeLock`이 `<style>`을 나중에 주입해 같은 선택자를 덮는다 — 서랍 크기를 바꿀 때는 거기도 함께 고친다.
- **머리줄 한 줄 (≥901px, 2026-11-02 사용자 지적):** 레일(접힘)·서랍(펼침) 맨 위 칸과 `.desktop-topbar`는 같은 높이 토큰 `--ap-drawer-header-h`(58px, 테두리 포함, `box-sizing:border-box`)와 같은 `border-bottom:1px solid var(--border)`로 아래 선을 그어 화면 전체 폭에서 한 줄로 이어진다. 레일(접힘)은 ☰ 버튼(`.drw-rail-toggle`) 자체가 56×58 머리 칸(border-bottom), 펼침은 위쪽 테두리를 없애 `.drw-top-tools` 선이 같은 y에 놓인다. 둘 다 `position:sticky; top:0`이라 항목이 많아 서랍·레일이 스크롤돼도 머리줄이 상단 막대 선과 같은 y에 남는다(항목은 밑으로 지나간다). 새 높이 숫자를 따로 쓰지 않는다. 이유: N1·N3 뒤 레일 선(스크롤하면 ☰와 함께 올라가는 1px 배경 막대)과 상단 막대 선(border)이 따로 그려져 어긋났고, 펼침 서랍은 둘레 1px 테두리 때문에 선이 1px 아래로 밀렸다. 확인: `node tests/apms-header-line-browser.cjs`.

## 학생 포털·숙제·플래너의 현행 기준

학생 화면은 APMS의 웜 체계를 따르며 실제 학생의 사용 순서에 맞춰 구성한다. 현행 구현과 후속 디자인 검수 범위는 [학생포털 UX 계약](../docs/operations/AP_Math_Student_Portal_UX_Current.md)에 정리한다. 실험실은 별도 `playground/DESIGN.md`의 board/paper·Universe 정체성을 유지한다.

| 항목 | 학생 포털 | 과제 제출 | 플래너 |
|---|---|---|---|
| 스타일 소유 | `student/student-portal.css`; 구형 foundation/override 중첩 제거 | `css/student-tools.css` | `css/student-tools.css`; 기존 기능 스타일 위에 화면 전용 토큰 적용 |
| 바탕·글자·행동 | `#faf9f7` · `#1c1917`; 주요 행동 near-black | 같은 웜 토큰 | 라이트는 같은 웜 토큰, 기존 다크 선택 보존 |
| 기능색 | 파랑은 선택·포커스·링크, 초록은 제출 완료, 황토색은 진행 상태, 빨강은 오류 | 같은 의미색 | 같은 의미색; 다크는 별도 대비 검증 |
| 형태 | 주요 카드 16px, 입력·버튼 8px, 보조 묶음 12px | 동일 | 동일 |
| 입력·읽기 | 입력 16px, 학생 본문·보조 글자 최소 12px, 버튼 최소 44px, 확대 허용 | 실사진 미리보기·선택 장수·삭제·제출 단계 | 날짜 이동·월력·모달·타이머 조작도 같은 기준 |
| 화면 이동 | 홈·시험지·실험실·플래너·더보기 공통 메뉴; 모바일 하단/PC 상단; 브라우저 뒤로가기; 시험지 ID별 기록 상태 | 학생포털 복귀 | 학생포털 복귀, 모달 Esc·포커스 복귀 |
| 학습 순서 | 홈 첫 화면의 시험지·실험실·플래너·과제 네 기능 → 최근 학습 한 건; 학습 기록·오답은 더보기 | 과제 확인 → PIN → 사진 → 완료 | 선택 날짜와 할 일 우선, 월력·집중 시간 지원 |

홈은 네 핵심 기능을 먼저 표시하고 최근 시험지 한 건만 간결하게 보여 준다. 전체 시험지는 공통 메뉴의 시험지 목록에서 계속 접근할 수 있으며 같은 서버 목록과 제출 상태를 사용한다. 시험지·OMR·해설·플래너·과제·실험실에서도 공통 이동 구조를 유지한다. 선생님 미리보기에서는 기능을 숨기지 않고 읽기 전용 여부와 이용 제한 사유를 표시한다. OMR은 틀린 번호 선택·예상값·서버 기록 점수를 분리한다. 제출된 시험의 기록 점수·정답·해설은 다시 열 수 있으며 제출 상태가 미확인이거나 취소·대체·열람 전용인 시험에 새 OMR을 보내지 않는다.

개선된 외형만으로 검증 완료를 선언하지 않는다. 합성 API를 사용하는 실제 Chromium 하니스 `tests/student-portal-ux-browser.cjs`가 제품 HTML을 실행하며, 배포된 공개 화면과 배포 SHA 일치는 운영에서 별도로 확인한다. 인증이 필요한 합성 시나리오는 실제 학생 계정의 운영 제출 검증과 구분한다.

## Do's and Don'ts

### Do:
- **Do** 색은 `var(--surface)`·`var(--text)`·`var(--border)`·`var(--action-primary)` 같은 토큰으로 읽어 라이트·다크가 함께 바뀌게 한다.
- **Do** 주요 행동은 `--action-primary`(near-black), 파랑은 링크·포커스·선택으로 한정한다.
- **Do** 반 이름은 학년을 겹쳐 쓰지 않는다("중3 · 중3A" 금지 → "중3A". 이름에 학년 글자가 없을 때만 "고1 심화반"처럼 붙인다). 같은 화면에 이름이 같은 반이 있고 담당이 다를 때만 작은 보조 글자로 담당 이름을 붙이고, 모달 제목에는 넣지 않는다. 공통 함수 `apmsClassLabel(cls, peers)`를 쓴다. 이유: 사용자 지적 2026-11-02 — 학년이 두 번 보이고, 선생님마다 중3A가 여러 개라 헷갈림.
- **Do** 새 모달은 등급을 정하고(C·F·W·P) 공통 부품(`apms-modal apms-modal--<등급>` + `.apms-unified-context/-label/-control` + 하단 `.apms-modal__actions`)으로 만들고 입력 ID·저장 함수·돌아갈 화면을 지킨다(`tests/apmath-modal-design-family.test.js`).
- **Do** 같은 대상을 목록·상세·추가·수정으로 앞뒤로 다루면 모달을 여러 개 잇지 말고 작업 화면(W) 하나로 만든다(위 "모달 등급").
- **Do** 모달의 입력은 라벨을 달고(`.apms-unified-label`), 휴대폰에서 글자 16px·높이 44px을 지킨다.
- **Do** 의미색(`--success`·`--warning`·`--error`)은 값 자체가 AA를 통과하므로 글자로 그대로 쓴다. 파랑 `--primary`는 다크 모드에서 안쪽 면(`--surface-2`) 위에 글자로 쓰지 않는다(4.12:1).
- **Do** 화면을 바꾼 뒤 휴대폰 390×844 · 태블릿 800×1280·1280×800 · PC 1440×900·1280×800에서 가려지거나 넘치는 내용이 없는지 연다(라이트·다크). 하니스: `tests/apms-foundation-browser.cjs`.
- **Do** `prefers-reduced-motion`을 지킨다(`css/`와 `index.html` 중에는 `dashboard-foundation.css:1312`에만 있다).

### Don't:
- **Don't** 모달 안에 새 인라인 스타일 입력칸을 만들지 않는다(통합 컨트롤 사용).
- **Don't** 파란 `.btn-primary` 면, 빨간 면 삭제 버튼, 다색 툴 버튼을 만들지 않는다.
- **Don't** 카드에 그림자를 더하지 않는다. 그림자는 모달만.
- **Don't** `!important`를 새로 더해 위 체계를 이기려 하지 않는다. 실제로 이기는 값이 헷갈리는 이유다.
- **Don't** 확대를 막지(`user-scalable=no`) 않는다(결정 2026-11-01).
- **Don't** 문항·해설·점수의 값을 디자인 작업으로 바꾸지 않는다.
- **Don't** 글자를 12px 아래로 내리지 않는다(결정 2026-11-02). 학생이 읽는 글자는 12px 이상이다. 기존 11px·10px는 해당 화면을 옮길 때 올린다.

## 결정 기록 (2026-11-02, 사용자)

사용자 원문 요지: "자주 쓰는 건 진도·교재, 클리닉, 반·학생 관리. 원내평가·OMR도 지금 하나로(반 화면 안 OMR은 거의 안 씀). 숙제는 거의 안 씀. 학생은 휴대폰으로 학생 포털, 선생님은 휴대폰·태블릿(갤럭시 탭)으로 APMS를 관리하고, 원장은 PC로 한다. 모바일·태블릿·PC 다 잘 봐줘야 한다. 설계대로 고쳐 보고 확인하고 다시 고치자. 진행." 아래는 메인 추천안을 전부 승인한 것이다.

| # | 결정 | 반영 |
|---|---|---|
| 1 | 학생 포털·숙제·플래너는 APMS 웜 체계(색·버튼·모달)로 맞춘다. 학생 화면은 휴대폰 기준으로 글자·누르는 영역을 더 크게 한다. | 학생 포털·숙제·플래너에 반영. 현행 화면·검수 계약은 위 학생 포털 절과 연결 문서 참조. |
| 2 | 카드·모달 모서리 16px, 입력·버튼 8px. 6px `!important` 강제 규칙을 걷어낸다. | 반영(옛 미정 2번). Shapes 참고. |
| 3 | 의미색(성공·경고·오류)을 글자로 쓸 때는 AA 4.5:1 통과 값. 배경·아이콘용은 기존 값 유지 가능. | 반영(옛 미정 4번). 값 자체를 AA 통과 값으로 바꿔 한 토큰으로 둔다(대비 표). |
| 4 | 학생이 읽는 글자 최소 12px. 글자 크기 변수 한 벌로 통합. APMS·플래너에 Pretendard 로드. | 반영(옛 미정 5·7번). 기존 11px·10px 사용처는 화면을 옮길 때 올린다. |
| 5 | 입력칸 테두리·포커스 고리 UI 대비 3:1 이상. | 반영(옛 미정 10번). `--control-border`, 2px `--primary` 고리. |
| 6 | 화면 확인은 로컬 하니스(정적 서버 + 가짜 API). 서버·인증 코드 변경 금지. 저장소에는 `tests/` 아래 테스트 전용 파일로만. | `tests/apms-foundation-browser.cjs`. 로그인 오버레이를 숨기지 않고, 테스트용 세션을 localStorage에 넣고 API를 가로챈다. |
| 7 | 모달 4등급(확인 C / 폼 F / 작업 화면 W(+단열) / 전체 화면 P) 확정, W 기본 너비 1180px. 저장 버튼은 모든 모달에서 하단 오른쪽 고정 액션줄. Esc로 닫기 추가 — 입력 중이거나 저장 안 한 변경이 있으면 "닫을까요?" 확인. 바깥 클릭은 입력·변경이 있으면 닫지 않는다. 휴대폰 W는 목록 위·상세 아래로 쌓기(학생 상세만 이후 드릴다운 검토). 정리 후보 17종 삭제는 별도 PR(이번 범위 밖, "의심" 3종은 재확인). 통합 묶음 8개 승인. 교재 관리는 진도 작업 화면의 교재 관리 모드로 일원화. 클리닉 2버튼 메뉴·반 고르기 모달은 탭으로. | 등급·액션줄·Esc·바깥 클릭·휴대폰 동작은 공통 부품으로 구현(옛 미정 6·11·12·13번). 묶음·삭제·교재·클리닉 탭은 이후 PR(옛 미정 14·15·16번은 결정만, 실행 전). |
| 8 | 진행 순서: 기반(이번) → 진도·교재(M8), 클리닉(M7), 반·학생 관리(M4+M6), 원내평가·OMR(M3, 반 화면 OMR을 원내평가 쪽으로 합침)을 동시에 → 이후 계정(M2)·플래너(M5)·숙제(M1)·정리 후보 삭제. | 계획서 v0.3 3.5. 숙제는 거의 쓰지 않아 순서를 뒤로 미뤘다. |
| 9 | 대상 기기: 휴대폰 390×844, 태블릿(갤럭시 탭) 세로 800×1280·가로 1280×800, PC 1440×900(그리고 1280×800). 모든 화면 검수는 이 4~5 크기. | 위 "대상 기기" 표. |

## 미정 (사용자 결정 필요)

1. **Creative North Star** 이름(잠정 "종이 장부")과 Overview의 말투를 확정할지.
2. **옛 토큰 정리 범위**(옛 8번): `--ap-*` 슬레이트 토큰과 쓰이지 않는 `--shadow-modal`, 인라인 `:root`(`index.html`)·`apms-theme-override.css` `:root` 중 무엇을 남길지.
3. **독립 화면 포함 여부**(옛 9번): `apmath/wangji-student-management.html`(`css/wangji-student-management.css`, `wsm-*`)와 `apmath/wrong_print_engine.html`은 `apmath/` 아래라 이 문서의 영향을 받지만 별도 체계다. 이 문서에 넣을지.
4. **정리 후보 17종 삭제 실행**(옛 14번): 방침은 별도 PR로 정했으나, "의심" 3종(숙제 링크·QR 2종, EIE 보호자 관리 1종 — 숨김이 테스트로 고정됨)은 실제 화면에서 쓰는 곳이 없는지 재확인 후 실행한다.
5. **파랑(`--primary`)의 다크 모드 안쪽 면 위 글자 대비**(4.12:1): 파랑이 채움에도 쓰여 밝히면 흰 글자 대비가 깨진다. 글자로는 `--text`를 쓰는 방향이 유력하나 정하지 않았다.
6. **학생 상세 휴대폰 드릴다운**: 휴대폰 W의 "목록 위·상세 아래" 쌓기를 학생 상세만 목록 → 상세 화면 전환으로 바꿀지 이후 검토.
