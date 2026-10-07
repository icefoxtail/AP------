# JS Archive 2.0 — Codex Execution Contract v1.1

status: CURRENT / CODEX EXECUTION LINE
updated: 2026-10-07
execution authority: 본 문서 + Common Quality Contract + 실제 current validator 구현
historical authority: Canary / Phase 10 / 5시험지 qualification 기록은 역사 자료이며 신규 실행 authority가 아니다.
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`
parent quality authority: `JS_Archive_2.0_Common_Quality_Contract_v1.md`

## 1. 목적

이 문서는 JS Archive 2.0의 **Codex 실행 라인만** 정의한다.
GPT 예약라인과 별개로 자체적으로 production MAIN_DONE까지 완결한다.

정상 생명주기:

```text
ROOT
→ CREATE
→ R1
→ R2
→ R3
→ actual RENDER
→ PUBLICATION
→ MAIN_DONE
```

ROOT는 routing과 기술 closure를 담당한다.
수학·Meta·Visual·source의 의미 품질 판단을 ROOT가 대신하지 않는다.

Archive 2.0 런타임 구현·개선·출력 경로 변경의 기술 closure에는 `../01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 반드시 함께 적용한다. 원본 기출의 Archive 1 직접 경로, 사용자 응답 속도, 저장소 장애·용량 초과 시 동작은 기능 추가와 리팩터링에서도 유지해야 하는 완료 조건이다. `node tools/check-archive2-runtime.cjs` 결과와 변경 흐름의 실제 브라우저 검증 없이 해당 런타임 변경을 MAIN_DONE으로 선언하지 않는다. 원본 시험지 source만 다루는 stage 검수의 절차를 이 규칙으로 대체하지 않는다.

## 2. ROOT

ROOT 책임:
- target/ownership/stage 결정
- 필요한 worker spawn
- stage artifact/evidence/receipt 인계
- technical continuation routing
- R3 actual render 경로 준비·worker 인계 및 receipt 기술 수납
- target-only publication
- Git merge/readback
- MAIN_DONE closure

ROOT 금지:
- 문제 직접 풀이로 worker verdict 대체
- whole-exam Meta 재판정
- SVG 의미 품질을 직접 대신 심사
- stage PASS를 임의 강제
- 근거 없이 같은 PASS/validator를 반복 실행
- R3 화면을 다시 열어 페이지별 품질 판정을 반복

정상 stage 전환에서는 현재 target과 필요한 authority만 1회 읽고 바로 진행한다.

## 3. worker 구조

기본 품질 역할:
- `archive_create`
- `archive_r1`
- `archive_r2`
- `archive_r3`

기술 continuation이 실제 생긴 경우에만:
- `archive_master`

새 `(examUid, stage)`는 `fork_turns="none"`인 fresh worker session을 기본으로 한다. ROOT의 누적 답/해설·이전 시험지 이력을 상속하지 않고 필요한 authority와 현재 stage 입력만 compact하게 전달한다. 같은 stage repair는 기존 session에서 이어간다. 첫 CREATE spawn 전 실제 custom role/config의 resolved model/effort가 `gpt-6-luna / high`인지 확인한다.
같은 시험지의 같은 stage 안에서 repair/재확인/closure는 기존 session을 이어간다.
같은 시험지의 동일 stage를 두 worker가 동시에 수정하지 않는다.
CREATE/R1/R2/R3 각각 동시 담당 1개를 유지한다. CREATE A 인계 후 새 CREATE B를 시작하고 downstream 역할이 비면 다음 시험지를 즉시 받는다. CREATE 5개 병렬 실행은 금지하며 concurrency 5는 상한이다.

## 4. CREATE

CREATE는 전 qid의 Archive 완제품 후보를 만든다.

- source identity / content / choices / answer
- QUESTION_LAYOUT exact parity
- QUESTION_LAYOUT은 `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`의 AUTO-FIRST와 의미 경계 기준을 qid별로 적용한다. 실제 엔진에서 자연스러운 흐름은 KEEP하고, 독립된 수식 정의·조건·질문 전환이 붙어 읽기 어려운 경우 완결 수식 바깥에서만 최소 개행한다. 글자 수/정규식 기반 일괄 수정은 금지한다. HTML placeholder는 MathJax `$...$` 구간 밖에 둔다.
- 사용자가 예시 qid를 제시해도 전 qid 독립 검토를 생략하지 않는다. 각 qid의 `beforeDisposition`, `finalDisposition`, defect/KEEP 근거를 기록한다. 실제 exam engine의 화면 판정은 R3가 담당하며 CREATE의 정적 판정과 구분한다.
- 학생용 작은칠판 solution
- Meta Foundation
- difficulty 4필드
- visual disposition + 필요한 problem/solution asset
- engine-safe final JS
- artifact/evidence binding

