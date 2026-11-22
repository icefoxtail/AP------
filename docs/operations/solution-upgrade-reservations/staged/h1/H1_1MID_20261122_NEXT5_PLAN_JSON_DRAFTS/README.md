# 고1 1학기 중간 유사 다음 5종 — 공식 SVG 엔진 JSON 초안

> **26개 slot × 3 JSON = 78개 입력 파일**, `manifest.json` 1개. 2026-11-22 KST. `JSON_DRAFT_READY / ENGINE_LINT_NOT_RUN / RENDER_NOT_RUN / PUBLISH_NOT_RUN`.

## 기존 플랜과 동일한 인계 계약

- `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `archive/tools/geometry-equation/ops/svg-m1/briefs/plan.md`와 `plan-current.md`를 기준으로 생성했다.
- 각 폴더의 `item.json`은 실제 유사 JS의 `sourcePath`, `ordinal`을 가진다. `plan.json`은 capability별 계산 데이터와 `caption`, `sourceQuote`, `sourceConditions`, `newVisualInformation`을 가진다. `publish.json`은 alt/caption과 렌더 전 임시 size를 가진다.
- 24개는 **원본 이미지가 있던 역할의 신규 SVG** 후보다. 2개(강남 q16 P, 순천 q5 S)는 기존 연결 SVG를 보며 작성한 **교체** 후보다.
- 매산 q10 P는 내부 칸막이·전체 가로 y 표현을 엔진에서 검증해야 하고, 매산 q12 S는 원래 정답·보기 수정이 선행되어야 한다. `ENGINE_SUPPORT_CHECK` 7건은 엔진의 타입 지원 여부와 기하 조건을 검증해야 한다.

## 공식 엔진 실행 예

```bash
ROOT='docs/operations/solution-upgrade-reservations/staged/h1/H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS'
SLOT="$ROOT/N5-01_23_매산고_q10_problem"
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs "$SLOT/plan.json"
node archive/tools/geometry-equation/production/render-plan.mjs \
  --item "$SLOT/item.json" \
  --plan "$SLOT/plan.json" \
  --out ".tmp/svg-m1/runs/h1-next5-N5-01/out"
```

**각 slot마다 별도 출력 폴더**를 사용한다. `figure-result.json`의 `status=ARCHIVE_BOUND` 및 `sizeClass`, SVG, PNG를 실제 확인하고 `publish.json.size`를 확정한다. 엔진이 거부하면 원문/권장 capability에 맞게 `plan.json`만 보정한다.

- 신규 24개: A 단독 독립 수학·시각 검수(기출 원본은 보조 참고).
- 교체 2개: 옛 SVG와 새 SVG를 나란히 비교(A/B), 학생 문제/해설 실제 화면에서 가독성·정답 노출·375px/A4 레이아웃 검사. 승인 후에만 `replace:true` 방식으로 반영한다.
- 문제 역할: 정답 숫자·유도 좌표가 새 이미지에 직접 드러나지 않도록 하고, 원문 수치와 지시선 위치만 표현한다.
- 게시: `archive/tools/geometry-equation` 공식 `pubflow.py --batch`를 독립 QA PASS 후 실행한다. 소스 SHA/provenance를 검증하고 기존 SVG를 임의 삭제하지 않는다.
- 공식 SVG 엔진 Python 모듈 `visual_engine` 의존성이 이 환경에 없어 lint·render를 실제 돌리지 못했다. **이 초안을 엔진 정상 동작·시각 QA 완료로 간주하면 안 된다.**

## 26개 입력 후보

| ID | 시험지/q | 역할 | 작업 | capability | 보류/검증 | JSON |
|---|---|---|---|---|---|---|
| N5-01 | 매산 q10 | 문제 | 신규 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-01_23_매산고_q10_problem/plan.json) |
| N5-02 | 매산 q10 | 해설 | 신규 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-02_23_매산고_q10_solution/plan.json) |
| N5-03 | 매산 q12 | 해설 | 신규 | `polynomial-spike-v1` | `BLOCKED_MATH` | [plan.json](./N5-03_23_매산고_q12_solution/plan.json) |
| N5-04 | 매산 q16 | 해설 | 신규 | `multi-curve-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-04_23_매산고_q16_solution/plan.json) |
| N5-05 | 매산 q20 | 해설 | 신규 | `multi-curve-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-05_23_매산고_q20_solution/plan.json) |
| N5-06 | 강남 q8 | 해설 | 신규 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-06_25_강남여고_q08_solution/plan.json) |
| N5-07 | 강남 q14 | 해설 | 신규 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-07_25_강남여고_q14_solution/plan.json) |
| N5-08 | 강남 q16 | 문제 | 교체 | `solid-figure-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-08_25_강남여고_q16_problem/plan.json) |
| N5-09 | 순천 q5 | 해설 | 교체 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-09_25_순천여고_q05_solution/plan.json) |
| N5-10 | 순천 q7 | 해설 | 신규 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-10_25_순천여고_q07_solution/plan.json) |
| N5-11 | 순천 q10 | 해설 | 신규 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-11_25_순천여고_q10_solution/plan.json) |
| N5-12 | 순천 q18 | 해설 | 신규 | `multi-curve-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-12_25_순천여고_q18_solution/plan.json) |
| N5-13 | 순천 q20 | 문제 | 신규 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-13_25_순천여고_q20_problem/plan.json) |
| N5-14 | 순천 q21 | 해설 | 신규 | `composite-panels-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-14_25_순천여고_q21_solution/plan.json) |
| N5-15 | 제일 q12 | 해설 | 신규 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-15_25_제일고_q12_solution/plan.json) |
| N5-16 | 제일 q13 | 문제 | 신규 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-16_25_제일고_q13_problem/plan.json) |
| N5-17 | 제일 q14 | 해설 | 신규 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-17_25_제일고_q14_solution/plan.json) |
| N5-18 | 제일 q16 | 해설 | 신규 | `composite-panels-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-18_25_제일고_q16_solution/plan.json) |
| N5-19 | 팔마 q8 | 해설 | 신규 | `multi-curve-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-19_25_팔마고_q08_solution/plan.json) |
| N5-20 | 팔마 q15 | 해설 | 신규 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-20_25_팔마고_q15_solution/plan.json) |
| N5-21 | 팔마 q16 | 해설 | 신규 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-21_25_팔마고_q16_solution/plan.json) |
| N5-22 | 팔마 q17 | 문제 | 신규 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-22_25_팔마고_q17_problem/plan.json) |
| N5-23 | 팔마 q17 | 해설 | 신규 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-23_25_팔마고_q17_solution/plan.json) |
| N5-24 | 팔마 q20 | 해설 | 신규 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-24_25_팔마고_q20_solution/plan.json) |
| N5-25 | 팔마 q21 | 해설 | 신규 | `multi-curve-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./N5-25_25_팔마고_q21_solution/plan.json) |
| N5-26 | 팔마 q23 | 해설 | 신규 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./N5-26_25_팔마고_q23_solution/plan.json) |

관련 판정: [5종 통합 QA](../H1_1MID_SIMILAR_NEXT5_VISUAL_QA_20261122.md). 데이터와 SHA는 `manifest.json` 참조.
