# DRAWN_FEATURE_PARITY — 비상교육 기하 벡터 익힘책 고2

- 기준: 2026-11-27 최신 `main` 시작 SHA `30f066de1198d1ac35a456525db220882f2f7ee3`; 원문 JS: `archive/exams/textbooks/비상교육_기하/비상_기하_벡터_익힘책_고2/비상_기하_벡터_익힘책_고2.js`.
- 26문항 / 문항·해설 **52축 전수 판정**. 원본 q02,q03,q06,q07,q08,q12.png **6장 개별 시각 대조**. (원본 PNG 수는 6장이다.)
- 실제 실행 가능 계획 18축; 식만으로 완결되는 29축 EXEMPT; 현재 엔진이 그림 관계를 지원하지 않는 5축 ENGINE_CAPABILITY_PENDING. 계획 2축(q02 문제·해설)은 현행 엔진 정적 SVG 관측 실패이므로 제작 품질 미완이다.
- `FIELD_1:1_REVIEWED`는 발문·해설·원본 PNG의 점·라벨·선·점선·벡터·길이·직각 표식과 계획의 그려지는 필드를 대조했다는 뜻이다. 렌더된 SVG/PNG/학생 화면 `DRAWN_FEATURE_PARITY=PASS`를 뜻하지 않는다.

