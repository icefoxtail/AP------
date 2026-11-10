# G13b: 벤다이어그램 개수 라벨 · 여러 패널 벤다이어그램 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙)를 끝까지 읽고 따른다. 묶음 id: `g13b`. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g13b/`.

## 왜 (학생에게 무엇이 좋은가)
고1 집합 문항의 해설은 "n(A)=25, n(B)=19, 전체 40명" 같은 개수 관계나 "좌변과 우변을 각각 칠해 비교"로 푼다. 지금 엔진은 집합 이름 옆에 개수를 달 수 없고(이름 8자 한도, 숫자를 넣으면 SET_LABEL_NO_ROOM), 벤다이어그램을 여러 개 나란히 놓을 수 없어 이 문항들의 해설 그림이 빠져 있다.

## 지금 코드 (조사 결과)
- `production/set-diagram-v1.mjs`: `solveVenn` :106, Venn 키 `['kind','sets','elements','shade','subset']` :107, 집합 키 `['id','name']`, 이름 최대 8자(:110-112), 바깥 라벨 "U" 하드코딩(:478 근처), 알 수 없는 키는 `SET_DIAGRAM_PLAN_INVALID`. 영역 원소는 `elements:[{text,in}]`(자유 글자, 최대 12개·32자).
- 관측기: `production/set_diagram_observer.py`(+ `set-diagram-observer-worker.py`). 렌더 분기: `render-plan.mjs:74-76`(단독만).
- 합성: `production/composite-candidate-svg-v1.mjs:compositePanels` :58 — 그래프 2~3개 / 평면 2~5 격자 / 입체 2~6 격자만. set-diagram 패널은 `COMPOSITE_PLAN_INVALID`(`PANEL_PLAN_<i>`). `render-plan.mjs:178-200` 패널 분기에 Venn 없음. `MAX_PANELS=3`(:24).

## 기능 1: 집합·전체집합 개수 라벨
- 필드(옵트인): 집합 `{"id":"M","name":"M","count":"19","countUnit":"명"}`, 전체집합 `"universe":{"name":"U","count":"40","countUnit":"명"}`(universe가 없으면 지금처럼 "U"만).
  - 표시: 집합 이름 바로 옆에 `M (19명)` 또는 이름 아래 줄에 `19명`(이름 라벨과 한 덩어리로 배치). 전체는 왼쪽 위 `U (40명)`. 단위가 없으면 `n(M)=19`꼴도 허용(`countStyle:"n"` 선택).
  - count는 0 이상 정수 문자열만(분수·문자 금지 — 문자 개수는 지금처럼 원소 글자로).
- 계산·배치: 라벨은 기존 집합 이름 라벨 자리 규칙을 넓혀(이름 길이 + 개수 글자 폭) 원 바깥 위쪽에 놓는다. 자리가 없으면 원 바깥으로 지시선(짧은 leader)을 단다. 그래도 없으면 거절.
- 관측기: 최종 SVG에서 각 집합 라벨 글자에 count가 들어 있는지, 라벨이 자기 원 경계 근처(원 바깥 일정 거리 안) 또는 지시선 끝이 자기 원 위에 있는지 독립 확인.
- 거절: `SET_COUNT_INVALID`(정수 아님·음수), `SET_COUNT_LABEL_NO_ROOM`.
- 영역 개수(교집합 9명 등)는 기존 `elements`로 쓴다(정답이 영역 수일 때는 작성자가 쓰지 않으면 된다). 새 필드 불필요.

## 기능 2: 벤다이어그램 여러 패널 (composite)
- 필드: 기존 `composite-panels-v1`에 set-diagram 패널 허용. `{"capability":"composite-panels-v1","panels":[{"title":"ㄱ 좌변","plan":{"capability":"set-diagram-figure-v1","diagram":{...}}}, ...]}`. 같은 합성 안에서 set 패널만(다른 종류와 섞으면 거절). 2~4 패널, 2열 격자.
  - `MAX_PANELS=3` 은 다른 패널 종류에는 그대로 두고 set 패널 격자만 4까지(상수 따로).
- 계산: `render-plan.mjs` 패널 분기에 Venn 추가 → 각 패널을 `set-diagram-v1`로 그려 격자에 배치(평면 격자 `isPlanePanel` 경로를 참고). 패널 제목은 기존 패널 제목 규칙(한글 허용).
- 관측기: 패널마다 set-diagram 관측기를 그 패널 영역에 적용(색칠 영역 = 각 패널의 shade 식으로 독립 계산), 패널 제목 존재.
- 거절: `COMPOSITE_SET_PANEL_MIXED_<i>`(다른 종류와 섞음), `COMPOSITE_SET_PANEL_COUNT`(1개 또는 7개 이상), 패널 내부 오류는 `PANEL_<i>:<원래 코드>`.

## 기존 규칙과 부딪히는 곳
- 집합 이름 8자 한도·`SET_LABEL_NO_ROOM`: 개수 라벨은 이름과 별도 필드이므로 8자 한도는 그대로 두고, 배치 폭만 이름+개수로 계산한다.
- 합성 관측(`archive-inverse-observation-v1.mjs:373-406`)이 패널 종류별 기대 라벨을 나열한다 → set 패널 항목 추가.

## 실제 문항 (샘플 2개)
1. 26 팔마고 고1 2학기 중간 q20 (`archive/exams/original/high/h1/2mid/26_팔마고_2학기_중간_고1_기출.js` #20, packet `/home/user/AP------/.tmp/svg-m1/packets/26_팔마고_2학기_중간_고1_기출.json`). 이전 시도: `/home/user/AP------/.tmp/svg-m1/runs/palma1-g3/q20/`. 그릴 것: U(40명), M(19명), A(25명), 바깥 5명(원소 글자), M∩A 색칠. 1)~3)의 답(35, 9, 16)은 그림에 쓰지 않고 caption에.
2. 26 강남여고 고1 2학기 중간 q16 (`.../h1/2mid/26_강남여고_2학기_중간_고1_공통수학2.js` #16, packet `.../packets/26_강남여고_2학기_중간_고1_공통수학2.json`). 그릴 것: 4패널(2×2) — "ㄴ: (A∩B)∪(A∩Bᶜ)"와 "A"처럼 참인 ㄴ·ㄹ의 좌변 색칠 영역이 우변과 같음을 보이거나, ㄱ~ㄹ 각 좌변을 한 패널씩(제목 "ㄱ 좌변 = A∪B" 등 해설 식). 해설을 읽고 학생이 "어느 것이 같은가"를 보도록 정한다. 정답 개수(2개, ③)는 caption만.

## 정답지 회귀 (시작 전·후 바이트 동일)
set-diagram: item28, item40. composite: item24, item36, item37, item56, item59, item61, item63e33e, item102c1. 새 항목: `item107g13b`(팔마고 q20 개수 라벨) + manifest.

## 관련 테스트
`grep -rl "set-diagram\|composite-panels" tests archive/tools/geometry-equation --include=*.test.* --include=test_*.py` 로 찾은 것만.
