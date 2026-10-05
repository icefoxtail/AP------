# APMath Qualification & Seal 세부 구현계획 v1.1

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 08 / Qualification & Seal  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 32102c5e4f6016ed8ff3d4e85b367e084aa5814b`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-02, I-03, I-04, I-05, D-01, D-02, D-03  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 APMath Visual Production Engine의 여덟 번째이자 마지막 세부계획으로, Detail 01~07에서 구현한 모든 capability를 실제로 **지원 가능 / 미지원 / 부분지원**으로 판정하고, 대표 synthetic fixture·실제 Archive 문항·negative mutation·독립 reviewer·재현성·변경 영향 재검까지 닫은 뒤에만 시스템을 `PUBLICATION_READY`로 봉인하는 qualification 계획이다.

최종 체인:

```text
Problem → Visual Request
→ Construction / Graph
→ Typography
→ Measurement
→ Layout / Publication
→ One-Click Runner
→ Actual Archive
→ Independent Review
→ Qualification Matrix
→ Seal
```

이 문서의 핵심 원칙:

> **“구현됐다”와 “지원 자격이 있다”를 분리한다.**

코드가 존재해도:

- positive만 있고 negative가 없거나
- synthetic만 있고 real exam이 없거나
- builder self-check만 있고 independent observer가 없거나
- actual Archive evidence가 없거나
- QUALIFIED support matrix에 근거한 유효 Seal/ACTIVE projection이 없으면

정식 publication capability로 보지 않는다.

---

# 1. 최종 상태 정의

## 1.1 구현 상태

`NOT_IMPLEMENTED / IMPLEMENTED_UNQUALIFIED / QUALIFICATION_IN_PROGRESS / QUALIFIED / SEALED`를 유지한다. 구현 상태와 activation(ACTIVE/EXPERIMENTAL/DISABLED), 문항 result를 혼용하지 않는다.

## 1.2 문항 결과 상태

유일한 enum/reducer는 **D05 §24–26 / production/contracts.json**이다. D08에서 축약 enum을 다시 정의하지 않는다. STATIC_AUDIT_FAIL/RENDER_PENDING/READY_FOR_ARCHIVE_CHECK 등 원인을 보존하며, 이 개정에서 최초 qualification 종료 상태 `QUALIFICATION_COMPLETE`를 추가한다.

qualification 요청은 모든 필수축과 독립 review가 완료되어도 PUBLICATION_READY가 아니다. normal candidate의 PUBLICATION_READY는 유효 engine Seal/ACTIVE와 요청별 실제 evidence가 모두 필요하다.

## 1.3 시스템 Seal

`APMATH_VISUAL_PRODUCTION_ENGINE_v1 = SEALED`는 본 문서의 required scope/qualification/review를 닫은 시스템 상태다. case/component PASS나 문서 개정과 구분한다. production write/migration 권한은 부여하지 않는다.

## 1.4 최초 시험의 실행 경로

D05 §4.3의 `mode=QUALIFICATION`과 frozen qualification manifest로 아직 ACTIVE가 아닌 구현을 **동일 planner→runner→Actual Archive→review 경로**에서 시험한다. 미구현/disabled/manifest 밖 대상은 거부하고 나머지 품질 gate는 완화하지 않는다. Seal 생성 입력에 PUBLICATION_READY를 요구하지 않는다.

---

# 2. 현재 main의 qualification 자산

## 2.1 독립 static observer

`archive/tools/geometry-equation/audit_publication.py`

현재 특징:

- `visual_engine` import 없음
- final SVG bytes 직접 관측
- source/solution SHA 요구
- coordinate model 관측
- point/segment/angle/length/region 검증
- unsupported SVG feature fail-closed
- `publicationAuthorized = false`

이 독립성은 보존한다.

---

## 2.2 Python publication regression

`tests/test_publication.py`

현재 이미 포함:

- 5 fixture inventory
- deterministic rebuild
- annotation ordering byte parity
- same-value multi-owner
- measurement failure behavior
- coordinate evidence
- constructed realization
- independent auditor
- duplicate primitive
- source/solution SHA binding
- output scope

등.

---

## 2.3 standalone Chromium regression

`run-publication-browser.mjs`

현재:

- real Chromium
- standalone SVG
- actual display size
- font floor negative

을 수행.

그리고 명시적으로:

`NOT publication authority`

로 구분.

이 구분 유지.

---

## 2.4 actual Archive regression

`run-publication-archive.mjs`

현재:

- synthetic bank
- unmodified Archive engine
- `mode=sol`
- 1440×1000
- no screen-fit reference
- actual asset response SHA
- actual-size replay
- screenshot

을 수행.

이 기반을 Detail 06의 real UID qualification으로 확대.

---

## 2.5 GitHub Actions

현재 workflow:

`geometry-publication-tests.yml`

실행:

1. Python geometry regressions
2. Node geometry regressions
3. Playwright/Chromium
4. publication fixtures
5. standalone browser
6. actual Archive integration
7. source snapshot artifact

기반은 유지.

단 current branch trigger는 과거 feature branch 중심이므로
v1 production qualification에 맞게 path/PR trigger를 정리해야 한다.

---

# 3. Qualification Authority

최종 PASS authority는 단일 validator가 아니다.

다섯 축:

```text
A. Source / Semantic
B. Math / Construction / Graph
C. Typography / Layout / Artifact
D. Actual Archive Render
E. Independent Visual Review
```

모두 applicable PASS여야 한다.

---

# 4. 축 A — Source / Semantic

검증:

- stable question UID
- source SHA
- verified solution SHA
- source condition completeness
- decisive relation
- expected facts
- GIVEN/DERIVED/CONCLUSION
- visual necessity
- source figure sufficiency
- curriculum

---

## 4.1 authority

Detail 07의 FrozenVisualPlan과
source/solution bytes 직접 검토.

---

## 4.2 실패 예

- source point rename
- 빠진 조건
- 결론을 GIVEN 처리
- source/solution conflict
- blind visual ADD
- answer leakage

---

# 5. 축 B — Math / Construction

Geometry:

- typed DAG
- SymPy execution
- branch
- degeneracy
- exactness
- CindyJS independent cross-check
- final primitive audit

Graph:

- expression AST
- domain topology
- branch
- pole/hole
- axis/tick
- feature
- final curve parity

---

# 6. 축 C — Typography / Layout / Artifact

검증:

- fixed font
- MathJax fragment
- glyph
- baseline
- measured label
- owner binding
- collision
- clipping
- viewBox
- final SVG structure
- deterministic bytes

---

# 7. 축 D — Actual Archive

Detail 06:

- correct UID
- correct bank
- correct asset
- runtime closure
- desktop/no-fit
- actual loaded SHA
- screenshot
- replay
- pagination

---

# 8. 축 E — Independent Visual Review

machine PASS로 대체할 수 없는 것:

- decisive relation visibility
- visual naturalness
- owner ambiguity
- information density
- Korean/math readability
- educational usefulness
- black-and-white meaning
- source fidelity

---

# 9. Independent reviewer 조건

reviewer는 최소:

- builder 결과 freeze 후 접근
- builder self-verdict를 authority로 사용하지 않음
- actual Archive screenshot 기준

---

# 10. Review mode

`FRESH`

또는 validated changed-only reuse.

root qualification은 반드시 FRESH.

---

# 11. Qualification denominator first

작업 시작 전에 분모를 고정.

분모를 PASS 결과에 맞춰 줄이지 않는다.

---

# 12. Capability qualification matrix

각 row는 capability뿐 아니라 **실제로 지원을 주장하는 op/family/profile 조합의 범위**를 명시한다. 아래 placeholder는 구조 예시다.

```json
{
  "capabilityId": "...",
  "scopeRef": {"path":"...","sha256":"..."},
  "implemented": true,
  "syntheticPositive": 0,
  "syntheticNegative": 0,
  "realUidCount": 0,
  "requiredFeatureIds": [],
  "coveredFeatureIds": [],
  "independentAudit": "NOT_RUN",
  "archive": "NOT_RUN",
  "review": "NOT_RUN",
  "qualificationStatus": "QUALIFICATION_IN_PROGRESS"
}
```

숫자와 PASS는 실제 manifest evidence에서 계산한다. synthetic/component row는 applicable 범위와 real 대표 연결을 명시하고 미실행 축을 PASS로 꾸미지 않는다. Seal 입력은 모든 required row가 QUALIFIED인 **immutable matrix**다. ACTIVE 표시는 §90의 Seal-bound activation projection에 있으며, matrix hashed bytes를 덮어쓰지 않는다.

좌표기하 row는 coordinate-geometry-publication-v1 + equal-unit + geometry/owner + axis/tick 모두를 scope에 포함한다. coordinate graph의 curve-only PASS로 대체하지 않는다.

---

# 13. Detail 01 — Construction Kernel denominator

지원 op 각각:

- positive ≥1
- negative/degenerate ≥1
- cross-validator mutation ≥1

대상:

- line through points
- segment
- circle
- midpoint
- internal/external division
- perpendicular foot
- parallel/perpendicular
- angle bisector
- line-line
- line-circle
- circle-circle
- 3-point circle
- tangent
- supported transformations

---

# 14. Detail 02 — Graph denominator

함수 family마다:

- parse/evaluate
- topology
- sampling
- independent final curve audit
- publication render

대표:

- polynomial
- rational
- sqrt
- log
- abs
- exp
- trig supported subset
- two-function intersection
- calculus tangent

독립 curve audit에는 endpoints 외에 **선분 내부 오차 상계/검증 및 visible interval coverage**가 포함된다. budget 내 확인 불가를 PASS하지 않는다. 좌표기하 조합은 curve 없는 construction+axis로 별도 row를 두고 equal-unit/geometry/axis 관측을 함께 확인한다.

---

# 15. Detail 03 — Typography denominator

필수 semantic types:

- Korean
- integer
- negative
- fraction
- nested fraction
- radical
- exponent
- subscript
- prime
- Greek
- coordinate pair
- mixed Korean/math
- graph tick
- function label

owner-bound fragment cache에는 동일 문자열·다른 owner, 다른 UID의 같은 labelId, 같은 asset의 다중 occurrence를 포함한다. local ID uniqueness/namespace/hash/measurement 결박이 실제로 보존되어야 한다.

---

# 16. Detail 04 — Layout denominator

대표:

- point crowding
- same-value owners
- multi-angle
- reflex
- region
- dimension
- leader
- condition box
- dense graph
- viewport edge
- impossible case

---

# 17. Detail 05 — Runner denominator

대표:

- first-pass success
- repair 1
- repair 2
- repair 3
- stagnation
- resume
- cache
- invalidation
- unsupported
- toolchain unavailable
- visual exempt
- concurrent duplicate

추가: normal mode의 EXPERIMENTAL 거부, qualification mode의 frozen scope 내 실행, manifest 밖/disabled/미구현 거부, qualification 완료 후 PUBLICATION_READY 금지, Seal/activation hash 비순환, D07→D05 무수정 handoff.

---

# 18. Detail 06 — Archive denominator

대표:

- clean target
- wrong asset
- stale source
- stale runtime
- wrong UID
- duplicate asset path
- no-fit enforcement
- pagination shift
- replay equivalence
- external network failure

---

# 19. Detail 07 — Planner denominator

대표:

- geometry
- graph
- source sufficient
- exempt
- raster keep
- ambiguous branch
- source/solution conflict
- unsupported
- curriculum conflict

---

# 20. Synthetic fixture bank

기존 geometry 5개 보존:

- owner-triangle
- multi-angle-owner
- equal-length-owners
- fraction-point-T
- region-leader

추가 fixture는 capability별로 별도.

---

# 21. Synthetic fixture 원칙

synthetic은:

- 특정 contract를 정밀 검증
- deterministic mutation test
- edge/degenerate 재현

용도.

real exam qualification을 대체하지 않는다.

---

# 22. Real UID qualification

상위 계획의 geometry 중심 6 UID를 유지하고 graph 최소 4 UID를 더하여 **Geometry 6 + Graph 4 = 최소 10 unique generated-visual real UID**로 확장한다. 상위 계획 §12.3/§13도 동일하게 보완한다.

각 실제 source에서 planner부터 최종 generated SVG/Actual Archive/independent review까지 연결한다. 수동으로 완성한 facts를 삽입해 planner를 생략하지 않는다. 기존 유효 source/fact evidence 재사용은 D05 계약에 따라 허용한다. synthetic은 별도 분모다.

---

# 23. Real Geometry 최소 6 UID

유형:

1. source coordinates
2. constructed foot/midpoint
3. line/circle branch
4. tangent/circle
5. dense angle/length owner
6. fraction/root/Korean annotation

6개는 고유 UID를 유지하면서 여러 feature를 동시에 덮을 수 있다. 그중 최소 1개는 source상 가능한 **좌표축+원+직선/접선의 COORDINATE_GEOMETRY**를 포함하여 geometry+axis audit 조합을 실제 Archive에서도 확인한다. 해당 유형이 실제 6개로 덮이지 않으면 UID를 추가한다. 여기서 실제 UID나 수학 PASS를 미리 배정하지 않는다.

---

# 24. Real Graph 최소 4 UID

기본 선정 축은 유지한다.

1. polynomial/intercepts
2. rational pole/hole
3. domain boundary sqrt/log/abs
4. intersection/tangent/calculus

이 4개는 **개수 하한**이며 자동 feature coverage가 아니다. D02 §31의 7개 실제 feature 요구를 §26 matrix에서 별도로 충족해야 한다. 특히 무리함수 경계·두 함수 교점·접선/미분·exact tick이 실제 source에 있는지 확인한다. 합법적인 한 UID가 여러 feature를 덮는 것은 허용하며 부족하면 고유 UID를 추가한다.

---

# 25. Real Planner diversity와 control case 분리

generated visual ≥10 UID 안에서는 source figure present/absent 및 ADD/REBUILD를 실제 가능한 범위에서 다양화한다.

KEEP / RASTER_KEEP / EXEMPT / NEEDS_INPUT / UNSUPPORTED는 **별도 planner/runner control case**로 검증한다. 이를 generated Geometry 6/Graph 4의 빈자리로 세지 않는다. 필요 없는 visual을 억지로 새로 만들지도 않는다.

KEEP/RASTER가 그 자체로 적절한 source 처리인 것은 별도 판정한다. 이번 generated-SVG qualification 분모와 적용 gate가 다르다는 뜻이지 그 분기의 제품 가치를 낮추는 것이 아니다.

---

# 26. Real total denominator와 coverage matrix

minimum은 **10 unique real UID = Geometry ≥6 + Graph ≥4**다. 동일 UID를 양쪽 count에 중복 계산하지 않는다. 기본 category를 하나 지정하고 같은 UID의 다른 feature는 coverage로만 기록한다.

각 real row는 다음을 갖는다.

```text
UID / primaryCategory / sourcePath / sourceSha256 / solutionSha256
capability / publicationProfile / generatedVisualAction(ADD|REBUILD)
requiredFeatureIds[] / coveredFeatureIds[] / evidenceRefsByFeature
requiredTypographyIds[] / coveredTypographyIds[]
requiredLayoutIds[] / coveredLayoutIds[]
finalSvgSha256 / actualArchiveRef / independentReviewRef
```

| 분모 | 충족 조건 |
|---|---|
| Geometry UID | 고유 6개 이상, §23의 6축과 좌표기하 조합을 실제로 coverage |
| Graph UID | 고유 4개 이상, D02 §31의 7 real feature를 실제로 coverage |
| 전체 generated UID | 합집합 10개 이상; duplicate/KEEP/RASTER/EXEMPT 제외 |
| Typography/Layout feature | D03/D04 요구 feature와 실제 UID/capture/review의 대응을 기록 |
| Synthetic/negative/control | 각 별도 분모와 목적 gate evidence; real로 세지 않음 |

required feature 집합은 Phase 0에 고정한다. 검사 후 coverage가 비어 있으면 단순 UID 개수로 PASS하지 않는다. 4 graph UID로 7개 feature를 못 덮으면 추가 real UID를 선정한다. source에 없는 특징을 새로 그려 넣어 coverage를 채우지 않는다. 전체 typography/layout 유형의 synthetic coverage와 실제 대표 coverage를 구분하고 무조건 모든 조합의 Cartesian product를 생성하지 않는다.

---

# 27. 분모 고정 절차

Phase 0에서 scope/capability/profile, required feature, 실제 UID/source/solution bytes, category/선정 사유, synthetic/negative/control을 동결한다. 최소 10이라는 숫자뿐 아니라 coverage matrix의 required 집합을 동결한다.

`qualificationManifestRef`는 이 시험 generation과 engine/dependency/contract revision, 허용 실행 범위를 결박한다. actual planner가 나중에 만드는 plan SHA와 final SVG/capture/review는 실행 결과로 append/bind한다. 미래 결과를 먼저 PASS로 쓰지 않는다. 실제 UID는 구현 착수 시 main source에서 선정하며 이 문서의 placeholder를 실 UID로 세지 않는다.

---

# 28. 대체 규칙

선정 UID가 실제로 해당 capability가 아니면:

- denominator count 유지
- 같은 category의 다른 실제 UID로 교체
- replacement rationale 기록

---

# 29. 분모 축소 금지

진행 중 unsupported/FAIL이 나와도 10→9로 줄이거나 required feature를 삭제하지 않는다. 잘못 선정한 source는 §28에 따라 같은 category/coverage를 유지하는 실제 UID로 교체하고 사유를 기록한다.

기본 지원 scope 자체의 변경이 필요하면 qualification 시작 전 명시적으로 결정하거나, 기존 generation을 superseded로 보존하고 새 scope/generation으로 다시 동결한다. 실패 evidence는 삭제하지 않는다. 이번 v1.1은 Geometry 6/Graph 4 및 D02의 7 real feature를 축소하지 않는다.

---

# 30. Negative mutation matrix

최종 qualification은 PASS fixture만으로 불충분.

---

# 31. Geometry mutation

- point coordinate
- line
- branch
- tangent
- owner
- factRole
- condition

---

# 32. Graph / coordinate mutation

기존 expression/sample point/false branch/pole/hole/tick/axis scale/curve owner mutation을 유지하고 다음을 추가한다.

| mutation | 반드시 검출할 축 |
|---|---|
| 정확한 endpoints의 y=x² chord | independent segment-interior error |
| 200 exact samples + 중앙 y=100x² chord | 점 개수/길이 기준을 통과해도 interior error 검출 |
| endpoints+midpoint가 같은 y=x³-x chord | midpoint-only 검수 우회 거부 |
| visible branch/구간 일부 삭제 | domain coverage |
| 내부 오차 bound 예산 소진/미확정 | UNVERIFIED, PASS 금지 |
| 좌표축+원의 x/y unequal scale | coordinate equal-unit 및 실제 geometry audit |
| 좌표기하에서 geometry 또는 axis observer 생략 | required-audit completeness |

negative 결과는 목적 gate의 실제 errorCode에 결박한다. unrelated schema 오류로 종료한 것을 interior audit가 검출한 것으로 세지 않는다. 정상 counterpart가 실제로 통과해야 한다. 이 표는 구현할 시험 목록이며 아직 실행 결과가 아니다.

---

# 33. Typography mutation

- fraction numerator
- radical bar
- exponent scope
- glyph
- font hash
- baseline
- fragment SHA

추가: 같은 값의 다른 owner fragment cache 오염, 다른 UID/occurrence의 local ID 재사용, cache hit 뒤 owner/namespace 바꾸기, metadata 변경 후 이전 measurement SHA 재사용. 독립 fragment/owner/hash gate에서 거부한다.

---

# 34. Layout mutation

- label overlap
- owner swap
- clipping
- dimension crossing
- leader crossing
- required label remove

---

# 35. Archive mutation

- wrong UID
- wrong qid
- wrong asset
- stale CSS
- screen fit
- stale screenshot

---

# 36. Planner mutation

- missing critical fact
- conclusion→given
- visual exempt contradiction
- branch ambiguity erased

추가: 미정규화 mathPlanSkeleton handoff, D05/D07 schema 불일치, planSha를 independentFactHash로 대체, 검토되지 않은 새 branch를 옛 fact evidence로 승인, BC-foot를 AB-foot로 잘못 연결, coordinate geometry의 graph-only routing.

---

# 37. Mutation PASS 조건

각 mutation은 적어도 하나의 **의도된 독립 gate**에서 FAIL.

단 단순히 unrelated schema parser에서 먼저 FAIL하는 것만 반복하면
실제 semantic observer coverage가 부족할 수 있다.

---

# 38. Independent audit boundary

builder와 auditor는:

- math implementation
- result coordinates
- PASS verdict

공유 금지.

공유 가능:

- schema
- canonical serialization
- version constants
- policy ids

---

# 39. Static observer independence

현재 `audit_publication.py`처럼
production generator import 금지.

v2도 유지.

---

# 40. CindyJS independence

SymPy output coordinates를 CindyJS Free points에 복사 금지.

---

# 41. Graph observer independence

sampler branch output을 expected truth로 복사 금지.

frozen AST/topology로 final SVG를 독립 관측.

---

# 42. Typography auditor independence

producer fragment tree를 그대로 expected tree로 사용 금지.

---

# 43. Review independence

collector와 reviewer identity/phase 분리.

---

# 44. Qualification levels

## L0 — UNIT

schema / function / op.

## L1 — COMPONENT

capability isolated.

## L2 — PIPELINE

One-Click synthetic.

## L3 — ACTUAL ARCHIVE

real UID.

## L4 — INDEPENDENT REVIEW

student-facing final.

## L5 — SEAL

system matrix closed.

---

# 45. L0 Unit gate

모든 신규 module:

- positive
- invalid schema
- boundary
- deterministic

---

# 46. L1 Component gate

Detail별 internal completion gate:

- CONSTRUCTION_KERNEL_QUALIFIED
- GRAPH_PUBLICATION_CAPABILITY_QUALIFIED
- TYPOGRAPHY_CAPABILITY_QUALIFIED
- MEASURED_LAYOUT_CAPABILITY_QUALIFIED
- ONE_CLICK_RUNNER_QUALIFIED
- ACTUAL_ARCHIVE_INTEGRATION_QUALIFIED
- VISUAL_REQUEST_PLANNING_QUALIFIED

모두 PASS.

---

# 47. L2 Pipeline gate

synthetic request:

```text
question-like source
→ planner
→ runner
→ candidate
→ static
→ browser
```

수동 중간 file injection 금지.

---

# 48. L3 Actual Archive gate

frozen qualification manifest에서 선정한 **전체 generated real UID(최소 10)**를 각각 end-to-end로 확인한다. 필요한 feature coverage 때문에 추가한 UID도 같은 분모에 포함한다. 임의의 첫 10개만 통과시켜 완료하지 않는다.

---

# 49. L4 Review gate

각 real UID actual Archive screenshot 독립 review.

---

# 50. L5 Seal

모든 applicable capability matrix PASS.

---

# 51. Existing regression preservation

기존:

```text
python -m unittest discover ...
node --test ...
build_publication_fixtures.py
run-publication-browser.mjs
run-publication-archive.mjs
```

유지.

---

# 52. Legacy byte parity

v2 opt-in 도입만으로
legacy fixture bytes가 바뀌지 않아야 할 범위를 명시.

---

# 53. Intentional output change

production-v2 profile은 새 output이므로
legacy byte parity 대상이 아닐 수 있음.

대신 deterministic v2 golden SHA.

---

# 54. CI workflow v2

현재 `geometry-publication-tests.yml` 확장.

---

# 55. CI trigger

과거 feature branch 2개에만 묶이지 않도록:

- relevant PR
- visual engine path
- vendor dependency lock
- publication rules

변경 시 실행.

---

# 56. CI stages

1. schema/static lint
2. Python unit
3. Node unit
4. construction kernel
5. graph
6. typography
7. layout
8. runner synthetic
9. browser
10. synthetic Archive

---

# 57. Real UID tests in CI

실제 exam data가 repo에 있고 안정적이면
selected real qualification subset을 CI에 포함 가능.

비용/환경이 크면 release qualification에서 수행.

---

# 58. Dependency lock gate

검사:

- SymPy wheel hash
- mpmath
- CindyJS bundle
- MathJax
- font
- Playwright/browser

---

# 59. License gate

선택 OSS:

- license file 존재
- notice 필요 여부
- version/hash manifest

---

# 60. No network qualification

dependency 다운로드 단계 이후
runtime qualification은 external network 없이 실행 가능한지 검증.

---

# 61. Reproducibility

같은 frozen input에서:

- plan SHA
- model snapshot SHA
- fragment SHA
- layout SHA
- final SVG SHA

동일해야 함.

---

# 62. Browser reproducibility

screenshot SHA는 browser minor/environment 차이 가능.

따라서 reproducibility 핵심은:

- final SVG bytes
- DOM/layout facts
- target binding

---

# 63. Performance budget

GeoGebra-grade static engine이 지나치게 느리면 운영 불가.

v1 qualification에서 측정:

- planner
- construction
- graph
- typeset
- measurement
- layout
- browser
- Archive

---

# 64. 성능 gate

초기 v1은 strict SLA를 미리 발명하지 않는다.

Phase 0 benchmark 후:

- per-stage median
- p95
- worst representative

를 기록하고 운영 가능한 threshold를 고정.

---

# 65. Timeout test

각 heavy stage:

- bounded timeout
- clean failure
- resume

검증.

---

# 66. Memory/resource

large math fragment / dense graph에서
비정상 memory growth 없는지 확인.

---

# 67. Security/safety gate

- arbitrary eval 금지
- arbitrary sympify 금지
- arbitrary CindyScript 금지
- shell injection 금지
- path traversal 금지
- external href 금지
- unsafe SVG element 금지

---

# 68. Generated-only gate

qualification 중:

production exam/assets mutation = 0.

---

# 69. Git diff check

qualification 종료 시:

expected generated/test artifact 외 product mutation이 없는지 확인.

---

# 70. Review rubric

각 real UID:

### 1. MATH
- primitive mathematically correct

### 2. SEMANTIC
- decisive relation/factRole correct

### 3. OWNER
- labels/cues owner clear

### 4. TYPOGRAPHY
- math/Korean readable

### 5. COMPOSITION
- density/spacing natural

### 6. ARCHIVE
- actual display clean

### 7. EDUCATIONAL
- solution understanding improved

---

# 71. Review result

- PASS
- POLISH_REQUIRED
- FAIL

---

# 72. POLISH repair

review 이후 visual-only polish는:
changed target + dependency만.

전체 qualification 처음부터 반복하지 않는다.

---

# 73. FAIL repair

math/source FAIL은 해당 capability stage로 회귀.

---

# 74. Root review freeze

첫 independent review 전에 final candidate freeze.

review 도중 builder가 same bytes를 바꾸지 못함.

---

# 75. Re-review

수정 후 새 SHA.

old review 재사용 금지.

---

# 76. Changed-only requalification

변경 분류:

- math
- graph
- font
- layout
- runtime
- docs only

각 영향 범위만.

---

# 77. Render reuse

**D06 §52 / 기존 render-impact signature·root evidence 계약**을 그대로 소비한다. 별도 D08 reuse predicate를 만들지 않는다.

영향받은 SVG/source/runtime/profile/placement는 recapture한다. 영향 없는 동일 signature의 대상은 원본 run/attempt/bank/SVG/screenshot/review identity를 보존하고 verified reuse ref로 연결한다. 새 attempt 번호만으로 모든 screenshot을 다시 만들지 않는다. 같은 SVG SHA만으로 다른 페이지 배치를 무시하지 않는다. 불명확한 bank 영향은 현재 placement를 관측한 뒤 결정한다.

---

# 78. Global invalidator

font/MathJax/runtime/CSS 변경 시
affected render/review 전체 invalidate.

---

# 79. Construction kernel 변경

해당 op를 쓰는 graph/real UID 재검.

---

# 80. Graph sampler 변경

해당 graph family 재검.

---

# 81. Typography 변경

모든 해당 label family의:
measurement/layout/render 재검.

math geometry 재사용.

---

# 82. Layout engine 변경

representative layout fixtures + actual render.

---

# 83. Planner 변경

source semantic plan을 쓰는 real UID 재생성/compare.

---

# 84. Seal artifact

최종:

`qualification-seal.json`

제안.

---

# 85. Seal 구조

```json
{
  "schemaVersion": "apmath-visual-engine-seal-v1",
  "engineVersion": "...",
  "sourceRevision": "...",
  "capabilityMatrixSha256": "...",
  "dependencyManifestSha256": "...",
  "syntheticQualificationSha256": "...",
  "realQualificationSha256": "...",
  "reviewManifestSha256": "...",
  "status": "SEALED"
}
```

---

# 86. Seal prerequisites

- 평가한 code revision/engine dependency 및 기준 main 고정
- declared required scope와 coverage denominator 고정
- required capability rows가 모두 QUALIFIED인 immutable matrix
- applicable positive/negative/mutation 실제 결과 PASS
- real Geometry ≥6, Graph ≥4, 전체 unique generated UID ≥10 및 required feature coverage PASS
- 모든 real target의 Actual Archive와 independent visual review PASS
- unresolved release/qualification debt 없음, production mutation 0

**ACTIVE 상태나 PUBLICATION_READY case를 Seal의 선행 입력으로 요구하지 않는다.** 그것들은 유효 Seal 이후의 activation/ordinary-request 결과다. component/real qualification evidence의 유효성만으로 Seal을 닫는다.

---

# 87. Seal does not authorize production migration

Seal은 engine qualification.

기존 production exam SVG 전체 자동 migration 권한 아님.

---

# 88. Publication Ready 문항

D05 reducer가 다음을 모두 확인한 ordinary `PRODUCTION_CANDIDATE` 결과만 PUBLICATION_READY다.

- 동일 engine/dependency/profile scope의 유효 Seal
- 해당 capability/op/profile의 Seal-bound ACTIVE
- 요청별 source/fact/math/typography/layout/independent artifact audit가 모두 유효
- Actual Archive PASS 및 동일 bytes/placement의 독립 review PASS

QUALIFICATION 요청은 이 축들을 닫아도 QUALIFICATION_COMPLETE다. Seal 뒤에 동일 불변 artifacts를 ordinary 요청으로 사용할 때는 유효 evidence를 검증해 재사용할 수 있으며 필요 없는 재생성/전체 수학 재검을 하지 않는다. 새로운 source/solution/runtime/placement가 있으면 그 영향 범위는 다시 검증한다. 원래 qualification result 자체를 덮어쓰지 않는다.

---

# 89. Unsupported after seal

sealed engine도 범위 밖 문제는:

`UNSUPPORTED_CAPABILITY`

정상.

---

# 90. Capability activation — 비순환 승격

activation enum은 ACTIVE / EXPERIMENTAL / DISABLED다. 다음 순서를 고정한다.

```text
implementation exists (EXPERIMENTAL)
→ scoped QUALIFICATION request
→ applicable L0–L4 + actual evidence/review
→ immutable capability matrix: qualificationStatus=QUALIFIED
→ qualification-seal.json (그 matrix SHA 참조)
→ seal SHA를 참조하는 activation projection: effective ACTIVE
→ ordinary candidate의 request-specific PUBLICATION_READY 판단
```

Seal이 참조한 matrix는 QUALIFIED 상태의 bytes로 보존한다. 나중에 그 파일의 status를 ACTIVE로 수정해 SHA를 바꾸지 않는다. activation projection은 유효 Seal·scope·engine/dependency identity로 계산하거나 작은 별도 참조 artifact로 둔다. Seal이 자신의 hash 또는 미래 activation artifact hash를 다시 요구하지 않는다.

기존 engine의 유효 Seal/ACTIVE는 새 실험 기능 때문에 무조건 무효화하지 않는다. 새 revision/scope는 새로운 qualification 결과로 구분한다. 변경된 dependency가 기존 scope에 실제 영향이 있으면 changed-only 계약으로 처리한다.

---

# 91. ACTIVE 조건

scope에 선언된 op/family/profile 조합의 required qualification이 모두 닫힌 matrix와 그 matrix를 참조하는 유효 Seal이 있어야 한다. effective ACTIVE는 두 artifact 및 engine/dependency hash의 exact binding에서 계산한다. 수동 status 문자열 하나로 활성화하지 않는다.

이 조건은 ordinary 사용 자격이며 최초 qualification 실행의 선행조건이 아니다.

---

# 92. EXPERIMENTAL

구현은 있으나 아직 해당 scope의 유효 Seal/ACTIVE가 없는 상태다. D05 §4.3의 frozen qualification manifest 범위 안에서만 같은 실제 경로로 시험할 수 있다. production-ready 결과 권한은 없다. 미구현 capability를 experimental 이름으로 호출하지 않는다.

---

# 93. DISABLED

known failure / missing dependency.

---

# 94. Partial feature deception 금지

예:

circle-circle intersection만 PASS했다고
“circle construction fully supported” 금지.

---

# 95. Version bump

다음 변경 시 capability version bump 검토:

- math semantics
- layout semantics
- typography renderer
- audit contract
- runtime profile

---

# 96. Patch-level change

non-semantic docs/test fix는
모든 seal을 무조건 깨지 않을 수 있음.

impact analysis 필요.

---

# 97. Qualification manifest와 실행 결과의 분리

D05 §4.3의 qualificationManifestRef가 가리키는 것은 **실행 전에 동결한 입력 manifest**다. 최소 engine/dependency/contract revision, scope, synthetic/real case identity, source/solution input hashes, expectedStatus와 각 case의 required axes를 갖는다. 미래 plan/output/capture/review hash 또는 actualStatus를 이 입력 manifest에 넣어 선행 요구하지 않는다.

실행 후에는 별도 result evidence row로 입력 manifest SHA·case id·실제 plan/output/audit/review와 관측 결과를 결박한다. 다음은 **실행 전 placeholder 구조**이며 PASS 기록이 아니다.

```json
{
  "qualificationManifestSha256": "...",
  "caseId": "...",
  "inputSha256": "...",
  "planSha256": null,
  "outputSha256": null,
  "auditRefs": [],
  "reviewRef": null,
  "expectedStatus": "PASS",
  "actualStatus": "NOT_RUN"
}
```

input manifest는 불변으로 보존하고 각 attempt의 result를 별도로 동결한다. 기존 결과를 덮어쓰거나 새 output SHA를 옛 입력 manifest에 삽입해 hash 순환을 만들지 않는다.

---

# 98. Evidence storage

generated qualification root:

```text
archive/_generated/geometry-visual-engine/qualification-v1/
```

---

# 99. Source snapshot

CI/release qualification에서
source commit 기록.

---

# 100. Test artifact retention

CI artifact:
- manifests
- logs
- screenshots
- SVG
- review

보존.

---

# 101. Failure triage

FAIL report:

- capability
- test id
- stage
- exact error
- first failing artifact
- expected vs observed
- repair owner

---

# 102. No giant undifferentiated PASS

`ALL PASS` 한 줄 금지.

capability별 denominator 표시.

---

# 103. Final qualification report

표는 최소 6+4를 선정했을 때의 형식 예시이며 현재 실행 결과가 아니다. 실제 N/N은 frozen manifest 전체로 계산하고, 추가 UID가 있으면 그대로 늘린다. Planner row의 Archive N/A는 별도 renderer가 없다는 뜻일 뿐, 그 planner 결과를 사용한 real end-to-end Archive gate를 면제하지 않는다.

표 예:

| Capability | Synthetic | Negative | Real | Archive | Review | Status |
|---|---:|---:|---:|---|---|---|
| Construction | PASS | PASS | 6/6 | PASS | PASS | QUALIFIED |
| Graph | PASS | PASS | 4/4 | PASS | PASS | QUALIFIED |
| Typography | PASS | PASS | applicable | PASS | PASS | QUALIFIED |
| Layout | PASS | PASS | applicable | PASS | PASS | QUALIFIED |
| Runner | PASS | PASS | 10/10 | PASS | PASS | QUALIFIED |
| Planner | PASS | PASS | 10/10 | N/A | PASS | QUALIFIED |

---

# 104. Review denominator

real UID 전부 independent review.

sampling subset 금지.

---

# 105. Mutation denominator

핵심 semantic mutation family 전부 적어도 1개.

---

# 106. Support matrix denominator

이번 frozen scope에서 **지원 자격을 얻으려는 required capability/op/family/profile 조합 전부**다. 최초 qualification에서 아직 ACTIVE가 아니라는 이유로 분모에서 빼지 않는다. 기존 ACTIVE 범위의 영향을 받는 회귀도 포함하되 관련 없는 다른 프로젝트/미지원 조합은 범위 밖으로 명시한다.

---

# 107. Regression failure policy

기존 legacy regression fail이면
new v1 Seal 불가.

단 unrelated pre-existing global repo failure는
visual engine scope와 구분.

---

# 108. Baseline debt

qualification 시작 전에 existing visual test debt를 기록.

새 구현 탓인지 구분.

---

# 109. No false attribution

기존 실패를 새 engine FAIL로 잘못 세지 않음.
새 실패를 기존 debt로 숨기지도 않음.

---

# 110. Browser versions

qualification browser version 고정.

---

# 111. Cross-platform

v1 필수:
canonical CI environment + Windows dev smoke.

모든 OS byte equality는 필수 아님.

---

# 112. Windows smoke

실제 학원 Windows workflow가 있으므로:
runner/required dependencies 실행 smoke.

---

# 113. Linux CI

deterministic core/qualification canonical.

---

# 114. Font cross-platform

self-contained font/math로 OS font 차이 최소화.

---

# 115. Black-and-white diagnostic

대표 real UID에서 grayscale 확인.

색 없이 의미 유지.

---

# 116. Small-size diagnostic

publication gate는 desktop actual size.

추가 축소 preview는 보조 diagnostic.

---

# 117. Accessibility

title/desc 존재.
alt/caption actual Archive.

---

# 118. Alt/caption review

solutionImageAlt/caption이
그림 설명과 맞는지 대표 real UID 검수.

---

# 119. Source fidelity

PROBLEM_VISUAL capability를 활성화할 때만
별도 exam-mode denominator 필요.

v1 solution visual seal과 혼동하지 않는다.

---

# 120. v1 scope 선언

이번 Seal의 기본 scope:

**SOLUTION_VISUAL static geometry + function graph/coordinate axis + typography/publication**

명시 포함: 축이 있는 Euclidean 좌표기하(원/각도/거리/직선/접선)와 coordinate-geometry-publication-v1. 명시 제외: 동일 축 위 함수 curve와 Euclidean circle/angle이 섞인 아직 qualified되지 않은 조합. 순수 함수 graph의 aspect policy와 좌표기하 EQUAL_UNIT을 혼용하지 않는다.

---

# 121. v1 제외 scope

- interactive
- 3D
- general conic
- arbitrary implicit
- GeoGebra file
- full CAS
- universal constraint solver

---

# 122. Scope manifest

seal에 explicit unsupported list 포함.

---

# 123. Phase 0 — denominator freeze

완료:

- capability list
- synthetic list
- generated real UID 전부(최소 10)
- mutation matrix
- browser/runtime version

추가 동결: mode별 실행 허용, D05 공통 handoff, owner-bound cache identity, coordinate profile required audits, UID×required-feature matrix. geometry 1건과 graph 1건을 조기 vertical slice로 골라 실제 UID 입력부터 연결하되 최종 선정 generated UID 전체 denominator(최소 10)를 줄이지 않는다.

---

# 124. Phase 1 — L0/L1

Detail 01~07 component qualification.

---

# 125. Phase 2 — L2

One-click synthetic end-to-end.

---

# 126. Phase 3 — L3

선정 generated real UID 전부(최소 10)의 actual Archive.

---

# 127. Phase 4 — L4

선정 generated real UID 전부(최소 10)의 independent review.

---

# 128. Phase 5 — targeted repairs

changed-only.

---

# 129. Phase 6 — final rerun

affected tests + final smoke.

---

# 130. Phase 7 — Seal

manifest + report + docs.

---

# 131. Re-seal policy

future change:
impact analysis → affected qualification → new seal.

---

# 132. Emergency rollback

new engine capability defect면:
capability registry를 DISABLED로 내리고
legacy production을 깨지 않는다.

---

# 133. Legacy coexistence

v1 production은 opt-in until seal.

seal 후에도 legacy input compatibility 유지.

---

# 134. Final docs update

Seal 후:

- skill
- Visual Contract
- publication profile
- support matrix
- engine docs

를 실제 구현과 맞춤.

---

# 135. Historical plan status

1~8차 planning docs는 HISTORY/IMPLEMENTATION SOURCE로 보존.

runtime canonical과 혼동하지 않는다.

---

# 136. Git qualification commit policy

구현 작업은 project Git rules 준수.

qualification artifact 중 대용량/generated는 Git에 넣지 않고 CI artifact/Library 사용.

---

# 137. Final completion criteria

다음 모두:

- [ ] Detail 01~07 internal qualification PASS
- [ ] Seal 입력용 QUALIFIED matrix와 Seal-bound ACTIVE projection을 분리해 고정
- [ ] synthetic positive/negative matrix PASS
- [ ] semantic mutation matrix PASS
- [ ] real Geometry 6 UID PASS
- [ ] real Graph 4 UID PASS
- [ ] 선정 generated real UID 전부(최소 10) actual Archive PASS
- [ ] 선정 generated real UID 전부(최소 10) independent visual review PASS
- [ ] stable questionUid/source/solution/final SVG/runtime/screenshot hash chain
- [ ] Construction SymPy↔CindyJS independent cross-check PASS
- [ ] Graph topology/final curve independent audit PASS
- [ ] fixed typography/glyph/baseline qualification PASS
- [ ] measured layout required label 누락 0
- [ ] actual desktop label 11 CSS px floor PASS
- [ ] hard collision/clipping 0
- [ ] final SVG deterministic reproduction PASS
- [ ] changed-only invalidation/review reuse qualification PASS
- [ ] stale source/font/runtime/asset negative PASS
- [ ] generated-only write / production mutation 0
- [ ] dependency version/hash/license manifest complete
- [ ] no external runtime network dependency
- [ ] v1 unsupported scope 명시
- [ ] capability matrix / qualification report / seal manifest frozen
- [ ] `PUBLICATION_READY`는 independent review까지 닫힌 결과에만 사용
- [ ] engine Seal이 production migration 자동 권한이 아님

- [ ] D05/D07 공통 schema·hash·typed normalizer handoff가 무수정으로 연결된다.
- [ ] 최초 EXPERIMENTAL qualification이 동일 pipeline에서 가능하며 공개 준비 권한은 부여하지 않는다.
- [ ] Seal→activation 경로에 hash/상태 선행조건 순환이 없다.
- [ ] Graph final 선분 내부 오차/visible coverage 및 midpoint-alias negative가 닫힌다.
- [ ] 좌표기하의 equal-unit + geometry/axis 동시 관측이 synthetic과 실제 UID에서 닫힌다.
- [ ] owner-bound cache의 다중 owner/UID/occurrence 충돌이 검출된다.
- [ ] generated UID 전체 개수(최소 10)와 Graph 7 feature/typography/layout coverage를 별도 확인한다.
- [ ] EXEMPT/KEEP/RASTER 및 source/unsupported control case는 generated denominator에 포함하지 않는다.

---

# 138. 이 단계에서 하지 않는 것

- 구현 자체 재설계
- 새로운 math backend 추가
- 테스트 분모 PASS 맞춤 축소
- synthetic만으로 Seal
- reviewer 생략
- unsupported 강제 성공
- production exam 자동 migration
- 모든 legacy SVG 재제작
- mobile을 publication authority로 승격
- CI PASS 숫자를 실제 교육 품질의 대리값으로 사용

---

# 139. 최종 산출물

최소:

```text
capability-matrix.json
dependency-manifest.json
qualification-denominator.json
synthetic-results.json
mutation-results.json
real-uid-results.json
archive-evidence-manifest.json
independent-review-manifest.json
qualification-report.md
qualification-seal.json
```

---

# 140. 최종 한 문장

> **APMath Qualification & Seal v1은 테스트 수를 많이 만드는 단계가 아니라, 구현된 각 capability의 지원 범위를 먼저 고정하고 synthetic·negative·real Archive·독립 review를 모두 통과한 범위만 ACTIVE로 봉인해, `PUBLICATION_READY`라는 상태가 실제 수학 정확성·조판 품질·제품 렌더 증거를 함께 의미하도록 만드는 최종 release gate다.**