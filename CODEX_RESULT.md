# APMS 원장님 관리자 마감 라운드

## 1. 최종 판정

- 판정: PASS
- 신규 선생님 생성 동선은 이미 UI/API/Worker route가 연결되어 있음.
- 요청된 미완성 안내 문구는 삭제함.
- 시간표 기반 담당 변경 동기화는 이번 라운드에서 수정하지 않음.
- APMS 기능/UI/Worker 로직 개선, EIE/Archive 수정, 대형 리팩토링은 수행하지 않음.

## 2. 신규 선생님 생성 가능 여부

- 가능 여부: 가능
- 실제 동선:
  - 원장님 관리자 화면에서 선생님 계정 관리 진입
  - `새 선생님 계정` 버튼 클릭
  - 이름, 로그인 ID, 초기 비밀번호, 권한을 입력
  - 생성 버튼 클릭
- 필요한 필드:
  - `name`: 선생님 이름
  - `login_id`: 로그인 ID
  - `password`: 초기 비밀번호, 프론트 기준 4자 이상
  - `role`: `teacher` 또는 `admin`

## 3. 신규 선생님 생성 UI/API/Worker route 확인 결과

- UI 확인:
  - `apmath/js/dashboard-admin.js`
  - `openAdminTeacherAccountManage()`
  - `renderAdminTeacherAccountManage()`
  - `openAdminCreateTeacherModal()`
  - `handleAdminCreateTeacher()`
- 프론트 API 호출:
  - `api.post('teachers', { name, login_id, password, role })`
- Worker route 확인:
  - `apmath/worker-backup/worker/index.js`
  - `teachers` resource가 `handleTeachers`로 라우팅됨.
  - `apmath/worker-backup/worker/routes/teachers.js`
  - `POST /teachers`가 `login_id`, `password`, `name`, `role`을 받아 신규 teacher를 생성함.
- 권한 조건:
  - `isAdminUser(teacher)`가 아니면 401 Unauthorized.
- 중복 로그인 ID:
  - 기존 `login_id`가 있으면 409 응답.

## 4. 삭제한 문구

- 삭제 문구:
  - `반 담당 변경과 담임 일괄 변경은 Worker 구조분리 이후 별도 연결합니다.`
- 대체 문구:
  - 없음.

## 5. 실제 수정 파일 목록

- `apmath/js/dashboard-admin.js`
  - 원장님 운영 메뉴 하단의 미완성 안내 문구 블록만 삭제.
- `CODEX_RESULT.md`
  - 이번 라운드 결과 보고서로 갱신.

## 6. 수정하지 않은 항목

- 시간표 기반 담당 변경 동기화는 이번 라운드에서 수정하지 않음.
- `teacher_classes` 동기화 로직은 수정하지 않음.
- 신규 선생님 생성 기능은 이미 존재하므로 임의 구현하지 않음.
- EIE/Archive 코드는 수정하지 않음.

## 7. 다음 라운드에서 검증할 항목

- 시간표 기반 담당 변경이 `teacher_classes` 및 담당 선생님 표시와 일관되게 동기화되는지 검증.
- 신규 선생님 생성 후 실제 로그인 가능 여부를 운영 계정 흐름에서 브라우저로 확인.
- 생성된 선생님에게 반 배정 후 선생님 대시보드/출석/상담 권한 범위가 기대대로 제한되는지 확인.

## 8. 테스트 결과

- 실행 명령: `node tools/run-tests.js`
- 결과: PASS
- 상세: `PASS 65 / FAIL 0 / KNOWN-FAIL 0 (total 65)`

## 9. smoke-api 결과

- 실행 명령: `node tools/smoke-api.mjs`
- 결과: PASS
- 상세:
  - AP worker reachable: PASS
  - AP CORS origin restricted: PASS
  - AP 404 disclosure safe: PASS
  - EIE worker reachable: PASS
  - EIE CORS origin restricted: PASS
  - EIE 404 disclosure safe: PASS
  - Wangji worker reachable: PASS
  - Wangji CORS origin restricted: PASS
  - Wangji 404 disclosure safe: PASS
  - `SMOKE API PASS`

## 10. Git 처리

- Stage: Yes
- Commit: Yes
- Push: Yes, 보고서 해시 기록 후 수행
- Commit hash: `5708a54d6aa98ff94ec944cff8197b9b9ae6f099`

## 11. 남은 worktree 변경 파일

- 최종 커밋 전 기준:
  - `eie/css/eie-v2-week-card.css`
  - `eie/js/views/eie-timetable.js`
- 위 EIE 변경은 이번 라운드 범위 밖이므로 수정/스테이징/커밋하지 않음.
