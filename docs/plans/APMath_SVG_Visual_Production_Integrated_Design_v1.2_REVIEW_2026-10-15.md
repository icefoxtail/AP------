# AP Math SVG·Visual Production Engine 통합 설계서

**버전:** v1.2-REVIEW  
**작성 기준일:** 2026-10-15 (KST)  
**문서 성격:** 기존 설계 00~08 및 현행 코드의 통합·정합 검토본  
**상태:** `DESIGN_REVIEW_COMPLETE / NOT_APPROVED_FOR_IMPLEMENTATION`  
**참조 Git:** `icefoxtail/AP------`  
**코드 스냅샷:** `main 7b2a4f1ce9fcdc5405079bd17833270946a41396` (2026-10-15 18:30 KST 커밋)  
**적용 범위:** SVG/수학 시각자료의 구성·생성·측정·검증·연계 설계. 시험지 콘텐츠와 실제 운영 소스 변경은 제외.

> **문서 위치와 효력.** 이 문서는 기존 `docs/plans/00_APMath_Construction_Visual_Production_통합마스터계획_v1.1.md`와 Detail 01~08을 **대체하거나 자동 승격하는 새로운 Git 정본이 아니다**. 현재 구현과 원래 설계의 차이를 재해석해, 보완 방향과 설계 결정 후보를 하나로 묶은 **검토용 완결 문서**다. 코드 구현, Codex 착수, 엔진 `QUALIFIED/ACTIVE`, 시험지 수정, Git 병합·배포는 이 문서 작성으로 승인되거나 수행되지 않는다. 앞서 작성한 `APMath_SVG_STAGE0_Codex_Execution_Directive_2026-10-15.md`는 **미승인 작업지시서**로 남기며 본 문서의 실행 근거로 사용하지 않는다.

---

## 0. 한 페이지 결론

AP Math에는 수학 기하 계산, 결정론적 SVG 생성, 실제 표시 크기 측정, 독립 기하 재계산, 브라우저 렌더 검증, ALIVE 시각자료 제작 및 JS Archive 단계 검수라는 핵심 부품이 **이미 존재**한다. 특히 `archive/tools/geometry-equation/production/`은 단순 설계가 아니라 SymPy 기반 제한형 Construction Graph와 CindyJS 관측, 그래프 family별 실험, 실제 Archive 후보 오버레이 및 자산 SHA 검증 경로를 포함한다. 그러나 그 사실이 **범용 통합 엔진의 운영 자격·전체 자동화 완료**를 뜻하지 않는다.

**확정할 설계 방향은 ‘새 SVG 엔진 신설’이 아니라 ‘현행 엔진 보존 + 공통 입력·산출·검증 계약의 opt-in 통합’이다.** 수학 모델을 출판 좌표와 분리하고, 원문·검증된 풀이·정확한 파라미터를 기준으로 `Plan → Math/Graph → Typography → Measured Layout → Final SVG → Independent Observer → Actual Archive`를 잇는다. 기존 ALIVE renderer, 기존 Visual Engine, Archive UI·출고 계약은 단번에 교체하지 않는다.

| 구분 | 이번 문서가 제시하는 판단 | 증거 수준 |
|---|---|---|
| `geometry_model.py`, `semantic_model.py`, `coordinate_evidence.py` | 보존할 기본 계산·기하 관계·좌표 출처 검증 모듈 | `CODE_CONFIRMED` |
| `production/construction.py`, `cindy-observer.mjs` | 제한형 DAG 실행 및 독립 재구성 실험 구현 | `CODE_CONFIRMED / EXPERIMENTAL` |
| 함수 그래프 실험군 | 다항·유리·루트·절댓값·구간별·지수·로그·삼각 등 **범위가 좁은 family** 존재 | `CODE_CONFIRMED / EXPERIMENTAL` |
| 글꼴/라벨/SVG/브라우저 | 개별 구성요소와 측정·관측 경로 존재 | `CODE_CONFIRMED`, 통합 전체는 `NOT_TESTED` |
| ALIVE `visual_renderer` + `visual_lane` | 별도 deterministic visualSpec 경로와 SHA 검증 존재 | `CODE_CONFIRMED` |
| 범용 원클릭·TWIN→SVG 완전 자동 동기화 | 공통 통합 경계와 제품별 정식 자격 확인 필요 | `PARTIAL / NOT_VERIFIED` |
| 실험 `PHASE2_SLICE_COMPLETE` 및 코호트 qualification | 일반 `ACTIVE`·자동 배포 권한과 구별돼 있음 | `CODE_CONFIRMED`, 이번 실행은 `NOT_TESTED` |

**가장 큰 기술 공백:** ① 한 가지 authority의 UID/Source/Plan/Wire/Hash가 모든 경로를 통과하는지, ② 파라미터 변화가 종속 수학 객체·SVG·해설까지 일관 재계산되는지, ③ 실제 Archive에 보인 *바로 그 자산 바이트*의 검증 증거가 출고 단계와 결속되는지, ④ 각 capability가 실험을 넘어 독립 자격 검증을 받았는지.

## 1. 조사 기준·확인 범위·용어

### 1.1 기준선과 한계

- Notion 「GPT 작업 전 필독 라우터」, 「Archive 2.0 / JS Archive 시작 페이지」, 「Archive 전체 작업 생명주기」, 「JS Archive GPT Visual Production Contract v1」의 현재 조항을 읽고 설계 적용 범위를 맞췄다.
- Git `main`은 위 SHA를 직접 확인했다. 앞선 비교 기준 `9bafbb8` 이후 2개 커밋의 변경 파일은 `25_제일고…/q22/C3-solution.svg`, `archive/tools/generated-meta/normalize-qid9-svg.cjs`, 관련 테스트 및 `tools/run-tests.js`다. 이는 **원본 설계 00~08이나 Geometry 핵심 코드의 구조 변화가 아니다**. 다만 코드 변경이 전혀 없다는 포괄적 선언은 하지 않는다.
- Git의 기존 통합 설계 00과 Detail 01~08 v1.1, 2026-10-05 상위 아키텍처 재검토, 현행 Production/Visual/ALIVE/Archive 코드 및 운영 계약을 대상으로 분석했다.
- 이번 작성 환경에서 로컬 저장소의 Node/Python 회귀·Chromium 실제 렌더·학생용 엔드투엔드·전체 기출 census를 **재실행하지 않았다**. 과거 보고서의 `118/118`, `48/48`, synthetic `5/5`는 **2026-10-05 과거 실행 이력**일 뿐 이번 main의 재검증 수치가 아니다.
- 설계 목표를 코드의 **실제 구현**, 문서의 **의도**, 운영의 **ACTIVE 상태**와 혼용하지 않는다.

### 1.2 증거 등급과 상태의 이중 축

**증거 등급:** `CODE_CONFIRMED`(특정 SHA 소스 확인), `DESIGN_DOCUMENTED`(설계만 확인), `HISTORICAL_TEST`(과거 테스트), `VERIFIED_CURRENT`(현재 동일 SHA 실제 테스트), `NOT_TESTED`(미실행), `UNKNOWN`(증거 불충분). 증거 등급 자체는 품질 PASS가 아니다.

