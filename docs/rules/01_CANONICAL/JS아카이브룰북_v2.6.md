# JS아카이브 프로젝트 룰북 (v2.6)

> **운영자**: 박준성 (마스터)  
> **저장소**: icefoxtail.github.io/AP------  
> **최종 갱신**: 2026-09-04 (v2.6 — graph generation protocol v3.0 및 print publication gate 통합)
> **역할**: GPT(계획·총괄) / Claude(검수) / Gemini(구현·데이터 변환) / 마스터(최종결정)

---

> **현재 운영 부록:** 이 룰북의 기존 기본 스키마·기출·렌더링 원칙은 유지하되, 신규 아카이브 JS의 세부단원 계약은 [`JS아카이브_세부단원_운영규칙_v1.md`](JS아카이브_세부단원_운영규칙_v1.md)를 함께 적용한다. 기존 JS의 누락 필드는 legacy 예외로만 허용하며 신규 파일의 기본값으로 복사하지 않는다. `types`·`similar` DB 카드의 source-dependent 필드 보류 기준은 아래 4-4를 따른다. 함수·좌표 그래프의 세부 style token과 sampling 정책은 [`04_VISUAL/도형추출.md`](../04_VISUAL/도형추출.md) v3.0을 따른다.

## 0. 한 줄 원칙

> **"Gemini는 검수 완료된 함수를 절대 건드리지 않는다."**

마스터의 명령은 모든 룰보다 우선이다.  
**마스터 승인 없는 자의적 판단, 자의적 수정, 자의적 배치 결정은 금지한다.**

---

## 0-1. 출력 원칙

- 룰북/지침/정책 문서 수정 시, 부분 패치보다 **붙여넣기 가능한 통합 완성본**을 우선 출력한다.
- 특별한 요청이 없는 한, “교체할 부분만”이 아니라 **최종 반영된 전체 섹션 또는 전체 문서** 형태로 제공한다.
- 단계별 수정 지시가 필요하더라도, 최종 제출 단계에서는 반드시 **한 번에 적용 가능한 완성본**으로 정리한다.
- 전체 수정본 요청 시 일부 예시, 후반 생략, 중간 생략, 대표 부분만 발췌 출력하는 것을 금지한다.
- 전체 출력은 항상 **복사 후 즉시 교체 가능한 완성본**이어야 한다.

---

## 0-2. 운영 기준

- **JS 문항 객체의 기본 스키마 필드는 `id`, `level`, `category`, `originalCategory`, `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder`, `questionType`, `layoutTag`, `tags`, `wide`, `content`, `choices`, `answer`, `solution`으로 고정한다.**
- **`image`는 PNG 자산이 필요한 문항에서만 사용하는 선택 필드이다.**
- **`questionType`, `layoutTag`, `tags`, `wide`는 선택 필드가 아니라 기본 스키마 필드다. 다만 값이 확정되지 않으면 정해진 기본값 또는 빈값으로 둘 수 있다.**
- **기본값은 `questionType: ""`, `layoutTag: "grid"`, `tags: []`, `wide: false`이다.**
- **문항 유형(questionType)과 배치 태그(layoutTag)는 분리한다.**
- **`questionType`은 문항 성격 분류용이며, 알 수 있으면 `"객관식"`, `"단답형"`, `"서술형"`을 사용하고 판단 불가 시 `""`로 둔다.**
- **`layoutTag`는 마스터 명시 지시 전용 배치 필드다. AI는 임의로 생성, 변경, 추정, 보정할 수 없다.**
- **특수배치(B2/B4/fullwidth)는 `choices.length`, 문항 유형, 문항 길이, 도형 유무, tags, 기존 데이터 패턴으로 판단하지 않는다.**
- **특수배치는 마스터가 해당 문항 또는 해당 파일에 대해 명시적으로 지시한 경우에만 적용한다.**
- **마스터 지시 없는 모든 문항은 서술형이라도 `layoutTag: "grid"`로 둔다.**
- **AI는 기존 데이터에 `subjective-2up`, `subjective-4up`, `fullwidth`가 있었다는 이유로 다른 문항에 확대 적용할 수 없다.**
- **`wide: true` 역시 마스터 명시 지시 전용이다. AI 자동판정은 금지한다.**
- **마스터 지시 없는 모든 문항은 `wide: false`로 둔다.**
- **`tags`는 검수, 검색, 분류, 누락 탐지용이며 자동 배치 기준으로 사용하지 않는다.**
- **서술형 문항은 `tags`에 `"서술형"`을 포함할 수 있다. 단, 이 태그만으로 layoutTag를 바꾸지 않는다.**
- **도형/SVG/기하 그림/좌표 그림이 필요한 문항은 `tags`에 `"도형"`을 포함한다.**
- **함수 그래프/좌표평면 그래프/곡선 그래프가 필요한 문항은 `tags`에 `"그래프"`를 포함한다.**
- **HTML table/수표/로그표/제곱근표/조건표가 필요한 문항은 `tags`에 `"표"`를 포함한다.**
- **공통자료가 여러 문항에 걸쳐 사용되는 경우 `tags`에 `"공통자료"`를 포함할 수 있다.**
- **`image` 필드가 있어도 시각요소 판별용 `tags`는 생략하지 않는다.**
- **`content` 내부 SVG/img/table이 있어도 시각요소 판별용 `tags`는 생략하지 않는다.**
- **시각요소가 있는데 해당 `tags`가 비어 있으면 최종 검수에서 WARN 처리한다.**
- **시각요소가 필요한데 `image`, SVG, table, 마커가 모두 없으면 FAIL 또는 중대 WARN 처리한다.**
- **객관식 번호(①~⑤)는 엔진 렌더링 기준으로 처리한다.**
- **choices 데이터는 번호 없는 순수 보기 텍스트를 기본 원칙으로 한다.**
- **엔진은 번호 중복 방지 로직을 포함할 수 있으며, 데이터에 앞번호가 있어도 최종 출력에서 중복되지 않아야 한다.**
- **문장형 보기의 가독성은 엔진이 책임지며, 선택지끼리 이어붙는 출력은 금지한다.**
- **복잡한 그래프/GeoGebra 그래프는 SVG 대신 PNG 사용을 허용한다.**
- **모든 그림/표/이미지는 발문 바로 아래에 배치한다.**
- **서술형 내부 소문항 `(1)`, `(2)`, `(3)`은 각 번호가 독립 줄에서 시작해야 하며, inline처럼 이어붙는 출력은 금지한다.**
- **이미지 자산은 `exams/`와 분리된 `assets/images/`에서 관리한다.**
- **고2 이상 문항의 이미지 자산은 과목명까지 포함된 시험지명 기준으로 분리 관리한다.**
- **현재 단계부터 PNG 이미지 자산은 `image` 선택 필드 우선 구조로 관리한다.**
- **PNG 자산이 준비된 신규 데이터는 `content` 내부 `<img>`보다 `image` 필드를 우선 사용한다.**
- **`content`에는 발문 텍스트를 두고, 그림/도형/그래프/PNG 자산은 가능한 한 `image` 필드로 분리한다.**
- **기존 자료 호환 또는 이미 `content` 내부 SVG/img/table/`<img>`로 안정화된 구형 데이터는 그대로 유지할 수 있다.**
- **기존 `content` 내부 SVG/img/table이 있다고 해서 자동으로 `image` 필드로 분리하지 않는다.**
- **`image` 필드와 `content` 내부 `<img>`를 동시에 사용하는 것은 원칙적으로 지양한다.**

## 0-2-2. 그래프 출판품질 상위 원칙

- 함수·좌표 그래프 신규 생성 또는 수정은 최신 [`04_VISUAL/도형추출.md`](../04_VISUAL/도형추출.md)
  표·도형·그래프 생성 프로토콜을 따른다.
- 신규 또는 수정된 그래프는 수학적 무결성뿐 아니라 `GRAPH_PRINT_PUBLICATION_GATE`를
  통과해야 한다.
- 세부 그래프 style token, typography, sampling·adaptive refinement 정책의 canonical source는
  최신 VISUAL 프로토콜 하나로 통일한다. 룰북·pipeline·review 문서에는 세부 수치를 복제하지
  않고 해당 문서를 참조한다.
- 그래프가 있는 최종 visual PASS는 다음 composite 조건을 모두 만족해야 한다.

```text
GRAPH_MATH_PASS
AND GRAPH_SEMANTIC_PASS
AND GRAPH_STYLE_LINT_PASS
AND GRAPH_PRINT_PUBLICATION_PASS
AND GRAPH_RENDER_PASS
```

- 이번 규칙 업그레이드는 기존 production JS/SVG/PNG의 일괄 migration을 의미하지 않는다.
  규칙 확정 → 외부 독립검수 → 30개 대표 그래프 Pilot → style token freeze → production
  migration 순서를 지킨다.

---


## 0-2-1. 유사문제·기출 변환용 확장 메타데이터 운영 기준

본 항목은 기존 JS 문항 객체의 기본 스키마를 바꾸기 위한 규칙이 아니다.  
기존 기본 스키마(`id`, `level`, `category`, `originalCategory`, `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder`, `questionType`, `layoutTag`, `tags`, `wide`, `content`, `choices`, `answer`, `solution`)는 그대로 유지한다.

### 확장 메타데이터의 목적

확장 메타데이터는 아래 목적에 한해 사용한다.

- 기존 JS 문항의 검색·분류 정확도 향상
- 유사문제 추천
- 자동 시험지 구성 시 중복 유형 방지
- 기출 PDF 변환 결과의 검수 상태 추적
- 정답/해설/이미지 자산의 누락 및 검수 상태 추적

### 확장 메타데이터 필드

아래 필드는 기존 legacy JS에서는 선택 확장 필드였지만, **신규 candidate·production JS에서는 세부단원 4개 필드를 필수로 승격**한다. 나머지 유사문제 확장 필드는 승인된 경우에만 추가한다.

```js
{
  subUnitKey: "",
  subUnit: "",
  subUnitConfidence: "",
  subUnitClassificationDepth: "",
  conceptClusterKey: "",
  problemTypeKey: "",
  templateKey: "",
  difficultyBucket: "",
  tagConfidence: "",
  tagStatus: "",
  sourceType: "",
  imageStatus: "",
  answerStatus: "",
  solutionStatus: "",
  reviewStatus: ""
}
```

신규 파일의 `subUnitKey`는 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`와 compiled JSON master에 존재해야 하며, `subUnit`·parent `standardUnitKey`와 일치해야 한다. `standardUnitKey`는 canonical standard-unit table 키 또는 taxonomy 확장표·compiled master에 부모로 문서화된 extension 키만 허용한다. `RAW-*`, `RRAW-*`, `UNMAPPED-*`는 정식 키가 아니라 예외 report에서만 유지한다.

### 기본 필드와 확장 필드의 관계

- `standardUnitKey`는 기존 단원 필터와 교육과정 매핑의 기준이다.
- canonical `standardUnitKey`는 master의 `standardUnit`·`standardUnitOrder`를 그대로 사용한다. extension parent 키는 compiled subunit parent가 일치할 때만 사용하며, 세부단원 라벨과 parent 관계를 검증 대상으로 삼는다.
- `subUnitKey`는 중등 대단원 또는 고등 중단원 내부를 더 잘게 나누기 위한 세부 단원 키다.
- `conceptClusterKey`는 같은 개념 묶음이다.
- `problemTypeKey`는 같은 문제 유형을 뜻한다.
- `templateKey`는 거의 같은 풀이 구조 또는 출제 패턴을 뜻한다.
- `difficultyBucket`은 `level`을 대체하지 않고, 자동 추천·자동 출제용 보조 난이도 구간으로만 사용한다.
- `tagConfidence`와 `tagStatus`는 자동 태깅 결과의 신뢰도와 검수 상태를 표시한다.

### 자동 태깅 허용 범위

기존 JS 파일에 대해 자동 태깅을 수행할 때는 다음 범위만 허용한다.

- 문항 원문(`content`) 수정 금지
- 보기(`choices`) 수정 금지
- 정답(`answer`) 수정 금지
- 해설(`solution`) 수정 금지
- 이미지(`image`) 경로 수정 금지
- `layoutTag`, `wide` 자동 변경 금지
- 확장 메타데이터 후보 생성 및 검수 리포트 생성 허용
- 마스터 승인 또는 명시된 태그 고도화 작업 범위 안에서만 확장 메타데이터 반영 허용

### 자동 태깅 상태값

```text
tagStatus:
- existing
- auto_high
- auto_medium
- auto_low
- manual_review
- reviewed_pass
- reviewed_fail
```

운영 원칙:

- `auto_high`는 자동 반영 후보가 될 수 있다.
- `auto_medium`은 검수 우선 후보로 둔다.
- `auto_low`와 `manual_review`는 유사문제 추천과 자동 시험지 구성에 사용하지 않는다.
- `reviewed_pass`만 최종 확정 태그로 본다.
- `reviewed_fail`은 같은 기준으로 재사용하지 않는다.

### 유사문제 추천 기준

유사문제 추천에서 `standardUnitKey`만 같은 문항은 “같은 단원 문제”일 뿐, 유사문제로 보지 않는다.

유사문제 판정 우선순위:

1. 같은 `templateKey`
2. 같은 `problemTypeKey`
3. 같은 `conceptClusterKey`
4. 같은 `subUnitKey`
5. 같은 `standardUnitKey`

운영 기준:

- 유사문제 1순위: `templateKey`가 같고 `sourceFile` 또는 출처가 다른 문항
- 유사문제 2순위: `problemTypeKey`와 `conceptClusterKey`가 같고 난이도 차이가 크지 않은 문항
- 보충문제: `conceptClusterKey` 또는 `subUnitKey`가 같은 문항
- 같은 `standardUnitKey`만 같은 문항은 유사문제라 하지 않고 단원 보충 후보로만 사용한다.

### 자동 시험지 구성 기준

자동 시험지 구성에서는 같은 `templateKey` 문항이 과도하게 반복되지 않도록 한다.

- 같은 `templateKey` 연속 출제 방지
- 같은 `problemTypeKey` 과다 출제 방지
- 같은 학교/파일/source 과다 출제 방지
- 같은 문항 또는 거의 같은 문항 중복 출제 방지
- `auto_low`, `manual_review`, `reviewed_fail` 태그 문항은 자동 구성에서 제외

### 확장 태그 마스터테이블 우선 원칙

`subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth`, `conceptClusterKey`, `problemTypeKey`, `templateKey`는 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`와 `JS아카이브_세부단원_운영규칙_v1.md`를 기준으로 한다.

