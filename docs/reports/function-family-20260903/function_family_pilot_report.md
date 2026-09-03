# 고1 함수·유리함수·무리함수 전수 업그레이드 보고

## 상태

`FULL_SCOPE_STATIC_REVIEW_COMPLETE_FOR_USER_REVIEW`

기준 문서에 따른 원본 522문항·50개 시험지 전수 진단을 완료했고, 그래프 이해가 실제로 필요한 135문항에 결정적 해설 SVG를 연결했다. 전수 static review에서 모든 문항의 품질·시각자료·answer·solution 상태를 확정했으며, 사용자의 최종 교육적 재검수와 release seal은 별도 단계다.

## 기준

- 기준 문서: `docs/plans/고1_함수_유리함수_무리함수_전수품질업그레이드_독립검수_계획_v1.0.md`
- 작업 branch: `codex/h1-function-graph-batch16`
- 원본 기준: `archive/question-index.js` 및 `archive/exams/original/high/h1/`
- 유사문항: 제외
- 수정 허용 범위: `solutionImage`와 해설용 SVG metadata만

## Batch 16 후 최신 전수 재진단

`original` 원본 522문항만 대상으로 Batch 16 적용 후 재계산한 현황은 다음과 같다.

| 항목 | 수량 |
|---|---:|
| target 문항 | 522 |
| target 시험지 | 50 |
| 문제 이미지 | 96 |
| 문제 시각요소(index 기준) | 98 |
| 해설 이미지 | 136 |
| 깨진 문제 이미지 참조 | 0 |
| 깨진 해설 이미지 참조 | 0 |

자동 후보 분류는 다음과 같다. 이 분류는 최종 `VISUAL_REQUIRED` 판정이 아니라 독립 풀이·교육성·그래프 대응성 검수로 확정할 후보군이다.

| 자동 분류 | 수량 |
|---|---:|
| `PRIORITY_1_GRAPH_GAP_CANDIDATE` | 79 |
| `PRIORITY_1_EXPLICIT_GRAPH_CANDIDATE` | 32 |
| `PRIORITY_2_GRAPH_RELATION_CANDIDATE` | 10 |
| `PRIORITY_2_GRAPH_SUBUNIT_CANDIDATE` | 53 |
| `TRIAGE_NO_GRAPH_SIGNAL` | 212 |
| `SOLUTION_VISUAL_PRESENT` | 136 |

`similar`를 포함하면 602건으로 보이지만, 그중 80건은 이번 범위 밖이다. 최종 scope는 문서 규정대로 `original` 522건만 사용한다.

## 전체 원본 전수 static review 확정

독립 static review ledger 기준으로 522개 원본 행의 provisional triage를 해소했다.

| 최종 시각자료 판정 | 수량 |
|---|---:|
| `VISUAL_REQUIRED_SATISFIED` — 검증된 해설 SVG | 135 |
| `VISUAL_REQUIRED_SATISFIED_BY_PROBLEM_IMAGE` — 원문 그래프가 solution 모드에 이미 표시됨 | 79 |
| `VISUAL_REQUIRED_SATISFIED_EXISTING` — 기존 선행 해설 자산 | 1 |
| `VISUAL_OPTIONAL` — 텍스트 유도만으로 재현 가능 | 95 |
| `VISUAL_EXEMPT` — 그래프 신호 없음 | 212 |

- 최종 target: 522문항 / 50개 시험지
- solution blank/conclusion failure: 0
- answer mismatch: 0
- curriculum forbidden method: 0
- logic-jump unresolved signal: 0
- source-review unresolved: 0
- `VISUAL_REQUIRED` missing: 0
- 보호 필드(`content`, `choices`, `answer`, `image`, `id`) 임의 변경: 0

`22_강남여고 2학기 중간 q17`은 독립 계산값 48이 원문 보기에는 없지만 원문 answer가 이미 `해당 없음 (48)`로 기록된 보호 데이터 이슈라서 수정하지 않고 해소 상태로 기록했다. [전수 independent static review JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_independent_review_v1.json>)과 [요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_independent_review_v1.md>)에 근거를 고정했다.