**시스템 자격:** `EXPERIMENTAL`(제한된 실험), `CAPABILITY_QUALIFIED`(정해진 유형·분모의 정식 자격), `ENGINE_SEALED`(정해진 시스템 기준 충족), `ACTIVE`(승인된 소비 경로에서 활성), `PUBLICATION_READY`(해당 문항·최종 바이트의 승인·표시 증거 완료), `PUBLISHED`(별도 실제 출고/배포 확인). 서로 자동 승격하지 않는다.

**결함 상태:** `FAIL`은 실행된 검사 실패, `UNSUPPORTED`는 정의된 능력 밖, `INPUT_REQUIRED`는 필수 정본 없음, `EVIDENCE_DEBT`는 증거 부족, `NOT_RUN`은 검사 미수행. `HOLD`는 과거 자료·설계 분모의 보류 표기에 한정한다. 실제 신규 Codex 시험지 운영에서 임시 item/run HOLD를 발행하지 않는 현행 규칙을 이 문서가 변경하지 않는다.

## 2. 기존 설계 00~08의 역할과 현재 재평가

| 기존 계획 | 보존할 설계 결정 | 현재 반영된 실제 코드/자산 | 남은 통합 질문 |
|---|---|---|---|
| **00 통합 계획** | SymPy/CindyJS, 단일 runner, 독립 감사, 출판 분리 | Production 실험 경로가 상당 부분 구체화 | 00의 옛 ‘미구현’ 문구를 최신 capability로 다시 분류 |
| **01 Construction Kernel** | typed DAG, source/free/derived, branch·퇴화 | `production/construction.py`, `cindy-observer.mjs` | 기존 spike 밖 연산과 증분 재계산의 정식 지원 |
| **02 Graph/Axis** | 함수식·정의역·분기·축·끝점·오차 독립 검증 | `function_sampling.py`, `graph_observer.py`, `graph_framing.py`, family 시험 | family별 지원 범위·real-UID 자격 및 혼합 좌표기하 |
| **03 Typography** | 정확 수학 표기, 한글, glyph, 동일 fragment 재사용 | `production/typography.mjs`, `math_expression.py`, MathJax SVG 경로 | 모든 생성 경로의 의미/글꼴 일치 및 fallback |
| **04 Measured Layout** | 실측 후 배치, owner 우선, 제한된 수리 | `label_layout.py`, `display-envelope.mjs`, `layout-repair.mjs` | 범용 collision repair controller와 수렴성 |
| **05 One-Click Runner** | 유일한 요청/상태/reducer/캐시 소유자 | `production/run.mjs`, `phase2.mjs`, `store.mjs` | 일반 후보·ALIVE·TWIN 경로를 공통 요청으로 합성 |
| **06 Actual Archive** | 실제 desktop `mode=sol`, 로딩 SHA·이미지 크기 | `record-visual-browser-evidence.mjs`, `verify-rendered-layout.mjs` | 단계/제품별 실제 asset과 final receipt 결속 |
| **07 Problem→Visual** | 필요성 판단, source condition, FrozenPlan | `solution-visual-benefit.mjs`, `resolve-request.mjs`, LLM continuation | planner 산출과 deterministic execution의 보편 계약 |
| **08 Qualification/Seal** | 시험 분모·negative·독립 reviewer·Seal | `production/qualification.mjs`, 테스트/CI 자산 | 전체 capability matrix·코호트 beyond의 activation |

**재평가의 핵심:** 2026-10-05에 ‘신규 구현 예정’이었던 항목 일부는 이후 제한형 실험 코드로 구현됐다. **옛 설계서의 TODO를 그대로 새로운 작업량으로 계산하는 것은 금지**하고, 이미 구현된 구간을 재사용 또는 명시적 호환 어댑터로 처리한다. 반대로 ‘파일 존재’를 실제 운영 가능으로 격상하지 않는다.

## 3. 현행 모듈 자산 분류 — 보존/연결/보완

### 3.1 수학 및 결정론적 계산 계층

| 파일/집합 | 실제 확인 범위 | 분류 | 설계 결정 |
|---|---|---|---|
| `visual_engine/geometry_model.py` | Line/Circle, 직선 교점, 수선의 발, 중점, 내·외분, 원/직선 교점, 접선 판정 | 기존 계산 | **보존:** legacy compatibility·독립 관계 감사 |
| `visual_engine/semantic_model.py` | 점·선·원·관계 검증 | 관계 검사 | **보존:** 대상 좌표 생성기와 구분 |
| `visual_engine/coordinate_evidence.py` | SOURCE/CONSTRUCTED 구별·잔차·퇴화 근거 | 출처 근거 | **보존·연계:** graph 실행 증명과 혼동 금지 |
| `production/construction.py` | SymPy 1.14 기반 제한형 typed operation + TopologicalSorter | 실험 작도 | **우선 재사용:** 범용 solver 신설 금지 |
| `production/cindy-observer.mjs` | 같은 원시 조건의 CindyJS 독립 수치 재구성 | 실험 관측 | **우선 재사용:** producer 출력 좌표를 정답으로 복사 금지 |
| `visual_engine/function_sampling.py` | 도메인·중단점 반영 adaptive sampling | 그래프 구성 | **보존:** family별 확장 위치 구별 |
| `production/graph_observer.py`, `graph_framing.py` | 그래프 형상·기준점·프레이밍의 제한형 관측 | 실험/검증 | **재사용:** 구간 내부와 경계/특이점에 대한 독립 감사 |
| `pipeline-core/canonical.mjs`, `question-uid.mjs` | Node canonical hash, stable identity 및 레지스트리 | 공통 authority | **단일 재사용:** Python 독자 hash 재정의 금지 |

### 3.2 출판·조판 계층

| 파일/집합 | 이미 있는 부분 | 보완 경계 |
|---|---|---|
| `visual_engine/publication.py` | 각·거리·영역·owner 중심 annotation | 축 있는 좌표기하와 함수 그래프의 공통 정책 정합 |
| `visual_engine/math_expression.py` | 수식 AST·exact value·문자열 직렬화 | 표기 precedence, 학년·수학 의미, 혼합 텍스트 확인 |
| `production/typography.mjs` | MathJax SVG outline와 한글 글꼴 조각 생성 | 생성 표현의 의미·baseline·glyph 독립 검증 |
| `visual_engine/label_layout.py` | deterministic label 후보·충돌 점수·measurement 인자 | 미배치 필수 라벨 누락 0, repair 수렴성 |
| `production/display-envelope.mjs` | `small/medium/large/full` 및 실제 크기 정책 | Actual Archive 화면 정책을 **초기** layout으로 전달 |
| `visual_engine/svg_composer.py` | 수학 계산과 분리된 SVG materialization | 최종 fragment/owner/hash 불변 |
| `verify-rendered-layout.mjs` | CSS px, glyph, 충돌, 클리핑, owner/표시 증거 | 잘못된 내용은 builder/observer 별도 판단 |
| `record-visual-browser-evidence.mjs` | 실제 Archive asset 응답 SHA·캡처·문항/모드 정보 | 독립 reviewer와 동일 bytes 결속 |

