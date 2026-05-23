/goal Academy OS Phase 6 Round 8-4-1: 반 lifecycle 커밋 차단 이슈 초소형 보정

이번 작업은 Round 8-4 반 정보 수정 / 폐반 처리 구현에 대한 ChatGPT 1차 코드검수에서 발견된 커밋 차단 이슈 2개만 보정하는 작업이다.
새 기능 확장, UI 리디자인, DB migration 없이 worker guard와 테스트만 정확히 보강한다.

절대 작업 루트:
C:\Users\USER\Desktop\academy-os-v2

금지 루트 / 금지 기준:
- C:\Users\USER\Desktop\AP------
- C:\Users\USER\RECOVER_WORK\AP------
- C:\Users\USER\RECOVER_WORK
- apmath/index.html
- apmath/js/ui.js
- apmath/js/operations-dashboard.js
- apmath/worker-backup
- APMS 정적 앱 구조
- AP------에서 생성된 작업물

금지 작업:
- 금지 루트 파일을 읽거나 복사하지 마라.
- React Router로 구조를 갈아타지 마라.
- route/menu/mode 구조 변경 금지.
- 운영 홈 기능 변경 금지.
- StudentOperationHub UI 기능 확장 금지.
- Classes 화면 리디자인 금지.
- 반 삭제 기능 구현 금지.
- 미사용 반 삭제 기능 구현 금지.
- 자동 학생 배정 종료 금지.
- 자동 시간표 재편성 금지.
- 반 병합 기능 추가 금지.
- DB migration 추가 금지.
- schema 변경 금지.
- API endpoint 이름 대규모 변경 금지.
- 기존 정상 통과한 Round 8-4 기능을 되돌리지 마라.
- git add / git commit / git push 금지.
- 배포 금지.
- 검수요청서 작성 금지.

0. 작업 전 상태 확인

먼저 아래를 확인하고 CODEX_RESULT.md에 기록한다.

- 현재 작업 디렉터리
- git status --short --untracked-files=all
- git log --oneline -5
- worker/routes/classes.js 존재 여부
- tools/test-phase6-round8-4-class-lifecycle.mjs 존재 여부
- web-react/src/pages/Classes.jsx 존재 여부
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md 존재 여부
- docs/V2_WORKING_RULEBOOK.md 존재 여부

현재 알려진 기존 상태:
- Round 8-4 변경 파일들이 아직 커밋 전이다.
- CODEX_TASK.md는 채팅창 지시 입력으로 dirty 상태일 수 있으나 이번 작업에서 열거나 수정하지 않는다.
- C:\Users\USER\.config\git\ignore permission denied 경고가 표시될 수 있다.
- 기존 dirty/untracked 항목은 임의 복구/삭제하지 않는다.

1. 이번 보정 대상

Round 8-4 1차 검수에서 남은 커밋 차단 이슈는 아래 2개다.

이슈 1. class 생성 API가 status / is_active / is_deleted를 body에서 받아 lifecycle 우회 생성이 가능함
- 현재 POST /classes 생성 로직이 body.status, body.is_active 등을 반영할 수 있다.
- 정책상 lifecycle 변경은 close action으로만 처리해야 한다.
- 생성 API는 항상 운영 중 반으로 생성되어야 한다.

이슈 2. 폐반 반도 API로 PATCH 수정 가능함
- UI에서 폐반 반 수정 버튼을 숨겨도 API 직접 호출로 PATCH /classes/:id가 가능할 수 있다.
- 정책상 폐반 반은 이번 라운드에서 읽기 전용이다.
- 폐반 반 메모 수정 예외도 이번 라운드에서는 구현하지 않는다.

2. 수정 대상 파일

필수 수정:
- worker/routes/classes.js
- tools/test-phase6-round8-4-class-lifecycle.mjs
- CODEX_RESULT.md

필요 시 최소 수정:
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md
- docs/PHASE6_CHANGED_MANIFEST.md
- PROJECT_STATUS.md

원칙적으로 수정하지 말 파일:
- web-react/src/pages/Classes.jsx
- web-react/src/api/classes.js
- web-react/src/api/studentOperationHub.js
- web-react/src/styles/design-system.css
- web-react/src/pages/StudentOperationHub.jsx
- worker/routes/student-operation-hub.js
- worker/index.js

단, 위 파일에 직접적인 회귀가 발견되면 CODEX_RESULT.md에 기록하고 사용자 확인 필요로 남긴다. 이번 작업에서 임의 수정하지 않는다.

3. backend guard 보정

대상:
- worker/routes/classes.js

3-1. class 생성 시 lifecycle field 무시

POST /classes 또는 기존 class create 로직을 확인한다.

필수 정책:
- class 생성 시 status는 항상 active 또는 기존 schema의 운영 중 상태로 저장한다.
- class 생성 시 is_active는 항상 1로 저장한다.
- class 생성 시 is_deleted는 항상 0 또는 기존 create 관례의 정상값으로 저장한다.
- body.status, body.is_active, body.is_deleted, body.closed_at, body.ended_at 등 lifecycle 관련 값은 생성 요청에서 무시한다.
- created_at/updated_at은 기존 관례를 따른다.
- 사용자가 생성 payload에 폐반/비활성 상태를 넣어도 새 반은 운영 중 반으로 생성되어야 한다.

권장 구현:
- create payload를 구성할 때 lifecycle 필드는 body에서 가져오지 않는다.
- 기존 SQL insert에 body.status/body.is_active/body.is_deleted가 들어가 있으면 고정값으로 바꾼다.
- status 컬럼이 있다면 'active' 고정.
- is_active 컬럼이 있다면 1 고정.
- is_deleted 컬럼이 있다면 0 고정.
- closed_at/ended_at/archived_at 컬럼이 있다면 create 시 null 또는 insert 생략.
- 실제 schema에 없는 컬럼을 새로 추가하지 않는다.

주의:
- 기존 class 생성 필드 name/grade/subject/teacher_id 등 정상 필드는 보존한다.
- academy_id 격리와 owner/manager 권한 guard는 유지한다.
- DB migration 금지.

3-2. 폐반 반 PATCH 차단

PATCH /classes/:id 또는 기존 class update 로직을 확인한다.

필수 정책:
- PATCH 전에 해당 class를 academy scope로 조회한다.
- 조회된 class가 폐반 상태이면 수정 차단한다.
- 폐반 판정은 기존 schema/구현에 맞춘다.
  - status === 'closed'
  - 또는 is_active === 0
  - 또는 둘 다
- 응답 문구:
  - 폐반된 반은 수정할 수 없습니다.
- 오류 code 권장:
  - CLASS_CLOSED
- 이번 라운드에서는 폐반 반 메모 수정 예외도 허용하지 않는다.
- PATCH allowlist는 기존 Round 8-4 구현의 name/subject/teacher_id/memo 등 허용 범위를 유지한다.
- PATCH에서 status/is_active/is_deleted 직접 변경 금지는 유지한다.

주의:
- close action 자체는 폐반 처리이므로 유지한다.
- 이미 폐반된 반에 close 요청이 들어오는 기존 처리는 과하게 바꾸지 않는다.
- active 배정 학생 폐반 차단 guard는 유지한다.
- class_students 수강 종료 DELETE 흐름은 StudentOperationHub 기존 기능 보존을 위해 건드리지 않는다.

4. 테스트 보강

대상:
- tools/test-phase6-round8-4-class-lifecycle.mjs

반드시 추가/강화할 검사:

1. class 생성 lifecycle field 무시
- worker/routes/classes.js의 create 로직에서 body.status/body.is_active/body.is_deleted를 직접 insert/update 값으로 쓰지 않는지 검사한다.
- create 로직에 status active 고정 또는 is_active 1 고정 또는 동등한 운영 중 기본값이 있어야 한다.
- body.closed_at/body.ended_at/archived_at 같은 lifecycle field를 create에서 반영하지 않는지 검사한다.

2. 폐반 반 PATCH 차단
- PATCH/update 로직에서 class 상태를 확인하는 guard가 있어야 한다.
- status closed 또는 is_active 0일 때 PATCH를 차단하는 조건이 있어야 한다.
- CLASS_CLOSED 또는 “폐반된 반은 수정할 수 없습니다.” 문구가 있어야 한다.

3. 기존 Round 8-4 guard 유지
- 반 정보 수정 handler 존재
- close action 존재
- PATCH allowlist 유지
- PATCH에서 status/is_active/is_deleted 직접 변경 금지
- close action에서 active 배정 학생 count 또는 active students 조회 guard 존재
- 배정 학생 잔존 시 폐반 차단 문구 존재
- DELETE route 없음 또는 hard delete 없음
- Classes 화면에 “반 정보 수정”, “폐반 처리”, “폐반 반 보기”, “폐반” 문구 존재
- Classes 화면에 “반 삭제”, “미사용 반 삭제”, “완전 삭제” 사용자 노출 없음
- StudentOperationHub에 반 정보 수정 UI 없음
- 반 이동/반 추가 후보에서 폐반 반 제외 guard 또는 backend 기본 조회 active-only 확인
- APMS/apmath 경로 금지

테스트는 실제 소스를 읽어 검사한다.
CODEX_RESULT만 보고 PASS하면 안 된다.

5. 문서 갱신

