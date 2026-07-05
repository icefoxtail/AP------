
---

# `/goal` 학교시험 분석 3차 — 학부모 리포트 출력 안정화 · 문항별 상담문 고도화

작성일: 2026-07-05
대상: AP MATH OS / 리포트 센터 / 학교시험 분석

## GOAL 한 줄

학교시험 분석의 학생별 상세 학부모 리포트를 **깨지지 않는 출력물**로 만들고, 각 오답 문항이 **학부모가 이해할 수 있는 상담 문장**으로 설명되도록 고도화한다.

현재 2차 작업으로 문항 분석표, 학생별 서버 저장, 시험지 단위 AI 분석 기반은 들어갔다. 이번 3차에서는 이미 완료된 반/학생 선택 UI, 문항 분석표 테이블화, `student-reports` API, `exam-analysis` API, D1 migration은 반복하지 않는다.

---

## 0. 현재 코드 기준점

현재 확인된 상태:

* 학생별 상세 리포트는 `reportCenterBuildSchoolExamDetailedParentReport()`에서 생성된다. 실제 오답 문제 카드를 `reportCenterBuildQuestionReviewCardsForReport()`로 만들고, `parentNarrative: true` 옵션을 넘긴다.
* 학부모 문항 해석 함수 `reportCenterBuildParentQuestionNarrative()`가 이미 존재하며, 정답률 구간과 태그에 따라 `headline / reason / meaning / action`을 생성한다.
* 학생별 상세 출력은 `reportCenterBuildSchoolExamDetailedPrintDocument()`와 `reportCenterOpenSchoolExamDetailedPrintView()`가 담당한다. 다만 기존 `.aprc-pdf-header`, `.aprc-title`, `.aprc-subtitle` 구조를 재사용한다.
* 학생별 상담 수정본과 AI 결과는 `student-reports` API로 서버 동기화된다. `reportCenterSyncStudentReportToServer()`가 `api.post('student-reports', ...)`를 호출한다.
* 시험지 단위 분석표 출력은 별도 print shell을 사용한다. 이 방식은 안정적이므로 학생별 상세 리포트 출력도 이 패턴을 참고한다.

---

## 1. 작업 범위

이번 태스크는 아래 5개만 한다.

1. 학생별 상세 학부모 리포트 출력 깨짐/덮임 수정
2. 학부모용 문항 카드 구조 개선
3. 문항별 상담 문장 품질 강화
4. 저장/AI/원문 로딩 상태를 선생님이 알 수 있게 표시
5. 테스트와 하니스로 회귀 방지

---

## 2. 작업 금지 범위

이번 라운드에서 하지 않는다.

* 반 선택/학생 선택 위치 변경 재작업
* 학생 카드 compact grid 재작업
* 시험 대시보드 접힘 구조 재작업
* `exam_student_reports` 테이블 재설계
* `student-reports` API 경로 변경
* `exam-analysis` API 경로 변경
* 기존 평가 리포트 전체 리디자인
* QR/OMR 입력 구조 변경
* 아카이브 엔진 수정
* Cloudflare Worker 배포
* D1 migration 추가

단, 기존 CSS 충돌을 막기 위한 **프론트 CSS/HTML 구조 수정**은 허용한다.

---

# LOOP 실행 규약

각 STEP은 반드시 아래 순서로 진행한다.

```text
STEP 시작
→ 현재 코드 위치 확인
→ 최소 수정
→ 관련 테스트 작성/수정
→ node 테스트 통과
→ 회귀 테스트 통과
→ git diff 자체 검토
→ STEP 커밋
→ 다음 STEP
```

Codex는 중간에 “완료”라고 하지 않는다.
STEP 1~6 전체가 끝난 뒤 최종 보고서를 작성한다.

브랜치 정책:

```text
현재 로컬 main에서 작업
브랜치 생성 금지
푸시 금지
워커 배포 금지
마이그레이션 실행 금지
```

---

# STEP 1 — 학생별 상세 리포트 출력 전용 CSS 분리

