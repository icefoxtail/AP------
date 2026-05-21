검수 결과: **CONDITIONAL PASS**

## 1. 실제 확인한 파일

```text
report.js
index.js
REPORT_AI_DOMAIN.md
ARCHIVE_OMR_DOMAIN.md
CURRENT_API_FLOW_MAP.md
CURRENT_FRONTEND_MAP.md
CURRENT_DB_MAP.md
CURRENT_REGRESSION_RISK_MAP.md
REPORT_AI_NEXT_PLAN.md
CODEX_RESULT.md
```

## 2. 잘 된 부분

```text
PASS 근거

1. 원인 판정은 맞음
- frontend만의 문제가 아니라 teacher initial-data scope 제한까지 포함된 혼합 문제로 보는 게 맞음.

2. backend 처리 방향이 안전함
- teacher에게 다른 반 학생 목록을 추가 노출하지 않고 report_exam_cohort_stats summary만 내려주는 구조는 방향이 맞음.

3. 기존 응답 구조를 깨지 않음
- students, classes, exam_sessions, wrong_answers 등 기존 필드는 유지하고 report_exam_cohort_stats만 추가됨.

4. report.js fallback 구조도 맞음
- 서버 summary 우선
- 없으면 local cohort fallback
- classAverage는 별도 유지

5. AI payload 확장 방향도 맞음
- 기존 overallAverage/classAverage 유지
- gradeExamAverage, gradeExamRank, gradeExamCount, cohortScope 추가
```

## 3. 수정 전 반드시 보정할 부분

`index.js`의 `buildReportExamCohortStats()` 안에서 cohort SQL이 아래 구조입니다.

```js
SELECT DISTINCT es.id, es.score, es.question_count, s.grade AS student_grade, c.grade AS class_grade
FROM exam_sessions es
JOIN students s ON s.id = es.student_id
LEFT JOIN class_students cs ON cs.student_id = es.student_id
LEFT JOIN classes c ON c.id = COALESCE(es.class_id, cs.class_id)
...
```

여기서 학생이 `class_students`에 여러 반으로 연결돼 있으면 같은 `exam_sessions.id`가 여러 줄로 나올 수 있습니다.

문제는 `DISTINCT`가 `es.id`만 기준이 아니라 `class_grade`까지 포함해서 중복 제거하므로, 같은 시험 세션이 여러 번 집계될 수 있습니다.

결과적으로 아래 값이 부풀 수 있습니다.

```text
gradeExamCount
gradeExamAverage
gradeExamRank
questionStats correctRate
wrongCount denominator
```

이건 실제 운영에서 학생이 여러 반에 걸쳐 있거나 과거 반 연결이 남아 있으면 통계가 틀어질 수 있어서 **커밋 전 보정 필수**입니다.

## 4. 판정

```text
현재 상태:
- 방향 PASS
- 로직 대부분 PASS
- 커밋 전 보정 필요

최종 판정:
CONDITIONAL PASS

필수 보정:
buildReportExamCohortStats()에서 cohortRows를 es.id 기준으로 dedupe해야 함.
```

## 5. 바로 줄 보정 지시서

````bash
cd /mnt/c/Users/USER/Desktop/AP------
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 0. 작업명

리포트 학년-아카이브 cohort 통계 보정 후속: exam_sessions 중복 집계 방지

---

## 1. 작업 위치

반드시 아래 폴더를 프로젝트 루트로 사용한다.

- `/mnt/c/Users/USER/Desktop/AP------`

작업 시작 시 반드시 아래 명령으로 이동한다.

- `cd /mnt/c/Users/USER/Desktop/AP------`

반드시 아래 파일을 다시 열어 처음부터 끝까지 읽고 실행한다.

- `/mnt/c/Users/USER/Desktop/AP------/CODEX_TASK.md`

다른 위치의 `CODEX_TASK.md`를 읽지 않는다.

---

## 2. 작업 목적

직전 작업에서 리포트 통계가 같은 아카이브 시험지를 본 같은 학년 전체 응시자 기준으로 계산되도록 `report_exam_cohort_stats` summary가 추가되었다.

방향은 맞지만, `apmath/worker-backup/worker/index.js`의 `buildReportExamCohortStats()` 안에서 cohort SQL 결과가 `class_students` 조인 때문에 같은 `exam_sessions.id`를 여러 줄로 반환할 수 있다.

학생이 여러 반에 연결되어 있거나 과거 반 연결이 남아 있으면 같은 시험 세션이 중복 집계되어 평균, 등수, 응시자 수, 문항 정답률이 틀어질 수 있다.

이번 작업은 이 중복 집계 위험만 보정한다.

---

## 3. 절대 금지

- 리포트 UI 변경 금지
- 문구 변경 금지
- 버튼명/화면명 변경 금지
- AI 프롬프트 정책 변경 금지
- DB schema 변경 금지
- migration 생성 금지
- 새 API 추가 금지
- initial-data 기존 필드 삭제/이름 변경 금지
- report_exam_cohort_stats 필드명 변경 금지
- 학생 포털/OMR/archive 저장 흐름 수정 금지
- 수납/시간표/홈페이지 관련 코드 수정 금지
- git add/commit/push 금지
- 검수요청서 작성 금지

---

## 4. 수정 대상

우선 수정 대상은 아래 1개 파일이다.

- `apmath/worker-backup/worker/index.js`

필요하면 문서만 최소 업데이트한다.

- `docs/implemented/CURRENT_REGRESSION_RISK_MAP.md`
- `docs/domains/REPORT_AI_DOMAIN.md`

`apmath/js/report.js`는 이번 보정에서 원칙적으로 수정하지 않는다.
단, 실제로 서버 summary 구조와 맞지 않는 문제가 발견될 때만 최소 수정한다.

---

