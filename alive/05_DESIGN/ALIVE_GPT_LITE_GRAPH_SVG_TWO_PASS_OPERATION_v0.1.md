# ALIVE LITE 그래프 문항 생산·SVG 2-Pass 운영 규정 v0.1

작성일: 2026-10-08 KST
상태: DESIGN + 효천고 14·15번 생산 파일럿 실행 기준 / 정식 SVG renderer 및 Archive2 연동은 미구현
상위: ALIVE_GPT_LITE_GENERATION_FIRST_EXECUTION_v0.6.md, ALIVE_GPT_LITE_MASS_EXPANSION_WORKER_CONTRACT_v0.3.md, ALIVE_GPT_LITE_CURRICULUM_HARD_GATE_v0.4.md
보호: original/types/similar, RPM Primary LOCKED 정본, FULL seal, Archive1 직접열기·기존 Chrome/render 계약을 수정하지 않는다.

## 1. 핵심 정책
- 생성은 **원본 문항별 자율 대량 확장**(0~다수), 원본 1개당 1개 강제 금지. 숫자변형과 새로운 풀이 Blueprint 수는 별도 집계한다.
- 먼저 각 생성 문항의 실제 학생 입력과 풀이에 그림이 **정말 필수인지** 분류한다.
  - TEXT_ONLY: 식·조건을 발문에 완전히 제공하며 시각자료 불필요. 일반 one-pass.
  - VISUAL_REQUIRED: 그림의 좌표, 교점, 위치관계, 눈금, 음영·표식을 읽어야 풀 수 있음. 아래 two-pass 필수.
  - VISUAL_OPTIONAL: 그림 없이도 내용이 완전히 특정되면 식 기반 문항은 일반 생산 가능. 그림 포함하는 SKU는 별도 visual QA.
- **원본에 그림이 있다는 이유로 모든 변형에 SVG를 강제하지 않지만, 원본 그림을 삭제해 조건이 빠진 문항은 허용하지 않는다.**
- VISUAL_REQUIRED의 SVG 자산이 아직 없거나 실제 검수를 통과하지 않았다면 학습자·모의고사 공급용 PASS 불가. TEXT_ONLY와 구분해 HOLD_VISUAL 상태를 별도 sidecar에 기록한다.
- 고1 문항/해설/SVG 명세는 고1 해당 학기 이수 범위 안의 개념만 사용한다. 미분, 벡터, 고2 삼각함수 공식 등 상위 학년 개념으로 그래프를 계산하지 않는다.

## 2. Two-pass 정의
Pass 1 — GPT 출제자 원패스:
1. source qid와 실제 source image 경로/SHA를 기록하고 시각적 조건을 읽는다. 읽지 않았다면 SOURCE_VISUAL_NOT_READ.
2. 여러 의미 Blueprint를 탐색하고 문항별 발문·5지 보기·정답·학생용 완전한 solution·L1~L4/확장 L4 후보/난이도/CrossConcept/Condition/Integration을 함께 확정한다.
3. VISUAL_REQUIRED일 경우 실제 함수/점/축·범위/표시/라벨/학생에게 공개해야 할 정보/공개하면 안 되는 정보까지 **graphSpec**으로 명시한다.
4. graphSpec에서 도출되는 수학 사실과 발문·해설·정답이 일치하는지 확인한다. **출제 후 이미지가 정답을 누설하거나 발문에 없는 추가 조건을 암시하게 하지 않는다.**
5. JS 후보와 graphSpec/메타/해설을 L2별 staging shard에 저장하되 렌더되지 않은 visual 후보는 출제 불가로 표시한다.

Pass 2 — deterministic SVG 제작·검수:
1. 실제 renderer가 인지하는 **지원된 graphSpec schema/template**를 확인하고, 지원 안 되는 template 키를 만들어 기존 엔진이 처리한다고 주장하지 않는다.
2. graphSpec -> SVG 생성, 실제 생성한 경로·문항 UID/asset SHA 결속. 필요하면 독립 SVG 제작기로 재현.
3. 축·원점·눈금·곡선/직선/절편·교점 좌표·라벨·선/점 스타일·화면 잘림·비율/표시범위 등을 시각적으로 확인한다.
4. 렌더된 **학생용 문제+SVG**를 독립 수학검수자가 처음부터 풀어 답/보기 유일성 동결 후 해설과 비교한다.
5. Archive 실제 exam/sol/ans 및 asset reference를 열어 확인한다. 미실행 시 RENDER_NOT_TESTED. 조건 통과 후에만 대체문항 적격성 별도 심사.
6. 변경된 문항/SVG와 직접 의존 부분만 재확인. 반복적으로 전 문항을 재검하지 않는다.

