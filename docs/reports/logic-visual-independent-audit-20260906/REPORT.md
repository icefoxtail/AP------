# APMath 집합·명제 Logic Visual 외부 독립 검수

- 검수일: 2026-09-06 KST
- 전체 판정: **FAIL**
- 8문항 배치 진행 가능 여부: **현재 불가**. 아래 P0/P1 acceptance criteria를 충족한 뒤 동일 visual type·검증된 동일 projection의 `KEEP_EXISTING` 8문항부터 조건부 진행한다.
- 범위: 사용자가 지정한 규칙 문서 9개, `archive/tools/logic-visual-audit/` 구현과 현재 evidence. 구체적인 실패 재현은 2022 집합 50 UID 파일럿과 batch-11을 중심으로 수행했다. 명제 전체 문항의 수학·시각 품질을 인증하는 보고서가 아니다.
- 방식: 제작 이력을 상속하지 않은 현재 검수 세션에서 규칙·코드·기존 증거를 대조하고, 기존 스크립트의 읽기 입력과 쓰기 출력을 메모리로 격리하여 반례를 실행했다. 이번 검수는 새 V1/V2 문항 검산이나 새 브라우저 인증을 대신하지 않는다.
- 변경: 이 보고서·재현 스크립트·검수 evidence만 추가. production JS/SVG, 기존 규칙, 파이프라인 코드, 기존 보고서는 수정하지 않았다.

## 적용 기준과 확인된 정상 부분

MANIFEST에 등록된 운영 문서 **24개 모두 실제 byte count/SHA-256 일치**. 사용자가 지정한 9개 중 MANIFEST 자체를 제외한 8개도 포함된다. 버전·실제 크기·해시는 [audit-evidence.json](audit-evidence.json)의 `rulePreflight.rules`에 기록했다. MANIFEST 자체는 자기 해시 등록 대상이 아니다.

룰북 v2.6의 무결성·기존 자산 보호, Common v1.2.10의 blind math/same-SHA/C-D 분리, 도형추출 v3.0의 static/semantic/render 분리, Overlay v1.4의 qualification-only·typed fact·분모 closure, 적응형 배치 v1의 UID/revision/8문항 조건, 무결성검수 v1.7 및 수학 문항 오류 검증 v2.1을 대조했다.

현재 파일럿은 source SHA freshness 50/50, 정적 visual 29/29, NO_VISUAL 21/21로 집계되며 전역 adoption/production authority를 부여하지 않는 경계를 명시하고 있다. 그러나 이것은 독립 수학·semantic·render PASS의 증거가 아니다. 기존 evidence 계약 보고서도 `BLOCKED_UNTIL_WARNINGS_ADJUDICATED`를 명시한다.

## 반드시 수정할 문제와 acceptance criteria

### F01 — P1 — 규칙의 입력 가림·배치 크기·enum·우선순위 충돌

- 적응형 배치 §6.2는 V1에 source answer를 허용하지만 Overlay §2.2는 금지한다. Common §1.2 역시 A1 풀이 전에 answer 공개를 금지한다.
- Common §24는 `BUILD_BATCH_SIZE=5` 및 더 작은 Overlay 단위를 규정하지만 적응형 문서는 기본 8·최대 20을 제시한다. Overlay §39-1.4의 20~50은 blind review session 묶음으로 구분해야 하며 제작 배치 확대의 근거로 전용하면 안 된다.
- 적응형 `visualAction`의 KEEP/REBUILD와 Overlay의 `KEEP_EXISTING_SOLUTION_VISUAL`/REBUILD 등 enum이 다르다. 실제 batch-11은 `finalVisualRequirement`에 `KEEP_EXISTING`을 넣어 requirement와 decision을 섞는다.
- INDEX의 룰북 우선 순서, Overlay의 Common 우선 순서, preflight의 precedenceOrder가 일관되지 않는다. `verify-rule-preflight.mjs`는 적응형 문서·세부단원 운영규칙 등 해당 실행의 필수 입력을 완전히 결박하지 않는다.
- **Acceptance:** 현재 qualification/제작/review-session별 권위와 배치 범위를 한 가지로 해석할 수 있게 동기화한다. V1 source answer 금지, decision/requirement/action 간 명시적인 매핑을 스키마로 고정한다. 필수 rule ref의 버전·실제 bytes/SHA를 전부 검증하고 변경 시 관련 qualification을 stale 처리한다.

### F02 — P1 — UID/revision/canonical이 metadata 계약대로 판정되지 않음

