# 20 매산고 고1 1학기 기말 Q14 로컬 입력 초안

## 원문 결속
원본 경로: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`. 원본 바이트는 SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, Git blob `830a02dfed7703f109a615015e658aadc3def794`이며 기준 main은 `ca13990f5ba49e16af134945e3c26bf35d7a89c5`이다. 로컬 exact input은 `preparation-20-maesan-h1-1final/source-exact.js` (50,573B, 같은 SHA-256)이다. `item.json`은 원본 경로와 ordinal `14`로 원문 행을 결속한다.

## 원문 문항 (정확 runtime 문자열)
```text
그림과 같이 중심이 곡선 $y=x^2-x-3$ 위에 있고 $x$축과 $y$축에 동시에 접하는 원은 4개 있다. 이 네 원의 중심을 각각 $A,B,C,D$라 할 때, 사각형 $ABCD$의 둘레의 길이는? [4.8점]
```

## 원문 선택지 (정확 runtime 문자열)
```text
$2(\sqrt6+\sqrt2)$ / $2(2\sqrt6+\sqrt2)$ / $2(\sqrt6+2\sqrt2)$ / $4(\sqrt6+\sqrt2)$ / $2(2\sqrt6+3\sqrt2)$
```

## 원문 정답 (정확 runtime 문자열)
```text
④
```

## 원문 해설 (정확 runtime 문자열)
```text
원의 중심을 $(u,v)$라 하면 두 축에 접하므로 두 축까지의 거리가 같다.
$|u|=|v|$이므로 $v=u$ 또는 $v=-u$이다.
먼저 $v=u$를 포물선 $y=x^2-x-3$에 대입하면
$u=u^2-u-3$
$u^2-2u-3=0$
$(u-3)(u+1)=0$
$u=3$ 또는 $u=-1$이므로 이 두 중심은 $(3,3),(-1,-1)$이다.
다음으로 $v=-u$를 포물선에 대입하면
$-u=u^2-u-3$
$u^2-3=0$
$(u-\sqrt3)(u+\sqrt3)=0$
$u=\sqrt3$ 또는 $u=-\sqrt3$이므로 두 중심은 $(\sqrt3,-\sqrt3),(-\sqrt3,\sqrt3)$이다.
원본 그림의 점 순서는 $A=(3,3), B=(-\sqrt3,\sqrt3), C=(-1,-1), D=(\sqrt3,-\sqrt3)$이다.
좌표 사이의 거리 공식으로
$AB^2=(3+\sqrt3)^2+(3-\sqrt3)^2$
$AB^2=(12+6\sqrt3)+(12-6\sqrt3)$
$AB^2=24$
$AB=2\sqrt6$
$BC^2=(\sqrt3-1)^2+(\sqrt3+1)^2$
$BC^2=(4-2\sqrt3)+(4+2\sqrt3)$
$BC^2=8$
$BC=2\sqrt2$
$CD^2=(\sqrt3+1)^2+(1-\sqrt3)^2$
$CD^2=(4+2\sqrt3)+(4-2\sqrt3)$
$CD^2=8$
$CD=2\sqrt2$
$DA^2=(3-\sqrt3)^2+(3+\sqrt3)^2$
$DA^2=(12-6\sqrt3)+(12+6\sqrt3)$
$DA^2=24$
$DA=2\sqrt6$
따라서 둘레는
$AB+BC+CD+DA=2\sqrt6+2\sqrt2+2\sqrt2+2\sqrt6$
$=4(\sqrt6+\sqrt2)$이다. 따라서 정답은 ④이다.
```

## 대체 그림의 범위와 이해 도움
네 중심과 사각형은 정확한 좌표로 구성하고, 중심에서 각 축에 내린 수선발과 원의 접점을 연결해 접선 조건을 드러낸다. 이 geometry capability는 포물선 곡선을 지원하지 않으므로 부분 도식으로 한정하며, 이를 전체 장면으로 표시하지 않는다.

## 점 이름·좌표 라벨 및 공간 계획
A, B, C, D 점 이름과 사각형 변 길이만 표기한다. 정답 좌표 패널은 만들지 않는다. 좌표축은 실제 source-coordinate frame에서 제공하고, 560×440 canvas에 원과 선분의 간격을 둔다.

## 상태
LOCAL_ONLY / DRAFT_ONLY / NOT_READY. JSON parse 및 현행 `construction.validate/execute` 로컬 실행 PASS. 통합 입력 checker, `phase2.specFor`, semantic/viewport, render, independent full-math review, visual review, CI, publication, handoff 모두 NOT_RUN. 원격 쓰기 0회.


## Integrated geometry-second finding and minimal correction — 2026-11-09

The actual `displayGeometryInventory` failed with `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayLines`. `Xaxis` and `Yaxis` are source-given `SOURCE_LINE` nodes for the original coordinate axes but were omitted from `displayLines`; inventory requires GIVEN lines to be listed before applying axis-coincident-line filtering. Minimal correction: add `Xaxis` and `Yaxis` to `displayLines`, retaining `diagPlus` and `diagMinus`. The actual inventory recognizes the two source lines as the coordinate axes and removes them from duplicate drawn geometry. The Q14 plan remains the approved partial center/quadrilateral diagram; no geometry, mathematical nodes, or parabola-omission scope changed. Integrated tests were not rerun, as directed.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `9184c006bc8da7fa6343daaa9c15b72eed880b6f18d3a1eb88e8194ede7e2399`, `7bf242c7901b5f85e3861e49651dc7a5e178595fb05f2700c0c6cbfecd54e8a6`, `06bb5eeb494f2d14c79a19da518c8be1e13aeb1f05161dc1d11e5e625c45b6ad`로 동결된 `geometry-repaired` / `2026-11-09T01-32-42-901Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
