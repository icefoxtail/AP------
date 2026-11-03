# G18a: 그래프 — 음수 계수 유리함수 버그 · 여러 곡선 섞기(유리·무리·직선) · 자동 라벨 숨김 · 구간 강조 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g18a`로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g18a/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순.
워크트리 기준은 작업 브랜치 `ccr-467a4126-sn3mnl`(G17 포함)이다: `git fetch origin ccr-467a4126-sn3mnl && git reset --hard origin/ccr-467a4126-sn3mnl`로 맞추고 `git log --oneline -1`로 확인(G17 병합 32526fe4 이후).

## 왜 (학생에게 무엇이 좋은가)
고1 2학기 유리함수·무리함수·역함수 해설은 "두 그래프를 한 좌표평면에 그려 교점을 본다", "y=f(x)와 y=f⁻¹(x)는 y=x에 대칭", "이 구간에서 최댓값"으로 푼다. 25·24 고1 기말 148문항을 그리며 이 그림들이 엔진 공백으로 빠지거나(약 15문항) 캡션 설명으로 대신했다. 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다.

## 지금 코드
`production/phase2.mjs`(rationalSpec·sqrt·`multiCurveSpec` :1314 근처), 관측 `production/graph_observer.py`, 틀 `production/graph_framing.py`, 힌트 `ops/tools/hints.mjs`, 가이드 `production/author-guide-body.md` 그래프 절. 관련 테스트 `tests/test_rational_*.py`, `tests/test_graph_*.py`.

## 기능 1 (버그): 음수 계수 유리함수의 정적 감사 실패
- y=5/(3−x)−2, y=−x/(x−1)(= −1−1/(x−1))처럼 k<0(왼쪽 가지 위·오른쪽 가지 아래)인 일차/일차 유리함수가 `STATIC_GRAPH_AUDIT_FAIL`(RATIONAL_ASYMPTOTE_GEOMETRY_MISMATCH, UNCLIPPED_CURVE). 원인을 찾아 고친다(부호·분모 정규화 의심). 회귀 테스트 추가.
- 샘플: 25 팔마고 고1 q4(`/home/user/AP------/.tmp/svg-m1/runs/h1f-coord1/25_팔마고_2학기_기말_고1_기출/q4/`), 25 제일고 고1 q13(`.../h1f-coord3/25_제일고_2학기_기말_고1_기출/q13/`).

## 기능 2: multi-curve에 유리·무리 곡선, 2개부터, 곡선별 색·굵기
- `multi-curve-figure-v1` 곡선 종류에 RATIONAL(일차/일차)·SQRT(a√(bx+c)+d)·LINE을 추가하고 최소 곡선 수를 2로. 곡선별 `color`(C1 팔레트), `weight`("BOLD"|"NORMAL"), `style`("SOLID"|"DASHED"), `label`(자동 식 대신 주어진 꼴 TeX 또는 "f(x)" 같은 이름, 또는 `hideLabel:true`).
- 점근선(유리)·시작점(무리) 표시는 각 곡선 종류의 기존 규칙을 그대로.
- 역함수 쌍: 곡선 하나에 `inverseOf:"<id>"`로 y=x 대칭 곡선을 그리기(유리·무리·이차 반쪽), y=x 직선 선택 표시.
- 관측기: 곡선마다 표본점을 plan 식으로 다시 계산해 SVG 경로와 대조, 색·굵기 속성 확인, 역함수 곡선은 대칭 점 대조.
- 샘플: 24 매산여고 고1 q6(유리+무리), 24 매산여고 q16, 24 금당고 q18(유리+무리), 24 제일고 q21(유리 역함수 쌍+y=x), 25 효천고 q11(무리 f + f⁻¹ + y=x), 25 순천여고 q13(유리 두 개), 24 효천고 q1(y=1/x 회색 점선 + 평행이동 곡선), 24 금당고 q20(g 굵게). 지금 plan·사유: 각 `runs/h1f-coord*/summary.json`에서 해당 시험지·문항.

## 기능 3: 자동 라벨 숨김·주어진 꼴
- rational·sqrt-affine 단일 곡선 plan에 `hideLabels:["formula","asymptotes","start"]`(골라서), `formulaTex`(주어진 꼴, 예 `-\frac{8}{x-1}-4`; 관측기는 식이 같은 함수인지 수치로 확인).
- 이유: 점근선 값이 정답이면 자동 라벨이 정답을 드러낸다(24 효천고 q1), 자동 식 꼴이 해설 꼴과 달라 헷갈림(25 금당고 q9), 식 라벨 자리가 없어 렌더 실패(25 팔마고 q23).
- 샘플: 25 팔마고 q23, 25 팔마고 q7(정의역 0≤x≤4 강조 + 식 숨김), 25 금당고 q9.

## 기능 4: 곡선 구간 강조 (남는 시간)
- 곡선마다 `emphasis:[{"from":a,"to":b,"color":"WARM"}]` — 그 구간만 굵게·색. 끝점은 열린/닫힌 점 선택. 정의역 제한 `domain:{from,to}`(그 밖은 그리지 않음)도.
- 샘플: 25 순천여고 q11(x≥4), 25 팔마고 q20(x≤2), 24 강남여고 q14(2≤x≤a), 25 팔마고 q7.

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 rational-spike·sqrt-affine-spike·multi-curve·inverse-proportion을 쓰는 항목 12개 안팎(점근선 라벨·overlay 포함). 새 항목 `item113g18a`(유리+무리 multi-curve) + manifest.

## 실제 문항 결과
`runs/g18a/<시험 약칭>-q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답). 기존 폴더의 publish.json이 있으면 출발점으로, 없으면 packet(`/home/user/AP------/.tmp/svg-m1/packets/<시험지>.json`)의 해설로 쓴다.
