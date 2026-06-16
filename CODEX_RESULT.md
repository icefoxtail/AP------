# APMS 핵심 저장 동선 회귀검수

## 1. 검사 범위

- 목표: APMS 운영 배포본 기준 핵심 저장 기능의 요청, 즉시 반영, 새로고침 후 유지 가능성, 실패 표시 여부를 회귀 점검.
- 새 기능 추가: 없음.
- 디자인 수정: 없음.
- 구조 리팩토링: 없음.
- APMS 외 EIE/Archive 수정: 없음.
- 실제 브라우저 수동 검증: 미수행. 운영 계정/테스트 데이터가 제공되지 않아 운영 DB를 직접 변경하는 인증 브라우저 테스트는 하지 않았다.

## 2. 검사한 저장 동선 목록

| 저장 동선 | 요청 API | 즉시 반영 | 유지 근거 | 실패 표시 | 판정 |
| --- | --- | --- | --- | --- | --- |
| 학생상세 상담 저장/수정/삭제 | `POST/PATCH/DELETE consultations` | 저장 후 상담 재조회 및 상세 탭 재렌더 | Worker DB 저장 후 `consultations` 재조회 경로 존재 | catch/toast 존재 | WARN |
| 학생 기본정보 수정 | `PATCH students/:id` | 응답 merge 후 상세 화면 재렌더 | Worker `students` PATCH 저장 및 initial data 재조회 경로 존재 | catch/toast 존재 | WARN |
| 출석 저장 | `PATCH attendance` | 낙관적 state/row/cell 갱신 | `attendance-history/month` 재조회 경로 존재 | 실패 시 rollback/toast | WARN |
| 숙제 저장 | `PATCH homework` | 낙관적 state/row/cell 갱신 | `attendance-history/month` 재조회 경로 존재 | 실패 시 rollback/toast | WARN |
| 클래스룸 상담 저장 | `POST consultations` | 상담 저장 후 해당 학생 상담 재조회 | 상담 DB 저장 후 재조회 경로 존재 | catch/toast 존재 | WARN |
| 클래스룸 보강 저장 | `PATCH attendance` tags | 보강 칩/출석 셀 즉시 갱신 | 출석 재조회 경로 존재 | 실패 시 rollback/toast | WARN |
| 클래스룸 메모/진도 저장 | `POST class-daily-records` | 성공 후 `loadData()` 및 반 화면 재렌더 | `class_daily_records` 기반 일지/반 화면 재조회 | 이번 라운드에서 실패 표시 보강 | WARN |
| 오늘일지 저장 | `POST daily-journals`, `PATCH daily-journals/:id` | 저장 후 `loadData()` | daily journal DB 저장 후 재조회 | 에러 응답 toast 존재 | WARN |
| 시험성적 입력 저장 | `POST school-exam-records/batch` | 성공 후 `loadData()` 및 성적표 재렌더 | exam record DB 저장 후 재조회 | catch/toast 존재 | WARN |
| 시간표 저장/활성화 | `PATCH/POST timetable-versions/*`, `POST .../activate` | 버전 목록 재조회/시간표 재렌더 | Worker activation batch 및 version/class 재조회 | catch/toast 존재 | WARN |
| 퇴원/복귀/목록숨김 | `DELETE students/:id`, `PATCH students/:id/restore`, `PATCH students/:id/hide` | 응답 merge 또는 `loadData()` 후 목록 갱신 | students 상태 저장 후 재조회 | catch/toast 또는 error toast 존재 | WARN |
| 원장 관리 저장 | `POST/PATCH teachers`, `PATCH daily-journals/:id`, `POST students/batch-pins` | 저장 후 관리 화면/데이터 재조회 | Worker teachers/journals/students 저장 경로 존재 | catch/toast 존재 | WARN |

판정이 WARN인 이유: 코드/API/smoke 기준으로 저장 경로는 확인했지만, 운영 계정으로 실제 데이터를 변경하고 새로고침 유지까지 확인하는 브라우저 검증은 수행하지 못했다.

## 3. 발견한 버그

- 발견: `saveClassRecord`가 `class-daily-records` 저장 실패 응답 또는 네트워크 예외에서 사용자에게 오류를 표시하지 않을 수 있었다.
- 영향: 클래스룸 메모/진도 저장 실패가 조용히 묻힐 가능성.
- 처리: `apmath/js/classroom.js`의 `saveClassRecord`에 실패 응답 toast와 예외 catch/toast를 추가했다.
- 운영 차단 여부: FAIL 성격의 저장 실패 표시 버그였으나, 최소 수정 완료. 단, 현재 기본 테스트가 다른 pre-existing dashboard surface 변경 때문에 실패 중이라 최종은 WARN.

