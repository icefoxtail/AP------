# AP Math SVG·Visual Production Engine 통합 설계서

**버전:** v1.4-REVIEW (v1.3-REVIEW 개정)  
**작성 기준일:** 2026-10-15 (KST)  
**문서 성격:** 기존 설계 00~08 및 현행 코드의 통합·정합 검토본  
**상태:** `DESIGN_REVIEW_COMPLETE / NOT_APPROVED_FOR_IMPLEMENTATION`  
**참조 Git:** `icefoxtail/AP------`  
**원 분석 스냅샷:** `main 7b2a4f1ce9fcdc5405079bd17833270946a41396` (2026-10-15 18:30 KST 커밋)  
**v1.4 표적 재확인:** `main d279ba2fc2bcdb5726d5845a54468ce480fc4e94` (2026-10-15 19:25 KST 커밋; 재확인 범위는 §1.1·§16)  
**적용 범위:** SVG/수학 시각자료의 구성·생성·측정·검증·연계 설계. 시험지 콘텐츠와 실제 운영 소스 변경은 제외.

> **문서 위치와 효력.** 이 문서는 기존 `docs/plans/00_APMath_Construction_Visual_Production_통합마스터계획_v1.1.md`와 Detail 01~08을 **대체하거나 자동 승격하는 새로운 Git 정본이 아니다**. 현재 구현과 원래 설계의 차이를 재해석해, 보완 방향과 설계 결정 후보를 하나로 묶은 **검토용 완결 문서**다. 코드 구현, Codex 착수, 엔진 `QUALIFIED/ACTIVE`, 시험지 수정, Git 병합·배포는 이 문서 작성으로 승인되거나 수행되지 않는다. 앞서 작성한 `APMath_SVG_STAGE0_Codex_Execution_Directive_2026-10-15.md`는 **미승인 작업지시서**로 남기며 본 문서의 실행 근거로 사용하지 않는다.

> **v1.3 개정 이력 (v1.2 대비).** ① 설계 목표를 '범용 단일 엔진'이 아니라 **'정확도가 검증된 좁은 capability의 모음 + 커버리지 확장'으로** 명시(§0.1). ② 중고등 시각자료 유형 목록(taxonomy) 추가(§4.1). ③ 확장 우선순위 규칙(§10.4)과 유형 확장 사이클 V7, 게이트 수치 제안(§11, §11.2) 추가. ④ **육안 검수 없이 AI가 렌더해 검증하는 운영 전제**의 AI 전용 검증 프로토콜 추가(§12.4). ⑤ 위험 원장 R-12~R-14 추가(§14). 이 항목은 v1.3의 개정 이력이다. 그중 표현·판정 조건은 아래 v1.4 개정 사항으로 보완한다.

> **v1.4 개정 요지 (v1.3 대비).** ① 기존 블라인드 검증·변조 테스트의 재사용 범위를 명시한다. ② capability 개수와 실제 커버리지를 분리하고 검증을 수반하는 버전 확장을 허용한다. ③ 이중 추출 불일치·입력 누락·검사 실패·미실행·증거 누락을 구별한다. ④ SVG에 표시할 사실과 본문에 보존할 조건을 분리하여 역검증한다. ⑤ 정상/오류 fixture를 함께 시험하고 SHA 거부와 수학 오류 검출을 별도로 평가한다. ⑥ 공통 검증 기반은 먼저, 기능별 검증은 해당 기능과 함께 구축하도록 V0~V7의 의존성을 보완한다. **사람의 육안 검수 없는 AI 전용 검증 전제, 기존 엔진 보존, 문서 검토본 상태는 유지한다.** 상세 반영표는 §17에 있다.

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

### 0.1 목표 정의 — '범용'의 의미 (v1.3 추가)

**운영 목표:** 중고등 전반의 수학 시각자료를 처리하는 엔진급 시스템. 단, 정확도와 범용성은 서로 다른 축으로 다룬다.

- **정확도**는 지원 범위가 좁고 규칙이 명확한 capability 안에서 나온다(결정론적 수학 모델 + 독립 observer + 변조 테스트). 범위를 넓힌다고 올라가지 않으며, 오히려 '그럴듯한 생성'의 압력이 생겨 낮아질 수 있다.
- **범용성**은 정확도가 검증된 capability들이 실제로 처리하는 **고유 UID·surface의 범위(커버리지)를** 넓혀 달성한다. capability 개수는 관리 지표일 뿐 커버리지 자체가 아니다. 기존 버전의 지원 범위를 조용히 넓히지 않으며, 확장은 신규 capability 또는 지원/제외 범위가 명시된 버전 개정으로 관리한다. 추가 범위의 검증과 기존 범위의 회귀 검증을 각각 갖춰야 한다.

| 원칙 | 내용 |
|---|---|
| P1 Capability 단위 정확도 | 정확도 주장은 capability의 선언된 지원 범위 안에서만 한다. |
| P2 Fail-closed | 지원 밖 입력은 **해당 capability에서** `UNSUPPORTED`로 거부한다. 필수 원문·이미지가 없을 때만 `INPUT_REQUIRED`다. 기존 승인 backend의 지원 범위에 맞으면 동일 품질 기준으로 인계할 수 있으나, 실패 후보의 승인이나 전체 작업 중단으로 바꾸지 않는다. |
| P3 커버리지는 측정 지표 | '시각자료 필요 문항 중 엔진 처리 비율'을 census로 측정한다. 수치 확정 전에는 약속하지 않는다. |
| P4 한 번에 한 지원 범위 | V7에서는 신규 capability 또는 명시적 버전 개정 중 한 범위를 다룬다. 무검증 범위 확대·기존 자격의 자동 상속은 금지하고, 공통 수학·관측 코드는 재사용한다. |
| P5 AI 전용 검증 전제 | 사람의 육안 검수를 필수 gate로 두지 않는다. 결정론적 검사 + 격리된 AI 이중 추출/역검증 + 정상·오류 fixture 시험을 결합한다. 동일 SHA의 유효한 독립 증거는 적용 범위 안에서 재사용한다(§12.4). |

**비목표:** 단일 범용 CAS/solver, 임의 수학 문제의 자동 증명, 모든 입력에 대한 무조건 출력.

## 1. 조사 기준·확인 범위·용어

### 1.1 기준선과 한계

- 원 분석은 Notion 「GPT 작업 전 필독 라우터」, 「Archive 2.0 / JS Archive 시작 페이지」, 「Archive 전체 작업 생명주기」, 「JS Archive GPT Visual Production Contract v1」과 기존 00~08을 근거로 했다. v1.4 편집 전에는 라우터·시작 페이지·생명주기의 관련 현재 조항을 다시 조회하여 문서 수정 범위와 기존 운영 경계를 확인했다.
- **v1.2 원 분석 이력:** 당시 Git `main 7b2a4f1`을 직접 확인했다. 앞선 비교 기준 `9bafbb8` 이후 2개 커밋의 변경 파일은 `25_제일고…/q22/C3-solution.svg`, `archive/tools/generated-meta/normalize-qid9-svg.cjs`, 관련 테스트 및 `tools/run-tests.js`다. 이는 **원본 설계 00~08이나 Geometry 핵심 코드의 구조 변화가 아니다**. 다만 코드 변경이 전혀 없다는 포괄적 선언은 하지 않는다.
- **원 분석의 대상:** Git의 기존 통합 설계 00과 Detail 01~08 v1.1, 2026-10-05 상위 아키텍처 재검토, 당시 Production/Visual/ALIVE/Archive 코드 및 운영 계약이다. 이를 이번에 전부 새로 감사한 것으로 계산하지 않는다.
- **v1.4의 입력과 추가 확인:** 첨부 v1.3-REVIEW 원문과 직전 검토의 여섯 보완점을 편집 기준으로 사용했다. 최신 확인 `main d279ba2fc2bcdb5726d5845a54468ce480fc4e94`에서 `production/contracts.mjs`, `production/blinded-review.mjs`, `production/source-policy.mjs`, `tests/primitive-observer.test.mjs`, 루트 `AGENTS.md`의 관련 조항을 표적으로 다시 읽었다. 추가 코드 근거는 §16의 S14-01~05로 분리한다.
- v1.4에서 새로 구체화한 필드·정규화/불일치 절차·정상/오류 시험 계약은 **설계 보완안**이다. 코드로 이미 구현되었다는 주장과 구별한다. 원 분석의 나머지 현황은 당시 스냅샷의 근거를 보존하며 전체 저장소 최신 상태로 소급 인증하지 않는다.
- 이번 작성 환경에서 로컬 저장소의 Node/Python 회귀·Chromium 실제 렌더·학생용 엔드투엔드·전체 기출 census를 **재실행하지 않았다**. 과거 보고서의 `118/118`, `48/48`, synthetic `5/5`는 **2026-10-05 과거 실행 이력**일 뿐 이번 main의 재검증 수치가 아니다.
- 설계 목표를 코드의 **실제 구현**, 문서의 **의도**, 운영의 **ACTIVE 상태**와 혼용하지 않는다.

