# 21_제일고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 실물 이미지 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. 해설 `KEEP_MATH`는 런타임 PASS가 아니다.

## 원본·검수 범위

- 원본 `archive/exams/original/high/h2/1final/21_제일고_1학기_기말_고2_수학I.js`, Git blob `a86a70e7e9a0e01019953cc3d6a7debeede099a5`, **24문항**.
- 정답·풀이 및 객관식 선택지/서술형 조건의 수치·경계 대조: **KEEP_MATH 24 / HOLD_MATH 0**.
- 현행 참조 이미지 **12개(PNG 3, SVG 9)**: PNG 직접 열람과 SVG Inkscape→PNG 렌더 성공 **12/12**. 원본 스캔의 가독성 개선 **2건(Q04, Q15)** 및 해설 도식 명료화 **1건(Q23)** 예약; 문제풀이 오류와 분리.
- `q17_question-v2.svg`, `q22_question-v2.svg`가 현재 발문의 사용 자산임. 이전 PNG 파일은 활성 참조 목록에서 제외함.
- 학생 앱·모바일·MathJax·preflight/CI·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (24/24)

| Q | 발문 식별 | 정답 | 독립 계산·조건 확인 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | Σ(a−2b+1) | ⑤ | 9−2·8+12=5. | 없음 | KEEP_MATH |
| 02 | aₙ₊₁=2aₙ+1,a₁=1 | ③ | aₙ=2ⁿ−1→a₈=255. | 없음 | KEEP_MATH |
| 03 | a₁=5,a₄+a₅=31 | ④ | 10+7d=31,d=3,a₉=29. | 없음 | KEEP_MATH |
| 04 | 교량 삼각측량, AB20·A75°·B60° | ② | P에서 각45°; 사인법칙 AP=20sin60°/sin45°=10√6. | q04.png, q4-solution.svg | KEEP_MATH |
| 05 | 세 변 5,6,7 삼각형 넓이 | ① | Heron s=9, Δ=√(9·4·3·2)=6√6. | q5-solution.svg | KEEP_MATH |
| 06 | Σlog₃(1+1/k), 1..80 | ④ | log₃∏(k+1)/k=log₃81=4. | 없음 | KEEP_MATH |
| 07 | a₅−a₃=S₅−S₃ | ② | 2d=a₄+a₅, 조건 대입→d=−2. | 없음 | KEEP_MATH |
| 08 | x,4,y 등차; x,−3,y 등비 | ④ | x+y=8,xy=9→x²+y²=64−18=46. | 없음 | KEEP_MATH |
| 09 | 외접원 R, 삼각형 변 곱·넓이 | ⑤ | abc=18√21, Δ=9√3/2 →R=abc/(4Δ)=√7. | 없음 | KEEP_MATH |
| 10 | −5,31 사이 n개 등차수 삽입 | ⑤ | 전체합130→10항(삽입 8개), d=4, a₅=−5+5d=15. | 없음 | KEEP_MATH |
| 11 | Sₙ=3·2^(n+1)+2k 등비 판정 | ① | 부분합의 상수항이 사라져야 함→k=−3. | 없음 | KEEP_MATH |
| 12 | Sₙ=n/(n+1), 1/a₄ | ② | a₄=4/5−3/4=1/20 →20. | 없음 | KEEP_MATH |
| 13 | 연 2% 선불 연금 10회 | ⑤ | 매년 20만원·1.02·(1.2−1)/0.02=204만원. | 없음 | KEEP_MATH |
| 14 | aₙ+aₙ₊₁=n+1, Σaₙ | ④ | 10개 인접 쌍의 합 2+4+⋯+20=110. | 없음 | KEEP_MATH |
| 15 | 정육면체 모서리2·I 중점·∠AIG | ① | AI²=IG²=5, AG²=12→cos∠AIG=(5+5−12)/(2·5)=−1/5. | q15.png, q15-solution.svg | KEEP_MATH |
| 16 | Σk/2ᵏ 귀납의 빈칸 | ② | Σk/2ᵏ=2−(n+2)/2ⁿ; p=1/2, f(3)=1/4,g(4)=7/32 →요구비 4/7. | 없음 | KEEP_MATH |
| 17 | 지름6인 원, AC²=18+9√2 | ⑤ | R3, 중심각 BOC=π/4, 호 BC=3π/4. | q17_question-v2.svg, q17-solution.svg | KEEP_MATH |
| 18 | aₙ₊₁= aₙ−2 또는 −aₙ | ③ | x∈(0,4)인 초기값 분기 추적, S₁₈=4 유일 x=3. | 없음 | KEEP_MATH |
| 19 | 직각삼각형 AB6,BC8, AP7 투영 | ① | AP 지름의 원에서 각 QAR=A; QR=AP·sinA=7·8/10=28/5. | q19.png, q19-solution.svg | KEEP_MATH |
| 20 | aₙ∈{0,1,3}, Σa=17,Σa²=47 | ③ | 3의 개수5·1의 개수2→Σa³=5·27+2=137. | 없음 | KEEP_MATH |
| 21 | [서술형] 등비수열 S₆/S₃=28 | 9 | 1+r³=28 →r=3, a₅/a₃=r²=9. | 없음 | KEEP_MATH |
| 22 | [서술형] 원내접 사각형 AD2,CD3,B60° | 3√3/2 | D120°, 삼각형 ACD 넓이=(1/2)·2·3·sin120°=3√3/2. | q22_question-v2.svg, q22-solution.svg | KEEP_MATH |
| 23 | [서술형] 삼각형 ABC, BC2√3·코사인 식 | 4π | cos²A=1/4, A 조건에서 sinA=√3/2, R=BC/(2sinA)=2→원 넓이4π. | q23-solution.svg | KEEP_MATH |
| 24 | [서술형] Σk²aₖ=n²+n | 11 | aₖ=2/k, Σ₁¹¹ 6aₖ/(k+1)=12(1−1/12)=11. | 없음 | KEEP_MATH |