### 3.3 제작·품질·운영 연계

| 경로 | 현재 역할 | 보존 원칙 |
|---|---|---|
| `past-exam-pipeline/build-visual-candidate.mjs` | 기출 facts→기존 Python candidate | 기존 CLI·예전 자산 호환 유지 |
| `archive/tools/pipeline-core/visual.mjs` | 시각 fact 검증·semantic SHA·primitive 관측 | 새 생성기 출력과 독립 관측의 접점으로 재사용 |
| `alive/engine/visual_renderer.py` | coordinate/geometry/graph/table의 제한형 deterministic visualSpec renderer | 기존 ALIVE 제작을 중단하지 않고 필요한 family만 어댑터 |
| `alive/engine/visual_lane.py` | 사양·자산 SHA 결속, unsafe SVG 배제, staging | 현재 ALIVE 산출형식을 임의 파괴하지 않음 |
| `alive/engine/universal_variant_engine.py` | A/B/C 제한형 변형·capability 및 proof ledger | TWIN numeric variant와 ALIVE 인지확장을 혼동 금지 |
| `archive/tools/archive-stage-validator-*-v2.mjs` | CREATE/R1/R2/R3 단계 evidence 구조 검증 | 수학적 전문 독립 검수의 대체가 아님 |
| `archive/tools/visual-physical-evidence-gate.mjs` | 실제 SVG 물리 증거, primitive/렌더 SHA | 생성 스키마와 단계 증거에 연결, 중복 validator 금지 |
| `production/qualification.mjs` | real cohort 자격 확인·상태 제한 | `active:false`, `productionAuthorized:false` 유지 |

**단일화를 잘못 이해하지 말 것:** 위 세 가지 시각자료 생성 경로를 하나의 대형 `renderer.py`로 통폐합하지 않는다. 수학 의미·원문 authority·검증 계약을 공유하고, 출력 backend와 legacy 호환은 유형별로 분리한다.

## 4. Capability 현황 — 실제 지원 범위와 안전 경계

**현재 `production/contracts.mjs`는 적어도 9개 spike capability를 `EXPERIMENTAL`로 등록한다.** 유형명만으로 모든 수학·도형의 일반 사례를 처리할 수 있다는 뜻이 아니다.

| 유형 | 현재 확인되는 제한형 기능 | 주요 제약·사각지대 | 권장 후속 상태 |
|---|---|---|---|
| 기하 작도 `construction` | 중점·선·원·각 이등분선·교점·접선·source-bound 조건 감사 | 임의 제약계, 퇴화/일치, 숫자 범위·분기 | 실험 유지→연산별 qualification |
| 다항 `polynomial` | 유리계수·도함수 특징·개형, bounded degree | 반복근/특징 간 거리/특정 정의역 | degree·domain별 구분 |
| 유리 `rational` | 제한형 일차/일차, 극·제거가능 구멍 | 고차 분모, 사선 점근선, 임의 제한 정의역 | 별도 capability |
| 무리 `sqrt-affine` | 양의 기울기 일차 피개방정식 루트, 끝점 | 음의 기울기, 일반 합성, 임의 열린 끝점 | 출처별 제한 유지 |
| 절댓값 `absolute-value` | 하나의 affine corner | 다중 코너·합성 | 별도 패밀리 |
| 구간별 `piecewise-affine` | 제한형 두 조각 연결·점프 | 다구간·복합 경계 | endpoint별 독립 감사 |
| 지수 `exponential-affine` | 제한형 지수·단조·점근선 | 일반 합성·제한구간 | family 실험 유지 |
| 로그 `logarithmic-affine` | 제한형 로그·정의역 경계 | 일반 합성·복합 변형 | family 실험 유지 |
| 삼각 `trigonometric` | 한 주기 사인/코사인 또는 한 탄젠트 branch | 복합 삼각·임의 구간·극접점 | singularity 감사 후 확대 |

**현재 승인 한계:** `production/README.md`는 이 엔진을 실험용으로 선언하며, `run.mjs`의 frozen entry는 `PHASE0_2_EXPERIMENT`만 허용한다. `phase2.mjs`가 내보내는 `PHASE2_SLICE_COMPLETE`는 `productionAuthorized:false`, `qualificationStatus:NOT_QUALIFIED`를 함께 가진다. `qualification.mjs`의 6 Geometry + 4 Graph 코호트 기록도 `active:false`, `generalEngineReadiness:NOT_ESTABLISHED`로 반환한다. 따라서 일반 제품 `ACTIVE`는 **확인되지 않았다**.

## 5. 통합 목표 구조 — 변경이 아니라 계약 연결

```text
[기출 Source JS / 검증된 해설 / ALIVE 후보 / TWIN Template]
         │ identity, sourceRef, verifiedSolutionRef, parameter-set
         ▼
(1) Source Resolver + Visual Necessity Planner
    ├─ PROBLEM_VISUAL / SOLUTION_VISUAL 분리
    ├─ 원본 그림 충분성, 핵심 시각 관계, source 조건 전수
    └─ KEEP / REUSE / EXEMPT / ADD / POLISH / REBUILD
         ▼
(2) Common VisualRequest + FrozenVisualPlan [제안하는 opt-in adapter]
    ├─ Node canonical wire + source/solution/parameter SHA
    ├─ 수학 사실 GIVEN / DERIVED / CONCLUSION 및 owner
    ├─ geometry construction plan / graph plan / legacy ALIVE spec
    └─ unsupported capability는 경계에서 차단
         ▼
(3) Capability Router → Math Snapshot [모델 불변]
    ├─ SymPy construction + CindyJS numeric observer
    ├─ graph sampler + independent observer
    └─ 단순 ALIVE renderer는 현재 지원범위 내에서 보존
         ▼
(4) Publication pipeline
    → font/math fragment freeze → 실제 Archive 크기 정책
    → measured labels/owner layout → SVG composer
    → static primitive observer → Chromium actual-size audit
         ▼
(5) Candidate Evidence [출고 권한 없음]
    → UID / source·solution / plan / math / SVG bytes·SHA
    → 실제 Archive mode=sol 로딩·크기·스크린샷
    → 독립 reviewer verdict / 변경영향·캐시 invalidation
         ▼
(6) 기존 Archive/ALIVE 운영 인계
    CREATE → R1 → R2 → R3 또는 해당 Generated 승인
    → Library 누적 또는 명시된 Codex/Work publication
    → main 반영과 학생 조회/배포는 각각 별도 검증
```

### 5.1 소유권 결정

