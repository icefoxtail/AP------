# 고2 유사시험지 SVG production plan 문항별 2축 감사

- 시험지: `archive/exams/similar/high/h2/1final/22_제일고_1학기_기말_고2_수학I_유사.js`
- 범위: 21문항, 문제 21축 + 해설 21축 = **42축**.
- 판정: **REQUIRED 1 / BENEFICIAL 2 / EXEMPT 39**.
- 공식 JSON 3개 = 새로 작성 1개(q04) + 검증한 기존 레거시 실행형 plan 공식 편입·보존 2개(q15,q21), 기존 공식 plan 수정 0개.

## 판정·증거 기준

- 기준 자료: 현행 고2 유사 JS의 모든 문제 문장·선택지·정답·해설. 기출 PNG/SVG, 직접 연결된 유사 SVG, 해당 레거시 plan, 공식 production 폴더를 별도 대조했다. 원본 자료가 현행 JS와 다르면 **현행 JS**를 유일한 제작 기준으로 채택했다.
- **REQUIRED**: 공간적 연결·교차·필수 조건의 판독에 도식이 필요. **BENEFICIAL**: 필수는 아니지만 문제 해결 또는 해설 이해에 실질적 도움. **EXEMPT**: 문장·수식만으로 충분. 각 문항의 **문제축/해설축을 독립 판정**했으며 두 축은 연동해 자동 승격하지 않았다.
- 문제축의 caption/accessibilityDescription/sourceConditions/newVisualInformation에 답 및 풀이 중간값을 노출하지 않는다. 해설축은 풀이 근거를 허용한다.
- 상태: 각 공식 JSON에 대해 JSON 파싱·엔진 계약, **Shallow lint PASS**, **Full lint PASS**, **STATIC_FIELD_PARITY PASS**, **DRAWN_FEATURE_PARITY PASS(정적 구성요소 대조만)**. Chromium 실행 파일 부재로 **실제 SVG 렌더 RENDER_NOT_RUN**, 실제 시각 검수 **NOT_RUN**. 정적 PASS를 렌더·시각 PASS로 간주하지 않는다.

## 문항별 판정

| 문항 | 문제축 | 해설축 | 현행 JS 기준 독립 판단 근거·대응 공식 plan |
|---:|---|---|---|
| 01 | EXEMPT | EXEMPT | 공차·첫항 항등식을 대입해 15를 구한다. |
| 02 | EXEMPT | EXEMPT | 등차중항·등비중항 식으로 α+β=3을 도출한다. |
| 03 | EXEMPT | EXEMPT | 합 S₁과 차 S₁₀−S₉를 직접 계산한다. |
| 04 | BENEFICIAL | EXEMPT | 삼각형·외접원의 위치 이해에 유용; 사인법칙으로 R=6, AC=6√2 검산. `q04-problem.plan.json`. |
| 05 | EXEMPT | EXEMPT | sin B=sin C cos A를 사인·코사인법칙으로 정리해 직각 조건을 얻는다. |
| 06 | EXEMPT | EXEMPT | S₁₀, S₂₀의 두 1차방정식으로 a₂를 계산한다. |
| 07 | EXEMPT | EXEMPT | 서로 같은 네 항의 합 두 묶음 비에서 공비의 세제곱을 구한다. |
| 08 | EXEMPT | EXEMPT | 양수 공비에 관한 이차방정식과 3의 거듭제곱 부등식이다. |
| 09 | EXEMPT | EXEMPT | 홀수·짝수 항의 짝별 합을 산술급수로 계산한다. |
| 10 | EXEMPT | EXEMPT | 16의 지수 차가 고정되는 등차 조건을 사용한다. |
| 11 | EXEMPT | EXEMPT | 누적 주행 거리 40(1.1ⁿ−1)≥360의 임계 주차를 확인한다. |
| 12 | EXEMPT | EXEMPT | 겹치는 시그마 구간을 직접 소거한다. |
| 13 | EXEMPT | EXEMPT | Sₙ의 차분과 부분분수 망원합으로 계산한다. |
| 14 | EXEMPT | EXEMPT | aₙ₊₁=aₙ+4를 대입해 첫째항과 합을 구한다. |
| 15 | BENEFICIAL | EXEMPT | 원점에서 교차하는 두 직선의 기울기와 예각을 보여 준다; 현행 JS의 3, 1/3 사용. `q15-problem.plan.json` (레거시 보존). |
| 16 | EXEMPT | EXEMPT | 하루 판매량의 비율 0.60과 등비수열 식으로 충분하다. |
| 17 | EXEMPT | EXEMPT | 귀납식의 가감과 빈칸 대수 조작만 사용한다. |
| 18 | EXEMPT | EXEMPT | 홀수·짝수 항의 제곱 차와 교대수열 합을 계산한다. |
| 19 | EXEMPT | EXEMPT | 등차중항과 b₁=-4로 공비 −2 및 a₁₀=−100을 구한다. |
| 20 | EXEMPT | EXEMPT | Sₙ₊₁/Sₙ=1/4의 등비 합과 항차를 구한다. |
| 21 | REQUIRED | EXEMPT | 두 직각·발 E·교점 F가 얽힌 볼록사각형의 incidence 정보가 핵심. `q21-problem.plan.json` (레거시 보존); 해설은 직각삼각형과 사인법칙으로 독립 계산. |

