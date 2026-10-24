# 유사문제 생성: 발문·해설 그림(SVG 엔진) 작성 지침

이 문서를 읽는 AI는 유사문항을 만들면서, 그림이 필요한 곳에는 SVG 엔진이 그리는 `plan.json`을 함께 쓴다.
SVG, 좌표 계산 결과, 픽셀 좌표는 직접 쓰지 않는다. 엔진이 plan에서 정확한 값을 계산해 그린다.

정확한 plan 형식은 이 문서 아래쪽 「plan 계약 전문」이 정본이다. 이 지침과 계약 전문이 충돌하면 계약 전문을 따른다.

## 1. 순서

1. 문항(발문, 보기, 정답)과 풀이를 먼저 완성한다. 모든 값을 직접 풀어 확인한다.
2. 그 풀이를 보고 그림이 필요한지 정한다(아래 2).
3. 그림이 필요하면 plan을 쓴다. plan의 모든 수치는 방금 쓴 문항과 풀이에서 가져온다.
4. 엔진이 오류 코드를 돌려주면 코드별 조치(아래 6)대로 plan만 고친다.

## 2. 그림이 필요한가

- 발문 그림: 학생이 문제를 읽을 때 봐야 하는 주어진 조건만 그린다. 구하는 값, 풀이로 얻는 점, 정답을 암시하는 표시는 넣지 않는다. 엔진은 이를 강제하지 않으므로 작성자가 지킨다.
- 해설 그림: 풀이의 결정적 관계를 보여 준다. 접점, 교점, 꼭짓점, 대칭점, 수선의 발, 구간에서의 최대·최소, 부등식의 해집합 등.
- 풀이가 순수 계산(전개, 인수분해, 방정식 풀이)이고 공간이나 그래프 관계가 없으면 그림을 만들지 않고 `{"status":"EXEMPT","reason":"한 문장"}`을 쓴다.
- 엔진이 못 그리는 것(두 곡선을 한 그림에, 세로선, 색칠 영역, 3차 이상 그래프와 직선 조합, 입체)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다.
- 발문 그림과 해설 그림은 별개의 plan이다. 각각 따로 쓴다.

## 3. 어떤 plan을 쓰는가

- 좌표평면의 점, 직선, 원, 도형: `construction-spike-v1` (mathPlan 노드: SOURCE_POINT, SOURCE_LINE, MIDPOINT, PERPENDICULAR_FOOT, INTERSECTION 등). 주어진 점은 SOURCE_POINT, 풀이로 얻는 점은 파생 노드로 쓴다. 파생점에 좌표를 직접 쓰지 않는다.
- 이차함수(필요하면 직선 포함): `polynomial-spike-v1`.
- 여러 경우(k=-2일 때, k=3일 때)를 비교하는 풀이: `composite-panels-v1` (경우마다 패널 하나, 2~3개).
- 이어진 조각 그래프와 수평선(이차식의 절댓값 등): `piecewise-polynomial-spike-v1`.
- 이차부등식 풀이(판별식, 그래프, 구간, 수직선): `quadratic-inequality-chain-v1` 하나로 쓴다. 계수와 부등호만 주면 끝점, 열린·닫힌 점, 정수점은 엔진이 계산한다. 해가 구간 하나인 경우만 된다(두 조각이거나 공집합이면 거절된다). 계수가 고정된 이차부등식 하나일 때만 쓴다. 매개변수(a, n 등) 때문에 경우가 나뉘거나("n=1, n=2~4, n≥5"), 부등식이 여러 개이거나, 풀이가 결과 요약뿐이면 체인이 아니다. 그때는 풀이가 실제로 쓰는 그래프 하나(예: 해가 한 점인 접점 그래프)만 `polynomial-spike-v1`로 그리거나, 그림이 없어도 되면 EXEMPT, 못 그리면 UNSUPPORTED를 쓴다.

## 4. 이름과 표기 규칙 (자주 걸리는 것)

