# /goal 학교시험 분석 2차 — 분석표 테이블화 · 운영 저장 · 시험지 단위 프리미엄 문항분석

작성일 2026-07-04 · 실행자: Codex Task (cold start 가능하게 자기완결적으로 기술)
검수: 사람(Claude/Opus)이 구현 완료 후 직접 수행. **Codex는 검수/리뷰 에이전트를 스폰하지 않는다.**

> **GOAL 한 줄:** 선생님용 문항 분석을 "벽글 나열"에서 **한 줄=한 문항 표(스크린샷 참조형)** 로 바꾸고 PDF 출력까지 붙인다. 동시에 상담 수정본·프리미엄 AI 결과를 **서버(D1)에 영속 저장**하고, **시험지 단위 프리미엄 문항분석**(AI가 문항별 분석 JSON 생성 → `exam_question_reviews` 저장)을 신설한다.
> 이 /goal은 STEP 1~7을 **처음부터 끝까지 전부 완료**한 뒤에만 종료한다. 중간 보고/중단 없음. STEP마다 게이트(DoD) 초록 → 커밋 → 다음.

---

## 0. 루프 실행 규약

```
루프 1회 = (1)목표 읽기 → (2)대상 파일만 수정 → (3)구현
          → (4)검증 명령 전부 통과까지 (3)↔(4) 반복 → (5)DoD 체크 → (6)커밋 → 다음 STEP
```

