# 23 복성고 고2 수학II 2학기 기말 Q15

Status: OPEN_DRAFT_PRESERVED, NOT_READY, NOT_RENDERED.

The three JSON files are preserved byte-for-byte from ROOT's current local draft. ROOT reported directly reading the original question, answer, solution, and applicable source graphics. Preservation checks parsed the JSON and matched every plan.sourceQuote to the unchanged source solution; these checks are not the official validator.

Exam snapshot: 22 questions. Triage identifies FIGURE Q01/Q04/Q05/Q06/Q07/Q09/Q16/Q20/Q21 and OPEN Q02/Q03/Q08/Q10/Q11/Q12/Q13/Q14/Q15/Q17/Q18/Q19/Q22. Main a39c397e11dbafa13fd27e58cd129bd3ee074c5e has no exact exam entry in its figure-completion ledger; ledger absence does not prove lack of work. Main and preservation-base source blob: eaab8755bde10d21dafa244214b29c8fd466ffe0.

Prior 9 FIGURE input sets and their handoff at b0bf3197e3af77bcd689a82265f8ce06b246d729 are preserved. Open PR #1520 (head bab49991fdd1b58eaf1b8227fc281d19f9c2b0cc) contains geometry-visual-v1 SVGs for those 9 FIGURE questions only, not the 13 OPEN questions saved here. Its 9 PUBLISHED / 13 OPEN_UNSUPPORTED ledger is PR-only, not main publication. Existing source assets, legacy solution SVGs, earlier approved PR #534 history, previous inputs, queues, ledgers, and PR #1520 are not modified.

Ownership: no overlapping active native writer or remote input change for these 13 questions was found in the checked branch/PR/conversation evidence. Current external worker identity, local execution/lock state, and cumulative attempt count remain UNKNOWN. The older 9-question handoff is not ownership evidence for these 13. No item-specific authorization/upload denial was found in inspected records; unrelated denied operations are not retried. Prior technical failures and existing approvals are not reset or generalized.

Official validator: NOT_RUN. Engine-contract validation: NOT_RUN. Render: NOT_RUN. Visual/layout review: NOT_RUN. Student-renderer review: NOT_RUN. Full-exam validation: NOT_RUN. No render attempt is made by this preservation task. Implementation handoff: NOT_SENT, because the designated implementation worker is stopped. No engine change, source change, publication, merge, or deployment is included. Adding these files does not close OPEN or clear any metadata gate.

Question-specific limitations:
The draft is the boundary-case cubic f(x)=x³−x²−x−5/27 with its double root and simple root. It does not plot F or independently establish all cases of the requested extremum count. The final a=−5/27 is explicitly present in alt and coefficients. Answer exposure, tangent/double-root visibility, and the f-sign/F-extremum relation are unvalidated.

Preservation base: codex/svg-triage-20261107 at 30d317abccff0b0fff9af85893dc86e6b4568b20. The containing commit supplies the final preserved revision; remote content verification is reported separately after the ref update.


## Exact-coordinate representation correction

ROOT의 최신 계획을 그대로 보존했다. requiredPoints의 분수·근호 문자열을 그리기용 유한 JSON 숫자로 바꾸고 graphPlan.exactCoordinates에 양 좌표의 원래 정확식을 함께 보존했다. 계수·함수·정의역·표시 범위·sourceQuote·다른 필드는 변경하지 않았다. 아래 숫자는 그리기용 좌표이며 정확 라벨을 근삿값으로 바꾼 것이 아니다.
- A: exactCoordinates ["-1/3", "0"]; numeric drawing position [-0.3333333333333333, 0.0].
- B: exactCoordinates ["1", "-32/27"]; numeric drawing position [1.0, -1.1851851851851851].
- C: exactCoordinates ["5/3", "0"]; numeric drawing position [1.6666666666666667, 0.0].

phase2.mjs blob 983e492c0661b93ea7e8188fad33061a0d103b36 L791–809의 exactCoordinates 및 finite requiredPoints 규칙을 대조했다. 제한된 정적 대조에서 정확식 일치, 수치 오차의 절대 1e-9 및 상대 1e-9 기준, 곡선 위 점 오차 1e-8 기준을 확인했다. 이것은 공식 validator나 렌더·배치·학생 화면 검수가 아니다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 OPEN·HOLD·실패·가독성·답 노출·소유 UNKNOWN 이력은 유지하며 READY 또는 게시 완료를 주장하지 않는다.
