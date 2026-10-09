# 2025 팔마고 2학기 중간 — ALIVE QID9 시험지 통합 작업 인계 CURRENT

## 단일 authority
- **작업 브랜치 하나**: `work/alive-25-palma-h1-2mid-qid9`. 원본 1문항의 9슬롯이 완성되면 **그 qid 파일만 stage/commit/push**한 다음 다음 qid를 계속 생산한다. 문항별 브랜치/PR 추가 금지.
- 출발 Git main: `eabd18824d048a195d3320c597d9963467eb7b1c` (당시). 새 세션은 실제 원격 main 및 이 브랜치 HEAD를 재조회한다.
- 정본: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 첫 `CURRENT HARD — 시험지당 단일 브랜치 / 문항별 독립 커밋 / 누적 배치 검수` 절.
- 원본 기출: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` SHA `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`. 원본은 읽기 전용.

## 제작/검수 현황
| 원본 | 생성 | 그룹 | L3 잠금 | 독립 제작 커밋 | GPT 공개답 품질검수 | Archive 2.0 등록 |
|---|---:|---|---|---|---|---:|
| q01 | 9 | A3/B3/C3 | 집합과 원소 | `0865c75e4bb2` | 미실행 | 0 |
| q02 | 9 | A3/B3/C3 | 명제와 조건 | `be95e702f1e0` | 미실행 | 0 |
| q03 | 9 | A3/B3/C3 | 원의 방정식 | `75617fa293fd` | 미실행 | 0 |
| **합계** | **27** | A9/B9/C9 | — | **3개 독립 커밋** | **0/27** | **0/27** |

- 기존 main 팔마고 27후보(학생용 기존 4·미공급 23)는 **다른 기존 생산물**이다. 이 원장의 27 신규 후보와 혼동하지 않는다.
- 현재 27문항은 신규 생성 초안으로 **아직 출시 검수 PASS가 아니다**. 등록 0개를 27개 노출로 주장 금지.
- 기본 **누적 리뷰 약 45개(원본 5개)** 목표. 27·36개 시점 또는 형님 별도 지시로 조기 검수 가능. 리뷰 누적 대상 UID 전체를 물리 roster로 봉인하고 `발문 우선→공개답 해설 계산 추적→5지·Meta`로 배치 검수. blind-first 일괄 강제 금지.
- 리뷰 중 수학·문장 불량 UID만 핀포인트 보정. 통과 UID는 Generated Consumer DB/index, 실제 학생 조회/모의고사 선택, main 운영병합까지 일괄 마감.

## 다음 정확한 실행
1. 다음 원본 **q04**에만 집중해 Gemini 역설계·L3 잠금·L4/CrossConcept 조건 탐색·학교식 한국어 발문부터 A1~C3 제작.
2. q04 파일/자체검산/Generated L4가 있으면 semantic registry까지 한 번의 Q04 커밋으로 작업 브랜치에 추가하고 SHA/UID를 `GPT_QID9_EXAM_MANIFEST.json`에 기록한다.
3. 다음 q05까지 동일 방식으로 누적하면 **약 45개**가 된다. 컨텍스트/실물 난도에 따라 묶음 검수. 별도 새 창은 계속 같은 브랜치+manifest를 읽어 진행한다.
4. 별도 qid branch 생성, 기존 q1~q3 다시 제작, 모델이 확인할 수 없는 컨텍스트 80% 수치 주장 금지.
5. 코덱스는 GPT 확정 파일의 Git 운영병합/readback만 담당.

## 다음 GPT 창에 붙여넣을 단문
> 2025 팔마고 고1 2학기 중간 ALIVE QID9을 이어라. `work/alive-25-palma-h1-2mid-qid9` 최신 HEAD와 main QID9 CURRENT 및 `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_EXAM_MANIFEST.json`을 먼저 읽어라. q01~q03 총 27개 후보는 이미 생성돼 있으니 중복 작업 금지. 원본 q04 하나만 Gemini 역설계 방식으로 A1~C3 9문항 작성·자가검산하고 **같은 시험지 브랜치에 Q04 파일만 독립 커밋**한 뒤 manifest/handoff를 갱신하라. 리뷰는 약 45개 누적 또는 원장 지정 건수에서 공개답 발문 우선 묶음으로 진행한다. 별도 qid 브랜치/PR 만들지 마라.