### 1.2 증거 등급·시스템 자격·검사 상태의 분리

**증거 등급:** `CODE_CONFIRMED`(특정 SHA 소스 확인), `DESIGN_DOCUMENTED`(설계만 확인), `HISTORICAL_TEST`(과거 테스트), `VERIFIED_CURRENT`(현재 동일 SHA 실제 테스트), `NOT_TESTED`(미실행), `UNKNOWN`(증거 불충분). 증거 등급 자체는 품질 PASS가 아니다.

**시스템 자격:** `EXPERIMENTAL`(제한된 실험), `CAPABILITY_QUALIFIED`(정해진 유형·분모의 정식 자격), `ENGINE_SEALED`(정해진 시스템 기준 충족), `ACTIVE`(승인된 소비 경로에서 활성), `PUBLICATION_READY`(해당 문항·최종 바이트의 승인·표시 증거 완료), `PUBLISHED`(별도 실제 출고/배포 확인). 서로 자동 승격하지 않는다.

**검사·결함 상태:** 서로 다른 원인을 하나의 중단 상태로 합치지 않는다. 아래는 통합 설계의 판정 의미이며 현행 엔진 enum을 자동으로 추가·교체하는 코드 계약이 아니다. D05 어댑터는 원래 상태·오류 코드·근거를 보존하여 연결한다.

| 상황 | 기록할 상태/근거 | 승인·진행 경계 |
|---|---|---|
| 필수 원문·필수 이미지·source authority를 확보하지 못함 | `INPUT_REQUIRED` + 누락 자산/필드 | 해당 후보의 입력 의존 단계만 진행 불가 |
| 원문은 있으나 추출·해석이 충돌함 | 불일치 기록 + 표적 재확인; 미해결은 `EVIDENCE_DEBT` | `INPUT_REQUIRED`로 오기하지 않음. 미해결 조건이 있는 후보의 승격 차단 |
| 선언된 지원 범위 밖 입력 | 해당 capability의 `UNSUPPORTED` + 제외 조건 | 승인된 다른 backend가 처리할 수 있으면 기존 계약으로 인계 |
| 지원 범위 안에서 실행한 수학·시각 검사가 실패함 | `FAIL` + 실제 검사 축/오류 | `UNSUPPORTED`로 재분류하여 실패 실적을 숨기지 않음 |
| 검사 자체를 실행하지 못함 | 해당 축 `NOT_RUN` + 원인 | 도구 오류·의존성 부재는 검사 PASS/오류 검출로 세지 않음 |
| 실행 흔적은 있으나 판정에 필요한 증거가 없음/불일치 | `EVIDENCE_DEBT` 또는 검증 미확인 + 누락 ref | 미실행과 구별하고 증거 확보 전 PASS로 사용하지 않음 |
| 실험 구현은 있으나 정식 자격 증거가 미완료 | `EXPERIMENTAL` 자격 유지 + 미완료 축 | 입력 미지원과 구별. 자격·활성화 자동 승격 없음 |

`HOLD`는 과거 자료·설계 분모의 보류 표기에 한정한다. 실제 신규 Codex 시험지 운영에서 임시 item/run HOLD를 발행하지 않는 현행 규칙을 변경하지 않는다. **차단 단위는 근거가 부족하거나 실패한 후보·capability 버전·검사 축이다.** 무관한 정상 작업과 이미 승인된 backend를 일괄 중단하지 않으며, 이 문서가 운영 차단·예약 변경 권한을 부여하지 않는다. [S14-05]

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

### 3.4 기존 검증 기반의 재사용과 신규 통합 범위 (v1.4 보완)

| 기존 경로 | 코드에서 확인한 기반 | v1.4에서 보완할 범위 |
|---|---|---|
| `production/blinded-review.mjs` | `assertStudentOnly`, `blindThenCompare`: 원문 전용 입력, 블라인드 결정 동결·바이트 재확인, 별도 context에서 비교. `validateReviewLineage`와 `reuseReviewAuthority`: 검수 계보 검사·유효 증거 재사용 | 서로 독립된 **두 조건 추출 경로**의 동일 입력 결속, 의미 보존 정규화, 불일치 분류·근거 있는 조정, 최종 렌더 역검증 연결 |
| `tests/primitive-observer.test.mjs` | 정상 SVG 수용 assertion과 좌표·owner·glyph·상위 transform·숨겨진 축/라벨 등의 변조 거부 assertion | capability별 주입 오류 목록, 정상 오거부 검사, 실제 적용된 변조·예상 검사 축·미검출·스킵의 집계 |
| `production/source-policy.mjs` | 원문 조건·그림과 계획의 대조, 본문 보존 대상의 `PRESERVED_ARCHIVE_BANK` 매핑 | 원문 사실의 보존 위치와 SVG 필수 표시 사실을 연결한 검증 범위 계약 |

위 기반은 이번 SHA의 **`CODE_CONFIRMED`이며** 테스트를 재실행한 결과가 아니다. 블라인드→비교 경로의 존재가 곧 이중 추출 두 결과의 대조 또는 AI 최종 렌더 역검증 전체의 구현 완료를 뜻하지 않는다. **기존 기반을 재사용하고 부족한 연결만 보완한다.** 같은 기능의 검증기를 새로 만드는 일과 독립 관측 구현을 보존하는 일을 구별한다. [S14-02~04]

## 4. Capability 현황 — 실제 지원 범위와 안전 경계

**표적 재확인한 `production/contracts.mjs`의 등록부에는 기하 작도 1개와 함수 계열 8개, 총 9개 spike capability가 있으며 모두 `EXPERIMENTAL`이다.** 함수 계열만 9개라는 뜻은 아니다. 유형명이나 등록 개수로 모든 수학·도형의 일반 사례를 처리할 수 있다고 주장하지 않는다. [S14-01]

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

### 4.1 중고등 시각자료 유형 목록(taxonomy) — V0에서 코드로 확정 (v1.3 추가)

아래 '현황'은 **v1.2 원 분석 범위**를 보존하며 함수 계열 개수만 v1.4의 등록부 재확인으로 바로잡았다. '확인 안 됨'은 *없음*이 아니라 *이 문서의 근거로는 판단 불가*를 뜻한다. 실제 지원 여부와 분모는 V0의 Capability Manifest·Error Census가 확정한다.

