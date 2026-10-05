# APMath Construction & Visual Production Engine — 최종 구현 계획서 v1.1

> **상위 재검토 반영 기준:** `0bb88da58e41ae1154911d4e711f6247e60e5f16`. 본문의 기존 조사 이력은 보존한다. 이번 재검토의 최종 결정은 마지막 추가 절과 [검토 보고서](APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)에 기록하며, 해당 항목은 앞선 초안의 포괄적 표현보다 우선한다. 제품 코드·신규 engine qualification은 이번 변경 범위가 아니다.

작성일: 2026-10-05 (Asia/Seoul)  
상태: **Detail 01–08 통합보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
최종 목표: **GeoGebra-grade static mathematical construction + publication engine**  
원문 조사 기준(이력 보존): `origin/main` = `b08ba2db04ba3be4d172b718aee29e169f8655d3`

통합 보완 기준 main: `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
개정일: 2026-10-05 (Asia/Seoul)  
원문: Library `붙여넣은 텍스트(1)(4).txt`의 전체 추출 텍스트. raw bytes export는 불가하여 text representation을 사용했다. 본문을 보존한 개정본이며 원 Library 항목을 덮어쓴 것이 아니다. 2–4절 등의 기존 조사/실험은 과거 기록을 보존한 것이며 이번 개정에서 재실행·최신 upstream 재검증한 것이 아니다. 아래 보완은 문서 계약 수정이고 제품 PASS/ACTIVE/Seal은 아니다.

## 1. 결정과 범위

수학 관계를 보존하는 **실행 가능한 construction graph**를 수학 정본으로 두고, **SymPy Geometry를 주 construction kernel**, **CindyJS를 독립 numeric cross-validator**로 사용한다. graph의 타입·source binding·분기·실행 정책만 얇은 APMath 계층으로 구현하고, 수학 연산을 자체 확장하는 방향은 채택하지 않는다. 계산 결과는 기존 APMath publication 엔진으로 내려 보낸다. 글꼴·수식 확정, 실측, 배치, SVG, 독립 감사, 실제 Archive desktop 렌더, 영향 범위 재생성을 하나의 요청에서 실행한다.

기존 APMath numeric geometry는 legacy compatibility, model→screen adapter, 기존 관계 검증과 final primitive audit에 보존한다. **신규 construction 계산의 주 역할은 SymPy로 대체하고**, 기존 kernel에 없는 작도 공식을 계속 추가하지 않는다. JSXGraph는 실제 비교했으나 이번 기본 runtime에는 넣지 않는다. 현재 `constructionSteps`는 graph가 아니므로 실행 계약은 신규로 필요하지만, 그것이 자체 geometry kernel을 새로 만드는 근거는 아니다. 선정 근거·배포 조건·실행 실험의 한계는 4절에 기록한다.

이 문서에서 GeoGebra-grade는 특정 제품의 모든 기능과 동등하다는 인증이 아니다. 다음의 검증 가능한 품질 기준이다.

1. 수선의 발·교점·중점·접점 등이 원시 좌표 복사가 아니라 typed construction과 입력 의존성으로 정의된다.
2. 허용된 자유 입력이 바뀌면 종속 객체가 재계산되고 같은 관계가 보존된다.
3. 교점 0/1/2개, 접함, 일치, 퇴화, 수치 불안정, 잘못된 분기 선택을 구분한다.
4. publication을 위한 이동·확대·라벨 배치가 model 좌표와 수학 관계를 바꾸지 않는다.
5. 결과 primitive를 독립적으로 관측하여 원래 구성 및 source 조건과 비교한다.
6. 최종 SVG 자체가 글꼴·수식 표현을 안정적으로 전달하고 실제 Archive에서 검수 가능하다.

정적 생성 시점의 graph 재계산을 구현한다. 드래그 UI, GeoGebra 파일 호환, 범용 CAS, 임의 연립 제약 자동 풀이, 모든 문항의 자동 증명은 이번 구현의 필수 기능으로 삼지 않는다. 지원 연산 밖의 문제를 임의 좌표로 성공시키지 않는다.

**완료를 구분한다.** `READY_FOR_INDEPENDENT_REVIEW`는 자동 검사와 실제 화면이 준비된 상태다. `QUALIFICATION_COMPLETE`는 명시적 qualification 요청의 해당 필수축/독립 review 완료이며 공개 준비 권한은 없다. `PUBLICATION_READY`는 유효한 engine Seal/ACTIVE와 같은 bytes에 대한 요청별 Actual Archive·독립 review까지 닫힌 ordinary candidate 상태다. 어느 상태도 production JS/SVG 쓰기나 main 승격 권한을 부여하지 않는다.

## 2. 직접 확인한 자료와 조사 방법

- [Notion v0.1 원문](https://app.notion.com/p/3f00e68bd69f81cd8753ed06e8ddf105): 직접 검색 후 fetch. 반환된 마지막 편집 시각은 `2026-10-05T04:12:30.249Z`. 전체 content의 끝까지 확인했다. truncation/unknown-block 필드는 반환되지 않아 그 수치를 0이라고 단정하지 않는다.
- `git fetch origin main` 후 위 SHA를 고정하고 `git show origin/main:<path>`, `git grep`, `git ls-tree`로 읽었다. 작업 폴더의 낡은 파일을 main 구현으로 취급하지 않았다.
- 최초 조사 main은 `bae7e4b6b50b6967c497c79f50c0f401d5f3c54b`였고, 저장 직전 fetch에서 `b08ba2db04ba3be4d172b718aee29e169f8655d3`으로 갱신되었다. 추가 변경은 non-stop worker escalation 운영 문서 2개이며 geometry/publication/render 코드는 동일함을 diff로 확인했다. v0.1 기준 `4572a0873e052a2554b269dccebf84643886e620` 이후에는 초안 Markdown과 위 운영 문서만 변경되었으므로 아래 구현 공백을 새 제품 변경 탓으로 해석하지 않는다.
- 최신 main의 Visual skill, 공통 실행 계약, 적응형 배치 계약, `AGENT_BUDGET.md`, visual canonical, geometry/publication/Archive/pipeline-core 코드를 확인했다.
- 기존 작업 폴더의 `apmath/js/classroom.js`, `apmath/js/textbook.js`, `apmath/worker-backup/worker/routes/class-daily.js`, `apmath/worker-backup/worker/schema.sql` 수정과 기존 untracked 항목을 보존했다.
- 이번 작업은 계획 조사다. 전체 회귀·실제 Archive 브라우저·학생 문항 독립 검토를 실행하지 않았다. 과거 문서의 PASS 숫자를 이번 통합의 검증으로 재사용하지 않는다.

### 2.1 재현한 construction 공백

main의 `tests/test_publication.py::constructed_evidence()`를 메모리에서 추출하고 main의 coordinate validator를 직접 실행했다. 정상 fixture가 수용됨을 확인한 뒤 모든 step의 operation을 `UNIMPLEMENTED_OPERATION`, inputs를 `[UNKNOWN_NODE, 자기 output]`으로 바꿨다. 좌표와 조건 잔차는 그대로 두었다.

```text
baseline: ACCEPTED
unknown operation + unknown input + self-cycle: ACCEPTED (graph execution absent)
independent coordinate sub-audit: COORDINATE_EVIDENCE
```

파일을 변경하지 않은 진단이다. **좌표 잔차 검증이 틀렸다는 뜻은 아니다.** 현 계약이 step의 문법·point coverage만 검사하고 연산의 실행 가능성·참조 유효성·DAG 여부는 검증하지 않는다는 증거다. 전체 SVG audit의 PASS를 주장하는 실험도 아니다.

## 3. 현재 구조와 기능 분류

아래 경로 중 `GE/`는 `archive/tools/geometry-equation/`, `VE/`는 그 아래 `visual_engine/`, `PC/`는 `archive/tools/pipeline-core/`를 뜻한다. 신규 제안 경로는 10절에서 별도로 표시한다.

| 영역 | 실제 구현과 근거 | 분류 및 결론 |
|---|---|---|
| 기하 수치 연산 | `VE/geometry_model.py`: 정규화 Line/Circle, 두 점 직선, 직선 교점, 수선의 발, 중점, 내·외분, 직선-원/원-원 교점, 접선 판정 | **구현됨. 역할별 재사용.** legacy/adapter/audit는 보존, 신규 construction 계산은 SymPy로 대체. |
| semantic validation | `VE/semantic_model.py::validate`: POINT.at, LINE.coefficients, CIRCLE.center/radius, SEGMENT.from/to를 먼저 받고 관계 검사 | **구현됨. 범위 제한.** INTERSECTION은 target 점을 생성하지 않고 주어진 target 좌표와 비교한다. |
| construction graph | 동일 모듈에 typed operation registry/topological evaluation/descendant invalidation 없음 | **신규 연결 공백.** SymPy operation adapter + 표준 topological scheduling + source/branch 정책이 필요하다. 작도 수학 자체는 OSS에 위임. |
| 좌표 provenance | `VE/coordinate_evidence.py`: SOURCE_COORDINATES/CONSTRUCTED_REALIZATION, normalization, point coverage, residual, degeneracy 검사 | **구현됨. 재사용·확장.** 선언된 조건 검증이며 source 조건의 완전성이나 step 실행을 증명하지 않는다. |
| 조건 vocabulary | DISTANCE/PERPENDICULAR/PARALLEL/COLLINEAR/MIDPOINT/EQUAL_DISTANCE | **구현됨. 제한적.** incidence, circle membership, tangency, ratio, branch guard는 graph 지원에 맞춰 추가해야 한다. |
| publication annotation | `VE/publication.py`: point identity, angle wedge/arc/square, adjacent/dimension length, polygon region/leader, 동일 기본 label 크기 | **구현됨. 최대한 재사용.** 축 없는 Euclidean geometry만 허용하고 function graph를 거부한다. |
| 스타일 설정 | `VE/style_tokens.json`, `style_tokens.py::load`; `engine.prepare`와 `svg_composer.compose`가 각각 load | **구현됨 + 연결 공백.** 한 번 resolve한 동일 profile을 전달해야 한다. publication font override와 scattered constant 정리가 필요하다. |
| 수학 AST | `VE/math_expression.py`: parse/evaluate/exact rational/TeX·plain·SVG serializer | **구현됨. 재사용.** slash fraction, 문자 근호, super/sub tspan은 전문 조판 완료가 아니다. |
| 수식·감사기 호환 | serializer는 `baseline-shift="sub"`를 만들지만 `audit_publication.py::_visible_tree`는 빈값/super만 허용 | **실제 계약 불일치.** 아래첨자까지 현 publication 경로가 완결됐다고 말할 수 없다. |
| 측정 입력 배치 | `VE/label_layout.py::layout(..., measurements)` | **구현됨 + 연결 공백.** 값은 `[width,height]`; 없으면 근사. baseline은 일반 label에서 높이×0.8, panel fallback은 별도 근사. 실측 basis도 반환값에서 구분하지 않는다. |
| build | `VE/engine.py::prepare`, `build(spec,measurements=None)` | **구현됨. 재사용.** 측정 전 label inventory를 얻을 기반이 이미 있다. CLI의 `--measurements`도 존재한다. |
| 기존 candidate route | `past-exam-pipeline/build-visual-candidate.mjs` → `past_exam_adapter.build_candidate` → `entrypoints.build_independent` → `build(spec)` | **연결해야 함.** 위 경로에는 measurements를 전달하는 인자가 없다. facts→candidate에서 끝난다. |
| UID | adapter는 `[A-Za-z0-9_-]{1,80}`만 허용; `PC/question-uid.mjs`는 stable UID v2와 legacy 매핑 지원 | **연결해야 함.** canonical UID를 파일명으로 직접 사용하지 않고 digest 기반 assetId를 분리한다. |
| 배치 실패 수리 | `label_layout`은 LEADER_LINE/VIEWPORT_EXPANSION/PANEL_SPLIT 제안; unresolved label은 output에서 빠짐 | **신규 실행 공백.** 실제 재생성 제어와 전체 label inventory completeness가 필요하다. |
| viewport | `VE/viewport.py`: equal-unit projection, critical geometry 포함 확장 | **구현됨. 재사용·보강.** 최종 실측 label extents에 맞춘 framing 최적화는 없다. |
| 독립 geometry audit | `GE/audit_publication.py`: 표준 라이브러리만 import, final XML 관측, source/solution/review/coordinate/SVG SHA, owner·arc·polygon 검사 | **구현됨. 독립성 보존.** generator helper를 import하도록 합치지 않는다. |
| browser bbox/collision | `GE/verify-rendered-layout.mjs`: actual getBBox/client rect/CTM, stroke 폭, clipping, label overlap, 11px gate | **구현됨. 재사용·보강.** text만 수집하고 실제 glyph font identity는 family stack·ready·간단한 missing glyph heuristic만으로 보장되지 않는다. |
| actual Archive | `GE/record-visual-browser-evidence.mjs`: candidate source override, ready/image decode, image response SHA, actual screenshot, actual-size replay | **구현됨. 재사용.** replay는 `<img>` 내부 DOM 직접 관측이 아니다. |
| desktop 기준 통일 | `tests/run-publication-archive.mjs`는 direct mode=sol/1440×1000; `build-visual-render-matrix.mjs:38`는 preview=1+desktop/mobile; `PC/render.mjs:160`는 fit=screen | **실제 연결 충돌.** 단순 호출만 연결하면 현 publication 기준이 유지되지 않는다. |
| runtime 결박 | geometry collector는 engine/source/assets를 사전 결박하고 response를 기록. `PC/runtime.mjs`는 runtime dependency bundle/validation 제공 | **연결해야 함.** collector에 전체 runtime closure·screenshot SHA·item witness 연결이 필요하다. |
| 부분 재검 | `PC/render-impact.mjs`: item signature/전역 invalidator/검증된 root review reuse | **구현됨. adapter 필요.** geometry collector의 현 rows는 바로 이 schema가 아니다. |
| repair 명칭 | `PC/visual-repair.mjs`는 기존 problem asset refs를 provider input에 결박 | **SVG 수리 엔진 아님.** 이름만 보고 자동 layout repair로 재사용하면 안 된다. |
| visual 필요성 | `PC/solution-visual-benefit.mjs`: 구조화된 필요성/benefit 계약 검사 | **구현됨. 부분 재사용.** source를 읽고 필요성을 판단하는 autonomous planner는 아니다. current marginal-benefit 규칙과 매핑해야 한다. |
| 최종 closure | PC render review/immutable evidence/provider bridge/work-batch audit | **구현됨. 선택적 연결.** 모든 문항 생산을 새 job/새 provider audit으로 중복 포장하지 않는다. 부모 시스템 계약에 필요한 경우 사용한다. |

### 3.1 문서만 있는 항목과 v0.1 정정

v0.1에 제시된 다섯 파일명 `assess_visual_need.py`, `preflight_svg_style.py`, `geometry_publication_profile.py`, `degrade_simulation.py`, `visual_qa_report.py`는 최신 main의 tracked tree에 없다. 더 나아가 **최신 main skill에도 이 다섯 CLI 참조는 없다.** main 검색에서 이 이름들은 초안 문서에만 등장했다. 따라서 “current skill의 누락 scripts 복구”를 선행 필수 작업으로 잡은 v0.1 전제는 폐기한다.

현재 워크스페이스의 skill/worktree 및 사용자 skill 경로에 대한 파일명 탐색에서도 발견하지 못했다. 모든 다른 branch·삭제 이력·외부 저장소까지 부재를 증명한 것은 아니다. 향후 정확한 source가 제공되면 기능·SHA·테스트를 대조하되, 찾을 때까지 작업을 미루거나 이름대로 5개 프로그램을 새로 만들지 않는다.

| 문서의 프로그램 역할 | 실제 대체/신규 범위 |
|---|---|
| visual need | 기존 benefit validator + 새 source/planning 연결 |
| SVG style preflight | 기존 style tokens, structural verifier, publication audit를 profile별로 조합 |
| geometry publication profile | 실제 `publication.py` + resolved profile로 통합 |
| degrade simulation | 재사용 가능한 명시 프로그램은 미확인. 최종 capture에서 흑백/축소 보조 preview를 만드는 작은 기능 신규 추가 |
| visual QA report | runner result reducer 신규 구현. 기존 machine/review 증거를 링크하며 PASS를 발명하지 않음 |

v0.1의 글꼴 설명도 수정한다. main 실제 값은 text `Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif`, math `STIX Two Math, Cambria Math, Times New Roman, serif`다. **stack 존재와 실제 font file 고정은 다르다.**

### 3.2 중복과 보존해야 할 독립 구현

- `prepare`와 `compose`의 style 재로드, 각 모듈의 margin/font/annotation 상수는 resolved profile로 단일화한다. 기존 legacy default 결과는 compatibility test로 보존한다.
- synthetic Archive harness와 real-exam collector의 ready/response/capture 로직은 공통 collector를 사용하도록 정리한다. fixture bank 작성은 테스트에 남긴다.
- builder 좌표 검증과 auditor 좌표 검증의 수학 계산 중복은 **독립 관측을 위한 의도적 중복**이다. 공통 validator 하나로 합치지 않는다.
- static structural lint, semantic geometry audit, browser collision, 사람/독립 reviewer의 readability는 서로 다른 축이다. 전부 하나의 `PASS` 함수로 대체하지 않는다.
- historical repair 스크립트는 재현 자료로 보존하되 신규 runtime의 후처리 단계로 편입하지 않는다.

## 4. 오픈소스 kernel 비교와 최종 선정

### 4.1 실제 소스·배포물을 확인한 범위

2026-10-05에 공식 GitHub API로 다음 revision을 고정하여 source/test/license를 직접 읽었다. npm/PyPI registry에서도 배포 버전과 의존성을 조회했다. upstream HEAD와 release가 같은 코드라고 가정하지 않는다.

| 후보 | 조사한 source revision | runtime 확인한 배포물 |
|---|---|---|
| JSXGraph | `7f0a05654c66f6b5e479b1e2969d47908ea4c91d` | npm `jsxgraph@1.13.3`, `distrib/jsxgraphcore.js`; tarball sha512 integrity 대조 |
| CindyJS | `a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754` | npm `cindyjs@0.0.5`, `build/js/Cindy.js`; tarball sha512 integrity 대조 |
| SymPy | `319ea7a6186edf88bc23d502917242b10314ae51` | PyPI `sympy==1.14.0`, `mpmath==1.3.0`; pure-Python wheel을 임시 경로에만 설치 |

배포 bundle SHA256: JSXGraph `4e196b10dc77e22ec0eda897e0271636edf8dadd91d76cc2cf2e136c61c35537`, CindyJS `7f022f77a3fb702c2f00ec96339e8bd6c609d583d717be455a7795c3493f2fc4`. 구현에서는 이 조사 버전을 무조건 latest로 업데이트하지 않고 qualified artifact의 version+hash를 잠근다. SymPy/mpmath wheel hash lock도 구현 단계의 dependency manifest에 반드시 추가한다.

모든 다운로드와 실행은 `%TEMP%/apmath-kernel-plan-20261005/`에서 이루어졌다. 저장소 package.json/lockfile/requirements와 제품 코드는 바꾸지 않았다. 이 실험은 후보 비교용이며 APMath production adapter 구현이 아니다.

### 4.2 construction·runtime·라이선스 비교

| 기준 | JSXGraph | CindyJS | SymPy Geometry |
|---|---|---|---|
| 실제 construction 구현 | `src/element/composition.js`에 midpoint/perpendicular/parallel/bisector/circumcircle/reflection 등. element의 child/ancestor/descendant와 board update가 있음 | `GeoOps.js`의 typed signature와 Join/Meet/Mid/Perp/Para/CircleMP/CircleMr/IntersectLC/IntersectCirCir/SelectP. GeoBasics의 dependency tree, Tracing의 상태 갱신 | `geometry/line.py`, `ellipse.py`, `point.py`, `polygon.py`의 intersection/projection/perpendicular/bisectors/circle/tangent/transform. 객체 연산은 갖추지만 reactive DAG는 아님 |
| 수치 특성 | JS numeric 중심. construction update 강점. exact algebraic proof로 취급할 수 없음 | complex/projective representation과 branch tracing. finite real Euclidean publication에는 명시적 변환·필터 필요 | Rational·radical·symbolic 결과와 evalf 활용. exact 입력을 끝까지 유지 가능. undecidable/unsupported/시간 초과는 별도 처리 |
| headless 현실 | NoRenderer/Node 분기가 존재. 다만 조사 배포물의 `initBoard(null,{renderer:'no',...})` 호출은 ownerDocument 오류로 실패 | 공식 테스트가 `isNode:true`와 build bundle을 사용. 조사 배포물에서 브라우저 없이 construction/update 실행 성공 | Python subprocess에서 브라우저 없이 exact construction 성공. 현재 APMath Python boundary에 가장 직접적 |
| 배포 부담 | npm 1.13.3은 Node>=20.19.0, src exports와 distrib main이 다르고 self-dependency `jsxgraph:^1.12.0`가 있음. blind npm dependency 추가보다 qualified bundle/subset 사용 검토 필요 | source package version 0.0.1과 npm 0.0.5가 다름. npm dependencies의 TypeScript는 이번 prebuilt core require에는 필요하지 않았음. source build와 실행 artifact를 구분해야 함 | 1.14.0은 Python>=3.9, mpmath>=1.1,<1.4. production job의 Python에 pinned wheel/venv를 사용. 학생 browser에는 실리지 않음 |
| 출판 연결 | SVG renderer가 있으나 APMath owner/조판/Archive audit를 자동 충족하지 않음 | geometry와 Canvas/CindyScript 환경을 publication 정본으로 직접 쓰지 않음 | SVG publication renderer가 아니므로 현재 APMath composer에 snapshot 전달 |
| 라이선스 선택 | 공식 package: MIT OR LGPL-3.0-or-later. 이번 사용은 MIT 선택, 저작권/허가문 보존 | Apache-2.0. license/해당 NOTICE·저작권을 보존하고 수정 배포 시 변경 표시. 포함 plugin/third-party는 별도 확인 | BSD 계열(주 라이선스 3-clause), LICENSE 내 별도 귀속 포함. binary/source 재배포 고지와 mpmath 고지를 함께 보존 |
| 이번 역할 | 채택 보류. 향후 browser interactive frontend 또는 별도 holdout 비교에 적합 | **독립 numeric cross-validator 채택**. 주 결과를 복사하지 않고 동일 source graph input에서 재구성 | **주 static construction kernel 채택**. source exactness와 Python integration을 우선 |

라이선스 판단은 직접 읽은 각 프로젝트의 LICENSE/package 선언에 근거한다. 선택된 배포물의 transitive/plugin 고지까지 일괄 면제된다고 해석하지 않는다. 원문: [JSXGraph MIT](https://github.com/jsxgraph/jsxgraph/blob/7f0a05654c66f6b5e479b1e2969d47908ea4c91d/LICENSE.MIT), [CindyJS Apache-2.0](https://github.com/CindyJS/CindyJS/blob/a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754/LICENSE), [SymPy LICENSE](https://github.com/sympy/sympy/blob/319ea7a6186edf88bc23d502917242b10314ae51/LICENSE).

코드 근거: [JSXGraph composition](https://github.com/jsxgraph/jsxgraph/blob/7f0a05654c66f6b5e479b1e2969d47908ea4c91d/src/element/composition.js), [dependency implementation](https://github.com/jsxgraph/jsxgraph/blob/7f0a05654c66f6b5e479b1e2969d47908ea4c91d/src/base/element.js), [NoRenderer](https://github.com/jsxgraph/jsxgraph/blob/7f0a05654c66f6b5e479b1e2969d47908ea4c91d/src/renderer/no.js); [CindyJS GeoOps](https://github.com/CindyJS/CindyJS/blob/a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754/src/js/libgeo/GeoOps.js), [GeoBasics](https://github.com/CindyJS/CindyJS/blob/a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754/src/js/libgeo/GeoBasics.js), [Tracing](https://github.com/CindyJS/CindyJS/blob/a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754/src/js/libgeo/Tracing.js), [headless tests](https://github.com/CindyJS/CindyJS/blob/a7dbbbaaa16c7d8c0aca04181ddf0f8f1744b754/tests/GeoOps_tests.js); [SymPy line](https://github.com/sympy/sympy/blob/319ea7a6186edf88bc23d502917242b10314ae51/sympy/geometry/line.py), [ellipse/circle](https://github.com/sympy/sympy/blob/319ea7a6186edf88bc23d502917242b10314ae51/sympy/geometry/ellipse.py), [line tests](https://github.com/sympy/sympy/blob/319ea7a6186edf88bc23d502917242b10314ae51/sympy/geometry/tests/test_line.py).

### 4.3 실제 runtime probe 결과

Windows, Node `v22.22.2`에서 다음 최소 호출을 했다. 이 표는 전체 호환성/성능 benchmark가 아니다.

| 실행 | 관측 결과 | 판단 |
|---|---|---|
| JSXGraph 1.13.3, no renderer, null container | `Cannot read properties of null (reading 'ownerDocument')`; `Board.setAttribute`→`initBoard`에서 발생. source에 containerObj.ownerDocument 참조 확인 | NoRenderer 존재만으로 현재 무DOM 실행이 정상이라고 단정 불가. browser/DOM adapter 또는 다른 qualified 버전의 추가 실험 필요. JSXGraph 전체가 headless 불가하다는 결론은 아님 |
| CindyJS 0.0.5, isNode:true | A=(0,0), B=(6,0)의 Mid=(3,0); B=(8,0) 갱신 후 Mid=(4,0) | 실제 종속 객체 재계산 확인 |
| CindyJS, Join+Perp+Meet | C=(2,4)의 x축 수선 발=(2,0); C=(3,7) 이후=(3,0) | 주어진 final coordinates를 복사하지 않고 구성 관계 재계산 확인 |
| CindyJS, CircleMr+IntersectLC+SelectP | 원 (0,0), r=5와 x축 교점이 약 (+5,0), (-5,0), imag=0 | finite-real 변환 및 unordered pair 비교가 필요함 확인 |
| SymPy 1.14.0 | midpoint=(3,0), projection=(2,0), x축 교점 ±5, y=1 교점 `(±2*sqrt(6),1)`, 외부점 (10,0)의 tangent 2개 | exact construction과 단순 symbolic label 원천 확인. 이 호출 묶음은 약 209ms였으나 단발 측정이며 SLA 근거 아님 |

### 4.4 최종 선택과 대안 배제 이유

**SymPy Geometry + 얇은 선언형 DAG + 기존 APMath publication**이 현재의 정적·exact-label·Python 기반 환경에서 자체 수학 구현을 가장 적게 늘린다. reactive UI가 필요 없으므로 SymPy에 없는 DAG는 Python 표준 `graphlib.TopologicalSorter`와 node hash/reverse dependency index로 감싼다. 새 교점·접선·원·반사 수학 공식을 직접 개발하지 않는다.

CindyJS는 심볼릭 출력의 주 정본으로는 부적합하지만 다른 수학 구현·언어·표현을 사용해 독립 cross-check에 적합하고, 이번 headless 실험도 성공했다. 임의 JS/CindyScript를 사용자 입력으로 실행하지 않고 validated graph op만 allowlisted adapter로 변환한다. complex/projective 결과를 실수 두 좌표로 잘라 버리지 않는다. 허용오차를 넘는 imag, z≈0, 중복 root, unknown state는 FAIL/UNSTABLE로 분류한다.

JSXGraph를 배제한 주 이유는 특정 probe 하나의 오류가 아니다. **정적 exact construction에 필요한 기능은 SymPy로 충족되고 독립 headless peer도 CindyJS로 가능하므로, 세 번째 geometry runtime과 DOM 호환 작업을 추가할 이득이 작다.** 향후 interactive 요구가 생기면 JSXGraph는 별도 선택 가치가 있다. 일반 최신 패키지 설치로 본 엔진에 몰래 끼워 넣지 않는다.

세 kernel을 투표시켜 다수결 PASS를 만들지 않는다. SymPy와 독립 검산이 불일치하면 정확한 node/condition을 실패로 남긴다. 범용 symbolic simplify/solve를 무제한 호출하지 않으며 per-node timeout/complexity limit을 둔다. unsupported/undecidable을 기존 자체 float 계산으로 조용히 대체하지 않는다.

선택은 계획상의 확정안이며 **지원 op 전체 qualification은 구현 단계의 gate**다. CindyJS가 특정 연산을 지원하지 않는다면 검증된 기존 독립 관계 observer로 해당 조건을 닫을 수 있는지 capability에 명시한다. 어느 observer도 닫지 못하면 그 op는 READY 자격을 얻지 못한다. geometry 수학 자체를 급히 새로 만드는 자동 fallback은 없다.

### 4.5 목표 구조: 수학 구성과 출판을 분리하고 단일 runner로 연결

```text
문항 1회 지정 (stable identity + surface + optional parent context)
  ↓ resolve exact source/verified solution/기존 frozen plan
  ↓ source condition inventory + 독립적으로 확정된 의미/구성 계획
