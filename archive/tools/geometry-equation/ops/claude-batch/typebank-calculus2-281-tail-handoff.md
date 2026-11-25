# 고2 유형은행 미적분II 281–287: 마지막 `[그림:]` 17건 plan 인계

작업일: 2026-11-26 KST. 담당 범위는 `archive/exams/types/high/h2/`의 고2 **문제 그림(plan) 축**으로만 한정하였다. 최신 main의 직전 #3121(273/q04–280/q05)을 제외하고 동일 원문과 열린 중복 PR을 확인했다. **시험지·교과서·원본 JS·이미지 자산·기존 plan은 수정하지 않았다.**

## 분모와 실제 결과

- 남은 `[그림:]` 전수: 281의 q01–q15 **15**, 282의 q01 **1**, 287의 q01 **1** = **17**. 283–286에는 `[그림:]` 없음. 요청한 배치 하한 20개에 도달할 수 없어 범위를 늘리거나 없는 qid를 만들지 않고 마지막 17개로 종료했다. **QUEUE_EXHAUSTED**.
- 생성 JSON: **17개**, 그중 **엔진에서 실행 가능한 부분 plan 4개**(281/q02 `construction-spike-v1`, q06 `multi-curve-figure-v1`, q13·q15 `construction-spike-v1`), **UNSUPPORTED 상태 인계 13개**. 상태 파일을 실사용 그림으로 집계하지 않는다.
- 공식 `plan-lint.cjs --shallow`: **17/17 OK, 0 FAIL**. 공식 `plan-lint.cjs` full: **17/17 OK, 0 FAIL**. 엔진이 명시적으로 `UNSUPPORTED`인 13건은 실제 내부 그림 모델을 검사한 것이 아니라 상태를 인식한 `OK(note: UNSUPPORTED)`이며, **실행 가능 plan의 shallow/full은 각각 4/4**이다.
- 원문–필드/수학 독립 대조 `SOURCE_VS_PLAN_REVIEWED`: **17/17**. 출처 `[그림:]` 바이트, 좌표·반지름·원호의 방향·함수 계수·영역 x범위와 점별 필드 존재 여부를 확인했다.
- `DRAWN_FEATURE_PARITY`: **PASS 0 / ENGINE_CAPABILITY_PENDING 17**. 계획 속 원·곡선만 맞는 것은 변하는 입체 단면 전체가 실제로 보인다는 뜻이 아니다.
- SVG/PNG 렌더, 학생화면, A4, JS `image` 연결, 최종 게시: **NOT_RUN**, 안티그래비티/엔진 라인 후속. 풀 린트가 이 단계를 대체하지 않는다.

### 문항별 인계표

공통 계획 폴더 접두어: `archive/tools/geometry-equation/production/plans/`. 아래 `281`, `282`, `287`은 각각 정확한 원본 JS stem을 뜻하며 파일 확장자는 `qNN-problem.plan.json`이다. 모든 행은 `축=문제`, `판정=REQUIRED`, `lint=shallow PASS/full PASS`, `DRAWN_FEATURE_PARITY=ENGINE_CAPABILITY_PENDING`; 해설 축은 이번 작업에서 판정하거나 제작하지 않았다.

