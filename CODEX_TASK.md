cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

# AP Math OS — 시간표 버전 UI 2차: 큰 단위 안정화 + 초안 편집 흐름 정리

## 목표

시간표 버전 UI 1차에서 만든 원장모드 초안 시간표 기능을 큰 단위로 안정화한다.

이번 작업은 작은 보정이 아니라, 다음 흐름을 한 번에 점검하고 필요한 보정을 진행한다.

핵심 목표:

1. 원장모드 전체시간표에서 현재 운영 시간표와 초안 시간표가 명확히 분리되도록 안정화한다.
2. 2027년 1월 개편 초안 열기/닫기 흐름을 안정화한다.
3. draft 화면에서 반 카드 드래그 이동 후 화면이 즉시 정확히 갱신되도록 보정한다.
4. draft 화면에서 `timetable_version_slots`만 수정되고, 운영 `class_time_slots`와 `classes.schedule_days/time_label`은 절대 바뀌지 않도록 방어한다.
5. active 화면에서는 기존 반 드래그, 학생 전반, 빈 셀 `+ 반 추가` 흐름이 유지되도록 한다.
6. draft 화면에서는 학생 전반과 빈 셀 `+ 반 추가`가 비활성 또는 비표시 상태로 유지되도록 한다.
7. 시간표 버전 API 실패 응답/빈 응답/네트워크 실패 상황에서 기존 화면과 기존 version cache가 깨지지 않도록 방어한다.
8. 선생님모드에는 시간표 버전 UI, draft 열기, draft 편집, scan-preview가 노출되지 않도록 한다.
9. 브라우저/운영 스모크 테스트는 하지 않는다. 화면 확인은 사용자가 직접 한다.

## 현재 기준 경로

학원 PC 기준 프로젝트 경로:

- `C:\Users\USER\Desktop\AP------`

작업 전 반드시 프로젝트 루트가 위 경로인지 확인한다.

~~~powershell
cd C:\Users\USER\Desktop\AP------
~~~

## 절대 금지

- Worker 수정 금지
- DB/schema/migration 수정 금지
- API route 수정 금지
- 학생 포털 수정 금지
- OMR/시험지 흐름 수정 금지
- 관리자 대시보드 수정 금지
- 학부모/수납/출납/상담/숙제/리포트 기능 수정 금지
- archive 변경 금지
- 시험지/기출 파일 변경 금지
- 고등부 반 드래그 구현 금지
- 완전 자동 적용 구현 금지
- 운영 시간표 apply/activate 구현 금지
- 1월 자동 반영 구현 금지
- 학생 일괄 승급 실제 적용 금지
- 새 중1반 draft class 생성 구현 금지
- draft class snapshot 구현 금지
- draft student move snapshot 구현 금지
- 학부모 공지 자동 발송 금지
- 수납/청구 연동 금지
- 브라우저 스모크 테스트 금지
- 운영 API 스모크 테스트 금지
- git add/commit/push 금지
- wrangler deploy 금지
- 기존 문구/버튼명/화면명 임의 변경 금지
- 작업 범위 밖 파일 정리 금지
- dirty worktree 정리 금지

## 수정 대상

기본 수정 대상:

- `apmath/js/timetable.js`

필요할 때만 최소 수정 허용:

- `apmath/js/core.js`

단, `core.js`를 수정해야 하면 반드시 CODEX_RESULT.md에 이유를 기록한다.

확인만 가능한 파일:

- `apmath/worker-backup/worker/routes/timetable-versions.js`
- `apmath/worker-backup/worker/routes/class-time-slots.js`
- `apmath/worker-backup/worker/routes/timetable-conflicts.js`
- `apmath/worker-backup/worker/index.js`

## 작업 전 확인

먼저 실행한다.

~~~powershell
cd C:\Users\USER\Desktop\AP------
git status --short
~~~

주의:

- 현재 worktree는 이미 매우 dirty일 수 있다.
- 이번 작업과 무관한 archive/docs/worker/rules 파일은 건드리지 않는다.
- 이번 작업 diff는 가능하면 `apmath/js/timetable.js`, `CODEX_RESULT.md`만 생기게 한다.
- `apmath/js/core.js`는 작업 전부터 modified일 수 있으나, 이번 작업에서 추가 수정하지 않으면 “이번 턴 수정 없음”으로 기록한다.

## 큰 작업 범위 1. 시간표 버전 상태 구조 점검/보강

`apmath/js/timetable.js`에서 아래 상태 흐름을 점검한다.

필수 상태:

~~~js
state.ui.timetableVersions
state.ui.activeTimetableVersion
state.ui.draftTimetableVersions
state.ui.timetableViewMode
state.ui.selectedTimetableVersionId
state.ui.selectedTimetableVersion
state.ui.selectedTimetableVersionSlots
state.ui.timetableDraftPreviewResult
state.ui.timetableVersionsLoadFailedAt
state.ui.timetableVersionsLoadError
~~~

확인/보정 기준:

- `ensureTimetableVersionUiState()`에서 위 상태가 안전하게 초기화되어야 한다.
- 기존 `state.ui`의 다른 필드를 덮어쓰면 안 된다.
- `timetableViewMode` 기본값은 `active`여야 한다.
- `selectedTimetableVersionSlots`는 항상 배열이어야 한다.
- 실패 상태 필드는 기본값이 있어야 한다.
- 선생님모드에서는 version 상태가 있어도 UI가 노출되지 않아야 한다.

## 큰 작업 범위 2. timetable versions 로드 안정화

아래 함수 흐름을 점검하고 보강한다.

- `loadTimetableVersionsForView(options)`
- `ensureTimetableVersionsLoaded()`

필수 조건:

1. `GET /api/timetable-versions` 정상 응답일 때만 성공 처리한다.
2. `res = {}`는 실패 처리한다.
3. `res.success === false`는 실패 처리한다.
4. `res.timetable_versions`가 배열이 아니면 실패 처리한다.
5. 실패 시 기존 `ui.timetableVersions`를 빈 배열로 덮어쓰지 않는다.
6. 실패 시 `ui.timetableVersionsLoaded = true`로 만들지 않는다.
7. 실패 시 `renderTimetable()`를 다시 호출하지 않는다.
8. 성공 시에만 `renderTimetable()`를 다시 호출한다.
9. 실패 후 60초 자동 재시도 쿨다운을 유지한다.
10. `loadTimetableVersionsForView({ force: true })`는 쿨다운과 관계없이 재시도 가능해야 한다.
11. 동시 호출 중이면 기존 promise를 반환해야 한다.

정상 응답 검사 기준:

~~~js
if (!res || res.success === false || !Array.isArray(res.timetable_versions)) {
    throw new Error((res && res.error) || 'timetable versions load failed');
}
~~~

이미 적용되어 있으면 유지한다.

## 큰 작업 범위 3. 원장모드 상단 UI 안정화

`buildTimetableVersionBannerHtml()` 흐름을 점검/보강한다.

원장모드 active 화면에서 표시:

- 현재 운영 시간표 연도
- draft/scheduled가 있으면 가장 빠른 draft/scheduled 초안 열기 버튼
- 12월이고 다음 해 draft/scheduled가 없으면 다음 해 1월 개편 초안 만들기 버튼
- effective_from이 오늘 이하인 draft/scheduled가 있으면 적용 예정일 지난 초안 안내

draft 화면에서 표시:

- 초안 제목
- 상태
- 적용 예정일
- 운영 시간표로 돌아가기
- 충돌 확인
- 충돌 확인 결과가 있으면 결과 표시

보존할 신규 문구:

~~~text
현재 운영 시간표
년 1월 개편 초안 열기
다음 해 1월 개편 초안 만들기
운영 시간표로 돌아가기
충돌 확인
충돌 확인 결과
학생 충돌
선생님 확인
교실 확인
확인 필요
적용 예정일이 지난 시간표 초안이 있습니다. 내용을 확인한 뒤 운영 시간표 적용 작업을 진행해주세요.
~~~

