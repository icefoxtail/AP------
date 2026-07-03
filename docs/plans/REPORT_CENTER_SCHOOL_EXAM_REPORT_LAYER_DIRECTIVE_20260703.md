# 리포트 센터 · 학교시험 리포트 레이어 — Codex Task 지시서 (루프 엔지니어링)

작성일 2026-07-03 · 실행자: Codex Task (cold start 가능하게 자기완결적으로 기술)

> 이번 라운드의 관건은 **"문항 분석을 더 많이 보여주는 것"이 아니라, 문항 분석을 학부모가 읽을 수 있는 자연스러운 글로 번역하는 것.**
> 새 문구는 거의 만들지 않는다 — **기존 `REPORT_COPY_BANK`에 연결**한다. 새로 잘 짜야 하는 것은 **문항별 분석표(스키마)** 하나다.
> 원칙: **선생님용 분석은 깊게(축약 금지) · 학부모용 글은 쉽게 · 기본 화면은 상담에 바로 쓰는 1장 리포트.**

---

## 0. 루프 실행 규약

STEP은 독립 실행·검증·게이트 통과가 가능한 "루프 1회"다. **게이트(DoD)가 초록이 되기 전에는 다음 STEP으로 넘어가지 않는다.**

```
루프 1회 = (1)목표 읽기 → (2)대상 파일만 수정 → (3)구현
          → (4)검증 명령 전부 통과까지 (3)↔(4) 반복 → (5)DoD 체크 → (6)커밋 → 다음 STEP
```

**검수 정책 (중요):**
- **하위 에이전트로 검수하지 말 것.** 각 STEP은 Codex가 구현 + 자체 테스트까지만 한다.
- 최종 검수는 **사람 쪽(Claude/Opus)이 나중에 직접** 한다. Codex는 검수 요청·리뷰 에이전트 스폰을 하지 않는다.
- STEP 완료 시 커밋 메시지에 무엇을 바꿨는지 명확히 남겨, 사후 검수가 쉽게.

**공통 규약:**
- 브랜치: `main` 직접 커밋 금지. `feat/report-center-school-exam-layer`에서 STEP마다 커밋. (푸시/PR은 사람이 처리 — [[git-push-workflow]])
- 커밋 말미 `Co-Authored-By: Codex <noreply@anthropic.com>`.
- **전 STEP 프론트(`apmath/js`)만.** 워커/D1/마이그레이션 변경 없음. 기존 데이터/API 재사용(`exam_question_reviews`·`exam_analysis_meta`는 이미 배포됨).
- 회귀 가드(항상 초록 유지):
  ```
  node tests/report-exam-trend.test.mjs
  node tests/exam-question-review-card.test.mjs
  node tests/apmath-report-easy-language.test.js
  node tests/apmath-global-surface.test.js
  node tests/report-center-shell.test.mjs
  node tests/report-center-exam-hub.test.mjs
  node tests/report-center-exam-dashboard.test.mjs
  node tests/report-center-student-view.test.mjs
  node tests/report-center-advanced-policy.test.mjs
  ```
- `apmath-global-surface.test.js`는 `report-text.js+report-center.js+report-print.js` 전역 함수 표면을 잠근다. **새 함수를 추가하면** report 픽스처를 갱신: `node tests/apmath-global-surface.test.js --update` 실행 후 **`git status`로 `tests/fixtures/apmath-surface-report.json`만 바뀐 것을 확인**(classroom/dashboard 픽스처는 건드리지 말 것).

---

## 1. 배경·확정 설계 (불변식)

이전 라운드([[apmath-report-center-redesign]])에서 시험지 중심 드릴다운(L0 목록 → L1 대시보드 → L2 학생)은 완성됐다. 이번 라운드는 **L1/L2 안의 "무엇을 어떻게 보여주는가"**를 고친다. 현재 화면은 데이터 확인판이지, 학부모에게 남길 상담 기록이 아니다.

### 1-1. 3레이어 분리 (사장님 확정)

```
레이어 1 · 시험지 분석 상태판   — 선생님 검수용. 문제 원문·보기·정답·해설·문항분석 raw. 내부 용어 허용. 학부모 출력 기본 제외.
레이어 2 · 학생별 상담 리포트 1장 — 선생님 상담용. 학생 선택 시 무조건 먼저 자동 생성·기본 펼침. 이 화면만 보고 상담 가능해야.
레이어 3 · 학부모용 리포트/PDF   — 그대로 보내도 되는 문장만. 내부 용어·raw review·기술 분석 제외. 문항별은 쉬운 설명 + 학원 조치만.
```