- 룰북은 운영 원칙을 정의한다.
- 실제 키 명명, 세부 단원, 유형, 템플릿 기준은 마스터 테이블을 따른다.
- 룰북과 마스터 테이블이 충돌할 경우, 키 명명과 단원/유형 정의는 마스터 테이블을 우선한다.
- 마스터 테이블에 없는 키를 자동 생성해 최종 반영하지 않는다.
- 신규 키가 필요하면 `PROPOSED-` 또는 `manual_review` 상태로 분리한 뒤 마스터 테이블에 먼저 편입한다.


## 0-3. 문서 체계

프로젝트 운영 문서는 아래 4종을 기본으로 한다.

1. **룰북** — 최상위 운영 기준
2. **최종 검수 프로토콜** — 검수 전용
3. **원본 추출 프로토콜** — 시험지 이미지/PDF 추출 전용
4. **표·도형·그래프 생성 프로토콜** — Python 기반 SVG/표 생성 전용

별도 수정 실행 문서는 필수로 두지 않으며, 수정 원칙은 본 룰북 내부에서 관리한다.

---

## 1. 파일 구조 & 역할

| 파일 | 역할 | 주의 |
|------|------|------|
| `index.html` | 대문. 카드 목록, 검색/필터, 학년 탭 | UI 전용, DB 쓰기 없음 |
| `engine.html` | 렌더 엔진. 시험지/해설지/정답표 3모드 출력 | **성역 함수 포함** |
| `mixer.html` | 믹서. 문항 선택·카트·자동출제 | localStorage + sessionStorage 이중 저장 |
| `mixed_engine.html` | 믹서 전용 출력 엔진 | engine.html 구조 거의 동일 |
| `db.js` | `window.mainDB` — 카드 메타데이터 | 파일명·grade·contentType 필드 엄수 |
| `exams/*.js` | `window.questionBank` — 문항뱅크 | 데이터 규칙 3장 엄수 |
| `assets/images/*` | PNG 그래프/도형 이미지 자산 | 복잡한 그래프, GeoGebra 그래프, PNG 삽입 문항 전용 |

---

## 2. engine.html 아키텍처

### 2-1. URL 파라미터

| 파라미터 | 값 예시 | 설명 |
|----------|---------|------|
| `mode` | `exam` / `sol` / `ans` | 렌더 모드 |
| `qpp` | `4` / `6` | 페이지당 문항 수 |
| `data` | `exams/filename.js` | JS 파일 URL |
| `title` | `YY_학교_N학기_시험종류_학년_과목` | 헤더 생성용 파일명 형식 |

### 2-2. 성역 함수 및 성역 구조 (Gemini 수정 금지)

아래 항목들은 검수 완료 상태이며, **어떠한 이유로도 Gemini가 수정할 수 없다.**

| 함수/구조 | 역할 | 금지 이유 |
|----------|------|----------|
| `wrapLatex(text)` | LaTeX 전처리 (수식 보호·자동 래핑) | 복잡한 분기 로직, 오작동 시 전체 렌더 파괴 |
| MathJax 호출 순서 | staging → typesetPromise → raf → fit | 타이밍 어긋나면 레이아웃 무너짐 |
| staging 구조 | `position:absolute; top:-9999px; width:83mm` | 치수 기반 overflow 감지 전제 |
| `renderAns(area, data)` | 정답표 50문항/페이지 출력 | 동기 렌더, 구조 꼬이면 전체 출력 불안정 |
| `autoCompress(container)` | overflow 시 축소 압축 | 누적 튜닝값 손상 시 렌더 전체 파괴 |
| `fitQuestionBox(box)` | 4단계 문항 박스 맞춤 | overflow 처리 핵심 로직 |
| `renderSol(area, data)` | 해설지 좌/우열 이동 및 페이지 이동 | 승인 없는 구조 변경 금지 |

### 2-3. 핵심 함수 요약

