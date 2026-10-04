# ALIVE 범용 A/B/C 유사시험지 엔진 구현계획 v0.1

## 0. 문서 상태

- 상태: `IMPLEMENTATION_IN_PROGRESS`
- 목적: 중학교 1학년부터 고등학교 전 과정의 학교 시험지를 입력받아 A/B/C형 유사문항·유사시험지를 생산하는 범용 구조를 정의한다.
- 기준 구현: 현재 통합 B형 ALIVE 파이프라인
- 기본 모델 경로: `gpt-5.6-luna / xhigh`
- production Archive 등록: 금지
- 운영팩 포함: 금지. `alive/05_DESIGN/` 설계 전용 문서로 유지한다.

이 문서는 외부 설계 의견을 구현 계약으로 정리한 계획서다. 외부 의견은 규칙 원문이 아니며, 충돌 시 `docs/rules`의 canonical master와 현재 ALIVE 운영 기준을 우선한다.

2026-08-31 외부 검토의 필수 보강사항을 반영했다. 사용자가 구현 착수를 승인해 계약층·bounded A/B/C·planner·local Run lifecycle 구현을 시작했다. 실제 curriculum family capability가 fixture·solver·독립 검수·렌더 증거를 갖추기 전까지 production ACTIVE로 표시하지 않는다.

## 1. 최종 아키텍처 결정

### 1-1. A/B/C를 별도 런타임으로 복제하지 않는다

Source Exam → Universal Question IR → Structure Family/Curriculum Adapter → Variant Router → A/B/C Designer → 공통 ALIVE 검수·렌더·봉인의 구조를 사용한다.

현재 B형은 최종 아키텍처의 부모가 아니라 기준 구현(reference implementation)이다. 기존 B의 생성·재개·검수·패키지 안정성을 보존하면서 IR 계약에 맞는 B Adapter를 추가한다.

### 1-2. 공통 ALIVE 단계

기존 staged 순서는 폐기하지 않고 다음 단계를 삽입한다.

S00 SOURCE_LOCK → S01 PREFLIGHT → S01A VISUAL_RECON → S01B UNIVERSAL_IR_ANALYSIS → S01C VARIANT_ROUTER/CAPABILITY → S02 ROUND1_GENERATION → S02A VARIANT_PROOF_PRECHECK → S03 REVIEW1 → S04 BOUNDED_REVISION → S05 REVIEW2 → S06 MOTHER_FINAL → S07 ASSEMBLY → S08 BROWSER_RENDER → S09 PACKAGE → S09A FINAL_CLOSURE → SEALED

검산·solutionDetail·SVG·실제 브라우저·final closure·package는 A/B/C가 공통으로 사용한다.

### 1-3. 모델 선언은 판정 근거가 아니다

Builder가 `variantClass: C`라고 출력해도 Variant Proof의 증거 조합과 결정론적 reducer가 C 조건을 만족한다고 판정하지 않으면 C로 승인하지 않는다. Variant Proof 자체는 여러 증거 생산자가 만든 evidence를 모으는 하이브리드 계층이며, 최종 `verifiedClass` reducer만 결정론적으로 동작한다.

`declaredClass`는 모델의 주장이고 `verifiedClass`가 실제 판정이다. 결과는 `VERIFIED_A`, `VERIFIED_B`, `VERIFIED_C`, `FAKE_C`, `ADVANCED`, `REJECT`, `HOLD` 중 하나로 기록한다.

### 1-4. Variant Proof 판정 모델

Variant Proof는 다음 evidence producer의 결과를 모은 뒤 `Deterministic Variant Reducer`가 고정된 규칙으로 종합한다.

- `EXACT_SOLVER`: 답·정의역·제약·유일성 검산
- `DETERMINISTIC_GRAPH_NORMALIZER`: 풀이 그래프 정규화·fingerprint·동치류 계산
- `CURRICULUM_ADAPTER`: 교육과정·허용 연산·금지 방법·family capability 판정
- `STRUCTURED_MODEL_ANALYZER`: 의미 보존·변형 의도·학생 관측 입력에 대한 구조화된 분석
- `INDEPENDENT_REVIEWER`: Blind Math, Solution, Variant Comparison의 독립 evidence

각 proof check는 최소한 `check`, `status`, `method`, `evidenceRefs`를 갖는다. `method`가 없거나 evidence reference가 해소되지 않으면 해당 check는 `UNVERIFIED`이며 production 승격을 막는다. reducer는 모델의 선언이나 단일 reviewer 의견만으로 `VERIFIED_A/B/C`를 만들지 않는다.

## 2. 기준 문서와 충돌 처리

### 2-1. 작업 시 읽기 순서

1. `docs/rules/00_RULES_INDEX.md`
2. `docs/rules/01_CANONICAL/`의 최신 룰북·표준단원키 master·세부단원 규칙
3. `docs/rules/02_PIPELINES/`의 통합 운영·변환·해설 규칙
4. `docs/rules/03_REVIEW/`의 1·2·3차·무결성 검수 규칙
5. 해당 문항의 `docs/rules/04_VISUAL/` 규칙
6. `alive/01_CANONICAL/`, `alive/02_PIPELINES/`, `alive/03_SCHEMA/`, `alive/04_VISUAL/`
7. 이 문서와 선택된 family/adapter 계약
8. `90_ARCHIVE/`는 회귀 참고로만 사용

간이 단원표·과거 기억·legacy prompt로 canonical unit을 추정하지 않는다. 신규 `choices`에는 보기 번호를 넣지 않고 Archive 엔진이 번호를 렌더한다.

### 2-2. 기존 검수 재사용

새 엔진이 재사용하는 기존 게이트는 source lock, Run manifest, resume/recovery, visual recon, deterministic SVG, asset hash, 독립 math, solution arithmetic, solutionDetail, 학생 walkthrough, metadata finalizer, serialization lint, exam/solution/answer 브라우저 렌더, final closure, package CRC다.

새로 만드는 것은 A/B/C 변형 계약, Variant Proof, Universal IR, SolutionGraph, PreprocessNode, Structure Family Registry, Curriculum Adapter다.

## 3. 범위와 비범위

### 3-1. 목표

- 중1~고등 전 과정을 공통 IR로 표현한다.
- 과목명이 아니라 풀이 구조 family와 curriculum adapter로 capability를 선택한다.
- A는 검산 가능한 parameter 변형 중심으로 안정적으로 생산한다.
- B는 현재 실전 생성력을 유지한 채 IR과 Variant Proof를 연결한다.
- C는 필수 전처리 정확히 1단계만 추가한다.
- 모델 선언이 아니라 검증 가능한 evidence와 독립 검수 결과를 deterministic reducer로 종합해 A/B/C를 확정한다.
- 지원하지 않는 family·method·visual capability는 `HOLD`로 남긴다.

### 3-2. 비범위

- 모든 수학을 처리하는 하나의 Universal Solver
- 자유문장만으로 풀이 구조를 완전 판정하는 시스템
- 미지원 유형을 다른 유형으로 자동 강등하는 fallback
- A/B/C를 학생용 tag에 노출하는 방식
- 코드 검사만으로 실제 브라우저 검수를 대체하는 방식
- 초기 단계에서 전 과정 solver를 동시에 구현하는 것

## 4. VariantClass와 DifficultyLevel

`VariantClass`와 `DifficultyLevel`은 서로 다른 축이다.

| 유형 | 정의 | 핵심 판단 수 | 전처리 변화 | 난도 목표 |
|---|---|---:|---:|---|
| A | 안전한 동형 변형 | 동일 | 0 | 원문과 동급 |
| B | 같은 풀이구조를 다른 표현·조건·상황으로 재설계 | 동일 | 0 | 원문과 동급 ± 소폭 |
| C | 같은 핵심 풀이 전에 필수 해석·복원 1단계 추가 | 동일 | 정확히 +1 | 원문보다 소폭 상승 |
| ADVANCED | 새로운 핵심 판단·분기·개념 추가 | 증가 가능 | 제한 없음 | 별도 체계 |

어려운 원문의 A형은 여전히 어려울 수 있고, 쉬운 원문의 C형은 중하 수준일 수 있다.

## 5. A형 계약

A는 다음 불변조건을 모두 만족해야 한다.

- `coreConceptDelta = 0`
- `normalizedCoreGraphDelta = 0`
- `coreDecisionDelta = 0`
- `branchDelta = 0`
- `preprocessDelta = 0`
- `newConceptDelta = 0`
- `questionTypeDelta = 0`
- `curriculumDelta = 0`
- `parameterChanged = true`
- `effectiveParameterChangeCount >= 1`
- `parameterDistance`가 원문과 실질적으로 다른 값이어야 함
- `answerMemoryShortcut = false`
- `sourceClone = false`

허용 transform은 family adapter의 allowlist 안에서만 수행한다. 초기 공통 transform은 numeric, sign, coordinate, scale, count, index, angle, function parameter, interval, context skin, distractor rebuild이다.

답이 우연히 같아지는 것은 허용할 수 있지만, 수치·좌표·조건·발문이 실질적으로 동일하면 A로 승인하지 않는다.

### A 생성 순서

Source IR → Mutable Parameter Detection → Parameter Candidate Search → Constraint Filter → Family Exact Solver → Nice/Pedagogical Number Gate → Difficulty Comparison → Distractor Rebuild → A Variant Proof → 공통 ALIVE 검수.

### A 전용 Gate

`parameter changed`, `effectiveParameterChangeCount`, `parameterDistance`, `answerMemoryShortcut=false`, domain validity, solution graph invariant, decision/branch invariant, preprocessing invariant, curriculum/question type invariant, difficulty invariant, nice number, unique answer, distractor validity, no shortcut degeneration, visual regenerated when required를 모두 확인한다.

## 6. B형 계약과 연결

기존 B 생성 로직을 즉시 갈아엎지 않는다.

Existing B Candidate → Candidate IR Adapter → Source IR vs Candidate IR → B Variant Proof → 기존 review/closure 순서로 연결한다.

B 합격조건은 core concept 보존, normalized core graph 보존, core decision·branch·new concept 변화 0, representation/context의 의미 있는 변화, anti-clone PASS, bounded difficulty, unique answer다.

숫자만 바뀐 B 후보는 A로 재분류하거나 B 재생성으로 보낸다. 새 판단·분기·개념이 들어간 B 후보는 ADVANCED로 보낸다.

## 7. C형 계약

C의 구조는 Source의 S1 → S2 → S3 → ANSWER 앞에 P0 하나가 추가된 P0 → S1 → S2 → S3 → ANSWER다.

P0는 deterministic=true, branchCount=0, newConcept=false, coreDecisionDelta=0, outputArity=1 semantic object, required=true를 모두 만족해야 한다.

`stripPreprocessing(candidate.solutionGraph) == source.solutionGraph`, `candidate.coreDecisionCount == source.coreDecisionCount`, `candidate.preprocessingStepDelta == 1`을 모두 만족해야 한다.

outputArity가 1이라는 것은 숫자 하나만 의미하지 않는다. 좌표쌍·조건 묶음도 의미적 결과 객체 하나로 정의할 수 있다.

