# GPT 독립 SVG 개선 프로젝트 — 고1 2학기 기말 2023·2022 범위 계약 (CURRENT)

> Phase 01: 독립 작업 공간 / source scope lock. **문항별 수학·시각 검수, SVG 생성, 독립검수, PR, main 병합은 아직 하지 않았다.**

## 식별 및 기준

- Task ID: `5300bb96-6cbe-41cc-b516-056f0e051e73`
- Owner: `GPT6_CHAT_SVG_H1_22_23_ROOT`
- 별도 Git 작업 브랜치: `gpt-svg-h1-2final-22-23-5300bb96`
- 고정 출발점: 원격 `main` `8dd99c1d3ea56bb50890d6af6f81b71c910bc316` (2026-11-06 조회)
- Source root: `archive/exams/original/high/h1/2final/`
- 기존 Claude/Codex 캠페인의 미완료 배정이나 검수 PASS를 승계하지 않는 새 GPT 프로젝트다. **운영 JS/SVG와 실제 엔진·문서의 현재 정본은 Git main**이며, 이미 정상인 결과를 추측으로 다시 만들지 않는다.
- 우선순위: 2023년 3개 시험지 → 2022년 8개 시험지. 다른 연도·학년·회차는 대상 밖이다.

## 출발점의 실측 집계 (개발 품질 PASS 아님)

| 시험지(2022·2023, 모두 2학기 기말 고1) | 전체 QID | 함수 관련 1차 메타 후보 | 후보 내 해설 SVG | 후보 내 문제 이미지 | Git JS blob SHA |
|---|---:|---:|---:|---:|---|
| 22_강남여고 | 24 | 8 | 4 | 2 | `b66d0a440b0d826dc328fe3764fc71eea71c226e` |
| 22_금당고 | 21 | 9 | 4 | 0 | `e078f4fc60ff33dd0dcee0464abc99c05277e120` |
| 22_매산고 | 20 | 14 | 5 | 4 | `2cd592db085190b0cd96b5999757696d57c2723a` |
| 22_복성고 | 22 | 12 | 4 | 4 | `505eb5829101cfd9faf66f9c7ea305248460e46d` |
| 22_순천여고 | 23 | 18 | 6 | 3 | `dbb3835e5fd3607c3a5a94fbc732da0ac604b6b5` |
| 22_제일고 | 22 | 13 | 3 | 3 | `e462a14beec4d72758be8e44697cd583abf764e8` |
| 22_팔마고 | 22 | 12 | 4 | 1 | `11608f408d090ccc94e8aa7b699e13b22e0b4d83` |
| 22_효천고 | 22 | 12 | 6 | 0 | `456629f82051d55a62481a70a913c0836c62ebac` |
| 23_강남여고 | 24 | 17 | 6 | 4 | `013a5acf6773680e0cf29e6d49948aa521cd6d67` |
| 23_금당고 | 21 | 14 | 5 | 2 | `c91136ad9443d39ca67800224c5ade0fdecdeb7b` |
| 23_매산여고 | 23 | 15 | 2 | 1 | `6a19e77db2ca66ae561eae323e10b83fd5162a48` |
| **합계** | **244** | **144** | **49** | **24** | — |

- 파일 수: 11개. 전체 JS 참조 해설 SVG 55개 중 함수 관련 후보 연결 49개, 다른 단원 연결 6개다. 이 집계는 **JS의 참조 필드만 조회**한 것으로 SVG 파일의 실제 렌더 성공·수학적 일치·보존 여부를 보증하지 않는다.
- 후보 144개는 category/originalCategory/standardUnit/subUnit에 함수 관련 문자열이 있는 1차 추출이다. **함수 범위의 최종 확정, NEW/REPLACE/KEEP/EXEMPT 판정이 아니다.** 메타 누락·오분류를 배제하기 위해 244개 문항 모두 확인한다.
- 고정 기준 `production/exam-figure-ledger.json`에는 이 11개 시험지의 직접 행이 0개다. 이는 신규 검수 필요의 근거일 뿐 기존 시각자산이 없음을 의미하지 않는다.
- 시험지 JS 원본은 이 단계에서 변경하지 않는다. `main`을 추후 재조회하여 해당 입력이 변했다면 영향 범위만 재검증한다.

## Phase 02 진입 및 완료 계약

1. 11개 시험지 × 244개 전체 QID의 원문/선택지/해설/문제 이미지/기존 해설 이미지를 실제 읽는다. 문제용 시각자료 필요성과 해설용 SVG 필요성을 **각각** 평가한다.
2. 함수/유리함수/무리함수/역함수/합성함수 중 실제 교육 범위를 판정하고 GRAPH_RATIONAL, GRAPH_RADICAL, INVERSE_COMPOSE, INTERSECTION_REGION, OTHER 유형으로 묶는다. 같은 QID를 여러 제작자에게 쓰기 배정하지 않는다.
3. 각 관련 QID를 `FIGURE / REPLACE / KEEP / EXEMPT / CONTENT / UNSUPPORTED / NO_SOURCE_FIGURE`로 분류하고 구체적 근거와 실제 source path·image path·필수 중간값을 기록한다. 그림이 없다는 이유만으로 EXEMPT 처리하지 않는다.
4. 제작은 현행 `archive/tools/geometry-equation/production/render-plan.mjs`와 `production/AUTHOR_GUIDE.md`를 쓴다. 임의 SVG 손그림·검증 완화 금지. 실제 SVG·PNG·caption 완성 후 별도 독립검수, 교체 시 기존 B 대비 새 A가 확실히 낫다는 근거 필요.
5. ROOT는 출력물을 직접 확인하고 전역 렌더 큐·소유권·검증 기록을 관리한다. 11개 시험지의 모든 QID를 PUBLISHED 또는 타당한 EXEMPT로 마감하되 CONTENT/UNSUPPORTED는 미완료로 명시한다.
6. Git에는 운영 JS/SVG/현행 검증 계약만 포함한다. 원시 문항별 검사표·PNG 스크린샷·임시 결과는 Git 커밋하지 않고 별도 Drive evidence에 둔다. 코드 변경 PR은 추후 검수 게이트 통과 후 main에 병합한다.

## 참조 정본과 현재 상태

- `AGENTS.md`, `docs/agents/visual-svg.md`, `docs/agents/git-evidence.md`
- `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md` — 과거 Claude 운영 현황은 **참고**만 하고 기존 사용자 품질 기준과 실제 엔진 정의는 재사용.
- `archive/tools/geometry-equation/ops/svg-m1/briefs/triage.md` / `review1.md` / `multi-exam-run.md`
- `archive/tools/geometry-equation/production/exam-figure-ledger.json`
- 현재 상태: `PHASE_01_SCOPE_LOCKED`; Phase 02: `NOT_RUN`; 실제 SVG/Chrome/독립검수/병합: `NOT_RUN`.