## 목표

형님이 캡처한 것처럼 제목, 선, 상단바, 본문이 겹치거나 덮이는 문제를 없앤다.

현재 학생별 상세 리포트 출력은 기존 평가 리포트의 `.aprc-pdf-header` 스타일을 재사용해서 충돌 가능성이 있다. 이번 STEP에서는 **학교시험 학생 상세 리포트 전용 print shell/style**을 만든다.

## 대상 파일

```text
apmath/js/report-center.js
tests/report-school-exam-detail-print.test.mjs  신규 또는 기존 테스트 보강
```

## 작업 내용

### 1. 전용 wrapper 강화

현재:

```js
<main class="aprc-pdf-document aprc-school-exam-detail-print">
```

이 구조를 유지하되, 출력 전용 root를 명확히 한다.

```html
<div id="report-print-view" class="report-print-view report-center-school-exam-print-view">
  <div class="report-print-toolbar no-print">...</div>
  <div class="report-print-stage" id="report-print-document-root">
    <main class="aprc-school-detail-document">
```

`aprc-school-detail-document`를 새 전용 루트로 사용한다.

### 2. 기존 `.aprc-pdf-header` 의존 제거

학생별 상세 리포트 출력 문서에서는 아래 기존 구조를 쓰지 않는다.

```html
<header class="aprc-pdf-header">
  <div class="aprc-brand">AP MATH REPORT</div>
  <div class="aprc-title">학교시험 상세 리포트</div>
  <div class="aprc-subtitle">...</div>
</header>
```

대신 전용 구조로 변경한다.

```html
<header class="aprc-school-detail-head">
  <div class="aprc-school-detail-brand">AP MATH REPORT</div>
  <h1>학교시험 상세 리포트</h1>
  <p>틀린 문제와 다음 수업 계획을 함께 정리합니다.</p>
</header>
```

### 3. 전용 CSS 추가

`reportCenterInjectPrintViewStyle()` 또는 학교시험 상세 전용 style injection에 아래 성격의 CSS를 추가한다.

필수 기준:

```css
.report-center-school-exam-print-view {
  background: #eef2f7;
  min-height: 100vh;
}

.report-center-school-exam-print-view .report-print-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
}

.report-center-school-exam-print-view .report-print-stage {
  max-width: 210mm;
  margin: 0 auto;
  padding: 16mm 0;
}

.aprc-school-detail-document {
  width: 186mm;
  margin: 0 auto;
  background: #fff;
  color: #111827;
  padding: 14mm;
  box-sizing: border-box;
}

.aprc-school-detail-head {
  position: relative;
  display: block;
  padding-bottom: 6mm;
  margin-bottom: 8mm;
  border-bottom: 2px solid #111827;
  break-inside: avoid;
}

.aprc-school-detail-head h1 {
  margin: 2mm 0 1.5mm;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 900;
}

.aprc-school-detail-head p {
  margin: 0;
  line-height: 1.5;
  color: #475569;
  font-weight: 700;
}
```

인쇄 시:

```css
@media print {
  .no-print,
  .report-print-toolbar,
  .app-header,
  .mobile-header,
  .topbar,
  #report-center-wide-overlay {
    display: none !important;
  }

  html,
  body {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .report-center-school-exam-print-view,
  .report-print-stage {
    background: #fff !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .aprc-school-detail-document {
    width: 100% !important;
    max-width: 186mm !important;
    padding: 0 !important;
    margin: 0 auto !important;
  }

  .aprc-school-detail-head,
  .aprc-counsel-section,
  .aprc-qreview-card,
  .aprc-parent-question-card {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
```

### 4. 기존 앱 UI 덮임 방지

`reportCenterOpenSchoolExamDetailedPrintView()`에서 root 교체 전 아래를 더 확실히 제거한다.

```js
document.querySelectorAll(
  '#report-center-wide-overlay, .report-center-wide-overlay, .wide-overlay, .modal-backdrop'
).forEach(el => el.remove());
```

