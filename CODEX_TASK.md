````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 0. 작업 목표

AP Math OS의 `수업자료` 기능을 다음 최종 구조로 정리한다.

```text
수업자료

준비 | 입력 | 보기
````

이번 작업의 핵심은 다음이다.

1. 수업자료 모달 탭을 `준비 | 입력 | 보기` 3개로 단순화한다.
2. `입력` 탭에서 선생님이 반 전체 학생의 오답번호를 한 번에 입력/수정할 수 있게 한다.
3. 학생도 수업자료 오답번호를 다시 수정할 수 있게 한다.
4. 저장할 때마다 기존 오답번호를 새 값으로 교체한다.
5. 마지막 저장값을 최종 오답으로 본다.
6. 시험 OMR의 제출 후 수정 불가 규칙은 절대 건드리지 않는다.
7. 수업자료 오답만 반복 수정 가능하게 한다.

---

## 1. 수정 대상 파일

수정 허용 파일:

* `apmath/js/study-material-wrong.js`
* `apmath/worker-backup/worker/routes/study-material-wrongs.js`
* `apmath/student/index.html`
* `CODEX_RESULT.md`

확인만 가능하고 원칙적으로 수정하지 않을 파일:

* `apmath/js/ui.js`

`ui.js`는 이미 메뉴명이 `수업자료`라면 수정하지 않는다.
만약 아직 `수업자료 오답` 문구가 남아 있다면 그 문구만 `수업자료`로 수정한다.

---

## 2. 절대 금지

아래 작업은 절대 하지 않는다.

* `wrangler` 실행 금지
* D1 migration 실행 금지
* 신규 migration 생성 금지
* `schema.sql` 변경 금지
* git add 금지
* git commit 금지
* git push 금지
* 배포 금지
* 원장/관리자 대시보드 변경 금지
* 학생 포털에서 원문/PDF/archive 열기 기능 추가 금지
* 시험 OMR 제출 후 수정 불가 규칙 변경 금지
* 기존 OMR 입력, 시험성적, 클리닉, 교재관리, 학생관리, 학급관리, 시간표 메뉴명 변경 금지
* drawer/헤더/공통 모달 구조 변경 금지
* 지시하지 않은 버튼 추가 금지
* 자료 삭제/숨김/비활성화 UI 추가 금지
* 기존 route 제거 금지
* 기존 DB 컬럼명 변경 금지
* 구간별 오답 개수 컬럼 생성 금지
* `수정 불가`, `잠금`, `제출 완료` 문구 표시 금지

---

## 3. 핵심 정책 변경

기존에는 학생 제출 후 수정 불가로 설계되어 있었지만, 수업자료 오답은 시험 OMR과 다른 기능이다.

### 3.1 시험 OMR

시험 OMR은 기존 규칙 유지.

```text
시험 OMR
- 제출 후 수정 불가
- 재제출 불가
- 학생 수정 불가
```

### 3.2 수업자료 오답

수업자료 오답은 반복 수정 가능.

```text
수업자료
- 학생 수정 가능
- 선생님 수정 가능
- 저장할 때마다 기존 오답번호를 새 값으로 교체
- 마지막 저장값이 최종 오답
```

예시:

```text
1차 입력: 12, 15, 22
다시 풀기 후 수정: 15
최종 오답: 15
```

---

## 4. 최종 화면 구조

기존 탭을 정리한다.

기존 예시:

```text
자료 등록 | 단원 설정 | 반 배정 | 제출 확인 | 오답 확인 | 오답번호 출력
```

변경:

```text
준비 | 입력 | 보기
```

탭 key는 다음을 권장한다.

* `prepare`
* `entry`
* `view`

기존 key가 남아 있어도 화면에는 반드시 위 3개 탭만 보여야 한다.

---

## 5. 문구 원칙

### 5.1 금지 문구

사용자 화면에 아래 문구가 나오면 실패다.

```text
수업자료 오답
비활성화
사용 안 함
사용 중
active
inactive
deleted
복습
복습표
복습 출력
복습 지시표
입력 열기
수정 불가
잠금
제출 완료
```

주의:

* 내부 함수명 `reviewForm`, `loadStudyMaterialReview`, API명 `material-review`는 유지 가능하다.
* 사용자에게 보이는 화면 문구만 금지한다.

### 5.2 권장 짧은 문구

화면 제목:

```text
수업자료
```

상단 탭:

```text
준비 | 입력 | 보기
```

버튼:

```text
등록
보기
배정
불러오기
저장
조회
출력
선택
적용
닫기
새로고침
```

상태:

```text
-
O
X
제출
```

범례:

```text
- 미입력   O 정답   X 오답   제출
```

`제출`은 잠금이 아니다.
학생 또는 선생님이 입력한 적 있다는 표시일 뿐이며, 계속 수정 가능해야 한다.

---

## 6. 준비 탭

`준비` 탭 안에 기존 기능 3개를 세로 섹션으로 정리한다.

```text
준비

