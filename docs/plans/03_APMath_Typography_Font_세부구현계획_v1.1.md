# APMath Typography & Font 세부 구현계획 v1.1

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 03 / Typography & Font  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 89462a1c59567a652ab5f500a8b96f4ccaa7052a`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-04, D-02  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 상위 마스터 계획의 세 번째 세부계획으로, APMath Visual Production Engine의 **수식 조판·한글 글꼴·glyph·baseline·self-contained 전달·실측 가능한 label fragment**를 정식 production 계층으로 완성하는 구현계획이다.

목표는 기존 SVG의 `font-family` 문자열을 사후 치환하는 것이 아니다.

> **수학 의미를 먼저 고정하고 → 실제 최종 출력에 사용할 수식/한글 fragment를 생성하고 → 그 동일 fragment를 측정하고 → 측정값을 layout이 사용하고 → 동일 fragment를 최종 SVG에 삽입하며 → 독립 audit와 실제 Archive 렌더에서 같은 bytes를 검증하는 구조를 만든다.**

이 문서의 핵심 원칙은 다음이다.

```text
semantic text / math AST
→ ResolvedTypographyProfile
→ final fragment generation
→ fragment freeze
→ actual measurement
→ layout
→ final SVG composition
→ fragment audit
→ browser / Archive verification
```

즉:

**측정 전에 최종 표현이 확정되어야 한다.**

근사 문자열을 측정한 뒤 마지막에 MathJax/다른 글꼴로 바꾸는 경로는 허용하지 않는다.

이 문서는 typography/font 계층만 다룬다.

별도 세부계획의 책임:

- Construction Kernel
- Function Graph & Coordinate Axis Publication
- measured owner-aware layout 전체
- One-Click runner
- actual Archive integration
- 문제 → VisualRequest planner
- 전체 qualification / seal

---

# 1. 구현 결정

## 1.1 수학 표현

**수학 label은 고정된 MathJax SVG fragment를 production 기본 경로로 사용한다.**

기존 `math_expression.py`의 AST는 계속 **수학 의미 정본**이다.

MathJax는:

- 표현/조판 엔진
- glyph path / fraction / radical / superscript / subscript layout
- baseline/geometry 산출

역할을 맡는다.

MathJax가 source/solution의 수학 의미를 새로 결정하지 않는다.

---

## 1.2 일반 한글/텍스트

일반 한글·설명·단위·짧은 자연어는 **고정된 Korean font 자산**을 사용한다.

우선 방향:

- Noto 계열 기반의 고정 font
- 실제 font bytes/version/hash 고정
- glyph coverage 고정
- self-contained 전달

1차 전략:

**subset embedding**

qualification에서 `<img>` / isolated replay / 실제 Archive 간 font rendering 동등성이 확보되지 않으면:

**동일 고정 font의 outline/path strategy**

를 검토한다.

두 방식을 상시 병렬 backend로 유지하지 않는다.

실험을 통해 하나를 production 기본 경로로 확정한다.

---

## 1.3 시스템 font fallback 금지

현재 style token의 family stack:

```text
text:
Noto Sans KR,
Pretendard,
Apple SD Gothic Neo,
Malgun Gothic,
sans-serif

