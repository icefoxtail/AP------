---
name: AP Math OS (APMS) · 학생 포털
description: 웜 중립(stone) 종이 바탕에 near-black 주요 버튼, 색은 데이터에만 쓰는 운영 화면. 모달은 통합 양식(apms-unified-modal) 하나로 모은다.
colors:
  bg: "#faf9f7"
  surface: "#ffffff"
  surface-2: "#f5f3f0"
  border: "#e8e5e0"
  border-soft: "#f1efeb"
  text: "#1c1917"
  text-soft: "#44403c"
  secondary: "#78716c"
  action-primary: "#1c1917"
  action-primary-hover: "#292524"
  on-primary: "#ffffff"
  primary: "#2563eb"
  primary-dark: "#1d4ed8"
  accent-soft: "#eef4ff"
  success: "#15a34a"
  success-soft: "#ecfdf3"
  warning: "#d97706"
  warning-soft: "#fdf3e3"
  error: "#dc2626"
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
  dark-error: "#ef4444"
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
  lg: "10px"
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
  modal-context:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    typography: "{typography.section}"
    rounded: "{rounded.sm}"
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
> **기준(authority).** 현재 실제로 적용되는 APMS 체계, 곧 웜 테마(`css/apms-warm-theme.scope.css`)와 통합 모달 양식(`css/apms-unified-modal.css`)이다. 학생 포털·숙제·플래너가 이와 다른 부분은 "학생 포털과의 차이"에 사실로 적고, 어느 쪽으로 맞출지는 정하지 않았다(맨 아래 미정 목록).
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
- 정보 밀도가 높다. 본문 13px, 보조 12px, 11px는 "보조정보 전용"(`apms-ui-foundation.css:224`).

## Colors

웜 stone 중립 위에 파랑 기능색 하나와 의미색 3가지(초록·주황·빨강). 값은 `body.apms-warm-scope`(`index.html:987`의 `<body class="apms-warm-scope">`로 앱 전체에 부여)에 선언되고, `index.html:14-`의 인라인 `:root`(옛 파랑 `#1A5CFF` 계열)와 `apms-theme-override.css:6-`의 `:root`(iOS 파랑 `#007AFF` 계열)를 body 수준에서 덮어쓴다. 로드 순서는 `index.html:974-985`(`<link>`), 클래스는 `:987`.

### Primary
- **주요 행동 검정** (`#1c1917`, `--action-primary`, `apms-warm-theme.scope.css:25`): 저장·확정·추가 버튼 바탕. 위 글자 `--on-primary` `#ffffff`. 눌림 `#292524`(26줄). 다크에서는 뒤집혀 바탕 `#fafaf9`, 글자 `#1c1917`(79-81줄). `.btn-primary`·`.ap-primary-btn`·`.apms-button--primary`에 `!important`로 적용된다(`:114-129`).
- **기능 파랑** (`#2563eb`, `--primary`, 36줄): 링크, 포커스, 선택, 모달 상단 행동 글자("추가"·"저장"), 오늘 표시. 눌림 `--primary-dark` `#1d4ed8`. 다크 `#3b82f6`(88줄).

### Secondary
- 없음. 주요 행동은 검정, 기능 표시는 파랑 하나다.

### Tertiary — 데이터 의미색
- **초록** (`#15a34a`, `--success`, 56줄; 연한 바탕 `#ecfdf3`): 출석·완료. 다크 `#22c55e`.
- **주황** (`#d97706`, `--warning`, 58줄; 연한 바탕 `#fdf3e3`): 주의·지각·미제출. 다크 `#f59e0b`.
- **빨강** (`#dc2626`, `--error`/`--danger`, 60줄; 연한 바탕 `#fef2f2`): 오류·삭제·결석. 다크 `#ef4444`. 삭제는 투명 바탕 + 빨간 글씨 + 빨간 선이고 빨간 면을 쓰지 않는다(`:131-143`).

