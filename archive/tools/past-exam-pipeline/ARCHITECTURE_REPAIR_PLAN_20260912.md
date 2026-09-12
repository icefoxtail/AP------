# Past Exam Architecture Repair Plan

## 0. 범위·판정 기준·인계 주의

- 저장소: `icefoxtail/AP------`
- 분석 기준: `fb8df0f0f4ac77f4ba820046e479146c2c524aca`, 브랜치 `codex/archive-2020-maesang고1-2mid`.
- 대상: `20_매산고_2학기_중간_고1_기출`을 포함한 Past Exam 신규생성 전체 경로.
- 최신 요청에 따라 **분석·설계에서 종료**한다. 이 문서는 구현 완료·파일럿 PASS·production 승인서가 아니다.
- 앞선 구현 요청 중 작성된 미커밋 코드 초안이 작업 트리에 있다. 아래 현재 상태 판정은 그 초안이 아닌 **기준 HEAD**에 대한 판정이다. 후속 구현자는 초안을 검토하고 선택적으로 채택해야 하며, 이미 검증된 완성 구현으로 취급하면 안 된다. 정본 문서는 변경하지 않았다.
- 판정: PASS = 해당 좁은 계약의 구현을 확인, PARTIAL = kernel은 있으나 연결/경계가 미완성, FAIL = 실제 코드에 단절 또는 모순 확인. 파일럿 전체 성공과 별개다.
- 분석 도중 확인한 production 데이터는 legacy 예외까지 관찰한 것이며 신규 생성 기준에 맞춰 기존 데이터를 일괄 변경하는 계획이 아니다.

**결론: PARTIAL.** 기존 kernel을 재사용하면서 아래 계획을 구현하면 지원 범위의 PDF는 사용자 반복 지시 없이 closure와 최종 JS까지 자동 진행할 수 있다. 현재는 builder/recovery producer의 실행 연결, U3 선행 검수 결과 전달, V2 출시 bridge, 재개 가능한 promotion이 빠져 있다. 모든 원문 모호성·임의 수학 문제까지 항상 자동 완성된다는 보장은 할 수 없다.

## 1. 실제 production artifact 관찰

### 1.1 관찰 범위

Git 추적 `archive/exams/original/**/*.js` **359개, 8,226문항**을 JS로 평가해 원래 필드·배열을 읽었다. `archive/db.js`와 `archive/question-index.js`를 각각 평가하여 파일별 노출·문항 수를 대조했다.

| 관찰 항목 | 결과 |
|---|---:|
| 비어 있지 않은 choices | 6,787문항 |
| image PNG 참조 | 2,091건 |
| image SVG 참조 | 9건 |
| solutionImage SVG 참조 | 904건 |
| solutionImage PNG 참조 | 22건 |
| image/solutionImage 둘 다 없음 | 5,375문항 |
| 위 참조의 파일 누락 | 0건 |
| 파일별 DB 노출 누락/인덱스 수 불일치 | 0건 |
| 여러 UID가 같은 이미지 경로 사용 | 2개 asset 그룹 |

참조 건수는 서로 중복될 수 있다. `image`가 없다는 사실만으로 본문의 HTML 표 등도 없다고 단정하지 않는다. 신규 engine 품질 PASS, 전체 수학 검수, 모든 SVG의 의미 검증을 뜻하지 않는다.

원시 관찰 및 선택 시험지의 전체 questionBank는 `alive/runtime/production-contract-20260912/inspection.json`에 보존했다. 이 경로는 진단 산출물이며 production 파일이 아니다. 분석 도구 초안은 `pipeline-core/inspect-production-artifacts.mjs`에 있다.

### 1.2 실제 사례와 계약 비교

아래 경로는 별도 표시가 없으면 `archive/exams/` 기준이다.

| 실제 사례 | 관찰한 production 형태 | 파이프라인에 요구되는 보존 |
|---|---|---|
| `original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js` q1 | 5개 choices, 정답 ⑤, `solutionImage: assets/images/.../q01-solution.svg`; size/alt/caption 별도 | choices 순서·LaTeX 문자열·해설·SVG 원본 bytes 유지. V1→V2→V3와 해설 render 연결 |
| 같은 시험 q2 | 절댓값 부등식, 5개 choices, image/solutionImage 없음 | 없는 그림을 요구하지 않음. EXEMPT라도 SOURCE/MATH/SOLUTION/RENDER 의무가 사라지는 것은 아님 |
| 같은 시험 q16 | source PNG와 별도 solution SVG 동시 사용 | source 그림과 instructional 그림을 별도 role로 결속. U1에 해설 그림 금지 |
| `original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js` q11 | 문제 자체가 `q11.svg`; SVG에 viewBox, title/desc, data-equation-* 등 존재 | 경로/hash를 텍스트로 보여주는 것만으로 source 그림 전달이 안 됨. SVG의 검수용 raster 파생본 필요. 숨은 data-*를 blind 수학 힌트로 노출하지 않음 |
| `original/high/h1/2mid/21_강남여고_2학기_중간_고1_기출.js` q19 | 함수 대응도 PNG; image와 solutionImage가 **동일 파일** | source/solution role은 구분하되 같은 byte identity를 허용. 같은 파일이라는 이유로 source 오염으로 단정하지 않음. 매산 q5 비교 사례 |
| `original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js` q11 | `questionType: 객관식`, `choices: []`, `통이미지보기` tag, imageSize tall. 실제 PNG 내부에 ①~⑤ 포함 | `choices.length===0`을 단답형으로 단정 금지. 문제 그림이 U3에서도 보여야 답 번호 검증 가능 |
| `original/high/h2/2final/23_복성고_2학기_기말_고2_확률과통계.js` q8/q9/q17 | 세 문항이 q8.png 공유 | 경로 끝의 q8을 유일한 소유 UID로 추정 금지. shared UID와 dependency set 생성 필요 |
| `original/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계.js` q3/q5/q24 | `q03_standard_normal_table.png` 공유; 실제 표 PNG 확인 | 자산 dedupe와 문항별 applicability/coverage는 별개. 하나 수정하면 세 문항 dependency impact 평가 |
| `archive/assets/images/중1_1학기_정수와유리수의덧셈과뺄셈/q6.jpg` | 실제 JPG 숫자 피라미드 그림 확인 | image/jpeg decode 지원. 이 파일은 위 기출 359개 집계와 별도 asset 사례이며 기출 DB 노출 사례로 과장하지 않음 |

production은 주로 `window.examTitle` + `window.questionBank`이며 `image`, `solutionImage`는 archive-relative 문자열이다. 추출 후보에는 이에 더해 `visualAsset`, bbox, sourceDocumentSha256, sourceIdentityKey, fullPageImagePath, 상태 필드가 붙는다. production이 run schema를 내장하지 않는 것은 정상이다. boundary adapter가 이 둘을 연결해야 한다.

### 1.3 render 관찰의 한계와 중요한 구분