math:
STIX Two Math,
Cambria Math,
Times New Roman,
serif
```

은 legacy/fallback 정보로 보존한다.

하지만 production publication에서는:

> **실제 어떤 font bytes가 사용됐는지 알 수 없는 system stack을 최종 권위로 사용하지 않는다.**

필요 font가 없으면 임의 fallback으로 PASS하지 않는다.

---

## 1.4 MathJax 기존 자산 재사용

현재 repo에는 이미:

- `archive/vendor/mathjax/`
- `archive/vendor/mathjax-newcm-font/`
- `archive/vendor/mathjax-tex-font/`

가 존재한다.

MathJax core와 `mathjax-tex-font` 경로에는 Apache-2.0 라이선스가 확인된다.

따라서 신규 구현은:

- 기존 vendored MathJax 생태계 재사용
- 정확한 component/version/hash inventory
- SVG output adapter
- 필요한 math font artifact lock

을 우선한다.

새 수식 조판기를 직접 만드는 계획은 채택하지 않는다.

---

# 2. 현재 main의 실제 상태

## 2.1 `math_expression.py`

현재 이미 존재:

- bounded parser
- AST
- exact rational `Fraction`
- symbol
- tuple/group
- unary
- binary
- power
- fraction
- prime
- subscript
- 함수:
  - `sqrt`
  - `sin`
  - `cos`
  - `tan`
  - `log`
  - `exp`
  - `abs`
- TeX serializer
- plain serializer
- SVG `<tspan>` serializer
- exact coordinate parity

현재 장점:

- raw arbitrary TeX를 받지 않음
- AST node/depth 제한
- source math 의미를 구조화해서 유지
- TeX serialization 가능

---

## 2.2 현재 SVG serializer의 한계

현재 SVG mode에서는:

### exponent

```xml
<tspan baseline-shift="super" font-size="70%">
```

### subscript

```xml
<tspan baseline-shift="sub" font-size="70%">
```

### fraction

실제 fraction bar layout이 아니라:

```text
a/b
```

형태

### sqrt

실제 radical construction이 아니라:

```text
√(x)
```

형태

이다.

즉 semantic readability는 있지만
전문적인 수학 출판 조판은 아니다.

따라서 production typography에서는:

**AST → TeX → MathJax SVG fragment**

경로를 사용한다.

기존 SVG serializer는:

- legacy
- debug/plain candidate
- simple fallback diagnosis

로 보존할 수 있다.

---

## 2.3 `svg_composer.py`

현재 composer는:

- screen primitive materialization
- `<text>` / `<tspan>`
- owner metadata
- safe math markup
- style tokens

를 사용한다.

현재 `safe_math_markup()`는 허용 element를:

- `text`
- `tspan`

로 제한한다.

따라서 MathJax SVG fragment의:

- `path`
- `defs`
- `use`
- `g`
- transform

등을 그대로 허용할 수 없다.

production-v2에서는 **math label subtree만 별도 닫힌 allowlist**를 가져야 한다.

전체 SVG allowlist를 느슨하게 풀지 않는다.

---

## 2.4 `verify-rendered-layout.mjs`

현재 browser measurement는:

- `document.fonts.ready`
- `getBBox()`
- `getBoundingClientRect()`
- computed font family
- base font px
- effective font px
- missing glyph heuristic
- collision
- clipping
- geometry overlap

을 검사한다.

현재 한계:

1. `<text>` element 중심
2. MathJax path fragment의 typographic baseline을 직접 소유하지 않음
3. `getBBox()`만으로 advance/ascent/descent를 대표할 수 없음
4. system font stack 실제 resolved glyph identity를 완전 증명하지 않음
5. fragment 자체 hash와 measurement를 직접 결박하지 않음

따라서 새 measurement contract가 필요하다.

---

## 2.5 actual Archive render

`record-visual-browser-evidence.mjs`는 이미:

- actual Archive page
- MathJax startup
- `document.fonts.ready`
- image decode
- APPrintRuntime readiness
- target SVG load
- actual loaded asset SHA
- actual image rect
- isolated SVG replay at actual Archive image size
- screenshot

을 수행한다.

이 자산은 반드시 재사용한다.

단 새 typography에서는:

```text
fragment hash
font asset hash
typography profile hash
final SVG hash
actual loaded SVG hash
```

를 하나의 evidence chain으로 결박한다.

---

## 2.6 TikZ 경로

현재 `tikz_adapter.py`는:

- XeLaTeX
- `fontspec`
- `amsmath`
- TikZ
- dvisvgm

를 optional toolchain으로 사용한다.

하지만:

- 설치 여부에 따라 disabled
- candidate only
- publication PASS 권한 없음

이다.

따라서 이번 typography production 기본 경로는 TikZ로 바꾸지 않는다.

TikZ는:

- 특수 조판 비교
- fallback research
- backend quality reference

정도로 유지한다.

---

# 3. TypographyProfile v1

production typography는 실행 시작 시 한 번 resolve한다.

제안:

`ResolvedTypographyProfile`

---

## 3.1 최소 구조

```json
{
  "schemaVersion": "apmath-typography-profile-v1",
  "profileId": "apmath-publication-typography-v1",
  "math": {
    "renderer": "MATHJAX_SVG",
    "rendererVersion": "...",
    "rendererArtifactSha256": "...",
    "fontPackage": "...",
    "fontArtifactSha256": "...",
    "svgCacheMode": "LOCAL"
  },
  "text": {
    "familyId": "AP_KOREAN_SANS_V1",
    "sourceFileSha256": "...",
    "delivery": "SUBSET_EMBED",
    "fallbackAllowed": false
  },
  "sizeRoles": {},
  "baselinePolicy": {},
  "measurementEnvironment": {},
  "profileSha256": "..."
}
```

---

## 3.2 profile freeze

한 production attempt에서 profile은 immutable하다.

금지:

- 생성기와 측정기가 서로 다른 font 설정 읽기
- composer가 `style_tokens.json`을 다시 읽어 font를 덮어쓰기
- browser에서 시스템 fallback이 발생했는데 그대로 PASS
- repair 중 font family를 임의 변경

font/renderer 변경은 새 attempt다.

---

# 4. LabelInventory v1

layout 이전에 모든 label을 inventory 한다.

---

## 4.1 최소 필드

```json
{
  "id": "A-name",
  "semanticKind": "POINT_NAME",
  "contentKind": "TEXT",
  "sourceText": "A",
  "mathAstSha256": null,
  "owner": "A",
  "factRole": "GIVEN",
  "required": true,
  "fontRole": "POINT_LABEL",
  "priority": 1
}
```

math:

```json
{
  "id": "eq-1",
  "semanticKind": "EQUATION_LABEL",
  "contentKind": "MATH",
  "sourceText": "40/3",
  "mathAstSha256": "...",
  "owner": "...",
  "required": true,
  "fontRole": "MATH_LABEL"
}
```

---

## 4.2 inventory completeness

layout 실패로 최종 SVG에 나오지 않은 label도 inventory에 남아 있어야 한다.

즉:

```text
expected inventory
vs
final fragment inventory
```

를 비교한다.

required label 누락은 fail.

---

## 4.3 role

기본 role:

- `POINT_LABEL`
- `ANGLE_LABEL`
- `LENGTH_LABEL`
- `AREA_LABEL`
- `COORDINATE_LABEL`
- `EQUATION_LABEL`
- `GRAPH_FUNCTION_LABEL`
- `GRAPH_TICK_LABEL`
- `AXIS_LABEL`
- `CONDITION_TEXT`
- `KOREAN_EXPLANATION`
- `UNIT_LABEL`

role마다:

- target nominal size
- minimum size
- text/math renderer
- baseline policy

를 profile이 지정한다.

---

# 5. Math fragment generation

## 5.1 authority

입력:

```text
validated math AST
→ canonical TeX
→ MathJax SVG
```

raw user TeX를 바로 MathJax에 전달하지 않는다.

---

## 5.2 canonical TeX

현재 `math_expression.serialize(ast, "tex")`를 확장/재사용한다.

해야 할 것:

- AST SHA
- TeX string
- serializer version

을 함께 기록한다.

동일 AST + 동일 serializer version은 동일 canonical TeX를 목표로 한다.

---

## 5.3 MathJax output

production label fragment는:

- outer label `<g>`
- local fragment content
- viewBox / intrinsic geometry
- baseline metadata
- semantic binding

을 가진다.

가능하면 expression-local glyph cache를 사용한다.

금지:

- final SVG 밖의 global `<defs>`에 의존
- CDN glyph URL 의존
- runtime page의 MathJax 전역 state에 의존
- 다른 SVG의 glyph ID 참조

최종 SVG asset 자체가 self-contained해야 한다.

---

## 5.4 local ID normalization

MathJax fragment 내부 ID가 실행마다 달라질 가능성이 있다면:

- deterministic prefix
- questionUid/surface/visualAssetKey/panelId/labelId/occurrence 전체 identity 기반 namespace
- canonical sorting

을 적용한다.

동일 input에서 final SVG bytes 재현성을 깨는 random/runtime id를 제거한다.

## 5.5 namespace 생성 시점

stable fragment identity의 canonical hash로 deterministic namespace를 **typeset 결과의 freeze 이전**에 확정한다. 모든 local id/href 참조를 함께 정규화하고 동일 SVG 내 중복을 검사한다. source label 이름 자체는 바꾸지 않는다. composer가 namespace를 사후 치환하지 않는다.

---

# 6. Math typesetting support matrix

v1 필수:

- integer
- negative
- rational fraction
- nested fraction
- square root
- nested radical
- exponent
- nested power
- subscript
- prime / double prime
- Greek letters
- π
- equality/inequality
- coordinate pair
- simple function notation
- multiplication
- absolute value
- simple trig/log/exp notation

---

## 6.1 semantic preservation

예:

```text
40/3
```

은 visual layout이 분수선으로 바뀌어도 의미는 정확히 `40/3`.

```text
sqrt(3)/2
```

는 decimal로 바꾸지 않는다.

```text
x_1
```

의 subscript scope가 달라지지 않는다.

---

# 7. Korean text font strategy

## 7.1 font candidate

현재 우선 방향은 Noto 계열 고정 font.

정확한 파일은 implementation qualification에서 고정한다.

필수:

- source path
- upstream version
- license
- file SHA256
- glyph inventory
- subset tool/version

문서 단계에서 특정 `.woff2` 파일을 이미 확정했다고 주장하지 않는다.

---

## 7.2 subset embedding

1차 검토 방식:

```text
label inventory
→ glyph set
→ deterministic subset
→ embedded font bytes
→ final SVG
```

장점:

- text semantics 유지
- copy/accessibility 가능성
- path outline보다 용량 효율 가능

검증 필수:

- Korean
- Latin
- digits
- punctuation
- minus
- prime
- degree
- units
- mixed Korean/math adjacency

---

## 7.3 outline fallback

subset embedding이 실제 `<img>` 환경에서:

- font load race
- browser inconsistency
- unsupported SVG embedded font behavior
- baseline instability

등을 해결하지 못하면 같은 고정 font를 outline한다.

outline을 쓰는 경우에도:

- original text semantic metadata 유지
- accessibility text/desc 유지
- fragment audit 가능

해야 한다.

outline은 임의 manual path 변환이 아니라 deterministic toolchain으로 수행한다.

---

# 8. Glyph coverage

production 전:

```text
LabelInventory
→ required Unicode codepoints
→ font glyph coverage
```

검사.

필수 범주:

- Hangul syllables
- Latin A-Z/a-z
- digits
- Greek used by source
- mathematical operators used outside MathJax
- minus `−`
- hyphen `-`
- prime `′`
- degree `°`
- parentheses/brackets
- comma/period/colon
- Korean punctuation

missing glyph가 있으면 fallback하지 않고:

`FONT_GLYPH_MISSING`

---

# 9. Mixed text + math

예:

```text
점 A에서 x=2
반지름 r
넓이 3π
```

한 label 안에서 text와 math가 섞일 수 있다.

v1 전략:

`LabelRun[]`

```json
[
  {"kind":"TEXT","value":"점 "},
  {"kind":"MATH","ast":"A"},
  {"kind":"TEXT","value":"에서 "},
  {"kind":"MATH","ast":"x=2"}
]
```

각 run을 별도 fragment로 만들되
하나의 label group에서 baseline 정렬한다.

---

## 9.1 금지

문장 전체를 TeX `\text{...}`로 밀어 넣어
Korean font authority를 MathJax에 넘기지 않는다.

반대로 수식을 일반 Korean font text로 근사하지 않는다.

---

# 10. Baseline contract

typography의 핵심이다.

현재 layout은 일반 label baseline을
box height 비율로 근사할 수 있다.

production-v1에서는 final fragment가 baseline 정보를 제공해야 한다.

---

## 10.1 Math fragment baseline

저장:

- intrinsic viewBox
- ink bounds
- baselineY
- advanceWidth
- ascent
- descent 또는 동등 값
- em scale

---

## 10.2 Text fragment baseline

Canvas/TextMetrics 또는 실제 browser font metrics를 사용.

최소:

- actualBoundingBoxAscent
- actualBoundingBoxDescent
- actualBoundingBoxLeft
- actualBoundingBoxRight
- width

브라우저가 특정 metric을 제공하지 않으면:
측정 방식과 fallback을 profile에 명시한다.

---

## 10.3 Mixed runs

baseline 기준으로 정렬.

Korean text box center와
MathJax SVG box center를 단순 수직 중앙 정렬하지 않는다.

---

# 11. Fragment contract

`LabelFragment v1`은 owner-bound다. 예시의 placeholder는 실데이터가 아니다.

```json
{
  "identity": {"questionUid":"...","surface":"SOLUTION_VISUAL","visualAssetKey":"...","panelId":null,"labelId":"...","occurrence":0},
  "labelId": "...",
  "owner": "...",
  "ownerKind": "SEGMENT",
  "factRole": "GIVEN",
  "namespace": "...",
  "contentKind": "MATH",
  "semanticSha256": "...",
  "profileSha256": "...",
  "renderer": "MATHJAX_SVG",
  "rendererVersion": "...",
  "fragmentSha256": "...",
  "viewBox": {},
  "baseline": {},
  "glyphInventory": [],
  "svg": "..."
}
```

TEXT도 동일 identity/owner 경계를 따른다. `fragmentSha256`는 최종 사용할 exact SVG fragment bytes의 hash이며, manifest 자신의 hash를 fragment 내부에 삽입해 순환시키지 않는다. identity.labelId와 labelId는 같아야 한다. owner/namespace는 freeze 전에 확정한다.

---

# 12. Measurement contract

**최종 출력에 삽입할 동일 fragment를 측정한다.**

`MeasuredLabel v1`

```json
{
  "labelId": "...",
  "fragmentSha256": "...",
  "profileSha256": "...",
  "inkBounds": {},
  "advance": 0,
  "baseline": 0,
  "ascent": 0,
  "descent": 0,
  "measurementSpace": "SVG_USER_SPACE",
  "browser": "...",
  "measurementEnvironmentSha256": "..."
}
```

---

## 12.1 측정 불일치

다음은 FAIL:

- fragment SHA 다름
- profile SHA 다름
- font bytes 다름
- renderer version 다름
- browser measurement environment 다름
- expected label inventory와 measurement inventory 다름

## 12.2 identity 결박

MeasuredLabel은 labelId뿐 아니라 fragment manifest의 identity/owner와 exact fragment SHA에 연결된다. 이름이 같은 다른 UID/owner의 metrics를 labelId만으로 lookup하지 않는다. metadata만 바뀌어도 owner-bound fragment bytes가 바뀌므로 v1에서는 새 fragment/measurement entry를 만든다. label 위치만 바뀌면 동일 fragment의 intrinsic metrics는 재사용한다.

---

# 13. 측정 environment

최소 결박:

- browser name/version
- OS/container
- DPR
- SVG root size
- font bytes hash
- MathJax artifact hash
- typography profile hash
- renderer options

cache key에 포함한다.

---

# 14. Self-contained final SVG

최종 SVG는 외부 네트워크 없이 rendering 가능해야 한다.

금지:

- remote font URL
- CDN MathJax
- external `<use href="http...">`
- filesystem absolute path
- browser-installed font 전제
- parent HTML CSS 없으면 깨지는 핵심 수식

허용되는 parent dependence는 명시적 publication contract가 있는 최소 display sizing뿐이다.

수학/폰트 핵심은 asset 내부 또는 versioned local dependency로 고정한다.

---

# 15. MathJax SVG fragment audit

producer가 만든 MathJax fragment를 그대로 믿지 않는다.

---

## 15.1 독립 reference

입력:

- frozen AST
- canonical TeX
- pinned MathJax version/options

독립 audit가 reference fragment를 별도로 생성하거나
semantic structure를 독립적으로 관측한다.

producer의 `PASS` 값을 읽지 않는다.

---

## 15.2 allowlist

math subtree에서만 허용:

- `g`
- `path`
- `defs`
- local `use`
- `rect` 등 MathJax가 실제 qualification에서 필요하다고 확인한 최소 primitive
- transform
- fill

정확한 allowlist는 actual pinned MathJax output inventory 후 고정한다.

“MathJax니까 다 허용” 금지.

---

## 15.3 local reference

`use`는 local fragment namespace만 참조 가능.

외부/global glyph reference 금지.

모든 referenced id 존재 필수.

---

## 15.4 semantic mutation test

최소 mutation:

- numerator glyph swap
- denominator glyph swap
- exponent scope 변경
- subscript 제거
- minus sign 제거
- radical bar 제거
- fraction bar 제거
- duplicated glyph
- hidden glyph
- transform 변경

독립 audit가 FAIL해야 한다.

---

# 16. Korean fragment audit

검사:

- expected text
- Unicode sequence
- font asset hash
- glyph coverage
- required visible glyph count
- ink bounds valid
- baseline valid
- fallback 발생 여부

outline mode라면:

- semantic original text metadata
- expected glyph/path count mapping
- font/source hash

를 결박한다.

---

# 17. Browser font verification

현재 단순 computed `fontFamily`만으로는 부족하다.

production qualification에서는:

- expected FontFace load 완료
- exact font asset hash와 CSS @font-face binding
- glyph coverage
- fallback detection

을 추가한다.

가능한 방법:

- FontFaceSet check
- known sentinel glyph metric comparison
- explicit local font family id
- browser devtools/font APIs가 안정적으로 제공하는 범위 활용

구현에서 검증 가능한 방식 하나를 선택한다.

불확실하면:

`FONT_IDENTITY_NOT_VERIFIED`

로 남긴다.

---

# 18. `<img>` 환경과 isolated replay

실제 Archive는 SVG를 `<img>`로 렌더한다.

현재 browser evidence는:

1. actual Archive에서 image rect 확인
2. 동일 SVG를 isolated DOM으로 actual-size replay
3. layout 측정

을 한다.

typography qualification에서는:

- same SVG bytes
- same display size
- same embedded font
- same MathJax paths

라면 isolated replay가 geometry/layout 측정의 proxy가 될 수 있는지
실험으로 확인해야 한다.

---

## 18.1 qualification comparison

대표 case에서:

- actual `<img>` screenshot crop
- isolated SVG replay screenshot
- raster pixel comparison 또는 feature comparison
- size/baseline/line break parity

를 비교한다.

허용오차를 초과하면 replay를 final font proof로 사용하지 않는다.

---

# 19. MathJax CHTML과 SVG 경로 분리

현재 Archive 본문 MathJax는 CHTML runtime을 사용한다.

이번 작업에서:

**Archive 전체 수식 renderer를 SVG로 교체하지 않는다.**

구조:

```text
Archive HTML text math
→ existing MathJax CHTML

