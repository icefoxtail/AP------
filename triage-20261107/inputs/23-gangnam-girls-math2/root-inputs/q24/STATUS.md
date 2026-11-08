# 23 강남여고 고2 수학II 2학기 기말 Q24

Status: OPEN_DRAFT_PRESERVED, NOT_READY, NOT_RENDERED.

The three JSON files are preserved byte-for-byte from ROOT's authored draft. ROOT directly read the question/answer/solution and reported viewing the five applicable source PNGs at the exact PR head below. Preservation checks parsed all JSON and matched all 15 plan.sourceQuote strings to unchanged solutions. These checks are not the official validator or independent review.

Exam snapshot: 25 questions. Triage FIGURE inputs Q03/Q11/Q15/Q16/Q19/Q22; EXEMPT Q01/Q02/Q05; KEEP_HISTORY Q08; OPEN Q04/Q06/Q07/Q09/Q10/Q12/Q13/Q14/Q17/Q18/Q20/Q21/Q23/Q24/Q25. Main checked at 615f9347f502042fb5c98208d365e65c988f8012. The ledger's exam-level CLOSED contains only Q08 PUBLISHED (PR #774), not completion of all 25 questions. Actual Q08 geometry-visual-v1 SVG blob 164b06625dcd5d291789279184fbe5df5d8d44c0 is preserved. The prior six input sets/handoff at 2858be0a3c4704bbdbe6b8c9d54fe85a23ae2387 remain unchanged. Main and triage source blob: 8dbdc762a9bb78a57fa770c97a6307802b7f762c.

Source-image provenance: Q07/Q12/Q14/Q18/Q24 PNGs are absent from the checked main canonical assets directory, whose only file is Q08's SVG. Open PR #1225, head 374cbb01ab00c364e4fb50e3b63d145c1aef5cd3, owns their pending PNG restoration and five image-field additions. Its source blob is 2f0fb4b4cf91d91c133ee36fb999cb1f56a5afb5; compared with main, only those five image fields differ. This task neither restores/copies PNGs nor edits JS, PR #1225, its branch, or any source asset. Git blob/size provenance is verified; independent Drive-original byte identity is not claimed. Open PR #1405's separate 4slot metadata is also untouched.

Ownership: read-only branch/PR/conversation inventory found no overlapping input writer for these new triage directories. PR #1225's image-restoration ownership is explicitly preserved, not treated as unowned work. Current external worker execution, local locks and cumulative render attempts remain UNKNOWN. No item-specific upload/authorization denial for this exact H2 Math II exam was found in inspected records. Other H1 exam access denials or Q06/Q17 ownership do not transfer to this exam. Historical Q04/Q06/Q10 framing problems remain technical history; no failed render is repeated or counter reset.

Official validator: NOT_RUN. Engine-contract validation: NOT_RUN. Render: NOT_RUN. Independent review: NOT_RUN. Visual/layout/scaling review: NOT_RUN. Student-renderer/full-exam validation: NOT_RUN. Handoff: NOT_RUN / NOT_SENT because the implementation worker is stopped. No source, image, ledger, queue, engine, metadata, PR, merge or deployment change is included. Saving inputs does not resolve OPEN or establish READY.

Question-specific limitations:
The source PNG is the derivative graph; this helper is the recovered original f divided by 4. Plotted maximum 5/4 means actual 5, and plotted minimum −27/4 means actual −27. The recovered formula exposes requested coefficients a=−6,b=0,c=5; final minimum is in caption. Answer display, scale labeling and relation to the derivative zeros remain unverified. No source PNG/JS restoration is performed here.

Source PNG used by ROOT: archive/assets/images/23_강남여고_2학기_기말_고2_수학II/q24.png, PR #1225 head 374cbb01ab00c364e4fb50e3b63d145c1aef5cd3, blob 239d6ec1142aa3369cbd87a55ea48be9f6e1f948, 26117 bytes. It is not present in checked main. Preserve the pending restoration and linkage instead of duplicating it.

Preservation base: codex/svg-triage-20261107 at fbed1f65c7e03ca3df7655c2c80527aefad6ecd0. The containing commit identifies this saved revision; remote readback is reported separately after the ref update.


## Exact-coordinate representation correction

ROOT의 최신 계획을 그대로 보존했다. requiredPoints의 분수·근호 문자열을 그리기용 유한 JSON 숫자로 바꾸고 graphPlan.exactCoordinates에 양 좌표의 원래 정확식을 함께 보존했다. 계수·함수·정의역·표시 범위·sourceQuote·다른 필드는 변경하지 않았다. 아래 숫자는 그리기용 좌표이며 정확 라벨을 근삿값으로 바꾼 것이 아니다.
- M: exactCoordinates ["0", "5/4"]; numeric drawing position [0.0, 1.25].
- N: exactCoordinates ["4", "-27/4"]; numeric drawing position [4.0, -6.75].

phase2.mjs blob 983e492c0661b93ea7e8188fad33061a0d103b36 L791–809의 exactCoordinates 및 finite requiredPoints 규칙을 대조했다. 제한된 정적 대조에서 정확식 일치, 수치 오차의 절대 1e-9 및 상대 1e-9 기준, 곡선 위 점 오차 1e-8 기준을 확인했다. 이것은 공식 validator나 렌더·배치·학생 화면 검수가 아니다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 OPEN·HOLD·실패·가독성·답 노출·소유 UNKNOWN 이력은 유지하며 READY 또는 게시 완료를 주장하지 않는다.
