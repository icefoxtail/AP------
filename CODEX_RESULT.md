# CODEX_RESULT

## 1. 생성/수정 파일

* 수정한 코드 파일
  * `apmath/worker-backup/worker/index.js`
* 수정한 문서 파일
  * `docs/implemented/CURRENT_REGRESSION_RISK_MAP.md`
  * `docs/domains/REPORT_AI_DOMAIN.md`
  * `CODEX_RESULT.md`
* 새 테스트 파일 여부
  * 없음
* DB/migration 변경 여부
  * 없음

## 2. 보정 완료 내용

* `buildReportExamCohortStats()`에서 cohort SQL 결과를 `exam_sessions.id` 기준으로 dedupe하도록 보정했다.
* SQL `DISTINCT`에 의존하지 않고 JS `Map`의 key를 `String(rawRow.id)`로 사용한다.
* 점수는 `Number(rawRow.score)`가 유효한 숫자인 경우만 집계한다.
* 학년 매칭은 `students.grade`를 우선하고, 값이 없을 때만 `classes.grade`를 fallback으로 사용한다.
* 같은 세션 ID가 여러 반 조인 결과로 여러 줄 반환되어도 `cohortRows`에는 한 번만 들어간다.
* `report_exam_cohort_stats` 응답 필드 구조는 유지했다.
* 다른 반 학생 목록을 추가 노출하지 않고 summary 통계만 유지했다.

## 3. 실행 결과

* `node --check apmath/worker-backup/worker/index.js`
  * 통과
* `node --check apmath/js/report.js`
  * 통과
* `git status --short`
  * 작업 전부터 다수 파일이 수정된 dirty tree 상태다.
  * 이번 작업 관련 수정 파일은 `apmath/worker-backup/worker/index.js`, `docs/implemented/CURRENT_REGRESSION_RISK_MAP.md`, `docs/domains/REPORT_AI_DOMAIN.md`, `CODEX_RESULT.md`다.
* `git diff --name-only`
  * 작업 전부터 다수 파일이 출력된다.
  * 이번 작업 관련 파일은 위 4개이며, `report.js`는 수정하지 않았다.

## 4. 결과 요약

같은 학생이 `class_students`에 여러 반으로 연결된 경우 cohort SQL이 같은 `exam_sessions.id`를 여러 줄 반환할 수 있었다. 이 상태로 평균, 등수, 응시자 수, 문항 정답률을 계산하면 같은 시험 세션의 점수가 중복 반영될 위험이 있었다.

이번 보정으로 cohort 집계는 같은 학년, 같은 시험 identity 기준을 유지하되, 실제 통계 계산 대상은 세션 ID별 1건으로 고정된다. 따라서 `gradeExamCount`, `gradeExamAverage`, `gradeExamRank`, `questionStats.correctRate`, `wrongCount` denominator가 중복 세션 때문에 부풀지 않는다.

## 5. 다음 조치

* 실제 브라우저에서 리포트 화면의 전체 평균, 학년 등수, 응시자 수, 문항별 정답률 표시를 확인한다.
* 실제 데이터에서 한 학생이 여러 `class_students` 매핑을 가진 경우에도 동일 `exam_sessions.id`가 한 번만 집계되는지 확인한다.
* `students.grade`가 있는 학생은 반 학년이 달라도 학생 학년 기준으로만 cohort에 포함되는지 확인한다.
* `students.grade`가 비어 있는 학생은 반 학년 fallback으로 포함되는지 확인한다.

## 6. 회귀 방지 확인

* UI 문구 변경 여부
  * 변경 없음
* initial-data 기존 필드 보존 여부
  * 기존 필드 삭제/이름 변경 없음
* `report_exam_cohort_stats` 구조 보존 여부
  * 구조 보존
* 학생 포털/OMR/archive 미수정 여부
  * 미수정
* 수납/시간표/홈페이지 미수정 여부
  * 미수정
* `git add/commit/push` 미실행 여부
  * 미실행
