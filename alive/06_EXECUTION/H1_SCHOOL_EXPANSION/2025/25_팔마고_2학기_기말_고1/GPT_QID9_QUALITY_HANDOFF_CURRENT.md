# CURRENT — q17 SOURCE LOCK·9문항 AUTHOR 완료 / 다음 q18 (2026-10-15)

- 브랜치 `work/alive-25-palma-h1-2final-qid9`, 부모 HEAD `de80b864a21bb565934b8c88c3396112b50c3a0e`. **q17 A1~C3 신규 9 UID, 누적 153/207**, firstMissing **q18**. q01~q16 144개 UID 내용·원본 시험지·기존 유사문항 불변.
- SOURCE LOCK PASS: 원본 Git Blob `0d12b75e824ab47f08fc3b5a6180be595f882c6e`, raw-byte SHA-256 `ec27789038f516137fde02bbf473333051c388c0cb5cd256553327438a2e5f91`, qid_v1 `qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698`. 원본 q17은 조각함수 일대일대응에서 `a>0, b≥1, b+c=a(b-1)^2-a-3`; 최소 t=1, `a+c=-4` (①)와 일치. q17 기존 UID **0**.
- Primary **H1-RPM-257** (2022 공통수학2 / 함수의 성질 / 일대일함수), PT `PT_ONE_TO_ONE_BIJECTION`, TPL `TPL_BIJECTION_JUDGMENT_CONDITION` DIRECT_ACTIVE. H1-RPM-255/256 역함수 직접구하기/대칭과 구별해 실제 주판단으로 독립 선택. 기존 Canonical ACTIVE CrossConcept `CC_QUADRATIC_FUNCTION`, `CC_QUADRATIC_EQUATION`, `CC_INVERSE_FUNCTION` 재사용, 신규 EXT-CROSS **0**. Canonical Condition `COND_RANGE`, `COND_POSITIVE`, `COND_NEGATIVE` UID별 사용.
- **정답 번호 ①2 ②2 ③2 ④2 ⑤1**; 가로·세로 모두 중복0, q16 패턴 미반복, 보기 45개·오답 계산 36경로 결속. `ANSWER_DISTRIBUTION_GATE=PASS`.

| | 1 | 2 | 3 |
|---|---|---|---|
| A | ② | ③ | ① |
| B | ⑤ | ① | ④ |
| C | ③ | ④ | ② |

- 문제 SVG 9개 EXEMPT. 해설 SVG **B2/B3/C1/C2/C3 5개** Git 실파일 제작·SHA256 결속; 다른 4개 EXEMPT. Python SymPy 경계·좌표 수치 검증 및 SVG 정적 구조검사는 AUTHOR 범위에서 실시. **독립검수, 실제 Browser, Consumer/index, 학생 등록, main 병합 = NOT_RUN**. 후보 제작 마감이지 출시 완료나 R1/R2/R3 PASS는 아님.
- 이번 파일: `GPT_QID9_Q17_SOURCE_LOCK.json`, `GPT_QID9_Q17_PREFLIGHT.json`, `GPT_QID9_Q17_CREATE_DRAFT.json`, `GPT_QID9_Q17_AUTHOR_BLUEPRINT.json`, `GPT_QID9_Q17_AUTHOR_RECEIPT.json`, `GPT_QID9_Q17_VISUAL_NUMERIC_EVIDENCE.json`, `assets/q17/*-solution.svg`. Meta Registry는 기존 144개 deep equal 보호 + 신규 9개 append; Progress 153/207.
- 다음 q18에서 원본 ID·그림·수학 SOURCE LOCK부터 별도 시작한다. 기존 q17·q01~q16 정상 제작물을 재작성하지 않는다.

---

# CURRENT — q16 AUTHOR 제작·자기점검 완료 / 다음 q17 (2026-10-15)

- 브랜치 `work/alive-25-palma-h1-2final-qid9`, 기준 부모 HEAD `2d5a3f18412a995d7d17f29be8a02c9a15d778c0`. q16 A1~C3 9 신규 UID (144/207); q01~q15와 원본·기존 유사문항 불변. 원본 q16 UID `qid_v1_40a69143be5c1e772258493db1b05af555129f352996a8e6f65b85da1b84f6b7` VERIFIED.
- **Primary H1-RPM-257** (공통수학2 함수의 성질 / 일대일함수) `DIRECT_ACTIVE`; PT `PT_ONE_TO_ONE_BIJECTION`, TPL `TPL_BIJECTION_JUDGMENT_CONDITION` ACTIVE. q15의 합성함수 H1-RPM-254 자동승계 금지.
- Canonical ACTIVE CrossConcept `CC_COMBINATORICS_COUNTING` (9 UID), `CC_NUMBER_PARITY` (B3/C1/C3 3 UID). 신규 EXT-CROSS **0개**: 기존 ACTIVE 키가 실제 모든 추가 개념을 커버하므로 의미 중복을 만들지 않음. Condition은 ACTIVE `COND_FUNCTION_BIJECTION`, `COND_STRICT_MONOTONE_VALUES`, 필요 시 `COND_FUNCTION_VALUE_CONSTRAINT`; 난이도 level/bucket 독립 이유 UID별 보존.
- A1~C3 문제 SVG 9/9 **EXEMPT**. 해설 SVG B2/B3/C1/C2/C3 5개 Git blob 실파일 제작; 나머지 4개 **EXEMPT**. 수학적 경우의 수 Python 전수열거 A1 30/A2 4/A3 20/B1 10/B2 36/B3 6/C1 7/C2 2/C3 6; 45보기/36 실제 오답 경로 기록. Python 수치·카드 좌표 사전점검, **XML 파서 검사·실제 Browser NOT_RUN**.
- 제작 9 UID, 자체 풀이·역발문 KEEP 9/9. **독립검수·Browser·학생 Consumer/index·main = NOT_RUN**; CREATE 후보이지 학생 출시·독립 PASS는 아님.
- 신규 파일: `GPT_QID9_Q16_CREATE_DRAFT.json`, `GPT_QID9_Q16_AUTHOR_BLUEPRINT.json`, `GPT_QID9_Q16_AUTHOR_RECEIPT.json`, `GPT_QID9_Q16_PREFLIGHT.json`, `GPT_QID9_Q16_VISUAL_NUMERIC_EVIDENCE.json`, `assets/q16/*-solution.svg`.
- 누적 `GPT_QID9_PROGRESS_CURRENT.json` 144/207, firstMissing 17. 다음 원본 q17의 실제 수학과 Primary를 독립 확정한다.

