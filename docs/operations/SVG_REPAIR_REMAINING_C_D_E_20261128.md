# SVG 잔여 C·D149·E 대상 수집 (2026-11-28)

## 공통 기준

- 저장소: `icefoxtail/AP------`
- 공통 기준 SHA: `93b1aa7a7165c7473b380a295a0bdc27eaf30622` (기존 B107·D432 목록을 포함하며 `origin/main`을 조상으로 둔 커밋)
- 대상 수집 브랜치: `work/svg-repair-remaining-c-d-e-20261128`
- 원본: `archive/tools/geometry-equation/ops/claude-batch/SVG_RENDER_FAILURES_20261128.txt`
- 상태: **TARGETS_COLLECTED_ONLY**. lint·렌더·엔진 수정·운영병합은 **NOT_RUN**.
- 기존 Plan 674건, B 실행 오류 107건, D의 `LAYOUT_INVENTORY_INCOMPLETE` 432행은 다른 라인에 예약되어 있음.

## 잔여 대상

| 라인 | 원본 행 | 고유 대상 | 오류 범위 | 실행 목록 | 독립 작업 브랜치 |
| --- | ---: | ---: | --- | --- | --- |
| C | 336 | **332** | `UNSUPPORTED_CINDY_EXACT_RATIONAL` | [C](../../archive/tools/geometry-equation/ops/claude-batch/SVG_REPAIR_C_CINDY_332_20261128.txt) | `work/svg-repair-c-cindy-20261128` |
| D-기타 | 149 | **149** | D의 나머지 레이아웃·표시 영역 9종 | [D](../../archive/tools/geometry-equation/ops/claude-batch/SVG_REPAIR_D_OTHER_149_20261128.txt) | `work/svg-repair-d-other-20261128` |
| E | 67 | **67** | 자산·연결·검증 27 + 기타 40 | [E](../../archive/tools/geometry-equation/ops/claude-batch/SVG_REPAIR_E_OTHER_67_20261128.txt) | `work/svg-repair-e-other-20261128` |
| **합계** | **552** | **548** | | | |

- C 원본 중복 4행: `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q10-solution.plan.json/q10`, `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q11-solution.plan.json/q11`, `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q12-solution.plan.json/q12`, `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q14-solution.plan.json/q14`. C 실행 목록에서는 각각 한 번만 포함한다.
- 세 라인과 기존 674·B107·D432 사이 같은 파일/문항 경로의 중복 0건.
- 원본 전체 검산: `674 + 107 + 432 + 336 + 149 + 67 = 1765`행. 중복 5행 제거 시 전 실패의 고유 대상은 1760개.
- 실행 목록은 원본 대괄호 형식 `[plan경로/문항ID | 오류코드]`을 유지한다.

## D-기타 149건 코드별 분포

- `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL`: 35
- `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL`: 26
- `SOLID_LABELS_NO_ROOM`: 22
- `STAT_LABEL_OUT_OF_BOUNDS`: 15
- `ELLIPSE_LABEL_NO_ROOM`: 14
- `SET_COUNT_LABEL_NO_ROOM`: 10
- `TEXT_CLIPPED`: 9
- `TARGET_HORIZONTAL_OVERFLOW`: 9
- `STAT_LABELS_TOO_CLOSE`: 9

레거시 `*.json` 2건은 아래와 같다. 원본을 변경하지 않고 후속 작업에서 공식 Plan 입력 여부를 판단한다.

- `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q22-solution.json/q22`
- `archive/tools/geometry-equation/production/plans/비상_미적분1_미분계수와도함수_중단원학습점검_고2/q14-solution.json/q14`

## E 67건 분류

- 자산·연결·검증 27건: `VERIFY_FAIL` 10, `ASSET_ALREADY_EXISTS` 8, `ACTIVE_BANK_NOT_LOCATED` 6, `ARCHIVE_QR_RENDERER_NOT_LOADED` 1, `IMMUTABLE_PREFLIGHT_CANDIDATE_EXISTS` 1, `ALREADY_CONNECTED` 1.
- 기타 40건: 수직선 라벨, 선/라벨 겹침, 누락 선분, 기타 개별 코드. 자세한 오류 코드는 E 실행 목록 참조.

## 후속 작업 경계

1. 각 작업자는 동일 기준에서 별도의 전용 worktree·브랜치를 사용한다. `main` 직접 수정·병합 금지.
2. 수동 SVG 생성 금지. 시험지 JS·원문·정답·해설 무단 수정 금지. 기존 674/B/D432 대상 수정 금지.
3. C는 정확 유리수 지원 기능, D-기타는 레이아웃/Archive 표시 영역, E는 연결·자산 상태와 잡다한 계약 오류의 실제 원인을 분리한다. 오류 코드를 임의 무시하거나 수학적으로 틀린 근사값을 통과시키지 않는다.
4. 대량 자동 렌더를 기본으로 하고 `*-result.json`의 `code`·`detailFull`·`hint`·`fix`로 유형별 공통 수리를 우선한다.
5. 성공은 `render-plan.mjs --accept-scored 1`의 `ARCHIVE_BOUND` 결과만 인정한다. 미실행은 `NOT_RUN`, 실제 엔진 미지원은 `ENGINE_CAPABILITY_PENDING`으로 남긴다.
