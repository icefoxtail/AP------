# G18c: 그래프 — 영역 색칠 · 절댓값 곡선 · 큰 극값 · 라벨 자리 지정 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g18c`로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g18c/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순.
워크트리 기준은 작업 브랜치: `git fetch origin ccr-467a4126-sn3mnl && git reset --hard origin/ccr-467a4126-sn3mnl`, `git log --oneline -3`에 G18b 병합(8077d949)과 이 지시서 커밋이 보여야 한다. 같은 시간에 작업자 3명이 그림을 렌더한다(렌더는 1분 load < 8일 때 하나씩).

## 왜 (학생에게 무엇이 좋은가)
G18b 뒤에도 고1·고2 2학기 기말 해설 그림 11문항이 남았다. 해설은 "두 곡선 사이 넓이", "x<2, y<3인 영역", "y=|f(x)|를 그려 교점 개수를 센다"로 푸는데 엔진이 그 영역과 곡선을 못 그린다. 또 선·곡선이 많은 그림은 라벨 자리를 작가가 정할 수 없어 라벨이 엉뚱한 곳에 떠 있다. 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다. G18b 지시서(`engine-g18b-graph-layout.md`) 기능 4·5와 추가 요청 중 남은 것이다.

## 지금 코드
`production/phase2.mjs`(rational·sqrt·multiCurve·piecewise·overlay·callout), 관측 `production/graph_observer.py`, 틀 `production/graph_framing.py`, 라벨 `visual_engine/label_layout.py`, 힌트 `ops/tools/hints.mjs`, 가이드 `production/author-guide-body.md` 그래프 절(`graphPlan.regions`는 piecewise-polynomial에만 있다).

## 기능 1: 영역 색칠 (multi-curve·rational·sqrt)
- `regions:[{"between":["f","g"],"from":a,"to":b}]`(두 곡선 사이), `{"under":"f","from":a,"to":b}`(곡선과 x축 사이), 곡선과 직선(현) 사이 활꼴, 반평면·사분면 조각 `{"halfPlane":{"x":"<","value":2},"and":{"y":"<","value":3}}`처럼 창 경계까지 가는 무한 영역(바깥 경계는 그리지 않거나 점선).
- 관측기: 영역 경계가 plan 식과 맞는지 표본점으로 확인, 영역이 획을 덮지 않는지.
- 샘플: 25 금당고 고1 q12(x<2, y<3 무한 영역), 24 강남여고 고1 q16, 25 강남여고 고2 q13.

## 기능 2: 절댓값 곡선·큰 극값
- `y=|f(x)|`(유리·무리·다항) 곡선: 접힌 부분은 실선, 원래 아래쪽은 옅은 점선(선택).
- 사차·삼차 큰 극값의 y 압축 한도 완화(PIECEWISE_POLY_CURVE_TOO_NARROW), 3·4차 조각에 p+q√r 계수.
- 삼차+이차를 한 그림에(PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM: 교점이 닫힌 꼴이 아니면 수치로 허용).
- 샘플: 24 매산여고 고1 q7(|유리|), 25 순천고 고1 q17(|√(2x+2)−2|), 24 효천고 고1 q14, 25 매산고 고2 q16, 25 매산여고 고2 q23.

## 기능 3: 라벨 자리 지정
- multi-curve 곡선 라벨과 overlay 직선 라벨에 `labelAt`(x 값 또는 "start"|"end"|"mid"). 라벨 붙은 수평선 5개 이상이어도 LAYOUT_INVENTORY_INCOMPLETE 없이 자리 잡기(25 효천고 고1 q17).
- piecewise-polynomial `referenceCurves`의 nameLabel LEADER(25 강남여고 고2 q13, PIECEWISE_POLY_REFERENCE_CURVES_INVALID), `referenceLines` 라벨 자리(25 제일고 고2 q14, y=6 라벨이 위에 떠 있음).
- 선언한 점의 좌표 라벨은 그 점이 주인(25 순천여고 고1 q20, x절편 (−1,0)에서 OVERLAY_COORDINATES_LABEL_AMBIGUOUS_OWNER).

## 기능 4 (남는 시간): 집합 그림 안쪽 이름
- set-diagram 2집합 포함(개수 없음)에서 안쪽 집합 이름이 바깥 원 선에 걸림 → 안쪽 원 안 또는 넓은 고리 쪽에 두기.

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 piecewise-polynomial(regions 포함)·multi-curve(item113g18a)·rational(item115g18b)·overlay callout·set-diagram 항목 12개 안팎. G18b 검수에 쓴 `runs/g18b/golden-run.sh`를 복사해 쓰면 된다. 새 항목 `item116g18c`(영역 색칠) + manifest.

## 실제 문항 결과
위 샘플 11문항(`/home/user/AP------/.tmp/svg-m1/runs/t-r3-g18c.txt` 각 줄: CURRENT 폴더·REVIEW·LAST 사유)을 `runs/g18c/<시험지>/q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답)으로 만든다. 정답 값은 그림에 쓰지 않고 caption 끝에만. 입력 표기(^, sqrt, *)는 caption·alt에 쓰지 않는다. `summary.json`에 문항별 status.