## 3. graphSpec·asset 단위 계약 (새 제안, 현재 런타임 schema로 간주 금지)
- graphSpec: generatedQuestionUid, graphFamily, domain/range, axis/tick rules, canonical function coefficients, points/intersections/labels, visibility constraints, intended student readable facts, graphSpecRevision, reference source, graphQA state.
- `graphTemplateKey`는 실제 등록된 템플릿만 할당한다. 미지원이면 `RENDERER_TEMPLATE_UNRESOLVED`와 신규 deterministic renderer 구현 필요로 표기.
- 시각자산 이름은 generated UID에서 도출해 batch 간 충돌 방지. JS의 최종 `image` 경로는 실제 제품 asset resolver 상대경로와 맞춘다. sidecar의 논리적 경로를 JS `image`에 그대로 복사해 유효하다고 선언하지 않는다.
- 같은 수학 graphSpec에서 svg를 다시 생성해도 기하적 사실이 불변인지 확인한다. 사용한 curve와 axis/점의 실제 좌표 일치, 원본 자산 위·변형/학교 출처 혼동 금지.
- 저장 상태: `MATH_META_DRAFT -> GRAPH_SPEC_READY -> SVG_GENERATED -> VISUAL_QA_VERIFIED -> ARCHIVE_RENDER_VERIFIED -> QUALITY_ELIGIBLE_REVIEW`. 이는 파일럿 보고용 상태명이다. 다음 상태를 미실행 PASS로 간주하지 않는다.

권장 물리 루트:
```text
archive/generated/lite/v1/<curriculum>/<grade>/<L2-key>/
  shards/<batch>.js
  metadata/<batch>.json
  graph-specs/<generatedUID>.json
  svg/<generatedUID>.svg
  evidence/<generatedUID>.json
  manifest.json
```
Runtime이 SVG를 읽는 실제 경로와 template 지원은 **구현 전 확인** 사항. Git 후보 저장 ≠ 실제 Archive2 DB index/학생 공급.

## 4. 효천고 14·15번 실제 실행 계획

Source: `archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js`, q14/q15.
현재 원본 문항의 실제 수학 facts:
- q14는 **이미지 없는 복소수·실수계수 이차방정식 결합** 문제. `z-3`과 `z-3i`가 각각 지정한 이차방정식의 근이라는 조건으로 `a+b`를 묻는다. 원본은 **TEXT_ONLY**. 출제자가 복소평면 도해가 필수인 신규 Blueprint를 설계하지 않는 한 SVG를 강제하지 않는다.
- q15는 그래프 `assets/images/26_효천고_1학기_중간_고1_기출/q15.png`를 참조하며, 현재 JS 발문·해설에서 x절편 **1, 3**을 사용하고 `f(x-a)=0`의 근 `a+1, a+3`을 얻는다. 원본 실그래프 이미지를 직접 열어 확인하기 전까지 원본의 모든 시각 사실을 확인했다고 말하지 않는다.
- 원본 q15의 현재 발문은 x절편 **1, 3**을 괄호로도 명시한다. 그로부터 본질적으로 그래프 없이 해결 가능한 **TEXT_ONLY** 변형은 SVG 없이 생성할 수 있다. 다만 그림을 보고만 알 수 있는 조건을 요구하는 **VISUAL_REQUIRED** 변형은 graphSpec+SVG 필수.
- q15 L2/ RPM L3/L4는 **새로 생성된 최종 문항의 실제 주풀이**로 정본 crosswalk 조회. 원본 q15의 오래된 `subUnitKey=H22-C-05-FUNCTION_BASIC`을 최종 generated L2로 무조건 복사하지 않는다.

### 배치 P1: q14 일반 생성
1. 본문 기반 가능한 L3-locked 다수 Blueprint 선택(조건식/켤레복소수/근의 조건 등의 실제 판정 우선).
2. 5지선다·정답·해설·작성자 메타·교육과정 guardrail 작성.
3. L2 shard/meta, 학교마커/qid, UID/원장 readback. 독립 수학검수는 별도.

### 배치 P2: q15 시각 등급 분류 후 생성
1. 원본 `q15.png`를 실제 열어 시각적 source facts freeze. 현재 JS의 x절편 설명만으로 전체 이미지 내용을 확인했다고 주장 금지.
2. 그래프 없이 충분한 신규 문항은 TEXT_ONLY batch에서 즉시 완성. L2/실제 RPM 메타 기록.
3. 그림 필수 신규 문항은 math+meta+graphSpec 후보를 먼저 만들고 UID별 visualRequired/graphSpecPath를 기록한다.
4. graphSpec 기반 deterministic SVG 생성 후 geometry·labels·render QA를 별도 실행. 원본 그래프를 통이미지로 무조건 재활용하지 않는다.
5. 비시각 후보와 시각 미완성 후보의 accepted/eligible 집계를 분리한다. **VISUAL_REQUIRED + SVG 없는 문항은 모의고사 대체 후보 공급 금지**.

## 5. 파일럿 보고·검증 분모
- sourceQids=2, q14/q15별 candidateCount, actualDistinctBlueprintCount(검증 전이면 proposed), TEXT_ONLY, VISUAL_REQUIRED, graphSpecReady, svgGenerated, visualVerified, independentMathVerified, archiveRenderVerified, registered.
- Math/Meta/Visual 각 gate의 서로 다른 증거 SHA 기록. renderer/template/원본 이미지 조회 도구가 미지원이면 해당 단계 NOT_TESTED로 유지하고 정상 다른 문항 작업을 지속.
- 최종 DB/교사 모의고사 등 제품 연결은 후보 수와 독립·시각·엔진 검수가 충분해진 이후 수행.