C 금지사항은 경우 나누기 추가, 새로운 개념 선택, 목표 변경, 복수 전처리, 장식 조건, 전처리 없이 가능한 shortcut이다.

## 8. Universal Question IR

Universal IR은 모든 단원을 하나의 풀이기로 처리하는 형식이 아니다. 공통 필드를 표현하고 실제 계산은 Structure Family와 Curriculum Adapter에 위임한다.

필수 필드는 schemaVersion, sourceQuestionId, sourceQuestionSha256, curriculum, questionType, structureFamily, concepts, givens, goal, solutionGraph, coreDecisionCount, branchCount, preprocessingStepCount, representation, parameters, mutableParameters, constraints, difficultyVector, allowedMethods, forbiddenMethods, capabilityStatus다.

IR에는 반드시 source hash와 rule snapshot hash를 연결한다. 변형·검수·렌더가 어느 기준본에서 파생됐는지 재현할 수 있어야 한다.

### StudentIR와 ProofIR 분리

StudentIR에는 학생용 content, choices, 표현·시각자료 정보, curriculum 식별자만 둔다.

ProofIR에는 source answer contract, source 계산값, source solution graph, parameter constraints, variant proof, private transformation data를 둔다.

독립 검수자는 StudentIR와 생성된 학생용 payload만 보고 답을 계산한다. source 정답·Builder answer contract·private plan은 숨긴다.

## 9. Canonical SolutionGraph

풀이 문장 유사도가 아니라 연산 구조를 비교한다. 값·계수·좌표는 graph identity에서 제외하고, 연산·입출력 역할·순서·분기·의존성을 포함한다.

각 node는 nodeId, role(core/preprocess), op, inputRole, outputRole, order를 가진다. Graph 전체는 nodes, edges, coreDecisionCount, branchCount, graphFingerprint를 가진다. `nodeId`와 생성 순번 자체는 identity에 포함하지 않는다.

- A: core node·role·순서·edge가 동일해야 한다.
- B: core graph는 동일하고 representation/context가 의미 있게 달라야 한다.
- C: preprocess role node를 제거한 뒤 core graph가 동일해야 한다.
- core graph·decision·branch·new concept가 증가하면 ADVANCED 후보가 된다.
- 다른 풀이법은 family adapter가 허용한 equivalenceClass가 아니면 동일 graph로 취급하지 않는다.

모델이 출력한 graph는 후보 입력일 뿐이다. 최종 graph는 deterministic normalizer, 제한된 operation registry, adapter의 equivalence registry, 독립 evidence로 확정한다. fingerprint는 `canonical op + semantic input/output role + dependency topology + decision/branch structure`로 계산한다. 양변에서 같은 연산을 다른 표기로 쓴 경우처럼 raw graph가 달라도 같은 것으로 볼 수 있는 범위는 해당 adapter의 equivalence class에서만 허용한다.

## 10. PreprocessNode 계약

C 전처리는 별도 PreprocessNode schema로 관리한다. 필드는 schemaVersion, nodeId, role=preprocess, op, inputs, output, deterministic, branchCount, newConcept, required, ablation, studentObservableInputsOnly이다. `studentObservableInputsOnly=true`는 필수이며, P0의 모든 입력은 학생용 content·choices·표·공개 조건·학생용 SVG 중 하나에서 확인 가능해야 한다. ProofIR에만 존재하는 비공개 source parameter를 P0 입력으로 사용할 수 없다.

전처리 제거 후 동일 정답·동일 핵심 route로 풀리면 FAKE_C다. 출력 arity가 계약과 다르거나 결과가 비결정적이면 C_REJECT다. 전처리 뒤 새 핵심 판단·분기·개념이 생기면 ADVANCED다.

## 11. Structure Family Registry와 Curriculum Adapter

초기 family 후보는 DIRECT_CALCULATION, LINEAR_EQUATION, SYSTEM_EQUATION, QUADRATIC_EQUATION, INEQUALITY_SOLVE, FUNCTION_PARAMETER, SEQUENCE_BASIC, COUNTING_BASIC, PROBABILITY_BASIC, DISTRIBUTION, COORDINATE_BASIC, COORDINATE_GEOMETRY, GEOMETRY_RELATION, TRIG_RELATION, LIMIT_CONTINUITY, DERIVATIVE, INTEGRAL, VECTOR_RELATION, MIXED다. `MIXED`는 분류 라벨로만 사용하며, 전용 adapter·solver·fixture·검수 계약이 생기기 전까지 자동 생성 capability는 `UNSUPPORTED`이고 항상 `HOLD`로 남긴다. 애매한 유형을 generic `MIXED` 처리로 우회하지 않는다.

목록에 있다고 바로 지원하는 것이 아니다. registry와 adapter에 capability가 등록되고 fixture·검산·필요한 렌더 증거가 쌓인 family만 SUPPORTED다.

Adapter는 identify, normalize_solution_graph, operationRegistry, graphCanonicalizer, equivalenceClassRegistry, supported_ops, allowed_methods, forbidden_methods, parameter_domains, constraint_rules, solver_profile, transform_capabilities, visual_capabilities, difficulty_rules를 제공한다. capability의 지원 여부는 family 전체가 아니라 `family × transform` 조합별로 기록한다.

지원되지 않는 family는 다른 family나 다른 variant로 조용히 낮추지 않고 CAPABILITY_PRECHECK_FAIL 또는 HOLD로 남긴다.

## 12. C MVP와 Proof Engine

첫 C transform은 PARAMETER_RECOVERY, INTERMEDIATE_INFERENCE, REPRESENTATION_DECODE 세 종류만 구현한다.

C Proof는 core graph preservation, core decision delta=0, preprocessing delta=+1, deterministic, output arity=1, branch delta=0, new concept delta=0, goal preserved, ablation FAIL, shortcut blocked, curriculum/method preserved, difficulty bounded, visual information necessity, `studentObservableInputsOnly=true`를 검사한다. C의 난도 상승 위치는 transform별 `preprocessLoad`로 기록하고, core decision·branch·new concept는 0으로 고정한다.

C 적합성이 없으면 B로 자동 강등하지 않는다. 해당 문항을 B로 만들려면 별도 B 후보로 재생성하고 결과와 근거를 새로 남긴다.

## 13. DifficultyVector

난도는 하나의 숫자가 아니라 interpretation, representation, decision, algebraLoad, calculationLoad, visualLoad, branch, newConcept 벡터로 기록한다. C에는 별도로 전처리 부담의 종류와 크기를 나타내는 `preprocessLoad: { type, magnitude }`를 기록한다.

초기에는 psychometric 점수라고 주장하지 않고 bounded heuristic으로 사용한다. 결정 수·분기·표현 변화·계산 복잡도·중간식 길이·시각 부담을 비교하고 경계 사례는 독립 reviewer와 Mother가 확인한다.

A는 핵심 delta 0, B는 decision/branch/newConcept 0과 제한된 representation/context 변화, C는 `preprocessLoad.magnitude = 1`인 필수 전처리 하나만 허용하고 decision/branch/newConcept 0을 유지한다. 전처리 부담의 type은 `PARAMETER_RECOVERY`, `INTERMEDIATE_INFERENCE`, `REPRESENTATION_DECODE`에 맞춰 algebra/calculation, interpretation, representation/visual 중 하나 이상으로 기록하며, 해석 부담 +1을 일률적으로 강제하지 않는다.

## 14. Variant Proof Sidecar

학생용 JS payload에 A/B/C 판정 정보를 섞지 않고 Run evidence와 final package sidecar에 저장한다.

필수 필드는 artifactType, schemaVersion, sourceQuestionId, declaredClass, verifiedClass, structureFamily, transform, capabilityStatus, coreConceptPreserved, solutionGraphPreserved, coreDecisionDelta, branchDelta, newConceptDelta, preprocessingDelta, preprocessLoad, preprocessDeterministic, preprocessOutputArity, studentObservableInputsOnly, ablationPassed, shortcutBlocked, difficultyDelta, proofChecks, proofSha256다. `proofChecks[]`의 각 항목에는 `method`와 `evidenceRefs`가 포함되어야 한다.

variantProof가 없거나 `method/evidenceRefs`가 해소되지 않은 후보는 A/B/C production candidate가 될 수 없다. sidecar는 학생용 해설에 정답이나 변형 의도를 누설하지 않아야 한다.

## 15. 시각자료와 학생용 해설

A/B/C 모두 변경된 수학 데이터 → 새 Visual Spec → deterministic SVG/PNG → hash validation → production browser render 경로를 사용한다. 원본 SVG를 단순 복사해 좌표만 얼추 바꾸지 않는다.

- A: 변경된 parameter에 맞춰 Visual Spec과 SVG를 재생성한다.
- B: 표현·배치·상황 변화가 있으면 semantic topology를 보존하며 재생성한다.
- C: REPRESENTATION_DECODE라면 시각 정보가 실제 전처리 입력인지 ablation으로 확인한다.
- 문제용 asset과 해설용 solution asset의 role·path·hash를 분리한다.

모든 유형은 기존 solutionDetail 구조인 given → goal → keyIdea → conceptNote → steps → check → commonMistakes를 사용한다. C 해설의 첫 단계에는 P0와 그 필요 이유를 명시한다.

## 16. 모델·에이전트·쓰기 경계

| 역할 | 책임 | 쓰기 영역 |
|---|---|---|
| Universal Analyzer | source IR·family·구조 근거 | source 자기 artifact |
| Variant Planner | A/B/C 계획·capability | plans |
| A/B/C Builder | 자기 후보와 해설·visual spec | 자기 inbox/draft |
| Variant Proof Validator | variant gate·sidecar | 자기 evidence |
| Independent Reviewer 1/2 | 독립 답·해설·Fidelity·시각 검수 | 자기 evidence |
| Mother Orchestrator | 상태 전환·reducer·final | manifest/final |
| Deterministic CLI | schema·hash·계산·round-trip·package | final staging |
| Browser Reviewer | exam/solution/answer 캡처·로그 | render evidence |

Builder는 독립 Verifier의 답·판단을 받지 않는다. Math Verifier는 source answer와 Builder answer contract를 받지 않는다. Review1과 Review2의 reasoning을 서로 입력으로 사용하지 않는다.

독립 검수는 같은 task 안에서 수행하더라도 입력 view를 분리한다. Pass A `Blind Math View`는 candidate StudentIR와 candidate visual만 보고 답을 독립 계산한다. Pass B `Solution View`는 그 후 solutionDetail만 보고 해설·산술·학생 이해 가능성을 검수한다. Pass C `Variant Comparison View`는 마지막에 source IR·candidate IR·variant plan을 보고 A/B/C fidelity를 판정한다. 앞 단계의 reasoning이나 정답을 뒤 단계의 입력으로 재사용하지 않는다.

모델은 기본 Luna xhigh를 유지한다. 결정론적으로 대체 가능한 작업을 로컬 CLI로 처리해 호출량을 줄이며, Luna high·Terra·Sol로 자동 전환하지 않는다.

## 17. Run 산출물