작은칠판:
- 선생님이 실제로 말로 설명할 부분을 필요한 위치에 문장으로 적는다.
- 계산의 본체는 실제 수식이다.
- `식 설정 → 식 변형 → 중간값 → 대입 → 계산 → 최종값`이 위에서 아래로 추적 가능해야 한다.
- 설명문으로 중간 수식을 대신하지 않는다.
- 식만 나열해 설명이 사라져도 안 된다.

새 evidence/PASS:
- `qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`
- applicable Golden provenance
- qid별 `smallBoardContinuityStatus=PASS`
- qid별 final solution `solutionSha256`

실제 final JS에 필수 Meta/difficulty가 없는데 evidence만 PASS라고 쓰면 안 된다.

## 5. R1

R1은 전 qid를 한 번 깊게 독립 검수하고 동일 final artifact를 통합 봉인한다.

확인:
- source identity
- independent math / answer / answer cardinality
- QUESTION_LAYOUT
- SOLUTION_LAYOUT
- SMALL_BOARD / BOARD_FLOW_CONTINUITY
- Meta / difficulty
- Visual necessity / semantic parity

CREATE verdict를 자동 승계하지 않는다.
수정은 same-stage 최소수정하고 changed qid + direct dependency만 다시 확인한다.
content/choices/problem visual이 바뀌면 이전 independent freeze가 여전히 유효한지 판단한다.

PASS 시 answer·solution·decisiveStep·Meta·visual·evidence가 동일 finalArtifactSha를 가리켜야 한다.

## 6. R2

현재 Codex R2는 **전 qid blind answer sweep**을 유지한다. 범위 축소는 별도 명시 지시가 있을 때만 한다.

- current final source에서 완전한 student input을 추출한다.
- content / choices / problem visual만 먼저 공개한다.
- stored answer/solution 공개 전에 전 qid independent answer를 freeze한다.
- freeze 뒤 MATCH/MISMATCH/SUSPICIOUS를 비교한다.
- MATCH는 빠르게 닫는다.
- mismatch/suspicious/open/high-risk locus만 깊게 처리한다.
- R1 전체 4축을 다시 돌지 않는다.

freeze 전 answer/solution 노출 또는 필요한 problem visual 누락이면 해당 attempt는 실패 기록으로 남기고 clean blind session으로 다시 수행한다.

## 7. R3

R3는 targeted release 및 actual render owner다. 의미 재검 범위는 changed/open/direct dependency로 제한하고, 실제 출력 coverage는 전 qid와 마지막 문항을 포함한다.

확인:
- open finding
- changed locus
- direct dependency
- locked scope
- release integrity

whole-exam semantic 재검을 하지 않는다.

다만 final artifact 전체의 구조적 integrity는 scan한다.
- JS parse
- 필수 Meta/difficulty physical fields 또는 explicit canonical debt
- choices engine-label 오염
- TeX control escape/TAB 손상
- asset refs
- artifact/evidence SHA binding

정상 종료 상태:
`R3_RELEASE_READY`

## 8. artifact gate

신규 Codex 작업은 아래 옵션으로 actual-artifact gate를 강제한다. evidence에서 qualityContractVersion을 누락하거나 오타로 기입하면 FAIL이다. 역사 검수만 명시적 legacy 경로를 사용할 수 있다.

```text
node archive/tools/archive-stage-validator.mjs --stage <CREATE|R1|R2|R3> --exam <working-js> --evidence <evidence-json> --quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
```

임시 패키지에서 검사할 때는 `--asset-root <assets/ 디렉터리의 부모>`를 추가한다. 임시 자산 대신 같은 이름의 오래된 production 자산을 검사하지 않는다.

기계 gate:
- 실제 final JS parse / qid binding
- Meta 필수 field 물리 존재
- 허용 null PT/TPL debt의 명시적 evidence
- difficulty 4필드
- choices에 ①~⑤ 중복 삽입 여부
- TAB/form-feed 등 control-character 손상
- choices가 있는 문항의 answer 존재
- CREATE/R1 calibration provenance
- CREATE/R1 small-board verdict와 actual solution SHA-256 결속

validator는 복수정답 의미판정, 해설 논리, Meta 의미분류, SVG 수학정확성을 대신 판단하지 않는다.

## 9. actual RENDER

R3가 구조·targeted 검수를 끝낸 final artifact를 공식 Archive Engine에서 직접 render하고 판정한다. ROOT는 R3 보고서·machine witness·SHA·coverage·receipt 계약만 수납한다. R3 generic validator PASS와 actual RENDER_PASS는 별도 gate다.

