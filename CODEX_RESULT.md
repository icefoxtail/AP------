# CODEX_RESULT

## 1. 생성/수정 파일
- `apmath/js/dashboard.js`
- `apmath/css/dashboard-foundation.css`
- `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료
- 원장님 대시보드 상단 오른쪽 `원장님` 텍스트를 제거하고 전체 검색 pill input을 배치했다.
- 하단 `전체 검색` 섹션과 `학생, 반, 학교, 시험, 자료를 검색하세요.` 안내문을 제거했다.
- 선생님 현황 카드 안에 학년별 재원 chip을 상시 표시하도록 변경했다.
- `재원` badge의 큰 모달 클릭 흐름을 제거하고, 상세 이동은 기존 `담당반 보기` 버튼으로 유지했다.
- 선생님 카드 내부 `이번 주 일지`와 수/목 일지 상태는 유지했다.
- 원장님 대시보드에 `오늘일지` 섹션을 카드 wrapper 없이 섹션 제목 + row/list 형태로 배치했고, 클릭 흐름은 유지했다.
- 최근 등록 원생을 최근 상담 아래, 확인 필요 위로 이동했다.
- 최근 등록 원생 목록만 desktop 2열, mobile 1열이 되도록 처리했다.
- 확인 필요 항목 순서는 `반 배정 필요`, `담당 선생님 미지정`, `반 정리 필요` 그대로 유지했다.
- UI 문구는 작업 지시 범위 밖에서 임의 변경하지 않았다.
- Worker/DB/schema/migration/API 응답 구조는 수정하지 않았다.

## 3. 실행 결과
- PASS: `node --check apmath/js/dashboard.js`
- PASS: `node tests/navigation-history.test.js`
- PASS: `node tests/manual-audience.test.js`
- PASS: 새 지시 기준 VM 스모크 테스트
  - 상단 검색 존재
  - 하단 검색 안내문 없음
  - 선생님 현황/이번 주 일지/학년별 chip 존재
  - 오늘일지 존재
  - 최근 상담 → 최근 등록 원생 → 확인 필요 순서 확인
  - `openAdminTeacherGradeSummary` 활성 HTML 없음
- FAIL(기존 테스트 계약 충돌): `node tests/admin-recent-consultation-panel.test.js`
  - 실패 사유: 해당 테스트가 “주간일정 아래 하단 전체 검색”을 기대하지만, 이번 `CODEX_TASK.md`는 하단 전체 검색 삭제와 상단 이동을 요구한다.
- 확인: `codex-self-audit`, `codex-work-review-pack` 스킬은 현재 설치된 스킬 목록과 로컬 검색에서 찾을 수 없어 수동 자체 검수와 로컬 `validation-and-review-pack-sop.md` 기준 검수팩 생성을 수행했다.

## 4. 결과 요약
원장님 대시보드의 큰 섹션 wrapper를 줄이고, 전체 검색은 상단 pill로 이동했다. 선생님 현황은 3열 카드와 내부 일지를 유지하면서 학년별 재원 chip을 카드 안에 바로 표시한다. 최근 등록 원생은 확인 필요보다 위로 이동했고 목록만 2열로 정리했다.

## 5. 다음 조치
- 브라우저에서 원장님 대시보드 desktop/tablet/mobile 폭을 확인한다.
- 기존 `admin-recent-consultation-panel.test.js`는 새 레이아웃 계약에 맞춰 별도 업데이트가 필요하다.
- 검수팩 zip 경로: `/mnt/c/Users/USER/Downloads/ap_director_dashboard_v3_review_pack_20260526_225221.zip`