앞선 작업 중 4개 실제 시험지에 대해 exam/sol/ans × desktop/mobile 24회 브라우저 probe를 수행했다. DOM count, decode, math error 관측은 있었으나 캡처 하나를 직접 열자 **본문 없는 화면**이었다. probe가 `#print-area`로 범위를 좁히지 않고 `.q-box`를 세어 숨은 `#staging` 문항을 먼저 잡을 수 있다. 따라서 **그 24개 캡처를 render PASS 증거로 사용하지 않는다.**

기준 HEAD의 `pipeline-core/render.mjs::captureRender`는 이미 `#print-area .q-box`/`.ans-n`, 고유 sourceRef count, geometry 안정화, continuation block을 사용한다. 이번 잘못된 probe를 기존 collector의 확정 버그로 돌리지 않는다. 후속 구현은 기존 collector를 재사용하고, visible/positive rect/최종 페이지/continuation을 확실히 검증해야 한다. screenshot 파일 존재나 decode만으로 closure하면 안 된다.

분석 전환 후 한 시험지의 `#print-area .q-box`만 기다리는 작은 read-only probe도 30초 timeout으로 끝났다. 로컬 서버/runtime 준비의 추가 원인은 이번 분석에서 확정하지 않았다. 실제 visible production render 성공을 주장하지 않으며, 구현 Phase 4/5에서 pinned runtime과 기존 collector로 재현·분리 진단해야 한다.

## 2. 현재 실제 execution graph

```text
사용자 요청 / builder(main worker)
  ├─ calibration.assertBuilderStart
  └─ runOneExam
       ├─ freezeSourceInventory
       ├─ candidate skeleton + reports 쓰기
       └─ scanned_exam_pipeline.py
            PDF/page render → Vision JSON 정규화 → bbox crop → extracted candidate
            └─ answer/solution은 미완성인 채 extraction 결과 반환

builder가 별도로 풀이·해설·분류·triage·visual build 수행 [기본 runner 호출 연결 없음]
  → prepareDraft(V2, DRAFT_NOT_EXECUTABLE)
  → machine evidence / captureRender
  → freezeWorkBatch
       └─ authority 미확정 발견 시 REPAIR_REQUIRED
  → resumePastExam
       ├─ prepareProviderReview
       ├─ reserveWorkBatchReview                 [순서 결함]
       ├─ buildPackets / validatePacketPreflight
       └─ dispatchProviderReview
            U1 → U2 → U3 [모두 사전 생성된 packet; 실제 U1/U2 출력의 U3 주입 없음]
            → phase attestation/evidence files → terminal receipt → reconcile
       ├─ REPAIR_REQUIRED → router → handler/helper
       │    → recordWorkBatchRepair → refs가 있을 때만 freeze → targeted recheck
       ├─ HOLD(execution) → 같은 freeze의 successor launch
       └─ CLOSURE → callback 또는 CLOSURE_READY 반환 [기본 실행은 여기서 끝]

별도 gate / 출시 경로
  auditV2 / aggregateWorkBatchAudit / question-quality / exam-release
  -X→ integration.requireProductionClosure → promotion CLI
       [V1-only manifest audit 및 authorization 경계; CLI 자체 오류도 존재]
  promotion receipt → asset copy → JS copy
  -X→ db.js update / build-question-index / production audit / durable DONE
       [한 transaction/runner로 연결되지 않음]
```

`prepare-v2`를 PDF→DONE orchestrator로 부르면 안 된다. `resumePastExam`의 BUILD_AND_FREEZE도 기존 runRefs를 freeze할 뿐 PDF ingest나 수학 builder를 실행하지 않는다.

## 3. component 책임·입출력·identity inventory

공통 semantic identity **S**: source document raw SHA + source question identity + candidate/asset refs + run revision/inputSha + axis SHA + dependency denominator. 공통 execution identity **E**: workBatchId + logical launchId + attempt + provider externalId + CONTROL/U1/U2/U3 session/context IDs. `—`는 provider 실행이 없는 단계다. 아래 표의 자동/사람 경계는 **현재 구현**, 제안 상태는 7~10절이다.

