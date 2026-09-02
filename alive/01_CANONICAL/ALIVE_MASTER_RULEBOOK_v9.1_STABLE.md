# ALIVE 문항 생성 Master Rulebook v9.1 STABLE

이 문서는 ALIVE 문항 생산 정책의 정본이다. 구현 세부(JSON Schema, API, Resume payload, Visual schema, Prompt Compiler)는 같은 폴더의 개별 Spec을 따른다.

## 1. Runtime 순서

모든 생성 요청은 아래 순서로 처리한다.

`요청 해석 → MODE → OUTPUT PROFILE → Input Level → BLOCKED 선판정 → Curriculum Boundary → 필요한 경우 Source Fingerprint → Difficulty Baseline → 설계 → Candidate → FREEZE → Validator Chain → Final Status → Structured Payload → Sidecar → Serializer → 출력`

Source Fingerprint는 조건부다.
- EXAM_FOLLOWUP: 원문에 대해 필수
- STRICT_VARIANT: 원문에 대해 필수
- TYPE_BANK: 기본형 생성 후 필수
- SERIALIZE_ONLY: 생략 가능
- REVIEW_ONLY: 요청 범위에 따라 적용

OUTPUT PROFILE은 노출 필드만 결정한다. Validator 실행범위를 줄이지 않는다.

## 2. MODE

### TYPE_BANK
대표유형 → 기본형 → 구조변형 → 사고확장. 숫자갈이 금지.

### EXAM_FOLLOWUP
실제 기출/원문 기반 확인·심화. 확인은 핵심 구조 재확인, 심화는 동일 핵심 개념의 정확한 1단계 상승.

### STRICT_VARIANT
원문 골격·유형·난도·풀이구조를 유지한 숫자/상수/변수 변형. 이 MODE에서만 의도된 숫자변형을 허용한다.

MODE가 결정되지 않으면 `finalStatus=BLOCKED`, code=`MODE_UNRESOLVED`.

## 3. OUTPUT PROFILE

- REVIEW_TEXT
- PROBLEM_ANSWER_ONLY
- JS_ARCHIVE

JS_ARCHIVE는 가능하면 `Structured Question JSON → Schema Validator → Deterministic Serializer → Syntax/Engine Validator` 순서를 사용한다.

## 4. Input Level

### L0
대상/요청이 불명확. 생성 금지. `finalStatus=BLOCKED`, code=`INPUT_REQUIRED`.

### L1
부분 정보만 있음.
- TYPE_BANK: 유형 분석·대표유형 초안 가능
- EXAM_FOLLOWUP: 원문 Fingerprint·후보 설계 가능. 교육과정 경계가 불명확하면 심화 최종승인 금지
- STRICT_VARIANT: 골격 분석·후보 수치변형 가능. 원문 curriculum을 보장할 수 없으면 최종승인 제한
- JS_ARCHIVE: 구조 변환 초안만 가능. target/schema가 없으면 최종 승인 금지

### L2
교육과정·대상·형식이 충분하여 생성과 핵심 Validator 가능.

### L3
sourceUid, target JS, Archive metadata, 근접문항 후보 등 운영 데이터까지 확보. 전체 파이프라인 가능.

## 5. Final Status

### PASS
모든 required Validator가 PASS 또는 N/A이며 HOLD/BLOCKED 사유가 없음.

### HOLD
문항 자체의 핵심 검증은 통과했으나 비필수 외부 검증이 미완료.
예: Archive Duplicate 조회 불가.

### BLOCKED
필요한 입력·자산·사람 결정이 없어 생산/승인을 진행할 수 없음.

### FAIL
수학적·교육과정적·유형적·직렬화 오류가 확정됨.

`UNVERIFIED`는 Validator 결과이며 Final Status가 아니다.

Final Status 결정:
1. 필수 입력/자산 없음 → BLOCKED
2. 필수 Validator FAIL → FAIL
3. 필수 핵심 Validator가 UNVERIFIED이거나 사람의 필수 결정 대기 → BLOCKED
4. 핵심 Validator PASS + 비필수 외부 검증 UNVERIFIED → HOLD
5. 모든 required Validator PASS/N/A → PASS

CLARIFY는 상태가 아니라 BLOCKED를 해소하기 위한 action이다.

## 6. Curriculum Boundary

허용:
- 현재 standardCourse/standardUnit 핵심 개념
- 명백한 선수개념
- 현재 학습 시점 이전에 배운 개념

금지:
- 이후 단원/상위학년/다른 선택과목 전용 개념
- 발문은 현재 과정인데 해설만 상위과정으로 해결

사고확장 개념 혼합은 기본적으로 `핵심개념 + 이미 학습한 선수개념 1개` 이내.

경계 확인 불가 → `finalStatus=BLOCKED`, code=`CURRICULUM_BOUNDARY_UNRESOLVED`.

## 7. Source Fingerprint

필요 시 내부적으로 다음을 구조화한다.

`sourceIdentity, concept, problemType, template, questionFormat, sourceObjective, solutionEntry, solutionGraph, decisionPoints, branchCount, hiddenConditions, commonTraps, visualDependency, answerForm, difficultyBucket, difficultyVector, lockedCore, mutableSurface, forbiddenTransforms`