- **Math truth owner:** 원문 + 검증된 해설 + typed construction/graph facts. SVG 위치나 AI의 예쁜 그림이 새로운 수학 조건을 만들어 내지 않는다.
- **Wire/hash owner:** `pipeline-core/canonical.mjs`의 신규 객체 SHA 규격. legacy bare hex와 기존 hash는 version-aware adapter로 보존한다.
- **Request/status owner:** Detail 05의 하나의 request resolver / result reducer. 별개 R1/R2/ALIVE enum을 덮어쓰지 않는다.
- **Publication owner:** 기존 Python visual spec·컴포저·브라우저 측정. producer와 관측기를 코드 경계로 분리한다.
- **Release owner:** 기존 Archive/Generated authority. 엔진이 production JS·SVG를 임의 수정·main 병합·배포하지 않는다.

### 5.2 VisualRequest v1 개념 계약 — **새 인터페이스 제안, 현행 코드 schema 아님**

아래는 구현 승인 전 **필드 수준 설계 예시**다. 기존 실험의 `APMATH_VISUAL_WIRE_v1` 또는 ALIVE v0.1 payload를 이 예시로 바로 대체하지 않는다.

```json
{
  "schemaVersion": "APMATH_UNIFIED_VISUAL_REQUEST_DRAFT_v1",
  "questionUid": "<canonical question UID>",
  "surface": "SOLUTION_VISUAL",
  "sourceRef": {"path": "<relative path>", "bytes": 0, "sha256": "sha256:<hash>"},
  "verifiedSolutionRef": {"path": "<relative path>", "bytes": 0, "sha256": "sha256:<hash>"},
  "purpose": "CANDIDATE_BUILD",
  "parameterBindingRef": null,
  "visualAction": "ADD",
  "requestedSizeClass": "medium",
  "capabilityHint": "construction-spike-v1",
  "authorityRefs": [],
  "policyRefs": []
}
```

필수 불변 조건: 

1. `questionUid`는 source ordinal·실제 시험지와 유일하게 매핑돼야 한다. 새로운 에셋 파일명을 UID 대신 쓰지 않는다.
2. 실제 파일 ref에는 경로·바이트 길이·SHA가 모두 있어야 하며, 읽기 시 재확인한다.
3. `verifiedSolutionRef`가 필요한 math/solution path에서는 미검증 해설을 정본처럼 취급하지 않는다. 출처/검증 상황에 따라 `INPUT_REQUIRED`로 분기한다.
4. TWIN의 `parameterBindingRef`가 존재하면 original source와 변형 candidate의 수학 사실/정답/해설/visual revision을 함께 식별한다. 난수 seed만으로 동일성 증명이 끝나지 않는다.
5. `purpose`는 `QUALIFICATION`과 ordinary `CANDIDATE_BUILD`를 분리한다. qualification 실험 결과는 운영 공개 권한과 별개다.
6. 실제 payload 스키마는 기존 `production/contracts.mjs`, `phase2.mjs`, `alive/engine/visual_lane.py`에 대해 입출력 호환 테스트를 거쳐 결정한다.

### 5.3 FrozenVisualPlan 공통 경계

수학 planning은 `(source conditions → expected facts → executable model)`로 닫는다. source image가 포함된 경우 텍스트의 표·도형 조건을 누락 없이 Inventory화한다. LLM은 의도와 조건을 추출·계획할 수 있으나 **raw SVG 생성값이나 선호 좌표를 계산 authority로 채택하지 않는다**. `sourceConditionId`, entity/point owner, given/derived/conclusion, coordinate mode, branch selection, 허용한 자유 파라미터, graph domain 및 required features를 freeze한다.

좌표 없는 도형은 `SSS_POSITIVE_SIDE_v1`처럼 **명시적인 closed realization recipe**를 사용한다. 실제 원문이 좌표계를 고정한 경우 `SOURCE_COORDINATE_AXES_v1`의 축척을 임의 변경하지 않는다. SELECT_POINT branch guard는 `inputs`뿐 아니라 `branch.refs` 등 숨은 참조까지 캐시 의존성에 포함해야 한다.

## 6. 파라미터 기반 SVG 동기화 — TWIN과 ALIVE의 역할 구별

### 6.1 TWIN (같은 핵심 사고의 수치 변형)

템플릿은 단순 text replace가 아니라 다음이 하나의 versioned 단위다.

`Source Problem → Template Spec(불변량/변수/허용 범위) → ParameterSet/Seed → 독립 Solver → Answer/Choices → 학년 허용 Solution → Visual Fact Graph → SVG Asset → reviewer/approval evidence`.

**필수 재계산 규칙:** 파라미터가 바뀌면 수학 모델에 의존하는 점·직선·교점·접점·그래프 특징·라벨 의미·뷰포트·최종 SVG를 변경 영향에 따라 다시 계산한다. 표시 위치만 변했으면 수학 재계산 대신 layout만 무효화할 수 있지만, 매번 현 hash lineage를 검증한다. 오답 선지 유일성·경계 조건·학습 목표 불변성은 SVG 검증과 별개로 검산한다.

**예시 설계(실제 구현 사례 아님):** 포물선과 직선의 두 교점에서 가변 계수를 선택하면, solver가 두 교점과 수학적 조건을 확정하고, renderer는 그 동일 모델을 사용해 교점·꼭짓점·양팔·라벨·뷰포트를 재구성한다. 원래 식·교점 y좌표가 framing에 빠지면 clipping 또는 source parity FAIL이다. 독립 solver/선지 검산 없이 렌더가 예쁘다는 이유로 통과하지 않는다.

### 6.2 ALIVE (A/B/C 의미·사고 확장)

ALIVE는 숫자만 바꾸는 TWIN과 다르다. Primary L3·교육과정·발문 자연성·추가 판단 구조를 먼저 확정하고, 새로운 사고가 요구하는 시각적 관계를 계획한다. 현재 `alive/engine/visual_renderer.py`/`visual_lane.py`의 지원 family는 유지하면서, 구조가 실제로 같은 visual type에 한해 새 공통 `VisualRequest`로 연결한다. **추상적 unified spec 하나로 ALIVE의 모든 시각자료를 강제 치환하지 않는다.**

기존 [ALIVE 다음 학교 CREATE+해설 SVG CURRENT] 계약상, 팔마고를 제외한 **새로 착수하는 학교**에서는 CREATE 중 문제용/해설용을 각각 판정하고 필요한 SVG를 생성하는 것이 원칙이다. 특히 도형의 방정식 `H22-C2-01~04`에서 해설 SVG는 기본 필수(협의된 좁은 예외 제외)다. **팔마고 기존 생성분을 새 설계와 맞추려고 소급 재제작하지 않는다.**

### 6.3 원본 기출 Archive

원본 문제 그림·PNG·표는 수학적 원문 authority다. 더 예뻐 보인다는 이유로 문제용 그림을 해설용 SVG로 교체하지 않는다. 기존 validated `solutionImage`도 일괄 regeneration하지 않는다. 변경한 UID와 직접 영향의 current asset에 대해서만 필요한 조판·수학·실렌더 회귀를 적용한다.

