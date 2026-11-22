# 고등 해설 운영 반영 장부

기준 main `f821baa23aad79bfc52449bb52f562ce6ad048b7`. 공유 claim 기준 `3e9903d68a583029bdf56bc3e7c001d5f09bfef8`. PR #2637. 예약 작업자 브랜치는 읽기 전용으로 사용했다.

| 시험지 및 문항 | 감사 원본 blob | 감사 MD (lane10) | 변경 커밋 | 검산 | 렌더 | SVG | 병합 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2025 제일고 고1 2학기 기말 Q18 | `b9b8c8649f1b47adf41b9bcc07cc94af0647a55e` | `staged/h1/2025_jeil_2final_q18.md` | `39265a796d` | 꼭짓점 좌표 및 신발끈 공식으로 11/4 | Chrome exam/sol/ans 3화면 MathJax 오류 0 | 기존 해설 그림 유지 | PR #2637 |
| 2025 순천여고 고1 2학기 기말 Q19 | `70cb32b708e1a4209b98b4f83ffaf6fddeeeb220` | `staged/h1/2025_suncheon-girls_2final_q19.md` | `5f4d431a95` | 역함수의 조각식을 직접 구해 해 -5 확인 | Chrome exam/sol/ans 3화면 MathJax 오류 0 | 기존 해설 그림 유지 | PR #2637 |

운영 JS 경로는 각각 `archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js`, `archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js`다. authoritative identity map의 UID는 Q18 `qid_v1_d4f1a92208816b516820f926746e23312693f501e9c00c8dcff17ea60bb8ed55`, Q19 `qid_v1_932dd15ce1d7e0f1275d664571e7b3b0f0811689e19e141f6e10500eb790974a`다. 두 공유 claim은 `AUDIT_DRAFT_COMPLETE`였다.

VM 보호 필드 대조, JS 구문, render-text·MathJax·solution image·review evidence 관련 테스트 31개 통과. Golden 실물은 2025 매산여고와 제일고 2학기 중간의 전개 및 보기별 판정을 대조했다. Negative는 2026-10-01 복성고의 JS escape 및 작은 칠판 문단 회귀를 최종 문자열과 Chrome에서 대조했다. 전체 예약 하네스 문서 영수증과 시각 매니페스트 검증은 `NOT_RUN`.

별도 검수자가 정답·해설 열람 전에 두 문항을 독립 풀이한 뒤 최종 해설과 대조했다. 두 해설과 기존 제일고 Q18 도형의 수학적 정합성을 확인했다.

## 재개 위치

- 기준 시점에 원격의 해설 업그레이드 관련 브랜치 10개를 확인했다. staged 경로에서 경로와 blob으로 구별한 MD는 154개였다. 심층 감사 91개, SVG 요청 7개, 개별 초안·장부 등 56개다. 이 값은 본문 전수 검토 건수가 아니다.
- 공유 claim은 88개였다. `AUDIT_DRAFT_COMPLETE` 72개, `IN_PROGRESS` 16개. 완료 claim이 보고한 `draftedQuestionIds`의 (source blob, qid) 조합은 80개다. 추가 과목 브랜치, 명시적 qid 목록을 누락한 claim 및 문항별 완성도는 별도 대조 대상이다.
- 2025 고1 2학기 기말 다음 작업은 lane10 순천고 Q17·Q23, 순천여고 Q9·Q15·Q17·Q18, 팔마고 Q11·Q17·Q18·Q19·Q21·Q23의 완성본 및 기존 그림 대조다. 이후 같은 학기 구분의 과거 연도와 후속 시험 구분으로 이어간다.
- SVG 요청 문항은 기존 그림 일치, 엔진 판본 및 독립 시각 검수 증거까지 결속한 뒤 출고한다. 이 작업에서 새 SVG 제작 결과는 0개다.


## 추가 코드 반영 · PR #2638

| 시험지 및 문항 | 감사 원본 blob | 감사 MD (lane10) | 변경 커밋 | 검산 | 렌더 및 SVG |
| --- | --- | --- | --- | --- | --- | --- |
| 2025 순천고 고1 2학기 기말 Q17·Q23 | `f1ddb53e840df67cb2f53e0e79f883e3fd58d3bb` | `staged/h1/2025_suncheon_2final_q17_q23.md` | `3267359419` | 경계 기울기 −1/2, 두 가지의 허용 구간 교집합 k=1 | 사용자 지시로 렌더 NOT_RUN. 기존 SVG 유지 |
| 2025 팔마고 고1 2학기 기말 Q21·Q23 | `ce814b292be81f43fa76ff4d33d1b707af52a098` | `staged/h1/BATCH_2025_2final_20261121_01.md`, `2025_palma_2final_q17_q18_q19_q23.md` | `da95d058c9` | 속력 76·71, 두 교점 조건 1/3≤k<11/6 | 사용자 지시로 렌더 NOT_RUN. 기존 SVG 유지 |

두 시험지 운영 JS는 `archive/exams/original/high/h1/2final/` 아래다. JS 구문, VM 보호 필드 동등성, `git diff --check`를 통과했다. 별도 풀이 검토에서 순천고 Q23의 최초 답 범위는 왼쪽 근의 조건을 재검토한 뒤 k=1로 정정됐다.

다음 미반영 문항은 2025 순천여고 Q9·Q15·Q17·Q18, 2025 팔마고 Q11·Q17·Q18·Q19다. 이어서 2024년 이하 2학기 기말과 이후 시험 구분을 작업한다.