Visual Engine SVG labels
→ pinned MathJax SVG adapter
```

두 경로는 목적이 다르다.

---

# 20. Typography style roles

현재 style token을 바탕으로 production profile에서 role을 고정한다.

기본 예:

| Role | Current token source |
|---|---|
| Point name | `pointName` |
| Coordinate | `coordinateLabel` |
| Math label | `mathLabel` |
| Condition box | `conditionBox` |
| Tick | `tickLabel` |

실제 숫자 값은 후속 qualification에서 고정하되
현재 visual contract의 desktop 기준:

- 11 CSS px 미만 HARD FAIL
- 12px 이상 기본 목표

를 유지한다.

---

# 21. 작은 첨자와 fraction의 가독성

11px floor는 **기본 student-facing label의 final effective size** 기준이다.

MathJax 내부 exponent/subscript glyph까지
모두 11px 이상이어야 한다는 의미로 해석하지 않는다.

대신 검사:

- parent/base label floor
- exponent/subscript ink visibility
- clipping 없음
- 실제 Archive screenshot readability

을 함께 본다.

---

# 22. Typography와 owner binding

Typography는 label meaning을 바꾸지 않는다.

fragment metadata에:

- label id
- owner
- owner kind
- fact role
- semantic kind
- math AST/text hash

를 보존한다.

final composer가 fragment를 다른 owner에 붙이면 artifact audit가 실패해야 한다.

v1은 §24의 owner-bound cache를 사용한다. fragment identity와 owner는 생성 전 확정하며 final composer는 이를 read-only로 소비한다. 같은 semantic text라는 이유로 다른 owner fragment를 재사용하지 않는다.

---

# 23. Composer v2 integration

현재 composer는 text/tspan 중심이다.

production-v2에서는 label을:

```text
TextFragment
MathFragment
MixedFragment
```

로 받는다.

composer는:

- 수학 계산 안 함
- 조판 계산 안 함
- font 선택 안 함

오직 frozen fragment 바깥 placement transform, layout position, layer를 적용한다. owner metadata는 fragment/manifest와 일치하는지 확인할 뿐 다시 배정하거나 수정하지 않는다. placement wrapper가 owner/identity를 표시하는 경우에도 frozen manifest와 exact parity를 요구한다.

---

## 23.1 사후 text mutation 금지

최종 SVG 작성 후:

- regex font 교체
- `<tspan>` 수정
- fraction 재작성
- font-size 직접 수정

금지.

수정 필요 시:

```text
profile/fragment
→ measurement
→ layout
→ compose
```

재실행.

---

# 24. Fragment cache — owner-bound 최소 구현으로 확정

v1은 공유 GlyphFragment/LabelInstance 두 계층을 새로 만들지 않고, **owner-bound LabelFragment**를 cache한다.

```text
semantic content SHA
+ fragment identity:
  questionUid / surface / visualAssetKey / panelId / labelId / occurrence
