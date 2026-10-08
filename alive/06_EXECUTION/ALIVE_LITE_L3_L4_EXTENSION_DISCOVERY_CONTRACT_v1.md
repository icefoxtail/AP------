# ALIVE LITE — RPM L3/L4 확장 발견·등록·심사 계약 v1

작성일: 2026-10-08 | 상태: **CREATE EXTENSION DISCOVERY CURRENT** (RPM 정본은 LOCKED 유지)
적용: ALIVE LITE 전수 스캔과 모든 적응형 생산 배치의 A 원본 이해 → B 설계 → C 생성 → D 저장.
상위 authority: RPM Primary v1.0 LOCKED, JS아카이브 문항메타 파운데이션 §1.4, ALIVE_LITE_SOURCE_BLUEPRINT_EXHAUSTION_CONTRACT_v0.1, ALIVE_LITE_FULL_SCAN_ADAPTIVE_BATCH_TWO_CHAT_CONTRACT_v1.
**이 문서는 신규 taxonomy 후보의 탐색·기록 규칙이지, RPM taxonomy/ACTIVE 머신키 자동 승격 권한이 아니다.**

## 1. 확장 목적과 실패 방지

B01 처음 13개는 탐색 부족의 예였다. B01R2는 원본 7개에서 65 후보를 탐색하여 45개를 CREATE 생산했다. 그러나 45개 후보가 서로 다른 신규 L4 45종이라고 증명된 것은 아니다. L3/L4 공백을 먼저 탐색하고, 이미 있는 RPM 정본으로 설명되는 축과 정말 새 의미 구조를 구별해야 한다.

## 2. RPM-first 분류 라우터 — 신규 유형이 아니라 정확한 lookup부터

1. 학생용 원본·5지·표·그림과 source solution에서 primaryMethod/decisiveStep을 도출한다. CREATE의 판정은 proposal이며 독립 REVIEW가 나중에 검증한다.
2. 현재 2022 과목·단원의 RPM L3와 **모든 관련 L4**를 조회한다.
3. 일치가 부족하면 이전 same-grade 범위(순서가 있는 경우) → 이미 이수한 하위 학년 scope를 조회한다. 상위·미이수 scope에서 가져오기 금지. target L1/L2는 보존하고 semanticSourceScope만 별도 기록한다.
4. 기존 RPM semantic과 같으면 RPM_EXISTING. PT/TPL·binding이 없으면 PROJECTION_GAP이지 새 L3/L4가 아니다.
5. 기존 L3가 있지만 decisive step과 출제 목표가 모든 기존 L4에 충분히 표현되지 않으면 EXT_L4_CANDIDATE. 단순 숫자·기호·문형·독립 조건 변형은 CONDITION_PATTERN_ONLY로 구별한다.
6. 어떤 허용되는 RPM scope의 L3도 primaryMethod를 대표하지 못할 때에만 EXT_L3_CANDIDATE. 기존 가장 가까운 L3와 다른 핵심 추론, 교육과정, evidence, 부모 L1/L2를 명시하고 신규 L4 후보까지 설계한다. 기존 L3 세분화에 불과하면 L3_GRANULARITY_REVIEW_REQUIRED로 보류한다.
7. 실제 주개념이 원본 L3에서 벗어나면 L3_DRIFT로 분리한다. 우수한 off-target 문항은 별도 seed/requeue할 수 있으나 원본 L3 확장분으로 집계 금지.
8. 교육과정 위반은 CURRICULUM_VIOLATION. RPM에 없는 것과 허용 범위 밖의 개념은 다르다.

## 3. L3/L4 신규성 기준