수정:
- CODEX_RESULT.md

필요 시 최소 수정:
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md
- docs/PHASE6_CHANGED_MANIFEST.md
- PROJECT_STATUS.md

문서에 반영할 내용:
- Round 8-4-1 lifecycle guard 보강
- 새 반 생성은 항상 운영 중 반으로만 생성
- 폐반 반은 PATCH 수정 불가
- 반 삭제/자동 종료/자동 재편성/반 병합은 여전히 제외

6. 검증 명령

아래 명령을 실행하고 CODEX_RESULT.md에 기록한다.

- node tools/test-phase6-round8-4-class-lifecycle.mjs
- node tools/test-phase6-round8-3-parent-contacts.mjs
- node tools/test-phase6-round7-operations-home.mjs
- node tools/test-phase6-round2-student-hub.mjs
- node --check worker/index.js
- node --check worker/routes/classes.js
- node --check worker/routes/student-operation-hub.js
- npm.cmd run check
- cd web-react; npm.cmd run check
- cd web-react; npm.cmd run build

추가 검색:
- rg "CLASS_CLOSED|폐반된 반은 수정할 수 없습니다" worker/routes/classes.js tools/test-phase6-round8-4-class-lifecycle.mjs
- rg "body\\.status|body\\.is_active|body\\.is_deleted|body\\.closed_at|body\\.ended_at" worker/routes/classes.js
  결과가 있다면 create/update allowlist 맥락인지 lifecycle 우회 반영인지 확인하고 CODEX_RESULT.md에 기록한다.
- rg "반 삭제|미사용 반 삭제|완전 삭제" web-react/src/pages/Classes.jsx worker/routes/classes.js tools/test-phase6-round8-4-class-lifecycle.mjs
  결과가 있다면 테스트 금지 문구인지 실제 UI/route 노출인지 CODEX_RESULT.md에 기록한다.
- git status --short --untracked-files=all
- git diff --name-only

7. CODEX_RESULT.md 작성 형식

# CODEX_RESULT

## 1. 생성/수정 파일
생성/수정 파일을 정확히 구분한다.

## 2. 오염 확인
- 작업 루트가 C:\Users\USER\Desktop\academy-os-v2인지 확인
- AP------ / RECOVER_WORK / apmath 작업물을 사용하지 않았는지 확인
- 기존 dirty 항목은 무엇이었고 이번 작업에서 건드렸는지 여부 기록

## 3. 보정 완료
- class 생성 시 lifecycle field 무시
- 새 반은 항상 운영 중 반으로 생성
- 폐반 반 PATCH 수정 차단
- CLASS_CLOSED 또는 동일 오류 코드/문구 추가
- Round 8-4 테스트 보강

## 4. 보존 확인
- DB migration 없음
- schema 변경 없음
- 반 삭제 기능 없음
- 자동 학생 배정 종료 없음
- 자동 시간표 재편성 없음
- 반 병합 없음
- 수납/청구/장부/환불/이월 정정 기능 없음
- 운영 홈 기능 변경 없음
- StudentOperationHub 기존 청구/수납/상담/연락처/반 처리 흐름 보존
- ParentPaymentLink public route 보존
- API payload key 기존 호환 유지
- AP------ / apmath 파일 미사용

## 5. 실행 결과
검증 명령별 PASS/FAIL 기록.
실패가 있으면 실패 명령, 오류 요약, 수정 여부 기록.

## 6. 결과 요약
짧게 작성.

## 7. 다음 조치
- ChatGPT 1차 재검수용 변경 파일 압축 필요
- 브라우저에서 반 생성 lifecycle field 무시 / 폐반 반 수정 차단 / 폐반 처리 직접 확인 필요
- Pro 검수방 PASS 전 git add / commit / push 금지
- 배포 금지

8. 자기검증

작업 종료 전 반드시 확인한다.

- 현재 루트가 C:\Users\USER\Desktop\academy-os-v2인지 확인
- AP------ / RECOVER_WORK 파일을 참조하거나 복사하지 않았는지 확인
- apmath 정적 앱 파일을 수정하지 않았는지 확인
- 생성 API에서 status/is_active/is_deleted를 body에서 받아 lifecycle 우회하지 않는지 확인
- 폐반 반 PATCH가 차단되는지 확인
- 반 삭제 버튼/route를 만들지 않았는지 확인
- 폐반 시 배정 학생 자동 종료를 만들지 않았는지 확인
- 기존 Round 8-4 기능을 되돌리지 않았는지 확인
- 테스트가 실제 소스를 읽는지 확인
- CODEX_RESULT.md 외 검수요청서 작성하지 않았는지 확인
- git add / commit / push 하지 않았는지 확인