| 단계 / 실제 component | INPUT → OUTPUT | authority / state | S / E | 실패·현재 recovery·downstream |
|---|---|---|---|---|
| calibration `lib/calibration.mjs::assertBuilderStart` | main 샘플/lock/profile/manifest → start 검증 | Git sample bytes, rule pack; builder start gate | main SHA·sample SHA / — | stale/missing lock 차단. 준비는 builder; inventory가 의존 |
| inventory `lib/hardening.mjs::freezeSourceInventory` | source document/page map/포함·제외 → inventory, identity map | 실제 PDF/source identity; FROZEN | doc SHA·sourceNo·page / — | 누락/중복/커버리지 FAIL. 판독 불가만 사람; extraction 입력 |
| ingest `scanned_exam_pipeline.py::main` | PDF 또는 page image paths → full pages | source bytes; extractor stage | doc/page SHA / — | 파일/렌더/포맷 실패; runOneExam은 partial 반환, 전체 자동 recovery 아님 |
| extraction `normalize_vision_questions` | page별 Vision JSON + inventory → content/choices/visual bbox | full-page pixels, identity map | sourceIdentityKey / — | Vision 없음·불확실성 report; worker 관찰 입력 필요; candidate 생성 |
| raster crop `crop_visual_assets` 계열 | full page + bbox → PNG/provenance | source page, bbox | page SHA·bbox·asset SHA / — | purity/clipping/manual flags. 통이미지보기 정책을 별도 구분해야 함 |
| fidelity `hardening::validateFidelityEvidence`, SOURCE audit | source/현재 payload + 독립 evidence → parity | source 원본 불변 | content/choices SHA / U1 E | 추출 오류는 restoration; 원문 오류는 derived. builder 관찰을 U1로 대체 금지 |
| solve/answer | 원문·choices → independentSolve/answer authority | main worker build; 독립 U1 별도 | question identity·answer evidence / build identity | 일반 수학 producer 기본 연결 없음. source answer와 충돌은 R0 입력 생성 필요 |
| candidate/solution build | extracted JS + 풀이·분류 → completed JS | protected payload/solution quality contract | candidate SHA·revision / builder session | 기존 JS 복사나 answer만 채우기로 대체 금지; prepare로 전달 |
| visual triage / numeric build | student solution·expected facts → benefit + SVG/PNG | V1/expected fact freeze, generator provenance | question/expected/artifact SHA / builder + independent audit E | 생성기 있음은 자율 repair producer와 다름 |
| prepare `prepare.mjs::prepareDraft` | source/candidate JS, registry, rule/runtime refs → run draft | source/UID authority, publicationIntent | S 구성 / builder identity | DRAFT, authority PENDING. 일반 독립 solve는 수행하지 않음 |
| problem/solution/shared binding | 문자열 image 경로 → run input refs/dependencies | 실제 JS, source/candidate 별도 roots | byte SHA + role + owner UID / — | prepare는 image/solutionImage만 주 경로, sharedVisualMathDependency=false 기본. 명시 shared adapter 필요 |
| STATIC/METADATA `machine-evidence.mjs` | byte-bound run → MACHINE_CURRENT evidence | 실제 collector, current axis SHA | revision/input/axis SHA / MACHINE_COLLECTOR | stale 재수집. 과거 PASS label 재사용 불가 |
| RENDER_CAPTURE `render.mjs::captureRender` | frozen inputs/runtime, 6 cases → screenshots/itemWitnesses | production engine, MACHINE_COLLECTOR | runtime/candidate/asset/input SHA / capture identity | continuation·마지막 문항·visibility; 의미 review 별도 |
| freeze `work-batch::collectFreeze/freezeWorkBatch` | 전체 runRefs → immutable freeze/bindings/targets | SHA kernel + whole-job denominator | freezeSha / — | stale/authority/dependency 오류. Past Exam diagnostic continuation 구분 |
| provider prepare `prepareProviderReview` | freeze/purpose → plan/reservationRequest | provider-issued zero-model identity | freezeSha / 새 E | transport/control 오류는 semantic defect 아님; plan 재사용·고아 정리 필요 |
| reserve `reserveWorkBatchReview` | plan request → RESERVED | global slot, budgets, independence | 동일 S / E 배정 | 다른 슬롯은 transient 보호 있음. runner의 대기/재개 연결 부족 |
| U1 packet | extracted source text/choices + source image ref → SOURCE_ONLY | 원문만 허용 | source SHA / U1 | full-page 원본 픽셀은 현재 packet에 직접 전달 안 됨; fidelity 관찰 맹점 |
| U2 packet | artifact-only + applicability → V2 evidence | blind expected facts 금지 | artifact SHA / U2 | source-only visual 누락, SVG native 불가, authority 미확정 |
| U3 packet | currentQuestion/answer/solution + frozenU1/U2 + render → A2/SOLUTION/V3/RENDER | 후보 정확성 및 선행 독립 결과 | candidate/phase-output/render SHA / U3 | 현재 후보 image 필드 누락, frozen output placeholder, witness 공백 |
| native adapter | phase request → `turn/start.input` | Codex protocol | packet SHA / thread/turn | double wrap, SVG bytes 불가, witness 수집 누락, base64 텍스트 중복 |
| receipt/reconcile | phase outputs → terminal receipt/openDefects | provider attestation | freeze + defect fingerprints / E terminal | write/parse/bind exception 일부가 보호 영역 밖; orphan 가능 |
| router/fingerprint `defect-router.mjs` | structured defect + dispositions → route/plan | 정형 class 우선 | fingerprint + scope / trigger launch | description/defect prose 누락 fingerprint, caller fingerprint 신뢰 위험 |
| repair `resume::performRepair` | routed defects → handler results → repair request | original builder | revision/inputSha / build op | reducer만 반환, 다중 route 결과 합치기 불완전, runRefs optional |
| recheck `reserveWorkBatchReview` | repaired freeze + impact/reuse → TARGETED_RECHECK | bounded Past Exam 3 iterations | 새 S 또는 동일 S / fresh E | scope mismatch 및 execution successor의 count guard 재적용 점검 |
| execution recovery | FAILED receipt → same-freeze successor | classified provider attempt | S 고정 / 새 E | ambiguous 실패의 live turn 확인 부족; duplicate 실행 위험 |
| review-only | false positive + 증거 → same-freeze fresh review | 불변 candidate, 새 auditor | S 고정 / 새 E | reducer 지원. runner 기본 disposition은 후보/asset repair 위주 |
| closure `auditV2`, `question-quality-set`, `exam-release` | current axes/reuse/6 case review → typed closures | common kernel; release 자체는 authority 없음 | closureSet/inputs SHA / completed E | `OPEN_DEFECT=0`만으로 부족. runner는 CLOSURE_READY에서 종료 |
| authorization/integration | closure + explicit scoped approval → publish authorization | 승인과 quality 별개 | exact release set SHA / approval identity | V2 bridge 미연결; 현재 requireProductionClosure는 V1 audit 경로 |
| promotion/db/index | approved staged bytes → deployed JS/assets/DB/index | publish receipt + deployed parity | final bytes/source identities / promotion op | CLI 미정의 심볼, partial copy, DB/index 별도, idempotent DONE 없음 |

## 4. 15개 failure corpus와 최근 6개 의심 지점 판정

| corpus | 기준 HEAD 판정 | 근거와 설계 결정 |
|---|---|---|
| A visual applicability | PARTIAL | `visualApplicabilityForQuestion`과 missing-* suppression 있음. source의 no_visual 상태와 새 solution asset이 공존하면 EXEMPT인데 artifactRequired=true 모순 가능. authority helper와 판정식을 통합 |
| B fresh auditor identity | PASS(좁은 identity 계약) | `codex-appserver-launch-state.mjs`는 launchId/requestSha 재사용과 새 launch fresh context 분리. work-batch도 cross-launch identity 검사. 실제 successor 연결까지 전체 PASS로 확장 금지 |
| C global slot/transient | PARTIAL | mutate가 global-slot 예외를 transient로 보호. runner는 reserve 예외를 WAIT로 소비하지 않고 종료 가능. prepare transport, retry 파일 충돌 등 같은 계열 미완성 |
| D stagnation | PARTIAL | 같은 inputSha + fingerprint set + TARGETED_RECHECK 비교 있음. UID만 비교하던 문제는 보강됨. fingerprint가 `reason`만 읽고 실제 `description`/`defect`가 빠질 수 있음 |
| E source defect | PARTIAL | derived ledger/1:1/adoption gate 있음. 범용 derived producer 없음은 맞게 unavailable 처리. R0/R1 bounded Python producer와 generic unavailable을 구분해 route별 연결해야 함 |
| F unfinalized authority | PARTIAL | freeze/reserve/preflight 검사 존재. `prepareDraft`는 PENDING, 기본 authority helper는 증거 없는 RESOLVED object만 만들 수 있어 자동 최종화 완료 아님 |
| G actual image | FAIL | source ref dataURL 추가는 PNG에 유효하나 SVG mime mapping 없음. U3 currentQuestion에는 image가 없어 통이미지 choices를 검증 못 함 |
| H native protocol | FAIL | `.map(nativeImageInput)` 후 다시 `{type:'image',url}` wrapping. 최종 url이 문자열이 아닌 object |
| I preflight 순서 | FAIL | resume의 runReview: prepare→reserve→packet build→validate. packet 예외 시 예약된 launch가 남을 수 있음 |
| J render witness | FAIL | packetInputs U2/U3는 `[]`; adapter는 problemAssets/artifact.assetRefs만 수집. capture 파일과 native input 사이 단절 |
| K handler vs reducer | FAIL | built-in authority/visual은 object/bindings 반환; 파일 저장·machine/render·freeze orchestration 없음 |
| L candidate capability | FAIL | registry는 recordWorkBatchRepair 파일 존재를 producer로 간주. 실제 문항 수정 함수 아님 |
| M targeted denominator | FAIL | packetInputs는 freeze.targets 전체, header questionUids는 plan.scope. validator는 잘 막지만 runner가 정상 subset을 만들지 못함 |
| N execution/semantic | PARTIAL | same-freeze successor와 별도 attempt 기록 있음. transport failure의 invocation 여부·unknown turn ownership·targeted count guard가 불완전 |
| O same-freeze recheck | PARTIAL | `review-only-recheck.test.mjs`/reducer가 revision/input 고정 경로 제공. 기본 producer/runner가 evidence-backed review-only 결과를 일관되게 반환하는 계약 부족 |

