# 23 금당고 고1 2학기 기말 SVG 초안 상태

기준 원문 `archive/exams/original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js` (21문항). AUTHOR_GUIDE와 실제 문항/해설을 대조했다.

| 문항 | 상태 | 확인 사항 |
|---|---|---|
| Q1, Q2, Q6, Q12, Q14, Q15 | EXEMPT | 풀이식/간단한 경우 분기가 충분해 별도 SVG가 불필요 |
| Q3 | DRAFT_ONLY | 3열 mapping 입력 및 publish metadata 작성. 렌더 미실행 |
| Q4, Q9, Q16, Q17, Q18, Q19, Q21 | UNSUPPORTED | 원문 구조에 맞는 엔진 표현/스키마 미확정. 개별 plan.json에 이유 기록 |
| Q5 | CLAUDE_IN_PROGRESS | Claude 담당; 건드리지 않음 |
| Q7 | FAILED / OPEN | 과거 렌더 5회 실패 기록 유지. 최종 STATIC_GRAPH_AUDIT_FAIL; 추가 렌더 안 함 |
| Q8, Q13, Q20 | OPEN | 기존 aligned draft 파일 확인 불가; 중복 초안 생성 안 함 |
| Q10 | ARCHIVE_BOUND | 공식 piecewise-discontinuous 렌더, repairs 0. PNG 육안 확인. 이전 커밋에 SVG 보존 |
| Q11 | ARCHIVE_BOUND | 공식 rational-spike 렌더, repairs 0. PNG 육안 확인. 부정확한 양의 분자 설명 및 Q10 예시 혼동 수정; 이전 커밋에 SVG 보존 |

Q3 입력 초안은 엔진에서 실행하지 않아 엔진 검증/렌더 PASS가 아니다. 이번 라운드에서 공식 렌더를 추가로 실행하지 않았다. Q10/Q11 기존 공식 SVG SHA-256:

- Q10 `figure-solution.svg`: `080A0A689F3A4DB6E0BEA2FF04BE85CADD084FC423D4F338C55BC432C74D4FF7`.
- Q11 `figure-solution.svg`: `77B472B1796A261A63D843BB7CC840DE91147809EB3296844B7DAEFB781EC74C`.

Q7의 세부 이력은 `drafts/Q07/render-status.json`에 보존했다. Q8/Q13/Q20 OPEN은 기존 정합 초안을 확보하지 못했다는 뜻이다. 확인되지 않은 파일을 완료 처리하지 않았다.