| 원문/qid | capability / 상태 | 실제로 그리는 필드와 남은 독립 필수 조건 |
|---|---|---|
| 281/q01 | `UNSUPPORTED` | `√(6sin x)` 비대수 밑면 + 가변 정삼각형의 3D 단면 미지원 |
| 281/q02 | `construction-spike-v1` **PARTIAL** | 원 중심 (0,0)·반지름 3·A(-3,0)·B(3,0)·x=0 현 실재. 일반 x 현과 공간 이동 정삼각형 `MOVING_EQUILATERAL_SECTION_EXTRUSION_3D` 미지원 |
| 281/q03 | `UNSUPPORTED` | 역제곱근 곡선 위 P와 Q, 가변 정사각형 입체 |
| 281/q04 | `UNSUPPORTED` | `√(x(4−x²))` 곡선과 가변 정삼각형 단면 |
| 281/q05 | `UNSUPPORTED` | `√(2e^x+1)` 합성 근호 및 가변 정사각형 단면 |
| 281/q06 | `multi-curve-figure-v1` **PARTIAL** | `y=±√(2x+1)` 두 곡선·`0≤x≤4` 밑면 영역은 실제 `curves[0..1]` 및 `regions[0]`. **3차원** 정사각형 단면과 변 길이 표시 미지원 |
| 281/q07 | `UNSUPPORTED` | 높이 `0≤x≤4`에 따라 직각변 `√(16−x²)`인 직각이등변삼각형의 공간 단면 |
| 281/q08 | `UNSUPPORTED` | `tan(2x)`의 `0≤x≤π/6` 내부 pole 없는 제한 구간과 공간 단면 |
| 281/q09 | `UNSUPPORTED` | `√((2x+1)e^x)`의 합성 곡선과 정사각형 단면 |
| 281/q10 | `UNSUPPORTED` | 미지수 `k>0`인 `√(kx/(x²+1))`와 정사각형 단면. 정답 k 값 노출 금지 |
| 281/q11 | `UNSUPPORTED` | `2√(xsin x)`와 PQ를 지름으로 하는 가변 반원 단면 |
| 281/q12 | `UNSUPPORTED` | 직각 접힘 두 평면, `Q(x,2sin x,0)`·`R(x,0,x)`를 잇는 가변 직각삼각형 |
| 281/q13 | `construction-spike-v1` **PARTIAL** | 단위원 `x²+y²=1`·x축 지름·x=0 세로 현만 실재. 일반 x의 **정사각형에서 내접원 제거한 구멍** 단면 미지원 |
| 281/q14 | `UNSUPPORTED` | `√(3x²sin(x³))`, 우단 `∛π`, 가변 정삼각형 단면 |
| 281/q15 | `construction-spike-v1` **PARTIAL** | 왼쪽 반지름1 사분원·오른쪽 반지름2 사분원, x=0 대표점 P와 수선 PH·직각 표시 실재. **(0,2) 열린 점 링**·P/H의 이동·3D 정사각형 미지원 |
| 282/q01 | `UNSUPPORTED` | `v(t)=πcos(πt/2)`, 정확한 ±π 진폭과 9개 지정점. 삼각 엔진 `coefficients`에서 진폭 π 거절; 진폭1로 대체하면 발문 식이 달라짐 |
| 287/q01 | `UNSUPPORTED` | 사이클로이드 한 주기·수평선 y=3·A/B·해당 곡선호 강조. 파라미터식 곡선 미지원 |

## 그림 완성 전 엔진 보강 요청

1. `VARIABLE_CROSS_SECTION_SOLID_3D`: xy 밑면 곡선을 정확한 식으로 그리고 각 x에서 규격이 달라지는 정삼각형·정사각형·직각이등변삼각형·반원을 공간 단면으로 표시. 281/q01–q12·q14·q15에 걸친 공통 기능. 함수 합성·초월·미지 k 및 삼각함수 정의역도 그대로 받아야 한다.
2. `VARIABLE_SQUARE_MINUS_INSCRIBED_CIRCLE_SECTION_3D`: 281/q13은 단면 내부의 진짜 관통 구멍 필요. 평면 원만 렌더하면 수학적 의미가 없다.
3. `PIECEWISE_SEMICIRCLE_OPEN_CLOSED_ENDPOINTS`: 281/q15의 x=0에서 f(0)=1 닫힘, 오른쪽 한계값 2 열린 점 표시. `P,H`는 현재 x=0만 보여 준다.
4. `TRIGONOMETRIC_PI_AMPLITUDE`: 282/q01은 코사인 진폭이 단순 수 1이 아닌 **π**이고, (2,-π),(4,π) 등 정확 좌표가 눈에 보여야 한다.
5. `CYCLOID_PARAMETRIC_CURVE`: 287/q01은 x=2(t−sin t),y=2(1−cos t) 전체 호, y=3와 두 교점 및 강조 구간이 동일 그래프에서 관측 가능해야 한다.

엔진 기능이 들어가면 **모든 17 qid의 DRAWN_FEATURE_PARITY를 다시 판정**하고 공식 엔진 render→실제 SVG 관측→PNG→학생 화면/A4→JS 연결·게시를 별도 검수한다. 현행 부분 도식을 `PASS`로 승격하지 않는다.

## 원본 SHA-256 (JS 불변)

| 파일 | SHA-256 |
|---|---|
| 미적분II_281 | `bef5bddc35efbd1786002b3910f7f8c3c426cf688e6b8caba66dbb8fc4a17671` |
| 미적분II_282 | `8048750ec4d611211863a5ec49bec7658c1b472f1d42e5bbe7e9a884561719c4` |
| 미적분II_287 | `c0f0483acf3003d1ef5cfd2672595ca5a8dbc5eaf4f2a120a7049de4fc527ca1` |

후속 큐: **남은 미적분II `[그림:]` 없음(281–287 소진)**. 기하 유형군 및 이전 미적분II의 미완료 엔진 보강은 별도 예약 작업이다.
