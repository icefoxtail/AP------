# ALIVE Validation Sidecar Schema v1.0

실제 학생용 문항 payload와 검증/지능 metadata를 분리하기 위한 최소 계약이다.

## 1. 기본 구조

```json
{
  "questionUid": "",
  "sourceUid": "",
  "familyId": "",
  "variantIndex": null,

  "mode": "EXAM_FOLLOWUP",
  "profile": "JS_ARCHIVE",

  "conceptKey": "",
  "problemTypeKey": "",
  "templateKey": "",
  "solutionEntry": "",
  "solutionGraph": [],

  "difficultyBucket": "unknown",
  "difficultyVectorSource": "model_estimated",
  "difficultyVector": {},
  "difficultyComparison": {
    "baselineSourceUid": "",
    "delta": {},
    "equivalence": "UNVERIFIED"
  },

  "visualDependency": "NONE",
  "visual": null,
  "trapTags": [],

  "validators": {},
  "finalStatus": "HOLD",
  "codes": [],

  "pipelineRunId": "",
  "checkpointId": "",
  "resumeFromStage": "",
  "requiredResource": "",
  "resumePayload": {}
}
```

## 2. Identity

- `questionUid`: 생성 문항의 canonical identity. 부여 정책이 확정되지 않았으면 빈 값/UNVERIFIED 가능.
- `sourceUid`: 원문 canonical UID.
- `familyId`: 의도된 문항 가족 식별자.
- `variantIndex`: STRICT_VARIANT 계열 순번.

STRICT_VARIANT의 같은 `familyId` 내부 유사성은 일반 near-duplicate 오류와 구분한다.

## 3. Difficulty

`difficultyBucket`: `basic | standard | advanced | challenge | unknown`

`difficultyVectorSource`:
- `anchor_compared`
- `model_estimated`
- `human_reviewed`

Vector 축:
`conceptDepth, interpretationLoad, decisionCount, branchingLoad, algebraLoad, abstractionLoad, visualReasoningLoad, answerComplexity`

`difficultyComparison.equivalence`:
- `EQUIVALENT`: Master Rulebook §11의 확인문제 동치 기준 충족
- `ADVANCED`: 인지 핵심 축이 실제로 상승
- `EASIER`: 인지 핵심 축이 하락하여 동치 불충족
- `UNVERIFIED`: 비교 기준 또는 근거 부족

`delta`는 원문 대비 생성 문항의 Difficulty Vector 차이를 기록한다. 원문 기준이 없으면 `EQUIVALENT`를 기록하지 않는다.

### Visual provenance

`visualDependency != NONE`이면 다음 `visual` 객체를 기록한다.

```json
{
  "visualSpecVersion": "0.1",
  "assetType": "svg",
  "assetRef": "",
  "renderer": "",
  "visualValidator": "UNVERIFIED"
}
```

`visualValidator`는 요약 상태다. 상세 method/evidence/coverage는 `validators.V5_VISUAL`에 기록한다. `visualDependency=NONE`이면 `visual`은 `null`로 둘 수 있다.

## 4. Validator result

각 Validator는 가능하면 다음 형태를 따른다.

```json
{
  "status": "PASS",
  "code": null,
  "blocking": false,
  "evidenceLevel": "A",
  "method": "independent_derivation",
  "coverage": "complete",
  "independenceLevel": "I2_SEPARATE_CALL",
  "evidence": ["검증 근거 요약"]
}
```

`evidence`에는 장문 chain-of-thought를 저장하지 않는다. 결과를 재검수할 수 있는 짧은 근거만 남긴다.

## 5. evidenceLevel

- A: 완전한 논리 증명 또는 완전 exact 검증
- B: 정확한 유한 전수검사/정확 계산
- C: 제한적 sampling 또는 휴리스틱
- D: 사람 추가 확인 필요

C/D만 남은 핵심 Validator를 근거로 Final PASS를 주지 않는다.

## 6. independenceLevel

- `I1_SAME_CONTEXT`
- `I2_SEPARATE_CALL`
- `I3_SEPARATE_MODEL`

운영 권장 기본은 I2.

## 7. Computational method / coverage

method 예:
- exact_symbolic
- exact_enumeration
- exact_rational
- numerical_exhaustive
- finite_sampling
- numerical_approximation
- not_applicable

coverage:
- complete
- partial
- heuristic
- not_applicable

