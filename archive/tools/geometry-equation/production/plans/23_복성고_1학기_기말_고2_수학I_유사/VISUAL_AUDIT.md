# VISUAL_AUDIT — 23_복성고_1학기_기말_고2_수학I_유사

## 범위·정본·증거

- 대상 현행 JS: `archive/exams/similar/high/h2/1final/23_복성고_1학기_기말_고2_수학I_유사.js`; 문항 **22**, 문제축 **22**, 해설축 **22**, 총 **44축**.
- 출발점: GitHub 최신 `main` `2a84293c1e4f03e639859af033a452e7f2f76057`. 이 문서와 JSON은 공식 production 폴더에만 기록하며, 현행 JS의 발문·정답·해설이 제작 기준이다.
- 판정 **REQUIRED 0 / BENEFICIAL 8 / EXEMPT 36**. 문장만으로 조건이 모두 특정되지만 공간·주기·교점 관계가 풀이 이해를 실질 보조할 때만 BENEFICIAL로 선정.
- 원본 대조: `archive/exams/original/high/h2/1final/23_복성고_1학기_기말_고2_수학I.js`; `archive/assets/images/23_복성고_1학기_기말_고2_수학I/`의 q06·q15·q19·q22 등 PNG, q05·q10·q11·q14·q15·q18·q19·q20·q21·q22 해설 SVG; 직접 연결된 `_유사/`의 `q15-problem.svg`, `q22-problem.svg`; 레거시 폴더 `archive/exams/similar/high/h2/1final/23_복성고_1학기_기말_고2_수학I_유사_plans/`의 2개 JSON.
- `-v2`·`-v3`·`-v4` 및 `_vN` SVG 번호 변형을 두 시험지의 기출·유사 자산 폴더에서 검색했으나 **별도 변형본 없음**.

## 전 문항·전 축 독립 판정