자료 등록
단원 설정
반 배정
```

### 6.1 자료 등록 섹션

필드:

* 자료 종류
* 자료명
* 학년
* 학기
* 시작 번호
* 끝 번호

버튼:

* 등록
* 새로고침

자료 목록 표시:

```text
rpm3-1(15개정)
문제기본서 · 중3 · 1학기 · 1-1078
```

자료 카드 안에는 관리 버튼을 넣지 않는다.

아래 문구/버튼은 절대 나오면 안 된다.

```text
비활성화
사용 중
사용 안 함
active
inactive
deleted
```

### 6.2 단원 설정 섹션

필드:

* 수업자료
* 범위 붙여넣기

placeholder:

```text
순서,대단원,소단원,시작번호,끝번호
```

버튼:

* 등록
* 보기

빈 목록 문구:

```text
등록된 단원이 없습니다.
```

### 6.3 반 배정 섹션

필드:

* 학년
* 반
* 수업자료
* 날짜
* 이름

버튼:

* 배정
* 보기

빈 목록 문구:

```text
열린 자료가 없습니다.
```

주의:

* `입력 열기`라는 문구를 쓰지 않는다.
* 버튼은 `배정`으로 표시한다.

---

## 7. 입력 탭

`입력` 탭은 선생님이 반 학생들의 오답번호를 한 번에 입력/수정하는 화면이다.

### 7.1 입력 탭 화면

```text
입력

학년
반
수업자료

불러오기

- 미입력   O 정답   X 오답   제출

학생명 | 상태 | 오답번호 | 선택
김다희 | X    | 12, 15, 203 | 선택
김수인 | O    |              | 선택
서진후 | 제출 | 8, 17        | 선택
박현종 | -    |              | 선택

