# CODEX TASK — 학교시험 상세 학부모 리포트 출력 V2 재구축 계획서

## 0. 결론

현재 `학교시험 상세 학부모 리포트` 출력은 학부모 발송용 완성 리포트가 아니라, 상담 리포트용 텍스트 블록을 출력 화면에 감싼 수준이다.

이번 태스크의 목표는 **문구 몇 개를 바꾸는 패치가 아니라**, 학교시험 학생별 출력물을 평가리포트 수준의 **카드형 학부모 발송 리포트**로 재구축하는 것이다.

---

## 1. 실제 코드 확인 근거

### 1-1. 문제 제목과 부제는 코드에 하드코딩되어 있음

대상 파일:

```text
apmath/js/report-center.js
```

현재 `reportCenterBuildSchoolExamDetailedPrintDocument()`는 출력 헤더를 다음 구조로 만든다.

```js
<h1>${studentName} 상세 학부모 리포트</h1>
<p>학교시험 오답과 다음 수업 관리 계획을 정리했습니다.</p>
```

문제:
- `서유나 상세 학부모 리포트`는 학부모 발송 문서 제목으로 부적절하다.
- `학교시험 오답과 다음 수업 관리 계획...` 문장은 내부 설명문 느낌이 강하고, 발송용 문서에 필요 없다.
- 학생명은 제목이 아니라 정보 카드/학생 정보 영역에서 보여주는 편이 낫다.

### 1-2. 상세 출력 문서가 점수 카드 없이 상담 리포트 본문만 감싸고 있음

`reportCenterBuildSchoolExamDetailedPrintDocument()`는 실제 본문으로 아래 함수만 붙인다.

```js
reportCenterBuildSchoolExamDetailedParentReport(studentId, archiveFile, {
  archiveDetails: data.archiveDetails,
  printMode: true,
  hideInnerHeader: true
})
```

문제:
- `reportCenterGetExamReportData()`로 점수, 평균, 문항 수, 오답 수, 반 평균을 가져오고도 출력 레이아웃에서는 평가리포트형 점수 카드가 없다.
- 현재 출력 첫 페이지가 텍스트 위주로 시작해서 학부모가 가장 먼저 봐야 할 `점수 / 평균 / 오답 수 / 정답률`이 시각적으로 잡히지 않는다.

### 1-3. 상세 리포트 본문은 상담 섹션 4개뿐임

현재 `reportCenterBuildSchoolExamDetailedParentReport()`의 출력 구조는 다음 4개 섹션이다.

```text
시험 요약
다음 수업 계획
실제 오답 문제
학부모 안내 문구
```

문제:
- 평가리포트에 있는 카드형 요약 구조가 없다.
- 점수 비교 카드, 오답 원인 카드, 다음 수업 계획 카드가 분리되어 있지 않다.
- 전체가 단순 문단 서술처럼 보인다.

### 1-4. 불필요한 문구가 실제 코드에 들어 있음

현재 코드에는 아래 문구가 실제 출력된다.

```js
<p>먼저 볼 문항을 중심으로 정리했습니다.</p>
```

문제:
- 학부모용 리포트에는 `먼저 볼 문항`이라는 내부 선별 기준을 드러낼 필요가 없다.
- 형님 지시대로 문항은 번호순으로 정리하는 것이 낫다.

### 1-5. 문항 선별 로직이 번호순이 아님

현재 `reportCenterSelectParentReportWrongRows()`는 쉬운 문항 실수 3개 + 어려운 문항 2개를 섞고, 이후 우선순위 정렬을 보충하는 방식이다.

문제:
- 학부모 출력물에서는 `8번 → 9번 → 10번 → 17번 → 22번`처럼 오답 번호순이 가장 자연스럽다.
- 현재 테스트도 `[1, 2, 3, 5, 4]` 같은 우선순위 순서를 기대하고 있어 수정이 필요하다.

### 1-6. 문항 카드에 불필요한 내부 라벨이 있음

현재 `reportCenterBuildParentWrongQuestionCard()`는 다음 라벨을 만든다.

```js
const badge = Number(row?.correctRate ?? detail?.correctRate) < 45 ? '최상위 문항' : '우선 확인 문항';
...
<div class="aprc-parent-question-label">실제 문항</div>
```

문제:
- `우선 확인 문항`은 학부모에게 필요한 말이 아니다.
- `최상위 문항`도 과장/내부 난도 라벨처럼 보인다.
- `실제 문항`이라는 말도 출력물에 불필요하다. 보여줄 거면 그냥 문항 원문/문제 본문으로 자연스럽게 들어가면 된다.

### 1-7. 현재 테스트가 문제 문구를 통과 기준으로 잡고 있음

현재 테스트는 다음을 기대한다.

```js
assert.match(html, /먼저 볼 문항/);
assert.equal(JSON.stringify(selected.map(row => row.questionNo)), JSON.stringify([1, 2, 3, 5, 4]));
assert.match(card, /실제 문항/);
```

문제:
- 테스트 자체가 현재 문제 구조를 보호하고 있다.
- 이번 태스크에서는 테스트 기준부터 학부모 발송용 계약으로 바꿔야 한다.

---

## 2. 최종 목표 화면 구조

### 2-1. 출력 제목

현재:

```text
서유나 상세 학부모 리포트
학교시험 오답과 다음 수업 관리 계획을 정리했습니다.
```

변경:

```text
AP MATH REPORT
기말고사 분석 리포트
```

또는 시험명이 없을 때:

```text
AP MATH REPORT
학교시험 분석 리포트
```

학생명은 제목이 아니라 아래 학생 정보 카드에 표시한다.

```text
학생: 서유나
시험: 기말고사
반: 중3A
점수: 78점
```

금지:
- `상세 학부모 리포트`
- `학교시험 오답과 다음 수업 관리 계획을 정리했습니다.`
- `먼저 볼 문항`
- `우선 확인 문항`
- `실제 문항`
- `프리미엄 분석 적용`
- `기본값 · 학부모 상담/출력용`

---

## 3. 수정 대상 파일

필수 수정:

```text
apmath/js/report-center.js
tests/report-school-exam-detail-print.test.mjs
tests/report-school-exam-detail-report.test.mjs
tests/report-parent-question-card.test.mjs
```

필요 시 수정:

