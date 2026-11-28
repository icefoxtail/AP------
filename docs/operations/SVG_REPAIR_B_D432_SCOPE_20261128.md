# SVG 실패 B·D432 대상 수집 (2026-11-28)

## 기준과 상태

- 저장소: `icefoxtail/AP------`
- 기준 `origin/main`: `b7b089ccbb750fd6fecb2b3c2c2686b32693a694`
- 대상 브랜치: `work/svg-repair-b107-d432-20261128`
- 출처: `archive/tools/geometry-equation/ops/claude-batch/SVG_RENDER_FAILURES_20261128.txt`
- 상태: **TARGETS_COLLECTED_ONLY**. plan-lint/엔진 재렌더/시각검수/운영병합 모두 **NOT_RUN**.
- 범위: 실패 목록의 B(실행기 오류) 107행과 D의 `LAYOUT_INVENTORY_INCOMPLETE` 432행만. D의 다른 코드 149행, 기존 Plan 수리 674건, 나머지 실패는 이 브랜치의 대상이 아님.

## 고정 대상

| 작업군 | 원본 실패 행 | 중복 제거 대상 | 코드 | 목록 |
| --- | ---: | ---: | --- | --- |
| B — worker/runtime | 107 | **107** | `WORKER_TIMEOUT` 92, `WORKER_EXIT` 15 | [B 목록](../../archive/tools/geometry-equation/ops/claude-batch/SVG_REPAIR_B_WORKER_107_20261128.txt) |
| D432 — layout inventory | 432 | **431** | `LAYOUT_INVENTORY_INCOMPLETE` | [D 목록](../../archive/tools/geometry-equation/ops/claude-batch/SVG_REPAIR_D_LAYOUT_431_20261128.txt) |
| **합계** | **539** | **538** | | |

- B·D 사이 동일 대상 0건.
- 기존 `PLAN_REPAIR_TARGETS_20261128.txt` 674건과 동일 대상 0건.
- D 원본 중복 1행: `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q03-solution.plan.json/q3`. D 실행 목록에서는 1번만 포함.
- 두 목록의 한 줄은 원본 형식 `[<plan 경로>/<문항번호> | <오류 코드>]`를 유지하며, 원본 등장 순서로 정렬했다.

## 레거시 입력 4건 — 정식 Plan 파일이 아님

다음은 `*.plan.json`이 아니라 `*.json` 경로다. 이후 실행 전 입력 형식을 먼저 구분해야 하며, 원본 파일을 임의로 덮어쓰거나 변경하지 않는다.

- `WORKER_TIMEOUT`: `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q09-solution.json/q9`
- `WORKER_TIMEOUT`: `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q16-solution.json/q16`
- `LAYOUT_INVENTORY_INCOMPLETE`: `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q14-solution.json/q14`
- `LAYOUT_INVENTORY_INCOMPLETE`: `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q23-solution.json/q23`

## 후속 작업 원칙

1. B 대상은 실제 `WORKER_TIMEOUT`·`WORKER_EXIT`의 실행 로그/자원/종료 원인을 먼저 구분하고 재시도한다. 오류 코드만으로 Plan 결함이라고 단정하지 않는다.
2. D 대상은 현행 엔진의 자동 지시선·여백·좌표 패널 폴백 재실행 결과를 확인한다. `*-result.json`의 `code`, `detailFull`, `hint`, `fix`, `fallback`과 `roomTrace`가 있으면 활용해 미지원 라벨 유형·배치 실패를 분류한다.
3. **엔진 개선은 공통 결함 단위로 별도 작업하고**, 실제 문제·해설 의미와 원문 조건을 보존한다. SVG 수동 생성, 시험지 JS/정답/해설의 임의 변경은 하지 않는다.
4. 기존 674 Plan 수리 10배치와 충돌하지 않게 독립된 작업 브랜치에서 진행한다. 성공 여부는 공식 렌더 결과의 `ARCHIVE_BOUND`로만 인정하며 실행 전에는 `NOT_RUN`이다.
5. 이 문서는 대상 수집 기록만이다. 지시서 작성, 실제 렌더, 엔진 수정, 커밋 병합을 완료했다고 주장하지 않는다.
