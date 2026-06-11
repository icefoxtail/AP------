# AP Math OS 학생상세 성적 하위 탭 기본값 리셋 보정 지시서

## 0. 목적

현재 학생상세 > 성적 탭은 `학교성적 / 원내평가` 하위 탭으로 분리되어 있다.

기능 핵심은 PASS지만, UX 상태 관리 WARN이 남아 있다.

문제 가능성:

1. A학생 상세 > 성적 > 원내평가 선택
2. B학생 상세를 성적 탭으로 바로 진입
3. B학생도 학교성적이 아니라 원내평가가 먼저 보일 수 있음

운영 기준은 다음이다.

* 학생상세 성적 탭에 새로 진입하면 기본은 항상 `학교성적`
* 다른 학생으로 바뀌면 기본은 항상 `학교성적`
* 같은 학생 안에서 학교성적/원내평가 하위 탭을 누르는 동작은 유지

이번 작업은 이 UX 상태 리셋만 보정한다.

## 1. 수정 대상

주 수정 파일:

* `apmath/js/student.js`

다른 파일은 원칙적으로 수정하지 않는다.

## 2. 현재 문제 원인

`renderStudentDetailShell()` 안에 하위 탭 리셋 로직이 있어도, `openStudentDetail()`이 `renderStudentDetailShell()` 호출 전에 먼저 아래 상태를 갱신할 수 있다.

* `state.ui.currentStudentDetailId`
* `state.ui.currentStudentDetailTab`

그러면 `renderStudentDetailShell()` 입장에서는 이전 학생/이전 탭을 정확히 감지하지 못할 수 있다.

따라서 `openStudentDetail()` 안에서 상태를 덮어쓰기 전에 이전 값을 먼저 저장하고, 필요한 경우 `state.ui.studentGradeSubTab = 'school'`을 적용해야 한다.

## 3. 구현 지시

`apmath/js/student.js`에서 `openStudentDetail(sid, options = {})` 함수를 찾는다.

현재 흐름은 대략 아래와 유사할 것이다.

```js
async function openStudentDetail(sid, options = {}) {
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) { toast('학생 정보 없음', 'warn'); return; }
    const mode = options.mode === 'edit' ? 'edit' : 'view';
    if (!state.ui) state.ui = {};
    const tab = normalizeStudentDetailTab(options.tab || state.ui.currentStudentDetailTab || 'basic');
    state.ui.currentStudentDetailId = String(sid);
    state.ui.currentStudentDetailMode = mode;
    if (mode === 'view') state.ui.currentStudentDetailTab = tab;
    ...
}
```

이 함수에서 `state.ui.currentStudentDetailId`와 `state.ui.currentStudentDetailTab`을 갱신하기 전에 이전 상태를 먼저 저장한다.

권장 수정 방향:

```js
async function openStudentDetail(sid, options = {}) {
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    const mode = options.mode === 'edit' ? 'edit' : 'view';
    if (!state.ui) state.ui = {};

    const oldDetailId = state.ui.currentStudentDetailId;
    const oldTab = state.ui.currentStudentDetailTab || 'basic';
    const tab = normalizeStudentDetailTab(options.tab || state.ui.currentStudentDetailTab || 'basic');

    if (mode === 'view' && tab === 'grade'
        && (String(oldDetailId || '') !== String(sid) || oldTab !== 'grade')) {
        state.ui.studentGradeSubTab = 'school';
    }

    state.ui.currentStudentDetailId = String(sid);
    state.ui.currentStudentDetailMode = mode;
    if (mode === 'view') state.ui.currentStudentDetailTab = tab;

    ...
}
```

주의:

* 기존 `renderStudentDetailShell()` 안의 리셋 로직은 삭제하지 않아도 된다.
* `renderStudentDetailTab()` 직접 호출 경로 보호용으로 유지해도 된다.
* 단, 같은 학생 안에서 `학교성적 / 원내평가` 하위 탭을 누를 때마다 무조건 `school`로 돌아가면 안 된다.
* 같은 학생, 같은 `grade` 탭 내부에서 하위 탭 전환은 유지되어야 한다.

## 4. 검수 시나리오

반드시 아래를 확인한다.

### A. 다른 학생으로 이동 시 리셋

1. A학생 상세를 연다.
2. 성적 탭을 누른다.
3. 원내평가 하위 탭을 누른다.
4. B학생 상세를 성적 탭으로 연다.
5. B학생은 반드시 `학교성적` 하위 탭으로 시작해야 한다.

### B. 같은 학생 내부 하위 탭 전환 유지

1. A학생 상세 > 성적 탭 진입
2. 학교성적 확인
3. 원내평가 클릭
4. 같은 학생 성적 탭 안에서는 원내평가가 정상 표시되어야 한다.
5. 불필요하게 즉시 학교성적으로 되돌아가면 FAIL

### C. 기본 성적 탭 진입

1. 학생상세 기본 탭에서 성적 탭을 누른다.
2. 기본 하위 탭은 `학교성적`이어야 한다.

### D. 기존 기능 회귀 확인

아래는 그대로 유지되어야 한다.

* 학교성적 표 표시
* 고1 공통수학1/2 표시
* 미적분2 → 미적분Ⅱ 점수 매칭
* 원내평가 차트
* 원내평가 기록
* 오답 초기화 버튼
* 기록 삭제 버튼
* 약한 단원 / 다음 학습 포인트

## 5. 검사 명령

수정 후 반드시 실행한다.

```bash
node --check apmath/js/student.js
node --check apmath/js/cumulative.js
node --check apmath/js/core.js
```

## 6. 압축 결과물

검수용 압축파일은 다운로드 폴더에 생성한다.

PowerShell 예시:

```powershell
cd C:\Users\USER\Desktop\AP------

Compress-Archive `
  -Path apmath\index.html, apmath\js\student.js, apmath\js\cumulative.js, apmath\js\core.js, apmath\js\ui.js, apmath\js\report.js, apmath\css `
  -DestinationPath "$env:USERPROFILE\Downloads\apmath_student_grade_subtab_reset_fix_review.zip" `
  -Force
```

압축 구조는 반드시 아래처럼 유지한다.

```text
apmath/index.html
apmath/js/student.js
apmath/js/cumulative.js
apmath/js/core.js
apmath/js/ui.js
apmath/js/report.js
apmath/css/...
```

## 7. 보고 형식

작업 완료 후 아래 형식으로 보고한다.

### 변경 파일

* 파일명
* 변경 요약

### 구현 내용

* `openStudentDetail()`에서 이전 학생/탭 상태를 갱신 전 저장했는지
* 학생이 바뀌거나 성적 탭에 새로 진입하면 `studentGradeSubTab = 'school'`로 리셋되는지
* 같은 학생의 성적 탭 내부 하위 탭 전환은 유지되는지
* 기존 `renderStudentDetailShell()` 리셋 로직 유지/정리 여부

### 검수 결과

* node --check 결과
* A학생 원내평가 선택 후 B학생 성적 진입 시 학교성적 리셋 확인 여부
* 같은 학생 내부 원내평가 전환 유지 확인 여부
* 학교성적/원내평가 기존 기능 회귀 확인 여부
* 미확인 항목

### 주의사항

* 이번 작업은 UX 상태 리셋 보정이다.
* 과목 정책, 성적표 저장 구조, API, DB 스키마를 건드리지 않는다.
* 임시 파일은 최종 압축에 포함하지 않는다.
* 확인하지 않은 항목을 PASS라고 쓰지 않는다.