확인 범위:
- 문제/해설/정답 화면 정상 로드
- MathJax/TeX 표시
- problem image / solutionImage / SVG decode
- clipping / overflow / 심각한 label collision
- 학생이 읽을 수 없는 크기 또는 깨진 asset

render는 품질 전수 재검 단계가 아니다.
render defect가 확인되면 해당 locus만 pinpoint repair → 필요한 stage evidence rebind → 해당 render만 다시 확인한다.

render 성공 상태:
`RENDER_PASS`

## 10. PUBLICATION / MAIN_DONE

RENDER_PASS 뒤 ROOT가 publication을 직접 닫는다.

1. latest main 1회 조회
2. 같은 시험지 production canonical overlap/drift 확인
3. 실제 충돌 locus만 최소 처리
4. 검증된 final JS + 필요한 final asset만 production canonical path에 반영
5. 대상 파일만 stage
6. 시험지 1건 = 독립 publication commit 1건
7. `git add .` / `git add -A` 금지
8. force push 금지
9. non-force push / PR 또는 허용된 clean merge 경로
10. remote main production target blob + asset reference readback
11. local/working HEAD와 origin/main 최종 일치 확인
12. MAIN_DONE closeout receipt 결속

R1/R2/R3를 publication 단계에서 다시 수행하지 않는다.

## 11. MASTER

MASTER는 신규 production target을 선택하지 않는다.

실제 durable continuation이 있을 때만:
- `firstMissingClosureStep`
부터 exact technical closure를 처리한다.

MASTER는 전체 시험지나 이전 quality stage를 rewind하지 않는다.
artifact bytes가 바뀌면 changed locus만 해당 stage worker/canonical 기준으로 최소 재확인 후 evidence를 rebind한다.

## 12. Golden

H1 현재 고정 Golden:
- `25_매산여고_2학기_중간_고1_기출.js`
- `25_효천고_2학기_중간_고1_기출.js`
- `25_제일고_2학기_중간_고1_기출.js`

Golden은 학생노출 해설/조판/Visual quality floor다.
source truth 또는 Meta/difficulty authority가 아니다.
현재 known exception: 제일고 q18 visual.

다른 학년/과목도 `archive/data/codex-quality-calibration-registry-v2.json`의 동일한 고정 세 Golden을 학생 노출 표현 floor로 사용한다. 해당 교과의 공식·풀이 방법·Meta·difficulty는 current canonical에서 별도 판단한다. 현재 처리 중인 target이나 이전에 제작한 결과를 임의로 Golden으로 승격하지 않는다.

## 13. NONSTOP / 최소검증

- 오류 때문에 line 자체를 중단하지 않는다.
- current target에서 해결 가능한 것은 fresh state 1회 → 최소수정 → materially different safe path 최대 1회 → closure.
- 기술적으로 못 닫으면 exact continuation을 남기고 MASTER가 이어받는다.
- 동일 PASS/validator/readback의 변화 없는 반복은 금지한다. 실제 수정·실패 후 필요한 재검증은 §21에 따른다.
- stage 품질은 깊게, ceremony는 최소화한다.

## 14. 성공 기준

현재 승인된 cohort에서:
- R1 뒤 R2/R3에서 새 기본 source/schema/Meta/difficulty/visual-missing 결함 0
- answer/solution/decisiveStep identity contradiction 0
- small-board 기본 continuity defect 0
- required visual missing 0
- stale artifact/evidence binding 0
- RENDER_PASS 뒤 target-only publication 성공
- MAIN_DONE 뒤 remote main parity 확인

이 기준을 만족한 뒤에만 R2 축소나 더 큰 cohort 확장을 검토한다.

## 15. evidence / actual render / closeout 구현 계약

CREATE/R1 `goldenCalibrationSet`은 실제 registry sample 경로 2~3개다. `goldenCalibration.samples` 각 항목에 `path`, 파일 raw SHA-256 `sha256`, 서로 다른 대표 문항 최소 두 개의 `items[{qid,solutionSha256,observation,axes?,visualSha256?}]`를 기록한다. 선택 sample에 solutionImage가 있으면 최소 한 대표 문항은 실제 SVG 판독과 `visualSha256` 결속을 포함한다. `goldenCalibration.negativeSample={path,sha256,observation}`는 registry에 승인된 Negative README를 직접 읽은 근거다. 해시들은 `sha256:` prefix 없는 64자리 hex다. 파일명/boolean만 적거나 작업 후 읽고 preflight로 소급하지 않는다.

