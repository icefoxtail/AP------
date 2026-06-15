# CODEX_TASK — EIE 시간표 최근 2개월 퇴원생 표시 Worker payload 핫픽스

## 0. 최우선 지시

이번 작업은 AP/EIE 시간표 퇴원생 표시 작업의 **EIE 실제 운영 경로 FAIL 수정**이다.

현재 판정:

```text
AP 수학 시간표: PASS 후보 — 수정하지 않음
EIE 영어 시간표: FAIL — Worker → Front payload에서 퇴원 상태가 전달되지 않음
```

이번 작업은 **EIE 핀포인트 수정**이다.
AP 수학 시간표 파일은 수정하지 않는다.

커밋하지 않는다.
push하지 않는다.
stage하지 않는다.

---

## 1. 실패 원인

`workers/wangji-eie-worker/routes/eie.js`에서 SQL은 이미 학생 상태를 가져온다.

```text
s.status AS student_status
```

하지만 `assigned_students` 객체로 push할 때 `status` 또는 `student_status`를 넣지 않는다.

현재 문제 구조:

```js
list.push({
  ...
  withdrawn_at: row.withdrawn_at || studentMeta.withdrawn_at || '',
  match_status: 'confirmed',
  ...
})
```

반면 프론트 `eie/js/views/eie-timetable.js`는 학생 상태를 아래 흐름으로 읽는다.

```js
status: normalizeKey(student?.status || student?.match_status || '')
```

결과:

```text
실제 Worker 응답에서는 퇴원생도 match_status: "confirmed"만 들어옴
프론트는 퇴원생으로 판단하지 못함
최근 퇴원생 is-withdrawn class/tooltip 누락
오래된 퇴원생/퇴원일 없는 퇴원생이 표시될 위험
```

---

## 2. 수정 목표

EIE 실제 운영 경로에서 아래가 보장되어야 한다.

```text
1. Worker assigned_students payload에 실제 학생 status가 포함된다.
2. 프론트 getStudents()가 status/student_status를 우선 읽는다.
3. match_status: "confirmed"를 퇴원 상태로 오해하거나 상태 대체값으로 쓰지 않는다.
4. 최근 2개월 퇴원생만 is-withdrawn 표시된다.
5. 2개월 초과 퇴원생은 숨김.
6. 퇴원일 없는 퇴원생은 숨김.
7. 테스트 fixture가 실제 Worker payload를 반영한다.
```

---

## 3. 수정 허용 파일

수정 가능:

```text
workers/wangji-eie-worker/routes/eie.js
eie/js/views/eie-timetable.js
tests/eie-timetable-withdrawn-students.test.js
docs/reports/ap-eie-timetable-withdrawn-students-result.md
CODEX_RESULT1.md
```

필요한 경우에만 CSS 보정 가능:

```text
eie/css/eie-v2-week-card.css
```

단, 기존 CSS가 이미 `is-withdrawn`을 정상 정의하고 있으면 CSS는 수정하지 않는다.

---

## 4. 수정 금지 파일

아래는 절대 수정하지 않는다.

```text
apmath/js/timetable.js
apmath/js/student.js
tests/apmath-timetable-withdrawn-students.test.js
migrations/20260615_eie_students_withdrawn_at.sql
dashboard.js 계열
student.js 계열
classroom.js 계열
report.js
archive/*
output/playwright/*
verify-*.html
```

AP 수학 쪽은 현재 PASS 후보이므로 건드리지 않는다.

---

## 5. Worker 수정 지시

대상:

```text
workers/wangji-eie-worker/routes/eie.js
```

`assigned_students`를 만드는 push 객체에 반드시 아래 필드를 추가한다.

```js
status: row.student_status || 'active',
student_status: row.student_status || 'active',
withdrawn_at: row.withdrawn_at || studentMeta.withdrawn_at || '',
```

주의:

```text
1. match_status는 기존처럼 'confirmed'로 유지 가능.
2. 단, match_status를 학생 재원/퇴원 상태로 사용하면 안 됨.
3. status/student_status가 실제 학생 상태를 전달해야 함.
```

또한 SQL/필터가 아래 정책을 만족하는지 재확인한다.

```text
active / needs_review / imported 계열 학생: 기존대로 포함
inactive / archived / withdrawn / left / 퇴원 학생: withdrawn_at이 최근 2개월일 때만 포함
2개월 초과 퇴원생: 제외
withdrawn_at 없는 퇴원생: 제외
```

---

## 6. EIE 프론트 수정 지시

대상:

```text
eie/js/views/eie-timetable.js
```

`getStudents(row)` 또는 학생 객체 normalize 위치에서 status 읽기 우선순위를 아래처럼 보정한다.

권장:

```js
status: normalizeKey(
  student?.status ||
  student?.student_status ||
  student?.studentStatus ||
  student?.match_status ||
  ''
)
```

단, 퇴원 판정 helper에서는 `match_status: confirmed`만 보고 active로 오판하지 않게 한다.

권장 helper 정책:

```text
isWithdrawnStudent(row):
- status/student_status/studentStatus 값을 우선 확인
- archived/inactive/withdrawn/left/퇴원만 퇴원으로 판단
- confirmed/candidate/needs_review는 퇴원 아님
```

`shouldShowTimetableStudent(row)`가 있다면 아래 정책을 재확인한다.

```text
재원생: 표시
휴원생: 표시 + is-paused 유지
최근 2개월 퇴원생: 표시 + is-withdrawn
2개월 초과 퇴원생: 숨김
퇴원일 없는 퇴원생: 숨김
```