```text
wrapLatex(text)
  └─ \(...\) → $...$  /  \[...\] → $$...$$
  └─ combPat: {}_xC_y / H / P → $_{x}C_{y}$ (단, 이미 $...$ 안은 건드리지 않음)
  └─ HTML 태그 토큰화 보호 (svg/img/br/div/span/b/i/strong/em/u/sup/sub/table/thead/tbody/tr/th/td/colgroup/col)
  └─ $...$ 밖의 <, > → &lt;, &gt;
  └─ $...$ 밖의 \command → $...$ 자동 래핑
  └─ \{...\} 집합 표기 → $...$ 래핑
  └─ \begin{cases|aligned|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix} (한국어 없으면) → $$...$$
  └─ \\n(?![a-zA-Z]) → <br>, 실제 개행 → <br>

autoCompress(container)
  └─ scrollHeight > clientHeight+1 이면
  └─ fontSize 9.5pt → 6.5pt (0.3pt씩)
  └─ lineHeight 1.58 → 1.0 (0.08씩)

fitQuestionBox(box)
  └─ 4단계: '' → fit-tight → fit-tighter → fit-micro
  └─ 여전히 overflow면 choices lineHeight / marginTop 강제 축소

parseExamTitle(raw)
  └─ "YY_학교_N학기_시험종류_학년_과목" 파싱
  └─ 반환: { year, school, semester, examType, grade, subject }

renderExam(area, data) [async]
  └─ staging → MathJax → fitQuestionBox → autoCompress
  └─ Stage E 기준 A/B2/B4/C 그룹 분리 렌더
  └─ page-wide shared grid 방식이 아니라 block 단위 stacked grid 구조
  └─ 각 chunk마다 독립적인 grid-container를 생성하여 page.body에 세로 적층
  └─ block gap은 bucket 계산과 실제 margin-bottom이 일치해야 함
  └─ overflow 검사는 q-box / block 내부 column / page.body 3축 기준
  └─ choices 번호는 엔진에서 출력하며, 필요 시 중복 방지 strip 방어를 적용할 수 있음

renderSol(area, data) [async]
  └─ overflow 감지 → autoCompress → 컬럼/페이지 이동
  └─ 이동 순서: 같은 페이지 좌열 → 우열 → 새 페이지 좌열
  └─ 시험지 배치 수정 때문에 DOM 구조를 임의 변경하지 않음

renderAns(area, data) [동기] ← 성역
  └─ 50문항/페이지
  └─ 2열 지그재그 배치
````

### 2-4. 인쇄 CSS 핵심 규칙

```css
@media print {
  body { margin:0 !important; padding:0 !important; padding-top:0 !important; }
  #print-area { display:block !important; padding:0 !important; gap:0 !important; }
  .page { height:296.5mm; overflow:hidden; page-break-after:always; }
  .page:last-child { page-break-after:avoid; }
  #staging { display:none; }
}
```

* `height: 296.5mm` — 297mm에서 0.5mm 줄인 값. 브라우저 렌더 오차 보정
* `overflow:hidden` + `page-break-after:always` — 잘림 방지를 CSS에 의존
* staging은 인쇄 시 반드시 숨김

---

## 3. JS 문항뱅크 데이터 규칙

### 3-1. 파일 헤더

```js
window.examTitle = "YY_학교_N학기_시험종류_학년_과목";
// 예: "25_순천여고_1학기_중간_고2_대수"
```

### 3-2. 문항 객체 구조

```js
{
  id: 1,
  level: "중",               // 허용값: "하" | "중" | "상" (3단계 고정)
  category: "단원명",
  originalCategory: "원본단원명",
  standardCourse: "대수",
  standardUnitKey: "H22-A-01",
  standardUnit: "지수와 로그",
  standardUnitOrder: 1,

  questionType: "객관식",
  layoutTag: "grid",
  tags: [],
  wide: false,

  content: "발문 텍스트",
  image: "assets/images/시험지전체명/q1.png", // 선택 필드, PNG 자산 없으면 생략
  choices: ["보기1", "보기2", "보기3", "보기4", "보기5"],
  answer: "③",
  solution: "문제 조건을 식으로 정리한다.\n필요한 계산을 전개한다.\n따라서 정답은 ③이다.",
  subUnitKey: "H22-A-01-EXPONENT_LOG",
  subUnit: "지수와 로그",
  subUnitConfidence: "category_or_cue_inferred",
  subUnitClassificationDepth: "complete_category"
}
```

`questionType`, `layoutTag`, `tags`, `wide`는 기본 스키마 필드이므로 최종 JS 객체에 유지한다.
값이 확정되지 않으면 `questionType: ""`, `layoutTag: "grid"`, `tags: []`, `wide: false`를 사용한다.
`layoutTag`와 `wide:true`는 마스터 명시 지시가 있을 때만 특수값을 사용한다.
`image`는 선택 필드이다. 이미지가 없는 문항에는 생략할 수 있다.
이미지가 필요한 문항에서 PNG 자산이 준비된 경우 신규 데이터는 `image` 필드 사용을 우선한다.
`image` 필드는 문자열 경로 1개를 기본으로 하며, 복수 이미지가 필요한 특수 문항은 마스터 승인 후 별도 구조를 정한다.


### 3-3. 수식 작성 규칙

| 규칙                         | 올바른 예              | 틀린 예         |
| -------------------------- | ------------------ | ------------ |
| 수식은 `$...$`로 감싸기           | `$x^2 + 1$`        | `x^2 + 1`    |
| 줄바꿈은 `\\n`                 | `"1단계\\n2단계"`      | `"1단계\n2단계"` |
| `$...$`는 `\\n` 기준 각 줄마다 닫기 | `"$a$\\n$b$"`      | `"$a\\nb$"`  |
| `\\n`으로 시작하는 명령어           | `$\\notin A$`      | `\notin A`   |
| 집합 표기                      | `$\\{x \| x>0\\}$` | `{x\|x>0}`   |
| choices 부등호                | `\\lt`, `\\gt`     | `<`, `>`     |
| `\text{}` 한국어 금지           | 평문으로 적기            | `\text{이상}`  |
| 조합 기호                      | `${}_{n}C_{r}$`    | `{}_nC_r`    |
| 주관식 answer 수식              | `"$\\dfrac{1}{2}$"` | `"1/2"`      |
| solution 시작                | 조건 해석 자연문       | 운영 메모 또는 정답 직행 |
| **분수 표현 (최상위)**            | `$\\dfrac{a}{b}$`  | `$\\frac{a}{b}$` |
| **분수 표현 (지수/아래첨자 내부)**     | `$e^{\frac{1}{2}}$` | `$e^{\dfrac{1}{2}}$` |

> **`\dfrac` 예외 규칙**: 지수(`^{...}`) 또는 아래첨자(`_{...}`) 내부에 들어가는 분수는 `\frac`을 그대로 사용한다.  
> `\dfrac`은 최상위(inline 본문 수준) 분수에만 적용한다.  
> 예: `$\log_2 \dfrac{1}{8}$` ← 최상위 분수 → `\dfrac` 적용  
> 예: `$e^{\frac{x}{2}}$` ← 지수 내부 분수 → `\frac` 유지

### 3-4. choices 형식

* **객관식 기본 원칙**: `["보기1", "보기2", "보기3", "보기4", "보기5"]`
* **객관식 수식 포함 예시**: `["$x=1$", "$x=2$", "$x=3$", "$x=4$", "$x=5$"]`
* **주관식**: `[]`

추가 운영 규칙:

* choices 내부에 `①`, `②`, `③`, `④`, `⑤`를 직접 넣지 않는 것을 기본 원칙으로 한다.
* 기존 데이터에 앞번호가 남아 있는 경우 엔진의 중복 방지 로직으로 흡수할 수 있으나, 신규 데이터 작성 시에는 번호 없는 텍스트를 사용한다.
* 번호 표시는 엔진이 담당한다.
* **문장형 선택지(`가, 나, 다, 라`, `a, b, c, d`, 긴 서술형 보기)는 선택지끼리 한 줄로 이어붙지 않아야 한다.**
* **선택지 하나는 하나의 블록 단위로 처리하며, 선택지와 선택지 사이의 시각적 분리가 보장되어야 한다.**
* **보기 내부 수식이 길더라도 번호-본문 정렬이 무너지지 않아야 한다.**
* **선택지 줄바꿈은 선택지 내부 의미 단위에서만 허용하며, 선택지끼리 붙는 출력은 금지한다.**

### 3-4-1. 복수정답 answer 운영 기준

복수정답은 문항 오류로 단정하지 않고, 실제 수학적 성립 여부와 `answer`·`solution`의 일치 여부를 기준으로 판정한다.

#### 기본 원칙

* 객관식 문항이라도 수학적으로 보기 2개 이상이 정답이면 복수정답을 인정할 수 있다.
* `answer`에는 복수정답을 쉼표로 구분하여 표기한다.
* 표준 표기는 `"①,⑤"` 또는 `"①, ⑤"` 형태를 허용한다.
* 다만 신규 작성·수정 시에는 가독성을 위해 `"①, ⑤"`를 우선한다.
* 복수정답 문항은 `solution`에서 각 정답 보기가 왜 성립하는지 모두 설명해야 한다.
* `answer`의 복수정답과 `solution`의 결론이 일치하면 정답·해설 오류로 보지 않는다.

#### 검수 판정 기준

* 수학적으로 복수정답이 성립하고 `answer`와 `solution`이 이를 명시하면 **PASS 또는 복수정답 인정 문항**으로 판정한다.
* 발문이 “고르면?”처럼 단일 선택 표현이어도, 실제 원문 또는 현 데이터에서 복수정답이 성립하면 즉시 FAIL로 처리하지 않는다.
* 이 경우 최종 보고에는 `정오답 오류 아님 / 복수정답 인정 문항`으로 적는다.
* 단, `answer`가 단일정답인데 수학적으로 복수정답이면 **정답 누락 오류**로 본다.
* `answer`가 복수정답인데 실제로는 한 보기만 정답이면 **정답 과다 오류**로 본다.
* `answer`와 `solution`의 복수정답 목록이 다르면 **정답·해설 불일치**로 본다.

#### 엔진·정답표 호환 기준

* 복수정답 자체는 문항 오류가 아니지만, 엔진/정답표/채점 로직이 복수정답을 정상 표시·처리하지 못하면 별도 호환 이슈로 보고한다.
* 정답표에서 `①, ⑤`가 깨지거나 일부만 표시되면 데이터 오류가 아니라 렌더링/정답표 처리 오류로 분리한다.
* 채점 로직이 복수정답을 단일 문자열로만 비교하여 정상 채점하지 못하면 채점 엔진 보완 대상으로 분리한다.
* 복수정답을 단일정답으로 강제하기 위해 발문·보기·정답을 임의 수정하지 않는다.
* 단일정답으로 고쳐야 하는 경우에는 마스터가 명시적으로 승인한 뒤, 수학적으로 한 보기만 정답이 되도록 `choices` 또는 발문을 최소 수정한다.

#### 보고 문구 표준

```text
○번 — 복수정답 인정 문항
- 수학적으로 정답: ①, ⑤
- 현재 answer: ①, ⑤
- 해설 결론과 일치
- 정오답 오류 아님
- 단, 정답표/채점 엔진의 복수정답 표시·처리 여부만 확인 필요
```

### 3-5. 보기(choices) 출력 규칙

* 보기 표시 방식은 **객관식 여부 자체가 아니라 실제 보기 형식과 가독성 필요 기준**으로 정한다.
* 문장형 보기, 가/나/다/라형 보기, a/b/c/d형 긴 보기, 긴 설명+수식 혼합 보기처럼 **선택지끼리 시각적 분리가 필요한 경우** 박스 또는 이에 준하는 블록 구조를 사용한다.
* 짧은 수식형 보기까지 일률적으로 같은 박스를 강제하지 않는다.
* 같은 형식의 보기인데 어떤 문항은 블록 분리/박스가 있고 어떤 문항은 없는 상태를 허용하지 않는다.
* 엔진은 choices를 **전용 wrapper/selector 기준**으로 처리해야 하며, 범용 `div` 렌더링에 의존하지 않는다.
* 선택지 하나는 **독립 블록**으로 인식되도록 spacing, line-height, indent를 유지한다.
* 문장형 선택지는 번호 바로 뒤에 빽빽하게 붙는 inline 처리 금지다.
* 선택지 수식이 두 줄 이상으로 넘어가더라도 번호가 따로 떠 보이지 않도록 정렬해야 한다.
* 긴 보기의 줄바꿈 시 **hanging indent** 또는 이에 준하는 정렬 안정성을 보장한다.
* AI는 보기 길이나 모양만 보고 박스 유무를 자의적으로 바꾸지 않고, 마스터 또는 엔진 정책 기준을 따른다.

### 3-6. 서술형 내부 소문항 구조 규칙

* 서술형 문항 안에 `(1)`, `(2)`, `(3)` 같은 내부 소문항이 있는 경우, **각 소문항 번호는 독립 줄에서 시작**해야 한다.
* 서술형 내부 소문항을 한 문장처럼 inline으로 이어붙이는 출력은 금지한다.
* 서술형3 유형처럼 한 문항 안에 여러 단계 질문이 있는 경우, **단계 구조가 한눈에 보이도록 줄바꿈 또는 블록 분리**를 유지한다.
* 소문항 번호 뒤 본문이 길어질 경우, 번호와 본문 정렬이 무너지지 않도록 들여쓰기 기준을 유지한다.
* AI는 서술형 내부 소문항의 줄바꿈을 임의로 제거하거나 소문항을 합쳐 쓸 수 없다.

### 3-7. 이미지 삽입 규칙 (PNG 포함)

* 그림/그래프/도형은 반드시 **발문 바로 아래**에 출력되어야 한다.
* 복잡한 그래프, GeoGebra 그래프, 긴 SVG 그래프는 **PNG 사용을 허용**한다.
* 신규 데이터에서 PNG 자산이 준비된 경우, 이미지는 `content` 내부 `<img>`보다 `image` 선택 필드로 분리하는 것을 우선한다.
* `content`에는 발문 텍스트를 둔다.
* `image` 필드에는 PNG 자산 경로를 문자열로 기록한다.
* 이미지 자산은 `assets/images/` 폴더에 저장한다.
* 이미지 자산은 `exams/`와 분리하여 관리한다.
* 이미지 폴더는 **시험지 전체명 기준**으로 분리 관리한다.
* 고2 이상 문항의 이미지 자산은 **과목명까지 포함된 시험지 전체명** 기준으로 분리 관리한다.
* 이미지 파일명은 문항번호 기반 **`q{id}.png`** 형식을 권장한다.

기본 구조:

```text
assets/images/시험지전체명/q{id}.png
```

예시:

```text
assets/images/25_순천여고_1학기_중간_고2_대수/q20.png
assets/images/25_순천여고_1학기_중간_고2_대수/q21.png
assets/images/25_순천여고_1학기_중간_고2_미적분/q08.png
assets/images/25_순천여고_1학기_중간_고2_확률과통계/q03.png
```

신규 데이터 권장 구조:

```js
{
  id: 20,
  content: "그림과 같이 ...",
  image: "assets/images/25_순천여고_1학기_중간_고2_대수/q20.png",
  tags: ["도형"],
  choices: [...],
  answer: "③",
  solution: "..."
}
```

기존 호환 구조:

```js
content: "그림과 같이 ...<br><img src=\"assets/images/시험지전체명/q20.png\" style=\"display:block; width:240px; margin:10px auto;\">"
```

* 기존 자료에서 `content` 내부 SVG, `<img>`, HTML table을 이미 사용 중인 경우 그대로 유지할 수 있다.
* 기존 `content` 내부 SVG/img/table이 있다고 해서 자동으로 `image` 필드로 분리하지 않는다.
* `image` 필드와 `tags`는 역할이 다르다.

  * `image`: 실제 PNG 자산 경로
  * `tags`: 문항의 시각요소 존재 여부와 검수/분류용 표시

* 시각요소가 필요한 문항은 반드시 `tags`에 해당 태그를 유지하거나 부여한다.
* 도형/SVG/기하 그림/좌표 그림이 필요한 문항은 `tags`에 `"도형"`을 포함한다.
* 함수 그래프/좌표평면 그래프/곡선 그래프가 필요한 문항은 `tags`에 `"그래프"`를 포함한다.
* HTML table/수표/로그표/제곱근표/조건표가 필요한 문항은 `tags`에 `"표"`를 포함한다.
* 공통자료가 여러 문항에 걸쳐 사용되는 경우 `tags`에 `"공통자료"`를 포함할 수 있다.
* `image` 필드가 있어도 `tags`의 `"도형"`, `"그래프"`, `"표"` 태그는 생략하지 않는다.
* `content` 내부 SVG가 있어도 `tags`의 `"도형"` 또는 `"그래프"` 태그는 생략하지 않는다.
* `content` 내부 HTML table이 있어도 `tags`의 `"표"` 태그는 생략하지 않는다.
* `tags`는 배치 기준이 아니다.
* `tags`만 보고 `layoutTag`나 `wide`를 자동 변경하지 않는다.
* `tags`는 검수, 검색, 분류, 누락 탐지용이다.
* 도형/그래프/표가 있는데 `tags`가 비어 있으면 최종 검수에서 WARN 처리한다.
* 도형/그래프/표가 필요한데 `image`, SVG, table, 마커가 모두 없으면 FAIL 또는 중대 WARN 처리한다.
* 기존 자료에서 `content` 내부 `<img>`를 이미 사용 중인 경우 그대로 유지할 수 있다.
* 신규 생성·신규 정리본에서는 `image` 필드 우선 구조를 적용한다.
* `image` 필드와 `content` 내부 `<img>`를 동시에 넣는 것은 원칙적으로 금지한다.
* 단, 구형 엔진 호환 테스트 또는 임시 렌더 검증 목적일 때만 예외적으로 허용한다.
* 기본 출력 width 표준값은 엔진 CSS 또는 렌더러에서 관리한다.
* 개별 PNG 크기 조정이 필요한 경우 엔진에서 image 렌더링 width 정책을 적용한다.
* 지나치게 큰 PNG를 넣고 엔진에서 width만 과도하게 줄이는 방식은 지양한다.
* PNG는 사용 전 다음을 정리해야 한다.

  * 불필요한 격자 제거
  * 불필요한 축 숫자 제거
  * Export 라벨 제거
  * 과도한 여백 제거
  * 문제와 무관한 보조 객체 제거
* 단순 기하도형/간단 좌표도형은 SVG 유지가 가능하나, 복잡한 그래프는 PNG를 우선 검토한다.
* 이미지도 발문 바로 아래에 출력되어야 하며, 보기 아래나 해설 아래로 내려가면 안 된다.
* **`exams/*.js`와 `assets/images/*`는 세트로 관리한다.** JS만 올리고 PNG를 누락한 상태는 엔진 통과와 별개로 무결성 실패로 본다.


### 3-8. 발문-이미지-보기 순서 규칙

문항의 기본 출력 순서는 아래와 같이 고정한다.

1. 발문
2. 그림/그래프/도형/표
3. 보기
4. 정답/해설

`image` 필드가 있는 문항의 실제 렌더링 순서는 아래와 같이 고정한다.

1. `content` 발문
2. `image` 필드 이미지 또는 `content` 내부 시각요소
3. `choices` 보기
4. `answer` / `solution`

추가 운영 규칙:

* 그림, 표, SVG, PNG, HTML table 모두 **발문 바로 아래**에 둔다.
* `image` 필드가 있는 문항은 엔진이 `content` 렌더링 직후 이미지를 렌더링해야 한다.
* 엔진은 `image` 필드 이미지를 보기보다 먼저 출력해야 하며, `image`가 보기 아래로 내려가면 룰북 위반이다.
* 발문과 이미지 사이에 불필요한 `<br>` 연속 삽입을 금지한다.
* 이미지와 보기 사이에 의미 없는 빈 줄을 과도하게 넣지 않는다.
* 문항 내용 요소의 순서를 AI가 자의적으로 재배치하지 않는다.
* `image` 필드와 `content` 내부 `<img>`가 동시에 존재하면 중복 출력 위험이 있으므로 검수 단계에서 WARN 처리한다.
* `image`, SVG, PNG, HTML table이 출력되는 문항은 해당 시각요소 `tags`를 함께 유지해야 한다.
* `tags`가 있다는 이유만으로 출력 순서나 배치를 바꾸지 않는다.


### 3-8-1. 발문-시각요소 간 줄바꿈 규칙

- 발문 바로 아래에 오는 표, 조건박스(note-box), SVG, PNG, HTML table, 기타 시각요소 앞에는 **기본적으로 `<br>` 1줄만 허용**한다.
- 발문 끝과 시각요소 시작 사이에 `<br><br>` 이상이 연속으로 들어가 과도한 세로 공백이 생기는 것을 금지한다.
- 표, 조건박스, 이미지, 그래프, 도형은 발문과 **가깝게 붙어 있는 것을 원칙**으로 한다.
- 발문과 시각요소 사이의 공백은 CSS margin으로 미세 조정할 수 있으나, 데이터(content) 안에서 `<br>`를 여러 줄 중첩하여 여백을 만드는 방식은 금지한다.
- 시각요소 뒤에서 보기로 넘어갈 때도 불필요한 `<br><br>` 연속 삽입을 금지한다.
- 특별한 디자인 사유가 없는 한, 발문 → 시각요소 / 시각요소 → 보기 구간의 줄바꿈은 각각 1줄 이내를 기본 원칙으로 한다.
- AI는 표나 조건박스를 삽입하거나 정리할 때 기존 연속 `<br>`를 그대로 방치하지 말고, 엔진 렌더상 과도한 여백을 만들 경우 1줄 기준으로 정리해야 한다.

### 3-9. solution 형식

```text
[키포인트] 이 문제의 핵심 개념 한 줄
1단계: ...
2단계: ...
따라서 정답은 ③이다.
```

**작성 기준:**

* 신규 v2.1 solution은 `[키포인트]` 라벨을 강제하지 않고, 문제 조건 해석과 필요한 식 전개가 자연스럽게 이어지도록 작성한다.
* 단계별 풀이는 각 단계에서 **무엇을 구했는지 근거**를 명시한다. 계산 결과만 나열하지 않는다.
* 마지막 줄은 answer와 일치하는 자연문 결론으로 끝낸다. 객관식은 `따라서 정답은 ③이다.`, 서답형은 `따라서 구하는 값은 $12$이다.`처럼 쓴다.
* 수식은 `$...$` 규칙을 그대로 따른다.
* 줄바꿈은 `\\n`으로 처리한다.
* 단계 수는 문항 난이도에 따라 유동적이나 최소 2단계 이상을 권장한다.
* 풀이 중 보조 공식이 필요한 경우 해당 단계에 인라인으로 병기한다.
* 한 줄짜리 답 직행(`∴ ③`) 풀이는 금지한다.

**금지 사항:**

* `[cite: ...]`, 내부 검수 태그, 생성 메모 포함 금지
* 단계 없이 정답만 서술하는 방식 금지
* 수식 없이 말로만 풀이하는 방식 금지 (수식 수반 필수)
* `[키포인트]` 없이 바로 풀이 시작 금지

**예시:**

```text
[키포인트] 로그 성질: $\log_a MN = \log_a M + \log_a N$
1단계: $\log_2 32 = \log_2 2^5 = 5$
2단계: $\log_2 \dfrac{1}{4} = \log_2 2^{-2} = -2$
3단계: $5 + (-2) = 3$
따라서 정답은 ③이다.
```

### 3-10. 해설 사용자 최종본 규칙

* 최종 사용자용 JS에는 생성 로그, cite 흔적, 내부 메모, 검수용 주석을 남기지 않는다.
* solution은 학생이 읽는 최종 풀이만 포함한다.
* `[cite: ...]`, 내부 검수 태그, 생성 메모가 남아 있으면 정리 대상이다.

---

## 4. 파일명 컨벤션 & db.js 메타데이터

### 4-1. 파일명 형식

```text
기출:      YY_학교명_N학기_중간|기말_학년_과목.js
유형:      단원명_학년_유형.js
단원평가:  단원명_학년_단원평가.js
쪽지:      단원명_학년_쪽지.js
```

예시:

* `25_순천여고_1학기_중간_고2_대수.js`
* `다항식_고1_유형.js`
* `제곱근과실수_중3_단원평가.js`

### 4-2. db.js 카드 메타데이터 필수 필드

```js
{
  file: "25_순천여고_1학기_중간_고2_대수.js",
  school: "순천여고",
  topic: "",
  grade: "고2",
  year: 2025,
  semester: "1",
  examType: "mid",
  subject: "대수",
  contentType: "기출"
}
```

### 4-3. 파일명 / examTitle / db 정합성 규칙

* 파일명, `window.examTitle`, `db.js` 메타데이터는 가능한 한 동일한 정보 체계를 유지한다.
* 파일명을 변경한 경우 `window.examTitle`과 `db.js` 메타도 함께 점검한다.
* 파일명만 바꾸고 `examTitle`을 구형으로 방치하는 것을 금지한다.
* `db.js`는 표시용 보조 정보가 아니라 인덱스/필터/검색 기준이므로, 파일명과 불일치가 누적되면 안 된다.

### 4-4. `types`·`similar` source-dependent DB 메타데이터 운영 규칙 (2026-08-24)

이 절은 `archive/db.js`의 카드 필드 중 파일의 출처에 의존하는 `school`, `year`, `semester`, `examType`의 backfill 기준이다. 문항의 단원·수식·정답·해설로 판단할 수 있는 분류 메타데이터와 출처 메타데이터를 섞지 않는다.

#### 4-4-1. 게이트와 예외의 정의

- `original`은 학교 시험지이므로 `file`, `school`, `grade`, `year`, `semester`, `examType`, `subject`, `contentType`, `qCount`가 모두 직접 확인되어야 한다. 이 범위의 필수 메타 gap은 0건이어야 한다.
- `types`·`similar`는 교재·유형·학원 제작 자료·학교 유사자료가 섞일 수 있다. 자체 파일·`window.examTitle`·명시된 source metadata에서 직접 확인되지 않는 출처 필드는 빈값으로 보류할 수 있다.
- 이 보류는 운영 실패가 아니라 `sourceDependentOnly` report 예외다. 보류 중에도 JS load, 문항 수, question-index, identity UID, exam/sol/ans 렌더 게이트는 통과해야 한다. `fullDbRequiredFieldsGate`와 `fullDbSchoolGate`는 이 예외가 해소되기 전까지 `false`로 남을 수 있다.
- 문항의 `standardCourse`, `standardUnitKey`, `subUnitKey`, concept map, 주변 파일, 같은 폴더의 다른 학교, 파일 수정일, 현재 연도, 교재의 교육과정 연도는 출처 메타데이터의 근거가 아니다.

#### 4-4-2. 필드별 승격·보류 기준

| 필드 | 승격할 수 있는 직접 근거 | 반드시 보류하는 경우 |
|---|---|---|
| `school` | `original` 또는 학교 시험형 `similar`의 자체 파일명에 학교 토큰이 정식 위치로 있고, 또는 JS 내부 메타데이터가 학교·기관·제작처를 명시한 경우. `types`의 source label은 이미 승인된 provider mapping 또는 명시적 provider 선언이 있을 때만 사용한다. | 단원명·교재명·출판사처럼 보이는 토큰만으로 실제 학교/제작처를 확정하는 경우, `similar1/2`가 기본 파일과 같은 출처일 것이라 추정하는 경우, 빈값을 `교재`, `유형`, `미상`, `AP수학` 등으로 채우는 경우 |
| `year` | 자체 파일명 또는 `examTitle`의 `YY_` 접두사/4자리 연도, 혹은 별도 source metadata의 명시 연도. `YY_`는 기존 아카이브의 20YY 파일명 규칙으로만 해석한다. | 학원 모의고사·교재·유형 자료처럼 자체 연도가 없는 경우, 교육과정 개정 연도·출판 연도 추정·파일 생성일·인접 파일의 연도 상속 |
| `semester` | 자체 파일명/`examTitle`의 `1학기`·`2학기`, 명시된 JS source metadata, 또는 `original`·`similar`의 canonical period path(`1mid`, `1final`, `2mid`, `2final`)가 이름과 충돌 없이 일치하는 경우. `중1_2_기말대비`처럼 시험 대비 표기와 학기 표기가 함께 직접 확인되는 경우도 허용한다. | `중간`·`기말`만 있고 학기가 없는 경우, `RPM_중2_2-1` 같은 교재 권/파트 표기, `대단원`·`중단원`·`익힘책`·단원 순서를 학기로 해석하는 경우 |
| `examType` | 자체 파일명/`examTitle`의 `중간`·`기말` 또는 그에 준하는 명시적 시험 대비 표기를 기존 enum `mid`·`final`로 일대일 변환할 수 있는 경우. canonical period path와 파일명이 함께 일치하는 `similar`도 허용한다. | `모의고사`, `대표문제`, `유형확인`, `유형심화`, `익힘책`을 `mid`·`final`로 임의 변환하는 경우, `mock` 등 새 enum을 승인 없이 추가하는 경우 |

`grade`, `subject`, `contentType`, `qCount`는 별도의 기본 필드 규칙을 따른다. 특히 `qCount`는 JS의 실제 `questionBank.length`와 일치해야 하며 출처 메타데이터 보류를 이유로 변경하지 않는다. `types`는 기본적으로 `contentType: "유형"`, `similar`는 자체 표기가 `단원평가`일 때만 `contentType: "단원평가"`, 그 밖에는 기존 `유사` 규칙을 유지한다.

#### 4-4-3. 근거 등급과 상속 금지

1. `direct`: 해당 파일의 경로 규약, 파일명, `window.examTitle`, JS 내부 source metadata에 값이 그대로 있다. 승격 검토 대상이다.
2. `contextual`: 같은 폴더, 접미사 형제 파일, 기본 파일, 학교별 유사 파일, question-index, 표준단원 정보에서 가져온 값이다. 출처 필드 승격에 사용하지 않는다.
3. `inferred`: 문항 내용·분류 모델·언어 추론으로 만든 값이다. `subUnit` inference와 달리 `school/year/semester/examType`에는 사용하지 않는다.

직접 근거가 서로 충돌하면 다수결이나 파일명 보정으로 결정하지 않고 보류한다. 하나의 파일에서 확인된 값을 이름이 비슷한 다른 파일로 전파하지 않는다. 기존 DB의 non-empty source label은 유지하되, 이를 residual 파일에 자동 복사하지 않는다.

#### 4-4-4. 현재 보류 스냅샷과 재검토 절차

현재 기준은 `archive/_generated/intelligence/phase3/archive-db-backfill-v2.json`과 DB consistency report다.

| 범위 | DB 레코드 | `emptySchool` | 필수 메타 gap | 현재 결정 |
|---|---:|---:|---:|---|
| `original` | 348 | 0 | 0 | 필수 메타 완결 |
| `types` | 49 | 26 | 47 | 직접 source evidence 전까지 보류 |
| `similar` | 41 | 2 | 13 | 직접 source evidence 전까지 보류 |
| 합계 | 438 | 28 | 60 | `sourceDependentOnly` 예외 유지 |

필드 공란 발생 수는 `school` 28, `year` 60, `semester` 37, `examType` 43이다. 이 수치는 레코드 수가 아니라 필드 occurrence이며 한 레코드가 여러 필드에 포함될 수 있다.

새 원본·표지·출처 문서가 들어오면 다음 순서로 해당 행만 재검토한다.

1. 자체 파일·`examTitle`·원본 source를 다시 열고 필드별 직접 토큰을 기록한다.
2. 기존 enum과 파일명 규약에 맞는지 확인하고, 충돌 필드는 보류한다.
3. 근거가 있는 필드만 최소 변경한다. 근거 없는 다른 필드는 그대로 둔다.
4. DB consistency, qCount/index join, identity runtime, 운영 exam/sol/ans QA를 다시 확인한다.
5. 근거가 사라지거나 원본과 충돌하면 값을 삭제·대체하지 말고 보류 사유를 갱신한다.

이번 규칙 확정 단계에서는 `archive/db.js`, production JS, question-index, identity runtime을 추가 변경하지 않는다. 원본이 현재 workspace에 없으면 필드는 빈 상태로 넘기고 다음 작업을 진행하며, 새 source artifact가 들어올 때만 해당 행을 다시 연다.

#### 4-4-5. 2026-08-24 evidence intake 결과

`emptySchool` 28건·필수 메타 gap 60건을 대상으로 현재 archive와 `D:\` 전체를 읽기 전용 재검색했다. 5,731개 파일과 텍스트 324개에서 대상 basename/examTitle과 1:1로 일치하는 source artifact는 0건이었다. 이름·단원·출판사만 겹치는 58개 contextual 후보는 다른 학교·학기·연도·교재 자료와의 관계만 보여 직접 근거로 승격하지 않는다.

- 직접 승격 필드: 0건
- `school` 28·`year` 60·`semester` 37·`examType` 43 occurrence: 모두 `no_direct_source_evidence` deferred
- 상세 ledger: `archive/_generated/intelligence/phase3/archive-db-source-evidence-intake-v1.json`
- ledger digest: `52657952003347eeaaaf53a7fb2ad67c908fbfcc1a471cfb3b45eae19262fca9`
- DB/production JS write, commit, push: 모두 false

이후 DB consistency, question-index, identity map/runtime, 운영 QA를 재실행했으며 qCount/index mismatch·UID collision은 0건이고 운영 세부단원 게이트는 통과했다. 새 원본·표지·출처 문서가 들어오기 전까지 이 범위는 `sourceDependentOnly` 예외로 유지한다.

#### 4-4-6. source-unavailable closure (2026-08-24)

현재 workspace와 `D:\` evidence intake에서 대상 파일·`examTitle`과 직접 1:1로 일치하는 원본이 0건이므로, `emptySchool` 28건·필수 메타 gap 60건을 `PERMANENT_SOURCE_UNAVAILABLE`로 영구 종결한다.

- 종결은 메타데이터 확인·승인이 아니다. `archive/db.js`의 빈 `school/year/semester/examType` 필드는 그대로 유지한다.
- 파일명·단원명·교육과정 연도·인접 파일·contextual 후보로 값을 만들거나 대체 학교를 넣지 않는다.
- 새 원본이 추가되어도 해당 행은 재개하지 않는다. 이 범위는 활성 queue에서 영구 제거한다.
- 기존 closure ledger는 감사 기록으로 보존하고, 영구 종결 ledger는 `archive/_generated/intelligence/phase3/archive-db-source-permanent-closure-v1.json`이다. DB·production JS·question-index·identity runtime과 물리 파일은 삭제·변경하지 않는다.

---

## 5. 표준 교육과정 및 표준단원키 운영 규칙

### 5-1. 기준 원본

* 표준 교육과정과 세부단원 메타데이터의 최종 기준 원본은 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`로 본다.
* 룰북은 운영 원칙과 사용 규칙을 설명하는 문서이고, 실제 단원명/키/순서의 기준 데이터는 반드시 마스터 테이블을 따른다.
* 마스터 테이블을 먼저 갱신한 뒤 룰북, db 생성기, mixer, 추출/검수 프로토콜을 순차 동기화한다.
* 룰북과 마스터 테이블이 충돌할 경우 단원명/키/순서에 한해서는 마스터 테이블을 우선한다.

### 5-2. 중학교 교육과정 기준

중학교는 2022 개정 기준으로 다음 체계를 사용한다.

* 중1: M1-01 ~ M1-08
* 중2: M2-01 ~ M2-08
* 중3: M3-01 ~ M3-07

중학교 `standardCourse` 표기 원칙:

* `중1 수학`
* `중2 수학`
* `중3 수학`

중학교 `standardUnitKey / standardUnit / standardUnitOrder`는 반드시 마스터 테이블의 값을 그대로 사용한다.

### 5-3. 고등학교 교육과정 기준

고등학교는 자료의 성격에 따라 2015 개정과 2022 개정 체계를 모두 보유할 수 있다.

#### 2015 개정

* H15-SA : 수학(상)
* H15-SB : 수학(하)
* H15-M1 : 수학I
* H15-M2 : 수학II
* H15-CALC : 미적분
* H15-PS : 확률과 통계
* H15-GV : 기하와 벡터

2015 개정은 마스터 테이블의 소단원 기준을 따른다.

* 수학(상): 다항식의 연산 / 항등식과 나머지정리 / 인수분해 / 복소수 / 이차방정식 / 이차방정식의 근과 계수 / 여러 가지 방정식 / 여러 가지 부등식 / 평면좌표 / 직선의 방정식 / 원의 방정식 / 도형의 이동
* 수학(하): 집합 / 명제 / 함수 / 유리함수 / 무리함수 / 경우의 수 / 순열 / 조합
* 수학I: 지수의 뜻과 성질 / 로그의 뜻과 성질 / 지수함수 / 로그함수 / 삼각함수의 뜻과 값 / 삼각함수의 그래프 / 삼각방정식과 삼각부등식 / 등차수열 / 등비수열 / 수열의 합 / 수학적 귀납법
* 수학II: 함수의 극한 / 함수의 연속 / 미분계수 / 도함수 / 접선의 방정식 / 도함수의 활용 / 부정적분 / 정적분 / 적분의 활용
* 미적분: 수열의 극한 / 급수 / 지수함수와 로그함수의 미분 / 삼각함수의 미분 / 여러 가지 미분법 / 도함수의 활용 / 여러 가지 적분법 / 정적분의 활용
* 확률과 통계: 순열과 조합 / 이항정리 / 확률의 뜻과 활용 / 조건부확률 / 확률분포 / 통계적 추정
* 기하와 벡터: 포물선 / 타원 / 쌍곡선 / 이차곡선과 직선 / 벡터의 연산 / 평면벡터의 성분과 내적 / 직선과 원의 방정식 / 공간도형 / 공간좌표

#### 2022 개정

* H22-C : 공통수학1
* H22-C2 : 공통수학2
* H22-A : 대수
* H22-M1 : 미적분I
* H22-M2 : 미적분II
* H22-PS : 확률과 통계
* H22-GE : 기하

2022 개정은 마스터 테이블의 소단원 기준을 따른다.

* 공통수학1: 다항식의 연산 / 항등식과 나머지 정리 / 인수분해 / 복소수와 이차방정식 / 이차방정식과 이차함수 / 여러 가지 방정식과 부등식 / 합의 법칙과 곱의 법칙 / 순열과 조합 / 행렬과 그 연산
* 공통수학2: 평면좌표 / 직선의 방정식 / 원의 방정식 / 도형의 이동 / 집합 / 명제 / 함수 / 유리함수 / 무리함수
* 대수: 지수와 로그 / 지수함수 / 로그함수 / 삼각함수 / 사인법칙과 코사인법칙 / 등차수열과 등비수열 / 수열의 합 / 수학적 귀납법
* 미적분I: 함수의 극한 / 함수의 연속 / 미분계수 / 도함수 / 도함수의 활용 / 부정적분 / 정적분 / 정적분의 활용
* 미적분II: 수열의 극한 / 급수 / 지수함수와 로그함수의 미분 / 삼각함수의 미분 / 여러 가지 미분법 / 도함수의 활용 / 여러 가지 적분법 / 정적분의 활용
* 확률과 통계: 순열과 조합 / 이항정리 / 확률의 뜻과 활용 / 조건부확률 / 확률분포 / 통계적 추정
* 기하: 이차곡선 / 이차곡선의 접선 / 공간도형 / 공간좌표 / 벡터의 연산 / 벡터의 성분 / 벡터의 내적 / 도형의 방정식

### 5-4. standardCourse 표기 원칙

* 2015 개정 문항은 해당 과목명을 그대로 사용한다.
  * 예: `수학(상)`, `수학(하)`, `수학I`, `수학II`, `미적분`, `확률과 통계`, `기하와 벡터`
* 2022 개정 문항은 해당 과목명을 그대로 사용한다.
  * 예: `공통수학1`, `공통수학2`, `대수`, `미적분I`, `미적분II`, `확률과 통계`, `기하`

### 5-5. 매핑 원칙

* 문항의 실제 교육과정 기준에 맞는 `standardCourse`와 `standardUnitKey`를 사용한다.
* 2015 개정 문항을 임의로 H22 계열로 바꾸지 않는다.
* 2022 개정 문항을 임의로 H15 계열로 바꾸지 않는다.
* 과목명만 보고 자동 치환하지 않고, 문항 출처와 실제 교육과정 맥락을 함께 확인한다.
* `exams/*.js`는 룰북 기준으로 작성된다는 전제를 두되, 실제 수정/검수 시에도 마스터 테이블과의 정합성을 최종 확인한다.
* db 생성기와 mixer는 문항 내부 `standardUnitKey`를 우선 신뢰하고, 메타 보조값은 마스터 테이블 정합 보조용으로만 사용한다.
* `archive/concept_map.js`의 compatibility map은 공식 단원키의 검색용 개념군 연결만 담당한다. 이 값으로 `standardUnit`, `subUnitKey`, 원문 라벨을 자동 치환하거나 source-dependent 메타데이터를 승격하지 않는다.
* 마스터 라벨과 실제 문항의 `standardUnit`이 다르면 먼저 alias인지 오분류인지 판정한다. 근거가 없는 경우 source label을 보존하고 `label_variant` review 목록에 남긴다.

#### 표준단원 라벨 변형 판정 결과(2026-08-24)

현재 운영 JS를 다시 읽은 결과 라벨 변형 inventory는 0개 행·0문항이다. `archive/concept_map.js`의 `STANDARD_UNIT_LABEL_ALIASES`에는 문항 내용으로 확인된 검색용 alias 4종만 둔다. alias는 검색·필터 결과를 표준 라벨로 연결할 뿐, 원본 JS의 `standardUnit`, `subUnitKey`, `subUnit`을 바꾸지 않는다. 별도의 문항 근거 adjudication으로 승인된 교차 단원 465건과 수동 inference 34건은 source 메타데이터에 반영돼 있다.

- 동일 키의 공식 세부단원명이 `standardUnit`에 들어온 사례는 canonical master label/order 정규화로 0건이 됐다.
- 다른 키의 단원명이 들어온 경우: 최초 465문항을 모두 문항 근거 기반 candidate 메타데이터로 승격해 잔여 교차 오분류를 0건으로 만들었다.
- 문항·출처만으로 판정할 수 없는 경우: `manual_review_required`로 보류한다. 현재 해당 보류는 0건이며, source-dependent 학교·연도 값은 별도 보류한다.
- 문항별 샘플과 digest: `archive/_generated/intelligence/phase1/master-audit/label-variants/master-label-variant-inventory-v1.md`.

#### fallback 차단 문항의 수동 adjudication 절차와 결과(2026-08-24)

- 자동 fallback safety가 차단한 문항은 표준단원으로 되돌려 쓰지 않고, 문항 본문·보기·정답·해설에서 핵심 풀이 단서를 먼저 확인한다.
- 이미 master에 있는 키만 선택하며, 실제 문항과 풀이 방식이 구분 근거를 제공할 때 `category_or_cue_inferred` / `complete_category`로 sidecar에 결정 근거를 남긴다. 새 키·출처 학교·연도·시험시기는 만들지 않는다.
- 28건 adjudication에서 y축과 평행한 직선 문항 1건은 `M2-04-LINEAR_FUNCTION_BASIC`으로, 경기 종료 순서·주사위 순서쌍 확률 문항 3건은 `M2-08-PROBABILITY_COUNTING`으로 교정했다. 나머지는 기존 키를 확인했다.
- 운영 반영은 `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth`로 제한하고 content·choices·answer·solution·image를 보호한다. 상세 ledger는 `archive/_generated/intelligence/phase3/fallback-adjudication/archive-subunit-fallback-manual-adjudication-v1.json`에 둔다.
- baseline 28건 전부 adjudicated되어 현재 effective safety의 잔여 blocked는 0건이다. baseline audit은 historical safety 기록으로 보존하며 운영 판정은 `archive-subunit-fallback-safety-effective-v1.json`을 사용한다.

### 5-6. RAW 사용 원칙

* 마스터 테이블에 즉시 대응 단원이 없을 때만 `RAW-단원명` 형식을 임시 사용한다.
* RAW 사용 시 `standardUnitOrder`는 `999`로 둔다.
* 대응 가능한 표준단원이 있는데도 RAW로 남겨두는 것은 금지한다.
* OCR 불안정, 미정리 세부 단원, 임시 데이터만 RAW를 허용한다.
* 마스터 테이블 편입 가능성이 확인되면 우선 편입 후 RAW를 제거한다.

### 5-7. 신규 단원 추가 원칙

* 신규 단원, 세부 단원, 예외 과목이 생기면 먼저 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`를 갱신하고 compiled JSON master를 재생성한 뒤 사용한다.
* 룰북만 먼저 수정하고 마스터 테이블을 비워 두는 방식은 금지한다.
* 마스터 테이블 갱신 후 룰북, db 생성기, mixer, 검수 기준을 같은 키 체계로 동기화한다.

### 5-8. 검수 기준

* `standardCourse`가 교육과정 체계와 일치하는가
* `standardUnitKey`가 마스터 테이블에 존재하는가
* `standardUnit`이 key와 정확히 대응하는가
* `standardUnitOrder`가 key의 순서와 일치하는가
* 대응 단원이 있는데 RAW를 쓰고 있지 않은가
* 2015 / 2022 체계를 혼합 오기하지 않았는가
* 2022 개정 고등에서 `H22-M1 / H22-M2`, `H22-PS`, `H22-GE` 등 최신 세분 체계를 정확히 사용했는가
* 2015 개정 고등에서 `H15-CALC`, `H15-PS`, `H15-GV` 등 확장 소단원 체계를 정확히 사용했는가

### 5-9. 수정 실행 원칙

본 항목은 별도의 “수정 실행 프로토콜”을 독립 문서로 두지 않고, 룰북 내부에서 수정 단계의 최소 통제 원칙을 직접 관리하기 위한 규정이다.

#### 수정 실행의 기본 원칙

* 수정은 반드시 검수 이후에만 수행한다.
* 검수 결과에 없는 항목을 모델이 스스로 확장 수정하지 않는다.
* 사용자가 승인한 범위만 수정한다.
* 수정은 항상 최소 범위로 수행한다.
* 원문 표현을 더 자연스럽게 다듬기 위한 수정은 금지한다.
* 구조 무결성을 해치지 않는 것이 최우선이다.

#### 승인 범위 원칙

* 사용자가 특정 문항만 승인한 경우 해당 문항만 수정한다.
* 사용자가 특정 필드만 승인한 경우 해당 필드만 수정한다.
* 승인되지 않은 문항, 필드, 메타데이터를 겸사겸사 함께 고치지 않는다.
* “이왕이면 이것도 같이” 식의 확장 수정은 금지한다.

#### 원문 성역 원칙

* content, choices, answer, solution은 승인 없는 임의 수정 금지다.
* 발문 의미를 바꾸는 수정 금지
* 보기 재구성 금지
* 정답에 맞춘 억지 해설 덮어쓰기 금지
* 원문보다 더 예쁘게 다듬는 수정 금지

#### STYLE_ONLY_GRAPH_UPGRADE

사용자 승인된 품질 업그레이드에서 다음 조건을 모두 만족하면
`STYLE_ONLY_GRAPH_UPGRADE`로 기록할 수 있다.

* content 의미 불변
* answer 불변
* solution meaning 불변
* graph mathematical facts 불변
* `MATH_SEMANTIC_PARITY == PASS`

이 경우에만 최신 VISUAL 프로토콜의 표준 style normalization(stroke/font/label/canvas/
sampling)을 허용한다. 이는 임의 미화가 아니라 수학적·출제적 의미를 변경하지 않는 승인된
표준화 예외다. 이번 규칙 업그레이드에서 기존 production 그래프를 일괄 변경하는 권한은
부여하지 않으며, production migration은 Pilot과 별도 승인을 거친 후 수행한다.

#### 구조 무결성 원칙

* 수정 후에도 `window.examTitle`, `window.questionBank` 구조는 완전히 유지해야 한다.
* 필드명 변경 금지
* 필드 삭제 금지
* 승인 없는 필드 추가 금지
* 따옴표, 쉼표, 대괄호, 중괄호, 이스케이프가 깨지면 수정 실패로 본다.

#### 허용되는 수정 범위

승인된 경우에 한해 아래를 허용한다.

* 계산 오류 수정
* 정답과 해설 불일치 수정
* 표준단원 메타데이터 수정
* `standardCourse / standardUnitKey / standardUnit / standardUnitOrder` 수정
* 구조 오류 수정
* escape / 따옴표 / 백슬래시 수정
* SVG / table / marker 관련 승인된 조정
* 도형 삽입 후 기존 도형 마커 삭제
* 표 삽입 후 기존 표 마커 삭제
* PNG 이미지 삽입 후 기존 그래프 마커 삭제
* 엔진 정책 정합화를 위한 choices 앞번호 제거 또는 중복 방지 정리

#### 전체 출력 원칙

* 사용자가 전체 수정본을 요청하면 반드시 `window.examTitle`부터 마지막 문항까지 전부 출력한다.
* 전체 수정본에서 임의 생략 금지
* 일부 예시 출력 금지
* 후반 문항 누락 금지
* 보기, 해설, 메타데이터, 후반 문항을 축약하지 않는다.

#### 부분 출력 원칙

* 사용자가 특정 문항만 수정 요청한 경우 해당 문항 객체만 출력한다.
* 구조상 필요한 경우에도 승인된 문항 외 다른 문항은 함께 출력하지 않는다.
* 부분 수정인데 전문항 전체를 멋대로 출력하지 않는다.

#### 해설 수정 원칙

* 해설은 학생이 실제로 읽는 풀이만 남긴다.
* 운영 규칙, 검수 규칙, 생성 로그, 내부 메모, cite 흔적은 제거 대상이다.
* 해설 결론은 answer와 반드시 일치해야 한다.
* 복수정답 문항은 해설 결론에서 복수정답 전체를 명시해야 하며, answer와 같은 정답 목록을 가져야 한다.
* 정답을 역으로 끼워 맞춘 해설은 금지한다.
* 해설 길이는 원본과 지나치게 동떨어지지 않게 유지한다.

#### 수정 단계 금지 행위

* 검수 없이 수정 시작
* 승인 없는 확장 수정
* 원문 문장 미화
* answer를 solution에 맞춰 억지 수정
* solution을 answer에 맞춰 무근거 덮어쓰기
* questionType만 보고 layoutTag를 바꾸는 행위
* choices.length만 보고 특수배치를 추정하여 수정하는 행위
* 도형, 표, 장문, 서술형이라는 이유로 layoutTag를 임의 지정하는 행위
* 마스터 승인 없이 기존 layoutTag를 삭제·교체하는 행위
* wide를 자동 부여하는 행위
* 전체 수정본 요청에서 일부 생략
* 부분 수정 요청인데 전문항 전체 출력



### 5-10. 기출 PDF → JS아카이브 변환 정책

기출 PDF 변환은 “문제집/교재 변환”이 아니라, 학교 기출 PDF를 JS아카이브의 `exams/*.js` 후보 데이터로 변환하는 작업이다.

#### 기본 흐름

```text
기출 PDF
→ exam manifest 작성
→ 페이지 이미지 추출
→ 문제별 crop
→ crop 이미지 에셋 정리
→ 발문/보기 추출
→ JS 후보 생성
→ 기출 태그 자동 채움
→ 정답/해설 1차 후보 연결
→ 검수 리포트 생성
→ reviewed_pass 이후 archive/exams 편입
→ db.js 등록
```

#### 기출 examId / outputPrefix 규칙

```text
{연도}_{학교명}_{학기}_{시험종류}_{학년}_{기출구분}
```

예:

```text
24_연향중_1학기_기말_중3_기출
23_여수여고_1학기_중간_고1_기출
24_순천여중_1학기_중간_중2_기출
```

#### manifest 필수 필드

```text
examId
year
schoolName
grade
semester
examType
sourceType
pdfPath
answerPdfPath
pageRange
expectedQuestionCount
outputFileName
outputDir
status
notes
```

#### 기출 변환 금지사항

- 원문 문제, 보기, 정답, 해설을 근거 없이 창작하지 않는다.
- 정답을 추측하지 않는다.
- 해설을 최종 확정본으로 자동 편입하지 않는다.
- PDF 전체 텍스트를 문항번호 기준으로 단순 분리해 JS를 만들지 않는다.
- 수식 의미를 임의 보정하지 않는다.
- 소문항을 임의 분리하지 않는다.
- 불확실한 문항 때문에 전체 작업을 멈추지 않는다.
- generated 후보 JS를 검수 없이 `archive/exams`에 바로 넣지 않는다.
- `db.js` 등록은 generated 후보 검수 이후에만 한다.
- 엔진 성역 함수와 렌더링 코어는 변환 파이프라인 때문에 수정하지 않는다.

#### 기출 변환 상태값

```text
job status:
- pending
- prepared
- pages_extracted
- crops_ready
- records_generated
- tags_enriched
- answer_solution_drafted
- validated
- review_pack_ready
- blocked

question status:
- ready
- image_fallback
- content_manual_review
- answer_solution_manual_review
- formula_manual_review
- tag_low_confidence
- generated_pending
- reviewed_pass
- reviewed_fail
```

### 5-11. 기출 crop 이미지 에셋 정책

- 기출 PDF 변환에서는 문제별 crop 이미지를 반드시 보존한다.
- 텍스트 추출이 확실한 문항도 원본 crop 이미지 경로를 남긴다.
- 텍스트 추출이 애매한 문항은 억지로 `content`를 확정하지 않고 `image_fallback` 또는 `content_manual_review`로 분리한다.
- 도형, 그래프, 표, 긴 조건박스가 있는 문제는 `image` 필드 또는 crop 자산을 우선 보존한다.
- 이미지 에셋은 기존 원칙처럼 `assets/images/시험지전체명/q{id}.png` 구조를 따른다.
- generated 후보 단계에서는 `archive/_generated/past-exams/{examId}/assets/` 같은 격리된 경로를 사용할 수 있다.
- live archive 편입 시에는 엔진 기준 상대경로로 정리한다.
- `image_fallback` 문항은 이미지가 없으면 무결성 실패다.
- `q.image` 경로가 실제 파일과 맞지 않으면 무결성 실패 또는 중대 WARN이다.

### 5-12. 기존 JS 태그 고도화 정책

기존 `archive/exams/*.js` 문항은 이미 운영 중인 문제풀이다.  
태그 고도화는 기존 문제의 원문·보기·정답·해설을 고치는 작업이 아니라, 유사문제 추천과 자동 시험지 구성을 위한 메타데이터 보강 작업이다.

#### 태그 고도화 기본 흐름

```text
기존 exams/**/*.js 스캔
→ 문항별 기존 메타 수집
→ content / choices / answer / solution 기반 태그 후보 생성
→ 기존 standardUnitKey와 충돌 검사
→ subUnitKey / conceptClusterKey / problemTypeKey / templateKey 후보 생성
→ tagConfidence 부여
→ high 후보와 review 후보 분리
→ 검수 후 확장 메타데이터만 반영
```

#### 절대 보존 필드

태그 고도화 작업에서 아래 필드는 승인 없이 수정하지 않는다.

```text
content
choices
answer
solution
image
layoutTag
wide
```

#### 태그 고도화 필드

```text
subUnitKey
subUnit
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket
tagConfidence
tagStatus
reviewStatus
```

#### 유사문제 기준

- `standardUnitKey`만 같은 문항은 유사문제가 아니다.
- 유사문제는 최소 `problemTypeKey`가 같아야 한다.
- 거의 같은 풀이 구조는 `templateKey`가 같아야 한다.
- 자동 추천에는 `reviewed_pass`와 신뢰도 높은 `auto_high`만 사용한다.
- `manual_review`, `auto_low`, `reviewed_fail`은 자동 추천과 자동 시험지 구성에 사용하지 않는다.

### 5-13. 정답·해설 초안 상태 정책

기출 변환이나 기존 JS 보강 과정에서 해설을 새로 쓰는 경우, 자동 생성 해설은 최종 해설이 아니라 초안이다.

```text
solutionStatus:
- existing_verified
- generated_pending
- reviewed_pass
- reviewed_fail
- missing_solution