```text
apmath/js/report-print.js
apmath/js/report-text.js
reports/loop-c-school-exam-parent-print-dump.html
reports/loop-c-school-exam-parent-detail-dump.html
```

수정 금지:
- JS아카이브 엔진 전체 구조
- QR/OMR 입력 구조
- 학생 상세 일반 화면
- EIE 화면
- Cloudflare Worker API 계약

---

## 4. 구현 계획

## STEP 1. 학교시험 출력 전용 V2 빌더 만들기

`reportCenterBuildSchoolExamDetailedPrintDocument()`를 단순 wrapper에서 출력 전용 문서 빌더로 바꾼다.

권장 구조:

```js
function reportCenterBuildSchoolExamParentPrintDocument(studentId, sessionId, options = {}) {
  const data = reportCenterWithArchiveDetails(
    reportCenterGetExamReportData(studentId, sessionId),
    options.archiveDetails || null
  );

  // 1. 데이터 검증
  // 2. 출력 계약 데이터 생성
  // 3. A4용 카드형 HTML 생성
}
```

기존 함수명은 외부 호출처 때문에 유지해도 된다.

```js
function reportCenterBuildSchoolExamDetailedPrintDocument(studentId, sessionId, options = {}) {
  return reportCenterBuildSchoolExamParentPrintDocument(studentId, sessionId, options);
}
```

---

## STEP 2. 첫 페이지를 카드형 요약으로 재구성

첫 페이지에 반드시 아래 카드가 보여야 한다.

### A. 학생/시험 정보 카드

필수 출력:
- 학생명
- 시험명
- 시험일
- 반명
- 학년/학교 정보가 있으면 표시
- 총 문항 수

### B. 점수 카드

필수 출력:
- 이번 시험 점수
- 정답률
- 오답 수
- 전체 평균
- 반 평균
- 전체 평균 대비
- 반 평균 대비
- 응시자 수 / 반 응시자 수

값이 없으면 숨기지 말고 `-`로 표시한다.

### C. 핵심 진단 카드

필수 출력:
- 주요 오답 단원 2개 이내
- 반복 오답 유형 2개 이내
- 쉬운 문항 실수 여부
- 고난도 문항 오답 여부

### D. 다음 수업 계획 카드

필수 출력:
- 다음 수업에서 다시 풀 문항 번호
- 다시 확인할 풀이 습관
- 유사 문항/고난도 문항 연결 계획

---

## STEP 3. 상세 본문 섹션명 정리

현재:

```text
시험 요약
다음 수업 계획
실제 오답 문제
학부모 안내 문구
```

변경:

```text
시험 결과 요약
이번 시험에서 확인된 부분
문항별 오답 정리
다음 수업 계획
학부모님께 드리는 안내
```

단, 첫 페이지 카드에서 이미 충분히 보이는 항목은 중복하지 않는다.

---

## STEP 4. 오답 문항 정렬을 번호순으로 고정

새 함수 추가:

```js
function reportCenterSortWrongRowsByQuestionNo(wrongRows = []) {
  return [...(wrongRows || [])].sort((a, b) => {
    const aq = Number(a.questionNo ?? a.question_no ?? a.question_id ?? a.questionId ?? 0);
    const bq = Number(b.questionNo ?? b.question_no ?? b.question_id ?? b.questionId ?? 0);
    return aq - bq;
  });
}
```

`reportCenterBuildSchoolExamDetailedParentReport()` 또는 새 V2 빌더에서 학부모 출력용 문항은 이 함수를 사용한다.

변경 전:
- 쉬운 실수 + 어려운 문항 우선 선별
- 최대 5개
- 나머지는 `나머지 N개 문항...` 문구 출력

변경 후:
- 오답 문항 전체를 번호순 출력
- 문항이 너무 많으면 페이지가 늘어나는 것을 허용
- 내부 선별 문구 제거

---

## STEP 5. 문항 카드 V2 작성

기존 `reportCenterBuildParentWrongQuestionCard()`는 내부 라벨이 강하다. 학부모 출력용 V2 카드를 따로 둔다.

```js
function reportCenterBuildParentWrongQuestionCardV2(row, detail = null, options = {}) {}
```

카드 구조:

```html
<article class="aprc-school-q-card">
  <header class="aprc-school-q-card-head">
    <div class="aprc-school-q-no">8번</div>
    <div class="aprc-school-q-title">이차방정식</div>
    <div class="aprc-school-q-meta">
      난도 상 · 전체 7% · 반 25%
    </div>
  </header>

  <div class="aprc-school-q-comment">
    조건을 식으로 옮기고 범위를 확인하는 과정에서 보완할 부분이 확인되었습니다...
  </div>

  <div class="aprc-school-q-body">
    <!-- 문제 원문 또는 핵심 조건 요약 -->
  </div>
</article>
```

제거:
- `우선 확인 문항`
- `최상위 문항`
- `실제 문항`
- `학부모 해석`
- `이번 오답 의미`

선택 출력:
- 정답
- 학생 답
- 배점
- 서술형/객관식
- 문항 원문

학생 답/정답 데이터가 없으면 억지로 만들지 않는다.

---

## STEP 6. 수식 렌더링 실패 차단

현재 `reportCenterTypesetMath()`는 MathJax 실패 시 console warning만 남기고 계속 진행한다.

수정:
1. 출력 전 문서 안에서 아래 문자열을 검사한다.
   - `Misplaced &`
   - `MathJax error`
   - `Undefined control sequence`
   - `TeX parse error`
2. 검사 실패 시 인쇄 버튼을 비활성화하고 toast 표시.
3. 문서 상단에도 내부 오류 대신 교사용 경고 박스를 표시한다.

예시:

```js
function reportCenterValidatePrintableMath(root) {
  const text = root?.innerText || root?.textContent || '';
  const badTokens = ['Misplaced &', 'MathJax error', 'Undefined control sequence', 'TeX parse error'];
  return {
    ok: !badTokens.some(token => text.includes(token)),
    badTokens: badTokens.filter(token => text.includes(token))
  };
}
```

출력 금지 조건:
- 수식 에러 문자열이 화면에 남아 있음
- 문항 원문에 렌더링 실패 텍스트가 노출됨

---

## STEP 7. CSS/프린트 레이아웃 보강