기존 Run 구조를 보존하면서 source/universal-question-ir.json, source/source-proof-ir.json, source/structure-family-evidence.json, source/capability-report.json, plans/variant-plan.json, candidates/{candidateId}/evidence/variant-proof.json, final/variant-proof-ledger.json을 추가한다. final ledger는 문항별 `variant` 상태와 전체 `variantProofLedgerComplete`를 포함하며, 각 check의 `method/evidenceRefs`가 최종 artifact까지 해소됐는지 기록한다.

기존 accepted artifact는 덮어쓰지 않는다. 수정은 새 attempt 또는 새 Recovery Run으로 남기며, final/은 Mother Orchestrator만 작성한다.

## 18. 개발 Phase

### Phase 0 — 공통 기반 계약

UniversalQuestionIR, CanonicalSolutionGraph, PreprocessNode, DifficultyVector, VariantProofSidecar, StructureFamilyRegistry, CurriculumAdapter interface, Capability/HOLD, StudentIR/ProofIR을 정의한다. 생성은 하지 않고 기존 B 결과를 분석만 한다.

완료 조건은 source 정보 손실 없음, graph 재현 가능, adapter 결정 가능, unsupported family HOLD, 같은 구조·다른 수치의 동일 graph, 다른 구조의 분리, source/rule hash 기록이다.

2026-08-31 Phase 0 1차 구현 checkpoint: `alive/engine/universal_ir.py`, `solution_graph.py`, `structure_families.py`, `variant_proof.py`와 계약 테스트를 추가했다. CLI의 `universal-ir-validate`, `variant-proof-validate`, `variant-proof-reduce`, `family-capability`로 독립 실행할 수 있으며, `final-closure-audit --variant-proof-ledger`를 사용하면 universal Run에만 variant proof blocking gate를 적용한다. 신규 계약·closure 테스트와 기존 엔진 회귀 테스트를 통과했지만, 아직 기존 whole-exam 생성 경로에 연결하지 않았으므로 capability를 ACTIVE/SUPPORTED로 승격하지 않는다.

### Phase 0.5 — Variant Reducer와 Evidence Contract

생성 전에 evidence producer 종류, evidence schema, `method/evidenceRefs` 해소 규칙, check status 우선순위, `verifiedClass` reducer의 결정표를 고정한다. `UNVERIFIED`, evidence 누락, `MIXED` generic fallback, family만 있고 transform이 없는 capability는 자동 PASS가 될 수 없도록 한다.

### Phase 1 — A MVP

초기 family는 DIRECT_CALCULATION, LINEAR_EQUATION, SYSTEM_EQUATION, QUADRATIC_EQUATION, FUNCTION_PARAMETER, SEQUENCE_BASIC, COUNTING_BASIC, PROBABILITY_BASIC, COORDINATE_BASIC으로 제한한다.

exact solver, parameter constraint, nice-number gate, distractor rebuild, A Proof, golden/negative fixture, 기존 ALIVE review·solution·render·closure 연결을 완료한다.

### Phase 2 — 기존 B의 IR 연결

기존 B 생성 로직은 보존하고 Candidate IR Adapter와 B Proof를 추가한다. 기존 golden 품질 유지, B→A/B→C 오분류 감지, 숫자만 바뀐 B 재분류, variant sidecar 저장을 완료조건으로 한다.

### Phase 3 — C MVP

PARAMETER_RECOVERY, INTERMEDIATE_INFERENCE, REPRESENTATION_DECODE 세 종류만 구현한다. PreprocessNode·graph strip·ablation·shortcut adversary·difficulty·visual necessity를 검증한다.

### Phase 4 — C Proof와 오분류 회귀

필수 negative fixture는 A_AS_B, B_AS_A, B_AS_C, FAKE_C, C_AS_ADVANCED, ADVANCED_AS_C, C_MULTIPLE_PREPROCESS, C_NEW_CONCEPT, C_BRANCH_ADDED, C_DECORATIVE_CONDITION, A_DIFFICULTY_DRIFT다.

### Phase 5 — Curriculum Adapter 확대

중등 대수·방정식·함수 → 중등 도형 → 고1 대수·방정식·부등식·경우의 수·행렬·좌표·원·함수 → 수학Ⅰ → 수학Ⅱ → 확률과 통계 → 기하·미적분 순으로 확대한다.

### Phase 6 — Mixed Exam Planner

단품 A/B/C가 안정된 뒤 source difficulty distribution, structure-family distribution, school profile, A/B/C target ranges, C eligibility, visual workload, constructed-response distribution을 사용해 시험지 전체를 배분한다.

원시험지 난도·단원·응답형 보존을 A/B/C 목표 비율보다 우선한다. C 적합 문항이 부족하면 목표 비율을 채우지 않는다.

### Phase 7 — Production Promotion

IR/Graph schema 버전 고정, family별 golden/negative fixture, 독립 수학·해설·시각·렌더·closure, resume/recovery/package, 외부 findings 해결, 별도 production 승인 전에는 production capability로 승격하지 않는다.

### 2026-08-31 구현 checkpoint — Phase 0~7 bounded path

- `universal_ir.py`, `solution_graph.py`, `structure_families.py`, `variant_proof.py`로 공통 계약·deterministic reducer를 구현했다.
- `universal_variant_engine.py`로 명시적 capability가 있는 구조화 입력에 대해 A numeric, B representation adapter, C single-preprocess MVP를 연결했다. A는 solver 전 후보만 만들며 답을 추정하지 않는다.
- `fixtures_universal_variant_contracts.json`과 `universal_variant_benchmark.py`로 positive/negative, FAKE_C, ADVANCED, ledger, family×transform 승격을 반복 검증했다.
- `mixed_exam_planner.py`와 `universal_variant_runtime.py`로 capability preflight, frozen batch plan, resume, 전용 actual-browser render evidence, package CRC, closure, local SEALED를 연결했다. `S08`·`S09`·`S09A`·`SEALED`는 generic stage 명령으로 우회할 수 없다.
- CLI에 `universal-plan` 및 `universal-run-*` lifecycle 명령을 추가하고 운영 문서를 연결했다.
- 회귀 결과: 전체 엔진 테스트 213개 PASS, universal contract benchmark 3회 determinism PASS.
- 이번 benchmark의 browser 항목은 실제 시험지 렌더를 대신하지 않는 lifecycle contract fixture다. 실제 universal 후보를 JS로 assembly하고 `archive/engine.html`에서 exam·solution·answer를 실제 브라우저로 확인하는 연결은 아직 남아 있으며, 해당 증거가 없으면 production PASS/ACTIVE로 승격하지 않는다.
- 현재 실제 production 승격 범위: 없음. benchmark에서 임시 fixture registry로 확인한 `LINEAR_EQUATION × {numeric, representation, PARAMETER_RECOVERY}`만 계약상 ACTIVE 예시이며, 기본 registry와 모든 미구현 family×transform은 HOLD/UNSUPPORTED다. production Archive 등록은 하지 않았다.

## 19. Golden·Regression Corpus

각 family마다 source canonical fixture, A positive, B positive, C positive(가능한 경우), unsupported/HOLD, answer conflict, solution arithmetic conflict, LaTeX/metadata, visual asset fixture를 둔다. capability promotion은 family 단위 aggregate가 아니라 `family × transform` 단위로 수행하며, ACTIVE로 올리려는 각 조합에 positive·negative·경계 fixture와 독립 검수 evidence가 있어야 한다.

Phase 0은 family당 최소 3개 분석 fixture, Phase 1은 A MVP family당 최소 10개, Phase 2는 실제 시험지 3~5개 비교, Phase 3~4는 C positive 20개·negative 20개 이상을 목표로 한다. 이 수량은 전체 합계가 아니라 승격 대상인 각 `family × transform` 조합에 분산되어야 하며, 어떤 조합이든 최소 fixture를 충족하지 못하면 해당 조합은 HOLD다.

수량은 품질을 대신하지 않는다. C는 문항 수보다 classification precision을 우선한다.

## 20. 최종 Gate와 실패 정책

Variant 최종 Gate는 source/rule lock, IR complete, family supported, declared-vs-verified class, 문항별 `variant` proof, 전체 `variantProofLedgerComplete=PASS`, graph/decision/branch, exact math/solution arithmetic, curriculum/method, answer/distractor/metadata/LaTeX, visual asset, review1/revision/review2, Mother final, browser render, `PACKAGE PASS`, `FINAL_CLOSURE PASS`, package CRC다. 순서는 `S09 PACKAGE → S09A FINAL_CLOSURE → SEALED`이며, package 생성만으로 production PASS가 되지 않는다.

하나라도 FAIL·UNVERIFIED·NOT_TESTED이면 production PASS가 아니다. capability 부족은 HOLD로 기록한다.

final closure가 기존 structure/math/answer/solution/solutionArithmetic/latex/meta/asset/render 항목을 모두 통과해도 문항별 `variant` 또는 전역 `variantProofLedgerComplete=PASS`가 없으면 봉인할 수 없다.

Source/rule drift는 즉시 HOLD/FAIL, IR 불완전은 Builder dispatch 금지, A 탐색 실패는 bounded search 후 HOLD, C ablation 실패는 FAKE_C/REJECT, answer 불일치는 bounded recheck와 bounded regeneration, 반복 실패는 MANUAL_REVIEW_REQUIRED 또는 BLOCKED로 닫는다.

`agent thread limit reached`는 backpressure로 기록하고 완료 task reconcile 후 같은 Run을 재개한다. 무한 재생성하지 않는다.

## 21. 실행 전 체크리스트

- [ ] 이 문서는 DESIGN_PROPOSED 상태로 유지한다.
- [ ] 현재 B형 production/검증 결과를 수정하지 않는다.
- [ ] Universal IR·Graph·PreprocessNode schema version을 고정한다.
- [ ] StudentIR/ProofIR 경계를 고정한다.
- [ ] operation registry와 graph equivalence 규칙을 고정한다.
- [ ] Variant Evidence producer·method·evidenceRefs와 deterministic reducer 규칙을 고정한다.
- [ ] 첫 A MVP family와 첫 C MVP family 범위를 선택한다.
- [ ] capability 승격 단위를 family가 아닌 family × transform으로 고정한다.
- [ ] MIXED를 classification-only/HOLD-only로 고정한다.
- [ ] A/B/C negative fixture 목록을 확정한다.
- [ ] current docs/rules master와 rule snapshot hash를 연결한다.
- [ ] 기존 final closure·render·package 계약을 재사용한다.
- [ ] PACKAGE 이후 FINAL_CLOSURE, 그 후 SEALED 순서를 고정한다.
- [ ] production Archive 미등록을 유지한다.

## 22. 구현 착수 기준

사용자의 구현 착수 승인으로 Phase 0 계약 구현을 시작했다. 다만 이 문서의 `ACTIVE`는 fixture·solver·독립 검수·렌더·closure를 모두 통과한 `family × transform`에만 적용한다. 현재 benchmark ACTIVE는 production capability가 아니라 local contract evidence이며, production Archive 등록은 계속 금지한다.

## 23. 2026-09-01 루프 엔지니어링 최종 페이즈 checkpoint

### 23-1. 이번 구현에서 연결된 항목

