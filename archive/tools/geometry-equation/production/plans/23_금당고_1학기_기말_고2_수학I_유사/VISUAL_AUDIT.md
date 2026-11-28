# VISUAL_AUDIT — 23_금당고_1학기_기말_고2_수학I_유사

## 범위·정본·증거

- 대상 현행 JS: `archive/exams/similar/high/h2/1final/23_금당고_1학기_기말_고2_수학I_유사.js`; 문항 **18**, 문제축 **18**, 해설축 **18**, 총 **36축**.
- 기준: GitHub 최신 `main` `2a84293c1e4f03e639859af033a452e7f2f76057`에서 시작한 전용 worktree. 기출 및 레거시보다 **현행 유사 JS가 정본**.
- 판정: **REQUIRED 0 / BENEFICIAL 16 / EXEMPT 20**. REQUIRED는 텍스트만으로 필수 조건이 빠진 경우이며 이 시험지에는 없음. BENEFICIAL 그림은 공간·곡선·작도 관계를 독립적으로 도와주는 경우에 한정.
- 대조 원시 자료: `archive/exams/original/high/h2/1final/23_금당고_1학기_기말_고2_수학I.js`; `archive/assets/images/23_금당고_1학기_기말_고2_수학I/`의 PNG(`q3,q5,q7,q8,q15,q16,q18`)와 해설 SVG; 동일 stem `_유사/`의 직접 연결 SVG `q05,q08,q15,q16-problem.svg`; `archive/exams/similar/high/h2/1final/23_금당고_1학기_기말_고2_수학I_유사_plans/`의 레거시 4개; 해당 공식 폴더 전부.
- 원본 이미지의 `-v2`, `-v3`, `-v4` 등 번호 변형도 파일명을 검색했으나 **해당 두 이름줄의 원본·유사 자산 폴더에서 별도 변형본 0건**. 변형본을 임의로 정답 근거로 삼지 않았다.

## 전 문항·전 축 독립 판정

