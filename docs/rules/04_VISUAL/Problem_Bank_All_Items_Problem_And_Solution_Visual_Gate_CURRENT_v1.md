# 문제은행 전 문항 문제·해설 시각자료 전수조사 및 필수 SVG 제작 게이트 — CURRENT v1.0

> 2026-10-10 사용자 직접 지시. **팔마고만이 아니라 문제은행 전체**: 학교 기출, ALIVE/Generated 제작 후보·승인 문항, 문제은행 학생 검색/출제 대상으로 들어가는 교재/평가문항에 적용. 대상 파일의 실제 작업이 끝나기 전까지 전체 완료를 선언하지 않는다. 이번 문서 커밋은 **POLICY_ONLY / FULL_INVENTORY_NOT_RUN / ASSETS_NOT_REBUILT**이다.

## 0. 변경 이유·최상위 결론

- 문제용 SVG가 필요할 때뿐 아니라, **해설 과정에 독립적인 학습 효과를 주는 SVG가 필요한 때에도 반드시 실제 생성·연결·검증**한다. `text-only stem`·`그림 없이 정답을 구할 수 있음`은 해설 SVG 생략 근거가 아니다.
- 원본 문제 그림을 복사해 해설 SVG 대신 붙이는 것은 새 보조선·접점·사례 비교 등 **결정적 새 정보가 실제로 추가되지 않는 한** 시각자료 보강으로 보지 않는다.
- 모든 문항을 무조건 SVG로 만들지 않는다. 원본 문제 PNG가 정확하고 충분한 경우에는 해당 문제 그림을 보존한다. 문제용/해설용 각 surface의 **EXEMPT에는 문항별 교육적·수학적 이유**가 있어야 한다.
- `필요` 판정 후 `SVG 없음`, `SVG 파일만 존재`, `source만 수정되고 Consumer/화면 미연결`은 각각 완성이 아니다. 신규 출시 게이트는 실제 SVG·의미 정합·학생용 경로·렌더/검증 증거로 닫는다.
- 기존의 품질승인·MAIN_DONE을 전수조사 이전이라는 이유만으로 일괄 취소하거나 기존 source UID를 바꾸지 않는다. 과거 승인문항의 시각자료 부채는 **UID별 보정 대상**으로 추적하고 해당 자료만 증분 보강한다.

## 1. 정본 재사용 — SVG 규칙·엔진 새로 만들지 말 것

1. **시각 제작 단일 진입:** `.codex/skills/apmath-visual-upgrade/SKILL.md`, 특히 `PROBLEM_VISUAL` / `SOLUTION_VISUAL`, `VISUAL TRIAGE`, `MARGINAL BENEFIT`, `BACKEND ROUTER`, Golden/Negative calibration, actual SVG parity, browser render.
2. **표준 수학·조판·품질:** `docs/rules/04_VISUAL/도형추출.md`, `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`, `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md`.
3. **생성문항:** `alive/04_VISUAL/ALIVE_VISUAL_SPEC_v0.1.md`, `alive/04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md`; `alive/05_DESIGN/ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`의 분류 참고. 이 2-Pass 문서의 `graphSpec` 필드는 **제안/파일럿**일 수 있으므로 현행 런타임 스키마로 거짓 간주하지 않는다.
4. **현존 구현:** `alive/engine/visual_renderer.py`의 `render_visual_spec` / `render_visual_file`; 지원 `coordinate_plane`, `simple_function_graph`, `segment_geometry`, `polygon`, `circle`, `circle_geometry`, `table`. `alive/engine/visual_lane.py`에는 staging SVG validation·materialization 경로가 있다. **원호·태극형 겹침·해설 Consumer 삽입 등 세부 capability는 각 입력에 대해 테스트하기 전에는 지원한다고 주장하지 않는다.** 미지원이면 기존 SVG backend의 확장 또는 독립 deterministic SVG 경로를 검토하되 새 엔진 중복 제작을 금지한다.
5. 문제은행 Source/Consumer/UID/원본 direct-open/Meta 정본은 `docs/architecture/Problem_Bank_Storage_And_Retrieval_Current_v1.md`; 출시·문제 수정 책임은 `docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md`.

문서 간 우선순위는 **사용자 최신 지시 → 본 전 문항 coverage/requirement → visual 전문 canonical의 제작·검증 세부 → 기존 구현과 런타임 사실**이다. 기존 'optional'이 수학적으로 불필요한 그림 전부를 강제한다는 뜻으로 확대하지 않는다.