저장
```

### 7.2 중요 UI 기준

* 입력 표는 `학생명 / 상태 / 오답번호 / 선택`만 둔다.
* 구간별 오답 개수 컬럼을 만들지 않는다.
* `제출` 상태 학생도 수정 가능해야 한다.
* `제출` 상태 학생도 선택 버튼을 표시한다.
* `수정 불가`, `잠금`, `제출 완료` 문구는 쓰지 않는다.
* `제출`은 수정 금지가 아니라 입력 이력 표시다.

### 7.3 필드 id 권장

* `smw-entry-grade`
* `smw-entry-class`
* `smw-entry-material`

학생 row id/class 권장:

* `smw-entry-list`
* `smw-entry-row`
* `smw-entry-wrongs-${studentId}`
* `smw-entry-status-${studentId}`

### 7.4 입력 탭 동작

1. 학년 선택 시 해당 학년 반만 표시한다.
2. 반 선택 시 해당 반 학생만 표시한다.
3. 수업자료 선택은 필수다.
4. `불러오기`를 누르면 학생 목록과 기존 입력 상태를 불러온다.
5. 각 학생 row에는 상태, 오답번호 입력칸, 선택 버튼을 둔다.
6. 오답번호 입력칸에는 직접 입력이 가능하다.
7. `선택` 버튼을 누르면 해당 학생의 번호 선택창을 연다.
8. 상태를 `O`로 바꾸면 입력칸을 비운다.
9. 번호를 입력하거나 선택하면 상태는 `X`가 된다.
10. `저장`을 누르면 화면에 입력된 학생별 오답번호를 한 번에 저장한다.

---

## 8. 상태 동작

상태는 짧게 표시한다.

```text
-     미입력
O     정답
X     오답
제출  입력한 적 있음
```

### 8.1 상태 클릭 또는 select 처리

상태 UI는 버튼 또는 select 중 구현이 쉬운 방식으로 한다.

권장:

```text
상태 칸 클릭 순서:
- → O → - 
```

오답번호 입력 또는 선택 시:

```text
- 또는 O 또는 제출 → X
```

기존 제출 데이터가 있는 학생은 처음에는 `제출`로 표시할 수 있다.
그러나 선생님이 번호를 수정하면 `X`로 바뀌어도 된다.

### 8.2 저장 기준

* `-` 상태 + 빈칸: 저장하지 않음
* `O` 상태: 기존 오답 삭제, 오답 없음으로 저장
* `X` 상태 + 번호 있음: 기존 오답 삭제, 새 번호 저장
* `제출` 상태 + 값 그대로 저장 대상에 포함되면 기존 값으로 다시 저장해도 됨
* `제출` 상태 + 수정 발생: 기존 오답 삭제, 새 값으로 교체

---

## 9. 직접 입력 방식

오답번호 입력칸은 다음 입력을 모두 허용한다.

```text
12,15,22
12 15 22
12번 15번 22번
12/15/22
12, 15 / 22번
```

프론트에서 숫자만 추출하여 정렬/중복 제거한다.

예:

```text
12번, 15, 15 / 22
→ 12, 15, 22
```

권장 함수:

```js
function parseWrongNumbersText(value) {
    const nums = String(value || '').match(/\d+/g) || [];
    const unique = [...new Set(nums.map(Number).filter(Number.isFinite))];
    return unique.sort((a, b) => a - b);
}
```

유효성:

* 수업자료의 시작 번호보다 작으면 오류
* 수업자료의 끝 번호보다 크면 오류
* 숫자가 없고 상태가 `O`도 아니면 저장 대상에서 제외
* 빈칸 학생은 기존 상태 유지

---

## 10. 클릭 입력 방식 — 번호 선택창

문제번호가 1000번을 넘어도 입력 가능해야 한다.
전체 번호를 한꺼번에 뿌리지 말고, 100개 단위 구간 선택 방식을 사용한다.

### 10.1 번호 선택창

학생 row의 `선택` 버튼을 누르면 번호 선택창을 연다.

제목:

```text
김다희 번호 선택
```

구성:

```text
김다희 번호 선택

선택: 12, 15, 203

1-100 | 101-200 | 201-300 | ... | 1001-1078

1  2  3  4  5  6  7  8  9  10
11 12 13 14 15 16 17 18 19 20
...
91 92 93 94 95 96 97 98 99 100

적용
닫기
```

### 10.2 열 개수

번호 버튼 열 개수는 다음 기준으로 한다.

```text
모바일: 10열
태블릿: 15열
PC: 20열
```

CSS 권장:

```css
.smw-num-grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 5px;
}