### Neutral
- **종이 바탕** (`#faf9f7`, `--bg`, 45줄) → **카드** `#ffffff`(`--surface`) → **안쪽 면** `#f5f3f0`(`--surface-2`, 모달 맥락 상자·분리 줄·표 머리). 선 `#e8e5e0`(`--border`, 49줄), 약한 선 `#f1efeb`.
- 글자: `#1c1917`(`--text`) · `#44403c`(`--text-soft`) · `#78716c`(`--secondary`, 메타·라벨·모달 라벨, 53줄).
- 다크: 바탕 `#0c0a09`, 카드 `#1c1917`, 안쪽 `#292524`, 선 `#34302c`, 글자 `#fafaf9`·`#d6d3d1`·`#a8a29e`(96-104줄).
- 오버레이: 모달 뒤 `rgba(0,0,0,0.42)` + `blur(12px)` (`apms-theme-override.css:202-206`이 `index.html:643-`의 `.5`/`blur(4px)`를 이긴다).

### 쓰이지 않거나 흐릿한 토큰 (실측 2026-11-02)
- `--shadow-modal`(`0 8px 28px rgba(0,0,0,.12)`, 웜 테마 71줄)은 어디서도 쓰이지 않는다(`grep` 결과 정의 1건). 모달의 실제 그림자는 `--shadow-lg` `0 16px 48px rgba(0,0,0,.14)`(`apms-theme-override.css:37, 217`)이고 다크에서는 `none`.
- `--radius-sm/md/lg`(웜 6/8/10px)는 카드 대부분에서 `!important` 고정값(6px·16px)에 가려진다(Shapes 참고).
- `--ap-*`(옛 "Wangji Compact Admin Tokens", `index.html:41-80`)는 웜 테마가 건드리지 않아 파랑·슬레이트 값 그대로다(`--ap-btn-primary-bg` `#334155` 등). `--ap-text`·`--ap-border`·`--ap-purple`·`--ap-muted`가 일부 화면에서 쓰인다(`var(--ap-…` 사용 수: `--ap-space-*` 28, `--ap-border` 12, `--ap-text` 10, `--ap-purple` 7, `--ap-muted` 6). `--ap-inactive`는 정의만 있고 쓰이지 않는다.
- 웜 테마 머리말이 가리키는 초안 `docs/design/drafts/apms-warm-theme.draft.css`·`apms-warm-mapping.md`는 이 저장소에 없다.

### 대비 (WCAG 2.2 AA: 본문 4.5:1, UI 3:1) — 주요 조합만
계산: sRGB 상대휘도 L으로 (밝은 L+0.05)/(어두운 L+0.05). 스크립트로 계산했고 반올림 2자리.

| 조합 | 비율 | 판정 |
|---|---|---|
| 라이트 `--text` `#1c1917` / `--bg` `#faf9f7` | 16.62 | 통과 |
| 라이트 `--secondary` `#78716c` / `--surface` 흰색 (12px 보조·모달 라벨) | 4.80 | 통과 |
| 라이트 `--secondary` / `--bg` `#faf9f7` | 4.56 | 통과(여유 적음) |
| 라이트 `--secondary` / `--surface-2` `#f5f3f0` (모달 맥락 상자 메타 12px) | **4.33** | **본문 미달** |
| 라이트 `--primary` `#2563eb` / 흰색 | 5.17 | 통과 |
| 라이트 `--success` `#15a34a` / 흰색 (글자로 쓸 때) | **3.30** | **본문 미달** (UI 3:1은 통과) |
| 라이트 `--warning` `#d97706` / 흰색 | **3.19** | **본문 미달**. `--warning-soft` `#fdf3e3` 위는 **2.90**으로 UI 3:1도 미달 |
| 라이트 `--error` `#dc2626` / 흰색 | 4.83 | 통과. `--error-soft` `#fef2f2` 위는 **4.41**로 본문 미달 |
| 라이트 흰 글자 / `--action-primary` `#1c1917` | 17.49 | 통과 |
| 다크 `--secondary` `#a8a29e` / `--surface` `#1c1917` | 6.93 | 통과 |
| 다크 `--primary` `#3b82f6` / `--surface` | 4.75 | 통과. `--surface-2` `#292524` 위는 **4.12** (본문 미달) |
| 다크 `--error` `#ef4444` / `--surface` | 4.65 | 통과. `--surface-2` 위는 **4.03** (본문 미달) |
| 라이트 입력칸 테두리 `#e8e5e0` / 흰색 (UI 3:1) | **1.26** | **미달** (다크 `#34302c` / `#1c1917`도 1.34) |
| 라이트 포커스 고리 `rgba(primary, .14)` 4px (`apms-theme-override.css:362-370`) / 흰색 | **1.22** | **미달** (통합 모달은 2px `--primary` 실선이라 통과, `apms-unified-modal.css:31-36`) |

