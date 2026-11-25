# 2025 금당고 고1 2학기 기말 유사3 — 문제·해설 2축 SVG plan 검수

- 대상 JS: `archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사3.js`의 Q01~Q22 (22문항·44축).
- 검사한 원문 JS blob: `6031908ed7a242c1cd06128047cfe1fdc96fbbb5`.
- 최초 원격 main: `fe17405f1fba340ae6c1727afdab948415c75cc7`. 제일고 1학기 중간 22문항은 열린 PR #3056이 이미 담당하여 제외. 금당고 유사3의 신규 plan 디렉터리와 겹치는 열린 PR 없음.
- 이 장부와 공식 엔진 실행 plan 3개만 신규 작성한다. 원본 JS·기존 SVG·타 시험지·유형은행·교과서·엔진 수정 없음. 이미 JS에 연결된 SVG는 새로운 plan으로 중복 제작하지 않으며 실제 렌더 품질검사 대상은 아니다(`NOT_RUN`).

| qid | 문제 축 판정·개별 사유 | 해설 축 판정·개별 사유 | 신규 plan 또는 기존 자산 | 신규 plan PARITY |
| --- | --- | --- | --- | --- |
| Q01 | EXEMPT — 원소의 모호성 여부를 묻는 언어·정의 문제 | EXEMPT — 방정식 실근 1,2 및 모호한 보기 비교의 단순 열거 | — | N/A |
| Q02 | EXEMPT — 15 미만 3의 배수로 부분집합 조건을 정확히 명시 | EXEMPT — 원소 8의 포함 여부를 확인하는 열거 | — | N/A |
| Q03 | EXEMPT — 두 집합의 상호 포함 관계로 대수 조건 충분 | EXEMPT — A=B에서 a=3을 직접 계산 | — | N/A |
| Q04 | EXEMPT — P⊂Qᶜ라는 진리집합 식이 모든 문제 조건 | BENEFICIAL — P와 Q가 서로소인 그림으로 p→¬q 및 대우 q→¬p 이해 | `q04-solution.plan.json` | PASS |
| Q05 | EXEMPT — 두 진리집합이 구간 부등식으로 주어짐 | BENEFICIAL — 열린 구간 (−3,3), (0,2)의 포함 관계; 기존 SVG 연결 | 기존 `q05-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q06 | REQUIRED — 발문이 함수 X→Y의 그림을 직접 조건으로 사용; 기존 문제 SVG | BENEFICIAL — 치역=공역 및 역대응을 보여 주는 기존 해설 SVG | 기존 `q06-problem.svg`, `q06-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q07 | EXEMPT — 두 합성함수 차가 식으로 주어짐 | EXEMPT — x=2에 대입하는 네 함숫값 계산만 수행 | — | N/A |
| Q08 | EXEMPT — 미정 함수 직선을 문제에 선결정해 그리면 값 유출 | BENEFICIAL — (1,4)↔(4,1) 대칭이며 f(x)=−x+5가 자기 역함수인 모양 | `q08-solution.plan.json` | PASS |
| Q09 | EXEMPT — 미정 k 또는 점근선의 값을 먼저 그리면 답 암시 | BENEFICIAL — 쌍곡선의 평행이동과 점근선 x=−2,y=3; 기존 SVG | 기존 `q09-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q10 | EXEMPT — 두 근호의 실수 조건이 수식에 충분히 제시 | BENEFICIAL — 정수 구간 −5≤x≤5와 자연수 후보; 기존 SVG | 기존 `q10-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q11 | EXEMPT — 배수 집합 포함 관계가 기호로 완결 | BENEFICIAL — B₇₂⊆Bₙ⊆B₁₂ 후보 12,24,36,72; 기존 SVG | 기존 `q11-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q12 | EXEMPT — 매개변수 a에 따른 명제 조건이 텍스트·식으로 완결 | BENEFICIAL — 대우의 경계 x<a, y<3과 선형 부등식; 기존 SVG | 기존 `q12-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q13 | EXEMPT — 두 양수와 역수 조건이 식으로 완전함 | EXEMPT — AM–GM의 등호 x=2y와 합의 단순 계산 | — | N/A |
| Q14 | EXEMPT — 유한 집합 위 조각함수 대응이 식으로 명시 | BENEFICIAL — 3→2→4→3의 주기 순환; 기존 SVG | 기존 `q14-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q15 | EXEMPT — 무리함수와 역함수 교점은 문제 미지값이므로 그리면 답 선공개 | BENEFICIAL — 두 함수의 y=x 위 교점 (3,3),(7,7) 및 거리; 기존 SVG | 기존 `q15-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q16 | REQUIRED — 유리함수 그래프가 a,b,c의 조건 자체; 기존 문제 SVG | BENEFICIAL — 원 그래프의 점근선 및 도출 무리함수의 두 사분면; 기존 SVG | 기존 `q16-problem.svg`, `q16-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q17 | EXEMPT — 집합 A,B,C와 원소 합·개수 조건이 언어/식으로 제시됨 | BENEFICIAL — A∩C={7}을 한 번 빼서 얻은 k∈[56,76] 및 후보 60,63을 비교 | `q17-solution.plan.json` | PASS |
| Q18 | EXEMPT — 미지 직선 l과 지름원의 관계를 문제에서 알려 주면 핵심 풀이 선공개 | BENEFICIAL — 중심 (−1,3), 반지름 √5와 직선거리 판정; 기존 SVG | 기존 `q18-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q19 | EXEMPT — k 미정의 네 교점 구조를 특정해 그리면 범위 암시 | BENEFICIAL — 절댓값 이차함수와 수평선의 네 교점, 경계 k=0,7; 기존 SVG | 기존 `q19-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q20 | EXEMPT — a,b 미정 구간별 함수를 정답으로 확정해 먼저 그리지 않음 | BENEFICIAL — 분기점 x=1에서 두 치역을 이어 일대일대응을 이루는 원리; 기존 SVG | 기존 `q20-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q21 | EXEMPT — U와 A, 서로소 B의 조건이 원소로 완결됨 | BENEFICIAL — U\A={3,4,5,6}의 선택 가능한 영역과 2⁴개 부분집합; 기존 SVG | 기존 `q21-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q22 | EXEMPT — k 미정인 움직이는 직선을 특정하면 답 구간 노출 | BENEFICIAL — 무리함수와 직선의 교점이 하나/둘인 경계 경우; 기존 SVG | 기존 `q22-solution.svg` | EXISTING_ASSET / NOT_RUN |

**판정 합계**: 문제 22축 = REQUIRED 2(기존 자산 있음) + EXEMPT 20. 해설 22축 = BENEFICIAL 17(기존 연결 14, 신규 실행 plan 3) + EXEMPT 5. 누락된 문항·축 0. 기존 자산 16축의 연결은 유지했으나 본 배치에서 렌더·시각품질을 재검사하지 않았다.

## DRAWN_FEATURE_PARITY — 원문 대 실제 그려지는 필드의 1:1 독립 대조

| 실행 plan | 독립 재계산 | 실제 표시 필드 | 판정 |
| --- | --- | --- | --- |
| `q04-solution` | P⊂Qᶜ ⇔ P∩Q=∅. 따라서 P의 원소는 Q 밖에 있고 Q의 원소는 P 밖에 있음 | `diagram.kind=VENN`, 실제 `sets[P,Q]`, `diagram.disjoint=[[P,Q]]`; `shade` 부재 | PASS |
| `q08-solution` | f(1)=4, f⁻¹(1)=4 ⇒ f(4)=1, 따라서 기울기 −1·절편 5. f=f⁻¹ | `graphPlan.curves[f]` LINE `[5,-1]`, `curves[axis]` 점선 y=x, 실제 `overlays.points[A]=(1,4),[B]=(4,1)` 및 x/y축 1·4 눈금 | PASS |
| `q17-solution` | A={2,3,5,7}, A∩B 원소 합 10은 {3,7} 또는 {2,3,5}; k≥21이면 A∩C={7}. 11≤3+⌊k/7⌋≤13 ⇒ 56≤k≤76. 그 범위 조건 통과 k=60,63 | `numberLine.rows[0].pieces` CLOSED [56,76]·`integerPoints:true`, `rows[1].points[K1,K2]`=60,63, `within:1` | PASS |

- 두 함수의 y=x 대칭, 점 좌표, 그래프 직선 계수, 수직선 양 끝 상태, 정수 눈금·후보점, 벤다이어그램 집합 배치·서로소를 **설명 문자열이 아닌 실제 엔진 표시 필드**에서 찾음.
- 별도의 임시 JS 검사(커밋 제외)에서 문제 원문을 직접 파싱하고 Q04 대우/집합 관계, Q08 원함수와 역함수 일치, Q17 k=1~500의 약수·7의 배수·합집합 원소 수를 독립 재계산했다. 세 계획 전부 `DRAWN_FEATURE_PARITY PASS`.
- Q08은 원함수와 역함수가 동일 직선이므로 중복해서 두 줄을 그리지 않음. 문제축에서 미지값·정답을 미리 그리는 신규 plan은 0. 신규 plan 3건 모두 `shade`·`regions`·면 채움 0건(수직선의 BLUE는 선분 색상). 해당 원문에서 별도 각·직각표식·변 길이·비율 표시는 필요하지 않음(N/A).
- `ENGINE_CAPABILITY_PENDING` **0건**. 실제 SVG 렌더·PNG 육안검수·학생 화면·A4·JS 링크 업데이트는 **NOT_RUN**. 이 장부의 PARITY는 **그려질 구조의 수학적·계약상 동치**를 뜻하며 렌더 결과를 봤다는 뜻이 아니다.

## 공식 plan-lint 결과와 의존성

- shallow: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사3_plans/*.plan.json` ⇒ **3 OK / 0 FAIL / 0 SKIP**.
- full: 동일 명령에서 `--shallow` 제거 ⇒ **3 OK / 0 FAIL / 0 SKIP**.
- full 의존성은 `runtime-package-lock.json`의 npm `ci`와 `dependency-lock.json`의 NotoSansKR.ttf를 사용. 글꼴 SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 실측 일치. 설치물 및 임시 검산 코드는 Git 커밋에서 제외.
- 공용 엔진·원본 JS는 수정하지 않았으며 `EXEMPT`용 가짜 JSON, 수작업 SVG, 미래 자산 URL 삽입도 없음.