전체 Meta disposition은 `artifactDispositions={artifactSha,rows:[{qid,metaDebtFields,metaDebtReason}]}`에 현재 artifact SHA로 결속한다. R2/R3는 R1의 봉인 근거와 actual current Meta 값이 유지되는 범위에서 이를 인계하고, 수정된 Meta locus만 필요한 worker가 재봉인한다. R3 targeted `rows`에 전수 qid를 억지로 추가하지 않는다.

`consumeValidationPass`는 신규 계약 R3에서 MAIN이 아닌 RENDER로 전환한다. legacy state routing은 역사 호환용이다. ROOT는 렌더 결함을 품질 담당 worker에게 인계하며 SVG/수학 의미를 직접 재판정하지 않는다.

`validateCodexRenderReceipt` / `consumeCodexRenderPass` 입력:
- receipt: `qualityContractVersion`, `status:RENDER_PASS`, `artifactSha`, `loadedJs:{path,sha256}`, `r3Validation:{path,sha256}`, `cases[]`
- expected `artifactSha`, 원 artifact에서 추출한 `assets[{ref,sha256}]`, 전 qid `qids[]`, 해당 파일을 실제 읽을 수 있는 `root`
- six cases: `exam/desktop`, `exam/mobile`, `sol/desktop`, `sol/mobile`, `ans/desktop`, `ans/mobile`
- 각 case: `status:PASS`, 실제 `viewport:{width,height}`, `captures[{image:{path,sha256},qids[]}]`, `loadedAssets[{ref,sha256,file:{path,sha256}}]`, `mathJaxStatus`, `layoutReviewStatus`, `assetDecodeStatus`

실제 browser/engine에서 로드한 JS·자산 및 화면 capture에만 이 receipt를 작성한다. static PNG나 정적 검사 결과를 실제 render PASS로 가장하지 않는다. 모든 case에서 전 qid와 마지막 문항을 capture coverage에 포함한다. screenshot hash나 covered qid 목록 자체가 의미 품질 심사를 대신하지 않는다. R3 reviewer가 실제 화면의 표시/잘림/크기를 판정하고 reviewer identity를 receipt에 결속한다. ROOT는 화면을 다시 열지 않고 해당 판정과 machine witness의 기술 결속을 확인한다. candidate SVG와 같은 URL의 오래된 production SVG를 혼동하지 않도록 실제 로드한 파일 SHA를 expected asset set과 대조한다. rerender 시 바뀐 locator/자산이 영향을 주는 case/viewport만 재확인한다.

최소 physical report/capture는 `archive/analysis/<examUid>/render/` 등 승인된 영구 evidence 위치에 보존한다. local-only 임시 파일을 삭제한 뒤에도 MAIN_DONE 근거를 재현할 수 있게 한다. 자산 refs는 Git blob SHA와 파일 raw SHA-256 계약을 구분하며, publication에서 bytes가 달라지면 예전 RENDER_PASS를 그대로 사용하지 않는다.

`validateCodexMainDoneReceipt` / `consumeCodexMainDone` 입력 receipt는 `status:MAIN_DONE`, 동일 contract/artifact SHA, `productionPath`, `remoteMainSha`, physical `renderReceipt:{path,sha256}`를 포함한다. helper는 render receipt를 소비하고, local HEAD = origin/main, remote production blob 및 모든 final asset SHA parity를 확인한다. origin/main은 ROOT가 실제 remote readback한 ref이어야 한다. 문서상 상태 문자열만 MAIN_DONE으로 기록하지 않는다.

Actions는 CURRENT를 기본으로 강제한다. 역사 검수는 dispatch의 `quality_contract:LEGACY` 또는 `/archive-stage-validate-legacy` 명령으로만 명시적으로 요청한다. 현재 작업이 실패했다고 legacy로 전환하지 않는다.

신규 evidence에는 `executionLine:CODEX` 또는 `executionLine:GPT_SCHEDULED`를 명시한다. Codex CURRENT CLI는 CODEX를 강제하며, 공통 qualityContractVersion만 보고 GPT R3를 RENDER로 전환하지 않는다. render/MAIN_DONE receipt 및 저장된 R3 validation report도 executionLine:CODEX로 결속한다. GPT 예약 라인의 MAIN handoff는 유지한다.

ROOT의 신규 job state는 `buildStageState({stage:"CREATE",qualityContractVersion:"JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",executionLine:"CODEX"})`로 시작한다. 소비 helper는 계약을 다음 state에 유지하고, legacy 보고서로 downgrade하거나 다른 실행 라인의 PASS를 인계하는 것을 거부한다.

