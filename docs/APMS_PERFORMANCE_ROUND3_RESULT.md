# APMS_PERFORMANCE_ROUND3_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/student/index.html`
- 수정: `apmath/planner/index.html`
- 수정: `apmath/worker-backup/worker/routes/planner.js`
- 생성: `docs/APMS_PERFORMANCE_ROUND3_RESULT.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 시간표 파일 `apmath/js/timetable.js`는 이번 Round에서 수정하지 않았다.
- `apmath/student/index.html`의 학생 포털 홈 데이터에 가벼운 인덱스 캐시를 추가했다.
- 학생 포털의 과제 미제출/제출완료 분리와 배정 자료 필터링이 반복 `filter/sort/find`를 계속 실행하지 않도록 보정했다.
- 학생 포털 OMR 배정 자료 연결 확인에서 시험 목록 전체를 매번 `find`하던 흐름을 `title/date` 기반 인덱스 조회 우선으로 보정했다.
- `apmath/planner/index.html`에 월간 플래너용 메모리 인덱스(`byDate`, `feedbackByDate`, `planDateMap`, 월 이행률 집계)를 추가했다.
- 플래너 날짜별 계획 조회, 피드백 조회, 월 이행률 계산, 달력 점 표시가 같은 배열을 반복 순회하지 않도록 보정했다.
- 플래너 저장/완료토글/삭제 후 매번 월 전체 데이터를 다시 불러오던 흐름을 서버 응답 기반 로컬 갱신 우선으로 변경했다.
- `routes/planner.js`의 계획 생성 응답에 생성된 `plans` 배열을 함께 반환하도록 했다.
- `routes/planner.js`의 계획 수정 응답에 수정된 `plan`을 함께 반환하도록 했다.
- 기존 planner API의 `success`, `count` 응답 구조는 보존했고, 신규 필드는 추가만 했다.
- 학생 포털/플래너 기존 UI 문구, 버튼명, 화면명은 변경하지 않았다.
- Worker route 중 `planner.js`만 보정했고, DB migration은 생성하지 않았다.
- 숙제사진 route는 이번 Round에서 직접 수정하지 않았다. 학생 포털에서 숙제사진 과제 목록 분리 비용만 줄였다.

## 3. 실행 결과

- `node --check apmath/worker-backup/worker/routes/planner.js`: 통과
- `node --check`용 추출 스크립트 `apmath/student/index.html`: 통과
- `node --check`용 추출 스크립트 `apmath/planner/index.html`: 통과

## 4. 결과 요약

Round 3는 학생이 자주 들어가는 학생 포털과 장기 플래너의 체감 속도를 줄이는 작업이다.

기존 서버 데이터 구조와 화면 문구를 유지하면서, 한 번 불러온 데이터를 메모리 인덱스로 재사용하도록 바꿨다. 특히 플래너는 저장/완료/삭제 후 전체 월 데이터를 다시 fetch하지 않고, 서버가 반환한 변경 row 또는 로컬 삭제 반영으로 즉시 화면을 갱신한다.

## 5. 다음 조치

- 검수자는 `apmath/student/index.html`, `apmath/planner/index.html`, `routes/planner.js`의 실제 변경 함수와 캐시 무효화 지점을 확인해야 한다.
- 검수 PASS 후에만 적용/검증/커밋/푸시/배포 명령을 제공한다.
- 브라우저에서는 학생 포털 로그인, 과제 목록, 배정 자료, 플래너 월 이동, 계획 추가, 완료 토글, 삭제를 확인한다.

## 6. 잘못했거나 위험했던 점

- 학생 포털/플래너는 학생 로그인, PIN, 세션 흐름이 민감하므로 인증 흐름을 건드리지 않아야 했다.
- 플래너 로컬 갱신은 stale cache 위험이 있으므로 `setPlannerData`, `upsertPlannerPlans`, `patchPlannerPlan`, `removePlannerPlan`에서 인덱스 무효화를 반드시 함께 처리했다.
- 서버 응답 필드 추가는 기존 응답을 깨뜨리지 않게 `plans`, `plan`을 추가하는 방식으로만 처리했다.
- 숙제사진 route까지 무리하게 고치면 제출/파일/R2 흐름 회귀 위험이 커서 이번 Round에서는 직접 수정하지 않았다.

## 7. 보존해야 할 점

- 학생 포털에서 학생이 시험지를 직접 여는 기능은 만들지 않는다.
- 학생 포털은 배정 확인과 OMR 입력 연결까지만 유지한다.
- 시험 OMR 제출 완료 후 수정 흐름은 만들지 않는다.
- 플래너 PIN 저장/전달 흐름은 보존한다.
- 기존 문구, 버튼명, 화면명은 임의 변경하지 않는다.
- 시간표/새학기/개편안 로직은 이번 Round에서 건드리지 않는다.
- Worker route의 academy/session 권한 흐름은 임의 변경하지 않는다.
