---
version: draft-1
name: APMS-EIE-design-analysis
status: 초안 (검토용 — 코드 미적용)
reference: Linear (밀도·원칙) + Vercel (무채색 라이트 팔레트) + Notion (여백·표면)
anti-reference: Claude(테라코타/감성), Stripe(보라/파랑), Airbnb(소비자앱), iOS 시스템블루
baseline-screen: 학생상세 화면 (apmath/js/student.js) — '고칠 대상'이 아니라 톤을 추출할 '원형'. 1차 대규모 변경 금지.
core-rule: >
  APMS/EIE의 primary action은 파란색이 아니라 near-black(#18181b)이며,
  블루는 링크·포커스·선택·오늘 표시 같은 기능 액센트에만 사용한다.
  (이 한 줄이 '파란 저장 버튼 지옥'을 막는다.)
description: >
  APMS/EIE는 마케팅 랜딩이 아니라 매일 쓰는 학원 운영툴이다.
  지향점은 "예쁨"이 아니라 정돈감 · 밀도 · 낮은 채도 · 얇은 선 · 작은 액션.
  무채색(zinc) 라이트 표면 위에서 정보가 먼저 읽히고, 색은 '의미가 있을 때만'
  최소한으로 쓴다. 주요 액션은 near-black(#18181b), 위험은 작은 빨간 텍스트/버튼,
  기능 액센트(링크·포커스·선택·오늘)는 차분한 단일 블루 하나로 제한한다.
---

# APMS / EIE 디자인 규칙 초안 — Linear + Vercel + Notion

> **이 문서의 목적:** 세 레퍼런스(Linear/Vercel/Notion)의 무엇을 가져오고 무엇을 버릴지 정하고,
> 그 결정을 AP 운영툴 규칙(버튼·카드·모달·표·입력창)으로 고정한다.
> **이번 단계는 문서뿐**이다 — 코드/토큰은 아직 바꾸지 않는다. 매핑·적용은 다음 단계.

---

## 1. 세 레퍼런스 비교 — 무엇을 가져오나

각 DESIGN.md의 **실제 값**을 확인한 결과다. 그대로 베끼면 안 되는 함정이 있어 명시한다.

| 항목 | Linear (실제) | Vercel (실제) | Notion (실제) | **AP가 취하는 것** |
|---|---|---|---|---|
| 캔버스 | **다크** `#010102` | 라이트 `#ffffff` / `#fafafa` | 라이트 `#ffffff` | **라이트** (Vercel) |
| 텍스트 | `#f7f8f8`(밝음) | `#171717` ink | 다크 ink | `#18181b` (zinc-900) |
| 액센트 | 라벤더 `#5e6ad2` **단 1색, 기능에만** | 무채색 + 링크블루 `#0070f3` | 컬러 태그 칩 **다수** | **블루 1색, 기능에만** (Linear 원칙) |
| 카드 | 차콜 패널 + 헤어라인 | 흰 표면 + 얇은 `#ebebeb` | 부드러운 표면 + 넉넉한 여백 | 흰 카드 + 헤어라인 + 여백(Notion) |
| 타이포 | 600~700, 음수 트래킹, **48~80px** | Geist, 600, 음수 트래킹 | 가독 본문 | **AP는 작게**(13~20px) — 아래 4번 |
| 그림자 | 거의 없음 | 거의 없음 | 약함 | **거의 없음**(헤어라인으로 구분) |
| 분위기 | "소프트웨어 장인" 밀도 | 개발툴 무채색 정갈함 | 읽기 편한 문서 | 셋의 교집합 = 정돈된 운영툴 |

**가져올 것**
- **Linear → 원칙(색 아님).** 밀도 높은 리스트, 조용한 카드, 작은 액션 버튼, "액센트는 장식이 아니라 기능에만". ⚠️ Linear 색은 **다크 테마 + 라벤더**라 그대로 쓰면 안 된다.
- **Vercel → 색.** 무채색 라이트(near-white 캔버스 / near-black ink) + 얇은 보더 + primary 남발 금지.
- **Notion → 호흡.** 부드러운 표면, 읽기 편한 여백. 단 **Notion의 컬러 태그 칩 난발은 버린다**(운영툴엔 과함).

**버릴 것**
- Linear의 다크 캔버스·라벤더 / Notion의 알록달록 칩 / iOS 시스템블루(`#007AFF`) 강한 버튼 / 카드마다 다른 그림자·색 / 랜딩식 그라데이션.

---

## 2. 색 토큰 (machine-readable)

> 값은 zinc(무채색) 스케일 + 단일 기능 블루. AP 기존 변수명(`--bg` `--surface` `--primary` 등)에 그대로 매핑할 예정(다음 단계 산출물).

```yaml
colors:
  # 표면 (라이트)
  canvas:        "#f7f7f5"   # 페이지 배경  → --bg
  surface:       "#ffffff"   # 카드/패널    → --surface
  surface-2:     "#f4f4f3"   # 보조 카드/헤더 → --surface-2
  surface-hover: "#f4f4f5"   # 행 hover
  # 텍스트
  ink:           "#18181b"   # 본문/제목    → --text   (zinc-900)
  ink-strong:    "#09090b"   # 강조 제목
  body:          "#3f3f46"   # 본문 보조    → --text-soft (zinc-700)
  muted:         "#71717a"   # 보조 텍스트  → --secondary (zinc-500)
  muted-soft:    "#a1a1aa"   # 비활성/플레이스홀더 (zinc-400)
  # 선
  hairline:      "#e4e4e7"   # 기본 보더    → --border (zinc-200)
  hairline-soft: "#f0f0f1"   # 약한 구분선  → --border-soft
  hairline-strong:"#d4d4d8"  # 강조 보더/입력 포커스 전
  # 액션 — ⚠️ 기존 --primary 를 바로 덮지 말 것 (아래 '토큰 분리 원칙' 참조)
  action-primary:       "#18181b"   # 주요 버튼(near-black) → --action-primary (신규 토큰)
  action-primary-hover: "#27272a"   # → --action-primary-hover
  on-primary:           "#ffffff"
  # 기능 액센트 — 링크 · 포커스링 · 선택 행 · '오늘'에만. 장식·버튼 금지.
  accent:        "#2563eb"   # → --accent (action-primary 와 별개)
  accent-hover:  "#1d4ed8"
  accent-soft:   "#eff6ff"   # 선택 배경 틴트
  # 시맨틱 — '덩어리' 금지. 작은 텍스트/얇은 톤으로만.
  success:       "#16a34a"
  warning:       "#ca8a04"
  error:         "#dc2626"   # → --error / --danger (작은 danger text/button)
  error-soft:    "#fef2f2"   # 위험 hover 배경 틴트
```

### ⚠️ 토큰 분리 원칙 (보정 1 — 적용 안전장치)
> **기존 `--primary`를 1차에서 near-black으로 바로 덮어쓰지 않는다.**
> AP 코드에서 `--primary` / `--primary-rgb`는 저장 버튼뿐 아니라 **링크색·선택 상태·border tint·
> 원내평가 취약단원 박스·학생명 강조색** 등 곳곳에 쓰인다. 바로 검정으로 바꾸면 선택/포커스/오늘/링크
> 구분이 한꺼번에 약해진다. 그래서:
> - **신규 `--action-primary` 토큰을 먼저 둔다** (`#18181b`). 저장·확정 버튼은 이걸 쓴다.
> - **`--accent`(`#2563eb`)를 별도로 둔다** — 링크·포커스·선택·오늘 전용.
> - **기존 `--primary`는 1차에서 유지하거나 `--accent`에 alias**한다. 일괄 제거는 2차 이후 실측하며.

### 🔵 블루 사용 규칙 (보정 2·3 — 검수 기준)
> - **블루는 저장 버튼에 쓰지 않는다.**
> - **블루는 큰 배경 버튼에 쓰지 않는다.**
> - **블루는 링크 · 포커스링 · 선택 상태 · 오늘 표시에만 허용한다.**
> - 위반(파란 solid 버튼 등) = **FAIL**.

### 다크 모드 (AP에 이미 다크 처리 존재 → 같이 정의)
```yaml
colors-dark:
  canvas:        "#09090b"   # zinc-950
  surface:       "#141416"
  surface-2:     "#18181b"
  surface-hover: "#1f1f23"
  ink:           "#fafafa"
  body:          "#d4d4d8"
  muted:         "#a1a1aa"
  hairline:      "#27272a"
  hairline-strong:"#3f3f46"
  action-primary:"#fafafa"   # 다크에선 near-white 버튼
  on-primary:    "#18181b"
  accent:        "#3b82f6"
  error:         "#ef4444"
```

---

## 3. 타이포 · 모서리 · 간격 · 그림자

```yaml
typography:
  # AP는 데이터 밀도형 → 마케팅 사이즈(48~80px) 대신 작은 스케일 유지
  page-title:   { size: 20px, weight: 600, tracking: -0.3px }   # --ap-ui-font-stat 계열
  section:      { size: 15px, weight: 600, tracking: -0.2px }   # --ap-ui-font-section
  card-title:   { size: 14px, weight: 600 }
  body:         { size: 13px, weight: 400, lineHeight: 1.5 }    # --ap-ui-font-body
  body-strong:  { size: 13px, weight: 500 }
  label:        { size: 12px, weight: 500, color: muted }
  caption:      { size: 11px, weight: 400, color: muted }
  fontFamily:   "Pretendard, -apple-system, 'Segoe UI', Roboto, sans-serif"
  numeric:      "tabular-nums 권장 (표/점수 정렬)"

rounded:
  xs: 4px      # 작은 버튼/뱃지
  sm: 6px      # 기본 버튼/입력창   (Vercel sm)
  md: 8px      # 카드 내부 요소
  lg: 10px     # 카드
  modal: 14px  # 모달
  full: 9999px # 칩/아바타

spacing:   # 4px 그리드, 운영툴이라 촘촘하게
  xxs: 4px
  xs:  8px
  sm:  12px
  md:  16px
  lg:  20px
  xl:  24px

shadow:
  # 그림자 거의 안 씀. 구분은 헤어라인으로. 떠야 하는 것만 약하게.
  none:  "none"            # 카드 기본 (border만)
  pop:   "0 1px 2px rgba(0,0,0,0.04)"          # 드롭다운/팝오버
  modal: "0 8px 28px rgba(0,0,0,0.12)"         # 모달만
```

---

## 4. 컴포넌트 규칙 (학생상세 화면 기준 원형)

> 원칙: **테두리로 구분, 색으로 의미는 최소.** 버튼마다 색을 칠하지 않는다.

### 버튼
| 종류 | 배경 | 텍스트 | 보더 | 용도 |
|---|---|---|---|---|
| primary | `--action-primary` `#18181b` | 흰색 | none | 저장·확정 등 화면당 1개. **블루 아님** |
| default | `#ffffff` | `#18181b` | `1px #e4e4e7` | 취소·일반 액션(대부분) |
| subtle/ghost | 투명 | `#3f3f46` | none, hover만 `surface-2` | 인라인 액션·아이콘 버튼 |
| danger | 흰색/투명 | `#dc2626` | none 또는 `1px #dc2626` | 삭제 — 아래 규칙 |
- 높이 28~32px, radius `6px`, 폰트 13px/500. 한 줄에 액션 여러 개면 primary 1개 + 나머지 default/ghost.

**삭제(danger) 버튼 — 고정 규칙 (보정 3)**
- 기본: **흰색/투명 배경 + 빨간 글씨(`#dc2626`)**, 필요 시 얇은 빨간 border.
- 높이 28~32px. hover 시 `error-soft`(`#fef2f2`) 틴트 배경까지는 허용.
- **`solid red` 배경 절대 금지.** 기본 상태에서 빨간 덩어리가 보이면 **FAIL.**

- **전체 금지:** 파란 저장 버튼, 큰 색면 버튼, solid red 삭제 버튼, 모든 버튼에 색 채우기.

### 카드 / 패널
- 배경 `#ffffff`, 보더 `1px #e4e4e7`, radius `10px`, 그림자 **none**.
- 헤더 영역만 `surface-2`(`#f4f4f3`)로 살짝 구분, 헤어라인 하단선.
- 내부 패딩 `16px`, 섹션 간 간격 `16~20px`. **카드마다 다른 색/그림자 금지.**

### 모달
- radius `14px`, 그림자 `modal`만, 오버레이 `rgba(0,0,0,0.4)`.
- 헤더 타이틀 15px/600, 본문 13px. 하단 액션 = `[default 취소][primary 저장]` 한 줄.
- 위험 액션은 본문 내 작은 danger 텍스트버튼. (방금 정리한 일정 모달의 `수정`/`삭제` 2버튼 패턴과 동일 결로 맞춤.)

### 표 (학생 리스트·점수표)
- 헤더 행: `surface-2` 배경, 12px/500 muted 텍스트, 하단 `1px hairline`.
- 행 구분: 하단 헤어라인만(세로선 X, 얼룩말 줄무늬 X).
- 행 hover: `surface-hover`. 선택 행: `accent-soft` 배경 + 좌측 2px accent 바.
- 숫자/점수 열은 `tabular-nums` + 우측 정렬.

### 입력창 / 셀렉트
- 배경 `#ffffff`, 보더 `1px #e4e4e7`, radius `6px`, 높이 32~36px, 13px.
- 포커스: 보더 `accent` + `0 0 0 3px accent-soft` 링(그림자 X). placeholder `muted-soft`.

### 칩 / 뱃지 / 상태
- 기본은 무채색: `surface-2` 배경 + `muted` 텍스트 + 얇은 보더.
- 상태 의미가 꼭 필요할 때만 시맨틱 톤(soft 배경 + deep 텍스트), 한 화면에 색 종류 **최소화**.
- Notion식 알록달록 멀티 컬러 태그는 **쓰지 않는다.**

---

## 5. 1차 적용 가드레일 (보정 4·5·6 — 검수 기준)

**① 학생상세 = 고칠 대상이 아니라 '원형' (보정 4)**
- 학생상세 화면은 **1차에서 대규모 변경하지 않는다.**
- 학생상세의 버튼/카드/모달 톤을 **추출해서 다른 화면으로 확산**한다. 기준점이 흔들리면 안 됨.

**② EIE 시간표 로직 보호 (보정 5)**
- EIE 시간표는 1차에서 **grid 구조, span 계산, 교시 병합, 학생명 렌더링 로직을 건드리지 않는다.**
- **색상 · border · 카드 표면 · 버튼 스타일만** 적용한다. (레이아웃 깨짐 방지)

**③ "변수 매핑만으로 끝나지 않는다" (보정 6)**
- 1차는 **`:root` 변수 + 공통 버튼/카드 클래스 중심**으로 적용한다.
- **inline style · 하드코딩 색(약 81곳)은 별도 실측 후 단계적으로 제거**한다.
- 변수 교체만으로 전체 화면이 완성된다고 보지 않는다.

---

## 6. 핵심 한 줄
**APMS/EIE = Vercel 무채색 라이트 팔레트 + Linear의 밀도·원칙 + Notion의 여백. 학생상세 화면이 기준 원형. 색은 의미가 있을 때만, 액센트 블루는 기능(링크·포커스·선택·오늘)에만.**

---

## 다음 단계 (이 문서 승인 후)
1. **신규 토큰(`--action-primary` / `--accent` / `--accent-soft`) 추가 + 매핑표** + **테마 오버라이드 CSS 초안**(라이트/다크) — 기존 `--primary`는 유지/alias, 일괄 제거 금지 — 문서/초안, 무위험
2. 학생상세(원형)에서 버튼/카드/모달 톤 **추출** → 공통 컴포넌트 클래스 정리
3. 원내평가 or 클래스룸 **한 화면 먼저** 적용 → 인라인 하드코딩 색(약 81곳) 중 해당분 실측·정리
4. 확인 후 APMATH 전체 → EIE 확장 (EIE 시간표는 grid 로직 보호, 스타일만)