초록·주황은 글자로 실제 쓰인다. 예: `color:var(--warning)` 12px 안내문(`js/student.js:570, 900`), 상태 배지(`js/student.js:808`). `color:var(--warning)` 사용은 `classroom.js` 6, `management.js` 6, `student.js` 7 등이고, `color:var(--success)`는 9개 파일에 퍼져 있다. 글자에는 더 짙은 값(예: 라이트 주황 `#b45309`)이 필요하지만 값은 이 문서가 정하지 않는다(미정 4번).

### Named Rules
**The Color-On-Data Rule.** 색은 데이터(출결·숙제·점수 상태, 과목 태그)에 쓰고 버튼·툴바에는 쓰지 않는다. 다색이던 진도/숙제/QR/원내평가/클리닉 툴 버튼은 무채색으로 통일됐다(`apms-warm-theme.scope.css:148-165`).

**The Near-Black Primary Rule.** 주요 행동 버튼은 `--action-primary`다. 파랑은 링크·포커스·선택·오늘에만 쓴다.

**The No-Solid-Red Rule.** 삭제는 투명 + 빨간 글씨 + 빨간 선이다. 빨간 면 버튼을 만들지 않는다.

**The Token-Only Rule.** 색은 `var(--…)`로 읽어 라이트·다크가 함께 바뀌게 한다. 인라인 하드코딩 hex는 다크 모드에서 깨진다(`js/report-print.js` 189개, `report-center.js` 157개, `timetable.js` 50개, `cumulative.js` 40개 등. 인쇄 문서 안의 hex는 의도된 것일 수 있다).

## Typography