## 2. 전수조사 범위와 분모 — 모든 UID × 두 surface

### 대상

- `archive/exams/original/**/*.js` 학교 기출의 **실제 각 qid** (중1~고3, 모든 연도·학교·학기·과목). `window.questionBank`에서 원문 `content/choices/answer/solution/image/solutionImage`와 자산의 존재를 확인한다.
- `archive/generated/lite/**/shards/*.js`·metadata/manifest의 실제 **ALITE 생성 UID** 및 `alive/06_EXECUTION/**`의 원본별 QID9 후보. 후보/검수/승인/보류 상태를 분리한다.
- `archive/data/generated-lite-consumer/v1/index.json` 및 실제 shard의 **승인 학생용 Generated UID**. Source와 Consumer는 UID로 중복 제거하되, 두 경로의 자산 연결은 각각 확인한다.
- 실제 문제은행에 등록되어 학생·교사·Factory 제품에서 선택되는 기타 교재·평가문항. 외부 원본 PDF만 있고 아직 DB에 인테이크되지 않은 자료는 **not-ingested 별도 분모**, 등록 문항과 섞지 않는다.
- 문제의 그림, 해설의 그림, 기존 SVG/PNG/그래프/표, 문제 이미지만 있고 해설 그림이 없는 경우 **전부** 포함. `source exam picture exists`는 `solution picture exists`의 증거가 아니다.

### 개수 확정 규칙

- 먼저 Git main SHA와 branch/candidate snapshot을 기록한 inventory를 동결한다. `examCount`, `examQuestionCount`, `generatedSourceUidCount`, `generatedConsumerUidCount`, `candidateUidCount`, `dedupedUniqueQuestionUidCount`, `PROBLEM` 분모, `SOLUTION` 분모, 누락/보강 대상을 분리한다.
- 각 UID는 **문제 1행 + 해설 1행**으로 기록한다. SVG 개수가 문항 개수와 같아야 하는 것은 아니다(한 UID 다중패널 가능). 원문 이미지와 작업 증거 PNG/SVG를 학생용으로 이중 집계하지 않는다.
- 존재여부 정적 검사와 내용을 읽은 **교육적 필요성 판정**, 수학 SVG 검수와 실제 제품 렌더 검수는 서로 다른 열로 저장한다. `solutionImage==null`만으로 누락 FAIL이라고 단정하거나 `*.svg` 파일 존재만으로 PASS라고 단정하지 않는다.
- 분모를 고정한 후 모든 UID·두 surface를 **전수 판정**하되, 이미 PASS한 다른 수학/해설 전체를 무차별 재검수하지 않는다. 확정된 누락·결함 UID만 수정한다.

## 3. 문제와 해설 각각의 필수 분류

| surface | REQUIRED — 없어서는 안 됨 | BENEFICIAL — 학생 이해를 실질적으로 개선 | EXEMPT — 정당한 미생성 |
|---|---|---|---|
| `PROBLEM_VISUAL` | 그림에서만 읽을 수 있는 조건·도형 위치/길이·눈금·음영·표·그래프·교점이 풀이에 필수 | 학생의 조건 해석에 실질적 도움을 주고 원문 fidelity/공개정보를 해치지 않음 | 텍스트·수식이 문제 조건을 완전하고 자연스럽게 전달하며 그림은 장식이거나 중복 |
| `SOLUTION_VISUAL` | 해설의 핵심 결정 관계(접선·보조선·닮음·원과 직선·그래프·분할·변환·공간/구간 topology)가 도형 없이 오해되거나 따라 하기 어려움 | 그림 없이 계산할 수 있더라도 **최적점·교점 분기·접점·경계·변환 전후·보조선·넓이비·영역** 등을 시각화하면 이해·재현이 명확히 좋아짐 | 단순 대수 계산·원소 나열 등 결정적 새 공간/구조 관계가 없거나, **기존 유효한 문제/해설 그림이 모든 결정 관계를 충분히 보여 주고 추가 정보가 전혀 없는 경우** |