---

## 7. EIE 테스트 수정 지시

대상:

```text
tests/eie-timetable-withdrawn-students.test.js
```

현재 테스트는 fixture에 직접 `status`를 넣어서 실제 Worker 응답 버그를 못 잡는다.

반드시 보정한다.

### 7-1. Worker source assertion 추가

테스트에서 `workers/wangji-eie-worker/routes/eie.js`를 읽고 아래를 검사한다.

```text
1. SQL에 s.status AS student_status 존재
2. assigned_students push 객체에 status: row.student_status 존재
3. assigned_students push 객체에 student_status: row.student_status 존재
4. withdrawn_at이 payload에 포함됨
```

### 7-2. 실제 Worker payload 형태 반영

프론트 테스트 fixture는 최소 2종을 포함한다.

```js
// 실제 핫픽스 후 Worker payload 형태
{
  name: '박최근',
  status: 'inactive',
  student_status: 'inactive',
  withdrawn_at: '2026-05-02T08:00:00+09:00',
  match_status: 'confirmed'
}

// 과거 버그 재현 형태: status가 없고 match_status만 confirmed
{
  name: '버그재현',
  withdrawn_at: '2026-05-02T08:00:00+09:00',
  match_status: 'confirmed'
}
```

검증:

```text
1. status/student_status 있는 최근 퇴원생은 is-withdrawn 표시
2. 오래된 퇴원생은 표시되지 않음
3. 퇴원일 없는 퇴원생은 표시되지 않음
4. status 없이 match_status: confirmed만 있는 row는 퇴원생으로 오판하지 않음
5. Worker source에 status/student_status payload export가 없으면 테스트 FAIL
```

테스트에서 assertion 삭제/완화 금지.

---

## 8. 검수팩 단독 재현성 보정

이전 검수팩은 아래 파일이 없어 EIE 테스트 단독 실행이 깨졌다.

```text
eie/css/eie-timetable-board.css
eie/css/eie-timetable.css
```

이번 결과 압축팩에는 테스트가 읽는 CSS 파일을 모두 포함한다.

최소 포함:

```text
eie/css/eie-v2-week-card.css
eie/css/eie-timetable-board.css
eie/css/eie-timetable.css
```

제품 코드 수정이 없더라도 검수팩에는 포함한다.

---

## 9. 테스트 실행

필수:

```bash
node --check eie/js/views/eie-timetable.js
node --check workers/wangji-eie-worker/routes/eie.js
node --check tests/eie-timetable-withdrawn-students.test.js

node tests/eie-timetable-withdrawn-students.test.js
node tests/apmath-timetable-withdrawn-students.test.js
node tests/apmath-onclick-defined.test.js
node tools/run-tests.js
node tools/smoke-api.mjs
```

브라우저 smoke는 가능하면 실행한다.

```bash
node tools/smoke-browser.mjs
```

Playwright 미설치면 미수행 사유를 기록한다.

---

## 10. 결과 보고서 수정

아래 파일을 갱신한다.

```text
docs/reports/ap-eie-timetable-withdrawn-students-result.md
```

추가해야 할 내용:

```md
## 핫픽스
- EIE Worker assigned_students payload에 status/student_status 추가
- 프론트 getStudents status 우선순위 보정
- 테스트 fixture를 실제 Worker payload 기준으로 보정

## 외부검수 FAIL 반영
- 기존 실패 원인:
- 수정 내용:
- 재검증 결과:
```

---

## 11. CODEX_RESULT1.md 작성

루트 `CODEX_RESULT1.md`를 아래 형식으로 작성한다.

```md
# CODEX_RESULT1 — EIE 시간표 퇴원생 표시 Worker payload 핫픽스

## 1. 생성/수정 파일
- ...

## 2. 실패 원인
- Worker SQL student_status 조회 여부:
- Worker assigned_students status 누락 여부:
- 프론트 getStudents status 읽기 문제:
- 테스트 fixture 현실성 문제:

## 3. 수정 내용
- Worker payload:
- EIE 프론트:
- EIE 테스트:
- 검수팩 CSS 포함:

## 4. AP 영향
- apmath/js/timetable.js 수정 여부:
- AP 테스트 결과:
- AP 회귀 여부:

## 5. EIE 재검증
- 최근 2개월 퇴원생:
- 오래된 퇴원생:
- 퇴원일 없는 퇴원생:
- match_status confirmed only row:

## 6. 테스트 결과
- node --check:
- EIE withdrawn test:
- AP withdrawn test:
- onclick-defined:
- run-tests:
- smoke-api:
- smoke-browser:

## 7. git 상태
- stage/commit/push:
- git diff --name-only:
- untracked files:
- 이번 작업 관련 파일:
```

---

## 12. 완료 기준

아래를 모두 만족해야 PASS 후보다.

```text
1. Worker assigned_students에 status/student_status가 포함됨
2. 프론트가 student_status도 읽음
3. 최근 2개월 EIE 퇴원생이 is-withdrawn 표시됨
4. 오래된 EIE 퇴원생이 숨김
5. 퇴원일 없는 EIE 퇴원생이 숨김
6. match_status: confirmed만 있는 row를 퇴원생으로 오판하지 않음
7. AP 수학 시간표 파일은 수정하지 않음
8. AP withdrawn test PASS
9. EIE withdrawn test PASS
10. run-tests PASS
11. smoke-api PASS
12. 검수팩 단독 재현성 확보
13. stage/commit/push 없음
```