## 7. 수학·시각 품질 불변 규칙

### 7.1 Geometry invariants

- 모든 `DERIVED` 점/직선/원은 원시 좌표 복사가 아니라 frozen graph 연산 결과여야 한다.
- 길이·수직·평행·접함·포함·선 위·방향·선택한 branch 같은 조건이 원문과 일치한다.
- 교점 0/1/2개, 중근/퇴화, 일치, near-tangent, near-parallel, 계산 불안정은 성공으로 숨기지 않는다.
- 화면 이동·확대·라벨 재배치는 model-space 길이·방향·각도·소유권을 바꾸지 않는다.
- Cindy numeric 관측은 exact algebra proof와 다르다. 허용 수치 영역 밖이면 `UNSUPPORTED`로 구분한다.

### 7.2 Graph invariants

- graph domain, branch, 열린/닫힌 끝점, 점근선, hole/pole, root/extrema/inflection이 source truth를 보존해야 한다.
- SVG 곡선을 몇 점만 찍어 맞췄다고 PASS하지 않는다. 구간 내부·특이점 근방·표시 범위·실제 CSS 해상도에서 independently observe한다.
- 좌표기하에서는 단위축 동일 비율(equal-unit)과 원의 원형성 등을 실측 SVG/Archive에서 확인한다. 함수 그래프의 non-equal 축 허용 정책과 혼용하지 않는다.
- viewport는 보기 좋은 프레이밍을 위해 바꿀 수 있으나 **정의역·수학 모델 자체**를 넓히거나 축소하지 않는다.

### 7.3 Typography/layout invariants

- 정확한 한글·수학 glyph와 baseline을 먼저 resolve한 뒤 실측치로 배치한다. 사후 텍스트 문자열 교체·축척 수리만으로 최종 PASS하지 않는다.
- label은 point/line/angle/region/tick의 **owner identity**와 결속한다. owner를 바꿔 collision을 숨길 수 없다.
- 필수 label 누락·hard collision·잘림·missing glyph·부정확한 부호·LaTeX 노출은 FAIL이다.
- **현행 문제은행/해설 디지털 출판 참조**는 desktop Archive `mode=sol`의 실제 이미지 크기다. 해당 화면의 student-facing label은 **11 CSS px 미만 HARD FAIL, 12px 이상 목표**라는 현행 Visual Contract를 적용한다. 이것을 원본 시험지 스캔·일반 모바일 페이지 전체 비례 축소에 무차별 적용하지 않는다.
- `small/medium/large/full` 후보를 실제 수용 폭과 높이에 따라 측정하고, label 탐색·framing·size 선택은 제한된 횟수로만 재시도한다. 반복 같은 후보가 나오면 stagnation으로 종료한다.
- 학생용 SVG에는 한국어 `title`/`desc`/접근성 의미를 제공한다. 내부 엔진 이름·debug 문구·raw TeX가 학생 화면에 노출되면 안 된다.

### 7.4 수학 검증과 교육적 검증의 분리

기하 coordinate/graph sampler의 수치 PASS가 학생용 문제의 적합성·학년 교육과정·정답 유일성·해설의 설명력을 보증하지 않는다. 원문·교육과정·해설·선지의 검증은 기존 CREATE/R1/R2/ALIVE 품질 프로토콜에 남는다. 엔진은 **시각적 수학 관계와 실제 출력**만 책임진다.

## 8. 원클릭 실행과 실패 수리의 설계 계약

### 8.1 한 요청이 책임져야 할 산출물

정상 지원 범위라면 외부에서 SVG 파일을 만든 뒤 다시 글꼴만 바꾸고 또 손수 viewBox를 조절하는 절차가 없어야 한다. 한 요청이 `source/plan evidence → math facts → fragment measurements → layout → candidate SVG → static/browser/Archive evidence → independent-review packet`까지 실행 가능한 경로로 생성한다.

**그러나 ‘원클릭’은 자동 승인·무인 출고·범용 수학 증명의 동의어가 아니다.** 지원하지 않는 문제는 정확한 이유와 입력/자산/실패 위치를 가진 재개 가능한 상태가 된다.

### 8.2 Bounded repair 분류

| 오류 | 자동·표적 복구 가능성 | 금지해야 할 우회 |
|---|---|---|
| 실측 label collision | owner-bound 재배치, leader/panel, 합법적 size 변경 | 임의 font 축소, 필수 라벨 삭제 |
| viewport/framing 잘림 | Math model 고정한 채 display bounds 조정 | source domain 변경 |
| 틀린 좌표/분기 | source/plan/solver 사실 재확인 후 해당 의존성만 재생성 | 최종 SVG 좌표만 수동 편집 |
| source 조건 불명확 | 새 SOURCE evidence 확보, UID별 `INPUT_REQUIRED` | 화면상 그럴듯한 좌표 추정 |
| 실제 Archive 자산 SHA 불일치 | 올바른 target/AssetRef/overlay 재결속 | 이전 캡처에 새 SHA만 덧붙임 |
| `UNSUPPORTED` graph family | 명시적 지원 경계로 후속 계획·기존 승인 backend로 routing | `ACTIVE`로 임의 보고 |
| provider/browser unavailable | 실행 근거/미실행 축 분리, 가능한 다른 독립 작업 지속 | 테스트하지 않은 것을 PASS |

구체적 예외 포함 자가수리 예산은 D05의 단일 reducer를 따라야 하며, 현행 실험에서는 일부 label 관련 bounded action만 확인된다. **모든 오류에 대한 일반 자동수리가 이미 구현됐다고 보고하지 않는다.**

## 9. 자격 검증·승격과 기존 검수 체계의 연결

### 9.1 시스템 계층과 문항 계층은 별개

| 단계 | 대상 | 필요한 최소 근거 | 성립하지 않는 주장 |
|---|---|---|---|
| `CODE_CONFIRMED` | 특정 commit의 모듈 | 경로·함수·blob SHA 확인 | 실행 PASS |
| `HISTORICAL_TEST` | 과거 fixture/테스트 | 당시 commit·log·분모 | 최신 main PASS |
| `EXPERIMENTAL_SLICE_COMPLETE` | 특정 문제·backend 실험 | source/plan/observer/렌더 증거 | 범용 qualification |
| `CAPABILITY_QUALIFIED` | frozen scope + denominator | positive/negative + real UID + 독립 review | 모든 family ACTIVE |
| `ENGINE_SEALED` | 시스템 범위 | 정식 scope matrix + 필요 reviewer·replay | 문항별 publication 완료 |
| `ACTIVE` | 승인된 제품 routing | system/capability 정책·버전·승인 주체 | 자동 main write 권한 |
| `PUBLICATION_READY` | 한 문항의 최종 SVG bytes | 검증된 plan/asset, Actual Archive, 독립 review | 자동 student site 배포 |
| `PUBLISHED` | 실제 출고·등록·배포 | Git/Library/Consumer/실제 화면 적합 증거 | 독립 수학검수 완료의 대용 |

