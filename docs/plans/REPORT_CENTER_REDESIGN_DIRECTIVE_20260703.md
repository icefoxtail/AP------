# 리포트 센터 재정렬 — Codex Task 지시서 (루프 엔지니어링)

작성일 2026-07-03 · 실행자: Codex Task (cold start 가능하게 자기완결적으로 기술)

> 이번 라운드는 **기능 추가가 아니라 화면 구조(IA) 개편**이다. 새 기능 20% / 화면 개편 50% / 기본 흐름 재정렬 30%.
> 원칙: **삭제가 아니라 숨김. 새 기능보다 기본 경로 재설계.**

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
- 브랜치: `main` 직접 커밋 금지. `feat/report-center-redesign`에서 STEP마다 커밋. (푸시/PR은 사람이 처리 — [[git-push-workflow]])
- 커밋 말미 `Co-Authored-By: Codex <noreply@anthropic.com>`.
- **전 STEP 프론트(`apmath/js`)만.** 워커/D1 변경 없음(이미 배포됨). 기존 데이터/API 재사용.
- 회귀 가드(항상 초록 유지):
  ```
  node tests/report-exam-trend.test.mjs
  node tests/exam-question-review-card.test.mjs
  node tests/apmath-report-easy-language.test.js
  node tests/apmath-global-surface.test.js
  ```
- `apmath-global-surface.test.js`는 `report-text.js+report-center.js+report-print.js` 전역 함수 표면을 잠근다. **새 함수를 추가하면** report 픽스처를 갱신해야 한다: `node tests/apmath-global-surface.test.js --update` 실행 후 **`git status`로 `tests/fixtures/apmath-surface-report.json`만 바뀐 것을 확인**(classroom/dashboard 픽스처는 건드리지 말 것 — 별건 미커밋 상태).

---

## 1. 배경·확정 설계 (불변식)

**목표 한 줄:** 리포트 센터를 *상시 관리용*(오늘/평가/상담 탭)에서 **실제 학교 기출 시험지 분석 + 학생별 오답 병합 + 상담/발송 시스템**으로 바꾼다.

**확정된 결정 (사장님 승인):**
1. 메인 흐름 = **시험지 중심 드릴다운** (L0 시험 목록 → L1 시험 대시보드 → L2 학생 리포트/상담).
2. 안 쓰는 기능은 **전역 '고급 보기' 토글**(기본 off)로 숨김 — 삭제 금지.
3. **L0 스코프 = "우리 학원 학생이 응시한 시험"만** (state.db.exam_sessions에 있는 archive_file). 전체 기출 탐색은 별도 `[시험지 찾기]`.
4. **미분석 시험지**: L1은 **열람+상태만**. 대량 초안 작성 UI는 안 만든다(초안은 오프라인 시드). 선생 인라인 편집·저장은 뒤 STEP.
5. **기존 진입 호환 유지**: 학생 상세 → 리포트 진입은 **L2로 직행**.

**목표 화면 구조:**
```
L0 · 시험지 목록 (진입 기본)   응시한 시험만, 카드=[시험명·학교/학년·문항분석 N/총·응시 M·오답입력 K] + [고급 보기 ▢] + [시험지 찾기]
L1 · 시험 대시보드            시험지 기준 분석(총평·단원/난도 분포·코호트 정답률=실시간 집계) + 문항 분석 상태 + 학생 리스트
L2 · 학생 리포트/상담          그 학생 오답 × 저장분석 병합 → PDF·상담초안·발송  (학생 상세에서 직행도 여기)
[고급/legacy]                 오늘 리포트·추이/분포 그래프·고급 스튜디오·AI 배지·상시 문구
```

**기본 PDF 목표 구조 (문제별 분석을 core로):**
```
1 학생 요약 → 2 학교 시험지 기준 분석 → 3 학생 오답 문항 분석표 → 4 오답 원인 요약 → 5 상담 포인트 → 6 학부모 발송 문구
```

**척추로 재사용(삭제·재작성 금지):** `archive_file` 그룹핑, `exam_question_reviews`/`exam_analysis_meta`, exam-analysis API, `reportCenterGetWrongIds`, `reportCenterGetExamReviews`, `reportCenterBuildQuestionReviewCard`, `reportCenterBuildQuestionReviewCardsForReport`, `reportCenterParseReviewJson`, `reportCenterBuildCleanPdfDocument`, `reportCenterGetExamReportData`.

