# 중3 2학기 중간 유사 — 2020 신흥중·연향중 문제·해설 SVG plan 감사

2026-11-28. 기준 원격 main b7b089ccbb750fd6fecb2b3c2c2686b32693a694. 원문 JS 2개는 수정하지 않았다.

## 범위와 판정

- 2021 팔마중·향림중 PR #3450 병합 SHA 0f31bb906610962a8e737c6ccc86784e333efd76 확인. 팔마중 13번 2축 BLOCKED 유지. 이전 #3447, #3442, #3441, #3436 중복 없음.
- Windows 큐 plan-exam-queue.md는 현 Linux 실행기에서 접근 불가. 사용자 후속 지시에 따라 현재 두 시험지는 직접 선정, 큐 체크 추정·변경 없음. 기출·고등학교·다른 중등 JS 불변. 열린 PR의 본 두 production plan 경로 충돌 없음.
- REQUIRED=문제 조건의 구조를 이해하기 위한 필수 그림, BENEFICIAL=풀이 관계에 교육적으로 유익한 그림, EXEMPT=해당 축에 시각자료가 불필요한 개별 근거, BLOCKED=원문 수학/조건 오류로 참인 그림 불가. EXEMPT와 BLOCKED 축에는 제작 JSON 없음.
- 모든 READY 행은 공식 archive/tools/geometry-equation/production/plans/<stem>/qNN-(problem|solution).plan.json 경로의 실행형 JSON. 원본 그림·이미지 수리는 범위 밖이며 PNG/SVG 신규 생성 없음.

## 신흥중 (24문항·48축)

