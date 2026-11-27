# 비상 공통수학1 — 이차방정식과 이차함수 / 중단원 학습 점검

원문: `archive/exams/textbooks/비상교육_공통수학1/비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1/비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js`

문항 11개를 **발문(problem)** / **해설(solution)** 22축으로 개별 판정했다. plan경로는 **이 파일이 있는 디렉터리 기준**. `EXEMPT`는 발문·해설에 그림이 없거나 답 공개를 막기 위해 SVG를 추가하지 않은 축이다. `OK`는 엔진 plan-lint `--shallow`와 full의 통과를 뜻한다. q11의 **네 번째 직각 표식만 엔진 수 제한으로 남아 있으므로**, lint 성공과 별도로 시각적 완전 일치 판정을 내리지 않는다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 이차방정식과이차함수/q01 | 문항 | EXEMPT | 없음(함수 식 발문) | — | N/A | 그래프 그림 없이 함수식 3개만 제시, 정답 선공개 배제 |
| 이차방정식과이차함수/q01 | 해설 | PASS | composite-panels-v1 / polynomial-spike-v1 | `q01-solution.plan.json` | shallow/full OK | 3패널: x축과 교점 2개, 0개, 1개; 접점 (3/2,0), 판별식 부호와 일치 |
| 이차방정식과이차함수/q02 | 문항 | EXEMPT | 없음(문자 매개변수 식) | — | N/A | k 미확정의 단일 식만 존재 |
| 이차방정식과이차함수/q02 | 해설 | PASS | polynomial-spike-v1 | `q02-solution.plan.json` | shallow/full OK | k=±5인 양쪽 경우 같은 완전제곱 (x−3)², x축 접점 T(3,0) |
| 이차방정식과이차함수/q03 | 문항 | EXEMPT | 없음(함수·직선 식) | — | N/A | 교차 관계 판단 전의 식만 있음 |
| 이차방정식과이차함수/q03 | 해설 | PASS | composite-panels-v1 / polynomial-spike-v1 | `q03-solution.plan.json` | shallow/full OK | 각 포물선·직선 실계수 및 위치 관계 ⑴ 접함 T(3,6), ⑵ 두 교점, ⑶ 교점 없음 일치 |
| 이차방정식과이차함수/q04 | 문항 | EXEMPT | 없음(구간·이차함수 식) | — | N/A | 풀이 전 최댓값·최솟값 도해 없음 |
| 이차방정식과이차함수/q04 | 해설 | PASS | composite-panels-v1 / polynomial-spike-v1 | `q04-solution.plan.json` | shallow/full OK | 구간 [1,6]의 (1,−3)·(3,1)·(6,−8), 구간 [0,2]의 (0,−5)·(2,9) 끝점·꼭짓점 일치 |
| 이차방정식과이차함수/q05 | 문항 | EXEMPT | 없음(좌표 포함 발문) | — | N/A | A(2,0)만 제시; 해설값 a,b 공개 금지 |
| 이차방정식과이차함수/q05 | 해설 | PASS | polynomial-spike-v1 | `q05-solution.plan.json` | shallow/full OK | y=−2x²+2x+4의 교점 A(2,0), B(−1,0) 정확 |
| 이차방정식과이차함수/q06 | 문항 | EXEMPT | 없음(매개변수 그래프 식) | — | N/A | 확정된 계수·곡선 없음 |
| 이차방정식과이차함수/q06 | 해설 | EXEMPT | 없음(판별식) | — | N/A | a>1은 D/4=1−a<0의 부호 연산으로 완결 |
| 이차방정식과이차함수/q07 | 문항 | EXEMPT | 없음(k 미정) | — | N/A | 접선의 절편 미확정 |
| 이차방정식과이차함수/q07 | 해설 | PASS | polynomial-spike-v1 | `q07-solution.plan.json` | shallow/full OK | y=x²+x−1과 y=3x−2의 접점 T(1,1) 및 직선 보존 |
| 이차방정식과이차함수/q08 | 문항 | EXEMPT | 없음(m,n 미정) | — | N/A | 두 함수 계수 미확정 |
| 이차방정식과이차함수/q08 | 해설 | PASS | multi-curve-figure-v1 | `q08-solution.plan.json` | shallow/full OK | y=x²−6x+4와 y=−2x+5, x좌표 2±√5 두 교점 정확 |
| 이차방정식과이차함수/q09 | 문항 | EXEMPT | 없음(k 미정) | — | N/A | 두 번째 함수의 높이 미확정 |
| 이차방정식과이차함수/q09 | 해설 | PASS | composite-panels-v1 / polynomial-spike-v1 | `q09-solution.plan.json` | shallow/full OK | 공통 구간 [−2,1], 첫 함수 꼭짓점 (−1,3), k=8일 때 둘째 함수 끝점 (1,3), 최솟값 3 일치 |
| 이차방정식과이차함수/q10 | 문항 | EXEMPT | 없음(매개변수 k) | — | N/A | 실수 k 모든 값에 대한 항등조건 |
| 이차방정식과이차함수/q10 | 해설 | EXEMPT | 없음(항등식 계수 비교) | — | N/A | b=−2, a=4의 대수 계산으로 완결 |
| 이차방정식과이차함수/q11 | 문항 | ENGINE_CAPABILITY_PENDING | multi-curve-figure-v1 | `q11-problem.plan.json` | shallow/full OK | 포물선 2개, A·B·C·D, 직사각형 네 변, x축 ±2·y축 2/−4 눈금 일치; **직각 마크 3/4**, 네 번째 지원 필요 |
| 이차방정식과이차함수/q11 | 해설 | ENGINE_CAPABILITY_PENDING | multi-curve-figure-v1 | `q11-solution.plan.json` | shallow/full OK | 최적 t=2/3, A·B·C·D, 폭 4/3·높이 16/3, 두 포물선·4변 모두 보임; **직각 마크 3/4**, 네 번째 지원 필요 |

