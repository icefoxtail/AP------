# 문제은행 전체 문항 — 문제·해설 SVG 필요성 판정 및 전수조사·보강 운영계약 v1.0

> **CURRENT / 2026-10-10 형님 직접 지시 / 범위: 문제은행 전체**. 기존 Visual 스킬·엔진·독립검수 정본을 **재사용**하며 새 SVG 엔진을 만든다는 문서가 아니다. 이 문서는 전수조사와 향후 신규 제작의 의사결정·누락 봉합 계약이다. 본 문서 작성만으로 전체 문항 전수조사나 SVG 제작·브라우저 검사가 완료된 것은 아니다.

## 0. 최우선 불변 규칙 — 문제와 해설은 별도 SVG 판정

1. **문제은행의 모든 고유 문항 UID/qid**에서 **(A) 문제용 PROBLEM_VISUAL**과 **(B) 해설용 SOLUTION_VISUAL**의 시각적 필요성을 **독립적으로 판정**한다. 기출·ALIVE Generated·유사/변형·교재/타입뱅크 등 실제 문제은행에 유입되어 검색/출제되는 모든 Source/Consumer 및 평가상품 파생 입력에 적용한다.
2. **판정 결과가 실제로 필요한 SVG 제작인 문항은 반드시 생성·결속·실검**한다. “발문이 방정식만으로 완결되어 TEXT_ONLY이다”, “원본 그림이 이미 있다”, “원래 제작자가 SVG를 쓰지 않았다”는 이유만으로 **해설 시각자료 필요성 검토를 생략할 수 없다.**
3. 시각자료를 무조건 100% 붙이지 않는다. `VISUAL_EXEMPT`은 **해당 surface가 학습에 실질적 이익이 없거나 기존 적합한 시각자료로 충분하다는 개별 문항 근거**가 있을 때만 허용한다. 단순 계산·직접 대수 조작·보조 관계 없는 사실판정에 의미 없는 다이어그램을 만들지 않는다.
4. **기존 그림으로 결정 관계가 이미 충실히 전달되면 중복 SVG 추가는 요구하지 않는다.** 원본 학생용 PNG는 보존하고, 원본 문제 이미지를 임의의 재제작 SVG로 갈아치우지 않는다. 단 학생 문제에서 실제 필요한 시각정보가 없거나 기존 그림/해설이 부정확·불가독인 경우 해당 surface를 제작/수리한다.
5. **해설용 최우선 질문:** SVG가 학생에게 결정적 수학 관계/단계 변화/보조선/교점 분기/영역·부호·경계·대칭/함수 그래프를 **더 빨리·정확히 이해하고 재현**하게 하는가? **의미 있게 개선하면 VISUAL_OPTIONAL이더라도 원칙적으로 ADD 후보**로 올리고, 자산 충분성 심사로 최종 `ADD` 또는 `KEEP/EXEMPT`를 확정한다. `OPTIONAL`을 `DO_NOT_GENERATE`로 해석 금지.
6. 신규 제작 시 CREATE 내에서 문항마다 두 surface의 결정과 실제 시각 자산·검사 근거를 확보한다. **기존 승인 문항**의 별도 전수조사는 **새 품질승인/정답 재검수/기출 재작성**이 아니라 `VISUAL_AUDIT_AND_PINPOINT_REPAIR`이다. 완성된 다른 UID의 승인·출시 상태를 무효화하지 않는다.

## 1. Authority/실행 엔트리 — 엔진 재개발 금지

- 진입점 **`.codex/skills/apmath-visual-upgrade/SKILL.md`**: 모든 문제용/해설용 visual, visual 필요성/학생 이득 판단·backend 라우팅, Visual Production Orchestrator.
- GPT 작업 **`docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`**: `PROBLEM_VISUAL`/`SOLUTION_VISUAL` 분리·`KEEP/POLISH/REBUILD/ADD/REMOVE/EXEMPT`·실제 수행 증거. GPT가 로컬 Codex 스킬 또는 렌더를 실행했다고 가장하지 않는다.
- 수학·도형 증거 **`docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`**, **`docs/rules/04_VISUAL/도형추출.md`**. 실제 좌표·위상과 동결된 수학 facts를 대조하며 라벨 문자열만 보고 PASS 금지.
- 기존 renderer: `alive/engine/visual_renderer.py`, `alive/engine/visual_lane.py`, `alive/engine/coordinate_geometry.py`, `archive/tools/geometry-equation/visual_engine/`, `archive/tools/geometry-equation/generate-svg-from-independent-facts.py`. **지원하지 않는 semicircle arc/case panel/함수 family를 지원된다고 주장하지 않는다.** 정확한 visualSpec/template 지원을 확인 후 실행하고, 미지원이면 기존 스킬의 전문 backend/검증된 SVG 제작 경로를 선택한다. 기하/렌더 검증 없는 raw SVG로 PASS 불가.
- ALIVE의 `alive/05_DESIGN/ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`는 **DESIGN/파일럿**이며 모든 제품의 작동 중인 자동 renderer인 것처럼 사용하지 않는다.
- 최상위 사용자 지시·Common/JS Archive의 출시·교육과정·원본 불변/검색 성능 계약은 그대로 적용한다. 이 문서는 기존 단원별 visual 가이드의 수치·서식을 중복 정의하지 않는다.

