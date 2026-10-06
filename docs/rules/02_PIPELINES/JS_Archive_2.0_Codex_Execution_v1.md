# JS Archive 2.0 — Codex Execution Contract v1

status: CURRENT / CODEX EXECUTION LINE
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

## 2. ROOT

ROOT 책임:
- target/ownership/stage 결정
- 필요한 worker spawn
- stage artifact/evidence/receipt 인계
- technical continuation routing
- R3 이후 actual render
- target-only publication
- Git merge/readback
- MAIN_DONE closure

ROOT 금지:
- 문제 직접 풀이로 worker verdict 대체
- whole-exam Meta 재판정
- SVG 의미 품질을 직접 대신 심사
- stage PASS를 임의 강제
- 같은 PASS/validator를 반복 실행

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

다음 qualification 동안 R2는 **전 qid blind answer sweep**을 유지한다.

- current final source에서 완전한 student input을 추출한다.
- content / choices / problem visual만 먼저 공개한다.
- stored answer/solution 공개 전에 전 qid independent answer를 freeze한다.
- freeze 뒤 MATCH/MISMATCH/SUSPICIOUS를 비교한다.
- MATCH는 빠르게 닫는다.
- mismatch/suspicious/open/high-risk locus만 깊게 처리한다.
- R1 전체 4축을 다시 돌지 않는다.

freeze 전 answer/solution 노출 또는 필요한 problem visual 누락이면 해당 attempt는 실패 기록으로 남기고 clean blind session으로 다시 수행한다.

## 7. R3

R3는 targeted release owner다.

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

R3가 release-ready가 된 final artifact만 실제 engine render한다.

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
- 동일 PASS/validator/readback 반복 금지.
- stage 품질은 깊게, ceremony는 최소화한다.

## 14. 성공 기준

qualification cohort에서:
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

실제 browser/engine에서 로드한 JS·자산 및 화면 capture에만 이 receipt를 작성한다. static PNG나 정적 검사 결과를 실제 render PASS로 가장하지 않는다. 모든 case에서 전 qid와 마지막 문항을 capture coverage에 포함한다. screenshot hash나 covered qid 목록 자체가 의미 품질 심사를 대신하지 않는다. ROOT가 실제 화면의 표시/잘림/크기를 확인한다. candidate SVG와 같은 URL의 오래된 production SVG를 혼동하지 않도록 실제 로드한 파일 SHA를 expected asset set과 대조한다. rerender 시 바뀐 locator/자산이 영향을 주는 case/viewport만 재확인한다.

최소 physical report/capture는 `archive/analysis/<examUid>/render/` 등 승인된 영구 evidence 위치에 보존한다. local-only 임시 파일을 삭제한 뒤에도 MAIN_DONE 근거를 재현할 수 있게 한다. 자산 refs는 Git blob SHA와 파일 raw SHA-256 계약을 구분하며, publication에서 bytes가 달라지면 예전 RENDER_PASS를 그대로 사용하지 않는다.

`validateCodexMainDoneReceipt` / `consumeCodexMainDone` 입력 receipt는 `status:MAIN_DONE`, 동일 contract/artifact SHA, `productionPath`, `remoteMainSha`, physical `renderReceipt:{path,sha256}`를 포함한다. helper는 render receipt를 소비하고, local HEAD = origin/main, remote production blob 및 모든 final asset SHA parity를 확인한다. origin/main은 ROOT가 실제 remote readback한 ref이어야 한다. 문서상 상태 문자열만 MAIN_DONE으로 기록하지 않는다.

Actions는 CURRENT를 기본으로 강제한다. 역사 검수는 dispatch의 `quality_contract:LEGACY` 또는 `/archive-stage-validate-legacy` 명령으로만 명시적으로 요청한다. 현재 작업이 실패했다고 legacy로 전환하지 않는다.

신규 evidence에는 `executionLine:CODEX` 또는 `executionLine:GPT_SCHEDULED`를 명시한다. Codex CURRENT CLI는 CODEX를 강제하며, 공통 qualityContractVersion만 보고 GPT R3를 RENDER로 전환하지 않는다. render/MAIN_DONE receipt 및 저장된 R3 validation report도 executionLine:CODEX로 결속한다. GPT 예약 라인의 MAIN handoff는 유지한다.

ROOT의 신규 job state는 `buildStageState({stage:"CREATE",qualityContractVersion:"JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",executionLine:"CODEX"})`로 시작한다. 소비 helper는 계약을 다음 state에 유지하고, legacy 보고서로 downgrade하거나 다른 실행 라인의 PASS를 인계하는 것을 거부한다.

동일 계약/라인 정보는 durable continuation에도 보존한다. MASTER technical resume에서 계약 버전을 잃고 legacy closure를 소비하지 않는다.
