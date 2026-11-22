# 고1 1학기 중간 유사 6종 · 공식 SVG 엔진 입력 JSON 초안 24세트

> 2026-11-22 KST · **JSON_DRAFT_READY / ENGINE_LINT_BLOCKED / RENDER_NOT_RUN / PUBLISH_NOT_RUN**. 이 폴더는 실제 엔진 입력 파일이며, 이전 [서술형 수정 지시서](../H1_1MID_SIMILAR_BATCH6_SVG_ENGINE_REPAIR_EXECUTION_PLAN_20261122.md)와 다르다. 총 **24개 독립 폴더 × (item.json, plan.json, publish.json)** = **72개 JSON** 및 [정형 인덱스](./manifest.json).

## 공식 정본과 입력 계약

- `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` 의 capability별 계약(특히 `caption`, `sourceConditions`, `newVisualInformation`, `sourceQuote`)과 `ops/svg-m1/briefs/plan.md`, `plan-current.md`를 기준으로 학생용 수학 수치·도형·원본 이미지 역할을 반영했다.
- `item.json`: 실제 2026 유사 JS의 `sourcePath` + `ordinal`; `plan.json`: 엔진이 읽는 capability-specific 원자료; `publish.json`: 학생에게 보일 alt/caption와 임시 size. **`publish.json.size`는 렌더 후 `figure-result.json.sizeClass`에 맞춰 확정**한다.
- 기존 24개의 `*_유사_plans/qNN-*.plan.json` 중 21 EXEMPT/3 UNSUPPORTED 기록은 **수정·삭제하지 않았다**. 이 폴더의 새 plan을 별도 입력으로 사용하여 공식 엔진이 거부하면 plan만 수정한다.
- 실제 정답과 학생용 문제 이미지의 역할을 구분한다. 문제 역할 6개(F-01/07/14/18/19/20)는 풀이·정답 라벨을 노출하지 않도록 초안 caption과 레이블을 구성했다. 다만 **엔진 산출 PNG로 정답 유출을 반드시 재검수**해야 한다.

## 착수 명령 — 실제 엔진이 있는 Codex 환경

```bash
# 저장소 루트에서, 고유 run 폴더 하나씩 실행한다.
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs \
  docs/operations/solution-upgrade-reservations/staged/h1/H1_1MID_20261122_PLAN_JSON_DRAFTS/F-01_강남여고_q07_problem/plan.json
node archive/tools/geometry-equation/production/render-plan.mjs \
  --item docs/operations/solution-upgrade-reservations/staged/h1/H1_1MID_20261122_PLAN_JSON_DRAFTS/F-01_강남여고_q07_problem/item.json \
  --plan docs/operations/solution-upgrade-reservations/staged/h1/H1_1MID_20261122_PLAN_JSON_DRAFTS/F-01_강남여고_q07_problem/plan.json \
  --out .tmp/svg-m1/runs/h1-1mid-20261122/F-01/out
# figure-result.json status = ARCHIVE_BOUND 확인 → 공식 svg2png.cjs로 PNG 생성 → 눈 검수
```

`archive/tools/geometry-equation/ops/claude-batch/restore.sh`로 준비한 `.tmp/work/render.mjs` 단일 큐 경로를 사용하는 경우에도 **같은 item/plan/out argv 계약**이다. 결과 PNG를 직접 보고 값·선종·지시선·라벨·음영, 375px/A4와 실제 시험/해설/정답 화면을 비교한다. 신규 그림은 **A 단독 독립검수**가 원칙이며 기존 SVG 교체에만 A/B 비교 및 `replace:true`를 적용한다. 공식 게시 `pubflow.py --batch`는 독립 검수 PASS·provenance 확인 뒤에만 실행한다.

## 이 환경에서 확인한 것과 확인하지 못한 것

- 완료: 24/24 JSON 문법 파싱, 24/24 원문 `sourceQuote` 실제 일치, target JS 24/24 qid 존재, 기본 구조 24/24(`capability`, `caption`, `sourceConditions`, `newVisualInformation`), 신규/해설 역할별 물리적 초안 및 72 파일 경로.
- **불가:** 공식 `plan-lint.cjs`를 기준 저장소의 정상 해설 plan에 실행했지만 `ModuleNotFoundError: No module named 'visual_engine'`로 중단됐다. 이 컨테이너에는 SVG 엔진의 Python 의존 모듈이 없어 **한 건도 공식 LINT_PASS, ARCHIVE_BOUND, 실제 PNG PASS로 표시하지 않는다.** 다음 Codex 환경에서 필요한 설치·복원을 마친 뒤 전수 lint와 렌더를 해야 한다.
- **엔진 지원 재확인 3칸:** F-12(두 포물선+4개 수평선의 라벨 밀집), F-15(`solid-figure-v1` 유사 검증 계약), F-21(무리수 정확 좌표의 `construction-spike-v1`). JSON 후보를 적되 정상 렌더 확인 전에는 기존 `UNSUPPORTED` 이력을 덮지 않는다.
- 수학·시각 조건의 원본 행별 출처는 [통합 감사](../H1_1MID_SIMILAR_BATCH6_VISUAL_QA_20261122.md)와 [엔진 수리 플랜](../H1_1MID_SIMILAR_BATCH6_SVG_ENGINE_REPAIR_EXECUTION_PLAN_20261122.md)에서 F-ID로 연결된다. 원본 PNG/SVG, 46개 기존 연결 SVG, JS, 운영 main은 수정하지 않는다.