| 문항 | 문제 판정·사유 | 해설 판정·사유 |
|---|---|---|
| 01 | EXEMPT — 이차함수 판별은 각 보기를 표준식으로 정리하는 문제이며 그래프를 주면 분류 답을 암시한다. | EXEMPT — 보기 ③의 x²항 상쇄와 나머지 계수 비교만으로 완결되는 대수 풀이이다. |
| 02 | REQUIRED/READY — y=x²와 y=−x²/3 사이 x≠0의 위아래 경계를 두 영역으로 나눠 색칠함 | BENEFICIAL/READY — 두 경계 포물선 사이에 답의 −x²/5가 놓이는 계수 순서를 확인함 |
| 03 | EXEMPT — 다섯 문장은 축·대칭·증가 감소를 묻는 진위 판별이므로 완성 그림은 답(축 x=0)을 미리 노출한다. | BENEFICIAL/READY — y=−x²의 꼭짓점·축 x=0·x축 대칭 및 증가 감소를 한 그림에서 확인 |
| 04 | EXEMPT — 계수 a와 q의 부호 자체를 묻는 문항으로 특정 그래프의 방향과 절편을 미리 그리면 답이 노출된다. | BENEFICIAL/READY — a>0, q<0의 대표 예시 y=x²−2; 실제 미정계수의 확정값이 아님 |
| 05 | EXEMPT — 두 좌표를 대입하여 a,b를 구하는 계산 문제라 완성 곡선과 b 위치는 답을 선공개한다. | BENEFICIAL/READY — 해답 계수 a=−2의 포물선에 P(3,−18), Q(−2,−8)가 함께 놓이는지 확인 |
| 06 | EXEMPT — 보기 다섯 식의 평행이동축 비교이므로 그래프 자체는 축 −2를 답으로 지목하게 한다. | BENEFICIAL/READY — ①의 축 x=−2와 나머지 대표 ②의 축 x=0 차이를 비교 |
| 07 | EXEMPT — 평행이동량 k가 미지수여서 목표 꼭짓점 둘을 먼저 그리면 k=7이 노출된다. | BENEFICIAL/READY — 같은 대칭축의 꼭짓점 높이가 −5와 2이므로 7만큼 위로 이동함 |
| 08 | EXEMPT — 어느 변환식이 정답인지 고르는 문제로 최종 그래프는 (4,−3)을 즉시 드러낸다. | BENEFICIAL/READY — 꼭짓점이 (0,0)에서 (4,−3)으로 이동하는 두 포물선 |
| 09 | EXEMPT — 다섯 속성 가운데 폭 비교 진위 판별이므로 두 완성 곡선을 먼저 보여 주지 않는다. | BENEFICIAL/READY — 서로 다른 절댓값의 이차항 계수 1과 3이 만드는 다른 폭 |
| 10 | EXEMPT — 증가 구간 자체를 선택하므로 꼭짓점 x=2와 구간 강조는 문제 그림에서 답을 노출한다. | BENEFICIAL/READY — 꼭짓점 (2,7)의 왼쪽에서 증가, 오른쪽에서 감소하는 y=−4(x−2)²+7 |
| 11 | EXEMPT — 미정계수의 부호를 판별하는 문제로 특정 예시를 문제 조건인 것처럼 제시하면 오도한다. | BENEFICIAL/READY — a=−1,p=2,q=−5의 예시이며 제2사분면의 꼭짓점(−2,5)을 갖는 위로 볼록한 곡선 |
| 12 | EXEMPT — 꼭짓점과 절편으로 미지 a,b,c를 계산하는 문항이어서 함숫값을 먼저 완성해 주지 않는다. | BENEFICIAL/READY — 계산된 y=−2x²−4x+3의 꼭짓점과 y절편 위치 |
| 13 | EXEMPT — 이동한 식의 함숫값 m을 구하는 문제에서 점 (4,3)을 먼저 그리면 답을 노출한다. | BENEFICIAL/READY — 오른쪽 4 이동 후 (4,3)을 지나는 새 포물선 |
| 14 | EXEMPT — 세 절편으로 최댓값을 구해야 하므로 꼭짓점의 높이 9를 문제 그림에서 선공개하지 않는다. | BENEFICIAL/READY — x절편 −2,4와 y절편 8의 대칭축 중간 x=1 및 최댓값 9 |
| 15 | EXEMPT — x=−3으로 주어진 꼭짓점 조건에서 계수 a를 구하는 식 대입 문제이다. | BENEFICIAL/READY — a=−2로 결정된 y=−2x²−12x−1의 꼭짓점 x=−3 |
| 16 | REQUIRED/READY — 포물선의 두 x절편 A,B와 y절편 C로 이루어진 삼각형의 위치 | BENEFICIAL/READY — AB=6이고 C에서 x축까지의 높이는 5인 삼각형 넓이 관계 |
| 17 | REQUIRED/READY — C 직각, AC=2√3, BC=2인 삼각형에서 A·B의 삼각비 대응 | BENEFICIAL/READY — 피타고라스에서 구한 빗변 AB=4를 더해 삼각비를 확인 |
| 18 | REQUIRED/READY — B 직각, AC=4·AB=2, D는 BC 중점, ∠BAD의 위치 | BENEFICIAL/READY — BC=2√3, BD=√3, AD=√7인 직각삼각형 ABD에서 cosx=AB/AD |
| 19 | EXEMPT — tanA=8/15와 예각이라는 수치만 주어져 비를 계산할 수 있으며 완성 삼각형은 원문 조건 이상의 형태를 지정한다. | BENEFICIAL/READY — 8·15·17 직각삼각형에서 cosA−sinA=(15−8)/17 |
| 20 | BLOCKED — SOURCE_GEOMETRY_UNDERDETERMINED: ∠AOB=x만 지정하고 접선 CD가 만드는 ∠COD=x 또는 OA∥OC·OB∥OD 관계가 없어 tanx=CD를 결론 낼 수 없다. | BLOCKED — SOURCE_GEOMETRY_UNDERDETERMINED: ∠AOB=x만 지정하고 접선 CD가 만드는 ∠COD=x 또는 OA∥OC·OB∥OD 관계가 없어 tanx=CD를 결론 낼 수 없다. |
| 21 | REQUIRED/READY — B 직각, 빗변 AC=10, sinA=2/5 조건의 직각삼각형 | BENEFICIAL/READY — BC=4·AB=2√21로 삼각비 sin,cos,tan을 대응 |
| 22 | EXEMPT — 꼭짓점·대칭식·증가 감소를 직접 구하도록 하는 다섯 소문항에서 완성 그래프는 풀이를 선공개한다. | BENEFICIAL/READY — y=−2(x+3)²−4 꼭짓점(−3,−4)와 대칭축 x=−3 |
| 23 | EXEMPT — 두 이차함수 최솟값·최댓값을 계산해 차를 구하는 문항으로 그래프의 극값 라벨을 미리 보일 필요가 없다. | BENEFICIAL/READY — 서로 다른 두 포물선의 최솟값 −3과 최댓값 7을 비교 |
| 24 | EXEMPT — 폭·최댓값 조건에서 식의 계수를 유도해야 하므로 완성한 포물선을 문제에 제시하면 답을 직접 보여 준다. | BENEFICIAL/READY — 꼭짓점 (2,3), 아래로 열린 포물선 y=−x²/4+x+2의 계수 확인 |

## 연향중 (21문항·42축)

