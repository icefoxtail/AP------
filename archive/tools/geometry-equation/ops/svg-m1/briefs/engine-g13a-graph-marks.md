# G13a: 그래프 위 직각·같은 각 표시 · 세로 점근선 라벨 자리 · 근호 길이 라벨 관측 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙)를 끝까지 읽고 따른다. 묶음 id: `g13a`. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g13a/`. 기능마다 따로 커밋한다. 하나가 막혀도 나머지는 끝낸다.

지시선 확인(phase 0, `/home/user/AP------/.tmp/svg-m1/runs/g13-p0/report.json`)에서 기존 기능으로 풀린 것은 뺐다. 아래 셋은 지시선·기존 필드로 안 되는 것만이다.

## 기능 1: 그래프(좌표평면 곡선) 위 직각 표시·같은 각 호 — 핵심
- 왜: 미적분 해설은 "두 접선이 C에서 수직", "C에서 x축에 수직인 직선", "∠APB의 이등분선(같은 두 각)"을 그래프 위에서 보여야 한다. 지금은 표시 없이 캡션 글로만 설명해 학생이 그림에서 관계를 못 본다.
- 지금(조사 결과, 경로는 `archive/tools/geometry-equation/` 기준):
  - `production/phase2.mjs:501` 그래프 plan에 planeMarks가 오면 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`로 막는다.
  - 그래프 덧그림은 `production/graph_framing.py`(OVERLAY_LIMITS :2608, 검사 :3295), 관측기 `production/graph_observer.py`.
  - 재사용할 것: 평면 그림의 rightAngles → ANGLE_MARK 변환(`phase2.mjs:979`), 렌더러 `visual_engine/engine.py:948-975`(각 호·직각 사각형), PERPENDICULAR_MARK(`engine.py:940`, 지금 아무도 안 씀), `planeMarks.angles/equalAngles` 계약(`production/plane-marks.mjs:73, 337`), C1 색(`angles[].color`·`equalAngles`).
  - 충돌: `ANGLE_REQUIRES_EQUAL_UNITS`(`engine.py:949`) — 그래프는 x·y 단위가 다를 수 있어 직각이 화면에서 직각으로 안 보인다. planeMarksAudit 게이트 `production/construction-candidate-svg-v1.mjs:239`.
- 필드(옵트인, 그래프 overlays 쪽에 추가 — planeMarks를 그래프에 통째로 여는 것보다 작게):
  - `overlays.rightAngles:[{"at":"C","from":["A","B"]}]` — at·from은 그래프 overlays.points 또는 requiredPoints의 이름. 또는 선 이름 두 개 `{"lines":["l1","l2"]}`(교점에 표시).
  - `overlays.angles:[{"at":"P","from":"A","to":"Q","color":"BLUE"}]`, `overlays.equalAngles:[{"angles":[0,1],"color":"BLUE"}]`(같은 색 호, 필요하면 호 개수 1~2).
- 계산: 화면 좌표(픽셀)에서 실제 각을 계산해 그린다. 직각 표시는 **수학 좌표에서 실제로 수직일 때만** 허용하고(내적 0, sympy 정확값), 화면에서도 직각으로 보이도록 x·y 단위가 같아야 한다 → 단위가 다르면 `GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS`로 거절하거나, 작성자가 `"equalUnits":true`(이미 있으면 그 필드)를 켜게 안내. 같은 각은 수학 좌표에서 두 각이 같아야 하고(정확값 비교) 다르면 `GRAPH_EQUAL_ANGLES_MISMATCH`.
- 관측기: plan에서 점을 다시 구해 수직·같은 각을 독립 확인, 최종 SVG에 각 표시 path가 그 꼭짓점에 있는지, 같은 색인지 확인. 표시가 곡선·축·라벨과 겹치면 기존 겹침 검사 적용.
- 거절: `GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR`, `GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS`, `GRAPH_EQUAL_ANGLES_MISMATCH`, `GRAPH_ANGLE_POINT_UNKNOWN`.
- 샘플(기존에 표시 없이 게시된 그림을 다시 그린다. 이전 plan을 출발점으로):
  1. 26 강남여고 고2 미적분I q20 (`archive/exams/original/high/h2/2mid/26_강남여고_2학기_중간_고2_미적분I.js` #20, packet `/home/user/AP------/.tmp/svg-m1/packets/26_강남여고_2학기_중간_고2_미적분I.json`, 이전 `/home/user/AP------/.tmp/svg-m1/runs/gangnam-g1/q20/`). y=(2/3)x³+2x²+x, A(−2,2/3), B(−1,1/3), A·B의 접선(기울기 1, −1), 교점 C(−5/3,1)에 **직각 표시**, AB 지름 원. 정답 5π/18은 caption만.
  2. 26 강남여고 고2 미적분I q16 (#16, 이전 `.../gangnam-g1/q16/`). y=1−x², 예 t=1/2인 P, 접선 l과 x축 교점 C(5/4,0), C에서 x축에 수직인 직선, 직선 OP와의 교점 R — C에 **직각 표시**. 정답 8은 caption만.
  3. 26 매산고 고2 미적분I q15 (`.../h2/2mid/26_매산고_2학기_중간_고2_미적분I.js` #15, packet `.../packets/26_매산고_2학기_중간_고2_미적분I.json`, 이전 `.../maesan-g2/q15/`). y=4−x², A(−2,0), B(2,0), 예 t=1인 P(1,3), 이등분선 PQ — P의 **같은 두 각을 같은 색 호**로. 정답 1/5은 caption만.

## 기능 2: 세로 점근선 라벨 자리 `verticalAsymptoteLabelAt`
- 왜: 26 강남여고 고2 미적분I q8의 유리함수 그래프에서 자동 라벨 "x=−2"가 y축 바로 옆에 놓여 학생이 y축 라벨로 오해한다. 지시선 callout으로 바른 라벨을 달아도 자동 라벨이 중복으로 남는다(phase 0 c1).
- 지금: `production/phase2.mjs:724`(상수 분자 경우 :429)가 극 + 폭의 7% 위치에 고정. `asymptoteLabelAt`은 가로 점근선만. `_fit_rational_overview`가 viewport를 덮어쓴다. 검증 `graph_framing.py:392`, 관측 `graph_observer.py:4358` asymptote_label_audit.
- 필드: `graphPlan.verticalAsymptoteLabelAt`: `TOP_LEFT`·`TOP_RIGHT`·`BOTTOM_LEFT`·`BOTTOM_RIGHT`(점선의 어느 쪽 위·아래 끝 근처) 또는 `NONE`(자동 라벨 끄기 — 이때는 작성자가 callout 등으로 직접 단다; 관측기는 점근선 식 라벨이 어디에든 하나 있는지 확인하고 하나도 없으면 `VERTICAL_ASYMPTOTE_LABEL_MISSING`).
- 배치: 고른 자리에서 곡선·축과 겹치지 않는지 기존 겹침 검사. 겹치면 `VERTICAL_ASYMPTOTE_LABEL_NO_ROOM`.
- 관측기: 라벨이 점근선(점선)에 붙어 있고(가로 거리 일정 이하), y축에 더 가깝지 않은지 확인.
- 샘플: 26 강남여고 고2 미적분I q8 (#8, phase 0 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g13-p0/c1-asym/` plan.json 출발). 남는 시간이 있으면 효천고 고2 미적분I q7(시험 파일은 `archive/exams/original/high/h2/2mid/`에서 `26_효천고*미적분*`로 찾는다; packet이 없으면 `node /home/user/AP------/.tmp/svg-m1/make-packet.mjs`가 아니라 시험 JS를 직접 읽는다).