## 이번 파일럿에서 수정한 문항

문제 `content`, `choices`, `answer`, `image`는 변경하지 않았다. 각 문항에 독립 풀이 facts에서 재생성한 해설 SVG를 연결했다.

| 문항 | 유형 | 추가 자산 |
|---|---|---|
| `21_강남여고 2학기 기말 q23` | 역함수 대칭·삼각형 넓이 | `q23-solution.svg` |
| `21_강남여고 2학기 기말 q29` | 절댓값 무리함수·세 교점 | `q29-solution.svg` |
| `25_순천고 2학기 기말 q17` | 절댓값 무리함수·최솟값 기울기 | `q17-solution.svg` |
| `25_순천고 2학기 기말 q23` | 조각 무리함수·네 교점 | `q23-solution.svg` |
| `25_효천고 2학기 기말 q18` | 유리함수·원·두 교점 | `q18-solution.svg` |

그래프는 자유형 SVG가 아니라 기존 결정적 renderer를 사용했다. 각 자산에는 `data-fact-hash`와 `data-visual-provenance`를 기록했다.

Batch 1·2·3·4·5·6·7·8·9·10·11·12·13·14·15·16 적용 후 원본 target의 `solutionImage` 연결은 136개다. 이 수량은 자동 후보의 최종 `VISUAL_REQUIRED` 수량이 아니라 현재까지 실제로 추가·검증한 해설 자산 수량이다.

## Batch 2 추가 문항

Batch 2에서 다음 10문항에 해설 SVG를 추가했다.

- 24 금당고 2학기 기말 q3 — 유리함수 점근선
- 24 금당고 2학기 기말 q5 — 무리함수 최솟값
- 25 팔마고 2학기 기말 q4 — 유리함수 사분면
- 25 팔마고 2학기 기말 q6 — 유리함수 역함수 값
- 25 제일고 2학기 기말 q11 — 무리함수 사분면
- 25 제일고 2학기 기말 q13 — 유리함수 점근선·중심
- 23 강남여고 2학기 기말 q5 — 양의 반비례 함수
- 23 금당고 2학기 기말 q7 — 유리함수 대칭
- 24 강남여고 2학기 기말 q6 — 평행이동한 무리함수
- 25 순천고 2학기 기말 q18 — 유리함수와 원의 교점

## Batch 3 추가 문항

Batch 3에서 다음 8문항에 해설 SVG를 추가했다.

- 24 금당고 2학기 기말 q10 — 무리함수와 직선의 두 교점
- 25 금당고 2학기 기말 q22 — 무리함수와 직선의 두 교점
- 25 팔마고 2학기 기말 q23 — 무리함수와 직선의 두 교점
- 25 제일고 2학기 기말 q20 — 함수와 역함수의 교점
- 24 금당고 2학기 기말 q11 — 무리함수 현의 기울기
- 24 금당고 2학기 기말 q16 — 유리함수와 선분의 넓이 최솟값
- 23 강남여고 2학기 기말 q24 — 무리함수와 직선의 기울기 범위
- 24 매산여고 2학기 기말 q23 — 함수·역함수와 삼각형 넓이

## Batch 4 추가 문항

Batch 4에서 다음 10문항에 해설 SVG를 추가했다.

- 25 금당고 2학기 기말 q9 — 유리함수 점근선·주어진 점
- 25 팔마고 2학기 기말 q14 — 반비례 함수의 정의역·치역
- 24 매산여고 2학기 기말 q3 — 유리함수 평행이동
- 24 매산여고 2학기 기말 q5 — 유리함수 점근선·중심
- 24 매산여고 2학기 기말 q7 — 절댓값 유리함수의 교점 개수
- 23 강남여고 2학기 기말 q6 — 평행이동한 무리함수의 사분면
- 23 금당고 2학기 기말 q20 — 무리함수와 평행 직선의 교점 개수
- 24 금당고 2학기 기말 q18 — 유리함수와 무리함수의 교점
- 25 금당고 2학기 기말 q15 — 함수·역함수의 두 교점
- 25 제일고 2학기 기말 q14 — 두 유리함수 점근선 직사각형

