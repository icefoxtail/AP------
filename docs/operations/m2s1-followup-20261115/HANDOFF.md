# M2 S1 narrowly reviewed repair follow-up — 2026-11-15

## Scope and dependency

This follow-up depends on the first M2 S1 packet `916bc54c8ada1a99a0a390f6fff891c97a45987d` (PR #2080) having completed its official registration. It carries 21 independently checked source repairs in 14 source files, then 14 official difficulty-only requests for those same 21 UIDs. The first packet is unchanged. Its 1,299 selected difficulty UIDs and these 21 are disjoint, giving 1,320 of 1,780 UIDs with accepted numeric difficulty covered by the two packets.

The 22 repaired payload fields are existing solution text and two accessibility descriptions. The exact before/after field hashes, current source blobs and bounded independent review are in the referenced evidence. Stems other than the specified accessibility description, answer values and image bytes are unchanged. Existing accepted numeric difficulty and confidence are retained; a source repair does not create a confidence upgrade, REVIEW2 pass, advanced metadata approval, or canonical source-fingerprint refresh.

## Evidence and deliberate exclusion

The r2 proposal and independent crosscheck confirm 21/21 repairs. Their r1 predecessors preserve the exact evidence chain used to compare the unchanged repairs. E064 Q9's final explanation distinguishes a condition that guarantees the required parameter from a broader condition that merely includes it. E049 Q10 was restored to the base source and excluded: its original stem does not establish the natural-number condition needed by the proposed inference. No missing condition or original-exam correction was invented.

The first packet had 481 held UIDs. These 21 held solely for source-content problems now have their bounded repair checked and their accepted difficulty registered in the isolated fixture; 460 remain. The remaining set includes 394 with missing method evidence and 66 without that reason. Those 460 are not all classified as missing-original-source cases, and this packet does not claim to resolve their separate content, method, semantic or conditional-difficulty issues.

## Verified result

All 14 difficulty dry runs and writes passed for 21 questions. The official complete `archive/build_db.py` chain passed, followed by all 14 projection checks and the actual Consumer for 21/21 rows. A post-build comparison against the first packet fixture found exactly 67 changes to the four allowed difficulty fields across the 21 selected UIDs, no unselected UID changes, no advanced metadata changes and no identity changes.

The official Consumer retains 20 informational `assignment_missing` rows, each tied to its exact difficulty request, UID and source ordinal. They are recorded in `validation.json`; new advanced metadata approvals are zero. Canonical source fingerprints, pending advanced assignments and unrelated holds remain visible under the official difficulty-only contract.

## Main release

The release owner should apply this packet after PR #2080's requests are consumed. If an earlier packet's inbox request for a changed source file is still present, complete that earlier registration before introducing the new source blob. Use the official registration/build workflow and the reviewed-difficulty CI support from PR #2083. Never commit generated shared JSON from the validation fixture.

Local validation is complete. Main merge, main registration and production remain pending until their actual run results are observed and recorded by the serialized release owner.