- **L3 후보:** 기존 해당 학년 및 lower-only canonical L3가 primaryMethod/decisiveStep을 포괄하지 못해야 한다. 한 원본만 있으면 L3_GRANULARITY_REVIEW_REQUIRED로 두며 자동 RPM 등록 금지.
- **L4 후보:** 같은 L3의 기존 L4와 비교하여 핵심 추론·문제 목표·필수 조건 분기가 실질적으로 달라야 한다. comparator, 적용되는 독립 계산 예시, 차이의 반례와 학생 풀이 증거를 기록한다.
- **Condition/CrossConcept/Integration:** 독립 축으로 따로 관리한다. 이 축이 달라졌다고 자동 신규 L4가 아니며, 기존 L4로는 핵심 구조를 설명하지 못하면 EXT 후보를 만들어 놓는다.
- **생산 개수와 신규 유형 개수는 별개.** source qid → 탐색 후보 → ACCEPT Blueprint → 생성 UID → EXT 후보 → 독립 의미 승인 → 공급승인 순서별 실적을 혼합 금지.
- relevant L4 후보가 탐색되지 않았거나 유효 EXT 생산·분류가 남았다면 SOURCE_CONTINUATION_REQUIRED. 가능한 모든 수학 구조에 대한 무한 소진을 주장하지 않고 합리적 종료 근거를 적는다.

## 4. B단계 선행 필수 산출물

각 원본 qid에 대해 먼저 아래를 확정·저장한다.
- source path/blobSHA/qid/원래 L1·L2, 실제 primaryMethod/decisiveStep
- current RPM 및 earlier same-grade/lower-only lookup 분모, exact record ID, scope
- 기존 L3 × 기존 L4 후보 표, Condition/CrossConcept/Integration 후보 및 실제 결속 방식
- 신규 EXT L4/EXT L3 candidate ID, canonicalComparator, 결정적 풀이 차이, targetGoal, 적용 domain
- candidateKind = RPM_EXISTING / PROJECTION_GAP / CONDITION_PATTERN_ONLY / EXT_L4_CANDIDATE / EXT_L3_CANDIDATE / L3_DRIFT / HOLD
- disposition = ACCEPT / DUPLICATE / L3_DRIFT / CURRICULUM_VIOLATION / NO_VALID_MATH_STRUCTURE / HOLD 와 제외·보류 사유
- 목표 수학 정답, 대표적인 **오개념 기반** 오답 네 개, ①~⑤ 위치 설계와 순서 고정 근거
- source별 미개척 L4와 해결조건, sample-generated UID, 숫자-only instance count

**문항 출제 전에 위 확장 탐색 표와 L3/L4 candidate registry를 먼저 Git batch-design으로 동결한다.** 생산 도중 새 의미 구조가 발견되면 B 설계를 designRevision으로 보완한 뒤 C를 계속한다.

## 5. Candidate Registry 레이아웃과 승인 경계

- target L2 아래 L4 후보: archive/generated/lite/v1/2022/H1/<targetL2>/extension-l4/registry.json
- target L2 아래 L3 후보: archive/generated/lite/v1/2022/H1/<targetL2>/extension-l3/registry.json
- EXTs의 ID namespace: EXT-H1-... (RPM ID/PT/TPL과 혼용 금지)
- 필드: candidateL3Id/candidateL4Id, label, definition, proposedParentRPM, canonicalComparator, decisiveStepSignature, condition, crossConcept, integration, sourceSeedQids, exampleUids, sourceSHA, actual math/curriculum evidence, reviewStatus, canonicalPromoted=false, consumerSelectable=false.
- 이전 단원에서 의미를 빌려도 **원본 target L2의 registry**에 두고 semanticSourceScope와 RPM record IDs를 기록한다.
- DISCOVERED_UNREVIEWED → MATH_REVIEWED → SEMANTIC_REVIEWED → CANONICAL_PROPOSAL_READY는 심사 상태다. 어느 단계도 자동 RPM 승격이 아니다.
- 기존 Generated JS의 semanticKey를 발견 즉시 임의 덮어쓰지 않는다. 독립 REVIEW가 수학 및 metadata를 재판정한 후 핀포인트 수정한다. 기존 canonical 원본·RPM LOCKED·Meta ACTIVE pack은 이번 작업에서 변경하지 않는다.

## 6. 복성고 q15의 대표 오분류 수정