동일 계약/라인 정보는 durable continuation에도 보존한다. MASTER technical resume에서 계약 버전을 잃고 legacy closure를 소비하지 않는다.

### legacy level 타입 정정 — 2026-10-06

난이도 정본 v1.3의 legacy `level`은 `하 | 중 | 상` 문자열이며 기존 값을 보존한다. `difficultyBucket`의 `1..5` 숫자와 분리한다. validator에 맞추려고 legacy level을 `1/2/3`으로 변환하지 않는다. qualification 첫 CREATE에서 정상 문자열을 거부한 숫자-only gate는 검사기 오류였다. 실패 attempt를 보존하고 그 오류를 바로잡으며, 이미 숫자로 변환한 값은 worker가 원래 문항별 값을 복원한다. bucket·confidence·boundary·compatibility의 독립 판정 및 나머지 gate는 완화하지 않는다.


## 16. RUN_BOOTSTRAP — 공통 실행 경로를 먼저 닫는다

ROOT는 첫 spawn 전에 최신 main, AGENTS, 본 CURRENT, Common Quality Contract, calibration registry와 실제 validator 구현을 최초 1회 확인한다. 이후에는 새 지시·계약 충돌·main drift·실제 오류에 필요한 항목만 조회한다. 종료된 Canary/qualification을 재개하거나 그 PASS를 자동 승계하지 않는다.

- 사용자 manifest로 roster를 고정하고 examUid, input raw SHA-256, production blob/raw SHA, existing evidence/receipt를 기록한다. 원본 묶음과 최신 입력은 보존한다.
- 깨끗한 worktree의 absolute root와 actual Git root/HEAD를 고정한다. primary checkout의 unrelated 변경을 worker 작업 경로로 사용하지 않는다.
- custom role/config의 실제 resolved model/effort가 `gpt-6-luna / high`인지 첫 spawn 전에 확인한다.
- 공식 Archive Engine의 승인된 HTTP(S) URL/session, candidate 전달 경로, temporary asset 로드 경로와 witness/capture 수단을 확인한다. 빈 tab 목록만으로 engine capability가 없다고 단정하지 않는다. 알려진 승인 URL이 있으면 공식 경로를 확인한다.
- browser/runtime가 명시적으로 거부한 동작은 우회하지 않는다. 공통 접근 blocker는 run 수준에서 1회 기록하고 exact missing URL/session/capability를 요청한다. 동일 blocker를 시험지마다 재시도하거나 새로운 콘텐츠 HOLD로 만들지 않는다. 독립 CREATE/R1/R2는 계속 처리할 수 있으나 render/publication은 완료로 세지 않는다.
- bootstrap은 renderer/witness 구현을 새로 만들었다는 선언이 아니다. 구현되지 않은 기능은 `IMPLEMENTATION_REQUIRED`로 구분한다.

## 17. STAGE CONVEYOR — slot과 인계를 함께 기록한다

ROOT + CREATE/R1/R2/R3의 5개 역할을 기본 상한으로 유지한다. 각 stage는 동시에 시험지 1개만 처리한다. 이미 동작 중인 role slot이 있으면 추가 동일-role spawn을 하지 않는다.

`CREATE A → R1 A`가 가능하면 즉시 인계하고 새 CREATE B를 시작한다. `R1 A → R2 A` 뒤 R1은 대기 중인 B를 즉시 받는다. 다음 role이 바쁘면 완료 artifact를 불변 보존하고 role이 비는 첫 event에서 인계한다. 전체 cohort 완료를 기다리는 barrier는 금지한다.

- 매 완료 event에서 `completed artifact → next eligible stage → freed slot → next roster target`을 한 번에 결정한다.
- 새 exam/stage는 fresh `fork_turns="none"`; 동일 exam/stage repair·evidence 보정·closure는 기존 session을 이어간다.
- clean qid 재검이 필요한 경우 현재 동일-role worker를 durable checkpoint 후 idle/interrupt 상태로 두고 재검 session을 실행한다. 동일 역할의 동시 검수/수정은 금지한다.
- repair는 원 stage owner가 수정프로토콜에 따라 닫는다. 다른 author가 필요한 경우 ROOT가 범위와 ownership을 명시하고 해당 role slot을 확보한다.
- MASTER는 실제 durable technical continuation의 firstMissingClosureStep만 소비한다. 정상 인계·경로 조회·blind 재검을 MASTER로 보내지 않는다.

## 18. ASSIGNMENT PACKET — 상대 경로 추측 금지

모든 worker assignment에는 다음 기계 필드를 전달한다. enum/필드명은 실제 helper schema에 맞추고 미구현 상태명을 runtime PASS로 소비하지 않는다.