### 1-2. 이번 프로젝트의 심장 — 문항별 분석표 스키마

학부모 글은 `결과 → 해석 → 원인 → 조치 → 안심` 흐름이 있어야 한다. 지금은 결과·원인의 원자료만 있다. 문구 뱅크(`REPORT_COPY_BANK.questionInsight`)가 **이미 정답률 구간 → 톤 → 문장을 구현**하고 있으나, 슬롯이 `{qNo}`·`{unit}` 둘뿐이라 같은 단원 문항이 전부 동일 문장으로 나온다. **분석표가 문항 고유의 알맹이(개념·함정·오답결)를 공급해야** 학부모 문장이 구체적·자연스러워진다.

**확정 스키마 (문항당, `exam_question_reviews.review_text`의 JSON 확장 — 하위호환 유지):**

| 필드 | 키 | 대상 | 규칙 |
|---|---|---|---|
| 단원 | (blueprint) | 공통 | 기존 `standard_unit` 재사용 |
| 개념 | `concept` | 공통·슬롯 | `{unit}`보다 좁게. 예 "두 근의 합·곱", "해의 범위 조건" |
| 묻는 것 | `asks` | 선생님 | **자연스러운 문장으로**(채점 메모 말투 금지) |
| 함정/막히는 지점 | `trap` | 선생님·슬롯소스 | **어느 단계에서 왜 어긋나는지 자연어로.** 코드 파편("BC=x+b/2 세팅") 금지 |
| 풀이 핵심 | `key` | 선생님 | 열쇠 단계 |
| 오답 양상 태그 | `tag` | **뱅크 연결 키** | 아래 4종 고정 어휘 중 택1 |

**오답 양상 태그 = 4종 고정 (뱅크의 진단과 정렬, 확정):**
```
계산·검산   → REPORT_COPY_BANK.questionInsight.easy   (정답률 ≥85 기본값)
풀이 순서   → REPORT_COPY_BANK.questionInsight.mid    (65~85 기본값)
조건 해석   → REPORT_COPY_BANK.questionInsight.hard   (45~65 기본값)
개념 재정리 → REPORT_COPY_BANK.questionInsight.veryHard (<45 기본값)
```
정답률이 태그의 **기본값**을 준다. 애널리스트가 `tag`를 명시하면 **정답률을 덮어쓴다**(정답률 낮아도 실제 계산 실수 문항이면 `계산·검산`으로 잡음).

### 1-3. 품질 기준 — "길이 아니라 자연스러움"

애널리스트가 처음 본 화면이 나빴던 건 **짧아서가 아니라 채점 메모 말투(부자연)라서**다. 최소 길이를 강제하지 않는다. 대신 **말투 기준**을 강제한다: `asks`/`trap`/`key`는 "동료에게 설명하듯 풀어 쓴 자연어 문장". 자연스러운 입력 → 자연스러운 출력. 학부모 문장은 **따로 쓰지 않는다** — 뱅크 톤 프레임 + `concept`/`trap`을 얹고 humanize 필터로 파생한다.

### 1-4. 수식 자연 출력

MathJax(tex-svg)는 붙어 있고(`reportCenterTypesetMath`, `reportCenterEnsureMathJax`, 프린트 doc `report-print.js:807`) `$...$`/`$$...$$` LaTeX는 렌더된다. 그러나 **ASCII 수식(`x^2`, `√(b^2+4c)`, `b/2`)을 LaTeX로 바꾸는 정규화기가 없어** 날것으로 깨져 나온다(사장님이 스크린샷에서 지적한 그 깨짐). 이걸 신설한다.

### 1-5. 편집 모델 (확정)

리포트는 기본 읽기용. **[수정] 버튼 하나**로 편집 모드 진입 → 그 안에서 각 텍스트에어리어가 편집 가능 → 저장(`reportCenterUpsertExamReview`/`reportCenterUpsertExamMeta` 재사용). **필드마다 버튼을 달지 않는다.**

