# 20 매산고 고1 1학기 기말 Q17 로컬 입력 초안

## 원문 결속
원본 경로: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`. 원본 바이트는 SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, Git blob `830a02dfed7703f109a615015e658aadc3def794`이며 기준 main은 `ca13990f5ba49e16af134945e3c26bf35d7a89c5`이다. 로컬 exact input은 `preparation-20-maesan-h1-1final/source-exact.js` (50,573B, 같은 SHA-256)이다. `item.json`은 원본 경로와 ordinal `17`로 원문 행을 결속한다.

## 원문 문항 (정확 runtime 문자열)
```text
두 점 $A(3,2), B(5,9)$와 $y$축 위의 점 $P$에 대하여 $|\overline{AP}-\overline{BP}|$의 값이 최대가 되도록 하는 점 $P$의 $y$좌표를 구하시오. [5점]
```

## 원문 선택지 (정확 runtime 문자열)
```text
(없음)
```

## 원문 정답 (정확 runtime 문자열)
```text
$-\dfrac{17}{2}$
```

## 원문 해설 (정확 runtime 문자열)
```text
두 점 사이의 거리에서 삼각형 부등식을 쓰면
$AP\le AB+BP$이고 $BP\le BA+AP$이다.
따라서 $|AP-BP|\le AB$이다.
등호는 $A,B,P$가 한 직선 위에 있고 $P$가 선분 $AB$ 바깥에 있을 때 성립한다.
$AB$를 지나는 직선의 기울기는 $\dfrac{9-2}{5-3}=\dfrac72$이므로
$y-2=\dfrac72(x-3)$이다.
$P$는 $y$축 위에 있어 $x=0$이므로
$y=2-\dfrac{21}{2}=-\dfrac{17}{2}$이다.
이 점은 $A,B$의 바깥쪽 연장선 위에 있으므로 최댓값을 만든다.
따라서 $P$의 $y$좌표는 $-\dfrac{17}{2}$이다.
```

## 대체 그림의 범위와 이해 도움
원문에서 주어진 좌표 A, B와 실제 y축 x=0을 사용해 P를 선 AB와 y축의 교점 연산으로 얻는다. P-A-B 순서는 최대 거리차에 필요한 삼각형 부등식 등호 조건을 도식화한다.

## 점 이름·좌표 라벨 및 공간 계획
P, A, B 점 이름과 직선 AB 및 y축만 표시한다. P의 좌표 라벨은 넣지 않아 요구된 y좌표를 그림에서 먼저 드러내지 않는다. 480×400 source-coordinate canvas로 y축과 외부 교점에 공간을 둔다.

## 상태
LOCAL_ONLY / DRAFT_ONLY / NOT_READY. JSON parse 및 현행 `construction.validate/execute` 로컬 실행 PASS. 통합 입력 checker, `phase2.specFor`, semantic/viewport, render, independent full-math review, visual review, CI, publication, handoff 모두 NOT_RUN. 원격 쓰기 0회.


## Integrated mixed-first finding and minimal correction — 2026-11-09

The actual `displayGeometryInventory` failed with `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayLines`. `YAxis` is a source-given `SOURCE_LINE` (`x=0`) in `mathPlan.nodes` but was missing from `displayLines`, whose inventory check requires GIVEN lines to be listed before it applies axis-coincident-line filtering. Minimal correction: add `YAxis` to `displayLines`, retaining `ABline`. The actual inventory recognizes `YAxis` as the coordinate y-axis and removes it from duplicate drawn geometry, while preserving its source binding. No other plan field or mathematics changed. Integrated tests were not rerun, as directed.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `6672148e71e2a9b68233b0e269204a7314990428cdff93a8d8ec951cc19acd61`, `5cfde448e8aa700237a63946095cd118696f6f98e204d035aff1245f1eb7402e`, `1dd6529d3af724008ef584c2d77eeb65da25059fd47e714e3b90fcf1412d4b40`로 동결된 `geometry-repaired` / `2026-11-09T01-32-42-901Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
