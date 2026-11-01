---
name: AP Math 도형실험실 2.0
description: 그림(무대)이 주인공인 수학 실험실. 어두운 칠판과 밝은 종이 두 테마, 같은 대상은 같은 색.
colors:
  board-bg: "#0a100e"
  board-bar: "#0d1512"
  board-panel: "#101916"
  board-card: "#15201c"
  board-card-2: "#1a2723"
  board-hover: "#1f2e29"
  board-line: "#22322c"
  board-line-2: "#2d4039"
  board-text: "#ebf3ef"
  board-text-2: "#a9bab2"
  board-text-3: "#7e9089"
  board-accent: "#5ce3b2"
  board-accent-2: "#2fbf8c"
  board-accent-ink: "#052119"
  board-focus: "#ffd166"
  board-stage: "#0f1d18"
  board-stage-hi: "#15291f"
  board-stage-lo: "#0a1511"
  board-ink: "#f2f7f4"
  board-sky: "#4cc6ff"
  board-rose: "#ff6c9c"
  board-amber: "#ffc53d"
  board-green: "#3edc98"
  board-violet: "#b7a0ff"
  board-red: "#ff5f5f"
  board-orange: "#ff9a45"
  board-muted: "#8b9c95"
  paper-bg: "#f1efe8"
  paper-bar: "#f8f6f0"
  paper-panel: "#fbfaf6"
  paper-card: "#ffffff"
  paper-card-2: "#f5f3ec"
  paper-hover: "#efece3"
  paper-line: "#e2ded3"
  paper-line-2: "#d2ccbe"
  paper-text: "#17201c"
  paper-text-2: "#4b5751"
  paper-text-3: "#646e68"
  paper-accent: "#0d8b67"
  paper-accent-2: "#0a7254"
  paper-accent-ink: "#ffffff"
  paper-focus: "#e07a00"
  paper-stage: "#fdfcf8"
  paper-stage-hi: "#ffffff"
  paper-stage-lo: "#f6f4ee"
  paper-ink: "#1a2420"
  paper-sky: "#0a7fd4"
  paper-rose: "#df2f69"
  paper-amber: "#c98000"
  paper-green: "#0e9a60"
  paper-violet: "#6a4cdf"
  paper-red: "#d33434"
  paper-orange: "#dd6610"
  paper-muted: "#87918c"
typography:
  title:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 650
    letterSpacing: "-0.01em"
  caption:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    letterSpacing: "0.02em"
rounded:
  xs: "6px"
  sm: "9px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  pill: "999px"
spacing:
  float-inset: "12px"
  readout-gap: "8px"
  panel-gap: "14px"
  panel-gutter: "18px"
  panel-gutter-mobile: "14px"
components:
  button:
    backgroundColor: "{colors.board-card}"
    textColor: "{colors.board-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "40px"
  button-primary:
    backgroundColor: "{colors.board-accent}"
    textColor: "{colors.board-accent-ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "40px"
  chip:
    backgroundColor: "{colors.board-card}"
    textColor: "{colors.board-text-2}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "34px"
  chip-on:
    backgroundColor: "{colors.board-text}"
    textColor: "{colors.board-bg}"
    rounded: "{rounded.pill}"
  scene-tab:
    textColor: "{colors.board-text-2}"
    rounded: "{rounded.pill}"
    padding: "0 13px 0 6px"
    height: "36px"
  scene-tab-selected:
    backgroundColor: "{colors.board-card}"
    textColor: "{colors.board-text}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.board-card}"
    rounded: "{rounded.lg}"
    padding: "14px"
  readout:
    backgroundColor: "{colors.board-card-2}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  input:
    backgroundColor: "{colors.board-card}"
    textColor: "{colors.board-text}"
    rounded: "{rounded.md}"
    height: "40px"
---

# Design System: AP Math 도형실험실 2.0

기준 화면은 `apmath/playground/next/`(실험실 2.0)이다. 토큰은 모두 `apmath/playground/next/kit/apl.css`의 `:root`에서 가져왔고, 허브 전용 값은 `apl-hub.css`에 있다. 값 옆의 `apl.css:줄`은 근거 위치다. 이전 화면 `apmath/playground/labs/`는 비교·호환용으로 남은 옛 체계이며, **고칠 때는 2.0 체계 쪽으로 맞춘다**(새 토큰을 옛 화면에 맞춰 만들지 않는다).

