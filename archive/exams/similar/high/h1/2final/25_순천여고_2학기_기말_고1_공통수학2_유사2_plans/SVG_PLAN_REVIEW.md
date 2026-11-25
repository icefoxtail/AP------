# 25 순천여고 공통수학2 2학기 기말 유사2 — 문제·해설 SVG plan 검수

- 기준 `main`(PR 작성 직전 재확인): `63e3d9e2266a1003c5cabcc7a877aeee3433a860`
- 원문: `archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사2.js`
- 원문 Git blob: `ec9052cd5bff69c9ae86b36618425bee978f94f2`
- 중복 회피: 제일고 1학기 중간 유사 Q01–Q22는 열린 PR #3056에 예약되어 제외.
- 범위: 순천여고 21문항만; 문제 21축 + 해설 21축 = 42축. 시험지 JS·유형은행·교과서·기존 SVG는 불변.
- 판정: REQUIRED 4, BENEFICIAL 12, EXEMPT 26. 실행 대상 16축 = 기존 유효 플랜 11 + 신규 교정 플랜 5.
- 검사: 공식 `ops/claude-batch/plan-lint.cjs`로 기존 레거시 JSON 17파일(중복 q12 포함) shallow/full 17/17 PASS; 신규 5파일 shallow/full 5/5 PASS. **유효 경로별** 16/16 PASS. shallow는 구조, full은 엔진 모델·식·수치·글꼴 준비까지 확인하나 Chrome 레이아웃 검사는 포함하지 않는다.
- `DRAWN_FEATURE_PARITY`: 발문·해설에 등장하는 각 요소의 원문 수치와 JSON의 실제 그려지는 필드(좌표·곡선 계수·선분·집합 원소·그룹 라벨·점근선·교점·경계선·음영)를 별도 확인, 유효 플랜 16/16 PASS. `ENGINE_CAPABILITY_PENDING` 0. **실제 신규 SVG 렌더·PNG 육안·학생 화면·A4**는 NOT_RUN.

경로 약어: `N/` = 같은 폴더(`…_유사2_plans/`), `L/` = `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사2/`. `N/`은 레거시 보완 새 경로가 우선이다. EXEMPT는 plan 파일을 만들지 않았으며 아래 사유는 그림 미제작 핑계가 아니다.

## 42축 판정 장부