추가/수정할 클래스:

```css
.aprc-school-report-document
.aprc-school-report-head
.aprc-school-student-summary
.aprc-school-score-grid
.aprc-school-score-card
.aprc-school-diagnosis-grid
.aprc-school-plan-card
.aprc-school-question-list
.aprc-school-q-card
.aprc-school-q-card-head
.aprc-school-q-comment
.aprc-school-q-body
.aprc-school-parent-message
```

인쇄 기준:
- A4 기준
- 첫 페이지에 요약 카드가 반드시 들어가야 함
- 카드 `break-inside: avoid`
- 페이지 상단 헤더 중복 없음
- 앱 헤더/모바일 헤더/툴바는 인쇄 제외
- 문항 카드가 페이지 중간에서 찢어지지 않게 함
- 카드 테두리와 배경이 PDF에서도 보이도록 `print-color-adjust: exact`

---

## STEP 8. 테스트 수정

### 8-1. `tests/report-school-exam-detail-print.test.mjs`

현재 기대를 변경한다.

삭제할 기대:
```js
assert.match(doc, /<h1>민서 상세 학부모 리포트<\/h1>/);
```

추가할 기대:
```js
assert.match(doc, /AP MATH REPORT/);
assert.match(doc, /중간고사 분석 리포트|학교시험 분석 리포트/);
assert.match(doc, /이번 시험 점수|점수/);
assert.match(doc, /정답률/);
assert.match(doc, /전체 평균/);
assert.match(doc, /반 평균|우리 반/);
assert.doesNotMatch(doc, /상세 학부모 리포트/);
assert.doesNotMatch(doc, /학교시험 오답과 다음 수업 관리 계획을 정리했습니다/);
assert.doesNotMatch(doc, /먼저 볼 문항/);
assert.doesNotMatch(doc, /우선 확인 문항/);
assert.doesNotMatch(doc, /실제 문항/);
assert.doesNotMatch(doc, /기본값 · 학부모 상담\/출력용/);
```

### 8-2. `tests/report-school-exam-detail-report.test.mjs`

현재 기대를 변경한다.

삭제:
```js
assert.match(html, /먼저 볼 문항/);
assert.equal(JSON.stringify(selected.map(row => row.questionNo)), JSON.stringify([1, 2, 3, 5, 4]));
assert.match(html, /나머지 1개 문항/);
```

추가:
```js
const sorted = context.reportCenterSortWrongRowsByQuestionNo([...]);
assert.deepEqual(sorted.map(row => row.questionNo), [1, 2, 3, 4, 5, 6]);

assert.doesNotMatch(html, /먼저 볼 문항/);
assert.doesNotMatch(html, /나머지 \d+개 문항/);
assert.doesNotMatch(html, /우선 확인 문항|최상위 문항|실제 문항/);
```

### 8-3. `tests/report-parent-question-card.test.mjs`

현재 기대를 변경한다.

삭제:
```js
assert.match(card, /실제 문항/);
```

추가:
```js
assert.doesNotMatch(card, /실제 문항/);
assert.doesNotMatch(card, /우선 확인 문항/);
assert.doesNotMatch(card, /최상위 문항/);
assert.match(card, /8번/);
assert.match(card, /일차방정식/);
assert.match(card, /전체 정답률 32%|전체 32%/);
```

### 8-4. 신규 테스트 추가

파일:

```text
tests/report-school-exam-parent-print-contract.test.mjs
```

검증:
- 금지 문구 없음
- 점수/평균/정답률/오답 수 표시
- 오답 문항 번호순 출력
- 카드 클래스 존재
- `Misplaced &`가 들어간 문항은 출력 검증 실패 처리
- MathJax 실패 문구가 그대로 노출되지 않음

---

## 5. 루프 엔지니어링 검수 방식

## LOOP A — Static Contract Check

명령:

```bash
grep -R "상세 학부모 리포트\|학교시험 오답과 다음 수업 관리 계획\|먼저 볼 문항\|우선 확인 문항\|실제 문항\|기본값 · 학부모 상담/출력용" apmath/js tests reports -n
```

PASS:
- 실제 출력 HTML 생성 코드에는 금지 문구가 없어야 한다.
- 테스트 fixture에서 의도적으로 금지어 검증용으로 쓰는 경우만 주석으로 허용한다.

FAIL:
- 출력 코드나 dump에 금지 문구가 남아 있음.

---

## LOOP B — Node Unit Test

명령:

```bash
node tests/report-school-exam-detail-print.test.mjs
node tests/report-school-exam-detail-report.test.mjs
node tests/report-parent-question-card.test.mjs
node tests/report-school-exam-parent-print-contract.test.mjs
```

PASS:
- 모든 테스트 통과.
- 기존 문제 구조를 기대하는 테스트가 남아 있지 않음.

---

## LOOP C — HTML Dump Contract

명령 예시:

```bash
node tests/build-school-exam-parent-report-harness.mjs > reports/loop-c-school-exam-parent-print-dump.html
```

검수:
- dump에서 금지 문구 없음
- 첫 페이지 요약 카드 존재
- 문항 카드 존재
- 오답 번호순
- 점수/평균/정답률/오답 수 표시
- `Misplaced &` 없음

---

## LOOP D — 실제 브라우저 출력 확인

가능하면 로컬에서 실행:

```bash
npm test
```

또는 프로젝트에서 쓰는 개별 테스트 명령을 사용한다.

브라우저에서 확인:
1. 리포트 센터
2. 학교시험 분석
3. 학생 선택
4. 상세 리포트 출력
5. 인쇄/PDF 저장 미리보기

PASS:
- 첫 페이지가 비어 보이지 않음
- 점수 카드가 상단에 표시됨
- 제목이 자연스러움
- 문항 카드가 번호순
- 내부 라벨 없음
- 수식 깨짐 없음
- 카드/박스가 PDF에 유지됨

---

## 6. 최종 PASS 기준

최종 결과는 아래를 모두 만족해야 한다.

