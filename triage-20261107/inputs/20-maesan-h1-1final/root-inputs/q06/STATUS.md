# 20 매산고 고1 1학기 기말 Q06 로컬 입력 초안

출처 결속: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 6; source main `ca13990f5ba49e16af134945e3c26bf35d7a89c5`, prepared source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, source git blob `830a02dfed7703f109a615015e658aadc3def794`. `item.json`은 위 원문 경로와 ordinal로 해당 런타임 행에 결속한다. 소유자는 `UNKNOWN`.

## 원문 문항 (정확 문자열)

```text
점 $(3,4)$를 지나고 $x$축에 수직인 직선의 방정식은? [4.2점]
```

## 원문 정답 (정확 문자열)

```text
③
```

## 원문 해설 (정확 문자열)

```text
$x$축에 수직인 직선은 세로로 뻗는 직선이므로 방정식은 $x=c$ 꼴이다.
이 직선이 $(3,4)$를 지나려면 $c=3$이어야 한다.
따라서 직선의 방정식은 $x=3$이고, 정답은 ③이다.
```

## 범위와 계획

문항에 실제로 주어진 좌표점 P=(3,4)와 답의 선 x=3을 나타내는 coordinate-construction 초안이다. P는 genuine `SOURCE_POINT`; L은 이전 실제 입력에서 보존한 source equation x−3=0의 `SOURCE_LINE`이며 typed integer scalars를 쓴다. 실제 phase2 검사에서 기존 표시 프레임은 `LINE_LABEL_LINE_NOT_IN_VIEW`로 실패했다. 이는 선의 수학이 아니라 표시점이 하나뿐이라 수직선 라벨을 위한 프레임 높이가 사실상 0이 된 배치 문제였다.

최소 수정으로 좌표계의 수평 x축 y=0을 genuine `SOURCE_LINE` `XAxis`로 추가하고, `H=PERPENDICULAR_FOOT(P,XAxis)`를 `DERIVED_INTERMEDIATE`로 둔다. 따라서 H=(3,0)은 입력에서 발명한 GIVEN이 아니라 원래 P와 좌표축에서 정확히 유도된 정사영 발이다. 현재 plan은 `displayPoints`에 P,H, `displayLines`에 L,XAxis를 명시한다. x축과 일치하는 SOURCE_LINE은 실제 phase2가 표시 목록에서 선택 여부를 검증한 뒤 좌표축과 중복되는 별도 선 그리기에서 제외한다. Q06의 좌표 라벨은 `coordinateLabels: [P]`, `coordinatePlacement: PANEL`로 기존 그대로 유지하며 `hiddenPointNames: [H]`로 보조점 이름만 숨긴다. lineLabels는 exact `x=3`이며, DAG에는 같은 선의 계수 (1,0,−3)를 기록한다. 축 눈금 3과 4는 원문 P 좌표에서 온다. 좌표 평면의 수학 영역은 바꾸지 않고 canvas는 표시 크기만 정한다.

사용자 사유: “existing diagram replacement helps understanding”.

보호: 기존 Q03–Q20 SVG와 모든 PNG, 이 원본 시험지·JS, 다른 문항 패키지를 수정하지 않았다. Q06의 기존 SVG와 모든 원본 PNG는 덮어쓰거나 다시 렌더하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 그대로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 초기 4파일은 `preparation-20-maesan-h1-1final/history/q06-line-label-initial/`에 바이트 그대로 보존했다. 초기 plan의 실제 `specFor` 결과는 FAIL / `LINE_LABEL_LINE_NOT_IN_VIEW`; 현재 최소 framing 보정안은 아직 독립 재검사하지 않아 NOT_RUN이다. 엔진 prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff도 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. content/answer/solution은 source-runtime-bank.json의 해당 행에서 그대로 옮겼으며 원문/자산은 수정하지 않았다.

사용자 사유: “existing diagram replacement helps understanding”.

보호: 기존 Q03–Q20 SVG와 모든 PNG, 이 원본 시험지·JS, 다른 문항 패키지를 수정하지 않았다. Q06의 기존 SVG와 모든 원본 PNG는 덮어쓰거나 다시 렌더하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 그대로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 input checker, engine prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff 모두 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. content/answer/solution은 source-runtime-bank.json의 해당 행에서 그대로 옮겼으며 원문/자산은 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `fd17c30776430ad0445c9d95e22380163155187268a8042ead9f15ac60d57c79`, `2b2cff72a55ad36d232ee7b23dbbb08c09d4eaf68f613045b5c25f15ff2f5176`, `ca169da594abc62535f4d48cd1e653f2aab857516fa286000a8bb5aae1ace489`로 동결된 `graph-repaired` / `2026-11-09T01-37-50-805Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
