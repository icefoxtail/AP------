# 2025 팔마고 고1 2학기 기말 유사3 — 문제·해설 시각 플랜 검수 (Q01~Q11)

- 원문: `archive/exams/similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사3.js` (23문항, Git blob `1f4eefe4da20259cba2ec4e9040dfb2089366496`, SHA-256 `13ae4392d2e0ee853856f708bbdbfe8ddbfdf68f61c0ff9a3e746b17f44c96a0`). `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사3/source-revision.json`과 SHA-256 직접 일치.
- 배치: **Q01~Q11(11문항, 문제·해설 22축)**. Q12~Q23은 다음 배치. plan 경로는 이 `_plans/` 폴더 기준.
- 과거 소스 결속 초안 12개를 각각 현행 발문·현재 해설·실제 그려지는 JSON 필드와 대조하여 제작 경로로 이관·수리했다. 문제 plan은 정답 강조/계산 결과를 추가하지 않고 면 채움도 넣지 않았다.
- 공식 검사: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <12개 plan>` **12/12 OK**, 같은 12개 `--jobs 2` **full 12/12 OK**. `DRAWN_FEATURE_PARITY`는 렌더 대상 필드와 원문 조건의 1:1 대응 판정이며, 실제 SVG/PNG 렌더·육안/A4/학생화면 검수는 **NOT_RUN**.

| 파일/qid | 축 | 판정과 사유 | capability | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY (원문 ↔ 실제 출력 필드) |
| --- | --- | --- | --- | --- | --- | --- |
| 팔마3/Q01 | 문제 | REQUIRED — 함수 판정에 다섯 원그림 필수 | construction-spike-v1 | `q01-problem.plan.json` | PASS/PASS | **PASS** — `mathPlan.nodes`, `displaySegments`, `planeMarks.arcs`, `displayCircles[ko0]`, `unmarkedPointNames`: (1) 직선, (2) x=0의 열린 (0,−1)·닫힌 (0,1), (3) 양 끝 포함 반원, (4) x=1의 닫힌 점 (1,1),(1,2), (5) (−1,2),(0,2),(1,2) 세 닫힌 점. 문제에 답 번호 강조 없음 |
| 팔마3/Q01 | 해설 | BENEFICIAL — 다섯 수직선 판정의 교점 수 | construction-spike-v1 | `q01-solution.plan.json` | PASS/PASS | **PASS** — 문제의 다섯 패널/개·폐 점을 보존하고 `displaySegments`, `planeMarks.expressionLabels`에 수직선 검사 표시. 특히 (4)의 x=1 두 점 모두 점표식으로 실제 표시 |
| 팔마3/Q02 | 문제 | REQUIRED — f,g의 주어진 대응도가 발문 자료 | set-diagram-figure-v1 | `q02-problem.plan.json` | PASS/PASS | **PASS** — `diagram.arrows`: f=(1→4,2→3,3→1,4→2,5→5), g=(1→2,2→5,3→4,4→3,5→1); 해설 경로 강조 없음 |
| 팔마3/Q02 | 해설 | BENEFICIAL — 합성 순서를 별개 색 경로로 구별 | set-diagram-figure-v1 | `q02-solution.plan.json` | PASS/PASS | **PASS** — `diagram.highlightPaths`에 2→3→4와 2→5→5, 원문 g(f(2))=4·f(g(2))=5와 일치 |
| 팔마3/Q03 | 문제 | REQUIRED — 두 함수 대응도가 유일한 조건 | set-diagram-figure-v1 | `q03-problem.plan.json` | PASS/PASS | **PASS** — `diagram.arrows`: f=(1→3,2→4,3→1,4→2), g=(1→2,2→4,3→1,4→3); 풀이 합계 비노출 |
| 팔마3/Q03 | 해설 | BENEFICIAL — 역함수 화살표 역추적 | set-diagram-figure-v1 | `q03-solution.plan.json` | PASS/PASS | **PASS** — `highlightPaths`에 g(4)=3, f(1)=3, g(3)=1, 결과 1+3=4 |
| 팔마3/Q04 | 문제 | EXEMPT — 유리함수·사분면 조건이 식으로 완결 | — | — | N/A | N/A |
| 팔마3/Q04 | 해설 | BENEFICIAL — 제1사분면에 들어오는 경계 비교 | multi-curve-figure-v1 | `q04-solution.plan.json` | PASS/PASS | **PASS** — `curves` k=0,1의 유리함수, `overlays.lines` 점근선 x=−1·y=−3, `overlays.points` 원점·(0,1) |
| 팔마3/Q05 | 문제 | REQUIRED — 그래프의 끝점·통과점이 미지수 결정 조건 | multi-curve-figure-v1 | `q05-problem.plan.json` | PASS/PASS | **PASS** — `SQRT` 곡선 시작 E(2,1), P(6,3), `hideLabels:["formula","start"]`; 미지 함수식·답 18 비표시 |
| 팔마3/Q05 | 해설 | BENEFICIAL — 함수 복원·역함숫값의 수평선 교점 | multi-curve-figure-v1 | `q05-solution.plan.json` | PASS/PASS | **PASS** — `curves` √(x−2)+1와 y=5, `overlays.points` E(2,1),P(6,3),T(18,5) |
| 팔마3/Q06 | 문제 | EXEMPT — 유리함수식과 역함수 점근선 조건만 제시 | — | — | N/A | N/A |
| 팔마3/Q06 | 해설 | BENEFICIAL — f·역함수 y=x 대칭과 점근선 교환 | multi-curve-figure-v1 | `q06-solution.plan.json` | PASS/PASS | **PASS** — `curves` f=(2x−1)/(x−3), `inverseOf:f`, y=x; 점근선 (x=3,y=2)↔(x=2,y=3), `overlays.points` (4,7),(7,4) |
| 팔마3/Q07 | 문제 | EXEMPT — 유리함수식·구간 조건을 문자로 제시 | — | — | N/A | N/A |
| 팔마3/Q07 | 해설 | BENEFICIAL — 감소 함수의 양 끝 극값 | multi-curve-figure-v1 | `q07-solution.plan.json` | PASS/PASS | **PASS** — `curves[f].domain` 1~6 양 끝 `CLOSED`, `overlays.points` A(1,11/2), B(6,3); 정의역 밖 곡선 제거 |
| 팔마3/Q08 | 문제 | EXEMPT — 반복합성의 정의·함수식만 존재 | — | — | N/A | N/A |
| 팔마3/Q08 | 해설 | EXEMPT — fⁿ(x)=x−3n의 단순 대수 계산 | — | — | N/A | N/A |
| 팔마3/Q09 | 문제 | EXEMPT — 가법 함수 등식만 존재 | — | — | N/A | N/A |
| 팔마3/Q09 | 해설 | EXEMPT — 함수값 대입·계산으로 완결 | — | — | N/A | N/A |
| 팔마3/Q10 | 문제 | EXEMPT — 일차함수 합성 조건만 존재 | — | — | N/A | N/A |
| 팔마3/Q10 | 해설 | EXEMPT — k에 대한 이차식 인수분해 | — | — | N/A | N/A |
| 팔마3/Q11 | 문제 | EXEMPT — 이차함수식·정의역·접점을 식으로 제시 | — | — | N/A | N/A |
| 팔마3/Q11 | 해설 | BENEFICIAL — 역함수와 y=x의 접함 | multi-curve-figure-v1 | `q11-solution.plan.json` | PASS/PASS | **PASS** — f=x²−5x+9 (x≥5/2), `inverseOf:f`, y=x 및 `overlays.points` T(3,3), 면 채움 없음 |

**총계** 11문항·22축 = REQUIRED 4 + BENEFICIAL 8 + EXEMPT 10. 실사용 plan **12**, shallow/full **12/12**, field parity **12/12**, `ENGINE_CAPABILITY_PENDING` **0**, 렌더·PNG·학생화면·A4 **NOT_RUN**. Q01의 닫힌 점 P24/P27/P28/P31/P33/P34 표시 누락 및 애매한 숫자 나열 라벨을 수리했다. Q07은 실제 정의역에 맞췄다.