## Overview

**Creative North Star: "칠판과 모눈종이" (확정 2026-11-01; `apl.css` 머리말의 "칠판(Board)"·"종이(Paper): 모눈 종이 위 잉크 느낌"에서 따옴)**

그림(무대)이 화면의 주인공이다. 무대가 화면의 약 70%를 차지하고, 안내·수식·도구는 가장자리에 작게 둔다(`next/README.md` §1 원칙 1). 어두운 칠판 테마는 도형이 빛나 보이도록 깊은 청록 바탕이고, 밝은 종이 테마는 모눈 종이 위 잉크 느낌이다. 두 테마는 같은 토큰 이름을 다른 값으로 채운다. 기본은 종이(밝음)다. 저장된 선택이나 `?theme=`가 없으면 OS 설정과 관계없이 종이로 시작하고, 학생이 칠판으로 바꾸면 그 선택이 저장돼 유지된다(결정 2026-11-01; `apl-core.js`의 `APLab.theme.init()`, 각 페이지 `<head>`의 인라인 스크립트도 같은 규칙이라 첫 화면에 깜빡임이 없다).

색은 장식이 아니라 약속이다. 같은 대상은 같은 색이다(슬라이더 손잡이, 실시간 값, 그림의 선이 같은 색). 후광이 있는 점은 끌 수 있는 점이다. 이 약속은 `next/README.md` §1-3에 설계 원칙으로 적혀 있다.

**Key Characteristics:**
- 무대 70%, 가장자리에 작은 도구. 도형을 가리는 떠 있는 요소는 만들지 않는다.
- 칠판(어두움)과 종이(밝음) 두 테마. 수학 의미색 8가지(`--m-*`)가 테마마다 다른 값으로 바뀐다.
- 그림은 기본 1:1 축척. 단위가 다른 그래프만 `aspect:'free'`로 예외를 두고 안내를 붙인다.
- PC는 무대+패널 2단, 모바일은 무대를 위에 고정하고 패널이 아래로 스크롤.
- 터치 대상은 모바일에서도 손가락이 닿는 크기를 지킨다(손잡이 터치 반경 30px, 버튼 최소 높이 32~40px).

## Colors

깊은 청록의 칠판과 따뜻한 종이색 바탕에 민트 계열 하나의 강조색, 그리고 도형용 의미색 8가지. (모든 값은 `apl.css`의 `[data-theme]` 블록, 칠판 34-76줄·종이 79-121줄. 이름은 설명용이고 토큰 이름은 CSS 변수와 같다.)

### Primary
- **칠판 민트** (`#5ce3b2`, `--accent`, 칠판 47줄): 칠판 테마의 강조색. 기본 버튼, 선택된 장면 탭 테두리, 질문 상자 왼쪽 선, 단계 현재 위치. 눌림 반응은 `--accent-2`(`#2fbf8c`), 기본 버튼 위 글자는 `--accent-ink`(`#052119`).
- **종이 초록** (`#0d8b67`, `--accent`, 종이 92줄): 종이 테마의 같은 역할. 눌림 `#0a7254`, 글자 `#ffffff`.

### Secondary
- 없음. 강조색은 테마마다 하나다.

### Tertiary — 수학 의미색 (`--m-*`)
무대와 패널이 함께 읽는 색이다. 색 이름은 실험실 코드에서 `color: 'rose'`처럼 쓴다(`next/README.md` §3).

| 이름 | 칠판 | 종이 | 줄 |
|---|---|---|---|
| ink (기본 선·글자) | `#f2f7f4` | `#1a2420` | 67 / 112 |
| sky (하늘) | `#4cc6ff` | `#0a7fd4` | 68 / 113 |
| rose (분홍) | `#ff6c9c` | `#df2f69` | 69 / 114 |
| amber (호박) | `#ffc53d` | `#c98000` | 70 / 115 |
| green (초록) | `#3edc98` | `#0e9a60` | 71 / 116 |
| violet (보라) | `#b7a0ff` | `#6a4cdf` | 72 / 117 |
| red (빨강) | `#ff5f5f` | `#d33434` | 73 / 118 |
| orange (주황) | `#ff9a45` | `#dd6610` | 74 / 119 |
| muted (보조) | `#8b9c95` | `#87918c` | 75 / 120 |

