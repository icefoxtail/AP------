# APMath Construction & Visual Production Engine — 상위 아키텍처 재검토

검토일: 2026-10-05 (Asia/Seoul)  
기준: `0bb88da58e41ae1154911d4e711f6247e60e5f16`  
범위: 계획 00–08 v1.1, 해당 커밋의 geometry/publication/Archive/pipeline-core 구현·테스트·계약  
결과: **큰 아키텍처는 유지. 실행 경계·초기 통합·검증 비용 계약을 보강한 계획으로 구현 착수 권장.**  
이번 산출물: 9개 계획서 보강 + 이 보고서. 제품 코드 수정·production 자산 수정·신규 엔진 Seal 없음.

## 1. 종합 판단

계획의 방향은 좋다. 이미 있는 semantic model, sampler, annotation owner, layout, composer, 독립 primitive observer, 실제 Archive collector를 보존하고 부족한 실행 연결을 채우려는 선택은 적절하다. source 조건과 실제 SVG primitive를 분리해 검증하고, 자동 build 성공과 독립 review/출판 준비를 분리한 것도 유지해야 한다.

그러나 원래 v1.1을 그대로 구현 지시로 사용하기에는 중요한 연결 계약이 남아 있었다. 가장 큰 위험은 잘못된 OSS 선정이 아니라 **각 Detail이 합리적인 기능을 약속하지만, 경계를 통과하는 실제 데이터·표시 크기·승인 근거의 구현 부담을 작게 본 것**이다. 특히 아래 세 가지는 후반 재설계를 일으킬 수 있다.

1. Node/Python의 hash·exact scalar·reference·cache projection이 일치하지 않음.
2. 원문 의미→좌표 실현→표기 의미→실제 Archive 크기가 서로 독립적인 후속 단계처럼 다뤄짐.
3. 부분 재검·qualification의 엄격한 표현을 실제 existing API가 이미 제공하는 능력으로 오인할 여지.

이를 해결하려고 새로운 대형 계층을 추가할 필요는 없다. 단일 runner, 기존 Python build worker, 격리된 observer, 기존 Archive renderer를 중심으로 **얇은 adapter와 명시적 계약**을 보강하는 편이 더 낫다.

## 2. 확인 범위와 실행한 검증

원격 main을 fetch하여 사용자 지정 SHA와 일치함을 확인했다. 원래 workspace의 HEAD는 `dca99a0a863be93cfbb694b10cd936e259073841`이었으므로 기준 SHA의 별도 worktree에서 검토했다. 기존 사용자 작업 파일은 건드리지 않았다.

계획 9개의 본문·예시·추가 통합 계약을 읽고 다음 구현을 대조했다.

| 영역 | 직접 확인한 주요 파일 |
|---|---|
| 수학/표기/build | `visual_engine/math_expression.py`, `geometry_model.py` 관련 호출, `semantic_model.py`, `coordinate_evidence.py`, `function_sampling.py`, `engine.py` |
| publication/layout | `publication.py`, `label_layout.py`, `viewport.py`, `entrypoints.py`, `past_exam_adapter.py`, `config.py`, `PUBLICATION_PROFILE.md` |
| 독립 관측 | `audit_publication.py`, geometry Python/Node tests, browser/layout observer의 사용 계약 |
| Archive | `build-visual-render-matrix.mjs`, `record-visual-browser-evidence.mjs`, `visual-browser-runtime.mjs`, `run-publication-archive.mjs`, `archive/engine.html`의 이미지 크기·fit 경로 |
| 공통 infrastructure | `pipeline-core/canonical.mjs`, `question-uid.mjs`, `runtime.mjs`, `render-impact.mjs`, prepare/registry 연결, 공통 실행 계약·AGENT_BUDGET |
| 정본/CI/dependency | Visual skill, 도형추출의 관련 규정, `.github/workflows/geometry-publication-tests.yml`, MathJax vendor의 SVG component 유무 |

실행 결과:

| 검사 | 결과 | 해석 |
|---|---|---|
| `python -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_*.py'` | **118/118 PASS** | 현재 geometry Python 회귀 |
| `node --test archive/tools/geometry-equation/tests/*.test.mjs` | **48/48 PASS** | adapter/독립 관측/layout 등 현재 Node 회귀 |
| `python archive/tools/geometry-equation/tests/build_publication_fixtures.py` | **5/5 static PASS** | 생성 결과는 모두 `CANDIDATE_REQUIRES_QA` |
| 표기/hash/render-impact 진단 | 아래 R1/R3/R5 재현 | 제품 파일 변경 없이 현재 함수 호출 |
| 문서 diff/연결 확인 | 수행 | 신규 runtime 검증을 대신하지 않음 |

실제 browser/Archive capture, source 문항의 독립 수학 풀이, 새 SymPy/CindyJS 전체 op adapter 실행, 새 typography 전달 qualification은 이번에 수행하지 않았다. 이 worktree와 원래 workspace의 `node_modules/playwright`는 없었다. 다른 위치의 browser/runtime까지 부재라고 단정하지 않으며, 이번 계획 검토를 위해 새 dependency를 설치하지 않았다. 기존 문서의 OSS 실행 실험도 이번에 재실행한 것으로 세지 않는다.

## 3. 구현 전에 반영해야 할 결정

### R1. Node/Python wire와 hash 규격을 먼저 닫아야 한다 — 중요도 높음

근거: [PC canonical](../../archive/tools/pipeline-core/canonical.mjs), [Python engine](../../archive/tools/geometry-equation/visual_engine/engine.py), [legacy adapter](../../archive/tools/geometry-equation/visual_engine/past_exam_adapter.py).

현재 동일한 의미의 객체를 넣어도 결과가 다르다.

```text
입력: {x: 1.0, z: -0.0, s: decomposed e + combining acute}
Python canonical: {"s":"e\u0301","x":1.0,"z":-0.0}  (Unicode 표시를 escape한 진단)
Node canonical:   {"s":"é","x":1,"z":0}
GE hash: bare hex / PC hash: sha256: prefix
```

또 PC `readBoundFile`은 `{path, bytes, sha256}`를 요구한다. 계획의 `{path,sha256}`만 그대로 쓰면 existing helper를 호출할 수 없다. 이는 기존 두 경로가 각각 틀렸다는 뜻이 아니라 **새 통합 경계가 필요하다는 증거**다.

결정: 새 object hash authority는 Node PC canonicalizer에 둔다. Python payload는 validate 후 canonical blob으로 freeze하며 observer는 그 raw blob을 결박한다. legacy hash는 해당 버전 의미로 검증하고 adapter로 감싼다. rational/큰 정수/exact expression은 typed wire로 전달하고 SymPy 문자열을 실행하지 않는다. D05 §75에 반영했다.

### R2. 좌표 없는 도형의 realization과 숨은 dependency가 불충분하다 — 중요도 높음

계획은 source/free/derived를 구분하고 임의 좌표 입력을 금지한다. 좋은 원칙이지만, D07은 자유도만 선언하고 D01 normalizer는 의미를 추측하지 않는다면 **원문에 좌표가 없는 첫 도형의 anchor와 자유값을 누가 어떤 재현 가능한 방식으로 만드는가**가 필요하다.

또 SELECT_POINT guard가 참조하는 A/B가 `inputs=[intersectionResult]` 밖에 있다. inputs만으로 DAG/cache를 만들면 guard 변경 시 잘못된 branch가 재사용될 수 있다. scalar args의 node refs도 같다.

결정: 범용 solver 대신 closed realization recipe를 기존 op로 전개한다. normalization/metric inputs/허용 대칭/실제 자유 parameter를 freeze하고 독립 검증한다. source의 다해 ambiguity와 의미를 보존하는 좌표계 선택은 구분한다. typed ref inventory는 inputs·args·branch·constraints 전부 포함한다. D01 §23/D07 §104에 반영했다.

### R3. MathJax 도입만으로 표기 의미가 보장되지는 않는다 — 중요도 높음