그리고 `document.body`에 전용 class를 붙였다가 리포트 센터로 돌아갈 때 제거한다.

```js
document.body.classList.add('aprc-school-print-mode');
```

`openReportCenterHome()` 또는 리포트센터 복귀 버튼에서 제거.
단, 복귀 경로가 여러 개이므로 작은 정리 함수로 묶어 재사용한다.

```js
function reportCenterExitSchoolExamPrintMode() {
  document.body.classList.remove('aprc-school-print-mode');
}
```

이 함수는 최소한 `openReportCenterHome()`, 출력 화면의 리포트 센터 버튼, 다른 리포트 출력 화면 진입 전에 호출한다.
브라우저 뒤로가기까지 완전히 통제하지는 않되, 앱 내부 이동에서는 print mode class가 남지 않게 한다.

### 5. 인라인 출력 배지 제거

학생별 상세 학부모 리포트의 `프리미엄 분석 적용` 배지는 인라인 style로 두지 않는다.
전용 class를 둔다.

```html
<span class="aprc-school-detail-premium-badge">프리미엄 분석 적용</span>
```

print CSS 안에서 이 배지까지 함께 관리한다.

## DoD

* 제목과 가로선이 겹치지 않는다.
* 앱 상단바가 출력 문서 위에 덮이지 않는다.
* 툴바는 화면에서는 보이지만 인쇄에서는 사라진다.
* 첫 페이지 상단에 여백이 과도하게 생기지 않는다.
* `학교시험 상세 리포트` 제목이 한 줄 또는 자연스러운 두 줄로 표시된다.
* 기존 평가 리포트 출력은 깨지지 않는다.

## 테스트

신규 테스트:

```text
tests/report-school-exam-detail-print.test.mjs
```

검증 내용:

* `reportCenterBuildSchoolExamDetailedPrintDocument()` 결과에 `.aprc-school-detail-document` 존재
* `.aprc-pdf-header`에 의존하지 않음
* `reportCenterBuildSchoolExamDetailedPrintShell()` 결과에 `.report-center-school-exam-print-view` 존재
* `no-print` toolbar 존재
* print CSS 안에 `.app-header`, `.mobile-header`, `.topbar` 숨김 규칙 존재
* `break-inside:avoid` 포함
* `aprc-school-print-mode` class를 제거하는 복귀 함수 존재
* 프리미엄 분석 배지가 인라인 style이 아니라 class 기반임

---

# STEP 2 — 학부모용 문항 카드 전용 구조 추가

## 목표

현재는 실제 오답 문제가 나오지만, 학부모 입장에서 “왜 틀렸고, 얼마나 어려웠고, 다음에 뭘 할 건지”가 한눈에 들어오지 않는다.

이번 STEP에서는 기존 선생님용 `QuestionReviewCard`와 별도로 **학부모용 오답 문항 카드**를 만든다.

## 대상 파일

```text
apmath/js/report-center.js
tests/report-parent-question-card.test.mjs 신규
```

## 작업 내용

### 1. 새 함수 추가

```js
function reportCenterBuildParentWrongQuestionCard(row, detail = null, options = {}) {}
```

입력 row는 기존 `stats.wrongRows`를 사용한다. detail은 archive question detail이다.

카드 구조는 STEP 4의 최종 순서와 처음부터 맞춘다.
문항 meta에는 문항별 판단에 필요한 `전체 정답률`, `반 정답률`을 표시한다.
이 숫자는 문항 카드의 근거 정보이므로 허용한다.