answerStatus:
- existing_verified
- generated_pending
- reviewed_pass
- reviewed_fail
- multiple_answer_verified
- missing_answer
```

운영 원칙:

- 기존 검수 완료 해설은 `existing_verified`로 둘 수 있다.
- 새로 생성한 해설은 반드시 `generated_pending`으로 둔다.
- `generated_pending` 해설은 최종 사용자용 해설지에 포함하지 않는다.
- 최종 해설지 출력 허용 상태는 `existing_verified` 또는 `reviewed_pass`뿐이다.
- 정답이 불확실하면 `answer_solution_manual_review`로 분리한다.
- 복수정답이 수학적으로 확인되고 answer와 solution이 일치하면 `multiple_answer_verified`로 둘 수 있다.
- `multiple_answer_verified`는 정답 오류가 아니라 복수정답 인정 상태다. 단, 정답표·채점 엔진 호환성은 별도 확인한다.
- 해설 초안이 있어도 정답 근거가 불확실하면 최종 편입하지 않는다.


---

# 6. mixer.html 동작 규칙

### 6-1. 데이터 흐름

```text
exam-list (db.js) → 클릭 → JS 로드 → question-list 렌더
→ 수동/자동 선택 → cart 배열
→ openMixed() → sessionStorage + localStorage 이중 저장
→ mixed_engine.html 새 탭 오픈
```

### 6-2. cart 문항 객체 추가 필드

```js
{
  ...questionBank 원본 필드...,
  _sourceTitle: "25_순천여고_1학기_중간_고2_대수",
  _originalIndex: 19,
  _pickedMode: "auto" | "manual"
}
```

### 6-3 자동출제 알고리즘

1. 단원 범위 선택 (`getSelectedAutoUnitRange`)
2. 난이도 모드 선택: `balanced` / `random`
3. `allocateBalancedCounts`
4. `pickBalancedLevels`
5. 결과 `shuffleArray` 후 cart에 반영

### 6-4. 출력 제목 모드

| titleMode | 결과            |
| --------- | ------------- |
| `auto`    | `믹서 출제 (N문항)` |
| `daily`   | `일일평가 (N문항)`  |
| `weekly`  | `주간평가 (N문항)`  |
| `exam`    | `시험지 (N문항)`   |
| 직접입력      | 입력값 그대로       |

---

## 7. 인프라

| 항목          | 내용                                                        |
| ----------- | --------------------------------------------------------- |
| 호스팅         | GitHub Pages (`icefoxtail.github.io/AP------`)            |
| PDF 저장      | Cloudflare R2 (`apmath-engine` 버킷)                        |
| R2 접근       | rclone                                                    |
| PDF 카탈로그    | `catalog.json` — `url`, `ansUrl`, `solUrl` 필드             |
| MathJax CDN | `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js` |
| 폰트 (엔진)     | Nanum Myeongjo (Google Fonts)                             |
| 폰트 (UI)     | Pretendard (jsdelivr)                                     |

---

## 8. 운영 판정 기준

### 8-1. 자동수정 후 재검수 의무

* 자동 수정기, 자동 변환기, 일괄 치환 스크립트를 사용한 경우 반드시 재검수를 수행한다.
* 자동 처리 결과는 검수 없이 최종본으로 간주하지 않는다.

### 8-2. 엔진 통과와 무결성 통과 분리

* 엔진 로드 가능 여부와 무결성 최종 통과는 동일하지 않다.
* 로드 성공은 최소 조건일 뿐이며, 최종 통과 판정은 구조, 수식, 해설, 메타데이터, 표/도형, 마커 정리, 보기 출력, 이미지 출력, 서술형 내부 소문항 구조까지 포함하여 별도로 판단한다.

### 8-3. 제한적 임의보정 보고 의무

* 원본 판독 과정에서 제한적 임의보정을 수행한 경우, 최종 단계에서 반드시 보정 내역을 별도 보고한다.
* 보정 사실을 숨긴 채 최종본으로 넘기는 것을 금지한다.

### 8-4. choices 번호 정책 운영 원칙

* 신규 데이터는 choices에 번호를 넣지 않는다.
* 기존 데이터에 앞번호가 남아 있을 경우, 전수 수정 또는 엔진 중복 방지 로직 중 하나로 정합성을 맞춘다.
* `engine.html`과 `mixed_engine.html`의 choices 번호 정책은 가능한 한 동일하게 유지한다.
* 번호 중복은 허용하지 않는다.

### 8-5. 보기 출력 검수 원칙

* 선택지끼리 한 줄로 이어붙는 출력은 실패로 본다.
* 문장형 보기의 가독성이 확보되지 않으면 실패로 본다.
* 같은 형식의 보기인데 표시 방식이 혼재되면 정리 대상이다.
* 긴 보기의 번호/본문 정렬이 무너지면 정리 대상이다.

### 8-6. 서술형 내부 소문항 검수 원칙

* 서술형 내부 소문항 `(1)(2)(3)`이 줄바꿈 없이 이어붙어 출력되면 실패로 본다.
* 소문항 경계가 무너져 단계 구조가 보이지 않으면 정리 대상이다.
* 소문항 번호와 본문 들여쓰기가 무너지면 정리 대상이다.

### 8-7. PNG 이미지 검수 원칙

* 이미지 파일이 `assets/images/` 폴더에 실제 존재하는가
* `src` 경로 오타가 없는가
* 발문 바로 아래에 이미지가 배치되는가
* 이미지 아래에 보기가 정상 배치되는가
* 이미지 경로가 `assets/images/시험지전체명/q{id}.png` 구조와 정합적인가
* 고2 이상 문항에서 과목명까지 포함된 시험지 전체명 기준으로 폴더가 분리되었는가
* Export 라벨, 불필요한 여백, 격자, 축 숫자 과다가 제거되었는가
* 이미지가 지나치게 작거나 커서 가독성을 해치지 않는가
* 인쇄 시 흐릿하지 않은가
* 다른 문항 이미지와 파일명이 혼동되지 않는가
* JS와 PNG가 세트로 함께 반영되었는가

---

## 9. 미결 이슈 트래커

* engine.html stacked block 구조가 mixed_engine.html에도 동일하게 이식될지 여부
* 실제 학교별 장문 문항 데이터에서 `SE_BLOCK_GAP` 수치 최적화 필요 여부
* fullwidth 문항(Group C)의 bucket 전 단계 사전 분리 전략 필요 여부
* 발문 표(`.question-table`) 자동 생성 파이프라인 정착 여부
* index / mixer / engine 간 표준단원 표시 일관성 강화 여부
* 보기 전용 selector를 어디까지 고정할지 여부
* PNG width 표준값을 엔진 CSS 차원에서 더 고정할지 여부

* 유사문제용 `problemTypeKey` / `templateKey` 마스터테이블을 실제 기출·유형 데이터 기준으로 계속 확장해야 함
* 중등 대단원 기반 기존 문항의 `subUnitKey` 자동 태깅 정확도 검수 필요
* 기출 PDF 변환 파이프라인의 crop 자동화 수준과 image_fallback 허용 범위 확정 필요

---

## 10. Gemini 지시 원칙

Gemini에게 작업 지시 시 아래 원칙을 명시해야 한다.

### 10-1. 반드시 포함할 문구

```text
[성역 원칙]
다음 함수는 절대 수정하지 마세요:
- wrapLatex()
- MathJax 호출 순서 (staging → typesetPromise → raf)
- staging 구조
- renderAns()
- renderSol()
- autoCompress()
- fitQuestionBox()
```

### 10-2. Gemini 작업 범위

| 가능                      | 불가                       |
| ----------------------- | ------------------------ |
| 새 JS 문항뱅크 데이터 작성        | 성역 함수 수정                 |
| 기존 문항 수식 수정             | wrapLatex 로직 변경          |
| db.js 메타데이터 추가          | MathJax 초기화 코드 변경        |
| UI 스타일 수정 (index/mixer) | staging 구조 변경            |
| 신규 비성역 함수 구현            | renderAns / renderSol 수정 |
| 승인된 renderExam 비성역 수정   | 성역 구조 임의 교체              |

### 10-3. 데이터 변환 지시 시 체크리스트

* [ ] 파일명 컨벤션 (4-1 참고)
* [ ] `window.examTitle` 형식
* [ ] 수식 규칙 (3-3 전체)
* [ ] 분수 표현이 `\frac` 대신 `\dfrac`으로 작성됐는가 (지수 안 분수 제외)
* [ ] 지수/아래첨자 내부 분수는 `\frac` 유지했는가 (`$e^{\frac{x}{2}}$` 형태)
* [ ] solution이 v2.1 자연 풀이 흐름으로 시작
* [ ] solution 최소 2단계 이상 포함됐는가
* [ ] solution 마지막 결론이 answer와 일치하는가
* [ ] solution에 cite 태그·내부 메모 없는가
* [ ] standardUnitKey (5장 참고)
* [ ] choices 형식 (객관식 vs 주관식)
* [ ] 객관식 choices에 번호를 직접 넣지 않았는가
* [ ] id 1부터 순차 정수
* [ ] SVG 내부 `<br>` 0개 확인
* [ ] `<table>/<tr>/<td>` 사이 `<br>` 0개 확인
* [ ] SVG 내부 LaTeX(`$...$`) 0개 확인
* [ ] SVG 세부 typography·stroke·sampling이 `04_VISUAL/도형추출.md` v3.0을 따르는가
* [ ] `<table>` 인라인 font-size 별도 지정 안 했는가
* [ ] `wide: true`는 마스터 명시 지시인지 확인
* [ ] `layoutTag` 없는 문항은 기본 격자(Group A)로 유지하는가
* [ ] `layoutTag === "subjective-2up"`만 B2로 분기하는가
* [ ] `layoutTag === "subjective-4up"`만 B4로 분기하는가
* [ ] `choices.length === 0`만으로 특수배치 분기하지 않는가
* [ ] `layoutTag === "fullwidth"` 또는 `wide: true`만 Group C로 분기하는가
* [ ] 발문 표는 `.question-table-wrap` 또는 `.question-table` 중 하나의 전용 selector 전략을 따르는가
* [ ] `.q-box table` 범용 selector를 다시 도입하지 않았는가
* [ ] 서술형의 배치태그를 AI가 자의적으로 결정하지 않았는가
* [ ] 문장형 선택지가 한 줄 inline처럼 붙어 나오지 않는가
* [ ] 같은 형식의 보기끼리 표시 방식이 혼재되지 않는가
* [ ] PNG 파일 경로가 실제 프로젝트 구조와 일치하는가
* [ ] PNG 경로가 `assets/images/시험지전체명/q{id}.png` 구조를 따르는가
* [ ] 고2 이상 문항에서 과목명까지 포함된 시험지 전체명 기준 폴더를 사용했는가
* [ ] 발문-이미지-보기 순서를 어기지 않았는가
* [ ] 서술형 내부 `(1)(2)(3)` 소문항이 독립 줄에서 시작하는가

* [ ] 기존 JS 태그 고도화 작업에서 content/choices/answer/solution/image/layoutTag/wide를 수정하지 않았는가
* [ ] 유사문제용 확장 필드(subUnitKey/conceptClusterKey/problemTypeKey/templateKey)는 마스터 테이블 기준 키만 사용했는가
* [ ] standardUnitKey만 같은 문항을 유사문제로 판정하지 않았는가
* [ ] problemTypeKey/templateKey 없는 문항을 유사문제 자동 추천에 사용하지 않았는가
* [ ] tagConfidence가 낮은 문항은 manual_review 또는 tag_low_confidence로 분리했는가
* [ ] generated_pending 해설이 최종 solution 또는 최종 해설지에 섞이지 않았는가
* [ ] 기출 PDF 변환 결과를 검수 없이 archive/exams 또는 db.js에 바로 편입하지 않았는가
* [ ] image_fallback 문항에 실제 image/crop 자산이 존재하는가


### 10-4. SVG · table HTML 무결성 규칙

#### SVG 내부 규칙

그래프의 root·canvas·stroke·typography·sampling·label·arrow·z-order·축척 및 출판 gate는
`04_VISUAL/도형추출.md` v3.0을 canonical source로 삼는다. 룰북은 아래 구조 원칙만
상위 규칙으로 유지하고 세부 수치를 복제하지 않는다.

**[SVG-0] SVG root**
신규 또는 수정 그래프의 root에는 `viewBox`와 `preserveAspectRatio`가 모두 있어야 한다.
인쇄용 canonical SVG에 `vector-effect="non-scaling-stroke"`를 전역 강제하지 않는다.

**[SVG-1] SVG 내부 `<br>` 절대 금지**
`<svg>...</svg>` 내부에는 `<br>` 태그를 단 한 개도 넣지 않는다.
`<line>`, `<path>`, `<text>`, `<circle>`, `<g>` 사이의 줄바꿈은 JS 문자열 `\n`으로만 처리한다.

**[SVG-2] SVG 내부 LaTeX 금지**
`<text>` 태그 안에 `$...$`, `\frac`, `\sqrt` 등 LaTeX를 직접 넣지 않는다.
수식 라벨이 필요하면 평문으로만 표기한다.
LaTeX가 필요한 수식 라벨은 SVG 밖 HTML 영역에 둔다.

**[SVG-3] 다중 줄 텍스트**
`<text>` 안에서 줄을 나눠야 할 경우 `<br>` 대신 `<tspan>` 사용.

#### table 내부 규칙

**[TABLE-1] table/tr/td 사이 `<br>` 금지**
`<div>`, `<table>`, `<tr>`, `<td>`, `<th>` 태그 직전·직후에 `<br>`을 넣지 않는다.

**[TABLE-2] table 인라인 스타일 남용 금지**
레이아웃 핵심 규칙은 엔진의 전용 selector가 담당한다.
데이터에서 `font-size`, `max-width`, `margin:0 auto` 같은 강한 배치 스타일을 과도하게 인라인으로 넣지 않는다.

### 10-5. PNG 이미지 운영 규칙

* 복잡한 그래프, GeoGebra 그래프, 긴 SVG 그래프는 PNG 사용을 허용한다.
* PNG 파일은 반드시 `assets/images/` 폴더에 둔다.
* 이미지 자산은 `exams/`와 분리 관리한다.
* 이미지 폴더는 시험지 전체명 기준으로 분리한다.
* 고2 이상 문항은 과목명까지 포함된 시험지 전체명 기준으로 이미지 폴더를 분리한다.
* 파일명은 문항번호 기반 `q{id}.png` 구조를 우선한다.
* 신규 데이터에서 PNG 자산이 준비된 경우 `image` 선택 필드 사용을 우선한다.
* `content` 내부 `<img src="assets/images/...">` 방식은 구형 데이터 호환 또는 임시 렌더 검증용으로 허용한다.
* `image` 필드와 `content` 내부 `<img>`를 동시에 사용하는 것은 원칙적으로 금지한다.
* 이미지 기본 경로는 아래를 기준으로 한다.

```js
image: "assets/images/시험지전체명/q20.png"
```

* 구형 호환 삽입 형식은 아래와 같다.

```html
<img src="assets/images/시험지전체명/q20.png" style="display:block; width:240px; margin:10px auto;">
```

* width 표준값은 데이터 인라인 스타일보다 엔진 CSS 또는 렌더러 정책에서 관리한다.
* 필요 시 엔진에서 다음 기준을 적용한다.

  * 기본: `240px`
  * 작은 그래프: `220px`
  * 정보량이 조금 많은 그래프: `260px`
  * 예외적으로 넓은 그래프: `280px`
* 이미지도 발문 바로 아래에 둔다.
* PNG는 사용 전 여백/Export 라벨/격자/불필요한 축 숫자를 정리한다.
* AI는 SVG와 PNG를 자의적으로 교체하지 않으며, 마스터 승인 또는 운영 규칙에 따라 선택한다.

#### 10-5-1. engine / mixed_engine image 렌더링 기준

engine.html과 mixed_engine.html은 문항 객체의 `image` 필드를 인식해야 한다.
`q.image`가 존재하면 `content` 렌더링 직후 아래 구조로 출력한다.

```html
<div class="q-image-wrap">
  <img src="${q.image}" alt="">