## 8. Difficulty

세 체계를 병행한다.
- `level`: JS Archive 표시용 하/중/상
- `difficultyBucket`: basic/standard/advanced/challenge/unknown
- `Difficulty Vector`: 상대 비교·구조 분석용

Vector 축:
`conceptDepth, interpretationLoad, decisionCount, branchingLoad, algebraLoad, abstractionLoad, visualReasoningLoad, answerComplexity` (0~3)

Anchor가 없으면 `difficultyBucket=unknown` 또는 `difficultyVectorSource=model_estimated` 가능.
단, 난도 자체가 acceptance criterion인데 Anchor/근거가 부족하면 HOLD.

## 9. 역설계와 FREEZE

가능한 문항은 `목표 사고 → 정답 형태 → solutionGraph → 조건/수치 역산 → 발문/보기 → FREEZE` 순으로 설계한다.

FREEZE 후 오류 발견 시 정답/보기만 끼워 맞추지 않는다. Candidate를 폐기하고 설계 단계부터 다시 생성한다.

## 10. TYPE_BANK 규칙

### 대표유형
풀이 첫 단계, 조건 해석, 묻는 대상, 정답 도출구조, 오답 포인트, 발상 전환이 과도하게 겹치지 않게 정예화한다.

### 기본형
유형 핵심 사고를 가장 선명하게 보여주는 대표문항 1개가 기본값.

### 구조변형
- Structural Change 최소 1개 필수
- Surface/Format Change 가능하면 1개 이상
- 추가 변화가 유형 정체성을 훼손하면 Structural Change 1개만 허용하고 Fidelity Validator로 확인

숫자/문자/보기/첫 문장만 바뀐 문제는 구조변형이 아니다.

### 사고확장
A~F 인지 상승 유형을 최소 1개 적용하고 QUALITY A만 허용.

## 11. EXAM_FOLLOWUP 규칙

### 확인문제
- concept/problemType/solutionGraph/핵심 decision 수/curriculum boundary/형식 유지
- 난도 동치
- 숫자갈이에만 그치면 FAIL
- 독립 문항

확인문제의 난도 동치는 §8의 Difficulty Vector를 기준으로 다음처럼 판정한다.

- `conceptDepth`, `decisionCount`, `branchingLoad`, `interpretationLoad`, `abstractionLoad`는 원문과 같은 값을 유지한다.
- `solutionGraph`의 핵심 깊이와 풀이 진입점은 유지한다.
- `visualDependency=ESSENTIAL`이면 `visualReasoningLoad`도 같은 값을 유지한다.
- `algebraLoad`, `answerComplexity`는 각각 `|delta| <= 1`까지 허용할 수 있으나, 이것만으로 심화 판정을 하지 않는다.
- 인지 핵심 축 중 하나라도 `delta > 0`이면 확인문제가 아니라 심화 검토로 재분류한다. `delta < 0`이면 난도 동치가 아니므로 재설계한다.
- 핵심 축 또는 `solutionGraph`를 비교할 원문 기준이 없으면 동치 PASS를 주지 않고 `HOLD` 또는 사람 검토로 보낸다.

### 심화문제
필수:
1. 새로운 중간 판단 지점 +1
2. 발문 목표 또는 풀이 진입 방식 중 최소 1개 변화
3. 원문 핵심 판단 최소 1개 유지
4. A~F 최소 1개 적용
5. QUALITY A

원문 풀이를 그대로 복사해 끝까지 풀리거나 계산량만 증가하면 FAIL.

## 12. STRICT_VARIANT 규칙

LOCK:
`questionFormat, concept, problemType, solutionEntry, solutionGraph, 발문 논리 순서, 출제 의도, 난도 역할, 시각 구조, curriculum generation`

CHANGE:
수치, 상수, 변수명, 그에 따른 보기/정답.

원문 개선, 난도 조정, 조건 추가, 형식 변경, 교육과정 변경 금지.

## 13. 심화 A~F / QUALITY A~C

A 조건 역전 / B 경우 분기 / C 판단 레이어 / D 구조 역할 전환 / E 식 세우기 / F 반례·예외.

QUALITY A:
- 새 판단 +1 실제 존재
- 발문 목표 또는 풀이 진입 변화
- 원문 풀이 복사로 중간에 막힘
- 계산량보다 사고구조 상승
- Math/Curriculum/Fidelity 통과

QUALITY B/C는 폐기 후 재생성.

### G09 가짜 심화 자동 판정
원문 대비 delta를 사용한다.

`cognitiveGain = max(ΔdecisionCount, ΔbranchingLoad, ΔinterpretationLoad, ΔabstractionLoad)`

- `cognitiveGain <= 0 AND ΔalgebraLoad > 0` → FAIL, code=`FAKE_ADVANCEMENT_G09`
- `ΔalgebraLoad >= 2 AND cognitiveGain <= 0` → HARD FAIL, code=`FAKE_ADVANCEMENT_G09`