- `universal_high1_bridge.py`가 H22-C/H22-C2 canonical 18개 단원에서 단원별 대표 fixture를 선택하고, 기존 결정론적 High-1 solver·독립 검수·solutionDetail·시각자료를 Universal Run의 StudentIR/ProofIR로 분리한다.
- Universal Run의 S00~S09A와 `SEALED` 전용 전이를 CLI 전용 명령으로 연결했다. 전용 최종 단계는 generic stage 명령으로 위조할 수 없다.
- `S01A` visual recon, `S01B` Universal IR analysis, `S01C` capability preflight, 후보·변형 precheck, Review1, bounded revision, Review2, Mother final, assembly, browser render, package CRC, final closure, local seal을 실제 Run artifact로 기록한다.
- 최종 조립 JS는 `archive/engine.html`의 실제 exam·solution·answer 모드에서 확인하며, 캡처와 mode별 마지막 문항·overflow·image·MathJax 상태를 render evidence로 저장한다.
- 레거시 `final-closure-audit`를 Universal S09A에 선택적이지만 검증 가능한 `legacyFinalClosurePath`로 연결했다. 경로는 Run 내부로 제한되고, artifact type·status·package/node/questions/browser/externalReview/variant 게이트와 SHA-256을 확인한다.
- Archive `<br>`가 bare-math 검사에 걸리던 false positive와 방정식·점·집합·부등식의 수식 구분 누락을 수정했다. 학생 해설에 Python/JSON 값이 노출되지 않도록 High-1 값 formatter도 적용했다.

### 23-2. 실제 최종 검증 결과

최종 검증 Run은 `alive/runtime/universal-runs/20260901-high1-universal-final-04/`에 저장했고, 단일 최종화 명령의 재현 검증 Run은 `alive/runtime/universal-runs/20260901-high1-universal-final-05/`와 학생-facing formatter 개선 후 `alive/runtime/universal-runs/20260901-high1-universal-final-06/`에 저장했다. 18개 문항에 대해 다음을 모두 확인했다.

- 18문항 결정론적 solver·독립 검수·variant proof ledger: `PASS`
- exam 5페이지, solution 9페이지, answer 1페이지: 1번부터 18번까지 확인
- solution 시각자료 10개, exam 이미지 20개: image error `0`
- 페이지 overflow `0`, render error 없음, 미렌더 수식 `0`, JSON leak 없음
- Node/semantic round-trip/package CRC/final closure: `PASS`
- `publicationStatus`: `NOT_PUBLISHED`, production Archive 등록: `NOT_PERFORMED`
- `universal-high1-finalize` 단일 명령으로 `S08 → S09 → S09A → SEALED_LOCAL` 전이와 레거시 최종 감사 연결을 재현했다.
- 정답표의 내부 키 노출을 제거하고 `중심·반지름`, `정의역 제외값·점근선`, `경계값·해`로 정규화한 뒤 브라우저 캡처에서 재확인했다.

### 23-3. 이전 replay checkpoint의 한계

`universal_high1_bridge.py` 기반의 이전 `HIGH1_FIXTURE_REPLAY`는 Universal Run 수명주기와 기존 B 경로의 연결만 검증했으며, `VERIFIED_B`를 생산하는 범용 A/B/C 변환 solver가 아니었다. 그 기록은 회귀 참고용으로 보존하되, 현재 승격 판정의 근거로 사용하지 않는다.

### 23-4. 2026-09-01 실제 bounded A/B/C 승격 checkpoint

- `alive/engine/high1_variant_engine.py`에 H22-C/H22-C2 canonical 18개 단원을 위한 실제 bounded exact adapter를 추가했다. 이전의 단원별 ordinary 1개 경로를 보존하면서, `all_structured` scope에서는 전체 57개 일반·경계·복합 fixture를 선택하고 A는 유효한 수치 변형·재계산, B는 구조 보존 표현 변형, C는 공개 조건 해석을 포함한 단일 결정론적 전처리로 생성한다.
- 7개 구조 family(`DIRECT_CALCULATION`, `QUADRATIC_EQUATION`, `FUNCTION_PARAMETER`, `INEQUALITY_SOLVE`, `COUNTING_BASIC`, `COORDINATE_BASIC`, `COORDINATE_GEOMETRY`) × A/B/C 3개 변환 = 21개 조합에 대해 positive·negative reducer evidence를 모두 통과시켰다. capability report는 `ACTIVE_BOUNDED`, `activeCount=21`, `holdCount=0`이며 단원 수는 18개다.
- 각 A/B/C structured fixture에 대해 exact solver 재계산, 독립 fixture review, source/candidate SolutionGraph 비교, variant proof sidecar, solutionDetail, 시각자료·solution SVG, 수식 정규화, metadata 검사를 연결했다. 좌표 거리·유리함수처럼 Unicode 수식이 섞이기 쉬운 해설은 Archive 수식 경계로 정규화하고, 변형된 수치가 검산 문장에 남지 않도록 동적 검산 문장을 생성한다.
- 실제 production `archive/engine.html` 브라우저에서 A04/B04/C08을 각각 exam·solution·answer로 열어 확인했다. 각 Run은 exam 5페이지·solution 9페이지·answer 1페이지, 마지막 18번 확인, 해설 overflow 0, image failure 0, 미렌더 수식 0으로 통과했으며, 최종 봉인 상태는 모두 `SEALED_LOCAL`이다.
- 각 Run은 `S08 → S09 → S09A → SEALED`를 실제로 통과했고, Node/semantic round-trip, package CRC, 문항 게이트, browser 게이트, external findings, variant ledger가 모두 PASS다. `publicationStatus=NOT_PUBLISHED`, production Archive 등록은 `NOT_PERFORMED`로 유지했다.
- 이 승격은 구조화된 High-1 fixture vocabulary 안의 `ACTIVE_BOUNDED`다. 임의의 한국어 원문을 해석하는 범용 prose solver, 선택되지 않은 fixture 유형, High-1 밖의 family×transform은 여전히 `HOLD`이며 `ACTIVE_PRODUCTION`으로 표시하지 않는다.

### 23-5. 2026-09-01 all_structured expansion checkpoint

- `fixture_scope=all_structured`를 추가하여 18개 canonical unit의 57개 fixture(일반 19, 경계 19, 복합 19)를 모두 A/B/C 입력으로 통과시킨다. 기본 Python API의 `ordinary_per_unit` 호환 모드는 기존 18문항 테스트와 replay 재현성을 위해 유지한다.
- 전체 범위에서 A/B/C 후보 171개가 exact recomputation, candidate/sidecar contract, independent fixture review, solutionDetail, SVG structural render를 통과했다. capability report는 7 family × 3 transform = 21개 조합을 유지하고 각 조합의 positive/negative evidence를 전체 해당 fixture에 대해 누적한다.
- A visual mutation은 좌표평면·원·함수 그래프·표를 데이터에서 다시 생성하여 원본 그림과 변형 수치가 어긋나지 않게 한다. 원문에 없는 자유형 도형이나 등록되지 않은 prose family는 자동 생성하지 않고 HOLD한다.
- CLI `universal-high1-variant-prepare`의 기본 scope는 `all_structured`이며, 필요하면 `--fixture-scope ordinary_per_unit`으로 이전 18문항 호환 실행을 선택할 수 있다. 이 checkpoint는 코드·계약·fixture 단계까지의 승격이며, 실제 57문항 exam/solution/answer 브라우저 렌더와 최종 봉인은 별도 Run에서 수행해야 한다.

### 23-6. 2026-09-01 루프 엔지니어링 최종 봉인 checkpoint

- `all_structured` 범위의 권위 있는 최종 Run은 `20260901-high1-all-a06`, `20260901-high1-all-b05`, `20260901-high1-all-c05`이다. 각 Run은 canonical 18개 단원에서 일반 19개·경계 19개·복합 19개, 총 57문항을 생성하고 57개 candidate·57개 proof row·57개 독립 review row를 기록했다. A/B/C 세 Run의 총 후보 수는 171개다.
- 세 Run 모두 `S00 → S01 → S01A → S01B → S01C → S02 → S02A → S03 → S04 → S05 → S06 → S07 → S08 → S09 → S09A → SEALED`를 통과했다. `status=SEALED_LOCAL`, `publicationStatus=NOT_PUBLISHED`, production Archive 등록은 `NOT_PERFORMED`다.
- 실제 production `archive/engine.html`에서 exam·solution·answer를 브라우저로 열고 마지막 문항까지 폴링하여 확인했다. 각 Run의 exam은 15페이지·57문항·52개 이미지·image failure 0·MathJax error 0·overflow 0, solution은 29페이지·57문항·26개 이미지·image failure 0·MathJax error 0·overflow 0, answer는 2페이지·1~57번 확인·MathJax error 0으로 통과했다. mode별 top screenshot과 `render-evidence.json`을 Run 내부에 보존했다.
- fail-closed 최종 감사에서 발견된 표시 문제를 생성 후처리로 역반영했다. 좌표 부호(`x--3`), 유리수·기울기·절편의 exact formatting, 비율·함수 연쇄·행렬·가중평균 식의 math delimiter, answer grid의 기존 `$...$` 보존을 수정했고, 수정 후 세 Run의 57행 final review ledger가 structure/math/answer/solution/solutionArithmetic/latex/meta/asset/render 모두 `PASS`가 됐다.
- package CRC/semantic round-trip, `universal-run-resume` 재개 검증, legacy final closure path, external findings(`findings=[]`)를 세 Run 모두 재실행해 PASS를 확인했다. 따라서 이 checkpoint에서는 “생성 완료”가 아니라 실제 렌더와 재개·패키지·봉인까지 검증된 bounded lane으로 기록한다.
- 브라우저 렌더는 고정 sleep만으로 완료를 추정하지 않고 마지막 문항·마지막 페이지가 확인될 때까지 상태를 폴링해야 한다. 렌더 증거가 없거나 마지막 문항이 확인되지 않은 Run은 `SEALED_LOCAL`로 승격하지 않는다.
- 현재 승격 범위는 구조화된 High-1 fixture vocabulary의 `ACTIVE_BOUNDED`다. 임의 한국어 prose 해석, 미등록 fixture family, 다른 학년·과정의 family×transform은 계속 `HOLD`이며, 전체 18개 단원의 `ACTIVE_PRODUCTION` 승격이나 production Archive 등록으로 확대 해석하지 않는다.

### 23-7. 2026-09-01 Phase 5 curriculum catalog checkpoint