</div>
```

`q.image`와 `content` 내부 `<img>`가 동시에 존재할 경우 중복 출력 위험이 있으므로 검수 단계에서 WARN 처리한다.
신규 데이터에서는 둘 중 하나만 사용한다.


### 10-6. 문항 유형 분류 및 렌더링 정책 (Stage E v1.9 기준)

Stage E 기준으로 `renderExam`은 문항 유형(`questionType`)과 배치 태그(`layoutTag`)를 분리하여 해석한다.
문항 번호는 원본 data 순서 기준으로 고정되며, 배치 블록이 달라도 번호는 그대로 유지된다.

### 10-7. 예외 적용규칙
[해설전용 JS 예외]

해설전용 JS는 content, choices, answer, 메타데이터 보강 없이 운용할 수 있다.
기본 스키마 필드는 유지하되, 값은 빈 문자열 또는 기본값으로 둘 수 있다.

해설전용 JS는 문제은행 최종본이 아니므로,
content/choices/answer가 비어 있어도 무결성 FAIL로 보지 않는다.

단, 파일 목적은 examTitle 또는 별도 운영 메모에서 “해설전용”으로 구분한다.
해설전용 JS를 일반 문제은행·믹서용 최종본으로 사용할 수는 없다.


#### 최상위 원칙

* `wide: true`는 AI가 자동 판정하지 않는다.
* `wide: true`는 마스터가 명시적으로 지정한 경우에만 예외 배치로 처리한다.
* `choices.length === 0`만으로 서술형/특수배치를 자동 판정하지 않는다.
* 주관식 전체를 자동으로 특수배치 대상으로 잡는 행위는 금지한다.
* 특수배치 대상은 반드시 `layoutTag`로만 판정한다.
* `tags`는 자동 배치 기준으로 사용하지 않는다.
* **서술형의 배치태그는 마스터가 결정한다.**
* **`layoutTag` 결정권은 마스터에게 있다.**
* **AI는 서술형, 주관식, 장문, 그림 포함 여부만 보고 `layoutTag`를 임의 판단하지 않는다.**
* **배치가 필요해 보여도 마스터 지정 없는 `layoutTag` 변경은 금지한다.**
* 시험지 렌더링은 page-wide shared column 누적 방식이 아니라, **block 단위 적층 구조**를 사용한다.

#### 1) 문항 유형 필드 (`questionType`)

문항 성격 분류용 필드:

* `객관식`
* `주관식`
* `서술형`

이 필드는 문항 의미 분류용이며, 직접적으로 페이지 배치 규칙을 결정하지 않는다.

#### 2) 배치 태그 필드 (`layoutTag`)

렌더링 규칙 결정용 필드:

* `grid`
* `subjective-2up`
* `subjective-4up`
* `fullwidth`
* 또는 `wide: true`

즉, `questionType`과 `layoutTag`는 별개로 본다.

#### Group A — 기본 격자 문항

조건:

* `wide !== true`
* `layoutTag`가 없거나 `layoutTag === "grid"`인 모든 문항
* `tags` 유무와 무관하게 `layoutTag`가 없으면 기본 grid로 유지한다.

포함:

* 일반 객관식
* 일반 주관식
* 일반 서술형
* 태그 없는 모든 기본 문항

#### Group B2 — 2문항 배치

조건:

* `layoutTag === "subjective-2up"`

#### Group B4 — 4문항 배치

조건:

* `layoutTag === "subjective-4up"`

#### Group C — 전면 배치

조건:

* `wide: true`
* 또는 `layoutTag === "fullwidth"`

중요:

* 서술형이라고 해서 자동으로 B2/B4/C가 되지 않는다.
* 배치태그 없는 서술형은 기본 grid로 유지한다.

### 10-7. 폰트 크기 고정 규칙

#### 발문 표(question table) 폰트

| 항목                                                 | 고정값         | 근거     |
| -------------------------------------------------- | ----------- | ------ |
| `.question-table` font-size                        | **`8.6pt`** | 엔진 표준값 |
| `.question-table th`, `.question-table td` padding | `3px 5px`   | 엔진 표준값 |
| `.question-table` line-height                      | `1.35`      | 엔진 표준값 |

* 데이터 작성 시 `<table style="font-size:...">` 인라인 폰트 지정은 하지 않는다.
* 발문 표는 `.question-table-wrap table` 또는 `table.question-table` 전용 selector가 자동으로 `8.6pt`를 적용하는 것을 원칙으로 한다.
* 열 수가 많아 특별히 더 작게 해야 할 경우에만 `8pt`까지 허용한다. 그 이하는 금지한다.
* **`.q-box table` 기준 문구는 폐기한다.**

#### SVG 텍스트 폰트

세부 텍스트 hierarchy와 font fallback은 `04_VISUAL/도형추출.md` v3.0의
`Typography`, `Math Italic`, `Label 배치 및 clearance`를 참조한다. 이 룰북에는 그래프
font-size 또는 font-family 숫자·스택을 별도로 정의하지 않는다.

### 10-8. 표(table) 폭 및 정렬 고정 규칙

#### 새 원칙

1. `max-width 280px / 왼쪽 정렬` 고정 규칙은 **발문 표**에만 강제 적용한다.
2. `.q-box table` 전체 선택자로 시험지/해설지의 모든 table을 일괄 제어하지 않는다.
3. 표 규칙은 반드시 **발문 표 전용 래퍼 또는 클래스** 기준으로 건다.
4. 기타 table은 발문 표 규칙에 자동 포함시키지 않는다.
5. 즉, 범용 selector가 아니라 명시적 selector로만 제어한다.

#### 권장 방식 A안

```html
<div class="question-table-wrap">
  <table>...</table>
