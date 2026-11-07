# 22 효천고 Q04 attempt-09 independent review

Scope: Q04 attempt-09 student-facing candidate only. Queue remains `ROOT_PREPARING`; this record does not change candidate inputs, queue status, source JS, or the existing asset.

## Authority and hashes

- Refreshed `origin/codex/svg-triage-20261107` to `ac6e3e269facaca146cbe33fcfc84d6e73e793c4`. Latest `triage-20261107/22-hyocheon.md` marks Q04 `FIGURE`, with the existing answer mark identified for removal.
- The attempt-09 renderer basis is `53121b178a4def967003294eae446ba5190b43c6`. At the refreshed branch head, Q04 item/plan/publish blobs remain `1b0d4cfd88f2c3d446109c4c7edf50bef9f11295`, `d3b4d1e2cfbdcbbd134b11bcd06866359a41b201`, and `df0bae84b0a2c2b4a6f2f2aed6175a117c40e6b4`, matching the start/result receipts. The local `plan-r5.json` and `publish-r5.json` SHA-256 values are `f02ec91f186f58b97697cbf5b45601f1d681787ddf92da59a9cb2a8a85022f2a` and `49dc2eae3927baaf4711df288a39f556cfbb87df0b50a61c851a8db8799325bb`, also matching the attempt receipt.
- Receipt-bound candidate SVG SHA-256: `181a602605a49b7b1740a38fee8fcc8ff4e30fcef5aa8b8429fc5278375f0430`. The after/context/page capture hashes are `d7222211921c1009138e3307f67413327bb5a41fd14c404c58c38d604942179b`, `bae1cb6e697e04b32fed55489f4f45464b7ae6c37e6e275d6a8e503eaf29a417`, and `991d425a3660788ed7bca1563bc00a4b8638b2a0f5f2f64d603ab4f0176a1de7`. Receipt SHA-256: `a761d66142dc4195e24cd87febd04e2f714fce3852cd00d92e3444d58377bec2`. All local bytes matched these receipt values.

## Independent math and visual findings

Source Q04 asks about `y=(2−5x)/(x−1)`. Rewriting gives `y=−5−3/(x−1)`, so the asymptotes are `x=1` and `y=−5`, meeting at center `(1,−5)`. The symmetry axes through that center with slopes `1` and `−1` are `y=x−6` and `y=−x−4`. Thus `a=−4`, `b=−6`, `a+b=−10`, choice ①.

The actual SVG contains two separate rational-curve branches, the vertical/horizontal asymptotes, both labeled diagonal axes, and the x/y axes. Readback coordinates put the asymptotes at SVG `x=256` and `y=292.9`; the symmetry-axis polylines have equal-magnitude x/y deltas and intersect at that same point. The equal-unit scale is preserved. The center has no point marker or C label, as intended. Both branches, labels, and line intersections are inside the rendered frame; the after/context/page captures show no collision or clipping. Labels contain no `a+b`, `−10`, or choice number. SVG title/description and proposed alt are answer-free; the proposed publish caption ends with the correct choice, which is the allowed caption location.

Visual calibration used the prior-read 25 효천고 Q12 rational symmetry-axis sample and the 2026-09-29 visual owner-binding negative guidance.

## Decision and remaining state

**Candidate review: PASS.** Attempt-09 reports `ARCHIVE_BOUND_DRAFT_CANDIDATE`, with renderer static audit and rendered layout PASS. The actual screenshot/candidate are isolated replay evidence only: qualification, production-page publish/DOM, and production authorization remain `NOT_RUN`/false. The local Q04 `STATUS.md` remains its original `NOT_RENDERED` draft and is intentionally unchanged; it must not be read as a READY status.

**Release wiring: OPEN.** The current source JS still references `assets/images/22_효천고_2학기_기말_고1_기출/q04-solution.svg`. That legacy SVG visibly contains `a+b=−10` and has no SVG title/description. Attempt-09 removes the answer from the candidate, but publication is `NOT_RUN`, so the source still resolves to the legacy image. No source/asset publication was performed in this review.
## Latest input branch refresh

After the first reviewer-record push, fetched the input branch again. Its HEAD is now `f4e1e123618f6ce912ce616a3b902223deeb09ac`; that commit adds only the 20 Suncheon Girls input drafts. The Q04 queue row still reads `FIGURE` with the legacy answer-mark removal note. Q04 item/plan/publish blobs at the refreshed HEAD remain `1b0d4cfd88f2c3d446109c4c7edf50bef9f11295`, `d3b4d1e2cfbdcbbd134b11bcd06866359a41b201`, and `df0bae84b0a2c2b4a6f2f2aed6175a117c40e6b4`, unchanged from attempt-09 receipt inputs.