## 실제 참조 이미지 렌더 검수 (12/12)

기준 폴더 `archive/assets/images/21_제일고_1학기_기말_고2_수학I/`. Git blob SHA 고정; PNG 원본 및 SVG 렌더 결과의 연락시트를 시각적으로 검토.

| Q | 파일 | blob SHA | 렌더·시각 판정 |
|---:|---|---|---|
| 04 | q04.png | 02081a377902cdaaa67fb2903e0e8d50f7a26037 | **VISUAL_UPGRADE:** 교량 원본 스캔에 심한 노이즈·저대비. 점명/선분 식별이 어렵고 깨끗한 도식 재제작 권장 |
| 04 | q4-solution.svg | 091ae89f09ff0e5c7e9d12d202467f549a17b6ab | 해설용 삼각측량 도식 선명 |
| 05 | q5-solution.svg | 985ff083f6a804a55f100ebbc2aa92512bb1d8b4 | 세 변과 높이 확인 |
| 15 | q15.png | 01bf9c1b2e676b134c329c8f851fce73ba3c993f | **VISUAL_UPGRADE:** 입방체 점명·중점 표기에 원본 스캔 노이즈. 깨끗한 공간도형 벡터 대체 권장 |
| 15 | q15-solution.svg | 8445695db4745d21a436eacb2881401c172cf14c | 해설 평면 삼각형 AIG 명료, 원본 입방체 자체의 대체는 아님 |
| 17 | q17_question-v2.svg | bb7b1de10dc712297371261c85ba58db266ac7a6 | 호·지름·중심각 문제 도식 선명 |
| 17 | q17-solution.svg | 9a6291fb60d152d29c681331458ad5d3525945de | 호 BC 중심각 렌더 |
| 19 | q19.png | 980bfd4676c6937e6a28f9f38431ca57efcc5586 | 투영점과 변 길이 판독 |
| 19 | q19-solution.svg | 7a90eb78bc2526adc1aa71ce5002d07bc9c9a993 | 직각·원주각 관계 도식 렌더 |
| 22 | q22_question-v2.svg | d9f453958cf43d0bd94c8bceddd123eefba16d73 | 원내접 사각형과 AD·CD·B 명료 |
| 22 | q22-solution.svg | f763258ca571ab47c51c50356fcc9dad1ac18869 | 대각선·D120° 연산 도식 |
| 23 | q23-solution.svg | 28851c54898ce808141dbeed9ea6c35c2982c318 | **VISUAL_UPGRADE:** A60°/120° 두 경우 비교 의도는 맞지만 원 밖에 분리된 `O—2—C` 길이선과 중복 C 라벨이 실제 원 반지름처럼 연결되지 않아 혼란. 원 내부 반지름 OC=2로 다시 표현 권장 |

## 엔진 인계

- **이미지 개선 예약 3개:** Q04 `q04.png`(교량), Q15 `q15.png`(정육면체)는 실제 라벨·치수·시점 그대로 깨끗한 벡터 재제작. Q23 `q23-solution.svg`는 두 경우의 원 내부에 반지름 2를 직접 그려 원 밖 분리 길이선/중복 C 라벨을 제거. 미수정 상태이며 수학 계산은 KEEP.
- Q17/Q22는 기존 PNG보다 현행 `*_question-v2.svg`가 학생 발문에 사용되므로 엔진 검수 시 사용 자산을 혼동하지 말 것.
- 학생 UI 크롭·확대/축소/수식/CI 및 출고 검증은 **NOT_RUN**.
