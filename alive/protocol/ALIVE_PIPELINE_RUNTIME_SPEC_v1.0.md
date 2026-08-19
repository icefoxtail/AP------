# ALIVE Pipeline Runtime Specification v1.0

Master Rulebook을 실제 파이프라인으로 실행하기 위한 최소 런타임 계약이다.
HTTP endpoint, D1 table, queue 제품 선택은 이 문서에서 고정하지 않는다.

## 1. Stage

```text
S0 REQUEST
S1 MODE_PROFILE_INPUT
S2 CURRICULUM_FINGERPRINT
S3 DESIGN
S4 CANDIDATE
S5 FREEZE
V1A MATH_INDEPENDENT
V1B MATH_COMPUTATIONAL
V2 CURRICULUM
V3 FIDELITY
V4 DISTRACTOR
V5 VISUAL
V6 DUPLICATE
V7 SERIALIZATION
S6 FINALIZE
```

## 2. Conditional Routing

- V1A: 항상
- V1B: 계산 검증 적합 + 실행환경 있음
- V4: 객관식만
- V5: visualDependency != NONE
- V6: duplicate source available 또는 정식 Archive 승인 단계
- V7: JS_ARCHIVE만

불필요 Validator를 호출하지 않는다.

## 3. Early Exit

뒤 Validator가 앞 단계의 확정 FAIL을 뒤집을 수 없으면 즉시 중단한다.

```text
V1A FAIL → Candidate 폐기 → S3/S4 재설계
V1B exact FAIL/CONFLICT → Candidate 폐기 → 재설계
V2 FAIL → Candidate 폐기 → 재설계
V3 FAIL → Candidate 폐기 → 재설계
V4/V5/V6/V7 blocking FAIL → 후속 stage 중단
```

재생성 횟수는 Runtime 설정으로 제한한다. 제한 초과 시 사람 검토 또는 BLOCKED로 라우팅한다.

## 4. 상태와 다음 행동

### PASS
S6 FINALIZE 가능.

### HOLD
핵심 문항은 완성. 비필수 외부 검증 대기.

### BLOCKED
필수 입력/자원/사람 결정 대기.

### FAIL
현재 Candidate 사용 금지. 재설계 가능하면 재시도, 구조적으로 불가하면 종료.

Action 예:
- CLARIFY_USER
- ROUTE_VISUAL_ENGINE
- LOAD_CURRICULUM_MASTER
- LOAD_ARCHIVE_CANDIDATES
- HUMAN_REVIEW
- REGENERATE

## 5. Checkpoint

각 run은 최소 다음을 관리한다.

```json
{
  "pipelineRunId": "",
  "batchId": "",
  "checkpointId": "",
  "currentStage": "",
  "completedStages": [],
  "completedQuestionIds": [],
  "lastCompleteId": null,
  "resumeFromId": null,
  "payloadComplete": false
}
```

Checkpoint는 완전한 Candidate 또는 완전한 stage 결과에서만 확정한다.

## 6. BLOCKED/HOLD Resume Contract

BLOCKED/HOLD 시 Sidecar에:

```json
{
  "checkpointId": "cp-...",
  "resumeFromStage": "V5_VISUAL",
  "requiredResource": "visualAsset",
  "resumePayload": {}
}
```

을 남긴다.

외부 자원이 확보되면 전체 파이프라인을 처음부터 무조건 재실행하지 않고, 해당 자원이 앞 단계의 핵심 전제를 바꾸지 않는 한 `resumeFromStage`부터 재개할 수 있다.

예외:
- 원문 content가 바뀜
- curriculum 판정이 바뀜
- answer/candidate가 바뀜

이 경우 V1A부터 다시 검증한다.

## 7. Resume API 구현 원칙

구체 endpoint 이름은 백엔드 구현에서 정한다.
필수 입력 의미만 고정한다.

```json
{
  "pipelineRunId": "",
  "checkpointId": "",
  "resourceType": "visualAsset",
  "resourceRef": "",
  "resumePayload": {}
}
```

필수 런타임 성질:
- idempotent resume
- 같은 checkpoint 중복 처리 방지
- stale checkpoint 탐지
- resource provenance 기록

## 8. Truncation

TRUNCATED 조건:
- Structured JSON parse 실패
- 배열/객체 미종료
- expected id 누락
- Serializer output 미종료
- final completion marker 없음

처리:
1. 미완성 payload 폐기
2. 마지막 완전 checkpoint 확인
3. resumeFromId/stage부터 재실행

잘린 JS/JSON을 추측해서 이어붙여 PASS하지 않는다.

## 9. Batch

해설 포함은 6문항 권장, 8문항 안팎을 상한 기준으로 삼되 고정 법칙은 아니다.
후반부 품질 저하 또는 truncation 위험이 보이면 더 작게 분할한다.

## 10. G09 자동 Gate

원문 대비 delta:

```text
cognitiveGain = max(
  ΔdecisionCount,
  ΔbranchingLoad,
  ΔinterpretationLoad,
  ΔabstractionLoad
)
```

- `cognitiveGain <= 0 AND ΔalgebraLoad > 0` → G09
- `ΔalgebraLoad >= 2 AND cognitiveGain <= 0` → HARD FAIL G09

실제 인지 축이 상승하면 자동 G09 대신 V3가 최종 판단한다.

## 11. Retry

재시도는 같은 실패 문항을 정답/보기만 부분 수정하는 방식이 아니다.
`REGENERATE`는 설계/Candidate 단계부터 새 후보를 만드는 것을 뜻한다.

## 12. Observability 최소 로그

저장 권장:
- run/stage/status/code
- model/tool/version
- duration/cost token summary 가능 시
- Validator method/coverage
- checkpoint

장문 chain-of-thought는 저장하지 않는다.
