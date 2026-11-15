# Reviewed basic approval preservation

This change continues an existing basic unit/subunit approval after a narrowly reviewed source repair. It creates no new basic or advanced approval. The previous figure-only rebind path and its tests remain unchanged.

## Accepted scope

The existing `archive-basic-scope-rebind-request-v1` envelope may declare `approval.sourceReview.schemaVersion = archive-basic-scope-current-source-preservation-v1`. It binds a prior approval commit and a separate repair-base commit. The prior commit must resolve to an actual APPROVED/PASS canonical basic parent through its complete digest-checked canonical input bundle. The repair-base commit binds the before question at the same path and ordinal.

Only two asset-free repair kinds are supported:

- `EMPTY_CHOICE_PLACEHOLDERS_ONLY`: replace a nonempty array containing only whitespace strings with an empty array; every other question field stays equal.
- `REVIEWED_KOREAN_TEXT_ONLY`: apply the exact independently reviewed Korean literal replacements in content, question or solution. Mathematical notation, digits, ASCII variables, answers, choices, images and all other fields stay equal. The maximum is six replacements of at most 48 characters each.

External, alternate, nested and inline rendered assets are explicitly outside this subtype. Figure repairs continue through the original dedicated gate.

The review input and independent decision are SHA-bound to both approval and item evidence. They bind the exact before/after question hashes, changed fields, source bytes, UID, ordinal and retained parent. An independent review of text alone cannot grant a different basic parent or any advanced classification.

## Preserved authority

The current metadata row must equal the prior approved row apart from its two fingerprints and the four separately managed difficulty fields. Identity must equal its prior record apart from its fingerprint. The operation preserves approval kinds, metadata revision, fieldStatus, historical level, every non-fingerprint value, and all unselected records. It requires existing manual problem-type/template holds and refuses any native runtime record. Empty problem-type/template fields stay empty.

An old full fingerprint may already lag a valid basic body binding. This is recorded explicitly and does not manufacture a prior approval: the prior source body must still equal the stored body fingerprint and the real prior canonical resolver must return APPROVED/PASS. The exact already-approved curriculum/course/parent resolves an otherwise ambiguous 2015/2022 crosswalk; the operation cannot choose another parent.

Only metadata fingerprints, identity fingerprint, the same basic parent link and a receipt are written. The receipt distinguishes preserved approvals from new approvals, which remain zero. All validation precedes the first write.

## Registration order and consumption

When a selected reviewed difficulty request targets the same UID, its before fingerprints must exactly name the official basic rebind result. The shared PR/main sorter orders that rebind before this exact difficulty request, regardless of filenames. A refused rebind prevents the dependent difficulty request from running. Unrelated request order and per-request isolation remain unchanged.

The difficulty registrar itself is unchanged. Its normal exact-before and replay checks remain in force. Evidence and receipts persist outside the consumed inbox, and the difficulty replay uses the rebound fingerprints directly.

Static projection checks verify stored values, bindings and receipt integrity. The typed outer Consumer separately invokes official replay and then checks current canonical APPROVED/PASS, the exact parent, source/body fingerprints, direct selection and the actual ProblemBank query. It reports preserved basic approvals, zero new/advanced approvals and the full source denominator. Assignment debt cannot substitute for this preservation result.

## Verification and a separate historical test debt

Focused registrar, PR preview, main isolation and Consumer suites pass 106 tests with zero skips. Actual M2S1 fixture verification applies two basic preservations, keeps all unselected metadata/identity and source/runtime inputs unchanged, and preserves all 54 prior approvals across 19 affected banks. The combined 31-request projection and 49 selected-row Consumer chain pass; only the separately reviewed E029 native registration creates one advanced approval.

The existing Maesanyeo 2024 Mathematics I L3/L4 regression describes an older 1.0.2 audit row/runtime. Main 2ea and the unmodified 68ae Consumer reject its later 1.0.3 runtime-container/1.0.2 row mismatch. The positive historical test now restores all original inputs by exact commit/path/blob/raw SHA at 0eb4; a digest-bound 1.0.3/1.0.2 negative case keeps the production version gate intact. This test repair does not normalize or claim to repair that unrelated production version debt.
