# CODEX_RESULT

## 1. 생성/수정 파일

### 생성 파일
- `eie/js/apms-compat/eie-apms-state.js` (Round 1 신규, Round 1.1 보정)
- `eie/js/apms-compat/eie-apms-api.js` (Round 1 신규, Round 1.1 전면 보정)
- `eie/js/apms-compat/eie-apms-ui-bridge.js` (Round 1 신규)

### 수정 파일
- `eie/js/eie-state.js` — state.db / state.ui 구조 추가, 메서드 추가 (Round 1)
- `eie/js/eie-api.js` — public request/get/post/patch/delete/isAuthError 추가 (Round 1)
- `eie/index.html` — apms-compat 스크립트 3개 삽입 (Round 1)
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md` — Round 1.1 보정 결과 전면 업데이트
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md` — Round 1.1 완료 상태, Round 2 전 선행조건 업데이트

## 2. 보정 완료

### apmath-home/index.html 범위 밖 변경 처리
- `git restore apmath-home/index.html` 실행.
- git status에서 `apmath-home/index.html` 제거 확인.
- Round 1.1 작업트리에서 완전히 정리됨.

### window.state 제공
- `eie-apms-state.js` 하단에 추가:
  ```js
  if (!window.state && window.EieState && typeof window.EieState.get === 'function') {
      window.state = window.EieState.get();
  }
  ```
- EieState.get()의 참조를 그대로 연결 (복사본 아님).
- 이미 window.state가 있으면 덮어쓰지 않음.
- APMS 복사 코드가 `state.db.*`, `state.ui.*`를 직접 접근 가능.

### api.get('students') APMS형 normalize
- `EieApi.getStudents()` 원본을 그대로 반환하지 않음.
- `EieApmsState.normalizeFoundation(payload, null)`을 거쳐 반환:
  ```js
  { success: true, data: Array<NormalizedStudent>, raw: originalPayload }
  ```
- confirmed_students / students / data 형태 모두 처리.
- 학생 없으면 `success: true, data: []`.
- 401/403은 throw 흐름 유지.

### 미구현 쓰기 endpoint EIE_NOT_IMPLEMENTED 처리 (B안 확정)
다음 모든 경로를 EIE_NOT_IMPLEMENTED로 차단:
1. POST students
2. PATCH students/{id}
3. PATCH/POST students/{id}/status
4. POST/PATCH/DELETE consultations
5. POST/PATCH parent-foundation/contacts
6. POST/PATCH attendance, homework, class-daily-records
7. POST timetable-cells/{id}/students
8. DELETE timetable-cells/{id}/students/{studentId}

EieApi.createStudent, updateStudent, updateStudentStatus, assignStudentToCell, removeStudentFromCell로
연결하던 경로를 모두 차단하고 not_implemented로 교체.

### 문서 업데이트
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md`: window.state/api 정책, normalize 정책, not_implemented 목록, Round 2 전제조건 반영.
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`: Round 1.1 보정 내용, Round 2 진입 전 선택지 명확화.

## 3. 실제 확인한 핵심 파일

### EIE 수정 파일
- `eie/js/apms-compat/eie-apms-state.js`
- `eie/js/apms-compat/eie-apms-api.js`
- `eie/js/apms-compat/eie-apms-ui-bridge.js` (이번 라운드 변경 없음)

### 문서 파일
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md`
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`

### 확인한 금지 파일 (변경 없음)
- `eie/js/views/eie-students.js`
- `eie/js/views/eie-classroom.js`
- `eie/js/views/eie-timetable.js`
- `eie/js/views/eie-timetable-v2.js`
- `eie/js/views/eie-dashboard.js`

## 4. 실행 결과

### node --check 결과
```
eie/js/eie-api.js                          OK
eie/js/eie-state.js                        OK
eie/js/apms-compat/eie-apms-state.js       OK
eie/js/apms-compat/eie-apms-api.js         OK
eie/js/apms-compat/eie-apms-ui-bridge.js   OK
eie/js/eie-app.js                          OK
eie/js/eie-router.js                       OK
```

### git diff --name-only (Round 1 + 1.1 누적 수정)
```
CODEX_RESULT.md
CODEX_TASK.md
eie/index.html
eie/js/eie-api.js
eie/js/eie-state.js
index.html  ← Round 1.1 범위 밖 기존 변경, 커밋 제외 필요
```

### git status --short
```
 M CODEX_RESULT.md
 M CODEX_TASK.md
 M eie/index.html
 M eie/js/eie-api.js
 M eie/js/eie-state.js
 M index.html  ← 범위 밖 기존 변경
?? docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
?? docs/EIE_APMS_REBASE_ROUND0_AUDIT.md
?? docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
?? docs/EIE_APMS_STUDENT_PARITY_SPEC.md
?? eie/js/apms-compat/eie-apms-api.js
?? eie/js/apms-compat/eie-apms-state.js
?? eie/js/apms-compat/eie-apms-ui-bridge.js
```

### apmath-home/index.html diff
- git diff 결과 0줄. git status에서 제거 확인. ✅

### EIE view 파일 diff 없음 확인
- `eie/js/views/` 전체 git diff 결과 0줄. ✅

### window.api 충돌 확인
- `window.api` 할당: eie-apms-api.js 1곳만 (`!window.api` 조건부). ✅

### createStudent/updateStudent 등 연결 확인
- `grep createStudent|updateStudent|updateStudentStatus|assignStudentToCell|removeStudentFromCell eie-apms-api.js` → 결과 없음. ✅

## 5. 구현하지 않은 것
- 학생관리 UI parity 미구현 (Round 2 대상)
- 클래스룸 UI parity 미구현 (Round 4 대상)
- 상담/숙제/출결 저장 미구현 (Round 3/4 대상)
- Worker endpoint 추가 미구현
- DB migration 미실행
- 배포 없음
- git add/commit/push 없음

## 6. 남은 위험
- **index.html (루트) 범위 밖 변경**: `index.html`이 git status에 M으로 잡혀 있으나 Round 1.1 범위 밖. 별도 커밋에서 처리 필요.
- **Worker 학생 CRUD endpoint 없음**: POST students, PATCH students/{id}, PATCH students/{id}/status — Round 2 진입 전 선구현 또는 UI에서 준비중 처리 필요.
- **APMS student.js 복사 시 추가 bridge 가능성**: CONFIG.API_BASE, getTeacherNameForUI, copyPhoneNumber 등 추가 전역 변수 필요할 수 있음.
- **브라우저 실구동 확인 필요**: window.state 참조 연결, api.get('students') normalize 결과를 실제 브라우저에서 확인 필요.

## 7. 다음 라운드
- Round 2 전 선택지:
  - A. Worker 학생 CRUD endpoint 선구현 (권장)
  - B. 학생관리 parity UI를 먼저 붙이되 저장 버튼은 준비중으로 차단
- 권장: Worker 학생 CRUD endpoint 선구현 후 학생관리 parity

## 8. review pack 경로
- `C:\Users\USER\Downloads\eie_apms_rebase_round1_1_compat_review_pack_20260530.zip`
