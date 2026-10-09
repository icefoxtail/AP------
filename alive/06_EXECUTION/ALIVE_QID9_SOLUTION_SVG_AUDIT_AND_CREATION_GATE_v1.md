# ALIVE QID9 해설 SVG 전수조사·생성 단계 강제 연결 v1.0

> 2026-10-10. 작업 유형 **문서화 + 정적 조사 원장 작성**, 실제 SVG 생성/수정/렌더/학생 등록/운영병합은 이번 작업에 포함하지 않는다. 기준 통합 브랜치 `work/alive-25-palma-h1-2mid-qid9`, HEAD `b44af6ed89445f7c4fb0ad42cf0b2ce64f549a6c`. 작업 이후 새 qid는 분모를 새 SHA로 다시 산정한다.

## 1. 왜 해설 SVG가 빠졌는가

팔마고 q19의 9개 generated 문항은 큰 원·반원·직선·접선·교점 수를 해설하지만 해설용 SVG가 0/9였다. 신규 패키지에서 `studentVisual=NOT_REQUIRED_TEXT_ONLY`로 **문제용 그림은 없어도 풀이 가능한 상태**임을 표시하면서, **학생이 해설에서 공간 관계를 이해할 교육용 그림의 필요성**은 별도로 판정하거나 자산을 연결하지 않았다. 이 간극은 신규 CREATE flow의 *원인 후보*다. 실행 코드/Consumer/실렌더 경로의 정확한 원인 확정은 별도 기술 검사 필요.

필수 분리: `PROBLEM_VISUAL`(문제 조건 정보) ≠ `SOLUTION_VISUAL`(해설 중 결정적 구조를 보이는 자료) ≠ `SYSTEM_VISUAL`(공통 엔진·UI). **문제용 TEXT_ONLY는 해설 SVG 면제 근거가 아니다.** 모든 generated 문항에 장식 SVG를 강제하지도 않는다.

## 2. 이미 있는 규칙·엔진을 재사용한다