주의:

- 기존 탭 문구 `중등부`, `고등부`, `전체 보기`, `내 반 보기`는 바꾸지 않는다.
- 기존 시간표 제목 문구는 바꾸지 않는다.
- UI를 새로 예쁘게 갈아엎지 않는다.
- 인라인 스타일 구조를 유지해도 된다. 대규모 CSS 리팩터링 금지.

## 큰 작업 범위 4. draft 열기/닫기 안정화

아래 함수 흐름을 점검/보강한다.

- `openTimetableDraftVersion(versionId)`
- `returnToActiveTimetableView()`
- `window.ttOpenDraftVersion`
- `window.ttReturnActiveView`

draft 열기 기준:

- admin/원장모드에서만 동작
- versionId 없으면 조용히 종료
- `GET /api/timetable-versions/:id` 응답이 실패면 상태를 바꾸지 않음
- `res.success === false`면 상태를 바꾸지 않음
- `res.timetable_version` 없으면 상태를 바꾸지 않음
- `res.timetable_version_slots`가 배열이 아니면 빈 배열로 처리하되, version 객체가 정상일 때만 draft 진입
- draft 진입 시:
  - `timetableViewMode = 'draft'`
  - `selectedTimetableVersionId = version.id`
  - `selectedTimetableVersion = version`
  - `selectedTimetableVersionSlots = slots`
  - `timetableDraftPreviewResult = null`
  - `renderTimetable()`

운영 시간표 복귀 기준:

- `timetableViewMode = 'active'`
- `selectedTimetableVersionId = null`
- `selectedTimetableVersion = null`
- `selectedTimetableVersionSlots = []`
- `timetableDraftPreviewResult = null`
- `renderTimetable()`

금지:

- active로 돌아갈 때 `class_time_slots` 재로드를 강제로 하지 않는다.
- active로 돌아갈 때 운영 데이터를 바꾸지 않는다.

## 큰 작업 범위 5. active/draft 렌더링 기준 분리 점검

아래 함수 흐름을 점검/보강한다.

- `isTimetableDraftMode()`
- `isTimetableDraftSection(section)`
- `getTimetableDraftSlotRows(classId)`
- `getTimetableClassSlots(classId)`
- `getTimetableClassSlotRows(classId)`
- `getTimetablePlacementRows(cls)`
- `_renderMiddleGrid(sClasses, wrapper, visibleTeachers)`
- `_renderHighGrid(sClasses, wrapper, visibleTeachers)`

필수 기준:

active 화면:

- 기존 `class_time_slots` 우선
- 없으면 기존 `classes.schedule_days/time_label` fallback 허용
- 학생 전반 유지
- 빈 셀 `+ 반 추가` 유지
- 중등부 반 카드 드래그 유지
- 고등부 반 드래그는 계속 금지

draft 화면:

- 중등부 위치는 `selectedTimetableVersionSlots` 기준
- draft 화면에서 `class_time_slots`를 위치 기준으로 사용하지 않음
- draft 화면에서 `classes.schedule_days/time_label` fallback 금지
- draft slots가 없으면 비어 있는 초안으로 표시
- class/student 표시 정보는 기존 classes/students 데이터를 사용해도 됨
- draft class snapshot 구현하지 않음
- draft 학생 snapshot 구현하지 않음
- draft 화면에서 학생 전반 비활성
- draft 화면에서 빈 셀 `+ 반 추가` 비표시
- draft 화면에서도 반 카드 드래그는 중등부만 허용
- 고등부 반 드래그는 계속 금지

주의:

- `getTimetableSectionForClass(cls)`는 기존 grade/name 기준을 유지한다.
- 고등부 렌더링은 이번 작업에서 확장하지 않는다.
- draft 모드가 고등부 탭에 들어가더라도 고등부 반 이동은 금지되어야 한다.