### 1-6. 용어 정리 + 학부모 출력 금지어

**화면 라벨 치환(전 레이어):** `코호트`→`전체 응시`, `코호트 정답률`→`전체 응시 정답률`, `코호트 평균`→`전체 응시 평균`, `전체 20명 · 반 4명`→`전체 응시 20명 · 우리 반 4명`. `묻는 것`/`함정`/`풀이 포인트`는 **선생님용 레이어 안에서만** 라벨로 사용.

**학부모용 리포트/PDF에 아래가 나오면 FAIL:**
```
코호트 · raw · archive · 아카이브 · review_text · blueprint
묻는 것 · 함정 · 풀이 포인트
"전체 정답률 5%" / "반 정답률 25%" 같은 내부 통계 표현
데이터 없음 · 확인 불가
```
학부모용 치환:
```
전체 정답률 5%  → 많은 학생이 어려워한 고난도 문항
반 정답률 25%   → 우리 반에서도 쉽지 않았던 문항
묻는 것         → 확인한 내용
함정            → 실수하기 쉬운 부분
풀이 포인트      → 다시 정리할 부분
```

### 1-7. 척추로 재사용 (삭제·재작성 금지)

`REPORT_COPY_BANK`(report-text.js), `reportCenterBuildParentQuestionInsight`(report-center.js:2347), `reportCenterParseReviewJson`·`reportCenterBuildQuestionReviewCard`(report-print.js), `reportCenterGetExamReviews`·`reportCenterUpsertExamReview`·`reportCenterUpsertExamMeta`, `reportCenterBuildStudentView`(L2, report-center.js:1606), `reportCenterBuildExamDashboard`(L1), `reportCenterBuildCleanPdfDocument`·`reportCenterBuildWrongCauseSummary`·`reportCenterBuildAcademyActionPlan`·`reportCenterBuildCompactParentMessage`·`reportCenterBuildCompactExamSummary`(report-print.js), `reportHumanizeApplyApMathTone`·`AP_REPORT_EASY_FORBIDDEN_RE`(report-text.js), `reportCenterTypesetMath`·`reportCenterLooksLikeCodeText`.

**문구 톤 정책 준수:** 가정 지도 제안 금지·학원 책임 강조, "부족/약함/실수했습니다" 대신 "보완이 필요합니다/다시 정리하겠습니다/다음 수업에서 점검하겠습니다" ([[apmath-report-copy-voice]]). PDF 페이지브레이크 규칙 유지([[apmath-report-pdf-page-break]]).

---

## STEP 1 — 수식 ASCII→LaTeX 자동 정규화기

**목표**
애널리스트가 `x^2`, `√(...)`, `a/b`를 자연어 문장 안에 섞어 써도 출력이 깨지지 않게, 렌더 직전 LaTeX로 정규화한다. 명시적 `$...$`는 그대로 존중.

**대상 파일**
- `apmath/js/report-center.js` (정규화 함수 + `reportCenterArchiveTextToHtml`/카드 텍스트 경로에 적용)
- `tests/report-math-normalize.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterNormalizeMathText(text)` 순수 함수:
   - 이미 `$...$`/`$$...$$`/`\(...\)` 안에 있는 구간은 **건드리지 않음**(먼저 마스킹).
   - 마스킹 밖에서: `x^2`/`x^{10}` → `$...$` 위첨자, `√(...)`·`sqrt(...)` → `$\sqrt{...}$`, `a/b`형 분수(문맥상 수식일 때) → `$\frac{a}{b}$`, `≤ ≥ ≠ ± × ÷ →` 등 기호 보존.
   - 순수 한국어 문장은 변형 없이 반환(오탐 최소화 — 숫자/변수 인접 토큰만 대상).
2. `reportCenterArchiveTextToHtml`(report-center.js:904)와 문항 카드 텍스트 렌더 진입부에서 정규화를 통과시킨 뒤 MathJax typeset. 코드텍스트 가드(`reportCenterLooksLikeCodeText`)는 유지.
3. 정규화 실패/예외 시 원문 그대로 반환(안전).