- [registry builder](../../../archive/tools/logic-visual-audit/build-phase2-canonical-batch-registry.mjs:23)는 `_final` 파일명 우선, 배치 간에는 `higher_batch_no_wins`로 선택한다. 모두 revision=1/supersedes=null로 만들고 legacy batch 전체를 isCanonical=true로 둔다.
- 현재 registry의 최종 UID map은 50개지만 active canonical batch membership에는 **8 UID 중복**, legacy raw conflict **2건**이 남는다. 자동 선택 규칙을 적었다는 사실은 독립 adjudication 완료의 근거가 아니다.
- [manifest validator](../../../archive/tools/logic-visual-audit/validate-phase2-adaptive-batch-manifest.mjs:26)는 registry를 읽지 않고 inventory SHA의 형식만 검사한다. revision/supersedes lineage·실제 rule hash·위험도 자동 축소 조건을 검증하지 않는다.
- 격리 반례 4개가 모두 PASS: 기존 canonical UID 재사용+가짜 inventory SHA, revision=2/supersedes=null, manifestSha=null, 빈 UID+근거 없는 APPROVED sizeException. `PENDING_COMPUTE`도 통과한다.
- **Acceptance:** UID별 active revision 정확히 1개, active batch 간 중복 0; supersedes 대상 존재·동일 UID·revision 증가·evidence 변경·cycle 없음 검증. 두 conflict를 evidence에 근거해 adjudicate하고 구판 membership을 superseded로 만든다. inventory/manifest/rule SHA를 실제 재계산하며 네 반례가 모두 비정상 종료해야 한다. 고위험/혼합 schema 축소 조건과 승인 evidence 실재성도 검사한다.

### F03 — P0 — V1/V2 독립 관찰을 생성 코드가 대체함

- [batch-11 runner](../../../archive/tools/logic-visual-audit/run-phase2-batch-11.mjs:44)는 V1 source-only 입력에 미리 결정한 `expectedVisualRequirementSignal`을 넣고, 같은 스크립트의 상수로 `PASS_SOURCE_ONLY_TRIAGE`와 V2 보고서를 만든다. 분리된 reviewer/session 근거가 없다.
- [typed 보강 코드](../../../archive/tools/logic-visual-audit/build-phase2-batch-11-full-typed-semantic-parity.mjs:72)는 expected/observed를 같은 코드에 수기 입력하며, observed가 없으면 `fact.observed = fact.expected`로 복사한다. batch-11 required 6개 모두 `LEGACY_RECONCILIATION_NOT_FRESH_BLIND`이다.
- legacy provenance 경고를 기록한 것은 적절하지만 이 6/6은 독립 의미 검수 PASS가 아니다. 복사 전후 SHA 일치도 독립성 증거가 아니다.
- **Acceptance:** V1/V2를 별도 blind session으로 다시 수행하고 각 UID에 reviewer/session/input bundle SHA/first-pass SHA 및 시작·종료 artifact SHA를 결박한다. V1에서 answer·solution·builder signal을, V2에서 expected·answer·외부 alt/caption과 의미 유도 accessibility 설명을 숨긴다. 실제 artifact의 visible/computed semantics로 observed를 만든다. V3는 두 freeze 이후 실행하며 누락 observed 복사와 builder 자체 final PASS 경로를 제거한다.

### F04 — P1 — typed validator가 타입을 검사하지 않으며 semantic hash에 UID가 포함됨

- [validateFact](../../../archive/tools/logic-visual-audit/lib/canonicalize.mjs:42)는 필드 존재 중심이다. 숫자 questionUid, 잘못된 unit, 문자열 requiredLabels, null 원소 집합, 음수 freeCount를 가진 반례가 `pass:true`를 반환했고 동일 반례 간 parity도 일치했다.
- [projectSemantic](../../../archive/tools/logic-visual-audit/lib/canonicalize.mjs:53)에 questionUid가 들어 있어, 같은 의미·다른 UID의 semantic SHA가 다르다. Overlay §29가 요구하는 cross-UID shared equivalence 비교를 방해한다.
- caseRows를 caseId 기준으로 정규화하는 계약도 구현되지 않았다. projection에 사용하지만 schema가 구체적인 타입/내부 구조를 정의하지 않은 필드가 있다.
- **Acceptance:** visualType별 조건부 JSON Schema와 nested type/domain/enum/cardinality 제약을 실제 실행한다. 부정형 fixture가 모두 FAIL해야 한다. raw identity hash와 UID를 제외한 semantic hash를 분리한다. 같은 의미·다른 UID 및 의미 없는 case 행 순서 변경은 같은 semantic SHA, proof 순서·endpoint·방향·필수 영역 변경은 다른 SHA 또는 FAIL이어야 한다. spec 변경 시 재qualification한다.

