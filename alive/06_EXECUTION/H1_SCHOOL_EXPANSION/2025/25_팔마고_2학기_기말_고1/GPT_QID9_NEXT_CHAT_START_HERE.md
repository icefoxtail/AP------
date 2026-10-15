# 팔마고 2025 고1 2기말 — NEXT CHAT HARD START (2026-10-15)

**q14 첫 행동: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_기말_고1/GPT_QID9_QUALITY_HANDOFF_CURRENT.md`의 최상단 `CURRENT HARD — q14부터 RPM·확장 L3/L4 → CrossConcept → 난이도 순서 고정` 본문을 읽고 PREFLIGHT/Blueprint에 증거를 먼저 기록한다. 이 순서를 완료하지 않고 q14 문항·선지를 먼저 만들지 않는다.**

1. `RPM 먼저`: 원본·최종 사고를 확인하고 최신 RPM LOCKED 마스터 및 high1 crosswalk를 조회한다. 이어 **`archive/generated/lite/v1/2022/H1/**/extension-l3/*.json`, `**/extension-l4/*.json`의 모든 기존 qid별 확장**을 검색한다. 실제 결정적 풀이 L3/L4 및 parent/교육과정/매핑 상태를 확정. `DIRECT_BINDING_GAP`은 Primary 부재가 아니다.
2. `CrossConcept 다음`: canonical concepts/*.json 및 기존 Generated extension-meta/*.json을 의미/alias로 검색한다. 실제 추가 사고가 없으면 `[]`, **필수 개념인데 없으면 직접 `EXT-CROSS-...`를 GENERATED_ACTIVE로 생성·실파일 등록**, 9 UID 각각에 유효한 기존/확장 키를 결속한다. Primary와 개념 중복 금지. 자연수·범위 제약은 Condition, 사고 연결은 Integration에 별도 입력.
3. `난도 검증`: UID마다 **Primary → CrossConcept 각 키의 실제 추가 풀이 단계 → Condition의 분기·경계 → Integration과 오답 위험**을 증명하고 학습 `level`과 평가 `difficultyBucket 1..5`를 **별도 근거**로 기록. CrossConcept 개수나 슬롯 A/B/C로 자동 난도 매기기 금지.
4. `인계 마감`: 9 UID별 검색 기록, 새 개념 등록 파일 및 SHA/상태, draft/Blueprint/Meta Registry parity, 문제/해설 SVG 필요성, 정답·해설·오답 4개, 원격 Git readback을 기록. 독립검수·실제 브라우저·Consumer/main 미실행은 `NOT_RUN`으로 보존.

**q13 보정 사례(정본):** `H1-RPM-182` (공통수학1 L3 절대부등식 / L4 산술·기하평균) + 신규 `EXT-CROSS-H1-C-06-MAXMIN` (최댓값·최솟값 판단, GENERATED_ACTIVE, 9/9). `CC_AM_GM`은 Primary와 중복하여 추가로 세지 않는다. 원본 q13은 공통수학2 provenance로 보존. 단, RPM-182의 exact PT 바인딩은 `DIRECT_BINDING_GAP`으로 구별.

**현재 제작 진도**: q13 A1~C3 AUTHOR 완료, **117/207**, 잔여 **90**, firstMissing **q14**. 브랜치 `work/alive-25-palma-h1-2final-qid9`; q01~q13 불변 보호. Formal independent/browser/Consumer/index/main=`NOT_RUN` (새 작업도 실행한 범위만 보고). 다음 q14 원본·이미지/기존 UID·최신 main 및 해당 Notion 문서부터 확인.
