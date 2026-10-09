# Palma SVG speed pilot review package

This package preserves the frozen v8 candidate review, actual post-apply Chrome QA, A/B speed runs, and post-apply retention/parity evidence. The pre-rebind retention failure and baseline comparison are retained as separate raw artifacts; only the two approved technical hash-binding files were rebound by ROOT.

- Candidate manifest SHA-256: `931B258A337CD0EE81D5B5D76B8051291672A7A39C91742BB7BF48C4B6266736`
- Historical pre-apply review receipt SHA-256: `AA7BD02F5496576C8A526530E210DD6C414E425F1DE81A9D75CD540B78C46F7D`
- Post-rebind retention gate: PASS, 131 checked + 323 legacy exempt = 454 total, 0 failures.
- Post-rebind protected-payload parity: PASS, 10 targets, 17 source siblings preserved, 17 Consumer/index sibling hash-only rows, 40 body fields and 40 solution-image fields match, 10 Meta/approval states preserved, 10 assets.
- Hash-only rebind: 32 source SHA bindings across the index and historical compatibility cutover; no content, semantic Meta, evidence, approval, review, or asset bytes changed.
- Historical pre-rebind current failure, baseline PASS, proposed-rebind PASS, apply receipt, and post-rebind raw reports are included under `raw/` and `receipts/`.
- Package files: 352; total bytes: 15021835.