- **브랜치: 로컬 `main`에 직접 커밋** (사장님 지시 — 별도 브랜치 금지, 혼란 방지). 푸시는 사람이 한다.
- 커밋 말미 `Co-Authored-By: Codex <noreply@anthropic.com>`. 커밋 메시지에 STEP 번호 명기.
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
  node tests/report-school-exam-counsel.test.mjs
  node tests/report-school-exam-edit.test.mjs
  node tests/report-archive-image.test.mjs
  node tests/apmath-report-center-unified-entry.test.mjs
  node tests/report-parent-safe-comment.test.mjs
  node tests/report-math-normalize.test.mjs
  node tests/report-review-schema.test.mjs
  node tests/report-pdf-dedup.test.mjs
  ```
- `apmath-global-surface.test.js`: 새 전역 함수 추가 시 `node tests/apmath-global-surface.test.js --update` 후 **`tests/fixtures/apmath-surface-report.json`만 변경 확인** (classroom/dashboard 픽스처 절대 커밋 금지 — `git checkout -- tests/fixtures/apmath-surface-classroom.json`으로 복구).
- **워커 변경은 이번 라운드 허용** (STEP 4·6). 소스는 `apmath/worker-backup/worker/`. 단, **배포는 사람이 별도로 한다** — 커밋만으로 라이브 반영 안 됨. 프론트는 서버 미배포 상태에서도 **로컬 폴백으로 동작**해야 한다(불변식).

---

## 1. 배경·불변식 (반드시 지킬 것)

### 1-1. 현재 코드 기준점 (2026-07-04 main)

- 드릴다운: `reportCenterBuildDrilldownShell` → L1 `reportCenterBuildExamDashboard(studentId, archiveFile)` (report-center.js). L1 순서: 요약 → 반 선택 → 학생 선택 → `<details>`시험 대시보드(분포/문항분석상태/정답률).
- 문항 분석 상태: 현재 `Array.from(reviews.byQuestion.values()).map(row => reportCenterBuildQuestionReviewCard(row, { compact: true }))` — **`compact` 옵션은 미구현이라 무시됨** → 풀 카드가 벽글로 나열되는 상태. `.aprc-qreview-*` 스타일은 **프린트 문서 CSS에만** 있고 wide 모달엔 없음.
- 디자인 언어: wide 모달 스타일(`report-center-wide-style`, `reportCenterEnsureWideOverlay` 안)에 `aprc-section`, `aprc-section-title`, `aprc-chip`, `aprc-pick-*`, `aprc-back-btn`, `aprc-action-btn(--primary/--accent)` 클래스 존재. **새 UI는 전부 이 클래스 체계에 맞춘다** (인라인 스타일 금지, hover/active/focus-visible 상태 포함, 색은 `--primary-soft`/`--primary-rgb` 토큰).
- 분석 데이터: `state.db.exam_question_reviews`(archive_file·question_no·review_text·answer). `review_text`는 JSON 가능 — `reportCenterParseReviewJson`이 `concept/tag/asks/trap/key/teach` 인식. 태그 4종 고정 `reportCenterErrorTags()` = 계산·검산/풀이 순서/조건 해석/개념 재정리. `reportCenterResolveErrorTag(reviewData, correctRate)`.
- 코호트: `reportCenterBuildCohortRates(archiveFile)` → `{ takers, rows:[{questionNo, wrongCount, correctRate}] }` 실시간 집계.
- 수식: `reportCenterNormalizeMathText`(ASCII→LaTeX) + `reportCenterTypesetMath`. 프린트 셸은 MathJax typeset 후 print.
- 프리미엄 AI: `reportCenterRequestSchoolExamAiAnalysis(studentId, sessionId)` → `api.post('ai/report-analysis', reportCenterBuildExamAiPayload(...))` → `reportCenterSetCachedAiAnalysis(sessionId, ...)` (**memory+localStorage만**, 서버 저장 없음).
- 상담 수정 저장: `reportCenterSaveSchoolExamCounselReport` → `reportCenterUpsertExamMeta(archiveFile, { counsel_reports: JSON })` — **state만 수정, API 호출 없음**.
- 워커: `apmath/worker-backup/worker/routes/exams.js`에 exam-analysis GET/POST(리뷰 upsert: review_text·answer만). D1 스키마 `20260703_exam_analysis.sql`: `exam_question_reviews(archive_file, question_no, review_text, answer, updated_at, updated_by)` + `exam_analysis_meta(archive_file, overview_text, updated_at, updated_by)`.
- 블루프린트 실필드: `standard_unit`, `standard_course`, `standard_unit_key`, `concept_cluster_key` (unit/unit_name/chapter 아님).

### 1-2. 선생님용 분석표 — 목표 형태 (사장님이 준 레퍼런스 스크린샷 기준, 그보다 상위 퀄리티)

레퍼런스: `번호 | 유형칩(객관식) | 난도칩(하~최상, 색상) | 출제의도·개념 한 줄 | 배점` 표.
**우리 표는 여기에 실데이터를 더해 이긴다:**

```
| # | 유형 | 난도 | 단원 | 출제의도·개념 (한 줄)          | 배점 | 전체 응시 정답률 | 오답 | 태그   |
| 1 | 객관식| 중   | 이차방정식 | 이차방정식의 정의 판별      | 3점  | 92% ▓▓▓▓▓░  |  1  | 개념   |
```

- **행 클릭(또는 ▶)** → 해당 행 아래로 풀 분석 펼침: `묻는 것 / 함정 / 풀이 포인트 / 지도 포인트` + 정답. 기본 전부 접힘.
- **내부용 전용 무기 (외부 분석표에는 없는 것 — 반드시 포함):**
  1. 펼침 블록에 **오답 학생 명단**: 그 문항을 틀린 학생 이름을 반별로 그룹핑해 칩으로 표기 (예: `중2A · 김가온 박도윤 | 중2B · 최서진`). 소스 = `wrong_answers`(question_id=행 번호) × 해당 archive 세션 × `class_students`/`classes`. 학생 수 많으면 반별 `이름들 (N명)`으로 접기.
  2. **반별 정답률 비교**: 드릴다운 진입 반(컨텍스트 반)이 있으면 정답률 셀을 `전체 72% · 우리 반 40%` 2줄로. 전체 대비 우리 반이 20%p 이상 낮은 문항은 행에 `수업 보강` 강조 표시(왼쪽 보더 accent) — 선생님이 표만 훑어도 수업에서 다룰 문항이 보이게. 소스 = 기존 `reportCenterGetClassExamSessions` 집계 로직 재사용.
- 난도칩 색: 하(회색)·중하(청록)·중(파랑)·상(주황)·최상(빨강) — 토큰 기반(`--secondary`, teal, `--primary`, orange, `--error` 계열), 인라인 hex 금지.
- 데이터 소스: 유형=`bp.questionType || reviewData.type || '객관식'`, 난도=`reviewData.level || bp.level || bp.difficulty || 정답률 파생 라벨`, 단원=`bp.standard_unit`, 출제의도·개념=`reviewData.concept || reviewData.asks 첫 문장`, 배점=`bp.score || bp.points || 원문 content의 [N점]/[N.N점] 패턴 추출 || '-'`, 정답률/오답=`reportCenterBuildCohortRates`.
- 정답률 셀은 숫자+미니 바(막대). 선생님용이므로 **내부 수치 그대로 노출 OK** (학부모 금지어 필터는 이 표에 적용하지 않는다 — 선생님 레이어).

### 1-3. 불변식

1. **삭제 금지** — 기존 함수/기능 전부 보존. 기존 카드 렌더(`reportCenterBuildQuestionReviewCard`)는 학생 리포트 쪽에서 계속 쓰인다.
2. **서버 미배포에도 동작** — 모든 서버 연동은 실패 시 조용히 로컬(state/localStorage) 폴백. `api.post/get` 실패가 화면을 깨면 안 된다.
3. **사람 작성 분석 보호** — 시험지 단위 AI 문항분석은 기본적으로 **리뷰가 비어 있는 문항만** 채운다. 이미 사람이 쓴 `review_text`가 있는 문항은 덮어쓰지 않는다(명시적 `overwrite:true` 옵션에서만 허용). AI 생성분은 JSON에 `"source":"ai"` 마킹.
4. **문구 톤**: 학부모행 문구는 기존 정책(가정 지도 제안 금지, 학원 책임 강조). 선생님 표는 raw 허용.
5. **PDF page-break**: 표는 `thead` 반복, 행/펼침 블록 `break-inside:avoid`. 섹션이 페이지 경계에서 쪼개지면 FAIL.
6. **수식**: 표의 개념/분석 텍스트는 `reportCenterNormalizeMathText` 통과 후 렌더, 화면·프린트 모두 MathJax typeset.

---

## STEP 1 — 소형 버그 보정 (분포 필드 + 해석 칸)

**목표** 상담 화면 신뢰도 직결 소형 패치 2건.

**대상 파일** `apmath/js/report-center.js`, `apmath/js/report-print.js`, `tests/report-center-exam-dashboard.test.mjs`(기대 추가)

**작업**
1. L1 단원/난도 분포 집계 필드 보정:
   ```js
   const unit = String(bp.standard_unit || bp.standardUnit || bp.unit || bp.unit_name || bp.chapter || '단원 미지정').trim();
   const difficulty = String(bp.difficulty || bp.level || bp.question_level || '난도 미지정').trim();
   ```
2. `reportCenterBuildPremiumQuestionRows`의 상세형 '해석' 칸 우선순위 교체: `reportCenterBuildParentSafeQuestionComment(row, detail, { mode:'short' }) || row.meaning` (mode:'short'가 없으면 짧은 진단을 반환하도록 `reportCenterBuildParentSafeQuestionComment`에 옵션 추가 — 뱅크 `short` 진단 + concept 결합).

**검증** `node tests/report-center-exam-dashboard.test.mjs` + 회귀 전체.
**assert**: mock blueprint에 `standard_unit`만 있어도 분포가 '단원 미지정'이 아님.
**DoD**: 회귀 초록 + 커밋.

---

## STEP 2 — 선생님용 문항 분석표 (테이블 UI)

**목표** L1 "문항 분석 상태" 벽글 → 1-2 스펙의 표. 행 펼침으로 풀 분석.

**대상 파일** `apmath/js/report-center.js`, `tests/report-exam-analysis-table.test.mjs`(신규), 픽스처 `--update`

**작업**
1. `reportCenterBuildExamAnalysisTableRows(archiveFile)` 순수 함수: blueprint+reviews+cohortRates 병합 → 행 배열 `{questionNo, questionType, level, unit, concept, points, correctRate, wrongCount, tag, reviewData, hasReview}`. 배점은 blueprint 필드 → 없으면 아카이브 원문 캐시가 있을 때 content의 `[N점]`/`[N.N점]` 추출(캐시 없으면 '-'; **fetch를 이 함수에서 트리거하지 않는다**).
2. `reportCenterBuildExamAnalysisTableHtml(archiveFile, opts)`: `<table class="aprc-qtable">` 렌더. 컬럼 = 1-2 스펙. 난도칩 `.aprc-qtable-level--(low|midlow|mid|high|top)`. 정답률 미니바. 리뷰 없는 문항은 개념 칸에 `분석 대기` 흐림 표시.
3. 행 펼침: `<tr class="aprc-qtable-detail">`(기본 hidden, 행 클릭 토글 — 전역 위임 핸들러 1개, 인라인 onclick 남발 금지). 펼침 내용 = 묻는 것/함정/풀이 포인트/지도 포인트/정답 (reviewData raw).
4. L1 대시보드의 문항 분석 상태 섹션을 이 표로 교체(기존 카드 나열 제거 — 함수는 보존). `23/-` → `reviewCount/(blueprintCount || session.question_count || rows.length)` 폴백.
5. `.aprc-qtable-*` 스타일을 `report-center-wide-style`에 추가 — 기존 aprc 디자인 언어(토큰·hover·focus) 준수. 렌더 후 `reportCenterTypesetMath` 호출 유지.

**검증** `node tests/report-exam-analysis-table.test.mjs` + 회귀.
**assert**: mock(블루프린트 3문항·리뷰 2문항·오답 데이터)에서 행 3개, 리뷰 없는 행 '분석 대기', 정답률 정확, `tag` 명시 시 태그 표기, 배점 `[3.8점]` 추출, **펼침 블록에 오답 학생 이름·반 그룹핑 포함**, **반 컨텍스트 존재 시 우리 반 정답률 병기 + 20%p 격차 문항 강조 마커**.
**DoD**: L1이 표로 렌더 + 행 펼침 동작(마크업 계약으로 검증) + 회귀 초록 + 커밋.

---

## STEP 3 — 분석표 인쇄/PDF 문서

**목표** STEP 2 표를 A4 인쇄 문서로. 대시보드에 `[분석표 인쇄/PDF]` 버튼.

**대상 파일** `apmath/js/report-center.js`(또는 report-print.js), `tests/report-exam-analysis-print.test.mjs`(신규), 픽스처 `--update`

**작업**
1. `reportCenterBuildExamAnalysisPrintDocument(archiveFile, opts)`: 헤더(시험명·학교/학년·응시 N·전체 평균·작성일) + 단원/난도 분포 요약 + STEP 2 표(**프린트 모드: 전 행 펼침** — 풀 분석이 각 행 아래 인쇄) 구성. 기존 `reportCenterBuildExamAnalysisArticle`은 보존(블로그용), 이 문서는 표 기반 신규.
2. `reportCenterOpenExamAnalysisPrintView(archiveFile)`: 기존 프린트 셸 패턴(MathJax typeset 완료 → print, onerror 타임아웃 폴백) 재사용. 인쇄 CSS: `@page A4`, `thead { display:table-header-group; }`, `tr·detail 블록 break-inside:avoid`.
3. 옵션 체크박스(클리닉 `~포함` 라벨 패턴): `문항 원문 포함`(기본 off — on이면 인쇄 직전 `reportCenterFetchArchiveBankByFile`로 원문 로드해 펼침 블록에 문제·보기 삽입), `지도 포인트 포함`(기본 on).
4. 대시보드 문항 분석 섹션 헤더에 `[분석표 인쇄/PDF]` 버튼(`.aprc-action-btn--accent`).

**검증** `node tests/report-exam-analysis-print.test.mjs` + 회귀.
**assert**: 문서에 시험명·표·전 행 풀 분석 포함, `break-inside:avoid`/`table-header-group` 존재, 원문 포함 off일 때 content 미포함.
**DoD**: 버튼 → 인쇄 문서 열림(코드 계약), page-break 규칙 존재, 회귀 초록 + 커밋.

---

## STEP 4 — D1 스키마 + 워커 라우트 (영속 저장 기반)

**목표** 학생별 리포트 수정본·AI 결과의 서버 저장 구조 + 문항 리뷰 구조화 컬럼.

**대상 파일** `apmath/worker-backup/worker/migrations/20260704_exam_student_reports.sql`(신규), `apmath/worker-backup/worker/routes/exams.js`, `apmath/worker-backup/worker/index.js`(라우트 등록), `apmath/worker-backup/worker/schema.sql`(동기화)

**작업**
1. 마이그레이션:
   ```sql
   CREATE TABLE IF NOT EXISTS exam_student_reports (
     archive_file TEXT NOT NULL,
     student_id TEXT NOT NULL,
     session_id TEXT,
     report_type TEXT NOT NULL DEFAULT 'counsel',   -- counsel | detail | simple
     fields_json TEXT,                               -- 상담 수정본(6구획)
     ai_json TEXT,                                   -- 프리미엄 분석 결과
     updated_at TEXT DEFAULT (datetime('now')),
     updated_by TEXT,
     PRIMARY KEY (archive_file, student_id, report_type)
   );
   ALTER TABLE exam_question_reviews ADD COLUMN concept TEXT;
   ALTER TABLE exam_question_reviews ADD COLUMN error_tag TEXT;
   ALTER TABLE exam_question_reviews ADD COLUMN difficulty TEXT;
   ALTER TABLE exam_question_reviews ADD COLUMN question_type TEXT;
   ```
   (`review_text` JSON은 계속 원본 소스 — 컬럼 4개는 검색/필터용 발췌. asks/trap/key/teach는 컬럼화하지 않는다: 표시 전용이라 JSON 유지가 단순하고 하위호환 안전.)
2. 라우트 (기존 exams.js exam-analysis 패턴·인증·에러 형식 준수):
   - `GET exams/student-reports?archive_file=...` → 해당 시험 전체 학생 리포트 rows
   - `POST exams/student-reports` → upsert (archive_file, student_id, report_type 키; fields_json/ai_json 부분 갱신 — 넘어온 필드만 덮어씀)
   - 기존 리뷰 POST upsert 시 `review_text`가 JSON이면 concept/tag/level/type을 파싱해 구조화 컬럼에 **함께 저장**(파싱 실패 시 컬럼 null, 실패해도 저장은 성공).
3. `node --check`로 워커 파일 문법 검증. (통합 테스트/배포는 사람 몫 — 부록 B.)

**검증** `node --check apmath/worker-backup/worker/routes/exams.js` + `node --check apmath/worker-backup/worker/index.js` + 회귀(프론트 무변경이므로 전부 초록이어야 정상).
**DoD**: 마이그레이션·라우트·스키마 동기화 커밋. 프론트 동작 무변화.

---

## STEP 5 — 프론트 서버 연동 (저장/로드, 로컬 폴백)

**목표** 상담 수정본·프리미엄 AI 결과를 서버에 저장하고 재진입 시 서버본 우선 로드. 서버 실패 시 기존 로컬 동작 그대로.

**대상 파일** `apmath/js/report-center.js`, `tests/report-school-exam-edit.test.mjs`(기대 추가), `tests/report-student-report-sync.test.mjs`(신규), 픽스처 `--update`

**작업**
1. `reportCenterSyncStudentReportToServer(archiveFile, studentId, patch)` : `api.post('exams/student-reports', ...)` fire-and-forget(await 하되 실패는 console.warn + 로컬 유지, toast 스팸 금지).
2. `reportCenterSaveSchoolExamCounselReport` 저장 시: 기존 로컬 upsert 유지 + `fields_json` 서버 동기화 호출 추가.
3. `reportCenterSetCachedAiAnalysis` 경로: 학교시험 프리미엄(`reportCenterRequestSchoolExamAiAnalysis`) 성공 시 `ai_json` 서버 동기화 추가 (세션·학생·아카이브 매핑은 세션에서 도출).
4. 로드: 드릴다운 L1/L2 진입 시(아카이브 확정 시점) `GET exams/student-reports`를 1회 시도(아카이브당 세션 캐시) → 성공하면 `state.db.exam_student_reports`에 넣고, `reportCenterGetSavedCounselFields`가 **서버본 → 로컬 exam_analysis_meta.counsel_reports → null** 순으로 조회. AI 캐시도 서버 `ai_json`이 있고 로컬 캐시가 없으면 hydrate(`reportCenterSetCachedAiAnalysis`).
5. **불변식 2 준수**: api 미존재/실패 환경(테스트 vm 포함)에서 전부 동작 — `typeof api?.post === 'function'` 가드.

**검증** `node tests/report-student-report-sync.test.mjs`(mock api로 POST payload·GET hydrate 검증) + `report-school-exam-edit`(서버 실패 시 로컬 저장 유지 assert 추가) + 회귀.
**DoD**: 저장→서버 POST 발생, 재진입 로드 우선순위 (서버>로컬), api 없음 환경 무해. 회귀 초록 + 커밋.

---

## STEP 6 — 시험지 단위 프리미엄 문항분석 생성

**목표** 시험지 전체를 AI로 1회 분석 → 문항별 JSON을 `exam_question_reviews`에 채움(빈 문항만) + 총평을 `exam_analysis_meta.overview_text`에. **이게 "문항 분석 퀄리티"의 본체.**

**대상 파일** `apmath/js/report-center.js`, `apmath/worker-backup/worker/routes/exams.js`(필요 시 ai 프록시 재사용 확인만), `tests/report-exam-archive-ai.test.mjs`(신규), 픽스처 `--update`

**작업**
1. `reportCenterBuildSchoolExamArchiveAiPayload(archiveFile)`: 시험 메타(제목·학교/학년·응시수) + 문항별 {번호, 단원(standard_unit), 원문 content/choices/정답/해설(아카이브 캐시 — 호출 전 `reportCenterFetchArchiveBankByFile` await), 전체 정답률·오답수(cohortRates), 기존 리뷰 유무}. `reportType:'exam_archive_analysis'`. instruction에 명시: **문항별 JSON 배열로만 응답** — `{questionNo, concept, tag(4종 중 1), asks, trap, key, teach}` — 자연스러운 문장, 채점 메모 말투 금지, tag는 `계산·검산|풀이 순서|조건 해석|개념 재정리`만.
2. `reportCenterRequestSchoolExamArchiveAiAnalysis(archiveFile, buttonEl)`: `api.post('ai/report-analysis', payload)` → 응답 파싱(json/text 방어) → **리뷰 비어 있는 문항만** `reportCenterUpsertExamReview(archiveFile, qNo, { review_text: JSON.stringify({...analysis, source:'ai'}), ... })` + 기존 exam-analysis 서버 저장 경로(있으면) 호출. 총평은 `reportCenterUpsertExamMeta(archiveFile, { overview_text })` — **기존 overview가 있으면 보존**(빈 경우만).
3. L1 문항 분석 섹션 헤더에 `[시험지 프리미엄 문항분석]` 버튼(`.aprc-action-btn--accent`). 실행 후 표 재렌더. 이미 전 문항 리뷰가 있으면 "모든 문항에 분석이 있습니다" toast + `overwrite` confirm 후에만 재생성.
4. 표(STEP 2)에서 AI 생성 문항은 개념 칸 옆 `AI` 마이크로 뱃지(사람 검수 대상 표시).

**검증** `node tests/report-exam-archive-ai.test.mjs`(mock api: payload에 원문·정답률 포함, 빈 문항만 upsert, 사람 리뷰 보존, source:'ai' 마킹, 총평 보존 정책) + 회귀.
**DoD**: 버튼→생성→표 반영(로컬), 사람 작성 보호 정책 통과. 회귀 초록 + 커밋.

---

## STEP 7 — 종합 QA + 폴리시

**목표** 전 STEP 통합 검증·출력 품질 마감.

**대상 파일** (수정 최소) + `reports/loop-b-analysis-table-harness.html`(신규 하니스)

**작업**
1. 하니스: `reports/loop-a-clinic-ux-harness.html` 패턴 복제 — mock state(블루프린트 23문항·리뷰 일부·오답)로 wide 모달 L1을 렌더해 표/펼침/인쇄 문서를 육안 확인 가능하게.
2. `node -e` 덤프로 (a) 표 HTML (b) 인쇄 문서 HTML을 파일로 떨궈 page-break 마커·금지 패턴(스타일 인라인 잔재) 스캔.
3. 전 회귀 + 신규 테스트 최종 1회 전부 실행, 결과를 `CODEX_RESULT_SCHOOL_EXAM_TABLE_20260704.md`에 STEP별 표로 기록(무엇을 바꿨고 어떤 테스트가 커버하는지).
4. 남은 리스크(배포 필요 항목, 사람 확인 항목)를 같은 파일 하단에 명시.

**DoD**: 결과 문서 커밋. /goal 종료 조건 = STEP 1~7 전 커밋 + 전 테스트 초록 + 결과 문서 존재.

---

## 부록 A — 절대 하지 말 것
- 기존 함수/기능 삭제 금지(카드 렌더·아티클 빌더·기존 exam-analysis 경로 보존).
- 별도 브랜치 생성 금지 — 로컬 main 직접 커밋. 푸시/배포 금지(사람 몫).
- 사람 작성 `review_text` 덮어쓰기 금지(명시적 overwrite 제외). AI 응답을 검증 없이 저장 금지(JSON 파싱 실패 시 해당 문항 스킵).
- 학부모 출력 경로에 선생님 표/내부 수치 유입 금지(이 표는 선생님·분석표 인쇄 전용).
- global-surface 픽스처는 report만 갱신. 리뷰 에이전트 스폰 금지.

## 부록 B — 사람(검수자)이 할 일 (Codex 범위 밖)
1. 워커 배포(`apmath/worker-backup/worker` → Cloudflare, 마이그레이션 적용) 후 실서버 저장/로드 확인 — 커밋만으론 라이브 안 됨.
2. 하니스 육안 검수: 표 렌더·행 펼침·난도칩 색·수식 typeset·인쇄 page-break.
3. AI 실호출 품질 검수(문항 JSON 자연스러움·태그 적합성) 및 문구 톤 확인.
4. main 푸시.

## 부록 C — 참고(채택하지 않은 GPT 제안과 이유)
- `asks/trap/key/teach` 전면 컬럼화 → 표시 전용 필드라 `review_text` JSON 유지가 하위호환·단순성에서 우세. 검색용 4컬럼(concept/error_tag/difficulty/question_type)만 발췌.
- `exam_session_ai_reports` 별도 테이블 → `exam_student_reports.ai_json`으로 통합(테이블 수 최소화, PK 동일).
- 출력 CSS 전면 재설계 → STEP 3·7 범위로 한정(기존 프린트 셸 재사용이 검증된 경로).