**글꼴:** `Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (`index.html:133`). **APMS와 플래너는 Pretendard 파일을 불러오지 않는다**(`index.html`·`planner/index.html`에 `<link>`·`@font-face` 없음). 기기에 Pretendard가 설치돼 있지 않으면 시스템 글꼴로 보인다. 학생 포털과 숙제는 CDN에서 불러온다(`student/index.html:23`, `homework/index.html:9`).

**Character:** 한글 고딕 한 가족. 굵기는 400/500이 기본이고 600은 제목, 700은 큰 숫자와 옛 제목이다. `body`의 기본 크기는 지정이 없어 16px이고(computed 확인), 실제 글자 크기는 컴포넌트 클래스와 인라인 스타일이 정한다.

### Hierarchy
크기 변수가 두 벌 있다: 인라인 `:root`의 `--ap-font-*`(`index.html:75-80`: title 18 · section 13.5 · body 13 · meta 12.5 · label 12 · button 12)와 `apms-ui-foundation.css:229-238`의 `--ap-ui-font-*`(stat 20 · section 15 · body 13 · small 12). 이 문서는 후자와 통합 모달 값을 따랐다(미정 5번).
- **Stat** (700, 20px, 1.25, tabular-nums, -0.02em; `.ap-card__stat` `apms-ui-foundation.css:261-266`): 대시보드 숫자.
- **Title** (600, 18px; 통합 모달 제목 `apms-unified-modal.css:13-16`). 일반 모달 제목은 700 20px(`index.html:723-731`)이고 통합 모달만 18/600으로 낮춘다.
- **Section** (600~700, 15px, 1.35): 카드 제목 `.ap-card__title`(700), 모달 맥락 이름 `.apms-unified-context__name`(600, `apms-unified-modal.css:42-46`).
- **Body** (400~500, 13px, 1.35~1.6): 목록 행·입력 글자.
- **Label** (500, 12px): 모달 라벨 `.apms-unified-label`(`:53-59`).
- **Caption** (400, 12px, 1.4~1.45): 메타·보조. 11px는 "보조정보 전용"이다(`apms-ui-foundation.css:224`). 실제로는 라벨·표시 문자에 11px가 많이 쓰인다.
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

카드 모서리가 하나가 아니다. 이것이 지금 체계의 가장 큰 흩어짐이다(미정 2번).
- **6px**: `.card`·`.ap-card`·`.stat-card`·`.exam-card`·`.omr-card`·관리자 대시보드 카드(`#ap-admin-dashboard .card` 등). "선생님 대시보드 카드 톤(radius 6px / shadow none)"을 전체에 bridge하는 규칙이 `!important`로 있다(`apms-theme-override.css:957-986`; 모바일은 `:1018-1026`). `--ap-ui-radius-card: 6px`(`apms-ui-foundation.css:230`)도 같은 값이다. 통합 모달의 맥락 상자도 6px(`apms-unified-modal.css:33-41`).
- **16px**: 선생님 대시보드 큰 카드 `.ap-dash-card`(`dashboard-foundation.css:469-476`, `!important`), 반 화면 카드 `.ap-classroom-card`, `.apms-card`(`--apms-ui-radius-card` 16px, `apms-ui-foundation.css:11`), 모달 바깥 상자(`#modal-content` `!important`, `apms-theme-override.css:1008-1016`).
- **8px**: 입력·버튼·날짜 칩(통합 모달 컨트롤 `apms-unified-modal.css:60-74`, 웜 `--radius-md`).
- **10px**: `.apms-button`(`apms-ui-foundation.css:160`), 웜 `--radius-lg`.
- **4px**: 목록 행 `--ap-ui-radius-row`(`:231`).
- **알약 999px**: 탭 `.apms-tab`, 배지 `.ap-badge`, `.chip`.

둥근 모양이 아니라 선과 색이 구분의 주체다. 모서리 값은 위 단계 안에서만 고른다.

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
- **맥락 상자 `.apms-unified-context`** (`__name` 15px/600, `__meta` 12px/400 보조색): 패딩 11px 14px, 1px 선, 6px 모서리, `--surface-2` 바탕. 모달 맨 위에 "무엇을 하는 모달인가"(반 이름 등)를 알린다(`:33-52`).
- **라벨 `.apms-unified-label`**: 12px/500 보조색, 위 여백 3px(`:53-59`).
- **컨트롤 `.apms-unified-control`**: 폭 100%, 최소 높이 44px, 패딩 10px 12px, 8px 모서리, 흰 면 + 1px 선, 13px(휴대폰 16px), textarea 최소 96px, 포커스 2px `--primary` 실선(`:60-85`).
- **요일 선택 `.apms-unified-day`**: 최소 38px, 패딩 8px 10px, 8px 모서리, 12px, 줄바꿈 간격 6px(`:86-103`).
- **격자 `.apms-unified-grid`**: 2열, 간격 8px. `--date` 변형은 날짜+시간(`1fr / 0.4fr`, 최소 116px)(`:104-111`).
- **액션줄 `.apms-unified-actions`**: 오른쪽 정렬, 간격 8px, 위쪽 패딩 10px + 1px 윗선. 버튼은 `.apms-unified-quiet`(보조)·`.apms-unified-primary`(주요, 웜 테마가 near-black으로 칠함) 각 최소 44px, 패딩 10px 14px, 13px/500, 8px 모서리(`:112-134`).
- 현재 이 양식을 쓰는 모달은 4개다: 새 반 추가·반 수정(`management.js:239, 295`), 숙제 등록(`classroom.js:944`), QR 생성기(`qr-omr.js:262`). 옮길 때 지키는 것: 입력 ID, 저장 함수, 돌아갈 화면(`tests/apmath-modal-design-family.test.js`).
- **저장 버튼 위치가 둘이다.** 반 추가·수정은 헤더 오른쪽 "추가/저장", 숙제 등록은 본문 안 `.apms-unified-actions`의 "저장". 하나로 정하지 않았다(미정 6번).
- **전용 큰 모달**: 진도 모달 `.ap-class-progress-modal`(너비 최대 1180px, 높이 860px, `apms-theme-override.css:1036-1049`), 교재 관리, 상담 전체 보기 등은 `#modal-content:has(...)` 규칙으로 따로 크기를 정한다. 클리닉 출력은 `clinic-print-fullscreen`(`apms-clinic-print.css:1008-`)으로 전체 화면이다. 상담 전체 보기(`dashboard-foundation.css:1379`)와 플래너(`classroom-planner.js:1588`)는 1080px, 전역 교재 관리는 폭 규칙이 없어 기본 500px이다.

