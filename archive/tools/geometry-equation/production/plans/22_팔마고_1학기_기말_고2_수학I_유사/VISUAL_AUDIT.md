# 고2 유사시험지 SVG production plan 문항별 2축 감사

- 시험지: `archive/exams/similar/high/h2/1final/22_팔마고_1학기_기말_고2_수학I_유사.js`
- 범위: 22문항, 문제 22축 + 해설 22축 = **44축**.
- 판정: **REQUIRED 0 / BENEFICIAL 6 / EXEMPT 38**.
- 공식 JSON 6개 = 새로 작성 5개(q09,q12,q16 문제·해설,q19) + 검증한 기존 레거시 실행형 plan 공식 편입·보존 1개(q02), 기존 공식 plan 수정 0개.

## 판정·증거 기준

- 기준 자료: 현행 고2 유사 JS의 모든 문제 문장·선택지·정답·해설. 기출 PNG/SVG, 직접 연결된 유사 SVG, 해당 레거시 plan, 공식 production 폴더를 별도 대조했다. 원본 자료가 현행 JS와 다르면 **현행 JS**를 유일한 제작 기준으로 채택했다.
- **REQUIRED**: 공간적 연결·교차·필수 조건의 판독에 도식이 필요. **BENEFICIAL**: 필수는 아니지만 문제 해결 또는 해설 이해에 실질적 도움. **EXEMPT**: 문장·수식만으로 충분. 각 문항의 **문제축/해설축을 독립 판정**했으며 두 축은 연동해 자동 승격하지 않았다.
- 문제축의 caption/accessibilityDescription/sourceConditions/newVisualInformation에 답 및 풀이 중간값을 노출하지 않는다. 해설축은 풀이 근거를 허용한다.
- 상태: 각 공식 JSON에 대해 JSON 파싱·엔진 계약, **Shallow lint PASS**, **Full lint PASS**, **STATIC_FIELD_PARITY PASS**, **DRAWN_FEATURE_PARITY PASS(정적 구성요소 대조만)**. Chromium 실행 파일 부재로 **실제 SVG 렌더 RENDER_NOT_RUN**, 실제 시각 검수 **NOT_RUN**. 정적 PASS를 렌더·시각 PASS로 간주하지 않는다.

## 문항별 판정

| 문항 | 문제축 | 해설축 | 현행 JS 기준 독립 판단 근거·대응 공식 plan |
|---:|---|---|---|
| 01 | EXEMPT | EXEMPT | 삼각함수 주기 이동값을 단위원 항등식으로 정리한다. |
| 02 | BENEFICIAL | EXEMPT | 삼각형 두 변 4, 3√2와 끼인각 45°의 배치가 면적식을 돕는다. `q02-problem.plan.json` (레거시 보존). |
| 03 | EXEMPT | EXEMPT | tan3x 주기 π/3과 유일 점근선 π/6을 대수로 얻는다. |
| 04 | EXEMPT | EXEMPT | a₃=10, a₇=26에서 공차 4, a₁₁=42 계산. |
| 05 | EXEMPT | EXEMPT | 등차중항·등비중항의 두 방정식으로 |a|+|b|를 구한다. |
| 06 | EXEMPT | EXEMPT | −3cos(2x+π)+4=3cos2x+4로 범위·주기·극값을 즉시 확인한다. |
| 07 | EXEMPT | EXEMPT | 최댓값 5·최솟값 −1·주기 6이 독립 조건이므로 그래프 없이 a,b,c를 결정한다. |
| 08 | EXEMPT | EXEMPT | sin x=1/4의 두 해가 π/2에 대칭인 성질만으로 중간각의 코사인을 구한다. |
| 09 | BENEFICIAL | EXEMPT | 이등변사다리꼴의 두 같은 대각선이 120°로 교차함을 보여 준다. `q09-problem.plan.json`; 면적=(d²/2)sin120°. |
| 10 | EXEMPT | EXEMPT | S₁과 S₃−S₂의 다항식 차분이다. |
| 11 | EXEMPT | EXEMPT | 10항씩 묶은 등비합의 비 r¹⁰을 계산한다. |
| 12 | BENEFICIAL | EXEMPT | 반지름 6의 외접원과 ∠A45°, ∠B60°의 대응 위치를 나타낸다. `q12-problem.plan.json`; 사인법칙으로 AB 검산. |
| 13 | EXEMPT | EXEMPT | 짝수 위치 삭제를 k회 시행한 항은 1+2ᵏ(j−1)로 표현된다. |
| 14 | EXEMPT | EXEMPT | 월초 적립금과 1.008의 12기간 등비합이다. |
| 15 | EXEMPT | EXEMPT | 두 근의 합·곱을 비에타 식으로 정리하여 매개변수를 정한다. |
| 16 | BENEFICIAL | BENEFICIAL | BC의 삼등분점 P,Q 및 ∠QAP=θ는 `q16-problem.plan.json`; 높이·중점·AP²=7의 직각 관계는 `q16-solution.plan.json`. |
| 17 | EXEMPT | EXEMPT | T(x)<0을 코사인 부등식으로 바꾸고 월 정수만 열거한다. |
| 18 | EXEMPT | EXEMPT | a₂+a₇=a₄+a₅=15, b₁b₈=b₄b₅=50의 수열 대칭으로 해결한다. |
| 19 | BENEFICIAL | EXEMPT | 삼각형의 매 변에서 중앙 1/3을 바깥 돌기로 치환하는 C₁→C₂의 형태를 `q19-problem.plan.json`으로 비교; 둘레 점화식은 대수적으로 충분하다. |
| 20 | EXEMPT | EXEMPT | 제곱합과 2n+1의 약분 뒤 망원합으로 통분한다. |
| 21 | EXEMPT | EXEMPT | 일반항 4n−42의 부호 변화와 합의 최소 인덱스를 비교한다. |
| 22 | EXEMPT | EXEMPT | 판별식을 4cosθ(2cosθ−1)≤0으로 정리한 삼각부등식이다. |