ConstructionGraph (수학 정본: typed nodes, inputs, constraints, branches)
  ↓ 표준 DAG scheduling → SymPy Geometry evaluate → condition/degeneracy checks
  ↘ frozen input의 독립 CindyJS 재구성 → branch/finite-real/관계 대조
ConstructionSnapshot (model coordinates + exact expressions + provenance)
  ↓ 기존 visualSpec/publication adapter
ResolvedProfile + LabelInventory
  ↓ 고정 font + 수식 typeset → 완성된 label fragment 실제 측정
MeasuredLabels → owner-aware layout → framing → final SVG compose
  ↓ 독립 construction audit + final primitive/label audit
  ↓ isolated measured-layout check
  ↓ 실제 Archive desktop mode=sol / 1440×1000 / no fit
  ↓ 독립 visual review 및 evidence binding
Result + final SVG + Archive preview + 남은 결함
  ↖ bounded repair: 영향 받은 construction/label/layout/render만 재실행
```

Python은 SymPy adapter, graph policy, 기존 layout/composer를 소유한다. Node는 request resolution, 독립 CindyJS adapter, 실행 순서, 고정된 수식 조판기, browser, cache, evidence/review 연결을 소유한다. OSS kernel의 기본 renderer를 최종 SVG로 쓰지 않고 APMath publication을 재사용한다. browser가 수학 관계의 정본이 되지 않는다.

## 5. Construction graph 계약과 지원 연산

### 5.1 데이터 계약

`ConstructionGraph v1`은 `graphId`, `schemaVersion`, source/solution refs, `parameters`, `nodes`, `constraints`, `sourceConditionCoverage`, `displayBindings`를 갖는다. node 최소 필드는 `id`, `op`, `inputs`, `args`, `outputType`, `sourceRefs`, `factRole`이며 다해 연산에는 `branch`가 필수다. 각 연산의 입력 타입·개수·출력 타입·퇴화 조건은 닫힌 registry로 고정한다.

좌표는 세 종류를 구분한다.

- SOURCE_INPUT: 원문이 명시한 좌표/값. 원문 변경 없이 편집 불가.
- FREE_PARAMETER: source가 허용하는 자유도. 정의역·선택 이유·불변 조건을 먼저 고정한다.
- DERIVED: 연산 결과. 외부 `at` 값으로 덮어쓸 수 없다.

정규화는 translation/rotation 등 문제 의미를 보존하는 선택만 허용한다. 길이가 주어졌으면 임의 unit scale로 길이를 바꾸지 않는다. normalized model 좌표와 원래 단위의 변환을 명시한다. `GIVEN / DERIVED_INTERMEDIATE / CONCLUSION` 및 source 이름을 node/annotation까지 이어 간다.

`ConstructionSnapshot`에는 node별 resolved inputs, 값, exact expression 또는 numeric approximation 표시, branch identity, 연산 버전, residual/tolerance, 상태, dependency hash를 기록한다. 이 snapshot은 builder 증거이며 독립 기대값 그 자체가 아니다.

### 5.2 첫 정식 지원 범위

| 연산군 | v1 지원 연산 | 구현 방식 |
|---|---|---|
| 입력 | source/free point, scalar, exact scalar expression | 기존 validated AST→SymPy Rational/허용 expression. 자유 문자열 sympify/eval 금지 |
| 기본 | 두 점 직선, 두 점 선분, 중심+반지름 원, 중심+통과점 원 | SymPy Point/Line/Segment/Circle. CindyJS Free/Join/Segment/CircleMr/CircleMP 대응 |
| 종속 점 | midpoint, internal/external division, perpendicular foot | SymPy Segment.midpoint/Point affine expression/Line.projection. CindyJS Mid/기본 구성 macro/Perp+Meet 대응 |
| 선 | 점을 지나는 parallel/perpendicular, angle bisector(내/외 명시) | SymPy parallel_line/perpendicular_line/bisectors, CindyJS Para/Perp/AngleBisector |
| 교점 | line-line, line-circle, circle-circle | SymPy intersection, CindyJS Meet/IntersectLC/IntersectCirCir. APMath는 branch contract와 집합 매칭만 담당 |
| 원·접선 | noncollinear 3-point circle, 원 위 점의 tangent, 외부 점의 tangent contact pair | SymPy Circle(3 points)/tangent_lines, CindyJS CircleBy3 및 PolarOfPoint+IntersectLC 등 검증된 기본 연산 macro |
| 정적 변환 | translation, line reflection, rotation, 지정 중심 dilation | SymPy GeometryEntity/Point 변환, CindyJS 대응 transformation op 또는 기본 작도 macro. op별 지원 qualification 필요 |
| 검증 | incidence, distance, equal distance, midpoint/ratio, perpendicular/parallel, circle membership, tangency, angle/orientation | 독립 CindyJS 재구성과 기존 primitive residual observer. source 조건 coverage는 APMath 정책 |

이 표의 연산은 renderer·graph evaluator·독립 auditor·회귀가 함께 지원될 때만 registry capability를 ACTIVE로 표시한다. 일부만 구현된 상태를 “GeoGebra-grade 완료”로 보고하지 않는다. 함수 sampling/도함수 tangent의 기존 경로는 유지하되 축·그래프 publication 자격은 별도 capability다. conic/3D/curved-hole region/일반 constraint solve는 후속 범위다.

### 5.3 실행·분기·퇴화

- registry 검증 → 참조와 타입 확인 → 표준 graphlib의 cycle/topological 처리 → SymPy 연산 → 선언 조건과 source coverage 확인 순서다. unknown op/input, self-cycle, 중복 output는 계산 전 거부한다. 자체 수치 kernel 또는 범용 symbolic solver를 만들지 않는다.
- 교점 결과는 EMPTY / UNIQUE / TWO / COINCIDENT / UNSTABLE처럼 구분한다. 정렬된 배열 첫 원소를 몰래 택하지 않는다.
- branch는 oriented line의 어느 쪽인지, 양의 방향, 주어진 구간 등 의미 guard로 명시한다. 재계산 후 guard가 깨지면 재선택을 숨기지 않고 branch failure를 반환한다.
- tolerance는 연산별 dimension과 scale에 맞춰 고정하고 사용자가 크게 늘려 PASS하지 못하게 한다. 기존 Fraction 입력을 손실 없이 SymPy Rational로 변환하고 exact expression을 보존한다. 근호 등의 symbolic 표현과 화면용 numeric approximation을 분리한다. 현재 APMath 고정 EPS와 adapter의 scale policy 차이도 회귀로 확인한다.
- near-parallel/near-tangent 조건에서 SymPy exact 판정 또는 bounded evalf precision escalation을 사용한다. CindyJS numeric 결과가 안정성을 확보하지 못하면 `UNSTABLE/NOT_VERIFIED`이며 오차 범위를 넓혀 PASS하지 않는다. float 결과를 exact proof로 쓰지 않는다.
- 입력 변경 시 descendant closure만 재계산한다. node cache key는 op/version, canonical args, 부모 값/branch hash, numeric policy를 포함한다.
- 기존 coordinateEvidence v1은 legacy 검증용으로 보존한다. 신규 graph 증거는 version을 올리고 연산 실행 transcript를 결박한다. v1의 자유 문자열 ledger를 이름만 바꿔 graph로 승격하지 않는다.

### 5.4 Graph와 publication 사이의 불변 경계

publication은 snapshot을 읽어 기존 spec의 POINT/LINE/CIRCLE/SEGMENT를 materialize한다. 원래 nodeId를 source binding으로 남긴다. 라벨은 point/segment/angle/region node에 owner로 연결한다.

collision repair는 label offset, annotation cue, composition, equal-unit frame만 바꾼다. derived point를 직접 이동시키거나 free parameter를 자동 조정해 그림을 보기 좋게 만들지 않는다. 허용된 parameter 재선정이 정말 필요하면 새 construction revision으로 다루고 수학 audit를 다시 한다.

## 6. 글꼴·수식·실측 전략

### 6.1 선택한 구현 방향

모든 문자를 시스템 font stack에 맡기는 방식을 최종 경로로 쓰지 않는다. **수학 label은 고정된 MathJax SVG 조판 결과, 일반 한글은 고정한 Korean font의 self-contained 전달**을 기본안으로 채택한다. 기존 AST는 수학 의미 정본이고, TeX serializer 출력은 허용된 AST에서만 생성한다.

현재 Archive는 MathJax CHTML 자산을 사용한다. 조사한 tree에서 별도 SVG output component는 확인되지 않았다. 따라서 MathJax SVG 경로는 **이미 구현된 재사용 기능이 아니라 기존 생태계를 재사용하는 신규 adapter/배포 자산**으로 계산한다. Archive 본문의 CHTML 엔진은 교체하지 않는다.

공식 MathJax 문서는 SVG 출력이 glyph path를 사용하고 expression-local cache로 self-contained 구성이 가능함을 설명한다. 이 계획은 local cache 또는 cache 없는 label fragment를 고정하고 외부/global glyph 참조를 금지한다. [SVG 출력](https://docs.mathjax.org/en/latest/output/svg.html), [SVG 옵션](https://docs.mathjax.org/en/v4.0/options/output/svg.html)

일반 한글 font는 기존 우선순위인 Noto 계열에서 버전·bytes·glyph coverage를 고정하는 것을 우선한다. self-contained subset embedding을 1차 경로로 검증하고, 실제 `<img>`와 replay에서 동등성이 확보되지 않으면 동일 고정 font의 outline 경로로 전환한다. 이는 구현 단계의 명확한 실험 gate이며 임의 fallback 허용이 아니다. 정확한 배포 파일·라이선스·subset 이름·hash를 함께 고정한다. [Noto CJK 공식 배포](https://github.com/notofonts/noto-cjk), [font 라이선스 원문](https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE)

최종 승인 전에 아직 검증하지 않은 embedding/outline 조합을 완료로 선언하지 않는다. 두 경로를 모두 상시 유지하는 다중 backend 프로젝트로 확대하지 않고, 단계 2 실험으로 실제 통과한 하나를 정식 경로로 확정한다.

### 6.2 새 label 계약

`LabelInventory`는 `engine.prepare`의 모든 label을 layout 전에 얻는다. 배치 실패로 SVG에 나오지 않은 label도 포함한다. title/한글 설명/단위/prime/각도기호도 빠뜨리지 않는다.

label별로 semantic AST/text, source identity, owner, factRole, required 여부, font role, fragment SHA, profile SHA를 보존한다. 측정값은 width/height 외에 `inkBounds(x,y,w,h)`, `advance`, `baseline`, ascent/descent 또는 동등한 기준선 정보, SVG user-space 단위, 측정 context/browser/font/renderer hash를 갖는다. CSS pixel을 SVG user-space 숫자로 그대로 넣지 않는다.

수식의 baseline은 조판기의 baseline 정보를 fragment 변환과 함께 보존하고 browser ink bounds로 확인한다. `getBBox()` 하나를 typographic advance/ascent와 동일시하지 않는다. 일반 text는 고정된 FontFace와 baseline/Canvas metrics 또는 동등한 실측을 결합한다.

최종 출력에 쓰는 **동일 fragment**를 측정한다. 근사 문자열을 재서 MathJax path를 배치하는 이중 표현을 금지한다. 측정 결과 누락/다른 hash/다른 profile이면 production layout은 FAIL 또는 NOT_RUN이며 근사 fallback으로 ready를 만들지 않는다. legacy build는 기존 근사 경로를 그대로 유지할 수 있다.

### 6.3 새 표현의 audit

`audit_publication.py`의 기존 allowlist는 path/defs/use/transform/style을 넓게 허용하지 않는다. 새로운 `geometry-publication-v2`에서 **math label subtree만** 닫힌 표현 계약으로 허용한다. 도형 레이어에는 기존의 보수적인 관측을 유지한다.

- math path는 독립된 review AST를 고정된 조판기로 별도 생성한 reference와 비교한다. builder가 전달한 semantic metadata/hash만으로 glyph가 맞다고 판정하지 않는다.
- 허용된 local use 참조는 전부 resolve하고 path/transform/분수선/근호선을 관측한다. 누락 glyph, 다른 path, 다른 exponent scope, owner 변조, subtree 밖 occlusion을 검출한다.
- 공유하는 MathJax 라이브러리는 trusted typesetter dependency임을 명시한다. 이것은 수학 독립 풀이가 아니다. mathematical correctness는 source 조건·construction audit가 담당한다.
- browser observer는 `<text>`뿐 아니라 하나의 label group 전체 painted bounds를 수집한다. math path를 도형의 curve 장애물로 중복 계산하지 않는다.
- 기본 label font의 CSS scale과 실제 glyph/ink 가독성을 함께 기록한다. exponent glyph까지 일률 11px로 요구하지 않고 기본 annotation 크기 11px HARD/12px 목표를 유지한다.

## 7. 단일 runtime flow와 실패 처리

1. **Resolve**: stable UID/원본 bank path/qid를 확정하고 source·verified solution·현재 asset refs를 읽는다. registry v2를 우선 사용하고 legacy alias를 명시한다. 경로용 assetId는 UID digest로 분리한다.
2. **Plan/freeze**: 유효한 frozen graph/expected facts가 있으면 현재 source SHA와 확인해 재사용한다. 없으면 부모 Archive 제작자의 source planning 단계에 typed 요청을 넘겨 graph를 작성하고 source condition inventory와 검증된 풀이를 결박한다. graph는 APMath의 portable IR이며 SymPy pickle/임의 Python/JS 코드를 담지 않는다. source/solution 충돌은 `NEEDS_INPUT`이다.
3. **Graph evaluate**: typed DAG/branch를 검증하고 SymPy Geometry로 snapshot을 만든다. frozen primitive inputs에서 독립 CindyJS construction을 실행해 geometry/condition/degeneracy를 대조한다. source coverage의 각 critical condition은 검증된 assertion 또는 독립 검토 근거를 가져야 한다. 미지원 조건을 제외하고 PASS하지 않는다.
4. **Resolve profile / typeset / measure**: 폰트·스타일·표현을 한 번 고정하고 inventory 전체를 실측한다. browser 불가 시 가능한 graph/static candidate까지만 만들고 `RENDER_PENDING`을 반환한다.
5. **Layout/compose**: 기존 owner-aware layout에 typed measurements를 공급한다. final fragment 배치, viewBox, line style을 생성 단계에서 확정한다. 출력 뒤 정규식으로 SVG를 고치지 않는다.
6. **Independent machine audit**: CindyJS cross-check receipt와 final SVG primitive observer를 결합한다. frozen graph/source/branch가 달라졌으면 cross-check도 재실행한다. math/source 오류를 layout repair로 보정하지 않는다.
7. **Isolated browser check**: 같은 bytes를 layout/collision/glyph inventory와 대조한다. static에서 실패한 후보를 비싼 Archive capture로 보내지 않는다.
8. **Archive desktop capture**: original bank를 복제한 generated candidate에 해당 image field만 연결한다. 실제 engine과 dependencies를 고정한 local server로 direct `mode=sol&qpp=4`, 1440×1000, no fit에서 렌더한다. production 파일은 쓰지 않는다.
9. **Repair**: visual defect만 label 이동 → cue 조정 → equal-unit framing → 짧은 leader/dimension 순으로 재생성한다. 검증된 template가 있을 때만 panel split을 사용한다. 최초 후보 뒤 내부 polish 최대 3회; 동일 candidate/동일 결함 반복 또는 개선 없음은 종료한다. 이는 외부 FINAL_AUDIT/TARGETED_RECHECK 예산과 별개다.
10. **Freeze/review/result**: final SVG와 preview/capture를 immutable ref로 고정한다. 독립 review가 적용 범위를 검토한 뒤 상태를 reducer가 계산한다. 실패는 candidate·정확한 node/label/조건·repair 이력과 함께 반환한다.

문항 지정부터 graph 작성까지는 현재 deterministic CLI에 존재하지 않는다. 새 `resolve-request`/planning adapter가 상위 제작 worker와 **동일 요청의 연속 단계**로 연결해야 한다. frozen facts 파일을 사용자가 별도로 만드는 방식은 최종 완료 조건을 충족하지 않는다. model/worker가 없거나 검증된 풀이가 없으면 지원 상태를 명시하고 이어 실행할 수 있는 checkpoint를 남긴다.

### 결과 계약

`result.json`은 기존 상태를 숨기지 않고 다음 축을 갖는다: input/source coverage, construction, typesetting/font, measured layout, independent primitive audit, Archive capture, independent review. 각 축은 PASS/FAIL/NOT_RUN/NOT_APPLICABLE이며 applicable 필수축 누락은 ready가 아니다.

상위 상태 enum/reducer는 Detail 05 §24–26 / production/contracts.json을 참조한다. EXEMPT, static FAIL, Archive 대기 등 원인을 축약해 없애지 않는다. qualification은 QUALIFICATION_COMPLETE와 ordinary PUBLICATION_READY를 분리한다. `productionAuthorized:false`를 유지하며 부모 CREATE/R1/R2/R3 상태명은 바꾸지 않는다.

산출물은 `archive/_generated/geometry-visual-engine/<run-id>/<asset-id>/attempt-XX/` 아래 immutable하게 저장한다. request/graph/snapshot/profile/labels/measurements/SVG/audit/capture/review/result를 담되 동일 정보를 여러 권위 파일로 중복 관리하지 않는다. `result.json`은 최종 attempt의 `visual.svg`를 가리킨다. 편의용 final.svg를 만든다면 bytes 동일성만 복사하며 별도 후처리를 하지 않는다.

## 8. 실제 Archive 연결과 독립 audit 경계

### 8.1 Archive 연결을 수정할 정확한 부분

- `build-visual-render-matrix.mjs`에 opt-in publication profile을 넣는다. publication은 desktop/direct/no-fit 한 case; 기존 general matrix의 mobile/다중 mode는 별도 계약으로 보존한다.
- source patch와 protected-field parity 검사를 재사용하되 fixture manifest만 받는 구조를 일반 candidate asset manifest도 받도록 확장한다. `solutionImageSize=full`을 무조건 덮어쓰기보다 실제 대상의 승인된 display policy를 결박한다.
- `record-visual-browser-evidence.mjs`는 engine 단일 SHA 대신 `PC/runtime.mjs`의 bundle을 사용한다. 허용 runtime/source/assets만 serve하고 unbound 요청, 실행 중 bytes 변경을 실패 처리한다.
- candidate bank response SHA, 정확한 UID→qid→image occurrence, 최종 asset response SHA, viewport/DPR/fit state, 이미지 client rect, screenshot 파일 SHA, runtime response bundle SHA를 item evidence에 남긴다. URL substring 매칭만으로 다른 문항의 같은 이미지가 연결되지 않게 한다.
- renderer readiness와 모든 target decode를 기다린 후 capture한다. 마지막 문항과 continuation/같은 페이지 영향도 확인한다.
- `<img>` actual crop과 self-contained 동일 SVG의 actual-size replay를 대조하는 qualification을 추가한다. replay를 인페이지 font 관측이라고 표기하지 않는다.
- `PC/render.mjs` 전체를 당장 교체하지 않는다. 그 collector는 fit=screen과 전체 question-quality 요구를 갖는다. runtime/impact/review의 재사용 가능한 부분을 geometry collector에 연결하는 것이 최소 변경이다. 부모 PC closure에 넣을 때만 적합한 capture adapter와 profile을 추가한다.

### 8.2 네 개의 독립 경계

| 경계 | 볼 수 있는 입력 | 하면 안 되는 일 |
|---|---|---|
| source/fact review | 원문, verified solution, 필요성·조건 inventory, 제안 graph 의미 | builder snapshot/기존 SVG를 정답으로 expected facts를 복사 |
| construction audit | frozen source conditions/graph의 원시 입력과 연산 정의, 독립 CindyJS 결과 | SymPy final 좌표를 CindyJS Free point에 복사해 독립 construction이라고 부르거나 builder helper를 import |
| artifact audit | frozen 기대조건/독립 projection, final SVG bytes, font/수식 reference | witness의 좌표·owner·PASS를 관측값으로 복사 |
| visual review | freeze 후 actual Archive screenshots/capture/UID mapping | collector의 overlap=0만으로 학생 가독성·자연스러움을 자동 PASS |

공통 schema·approved profile·hash serializer는 공유할 수 있다. SymPy production adapter와 CindyJS audit adapter는 서로의 계산 결과/constructor helper를 재사용하지 않는다. 예를 들어 수선의 발은 SymPy projection과 CindyJS Perp+Meet로 독립 구성한다. 결과는 source-anchored model frame에서 branch와 관계를 비교한다. 양쪽에 공유한 원문 해석이 틀릴 위험은 source completeness review로 다룬다. 기존 final SVG observer는 별도 독립 경계로 유지한다.

source completeness는 residual 검증으로 대체하지 않는다. sourceConditionCoverage에 원문 조건→graph node/constraint→그림 표현→review 근거를 결박한다. conclusion을 given indicator로 표시하는 오류, source point 재명명, 빠진 결정 조건을 별도로 판정한다.

시스템 qualification의 FINAL_AUDIT/targeted recheck는 현 PC provider/work-batch 계약을 따른다. 별도 identity를 문자열로 만들어 가짜 독립성을 만들지 않는다. 제작과 collector가 준비한 evidence는 review 이전까지 machine/build-side로 표시한다. 이 계획 작성 작업에서는 provider audit를 실행하거나 독립 reviewer PASS를 주장하지 않았다.

## 9. 필요한 부분만 재생성하는 규칙

| 바뀐 입력 | 재계산/재검 범위 | 재사용 가능한 것 |
|---|---|---|
| source/verified solution/critical condition | source coverage, 영향 graph, semantic/primitive, 관련 render/review | 변경 영향이 없고 binding이 유효한 별도 문항 |
| free parameter 또는 node op/branch | descendant graph closure, 해당 label/geometry, layout 이후 전부 | 독립된 graph component의 계산값 |
| font/typeface/typesetter | 해당 label 측정→layout→SVG→artifact audit→Archive/review | source 풀이와 graph 수학 증거 |
| label 위치/annotation cue | 해당 label 및 공간 충돌 이웃→SVG audit→Archive/review | graph 계산과 동일 fragment measurements |
| viewBox/frame | 모든 projection, layout, final primitive audit, Archive/review | model-space graph 및 font metrics |
| Archive CSS/native_print/MathJax/font/runtime policy | 해당 dependency를 쓰는 render와 review | 바뀌지 않은 SVG/graph. 측정 renderer도 바뀌면 metrics 추가 무효화 |
| 단일 SVG 높이·비율 | 해당 item 및 실제 pagination/column/continuation 영향 문항 | 현재 capture signature가 동일한 문항의 유효 root review |

캐시는 수학, typeset/measurement, layout, render로 나눈다. 최종 render evidence는 source/candidate/SVG/runtime/profile/browser/viewport/capture SHA를 포함한다. 이전 파일이 존재한다는 이유로 reuse하지 않는다.

`PC/render-impact.mjs`를 쓰려면 collector에서 요구하는 itemWitnesses/blocks/signature를 실제 capture로 만든다. 영향이 없다는 판단에도 현재 placement 확인이 필요하므로, affected bank를 다시 capture할 수는 있지만 변경 없는 SVG를 다시 생성하거나 모든 reviewer 축을 재실행할 필요는 없다. 전역 runtime 변경은 해당 run의 render 대상 전체를 무효화한다.

## 10. 수정·추가할 파일과 책임

아래 신규 이름은 **앞으로 만들 제안**이며 현재 존재하는 API처럼 호출하지 않는다. 파일 수를 목표로 삼지 않고 책임이 작으면 합친다.

### 10.1 신규 구현

| 제안 경로 | 책임 |
|---|---|
| `archive/tools/geometry-equation/production/run.mjs` | 단일 produceVisual 실행, immutable attempts, 단계 결과, bounded repair/cache/result. 작은 state reducer도 이곳에 둠 |
| `archive/tools/geometry-equation/production/resolve-request.mjs` | stable UID/source/solution/frozen graph resolution, 부모 planning 인계, request/checkpoint 계약 |
| `archive/tools/geometry-equation/production/contracts.json` | request/graph handoff/label metrics/result 및 support matrix의 versioned 계약. 수학 graph schema는 아래 파일에 위임 |
| `archive/tools/geometry-equation/visual_engine/construction_graph.py` | 얇은 typed op registry, graphlib scheduling, branch/degeneracy policy, descendant invalidation. geometry 공식 구현 금지 |
| `archive/tools/geometry-equation/visual_engine/sympy_kernel.py` | validated graph→SymPy Geometry adapter, exact expression/finite numeric snapshot, bounded precision/time limits |
| `archive/tools/geometry-equation/visual_engine/construction_graph.schema.json` | 닫힌 node/op/input/constraint schema |
| `archive/tools/geometry-equation/visual_engine/construction_adapter.py` | evaluated graph→기존 spec/publication/coordinate provenance; model/render 좌표 분리 |
| `archive/tools/geometry-equation/production/audit-construction-cindy.mjs` | frozen graph를 CindyJS로 독립 재구성, real/projective/branch 검증과 node별 cross-check receipt. SymPy/producer adapter import 금지 |
| `archive/tools/geometry-equation/construction-dependencies.lock.json` 및 `requirements-construction.txt` | SymPy/mpmath/CindyJS 배포 version/hash/runtime/license. npm/Python 전역 설치와 무버전 CDN 사용 금지 |
| `archive/vendor/construction/cindyjs/` | qualified prebuilt core와 원본 license/해당 고지. source build 전체나 plugin 묶음 배포 불필요 |
| `archive/tools/geometry-equation/production/typeset-labels.mjs` | 고정 font/MathJax SVG label fragments, measurement inventory, 재사용 browser context |
| `archive/tools/geometry-equation/audit_label_fragments.mjs` | frozen expected label에서 독립 reference 생성 및 실제 label subtree 비교. producer 함수 import 금지 |
| `archive/vendor/visual-typesetting/` | 선택된 SVG 조판 component/font 자산·버전·license·hash manifest. Archive CHTML을 복제해 별도 runtime 전체를 만들지 않음 |

흑백/축소 diagnostic preview와 report 작성은 기존 collector/runner의 작은 기능으로 넣는다. `assess_*.py` 등 명칭을 맞추기 위한 신규 CLI는 만들지 않는다.

### 10.2 기존 코드 수정

| 기존 파일/모듈 | 변경 내용 |
|---|---|
| `VE/geometry_model.py`, `math_expression.py` | 기존 numeric kernel 유지. 필요한 snapshot/precision compatibility만 보강. AST→SymPy/조판 입력 변환, float/exact 구분. 신규 작도 공식 추가를 기본 계획에서 제거 |
| `VE/semantic_model.py`, `visual_spec.schema.json` | graph adapter snapshot/버전/label 계약을 받아 기존 의미 검증 보존. old schema silent reinterpret 금지 |
| `VE/coordinate_evidence.py` | graph provenance v2 지원. legacy v1과 구분하며 실행 증거를 독립 reference에 결박 |
| `VE/engine.py` | prepare labels export, resolved profile/fragments/metrics 주입, 기존 build default 호환, requiredGates의 낡은 ARCHIVE_MODE_SOL_390 정정 |
| `VE/entrypoints.py`, `past_exam_adapter.py` | typed metrics/profile 인자 전달, canonical UID↔safe assetId mapping |
| `VE/style_tokens.json`, `style_tokens.py` | legacy token 유지 + production profile 해석. font file/hash/역할, stroke/spacing/version을 하나의 resolved snapshot으로 전달 |
| `VE/label_layout.py` | typed ink bounds/baseline, required label completeness, 모든 후보/panel 실측, stroke-aware obstacles, measured/approximate basis 구분 |
| `VE/publication.py`, `viewport.py` | 측정 기반 owner-safe 후보/cue repair/framing. numeric model 불변, profile 값 소비 |
| `VE/svg_composer.py` | 동일 measured fragment 출력, profile 재로드 제거, 제한된 self-contained label subtree/semantic metadata |
| `GE/audit_publication.py` | v1 보존 + v2 label/paint/style 관측, independently derived frame, math glyph와 geometry primitive 분리 |
| `GE/verify-visual-engine-static.mjs` | v1/v2 capability dispatch. 기존 text-only regex로 새 math path를 PASS시키지 않음 |
| `GE/verify-rendered-layout.mjs` | pre-layout inventory 측정 API, label group bounds, expected inventory coverage, margin/profile와 bbox 단위, glyph/paint completeness |
| `GE/build-visual-render-matrix.mjs` | real candidate manifest, opt-in desktop direct/no-fit, 정확한 UID asset mapping |
| `GE/record-visual-browser-evidence.mjs`, `visual-browser-runtime.mjs` | runtime bundle, bound serving, shared context, item capture/screenshot SHA, replay-equivalence/보조 preview |
| `archive/tools/past-exam-pipeline/build-visual-candidate.mjs` | 기존 --facts --run-id 유지; 별도 명시적 --request production 경로를 runner에 위임 |
| `GE/tests/*`, `.github/workflows/geometry-publication-tests.yml` | 아래 회귀와 실제 Archive qualification, branch 한정 trigger를 새 변경/PR 대상에 맞게 조정 |
| `GE/PUBLICATION_PROFILE.md`, skill/visual canonical, v0.1 문서 | 지원범위/새 경로/완료 상태와 실제 구현을 맞춤. historical PASS/낡은 pending은 시점이 보이게 보존 |

PC의 `canonical.mjs`, `runtime.mjs`, `render-impact.mjs`, `question-uid.mjs`는 우선 함수 재사용한다. `render.mjs`/profiles/schema를 바꿔야 할 경우는 부모 closure adapter에 필요한 opt-in 확장으로 제한하고 일반 Archive 계약을 바꾸지 않는다.

## 11. 단계별 구현 순서와 종료 gate

| 단계 | 구현 | 종료 기준 |
|---|---|---|
| 0. 기준선·실행 계약 | 기존 회귀, UID/source authority, wire/hash, stage commit, scope/분모 고정 | D05 §75 conformance 및 실제 authority resolve 확인 |
| 1. 고위험 작은 실험 | 대표 SymPy/CindyJS, MathJax SVG·한글 img 전달, graph 독립 bound | 각 실험의 정상·실패·시간 한도 확인; 전체 지원 완료로 세지 않음 |
| 2. 실제 두 문항 전 구간 | geometry 1 + graph 1 UID→planner/검토→normalizer→math→조판/측정/배치→Actual Archive→review | 수동 JSON 수정·가짜 PASS 없이 끝까지 연결; 비좌표 realization 조기 추가 |
| 3. 표시·운영 보강 | DisplayEnvelope feedback, owner layout, 단일 repair, atomic publish/resume, stage cache | 실제 크기/재시작/동시 실행/cold-warm 회귀 통과 |
| 4. capability 확대 | construction op, graph family, 좌표기하·조판·layout을 observer와 함께 확대 | 등록된 지원 scope별 positive/negative·독립 관측 완료 |
| 5. 전체 qualification | Geometry ≥6 + Graph ≥4 및 required feature/control/negative/독립 전수 review | 전체 분모 완료→targeted repair→durable Seal/activation; production write 0 |

상세 순서와 기존 계층별 Phase의 관계는 §16.3을 따른다. 기존 Detail의 component 구현 순서는 해당 기능 내부의 순서이며, 전체 component 완성을 기다린 후 최초 Archive 통합하는 일정이 아니다. 조기 두 문항은 최종 전체 분모를 대체하지 않는다.

### 11.1 통합검토 반영된 연결 계약

- **요청/계획:** 파일 `--request <path>`와 `--question-uid <uid>`를 분리하고 D05의 동일 VisualRequest/FrozenVisualPlan으로 정규화한다. D07 의미 skeleton은 D01/D02 normalizer가 executable mathPlan으로 닫는다. 독립 fact evidence 없이 plan hash만 복사해 실행하지 않는다.
- **최초 qualification:** EXPERIMENTAL 구현은 frozen manifest의 QUALIFICATION mode로 동일 pipeline에서 시험한다. QUALIFIED matrix→Seal→ACTIVE projection의 비순환 순서를 사용하고, Seal 전에 PUBLICATION_READY를 요구하지 않는다.
- **독립 graph audit:** 꼭짓점과 별도로 선분 내부 오차·visible coverage를 검사한다. 정확한 endpoints/점 200개/midpoint-only로 우회되는 negative를 포함한다. D02의 독립 bound와 budget을 사용한다.
- **라벨 캐시:** v1은 owner-bound fragment cache를 택한다. UID/surface/asset/panel/label/occurrence/owner/factRole을 key와 namespace에 포함하고, cache hit 뒤 owner를 바꾸지 않는다.
- **좌표기하:** coordinate-geometry-publication-v1 descriptor에서 기존 geometry-v2와 axis/tick 관측을 합성한다. equal-unit을 실제 SVG/Archive에서 확인하며 기존 axis-free profile은 유지한다.
- **reuse/분모:** stale screenshot과 검증된 root reuse를 D06/D08에 맞춰 구분한다. Geometry 6+Graph 4와 required feature coverage를 별도로 확인하고 control case를 새 visual 실적으로 세지 않는다.

공통 schema/routing/status 소유자는 Detail 05이며 상위 문서에서 이를 복제하지 않는다. 각 Detail의 관련 본문/예시와 최소 회귀가 v1.1로 보완되었다. 이 보완을 이유로 새로운 전수 재검 단계나 무제한 repair loop를 추가하지 않는다.

## 12. 최소 회귀와 실제 Archive 검증

### 12.1 기존 회귀 재사용

기존 Python geometry suite, Node geometry suite, 5 publication fixtures, 13 legacy fixture byte parity를 기본으로 유지한다. 기존 문서의 118/48 같은 숫자를 목표 카운트로 복제하지 않고 실행한 SHA·실제 결과를 기록한다.

```text
python -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_*.py' -v
node --test archive/tools/geometry-equation/tests/*.test.mjs
python archive/tools/geometry-equation/tests/build_publication_fixtures.py
node archive/tools/geometry-equation/tests/run-publication-browser.mjs
node archive/tools/geometry-equation/tests/run-publication-archive.mjs
```

위 명령은 구현 후 검증 계획이다. 이번 계획 작성에서 실행한 것으로 표시하지 않는다. 일반 legacy SVG bytes는 opt-in v2 추가만으로 달라지지 않아야 한다. 지원 도구 환경은 기존 GEOMETRY_NODE_MODULES/GEOMETRY_BROWSER_EXECUTABLE 등을 재사용한다.

### 12.2 신규 최소 검증 행렬

| 대상 | 필수 positive / negative |
|---|---|
| graph schema | typed 정상 DAG / unknown op, missing ref, 잘못된 타입, self-cycle·다중 cycle, derived coordinate override 거부. 임의 eval/sympify/CindyScript 전달 거부 |
| 지원 연산 | 5.2의 각 op 최소 정상 1 + 퇴화/입력오류 1. 교점은 0/1/2·일치·near-tangent, 직선은 near-parallel 포함 |
| 관계 보존 | free parameter 3개 이상의 유효 값에서 수선/중점/접선 관계 보존. 범위 밖/branch guard 위반 실패 |
| 독립 audit | SymPy 출력 좌표·branch·operation·source label·given/conclusion을 각각 변조했을 때 CindyJS/primitive audit FAIL. CindyJS에는 source inputs만 제공 |
| OSS runtime 경계 | SymPy undecidable/timeout/동일 객체 intersection, CindyJS complex/infinite/nonfinite/중복 tangent root, 반복 실행 state reset, version/hash mismatch 거부 |
| numeric/viewBox | exact rational/근호 의미 유지, equal-unit projection; framing 바꿔도 model-space 길이·각도 동일 |
| 조판 | 한글·A/B/T·−·prime·40/3·sqrt·nested power·subscript. missing font/glyph, 다른 fragment/hash, 분수선/지수 위치 변조 거부 |
| measured layout | metrics가 실제 위치에 반영됨, 실패 label inventory에서 사라지지 않음, bbox offset/baseline, 굵은 선/arc 충돌 |
| runner | 한 요청→result, 같은 입력 동일 SVG, cache hit/정확한 invalidation, 최대 3회, 동일 hash stagnation, browser 실패 후 resume |
| Archive | direct desktop/no-fit, actual SVG+bank response SHA, 다른 qid/누락 이미지/stale CSS·font·runtime·screenshot 거부 |
| changed-only | label 변경은 graph cache 유지, free point는 descendant만 재계산, 페이지 밀림은 인접 문항 capture/review 영향 포함 |
| 독립성/쓰기 | builder↔auditor 금지 import, reviewer≠collector, freeze 이후 review, generated 이외 output 거부, production 파일 무변경 |

### 12.3 실제 문항 대표 묶음

synthetic 5개는 `owner-triangle`, `multi-angle-owner`, `equal-length-owners`, `fraction-point-T`, `region-leader`를 그대로 사용한다. 이것은 실제 시험지 재구성 검증과 다르다.

실제 generated-visual qualification의 최소 분모는 **Geometry ≥6 + Graph ≥4 = 전체 ≥10 unique UID**로 고정한다. Geometry의 (1) source coordinates, (2) foot/midpoint, (3) line/circle branch, (4) tangent/circle, (5) 밀집 owner, (6) 분수·근호·한글 축을 유지하며, 최소 1건에서 좌표축+원+직선/접선의 geometry+axis audit를 검증한다. Graph는 Detail 02 §31의 7개 실제 feature를 최소 4 UID에 매핑한다. 한 UID의 다중 feature coverage는 허용하되 Geometry/Graph count 중복은 금지한다. 실제 10개로 feature를 덮지 못하면 UID를 추가한다. KEEP/RASTER/EXEMPT/control case와 synthetic은 generated real 분모에 포함하지 않는다. 전체 mapping은 Detail 08 §22–29를 따른다.

main에 실제 있는 시작 후보는 `archive/exams/original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js`의 q12(negative regression 연결), 같은 bank의 다른 SVG 문항, 그리고 `archive/exams/original/middle/m3/1final/25_연향중_1학기_기말_중3_기출c.js`의 q23 asset 연결이다. **이번 조사에서 이 문항의 원문 수학/풀이를 검수한 것은 아니므로** graph 유형이나 PASS를 미리 배정하지 않는다. 단계 0에서 최소 10 UID와 source/solution bytes·선정 사유·required feature coverage를 확정하고 구현 qualification 동안 분모를 고정한다.

실제 bank 전체를 generated overlay로 렌더해 문항 배치 맥락을 유지하되 변경/검수 분모는 선정한 generated real target(최소 10)와 직접 render 영향 문항이다. sol SVG만 바뀌면 sol desktop을 필수로 한다. problem image 지원을 활성화하는 후속 단계는 exam mode와 source fidelity를 별도로 추가한다. mobile page-fit의 절대 px는 이 gate의 기준이 아니다.

독립 reviewer가 실제 화면에서 결정 관계, owner 모호성, 자연스러움, 정보 밀도, 수식/한글 가독성과 흑백 의미 보존을 확인한다. 흑백/축소 simulation은 보조 화면이며 새로운 mobile 11px gate가 아니다. 첫 독립 검토 후 수리는 changed target + dependency로 제한한다.

## 13. 완료 기준

다음이 모두 충족돼야 이 구현 범위의 완료를 선언한다.

- [ ] 문항 단일 지정으로 resolution/planning/graph/조판/측정/배치/audit/Archive/result까지 이어진다.
- [ ] 5.2 지원 graph op 전체가 SymPy execution·재계산·분기·퇴화·독립 검증을 갖는다. source에서 CindyJS로 재구성하는 cross-check와 실제 primitive audit가 일치한다. raw coordinate 복사는 cross-check가 아니다.
- [ ] OSS version/hash·license notices가 고정되고 학생용 SVG는 SymPy/CindyJS runtime을 요구하지 않는다. 필요한 새 자체 코드는 IR/adapter/policy/publication 연결로 제한된다.
- [ ] source condition completeness·semantic identity·factRole이 current source에 결박된다.
- [ ] 실제 final font/fragment를 먼저 고정해 측정하고 동일 표현을 layout/composer가 소비한다.
- [ ] 별도 글꼴 수정·수식 SVG 문자열 후처리·수동 label 교정 명령 없이 정상 supported case가 끝난다.
- [ ] 필수 label inventory 누락 0, owner 오류 0, hard collision/clipping 0, desktop 기본 label 11 CSS px 이상을 만족한다.
- [ ] geometry와 label glyph에 대한 독립 관측이 final bytes에 결박된다. self-check만으로 최종 PASS하지 않는다.
- [ ] actual Archive direct desktop에서 source bank·target UID·SVG response·runtime·screenshot이 같은 revision으로 증명된다.
- [ ] 기존 5 synthetic을 보존하고 신규 required positive/negative 및 generated real Geometry ≥6 + Graph ≥4(전체 unique ≥10), UID×required-feature coverage와 지원 op 회귀가 닫히며 SVG 재현성이 확인된다.
- [ ] graph/font/viewBox/runtime 변경 시 정확한 cache/review invalidation과 changed-only 재검이 확인된다.
- [ ] 미지원·입력 충돌·브라우저 불가·stagnation은 구체적 상태와 candidate를 남기며 false READY/PASS를 만들지 않는다.
- [ ] 최초 qualification은 동일 pipeline에서 실행하되 공개 준비 권한이 없고, Seal→ACTIVE 후 요청별 independent review까지 닫힌 ordinary 결과만 PUBLICATION_READY다. production 쓰기/배포는 기존 release 계약에 남아 있다.
- [ ] old candidate CLI·legacy fixture가 호환되고 production exam/asset 자동 migration은 없다.

## 14. 하지 않거나 제거할 작업

1. v0.1의 존재하지 않는 5개 scripts 복구를 선행 작업으로 강제하지 않는다. 필요한 기능을 실제 모듈에 매핑한다.
2. `constructionSteps` 문자열 ledger를 graph라고 재명명하지 않는다. v1 legacy evidence와 executable graph v2를 구분한다.
3. 자체 geometry kernel을 전부 확장하거나 외부 GeoGebra 앱을 필수 runtime으로 만들지 않는다. SymPy/CindyJS의 검증된 작도를 adapter로 사용하고 기존 APMath numeric 코드는 역할별로 보존한다.
4. TikZ/PGFPlots backend 확대·interactive editor·전수 legacy SVG 재제작을 이 통합 완료 조건에 섞지 않는다.
5. final SVG font 문자열 치환, viewBox 사후 패치, old capture에 새 SVG SHA 덧붙이기 경로를 공식 생산에서 제거한다.
6. 중복 style 설정과 테스트용/실제 문항용 서로 다른 desktop 정책을 정리한다. general mobile regression 자체는 필요 시 별도 유지한다.
7. 모든 문제에 카드/그림을 추가하지 않는다. 필요성·source figure의 충분성은 planning에서 판정한다.
8. 전체 exam/mode/device matrix를 모든 단일 SVG 요청에 의무화하지 않는다. 해당 publication scope와 부모 release scope를 구분한다.
9. 생성기와 독립 감사기의 수학 코드를 DRY 명목으로 합치지 않는다.
10. construction·font·render 신규 공백이 있는 상태에서 과거 CODE_READY나 synthetic PASS를 원클릭 완료로 인용하지 않는다.
11. JSXGraph·CindyJS·SymPy 세 개를 모두 주 runtime으로 유지하지 않는다. 이번 구성은 SymPy production + CindyJS independent audit이며 JSXGraph의 browser/DOM 호환 작업은 범위 밖이다.
12. OSS kernel을 사용했다는 이유로 source completeness, branch semantics, 출판 품질, 독립 artifact 관측이 자동 충족됐다고 주장하지 않는다.

## 15. 주요 코드 근거 색인

모든 링크는 조사 SHA에 고정되어 있다. 함수명은 위 판단의 직접 근거다.

- [geometry_model.py](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/geometry_model.py), [semantic_model.py:27](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/semantic_model.py#L27): 수치 kernel과 관계 검증 경계.
- [coordinate_evidence.py:157](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/coordinate_evidence.py#L157), [audit_publication.py:273](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/audit_publication.py#L273): step ledger가 executable DAG가 아닌 근거.
- [engine.py:121](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/engine.py#L121), [label_layout.py:68](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/label_layout.py#L68): measurements 지원과 현재 배치 한계.
- [publication.py](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/publication.py), [svg_composer.py](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/svg_composer.py), [math_expression.py](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/math_expression.py): 현재 owner·조판·출력.
- [build-visual-candidate.mjs](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/past-exam-pipeline/build-visual-candidate.mjs), [past_exam_adapter.py](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/visual_engine/past_exam_adapter.py): frozen facts 기반 candidate-only 현 진입점.
- [verify-rendered-layout.mjs](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/verify-rendered-layout.mjs), [record-visual-browser-evidence.mjs](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/record-visual-browser-evidence.mjs): 실제 browser 측정과 actual-size replay 경계.
- [build-visual-render-matrix.mjs:38](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/geometry-equation/build-visual-render-matrix.mjs#L38), [PC/render.mjs:160](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/pipeline-core/render.mjs#L160): desktop publication 연결의 정책 불일치.
- [runtime.mjs](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/pipeline-core/runtime.mjs), [render-impact.mjs](https://github.com/icefoxtail/AP------/blob/b08ba2db04ba3be4d172b718aee29e169f8655d3/archive/tools/pipeline-core/render-impact.mjs): 재사용할 dependency closure/부분 재검 기반.

이 문서는 최신 main과 Notion 초안을 독립적으로 대조한 구현 계획이다. Pro/Astra 검토 완료, 독립 reviewer 합의, 통합 runtime PASS 또는 실제 제품 변경을 의미하지 않는다.

---

## 16. 상위 아키텍처 재검토 결정 — 2026-10-05

검토 기준은 `0bb88da58e41ae1154911d4e711f6247e60e5f16`이다. [근거·재현·우선순위 보고서](APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)를 함께 읽는다. 이번 변경은 계획 보강이며 신규 엔진 구현/qualification/Seal이 아니다.

### 16.1 유지할 구조와 단순화

SymPy production, CindyJS 독립 재구성, 기존 sampler·publication·layout·Archive collector를 유지한다. 외부 renderer로 갈아타거나 새로운 범용 constraint solver를 만들 근거는 없다. 8개 Detail은 책임 구분이며 8개 서비스/별도 scheduler를 뜻하지 않는다. **Node의 단일 runner + 경계가 명확한 Python 계산/build worker + 격리된 observer + 기존 Archive renderer**로 시작한다. browser process는 공유 가능하지만 측정/Archive/review 입력 context와 증거는 분리한다.

필수 불변 산출물은 frozen semantic plan, model snapshot, label fragments/metrics, layout/composition, final SVG, audit/capture/review, result manifest다. 작은 중간 값은 같은 stage receipt에 넣고 별도 authority 파일을 늘리지 않는다. 기존 visualSpec은 compatibility/build adapter로 유지하며 upstream plan과 서로 역변환해 두 개의 편집 정본으로 만들지 않는다.

### 16.2 구현 전에 확정할 계약

| 결정 | 소유 Detail | 종료 증거 |
|---|---|---|
| Node/Python wire·hash·bound ref 규격 | D05 §75 | 양 언어 conformance vectors; 기존 hash 의미 보존 |
| 좌표 없는 도형의 normalization/realization, branch의 숨은 의존성 | D01 §23, D07 §104 | source-coordinate/비좌표 geometry 두 경로 및 branch-only 변경 negative |
| scalar 계산과 notation 의미 구분 | D03 §39 | pi/π, degree/unit, 생성 AST의 괄호 우선순위 테스트 |
| 실제 Archive 표시 한계를 받는 layout | D04 §54, D06 §89 | medium/full 각각 실제 CSS 크기에서 typography/curve gate |
| cache 계산값과 evidence authorization 분리 | D05 §75, D06 §89 | cold/warm 동일 SVG, 변경된 reviewer/verifier/placement의 stale 거부 |
| source 검토·planner·review continuation | D07 §104 | fresh UID 요청과 저장 plan replay를 별도로 검증 |
| scope별 qualification fingerprint와 durable evidence | D08 §141 | 무관 docs 변경 reuse, 관련 코드/감사기 변경 stale, evidence 유실 거부 |

### 16.3 최종 권장 구현 순서 — §11 순서의 구체화

1. **기준선과 실행 경계:** 기존 회귀, UID authority 실제 경로, wire/hash, generated-only staging/commit, required-audit descriptor, 지원범위/전체 qualification 분모를 확정한다.
2. **고위험 작은 실험을 먼저:** 대표 construction을 SymPy/CindyJS에서 같은 원시 입력으로 실행; MathJax SVG/한글 전달을 actual `<img>`에서 비교; graph 오차 bound의 다항/유리/sqrt 경계 정상·실패 사례를 실행한다. 범용 기능 전체를 먼저 만들지 않는다.
3. **최초 두 실제 문항의 전 구간 연결:** geometry 1 + graph 1을 UID→planner/검토→normalizer→math→typeset/measure/layout→Actual Archive→독립 review까지 연결한다. construction 첫 사례가 source coordinates이면 비좌표 realization 사례를 곧바로 추가한다. 가짜 PASS adapter로 후기 gate를 대체하지 않는다.
4. **실제 병목 보강:** 표시 크기 feedback, owner layout, profile 조합, resume·atomic artifact publish·단일 repair budget을 닫는다. 먼저 stage 단위 cache를 쓰며 node/local-placement cache는 정확한 dependency와 성능 이득이 입증될 때 활성화한다.
5. **지원범위 확대:** typed op·graph family·좌표기하·조판/배치 유형을 해당 독립 observer와 함께 늘린다. semantic plan/branch를 검증하지 못하면 미지원으로 남긴다.
6. **전체 qualification:** Geometry ≥6 + Graph ≥4와 required feature 전체, control/negative, Windows smoke/고정 CI 환경, 독립 전수 review→수정 영향 재검→Seal/activation을 닫는다. 조기 두 사례는 전체 완료를 대체하지 않는다.

순서 1–3은 구현 착수 가능하다. 고위험 실험을 통과하기 전에 전체 op/함수군의 비용·완성 가능성을 확정한 것으로 간주하지 않는다. 품질 gate를 낮추는 대신 지원범위와 단계별 완료를 정확히 구분한다.