### 모달 등급 (제안 — 사용자 결정 전, 미정 11)
모달 약 98종의 크기가 제각각이므로(기본 500px / 통합 720px / 진도 1180px / 상담·플래너 1080px / 클리닉 전체 화면) 4등급으로 묶는다. **값은 위 현재 CSS에서 가져왔고**, "제안"만 지금 없는 동작이다. 98종 배정과 근거 줄은 `docs/plans/2026-11-02-apms-modal-consolidation-appendix.md`, 통합 묶음은 `docs/plans/2026-11-02-apms-ui-upgrade-plan-v0.1.md` 3절(내용은 v0.2).

| 등급 | 쓰는 곳 | 데스크톱 너비 · 최대 높이 | 휴대폰(≤600px) | 닫기 | 저장 위치 |
|---|---|---|---|---|---|
| **C 확인·선택** | 한 문장+값 나열+버튼 2~3개, 항목 고르기 | `max-width 500px` · `90vh`(`index.html:692-706`) | 아래 시트 100vw, 위 모서리 16px, `92vh - safe-area`(`index.html:931-938`) | 제안: Esc·바깥 클릭 | 제안: 하단 액션줄 오른쪽 |
| **F 폼** | 입력 1~8개, 짧은 읽기 목록 | `min(720px, 100vw - 32px)` · `100dvh - 32px`(`apms-unified-modal.css:4-9`) | 시트 100vw · 92dvh, 컨트롤 44px · 글자 16px(`:138-150`) | 제안: Esc는 입력 있으면 확인, 바깥 클릭은 입력 있으면 무시 | 제안: 하단 액션줄 오른쪽 |
| **W 작업 화면** | 목록+상세(+같은 자리 추가·수정). 진도 모달형. 단열 변형은 너비 720px | `min(1180px, 100vw - 32px)` · `min(860px, 100vh - 32px)`, 목록 `minmax(300px, 0.38fr)` + 상세 `1fr`(`apms-theme-override.css:1036-1041, 1091-1097`) | 현재 ≤760px: 거의 전체, 목록 위·상세 아래 한 열(`:1605-1625`). 제안: 화면 전체 | 제안: Esc는 미저장 변경 확인, 바깥 클릭 무시 | 인라인 폼은 폼 하단, 일괄 저장은 하단 고정 막대 |
| **P 전체 화면 패널** | 컨트롤 많은 독립 도구(클리닉 출력 센터, 교재 오답) | 가장자리 14px 안쪽, 왼쪽 70px(드로어 펼치면 274px)(`apms-clinic-print.css:1008-1035`) | 현재 ≤880px 세로 쌓기(`:1090-1100`). 제안: 100vw × 100dvh | 제안: 바깥 클릭 없음, Esc 확인 | 본문 안 주요 버튼 |