**실제 코드 기준:** `qualification.mjs`의 현재 코호트 `Geometry 6 + Graph 4`는 `PHASE5_COHORT_QUALIFIED`를 만들 수 있지만 `active:false`, `productionPublication:false`다. 이것은 의도된 제한이다. 시스템 승격은 다른 세션/독립 reviewer의 증거와 실제 권한·수정 경계 검토를 포함해야 하며, Codex가 자기 실행 로그만으로 `QUALIFIED/ACTIVE`를 선언해서는 안 된다.

### 9.2 기존 Archive/ALIVE 운영 흐름 보존

- **기출 CREATE:** 원본 수학·해설·문제/해설 visual 필요성·신규 자산의 물리 파일과 기본 QA.
- **기출 R1:** 전 qid의 독립 첫풀이 동결/비교와 교육과정 검수. 엔진이 계산했다고 독립 풀이를 생략하지 않는다.
- **기출 R2:** 현행 Codex FAST LANE 기준 전 qid의 학생 관점 해설 검산·개선 검토; 의심/고위험은 독립 재풀이. 과거 예약의 독자 검수계약이 다르면 그 예약 기준을 존중한다.
- **기출 R3:** 변경·미해결·직접 의존 및 최종 산출 결속. 무변경 전체를 중복 재검하지 않는다.
- **GPT Archive 예약:** 단계별 Library 인계·R3 완료본 누적 정책을 유지하며, 별도 담당이 일괄 Git 출고한다. **현재 계약을 이 설계가 수정하지 않는다.**
- **Codex 시험지 FAST LANE:** 시험지 작업 도중 공유 renderer/validator/CI를 임의 변경하지 않는다. 이 엔진 개발은 별도 승인된 시스템 작업이어야 하며 시험지 제작 단계의 공유 도구 수리와 구분한다.
- **Generated/ALIVE:** 생성 중 SVG 동시 제작 및 자체 QA를 수행하되 승인·학생 Consumer/실제 Chrome release는 해당 현행 Generated 출시 정본을 따른다.

### 9.3 단일 시각 증거 receipt 제안

`questionUid / sourceRef / verifiedSolutionRef / surface / expectedFactsSha / constructionOrGraphSnapshotSha / finalSvgRef / finalSvgSha / actualArchiveAssetResponseSha / screenshotRef / displayedSizeClass / renderedLayoutVerdict / independentReviewRef / capabilityStatus / versionBindings / unresolvedAxes`.

별도 결과의 구조와 type은 D05/현재 stage receipt와 호환되도록 최소 어댑터로 연결한다. Builder의 자기 검증은 reviewer verdict를 덮어쓰지 않는다. SVG가 새로 생성되면 과거 `finalSvgSha`의 브라우저 증거를 현재 것으로 재사용할 수 없다.

## 10. Error Census·Capability Manifest는 ‘0단계 설계 요구’, 수치를 지어내지 않음

현행 자료에는 여러 도형·SVG inventory와 개별 Visual Audit 스크립트가 있으나, 이 문서에서 **전 기출의 실제 분모·필요 SVG 수·엔진 커버리지 비율을 계산하지 않았다**. 따라서 아래 산출 규격을 정의하되 수치를 추정하지 않는다.

### 10.1 Census 분모의 분리

| 분모 | 의미 | 집계 주의 |
|---|---|---|
| `SOURCE_ALL` | 고유 examUid/sourceOrdinal에 대응하는 원본 기출 문항 | 같은 파일·중복 후보/백업 제거 기준 기록 |
| `PROBLEM_VISUAL_PRESENT` | 발문에 실제 그림/표/그래프가 존재 | PNG/SVG/inline/choice image 분리 |
| `SOLUTION_VISUAL_PRESENT` | 해설용 visual이 실제 참조·존재 | 단순 파일명 존재와 Consumer 노출을 분리 |
| `VISUAL_REQUIRED_REVIEWED` | 교육적/수학적으로 visual 필요성이 검토된 UID | 자동 정규식으로 완성했다고 할 수 없음 |
| `ENGINE_ELIGIBLE` | source/facts와 지원 capability가 모두 있는 후보 | schema 이름 유사성만으로 포함 금지 |
| `ACTUAL_RENDER_VERIFIED` | 실제 Archive 크기·동일 SHA evidence | 과거 SVG 다른 SHA의 PASS 제외 |

`필요 시각자료 문항 수`, `기존 자산 유효율`, `생성 엔진 커버리지`, `출시 가능율`은 서로 다른 지표다. 미확인 UID는 0으로 간주하지 않고 `UNKNOWN`/`EVIDENCE_DEBT`로 남긴다.

### 10.2 Error Census 분류 사전

`SOURCE_CONDITION_MISSING`, `WRONG_MATH_MODEL`, `BRANCH_AMBIGUOUS`, `UNSUPPORTED_CAPABILITY`, `WRONG_ENDPOINT_OR_TOPOLOGY`, `OWNER_MISMATCH`, `LABEL_COLLISION`, `FONT_GLYPH_OR_NOTATION`, `VIEWPORT_CLIP`, `ASSET_MISSING`, `ASSET_SHA_MISMATCH`, `ARCHIVE_RENDER_NOT_RUN`, `REVIEW_UNVERIFIED`, `DUPLICATE_OR_STALE_UID`.

**출력 단위:** 고유 UID(문제/해설 surface 별도) × 오류 유형 × 코드 경로 × 실제 증거 SHA × `EXISTS / FAIL / UNKNOWN` × 중복제거 근거. 자동 분류는 의심 후보이며, 교육적 필요성·일부 수학적 의미는 별도 검토 대상으로 남긴다.

### 10.3 Capability Manifest의 설계 필드

`capabilityId / backend / specVersion / sourceFamilies / supportedDomain / excludedCases / positiveFixtureRefs / negativeFixtureRefs / realUidRefs / mathObserver / renderedObserver / nodePythonDependencyRefs / currentEvidenceGrade / qualificationLevel / activationState / blockers / owner / lastVerifiedSha`.

`CODE_CONFIRMED`도 manifest 행은 만들 수 있지만 테스트가 없으면 `VERIFIED_CURRENT`를 넣을 수 없다. 지원범위와 regression의 실제 누락은 0단계에서 동결·측정할 사안이지 이 문서에서 사전 PASS하지 않는다.

## 11. 권장 업그레이드 구조 — 별도 구현 착수 전 합의용

이 표는 **개발 우선순위와 종료 증거의 설계**이며, Codex에 대한 즉시 작업지시·명령 실행 권한이 아니다. 단계 이름은 사업화 로드맵 `S0~S8`과 혼동하지 않도록 `V0~V6`로 구별한다.

