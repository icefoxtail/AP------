# Original source error: exact negative hold v1

> **2026-11-24 폐지(바이트 고정): 이 문서가 설명하는 "원본·그림·영수증·증거 파일의 바이트가 바뀌면 실패" 검사는 모두 없앴다.** 보류는 이제 문항 하나에 `sourceIssueHold`/`sourceQualityHold`를 표시하는 일만 하고(UID로만 맞춘다), 시험지 JS·그림·영수증·증거·identity 지문·카탈로그 포함 여부가 바뀌어도 어떤 레인·빌더·CI·훅도 이 때문에 실패하지 않는다. 이 문서의 "검증한다"·"멈춘다"·"해소 기록" 서술은 이력이다. 기존 보류·해소 기록 데이터는 고치거나 지우지 않고 남겼다. 이유: 보류가 파일 전체를 고정해 같은 파일의 다른 문항 오류 수정까지 막았고(2026-11-23 사고), 원장님이 "바이트 고정해 놓은 것 자체가 잘못이다, 쉽게·넓게·빠르게·변화하게"로 결정했다(2026-11-24). 규칙: [common.md](../../agents/common.md) 맨 위 절.

## Purpose and authority

This contract suspends reuse of one previously registered four-slot vector when
independent inspection of the original printed problem establishes unresolved
contradictory conditions. It provides no replacement source, answer, solution,
slot value, Native approval, semantic approval, or fingerprint repair.

The exact scope is E034 Q18, UID
`qid_v1_19094807547ac6f15acca37931be797fce40c7b0e4344e1c5a6e2223ca2bbc54`,
in `original/middle/m2/1final/22_매산중_1학기_기말_중2_수학.js` (24 questions).
The current metadata remains `registration_pending_semantic_review` /
`review_required`, with no `metadataApprovalType` and empty PT/TPL keys. The
historical registered vector is evidence of what is being withheld, not a new
positive authority. The original uncertain choice must not be reconstructed.

## Closed inputs

`tools/4slot/original-source-error-hold.cjs` validates the dedicated ledger
`archive/data/meta-foundation/m2s1-e034-original-source-hold-v1.json`.
Its schema is `archive-original-registered-vector-source-hold-v1` and its scope is
`EXACT_M2S1_E034_Q18_ORIGINAL_CONTRADICTION_REJECT_PRIOR_VECTOR_REUSE`.

Each immutable file reference contains exactly commit, path, Git blob SHA-1,
raw SHA-256, and byte length. Verification requires:

- The original published `REGISTERED` row and bank file record, original
  compact/native source, dictionary, full bank of 24, and all six vector fields.
- Exact current source and compact, complete current and prior asset inventories,
  including nested local SVG assets. Active and external SVG dependencies fail.
- Current whole selected metadata and identity rows equal to their bound
  immutable snapshots, plus the full 24-UID/ordinal/question-number inventory.
  Other metadata rows may advance without changing that selected authority.
- The separate independent given observation and the root negative decision,
  with distinct named reviewers and immutable byte bindings to the given crop.
- Zero new math, semantic, and vector approvals. Unknown keys, null decisions,
  changed source/asset bytes, missing or conflicting identity, resealed positive
  verdicts, and mixed snapshots fail.

Only E034 metadata and its original given crop may accompany the public negative
review. Private combined reports, answer/solution text, or references to other
items are not part of this input contract.

## Enforcement and output

The normal four-slot builder retains all unrelated rows and skips cache reuse
for this bank. A validated target becomes
`EXPLICIT_REVIEW_HOLD:ORIGINAL_SOURCE_CONTRADICTION_UNRESOLVED`. A failed or
missing proof remains pending; deleting both the ledger and an old cache marker
cannot revive a positive row. Index verification rejects a forged registered
target.

The existing registered-vector route, Native receipt reuse, AutoMeta planning,
and official v2 registrar refuse positive processing of this exact UID/tuple.
The catalog merges the separate negative projection into the existing
source-quality hold mechanism. Basic/advanced verified selection is therefore
blocked while historical source/identity integrity, metadata/D5 values, and
all unrelated rows remain unchanged. The existing v1 source-quality hold
contract and ordinary four-slot/Native contracts retain their checks.

This is a derived negative projection. No source, metadata, identity, compact,
global reconciliation, or original receipt is rewritten by this verifier.

## Atomic publication and later correction

Publish the code, dedicated ledger, exact independent/root evidence and original
given crop together. The root review must receive an immutable public commit,
and the final ledger must bind that commit before activation. Publishing only
the code fails the required catalog proof check; silently omitting the target
is not a release mechanism. A local prototype commit is not a public authority.

The release policy is `EXPLICIT_VERIFIED_SOURCE_CORRECTION_REQUIRED`. This
version has no released/positive state. Later correction requires new verified
source evidence, explicit independent correction review, and a separately
validated contract under the existing task authorization. It must not infer the
unobservable choice or remove this negative guard by deleting its evidence.

## Verification

`tests/archive-m2s1-original-source-error-hold.test.cjs` runs real isolated Git
fixtures for immutable evidence, historical vectors, cache deletion, official
registrar rejection, source-quality projection, and tamper boundaries. It is
registered in both normal and scoped test runners. The unchanged source-quality
hold suite additionally checks the existing contract.

The actual private one-bank comparison validates 24 current rows: 21 existing
registered rows and two unrelated pending rows remain exact, while E034 Q18
changes from stale-payload pending to the explicit negative hold. This is a
scoped comparison, not a global build, actual browser inspection, or positive
registration result.