**검증**
```
node tests/report-math-normalize.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: `x^2+bx-c` → LaTeX 위첨자 포함 출력. `$x^2$` 입력은 이중 변환 안 됨(멱등). 순수 한국어 문장은 무변형. `√(b^2+4c)` → `\sqrt` 변환.

**DoD**: ASCII 수식이 렌더에서 자연스럽게 나옴. 회귀 초록.

---

## STEP 2 — 분석표 스키마 확장 + 오답 태그 4종

**목표**
`review_text` JSON에 `concept`/`tag`를 정식 필드로 추가(하위호환), 파서·정규화·태그 유틸 제공. `asks`/`trap`/`key`는 자연어 규칙만(런타임 강제 아님, 작성 UI 힌트로).

**대상 파일**
- `apmath/js/report-print.js` (`reportCenterParseReviewJson` 확장) 또는 `report-center.js`(태그 유틸) — 필드별로 해당 파일
- `tests/report-review-schema.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterParseReviewJson`(report-print.js:52)가 `concept`·`tag`도 인식(기존 `asks|trap|key|teach` 조건 유지, `tag`/`concept`만 있어도 유효 객체로).
2. `reportCenterErrorTags()` → `['계산·검산','풀이 순서','조건 해석','개념 재정리']` 상수 헬퍼.
3. `reportCenterResolveErrorTag(reviewData, correctRate)`: `reviewData.tag`가 4종 중 하나면 그걸, 아니면 정답률 구간(≥85 계산·검산 / 65~85 풀이순서 / 45~65 조건해석 / <45 개념재정리)으로 파생. 자료 없으면 `null`.
4. `reportCenterBuildQuestionReviewCard`(report-print.js:62) 선생님 카드에 `concept`(있으면)·`tag` 뱃지 노출. **선생님 레이어는 raw 전부 자세히**(축약 금지) — `묻는 것`/`함정`/`풀이 포인트`/`지도 포인트` 라벨 유지.

**검증**
```
node tests/report-review-schema.test.mjs
node tests/exam-question-review-card.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: `tag` 명시 시 정답률과 무관하게 그 태그 반환(덮어쓰기). 미명시 시 정답률 구간 파생. `concept`만 있는 JSON도 파싱됨. 기존 `{asks,trap,key}`만 있는 리뷰 하위호환.

**DoD**: 스키마 확장·태그 해석 동작, 선생님 카드가 raw 자세히 렌더. 회귀 초록.

---

## STEP 3 — 학부모 안전 문항 코멘트 + 금지어 필터

**목표**
문항별 학부모용 한 줄을 **뱅크 톤 프레임 + `concept`/`trap` 얹기 + humanize**로 파생. 금지어가 새면 차단.

**대상 파일**
- `apmath/js/report-center.js` 또는 `report-print.js`
- `tests/report-parent-safe-comment.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterBuildParentSafeQuestionComment(row)`:
   - `reportCenterResolveErrorTag`로 태그 결정 → 대응 `REPORT_COPY_BANK.questionInsight` 엔트리의 `cards`를 톤 프레임으로.
   - `{qNo}`·`{unit}` 외에 **`concept`을 슬롯으로 반영**하고, `trap`을 학부모 말투로 자연스럽게 1구 얹음(수식은 STEP1 정규화 통과, `reportCenterLooksLikeCodeText`면 생략).
   - `reportHumanizeApplyApMathTone(..., 'parent')` 통과.
2. `reportCenterAssertParentSafe(text)` 가드: 1-6 금지어 정규식 매칭 시 해당 조각 제거·치환(코호트→전체 응시, 정답률%→"많은 학생이 어려워한 …"). 최종 문장에 금지어 0 보장.
3. 내부 통계 노출 금지: 학부모 경로에서는 "전체 정답률 N%"·"반 정답률 N%" 원문 금지(정성 표현으로 치환).

**검증**
```
node tests/report-parent-safe-comment.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
```
**assert**: `tag='계산·검산'`이면 실수 톤 문장. 산출 문장에 금지어(코호트/함정/blueprint/"정답률 5%" 등) **0건**. `concept` 있으면 문장에 반영돼 같은 단원 두 문항이 서로 다른 문장.

**DoD**: 문항별 학부모 문장이 구체적·안전. 회귀 초록.

---

## STEP 4 — 학생별 상담 리포트 1장 빌더

**목표**
학생 선택 시 자동 생성되는 1장 리포트. 기존 report-print.js 빌더들을 조립 + STEP3 코멘트.