| 설계 단계 | 핵심 산출물 | 완료를 인정할 기준 | 유지해야 할 제한 |
|---|---|---|---|
| **V0 현황 동결** | 최신 코드·시험 기준선·Capability Manifest·Error Census | 분모·경로·SHA·실행/미실행·UNKNOWN이 모두 구별됨 | 코드/원본/프로덕션 변경 없음 |
| **V1 공통 계약** | UID/Wire/FrozenPlan/Result·권한/상태 adapter | 동일 logical fact가 경로별 SHA/owner/typed scalar 왜곡 없이 왕복 | legacy/ALIVE 호환 파괴 금지 |
| **V2 수학·파라미터 연결** | closed realization과 TWIN parameter dependency, solver 증거 | 유효 파라미터 변화 시 정확 재계산, 퇴화·분기 negative rejection | raw 좌표 덮어쓰기 금지 |
| **V3 출판 단일화** | 실측 fragment→layout→composer→bounded repair | 동일 SVG bytes에서 hard collision/clipping/glyph 누락 0 | 사후 font patch·무한 repair 금지 |
| **V4 Archive 결속** | actual-size capture·independent primitive review·최종 receipt | UID/Source/asset response/SHA/runtime/screenshot 동일 revision | synthetic PASS를 real PASS로 대체 금지 |
| **V5 Qualification** | scope별 positive/negative, Geometry ≥6 + Graph ≥4 및 feature coverage, 독립 리뷰 | frozen 분모의 조건·출처·실화면·독립 verdict 완료 | Codex 단독 `ACTIVE` 승격 금지 |
| **V6 제품 접목** | TWIN 템플릿 2~3 + ALIVE/Archive opt-in 통합 | 승인된 UID만 Consumer·출제; 제품별 회귀·배포 evidence | 기존 문제용 PNG·승인 시험지 일괄 재제작 금지 |

**일정 판단:** V0가 밝혀내는 기술 부채에 따라 V1~V4는 이미 구현된 코드의 어댑터 보완만으로 끝나는 부분이 있을 수 있다. 반대로 새 graph family·실험 외 임의 도형의 지원은 분리된 추가 개발이다. 설계만으로 개발기간/지원률을 숫자로 확정하지 않는다.

### 11.1 사업화 마스터 로드맵과의 관계

- 사업 로드맵 **S0(JS→JSON 무손실 파생화)**와 본 설계 **V0(Visual 시스템 현황)**는 **서로 다른 축**이다. S0를 변경하거나 이미 완료했다고 간주하지 않는다.
- S5 TWIN 제작은 V1/V2의 UID/solver/파라미터 계약과 V3/V4의 SVG 출판·실검증 인터페이스를 **파일럿 범위에서** 소비한다. 전 capability의 SEALED 완료를 처음부터 전제하지 않는다.
- ALIVE 다음 학교 CREATE 중 SVG 동시 제작은 기존 운영 계약대로 계속된다. 공통 엔진 전환이 그 생산을 중단시키는 선행조건이 아니다.
- S6 자동 생성·검수·등록에서는 `generated approval`/`capability ACTIVE`/`actual rendered asset`/`student lookup`의 별도 gate를 유지한다.

## 12. 검수 설계: PASS/FAIL, 증거, 독립성

### 12.1 기준선과 회귀의 구분

기존 repo에 이미 존재하는 Python unittest, Node geometry test, publication fixture builder, 단독 Chromium, Actual Archive integration test를 **재사용**한다. 과거 통합 설계가 기록한 `118 Python`, `48 Node`, `5 synthetic`은 현재 분모가 아니다. 새로운 구현마다 실제 현재 SHA의 수행 로그·exit code·테스트 수·환경·skipped 이유를 기록하며, 해당 테스트가 실재하지 않거나 실행되지 않았으면 `NOT_RUN`이다.

### 12.2 최소 negative matrix

| 축 | 반드시 반례가 필요한 변조 | 실패가 나야 하는 이유 |
|---|---|---|
| Source/UID | 다른 qid, stale source SHA, 중복 원본 | 잘못된 문항 그림을 정답으로 채택 방지 |
| Geometry | unknown op, 순환 DAG, derived 좌표 주입, 잘못된 분기 | 계산 연산·수학 관계 보존 |
| Graph | 잘못된 hole/pole, endpoint 상태, root/극값 누락, 선분 내부 오차 | 곡선/정의역 진실 보존 |
| Typography | 아래첨자·분수/괄호 우선순위 변형, 한글 glyph 누락 | 수학적·학생 읽기 의미 보호 |
| Layout | owner만 바꾸기, 겹친 label, 가려진 tick, CSS 축소 | 실제 화면 가독성 보호 |
| Archive | SVG 응답 SHA 다름, stale runtime, source/asset 패치 mismatch | 동일 최종 산출물 증거 유지 |
| Proof | builder 자체 PASS만 존재, 독립 reviewer 없음 | 승인·신뢰 분리 |

### 12.3 독립 검수 권한

Codex는 허가된 범위의 구현·실행·기술 수리를 담당할 수 있지만, **도구 구현자가 실행한 테스트가 곧 도구의 독립 자격 승격은 아니다.** 새로운 capability가 `QUALIFIED/ACTIVE`가 되려면 frozen denominator·실제 final bytes·독립 reviewer verdict와 승인 권한을 별도로 확보해야 한다. 이는 기존 문항 R1/R2 품질 검수를 다시 무한 반복하라는 뜻이 아니다. 동일 SHA의 과거 유효 증거는 재사용하고 changed target과 직접 의존성만 재검한다.

## 13. 중복·비범위·안전 경계

**보존:** 기존 기출 JS/PNG/SVG·R1/R2/R3 증거, ALIVE renderer 및 생성 source, 기존 Student Consumer/Archive 검색·출력, legacy candidate CLI, MathJax CHTML 학생 본문 렌더, Node pipeline-core UID/hash.

**통합 시 새로 만들지 말 것:** 별도의 독립 geometry kernel, 중복 CSV/JSON ‘원본’ DB, 같은 기능의 validator 둘, 모든 SVG를 다시 그리는 전수 migration, 자체 브라우저 렌더러, 생성 대상별 중복 status enum, 기존 stage 프로토콜을 우회하는 출고 경로.

**비범위:** GeoGebra 드래그 UI, 모든 함수/도형의 범용 CAS, 임의 수학 문제의 자동 증명, TikZ/PGFPlots backend 확대, 모바일 절대 font-size 전면 gate, 전체 시험지 무조건 그림 추가, 라이선스·수학·교육과정 검수 생략, 임의 프로덕션 asset rewrite.

**실제 source/sink 경계:** engine candidate output은 generated staging 및 검증 receipt에 한정한다. 원본 기출·승인 JS·소비자 데이터·학생 개인정보를 임의 수정하거나 코드 출고와 동시에 학생 사이트 정상 표시를 가정하지 않는다.

## 14. 위험·결정 원장

