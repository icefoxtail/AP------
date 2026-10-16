# JS Archive 2.0 — Common Quality Contract v1

## CURRENT OVERRIDE — NEW14 GPT Library nonblocking conveyor (2026-10-17 user directive)

Scope ONLY `SOURCE_ONLY_INTAKE14_20261016`, its five GPT scheduled Library workers; other campaigns and Codex execution unchanged. User prioritizes keeping the CREATE→R1→R2→R3 conveyor moving over stage-local hold/closure. After making the best available real work, even when some stem/choices/answers/solutions/required source PNG or SVG/Meta are incomplete, CREATE must persist the actual candidate and exact missing qids/fields in Library and mark `CREATE_ROUTED/READY_R1`. R1 accepts partial input and independently freezes only qids it can actually solve, recording unreviewable qids without false blind PASS, then marks `R1_REVIEW_ROUTED/READY_R2`; R2 fills student small-board explanations, figures and metadata where possible and marks `R2_REVIEW_ROUTED/READY_R3`; R3 executes possible structural/asset/validator/render reviews, repairs defects and marks `R3_REVIEWED/READY_MASTER_DECISION`. NONE of CREATE/R1/R2/R3 may issue HOLD, reject a handoff for quality incompleteness, or block downstream progression. **Only the final MASTER** judges final `FINAL_HOLD` versus genuine, verified `R3_PASS/RELEASE_READY` after attempting repair and inspecting actual evidence. `ROUTED` is a transport marker, not a quality PASS or release authorization; distinguish old `*_DONE` compatibility routing labels from actually verified stage PASS. Preserve missing-field evidence, `EVIDENCE_DEBT`, `NOT_RUN`, R1 blind independence, existing legitimate review freezes, Library file identity/readback and no double-writing; Git mutation by these scheduled workers remains prohibited. No scheduled worker self-disables. The detailed NEW14 routing authority is the current GPT Scheduled Execution/Prompt Template and Notion GPT 예약 2.0 CURRENT. This targeted scope supersedes older CREATE validator/generic stage closure prerequisite text **only for routing**.

## 2026-10-12 CODEX FAST LANE

2026-10-13 Codex 추가 지시: 신규 문항의 임시/최종 item·시험지·run HOLD 발행을 금지한다. 결함은 담당자·qid·다음 행동이 있는 수정/ALIVE 대체/영향 검수로 완료한다. ROOT는 실제 담당자를 연결하고 결과를 수납한다. 과거 HOLD 이력은 보존하며 이 문서의 item HOLD travel/recovery 표현은 Codex 신규 작업의 HOLD 발행을 허용하지 않는다. 실제 품질 판정·독립 freeze·Meta/에셋·표시·publication 정확성과 GPT 예약라인은 유지한다.

Codex 원본 시험지 운영은 `JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md`를 우선한다. R1의 전 qid 독립 답·근거 freeze-before-compare 및 실제 교육과정 의미검수, 신규 R2의 전 qid 현재 해설 학생 관점 검산·적극 개선을 구분한다. 신규 R2 별도 blind freeze는 강제하지 않는다. 유효한 과거 blind/PASS는 보존한다. R3는 변경·미해결·직접 영향과 최종 구조만 확인한다. 검사기 PASS는 수학·교육과정 의미검수를 대신하지 않는다. GPT 정책 문서는 정렬하되 실제 예약·validator는 변경하지 않는다.

status: CURRENT / TWO-LANE QUALITY FOUNDATION
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## 2026-10-10 — 최신 작업 범위·종료 조건 우선

루트 `AGENTS.md`의 ‘최신 요청의 작업 범위·종료 조건 우선’을 먼저 적용한다. 기존 문항의 명시적 한정 수정은 지정 대상과 필수 직접 의존 부분만 수정·영향 검증하고 지정된 종료 조건에서 끝낸다. 아래 전체 stage/전수 분모는 명시적으로 맡긴 전체 제작·전수 검수에 적용한다. 한정 수정을 CREATE/R1/R2/R3 전체 재실행이나 unchanged 시험지 재풀이로 승격하지 않는다. 범위 밖 발견은 보고만 하고 확장에는 사용자 승인이 필요하다. 이 구분은 품질 기준·qualityContractVersion·예약 실행 설정을 변경하지 않는다.

## CODEX input policy — DIRECT USER OVERRIDE 2026-10-09