## 큰 작업 범위 6. draft 반 드래그 저장 안정화

아래 함수 흐름을 점검/보강한다.

- `handleTimetableClassCardDragStart(event)`
- `handleTimetableCellDragOver(event)`
- `handleTimetableCellDragLeave(event)`
- `handleTimetableCellDrop(event)`
- `handleTimetableClassDrop(event)`
- `openTimetableClassMoveConfirmModal(ctx)`
- `confirmTimetableClassMove()`
- `buildTimetableSlotsForCell(classId, target)`
- `syncSelectedTimetableVersionSlotsInState(classId, slots)`

active 화면 저장 기준:

- 기존 `POST /api/class-time-slots/replace-class-slots` 사용
- 저장 성공 후 `updateTimetableClassCompat()`
- 저장 성공 후 `syncTimetableClassSlotsInState()`
- 저장 성공 후 `syncTimetableClassCompatInState()`
- 저장 성공 후 `timetable-conflicts/scan`
- 기존 toast 유지

draft 화면 저장 기준:

- 반드시 `POST /api/timetable-versions/:id/slots/replace-class-slots` 사용
- 저장 성공 후 `syncSelectedTimetableVersionSlotsInState()`
- `updateTimetableClassCompat()` 호출 금지
- `syncTimetableClassSlotsInState()` 호출 금지
- `syncTimetableClassCompatInState()` 호출 금지
- `timetable-conflicts/scan` 호출 금지
- `class_time_slots` 수정 금지
- `classes.schedule_days/time_label/day_group/teacher_name` 수정 금지
- 성공 toast는 `초안 시간표가 수정되었습니다.`
- 실패 toast는 `초안 시간표 수정에 실패했습니다.`
- 저장 성공 후 `renderTimetable()`로 draft 위치 즉시 반영

중요 보강:

- draft 모드에서 `ui.selectedTimetableVersionId`가 없으면 저장하지 말고 실패 처리한다.
- draft 저장 응답이 실패면 state를 갱신하지 않는다.
- draft 저장 응답에 `timetable_version_slots`가 없으면 요청한 slots를 fallback으로 써도 되지만, 반드시 version_id를 붙여 state에 반영한다.
- 동일 class_id의 기존 draft slot은 제거하고 새 slot으로 교체해야 한다.
- 다른 class_id의 draft slot은 유지해야 한다.

## 큰 작업 범위 7. draft scan-preview 안정화

아래 함수 흐름을 점검/보강한다.

- `runTimetableDraftScanPreview()`
- `window.ttScanDraftPreview`

기준:

- admin/원장모드 + draft 모드에서만 동작
- selectedTimetableVersionId 없으면 동작하지 않음
- `POST /api/timetable-versions/:id/scan-preview` 호출
- 실패 응답이면 기존 preview 결과를 덮어쓰지 않음
- 정상 응답이면 counts/conflicts 저장
- counts 없으면 `{ student:0, teacher:0, room:0, total:0 }` 기본값
- conflicts 없으면 빈 배열
- student conflict가 있으면 warn toast 가능
- teacher conflict만 있으면 info 성격 유지
- 운영 `timetable_conflict_logs`와 연결하지 않음
- active 화면의 `timetable-conflicts/scan`과 혼동하지 않음

## 큰 작업 범위 8. draft에서 학생 전반 완전 차단

아래 흐름을 점검/보강한다.

- `handleTimetableStudentDragStart(event)`
- `buildTimetableStudentSlot(student, classId)`
- `handleTimetableClassDrop(event)`
- `confirmTimetableStudentTransfer()`

기준:

- draft 모드에서는 학생 이름에 `draggable="true"`가 붙으면 안 된다.
- draft 모드에서 학생 dragstart가 발생해도 preventDefault 후 false 처리
- draft 모드에서 class drop으로 학생 전반 payload가 들어와도 전반 모달 열지 않음
- draft 모드에서 `confirmTimetableStudentTransfer()`가 호출되어도 저장하지 않음
- active 모드 학생 전반은 기존대로 유지

