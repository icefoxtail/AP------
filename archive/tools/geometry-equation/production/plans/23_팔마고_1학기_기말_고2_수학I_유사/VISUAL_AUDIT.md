# VISUAL_AUDIT — 23_팔마고_1학기_기말_고2_수학I_유사

## 범위·정본·대조 증거

- 현행 제작 정본: `archive/exams/similar/high/h2/1final/23_팔마고_1학기_기말_고2_수학I_유사.js`; 22문항, 문제축 22 + 해설축 22 = **44축**.
- 별도 worktree의 출발 최신 원격 main: `8146e5524cab423a1093a0bbe6eeb0850126549f`.
- 독립 판정 합계: **REQUIRED 0 / BENEFICIAL 9 / EXEMPT 35**. 필수 조건은 전부 현행 텍스트로 주어져 REQUIRED 0, 구체적 공간·곡선 이해에 도움 되는 축만 BENEFICIAL.
- 자료: 현행 전 문항 발문·선택지·정답·해설; 대응 `archive/exams/original/high/h2/1final/23_팔마고_1학기_기말_고2_수학I.js`; 기출 q17·q20 PNG와 q01·04·06·17·18·20·21 해설 SVG; 직접 연결 유사 q17·q20 문제 SVG; 레거시 `q17-problem.plan.json`·`q20-problem.plan.json`; 신설 공식 plan 9개. 두 자산 폴더에서 기출 SVG의 `-v2/-v3/-v4` 번호 변형본은 검색했으나 별도 파일 0개.

## 모든 문항의 독립 2축 판정·수학 검산