---

# CURRENT — q15 AUTHOR 완료 / 다음 q16 (2026-10-15)

- 기준 브랜치: `work/alive-25-palma-h1-2final-qid9`; **q15 A1~C3 9 UID 신규 추가, 135/207 완료, 다음 원본 q16**. q01~q14/source/기존 유사문항 불변.
- Primary `H1-RPM-254` (2022 공통수학2 / 합성함수 / 정의역 조건) DIRECT_ACTIVE. PT `PT_COMPOSITION_PROPERTIES` / TPL `TPL_COMPOSITION_RELATION_CONDITION` ACTIVE. q14 역함수 Primary 256을 재사용하지 않음.
- 신규 CrossConcept `EXT-CROSS-H1-C2-07-COMPOSITION-COEFF-IDENTITY` → `archive/generated/lite/v1/2022/H1/H22-C2-07-FUNCTION_COMPOSITION/extension-meta/palma25-2final-q15-composition-involution.json` GENERATED_ACTIVE (9/9 UID). 기존 `CC_INVERSE_FUNCTION`, `CC_RATIONAL_FUNCTION`, `CC_QUADRATIC_EQUATION`, `CC_DISCRIMINANT`, `CC_ROOTS_COEFFICIENTS`는 실제 적용 UID에 재사용. 별도 메타 Registry UID 135개.
- 원본 q15 UID `qid_v1_0a17b0647447adb5fae155e88e981c428430394d97480833530bcac5aafe34b5`는 현재 question_identity_map.json의 `original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js#15`와 정확 일치. q14 sourceUidBinding 기존 EVIDENCE_DEBT 그대로 보존.
- q15의 문제 SVG 9/9 EXEMPT, 해설 SVG 9/9 Git 실파일(그래프 8+정수 수직선1) AUTHOR numeric self-check. 45보기·36오답 계산 경로·9개 level/bucket 근거 기록. **독립 검수, 실제 브라우저, 학생 Consumer/index, main = NOT_RUN**.
- 상세 자료: `GPT_QID9_Q15_CREATE_DRAFT.json`, `GPT_QID9_Q15_AUTHOR_BLUEPRINT.json`, `GPT_QID9_Q15_AUTHOR_RECEIPT.json`, `GPT_QID9_Q15_PREFLIGHT.json`, `GPT_QID9_Q15_VISUAL_NUMERIC_EVIDENCE.json`.

---

# CURRENT HARD — q14부터 RPM·확장 L3/L4 → CrossConcept → 난이도 순서 고정 (2026-10-15 원장 직접 지시)

> **최우선 제작 핸드오프.** 다음 q14 A1~C3의 사전설계부터 모든 후속 원본 qid에 적용한다. 단순한 'Meta 확인' 문구가 아니라 **각 UID에서 실제 검색·판정·등록·난이도 반영을 마감하는 의무**다. 기존 q01~q13의 정상 문항을 일괄 재제작하거나, RPM LOCKED 정본을 고쳐 해결한 것으로 처리하지 않는다.

## 1. Primary를 찾는 순서 — 기존 RPM + 이미 확장된 L3/L4 모두 검색

1. 최신 `main`의 `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`과 `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json`에서 **학생에게 실제 요구한 결정적 사고**를 의미 검색한다. 원본 문서의 학교·학기·단원 이름이나 앞서 등장한 공식으로 Primary를 자동 확정하지 않는다. 같은 학년의 **관련 2022 과목 전체, 기존 학년·이전 교육과정의 동형 RPM**도 대조하여 `record ID → L1/L2/L3/L4 → curriculum/scope`를 기록한다.
2. **RPM에만 한정하지 않는다.** 기존 ALIVE/Generated 확장 분류를 `archive/generated/lite/v1/2022/H1/**/extension-l3/*.json`, `archive/generated/lite/v1/2022/H1/**/extension-l4/*.json`에서 **`registry.json` 및 학교/qid별 파일 전부** 검색한다. 현재 브랜치와 `main`에 등록된 생성 패킷·metadata·handoff도 대조한다. 이름이 달라도 정의/decisive step이 같으면 기존 key/parent/상태를 재사용한다. 새 L3/L4 후보를 만들기 전 기존 RPM과 EXT의 조사 분모·비교 근거를 남긴다.
3. 맞는 기존 RPM/EXT Primary가 있으면 그대로 재사용한다. **PT/TPL의 binding이 비어 있다는 것은 L3가 없다는 뜻이 아니다.** `DIRECT_BINDING_GAP`·projection gap은 **매핑 기술 부채**로만 따로 적고, 정확히 존재하는 Primary를 다른 L3로 대체하지 않는다. 정말 없을 때만 허용된 Generated-only 확장 경로에 부모 L1/L2, 핵심 추론, 기존 대조, UID 근거를 결속하며, RPM 정본에는 임의 ID를 쓰지 않는다.
4. **원본 출처와 Generated의 목표 분류를 분리한다.** 원본 시험지의 과목·표준단원 키는 provenance에 불변 보존하고, 최종 풀이 주개념이 다른 정본 과목·단원에 있다면 생성 UID의 `standardCourse / standardUnitKey / subUnitKey / rpm L1~L4`를 **그 실제 Primary**에 맞춘다. 교육과정 선후/학생 공급 가능 범위는 별도로 판단한다.

## 2. CrossConcept는 문제 확장을 위한 필수 독립 축 — 검색 후 없으면 즉시 등록