## 원본·도식 대조 및 충돌 분리

- **ORIGINAL_EXAM_PNG_CONFLICT — q15:** 기출 `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q15.png`는 **y=2x, y=x/2**인 반면, 현행 유사 JS는 **y=3x, y=x/3**이다. 현행 유사 JS 및 그에 직접 연결된 `q15-problem.svg`와 레거시 plan을 기준으로 공식 plan을 구성했다. 기출 PNG 수치를 복사하지 않았다.
- 기출 `q21.png`·`q21-solution.svg`, 직접 연결된 유사 `q21-problem.svg`를 볼록사각형의 연결·직각·수선·교점 비교 증거로 확인. `q4-solution.svg`는 기출 해설 도형이며 현행 유사 JS의 수치·정답을 결정하는 근거로 사용하지 않았다.
- 원본 관련 폴더에서 **-v2, -v3 변형 SVG 파일 없음**. 확인된 별도 **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT 없음**. 별도 **CONTENT_CONFLICT_SOURCE 없음**. 확인된 **ENGINE_CAPABILITY_PENDING 없음**.

## 공식 plan별 정적 필드·기하 검산

| 공식 JSON | 축 | STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY(정적) | 수학·내용 독립 검산 | 렌더 |
|---|---|---|---|---|
| `q04-problem.plan.json` | P BENEFICIAL | ABC 세 변, A60°, C75°, BC=6√3, 외접원 CIRCLE_THROUGH_3 모두 1:1 확인 · PASS/PASS | B45°, R=6, AC=6√2, AC·R=36√2(③). 임의 정답 라벨 없음 | RENDER_NOT_RUN |
| `q15-problem.plan.json` | P BENEFICIAL | 두 직선 y=3x, y=x/3, 교각 θ · PASS/PASS | 방향벡터 (1,3),(3,1)의 코사인 3/5(③). 기출 PNG와 수치 다름 | RENDER_NOT_RUN |
| `q21-problem.plan.json` | P REQUIRED | A,C 직각, AE⊥BC, BD∩AE=F, ∠ABE45°, ∠BDA60°, AD=2 · PASS/PASS | 두 외접반지름 3√2−√6, √6−√2를 직각삼각형·사인법칙으로 확인 | RENDER_NOT_RUN |

- JSON 파싱/공식 계약: **3/3 PASS**; 공식 Shallow lint: **3/3 PASS**; 공식 Full lint: **3/3 PASS**; 두 정적 parity: **3/3 PASS**. 실렌더 **0/3**, RENDER_NOT_RUN **3/3**.
- JS의 선택지·답·해설을 재대조했다. 문항 1–21의 등차·등비·지수·로그·귀납·기하 계산에서 **현재 확인된 수학적 자기모순 없음**. 계산형 문항은 해당 감사표의 식으로 검산. 그림 미선정 축은 의도적인 EXEMPT이며 plan 누락이 아니다.
