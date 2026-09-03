# 고1 함수·유리함수·무리함수 1차 업그레이드 보고

## 상태

`BATCH3_UPGRADE_READY_FOR_USER_REVIEW`

전체 단원 봉인 완료가 아니라, 기준 문서에 따른 초기 전수 진단과 그래프 누락 우선순위 1·2·3차 파일럿 23문항의 업그레이드 결과다. 사용자의 독립 재검수 후 같은 기준으로 다음 배치를 진행한다.

## 기준

- 기준 문서: `docs/plans/고1_함수_유리함수_무리함수_전수품질업그레이드_독립검수_계획_v1.0.md`
- 작업 branch: `codex/h1-function-full-upgrade`
- 원본 기준: `archive/question-index.js` 및 `archive/exams/original/high/h1/`
- 유사문항: 제외
- 수정 허용 범위: `solutionImage`와 해설용 SVG metadata만

## 초기 전수 진단

현재 `original` 원본만 대상으로 재계산한 기준선은 다음과 같다.

| 항목 | 수량 |
|---|---:|
| target 문항 | 522 |
| target 시험지 | 50 |
| 문제 이미지 | 96 |
| 해설 이미지 | 1 |
| 깨진 문제 이미지 참조 | 0 |
| 깨진 해설 이미지 참조 | 0 |

자동 후보 분류는 다음과 같다. 이 분류는 최종 `VISUAL_REQUIRED` 판정이 아니라 독립 풀이·교육성·그래프 대응성 검수로 확정할 후보군이다.

| 자동 분류 | 수량 |
|---|---:|
| `PRIORITY_1_GRAPH_GAP_CANDIDATE` | 94 |
| `PRIORITY_1_EXPLICIT_GRAPH_CANDIDATE` | 144 |
| `PRIORITY_2_GRAPH_RELATION_CANDIDATE` | 12 |
| `PRIORITY_2_GRAPH_SUBUNIT_CANDIDATE` | 57 |
| `TRIAGE_NO_GRAPH_SIGNAL` | 214 |
| `SOLUTION_VISUAL_PRESENT` | 1 |

`similar`를 포함하면 602건으로 보이지만, 그중 80건은 이번 범위 밖이다. 최종 scope는 문서 규정대로 `original` 522건만 사용한다.

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

Batch 1·2·3 적용 후 원본 target의 `solutionImage` 연결은 24개다. 이 수량은 자동 후보의 최종 `VISUAL_REQUIRED` 수량이 아니라 현재까지 실제로 추가·검증한 해설 자산 수량이다.

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

## 검증 결과

- Python deterministic renderer 생성: 5/5 PASS
- source JS syntax: 3/3 PASS
- SVG XML/viewBox/fact-hash/금지 토큰 검사: 5/5 PASS
- 보호 payload parity: 5/5 PASS
- 변경 필드: `solutionImage`, `solutionImageAlt`, `solutionImageCaption`, `solutionImageSize`
- 문제 본문·보기·정답·문제 이미지 보호 해시: 변경 없음

실제 production engine에서 확인한 결과:

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

## 독립 재검수 대기 항목

이번 결과는 Batch 3 파일럿 PASS이지 전체 단원 최종 PASS가 아니다. 다음 항목은 사용자의 독립 재검수에서 확인되어야 한다.

1. 각 그래프의 수학적 위치·교점·축·범위가 원문과 정확히 대응하는지
2. 그래프가 답을 불필요하게 노출하지 않는지
3. 절댓값·조각함수의 경계와 포함 범위가 올바른지
4. 역함수 그래프와 `y=x` 대칭이 교육적으로 충분한지
5. 유리함수의 점근선·중심·원의 교점이 정확한지
6. 해설 SVG를 실제로 추가해야 하는 후보와 `KEEP`/`OPTIONAL` 후보의 분류가 적절한지

독립 재검수에서 수정이 나오면 해당 문항의 graph facts, SVG, source 연결을 함께 수정하고 같은 시험지의 `exam / solution / answer` 렌더를 다시 확인한다. Batch 1·2·3만으로 전체 단원을 `SEALED`로 선언하지 않는다.
