# CODEX_RESULT

## 1. 작업 파일

- 수정: `CODEX_RESULT.md`
- 이번 턴 추가 수정 없음: `apmath/js/timetable.js`
- 이번 턴 추가 수정 없음: `apmath/js/core.js`

작업 전 상태 기록:

- `git status --short` 기준 worktree는 작업 전부터 매우 dirty 상태였다.
- `apmath/js/timetable.js`, `apmath/js/core.js`, `CODEX_RESULT.md`는 작업 전부터 이미 modified 상태였다.
- `CODEX_TASK.md`, `docs/UPDATE_SUMMARY.md`는 untracked 상태였다.
- archive/docs/worker/rules 포함 대량 modified 상태는 이번 작업과 무관하여 건드리지 않았다.

수정 금지 범위 확인:

- Worker 수정 없음
- DB/schema/migration 수정 없음
- API route 수정 없음
- archive 변경 없음
- 학생 포털/OMR/대시보드/기타 범위 밖 기능 수정 없음

`apmath/js/core.js` 기록:

- 이번 턴에서 `apmath/js/core.js`는 수정하지 않았다.
- 이유: 이번 지시서 항목은 현재 `apmath/js/timetable.js` 구현 상태 재검증만으로 충족되었고, `core.js` 추가 보정이 필요한 근거를 찾지 못했다.

## 2. 지시서 재실행 결과

이번 턴은 프로젝트 루트의 `CODEX_TASK.md`를 다시 열어 처음부터 끝까지 읽고, 그 순서에 맞춰 아래를 재실행했다.

1. 프로젝트 루트 재확인
2. `git status --short` 실행
3. `apmath/js/timetable.js`의 상태 구조/로드 안정화/UI 흐름/드래그 저장 분기/비활성 조건을 처음부터 재점검
4. `CODEX_RESULT.md` 최신화
5. 문법 검사/차이점 확인/상태 확인 재실행

## 3. 구현 상태 점검 결과

상태 구조:

- `ensureTimetableVersionUiState()`에서 아래 상태가 안전하게 초기화되는 것을 재확인했다.
  - `state.ui.timetableVersions`
  - `state.ui.activeTimetableVersion`
  - `state.ui.draftTimetableVersions`
  - `state.ui.timetableViewMode`
  - `state.ui.selectedTimetableVersionId`
  - `state.ui.selectedTimetableVersion`
  - `state.ui.selectedTimetableVersionSlots`
  - `state.ui.timetableDraftPreviewResult`
  - `state.ui.timetableVersionsLoadFailedAt`
  - `state.ui.timetableVersionsLoadError`
- `timetableViewMode` 기본값은 `active`다.
- `selectedTimetableVersionSlots`는 항상 배열로 보정된다.
- `state.ui`의 다른 필드를 덮어쓰는 구조는 보이지 않았다.

버전 로드 안정화:

- `loadTimetableVersionsForView(options)`는 아래 응답만 성공 처리한다.

```js
if (!res || res.success === false || !Array.isArray(res.timetable_versions)) {
    throw new Error((res && res.error) || 'timetable versions load failed');
}
```

- 따라서 `res = {}` 는 실패 처리된다.
- `res.success === false` 는 실패 처리된다.
- `res.timetable_versions`가 배열이 아니면 실패 처리된다.
- 실패 시 기존 `ui.timetableVersions`를 빈 배열로 덮어쓰지 않는다.
- 실패 시 `ui.timetableVersionsLoaded = true`로 만들지 않는다.
- 실패 시 `renderTimetable()`를 다시 호출하지 않는다.
- 성공 시에만 `renderTimetable()`를 다시 호출한다.
- 실패 후 60초 자동 재시도 쿨다운이 유지된다.
- `loadTimetableVersionsForView({ force: true })` 흐름은 보존되어 있다.
- 동시 호출 중에는 기존 `ui.timetableVersionsLoading` promise를 반환한다.

상단 UI:

- `buildTimetableVersionBannerHtml()`가 원장모드에서만 렌더된다.
- active 화면에서 다음 항목을 유지한다.
  - 현재 운영 시간표 연도
  - 가장 빠른 draft/scheduled 초안 열기
  - 12월 다음 해 초안 생성 버튼
  - `effective_from` 경과 초안 안내
- draft 화면에서 다음 항목을 유지한다.
  - 초안 제목
  - 상태
  - 적용 예정일
  - 운영 시간표로 돌아가기
  - 충돌 확인
  - 충돌 확인 결과

draft 열기/닫기:

- `openTimetableDraftVersion(versionId)`는 admin 전용이다.
- `versionId` 없으면 종료한다.
- 상세 API 응답 실패 시 상태를 바꾸지 않는다.
- `timetable_version`이 있으면 draft 진입하고, `timetable_version_slots`가 배열이 아니면 빈 배열로 처리한다.
- `returnToActiveTimetableView()`는 active 복귀 시 선택 초안 상태와 preview 결과를 비우고 재렌더한다.
- active 복귀 시 `class_time_slots` 강제 재로드는 하지 않는다.

active/draft 렌더링 분리:

- draft 중등부는 `selectedTimetableVersionSlots` 기반으로만 렌더링한다.
- draft 중등부에서 slot이 없으면 `classes.schedule_days/time_label` fallback을 쓰지 않고 빈 배치로 남긴다.
- active 화면은 기존 `class_time_slots` 우선, 필요 시 기존 fallback을 유지한다.
- 고등부는 기존 드래그 미구현 상태를 유지한다.

draft 반 카드 이동 저장:

- `confirmTimetableClassMove()`는 draft에서 `POST timetable-versions/:id/slots/replace-class-slots`만 호출한다.
- draft 저장 시 `selectedTimetableVersionId`가 없으면 실패 처리한다.
- draft 저장 시 `syncSelectedTimetableVersionSlotsInState()`만 갱신한다.
- draft 저장 시 운영 `class_time_slots`를 갱신하지 않는다.
- draft 저장 시 `classes.schedule_days`, `day_group`, `time_label`, `teacher_name`을 수정하지 않는다.
- draft 저장 시 `timetable-conflicts/scan`을 호출하지 않는다.
- active 저장 시에는 기존 운영 저장 흐름을 유지한다.

draft scan-preview:

- `runTimetableDraftScanPreview()`는 admin + draft + 선택된 version id가 있을 때만 동작한다.
- 실패 응답일 때 기존 preview 결과를 덮어쓰지 않는다.

draft 학생 전반/반 추가 차단:

- draft 화면에서 학생 드래그 시작이 차단된다.
- draft 화면에서 학생 드롭 전반이 차단된다.
- draft 화면에서 `confirmTimetableStudentTransfer()`가 차단된다.
- draft 화면에서는 빈 학생 슬롯 `+`가 나오지 않는다.
- draft 화면에서는 빈 셀 `+ 반 추가` 버튼이 렌더되지 않는다.
- draft 상태에서 `openTimetableAddClassModal()`과 `confirmTimetableAddClass()` 직접 호출도 막혀 있다.

선생님모드 보호:

- 선생님모드에서는 시간표 버전 배너가 렌더되지 않는다.
- 선생님모드에서는 draft 열기/scan-preview UI가 노출되지 않는다.
- 선생님모드에서는 반 드래그/학생 전반/반 추가 진입도 막혀 있다.

전역 함수 확인:

- `window.ttOpenDraftVersion`
- `window.ttReturnActiveView`
- `window.ttCreateNextDraft`
- `window.ttScanDraftPreview`

위 전역 함수 바인딩이 유지되는 것을 재확인했다.

## 4. 이번 턴 소스 수정 여부

- 이번 재실행에서는 `apmath/js/timetable.js`에 추가 패치를 하지 않았다.
- 이유: 지시서가 요구한 큰 단위 안정화 항목을 현재 파일 상태에서 다시 점검했고, 추가 누락 항목을 발견하지 못했다.
- 따라서 이번 턴의 실제 파일 쓰기 작업은 `CODEX_RESULT.md` 갱신만 수행했다.

## 5. 실행 명령과 결과

실행한 명령:

```text
git status --short
node --check apmath/js/timetable.js
node --check apmath/js/core.js
git diff -- apmath/js/timetable.js
git diff -- apmath/js/core.js
git status --short
```

문법 검사 결과:

- `node --check apmath/js/timetable.js` 통과
- `node --check apmath/js/core.js` 통과

diff 확인 결과:

- `git diff -- apmath/js/timetable.js`
  - 이번 턴 신규 패치 없이 기존 시간표 버전 UI 2차 안정화 구현 상태를 재확인했다.
- `git diff -- apmath/js/core.js`
  - 이번 턴 수정 없음
  - 다만 작업 전부터 modified 상태였다.

최종 상태 확인 요약:

- 전체 worktree는 여전히 매우 dirty 상태다.
- 이번 턴 기준 직접 수정 파일은 `CODEX_RESULT.md`다.
- `apmath/js/timetable.js`, `apmath/js/core.js`는 작업 전부터 modified 상태였고, 이번 턴에 추가 수정하지 않았다.
- 금지된 worker/db/schema/migration/archive 영역은 건드리지 않았다.

## 6. 수행하지 않은 항목

- 브라우저 스모크 테스트는 하지 않았다.
- 운영 API 스모크 테스트는 하지 않았다.
- wrangler deploy, git add/commit/push는 하지 않았다.

## 7. 사용자 직접 확인 필요

원장모드:

1. 전체시간표 진입
2. active 상단 버전 배너 표시 확인
3. 2027 draft 열기/복귀 확인
4. draft 중등부 반 카드 이동 후 즉시 재렌더 확인
5. draft 화면에서 학생 전반 비활성 확인
6. draft 화면에서 `+ 반 추가` 비표시 확인
7. active 화면에서 기존 전반/반 추가/반 이동 흐름 유지 확인

실패 상황:

1. timetable-versions API 실패 시 기존 version cache 유지 확인
2. 실패 시 무한 재렌더 미발생 확인
3. 실패 시 기존 운영 시간표 화면 보존 확인

## 8. 남는 리스크

- 현재 저장소가 매우 dirty하므로 `git diff`는 이번 턴 수정만 깔끔하게 분리해서 보이지 않는다.
- 브라우저 실환경 검증은 지시서상 수행하지 않았으므로, 최종 UI 동작 확인은 사용자가 직접 해야 한다.

마지막 터미널 출력:

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```
