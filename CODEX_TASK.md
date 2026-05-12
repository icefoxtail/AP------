기준 파일 확인했습니다. Worker에는 기존 `homework-photo` 과제 등록/학생별 제출칸/링크/제출 API가 있고 , 플래너는 기존 `planner`와 PIN 검증 구조가 이미 있습니다 . `core.js`의 API_BASE도 현재 Worker 주소 기준입니다 .

````markdown
# CODEX_TASK.md

# AP Math OS 학생 개인 포털 1차 — 사전 검토 지시서

## 0. 이번 Codex 작업 방식

아직 파일을 수정하지 마라.

이 문서는 학생 개인 포털 1차 구현을 위한 세부 지시서다.  
하지만 이번 Codex 실행에서는 먼저 검토만 한다.

Codex는 아래 항목만 보고해야 한다.

1. 이해한 작업 목표
2. 수정/신규 파일 목록
3. 수정 위치
4. 구현 방식
5. 위험하거나 확인 필요한 지점
6. 기존 기능 회귀 가능성
7. Worker/DB 수정이 필요한지 여부
8. 최종 구현 전 추가로 확인해야 할 파일 또는 함수

내 승인 전까지 파일 수정 금지.

---

## 1. 작업 목표

AP Math OS에 학생 개인 포털 1차를 만든다.

학생은 앞으로 학생코드 링크를 찾지 않고 아래 주소로 접속한다.

```text
/apmath/student/
````

학생은 이름 + PIN으로 로그인한다.

로그인 성공 후 학생 홈에서 본인이 사용할 수 있는 기능만 볼 수 있다.

1차에서 열 기능:

```text
1. 과제
2. 플래너
3. OMR 입구
```

1차에서 열지 않을 기능:

```text
1. 출결 입력
2. 과제 O/X 직접 수정
3. 성적 수정
4. 성적 삭제
5. 오답 삭제
6. 상담 기록
7. 학생관리
8. 반 전체 학생 목록
9. 다른 학생 정보
10. 선생님/원장 대시보드
```

핵심 원칙:

```text
학생포털은 새 기능 본체가 아니다.
기존 과제 / 플래너 / OMR 기능으로 들어가는 학생용 입구다.