1. 제목은 `상세 학부모 리포트`가 아니다.
2. `학교시험 오답과 다음 수업 관리 계획을 정리했습니다.` 문구가 출력되지 않는다.
3. 첫 페이지에 점수/평균/정답률/오답 수 카드가 나온다.
4. 레이아웃이 카드형 리포트로 보인다.
5. 문항별 오답 정리는 번호순이다.
6. `먼저 볼 문항`, `우선 확인 문항`, `실제 문항` 문구가 없다.
7. `Misplaced &` 같은 수식 오류가 출력물에 노출되지 않는다.
8. 기존 평가리포트 수준의 기본 데이터가 학교시험 리포트에도 표시된다.
9. 테스트가 문제 구조를 보호하지 않고 새 학부모 발송 계약을 보호한다.
10. `reports/loop-c-school-exam-parent-print-dump.html` 최신본이 새 구조로 갱신된다.

---

## 7. 작업 금지 사항

- 단순 문자열 치환만 하고 끝내지 말 것.
- 기존 평가리포트 출력 기능을 깨지 말 것.
- 리포트 센터 전체 라우팅을 갈아엎지 말 것.
- JS아카이브 문항 렌더링 엔진을 이번 범위에서 대규모 수정하지 말 것.
- 문항 원문이 없을 때 가짜 문항을 만들지 말 것.
- 학생 답/정답 데이터가 없는데 임의로 표시하지 말 것.
- 테스트 기대값을 느슨하게 바꾸지 말 것.

---

## 8. Codex 제출 보고 형식

작업 완료 후 아래 형식으로 보고한다.

```text
RESULT: PASS / PARTIAL PASS / FAIL

SUMMARY
- 변경 파일:
- 핵심 수정:
- 테스트 결과:

BEFORE
- 기존 제목:
- 기존 금지 문구:
- 기존 정렬:

AFTER
- 새 제목:
- 새 카드 구조:
- 새 정렬:
- 수식 검증 방식:

TESTS
- node tests/report-school-exam-detail-print.test.mjs: PASS/FAIL
- node tests/report-school-exam-detail-report.test.mjs: PASS/FAIL
- node tests/report-parent-question-card.test.mjs: PASS/FAIL
- node tests/report-school-exam-parent-print-contract.test.mjs: PASS/FAIL

REMAINING
- 실제 브라우저 E2E 미검증이면 명시
- 데이터가 없어 표시하지 못한 항목이 있으면 명시
```

---

## 9. 실제 PDF 출력 검수 추가 (2026-07-07)

실제 출력된 학교시험 상세 학부모 리포트 PDF 4페이지(서유나 / 중3A / 78점)를 눈으로 검수한 결과, 위 STEP에 없거나 약하게만 적힌 **출력 파괴급 결함**이 확인되었다. 아래는 계획서에 추가로 반영해야 하는 항목이다.

### 9-1. [치명] 화면 UI가 PDF에 그대로 박제됨

증상:
- 1페이지 상단에 햄버거 메뉴(☰), 뒤로가기 버튼(‹), 앱 상단 헤더바(`AP` 로고 + `박준성`)가 그대로 출력됨.
- 즉 학부모 발송 PDF에 앱 내비게이션 크롬이 찍혀 나감.

원인 (코드 확인 완료 — 가설 아님, 확정):
- 전역 헤더는 `apmath/index.html:955`의 **클래스 없는 맨 `<header>`** 이고, 데스크톱 바는 `apmath/index.html:970`의 `.desktop-topbar`, 햄버거는 `.mobile-header-menu`, 뒤로가기는 `.app-back-btn` 이다.
- 그런데 인쇄 CSS(`apmath/js/report-center.js:6456` `@media print`)는 `.no-print, .report-print-toolbar, .app-header, .mobile-header, .topbar, #report-center-wide-overlay`만 숨긴다. → `.app-header` / `.mobile-header` / `.topbar` **세 셀렉터 모두 실제 DOM과 매칭되지 않는다**(실제 클래스는 없는 `<header>`, `.desktop-topbar`, `.mobile-header-left` 등).
- 게다가 `reportCenterOpenSchoolExamDetailedPrintView()`(`report-center.js:4202~4207`)는 `#app-root`의 `innerHTML`만 교체한다. `<header>`와 `.desktop-topbar`는 `#app-root`의 **형제 노드**(`index.html:979`)이므로 그대로 DOM에 남아 인쇄된다.

**확정 방향 (형님 승인): 옵션 B — 인쇄 전용 off-screen root로 분리.** 셀렉터 땜질(옵션 A)은 채택하지 않는다. 구체 구현은 11-A 참조.

검증:
- LOOP C dump HTML에 앱 헤더/햄버거/뒤로가기 관련 클래스·아이콘 마크업이 없어야 함.
- 브라우저 인쇄 미리보기 1페이지 최상단이 `AP MATH REPORT` 문서 헤더로 시작해야 함(앱 헤더 아님).

### 9-2. [치명] 표(table)가 한 줄로 붕괴됨

증상:
- 3페이지 17번(제동거리) 문항의 표가 `속력(km/h) 제동 거리(m) 16 2 24 4.5` 처럼 행/열 구조 없이 한 줄로 뭉개져 문제를 이해할 수 없음.

원인 (코드 확인 완료 — 확정):
- 문항 원문 → HTML 변환기 `reportCenterArchiveTextToHtml()`(`report-center.js:952`)에 **표 처리 로직이 전혀 없다.** `reportCenterEscape(reportCenterNormalizeMathText(text)).replace(/\n/g, '<br>')`가 전부라, 원문에 `<table>`이 있으면 그대로 이스케이프되어 문자로 보이고, 텍스트 표는 `<br>`로만 흘러 셀 구조가 사라진다.
- 게다가 문항 content는 `reportCenterLimitText(..., 260)`(`report-center.js:747`)를 거치는데 이 함수는 `reportCenterStripHtml`(`report-center.js:630`)로 **HTML 표 마크업을 평문으로 벗기고 260자로 잘라낸다.** → 셀들이 공백 나열(`속력(km/h) 제동 거리(m) 16 2 24 4.5`)로 붕괴.

**확정 방향 (형님 승인): 옵션 A — 아카이브 원문의 표 마크업을 살려 `<table>`로 렌더.** 추가로 **문항 원문의 이미지 태그(`<img>`)도 함께 불러와 렌더**한다. 구체 구현은 11-B / 11-C 참조.