- `alive/engine/curriculum_catalog.py`를 추가하여 canonical master의 17개 과정·142개 단원 키를 자동 추출하고, master SHA-256과 과정·단원 순서를 함께 보존한다. 이 카탈로그는 label 검색용 임시 분류가 아니라 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`의 단원 식별 경계다.
- 아직 전용 solver·fixture·독립 검수·렌더 증거가 없는 단원은 모두 `CURRICULUM_ADAPTER_NOT_REGISTERED` / `HOLD` / `generationAllowed=false`로 기록한다. 카탈로그 등록만으로 capability를 만들지 않으며, family를 추정하거나 `MIXED`로 조용히 우회하지 않는다.
- `mixed_exam_planner.py`는 canonical catalog가 family를 제공하지 않을 때 분석 결과에 명시된 family만 보존하고, 분석 family도 없으면 `MIXED`로 HOLD한다. 기존 High-1 adapter는 family가 등록된 경우 기존 동작을 유지한다.
- CLI `curriculum-catalog-report`로 전체 canonical coverage와 HOLD 사유를 독립 확인할 수 있다. 다음 Phase 5 작업은 이 카탈로그 위에 중등 대수·방정식 adapter를 fixture·exact solver·solutionDetail·SVG·실제 Run 렌더까지 수직으로 추가하는 것이다.

### 23-8. 2026-09-01 Phase 5 중등 방정식 수직 slice checkpoint

- `alive/engine/middle_school_variant_engine.py`에 중1 M1-03 문자와 식의 일차방정식과 중2 M2-03 연립일차방정식 전용 adapter를 추가했다. 6개 구조화 fixture(일반·경계·복합)를 exact `Fraction` solver로 검산하고 A 수치변형·B 표현변형을 생성한다.
- 연립방정식은 학생용 해설에서 행렬식 공식을 사용하지 않고, 계수 맞추기·소거·대입의 중학교 풀이로 고정했다. 좌변의 `x,y` 표기와 음수 이항 표기를 명시적으로 렌더링하며, C parameter recovery는 실제 preprocess fixture가 등록될 때까지 HOLD다.
- `universal-middle-school-variant-prepare`가 S00~S07과 variant proof·Review1/2·Mother final·assembly를 기존 Universal Run에 연결한다. `universal-bounded-finalize`는 실제 browser evidence를 받아 S08~S09A~SEALED_LOCAL까지 공통적으로 닫고, production Archive에는 등록하지 않는다.
- capability report는 `LINEAR_EQUATION×{numeric,representation}`과 `SYSTEM_EQUATION×{numeric,representation}` 4개 조합을 `ACTIVE_BOUNDED`, 두 C 조합과 임의 prose는 `HOLD`로 유지한다. A/B 각 6문항 Run을 실제 `archive/engine.html`의 exam·solution·answer에서 확인했고, 마지막 6번·MathJax·overflow·image·package CRC·legacy closure가 모두 PASS하여 `20260901-middle-equations-a02`와 `20260901-middle-equations-b02`를 `SEALED_LOCAL`로 봉인했다.
- 회귀 결과는 전체 엔진 테스트 236개 PASS, `compileall` PASS, 두 Run resume PASS다. 이 checkpoint는 중등 전체 승격이 아니라 등록된 2개 단원·4개 family×transform 조합만의 bounded 승격이며, 나머지 140개 canonical unit과 미지원 변환은 계속 HOLD다.

### 23-9. 2026-09-01 최종 루프 재검토 checkpoint

- 23-8 이후 연립방정식 solver의 경계형을 보완했다. 첫째 식의 y 계수가 0인 경우 둘째 식의 x 계수로 나누지 않고 첫째 식에서 x를 직접 구한 뒤 둘째 식에 대입하도록 변경했으며, `d=0` 경계도 테스트로 고정했다. 학생용 해설에는 중학교 풀이만 남고 행렬식 공식은 노출되지 않는다.
- 보완 코드를 반영한 권위 Run은 `20260901-middle-equations-a03`과 `20260901-middle-equations-b03`이다. 각 6문항 모두 candidate·variant proof·Review1/2·Mother final·assembly를 통과했다.
- 두 Run 모두 실제 `archive/engine.html` 브라우저에서 exam 2페이지·6문항, solution 3페이지·6문항, answer 1페이지·6문항을 마지막 문항까지 확인했다. exam/solution/answer의 미렌더 수식 0, overflow 0, image failure 0, render error 없음이며 캡처 증거를 각 Run의 `render/render-evidence.json`에 저장했다.
- `universal-bounded-finalize` 후 package round-trip·legacy final closure의 package/node/questions/browser/externalReview/variant 게이트·`universal-run-resume`가 모두 PASS했다. 최종 상태는 두 Run 모두 `SEALED_LOCAL`, `publicationStatus=NOT_PUBLISHED`, production Archive 등록 `NOT_PERFORMED`다.
- 전체 회귀는 236개 테스트 PASS, `compileall` PASS, `git diff --check`는 줄바꿈 변환 warning만 있고 오류가 없다. 이로써 마지막 루프는 등록된 bounded lane에 대해 구현·독립검수·실제 렌더·봉인까지 닫혔다.
- 최종 판정은 `ACTIVE_BOUNDED`다. High-1 구조화 fixture lane과 중등 M1-03/M2-03의 명시된 A/B 조합만 승격하며, 중등 C 2개 조합·canonical master에 adapter가 없는 140개 단원·임의 한국어 prose 해석은 `HOLD`다. 전체 17개 과정·142개 단원을 `ACTIVE_PRODUCTION`으로 표시하지 않는다.

### 23-10. 2026-09-01 Phase 5 M2-04 일차함수와 그래프 checkpoint

- `alive/engine/middle_school_function_engine.py`와 `fixtures_middle_school_functions.json`을 추가하여 중2 M2-04 일차함수와 그래프의 구조화 fixture 수직 slice를 연결했다. 함수값 직접 계산 3개와 두 점을 이용한 식·함수값 복원 3개를 일반·경계·복합 입력으로 구성하고, 모든 계산은 `Fraction` 기반으로 결정론적으로 재계산한다.
- A는 수치 변형, B는 표현 변형으로 승격하고 C 매개변수 복원과 임의 한국어 prose는 `HOLD`로 유지한다. capability report는 `LINEAR_FUNCTION_GRAPH×{numeric,representation}`만 `ACTIVE_BOUNDED`로 보고하며, M2-04 전용 CLI prepare/capability 명령을 연결했다.
- 문제와 학생용 해설 모두 `simple_function_graph` SVG를 의무화했다. 점·직선·좌표축·라벨을 데이터에서 재생성하고, 해설은 조건·구할 것·풀이 아이디어·개념 확인·풀이 과정·검산·자주 하는 실수를 유지한다. 해설 SVG 6개는 실제 브라우저에서 로딩·표시를 확인했다.
- 첫 A01/B01 브라우저 검사에서 학생 해설에 구현 보조 함수 문자열 `_fmt(...)`가 누출되는 결함을 발견했다. f-string 수정과 누출 방지 단위 테스트를 추가한 뒤 A02/B02를 재생성하여 결함이 없는 상태로 다시 검수했다. 이처럼 브라우저 렌더가 코드·수학 검수 이후의 필수 결함 탐지 게이트로 작동했다.
- `20260901-middle-function-a02`와 `20260901-middle-function-b02`는 실제 `archive/engine.html`에서 exam 2페이지·6문항, solution 3페이지·6문항, answer 1페이지·6문항을 마지막 문항까지 확인했다. 세 mode 모두 미렌더 수식 0·overflow 0·image failure 0·render error 없음이며, solution의 구현 문자열 누출도 0이다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. A02 package SHA-256은 `2bce61c5d0998bf9b3aac12227a3e43ae260ff2955917d7caacdf38c13038fcd`, B02는 `a3e8c05b45f7dc55ff02525e51d284ad4fb41fa13b2b1dc25a98d9d18f1e6a7d`이다. `publicationStatus=NOT_PUBLISHED`를 유지했다.
- 이 checkpoint는 중등 M1-03·M2-03·M2-04의 등록된 bounded lane을 확장한 것이며, canonical master의 미등록 단원과 C/미등록 family×transform은 여전히 `HOLD`다. 따라서 전체 17개 과정·142개 단원은 계속 `ACTIVE_PRODUCTION`으로 표시하지 않는다.

### 23-11. 2026-09-01 Phase 5 M2-05 삼각형의 성질 checkpoint

- `alive/engine/middle_school_geometry_engine.py`와 `fixtures_middle_school_geometry.json`을 추가하여 중2 M2-05 도형의 성질 중 `TRIANGLE_PROPERTIES` bounded slice를 연결했다. 삼각형 내각의 합 3개, 외각의 성질 1개, 이등변삼각형 밑각 2개로 일반·경계·복합 6개 fixture를 구성하고, 각도 계산은 `Fraction`으로 결정론적으로 검산한다.
- A는 수치 변형, B는 표현 변형만 승격하고 C 매개변수 복원과 사각형의 성질은 `HOLD`다. capability report는 `TRIANGLE_PROPERTIES×{numeric,representation}`만 `ACTIVE_BOUNDED`로 보고한다.
- 문제와 학생용 해설 모두 `segment_geometry` 기반 삼각형 SVG를 의무화했다. 삼각형의 세 변, A/B/C 라벨, 주어진 각·구할 각, 외각 연장선, 해당하는 경우 직각 표시를 데이터에서 재생성한다. 해설에는 삼각형 내각의 합·외각·이등변삼각형 밑각 관계를 단계별로 남긴다.
- 첫 A01/B01 브라우저 검수에서 SVG의 `^\\circ` literal 표시를 발견했다. SVG용 유니코드 각도 포맷과 수식용 TeX 포맷을 분리하고, bare-math 정규화 회귀 테스트를 추가했다. 실패한 draft는 final PASS 근거에 섞지 않고 A03/B03을 새로 생성했다.
- `20260901-middle-triangle-a03`과 `20260901-middle-triangle-b03`은 실제 `archive/engine.html`에서 exam 2페이지·6문항, solution 3페이지·6문항, answer 1페이지·6문항을 마지막 문항까지 확인했다. 두 Run 모두 미렌더 수식 0·overflow 0·image failure 0·render error 없음이며, exam SVG 12개·solution SVG 6개가 실제로 로드됐다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. A03 package SHA-256은 `93cffaa43506f6e4867d6b3f6db65e0ababfd9003b5c229fc3656d861aceefe3`, B03은 `00b1e21f8fb6f9de8cf9005b7e51fababdc44e1e400c6bc7506438976b328093`이다.
- 이 checkpoint는 중등 M1-03·M2-03·M2-04·M2-05의 등록된 bounded lane만 확장한 것이다. 나머지 canonical unit, M2-05 사각형 family, C/미등록 family×transform은 계속 `HOLD`이며 전체 `ACTIVE_PRODUCTION` 승격은 하지 않는다.

### 23-12. 2026-09-01 Phase 5 M2-05 사각형의 성질 checkpoint

- `alive/engine/middle_school_quadrilateral_engine.py`와 `fixtures_middle_school_quadrilateral.json`을 추가하여 중2 M2-05 도형의 성질 중 `QUADRILATERAL_PROPERTIES` bounded slice를 연결했다. 평행사변형의 대각 3개와 인접각 3개로 일반·경계·복합 6개 fixture를 구성하고, 모든 각도는 `Fraction`으로 결정론적으로 검산한다.
- A는 주어진 각의 수치 변형, B는 도형 조건을 앞세운 표현 변형으로 승격한다. C parameter recovery는 `HOLD`다. capability report는 `QUADRILATERAL_PROPERTIES×{numeric,representation}`만 `ACTIVE_BOUNDED`로 보고하며 전용 CLI prepare/capability 명령을 추가했다.
- 문제와 학생용 해설 모두 `segment_geometry` SVG를 의무화했다. 평행사변형의 네 변, A/B/C/D 라벨, 평행 조건, 목표 각을 렌더하고, 90° 경계형은 네 꼭짓점 직각표시까지 데이터로 생성한다. SVG 표기는 TeX가 아닌 유니코드 `°`를 사용한다.
- 독립 테스트에서 인접각 풀이의 수식 delimiter 누락을 발견하여 수정했고, `$...$` 밖의 수식이 다시 나오지 않도록 final-closure 내부 정적 검사를 테스트에 연결했다.
- `20260901-middle-quadrilateral-a01`과 `20260901-middle-quadrilateral-b01`은 실제 `archive/engine.html`에서 exam 2페이지·6문항, solution 3페이지·6문항, answer 1페이지·6문항을 마지막 문항까지 확인했다. 각 Run의 exam SVG 12개와 solution SVG 6개가 로드됐고 미렌더 수식 0·overflow 0·image failure 0·render error 없음이다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. A package SHA-256은 `c8dacf133a357ff0c4fb06a659420e62e1d572008a3f6b7f769a537f490ed397`, B는 `1e25ea0941aa591ba6295650d110b6cf4b44d9d06f7a5278a8ed455dde96475c`이다.
- 이 checkpoint는 M2-05의 평행사변형 bounded family만 승격한 것이다. 직사각형·마름모의 별도 유형, C/미등록 family×transform, 나머지 canonical unit은 계속 `HOLD`이며 전체 `ACTIVE_PRODUCTION`으로 표시하지 않는다.

### 23-13. 2026-09-01 Phase 5 M2-06 닮음 checkpoint

- `alive/engine/middle_school_similarity_engine.py`와 `fixtures_middle_school_similarity.json`을 추가하여 중2 M2-06 도형의 닮음 중 대응변 길이의 비를 이용한 닮음 삼각형 bounded slice를 연결했다. 일반·경계·복합 및 역순 입력을 포함한 6개 fixture를 exact `Fraction` solver로 검산했다.
- A는 수치 변형, B는 대응비를 재배열한 표현 변형으로 승격하고, C parameter recovery와 임의의 닮음 도형·복합 도형 해석은 `HOLD`다. 문제·해설 모두 `segment_geometry` SVG를 필수로 하며, 대응변 라벨과 변형 수치가 함께 갱신된다.
- 전용 CLI `universal-middle-school-similarity-variant-prepare`와 `universal-middle-school-similarity-capability`를 연결했다. capability는 `SIMILAR_FIGURE×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-similarity-a01` / `20260901-middle-similarity-b01`은 실제 브라우저에서 exam 2p/6문항, solution 3p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 SVG image failure 0, 미렌더 수식 0, overflow 0, 마지막 문항 확인, `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, `universal-run-resume`를 통과하여 `SEALED_LOCAL`로 봉인했다.
- package SHA-256은 각각 `c829eddf3acb268bf3d81fecd9de6973b6e6a81972c8a3d3679126443003696d`, `399dadc655268966ba28513801616c89af79b78bd0075029ada1d4f810f70077`이며 `publicationStatus=NOT_PUBLISHED`를 유지했다. 전체 엔진 회귀는 252개 테스트 PASS, `compileall` PASS다.