**최근 HEAD 집중 6건은 전부 FAIL**: 7-1=H, 7-2=I, 7-3=J, 7-4=K, 7-5=L, 7-6=M. 이는 코드 연결의 판정이며 예전 evidence를 소급 변경하지 않는다.

## 5. 추가 구조적 결함·우선순위·수정 위치

| ID/우선순위 | 확인 내용·root cause | 수정 대상 / acceptance |
|---|---|---|
| X01 P0 | `promote-reviewed-exam.mjs`는 main을 선언하지만 파일 끝에서 미정의 `runPromotion()` 호출. `loadSubunitMaster()`에 root 미전달, `archiveRootOverride` 미정의 | promotion CLI/함수 분리. sandbox dry-run부터 실제 gated copy까지 동일 exported 함수로 검사 |
| X02 P0 | integration→auditManifestFile→auditRun은 V1만 허용. 신규 Past Exam은 V2 필수. auditV2는 의도적으로 productionAuthorized=false | V2 closure dispatcher와 별도 authorization verifier 연결. auditV2의 false를 true로 하드코딩하지 말 것 |
| X03 P0 | U3 frozenU1/U2는 `FROZEN_SOURCE_PACKET`/`FROZEN_ARTIFACT_PACKET` 문자열 placeholder. dispatch가 U1/U2 출력을 저장해도 U3 packet을 갱신/봉인하지 않음 | phase output 저장 후 **동일 logical launch 안에서** U3를 최종 seal. real phaseOutputSha 및 data 결속 |
| X04 P0 | r9 receipt/run raw SHA 불일치. 두 파일 모두 LF 환산 SHA가 저장된 expected SHA와 정확히 일치 | evidence checkout/EOL 보존 정책 + immutable object 복구 절차. runtime byte hash를 normalized hash로 바꾸지 말 것 |
| X05 P0 | U1은 full-page source를 입력으로 보지 않고 extracted text/crop만 보므로 원문 transcription fidelity를 독립 관찰하기 어려움 | scope별 source-page/image evidence lane. 같은 페이지의 다른 문항 exposure를 명시 dependency로 허용하거나 승인된 identity-bound review crop 사용 |
| X06 P0 | transportCall은 timeout 없음. nonzero exit를 TRANSPORT_UNAVAILABLE로 축약; provider가 이미 turn을 시작했는지 잃음. ambiguous 실패 후 새 launch가 중복 모델 작업을 만들 가능성 | bounded async transport, provider turn/status receipt, unknown attempt reconciliation. unknown은 slot 해제 금지 |
| X07 P1 | `phaseRequest`/writeNewJson, response binding/scoped defects/후속 evidence 쓰기 중 일부가 catch 밖. crash 후 DISPATCHED orphan 가능 | attempt journal에 request/phaseOutput/terminal 순서 저장; 외부 작업 상태 조회 후 같은 attempt 재조정 |
| X08 P1 | retry 전 plan 파일은 writeNewJson이고 launch ordinal은 launches.length+1. prepare 뒤/예약 전 crash 시 같은 경로 충돌 | preflight operation id + matching request의 plan/packet 재사용. 내용 다르면 새 attempt directory, 기존 bytes 유지 |
| X09 P1 | performRepair는 defect별 dispositions를 펼치지만 openDefectSet은 UID별. 한 UID에 수학+visual 결함이면 개수 불일치/중복. 여러 handler가 모두 기존 첫 runRef에서 시작하고 첫 repairRequest만 선택 | per-defect 결과 + per-UID composed disposition. dependency 순서로 한 workspace revision에 합성, 모든 runRefs 함께 freeze |
| X10 P1 | shared production PNG는 실제 존재하지만 prepare는 shared=false, hardening은 explicit SHARED_MATERIAL을 요구 | observed shared reference map→sharedMaterialUid/dependency set adapter. legacy production 원문 필드 강제 개조 금지 |
| X11 P1 | source no_visual metadata는 **source에 그림 없음**이지 solution visual exemption이 아님. 각 모듈의 applicability 추론이 다름 | source presence / solution requirement / attached artifact / render obligation을 별도 저장하고 하나의 projector로 계산 |
| X12 P1 | adapter prompt가 전체 packet JSON을 문자열화하여 base64를 텍스트와 native image 양쪽으로 전달 | canonical packet hash 유지; textual projection에서는 bytes 제외하고 attachmentId만 표시. 요청 envelope 총량 budget/정확한 연결 검증 |
| X13 P1 | promotion receipt를 먼저 쓰고 여러 asset/JS를 순차 copy. 중간 실패 후 receipt exists가 retry를 막음. DB/index 작업도 transaction 밖 | prepare/commit/verify journal, staging snapshot, recovery 가능한 publish transaction. COMMITTED receipt는 전체 parity 이후 |
| X14 P1 | extraction은 같은 outputDir에 manifest/skeleton/report를 덮어쓰며 rerun. 이미 freeze된 디렉터리 재사용 위험 | operation별 새 staging + atomic pointer. frozen 경로 write 금지. runOneExam exit 결과와 semantic stage 연결 |
| X15 P1 | resume CLI에서 없는 옵션도 indexOf=-1+1로 argv[0]을 읽음 | 명시 CLI parser/required option 검증. predecessor-only 인자 small probe |
| X16 P1 | router의 DONE branch 소비는 있으나 nextWorkBatchAction에는 durable DONE 생성 경로 없음. 기본 closure도 CLOSURE_READY 반환 | persisted CLOSED/AUTHORIZED/PROMOTING/DONE state와 invariant 검사; callback 문자열만 DONE으로 믿지 않음 |
| X17 P1 | recheck execution successor에서 이미 사용한 failed TARGETED_RECHECK 수/ freeze-count 식을 재적용할 여지 | failed logical review의 semantic iteration을 재사용하고 attempt만 증가. 최초/2차/마지막 iteration 실패 matrix |
| X18 P2 | source/candidate paths에 USER의 옛 worktree 절대경로 남음. 현재 root에서 sourceAssetRoot와 assetRoot도 서로 다를 수 있음 | logical refs와 locator 분리. rebase resolver는 provenance를 재작성하지 않고 별도 verified relocation record |
| X19 P2 | narrow/full coverage probe가 hidden staging을 세면 blank screenshot에도 count 정상 | production collector selector와 visible geometry helper 재사용. 검사 도구 초안의 실패를 kernel PASS로 바꾸지 않음 |

### r9 불변 evidence 진단

