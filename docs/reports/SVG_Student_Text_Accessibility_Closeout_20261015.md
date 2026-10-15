# SVG student text and accessibility closeout — 2026-10-15

This closes the documentation scope for the existing-SVG English/internal-text and meaningful-accessibility request. The initial English cleanup expanded beyond the requested scope; this closeout limits the canonical edits to student-facing SVG text/accessibility and removes the student-facing scale disclaimer requirement while retaining mathematical geometry accuracy.

## Documentation changes

- `.codex/skills/apmath-visual-upgrade/SKILL.md`: applies the existing student-explanation terminology authority to visible and accessibility text; defines concise, meaningful Korean SVG names/descriptions and preserves mathematical notation.
- `docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`: adds the corresponding student SVG and accessibility output contract for GPT production.
- `docs/rules/04_VISUAL/도형추출.md` §6-13: removes required scale-honesty disclaimers; retains the requirement that represented mathematical relations and any visually relied-on proportions be accurate.

No separate terminology policy, approval flow, repeated read-receipt, or broad rulebook audit was added. These documentation edits do not certify mathematical quality for every SVG.

## Production evidence and limits

The accompanying production snapshot reports a manifest of 707 SVGs with SHA-256 `44fc1f6f2a7d8b9d84eada560ea8c7cd99067437dac7bd2b271d081ffe7ec07b`; 706 student-caption items passed semantic review and one non-student fixture was exempt. It reports 0 open metadata findings and 683 current QID/source bindings, with geometry raw data unchanged. These counts are recorded as the supplied work snapshot, not as newly rerun checks in this documentation task.

The full 707-item gallery and native 408-item review were cancelled under the user's scope instruction (`NOT_RUN`, not PASS).

## Main-based publication candidate

The publication worktree is based on `origin/main` `ac992b85fab2daf3fcac8de35567d05904ea2fee`. It carries the 630 managed SVGs whose bytes still match the reviewed source and preserves the 77 managed SVGs changed since that source. Those 77 current-main SVGs already had Korean title and description text; 17 received scoped accessibility-text repairs (five title/description ID and ARIA bindings, one English-label translation, one scale-disclaimer removal, and ten concise descriptions transcribed from the current SVG/source facts). Geometry, styles, and question source data were left intact.

The final manifest has 707 records (683 source-bound, 24 asset-only), SHA-256 `ca8c12340117bc9f9df355e4fbe408e7334b026cdb9e3a62a4dde2bbf6539f5c`. The current production projection was rebuilt from `origin/main` and passes its check; its source-index SHA-256 is `88dffa74789774f2db4ea604261231dc3c5731ca79632bd6d660188b59f45376` and the projection file SHA-256 is `962cc1a99ecc6b44a4e7ac6fd6bfcc205cf421d944b49d5d8044f5ef7f5ed903`. Every manifest raw SVG SHA-256 and Git blob SHA-1 matches the working file and staged index for all 707 records.

Focused language, collector, compiler, integration, and runtime tests pass 47/47. The final local `node tools/check-archive2-runtime.cjs` run passes 108/110 checks; its two unchanged performance assertions measured 559.3 ms for the shared Meta filter and 467.9 ms for the production form, against the existing 500 ms limit. The checks and thresholds were left intact. Actual Google Chrome QA passes four routes (Archive original exam/solution and mixed exam/solution) with the live production sources and projection. The run evidence is saved under `archive/analysis/svg-language-cleanup-20261014/publish/`.

This is a local publication candidate only. The remote main merge and deployment remain pending; this report makes no `MAIN_DONE` or deployment claim. The separate Pages Release baseline on main currently fails while importing an unrelated 36-exam intake source, so a successful PR merge alone would not prove a student-site release.
