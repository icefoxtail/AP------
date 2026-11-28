# 중3 1학기 기말 유사시험지 SVG production plan — 24 연향중·24 신흥중 독립 감사

> 기준일: 2026-11-29(KST). 이 문서의 **정적 실행형 plan 작성·검증**과 **시험지 전체 완료**는 별개의 판정이다. 실제 렌더가 되지 않았고 원문 BLOCKED가 남았으므로 두 시험지의 전체 완료와 큐 체크는 **보류**한다.

## 1. 범위, 원격 상태, 충돌 증거

- 정확한 원본: `archive/exams/similar/middle/m3/1final/24_연향중_1학기_기말_중3_유사.js`(23문항), `archive/exams/similar/middle/m3/1final/24_신흥중_1학기_기말_중3_유사.js`(24문항). 총 **47문항·94축**이다. `window.questionBank` 항목별 `id`, `content`, `answer`, `solution`, `image`를 독립 추출했다.
- 최초 `git fetch origin main` 결과 `origin/main = 76c12584444517016157ec0bc87759b1300f0f13`. 과거 인수인계 SHA `9c5262cd8f10d2bccc7f98bb63df3eacd4b32e55`는 선정 증거로 재사용하지 않았다.
- 당시 열린 PR **90개 전체**에 대해 각 PR의 **실제 변경 파일 목록**을 개별 페이지 조회했다. PR 파일 조회 누락 **0**, 수집한 실제 변경 경로 **3,612건**. 제목 검색이나 표본 조사가 아니다.
- Git tree로 확인한 두 원본 JS 존재 **2/2**, 원격 main의 공식 `archive/tools/geometry-equation/production/plans/<stem>/` 실행형 plan **각 0개**, 완료 중복 **0**. 두 stem의 원본 JS, `assets/images/<stem>/` SVG·이미지, 레거시 `<stem>_plans/`, 공식 production plan 폴더 및 `docs/operations/`의 이번 신규 감사 파일에 대한 열린 PR 실제 파일 경로 직접 충돌 **0건**.
- 앞 사이클 `25_풍덕중`, `24_왕운중`(#3505/#3506), `25_연향중`, `25_왕운중`(#3502) 및 사전 제외 PR #3499, #3494, #3491, #3489, #3487, #3486, #3480, #3476, #3473, #3469, #3467, #3464, #3460, #3450, #3447, #3442, #3441, #3436과 정확한 원본 경로가 다르다. 따라서 원래 지정된 두 시험지를 확정했고 재선정하지 않았다.
- 루트·`archive/AGENTS.md`, `docs/agents/{common,visual-svg,typebank-figure-plan-execution,git-evidence,outcome-method-review}.md`, `production/AUTHOR_GUIDE.md`를 읽고 공식 도구·안전 게이트를 적용했다. 원래 `main` 작업 복제본은 깨끗이 보존하고, 별도 브랜치 `work/m3-sim-24yeonhyang-24shinheung-20261129`와 별도 worktree에서만 편집했다.
- **병합 직전 재검증:** `git fetch origin main`으로 `origin/main`이 **`d8d3062a9b1e45a99767208747353ad53b816d20`**로 이동한 것을 확인했다. 최초 SHA 이후 main의 실제 변경 경로 **23개** 중 이번 두 stem·감사 문서와 겹치는 경로 **0개**. 최신 열린 PR **88개 전수**, 실제 변경 파일 경로 **3,585건**(고유 **3,437**), PR 파일 조회 실패 **0**, 두 stem 원본·자산·레거시·공식 plan 및 감사 문서 직접 충돌 **0건**. 최신 충돌검사로 최초 증거를 대체 확인했다.

## 2. 94축 전체 독립 판정

표의 모든 **EXEMPT** 칸은 해당 축만의 수학적·교육적 이유다. P=학생에게 보이는 문제축, S=해설축. `REQUIRED`는 원문 해석에 필수인 도형, `BENEFICIAL`은 풀이를 돕는 도형, `BLOCKED`는 원본의 조건·자료·정답 노출 결함이며 대체 plan을 작성했더라도 원본 JS를 수정하지 않은 이상 해제되지 않는다.

### 24 연향중: 23문항 / 46축

| 번호 | P 판정 및 독립 이유 | S 판정 및 독립 이유 | 독립 수학 재풀이·정답 |
|---:|---|---|---|
| 01 | EXEMPT — ㄱ~ㅂ의 이차항 소거 여부를 식 전개로 바로 판별 | EXEMPT — ㄴ은 `−x+2=0`, ㄹ은 `x+4=0`을 전개해 보이는 것으로 충분 | 일차 ㄴ·ㄹ → ② |
| 02 | EXEMPT — 근을 대입하는 인수식 수치 계산, 좌표 그림 불필요 | EXEMPT — `(4−1)(4+2)`의 곱셈 절차가 풀이의 핵심 | 18 → ④ |
| 03 | EXEMPT — 알려진 근 `−3`의 계수 대입만으로 a 결정 | EXEMPT — 근과 계수의 관계로 다른 근 `−5` 산출 | a=4, 요구 합 `−1` → ① |
| 04 | EXEMPT — 제시한 방정식들의 근 유형 비교는 판별식·근호 계산 | EXEMPT — `(x+2)²=18`의 무리수 근이 충분한 증거 | `−2±3√2` → ③ |
| 05 | EXEMPT — 근의 공식의 p,q 비교는 문자식 조작 | EXEMPT — `√(16+3p)`의 계수 비교가 판단 근거 | p=2,q=4, 합6 → ⑤ |
| 06 | EXEMPT — 중근 조건 `D=0` 적용, 그래프 접촉 그림 요구 없음 | EXEMPT — p=−24 대입과 중근 검증으로 완결 | q=4/3, p−q=−76/3 → ② |
| 07 | EXEMPT — 두 인수분해와 지정 근 대응으로 정답 결정 | EXEMPT — 두 번째 방정식의 근 `−1/2,3`을 숫자로 검산 | p=2, 합5/2 → ④ |
| 08 | EXEMPT — 포물선 오목 방향을 `2>0` 부호로 판별 | EXEMPT — 제시 문장의 참·거짓에는 독립 그래프가 필요하지 않음 | y=2x²는 위로 열린다; 틀린 ① |
| 09 | **BLOCKED** — 원문 ‘다음 그림과 같이’ 직사각형 ABCD의 필수 그림·`image`·SVG가 없음; 원본 대응 검증 불가 | BENEFICIAL — t와 가로·세로 길이 관계를 보조 직사각형으로 표현한 `q09-solution` | 조건 계산 t³=8 → t=2, 폭4·높이12, 둘레32; **그림 누락은 그대로** |
| 10 | **REQUIRED** — 서로 평행 이동한 두 포물선의 세로 대응관계 및 AB 선분이 필요 | BENEFICIAL — 동일 x에서 함수값 차가 상수 7임을 실제 AB로 시각화 | `−2x²−(−2x²−7)=7`; AB=7 |
| 11 | EXEMPT — y가 x의 이차식인지 식 변환만으로 판별 | EXEMPT — `x(x+4)=x²+4x`의 항 차수 확인으로 완결 | ① |
| 12 | **REQUIRED** — 대칭축과 x=0,6의 반사대칭 점 위치가 의미의 중심 | BENEFICIAL — 꼭짓점(3,0) 대칭 반사로 미지의 함숫값 설명 | y(0)=7 ⇒ y(6)=7 → ④ |
| 13 | EXEMPT — 축과 두 함수값으로 식의 계수를 연립 계산 | EXEMPT — a=2를 대입해 k의 수치만 결정, 좌표 그림 추가 효용 작음 | `2(x+1)²+1`, k=19 → ② |
| 14 | **REQUIRED** — 원본 포물선의 아래쪽 열림·축 위치를 판독해야 함 | EXEMPT — 그래프에서 얻은 a,p 부호를 정리하면 선택지 판정 완료 | a<0, p<0; 맞는 그림 ⑤ |
| 15 | EXEMPT — 꼭짓점형 계수 비교는 완전제곱식으로 충분 | EXEMPT — a=2,b=2의 정수 대입만 요구 | a+2b=6 → ③ |
| 16 | EXEMPT — 한 점의 함수 대입과 축 공식 계산 | EXEMPT — k=8 이후 `−b/(2a)` 수치 계산으로 완결 | 축 x=2 → ② |
| 17 | EXEMPT — 평행이동 후 식 전개가 질문의 본질 | EXEMPT — `2(x−3)²−7`을 항별 전개해 p+q 계산 | p=−12,q=11, 합−1 → ⑤ |
| 18 | EXEMPT — 꼭짓점형 식에서 축 위치를 직접 읽을 수 있음 | EXEMPT — x=3과 선택지의 x=−3 비교에 그림은 불필요 | 거짓 ① |
| 19 | **REQUIRED** — 원점 O·x절편 B·꼭짓점 A와 삼각형 영역의 기하적 관계 필수 | BENEFICIAL — 삼각형의 밑변·높이와 포물선 계수를 함께 표시 | O(0,0),B(4,0),A(2,−4), y=x²−4x; a+b+c=−3 → ④ |
| 20 | EXEMPT — 두 근 2,6으로부터 인수형을 만드는 대수 문제 | EXEMPT — k=f(5)=−3 대입·합산만으로 답 결정 | b=−8,c=12, b+c−k=7 → ③ |
| 21 | **REQUIRED** — 동심원 두 원·반지름 8·증가분 x 구간이 조건의 실물 그림 | EXEMPT — 새 원의 넓이 `π(8+x)²=2π·8²` 해법이 별도 작도 없이 충분 | x=8√2−8; 바깥 원 모식도는 비율을 재는 척도가 아님 |
| 22 | EXEMPT — `f(p)=p`를 이차방정식으로 정리하는 항등식 조작 | EXEMPT — 두 해의 합은 비에타 법칙으로 6, 그래프 불필요 | p=3±√3, 합6 |
| 23 | EXEMPT — 두 x절편 사이의 거리와 축 좌표로 근 위치 결정 | EXEMPT — 근 −1,5로부터 `b=−4a`, `n=−9a` 계산이 충분 | (b−n)/a=5 |

### 24 신흥중: 24문항 / 48축

| 번호 | P 판정 및 독립 이유 | S 판정 및 독립 이유 | 독립 수학 재풀이·정답 |
|---:|---|---|---|
| 01 | EXEMPT — 이차방정식의 두 근을 인수분해로 결정하는 선택 | EXEMPT — `(x−2)(x−6)` 전개 검산이 풀이의 핵심 | 근2,6 → ②·⑤ |
| 02 | EXEMPT — 정수 인수쌍에서 합의 최솟값 찾기 | EXEMPT — `(−1,−18)` 등 부호 있는 인수쌍 비교 | 합−19 → ③ |
| 03 | EXEMPT — 두 일차식 전개 후 계수 대조 | EXEMPT — x²,x,상수항의 일대일 대응으로 충분 | `8x²−2x−3`, a−b=−1 → ① |
| 04 | EXEMPT — 선택지 항을 이항한 뒤 x²항의 소거 여부 판정 | EXEMPT — ④만 `2x²−x−2=0`으로 남는지 검산 | ④ |
| 05 | EXEMPT — x=3을 후보 방정식에 직접 대입 | EXEMPT — ②의 `18−15−3=0` 한 줄 수치 증명 | ② |
| 06 | EXEMPT — 완전제곱법의 다음 단계가 문자식 비교 | EXEMPT — `(x−4)²=19`에서 부호를 직접 검산 | `x=4±√19`, 부적절한 ⑤ |
| 07 | EXEMPT — 주어진 해 −4,−1을 각 식에 넣어 계수 계산 | EXEMPT — a=6,b=2 곱을 확인하는 것으로 종료 | ab=12 → ① |
| 08 | EXEMPT — 완전제곱식의 제곱근 취하기 | EXEMPT — `(x+3)²=9`의 두 근을 즉시 대조 | −6,0 → ④ |
| 09 | EXEMPT — 중근의 계수 조건과 두 자리 자연수 범위 | EXEMPT — `a²=36b`, 최소 두 자리 제약을 수치로 검증 | a=24,b=16, 차8 → ② |
| 10 | EXEMPT — 근의 공식에서 두 근호 항 비교 | EXEMPT — `x=(4±√10)/2`의 구성수 합 계산 | A+B=14 → ③ |
| 11 | EXEMPT — 정사각형 넓이와 부채꼴 넓이의 식 형태만 비교 | EXEMPT — `(x+2)²`와 `πx²/6`로 둘 다 이차식 증명 | ①·④ |
| 12 | EXEMPT — 함수값 두 개를 식에 대입하고 합함 | EXEMPT — f(2)=2,f(−1)=8 계산이 전부 | 합10 → ⑤ |
| 13 | EXEMPT — y=3x²의 꼭짓점은 식에서 바로 확인 | EXEMPT — (0,0)과 거짓 주장 (3,0) 비교만 요구 | 틀린 ① |
| 14 | EXEMPT — (2,8)을 `ax²−4`에 대입하면 a 즉시 산출 | EXEMPT — `4a−4=8` 풀기로 완결 | a=3 → ③ |
| 15 | EXEMPT — x·y 평행이동의 대수 표현 확인 | EXEMPT — `3(x−4)²−5`와 주어진 꼴 비교 | m+n=−1 → ② |
| 16 | **BLOCKED** — ‘오른쪽 그림’의 일차함수 그래프가 원본 `image`/SVG 및 실제 선택지 참조 없이 누락; a,b의 부호를 알 수 없음 | **BLOCKED** — 원 해설은 근거 없는 a<0,b>0을 가정해 ④로 확정; `a=1,b=1`과 `a=−1,b=1`이 다른 정답 생성 | 반례: `y=x+1`이면 a>0,b>0의 선택 ①, `y=−x+1`이면 a<0,b>0의 선택 ④. 빠진 그림 없이는 단일 정답 성립 불가 |
| 17 | EXEMPT — 제2사분면의 점 존재 여부를 y절편·단조 조건으로 계산 | EXEMPT — `9a+6≤0` 경계와 a<0을 대수로 풀어 충분 | 최댓값 a=−2/3 → ⑤ |
| 18 | EXEMPT — 꼭짓점형의 x절편을 근호식으로 계산 | EXEMPT — `(x−3)²=9`의 근 0,6을 제시하면 완료 | 틀린 ① |
| 19 | **REQUIRED** — 원본 그래프에서 꼭짓점 (−2,−3), y절편 (0,5) 읽기 필수 | BENEFICIAL — 축과 두 점을 설명식에 시각적으로 결속 | y=2(x+2)²−3=2x²+8x+5; abc=80 → ② |
| 20 | **BLOCKED** — 원본 학생용 SVG에 구해야 할 높이 **9**의 y축 눈금 `tick-y-9-label`이 실제 표시됨; 파생 값 선노출. 본 제작의 학생용 대체 plan은 눈금을 숨기지만 원본 JS 자산은 수정 금지라 결함 유지 | BENEFICIAL — x절편 B,C와 꼭짓점 A를 이은 삼각형 및 넓이·높이를 해설 그림에 표시 | BC=6 ⇒ 근1,7 ⇒ k=−7, A(4,9), 높이9, 넓이27. 원본 `data-value="9.0"`와 가시 라벨은 이 정답 도출 전에 노출됨 |
| 21 | EXEMPT — 두 방정식을 인수분해해 숫자를 연결하는 암호 문제 | EXEMPT — 네 정수 근 1,3/4,5,−7의 조건별 순서를 계산 | `(x−1)(4x−3)`, `(x−5)(x+7)` → 4357 |
| 22 | EXEMPT — 근의 공식을 이용한 자연수 계수 범위 분석 | EXEMPT — `√(9−a)`가 정수이려면 제곱수 0,1,4 적용 | a∈{5,8,9} |
| 23 | EXEMPT — 나이 조건을 `x(x+6)=91`로 쓰는 문장제 | EXEMPT — 인수분해 `x²+6x−91=(x−7)(x+13)`로 끝남 | 어린 사람 7세 |
| 24 | EXEMPT — 꼭짓점 (p,q)의 대입 연립방정식 | EXEMPT — `(2p+1)(p−4)=0`, p>0 대수 조건으로 충분 | p=4,q=2, 합6 |

### 분류 집계

| 시험지 | 문항 | 축 | REQUIRED | BENEFICIAL | EXEMPT | BLOCKED | 독립 수학 재풀이 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 24 연향중 | 23 | 46 | 5 | 4 | 36 | 1 | 23 |
| 24 신흥중 | 24 | 48 | 1 | 2 | 42 | 3 | 24 |
| **합계** | **47** | **94** | **6** | **6** | **78** | **4** | **47** |

**BLOCKED 별도 입증:** 연향 09 P는 원문이 ‘그림과 같이’를 요구하나 해당 문항 JS에 `image` 필드가 전혀 없고 같은 stem SVG 자산도 없어서 학생에게 제시된 도형을 검증할 수 없다. 신흥 16 P/S는 `y=x+1`과 `y=−x+1`처럼 서로 다른 기울기 부호의 실제 일차함수 모두 남은 글 조건과 일치하지만 정답이 각각 달라진다. 신흥 20 P는 이미 제공된 SVG 텍스트 라벨에서 높이 9를 읽을 수 있으므로 학생이 스스로 구해야 할 값을 선노출한다. 세 결함 모두 원본을 추정 수정하거나 원래 존재하지 않는 그림을 ‘원본과 일치’로 인정하지 않았다.

## 3. 공식 실행형 production plan 전체 14개

모두 `archive/tools/geometry-equation/production/plans/<stem>/` 아래 **실행형** `*.plan.json`; 레거시 `_plans`의 상태파일 수는 0으로 계산했다. `E`는 24 연향중, `S`는 24 신흥중이다. 개별 목록은 실제 저장 파일명과 일대일이다.

| stem | 번호·축 | 파일명 | sourceConditions 매핑 | 실제 그리기 필드 |
|---|---|---|---:|---:|
| E | 09 P | `q09-problem.plan.json` | 7 | 11 |
| E | 09 S | `q09-solution.plan.json` | 7 | 11 |
| E | 10 P | `q10-problem.plan.json` | 5 | 7 |
| E | 10 S | `q10-solution.plan.json` | 5 | 7 |
| E | 12 P | `q12-problem.plan.json` | 4 | 4 |
| E | 12 S | `q12-solution.plan.json` | 4 | 4 |
| E | 14 P | `q14-problem.plan.json` | 2 | 3 |
| E | 19 P | `q19-problem.plan.json` | 5 | 9 |
| E | 19 S | `q19-solution.plan.json` | 5 | 9 |
| E | 21 P | `q21-problem.plan.json` | 7 | 14 |
| S | 19 P | `q19-problem.plan.json` | 3 | 3 |
| S | 19 S | `q19-solution.plan.json` | 3 | 3 |
| S | 20 P | `q20-problem.plan.json` | 6 | 9 |
| S | 20 S | `q20-solution.plan.json` | 6 | 9 |
| **합계** | **14** | **13 graph + 1 construction** | **69/69** | **103** |

실제 도형을 소비하는 필드를 JSON 객체별로 전수 탐색해 합산한 내역:

| 엔진 소비 필드 | 실행 항목 수 |
|---|---:|
| `graphPlan.pieces` | 13 |
| `graphPlan.requiredPoints` | 15 |
| `graphPlan.referenceCurves` | 2 |
| `graphPlan.overlays.points` | 31 |
| `graphPlan.overlays.segments` | 22 |
| `graphPlan.overlays.polygons` | 6 |
| `mathPlan.nodes` | 5 |
| `displayPoints` | 3 |
| `displaySegments` | 2 |
| `displayCircles` | 2 |
| `planeMarks.dimensions` | 2 |
| **계** | **103** |

검증 스크립트는 두 원본 JS를 `vm`으로 읽어 `questionBank[id].content.includes(plan.sourceQuote)`를 모든 plan마다 확인하여 **14/14 일치**를 얻었다. 모든 `sourceConditions[].mappedTo`를 `[]` 인덱스 포함 실제 JSON 경로로 역참조해 **69/69 존재, 누락 0**을 확인했다. 경로가 단지 `caption`이나 `accessibilityDescription`인 사례는 없으며 103개 그리기 필드 수에도 설명 필드는 포함하지 않았다. 실제 식 값은 아래 원본 SVG와 독립 수학 계산에 대조했다. `q09-P`, `q20-P`의 교정 도형은 BLOCKED 원본의 자동 치유 또는 학생 화면 검증을 의미하지 않는다.

## 4. 원본 SVG 독립 기하·좌표·라벨 대응

JS에서 실제 `image`로 참조하는 원본 SVG는 **7개**다. 연향 q10·q12·q14·q19·q21 및 신흥 q19·q20. 연향 q09 및 신흥 q16은 SVG가 없고, 각각의 P 또는 P/S를 원본 SVG parity PASS 처리하지 않았다. 모든 `polyline[data-role="curve"]`의 소수 픽셀 샘플을 SVG 축의 원점·px/단위 비율로 역변환한 뒤 해당 2차함수에 대입해 수직 오차 `1e−8` 미만인지 **2,261/2,261** 개별 검산했다. 최대 절대 수학 좌표 오차 `2.4003554699447704e−10`, 초과 0. 원본 좌표 점·선분·라벨은 SVG 소스를 직접 파싱하고 계획 객체의 수학 좌표 및 명칭과 대조했다. **실제 SVG 렌더 pixel parity는 NOT_RUN**이다.

| 원본 SVG | 곡선 샘플 | 수학적 역변환·그림 요소 검증 | 원본 대비 공식 plan 차이·불일치 |
|---|---:|---|---|
| E q10 | 301+301=602 | y=−2x² 및 y=−2x²−7; 원점 `(256,72)`, 22.4 px/unit, 좌표축 2·곡선 2 | 원본 SVG에는 AB 세로선이 **없음**. 두 plan에는 x=−2에서 A(−2,−8)·B(−2,−15), AB를 보조 추가. 원본 AB parity PASS라고 주장하지 않음 |
| E q12 | 450 | `y=(7/9)(x−3)²`; 원본 V(3,0)·Y(0,7)·P(6,7), 축 2·곡선 1·점 이름 3·점 중복표시 1·지시선 1 | 이름·대칭 정보 유지, 해설의 k=7은 S에만 명시; 학생 P의 최종 k값 라벨은 숨김 |
| E q14 | 301 | 아래 열린 `y=−(x−2)²` 모양, 축 2·곡선 1·꼭짓점 V(2,0)·지시선 1 | 원본 눈금·좌표는 부호 판독용 모식도; P는 a<0·p<0의 부호 근거만 표현하고 미제시 계수 수치를 정답으로 표기하지 않음 |
| E q19 | 303 | `y=x²−4x`; O(0,0), A(2,−4), B(4,0), 축 2·곡선 1·꼭짓점/절편 점 3·삼각형 채움 1·변 1·점 지시선 3 | 채워진 OAB 삼각형과 3변을 `overlays.polygons/segments`에 실결속; 원본 중복 required-point는 계획에서 하나의 좌표 의미로 합침 |
| E q21 | 0 | 같은 중심의 두 원 2, 원본 반지름 `85.057471264`·`127.586206897` 픽셀(비 1.5), OP/PQ 반지름 구간 선분 2, 라벨 `8 cm`, `x cm` | 원본 비례가 실제 넓이 두 배의 반지름비 √2가 아닌 **설명용 모식도**. plan 역시 내부 8·외부 12를 모식도 좌표로 사용해 증가분을 `x`로 라벨; 결과 x=8√2−8을 P에 선노출하지 않음. 실제 길이비·정답치수 parity 아님 |
| S q19 | 302 | `y=2(x+2)²−3`; V(−2,−3), Y(0,5), 축 2·곡선 1·점 2. 원본 x/y 스케일은 각각 112/56 px/unit로 **서로 다름** | P는 미지 a값의 직접 라벨을 억제, S는 대입 결과 2를 제시; 비등방 원본 SVG 비율을 사실대로 기록 |
| S q20 | 303 | `y=−(x−4)²+9`; A(4,9), B(1,0), C(7,0), 축 2·곡선 1·점 3·삼각형 채움 1·변 1·점 지시선 3·추가 좌표지시선 1 | 원본 **x4·y9 축눈금 2개** 중 y9의 `tick-y-9-label`이 학생에게 도출 대상 높이 9를 노출. P 대체 plan은 `axisTickValues`를 모두 비워 숨김. S에만 높이·넓이 해설 가능. 원본 결함 BLOCKED 지속 |
| **총합** | **2,261** | **2,261/2,261 수학 함수식 일치** | 원본에 없던 AB·직사각형, 보조점/치수/해설 표기는 각각 **추가**로 공개. 렌더의 실제 모양은 미검증 |

원본의 식별자·라벨 확인은 원본에서 실제 제공되는 `V,Y,P,O,A,B,C`, 중심과 길이 구간, x/y축 tick과 곡선 표본을 대상으로 했다. 원본 SVG q09·q16이 존재하지 않아 대응 점·곡선·라벨 0개이며 검증 상태는 **해당 없음 / 신규 작도 수학 근거만**, 원본 동등성을 위조하지 않았다. 각 원본 그래프의 점은 위 식에 정확히 대입되며, 신흥 q20 A의 y=9는 문제 글에서 주어진 값이 아니라 `BC=6`으로 나중에 도출하는 값이다. 학생 P 계획의 수치 좌표는 내부 엔진 배치값으로만 사용하고 `coordinates:false`, 필요시 `marker:NONE`, 눈금 비표시를 적용했다. 출력 결과 확인은 렌더 차단 때문에 NOT_RUN이다.

## 5. 공식 lint 실제 실행 결과

모든 작성 plan의 정확한 파일 경로를 명령 인자로 넘겼다. 아래 glob은 현재 두 대상 디렉터리에서 실제 **14개의 `*.plan.json` 경로로 셸 확장**되었다.

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow \
  archive/tools/geometry-equation/production/plans/24_연향중_1학기_기말_중3_유사/*.plan.json \
  archive/tools/geometry-equation/production/plans/24_신흥중_1학기_기말_중3_유사/*.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs \
  archive/tools/geometry-equation/production/plans/24_연향중_1학기_기말_중3_유사/*.plan.json \
  archive/tools/geometry-equation/production/plans/24_신흥중_1학기_기말_중3_유사/*.plan.json
```

| 검증 모드 | 입력 파일 | OK/PASS | FAIL | SKIP | 종료 코드 |
|---|---:|---:|---:|---:|---:|
| shallow | 14 | **14** | **0** | **0** | 0 |
| full | 14 | **14** | **0** | **0** | 0 |

작성 중 스키마 오류(`graphPlan.layout`, `pointNames` 위치, 꼭짓점 중복, referenceCurve 필수점) 수정 후 **최종 결과**를 기록했다. full lint에는 설치된 독립 폰트/의존성의 환경 경로를 연결하였으며 이 임시 연결은 `.tmp/`의 무시되는 경로로서 Git 변경 파일이 아니다. 정적 PASS는 SVG 렌더 PASS의 대체 근거가 아니다.

## 6. 공식 renderer 직접 실행·실패 재현

실제로 실행한 `--item` 파일은 Git 관리 대상이 아닌 `.tmp/m3-yeonhyang-q10-item.json`이며 `sourcePath`가 위 원본 E JS, `ordinal=10`이다. `--plan`은 이 사이클에서 작성한 정식 P 계획이다.

```bash
node archive/tools/geometry-equation/production/render-plan.mjs \
  --item .tmp/m3-yeonhyang-q10-item.json \
  --plan archive/tools/geometry-equation/production/plans/24_연향중_1학기_기말_중3_유사/q10-problem.plan.json \
  --out .tmp/m3-yeonhyang-q10-render
```

- 재현된 결과: `stage=measure`, 오류 코드 **`ARCHIVE_PREFLIGHT_FAIL`**, 프로세스 종료 코드 **1**. 원인: 실행환경에 Chrome 본체 `/opt/google/chrome/chrome` 없음. 결과 SVG **0개**, 정식 이미지 **0개**; 추적용 `attempts.jsonl`, `figure-result.json`만 생성.
- 환경 가설을 검증하려고 `GEOMETRY_BROWSER_EXECUTABLE=/usr/bin/chromium`을 지정해 같은 `node ... --item ... --plan ... --out .tmp/m3-yeonhyang-q10-render-chromium` 명령을 추가 실행했다. 같은 `stage=measure`, `ARCHIVE_PREFLIGHT_FAIL`, 종료 **1**. `/usr/bin/chromium` 래퍼는 있으나 실제 `/usr/lib/chromium/chromium` 본체가 없어 실행할 수 없었다. 이 재시도 역시 SVG **0개**.
- 공식 상태: **`RENDER_NOT_RUN`** (환경 의존성 결여로 실렌더 미시작). **실제 생성 SVG 시각 검증 NOT_RUN**, **학생 화면 NOT_RUN**, **A4 인쇄/페이지 나눔 NOT_RUN**. 브라우저나 이미지가 없는 상태에서 시각 PASS를 보고하지 않는다.

## 7. 완료 게이트·권한 및 원격 Git 증거

- **정적 제작:** 공식 실행형 plan **14개 작성**, 원문 인용 **14/14**, 실제 그리기 매핑 **69/69**, 실제 그리기 필드 **103**, 포물선 역변환 **2,261/2,261**, 수학 재풀이 **47/47**, shallow/full lint **각 14/14 PASS**.
- **BLOCKED:** 연향 q09 P; 신흥 q16 P/S, q20 P → **4축**. 원본 JS/SVG를 변경하지 않았으므로 정상 제작 계획이 있어도 원본 결함을 해소한 것으로 판정하지 않는다.
- **NOT_RUN:** 공식 SVG 렌더(실행 환경 중단), 실제 SVG 시각, 학생 화면, A4 검증. **시험지 전체 완료 선언 = 미완료/보류**, **큐 체크 = 보류**.
- **Windows 큐:** **미접근 / 상태 미확인 / 체크·변경 없음**. 기출·고등학교·배정 외 시험지·원본 JS/SVG/이미지·레거시 계획 수정 **0개**.
- **PR 번호·개별 병합 SHA·최종 원격 main SHA·변경 파일별 로컬 Git blob SHA 대 원격 Git blob SHA readback:** 정상 PR 병합 **후** 별도 보완 PR로 이 절에 실측값을 채운다. 아직 알려지지 않은 값은 추측하지 않는다. 문서 보완도 직접 main push가 아닌 정상 PR 병합만 허용한다.

## 8. 차기 1사이클 인수인계

이번 두 시험지의 계획을 수정하거나 완료 체크하지 않은 상태에서, **새로 확인한 원격 main과 열린 PR 전체의 실제 변경 파일 경로로** 다음 2건을 안전하게 선정한다. 차기 대상과 그 선정 증거는 본 사이클 병합 이후 별도 보완 절에만 추가하며, 다음 두 건의 plan 제작은 **시작하지 않는다**.
