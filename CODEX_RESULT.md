# APMS 시간표 담당 변경 동기화 검증/수정 라운드

## 1. 최종 판정

- 판정: PASS
- 시간표 version class 기반 활성화에서 기존 `teacher_classes` 담당 매핑 삭제가 누락되어 있었고, 최소 수정으로 보완했다.
- 기본 테스트와 smoke-api 모두 PASS.
- 브라우저 수동 확인 및 실제 Cloudflare/D1 운영 데이터 확인은 수행하지 않았으므로 운영 데이터 실측은 WARN으로 남긴다.

## 2. 현재 구조 조사 결과

- 시간표 편집 화면은 `apmath/js/timetable.js`에서 draft/version class를 렌더링한다.
- draft 반 추가/배치 흐름은 담당 선생님 입력값을 `teacher_name`으로 전송한다.
- Worker route는 `apmath/worker-backup/worker/routes/timetable-versions.js`에서 시간표 version class 구조를 관리한다.
- 선생님 권한/담당반 기준은 `teacher_classes`이며, `getAllowedClassIds()`가 이 테이블을 조회한다.
- 선생님 대시보드는 active class만 모은 뒤 `isClassVisibleForCurrentTeacher()`로 현재 선생님 담당반을 필터링한다.

## 3. 시간표 담당 변경값 저장 위치

- version class 담당 스냅샷: `timetable_version_classes.teacher_name_snapshot`
- 프론트 draft class 호환 필드: `teacher_name`
- 활성화된 class 담당 필드: `classes.teacher_name`
- 슬롯 테이블 `timetable_version_slots`는 배치/시간 정보 중심이며 담당 변경의 source of truth가 아니다.

## 4. 활성화 시 classes.teacher_name 반영 여부

- class-based 활성화 경로는 새 active class를 만들 때 `teacher_name`에 `vc.teacher_name_snapshot`을 저장한다.
- 따라서 활성화 후 실제 active class 기준 `classes.teacher_name`은 version class 담당 스냅샷을 따른다.

## 5. 활성화 시 teacher_classes 기존 담당 제거 여부

- 기존 코드: FAIL. 신규 담당 INSERT만 있고 기존 source/applied class id의 stale mapping 삭제가 없었다.
- 수정 후: PASS. class-based 활성화 batch 안에서 source class id와 새 applied class id의 기존 `teacher_classes`를 먼저 삭제한다.
- legacy 활성화 경로의 `buildTeacherClassMappingStmts()`도 class id 기준 기존 매핑 삭제 후 현재 `classes.teacher_name` 기준으로 INSERT하도록 보강했다.

## 6. 활성화 시 teacher_classes 신규 담당 추가 여부

- PASS. `findTeacherByAlias(env, vc.teacher_name_snapshot)` 또는 `findTeacherByAlias(env, cls.teacher_name)`로 기존 alias 매칭을 재사용한다.
- teacher_name이 비어 있거나 매칭 teacher가 없으면 신규 mapping을 만들지 않는다.

## 7. 선생님 대시보드 담당반 갱신 여부

- PASS(코드 기준). Worker initial data/permission helper는 `teacher_classes`를 기준으로 선생님 담당 class id를 제한한다.
- `dashboard-teacher.js`는 active class만 대상으로 현재 선생님 표시 가능 여부를 필터링한다.
- 이번 수정으로 기존 담당의 stale `teacher_classes` 매핑이 제거되어 refresh/loadData 후 이전 담당에게 해당 반이 계속 보이는 위험을 줄였다.

## 8. 발견한 버그

- 시간표 version class 활성화에서 신규 담당 매핑은 추가하지만 기존 담당 매핑을 삭제하지 않았다.
- 결과적으로 `teacher_classes`에 이전 담당과 신규 담당이 동시에 남을 수 있었다.

## 9. 수정한 파일

- `apmath/worker-backup/worker/routes/timetable-versions.js`
  - class-based 활성화 batch에 `teacher_classes` 삭제를 추가.
  - legacy 활성화 mapping builder에 `teacher_classes` 삭제 후 insert 순서를 추가.
- `tests/apmath-timetable-teacher-class-sync.test.js`
  - 담당 매핑 삭제/삽입 순서, source/applied class 정리, alias 매칭 재사용, 선생님 대시보드 필터 기준 계약 테스트 추가.
- `CODEX_RESULT.md`
  - 이번 라운드 결과 갱신.

## 10. 수정하지 않은 파일과 이유

- `apmath/js/timetable.js`: 기존 시간표 UI/데이터 전송 구조로 `teacher_name`이 version class snapshot에 저장되어 있어 수정 불필요.
- `apmath/js/core.js`: 담당 동기화 버그의 원인이 아니므로 수정하지 않음.
- `apmath/js/dashboard-teacher.js`: 이미 active class와 현재 선생님 표시 가능 여부 기준으로 필터링하므로 수정하지 않음.
- `apmath/js/dashboard-admin.js`: 신규 안내 문구/UI 추가 금지 원칙에 따라 수정하지 않음.
- `apmath/worker-backup/worker/routes/classes.js`: 개별 class PATCH/POST는 이미 `DELETE FROM teacher_classes WHERE class_id = ?` 후 insert 구조라 수정하지 않음.
- `apmath/worker-backup/worker/routes/teachers.js`: 선생님 생성/관리 기능 수정 금지에 따라 수정하지 않음.
- EIE/Archive 파일: 이번 APMS 라운드 범위 밖이라 수정하지 않음.

## 11. 추가/수정한 테스트

- 추가: `tests/apmath-timetable-teacher-class-sync.test.js`
- 개별 실행: `node tests/apmath-timetable-teacher-class-sync.test.js`
- 결과: PASS

## 12. node tools/run-tests.js 결과

- 실행 명령: `node tools/run-tests.js`
- 결과: PASS
- 상세: `PASS 66 / FAIL 0 / KNOWN-FAIL 0 (total 66)`
- quarantined 6개는 기본 설정대로 skip.

## 13. node tools/smoke-api.mjs 결과

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

## 14. 남은 위험/WARN

- 실제 브라우저 수동 확인은 수행하지 않았다.
- 실제 Cloudflare/D1 운영 데이터로 담당 변경 activation을 실행 확인하지 않았다.
- class-based 활성화 구조는 source class를 갱신하기보다 새 applied class를 active로 만들고 source class를 inactive 처리한다. 따라서 운영 확인 시 active class 기준으로 검증해야 한다.
- 리뷰봇 B/C/D는 도구 정책상 사용자가 명시적으로 sub-agent를 요청한 경우에만 spawn 가능해서 UNVERIFIED.

## 15. 다음 액션

- 운영/스테이징 D1에서 시간표 draft의 `teacher_name_snapshot` 변경 후 활성화하고, active class 기준 `classes.teacher_name`과 `teacher_classes`를 직접 확인한다.
- 브라우저에서 기존 담당/신규 담당 각각 로그인 후 담당반 갱신을 수동 확인한다.

## 16. stage/commit/push 여부

- Stage: Yes
- Commit: Yes
- Push: No

## 17. commit message

- `fix: sync timetable teacher ownership on activation`