상태 색은 의미색을 그대로 쓴다: ok = green, warn = amber, bad = red, info = sky, key = accent (`.apl-status`·`.apl-callout`의 `data-tone`, `apl.css:307-310, 431-435`).

### Neutral
- **칠판 바탕** (`#0a100e`, `--bg`) 위에 막대 `#0d1512` → 패널 `#101916` → 카드 `#15201c` → 안쪽 카드 `#1a2723` 순으로 한 단계씩 밝아진다(36-41줄). 선은 `#22322c`(약함)·`#2d4039`(강함). 글자는 `#ebf3ef`(본문) · `#a9bab2`(보조) · `#7e9089`(힌트, 모든 바탕 위 4.59:1 이상).
- **종이 바탕** (`#f1efe8`) 위에 막대 `#f8f6f0` · 패널 `#fbfaf6` · 카드 `#ffffff` · 안쪽 카드 `#f5f3ec`(81-85줄). 선 `#e2ded3`·`#d2ccbe`. 글자 `#17201c`·`#4b5751`·`#646e68`(힌트, 모든 바탕 위 4.60:1 이상).
- **무대** (`--stage`): 칠판 `#0f1d18`, 종이 `#fdfcf8`. 무대 배경은 가운데가 밝은 방사형 그라데이션(`apl.css:261-264`, `--stage-hi` → `--stage` → `--stage-lo`).
- **포커스** (`--focus`): 칠판 `#ffd166`, 종이 `#e07a00`. 모든 키보드 포커스 고리와 캔버스 포커스에 쓴다(`apl.css:151, 272`).
- 격자·축·눈금은 반투명 값이다(`--m-grid`, `--m-grid-major`, `--m-axis`, `--m-tick`). 후광 `--m-halo`는 라벨 글자 뒤 외곽을 지워 읽히게 한다.

### Named Rules
**The Same-Color Rule.** 같은 대상은 같은 색이다. 슬라이더 손잡이, 실시간 값, 그림의 선이 같은 `--m-*` 색을 쓴다. 새 대상에 이미 다른 대상이 쓰는 색을 주지 않는다.

**The One Accent Rule.** 테마마다 강조색은 `--accent` 하나다. 도형을 칠하는 데는 `--m-*` 의미색을 쓰고 강조색을 쓰지 않는다.

**The Theme-Token Rule.** 색은 `var(--…)`로 읽어 두 테마에서 함께 바뀌게 한다. 칠판 값을 하드코딩하면 종이 테마에서 깨진다. (예외로 두어진 값: QR 흰 바탕 `#fff` `apl.css:518`, 칠판 기본 버튼 눌림 `#7aeec4` `apl.css:175`.)

## Typography

**Display/Body/Label Font:** Pretendard Variable (대체: Pretendard, -apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif — `apl.css:11-12`)

**Character:** 한 가족의 한글 고딕 하나만 쓴다. 제목은 굵고(800) 자간을 좁혀(-0.025em~-0.03em) 단단하게, 본문은 보통 굵기에 줄간격을 넉넉히(1.55) 둔다. 수식은 KaTeX(`$…$` 자동 변환)가 그린다.

Pretendard는 CDN에서 불러오고(`index.html:11` 등 페이지마다 `<link>`), 실패하면 시스템 글꼴로 내려간다(`next/README.md` §2). 외부 의존은 이 글꼴 하나뿐이다.

### Hierarchy
크기 단계는 `--fs-*`다 (`apl.css:13-19`): 2xs 12px · xs 12px · sm 13px · md 14.5px · lg 16px · xl 19px · 2xl 23px.
- **Title** (800, 16px, 1.3, -0.025em; `.apl-title` 222줄): 상단 막대의 실험실 제목. 한 줄, 넘치면 말줄임.
- **Headline** (800, 19px, 1.3, -0.03em; `.apl-scene-title`): 패널의 장면 제목.
- **Body** (400, 14.5px, 1.55; `body.apl` 138-143줄): 패널 본문. 질문 상자는 650 굵기·1.6 줄간격.
- **Label** (650, 13px, -0.01em; `.apl-btn`·`.apl-scene-tab`): 버튼·탭·슬라이더 이름.
- **Caption** (650, 12px, 0.02em; `.apl-crumbs`, `.apl-read .k`): 경로 표시, 값 이름표, 힌트.
- **값 숫자**: 실시간 값 `.apl-read .v`는 16px 800 굵기에 `tabular-nums`로 자릿수가 흔들리지 않게 한다(425줄, 153줄).
- **수업 모드**(`data-teach="on"`)는 같은 단계를 한 칸 키운다: 2xs 12.5 · xs 13.5 · sm 15 · md 16.5 · lg 18 · xl 22 · 2xl 27px (124-133줄).
- **허브 제목**: `clamp(22px, 2.4vw, 30px)`, 850, 자간 -0.045em (`apl-hub.css`의 `.hub-intro h1`).

