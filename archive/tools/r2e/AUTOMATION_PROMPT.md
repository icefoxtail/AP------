작업 시작 전에 `.agent/BOOT.md` → 연결된 Notion 「GPT 작업 전 필독 라우터」 → 「Archive 2.0 / JS Archive 시작 페이지」 → 「Archive 전체 작업 생명주기 — 단계별 필독 문서」를 순서대로 읽는다. Notion은 `notion_fetch({id:"self"})`로 실제 도구 접근을 확인한다. `get_tool_access` 도구가 없다는 이유만으로 멈추지 않는다. `ai_search`가 plan-required이고 일반 `search`가 available이면 일반 search로 찾고, URL/ID를 알면 직접 fetch한다. 실제 fetch/search 경로가 모두 실패할 때만 `WAIT_RESOURCE`다.

그 다음 최신 `origin/main`을 fetch하고 다음 정본·구현 파일을 읽는다.

- `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`
- `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`
- `docs/rules/00_RULES_INDEX.md`, `docs/rules/MANIFEST.md`
- `archive/tools/meta-foundation/rpm-active-resolver.mjs`
- `archive/tools/meta-foundation/build-rpm-active-resolution.mjs`
- `archive/tools/meta-foundation/validate-rpm-active-receipt.mjs`
- `archive/tools/r2e/snapshot.mjs`

## 현재 run 목적

이 예약 단계는 `work/intake/m2`의 `READY_FOR_R2E` receipt에서 빠진 최신 Meta resolver evidence 참조와 contract version을 기존 final JS/SVG bytes를 보존하며 backfill한다. R1 재검수나 R2E adjudication이 아니다. 이번 run에서 `work/intake/m3`는 수정하지 않는다. 매 run은 원격 M2 HEAD를 동결하고 receipt 파일을 다시 inventory한다. 분모는 unique `examUid` 수다. 이전 보고서의 파일/시험지 수를 재사용하지 않는다.

최신 `snapshot.mjs`가 `META_RECOVERY_REQUIRED`와 `metaRecoveryCandidates`를 반환하면 이것은 실행 가능한 bounded recovery inventory다. `archive/data/r2e-intake/m2/*.evidence.json` 같은 item-level evidence sidecar를 시험지 receipt로 취급하지 않는다. identity/lineage 필수 필드가 빠진 receipt, source identity 불일치, receipt 이후 JS/SVG drift는 그 시험지만 `CONTRACT_RECOVERY_BLOCKED`로 기록하고 다음 시험지로 진행한다.

## 시험지별 backfill

1. 격리 worktree의 최신 `origin/main`에서 실행하고, guard를 획득한 뒤 frozen M2 snapshot을 만든다. 자신의 runId/fencing token만 사용하고 모든 Git mutation 전에 guard를 확인한다. 원본 checkout의 dirty/untracked 상태를 보존한다.
2. receipt가 가리키는 examUid, examFile, sourceBlobSha, input commit lineage, current final JS blob, changed SVG blobs와 question denominator를 확인한다. receipt 이후 JS/SVG bytes가 달라졌거나 identity를 증명할 수 없으면 그 시험지를 치료하지 말고 `CONTRACT_RECOVERY_BLOCKED`로 남긴다.
3. sidecar input은 frozen JS의 실제 content, choices, image reference, verified final solution, standardUnitKey, subUnitKey에 결속한다. semantic first pass는 `sourceIdentity`, verified `solutionIdentity`, `curriculumContext`, `semanticDecision`만 받는다. 기존 candidate key, 기존 R1 Meta verdict, 이전 difficulty를 새 의미 판단 입력으로 사용하지 않는다.
4. 순서는 source + verified final solution → primaryMethod → decisiveStep → RPM Primary README → CANONICAL_MASTER → exact curriculum/scope RPM view → grade-specific RPM→ACTIVE crosswalk → GLOBAL ACTIVE owner → exact curriculum binding → shared resolver disposition이다. 공용 resolver로 최신 authority hashes를 만든다. difficulty는 fresh independent blind evidence로 생성하며 legacy `level`에서 추론하지 않는다. relational evidence도 동일한 frozen source identity와 resolver input bundle에 결속한다.
5. 전 UID 전체가 포함된 `JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1` sidecar를 만든다. current validator가 요구하는 UID/ordinal, source/solution/image/content/choices hashes, curriculum/L1/L2, candidate projection, resolver, difficulty, relational provenance, validator receipt, disposition과 denominator parity를 모두 검증한다. 공식 `validateR2EIntakeMetaReceipt(...)` 및 deterministic resolver validator가 PASS하지 않으면 봉인하지 않는다.
6. 공식 validator가 frozen JS projection과 fresh difficulty evidence의 exact parity 등으로 sidecar-only 복구를 거부하면 validator를 느슨하게 하거나 JS/SVG를 수정하지 않는다. 그 시험지는 `CONTRACT_RECOVERY_BLOCKED`로 기록하고 validator 오류와 필드 근거를 남긴다. unrelated 시험지는 계속한다.
7. 검증된 sidecar가 있을 때만 해당 시험지 receipt에 실제 raw SHA-256을 가진 `metaResolutionEvidenceRef`와 정확한 `metaResolverContractVersion: "JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v1"`를 추가한다. 다른 R1 receipt 내용은 이유 없이 다시 쓰지 않는다. Meta summary는 최신 resolver evidence 불일치가 공식 snapshot을 막을 때만 authority에 맞춰 동기화한다.

수정 가능한 intake 파일은 해당 시험지 receipt와 해당 최신 Meta sidecar/evidence뿐이다. JS, SVG, L1/L2, 다른 시험지 파일, canonical validator, main은 수정하지 않는다. 시험지별로 수정 파일만 명시 stage하고 독립 commit/push한다. `git add .`, `git add -A`, force push 및 다른 writer의 변경 덮어쓰기는 금지한다. remote branch가 전진하면 최신 remote 위에서 해당 시험지 변경만 재적용하고 재검증한다.

## 종료 조건과 handoff

모든 frozen READY receipt에서 기존 최신 계약 PASS(A), backfill PASS(B), `CONTRACT_RECOVERY_BLOCKED`(C)를 계산해 `A + B + C = N`인지 확인한다. 공식 snapshot에서 `INVALID_READY_RECEIPT`, resolver ref/version/SHA/evidence 오류, Meta summary mismatch가 0이고 snapshot READY candidate가 실제 계약 충족 시험지와 같을 때만 recovery 완료다. `BLOCKED > 0`이면 완료로 표시하지 않는다.

Notion의 기존 R2E intake/작업 기록에 frozen intake HEAD, unique examUid 분모, A/B/C, sidecar/receipt 수, validator 및 snapshot 결과, JS 변경 수, SVG 변경 수, 시험지별 commit과 remote HEAD, blocker 및 다음 정확한 handoff를 기록한다. 이 단계가 끝나면 종료한다. R2E adjudication, checkpoint 복원/소비, main 통합으로 넘어가지 않는다.
