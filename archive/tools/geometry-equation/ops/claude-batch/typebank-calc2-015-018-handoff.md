# 고2 유형은행 미적분Ⅱ 015–018 · 원문 대조·실행 플랜 인계

- 날짜: 2026-11-26 KST. 작업 착수 main `1642a637b6f3ca597396398edc96fd7966d62fe3`, PR 제출 직전 최신 main에 리베이스한 기준 SHA `4af534baa8e1b229941a825b5aa761c3c4b7e438`. 직전 동일 담당 PR #3079(009–013), 014번 JS 없음.
- 범위: `archive/exams/types/high/h2/` 4개 JS·20문항·문제/해설 40축. 실제 `[그림:]` 11개. 계획 11개, EXEMPT 29축.
- 원본 JS·시험지·교과서 미수정. 원본 source SHA256:
  - `미적분II_015_거짓인수열의극한의진위판단_고2_유형은행1.js`: `a35902458ec7775f7bbeafc36bc1beb0d1eb8743349f326a0d6f2502c73b94b2`
  - `미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1.js`: `ab8c43736454cfa41376fc480a0295274985b14c238a65eefe41b1d757c71523`
  - `미적분II_017_∞-∞꼴의수열의극한의활용_고2_유형은행1.js`: `93aefde5d617de6cf1d312e78e1899478c0d8f87a476d35713bee88a607e3968`
  - `미적분II_018_내접원에관한수열의극한의활용_고2_유형은행1.js`: `075e79039f00cac56f100851c67e29f611e3de85ad8e0aa83e4e60b1d6b61556`

## 그림 원문 ↔ DRAWN_FEATURE_PARITY (캡션 대신 실제 렌더 필드 확인)

| qid | 원문 조건 → 실제 그려지는 필드와 독립 계산 | 판정 |
| --- | --- | --- |
| 16/02 | 포물선식→`pieces[0]`; x=n,n+2 곡선 위 P,Q→`overlays.points[0..1]`; 직선 PQ→`overlays.lines[0]`; n=2: P(2,-2),Q(4,-20),y=-9x+16. | **PASS** |
| 16/04 | y=2x²→`pieces[0]`; 접점→`points[0]`; 기울기 4n 접선→`lines[0]`; 두 축 절편→`points[1..2]`,`segments[0]`. n=2: 접선 y=8x−8. | **PASS** |
| 16/05 | 원점 O·P→`points[0..1]`; y=3nx→`pieces[0]`; 수직선→`lines[0]`; Q→`points[2]`; 직각 표식→`rightAngles[0]`. n=1: P=(2,6),Q=(20,0), 내적 0. | **PASS** |
| 16/06 | x+y=4→`pieces[0]`; 두 번째 직선→`lines[0]`; Pₙ→`points[2]`,`callouts[0]`; O,A→`points[0..1]`; △OAPₙ→`polygons[0]`. n=1: P=(8/5,12/5). | **PASS** |
| 16/07 | 원→`circles[0]`; 제1사분면 접점→`points[1]`; 접선→`pieces[0]`; OT 수직 표식→`segments[0]`,`rightAngles[0]`; 두 양의 절편→`points[2..3]`; △OAB→`polygons[0]`. n=1: 3x+4y=25. | **PASS** |
| 16/08 | 원 중심 O·반지름3n→`circles[0]`; 기울기 2n의 접선→`pieces[0]`; 제2사분면 T→`points[1]`; 직각 표식→`segments[0]`,`rightAngles[0]`; x/y절편→`points[2..3]`. n=1: y=2x+3√5. | **PASS** |
| 16/09 | 중심 C·반지름 n→`points[1]`,`circles[0]`; O→`points[0]`; 접선 y축·V→`points[2]`,`segments[2]`; 다른 접선·T→`pieces[0]`,`points[3]`; 두 수직 반지름→`segments[0..1]`,`rightAngles[0..1]`. n=1: y=3x/4. | **PASS** |
| 17/01 | 원 x²+y²=4n²→`circles[0]`; (-2n,0)에서 시작하는 근호곡선→`curves[0].radicand`,`domain`; 두 교점→`points[0..1]`; 현→`segments[0]`. n=2: (-4,0),(2,2√3), 두 식 검산. | **PASS** |
| 17/03 | 제1사분면 3n/x→`curves[0]`; 4−x/n→`curves[1]`; x=n,3n 교점→`points[0..1]`; 연결 선분→`segments[0]`. n=2: (2,3),(6,1). | **PASS** |
| 18/01 | O,Pₙ,Qₙ→`points[0..2]`,`callouts[0..1]`; 직각삼각형 세 변→`pieces[0]`,`segments[0..1]`; Q 직각→`rightAngles[0]`; 세 변 접원→`circles[0]`. n=2: 중심(1+√13,5−√13), 반지름5−√13, 세 변 거리 동일. | **PASS** |
| 18/02 | O,Aₙ,Bₙ→`points[0..2]`,`callouts[0..1]`; 직각삼각형→`pieces[0]`,`segments[0..1]`,`rightAngles[0]`; 내접원·Cₙ→`circles[0]`,`points[3]`,`callouts[2]`; △OAₙCₙ→`polygons[0]`,`segments[2..3]`. n=2: 중심(3,1), 반지름1, 세 변 거리 동일. | **PASS** |