```json
{
  "runId": "...", "examUid": "...", "stage": "R1",
  "qualityContractVersion": "JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
  "executionLine": "CODEX", "worktreeRootAbsolute": "...",
  "workingJsAbsolute": "...", "assetRootAbsolute": "assets/의 실제 부모",
  "evidenceRootAbsolute": "...", "productionRelativePath": "...",
  "expectedHead": "...", "artifactRawSha256": "...",
  "validatorRawBufferBlobSha1": "...", "gitCleanFilterBlobSha1": "...",
  "allowedQids": [], "allowedFields": [], "studentBundleAbsolute": "...",
  "studentBundleSha256": "...", "requiredAssets": []
}
```

worker의 첫 동작은 absolute path 존재·actual Git root/HEAD·후보 raw SHA 확인이다. 경로가 다르면 source-batch/production/옛 analysis를 임의 대용하지 않는다. ROOT가 기술 경로를 바로잡고 같은 session에서 재개한다. 출력 evidence의 absolute 위치와 실제 hash를 부모에게 반환한다. compact 인계에도 전체 SHA를 사용하며 `...` 축약이나 구분 공백을 넣지 않는다.

## 19. BLIND INPUT ISOLATION — R1과 R2 공통

ROOT는 검증된 safe extractor를 실행·인계할 수 있으나 문항을 직접 풀거나 의미 판정을 하지 않는다. extractor는 current final JS의 실제 bytes에서 student-visible fields만 whitelist로 추출한다. 지문·선택지·표/도형·inline visual·모든 참조 자산을 포함하고 answer/solution/solutionImage/decisiveStep/Meta/upstream verdict는 pre-freeze bundle에서 제외한다. 실제 renderer가 사용하는 학생 필드가 추가되면 whitelist와 parity 계약을 함께 갱신한다.

- bundle은 source raw SHA, qid별 student payload SHA, 참조 자산 path/SHA를 결속한다. 모든 student field/reference가 source와 일치하는지 freeze 전에 확인한다.
- pre-freeze assignment와 상태 요약에도 upstream 답·풀이·답을 유추하는 hold reason을 포함하지 않는다. worker는 raw JS의 head/Get-Content/검색으로 구조를 확인하지 않는다.
- 모든 필요한 자산을 실제 열어 본 뒤 전 qid answer/reasoning freeze를 durable 파일로 기록한다. 미결정 답을 결정 답으로 소급하지 않는다.
- postfreeze extractor는 freeze 이후 해당 qid의 stored answer/solution만 공개한다. freeze path/SHA와 disclosure 순서를 evidence에 남긴다.
- freeze 전 답 노출·그림 누락으로 해당 답을 독립 결정할 수 없었던 attempt는 실패로 보존하고 영향 qid만 fresh clean session으로 검수한다. 완전한 입력으로 freeze한 계산/표기 오류는 같은 session에서 postcomparison adjudication한다.
- student body가 바뀌면 해당 worker가 old/current payload와 asset SHA를 비교해 freeze validity를 판정한다. 줄바꿈·의미 불변 punctuation은 근거를 기록해 재사용할 수 있다. 수학 조건·보기·결정적 visual이 바뀌어 freeze가 무효이면 영향 qid만 fresh blind 검수한다.

## 20. ITEM_HOLD TRAVEL — 원본 → 최소수정 → 직접 대체

CREATE의 item HOLD를 시험지 최종 완료로 집계하지 않는다. 각 stage는 전체 denominator를 검수하고 held qid를 다음 독립 검수에 운반한다. generic validator가 HOLD row 때문에 FAIL이면 `PASS`를 만들지 않고 exact issue/coverage를 기록한다. 다른 serialization/hash/debt 결함은 먼저 수리해 실제 item hold와 구분한다.

1. 로컬 원본 PDF/scan과 필요한 답안 evidence를 찾아 source truth를 확인한다.
2. `수정프로토콜.md`의 REPAIR_BEFORE_HOLD / ONE_SEMANTIC_LOCUS_REPAIR / AUDITED_SOURCE_REPAIR를 적용하고 worker가 changed locus를 재검한다. 근거 없는 조건 추가로 정답을 만들지 않는다.
3. R1/R2는 upstream HOLD를 정답으로 삼지 않고 student bundle에서 독립 재판정한다.
4. R2 뒤에도 true item HOLD가 남고 최소복구가 불가능하면 `Archive_Final_Item_Direct_Replacement_v1.md`에 따라 held qid만 직접 대체한다. 사용자 허용 custom author role을 사용하고 임의 새 role/ALIVE 전면 pipeline을 열지 않는다.
5. replacement는 solution-first·실제 오답 경로·5 choices 전수·fresh Meta·non-target invariance를 닫는다. student body 교체로 무효인 qid만 새 clean R1/R2 freeze를 수행한다.
6. 기존 stage owner가 unchanged qids를 재사용하고 current full evidence를 재결속·검증한다. `itemHoldCount=0` 이후 R3로 간다. R3 actual render 이전 publication은 금지한다.