| 문항 | 문제축: 판정·개별 수학적 사유·plan | 해설축: 판정·개별 수학적 사유·plan | 독립 수학 검산 |
| --- | --- | --- | --- |
| 01 | **EXEMPT** — 코사인 진폭과 수직이동에 따른 최솟값은 수식으로 주어짐 | **EXEMPT** — 4cos(3x−1)+5∈[1,9] 범위 산술 | 최솟값 1, ③ |
| 02 | **EXEMPT** — aₙ₊₁=aₙ+3n 순차 대입만 필요 | **EXEMPT** — 3→6→12→21→33으로 완료 | a₅=33, ⑤ |
| 03 | **EXEMPT** — 부등식 54−4n<0의 정수해 | **EXEMPT** — n>13.5에서 첫 음수 항 찾기 | n=14, ② |
| 04 | **EXEMPT** — Σ(aₖ+4bₖ), Σ(bₖ−1/4) 선형성 | **EXEMPT** — Σbₖ=4, Σaₖ=30−16 | 14, ① |
| 05 | **EXEMPT** — a=10, ∠B=150°, 넓이20으로 직접 곱셈 | **EXEMPT** — ½ac sinB=20에서 c=8 | 8, ④ |
| 06 | **EXEMPT** — 사인함수 최댓값·최솟값·주기 수식만 명시 | **EXEMPT** — a=5,b=3,c=−2 값 대입 | abc=−30, ③ |
| 07 | **EXEMPT** — Sₙ과 a₄ 조건에서 계수 k 계산 | **EXEMPT** — a₄=21+k=27 ⇒ k6, a₁=9 | 9, ⑤ |
| 08 | **EXEMPT** — 기본 삼각비 π/6과 보기 비교 | **EXEMPT** — sin(2π/3)=√3/2가 유일 | ② |
| 09 | **EXEMPT** — 등차중항·등비중항으로 a,b의 연립식 | **EXEMPT** — (ab)²=3a²b ⇒ b=3, a=3 | a+b=6, ① |
| 10 | **EXEMPT** — 법칙 등식만으로 이등변 관계 판정 가능 | **EXEMPT** — 2cosA sinB=sinC ⇒ b²=a² | a=b, ④ |
| 11 | **EXEMPT** — 세 변 5,6,7이 수식으로 완전히 지정됨 | **EXEMPT** — cosA=5/7, sinA=2√6/7, 사인법칙 | R=35√6/24, ③ |
| 12 | **EXEMPT** — S₃와 S₆의 비율만 계산 | **EXEMPT** — r³=8, S₉=5(1+8+64) | 365, ⑤ |
| 13 | **EXEMPT** — ∑k(3k+1)의 산술 문제 | **EXEMPT** — 3×385+55=1210 | 1210, ② |
| 14 | **EXEMPT** — 원에 내접한 조건과 네 변이 전부 문장으로 주어짐 | **BENEFICIAL** — 원 위 네 점·대각선으로 보각 관계와 넓이 분할이 보임 → `q14-solution.plan.json` | cos B=−3/7, sinB=2√10/7, 면적6√10 |
| 15 | **BENEFICIAL** — 원·접선·B-O-P 일직선과 BOC 둔각의 위치 이해 유익 → `q15-problem.plan.json` | **BENEFICIAL** — 접점 C의 직각과 ∠BOC=π/2+θ를 한눈에 비교 → `q15-solution.plan.json` | sinθ=1/4 ⇒ cosBOC=−1/4 ⇒ sinA=√10/4 |
| 16 | **EXEMPT** — 구간 내 cosx 치환으로 이차식 끝점 비교 | **EXEMPT** — −4(t−1)²+1, t∈[−1,1], t=−1 최소 | ab=−15π, ③ |
| 17 | **EXEMPT** — 10000=2⁴5⁴의 네 항 등비수열 부분집합 개수 | **EXEMPT** — 공비 (2,5,10) 경우 각각 10,10,4 | 총24, ⑤ |
| 18 | **EXEMPT** — 양수 a의 π주기 조건으로 a=2k가 고정됨 | **BENEFICIAL** — 한 주기 교점 둘과 6주기의 열두 교점을 도식화 → `q18-solution.plan.json` | 교점 x 합(2k−1)π/2=11π/2 ⇒ k6,a12 |
| 19 | **EXEMPT** — 곡선 식과 교점의 정의가 충분하여 추가 그림은 문제 독해에 필수가 아님 | **BENEFICIAL** — 해설에서 구한 A,B,C의 거리 관계 AB=BC와 원점에서 두 기울기 비교 → `q19-solution.plan.json` | A(b,−a),B(2b/3,−a/2),C(4b/3,−a/2), a/b=2√3/3, 기울기 합−7√3/6 |
| 20 | **EXEMPT** — 삼각형 두 변·사잇각으로 코사인·사인법칙 직산 가능 | **EXEMPT** — a=2√2, sinC=√2/2로 계산 종결 | √2/2 |
| 21 | **EXEMPT** — 삼각함수 항등식을 이용해 sinx 부등식으로 환원 | **BENEFICIAL** — sinx=1/2의 두 교점과 해 구간을 그래프로 읽음 → `q21-solution.plan.json` | [π/6,5π/6] |
| 22 | **BENEFICIAL** — 빗변에 내린 수선과 세 직각삼각형 영역을 구분 → `q22-problem.plan.json` | **BENEFICIAL** — 넓이의 등차조건이 AD:DB=2:1인 해설 도식을 보조 → `q22-solution.plan.json` | AD=2DB, CD²=AD·DB, cosA=√6/3 |

**축 수 검사:** 문제 22/22, 해설 22/22. BENEFICIAL 8축→실행형 plan 8개; EXEMPT 36축→실행형/placeholder plan 0개. 전체 44축 누락 없음.

## 원본·레거시·현행 간 충돌을 구별

