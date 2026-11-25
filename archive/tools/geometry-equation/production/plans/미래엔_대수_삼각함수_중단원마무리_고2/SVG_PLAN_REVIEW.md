# 미래엔 대수 — 삼각함수 중단원 마무리: SVG plan 두 축 검수 (q01–q09)

- 원문: `archive/exams/textbooks/미래엔_대수/미래엔_대수_삼각함수_중단원마무리_고2/미래엔_대수_삼각함수_중단원마무리_고2.js`
- 원문 SHA-256: `41610e884e61e2afa3aec95d4a75cb46a1156ed768cb67a13a230735dafd55a8`
- 범위: q01–q09 **9문항, 18축**. 전체 17문항 중 q10–q17은 별도 배치.
- `PASS`: plan 필드와 원문을 좌표·선분·라벨·각·길이·비율로 1:1 대조했고 엔진 shallow/full lint가 OK. PNG·브라우저·교과서 페이지 반영은 별개 NOT_RUN.

| qid | 축 | 판정 및 개별 이유 | capability / 파일 | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT: 1004°와 −16π/3의 일반각 계산만 요구, 원문 도형 미제공. | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT: 각을 284°·120°로 환원한 뒤 사분면을 판별하는 수치 나눗셈; 여러 회전의 동경을 도식화할 추가 원문 정보 없음. | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT: 도·라디안 단위 환산식 네 항목. | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT: 180°=π의 비례 계산. | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT: 반지름 10과 호 6π만 주어진 기초 식; 도형은 계산을 완료하는 해설에 배치. | — | N/A | EXEMPT |
| q03 | 해설 | DRAWN: 실제 부채꼴에서 반지름 10·호 6π·도출 중심각 3π/5(108°)를 서로 다른 위치에 표시. | construction-spike-v1 / `q03-solution.plan.json` | OK/OK | PASS |
| q04 | 문제 | EXEMPT: 좌표 P(−2,1)의 정의형 계산, 해설 도형 한 개로 충분. | — | N/A | EXEMPT |
| q04 | 해설 | DRAWN: 제2사분면의 동경과 수선, 수평 2·수직 1·빗변 √5의 관계 확인. | construction-spike-v1 / `q04-solution.plan.json` | OK/OK | PASS |
| q05 | 문제 | EXEMPT: sin(7π/6), cos(−5π/4), tan(10π/3)의 표준각 값 직접 계산. | — | N/A | EXEMPT |
| q05 | 해설 | EXEMPT: 주기·기준각·부호 환원만으로 해설이 완성됨. | — | N/A | EXEMPT |
| q06 | 문제 | EXEMPT: θ∈(π/2,π)와 4θ의 동경이 일치하는 수식 조건. | — | N/A | EXEMPT |
| q06 | 해설 | EXEMPT: 3θ=2nπ와 θ 구간의 정수 n 선택만 필요. | — | N/A | EXEMPT |
| q07 | 문제 | EXEMPT: sinθcosθ<0, sinθtanθ<0의 기호 조건. | — | N/A | EXEMPT |
| q07 | 해설 | EXEMPT: 삼각함수 부호표에 대응하는 제2사분면 판정; 표가 아니라 일련의 논리 추론. | — | N/A | EXEMPT |
| q08 | 문제 | EXEMPT: 제3사분면과 tanθ=3/4만 주어진 문제는 수치를 정하지 않으며 해설 그림에 모형 배치. | — | N/A | EXEMPT |
| q08 | 해설 | DRAWN: 제3사분면의 음의 x·y, 수평 4·수직 3·빗변 5인 닮음 모형을 정확히 표시. | construction-spike-v1 / `q08-solution.plan.json` | OK/OK | PASS |
| q09 | 문제 | EXEMPT: sinθ+cosθ=2/3의 항등식 계산. | — | N/A | EXEMPT |
| q09 | 해설 | EXEMPT: (sinθ+cosθ)³ 전개와 sinθcosθ 치환만 필요. | — | N/A | EXEMPT |

## 1:1 DRAWN_FEATURE_PARITY — 표시되는 정보만

1. **q03 해설:** `O→A` 반지름 10, `O→B`도 같은 10. `∠AOB=108°=3π/5`, `arc(A,B)`의 호 길이는 `10×(3π/5)=6π`. `planeMarks.arcs[arc]`의 MATH 라벨 `6pi`, 반지름 라벨 `10`, angle `108°`. 원문에 없는 O·A·B 이름 숨김. 원 외곽 전체 원은 비표시; 내부 면 채움 없음.
2. **q04 해설:** 원문 `P=(-2,1)`; `O=(0,0)`, `H=(-2,0)`, `OH=2`, `HP=1`, 수선 `OH⊥HP`, `OP=√5`. 제2사분면의 x 음수·y 양수와 `sinθ=1/√5`, `cosθ=-2/√5`, `tanθ=-1/2`에 일치. 수선의 발 이름 숨김.
3. **q08 해설:** 닮음 배치의 `P=(-4,-3)`, `H=(-4,0)`, `O=(0,0)`. `OH=4`, `HP=3`, `OP=5`, 직각 `OH⊥HP`; `tanθ=(-3)/(-4)=3/4`. 이 해설 그림의 정수 좌표는 절댓값 기준으로 만든 모형이지 원문이 특정 P의 좌표를 주었다고 주장하지 않는다. 제3사분면에서 sin·cos는 음수이며 각각 −3/5, −4/5로 일치.

**엔진 capability pending:** 없음. **렌더·게시 QA:** NOT_RUN.