| 파일/qid | 축 | 판정 및 개별 사유 | capability | 유효 plan 경로 | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 순천여고/Q01 | 문제 | EXEMPT — 절댓값 조건과 자연수 전체집합이 텍스트로 완결됨 | — | — | — | — |
| 순천여고/Q01 | 해설 | EXEMPT — `1<x<7`과 정수 2,3,4,5,6의 열거·합만 계산 | — | — | — | — |
| 순천여고/Q02 | 문제 | EXEMPT — 네 문장의 진리 판별이며 좌표·도형 조건 없음 | — | — | — | — |
| 순천여고/Q02 | 해설 | EXEMPT — 반례 a=0, x=-1, n=2와 켤레복소수 계산으로 설명 가능 | — | — | — | — |
| 순천여고/Q03 | 문제 | EXEMPT — 대우와 빈칸의 mod 4 대수식 제시 | — | — | — | — |
| 순천여고/Q03 | 해설 | EXEMPT — `(2k+1)^2` 전개를 그림으로 중복할 이득 없음 | — | — | — | — |
| 순천여고/Q04 | 문제 | EXEMPT — 세 실수조건과 보기만으로 판단 가능 | — | — | — | — |
| 순천여고/Q04 | 해설 | BENEFICIAL — P⊂R⊂Q 및 반례 원소 (1,1)을 실제 집합영역에 표시 | `set-diagram-figure-v1` | `N/q04-solution.plan.json` | PASS/PASS | PASS |
| 순천여고/Q05 | 문제 | EXEMPT — 합집합·교집합의 문자식 조건으로 충분 | — | — | — | — |
| 순천여고/Q05 | 해설 | BENEFICIAL — Q⊂P⊂R과 U={1,2,3,4} 반례의 원소 소속 | `set-diagram-figure-v1` | `L/q5-solution.json` | PASS/PASS | PASS |
| 순천여고/Q06 | 문제 | EXEMPT — 양수 조건의 AM–GM 최솟값 문제 | — | — | — | — |
| 순천여고/Q06 | 해설 | EXEMPT — `(x−1)^2`와 `s+k/s` 각각 등호 조건을 수식으로 검증 | — | — | — | — |
| 순천여고/Q07 | 문제 | REQUIRED — 보기 ①~⑤의 그래프 형태·열린 점/닫힌 점이 선택 조건 | `construction-spike-v1` | `L/q7-problem.json` | PASS/PASS | PASS |
| 순천여고/Q07 | 해설 | EXEMPT — 문제 축의 5개 도식을 가로선 판정으로 재설명; 동일 그림 재제작 중복 | — | — | — | — |
| 순천여고/Q08 | 문제 | EXEMPT — `f^{-1}(5)=3`을 `f(3)=5`로 바꾸는 단순 일차식 | — | — | — | — |
| 순천여고/Q08 | 해설 | EXEMPT — `6+a=5` 계산만으로 충분 | — | — | — | — |
| 순천여고/Q09 | 문제 | REQUIRED — 주어진 f, g를 함수 화살표에서 읽어야 함. 기존 3열의 구간별 f/g 이름이 안 그려진 결함 교정 | `set-diagram-figure-v1` | `N/q09-problem.plan.json` | PASS/PASS | PASS |
| 순천여고/Q09 | 해설 | BENEFICIAL — f(2)=1, g(3)=1, g(2)=4 경로를 색으로 강조 | `set-diagram-figure-v1` | `L/q9-solution.json` | PASS/PASS | PASS |
| 순천여고/Q10 | 문제 | EXEMPT — 일차함수의 두 번 합성과 역함수 값 | — | — | — | — |
| 순천여고/Q10 | 해설 | EXEMPT — `(f∘f)(x)=4x+3a` 대입만으로 충분 | — | — | — | — |
| 순천여고/Q11 | 문제 | EXEMPT — 함수식·정의역·공역이 텍스트로 명확 | — | — | — | — |
| 순천여고/Q11 | 해설 | BENEFICIAL — 꼭짓점 (3,9), y=3x+2와 (1,5),(2,8) 교점 | `piecewise-polynomial-spike-v1` | `L/q11-solution.json` | PASS/PASS | PASS |
| 순천여고/Q12 | 문제 | EXEMPT — 주어진 두 대칭축과 한 점으로 대수 복원 가능 | — | — | — | — |
| 순천여고/Q12 | 해설 | BENEFICIAL — 유리곡선, y=x+3, y=−x+1, C(−1,2), P(1,4) | `rational-spike-v1` | `L/q12-solution.plan.json` | PASS/PASS | PASS |
| 순천여고/Q13 | 문제 | EXEMPT — 네 함수의 표준형 계수를 비교하는 문자식 보기 | — | — | — | — |
| 순천여고/Q13 | 해설 | EXEMPT — k=±3 여부 4번 계산으로 완결; 곡선 네 개는 핵심 판별을 오히려 분산 | — | — | — | — |
| 순천여고/Q14 | 문제 | EXEMPT — 지나가는 점과 y=x 대칭 조건으로 식 복원 | — | — | — | — |
| 순천여고/Q14 | 해설 | BENEFICIAL — C(2,2), P(3,5), Q(5,3) 대칭 및 점근선 | `rational-spike-v1` | `L/q14-solution.json` | PASS/PASS | PASS |
| 순천여고/Q15 | 문제 | REQUIRED — 발문이 곡선·직선·삼각형 OPQ의 기존 그림을 직접 참조 | `rational-spike-v1` | `L/q15-problem.json` | PASS/PASS | PASS |
| 순천여고/Q15 | 해설 | BENEFICIAL — y=−x+10, P(1,9), Q(9,1), O(0,0)와 넓이 관계 | `rational-spike-v1` | `L/q15-solution.json` | PASS/PASS | PASS |
| 순천여고/Q16 | 문제 | EXEMPT — 유리함수 합성 방정식·정의역 제외 | — | — | — | — |
| 순천여고/Q16 | 해설 | EXEMPT — f(f(x))=x 증명과 x=2 배제에 그래프 불필요 | — | — | — | — |
| 순천여고/Q17 | 문제 | EXEMPT — 두 함수식과 교점 개수 조건이 명료 | — | — | — | — |
| 순천여고/Q17 | 해설 | BENEFICIAL — k=4의 끝점·다른 교점 및 k=17/4의 접점 경계 | `multi-curve-figure-v1` | `N/q17-solution.plan.json` | PASS/PASS | PASS |
| 순천여고/Q18 | 문제 | REQUIRED — 꺾은선 그림 자체가 함수 f를 정의 | `piecewise-polynomial-spike-v1` | `L/q18-problem.json` | PASS/PASS | PASS |
| 순천여고/Q18 | 해설 | BENEFICIAL — y=1−u/2 교점과 y=2/3,4/3의 역추적 | `multi-curve-figure-v1` | `L/q18-solution.json` | PASS/PASS | PASS |
| 순천여고/Q19 | 문제 | EXEMPT — 조각별 식이 전부 제시된 역함수 문제 | — | — | — | — |
| 순천여고/Q19 | 해설 | BENEFICIAL — x=1→f(1)=2→f(2)=3를 y=x 계단으로 확인 | `multi-curve-figure-v1` | `L/q19-solution.json` | PASS/PASS | PASS |
| 순천여고/Q20 | 문제 | EXEMPT — 미지 a,b,c의 일반조건을 특정 수치 그래프로 고정하면 답 노출 우려 | — | — | — | — |
| 순천여고/Q20 | 해설 | BENEFICIAL — 열거된 해 중 예 (1,3,2)의 사분면·시작점·절편 확인 | `multi-curve-figure-v1` | `N/q20-solution.plan.json` | PASS/PASS | PASS |
| 순천여고/Q21 | 문제 | EXEMPT — 정의역과 함수식·역함수 방정식만 제시 | — | — | — | — |
| 순천여고/Q21 | 해설 | BENEFICIAL — 역함수 시작점 (1,2)와 직선 y=4−x의 단일 교점 | `multi-curve-figure-v1` | `N/q21-solution.plan.json` | PASS/PASS | PASS |