1. **Primary L3/L4가 확정된 직후, A1~C3 각각의 마지막 발문과 실제 풀이에 필요한 *추가* 개념을 먼저 추출한다.** 산술·기하평균, 최댓값·최솟값 실현, 판별식, 함수의 성질 등 개념적 추가 판단을 `CrossConcept`, 자연수·범위·양수 등 제약을 `Condition`, 사고 간 연결 방식을 `IntegrationPattern`에 구분한다. **Primary L4의 의미를 CrossConcept로 중복 계산하지 않는다.**
2. 기존 ACTIVE CrossConcept를 `archive/data/meta-foundation/canonical/concepts/*.json`, `archive/data/meta-foundation/compiled/concept_registry.json`(파생 조회용), 기존 Generated `archive/generated/lite/v1/2022/H1/**/extension-meta/*.json`의 `main` 및 작업 브랜치에서 의미·alias·parent를 검색한다. **단어만 찾고 종료 금지:** 설명/풀이 단계가 실제 같은지 보고 재사용한다. `CC_FUNCTION_EXTREMA`처럼 미분 맥락의 '극대·극소'를 고1 AMGM '최댓값·최솟값' 대신 억지로 쓰지 않는다.
3. **필요한 추가 개념이 아직 없으면 작업자가 직접 신규 CrossConcept를 확장·등록한다.** 별도 키 승인 대기나 단순 `EVIDENCE_DEBT`로 종료하지 않는다. 허용된 Generated-only `extension-meta`에 `EXT-CROSS-...` 고유키, 한국어 이름/정의, Primary 부모(L3/L4/ID), **원문항과의 추가 결정 단계**, 기존 유사 키와 비중복 근거, source exam/qid/SHA, 실제 example UID, 적용 대상 scope, 상태 `GENERATED_ACTIVE`를 저장한다. 신규 생성 후 **draft·Blueprint·Meta Registry·handoff의 UID별 참조와 Git 실파일까지 일치**시킨다. Generated ACTIVE와 전역 Canonical ACTIVE를 혼동하지 않는다.
4. CrossConcept는 한 문항에 **여러 개 허용**한다. 필요하면 여러 키를 등록하되 서로 다른 실제 풀이 단계로 입증한다. `[]`는 추가 개념이 정말 없을 때만 사용하며, 검색을 안 했거나 키가 없어서 비운 상태를 `NOT_APPLICABLE`로 가장하지 않는다.
5. A→B→C의 변화는 **Primary를 보존하면서 추가 CrossConcept/Condition/Integration 및 실제 결정적 사고를 달리 설계**한다. 여러 개념을 적었다는 사실만으로 변형의 품질이나 독립성을 주장하지 않는다. 최종 발문·풀이에서 적용하지 않은 '장식 키'는 삭제한다.

## 3. CrossConcept가 난이도에 미치는 영향까지 UID별 근거화

- 각 UID의 **Primary 핵심 판단 → CrossConcept별 추가 판단 → Condition에 따른 분기·예외·경계 → Integration 선후 의존성 → 오답 유발 단계**를 구체적인 풀이식/분기와 1:1로 연결한다.
- 학습 `level=하/중/상`과 평가 `difficultyBucket=1..5`는 **별개의 독립 근거**로 판정한다. 추가 CrossConcept가 사고 단계를 늘리거나 동시에 여러 제약을 통합·검산하게 만들어 평가 난도가 높아질 수 있으나, **키의 개수나 A/B/C 슬롯만으로 자동 가산하지 않는다.** 단순 계산량, 숫자 크기, 외형상 복잡함과 실제 개념 결합 난도를 구별한다.
- 제작 Blueprint에 문항별 `primaryRPM (ID·L1~L4·권위)`, `searchedRPMAndExtPaths`, `crossConceptKeys[] + perKeyDecisiveStep + extensionEvidence`, `conditionKeys[]`, `integrationPattern`, `learningLevelReason`, `difficultyBucketReason`을 남기고, **최종 학생 발문·해설 기준으로 역판정**한다. 모든 필드가 저장용 생성 JS/Meta Registry에 연결되어야 하며, 학생용 출시가 포함될 때는 Consumer/index UID 동등성까지 확인한다.
- 종료/인계 증거: **9 UID 모두** 기존 L3/L4 대조 여부, 유효 CrossConcept(기존 ACTIVE 또는 신규 GENERATED_ACTIVE)와 등록 실파일, 실제 추가 사고, Condition·Integration 구별, 난도 두 축의 구체적 이유, `NOT_RUN` 항목을 빠짐없이 확인한다. 정본 검색·신규키 등록을 미수행하고 '메타 완료' 금지.

## 4. q13 네거티브 사례 — 다음 q14에서 반복 금지

- **잘못된 처리(폐기된 판단):** 원본이 공통수학2 명제라는 이유로 `H1-RPM-250 (증명)`을 먼저 붙임 → `CC_AM_GM`을 뒤늦게 추가 → 최솟값 L3 없음이라는 모호한 부채 선언. 이것은 기존 RPM L3/L4 의미검색과 CrossConcept 확장을 모두 충분히 수행하지 않은 사례다.
- **실제 수정 완료된 정본:** q13 A1~C3 9 UID의 **Primary `H1-RPM-182`** (2022 공통수학1, L3 절대부등식 / L4 산술·기하평균), 활성 PT/TPL `PT_ABSOLUTE_INEQUALITY_EXTREMUM` / `TPL_AMGM_MINIMUM`. `CC_AM_GM`은 Primary L4와 중복되므로 추가 축에서 제외하고, 추가 CrossConcept **`EXT-CROSS-H1-C-06-MAXMIN` (최댓값·최솟값 판단)** 을 `GENERATED_ACTIVE`로 등록해 9/9 UID 연결함.
- 해당 생성 확장 실파일: `archive/generated/lite/v1/2022/H1/H22-C-06-HIGHER_INEQUALITY/extension-meta/palma25-2final-q13-maxmin.json`. 원본 공통수학2 출처와 생성 타깃 공통수학1 분류는 분리 보존. **`H1-RPM-182 DIRECT_BINDING_GAP`은 L3 미존재가 아니라 해당 과목의 PT 직접 binding 부재**이며 별도 기술 부채일 뿐, 올바른 Primary·CrossConcept 배정을 막지 않는다.
- q13은 이미 메타 핀포인트 수정으로 마감됐으므로 **q14 이후 제작에 위 검색→확장→난도 반영을 선행 적용**한다. q13 이력 아래의 옛 `H1-RPM-250 / CC_AM_GM` 기록은 `SUPERSEDED`일 뿐 현재 지시나 신규 생성의 기준이 아니다.

---

