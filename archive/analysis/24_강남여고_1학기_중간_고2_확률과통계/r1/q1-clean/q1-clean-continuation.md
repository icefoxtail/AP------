# qid 1 clean R1 difficulty continuation

Status: blocked before difficulty adjudication. This is not a full-exam R1 result or PASS.

- Worktree / Git root: `C:\Users\USER\Desktop\AP-worktrees\h2-1mid-20261010\AP------`
- HEAD: `c41ab67a46ae1e5b6a8639bd3d804be1032a876f`
- Current source SHA-256: `7597f74e213a7bffab8a30fab9eb23e5b438f159772c95f4c99841b0fb03fa25`
- Current source Git blob SHA-1: `09db9c01375f237bb782ca013ceefb087336256a`
- Student bundle: `current-student-only.bundle.json`
- Student bundle SHA-256: `a4197b6c556799765756df2e3acd17921212517d614b7c34d8dfc83cc0f14be9`
- Difficulty rule read: `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md` §§8, 11.2.
- Independent answer freeze: `q1-independent-answer-freeze.json`
- Freeze SHA-256: `568fc54a43c79340335807f3b0ff83aac17a18b49acdc3661358344e62750bcb`
- Frozen independent answer: choice 5, value 116 (`3Π4 = 3^4 = 81`; `5H3 = C(7,3) = 35`). Stored answer was not disclosed or compared.

Postfreeze disclosure attempt used the exported `disclosePostfreeze` from `archive/tools/archive-student-bundle.mjs`, with qid 1 only and the student bundle above. It failed closed with `CURRENT_SOURCE_DENOMINATOR_CHANGED`: the helper requires the source exam question count to equal the bundle row count (24 vs. 1) and requires a complete matching freeze. No raw exam source was browsed and no answer/solution fields were disclosed. The helper emitted no disclosure file.

A helper-freeze adapter was generated from the immutable qid 1 freeze for the helper call: `q1-postfreeze-helper-freeze-adapter.json` (SHA-256 `4a43d82442507bb8649b5dccd8ef145af4077d22805b620b1211a41a481b3daf`). It is not a replacement freeze and did not enable disclosure.

Required continuation: provide/authorize a safe qid-scoped postfreeze disclosure helper that validates current student parity for qid 1 without requiring a complete 24-qid freeze/bundle. Then inspect only qid 1 answer/solution/solution visual fields, complete independent difficulty and legacy compatibility judgment, and compare only the authorized metadata fields. No answer, solution, or metadata correction was made.

## Resolution update — 2026-10-11

Parent supplied an approved complete-current-bundle disclosure route plus a qid 1 only postfreeze metadata projection. The existing q1 clean answer freeze remained unchanged. The qid 1 disclosure verified `studentParity: EXACT` and exposed only qid 1 answer/solution fields. Independent difficulty judgment was frozen before reading the stored metadata projection.

- Independent difficulty judgment: `q1-independent-difficulty-judgment-freeze.json`, SHA-256 `ab499d337a164c6892d2abe58408ea7108e8cde7674b467763fced940fc38669`.
- Stored-field projection after freeze: `q1-current-stored-difficulty-only.after-freeze.json`, SHA-256 `d7ef99b25e9be9d5997ecf15979e186c429aef6b1e47772e059d3775da0cdae9`.
- Adjudication: bucket 1 / high / NONE; keep `level=하`; update qid 1 `difficultyBucket` 2→1 and `legacyLevelCompatibility` BORDERLINE_REVIEW→NORMAL.
- Patch receipt: `q1-metadata-patch-receipt.json`, SHA-256 `94244c6bc542c92350e8ecd8a2569e81ab7297a689834b3eba1a2d0940697385`.
- Adjudication evidence: `q1-independent-difficulty-adjudication.json`, SHA-256 `303e8007cf5a19953481416be604c2f93210e6c8cdd4c0d14e24f524644108de`.
- Final JS raw SHA-256: `e5f0004f7a887cd57bb091e2ebcb5dcbce52e41743e750de0637fd8d396c4686`; Git blob SHA-1: `8ba0c1fe8f50b378e89f91b31903d77b897dcc4a`.

The earlier failed partial-helper attempt remains recorded above; it disclosed nothing. The qid 1 adjudication is now technically closed. This remains qid-only support and is not a full-exam R1 result; no full-stage validator was run.
