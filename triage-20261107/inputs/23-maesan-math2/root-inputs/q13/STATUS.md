# 23 매산고 고2 수학II 2학기 기말 Q13

Status: OPEN_DRAFT_PRESERVED, NOT_READY, NOT_RENDERED.

ROOT authored the three JSON files after directly reading the source question, answer, solution, and applicable graphics. The JSON files are preserved byte-for-byte. Preservation checks parsed all JSON and matched every plan.sourceQuote to the unchanged solution text. Those checks are not the official validator or independent visual/mathematical approval.

Exam snapshot: 20 questions. Triage FIGURE: Q01/Q03/Q05/Q06/Q07/Q08/Q11/Q15/Q16. Triage OPEN: Q02/Q04/Q09/Q10/Q12/Q13/Q14/Q17/Q18/Q19/Q20. Main a39c397e11dbafa13fd27e58cd129bd3ee074c5e has no exact exam entry in its figure-completion ledger; absence is not evidence that no work exists. Main and preservation-base source blob: 65ee48f0966c4bc826828b6f12fb3bd78e777c20.

The previous 9 FIGURE input sets and their handoff at bd8fb5f3b281b40ad9b4c95cfdd746c7f5a41845 are preserved. Open, unmerged PR #1520 at bab49991fdd1b58eaf1b8227fc281d19f9c2b0cc contains actual geometry-visual-v1 SVGs for those 9 questions only. Its PUBLISHED 9 / OPEN_UNSUPPORTED 11 ledger is PR-only, not main completion. Current main q14.png and legacy q14/q17/q20 solution SVGs, their asset_verified fields, prior approvals, and existing source history are retained.

Ownership: the checked native-agent, branch, PR, and conversation evidence found no overlapping active writer for these 11 new input directories. External worker identity, local lock/execution state, and cumulative attempts remain UNKNOWN. A historical handoff for the other 9 questions does not establish ownership of these 11. No item-specific authorization/upload denial was found in the inspected records. Q09/Q10 have previous technical input constraints, not security denials; no prior failed render is repeated and no attempt count is reset. Unrelated denied operations are untouched.

Official validator: NOT_RUN. Engine-contract validation: NOT_RUN. Render: NOT_RUN. Visual/layout review: NOT_RUN. Independent review: NOT_RUN. Student-renderer/full-exam validation: NOT_RUN. Implementation handoff: NOT_RUN / NOT_SENT, because the designated implementer is stopped. No source, asset, ledger, queue, engine, metadata gate, PR, merge, or deployment change is included. Input preservation does not close OPEN or establish READY.

Question-specific limitations:
The draft plots velocity v(t)=3t²−4t−4, not position. It supplies no signed-area regions even though the caption refers to displacement as signed area from 1 to 4. The physical t≥0 source domain, axis names, formula-variable display, and splitting a future area region at t=2 remain unverified; sourceDomain is still ALL_REALS. Preserve any earlier source/formula-readability approval without extending it to this new figure.

Preservation base: codex/svg-triage-20261107 at acb2c7c35e0e7bd9b79645e93fcd65c5b1d52ae1. The containing commit identifies this saved revision; remote readback is reported separately after the ref update.


## Exact-coordinate representation correction

ROOT의 최신 계획을 그대로 보존했다. requiredPoints의 분수·근호 문자열을 그리기용 유한 JSON 숫자로 바꾸고 graphPlan.exactCoordinates에 양 좌표의 원래 정확식을 함께 보존했다. 계수·함수·정의역·표시 범위·sourceQuote·다른 필드는 변경하지 않았다. 아래 숫자는 그리기용 좌표이며 정확 라벨을 근삿값으로 바꾼 것이 아니다.
- M: exactCoordinates ["2/3", "-16/3"]; numeric drawing position [0.6666666666666666, -5.333333333333333].

phase2.mjs blob 983e492c0661b93ea7e8188fad33061a0d103b36 L791–809의 exactCoordinates 및 finite requiredPoints 규칙을 대조했다. 제한된 정적 대조에서 정확식 일치, 수치 오차의 절대 1e-9 및 상대 1e-9 기준, 곡선 위 점 오차 1e-8 기준을 확인했다. 이것은 공식 validator나 렌더·배치·학생 화면 검수가 아니다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 OPEN·HOLD·실패·가독성·답 노출·소유 UNKNOWN 이력은 유지하며 READY 또는 게시 완료를 주장하지 않는다.
