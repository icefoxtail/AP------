# 2025 효천고 고1 2학기 중간 유사문제 — 문제·해설 SVG plan 검토

- 대상 JS: `archive/exams/similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제.js`
- 원본 JS SHA-256: `6d6fcc049ebfea1189193c777560c62e486687e31c8e8c9810723bfa527ed3dc`
- 시작 `main`: `d2ba4c681437104e424b21978535b1715d89e0e5`
- 범위: `q01–q23` **23문항 × 문제/해설 2축 = 46개 판정**. 고2 제일고 유사문제 25문항은 다음 배치이고, 유형은행·교과서·기출은 변경하지 않는다.
- 작성 경로: 유사시험지의 정확한 stem 뒤에 `_plans/`를 붙인다. 본 폴더의 `*.plan.json`만 실제 렌더 가능한 제작 plan이다. 기존 PNG는 다시 만들지 않고 현행 JS의 참조를 그대로 유지한다.
- 검사 상태: `plan-lint.cjs --shallow` **10/10 PASS**, `plan-lint.cjs` full **10/10 PASS**. SVG 렌더·PNG 실물·학생화면·A4: **NOT_RUN**(후속 렌더 담당). `DRAWN_FEATURE_PARITY=PASS`는 **원문과 plan의 그려지는 필드 사이의 정적 1:1 대조**이지 렌더 PNG 육안 PASS를 뜻하지 않는다.
- 시각 원칙: 문제용 정답 좌표·계산 결과 비노출. 제작 plan 10개 모두 해설 축 전용. 불필요한 면 채움·집합 shade·그래프 regions 없음. 기존 문제 PNG 4개는 실물을 열어 확인했다.

## 문항별 2축 판정 장부

`P`=문제, `S`=해설. `PASS_ASSET`=기존 원본 PNG의 표시 요소를 실물 대조, `PASS_FIELD`=원문·해설 관계를 실제 작도·그래프·라벨·표식 필드에서 대조, `N/A`=EXEMPT. `NOT_APPLICABLE`은 제작 plan이 없는 축의 plan-lint 상태이며 PASS를 뜻하지 않는다.

| qid | 문제 축 판정·사유·자산 | 해설 축 판정·사유·plan | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|
| 01 | EXEMPT — 두 점과 거리만 발문에 명시 | EXEMPT — 좌표 차 6,8의 피타고라스 계산으로 충분 | N/A | N/A |
| 02 | EXEMPT — 두 직선의 기울기 식만 필요 | EXEMPT — 기울기 곱 -1로 k=6 계산 | N/A | N/A |
| 03 | EXEMPT — 원 방정식만 제공 | EXEMPT — 완전제곱으로 중심(2,-4), 반지름4 산출 | N/A | N/A |
| 04 | EXEMPT — 미지의 두 접선 절편을 문제에서 표시하면 풀이 노출 위험 | BENEFICIAL — 두 접선·접점 수선·y축 절편 비교. `q04-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 05 | EXEMPT — 집합 원소를 발문이 직접 열거 | EXEMPT — 원소 일치의 대입 계산이며 위치·영역 없음 | N/A | N/A |
| 06 | EXEMPT — 매개변수 k의 범위만 묻는 식 | EXEMPT — k(k-3)>0 부호 판정으로 충분 | N/A | N/A |
| 07 | EXEMPT — 두 평행선의 방정식과 거리만 주어짐 | EXEMPT — 법선 길이5, |k+2|=10의 두 값 산술 계산 | N/A | N/A |
| 08 | REQUIRED — 점 P, 직선 l, 수선의 발 H와 직각이 원본 `q08.png`에 제시됨(기존 자산 유지) | EXEMPT — 이미 문제 그림이 수직·수선 관계를 보여 주며 해설은 매개변수 t의 대수 유도 | NOT_APPLICABLE | PASS_ASSET(P), N/A(S) |
| 09 | EXEMPT — 집합의 중괄호 계층·소속 기호만 판독 | EXEMPT — ∈와 ⊂의 논리 비교, 위치 정보 없음 | N/A | N/A |
| 10 | EXEMPT — A∪B=A가 텍스트로 완전 | BENEFICIAL — B⊂A를 겹침 없는 포함 벤다이어그램으로 설명. `q10-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 11 | EXEMPT — 매개변수 a 미확정이므로 특정 원을 문제 그림에 확정하지 않음 | BENEFICIAL — 접하는 경계 중심 두 개와 원·수선·직각. `q11-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 12 | EXEMPT — 세 이동 전후의 그래프는 해설에서 결정 | BENEFICIAL — 원래·x축 대칭·위로3 이동 포물선 3패널. `q12-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 13 | REQUIRED — f,g 삼각형과 축 눈금·대응 방향이 `q13.png`에 제시됨(기존 자산 유지) | EXEMPT — 원본 한 장에 두 도형과 대응점이 모두 있고 x=u-6,y=3-v 변수 역치환만 수행 | NOT_APPLICABLE | PASS_ASSET(P), N/A(S) |
| 14 | REQUIRED — 원본 `q14.png`에 A(1,4),B(-2,0),C(7,-4)와 삼각형 있음 | BENEFICIAL — D=BC 내분점과 AD, BD:DC=1:2 표시. `q14-solution.plan.json` | PASS/PASS(S) | PASS_ASSET(P), PASS_FIELD(S) |
| 15 | EXEMPT — 전체30, 집합 크기18·21을 수치로 줌 | EXEMPT — 포함배제에 의한 상한18·하한9의 범위 계산 | N/A | N/A |
| 16 | EXEMPT — A,B,C의 모든 원소가 나열됨 | EXEMPT — 차집합 원소 {1,4,9}만 필터 | N/A | N/A |
| 17 | EXEMPT — 모든 기울기 k에 대한 직선군을 하나의 고정 그림으로 표현하면 왜곡 위험 | EXEMPT — 평행이동 후 공통점(-3,7)을 식으로 즉시 읽어 원 중심과 동일시함 | N/A | N/A |
| 18 | REQUIRED — 직사각형 OABC, P(-2,3), 두 축·눈금이 `q18.png`에 제시됨 | BENEFICIAL — 4개 대칭점·수직이등분선·Q·R₁~R₄·8개 반사각 호. `q18-solution.plan.json` | PASS/PASS(S) | PASS_ASSET(P), PASS_FIELD(S) |
| 19 | EXEMPT — A 위치가 미정이고 AB,AC의 길이만 제공 | BENEFICIAL — A=(4,3) 대표 예에서 x축·y축·원점 대칭 및 대각선. `q19-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 20 | EXEMPT — 포함배제의 네 개수만 필요 | EXEMPT — n(A∩B)=54+83-(120-13) 대입 | N/A | N/A |
| 21 | EXEMPT — A,B 좌표와 거리 비만 주어지고 C는 미정 | BENEFICIAL — C₁ 내분·C₂ 외분을 별도 DIVISION_POINT로 실제 작도. `q21-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 22 | EXEMPT — 두 원의 반지름과 중심이 미정인 방정식 조건 | BENEFICIAL — 두 근호 반지름 원의 양축 접촉과 중심 간 선분. `q22-solution.plan.json` | PASS/PASS | PASS_FIELD |
| 23 | EXEMPT — a,b를 아직 몰라 임의 V 그래프를 발문 그림으로 고정할 수 없음 | BENEFICIAL — 유효 예 (1,-1)의 V자 두 가지·중심(3,1)·반지름2 원의 교차 관계. `q23-solution.plan.json` | PASS/PASS | PASS_FIELD |