# CURRENT CORRECTION — q13 Primary + CrossConcept realignment (2026-10-15)
- Actual q13 9/9 Primary **H1-RPM-182**: 2022 공통수학1, L1 방정식과 부등식 / L2 여러 가지 부등식 / L3 절대부등식 / L4 산술·기하평균. The original 2025 팔마고 고1 2기말 q13 remains 공통수학2 source; generated target course/unit changed to H22-C-06 / H22-C-06-HIGHER_INEQUALITY.
- CrossConcept **EXT-CROSS-H1-C-06-MAXMIN (최댓값·최솟값 판단) GENERATED_ACTIVE** registered at `archive/generated/lite/v1/2022/H1/H22-C-06-HIGHER_INEQUALITY/extension-meta/palma25-2final-q13-maxmin.json` and bound 9/9. Original CC_AM_GM is absorbed into Primary L4, not duplicated as CrossConcept. B equalities and C constrained integer minima remain covered.
- Canonical H1-RPM-182 crosswalk says DIRECT_BINDING_GAP: actual RPM L3 is resolved, but 2022 commonmath1 exact PT binding remains absent, recorded accurately. No canonical RPM mutation. Draft 117/207, next q14; formal independent, browser, consumer, main NOT_RUN.

# HISTORY — q13 최초 제작 당시 기록 / SUPERSEDED BY CURRENT HARD ABOVE (2026-10-15)
- Branch `work/alive-25-palma-h1-2final-qid9`; q01~q12 108 protected, q13 A1~C3 new 9 AUTHOR candidates; cumulative **117/207**, remaining 90, firstMissing=q14.
- Original q13: `(x+y)(4/x+9/y)` for x,y>0, minimum25, equality 2y=3x. Original and legacy unchanged (0d12b75e824ab47f08fc3b5a6180be595f882c6e).
- Semantic nearest H1-RPM-250, but 2022 H22-C2-06 exact AMGM extremum RPM L3 is NOT verified: EVIDENCE_DEBT (do not call DIRECT_ACTIVE). ACTIVE PT_ABSOLUTE_INEQUALITY_EXTREMUM and TPL_AMGM_MINIMUM, H22-C2-06-CORE binding.
- q13 CrossConcept **CC_AM_GM ACTIVE** from canonical algebra.json, updated 9/9 UID Meta/Blueprint/Receipt. RPM H1-RPM-250 L3=증명; 산술·기하평균 is H1-RPM-182 L4 for common math1, not a separate L3. Exact common math2 RPM direct mapping remains separately unverified (do not invent a new L3).
- 9 complete five-choice items; 45 options, 36 number-indexed distractor error derivations, detailed solutions, independent level/bucket reasons, UID Meta, reverse-stem KEEP.
- Problem SVG9 EXEMPT; C1/C2/C3 beneficial solution numberline SVG3 (actual Git blobs, integer optimization math and coordinates author checked); browser NOT_RUN.
- sourceUid exact9 EVIDENCE_DEBT; cumulative117. Independent quality, Consumer/index, main NOT_RUN. q14 next.
- q13 PREFLIGHT/BLUEPRINT/CREATE_DRAFT/AUTHOR_RECEIPT, assets/q13/C1~C3, META/PROGRESS/HANDOFF updated in one Git commit.

# CURRENT TOP — q12 AUTHOR COMPLETE / q13 NEXT (2026-10-15)
- Branch `work/alive-25-palma-h1-2final-qid9`. q01~q11 99 unchanged; q12 A1~C3 new 9 AUTHOR candidates; cumulative **108/207**, remaining 99, firstMissing=q13.
- Original q12 sqrt(a-b)>sqrt(a)-sqrt(b) for a>b>0; square-difference proof. Original exam and legacy similar unchanged (0d12b75e824ab47f08fc3b5a6180be595f882c6e).
- Primary H1-RPM-250 (증명), L4 절대부등식 증명, FAMILY_ACTIVE; ACTIVE PT_ABSOLUTE_INEQUALITY_PROOF + TPL_SQUARE_COMPARISON_PROOF; H22-C2-06-CORE curriculum binding.
- 9 complete questions, 45 five choices, 36 index-linked actual error paths, student solutions and UID level/bucket/Meta evidence, reverse stem KEEP.
- 9 problem SVG EXEMPT, 3 solution numberline SVG C1/C2/C3 from Python verified boundaries; 6 solution SVG EXEMPT. Browser NOT_RUN.
- sourceUid 9 EVIDENCE_DEBT, cumulative 108. Independent review, Consumer/index, main NOT_RUN. Next q13.
# CURRENT TOP — q11 AUTHOR COMPLETE / q12 NEXT (2026-10-15)
- Branch `work/alive-25-palma-h1-2final-qid9`; q01~q10 보호 90/207, q11 A1~C3 신규 9개 제작, 누적 **99/207**, 108개 남음, firstMissing=q12.
- Original q11: f(x)=x²−6x+a (x≥3), 역함수 그래프 접점, original answer a=49/4. 원본 JS·원본 q11 해설 SVG 및 기존 유사문제 불변.
- Locked H1-RPM-256 역함수; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_INTERSECTION. H22-C2-07-FUNCTION_INVERSE PT binding 확인; RPM crosswalk DIRECT_ACTIVE 오인 금지.
- A1~C3 9문항·객관식 보기 45·실제 오답경로 36, 학생용 상세 해설, level/1~5 difficulty 독립 이유, 역발문 KEEP.
- 문제 SVG 필요 없음 9; 해설용 실제 SVG 9 blob. Python 수학 검산, SVG 균등축 좌표 모델 및 author static 점 검사. 실제 Chrome/브라우저 NOT_RUN.
- SourceUid exact 9 EVIDENCE_DEBT, 누적 99. Formal independent, Consumer/index, main NOT_RUN. 다음 q12의 원본과 이미지부터 조사.
- q11 PREFLIGHT/BLUEPRINT/CREATE_DRAFT/AUTHOR_RECEIPT, assets/q11/A1~C3-solution.svg, Meta registry와 progress 원장 갱신.