finite_sampling/numerical_approximation만으로 Math PASS를 확정하지 않는다.

## 8. Final status

- PASS
- HOLD
- BLOCKED
- FAIL

`UNVERIFIED`는 개별 Validator status로 사용할 수 있으나 finalStatus로 사용하지 않는다.

## 9. Status / Code Registry

`finalStatus`와 `codes`는 분리한다. `codes`에는 아래의 code 문자열만 넣고 `BLOCKED:` 또는 `HOLD:` 접두어를 붙이지 않는다.

| code | finalStatus | blocking | 의미 |
|---|---|---:|---|
| `INPUT_REQUIRED` | BLOCKED | true | 대상·요청 등 필수 입력 부족 |
| `MODE_UNRESOLVED` | BLOCKED | true | MODE 결정 불가 |
| `MODE_CONFLICT` | BLOCKED | true | 규칙 조립 또는 MODE 충돌 |
| `CURRICULUM_BOUNDARY_UNRESOLVED` | BLOCKED | true | 교육과정 경계 확인 불가 |
| `VISUAL_ASSET_REQUIRED` | BLOCKED | true | 필수 시각 에셋 없음 |
| `PROMPT_BUDGET_EXCEEDED` | BLOCKED | true | 필수 Runtime Prompt가 설정된 토큰 예산을 초과 |
| `ARCHIVE_DUPLICATE_UNVERIFIED` | HOLD | false | Archive 중복 조회 미완료 |
| `COMPUTATIONAL_CONFLICT` | FAIL | true | 독립 풀이와 exact 계산 충돌 |
| `SYMBOLIC_EVALUATION_UNRESOLVED` | BLOCKED | true | 수식 동등성 exact 검증과 허용된 Fallback 모두 미확정 |
| `VISUAL_PARAM_MISMATCH` | FAIL | true | visualSpec와 문항 조건 불일치 |
| `VISUAL_TOPOLOGY_DRIFT` | FAIL | true | 필수 시각 구조 변형 |
| `VISUAL_SEMANTIC_OWNERSHIP_FAIL` | FAIL | true | 라벨·표식·수치의 의미 소유권 오류 |
| `VISUAL_ANSWER_LEAK` | FAIL | true | 에셋이 정답을 과도하게 노출 |
| `VISUAL_CROP_FAIL` | FAIL | true | 에셋 잘림 또는 안전 여백 실패 |
| `VISUAL_LABEL_MISMATCH` | FAIL | true | 시각 라벨 불일치 |
| `VISUAL_SCALE_CONFLICT` | FAIL | true | 축척·눈금과 조건 불일치 |
| `NONDETERMINISTIC_ASSET` | FAIL | true | 재현 불가능한 방식으로 생성된 에셋 |
| `STALE_ASSET_REUSE` | FAIL | true | 변경된 문항에 원문 에셋 재사용 |
| `MATH_VISUAL_CONFLICT` | FAIL | true | 수학 조건과 시각자료 충돌 |
| `FAKE_ADVANCEMENT_G09` | FAIL | true | 계산량만 증가한 가짜 심화 |
| `FIDELITY_DRIFT` | FAIL | true | 원문 핵심 유형·판단 구조 이탈 |
| `CURRICULUM_BOUNDARY_FAIL` | FAIL | true | 교육과정 밖 개념 사용 |
| `DISTRACTOR_INVALID` | FAIL | true | 오답 보기 검증 실패 |

`CURRICULUM_BOUNDARY_UNRESOLVED`는 판정 불가에 따른 BLOCKED이고, `CURRICULUM_BOUNDARY_FAIL`은 범위 위반이 확정된 FAIL이다.

## 10. Resume metadata

BLOCKED/HOLD 후 외부 자원 확보 시 재개할 수 있도록 최소한 아래를 저장한다.

```json
{
  "pipelineRunId": "run-...",
  "checkpointId": "cp-...",
  "resumeFromStage": "V5_VISUAL",
  "requiredResource": "visualAsset",
  "resumePayload": {}
}
```

HTTP endpoint나 DB 저장 위치는 Runtime Spec에서 구현한다.

## 11. 학생용 JS와 분리

이 Sidecar의 다음 정보는 현재 target schema가 공식 지원하지 않으면 `window.questionBank`에 넣지 않는다.

- difficultyVector
- validator evidence
- independenceLevel
- trapTags
- familyId
- checkpoint/resume
- internal codes
- visual provenance