**현재 코드 기준점(검증됨):**
- 최상위 탭 정의: `report-center.js`의 `[{key:'daily',label:'오늘 리포트'},{key:'exam',...},{key:'counsel',...}]` (2026-07-03 기준 ~1385행).
- studioOptions 기본값: `reportCenterStudioDefaultOptions()` (report-center.js) — `includeScoreTrend/TrendGraph/DistributionGraph=false`, `includeQuestionAnalysis/QuestionReview=true`, `includeQuestionReviewAnswer=false` 등.
- PDF 빌더: `reportCenterBuildCleanPdfDocument()` (report-print.js). 문항 리뷰 섹션은 `isDetailed && wrongCount && includeQuestionAnalysis && includeQuestionReview`로 게이팅(~435행). 문항별 분석표(~417), 코멘트(~445)도 `isDetailed && includeQuestionAnalysis`.
- 데이터: `state.db.exam_sessions`(archive_file·student_id·score·exam_title), `state.db.wrong_answers`(session_id·question_id·student_id), `state.db.exam_question_reviews`, `state.db.exam_analysis_meta`, `state.db.exam_blueprints`.

**문구 톤 정책** 준수: AI식 모호어·과한 캐주얼 금지, 학부모 문구는 가정 지도 제안 금지·학원 책임 강조 ([[apmath-report-copy-voice]]).

---

## STEP 1 — 전역 '고급 보기' 토글 + 리포트 센터 셸 분기

**목표**
`reportCenterAdvancedMode` 플래그(기본 off) 도입. off면 새 드릴다운 셸, on이면 기존 daily/exam/counsel 탭. 이 STEP은 **스위치 골격**만(드릴다운 내용은 이후 STEP).

**대상 파일**
- `apmath/js/report-center.js` (토글 getter/setter, 셸 분기, 토글 버튼 UI)
- `tests/report-center-shell.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterAdvancedMode()` / `reportCenterSetAdvancedMode(bool)` — localStorage 키 `apmath.reportCenter.advanced`, 기본 false.
2. 리포트 센터 최상위 렌더에서 분기: `advanced ? <기존 daily/exam/counsel 탭 렌더> : <새 드릴다운 컨테이너>`. 드릴다운 컨테이너는 이 STEP에선 L0 플레이스홀더(다음 STEP에서 채움)로 둔다.
3. 상단에 `[고급 보기]` 토글 버튼(체크박스/스위치). onchange → 모드 저장 + 재렌더.
4. 드릴다운 내비 상태(선택 archive_file, 선택 student) 저장소: `window.AP_REPORT_NAV = { level, archiveFile, studentId }` 또는 동등한 상태 객체 + `reportCenterNavTo(level, params)` 헬퍼.

**검증**
```
node tests/report-center-shell.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**: 기본(advanced off)에서 셸이 드릴다운 컨테이너를 렌더하고 기존 탭 마크업(오늘 리포트/평가 리포트/상담 리포트 라벨)이 안 보임. `reportCenterSetAdvancedMode(true)` 후 렌더하면 기존 탭 라벨이 다시 보임. 토글 왕복이 상태를 보존.

**DoD**: 위 2개 초록 + 회귀 4종 초록. 기존 기능은 **고급 모드에서 100% 그대로** 접근 가능(숨김이지 삭제 아님).

---

## STEP 2 — L0 시험지 목록 (응시한 시험만)

**목표**
드릴다운 L0: state.db.exam_sessions를 archive_file로 그룹핑해 **응시한 시험만** 카드로. 카드에 상태 뱃지(문항분석 N/총·응시 M·오답입력 K). 카드 클릭 → L1.

**대상 파일**
- `apmath/js/report-center.js`
- `tests/report-center-exam-hub.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterBuildExamHubList()` (순수 함수): `state.db.exam_sessions` → archive_file별 그룹 `{archiveFile, title, school, grade, takers, wrongEntered, reviewCount, blueprintCount}`. `reviewCount`=exam_question_reviews 중 그 archive_file 수, `blueprintCount`=exam_blueprints 수(총 문항), `wrongEntered`=오답 row가 있는 세션 수.
2. L0 렌더: 최근순 카드 그리드. 각 카드 상태 뱃지. 빈 상태 문구.
3. `[시험지 찾기]` 버튼 — 이 STEP은 **스텁**(전체 기출 탐색은 후속). 눌러도 되되 "준비 중" 또는 기존 아카이브 화면 링크로.
4. 카드 클릭 → `reportCenterNavTo('exam', {archiveFile})`.

**검증**
```
node tests/report-center-exam-hub.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**: mock state.db(세션 2개 archive + 세션 없는 archive 1개)에서 `reportCenterBuildExamHubList`가 **세션 있는 archive만** 반환, takers/reviewCount 집계 정확, 세션 0인 archive 제외.

