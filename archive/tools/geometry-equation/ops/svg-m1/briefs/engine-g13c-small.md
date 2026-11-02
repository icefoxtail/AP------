# G13c: 조각 상한 · 수형도 확률 1 가지 · 원호 색 (엔진 확장, 작은 것 3개)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙)를 끝까지 읽고 따른다. 묶음 id: `g13c`. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g13c/`. 기능마다 따로 커밋한다.

## 기능 1: 불연속(조각) 그래프 조각 상한 8 → 12
- 왜: 짝함수·주기 함수 문항(26 팔마고 고2 미적분I q15)은 [−4,6]에서 정수점을 잇는 일차 조각 10개가 필요하다. 사잇값 정리로 "정수 사이마다 근이 하나"를 보이는 그림이다.
- 지금: `production/graph_framing.py:2143` `PIECEWISE_DISCONTINUOUS_MAX_PIECES=8`, 적용 :2277/:2279 `PIECEWISE_TOO_MANY_PIECES`. 관련 상한 `MAX_REQUIRED_POINTS=24`, `MAX_LIMIT_ARROWS=6`, `jumpValues` 8. 관측기 `graph_observer.py`에 같은 상한이 있는지 grep해서 함께 바꾼다(관측기도 12로; 약화가 아니라 같은 계약의 상한 확장).
- 필드: 새 필드 없음. 상한만 12. 조각이 이어지는 점(연속)은 기존 방식대로.
- 배치: 조각이 많아도 x 눈금·점 라벨이 겹치지 않는지 확인. 정수 눈금 라벨이 11개 이상이면 기존 눈금 간격 규칙을 따른다.
- 거절: 13개 이상은 기존 코드 `PIECEWISE_TOO_MANY_PIECES`.
- 샘플: 26 팔마고 고2 미적분I q15 (`archive/exams/original/high/h2/2mid/26_팔마고_2학기_중간_고2_미적분I.js` #15, packet `/home/user/AP------/.tmp/svg-m1/packets/26_팔마고_2학기_중간_고2_미적분I.json`). 해설의 예시 함수: (0,2)–(1,−3)–(2,1)을 선분으로 잇고 짝함수·주기 4로 확장, [−4,6]. 그릴 것: 정수점 11개(값 2,−3,1,−3,2 반복; 필요한 것만 좌표), x축과 만나는 점 10개(이름 없는 점), 구간 부호 +/−가 번갈아 바뀜이 보이게. caption 앞에 "예: 해설의 예시 함수". 정답 N=10은 caption만.
- 정답지: item31, item31g7, item75g7b, item76g7c, item105g12 바이트 동일.

## 기능 2: 수형도 확률 1인 단일 가지
- 왜: 26 순천고 고2 확통 q23(몬티 홀)은 "처음 돌멩이 선택(2/3) → 교수가 돌멩이 문을 연다(확률 1) → 바꾸면 성공"을 수형도로 보여야 한다. 지금은 자식이 2~5개여야 해서 한 단계로 줄여 그렸다.
- 지금: `production/stat-chart-v1.mjs` `solveTree` ~:807-854, 자식 수 검사 :822(`STAT_TREE_INVALID`), 잎 수 :832, 관측기 `stat_chart_observer.py:1171`(`len(kids)<2`). 자식 배치는 가운데 정렬(`treeCenters` :1168-1172).
- 필드: 새 필드 없음. 자식이 1개일 때 그 가지 p는 반드시 "1"이어야 한다(다른 값이면 `STAT_TREE_SINGLE_CHILD_NOT_CERTAIN`). 자식 1~5개 허용.
- 배치: 단일 자식은 부모와 같은 높이로 곧게 이어 그린다. 가지 확률 라벨 "1"은 기존 라벨 규칙.
- 관측기: 단일 자식 가지의 p=1, 선분이 수평(부모·자식 같은 y), 라벨 "1" 존재를 독립 확인. JS·관측기 둘 다 같은 계약.
- 참고: `highlightPaths`는 `showPathProbability`를 강제하지 않는다(조사 확인). 강조만 하고 경로 곱은 안 보여도 된다.
- 샘플: 26 순천고 확통 q23 (`.../h2/2mid/26_순천고_2학기_중간_고2_확률과통계.js` #23, packet `.../packets/26_순천고_2학기_중간_고2_확률과통계.json`, 이전 그림 `/home/user/AP------/.tmp/svg-m1/runs/suncheon-g2/q23/`). 그릴 것: 처음 선택(황금 1/3, 돌멩이 2/3) → 교수가 돌멩이 문을 엶(각 1) → 바꾸면 실패/성공, "돌멩이→열기→성공" 경로 강조(highlightPaths, 경로 곱은 끄기). 정답 2/3은 caption만.
- 정답지: item34h와 stat-chart TREE를 쓰는 다른 항목(manifest grep) + stat-chart 대표 2개(item21, item41) 바이트 동일.

## 기능 3: 평면 원호 색 (`planeMarks.arcs[].color`)
- 왜: 26 순천고 확통 q20은 정육각형 꼭짓점 사이 세 호가 "모두 2칸"으로 같다는 것이 핵심인데, 호에 색을 줄 수 없어 검은 굵은 선으로만 그렸다. 같은 길이의 호를 같은 색으로 묶으면(C1 규칙) 한눈에 보인다.
- 지금: `production/plane-marks.mjs:76` arcs 키에 color 없음, `highlight`는 굵게만(:685 CIRCULAR_ARC). `visual_engine/semantic_model.py:84` color 허용 종류에 CIRCULAR_ARC 없음. 팔레트 검사 `isPaletteName`/`PALETTE_LINES`, 관측기 사본 `plane-marks-observer-worker.py:23, :587+`.
- 필드: `planeMarks.arcs:[{...,"color":"BLUE"}]`(C1 팔레트 이름만: BLUE·WARM·GREEN·ROSE·VIOLET). 색은 선 색으로, 굵기는 기존 highlight 규칙.
- 관측기: 해당 호 path의 stroke 색이 팔레트 값과 같은지, 같은 color 호들이 같은 색인지.
- 거절: 팔레트 밖 이름 `ARC_COLOR_INVALID`.
- 샘플: 26 순천고 확통 q20 (#20, 이전 그림 `/home/user/AP------/.tmp/svg-m1/runs/suncheon-g1/q20/`): 세 호 AC, CE, EA를 같은 색(BLUE), 정삼각형 ACE는 지금처럼. 정답 1/10은 caption만.
- 정답지: item19, item20, item100g4b + planeMarks 대표(item44, item27) 바이트 동일.

## 새 정답지 항목
`item108g13c`(팔마고 q15 12조각 이내 그래프) 하나 + manifest.
