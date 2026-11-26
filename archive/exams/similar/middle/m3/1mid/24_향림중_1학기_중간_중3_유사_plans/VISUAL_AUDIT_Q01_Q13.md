# 2024 향림중 중3 1학기 중간 유사 q01~q13 — 문제·해설 SVG 2축 감사

- 현행 JS: `archive/exams/similar/middle/m3/1mid/24_향림중_1학기_중간_중3_유사.js`; 기준 main `011cf3332d64284329de35de5a04c38d40e5fbb8`.
- source Git blob `fee25d9e55d898a77b63c2c2e216d5365cf61487`, SHA256 `237974c6f92d292cfef6234adbd86a753f6a78d8713c40569dc464757f26ab97`.
- 범위: **q01~q13 13문항, 문제 13축 + 해설 13축 = 26축**. 이전의 향림중 q15·q19 문제의 미해결은 이 범위가 아니므로 유지한다.
- 기존 문제용 q01~q13 JSON 13개 중 **13개 모두 `status:EXEMPT` 자리표시자**였고 `capability`는 없었다. q10은 문제 자체가 수직선·직각삼각형·작도 호를 요구하므로 기존 q10 문제 EXEMPT 판정을 실행형으로 교정, q10 해설용 실행형을 새로 작성했다. 나머지 12개의 자리표시자는 유지한다.
- 열린 PR 68건의 파일명과 이 exact stem의 중복 없음. #956은 변경 파일 API 422여서 미확인; #1959는 이 exact stem을 수정하지 않는다.

## 독립 2축 판정

| qid | 축 | 판정 | capability | plan 경로(해당 `_plans/` 아래) | plan-lint | DRAWN_FEATURE_PARITY | 문항별·축별 개별 이유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT | — | q01-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 25, 4, √9 등 제곱근의 개수와 표기 뜻을 묻는 참거짓 선택형이다. |
| q01 | 해설 | EXEMPT | — | — | — | 해당 없음 | √9=3의 제곱근 ±√3과 25의 제곱근 ±5를 말과 식으로 구별한다. |
| q02 | 문제 | EXEMPT | — | q02-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 근호·거듭제곱·부호가 섞인 다섯 계산식을 검산한다. |
| q02 | 해설 | EXEMPT | — | — | — | 해당 없음 | ①의 5−4=1, ⑤의 6÷(−3)=−2 등 수치 결과를 식으로 비교한다. |
| q03 | 문제 | EXEMPT | — | q03-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 64의 양의 제곱근과 √81의 음의 제곱근을 찾는 표현 해석 계산이다. |
| q03 | 해설 | EXEMPT | — | — | — | 해당 없음 | a=8과 b=−3의 뜻을 식으로 밝혀 a+b=5로 끝나므로 그림은 중복이다. |
| q04 | 문제 | EXEMPT | — | q04-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | √(30−n)이 자연수가 되는 완전제곱수의 개수를 센다. |
| q04 | 해설 | EXEMPT | — | — | — | 해당 없음 | k²<30에서 k=1~5를 나열하는 정수 조건 계산으로 완결된다. |
| q05 | 문제 | EXEMPT | — | q05-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 4≤√(2x+3)≤5를 제곱하여 자연수 x를 세는 수치 부등식이다. |
| q05 | 해설 | EXEMPT | — | — | — | 해당 없음 | 6.5≤x≤11에서 7~11의 다섯 정수를 열거하면 충분해 수직선은 반복이다. |
| q06 | 문제 | EXEMPT | — | q06-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | √(x²)=x, √(y²)=−y의 부호 조건에 따라 절댓값식을 계산한다. |
| q06 | 해설 | EXEMPT | — | — | — | 해당 없음 | x>0,y<0과 y−x<0,−3y>0의 부호 논증·대수 전개가 결정적 단계다. |
| q07 | 문제 | EXEMPT | — | q07-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 순환하지 않는 무한소수에 해당하는 무리수 표현을 고른다. |
| q07 | 해설 | EXEMPT | — | — | — | 해당 없음 | √5−2만 무리수이고 나머지는 유리수임을 값으로 직접 확인한다. |
| q08 | 문제 | EXEMPT | — | q08-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 두 근호식의 안팎 계수를 정리해 a,b와 곱 ab를 구한다. |
| q08 | 해설 | EXEMPT | — | — | — | 해당 없음 | √18/3=√2, √45=3√5이므로 a=2,b=5인 계수 변환이다. |
| q09 | 문제 | EXEMPT | — | q09-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 다섯 근호식에서 a값이 다른 하나를 찾는 식의 동치 비교다. |
| q09 | 해설 | EXEMPT | — | — | — | 해당 없음 | ④만 a=45/2, 나머지는 a=5인 값을 계산해 구별한다. |
| q10 | 문제 | REQUIRED | number-line-figure-v1 | q10-problem.plan.json (EXEMPT→실행형) | shallow/full PASS | NOT_VERIFIED | 발문이 수직선의 P(2), 밑변 2·높이 1인 직각삼각형 PQ, 왼쪽 A·오른쪽 B로 이어지는 호를 직접 기술하지만 기존 JS에는 문제 그림 연결이 없다. 수직선과 작도 관계를 학생이 읽도록 도식이 필요하다. |
| q10 | 해설 | BENEFICIAL | number-line-figure-v1 | q10-solution.plan.json (신규) | shallow/full PASS | NOT_VERIFIED | √(2²+1²)=√5를 반지름으로 옮겨 A=2−√5, B=2+√5가 된다는 양쪽 거리 관계를 호와 정확한 좌표에 결속한다. |
| q11 | 문제 | EXEMPT | — | q11-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | √3=1.732로 계산 가능한 다섯 식을 분류하는 근호·자릿수 연산이다. |
| q11 | 해설 | EXEMPT | — | — | — | 해당 없음 | √0.3에는 √30이 필요하고 나머지는 √3의 배수로 환산됨을 식으로 보여 준다. |
| q12 | 문제 | EXEMPT | — | q12-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | √18과 분수 근호의 곱을 분배·통분해 계산한다. |
| q12 | 해설 | EXEMPT | — | — | — | 해당 없음 | √18=3√2와 괄호 값 3√2−1/3의 소거는 그림 없이 명확하다. |
| q13 | 문제 | EXEMPT | — | q13-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 다섯 무리수 대소관계를 부등식 성질로 변환해 판정한다. |
| q13 | 해설 | EXEMPT | — | — | — | 해당 없음 | ③에서 공통 −√5를 소거하고 4√3>3√3을 확인하는 수식 비교로 완결된다. |