**실행 결정**
- `REQUIRED` / `BENEFICIAL`이면 `KEEP_EXISTING_VERIFIED`, `NEW_SVG`, `REPAIR_SVG` 중 반드시 학생용 요구를 충족하는 action을 선택한다. 그 필요를 기존 원본 고품질 raster가 이미 온전히 충족하면 `KEEP_EXISTING_VERIFIED_RASTER`로 특별히 증명하고 **불필요한 SVG 중복 금지**. 그렇지 않으면 **SVG 생성·수리 필수**다.
- `EXEMPT`는 `reason`이 비어 있으면 INVALID. `TEXT_ONLY`와 `EXEMPT`를 해설에서 자동 연결하지 않는다.
- 이미 문제에 있는 기초 도형을 해설에서 단순 복제하지 않는다. 신규 해설 SVG의 `newVisualInformation[]`에 보조선·접점·결정 관계·case panel·구간 경계 중 **실제 추가 사실**을 명시한다.
- `PROBLEM_VISUAL`은 답·정답 강조·해설 과정 노출 금지. `SOLUTION_VISUAL`은 한국어·디지털 학습용, 의미 있는 단계/2-panel 등을 허용하며 계산식 카드만으로 기하학적 관계를 대체하지 않는다.
- 시각의 필요성은 태그(기하/원/함수 등), 기존 `image` 유무 또는 작성자의 "그림이 불필요하다"라는 요약으로 결정하지 않는다. **발문+보기+정답+완성된 해설+참조자산의 실제 결정 관계**를 읽어서 판단한다.

## 4. 제작·연결·출시 순서

1. **Inventory**: 현재 Git main과 진행 중인 원본별 브랜치, source/consumer index/uid/asset 참조를 전수 수집하고 stage 상태 기록.
2. **Triage**: UID별 문제/해설 각각 `REQUIRED|BENEFICIAL|EXEMPT`, 판단 근거·기존 에셋 충족 여부·현재 누락 여부를 고정. `VISUAL_EXEMPT` 사유의 반복 패턴도 표본 아닌 **전 UID**에서 확인.
3. **Math freeze**: original 또는 generated 문항의 검증된 원본/최종 풀이로 좌표·반지름·교점·접선·각·길이·경계·라벨 owner 등 `expectedFacts[]`를 SVG 만들기 전에 고정. 고1 범위 밖 벡터·미분·삼각함수 항등식 등 금지.
4. **Renderer route**: 기존 visual skill로 `STANDARD_SVG|MINIMAL_EXAM_DIAGRAM|COMPOSITE_PANEL|FUNCTION_GRAPH|NUMBER_LINE|TIKZ_SPECIAL|PGFPLOTS_SPECIAL|RASTER_KEEP` 선택; 실제 `visualSpec` schema/backend 지원 검증. 원호는 원의 primitive만 있다고 자동 PASS 아님.
5. **Generate / reuse / repair**: UID collision 없는 자산 경로, 신규 qid 조건을 반영한 geometry, 실제 student-facing `image` / `solutionImage` 혹은 해당 Generated runtime 지원 필드에 등록. **기출 원본 image는 불필요하게 재구성·삭제 금지**.
6. **Visual math**: SVG 최종 바이트에서 좌표·교점·접점·부호/반원 방향·길이·라벨 및 전후 도형 관계를 다시 관측 계산한다. `expectedFacts[]`와 `observedFacts[]` 독립 대조, XML parse, SHA256 + Git blob SHA, 실제 도형 구조. `문자만 맞음` 또는 자동 PASS 자기보고 금지.
7. **Actual student render**: 최종 바이트가 읽히는 Archive 1 `exam/sol/ans` 또는 Generated 학생 검색·선택·해설/출력 화면에서 이미지 경로, 크기, clip, 겹침, 수학 glyph를 검사한다. 해설 기하 변경은 canonical의 **desktop solution render** 요구를 따르고 최종 CSS 라벨 11px 미만 FAIL. 브라우저 불가시 `RENDER_PENDING`으로 기록하고 가짜 PASS 금지; 생성·정적 증거 작업은 멈추지 않음.
8. **Release**: 신규 후보는 기존 품질승인 및 Meta/source→Consumer/index 계약과 SVG 필요 게이트를 모두 충족한 UID만 학생 공급. 이미 승인된 legacy UID는 개별 visual 부채 repair와 증분 index/Chrome 마감, 기존 무관한 승인본·출력 경로 불변. 병합 후 main SHA remote readback.

작업자는 'SVG 필요성 보고'만 하지 말고 **자신의 승인 범위 안에서 바로 제작·수리하고 완료 증거를 수납**한다. 도구/권한/지원 범위로 인한 불가만 정확한 UID·backend·first missing step을 `OPEN_WITH_EXACT_BLOCKER`로 남긴다.

## 5. 전수 ledger 스키마(후속 감사 산출물; 현재 생성된 검사 결과로 간주 금지)

