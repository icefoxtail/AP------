# 20 매산고 고1 1학기 기말 Q03 로컬 입력 초안

출처 결속: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 3; source main `ca13990f5ba49e16af134945e3c26bf35d7a89c5`, prepared source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, source git blob `830a02dfed7703f109a615015e658aadc3def794`. `item.json`은 위 원문 경로와 ordinal로 해당 런타임 행에 결속한다. 소유자는 `UNKNOWN`.

## 원문 문항 (정확 문자열)

```text
이차함수 $y=x^2+2x+5$와 $y=ax+1$가 한 점에서 만날 때, 양수 $a$의 값은? [4.0점]
```

## 원문 정답 (정확 문자열)

```text
④
```

## 원문 해설 (정확 문자열)

```text
두 그래프의 교점에서는 두 식의 $y$값이 같으므로
$x^2+2x+5=ax+1$
$x^2+(2-a)x+4=0$
한 점에서 만나려면 교점 방정식이 중근을 가져야 하므로 판별식이 0이다.
$(2-a)^2-4\cdot1\cdot4=0$
$(2-a)^2=16$
$2-a=4$ 또는 $2-a=-4$
$a=-2$ 또는 $a=6$
문제에서 $a>0$이므로 $a=6$이다. 따라서 정답은 ④이다.
```

## 범위와 계획

문항의 두 함수 교점이 한 점인 상황을 포물선과 정확한 접선으로 보이는 제안이다. 실제 수학적 정의역은 `graphPlan.sourceDomain: ALL_REALS`; `graphPlan.domain`과 `viewport`는 정답지 그림의 표시 창만 뜻한다. 표시 범위는 꼭짓점과 접점 T를 함께 보여 주고 두 포물선 가지가 읽히도록 잡았다.

T는 원문 해설에서 결정되는 실제 접점이며 좌표는 (2,13)이다. 접선 식은 y=6x+1, 접선 기울기 6은 원문 매개변수 a의 양수 해다. T 좌표 라벨은 지시선으로 점에 연결한다. plan은 sourceQuote를 추가하지 않고, 원문 content/answer/solution을 아래에 정확히 보존한다.

사용자 사유: “existing diagram replacement helps understanding”.

보호: 기존 Q03–Q20 SVG와 모든 PNG, 이 원본 시험지·JS, 다른 문항 패키지를 수정하지 않았다. Q03의 기존 SVG와 모든 원본 PNG는 덮어쓰거나 다시 렌더하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 그대로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 input checker, engine prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff 모두 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. 입력은 source-runtime-bank.json의 해당 행에서 content/answer/solution을 그대로 옮겼으며 원문/자산은 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `db9eddd2e67703608c380fe35de4ab072bb8ef687498156aafce4ac48bc91526`, `b922fb637a7f749c9fc8085578b6c935e008264a23e09b7e6486ab7b55887115`, `3b9d2d416267ab11ac3b171f5bd9cdfe4e5147d4f713e88874ea6f3d18590fd3`로 동결된 `graph-first` / `2026-11-09T01-19-51-457Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual fit_overview/specFor and engine semantic/coordinate/critical/viewport/tick input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