# CURRENT TOP — q10 AUTHOR COMPLETE / q11 NEXT (2026-10-15)
- Branch `work/alive-25-palma-h1-2final-qid9`; previous q01~q09 81/207 preserved unchanged, q10 A1~C3 +9 AUTHOR candidates: **90/207**, pending 117, firstMissing=q11. All original exam and legacy similar untouched.
- Original q10 `archive/exams/original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js` Git blob `0d12b75e824ab47f08fc3b5a6180be595f882c6e`: f=x+k, g=kx+1, g∘f=f∘g, k≠0, answer k=1(④). No original problem picture.
- RPM Primary H1-RPM-253 L3 합성함수, crosswalk DIRECT_ACTIVE (default direct composition PT_COMPOSITION_EVALUATION). Actual f∘g=g∘f decisive step uses separately ACTIVE PT_COMPOSITION_PROPERTIES/TPL_COMPOSITION_RELATION_CONDITION on H22-C2-07-FUNCTION_COMPOSITION, plus Generated EXT L4 affine vs quadratic commutation registry. RPM LOCKED untouched. Existing Geumdang branch-only candidate noted for future alias; no arbitrary canonical promotion.
- A1~C3 9 school-style problems, 45 five choices, 36 1:1 wrong calculation routes, student-reproducible explanations, individual level & difficulty reasons and Reverse Stem KEEP. 9 problem SVG EXEMPT. 3 solution SVG (C1 k root filtering, C2 coefficient table, C3 pairwise commutation relations), 6 solution SVG EXEMPT. SVG static fact parity checked, browser NOT_RUN. Python SymPy current-run exact nine commutation checks.
- New sourceUid exact 9 EVIDENCE_DEBT; cumulative 90. Independent formal/open-book quality, Browser, Student Consumer/index, production main NOT_RUN. Candidate Git push not student release.
- q10 evidence: Q10_PREFLIGHT / Q10_AUTHOR_BLUEPRINT / Q10_CREATE_DRAFT / Q10_AUTHOR_RECEIPT and q10 generated L4 registry + C1/C2/C3 SVG. q01~q09 authored files and old receipts protected.
- Next q11 original source and any image/SVG must be inspected before q11 9-slot author; same-branch one source qid independent commit. Q10 answer counts ①0 ②0 ③6 ④3 ⑤0; natural order retained, full 207 index balancing later.

# CURRENT TOP — q09 AUTHOR COMPLETE / q10 NEXT (2026-10-15)
- Branch `work/alive-25-palma-h1-2final-qid9`: q01~q09 81/207 AUTHOR candidates, remaining 126, firstMissing q10. Previous q01~q08 candidate/asset, all originals and legacy similar questions unchanged.
- Original q09 source JS blob `0d12b75e824ab47f08fc3b5a6180be595f882c6e`: f(x+y)=f(x)+f(y) for all real x,y, f(2)=4, target f(5)=10, answer ①. Original source has no image; category 함수의 성질, subunit FUNCTION_BASIC.
- RPM H1-RPM-258 anchor L3 함수의 성질; existing L4 항등함수·상수함수 **semantic NONMATCH**, despite crosswalk status DIRECT_ACTIVE. Do not falsely claim L4 direct match. Actual ACTIVE PT_FUNCTIONAL_EQUATION + TPL_FUNCTIONAL_EQUATION_ADDITIVE with exact H22-C2-07-FUNCTION_BASIC binding. Generated-only EXT L4 three keys (ADDITIVE-VALUES, SHIFTED-ADDITIVITY, BILINEAR-ADDITIVITY) registered separately under archive/generated/lite/v1/2022/H1/H22-C2-07-FUNCTION_BASIC/extension-l4/palma-2025-2final-q09-registry.json. RPM LOCKED unmodified.
- q09 A1~C3: 9 student questions, 45 natural ordered five-choice values, 36 derived distractor calculations, student-reproducible public solutions, independent reasoning for learning level and difficultyBucket. C1 2xy correction recurrence and f(5)=40; C2 5<n≤8 natural values 6,7,8; C3 xy correction recurrence and valid n=5..8. All nine problem SVG EXEMPT, 3 solution SVG (C1 recurrence table/C2 numberline/C3 bounds table), six solution SVG EXEMPT. SVG actual primitive values static AUTHOR_CHECK; student Chrome NOT_RUN.
- One source qid SHA preserved; sourceUid exact 9 EVIDENCE_DEBT, cumulative 81. Quality open-book independent, actual browser, Student Consumer, production main NOT_RUN; candidate Git author closure not release.
- New evidence: `GPT_QID9_Q09_PREFLIGHT.json`, `GPT_QID9_Q09_AUTHOR_BLUEPRINT.json`, `GPT_QID9_Q09_CREATE_DRAFT.json`, `GPT_QID9_Q09_AUTHOR_RECEIPT.json`, extension registry and 3 SVGs. Previous approved/created files untouched.
- Next source q10 one qid×9, same branch independent commit, current main and branch readback first. AnswerIndex q09 ①0 ②2 ③3 ④3 ⑤1; natural ascending kept, full 207 distribution final stage.

# CURRENT TOP — q08 AUTHOR / q09 NEXT (2026-10-14)
- Branch `work/alive-25-palma-h1-2final-qid9`; previous q01~q07 63/207, q08 A1~C3 +9 AUTHOR candidates: total **72/207**, next q09, remaining 135. All earlier candidate/original/legacy files protected.
- Actual original source q08 blob `0d12b75e824ab47f08fc3b5a6180be595f882c6`, formula-only f(x)=x+2; f^10(2)=22; no original q08 image. Locked Primary L3 H1-RPM-253 합성함수 (crosswalk DIRECT_ACTIVE default direct evaluation). Actual decisive repeated composition uses independently ACTIVE PT_ITERATED_COMPOSITION and TPL_ITERATION_RULE / TPL_ITERATION_IDENTITY_ORDER / TPL_ITERATION_PERIOD, not misreported as direct PT crosswalk.
- q08 A1~C3 9 problems/45 naturally sorted numeric choices/36 1:1 calculated wrong-option routes; levels and buckets are independently justified; HTML function tables in C1/C3; **2 new solution SVGs** for actual finite-cycle relations. All nine problem SVG separately exempt and seven solution SVG separately exempt for text-complete arithmetic. Visual directed-edge static author parity checked; actual student render NOT_RUN.
- Q08 files: `GPT_QID9_Q08_PREFLIGHT.json`, `GPT_QID9_Q08_AUTHOR_BLUEPRINT.json`, `GPT_QID9_Q08_CREATE_DRAFT.json`, `GPT_QID9_Q08_AUTHOR_RECEIPT.json`, `assets/q08/C1-solution.svg`, `assets/q08/C3-solution.svg`.
- SourceUid exact identity 9 EVIDENCE_DEBT, cumulative 72; independent quality, actual browser, Consumer/index, main launch NOT_RUN. Author CREATE is not formal quality approval.
- Last q07 evidence/old handoff preserved below. Next firstMissing=q09.

