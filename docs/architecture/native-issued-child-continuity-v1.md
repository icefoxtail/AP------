# Issued child continuity v1

This contract restores native reuse of two already published source-only preservation receipts. It creates no metadata approval and performs no registration. The actual child receipt, selected metadata, identity, runtime, registry, source, and assets remain unchanged.

## Authentication boundary

A sidecar lives at `archive/data/meta-foundation/evidence/native-issued-child-continuity/v1/<actual-child-request-id>.json`. The closed schema selects either `RPM_UNCHANGED_FP0` or `SOLUTION_REBIND_FP1` and records one UID, source path, ordinal, paper count, actual child receipt path/raw SHA, child published commit, original leaf path/raw SHA, and original published commit. FP1 additionally binds one existing image proof commit and PNG path/raw SHA.

The loader verifies regular paths without symlinks, exact Git ancestry and blob identity, the actual child receipt at its published commit, the original leaf at its original published commit, and the entire selected question. Live source bytes and selected metadata, identity, and runtime rows must agree with the actual published child and the caller. A child must preserve exactly one approval, create none, and contain no registry, fingerprint-repair, native-parent, whole-exam, or additional authority extension.

Original selected authority and values must remain exact. Only the published metadata revision and one child receipt evidence append are permitted in metadata/runtime; identity is unchanged. The preservation actor in the child wrapper may differ from the original reviewer. Its actual published wrapper is authenticated, while the original row's approval author and all core authority fields remain exact.

Authentication returns a private WeakMap token. Callers cannot mint or combine contexts. Reads return clones and recheck live bytes. Large selected tables may reuse parsed rows only after the whole file has been read and SHA checked; no time or size heuristic replaces the byte check. A changed sidecar, receipt, selected row, question, HEAD, or required evidence rejects the token.

## Existing strict native validators

The ordinary source-only chain remains in place. A sidecar can authenticate only its exact current child and exact terminal original leaf. It does not make arbitrary historical evidence acceptable.

FP0 preserves the existing strict RPM history contract: the original crosswalk rows remain unchanged, later rows are append-only, the master remains LOCKED and exact, and the original leaf and current question satisfy the existing authority and field checks. The actual original native validator must succeed for both issued and current cursors.

FP1 preserves the existing solution-only fingerprint repair contract, exact selected RPM row, taxonomy/PT/TPL and authority checks, and both mandatory native validations: issued cursor and original solution cursor. The original independent proof remains unchanged. Its existing PNG is bound to the observed `f81346ab5ddcbc011bada86ccdd3df6d629e454c` source commit, original issued commit, and current bytes. The original solution cursor has the same image path and non-solution student fields. This contract does not claim that the unavailable declared proof head or the image bytes at the original solution cursor's historical time were verified.

Only the exact authenticated old RPM crosswalk is read from historical bytes. Other evidence keeps its ordinary current SHA checks. FP0 and FP1 contexts cannot be mixed. Figure and renderer eager readers use the same private typed context and retain their normal claim checks.

## Operational behavior

Without a sidecar the existing strict path is unchanged. A valid sidecar makes native reuse recognize the already issued child; the planner returns `ALREADY_REGISTERED`. The registrar and PR preview are not modified. No new inbox request, retirement, receipt, metadata/identity/runtime/registry write, or new FINAL approval is part of this packet.

The writer already includes `archive/data/meta-foundation/` and `archive/tools/` in the relevant input fingerprints, including path, mode and blob. The new sidecar and helpers therefore invalidate stale semantic/reviewed/shared lane reuse. No writer input exception is added.

Future changed selected state or a different preservation child needs its own explicit evidence; this sidecar cannot carry it forward implicitly. Removing the sidecar restores the ordinary strict behavior without changing registered data.

## Validation

The companion verification JSON records exact two-UID native results, original request replay with zero output, reused actual writer Consumer evidence, protected-file equality, and 185 focused tests. The old FP0 59 and FP1 67 tests are reused unchanged; 59 child-context tests cover actual published-state validation, forged and mixed contexts, unauthorized authority/value changes, path/Git failures, retained-token live changes, and RPM/taxonomy/image restrictions. These are transport and authority-continuity checks, not new mathematical review. Main CI, integration and deployment remain separate release gates.