| 문항 | 문제 판정·사유 | 해설 판정·사유 |
|---|---|---|
| 01 | REQUIRED/READY — C가 직각이고 tanA=√5인 삼각형에서 맞은편과 인접변 위치 | BENEFICIAL/READY — AC:BC=1:√5, AB=√6를 이용하여 sinA=cosB |
| 02 | REQUIRED/READY — C의 직각, AB 위의 D와 CD 수선, BD16·CD12·BC20의 위치 | BENEFICIAL/READY — 닮음과 피타고라스에서 AB25·AD9·AC15를 얻는 두 직각삼각형 |
| 03 | REQUIRED/READY — AB6, ∠B30°, ∠C60°인 삼각형의 변 대각 대응 | BENEFICIAL/READY — A 직각인 30°·60°·90° 삼각형에서 AC=2√3 |
| 04 | EXEMPT — 주어진 51°·52°·53° 삼각비 표에서 수치가 일치하는 열·행을 읽는 문항으로 별도 공간 그림은 필요 없다. | EXEMPT — sin52°=0.7880, cos53°=0.6018을 표에서 찾은 후 52+53만 계산한다. |
| 05 | BLOCKED — SOURCE_GEOMETRY_CONFLICT: 기존 그림 정의는 A를 중심으로 하는 사분원의 반지름 AC=AD=1(∠CAD=90°)인데, 풀이가 명시하지 않은 BC∥DE를 가정하면 AB⊥BC·AD⊥DE에서 AB∥AD가 되어 ∠BAC=90°도 성립한다. ∠ABC=90°인 비퇴화 삼각형과 양립할 수 없다; BC∥DE는 발문에 없음. | BLOCKED — SOURCE_GEOMETRY_CONFLICT: 기존 그림 정의는 A를 중심으로 하는 사분원의 반지름 AC=AD=1(∠CAD=90°)인데, 풀이가 명시하지 않은 BC∥DE를 가정하면 AB⊥BC·AD⊥DE에서 AB∥AD가 되어 ∠BAC=90°도 성립한다. ∠ABC=90°인 비퇴화 삼각형과 양립할 수 없다; BC∥DE는 발문에 없음. |
| 06 | REQUIRED/READY — C 직각, D가 BC 위, E가 AC 위이며 CDE30°·DBE15°·CE3 | BENEFICIAL/READY — DE=BD=6, DC=3√3에서 tan15°=3/(6+3√3) |
| 07 | REQUIRED/READY — 반지름 1의 사분원에 36°인 반지름·수선의 발을 그려 높이와 밑변의 의미를 확인 | BENEFICIAL/READY — 높이 PH≈sin36°≈0.59, 밑변 OH≈cos36°≈0.81인 단위원 |
| 08 | REQUIRED/READY — 지면과 52°를 이루는 길이 15m 사다리의 높이 AC | BENEFICIAL/READY — 빗변15에 대한 수선 높이 AC=15sin52°≈11.82m |
| 09 | REQUIRED/READY — C 직각, AC 위 D와 AD=DC=BC=2, ∠ABD의 위치 | BENEFICIAL/READY — △ABD의 넓이 AD×BC/2=2와 AB·BD·sin∠ABD/2의 등식 |
| 10 | BLOCKED — SOURCE_CONDITION_CONFLICT: 공유 대각선 BD²는 △ABD에서 11+16−2·√11·4·cos150° = 27+4√33 ≈49.978, △BCD에서 8²+5²−2·8·5·cos60° =49. 하나의 사각형에서 같은 BD가 두 길이를 가질 수 없음. | BLOCKED — SOURCE_CONDITION_CONFLICT: 공유 대각선 BD²는 △ABD에서 11+16−2·√11·4·cos150° = 27+4√33 ≈49.978, △BCD에서 8²+5²−2·8·5·cos60° =49. 하나의 사각형에서 같은 BD가 두 길이를 가질 수 없음. |
| 11 | REQUIRED/READY — ∠BAD120°인 마름모의 넓이 12√3 조건과 평행사변형 구조 | BENEFICIAL/READY — 마름모 한 변 s와 120° 사인 넓이 s²sin120°=12√3 |
| 12 | REQUIRED/READY — 연못 A·C 사이 미지 거리와 AB6·BC10·∠B60°의 삼각형 | BENEFICIAL/READY — A에서 BC로 내린 높이 AD=3√3, DC=7로 AC=2√19 |
| 13 | REQUIRED/READY — P에서 원 O로 그은 두 접선의 접점 A,B와 반지름5·접선12 | BENEFICIAL/READY — 접선에 수직인 반지름에서 5²+12²=13², 두 직각삼각형 RHS 합동 |
| 14 | REQUIRED/READY — 지름 AB의 양끝 접선 AD·BC와 반원 위 T의 접선 DC가 만든 구조 | BENEFICIAL/READY — 한 점 접선 길이 DT=DA=9, CT=CB=4 및 직각삼각형 DHC에서 AB=12 |
| 15 | REQUIRED/READY — 원 O에서 반지름 OC와 수직인 현 AB, BM8·CM4 | BENEFICIAL/READY — 직각삼각형 OMB의 r²=(r−4)²+8²에서 r=10 |
| 16 | REQUIRED/READY — 원 O의 P에서 그은 두 접선과 중심각·외부각의 관계 | BENEFICIAL/READY — 접점의 두 직각과 ∠P70°로 ∠AOB110°, 이등변삼각형 ∠OAB35° |
| 17 | EXEMPT — 원·현·접선의 다섯 명제 중 논리적으로 틀린 진술을 찾는 문항으로 반례 그림을 미리 제시하면 ⑤가 드러난다. | BENEFICIAL/READY — 반지름5와3인 서로 다른 원에 길이4의 현이 있어도 중심 거리는 √21과 √5로 다름 |
| 18 | REQUIRED/READY — A에서 뻗은 두 접선 AE·AF와 BC의 세 접점 E,F,D 및 AB9·AC7·CD5 | BENEFICIAL/READY — CF=CD=5, AF=AE=12에서 BE=AE−AB=3 |
| 19 | EXEMPT — C 직각과 AC5·BC12의 조건은 문장으로 충분하며 직접 세 삼각비를 구하게 하므로 빗변13을 미리 표시하지 않는다. | BENEFICIAL/READY — 5·12·13 직각삼각형에서 B의 세 삼각비 및 C=90°의 tan 미정의를 확인 |
| 20 | REQUIRED/READY — BC=7, ∠B60°, △ABC 넓이 21√3/2 조건과 높이 | BENEFICIAL/READY — 넓이로 AD3√3, 이어 AB6·BD3·DC4·AC√43의 수선을 이용 |
| 21 | REQUIRED/READY — A가 직각인 ABC의 내접원 O와 접점 D,E,F, BE6·CE9 | BENEFICIAL/READY — 직각삼각형의 접선 길이에서 r3 및 OB3√5·OC3√10의 둘레 관계 |