```html
<article class="aprc-parent-question-card">
  <header class="aprc-parent-question-head">
    <div>
      <div class="aprc-parent-question-no">8번 · 이차방정식</div>
      <div class="aprc-parent-question-meta">
        객관식 · 4점 · 매우 어려움 · 전체 정답률 7% · 반 정답률 25%
      </div>
    </div>
    <span class="aprc-parent-question-badge">최상위 문항</span>
  </header>

  <section class="aprc-parent-question-narrative">
    <div class="aprc-parent-question-label">학부모 해석</div>
    <p>...</p>
  </section>

  <section class="aprc-parent-question-meaning">
    <div class="aprc-parent-question-label">이번 오답 의미</div>
    <p>...</p>
  </section>

  <section class="aprc-parent-question-action">
    <div class="aprc-parent-question-label">다음 수업 계획</div>
    <p>...</p>
  </section>

  <section class="aprc-parent-question-original">
    <div class="aprc-parent-question-label">실제 문항</div>
    ...
  </section>
</article>
```

### 2. 표시 정보

각 카드에 반드시 표시한다.

* 문항 번호
* 단원
* 유형
* 배점
* 난도
* 전체 정답률
* 반 정답률
* 문항 원문
* 선택지
* 학부모 해석
* 이번 오답 의미
* 다음 수업 계획

정답은 기본 숨김으로 한다.
선생님 옵션으로만 표시 가능하게 한다.

```js
showAnswer: false 기본
```

### 3. 문항 원문 처리

문항 원문이 있으면 표시한다.

```js
detail.content || row.content
```

선택지가 있으면 번호와 함께 표시한다.

문항 원문이 없으면:

```text
문항 원문을 불러오지 못했습니다. 수업에서는 해당 문항을 직접 다시 확인합니다.
```

단, 학부모 출력에서는 “아카이브”, “원문 로드 실패” 같은 내부 표현 금지.

### 4. 카드 CSS

전용 CSS:

```css
.aprc-parent-question-card {
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px;
  background: #fff;
  break-inside: avoid;
}

.aprc-parent-question-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.aprc-parent-question-no {
  font-size: 15px;
  font-weight: 900;
  color: #111827;
}

.aprc-parent-question-meta {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.aprc-parent-question-badge {
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 900;
  background: #eff6ff;
  color: #1d4ed8;
  white-space: nowrap;
}

.aprc-parent-question-label {
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 900;
  color: #1d4ed8;
}

.aprc-parent-question-card p {
  margin: 0;
  line-height: 1.65;
  font-size: 13px;
  color: #111827;
}
```

## DoD

* 학부모 상세 리포트의 실제 오답 문제 영역이 기존 raw 카드가 아니라 새 parent card로 렌더된다.
* 각 카드에서 정답률과 난도와 단원이 한눈에 보인다.
* 문항 원문보다 “학부모 해석/오답 의미/다음 계획”이 더 잘 보인다.
* 카드 내부 순서가 `헤더 → 학부모 해석 → 이번 오답 의미 → 다음 수업 계획 → 실제 문항`이다.
* 내부 용어 `archive`, `blueprint`, `review_text`, `코호트`가 학부모 카드에 나오지 않는다.

---

# STEP 3 — 문항별 학부모 상담문 고도화

## 목표

현재 `reportCenterBuildParentQuestionNarrative()`는 구조는 있으나, 문장이 아직 일반론에 머물 수 있다.
정답률, 태그, 단원, 함정, 풀이 포인트를 조합해서 더 구체적인 학부모 문장으로 만든다.

## 대상 파일

```text
apmath/js/report-center.js
apmath/js/report-text.js 필요 시
tests/report-parent-question-narrative.test.mjs 신규 또는 기존 보강
```

## 작업 내용

### 1. narrative 로직 확장

현재 반환:

```js
{ headline, reason, meaning, action }
```

유지하되, 내부 생성 기준을 강화한다.

### 2. 정답률 구간별 headline

```js
rate >= 85:
  "전체 정답률 90% 안팎의 기본 문항입니다."

65 <= rate < 85:
  "기본 개념을 알고 있어도 풀이 순서에서 실수가 나올 수 있는 문항입니다."

45 <= rate < 65:
  "전체적으로도 쉽지 않았던 응용 문항입니다."

rate < 45:
  "전체 정답률 N%의 매우 어려운 최상위 문항입니다."
```