q15는 주사위 3회의 눈을 세 자리 숫자로 읽어 4의 배수를 센다. target L2는 H22-C-08-COUNTING_PRINCIPLE. 그러나 RPM Primary 2022 공통수학1에는 H22-C-07-CORE 아래 L3 **합·곱의 법칙**, L4 **경우를 나누어 세기** (H1-RPM-186)와 **단계별 선택** (H1-RPM-187)이 이미 있다. 따라서 RPM에 L3 자체가 없다는 단정은 오답이다.

- 원본 target L2 유지, semanticSourceScope를 앞선 단원 H22-C-07-CORE 후보로 기록. 이전 same-grade scope 재사용 계약/교육과정 적용성은 REVIEW에서 최종 확인한다.
- 원본의 결정적 단계는 끝 두 자리의 4배수 판정 → 허용 두 자리 경우 9개 → 백의 자리 6가지의 곱이다. 기존 L4의 부분 사례인지, 새 L4로 분리할지 별도 판정해야 한다.
- 같은 사고 구조의 세분화 L3를 제안할 수는 있지만 먼저 기존 합·곱의 법칙 L3와 구별할 근거를 요구한다. 후보 L3의 상태는 L3_GRANULARITY_REVIEW_REQUIRED이며 canonicalPromoted=false.
- 이전 B01 q15의 6 HOLD는 당시 분류 문제의 역사적 evidence로 유지, RPM이 완전히 없다는 단정은 새 source gap finding으로 정정한다. 새로운 q15 CREATE UID는 아직 0이다.

## 7. REVIEW와 후속 작업

REVIEW 채팅에서 전 candidate 학생용 입력을 blind 독립 풀이하고 정답·5지·해설·교육과정·RPM semantic과 신규성(실제 L3/L4 단계 차이)을 재판정한다. 신규 L3/L4는 독립 meta-review 증거를 제출하되 APPROVED 후보만 별도 taxonomy 승격 제안 대상으로 삼는다. **user 승인 전 canonical 승격 없음**. CREATE 후보 수·L3/L4 후보 수·독립 심사 통과 유형 수·학생 공급 수를 분리한다.

다음 배치 B02부터 강제 순서: A 원본 독해 → B1 RPM 범위 전수+prior/lower lookup → B2 EXT L3/L4 gap와 관계축 탐색 → B3 registry/triage/오개념 5지 및 답 위치 설계 Git 선저장 → C ACCEPT 제작 → D UID/shard/L2 manifest/receipt/extension registry readback. 독립 REVIEW는 별도 채팅.

## 8. CURRENT HARD — 원본 seed 단원보다 실제 해결 주개념의 뒤 단원 우선

- RPM Primary semantic lookup 전에 교과서 표준단원 순서와 실제 질문·결정적 풀이 구조를 먼저 비교한다. 앞 단원의 켤레복소수 등을 이용하더라도 최종 평가 목표가 삼차방정식의 계수/근인 경우 Primary는 더 뒤 단원인 삼차·사차방정식이다.
- source original standardUnitKey는 provenance로 보존하고, 신규 generated UID의 target standardUnitKey/standardUnitOrder/subUnitKey/Primary L3·L4를 뒤 단원 기준으로 바로잡는다. 아직 안 배운 뒤 단원은 학생 공급 scope를 제한한다.
- 복성고 q8: original H22-C-04-COMPLEX_BASIC, generated H22-C-06-HIGHER_EQUATION / H1-RPM-172. 허근쌍을 이용한 세부 전략만 EXT L4 검토, EXT L3 오판은 superseded.
- 복성고 q11: H22-C-06-INEQUALITY 아래 '절댓값을 포함한 부등식' L3 후보를 별도 분류표로 관리. 기존 RPM '절대부등식'은 AMGM/Cauchy여서 다르다. taxonomy 정식 승격은 별도 승인.
- 정본: docs/rules/01_CANONICAL/JS아카이브_단원순서_주개념분류_운영규정_v1.md. 새 분류표: archive/data/meta-foundation/candidates/high1/2022-commonmath1-absolute-value-inequality-v1.json.
