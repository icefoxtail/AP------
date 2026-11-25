# 백발백중 공통수학2 도형의 이동 P75–78 20261022 유사50 — 문제·해설 2축 감사

- 원문: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50.js`, Git blob `2d556ee2b603dbe7fe079d1ba8b2f3d1e05b2b11`.
- 이번 범위: **배열 q01–q12, 12문항/24축**. 전체 50문항 중 q13–q50은 미검수·미제작.
- 문제축: `BENEFICIAL · NEW_PLAN` 9축(q01–q06, q10–q12), `EXEMPT` 3축(q07–q09). 해설축 12개 모두 기존 JS `solutionImage`가 **`archive/assets/images/<stem>/...svg` 실물에 연결**되어 `BENEFICIAL · EXISTING_SVG`; 중복 신규 계획 없음.
- 신규 9개 JSON: `construction-spike-v1`/`SOURCE_COORDINATE_AXES_v1`; 공식 `plan-lint.cjs` **shallow 9/9, full 9/9 PASS**. 원문·plan 필드의 직선계수/보조점/원 중심·반지름/반사축을 독립 비교해 `sourceVsPlan=REVIEWED`, `DRAWN_FEATURE_PARITY=PASS` **9/9**, `ENGINE_CAPABILITY_PENDING=0`.
- 문제 그림에서는 변환 **전**의 직선·원과 주어진 대칭축만 표시했다. 최종 대칭점·최종 직선/원·답 식은 표시하지 않고 면 채움도 없다. 직접 SVG 렌더·PNG·학생 화면·A4 검사는 **NOT_RUN**. 기존 SVG에 대해 lint/PARITY를 PASS라 하지 않는다.

| 배열 q / 전체 qid | 문제축 판정·개별 근거 | 해설축 판정·근거 |
| --- | --- | --- |
| q01 `BV-BAKBAL-H-COM2-P75-Q09-T1-R3` | BENEFICIAL · NEW_PLAN `q01-problem.plan.json` — 3x+2y−6=0의 원래 직선과 x축만 표시, 반사 결과 숨김 | BENEFICIAL · EXISTING_SVG — x축 대칭한 직선 관계 |
| q02 `BV-BAKBAL-H-COM2-P75-Q09-S1-R3` | BENEFICIAL · NEW_PLAN `q02-problem.plan.json` — 2x−y+4=0과 y축만 표시 | BENEFICIAL · EXISTING_SVG — y축 대칭 단계 |
| q03 `BV-BAKBAL-H-COM2-P75-Q09-S2-R3` | BENEFICIAL · NEW_PLAN `q03-problem.plan.json` — x−3y+2=0과 원점 대칭 기준 | BENEFICIAL · EXISTING_SVG — 원점 대칭의 두 부호 반전 |
| q04 `BV-BAKBAL-H-COM2-P75-Q10-T1-R3` | BENEFICIAL · NEW_PLAN `q04-problem.plan.json` — 원래 원과 y=x 대칭축만 | BENEFICIAL · EXISTING_SVG — 중심 (3,-2)→(-2,3) 대칭 |
| q05 `BV-BAKBAL-H-COM2-P75-Q10-S1-R3` | BENEFICIAL · NEW_PLAN `q05-problem.plan.json` — 원래 원과 x축만 | BENEFICIAL · EXISTING_SVG — 중심 y부호 대칭 |
| q06 `BV-BAKBAL-H-COM2-P75-Q10-S2-R3` | BENEFICIAL · NEW_PLAN `q06-problem.plan.json` — 원래 원과 y축만 | BENEFICIAL · EXISTING_SVG — 중심 x부호 대칭 |
| q07 `BV-BAKBAL-H-COM2-P75-Q11-T1-R3` | EXEMPT — 미지 a,b를 가진 최초 직선은 최종 직선 조건에서 역산해야 하므로 발문 단계 완성 도식은 정답 누출 위험 | BENEFICIAL · EXISTING_SVG — 두 단계 직선 대칭 |
| q08 `BV-BAKBAL-H-COM2-P75-Q11-S1-R3` | EXEMPT — 이중 대칭 후 절편을 묻는 짧은 치환식, 원래 직선만 다시 그리는 것은 중복 | BENEFICIAL · EXISTING_SVG — 원래/변환 직선 비교 |
| q09 `BV-BAKBAL-H-COM2-P75-Q11-S2-R3` | EXEMPT — k 미지, 최종 직선이 지나야 할 점을 그림에 찍어도 대입식을 반복할 뿐 | BENEFICIAL · EXISTING_SVG — 연속 대칭 및 점 통과 조건 |
| q10 `BV-BAKBAL-H-COM2-P75-Q12-T1-R3` | BENEFICIAL · NEW_PLAN `q10-problem.plan.json` — 원래 중심 (1,2), 반지름 2인 원, y축·원점만 | BENEFICIAL · EXISTING_SVG — y축→원점 대칭의 두 원 |
| q11 `BV-BAKBAL-H-COM2-P75-Q12-S1-R3` | BENEFICIAL · NEW_PLAN `q11-problem.plan.json` — 원래 중심 (2,-4), 반지름 3인 원만 | BENEFICIAL · EXISTING_SVG — 연속 대칭한 중심·반지름 |
| q12 `BV-BAKBAL-H-COM2-P75-Q12-S2-R3` | BENEFICIAL · NEW_PLAN `q12-problem.plan.json` — 원래 중심 (-2,3), 반지름 1인 원만 | BENEFICIAL · EXISTING_SVG — 연속 대칭의 최종 원 |

## 신규 9개 DRAWN_FEATURE_PARITY: 원문 vs 실제 표시 필드

| plan | 원문에서 직접 재확인한 식·변환 → mathPlan | 그려지는 필드·좌표 및 숨김 | 최종 판정 |
| --- | --- | --- | --- |
| `q01-problem` | 주어진 `3x+2y−6=0`, `SOURCE_LINE (a,b,c)=(3,2,-6)`; x축 대칭 | 원래 직선 `displayLines`, 식 `lineLabels:GENERAL`; 숨긴 뷰 앵커 P(2,0),Q(0,3)는 실제 원래 직선 위 | PASS — x축은 좌표축 자체, 대칭 후 직선 미표시 |
| `q02-problem` | `2x−y+4=0`, (2,-1,4); y축 대칭 | 원래 직선+식; 앵커 P(-2,0), Q(0,4) 모두 원래 직선 위 | PASS — y축은 좌표축 자체, 대칭 후 직선 미표시 |
| `q03-problem` | `x−3y+2=0`, (1,-3,2); 원점 대칭 | 원래 직선+식; 앵커 P(-2,0), Q(1,1) 원래 직선 위, 원점 축선 표시 | PASS — 원점 대칭 후 직선 미표시 |
| `q04-problem` | 주어진 원 중심 (3,-2), 반지름 √5; `SOURCE_LINE x−y=0`은 대칭축 y=x | `CIRCLE_CENTER_RADIUS`/`displayCircles`, `mirror`/`displayLines`, 식 라벨 y=x; 숨긴 뷰 앵커 T(1,1)는 y=x 위 | PASS — 원·대칭축 관계, 반사 중심 (-2,3)·답 식 미표시 |
| `q05-problem` | 원 중심 (2,-3), 반지름 3; x축 대칭 | 원 `displayCircles`, 기본 x축, 단위 눈금 x=1·y=1; 중심 이름·좌표 숨김 | PASS — 대칭 원·최종 방정식 미표시 |
| `q06-problem` | 원 중심 (-1,4), 반지름 √8; y축 대칭 | 원, 기본 y축, 단위 눈금 1; 중심 이름·좌표 숨김 | PASS — 반사 중심 (1,4) 비표시 |
| `q10-problem` | 원 중심 (1,2), 반지름 2; y축→원점 대칭 | 원·좌표축·단위 눈금, 처음 중심 좌표라벨과 이동 후 원 모두 숨김 | PASS — 2단계 순서 조건을 캡션·sourceConditions에 명시하고 결과 그림은 미표시 |
| `q11-problem` | 원 중심 (2,-4), 반지름 3; y축→원점 | 원·좌표축·눈금, 대칭 후 중심 비표시 | PASS — 반지름 보존·초기 위치 일치 |
| `q12-problem` | 원 중심 (-2,3), 반지름 1; y축→원점 | 원·좌표축·눈금, 최종 위치 비표시 | PASS — 연속 대칭의 결과 방정식 비노출 |

위 9건은 `sourceConditions[].mappedTo`의 모든 참조가 실제 plan 노드·선분 ID에 존재하고, 원래 선분/원/축의 위치가 주어진 식과 일치하는지 확인했다. 원문에 별도의 변 길이·각·직각표식·비율표시·음영을 요구하지 않아 임의 도형요소를 추가하지 않았다. `sourceVsPlan=REVIEWED`, `planLintShallow=PASS`, `planLintFull=PASS`, `featureParity=PASS`, `render/PNG/student/A4=NOT_RUN`. 기존 SVG 12축의 신규 plan `DRAWN_FEATURE_PARITY`는 N/A다.