## Batch 5 추가 문항

Batch 5에서 다음 10문항에 해설 SVG를 추가했다.

- 25 효천고 2학기 기말 q8 — 무리함수 사분면
- 25 효천고 2학기 기말 q11 — 무리함수·역함수 교점
- 25 팔마고 2학기 기말 q11 — 함수·역함수 접점
- 21 복성고 2학기 기말 q3 — 유리함수 점근선
- 21 강남여고 2학기 기말 q3 — 유리함수 중심
- 21 순천고 2학기 기말 q8 — 무리함수·직선 교점
- 21 순천고 2학기 기말 q11 — 무리함수·역함수 교점
- 21 금당고 2학기 기말 q8 — 함수·역함수 교점
- 21 금당고 2학기 기말 q4 — 무리함수 평행이동
- 21 팔마고 2학기 기말 q5 — 유리함수·역함수 평행이동

## Batch 6 추가 문항

Batch 6에서 다음 9문항에 해설 SVG를 추가했다.

- 21 효천고 2학기 기말 q11 — 유리함수 사분면 개수
- 21 팔마고 2학기 기말 q3 — 유리함수 점근선·중심
- 21 팔마고 2학기 기말 q4 — 무리함수 역함수
- 21 제일고 2학기 기말 q5 — 무리함수 성질
- 21 제일고 2학기 기말 q4 — 유리함수 성질
- 21 순천고 2학기 기말 q18 — 원과 반비례 함수의 교점
- 21 복성고 2학기 기말 q4 — 무리함수 정의역·치역
- 21 복성고 2학기 기말 q12 — 무리함수·역함수 접점
- 21 강남여고 2학기 기말 q17 — 유리함수·직선 최단거리

## Batch 7 추가 문항

Batch 7에서 다음 10문항에 해설 SVG를 추가했다.

- 25 효천고 2학기 기말 q12 — 유리함수 중심·두 대칭축
- 22 팔마고 2학기 기말 q12 — 무리함수·직선 접점
- 22 제일고 2학기 기말 q9 — 무리함수·직선 두 교점
- 22 순천여고 2학기 기말 q7 — 유리함수 네 사분면
- 22 순천여고 2학기 기말 q8 — 유리함수·직선 불교점
- 22 복성고 2학기 기말 q7 — 무리함수 정의역·치역
- 22 금당고 2학기 기말 q1 — 유리함수 점근선
- 22 강남여고 2학기 기말 q11 — 무리함수·역함수 두 교점
- 25 순천고 2학기 기말 q13 — 유리함수 점근선·절편
- 25 순천고 2학기 기말 q14 — 유리함수 네 사분면

## Batch 8 추가 문항

Batch 8에서 다음 10문항에 해설 SVG를 추가했다.

- 21 강남여고 2학기 기말 q16 — 렌즈 방정식·유리함수 점근선
- 21 강남여고 2학기 기말 q28 — 유리함수 구간 최댓값·최솟값
- 21 순천고 2학기 기말 q2 — 유리함수 점근선
- 21 복성고 2학기 기말 q11 — 무리함수·직선 두 교점
- 21 팔마고 2학기 기말 q20 — 무리함수·직선 접점
- 22 강남여고 2학기 기말 q15 — 유리함수 중심·대칭축
- 22 강남여고 2학기 기말 q22 — 무리함수·역함수
- 22 매산고 2학기 기말 q3 — 무리함수 정의역·치역
- 22 효천고 2학기 기말 q18 — 무리함수 정의역·치역
- 22 팔마고 2학기 기말 q8 — 유리함수·직선 최단거리

## Batch 9 추가 문항

Batch 9에서 다음 10문항에 해설 SVG를 추가했다.