### 23-14. 2026-09-01 Phase 5 M2-06 평행선 사이의 선분의 길이의 비 checkpoint

- `alive/engine/middle_school_parallel_ratio_engine.py`와 `fixtures_middle_school_parallel_ratio.json`을 추가하여 M2-06의 `PARALLEL_LENGTH_RATIO` 하위 유형을 별도 adapter로 연결했다. 삼각형 내부에서 `DE∥BC`인 선분 분할 구조를 일반·경계·복합·역순을 포함한 6개 fixture로 구성하고, `AD:DB=AE:EC`를 exact `Fraction`으로 검산한다.
- A는 수치 변형, B는 조건·비례식 표현 변형으로 승격하며, C parameter recovery와 임의의 평행선 도형 해석은 `HOLD`다. 문제·해설 모두 `segment_geometry` SVG를 필수로 하고, `DE∥BC`, D/E 위치, 네 분할 선분의 현재 수치를 표시한다.
- 전용 CLI `universal-middle-school-parallel-ratio-variant-prepare`와 `universal-middle-school-parallel-ratio-capability`를 연결했다. capability는 `PARALLEL_LENGTH_RATIO×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-parallel-ratio-a01` / `20260901-middle-parallel-ratio-b01`은 실제 브라우저에서 exam 2p/6문항, solution 6p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 SVG image failure 0, 미렌더 수식 0, overflow 0, 마지막 문항 확인, `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, `universal-run-resume`를 통과하여 `SEALED_LOCAL`로 봉인했다.
- package SHA-256은 각각 `d4a31f71e0e1cf167612d29f70fda2fc41279006fd820f670f7d9c77a56e236d`, `ea889495baff0e57e0c50a53748740b98f0a55ef905138c0cdbc67ab4ed3bd44`이며 `publicationStatus=NOT_PUBLISHED`를 유지했다.

### 23-15. 2026-09-01 Phase 5 M2-07 피타고라스 정리 checkpoint

- `alive/engine/middle_school_pythagorean_engine.py`와 `fixtures_middle_school_pythagorean.json`을 추가하여 M2-07 피타고라스 정리 중 두 직각변으로 빗변을 구하는 구조화 유형을 연결했다. 일반·경계·복합·역순을 포함한 6개 피타고라스 수 fixture를 exact solver로 검산하며, 정수가 아닌 빗변 후보는 이 bounded lane에서 거부한다.
- A는 수치 변형, B는 직각변·빗변 관계를 서술하는 표현 변형으로 승격하고, C parameter recovery와 피타고라스 정리 활용 word problem은 `HOLD`다. 문제·해설 모두 `segment_geometry` SVG를 필수로 하고, 직각표시와 AB·AC·BC 라벨을 표시한다.
- 전용 CLI `universal-middle-school-pythagorean-variant-prepare`와 `universal-middle-school-pythagorean-capability`를 연결했다. capability는 `PYTHAGOREAN_THEOREM×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-pythagorean-a01` / `20260901-middle-pythagorean-b01`은 실제 브라우저에서 exam 2p/6문항, solution 3p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 SVG image failure 0, 미렌더 수식 0, overflow 0, 마지막 문항 확인, `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, `universal-run-resume`를 통과하여 `SEALED_LOCAL`로 봉인했다.
- package SHA-256은 각각 `20ab8907c12cb47bdfdcffb45c149fc219f901644336a686cfc56a475a612976`, `d04b384d25f6498604bfdbec27fd6855fdf0c1f5104c831595663ecaf44ce053`이며 `publicationStatus=NOT_PUBLISHED`를 유지했다.

### 23-16. 2026-09-01 Phase 5 M2-07 피타고라스 정리 활용 checkpoint

- `alive/engine/middle_school_pythagorean_application_engine.py`와 `fixtures_middle_school_pythagorean_application.json`을 추가하여 M2-07 활용형 중 벽·지면·사다리를 직각삼각형으로 모델링해 사다리 길이를 구하는 구조화 유형을 연결했다. 일반·경계·복합·역순을 포함한 6개 fixture를 exact solver로 검산하고, 정수 답이 보장되지 않는 활용 입력은 이 bounded lane에서 거부한다.
- A는 수치 변형, B는 상황 설명 순서를 바꾼 표현 변형으로 승격하고, C parameter recovery와 임의의 실생활 word problem은 `HOLD`다. 문제·해설 모두 `segment_geometry` SVG를 필수로 하고 벽 높이·지면 거리·사다리·직각표시를 보여준다.
- 전용 CLI `universal-middle-school-pythagorean-application-variant-prepare`와 `universal-middle-school-pythagorean-application-capability`를 연결했다. capability는 `PYTHAGOREAN_APPLICATION×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-pythagorean-application-a01` / `20260901-middle-pythagorean-application-b01`은 실제 브라우저에서 exam 2p/6문항, solution 6p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 SVG image failure 0, 미렌더 수식 0, overflow 0, 마지막 문항 확인, `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, `universal-run-resume`를 통과하여 `SEALED_LOCAL`로 봉인했다.
- 활용 해설은 상황→직각삼각형 대응→피타고라스 정리→양의 제곱근·단위 확인 순서로 구성했다. package SHA-256은 각각 `ea8e91d15d0a1f97fbf099836aada1ea5700faaa2efbbdfe524bbd8ec8114669`, `658f0f521b82c0ebe51f76bd0ccbba9d046fbfe95cbe75663c71fedf8fb94407`이며 `publicationStatus=NOT_PUBLISHED`를 유지했다.

### 23-17. 2026-09-01 Phase 5 M2-08 확률 checkpoint

- `alive/engine/middle_school_probability_engine.py`와 `fixtures_middle_school_probability.json`을 추가하여 M2-08 확률의 구조화 bounded slice를 두 family로 분리했다. `PROBABILITY_BASIC`은 전체 경우의 수·유리한 경우의 수로 확률을 구하고, `PROBABILITY_COUNTING`은 제한된 표본공간의 경우를 세어 확률을 구하는 6개씩의 일반·경계·복합 fixture를 사용한다. 모든 답은 exact `Fraction`으로 결정론적으로 재계산한다.
- A는 수치 변형, B는 확률 표현 변형으로 승격하고 C parameter recovery와 임의의 한국어 확률 문장 해석은 `HOLD`다. 두 family의 시각자료는 문제 구조상 필수가 아니므로 `visualDependency=NONE`, `solutionVisualElements.required=false`로 명시하고, 시각자료가 필요한 다른 확률 family를 이 결과로 확장하지 않는다.
- 전용 CLI `universal-middle-school-probability-variant-prepare`와 `universal-middle-school-probability-capability`를 연결했다. capability는 `PROBABILITY_BASIC×{numeric,representation}`과 `PROBABILITY_COUNTING×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-probability-basic-a01/b01`과 `20260901-middle-probability-counting-a01/b01`은 실제 `archive/engine.html`에서 exam 2p/6문항, solution 3p/6문항, answer 1p/6문항을 확인했다. 네 Run 모두 마지막 6번까지 확인했고, image failure 0, overflow 0, render error 없음, 미렌더 수식 0이다. solution의 MathJax는 각각 30/42/30/30개, answer는 각 6개로 실제 렌더됐다.
- 네 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. package SHA-256은 basic A `7c5e6fed374213c11d33364c14af90911b98908dc89a78daf526e8ba4831f1c2`, basic B `7e5fdd65e0135928472de72d29abbfc564c9b19d9996958c061c65d933f394b7`, counting A `a474210fcb61d5a7c32293f66608b4b0367253946729d0ad0468f4cd40a3d30f`, counting B `dee2a8004d219603afbc476ac4a787824433ab81785edb66471afd7ed955929a`이며 모두 `publicationStatus=NOT_PUBLISHED`다.
- 이 checkpoint 이후 전체 엔진 회귀는 267개 테스트 PASS, `compileall` PASS, `git diff --check` 오류 없음이다. 이 승격은 M2-08의 두 등록 family에 한정된 `ACTIVE_BOUNDED`이며, 확률의 미등록 유형·C·다른 canonical unit은 계속 `HOLD`다.

### 23-18. 2026-09-01 Phase 5 M1-01 소인수분해 checkpoint

- `alive/engine/middle_school_prime_factorization_engine.py`와 `fixtures_middle_school_prime_factorization.json`을 추가하여 M1-01 소인수분해의 구조화 bounded slice를 연결했다. 소수 경계·반복 소인수·복합수·큰 소수 입력을 포함한 6개 일반·경계·복합 fixture를 사용하고, trial division과 지수 묶기를 결정론적으로 재계산한다.
- A는 입력 자연수의 수치 변형, B는 발문 표현 변형으로 승격하고 C parameter recovery와 임의 한국어 수와 식 해석은 `HOLD`다. 이 family는 수의 분해 표기 자체가 핵심이므로 `visualDependency=NONE`, `solutionVisualElements.required=false`로 명시한다.
- 전용 CLI `universal-middle-school-prime-factorization-variant-prepare`와 `universal-middle-school-prime-factorization-capability`를 연결했다. capability는 `PRIME_FACTORIZATION×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-prime-factorization-a01`과 `20260901-middle-prime-factorization-b01`은 실제 `archive/engine.html`에서 exam 2p/6문항, solution 3p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 마지막 6번, image failure 0, overflow 0, render error 없음, 미렌더 수식 0이다. 문제·해설·정답표는 SVG 없이 정상 표시됐다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. package SHA-256은 A `2c9d9aa364ecc9390120607993d4255ecbd221db35e9a1ac8175963cd65d3670`, B `9e77a754853c66c9b7b7c844632b214dbe3e8e503f60c453d35014d7d8340fd8`이며 모두 `publicationStatus=NOT_PUBLISHED`다.
- 이 checkpoint 이후 전체 엔진 회귀는 270개 테스트 PASS, `compileall` PASS, `git diff --check` 오류 없음이다. 이 승격은 M1-01의 등록 family A/B에 한정된 `ACTIVE_BOUNDED`이며, M1-01의 미등록 응용 유형·C와 다른 canonical unit은 계속 `HOLD`다.

### 23-19. 2026-09-01 Phase 5 M1-02 정수와 유리수 checkpoint

- `alive/engine/middle_school_rational_arithmetic_engine.py`와 `fixtures_middle_school_rational_arithmetic.json`을 추가하여 M1-02 정수와 유리수의 유리수 덧셈·뺄셈 bounded slice를 연결했다. 양수·음수·0 결과·음수 빼기·서로 다른 분모를 포함한 6개 일반·경계·복합 fixture를 사용하고, 모든 결과를 exact `Fraction`으로 재계산한다.
- A는 수치 변형, B는 계산 발문 표현 변형으로 승격하고 C parameter recovery와 곱셈·나눗셈·절댓값·수직선 등 미등록 유형은 `HOLD`다. 이 산술 family는 텍스트 수식만으로 구조가 완결되므로 `visualDependency=NONE`, `solutionVisualElements.required=false`로 명시한다.
- 전용 CLI `universal-middle-school-rational-arithmetic-variant-prepare`와 `universal-middle-school-rational-arithmetic-capability`를 연결했다. capability는 `RATIONAL_ARITHMETIC×{numeric,representation}`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-rational-arithmetic-a01`과 `20260901-middle-rational-arithmetic-b01`은 실제 `archive/engine.html`에서 exam 2p/6문항, solution 3p/6문항, answer 1p/6문항을 확인했다. 두 Run 모두 마지막 6번, image failure 0, overflow 0, render error 없음, 미렌더 수식 0이며 SVG 없이 정상 표시됐다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. package SHA-256은 A `e8102b94a7a23de530ebc45194629e8e69b3eaabae61b09b84a77a23a3008625`, B `98577ce8b9450ad719ab30b5ed5ecbf20ae5e3e14524c010c470cf8d4350247d`이며 모두 `publicationStatus=NOT_PUBLISHED`다.
- 이 checkpoint 이후 전체 엔진 회귀는 273개 테스트 PASS, `compileall` PASS, `git diff --check` 오류 없음이다. 이 승격은 M1-02의 등록 산술 family A/B에 한정된 `ACTIVE_BOUNDED`이며, 미등록 연산·C와 다른 canonical unit은 계속 `HOLD`다.