## 원문 → 실제 그려지는 필드 1:1 대조

| qid·축 | 독립 수치·명칭 확인 | 실제 plan 필드·오류 방지 | PARITY |
|---|---|---|---|
| 04 해설 | P={(0,0)}, R:x+y=0, Q:x=−y 또는 x=y; (1,1)∈Q\R | `diagram.subset=[P,R,Q]`; `elements`에 `(0,0)`→[P,R,Q], `(1,1)`→[Q]를 **수학 라벨**로 표시 | PASS |
| 05 해설 | Q⊂P⊂R, 예 Q={1},P={1,2},R={1,2,3},U={1,2,3,4} | `diagram.subset=[Q,P,R]`; `elements`의 in 소속 1→[Q,P,R], 2→[P,R], 3→[R], 4→[] | PASS |
| 07 문제 | 보기 ① V꼴, ② U꼴은 비일대일; ③ 증가·전사; ④ 증가하나 치역 결손; ⑤ 수평 구간 | `planeMarks.textLabels` ①~⑤ 5개, 실제 선분 그래프군 및 ④의 열린·닫힌 끝점, ⑤의 수평선. 기존 SVG q7.svg도 육안 참조 | PASS |
| 09 문제 | f=(1→3,2→1,3→4,4→2), g=(1→2,2→4,3→1,4→3) | 3열 `columns` X/X/X, `arrows` 8개 정확, `arrowGroups` f X→Y 및 g Y→Z 추가. 결과값 3·2·5의 강조는 없음 | PASS |
| 09 해설 | f(2)=1, g(3)=1, g(2)=4, 역함수 결과 3+2=5 | `arrows` 8개, `arrowGroups` f/g, `highlightPaths` 2→1, 3→1, 2→4 | PASS |
| 11 해설 | f=−x²+6x, V=(3,9); 3a+2=f(a) ⇒ a=1,2 | `graphPlan.pieces=[0,6,-1]`, `requiredPoints V=(3,9)`, `overlays.lines y=3x+2`, `points curveX=1,2` | PASS |
| 12 해설 | 대칭축 y=x+3, y=−x+1 교점 C=(−1,2), P=(1,4), 그래프 y=(2x+6)/(x+1) | `numerator=[6,2]`, `denominator=[1,1]`, 두 overlay 직선, `points C` 계산 교점·`P curveX=1`, `equalUnits:true` | PASS |
| 14 해설 | y=(2x−1)/(x−2), C=(2,2), P=(3,5), Q=(5,3), 대칭축 y=x | `numerator=[-1,2]`, `denominator=[-2,1]`, `overlays.lines slope1`, P/Q curveX 및 `segments PQ`; `equalUnits:true` | PASS |
| 15 문제 | y=9/x, y=−x+m, O(0,0), 교점 P,Q, 삼각형 OPQ 면적 40 | 반비례 분자 [9,0], 직선 기울기 −1·표시 라벨 `m`(숫자 10 비노출), 점 P/Q/O와 `polygons OPQ` 존재. 면 채움 LIGHT는 **넓이를 묻는 예외**; 눈금과 정답 좌표는 문제 그림에 없음 | PASS |
| 15 해설 | m=10, 두 근 1·9 ⇒ P(1,9),Q(9,1), 삼각형 넓이 40 | `overlays.lines` y=−x+10, 점 `curveX=1,9`에 좌표 표기, OPQ 다각형 | PASS |
| 17 해설 | k=4 ⇒ (4,0),(3,1) 두 교점; k=17/4 ⇒ (15/4,1/2) 접점(기울기 −1) | SQRT radicand [4,−1], LINE 상수 4 및 17/4, 점 E/B/T와 **좌표 라벨**·T callout | PASS |
| 18 문제 | f(0)=2, f(1)=0, f(2)=1; [0,1]은 −2x+2, [1,2]는 x−1 | `pieces` [2,−2],[-1,1], breakpoint (1,0), 양 끝 CLOSED, `requiredPoints`와 `exactCoordinates` | PASS |
| 18 해설 | u=2/3,4/3; x=1/3,2/3,5/3 | LINE f 두 구간, LINE [1,−1/2], 수평 LINE y=2/3·4/3, `overlays.points U1/U2/X1/X3` | PASS |
| 19 해설 | f(x)=−(x−2)²+3 (x<2), +(x−2)²+3 (x≥2); 1→2→3 | `curves f1=[−1,4,−1],f2=[7,−4,1]`, 점 (1,1),(1,2),(2,2),(2,3), `segments` 계단, 대각선 y=x | PASS |
| 20 해설 | 예 (a,b,c)=(1,3,2): 시작 (−3,2), y절편 (0,2−√3)>0, x절편 (1,0) | SQRT `radicand=[3,1], amplitude=−1,offset=2`, 점 S/Y/X, 표시 선 x=−3·y=2, 좌표 라벨 S/X와 Y callout. 예시임을 밝힘 | PASS |
| 21 해설 | 역함수 2−√(x−1), 시작 (1,2), 방정식 유일해 x=(5+√5)/2, y=(3−√5)/2 | SQRT radicand [−1,1], 직선 [4,−1], `points S=(1,2), P=((5+√5)/2,(3−√5)/2)` 좌표 표기 | PASS |