## 큰 작업 범위 9. draft에서 빈 셀 + 반 추가 차단

아래 흐름을 점검/보강한다.

- `buildTimetableAddClassButton(cell)`
- `_renderMiddleGrid()`
- `openTimetableAddClassModal(encodedCell)`
- `confirmTimetableAddClass()`

기준:

- draft 모드에서는 빈 셀에 `+ 반 추가`가 표시되지 않아야 한다.
- draft 모드에서 `openTimetableAddClassModal()`이 직접 호출되어도 동작하지 않도록 방어해도 된다.
- active 모드 빈 셀 `+ 반 추가`는 기존대로 유지
- active 모드에서 반 추가 시 기존 `classes` + `class_time_slots` 흐름 유지
- draft 모드에서 새 중1반 생성 구현 금지

## 큰 작업 범위 10. 선생님모드 비노출 점검

기준:

- teacher/비admin 모드에서 `buildTimetableVersionBannerHtml()`은 빈 문자열 반환
- teacher/비admin 모드에서 `ensureTimetableVersionsLoaded()`가 자동 API 호출하지 않음
- teacher/비admin 모드에서 draft 열기 버튼 없음
- teacher/비admin 모드에서 초안 생성 버튼 없음
- teacher/비admin 모드에서 충돌 확인 버튼 없음
- teacher/비admin 모드에서 반 카드 드래그 이동 불가
- 기존 내 반 보기/전체 보기 흐름은 유지

## 큰 작업 범위 11. 전역 함수 노출 점검

아래 전역 함수가 중복/오타 없이 유지되는지 확인한다.

~~~js
window.ttSetSection
window.ttSetMyOnly
window.ttOpenDraftVersion
window.ttReturnActiveView
window.ttCreateNextDraft
window.ttScanDraftPreview
~~~

기준:

- 기존 `ttSetSection`, `ttSetMyOnly` 동작 유지
- 신규 전역 함수가 없거나 이름이 틀려 버튼 클릭이 깨지면 안 됨
- 함수명 변경 금지

## 큰 작업 범위 12. 방어적 코드 정리

가능하면 아래 정도까지만 정리한다.

허용:

- 중복 조건 최소화
- 실패 응답 방어
- null/undefined 방어
- state 배열 보장
- draft/active 분기 명확화
- console.warn 유지

금지:

- 대규모 리팩터링
- CSS 전면 수정
- UI 재디자인
- 함수명 대규모 변경
- API helper 변경
- core.js 전체 구조 변경
- Worker 변경

## 검증

반드시 실행한다.

~~~powershell
node --check apmath/js/timetable.js
node --check apmath/js/core.js
~~~

diff 확인:

~~~powershell
git diff -- apmath/js/timetable.js
git diff -- apmath/js/core.js
git status --short
~~~

브라우저 스모크 테스트와 운영 API 스모크 테스트는 하지 않는다.

## 사용자 직접 확인 필요 항목

아래 항목은 직접 실행하지 말고 CODEX_RESULT.md에 `사용자 직접 확인 필요`로 기록한다.

원장모드 active:

1. 전체시간표 진입
2. 현재 운영 시간표 상태 표시
3. 2027년 1월 개편 초안 열기 표시
4. active 중등부 기존 시간표 표시
5. active 학생 전반 기존대로 가능
6. active 빈 셀 `+ 반 추가` 기존대로 가능
7. active 반 카드 드래그 기존대로 가능
8. active 고등부 반 드래그 불가

원장모드 draft:

1. 2027년 1월 개편 초안 열기 클릭
2. draft 상단 UI 표시
3. 운영 시간표로 돌아가기 표시
4. 충돌 확인 표시
5. draft 중등부가 `timetable_version_slots` 기준으로 표시
6. draft 반 카드 드래그 가능
7. draft 반 이동 후 `초안 시간표가 수정되었습니다.` 표시
8. draft 반 이동 후 새로고침 없이 위치 반영
9. draft 저장 후 active 운영 시간표로 돌아갔을 때 운영 시간표가 변하지 않았는지
10. draft 학생 전반 비활성
11. draft 빈 셀 `+ 반 추가` 비표시
12. draft 고등부 반 드래그 불가
13. 충돌 확인 결과 표시

선생님모드:

1. 시간표 버전 UI 비표시
2. 초안 열기 비표시
3. 초안 생성 비표시
4. 충돌 확인 비표시
5. draft 편집 불가
6. 기존 전체시간표/내 반 보기 정상

실패 상황:

1. timetable-versions API 실패 시 기존 version cache가 빈 배열로 덮이지 않는지
2. timetable-versions API 실패 시 무한 재렌더되지 않는지
3. draft 열기 실패 시 active 화면 상태가 유지되는지
4. draft 저장 실패 시 draft slots state가 잘못 갱신되지 않는지
5. scan-preview 실패 시 기존 preview 결과가 잘못 덮이지 않는지

## 완료 보고

루트의 `CODEX_RESULT.md`에 저장한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 완료 또는 확인 완료
## 3. 실행 결과
## 4. 결과 요약
## 5. 다음 조치

반드시 포함:

- 수정 파일 목록
- 작업 전 dirty 상태 요약
- `apmath/js/timetable.js` 수정 여부
- `apmath/js/core.js` 수정 여부와 이유
- Worker/DB/schema/migration 수정 없음
- archive 변경 없음
- 시간표 버전 상태 구조 점검/보강 결과
- timetable versions 로드 안정화 결과
- API 실패 응답 처리 결과
- 60초 쿨다운 유지 여부
- `force: true` 재시도 유지 여부
- 원장모드 상단 UI 안정화 결과
- 12월 다음 해 초안 만들기 구조 유지 여부
- effective_from 지난 초안 안내 유지 여부
- draft 열기/닫기 안정화 결과
- active/draft 렌더링 분리 결과
- draft 반 드래그 저장 안정화 결과
- draft 저장 시 `timetable_version_slots`만 수정하는지 여부
- draft 저장 시 `class_time_slots` 수정 금지 보존 여부
- draft 저장 시 `classes.schedule_days/time_label/day_group/teacher_name` 수정 금지 보존 여부
- draft scan-preview 안정화 결과
- draft 학생 전반 차단 결과
- draft 빈 셀 `+ 반 추가` 차단 결과
- active 학생 전반 보존 여부
- active 빈 셀 `+ 반 추가` 보존 여부
- active 반 카드 드래그 보존 여부
- 고등부 반 드래그 금지 유지 여부
- 선생님모드 비노출 결과
- 전역 함수 노출 점검 결과
- node --check 결과
- git diff 확인 결과
- git status --short 결과
- 브라우저/운영 스모크 테스트는 하지 않았고 사용자 직접 확인 필요하다는 점
- 잘못한 점/위험했던 점/보존해야 할 점

## 중단 조건

아래 상황이면 구현을 멈추고 CODEX_RESULT.md에 기록한다.

- `timetable.js`의 active/draft 분리가 현재 구조에서 더 큰 리팩터링 없이는 위험함
- draft slots 기준 렌더링을 보정하면 active 운영 시간표가 깨질 위험이 큼
- draft 반 드래그 저장과 active 반 드래그 저장이 같은 함수에서 안전하게 분리되지 않음
- draft 저장 시 `class_time_slots` 또는 `classes`를 건드리지 않고는 구현이 불가능함
- 선생님모드에 draft UI가 노출될 위험이 큼
- Worker route 수정 없이는 해결이 불가능함
- `core.js` 대규모 수정이 필요해짐
- 작업 범위가 시간표 외 기능으로 번짐

마지막 터미널 출력:

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF