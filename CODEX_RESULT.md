# AP Student Status Normalization Result

## 수정 파일
- apmath/js/core.js
- apmath/js/student.js
- apmath/js/student-edit.js
- apmath/js/dashboard-admin.js
- apmath/js/dashboard.js
- apmath/js/classroom.js
- apmath/js/cumulative.js
- apmath/js/timetable.js
- apmath/js/management.js
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/students.js

## 문제 원인
- AP 학생 퇴원 처리 저장값은 일부 경로에서 `퇴원`, 일부 legacy 경로와 화면 필터는 `제적` 기준으로 동작해 퇴원생 목록, 복귀, 숨김/완전삭제 관리에서 같은 학생을 서로 다르게 판정할 수 있었다.
- 초기 데이터와 학생 API 응답의 status가 화면별 직접 문자열 비교에 그대로 사용되어 기존 DB의 `제적` 값이 `퇴원` 화면에 누락될 수 있었다.

## 핵심 변경
- `normalizeStudentStatus`, `isWithdrawnStudentStatus`, `isHiddenStudentStatus`, `isActiveStudentStatus` 프론트 공통 helper를 추가했다.
- 프론트 학생 목록, 상세, 원장 대시보드, PIN 관리, 학급, 시간표, 누적, 주소록/관리 화면의 재원/퇴원/휴원 판정을 helper 기준으로 변경했다.
- `student-edit.js` 퇴원생 관리가 `제적` legacy와 `퇴원` canonical을 모두 퇴원생으로 표시하도록 변경했다.
- Worker `students.js`에서 `제적`, `withdrawn`, `withdraw` 저장 입력을 `퇴원`으로 정규화하고, `hidden`은 `숨김`, `active`는 `재원`, `paused`는 `휴원`으로 정규화한다.
- 신규 퇴원 저장값은 `퇴원`, 복귀 저장값은 `재원`, 숨김 저장값은 `숨김`으로 유지했다.
- purge 조건은 정규화 후에도 `숨김`만 허용하도록 유지했다.
- `initial-data` 반환의 `students` 및 `timetable_students` status도 legacy alias를 canonical 값으로 정규화했다.
- 사용자 화면의 상태 이력 표시에서 legacy `제적`은 `퇴원`으로 표시되게 했다.

## 검수 결과
- 기존 제적 데이터 호환: `제적`은 helper와 initial-data/API 응답에서 `퇴원`으로 취급되어 퇴원생 목록과 복귀 대상에 포함된다.
- 새 퇴원 처리: `DELETE /students/:id`는 `퇴원`으로 저장한다.
- 복귀 처리: `PATCH /students/:id/restore`는 `재원`으로 저장한다.
- 숨김/purge 조건: `PATCH /students/:id/hide`는 `숨김`으로 저장하고, purge는 숨김 상태만 허용한다.
- 재원 목록: `재원` 및 `active` alias만 재원 판정하며 `퇴원/제적`은 재원 목록에서 제외된다.
- 퇴원생 목록: `퇴원`, legacy `제적`, `withdrawn`, `withdraw`가 퇴원생으로 판정된다.
- 학급/시간표/성적 화면: 주요 학생 목록 필터를 helper 기준으로 변경했다.
- node --check: 수정한 JS/Worker 파일 모두 통과.
- git diff --check: 통과. CRLF 안내 경고만 표시됨.

## 수정하지 않은 항목
- 학급 hard delete
- Archive engine script allowlist
- EIE
- Archive
- Student Portal
- DB 대형 변경

## 남은 위험
- 실제 운영 DB에 어떤 legacy status 값이 있는지는 운영 데이터 확인 필요
- `inactive`는 이번 정책대로 자동 추정하지 않았으며, 기존 시간표 전용 최근 퇴원 판정 로직에서만 기존 호환성을 유지한다.