| 영역 | 유형 | 현황(v1.2 근거) |
|---|---|---|
| 기하 | 작도·삼각형·원·접선·좌표기하 | 제한형 실험 구현 |
| 함수 | 다항·유리·무리·절댓값·구간별·지수·로그·삼각 | 함수 계열 8개 실험. 기하 작도 1개와 합쳐 등록 capability 총 9개; 범위 좁음 |
| 공통 | 수직선·표·논리 흐름도 | 시각 fact 검증 경로 존재 |
| 좌표 위 영역 | 부등식 영역, 선형계획, 적분 넓이, 접선·극값 | 확인 안 됨 |
| 통계 | 도수분포표·히스토그램·상자그림·산점도·정규분포 | 확인 안 됨 |
| 확률·집합 | 벤다이어그램·수형도·경우의 수 표 | 확인 안 됨 |
| 벡터·공간 | 공간좌표·벡터·입체 전개도·단면 | 확인 안 됨 |

유형 추가의 우선순위와 절차는 §10.4와 V7(§11)을 따른다.

## 5. 통합 목표 구조 — 변경이 아니라 계약 연결

```text
[기출 Source JS / 검증된 해설 / ALIVE 후보 / TWIN Template]
         │ identity, sourceRef, verifiedSolutionRef, parameter-set
         ▼
(1) Source Resolver + Visual Necessity Planner
    ├─ PROBLEM_VISUAL / SOLUTION_VISUAL 분리
    ├─ 원문 전용 독립 조건 추출·동결·불일치 해결 (§12.4)
    ├─ 원본 그림 충분성, 핵심 시각 관계, source 조건 전수
    └─ KEEP / REUSE / EXEMPT / ADD / POLISH / REBUILD
         ▼
(2) Common VisualRequest + FrozenVisualPlan [제안하는 opt-in adapter]
    ├─ Node canonical wire + source/solution/parameter SHA
    ├─ 수학 사실 GIVEN / DERIVED / CONCLUSION 및 owner
    ├─ geometry construction plan / graph plan / legacy ALIVE spec
    └─ 지원 밖 입력은 해당 경로 거부; 기존 승인 backend 인계는 보존
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
3. `verifiedSolutionRef`가 필요한 math/solution path에서는 미검증 해설을 정본처럼 취급하지 않는다. 필수 원자료가 없으면 `INPUT_REQUIRED`, 자료는 있으나 검증·계보 증거가 미완료이면 `EVIDENCE_DEBT`/검증 미확인으로 구별한다. 어느 경우도 검증 완료로 승격하지 않는다.
4. TWIN의 `parameterBindingRef`가 존재하면 original source와 변형 candidate의 수학 사실/정답/해설/visual revision을 함께 식별한다. 난수 seed만으로 동일성 증명이 끝나지 않는다.
5. `purpose`는 `QUALIFICATION`과 ordinary `CANDIDATE_BUILD`를 분리한다. qualification 실험 결과는 운영 공개 권한과 별개다.
6. 실제 payload 스키마는 기존 `production/contracts.mjs`, `phase2.mjs`, `alive/engine/visual_lane.py`에 대해 입출력 호환 테스트를 거쳐 결정한다.

### 5.3 FrozenVisualPlan 공통 경계

수학 planning은 `(source conditions → expected facts → executable model)`로 닫는다. source image가 포함된 경우 텍스트의 표·도형 조건을 누락 없이 Inventory화한다. LLM은 의도와 조건을 추출·계획할 수 있으나 **raw SVG 생성값이나 선호 좌표를 계산 authority로 채택하지 않는다**. `sourceConditionId`, entity/point owner, given/derived/conclusion, coordinate mode, branch selection, 허용한 자유 파라미터, graph domain 및 required features를 freeze한다.

좌표 없는 도형은 `SSS_POSITIVE_SIDE_v1`처럼 **명시적인 closed realization recipe**를 사용한다. 실제 원문이 좌표계를 고정한 경우 `SOURCE_COORDINATE_AXES_v1`의 축척을 임의 변경하지 않는다. SELECT_POINT branch guard는 `inputs`뿐 아니라 `branch.refs` 등 숨은 참조까지 캐시 의존성에 포함해야 한다.

### 5.4 사실의 보존 위치와 표시 역할 (v1.4 보완)

원문 조건 전체와 SVG가 표시해야 하는 사실 집합은 동일하지 않다. 각 사실에는 **보존/표시 위치**와 **수학적 역할**을 별도의 축으로 둔다.

| 보존/표시 위치 | 확정할 내용 | 확인 방법 |
|---|---|---|
| SVG 필수 표시 | 점·선·원·라벨·열린/닫힌 끝점·필수 보조선·결정 관계와 owner | 최종 primitive 관측 + 동일 자산의 실제 렌더 역검증 |
| Archive 본문 보존 | 발문·보기·조건·수식·해설 중 SVG 중복 표시가 불필요한 부분 | 보호된 본문/이미지의 source parity, 정확한 위치 참조 |
| 생략 가능한 도출 보조 정보 | 계산 과정의 보조 객체 등 최종 그림에 불필요한 정보와 그 이유 | 원문 조건 또는 SVG 필수 사실을 누락시키지 않았는지 확인 |

`GIVEN / DERIVED / CONCLUSION`은 위 위치 구분과 **독립적인 factRole**이다. 도출 사실도 SVG에 표시될 수 있고, 원문 조건도 본문에 보존될 수 있다. 원문 조건을 도출 보조 정보로 바꿔 생략하지 않는다. 본문과 SVG 양쪽에 나타나는 사실은 양쪽 표현의 일치까지 확인한다.

계획에는 `sourceConditionId / factId / factRole / displayDisposition / expectedOwner / preservedLocationRef / reason`을 연결하는 `factDisplayMapRef`를 **설계 필드**로 둔다. 실제 schema 적용은 D05와 현재 receipt에 대한 어댑터 설계에서 결정한다. 생성자의 표시 계획만으로 원문의 완전성을 인증하지 않으며, 독립 source 추출 결과와 매핑을 대조한 후 동결한다. 기존 `PRESERVED_ARCHIVE_BANK` 의미를 재사용한다. [S14-04]

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
| source 필수 자료 누락 | 누락 원문·이미지 확보, 해당 후보 `INPUT_REQUIRED` | 자료가 있는 해석 불일치까지 입력 누락으로 처리 |
| source 추출·해석 충돌 | 양쪽 동결 결과와 원문 위치를 보존하고 표적 재확인; 미해결 `EVIDENCE_DEBT` | 합의될 때까지 재생성, 다수결, 원문 조건 삭제 |
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

기존 핵심 필드는 유지한다.

`questionUid / sourceRef / verifiedSolutionRef / surface / expectedFactsSha / constructionOrGraphSnapshotSha / finalSvgRef / finalSvgSha / actualArchiveAssetResponseSha / screenshotRef / displayedSizeClass / renderedLayoutVerdict / independentReviewRef / capabilityStatus / versionBindings / unresolvedAxes`.

v1.4의 **추가 설계 필드**는 다음처럼 기존 기록을 참조한다. 별도 영구 원본 DB나 새로운 단계 상태 원장을 만들지 않는다.

| 증거 묶음 | 추가 참조/필드 | 결속 대상 |
|---|---|---|
| 독립 추출·불일치 | `extractionPathIds`, `extractionRefs`, `normalizationPolicyRef`, `normalizedConditionsSha`, `conflictResolutionRef` | 동일 source/image SHA, 실제 모델·context·invocation, 양쪽 원결과의 동결 SHA, 최종 채택 근거 |
| 표시 범위·역검증 | `factDisplayMapRef`, `reverseCheckRef` | SVG 필수 사실, 본문 보존 위치, 관측 결과, final asset/캡처/runtime/profile |
| 검증기 자격 시험 | `mutationSuiteRef`, `mutationReportRef`, `validatorFingerprint` | 정상/오류 목록·버전, 실제 적용된 변조, 예상/실제 검출 축, 스킵/미검출, 지원 범위 |

`mutationSuiteRef`는 목록, `mutationReportRef`는 **실제 실행 결과**를 뜻한다. 목록만 연결해서 검증기 시험 완료로 처리하지 않는다. 유효한 동일 검사기 fingerprint·지원 범위의 시험 결과는 여러 문항이 공유 참조할 수 있으며 매 문항 전체 suite 재실행을 요구하지 않는다.

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

### 10.1.1 커버리지 계산 계약 (v1.4 보완)

계산 단위는 고정 census 스냅샷의 **고유 `(questionUid, surface)`다**. 같은 문항의 문제용·해설용은 다른 대상이지만, 같은 대상의 재시도·다중 backend·중복 파일은 중복 계산하지 않는다. 고유 UID 수와 surface 수를 함께 보고한다.

`D`를 시각자료 필요성이 실제 검토된 대상 집합(`VISUAL_REQUIRED_REVIEWED`)이라고 할 때, 다음 비율을 따로 계산한다.

| 지표 | 분자 / 분모 | 해석의 한계 |
|---|---|---|
| 입력·구현 적합 비율 | `D` 중 실제 입력과 선언된 구현 범위가 맞는 대상 수 / `n(D)` | 코드로 처리 가능하다는 분류이지 품질 승인·실행 성공률이 아님 |
| 자격 확보 지원 비율 | 위 대상 중 해당 버전·지원 범위의 qualification 근거가 유효한 대상 수 / `n(D)` | capability 자격과 개별 문항 공개 준비를 구별 |
| 실제 렌더 확인 비율 | `D` 중 해당 source/asset revision의 Actual Archive 증거가 유효한 대상 수 / `n(D)` | 학생 배포 완료나 전체 수학검수를 뜻하지 않음 |

여러 capability가 같은 대상을 지원하면 합집합으로 세어 분자가 분모를 넘지 않게 한다. `n(D)=0`이면 비율을 0%/100%로 만들지 않고 **분모 없음**으로 표시한다. 필요성이 미검토된 대상은 별도 UNKNOWN 수와 검토 완료율로 드러내며, 검토된 부분집합의 비율을 전 기출 비율로 일반화하지 않는다. `X%`는 이처럼 분모를 고정한 활용 목표이며 capability 정확도 승인 gate가 아니다.

### 10.2 Error Census 분류 사전

`SOURCE_CONDITION_MISSING`, `SOURCE_EXTRACTION_CONFLICT`, `WRONG_MATH_MODEL`, `BRANCH_AMBIGUOUS`, `UNSUPPORTED_CAPABILITY`, `WRONG_ENDPOINT_OR_TOPOLOGY`, `OWNER_MISMATCH`, `LABEL_COLLISION`, `FONT_GLYPH_OR_NOTATION`, `VIEWPORT_CLIP`, `ASSET_MISSING`, `ASSET_SHA_MISMATCH`, `ARCHIVE_RENDER_NOT_RUN`, `REVIEW_UNVERIFIED`, `DUPLICATE_OR_STALE_UID`, `VALIDATOR_FALSE_REJECT`, `VALIDATOR_MISSED_ERROR`, `MUTATION_FIXTURE_INVALID`.

추가 분류는 문서의 오류 사전 제안이다. `SOURCE_EXTRACTION_CONFLICT`는 사유 코드이며 새로운 top-level 상태 enum을 즉시 요구하지 않는다.

**출력 단위:** 고유 UID(문제/해설 surface 별도) × 오류 유형 × 코드 경로 × 실제 증거 SHA × `EXISTS / FAIL / UNKNOWN` × 중복제거 근거. 자동 분류는 의심 후보이며, 교육적 필요성·일부 수학적 의미는 별도 검토 대상으로 남긴다.

### 10.3 Capability Manifest의 설계 필드

`capabilityId / capabilityVersion / parentCapabilityRef / backend / specVersion / sourceFamilies / supportedDomain / excludedCases / changedSupportScope / positiveFixtureRefs / negativeFixtureRefs / mutationSuiteRef / mutationReportRef / realUidRefs / requiredFeatureCoverage / mathObserver / renderedObserver / validatorFingerprint / nodePythonDependencyRefs / currentEvidenceGrade / qualificationLevel / activationState / blockers / owner / lastVerifiedSha`.

버전 개정에서는 이전 지원/제외 범위, 추가 범위, 기존 범위 회귀, 자격 증거 재사용 가능 영역을 명시한다. 필드명은 상위 설계 예시이며 현행 코드에 일괄 추가하도록 승인한 것이 아니다.

`CODE_CONFIRMED`도 manifest 행은 만들 수 있지만 테스트가 없으면 `VERIFIED_CURRENT`를 넣을 수 없다. 지원범위와 regression의 실제 누락은 0단계에서 동결·측정할 사안이지 이 문서에서 사전 PASS하지 않는다.

### 10.4 유형 확장 우선순위 규칙 (v1.3 추가)

- **입력:** Error Census에서 `VISUAL_REQUIRED_REVIEWED`이면서 `UNSUPPORTED_CAPABILITY`인 대상을 유형별로 집계한다. 고유 UID 수를 우선순위에 사용하고 문제/해설 surface 수는 별도 보고한다. 같은 대상의 중복 실패·재시도는 추가 수요로 세지 않는다.
- **순서:** ① 미지원 UID 수가 많은 유형 우선, ② 수학 모델을 결정론적으로 닫기 쉬운 유형 우선, ③ 동률이면 기존 capability·observer 재사용도가 높은 유형 우선.
- `UNKNOWN`/`EVIDENCE_DEBT`는 0으로 계산하지 않고 별도 열로 남긴다.
- 한 번에 한 유형의 신규 capability 또는 명시적 버전 개정만 대상으로 삼으며, 착수 전에 지원/제외 범위와 기존 버전 대비 차이를 manifest 형식으로 선언한다. 코드 재사용과 자격 상속은 별개다. 추가 범위 검증과 기존 범위 회귀를 모두 갖추지 못하면 새 버전의 자격을 승격하지 않는다.

## 11. 권장 업그레이드 구조 — 별도 구현 착수 전 합의용

이 표는 **개발 우선순위와 종료 증거의 설계**이며, Codex에 대한 즉시 작업지시·명령 실행 권한이 아니다. 단계 이름은 사업화 로드맵 `S0~S8`과 혼동하지 않도록 `V0~V7`로 구별한다.

| 설계 단계 | 핵심 산출물 | 완료를 인정할 기준 | 유지해야 할 제한 |
|---|---|---|---|
| **V0 현황 동결** | 최신 코드·시험 기준선·Capability Manifest·Error Census·유형 목록(§4.1) | 분모·경로·SHA·실행/미실행·UNKNOWN이 모두 구별됨 | 코드/원본/프로덕션 변경 없음 |
| **V1 공통 계약** | UID/Wire/FrozenPlan/Result·권한/상태 adapter, 독립 추출·동결·증거 계약 | 동일 fact가 SHA/owner/typed scalar 왜곡 없이 왕복하고 기존 정상/오류 검사 기반과 연결 | legacy/ALIVE 호환 파괴 금지; 모든 미래 검증기 선완성을 요구하지 않음 |
| **V2 수학·파라미터 연결** | closed realization과 TWIN dependency, solver 및 대응 observer/오류 시험 | 유효 파라미터 재계산, 정상 fixture 수용, 퇴화·분기 오류의 예상 축 검출 | raw 좌표 덮어쓰기 금지; 실패를 미지원으로 숨기지 않음 |
| **V3 출판 단일화** | 실측 fragment→layout→composer→bounded repair | 동일 SVG bytes에서 hard collision/clipping/glyph 누락 0 | 사후 font patch·무한 repair 금지 |
| **V4 Archive 결속** | actual-size capture·independent primitive review·최종 receipt | UID/Source/asset response/SHA/runtime/screenshot 동일 revision | synthetic PASS를 real PASS로 대체 금지 |
| **V5 Qualification** | scope별 positive/negative, Geometry ≥6 + Graph ≥4 및 feature coverage, 독립 리뷰, 검증기 변조 테스트(§12.4) | frozen 분모의 조건·출처·실화면·독립 verdict 완료 | Codex 단독 `ACTIVE` 승격 금지 |
| **V6 제품 접목** | TWIN 템플릿 2~3 + ALIVE/Archive opt-in 통합 | 승인된 UID만 Consumer·출제; 제품별 회귀·배포 evidence | 기존 문제용 PNG·승인 시험지 일괄 재제작 금지 |
| **V7 유형 확장 사이클(반복)** | 유형 1개의 신규 capability 또는 버전 개정: 범위/차이 선언 → 재사용 수학·observer + 부족분 → 정상/오류 fixture → 실문항·기존 범위 회귀 → 등록 | 해당 버전의 필수 gate 완료 후만 자격 승격. 미검증은 실험 유지, 실행 실패는 FAIL, 범위 밖 입력은 UNSUPPORTED | 무검증 확대·자격 자동 상속·기존 코드 불필요한 복제 금지. X% 목표는 개별 자격 gate가 아님 |

**일정 판단:** V0가 밝혀내는 기술 부채에 따라 V1~V4는 이미 구현된 코드의 어댑터 보완만으로 끝나는 부분이 있을 수 있다. 반대로 새 graph family·실험 외 임의 도형의 지원은 분리된 추가 개발이다. 설계만으로 개발기간/지원률을 숫자로 확정하지 않는다.

### 11.1 사업화 마스터 로드맵과의 관계

- 사업 로드맵 **S0(JS→JSON 무손실 파생화)와** 본 설계 **V0(Visual 시스템 현황)는** **서로 다른 축**이다. S0를 변경하거나 이미 완료했다고 간주하지 않는다.
- S5 TWIN 제작은 V1/V2의 UID/solver/파라미터 계약과 V3/V4의 SVG 출판·실검증 인터페이스를 **파일럿 범위에서** 소비한다. 전 capability의 SEALED 완료를 처음부터 전제하지 않는다.
- ALIVE 다음 학교 CREATE 중 SVG 동시 제작은 기존 운영 계약대로 계속된다. 공통 엔진 전환이 그 생산을 중단시키는 선행조건이 아니다.
- S6 자동 생성·검수·등록에서는 `generated approval`/`capability ACTIVE`/`actual rendered asset`/`student lookup`의 별도 gate를 유지한다.

### 11.2 판정 게이트와 미정 수치의 분리 (v1.4 보완)

아래는 설계상 수용 기준이다. 실제 측정 결과나 실행 지시가 아니며, 미정인 N·X를 임의 숫자로 채우지 않는다.

| 항목 | 제안 기준 | 판정·분모 주의 |
|---|---|---|
| 정상 fixture 수용 | 동결된 유효 정상 fixture는 모두 기대한 정상 판정 | 모든 입력에 FAIL을 반환하는 검증기는 통과 불가. 실행 오류·스킵은 정상 수용 아님 |
| 주입 오류 검출 | 동결된 필수 목록 중 **실제로 유효하게 적용된 오류**를 예상 검사 축에서 모두 검출 | 해당 목록 안의 100%일 뿐 모든 오류 부재 증명이 아님. 필수 사례가 미실행/무효이면 gate 미완료 |
| 의미 오류와 SHA 오류 | 수학·표시 변조는 변경 바이트와 일치하는 운반 ref/SHA로 시험하고 기대 수학 사실은 보존 | 단순 stale SHA 거부를 좌표·owner·끝점 오류 검출로 대체하지 않음. SHA 변조는 별도 시험 |
| 이중 추출 | 정규화와 근거 기반 표적 재확인 후 **미해결 의미 불일치 0건**인 후보만 다음 승인 단계로 진행 | 최초 문자열 불일치 0건을 요구하지 않음. 자료 누락과 해석 충돌 구별; 원결과/변경 근거 보존 |
| 지원 밖 입력 | 선언된 지원/제외 범위의 동결된 음성 사례는 모두 예상한 미지원 판정 | 임의의 모든 입력을 시험했다고 주장하지 않음. 범위 안의 정상 입력을 거부하면 정상 오거부 |
| family 승격 실문항 수 N | 선언한 기능·분기·경계와 required feature를 덮는 유형별 N을 분모와 함께 확정 | N 미정. V5의 Geometry ≥6 + Graph ≥4와 별개인 유형별 기준이며 단순 개수로 coverage를 대체하지 않음 |
| 커버리지 목표 X | §10.1.1의 분모가 고정된 활용 목표 X% | X 미정. 개별 capability 정확도/승격 gate로 사용하지 않음 |
| 검사기 변경 후 재검 | 검사기 fingerprint·정규화/표시 정책 변화의 영향 범위 정상/오류 suite 재확인 | 새 버전에 과거 자격을 자동 부여하지 않음. 무관한 모든 문항 재검은 요구하지 않음 |

**구축 순서:** V1 직후에는 공통 독립성·동결·증거 계약과 **기존 기능의 정상/오류 시험 기반**을 확보한다. V2~V4의 수학·조판·렌더 확장에는 해당 observer와 오류 주입 시험을 함께 붙인다. 각 capability 승격 전에는 그 지원 범위의 정상/오류·실문항·AI 렌더 검증을 닫는다. **모든 미래 검증기 선완성이 아니라, 검증 없는 기능 승격을 금지하는 순서**다.

**게이트 미달 처리:** 후보의 FAIL·미해결 증거를 유지하고 해당 버전의 자격 승격을 보류한다. 원인에 따라 표적 수정·재검하거나 기존 승인 backend로 인계하되 검사 기준을 낮추지 않는다. 실제 운영 검증기에서 미검출이 확인되면 영향을 받는 버전·검사 축의 PASS 신뢰를 중단 대상으로 보고하고 기존 incident/rollback 권한 경로로 처리한다. 이 설계 문서 자체가 운영 일괄 OFF 권한은 아니다.

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
| 정상 대조군 | 위 각 축의 변조 전 정상 fixture, 표현만 동등하게 정규화한 조건 | 무조건 FAIL·정상 오거부를 잡고 정규화가 의미를 훼손하지 않는지 확인 |

### 12.3 독립 검수 권한

Codex는 허가된 범위의 구현·실행·기술 수리를 담당할 수 있지만, **도구 구현자가 실행한 테스트가 곧 도구의 독립 자격 승격은 아니다.** 새로운 capability가 `QUALIFIED/ACTIVE`가 되려면 frozen denominator·실제 final bytes·독립 reviewer verdict와 승인 권한을 별도로 확보해야 한다. 이는 기존 문항 R1/R2 품질 검수를 다시 무한 반복하라는 뜻이 아니다. 동일 SHA의 과거 유효 증거는 재사용하고 changed target과 직접 의존성만 재검한다.

### 12.4 육안 검수 없는 운영 전제 — AI 전용 검증 프로토콜 (v1.4 보완)

**운영 전제:** 학생용 SVG의 최종 확인에 사람의 육안 검수를 필수 gate로 두지 않는다. AI가 실제 렌더 결과를 읽고, 결정론적 관측기가 수학·표시 불변조건을 검사한다. 자격과 출고의 승인 권한은 §9와 기존 운영 계약에 남으며, 사람의 육안 검수 단계를 새로 끼워 넣지 않는다.

**공통 모드 실패의 한계:** 생성자와 검증자가 같은 오해를 공유하면 양쪽이 같은 잘못을 통과시킬 수 있다. 다른 모델 또는 분리된 세션은 이를 줄이는 수단이지 오류 독립성·완전한 정확도의 증명이 아니다. 동일 모델을 분리 세션으로 쓰는 경우도 그 사실과 남는 위험을 기록한다.

#### 12.4.1 기존 기반 재사용 — 코드 존재와 통합 완료 구별

`blinded-review.mjs`의 원문 전용 입력·동결·비교·계보 검사와 `primitive-observer.test.mjs`의 기존 정상/변조 사례를 우선 사용한다(§3.4, S14-02~03). 새로 필요한 것은 두 추출 결과의 정규화·근거 대조, 표시 사실별 역검증, capability별 시험 분모·결과 연결이다. 기존에 있는 기반 전체를 ‘미구현’으로 보고하거나 같은 기능을 중복 작성하지 않는다.

#### 12.4.2 두 추출 경로의 입력·동결·격리

두 경로에는 동일한 source revision의 **학생용 발문·보기·필수 원본 이미지**를 제공한다. 상대의 추출 결과, stored answer/solution, 생성 계획, 이전 verdict/defect는 공개하지 않는다. 두 경로의 결과를 각각 동결하고 저장된 바이트·SHA를 재확인한 뒤 비교한다. 정답·해설의 독립 검토와 문제 조건의 이중 추출은 목적을 구별하며, 기존 독립 추출 증거가 동일 입력·정책·격리 조건을 만족하면 이를 한 경로의 증거로 재사용할 수 있다.

각 결과에는 source/image refs, 실제 모델·context·invocation 식별, 제공한 입력 범위, 원문 위치와 연결된 조건, 원결과 ref/SHA를 남긴다. 모델·세션 정보를 확인할 수 없으면 값을 지어내지 않고 독립성 증거 부채로 표시한다. 서로 다른 세션 이름만 적었다는 이유로 독립성을 인정하지 않는다.

정규화된 조건은 적어도 **원문 위치·entity/owner·관계/연산·값/정확 표현·단위·부호·정의역·열린/닫힌 경계·조건 적용 범위**를 보존한다. Unicode·공백·순서 등 표현 차이는 문서화된 규칙으로 정규화할 수 있으나, `<`와 `≤`, 방향 있는 A→B, 교점 선택 branch, 원문의 조건과 해설의 결론을 같게 만들어서는 안 된다. 자유형 대수 동치·의미 동치를 검증 없이 단순 문자열 정규화로 확정하지 않는다.

#### 12.4.3 불일치 해결과 중단 단위

| 비교 결과 | 후속 처리 | 기록/판정 |
|---|---|---|
| 문서화된 정규화 규칙으로 표현만 다름 | 양쪽 원결과를 보존하고 적용 규칙·정규화 결과를 결속 | 표현 차이 해소; 새 수학 조건 추가 없음 |
| 수치·관계·범위·owner·조건 누락이 충돌함 | 해당 원문 영역만 다시 확인하고 채택/기각 근거를 남김. 필요하면 생성과 분리된 AI 검토 경로 사용 | 충돌 해결 기록은 새 evidence로 추가; 이미 동결한 두 결과는 덮어쓰지 않음 |
| 원문은 있으나 어느 해석이 맞는지 확정 못함 | 해당 후보의 승인·후속 증거 재사용을 차단하고 남은 정확한 조건을 지정 | `EVIDENCE_DEBT`, 사유 `SOURCE_EXTRACTION_CONFLICT`(설계 오류 분류) |
| 필수 원문·필수 이미지가 실제 누락됨 | 누락 자산 확보 전 관련 의존 단계 진행 불가 | `INPUT_REQUIRED` |
| 지원 범위 내부의 실제 수학·시각 오류가 확인됨 | 해당 원인과 직접 의존 부분을 수정·재검 | `FAIL` 보존; `UNSUPPORTED`로 감추지 않음 |

합의될 때까지 추출을 반복하거나, 다수결·생성자의 자기 해명만으로 정답을 고르지 않는다. 불일치 수리는 기존 D05 단일 재시도 예산과 정체 감지 규칙 안에서 수행하며 resume/담당자 변경으로 예산과 이력을 초기화하지 않는다. 미해결 의미 불일치가 남으면 후보를 통과시키지 않되 무관한 대상과 승인된 다른 backend의 작업은 계속할 수 있다. 새 근거로 source/조건 집합이 달라지면 해당 의존 plan·검수 증거를 무효화하고 필요한 범위만 재검한다.

#### 12.4.4 역방향 검증의 관측 범위

독립 AI는 먼저 **실제 렌더 이미지에서 보이는 사실**을 기록하고 이를 동결한다. 이 최초 관측에는 생성자가 작성한 expected facts·계획·PASS 결론을 정답처럼 주입하지 않는다. 동결 후 §5.4의 표시 매핑 및 원문과 비교한다. 화면 크기·문항 위치·asset response·SVG SHA·캡처/runtime가 최종 revision과 일치해야 한다. Source를 읽는 검토, SVG 자체의 관측, 전체 Archive 본문의 보존 검사는 별도 결과로 연결한다.

| 비교 축 | 필수 판정 | 잘못된 요구 또는 면제 |
|---|---|---|
| SVG 필수 사실 | 실제 점·끝점·보조선·owner·라벨·결정 관계가 보이고 기대 사실과 맞음 | 본문에 있다는 이유로 그림의 필수 사실 누락을 면제하지 않음 |
| 본문 보존 조건 | 해당 발문·보기·수식·해설·원본 이미지가 보호된 위치에서 유지됨 | 모든 원문 조건을 SVG 안에 다시 적도록 강요하지 않음 |
| 도출 사실/추가 표시 | 검증된 풀이에서 도출되고 GIVEN/DERIVED/CONCLUSION 역할이 맞음 | 증명할 결론을 원문에서 주어진 조건처럼 표현하지 않음 |
| 예기치 않은 추가 도형/표식 | 화면이 원문에 없는 수학 조건을 암시하지 않는지 확인 | 원문과 모순되는 선·각·접점 표식을 장식으로 무시하지 않음 |

좌표·길이·각·정의역·곡선 구간 내부 오차의 정확성은 수학/primitive observer가 확인한다. AI는 캡처에서 정확한 좌표를 추정해 수치 PASS를 대신하지 않으며, 의미 전달·owner 모호성·예기치 않은 표시 등 화면 판독 결과를 독립 축으로 제공한다. 관측 불가/미실행과 실제 불일치를 구별한다. 본문 조건의 보존은 기존 `PRESERVED_ARCHIVE_BANK` 매핑을 재사용한다. [S14-04]

#### 12.4.5 검증기 정상/오류 fixture 시험

**정상 대조군과 오류 주입군을 함께 검사한다.** 정상 입력을 모두 거부하는 검증기는 합격할 수 없다. 정상 기대값과 오류의 기대 효과는 시험 전에 원문·독립 수학 근거로 동결하며, 시험 결과를 본 뒤 기대값·분모를 바꿔 맞추지 않는다.

| 시험군 | 입력 준비 | 통과 조건 |
|---|---|---|
| 정상 fixture | 선언된 지원 범위 내의 올바른 모델·SVG·refs·캡처 | 기대한 정상 축 통과, 정상 오거부 없음 |
| 수학/의미 변조 | 좌표 이동, owner 교환, 끝점 반전, hole/점근선 누락, 비율 왜곡, SVG 필수 사실 누락 등 **해당 축이 관측 가능한** 오류 | 오류가 실제 적용됐음을 확인하고 예상한 수학/시각 축에서 검출 |
| 무결성 변조 | stale source/asset/runtime SHA, 잘못된 UID/ref | 기대한 무결성 gate에서 거부 |
| 지원 밖 입력 | 명시된 제외 범위의 입력 | 해당 capability가 기대한 미지원 판정; 정상 입력 거부와 구별 |
| 격리/계보 위반 | 생성자 verdict만 있음, 동일 context 재사용, 잘못된 동결/ref 연결 | 독립성·증거 계보 gate에서 거부 |

**SHA에 가려지는 가짜 검출 방지:** 수학/의미 변조 시험은 격리된 fixture에서 바뀐 SVG 바이트에 맞는 **운반용 파일 ref/길이/SHA**를 계산해 제공하되, 원문에서 고정한 기대 수학 사실·owner·표시 조건은 그대로 둔다. 그래야 검사기가 단순 SHA 불일치가 아니라 실제 수학·표시 오류를 잡는지 평가할 수 있다. 원본 승인 기록·production 자산을 바꾸거나 변조 결과에 실제 승인 권한을 부여하지 않는다. 원래 SHA를 남겨 거부시키는 시험은 별도의 무결성 사례로만 센다.

**분모와 검출 실적:** 각 사례의 `caseId / baselineRef / mutation / expectedAxis / applied / actualAxis / verdict / error / skipReason`을 남긴다. 주입 코드가 아무것도 바꾸지 않았거나 오류 효과가 없는 사례, XML 파손으로 목표 검사 축까지 도달하지 못한 의미 시험, 도구 crash·의존성 누락·timeout·스킵을 해당 의미 오류의 검출로 계산하지 않는다. 필수 사례가 무효/미실행이면 gate는 미완료다. 제외 사유와 수정된 시험 버전은 기록으로 남기며 사후 분모 축소로 100%를 만들지 않는다.

정상 수용률은 유효 정상 사례의 기대 정상 판정 수로, 오류 검출률은 유효하게 주입된 사례의 **예상 축 검출 수**로 각각 보고한다. 동결된 필수 suite 안의 정상 수용과 오류 검출을 모두 충족해야 하며, 이 실적을 목록 밖 오류 부재로 확대하지 않는다. AI observer의 판정 변동이 나타나면 숨기지 않고 기록하며, 같은 fixture를 통과할 때까지 재호출해 PASS만 선별하지 않는다. AI 경로의 반복성 기준은 capability 자격 분모와 함께 사전에 정한다.

검사기·정규화 정책·표시 매핑 정책·모델/프롬프트 등 해당 검증 결과의 의존성이 바뀌면 영향받는 정상/오류 suite를 재확인한다. 동일 fingerprint·동일 지원 범위의 유효 결과는 문항 receipt에서 재사용한다. 미검출/정상 오거부는 해당 버전의 자격을 차단하며, 기존 운영 경로에 영향을 주는 경우 조치 범위와 근거를 기존 책임자·incident 경로에 인계한다. 무관한 모든 capability·예약을 자체 OFF하지 않는다.

#### 12.4.6 증거 결속·한계·재사용

§9.3의 추출·표시 매핑·역검증·정상/오류 실행 보고서 참조를 연결한다. 실제 실행하지 않은 검사는 `NOT_RUN`, 실행했으나 필수 증거가 빠진 판정은 `EVIDENCE_DEBT`/검증 미확인으로 구별한다. 두 경우 모두 PASS로 재사용할 수 없다. 생성자·비교자·역관측자·최종 AI reviewer의 역할과 실제 입력 가시성을 확인하고, 동결된 결과의 사후 수정 여부를 검사한다.

이 프로토콜은 공통 모드 실패를 **줄이려는 설계**이지 제거를 보증하지 않는다. 교육적 적합성·정답 수·해설 충실성은 기존 R1/R2/ALIVE 검수 영역에 남는다. 새 오류 유형이 발견되면 §10.2 사전과 해당 capability의 정상/오류 suite를 증분 갱신한다. 기존 독립 증거의 재사용 여부는 source·policy·asset·검사기 의존성과 적용 범위로 판단하며, 재사용할 수 있는 검증을 다시 전수 반복하지 않는다.

## 13. 중복·비범위·안전 경계

**보존:** 기존 기출 JS/PNG/SVG·R1/R2/R3 증거, ALIVE renderer 및 생성 source, 기존 Student Consumer/Archive 검색·출력, legacy candidate CLI, MathJax CHTML 학생 본문 렌더, Node pipeline-core UID/hash.

**통합 시 새로 만들지 말 것:** 별도의 독립 geometry kernel, 중복 CSV/JSON ‘원본’ DB, 같은 기능의 validator 둘, 모든 SVG를 다시 그리는 전수 migration, 자체 브라우저 렌더러, 생성 대상별 중복 status enum, 기존 stage 프로토콜을 우회하는 출고 경로.

**비범위:** GeoGebra 드래그 UI, 단일 범용 CAS·solver(유형 확대는 V7 범위), 임의 수학 문제의 자동 증명, TikZ/PGFPlots backend 확대, 모바일 절대 font-size 전면 gate, 전체 시험지 무조건 그림 추가, 라이선스·수학·교육과정 검수 생략, 임의 프로덕션 asset rewrite.

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
| R-12 | 조건 추출과 검증의 공통 모드 실패 | 기존 블라인드·동결·비교 재사용 + 독립 이중 추출 정규화/불일치 해결 + 표시 사실 역검증 (§3.4, §12.4) | 기반 `CODE_CONFIRMED`; 이중 추출/역검증 통합은 설계 보완·미검증 |
| R-13 | 범용 목표 압력으로 지원 밖 입력을 억지 생성 | fail-closed(P2), 유형 단위 승격(V7) | 설계 제안 |
| R-14 | 일부 변조 테스트만으로 검증기 전체를 인증 | 기존 정상/변조 assertion 재사용, capability별 유효 주입·예상 축·미실행 분모 보완 (§11.2, §12.4) | 일부 테스트 코드 `CODE_CONFIRMED`; 현재 실행/통합 자격은 `NOT_TESTED` |
| R-15 | capability 개수 증가를 커버리지로 오인하고 같은 엔진을 복제 | UID·surface 합집합 지표와 versioned 지원 범위, 공통 코드 재사용 | 설계 반영, 실제 coverage 미측정 |
| R-16 | 무조건 FAIL 또는 SHA 오류만으로 수학 검증 100% 주장 | 정상 수용 + 목표 축 오류 검출, 의미 시험/무결성 시험 분리 | 설계 반영, suite 전체 실증 미실행 |

### 14.1 설계 결정을 위해 남겨 둘 최소 쟁점

1. 정식 unified wire는 기존 `APMATH_VISUAL_WIRE_v1`을 얇게 확장할지, 상위 envelope를 두고 하위 adapter를 유지할지 **호환성 실험**으로 확정한다. 지금 새 스키마 사용을 강제하지 않는다.
2. V5의 독립 자격 분모는 기존 `Geometry 6 / Graph 4`를 보존하되 실제 지원 family·required feature 범위가 커지면 **분모와 유형 커버리지**를 독립적으로 확대해야 한다.
3. TWIN 파일럿은 지금 지원 가능한 함수/기하 2~3개의 정예 Template부터 시작한다. 문항 대량 생성 수율은 측정 전 약속하지 않는다.
4. 전수 census가 교육적 필요성까지 자동 판단하지 못한다는 사실을 인정하고, `UNKNOWN`과 독립 AI 검토 계층을 남긴다(육안 검수 없음 전제, §12.4).
5. 독립 이중 추출과 역검증의 모델/세션 구성, 확인 가능한 식별·입력 격리 방식, AI 판정 반복성 기준은 구현 승인 전에 확정한다. 특정 모델명을 이번 문서가 임의 지정하지 않는다.
6. §11.2의 N과 필수 정상/오류·feature 분모는 capability별 자격 기준으로, X는 census 기반 활용 목표로 **별도 확정**한다. 모두 지금 미정이며 동결되지 않은 자격 분모를 통과했다고 주장하지 않는다.

## 15. 문서 완료 판정과 추후 실제 작업의 경계

**이번 문서 작성으로 완료된 것:** v1.3의 0~16장 구조·기존 설계 00~08의 역할·AI 전용 검증 전제를 보존하면서, 여섯 검토 사항을 본문과 관련 표에 반영했다. 기존 검증 기반 재사용, 지원 버전/커버리지, 상태 구분, 표시 매핑과 역검증, 정상/오류 시험, 단계 의존성을 정합화하고 §17의 개정 이력을 추가했다. **v1.4 통합 설계 검토본의 작성 완료**이며 독립 엔진 자격 심사 완료가 아니다.

**이번 작성으로 완료되지 않은 것:** 최신 Node/Python 기준선 실행, 전 기출 census 실제 집계, 신규 Source/Plan adapter 구현, 코드/검사기 수정, 진짜 SVG 재생성, 브라우저 렌더 E2E, 독립 품질 검수, 임의 capability 자격 승격, `ACTIVE`, main 병합, Student Consumer 등록 또는 배포.

**후속 진행의 올바른 순서:** 이 설계 검토본의 결정·범위 확정 → 그때에만 별도 V0 실행 지시/승인 → 측정된 V0 증거로 최신 통합 설계서 상세 항목 업데이트 → 작은 통합 파일럿 → 별도 독립 qualification → 필요시 배포. 기존 00~08, 운영 계약과 충돌할 때는 형님의 최신 명시 지시와 실제 current authority를 우선한다.

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

### v1.4 표적 재확인 근거 (commit 고정)

다음은 본 개정에서 다시 확인한 경로다. 위의 v1.2 원 분석 기준선 링크는 역사적 근거로 그대로 보존한다. 이 목록의 `CODE_CONFIRMED`는 실행 테스트 PASS를 뜻하지 않는다.

- **S14-01** [Capability 등록부와 result reducer](https://github.com/icefoxtail/AP------/blob/d279ba2fc2bcdb5726d5845a54468ce480fc4e94/archive/tools/geometry-equation/production/contracts.mjs#L33-L84) — 기하 1 + 함수 8의 등록과 실험 상태. Blob `817ed19db6209ac03d8f173ebb0f7045882c01c7`.
- **S14-02** [블라인드 입력·동결·비교·계보 검증](https://github.com/icefoxtail/AP------/blob/d279ba2fc2bcdb5726d5845a54468ce480fc4e94/archive/tools/geometry-equation/production/blinded-review.mjs) — 원문 전용 입력, 동결 후 비교, 별도 context, 유효 증거 재사용. Blob `29a90d53a9176d6dda41fbeecdf32361b4109e26`.
- **S14-03** [Primitive observer 정상/변조 테스트](https://github.com/icefoxtail/AP------/blob/d279ba2fc2bcdb5726d5845a54468ce480fc4e94/archive/tools/geometry-equation/tests/primitive-observer.test.mjs) — 정상 수용과 좌표·owner·glyph·transform·숨김 변조 assertion. Blob `5734bb520fd9cfa63cecc511b18c5cc94bf1b2d7`.
- **S14-04** [Source 검토 정책과 본문 보존 매핑](https://github.com/icefoxtail/AP------/blob/d279ba2fc2bcdb5726d5845a54468ce480fc4e94/archive/tools/geometry-equation/production/source-policy.mjs) — `PRESERVED_ARCHIVE_BANK`와 source/solution 검증 정책. Blob `67ec235defb6e36f15b8337c69aa222063148117`.
- **S14-05** [현재 AGENTS 관련 조항](https://github.com/icefoxtail/AP------/blob/d279ba2fc2bcdb5726d5845a54468ce480fc4e94/AGENTS.md#L1-L35) — 명시 범위 우선, 미실행/증거 부채, 기존 단계 역할·운영 변경 경계.

## 17. v1.4 개정 반영표와 문서 이력

| ID | v1.3 검토 사항 | v1.4 반영 위치 | 반영 결과 |
|---|---|---|---|
| U-01 | 기존 검증 기반까지 미구현으로 분류 | §3.4, §12.4.1, R-12/R-14 | 블라인드·변조 기반 코드와 미완료 통합을 분리 |
| U-02 | capability 개수=커버리지, 모든 범위 확장 금지 | §0.1, §10.1.1, §10.3~4, V7 | 고유 대상 합집합 지표와 명시적 versioned 확장 |
| U-03 | 추출 불일치=INPUT_REQUIRED, FAIL/미지원/증거 누락 혼동 | §1.2, §5.2, §8.2, §11.2, §12.4.2~3 | 원문 누락·해석 충돌·실제 실패·미실행 구별; 원결과 보존 |
| U-04 | 모든 원문 조건을 SVG에서 재추출하도록 오해 | §5.4, §9.3, §12.4.4 | 표시 위치와 factRole을 별도 관리, SVG 필수 사실/본문 보존 검사 분리 |
| U-05 | 모든 입력 FAIL 또는 SHA 거부만으로 오류 검출 100% | §11.2, §12.2, §12.4.5, R-16 | 정상 대조군 + 목표 축 검출, 운반 SHA와 의미 검사 분리 |
| U-06 | 모든 미래 검증기 완성을 V2의 선행조건으로 해석 | V1/V2/V7, §11.2 | 공통 기반 선행, 기능별 observer 동시 개발, 승격 전 범위별 자격 |
| U-07 | 함수 9개, V0~V6, 후속 v1.2 표기 | §4/§4.1, §11, §15 | 함수 8 + 기하 1, V0~V7, 최신 통합 설계서로 통일 |
| U-08 | 일부 최신 확인을 전 저장소 최신 감사로 확대 | 머리말, §1.1, §16 | 원 분석 스냅샷과 v1.4 표적 재확인 SHA/경로를 분리 |

| 버전 | 기준일 | 문서 상태/변경 | 실행·운영 변경 |
|---|---|---|---|
| v1.2-REVIEW | 2026-10-15 | 통합·정합 검토본; Git 등록 이력과 구현 승인을 구별 | 당시 문서 등록은 개발 착수/엔진 ACTIVE를 의미하지 않음 |
| v1.3-REVIEW | 2026-10-15 | 사용자 개정본: 좁은 capability·유형 목록·V7·AI 전용 검증 | 본 개정의 직접 편집 원문 |
| v1.4-REVIEW | 2026-10-15 | 여섯 보완점과 표기/근거 범위 정합화; Markdown·Word 검토본 | 문서 파일 작성만. Git/Notion 쓰기·제품 코드 실행/수정·엔진 승격·배포 없음 |

**보존 기록:** 입력 파일 `붙여넣은 텍스트(1)(2).txt`의 원바이트 SHA-256은 `da1b0233db7286edf40ca3e83752bc0e0e381bacb6fdfa5ac217e55b8529399f`이다. 원본 파일은 덮어쓰지 않았다. 개정본의 세부 절차와 필드 예시는 별도 구현 승인이 필요한 설계안이다.

**최종 구분:** `DOCUMENT_COMPLETE ≠ IMPLEMENTATION_COMPLETE ≠ ENGINE_ACTIVE ≠ STUDENT_PUBLISHED`.