- 21 강남여고 2학기 기말 q14 — 변환된 유리함수 점근선
- 21 복성고 2학기 기말 q22 — 두 무리함수·직각삼각형
- 22 강남여고 2학기 기말 q18 — 무리함수 세로 차·망원합
- 22 매산고 2학기 기말 q19 — 유리함수·직선·삼각형 넓이
- 22 효천고 2학기 기말 q4 — 유리함수 중심·대칭축
- 22 효천고 2학기 기말 q5 — 무리함수·역함수 대응점
- 22 효천고 2학기 기말 q15 — 유리함수 사분면 조건
- 22 팔마고 2학기 기말 q16 — 두 무리함수 사이 넓이
- 23 금당고 2학기 기말 q8 — 이차함수·역함수 두 교점
- 21 순천고 2학기 기말 q9 — 계수 부호별 무리함수 그래프

## Batch 10 추가 문항

Batch 10에서 다음 10문항에 해설 SVG를 추가했다.

- 21 금당고 2학기 기말 q22 — 반비례 함수·삼각형 최솟값
- 22 금당고 2학기 기말 q9 — 유리함수 대칭 조건
- 22 제일고 2학기 기말 q2 — 유리함수 점근선·절편
- 22 제일고 2학기 기말 q22 — 두 무리함수 세로 차
- 22 복성고 2학기 기말 q15 — 유리함수 네 사분면
- 22 순천여고 2학기 기말 q20 — 유리함수·직선·삼각형 넓이
- 24 제일고 2학기 중간 q15 — 평행이동된 무리함수
- 24 제일고 2학기 중간 q16 — 평행이동된 유리함수
- 24 제일고 2학기 중간 q17 — 유리함수·대칭축·두 교점
- 22 팔마고 2학기 기말 q6 — 유리함수 중심·주어진 점

## Batch 11 추가 문항

Batch 11에서 다음 9문항에 해설 SVG를 추가했다.

- 22 금당고 2학기 기말 q8 — 무리함수·역함수 두 교점
- 22 매산고 2학기 기말 q7 — 무리함수·직선 제1사분면 교점
- 22 매산고 2학기 기말 q8 — 반비례 함수·직각삼각형 넓이
- 22 순천여고 2학기 기말 q14 — 두 무리함수와 넓이
- 22 순천여고 2학기 기말 q17 — 반원의 거리 함수 개형
- 22 순천여고 2학기 기말 q21 — 평행이동·대칭된 무리함수
- 22 복성고 2학기 기말 q12 — 유리함수 평행이동·중심
- 22 복성고 2학기 기말 q21 — 조각 유리함수·삼각형 넓이
- 22 팔마고 2학기 중간 q22 — 이차함수·역함수 두 교점

## Batch 12 추가 문항

Batch 12에서 다음 10문항에 해설 SVG를 추가했다.

- 25 팔마고 2학기 기말 q20 — 정의역 제한 이차함수
- 25 순천고 2학기 기말 q15 — 이차함수·역함수 두 교점
- 25 효천고 2학기 기말 q22 — 유리함수·수선 길이 최솟값
- 22 팔마고 2학기 중간 q12 — 함수·역함수 둘레 넓이
- 22 효천고 2학기 중간 q22 — 절댓값함수·직선 교점 개수
- 22 순천여고 2학기 중간 q16 — 조각함수·역함수
- 22 순천여고 2학기 중간 q17 — 합성함수 구간 최솟값
- 22 금당고 2학기 중간 q11 — 절댓값 합성식의 세 근
- 21 효천고 2학기 기말 q12 — 절댓값 무리함수 교점 개수
- 21 효천고 2학기 기말 q13 — 조각 무리함수·직선 넓이

## Batch 13 추가 문항

Batch 13에서 다음 9문항에 해설 SVG를 추가했다.

- 22 효천고 2학기 기말 q22 — 유리함수 자기역함수·고정점
- 23 금당고 2학기 기말 q11 — 유리함수 중심·구간 최댓값
- 23 금당고 2학기 기말 q13 — 역함수·좌표축 넓이
- 23 강남여고 2학기 기말 q19 — 무리함수·접선·삼각형 넓이
- 24 제일고 2학기 기말 q11 — 유리함수·역함수 대칭
- 24 매산여고 2학기 기말 q22 — 유리함수 사분면 조건
- 24 매산여고 2학기 기말 q6 — 유리함수·무리함수 한 교점
- 24 금당고 2학기 기말 q14 — 조각함수·직선 넓이
- 23 매산여고 2학기 기말 q22 — 무리함수·역함수 정의역·치역