## 선·채움·표식의 정적 1:1 대조

1. q11 원본 `q11.png`의 두 포물선, 직사각형 네 꼭짓점·변, 위쪽 A/B와 아래쪽 C/D의 소속, x축 −2·2 및 y축 2·−4, 네 코너의 직각을 따로 세었다. plan은 좌표를 정확히 대입한 4점과 4개 선분, 3개 직각 마크를 명시한다. **누락: D의 네 번째 직각 마크 1개**.
2. 엔진은 `graphPlan.overlays.rightAngles`를 **최대 3개**까지 받으며 네 개째는 `OVERLAY_TOO_MANY:rightAngles`로 거절한다. 원문 정보를 삭제하지 않고 `ENGINE_CAPABILITY_PENDING`을 두 plan의 `newVisualInformation`에 명시했다. 필요 기능은 `rightAngles` 최대 4개 이상 + 평면 네 모서리에서의 마크 배치·관측기 검증이다. 손 SVG로 우회하지 않았다.
3. q11 두 포물선 사이 사각형은 채움 없이 **선분 네 개**로만 그리며, 문제·해설 그림에 흰색 기본 바탕을 별도 폴리곤으로 만들지 않았다. 다른 그래프도 원문에 없는 면 채움이 없다.
4. q01/03의 합성은 각 소문항을 독립 그래프로 대응시키며, 지시선·점선·각도·길이 중 원문에 없는 요소를 꾸며 넣지 않았다. q04/09는 구간 정의역을 엔진의 `sourceDomain.kind=INTERVAL`에 반영해 범위 밖 그래프를 결과로 오인하지 않게 했다.
5. 문항축에 계획을 만들지 않은 것은 대수 문제를 `EXEMPT`로 분리한 결과이다. 해설축의 플랜은 해설이 이미 확정한 상수·좌표를 썼으며 발문측 정답 스포일러가 없다.

총계: 22축 = **PASS 8축 + ENGINE_CAPABILITY_PENDING 2축 + EXEMPT 12축**. 실제 실행형 JSON 10개; shallow 10/10, full 10/10. q11 **플랜은 실행되지만 원문 4/4 직각 중 3/4만 표현**하므로 DRAWN_FEATURE_PARITY는 PARTIAL이다.