## 실행형 plan 독립 검산 및 실제 모델/spec 필드 대조

**q10 문제, 기존 EXEMPT 판정 JSON 교정 → 실행형 `number-line-figure-v1`**:

- 공식 `solveNumberLineFigure` 모델의 POINTS 3점은 `A=2−√5`, `P=2`, `B=2+√5`다. A/B의 값은 엔진 내부 좌표 배치에만 쓰고 문제 plan에는 `showValue:false`라서 실제 그리기 spec의 두 `point-value` 라벨이 **존재하지 않는다**. 화면 라벨은 점 이름 A,P,B와 P의 값 2, 위쪽 점 Q뿐이다. 문제 정답 ⑤ 또는 B의 수치를 그림에 미리 인쇄하지 않는다.
- 엔진의 `source: {grid:true,from:[2,0],to:[4,1],toName:"Q"}`는 수직선의 단위 2칸·높이 1칸을 가진 격자와 빗변 PQ를 그리는 **GRID 원천 객체**다. 공식 spec은 세로 격자선 **3개**, 높이선 **1개**, 빗변 **1개**를 포함한다. 격자의 수직·수평 관계가 직각임을 나타내지만 **별도 직각 표시 glyph는 생성하지 않는다**. 길이 2·1은 원문 발문에 있으며 그림에서는 격자 단위로 표현한 것이다.
- `constructions[0]`은 중심 P, 반지름 정확히 √5, LEFT→A 및 RIGHT→B의 **실제 호 2개**다. 독립 검산 `2²+1²=5`, `2−√5≈−0.236`, `2+√5≈4.236`이 원문 좌우 관계와 일치한다.
- 이 plan 자체는 JS의 `image`를 추가하지 않으며, 엔진 렌더 후 학생 화면 연결이 별도 필요하다.

**q10 해설, 신규 `number-line-figure-v1`**:

- 문제축과 같은 3점·GRID 빗변·좌/우 호 2개를 가진다. 공식 model/spec의 `point-value` 라벨에 **A=2−√5, P=2, B=2+√5**가 모두 존재한다. 이는 해설에서만 드러내는 풀이 결과다.
- 원문에 없는 삼각형 변·비율을 추가하지 않았다. `from:[2,0]`, `to:[4,1]`는 원문의 P 좌표2와 밑변2·높이1을 격자 단위로 직접 옮긴 값이다.

**패리티 판정 경계:** 위 두 plan은 엔진의 정적 모델/spec에 필요한 점·격자·호·라벨이 실제 그리기 객체로 존재한다는 검증이다. 실제 SVG/PNG 렌더 및 학생 화면·A4를 검수하지 못했으므로 **DRAWN_FEATURE_PARITY PASS 0축, NOT_VERIFIED 2축**으로 기록한다. 별도 직각 glyph와 숫자 2·1의 선분 라벨은 그림에 없고, 원문은 이를 **발문 조건으로만** 제시했다. 추가 화면 표시가 필요하다는 결론은 실제 화면 검수 후 다시 판단한다.

## 공식 lint·렌더·신규 미해결

- 기존 문제용 JSON **13개** + 신규 q10 해설 **1개** = **14 JSON**. 전체 shallow/full 각각 **14/14 OK**(실제 최종 실행으로 다시 확인).
- EXEMPT 판정용 JSON은 **12개**, 실행형은 **2개**(문제 기존 EXEMPT→실행형 교정 1, 신규 해설 1). shallow/full 실행형 각각 **2/2 PASS**. 실제 실행형 수에 EXEMPT 판정용 JSON을 넣지 않는다.
- 공식 `render-plan.mjs` q10 문제 호출은 **FAILED / stage=measure / ARCHIVE_PREFLIGHT_FAIL**. Chromium distribution `chrome` 실행 파일 `/opt/google/chrome/chrome` 부재; 실제 SVG/PNG·학생 화면·A4는 ENV_BLOCKED/NOT_VERIFIED. q10 해설 실제 렌더는 **NOT_RUN**.
- 신규 ENGINE_CAPABILITY_PENDING **0**, EVIDENCE_DEBT **0**. 그림의 실물 시각 패리티 PASS는 **0/2**이다. 별도 향림중 q15·q19 문제의 이전 미해결과 합산하지 않는다.