| 문항 | 문제축: 판정·독립 사유·공식 plan | 해설축: 판정·독립 사유·공식 plan | 독립 수학 검산 |
| --- | --- | --- | --- |
| 01 | **EXEMPT** — 직접 넓이 공식에 a=8,b=6,C=120°를 대입하며 배치가 조건을 추가하지 않음 | **EXEMPT** — sin120° 대입만 필요 | S=12√3, 선택 ④ |
| 02 | **EXEMPT** — a₂/a₃=3 한 식의 공차 계산 | **EXEMPT** — d=-6이면 a₁₀=−39로 종료 | (15+d)/(15+2d)=3 ⇒ d=−6 |
| 03 | **BENEFICIAL** — 정육각형 ABCDEF와 BC의 중점 M, 구하는 ME 위치가 공간 관계임 → `q03-problem.plan.json` | **BENEFICIAL** — 직교 좌표로 ME의 성분을 비교할 보조선이 유익 → `q03-solution.plan.json` | 한 변 6 ⇒ M=(−9/2,−3√3/2), ME=3√13 |
| 04 | **EXEMPT** — 삼각함수 등식 자체가 도형 위치를 추가 지정하지 않음 | **EXEMPT** — 사인·코사인법칙의 등식으로 b²=a²+c² 판정 | sin A+sin C=sin B(cos A+cos C) ⇒ ∠B=90° |
| 05 | **BENEFICIAL** — 네 변과 ∠CDA의 결합 배치를 확인하는 사각형 필요 → `q05-problem.plan.json` | **BENEFICIAL** — AC=7 대각선으로 △ADC와 △ABC를 분할해 면적 비교 → `q05-solution.plan.json` | AB4·BC7·CD3·DA5·∠D120° 정밀 좌표, 넓이 15√3/4+6√5 |
| 06 | **EXEMPT** — Sₙ 다항식에서 aₙ 차분 계산만 필요 | **EXEMPT** — 4∑k²+∑k 값 대입이 해설의 전부 | a₂ₖ=4k+1, 합 1595 |
| 07 | **BENEFICIAL** — 함수 y=√x 위 네 점을 잇는 사다리꼴 조건을 직접 보여 줌 → `q07-problem.plan.json` | **BENEFICIAL** — 곡선 아래 적분 영역이 아닌 직선으로 잇는 사다리꼴임을 강조 → `q07-solution.plan.json` | Sₖ=(√k+√(k+1))/2, ∑₁¹⁶⁸ 1/Sₖ=24 |
| 08 | **BENEFICIAL** — A-B-C 일직선과 맞은편 P, 두 주행시간·수평거리의 배치 → `q08-problem.plan.json` | **BENEFICIAL** — △PBC 및 △PBA를 잇는 코사인법칙의 관계 유익 → `q08-solution.plan.json` | PB1400,PC1000, AB400,BC600 ⇒ PA1000√3, 시간100√3 |
| 09 | **EXEMPT** — 두 원의 방정식이 원 중심·반지름을 모두 제공하여 문제 해독에 충분 | **BENEFICIAL** — 중심 간 거리와 공통 교점 높이의 독립 대조가 도움 → `q09-solution.plan.json` | aₙ=2−1/(2n²), 합 25/51 |
| 10 | **EXEMPT** — 2와 0이 교대로 나타나는 30자리 숫자 규칙 | **EXEMPT** — 등비합 20∑₀¹⁴100ʲ로 종료 | a₃₀=20(10³⁰−1)/99 |
| 11 | **EXEMPT** — 재귀값 계산으로 상수 항 7 도달 | **EXEMPT** — a₂=−2, a₃=a₄=7로 합 산정 | 7m−16>120 ⇒ 최소 m20 |
| 12 | **EXEMPT** — 명제 ㄱ·ㄴ·ㄷ 모두 수열 대수 비교 | **EXEMPT** — bₙ=3·5ⁿ⁻¹과 차분의 공비 5로 충분 | ㄱㄴ 참, ㄷ 거짓 |
| 13 | **EXEMPT** — 원 반지름과 외부 점의 극단 거리 관계는 문장으로 정확히 정의됨 | **BENEFICIAL** — rₖ±2를 같은 지름 방향으로 도식화하면 도움 → `q13-solution.plan.json` | ∑(Mₖ²+mₖ²)=2(60+45)+80=290 |
| 14 | **EXEMPT** — 귀납증명 빈칸은 분수 부등식 전개 | **EXEMPT** — (3k+2)(3k+4)=(3k+3)²−1 비교 | (가)1/(k+1), (나)<, (다)2/(3k+3) |
| 15 | **BENEFICIAL** — 내부점 P와 세 수선의 발 D,E,F의 위치·직각 확인이 유익 → `q15-problem.plan.json` | **BENEFICIAL** — 세 작은 삼각형의 면적 분할·EFP 관계를 시각화 → `q15-solution.plan.json` | AB8 AC5 BC5; PD2 PE1 PF9/8; EFP=27/80 |
| 16 | **BENEFICIAL** — 원 O와 현 BC 길이·내접 삼각형 관계를 보고 이해 → `q16-problem.plan.json` | **BENEFICIAL** — 최대 조건 b=c일 때만 대칭 구도를 보여 등호 설명 → `q16-solution.plan.json` | R15,BC24; sin A4/5; bc≤720 |
| 17 | **EXEMPT** — |aₙ|=n 및 전체 합 차이로 음항 유일 결정 | **EXEMPT** — 861−855=6에서 a₃만 음수임을 산술로 확인 | ∑₁¹⁰ aₖ=55−6=49 |
| 18 | **BENEFICIAL** — 부채꼴의 내접원 C·접점 P·수선 H의 위치가 여러 겹 → `q18-problem.plan.json` | **BENEFICIAL** — 중심 I·접선 반지름과 반각 삼각형이 계산을 보조 → `q18-solution.plan.json` | cosθ7/25,sinθ24/25, r3/8, OP1/2, OH7/25, 면적42/625 |

**축 합계 교차 검산:** 문제 18/18, 해설 18/18; `BENEFICIAL` 16개 축에는 정확히 1개씩 실행형 JSON plan이 있고, `EXEMPT` 20개 축에는 불필요한 placeholder plan이 없다.

## 원본·레거시와 현행 정본의 구분