현재 공통 동작(코드 사실): Esc로 닫는 코드가 없고(`handleModalKeyboard` `js/ui.js:428`은 Tab만), 바깥 클릭은 `closeModal()`(`index.html:1014`)이라 입력 중인 폼도 확인 없이 닫힌다. 모달 연쇄에는 대부분 뒤로 가기가 없다(`showModalStep`은 일정·시간표·학생 상세만 사용).

**통합 작업 화면 패턴(W)** — 진도 모달(`classroom.js:3626`)에서 뽑은 규칙: 대상 하나 + 전환 탭, 목록/상세 한 쌍(선택은 서버 호출 없이), 추가·수정은 인라인 폼·행 펼침, 모달 연쇄 금지·미저장 변경 확인, 늦은 응답 가드, 모달 먼저 열고 자리에서 로딩, 저장 응답으로 로컬 상태 갱신(전체 `loadData()`·재오픈 지양). 근거 줄은 계획서 3.1.

### Inputs
- 통합 모달: 위 "컨트롤". 일반: `.cls-input`(computed 최소 48px, 14px, 14px 모서리), 모달별 인라인(`min-height:42px` + 10px 모서리 등), `class="btn"`을 입력에 붙인 것(교재 등록 등). 입력칸 바탕·선은 `--surface`·`--border`(`apms-theme-override.css:178-186`), 포커스는 4px 파랑 14% 고리(대비 표 참고).
- 라벨 없이 placeholder만 쓰는 폼이 많다(신규 학생 추가 입력 7개 모두).

### Tabs
- `.tab-bar`/`.tab-btn`(옛, `apms-theme-override.css:163-176`): 선택 시 흰 면 + `--primary` 글자. `.apms-tab`: 알약, 선택 시 연한 파랑 면.

### Navigation
- 데스크톱 56px 레일(펼침 260px) + 58px 상단 막대, 휴대폰은 헤더 + 서랍(`css/sidebar-foundation.css`, `.drw-*`). 뒤로 가기 버튼은 모달이 열려 있어도 헤더 위에 남는다(`index.html:670-690`).

## 학생 포털과의 차이 (맞출 대상 — 어느 쪽으로 맞출지는 미정)

학생 포털·숙제·플래너는 위 웜 체계와 다른 값을 쓴다. 확인한 사실만 적는다(Chrome computed, 1280/390px, 2026-11-02).

| 항목 | APMS(기준) | 학생 포털 `student/index.html` | 숙제 `homework/` | 플래너 `planner/` |
|---|---|---|---|---|
| 불러오는 CSS | 웜 테마, 통합 모달, 대시보드·반·사이드바 등 10개 중 9개(`index.html:974-985`) | `apms-ui-foundation.css`(:24) + 인라인 + `apms-theme-override.css`(:631) | 인라인 + `apms-theme-override.css`(:301) | `apms-ui-foundation.css`(:7) + 인라인 (override 없음) |
| 바탕·글자 | stone `#faf9f7`·`#1c1917` | 겉은 `#F2F4F6`·`#191F28`을 선언하지만 override가 나중에 로드돼 **실제는 iOS 회색 `#F2F2F7`·`#1C1C1E`**. body에 radial 그라데이션 | 같은 이유로 `#F2F2F7`·`#1C1C1E` | 인라인 그대로 `#F2F4F6`·`#191F28` |
| 주요 색 | near-black 버튼 `#1c1917`, 기능 파랑 `#2563eb` | `body.student-portal-theme`가 `--primary` `#111827`(near-black 계열)로 고정(`:633-`) | 파랑 `#007AFF`(override의 iOS 파랑) | 파랑 `#1A5CFF`, 버튼도 파랑 |
| 카드 모서리 | 6px / 16px 혼재 | 코드에는 30px(`.card`)지만 override가 `!important`로 **6px**로 덮음(1280·390 모두 computed 6px). `.btn`도 18px 선언이 12px로 덮임. 입력 18px 유지. hero 34px·알약 999px | 6px | 18px(버튼) |
| 그림자 | 거의 없음 | 카드 `none`(override), 주요 버튼 `0 8px 20px rgba(17,24,39,.18)`, 유리 효과 blur(16~18px) | 상단 blur(14px) | 버튼 `0 10px 24px`(파랑 24%) |
| 글꼴 | Pretendard(불러오지 않음) | Pretendard(CDN) | Pretendard(CDN) | Pretendard(불러오지 않음) |
| 글자 굵기·크기 | 400/500 기본 | 500 31회·400 12회·600 5회. 11px 9회·12px 18회·13px 13회 | 700 사용 | 500 |
| 다크 모드 | 있음(`body.dark`, 저장 선택 또는 OS) | **없음** | **없음** | 있음(`body.dark` + `prefers-color-scheme`, 같은 `APMATH_THEME` 키 사용, 파랑 `#8AB4FF`) |
| 모달 | 통합 모달 양식 4개 + 일반 모달 | 모달 껍데기 없음. 화면 안 카드·아래 알림띠(`.student-update-notice`)와 토스트 | 없음 | 없음 |