# CURRENT TOP — q07 제작 / q08 시작 (2026-10-14)
- 브랜치 `work/alive-25-palma-h1-2final-qid9`, 실제 q01~q07 신규 후보 63/207, 첫 미제작 q08, 남은 144. q01~q06 변경 0.
- source q07 `archive/exams/original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js` blob `0d12b75e824ab47f08fc3b5a6180be595f882c6e`, 본문 수식 기반 최댓값(그림 없음).
- RPM L3 H1-RPM-264 유리함수의 활용, RPM L4 유리함수의 최대·최소 **RPM_ONLY**. PT_FUNCTION_EXTREMUM/TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT/TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL 별도 ACTIVE 정본. 모든 UID meta 상세 이유는 Q07_CREATE_DRAFT 및 Q07_BLUEPRINT.
- 9문항 보기45·정답9·오답 실제 계산경로36. 난이도 하4/중3/상2는 슬롯 할당이 아닌 실제 사고 판단, 평가 난이도2~5 독립 근거와 함께 저장.
- 문제 시각자료 9 EXEMPT(식으로 조건 충분). 해설 5 실 SVG / 4 EXEMPT: 유리함수 그래프 B2/C1/C2, 경우표 B3/C3. Python SymPy exact endpoints/count check 실행; SVG 실제 점/곡선 역산 정적 대조 완료. SVG 경로는 검증 수학모델의 deterministic JS sampling이며 Python 좌표 직접 생성으로 허위 기록하지 않음. 실제 학생 브라우저 렌더 NOT_RUN.
- sourceUid exact 9 EVIDENCE_DEBT, 누적 63. 별도 독립 품질검사·Consumer·main NOT_RUN. next q08.

# CURRENT TOP — q06 신규 9문항 제작 / 다음 q07 (2026-10-14)
- 작업 브랜치 work/alive-25-palma-h1-2final-qid9; q01~q06 누적 54/207, q01~q05 보호/불변. 첫 미완료 q07, 남은 153.
- 원본 q06 archive/exams/original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js; blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e, 학생용 원문 이미지 없음(문자·수식). 원본 f(x)=(4x+5)/(x+1) 점근선 x=-1,y=4; f^(-1)(3)=-2.
- Primary RPM L3 H1-RPM-261 점근선과 위치/점근선; DIRECT_ACTIVE PT_RATIONAL_ASYMPTOTE / TPL_RATIONAL_ASYMPTOTE_DIRECT. 각 UID의 추가 사고·CrossConcept/Condition/난도 근거는 Q06_CREATE_DRAFT와 Q06_BLUEPRINT.
- A1~C3 신규 9, 보기 45/45, 오답 계산 경로 36/36, 문제 SVG 0(UID별 TEXT_ONLY EXEMPT), 해설 SVG 9개 actual Git blob. 수치모델 Python 대입/경계 검증, SHA·기하좌표 정적 제작 근거는 receipt+SVG. 독립품질·브라우저·Consumer·main NOT_RUN.
- q06 sourceUid exact 9개 EVIDENCE_DEBT, 누적 54개. 완료로 가장하지 않는다.
- 다음 q07부터 이어간다. 기존 q01~q06 신규 draft/메타/asset 보호, 별도 재제작 금지.

# 팔마고 q01~q23 작업자 품질 HARD LOCK

## CURRENT TOP — q05 완료 인계 / 다음 채팅은 q06부터 (2026-10-14)
- 현재 명시 지시: 한 채팅에서 원본 qid 하나 × 9(A1~C3) 제작 → 수학 검산·해설·메타·SVG·보기 정렬 → 원장·SHA 인계. 지금은 별도 독립 품질검사·브라우저·출시를 수행하지 않는다(NOT_RUN). q01~q05를 다시 제작하지 않는다.
- 같은 Git 브랜치 `work/alive-25-palma-h1-2final-qid9`에만 계속 누적, main 최신 재조회 후 브랜치 actual HEAD/PROGRESS 먼저 확인, 완료 qid 보호. 최신 브랜치 HEAD는 현재 작업 마감 후 재조회하여 receipt에 확정한다.
- 누적 q01~q05 **45/207**, 다음 q06, 나머지 162. `GPT_QID9_PROGRESS_CURRENT.json` firstMissing=6, `GPT_QID9_GENERATED_META_REGISTRY_v1.json` 45 UID. q05 원본 JS blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e, PNG blob 7cf6f0b4d35208e0dc97e8d2d19acb29220968ed.
- q05 `H1-RPM-270` **RPM_ONLY (DIRECT_ACTIVE 아님)**, 실제 ACTIVE PT=`PT_FUNCTION_RECOVERY`, TPL=`TPL_FUNCTION_FORM_FROM_GRAPH`, H22-C2-09-FUNCTION_BASIC current binding. q05 9문항 모두 끝점 A·점 P에서 f(x)=√(a+bx)+c를 복원하며, 이 단계가 실제 결정적 사고. `GPT_QID9_Q05_AUTHOR_BLUEPRINT.json` 설계/오답 근거·수학 파라미터와 `GPT_QID9_Q05_CREATE_DRAFT.json` 최종 UID별 5축 증거를 반드시 같이 읽는다.
- 새 문항에서는 **정답번호 분산을 제작 단계부터 보되, 오름차순 숫자보기·오답 오류경로·학교식 발문을 깨지 않는다.** q05 현재 ①2 ②2 ③2 ④2 ⑤1; q02~q05 누적 단일정답 분포 ①7 ②6 ③7 ④10 ⑤6. 마지막 전체 207문항에서 최종 재판정. q01은 복수정답이라 같은 분모에 섞지 않음.
- q05 문제 SVG 9/9·해설 SVG 9/9 원격 blob에 UID별 결속. 실제 Browser/독립검수/Student Consumer/main 미실행은 NOT_RUN. sourceUid exact 계산 미해결 q05 9개, 시험지 누적 45개 EVIDENCE_DEBT. 불명확한 검사 결과를 PASS라 주장하지 않음.
- q06도 제작 전 Notion GPT 작업 전 필독 라우터→Archive 생명주기/생성 5단계→최신 Git AGENTS/QID9/Metadata·교육과정/해설/Visual/Golden→원본 q06·실제 image→RPM Primary L3 잠금→A/B/C별 추가 사고 설계→9개 작성/점검→병합 전 changed scope 확인→원격 Git commit/readback→HANDOFF 갱신. **다른 학교/원본·q01~q05·레거시 유사문항 수정 금지.**

