# JS Archive 2.0 — Common Quality Contract v1

status: DRAFT / TWO-LANE FOUNDATION
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## 1. Two execution lines, one quality contract

JS Archive 2.0 keeps one product-quality contract and separates execution into two lines.

- **Codex execution line:** ROOT + stage subagent conveyor, actual engine render, production publication, Git MAIN_DONE.
- **GPT scheduled execution line:** scheduled stage workers + selector/lease/Library handoff. `CREATE → R1 → R2 → R3 → MASTER → MAIN_DONE`. GPT 예약라인은 실제 engine render를 실행조건이나 완료상태로 두지 않는다. MASTER가 R3 완료 artifact를 target-only로 production/main에 반영하고 MAIN_DONE을 닫는다.

A PASS in one execution line is not automatically inherited or invalidated by the other line. Artifact bytes, evidence, and the current contract decide.

## 2. Existing canonical quality authorities remain active

This contract does not replace the existing canonical rules. It binds them into one exam-completion definition.

- `JS아카이브_문항조판_운영규칙_v1.md`
- `JS아카이브_학생용해설_운영규칙_v1.md`
- JS Archive rulebook / source fidelity / correction protocol
- Meta Foundation / RPM / difficulty canonical
- Visual Production Contract and relevant geometry/graph rules

## 3. Final names from the beginning

JS, PNG, and SVG use final production filenames and production-relative references from the start.
Before promotion, work in `.tmp/archive/<examUid>/...` or an equivalent isolated execution-line area.
Normal promotion moves the already-validated artifact to production; it does not rename assets or rewrite student-facing content.

## 4. Question layout

Question layout follows the existing QUESTION MICRO_LAYOUT canonical.

- source text exact parity and choices exact parity
- engine owns objective-choice display numbers; do not duplicate ①~⑤ inside choice data
- preserve source problem images instead of replacing them with reconstructed solution-style SVG
- layout changes presentation, not source text meaning

## 5. Small-board solution

> Small-board means the flow of a teacher explaining aloud while writing the actual mathematics line by line on a board.

Teacher-language sentences appear where they are needed to explain why a formula is used, where a condition enters, or why a case is split.
The mathematical body remains visible as equations and substitutions.

`식 설정 → 식 변형 → 중간값 → 대입 → 계산 → 최종값` must be traceable downward without a hidden calculation jump.
Explanatory prose cannot replace omitted intermediate equations.
Equations alone without the teacher's necessary explanation also fail.

Core review axes:
- `STUDENT_REPRODUCIBILITY`
- `SMALL_BOARD_STRUCTURE`
- `BOARD_FLOW_CONTINUITY`

## 6. Golden and Meta are different authorities

Current fixed H1 Golden set, until explicit user change:
- `25_매산여고_2학기_중간_고1_기출.js`
- `25_효천고_2학기_중간_고1_기출.js`
- `25_제일고_2학기_중간_고1_기출.js`

Golden is the student-facing quality floor for solution/layout/visual use. It is not source truth and not the Meta/difficulty schema authority.
Known Golden defects are recorded as exceptions instead of replacing the fixed set. Current known exception: 제일고 q18 visual.

## 7. CREATE

CREATE produces an Archive-complete candidate for every qid:
- source identity / content / choices / answer
- question layout
- small-board solution
- Meta Foundation fields
- difficulty
- visual disposition and required assets
- engine-safe final JS
- artifact/evidence binding

Evidence-only PASS is forbidden when the final artifact does not physically contain the required fields.

## 8. R1

R1 is the one deep full-qid integrated seal:
- source identity
- independent math / answer / answer cardinality
- question layout
- small-board continuity
- Meta / difficulty
- visual necessity / semantic parity

After repair, recheck only changed qid + direct dependency.
If content/choices/problem visual changes, re-evaluate whether the previous independent freeze is still valid.
PASS binds answer, solution, decisiveStep, Meta, visual, and evidence to one final artifact SHA.

## 9. R2 and R3

For the next qualification pilot, R2 keeps a full-qid blind answer sweep.
Freeze the complete student-input answer before stored answer/solution exposure.
MATCH closes quickly; mismatch/suspicious/high-risk locus gets deep treatment.
R2 does not rerun the full R1 quality audit.

R3 is targeted release review of changed/open/direct-dependency/locked scope plus final structural integrity.
It does not rerun whole-exam semantic review.

## 10. Artifact gate

For evidence with `qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`, the generic V2 validator also checks the actual final JS.

Mechanical checks include:
- parse / denominator binding through the existing V2 validator
- required Meta fields physically present
- explicit canonical debt for allowed null PT/TPL values
- difficulty 4 fields
- choice engine-label duplication
- control-character damage such as TAB/form-feed escape corruption
- answer presence when choices exist
- CREATE/R1 Golden provenance
- CREATE/R1 small-board verdict bound to the exact final solution SHA-256

The artifact gate does **not** decide mathematical multiple-answer equivalence, solution logic quality, Meta semantics, or SVG mathematical truth. Those remain worker responsibilities.

## 11. Stage states

- `CREATE_COMPLETE`
- `R1_QUALITY_SEALED`
- `R2_VERIFIED`
- `R3_RELEASE_READY`
- `GPT_MASTER_PUBLICATION_READY` — GPT 예약라인 전용
- `MAIN_DONE`
- `RENDER_PASS` — Codex 실행라인에서만 사용하는 별도 상태

Do not collapse these into one generic PASS. GPT 예약라인에서는 `NOT_RUN_CODEX_HANDOFF`를 사용하지 않으며 render 상태는 completion prerequisite가 아니다.

## 12. Existing artifacts

A new qualityContractVersion does not automatically delete or invalidate old artifacts.
Keep prior artifacts/evidence, calculate the missing axes under the new contract, repair only the missing/defective locus, and rebind the changed final artifact to the required seal.