근거: [math_expression.py](../../archive/tools/geometry-equation/visual_engine/math_expression.py).

직접 호출 결과:

```text
parse("pi") → TeX "pi"                 # evaluator는 π로 해석
parse("π")  → TeX "\\pi"
parse("40°") → UNSUPPORTED_MATH_TOKEN
programmatic Mul(Add(x,1),2) → "x+1\\cdot 2"
위 AST의 x=3 계산값은 8, 출력 표기의 통상 의미는 5
```

마지막 사례는 현재 source parser가 괄호를 보존하는 일반 경로 전체가 틀렸다는 주장이 아니다. **새 normalizer/SymPy adapter가 programmatic AST를 만들 때 발생하는 실제 serializer 경계 문제**다. `40°`도 현재 publication 전체가 degree를 못 그린다는 뜻이 아니라 generic scalar parser의 실제 범위다.

같은 serializer로 producer/reference fragment를 둘 다 만들면 이 오류는 둘 다 같은 잘못된 표기를 만들어 통과할 수 있다.

결정: 계산 scalar와 notation의 적용 범위를 구분하고 constants/entity labels/degree·unit/연산 결합을 typed하게 전달한다. precedence-aware serialization 및 source에서 고정한 별도 expected notation 테스트를 추가한다. 기존 Expr를 좁게 확장하며 범용 TeX parser를 만들지 않는다. D03 §39에 반영했다.

### R4. Archive 표시 크기는 최종 검사 항목이면서 초기 layout 입력이어야 한다 — 중요도 높음

근거: [engine.html](../../archive/engine.html)의 `.image-medium`과 `solutionImageSize` 기본 처리, [publication.py](../../archive/tools/geometry-equation/visual_engine/publication.py)의 기본 canvas/font.

Archive size 미지정은 medium으로 가며 max-height=145px다. 예를 들어 390×360 SVG의 16 user-unit label은 높이 제약만 반영해도 `16×145/360≈6.44 CSS px`다. 자체 SVG에서 보기 좋은데 actual Archive에서만 계속 실패할 수 있다. canvas 확장으로 clipping을 고치면 가독성이 더 나빠질 수도 있다.

계획은 actual-size font gate와 size repair를 이미 인식한다. 보강점은 **이 정보를 먼저 전달하는 소유권과 수렴 계약**이다.

결정: D06의 bound runtime/승인 size policy에서 DisplayEnvelope를 먼저 얻어 D03/D04에 준다. 마지막 실제 image content transform으로 재확인하고 달라진 projection/sampling/layout만 재실행한다. tick/panel 증가 시 새 inventory가 필요하며 font 변경이 frame을 바꾸면 graph sampling cache도 무효다. D04 §54/D06 §89에 반영했다.

### R5. existing render-impact는 촬영 전 영향 분석기가 아니다 — 중요도 높음

근거: [render-impact.mjs](../../archive/tools/pipeline-core/render-impact.mjs).

`renderSignatureMap`은 screenshot hash·runtime response·asset·blocks가 있는 current capture를 요구한다. placement만 넣은 직접 호출은 `ACTUAL_CAPTURE_WITNESS_REQUIRED`로 거부됐다. 기존 함수는 **이미 생성된 capture 사이의 검증된 review reuse**에 유용하다. 새 screenshot 없이 selective capture를 결정하는 기능까지 이미 구현된 것은 아니다.

결정: 초기에는 affected bank의 current placement/capture를 실제 수집하고 이 함수로 fresh review 범위를 줄인다. 촬영 자체를 생략하는 최적화는 별도 observed-placement 계약을 검증한 후에 한다. reflow는 다음 문항 한 개를 넘어 모든 영향 continuation까지 추적한다. old screenshot hash를 current로 복사하지 않는다. D06 §89에 반영했다.

### R6. 캐시 키가 부분 재검 의도와 충돌한다 — 중요도 높음

D05 기존 math key는 전체 plan SHA를 포함하지만, plan SHA에는 label/display/profile도 포함한다. 따라서 label-only 변화에도 math cache miss가 나며 “math 재사용” 요구와 맞지 않는다. 반대로 branch/args의 숨은 참조를 빼면 false reuse다.