---


## 절대 최우선 3축
1. **교육과정 내 풀이:** 공통수학2 범위 개념·용어·방법만 사용. 미분·적분·벡터 및 고등 상위 과정 금지. 수학적 참값 검증 뒤 교육과정 수준에서 다시 풀이를 작성한다.
2. **해설 품질:** 학생이 글만 읽고 따라 풀 수 있어야 하며 판단 기준, 선택지별 판단 근거, 정답 및 오류 경로를 빠짐없이 적는다. 복수정답 강제 단일화 금지. 각 보기가 그림이면 그래프 5/5를 독립 판정해야 한다.
3. **SVG 품질:** 문제용·해설용을 독립 판정. 실제 좌표/곡선/열린점·닫힌점/라벨과 수학의 일치, 모바일 가독성을 확인한다. 문제 그림에 정답 힌트 금지. 해설 SVG는 핵심 판단 시각화. 실제 브라우저 렌더하지 않았다면 PASS로 기록 금지.

## 매 qid 인계 증거
- curriculumWithinScope N/N, explanationReproducibility N/N, problemSVGActualChecked N/N, solutionSVGActualChecked N/N, browserStatus, metaRegistryCrosswalk, reverseStemChecks 필수.
- q01 A1~C3 9개 제작 완료, 45 그래프, 문제 SVG 9+해설 SVG 9, 정답 ①, ④ / ①, ②, ⑤ / ②, ③ / ①, ④, ⑤ / ②, ③ / ①, ③, ⑤ / ①, ④, ⑤ / ①, ④ / ②, ③, ⑤.
- Canonical H1-RPM-251, PT_FUNCTION_DEFINITION_JUDGMENT, TPL_FUNCTION_JUDGMENT_GRAPH. 원본/기존 유사 23문항 보호. 새 창 다음 작업 q02.
- SourceUid exact hash 9 unresolved. 별도 품질검수/브라우저/Consumer/main NOT_RUN. 임의 승인·출시 선언 금지.

## 난이도 임의 배정 금지 — q01 보정 사항
- 반드시 최종 발문·실제 그래프·필수 판단 단계별로 학습 `level=하/중/상`과 평가 `difficultyBucket=1~5`를 독립 판정한다. A/B/C 위치나 보기 종류 수만으로 높게 매기지 않는다.
- q01 실제 문항별 난이도 재판정: A1=중/3, A2=하/2, A3=중/3, B1=중/3, B2=중/3, B3=중/3, C1=중/3, C2=중/3, C3=중/3 (학습/평가). 모든 UID의 결정적 사고와 난이도 이유는 Q01_CREATE_DRAFT.json 각 review에 기록.
- 품질 3축 고정(교육과정 내 풀이, 학생 재현 해설, 문제/해설 SVG 실제 수학 일치)을 난이도 판단 이전에 유지하고 별도 출력 전 검증한다.

## q02 AUTHOR DRAFT — 2026-10-14
- 원본 q02 실제 PNG( Git blob ed1383becc8c672e67557224b8a6c1a5459ea1f6 )·원본 JS blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e 확인; f(2)=4,f(3)=2,f(4)=3, g(2)=2,g(3)=4,g(4)=3.
- L3 H1-RPM-253 합성함수 / L4 합성함수 계산 DIRECT_ACTIVE; UID별 ACTIVE PT/TPL·난도·조건·역발문·오답 근거는 q02 JSON 및 Metadata registry.
- A1~C3 9개 AUTHOR_DRAFT_ONLY, 문제 SVG 9개+해설 SVG 9개 Git blob 결속, 각 UID self math/choice/curriculum/Meta/visual 필요성 기록. Python 좌표 수치·수학 계산 실행; 실제 Archive 브라우저 렌더·외부 독립검수·Consumer·main은 NOT_RUN.
- q02 exact sourceUid 9개 EVIDENCE_DEBT. q01 9개 그대로 보호. 18/207 후보, next q03. q03은 같은 source-read→5축 설계·작성·검증·Git 누적.

## QID9 정답번호 3×3 분산 HARD — 2026-10-14 형님 직접 확인
- 신규 원본 qid A1~C3 9문항의 객관식 정답번호는 ①~⑤ 각 1~2개(2/2/2/2/1)로 분산한다. **3×3 가로 A/B/C와 세로 1/2/3 모두 번호 중복·쏠림을 각각 확인한다.** 숫자만으로 채우지 말고 최종 배치표를 제작 ledger에 남긴다.
- 정답 수학값/content/실제 함수/SVG는 바꾸지 않고, 보기의 순서가 가변적인 문항만 재배열한다. 그 때 choices/answer/solution 결론/오답 네 개의 번호→실제 계산값 근거/receipt를 동기화하여 최종값으로 표적 재검한다. 원문 보기 또는 순서의 의미가 잠긴 경우 임의 재배열 금지. 숫자 보기 오름차순 자체는 순서 보호 근거가 아니다.
- q02 수정 분포: A=[③,①,⑤], B=[②,④,①], C=[④,⑤,②]. 번호 빈도 ①2 ②2 ③1 ④2 ⑤2. q01 원문 그림 복수정답은 이 3×3 단일 정답 분산의 일괄 대상이 아님. q03 이후 제작 전/후 적용.
- q02 본문 수학과 그림 원본/문제SVG/해설SVG/Meta 난도는 불변. 9개 문항 선택지 순서·번호·결론·오답 근거만 재조정. 독립검수 및 브라우저는 NOT_RUN 유지.

