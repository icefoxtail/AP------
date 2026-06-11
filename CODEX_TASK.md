# CODEX_TASK.md

## 0. 작업 경로

```powershell
cd C:\Users\USER\Desktop\AP------
pwd
git status -sb
```

작업 결과는 반드시 아래 파일에 작성한다.

```text
C:\Users\USER\Desktop\AP------\CODEX_RESULT1.md
```

---

# 1. 작업명

```text
AP Math 학생상세 등원일 기존 재원생 기준일 보정
```

---

# 2. 작업 목적

학생상세 수정모드에서 `이미 등원 중인 학생입니다` 체크 시 등원일이 `7일 전`으로 자동 입력되는 문제가 있다.

이 로직은 실제 운영 의미와 맞지 않는다.

`이미 등원 중인 학생입니다`는 “7일 전에 등원했다”가 아니라, **신입 온보딩 대상이 아닌 기존 재원생**이라는 의미다.

따라서 기존 `7일 전` 자동 입력 로직을 제거하고, 학년별 기존 재원생 기준 등원일로 보정한다.

---

# 3. 핵심 기준

```text
이미 등원 중 체크 시 등원일 기본값

중1 → 2026-01-12
중2 → 2025-03-01
중3 → 2024-03-01
```

단, 기존 데이터 보호가 최우선이다.

```text
1. 등원일 input이 비어 있을 때만 학년별 기준일을 자동 입력한다.
2. 등원일이 이미 있으면 절대 덮어쓰지 않는다.
3. 사용자가 직접 입력한 날짜가 있으면 절대 덮어쓰지 않는다.
4. 학년을 판별할 수 없으면 자동 입력하지 않는다.
5. 7일 전 자동 입력 로직은 완전 제거한다.
6. edit 모드에서 today fallback 금지 원칙은 계속 유지한다.
```

---

# 4. 수정 대상

원칙적으로 아래 파일만 수정한다.

```text
apmath/js/student.js
```

읽기/검사용 파일:

```text
apmath/js/dashboard.js
apmath/js/classroom.js
apmath/js/management.js
apmath/js/timetable.js
apmath/js/cumulative.js
apmath/js/ui.js
apmath/index.html
```

다른 파일 수정 금지.
다른 파일을 수정해야 한다면 `CODEX_RESULT1.md`에 이유를 반드시 적는다.

---

# 5. 절대 금지

```text
- DB schema 수정 금지
- Worker/API 수정 금지
- openStudentDetail 수정 금지
- openEditStudent 수정 금지
- returnStudentEditToView 수정 금지
- closeModal / showModal / modalReturnView 수정 금지
- 학생 저장 payload 구조 임의 재설계 금지
- 오늘 날짜 fallback 추가 금지
- 7일 전 fallback 유지 금지
```

---

# 6. 사전 조사

먼저 아래 검색을 실행한다.

```powershell
Select-String -Path "apmath/js/student.js" `
  -Pattern "setOnboardingStartedAtSuggestion|getDateTextDaysAgo|alreadyAttending|이미 등원|onboarding_started_at|getTodayKstDateText|onboardingStartedAt|edit-onboarding" `
  -Context 4,4
```

반드시 확인할 것:

```text
1. 이미 등원 중 체크박스 onchange 함수명
2. setOnboardingStartedAtSuggestion 함수 위치
3. getDateTextDaysAgo(7) 사용 위치
4. onboarding_started_at 저장 경로
5. 기존 등원일 보존 로직이 유지되는지
6. today fallback이 edit 저장에서 다시 들어가지 않는지
```

---

# 7. 수정 기준

## 7-1. 7일 전 로직 제거

아래 로직은 제거 또는 사용 중단한다.

```js
getDateTextDaysAgo(7)
```

특히 `이미 등원 중` 체크박스와 연결된 자동 입력에서 7일 전 날짜를 쓰면 안 된다.

금지 패턴:

```js
dateInput.value = getDateTextDaysAgo(7);
```

```js
if (alreadyAttending) onboardingStartedAt = getDateTextDaysAgo(7);
```

---

## 7-2. 학년별 기준일 함수 추가

`student.js` 안에 안전한 헬퍼를 추가한다.

예시:

```js
function getDefaultOnboardingStartedAtByGrade(student) {
    const rawGrade = String(
        student?.grade ||
        student?.student_grade ||
        student?.grade_label ||
        ''
    ).trim();

    if (rawGrade.includes('중1')) return '2026-01-12';
    if (rawGrade.includes('중2')) return '2025-03-01';
    if (rawGrade.includes('중3')) return '2024-03-01';

    return '';
}
```

만약 실제 학생 데이터에서 학년 필드명이 다르면 기존 코드 기준으로 보강한다.

가능한 후보:

```text
student.grade
student.student_grade
student.grade_label
student.school_grade
student.level
```

필요하면 class 정보에서 학년을 추론해도 된다.
단, API 호출 추가 금지. 기존 `student` / `state.db` 안에서만 찾는다.

---

## 7-3. 이미 등원 중 체크 시 동작

`이미 등원 중인 학생입니다` 체크박스를 사용자가 직접 체크했을 때만 동작한다.

동작 기준:

```text
1. 체크 해제 시 날짜를 지우지 않는다.
2. 체크 시 date input이 비어 있으면 학년별 기준일을 입력한다.
3. date input에 값이 이미 있으면 아무것도 하지 않는다.
4. 학년별 기준일을 알 수 없으면 아무것도 하지 않는다.
```

예시:

```js
function handleAlreadyAttendingOnboardingSuggestion(student) {
    const dateInput = document.getElementById('edit-onboarding-started-at');
    const checkbox = document.getElementById('edit-already-attending');

    if (!dateInput || !checkbox) return;
    if (!checkbox.checked) return;

    const currentValue = String(dateInput.value || '').trim();
    if (currentValue) return;

    const defaultDate = getDefaultOnboardingStartedAtByGrade(student);
    if (!defaultDate) return;

    dateInput.value = defaultDate;
}
```

실제 id는 기존 코드의 id를 따른다.
id가 다르면 실제 id 기준으로 작성한다.

---

# 8. 저장 로직 보존 기준

기존 라운드에서 보정한 edit 저장 보존 원칙은 유지한다.

```text
기존 등원일 있음 → 아무것도 안 바꾸고 저장해도 기존값 유지
기존 등원일 없음 → 아무것도 안 바꾸고 저장해도 빈값 유지
직접 날짜 입력 → 입력한 날짜 저장
이미 등원 중 체크 + 빈 등원일 → 학년별 기준일 저장
이미 등원 중 체크 + 기존 등원일 있음 → 기존값 유지
```

중요:

```text
이미 등원 중 체크가 되어 있다는 이유만으로 기존 등원일을 덮어쓰면 FAIL.
```

---

# 9. 테스트 시나리오

브라우저 확인 가능하면 반드시 확인한다.
브라우저 미확인이면 PASS로 쓰지 않는다.

## 9-1. 중1 기존 재원생

```text
1. 등원일이 비어 있는 중1 학생 열기
2. 수정 클릭
3. 이미 등원 중 체크
4. 등원일이 2026-01-12로 들어가는지 확인
5. 저장
6. 다시 열었을 때 2026-01-12 유지
```

## 9-2. 중2 기존 재원생

```text
1. 등원일이 비어 있는 중2 학생 열기
2. 수정 클릭
3. 이미 등원 중 체크
4. 등원일이 2025-03-01로 들어가는지 확인
5. 저장
6. 다시 열었을 때 2025-03-01 유지
```

## 9-3. 중3 기존 재원생

```text
1. 등원일이 비어 있는 중3 학생 열기
2. 수정 클릭
3. 이미 등원 중 체크
4. 등원일이 2024-03-01로 들어가는지 확인
5. 저장
6. 다시 열었을 때 2024-03-01 유지
```

## 9-4. 기존 등원일 보호

```text
1. 등원일이 이미 2025-05-10인 학생 열기
2. 수정 클릭
3. 이미 등원 중 체크
4. 등원일이 2025-05-10 그대로인지 확인
5. 저장
6. 다시 열었을 때 2025-05-10 유지
```

## 9-5. 직접 입력값 보호

```text
1. 등원일을 직접 2025-04-15로 입력
2. 이미 등원 중 체크
3. 2025-04-15가 덮어써지지 않는지 확인
4. 저장 후 재조회
5. 2025-04-15 유지
```

## 9-6. 학년 불명확

```text
1. 학년 판별 불가능한 학생
2. 이미 등원 중 체크
3. 등원일 자동 입력 없음
4. 저장해도 today/7일전 자동 생성 없음
```

---

# 10. 문법 검사

반드시 실행한다.

```powershell
node --check apmath/js/student.js
node --check apmath/js/dashboard.js
node --check apmath/js/classroom.js
node --check apmath/js/management.js
node --check apmath/js/timetable.js
node --check apmath/js/cumulative.js
node --check apmath/js/ui.js
```

---

# 11. CODEX_RESULT1.md 작성 형식

````markdown
# CODEX_RESULT1

## 1. 작업 경로

- `C:\Users\USER\Desktop\AP------`

## 2. 수정 파일

- `apmath/js/student.js`

## 3. 사전 조사

### 3-1. 기존 7일 전 로직
- 함수명:
- 위치:
- getDateTextDaysAgo(7) 사용 여부:
- 제거/수정 내용:

### 3-2. 학년 판별
- 사용 필드:
- 중1 판별:
- 중2 판별:
- 중3 판별:
- 판별 실패 처리:

### 3-3. 저장 로직
- 기존 등원일 보존:
- 빈 등원일 유지:
- 직접 입력값 유지:
- today fallback 여부:

## 4. 수정 내용

- 7일 전 자동 입력 제거:
- 학년별 기준일 적용:
- 기존값 덮어쓰기 방지:
- 체크 해제 시 날짜 삭제 방지:

## 5. 테스트 결과

```text
node --check ...
````

## 6. 브라우저 확인

* 확인함 / 미확인
* 미확인 시 PASS 금지

## 7. 회귀 위험

* 등원일:
* 이미 등원 중 체크:
* 신규 등록 flow:
* edit 저장:

````

---

# 12. PASS 기준

```text
1. getDateTextDaysAgo(7)가 이미 등원 중 체크 로직에서 제거됐다.
2. 중1 빈 등원일 + 이미 등원 중 체크 → 2026-01-12.
3. 중2 빈 등원일 + 이미 등원 중 체크 → 2025-03-01.
4. 중3 빈 등원일 + 이미 등원 중 체크 → 2024-03-01.
5. 기존 등원일이 있으면 절대 덮어쓰지 않는다.
6. 직접 입력한 날짜를 절대 덮어쓰지 않는다.
7. 체크 해제해도 등원일을 지우지 않는다.
8. 학년 불명확 시 자동 입력하지 않는다.
9. edit 저장에서 today fallback이 다시 생기지 않는다.
10. node --check가 통과한다.
````