### 23-21. 2026-09-01 Phase 5 M1-05 기본도형 checkpoint

- `alive/engine/middle_school_basic_geometry_engine.py`와 `fixtures_middle_school_basic_geometry.json`을 추가하여 M1-05의 두 bounded slice를 연결했다. `BASIC_FIGURE_ANGLE_CLASSIFICATION`은 예각·직각·둔각·평각의 6개 각도 fixture, `POSITION_RELATION_LINE_PAIR`는 평행·수직·교차·비스듬한 교차를 포함한 6개 직선쌍 fixture로 구성했다.
- A는 수치 변형, B는 발문·표현 변형으로 승격하고 C parameter recovery는 `HOLD`다. 두 family 모두 `segment_geometry` SVG를 문제·해설에 의무화했다. 각도는 두 반직선과 각 표시, 위치 관계는 두 직선과 평행/직각 표지를 동일한 geometry data에서 생성한다.
- 독립 테스트에서 raw `<` 비교기호를 `\lt`로 정규화했다. 또한 위치 관계 문항의 중복 발문을 `(가)~(바)` 도형 표기로 분리했고, generic SVG renderer가 보조 좌표축을 그리던 문제는 표시용 직선 좌표를 양의 범위로 변환해 목표 직선만 렌더하도록 수정했다.
- 권위 Run `20260901-middle-basic-geometry-a03` / `20260901-middle-basic-geometry-b03`은 실제 `archive/engine.html`에서 exam 3페이지·12문항, solution 6페이지·12문항, answer 1페이지·12문항을 마지막 문항까지 확인했다. 두 Run 모두 exam SVG 24개·solution SVG 12개, image failure 0, 미렌더 수식 0, overflow 0, render error 없음이다.
- 두 Run 모두 `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과해 `SEALED_LOCAL`로 봉인했다. package SHA-256은 A `096680123969d35a90832714c72bf6d31e2e565d7f3ebee713c92171b05f8a92`, B `a2bb02385ad526a0ebeba6741dc483a0f5f6c63bb4fbaa191eae9779039fe680`이다.
- 이 checkpoint는 M1-05의 각 분류·두 직선 위치 관계 bounded family A/B만 승격한 것이다. 점·선·면의 미등록 관계, 입체도형 연결, C와 다른 canonical unit은 계속 `HOLD`이며 전체 `ACTIVE_PRODUCTION` 승격은 하지 않는다.

### 23-20. 2026-09-01 Phase 5 M1-04 좌표평면과 그래프 checkpoint

- `alive/engine/middle_school_coordinate_plane_engine.py`와 `fixtures_middle_school_coordinate_plane.json`을 추가하여 중1 M1-04의 `COORDINATE_PLANE_POINT` bounded slice를 연결했다. 제1·2·3·4사분면과 x축·y축 경계점을 포함하는 6개 일반·경계·복합 fixture를 사용하고, 좌표 부호를 exact하게 판별하는 결정론적 solver를 연결했다.
- A는 좌표 수치 변형, B는 발문·표현 변형으로 승격하고 C parameter recovery는 실제 전처리 fixture가 없으므로 `HOLD`로 유지했다. capability report는 `COORDINATE_PLANE_POINT×{numeric,representation}`만 `ACTIVE_BOUNDED`로 보고한다.
- 문제와 학생용 해설 모두 `coordinate_plane` SVG를 의무화했다. 좌표축·원점·점 A·라벨·사분면/축 위치를 동일한 데이터에서 생성하며, S01A visual recon에서 문제·해설 시각자료를 확인한 뒤 후보를 만든다. 해설은 좌표 부호 확인 → 사분면 또는 축 판별 → 좌표평면 검산 순서를 유지한다.
- 첫 정적 검수에서 좌표 부호의 `x=양수`·`x=0` 표현이 bare-math로 탐지되어 `$x$`, `$x=0$` 경계를 보강했다. 이후 전용 테스트 3개가 PASS했고, 생성된 A/B 후보의 정적 findings는 0이다.
- 권위 Run `20260901-middle-coordinate-plane-a01`과 `20260901-middle-coordinate-plane-b01`은 실제 `archive/engine.html`에서 exam·solution·answer를 모두 확인했다. 각 Run은 exam 2페이지·solution 3페이지·answer 1페이지, 마지막 6번 확인, MathJax 미완료 0, overflow 0, image failure 0, render error 없음이며 exam SVG 12개·solution SVG 6개가 정상 표시됐다.
- 두 Run 모두 `universal-bounded-finalize`의 S08 → S09 → S09A → SEALED_LOCAL, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. A package SHA-256은 `00c17b05a23fe7d230f281199101ed97756845842a5b3fbaea599a2796d7db87`, B는 `43389ed3da71c4544e3620439b3fccbf8e660830d1844ed31e509c77a82dea1c`이다.
- `publicationStatus=NOT_PUBLISHED`, production Archive 등록은 `NOT_PERFORMED`로 유지했다. 이 checkpoint는 M1-04의 등록된 좌표점 위치 slice만 승격하며, 직선의 방정식·도형의 이동·좌표 도형의 prose 해석과 C는 계속 `HOLD`다.

### 23-22. 2026-09-01 Phase 5 M1-06 평면도형의 성질 checkpoint

- `alive/engine/middle_school_polygon_circle_measure_engine.py`와 `fixtures_middle_school_polygon_circle_measure.json`을 추가하여 M1-06의 세 bounded slice를 연결했다. `POLYGON_INTERIOR_ANGLE_SUM`은 다각형 내각합 6개, `CIRCLE_AREA_CIRCUMFERENCE`는 원의 넓이·둘레 6개, `RECTANGLE_AREA_PERIMETER`는 직사각형 넓이·둘레 6개 fixture로 구성했다. 모두 일반·경계·복합 입력을 포함한다.
- A는 n·반지름·변 길이 수치 변형, B는 발문·표현 변형으로 승격하고 C parameter recovery는 `HOLD`다. 다각형은 내각합 공식, 원은 정확한 π 꼴, 직사각형은 넓이·둘레 공식을 exact solver로 재계산한다. 원의 일반 복합도형과 미등록 평면도형 해석은 이 bounded lane에서 확장하지 않았다.
- 문제와 학생용 해설 모두 시각자료를 의무화했다. 다각형은 `segment_geometry`와 해설용 대각선 가이드, 원은 중심·반지름을 포함한 `circle_geometry`, 직사각형은 가로·세로 라벨을 포함한 `segment_geometry`를 생성한다. 원 렌더는 460×320 캔버스의 동일 축척 조건을 만족하도록 x/y 범위를 계산한다.
- 첫 실제 해설 렌더에서 `원의 원의`, `넓이을/둘레을`, `{target}` 템플릿 누출을 발견해 generator와 전용 테스트에 반영했다. 수정 후 A02/B03을 재생성했고, 해설은 `renderReady=true`와 마지막 문항까지 기다려 확인했다.
- 권위 Run `20260901-middle-m1-06-a02` / `20260901-middle-m1-06-b03`은 실제 `archive/engine.html`에서 exam 5페이지·18문항, solution 9페이지·18문항, answer 1페이지·18문항을 마지막 문항까지 확인했다. 두 Run 모두 exam SVG 36개·solution SVG 18개, image failure 0, 미렌더 수식 0, overflow 0, render error 없음이다.
- 두 Run 모두 `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과해 `SEALED_LOCAL`로 봉인했다. package SHA-256은 A `50471776d389d01f57a8cb32efe25851c8617bd5872a87a87612a9adc846cd47`, B `4d9f4faa410ff9881de5c8e8b2c31402689a6a52589788e228ce4946d40cfaea`이다.
- 전용 테스트 3개와 전체 엔진 회귀 282개, `compileall`을 PASS했다. 이 checkpoint는 M1-06 세 등록 family의 A/B만 `ACTIVE_BOUNDED`로 승격하며, 원의 복합도형·정다각형의 개별 내각·다른 평면도형·C와 나머지 canonical unit은 계속 `HOLD`다. production Archive 등록은 하지 않았다.