## CURRENT USER OVERRIDE — 2026-10-14 정답번호 분산 최종 시험지에서 처리
- 이전 3×3 번호 분산은 현재 qid별 제작의 강제 마감 조건이 아니다. 23원본 × 9 = 207개 전체 문제의 마지막 제작이 끝났을 때 정답 분포를 최종 조정한다. 작성 중에는 답 인덱스 기록만 유지하고 수학·오답·해설·메타 품질을 우선한다.
- 이번 작업에서 독립 품질검사와 브라우저 출력은 사용자 지시로 제외하며 상태는 NOT_RUN. 이전 완료문항은 재검하거나 정답번호를 다시 바꾸지 않는다.
## q03 AUTHOR DRAFT — 2026-10-14
- 원본 q03 역함수 대응도 f(2)=4, g(4)=3 → f⁻¹(4)+g(4)=5; source JS blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e, PNG blob ed1383becc8c672e67557224b8a6c1a5459ea1f6.
- 원본 L3 H1-RPM-255 역함수 DIRECT_ACTIVE. A1~C3 9개 신규 AUTHOR_DRAFT + 문제SVG9 + 해설SVG9 Git blob 기록; 각 UID 해설·정답·오답4·난이도2축·Meta·이미지 필요성 기록.
- q03 sourceUid exact 9건 EVIDENCE_DEBT, 독립검수/브라우저/Consumer/운영 main NOT_RUN. q01·q02 원본/후보/자산과 기존 유사문제 변경 0.
- 누적 27/207, 다음 시작 q04. 전체 207문항의 정답 분산은 마지막 종합단계로 미룬다.

## CURRENT USER OVERRIDE — q04부터 정답·보기 분산을 제작 중 관리 (2026-10-14 최신)
- 형님 현재 지시: 정답 분산이 최우선은 아니지만 **나중에 숫자 보기의 자연스러운 순서를 망가뜨리지 않도록 제작할 때부터 답 위치를 고려해 설계**한다. 207개 전체의 최종 분포는 마지막에 확인한다. 과거 “제작 중 분산 신경 쓰지 않음”과 qid별 3×3 강제 재배열 문구는 현재 지시로 대체한다.
- 숫자 보기는 가능한 한 오름차순, 사분면 조합도 제1·2·3 / 제1·2·4 / 제1·3·4 / 제2·3·4 / 제1·2·3·4의 의미순을 유지한다. **정답 번호를 맞추려고 2, 4, 1, -5, 100 같은 무질서한 순서를 만들지 않는다.** 핵심 풀이·문제 품질 먼저, 자연스러운 선택지에서 다양한 정답 위치를 제작 시 확보한다.
- q02 현재 정답번호 분포 ①2 ②2 ③1 ④2 ⑤2, q03 ①2 ②0 ③1 ④4 ⑤2, q04 ①1 ②2 ③3 ④2 ⑤1. 현재 단일정답 q02~q04 27문항의 누적 분포 ①5 ②4 ③5 ④8 ⑤5. q01은 복수정답 그래프 문제이므로 이 통계에서 제외. 최종적으로 전체 조합을 다시 판단한다.
## q04 AUTHOR DRAFT — 2026-10-14
- 원본 q04 유리함수 y=5/(3-x)-2, 정답 제1·3·4사분면. 원본 JS SHA 0d12b75e824ab47f08fc3b5a6180be595f882c6e, RPM H1-RPM-262 DIRECT_ACTIVE (점근선과 위치 / 그래프의 사분면).
- q04 A1~C3 9개 후보, 보기 45개/오답 근거 36개, 문제 그림은 문항별 EXEMPT(식으로 정보 충분), 해설 SVG 실제 9개 Git blob. 난이도 하중상/1~5, PT/TPL·CrossConcept/Condition·교육과정 및 SVG 모델 근거는 Q04_CREATE_DRAFT.json에 UID별 보존.
- 경계 검산: B3 -3<k<0 정수 -2,-1 두 개, C1 a>6 자연수 7~10 네 개, C2 2<m<6에서 최소 3, C3 -2<k<0인 정수 -1 유일. SVG는 함수 좌표 샘플 모델/점근선 정적 결속; 실제 Chrome NOT_RUN.
- q04 sourceUid 9개 EVIDENCE_DEBT, 독립 품질검수·브라우저·Consumer/main NOT_RUN. 기존 q01~q03 제작물·기출원본·레거시 유사문제 변경 없음.
- 누적 36/207, 다음 시작 원본 q05. q05 생성도 자연스러운 보기 순서와 정답 번호 누적 모니터링을 제작 단계에서 수행.


## q14 AUTHOR DRAFT — 2026-10-15
- q14 원본 함수 f(x)=1/x 자기역함수 / I·III 사분면 / f와 f⁻¹ 전체 그래프 일치=무한 공통점, y=x 고정점 ±1 두 개. 원본 blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e 불변.
- Primary H1-RPM-256 (공통수학2·역함수·그래프 대칭) DIRECT_ACTIVE, PT_INVERSE_GRAPH. 기존 TPL_INVERSE_GRAPH_GEOMETRY 거리/대칭형 재사용; 중첩/공통점 전용 Generated template 2종은 archive/generated/lite/v1/2022/H1/H22-C2-07-FUNCTION_INVERSE/extension-meta/palma25-2final-q14-inverse-graph.json에 등록.
- 신규 CrossConcept EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT (GENERATED_ACTIVE) A1/A2/B3/C1 4 UID 연결. 다른 5 UID에는 필요한 CC_DISTANCE_TWO_POINTS, CC_DISCRIMINANT, CC_QUADRATIC_EQUATION, CC_SIMULTANEOUS_EQUATION 등 ACTIVE 키만 재사용. CrossConcept-Condition-Integration 구분·난이도 두 축 UID별 저장.
- q14 신규 9문항, 객관식 45보기/오답 유도 계산 36개, 해설 SVG9 실파일 Git blobs/Python Sympy inverse 및 equal-axis 수치 검증. 문제 SVG9 EXEMPT. 독립검수/실브라우저/Consumer/index/main=NOT_RUN; sourceUid exact hash=EVIDENCE_DEBT.
- 완료 진도 **126/207**, 다음 **q15**. q01~q13, 원본·기존 유사문항 모두 불변.
