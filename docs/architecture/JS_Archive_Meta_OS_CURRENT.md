# JS Archive 메타 통합 운영체제 (Meta OS) — CURRENT

기준일 2026-11-11 (사용자 결정으로 신설), 2026-11-14 방향 원칙 6 범위 확대. 문항 메타 규칙의 **단일 입구**다. Git이 유일한 정본이고 Notion·Drive는 작업 폴더·참고 링크다. 새 규칙을 만들지 않고 흩어진 현행 조항을 한 곳에 한 번만 적으며 끝 괄호에 출처(약칭)를 단다. "(제안)"은 결정되지 않은 통일안이다.

## 0. 방향 원칙 (사용자 지시 2026-11-11)

> 엄격하게 승인하는 것이 목표가 아니다. 있는 메타를 최대한 활용하는 것이 목표다. 할 일은 갈라져 있는 것을 하나로 묶는 것이다.

1. **상태는 문지기가 아니라 꼬리표다.** 승인·검토 대기는 값을 막는 문턱이 아니라 값이 어디서 왔고 얼마나 확인됐는지 알려 주는 표시다. 이유: 2026-10-29 사용자 결정 "일반 사용은 검토 상태를 문턱으로 삼지 않는다"가 이미 코드에 있다 (`archive/archive2-core.js` `generalUseEligibility` 주석, [UL]).
2. **같은 사실이 여러 곳에 있으면 정해진 우선순위로 하나의 "쓸 값"으로 합친다.** 어느 한 곳에라도 판정된 값이 있으면 화면이 쓸 수 있어야 한다 (2.3).
3. **막는 것은 실제 결함뿐이다.** 다른 문항의 값이 붙은 경우, 본문이 바뀌어 값이 더는 그 문항을 가리키지 않는 경우, 키가 사전에 없어 뜻을 알 수 없는 경우 (3장). 화면은 값이 있으면 쓴다(결정됨).
   **엄격 경로와 일반 경로를 둘로 나누지 않는다 (2026-11-11 사용자 결정).** "값이 있으면 쓸 수 있어야 한다. 이유가 있어서 이미 정해 놓은 값이다." 3장 표의 엄격 조건은 한 갈래(값 + 실제 결함 없음)로 합친다. 난이도부터 고치고 소단원·유형이 뒤따른다. 난이도 칸이 숫자가 아니거나(하/중/상 등 약 3,559행) 비어 있는(약 3,966행) 문항은 쓰지 못하는 것이 맞다. 환산하지 않고 난이도 라인이 채우며, 병합할 때 한 번 더 검수한다.
4. **잠긴 계약은 그대로다.** 예약 CREATE/R1~R3는 Git에 쓰지 않는다 ([SJ] 금지 3) / 사후 FINAL QA는 PT·TPL 신규 검수를 하지 않는다 ([FQ] §2-5) / R1 블라인드 동결 ([REQ] 단계별 책임) / 4칸 미작성·STALE을 출제 차단 조건으로 만들지 않는다 ([4S] §14) / PT·TPL은 공식 Resolver 결과만 ([RES] §0) — 단, Resolver에 대응 값이 없는 경우는 6의 2026-11-14 결정을 따른다 / 값을 추정해 만들지 않고 확인하지 않은 것을 확인했다고 적지 않는다 ([REQ] §3).
5. **"최대 활용"은 이미 판정된 값을 버리지 않는다는 뜻이지 없는 값을 지어낸다는 뜻이 아니다.** 빈 칸은 `EVIDENCE_DEBT`/`UNKNOWN`으로 두고 가짜 `NONE`·추정 키로 채우지 않는다.
6. **새 값은 받아 두고 나중에 묶는다 (2026-11-11 사용자 결정).** 사전·묶음표에 없는 새 키는 미분류로 받아 두고, 묶기는 나중에 따로 한다. 값을 받는 일과 정리하는 일을 한 문턱에 두지 않는다.
   **범위 확대 (2026-11-14 사용자 결정).** 단원·소단원·RPM L1~L4뿐 아니라 PT·TPL과 4칸도 같은 방향이다. 표·사전·Resolver에 맞는 값이 없다는 이유로 칸을 비우거나 보류하지 않는다. 문항을 읽고 판정한 새 값을 이름·상위·이유와 함께 미분류로 받아 둔다. 받은 값은 덮어쓰지 않는다. 같은 뜻의 값들을 하나로 묶는 상위 묶음(예: "이 PT와 이 PT는 같으니 이 묶음")은 별도 층으로 나중에 정하고, 화면은 묶음을 읽는다. 묶이지 않은 값은 미분류 묶음으로 보인다. 이유: "정본에 없어서 못 넣는다"로 작업이 멈추고 칸이 비는 일을 없앤다. 4의 "PT·TPL은 공식 Resolver 결과만"은 Resolver가 값을 내는 경우에 그대로 적용하고, Resolver에 대응 값이 없는 경우에 이 항으로 새 값을 받는다(이 경계는 작성자 해석이며 사용자 확인 전이다). 새 값도 추정으로 지어내지 않는다(5). 이 결정으로 바뀐 것은 방향뿐이다. 봉인 문서·코드·등록 경로는 그대로이며, 새 값을 받는 자리(필드·등록기·묶음표)를 여는 일은 후속 작업이다.

1단계는 문서와 어휘만 다룬다. 코드·정본 값·등록 경로는 바뀌지 않았다. 통합 값을 화면이 한 곳에서 읽게 하는 일은 2단계다. 짝 파일: 필드 사전 `archive/data/meta-os/field-dictionary.json`(159필드의 층·종류·별칭), 상태 어휘 `archive/data/meta-os/status-vocabulary.json`(상태 값 → 등급 또는 결함), 점검 도구 `archive/tools/meta-os/audit.mjs`(읽기 전용, **활용 격차** 포함).

**읽는 길.** 유사·생성 문항 1개의 메타 완성 = 이 문서 + [4S] + 자기 역할 문서. 신규 기출 CREATE/R1~R3 = 이 문서 + `docs/rules/02_PIPELINES/gpt-reservation/<역할>_CURRENT.md`. 사후 FINAL QA = [FQ] + 이 문서. 등록 요청 = [V2] + 4·5장. Notion·Drive에만 있는 규칙은 → 9장.