| qid | 축 | 판정 | 원본·발문·해설 대비 도형 특징 1:1 점검 및 면제 근거 | capability / 미지원 기능 | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|---|
| 01 | 문항 | EXEMPT | 네 점 A B C D에 관한 다섯 벡터식 보기 — 다섯 보기는 결합법칙·역벡터·영벡터만으로 완결되어 임의 배치가 불필요하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 01 | 해설 | EXEMPT | 상쇄·결합 규칙으로 영벡터와 나머지 벡터 판별 — 다섯 보기는 결합법칙·역벡터·영벡터만으로 완결되어 임의 배치가 불필요하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 02 | 문항 | REQUIRED | q02.png: 직각이등변삼각기둥 ABC/DEF, B·E 직각, AB=BC 두 눈금, 후면 DF 점선 | ENGINE_CAPABILITY_PENDING: 정삼각기둥 동변 2줄 눈금의 독립 정적 관측 실패 SOLID_EQUAL_MARK_NOT_AT_MIDDLE:eq1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q02-problem.plan.json` | PASS/PASS | PENDING(STATIC_AUDIT_FAIL) |
| 02 | 해설 | BENEFICIAL | BA,ED가 AB 역벡터; 두 평행한 삼각형 밑면 위의 12개 수직 벡터 | ENGINE_CAPABILITY_PENDING: 정삼각기둥 동변 2줄 눈금의 독립 정적 관측 실패 SOLID_EQUAL_MARK_NOT_AT_MIDDLE:eq1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q02-solution.plan.json` | PASS/PASS | PENDING(STATIC_AUDIT_FAIL) |
| 03 | 문항 | REQUIRED | q03.png: 정사각형 ABCD의 두 대각선과 중앙 O | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q03-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 03 | 해설 | BENEFICIAL | BD 대각선 벡터가 길이 √2로 다섯 보기 중 최대 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q03-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 04 | 문항 | EXEMPT | 두 비평행 벡터 a,b의 선형독립 일차결합식 — a,b 독립성에 의한 계수비교만 있어 도식은 추가 수학 정보를 제공하지 않는다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 04 | 해설 | EXEMPT | a,b의 두 계수를 연립해 m,n 확정 — a,b 독립성에 의한 계수비교만 있어 도식은 추가 수학 정보를 제공하지 않는다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 05 | 문항 | EXEMPT | 서로 평행하지 않은 두 벡터의 k배 평행 조건 — 독립 기저에서 계수 두 쌍의 비례만 검사하면 충분하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 05 | 해설 | EXEMPT | 평행할 때 두 계수쌍이 비례한다는 계산 — 독립 기저에서 계수 두 쌍의 비례만 검사하면 충분하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 06 | 문항 | REQUIRED | q06.png: 평행사변형 ABCD, AD의 중점 E와 눈금, DB를 1:2 내분하는 F, a/b 화살표 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q06-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 06 | 해설 | BENEFICIAL | E,F,C의 공선 관계, EC=(3/2)FC와 벡터 방향 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q06-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 07 | 문항 | REQUIRED | q07.png: 가로 여섯 평행선과 비스듬한 아홉 평행선, O/P/Q/R 교점 배치 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q07-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 07 | 해설 | BENEFICIAL | 격자 P=(-3,1),Q=(4,4),R=(-2,3)와 OP/OQ/OR의 방향 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q07-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 08 | 문항 | REQUIRED | q08.png: 삼각형 AB6 AC9 BC10, 세 길이 지시선, 정확히 내접한 원과 중심 I, AI 화살표 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q08-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 08 | 해설 | BENEFICIAL | 두 각 이등분선이 만나는 I, AI의 계수 9/25와 6/25 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q08-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 09 | 문항 | EXEMPT | 삼각형 ABC와 가중 벡터식으로 P의 위치를 다섯 보기에서 판별 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 09 | 해설 | BENEFICIAL | 변 AB의 AP:PB=1:2 내분점 P를 실제 선분 위에 표시 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q09-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 10 | 문항 | EXEMPT | 공간벡터 a=(1,3,-2),b=(0,-1,4) — 주어진 3차원 성분의 합과 제곱합만 계산한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 10 | 해설 | EXEMPT | 성분 합 a+2b와 3D 노름을 산술로 계산 — 주어진 3차원 성분의 합과 제곱합만 계산한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 11 | 문항 | EXEMPT | 좌표 A(-4,3),B(-2,5),C(1,-1),3AB=CD — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 11 | 해설 | BENEFICIAL | 구한 D=(7,5), 두 벡터 AB/CD, 삼각형 BCD의 밑변 9·높이 6·발 H 직각 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q11-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 12 | 문항 | REQUIRED | q12.png: 윗면 ABCD·아랫면 EFGH의 직육면체, 길이 FG=GH=3,DH=2, 가린 모서리 점선 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q12-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 12 | 해설 | BENEFICIAL | 공간벡터 CH·DF와 내적 -5, 두 선분 방향·길이 3·3·2 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q12-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 13 | 문항 | EXEMPT | 포물선 y²=4x와 이동 직선 x-y-k=0의 두 교점 P,Q — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 13 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 변수 k에 따른 두 교점의 자취·내적 최소 | 매개변수 k에 따라 움직이는 포물선-직선 교점 두 개와 내적 최소점의 결합 | — | N/A | PENDING |
| 14 | 문항 | EXEMPT | 주어진 두 벡터의 무리수 성분과 사잇각 — 주어진 무리수 성분 내적이 0임을 수식으로 바로 확인할 수 있다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 14 | 해설 | EXEMPT | 내적 0임을 계산해 직각 90° 확인 — 주어진 무리수 성분 내적이 0임을 수식으로 바로 확인할 수 있다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 15 | 문항 | EXEMPT | |a|=2,a·b=3, a⊥(a−2kb) 조건 — 벡터 a와 a−2kb의 수직 조건은 내적식에서 유일하게 결정된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 15 | 해설 | EXEMPT | 내적=0에서 k를 구하는 한 단계 계산 — 벡터 a와 a−2kb의 수직 조건은 내적식에서 유일하게 결정된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 16 | 문항 | EXEMPT | 두 2차원 벡터의 성분과 분배법칙 내적 — 두 벡터의 성분·내적 전개가 학생에게 완결된 설명이다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 16 | 해설 | EXEMPT | 2|a|²−3a·b의 성분 계산 — 두 벡터의 성분·내적 전개가 학생에게 완결된 설명이다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 17 | 문항 | EXEMPT | 세 공간점 A,B,C의 벡터합과 P의 자취 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 17 | 해설 | BENEFICIAL | 무게중심 G=(0,-1,2), |PG|=3의 구·반지름 치수 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q17-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 18 | 문항 | EXEMPT | 공간직선 l 위 A,B와 C가 정삼각형을 이루고 G가 무게중심 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 18 | 해설 | BENEFICIAL | 높이 CH=√6와 수선 발 H, AB=2√2, 무게중심 G의 위치 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q18-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 19 | 문항 | EXEMPT | 서로 다른 두 공간직선의 대칭형 식과 각 θ — 공간직선의 두 방향벡터를 추출해 내적 공식으로 정확히 계산한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 19 | 해설 | EXEMPT | 방향벡터 (2,1,1),(-1,-1,2)의 내적과 절댓값 — 공간직선의 두 방향벡터를 추출해 내적 공식으로 정확히 계산한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 20 | 문항 | EXEMPT | 직선 방향벡터와 주어진 공간점의 평면 조건 — 주어진 점과 방향벡터로 일반형 평면식을 대입한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 20 | 해설 | EXEMPT | 직선 방향과 수직인 평면 법선, 평면방정식 — 주어진 점과 방향벡터로 일반형 평면식을 대입한다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 21 | 문항 | EXEMPT | 서로 다른 두 공간평면과 매개변수 k, 사잇각 30° — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 21 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 두 법선 사이 30°와 부호별 평면 각호·교차선 | 두 임의 방정식 평면의 교차선·30° 이면각과 법선/각호의 공간 렌더 | — | N/A | PENDING |
| 22 | 문항 | EXEMPT | 두 평면의 교선에 수직인 새 평면 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 22 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 기존 두 평면과 교선 방향벡터 및 새 평면의 법선 관계 | 두 임의 공간평면의 교선과 그에 수직인 제3 평면의 라벨·각 표시 | — | N/A | PENDING |
| 23 | 문항 | EXEMPT | 공간직선과 평면의 사잇각 θ (0<θ<90°) — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 23 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 직선 방향과 평면 법선의 여각, 수선·각호 | 공간 직선-평면의 교점·정사영과 여각/직각 마크 | — | N/A | PENDING |
| 24 | 문항 | EXEMPT | 직선과 평면이 수직일 때 a,b의 값 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 24 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 평면 법선과 직선 방향이 평행한 3D 표시 | 공간 직선과 임의 방정식 평면의 법선벡터·수직 표식 | — | N/A | PENDING |
| 25 | 문항 | EXEMPT | A(2,-1,1),B(6,7,3)을 지름으로 하는 구의 조건 — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 25 | 해설 | BENEFICIAL | 중심 O=(4,3,2), 반지름 √21, 대원 단면의 AP⊥BP 직각 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q25-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 26 | 문항 | EXEMPT | 직선과 구 x²+y²+z²=77의 교점 A,B — 발문은 정확한 좌표·방정식·보기만으로 성립하고 원본 그림 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 26 | 해설 | BENEFICIAL | 반지름 √77의 대원 단면, 수선 OH=√21, 반현 AH=2√14, 직각 H | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_익힘책_고2/q26-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |

## 품질 발견·검증 구분

- `plan-lint.cjs --shallow`와 `plan-lint.cjs` full(Python 모델·spec·MathJax): **18/18 PASS** (0 FAIL, 0 SKIP).
- `solid-figure-v1` 정적 SVG 관측은 5개 중 3개 PASS, 2개 실패(본 시험지 q02 문제·해설의 동변 2줄 눈금이 실제 모서리 중점에 놓였다고 관측되지 않음: `SOLID_EQUAL_MARK_NOT_AT_MIDDLE:eq1`). 표식을 제거하거나 눈금 수를 1로 바꾸면 원본 대비 특징 누락이므로 금지. 이 2축은 `ENGINE_CAPABILITY_PENDING`으로 보완 필요.
- 익힘책 q07은 원본 픽셀의 가로 6선·비스듬한 9선과 O/P/Q/R 네 점의 격자 교점 위치를 직접 확인했다. plan은 정확한 u=(4,0),v=(1,4)로 해당 15개 선분과 4개의 교점을 엔진에 지정한다. 원본 사진을 벡터로 따라 그리는 손 SVG는 만들지 않았다.
- q08은 삼각형의 세 길이 6·9·10을 만족하는 원 교차로 A를 구성하고 각의 이등분선의 교점 I, 내접원 반지름의 발 H를 따로 계산한다. 원본과 무관한 임의 비율의 원을 넣지 않았다.
- q25·q26 해설은 **공간 구의 대원 단면**을 별도 평면 도형으로 보여 주며, 구 전체가 평면 원이라는 뜻이 아니다. q25는 원주각의 직각, q26은 현의 수선과 길이값을 보인다.
- 현재 `solid-figure-v1`은 하드코딩된 `#fff` 바탕 사각형을 출력한다. 본 plan은 면 채움·`highlights`를 넣지 않았지만, 투명 배경을 강제하려면 `ENGINE_CAPABILITY_PENDING: transparent-background-export`가 필요하다.
- 엔진의 Chrome 브라우저 측정·학생 PC/모바일·A4 인쇄·최종 SVG 연결·게시 **NOT_RUN**. 현재 시험지 JS는 원본 PNG를 참조하며 이번 계획 PR에서 JS를 변경하지 않는다. 따라서 실제 렌더 화소 1:1 parity 최종 승인/게시 완료는 아니다.