| 파일 | expected SHA256 (prefix 생략) | 현재 raw SHA256 | LF 환산 |
|---|---|---|---|
| `alive/runtime/provider-bridge/past20-maesan-final-b607a13b5-r9/receipt.json` | c5651044eaac7c6bef262d86d31c336578f088b3f28aae18b1350db52e1fa961 | a561f7073b8b3b9edefa7ffb29ff33efaec3096ca32c7c6dae54769b688e3350 | expected와 동일 |
| `archive/_generated/past-exams/_manual/20_매산고_2학기_중간_고1_기출_fresh_393877dda/pipeline/final-b607a13b5-r9-fresh/run-machine-current.json` | 8f4137a3d5e46a4806d60a1087191705e594cc36eeaf5585b2f4fefb4eec45d1 | 9b664f55ac4988680d56795d23df6b53bd35c60816819eeb1ed5fdf4431646c2 | expected와 동일 |

이 결과는 두 파일의 raw-byte mismatch가 줄바꿈 변환으로 설명됨을 뜻한다. 전체 evidence tree가 무결하다는 뜻은 아니다. 현재 bytes를 바꾸거나 state ref를 새 SHA로 덮어쓰지 않았다. 후속 작업은 Git blob/원 저장소의 exact bytes를 별도 복구 위치에서 전부 검증하고 정식 relocation/continuation으로 연결해야 한다. 입증할 원 bytes가 없으면 immutable evidence blocker가 유지된다.

## 6. 유지할 kernel과 최소 신규 구성

유지: canonicalJson/readBoundFile/safePath, source inventory/UID registry, source immutability, runtime bundle pin, axis SHA projection, independent stateless contexts, typed solution/visual quality, render continuation, direct-root reuse, bounded work-batch reducer, global mutation lock/crash-lock 복구, source recovery 1:1 adoption 검증.

새 framework 전체를 만들 필요는 없다. 아래 네 개의 작은 책임을 추가/정리한다.

1. **Artifact projection adapter**: 실제 production JS + extracted record를 동일 byte-bound question view로 읽음. source/candidate/solution/shared roles, SVG native derivative, image choices, source pages, render witnesses를 담당. 파일 locator와 수학 내용 수정은 분리.
2. **Repair materializer**: producer 출력들을 새 revision directory에 합성·저장하고 machine evidence/필요 render/reuse를 재생성하여 완전한 runRefs를 반환. authority/visual reducer를 이 안에서 사용.
3. **Resumable orchestrator journal**: 기존 work-batch state를 대체하지 않고 build operation/attempt/phase write/promotion cursor를 저장. 불확실한 provider 작업을 조회·reconcile하며 busy는 대기.
4. **V2 release bridge + promotion transaction**: typed whole-job closure를 explicit authorization과 결속하고 exact JS/assets/DB/index를 재개 가능하게 배포·검증.

통합 대상: provider-bridge와 resume의 중복 source/image resolver, authority-repair와 review-isolation-runner의 applicability 추론, closure/provider/prepare의 asset path projection, 중복 render readiness probe. 수학 producer와 validator를 합치지 않는다.

## 7. capability registry 실제 producer 판정표

| route | HEAD의 광고 | 실제 제공 기능 | 채택할 capability |
|---|---|---|---|
| SOURCE_FIDELITY_RESTORATION | run-one-exam 파일 존재 시 ACTIVE | extraction 준비/실행; 이미 수정된 Vision JSON과 새 freeze를 스스로 완성하지 않음 | `PREPARATION_ONLY`; verified extraction correction adapter+materializer가 등록될 때 BOUNDED |
| ANSWER_KEY_RECOVERY | Python 파일 존재 시 ACTIVE | `produce_recovery_candidates` R0는 independentSolve 입력으로 답/해설 후보 생성 가능 | `BOUNDED_PRODUCER_REQUIRES_INPUT`; independent solve evidence→candidate→review→freeze adapter 추가 |
| DERIVED_SOURCE_RECOVERY | unavailable | ledger 검증 + R1 choices bounded 생산, R3는 supplied condition hint 필요; 범용 재작성 없음 | tier별 R1 bounded / R3 input-required / 나머지 unavailable. 전체 route를 거짓 ACTIVE로 만들지 않음 |
| CANDIDATE_REPAIR | recordWorkBatchRepair 존재 시 ACTIVE | state reducer | `REDUCER_ONLY`; main worker builder callback과 materializer 계약 필요 |
| VISUAL_EVIDENCE_REPAIR | materializeVisualEvidence 존재 시 ACTIVE | 기존 problem ref 수집 | `BINDING_ONLY`; missing attachment, native derivative, stale render 등 세부 class별 producer 연결 |
| AUTHORITY_BINDING_REPAIR | materializeAuthorityBinding 존재 시 ACTIVE | run 복제·revision·RESOLVED 계산 | `REDUCER_ONLY`; authority evidence를 읽고 scope별로 정당한 finalization 후 저장·재수집 |
| EXECUTION_RECOVERY | reserve 함수 존재 시 ACTIVE | same-freeze fresh attempt reserve + runner 호출 | `BOUNDED_EXECUTOR`; terminal failure 확인/unknown reconciliation와 idempotency 보강 |

registry row는 `kind`, `supportedDefectClasses`, `requiredInputRefs`, `handlerVersion/refSha`, `produces`, `readiness`, `reason`을 갖는다. `available=true`는 **현재 입력과 실행 가능한 producer**가 있고 그 계약 결과를 끝까지 materialize할 수 있을 때만 허용한다. 검증 함수 이름·파일 존재·문자열 ACTIVE만으로 승격하지 않는다.

## 8. recovery route별 end-to-end 계약

모든 semantic producer 공통 출력: `operationId, route, dispositionsByDefect, changedUidSet, outputCandidateRefs, outputAssetRefs, sourceLineageRefs, authorityEvidenceRefs, status`. materializer 공통 출력: `runRefs, revision, inputSha, machineEvidenceRefs, renderCaptureRefs/reuseReceipts, impact, readyToFreeze=true`. 누락은 `HALF_GENERATED_REPAIR`이며 repair iteration을 성공 처리하지 않는다.

| route | 입력·허용 변경 | 생산 및 본선 복귀 | 인간 개입 조건 |
|---|---|---|---|
| extraction restoration | original PDF/page + identity + mismatch; source document 불변, extracted record 수정 | 새 extraction revision→content/choices/source visual fidelity→candidate regeneration→solve impact→machine/render→freeze→fresh recheck | source pixels 판독 불가 또는 identity 확정 불가 |
| answer recovery | unchanged question + independent computed answer/solution + conflict ledger | R0 bounded candidate→학생용 해설→answer authority→materialize→MATH/SOLUTION 재검 | 독립 답 입력 없음/원문 ambiguity 미해결 |
| derived source | original immutable payload + approved tier/scope + independent facts | distinct recovered UID, slotUid/effectiveArtifactUid, 1:1 replacement ledger→independent review→adoption gates→new freeze | 해당 tier producer 없음, 승인 범위 밖의 의미 변경 |
| candidate repair | audited defect+current candidate+source/typed contract | same builder의 수학/해설/분류 수정→actual diff 검사→materializer→impacted recheck | 수학적 모호성/범위 밖 변경/반복 의미 결함 |
| visual evidence | role-specific asset/ref/generator/expected facts/capture | 누락 binding 또는 native derivative 복원은 deterministic; 새 그림은 V1 facts→generator→V2/V3→render→freeze | expected facts/producer 없음, source visual 판독 불가 |
| authority binding | source/answer/visual adjudication evidence + scope | evidence-backed parity 검사→finality 기록→새 run/ref와 axis 갱신→recheck | 서로 충돌하는 authority를 자동 선택할 근거 없음 |
| execution recovery | failed attempt+provider status+immutable freeze | candidate 변화 없이 새 E; old receipt immutable; fresh contexts; 같은 semantic iteration에서 재실행 | unknown live turn, bounded attempt 초과, 같은 실패 재현 |
| review-only resolution | AUDITOR_FALSE_POSITIVE/NO_CHANGE_WITH_EVIDENCE + 실제 반증 | candidate/revision/inputSha 그대로, 새로운 review operation과 context; 동일 결함 재현 시 stagnation | 반증 부재 또는 동일 의미 결함 반복 |