학생 포털은 **확대 허용**(`user-scalable` 없음)이고 입력 글자 16px 규칙이 있다(`student/index.html:626-629`). 학생 포털 주요 색 글자 대비: `--secondary` `#6C6C70` / 흰색 5.23 통과, 입력 placeholder `#A0A8B2` / `#F8FAFC` **2.30 미달**, `--success` `#34C759`와 `--warning` `#FF9500`을 글자로 쓰면 흰색 위 **2.22·2.20 미달**, 완료 알약 글자 `#008F72` / 연초록 **3.69 미달**. 숙제 `--primary` `#007AFF` / 흰색 **4.02 미달**. 플래너 다크의 파랑 버튼은 흰 글자 / `#8AB4FF` **2.09 미달**(계산: 위 방식).

## Do's and Don'ts

### Do:
- **Do** 색은 `var(--surface)`·`var(--text)`·`var(--border)`·`var(--action-primary)` 같은 토큰으로 읽어 라이트·다크가 함께 바뀌게 한다.
- **Do** 주요 행동은 `--action-primary`(near-black), 파랑은 링크·포커스·선택으로 한정한다.
- **Do** 새 모달은 통합 모달 양식(`apms-unified-modal` + `-form` + `-context` + `-control` + `-actions`)으로 만들고 입력 ID·저장 함수·돌아갈 화면을 지킨다(`tests/apmath-modal-design-family.test.js`).
- **Do** (제안) 같은 대상을 목록·상세·추가·수정으로 앞뒤로 다루면 모달을 여러 개 잇지 말고 작업 화면(W) 하나로 만든다(위 "모달 등급").
- **Do** 모달의 입력은 라벨을 달고(`.apms-unified-label`), 휴대폰에서 글자 16px·높이 44px을 지킨다.
- **Do** 의미색을 글자로 쓰면 본문 4.5:1을 맞춘 짙은 값을 쓴다(대비 표의 미달 조합 참고).
- **Do** 화면을 바꾼 뒤 PC와 휴대폰(390px)에서 가려지거나 넘치는 내용이 없는지 연다.
- **Do** `prefers-reduced-motion`을 지킨다(`css/`와 `index.html` 중에는 `dashboard-foundation.css:1312`에만 있다).

### Don't:
- **Don't** 모달 안에 새 인라인 스타일 입력칸을 만들지 않는다(통합 컨트롤 사용).
- **Don't** 파란 `.btn-primary` 면, 빨간 면 삭제 버튼, 다색 툴 버튼을 만들지 않는다.
- **Don't** 카드에 그림자를 더하지 않는다. 그림자는 모달만.
- **Don't** `!important`를 새로 더해 위 체계를 이기려 하지 않는다. 실제로 이기는 값이 헷갈리는 이유다.
- **Don't** 확대를 막지(`user-scalable=no`) 않는다(결정 2026-11-01).
- **Don't** 문항·해설·점수의 값을 디자인 작업으로 바꾸지 않는다.
- **Don't** 글자를 11px 아래로 내리지 않는다. 학생이 읽는 글자는 12px 이상을 목표로 한다(`PRODUCT.md` 원칙 1; 학생 포털 11px 9곳은 맞출 대상).

