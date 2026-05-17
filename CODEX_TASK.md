````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업명
평가 리포트 크게 보기 화면 검수·프리미엄 분석·출력 통합 및 카드 문구 정리

## 0. 작업 배경

현재 평가 리포트 흐름은 다음과 같이 불편하다.

- 리포트 센터에서 `리포트 크게 보기/출력` 클릭
- 크게 보기 화면에서 확인
- 다시 리포트 센터로 돌아와서 프리미엄 분석 적용
- 다시 크게 보기로 들어가서 확인
- 마음에 들면 출력

이번 작업은 `리포트 크게 보기/출력` 화면을 단순 미리보기 화면이 아니라, 선생님이 리포트를 크게 확인하면서 바로 다듬고, 프리미엄 분석을 적용하고, 결과가 마음에 들면 그대로 출력할 수 있는 검수·분석·출력 통합 화면으로 개선한다.

또한 평가 리포트 카드의 운영 문구를 학부모가 읽기 자연스럽게 정리한다.

---

## 1. 절대 규칙

- 현재 프로젝트 루트에서 작업한다.
- 먼저 `CODEX_TASK.md`를 처음부터 끝까지 다시 읽고 작업한다.
- 실제 파일을 열어 확인하지 않은 상태로 완료 처리하지 않는다.
- 수정 파일은 `apmath/js/report.js`와 `CODEX_RESULT.md`만 허용한다.
- 기존 기능을 개선 명목으로 삭제하지 않는다.
- 기존 버튼명 중 사용자가 명시하지 않은 것은 임의 변경하지 않는다.
- 리포트 센터 전체 구조를 대규모로 갈아엎지 않는다.
- 학생 포털, 학생 OMR, 플래너 흐름은 건드리지 않는다.
- 학생의 시험지 직접 열기 금지 원칙을 건드리지 않는다.
- 학생 OMR 제출 완료 후 재수정 금지 원칙을 건드리지 않는다.
- 세션 토큰 인증 구조를 건드리지 않는다.
- Basic fallback 구조를 건드리지 않는다.
- `raw_password`, `password`, `pw` 저장 구조를 만들지 않는다.
- 수납·출납 foundation initial-data 축소 결과를 되돌리지 않는다.
- 수납·출납 foundation 진입점 숨김 상태를 유지한다.
- Worker route 수정 금지.
- DB schema 변경 금지.
- migration 추가 금지.
- 배포 금지.
- 운영 API smoke test 금지.
- git add / commit / push 금지.
- `git add .` 금지.

---

## 2. 수정 대상

대상 파일:

- `apmath/js/report.js`

확인할 함수 후보:

- `reportCenterOpenPrintView`
- `reportCenterClosePrintView`
- `reportCenterInjectPrintViewStyle`
- `reportCenterEnsurePremiumReportStyle`
- `reportCenterRefreshPremiumExamPreview`
- `reportCenterRequestExamAiAnalysis`
- `reportCenterBuildExamAiPayload`
- `reportCenterGetExamReportTeacherMemo`
- `reportCenterBuildCleanPdfDocument`
- `reportCenterBuildCleanPdfShell`
- `reportCenterPrintCleanPdf`
- `reportCenterBuildScorePositionText`
- `reportCenterBuildCurrentPositionText`
- `reportCenterBuildPremiumQuestionRows`
- `reportCenterBuildEvaluationMeaningItems`
- `reportCenterBuildInterpretiveDiagnosisLines`
- `reportCenterBuildNextPlanItems`

실제 함수명과 현재 구조는 반드시 파일을 열어 확인한다.

---

## 3. 1차 목표: 크게 보기 화면을 검수·분석·출력 통합 화면으로 개선

### 3-1. 현재 흐름 유지

현재 `리포트 크게 보기/출력` 버튼은 유지한다.

평가 리포트 탭에서 해당 버튼을 누르면 기존처럼 전체화면 성격의 `reportCenterOpenPrintView()` 화면으로 이동해야 한다.

단, 그 화면 안에서 아래 작업이 가능해야 한다.

- 리포트 크게 확인
- 선생님 추가 메모 수정
- 프리미엄 분석 적용
- 분석 결과가 즉시 반영된 리포트 확인
- 기본 리포트로 복귀
- 인쇄하기
- 리포트 센터로 돌아가기

### 3-2. 크게 보기 화면 상단 툴바 개선

현재 툴바에 아래 버튼이 있다면:

- `리포트 센터로 돌아가기`
- `인쇄하기`

아래 흐름으로 확장한다.

권장 버튼 구성:

- `리포트 센터로 돌아가기`
- `기본 리포트로 복귀`
- `프리미엄 분석 적용`
- `인쇄하기`

주의:

- `리포트 센터로 돌아가기`, `인쇄하기`, `프리미엄 분석` 관련 문구는 기존 문맥을 유지한다.
- `기본 리포트로 복귀`는 이미 report.js에 같은 문구가 있으면 동일 문구를 사용한다.
- 버튼 순서는 왼쪽부터 돌아가기, 기본 복귀, 프리미엄 분석, 인쇄하기가 자연스럽다.
- 모바일에서는 2열 또는 wrap 되도록 CSS를 잡는다.
- 버튼 클릭 시 중복 실행을 막기 위해 분석 중에는 버튼 busy/disabled 처리를 한다.

### 3-3. 크게 보기 화면 안에 선생님 메모 입력 영역 추가

`reportCenterOpenPrintView()` 화면 상단 또는 리포트 위에 선생님 메모 입력 영역을 둔다.

권장 구조:

- label: `선생님 추가 메모`
- textarea
- 메모 입력 시 리포트를 즉시 재렌더하거나, 최소한 짧은 debounce 후 재렌더한다.

주의:

- 기존 리포트 센터의 `report-center-exam-teacher-memo` 값이 있으면 크게 보기 화면으로 가져와야 한다.
- 크게 보기 화면에서 메모를 바꾸면 현재 출력용 리포트에도 반영되어야 한다.
- 돌아가기 후 기존 리포트 센터 메모 영역에도 가능한 한 값이 유지되어야 한다.
- 과도한 리렌더 방지를 위해 150~250ms debounce를 사용할 수 있다.
- 기존 `reportCenterGetExamReportTeacherMemo()`가 특정 id만 읽는다면, 크게 보기 화면의 textarea id도 함께 읽을 수 있도록 최소 보강한다.

권장 textarea id:

- `report-print-teacher-memo`

### 3-4. 크게 보기 화면 안에서 프리미엄 분석 적용

크게 보기 화면의 `프리미엄 분석 적용` 버튼을 누르면 기존 `reportCenterRequestExamAiAnalysis()` 흐름을 재사용한다.

목표:

- 현재 학생/시험/sessionId 기준으로 AI 분석 요청
- 현재 선생님 메모 포함
- 성공 시 `reportCenterSetCachedAiAnalysis()` 또는 기존 캐시 저장 흐름 유지
- 현재 크게 보기 화면의 리포트 HTML 즉시 갱신
- 화면 이동 없음
- 성공 toast 유지
- 실패 시 기존 실패 안내 흐름 유지

필요하면 별도 wrapper 함수를 추가한다.

권장 함수명:

- `reportCenterRequestPrintViewAiAnalysis(studentId, sessionId, buttonEl)`

이 함수는 기존 `reportCenterRequestExamAiAnalysis()`와 중복 로직을 만들지 말고 가능한 기존 함수를 재사용하거나, 공통 처리 함수를 최소 추출한다.

주의:

- AI payload 구조를 임의로 바꾸지 않는다.
- AI 분석 문구 생성 로직을 바꾸지 않는다.
- 기존 리포트 센터의 `프리미엄 분석` 버튼도 계속 정상 동작해야 한다.

### 3-5. 크게 보기 화면 안에서 기본 리포트로 복귀

`기본 리포트로 복귀` 버튼은 현재 sessionId의 AI 분석 캐시를 제거하고, 현재 메모를 반영한 기본 리포트를 다시 렌더해야 한다.

기존 함수가 있으면 재사용한다.

후보:

- `reportCenterResetExamAiAnalysis`
- `reportCenterClearCachedAiAnalysis`
- `reportCenterRefreshPremiumExamPreview`

필요하면 크게 보기 전용 wrapper를 추가한다.

권장 함수명:

- `reportCenterResetPrintViewAiAnalysis(studentId, sessionId)`

주의:

- 기본 리포트 복귀 후에도 크게 보기 화면에 머물러야 한다.
- 리포트 센터로 튕기면 안 된다.
- 인쇄하기 버튼은 계속 동작해야 한다.

### 3-6. 현재 크게 보기 화면 리포트 재렌더 helper 추가

크게 보기 화면에서 메모 변경, 프리미엄 분석 적용, 기본 복귀 후 같은 방식으로 리포트를 다시 그릴 수 있도록 helper를 만든다.

권장 함수명:

```js
function reportCenterRefreshPrintViewReport(studentId, sessionId = '') {
    ...
}
````

역할:

* `reportCenterEnsurePremiumReportStyle()` 호출
* 현재 크게 보기 메모 textarea 값 읽기
* `reportCenterBuildCleanPdfDocument(studentId, sessionId, { teacherMemo, aiAnalysis })` 호출
* `.report-print-stage` 내부를 새 reportHtml로 교체
* 미리보기 screen CSS는 `reportCenterInjectPrintViewStyle()` 유지

주의:

* `.report-print-stage` 전체를 교체하더라도 툴바와 메모 입력 영역은 날아가면 안 된다.
* 가능하면 리포트 본문을 담는 별도 div를 둔다.

권장 구조:

```html
<div class="report-print-stage">
  <div id="report-print-document-root">
    ...
  </div>
</div>
```

### 3-7. 인쇄하기는 현재 화면 상태 그대로 출력

`인쇄하기` 버튼은 현재 메모와 현재 AI 분석 상태가 반영된 리포트를 출력해야 한다.

기존 `reportCenterPrintCleanPdf(studentId, sessionId)`가 내부에서 `reportCenterGetExamReportTeacherMemo()`와 cached aiAnalysis를 다시 읽는다면, 크게 보기 화면의 메모도 읽히도록 보강한다.

주의:

* 실제 출력 shell인 `reportCenterBuildCleanPdfShell()`의 print trigger 로직은 변경하지 않는다.
* `window.print()` 타이밍 변경 금지.
* 인쇄 창에서 정상인 흐름은 유지한다.

---

## 4. 2차 목표: 평가 리포트 카드 순서와 문구 정리

`reportCenterBuildCleanPdfDocument()`에서 평가 리포트의 큰 구조는 아래 순서가 되도록 유지 또는 정리한다.

### 4-1. 전체 순서

아래 순서로 리포트가 구성되어야 한다.

1. 헤더
2. 학생·시험 정보
3. 핵심 결과 카드
4. 이번 평가 핵심 요약
5. 현재 위치
6. 우선 확인할 점
7. 다음 수업 보완 계획
8. 세부 문항 분석표
9. 종합 진단
10. 학부모님께 드리는 말씀
11. footer

현재 구조가 이미 유사하면 대규모 재배치하지 말고 필요한 부분만 정리한다.

### 4-2. 헤더

헤더는 그대로 유지한다.

* 브랜드 영역은 학부모가 읽는 본문 문구가 아니다.
* `AP MATH REPORT`
* `평가 분석 리포트`
* 발행일 영역
* 프리미엄 분석 badge

주의:

* 헤더 문구는 바꾸지 않는다.
* 헤더 레이아웃은 직전 미리보기 보정 결과를 유지한다.

### 4-3. 학생·시험 정보

학생·시험 정보 영역은 그대로 유지한다.

* 학생명
* 학교/학년
* 반
* 시험명
* 시험일

주의:

* 정보 표기 영역의 의미를 바꾸지 않는다.
* 시험명/날짜가 길어도 화면이 깨지지 않도록 기존 보정 유지.

### 4-4. 핵심 결과 카드 문구 변경

핵심 결과 카드의 label을 아래처럼 정리한다.

기존/목표:

* `점수` 또는 `이번 평가 점수` → `이번 점수`
* `정답률` → `맞힌 문항`
* `전체 평균` → `전체 평균`
* `반 평균` 또는 비교 평균 안의 반 평균 → `우리 반 평균`
* `최근 흐름` → `최근 3회 평균`

중요:

현재 카드가 4개 구조라면 5개 카드로 무리하게 늘리지 말고, 현재 data 구조를 확인한 뒤 자연스럽게 정리한다.

권장 구조는 5개 카드:

1. 이번 점수
2. 맞힌 문항
3. 전체 평균
4. 우리 반 평균
5. 최근 3회 평균

가능하면 `.aprc-pdf-score-grid`를 5개 카드 대응으로 정리한다.

데이터 기준:

* 이번 점수: `session.score`
* 맞힌 문항: `question_count - wrongCount` / `question_count`

  * 예: `18 / 20`
  * note에는 정답률 표시 가능
* 전체 평균: `stats.overallAvg`
* 우리 반 평균: `stats.classAvg`
* 최근 3회 평균: `recentAvg`

주의:

* 점수 카드의 크기/강조는 유지해도 된다.
* 카드가 5개가 되면 grid CSS도 깨지지 않게 보정한다.
* 모바일/미리보기에서 가로 폭은 A4 기준이므로 5개 카드가 너무 좁으면 `이번 점수`만 크게 두고 나머지를 4개 소카드로 둘 수 있다.
* 학부모가 읽기 쉬운 표현을 우선한다.

### 4-5. 섹션 제목 문구 변경

아래 섹션 제목을 변경한다.

기존/목표:

* `이번 평가 핵심 요약` → `이번 시험, 이렇게 봤습니다`
* `현재 위치` → `지금 어디쯤 있나요`
* `우선 확인할 점` → `다음에 꼭 짚어볼 부분`
* `다음 수업 보완 계획` → `다음 수업에서 이렇게 합니다`
* `세부 문항 분석 자료` 또는 `세부 문항 분석표` → `문항별 분석`
* `종합 진단` → `선생님 종합 의견`
* `학부모님께 드리는 말씀` → 그대로 유지
* footer → 그대로 유지

주의:

* 사용자가 명시한 위 제목만 바꾼다.
* 다른 화면의 버튼명/메뉴명은 바꾸지 않는다.
* 리포트 센터 탭명 `평가 리포트`는 바꾸지 않는다.

### 4-6. 현재 위치 / 우선 확인할 점 카드 유지

현재 2열 카드 구조가 있다면 유지하되 제목만 바꾼다.

* 왼쪽: `지금 어디쯤 있나요`
* 오른쪽: `다음에 꼭 짚어볼 부분`

본문 생성 로직은 기존 함수 결과를 최대한 유지한다.

### 4-7. 다음 수업 계획 유지

`다음 수업에서 이렇게 합니다` 섹션은 기존 nextPlanItems를 그대로 사용한다.

단, 제목만 변경한다.

### 4-8. 문항별 분석 유지

문항 분석 table 구조는 유지한다.

섹션 제목만 `문항별 분석`로 변경한다.

테이블 column label은 과도하게 바꾸지 않는다. 단, 이미 자연스럽게 개선할 수 있는 범위에서 아래 정도는 허용한다.

* `문항`
* `단원`
* `난도`
* `전체 정답률`
* `반 정답률`
* `해석`

기존과 같으면 그대로 둔다.

### 4-9. 선생님 종합 의견

기존 `종합 진단` 섹션 제목만 `선생님 종합 의견`으로 바꾼다.

본문 생성 함수는 바꾸지 않는다.

### 4-10. 학부모님께 드리는 말씀

그대로 유지한다.

### 4-11. footer

그대로 유지한다.

---

## 5. CSS 보정

카드가 5개가 되는 경우 CSS를 보정한다.

확인할 CSS:

* `.aprc-pdf-score-grid`
* `.aprc-pdf-score-card`
* `.aprc-main-score`
* `.aprc-score-value`
* `.aprc-metric-value`
* `.report-print-stage .aprc-pdf-document`
* `.report-print-stage .aprc-pdf-header`

권장:

* A4 기준에서 5개 카드가 깨지지 않도록 한다.
* `이번 점수` 카드는 강조 유지.
* 나머지 4개 카드는 균등 배치.
* 필요하면 grid를 `1.25fr repeat(4,minmax(0,1fr))`로 조정한다.
* 폰트가 너무 작아지면 카드 note를 줄이고 label/value를 우선한다.
* print와 screen 미리보기 모두 깨지지 않게 한다.

---

## 6. 금지 사항

* 리포트 전체 디자인을 새로 갈아엎지 않는다.
* PDF 출력 shell을 새로 만들지 않는다.
* `window.print()` 타이밍을 바꾸지 않는다.
* AI 요청 API나 payload 구조를 임의로 바꾸지 않는다.
* 리포트 문구 생성 함수를 대규모 재작성하지 않는다.
* 학생 OMR/QR/클리닉/수납/대시보드/관리 화면을 수정하지 않는다.
* index.js, worker route, schema, migration 수정 금지.
* `reportCenterBuildCleanPdfShell()`은 꼭 필요한 경우가 아니면 수정하지 않는다.

---

## 7. 검증

필수 실행:

```powershell
node --check apmath/js/report.js
```

추가 확인:

```powershell
Select-String -Path "apmath/js/report.js" -Pattern "reportCenterOpenPrintView","reportCenterRefreshPrintViewReport","reportCenterRequestPrintViewAiAnalysis","이번 점수","맞힌 문항","우리 반 평균","최근 3회 평균","이번 시험, 이렇게 봤습니다","지금 어디쯤 있나요","다음에 꼭 짚어볼 부분","다음 수업에서 이렇게 합니다","문항별 분석","선생님 종합 의견"
git diff --name-only
git status --short
```

수동 확인 항목:

1. 리포트 센터 > 평가 리포트 진입
2. `리포트 크게 보기/출력` 클릭
3. 크게 보기 화면에서 리포트가 정상 표시되는지 확인
4. 크게 보기 화면에서 선생님 메모 입력 후 리포트가 갱신되는지 확인
5. 크게 보기 화면에서 `프리미엄 분석 적용` 클릭
6. 분석 완료 후 같은 화면에서 리포트 문구가 갱신되는지 확인
7. `기본 리포트로 복귀` 클릭 시 같은 화면에서 기본 리포트로 돌아오는지 확인
8. `인쇄하기` 클릭 시 현재 화면 상태가 반영된 출력 창이 열리는지 확인
9. `리포트 센터로 돌아가기` 클릭 시 기존 리포트 센터로 돌아가는지 확인
10. 핵심 결과 카드 label이 아래처럼 보이는지 확인

    * 이번 점수
    * 맞힌 문항
    * 전체 평균
    * 우리 반 평균
    * 최근 3회 평균
11. 섹션 제목이 아래처럼 보이는지 확인

    * 이번 시험, 이렇게 봤습니다
    * 지금 어디쯤 있나요
    * 다음에 꼭 짚어볼 부분
    * 다음 수업에서 이렇게 합니다
    * 문항별 분석
    * 선생님 종합 의견
    * 학부모님께 드리는 말씀
12. 실제 인쇄 창에서도 깨지지 않는지 확인

---

## 8. 완료 보고

작업 완료 후 프로젝트 루트에 `CODEX_RESULT.md`를 작성한다.

반드시 아래 형식을 사용한다.

# CODEX_RESULT

## 1. 생성/수정 파일

* 수정한 파일 목록

## 2. 구현 완료 또는 확인 완료

* 크게 보기 화면 검수·분석·출력 통합 여부
* 크게 보기 화면 선생님 메모 입력/반영 여부
* 크게 보기 화면 프리미엄 분석 적용/즉시 갱신 여부
* 크게 보기 화면 기본 리포트 복귀 여부
* 인쇄하기가 현재 상태를 반영하는지 여부
* 핵심 결과 카드 label 변경 여부
* 섹션 제목 변경 여부
* 헤더/학생·시험 정보/footer 보존 여부
* 실제 출력 shell 보존 여부
* 기존 리포트 센터 흐름 보존 여부
* AI 분석 로직 보존 여부
* 학생 OMR/시험지 직접 열기 금지 원칙 보존 여부
* 세션 토큰 인증 구조 보존 여부
* 수납·출납 initial-data 축소 결과 보존 여부
* 코드 수정 범위 준수 여부

## 3. 실행 결과

* node --check apmath/js/report.js 결과
* Select-String 검색 결과 요약
* git diff --name-only 결과
* git status --short 결과
* Worker 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
* 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
* git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
* git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## 4. 결과 요약

* 이번 작업으로 바뀐 실제 사용 흐름
* 평가 리포트 카드/섹션 문구 정리 결과
* 기존 출력 흐름 영향 여부
* 남은 확인 필요 항목

## 5. 다음 조치

* 사용자가 직접 크게 보기 화면 확인
* 사용자가 직접 프리미엄 분석 적용 확인
* 사용자가 직접 인쇄하기 확인
* 문제 없으면 사용자가 직접 지정 파일만 git add
* 권장 커밋 메시지
* 커밋 대상 파일

완료 보고에는 반드시 아래 항목을 포함한다.

* 기존 문구 변경 여부:
* 기존 버튼명 변경 여부:
* 기존 화면명 변경 여부:
* 기존 메뉴명 변경 여부:
* 기존 운영 용어 변경 여부:
* 리포트 본문 생성 로직 변경 여부:
* AI 분석 로직 변경 여부:
* 실제 출력 shell 변경 여부:
* 세션 토큰 인증 구조 변경 여부:
* Basic fallback 변경 여부:
* initial-data 응답 구조 변경 여부:
* 수납·출납 foundation 진입점 숨김 유지 여부:
* 학생 시험지 직접 열기 금지 원칙 변경 여부:
* 학생 OMR 제출 완료 후 재수정 금지 원칙 변경 여부:
* DB schema 변경 여부:
* migration 추가 여부:
* 실제 청구 생성 여부:
* 실제 결제 연동 여부:
* 실제 알림톡/문자 발송 여부:
* 배포 실행 여부:
* 운영 smoke 실행 여부:
* git commit 실행 여부:
* git push 실행 여부:

## 9. 권장 커밋 메시지

작업 완료 후 사용자가 직접 커밋할 경우 권장 메시지:

Improve report review and print workflow

## 10. 최종 출력

터미널 마지막 출력은 아래 문장으로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

EOF

```
```
