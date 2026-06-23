# CODEX_RESULT

## 변경 파일

- `eie/js/views/eie-timetable.js`
  - 원장/관리자 세션 판정 헬퍼 추가.
  - 퇴원/보관 학생에게만 시간표 학생 편집 패널의 `완전삭제` 버튼 노출.
  - 완전삭제 클릭 위임과 `EieApi.deleteStudent` 호출 핸들러 추가.
  - `휴원 입력`/`퇴원 입력`/`재원 복구` 상태 단축버튼 제거.
- `eie/js/views/eie-students.js`
  - `휴원 입력`/`퇴원 입력`/`재원 복구` 상태 단축버튼 제거.
  - 전체 `eie/` 검색에서 다른 호출이 없어 `setEditStatus` 제거.
- `tests/eie-student-worker-crud-parity.test.js`
  - 상태 단축버튼 존재 계약을 상태 드롭다운 유지 계약으로 갱신.
- `CODEX_RESULT.md`
  - 이번 작업 결과와 검증 결과 기록.

사용자 기존/동시 변경인 `CODEX_TASK.md`와 `apmath/js/*` 파일들은 수정하거나 정리하지 않았다.

## 작업 1 — 시간표 패널 완전삭제

- owner 판정 헬퍼: `eie/js/views/eie-timetable.js:599`
  - `WANGJI_EIE_ROLE`이 `admin`/`owner`이거나 로그인 ID가 `admin`인 경우만 허용.
- 버튼 렌더: `eie/js/views/eie-timetable.js:3108`
  - owner 세션이면서 상태가 `inactive`/`withdrawn`/`archived`인 학생에게만 노출.
  - 기존 `eie-p-btn-danger` 스타일 재사용.
- 클릭 위임: `eie/js/views/eie-timetable.js:4174`
- 핸들러: `eie/js/views/eie-timetable.js:5590`
  - owner 세션과 학생 상태를 다시 검사.
  - 비가역 삭제 확인창 표시.
  - `window.EieApi.deleteStudent(sid)` 호출 후 foundation과 시간표 목록 갱신 및 패널 닫기.
  - 실패 시 기존 mini panel 오류 흐름 사용.

기존 전반 버튼(`:3106`), 퇴원 버튼(`:3107`), 퇴원 위임/핸들러는 변경하지 않았다.

## 작업 2 — 상태 단축버튼 제거

- 시간표 패널
  - 기존 상태 드롭다운은 `eie/js/views/eie-timetable.js:3086`에 유지.
  - 드롭다운 아래 상태 단축버튼 3개 제거.
- students 화면
  - 학생 편집 폼의 상태 단축버튼 3개 제거.
  - 상태 드롭다운 및 저장 payload는 유지.
- `setEditStatus`
  - 전체 `eie/`에서 `setEditStatus`, `EieStudentsView.setEditStatus` 참조가 0건임을 확인하고 제거.
- 제거 문구 검색
  - 전체 `eie/`에서 `휴원 입력`, `퇴원 입력`, `재원 복구` 검색 결과 0건.
- 상태 저장 유지
  - students: `eie/js/views/eie-students.js:2102`
  - timetable: `eie/js/views/eie-timetable.js:5241`
  - 퇴원 상태 저장 시 `withdrawn_at` 설정 경로 유지.

## 검증 결과

통과:

- `node --check eie/js/views/eie-timetable.js`
- `node --check eie/js/views/eie-students.js`
- `node tests/eie-owner-hard-delete-student.test.js`
  - `EIE owner hard-delete student test passed`
- `node tests/eie-student-worker-crud-parity.test.js`
  - `EIE student worker CRUD parity test passed`
- `git diff --check`
- 전체 `eie/` 단축버튼/미사용 함수 grep

실패:

- `node tools/test-student-js-mojibake-guard.mjs`

```text
Student mojibake guard failed:
- student UI sources: required Korean phrase missing: "제적"
```

이번 변경 대상이 아닌 `apmath/js/student.js`와 `apmath/js/student-edit.js`를 검사하는 기존 가드 실패이며, EIE 허용 범위를 벗어나 수정하지 않았다.

## 미해결/판단 보류

- 실제 로그인 세션을 이용한 수동 UI 및 DELETE 호출 E2E는 수행하지 못해 UNVERIFIED.
- 하위 봇은 사용자 지시에 따라 사용하지 않았으며 B/C/D 독립 리뷰는 UNVERIFIED.
- AP mojibake 가드의 기존 `제적` 누락은 후속 정리가 필요하다.
- Git add/commit/push/deploy는 수행하지 않았다.