1. **단일 입구:** `.codex/skills/apmath-visual-upgrade/SKILL.md` — problem / solution 시각자료, 기존 Golden·Negative calibration, 결정적 geometry 우선, backend routing, final SVG physical evidence 및 실렌더.
2. **최종 스타일·정합성:** `docs/rules/04_VISUAL/도형추출.md` v3.0 + `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`(v1.2 좌표 parity 부록). 원·직선·도형의 이동 등 실수 도형이 있고 교육 효과가 있는 해설용 시각화를 기본으로 하며, source+독립 수학 fact+해설과 actual SVG 좌표/위상을 대조. label 크기·충돌·잘림/인쇄 질도 판정.
3. **ALIVE:** `alive/04_VISUAL/ALIVE_VISUAL_SPEC_v0.1.md` (NONE/OPTIONAL/ESSENTIAL), `alive/04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md`, `alive/05_DESIGN/ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`. 마지막 문서의 TEXT_ONLY/VISUAL_REQUIRED는 기본적으로 **문제용 그래프 공급**의 two-pass이고 해설용 시각화 판정을 대체하지 않는다. 미구현이라고 적힌 기능은 ACTIVE로 간주 금지.
4. **기존 SVG 제작기:** `archive/tools/geometry-equation/visual_engine/`의 `visual_spec.schema.json`, `geometry_model.py`, `engine.py`, `svg_composer.py`에 POINT/LINE/CIRCLE/**CIRCULAR_ARC** 등 객체가 존재; `alive/engine/visual_renderer.py`의 `circle_geometry`·circles·lines·curves와 `visual_lane.py`도 존재. **코드와 schema의 존재가 모든 반원/복잡한 해설의 생산·검수·학생 노출 ACTIVE 증거는 아니다**. 전자 중 `archive/tools/geometry-equation/production/README.md`는 별도의 construction flow를 experimental이라고 명시하므로 본 작업에서 자동 출시 자격을 주장하지 않는다.
5. **기존 기출 SVG 조사기:** `archive/tools/high1-svg-audit/build-exhaustive-inventory.mjs`는 기출 JS 대상. QID9 신규 JSON/Markdown으로 범위를 바꾸지 않고 오판하지 않도록 UID별 adapter와 이 원장을 사용한다.

신규 SVG 엔진 개발·별도 렌더규칙 복제 금지. 기존 skill이 **학습용 해설 장면 선정 → 지원 backend/asset capability 판단 → fact 기반 SVG → 독립 geometry/렌더 gate**를 라우팅하도록 한다.

## 3. 2026-10-10 스냅샷 180 UID 전수 정적 현황

- manifest q01~q20, 각 A1~C3 **180 UID**; UID 중복 0. 아직 작성되지 않은 원본 q21~q23 제외.
- **q04~q20 JSON 153/153**에서 해설 전용 `solutionImage/solutionSvg/solutionVisual` 등의 직접 연결 또는 해설 본문 SVG 링크를 발견하지 못함. 단, **원본 후보 패키지의 직접 링크가 0개라는 정적 결과**이며 학생용 Consumer에서 다른 단계에 삽입한 visual까지 불변하게 0이라고 단정할 수 없음.
- q01~q03 **27 UID는 초기 Markdown 초안**. 타입 필드가 없어 해설 SVG 연결의 전체 소비자 상태는 `UNKNOWN`; 별도 Consumer/실제 asset readback 대상.
- q10 SVG 4개는 `studentVisual.type=PROBLEM_VENN_SVG`인 **문제용**(A1/A2/A3/B2); 해설 그림으로 집계하지 않음. q10 근처 B02 legacy 후보 SVG 두 파일은 별도 경로이며 신규 QID9 학생용 해설 링크를 뜻하지 않음.
- 원·좌표·직선·무게중심·이동 관련 q03/04/05/06/07/09/12/15/17/18/19 = **99 UID 우선 판정 집단**. 아직 전부 SVG 필요라고 승인된 것은 아님. 나머지 **81 UID**도 집합 논리·벤·수직선 등 실제 학습 효용을 개별 판정.
- 180 UID 학생 Consumer solutionImage 및 index parity, SVG 물리 geometry QA, Chrome 학생 실제 해설 모드는 **이번 실행에서 NOT_TESTED**. 이미 승인/출시된 문항의 기존 승인 상태를 뒤집지 않는다.

| 원본 | UID | 단원·사고(1차) | 후보 해설 SVG 링크 | 기존 문제 SVG | 해설검토 순위 |
|---|---:|---|---|---:|---|
| q01 | 9 | 집합·명제·기타 | 미확인(MD) | 0 | 개별 |
| q02 | 9 | 집합·명제·기타 | 미확인(MD) | 0 | 개별 |
| q03 | 9 | 원의 방정식 | 미확인(MD) | 0 | 상 |
| q04 | 9 | 평면좌표·거리 | 0/9 | 0 | 상 |
| q05 | 9 | 직선의 방정식 | 0/9 | 0 | 상 |
| q06 | 9 | 원과 직선 | 0/9 | 0 | 상 |
| q07 | 9 | 평행이동 | 0/9 | 0 | 상 |
| q08 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |
| q09 | 9 | 무게중심 | 0/9 | 0 | 상 |
| q10 | 9 | 집합·명제·기타 | 0/9 | 4 | 개별 |
| q11 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |
| q12 | 9 | 원의 접선 | 0/9 | 0 | 상 |
| q13 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |
| q14 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |
| q15 | 9 | 이동의 합성 | 0/9 | 0 | 상 |
| q16 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |
| q17 | 9 | 대칭이동 | 0/9 | 0 | 상 |
| q18 | 9 | 삼각형의 무게중심 | 0/9 | 0 | 상 |
| q19 | 9 | 원과 직선·반원호 | 0/9 | 0 | 상 |
| q20 | 9 | 집합·명제·기타 | 0/9 | 0 | 개별 |

상세 **180행 UID 원장**: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_SOLUTION_SVG_STATIC_INVENTORY_20261010.json`. 각 UID의 original qid·slot·source doc/git blob·source direct solution SVG 링크·problem SVG 역할·우선순위·미수행 검사 상태를 기록. 이 정적 원장을 최종 수학 검수/Chrome PASS로 바꿔 부르지 않는다.

## 4. 진짜 전수조사 작업 순서

**각 UID를 실제 학생 해설 기준으로 판정**하되, 기본 질문은 “도형을 추가로 보여줘야 핵심 해설을 더 잘 이해하는가?”이다. `studentVisual=NOT_REQUIRED`/같은 단원명/기존 그림 유무만으로 자동 면제 금지. 원본 발문·최종 해설·이미 출시된 Consumer를 보고 교육적 **한계 효용(marginal benefit)** 및 필요한 정보량·수학적으로 정의 가능한 실제 도형을 판정한다.

허용 최종 결과는 다음 네 가지 + 미판정:
- `SOLUTION_ADD_REQUIRED`: 해설의 결정적인 원/점/직선/접선/교점/대칭/구간/벤 영역을 보여 주어야 하나 적합한 검증된 해설 asset 없음.
- `SOLUTION_REUSE_VERIFIED`: 기존 해설용 SVG가 정확한 UID·수학적 사실·실제 링크/렌더에 결속됨.
- `SOLUTION_EXEMPT_JUSTIFIED`: 시각화가 새 학습 정보를 주지 않거나 퇴화/비시각 추론인 경우, UID별 이유로 증명. “텍스트로 풀 수 있다” 한 줄만으로 면제 불가.
- `SOLUTION_HOLD_VISUAL`: 필요하지만 fact 오류·지원 template 부재·SVG/렌더·스키마/경로 실패가 해결되지 않음; 임의 PASS 금지.
- `TRIAGE_PENDING`: 미검토. 전수 완료 1건으로 계상 금지.

## 5. 누락분 생성·검증·출시(후속 작업, 이번 문서 커밋에서 미실행)

1. source/최종 후보·해설·기존 problem figure/Consumer·학생 display를 확인해 **문제용/해설용 필요성을 각각 freeze**.
2. SVG 필요 UID의 `sourceFacts`·`derivedFacts`·`conclusion`(좌표, 중심, 반지름, 기울기, 접점, 반원 상하 방향, 중복 교점, 경계값)을 독립 수학 계산으로 확정. 먼저 그림을 그려 답을 역맞추지 않음.
3. `apmath-visual-upgrade` 단일 entry에 따라 지원 backend를 실제 probe 후 선택. 지원 불가한 CIRCULAR_ARC/반원 spec을 임의 ACTIVE로 선언하지 않음. 복합 panel이 필요하면 결정적 비교 전/경계/후를 보여 주되 9개 똑같은 장식은 금지.
4. UID별 SVG bytes + SHA256/Git blob·`expectedFacts`·실제 SVG primitive에서 역산한 `observedFacts`·parity/delta/tolerance·label ownership·실제 스타일/가독성·XML 안전성·실렌더 증거를 기록. 자기 source 숫자를 SVG expected/observed 양쪽에 복사한 가짜 검수 금지.
5. **학생용 Generated Consumer에서 실제 해설 asset 필드가 지원되는지 먼저 증명**하고 (예: `solutionImage`가 유효하다면 그 계약으로) `source candidate → actual asset → Consumer/index projection → 해설 모드` UID·SHA·경로를 1:1 결속. 현재 패키지에 새 키만 넣어 학생에게 보인다고 주장 금지.
6. 실제 Generated 학생 해설에서 데스크톱 render 기준 중심/호/점/라벨/글자·겹침/잘림과 수식·정답과의 정합 확인. 해당 신규·변경 UID만 검사하되, 기존 이미 승인된 문제 본문·보기·정답/Meta는 보존. main 출판 지시가 있으면 최신 main readback과 Browser QA까지 연속 마감.

### 우선 재작업: 팔마고 q19 9문항

q19는 큰 원·반원·직선의 교점 개수 및 접선 경계 전환을 설명하므로 **해설 SVG ADD 고우선 9 UID**로 triage. 각 UID에서 (a) 양의·음의 기울기 방향, (b) 원/반원 교점이 실제 호에 놓이는지, (c) 접할 때 2→1 교점 변화, (d) 원 끝점에서 중복 제거를 보여주는 장면만 추가한다. 구체적인 그림은 수학적 fact와 현재 학생용 해설이 고정된 후 생성. 이미 수학 검수/승인한 9문항 정답을 SVG를 위해 무단 변경 금지.

## 6. 이후 QID9 신규 CREATE 누락방지 하드게이트

매 qid 9 UID는 출제·역발문 자가수정 ledger에 `problemVisualNeed`와 독립된 **`solutionVisualNeed` 판정 9/9**을 추가한다. 대상마다 결과+근거를 남긴다. `ADD_REQUIRED`면 기술 제작/연결/검사까지 별도 DONE evidence가 있어야 하며, EXEMPT는 근거가 필수. 자료 부족/미지원은 HOLD. 기존 CREATE 9/9·정답 9/9만으로 “해설 SVG 완료”를 선언하지 않는다. ALIVE 독립 품질승인 방식 및 학교 기출 R1/R2 단계, Git main 출시 정책은 기존 CURRENT 그대로 준수.

### 전수조사/출시 집계 기준

UID 분모 N, 실제 해설 필요 ADD/REUSE/EXEMPT/HOLD/미판정 각각 총합=N. 필요 SVG 중 **물리 생성 / geometry parity / 학생 Consumer 연결 / 데스크톱 학생 해설 실렌더 / main SHA** 수치를 각각 따로 보고한다. 실제 수행하지 않은 항목은 `NOT_TESTED`. 원본 기출 SVG와 Generated SVG, 문제용 visual과 해설용 visual을 합쳐 성공률을 꾸미지 않는다.

**이번 마감 상태: 180/180 UID inventory + 기존 authority/engine route 문서화 완료. 개별 ADD/EXEMPT 결정 0/180, SVG 새 생성 0, 학생 Consumer/Chrome 검증 0. 기존 원본·해설·승인 상태 변경 없음.**
