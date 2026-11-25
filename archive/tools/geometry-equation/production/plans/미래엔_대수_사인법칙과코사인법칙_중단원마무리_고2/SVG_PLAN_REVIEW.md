# 미래엔 대수 — 사인법칙과 코사인법칙 중단원 마무리 / 첫 묶음 q01–q09

- 원본 JS: `archive/exams/textbooks/미래엔_대수/미래엔_대수_사인법칙과코사인법칙_중단원마무리_고2/미래엔_대수_사인법칙과코사인법칙_중단원마무리_고2.js`
- 원본 SHA-256: `8471c56ce7cfa8297a646b59f6aedecd1f1aeefbe5c9b4aeba5667eb066e3bda`
- 전체 16문항 중 q01–q09(문제 9축, 해설 9축), q10–q16 미작업. q07 원본 문제 그림 `q7.png`는 실재를 열어 확인했고 그대로 유지한다.

| qid | 문제 그림 판정·개별 사유 | 해설 그림 판정·개별 사유 | 실제 제작 plan | shallow / full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — a=8sinA와 반지름 공식뿐이라 삼각형 형태가 결정되지 않는다 | EXEMPT — a/sinA=2R 직접 대입, 삼각형은 장식 | — | N/A | N/A |
| q02 | BENEFICIAL — A=60°, B=45°, BC=4√3의 위치와 대각 관계를 보여 준다. b·R 답은 비노출 | EXEMPT — 동일 문제 그림 위에서 사인법칙으로 계산하므로 복제 그림 불필요 | `q02-problem.plan.json` | PASS / PASS | PASS |
| q03 | EXEMPT — 두 소문항의 주어진 변·각은 텍스트로 충분하다 | BENEFICIAL — (⑴ 끼인각→변, ⑵ 세 변→각)의 코사인법칙 관계를 두 삼각형으로 비교 | `q03-solution.plan.json` | PASS / PASS | PASS |
| q04 | EXEMPT — 두 쌍의 변과 끼인각 숫자가 모두 제시된다 | BENEFICIAL — 135°·150° 둔각 위치와 넓이 공식에 쓰는 두 변을 두 패널로 보인다 | `q04-solution.plan.json` | PASS / PASS | PASS |
| q05 | EXEMPT — 일반 삼각형의 둘레·외접원 반지름만 주어진다 | EXEMPT — 12(sinA+sinB+sinC)=20의 비례식, 구체적 위치 도식 불필요 | — | N/A | N/A |
| q06 | EXEMPT — A=60°, b=4√2, R=4를 통해 사인법칙에 직접 대입한다 | EXEMPT — sinB=√2/2에서 B=135°가 삼각형 내각합을 어긴다는 수치 검토로 충분하다 | — | N/A | N/A |
| q07 | REQUIRED·**기존 PNG 충족** — 문제 본문의 `q7.png`에 사람·드론, 80m, 75°·45°가 이미 보인다; 새 문제 그림을 중복 제작하지 않는다 | BENEFICIAL — M·J·D 삼각형, 각 D=60°, 거리 DM을 이용한 사인법칙 대각 관계 | `q07-solution.plan.json` (문제 PNG는 존치) | PASS / PASS | PASS |
| q08 | EXEMPT — 세 변 4·5·7이면 가장 긴 변의 대각이 결정된다 | EXEMPT — cosθ=(16+25−49)/40을 바로 계산하며 그림은 중복 | — | N/A | N/A |
| q09 | BENEFICIAL — BC=5, CA=3, C=120°만 표시하고 미지 c·반지름 R 비노출 | BENEFICIAL — 코사인법칙으로 새로 얻는 AB=7을 그려 사인법칙의 대각 120°와 연결 | `q09-problem.plan.json`, `q09-solution.plan.json` | 각 PASS / PASS | 각각 PASS |

## 원문 → 실제 그려지는 필드의 1:1 검수

1. **q02 문제**: `SOURCE_POINT B=(0,0), C=(4√3,0)`에서 √3은 `typedScalar expression`으로 정확히 계산된다. `POLAR_POINT`의 B 45°와 유도한 C 75° 광선을 교차해 A를 놓으므로 ∠A=60°, ∠B=45°, |BC|=4√3가 동시에 참이다. `planeMarks.angles`가 60·45의 호/숫자를, `planeMarks.expressionLabels[lenA]`가 **실제 변 BC 위의 `4sqrt(3)`**을 그린다. 답 b=4√2와 R=4는 문제 그림 필드에 없다.
2. **q03 해설**: ⑴ `A=(0,0), B=(3,0), C=POLAR(A,B,6,60°)`에서 AB=3, AC=6, BC=3√3. ⑵ `A=(0,0), B=(3,0), C=POLAR(A,B,2,60°)`에서 AB=3, AC=2, BC=√7. 양 패널의 `expressionLabels`에 실제 변 값이 있고 `angles`에 60° 호가 있으며, ⑵는 해설축이므로 구한 A=60°를 표시한다.
3. **q04 해설**: ⑴ B=(0,0), C=(4,0), A=(−1,1)에서 BA=√2, BC=4, ∠B=135°. ⑵ AB=10, AC=6을 정확한 `POLAR_POINT(A,B,6,150°)`로 만들고 ∠A=150°. 두 패널의 `expressionLabels`에 해당 변 길이, `angles`에 135°·150°가 그려진다. 넓이 문제이지만 실제 채움이 필요하지 않아 **면색은 없음**.
4. **q07 해설**: M=(0,0), J=(80,0)에서 75°·45° 방향 광선의 교점을 D로 구한다. `angles`는 M=75°, J=45°, D=60°를 표시한다. `dimensions[distMJ]`는 M–J에 **80 m와 실제 거리 80**을 표시하고, `displaySegments[sMD].emphasis`는 구하는 DM을 굵게 한다. 독립 길이 계산 DM=80√6/3. 원본 PNG도 같은 왼쪽 75°, 오른쪽 45° 구도임을 실제 열어 확인했다.
5. **q09 문제/해설**: C=(0,0), B=(5,0), A=POLAR(C,B,3,120°)로 BC=5, CA=3, AB=7이 정확히 성립한다. 두 plan 모두 `angles[angC]`에 120°, `expressionLabels`에 BC=5·CA=3을 그린다. **문제축**은 AB 라벨과 반지름 답을 모두 생략, **해설축**만 실제 `expressionLabels[lenC]`에 AB=7을 추가한다.

검증: 공식 `plan-lint.cjs --shallow` **6/6 PASS**, 공식 full **6/6 PASS**. 별도 독립 Node 계산으로 원본의 수치·라벨·각·선분과 plan의 그려지는 필드를 재검산하여 `DRAWN_FEATURE_PARITY` **6/6 PASS**. 문제 정답 노출 0, 도형 면색 0. `ENGINE_CAPABILITY_PENDING` **0**(현재 식별된 필수 그리기 기능 누락 없음). PNG 실물 렌더 결과·학생 화면·A4·JS 신규 자산 연결은 전부 **NOT_RUN**이다.
