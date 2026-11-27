# DRAWN_FEATURE_PARITY — 비상교육 기하 벡터 대단원학습평가 고2

- 기준: 2026-11-27 최신 `main` 시작 SHA `30f066de1198d1ac35a456525db220882f2f7ee3`. 원문 JS: `archive/exams/textbooks/비상교육_기하/비상_기하_벡터_대단원학습평가_고2/비상_기하_벡터_대단원학습평가_고2.js`.
- 16문항 / 문항·해설 **32축 전수 판정**. 원본 이미지 q01,q02,q05,q07,q12,q13.png **6장 개별 시각 대조**.
- 신규 계획 14축; 식만으로 완결되는 15축 EXEMPT; 현재 엔진으로 입체 관계를 정확히 나타낼 수 없는 3축 ENGINE_CAPABILITY_PENDING. 계획 중 q01 해설은 추가 엔진 미지원 표식 존재.
- 이 목록에서 `FIELD_1:1_REVIEWED`는 **원본 PNG와 plan의 그려지는 점·선·벡터·점선·길이·각을 정적으로 대조한 판정**이지 렌더된 SVG 화소 대조 PASS가 아니다.

| qid | 축 | 판정 | 원본·현재 해설 대비 1:1 점검 대상과 축별 이유 | capability / 필요 기능 | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|---|
| 01 | 문항 | REQUIRED | 원본 q01.png: 정팔면체 A 위·F 아래, 정사각형 고리 BCDE, 가려진 간선 점선, 6점 라벨 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q01-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 01 | 해설 | BENEFICIAL | AC와 EF는 같은 벡터, AB와 FD는 반대 벡터, CE=√2, BD⊥CE. 교차점 직각 표식 보완 필요 | ENGINE_CAPABILITY_PENDING: 정팔면체 중앙 BD·CE 교차점의 3D 직각 표식 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q01-solution.plan.json` | PASS/PASS | PENDING(교차점 직각 미표시) |
| 02 | 문항 | REQUIRED | q02.png: 정육각형 6변, AB·BC·CD의 방향 있는 a,b,c 화살표 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q02-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 02 | 해설 | BENEFICIAL | CD∥AF, AC·AF 보조선 및 FC 방향 화살표·길이 2 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q02-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 03 | 문항 | EXEMPT | 비평행 a,b의 선형독립 조건; A,B,C 공선 시 k — 선형독립인 벡터의 공선 조건을 계수식으로만 비교하므로 도식은 임의 배치로 오해를 만든다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 03 | 해설 | EXEMPT | OC=(1−t)OA+tOB 계수 비교만으로 k 결정 — 선형독립인 벡터의 공선 조건을 계수식으로만 비교하므로 도식은 임의 배치로 오해를 만든다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 04 | 문항 | EXEMPT | 3차원 성분 a,b 및 미지 x의 선형방정식 — 성분별 방정식·노름 계산에 정확한 3차원 사영 그림이 필요하지 않다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 04 | 해설 | EXEMPT | x의 성분과 크기·단위벡터의 분수 계산 — 성분별 방정식·노름 계산에 정확한 3차원 사영 그림이 필요하지 않다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 05 | 문항 | REQUIRED | q05.png: ABCD 윗면·EFGH 아랫면, 가린 EH/HG/DH 모서리 점선 | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q05-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 05 | 해설 | BENEFICIAL | 윗면 AD와 아랫면 FG의 평행·같은 방향으로 d=a−f+g | solid-figure-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q05-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 06 | 문항 | EXEMPT | 주어진 2차원 벡터 a,b,c의 성분 — 주어진 성분 내적=0을 대입하는 식 자체가 그림 없이 독립 완결된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 06 | 해설 | EXEMPT | a+kc와 c−b의 내적=0 계수 정리 — 주어진 성분 내적=0을 대입하는 식 자체가 그림 없이 독립 완결된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 07 | 문항 | REQUIRED | q07.png: 직사각형 AB=3, AD=4의 길이 지시선, E/F 내분점, AF·DE 화살표 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q07-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 07 | 해설 | BENEFICIAL | E=(1,0),F=(3,0), AF⊥DE; 교차점 X의 직각 표식과 길이 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q07-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 08 | 문항 | EXEMPT | 두 벡터의 크기 3,4와 |a−2b|=9 — 세 노름과 내적의 관계를 제곱식으로 계산하므로 수치·방향을 임의로 정하면 부정확하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 08 | 해설 | EXEMPT | |a−2b|² 전개로 내적 a·b를 구하는 과정 — 세 노름과 내적의 관계를 제곱식으로 계산하므로 수치·방향을 임의로 정하면 부정확하다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 09 | 문항 | EXEMPT | 두 공간직선 l1,l2의 대칭형 식과 통과점 — 발문은 주어진 식·좌표만으로 완결되며 필수 그림·배치 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 09 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 두 3D 방향벡터에 동시에 수직인 벡터/직선 | 공간의 두 임의 직선·두 수직 방향을 함께 보여 주는 3D 벡터축/교차각 표식 | — | N/A | PENDING |
| 10 | 문항 | EXEMPT | 구 중심 C=(0,−1,2), 접점 A=(1,−3,5) — 발문은 주어진 식·좌표만으로 완결되며 필수 그림·배치 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 10 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 구와 접평면 α, 반지름 CA⊥α 및 접점 직각 | 구 표면의 정확한 접점에 임의 방향 접평면과 법선 직각 마크 | — | N/A | PENDING |
| 11 | 문항 | EXEMPT | 구 중심 O, 접점 P,Q와 넓이 6인 도형 — 발문은 주어진 식·좌표만으로 완결되며 필수 그림·배치 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 11 | 해설 | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 접평면 α·β의 법선벡터와 그 사이 각, 사영 면적 | 서로 다른 접평면 사이의 면적 정사영·그림자 투영 | — | N/A | PENDING |
| 12 | 문항 | REQUIRED | q12.png: 정오각형 A,B,C,D,E와 방향화살표 AB=a, AE=b | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q12-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 12 | 해설 | BENEFICIAL | 황금비 EC∥AB, AC=AE+EC, 대각선 AC·BD 보조선 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q12-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 13 | 문항 | REQUIRED | q13.png: 정삼각형 ABC의 변 길이 2와 무게중심 G | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q13-problem.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 13 | 해설 | BENEFICIAL | 중선 AM·발 M 직각, ∠BAG=30°, ∠AGC=120° | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q13-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 14 | 문항 | EXEMPT | 공간직선 두 개의 대칭형 매개방정식 — 공간 두 직선의 교점 좌표는 연립방정식으로 독립 확정된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 14 | 해설 | EXEMPT | 두 매개변수 연립으로 공간 교점 결정 — 공간 두 직선의 교점 좌표는 연립방정식으로 독립 확정된다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 15 | 문항 | EXEMPT | 서로 평행인 두 직선의 매개변수 a — 발문은 주어진 식·좌표만으로 완결되며 필수 그림·배치 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 15 | 해설 | BENEFICIAL | 3x+2y−4=0, 3x+2y−7=0 사이의 수선 PH와 직각 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q15-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |
| 16 | 문항 | EXEMPT | 점 P에서 평면 α 위 원 C까지 최단거리의 입체 조건 — 발문은 주어진 식·좌표만으로 완결되며 필수 그림·배치 지정이 없다. | TEXT_ONLY | — | N/A | NOT_APPLICABLE |
| 16 | 해설 | BENEFICIAL | 단면에서 PH=√11, AH=√10, AX=2, 직각 H, PX가 최소 | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q16-solution.plan.json` | PASS/PASS | FIELD_1:1_REVIEWED / SVG_VISUAL_NOT_RUN |