상태와 code 문자열의 전체 목록 및 blocking 여부는 Validation Sidecar Schema §9를 따른다.

계산량 증가와 함께 실제 판단도 증가한 경우에는 자동 FAIL하지 않고 V3에서 평가한다.

## 14. Validator Chain + Early Exit

기본 순서:
`V1-A Independent Solver → V1-B Computational(적용 가능 시) → V2 Curriculum → V3 Fidelity → V4 Distractor(객관식) → V5 Visual(시각문항) → V6 Duplicate → V7 Serialization(JS_ARCHIVE)`

Early Exit:
- V1-A FAIL → 즉시 Candidate 폐기
- V1-B exact 검증에서 FAIL/CONFLICT → 즉시 폐기
- V2 FAIL → 즉시 폐기
- V3 FAIL → 즉시 폐기
- 이후 Validator도 blocking FAIL 발생 시 후속 실행 중단

적용 불필요 Validator는 호출하지 않는다.

V3는 현재 원문/대표유형과의 관계를 본다.
V6는 원문 외 Archive 및 같은 batch의 다른 문항과의 관계를 본다.

## 15. V1 독립성 수준

- I1 SAME_CONTEXT: 같은 호출 내 최종 발문만 다시 풀이
- I2 SEPARATE_CALL: 별도 호출에 최종 발문만 전달, 의도 답/해설 숨김
- I3 SEPARATE_MODEL: 별도 모델/Validator 서비스

운영 권장 기본은 I2. 중요 문항은 I3 검토.
Sidecar에 independenceLevel을 남긴다.

## 16. Computational Verifier 증거 수준

method 예:
`exact_symbolic, exact_enumeration, exact_rational, numerical_exhaustive, finite_sampling, numerical_approximation, not_applicable`

coverage:
`complete, partial, heuristic, not_applicable`

finite_sampling / numerical_approximation만으로 Math 최종 PASS를 결정하지 않는다.
V1-A와 완전 exact 계산 결과 충돌 → FAIL `COMPUTATIONAL_CONFLICT`.

## 17. 객관식 Distractor

오답은 실제 오류 경로에서 생성한다. 단순 주변 수치 나열 금지.
정답 1개, 오답 4개, 동일 의미 보기 없음, 보기 5개 전수 판정.

정답번호 분산은 시험지 조립기 책임이며 ALIVE 생성 품질보다 우선하지 않는다.

## 18. Visual Dependency

NONE / OPTIONAL / ESSENTIAL.

ESSENTIAL 시각자료를 편의상 텍스트 문제로 바꾸지 않는다.
Asset 없음 → `finalStatus=BLOCKED`, code=`VISUAL_ASSET_REQUIRED`; Visual Spec에 따라 하위 엔진으로 라우팅.

## 19. Duplicate / Family

STRICT_VARIANT는 같은 원문 계열을 `familyId`로 묶을 수 있다.
동일 family 내부 의도된 유사성은 일반 near-duplicate FAIL 규칙과 분리한다.

다른 family 또는 TYPE_BANK/EXAM_FOLLOWUP에서 solutionEntry/solutionGraph/조건구조/질문대상/핵심함정이 사실상 같고 표면만 다르면 재생성 또는 FAIL.

Archive 조회 불가 → `finalStatus=HOLD`, code=`ARCHIVE_DUPLICATE_UNVERIFIED`.

## 20. Question Payload와 Sidecar 분리

학생용 Question Payload에는 내부 검증필드를 넣지 않는다.

`sourceFingerprint, difficultyVector, validator evidence, trapTags, familyId, provenance` 등은 Validation Sidecar에 저장한다.

주관식 정답 canonicalization 상세는 `../03_SCHEMA/ALIVE_STRUCTURED_QUESTION_SCHEMA_v1.0.md`를 따른다.

## 21. Runtime/Compiler/Visual 구현 경계

이 Master Rulebook은 정책 정본이다.

다음은 별도 Spec이 정본이다.
- Structured Question/Answer 계약
- Validation Sidecar
- Early Exit/Checkpoint/Resume
- Prompt Compiler
- Visual Spec

HTTP endpoint, DB schema, webhook, retry/idempotency 등 백엔드 구현 세부를 Master Rulebook에 고정하지 않는다.

## 22. 절대 금지

- 성립 오류를 정답만 바꿔 통과
- 복수정답/조건 부족 통과
- 교육과정 밖 개념으로 억지 심화
- 검증하지 않은 문항 PASS
- ESSENTIAL visual 제거
- Archive 조회 안 하고 Duplicate PASS 주장
- TYPE_BANK 숫자갈이
- EXAM_FOLLOWUP 계산량 심화
- STRICT_VARIANT 유형 개선
- PROFILE 때문에 Validator 생략
- SymPy/수치 sampling만으로 모든 수학 문제 최종 판정
- FREEZE 후 끼워맞추기
- 잘린 output 추측 복구 후 PASS
- 품질보다 속도 우선

## 23. 최종 우선순위

`수학적 무결성 > 교육과정 적합성 > 유형 충실도 > 학습 가치 > 검증 가능성 > 다양성 > 출력 편의성 > 속도`