한 UID의 여러 결함은 각각 disposition을 남기되 freeze denominator는 UID set이다. route별 producer는 **첫 runRef만** 읽지 않고 runId별 입력을 선택한다. 여러 producer가 같은 후보를 바꾸면 순차 composition하고 서로의 수정 전 SHA를 확인한다.

## 9. visual·packet·native·render 계약

1. `SourceQuestionView`는 원본 text/ordered choices와 source pixel refs를 가진다. `CandidateQuestionView`는 현재 JS에서 평가한 정확한 text/choices/image/layout을 가진다. source choices를 candidate choices로 대체하지 않는다.
2. `AssetBinding`은 원본 `{path, bytes, sha256}` + role(`SOURCE_PROBLEM`, `CANDIDATE_PROBLEM`, `SOLUTION`, `SHARED`) + owners/dependencies를 가진다. 기존 `image`/`solutionImage` 문자열은 그대로 저장한다.
3. SVG는 production 원본을 유지한다. 검수용 PNG를 별도 생성하고 `{sourceSvgRef, rasterRef, rendererVersion/refSha, viewport/font/runtime binding}`으로 결속한다. SVG SHA와 PNG SHA를 같은 값으로 비교하지 않는다. 외부 font/image/filter dependencies는 검사·고정한다. 변환 성공이 geometry PASS는 아니다.
4. PNG/JPG는 magic bytes/decode/type를 확인하고 actual bytes를 native attachment로 전달한다. path/hash, `naturalWidth`, MIME label만으로 모델 시야가 입증되지 않는다.
5. U1에는 source pixels만, U2에는 artifact-only pixels만 전달한다. **U2에 정답/해설이 보이는 전체 solution render screenshot을 넣지 않는다.** 필요한 경우 artifact-only render witness를 별도로 만든다. U3는 실제 candidate problem pixels + actual six-case/continuation witnesses + frozen U1/U2 결과를 받는다.
6. `reviewScope`와 `contextDependencyScope`를 명시적으로 분리한다. header UID set=payload UID set을 강제하고 source full-page에 타 문항이 포함될 때도 exposure 규칙을 적용한다. 전체 freeze 대상으로 payload를 만든 후 header만 줄이는 방식 금지.
7. audit 전 deterministic preflight는 candidate/assets/render/authority/scope를 모두 검사한다. CONTROL identity 생성 후 identity-binding preflight를 반복하고 reserve한다. 단 U3의 실제 선행 결과는 아직 없으므로 **U3 template/static 부분 사전 검증**, U1/U2 성공 후 output refs 주입 및 final seal을 수행한다.
8. 최종 `turn/start.input`의 이미지 원소는 정확히 `{type:'image', url:'data:image/png;base64,...', detail:'original'}`. 실제 transport mock의 최종 envelope와 attachment SHA/phase/UID manifest를 비교한다. image_url, object url, 누락, 중복 role 노출을 negative fixture로 검사한다.
9. text prompt에는 attachmentId/ref만 표시하고 base64는 native lane만 통과시킨다. packet canonical hash 및 실제 native attachment manifest hash를 모두 provider attestation에 남긴다.
10. render capture는 production engine의 visible print-area, 마지막 문항, 모든 continuation block, 실제 decode, MathJax, overflow를 확인한다. capture ref→packet witness→native manifest→RENDER_REVIEW evidence의 exact byte lineage를 closure에서 확인한다.

## 10. 상태·identity·재개 설계

```text
BUILD_PENDING → BUILDING → MATERIALIZED → MACHINE_READY → FROZEN
FROZEN → PREFLIGHT_READY → RESERVED → DISPATCHED → AUDIT_COMPLETED
AUDIT_COMPLETED + defects → REPAIR_REQUIRED → REPAIR_MATERIALIZED
  → MACHINE_READY → FROZEN_FOR_RECHECK → TARGETED_RECHECK
AUDIT_COMPLETED + no defects → CLOSURE_PENDING → CLOSED
CLOSED + exact authorization → AUTHORIZED → PROMOTING → DONE

temporary busy → WAITING(resource/operation), semantic state unchanged
pre-model terminal failure → EXECUTION_RECOVERY_PENDING → new attempt(same S)
provider state unknown → RECONCILE_PENDING(existing E), no duplicate dispatch
review-only → FROZEN_FOR_RECHECK(same S, fresh E)
irrecoverable/unsupported → HUMAN_DECISION_REQUIRED(reason, exact evidence refs)
```

S와 E를 서로 다른 immutable records로 저장한다. semantic repair만 revision/inputSha를 바꾸며 machine/affected render를 재수집한다. execution retry는 repair iteration을 소비하지 않는다. recheck는 iteration 안에 여러 execution attempts를 가질 수 있으나 canonical result는 하나다. 같은 launch/request만 idempotent; 다른 launch는 CONTROL/U1/U2/U3 모두 fresh다.

stagnation key는 caller가 제공한 fingerprint를 그대로 믿지 않고 canonical defect에서 재계산한다. 핵심 class, phase/axis, affected facts, normalized defect message, source/input binding을 포함한다. 단순 prose 표현 차이로 무한 반복되지 않도록 `semanticDefectKey`를 정형화한다. **같은 semantic input + 같은 canonical defect + fresh completed independent recheck**를 동시에 만족해야 semantic stagnation이다.

operation journal은 파일 저장 전에 intent, 저장 후 exact ref, 마지막에 committed operation을 남긴다. restart는 기존 partial write와 provider status를 조정하며 새 launch로 도망가지 않는다. COMMITTED/terminal evidence 덮어쓰기는 금지한다. EOL drift도 validator가 무시하지 않고 exact bytes 복구 lane으로 처리한다.

## 11. closure → authorization → promotion

필수 연결은 다음 순서다.