### Named Rules
**The Tabular Number Rule.** 바뀌는 숫자(실시간 값, 슬라이더 값, 눈금)는 `font-variant-numeric: tabular-nums`로 자릿수가 움직이지 않게 한다.

**The No-Tiny-Text Rule (확정 2026-11-01).** 학생이 읽는 글자는 12px 아래로 내리지 않는다. 그래서 `--fs-2xs`를 11px에서 12px로 올렸다(수업 모드는 그대로 12.5px). 정답 이름표·질문 머리·값 이름·조작 힌트가 이 값을 쓴다. 허브의 장면 칩 `.hub-scenes`와 지하철 노선도 `.col-s`도 같은 값을 쓴다(2026-11-01 해결).

**The Contrast Rule (WCAG 2.2 AA, 확정 2026-11-01).** 본문 글자는 모든 바탕(`--bg`·`--panel`·`--card`·`--card-2`) 위에서 4.5:1 이상이다. `--text-3`(힌트색)을 올려 맞췄다. 종이 `#7c8680` → `#646e68`: bg 4.60 · panel 5.06 · card 5.29 · card-2 4.76. 칠판 `#6e827a` → `#7e9089`: bg 5.71 · panel 5.32 · card 4.97 · card-2 4.59. `--text`·`--text-2`는 이미 7:1 이상이다. 수학 의미색 `--m-*`는 아직 이 기준으로 검사하지 않았다.

## Layout

데스크톱(1280px 이상)은 무대와 패널 2단이다. 패널 폭 `--panel-w` 400px(수업 모드 430px, 1099px 이하 340px)이고, 상단 막대 `--bar-h` 56px 안에 뒤로가기·제목·장면 탭 줄·도구가 한 줄로 놓인다(`apl.css:25-27, 246-251`).

모바일(859px 이하)은 한 줄 쌓기다. 무대가 위에 붙어 있고(`position: sticky`, 높이 `clamp(300px, 54svh, 560px)`), 패널이 그 아래로 스크롤된다. 막대 높이 52px로 줄고, 상태 배지(왼쪽)와 도구(오른쪽)가 무대 아래 한 줄로 모인다(`apl.css:543-573`). 터치 화면(`pointer: coarse`)은 확대·축소 버튼을 숨기고 손가락 확대를 쓴다(575-577줄). 520px 이하에서는 막대 여백·아이콘 버튼(36px)·장면 탭이 더 줄어든다(578-586줄).

간격은 토큰이 아니라 관찰된 값이다(CSS에 `--space-*` 변수 없음): 패널 안쪽 18px(모바일 14px), 패널 내용 사이 14px, 실시간 값 칸 사이 8px, 무대 위 떠 있는 요소는 가장자리에서 12px(모바일 10px) 안쪽, 그룹 안 작은 간격은 6~10px(`apl.css:356, 418, 242-264, 553`).

중단점: 1280 / 1099 / 859 / 520px (`apl.css` `@media`). 무대 영역은 도형 배치에서 `board.setInsets`로 안내·도구 자리를 비워 둔다(`next/README.md` §1 원칙 1).

### Named Rules
**The Stage-First Rule.** 새 요소를 더할 때 무대를 줄이지 않는다. 가장자리에 작게 두거나 패널로 보낸다. 무대 위 떠 있는 요소는 도형·라벨을 가리지 않아야 한다.

**The Both-Sizes Rule.** 레이아웃을 바꾸면 PC와 휴대폰(390px) 두 폭에서 그림이 가려지지 않는지 열어 본다(`next/README.md` §5.2 5번).

