작업 시작 전에 `.agent/BOOT.md` → 연결된 Notion 「GPT 작업 전 필독 라우터」 → 「Archive 2.0 / JS Archive 시작 페이지」 → 「Archive 전체 작업 생명주기 — 단계별 필독 문서」를 순서대로 읽는다. Notion은 `notion_fetch({id:"self"})`로 실제 도구 접근을 확인한다. `get_tool_access` 도구가 없다는 이유만으로 멈추지 않는다. `ai_search`가 plan-required이고 일반 `search`가 available이면 일반 search로 찾고, URL/ID를 알면 직접 fetch한다. 실제 fetch/search 경로가 모두 실패할 때만 `WAIT_RESOURCE`다.

최신 `origin/main`을 fetch하고 다음 정본·구현 파일을 읽는다.

- `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`
- `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`
- `docs/rules/00_RULES_INDEX.md`, `docs/rules/MANIFEST.md`
- `archive/tools/meta-foundation/rpm-active-resolver.mjs`
- `archive/tools/meta-foundation/build-rpm-active-resolution.mjs`
- `archive/tools/meta-foundation/validate-rpm-active-receipt.mjs`
- `archive/tools/r2e/snapshot.mjs`, `archive/tools/r2e/final-gate.mjs`

## 대상과 intake 복구

대상은 `work/intake/m2`, `work/intake/m3`의 최신 `READY_FOR_R2E` receipt와 검증 가능한 `work/r2e-state` resume checkpoint다. 중1 및 예전 레인 branch는 대상이 아니다. 매 run에서 remote HEAD를 새로 고정하고 READY 분모는 unique `examUid`로 계산한다. 이전 보고서의 숫자를 재사용하지 않으며 run 시작 뒤 들어온 commit은 다음 run으로 넘긴다. 기존 resume checkpoint는 신규 intake보다 먼저 처리한다.

snapshot이 `META_RECOVERY_REQUIRED`를 반환하면 `metaRecoveryCandidates`를 먼저 처리한다. `*.evidence.json`은 receipt가 아니다. 구형 receipt의 경로·lineage를 검증하고, 필요한 공용 resolver/difficulty sidecar와 Meta receipt field를 canonical validator로 backfill한다. 공식 validator를 통과한 경우에만 receipt를 갱신하고 새 snapshot으로 다시 확인한다. frozen JS/SVG 이후 drift, source identity 불일치, 또는 sidecar만으로 exact candidate/difficulty parity를 충족하지 못하는 시험지는 `CONTRACT_RECOVERY_BLOCKED`로 남긴다. 이를 위해 JS/SVG나 canonical validator를 바꾸거나 검증을 우회하지 않는다. 그 시험지에 R2E final gate를 발급하지 않지만, 독립적으로 유효한 다른 candidates/resumes는 계속 진행한다.

## R2E selective final adjudication

R2E는 문항 전체의 3차 deep review가 아니다. 모든 문항에 integrity scan을 하고, deep review는 정본이 지정한 R1 HOLD/REPAIR, CREATE↔R1 conflict, quality blocker, 새 taxonomy proposal, RPM migration gap, Meta canonical/pack HOLD, CrossConcept 경계, source/answer/visual hard HOLD, receipt 이후 byte drift, validator가 새로 발견한 defect에 한정한다. 근거 없는 정상 R1 PASS는 처음부터 다시 풀지 않고 `INTEGRITY_REUSE`로 기록한다.

**Meta HOLD는 이번 예약 작업에서 실제로 adjudicate하고 해소해야 한다.** `META_PACK_GAP_HOLD`, `META_CANONICAL_HOLD`, `RPM_PRIMARY_MIGRATION_GAP`, `PROPOSED_NEW_L3`, `PROPOSED_NEW_L4`, 미결 CrossConcept, validator 미실행, difficulty/source/solution SHA 불일치, runtime/Archive parity 불일치를 다음 단계로 넘기거나 단순히 disposition 이름만 바꿔 통과시키지 않는다. 각 UID에 대해 frozen source와 verified final solution에서 fresh decision-isolated input을 만들고 shared RPM→ACTIVE resolver, fresh independent difficulty evidence, relational provenance 및 deterministic validator를 적용한다. Candidate key, 이전 verdict, 기존 difficulty 또는 `level` 추론은 semantic first pass에 넣지 않는다.

resolver의 actual evidence를 따라 `EXISTING_REUSE`, `REBIND`, `MATERIALIZED`, `NEW_L4`, `NEW_L3`, `CROSS_CONCEPT`, 또는 유효한 `ROUTE_OUT`으로 최종화한다. RPM Primary → exact curriculum/scope crosswalk → GLOBAL ACTIVE owner → exact binding 순서를 지킨다. Materialization/rebind/taxonomy 변경 뒤에는 current ACTIVE snapshot으로 resolver를 다시 실행해 final metadata와 runtime/archive parity를 검증한다. answer/solution/source/SVG/render 문제도 정본에서 요구하는 실제 결함일 때만 최소 범위로 고치고, 영향을 받는 gate와 render/regression을 다시 확인한다.

한 run에서는 여러 시험지의 신규 proposal을 의미 cluster로 비교하되 taxonomy를 과분화하지 않는다. 시험지별 intake commit을 main에 병합하지 않는다. 각 R2E exam의 ledger, evidence, checkpoint는 정본이 정한 durable state 경로에 저장하고 명시 파일만 stage/push한다. final gate가 모든 UID에서 integrity, shared Meta resolver, difficulty, visual/render, regression 및 HOLD Zero를 확인하고 `R2E_MAIN_FINAL`을 승인한 시험지만 정본 절차에 따라 최신 main에 통합한다.

## 종료 조건과 기록

대상별로 resume/R2E_MAIN_FINAL/명시적 blocker를 기록하고, 실제 resolver evidence와 final disposition이 일치하는지 확인한다. `R2E_FINAL`에는 Meta HOLD/proposal/migration gap/unresolved CrossConcept/runtime parity failure가 하나도 남으면 안 된다. final gate PASS와 승인된 main integration/parity가 모두 확인되기 전에는 완료로 표시하지 않는다.

Notion의 기존 R2E intake/작업 기록에 frozen intake HEAD, unique examUid 분모, recovery PASS/BLOCKED 수, R2E 완료/미완료 수, Meta HOLD 전후 및 resolver dispositions, 테스트/validator/snapshot 결과, 변경 파일, 시험지별 commit과 final main SHA, 남은 blocker와 다음 handoff를 기록한다. guard는 자기 runId/fencing token만 사용하며 종료 시 직접 해제한다.