요구사항 (신규 STEP — 문항 원문 표 + 이미지 보존):
- 문항 원문에 표가 있으면 `<table>` 구조를 유지하고, 인쇄용 표 스타일(테두리, 셀 패딩, `border-collapse`)을 명시.
- 문항 원문/구조화 필드의 이미지(`<img>`, `detail.image`)를 렌더한다. 상대경로는 아카이브 기준 절대경로로 해석하고, `data:` URI는 그대로 허용.
- 표/이미지가 페이지 경계에서 잘리지 않도록 `break-inside: avoid` 적용.
- 표·이미지를 텍스트로 평문화(flatten)하거나 잘라내지 말 것.

검증:
- 표가 포함된 문항 fixture로 dump 생성 시 `<table>`/`<tr>`/`<td>`가 유지되는지 테스트.
- 이미지가 포함된 문항 fixture로 dump 생성 시 `<img`가 살아있고 `src`가 유효 경로로 해석되는지 확인.
- 셀 값이 공백으로 나열되지 않고 행 단위로 렌더되는지 확인.

### 9-3. [치명] 수식·단위 렌더 실패 (STEP 6 근거 보강)

실측 확인:
- 4페이지 8번 문항에 `일차부등식 Misplaced &` 라는 MathJax 원시 에러 문자열이 그대로 노출됨.
- `km/h`, `m/s` 등 단위 위첨자/정렬이 어색하게 렌더됨.

원인 (코드 확인 완료 — 확정):
- `reportCenterNormalizeMathText()`(`report-center.js:19`)는 기존 `$...$` 마스킹 후 수식을 자동 `$...$` 래핑하지만, **한국어 "&"(그리고)나 정렬용 `&`가 수식 영역 안으로 들어가는 것을 막지 않는다.** (8번의 `일차부등식 & 이차방정식...`에서 `&`가 인라인 수식에 포함됨)
- MathJax v3는 `Misplaced &` 같은 오류에서 **예외를 throw하지 않고** `mjx-merror` 노드(가시 텍스트 `Misplaced &`)를 인라인으로 렌더한다.
- 따라서 `reportCenterTypesetMath()`(`report-center.js:994~1004`)의 `try/catch`는 절대 트리거되지 않고(=`typesetPromise`가 reject되지 않음), 에러 텍스트가 그대로 출력물에 남는다.

STEP 6에 추가/수정:
- 검증을 **소스 문자열이 아니라 타이프셋 후 DOM**에서 한다: 인쇄 root에서 `mjx-merror`(및 `.MathJax_Error`) 노드를 검사. 존재하면 출력 차단/경고.
- 검사 토큰에 `\\begin{`, `\\end{`, `\\hline`, `align`, `array` 관련 정렬(`&`) 미처리 케이스를 포함.
- 정렬(`&`)이 들어간 다중행 수식은 인라인 모드가 아니라 display 모드(`\\begin{aligned}` 등)로 렌더하도록 정규화. 수식 의도가 아닌 리터럴 `&`(한국어 "그리고")는 수식 밖 텍스트로 유지(수식 래핑 대상에서 제외).
- 단위 표기(`km/h`)는 텍스트 모드(`\\mathrm`)로 처리해 이탤릭 변수처럼 보이지 않게 함.

### 9-4. [높음] 1페이지 통째로 낭비 (빈 공간)

증상:
- 현재 1페이지는 상단 1/3에만 요약/계획 텍스트가 있고 나머지 2/3이 백지. 종이/페이지 1장이 공백으로 낭비됨.

요구사항:
- STEP 2의 요약 카드(학생정보/점수/진단/계획)가 첫 페이지를 실제로 채우도록 배치.
- 첫 페이지 하단에 큰 빈 공백이 남지 않도록 카드 그리드로 밀도 확보.
- 콘텐츠가 적어도 첫 페이지가 "빈 표지처럼" 보이지 않아야 함(PASS 기준 이미 존재 — 실측으로 재확인 필요).

### 9-5. [높음] 반복 문구로 템플릿 티가 남

증상:
- 22/9/17/8/10번 카드 코멘트가 "문제의 조건을 식으로 옮기고 범위까지 확인하는 과정에서 흔들린 것으로 보입니다"를 거의 그대로 반복.
- 개별 문항 분석이 아니라 자동 생성 문장 돌려막기로 읽힘.

원인 (코드 확인 완료 — 확정):
- `reportCenterBuildParentQuestionParagraph()`(`report-center.js:3458`)는 문장을 `isEasyMiss / isHard / isCondition / else` **4개 분기**로만 만든다(core·meaning·plan 각 4택1).
- `isCondition` 판정 정규식이 `/조건|해석|범위|경계|함수|그래프|활용|부등식|방정식/`(`:3469`)로 너무 넓어, **수학 시험 단원 대부분(이차방정식·이차함수·그래프·부등식…)이 전부 이 분기로 떨어진다.**
- 결과적으로 대다수 문항이 동일한 core/meaning/plan 3문장을 그대로 복제. 유일한 개별 차별화 요소인 `reviewData.trap`(`:3466`)은 보통 비어 있어 문장이 똑같아진다.
- 참고: 프로젝트에 이미 `reportCenterIsDuplicateText`/`reportCenterPickNonDuplicateText`(`:59`, `:66`) 중복 회피 유틸이 있으나 이 문항 코멘트 경로에는 적용되어 있지 않다.

요구사항:
- 분기 신호를 넓힌다: 단원 계열(방정식/함수/그래프/부등식/통계/기하 등), 오답 태그(`reportCenterResolveErrorTag`), 문항 유형(객관식/서술형), 배점, 정답률 밴드를 조합해 훨씬 세분화.
- 각 신호 조합마다 **문형 풀(pool)** 을 두고, 같은 문서 안에서 이전에 쓴 문장과 겹치면 다음 후보로 넘긴다 → 기존 `reportCenterPickNonDuplicateText`를 이 경로에 연결.
- 동일 문서 내에서 같은 core/meaning/plan 문장이 3회 이상 반복되지 않도록 가드.
- (연결: 리포트 문구 뱅크 설계 방침)

검증:
- dump에서 동일 코멘트 문장이 N회(예: 3회) 이상 반복되면 실패 처리하는 테스트 추가.

### 9-6. [중간] 인쇄 브랜딩/구조 미비 — 푸터·점수 시각화·색