1. `aggregateWorkBatchAudit`로 모든 run/UID/axis/reuse coverage를 확인한다.
2. current `auditV2` + questionQualityClosureSet + examRelease six cases + source/derived lineage + immutable refs를 검증한다.
3. **QualityClosure**는 production 권한을 발급하지 않는다. 별도 **ReleaseAuthorization**이 approved scope, authorityId, approvedAt, source/slot set, candidate/asset SHA set, runtime bundle, review IDs, closure SHA와 정확히 결속된다.
4. `integration.closureFromFile`의 schema dispatch를 V1/V2에 맞게 분리한다. V2를 V1로 다운캐스팅하거나 false를 true로 변경하지 않는다.
5. promotion은 plan-only preflight로 destination/충돌/기존 bytes/DB/index diff를 모두 준비한다. 검수 후 경로 canonicalization이나 JS 재직렬화 금지.
6. 기존 runtime/kernel 입력이 DB/index에 의존하는지 확인하고, publication plan의 예상 DB/index 변경을 현재 review identity와 명시적으로 결속한다. 배포 시점에 runtime hash가 바뀌는 자기참조 문제를 숨기지 않는다.
7. staged JS/assets/DB/index를 transaction journal로 commit한다. 파일시스템의 다중 파일 atomicity를 가정하지 않는다. 중단 시 전체 재개/rollback 규칙과 원본 snapshot을 보유한다.
8. deployed JS/assets byte parity, DB file entry, index UID/count, registry/source slot parity, 필요한 deployed render를 확인한 후 COMMITTED receipt 및 durable DONE을 쓴다. receipt 존재만으로 배포 완료라고 판단하지 않는다.

## 12. 구현 순서와 Phase별 완료 조건

### Phase 1 — 실주행을 막는 P0

- 파일: `provider-bridge.mjs`, `review-isolation-runner.mjs`, `resume-past-exam.mjs`, `codex-appserver-adapter.mjs`, `integration.mjs`, `closure.mjs`, `promote-reviewed-exam.mjs`.
- artifact projector와 native derivative 계약 확정; U3 candidate image 보존; 최종 input double wrapping 제거.
- static packet preflight를 reservation 앞에 배치하고, U3는 실제 U1/U2 output 이후 seal하도록 dispatch lifecycle 수정.
- V2 audit/authorization bridge와 promotion의 미정의 심볼 수정. 이 단계는 publication 권한을 발급하지 않는다.
- exact-byte evidence/EOL 복구 경로 설계·구현. r9 진단 파일은 변경하지 않는다.
- 완료: 실제 production 샘플의 PNG/SVG/통이미지/shared 경우 최종 envelope probe 통과; malformed packet은 model call/slot 소비 0; V2 dry-run publication gate는 권한 없이 fail-closed.

### Phase 2 — 실제 recovery producers 연결

- 파일: `recovery-capability.mjs`, `authority-repair.mjs`, `visual-repair.mjs`, Python `source_recovery.py`, 새 repair materializer.
- preparation/reducer/validator/producer 종류 분리, supported class/input readiness를 registry에 등록.
- R0 answer와 R1 bounded choices adapter부터 연결. source/derived/candidate의 범용 producer가 없으면 정확한 unavailable 유지.
- multi-route/multi-run 수정 합성, UID별 disposition, ref 저장, machine/render 재수집, freeze-ready 반환 구현.
- 완료: advertised available route마다 실제 새 파일→exact ref→새 input SHA→machine/render→freeze 경로가 검증되고, 중간 실패는 half-generated로 보존·재개.

### Phase 3 — one-pass orchestration

- 파일: resume runner, work-batch, defect router, execution recovery, provider launch-state.
- BUILD_AND_FREEZE에서 source/calibration/extraction/main-worker build operation을 호출하는 adapter 추가. blind solve를 새 독립 production agent로 우회하지 않는다.
- WAIT/RECONCILE/repair/closure/promotion cursor를 durable journal로 연결.
- review-only와 execution successor의 semantic iteration 분리, unknown turn 조회, staged preflight 재실행 idempotency 구현.
- 완료: 하나의 시작 요청이 지원 가능한 다음 action을 계속 실행하며, 실제 unsupported/ambiguous/budget exhaustion만 human 상태 반환.

### Phase 4 — synthetic full-flow 및 실제 artifact contract suite

- 20문항, required/exempt/optional 혼합, source PNG, source SVG, solution SVG, 동일 PNG의 두 role, shared PNG, image-only choices를 한 denominator로 구성.
- authority→answer→candidate→visual의 다중 repair, 한 UID의 복수 defects, targeted subset와 shared dependency 확장, 정상 축 direct-root reuse 포함.
- 첫/중간/마지막 recheck에서 pre-model failure/unknown turn/execution successor, same-freeze false positive, stagnation/limit를 분리.
- prepare/packet/phase-output/receipt/write/copy 각 crash 지점에서 restart, 같은 명령 재실행, context 재사용 금지 검사.
- synthetic evidence=[]를 반환하는 fixture의 CLOSURE_READY는 closure PASS로 세지 않는다. typed closure/authorization/deployed parity까지 별도 fixture 필요.
- production 원본 파일을 직접 읽는 suite는 synthetic과 분리 집계. 실제 artifact에서 실패하면 pipeline PASS 불가.

### Phase 5 — 실제 매산고 파일럿

- 현 r9 raw SHA mismatch를 먼저 exact bytes 기준으로 해결한다. bytes 확보 불가 시 보존하고 정식 새 source-derived JOB/continuation 정책을 사용하며 budget reset 우회 금지.
- source PDF/page inventory, 최신 유효 predecessor, core/rule/runtime SHA를 검증한다. 기존 FAILED/COMPLETED receipt 수정·재사용 금지.
- q5 그림 시야, q8 전사 여부/일대일대응 조건, q11 source ambiguity, q16 answer authority, q19 독립 중간계산을 실제 full-page와 비교한다.
- defect progression, semantic repair/recheck 수, execution attempts, q별 결과, human stop reason을 기록한다.
- 완료: 허용 capability 범위에서 자동 진행; 실제 open defects=0 + 모든 typed closure PASS일 때만 다음 단계. 이 계획 작성 세션에서는 full runtime을 실행하지 않는다.

### Phase 6 — production closure/promotion

- Phase 5의 같은 final bytes를 사용하여 release authorization 및 transaction 수행.
- exact JS/SVG/PNG/JPG, DB/index/registry parity, deployed render 및 receipt를 확인한다.
- 명시적으로 승인된 출시만 수행하며 관련 파일만 stage. main/다른 evidence를 건드리지 않는다.
- 완료: 재실행은 동일 DONE을 반환하고 추가 copy/launch/repair를 만들지 않는다.

### Phase 7 — 안정화 후 정본 업데이트

- 실제 구현·holdout 결과가 안정된 뒤만 정본의 stage/recheck/producer/visual/authorization 문구와 version/hash를 정리한다.
- 이번 분석 단계에서는 정본을 바꾸지 않는다.

## 13. 매산 q5/q8/q11/q16/q19 현재 진단과 production 비교

이 표는 독립 최종 재검수 결과가 아니다. 보존 source pages/extracted/completed candidate/과거 receipt의 내용을 분리해 관찰한 결과다.