**대상 파일**
- `apmath/js/report-center.js`
- `tests/report-school-exam-counsel.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterBuildScoreMeaning(data)` 순수: `{ level, comparedToAverage, comparedToRecent, parentSentence }` — 점수 의미(90↑ 우수 / 평균+20↑ 안정 / 최근 대비 유지·상승·하락). `reportCenterBuildScorePositionText` 재사용 가능.
2. `reportCenterBuildStudentWrongCauseSummary(studentId, archiveFile)`: 오답 문항의 태그를 묶어 공통 원인 요약(2문항↑이면 공통 결). `reportCenterBuildWrongCauseSummary`(report-print.js:202) 확장/재사용.
3. `reportCenterBuildSchoolExamCounselReport(studentId, archiveFile)` → 6구획 조립:
   - ① 상단 요약(학생/반/시험명·점수·**전체 응시 평균**·오답수·최근 점수)
   - ② 이번 시험 총평(scoreMeaning 문장화)
   - ③ 오답 원인 요약(STEP3 코멘트 + 공통 원인)
   - ④ 상담 포인트(선생님이 말할 문장, 기술 용어 나열 금지)
   - ⑤ 학원 조치(`reportCenterBuildAcademyActionPlan` 재사용)
   - ⑥ 학부모 안내 문구(복사 가능·카톡 톤, `reportCenterBuildCompactParentMessage` 재사용)
4. `reportCenterBuildSchoolExamParentReport(studentId, archiveFile)`: ③~⑥의 학부모 안전 버전(금지어 필터 통과, 문항 원문·raw 제외).

**검증**
```
node tests/report-school-exam-counsel.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: mock 데이터로 6구획 전부 생성. 총평이 평균 대비 문장 포함. 오답 2건이면 공통 원인 문장 생성. 학부모 버전에 금지어 0.

**DoD**: 학생별 1장 리포트 자동 생성. 회귀 초록.

---

## STEP 5 — L2 학생 화면 재구성 + 버튼/라벨

**목표**
학생 상세(L2)를 상담 1장 중심으로. 문항 분석 카드는 아래로 접는다.

**대상 파일**
- `apmath/js/report-center.js` (`reportCenterBuildStudentView` 재구성, 1606행)
- `tests/report-center-student-view.test.mjs` (기대 갱신)

**작업 (화면 순서 확정):**
```
1. 학생별 상담 리포트 1장        ← 기본 펼침 (STEP4)
2. [학부모용 리포트 보기] [발송 문구 복사]
3. 접힘 · [선생님용 상세 분석 보기]  ← 문항 카드 raw (기본 접힘)
4. 접힘 · [문제 원문 확인]          ← 원문/보기/정답/해설 (기본 접힘)
```
1. 진입 즉시 상담 1장이 먼저 보이게. 문항 리뷰 카드 나열(`reportCenterBuildQuestionReviewCardsForReport`)은 `<details>` 접힘 블록으로 이동.
2. 버튼 라벨: `학부모용 리포트 보기` / `발송 문구 복사` / `선생님용 상세 분석 보기` / `문제 원문 확인`.
3. 문제 원문 블록은 학교 기출 원문이 없을 수 있음(믹서만 매핑 존재) → 없으면 "원문 없음" 상태로 정직히(단, 이 표현은 선생님 레이어에서만; 학부모 출력엔 안 감).

**검증**
```
node tests/report-center-student-view.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: L2 렌더가 상담 1장을 문항 카드보다 **먼저** 출력. 문항 상세/원문이 접힘(`<details>`). 버튼 4종 라벨 존재.

**DoD**: L2가 상담 우선·상세 접힘 구조. 회귀 초록.

---

## STEP 6 — 편집 모드(단일 [수정] 버튼)

**목표**
자동 생성된 상담 1장을 [수정] 버튼 하나로 편집 모드 전환, 텍스트에어리어들 편집·저장.

