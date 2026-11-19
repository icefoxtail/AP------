# TIMETABLE_DOMAIN

## A. 정책

- 운영 데이터와 새학기 개편안 staging 데이터를 분리한다.
- 운영 `classes`, `class_students`, `class_time_slots`, `student_enrollments`를 draft 작업으로 직접 훼손하지 않는다.
- `timetable_version_classes`, `version_class_id`, student assignments 방향을 우선한다.
- 시간 미정과 구분 라벨은 분리한다.
- 기본 view 버튼을 과다 노출하지 않는다.
- 중등 90분, 고등 120분 기준과 conflict 예외 기준을 보존한다.
- 학생 배정/이동 등 시간표 반 선택 드롭다운 option/확인 UI의 반 표시명은 중복 반명 방지를 위해 `반명 · 담당 · 요일/교시/시간` 기준으로 보강하되, DB 반명과 저장 id는 변경하지 않는다.
- 학생 추가/수정 등 공통 class select option 표시명은 `core.js`의 class option helper와 같은 기준을 공유하며, 표준 운영 시간대는 표시명에서만 1/2/3교시를 자동 추론한다.

## B. 현재 구현 구조

- frontend: `apmath/js/timetable.js`
- routes: `timetable-versions.js`, `timetable-conflicts.js`, `class-time-slots.js`, `enrollments.js`, `classes.js`
- DB: `class_time_slots`, `timetable_versions`, `timetable_version_slots`, `timetable_conflict_logs`, `timetable_conflict_overrides`, `timetable_version_classes`, `timetable_version_student_assignments`, `timetable_version_new_students`, `timetable_version_apply_logs`
- UI: 중등부/고등부, 전체 보기/내 반 보기 등 기존 문구 확인됨
- 반 표시명: 시간표 반 선택 드롭다운 option, 학생 배정/이동 확인 UI와 충돌 상세는 표시명만 보강하고 `classes.name`, `class_id`, `version_class_id`, `timetable_version_student_assignments` 저장 흐름은 유지한다. 시간표 카드 제목 자체는 변경 대상이 아니다.
- 인쇄: `timetable.js`에서 현재 화면 조건(중등부/고등부, 전체 보기/내 반 보기, 운영/초안)을 기준으로 A4 가로 인쇄 전용 HTML을 생성한다.

## C. 데이터/API 흐름

운영 시간표는 `classes`, `class_time_slots`를 사용하고, draft/version은 `timetable-versions`와 version tables를 사용한다. conflict scan은 route에서 class/time overlap을 계산해 conflict logs/preview를 반환한다.

### C-1. 새학기 개편안 명단 규칙 (2026-11)

이유: 개편안을 며칠에 걸쳐 짜는 동안에도 신입·퇴원이 계속 생기는데, 개편안은 만들 때 운영 명단을 한 번 복사할 뿐이라 낡은 명단으로 적용하면 신입이 어느 반에도 못 들어가고 퇴원생이 되살아났다. DB 스키마는 바꾸지 않고 기존 컬럼에 값만 추가했다(운영 D1 마이그레이션은 수동이라 배포 즉시 깨질 수 있음).

