# APMS P0 테스트 게이트 복구 라운드

## 1. 최종 판정

- 판정: PASS
- 목표: APMS 최종 완성도 조사에서 나온 P0 테스트 실패만 복구.
- 기능/UI/Worker 코드 수정: 없음.
- 원장님 대시보드 문구 수정: 없음.
- 반 담당/담임 변경 관련 문구 삭제/교체/기능 추가: 없음.
- EIE/Archive 수정: 없음.

## 2. 실패 원인

- 실패 파일: `tests/apmath-global-surface.test.js`
- 실패 내용: dashboard surface fixture가 현재 `apmath/js/dashboard.js`의 전역 함수 목록과 불일치.
- 추가 감지 함수:
  - `getDashboardClassStudentNames`
  - `renderDashboardHoverPreview`

## 3. 의도 여부 확인

- `getDashboardClassStudentNames`:
  - `renderClassSummaryCard`에서 반별 재원 학생 이름 목록을 hover preview에 넣기 위해 실제 호출됨.
  - 단독 오염 함수가 아니라 현재 대시보드 렌더링 계약의 일부로 판단.

- `renderDashboardHoverPreview`:
  - 반 카드, 일정/시험 rows, 온보딩 task rows에서 hover preview HTML 생성에 실제 호출됨.
  - 단독 오염 함수가 아니라 현재 대시보드 hover preview 계약의 일부로 판단.

결론: 두 함수 모두 의도된 함수로 판단하여 fixture 기준만 현재 코드에 맞게 갱신했다.

## 4. 수정 파일

- `tests/fixtures/apmath-surface-dashboard.json`
  - dashboard surface count 갱신:
    - `functionDeclarations`: `209` -> `211`
    - `allDefinitions`: `240` -> `242`
  - 함수 목록에 추가:
    - `getDashboardClassStudentNames`
    - `renderDashboardHoverPreview`

- `CODEX_RESULT.md`
  - 이번 P0 복구 결과 보고서로 갱신.

## 5. 수정하지 않은 영역

- `apmath/js/*`
- `apmath/css/*`
- `apmath/index.html`
- `apmath/worker-backup/worker/*`
- `workers/*`
- `tests/apmath-global-surface.test.js`
- EIE/Archive 코드

## 6. 테스트 결과

- `node tools/run-tests.js`
  - 결과: PASS
  - 상세: `PASS 65 / FAIL 0 / KNOWN-FAIL 0 (total 65)`
  - `apmath global surface guard passed`

- `node tools/smoke-api.mjs`
  - 결과: PASS
  - `SMOKE API PASS`
  - AP/EIE/Wangji reachable, CORS restricted, 404 disclosure safe 모두 PASS.

## 7. 남은 주의 사항

- 작업 시작 시 이미 아래 변경이 worktree에 있었다.
  - `apmath/js/student-edit.js`
  - `apmath/js/student.js`
  - `tests/apmath-student-detail-memo-blank.test.js`
- 이번 라운드에서는 위 파일을 수정하지 않았다.
- 기본 테스트 결과에는 새 AP Math student detail memo blank contract 테스트가 포함되어 통과했다.

## 8. Git 처리

- Stage: No
- Commit: No
- Push: No
- 사유: 사용자가 stage/commit/push를 요청하지 않았고, 이번 라운드는 P0 복구 및 보고서 작성까지만 수행.
