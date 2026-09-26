# Archive Reviewed Apply Bridge v1

> 상태: LEGACY RECOVERY ONLY. 신규 중2/중3 CREATE → R1 → intake → R2E → main의 primary route가 아니다. 새 intake 생산은 `JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`를 따른다.

## Purpose

This contract applies the final Archive reservation stages without asking E to
serialize compiled taxonomy, runtime, catalog, index, or other derived JSON.
GitHub Actions regenerates those files from the repository checkout.

```text
R2 CLOSED artifact
  -> archive-apply/<applyId> (exam JS, changed SVGs, one APPLY_PACKET)
  -> archive-reviewed-apply.yml
  -> runner patch + registration/runtime/catalog regeneration + validators
  -> one target commit, fast-forward only
```

Do not upload large derived JSON files through GitHub's blob API or model text.
E sends only the final exam JS when it differs from the base, the actual added
or changed SVG assets, and the small APPLY_PACKET. An unchanged exam JS may
remain inherited from the target base.

## Target and staging branch

Create `archive-apply/<applyId>` directly from the current full SHA of the
target branch. `중1` uses `codex/meta-foundation/middle1`; `중2`, `중3`, and
high-school exams use `main`.

The staging commit may contain only:

- the packet's `exam_js` file under `archive/exams/`;
- packet-listed `solution_svg` files under `archive/assets/images/`; and
- `.archive-apply/inbox/<applyId>.json`.

The workflow distinguishes the immutable R2 review base from the mutable E
dispatch base. `targetBaseSha` in a schema-v2 packet remains the R2
review/closure provenance SHA; it does **not** require the target branch to stay
frozen until E runs. E creates the staging branch from the current target SHA.

A target advance is accepted when the reviewed source exam is byte-identical to
the R2 review base, packet-listed SVG paths have not drifted, affected UID
metadata still matches each patch `before` state, and all referenced ACTIVE
canonical keys/bindings remain valid on the current target. Unrelated commits
therefore do not require R2 resealing.

`APPLY_BASE_STALE` is reserved for a race where the target advances after E
creates the staging branch or while the workflow is running. Retry by recreating
staging from the latest target with the **same sealed R2 packet**. Relevant
source/SVG/UID/canonical drift fails closed as `APPLY_CONFLICT_HOLD`; only that
case returns to review/repair.

## APPLY_PACKET schema v3 — sealed legacy recovery

신규 recovery packet은 `schemaVersion: 3` 및 `recoveryRoute: "SEALED_LEGACY_RECOVERY"`를 사용한다. 정확히 attested된 과거 v2 sealed artifact는 compatibility 예외로만 읽을 수 있다. Schema v2는 해당 예외 packet 외에는 거부한다. Schema v3 meta patch마다 shared RPM→ACTIVE resolver input/evidence, independent difficulty evidence, relational evidence, deterministic validator receipt를 포함한다.

모든 packet은 기존 identity/closure fields와 아래 fields를 포함한다:

- `applyId`, `examFile`, `sourcePath`, `grade`, `targetRef`, `targetBaseSha`,
  `sourceBlobSha`, `totalQuestions`;
- `reviewPassCount: 2`, `closureStatus: "CLOSED_FOR_APPLY"`,
  `status: "READY_FOR_APPLY"`;
- closure provenance: `closedAt`, `r2Artifact`, `reviewArtifactSha256`;
- `finalFiles[]` with `path`, `sha256`, `sizeBytes`, and `kind`
  (`exam_js` or `solution_svg`);
- one `metaPatches[]` row per source ordinal, including UID, source file,
  ordinal, identity fingerprint, decision status, runtime pack, `before`/
  `after` values, and shared `resolverInput`, `resolverEvidence`,
  `difficultyEvidence`, `semanticMetaEvidence`, and `validatorReceipt`;
- `candidatePending[]`, `canonicalHolds[]`, `routeOutPreserve[]` as UID lists;
  and `regenerateScopes[]` naming metadata, runtime, question index, Archive2
  catalog, and crosswalk regeneration.

Every UID/source tuple is checked against the current dispatch checkout's
`question_identity_map.json`. In schema v3, `targetBaseSha` is the immutable
R2 review base. `sourceBlobSha` is SHA-256 of the source exam JS blob at that
review base, and the same source blob must still exist at the current dispatch
base. `finalFiles` hashes cover the staging-tree bytes.

`REPAIR.after` contains only actual reviewed values, such as unit/subunit,
problem type, template, cross-concepts, conditions, integration pattern, and
difficulty fields. Its L3/L4 decision is revalidated through
`archive/tools/meta-foundation/rpm-active-resolver.mjs`; only a current reuse
route with exact ACTIVE owner, parent, and binding can apply. `CANDIDATE`
contains labels, definitions, skeleton, candidate cross-concepts, searched
canonical candidates, and a reason; it never creates selectable PT/TPL keys.
`KEEP`, `HOLD`, and `ROUTE_OUT` preserve their existing semantic values.
`rpmPathStatus: "DIRECT"` is written only when the packet's resolver evidence
passes; the exact evidence SHA and crosswalk status are retained. Legacy v2
recovery preserves an existing `rpmPathStatus` and never synthesizes `DIRECT`.

## Runner behavior and target commit

The runner first requires the current target SHA to equal the staging commit's
parent. It then proves the packet review base is an ancestor of that dispatch
base and runs the relevant-drift gates above. The generic UID patch engine also
checks every affected UID's current metadata against packet `before` values and
revalidates resolver evidence, ACTIVE L3/L4/CrossConcept/binding state, and
difficulty provenance on the current checkout.

After those gates pass, it calls `python archive/build_db.py`, rebuilds only
affected runtime packs, regenerates Archive2 catalog/crosswalk, and runs
registration, canonical, runtime, identity, and diff validators. It removes the
transient packet before the second no-op generator pass.

After the second pass has no diff, the runner resets the index to the **dispatch
base SHA**, explicitly stages only the validated exam/assets/registration/
metadata/runtime/evidence outputs, and creates one commit whose sole parent is
that dispatch base. It fetches the target again and performs a normal
fast-forward push. If the target moved during the run, it reports
`APPLY_BASE_STALE` with target mutation 0; E retries on the newer head without
R2 resealing. It never force-pushes. The final target tree contains no
`.archive-apply/inbox/**` files. On success, the staging branch is deleted.

`archive-registration-sync.yml` remains enabled for ordinary `main` exam
registration. It must be a no-op after an Apply Bridge commit. Automatic R2
asset copy is restricted to `main`; `workflow_dispatch` remains available.
