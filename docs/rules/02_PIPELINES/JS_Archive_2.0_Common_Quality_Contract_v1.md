# JS Archive 2.0 — Common Quality Contract v1

status: CURRENT / TWO-LANE QUALITY FOUNDATION
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## CODEX input policy — DIRECT USER OVERRIDE 2026-10-09

CODEX는 `Archive_Extracted_Source_First_v1.md`를 따른다. 최초 PDF source intake 이후 CREATE/R1/R2/R3의 기본 입력은 추출 JS·실제 문제 에셋이며, PDF 재대조는 원문 확인이 실제로 필요한 구체적 문항 결함의 범위로 한정한다. 기존 source parity/intake provenance는 SHA-bound 범위에서 재사용하며 실제 PDF 판독과 추출 baseline parity를 구분한다. PDF routine 전수 재열람을 품질 단계 시작 조건으로 두지 않는다. 독립 답안 freeze·필수 입력/에셋·품질·렌더·HOLD·publication 기준과 qualityContractVersion은 바꾸지 않는다. GPT 예약 라인 authority를 이 절로 변경하지 않는다.

## 1. Two execution lines, one quality contract

JS Archive 2.0 keeps one product-quality contract and separates execution into two lines.

- **Codex execution line:** ROOT + stage subagent conveyor, R3 actual render or ROOT-authorized static completion, production publication, Git MAIN_DONE.
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
Before promotion, work in `.tmp/archive/<runId>/<examUid>/...` under the assigned clean worktree. Use final filenames and production-relative asset references.
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

Current Codex R2 keeps a full-qid blind answer sweep; terminated qualification pilots remain historical.
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

## 13. Codex 구현 연결 보강 — 2026-10-06

이 절은 Codex 실행 라인에 적용한다. GPT 예약 라인의 renderer prerequisite·MASTER 운용을 변경하지 않는다.

- 신규 Codex 검수는 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`을 명시한다. evidence의 버전 누락/오타 및 legacy schema로 신규 gate를 우회할 수 없다. 명시적으로 요청한 역사 검수만 버전 강제 없이 legacy 경로를 사용한다.
- artifact gate는 기본 schema/필드 타입, L1/L2의 물리 필드, nullable PT/TPL debt, difficulty 허용값, 모든 stage의 answer/solution, 실제 자산과 SVG 외부 의존성을 검사한다. 단, H2·2015 교육과정·기하(표준 과목 라벨 `기하` 또는 `기하와 벡터`)에서 RPM Primary 의미가 FINAL이고 `high2-geometry.json`이 해당 L2를 `RPM_ONLY`/`subUnitKey:null`로 고정한 경우에만 `subUnitKey:null`을 호환 projection debt로 수납한다. `artifactDispositions`의 `metaDebtFields`에 `subUnitKey`를 기록하고, `rpmOnlyNullSubUnitProjection`에 resolver input/evidence/validator receipt를 SHA 결속해 넣어야 한다. V2 validator는 resolver를 현재 canonical authority로 재계산하고 artifact의 content/choices/image-ref/solution hash와 학년·교육과정·과목·L1 결속을 확인한다. H15-GV 표준 L1의 non-null child key는 현재 RPM crosswalk에서 해당 child projection이 없고 production metadata에도 등록되지 않은 경우 FAIL이다. `subUnitKey == standardUnitKey`인 기존 호환 값과 등록된 legacy key는 유지한다. 임의 null, 누락 필드, 다른 과목·교육과정의 null은 계속 FAIL이며 qualityContractVersion은 바뀌지 않는다. 학생 bank의 EXCLUDED marker는 완제품으로 통과시키지 않는다.
- `artifactDispositions={artifactSha,rows:[...]}`는 현재 artifact에 결속된 Meta disposition이다. R3의 `rows`는 변경/open/direct dependency scope만 유지하고, 미변경 문항의 합법적인 null debt는 별도 disposition에서 인계한다. 전수 의미 검수를 반복하는 구조가 아니다.
- Codex Golden registry: `archive/data/codex-quality-calibration-registry-v2.json`. 사용자가 고정한 세 Golden을 모든 Codex 과정의 판서/조판/시각 표현 floor로 사용한다. 고1의 풀이 방법·Meta·difficulty를 중등/다른 과목에 복사하지 않는다. 교과별 방법은 해당 교육과정 정본으로 판정한다.
- 실제 Golden 파일/대표 문항 solution/필요 SVG/Negative sample의 SHA와 판독 observation을 남긴다. boolean이나 파일명 목록만으로 preflight를 대신하지 않는다. 알려진 Golden visual 예외는 모델로 복제하지 않는다.
- actual render와 MAIN_DONE의 physical receipt는 `archive/tools/archive-codex-closeout-v2.mjs`로 소비한다. 품질 수학 판정은 worker의 책임이며 이 helper는 증거·파일·SHA·범위·remote parity만 검사한다.

신규 evidence에는 `executionLine:CODEX` 또는 `executionLine:GPT_SCHEDULED`를 명시한다. Codex CURRENT CLI는 CODEX를 강제하며, 공통 qualityContractVersion만 보고 GPT R3를 RENDER로 전환하지 않는다. render/MAIN_DONE receipt 및 저장된 R3 validation report도 executionLine:CODEX로 결속한다. GPT 예약 라인은 별도 CURRENT에 따라 `R3_RELEASE_READY → MASTER publication → MAIN_DONE`으로 독립 완결하며 Codex handoff를 만들지 않는다.

## 14. GPT 예약 구현 연결 보강 — 2026-10-06

- 신규 GPT evidence는 `executionLine:GPT_SCHEDULED` + current `campaignId` + fixed `stream=A|B|C`를 모두 결속한다. validator/state/continuation은 이 identity를 유지하며 cross-generation/cross-stream 승계를 거부한다.
- GPT CREATE/R1은 기본 schema·difficulty enum·실제 production asset/SVG dependency·Golden/Negative provenance의 실제 SHA와 observation을 공통 artifact floor로 사용하되 GPT 전용 registry `archive/data/gpt-quality-calibration-registry-v2.json`을 사용한다.
- R3 targeted rows는 open/changed/direct dependency만 유지하고, 전 문항 Meta null/debt disposition은 `artifactDispositions={artifactSha,rows:[...]}`에 별도 결속한다. 이것은 R3 전수 의미 재검이 아니다.
- GPT stage validator 호출은 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line GPT_SCHEDULED --campaign-id <campaign> --stream <A|B|C>`를 명시한다.
- GPT는 render를 수행하지 않는다. 대신 MASTER의 MAIN_DONE은 `archive/tools/archive-gpt-closeout-v2.mjs`로 R3 validation SHA, final artifact SHA, asset SHA, production path, origin/main remote parity를 결속한다.