| 문항 | 문제축: 판정·독립 이유·공식 plan | 해설축: 판정·독립 이유·공식 plan | 독립 수학 검산·정답 |
| --- | --- | --- | --- |
| 01 | **EXEMPT** — sin x≥1/2의 정의역·부등식이 수식으로 완전 | **BENEFICIAL** — 기준선 y=1/2과 사인곡선 교점·윗구간을 직접 대조하면 유익 → `q01-solution.plan.json` | π/6≤x≤5π/6(①) |
| 02 | **EXEMPT** — 등비수열 두 항의 비로 r³=27 결정 | **EXEMPT** — 실수 세제곱근 계산만 필요 | r=3(③) |
| 03 | **EXEMPT** — 유한합의 선형성만 주어짐 | **EXEMPT** — 상수항 −20 계산으로 종료 | 4·6+3·8−20=28(⑤) |
| 04 | **EXEMPT** — 원의 반지름과 ∠A가 문장으로 명시됨 | **BENEFICIAL** — 반지름 8의 원에 내접한 삼각형과 120°의 대변 위치를 시각화 → `q04-solution.plan.json` | BC=2·8·sin120°=8√3(②) |
| 05 | **EXEMPT** — 두 근의 합·곱으로 등차중항을 표현 | **EXEMPT** — α²+β²=58 한 식으로 완료 | k=58/2=29(④) |
| 06 | **EXEMPT** — 두 변의 길이와 끼인 각 수치가 모두 주어짐 | **BENEFICIAL** — 둔각 135°의 대변이 최대이며 코사인법칙으로 a=2를 얻는 배치가 유익 → `q06-solution.plan.json` | b=√10,c=√2,B135°,a=2,넓이1(①) |
| 07 | **EXEMPT** — 삼각함수 항등식과 삼각형 조건이 텍스트로 완전 | **EXEMPT** — 사인법칙·코사인법칙으로 (a−b)(a+b−c)=0 확인 | a=b, 선택③ |
| 08 | **EXEMPT** — 수열 두 항으로 공차를 결정하는 산술 | **EXEMPT** — 양·음 항을 나누어 절댓값 합만 산출 | aₙ=24−5n, 합127(⑤) |
| 09 | **EXEMPT** — 판별식의 부등식과 θ 범위만 문제 | **EXEMPT** — sinθ<−1/2의 구간은 익숙한 각 범위로 계산 가능 | 7π/6<θ<11π/6, 합3π(②) |
| 10 | **EXEMPT** — 짝수·홀수항 합의 등비 비율만 명시 | **EXEMPT** — r=340/170 후 k 결정 | r=2,k=4,합6(④) |
| 11 | **EXEMPT** — 삼각합의 중첩은 대수적 등장횟수만 필요 | **EXEMPT** — k²이 k번 등장함을 수식으로 전개 | ∑₁¹²k³=78²=6084(①) |
| 12 | **EXEMPT** — 저축액 증가율·복리율·개월 수가 문장으로 지정 | **EXEMPT** — 매월 만기액이 같음을 기하급수 항으로 대조 | 3600·1.05=3780만 원(③) |
| 13 | **EXEMPT** — sin t=−1/2만 남는 방정식의 해 개수 문제 | **EXEMPT** — 두 주기에서 해 네 개와 합을 대수로 확인 | t합10π,x합5π,p4,k5,답13(⑤) |
| 14 | **EXEMPT** — 등차수열의 분수항 합을 구하는 질문 | **EXEMPT** — 분모 차분으로 망원합 후 m 부등식 판정 | m/[4(3m+4)]≥5/68→m≥10(②) |
| 15 | **EXEMPT** — Sₙ과 aₙ의 관계가 수식에 주어짐 | **EXEMPT** — 연속한 등식 차분으로 aₙ=3n 유도 | a₁₀₀=300(④) |
| 16 | **EXEMPT** — 복합 사인부등식이 수식과 x 범위로 완결 | **BENEFICIAL** — 치환 t에서 사인곡선과 −1/2 기준선의 해 구간을 직접 보이면 유익 → `q16-solution.plan.json` | −π/6<t<0→π/3<x<π,4α+2β=10π/3(①) |
| 17 | **BENEFICIAL** — 세 현의 길이와 중심각 합 조건은 그림을 통해 원 위 세 점과 중심의 순서를 즉시 파악하면 유익 → `q17-problem.plan.json` | **BENEFICIAL** — △PQS의 둔각과 외접 반지름을 보조도에 표시하면 유익 → `q17-solution.plan.json` | PQ3,QS5,PS7,R²=49/3,cosθ₂=23/98(③) |
| 18 | **EXEMPT** — 삼각형 사인제곱 조건과 넓이가 수식으로 지정 | **BENEFICIAL** — 직각삼각형·빗변 중점 외심·원 반지름의 관계를 보여 주면 유익 → `q18-solution.plan.json` | C90°,tanA1/2,직각변 2√3·4√3,R²=15,외접원 넓이15π |
| 19 | **EXEMPT** — 모든 항이 자연수이고 공차 d≠0이므로 d>0을 계산 | **EXEMPT** — 완전제곱식의 꼭짓점만 산출 | a+3d=24, ad=−3(d−4)²+48→최대48 |
| 20 | **BENEFICIAL** — 세 변·분할비·구하는 선분 위치는 실제 삼각형에 표시하면 도움이 됨 → `q20-problem.plan.json` | **BENEFICIAL** — ∠C의 코사인과 DC=2를 사용한 AD 보조선을 도식화 → `q20-solution.plan.json` | AB9,AC5,BC8,BD6,DC2,cosC1/10,AD=3√3 |
| 21 | **EXEMPT** — 포물선 함수와 두 교점 조건이 수식으로 충분 | **EXEMPT** — 축이 항상 (−1/2,1/2)에 있다는 점을 사용해 f(±1)<0를 식으로 확인 | sinθ<−|cosθ|→5π/4<θ<7π/4,2β−α=9π/4 |
| 22 | **EXEMPT** — 모든 부분합 Sₙ=(n+2)²로 완전 지정 | **EXEMPT** — 차분 후 ∑k²·∑k만 필요 | a₁=9, n≥2:aₙ=2n+3, ∑₁¹⁰kaₖ=939 |

**축 분모 검산:** 문제축 22/22, 해설축 22/22. BENEFICIAL 9축에는 공식 실행형 JSON 9개 일대일 대응, EXEMPT 35축에는 미지원·장식 placeholder plan 없음.

## 기출·레거시·현행 차이와 엄밀 좌표