## 2. 문제은행 전수조사 분모: 파일이 아니라 실제 문항

각 SOURCE/FAMILY 별로 전수 식별자를 먼저 확정한다.

| 소스 그룹 | 조사 입력 | 전수조사 단위/보호 |
|---|---|---|
| 기출(중/고) | `archive/exams/original/**`의 실제 production JS+연결 이미지·SVG, 등록된 기출 경로 | source exam + qid(고유 UID 결속). 원본 발문/PNG 불변, 해결 과정의 보조 SVG만 핀포인트 |
| Generated/ALIVE | `archive/generated/lite/**/shards`, metadata, `archive/assets/generated-lite`, 생성 원장·candidate, 실제 Consumer/index | sourceUid + generatedUid; 초안/승인/학생공급 상태 구분, 중복 UID 제거 |
| 타입·유사문제·교재 | 실제 문제은행 검색/출제 가능한 source 및 variant/교재 입력 | 원본·변형 관계와 학생 공급 여부를 고정한 고유 UID. 카탈로그 밖 보관 사본은 별도 집계 |
| Compose/Factory/모의고사 | 위 고유 문항을 조합한 상품 recipe·출력 참조 | 문항의 SVG 결손이 모든 상품에 전파되는지만 검사; **같은 UID를 여러 상품에서 중복 분모로 세지 않는다** |
| 분석·history·fixture | `archive/analysis`, reports, 이전 SVG, QA 캡처 | Production 분모에 합산 금지. 근거/Golden/negative로만 재사용 |

- Stage 0: **main HEAD/time, 등록 Source 수, JS parse 정상 여부, SOURCE UID 개수, Consumer/Index UID 수, 신규 후보 수**를 분리해 고정한다. `file count × 예상 문제수`를 분모로 쓰지 않는다.
- Stage 1: **전 UID의 발문·보기·원본 그림·해설·기존 SVG 경로·사용 여부**를 실제 읽는다. **문제 필요성 판정과 해설 필요성 판정을 별도로 전수** 기록한다. 단순 문자열 `solutionImage` 누락만으로 `VISUAL_REQUIRED` 단정 금지.
- Stage 2: `ADD/REBUILD/POLISH/MISSING_ASSET` 의 실제 결함 UID 큐만 수정한다. 하나의 시험지·family를 단위로 핀포인트 작업하며 이미 PASS인 SVG와 승인 문항은 재제작하지 않는다.
- Stage 3: SVG 수학·visual fidelity 및 실제 렌더/학생용 Source→Consumer/index·검색·출력 경로의 참조 일치 확인. 변경 자산 SHA로 증거 재결속. 신규 승인/출시 게이트와 소스별 운영계약에 따라 main 반영 및 remote readback.
- Stage 4: 전 UID에서 `REQUIRED/OPTIONAL/EXEMPT`와 `KEEP/ADD/REBUILD/POLISH`의 누락 행 0을 확인하고, 별도 RELEASE/HOLD·기술부채 카운트 보고. 검사 미수행 시 `NOT_TESTED`와 실제 blocker만 남긴다.

## 3. UID × 2 surface 판정 (교점·도형·그래프·집합 포함)

각 surface별 분리된 열:

- `visualNecessity`: `VISUAL_REQUIRED | VISUAL_OPTIONAL | VISUAL_EXEMPT`; `NOT_ASSESSED`는 최종 전수완료에 포함 불가.
- `disposition`: `KEEP | ADD | POLISH | REBUILD | REMOVE | EXEMPT | HOLD_VISUAL`. 기존 잘못된 이미지 삭제는 provenance와 실제 필요정보 보존 후만.
- `benefitReason`: 학생의 **결정적 사고 변화**와 **이 그림에 새로 보여줄 관계** (예: 접선 직전·접선·통과 3패널, 서로 다른 교점 분리, 현/보조선 추가, 음영 포함·제외).
- `sourceFigureSufficiency`: 기존 문제/해설 그림이 **실제 solution decisive relation**까지 보여주는지, 새 정보가 필요한지. `problemTextSelfContained=true`와 `solutionVisualExempt=true`는 **서로 독립**.
- `actualAsset`: problem image와 solutionImage/solution SVG는 서로 다른 참조로 저장. `assetPath, sha256 or GitBlob, fileExists, productionReference, consumerReference, indexVisibility` 구분.
- `geometryProof`: `expectedFacts[]`는 독립 확정 수학·해설에서 고정, `observedFacts[]`는 **실제 SVG primitive**에서 계산. 라벨 표기만으로 좌표 parity PASS 금지.
- `actualRender`: 시험·해설 화면 각각, 모바일 가독성/충돌·크롭·글씨·좌표·정답 누설 여부, QA evidence run/SHA. 실제 실행 못 했으면 `NOT_TESTED`.
- `qualityAuthority`와 `technicalRelease`는 서로 다른 열. 이미 승인된 문항을 신규 GPT 품질검수 대기로 되돌리지 않는다.

**진짜 판단 예시**
- 원·반원·접선/교점 수: 발문이 모든 방정식을 줘서 문제 그림은 없어도 풀릴 수 있다. 그러나 **해설에서 접점·2교점·위아래 반원 제한·끝점 중복**을 구분할 그림/구간 비교가 실질 이득을 주면 해설 `ADD` 후 생성 필수.
- 좌표·닮음·원·삼각비: 원본 삼각형/좌표는 이미 보여주더라도 **풀이에만 필요한 보조선·반사·접선·높이·같은 각·비례선**이 있으면 해설 ADD/REBUILD 대상으로 잡는다.
- 함수/부등식: 교점·범위/영역·경계 포함 여부가 판단을 좌우하면 그래프 또는 수직선이 유익한지 실제 판정.
- 집합/명제/대수: 벤다이어그램·구간도가 실제 논리구조를 분명하게 하는 경우만 추가; 단순 계산·문장풀이 자체가 완전하면 EXEMPT와 근거를 기록.

## 4. 생산·검수 순서와 절대 금지

1. 정확한 최종 문항/해설 및 학년 교육과정 사실 동결 → 문제 SVG와 해설 SVG의 사용 정보 분리 → source 이미지 존재/적합성 감사.
2. 두 surface 독립 판정 → 필요한 surface에서 기존 visual audit → `KEEP`이 아니면 **기존 skill의 적합 backend/엔진으로 실제 SVG 제작** → Source/UID/정답/해설/메타 및 본문 `image`, `solutionImage` 등 실제 제품 스키마에 맞춰 경로 결속(없는 키 임의 설계 금지).
3. 최소 기하 fact validation + 라벨 owner·위치·비율·그레이스케일/인쇄·디지털 가독성 확인 → 실제 엔진/Chrome exam, sol, ans 검증. 해설 완성 전에 SVG를 추정 제작하여 풀이가 나중에 그림에 끌려가도록 하지 않는다.
4. 필요한 경우 출력·문항 검색/Compose/Factory의 동일 UID로 visual이 전달되는지 확인. 잘못된 생성이미지/유령 reference/404는 릴리스 결함이며 실제 수리.
5. **문제용 SVG에 답·해설 보조선·결정적 힌트를 노출 금지**. 원본 문제 이미지를 검증 없이 새 SVG로 교체 금지. 벡터·미분 등 해당 학년 교육과정 밖 풀이 그림 금지.
6. **신규 문항 `SOLUTION_VISUAL=REQUIRED/OPTIONAL-ADD`인데 미제작/미검증이면 `HOLD_VISUAL`**로 둔다. 기존 이미 출시된 승인 UID는 일괄 탈퇴시키지 않고 기술 시각부채를 UID로 추적해 핀포인트 수리하며 사용자 지정 범위의 실제 기술 출시를 닫는다.
7. 기존 엔진 지원성 점검은 실제 family/template을 확인한다. unsupported는 `ENGINE_CAPABILITY_UNRESOLVED`이고 단순 SVG 파일 존재를 구현/검수 PASS로 주장 금지.
8. 기존 SVG가 문제 본문 또는 해설 본문에 인라인으로 존재할 수도 있다. **자산 파일명만 세어 누락으로 단정하지 말고 실제 Source→Consumer 렌더 참조**를 검사한다.

## 5. 감사 행 최소 논리 필드와 집계