## 원본·도식 대조 및 충돌 분리

- **ORIGINAL_EXAM_PNG_CONFLICT — q02:** 기출 `q02.png`에는 AC=3, BC=2√2, ∠C45°가 있고 현행 유사 JS의 AC=4, BC=3√2, ∠C45°와 수치가 다르다. 현행 JS 및 직접 연결된 유사 `q02-problem.svg`·레거시 q02 plan을 기준으로 공식 plan을 사용했다.
- **ORIGINAL_EXAM_PNG_CONFLICT — q07:** 기출 `q07.png`의 코사인 곡선은 최고 3, 최저 −1, 주기와 극점 배치가 현행 유사 JS의 최고 5, 최저 −1, 주기 6과 다르다. 현행 JS는 세 수치 조건을 문장으로 모두 주므로 이 축은 EXEMPT, 기출 그림을 재사용하지 않는다.
- 기출 `q19.png`는 C₁·C₂·C₃의 코흐 단계 도식. 현행 유사 JS는 그림 참조 없이 변을 삼등분하고 가운데 부분에 바깥쪽 정삼각형을 더한다는 규칙을 완전하게 서술한다. 새 문제 plan은 **한 변의 길이 2를 그대로 유지한** C₁과 C₂만 동일 길이 단위로 나란히 비교하며 화면에 지지되지 않은 둘레 답은 넣지 않았다. 기출의 C₃는 발문이 단계 규칙을 완전하게 규정하므로 문제축에서 생략했다.
- 기출 해설 SVG `q2-solution.svg`, `q9-solution.svg`, `q12-solution.svg`, `q16-solution.svg`를 현행 내용과 구별해 검토했으며, 기출 SVG의 해설 표시를 현행 유사 문제의 기정답으로 전용하지 않는다.
- 관련 원본 폴더에서 **-v2, -v3 변형 SVG 파일 없음**. 확인된 별도 **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT 없음**. 별도 **CONTENT_CONFLICT_SOURCE 없음**. 확인된 **ENGINE_CAPABILITY_PENDING 없음**.

## 공식 plan별 정적 필드·기하 검산

| 공식 JSON | 축 | STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY(정적) | 수학·내용 독립 검산 | 렌더 |
|---|---|---|---|---|
| `q02-problem.plan.json` | P BENEFICIAL | AC4, BC3√2, ∠ACB45°의 삼각형 · PASS/PASS | 넓이 ½·4·3√2·sin45°=6(②) | RENDER_NOT_RUN |
| `q09-problem.plan.json` | P BENEFICIAL | 평행 표식이 있는 두 밑변, 같은 옆변 길이 눈금, 대각선 AC·BD, 교점 각 120° · PASS/PASS | 대표 좌표에서 넓이9√3, AC=BD=6, 두 대각선 교각의 cos=−1/2(③). 넓이 수치는 발문에 주어진 정보이며 선분·각의 그림 라벨로 오표기하지 않음 | RENDER_NOT_RUN |
| `q12-problem.plan.json` | P BENEFICIAL | 외접원·반지름6·A45°·B60° · PASS/PASS | C75°, AB=12sin75°=3(√6+√2)(①) | RENDER_NOT_RUN |
| `q16-problem.plan.json` | P BENEFICIAL | 정삼각형 세 변의 동등 눈금, BC의 BP=PQ=QC 삼등분 눈금, AP·AQ, ∠QAP=θ · PASS/PASS | 대표 BC=3 배치에서 AP=AQ=√7, cosθ=13/14(⑤); 문제축에는 그 값 미노출 | RENDER_NOT_RUN |
| `q16-solution.plan.json` | S BENEFICIAL | 삼등분·정삼각형 눈금, 해설의 대표 BC3, PQ1, 중점 수선 및 AP√7 표시 · PASS/PASS | 피타고라스 AP²=7과 코사인법칙으로 cosθ=13/14 | RENDER_NOT_RUN |
| `q19-problem.plan.json` | P BENEFICIAL | C₁의 원문 길이2를 선분에 표시하고, C₁의 3변과 C₂의 12변·각 변 중앙 1/3의 바깥쪽 돌기를 같은 단위로 배치 · PASS/PASS | lₙ=6(4/3)ⁿ⁻¹, ∑₁⁵lₙ=1562/27(③) | RENDER_NOT_RUN |

- JSON 파싱/공식 계약: **6/6 PASS**; 공식 Shallow lint: **6/6 PASS**; 공식 Full lint: **6/6 PASS**; 두 정적 parity: **6/6 PASS**. 실렌더 **0/6**, RENDER_NOT_RUN **6/6**.
- JS의 선택지·답·해설 재대조: 22문항의 삼각함수·수열·복리·기하·코흐 둘레·판별식 계산에서 **현재 확인된 수학적 자기모순 없음**. q19 원본 PNG의 단계 도형과 기하 연결, q07 구 그래프의 수치 차이를 별개로 기록했다. 미선정 축은 수식으로 충분한 EXEMPT이며 누락이 아니다.