## 검증 상태

- 문항 45, 축 90. 실행형 계획 61, EXEMPT 23, BLOCKED 6 (위에서 각 축의 구체적 근거 명시).
- 공식 `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs` **shallow 61/61 OK (FAIL 0, SKIP 0)**, **full 61/61 OK (FAIL 0, SKIP 0)**. 두 대상 폴더의 `*.plan.json` 61개를 명시적 파일 인수로 전달했다(폴더 인수만 쓰면 이 도구의 파일명 필터가 `*.plan.json`을 찾지 못하므로 0개 검사의 허위 PASS를 막음).
- **DRAWN_FEATURE_PARITY 정적 61/61 PASS:** `displaySegments`·`displayCircles`·`planeMarks.angles`/`expressionLabels`/`arcs`, `graphPlan.pieces`/`curves`/`regions`/`requiredPoints`/`overlays`에서 실제 표시되는 필드를 추출하여 개별 축의 제작 목적과 `newVisualInformation`에 대조. 그래프 점, 색칠 영역, 보조선과 반원 두 호를 별도 확인. 렌더 화면 픽셀 관측은 아님.
- **독립 SymPy 검산 불일치 0건:** 표시 선분 190개, 각 66개, 수치 길이 라벨 109개, 원 12개, 호 6개, 그래프 20개(실제 곡선 29개), requiredPoints 19개, 표시 overlay 점 8개·선분 7개, 색칠 영역 2개. 원래 수치 조건과 sourceQuote/sourceConditions 연결 61개 확인. 연향중 10번의 불가능한 두 BD²는 별도 정수·근호 독립 계산으로 재확인.
- **실제 렌더·PNG 실물·학생 화면·게시 = RENDER_NOT_RUN.** 공식 lint full은 엔진 모델·타입세팅 검사이며 SVG/PNG 렌더·실물 가독성 PASS가 아니다.
- 본 작업은 source JS/실제 SVG/이미지 연결과 배포를 바꾸지 않는 plan-only 생산이다. 원문 BLOCKED를 정정하기 전에는 두 시험지의 전체 완성·큐 완료를 선언하지 않는다.