**DoD**: 리포트 센터 열면(기본) 응시한 시험 카드 목록이 보임. 회귀 초록.

---

## STEP 3 — L1 시험 대시보드

**목표**
시험 선택 시 대시보드: ①시험지 기준 분석(총평=exam_analysis_meta, 단원/난도 분포=blueprint, **코호트 정답률=state.db에서 실시간 집계**) ②문항 분석 상태(N/총) ③학생 리스트(점수·오답수). 학생 클릭 → L2.

**대상 파일**
- `apmath/js/report-center.js`
- `tests/report-center-exam-dashboard.test.mjs` (신규)
- `tests/fixtures/apmath-surface-report.json` (--update)

**작업**
1. `reportCenterBuildCohortRates(archiveFile)` (순수): 워커 로직과 동일하게 로컬 집계 — takers = 그 archive 세션 수, 문항별 correct_rate = (takers − 오답수)/takers. (워커 `routes/exams.js`의 exam-analysis GET 집계와 **동일 공식** 유지.)
2. `reportCenterBuildExamDashboard(archiveFile)` 렌더: 총평·분포·정답률 + 문항 분석 상태 카드 + 학생 리스트(state.db.exam_sessions 필터 + wrong_answers로 오답수).
3. 문항 분석 "미분석"이면 상태만 표기(작성 UI 없음). 분석 있으면 문항 리뷰는 **읽기 뷰**(`reportCenterBuildQuestionReviewCard` 재사용, 편집 없음).
4. 학생 행 클릭 → `reportCenterNavTo('student', {archiveFile, studentId})`. 뒤로가기(→L0) 내비.

