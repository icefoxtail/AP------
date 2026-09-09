# GOLD PILOT HOLDOUT report

r10 engine을 변경하지 않고 GOLD에 사용하지 않은 3문항에 적용했다.

| ID | old baseline | semantic/fact | desktop | mobile | visual |
|---|---|---|---|---|---|
| H01 | `25_효천고 q04-solution.svg` | PASS | PASS | PASS | PASS |
| H02 | `23_복성고 q12-solution.svg` | PASS | PASS | PASS | PASS |
| H03 | `25_효천고 q22-solution.svg` | PASS | PASS | PASS | PASS |

`HOLDOUT_FACT_PASS 3/3`, `HOLDOUT_RENDER_PASS 6/6`을 기록했다. H01의 두 직선-원 접선 거리, H02의 함수 접선 기울기, H03의 두 원과 점 및 중심거리 `4√6`을 numeric authority로 검증했다.

입력과 산출물은 `samples/`, `outputs/`, `renders/`에 있으며, `fact-validation.json`과 `render-metrics.json`이 evidence다. HOLDOUT에서는 generator/schema/style을 수정하지 않았다.

## Final decision

**GOLD_ENGINE_SEALED**

GOLD r01~r10은 semantic/fact/render/polish 회귀 없이 안정화됐고, 미공개 holdout 3문항도 같은 engine에서 PASS했다. 정식 production pipeline 통합과 도형의 방정식 FULL PILOT은 별도 승인 단계로 남긴다.