**대상 파일**
- `apmath/js/report-center.js`
- `tests/report-school-exam-edit.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. 상담 1장 헤더에 `[수정]` 버튼 1개. `reportCenterSetCounselEditMode(bool)` + 재렌더.
2. 편집 모드: ②총평·③오답원인·④상담포인트·⑤학원조치·⑥학부모안내 각 구획을 `<textarea>`로. `[저장]`/`[취소]`.
3. 저장 → `reportCenterUpsertExamMeta`(시험 공통 총평 등)·`reportCenterUpsertExamReview`(문항 코멘트) 재사용해 `state.db`에 반영. 오프라인/로컬 우선, 서버 저장은 기존 경로 재사용(신규 워커 라우트 금지).
4. 저장 후 읽기 모드 복귀, 수정본이 출력·PDF에 반영.

**검증**
```
node tests/report-school-exam-edit.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: 편집 모드 토글이 textarea 노출. 저장이 store upsert 호출·재렌더 시 수정본 반영. 취소는 원복.

**DoD**: 단일 수정 버튼 편집 흐름 동작. 회귀 초록.

---

## STEP 7 — 학부모 PDF 안전 필터 + 레이어1 상태판 + 최종 폴리시

**목표**
학부모용 PDF에 raw review·내부 용어가 절대 안 들어가게 필터 확정. 레이어1(상태판) 용어 치환. 종합 QA.

**대상 파일**
- `apmath/js/report-print.js`(`reportCenterBuildCleanPdfDocument` 학부모 경로), `apmath/js/report-center.js`(L1 라벨)

**작업**
1. 학부모 PDF: 문항 블록은 STEP3 안전 코멘트 + 학원 조치만. **금지: `묻는 것`/`함정`/`풀이 포인트` 원문, 내부 정답률 상세, 코호트/archive/blueprint/review_text, 문제 원문 전체 나열, 과한 풀이 과정.** 최종 문서에 `reportCenterAssertParentSafe` 통과.
2. 허용: 쉬운 오답 설명·보완 개념·학원 조치·긍정 총평·다음 학습 계획.
3. 레이어1(L1 대시보드) 용어 치환(1-6): 코호트→전체 응시 등. `묻는 것`/`함정`/`풀이 포인트` 라벨은 선생님 상세 안에서만.
4. 페이지브레이크 유지([[apmath-report-pdf-page-break]]): 새/이동 섹션 `break-inside:avoid`.
5. `node -e` 덤프로 기본/편집/학부모 PDF 렌더 차이 육안 QA(금지어 스캔).

**검증**
```
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
```
(가능하면 학부모 PDF 금지어 0을 assert하는 테스트 추가)

**DoD**: 학부모 PDF 금지어 0·6구조 유지. 상태판 용어 정리. 전 STEP 회귀 초록.

---

## 부록 A — 절대 하지 말 것
- 기능/함수 **삭제 금지**. 이전 라운드 드릴다운(L0/L1/L2)·고급 모드·스튜디오 보존.
- STEP당 [대상 파일] 밖 수정 금지. 워커/D1/마이그레이션 변경 금지(프론트 전용, 기존 store API 재사용).
- **새 문구를 대량 창작 금지** — `REPORT_COPY_BANK` 연결이 원칙. 뱅크에 없어 꼭 추가할 땐 톤 정책([[apmath-report-copy-voice]]) 준수.
- 학부모 경로에 raw review·내부 용어·수식 코드 파편 유입 금지.
- 하위 에이전트 검수 스폰 금지. `main` 직접 커밋/푸시·훅·서명 우회 금지. 회귀 빨간 채로 다음 STEP 금지. global-surface 픽스처는 report만 `--update`.

## 부록 B — 사후 검수(사람이 함)
각 STEP 커밋 후 Claude가 직접: (1)수식이 자연스럽게 렌더되는지 (2)선생님용은 raw 자세히·학부모용은 쉬운 문장인지 (3)학생 선택 시 상담 1장이 먼저 뜨는지 (4)단일 수정 버튼 편집·저장이 되는지 (5)학부모 PDF에 금지어 0인지 (6)회귀·표면 스냅샷·삭제 함수 없음 을 확인한다. Codex는 검수를 대행하지 않는다.

## 부록 C — 사람이 확정할 소소 결정 (검수 시)
- 상담 1장 ②총평을 어느 뱅크 문장에 연결할지 최종 톤(scoreMeaning 문장 초안은 Codex가 제시, 사람이 다듬음).
- 레이어1 "미분석 시험지" 표기 문구(선생님 레이어 전용).
- 편집 저장의 서버 반영 범위(로컬 우선 확정, 서버 동기화는 기존 경로 한도 내).
