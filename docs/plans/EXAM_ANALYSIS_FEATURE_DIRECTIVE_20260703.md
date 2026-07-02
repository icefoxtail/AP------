# 시험 분석표 기능 — Codex Task 지시서 (루프 엔지니어링)

작성일 2026-07-03 · 대상 실행자: Codex Task (cold start 가능하도록 자기완결적으로 기술)

---

## 0. 이 문서 사용법 (루프 실행 규약)

이 기능은 **5개 STEP**으로 나뉜다. 각 STEP은 독립적으로 실행·검증·게이트 통과가 가능한 "루프 1회"다.

각 STEP은 다음 순서로 실행한다. **게이트(DoD)가 초록이 되기 전에는 다음 STEP으로 넘어가지 않는다.**

```
루프 1회 =
  (1) [목표] 읽기
  (2) [대상 파일]만 수정 (그 외 파일 건드리지 않음)
  (3) [작업] 구현
  (4) [검증 명령] 실행 → 전부 통과할 때까지 (3)↔(4) 반복
  (5) [DoD] 체크리스트 전부 충족 확인
  (6) 커밋 (아래 규약) → 다음 STEP
```

**공통 규약**
- 브랜치: `main` 직접 커밋 금지. `feat/exam-analysis` 피처 브랜치에서 작업, STEP마다 커밋. (gh 미설치 환경이면 커밋만 하고 PR 링크는 사용자에게 안내)
- 커밋 메시지 말미: `Co-Authored-By: Codex <noreply@anthropic.com>` 관례 유지(레포 git user=Codex).
- STEP 1~4는 **프론트(`apmath/js`)만** 수정 → 커밋만으로 로컬 검증됨. STEP 5만 워커/D1(별도 배포).
- 회귀 가드: 어떤 STEP이든 아래 전체 테스트가 계속 초록이어야 한다.
  ```
  node tests/apmath-report-easy-language.test.js
  node tests/report-exam-trend.test.mjs
  node tests/apmath-global-surface.test.js
  node tests/apmath-consultation-save-fallback.test.js
  node tests/apmath-student-grade-report-entry.test.js
  ```
  주의: `apmath-global-surface.test.js`는 `classroom.js+classroom-planner.js` / `report-text.js+report-center.js+report-print.js` 두 그룹의 **전역 함수 표면 스냅샷**을 잠근다. 이 기능은 report 그룹에 **새 함수를 추가**하므로, 해당 STEP에서 스냅샷 기대값을 함께 갱신해야 한다(그 파일의 expected 카운트/목록 수정).

---

## 1. 배경·불변식 (반드시 준수)

**목표 한 줄:** 시험지(=`archive_file`) 1장당 문항 분석을 **한 번 잘 써서 저장**하고, 모든 학생 리포트·블로그 분석에서 **재사용**한다. 엔진은 "생성"이 아니라 "집계 + 저장된 분석 끼워넣기"만 한다.

**데이터 소스 (이미 존재, 검증됨)**
- `reportCenterGetExamReportData(studentId, sessionId)` → `{ student, session, stats, archiveDetails, ... }` (report-center.js:1304)
- `reportCenterGetQuestionDetailMap(data)` → `Map<String(questionNo), detail>` (report-center.js:1435)
- `detail` 필드(아카이브 원천, report-center.js:508-552): `questionNo, found, content, contentText(≤260), choices[](각 ≤120), answer, solution, solutionText(≤260), level, unit, unitKey, cluster, correctRate, classCorrectRate, meaning`
- `reportCenterArchiveTextToHtml(value)` (report-center.js:742) — escape + `\n→<br>`, LaTeX 보존. 프린트 뷰는 MathJax(tex-svg) 로드하므로 수식 렌더됨(report-print.js:575-592).
- `reportCenterSelectPriorityWrongRows(wrongRows, limit)` (report-center.js:1476) — 오답 우선순위 정렬.
- `REPORT_COPY_BANK.questionInsight` (report-text.js:73) — 정답률 구간별 확정 문구(폴백용).
- `stats.wrongRows[]`, `stats.rows[]`, `session.archive_file`.

**문구 톤 정책** (기존 테스트가 강제)
- AI식 모호어 금지: `학습 흐름/성취 흐름/풀이 흐름/시사점/유의미/향후/다각도로/체계적인 관리/학습 폭/보완 지점/보완 포인트/확인 포인트/개선이 기대됩니다/종합적으로 파악/학습 방향 설정`.
- 과한 캐주얼 금지: `다 맞았습니다/올려보겠습니다/풀어보겠습니다/다시 잡겠습니다`.
- `remediation`·`wrongCare` 성격 문구엔 문항번호(`\d+번`) 노출 금지.
- 학부모 문구는 "가정 지도 제안" 금지, "학원이 책임지고 진행" 강조(기존 방향).
- 최종 정화기 `reportCenterApplyEasyFinalLanguage`(report-text.js:235)를 통과해도 깨지지 않는 완성 문장만 뱅크/생성에 둔다.

**저장 스키마 (확정)**
```
exam_question_reviews   PK(archive_file, question_no)
  archive_file, question_no, review_text, answer(선택), updated_at, updated_by
exam_analysis_meta      PK(archive_file)
  archive_file, overview_text, updated_at, updated_by
```
키가 `archive_file`이므로 그 시험지를 본 **모든 학생·모든 선생님이 동일 분석표 공유**. 저장/동기화는 `exam_blueprints` 패턴(worker `routes/exams.js`, `ON CONFLICT(archive_file, question_no) DO UPDATE`) 복제.

---

## STEP 1 — 공유 "문항 리뷰 카드" 순수 함수

**목표**
아카이브 detail(+저장된 review_text) 하나를 받아 카드 HTML을 반환하는 순수 함수. 리포트·블로그 양쪽에서 공용. 부작용/DOM 접근 없음.

**대상 파일**
- `apmath/js/report-print.js` (렌더 계열이 여기 있음)
- `tests/exam-question-review-card.test.mjs` (신규)
- `tests/apmath-global-surface.test.js` (report 그룹 스냅샷 갱신)

**작업**
1. 함수 추가:
   ```
   reportCenterBuildQuestionReviewCard(review, opts = {})
   ```
   - `review`: `{ questionNo, unit, level, correctRate, classCorrectRate, contentText, choices, answer, solutionText, reviewText }`
   - `opts`: `{ showAnswer=false, showContent=true, showSolution=true, anonymized=false, badge=true }`
   - 반환: 카드 HTML 문자열. 구성(위→아래):
     - 헤더: `${questionNo}번 · ${unit}` + 난도 배지(`level` → 쉬움/보통/어려움/매우 어려움 색)
     - 정답률 바: 전체/반 (`Number.isFinite` 가드, 없으면 생략)
     - 문항 원문(`showContent && contentText`): `reportCenterArchiveTextToHtml(contentText)` + choices
     - 정답(`showAnswer && answer`): `reportCenterArchiveTextToHtml(answer)`
     - 풀이 포인트: `reviewText`(저장된 분석) 우선, 없으면 `reportCenterBuildParentQuestionInsight(review, null, { mode:'full' })` 폴백
     - 해설 요약(`showSolution && solutionText`)
   - 모든 사용자 텍스트는 escape (원문/정답/해설만 `reportCenterArchiveTextToHtml`).
   - 난도 라벨 매핑 헬퍼가 없으면 `reportCenterGetQuestionDifficultyLabel`(report-center.js 존재) 재사용 또는 정답률 구간 매핑.
2. CSS는 기존 `aprc-*` 프린트 스타일과 충돌 없게 `aprc-qreview-*` 접두사로, `reportCenterPremiumReportStyle()`에 최소 규칙 추가(카드/배지/바). 다크모드·프린트 색 보존(`print-color-adjust:exact`) 유지.

**검증 명령**
```
node tests/exam-question-review-card.test.mjs
node tests/apmath-global-surface.test.js
```
**신규 테스트가 assert할 것**
- reviewText 있으면 그 문장이 카드에 포함, 없으면 폴백 문구 포함.
- `showAnswer=false`면 정답 문자열 미노출, `true`면 노출.
- correctRate/classCorrectRate 없을 때 바 미출력(깨진 `NaN%` 없음).
- 금지어 0(위 정책 목록), 카드 HTML에 `<script`/코드 텍스트 유출 없음(`reportCenterLooksLikeCodeText` 통과).
- contentText의 `$...$` LaTeX가 보존(escape는 되되 `$` 제거 안 됨).

**DoD**
- [ ] 위 두 명령 초록
- [ ] 회귀 5종 초록
- [ ] `reportCenterBuildQuestionReviewCard`가 DOM/전역 상태를 읽지 않음(인자만 사용)

---

## STEP 2 — 로컬 저장 스키마 + 저장/불러오기 + "가져오기" UI

**목표**
워커 없이 프론트 `state.db`에서 분석표를 저장/조회. 리포트 스튜디오에 "이 시험지 분석표 가져오기" 동작 추가.

**대상 파일**
- `apmath/js/core.js` (state.db 기본 배열 등록: `apmath/js/core.js:122` 근처 목록에 `exam_question_reviews: []`, `exam_analysis_meta: []` 추가, 로드/정규화 함수도 동일 위치군에 추가)
- `apmath/js/report-center.js` (조회/업서트 헬퍼 + 스튜디오 버튼 핸들러)
- `tests/exam-analysis-store.test.mjs` (신규)
- `tests/apmath-global-surface.test.js` (report/기타 그룹 갱신 필요 시)

**작업**
1. state.db 배열 2개 등록 + 방어적 로드(`Array.isArray` 가드), `core.js`의 기존 `report_exam_cohort_stats` 처리 방식과 동일 패턴.
2. 헬퍼(report-center.js):
   - `reportCenterGetExamReviews(archiveFile)` → `{ meta, byQuestion: Map<qNo, review> }`
   - `reportCenterUpsertExamReview(archiveFile, questionNo, patch)` / `reportCenterUpsertExamMeta(archiveFile, patch)` — `archive_file`+`question_no` 기준 upsert, `updated_at` 갱신.
   - `archive_file` 정규화는 기존 `reportCenterNormalizeArchiveFile` 재사용.
3. 스튜디오 UI: 레이아웃/텍스트 탭 어딘가에 버튼 "이 시험지 분석표 가져오기"(`session.archive_file` 기준). 클릭 시 저장된 review를 studioState에 실어 재렌더(STEP 3에서 실제 삽입).

**검증 명령**
```
node tests/exam-analysis-store.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**
- upsert 후 같은 `(archive_file, question_no)` 재저장 시 중복 생성 아니라 갱신(길이 불변, review_text 교체).
- `reportCenterGetExamReviews`가 없는 시험지에 대해 빈 `byQuestion`, `meta=null` 안전 반환.
- state.db 로드가 배열 아닌 값을 받아도 빈 배열로 정규화.

**DoD**
- [ ] 위 명령 초록, 회귀 5종 초록
- [ ] 저장은 순수 state.db 조작(네트워크 호출 없음 — 워커는 STEP 5)

---

## STEP 3 — 학생 리포트 상세형 분석표에 카드 삽입

**목표**
상세형 리포트에서 그 학생 **오답 문항**에, 저장된 분석표가 있으면 STEP 1 카드로 렌더해 `문제별 분석`/`문제별 코멘트` 아래 삽입. 없으면 기존 동작 유지.

**대상 파일**
- `apmath/js/report-print.js` (`reportCenterBuildCleanPdfDocument`, 문제별 코멘트 섹션 report-print.js:296-299 부근)
- `apmath/js/report-center.js` (`reportCenterStudioDefaultOptions` 옵션 추가)
- `tests/report-exam-trend.test.mjs` / `tests/apmath-report-easy-language.test.js` (기대 갱신)

**작업**
1. 옵션 추가: `reportCenterStudioDefaultOptions()`에 `includeQuestionReview: true`(상세형에서만 실렌더). 레이아웃 탭 행 추가(‘문항 리뷰 카드 포함’, scope 'detailed').
2. `reportCenterBuildCleanPdfDocument`에서 `isDetailed && studioOptions.includeQuestionReview && studioOptions.includeQuestionAnalysis`일 때:
   - `session.archive_file`로 `reportCenterGetExamReviews` 조회.
   - `reportCenterSelectPriorityWrongRows(stats.wrongRows, N)` (N은 페이지 분량 상한: 오답 카드 최대 6개 권장) 각 행을 detailMap + review로 병합해 `reportCenterBuildQuestionReviewCard(review, { showAnswer:<옵션>, anonymized:false })` 호출.
   - 저장된 review 없으면 폴백(insight 뱅크). 즉 "분석표 가져오기" 안 했어도 최소 카드는 나옴.
   - 새 섹션 `<section class="aprc-pdf-section aprc-pdf-review-panel aprc-pdf-panel">` 로 감싸고, break-inside:avoid 규칙을 CSS의 page 규칙 목록에 추가(report-print.js:505 부근).
3. `showAnswer` 노출 여부는 옵션(`includeQuestionReviewAnswer`, 기본 false)으로 열어둔다 — 학부모 노출 정책은 사용자가 나중에 토글로 결정(미결 항목).

**검증 명령**
```
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
```
**assert할 것(추가/갱신)**
- 상세형 + 오답 있음 → 리뷰 카드 섹션 렌더(대표 오답 questionNo 포함).
- 표준형에서는 미렌더(상세형 전용).
- 만점(오답 0) → 리뷰 섹션 미렌더, 기존 만점 assert 유지.
- 저장 review 있으면 그 문장이 카드에 나타남, 없으면 폴백 문구.
- 페이지 카드 상한(≤6) 지켜짐.

**DoD**
- [ ] 위 3종 초록, 회귀 나머지 초록
- [ ] 상세형/표준형/만점 3케이스 시각 확인(아래 수동 덤프 스니펫으로 출력 확인)

**수동 덤프(선택, 눈 검증용)**: `node -e`로 mock data 넣어 `reportCenterBuildCleanPdfDocument`의 review 섹션만 출력해 톤/분량 확인.

---

## STEP 4 — 시험 분석 뷰(블로그형 HTML)

**목표**
시험(`archive_file`) 선택 → 총평 + 단원/난이도 분포 + **전 문항** 리뷰 카드 → 익명 블로그 붙여넣기 HTML 생성·복사.

**대상 파일**
- `apmath/js/report-center.js` (신규 뷰 빌더 `reportCenterBuildExamAnalysisArticle(archiveFile, opts)` + 진입 UI)
- `apmath/index.html` (진입점 필요 시)
- `tests/exam-analysis-article.test.mjs` (신규)

**작업**
1. 집계(자동): 해당 `archive_file`의 blueprint(단원/난도) + `report_exam_cohort_stats`/세션 오답으로 **전 문항 정답률**·단원 분포·난이도 분포·평균/최고/최저 계산(학생 특정 없음, 익명).
2. 총평: `exam_analysis_meta.overview_text` 있으면 사용, 없으면 정답률 구간 기반 폴백 총평 생성.
3. 전 문항 카드: STEP 1 함수 `opts={ anonymized:true, showAnswer:true, showContent:true }`로 blueprint 문항 순회.
4. 출력: 자기완결 HTML 문자열 + "복사" 동작(clipboard). 스타일은 인라인 or scoped(블로그 외부에서도 깨지지 않게). 학생 이름·개인정보 절대 미포함.

**검증 명령**
```
node tests/exam-analysis-article.test.mjs
node tests/apmath-global-surface.test.js
```
**assert할 것**
- 전 문항 수 = blueprint 문항 수.
- 학생 이름/학생 식별자 문자열 미포함(익명).
- 총평 저장분 있으면 사용, 없으면 폴백 비어있지 않음.
- 금지어 0.

**DoD**
- [ ] 위 명령 초록, 회귀 초록
- [ ] 생성 HTML을 파일로 덤프해 브라우저에서 1회 육안 확인

---

## STEP 5 — 워커 D1 동기화 (별도 배포)

**목표**
`exam_question_reviews` / `exam_analysis_meta`를 D1에 두고 전 선생님 공유. **프론트 커밋만으론 라이브 안 됨** — 마이그레이션+라우트+배포 필요.

**대상 파일**
- `apmath/worker-backup/worker/migrations/20260703_exam_analysis.sql` (신규)
- `apmath/worker-backup/worker/schema.sql` (반영)
- `apmath/worker-backup/worker/routes/exams.js` (라우트 추가)
- `apmath/js/*` (동기화 pull → state.db 병합)

**작업**
1. 마이그레이션: 위 2개 테이블 생성(PK 포함), `stage6a_exam_blueprints.sql`/`ON CONFLICT` 패턴 복제.
2. 라우트: `GET ?archive_file=` (목록), `POST` upsert(`ON CONFLICT(archive_file, question_no) DO UPDATE`) — `exam_blueprints` 블록(exams.js:850-906) 그대로 참고. `getTableColumnSet`/`jsonResponse` 재사용.
3. 프론트: 로그인/동기화 시 `report_exam_cohort_stats`와 같은 경로로 pull → `state.db.exam_question_reviews`/`exam_analysis_meta` 병합. 저장 시 워커 POST.

**검증**
- 로컬 wrangler dev로 라우트 스모크(가능 환경에서). 
- 배포는 `apmath-deploy-topology` 규약: 프론트(Pages)와 워커(Cloudflare) 별도. 워커 배포 없이는 API 미반영임을 사용자에게 반드시 고지.

**DoD**
- [ ] 마이그레이션 idempotent(재실행 안전)
- [ ] 라우트 upsert 중복 생성 없음
- [ ] 배포 전/후 구분해 사용자에게 상태 보고

---

## 부록 A — 미결 항목(사용자 결정 대기)
- 리포트 삽입 카드에 **정답·해설 학부모 노출** 여부 → STEP 3에서 `includeQuestionReviewAnswer` 토글로 열어만 두고 기본 false. 사용자 확정 시 기본값만 변경.

## 부록 B — 절대 하지 말 것
- 한 STEP에서 [대상 파일] 밖 파일 수정 금지(범위 오염 방지).
- 자동 생성 문구로 얇은 prose를 늘리지 말 것(품질 이유로 "저장된 분석 재사용"이 원칙).
- `main` 직접 커밋/푸시 금지, 훅/서명 우회 금지.
- 회귀 테스트가 하나라도 빨간 채로 다음 STEP 진행 금지.