- **반 상태 `removed`** (`timetable_version_classes.status`): 개편안에서 삭제한 반. 운영 반에서 온 반은 행과 슬롯을 남기고 `removed`로만 표시한다(되살리기 가능). 초안에서 새로 만든 반(`source_class_id` 없음)은 행과 슬롯을 지운다. 화면·적용·충돌 확인의 "렌더 가능 반"에서는 `excluded`·`graduating_excluded`와 함께 제외한다. 삭제된 반의 학생은 미배정으로 간다.
- **미배정 `excluded_reason='unassigned'`** (`timetable_version_student_assignments`): `class_id`·`version_class_id`는 표식값 `__unassigned__`. `UNIQUE(version_id, student_id)` 때문에 반이 없는 학생도 행을 유지한다. 렌더 목록에는 섞이지 않고 응답 `timetable_version_unassigned_students`로 따로 내려간다. 반에 넣으면(`students/assign`) 정상 배정으로 돌아온다. 적용 시 미배정 학생은 어느 새 반에도 넣지 않고 운영 수강 기록은 기존 로직대로 종료한다(적용을 막지 않음, 응답에 `unassigned_student_count`).
- **현재 명단 자동 갱신(roster sync)**: 개편안(draft/scheduled)을 열 때마다(`GET timetable-versions/{id}`) 서버가 현재 운영 명단과 맞춘다. 멱등이며 순수 함수 `computeRosterDiff`가 계산한다. 퇴원·제적 학생은 개편안에서 빼고, 신입·재등록 학생은 현재 운영 반에 대응하는 개편안 반에(없으면 미배정에) 넣고, 운영에서 반을 옮긴 학생은 **원장이 손대지 않은 경우만**(`memo.note`가 최초 복사/sync 그대로이고 원래 소속 반에 그대로 있을 때) 새 반을 따라간다. 원장이 옮긴 학생·미배정으로 뺀 학생(미배정 행이 있으면 "개편안에 있는 학생")·삭제한 반은 되돌리지 않는다. 그래서 학생 배정/미배정 저장 때 `memo.note`를 `draft student reassigned`/`draft student unassigned`로 바꾼다.
- **운영에서 새로 연 반 가져오기**: 개편안을 만든 뒤 운영에 새로 생긴 활성 반(어떤 개편안 반과도 `source_class_id`가 안 맞는 반)은 sync 때 처음 초안을 만들 때와 같은 규칙(학년 승급 이름, 졸업 대상은 excluded, 현재 `class_time_slots` 복사)으로 반과 슬롯을 가져오고, 그 반 학생은 미배정이 아니라 그 반에 넣는다(손대지 않은 학생은 새 반으로 따라간다). 이유: 안 가져오면 그 반 학생이 개편안의 옛 배치로 되살아나거나 적용에서 빠진다. 원장이 삭제한(`removed`) 반은 source 행이 남아 있어 다시 가져오지 않고, 운영에서 비활성화된 반은 가져오지 않는다. 가져오지 않은 새 운영 반이 있으면 `activate`도 막는다.
- **적용 차단**: `activate`는 적용 직전에 같은 비교를 다시 해서 신입 누락·퇴원생 포함·반 이동 미반영이 있으면 409 `roster_mismatch`와 차이 내용을 돌려주고 적용하지 않는다(안전장치).
- **적용 시 삭제한 반**: `removed` 반의 원래 운영 반도 `is_active=0`, `class_students`·`teacher_classes` 삭제 대상에 넣는다. 안 넣으면 삭제한 반이 운영에 그대로 남는다. 졸업(중3) `excluded` 반은 기존대로 운영에 그대로 둔다(개편안에도 없고 적용 때 닫지도 않음).
- **새로 만들기**: `POST timetable-versions/{id}/restart`는 대상 초안을 `cancelled`로 바꾸고 같은 학년도·적용일·제목의 새 초안을 현재 운영 데이터에서 만든다. 반의 요일·시간은 직전 버전 슬롯이 아니라 현재 운영 `class_time_slots`에서, 학생은 퇴원·제적을 뺀 현재 `class_students`에서 복사한다(`create-next-draft`도 같음).
- 한 학생이 운영에서 두 반 이상 들으면 개편안에는 한 반만 저장된다. 화면 상단에 "두 반 수강 n명" 안내만 띄운다.

## D. 회귀 위험

- draft 작업이 운영 class row를 덮어쓰는 것
- `class_students` 운영 배정을 직접 변경하는 것
- teacher/student/room conflict 기준 약화
- view 버튼 과다 노출
- 시간 미정과 라벨 혼선
- 반 선택 option/확인 UI 표시명 보강이 카드 반명, DB 반명, 배정 payload를 바꾸는 것
- 인쇄 시 화면 DOM/사이드바/필터를 그대로 출력해 A4 가로 폭이 잘리는 것

## E. 추가 계획

staging -> preview -> review -> apply 순서를 문서화하고, apply 후 새 운영 class row 생성 방향을 확정한다. apply/rollback/logging은 별도 검수 후 진행한다.

## F. 작업 후 업데이트 규칙

시간표 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `TIMETABLE_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.