| 문항 | 실제 관찰·수학 검토 | 후속 route / 최종 상태 |
|---|---|---|
| q5 | page_p002의 대응도와 extracted `q005_visual.png` binding 존재. production 21 강남여고 q19도 대응도 PNG를 필수로 사용 | visual binding/native visibility 및 render recheck. 최종 PASS 미확정 |
| q8 | 실제 source는 X에서 X로의 **일대일대응**. k≥1은 단사 조건일 뿐, 치역=공역에서 k²−2k=k, k=3. 과거 non-unique 결함은 전사 payload와 전사함수 조건을 재확인해야 함 | 원문 동일하면 REVIEW_ONLY 반증 후 fresh recheck. 원문을 억지 수정하지 않음 |
| q11 | source page에도 “어떤 x,y에 대하여 p이면 q” 문구. completed-candidate의 “모든 점에서 참인 최소 원은 접한다” 설명은 논리적으로 정당하지 않음 | 원문 ambiguity와 candidate solution defect를 분리. derived 의미변경 권한/producer 없으면 human; source 원문 유지 |
| q16 | extracted/completed의 g=x²−ax+a+10에서는 min g≥−2 → a²−4a−48≤0 → pq=−48. 동봉 해설의 −2≤a≤6와 충돌이 후보에 명시됨 | 원문 page/answer source로 R0 authority 확정 및 독립 재검. closure 미완성 |
| q19 | source-derived 후보의 홀수 3개/짝수 5개, n(X)≥2에서 (3+1)·32−3=125; 중간 93+32도 일치 | math/recalculation evidence와 authority finality 검증. nonvisual의 missing-* 자동 부과 금지 |

실제 production 비교는 수학 답을 복사하기 위한 것이 아니라 역할·선택지·shared asset·해설 visual·렌더 계약을 비교하기 위한 것이다.

## 14. 검증 기록·남은 불확실성·인계

- 최신 분석 전환 이전: skills verification PASS, production 원본 파일 평가/DB/index read-only 대조 완료, 실제 SVG markup/PNG/JPG/source page 확인.
- 이전 구현 초안의 targeted test 18개 및 production 계약 probe 3개가 통과한 기록이 있다. **기준 HEAD의 전체 PASS 근거가 아니다.**
- 이전 전체 regression 두 번째 기록은 265개 중 264 PASS/1 FAIL이었다. 뒤에 초안 수정이 있었으나 최신 요청에 따라 반복 test/fix를 중단했다. 현재 미커밋 초안은 검증 완료 아님.
- 이전 r9 기반 resume 시도는 `IMMUTABLE_EVIDENCE_CORRUPTION`에서 멈췄고 새 expensive semantic audit/production promotion을 실행하지 않았다. 이후 read-only LF probe로 두 파일의 EOL 원인을 확인했다.
- 24 browser probe의 count/decode와 캡처를 render PASS로 인정하지 않는다. blank screenshot의 원인은 probe의 숨은 staging denominator와 연관되며 기존 production collector와 구분한다.
- 새로운 full runtime, promotion, canonical MD 개정, commit/push는 이 분석 전환 후 실행하지 않았다. branch HEAD는 분석 기준 그대로이고 구현 초안과 이 계획이 미커밋 상태다.
- 추가로 검증할 불확실성: provider unknown turn을 실제 API로 확인·종료하는 경로, 다중 phase output의 최종 V2 typed normalization, production publish가 runtime DB/index hash에 미치는 영향, 모든 legacy inline visual 유형. 추정만으로 PASS 처리하지 않는다.

**후속 구현자의 첫 작업:** 현재 `git diff`의 이전 초안을 목록화하고 이 계획의 P0와 대조한다. native SVG 초안의 font/runtime/derivation binding, scope/source pages, U3 phase-finalization, capability의 typed producer readiness, repair transaction, renderer visible coverage가 충분한지 검토한다. 초안 전체를 그대로 stage하거나 DONE으로 취급하지 않는다.

## 15. 최종 판단

**PARTIAL — 기존 low-level kernel을 유지하면서 Phase 1~3의 orchestration/producer/visual 연결과 V2 release bridge를 보강하면, 지원하는 PDF·결함 class는 한 번의 요청으로 최종 JS까지 도달할 수 있다.**

현재 상태는 extraction/build, audit/recovery, closure/publication이 하나의 재개 가능한 실행 경로로 닫혀 있지 않다. 특히 실제 candidate producer 부재, U3 frozen 결과 단절, V2 authorization/promotion 단절은 “이어가”라는 지시만으로 해결되지 않는다. 위 계약을 구현하고 Phase 4~6의 synthetic·실제 매산·deployed artifact 검증까지 통과해야 사용자가 원하는 one-pass 완료를 입증할 수 있다. 원문 의미가 모호하고 해당 derived producer/authority가 없는 경우에는 정확한 human decision 종료가 올바른 결과다.

## 16. 2026-09-13 사용자 추가 구현 요청에 따른 보완

앞의 0~15절은 9월 12일 기준 분석 기록이다. 이후 사용자가 불필요한 멈춤을 줄이는 수정을 요청하여 다음 실행 경로를 보완했다.

- `work-batch::targetedReviewIteration`을 provider prepare/reserve/launch 기록에서 공유한다. Past Exam은 freeze 개수의 산술식 대신 실제 repair iteration과 freezeSha를 대조한다. review-only 뒤 semantic repair가 이어져도 정상 진행하며, execution successor는 실패한 검수의 repairIteration을 유지한다. 새 semantic iteration의 횟수 제한과 fresh context 검사는 유지한다.
- `recordWorkBatchRepair`는 검증한 `pendingRunRefs`를 저장한다. router의 `FREEZE_RECORDED_REPAIR`가 기록 직후 중단된 작업을 이어서 freeze하므로 이미 완료한 producer를 다시 실행하지 않는다. 해당 ref가 변경됐으면 기존 byte/hash 검사가 차단한다.
- `resume::reserveWhenAvailable`은 정확한 global-slot busy 오류만 대기·재예약한다. 기본 대기 한도는 180초이며 한도 도달 시 `WAITING_FOR_SLOT`로 반환한다. 품질 HOLD, unknown provider, corrupt evidence는 자동 재시도하지 않는다. 대기는 semantic repair 횟수를 소비하지 않는다.
- 미예약 상태에서 동일 preflight request를 다시 실행하면 기존 plan/contexts를 재사용하고 전체 plan을 재구성하여 parity를 검사한다. packet도 내용이 정확히 같을 때만 기존 파일을 재사용한다. 다른 요청·변경된 계획은 fail-closed이며 terminal/dispatch 재실행 기능이 아니다.
- 검증: 재개/iteration/provider 관련 45개 테스트와 실제 production artifact 계약 3개 테스트, 총 48개 PASS. 신규 회귀는 `pipeline-core/tests/resume-continuity.test.mjs`에 있다. `git diff --check` 오류 없음.

이번 변경은 불필요한 실행 중단을 줄이는 보완이며, 앞서 미완성으로 기록한 범용 recovery producer, U3 phase output 결속, V2 release/promotion의 전체 완성을 뜻하지 않는다. 실제 매산고 full audit와 production promotion을 이번 보완의 성공 근거로 제시하지 않는다. 미커밋 상태로 보존했다.