</div>
```

#### 권장 방식 B안

```html
<table class="question-table">...</table>
```

#### 금지

* `.q-box table { ... }` 로 전체 table 일괄 제어
* 발문 표와 해설 보조표를 동일 selector로 묶기
* 발문 표를 중앙 배치
* 발문 전체를 무조건 표 래퍼로 감싸는 방식

#### 운영 기준

* 발문 바로 아래 배치 원칙은 그대로 유지한다.
* 표는 항상 왼쪽 정렬한다.
* 가운데 정렬 금지
* 오른쪽 정렬 금지

---

## 11. 역할 분담

| 담당         | 역할        | 상세                                               |
| ---------- | --------- | ------------------------------------------------ |
| **GPT**    | 계획·총괄     | 작업 계획 수립, 공정 설계, 전체 일정 조율                        |
| **Claude** | 검수        | Gemini 구현물 성역 함수 침범 여부 확인, 수식 규칙 준수 여부 확인, 룰북 갱신 |
| **Gemini** | 구현·데이터 변환 | 코드 구현, JS 문항뱅크 데이터 생산·수정                         |
| **마스터**    | 최종결정      | 최종 판단, 실환경 테스트, 자료 제공                            |

### GPT와의 협업 원칙

* GPT가 계획한 작업 범위를 Claude가 검수 관점에서 검토한다.
* Claude는 GPT 계획에 성역 침범 위험이 있을 경우 사전에 경고한다.
* Gemini 지시문은 GPT 계획을 바탕으로 Claude가 성역 원칙을 포함하여 작성한다.
* 최종 판단(배포 여부, 방향 전환)은 마스터가 한다.
* Claude 부재 시 Claude 역할은 GPT가 담당한다.

---

*본 룰북은 프로젝트 상태 변경 시 갱신한다.*

```

