# 백발백중 공통수학2 교재완결 P158–160 20261023 유사50 — 문제·해설 2축 감사

- 원문: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_교재완결_P158-160_20261023_유사50.js`, Git blob `1a547a5afc7d65c1e0dfc09bae3b5786999285bd`.
- 이번 범위: **배열 q01–q12, 12문항/24축**. 전체 50문항 중 q13–q50은 미검수·미제작.
- 문제축: `EXEMPT` 9축, `BENEFICIAL · NEW_PLAN` 3축(q07–q09). 해설축: JS `solutionImage`와 실제 Git SVG blob이 **12축 모두 존재**하여 `BENEFICIAL · EXISTING_SVG`로 기록. 기존 자산은 재제작·수정하지 않음.
- 신규 3개 JSON: `construction-spike-v1`/`SOURCE_COORDINATE_AXES_v1`; 공식 `plan-lint.cjs` **shallow 3/3, full 3/3 PASS**. 독립 좌표·선분·제약 대조 `sourceVsPlan=REVIEWED` 및 `DRAWN_FEATURE_PARITY=PASS` 3/3. `ENGINE_CAPABILITY_PENDING=0`.
- 문제 그림에는 최단 경로의 대칭점·교점·최솟값을 미리 표시하지 않는다. B,C의 숫자 좌표는 *그림 내부에 쓰지 않고* 예시 위치로만 사용했다. 면 채움·정답표기·손 SVG 없음. 실제 SVG 렌더/PNG/학생 화면/A4는 **NOT_RUN**이며 lint/PARITY 결과와 별개다.

| 배열 q / 전체 qid | 문제축 판정·개별 근거 | 해설축 판정·근거 |
| --- | --- | --- |
| q01 `BV-BAKBAL-H-COM2-P158-Q01-T1-R1` | EXEMPT — 이동량 a,b가 미지수이고 C2 중심·접선 참거짓이 정답이므로 결과 원을 그릴 수 없음. 원 C1·대칭 조건은 식으로 충분 | BENEFICIAL · EXISTING_SVG — C1·C2 중심 이동과 접선·반지름 판단 그림 |
| q02 `BV-BAKBAL-H-COM2-P158-Q01-S1-R1` | EXEMPT — C2 중심을 구해야 하며 y=x 대칭 후 중심은 해답 조건 | BENEFICIAL · EXISTING_SVG — 원/대칭과 접선 판정 |
| q03 `BV-BAKBAL-H-COM2-P158-Q01-S2-R1` | EXEMPT — x축 대칭 원의 미지 중심·a,b가 계산 대상 | BENEFICIAL · EXISTING_SVG — 중심 이동·접선 거리 |
| q04 `BV-BAKBAL-H-COM2-P158-Q02-T1-R1` | EXEMPT — k 미지·50번째 직선, 임의 k의 완성 직선을 그리면 주기/정답 추론을 혼동시킴 | BENEFICIAL · EXISTING_SVG — 대칭·평행이동 6주기 |
| q05 `BV-BAKBAL-H-COM2-P158-Q02-S1-R1` | EXEMPT — m 미지인 반복 직선의 주기식을 읽는 문제 | BENEFICIAL · EXISTING_SVG — 6주기 직선 변환 |
| q06 `BV-BAKBAL-H-COM2-P158-Q02-S2-R1` | EXEMPT — a 미지인 50번째 직선·절편 계산 | BENEFICIAL · EXISTING_SVG — 6주기와 변환 단계 |
| q07 `BV-BAKBAL-H-COM2-P158-Q03-T1-R1` | BENEFICIAL · NEW_PLAN `q07-problem.plan.json` — A(3,1), B∈y=x, C∈x축, 삼각형 경로만 제시 | BENEFICIAL · EXISTING_SVG — A의 두 대칭점·최단경로 풀이 |
| q08 `BV-BAKBAL-H-COM2-P158-Q03-S1-R1` | BENEFICIAL · NEW_PLAN `q08-problem.plan.json` — A(2,1), 이동점 두 조건만 표시 | BENEFICIAL · EXISTING_SVG — 교점 순서·반사점 풀이 |
| q09 `BV-BAKBAL-H-COM2-P158-Q03-S2-R1` | BENEFICIAL · NEW_PLAN `q09-problem.plan.json` — A(4,2), 이동 가능한 두 직선만 표시 | BENEFICIAL · EXISTING_SVG — 최단경로와 거리 풀이 |
| q10 `BV-BAKBAL-H-COM2-P158-Q04-T1-R1` | EXEMPT — 약수집합 A,B, X의 포함·원소 합은 식/집합 표기로 완결; X를 그리면 선택 정답 노출 | BENEFICIAL · EXISTING_SVG — 필수/선택/최종 원소를 구분한 해설 카드 |
| q11 `BV-BAKBAL-H-COM2-P158-Q04-S1-R1` | EXEMPT — X⊇A∩B, X⊆A∪B와 원소 합은 수식만 필요 | BENEFICIAL · EXISTING_SVG — 필수 원소와 추가 원소 분류 |
| q12 `BV-BAKBAL-H-COM2-P158-Q04-S2-R1` | EXEMPT — 미지 X의 원소 조합 자체가 답, 기출 그림 불필요 | BENEFICIAL · EXISTING_SVG — 원소 분류와 합 확인 |

## 신규 plan 실제 그려지는 필드 1:1 대조

| plan | 주어진 수학조건 → mathPlan 좌표·직선 | 실제 표시 필드 | 문제 답 노출 / 필수표식 / PARITY |
| --- | --- | --- | --- |
| `q07-problem` | 주어진 A(3,1); B(1,1)·C(4,0)는 미지 이동점의 **임의 예시**; `mirror`: x−y=0 | `displayLines:[mirror]`, `lineLabels:y=x`, 선분 `AB,BC,CA`, 점 A,B,C; **A만 좌표 라벨** | 최적 반사점·최솟값 비표시, B∈y=x·C∈x축, 비율·각·직각 지정 없음 → **PASS** |
| `q08-problem` | 주어진 A(2,1); 예시 B(1,1)·C(3,0), 직선 x−y=0 | y=x, 삼각형 3변, A 좌표만, B,C 이름 | 미지점 결정값을 라벨로 쓰지 않음, 원문 점/선 제약 충족 → **PASS** |
| `q09-problem` | 주어진 A(4,2); 예시 B(2,2)·C(5,0), 직선 x−y=0 | y=x, 삼각형 3변, A 좌표만, B,C 이름 | 최솟값 √40 및 최적 교점 비노출; 면 채움·각/직각/비율 요구 없음 → **PASS** |

세 plan 모두 `sourceConditions[].mappedTo`가 좌표 노드/선/선분을 직접 가리키며 독립 교차 검증에서 B의 x=y, C의 y=0, 삼각형 비퇴화, 실선 3개가 일치했다. 신규 plan 3개 `sourceVsPlan=REVIEWED`, `planLintShallow=PASS`, `planLintFull=PASS`, `render/PNG/student/A4=NOT_RUN`. 기존 SVG 12개는 신규 plan `DRAWN_FEATURE_PARITY` 분자에 포함하지 않는다.