## 5. 반드시 확인할 함수

`apmath/worker-backup/worker/index.js`에서 아래 함수를 확인한다.

- `buildReportExamCohortStats`
- `normalizeReportCohortGrade`
- `getReportCohortStudentGrade`
- `getReportCohortIdentity`

특히 아래 SQL 이후 `cohortRows`를 만드는 부분을 확인한다.

- `SELECT DISTINCT es.id, es.score, es.question_count, s.grade AS student_grade, c.grade AS class_grade`
- `LEFT JOIN class_students cs ON cs.student_id = es.student_id`
- `LEFT JOIN classes c ON c.id = COALESCE(es.class_id, cs.class_id)`

---

## 6. 필수 보정 내용

`cohortRows`는 반드시 `exam_sessions.id` 기준으로 한 번만 집계되게 만든다.

현재처럼 SQL의 `DISTINCT`에 의존하지 않는다.

권장 구조:

1. SQL 결과를 받은 뒤 JS에서 `Map`으로 dedupe한다.
2. key는 `String(row.id)`를 사용한다.
3. 점수는 유효한 숫자인 경우만 포함한다.
4. 학년 매칭은 다음 기준으로 한다.
   - `students.grade`가 있으면 그 값을 우선한다.
   - `students.grade`가 없을 때만 `classes.grade` fallback을 사용한다.
5. 같은 `exam_sessions.id`는 cohortRows에 한 번만 들어가야 한다.

구현 예시 방향:

```js
const rowsBySessionId = new Map();

for (const rawRow of (cohortRes.results || [])) {
  const score = Number(rawRow.score);
  if (!Number.isFinite(score)) continue;

  const studentGrade = normalizeReportCohortGrade(rawRow.student_grade);
  const classGrade = normalizeReportCohortGrade(rawRow.class_grade);
  const matchedGrade = studentGrade || classGrade;

  if (matchedGrade !== item.grade) continue;

  const sessionId = String(rawRow.id);
  if (!rowsBySessionId.has(sessionId)) {
    rowsBySessionId.set(sessionId, {
      id: rawRow.id,
      score,
      question_count: rawRow.question_count
    });
  }
}

const cohortRows = Array.from(rowsBySessionId.values());
````

주의:

* 위 코드는 방향 예시다. 실제 기존 코드 스타일에 맞게 반영한다.
* `students.grade`가 존재하는데 다른 class grade 때문에 잘못 포함되면 안 된다.
* `students.grade`가 없을 때만 `classes.grade`를 fallback으로 쓴다.
* 같은 session id가 여러 번 들어가면 실패다.

---

## 7. 검증 기준

반드시 아래를 확인한다.

### 7.1 중복 방지

가상의 상황:

* 같은 학생이 class_students에 2개 반으로 연결
* exam_sessions는 1개
* SQL 결과는 2줄 가능

기대:

* cohortRows에는 해당 session id가 1번만 들어간다.
* gradeExamCount가 중복 증가하지 않는다.
* 평균 계산에 같은 점수가 2번 들어가지 않는다.

### 7.2 기존 기능 보존

* report_exam_cohort_stats 구조 유지
* gradeExamAverage 유지
* gradeExamRank 유지
* gradeExamCount 유지
* totalSubmitted 유지
* overallAverage 유지
* questionStats 유지
* initial-data 기존 필드 유지

### 7.3 개인정보 노출 방지

* teacher 응답에 다른 반 학생 목록을 추가하지 않는다.
* 통계 summary만 유지한다.

---

## 8. 검증 명령

작업 후 아래를 실행한다.

```bash
cd /mnt/c/Users/USER/Desktop/AP------
node --check apmath/worker-backup/worker/index.js
node --check apmath/js/report.js
git status --short
git diff --name-only
```

`report.js`를 수정하지 않았더라도 기존 연동 안정성을 위해 `node --check apmath/js/report.js`는 실행한다.

---

## 9. CODEX_RESULT.md 작성

작업 완료 후 아래 위치에 결과를 작성한다.

* `/mnt/c/Users/USER/Desktop/AP------/CODEX_RESULT.md`

형식:

# CODEX_RESULT

## 1. 생성/수정 파일

* 수정한 코드 파일
* 수정한 문서 파일
* 새 테스트 파일 여부
* DB/migration 변경 여부

## 2. 보정 완료 내용

* buildReportExamCohortStats 중복 집계 방지 여부
* exam_sessions.id 기준 dedupe 적용 여부
* students.grade 우선, classes.grade fallback 적용 여부
* report_exam_cohort_stats 응답 구조 보존 여부
* 개인정보 추가 노출 없음 확인

## 3. 실행 결과

* node --check apmath/worker-backup/worker/index.js
* node --check apmath/js/report.js
* git status --short
* git diff --name-only

## 4. 결과 요약

* 왜 보정했는지
* 어떤 위험을 막았는지
* 통계 기준은 어떻게 유지되는지

## 5. 다음 조치

* 실제 브라우저에서 확인할 항목
* 실제 데이터에서 확인할 항목

## 6. 회귀 방지 확인

* UI 문구 변경 여부
* initial-data 기존 필드 보존 여부
* report_exam_cohort_stats 구조 보존 여부
* 학생 포털/OMR/archive 미수정 여부
* 수납/시간표/홈페이지 미수정 여부
* git add/commit/push 미실행 여부

---

## 10. 최종 지시

아래 명령으로 지정 폴더로 이동한 뒤, 그 폴더의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.

* `cd /mnt/c/Users/USER/Desktop/AP------`
* `cat CODEX_TASK.md`

다른 위치의 작업 결과로 대체하지 마라.

이번 작업은 리포트 학년-아카이브 cohort 통계의 중복 집계 위험만 보정하는 핀포인트 작업이다.

EOF

```
```