증상:
- 페이지 하단에 페이지 번호/학원명/생성일/연락처 푸터가 전혀 없음.
- 점수는 "+8점" 텍스트뿐, 반평균 대비 막대/도넛 같은 시각화 없음.
- 본문 전체가 흑백이라 섹션 위계가 약함(브랜드 컬러는 AP 로고에만 존재).

요구사항:
- 각 인쇄 페이지 하단에 푸터: `AP수학 · 생성일 YYYY-MM-DD · 페이지 n`.
- 점수 카드에 반평균/전체평균 대비를 최소한의 막대(가로 bar)로 시각화(색상은 print-color-adjust로 유지).
- 섹션 헤더/카드 강조에 브랜드 포인트 컬러 1~2개만 절제 사용.

### 9-7. [중간] 인쇄 선명도(폰트 흐림)

증상:
- 출력 글자가 얇고 흐릿하게 번져 보임(특히 소제목).

원인 가설:
- 웹폰트 미임베딩/서브셋 누락, 또는 화면 캡처성 렌더(래스터)로 인쇄됨.

요구사항:
- 인쇄 문서에서 본문 폰트 굵기·자간 확인, 필요한 웹폰트를 문서에 포함(또는 시스템 폰트 폴백 명시).
- 벡터 텍스트로 인쇄되는지 확인(이미지 캡처 인쇄 금지).

---

## 10. PASS 기준 추가 (9절 반영)

기존 6절 PASS 기준에 아래를 추가한다.

11. 인쇄물에 앱 헤더/햄버거/뒤로가기/하단탭 등 화면 UI가 나오지 않는다.
12. 문항 원문의 표가 행/열 구조로 정상 렌더된다(한 줄 붕괴 금지).
13. 첫 페이지 하단에 큰 빈 공백이 남지 않는다.
14. 문항 코멘트가 동일 문장으로 반복되지 않는다.
15. 각 페이지에 푸터(학원명/생성일/페이지번호)가 있다.
16. 점수 대비가 최소한의 시각화로 표시된다.
17. 단위(`km/h` 등)·다중행 수식이 깨지지 않고 렌더된다.
18. 문항 원문의 이미지(`<img>` / `detail.image`)가 인쇄물에 렌더된다.

---

## 11. 확정 방향 구현 STEP (2026-07-07, 형님 승인분)

9절 검수와 코드 확인 결과에 대해 형님이 아래 방향을 승인했다. 이 절이 **9-1 / 9-2의 실제 구현 지시**다.

### 11-A. 인쇄 전용 off-screen root 분리 (9-1 해결)

현재 문제:
- `reportCenterOpenSchoolExamDetailedPrintView()`(`report-center.js:4190~4212`)가 `#app-root`의 innerHTML을 통째로 덮어씀. 그런데 전역 `<header>`/`.desktop-topbar`는 `#app-root`의 형제라 그대로 남고, 인쇄 CSS 셀렉터(`.app-header/.mobile-header/.topbar`)는 실제 DOM과 매칭되지 않아 헤더가 인쇄됨.

구현:
1. `#app-root`를 덮어쓰지 말고, `document.body` 하위에 **인쇄 전용 포털 컨테이너**를 새로 만든다.
   ```js
   // 예시
   let portal = document.getElementById('report-print-portal');
   if (!portal) {
       portal = document.createElement('div');
       portal.id = 'report-print-portal';
       document.body.appendChild(portal);
   }
   portal.innerHTML = reportCenterBuildSchoolExamDetailedPrintShell(bodyHtml);
   document.body.classList.add('aprc-school-print-mode');
   reportCenterTypesetMath(portal.querySelector('#report-print-document-root'));
   ```
2. 인쇄 CSS를 **화이트리스트 방식**으로 전환한다. 셀렉터 나열식(누락 위험)을 버린다.
   ```css
   @media print {
       body.aprc-school-print-mode > *:not(#report-print-portal) { display:none !important; }
       #report-print-portal .no-print,
       #report-print-portal .report-print-toolbar { display:none !important; }
   }
   ```
   - 화면(비인쇄) 상태에서도 포털이 앱 화면을 가리도록 `.aprc-school-print-mode #report-print-portal { position:fixed; inset:0; z-index:...; background:#fff; overflow:auto; }` 형태로 오버레이.
3. 종료 함수(`reportCenterExitSchoolExamPrintMode`)는 `#app-root` 복원이 아니라 **포털 제거 + 클래스 해제**만 하면 된다. → 기존 앱 화면 상태가 파괴되지 않는 부수 이점.

PASS:
- 인쇄 미리보기 1페이지 최상단이 `AP MATH REPORT`로 시작(앱 헤더/햄버거/뒤로가기 없음).
- 포털 DOM 안에 앱 헤더 마크업이 존재하지 않음.

### 11-B. 표·이미지 보존 리치 렌더러 신설 (9-2 해결)

현재 문제:
- `reportCenterPreserveArchiveText()`(`report-center.js:928`)의 `.replace(/<[^>]*>/g, ' ')`가 `<table>/<tr>/<td>/<img>`를 전부 공백으로 제거.
- `reportCenterLimitText()`(`:629`) → `reportCenterStripHtml()`(`:617`)가 남은 것마저 평문화 후 260자 절단.
- `reportCenterArchiveTextToHtml()`(`:952`)는 이 파괴된 텍스트만 다룸.

**핵심 방침: 새 렌더러를 발명하지 말고 오답 출력 엔진(`apmath/wrong_print_engine.html`)의 검증된 함수를 재사용/이식한다.** 엔진은 이미 같은 아카이브 문항을 표·이미지·수식(정렬 `&` 포함)까지 정상 출력하고 있다. report-center의 약한 `reportCenterNormalizeMathText`/`reportCenterArchiveTextToHtml` 경로를 학부모 출력에 쓰지 않는다.