CODEX는 `Archive_Extracted_Source_First_v1.md`를 따른다. 최초 PDF source intake 이후 CREATE/R1/R2/R3의 기본 입력은 추출 JS·실제 문제 에셋이며, PDF 재대조는 원문 확인이 실제로 필요한 구체적 문항 결함의 범위로 한정한다. 기존 source parity/intake provenance는 SHA-bound 범위에서 재사용하며 실제 PDF 판독과 추출 baseline parity를 구분한다. PDF routine 전수 재열람을 품질 단계 시작 조건으로 두지 않는다. 독립 답안 freeze·필수 입력/에셋·품질·렌더·HOLD·publication 기준과 qualityContractVersion은 바꾸지 않는다. GPT 예약 라인 authority를 이 절로 변경하지 않는다.

## 1. Two execution lines, one quality contract

JS Archive 2.0 keeps one product-quality contract and separates execution into two lines.

- **Codex execution line:** ROOT + stage subagent conveyor, R3 actual render or ROOT-authorized static completion, production publication, Git MAIN_DONE.
- **GPT scheduled execution line:** 모든 GPT 예약 campaign은 시험지별 전체 Library 패킷과 누적 검수기록으로 `CREATE → R1 → R2 → R3`를 수행한다. 각 단계 예약은 별도 수동 인계 호출 없이 Library에서 직전 단계가 완료한 최신 패킷을 직접 조회하고, campaignId·stream·examUid와 file ID·revision 또는 실바이트 SHA-256으로 입력을 확인한다. 자기 단계에서 이미 처리했거나 다른 실행자가 진행 중인 패킷은 기존 누적기록·동시수정 보호에 따라 제외한다. R3 완료 시 예약은 production JS·이미지·SVG의 출고 후보 identity와 실제 검사 결과를 Library에 기록한다. 별도 Work/Codex 출고 담당이 후보를 모아 해당 파일만 일괄 push/main 병합하며 GPT 예약은 직접 Git에 쓰지 않는다. 이 문서 수정은 실제 예약 prompt/consumer/selector/validator의 변경·검증을 뜻하지 않는다. GPT 예약라인은 실제 engine render를 실행조건이나 완료상태로 두지 않는다.

A PASS in one execution line is not automatically inherited or invalidated by the other line. Artifact bytes, evidence, and the current contract decide.

## 2026-10-16 — evidence storage is separate from evidence status

The user-directed Git scope preserves production source/assets, current runtime/build/test tools/contracts, and the versioned byte-bound offline evidence authorities declared by `archive/data/evidence-authority/v1/index.json`; the index and ROOT receipt bind the exact aliases and current counts/bytes. Raw analysis histories, captures, rebuildable outputs, and intermediate files move to the Drive vault only after verified pack and index readback. ROOT may fetch raw proof on demand through the Drive pack resolver; workers still inspect the actual source and proof and complete their assigned independent review. Storage or a hash-bound completion receipt does not create a review PASS, validator PASS, or render PASS. A missing/corrupt object remains unavailable, and GitHub CI has no Drive/OAuth prerequisite.

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

CREATE directly solves every qid and drafts a mathematically complete, taught-curriculum solution with intermediate calculations and reasons for using conditions or auxiliary constructions, then produces an Archive-complete candidate for every qid:
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

Before seeing stored answers or solutions, independently solve and freeze each qid answer and reasoning with complete student-facing input and required assets. Then compare and judge the actual final solution's concepts/formulas/notations/methods against the year/grade/course curriculum, bound to exact Library file ID+revision or full-byte SHA-256. Improve missing intermediate steps, reasons, auxiliary-line purpose and logical continuity as needed; record per-qid shortcomings, before/after/student benefit or sufficient no-edit reasons. Validator PASS/NOT_RUN is technical evidence, never semantic math/curriculum completion. An unperformed semantic review or UNCERTAIN judgment is not complete.

- source identity
- independent math / answer / answer cardinality
- question layout
- small-board continuity
- Meta / difficulty
- visual necessity / semantic parity

After repair, recheck only changed qid + direct dependency.
If content/choices/problem visual changes, re-evaluate whether the previous independent freeze is still valid.
Legacy PASS binds answer, solution, decisiveStep, Meta, visual, and evidence to one final artifact SHA. After transition, the cumulative record identifies the exact reviewed Library file ID+revision and links eligible current-campaign completion evidence; do not repeat completed stages.

## 9. R2 and R3

New R2 is a **full-qid student-perspective review of the current solutions**. Read complete current student input, necessary assets and solution, recompute decisive steps, and proactively improve missing calculations, condition usage, auxiliary-line purposes, clear logic, notation and in-curriculum teaching. For each qid record the deficiency, before/after edit and student benefit or why no change is necessary. Do not impose edit quotas. Independently re-solve from the original question/choices for mismatch, suspicion or high-risk items, rather than re-running R1's full audit.