숫자는 문항 카드 meta에 이미 있으므로, 문장에서는 반복 횟수를 줄인다. 단, 최상위 문항은 숫자를 한 번 허용한다.

### 3. 태그별 meaning/action 개선

태그별 문장:

#### 계산·검산

```text
대부분의 학생이 해결한 문항이기 때문에 개념 부족보다는 계산, 부호, 검산 과정에서 실수가 있었을 가능성이 큽니다.
다음 수업에서는 풀이 후 마지막 확인 습관을 바로 점검하겠습니다.
```

#### 풀이 순서

```text
개념은 알고 있어도 어느 단계부터 정리할지 흔들리면 실점할 수 있는 문항입니다.
같은 유형을 짧게 반복해 풀이 순서를 안정적으로 잡겠습니다.
```

#### 조건 해석

```text
조건을 식으로 옮기고 범위를 끝까지 확인하는 과정이 핵심이었습니다.
활용 문제에서 문장을 수식으로 바꾸는 연습을 함께 보완하겠습니다.
```

#### 개념 재정리

```text
해당 개념을 문제에 적용하는 과정이 아직 충분히 안정되지 않은 것으로 보입니다.
기본 개념을 다시 확인한 뒤 유사 문제로 적용 연습을 진행하겠습니다.
```

### 4. 단원 키워드별 보정

문항 unit/concept에 아래 키워드가 있으면 action을 더 구체화한다.

* 함수 / 그래프 / 활용
  → `상황 해석 → 식 세우기 → 값 확인` 순서 언급
* 이차방정식 / 판별식 / 근
  → `조건 정리와 식 변형` 언급
* 인수분해
  → `부호 확인과 전개 검산` 언급
* 부등식 / 범위
  → `범위 표시와 경계값 확인` 언급
* 확률 / 경우의 수
  → `조건 분류와 중복 확인` 언급
* 도형
  → `그림에서 조건을 표시하고 관계식을 세우기` 언급

### 5. 함정/trap 반영

`reviewData.trap`이 자연문이면 reason에 반영한다.
단, 수식만 있거나 코드처럼 보이면 제외한다.

이미 있는 `reportCenterTrapReadsNatural()`을 재사용한다.

### 6. 학부모 금지 표현 필터

다음 표현은 최종 문장에 나오면 안 된다.
문항 카드 meta의 `전체 정답률 N%`, `반 정답률 N%`는 이번 3차 출력에서 허용한다.
다만 본문 상담 문장에는 통계 숫자를 반복하지 말고, 필요하면 “기본 문항”, “난도 있는 문항”, “최상위 문항”처럼 해석형 문장으로 쓴다.

```text
코호트
blueprint
archive
아카이브
review_text
raw
데이터 없음
확인 불가
자료 부족
못함
부족함
위험
심각
```

단, 내부 선생님용 분석표에는 raw 표현 허용.

## DoD

* 쉬운 문항 오답은 “계산/검산 실수 가능성”으로 해석된다.
* 정답률 낮은 문항은 “최상위/고난도 대비”로 해석된다.
* 함수/활용/조건해석 문항은 “문해력/조건 정리/식 세우기” 계열 문장이 나온다.
* 문항마다 `headline`, `reason`, `meaning`, `action`이 서로 중복되지 않는다.
* 한 리포트 안에서 같은 문장 시작이 반복되지 않는다.

---

# STEP 4 — 학부모 상세 리포트의 “문항 요약 → 실제 문제” 순서 조정

## 목표

학부모가 받았을 때 문제 원문이 먼저 크게 보이면 부담스럽다.
상담 리포트는 “진단 → 이유 → 실제 문제 근거” 순서가 더 좋다.

## 대상 파일

```text
apmath/js/report-center.js
tests/report-school-exam-detail-report.test.mjs 신규 또는 보강
```

## 작업 내용

`reportCenterBuildSchoolExamDetailedParentReport()`의 실제 오답 문제 섹션 구조를 바꾼다.

현재 느낌:

```text
실제 오답 문제
- 문제 원문
- 문항 분석
```

개선:

```text
실제 오답 문제
먼저 볼 문항 3~5개를 중심으로 정리했습니다.

[문항 카드]
1. 학부모 해석
2. 이번 오답 의미
3. 다음 수업 계획
4. 실제 문항
```

즉 카드 내부 순서를:

```text
헤더
학부모 해석
이번 오답 의미
다음 수업 계획
실제 문항
```

로 한다.

문항 원문은 접힘 처리하지 않는다. PDF에서 접힘은 의미가 없으므로 항상 표시하되, 아래쪽에 둔다.

### 우선순위

오답 문항이 많으면 전부 보여주면 리포트가 너무 길어진다.

기준:

* 오답 1~5개: 전부 표시
* 오답 6개 이상: 우선 문항 5개 표시 + 나머지는 “다음 수업에서 순차 확인” 문구

우선순위는 기존 `reportCenterSelectPriorityWrongRows()`를 그대로 바꾸지 말고, 학부모 상세 리포트 전용 선택 함수로 감싼다.
기존 함수는 다른 화면에서 쓰일 수 있으므로 의미를 바꾸지 않는다.

```js
function reportCenterSelectParentReportWrongRows(wrongRows = [], limit = 5) {}
```

이 전용 함수 안에서 정답률 높은데 틀린 문항을 우선 보여준다.

단, 최상위 문항도 1개는 포함한다.

로직:

```js
priorityMistakes = 정답률 높은 오답 상위 3개
hardQuestions = 정답률 낮은 오답 상위 2개
merge unique up to 5
```

merge 기준은 `questionNo` 우선, 없으면 `questionId/id`를 사용한다.
중복 제거 후 5개가 안 차면 기존 우선순위 정렬 결과에서 남은 문항을 채운다.

## DoD

* 학부모 상세 리포트는 문제보다 해석이 먼저 보인다.
* 오답 6개 이상이어도 PDF가 지나치게 길어지지 않는다.
* 쉬운 실수 문항과 고난도 문항이 모두 최소 1개 이상 반영된다.
* 나머지 오답은 “클리닉/수업에서 순차 확인” 문장으로 안내된다.
* `reportCenterSelectPriorityWrongRows()`의 기존 동작은 깨지지 않는다.

---

# STEP 5 — 저장/AI/원문 로딩 상태 표시

## 목표

선생님이 지금 데이터가 서버에 저장됐는지, AI 분석이 적용됐는지, 문항 원문이 로드됐는지 알 수 있어야 한다.

## 대상 파일

```text
apmath/js/report-center.js
tests/report-school-exam-status-badges.test.mjs 신규
```

## 작업 내용

### 1. 학생별 화면 상단에 상태 badge 추가

학생별 상세 화면 `reportCenterBuildStudentView()` 안에 상태 줄 추가.

표시 예:

```text
원문 로드 완료 · 서버 저장본 적용 · 프리미엄 분석 적용
```

가능 상태:

* `문항 원문 로드 완료`
* `문항 원문 일부 없음`
* `서버 저장본 적용`
* `로컬 임시 저장`
* `프리미엄 분석 적용`
* `기본 문구 사용 중`

### 2. 서버 저장 실패 toast 개선

현재 `reportCenterSyncStudentReportToServer()`는 실패해도 console warn만 한다.
이 함수 자체는 조용히 실패해도 되지만, 저장 버튼을 누른 직접 액션에서는 결과를 알려야 한다.

API 경로는 현재 프론트가 쓰는 `student-reports`를 유지한다.
이번 STEP에서 `exams/student-reports` 같은 새 경로로 바꾸지 않는다.

`reportCenterSaveSchoolExamCounselReport()`에서:

```js
const syncResult = await reportCenterSyncStudentReportToServer(...)
if (syncResult) toast('상담 리포트를 서버에 저장했습니다.', 'success')
else toast('서버 저장은 실패했습니다. 이 화면에는 임시 저장되었습니다.', 'warn')
```