엔진의 재사용 대상 함수(모두 `wrong_print_engine.html`):
- `resolveArchiveAssetUrl(src, archiveFile)`(`:286`) — 상대 이미지 경로를 `ARCHIVE_BASE_URL` + 아카이브 파일 디렉터리 기준으로 절대경로 해석. `http(s):`/`data:`/`blob:`는 그대로.
- `rewriteImgSrcInHtml(html, archiveFile)`(`:303`) — content 안 인라인 `<img src>`를 위 규칙으로 일괄 치환 + `loading/decoding` 속성 부여.
- `getQuestionImageRaw(q)`(`:319`) — 구조화 이미지 필드 6종(`image/imageUrl/img/imageTag/imagePath/image_path`) 통합.
- `wrapLatex(text)`(`:651`) — `<img>/<svg>/<br>/table 계열` 태그를 `__HTMLTAG_n__`로 마스킹 후 복원(표·이미지 보존), 한글/LaTeX 판별, `\begin{cases|aligned|array|matrix}`는 `$$...$$` display 모드로 래핑(정렬 `&` 정상 렌더).

**확정 방향 (형님 승인): 공용 모듈 추출.** 엔진과 report-center가 같은 소스를 공유해 drift를 없앤다. 구체 절차는 아래 11-B-0.

#### 11-B-0. 공용 모듈 추출 절차

추출 대상(모두 `apmath/wrong_print_engine.html`, 순수 함수·self-contained 확인 완료):
- `ARCHIVE_BASE_URL`(`:155`)
- `normalizeArchiveFile`(`:268~283`)
- `resolveArchiveAssetUrl`(`:286~301`)
- `rewriteImgSrcInHtml`(`:303~317`)
- `getQuestionImageRaw`(`:319~321`)
- `wrapLatex`(`:651~691`, 내부 헬퍼 `combPat/combRepl` 포함)

전제(확인 완료):
- 엔진 `ARCHIVE_BASE_URL`(`:155`)와 report-center `REPORT_CENTER_ARCHIVE_BASE_URL`(`report-center.js:364`)는 **값이 동일**(`https://icefoxtail.github.io/AP------/archive/`) → 통합해도 경로 drift 없음.
- 엔진·report-center 모두 클래식 전역 스크립트(ESM 아님). 따라서 모듈은 `type="module"`이 아니라 전역 네임스페이스 객체로 노출한다.

절차:
1. 새 파일 `apmath/js/archive-render.js`(클래식 스크립트)를 만들고, 위 함수들을 옮겨 전역 객체로 노출한다.
   ```js
   // archive-render.js
   (function (global) {
       const ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';
       function normalizeArchiveFile(file) { /* 엔진 원본 이식 */ }
       function resolveArchiveAssetUrl(src, archiveFile) { /* 이식 */ }
       function rewriteImgSrcInHtml(html, archiveFile) { /* 이식 */ }
       function getQuestionImageRaw(q) { /* 이식 */ }
       function wrapLatex(text) { /* 이식 */ }
       global.ApArchiveRender = { ARCHIVE_BASE_URL, normalizeArchiveFile, resolveArchiveAssetUrl, rewriteImgSrcInHtml, getQuestionImageRaw, wrapLatex };
   })(window);
   ```
2. `apmath/index.html`에 `report-center.js`보다 **먼저** `<script src="js/archive-render.js"></script>`를 로드한다.
3. `apmath/wrong_print_engine.html`은 인라인 정의를 제거하고 동일 모듈을 `<script src="js/archive-render.js">`로 로드한 뒤, 기존 호출부를 `ApArchiveRender.*`로 교체(또는 상단에서 `const { wrapLatex, ... } = ApArchiveRender;`로 로컬 별칭). **엔진 출력 결과가 바뀌면 안 됨 → 회귀 확인 필수.**
   - 주의: 엔진이 별도 창(`window.open`)/새 문서로 인쇄를 띄우는 경로가 있으면, 그 문서에도 모듈이 로드되는지 확인. 로드가 어려우면 이번 범위에서는 **엔진 인라인 유지 + report-center만 모듈 로드**로 한정하고, 모듈 소스를 엔진에서 복사한 것과 1:1 동일하게 맞춰 후속에 통합(형님 판단 필요 지점).
4. report-center는 자체 `reportCenterNormalizeArchiveFile` 등을 유지하되, 이미지/수식 리치 렌더에는 `ApArchiveRender.*`를 사용한다.

회귀 안전장치:
- 추출 전/후 엔진으로 대표 문항(표·이미지·다중행 수식 포함) 출력이 픽셀/구조상 동일한지 확인.
- 모듈 함수는 순수 함수라 단위 테스트로 고정 가능(`tests/archive-render.test.mjs` 신설 권장).

이하 구현은 위 모듈을 사용한다.
2. 학부모 출력용 리치 렌더 함수는 얇은 래퍼로 둔다:
   ```js
   function reportCenterArchiveRichToHtml(value, { archiveFile } = {}) {
       const withImgs = rewriteImgSrcInHtml(String(value || ''), archiveFile); // 이미지 경로 해석
       return wrapLatex(withImgs); // 표/이미지 마스킹 보존 + 수식 정규화
   }
   ```
   여기서는 `reportCenterEscape`/`reportCenterStripHtml`/`reportCenterLimitText`를 **거치지 않는다**(표·이미지·수식 파괴 방지).
3. `reportCenterNormalizeQuestionDetail()`(`report-center.js:743`)에 **원본 HTML을 자르지 않고 보관**하는 필드를 추가한다.
   ```js
   contentRich: question.content || question.question || question.text || question.prompt || '', // 260자 truncation 없음
   image: getQuestionImageRaw(question),
   _archiveFile: archiveFile, // resolveArchiveAssetUrl에 필요
   ```
   기존 `content`/`contentText`는 상담/텍스트 경로 호환용으로 유지.
4. 학부모 출력 카드는 `content` 대신 `contentRich`를 `reportCenterArchiveRichToHtml(contentRich, { archiveFile })`로 렌더한다.

주의:
- 리치 경로는 **학부모 출력물 전용**. 상담 텍스트/복사용 경로(`reportCenterStripHtml` 기반)는 그대로 둔다.
- MathJax 설정 일관성 확인: 엔진은 `tex-chtml`, report-center는 `tex-svg`를 로드한다. `wrapLatex` 출력(`$...$`/`$$...$$`)은 둘 다 처리 가능하나, 한 화면에서 두 인스턴스가 충돌하지 않도록 인쇄 포털에서는 하나의 MathJax만 사용.

### 11-C. 문항 카드에 이미지 렌더 (형님 추가 요구)