New R2 does **not** require a full-qid blind answer freeze and must not be labeled as such. Preserve historical valid R2 blind/full-input freeze as historical evidence without relabeling. R3 checks changed/open/direct-dependency scope and final file structure/visual integrity only, not a repeat of whole-exam math/Meta audits. Generic validator status and actual scope/result or `NOT_RUN` remain separate from completed math/curriculum review.

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
- CREATE/R1 small-board verdict bound to the exact final solution revision (legacy validator receipts use SHA-256; GPT scheduled records use Library file ID+revision or exact-byte SHA-256 when revision is unavailable)

The artifact gate does **not** decide mathematical multiple-answer equivalence, solution logic quality, Meta semantics, or SVG mathematical truth. Those remain worker responsibilities.

## 11. Stage states

- `CREATE_COMPLETE`
- `R1_QUALITY_SEALED`
- `R2_VERIFIED`
- `R3_RELEASE_READY`
- `GPT_MASTER_PUBLICATION_READY` — GPT 예약라인 전용; 별도 Work/Codex 일괄 출고 담당을 위한 후보 상태이며 Git 게시나 전체 품질 PASS가 아님
- `MAIN_DONE`
- `RENDER_PASS` — Codex 실행라인에서만 사용하는 별도 상태

GPT 예약의 stage 상태와 실제 검사 결과는 시험지별 append-only Library 누적기록에 남기며 별도 PASS receipt/seal은 만들지 않는다. Library file ID+version/revision으로 검수본을 식별하고 revision이 없으면 정확한 실바이트 SHA-256을 쓴다. `GPT_MASTER_PUBLICATION_READY`는 별도 Work/Codex 일괄 출고 담당에게 전달할 후보 상태일 뿐 Git 게시나 전체 품질 PASS가 아니다. 같은 campaign에서 검수본·수정범위가 유효한 기존 완료기록은 링크로 승계하고 다음 미완료 단계부터 잇는다. 실제 수행한 검사 결과만 기록하고 미실행은 `NOT_RUN`으로 남긴다. 독립성·품질 축·다른 generation evidence의 비승계는 유지하며 GPT 예약라인은 `NOT_RUN_CODEX_HANDOFF`나 render prerequisite를 사용하지 않는다.

## 12. Existing artifacts

A new qualityContractVersion does not automatically delete or invalidate old artifacts.
Keep prior artifacts/evidence, calculate the missing axes under the new contract, repair only the missing/defective locus, and rebind the changed final artifact to a release seal only where that execution line requires one. For GPT scheduled work, link valid completion evidence from the same campaign and continue at the next incomplete stage; do not repeat completed review or invalidate historical PASS. Preserve other-generation evidence as history without promoting it. Identify reviewed versions by Library file ID+revision; snapshot only if old revisions cannot be retrieved. Do not manufacture GPT stage seals. Record actual checks in the cumulative Library record; a separate Work/Codex release owner records batch publication of production JS/images/SVG.

## 13. Codex 구현 연결 보강 — 2026-10-06

이 절은 Codex 실행 라인에 적용한다. GPT 예약 라인의 renderer prerequisite·MASTER 운용을 변경하지 않는다.