## 4. 수정한 파일

- `apmath/js/classroom.js`
  - `saveClassRecord` 실패 표시 보강만 수행.
- `CODEX_RESULT.md`
  - 이번 회귀검수 결과로 덮어씀.

이번 라운드에서 직접 수정하지 않았지만 최종 worktree에 남아 있는 파일:

- `apmath/css/dashboard-foundation.css`
- `apmath/js/dashboard.js`
- `tests/dashboard-weekly-cleaning.test.js`

메모:

- `apmath/js/dashboard.js`에는 전역 함수 surface 변경이 존재한다.
- 이 변경 때문에 `tests/apmath-global-surface.test.js`가 실패한다.
- `apmath/css/dashboard-foundation.css`는 금지 범위 파일이므로 이번 라운드에서 수정하지 않았다.
- 위 파일들은 사용자/기존 작업 변경 가능성이 있어 되돌리지 않았다.

수정하지 않은 영역:

- `apmath/index.html`
- `apmath/css/*`
- `apmath/worker-backup/worker/*`
- `workers/*`
- EIE 기능/UI 코드
- Archive 엔진/시험지 코드

## 5. 수정하지 않은 이유

- 운영 DB를 직접 변경하는 브라우저 검증은 계정/테스트 데이터가 없어 수행하지 않았다.
- `apmath/js/dashboard.js`, `apmath/css/dashboard-foundation.css`, `tests/dashboard-weekly-cleaning.test.js`의 기존 수정은 이번 저장 동선 버그 수정 범위 밖이고, 사용자 변경을 되돌릴 수 없어 수정하지 않았다.
- Worker 런타임 코드는 smoke-api가 통과했고 이번 저장 실패 표시 버그는 프론트 실패 처리 문제였으므로 수정하지 않았다.

## 6. 테스트 결과

- `node tools/run-tests.js`
  - 실행: bundled Node 사용.
  - 결과: `PASS 63 / FAIL 1 / KNOWN-FAIL 0 (total 64)`
  - 실패: `tests/apmath-global-surface.test.js`
  - 실패 원인: `apmath/js/dashboard.js + dashboard-admin.js + dashboard-teacher.js + dashboard-assistant-memos.js` global function surface가 snapshot과 다름.
  - 추가된 함수로 감지된 항목: `dashboardHoverSourceAttrs`, `getDashboardClassStudentNames`, `renderDashboardHoverPreview`.
  - 저장 동선 수정 파일인 `apmath/js/classroom.js`와 직접 관련 없음.

- `node tools/smoke-api.mjs`
  - 결과: `SMOKE API PASS`
  - AP worker reachable: PASS
  - AP CORS origin restricted: PASS
  - AP 404 disclosure safe: PASS
  - EIE worker reachable: PASS
  - EIE CORS origin restricted: PASS
  - EIE 404 disclosure safe: PASS
  - Wangji worker reachable: PASS
  - Wangji CORS origin restricted: PASS
  - Wangji 404 disclosure safe: PASS

## 7. 실제 운영 차단 여부

- 확정 운영 차단: 없음.
- 수정 완료된 차단 가능 항목:
  - 클래스룸 메모/진도 저장 실패가 조용히 묻힐 수 있던 문제.
- 운영 배포 전 불확정/WARN:
  - 실제 인증 브라우저에서 저장 후 새로고침 유지까지 검증하지 못함.
  - 현재 worktree의 `apmath/js/dashboard.js` pre-existing 변경으로 기본 테스트가 FAIL 1 상태.

## 8. 다음 액션

1. `apmath/js/dashboard.js`의 pre-existing 전역 함수 변경이 의도된 변경인지 확인한다.
2. 의도된 변경이면 `tests/apmath-global-surface.test.js` snapshot/계약을 별도 라운드에서 갱신한다.
3. 의도되지 않은 변경이면 작성자 확인 후 되돌린다.
4. 운영 테스트 계정/샘플 학생을 지정해 실제 브라우저에서 각 저장 동선의 새로고침 유지 여부를 검증한다.
5. dashboard surface 이슈가 정리된 뒤 `node tools/run-tests.js`를 재실행해 FAIL 0을 확인한다.

## 9. 최종 판정

- 최종 판정: WARN
- 사유:
  - 저장 실패 표시 버그 1건은 최소 수정했다.
  - smoke-api는 PASS.
  - 다만 기본 테스트가 pre-existing dashboard surface 변경으로 FAIL 1이고, 운영 브라우저 저장/새로고침 검증이 미수행이다.

## 10. Git 처리

- Stage: No
- Commit: No
- Push: No
- 사유: 사용자가 이번 라운드에서 stage/commit/push를 요청하지 않았고, 기본 테스트가 아직 FAIL 1이다.
