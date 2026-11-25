# 고2 미적분Ⅱ 유형은행 plan 일괄 인계 — 083–099 (23문항)

- 대상: `archive/exams/types/high/h2/`의 **미적분Ⅱ 유형은행** 중 기존 `main`에 plan이 없었던 23개 qid.
- 기준 `main`: `d2ba4c681437104e424b21978535b1715d89e0e5` (이전 유형은행 PR #3094 병합 뒤).
- PR 직전 최신 `main` 재확인: `3848b7de43cc2bad9efec8fd05ffbf93ab8b29ee`. 최초 선택 기준부터 이 SHA까지 고2 유형은행·plan·ops 경로 변경이 **없어** 동일 23개로 진행한다.
- 건드리지 않은 영역: 시험지·교과서·원문 JS, 고2 이외 유형은행, 기하 구간.
- 작성: **plan JSON 23개** (8개 JS 유형군).
- `plan-lint.cjs`: **shallow 23/23 PASS, full 23/23 PASS** (각 모드 실측, process exit 0).
- `DRAWN_FEATURE_PARITY`: **19 PASS / 4 ENGINE_CAPABILITY_PENDING**. lint PASS는 parity PASS와 별개다.
- 정밀 점검: JS 그림 원문 ↔ `sourceQuote` 정확 일치 23/23, 점·선·원·직각·호·각과 라벨 실제 렌더 필드 대조, 작도형 16개의 모든 수치 길이·직각·각·합동 선분 수학 검증(오차 기준 각 0.51°, 거리 0.001 이내) **오류 0개**. 초월함수 그래프는 수동 원문·필드 대조.
- SVG 생성·실제 시각검수·학생용 A4/PDF: **NOT_RUN / 후속 안티그래비티 담당**. plan-lint는 레이아웃·겹침을 최종 보증하지 않는다.
- 작업 브랜치: `work/gpt-typebank-calculus2-083-099-20261126` (최신 main에서 생성 예정).
- 기준 main 당시 다음 미작성 미적분Ⅱ 그림 qid 183개 중 본 배치 23개를 계획했으며, 병합 뒤 그림 plan 미작성 예상 **160개**. 기하의 과거 capability 미지원 부채는 별도 유지.

## 문항별 결과

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| `미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q02` | 지수·로그 극한 | 부분 작성·인계 | `exponential-affine-spike-v1` | [`q02-problem.plan.json`](../../production/plans/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q02-problem.plan.json) | shallow PASS / full PASS | ENGINE_CAPABILITY_PENDING (곡선 위 P·AP/BP/CP와 창 밖 C·BC 미표시) |
| `미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q03` | 지수·로그 극한 | 작성 완료 | `exponential-affine-spike-v1` | [`q03-problem.plan.json`](../../production/plans/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q03-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q04` | 지수·로그 극한 | 부분 작성·인계 | `multi-curve-figure-v1` | [`q04-problem.plan.json`](../../production/plans/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q04-problem.plan.json) | shallow PASS / full PASS | ENGINE_CAPABILITY_PENDING (자연로그+포물선 동시 작도 및 교점 P 미지원) |
| `미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q05` | 지수·로그 극한 | 부분 작성·인계 | `exponential-affine-spike-v1` | [`q05-problem.plan.json`](../../production/plans/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q05-problem.plan.json) | shallow PASS / full PASS | ENGINE_CAPABILITY_PENDING (지수곡선 P, 중점 M, 수직이등분선 및 Q 미지원) |
| `미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q06` | 지수·로그 극한 | 부분 작성·인계 | `logarithmic-affine-spike-v1` | [`q06-problem.plan.json`](../../production/plans/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q06-problem.plan.json) | shallow PASS / full PASS | ENGINE_CAPABILITY_PENDING (자연로그·지수 동시곡선 및 P/H/Q·OHQ 미지원) |
| `미적분II_090_미분가능을이용한미정계수결정_고2_유형은행1/q10` | 두 지수그래프 | 작성 완료 | `multi-curve-figure-v1` | [`q10-problem.plan.json`](../../production/plans/미적분II_090_미분가능을이용한미정계수결정_고2_유형은행1/q10-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q11` | 삼각함수 덧셈정리 | 작성 완료 | `construction-spike-v1` | [`q11-problem.plan.json`](../../production/plans/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q11-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q12` | 삼각함수 덧셈정리 | 작성 완료 | `construction-spike-v1` | [`q12-problem.plan.json`](../../production/plans/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q12-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q13` | 삼각함수 덧셈정리 | 작성 완료 | `construction-spike-v1` | [`q13-problem.plan.json`](../../production/plans/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q13-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q14` | 삼각함수 덧셈정리 | 작성 완료 | `construction-spike-v1` | [`q14-problem.plan.json`](../../production/plans/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q14-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_094_탄젠트의덧셈정리_고2_유형은행1/q14` | 탄젠트 덧셈정리 | 작성 완료 | `construction-spike-v1` | [`q14-problem.plan.json`](../../production/plans/미적분II_094_탄젠트의덧셈정리_고2_유형은행1/q14-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_095_두직선이이루는각의크기_고2_유형은행1/q07` | 직선·방향각 | 작성 완료 | `multi-curve-figure-v1` | [`q07-problem.plan.json`](../../production/plans/미적분II_095_두직선이이루는각의크기_고2_유형은행1/q07-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_095_두직선이이루는각의크기_고2_유형은행1/q08` | 직선·방향각 | 작성 완료 | `construction-spike-v1` | [`q08-problem.plan.json`](../../production/plans/미적분II_095_두직선이이루는각의크기_고2_유형은행1/q08-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_096_배각의공식_고2_유형은행1/q04` | 원·배각공식 | 작성 완료 | `construction-spike-v1` | [`q04-problem.plan.json`](../../production/plans/미적분II_096_배각의공식_고2_유형은행1/q04-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_096_배각의공식_고2_유형은행1/q05` | 원·배각공식 | 작성 완료 | `construction-spike-v1` | [`q05-problem.plan.json`](../../production/plans/미적분II_096_배각의공식_고2_유형은행1/q05-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_097_배각공식tan2θ_고2_유형은행1/q01` | 배각 tan 2θ | 작성 완료 | `construction-spike-v1` | [`q01-problem.plan.json`](../../production/plans/미적분II_097_배각공식tan2θ_고2_유형은행1/q01-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_097_배각공식tan2θ_고2_유형은행1/q03` | 배각 tan 2θ | 작성 완료 | `construction-spike-v1` | [`q03-problem.plan.json`](../../production/plans/미적분II_097_배각공식tan2θ_고2_유형은행1/q03-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q01` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q01-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q01-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q02` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q02-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q02-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q03` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q03-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q03-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q04` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q04-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q04-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q05` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q05-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q05-problem.plan.json) | shallow PASS / full PASS | PASS |
| `미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q06` | 덧셈정리 도형 | 작성 완료 | `construction-spike-v1` | [`q06-problem.plan.json`](../../production/plans/미적분II_099_삼각함수의덧셈정리의도형에의활용_고2_유형은행1/q06-problem.plan.json) | shallow PASS / full PASS | PASS |

## 엔진 지원 대기 4개

- **083/q02**: `e^{2t}` 위 정확한 P 및 AP·BP·CP의 초월함수 좌표 구성 불가. C(2,1)·BC도 현재 단일 자연지수 frame 범위 밖이라 `OVERLAY_POINT_OUTSIDE_VIEWPORT:C`로 거절되어 제외. 표시되는 것: `y=e^{2x}`, A, B, AB.
- **083/q04**: 자연로그 `ln(1+4x)`와 포물선 `ax²`의 혼합 그래프 및 그 양의 제1사분면 교점 P 미지원. 표시되는 것: 대표 a=4 포물선, O, B, C와 축 선분.
- **083/q05**: `P=(t,e^{3t})`, 중점 M, AP의 수직이등분선, Q의 일관된 계산·표시 미지원. 표시되는 것: `y=e^{3x}`와 A.
- **083/q06**: `y=ln(x/2)`와 `y=e^x`의 단일 좌표계 동시 구현 및 초월 교점 P/H/Q·OHQ 삼각형 미지원. 표시되는 것: 로그곡선, 대표 직선 x+y=1, O.
- 위 4건은 `sourceConditions[].mappedTo`와 `newVisualInformation`에 각각 `ENGINE_CAPABILITY_PENDING`을 적었다. **parity 완료 통계에서 제외**한다.

## 별도 확인 사항

1. 원문 그림 설명이 요구하는 필수 점·선·호·방향·직각·동일 길이·치수와 실제 엔진 필드를 1:1 대조했다. 캡션만으로 대체된 요소는 PASS로 기록하지 않았다.
2. 정답을 드러내는 극한값, 길이·넓이의 결과는 그림에 표시하지 않았다. 일부 도형 좌표는 조건을 만족시키는 **대표 배치**이며 구하는 값을 문자로 드러내지 않는다.
3. PR 번호·병합 SHA 및 원격 main 최종 검증은 병합 후 사용자 최종 보고에 실측하여 기록한다.