HOLD 유지에는 decisiveMissingFacts, alternateEvidenceChecked, fullPageLookupResult, repairAttempted, whyDeterministicClosureImpossible, nextRequiredEvidenceOrCapability가 필요하다. 콘텐츠 item hold와 run 공통 browser/receipt blocker는 서로 다른 원인으로 기록한다.

## 21. HASH / VALIDATOR / EVIDENCE — 실패 후 필요한 검증 허용

`정상 완료 후 validator 1회`는 첫 FAIL 이후 재검증을 금지하는 횟수 제한이 아니다. 실제 오류를 수리한 새 revision은 같은 stage session에서 필요한 validator를 다시 실행한다. 이미 위임된 최소 수정·정상 오류 복구 범위이면 ROOT가 자율 인계하고 같은 실행 여부를 반복 질문하지 않는다. 변화 없는 동일 PASS 재실행·무근거 retry loop는 금지한다.

| 이름 | 의미/소비처 |
|---|---|
| artifactRawSha256 | 실제 working file bytes의 SHA-256 |
| validatorRawBufferBlobSha1 | actual validator `gitBlobSha(bytes)`의 blob-header + raw bytes SHA-1 |
| gitCleanFilterBlobSha1 | Git attributes/clean filter가 적용된 index/production blob SHA-1 |
| solutionSha256 | 파싱된 actual solution 문자열의 SHA-256 |
| calibration gate digest | 해당 gate schema가 요구하는 `sha256:` prefix 포함/미포함 형식 |

서로 다른 digest를 같은 artifactSha 이름으로 바꿔 붙이지 않는다. runtime/helper의 실제 계약을 확인해 소비 필드를 결정한다. promotion의 line-ending/filter 차이가 있으면 raw→index→remote byte mapping을 기록한다. semantic/학생 필드/asset bytes 변화가 있으면 해당 evidence/render의 유효성을 worker가 판단한다.

- evidence builder는 실제 preflight sample/Negative binding, 모든 선택 Golden item의 필요한 solutionImage 판독·visual SHA, actual solution SHA, freeze/adjudication, full artifactDispositions의 Meta debt를 schema에 맞게 조립한다.
- R2/R3는 current candidate와 일치하는 기존 Meta debt references를 인계한다. targeted rows에 unrelated qids를 늘려 full semantic review를 다시 만들지 않는다.
- validator FAIL은 원 보고서·입력 evidence SHA·명령·actual artifact/asset-root·issues를 불변 보존한다. correction 기록 뒤 필요한 validator만 재실행한다. path typo처럼 validation 진입 전 종료한 invocation은 validation 완료로 세지 않는다.
- 늦게 발견한 Golden/Negative 판독 누락은 소급 preflight로 기록하지 않는다. 실패 provenance를 남기고 실제 sample read/preflight 뒤 변경 locus만 correction-review한다.
- 공통 helper 자동 조립·변환이 아직 구현되지 않았으면 해당 기능은 IMPLEMENTATION_REQUIRED다. 문서 갱신만으로 helper 구현 PASS를 선언하지 않는다.

## 22. ACTUAL RENDER RECEIPT — 화면 판정과 기술 수납 분리

R3는 desktop/mobile × exam/sol/ans 6 cases를 공식 engine에서 실행한다. case별 실제 viewport, loaded JS SHA, 필요한 actual asset decode, MathJax, qid/last-item capture coverage, 줄바꿈·크기·clipping·overflow 판정과 R3 reviewer identity를 기록한다. 기존 유효 actual receipt가 exact unchanged 범위에서 증명되면 재사용하고 영향 case/화면만 재검한다.

- machine witness는 실제 engine의 load/decode/capture event에서 만들어야 한다. static decode, screenshot hash, 문서상 PASS만으로 실제 render를 대체하지 않는다.
- 공통 asset set과 mode별 실제 rendered/decoded asset set을 구분한다. 현재 closeout helper의 요구사항과 actual engine behavior가 맞지 않으면 `ENGINE_RECEIPT_CONTRACT_BLOCK`으로 기술 결속을 수리한다. exam에서 decode한 자산을 sol/ans에서도 decode했다고 복사하지 않는다. helper 완화·engine preload·witness 변경은 별도 실제 구현/검증 scope다.
- R3 generic validator PASS는 RENDER_PASS가 아니다. no captures/NOT_RUN 상태에서는 releaseIntegrity/RENDER_PASS를 강제하지 않는다.
- ROOT는 보고서·machine witness·SHA·coverage·receipt만 검증한다. 화면을 다시 열어 재심사하지 않는다. 기술 결속 오류만 해당 worker/session으로 돌려보낸다.

