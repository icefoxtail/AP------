# M3 independent visual upgrade — run B

This is an independent SVG/`solutionImage` pilot on `origin/main` at `65a7777700af13cbefd5c8db1290b1abe05dba92`. The pilot does not authorize global visual-style adoption or a merge.

## Scope and triage

The denominator is all 120 questions across the five source exams. Each row in `triage.json` records the qid, whether a solution image existed at baseline, one action (`KEEP`, `POLISH`, `REBUILD`, `ADD`, `REMOVE`, or `EXEMPT`), a one-line reason, and the decisive relation.

| Action | Questions |
| --- | ---: |
| KEEP | 54 |
| REBUILD | 1 |
| ADD | 20 |
| EXEMPT | 45 |
| **Total** | **120** |

The only existing asset rebuilt is Wangun question 6. Its 120° label is bound to the actual rays BA/BC, its 60° label is bound to BC/BH at B, and CH is drawn perpendicular to BH. The unsupported `BH=1` note was removed. Content, choices, answers, solutions, problem images, `Meta`, difficulty, layout, ordering, and question counts remained locked. The link change report and `protected_fields_snapshot.json` show zero protected-field mutations.

## Modified SVGs

Twenty SVGs were added and Wangun q6 was rebuilt:

- Wangun: `q1`, `q2`, `q6` (rebuild), `q10`, `q11`, `q13`, `q21`, `q22`
- Pungdeok: `q1`, `q2`, `q6`, `q7`, `q11`, `q13`, `q14`, `q15`, `q17`, `q18`, `q20`, `q22`, `q23`

The two midterm JS files link the 20 additions. Final solution-image counts are 20/20 for Wangun, 18/18 for Pungdeok, and unchanged 13/13, 11/11, and 13/13 for Yeonhyang, Geumdang, and Sinheung; 75/75 linked solution SVGs load across the five Archive solution pages.

## Evidence map

- `inventory.json` records the 120 baseline questions, solution hashes, problem-image hashes, and pre-existing solution-image hashes. `createdAt` is null because the earlier timestamp was hard-coded; `revalidatedAtUtc` is the final capture time.
- `triage.json` is the complete 120-row decision ledger. `v1-validation.json` records the per-question visual-benefit contract check.
- `build_visuals.py` and `geometry_models.py` describe the Python inputs, calculations, coordinate models, and deterministic SVG serialization. `build_outputs.json` records expected facts, computed outputs, coordinates, primitive attributes, owners, and SVG hashes.
- `svg_physical_evidence.json` binds each final SVG to the baseline and final source-exam hashes, solution hash, exact staged Git blob SHA, expected facts, calculation inputs/results, coordinates, primitives, measured facts and deltas, XML parsing, label owners/font sizes, and the corresponding raw browser evidence.
- `browser_render_evidence.json` contains actual Archive `mode=sol` rendering for all five exams, decoded image dimensions, viewport CSS boxes, label `getBBox()` results, font evidence, clipping, safe-margin, and text-overlap observations.
- `browser_overlap_verification.json` independently recomputes text-box intersections from those browser boxes against serialized SVG lines, polylines, circles, and markers.
- `protected_fields_snapshot.json`, `solution_image_link_changes.json`, `calibration.json`, `rule_references.json`, and `project_config.json` record field parity, calibration, source-pack status, rules, and pilot scope.

Final validation: geometry and XML 21/21 PASS; browser primitive/label intersection recheck 21/21 PASS; Archive solution pages 5/5 PASS; changed SVGs rendered without clipping, safe-margin violations, or text overlaps 21/21 PASS.

## Source-pack note

At the requested base commit, the checked-out bytes of `docs/rules/04_VISUAL/도형추출.md` are 59,517 bytes with SHA-256 `157e4a1b5ae1ea1ce389fcd8de89b8b6fad44803f11cbc252f5f6babd55458e6`; `MANIFEST.md` records 57,487 bytes and SHA-256 `5121ee73b19e9df3310c98720532dd6d9768be2d7a172837f57db1f78e7cef09`. The pilot used the exact file bytes present at the requested base and did not alter the rule or manifest.

## Reproduction

From this worktree, run `node archive/evidence/visual-upgrade-2025-m3-independent-b/validate_triage.mjs`, `node archive/evidence/visual-upgrade-2025-m3-independent-b/verify_protected_fields.cjs`, `python archive/evidence/visual-upgrade-2025-m3-independent-b/build_visuals.py`, and `python archive/evidence/visual-upgrade-2025-m3-independent-b/verify_geometry.py`. After collecting the actual Archive browser capture, run `python archive/evidence/visual-upgrade-2025-m3-independent-b/verify_browser_overlaps.py`. `finalize_evidence.py` is run after staging the two linked exam files and all 21 SVGs so it can record the exact index blob SHAs; it rejects missing hashes, incomplete render evidence, or any failed physical checks.
