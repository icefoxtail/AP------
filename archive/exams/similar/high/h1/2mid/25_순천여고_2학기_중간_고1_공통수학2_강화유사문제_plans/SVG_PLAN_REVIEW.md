# SVG 제작용 plan 및 DRAWN_FEATURE_PARITY — 25 순천여고 2학기 중간 고1 공통수학2 강화유사문제 Q01–Q11

- 출처: `archive/exams/similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js`
- 원본 SHA-256: `382f8d371bd2b441a2b7a7dbdbf616f89ede5b0793bfebdb623aae8d9561f360`; Git blob: `9b8383385fca436195bb860e6d093f8cc948fac3`.
- Q08 기제공 원본 PNG: `archive/assets/images/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제/q08.png`, SHA-256 `d2938cbc75d2b743f0b9cb613521da44d247cba3701df1b086f3d124dc6549c8`. 네 조건의 실제 이미지 요소를 읽고 대조함.
- 범위: Q01–Q11, 문제 11축·해설 11축 = **22축**. REQUIRED 1, BENEFICIAL 10, EXEMPT 11. 제작용 JSON **11개**.
- `sourceVsPlan=REVIEWED`(11건); `DRAWN_FEATURE_PARITY=PASS`(11건); `ENGINE_CAPABILITY_PENDING=0`. EXEMPT 11축은 사유를 문항별로 남겼으며 plan 분모에 넣지 않음.
- 공식 `plan-lint.cjs` shallow/full `--jobs 2`: 11/11 OK, FAIL 0, SKIP 0(두 시험지 17개 합산 검사).
- 실제 SVG·PNG 렌더, 실물 관찰, 학생 화면, A4 인쇄, JS 그림 재연결·배포: **NOT_RUN**. 기존 `image:q08.png`를 교체하거나 원본 JS를 수정하지 않음.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY · 개별 사유 |
|---|---|---|---|---|---|---|
| 순천여고 강화유사/Q01 | 문제 | EXEMPT | — | — | — | EXEMPT — 원소·부분집합 기호 비교가 수식으로 완결 |
| 순천여고 강화유사/Q01 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q01-solution.plan.json` | PASS/PASS | PASS — A의 원소 0·1·2와 B의 별도 원소 {0} 소속 표 |
| 순천여고 강화유사/Q02 | 문제 | EXEMPT | — | — | — | EXEMPT — 두 점의 좌표가 문자 a에 의존해 도식이 답을 제한하지 못함 |
| 순천여고 강화유사/Q02 | 해설 | EXEMPT | — | — | — | EXEMPT — 거리공식의 이차식 및 두 근 곱 |
| 순천여고 강화유사/Q03 | 문제 | EXEMPT | — | — | — | EXEMPT — 주어진 A,B,M만으로 삼각형 형태를 그리면 직각 정답 단서 노출 |
| 순천여고 강화유사/Q03 | 해설 | BENEFICIAL | `construction-spike-v1` | `q03-solution.plan.json` | PASS/PASS | PASS — C=2M−B, AB=AC 눈금, A 직각, M 중점 표식 |
| 순천여고 강화유사/Q04 | 문제 | EXEMPT | — | — | — | EXEMPT — 집합 연산 공식 다섯 개의 참거짓 판정 |
| 순천여고 강화유사/Q04 | 해설 | BENEFICIAL | `composite-panels-v1` | `q04-solution.plan.json` | PASS/PASS | PASS — A−B와 B−A의 서로 다른 영역 두 패널 |
| 순천여고 강화유사/Q05 | 문제 | EXEMPT | — | — | — | EXEMPT — n(U),n(A),n(B),바깥 원소 수가 모두 수식으로 주어짐 |
| 순천여고 강화유사/Q05 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q05-solution.plan.json` | PASS/PASS | PASS — 전체 60, A32, B27, 바깥11, 교집합10 위치 |
| 순천여고 강화유사/Q06 | 문제 | BENEFICIAL | `construction-spike-v1` | `q06-problem.plan.json` | PASS/PASS | PASS — A(4,2),B(6,6), 선 x+y=2와 움직이는 P의 PA+PB |
| 순천여고 강화유사/Q06 | 해설 | BENEFICIAL | `construction-spike-v1` | `q06-solution.plan.json` | PASS/PASS | PASS — A′=(0,−2), P=A′B∩(x+y=2), PA=PA′ 눈금 |
| 순천여고 강화유사/Q07 | 문제 | EXEMPT | — | — | — | EXEMPT — 반사 접선·반지름을 미리 그리면 구하는 k의 관계 노출 |
| 순천여고 강화유사/Q07 | 해설 | BENEFICIAL | `construction-spike-v1` | `q07-solution.plan.json` | PASS/PASS | PASS — y=x 대칭 두 직선, 접원·중심 C와 수선 CH 직각 |
| 순천여고 강화유사/Q08 | 문제 | REQUIRED | `construction-spike-v1` | `q08-problem.plan.json` | PASS/PASS | PASS — 원본 PNG의 AB10m, AC=BC, 넓이30m², 내분비3:2 표시 |
| 순천여고 강화유사/Q08 | 해설 | BENEFICIAL | `construction-spike-v1` | `q08-solution.plan.json` | PASS/PASS | PASS — 높이 CD6m와 직각, AP6m/PB4m, CP√37m |
| 순천여고 강화유사/Q09 | 문제 | EXEMPT | — | — | — | EXEMPT — A는 미지 좌표로 완성 도형 제시 시 답 단서 노출 |
| 순천여고 강화유사/Q09 | 해설 | BENEFICIAL | `construction-spike-v1` | `q09-solution.plan.json` | PASS/PASS | PASS — M(2,5),G(4,3),A(8,−1), AG:GM=2:1 중선 |
| 순천여고 강화유사/Q10 | 문제 | EXEMPT | — | — | — | EXEMPT — 일차식의 평행·수직 조건을 기울기로 직접 계산 |
| 순천여고 강화유사/Q10 | 해설 | EXEMPT | — | — | — | EXEMPT — a=−6,b=2/3 연립식과 곱 −4 |
| 순천여고 강화유사/Q11 | 문제 | EXEMPT | — | — | — | EXEMPT — 유한집합 교집합·서로소 조건이 문자로 완결 |
| 순천여고 강화유사/Q11 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q11-solution.plan.json` | PASS/PASS | PASS — A∩B={6,18}과 A−B={1,2,3,9} 구분 |

## 원문 ↔ 실제 그리기 필드 1:1 확인

1. **Q01 해설** `diagram.elements`: `0,1,2`는 A의 원소이고 `0,2,{0}`는 B의 원소. `{0}`와 `0`의 다른 텍스트 행 및 소속 칸을 직접 표시.
2. **Q03 해설** `SOURCE_POINT A(0,0),B(3,4),M(7/2,1/2)`; `POINT_REFLECTION(B,M)`으로 `C(4,−3)`를 계산. `displaySegments[sAB,sAC,sBM,sMC]`, `planeMarks.equalLengths[eSides,eMid]`, `rightAngles[raA]`에 등변·중점·직각 표식 실재.
3. **Q04 해설** `composite-panels-v1`의 두 `VENN` 패널에서 `shade=A-B`와 `shade=B-A`를 각각 실제 영역으로 그려 차집합의 방향 차이 비교. 면 채움이 수학적 목적을 갖는 유일한 예외.
4. **Q05 해설** `universe.count=60`, `sets[A].count=32`, `sets[B].count=27`, `elements`의 공통10·외부11을 교집합·바깥 영역에 배치. 원소 수는 도식의 수치 표시로서 원의 면적 비율을 뜻하지 않음.
5. **Q06 문제** `SOURCE_POINT A(4,2),B(6,6)`, `SOURCE_LINE L:x+y−2=0`, `P(1,1)`은 선 위의 **임의 예시**이고 `displaySegments[sAP,sPB]`로 두 거리만 표시. 대칭점과 최솟값 경로는 문제 그림에서 숨김.
6. **Q06 해설** `LINE_REFLECTION(A,L)=A′(0,−2)`, `P=LINE_INTERSECTION(L,LINE_THROUGH(A′,B))`, `displaySegments[sAP,sArP,sPB]`와 `equalLengths[eMirror]`가 `PA=PA′`를 실제 눈금으로 표시.
7. **Q07 해설** `LINE_THROUGH(A,B)`는 `2x−y−5=0`, `LINE_REFLECTION(A,AXIS)` 및 고정점 `B(5,5)`로 대칭선 `x−2y+5=0` 형성. 원 중심 `C(6,−2)`, 반지름 `√45=3√5`, `H=PERPENDICULAR_FOOT(C,TRANS)`, `rightAngles[raH]`와 `expressionLabels[radiusK]=k`. 축 위에 있는 B를 다시 반사하지 않음.
8. **Q08 문제** 실제 원본 PNG의 네 정보: (i) `dimensions[dAB]`에 `AB=10m`, (ii) `equalLengths[eLeg]`에 `AC=BC`, (iii) `textLabels[area]`에 `넓이 30m²`, (iv) `DIVISION_POINT(P;3,2)`와 `textLabels[ratio]`에 `AP:PB=3:2`. `displaySegments`는 AP/PB/AC/BC이며 CP와 최종 길이를 그리지 않음. 좌표 A(0,0),B(10,0),C(5,−6)는 원본의 아래로 향한 도형과 주어진 넓이를 만족하는 대표 배치.
9. **Q08 해설** 위 네 관계에 더해 `MIDPOINT D=(5,0)`, `displaySegments[sCD]` 점선·`rightAngles[raD]`, `expressionLabels[h]=6m`, `expressionLabels[ap]=6m`, `expressionLabels[pb]=4m`, `expressionLabels[cp]=√37m`; `textLabels[area]`는 여전히 넓이 30m². 실제 CP 길이는 `√((6−5)²+(0+6)²)=√37`.
10. **Q09 해설** `SOURCE_POINT M(2,5),G(4,3)`와 `DIVISION_POINT(M,G; EXTERNAL m=3,n=2)`에서 `A=(8,−1)`. `displaySegments[sMG,sGA]`의 길이 라벨 `t,2t`가 `AG:GM=2:1`, `sOA`가 구하는 거리 OA에 대응.
11. **Q11 해설** `diagram.elements`가 A만 `1,2,3,9`, A·B 공통 `6,18`, B만 `12,24,30`을 표시; `A∩X=X`와 `B∩X=∅`에서 X의 선택 가능 원소 네 개를 확인.

### 판정 기준 및 후속 인계

- 수학적으로 원문의 실제 값과 그리기 필드를 대조하였고, 그림 렌더 결과를 확인한 것으로 **보고하지 않음**(`render/PNG/학생화면/A4=NOT_RUN`).
- 문제 그림에는 해설에서 도출하는 정답값·최단 거리·반지름·직각 종류를 미리 적지 않음.
- 기본 면 채움 없음. **Q04 해설**의 두 차집합 비교만 영역 구분을 위해 `shade` 사용.
- 엔진의 미지원 표식·좌표·각·길이 없음(`ENGINE_CAPABILITY_PENDING=0`).