### F05 — P0 — 최종 집계가 실제 C/D 실패를 PASS로 바꿈

- [final report builder](../../../archive/tools/logic-visual-audit/build-phase2-2022-set-pilot-final-report.mjs:83)는 render entry에 UID만 있으면 coverage에 넣는다. status, viewport, artifact/input SHA, witness를 검사하지 않는다.
- 같은 파일 :102는 `requiredNotRendered.length === 0`으로 **typed semantic parity PASS**를 만든다. semantic/item/denominator evidence를 읽어 판정하지 않는다. canonical/infrastructure의 실패·차단 상태도 overallStatus에 연결되지 않는다.
- 기존 파일을 바꾸지 않고 모든 render report 및 entry를 FAIL로 주입해 재실행해도 `PASS — 2022 SET VISUAL PILOT READY`, typed parity PASS, browser PASS가 유지됐다.
- **Acceptance:** canonical UID별 현재 valid frozen V1/V2/V3, C item, denominator, math 및 요구 render evidence를 실제 검증하고 축별로 집계한다. 어느 필수 증거든 FAIL/BLOCKED/NOT_TESTED/누락/stale/hash 불일치이면 최종 readiness PASS가 불가능해야 한다. 위 FAIL 주입 fixture는 overall FAIL 및 nonzero exit가 되어야 한다. 정적 coverage만 충족한 상태에는 static-only 판정명을 사용한다.

### F06 — P1 — 독립 수학 검산 기록과 C 시각 검산 연결이 미완료

- [evidence 계약 보고서](../../../archive/tools/logic-visual-audit/reports/phase2_evidence_contract_validation.json)는 batch-11 math verification을 `NOT_RECORDED_FOR_LEGACY_BATCH_11`로 명시한다.
- typed visual 6/6은 발문 성립·정답 유일성·보기 전수 검산을 증명하지 않는다. [validator](../../../archive/tools/logic-visual-audit/validate-phase2-evidence-contract.mjs)는 수학 manifest를 읽지 않고 경고와 미기록 상태를 상수로 출력하므로 실제 보완 완료도 자동 검증하지 못한다.
- **Acceptance:** 문항별 A1 blind solve 동결 → A2 정답/해설 비교를 독립 math manifest로 남기고 객관식 보기 전수·유일성·source conflict 결과를 기록한다. visual C와 별도 상태/입력 hash로 검증하며 동일 현재 candidate에 연결한다. 미검산·충돌은 명시적인 BLOCKED로 남아 readiness를 막아야 한다. 이번 보고서는 개별 문항의 수학적 오류를 단정하지 않는다.

### F07 — P1 — desktop/mobile 및 실제 sol render evidence 불충분

- [batch-11 render 기록기](../../../archive/tools/logic-visual-audit/record-phase2-batch-11-render-evidence.mjs:23)는 raw SVG URL, `screenshotObserved:true`와 PASS 문자열을 기록한다. 6개 required entry에 desktop/mobile viewport, 저장 screenshot/accessibility witness SHA가 없다.
- raw SVG 관찰은 `engine.html`의 실제 sol 삽입·문항 연결·font/MathJax·clipping 검증을 대체하지 못하며 `commonCoreDStatus:PASS`의 충분한 근거가 아니다. 기존 관찰이 없었다고 단정하는 것이 아니라 현재 재검증 가능한 증거가 부족하다는 판단이다.
- **Acceptance:** required UID마다 desktop ≥1280, mobile ≥390의 실제 sol render를 수행하고 viewport, mode, source/asset/engine 입력 SHA, screenshot 경로+SHA, layout/association/decode/font/MathJax/error 결과를 저장한다. qualification의 grayscale 및 80%/70% 가독성도 확인한다. NO_VISUAL은 exempt static을 닫되 production D가 필요한 경우 exam/solution/answer gate를 별도로 유지한다. witness 삭제·artifact 교체·mobile 누락 fixture는 FAIL이어야 한다.

### F08 — P1 — exact/structural 검출은 있으나 adjudication이 현재 의미에 결박되지 않음