## 23. DURABLE LEDGER / 종료 보고

run ledger에 examUid/stage/sessionId/role, resolved model/effort, input/output artifact hashes, ownership, validator attempts, freeze/disclosure 순서, repair locus, receipt path/SHA, publication/remote readback을 event별 기록한다. 완료 event는 다음 stage dispatch와 slot 해제를 함께 기록한다.

- `MAIN_DONE`은 production 반영 + remote readback + closeout helper 성공 후에만 집계한다.
- terminal HOLD는 해당 시험지의 가능한 repair/recovery를 실제 소진한 근거와 exact missing input/capability가 있어야 한다. 보존된 WAIT/CONTINUATION 및 CREATE item HOLD를 최종 종결로 오집계하지 않는다.
- 공통 render blocker가 있으면 동일 blocker를 N개 독립 실패처럼 새로 발견하지 않는다. 각 candidate의 재개 SHA/완료 stage를 공통 blocker ID에 연결한다.
- 사용자 설정에 따라 진행 출력은 시험지 종결 시 compact 1건으로 제한한다. 최종 보고는 roster별 production/MAIN_DONE/HOLD, latest verified main SHA, 핵심 수정, 남은 재개 조건, spawn/MASTER, 재사용/재작업 범위와 계측값을 포함한다.
- spawn은 신규 session만 세고 same-session followup/interrupt/resume은 별도 event로 센다. MASTER는 별도 tally다. token/비용/시간이 제공되지 않으면 NOT_AVAILABLE로 적고 추정치를 실제 계측값처럼 보고하지 않는다.

## 24. 실운영 수납 오류의 최소 복구

1. **검증 결과 형식:** raw generic `--json` 결과를 그대로 보존한다. `status:PASS`만 가진 custom summary 또는 common-only report를 현재 V2 artifact contract PASS로 수납하지 않는다. `ok/validatorMode/stage/examUid/artifactSha/qualityContractVersion/executionLine/common/active artifactContract`와 고정 전체 qid 분모를 확인한다.
2. **기술 결속 복구:** 위 결속이 실제로 실패했을 때만 해당 stage의 기존 owner가 증거와 valid freeze의 적용 범위를 확인해 최소 동기화하고 필요한 normal validator를 다시 실행한다. unchanged 문제를 다시 풀거나 학생 body에 영향 없는 변경으로 새 blind session을 만들지 않는다. 원 report·실패·correction provenance를 보존한다. ROOT는 물리 경로/필드 alias/SHA 전송만 정정하며 의미 판정은 worker가 수행한다.
3. **Git 전송 바이트:** production 자산이 local witness와 같아도 Git index/remote가 같은 raw bytes인지 별도로 확인한다. stat cache와 autocrlf로 기존 SVG·JS의 remote SHA가 달라질 수 있다. 필요한 경로만 명시적으로 raw bytes에 결속해 stage하고 index raw SHA를 확인한 뒤 publish한다. 생성/수정/검수된 JS·SVG의 의미나 source artifact를 이 전송 복구 과정에서 바꾸지 않는다. 긴 Windows 경로의 remote readback은 revision/path 모호성이 없는 Git blob 읽기를 사용한다.
4. **사용자 지시의 run별 예외:** 실제 캡처 요건을 면제하는 명시적 사용자 지시가 있으면 지시 원문·고정 roster·범위·SHA를 별도 receipt로 보존한다. `renderStatus:NOT_RUN_USER_WAIVER`, `completionBasis:USER_DIRECTED_STATIC_COMPLETE`인 별도 static/MAIN_DONE gate를 사용하고 normal `RENDER_PASS` 경로를 완화하지 않는다. complete R1/R2, R3 JS·자산·구조 integrity, zero item HOLD, production 및 remote parity는 유지한다. 이 run의 예외가 다른 run의 기본 render 요건으로 자동 전파되지 않는다.
5. **수납 후 재개:** 역할 slot은 정상 closure에서 즉시 해제한다. 내용 수정이 없는 receipt 전송 오류는 ROOT가 항목별로 정정하고 실제 helper가 소비한 뒤 완료를 기록한다. 새로운 stage 품질 판단이 필요한 경우 해당 owner의 같은 session으로 되돌린다.
