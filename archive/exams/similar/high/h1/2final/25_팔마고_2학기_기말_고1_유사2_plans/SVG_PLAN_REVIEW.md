# 2025 팔마고 고1 2학기 기말 유사2 — SVG plan 정밀검수 (1차 배치)

- 기준 JS: `archive/exams/similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사2.js` (Git blob `76b48b16bd4bb2e9888827ce0946eb519f430450`, SHA-256 `1eba9a36f70291212144297e72950cd5db677f34b047c824d2b2eba6010494be`).
- 범위: **Q01~Q11, 11문항/22축**. Q12~Q23(12문항)는 후속 배치. 표의 계획 경로는 이 `_plans/` 폴더 상대 경로다.
- 같은 JS SHA-256에 결속된 `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사2/`의 기존 엔진 계획을 문항·축별로 원문에 대조한 뒤 제작 경로로 이관했다. 유형은행/교과서 및 원본 JS·이미지에는 변경이 없다.
- **공식 검사**: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <12개 제작 plan 경로>` = 12/12 OK, FAIL 0, SKIP 0; 같은 12개 `--jobs 2` full = 12/12 OK, FAIL 0, SKIP 0.
- `DRAWN_FEATURE_PARITY=PASS`는 원문의 좌표·선분·화살표·라벨·열린 점·그래프·정의역을 **그려지는 plan 필드**에 1:1로 대조했음을 뜻한다. 실제 학생용 SVG 렌더, 시각 QA, JS 연결 변경은 `NOT_RUN` 또는 `UNCHANGED`다. 문제 축은 정답을 노출하지 않으며, 면 채움은 기본 사용하지 않는다.

| 파일/qid | 축 | 판정·개별 사유 | capability | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY / 실제 필드 |
| --- | --- | --- | --- | --- | --- | --- |
| 팔마고 유사2/Q01 | 문제 | REQUIRED — 다섯 함수 후보의 원그림 자체가 발문 자료 | construction-spike-v1 | `q01-problem.plan.json` | PASS/PASS | PASS — (가)~(마) 다섯 소그림의 축·곡선·점·선분을 `nodes` 및 `display*`로 재구성; (나) 뚫린 원은 원주 표식으로, (마)의 같은 x 좌표 두 채운 점은 유지; 합격 후보 미강조 |
| 팔마고 유사2/Q01 | 해설 | BENEFICIAL — 각 그림에서 수직선 판정 | construction-spike-v1 | `q01-solution.plan.json` | PASS/PASS | PASS — 문제의 다섯 패널을 보존하고 해설 판정용 수직선·교점 표시를 추가; 문제 전용 답 노출 없음 |
| 팔마고 유사2/Q02 | 문제 | REQUIRED — f,g의 원래 대응도가 문제 조건 | set-diagram-figure-v1 | `q02-problem.plan.json` | PASS/PASS | PASS — g:1→4,2→1,3→2,4→5,5→3; f:1→3,2→5,3→1,4→2,5→4를 `panels[].diagram.arrows`에 모두 기재, 정답 경로 무강조 |
| 팔마고 유사2/Q02 | 해설 | BENEFICIAL — 합성의 경로 강조 | set-diagram-figure-v1 | `q02-solution.plan.json` | PASS/PASS | PASS — 두 패널·전체 대응을 그대로 둔 채 `highlightPaths`로 3→2→5 경로 표시 |
| 팔마고 유사2/Q03 | 문제 | REQUIRED — 두 집합 대응도에서 역합성을 판정 | set-diagram-figure-v1 | `q03-problem.plan.json` | PASS/PASS | PASS — f:2→4,3→5,4→2,5→3 및 g:2→5,3→2,4→3,5→4를 모두 작성, 결과 합계 비표시 |
| 팔마고 유사2/Q03 | 해설 | BENEFICIAL — 역함수 경로와 합계 | set-diagram-figure-v1 | `q03-solution.plan.json` | PASS/PASS | PASS — 같은 정점·화살표에 역추적 강조, 두 결과 3·5의 합 8은 해설 축에만 기술 |
| 팔마고 유사2/Q04 | 문제 | EXEMPT — 유리함수 식과 평행이동 조건으로 완결 | — | — | N/A | N/A |
| 팔마고 유사2/Q04 | 해설 | BENEFICIAL — 점근선과 두 절편 위치 | multi-curve-figure-v1 | `q04-solution.plan.json` | PASS/PASS | PASS — y=1/(x+2)−1 `RATIONAL` 곡선, 수직·수평 점근선 x=−2,y=−1, 교점 (−1,0),(0,−1/2) |
| 팔마고 유사2/Q05 | 문제 | REQUIRED — 실제 주어진 무리함수 모양·점이 발문 자료 | multi-curve-figure-v1 | `q05-problem.plan.json` | PASS/PASS | PASS — 시작점 (−3,−2), 통과점 (1,0)의 `SQRT` 그래프, `hideLabels:["formula"]`로 미지 식·정답 비노출 |
| 팔마고 유사2/Q05 | 해설 | BENEFICIAL — 그래프 역산과 y=2의 교점 | multi-curve-figure-v1 | `q05-solution.plan.json` | PASS/PASS | PASS — y=√(x+3)−2 곡선, 시작점·주어진 점 및 y=2와의 교점 (13,2)을 표시 |
| 팔마고 유사2/Q06 | 문제 | EXEMPT — 유리함수 조건·점근선이 식으로 완결 | — | — | N/A | N/A |
| 팔마고 유사2/Q06 | 해설 | BENEFICIAL — 점근선 교점과 수평선 교점 | multi-curve-figure-v1 | `q06-solution.plan.json` | PASS/PASS | PASS — f(x)=(3x+10)/(x+2), 점근선 x=−2,y=3, y=1과의 교점 (−4,1) |
| 팔마고 유사2/Q07 | 문제 | EXEMPT — 정의역과 유리함수 최댓값·최솟값 조건만 제시 | — | — | N/A | N/A |
| 팔마고 유사2/Q07 | 해설 | BENEFICIAL — 정의역에서 단조증가 양 끝값 | multi-curve-figure-v1 | `q07-solution.plan.json` | PASS/PASS | PASS — f(x)=(7x−5)/(x+1) 곡선을 `curves[].domain` [1,5]의 `CLOSED` 양 끝으로 제한하고, (1,1),(5,5)를 점 라벨로 표시. 그 외 정의역 외 그래프 제거 |
| 팔마고 유사2/Q08 | 문제 | EXEMPT — 반복 합성의 식·조건만 존재 | — | — | N/A | N/A |
| 팔마고 유사2/Q08 | 해설 | EXEMPT — n번 반복의 대수적 식 전개로 완결 | — | — | N/A | N/A |
| 팔마고 유사2/Q09 | 문제 | EXEMPT — 함수 방정식의 등식만 존재 | — | — | N/A | N/A |
| 팔마고 유사2/Q09 | 해설 | EXEMPT — 대입·이항의 단순식 계산으로 완결 | — | — | N/A | N/A |
| 팔마고 유사2/Q10 | 문제 | EXEMPT — 일차함수 합성·정수 조건만 존재 | — | — | N/A | N/A |
| 팔마고 유사2/Q10 | 해설 | EXEMPT — 인수 분해와 후보 판정으로 완결 | — | — | N/A | N/A |
| 팔마고 유사2/Q11 | 문제 | EXEMPT — f의 식과 정의역이 명시되어 있음 | — | — | N/A | N/A |
| 팔마고 유사2/Q11 | 해설 | BENEFICIAL — 정의역 제한 이차함수와 역함수 교점 | multi-curve-figure-v1 | `q11-solution.plan.json` | PASS/PASS | PASS — f(x)=x²/2−3x+8의 x≥3 부분, 역함수 곡선 및 y=x, 교점 (4,4), 면 채움 없음 |

**합계:** 11문항/22축 = REQUIRED 4 + BENEFICIAL 8 + EXEMPT 10. 제작 plan 12개, shallow 12/12, full 12/12, DRAWN_FEATURE_PARITY 12/12, ENGINE_CAPABILITY_PENDING 0. 면 채움 0건. 학생용 실물 렌더·연결·게시 `NOT_RUN`.