## 미정 (사용자 결정 필요)

1. **Creative North Star** 이름(잠정 "종이 장부")과 Overview의 말투를 확정할지.
2. **카드 모서리** 기준을 6px로 할지 16px로 할지 둘을 용도로 나눌지(지금은 관리자 대시보드·`.card`·`.ap-card`가 6px, 선생님 대시보드·반 화면·`.apms-card`·모달이 16px).
3. **학생 포털·숙제·플래너를 어느 쪽으로 맞출지**: (가) 웜 체계로(바탕·글자 stone, 주요 버튼 near-black, 다크 모드 추가), (나) 학생용으로 따로 두고 이 문서에 "학생용 변형"으로 적기, (다) 일부만. 학생 포털은 지금 override가 인라인 값을 덮어 코드 의도와 화면이 다르다.
4. **의미색 글자값**: 글자로 쓰는 초록·주황·빨강·파랑의 AA 통과 값(라이트·다크). 지금 값은 글자로 쓰면 미달이다.
5. **글자 크기 변수 한 벌로 통합**(`--ap-font-*`와 `--ap-ui-font-*`), 11px 사용 범위.
6. **모달 저장 버튼 위치**: 헤더 오른쪽(현재 대부분)과 본문 아래 액션줄(숙제 등록) 중 하나로.
7. **Pretendard를 APMS·플래너에도 불러올지**(지금은 설치된 기기에서만 적용).
8. **옛 토큰 정리 범위**: `--ap-*` 슬레이트 토큰과 쓰이지 않는 `--shadow-modal`, 인라인 `:root`(`index.html:14-76`)·`apms-theme-override.css:6-` 중 무엇을 남길지.
9. **독립 화면 포함 여부**: `apmath/wangji-student-management.html`(`css/wangji-student-management.css`, `wsm-*`)와 `apmath/wrong_print_engine.html`은 `apmath/` 아래라 이 문서의 영향을 받지만 별도 체계다. 이 문서에 넣을지.
10. **입력칸 테두리·포커스 고리** 대비(UI 3:1)를 올릴지: 현재 라이트 테두리 1.26:1, 일반 포커스 고리 1.22:1. 올리면 전체 화면 모양이 바뀐다.

### 모달 통합 관련 (2026-11-02 추가, 설계: `docs/plans/2026-11-02-apms-ui-upgrade-plan-v0.1.md` 3절)
11. **모달 4등급(C·F·W·P)과 W 단열 변형 확정**, W 기본 너비를 진도 모달 1180px로 할지 상담 센터·플래너 1080px로 할지(제안 1180px).
12. **작업 화면(W)의 휴대폰 동작**: 목록 위·상세 아래로 쌓기(진도 모달의 현재 방식, 제안) 대 목록 → 상세 화면 전환.
13. **Esc 키·바깥 클릭 정책**: 지금은 Esc가 없고 바깥 클릭이 입력 중인 폼도 닫는다. 등급별로 바꿀지(제안은 위 표). 저장 위치는 6번과 함께: C·F 하단 액션줄 일원화(제안).
14. **호출처 없는 모달 17종 삭제 승인**(계획서 부록 4절, 의심 단계). 숨김이 테스트로 고정된 것(숙제 링크·QR 2종, EIE 보호자 관리 1종)은 테스트를 같이 고쳐야 한다.
15. **통합 묶음 8개와 PR 순서 승인**(숙제 · 선생님 계정 · 원내평가·OMR · 반·학생 관리 · 플래너 · 클리닉 · 학생 상세 · 진도·교재). 학생 상세와 진도·교재는 매일 쓰는 화면이라 동작이 눈에 띄게 달라진다.
16. **전역 교재 관리를 진도 작업 화면의 교재 관리 모드로 합칠지**, **클리닉 2버튼 메뉴·반 고르기 모달을 탭으로 대체할지**.