@media (min-width: 720px) {
  .smw-num-grid {
    grid-template-columns: repeat(15, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .smw-num-grid {
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }
}

.smw-num-btn {
  min-height: 34px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 800;
}
```

### 10.3 100개 단위 구간

자료 번호 범위가 `1~1078`이면 구간은 아래처럼 생성한다.

```text
1-100
101-200
201-300
301-400
401-500
501-600
601-700
701-800
801-900
901-1000
1001-1078
```

자료 번호 범위가 `301~650`이면 구간은 아래처럼 생성한다.

```text
301-400
401-500
501-600
601-650
```

권장 함수:

```js
function buildNumberGroups(startNo, endNo, size = 100) {
    const groups = [];
    let start = Number(startNo) || 1;
    const end = Number(endNo) || start;
    while (start <= end) {
        const groupEnd = Math.min(start + size - 1, end);
        groups.push({ start, end: groupEnd, label: `${start}-${groupEnd}` });
        start = groupEnd + 1;
    }
    return groups;
}
```

### 10.4 번호 선택창 상태

state에 선택창 상태를 추가한다.

```js
numberPicker: {
    studentId: '',
    studentName: '',
    groupStart: 1,
    groupEnd: 100,
    selected: []
}
```

권장 함수:

```js
function openWrongNumberPicker(studentId) { ... }
function renderWrongNumberPicker() { ... }
function setWrongNumberPickerGroup(start, end) { ... }
function toggleWrongNumberPick(no) { ... }
function applyWrongNumberPicker() { ... }
function closeWrongNumberPicker() { ... }
```

### 10.5 적용 동작

`적용` 버튼을 누르면:

1. 선택된 번호를 정렬한다.
2. 해당 학생 입력칸에 `12, 15, 22` 형식으로 넣는다.
3. 해당 학생 상태를 `X`로 바꾼다.
4. 번호 선택창을 닫는다.
5. 입력 탭 화면은 유지한다.

`닫기` 버튼을 누르면:

* 입력칸 변경 없이 닫는다.

### 10.6 번호 선택창 구현 주의

현재 수업자료 모달 자체가 `showModal()`로 열려 있으므로, 번호 선택창을 다시 `showModal()`로 열면 수업자료 모달이 덮어써진다.

따라서 번호 선택창은 `study-material-wrong.js` 내부에서 자체 overlay/div로 렌더링한다.

권장 구조:

```html
<div id="smw-number-picker-overlay" class="smw-picker-overlay">
  <div class="smw-picker">
    ...
  </div>
</div>
```

CSS 권장:

```css
.smw-picker-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.smw-picker {
  width: min(720px, 100%);
  max-height: 86vh;
  overflow: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
}
```

---

## 11. 저장 전 요약

`저장` 버튼을 누르면 바로 저장하지 말고, confirm으로 요약을 보여준다.

요약 항목:

* 저장
* 정답
* 미입력

예:

```text
저장 8명
정답 2명
미입력 1명

저장할까요?
```

`confirm()` 사용 가능.
새 복잡한 모달은 추가하지 않는다.

---

## 12. 선생님 일괄 저장 API

`apmath/worker-backup/worker/routes/study-material-wrongs.js`에 신규 API를 추가하거나 기존 구현을 수정한다.

### 12.1 학생 목록 불러오기

```text
GET /api/material-omr/entry-sheet?class_id=&material_id=
```

필수:

* `class_id`
* `material_id`

권한:

* `canAccessClass(user, classId, env)` 확인

응답 형식:

```js
{
  success: true,
  assignment: {
    id,
    class_id,
    material_id,
    title
  },
  material: {
    id,
    title,
    number_start,
    number_end
  },
  students: [
    {
      student_id,
      student_name,
      submission_id,
      is_submitted,
      is_no_wrong,
      submitted_at,
      wrong_numbers
    }
  ]
}
```

동작:

* class_id와 material_id에 해당하는 활성 배정을 찾는다.
* 배정이 여러 개면 최신 배정 1개를 사용한다.
* 배정이 없으면 `Assignment not found` 오류를 반환한다.
* 해당 배정의 `student_material_submissions`와 `student_material_wrong_answers`를 조회한다.
* 학생 이름순으로 반환한다.

### 12.2 선생님 일괄 저장

```text
POST /api/material-omr/teacher-batch-save
```

body:

```js
{
  assignment_id,
  rows: [
    {
      student_id,
      wrong_numbers: [12, 15, 22],
      is_no_wrong: 0
    },
    {
      student_id,
      wrong_numbers: [],
      is_no_wrong: 1
    }
  ]
}
```

필수:

* `assignment_id`
* `rows`

권한:

* assignment의 class_id에 대해 `canAccessClass(user, classId, env)` 확인

저장 규칙:

* 제출 여부와 상관없이 선생님 저장 가능
* 해당 학생 submission이 없으면 생성
* 해당 학생 기존 오답번호 삭제
* 새 오답번호 insert
* `is_no_wrong = 1`이면 오답번호 없이 정답 처리
* 저장 후 `student_material_submissions.is_submitted = 1`
* `submitted_at`은 현재 시간으로 갱신
* `updated_at` 갱신
* `student_material_wrong_answers`에는 기존 구조 그대로 insert
* teacher_id는 기존 `findAssignmentTeacherId`를 사용
* 빈칸이고 `is_no_wrong`도 아닌 학생은 건드리지 않음

응답 형식:

```js
{
  success: true,
  saved: 0,
  skipped_empty: 0
}
```

주의:

* 기존 제출값도 선생님이 수정 가능하다.
* `skipped_submitted` 개념은 쓰지 않는다.
* `교사용 정정` 버튼은 만들지 않는다.
* 같은 저장 화면에서 그냥 계속 수정 가능하게 한다.

---

## 13. 학생 수업자료 저장 API 수정

기존 학생 수업자료 submit API는 `이미 제출했으면 막는 구조`일 가능성이 있다.

수정 기준:

```text
수업자료는 학생도 다시 저장 가능
기존 값은 새 값으로 교체
마지막 저장값이 최종 오답
```

### 13.1 대상

`resource === 'material-omr' && method === 'POST' && id === 'submit'`

기존 금지 로직이 있으면 수업자료에 한해 제거한다.

기존 예시:

```js
if (Number(submission.is_submitted || 0) === 1) return fail('Already submitted', 409);
```

이 로직은 수업자료에서는 제거한다.

### 13.2 저장 방식

학생이 저장할 때도 선생님 저장과 동일하게 처리한다.

* 기존 `student_material_wrong_answers`에서 해당 `submission_id`의 기존 오답을 삭제 또는 status deleted 처리
* 새 오답번호 insert
* `is_no_wrong` 반영
* `is_submitted = 1`
* `submitted_at` 갱신
* `updated_at` 갱신

### 13.3 GET assignment 응답

학생이 다시 열었을 때 기존 값이 보여야 한다.

기존 응답에서 다음을 유지/확인한다.

```js
submission: {
  wrong_numbers: [...],
  is_submitted,
  is_no_wrong,
  can_submit
}
```

수정:

```js
can_submit: true
```

또는 프론트에서 can_submit을 막는 용도로 쓰지 않게 변경한다.

중요:

* 시험 OMR의 can_submit과 혼동하지 말 것.
* 이 route는 수업자료 전용이다.

---

## 14. 학생 포털 화면 수정

`apmath/student/index.html`에서 수업자료 오답 입력 화면을 수정한다.

목표:

```text
학생이 수업자료를 다시 열 수 있음
기존 오답번호가 표시됨
학생이 번호를 지우거나 추가할 수 있음
오답 없음으로 바꿀 수 있음
저장하면 기존 값 교체
```

문구는 짧게 유지한다.

권장 문구:

```text
수업자료
오답번호
오답 없음
저장
```

수정해야 할 것:

* 제출 완료 후 수업자료 오답 버튼을 숨기지 않는다.
* 제출 완료 후 수정 불가 안내를 띄우지 않는다.
* 기존 오답번호를 표시한다.
* 다시 저장할 수 있게 한다.
* 저장 후에도 다시 열 수 있게 한다.

단, 시험 OMR에는 절대 적용하지 않는다.
시험 OMR의 제출 완료/수정 불가 흐름은 그대로 유지한다.

---

## 15. 보기 탭

기존 `제출 확인`, `오답 확인`, `오답번호 출력`을 하나로 합친다.

최종 탭명:

```text
보기
```

화면 구조:

```text
보기

학년
반
학생
수업자료

조회

제출
오답
단원
학생별

출력
```

### 15.1 보기 탭 동작

* 학년만 선택하면 학년 전체 조회
* 반까지 선택하면 반 조회
* 학생까지 선택하면 학생 조회
* 수업자료 선택은 선택값
* 수업자료 미선택 시 전체 자료 기준
* `조회` 버튼 하나만 둔다
* 조회 결과 안에 제출 현황, 오답 통계, 학생별 오답을 함께 표시한다
* `출력` 버튼은 현재 조회 결과를 출력용 텍스트로 보여준다

### 15.2 출력 표현

아래 표현은 쓰지 않는다.

```text
복습표
복습 방법
복습 출력
복습 지시표
오답번호 출력
오답번호 보기
```

보기 탭에서는 버튼을 단순히:

```text
출력
```

으로 한다.

결과 제목은:

```text
김다희 오답번호
```

하단 안내 제목은:

```text
확인 방법
```

---

## 16. 보기 탭 API 사용

보기 탭 조회는 기존 scope API를 사용한다.

* `GET /api/material-wrongs/scope`
* 필요 시 `GET /api/material-review/scope`

가능하면 `조회` 때는 `material-wrongs/scope` 하나로 제출/오답/단원/학생별 정보를 보여준다.

출력용 번호는 이미 조회된 결과를 우선 사용한다.
부족하면 `material-review/scope`를 추가 호출한다.

보기 탭에서 제출 현황도 보여야 한다.

권장 응답:

```js
{
  success: true,
  scope: { ... },
  submissions: [
    {
      student_id,
      student_name,
      status,
      wrong_numbers
    }
  ],
  top_wrong_numbers: [],
  student_wrongs: [],
  unit_counts: [],
  items: []
}
```

상태 표시:

```text
-
O
X
제출
```

---

## 17. 프론트 함수 권장 구조

`apmath/js/study-material-wrong.js`에서 다음 함수 구조를 권장한다.

```js
function prepareForm() { ... }
function materialSection() { ... }
function rangeSection() { ... }
function assignSection() { ... }

function entryForm() { ... }
function renderEntryRows() { ... }
function parseWrongNumbersText(value) { ... }
function buildNumberGroups(startNo, endNo, size = 100) { ... }
function getSelectedMaterialById(materialId) { ... }

function openWrongNumberPicker(studentId) { ... }
function renderWrongNumberPicker() { ... }
function setWrongNumberPickerGroup(start, end) { ... }
function toggleWrongNumberPick(no) { ... }
function applyWrongNumberPicker() { ... }
function closeWrongNumberPicker() { ... }

function viewForm() { ... }
function renderViewText() { ... }
function renderOutputText() { ... }

window.loadStudyMaterialEntrySheet = async function () { ... }
window.saveStudyMaterialTeacherBatch = async function () { ... }
window.loadStudyMaterialView = async function () { ... }
window.showStudyMaterialOutput = function () { ... }
```

state에는 다음 값이 있어야 한다.

```js
entry: null,
numberPicker: null,
view: null
```

---

## 18. 삭제할 UI

다음 UI는 화면에서 제거한다.

* `비활성화` 버튼
* 자료 상태 표시
* 별도 `제출 확인` 탭
* 별도 `오답 확인` 탭
* 별도 `오답번호 출력` 탭
* 구간별 오답 개수 컬럼
* `학생별 오답` 버튼
* `반별 오답` 버튼
* `학생 지시표` 버튼
* `반 지시표` 버튼
* `복습표 보기` 버튼
* `오답번호 보기` 버튼
* `수정 불가` 표시
* `잠금` 표시
* `제출 완료` 표시

---

## 19. 보존할 기능

아래 기능은 유지한다.

* 자료 등록
* 단원 설정
* 반 배정
* 학생 포털 수업자료 입력
* 학생 수업자료 재입력/재저장
* 선생님 수업자료 전체 입력/수정
* 학생 오답 없음 저장
* 제출 현황 확인
* 학년/반/학생 범위 조회
* 수업자료 미선택 전체 자료 조회
* 오답 번호 출력용 텍스트 생성
* 기존 scope API
* 기존 legacy API
* 시험 OMR 제출 후 수정 불가

---

## 20. 문법검사

수정 후 아래 명령만 실행한다.

```powershell
node --check apmath/js/study-material-wrong.js
node --check apmath/worker-backup/worker/routes/study-material-wrongs.js
```

`student/index.html` inline script가 수정되었다면 inline script parse도 확인한다.

예시 방식은 기존 프로젝트에서 사용한 방식과 동일하게 한다.

금지:

* `wrangler` 실행 금지
* migration 실행 금지
* git 실행 금지
* deploy 실행 금지

---

## 21. 수동 확인 기준

작업 후 실제 화면 기준으로 아래가 만족되어야 한다.

### 21.1 탭

상단 탭은 아래 3개만 보여야 한다.

```text
준비 | 입력 | 보기
```

### 21.2 준비 탭

* 자료 등록 가능
* 단원 설정 가능
* 반 배정 가능
* 자료 카드에 비활성화 버튼 없음
* 자료 카드에 사용 중/사용 안 함 상태 없음

### 21.3 입력 탭

* 학년 선택 가능
* 반 선택 가능
* 수업자료 선택 가능
* 불러오기 가능
* 학생 목록 표시
* 학생별 직접 오답번호 입력 가능
* 학생별 선택 버튼으로 번호 선택창 열림
* 1-100 구간에서 1~100 번호 버튼 표시
* 모바일 10열
* 태블릿 15열
* PC 20열
* 101-200 등 100개 단위 구간 선택 가능
* 1000번 이상 자료도 구간 버튼으로 처리 가능
* 선택된 번호는 입력칸에 반영
* 상태 `O` 정답 처리 가능
* 상태 `X` 오답 처리 가능
* 상태 `제출` 학생도 수정 가능
* 저장 가능
* 저장 결과 toast 표시

### 21.4 학생 포털

* 학생이 수업자료를 다시 열 수 있음
* 기존 오답번호가 표시됨
* 학생이 번호를 수정할 수 있음
* 학생이 오답 없음으로 바꿀 수 있음
* 저장하면 기존 오답번호가 교체됨
* 시험 OMR은 여전히 제출 후 수정 불가

### 21.5 보기 탭

* 학년만 선택 후 조회 가능
* 반까지 선택 후 조회 가능
* 학생까지 선택 후 조회 가능
* 수업자료 미선택 전체 자료 기준 조회 가능
* 수업자료 선택 시 해당 자료 기준 조회 가능
* 제출/오답/단원/학생별 정보가 한 화면에 표시
* 출력 버튼으로 오답번호 출력 텍스트 확인 가능

### 21.6 금지 확인

아래 문구가 사용자 화면에 나오면 실패다.

```text
수업자료 오답
비활성화
사용 안 함
사용 중
active
inactive
deleted
복습
복습표
복습 출력
복습 지시표
입력 열기
수정 불가
잠금
제출 완료
```

---

## 22. 완료 보고서 작성

작업 완료 후 루트의 `CODEX_RESULT.md`에 아래 형식으로 저장한다.

```markdown
# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `apmath/js/study-material-wrong.js`
- 수정: `apmath/worker-backup/worker/routes/study-material-wrongs.js`
- 수정: `apmath/student/index.html`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료
- 수업자료 모달 탭을 `준비 | 입력 | 보기` 3개로 단순화
- 준비 탭에 자료 등록/단원 설정/반 배정 통합
- 자료 카드의 비활성화 버튼 제거
- 자료 카드의 상태 표시 제거
- 입력 탭 추가
- 선생님이 반 학생별 오답번호를 한꺼번에 입력/수정할 수 있게 구현
- 제출 상태 학생도 선생님이 수정 가능하게 구현
- 직접 입력 방식 구현
- 번호 선택창 구현
- 100개 단위 구간 선택 구현
- 모바일 10열 / 태블릿 15열 / PC 20열 번호판 구현
- 1000번 이상 자료 대응
- 상태 `O` 정답 처리 구현
- 상태 `X` 오답 처리 구현
- 저장 전 요약 확인 구현
- 학생 수업자료 오답 재수정 가능하게 구현
- 학생 저장 시 기존 오답번호 교체
- 선생님 저장 시 기존 오답번호 교체
- 보기 탭에 제출 확인/오답 확인/출력 흐름 통합
- 보기 탭에서 학년/반/학생 범위 조회 유지
- 보기 탭에서 수업자료 미선택 전체 자료 조회 유지
- 화면에서 금지 문구 제거
- 학생 자료 원문 열기 기능 추가 없음
- 원장/관리자 대시보드 변경 없음
- 시험 OMR 제출 후 수정 불가 유지
- schema/migration 변경 없음
- wrangler 실행 없음
- git add/commit/push 실행 없음
- 배포 실행 없음

## 3. 실행 결과
- `node --check apmath/js/study-material-wrong.js` 결과:
- `node --check apmath/worker-backup/worker/routes/study-material-wrongs.js` 결과:
- `apmath/student/index.html` inline script parse 결과:

## 4. 결과 요약
- 선생님 화면 흐름을 `준비 → 입력 → 보기`로 정리
- 선생님 전체 입력/수정 기능 추가
- 학생 수업자료 오답 수정 가능 구조로 변경
- 1~100, 101~200 방식의 빠른 번호 선택 기능 추가
- 위험한 비활성화 UI 제거
- 오답 확인과 출력 흐름을 보기 탭으로 통합
- 시험 OMR 규칙은 유지

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 점
- 잘못한 점:
- 위험했던 점:
- 보존해야 할 점:
  - 지시하지 않은 버튼 추가 금지
  - 선생님 화면에 위험한 관리 버튼 노출 금지
  - 시험 OMR 제출 후 수정 불가 유지
  - 수업자료만 반복 수정 가능
  - 학생 자료 원문 열기 기능 추가 금지
  - 원장/관리자 대시보드 변경 금지

## 6. 다음 조치
- 운영센터에서 준비/입력/보기 탭 수동 확인 필요
- 실제 반 1개와 자료 1개로 선생님 전체 입력 저장 확인 필요
- 학생 포털에서 수업자료 오답 수정 저장 확인 필요
- 시험 OMR 수정 불가 유지 확인 필요
- 1-100 번호 선택창 확인 필요
- 1000번 이상 자료 구간 선택 확인 필요
- 보기 탭에서 출력 텍스트 확인 필요
```

---

## 23. 마지막 출력

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