+ owner / ownerKind / factRole
+ renderer version + artifact hash
+ typography profile SHA
+ font artifact SHA
+ serializer + namespace schema version
```

실제 frozen fragment bytes에 반영되는 필드는 모두 key에 포함한다. 같은 숫자 `3`이라도 AB와 CD, 서로 다른 UID의 A label, 같은 SVG 내 여러 occurrence는 서로 다른 cache entry다. 동일 identity/semantic/profile/dependency는 attempt가 달라도 재사용 가능하므로 **runId/attempt 번호는 namespace/key에 넣지 않는다.**

layout transform은 final frozen fragment **바깥 placement wrapper**에만 적용하므로 fragment key에서 제외한다. cache hit 후 id/owner/factRole/local reference를 조용히 바꾸지 않는다. 그런 변경이 필요하면 새 fragment를 생성·freeze·측정한다.

이후 실제 성능상 필요할 때만 owner-free glyph cache를 별도 검토한다. 이번 구현에 두 가지 cache 모델을 선택지로 남기거나, owner-free key로 owner-bound bytes를 재사용하는 혼합 방식은 허용하지 않는다.

---

# 25. Measurement cache

cache key:

```text
fragment SHA
+ measurement environment SHA
+ target scale / display context
```

font/profile 변경은 measurement cache를 무효화한다.

---

# 26. Invalidation 규칙

## math AST 변경

재실행:

```text
typeset
→ fragment audit
→ measurement
→ layout
→ SVG
→ render/review
```

---

## Korean text 변경

재실행:

```text
glyph inventory
→ subset/fragment
→ measurement
→ layout
→ SVG
→ render
```

---

## font bytes 변경

재사용:

- source/solution
- geometry/graph math

무효화:

- all text fragment
- measurement
- layout
- SVG
- render/review

---

## layout position만 변경

재사용:

- frozen fragment
- fragment audit
- intrinsic measurement

재실행:

- placement collision
- SVG
- rendered layout
- Archive review

## owner/identity 변경

새 owner-bound fragment와 measurement를 만들고 영향을 받은 placement/composition/audit/render를 다시 수행한다. 다른 owner의 frozen fragment는 그대로 재사용한다. coordinate math가 변하지 않았으면 수학 검수를 다시 시작하지 않는다.

---

# 27. 실패 상태

- `TYPOGRAPHY_PROFILE_INVALID`
- `MATH_AST_REQUIRED`
- `MATH_SERIALIZATION_FAIL`
- `MATHJAX_TOOLCHAIN_UNAVAILABLE`
- `MATHJAX_FRAGMENT_INVALID`
- `MATH_FRAGMENT_NONDETERMINISTIC`
- `MATH_FRAGMENT_AUDIT_FAIL`
- `FONT_ASSET_MISSING`
- `FONT_HASH_MISMATCH`
- `FONT_LICENSE_METADATA_MISSING`
- `FONT_GLYPH_MISSING`
- `FONT_IDENTITY_NOT_VERIFIED`
- `FONT_FALLBACK_DETECTED`
- `TEXT_FRAGMENT_FAIL`
- `MIXED_BASELINE_FAIL`
- `FRAGMENT_INVENTORY_MISMATCH`
- `MEASUREMENT_FRAGMENT_MISMATCH`
- `BASELINE_MEASUREMENT_FAIL`
- `TYPOGRAPHY_RENDER_PENDING`
- `TYPOGRAPHY_UNSUPPORTED_CAPABILITY`

---

# 28. 신규 파일 제안

## `production/typeset-labels.mjs`

책임:

- LabelInventory 수용
- pinned MathJax SVG 실행
- Korean text fragment 생성
- mixed fragment 조합
- deterministic output
- fragment manifest

---

## `production/typography-profile.json`

또는 기존 production contracts 안에 통합.

책임:

- renderer/font version
- artifact SHA
- role
- size
- baseline
- delivery method
- measurement policy

중복 authority 파일을 만들지 않는다.

---

## `audit_label_fragments.mjs`

책임:

- frozen semantic input
- independent/reference rendering
- subtree structure/glyph audit
- fragment SHA binding
- mutation detection

producer helper import 금지.

---

## `archive/vendor/visual-typesetting/`

책임:

- qualified MathJax SVG component
- Korean font asset/subset tool dependency
- license/notice
- version/hash manifest

현재 `archive/vendor/mathjax*`를 재사용할 수 있으면
불필요한 복제 금지.

이 디렉터리는 필요성이 실제 inventory에서 확인될 때만 만든다.

---

# 29. 기존 파일 수정

## `math_expression.py`

- canonical TeX serialization 강화
- serializer version
- AST hash helper
- MathJax input contract
- unsupported syntax fail-closed

기존 parser 의미는 최대한 유지.

---

## `engine.py`

- LabelInventory export
- raw text markup 대신 frozen fragment input
- production-v2 path에서 measurement required
- legacy path compatibility

---

## `label_layout.py`

직접 typography를 구현하지는 않는다.

받는 값:

- ink bounds
- advance
- baseline
- ascent/descent

를 이용할 수 있도록 typed measurement contract를 수용한다.

상세 placement 알고리즘은 Detail 04 책임.

---

## `svg_composer.py`

- text/math/mixed frozen fragment 삽입
- math subtree closed allowlist
- owner/fact metadata 유지
- style/profile 재로드 제거

---

## `style_tokens.json / style_tokens.py`

- legacy family stack 보존
- production ResolvedTypographyProfile 연결
- duplicate font authority 제거

---

## `verify-rendered-layout.mjs`

- text뿐 아니라 label group 단위 painted bounds
- fragment SHA / expected inventory
- fixed font identity
- math path bounds
- required label coverage

---

## `record-visual-browser-evidence.mjs`

- typography profile hash
- font asset hash
- final fragment manifest hash
- actual loaded final SVG SHA

를 evidence chain에 추가.

---

# 30. 구현 단계

## Phase 0 — Typography inventory / dependency freeze

조사:

- vendored MathJax actual entrypoints
- SVG output component 존재 여부
- vendored math font package
- license / notice
- Korean font 후보
- subset/outline tool 후보

종료:

- 실제 사용할 asset path/version/hash 결정
- “repo에 폴더가 있다”와 “production-ready component가 있다” 구분

---

## Phase 1 — Typography profile / LabelInventory

구현:

- profile schema
- role
- font/renderer identity
- inventory completeness
- semantic hashes

종료:

- 모든 label이 typeset 전에 inventory에 존재

---

## Phase 2 — MathJax SVG adapter

구현:

- AST→canonical TeX
- pinned MathJax SVG
- deterministic namespace
- self-contained fragment
- intrinsic baseline/geometry extraction

fixture:

- fraction
- radical
- nested exponent
- subscript
- prime
- Greek
- function notation
- coordinate

종료:

- same input → same fragment
- external dependency 없음

---

## Phase 3 — Korean font delivery qualification

A/B 실험:

A. subset embedding  
B. same-font outline fallback

대표:

- 한글 문장
- 숫자
- Latin
- punctuation
- mixed text

검사:

- isolated browser
- `<img>`
- actual Archive crop

종료:

- 실제 동등성 통과한 **한 경로만 production 기본**으로 선택

---

## Phase 4 — Mixed label / baseline

구현:

- LabelRun
- text+math run composition
- common baseline
- intrinsic metrics

negative:

- exponent clipping
- subscript clipping
- Korean/math vertical jump
- fraction baseline mismatch

종료:

- mixed label이 actual screenshot에서 안정적

---

## Phase 5 — Independent fragment audit

구현:

- math subtree observer
- font/glyph observer
- semantic mutation tests
- local ref resolution

종료:

producer output 변조를 독립 auditor가 검출.

---

## Phase 6 — Measurement handoff

구현:

- exact final fragment measure
- typed MeasuredLabel
- environment hash
- cache

종료:

- fragment SHA와 measurement 1:1
- approximate measurement로 publication ready 불가

---

## Phase 7 — Composer/browser integration

구현:

- final fragment 삽입
- owner metadata
- actual rendered bounds
- font floor
- missing glyph

종료:

- typography 축이 geometry/graph 모두 공통 사용 가능

---

# 31. 최소 synthetic qualification

필수 label fixture:

1. `plain-point-A`
2. `korean-short`
3. `korean-math-mixed`
4. `fraction-40-over-3`
5. `nested-fraction`
6. `sqrt-3`
7. `sqrt-fraction`
8. `power-x2`
9. `nested-power`
10. `subscript-x1`
11. `prime-double-prime`
12. `greek-theta-pi`
13. `negative-minus`
14. `coordinate-fraction`
15. `condition-box-mixed`
16. `graph-tick-pi`
17. `graph-function-label`
18. `long-korean-label`

각 fixture는:

- expected semantic
- fragment SHA
- measurement
- browser screenshot/evidence
- mutation negative

를 가진다.

추가 identity 회귀: (1) 같은 문자열/다른 owner, (2) 다른 UID의 같은 labelId, (3) 같은 asset의 두 occurrence, (4) 동일 identity의 새 attempt 재사용. owner·local ID uniqueness·exact fragment hash·measurement binding을 확인한다. 첫 owner의 cached fragment를 두 번째 owner에 그대로 주입하는 mutation은 독립 fragment/owner audit에서 실패해야 한다.

---

# 32. 실제 Archive qualification

실제 문항에서 최소 다음 typography 유형을 포함한다.

1. 점 이름 + 길이 숫자
2. 분수 좌표
3. 근호
4. 지수
5. 아래첨자 또는 prime
6. 한글+수식 혼합
7. graph tick / function label
8. 밀집 geometry label

같은 문항이 여러 축을 만족할 수 있다.

단 synthetic와 actual exam evidence를 구분한다.

---

# 33. 실제 화면 품질 gate

공통:

- base student-facing label 11 CSS px 이상
- 목표 12px 이상
- clipping 0
- missing glyph 0
- required label missing 0
- critical overlap 0
- baseline visually broken 0
- font fallback 0
- fragment/source semantic mismatch 0

---

# 34. Typography-only 내부 완료 gate

이 Detail 03의 구현 완료 상태:

`TYPOGRAPHY_CAPABILITY_QUALIFIED`

의미:

- fixed math rendering
- fixed Korean font delivery
- fragment audit
- baseline/measurement contract

가 완료됨.

하지만 후속:

- owner-aware full layout
- One-Click runner
- actual Archive final integration
- independent visual review

가 닫히지 않았다면
상위 `PUBLICATION_READY`는 아니다.

---

# 35. 완료 기준

- [ ] 수학 의미 authority는 기존 validated AST에 있다.
- [ ] 수학 label은 pinned MathJax SVG fragment를 사용한다.
- [ ] raw user TeX를 unrestricted renderer input으로 사용하지 않는다.
- [ ] final math fragment는 self-contained다.
- [ ] fraction/root/exponent/subscript/prime가 전문 조판 형태로 생성된다.
- [ ] 동일 AST/fragment identity/owner/profile/renderer는 deterministic fragment를 만든다.
- [ ] 일반 한글은 고정 Korean font bytes/version/hash를 사용한다.
- [ ] 시스템 font fallback으로 publication PASS하지 않는다.
- [ ] glyph coverage가 label inventory 기준으로 사전 확인된다.
- [ ] subset embedding 또는 outline 중 actual qualification을 통과한 하나를 production 기본 경로로 확정한다.
- [ ] mixed Korean+math가 baseline contract로 정렬된다.
- [ ] 최종 출력에 쓰는 동일 fragment를 측정한다.
- [ ] fragment SHA와 measurement가 1:1 결박된다.
- [ ] browser/font/renderer measurement environment가 hash로 고정된다.
- [ ] required label은 typeset/layout 실패로 조용히 사라지지 않는다.
- [ ] MathJax subtree는 닫힌 allowlist로 audit된다.
- [ ] producer fragment 변조를 독립 audit가 검출한다.
- [ ] actual `<img>`와 isolated replay typography 동등성을 대표 fixture에서 검증한다.
- [ ] geometry와 graph가 동일 typography infrastructure를 사용한다.
- [ ] 기존 Archive CHTML MathJax는 교체하지 않는다.
- [ ] TikZ/XeLaTeX는 production 기본 조판기로 승격하지 않는다.
- [ ] typography 완료만으로 전체 `PUBLICATION_READY`를 주장하지 않는다.

- [ ] owner-bound fragment cache key에 실제 bytes를 바꾸는 identity/owner/factRole/namespace dependency가 모두 포함된다.
- [ ] cache hit 후 owner/local ID를 재작성하지 않는다.
- [ ] 같은 값의 다중 owner/UID/occurrence가 충돌하지 않는다.

---

# 36. 이 단계에서 하지 않는 것

- Geometry Construction Kernel 변경
- Function sampling 알고리즘 변경
- owner-aware placement 전체 구현
- One-Click runner 구현
- Archive 전체 MathJax CHTML 교체
- 웹폰트 CDN 사용
- 모든 Korean font를 동시에 지원
- TeX 전체 문법 허용
- arbitrary raw SVG/MathML 입력
- TikZ를 기본 backend로 전환
- 모든 existing SVG의 일괄 migration
- production exam JS/SVG 자동 수정

---

# 37. 후속 세부계획과 인터페이스

Detail 03은 다음 artifact를 제공한다.

```text
ResolvedTypographyProfile
LabelInventory
LabelFragment
TypographyFragmentManifest
MeasuredLabel
TypographyAuditReceipt
```

### Detail 04 — Measured Layout & Publication

이 artifact를 받아:

- owner-aware position
- collision
- margin
- viewport
- framing
- leader/dimension

을 결정한다.

### Detail 05 — One-Click Runner

typeset / measure / audit / cache / repair 단계를 자동 호출한다.

### Detail 06 — Actual Archive Integration

final SVG의 실제 `<img>` rendering과 fragment/font evidence를 결박한다.

---

# 38. 최종 한 문장

> **APMath Typography & Font v1은 기존 SVG의 글꼴을 사후 수정하는 작업이 아니라, 수학 AST와 한글 텍스트를 고정된 MathJax SVG·Korean font fragment로 먼저 확정하고 그 동일 fragment를 측정·배치·감사·Archive 렌더까지 일관되게 사용하는 deterministic publication typography 계층이다.**