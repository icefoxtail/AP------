# 비상 미적분Ⅰ · 미분 · 대단원 학습 평가 · 고2 — SVG plan 검수

- 대상 JS: `archive/exams/textbooks/비상_미적분1/비상_미적분1_미분_대단원학습평가_고2/비상_미적분1_미분_대단원학습평가_고2.js`
- 원문 Git blob: `92a23cc10a54c5c24e55e8b0edfef41fe7cf7003`; 검토 시작 기준 main: `3233ca045e3bcf39415b717d59224fd312cca9e8`.
- 같은 내용의 `비상교육_미적분1` 폴더 JS·PNG와 Git blob 일치를 확인했다. 기존 시험지 JS·PNG는 수정하지 않는다.
- 14문항 × 문항/해설 2축 = **28축 전수**. 발문·원본 그림·정답·해설을 대조했다(`sourceVsPlan=REVIEWED`).
- 제출하는 `.plan.json` 3개는 production 공식 엔진용이며 `plan-lint.cjs --shallow`/full 모두 PASS. 실패한 시도·EXEMPT·엔진 미지원 표지만 담은 허위 plan JSON은 제출하지 않는다.
- `DRAWN_FEATURE_PARITY=PASS`는 원문 설명과 **실제 렌더 필드의 정적 1:1 대조**이며, SVG 렌더·PNG·학생 화면·A4 실물 확인은 별개로 `NOT_RUN`. `KEEP_ORIGINAL`은 기존 문제 PNG를 유지하며 새 SVG 제작 범위를 늘리지 않는다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 미분평가/q01 | 문항 | EXEMPT | 평균변화율 식 | — | N/A | N/A |
| 미분평가/q01 | 해설 | EXEMPT | 평균변화율 대수 계산 | — | N/A | N/A |
| 미분평가/q02 | 문항 | EXEMPT | 조각함수 미분가능성 | — | N/A | N/A |
| 미분평가/q02 | 해설 | EXEMPT | 연속·좌우미분계수 계산 | — | N/A | N/A |
| 미분평가/q03 | 문항 | EXEMPT | 극한·도함수 | — | N/A | N/A |
| 미분평가/q03 | 해설 | EXEMPT | 극한 연산과 곱미분법 | — | N/A | N/A |
| 미분평가/q04 | 문항 | EXEMPT | 곡선과 평행 접선 방정식 | — | N/A | N/A |
| 미분평가/q04 | 해설 | ENGINE_CAPABILITY_PENDING · 보조도식 | `polynomial-spike-v1` 곡선+접선+수선/직각 | — | NOT_RUN · 프로토타입 full FAIL | ENGINE_CAPABILITY_PENDING · 평행접선 2개·수선 2√2·직각 |
| 미분평가/q05 | 문항 | KEEP_ORIGINAL | `q05.png` (증감 반복 곡선) | — | N/A | ORIGINAL_PNG_REVIEWED · a,b와 다중 굴곡 유지 |
| 미분평가/q05 | 해설 | ENGINE_CAPABILITY_PENDING · 필수 보조선 | 임의 매끄러운 다극값 곡선+평행접선 표식 | — | NOT_RUN | ENGINE_CAPABILITY_PENDING · 할선/접선 네 곳의 평행 관계 |
| 미분평가/q06 | 문항 | KEEP_ORIGINAL | `q06.png` (도함수 곡선) | — | N/A | ORIGINAL_PNG_REVIEWED · −1에서 통과, 4에서 접함 |
| 미분평가/q06 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q06-solution.plan.json` | PASS/PASS | PASS · 원본 부호·중근을 유지한 **대표 함수**임을 명시 |
| 미분평가/q07 | 문항 | EXEMPT | 매개변수와 구간 | — | N/A | N/A |
| 미분평가/q07 | 해설 | EXEMPT | 이차식 근의 위치 조건 | — | N/A | N/A |
| 미분평가/q08 | 문항 | EXEMPT | x+1/x 부등식 | — | N/A | N/A |
| 미분평가/q08 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q08-solution.plan.json` | PASS/PASS | PASS · t≥2, t=3 최소 −54, 축변수 t |
| 미분평가/q09 | 문항 | EXEMPT | 두 점의 위치 식 | — | N/A | N/A |
| 미분평가/q09 | 해설 | EXEMPT | 반대방향 속도 부호 | — | N/A | N/A |
| 미분평가/q10 | 문항 | EXEMPT | 도함수·극한 | — | N/A | N/A |
| 미분평가/q10 | 해설 | EXEMPT | 정의에 따른 극한값 | — | N/A | N/A |
| 미분평가/q11 | 문항 | EXEMPT | 삼차함수 일대일 조건 | — | N/A | N/A |
| 미분평가/q11 | 해설 | EXEMPT | 도함수의 부호 판정 | — | N/A | N/A |
| 미분평가/q12 | 문항 | EXEMPT | 두 곡선 교점·매개변수 | — | N/A | N/A |
| 미분평가/q12 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q12-solution.plan.json` | PASS/PASS | PASS · 극대/극소, 0/27 경계선, 내부 표본 a=10 |
| 미분평가/q13 | 문항 | EXEMPT | 우유 판매 최적화 수식 | — | N/A | N/A |
| 미분평가/q13 | 해설 | EXEMPT | 수익 함수 미분·최적화 | — | N/A | N/A |
| 미분평가/q14 | 문항 | KEEP_ORIGINAL | `q14.png` (반구 용기) | — | N/A | ORIGINAL_PNG_REVIEWED · 반지름10·점선·직각·필수 물 색칠 유지 |
| 미분평가/q14 | 해설 | ENGINE_CAPABILITY_PENDING · 입체 수면 | `solid-figure-v1`/`container-fill-figure-v1` 확장 필요 | — | NOT_RUN · 엔진 capability 거절 | ENGINE_CAPABILITY_PENDING · 아랫점 반구·수면 단면·r,h,10·직각·물면 |

## capability 인계: 현재 지원되지 않는 3개 해설 도식

1. **q04 해설:** 풀이의 접점 A(1,−2), B(−1,4), 두 기울기 −1 접선 `y=−x−1`, `y=−x+3`, 수선 A–H(3,0), 직각 H 및 길이 `2√2`의 **정량 도형**이 필요하다. 공식 `polynomial-spike-v1` 프로토타입은 full에서 `OVERVIEW_LEFT_ARM_TOO_NARROW`·`OVERVIEW_ODD_ROOT_DOES_NOT_CROSS_AXIS`·`OVERVIEW_RIGHT_ARM_TOO_NARROW`, 단일 조각 `piecewise-polynomial-spike-v1`은 `equalUnits` 미지원(`PIECEWISE_POLY_FIELD_UNKNOWN:equalUnits`) 및 근접 표식 해상도(`PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION`)로 실패했다. 곡선과 두 직선의 동등 눈금, 밀집한 극점/접점, 길이·직각을 함께 표현하는 엔진/관측기 보강 후 새 계획을 작성한다. 해설 텍스트는 완결되므로 문제 축에 잘못된 그림을 끼워 넣지 않는다.
2. **q05 해설:** 기존 문제 PNG는 굴곡이 많은 임의의 매끄러운 곡선이며 수식을 제시하지 않는다. ​`a<b`의 할선과 그에 평행한 **서로 다른 네 점의 접선**을 원본과 1:1로 표현해야 한다. 미지원 기능은 임의 매끄러운 다극값 곡선의 정확한 트레이싱, 지정 위치 접선 및 기울기 평행 표식이다. 기존 PNG는 대체하거나 손 SVG로 덧칠하지 않는다.
3. **q14 해설:** 반구(반지름 10)의 꼭짓점이 아래로 향한 물그릇에서 높이 `h=t`, 수면 반지름 `r`, 피타고라스 직각, 가상 반지름 점선, 물이 채워진 곡면과 수평 단면이 필요하다. 공식 `solid-figure-v1`의 `HEMISPHERE`+`APEX_DOWN`+`LEVEL`은 `SOLID_SECTION_UNSUPPORTED`; `container-fill-figure-v1`의 둥근 단면은 `CONTAINER_CURVED_PROFILE_UNSUPPORTED`. `APEX_DOWN` 수면 교차와 곡면 물 채움, 길이·각도 라벨 기능을 갖춘 뒤 재검수한다. **원본 q14.png의 파란 물 색칠은 의미 있는 채움**이므로 삭제하지 않는다.

## 공통 품질 판단 및 후속

- 작성된 세 해설 plan에는 흰색 기본 배경이나 영역 채우기 요청이 없다. 그려져야 할 점·라벨·수평선·도함수 부호는 수식과 대조했다. q06의 계수 배율은 원문이 식을 특정하지 않아 선택한 대표값이며 **원본의 확정 계수로 주장하지 않는다**.
- 도형 설명을 캡션에만 써서 누락된 선/각을 PASS 처리하지 않았다. 세 `ENGINE_CAPABILITY_PENDING`은 plan 수와 parity PASS에 **포함하지 않는다**.
- `render/PNG/student/A4=NOT_RUN`: 실제 SVG 렌더·화면 확인·원본 연결·운영 게시 후 검수는 별도 렌더/게시 담당에서 수행한다.