**출처 약칭.** [MD]=`docs/agents/metadata.md`(절 제목 인용), [CM]=`docs/agents/common.md`, [REQ]=[의미 메타 계약](JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md), [RES]=[단일 Resolver](JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md), [SJ]=[소형 JSON 쓰기](JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md), [MM]=[병합 후 자동 등록](Archive_Main_Merge_Auto_Metadata_CURRENT.md), [UL]=[usable-meta lane](Archive2_Usable_Meta_Lane_CURRENT_v1.md), [V2]=[등록 v2](Reviewed_Exam_Meta_Registration_v2.md), [4S]=[4칸 계약](JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md), [4A]=[4칸 자동 등록](Archive_4Slot_Auto_Registration_CURRENT.md), [4R]=[4칸 검수·반영](../operations/JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md), [CO]=[수정 AI 책임](Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md), [PB]=[생성문항 공통 Meta](Problem_Bank_Unified_Meta_Assessment_Contract_CURRENT_v1.md), [FQ]=[FINAL QA 카드](../operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md), [DM]=[심화 메타 라우터](../operations/DEEP_META_PIPELINE_ROUTER_CURRENT.md), [SA]=[학생 이용 우선](../operations/META_PIPELINE_STUDENT_ACCESS_FIRST.md), [GR]=[예약 공용 정본](../rules/02_PIPELINES/gpt-reservation/README_CURRENT.md), [AG]=[ALIVE](../agents/alive-generated.md). 봉인(`docs/rules/MANIFEST.md` 등재, 읽기만): [FD]=[파운데이션 규칙](../rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md), [DF]=[난이도 v1.3](../rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md), [RI]=[규칙 색인](../rules/00_RULES_INDEX.md).

## 1. 메타의 층