## Batch 14 추가 문항

Batch 14에서 다음 7문항에 해설 SVG를 추가했다.

- 23 매산여고 2학기 기말 q9 — 무리함수·유리함수 정수 격자 영역
- 24 제일고 2학기 기말 q12 — 무리함수 성질
- 24 제일고 2학기 기말 q13 — 유리함수 사분면 조건
- 22 효천고 2학기 기말 q16 — 무리함수·역함수·삼각형
- 22 금당고 2학기 기말 q17 — 유리함수·무리함수 두 교점
- 23 강남여고 2학기 기말 q20 — 평행이동한 유리함수·넓이
- 23 강남여고 2학기 기말 q22 — 유리함수에서 유도한 무리함수 범위

## Batch 15 추가 문항

Batch 15에서 다음 1문항에 해설 SVG를 추가했고, 기존 source-review 의심도 해소했다.

- 25 제일고 2학기 기말 q18 — 합성함수 조각 그래프·좌표축 넓이 `11/4`

## Batch 16 추가 문항

Batch 16에서 다음 7문항에 해설 SVG를 추가했다.

- 21 강남여고 2학기 기말 q12 — 두 반비례 함수와 수직 선분의 망원합
- 21 강남여고 2학기 기말 q13 — 무리함수 끝점·절편과 계수 부호
- 21 강남여고 2학기 기말 q22 — 유리함수 역함수의 점근선
- 21 강남여고 2학기 기말 q27 — 유리함수에서 유도한 무리함수의 사분면
- 21 복성고 2학기 기말 q10 — 유리함수 점근선·절편
- 21 순천고 2학기 기말 q10 — 무리함수 끝점·절편
- 22 매산고 2학기 기말 q12 — 함수와 역함수의 대응점

Batch 16의 attachment ledger에서 변경 문항 7/7의 보호 필드 parity가 PASS였고, SVG facts·asset hash·source 연결을 독립 validator가 7/7 확인했다.

## Batch 16 검증 결과

- Python deterministic renderer 생성: 135/135 PASS
- Batch 16 source JS syntax: 4/4 PASS
- Batch 16 SVG 수학 validator: 7/7 PASS
- Batch 16 SVG XML/viewBox/fact-hash/금지 토큰 검사: 7/7 PASS
- Batch 16 source attachment parity: 7/7 PASS
- Batch 16 solution 실제 DOM 이미지 로드: 7/7 PASS, natural size 양수, broken solution image 0
- Batch 16 시험지·해설지·정답표 회귀: 4개 시험지에서 데이터 로드 오류·`apRenderError` 없음; exam 8/6/6/5 pages, answer 각 1 page 확인
- 변경 필드: `solutionImage`, `solutionImageAlt`, `solutionImageCaption`, `solutionImageSize`
- 문제 본문·보기·정답·문제 이미지 보호 해시: 변경 없음

상세 결과는 [Batch 16 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch16_render_matrix.md>)와 [Batch 16 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch16_attachment_ledger.json>)에 고정했다.

## 이전 누적 검증 기록 (Batch 1–15)

- Python deterministic renderer 생성: 128/128 PASS
- source JS syntax: 3/3 PASS
- SVG XML/viewBox/fact-hash/금지 토큰 검사: 5/5 PASS
- 보호 payload parity: 5/5 PASS
- 변경 필드: `solutionImage`, `solutionImageAlt`, `solutionImageCaption`, `solutionImageSize`
- 문제 본문·보기·정답·문제 이미지 보호 해시: 변경 없음

실제 production engine에서 확인한 결과:

Batch 7의 8개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 10개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 7 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch7_render_matrix.md>)에 고정했다.