- **ORIGINAL_EXAM_PNG_CONFLICT / 숫자 변형:** 기출 q03 정육각형 한 변 **4** → 현행 **6**; q05 변 `AB5,BC6,CD3,DA4` → 현행 `AB4,BC7,CD3,DA5`; q07 합 상한 **120** → **168**; q08 `PB 700m, PC 500m, AB 200m, BC 300m` → 현행 `PB 1400m, PC 1000m, AB 400m, BC 600m`; q09 합 상한 20 → 25; q15 `AB6,PD√13,PE2/3` → `AB8,PD2,PE1`; q16 `R10,BC16` → `R15,BC24`; q18 `cosθ=1/5` → `7/25`. 기출 PNG의 도형을 새 수치의 근거로 오독하지 않음.
- **직접 연결된 유사 SVG는 제작 기준이 아닌 기존 자산 증거:** q05·q08·q15·q16의 SVG `<title>` 및 표시 대상을 대조하였다. 원형 좌표를 그대로 신뢰하지 않고 공식 plan 좌표를 다시 검산했다.
- **레거시 편입 4개:** `q05-problem`의 A,B는 네 변 길이와 각 D를 정확히 맞추는 **근호 좌표**로 고침(옛 근사 좌표를 배제); `q08-problem`은 PB1400·PC1000의 거리 정합성을 확인하고 시간 라벨을 추가; `q15-problem`은 AB8·AC5·세 수선 PD2,PE1과 직각 표식을 독립 검산하여 편입; `q16-problem`은 비대칭 내접점으로 바꿔 문제축에서 최댓값 등호 형태를 예고하지 않음. 해설축의 대칭 최대상황은 별도 plan에만 표시.
- **CONTENT_CONFLICT_SOURCE:** 현행 JS의 18개 문항과 선택지·정답·해설 사이에서 확인된 별도 자기모순 **0건**. q01의 분류 메타데이터가 실제 삼각형 넓이 발문과 어긋나지만 문제 수학의 충돌은 아니며, 범위 밖 JS는 수정하지 않았다.
- **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT:** 해당 자산 폴더의 번호 변형본 미발견. 출처 충돌 유형을 엔진 기능 공백과 혼동하지 않았다.

## 공식 production plan별 검증 증거

| 실행형 JSON | 파싱·공식 Schema/계약 | Shallow | Full | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 실제 SVG·시각 |
| --- | --- | --- | --- | --- | --- | --- |
| `q03-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q03-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q05-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q05-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q07-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q07-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q08-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q08-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q09-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q13-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q15-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q15-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q16-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q16-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q18-problem.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |
| `q18-solution.plan.json` | JSON parse·Schema/engine contract PASS | Shallow PASS | Full PASS | STATIC_FIELD_PARITY PASS | DRAWN_FEATURE_PARITY **정적** PASS | **RENDER_NOT_RUN / 시각 NOT_RUN** |

- **STATIC_FIELD_PARITY:** 모든 plan의 캡션·접근성 설명·sourceConditions·newVisualInformation 및 문제축 답안 비노출을 현행 JS와 개별 대조. **16/16 PASS**.
- **DRAWN_FEATURE_PARITY:** 정적 코드 필드 구성요소의 **16/16 PASS**만 선언. q03 정육각형과 중점 표식·q05 정확한 사변 길이/120°·q07 실제 직선으로 잇는 네 꼭짓점과 직각·q08 시간/거리 구분·q09 두 원·q13 원의 반지름·q15 발 D,E,F와 3개 직각·q16 실제 현과 내접 조건·q18 **부채꼴 외호 `planeMarks.arcs` 및 내접원·접점·수선**을 엔진이 그리는 필드로 지정했다. 설명문만으로 PASS하지 않았다.
- **독립 SymPy 기하 검산:** q03 여섯 변 모두 6, ME=3√13; q05 네 변 4·7·3·5와 cos∠D=−1/2; q08 PB1400·PC1000·PA1000√3; q15 4개 지정 거리와 △EFP=27/80; q16 모든 점 원 위·BC24; q18 cosθ=7/25·원 중심거리5/8·접점거리3/8·△OPH=42/625. 각 항목 별도 수치·기호식 비교 PASS.
- JSON 파싱 + 공식 Shallow/Full lint **16/16 PASS**. 정적 검사는 렌더 성공의 대체 증거가 아님.
- **Chromium:** `/usr/bin/chromium` 런처는 있지만 `/usr/lib/chromium/chromium` 바이너리 부재, `chromium --version` **exit 127**. 공식 실제 렌더 **0/16**, **RENDER_NOT_RUN 16/16**. PNG 실물·모바일·A4 실제 시각 검수 **NOT_RUN**.
- **ENGINE_CAPABILITY_PENDING:** 해당 시험지에서 확인된 신규 기능 공백 **없음**. 정적 lint가 성공한 필드는 실제 그려졌는지 후속 Chromium 환경에서 재검수해야 한다.