- 신규 Codex 검수는 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`을 명시한다. evidence의 버전 누락/오타 및 legacy schema로 신규 gate를 우회할 수 없다. 명시적으로 요청한 역사 검수만 버전 강제 없이 legacy 경로를 사용한다.
- artifact gate는 기본 schema/필드 타입, L1/L2의 물리 필드, nullable PT/TPL debt, difficulty 허용값, 모든 stage의 answer/solution, 실제 자산과 SVG 외부 의존성을 검사한다. 단, H2·2015 교육과정·기하(표준 과목 라벨 `기하` 또는 `기하와 벡터`)에서 RPM Primary 의미가 FINAL이고 `high2-geometry.json`이 해당 L2를 `RPM_ONLY`/`subUnitKey:null`로 고정한 경우에만 `subUnitKey:null`을 호환 projection debt로 수납한다. `artifactDispositions`의 `metaDebtFields`에 `subUnitKey`를 기록하고, `rpmOnlyNullSubUnitProjection`에 resolver input/evidence/validator receipt를 SHA 결속해 넣어야 한다. V2 validator는 resolver를 현재 canonical authority로 재계산하고 artifact의 content/choices/image-ref/solution hash와 학년·교육과정·과목·L1 결속을 확인한다. H15-GV 표준 L1의 non-null child key는 현재 RPM crosswalk에서 해당 child projection이 없고 production metadata에도 등록되지 않은 경우 FAIL이다. `subUnitKey == standardUnitKey`인 기존 호환 값과 등록된 legacy key는 유지한다. 임의 null, 누락 필드, 다른 과목·교육과정의 null은 계속 FAIL이며 qualityContractVersion은 바뀌지 않는다. 학생 bank의 EXCLUDED marker는 완제품으로 통과시키지 않는다.
- `artifactDispositions={artifactSha,rows:[...]}`는 현재 artifact에 결속된 Meta disposition이다. R3의 `rows`는 변경/open/direct dependency scope만 유지하고, 미변경 문항의 합법적인 null debt는 별도 disposition에서 인계한다. 전수 의미 검수를 반복하는 구조가 아니다.
- Codex Golden registry: `archive/data/codex-quality-calibration-registry-v2.json`. 사용자가 고정한 세 Golden을 모든 Codex 과정의 판서/조판/시각 표현 floor로 사용한다. 고1의 풀이 방법·Meta·difficulty를 중등/다른 과목에 복사하지 않는다. 교과별 방법은 해당 교육과정 정본으로 판정한다.
- Golden 파일/대표 문항 solution/필요 SVG/Negative sample의 실제 version과 판독 observation을 남긴다. GPT 예약은 Library file/version 식별을 쓰며 revision이 없을 때 검수 바이트의 SHA-256을 기록하고 추가 SHA는 최종 기술검사 또는 실제 불일치 진단에 한정한다. boolean이나 파일명 목록만으로 preflight를 대신하지 않는다. 알려진 Golden visual 예외는 모델로 복제하지 않는다.
- actual render와 MAIN_DONE의 physical receipt는 `archive/tools/archive-codex-closeout-v2.mjs`로 소비한다. 품질 수학 판정은 worker의 책임이며 이 helper는 증거·파일·SHA·범위·remote parity만 검사한다.

신규 evidence에는 `executionLine:CODEX` 또는 `executionLine:GPT_SCHEDULED`를 명시한다. Codex CURRENT CLI는 CODEX를 강제하며, 공통 qualityContractVersion만 보고 GPT R3를 RENDER로 전환하지 않는다. render/MAIN_DONE receipt 및 저장된 R3 validation report도 executionLine:CODEX로 결속한다. GPT 예약 라인은 Library에 R3 완료 패킷·출고 후보 identity·실제 검사 결과를 남기고, 별도 Work/Codex 출고 담당이 production JS·이미지·SVG를 일괄 publish한다. GPT 예약은 Git publication이나 Codex render/handoff를 수행하지 않는다.

## 14. GPT 예약 구현 연결 보강 — 2026-10-06

이 절의 GPT 의미 품질·독립 검수 기준과 실제 검증 요건은 모든 GPT 예약에 계속 적용된다. 실행한 validator/검사의 실제 결과는 해당 Library 누적기록에 남기며 미실행은 `NOT_RUN`이다. 예약은 단계별 Git, PASS/seal receipt나 publication을 만들지 않는다. 별도 Work/Codex 출고 담당은 완료 패킷의 production JS·이미지·SVG를 일괄 출고하고 필요한 batch 검증·게시 결과를 기록한다. 검수 독립성, quality criteria, 실제 결과의 artifact identity 결속은 유지한다.

- GPT 실행 identity는 `executionLine:GPT_SCHEDULED` + current `campaignId` + fixed `stream=A|B|C`를 유지하며 cross-generation/cross-stream 작업을 거부한다. 모든 단계 기록은 전체 Library 패킷·누적 검수기록과 각 review file ID+revision 또는 revision 불가 시 실바이트 SHA-256에 결속한다.
- GPT CREATE/R1은 기본 schema·difficulty enum·실제 production asset/SVG dependency·Golden/Negative provenance의 실제 파일/version과 판독 observation을 품질 기준으로 사용하되 GPT 전용 registry `archive/data/gpt-quality-calibration-registry-v2.json`을 사용한다. 추가 SHA는 최종 기술검사 또는 실제 불일치 진단에 한정한다.
- R3 artifact evidence는 open/changed/direct dependency targeted rows를 사용하고, 전 문항 Meta null/debt disposition은 `artifactDispositions={artifactSha,rows:[...]}`에 결속한다. R3는 변경·미해결·직접 영향 범위와 최종 구조 확인을 수행하되 전수 의미 재검이나 stage별 machine receipt는 만들지 않는다.
- GPT validator가 실제 호출되면 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line GPT_SCHEDULED --campaign-id <campaign> --stream <A|B|C>`를 명시하고 정확한 packet identity·실제 결과를 Library에 기록한다. 예약은 호출하지 않은 검사를 완료로 표시하지 않는다. 별도 Work/Codex 출고 담당은 batch 출고에 필요한 실제 final 검사 결과를 함께 보존한다.
- GPT 예약은 render나 Git publication을 수행하지 않는다. R3 완료 패킷과 실제 검사 결과는 Library에 보존한다. 별도 Work/Codex 출고 담당은 production JS·이미지·SVG만 일괄 push/main 병합하고 실제 출고 revision·원격 확인 결과를 기록한다. GPT 예약은 Codex 단계 receipt를 생성하지 않는다.