### 23-23. 2026-09-01 Phase 5 M1-07 입체도형의 성질과 측정 checkpoint

- `alive/engine/middle_school_solid_figure_measure_engine.py`와 `fixtures_middle_school_solid_figure_measure.json`을 추가하여 M1-07의 정육면체 모서리 길이의 합과 직육면체 부피 bounded slice를 연결했다. 각 family에 일반·경계·복합 fixture를 6개씩 배치하고, 모서리 12개 성질과 세 변의 곱을 결정론적으로 재계산한다.
- A는 수치 변형, B는 표현 변형으로 승격하고 C parameter recovery와 겉넓이·원기둥·각기둥 등 미등록 입체도형 해석은 `HOLD`다. 두 family 모두 `segment_geometry` wireframe을 문제·해설에 의무화했으며, 해설 그림에는 실제 계산에 사용한 길이 표기를 유지한다.
- 전용 CLI `universal-middle-school-solid-figure-measure-variant-prepare`와 `universal-middle-school-solid-figure-measure-capability`를 연결했다. capability는 두 family의 `numeric`·`representation`을 `ACTIVE_BOUNDED`, C를 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-m1-07-a01` / `20260901-middle-m1-07-b01`은 실제 `archive/engine.html`에서 exam 3페이지·12문항, solution 6페이지·12문항, answer 1페이지·12문항을 마지막 문항까지 확인했다. 두 Run 모두 exam SVG 24개·solution SVG 12개, image failure 0, 미렌더 수식 0, overflow 0, render error 없음이다. 해설은 readiness polling 후 확인했고, 정답표는 12개 행을 육안으로 확인했다.
- 두 Run 모두 `universal-bounded-finalize`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과해 `SEALED_LOCAL`로 봉인했다. package SHA-256은 A `38618bcad2453cbc064975f4277acfa97c2bd9a336bff9f5f74423c9d59216a4`, B `c4e18047652bf0d3a32aefebb0d384866f70c3b969e90e00a9a532cfbb0b22d3`이며 모두 `publicationStatus=NOT_PUBLISHED`다.
- 전용 테스트 3개와 전체 285개 회귀·`compileall` 결과를 이 checkpoint에 반영한다. 이 checkpoint는 M1-07의 두 등록 family A/B만 `ACTIVE_BOUNDED`로 승격하며, 겉넓이·회전체·다른 입체도형 유형·C와 나머지 canonical unit은 계속 `HOLD`다. production Archive 등록은 하지 않았다.

### 23-24. 2026-09-01 Phase 5 M1-08 자료의 정리와 해석 checkpoint

- `alive/engine/middle_school_data_organization_interpretation_engine.py`와 `fixtures_middle_school_data_organization_interpretation.json`을 추가하여 M1-08의 자료의 정리와 자료의 해석 중 빈도 합계와 평균의 구조화 bounded slice를 연결했다. 각 family에 일반·경계·복합 6개 fixture를 배치하고, 빈도 합계와 평균을 `Fraction`으로 결정론적으로 재계산한다.
- A는 수치 변형, B는 표·발문 표현 변형으로 승격하고 C parameter recovery와 미등록 도수분포 해석은 `HOLD`다. 문제·해설 모두 동일한 원자료에서 생성한 `table` 시각자료를 의무화하고, 해설 표에는 계산 결과 행을 추가한다.
- 첫 A 준비에서 자료가 다른데도 동일해진 평균 변형과 generic 발문 중복을 독립 lint가 탐지했다. 평균 변형 domain을 보강하고 발문에 실제 자료값을 포함하도록 generator를 수정한 뒤 A03/B02 권위 Run을 재생성했다. 최종 duplicate-question check와 전용 테스트 3개가 PASS다.
- 전용 CLI `universal-middle-school-data-variant-prepare`와 `universal-middle-school-data-capability`를 연결했다. capability는 `DATA_FREQUENCY_TOTAL×{numeric,representation}`과 `DATA_MEAN×{numeric,representation}`을 `ACTIVE_BOUNDED`, C와 미등록 자료 해석을 `HOLD`로 기록한다.
- 권위 Run `20260901-middle-m1-08-a03` / `20260901-middle-m1-08-b02`는 실제 `archive/engine.html`에서 exam 3페이지·12문항, solution 6페이지·12문항, answer 1페이지·12문항을 마지막 문항까지 확인했다. 두 Run 모두 exam SVG 24개·solution SVG 12개, image failure 0, 미렌더 수식 0, overflow 0, render error 없음이다. 실제 표의 행·열과 해설 결과 행도 시각 확인했다.
- 두 Run 모두 `universal-bounded-finalize`의 `S08 → S09 → S09A → SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 통과했다. package SHA-256은 A `3c8ab1f54bfcfa9f63c6614085968b94899bbf9028badff9a15488b20f55d197`, B `961435c3f6274d46fe4e7087a78c089bbf274cefe00228b5b8c023f4a0c32a4a`이며 render evidence SHA-256은 각각 `e7a538e540f8c8d55495211d9055d01f5cd6e0a0cbb2547cd37c172b5a2e2188`, `d5ab369f46336ffa3237c16bcb8081c88143da1075aa17b4cc888d09d80561b2`다.
- 이 checkpoint 이후 전체 엔진 회귀는 288개 PASS, `compileall` PASS, `git diff --check` 오류 없음이다. 이 checkpoint는 M1-08의 두 등록 family A/B만 `ACTIVE_BOUNDED`로 승격하며, C·미등록 자료 해석과 다른 canonical unit은 계속 `HOLD`다. production Archive 등록은 하지 않았다.

### 23-25. 2026-09-01 Phase 6·7 최종 루프 연결 checkpoint

- `mixed_exam_planner.py`를 확장하여 원시험의 구조 family·난도 anchor·문항형식·시각자료 수·서술형 수를 보존하는 source distribution을 기록하고, 선택적인 A/B/C target class range, visual workload limit, constructed-response limit, school profile을 결정론적으로 검증한다. 기본 동작은 기존 순환 배분을 유지하며, 지원하지 않는 변형·범위 초과·eligibility 불일치는 조용히 대체하지 않고 `HOLD`다.
- `universal-plan`은 활성 bounded High-1 registry를 사용하도록 연결했고, `alive/engine/fixtures_phase6_mixed_exam.json`으로 A/B/C를 각 2개씩 배분하는 mixed-exam 계획을 실행했다. 원순서 보존, A/B/C target range PASS, 시각자료 2개, 서술형 2개, 구조·난도 분포 기록, `productionArchiveRegistration=NOT_PERFORMED`를 확인했다.
- 중등 bounded family IDs를 공통 `FAMILY_CANDIDATES`에 명시 등록했다. 이는 default registry에서 자동 승격하지 않으며, 전용 adapter가 등록된 경우에만 공통 contract와 Phase 6 planner가 해당 family를 이해할 수 있게 하는 연결이다.
- `phase7_final_audit.py`와 CLI `universal-phase7-audit`를 추가했다. 명시된 권위 Run마다 모든 S00~SEALED 단계, actual production-browser exam·solution·answer evidence, 마지막 문항·마지막 페이지·MathJax·overflow·image 상태, variant ledger, package SHA/CRC, legacy closure, `NOT_PUBLISHED`를 재검사하며 하나라도 빠지면 `HOLD`로 닫는다.
- M1-08 권위 Run `20260901-middle-m1-08-a03` / `20260901-middle-m1-08-b02`를 Phase 7 감사에 넣어 2/2 PASS, `PASS_ACTIVE_BOUNDED`를 확인했다. 이는 production 승인이 아니며 구조화 bounded lane의 local promotion state만 의미한다.

### 23-26. 2026-09-01 Phase 7 M1-07 integrity remediation 및 authoritative audit checkpoint

- 기존 M1-07 Run `20260901-middle-m1-07-a01` / `20260901-middle-m1-07-b01`은 결과 자체의 렌더 지표는 통과했지만, 봉인 manifest가 가리키는 render evidence SHA와 보존된 evidence 파일의 SHA가 달라 fail-closed 감사에서 제외했다. 봉인된 Run은 수정하지 않고 역사적 진단 자료로 보존한다.
- 새 권위 Run `20260901-middle-m1-07-a02` / `20260901-middle-m1-07-b02`를 동일한 source/batch plan으로 재생성했다. 실제 production `archive/engine.html`에서 exam은 3페이지·12문항·exam SVG 24개, solution은 6페이지·12문항·solution SVG 12개, answer는 1페이지·12행을 확인했다. 두 Run 모두 actual browser, 마지막 문항·마지막 페이지, MathJax 미완료 0, overflow 0, image failure 0, render error 없음이며 입체도형 SVG와 해설 SVG를 육안 확인했다.
- 두 새 Run은 render evidence SHA를 새 manifest에 고정한 뒤 `universal-bounded-finalize`에서 `SEALED_LOCAL`, package CRC/semantic round-trip, legacy closure, external findings, variant ledger, `universal-run-resume`를 모두 통과했다. A package SHA-256은 `f57505ba121fa8a311d11f4db9302b85d97d5d8d181b27a41c45f09855c7d230`, B는 `d4eca48635b55550a15bbb1df590c78b1ab26329b6599ce3d447dbde3d45ab8e`다. Render evidence SHA는 A `88d1c21a8c6dff98df3566c0e064ffb7d43b22273413d5f7653a01a4066612fe`, B `2561cda6245ebfa0c55c2fb234637465e873d8efbd771240cc34e6b5d93f7c50`이며 모두 `publicationStatus=NOT_PUBLISHED`다.
- 최신 권위 Run만 모은 `ALIVE_UNIVERSAL_VARIANT_ENGINE_PHASE7_AUDIT_AUTHORITATIVE_20260901.json`에서 고1 전체 A/B/C와 중등 bounded 범위의 총 35개 Run이 35/35 PASS, `PASS_ACTIVE_BOUNDED`를 기록했다. 모든 Run은 `NOT_PUBLISHED`이며 production Archive 등록은 `NOT_PERFORMED`다.
- 이 checkpoint의 원칙은 “과거 봉인본 수정 금지, 무결성 오류는 새 Run으로 교체, 최종 감사에는 최신 권위 집합만 사용”이다. 이는 `ACTIVE_PRODUCTION` 승격이 아니며, 미등록 family·C·나머지 canonical unit은 계속 `HOLD`다.
