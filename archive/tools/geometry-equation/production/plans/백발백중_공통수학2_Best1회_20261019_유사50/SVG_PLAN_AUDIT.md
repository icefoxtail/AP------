# 백발백중 공통수학2 Best1회 20261019 유사50 — 문제·해설 2축 판정

- source: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_Best1회_20261019_유사50.js`
- source Git blob: `92c07b22218cb6423dc72a071e28fc5eafb530a3` (작업 시작 main `f0e4e402b6c0c9f12c08b07fe34326d44b3a7964`)
- coverage: **q01–q19**, 총 **19문항/38축**. q20–q50은 이번 배치 미판정.
- `BENEFICIAL/REQUIRED — EXISTING_SVG`는 JS에 이미 SVG 경로가 있고 Git에 자산이 존재하므로 **중복 신규 plan을 쓰지 않은 축**이다. 제작 plan 또는 린트·PARITY 완료 건수에 포함하지 않는다.
- 신규 plan **9개**: `plan-lint.cjs --shallow` 9/9 PASS, full 9/9 PASS; `DRAWN_FEATURE_PARITY` 필드 대조 9/9 PASS. `ENGINE_CAPABILITY_PENDING` 0. **실제 SVG/PNG 렌더·학생화면·A4 검수 NOT_RUN**.
- 문제축 q09·q10의 P는 발문에 위치가 정해지지 않아, 임의의 **예시 위치**만 그렸다. `coordinateLabels`에서 P의 숫자는 표시하지 않았으며, 최적 위치·최솟값·면 채움은 그리지 않았다.

## 문항별 두 축

| qid | 문제 판정·근거·plan | 해설 판정·근거·plan |
| --- | --- | --- |
| q01 | EXEMPT — 미지 k를 가진 거리 공식·두 해의 합, 그림은 답을 암시 | EXEMPT — 두 제곱항의 계산으로 완결 |
| q02 | EXEMPT — 미지 a 거리 공식, 답을 새로 점으로 찍지 않음 | EXEMPT — 1변수 거리방정식의 단순 계산; 기존 `q02-solution.svg` 있음(신규 제작 불필요) |
| q03 | EXEMPT — 미지 P(a,0)의 최종 위치를 미리 노출하지 않음 | BENEFICIAL — OP=AP의 수직이등분선·x축 교점: `q03-solution.plan.json` |
| q04 | EXEMPT — 미지 P가 y축에 있다는 조건을 글로 제공 | BENEFICIAL — AP=BP인 y축 교점과 수직 관계: `q04-solution.plan.json` |
| q05 | EXEMPT — 미지 P의 x좌표를 문제 그림으로 특정하지 않음 | BENEFICIAL — y=x와 AB 수직이등분선의 교점: `q05-solution.plan.json` |
| q06 | EXEMPT — 세 꼭짓점 좌표로 세 변의 길이 계산 가능 | BENEFICIAL · EXISTING_SVG — AB=AC를 보이는 `q06-solution.svg` 연결됨 |
| q07 | EXEMPT — 주어진 좌표에서 삼각형 분류, 유형은 질문의 답 | BENEFICIAL · EXISTING_SVG — B의 직각·AB=BC를 보이는 `q07-solution.svg` 연결됨 |
| q08 | EXEMPT — 좌표와 근호로 정삼각형 여부를 계산해야 함 | BENEFICIAL · EXISTING_SVG — 세 변 비교 `q08-solution.svg` 연결됨 |
| q09 | BENEFICIAL — A,B,C,D와 이동점 P의 두 거리만 표시: `q09-problem.plan.json` | BENEFICIAL · EXISTING_SVG — 제곱거리 최솟값 `q09-solution.svg` 연결됨 |
| q10 | BENEFICIAL — 세로 선분 CD와 이동점 P 관계만 표시: `q10-problem.plan.json` | BENEFICIAL · EXISTING_SVG — 제곱거리 최솟값 `q10-solution.svg` 연결됨 |
| q11 | EXEMPT — 미지 최소점 P의 좌표를 처음부터 그리지 않음 | BENEFICIAL · EXISTING_SVG — 세 점의 무게중심 `q11-solution.svg` 연결됨 |
| q12 | EXEMPT — 알려지지 않은 끝점 B를 원래 문제 그림에 배치할 수 없음 | BENEFICIAL — AP:PB=3:2와 B 복원: `q12-solution.plan.json` |
| q13 | EXEMPT — 내분·외분 좌표 계산 과제, 그린 답을 미리 제공하지 않음 | BENEFICIAL · EXISTING_SVG — P와 Q의 내·외분 `q13-solution.svg` 연결됨 |
| q14 | EXEMPT — C(7,k)에서 k 미지, 답을 그래프로 암시하지 않음 | BENEFICIAL — 무게중심 G가 y=3x 위임을 보임: `q14-solution.plan.json` |
| q15 | REQUIRED · EXISTING_SVG — 발문에서 아래 그림 참조, `q15-problem.svg` 연결됨 | BENEFICIAL — 중선·무게중심 G·선분 OG: `q15-solution.plan.json` |
| q16 | EXEMPT — C를 미리 찍으면 구할 좌표가 노출됨 | BENEFICIAL — C와 주어진 G가 중선 위임을 보임: `q16-solution.plan.json` |
| q17 | EXEMPT — 미지 D를 그리면 정답 좌표가 노출될 수 있음 | BENEFICIAL · EXISTING_SVG — 평행사변형 대각선 중점 `q17-solution.svg` 연결됨 |
| q18 | EXEMPT — 네 꼭짓점 좌표·거리제곱 공식으로 발문 완결 | BENEFICIAL · EXISTING_SVG — 두 대각선을 보여 주는 `q18-solution.svg` 연결됨 |
| q19 | EXEMPT — 마름모 대각선의 교점은 A,C의 중점이라고 발문에 명시 | EXEMPT — 두 수의 평균을 좌표별로 계산하는 단순 중점 공식 |

## DRAWN_FEATURE_PARITY — 신규 제작 plan 9개만

| qid/축 | 원문·해설의 필수 보이는 사실 → 실제 필드 | sourceVsPlan | featureParity | shallow/full |
| --- | --- | --- | --- | --- |
| q03/해설 | O(0,0), A(6,8) → `nodes[O,A]`; OP=AP → `planeMarks.equalLengths[sOP,sAP]`; OA 중점 M과 수직이등분 → `MIDPOINT`, `PERPENDICULAR_THROUGH`, `rightAngles[rM]`; x축 P(25/3,0) → `LINE_INTERSECTION`, `coordinateLabels[P]` | REVIEWED | PASS | PASS/PASS |
| q04/해설 | A(-2,3), B(4,1) → `nodes[A,B]`; AP=BP → `equalLengths`; P(0,-1) y축 → `LINE_INTERSECTION[pb,yax]`, `coordinateLabels[P]`; 직각 → `rightAngles[rM]` | REVIEWED | PASS | PASS/PASS |
| q05/해설 | A(1,2), B(5,6) → `nodes[A,B]`; y=x → `SOURCE_LINE[diag]`, `displayLines`, `lineLabels`; AP=BP → `equalLengths`; P(7/2,7/2) → `LINE_INTERSECTION[pb,diag]` | REVIEWED | PASS | PASS/PASS |
| q09/문제 | A(1,3), B(5,1), C(0,0), D(6,0) → `nodes`, `coordinateLabels`; CD → `segments[sCD]`; P는 CD 위 임의점 → `P(1,0)` 대표 위치, 값 라벨 숨김; AP/BP → `segments[sAP,sBP]` 점선 | REVIEWED | PASS | PASS/PASS |
| q10/문제 | A(2,4), B(4,2), C(0,0), D(0,6) → `nodes`, `coordinateLabels`; 수직 CD → `segments[sCD]`; P는 CD 위 임의점 → `P(0,1)` 대표 위치, 값 라벨 숨김; AP/BP → `segments[sAP,sBP]` 점선 | REVIEWED | PASS | PASS/PASS |
| q12/해설 | A(1,2), P(4,5) → `SOURCE_POINT` + `coordinateLabels`; AP:PB=3:2 → 선분 `sAP,sPB`와 실제 그리는 `planeMarks.expressionLabels[ratio]`; B(6,7) → `TRANSLATE_POINT(P,+2,+2)` + 좌표 라벨 | REVIEWED | PASS | PASS/PASS |
| q14/해설 | A(-5,2), B(4,1) → `SOURCE_POINT`; C(7,15) → `TRANSLATE_POINT`; G(2,6) → `CENTROID`; y=3x → `SOURCE_LINE[diag]`와 그려지는 `lineLabels` | REVIEWED | PASS | PASS/PASS |
| q15/해설 | O(0,0), A(6,0), B(3,6) → `nodes`; OA의 중점 M → `MIDPOINT`; G(3,2) → `CENTROID` 및 `coordinateLabels[G]`; 중선 BM·거리 OG → `segments[sBM,sOG]` | REVIEWED | PASS | PASS/PASS |
| q16/해설 | A(1,4), B(3,1) → `SOURCE_POINT`; C(2,4) → `TRANSLATE_POINT`; G(2,3) → `CENTROID`·좌표 라벨; G와 C가 AB 중점을 잇는 중선 위 → `MIDPOINT[M]`, `segment[sCM]` | REVIEWED | PASS | PASS/PASS |

위 `PASS`는 **실제 그려질 모델·좌표·선분·라벨 필드의 원문 대조**이며 픽셀·겹침·최종 SVG 실물 PASS가 아니다. 각/직각/길이/비 표시를 캡션만으로 대체한 미지원 항목은 없다. SVG 렌더, PNG, 학생화면, A4는 모두 `NOT_RUN`이다.
