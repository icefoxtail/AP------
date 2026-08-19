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

  "visualDependency": "NONE",
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

## 9. Resume metadata

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

## 10. 학생용 JS와 분리

이 Sidecar의 다음 정보는 현재 target schema가 공식 지원하지 않으면 `window.questionBank`에 넣지 않는다.

- difficultyVector
- validator evidence
- independenceLevel
- trapTags
- familyId
- checkpoint/resume
- internal codes