기존 선생님 화면 연동 구조는 그대로 유지한다.
기존 homework-photo, planner, OMR API 흐름은 삭제하거나 리팩터링하지 않는다.
```

---

## 2. 수정 가능 파일

### 신규 생성

```text
apmath/student/index.html
```

역할:

```text
- 학생 로그인 화면
- 이름 + PIN 입력
- 로그인 성공 후 학생 홈
- 과제 목록 표시
- 플래너 이동
- OMR 입구 표시
- 로그아웃
```

### 수정 가능

```text
apmath/worker-backup/worker/index.js
```

추가할 API:

```text
POST /api/student-portal/auth
GET /api/student-portal/home?student_id=...
```

---

## 3. 수정 금지 파일

아래 파일은 이번 1차에서 수정하지 마라.

```text
apmath/worker-backup/worker/schema.sql
apmath/homework/index.html
apmath/planner/index.html
apmath/js/classroom.js
apmath/js/core.js
apmath/index.html
apmath/js/dashboard.js
apmath/js/cumulative.js
apmath/js/qr-omr.js
apmath/js/report.js
apmath/engine.html
apmath/mixed_engine.html
archive/mixer.html
```

주의:

```text
schema.sql 수정 금지
D1 마이그레이션 생성 금지
기존 API 응답 구조 임의 변경 금지
기존 안정 기능 리팩터링 금지
```

---

## 4. 기존 구조 유지 조건

### 4-1. 과제 구조 유지

기존 과제 제출 구조는 유지한다.

현재 과제 제출 화면:

```text
apmath/homework/index.html
```

기존 이동 URL:

```text
/apmath/homework/?assignment_id=과제ID&student_id=학생ID
```

학생포털에서는 로그인된 학생의 student_id를 내부에서 사용해 위 URL을 자동 생성한다.

학생이 student_id를 직접 입력하거나 외우게 만들지 않는다.

기존 homework-photo API는 유지한다.

```text
GET  /api/homework-photo/assignment?assignment_id=...&student_id=...
POST /api/homework-photo/auth
POST /api/homework-photo/submit
```

이번 작업에서 위 API를 삭제하거나 변경하지 마라.

---

### 4-2. 플래너 구조 유지

기존 플래너 화면:

```text
apmath/planner/index.html
```

기존 이동 URL:

```text
/apmath/planner/?student_id=학생ID
```

학생포털에서는 로그인된 학생의 student_id를 붙여 자동 이동한다.

이번 작업에서는 planner/index.html을 수정하지 않는다.

기존 planner API는 유지한다.

```text
planner
planner-auth
planner/overview
planner/feedback
```

---

### 4-3. OMR 구조 유지

1차에서는 OMR 완전 연결을 하지 않는다.

학생포털 홈에 OMR 카드는 표시한다.

버튼 문구:

```text
OMR 입력
```

1차 동작은 아래 중 하나로 한다.

기본 권장:

```text
클릭 시 toast 또는 안내 카드:
"OMR 입력은 준비 중입니다. 선생님이 안내한 시험 QR 또는 코드를 사용해 주세요."
```

주의:

```text
이번 1차에서 qr-omr.js 수정 금지
학생용 OMR 전용 API 신설 금지
기존 OMR 구조 변경 금지
```

---

## 5. 신규 Worker API 설계

## 5-1. POST /api/student-portal/auth

### 목적

학생 이름 + PIN으로 로그인한다.

### 요청

```json
{
  "name": "김민준",
  "pin": "1234"
}
```

### 검증 조건

```text
1. name 필수
2. pin 필수
3. students.name = name
4. students.student_pin = pin
5. students.status = '재원'
```

### 성공 응답

```json
{
  "success": true,
  "student": {
    "id": "STU001",
    "name": "김민준",
    "grade": "중1",
    "school_name": "금당중"
  }
}
```

### 실패 응답

```json
{
  "success": false,
  "message": "이름 또는 PIN을 확인하세요."
}
```

### 보안 주의

절대 반환 금지:

```text
student_pin
student_phone
parent_phone
guardian_name
memo
address
상담 정보
성적 정보
다른 학생 정보
```

### 동명이인 처리

이름이 같은 학생이 있어도 PIN으로 구분한다.

단, 이름 + PIN 조합으로 2명 이상 조회되는 상황이 생기면 로그인 실패로 처리하고 아래 메시지를 반환한다.

```text
동명이인 정보가 있습니다. 선생님께 문의하세요.
```

---

## 5-2. GET /api/student-portal/home?student_id=...

### 목적

학생 홈에 필요한 본인 정보만 조회한다.

### 요청

```text
GET /api/student-portal/home?student_id=STU001
```

### 검증 조건

```text
1. student_id 필수
2. students.id = student_id
3. students.status = '재원'
```

### 조회할 데이터

학생 본인 기본 정보:

```text
students.id
students.name
students.grade
students.school_name
```

학생 소속 반:

```text
class_students
classes
```

진행 중 과제:

```text
homework_photo_assignments
homework_photo_submissions
classes
```

조회 조건:

```text
- 학생이 속한 class_id의 과제만
- homework_photo_assignments.status != 'deleted'
- 학생 본인의 homework_photo_submissions만
- 최근/진행 과제 우선
```

권장 조건:

```text
WHERE hpa.status != 'deleted'
AND hpa.class_id IN (학생 소속 반)
AND hps.student_id = student_id
ORDER BY hpa.due_date ASC, hpa.created_at DESC
LIMIT 30
```

### 응답 예시

```json
{
  "success": true,
  "student": {
    "id": "STU001",
    "name": "김민준",
    "grade": "중1",
    "school_name": "금당중"
  },
  "assignments": [
    {
      "assignment_id": "HW001",
      "title": "일차방정식 과제",
      "class_id": "CLASS001",
      "class_name": "중1A",
      "due_date": "2026-05-13",
      "due_time": "12:00",
      "status": "active",
      "is_submitted": 0,
      "submitted_at": null
    }
  ],
  "planner": {
    "enabled": true,
    "url": "/apmath/planner/?student_id=STU001"
  },
  "omr": {
    "enabled": true,
    "status": "coming_soon"
  }
}
```

### 절대 금지

student-portal/home은 아래 데이터를 반환하면 안 된다.

```text
다른 학생 목록
다른 학생 과제 제출 여부
반 전체 명단
student_pin
전화번호
보호자 정보
상담 기록
성적 기록
오답 기록
출결 기록
```

---

## 6. apmath/student/index.html 설계

## 6-1. 파일 위치

신규 생성:

```text
apmath/student/index.html
```

단독 페이지로 만든다.

core.js에 의존하지 않아도 된다.

API_BASE는 현재 프로젝트 기준과 동일하게 둔다.

```javascript
const API_BASE = 'https://ap-math-os-v2612.js-pdf.workers.dev/api';
```

---

## 6-2. 로그인 전 화면

상단:

```text
AP Math OS
학생 포털
```

본문:

```text
이름
PIN
로그인 버튼
```

안내 문구:

```text
이름과 PIN은 선생님께 받은 정보로 입력하세요.
```

오류 문구:

```text
이름 또는 PIN을 확인하세요.
```

---

## 6-3. 로그인 성공 후 저장

localStorage 사용.

저장 키:

```text
APMATH_STUDENT_PORTAL_SESSION
```

저장 데이터:

```json
{
  "student_id": "STU001",
  "name": "김민준",
  "grade": "중1",
  "school_name": "금당중",
  "login_at": "2026-05-12T00:00:00.000Z"
}
```

저장 금지:

```text
PIN 원문 저장 금지
전화번호 저장 금지
보호자 정보 저장 금지
```

로그아웃 버튼을 제공하고, 누르면 위 localStorage 키를 삭제한다.

---

## 6-4. 로그인 후 홈 화면

상단:

```text
김민준 학생
금당중 · 중1
로그아웃
```

카드 1 — 과제

표시:

```text
과제
미제출 n개
제출 완료 n개
```

버튼:

```text
과제 보기
```

카드 2 — 플래너

표시:

```text
플래너
오늘 계획을 확인하고 체크하세요.
```

버튼:

```text
플래너 열기
```

동작:

```javascript
location.href = `../planner/?student_id=${encodeURIComponent(studentId)}`
```

카드 3 — OMR

표시:

```text
OMR 입력
시험 답안 입력은 준비 중입니다.
```

버튼:

```text
OMR 입력
```

1차 동작:

```text
안내 toast 또는 안내 박스 표시
"OMR 입력은 준비 중입니다. 선생님이 안내한 시험 QR 또는 코드를 사용해 주세요."
```

---

## 6-5. 과제 목록 화면

과제 보기 클릭 시 같은 페이지 안에서 목록을 보여준다.

섹션 1:

```text
미제출 과제
```

각 카드:

```text
과제 제목
반 이름
마감일
제출하기 버튼
```

제출하기 버튼 이동:

```javascript
../homework/?assignment_id=과제ID&student_id=로그인학생ID
```

섹션 2:

```text
제출 완료
```

각 카드:

```text
과제 제목
반 이름
제출 시각
확인 버튼
```

확인 버튼도 기존 homework 화면으로 이동해도 된다.

과제가 없을 때:

```text
현재 진행 중인 과제가 없습니다.
```

---

## 6-6. UI 기준

AP Math OS 학생용 보조 화면 톤으로 만든다.

권장:

```text
- 모바일 우선
- 최대 너비 520px
- Pretendard 적용
- 상단 sticky header
- 카드형 UI
- font-weight 700 이하
- 기존 homework/index.html과 비슷한 미니멀 톤
```

이미지 파일 추가하지 않는다.

그래픽은 CSS로만 처리한다.

---

## 7. 구현 세부 흐름

### 7-1. 학생포털 로딩

```text
1. localStorage에서 APMATH_STUDENT_PORTAL_SESSION 확인
2. 세션 있으면 student_id로 student-portal/home 호출
3. 성공하면 홈 렌더링
4. 실패하면 세션 삭제 후 로그인 화면
5. 세션 없으면 로그인 화면
```

### 7-2. 로그인

```text
1. 이름 입력
2. PIN 입력
3. POST student-portal/auth 호출
4. 성공하면 localStorage 저장
5. student-portal/home 호출
6. 홈 렌더링
```

### 7-3. 과제 보기

```text
1. home API의 assignments 배열 사용
2. is_submitted 기준으로 미제출 / 제출 완료 분리
3. due_date 오름차순 또는 미제출 우선 정렬
4. 제출하기 클릭 시 homework/index.html로 이동
```

---

## 8. 기존 기능 회귀 방지

반드시 지킬 것:

```text
1. 기존 homework/index.html 수정 금지
2. 기존 planner/index.html 수정 금지
3. 기존 classroom.js 수정 금지
4. 기존 core.js 수정 금지
5. 기존 QR/OMR 파일 수정 금지
6. 기존 Worker API 삭제 금지
7. 기존 API 응답 구조 변경 금지
8. schema.sql 수정 금지
9. D1 migration 추가 금지
10. 불필요한 리팩터링 금지
```

특히 건드리지 말 것:

```text
verifyAuth
canAccessStudent
canAccessClass
homework-photo/*
planner/*
check-pin
check-init
initial-data
exam-sessions
wrong_answers
attendance
homework
```

---

## 9. 검토 시 확인할 Worker 위치

Codex는 index.js에서 현재 라우팅 구조를 확인한다.

확인할 기존 resource:

```text
auth
homework-photo
planner
check-pin
check-init
initial-data
```

student-portal은 새 resource로 추가한다.

예상 구조:

```javascript
if (resource === 'student-portal') {
  if (method === 'POST' && id === 'auth') { ... }
  if (method === 'GET' && id === 'home') { ... }
}
```

단, 실제 index.js 라우팅 구조에 맞춰 가장 안전한 위치에 추가한다.

기존 라우팅을 깨지 마라.

---

## 10. SQL 설계 주의

학생 로그인:

```sql
SELECT id, name, grade, school_name, status
FROM students
WHERE name = ?
  AND student_pin = ?
  AND status = '재원'
```

동명이인 중복 확인을 위해 all()로 조회하는 것이 안전하다.

학생 홈 기본 정보:

```sql
SELECT id, name, grade, school_name, status
FROM students
WHERE id = ?
  AND status = '재원'
```

과제 목록 조회 예시:

```sql
SELECT
  hpa.id AS assignment_id,
  hpa.title,
  hpa.class_id,
  c.name AS class_name,
  hpa.due_date,
  hpa.due_time,
  hpa.status,
  hps.is_submitted,
  hps.submitted_at
FROM homework_photo_assignments hpa
JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
LEFT JOIN classes c ON c.id = hpa.class_id
WHERE hps.student_id = ?
  AND hpa.status != 'deleted'
ORDER BY hpa.due_date ASC, hpa.created_at DESC
LIMIT 30
```

주의:

```text
student_id로 본인 제출 row만 조회한다.
class 전체 제출 현황 조회 금지.
```

---

## 11. node 검사 기준

수정 또는 신규 JS 파일은 검사한다.

이번 작업에서 검사 대상:

```bash
node --check apmath/worker-backup/worker/index.js
```

HTML 내부 script는 별도 파일이 아니므로 node --check 직접 대상은 아니다.

다만 Codex는 `apmath/student/index.html` 내부 script 문법을 자체 점검해야 한다.

가능하면 임시로 script 부분을 추출해 문법 오류가 없는지 확인한다.

---

## 12. 구현 전 Codex 보고 형식

이번 실행에서는 아직 구현하지 않는다.

아래 형식으로만 보고한다.

```text
1. 이해한 작업 목표

2. 수정/신규 파일 목록
- 신규:
- 수정:
- 수정 금지:

3. 수정 위치
- worker/index.js 어디에 student-portal을 넣을지
- student/index.html 구조

4. 구현 방식
- auth API
- home API
- student/index.html 흐름

5. 위험하거나 확인 필요한 지점
- 학생 이름 중복
- student_pin 컬럼명
- homework_photo_* 컬럼명
- 기존 router 구조
- OMR 1차 처리 방식

6. 기존 기능 회귀 가능성
- homework-photo
- planner
- OMR
- initial-data

7. Worker/DB 수정 여부
- Worker 수정 필요
- D1 schema 변경 없음
- migration 없음

8. 구현 승인 후 실행할 검사
- node --check apmath/worker-backup/worker/index.js
- student/index.html 내부 script 점검
```

---

## 13. 완료 보고 방식

이번은 검토 전용이므로 CODEX_RESULT.md를 만들지 않아도 된다.

다만 구현 단계로 넘어갈 때는 반드시 아래 원칙을 적용한다.

완료 보고는 터미널에 길게 출력하지 마라.

프로젝트 루트에 CODEX_RESULT.md 파일을 만들고, 아래 내용만 정리해서 저장해라.

```text
1. 수정/신규 파일 목록
2. 구현 완료 기능
3. node --check 결과
4. 수동 테스트 체크리스트
5. 미구현/주의 항목
```

터미널에는 아래 한 줄만 출력해라.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

````

```text
Codex에 입력할 문구:

CODEX_TASK.md를 읽어라.

아직 파일을 수정하지 마라.
먼저 아래만 보고해라.

1. 이해한 작업 목표
2. 수정/신규 파일 목록
3. 수정 위치
4. 구현 방식
5. 위험하거나 확인 필요한 지점
6. 기존 기능 회귀 가능성
7. Worker/DB 수정이 필요한지 여부
8. 구현 승인 후 실행할 검사

내 승인 전까지 파일 수정 금지.
````