## 교정과 인계

1. **Q04 해설:** 종전 벤다이어그램은 집합 포함만 그렸고 `(1,1)` 반례 위치를 캡션에만 기록했다. 새 plan은 `(0,0)`과 `(1,1)`을 실제 `diagram.elements`에 넣는다.
2. **Q09 문제:** 기존 대응도는 두 구간의 8개 화살표가 맞지만 학생 눈에 f/g 구별 표지가 없었다. 새 plan은 `arrowGroups` 이름·색을 지정하며 정답 계산 경로는 문제에 드러내지 않는다.
3. **Q17 해설:** 기존 plan은 끝점 `(4,0)`을 캡션에만 썼다. 새 plan은 E 좌표 점을 렌더 필드에 둔다.
4. **Q20 해설:** 기존 예시의 시작점 `(−3,2)`이 소스 수치에는 있지만 점 라벨로 없었다. 새 plan은 S를 직접 표시한다.
5. **Q21 해설:** 기존 역함수 시작점 `(1,2)`은 곡선 끝점에서만 유추됐다. 새 plan은 S 좌표 라벨을 둔다.
6. 각 새 plan의 수학 좌표·선분·집합 원소·대응을 JS 해설에서 독립 계산하였고, 기존 유효 11건도 계수·점·구간을 대조했다. `plan-lint PASS`를 PARITY로 치환하지 않았다.
7. 렌더 담당: 새 N/ plan 5건으로 공식 엔진 SVG/PNG 생성 → 실제 화면의 라벨 간섭·잘림·학생 390px·A4 확인 → 해당 축에 한해서 기존 SVG 연결 교체. **이 PR에서 새 SVG나 JS 참조를 수정하지 않음.**