## 기능 3: 그래프 선분 길이 라벨이 근호일 때 관측 불일치 (버그 고치기)
- 왜: 26 팔마고 고2 미적분I q20에서 OP=√2를 선분 `length:true`로 달면 `OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH`가 난다. 관측기는 √를 앞에, MathJax 출력은 근호 안 숫자를 먼저 낸다(`graph_observer.py:3422`). 길이 지시선은 `OVERLAY_UNDECLARED`(:3559).
- 할 일: 관측기의 텍스트 비교를 MathJax 출력 순서에 맞게 고친다(약화 금지 — 같은 값이 아니면 여전히 거절). 길이 지시선이 선언된 덧그림으로 인정되게 한다.
- 샘플: 팔마고 q20 (`/home/user/AP------/.tmp/svg-m1/runs/g13-p0/c4-palma/plan-pass.json` 출발)에 선분 OP `length:true`(√2)를 더해 ARCHIVE_BOUND. 이 그림은 이미 따로 게시하므로 확인용이다.

## 정답지 회귀 (시작 전·후 바이트 동일)
유리함수 item49, item57, item106g12; 조각다항 item30, item62j, item72g6, item74g6c, item77g5b, item78g5b, item103g12, item104g12; 불연속 item76g7c, item105g12; 평면 표시 대표 item19, item20, item44, item80. 새 항목 `item109g13a`(강남 미적분 q20 직각) + manifest.

## 주의
- G13c 작업자가 같은 시각 `graph_framing.py`의 조각 상한(:2143 근처)을 바꾼다. 그 부분은 건드리지 않는다(병합은 메인이 한다).