font subset을 asset 단위로 만들면 한 글자 변경으로 font bytes가 바뀌어 모든 관련 text fragment가 영향받는다. owner 한 개만 invalidate하는 단순 규칙은 부족하다.

결정: whole-plan identity/provenance와 stage input projection hash를 분리한다. calculation reuse와 authority/review reuse도 분리한다. observer 코드·정책 변경도 audit key에 포함한다. cold build를 기준으로 warm cache 동등성을 확인한다. node/local layout 미세 cache는 성능상 필요가 확인된 뒤 적용한다. D03 §39/D05 §75에 반영했다.

### R7. graph의 독립 오차 보증은 별도 수학 구현 비용으로 봐야 한다 — 중요도 높음

선분 내부 오차·visible coverage를 검증하겠다는 목표는 옳다. finite sample만 확인하는 기존 observer보다 강한 gate가 필요하다. 다만 “family별 보수적 bound 또는 enclosure”는 구현 방법이 저절로 생기는 요구가 아니다.

현재 sampler는 float 기반 polynomial root isolation, 고정 tolerance, chord clipping을 사용한다. 고차/중근/가까운 근, sqrt의 singular endpoint, viewport 밖으로 나갔다 다시 들어오는 함수에서 별도 대응이 필요하다. sampling의 clipped endpoint는 원곡선 exact point가 아닐 수 있어 무조건 exact vertex parity를 강제하면 정상 결과도 실패한다.

결정: family별 grammar/domain/feature/bound method/limits를 실행 가능한 spike로 먼저 잠근다. 다항→유리→sqrt 경계부터 확인하고 실제 검증된 조합만 활성화한다. 수학적 branch와 visible component, source endpoint와 viewport clipping을 분리한다. full v1 목표를 몰래 줄이지 않으며 미완 family는 미지원으로 보고한다. D02 §37에 반영했다.

### R8. UID-only planning과 독립 검토는 실제 호출 adapter가 필요하다 — 중요도 높음

`question-uid.mjs`는 identity validation/mapping을 제공하지만 전체 repo의 current registry와 verified solution을 찾아주는 서비스가 아니다. D07의 strict JSON/낮은 temperature도 provider 호출·복구·승인 근거를 대신하지 않는다.

결정: 기존 parent worker/provider continuation을 재사용하는 최소 adapter를 최초 vertical slice에서 검증한다. configured authority refs/provider가 없으면 정확한 대기/미지원 사유를 반환한다. 새 AI 서비스 구축을 암묵적으로 추가하지 않는다. fresh LLM planning의 동일 bytes를 요구하지 않고 frozen plan부터 deterministic replay를 보장한다.

독립 source 검토는 planner의 condition 목록만 재검사하면 안 된다. 원문과 필수 source image에서 조건을 다시 확인한 뒤 proposed plan과 대조해야 한다. 두 backend가 같은 잘못된 graph에 동의하는 공통 오류는 이 경계에서 잡는다. D07 §104에 반영했다.

### R9. 불변 attempt와 Seal은 운영 수명까지 정의해야 한다 — 중요도 중간~높음

generated-only·append-only는 필요하지만 partial multi-file write/동시 writer/crash를 해결하는 전체 transaction은 아니다. 최대 3회 repair와 attempt-01~03 예시도 최초 build를 포함하는지 모호했다.

또 exact Git revision 결박과 docs-only/changed-only reuse는 scope fingerprint 없이 충돌한다. 현재 CI artifact retention은 14일인데, Seal이 참조하는 evidence가 사라지면 나중에 유효성을 재확인할 수 없다. hash는 승인 주체의 인증도 아니다.

결정: staging→검증→manifest 마지막 atomic commit, 최초 build+최대 3 repair, 단일 controller, timeout worker 회수, durable evidence ref, scope implementation/dependency fingerprint, 승인 registry/revocation을 정의했다. 새 플랫폼을 구축하는 대신 기존 infrastructure를 사용한다. D05 §75/D08 §141에 반영했다.