## 문항별 실제 JSON

| ID | 시험지/qid | 역할 | 우선 | capability | 상태 | plan.json |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 강남여고 7 | 문제 | P2 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-01_강남여고_q07_problem/plan.json) |
| F-02 | 강남여고 14 | 해설 | P2 | `polynomial-spike-v1` | 초안 | [JSON](./F-02_강남여고_q14_solution/plan.json) |
| F-03 | 강남여고 24 | 해설 | P2 | `construction-spike-v1` | 초안 | [JSON](./F-03_강남여고_q24_solution/plan.json) |
| F-04 | 금당고 4 | 해설 | P2 | `number-line-figure-v1` | 초안 | [JSON](./F-04_금당고_q04_solution/plan.json) |
| F-05 | 금당고 13 | 해설 | P2 | `composite-panels-v1` | 초안 | [JSON](./F-05_금당고_q13_solution/plan.json) |
| F-06 | 금당고 16 | 해설 | P2 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-06_금당고_q16_solution/plan.json) |
| F-07 | 금당고 19 | 문제 | P2 | `construction-spike-v1` | 초안 | [JSON](./F-07_금당고_q19_problem/plan.json) |
| F-08 | 매산고 9 | 해설 | P2 | `number-line-figure-v1` | 초안 | [JSON](./F-08_매산고_q09_solution/plan.json) |
| F-09 | 매산여고 6 | 해설 | P2 | `composite-panels-v1` | 초안 | [JSON](./F-09_매산여고_q06_solution/plan.json) |
| F-10 | 매산여고 11 | 해설 | P2 | `number-line-figure-v1` | 초안 | [JSON](./F-10_매산여고_q11_solution/plan.json) |
| F-11 | 매산여고 13 | 해설 | P2 | `composite-panels-v1` | 초안 | [JSON](./F-11_매산여고_q13_solution/plan.json) |
| F-12 | 매산여고 19 | 해설 | P1 | `multi-curve-figure-v1` | 엔진 지원 재확인 | [JSON](./F-12_매산여고_q19_solution/plan.json) |
| F-13 | 복성고 1 | 해설 | P2 | `multi-curve-figure-v1` | 초안 | [JSON](./F-13_복성고_q01_solution/plan.json) |
| F-14 | 복성고 5 | 문제 | P1 | `solid-figure-v1` | 초안 | [JSON](./F-14_복성고_q05_problem/plan.json) |
| F-15 | 복성고 5 | 해설 | P1 | `solid-figure-v1` | 엔진 지원 재확인 | [JSON](./F-15_복성고_q05_solution/plan.json) |
| F-16 | 복성고 7 | 해설 | P2 | `number-line-figure-v1` | 초안 | [JSON](./F-16_복성고_q07_solution/plan.json) |
| F-17 | 복성고 11 | 해설 | P2 | `number-line-figure-v1` | 초안 | [JSON](./F-17_복성고_q11_solution/plan.json) |
| F-18 | 복성고 14 | 문제 | P2 | `construction-spike-v1` | 초안 | [JSON](./F-18_복성고_q14_problem/plan.json) |
| F-19 | 복성고 18 | 문제 | P1 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-19_복성고_q18_problem/plan.json) |
| F-20 | 복성고 19 | 문제 | P1 | `construction-spike-v1` | 초안 | [JSON](./F-20_복성고_q19_problem/plan.json) |
| F-21 | 복성고 19 | 해설 | P1 | `construction-spike-v1` | 엔진 지원 재확인 | [JSON](./F-21_복성고_q19_solution/plan.json) |
| F-22 | 복성고 20 | 해설 | P2 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-22_복성고_q20_solution/plan.json) |
| F-23 | 팔마고 9 | 해설 | P2 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-23_팔마고_q09_solution/plan.json) |
| F-24 | 팔마고 18 | 해설 | P2 | `piecewise-polynomial-spike-v1` | 초안 | [JSON](./F-24_팔마고_q18_solution/plan.json) |

**인계 인수:** 24개 각각 엔진 plan-lint PASS → render `ARCHIVE_BOUND` → 학생용 SVG/PNG 실제 수학·레이블 시각 QA → 신규 A 독립검수 PASS → 새 고유 SVG 경로 게시·JS image/solutionImage 결속 → 375px/A4/시험·정답·해설 재검수. 실패한 항목은 정확한 오류 코드로 OPEN을 유지한다.
