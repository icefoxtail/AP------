# Archive Reviewed Apply Bridge v1

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

The workflow rejects stale target bases, extra files, deletions, packet/hash
mismatches, protected question-field changes, and branches with more than one
staging commit. A stale base fails as `APPLY_BASE_STALE`; create a new staging
branch from the latest target SHA to retry.

## APPLY_PACKET schema v2

The packet uses `schemaVersion: 2` and includes:

- `applyId`, `examFile`, `sourcePath`, `grade`, `targetRef`, `targetBaseSha`,
  `sourceBlobSha`, `totalQuestions`;
- `reviewPassCount: 2`, `closureStatus: "CLOSED_FOR_APPLY"`,
  `status: "READY_FOR_APPLY"`;
- closure provenance: `closedAt`, `r2Artifact`, `reviewArtifactSha256`;
- `finalFiles[]` with `path`, `sha256`, `sizeBytes`, and `kind`
  (`exam_js` or `solution_svg`);
- one `metaPatches[]` row per source ordinal, including UID, source file,
  ordinal, identity fingerprint, decision status, runtime pack, and `before`
  / `after` values;
- `candidatePending[]`, `canonicalHolds[]`, `routeOutPreserve[]` as UID lists;
  and `regenerateScopes[]` naming metadata, runtime, question index, Archive2
  catalog, and crosswalk regeneration.

Every UID/source tuple is checked against the target-base
`question_identity_map.json`. `sourceBlobSha` is SHA-256 of the source exam JS
blob at `targetBaseSha`. `finalFiles` hashes cover the staging-tree bytes.

`REPAIR.after` contains only actual reviewed values, such as unit/subunit,
problem type, template, cross-concepts, conditions, integration pattern, and
difficulty fields. Its L3/L4/CrossConcept references and exact active
curriculum binding must exist in the compiled canonical registry. `CANDIDATE`
contains labels, definitions, skeleton, candidate cross-concepts, searched
canonical candidates, and a reason; it never creates selectable PT/TPL keys.
`KEEP`, `HOLD`, and `ROUTE_OUT` preserve their existing semantic values.

## Runner behavior and target commit

The runner checks the target SHA before generation, runs the generic UID patch
engine, calls `python archive/build_db.py`, rebuilds only affected runtime
packs, regenerates Archive2 catalog/crosswalk, and runs registration, canonical,
runtime, identity, and diff validators. It removes the transient packet before
the second no-op generator pass.

After the second pass has no diff, the runner resets the index to
`targetBaseSha`, explicitly stages only the validated exam/assets/registration/
metadata/runtime/evidence outputs, and creates one commit whose sole parent is
`targetBaseSha`. It fetches the target again and performs a normal fast-forward
push. It never force-pushes. The final target tree contains no
`.archive-apply/inbox/**` files. On success, the staging branch is deleted.

`archive-registration-sync.yml` remains enabled for ordinary `main` exam
registration. It must be a no-op after an Apply Bridge commit. Automatic R2
asset copy is restricted to `main`; `workflow_dispatch` remains available.