## Codex ownership clarification — 2026-10-07

When ROOT selects the actual-render route, Codex R3 owns six-case Archive Engine rendering, screen judgment and reviewer-bound receipt. ROOT waiver/static-route authority follows Execution §25. ROOT accepts the machine witness, SHA/coverage/receipt and performs publication/readback; ROOT does not repeat screen quality review. The detailed conveyor, absolute assignment packet, R1/R2 student-only isolation, item HOLD travel, validator retry after actual repair and ledger contracts are in `JS_Archive_2.0_Codex_Execution_v1.md` §§16–25. This clarification does not change GPT_SCHEDULED render/publication behavior or the qualityContractVersion.

## ROOT production-completion exceptions (CODEX)

Codex completion is verified production readiness, publication and remote readback. Execution §25 delegates capture/render waiver and bounded HOLD recovery/release decisions to ROOT without repeated user approval. R1/R2 valid full-input freezes, complete qid coverage, R3 JS/assets/SVG/structure integrity, zero unresolved item HOLD and SHA-bound technical closeout remain required. ROOT-directed static completion records ROOT_DELEGATED / ROOT_DIRECTED_STATIC_COMPLETE / NOT_RUN_ROOT_WAIVER; direct-user waivers retain their distinct authority and status. Unexecuted screens are NOT_RUN, never fabricated RENDER_PASS. General ROOT static/MAIN_DONE validators and stage consumers are implemented across locked roster grade/course/run; full and partial waiver evidence have separate honest case status. The read-only archive-codex-root-waiver-intake CLI verifies durable authority revision, exact evidence and remote bytes. Historical direct-user helpers retain their original scope. This operational clarification keeps the qualityContractVersion and GPT_SCHEDULED behavior.

## 2026-10-08 — DIRECT USER ASSIGNMENT AUTO-RELEASE HARD

형님이 특정 시험지 또는 Archive 작업의 제작·수정·해설·Meta·시각자료·등록·검수를 직접 진행하라고 지시하면 작업자는 해당 지시 범위의 실제 작업을 끝낸 다음, 사용자에게 출시 인증·운영병합을 다시 요청하거나 승인 대기하지 않는다. 해당 작업의 정식 출시 인증(현재 적용되는 R1/R2/R3, validator/receipt 및 필요한 실제 렌더 또는 근거 있는 허용된 면제), 등록(Archive 1 DB와 해당하는 Archive 2.0 question-index/identity/metadata/catalog), production publish, main 운영병합, remote readback과 MAIN_DONE closure까지 하나의 완료 목표로 연속 실행한다.

사용자가 발문 우선/해설 후속처럼 단계별 범위를 명시했다면 그 지시 범위만 출시·등록한다. 변경하지 않은 범위를 불필요하게 재검하거나 다른 시험지의 인증을 되감지 않는다. 검증하지 않은 PASS, 실행하지 않은 렌더 PASS, 미등록·미병합 상태의 MAIN_DONE 또는 품질 게이트 임의 우회는 금지한다. 기술 장애가 생기면 허용된 대체 경로로 수리한 뒤 결과를 재조회하며, 물리적으로 닫지 못한 단계는 정확한 결손과 재개 위치를 기록한다. 별도의 중지·보류·제외를 명시한 형님 최신 지시가 이 기본값보다 우선한다.
