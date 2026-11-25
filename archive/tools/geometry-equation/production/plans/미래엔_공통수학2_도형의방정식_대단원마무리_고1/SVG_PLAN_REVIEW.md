# 미래엔 공통수학Ⅱ 도형의 방정식 대단원 마무리 — 2축 판정 (q01–q08)

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_도형의방정식_대단원마무리_고1/미래엔_공통수학2_도형의방정식_대단원마무리_고1.js`
- 범위: 18문항 중 q01–q08, **8문항·16축**. q09–q18은 후속 배치로 남긴다.
- 문제축은 각 항목의 좌표·식·조건이 원문만으로 완결되므로 8축 모두 EXEMPT. 풀이나 정답을 문제 그림으로 미리 공개하지 않는다.
- 신규 plan은 해설 5축이며 면 채움·손 SVG·원문 JS/PNG 변경은 없다.

| qid | 문제 축 개별 판정 | 해설 축 개별 판정 | capability | 해설 plan | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 내분비와 두 좌표축 조건이 텍스트로 충분 | BENEFICIAL — 내분점 P,Q의 위치와 비율 관계를 시각화 | construction-spike-v1 | `q01-solution.plan.json` | PASS: A(-1,4), B(3,-1), P(11/5,0), Q(0,11/4); AP:PB=4:1, AQ:QB=1:3 |
| q02 | EXEMPT — 직선식·지나는 점의 대입 문제 | EXEMPT — 평행 기울기 3, 식 y=3x−12, k=−10의 단순 계산 | — | — | N/A |
| q03 | EXEMPT — 세 직선의 계수 조건만 제시 | EXEMPT — 기울기 곱·동일 기울기로 a=4,b=8를 즉시 계산 | — | — | N/A |
| q04 | EXEMPT — A,B의 좌표만 필요 | BENEFICIAL — 중점·수직이등분선·원점으로부터의 거리를 한 그림에 제시 | construction-spike-v1 | `q04-solution.plan.json` | PASS: A(−2,−4), B(4,8), M(1,2), 직선 x+2y−5=0, OM=√5 |
| q05 | EXEMPT — 두 직선식과 기울기 부호가 제시 | BENEFICIAL — 두 직선과 음의 기울기 각 이등분선의 실제 방향을 비교 | multi-curve-figure-v1 | `q05-solution.plan.json` | PASS: y=−3x+2, y=x/3+2, y=−x/2+2, 공통 (0,2) |
| q06 | EXEMPT — 원 위의 점 2개와 중심의 y축 조건만 제시 | BENEFICIAL — 중심과 두 반지름이 같은 원을 나타냄 | construction-spike-v1 | `q06-solution.plan.json` | PASS: 중심 (0,3), 반지름² 20, 두 점 (4,5),(−2,−1) |
| q07 | EXEMPT — 원 위 세 점의 좌표만 제시 | BENEFICIAL — 세 점과 외접원의 실제 중심을 비교 | construction-spike-v1 | `q07-solution.plan.json` | PASS: 중심 (2,4), 반지름² 20, 세 점 (0,0),(4,0),(−2,6) |
| q08 | EXEMPT — 원의 표준형과 매개변수 k 조건 | EXEMPT — 반지름²=12−k>0 한 부등식으로 끝남 | — | — | N/A |

- `plan-lint.cjs --shallow`: 5/5 PASS; `plan-lint.cjs` full: 5/5 PASS.
- 독립 좌표·기울기·원 방정식 재계산에서 도안의 점/좌표/선분/라벨/비율/직각(해당 없음)을 원문 및 해설과 비교해 **DRAWN_FEATURE_PARITY 5/5 PASS**.
- 학생용 실제 SVG 출력물의 육안·인쇄 QA는 후속 렌더 담당 작업이며, 이 배치는 엔진 입력 JSON과 공식 lint까지 검수한다.