- 그림에 나오는 점 이름은 노드 id다. 문항과 풀이 텍스트에 쓴 이름과 같아야 한다. 풀이가 점 이름을 쓰지 않으면 한 글자 대문자(A, B, P)만 쓰고, O0, Pp, C1 같은 내부식 이름은 쓰지 않는다. 풀이에 쓰지 않은 보조점은 숨김 필드를 쓴다.
- 대칭점 A′처럼 프라임이 든 이름은 id로 쓸 수 없다. 풀이에 "이 점을 P라 한다"를 한 문장 넣고 id는 P로 쓴다.
- 풀이가 치환(t=x²−2x)하고 그 변수의 그래프를 그리면 `graphPlan.axisVariable`에 그 문자를 쓴다(소문자 한 글자, y 제외). 판별식 D를 a에 대한 함수로 그리면 `"axisVariable":"a"`다. 축과 식이 그 문자로 나온다.
- 수치는 정확한 정수나 분수 문자열로 쓴다("17/4", "-1/2"). 소수로 근사하지 않는다.
- 직선의 식을 그림에 쓰려면 `lineLabels`를 쓴다(식이 직선 옆 지시선으로 붙는다). 식 라벨을 따로 띄우지 않는다.
- 점의 좌표를 그림에 쓰려면 `coordinateLabels`에 그 점을 넣는다. 점이 몰리면 `coordinatePlacement:"PANEL"`로 좌표를 띠로 올린다.
- `caption`은 학생이 읽는 한국어 한 문장이다. 내부 용어, 디버그 문구, TeX 명령을 쓰지 않는다.
- 이 plan이 어느 문항의 것인지 확인하기 위해 plan 최상위에 `"sourceQuote"`를 넣는다. 이 문항의 발문 또는 풀이에서 글자 그대로 복사한 12~40자다(다른 문항 것을 쓰지 않는다). 엔진은 이 필드를 무시한다. 작성 파이프라인의 실행기가 있으면 이 문항에 실제로 있는 문장인지 대조한다.

## 5. 그래프 배율

- 이차함수 그래프는 x축과 y축의 눈금 길이를 같게 그리는 것이 기본이다. viewport를 임의로 크게 잡아 납작하거나 길쭉하게 만들지 않는다.
- 세로로 너무 길면 `graphPlan.axisSqueeze:true`로 세로를 최대 1/2까지 줄일 수 있다. 그 이상 찌그러뜨리는 요청은 하지 않는다.
- x 범위에 비해 y 범위가 훨씬 커서 곡선이 너무 좁아지면 엔진이 거절한다. 그때는 그림을 포기하고 UNSUPPORTED를 쓴다.

## 6. 오류가 오면 이렇게 고친다

- `NAME_NOT_IN_SOLUTION`: 그림의 점 이름이 풀이에 없다. 풀이에 쓴 이름으로 id를 바꾼다.
- `SOURCE_QUOTE_MISSING` / `SOURCE_QUOTE_NOT_IN_ITEM` (작성 파이프라인의 실행기가 내는 코드): plan 최상위에 `sourceQuote`를 넣는다. 12~40자, 이 문항의 발문 또는 풀이에서 글자 그대로 복사한다.
- `INEQUALITY_SOLUTION_NOT_ONE_INTERVAL`: 해가 두 조각이다. 풀이의 조건을 `domain`으로 옮기거나 그림을 포기한다.
- `NUMBER_LINE_LABELS_TOO_CLOSE` / `NUMBER_LINE_INTEGER_POINTS_TOO_DENSE`: 정수점 범위를 좁힌다.
- `RENDERED_LAYOUT_FAIL` / `POLISH_REQUIRED`: 라벨이 겹치거나 자리가 없다. 엔진은 점 이름이 점에서 20px 이상 떨어지면 점과 이어 주는 지시선을 반드시 그리고, 지시선이 지나갈 빈 곳이 없으면 그림을 거절한다. 원, 접선, 반지름이 한 점에 모인 곳이 대표적이다. 표시할 점과 라벨 수를 줄이거나(풀이가 쓰지 않는 점의 좌표를 빼거나), 좌표를 띠로 올린다(`coordinatePlacement:"PANEL"`).
- `EQUAL_UNIT_PARABOLA_TOO_NARROW`: 이 풀이는 같은 배율로 못 그린다. UNSUPPORTED를 쓴다.
- 같은 오류가 반복되면 plan을 고치는 대신 EXEMPT 또는 UNSUPPORTED로 마무리한다. 다른 문항의 plan을 참고하지 않는다.

## 7. 출력

- 문항 JSON(발문, 보기, 정답, 풀이)과 그림마다 `plan.json` 한 개.
- plan.json에는 `sourceQuote`(위 4), `sourceConditions`, `newVisualInformation`(그림이 새로 보여 주는 정보)을 넣는다.
- 그림이 필요 없으면 plan 파일 없이 문항만 낸다. 이유는 notes에 한 줄로 쓴다.

## 8. plan을 직접 그려 보기

- 저장소 루트에서 `node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out out/` 한 번으로 그린다. `item.json`은 `{"sourcePath":"archive/exams/....js","ordinal":3}`.
- 결과는 `out/figure-result.json`의 `status`: `ARCHIVE_BOUND`(그림 `figure-solution.svg` 완성), `EXEMPT`/`UNSUPPORTED`(작성자 판단 그대로), `FAILED`(`stage`와 엔진 오류 `detail`을 보고 6에 따라 고친다).
- 독립 관측기 검사는 이 안에서 함께 돈다. 시험지 해설 페이지 열림 검증은 하지 않는다.
