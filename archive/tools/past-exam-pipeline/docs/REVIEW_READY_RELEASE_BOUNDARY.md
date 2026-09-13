# REVIEW_READY / RELEASE 경계

## 목적

Past Exam 제작·검수는 `REVIEW_READY`에서 끝나며 production을 변경하지 않는다. 외부 최종 승인은 별도 receipt이고, 승인된 동일 바이트만 별도 release transaction에서 승격·등록한다.

## 제작 경로

```text
SOURCE → EXTRACTION → BUILD → VISUAL → STATIC / METADATA
→ FINAL_AUDIT → REPAIR → TARGETED_RECHECK → RENDER → CLOSURE
→ REVIEW_READY
```

`REVIEW_READY` receipt는 다음을 고정한다.

- candidate SHA
- staged asset set SHA
- final closure SHA/ref
- exact six render case set
- open defect count 0
- source/math/solution/visual/metadata/baseline gates

이 receipt의 `productionAuthorized`는 항상 `false`다.

## 승인·release 경로

```text
REVIEW_READY
→ EXTERNAL_APPROVED
→ PROMOTE_APPROVED_EXAM
→ PROMOTION_PARITY_PASS
→ REGISTER_APPROVED_EXAM
→ DB_TARGET_PARITY_PASS
→ INDEX_REBUILD
→ INDEX_TARGET_PARITY_PASS
→ PRODUCTION_SMOKE_RENDER
→ DONE
```

approval receipt는 `APMATH_FINAL_EXTERNAL_APPROVAL_v1` 형식이며 examId, reviewReadyRunId, reviewReadySha, candidateSha256, stagedAssetSetSha256, finalClosureSha, approvalStatus=APPROVED, approval evidence identity/SHA, approvedAt를 요구한다. release transaction에서는 DB/index baseline SHA도 receipt와 명시적으로 결속한다. candidate나 asset set이 바뀌면 SHA parity 검증에서 중단한다.

`promote-reviewed-exam.mjs`는 승인된 target JS와 target examId asset directory만 쓴다. DB와 question-index는 쓰지 않는다. `register-approved-exam.mjs`는 명시된 targetFile과 dbEntry만 처리하며 저장소 전체 미등록 시험을 자동 등록하지 않는다.

DB와 index는 각각 baseline SHA를 확인하고 semantic delta를 계산한다. target 외 examId/file/qKey의 add/delete/change가 있으면 `UNEXPECTED_DB_SCOPE_DELTA` 또는 `UNEXPECTED_INDEX_SCOPE_DELTA`로 transaction을 중단한다.

promotion 이후 DB/index 단계가 실패하면 `DONE`이 아니라 `HOLD`를 반환한다.

## visual gate

GRAPH_BASED, INEQUALITY_BASED, GEOMETRY_BASED 문제는 기본적으로 solution visual REQUIRED다. 검증된 visual이 없으면 `SOLUTION_VISUAL_MISSING`이다. 예외는 APPROVED status, 사람/operation이 읽을 수 있는 reason, evidence identity, SHA가 있는 typed exemption만 허용한다.

baseline에 solutionImage가 있었는데 candidate에서 제거되면 typed exemption 없이는 `VISUAL_BASELINE_REGRESSION`이다.

## production payload

candidate가 `generated_pending`, `builder_complete_pending_final_audit`, local absolute path, `_generated` staging path, session runtime path, 또는 transient provenance field를 포함하면 promotion 전 validator가 중단한다. 자동으로 지워서 SHA를 바꾸지 않는다. 필요한 provenance는 sidecar evidence에 남긴다.

## 구현 위치

- `lib/production-boundary.mjs`: protected roots, release allowlist, transient payload gate, asset-set SHA
- `lib/review-ready.mjs`: REVIEW_READY receipt와 six-case/baseline/visual gate
- `lib/release-authority.mjs`: external approval, smoke render, target parity, release transaction contract
- `promote-reviewed-exam.mjs`: target-only approved promotion
- `register-approved-exam.mjs`: target-only DB registration와 index semantic helpers
- `release-approved-exam.mjs`: 승인 후 고정된 release 순서
- `pipeline-core/work-batch.mjs`: persisted REVIEW_READY terminal state

모든 일반 builder/review output은 staging으로만 향해야 하며, `archive/exams`, `archive/assets`, `archive/db.js`, `archive/question-index.js`를 output directory로 선택하면 hard fail한다.