| ID | 위험 또는 미결정 | 권고 및 근거 | 현 상태 |
|---|---|---|---|
| R-01 | 00~08 계획의 과거 TODO와 실제 실험 코드 불일치 | 코드 기준 Capability Manifest로 재분류 | 설계 반영, 실측 미완 |
| R-02 | Node/Python SHA·scalar mismatch | Node canonical object SHA, exact typed wire, legacy adapter | 방향 확정안, E2E 미검증 |
| R-03 | TWIN 파라미터만 바꾸고 SVG·해설 누락 | parameter lineage + solver→visual dependency | 설계 제안 |
| R-04 | ALIVE 스키마 강제 통폐합으로 생산 중단 | opt-in adapter, fallback 보존, 신규 학교 계약 유지 | 설계 제안 |
| R-05 | fixed owner 틀림/label collision | owner-bound measured layout, bounded repair | 일부 코드, 일반화 미인증 |
| R-06 | source figure를 해설 SVG로 대체 | problem/solution surface 분리, source 보존 | 현행 계약 유지 |
| R-07 | old CSS/Asset SHA로 신규 SVG PASS | Actual Archive 동일 bytes의 회수·캡처 | 코드 존재, 범용 연결 미인증 |
| R-08 | 실험 PASS → `ACTIVE` 과장 | 별도 qualification·독립 reviewer·권한 승격 | 현재 코드 일부 fail-closed |
| R-09 | ‘전체 기출 visual 필요율’ 임의 추정 | 존재 inventory와 필요성 검토 분모 분리 | census 미실행 |
| R-10 | CI는 돌지만 main geometry 검사가 누락 | 현행 `geometry-publication-tests.yml` push가 특정 과거 브랜치만 대상으로 함; `ci.yml`의 포함 coverage는 실제 점검 필요 | `CODE_CONFIRMED / NOT_VERIFIED` |
| R-11 | 설계 변경 명목으로 원본/예약 변경 | 이 설계는 문서-only; Git·예약·운영상태 변경 금지 | 보호 기준 |

### 14.1 설계 결정을 위해 남겨 둘 최소 쟁점

1. 정식 unified wire는 기존 `APMATH_VISUAL_WIRE_v1`을 얇게 확장할지, 상위 envelope를 두고 하위 adapter를 유지할지 **호환성 실험**으로 확정한다. 지금 새 스키마 사용을 강제하지 않는다.
2. V5의 독립 자격 분모는 기존 `Geometry 6 / Graph 4`를 보존하되 실제 지원 family·required feature 범위가 커지면 **분모와 유형 커버리지**를 독립적으로 확대해야 한다.
3. TWIN 파일럿은 지금 지원 가능한 함수/기하 2~3개의 정예 Template부터 시작한다. 문항 대량 생성 수율은 측정 전 약속하지 않는다.
4. 전수 census가 교육적 필요성까지 자동 판단하지 못한다는 사실을 인정하고, `UNKNOWN`과 사람 검토 계층을 남긴다.

## 15. 문서 완료 판정과 추후 실제 작업의 경계

**이번 문서 작성으로 완료된 것:** 기존 설계 00~08의 소유권·기술 선택을 보존하면서 최신 코드와의 차이를 정리하고, 공동 계약·파라미터 동기화·ALIVE/기출 운영 연결·상태/증거·업그레이드 의존성·비범위를 하나의 검토본으로 통합했다. 즉 **통합 설계 문서의 작성**은 완료했다.

**이번 작성으로 완료되지 않은 것:** 최신 Node/Python 기준선 실행, 전 기출 census 실제 집계, 신규 Source/Plan adapter 구현, 코드/검사기 수정, 진짜 SVG 재생성, 브라우저 렌더 E2E, 독립 품질 검수, 임의 capability 자격 승격, `ACTIVE`, main 병합, Student Consumer 등록 또는 배포.

**후속 진행의 올바른 순서:** 이 설계 검토본의 결정·범위 확정 → 그때에만 별도 V0 실행 지시/승인 → 측정된 V0 증거로 v1.2 상세 항목 업데이트 → 작은 통합 파일럿 → 별도 독립 qualification → 필요시 배포. 기존 00~08, 운영 계약과 충돌할 때는 형님의 최신 명시 지시와 실제 current authority를 우선한다.

---

## 16. 정본·근거 색인

### Notion

- [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)
- [Archive 2.0 / JS Archive 시작 페이지](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398)
- [Archive 전체 작업 생명주기 — 단계별 필독 문서](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e)
- [GPT Visual Production Contract CURRENT](https://app.notion.com/p/3ef0e68bd69f81d28ceff1ec7a44e95b)

### Git 기준선 (commit 고정)

- [통합 설계 00 v1.1](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/00_APMath_Construction_Visual_Production_통합마스터계획_v1.1.md)
- [Construction Kernel 01](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/01_APMath_Construction_Kernel_세부구현계획_v1.1.md)
- [Function Graph/Axis 02](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/02_APMath_Function_Graph_Coordinate_Axis_Publication_세부구현계획_v1.1.md)
- [Typography 03](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/03_APMath_Typography_Font_세부구현계획_v1.1.md)
- [Measured Layout 04](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/04_APMath_Measured_Layout_Publication_세부구현계획_v1.1.md)
- [One-Click Runner 05](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/05_APMath_One_Click_Runner_세부구현계획_v1.1.md)
- [Actual Archive 06](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/06_APMath_Actual_Archive_Integration_세부구현계획_v1.1.md)
- [Problem → Visual 07](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/07_APMath_Problem_to_Visual_Request_세부구현계획_v1.1.md)
- [Qualification/Seal 08](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/08_APMath_Qualification_Seal_세부구현계획_v1.1.md)
- [상위 아키텍처 재검토](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)
- [사업화 로드맵](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/docs/plans/AP_MathOS_Archive_EdTech_Master_Roadmap_CURRENT.md)
- [Production README](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/archive/tools/geometry-equation/production/README.md)
- [Production contracts (9 experimental capabilities)](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/archive/tools/geometry-equation/production/contracts.mjs)
- [Construction and Cindy observer](https://github.com/icefoxtail/AP------/tree/7b2a4f1ce9fcdc5405079bd17833270946a41396/archive/tools/geometry-equation/production)
- [Qualification implementation](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/archive/tools/geometry-equation/production/qualification.mjs)
- [ALIVE Visual renderer](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/alive/engine/visual_renderer.py)
- [ALIVE Visual lane](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/alive/engine/visual_lane.py)
- [ALIVE 다음 학교 SVG 계약](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/alive/06_EXECUTION/ALIVE_NEXT_SCHOOL_CREATE_WITH_SOLUTION_SVG_CURRENT_v1.md)
- [Archive Stage Validators](https://github.com/icefoxtail/AP------/tree/7b2a4f1ce9fcdc5405079bd17833270946a41396/archive/tools)
- [Geometry publication CI workflow](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/.github/workflows/geometry-publication-tests.yml)
- [Codex / Archive current AGENTS](https://github.com/icefoxtail/AP------/blob/7b2a4f1ce9fcdc5405079bd17833270946a41396/AGENTS.md)

**최종 구분:** `DOCUMENT_COMPLETE ≠ IMPLEMENTATION_COMPLETE ≠ ENGINE_ACTIVE ≠ STUDENT_PUBLISHED`.