## Elevation & Depth

대부분 평평하고, 깊이는 **색 단계(바탕 → 막대 → 패널 → 카드 → 안쪽 카드)와 1px 선**으로 만든다. 그림자는 떠 있는 것에만 쓴다.

### Shadow Vocabulary
- **떠 있는 상자** (`--shadow`: 칠판 `0 10px 30px rgba(0,0,0,.45)`, 종이 `0 10px 30px rgba(40,35,20,.14)`; 52-53, 97-98줄): 대화상자(`.apl-dialog-box`).
- **작은 그림자** (`--shadow-sm`: 칠판 `0 3px 10px rgba(0,0,0,.35)`, 종이 `0 2px 8px rgba(40,35,20,.1)`): 무대 위 유리 상자, 선택된 탭.
- **유리** (`--glass` 반투명 + `backdrop-filter: blur(10px)`; `.apl-glass` 293-296줄): 무대 위 수식 칩·상태 배지. 도형이 비쳐 보이게 반투명하다.
- **모바일 무대 아래 그림자** (`0 8px 18px rgba(0,0,0,.18)`; 551줄): 위에 붙은 무대와 스크롤되는 패널 사이.

### Named Rules
**The Flat-By-Default Rule.** 카드·버튼은 그림자 없이 선과 색으로 구분한다. 그림자는 대화상자와 무대 위 유리 요소에만 쓴다.

## Shapes

둥근 모서리가 기본이다. 단계: 6 / 9 / 12 / 16 / 22px와 알약(999px) (`apl.css:20-24`).
- 버튼·입력·읽기 값·콜아웃·단계 상자: 12px (`--r-md`).
- 카드·아코디언: 16px (`--r-lg`). 대화상자: 22px (`--r-xl`).
- 탭 안쪽 버튼·작은 버튼: 9px (`--r-sm`). 포커스 고리: 6px.
- 칩·장면 탭·태그·상태 배지: 알약(999px).
- 점과 손잡이(슬라이더 손잡이, 색 점, 단계 번호): 원.
- 라벨 글자 상자: 6px, 장면 미리보기 캔버스: 10px.

도형 자체(무대 안)는 수학 그림이다. UI 모서리 규칙이 아니라 수학 정확성(1:1 축척, 직각은 직각으로 보이게)이 먼저다.

## Components

### Buttons
- **Shape:** 12px 둥근 사각형, 최소 높이 40px, 좌우 14px (`.apl-btn` 163-169줄). 작은 변형 `sm`은 최소 32px.
- **Default:** 카드색 바탕 + 1px 강한 선, 글자 13px 650 굵기.
- **Primary:** 강조색 바탕 + `--accent-ink` 글자, 테두리 없음.
- **Hover / Active:** 바탕이 `--hover`로(기본), 강조색은 `--accent-2`로. 누르면 1px 아래로(`transform: translateY(1px)`). 전환 `.18s cubic-bezier(.2,.8,.2,1)` (`--dur`, `--ease`).
- **Ghost / on / disabled:** 투명 바탕(ghost), 강조색 연한 바탕+강조 테두리(on), 불투명도 .45(disabled).
- **Icon button:** 40x40(≤520px에서 36x36), 아이콘 20px, 선택되면 `--accent-soft` 바탕.

### Chips
- **Style:** 알약, 최소 높이 34px, 카드색 바탕 + 선, 보조 글자 12px 650.
- **State:** 켜짐은 글자색과 바탕색을 뒤집는다(`--text` 바탕, `--bg` 글자). 앞에 8px 색 점을 달 수 있다.

### Scene Tabs (장면 탭 줄)
- **Style:** 알약, 최소 36px, 왼쪽에 24px 번호 원. 선택되면 카드색 바탕 + 강조 테두리 + 안쪽 1px 강조선, 번호 원이 강조색으로 채워진다 (`apl.css:230-244`). 줄은 가로 스크롤, 모바일에서 스크롤바를 숨긴다.

### Cards / Containers
- **Corner Style:** 16px. **Background:** `--card`(soft는 `--card-2`). **Border:** 1px `--line`. **Padding:** 14px. 그림자 없음.