**축 검산:** 문제 P = REQUIRED 4, BENEFICIAL 0, EXEMPT 19 → **23**. 해설 S = REQUIRED 0, BENEFICIAL **10**, EXEMPT 13 → **23**. 실제 제작 JSON **10개**, 기존 문제 PNG **4개**, 정적 plan 필드 패리티 **10/10 PASS**, 기존 PNG 필드·실물 확인 **4/4 PASS**, `ENGINE_CAPABILITY_PENDING` **0**. 계획되지 않은 나머지 축은 명시적인 불필요 사유가 있는 EXEMPT이다.

## DRAWN_FEATURE_PARITY: 소스 ↔ 실제 그려지는 JSON 필드

| qid/축 | 독립 계산과 원문 조건 | 그려지는 필드(캡션·설명 문구만으로 대체하지 않음) | 판정 |
|---|---|---|---|
| 04/S | 원 K(1,-2), r=3, 접선 x+y+1∓3√2=0, 절편 차6√2 | `nodes[K,circle,t1,t2,A,B,T1,T2]`, `displayCircles[circle]`, `displayLines[t1,t2]`, `displaySegments[sAB,sKT1,sKT2]`, `rightAngles[r1,r2]`, `lineColors` | PASS |
| 08/P | 원본 점 P(x₁,y₁), 직선 l, 수선의 발 H(x₂,y₂), PH⊥l, 두 축·절편 | 기존 `archive/assets/images/25_효천고_2학기_중간_고1_유사문제/q08.png`의 실선 PH, l, 직각 모서리·축·라벨 직접 확인 | PASS_ASSET |
| 10/S | A∪B=A⇔B⊂A, A∩B=B | `diagram.sets[A,B]`, `diagram.subset:[B,A]`; 불필요한 면색 없음 | PASS |
| 11/S | a∈[4/3,8/3], 중심(4/3,8/3),(8/3,16/3), r=√2 | `nodes[C1,C2,l,k1,k2,H1,H2]`, `displayCircles`, `displayLines`, `displaySegments[sC1H1,sC2H2]`, `rightAngles[r1,r2]` | PASS |
| 12/S | 꼭짓점 (4,3)→(4,-3)→(4,0), 마지막 x축 접촉 | `panels[0..2].graphPlan.coefficients`가 각각 `[19,-8,1]`, `[-19,8,-1]`, `[-16,8,-1]`; `requiredPoints[V,V,T]` | PASS |
| 13/P | f 삼각형 (1,2),(4,2),(4,6) → g (-5,1),(-2,1),(-2,-3), x-6, 3-y 변환 | 기존 `archive/assets/images/25_효천고_2학기_중간_고1_유사문제/q13.png`에서 6꼭짓점·6선분·4개 x눈금·4개 y눈금·f/g 라벨 확인 | PASS_ASSET |
| 14/P | A(1,4), B(-2,0), C(7,-4) | 기존 `archive/assets/images/25_효천고_2학기_중간_고1_유사문제/q14.png`의 세 좌표·삼각형 3변·두 축 확인 | PASS_ASSET |
| 14/S | AB=5, AC=10; ∠BAD=∠DAC, BD:DC=1:2 → D=(1,-4/3) | `nodes[A,B,C,D]`, `DIVISION_POINT(B,C,1:2)`, `displaySegments[sAB,sAC,sBD,sDC,sAD]`, `coordinateLabels`, `expressionLabels[ratioBD,ratioDC]`, `planeMarks.angles[aBAD,aDAC]`, `equalAngles` | PASS |
| 18/P | O(0,0),A(0,11),B(-14,11),C(-14,0),P(-2,3) | 기존 `archive/assets/images/25_효천고_2학기_중간_고1_유사문제/q18.png`의 네 변·5라벨·-14,-2,3,11 눈금·점선 좌표보조선 확인 | PASS_ASSET |
| 18/S | P_i: (2,3),(-2,19),(-26,3),(-2,-3); Q=(-12,8); R_i 네 변 내부; 입사·반사각 70.3462°,47.7263° 대응 | `LINE_REFLECTION`×4, `MIDPOINT`×2, `PERPENDICULAR_THROUGH`×2, `LINE_INTERSECTION`×5, `displaySegments` 16개(원본 사각형·반사 경로·점선), `planeMarks.angles` 8개 및 `equalAngles` 색 모둠 2개 | PASS |
| 19/S | A=(4,3) 대표 예; B=(4,-3), C=(-4,3), D=(-4,-3), AB=6 AC=8 AD=10 | `POINT_REFLECTION`×3, `displaySegments[sAB,sAC,sBD,sCD,sAD]`, `coordinateLabels[A,B,C,D]`, `expressionLabels[lenAB,lenAC]`, `rightAngles[aBAC]` | PASS |
| 21/S | A(-5,2),B(5,7), AC:CB=3:2, C₁(1,5), C₂(25,17) | `DIVISION_POINT` 2개 모드 INTERNAL/EXTERNAL, `displaySegments[sAC1,sC1B,sBC2,sAC2]`, `pointNames[C1,C2]`, `coordinateLabels`, `expressionLabels[ratioAC1,ratioC1B]` | PASS |
| 22/S | r=7±2√6; 중심(-r,r), P(-3,4); 거리8√3 | `TRANSLATE_POINT`×2의 근호 좌표, `CIRCLE_CENTER_RADIUS`×2의 근호 반지름, `displayCircles`, `displaySegments[sCenters,sC1P,sC2P]` | PASS |
| 23/S | 원 K(3,1), r=2; 유효 예 V(1,-1); 가지 기울기 -1,+1; |KV|=2√2>2 | `nodes[K,circle,V,L,R]`, `displayCircles[circle]`, `displaySegments[sLV,sVR]`, `coordinateLabels[K,V]` (L,R 이름/점표식 숨김; 선분은 보임) | PASS |

### 검수 한계·후속

1. `PASS_FIELD`는 좌표·노드 종속성·선분 refs·라벨 소유자·각 호·직각 표식이 JSON에 실제 들어 있다는 정적 검토다. **SVG/PNG 미렌더**로 인해 화면상 겹침·잘림·가독성은 **NOT_RUN**이며 이 문서는 실물 렌더 PASS 영수증이 아니다.
2. 19번은 A의 4개 대칭부호 중 한 가지를 선택한 **예시**, 23번도 정수해 여덟 가지 중 `(1,-1)`의 **예시**이므로 모든 가능한 도형을 그렸다고 주장하지 않는다.
3. 18번은 원본 문제 이미지에 없던 반사점 R_i와 각 호를 해설 plan에서 추가하며, Q는 두 수직이등분선의 교점 노드로 계산한다. 문제 축 PNG에 해답을 누설하지 않는다.
4. 후속 렌더 담당은 10개의 제작용 plan을 공식 엔진으로 렌더하고 PNG/학생화면/A4를 실제 확인한 뒤 JS의 `solutionImage` 연계를 수행한다. 현재 JS는 수정하지 않았다.