이제 다음 단계는 이 룰북 기준으로  
**무결성검수.md**, **문제해설추출 규약**, **도형/그래프 규약**에도 같은 이미지 경로 규칙을 동기화하는 것입니다.
```


==================================================
신규 해설 v2.1 동기화 규칙
==================================================

[적용 범위]
- 신규 JS 파일, 신규 기출 변환 파일, 신규 solution 생성 작업부터 v2.1 규칙을 적용한다.
- 기존 운영 중인 archive/exams/**/*.js, archive/db.js, engine.html, mixed_engine.html, mixer.html, index.html, assets/images, 기존 PNG/SVG, 기존 solution 데이터는 일괄 리모델링하지 않는다.
- 사용자가 특정 문항 또는 특정 신규 변환 작업을 명시 승인한 경우에만 해당 solution에 v2.1 규칙을 적용한다.

[기존 해설 보존]
- 기존 solution을 자동으로 v2.1 형식으로 변환하지 않는다.
- 기존 [키포인트] 라벨, 구버전 결론 형식, 기존 SVG/image는 구버전 자산으로 보존할 수 있다.
- 신규 v2.1 작업에서는 [키포인트], 조건 정리, 풀이 방향, 정석 풀이 같은 고정 라벨을 강제하지 않는다.

[신규 solution 작성 원칙]
- 학생이 실제로 읽는 최종 풀이만 solution에 넣는다.
- 문제 조건을 자연스럽게 해석하고, 필요한 식 전개와 판단 근거를 생략하지 않는다.
- 범위, 부호, 위치 관계, 교점, 중점, 반지름, 기울기, 절편 등은 계산으로 확정한 뒤 쓴다.
- 마지막 결론은 answer와 일치해야 한다.
- 객관식은 `따라서 정답은 ③이다.`처럼 끝낸다.
- 서답형은 `따라서 구하는 값은 $12$이다.`처럼 끝낸다.
- 정답을 맞추기 위해 그래프, 조건, 보기, answer를 역산하거나 끼워 맞추지 않는다.
- 교육과정 밖 개념, 운영 메모, OCR 메모, 검수 필요 문구, ChatGPT/Gemini 언급, PASS/FAIL 문구를 solution에 넣지 않는다.

[해설용 시각자료]
- 발문용 시각자료는 content 또는 image 필드에 둔다.
- 해설용 시각자료는 solution 내부의 `<div class="sol-visual ...">...</div>` inline SVG로 둘 수 있다.
- 발문 원본의 표, 도형, 그래프, PNG를 solution으로 옮기는 것은 금지한다.
- 해설 이해를 돕기 위해 새로 만든 소형 SVG만 solution 안에 넣을 수 있다.
- 불확실한 그림은 만들지 않고 review_needed 또는 오류 목록으로 분리한다.

[SVG 규칙]
- 모든 해설용 SVG에는 viewBox를 둔다.
- width와 height를 명시한다.
- SVG 내부에는 `<br>`, `$...$`, `\frac`, `\dfrac`, `\sqrt`, `\text{}` 같은 LaTeX 또는 MathJax 표현을 넣지 않는다.
- SVG 내부 라벨은 일반 텍스트만 사용한다.
- 그래프의 세부 typography·stroke·sampling은 `04_VISUAL/도형추출.md` v3.0을 따른다.
- SVG의 점, 선, 그래프, 원, 수직선은 solution의 계산 결과와 일치해야 한다.

[유형별 그림 원칙]
- 부등식과 연립부등식은 부등호표나 구간표보다 실제 수직선 그림을 우선한다.
- 함수 문항은 축, 절편, 꼭짓점, 교점, 상하관계가 보이는 그래프 개형을 우선한다.
- 원의 방정식은 좌표평면 위에 중심과 반지름이 보이는 원 그림을 우선한다.
- 직선의 방정식은 좌표평면 위의 직선, 기울기, 절편, 교점 또는 접점을 보이는 그림을 우선한다.

[학생 이해용 시각화 기본 적용]
- 기존 production JS 해설 업그레이드에서 `원의 방정식`, `직선의 방정식`, `이차함수`, `이차방정식`, `이차부등식`은 해설용 그래프·도형을 기본 필수로 한다.
- 적용 여부는 standardUnitKey·subUnitKey의 표면 명칭만이 아니라 문항의 실제 수학 내용을 기준으로 판정한다. 예를 들어 이차부등식이 `여러 가지 방정식과 부등식` 하위키에 분류되어도 시각화를 생략하지 않는다.
- 원의 방정식은 실수 범위에서 $r^2>0$이면 원·중심·반지름을 표시한다. $r^2=0$은 점, $r^2<0$은 실수 그래프 없음이므로 원을 억지로 그리지 않는다.
- 직선·이차함수·이차방정식·이차부등식은 문제의 식과 해집합을 해석할 수 있도록 각각 직선, 포물선, x축 교점, 부호 영역과 해집합을 표시한다.
- 의미 있는 그래프가 가능한데 시각화가 없으면 해설 품질 FAIL이다. 시각화는 독립 풀이와 solution에서 확정된 수학 사실만 반영하고 실제 `sol` 화면에서 검수한다.
- 문제용 `image`와 해설용 `solutionImage`/inline SVG를 분리한다. 시각화 추가만으로 standardUnitKey·subUnitKey를 변경하지 않는다.

[불확실 문항]
- 발문 그래프가 흐리거나 좌표/조건/보기/answer가 충돌하면 solution을 빈 문자열로 두고 오류 목록 또는 review_needed 목록에 기록한다.
- 학생용 solution에는 `원문 확인 필요`, `검토 필요`, `OCR` 같은 내부 메모를 넣지 않는다.
