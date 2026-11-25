# 고2 유형은행 미적분Ⅱ 019–064 도형 plan 작성·검수 인계

- 대상: `archive/exams/types/high/h2/미적분II_{019,030,031,037,061,063,064}_*.js`의 그림 요구 26문항. 기하 선행 작업 172–205가 기존 main에 반영된 것을 확인한 뒤, 신규 미적분Ⅱ 유형군에서 원문 그림 슬롯 기준으로 첫 미작성 26개를 선택했다.
- 원문 변경: 없음. 시험지·교과서·기타 유형군 변경: 없음. 출력 SVG/PNG 수동 생성: 없음.
- 원본 기준: 각 `content` 내부 `[그림: ...]` 및 문항 본문의 수식. 각 JSON의 `sourceQuote`, `sourceConditions[].mappedTo`를 실제 draw field와 교차 대조.
- 계획 생성: `archive/tools/geometry-equation/production/plans/<원문 stem>/qNN-problem.plan.json`. 해설 plan은 이번 범위 아님.
- 기반 main: `ca30568c6f92336a2b992bd4904cf1de790ac46f` (2026-11-26 KST 재조회). 직전 172–205 작업과 중복 경로 없음.
- 공식 검사: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/tools/geometry-equation/production/plans/미적분II_0{19,30,31,37,61,63,64}_*/q*-problem.plan.json` — **26 OK / 0 FAIL**.
- 공식 검사(의존성 setup 완료 뒤 full): 위 명령의 `--shallow`을 제거한 검사 — **26 OK / 0 FAIL**. 문법·계산 가능성 통과이며, 최종 SVG 관측 증빙은 아니다.
- 독립 DRAWN_FEATURE_PARITY: 원문 요구가 실제 그리기 필드(`mathPlan.nodes`, `displayPoints/Segments/Lines/Circles`, `planeMarks`, `graphPlan.curves/overlays`)에 매핑되는지를 26개별 검수. **25 COMPLETE / 1 ENGINE_CAPABILITY_PENDING** (`064/q03`의 `A_0` 아래첨자 점 이름).
- 운영 후속 분리: render/PNG 육안 검토, 출판 글자 위치, 학생 가독성, A4 인쇄 확인: **NOT_RUN**. 이 인계서와 plan-lint PASS를 해당 단계 PASS로 간주하지 않는다.

## 문항별 원문-필드 1:1 DRAWN_FEATURE_PARITY

| 원문 stem / 문항 | 원문 그림 요구 → 실제 JSON drawing 필드(대표 지수 명시) | 판정 |
|---|---|---|
| 019/q01 | 단위 정삼각형 격자 꼭짓점 → 6 `displayPoints`/9 `displaySegments`, `planeMarks.expressionLabels` 단위 1 | COMPLETE |
| 019/q02 | `0≤x≤2n,0≤y≤n` 정수 격자선·격자점 → n=2 예시, 15 points/22 segments, 단위 1 | COMPLETE |
| 019/q03 | n×2 직사각형의 단위 정사각형·격자점 → n=2 예시, 9 points/12 segments, 단위 1 | COMPLETE |
| 019/q04 | k열의 높이 `2k`와 정수 수평선 → k=1,2 예시, 13 points/18 segments, 단위 1 | COMPLETE |
| 030/q01 | `5^x,2^x` 곡선·`x=n`·`P_n,Q_n` 연결 → `graphPlan.curves[0..1]`, `overlays.lines/points/segments/callouts`, n=1·2 예시 | COMPLETE |
| 030/q02 | `y=√x`, `x=9^n`의 `P_nP_{n+1}` → SQRT curve, x=9·81 lines, 정확한 두 points와 연결 segment, n=1 | COMPLETE |
| 030/q03 | 두 로그곡선·`y=n`·`OA_nB_n` 삼각형 → LOGARITHMIC curves 2, y=1 line, 3 points·3 segments·수학 라벨, n=1 | COMPLETE |
| 030/q04 | `a^{x-1},5^x` 교점 및 x축 수선 → a=25,k=2 대표의 EXPONENTIAL curves 2, P(2,25), H(2,0), PH segment | COMPLETE |
| 031/q01 | `y=x`, `y=x/4+3`, x=2의 수직/수평 계단 → curves 2, S→U→V→W→X points·4 segments | COMPLETE |
| 031/q02 | `y=x`, `y=√{4x}`, x=9의 계단 → curves 2, S→U→V→W→X points·4 segments | COMPLETE |
| 031/q09 | 포물선 오른쪽 가지 `P_nQ_n` → parabola curve, n=1의 P(1,3), Q(2,14), segment, 수학 라벨 | COMPLETE |
| 031/q12 | 반지름 `√n` 원·직선 AB·반대편 수직 OP → n=4의 circle, `SOURCE_LINE`/`displayLines` AB, P exact point, dashed OP | COMPLETE |
| 031/q14 | `√x` curve·`x=4^n,4^{n+1}`·사다리꼴 → n=1의 curve, 두 수직 `overlays.lines`, P/Q/H/K points, 4 segments | COMPLETE |
| 037/q05 | 두 절편과 원점의 삼각형 → n=1의 직선 `y=6/5−2x/5`, O/A/B points·3 segments | COMPLETE |
| 037/q06 | `y=6/x`의 두 점과 축평행 직사각형 → n=1 curve, P/Q/R/S points·4 segments·P 라벨 | COMPLETE |
| 037/q07 | 동반경 원 2개·`x=2/n` 공통현·중점·위 교점 → n=3의 2 circles, O/C/M/U/L points, chord·centerLine, `l_n` 라벨 | COMPLETE |
| 061/q01 | `√a_n` 변 정사각형·대각선 `l_n` → n=1의 A/B/C/D points·사각형 4 segments·대각선 1·`l_n` 수식 라벨 | COMPLETE |
| 061/q02 | `y=√x`·`x=4^n`·정삼각형 `A_nB_nC_n`·점선 높이 → n=1 curve·vertical line·4 points·4 segments·수학 callouts | COMPLETE |
| 061/q04 | `4^x`와 이동한 `3·4^{x-k}`, `(k,3),(0,a_k)` → k=1의 2 curves, P/Q points 및 `a_k` callout | COMPLETE |
| 061/q05 | 포물선·기울기 `(1/3)^{n-1}` 직선·`A,P_n,H_n` → n=1의 2 curves, A/P/H points·PH segment·수학 라벨 | COMPLETE |
| 063/q03 | 3m 줄·연직선·좌 `θ`/우 `θ/2`·최저점을 지나는 호 → θ=60° 예시의 O/B/L/R·3 segments·angle marks 2·circle minor arc·3m 라벨 | COMPLETE |
| 064/q01 | `(0,0)→(2,0)→(2,1)→(3/2,1)→(3/2,3/4)` → typed exact coordinates 5 points, 4 ordered segments, 길이 4라벨 | COMPLETE |
| 064/q02 | `(1,2)→(4,2)→(4,3)→(11/3,3)→(11/3,26/9)` → 5 exact points, 4 ordered segments, 길이 4라벨 | COMPLETE |
| 064/q03 | `A_0(1,0),A_1(2,2),A_2(11/4,4)`·2 선분 → exact SOURCE_POINT 3·2 segments·`A_1,A_2` pointNames. **아래첨자 0 점 이름 렌더 불가**, `A_0` 좌표는 caption에 유지 | ENGINE_CAPABILITY_PENDING |
| 064/q04 | 30°/150°/30° 방향의 길이 2·2/3·2/9 이동 → 정확한 radical 좌표 O/P1/P2/P3, 3 ordered segments, 길이 3라벨 | COMPLETE |
| 064/q05 | 0°/120°/240° 방향의 길이 3·3/2·3/4 이동 → 정확한 radical 좌표 O/P1/P2/P3, 3 ordered segments, 길이 3라벨 | COMPLETE |

## 제약 및 후속

1. **ENGINE_CAPABILITY_PENDING — 064/q03**: construction `pointNames`는 한 글자 대문자 뒤의 아래첨자 1–9는 허용하지만 `A_0`를 `POINT_DISPLAY_NAME_INVALID`로 거부한다. A₀ 점과 두 선분 자체는 정확히 존재하고 A₁/A₂는 점 이름으로 표시한다. 엔진이 아래첨자 0을 지원할 때 A₀를 `pointNames`에 추가하고 full lint와 SVG 관측기를 재수행한다. 임의의 다른 문자로 둔갑시키지 않는다.
2. 일반 `n,k,θ,a` 도형은 **문항 본문에 명시된 수식**을 기준으로 관계가 정확한 대표값(n=1/2/3/4, k=1/2, θ=60°, a=25)을 선택하여 점·곡선·선을 생성했다. 특정 대표값의 그림을 모든 n에서의 상징식 증명으로 주장하지 않는다. 문항의 정답과 극한점은 도식에 포함하지 않았다.
3. 린트는 SVG 실생성, 글꼴 임베딩·충돌, PNG 육안, 인쇄 품질을 증명하지 않는다. 후속 도형 엔진 작업자는 해당 네 단계를 별도 판정한다.

## 실행 기록

- 원문과 신규 plan의 `sourceQuote` 26개는 각각 해당 `[그림: ...]` 텍스트와 동일하게 보존.
- `sourceConditions[].mappedTo`의 index 대상이 실제 draw field에 존재하는지 점검; source-caption만으로 feature를 완료 판정하지 않음.
- 외부 시험지/교과서 JS, render 산출물, 기존 Geometry plan: 변경하지 않음.
