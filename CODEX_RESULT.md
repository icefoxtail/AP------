# CODEX_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/student.js`
- 수정: `apmath/js/classroom.js`
- 수정: `apmath/worker-backup/worker/routes/parent-foundation.js`
- 수정: `apmath/worker-backup/worker/routes/homework-photo.js`
- 수정: `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 학생 상세 `상담기록` 탭 안에 보호자 연락처/수신동의/연락 이력 UI를 추가했다.
- 기존 학생 상세 탭 이름과 상단 보호자 기본 연락처 카드는 바꾸지 않았다.
- 보호자 연락처 목록은 학생 단위로 조회되며, 이름/관계/연락처/대표 연락처/비고를 표시한다.
- 보호자 연락처가 없을 때는 빈 상태를 보여주고, `students.parent_phone` 값이 있으면 `기본 보호자 연락처`로만 표시한다.
- `students.parent_phone` 값을 `parent_contacts`로 자동 동기화하거나 migration하지 않았다.
- 학생 상세에서 보호자 연락처 추가/수정/삭제가 가능하다.
- 연락처 삭제는 기존 route를 최소 보강해 DELETE로 처리했고, 삭제 전 confirm과 삭제 후 학생 단위 재조회가 동작한다.
- 수신동의는 연락처 카드 안에서 항목별로 표시하고 `동의`/`미동의` 변경이 가능하다.
- 수신동의 표시는 `attendance`, `payment`, `notice`, `report`, `marketing` 기본 항목을 우선 사용하고, `consultation`, `homework`, `exam`은 실제 consent row가 있을 때만 노출한다.
- 연락 이력은 `message_logs` 기반 조회만 제공하고, 채널/유형/상태/수신자 snapshot/요약/실패 사유를 표시한다.
- 실제 발송 버튼, 재발송 버튼, 대량 발송 UI, message-preview UI는 만들지 않았다.
- `parent-foundation.js`는 contacts POST/PATCH 입력 검증과 contacts DELETE만 최소 보강했다.
- contacts DELETE 시 `parent_contact_consents`만 함께 정리하고 `message_logs`는 이력 보존을 위해 삭제하지 않는다.
- 반 화면의 기존 숙제 사진 배정/목록/링크/현황 흐름은 유지했다.
- `classroom.js`의 `제출 현황` 화면에서 제출별 `사진` 버튼을 추가해 제출 파일 목록/이미지 뷰어를 열 수 있게 했다.
- 숙제 사진 뷰어는 학생 이름, 숙제 제목, 제출 시각, 파일 목록, 이미지 미리보기, 큰 이미지 보기, 새 창 열기를 제공한다.
- 이미지가 아닌 파일은 미리보기 대신 파일 정보와 `열기`만 제공한다.
- `homework-photo.js` route에는 `GET /api/homework-photo/files`를 추가해 `submission_id` 또는 `assignment_id + student_id` 기준 파일 목록을 읽을 수 있게 했다.
- 숙제 사진 파일 조회는 `canAccessClass()` 기반 teacher/admin 권한 검사를 거친다.
- 숙제 사진 확인 처리 필드/API는 실제 schema/route에 없어서 이번 작업에서 새로 만들지 않았다.
- 학생 제출 페이지 `apmath/homework/index.html`은 여전히 `과제 완료로 제출` / `제출취소` 중심이고, 실제 사진 업로드 UI는 아직 없다.
- 따라서 선생님 뷰어는 `homework_photo_files`에 실제 파일이 있는 제출 건에 한해 동작하며, 학생 제출 사진 업로드 자체는 이번 작업 범위에서 추가하지 않았다.
- 학생 포털에는 보호자 연락처/수신동의 관리 UI를 추가하지 않았다.
- 학생 포털 OMR/시험지/archive 흐름은 건드리지 않았다.
- 대시보드 신규 카드나 원장 통합 연락 화면은 만들지 않았다.
- `reports-ai.js`, `report.js`, `timetable.js`, `management.js`, `schema.sql`, `migrations/*`는 수정하지 않았다.
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`에 학생 상세 학부모 연락 UI와 반 화면 숙제 사진 현황/뷰어 보강 상태, 실제 발송 금지, 확인 처리 보류를 반영했다.

## 3. 실행 결과

- `node --check apmath/js/student.js`: PASS
- `node --check apmath/js/classroom.js`: PASS
- `node --check apmath/worker-backup/worker/routes/parent-foundation.js`: PASS
- `node --check apmath/worker-backup/worker/routes/homework-photo.js`: PASS
- `rg -n "보호자|학부모|수신동의|parent_contacts|parent-foundation|consents|message_logs|연락 이력" apmath/js/student.js`
  - 보호자 연락처 로더, 수신동의 UI, 연락 이력 표시, 추가/수정/삭제/동의 변경 함수가 확인됐다.
- `rg -n "contacts|consents|messages|message-preview|student_id|canAccessStudent|DELETE|PATCH" apmath/worker-backup/worker/routes/parent-foundation.js`
  - contacts/consents/messages/message-preview route와 `canAccessStudent()` 권한 흐름, contacts DELETE 구현을 확인했다.
- `rg -n "숙제 사진|homework-photo/files|제출 현황|사진 .*장|마감 처리|숙제 목록" apmath/js/classroom.js`
  - 숙제 목록, 제출 현황, 파일 조회 modal, 이미지 viewer, 사진 버튼 연결을 확인했다.
- `rg -n "homework-photo|files|overview|student-links|submission_id|canAccessClass" apmath/worker-backup/worker/routes/homework-photo.js`
  - 기존 assignments/overview/student-links와 신규 files route, `canAccessClass()` 권한 흐름을 확인했다.
- `rg -n "보호자|학부모|수신동의|parent-foundation|consents|message_logs" apmath/student/index.html`
  - 결과 없음
- `rg -n "보호자 연락|수신동의|학부모 연락|parent-foundation|consents|숙제 사진" apmath/js/dashboard.js`
  - 결과 없음
- `rg -n "parent-foundation|message_logs|send|sms|kakao|consultation-summary" apmath/worker-backup/worker/routes/reports-ai.js`
  - `send/sms/kakao`는 기존 report AI 문맥이고 이번 작업과 연결된 parent-foundation/homework-photo 수정은 없다.
- `find apmath/worker-backup/worker/migrations -maxdepth 1 -type f | sort | tail -n 5`
  - 최신 5개만 출력됐고, 이번 작업으로 새 migration 파일은 생기지 않았다.
- `git status --short -- apmath/js/student.js apmath/js/classroom.js apmath/worker-backup/worker/routes/parent-foundation.js apmath/worker-backup/worker/routes/homework-photo.js docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md CODEX_RESULT.md`
  - 결과:
    - `M CODEX_RESULT.md`
    - `M apmath/js/classroom.js`
    - `M apmath/js/student.js`
    - `M apmath/worker-backup/worker/routes/homework-photo.js`
    - `M apmath/worker-backup/worker/routes/parent-foundation.js`
    - `M docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `git diff --name-only -- apmath/js/student.js apmath/js/classroom.js apmath/worker-backup/worker/routes/parent-foundation.js apmath/worker-backup/worker/routes/homework-photo.js docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md CODEX_RESULT.md`
  - 결과:
    - `CODEX_RESULT.md`
    - `apmath/js/classroom.js`
    - `apmath/js/student.js`
    - `apmath/worker-backup/worker/routes/homework-photo.js`
    - `apmath/worker-backup/worker/routes/parent-foundation.js`
    - `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `git status --short`
  - 전체 worktree는 작업 전부터 매우 dirty 상태였다. 이번 작업과 무관한 modified 파일이 대량 존재했다.
- `git diff --name-only`
  - 전체 저장소 기준으로도 기존 dirty 파일이 매우 많이 표시됐다.

## 4. 결과 요약

학생 상세에서는 보호자 연락처/수신동의/연락 이력 UI 1차를 운영 가능 수준으로 회수했다. 반 화면에서는 기존 숙제 사진 배정/목록/현황 흐름을 유지한 채, 제출별 파일 목록과 이미지 뷰어를 추가해서 선생님이 파일이 있는 제출 건을 바로 확인할 수 있게 했다.

다만 숙제 사진 영역은 실제 코드 기준 구조 한계가 있다. 학생 제출 페이지는 아직 사진 업로드 UI가 아니라 완료 상태 제출 화면이고, backend에도 확인 처리 필드/API가 없다. 그래서 이번 턴은 조회/뷰어까지 완료했고, 실제 학생 사진 업로드 흐름과 확인 완료 처리 정책은 별도 단계가 필요하다.

## 5. 다음 조치

- 브라우저에서 학생 상세 `상담기록` 탭을 열어 보호자 연락처 추가/수정/삭제, 수신동의 변경, 연락 이력 빈 상태/기록 상태를 직접 확인하면 된다.
- 반 화면에서 `숙제` → `기존 숙제 보기` → `현황`으로 들어가 제출별 `사진` 버튼과 이미지 뷰어를 직접 확인하면 된다.
- 실제 `homework_photo_files` 데이터가 없는 환경이면 `사진` 버튼이 나타나지 않을 수 있다. 이 경우 학생 업로드 단계 보강이 별도 필요하다.
- 숙제 사진 확인 처리까지 운영에 필요하면 DB/route에 확인 필드와 PATCH API를 추가하는 별도 작업이 필요하다.
- 배포, 운영 API smoke, `git add`, `git commit`, `git push`는 이번 지시 범위 밖이라 실행하지 않았다.