## 4. 유지할 OSS·구조 선택

- **SymPy:** exact construction과 Python 기반 기존 코드에 적절하다. 범용 solve를 약속하지 말고 허용 op/expression·시간 한도를 둔다. Geometry API가 있다는 사실과 모든 symbolic 입력을 안전하게 해결한다는 보장은 다르다. [공식 Geometry 문서](https://docs.sympy.org/latest/modules/geometry/index.html).
- **CindyJS:** production renderer가 아니라 독립 numeric peer로 유지한다. 두 번째 adapter의 비용은 존재한다. 전 op가 이미 지원된다고 가정하지 않고 기본 전략을 실제 qualification한다. master가 허용한 기존 독립 observer 대안은 op별 명시·검증된 전략으로만 둔다. [공식 저장소](https://github.com/CindyJS/CindyJS).
- **MathJax SVG:** 조판 dependency로 적절하다. local/none cache 및 deterministic local id를 검증하고 Archive 본문 CHTML을 교체하지 않는다. 공유 typesetter의 glyph parity와 독립 수학 의미 검증을 구분한다. [공식 SVG 옵션](https://docs.mathjax.org/en/v4.0/options/output/svg.html).
- **graphlib:** DAG 스케줄링 재사용은 적절하다. stable ordering·모든 참조 수집·branch policy는 APMath 책임이다. [공식 graphlib 문서](https://docs.python.org/3/library/graphlib.html).
- **기존 sampler/layout/composer:** 재작성보다 opt-in 확장한다. 생성기와 observer의 수학 구현 중복은 의도된 독립성으로 유지한다.

공식 자료는 역할 판단을 확인하는 데 사용했다. 과거 계획에 기록된 특정 배포물의 checksum/모든 연산/라이선스 전이 의무를 이번에 다시 인증한 것은 아니다. 설치 버전을 새 latest로 변경하지 않았다.

## 5. 더 단순하고 강한 구현 전략

권장 실행 구조는 다음이다.

```text
기존 parent/provider → source 검토와 semantic plan freeze
                     ↓
Node runner: identity / typed contracts / hash / receipts / resume
  ├─ Python: construction 또는 기존 graph → model snapshot
  ├─ Typesetter + measurement → frozen fragments/metrics
  ├─ Python publication/layout/composer → immutable SVG
  ├─ 격리 observer: source mapping / math / notation / actual primitive
  └─ 기존 Archive collector → current capture → 독립 review → reducer
```

capability profile은 renderer 복제본이 아니라 required audit 집합을 합성하는 descriptor로 둔다. Geometry/Graph/Coordinate Geometry의 수학 차이는 유지하면서 typography/layout/Archive를 공유한다. 함수+Euclidean 복합은 현 v1 미지원으로 정직하게 남기되 미래 profile 조합을 위해 공통 model frame/owner identity는 보존한다.

처음부터 node cache·spatial placement cache·선택적 무촬영 reuse를 모두 구현하지 않는다. 작은 graph 전체 재계산/asset 전체 layout은 합리적 기본이다. expensive typesetting/browser/Archive를 먼저 stage 단위로 재사용하고 측정 결과로 세분화한다. 이는 changed-only 검토 원칙을 포기하는 것이 아니라 계산 최적화와 검토 scope를 분리하는 것이다.

schema의 버전/요청·결과 enum/required axes는 D05가 소유하고 specialized math schema는 D01/D02에 둔다. 같은 payload를 여러 문서/설정 파일에서 서로 다른 authority로 정의하지 않는다. 미래 plugin framework, microservice, 범용 수학 prover는 필요 없다.

## 6. 구현 중 조정해도 되는 항목

| 항목 | 조정 가능한 범위 | 유지할 제약 |
|---|---|---|
| Korean font 전달 | subset embed 실험 후 outline 선택 | 고정 bytes·실제 img/replay 동등성·fallback 검출 |
| layout scoring/후보 | 점수·방향·간격·bounded local search | owner/required label/가독성/모델 불변 |
| cache granularity | stage→node/label 세분화 | cold/warm 동등성·정확한 invalidation |
| worker/browser pooling | batch 크기·프로세스 재사용 | state 격리·실제 timeout/cancel·측정 identity |
| 파일 분할 | 기존 모듈 확장 또는 작은 module 분리 | authority 중복 금지·검증기 독립성 |
| graph family 확대 순서 | 검증 방법과 실제 문항 수요 우선 | required full qualification을 몰래 축소하지 않음 |
| 성능 threshold | 초기 측정 후 수치 고정 | timeout/메모리/출력크기 상한은 초기부터 존재 |
| pixel equivalence 허용오차 | 고정 환경의 실측으로 결정 | glyph 의미/누락/owner 오류를 허용오차로 덮지 않음 |

## 7. 계획서 수정 내역

파일명 v1.1과 과거 조사 이력은 보존했다. 각 문서 상단에 이번 기준 SHA와 추가 결정의 우선관계를 명시하고, 해당 Detail 마지막에 실행 가능한 보강 절을 넣었다. 기존 계획의 가치 있는 계약을 통째로 다시 쓰지 않았다.

| 문서 | 반영 |
|---|---|
| 00 §16 | 구조 유지/단순화, 구현 전 계약 표, 최종 구현 순서 |
| 01 §23 | realization recipe, 모든 typed refs, exact scalar, killable worker, peer/source 검토 경계 |
| 02 §37 | 독립 bound의 비용·지원범위, topology, clipping/visible component, scale invalidation |
| 03 §39 | notation/AST 의미, serializer 공통 오류, asset font subset dependency |
| 04 §54 | DisplayEnvelope, composition revision, layout 영향 closure, repair 수렴 |
| 05 §75 | wire/hash/bytes refs, stage projection cache, durable attempt transaction, 단일 repair/controller |
| 06 §89 | capture와 review reuse 구분, 전체 reflow, runtime serving/registry/display adapter |
| 07 §104 | 실제 parent/provider continuation, source-first 검토, frozen replay |
| 08 §141 | 교차 회귀, scope fingerprint, durable evidence/revocation, 성능 측정 의미 |

D05의 assetId/math cache key, D06의 남아 있던 6문항 표현, D07의 fresh plan 결정성 표현, D05/D08의 Seal identity 표현도 본문에서 직접 정정했다. 추가 절은 해당 항목의 기존 포괄적 표현을 구체화하거나 대체한다. 신규 상태 enum을 무더기로 추가하지 않았다.

## 8. 최종 구현 순서와 착수 판단

1. 기준선·실제 UID/source authority·wire/hash·staging/commit·required-audit descriptor 확정.
2. construction peer/typography img 전달/graph independent bound의 작은 실행 실험.
3. 실제 geometry 1 + graph 1을 UID 지정부터 Actual Archive/독립 review까지 연결. 비좌표 realization도 조기 포함.
4. actual display feedback·owner layout·resume/cache·단일 repair budget 보강.
5. 지원 op/함수군/좌표기하/조판·배치를 observer와 함께 확대.
6. 고정된 전체 real/generated/control/negative 분모, 독립 검토와 changed-only 재검, durable Seal/activation.

기존 Detail에도 조기 vertical slice 취지는 이미 있었다. 이번 변경은 이를 master 구현 순서의 우선 기준으로 끌어올리고, 실제 소유 adapter/입력/종료 증거까지 지정한 것이다.

**수정한 계획을 기준으로 구현에 들어가는 것이 적절하다.** 먼저 작은 실제 경로에서 위험을 검증하고 확장해야 한다. 전체 기능이 이미 검증됐다는 최종 승인이나, 현 시점에서 PUBLICATION_READY/Seal을 부여한다는 뜻은 아니다. 가장 큰 재설계 위험인 언어 간 계약·표기 의미·표시 크기·증거 수명부터 닫으면 현재 자산을 살리면서 충분히 강한 제품으로 이어갈 수 있다.
