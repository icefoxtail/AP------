# 미래엔 공통수학Ⅱ 평면좌표와 직선의 방정식 중단원 마무리 — SVG plan 검수

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_평면좌표와직선의방정식_중단원마무리_고1/미래엔_공통수학2_평면좌표와직선의방정식_중단원마무리_고1.js`
- 기준 main: `00f170df9377fe59a84a491afdfb204f9142580e`; 원문 SHA-256: `04f387637bc112c5ed0abdef5a9552441be620eeb4261af29e073f0218ab1449`.
- 범위: q01~q05 **5문항·10축**. q06~q11은 이번 배치에 포함하지 않았다.

| qid | 문제축 판정·사유 | 해설축 판정·사유 | capability | 제작용 plan | lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 좌표만으로 두 거리 정의 충분 | BENEFICIAL — ⑴은 직접 차이 계산, ⑵는 직각삼각형으로 Δx·Δy를 확인 | construction-spike-v1 | `q01-solution.plan.json` | PASS/PASS | PASS: A(−5,1), B(−2,6), H(−2,1), 3·5, 직각 |
| q02 | EXEMPT — A·B와 3:2, 1:2가 모두 명시됨 | BENEFICIAL — ⑴ 수직선 내분은 공식으로 충분, ⑵는 세 등분 표식이 비율을 나타냄 | construction-spike-v1 | `q02-solution.plan.json` | PASS/PASS | PASS: P(3,1), AP=PQ=QB, 1:2 시각 표식 |
| q03 | EXEMPT — 평행·수직 조건과 기준 직선식 완결 | BENEFICIAL — ⑴ 같은 기울기는 계산만, ⑵ 수직 두 직선의 각을 확인 | construction-spike-v1 | `q03-solution.plan.json` | PASS/PASS | PASS: y=2x−1, P(1,−3), K⊥L 및 직각 |
| q04 | EXEMPT — 점과 직선식만으로 거리 요구 완결 | BENEFICIAL — 수선의 발·직각·길이 3이 공식과 연결됨 | construction-spike-v1 | `q04-solution.plan.json` | PASS/PASS | PASS: L:3x−4y+11=0, H(11/5,22/5), PH=3, 직각 |
| q05 | EXEMPT — 문제에서 아직 미지인 a를 그림에 공개하지 않음 | BENEFICIAL — a=0,2의 두 직각삼각형을 독립 패널로 비교 | composite-panels-v1 / PLANE_FIGURE_v1 | `q05-solution.plan.json` | PASS/PASS | PASS: 두 패널에서 ∠ACB=90°, 서로 다른 C 좌표 |

## DRAWN_FEATURE_PARITY 독립 대조

- q01: ⑵ A(−5,1), B(−2,6); `PERPENDICULAR_FOOT(A,x=−2)`의 H=(−2,1). `displaySegments`의 AH, HB, AB와 `planeMarks.expressionLabels`의 **3·5**, `rightAngles[A,H,B]`로 두 제곱항이 실제 화면에 연결된다. ⑴ A(3),B(−7)은 텍스트 차이 10이 충분하므로 plan 범위를 ⑵라고 caption에 명시했다.
- q02: ⑵ A(6,2), B(−3,−1)이고 `DIVISION_POINT(A,B;1:2)`로 P=(3,1), `MIDPOINT(P,B)`로 보조 분할점 (0,0). `displaySegments[AP,PQ,QB]` 모두의 **동일 길이 표식**(`planeMarks.equalLengths`)이 AP:PB=1:2를 글 설명이 아닌 획으로 드러낸다. 보조점의 이름만 숨기고 표식은 유지한다. ⑴은 x=4 단순 내분 공식이라 별도 그림을 만들지 않는다.
- q03: ⑵ 기준선 2x−y−1=0, P(1,−3). 파생 `PERPENDICULAR_THROUGH(P,L)`는 x+2y+5=0이다. 교점 I=(−3/5,−11/5), 기준선 위 보조점 Q=(1,1)로 `rightAngles[Q,I,P]`의 내적이 0임을 별도 계산했다. `lineLabels`는 공식 엔진이 허용하는 SOURCE_LINE L만 적용하고, 파생선 K에는 허위 식 라벨을 만들지 않는다.
- q04: L:3x−4y+11=0에서 P(4,2)의 대입값은 15, 법선 크기는 5. H=(11/5,22/5), PH=(9/5,−12/5)의 길이 3. `PERPENDICULAR_FOOT`와 실제 `rightAngles[P,H,Q]`(Q=(−1,2)는 L 위) 및 `planeMarks.expressionLabels[PH=3]`을 확인했다.
- q05: AB²=2²+(−8)²=68. C=(1,a)에서 CA²+CB²=2a²−4a+68, 따라서 a(a−2)=0이다. 패널 C=(1,0)와 C=(1,2)에서 각각 `rightAngles[A,C,B]`가 실제 90°이며, A와 B는 두 패널에서 같고 C 값은 각각 그 패널의 caption에만 표기한다. 문제용 그림에는 두 해를 넣지 않았다.
- 도형 내부 면 채움 없음. 단위와 라벨의 원문 숫자 외 임의 정답 값이 **문제 그림**에 노출될 가능성 없음(문제 plan 0).
- SVG 렌더/PNG/학생 화면/A4/JS 링크: **NOT_RUN**.

**집계:** 5문항 / 10축 판정 / 제작 plan 5 / shallow 5 PASS / full 5 PASS / parity 5 PASS / capability pending 0건.
