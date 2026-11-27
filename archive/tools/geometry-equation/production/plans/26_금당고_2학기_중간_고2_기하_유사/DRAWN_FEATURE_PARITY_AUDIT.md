# 26_금당고_2학기_중간_고2_기하_유사 — DRAWN_FEATURE_PARITY 축별 검수

검수일: 2026-11-27 · 원문: `archive/exams/similar/high/h2/2mid/26_금당고_2학기_중간_고2_기하_유사.js` · 공식 플랜: `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/`

- 각 qid의 **문항(problem)**·**해설(solution)** 축을 독립 판정했다. EXEMPT는 해당 축에 별도의 그림을 더해도 풀이 정보가 늘지 않는다는 판단이다.
- 원본 이미지 에셋은 `archive/assets/images/26_금당고_2학기_중간_고2_기하/`의 PNG를 열어 보고, 해당 원문 이미지·수식·해설의 의미 요소(점, 선, 수선, 축값, 곡선, 영역)를 대조했다. 유사 SVG의 수치는 변형 문제에 맞추었다.
- 플랜 행의 **STATIC_SPEC_MATCH**는 소스–계획의 구조·스펙 1:1 점검이다. **실물 픽셀 1:1 PASS가 아니다.** 로컬 Chrome 바이너리가 없어 `RENDER_NOT_RUN`; 렌더 화면의 충돌·가독성은 미확인이다.
- `ellipse-figure-v1`과 `solid-figure-v1` 엔진에 배경 흰색 `<rect fill="#fff">`가 강제되어 투명 배경은 **ENGINE_CAPABILITY_PENDING / TRANSPARENT_BACKGROUND_OPTOUT**이다. 수동 SVG 수정은 하지 않았고, 불필요한 면 채움은 플랜에서 제거했다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_금당고_2학기_중간_고2_기하_유사.js / q01 | 문항 | EXEMPT: 타원 장축 길이 공식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q01 | 해설 | EXEMPT: 타원 장축 길이 공식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q02 | 문항 | EXEMPT: 쌍곡선 주축 길이 공식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q02 | 해설 | EXEMPT: 쌍곡선 주축 길이 공식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q03 | 문항 | EXEMPT: 포물선 초점–준선의 수치 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q03 | 해설 | EXEMPT: 포물선 초점–준선의 수치 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q04 | 문항 | EXEMPT: 표준형 완전제곱·초점 이동 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q04 | 해설 | EXEMPT: 표준형 완전제곱·초점 이동 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q05 | 문항 | EXEMPT: 타원 표준형과 초점좌표 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q05 | 해설 | EXEMPT: 타원 표준형과 초점좌표 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q06 | 문항 | EXEMPT: 발문은 두 점근선과 y=3의 식만 주어짐 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q06 | 해설 | 두 점근선 점선과 y=3 교점·삼각형 변·밑변 보완 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q06-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q07 | 문항 | EXEMPT: 발문은 타원과 주어진 점의 식으로 충분 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q07 | 해설 | 타원 위 P 접선과 x절편 A를 신규 구성 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q07-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q08 | 문항 | EXEMPT: 두 접선 기울기의 곱을 대입으로 풂 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q08 | 해설 | EXEMPT: 두 접선 기울기의 곱을 대입으로 풂 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q09 | 문항 | 원본 숨은 모서리·A~H 라벨과 AF·BD 선분을 3D 모델로 보존 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q09-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q09 | 해설 | 빠졌던 BD∥FH 보조 대각선, 정삼각형 AFH의 세 변 보완 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q09-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q10 | 문항 | EXEMPT: 외부 점과 포물선 접선 방정식 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q10 | 해설 | 외부 T의 두 접선과 접점 P,Q를 신규 구성 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q10-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q11 | 문항 | 열 개의 선분으로 꺾인 포물선과 근사점 대신 실제 포물선+정확한 무게중심 좌표 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q11-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q11 | 해설 | 준선 y=-3, 수선 AH/BI/CJ, 초점 연결 및 직각표식 신규 구성 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q11-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q12 | 문항 | 가짜 평면좌표 대신 변 2의 실제 정사각뿔·H 수선·직각·숨은 모서리 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q12-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q12 | 해설 | 밑면 중심 O, AO 수선, OH∥BC·OH=1와 두 직각표식 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q12-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q13 | 문항 | 타원·포물선의 교점 P(4,-2√3)와 두 곡선 보존 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q13-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q13 | 해설 | 교점 P에서 두 곡선에 각각 접선을 추가하고 기울기 관계 가시화 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q13-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q14 | 문항 | 포물선 P의 접선, 수직인 l, Q/R 및 직각 H 보존 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q14-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q14 | 해설 | QR을 강조하고 접선–수선–교점 라벨을 분리 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q14-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q15 | 문항 | EXEMPT: 타원 두 초점·원까지 거리의 대수적 부등식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q15 | 해설 | EXEMPT: 타원 두 초점·원까지 거리의 대수적 부등식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q16 | 문항 | 네 교점 P/Q/R/S 및 F,F′, QS 공선과 사각형 윤곽; 불필요한 LIGHT 면 채움 삭제 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q16-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q16 | 해설 | EXEMPT: 사각형 대칭과 길이 합·차의 계산은 발문 윤곽 활용 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q17 | 문항 | EXEMPT: 발문에서 타원 접선의 축절편만 정의 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q17 | 해설 | 최소 넓이 접점과 x/y절편, 삼각형 세 변 추가 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q17-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q18 | 문항 | EXEMPT: 발문에서 포물선과 세 직선만 정의 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_금당고_2학기_중간_고2_기하_유사.js / q18 | 해설 | 준선·접선·y=8 교점과 직각삼각형 세 변 보완 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q18-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q19 | 문항 | 발문에서 최적점 좌표·가상의 AB 점선이 먼저 드러나던 문제 수정, 일반 P로 교체 | multi-curve-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q19-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q19 | 해설 | 준선 x=-15, 수선 PH, 일직선 B-P-H, 초점 A의 거리 관계 보완 | multi-curve-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q19-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q20 | 문항 | 타원 접점 P/Q, A, R/S 및 OP/OQ와 두 접선 보존 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q20-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_금당고_2학기_중간_고2_기하_유사.js / q20 | 해설 | 마름모의 두 대각선 OA/PQ와 중점 H, 접선·축 교점 보완 | ellipse-figure-v1 | `archive/tools/geometry-equation/production/plans/26_금당고_2학기_중간_고2_기하_유사/q20-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |

## 원본 PNG 대조 인벤토리

- q09: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q9.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q11: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q11.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q12: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q12.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q13: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q13.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q14: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q14.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q16: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q16.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q19: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q19.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q20: `archive/assets/images/26_금당고_2학기_중간_고2_기하/q20.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.

## 검수 결론

- 문항 20개, 축 40개 전수 판정. 실행 가능한 production plan 20개, 구조적 플랜 보류 0개.
- **plan-lint**: 위 계획에 대하여 shallow·full 전부 통과 (개별 프로세스 full 검증; 단일 대용량 프로세스 OOM 방지).
- **DRAWN_FEATURE_PARITY**: 의미 요소 정적 대조 완료; Chrome 부재로 렌더 기반 1:1 픽셀 비교 미실행.
- 필수 후속 기능: `TRANSPARENT_BACKGROUND_OPTOUT`(타원·입체 엔진의 흰 배경 rect 비활성화).