주의: 현재 함수는 sync를 await 하지 않는다.
이번 STEP에서 `reportCenterSaveSchoolExamCounselReport`를 async로 바꾸고 onclick 호출이 문제없는지 확인한다.
로컬 저장은 서버 저장보다 먼저 끝내며, 서버 저장 실패가 로컬 저장을 되돌리면 안 된다.
저장 후 화면 재렌더는 toast 이후 한 번만 실행해 중복 모달 갱신을 피한다.

### 3. AI 저장 결과 표시

`reportCenterRequestSchoolExamAiAnalysis()`는 현재 AI 결과를 서버에 sync 요청한다.
여기서 sync 결과를 await하고 성공/실패 메시지를 분리한다.

* AI 생성 성공 + 서버 저장 성공
* AI 생성 성공 + 서버 저장 실패, 로컬 캐시만 적용
* AI 실패

AI 결과 역시 서버 저장 실패 시 `reportCenterSetCachedAiAnalysis()`로 반영된 로컬 캐시는 유지한다.

### 4. 원문 로딩 상태

archive details 캐시가 있으면:

```text
문항 원문 로드 완료
```

없으면:

```text
문항 원문 불러오는 중
```

실패하면:

```text
문항 원문 일부 없음
```

학부모 리포트 본문에는 내부 상태를 노출하지 않는다.
상태 badge는 선생님 화면에만 표시.

## DoD

* 저장 버튼 클릭 후 서버 저장 성공/실패가 구분된다.
* AI 분석 후 서버 저장 성공/실패가 구분된다.
* 학생별 화면에서 현재 리포트가 서버본인지 로컬본인지 알 수 있다.
* 학부모 PDF에는 “서버 저장”, “로컬”, “AI 캐시” 같은 내부 표현이 나오지 않는다.
* 테스트에서 `api.post` 호출 경로가 `student-reports`임을 확인한다.
* `api.post` 실패 시에도 로컬 상담 수정본과 AI 캐시가 남는다.

---

# STEP 6 — 테스트/하니스/최종 보고

## 목표

이번 수정이 실제로 사용자 문제를 해결했는지 HTML 레벨로 확인 가능한 덤프를 만든다.

## 대상 파일

```text
tests/report-school-exam-detail-print.test.mjs
tests/report-parent-question-card.test.mjs
tests/report-parent-question-narrative.test.mjs
tests/report-school-exam-status-badges.test.mjs
reports/loop-c-school-exam-parent-detail-dump.html
reports/loop-c-school-exam-parent-print-dump.html
CODEX_RESULT_SCHOOL_EXAM_PARENT_REPORT_20260705.md
```

## 필수 테스트 명령

신규 테스트:

```bash
node tests/report-school-exam-detail-print.test.mjs
node tests/report-parent-question-card.test.mjs
node tests/report-parent-question-narrative.test.mjs
node tests/report-school-exam-status-badges.test.mjs
```

기존 회귀:

```bash
node tests/report-exam-archive-ai.test.mjs
node tests/report-student-report-sync.test.mjs
node tests/report-exam-analysis-print.test.mjs
node tests/report-exam-analysis-table.test.mjs
node tests/report-center-exam-dashboard.test.mjs
node tests/report-school-exam-counsel.test.mjs
node tests/report-school-exam-edit.test.mjs
node tests/report-parent-safe-comment.test.mjs
node tests/report-math-normalize.test.mjs
node tests/report-review-schema.test.mjs
node tests/report-pdf-dedup.test.mjs
node tests/apmath-global-surface.test.js
```

문법:

```bash
node --check apmath/js/report-center.js
```

전역 함수 추가 시:

```bash
node tests/apmath-global-surface.test.js --update
```

단, 변경 파일은 `tests/fixtures/apmath-surface-report.json`만 허용한다.
classroom/dashboard fixture 변경 금지.

## 하니스 생성