- **ORIGINAL_EXAM_PNG_CONFLICT / 원본 수치 변형:** 기출 q17 현 길이는 **2·3·4**이나 현행은 **3·5·7**; 기출 q20 AB=**7**·BC=8·CA=5이나 현행은 AB=**9**·BC=8·CA=5. 기출 q01은 cos≤−1/2, 현행은 sin≥1/2; q04 R6→8; q06 b√5→√10; q16 치환 각과 부등식 계수 변화; q18 기출 cos² 항등식·넓이6→현행 sin² 항등식·넓이12. 이전 SVG 숫자·그림을 현행 답의 근거로 채택하지 않았다.
- **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT:** `-v2`, `-v3`, `-v4` 이름 변형의 관련 원본 파일은 0건. 원본 일반 해설 SVG는 별도의 수치 조건을 가진 참고자료로만 사용.
- **q17 레거시 정확도 교정 후 공식 편입:** 기존 원 중심 O 및 P=(−7/2,7√3/6), Q=(−8/7,47√3/21), S=(7/2,7√3/6)는 세 점 모두 R=7√3/3인 원 위이고 PQ=3, QS=5, PS=7을 **SymPy 정확식**으로 만족한다. 기존 중심각 `43.585°`, `76.415°`는 실제 43.5735785965°, 76.4264214035°와 미세하게 다르므로 **정밀 수치로 교정**했다. 중심 O에서 P·Q·S로 이어지는 세 반지름도 실제 렌더 세그먼트로 추가해 θ₁·θ₂·θ₃ 표시를 눈으로 해석할 수 있도록 하였다. 해설용에만 ∠PQS=120°, R=7√3/3을 추가했다.
- **q20 레거시 근사 좌표 교정 후 공식 편입:** 기존 A=(15/2,5), B=(0,0), C=(8,0), D=(6,0)는 AB²=81.25, AC²=25.25로 현행 AB=9, AC=5와 **충돌**한다. 공식 A=(15/2,3√11/2)로 교정하면 AB²=81, AC²=25, BC=8, BD=6, DC=2, AD²=27이 정확하다. 문제 그림은 BD=3u·DC=u만 표시하고 **구하는 AD의 정답을 노출하지 않는다**. 해설축에는 DC2·BD6·AD=3√3을 표시한다.
- **CONTENT_CONFLICT_SOURCE:** 현행 JS 발문·보기·해설·정답을 모두 재계산해 확인한 별도 자기모순 **0건**; 기출 수치 차이 및 기존 레거시 기하 오류는 현행 JS 자체의 오류가 아니다. 시험지 JS는 범위 밖이므로 고치지 않았다.
- **ENGINE_CAPABILITY_PENDING:** 이번 두 대상 중 팔마고에서 새로 확인된 엔진 지원 공백 **0건**. 미실행 렌더는 기능 공백으로 위장하지 않음.

## 공식 JSON plan 실행·정적 검증

| 공식 JSON | JSON parse·Schema/engine contract | Shallow | Full | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY (정적) | 렌더·시각 |
| --- | --- | --- | --- | --- | --- | --- |
| `q01-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q04-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q06-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q16-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q17-problem.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q17-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q18-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q20-problem.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q20-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |

- **공식 JSON 파싱·Schema·엔진 계약 9/9 PASS**, Shallow lint 9/9 PASS, Full lint 9/9 PASS. `sourceConditions`는 현행 q 발문과 바이트 단위 대조하여 계획에 결속.
- **STATIC_FIELD_PARITY 9/9 PASS:** q17·q20 문제 그림의 caption·accessibilityDescription·sourceConditions·newVisualInformation에 정답·풀이 중간값을 쓰지 않았다. q17의 실제 현 길이와 각도, q20의 3:1 내분과 세 변 길이 등 필수 텍스트 필드에 원문을 반영했다.
- **DRAWN_FEATURE_PARITY 9/9 정적 PASS:** q01 sin곡선·기준선, q04 실제 원·반지름·∠120°, q06 실제 삼각형의 135°와 세 변, q16 sin곡선·구간·−1/2 기준선, q17 실제 원·세 현·세 반지름·중심각·길이 라벨, q18 직각·외접원·빗변의 중심, q20 정확한 3:1 내분·세 변·AD 선분 및 해설값을 엔진 필드로 확인. **렌더 이후 눈검수 PASS가 아님**.
- **독립 SymPy 기하 검산:** q04 R8·BC8√3·cosA−1/2; q06 AB√2·AC√10·BC2·cosB−√2/2·면적1; q17 원 반지름 7√3/3 및 현3·5·7; q18 직각변 4√3·2√3과 외접 R√15; q20 AB9·AC5·BC8·BD6·DC2·AD3√3. 다른 산술·함수·수열 문항도 위 표에 각 결과를 독립 기록.
- **Chromium 실제 실행 가능 여부 새 검사:** `/usr/bin/chromium` 런처 존재, 실제 `/usr/lib/chromium/chromium` 없음(`chromium --version` exit **127**). SVG 렌더 **0/9**, **RENDER_NOT_RUN 9/9**, PNG·모바일390px·A4 실물 검수 **NOT_RUN**. 정적 PASS로 실물 PASS를 주장하지 않는다.