Batch 8의 8개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 10개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 같은 8개 시험지의 `exam`·`answer` 회귀도 오류 없이 확인했다. 상세 결과는 [Batch 8 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch8_render_matrix.md>)에 고정했다.

Batch 9의 9개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 10개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 9 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch9_render_matrix.md>)에 고정했다.

Batch 10의 8개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 10개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 10 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch10_render_matrix.md>)에 고정했다.

Batch 11의 7개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 9개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 11 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch11_render_matrix.md>)에 고정했다.

Batch 12의 8개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 10개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 12 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch12_render_matrix.md>)에 고정했다.

Batch 13의 7개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 9개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 13 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch13_render_matrix.md>)에 고정했다.

Batch 14의 6개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 7개가 모두 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. 상세 결과는 [Batch 14 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch14_render_matrix.md>)에 고정했다.

Batch 15의 1개 시험지를 `mode=sol`로 실제 렌더했고, 신규 SVG 1개가 `complete=true`, natural size 양수로 로드되었으며 broken image 0, render error 없음, data load error 없음으로 확인했다. choices의 ①=`11/4`와 해설 계산을 대조해 기존 source-review 의심을 해소했다. 상세 결과는 [Batch 15 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch15_render_matrix.md>)에 고정했다.

누적 시각 계약 검사도 실행했다. 원본 target 522문항·50개 source JS의 런타임 로드 522/522, 생성 SVG 135/135의 case ID·fact hash·provenance·viewBox·금지 토큰·중복 자산 검사, source attachment parity 135/135가 모두 PASS였다. 136번째 해설 이미지는 기존 선행 자산 1개로 별도 집계했다. [시각 계약 JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_visual_contract_v1.json>)과 [시각 계약 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_visual_contract_v1.md>)에 고정했다.

| 시험지 | exam | solution | answer | broken image | render error | last question |
|---|---|---|---|---:|---|---|
| 21 강남여고 2학기 기말 | PASS, 8 pages | PASS, 8 pages, 새 SVG 2개 로드 | PASS, 1 page | 0 | 없음 | q29 |
| 25 순천고 2학기 기말 | PASS, 6 pages | PASS, 7 pages, 새 SVG 2개 로드 | PASS, 1 page | 0 | 없음 | q23 |
| 25 효천고 2학기 기말 | PASS, 6 pages | PASS, 7 pages, 새 SVG 1개 로드 | PASS, 1 page | 0 | 없음 | q23 |

## 산출물

