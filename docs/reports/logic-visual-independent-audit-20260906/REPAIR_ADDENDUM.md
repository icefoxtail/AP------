# 외부 독립 검수 후 fail-closed 보완 addendum

검수 기준일: 2026-09-06 KST

원본 외부 검수 보고서의 전체 판정 `FAIL`은 유지한다. 이번 보완은 실패 증거가 PASS로 집계되는 경로를 닫고, fresh blind·독립 수학 검산·실제 브라우저 witness가 없을 때 자동으로 차단하도록 파이프라인을 수정한 기록이다. 새로운 외부 V1/V2 세션이나 수학·브라우저 인증을 내부 코드가 대신 만들지는 않았다.

## 반영된 보완

- `lib/canonicalize.mjs`: typed schema의 문자열·배열·중첩 case/lattice 타입과 음수/null/중복을 검사한다. semantic hash에서 `questionUid`를 제외하고, case 행은 `caseId`로 정규화한다. UID identity는 별도 raw record에 남긴다.
- `run-phase2-batch-11.mjs`: 한 스크립트가 V1/V2 관찰·요구사항 adjudication·C·item PASS를 생성하던 경로를 제거했다. 현재는 source-only/artifact-only 입력 번들만 만들고 `READY_FOR_EXTERNAL_FRESH_BLIND_REVIEW`를 기록한다. 기존 산출물은 legacy invalidation 목록으로 보존한다.
- `build-phase2-batch-11-full-typed-semantic-parity.mjs`: observed 누락을 expected에서 복사하지 않는다. `FRESH_BLIND` 및 독립 V2 session이 없으면 비정상 종료한다.
- `build-phase2-2022-set-pilot-final-report.mjs`: common closure, canonical registry, C denominator, typed parity, math, calibration, decision/action contract, render matrix/witness를 모두 확인해야만 최종 PASS가 가능하다. `--closure-manifest` 없이는 종료하며 production authority는 별도다.
- `compute-phase2-c-denominator-closure.mjs`, `freeze-c-denominator.mjs`, `lib/denominator.mjs`: required decision OR actual attached OR problem dependency OR shared dependency의 closure를 유지한다. source/asset/alt-caption/rule/schema/projection/verifier 입력 변화도 stale 처리하고, missing attached artifact가 UID를 분모에서 제거하지 못하게 했다.
- `build-phase2-canonical-batch-registry.mjs`, `validate-phase2-canonical-registry.mjs`: 파일명·큰 batch 번호 선택을 제거하고 명시적 reconciliation 목록과 단일 active UID record, revision/supersedes/input SHA lineage를 검증한다.
- `verify-rule-preflight.mjs`: 실행에 필요한 운영 규칙 10개를 MANIFEST 실제 bytes/SHA와 대조한다.
- `record-phase2-batch-11-render-evidence.mjs`: raw URL과 `screenshotObserved`만으로 PASS를 만들지 않는다. 실제 browser, desktop/mobile viewport, screenshot/accessibility SHA, current input/artifact SHA가 없으면 BLOCKED다.
- `validate-phase2-math-verification.mjs`, `validate-phase2-decision-contract.mjs`: 독립 math manifest와 requirement/decision/action enum을 별도 검증한다.
- structural duplicate adjudication은 current artifact SHA·question-specific evidence SHA·coverage·approval identity SHA에 결박한다.

## 재검증 결과

- common pipeline-core 회귀: **98/98 PASS**
- logic-visual unit/negative tests: **11/11 PASS**
- rule preflight: **25개 규칙 실제 bytes/SHA 일치**
- manifest negative fixtures 4개: **전부 FAIL 및 비정상 종료**
- forced render-fail final aggregation: **overall FAIL 및 exit code 1**
- optional-attached denominator fixture: **required UID 유지, 이전 input SHA와 새 freeze SHA가 다름**
- malformed typed fact 및 UID 포함 semantic hash 반례: **거부/UID 독립 hash 통과**
- 현재 canonical registry: **50 UID, active record 1개, active duplicate 0, validator PASS**

## 아직 PASS로 올리지 않은 게이트

- Batch-11 fresh blind V1/V2 및 V3: 외부 reviewer/session/first-pass SHA 필요
- Batch-11 수학: 기존 해설 재대조만 있어 `FAIL_INDEPENDENT_MATH_VERIFICATION`
- Batch-11 desktop/mobile 실제 solution render witness: 현재 `BLOCKED_REAL_RENDER_EVIDENCE_REQUIRED`
- legacy Batch-11 requirement 파일의 requirement/action enum 6건: 별도 재생성 필요
- 고1 전체 원본 역감사 source hold 6건: 원본 결함·HWP 수식 보류·미확인 유사문제는 계속 격리

따라서 다음 배치는 아직 자동 승인하지 않는다. 위 외부 증거를 별도 세션에서 생성한 뒤, 현재 fail-closed final report와 evidence contract를 다시 실행해야 한다.