대표 도식은 모두 실제 방정식을 만족하는 **n=1 또는 2**를 사용한다. `caption`·`accessibilityDescription`·`sourceConditions`·`newVisualInformation`에 일반 n과 대표값의 차이, 조건→필드, 추가 기호를 명시했다. 미지 극한값·답은 문제 그림에 노출하지 않았다. 대수 관계, 원 중심–접선 거리, 직각 내적, 세 접변 내심 거리 등 11묶음 SymPy 독립 검산 PASS.

## 문항별 두 축 총괄 (40행)

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 15/01 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/01 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 15/02 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/02 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 15/03 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/03 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 15/04 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/04 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 15/05 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/05 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 15/06 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 15/06 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/01 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 16/01 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/02 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q02-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/02 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/03 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 16/03 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/04 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q04-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/04 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/05 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q05-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/05 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/06 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q06-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/06 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/07 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q07-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/07 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/08 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q08-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/08 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 16/09 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1/q09-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 16/09 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 17/01 | 문제 | **PLAN** | `multi-curve-figure-v1` | `archive/tools/geometry-equation/production/plans/미적분II_017_∞-∞꼴의수열의극한의활용_고2_유형은행1/q01-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 17/01 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 17/02 | 문제 | **EXEMPT** (원문 그림 없음) | — | — | N/A | N/A |
| 17/02 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 17/03 | 문제 | **PLAN** | `multi-curve-figure-v1` | `archive/tools/geometry-equation/production/plans/미적분II_017_∞-∞꼴의수열의극한의활용_고2_유형은행1/q03-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 17/03 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 18/01 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_018_내접원에관한수열의극한의활용_고2_유형은행1/q01-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 18/01 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |
| 18/02 | 문제 | **PLAN** | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/미적분II_018_내접원에관한수열의극한의활용_고2_유형은행1/q02-problem.plan.json` | shallow **PASS** / full **PASS** | **PASS** |
| 18/02 | 해설 | **EXEMPT** (대수·극한 전개, 별도 시각 지시 없음) | — | — | N/A | N/A |

## 실행·미지원·후속 분리

- `plan-lint.cjs --shallow`: **11/11 PASS**. 공식 `plan-lint.cjs` full: **11/11 PASS**. 실행 환경의 글꼴은 고정 NotoSansKR, 런타임 의존성은 offline npm 잠금 설치. 특정 엔진 기능 미지원 `ENGINE_CAPABILITY_PENDING`: **0축**.
- 원문 조건별 필드 매핑은 위 표에 대조. 그려진 이름의 수열 아래첨자는 그래프 기본 `pointNames` 대신 엔진 `overlays.callouts[].text`로 실물 글자에 매핑했다.
- 실제 **SVG/PNG 렌더·학생 화면·A4 시각검수 = NOT_RUN**. 플랜 린트가 렌더 배치까지 합격시킨다는 뜻은 아니다. 안티그래비티가 정식 엔진으로 렌더하고 레이아웃·표식 최종 검수 후 JS에 연결한다.
- 운영 결과는 본 PR 병합 후 별도 main SHA로 입증한다. 잔여 미적분Ⅱ 유형군은 019부터.
