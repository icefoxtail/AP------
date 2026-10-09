# R1 new-import identity technical assessment

Status: **DERIVATION PROVEN, R1 GLOBAL RESOLUTION NOT AVAILABLE**. This is a technical identity finding; it does not change the R1 identity audit, solution alignment disposition, source, or global registry.

## Bound inputs

- Worktree: `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`; HEAD/origin at inspection: `2c2d5b5ea5645d6c17a2d8449ea6ac97f436dd19`.
- R1 assignment: `.tmp/archive/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/R1.assignment.json`, SHA-256 `708fd10cdbff6f5dcca78303bf512b6b6dcbb582f1367b8a30d96d65b30025d1`. It binds working JS `.tmp/archive/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/24_강남여고_1학기_중간_고2_대수.js` and production identity path `archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_대수.js`.
- Current working JS SHA-256 `4f1529eeefac76a5aa37d24609322f3a331f43ca4570ed7c0696fd8c387f42ea`; Git blob SHA-1 `5328f27a4f7cacd72bd53dd7b8d89bfddd15834c`. The current JS has 25 questions and no embedded `questionUid`/`question_uid` values.
- R1 identity audit: `archive/analysis/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/R1.identity-resolution-audit.r1_10.20261009.json`, SHA-256 `d6cde52e744dedddfbf7e261e57f2cf66f000f59243cf771f10c95fdda990ba7`. It records all 25 ordinals as `UNKNOWN_SOURCE_ORDINAL`, `questionUid:null`, and `ALIGNMENT_HOLD`, while explicitly preserving the math freeze and claiming no solution-alignment PASS.
- Current global `archive/data/question_identity_map.json` SHA-256 `487a835fc619d7cb590ee37214a3fbd681b83b10a6cda4316f15e7a1b017de5f`, schema `question-identity-map-v1`; it has zero records for this source path.

## Existing authority and limitation

The stable UID derivation already exists at `archive/tools/meta-foundation/rpm-active-resolver.mjs:155` as `questionUidForSource(sourceArchiveFile, sourceOrdinal)`. It normalizes the source path and returns `qid_v1_` plus SHA-256 of normalized source path and 1-based ordinal. The target registration row builder calls this same function at `archive/tools/prepare-target-registration-candidate.mjs:215`; it does not invent another namespace or use question content to derive the UID.

The current resolver has a separate registered-map requirement. `archive/tools/intelligence/question-identity-contract.mjs:65-85` resolves `sourceArchiveFile + sourceOrdinal` only through `identityMap.lookup.bySourceFileAndOrdinal`. With no map entry, the current result remains `UNKNOWN_SOURCE_ORDINAL`. No current resolver/audit consumer accepts a `DERIVED_FOR_NEW_IMPORT` record as a globally resolved identity. The registration candidate producer uses the canonical UID builder but its ordinary production route requires R1 proof before target registration, which is the circular dependency observed here.

## Assignment-bound derivation proof

`DERIVED_FOR_NEW_IMPORT.identity-proof.v1.json` in this directory binds all 25 canonical `questionUidForSource` results to the exact assignment, working source raw/blob hashes, R1 audit, and current identity map. It uses source ordinals and the question IDs already present in the source. Its state is `DERIVED_FOR_NEW_IMPORT_NOT_GLOBALLY_REGISTERED`; the proof leaves the global-map result as `UNKNOWN_SOURCE_ORDINAL` and explicitly makes no solution-alignment PASS claim.

This proves the proposed IDs are the existing canonical new-source derivation. It is not a replacement global identity map, does not write the map, and is not accepted by the current R1 audit schema as a resolution.

## Required next action

For this bounded new-import bootstrap, ROOT/R1 must either authorize a stage-local identity proof consumer that accepts `DERIVED_FOR_NEW_IMPORT` for this exact exam/source raw SHA and 25 ordinals while preserving the global map's UNKNOWN state, or authorize a separate pre-R1 target identity bootstrap that creates the exact future canonical map rows in an isolated scope. The normal target registration apply remains after R1 PASS. Until that consumer or bootstrap authority exists, keep the existing audit result and solution alignment unresolved; do not label this as a true item HOLD or as R1 PASS.