실제 더미 데이터로 아래를 생성한다.
생성 방식은 별도 하니스 스크립트 또는 `node -e` 덤프 중 하나를 사용하되, 최종 보고서에 사용한 명령을 그대로 적는다.
권장 방식은 재실행 가능한 스크립트다.

```text
tests/build-school-exam-parent-report-harness.mjs 신규 또는 동등한 node 덤프 명령
```

```text
reports/loop-c-school-exam-parent-detail-dump.html
reports/loop-c-school-exam-parent-print-dump.html
```

하니스 조건:

* 학생 1명
* 오답 5개 이상
* 쉬운 문항 오답 1개: 정답률 90% 이상
* 중간 문항 오답 1개
* 조건 해석 문항 1개
* 최상위 문항 1개: 정답률 40% 미만
* 함수/활용 키워드 포함 문항 1개
* archive detail 포함
* AI review JSON 포함

하니스에서 확인할 것:

* 제목 겹침 없음
* 카드가 페이지 중간에서 심하게 잘리지 않음
* 학부모 카드에 내부 단어 없음
* 쉬운 문항은 계산/검산 실수로 안내
* 최상위 문항은 고난도 대비로 안내
* 함수 활용 문항은 문해력/조건 해석/식 세우기 안내
* 실제 문제 원문이 나오되 해석보다 덜 튀지 않음

---

# 최종 결과 보고서 형식

Codex는 완료 후 아래 파일을 만든다.

```text
CODEX_RESULT_SCHOOL_EXAM_PARENT_REPORT_20260705.md
```

내용:

```md
# 학교시험 학부모 상세 리포트 고도화 결과

## 1. 작업 요약
- STEP 1 ...
- STEP 2 ...

## 2. 수정 파일
- apmath/js/report-center.js
- tests/...

## 3. 개선된 사용자 경험
- 출력 깨짐 해결
- 문항별 학부모 해석 강화
- 저장 상태 표시

## 4. 검증 결과
명령어와 결과 전체 기재

## 5. 남은 리스크
- 실제 브라우저 PDF 인쇄 최종 확인 필요
- AI 문항 분석 문장 수학적 타당성은 실데이터로 사람 검수 필요
- 긴 문항/이미지 포함 문항은 별도 출력 검수 필요

## 6. 배포 전 확인
- Git status
- 최근 commit hash
- main...origin/main 상태
```

---

# 커밋 계획

STEP별 커밋한다.

```text
STEP 1: fix(report): isolate school exam detail print layout
STEP 2: feat(report): add parent wrong question card
STEP 3: improve(report): enrich parent question narrative
STEP 4: improve(report): reorder detailed parent report for counseling
STEP 5: feat(report): show report sync and source status
STEP 6: test(report): add parent detail print harness and result report
```

커밋 메시지 끝:

```text
Co-Authored-By: Codex <noreply@anthropic.com>
```

---

# 최종 DoD

이번 goal은 아래가 모두 만족되어야 완료다.

* 학생별 상세 리포트 출력에서 제목/선/상단바 겹침이 재발하지 않는다.
* 학부모 리포트의 오답 문항 카드가 `문항 정보 → 학부모 해석 → 오답 의미 → 다음 수업 계획 → 실제 문항` 구조로 나온다.
* 정답률 85% 이상 문항 오답은 계산/검산 실수 가능성으로 안내된다.
* 정답률 45% 미만 문항은 최상위/고난도 대비 문항으로 안내된다.
* 함수/활용/조건 해석 문항은 문해력·조건 정리·식 세우기 계열 안내가 나온다.
* 오답이 많아도 학부모 PDF가 무한정 길어지지 않는다.
* 저장 성공/실패/서버본/로컬본/AI 적용 여부가 선생님 화면에서 구분된다.
* 학부모 PDF에는 내부 개발 용어가 나오지 않는다.
* 기존 학교시험 분석표, 학생별 저장, 시험지 단위 AI 분석 기능이 깨지지 않는다.
* 신규 테스트와 기존 회귀 테스트가 모두 통과한다.

---