## 기술·학생 화면 검증 구분

- `plan-lint.cjs --shallow`: 작성 계획 **14/14 OK**. `plan-lint.cjs` full (Python 모델·spec·라벨 MathJax): **14/14 OK**. 별도 렌더는 수행하지 않음.
- 입체 `solid-figure-v1` 계획 4개(q01·q05 양축)의 독립 정적 SVG 관측은 **4/4 PASS**. 시험지 q01 문제 계획의 실제 엔진 출력 SVG를 별도 PNG로 만들어 원본 정팔면체의 꼭짓점·숨은선·라벨을 눈으로 확인했지만, 원본과 투영 시점은 다르고 PC·모바일·A4 레이아웃은 `NOT_RUN`.
- 각 평면도형 계획은 `construction-spike-v1` full lint까지 확인했으며 Chrome 레이아웃·SVG·학생 화면·인쇄는 `NOT_RUN`이다. 원본 `qNN.png`를 JS가 계속 참조한다. JS의 `image`/`solutionImage`는 변경하지 않았으며 새 SVG 게시·연결은 이 PR 범위 밖이다.
- 현재 입체 엔진은 SVG 컴포지션에 **흰색 `#fff` 바탕 사각형**을 하드코딩한다. 본 plan에는 임의 `highlights`나 면 채움을 넣지 않았다. 투명 배경 출력을 요구한다면 `ENGINE_CAPABILITY_PENDING: transparent-background-export` 공통 확장이 필요하다(별도 엔진 라인).
- 원본 1:1 재현에 필요한 표식 중 정팔면체 중앙 두 대각선이 만나는 **3D 평면 내부 교차점 직각 마크**는 현행 `solid-figure-v1`의 `points`로 지정할 수 없다. q01 해설은 대각선 자체를 그리되 이 표식을 미해결로 둔다.
- 필수 그림 원본은 보존했고, 신규 plan은 현재 학생 화면에 미연결이다. **최종 DRAWN_FEATURE_PARITY/브라우저 게시 PASS가 아님**; 후속 렌더 관측 및 필요 엔진 보완·재검수가 필요하다.