현재 문제:
- `reportCenterBuildParentWrongQuestionCard()`(`:3723`)는 `safeContent/choicesHtml/answerHtml`만 그림. `detail.image`(`:752`에서 이미 로드됨)는 렌더하지 않음.

구현 (STEP 5의 V2 카드에 반영):
- 구조화 이미지: `getQuestionImageRaw(detail)`로 얻은 경로를 `resolveArchiveAssetUrl(raw, archiveFile)`로 해석해 `<figure class="aprc-school-q-figure"><img src="{해석된 경로}" alt="{qNo}번 문항 이미지" loading="eager"></figure>` 렌더.
- 본문 인라인 이미지: `contentRich`를 11-B의 `reportCenterArchiveRichToHtml`로 렌더하면 `rewriteImgSrcInHtml`이 자동 처리.
- **중복 렌더 가드**: 구조화 `detail.image`와 본문 인라인 `<img>`가 같은 그림이면 하나만. (엔진 동작 확인 후 정책 결정 — 보통 문항 원문에 이미 인라인 img가 있으면 구조화 image는 생략)
- 인쇄 안전을 위해 `max-width:100%` 우선(엔진의 `.q-content img` 규칙 참고, `wrong_print_engine.html:84~92`).

### 11-D. 인쇄 CSS 보강 (표·이미지)

```css
#report-print-portal table { border-collapse:collapse; width:auto; max-width:100%; break-inside:avoid; }
#report-print-portal th,
#report-print-portal td { border:1px solid #333; padding:4px 8px; font-size:12px; }
#report-print-portal img { max-width:100%; height:auto; break-inside:avoid; }
@media print {
    #report-print-portal table,
    #report-print-portal figure,
    #report-print-portal img { break-inside:avoid !important; }
    #report-print-portal { print-color-adjust:exact; -webkit-print-color-adjust:exact; }
}
```

### 11-E. 수정 대상 파일 갱신 (3절 보완)

- `apmath/js/archive-render.js` — **신규**. 엔진에서 추출한 공용 렌더 함수(11-B-0).
- `apmath/wrong_print_engine.html` — 인라인 렌더 함수 제거 + 공용 모듈 로드로 교체(11-B-0). **출력 회귀 없어야 함.**
- `apmath/index.html` — `report-center.js`보다 먼저 `archive-render.js` 로드(11-B-0). 전역 헤더 마크업은 건드리지 않는다(포털은 런타임 생성).
- `apmath/js/report-center.js` — 포털 분리(11-A), 리치 렌더 래퍼(11-B, `ApArchiveRender` 사용), 카드 이미지(11-C), 인쇄 CSS(11-D), `contentRich`/`image`/`_archiveFile` 필드, 수식 안전망(11-F), 코멘트 다양화(11-G).
- `tests/...` — 공용 모듈 단위 테스트(`archive-render.test.mjs`), 표/이미지 보존, 헤더 미노출, 수식 에러 차단, 코멘트 반복 방지 계약 테스트 추가(8절 신규 테스트에 병합).

### 11-F. 수식 에러 차단 — 타이프셋 후 DOM 검증 (9-3 해결)

현재 문제:
- MathJax v3는 `Misplaced &` 등 오류에서 예외를 던지지 않고 `mjx-merror` 노드를 인라인 렌더 → `reportCenterTypesetMath()`(`:994`)의 try/catch가 안 걸리고 에러 텍스트가 그대로 남음.

구현:
1. **1차 해결은 11-B에서 이미 대부분 된다** — 학부모 출력 경로가 엔진의 `wrapLatex`(`wrong_print_engine.html:651`)를 쓰면, `\begin{cases|aligned|array|matrix}`가 `$$...$$` display 모드로 래핑되고 한글 문맥 `&`가 수식에서 제외되어 `Misplaced &`가 원천 차단된다. (약한 `reportCenterNormalizeMathText`는 학부모 경로에서 사용 안 함)
2. 그래도 안전망으로, `reportCenterTypesetMath()`가 `typesetPromise` 완료 후 **DOM에서 `mjx-merror`(및 레거시 `.MathJax_Error`) 노드를 검사**하는 후처리를 추가.
   ```js
   await mj.typesetPromise([target]);
   const errNodes = target.querySelectorAll('mjx-merror, .MathJax_Error');
   if (errNodes.length) {
       // 1) 인쇄 버튼 비활성화 + toast('수식 렌더 오류로 출력을 막았습니다')
       // 2) 문서 상단에 교사용 경고 박스 표시 (학부모용 문구 아님)
       // 3) 에러 노드를 안전 대체 텍스트로 치환하거나 출력 차단
   }
   ```
3. STEP 6의 소스 문자열 검사(`reportCenterValidatePrintableMath`)는 **보조**로 유지하되, 최종 판정은 DOM `mjx-merror` 기준으로 한다.

PASS:
- 출력물 어디에도 `Misplaced &` / `mjx-merror` 가시 텍스트가 없음.
- 수식 오류가 있는 문항이 있으면 교사에게 경고가 뜨고, 학부모용 원시 에러 문자열은 노출되지 않음.

### 11-G. 문항 코멘트 다양화 (9-5 해결)

현재 문제:
- `reportCenterBuildParentQuestionParagraph()`(`:3458`)의 4분기 + 과도하게 넓은 `isCondition` 정규식(`:3469`)으로 수학 단원 대부분이 동일 문장으로 수렴.

구현:
1. 분기 신호 확장: 단원 계열 분류(방정식/함수/그래프/부등식/기하/통계 등) + 오답 태그(`reportCenterResolveErrorTag`) + 유형(객관식/서술형) + 정답률 밴드(최상위/고난도/중간/실수) 조합.
2. 각 조합에 **문형 풀**을 두고, 문서 빌드 단계에서 이미 사용한 문장 목록을 넘겨 `reportCenterPickNonDuplicateText(primary, fallback, previousTexts)`(`:66`)로 중복을 피한다.
3. `reportCenterBuildSchoolExamDetailedParentReport`(또는 V2 빌더)가 문항 카드를 순회할 때 `usedComments[]`를 누적해 각 카드에 전달.

PASS:
- 5개 문항 dump에서 core/meaning/plan 문장이 3회 이상 동일 반복되지 않음.
- 단원/난이도가 다르면 코멘트 문형이 눈에 띄게 달라짐.
