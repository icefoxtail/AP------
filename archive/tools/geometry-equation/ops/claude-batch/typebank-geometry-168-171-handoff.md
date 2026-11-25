# 고2 기하 유형은행 168–171번 문제 그림 plan — 원문-필드 정합 검수

- 범위: `archive/exams/types/high/h2/` 기하 168–171의 4개 JS / 그림 자리 20개. 시험지·교과서·유사 미변경.
- 각 qid의 JS 원문 `content`와 `[그림:...]`를 직접 사용했고, `sourceQuote`는 그 원문에서 발췌. `sourceConditions` 각 `mappedTo`는 실제 렌더 필드 또는 누락 엔진 기능이다.
- `ENGINE_CAPABILITY_PENDING`은 **시각 완성 아님**. 이 JSON은 공식 엔진의 기본 도형을 생성할 수 있으나 필수 절단·구·기울기 등을 구현하지 못한다. 안티그래비티는 기능 확장 전 게시·JS 이미지 연결 금지.
- 문제 그림의 정답·풀이 유도 값 노출을 금지. 임의 대표 높이/한 변은 sourceConditions에서 명시한다.

| 유형/qid | 축 | JS Blob SHA | plan 경로 | capability | sourceVsPlan | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 엔진 확장 요청 |
|---|---|---|---|---|---|---|---|---|
| 168/q01 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 168/q02 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 삼각형 EHG의 내접원을 밑면 위 원으로 정확히 표시하는 기능 필요 |
| 168/q03 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 168/q04 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 168/q05 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 168/q06 | 문제 | `cf01f98f1d6c` | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q06-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 169/q01 | 문제 | `34b6dd23a840` | `archive/tools/geometry-equation/production/plans/기하_169_정육각기둥에서이면각구하기_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 169/q02 | 문제 | `34b6dd23a840` | `archive/tools/geometry-equation/production/plans/기하_169_정육각기둥에서이면각구하기_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 169/q03 | 문제 | `34b6dd23a840` | `archive/tools/geometry-equation/production/plans/기하_169_정육각기둥에서이면각구하기_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | PASS | — |
| 170/q01 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 45도 절단면이 밑면 지름을 교선으로 가지는 반타원 절단 및 선택적 면 채움 |
| 170/q02 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 60도 전원형 경계 절단 타원 및 면 채움 |
| 170/q03 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 모선 AB 수직인 원뿔의 기울인 3차원 배치와 꼭짓점 A, 중심 E, 테두리 B,C |
| 170/q04 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 기울어진 축, 원기둥 절반의 액량, 수면이 반대 끝점에 닿는 타원 |
| 170/q05 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 기울이기 전후 두 패널, 기울인 수면이 입구 한 끝점에 닿는 그림 |
| 170/q06 | 문제 | `1bb18ac5e95a` | `archive/tools/geometry-equation/production/plans/기하_170_원기둥의정사영의넓이_고2_유형은행1/q06-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 쏟아지기 직전 최대 기울기와 둘째 패널의 타원 수면 |
| 171/q01 | 문제 | `35dd2b310792` | `archive/tools/geometry-equation/production/plans/기하_171_정사영을이용하여타원의넓이구하기_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 밑면 45도 절단면과 타원 단축·장축을 왜곡 없이 표시 |
| 171/q02 | 문제 | `35dd2b310792` | `archive/tools/geometry-equation/production/plans/기하_171_정사영을이용하여타원의넓이구하기_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | alpha 평면 30도 교선 및 타원 면 색 |
| 171/q03 | 문제 | `35dd2b310792` | `archive/tools/geometry-equation/production/plans/기하_171_정사영을이용하여타원의넓이구하기_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 절단 타원, 초점 둘과 두 초점 거리 16, 기호 θ의 각 호 |
| 171/q04 | 문제 | `35dd2b310792` | `archive/tools/geometry-equation/production/plans/기하_171_정사영을이용하여타원의넓이구하기_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 비스듬한 타원 단면과 초점 A,B, 밑면으로 내린 두 수선·발 A′,B′ |
| 171/q05 | 문제 | `35dd2b310792` | `archive/tools/geometry-equation/production/plans/기하_171_정사영을이용하여타원의넓이구하기_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | REVIEWED | PASS / PASS | ENGINE_CAPABILITY_PENDING | 교선 공유하는 두 절단평면과 각 45°·75°, S1/S2 두 타원 면 |

## 작업 경계

- 공식 `plan-lint.cjs`의 shallow/full을 위 20개 파일 모두에 실행하여 각 20/20 PASS, FAIL 0, SKIP 0을 얻었다. 이는 절단·기울기 시각 완성 판정과 독립이다.
- SVG 렌더, PNG, 학생 화면, A4 검사는 `NOT_RUN`; 실제 그림 연결·게시도 `NOT_RUN`이다.
- 172번 이후는 이번 배치 밖이며, 170–171 미지원 건을 PASS로 승격하려면 실제 렌더 필드 구현과 원문 대조가 선행되어야 한다.