## Codex ownership clarification — 2026-10-07

When ROOT selects the actual-render route, Codex R3 owns six-case Archive Engine rendering, screen judgment and reviewer-bound receipt. ROOT waiver/static-route authority follows Execution §25. ROOT accepts the machine witness, SHA/coverage/receipt and performs publication/readback; ROOT does not repeat screen quality review. The detailed conveyor, absolute assignment packet, R1/R2 student-only isolation, item HOLD travel, validator retry after actual repair and ledger contracts are in `JS_Archive_2.0_Codex_Execution_v1.md` §§16–25. This clarification does not change GPT_SCHEDULED render/publication behavior or the qualityContractVersion.

## ROOT production-completion exceptions (CODEX)

Codex completion is verified production readiness, publication and remote readback. Execution §25 delegates capture/render waiver and bounded HOLD recovery/release decisions to ROOT without repeated user approval. R1/R2 valid full-input freezes, complete qid coverage, R3 JS/assets/SVG/structure integrity, zero unresolved item HOLD and SHA-bound technical closeout remain required. ROOT-directed static completion records ROOT_DELEGATED / ROOT_DIRECTED_STATIC_COMPLETE / NOT_RUN_ROOT_WAIVER; direct-user waivers retain their distinct authority and status. Unexecuted screens are NOT_RUN, never fabricated RENDER_PASS. General ROOT static/MAIN_DONE validators and stage consumers are implemented across locked roster grade/course/run; full and partial waiver evidence have separate honest case status. The read-only archive-codex-root-waiver-intake CLI verifies durable authority revision, exact evidence and remote bytes. Historical direct-user helpers retain their original scope. This operational clarification keeps the qualityContractVersion and GPT_SCHEDULED behavior.

## 2026-10-08 — DIRECT USER ASSIGNMENT AUTO-RELEASE HARD (2026-10-10 범위 명확화)

사용자가 해당 대상의 출시·등록·production publish·main 운영병합까지 맡겼다면(적용 가능한 기존 사용자 지시 포함), 작업자는 이미 승인된 범위의 실제 작업과 필요한 출시 검증·등록·publication·remote readback·기술 QA를 하나의 완료 목표로 책임진다. 동일한 출시 인증·운영병합의 재승인을 형식적으로 요구하지 않는다. 적용되는 R1/R2/R3와 validator/receipt·실제 렌더 또는 허용된 면제는 현재 artifact와 기존 유효 증거에 맞춰 수납하며, publication 단계에서 unchanged 시험지 전체를 다시 풀거나 검수하지 않는다.

단순히 ‘제작·수정·해설·Meta·시각자료·검수’를 요청했다는 이유만으로 전체 파이프라인을 자동 추가하지 않는다. 이미 승인된 출시·main 반영 지시(적용 가능한 기존 사용자 지시 포함)는 해당 변경 범위에서 유지한다. 최신 사용자 지시의 대상과 종료 조건이 우선한다. ‘이 qid만 수정’은 문항 범위를 한정하며, ‘패치·커밋·draft PR까지만’ 등 명시적 종료 조건이나 단계 분할·보류·제외 지시가 있으면 그 조건에서 끝낸다. 한정 수정은 변경 대상과 필수 직접 의존 부분의 필요한 검증 1회로 닫고, 실제 실패·추가 수정 후에만 영향 부분을 재검한다. 범위 밖 발견은 보고만 하며 확장은 사용자 승인을 받는다.

검증하지 않은 PASS, 실행하지 않은 렌더 PASS, 미등록·미병합 상태의 MAIN_DONE 또는 품질 게이트 임의 우회는 금지한다. 출시가 승인된 작업의 기술 장애는 허용된 경로로 복구하고 결과를 재조회하되, 물리적으로 닫지 못한 단계는 정확한 결손과 재개 위치를 기록한다.