`{sourceKind, examOrSourcePath, sourceQid, uid, sourceSha, publicationState, problemVisual:{necessity,disposition,benefitReason,existingAssetPath,assetSha,expectedFacts,observedFacts,renderEvidence}, solutionVisual:{necessity,disposition,benefitReason,newVisualInformation[],existingAssetPath,assetSha,expectedFacts,observedFacts,renderEvidence}, action, assetReferenceParity, dispositionReason, owner, closureStatus}`.

현행 Source/Consumer/Index 실제 스키마를 재사용하고, 감사 ledger는 **비프로덕션 sidecar**를 기본으로 한다. JSON 스키마/Runtime 필드를 확인 없이 신규 추가하지 않는다.

보고 분모: `totalDistinctUID / sourceUidMissing / problemRequired / problemOptional / problemExempt / solutionRequired / solutionOptional / solutionExempt / missingAssets / addQueued / rebuildQueued / existingKept / SVGCreated / mathPrimitiveVerified / actuallyRendered / consumerIndexParity / technicalClosed / HOLD / NOT_ASSESSED`. **문제·해설 별도 분모가 전체 고유 UID와 같아야 한다.** 처리 불가 UID만 정확한 사유로 별도 추적. 동일 source와 consumer 중복, 같은 UID의 여러 모의고사 사용을 중복하지 않는다.

## 6. 신규 ALIVE/QID9 제작에 대한 즉시 적용

- A1~C3 **각 UID 생성 시**, 문제/해설 시각 필요성 두 축을 개별 판단·기록한다. 기존 QID9의 `studentVisual=NOT_REQUIRED_TEXT_ONLY`는 **학생 발문(문제) 자체의 그림 불요 여부만** 증명하며, 해설용 SVG EXEMPT 근거로 쓸 수 없다.
- 팔마고 q17(대칭이동/최단경로), q18(무게중심·면적), q19(원·반원호·접선·교점 개수)는 **9×3=27개 신규 문항에 대해 문제/해설 독립 판정 우선 재감사 대상**. 해설 도형이 실제로 새 결정 관계를 전달하면 SVG를 생성한다. q19의 `SOLUTION_VISUAL`은 이미지 없음=EXEMPT로 자동 처리 **금지**. 초기 q19 해설 SVG 0/9는 **파일 부재 확인일 뿐 9/9 시각 필요성 판정 완료가 아니다**.
- 최종 패키지의 `visual` 또는 sidecar에 `problemNecessity`와 `solutionNecessity`·`solutionDisposition`·필요한 `solutionImage` 참조·수학 facts를 기록한다. 실제 제품 schema가 허용하지 않는 가짜 필드는 별도 증거 JSON만 사용.
- **원본 1개마다 독립 commit·시험지 단일 브랜치**, 이전 UID/기출/승인분을 임의 재제작 금지. 새 제작의 출시 요건을 충족 못 하면 `VISUAL_HOLD` 상태로 진도 ledger에 남긴다.

## 7. 즉시 착수 순서 (신규 작업이 아닌 기존 전수조사)

1. Git latest main을 fetch, 본문 아래 **Baseline 문서**에서 출발해 실제 Source/Consumer/Index URL과 전체 등록 UID를 inventory·dedup. 최신년도→과거년도, 현재 출시/생성중을 구분한다.
2. **문항별 전수 visual 필요성 평가** (기출+Generated+타입/교재 포함). 높은 우선순위: 사고핵심이 도형/좌표/함수 그래프/원·접선·대칭인 문항, 기존 이미지 누락·SVG 404, 도형적 해설인데 학생이 볼 시각자료가 없는 문항.
3. 제작은 **판정된 누락 UID만** 대상으로 기존 스킬·지원 엔진을 사용하여 수행. 군집 단위 효율적으로 병합하되 영향 범위만 검증.
4. 학생 문제·해설 실제 엔진 화면과 Archive2 Consumer·검색·출력 검증, SHA와 통계 업데이트. MAIN_DONE/visual PASS는 실제 검사 완료 후 선언.
5. 향후 신규 제작 worker가 visual 두 축을 빠뜨리지 않도록 QID9/Codex/GPT 진입점에서 이 문서를 필독. 이후 실제 audit ledger의 UID별 결손 건수를 기반으로 우선순위 조정.

**Baseline (파일 수준만 선확정):** `docs/reports/problem-bank-visual-audit-20261010/00_SCOPE_AND_FILE_INVENTORY.md`. 특정 UID의 필요 판정·실제 자산 렌더는 별도 수행 필요. 오래된 보고서를 기준으로 누락률을 단정하지 않는다.