**검증**
```
node tests/report-center-exam-dashboard.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**: `reportCenterBuildCohortRates`가 STEP 데이터로 정답률을 정확히 계산(오답 0 문항=100%, takers=0이면 null). 대시보드가 학생 리스트를 오답수와 함께 렌더.

**DoD**: L0→L1 드릴다운 동작, 대시보드에 분석/상태/학생 표시. 회귀 초록.

---

## STEP 4 — 기본 PDF 재구성 (문제별 분석을 core로)

**목표**
`reportCenterBuildCleanPdfDocument`에서 **문항 리뷰/분석을 표준에서도 기본 노출**로 승격하고, 섹션을 6구조로 재정렬. 추이·분포는 고급(`reportCenterAdvancedMode`/기존 토글) 전용으로 내림.

**대상 파일**
- `apmath/js/report-print.js`
- `tests/report-exam-trend.test.mjs` / `tests/apmath-report-easy-language.test.js` (기대 갱신)

**작업**
1. 문항 리뷰 섹션(~435행)·문항별 분석표(~417)·코멘트(~445)의 **`isDetailed` 게이트 제거** → `wrongCount && includeQuestionAnalysis (&& includeQuestionReview)`만으로 표준에서도 출력. (분량은 오답 카드 상한 유지 — 기존 limit 6.)
2. 섹션 순서를 목표 6구조로 재배치: 학생 요약 → 시험지 기준 분석 → 오답 문항 분석표 → 오답 원인 요약 → 상담 포인트 → 학부모 발송.
3. 추이(`지금 어디쯤 있나요`)·분포 그래프는 `includeScoreTrend`/`includeDistributionGraph`가 **고급 모드에서만 켜지게**(기본 off 유지). 표준 기본 리포트에는 안 나옴.
4. 페이지브레이크 규칙 유지([[apmath-report-pdf-page-break]]): 새/이동 섹션에 `break-inside:avoid` 보장.

**검증**
```
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
```
**assert할 것(갱신/추가)**: 표준(비-detailed) 리포트에서 오답 있으면 **문항 리뷰 섹션이 기본 렌더**(`aprc-pdf-review-panel`). 추이/분포는 기본 미노출. 만점은 리뷰 섹션 생략. 문구 금지어 0.

**DoD**: 표준 리포트가 6구조·문항 분석 core로 나옴. 회귀 초록.

---

## STEP 5 — L2 학생 리포트/상담 + 기존 진입 호환

**목표**
L2 뷰(학생 오답 병합 → PDF·상담초안·발송) 정리 + **학생 상세 → 리포트 진입을 L2로 직행**.

**대상 파일**
- `apmath/js/report-center.js`
- (진입점) 학생 상세에서 리포트를 여는 호출부 (기존 `reportCenterOpenPrintView`/진입 함수)
- `tests/report-center-student-view.test.mjs` (신규)

**작업**
1. `reportCenterBuildStudentView(archiveFile, studentId)`: 그 학생 세션 찾기 → 기존 `reportCenterBuildCleanPdfDocument`/카드 자산으로 오답 병합 요약 + 버튼(PDF·상담초안·카톡).
2. 학생 상세 → 리포트 진입 시 `reportCenterNavTo('student', ...)`로 L2 직행(드릴다운 셸 안). 기존 PDF 생성 경로는 그대로 재사용.
3. 뒤로가기 내비(L2→L1→L0) 일관성.

**검증**
```
node tests/report-center-student-view.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**: L2가 특정 학생 오답 문항만 병합 렌더. 학생 직행 진입이 L2 상태로 셋업.

**DoD**: L1→L2 및 학생 상세→L2 직행 동작. 회귀 초록.

---

## STEP 6 — 옛 기능 고급 모드 이전 + 폴리시

**목표**
오늘 리포트·추이/분포 그래프·고급 스튜디오 편집·AI 프리미엄 배지·상시 문구를 **고급 모드 뒤로** 정리(기본 화면에서 제거되되 고급에서 접근 가능). 폴리시·페이지브레이크 QA.

**대상 파일**
- `apmath/js/report-center.js`, `apmath/js/report-print.js`

**작업**
1. 위 항목들의 렌더 지점을 `reportCenterAdvancedMode()` 게이팅으로 감싸기(삭제 금지, 코드·함수 보존).
2. 기본 화면에서 이들이 안 보이는지, 고급에서 전부 복원되는지 확인.
3. 시각 폴리시: 카드 배치·여백·타이포 정리(형님 요청 "카드 배치도 변화").
4. 전 STEP 종합 회귀 + 페이지브레이크 육안 QA(덤프 스니펫).

**검증**: 회귀 4종 + 신규 테스트 전부 초록. `node -e` 덤프로 기본/고급 렌더 차이 육안 확인.

**DoD**: 기본 화면은 드릴다운·문항분석 중심으로 깔끔, 고급 토글로 옛 기능 100% 복원. 회귀 초록.

---

## 부록 A — 절대 하지 말 것
- 기능/함수 **삭제 금지**(전부 숨김/게이팅). 부록 없이 지운 함수 발견 시 되돌릴 것.
- STEP당 [대상 파일] 밖 수정 금지. 워커/D1/마이그레이션 변경 금지(이번 라운드 프론트 전용).
- 하위 에이전트 검수 스폰 금지. `main` 직접 커밋/푸시 금지, 훅·서명 우회 금지.
- 회귀 테스트 빨간 채로 다음 STEP 금지. global-surface 픽스처는 report만 `--update`.

## 부록 B — 사후 검수(사람이 함)
각 STEP 커밋 후 Claude가 직접: (1)기본 화면이 드릴다운으로 뜨는지 (2)고급 토글로 옛 기능 복원되는지 (3)표준 PDF에 문항 분석이 core로 나오는지 (4)회귀·표면 스냅샷 (5)삭제된 함수 없음 을 확인한다. Codex는 검수를 대행하지 않는다.