- **ORIGINAL_EXAM_PNG_CONFLICT:** q06 원본은 실제 그래프 PNG로 a,b,c를 추론하지만 현행은 최댓값 **3**, 최솟값 **−7**, 주기 **2π/3**을 텍스트로 완전히 제공한다(원본 PNG를 현행 그림으로 복사하지 않음). q15 기출 PNG·JS는 **sinθ=1/3**이지만 현행은 **1/4**, 추가로 **O가 BP의 내부**라는 방향 조건을 명시한다. q19 기출 PNG는 **y=a/2**와 두 교점 B,C를 보여 주지만 현행은 **y=−a/2**이므로 B,C가 x축 아래로 옮겨간다. q22 원본 JS의 넓이 등차 순서는 `ADC,CDB,CAB`, 현행은 `CDB,ADC,CAB`로 역전되며 얻는 AD:DB 비율도 달라진다. 다른 숫자 변형도 기출과 현행을 혼동하지 않았다.
- **직접 연결된 유사 SVG:** q15·q22의 `<title>` 및 도형 연결을 검사했으나 이전 산출물의 수학적 좌표는 정답으로 가정하지 않았다.
- **레거시 공식 편입 2개:** `q15-problem`은 B-O-P의 일직선, 원 위 세 점과 접선/반지름 직각, `sinθ=1/4`를 정확한 좌표로 검사하고 각도 **14.48° 근사값**을 제거하여 실제 표기 `θ`만 남겼다. `q22-problem`은 옛 좌표 `AD/DB=9/16`가 **현행 등차 넓이 조건에서 요구하는 AD/DB=2**와 충돌해 A(0,0),B(3,0),C(2,√2),D(2,0)으로 정밀 교정했다. 문제 그림의 설명 필드에는 도출 비율/정답을 노출하지 않았다.
- **q19 해설 플랜의 범위:** 코사인 곡선 전체를 근사해서 그리지 않고, 현행 식에서 정확히 도출한 교점 A,B,C의 **거리·기울기 보조도**만 공식 평면 엔진으로 제작했다. 예시 b=3,a=2√3은 원문과 AB=BC를 엄밀히 만족하며 `planeMarks.equalLengths`에 실제 두 선분을 지정했다.
- **CONTENT_CONFLICT_SOURCE:** 이번 현행 JS 22문항에서 확정된 해설·정답의 자기모순 **0건**. 원본과의 숫자·방향·등차 순서 차이는 별도 출처 충돌로 분류하며 현행 JS를 원본대로 고치지 않는다.
- **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT:** 해당 폴더의 별도 번호 변형 SVG 확인되지 않음. 원본 PNG 차이와 기능 미지원 여부는 서로 독립 판정.

## 공식 실행형 plan·검증 매핑

| JSON | 파싱·Schema/엔진 계약 | Shallow | Full | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 실제 SVG·시각 |
| --- | --- | --- | --- | --- | --- | --- |
| `q14-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q15-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q15-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q18-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q19-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q21-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q22-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q22-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |

- **STATIC_FIELD_PARITY 8/8 PASS:** 캡션·alt·조건 매핑·문제축 답안 비노출 확인. 범위를 좁힌 q19는 **해설용 거리·기울기 보조도**로서 근거와 시각 구성요소가 일치하며, 전체 코사인 곡선의 시각 검수 PASS로 확대해석하지 않는다.
- **DRAWN_FEATURE_PARITY 정적 8/8 PASS:** q14 실제 공통 원 위 네 점·변3,4,5,6·대각선; q15 `rightAngles`·`ON_CIRCLE`·`TANGENT_PERPENDICULAR`·BOC 보조각; q18 `graphPlan`의 **a=12·6주기·수평선 y=1/4·교점 12개**; q19 **실측 AB=BC의 같은 눈금 및 선분 OA,OB**; q21 사인 곡선과 y=1/2의 교점 2개; q22 C,D의 직각과 해설축에서만 AD=2t, DB=t 라벨. 설명문만으로 실제 표시 필드를 대신하지 않았다.
- **독립 SymPy 검산:** q14 네 변 3/4/5/6·A,B,C,D 원 위·면적 6√10; q15 A,B,C 원 위, OC⊥CP, sinθ=1/4; q19 |AB|=|BC|=2 및 a/b=2√3/3; q22 ∠C=90°, CD⊥AB, AD=2DB, AC/AB=√6/3. 나머지 문항도 각 행의 수식과 선택지·답안을 독립 대조했다.
- JSON 파싱 및 공식 Schema·Shallow/Full 검사 **8/8 PASS**. 정적 진위 검산은 SVG 실행 렌더·시각 품질 관측을 대체하지 않는다.
- **Chromium 신규 실행 확인:** 런처 `/usr/bin/chromium` 존재, 실제 `/usr/lib/chromium/chromium` 바이너리 부재, `chromium --version` **exit 127**. 공식 렌더 **0/8**, **RENDER_NOT_RUN 8/8**. SVG 출력·PNG 시각·모바일·A4 시각 확인 모두 **NOT_RUN**.
- **ENGINE_CAPABILITY_PENDING:** 확인된 신규 기능 공백 **없음**. 정적 PASS와 실제 시각 PASS는 분리.
