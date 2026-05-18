# CODEX_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/timetable.js`
- 수정: `apmath/worker-backup/worker/routes/classes.js`
- 수정: `apmath/worker-backup/worker/routes/class-time-slots.js`
- 확인만 함: `apmath/js/core.js`
- 확인만 함: `apmath/worker-backup/worker/index.js`
- 확인만 함: `apmath/worker-backup/worker/routes/timetable-conflicts.js`

## 2. 구현 완료 또는 확인 완료

- 전체시간표 중등부 렌더링을 `class_time_slots` 우선 기준으로 전환했다.
- `class_time_slots`가 없는 반은 기존 `classes.schedule_days`, `classes.time_label`, `teacher_name` 기준 fallback을 유지했다.
- 고등부 위치는 기존처럼 학년/선생님 기준을 유지했고, 시간 메타만 `class_time_slots`가 있으면 우선 표시하도록 했다.
- 원장모드에서 중등부 반 카드에 `draggable="true"`와 class-card 전용 drag payload를 추가했다.
- 학생 drag payload와 반 카드 drag payload를 `drag_type: 'class-card'`로 분리했다.
- 중등 시간표 셀을 drop target으로 만들고, 반 카드 drop 시 `반 시간표 이동 확인` 모달을 띄우도록 했다.
- `이동하기` 저장 시 `POST /api/class-time-slots/replace-class-slots`로 해당 반의 slots만 교체한다.
- 중등 월수금 drop은 `mon/wed/fri`, 화목금 drop은 `tue/thu/fri` slots를 생성한다.
- 중등 교시별 저장 시간은 `16:50~18:20`, `18:30~20:00`, `20:00~21:30`으로 저장한다.
- 반 이동 후 가능하면 `classes.schedule_days/day_group/time_label/teacher_name`도 PATCH로 동기화한다.
- 저장 후 `POST /api/timetable-conflicts/scan`을 호출한다.
- 원장모드 빈 중등 셀에 `+ 반 추가` 버튼을 표시한다.
- `+ 반 추가` 모달은 셀 기준 담당 선생님, 요일 그룹, 교시를 기본값으로 사용하고, 학년은 중1 기본 선택으로 제공한다.
- 새 반 저장은 `POST /api/classes` 후 `POST /api/class-time-slots/replace-class-slots` 순서로 처리한다.
- `classes.js`는 timetable 셀 생성 플래그(`timetable_cell_create`)가 있는 요청을 admin only로 막는다.
- `class-time-slots.js`의 replace subpath는 admin only이며, 지정 class_id 외 row는 건드리지 않는다.
- 기존 학생 드래그 전반 흐름은 보존했다. 기존 학생 전반 state 갱신 보정 변경도 유지했다.
- 기존 관리자 대시보드는 수정하지 않았다.
- DB/schema/migration은 수정하지 않았다.
- archive 파일은 수정하지 않았다.

## 3. 실행 결과

- `node --check apmath/js/timetable.js`: 통과
- `node --check apmath/js/core.js`: 통과
- `node --check apmath/worker-backup/worker/routes/classes.js`: 통과
- `node --check apmath/worker-backup/worker/routes/class-time-slots.js`: 통과
- `node --check apmath/worker-backup/worker/routes/timetable-conflicts.js`: 통과
- `node --check apmath/worker-backup/worker/index.js`: 통과
- `git diff -- apmath/worker-backup/worker/routes/timetable-conflicts.js`: 변경 없음
- `git diff -- apmath/worker-backup/worker/index.js`: 변경 없음
- 브라우저 확인: 로컬 서버는 `http://127.0.0.1:5180/`에서 200 응답했지만, Codex 인앱 브라우저가 localhost와 file URL 접근을 보안 정책으로 차단했다. 사용자 직접 확인 필요.

## 4. 결과 요약

- 렌더링 기준 변경: 완료
- `class_time_slots` 우선 적용: 완료
- fallback 유지: 완료
- 반 카드 drag 구현: 중등부 완료, 고등부 비활성
- 시간표 셀 drop 구현: 중등부 완료
- 빈 셀 `+ 반 추가` 구현: 중등부 원장모드 완료
- 반 이동 저장 방식: `class-time-slots/replace-class-slots`로 해당 class_id slots 전체 교체
- 새 반 생성 저장 방식: `classes` 생성 후 `class_time_slots` 생성
- `classes.schedule_days/time_label` 동기화: 반 이동/반 추가 시 중등부 기준으로 동기화
- `timetable-conflicts/scan` 호출: 반 이동/반 추가 저장 후 호출
- 원장모드만 허용: 프론트 표시/동작 제한 및 replace API admin only 적용
- 선생님모드 비활성 확인: 코드상 반 카드 drag와 빈 셀 버튼은 admin role에서만 활성화
- 기존 문구/버튼명/화면명 임의 변경: 기존 문구는 유지하고, 요청된 새 모달/버튼 문구만 추가
- 관리자 대시보드 수정: 없음
- DB/schema/migration 수정: 없음
- archive 변경: 이번 작업에서 없음

## 5. 다음 조치

- 실제 로그인된 원장모드에서 중등부 반 카드 이동, 취소, 이동하기, 새로고침 후 유지 여부를 수동 확인해야 한다.
- 실제 로그인된 원장모드에서 빈 셀 `+ 반 추가` 후 생성 반이 해당 셀에 표시되는지 수동 확인해야 한다.
- 실제 선생님모드에서 반 카드 drag 비활성, 빈 셀 `+ 반 추가` 비표시를 수동 확인해야 한다.
- 고등부 반 위치 이동 저장 기준은 이번 작업에서 비활성 처리했다. 별도 설계가 필요하다.
- 중등 반이 서로 다른 교시/그룹의 `class_time_slots`를 동시에 가진 경우 첫 placement만 표시한다. 이 경우 `state.ui.timetablePlacementWarnings`에 기록되지만, 별도 UI 표시는 하지 않았다.
- `classes` 생성 성공 후 `class_time_slots` 생성이 실패하면 class row가 남을 수 있다. 기존 API만 사용한 순차 저장의 구조적 위험이다.
- `git status --short` 결과에는 이번 보고서와 수정 3개 파일 외 archive 쪽 untracked 항목이 보인다. archive 항목은 이번 작업에서 생성/수정하지 않았고 그대로 두었다.

잘못한 점/위험했던 점/보존해야 할 점:

- `core.js`가 `class_time_slots`를 state에 직접 담지 않아 `timetable.js`에서 기존 GET API로 보충 로드하도록 처리했다.
- 반 카드에 draggable을 추가하면서 학생 drag와 충돌할 수 있어 payload를 분리하고, 학생 이름 dragstart에서는 기존 흐름을 유지했다.
- 반 카드 위에 drop하면 카드의 기존 학생 drop handler가 먼저 받을 수 있어, class-card payload는 부모 셀 이동 처리로 넘기도록 보강했다.
- 고등부는 위치 기준이 학년/선생님 중심이라 무리하게 저장 구현하지 않고 비활성으로 보존했다.

git status --short:

```text
 M apmath/js/timetable.js
 M apmath/worker-backup/worker/routes/class-time-slots.js
 M apmath/worker-backup/worker/routes/classes.js
 M CODEX_RESULT.md
?? archive/assets/images/22_연향중_1학기_기말_중3_기출/
?? archive/exams/original/middle/m3/1final/22_연향중_1학기_기말_중3_기출c.js
```