- [structural audit](../../../archive/tools/logic-visual-audit/audit-phase2-structural-fingerprints.mjs)는 SVG text/title/desc를 제거한 geometry hash로 후보를 찾는다. text-only numeric 변화 후보를 잡는 용도는 있으나 transform/좌표가 다른 동형 구조, inline SVG/table까지 보장하지 않는다.
- [adjudicator](../../../archive/tools/logic-visual-audit/adjudicate-phase2-structural-fingerprints.mjs:11)는 두 geometry hash를 상수 승인 목록에 두고 hash가 같으면 RESOLVED를 재부여한다. 현재 UID membership·exact SHA·expected semantic SHA·문항 고유 fact coverage를 검사하지 않는다. 승인된 geometry에 잘못된 숫자를 넣어도 같은 승인 key가 유지될 수 있다.
- final report는 exact duplicate를 일괄 오류 처리해 Overlay의 review trigger 및 적법한 shared reuse 예외와도 다르다.
- **Acceptance:** exact/structural 후보마다 UID set·각 artifact SHA·expected semantic SHA·role/label·specificity coverage·reviewer evidence에 승인 identity를 결박한다. 하나라도 바뀌면 승인을 무효화한다. 동일 geometry/오류 numeric label, 정답만 교체, 불완전 complement, 동일 artifact/상이 expected, 허용 shared reuse, inline/table fixture를 검증한다. 같은 geometry family 자체만으로 오류라고 판정하지 않는다.

### F09 — P0 — C denominator의 dependency closure와 stale/re-freeze가 보장되지 않음

- [freeze-c-denominator](../../../archive/tools/logic-visual-audit/freeze-c-denominator.mjs)는 최종 map에서 VISUAL_REQUIRED만 선택해 attached/problem/shared OR closure를 버린다. 새 map으로 input SHA를 다시 만들지도 않는다.
- 격리 반례에서 기존 candidateRequiredUidSet의 `optional-attached`가 사라졌는데 status는 FROZEN이고 input SHA는 `OLD_INPUT` 그대로였다.
- `invalidate-c-denominator.mjs`는 합성 mutation을 별도 stale 파일로 기록하는 rehearsal이다. 현재 batch별 freeze는 artifact 일부를 hash하고 dependency false/map/parity/stale를 수기로 고정한다. 예컨대 batch-10은 SVG 하나만 release artifact로 hash해 content/answer/solution/alt/caption/rule/spec 변화를 잡지 못한다. 기존 artifact invalidation 기록은 유용하지만 전체 입력 변화에 대한 강제 재진입 게이트는 아니다.
- **Acceptance:** 현재 artifact와 독립 adjudication에서 네 OR membership을 계산하고 Core/Overlay UID-set을 대조한다. content/choices/answer/solution, attached/link/alt/caption, problem/shared dependency, schema/projection/canonicalization/extractor/verifier/rule 변경마다 affected C evidence·coverage를 INVALIDATED로 만들고 close를 차단한다. 재계산→새 UID set/input SHA freeze→필요 C 재검→coverage 재생성 순서를 자동 검증한다. 각 mutation 및 optional-attached/problem-only/shared-only fixture가 누락 없이 처리되고, UID set이 같아도 입력 변화면 stale이 되어야 한다.

## 다음 배치 전에 필요한 보완

1. **P0 3건(F03/F05/F09)**: 독립 evidence의 생성·집계·분모 재진입 경로를 먼저 닫는다. 현재 전체 PASS는 검증 근거로 사용하지 않는다.
2. **P1 6건(F01/F02/F04/F06/F07/F08)**: 규칙과 스키마/registry 계약 동기화, legacy conflict adjudication, blind 재검산, 실제 viewport evidence, 현재 artifact에 결박된 duplicate 검수를 완료한다.
3. **P2 문서 정리**: README의 Phase 1 실행 순서와 새 적응형 실행 경로·negative tests·판정 범위를 동기화한다. 예제/template의 `PENDING_COMPUTE`는 초안에만 허용하고 실행 가능한 manifest와 구분한다.
4. 수정된 검사기에서 이 보고서의 반례가 모두 거부되는 것을 확인한 뒤 **3~5문항 calibration**으로 V1→V2→V3→C freeze→render→canonical close 전체 경로를 검증한다.
5. 그 후 **동일 visual type/검증된 동일 projection의 KEEP_EXISTING 8문항**에 한해 진행한다. 신규 SVG·3집합·source conflict·복수 projection·unresolved revision은 위험도 기준으로 분리한다. plannedSize=8만으로 확대 승인하지 않는다.

## 재현과 증거

- [검수 evidence 및 rule/file SHA](audit-evidence.json)
- [읽기 전용 파이프라인 재현 스크립트](audit-repro.mjs)
- 실행: `node docs/reports/logic-visual-independent-audit-20260906/audit-repro.mjs`
- 출력 위치: 이 폴더의 `audit-evidence.json`만 갱신. 원래 파이프라인 보고서 쓰기는 VM 내부 메모리로 포착한다.
- 이번 판정은 문서·파이프라인의 **실패 통과 가능성**에 대한 FAIL이다. production 전체 문항의 오답 판정이나 Overlay ADOPTED/출시 승인에 해당하지 않는다.