- [초기 전수 진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_summary.md>)
- [전수 inventory JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_inventory.json>)
- [품질 triage CSV](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_quality_triage.csv>)
- [그래프 visual matrix CSV](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_visual_matrix.csv>)
- [파일럿 SVG 생성 ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_pilot_graphs.json>)
- [파일럿 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_pilot_attachment_ledger.json>)
- [업그레이드 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit/function_family_summary.md>)
- [Batch 3 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v5/function_family_summary.md>)
- [Batch 2 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch2_attachment_ledger.json>)
- [Batch 2 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch2_render_matrix.md>)
- [Batch 2 수치 검증·생성 ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_pilot_graphs.json>)
- [Batch 3 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch3_attachment_ledger.json>)
- [Batch 3 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch3_render_matrix.md>)
- [Batch 4 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch4_attachment_ledger.json>)
- [Batch 4 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch4_render_matrix.md>)
- [Batch 4 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v8/function_family_summary.md>)
- [Batch 5 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch5_attachment_ledger.json>)
- [Batch 5 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch5_render_matrix.md>)
- [Batch 5 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v9/function_family_summary.md>)
- [Batch 6 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch6_attachment_ledger.json>)
- [Batch 6 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch6_render_matrix.md>)
- [Batch 6 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v11/function_family_summary.md>)
- [Batch 7 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch7_attachment_ledger.json>)
- [Batch 7 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch7_render_matrix.md>)
- [Batch 7 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v12/function_family_summary.md>)
- [Batch 8 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch8_attachment_ledger.json>)
- [Batch 8 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch8_render_matrix.md>)
- [Batch 8 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v13/function_family_summary.md>)
- [Batch 9 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch9_attachment_ledger.json>)
- [Batch 9 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch9_render_matrix.md>)
- [Batch 9 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v14/function_family_summary.md>)
- [Batch 10 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch10_attachment_ledger.json>)
- [Batch 10 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch10_render_matrix.md>)
- [Batch 10 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v15/function_family_summary.md>)
- [Batch 11 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch11_attachment_ledger.json>)
- [Batch 11 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch11_render_matrix.md>)
- [Batch 11 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v16/function_family_summary.md>)
- [Batch 12 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch12_attachment_ledger.json>)
- [Batch 12 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch12_render_matrix.md>)
- [Batch 12 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v17/function_family_summary.md>)
- [Batch 13 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch13_attachment_ledger.json>)
- [Batch 13 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch13_render_matrix.md>)
- [Batch 13 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v18/function_family_summary.md>)
- [Batch 14 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch14_attachment_ledger.json>)
- [Batch 14 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch14_render_matrix.md>)
- [Batch 14 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v19/function_family_summary.md>)
- [Batch 15 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch15_attachment_ledger.json>)
- [Batch 15 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch15_render_matrix.md>)
- [Batch 15 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v20/function_family_summary.md>)
- [Batch 16 자산 연결·보호 parity ledger](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch16_attachment_ledger.json>)
- [Batch 16 실제 렌더 매트릭스](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_batch16_render_matrix.md>)
- [Batch 16 적용 후 재진단 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/post_upgrade_audit_v21/function_family_summary.md>)
- [전수 independent static review JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_independent_review_v1.json>)
- [전수 independent static review 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_independent_review_v1.md>)
- [누적 시각 계약 검증 JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_visual_contract_v1.json>)
- [누적 시각 계약 검증 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_visual_contract_v1.md>)
- [전수 업그레이드 manifest JSON](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_upgrade_manifest.json>)
- [전수 업그레이드 manifest 요약](<C:/Users/USER/Desktop/AP------/docs/reports/function-family-20260903/function_family_upgrade_manifest.md>)

## SOURCE_REVIEW 해소

- `22_강남여고 2학기 중간 q17`: 독립 계산은 48이지만 원문 choices에 48이 없어 answer가 `해당 없음 (48)`로 기록되어 있다. 원문 보호 원칙에 따라 content/choices/answer는 수정하지 않고 `RESOLVED_PROTECTED_SOURCE_DATA_ISSUE`로 판정했다.
- `25_제일고 2학기 기말 q18`: 원문 해설의 독립 계산은 도형 넓이 `11/4`이고, choices의 ①도 `11/4`로 확인되어 answer `①`과 일치한다. 조각별 합성함수 그래프를 Batch 15에서 추가했고 source-review 의심을 해소했다.

## 사용자 최종 교육적 재검수 대기 항목

전수 static review와 선택적 업그레이드는 완료됐지만, 계획서의 마지막 사용자 교육적 검수와 release seal은 아직 남아 있다. 다음 항목을 확인하면 된다.

1. 각 그래프의 수학적 위치·교점·축·범위가 원문과 정확히 대응하는지
2. 그래프가 답을 불필요하게 노출하지 않는지
3. 절댓값·조각함수의 경계와 포함 범위가 올바른지
4. 역함수 그래프와 `y=x` 대칭이 교육적으로 충분한지
5. 유리함수의 점근선·중심·원의 교점이 정확한지
6. 해설 SVG를 실제로 추가해야 하는 후보와 `KEEP`/`OPTIONAL` 후보의 분류가 적절한지

독립 재검수에서 수정이 나오면 해당 문항의 graph facts, SVG, source 연결을 함께 수정하고 같은 시험지의 `exam / solution / answer` 렌더를 다시 확인한다. 현재 매니페스트의 `finalSealEligible`은 release SHA·전수 최종 렌더·사용자 검수 전이므로 `false`다.