### Readouts (실시간 값)
- 2열 격자, 칸 사이 8px. 칸은 안쪽 카드색 + 12px 모서리 + 패딩 10px 12px. 값은 대상의 의미색으로 16px 800. 값에 올리면(`data-ref`) 해당 색 테두리와 8% 색 바탕으로 바뀌고 그림의 같은 부분이 강조된다 (`apl.css:418-423`).

### Inputs / Sliders
- **Slider:** 막대 6px, 손잡이 22px 원(Firefox 18px), 손잡이 색 = 값이 가리키는 대상의 색. 이름 앞 9px 색 점 + 3px 연한 고리 (`apl.css:397-411`). 포커스는 손잡이에 3px `--focus` 고리.
- **Text input:** 최소 높이 40px, 12px 모서리, 1px 강한 선, 12px 글자 (`.apl-input`, 520줄).

### Callouts
- 12px 모서리, 색 10% 바탕 + 30% 테두리, 13px 글자 1.65 줄간격. 색은 `data-tone`(ok·warn·bad·info·key)이 정한다 (429-435줄).

### Tabs (탐구 · 정리 · 문제)
- 패널 위에 붙는 3칸 균등 격자, 4px 안쪽 여백, 바탕 `--card-2`. 선택된 칸은 카드색 + 선 + 작은 그림자 (`apl.css:372-379`).

### Stage (무대) — 시그니처 구성요소
- 캔버스 위에 라벨 층(`.apl-mlabel`)과 판서 층(`.apl-ink`)이 겹친다. 라벨은 의미색 글자 + 후광, 필요하면 유리 상자(`.box`). 점/손잡이는 후광이 있고 끌 수 있다. 라벨이 무대 밖으로 잘리지 않도록 자동 맞춤이 라벨 상자까지 잰다(`next/README.md` §1 원칙 1).

## Do's and Don'ts

### Do:
- **Do** 색은 `var(--accent)`·`var(--m-*)`·`var(--card)` 같은 토큰으로 읽어, 칠판과 종이 두 테마에서 함께 바뀌게 한다.
- **Do** 같은 대상에는 같은 의미색을 쓴다(슬라이더, 값, 그림).
- **Do** 모서리는 12px(`--r-md`)를 기본으로 하고, 카드는 16px, 칩·탭은 알약으로 한다.
- **Do** 터치 대상은 기본 40px, 모바일에서도 최소 32~36px(작은 버튼 32px, 칩 34px, 장면 탭 36px)를 지킨다.
- **Do** 새 실험실은 공용 셸(`apl-shell.js`)과 `apl.css`를 쓰고 같은 3개 탭(탐구·정리·문제)을 따른다.
- **Do** `prefers-reduced-motion`을 지킨다(`apl.css:588-590`이 전환을 거의 0으로 줄인다). 새 애니메이션도 같은 방식으로 따른다.
- **Do** 화면을 바꾼 뒤 PC와 휴대폰 폭에서 그림·라벨이 가려지지 않는지 연다.

### Don't:
- **Don't** 실험실에서 색·글꼴·크기를 직접 적지 않는다. 필요하면 `apl.css`에 토큰을 더한다.
- **Don't** 무대를 줄이거나, 도형을 가리는 떠 있는 안내 상자를 만들지 않는다(이전 화면의 설계 차이로 `next/README.md` §5.3이 지적한 문제).
- **Don't** 확대를 막지(`user-scalable=no`) 않는다. 2.0 페이지는 막지 않는다(`index.html:5`, `labs/calc1-tangent.html:5`).
- **Don't** 단위가 같은 도형·함수 그림의 가로세로 비율을 1:1에서 바꾸지 않는다. 바꿔야 하면 `aspect:'free'`와 안내 문장을 함께 쓴다.
- **Don't** 문항·해설의 수학 값과 정답을 디자인 작업으로 바꾸지 않는다.
- **Don't** 이전 화면(`labs/`)의 옛 스타일에 새 토큰을 맞추지 않는다. 고칠 때 2.0 체계로 옮긴다.
- **Don't** 카드·버튼에 그림자를 더하지 않는다(그림자는 대화상자와 무대 위 유리 요소만).

## 미정 (사용자 결정 필요)

1. **허브 전용 색**(`--h-*`, `apl-hub.css:1-9`)을 이 문서의 팔레트에 포함할지: 지금은 포함하지 않았다.
