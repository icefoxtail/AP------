# G18b: 그래프 — 등축척 · 무리함수 overlay 직선 · 점 callout 지시선 · 영역 색칠 · 절댓값 곡선 · 큰 극값 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g18b`로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g18b/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순(1~3 핵심).
워크트리 기준은 작업 브랜치: `git fetch origin ccr-467a4126-sn3mnl && git reset --hard origin/ccr-467a4126-sn3mnl`, `git log --oneline -3`에 G18a 병합과 이 지시서 커밋이 보여야 한다.

## 왜 (학생에게 무엇이 좋은가)
고1·고2 2학기 기말 그래프 해설 검수에서 FAIL이 가장 많았던 원인이다: 가로·세로 눈금 비가 달라 y=x 대칭·정사각형·기울기가 틀어져 보임(유리함수 그래프 6문항 이상), 무리함수 그래프에 직선을 겹치면 감사 실패, 점 옆 설명(callout)의 지시선이 없거나 축과 교차해 거절, 곡선·축·직선으로 둘러싼 영역을 못 칠함. 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다.

## 지금 코드
`production/phase2.mjs`(rationalSpec·sqrt·multiCurve·overlay·callout), 관측 `production/graph_observer.py`, 틀 `production/graph_framing.py`(axisScale·equalUnits), 힌트 `ops/tools/hints.mjs`, 가이드 `production/author-guide-body.md` 그래프 절. G18a가 multi-curve 섞기·hideLabels·formulaTex·emphasis를 넣었다.

## 기능 1: 등축척(equalUnits) 확대
- rational(분자 비상수 포함)·sqrt-affine·multi-curve·piecewise에 `equalUnits:true` 옵트인: 가로·세로 1눈금 길이를 같게. 틀이 너무 길쭉해지면 창(window)을 줄이거나 캔버스 비를 바꿔 맞추고, 그래도 안 되면 거절 `EQUAL_UNITS_WINDOW_TOO_WIDE`.
- 관측기: 눈금 간격 픽셀이 x·y에서 같은지(±1px), y=x 직선이 45°인지.
- 지금 `axisScale`의 EQUAL_UNIT_SCALE_MISMATCH(작은 y범위)도 함께 원인 확인.
- 샘플: 25 효천고 고1 q12·q22, 24 제일고 고1 q11·q17, 24 매산여고 고1 q5·q15, 25 순천여고 고1 q14(유리함수 y=x 대칭), 25 제일고 고2 확통 q8.

## 기능 2: 무리함수 overlay 직선·점 (버그·공백)
- sqrt-affine + `overlays.lines`: 창에 원점이 없으면 OVERLAY_LINE_MISMATCH, 재프레임 때 x축이 사라짐, `curveX` 점의 offset(+d) 누락(25 팔마고 q5에서 확인). 원인을 고치고 회귀 테스트.
- 샘플: 25 순천여고 q17, 24 강남여고 q2, 24 금당고 q5, 25 금당고 q22, 24 금당고 q10(무리함수 그래프+직선 교점 — 지금 t 치환 포물선으로 대체돼 FAIL).

## 기능 3: 점 callout 지시선
- 점 옆 callout(좌표·이름)의 지시선 누락 OVERLAY_CALLOUT_LEADER_MISSING, 축과 교차 LEADER_CROSSING, 쉼표 TEXT_INVALID, 좌표 라벨 BROWSER_PANEL_VARIANT_MEASUREMENT_REQUIRED. 자리 탐색을 8방향+거리 2단계로 넓히고, 축을 건너지 않는 자리를 우선. callout 글자에 쉼표·괄호·그리스 문자(α β γ θ)·프라임(′) 허용.
- 샘플: 25 순천고 고1 q14, 24 제일고 고1 q15, 24 강남여고 고1 q24, 25 효천고 고1 q23(P 좌표), 25 매산고 고2 q19(α·β·γ).

## 기능 4: 영역 색칠 (남는 시간)
- `regions:[{"between":["f","g"],"from":a,"to":b}]`(두 곡선 사이), `{"under":"f","from":a,"to":b}`, 곡선과 현(직선) 사이 활꼴, 반평면 x<k·y<k의 무한 영역(창 경계까지).
- 샘플: 24 강남여고 고1 q16, 24 금당고 고1 q14, 25 금당고 고1 q12.

## 기능 5: 절댓값·큰 극값 (남는 시간)
- `y=|f(x)|`(유리·무리) 곡선, 사차함수 큰 극값의 y 압축 한도 완화(PIECEWISE_POLY_CURVE_TOO_NARROW), 3·4차 조각에 p+q√r 계수.
- 샘플: 24 매산여고 고1 q7(|유리|), 25 순천고 고1 q17(|√(2x+2)−2|), 24 효천고 고1 q14, 25 매산고 고2 q16, 25 매산여고 고2 q23.

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 rational·sqrt-affine·multi-curve(item113g18a)·piecewise-polynomial·overlay callout을 쓰는 항목 12개 안팎. 새 항목 `item115g18b`(등축척 유리함수) + manifest.

## 실제 문항 결과
`runs/g18b/<시험 약칭>-q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답). 지금 그림·plan은 `runs/h1f-coord*/`·`runs/h2f-coord*/` 해당 시험지 폴더(그 summary.json의 사유), packet은 `/home/user/AP------/.tmp/svg-m1/packets/<시험지>.json`.
