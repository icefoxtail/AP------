# SVG 렌더 실패·스킵 목록 및 수리 가이드 (2026-11-28)

일괄 렌더 적재 작업 후 남은 실패·스킵 **1,765건**의 전체 목록과 수리 라인용 분류 파일이다.

- **전체 실패 목록 (1,765건):** `archive/tools/geometry-equation/ops/claude-batch/SVG_RENDER_FAILURES_20261128.txt`
- **Plan 일괄 수리 대상 (674건):** `archive/tools/geometry-equation/ops/claude-batch/PLAN_REPAIR_TARGETS_20261128.txt`

## 에러코드별 분류 (총 1,765건)

1. **Plan 일괄 수리 (674건 — 수리 라인: DeepSeek / Gemini / Codex)**
   - 주요 코드: `FAILED` (396), `NON_JSON_VALUE` (130), `DIMENSION_CROSSES_STROKE` (29), `COORDINATE_PANEL_TOO_TALL` (19), `ARCHIVE_INPUT_INVALID` (16), `UNSUPPORTED_OVERVIEW_FAMILY` (11), 기타 스키마·라벨 지정 오류
   - 방법: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs`로 형식 오류를 먼저 거르고, `render-plan.mjs`의 `*-result.json`(`code`, `detailFull`, `hint`, `fix`)을 수리 입력으로 넣어 `*.plan.json`을 고친 뒤 재렌더한다.

2. **좌표계·작도법 전환 또는 엔진 지원 확장 (336건)**
   - 주요 코드: `UNSUPPORTED_CINDY_EXACT_RATIONAL` (336)
   - 방법: 근사 소수/무리수 좌표를 동형 유리수 대표 좌표계·표현식으로 바꾸면 plan 수정만으로 통과하며, 무리수 작도가 필수인 유형은 엔진의 exact-rational/Cindy 지원 확장이 필요하다.

3. **엔진 배치·여백 공통 기능 개선 (약 580건 — 엔진 라인)**
   - 주요 코드: `LAYOUT_INVENTORY_INCOMPLETE` (432), `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` (35), `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` (26), `SOLID_LABELS_NO_ROOM` (22), `STAT_LABEL_OUT_OF_BOUNDS` (15), `ELLIPSE_LABEL_NO_ROOM` (14), `SET_COUNT_LABEL_NO_ROOM` (10), `TEXT_CLIPPED` (9), `TARGET_HORIZONTAL_OVERFLOW` (9), `STAT_LABELS_TOO_CLOSE` (9)
   - 방법: `docs/agents/visual-svg.md` 정본에 따라 엔진이 공통 라벨 배치·지시선·폴백 기능을 확장(예제 plan + 테스트 + 골든 게이트 통과)한 뒤 일괄 재렌더한다.

4. **실행 타임아웃·JS 구조 예외 (약 131건)**
   - 주요 코드: `WORKER_TIMEOUT` (92), `WORKER_EXIT` (15), `VERIFY_FAIL` (10), `ASSET_ALREADY_EXISTS` (8), `ACTIVE_BANK_NOT_LOCATED` (6)
   - 방법: 타임아웃/종료는 단독 실행 또는 타임아웃 상향으로 재확인하고, `VERIFY_FAIL`/`ACTIVE_BANK_NOT_LOCATED`는 해당 JS 파일의 후행 패치·객체 구조를 확인해 연결한다.
