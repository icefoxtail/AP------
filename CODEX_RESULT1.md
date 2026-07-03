# CODEX_RESULT1

## 목적

리포트센터 통합 진입 이후 이어진 작업 정리입니다. 학원에서 이어서 작업할 때 아래 내용을 기준으로 보면 됩니다.

## 실제 DB 확인

- Cloudflare D1 원격 DB `ap-math-os`를 `wrangler`로 조회했습니다.
- DB 설정은 `C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker\wrangler.jsonc`에서 확인했습니다.
- 대상 파일 중 DB에 분석 데이터가 존재한 것은 기말 파일입니다.

확인된 canonical `archive_file`:

```text
exams/original/middle/m3/1final/26_왕운중_1학기_기말_중3_기출.js
```

조회 결과:

- `exam_sessions`: 위 archive_file로 20건
- `exam_analysis_meta`: 위 archive_file로 1건
- `exam_question_reviews`: 위 archive_file로 23건
- `26_왕운중_1학기_중간_중3_기출c.js`는 이번 조회에서 session/meta/review 레코드가 나오지 않았습니다.

## 분석 JSON 원본화

DB에만 있던 기말 분석 리포트를 git 원본 JSON으로 회수했습니다.

```text
archive/analysis/original/middle/m3/1final/26_왕운중_1학기_기말_중3_기출.analysis.json
```

구조:

- `schema_version`
- `archive_file`
- `overview_text`
- `updated_by`
- `updated_at`
- `source`
- `reviews: [{ question_no, review_text, answer }]`

이 파일은 앞으로 분석 리포트의 git source of truth 샘플로 사용할 수 있습니다. DB는 앱 runtime store로 두고, 나중에 JSON import/export 흐름을 붙이면 됩니다.

## 문구 기준 정리

처음 DB에서 가져온 분석 문구는 선생님 내부 검토용으로는 좋았지만 학부모 리포트에 그대로 쓰기에는 표현이 강했습니다.

수정 기준:

- 총평은 시험 구성, 교육과정 핵심, 보완 방향이 보이도록 상담용 문체로 정리
- 문항 리뷰는 기존 `concept / level / unit / asks / trap / key / teach` 구조 유지
- `trap`은 학생 탓이 아니라 “혼동이 생길 수 있는 지점”으로 표현
- `teach`는 “다음 수업에서 어떻게 보완할지” 중심으로 표현
- `저격`, `계산 폭증`, `최다 실수`, `오개념 3종`, `백미` 같은 내부자용 표현 제거

검증:

- JSON 파싱 성공
- `reviews.length === 23`
- 각 `review_text` 내부 JSON 파싱 성공
- 강한 표현 스캔 결과 남은 항목 없음

## MathJax 미리보기/출력 수정

`apmath/js/report-center.js`에 공통 MathJax 처리 헬퍼를 추가했습니다.

```js
reportCenterTypesetMath(root)
```

연결한 위치:

- wide modal 렌더 후
- 아카이브 원문/해설 상세 렌더 후
- 단일 학생 리포트 미리보기 열기 후
- 리포트 미리보기 refresh 후
- 반/학생 일괄 출력 화면 렌더 후

효과:

- `overview_text`
- `review_text`
- 아카이브 원문
- 해설/정답 LaTeX

위 내용이 리포트센터 내부 미리보기와 출력 화면에서 MathJax 렌더링 대상이 됩니다.

`apmath/js/report-print.js`의 parent PDF용 clean shell은 유지했습니다. 다만 CDN이 느릴 때 MathJax가 렌더링되기 전에 print가 너무 빨리 실행되지 않도록 fallback 시간을 완화했습니다.

## initial-data 보강

`apmath/worker-backup/worker/index.js`에 initial-data archive 후보 키 확장 로직을 추가했습니다.

추가 함수:

- `normalizeInitialDataArchiveFile`
- `getInitialDataArchiveCandidates`

목적:

- `archive/...`
- `exams/...`
- prefix 없는 variant

이런 표기 차이 때문에 `exam_question_reviews`, `exam_analysis_meta`가 initial-data에서 누락되는 문제를 줄입니다.

실제 왕운중 기말 DB는 `exam_sessions.archive_file`과 분석 테이블의 `archive_file`이 이미 동일해서 기존 exact IN으로도 로드 가능한 상태였습니다. 그래도 앞으로 다른 시험지에서 prefix 차이가 생길 수 있어 방어 로직을 넣었습니다.

## 추가/수정 테스트

추가:

- `tests/report-center-mathjax-preview.test.mjs`
- `tests/initial-data-exam-analysis-archive-candidates.test.js`

기존 관련 테스트도 함께 통과 확인:

- `tests/report-center-shell.test.mjs`
- `tests/exam-analysis-article.test.mjs`
- `tests/exam-question-review-card.test.mjs`
- `tests/report-pdf-dedup.test.mjs`
- `tests/report-center-student-view.test.mjs`
- `tests/apmath-report-center-unified-entry.test.mjs`
- `tests/report-center-exam-dashboard.test.mjs`
- `tests/report-center-exam-hub.test.mjs`
- `tests/exam-analysis-store.test.mjs`
- `tests/report-exam-trend.test.mjs`
- `tests/apmath-global-surface.test.js`

마지막 focused suite 실행 결과는 모두 통과했습니다.

## 다음에 이어서 할 일

1. 분석 JSON 스키마를 문서화합니다.
2. `archive/analysis/...analysis.json` 위치 규칙을 확정합니다.
3. JSON -> DB import 스크립트 또는 관리자 API를 만듭니다.
4. DB -> JSON export 스크립트를 만듭니다.
5. 리포트센터에서 분석 저장 후 JSON export까지 이어지는 운영 흐름을 정합니다.
6. 이번 왕운중 기말 JSON을 기준 샘플로 삼아 다음 시험지 분석 문체를 맞춥니다.

---

## 2026-07-03 학교시험 리포트 레이어 루프 결과

`docs/plans/REPORT_CENTER_SCHOOL_EXAM_REPORT_LAYER_DIRECTIVE_20260703.md` 지시서를 기준으로 STEP 1~7을 Codex 단독 구현/검증했습니다. 리뷰봇은 사용하지 않았습니다.

### 구현

- `reportCenterNormalizeMathText`를 추가해 `x^2`, `√(...)`, `a/b` 형태를 렌더 직전 LaTeX로 정규화했습니다. 기존 `$...$`/`$$...$$`/`\(...\)` 구간은 보존합니다.
- `review_text` JSON 파서가 `concept`/`tag`를 인식하도록 확장했습니다.
- 오답 태그 4종을 추가했습니다: `계산·검산`, `풀이 순서`, `조건 해석`, `개념 재정리`.
- `reportCenterBuildParentSafeQuestionComment`와 `reportCenterAssertParentSafe`를 추가해 학부모용 문항 코멘트에서 raw/internal 표현을 제거합니다.
- L2 학생 화면을 `학생별 상담 리포트 1장` 우선 구조로 바꾸고, `선생님용 상세 분석 보기`와 `문제 원문 확인`은 접힘 블록으로 내렸습니다.
- 상담 1장 빌더와 단일 `수정` 버튼 기반 편집/저장 흐름을 추가했습니다. 저장은 기존 `reportCenterUpsertExamMeta`를 재사용합니다.
- 학부모 PDF의 raw 문항 분석 카드가 `문항별 쉬운 설명`으로 대체되도록 바꿨습니다. 정답/해설/raw review는 학부모 PDF에 넣지 않습니다.
- L1/PDF 라벨의 `코호트` 계열 표현을 `전체 응시` 기준으로 정리했습니다.

### 추가/수정 테스트

추가:

- `tests/report-math-normalize.test.mjs`
- `tests/report-review-schema.test.mjs`
- `tests/report-parent-safe-comment.test.mjs`
- `tests/report-school-exam-counsel.test.mjs`
- `tests/report-school-exam-edit.test.mjs`

수정:

- `tests/report-center-student-view.test.mjs`
- `tests/report-exam-trend.test.mjs`
- `tests/report-pdf-dedup.test.mjs`
- `tests/fixtures/apmath-surface-report.json`

### 검증

통과:

```text
node tests/report-exam-trend.test.mjs
node tests/exam-question-review-card.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
node tests/report-center-shell.test.mjs
node tests/report-center-exam-hub.test.mjs
node tests/report-center-exam-dashboard.test.mjs
node tests/report-center-student-view.test.mjs
node tests/report-center-advanced-policy.test.mjs
node tests/report-math-normalize.test.mjs
node tests/report-review-schema.test.mjs
node tests/report-parent-safe-comment.test.mjs
node tests/report-school-exam-counsel.test.mjs
node tests/report-school-exam-edit.test.mjs
node tests/report-pdf-dedup.test.mjs
node tests/report-center-mathjax-preview.test.mjs
node tests/exam-analysis-store.test.mjs
```

### 주의

- 학부모 PDF 정책이 바뀌면서 기존 테스트의 “저장된 문항 분석 원문이 PDF 카드에 노출” 기대값은 “안전 문항 코멘트만 노출”로 갱신했습니다.
- `docs/plans/REPORT_CENTER_SCHOOL_EXAM_REPORT_LAYER_DIRECTIVE_20260703.md`는 작업 시작 전부터 untracked 상태였으므로 코드 커밋 범위에는 넣지 않았습니다.