```json
{
  "snapshotMainSha": "GIT_MAIN_SHA",
  "questionUid": "qid_v1_OR_ALITE_UID",
  "sourceKind": "ORIGINAL_OR_GENERATED_OR_OTHER_BANK_ITEM",
  "sourcePath": "SOURCE_FILE",
  "sourceSha": "ACTUAL_SHA",
  "studentSurface": "PROBLEM_OR_SOLUTION",
  "need": "REQUIRED_OR_BENEFICIAL_OR_EXEMPT",
  "reason": "VISIBLE_DECISIVE_RELATION_OR_EXEMPT_EVIDENCE",
  "newVisualInformation": [],
  "assetAction": "KEEP_EXISTING_VERIFIED_OR_NEW_SVG_OR_REPAIR_SVG_OR_EXEMPT",
  "assetRef": "REAL_STUDENT_RESOLVED_PATH_OR_NONE",
  "assetSha256": "ACTUAL_SHA_OR_NOT_BUILT",
  "actualRenderer": "VERIFIED_IMPLEMENTATION_OR_UNSUPPORTED",
  "expectedFacts": [],
  "observedFacts": [],
  "semanticParity": "PASS_FAIL_NOT_TESTED",
  "studentRender": "PASS_FAIL_RENDER_PENDING_NOT_TESTED",
  "sourceConsumerIndexParity": "PASS_FAIL_NOT_APPLICABLE_NOT_TESTED",
  "status": "INVENTORIED_TRIAGED_BUILD_REQUIRED_STATIC_VERIFIED_RENDER_PENDING_DONE_EXEMPT_OPEN_WITH_EXACT_BLOCKER"
}
```

실제 감사에서는 한 UID의 문제·해설 행을 모두 생성하고, `REQUIRED/BENEFICIAL` 대비 `DONE/KEEP_VERIFIED/BUILD_REQUIRED/OPEN` 집계를 surface별로 낸다. `reviewStatus`와 학생 `qualityApproval`은 별도 컬럼으로 유지. 확정 문항의 qid/UID·L1~L4·오답·답·해설 텍스트를 SVG 보강 목적으로 임의 변경하지 않는다.

## 6. 우선순위·대표 회귀·현 시점 기술 사실

- 우선 ① 신규 제작/신규 출시 중인 **시각부채 UID**, ② 승인된 기출/Generated 중 결정 관계·교점·접선·삼각형·그래프 해설 누락, ③ 나머지 문제은행 전 표본 **전수 분모**로 순회. 이 우선순위는 나머지를 생략한다는 뜻이 아니다.
- **2025 팔마고 고1 2학기 중간 QID19 9개 A1~C3**: 생성 package의 `studentVisual=NOT_REQUIRED_EXACT_ARC_EQUATIONS`는 **문제용 조건 충분성 판정**이지 해설 `SOLUTION_VISUAL=EXEMPT` 증거가 아니다. 원·반원호·직선이 접하면서 교점 수가 바뀌는 해설은 독립 `SOLUTION_VISUAL` 전수 triage 대상. 신규 자산·브라우저 QA가 실제 생성되지 않았다면 `DONE` 금지. Q09~Q18 등 같은 팔마고 나머지도 동일 기준을 전수 점검.
- 기존 repository snapshot: 2026-10-10 Git main `8c2d28b68a14e6b8cdd1e2ecda35f8a5809696ad` tree 목록 기준 학교 기출 JS **451파일**, `archive/assets/images/**/*-solution.svg` **2,142파일**, `archive/assets/generated-lite/*.svg` **14파일**. 이는 **file inventory only**이며 전 문항 denominator·누락 수·SVG PASS 수·실제 렌더 수가 아니다. 본 문서만으로 전체 audit 완료·기존 SVG 검수 완료 선언 금지.
- `alive/engine/visual_renderer.py`는 일부 시각 도형·렌더 단위 기능이 실제 존재한다. 그러나 `alive/05_DESIGN/ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`의 Generated-to-Archive2 graph runtime 연동은 디자인 단계로 기록되어 있다. **엔진 파일 존재 ≠ 모든 시각 유형 지원 ≠ Consumer 자동 연결 ≠ 학생 화면 PASS**.
- 첫 전수조사 후 결과는 고정 분모·surface별 판정·UID별 첫 결함·수리 경로·SHA/렌더 근거가 포함된 별도 `FULL_AUDIT` ledger로 작성한다. **본 정책 도입 커밋에서는 전수 조사·SVG 보강·학생용 등록을 실행했다고 주장하지 않는다.**