| 층 | 뜻 | 누가·무엇을 보고 판정 | 금지 |
| --- | --- | --- | --- |
| 식별 | UID(`qid_v1_`+파일 경로#순번의 sha256)와 본문 지문. `sourceFingerprint`=발문·보기·정답·해설·그림, `contentFingerprint`=발문·보기·그림 | 기계(`question_identity_map.json`, 등록기) | UID 새로 만들기, 지문이 다른 문항에 값 붙이기 ([4A], [UL]) |
| 교육과정 | 과정(2015/2022·과목) → `standardUnitKey` → `subUnitKey` | 문항을 읽고. 키는 마스터에 실제 있어야 함 | `RAW-`·`RRAW-`·`UNMAPPED-`·`PROPOSED-` 키를 정식 분류로, label·order·parent 불일치, 2015↔2022 변환 ([REQ] §2, [UL]) |
| RPM L1~L4 | 사고 위치. L3=핵심 전략(PT로 투영), L4=풀이 구조(TPL로 투영). 정본 `CANONICAL_MASTER.json`(LOCKED) | 교육과정 안에서 학생이 재현할 최종 풀이의 `primaryMethod`·`decisiveStep`을 확정하면 경로가 정해지고 의미는 FINAL | 근거 없이 새로 쓰기·바꾸기, CC로 Primary 대체, 교육과정 밖 해법 ([FD] §1.4, [RES] §1·3) |
| 유형·관계 | PT/TPL(기계 키), CrossConcept(Primary 밖 결정 경로 개념), Condition(값·부호·범위 제한), Integration(`NONE`·`SEQUENTIAL`·`INTERDEPENDENT`·`REINTERPRETATION`·`CASE_BRANCH`·`DEEP_COMPOSITE`) | CC·Condition·Integration = 해설의 실제 역할을 읽고. **PT/TPL = 공식 Resolver 결과만** | PT/TPL 추정·재발명, 키 이름만 보고 치환, Primary를 CC로 중복, 가짜 `NONE`·`[]` ([RES], [FD] §5·6·8) |
| 난이도 | `level`(하/중/상)과 `difficultyBucket`(1~5)은 서로 독립 판정. 보조 3값: `difficultyConfidence`(high/medium/low), `difficultyBoundaryFlag`(NONE/B12/B23/B34/B45), `legacyLevelCompatibility`(level·bucket 교차 점검, 환산 아님) | 최종 발문·보기·그림·풀이의 사고·조건·함정으로 | level에서 환산, 계산량·해설 길이·형식으로 판정, `UNKNOWN` 추정 ([DF] §2·11, [REQ] §2·3) |
| 4칸 | given·goal·method·condition의 용어 번호 + `format` + 선택 `steps`. 사전 v1.5(749용어). 세부는 [4S]에만 둔다 | 발문과 해설을 읽고 | 키·라벨 치환, 원본·유사의 상호 열람, 한 칸 중복, 사전에 없는 말을 넓은 말로 대체(후보로 선언) ([4S] §3·7·10) |
| 기록 | 작성·검토·변경·출처: 판본(blob SHA), 실제 판정자, 판정(`KEEP`/`CORRECT`/`HOLD`/`EVIDENCE_DEBT`, `UNREVIEWED`), before/after, 실행한 검사와 `NOT_RUN` | 각 역할이 자기 범위에서 | 자기 점검을 독립 검수로 기록, 하나의 PASS를 다른 PASS로 확대 ([REQ] 공통 작성 요건) |

메타-only 작업은 `content/choices/answer/solution/image/layoutTag/wide`를 건드리지 않는다 ([REQ] §4).

## 2. 정본과 파생

### 2.1 정본

| 무엇 | 정본 |
| --- | --- |
| 문항 본문 | 시험지 JS `archive/exams/**`. 생성문항은 `archive/generated/lite/v1/**` shard(정본 메타에 없음) |
| 분류·상태 | `archive/data/question_metadata.json`(28,623행·159필드, 2026-11-11 직접 계산). 등록기만 쓴다. 대상 UID만 조회하고 직접 편집·통째 교체 금지 ([SJ] 금지 1). 식별은 `question_identity_map.json`. 값의 정본 문구 차이 → 9장 #8 |
| 키 사전 3곳 | ① 표준단원·세부단원: `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`(컴파일본 `archive/data/master_tables/js_archive_tag_master.json`) ② PT·TPL·CC·Condition: `archive/data/meta-foundation/canonical/` ③ RPM L1~L4: `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`. 난이도 정의는 [DF] ([FD] §1.2·1.3) |
| 4칸 | `archive/data/item-4slot/**/*.4slot.json`(compact)와 `docs/architecture/4slot/term-dictionary-v1.5.json`. `item-4slot-index.json`은 파생 ([4A]) |

### 2.2 파생 (직접 고치지 않는다)

| 이름 | 무엇에서 | 비고 |
| --- | --- | --- |
| 카탈로그 `archive/data/archive2-catalog.json` | 시험지 JS + 정본 메타 + 식별 + 마스터·부모 링크, 빌더 `archive/tools/build-archive2-catalog.mjs` | 화면(Archive 2.0) 입력. 28,615행·79열 |
| `meta-foundation/runtime/` | 등록 요청 영수증 | 팩 17개+`runtime-bridge-receipt.json`. 로더 2곳이 목록을 따로 하드코딩(`archive/meta-foundation-runtime.js` 10개 / `archive/archive2-canonical.js` 11개)하고 매니페스트의 활성 팩을 더한다 |
| `meta-foundation/compiled/`, `archive/data/archive2-extension-keys.json` | `canonical/`, `extensions/` | 읽기 전용 파생, EXT 키 색인 |
| `meta-foundation/crosswalks/` | RPM↔ACTIVE 대응 | 추가만, `sealed-digests.v1.json`으로 봉인 (5장) |
| `archive/question-index.js`, `question-identity.js` | `archive/build_db.py` | 색인은 JS 인라인 값(단원·소단원·`level`)을 요약 |
| 시험지 JS 인라인 메타 | 본문과 같은 파일의 선언 값 | 정본 아님. 병합 때 자동 등록이 읽어 정본 메타로 옮긴다 ([MM]) |

한 문항의 값은 시험지 JS, 정본 메타, 런타임 팩, 카탈로그(`metaHint*`·`assignmentEvidence`·`unverifiedTaxonomy`·`metaProjection`), 영수증(`meta-foundation/evidence/reviewed-exam-meta/v1/`, 불변), 4칸 compact에 나뉘어 있고 뜻이 겹치는 필드(RPM 경로 `L1~L4`·`rpmL1~L4`·`nativeL1~L4`·`rpmPrimaryPath`, 과정 `standardCourse`·`courseKey`·`curriculum`·`curriculumKey`, 난이도 `difficultyBucket`·`level`·`legacyLevel`)의 묶음은 `field-dictionary.json`이 소유한다.

### 2.3 하나로 묶는 규칙 (이 문서의 핵심)

**통일안(제안).** "쓸 값"은 앞에서부터 고른다: ① 엄격 배정·런타임 팩이 확정한 값 → ② 정본 메타 행의 값(본문 지문과 결속: `metaBinding` exact·content) → ③ 시험지 JS 인라인 값(원본 표기 그대로) → ④ 지금 코드에 이미 있는 규칙 추론(통합 단원 분류·시행연도 규칙 등, 새 추론 규칙은 만들지 않는다). 앞이 비면 뒤를 쓴다. 두 곳의 값이 다르면 앞의 것을 쓰고 단계와 "다른 값이 있음"을 꼬리표로 남겨 값을 버리지 않는다. 등급은 3장 꼬리표, 막는 것은 3장 결함뿐이다. 꼬리표 필드와 통합 값의 위치는 2단계에서 정한다.

**지금 코드의 실제 순서(사실).** 소비자: 빌더=`build-archive2-catalog.mjs`, 일반=`archive2-core.js` 일반 모드(문제지 만들기), 단원=`archive2-unified-units.js`(단원 목록·빠른 평가 단원 풀), 빠른=`archive2-quick-pools.js`, 기출=`unit-past-exams*.js`, 팩=`meta-foundation-runtime.js`, 투영=`problem-bank-meta.js`. "엄격"=`verifiedBasicAssignment` 배정(3장). 개수는 2026-11-11 정본 메타에서 직접 센 값.

**과목·교육과정** (`standardCourse` 26,395 / `courseKey`·`curriculumKey` 각 6,177)
- 빌더: 엄격이면 부모 링크의 `curriculumKey·courseKey·L1·L2`, 아니면 이 4필드를 비운다. `standardCourse`는 엄격이면 메타, 아니면 메타 → JS. 승인과 무관하게 `unverifiedTaxonomy.curriculumKey`=메타 → JS, `.courseKey`=메타 `courseKey` → `standardCourse` → JS.
- 일반: 경로 4필드 중 하나라도 있으면 그대로, 모두 비면 `unverifiedTaxonomy` 4개가 모두 있을 때만 덮어쓴다.
- 단원: 원본 교육과정 = 정식 `curriculumKey` → `metaHintCurriculum`(`approved_*`+단원 필드 승인+지문 결속일 때만) → 시행연도 규칙 → 과목명 → 키 접두.
- 팩: 엄격 통과 문항만 덮어쓴다. 통일안: ①~④, `metaHintCurriculum`의 승인 조건은 등급으로.

**단원** (`standardUnitKey` 26,320)
- 빌더: 엄격이면 메타, 아니면 메타 → JS(승인 무관). JS 원문은 `legacyStandardUnitKey/Unit`로 따로 저장. 단원·소단원 불일치는 충돌로 표시하지 않는다(`META_FIELDS`에 없음).
- 단원: `legacyStandardUnitKey/Unit`(JS 원문)만 읽는다(수동 지정 → 키 일치 → 중등 이름표 → 교차표). **메타가 판정한 단원은 단원 목록에 반영되지 않는다.**
- 기출: 단원 분류는 JS 원문 `standardUnitKey`. 메타 단원 키는 소단원의 부모(`subUnitParentKey`)로만 쓴다.
- 팩: 엄격 통과 시 덮어쓴다. 통일안: 분류 규칙(교차표·수동 지정)은 두고 입력만 ①~③으로 통일.

**소단원** (`subUnitKey` 24,199)
- 빌더: 엄격이면 메타, 아니면 메타 → JS(승인 무관). `legacySubUnitKey`(JS 원문)는 저장만 하고 `archive/*.js`에서 읽는 곳을 찾지 못했다.
- 기출: 메타(부모 `meta.standardUnitKey` 범위 안일 때) → JS 원문. 이름은 `ARCHIVE_SUBUNIT_LABELS` → 원문.
- 빠른: 투영 `subUnitKey`(투영은 승인 조건 3종 중 하나 필요) → 카탈로그 `subUnitKey`(=빌더 결과). 키가 없으면 소단원 풀에 넣지 않는다.
- 팩: 엄격 통과 시 덮어쓴다. 통일안: ①→②(부모 범위 안)→③, 범위 밖 값은 다음 단계로(지금과 같음).

**난이도** (정수 1~5 21,004. 그 칸의 다른 값: `하` 722 / `중` 1,736 / `상` 623 / `중상` 54 / `UNKNOWN` 72 / 빈 문자열 352 / null 94 / 필드 없음 3,966)
- 빌더: 메타의 정수 1~5만 `difficultyBucket`으로, 아니면 `"UNKNOWN"`. JS `difficultyBucket`은 충돌 검사에만 쓴다. JS `level`은 `legacyLevel`로 분리 보존.
- 일반: 정수 1~5만 본다(보조 3값 불요). 빠른: 정수 1~4 + 기술 게이트(`generalUseEligibility`).
- 엄격 `difficultyEligible`(APMS 클리닉 추천 `apmath/js/clinic-recommendations.js`, 빠른 평가 감사 모드)은 소스 VERIFIED + 정수 + 보조 3값 + 충돌 없음을 요구한다(3장).
- 기출: `meta.difficultyBucket || record.difficultyBucket`의 정수 1~5만 단계로 읽는다. 없으면 "단계 미지정"(제외 아님, `level`은 표시용).
- 팩: 기존 난이도가 있으면 유지(없으면 팩 값), 병합 메타는 `metaFoundationDifficultyBucket`에 따로 둔다. 보조 3값은 덮어쓴다.
- 통일안: ①→②(보조 3값이 없어도 쓰고 신뢰도는 꼬리표)→③(JS에 정수가 있을 때)→"단계 미지정". level→bucket 환산 금지는 그대로 ([DF] §21).

**유형 PT/TPL** (`problemTypeKey` 11,244 / `templateKey` 10,936)
- 빌더 엄격: 메타 판본이 `meta-foundation:`(또는 검토된 유사)일 때만 복사하고 정본 registry로 검증해 `foundationTaxonomyStatus`를 낸다.
- 빌더 힌트(`buildMetaHint`): `metaHintPT/TPL`을 **승인 무관**으로 노출한다. 조건 = 지문 결속 + ACTIVE 키 + TPL 부모=PT + 필드 `HOLD` 아님. 상태 코드 3글자(L3·PT·TPL 각각 `A` 승인 / `P` 검토 대기 / `-` 없음).
- 일반·기출(`metaFacetsOf`): 엄격 값 → 힌트. 기출은 카탈로그가 있으면 힌트 값만 쓰고(sidecar 값은 읽지 않음) 없을 때만 `meta → record`.
- 팩: 엄격 통과 시 덮어쓴다. **JS 인라인 PT/TPL은 어느 화면도 값으로 읽지 않는다**(충돌 표시용). 정본에는 등록 경로로만 들어간다.
- 통일안: ①→②(힌트 조건 그대로)→(③은 9장 #9). 사전에 없는 키는 값을 버리지 않되 "뜻 불명" 꼬리표만 붙인다.

**RPM L1~L4** (`L1·L2` 5,868 / `L3` 5,810 / `L4` 5,612 / `rpmPrimaryPath` 537)
- 빌더: L1·L2는 엄격 배정의 부모 링크 값(메타 자신의 L1/L2가 아님). L3·L4는 일반 복사에서 빠지고 `unverifiedTaxonomy`에만 메타 `L1~L4`(L1은 JS `standardUnit`·`category`, L2는 JS `subUnit`로 대체)가 있다.
- L3·L4 필터(`advancedEligible`)는 등록 영수증 결속 배정을 요구한다(3장). 힌트 L3: 메타 `L3` → `nativeL3`(`HOLD`·`ROUTE_OUT` 제외, 지문 결속).
- 통일안: L1·L2 ①→②→③, L3·L4 ①→②.

**CrossConcept·Condition·Integration** (`crossConceptKeys` 2,964 / `conditionKeys` 4,701 / `integrationPattern` 12,748, 비어 있지 않은 문항)
- 빌더: 메타 판본이 `meta-foundation:`일 때만 복사해 registry로 검증(EXT 키는 registry 밖이라 `advancedEligible`에서 빠짐, [V2] EXT). 문제지 만들기·단원별 기출 필터는 읽지 않고 ([MD] 빈 메타 총정리) 조회 색인(`problem-bank-meta.js`)에만 있다. 팩: 엄격 통과 시 덮어쓴다. 통일안: 조회 색인만 ①→②.

**현재 상태.** "필드별 통합 값이 있는 문항 수 대 화면이 쓰는 문항 수"는 `audit.mjs` 활용 격차 출력이 소유하고 직접 세지 않은 숫자는 적지 않는다. 정본과 JS 인라인이 다른 문항(조사 2026-11-11): 소단원 856, 난이도 607, PT 79, TPL 90. 카탈로그 `metaBinding`(조사): exact 19,804 / content 7,739 / 없음 1,072, `sourceStatus: HOLD` 8,811.

## 3. 상태는 꼬리표

**등급(제안 어휘).** 값마다 "얼마나 확인됐는가"를 등급 하나로 붙인다. 이름은 1단계 제안이고 등급 목록과 상태 값별 대응은 `status-vocabulary.json`(`grades`)이 소유한다(아래 표는 대표 예). 화면은 등급과 무관하게 값을 쓰고, 등급은 표시와 선택 필터(`metaApprovedOnly` "승인된 것만")로만 쓴다.

| 등급 | 뜻 | 현행 상태의 대표 예 |
| --- | --- | --- |
| 독립 검수됨 | 별도 검수가 같은 판본을 읽고 승인, 영수증 있음 | `reviewed_pass`, FINAL_QA·REVIEW2(`reviewPassCount===2` 선언만 검사, [V2]) |
| 한 번 판정됨 | 판정은 있으나 독립 재검 없음 | `approved_meta_pipeline_audit`([V2]). `mother_final`·`r2e_adjudicated`는 힌트 레인이 `P`로 표시 ([UL]) |
| 원본 표기 그대로 | 시험지 JS 선언을 등록했을 뿐 | `registered_merged_source`(독립 수학검수 아님, [MM]), 필드 `approved_source`, `registration_pending_semantic_review` |
| 힌트 | 기록은 있으나 확인 전, 또는 규칙 추론 | 힌트 코드 `P`, `manual_review_pending`, 시행연도 규칙 |

**쓰지 못하는 실제 결함(제안 목록).** ① 다른 문항의 값: UID·파일·순번 불일치, UID 중복(`assignment_identity_mismatch`, `SOURCE_UID_CONFLICT`, `UID_JOIN_MISMATCH`). ② 본문이 바뀌어 값이 문항을 가리키지 않음: 발문·보기·그림 지문 불일치(`metaBinding` 없음). 해설·정답만 바뀐 `content` 결속은 결함이 아니다 ([UL]). ③ 키가 사전에 없음: ACTIVE 아님·registry에 없음·TPL 부모≠PT. 등록된 EXT 키는 허용 ([V2] EXT). 현행 코드는 여기에 필드 `HOLD`/`ROUTE_OUT` 값 비노출과 기술 게이트(신원·소스 무결성·지문)를 더해 둔다.

**지금 코드가 상태를 문턱으로 쓰는 곳.** 개수는 2026-11-11 직접 계산 또는 조사 값.

| 위치 | 조건 | 쓰이지 못하는 것 |
| --- | --- | --- |
| 빌더 `verifiedBasicAssignment` | 단원·소단원 필드 승인(또는 r2e 예외)+승인 증거+문항 상태 `approved_*`·`MOTHER_FINAL`+지문 일치+부모 링크 | 엄격 경로(`curriculumKey·courseKey·L1·L2`), `basicEligibility`(자동출제 승인), L3/L4 필터, 팩 덮어쓰기. 소단원 값·필드 승인은 있으나 문항 상태가 승인이 아닌 문항: 조사 값 기출 8,237·교과서 2,627·유사 978(합 11,842), 정의를 엄격히 잡아 다시 센 값 10,615(기준 정의는 `audit.mjs`가 확정) |
| `meta-foundation-runtime.js` | 엄격 배정 통과 시에만 29필드(`FOUNDATION_OVERRIDE_FIELDS`) 덮어쓰기 | 팩 값 전체 |
| `archive2-canonical.js` 영수증 루프 | 등록 영수증 `REGISTERED`+승인 유형+원본 SHA 일치+단원·소단원 승인 | 정식 L3/L4 배정 |
| `problem-bank-meta.js` `createSourceBoundDisplayProjection` | `approved_*`+단원·소단원 승인+증거, 또는 등록 대기 증거, 또는 검토된 H1 원본 | 표시 투영 `metaProjection`의 과목·단원·소단원 라벨(`DISPLAY_PROJECTION_CORE_APPROVAL_MISSING`) |
| `buildMetaHint` | `metaHintCurriculum`만 `approved_*`+단원 승인 | 교육과정 근거 |
| `archive2-core.js` `difficultyEligible` | 소스 VERIFIED(일반 모드는 `metaBinding: content`도)+정수+신뢰도 high/medium/low+경계 플래그 5값+호환성 `NORMAL`/`BORDERLINE_ACCEPTABLE`/`STRONG_CONFLICT`+난이도 필드 충돌 없음 | APMS 클리닉 추천, 빠른 평가 감사 모드. 정수 21,004행 중 8,462행만 보조 3값 조건 충족(12,542행 제외). 소스 상태 조건까지 넣은 카탈로그 기준으로는 7,955행만 통과(13,049행 제외, `audit.mjs` 활용 격차 2026-11-11) |
| `archive2-core.js` `advancedEligible` | 소스 VERIFIED+등록 영수증 결속 배정(`REGISTERED`, FINAL_QA/REVIEW2/META_PIPELINE_AUDIT, 원본 SHA 일치)+foundation `CONFIRMED`+충돌 없음 | L3/L4 필터 |
| `archive2-core.js` `basicEligibility` | `review`·`semantic`·`solution`·`source_issue` 보류, 적용성, 충돌 | 엄격 자동출제 지표. 일반 사용은 이 중 어느 것도 문턱으로 쓰지 않는다 |
| 난이도 보조값 허용 목록 | `register-difficulty5.mjs`는 `BORDERLINE_REVIEW`를 쓰고 `active-registry.mjs`·`rpm-active-resolver.mjs`·`archive2-core.js`는 불인정 | 정본 `BORDERLINE_REVIEW` 1,029행(`NORMAL` 6,806 / `BORDERLINE_ACCEPTABLE` 1,183 / `STRONG_CONFLICT` 511 / `UNKNOWN` 638 / `MOTHER_FINAL_REVIEW` 54 / 없음 18,402). 2단계 첫 항목, 여기서는 사실만 |

문턱이 아닌 것: 단원별 기출 `isMetadataApproved`는 연도 안의 정렬 우선순위, `metaFacetStatusText`·`metaHintStatus`는 표시, 등록기의 `approved()`는 승인된 값을 소스 선언이 덮어쓰지 못하게 지키는 쓰기 보호다(`FIELD_AUTHORITY_CONFLICT`). `problem-bank-meta.js`의 필드별 `metaStatus`(`CONFIRMED`·`RECORDED`·`RECORDED_NOT_APPLICABLE`·`PENDING`·`STALE`·`INVALID`·`EVIDENCE_DEBT`·`HOLD`·`UNKNOWN`)는 이미 꼬리표 모델이다.

**상태 필드의 값 종류 수 (2026-11-11 직접 계산).** `metadataStatus` 21, `tagStatus` 16, `reviewStatus` 13, `fieldStatus` 16개 키·28개 값, `foundationTaxonomyStatus` 3, `rpmPathStatus` 7, `l3Disposition` 5, `l4Disposition` 6, `semanticDisposition` 5, `tagConfidence` 22, `difficultyConfidence` 8. `metadataStatus` 상위: `registration_pending_semantic_review` 14,852 / `approved_partial_with_explicit_holds` 7,919 / `approved_semantic_review` 1,597.

**미확정을 부르는 말 13가지**(문서마다 따로 쓴다): `EVIDENCE_DEBT`, `UNKNOWN`, `HOLD`, `META_CANONICAL_HOLD`, `ADVANCED_META_HOLD`, `EVIDENCE_INCOMPLETE`, `PROJECTION_PENDING`, `REGISTER_PENDING`, `TOOLING_GAP`, `OWNER_INCOMPLETE`, `NOT_RUN`, 4칸 `candidates`, `pending-supplement`. 정의는 [REQ]·[RES] §3·[SJ]·[GR] §2.4·[4S] §10·[SA]에 흩어져 있다. 통합은 `status-vocabulary.json`의 몫.

## 4. 들어가는 길

공통 뼈대: `.github/workflows/archive-main-auto-meta.yml`(main push·매시 43분)이 `tools/ci/archive-registration-writer.mjs`로 lane을 순서대로 실행한다: reviewed → semantic → shared → generated → studentIndexes → fourSlot. 바뀐 단계만 돈다. 이 Actions가 main의 유일한 공유 등록 writer다 ([MM]).

| 길 | 진입점 | 결과 |
| --- | --- | --- |
| 인박스 요청 | `.archive-meta-register/inbox/*.json` → `tools/ci/reviewed-meta-register-pass.sh` → `register-reviewed-exam-meta-source.mjs`. `schemaVersion`으로 6종 분기(v2, v1 REVIEW2, `finalqa-pinpoint`, `finalqa-nonpt`, `difficulty5`, `basic-scope-rebind`) | 적용(`reviewed_pass`·`approved_*`). 거부 → `rejected/`, 감사 거부 → `pending-supplement/` ([V2]) |
| 병합 자동 등록 | `auto-register-merged-source.mjs`(소스 JS 선언값 → 정본). 새 문항 자리는 `archive/tools/intelligence/sync-pending-question-metadata-v1.mjs`(`build_db.py`가 호출) | `registered_merged_source`+`review_required`, 근거 `MAIN_MERGED_EXPLICIT_METADATA`, 승인 아님. 없는 키·근거를 만들지 않고 못 올리는 UID는 `auto/state.json` pending ([MM]). 새 자리는 `registration_pending_semantic_review`(소스에 단원 키가 있으면 필드 `approved_source`) |
| 난이도 | `register-difficulty5.mjs`(`--wrap --normalize`), 장부 `diff5-intake-ledger.json` | 수리는 도구가 한다 ([MD] 난이도 인박스) |
| 4칸 | `tools/4slot/*`, `tools/ci/archive-four-slot-pass.sh` | 정본 메타에는 쓰지 않고 `item-4slot-index.json`만. 4칸 존재·STALE은 등록·출제 차단 조건이 아니다 ([4A]) |
| 생성문항 | `compile-qid9-main-source.mjs` → `auto-register-approved-qid9.mjs` → `rebuild-main-source-consumer.mjs` | 정본 메타에는 쓰지 않는다 ([AG]) |
| 그 밖 | 중등 `materialize-meta-v2-payloads.mjs`(캠페인 상수 `GENERATION`이 남음), Codex 수동 `register-target-exam.mjs`(워크플로 연결 없음) | |

**승인 종류** (`approval.type`, [V2]): `REVIEW2`=독립 2회 검토, `FINAL_QA`=사후 최종 검수, `META_PIPELINE_AUDIT`=심화 메타 감사(난이도를 바꾸지 않고 FINAL_QA·REVIEW2로 변환하지 않음), `BASIC_SCOPE_REBIND`=그림만 바뀐 승인 문항의 지문 재결속(값 변경 불가, [MD] 기본범위 재결속), `MAIN_MERGE`=자동 등록의 `metadataApprovalType`(승인 아님). 요청 생성기: `tools/main_merge_master.py`, `tools/convert-meta-pipeline.mjs`, `register-difficulty5.mjs --wrap`, `archive/tools/prepare-target-registration-candidate.mjs`.

**누가 Git에 쓰는가.** 같은 역할이 "인가된 마지막 Git writer"([SJ]), "Git executor"([CO]), "감독 출고자"([GR] MASTER), "운반 작업자"([MD] 난이도 인박스), "Courier"([DM]), "Git/main 병합 담당"([SJ])로 불린다. 사실은 셋이다: 예약 CREATE/R1~R3는 소형 패킷을 인계할 뿐 Git에 쓰지 않고, 소스 PR·인박스 요청은 쓰기 권한이 있는 세션이 올리며, main의 등록 데이터는 위 Actions만 쓴다. 통일안(제안): **제출자**(요청·소스를 올리는 세션)와 **등록 writer**(자동 등록 Actions) 두 말만 쓴다.

**병합 뒤 상태는 구분한다.** `MAIN_DONE`(병합과 원격 blob 확인) / `PIPELINE_PASS`(Actions 실제 성공) / `DEPLOY_DONE`(Pages 실제 배포)는 독립 사실이고 확인하지 않은 것을 성공이라 적지 않는다 ([FQ] §4). 누가 어디까지는 9장 #5. `META_PIPELINE_AUDIT`의 메타 미완성은 후보완으로 접수하고 학생 이용 장애만 출고 실패다 ([SA]).

**공식 Resolver 실행** (stage만 바꾼다, [RES] §2). R2·R3는 `--stage R2`·`--stage R3`와 같은 입력, 유효한 영수증이 있으면 `--validator-receipt`. `<run>`은 실제 작업 폴더명. 실행 환경이 없으면 `NOT_RUN`/`OWNER_INCOMPLETE`로 적고 실행 가능한 담당에게 같은 파일을 넘긴다. PT/TPL을 자체 추정하지 않는다.

```bash
node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage CREATE --input archive/_generated/<run>/meta/decision.json --out archive/_generated/<run>/meta/create-resolver.json
node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage R1 --input archive/_generated/<run>/meta/decision.json --candidate archive/_generated/<run>/meta/candidate.json --relational archive/_generated/<run>/meta/relational.json --difficulty archive/_generated/<run>/meta/difficulty.json --out archive/_generated/<run>/meta/r1-gate.json
```

## 5. 새 키 만들기

**확장 원칙 (2026-11-02 사용자 결정, [MD] 확장 원칙).** 추정 금지이지 신설 금지가 아니다. 맞는 키가 없으면 가장 가까운 키에 억지로 붙이지 말고 정식 요청으로 새 키를 만든다. 이유: 모순되는 키를 달면 L4·유형 설명이 문항과 어긋나고 그 키로 모은 유형에 엉뚱한 문항이 섞인다. 이름·정의·`internalSkeleton`은 특정 시험의 숫자·식·인물 없이 풀이 구조로 일반화하고, 같은 형태가 또 나오면 재사용한다. 추가(add-only)를 우선하고 기존 행·키 수정은 영향 문항을 확인해 기록한다. 새 키도 공식 레지스트리·등록기·Resolver를 거치므로 "PT/TPL은 공식 Resolver 결과만"과 충돌하지 않는다.

**길이 여럿이다(사실 나열, 하나의 절차로 묶을 기준은 9장 #1).**

| 길 | 대상 | 방법 | 정본 승격 | 출처 |
| --- | --- | --- | --- | --- |
| `registryChanges` | PT·TPL·CC·Condition·바인딩·크로스워크 | 인박스 요청에 `before:null`/`after` + 근거 SHA. 수정·삭제는 다른 시험지 영향이 없을 때만 | 처리 시 정본 반영 | [MD] 확장 원칙, [V2] 정본 확장 |
| EXT 확장 키 | `EXT-CROSS-*`·`EXT-COND-*`(PT/TPL 불가) | 요청의 `crossConceptKeys`/`conditionKeys`에 그대로 적는다(`registryChanges` 아님). 색인·원본 registry·부모·과정 범위를 등록기가 확인 | 없음(`canonicalPromoted:false`) | [MD] EXT, [V2] EXT |
| 생성 전용 확장 | Generated의 CC·Condition·L4 | 사용자 추가 승인 대기 없이 `extensions/`의 Generated-only registry에 의미·parent·evidence·UID 등록 후 source·Consumer·index 반영 | 없음 | [CO] §3, [CM] 수정 AI, [PB] |
| 감사 승격(Courier) | 감사가 승인했으나 ACTIVE 정본에 없는 PT/TPL/CC | add-only로 정의를 정본 pack·shard에 추가하고 UID 바인딩. 기존 정의는 불변 | 정본 반영 | [DM] Role boundaries 4, [V2] 감사 |
| 크로스워크 행 | RPM 경로를 못 채운 문항 | `crosswalks/rpm-primary-v1.0/`에 `DIRECT_ACTIVE` 행 추가(같은 리프·단원에 TPL이 여럿이어도 새 행 가능, Resolver가 선택) | 추가만 | [MD] 확장 원칙 |

공통: RPM LOCKED·Generated 전용 registry 밖 경로는 변경 허용 목록에 없고 의미 키 삭제·정의 변경은 등록기가 막는다 ([V2]). 같은 키를 쓰는 요청이 여럿이면 `registryChanges`는 먼저 처리되는 요청 하나에만 싣는다 ([MD] rpmPrimaryPath). canonical 승격은 자동화하지 않는다 ([FD] §0). 4칸 용어 추가는 별도다: 후보(`CANDIDATE`) → 한 곳에서 정리·번호 부여 → 삭제·개명 금지 ([4S] §10).

**크로스워크는 추가만 한다 (2026-11-03 사용자 결정 A안).** 기존 행의 수정·삭제·순서 변경은 하지 않고 고쳐야 하면 먼저 사용자에게 보고한다. 통해시 고정은 봉인 레지스트리 `sealed-digests.v1.json`(추가 전용)과 행 검사로만 허용하며, 봉인을 손으로 넓히거나 `CROSSWALK_DIGEST_NOT_SEALED`를 우회하지 않고 생성문항 Meta·해시 필드를 손으로 고치지 않는다. 이유: 행 추가가 승인 생성문항 약 171건의 해시를 어긋나게 해 CI와 학생 사이트 배포가 막힌 적이 있다 ([MD] 공유 크로스워크, [CM] 공유 데이터 고정값).

## 6. 보류와 재처리

| 보류 | 들어가는 것 | 지금 정해진 재처리 | 정해지지 않은 부분 | 수 (2026-11-11) |
| --- | --- | --- | --- | --- |
| `.archive-meta-register/rejected/` | 등록기가 거절한 요청(before·`curriculumKey` 불일치 등) | 소유자가 현재 메타·소비자 기준으로 요청을 새로 만들어 새 requestId로 인박스 제출 ([V2] 요청별 격리) | 누가 언제 재제출하나. 모아 보는 도구가 이 폴더를 보지 않는다 | 69건 |
| `…/pending-supplement/` | 감사 승인 요청이 메타 계약에서 거부된 것(선승인, `NOT_VERIFIED`) | 보완 후 새 requestId로 재제출, 이전 영수증은 이력 보존 ([SA]) | 보완 담당·종료 기준 | 73건 |
| `…/auto/state.json` pending | 자동 등록이 못 올린 UID와 사유 | 소스·메타·registry가 바뀌면 자동 재시도, 같은 입력은 다시 보지 않는다 ([MM]) | 지문 불일치(원본이 바뀐 문항)의 해소 담당 | 5,835건. 사유(중복 가능): 지문 불일치 3,079 / PT·TPL 미선언 1,374 / 난이도 미완 603 / 고급 필드 누락 462 |
| `diff5-intake-ledger.json` | 난이도 인박스 장부 | 수리 규칙이 바뀌어 다시 볼 가치가 생긴 보류는 장부에서 지워 다음 회차에 재처리(2026-11-11 176건). 충돌·UID 불일치·원본 없음은 되돌리지 않는다. 다른 값의 재판정은 `reviewedCorrection` ([MD] 난이도 인박스) | `REFUSED_DRYRUN` 404건의 분류별 처리 | 602건: `REGISTERED` 191 / `REFUSED_DRYRUN` 404 / `REJECTED` 3 / `SUBMITTED` 4 |

모아 보는 도구 `tools/ci/archive-meta-backlog-overview.mjs`는 `pending-supplement`와 `auto/state.json`만 읽는다. 빈 메타 총정리의 원장(`.tmp/meta-backfill/`)은 커밋하지 않고 불일치·판정 불가는 HOLD 목록에 `EVIDENCE_DEBT`로 남긴다 ([MD] 빈 메타 총정리).

## 7. 건드리면 안 되는 것

| 대상 | 이유·검사 |
| --- | --- |
| `docs/rules/MANIFEST.md` 등재 문서 | 바이트·sha256 봉인(`archive/tools/pipeline-core/rulepack.mjs`, `RULE_DRIFT`). 어긋난 조항은 9장 "우선 적용" |
| `tools/harness/routes.v1.json`의 authority 경로 11개 | FINAL QA 카드, 소형 JSON 계약, MAIN_FIRST, 예약 역할 파일 5개(CREATE·R1·R2·R3·MASTER), `.agent/SKILLS_INDEX.md`, apmath SOP 2개. 이동·개명하면 `harness-entry-gate.yml`이 막는다 |
| `tools/ci/archive-registration-writer.mjs` 불변 목록 | `archive/exams/`, `archive/assets/images/`, `archive/data/item-4slot/`, `alive/`, 영수증 폴더, `reviewed-exam-meta/v1/`, 생성문항 증거 2개 (`IMMUTABLE_INPUT_OR_RECEIPT_CHANGED`). 변경 허용 경로는 lane outputs |
| 4칸 사전 경로 하드코딩 | `tools/4slot/validate-4slot.cjs`, `tests/item-4slot-data.test.cjs`(`docs/architecture/4slot/term-dictionary-v1.*.json`) |
| `docs/operations/META_CANONICAL_KEY_COLLISION_REPAIR_20261025.json` | 정본 데이터가 경로로 참조, 이동 금지 |
| 등록 영수증·`alive/` 승인 영수증·`metaFinalSha256`·`archive/data/meta-foundation/crosswalks/sealed-digests.v1.json` | 수정하지 않는다(봉인은 추가 전용, [CM] 공유 데이터 고정값) |
| `AGENTS.md` 예산(6,000자·80줄)과 `docs/agents/*.md` 링크, 워크플로 텍스트를 읽는 테스트 | `tests/agents-md-budget.test.js`, `tests/archive-single-writer-workflows.test.mjs`, `tests/archive-register-trigger-paths.test.mjs`, `tests/archive-ci-scope.test.mjs` |

## 8. 결정 기록

| 날짜 | 결정과 이유 | 출처 |
| --- | --- | --- |
| 2026-10-09~10 | OWN_AND_FIX: 승인된 범위의 결함은 수정 AI가 직접 고치고 병합 뒤 학생 화면 검사까지 책임진다(보고로만 끝낸 사례 시정). 최신 요청의 범위·종료 조건이 우선(무관한 전수 재검 방지) | [CM], [CO] |
| 2026-10-21 | 대상 UID만 조회하고 변경은 시험지별 소형 JSON으로 (대형 파일 직접 편집의 충돌) | [SJ] |
| 2026-10-22~30 | Notion 필독 라우터 선열람 폐지. 신규 기출 CREATE/R1~R3는 Primary RPM·CC·Condition·Integration을 실제 풀이로, PT/TPL은 공식 Resolver (자유 추정 방지) | [CM], [RES] |
| 2026-10-29 | 일반 사용은 검토 상태를 문턱으로 삼지 않는다 (개념·유형 필터가 195문항에서만 동작) | [UL] |
| 2026-11-02~03 | 확장 원칙(5장)·EXT 키 등록 (키 하나로 시험지 전체 등록이 막힘). 공유 크로스워크는 추가만+봉인 레지스트리 (병합이 CI·배포를 두 번 막음) | [MD], [CM] |
| 2026-11-04 | 신규 결과물은 JS+확장 메타+4칸+기록을 함께 작성, main에는 4칸 compact만 (증거는 Git 밖) | [REQ], [4R] |
| 2026-11-05~06 | main 병합 뒤 자동 등록(단일 writer), 학생 이용 우선·선승인 후보완, 4칸 자동 색인 (작업자에게 등록 JSON·재시도를 요구하지 않고 메타 불완전이 학생 이용을 막지 않게) | [MM], [SA], [4A] |
| 2026-11-11 | 난이도 인박스 수리는 도구가 하고 판정 값은 고치지 않으며 대상은 빈 파일만 (손 수리가 해시 불일치 57건을 흘림) | [MD] |
| 2026-11-11 | 엄격 조건을 없애고 분류를 둘로 나누지 않는다. 값이 있으면 쓴다 (정수 난이도 21,004행 중 엄격 조건 통과가 7,955행뿐이었고, 대부분 보조값이 없다는 이유였다). 숫자가 아닌 난이도·빈 난이도는 난이도 라인이 채우고 병합 때 한 번 더 검수 | 이 문서 0장 |
| 2026-11-11 | 빈 메타 총정리는 Codex가 직접(Gemini는 분류에 쓰지 않음), 판단은 모델이 형식은 도구가, 판정은 서로 보지 않고 두 번. 메타를 하나의 운영체제로 묶는다(Git이 유일한 정본, 3단계 순차) | [MD], 이 문서 |
| 2026-11-11 | 새 키·새 값은 미분류로 받아 두고 나중에 묶는다. 채워 가는 메타 전체에 같은 방향 (정본이 아니라는 이유로 값이 밀려 파이프라인이 멈춤). 소단원은 키를 그대로 두고 묶음표로 묶는다 | [MD] 소단원 묶음표, 빈 메타 채우기 실행 방식 |
| 2026-11-11 | 빈 메타 판정은 루나가 밤새 두 번 독립으로, 난이도 포함(Gemini 난이도는 참고). 난이도는 보수적으로, 원장은 기계 합격 검사로 걸러 낸다. 보류 문항은 그림을 직접 읽고, "조건이 모순"은 보류 사유가 아니다 (틀 문장 원장 41/45, 높게 잡는 쏠림) | [MD] 빈 메타 채우기 실행 방식 |

## 9. 미결 표와 우선 적용

**미결** (양쪽 문구를 적고 임의로 정하지 않았다).

| # | 무엇 | 문구와 위치 |
| --- | --- | --- |
| 1 | 새 키를 만드는 길 4가지(+크로스워크 행)를 하나의 절차로 묶을 기준 | 5장 표. 봉인 [FD] §0 "canonical 승격은 자동화하지 않는다" |
| 2 | (결정됨 2026-11-11) 유사·생성 문항의 4칸은 문항마다 판정한다. 원본 4칸은 참고만 하고 그대로 이어받지 않는다 | [MD] 빈 메타 채우기 실행 방식. 이전 문구: [4R] §1·§7 "사용자 결정이 아직 필요" |
| 3 | Drive 심화 메타 라인(Gemini 분류 → Courier)의 종료 여부 | "Gemini가 PT/TPL·CC를 분류"([DM] Role boundaries 1, 2026-10-23) vs "Gemini는 분류 판정에 쓰지 않는다"([MD] 빈 메타 총정리, 2026-11-11). 난이도 라인은 Gemini에 그대로 |
| 4 | (결정됨) 화면은 값이 있으면 쓴다. 막을 결함의 구체 목록은 제안 | 3장 |
| 5 | 병합 뒤 검증 책임 | "main 병합 이후 실제 Chrome 학생 조회 등 기술 검사는 수정 AI가 끝까지"([CM] 수정 AI, [CO] §1·§4, [PB] 상단) vs "병합 후 Consumer/Search N/N·CI polling은 GPT 종료조건에서 제외"([FQ] §3, [SJ] 역할별 계약)·"등록 JSON·재시도를 작업자에게 요구하지 않는다"([MM] 첫 문단) |
| 6 | 크로스워크 기존 행 수정 | "수정·삭제·순서 변경 하지 않는다, 먼저 보고"([CM] 공유 데이터 고정값 1, [MD] 공유 크로스워크, 2026-11-03) vs "기존 행·키 수정은 최소 수정하고 영향 문항 기록"([MD] 확장 원칙 (e), 2026-11-02). 5장은 2026-11-03 쪽을 적었다 |
| 7 | 문서 삭제 방침 | "문서는 삭제하지 않는다"(`docs/08_DOCUMENT_UPDATE_RULE.md` §3) vs "끝난 캠페인 규칙은 지운다"(`AGENTS.md` 이 파일 관리) |
| 8 | 값의 정본 위치 | "JS = 각 문항에 실제 적용된 canonical metadata value의 source of truth"([FD] §1.1) vs "`question_metadata.json`은 조회용 공용 집계, 의미 정본의 권위를 대체하지 않는다"([SJ] READ) vs 카탈로그·등록기는 정본 메타를 분류·상태의 운영 정본으로 읽는다 |
| 9 | JS 인라인 PT/TPL을 화면 값(힌트 등급)으로 쓸지 | 지금 어느 화면도 읽지 않는다(2.3). "PT/TPL은 공식 Resolver 결과만"([RES] §0)과의 관계를 사용자가 확인해야 한다 |
| 10 | FINAL QA 두 문서의 지위 | 같은 Notion 주소를 "역사적 참고·증거 문서"([FQ] 문서 소유권) vs "단일 실행 정본"(`docs/operations/Archive_FINAL_QA_REPAIR_CURRENT.md` 상단). 외부에만 있음 |
| 11 | Notion 필독 라우터 | 폐지([CM] 작업별 진입, 2026-10-22) vs 필독으로 남은 곳: `Archive_FINAL_QA_REPAIR_CURRENT.md` 1항, [PB] 재진입, `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` |
| 12 | Notion 02-06 라우트의 역할 | "첫 정본 선택을 관리"([SJ] 상단) vs "내비게이션만 소유"([REQ] 적용 범위) vs "의미 판정·쓰기·등록 담당을 구분"([MD]). 외부에만 있음 |
| 13 | (결정됨 2026-11-11) 난이도 `BORDERLINE_REVIEW` 등 보조값 | 문턱으로 쓰지 않는다. 정수 난이도면 쓴다. 코드 반영은 2단계 첫 PR. 등록 도구들의 허용 목록 통일은 남은 일(3장) |

**외부에만 있는 규칙**(옮기지 않음): Drive 심화 메타 SOP, Notion 공통 메타 의미·ACTIVE 바인딩 SOP([GR]), Notion QID9 표준계약, Notion 02-06-A 등록기 구현 이력([SJ]), Notion FINAL QA Skill 본문.

**우선 적용** (봉인·상위 문서와 어긋나는 조항).

| 봉인·다른 문서의 조항 | 이 문서 | 근거 |
| --- | --- | --- |
| [DF] §20·21: 자동추천·자동출제는 `reviewed_pass`만 기본 허용, `UNKNOWN`·`manual_review` 사용 불가 | 기록된 정수 난이도는 상태와 무관하게 쓴다(문제지 만들기·빠른 평가·APMS 추천 모두, 엄격 경로를 따로 두지 않음). `UNKNOWN` 추정 금지와 level→bucket 환산 금지는 그대로 | 2026-10-29·2026-11-11 사용자 결정 ([UL], 0장) |
| [RI] 410행 "임의 신규 key를 만들지 않는다" | 근거 SHA·등록기·Resolver를 거친 정식 요청의 신설은 허용. "임의"는 정식 요청 없이를 뜻한다 | [MD] 확장 원칙 (2026-11-02 사용자 결정) |
