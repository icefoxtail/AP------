# JS Archive GPT Visual Production Contract v1

- status: **CURRENT / GPT EXECUTION CANONICAL**
- scope: GPT 수동 작업 + ChatGPT 예약 CREATE/R1/R2/R3/THANOS의 problem image / SVG / graph / geometry / solutionImage 생성·수정·검수
- upstream design source: `.codex/skills/apmath-visual-upgrade/SKILL.md`
- core rule: **GPT는 Codex skill을 실행한다고 주장하지 않는다. 대신 그 skill의 시각자료 철학·판단축·검수축을 GPT 환경에서 실행 가능한 계약으로 번역하여 적용한다.**
- authority order: 형님의 현재 명시 지시 → 최신 Notion CURRENT/router → 이 문서 → 최신 `apmath-visual-upgrade/SKILL.md`의 비충돌 설계 철학 → 관련 visual canonical → source + verified/frozen solution facts → actual artifact bytes

## 0. 왜 별도 GPT Contract가 필요한가

Codex skill에는 skill router, local command, Python/Node validator, browser/render harness처럼 GPT 예약 환경에서 직접 실행할 수 없는 절차가 섞여 있다. 반대로 그 skill 안의 핵심 가치인 visual necessity, decisive relation, geometry truth, label-owner binding, digital readability, style floor, final artifact evidence는 GPT에도 그대로 필요하다.

따라서 GPT worker는:
1. skill 파일을 **설계 철학과 최신 visual 기준의 upstream source**로 읽는다.
2. 실행 방법은 이 GPT Contract로 해석한다.
3. 실행하지 못한 local command나 browser/render를 실행했다고 주장하지 않는다.
4. 가능한 검증은 source/current bytes/Git evidence/connector/수치 재계산으로 수행한다.
5. 실행 불가능한 축은 `NOT_RUN` 또는 `NOT_VERIFIED`로 명시하되, 그 사실만으로 생산 라인을 멈추지 않는다.
6. final release에서 실제로 필요한 검증이 남으면 정확한 visual debt와 next executable path를 남긴다.

## 1. 적용 역할

### 항상 적용
- CREATE: visual 필요성 판정 + 기존 visual 감사 + 필요한 ADD/POLISH/REBUILD
- R1: current artifact에서 visual full recheck + deterministic repair
- R2: visual 재검 + formal compare/regression
- R3: 최종 full visual audit + 확정 가능한 결함 same-stage pinpoint repair
- THANOS: 위 stage의 visual debt/repair/closure를 인수했을 때 동일 기준

### 일반적으로 비적용
- MAIN-MERGE: visual 품질을 새로 판정하지 않고 이미 R3_PASS된 clean payload만 publish
- WATCHDOG: visual verdict를 만들지 않고 상태만 집계

## 2. Visual Surface를 먼저 구분한다

### PROBLEM_VISUAL
문제 발문에 포함되는 원본 image/SVG.
- source fidelity가 최우선
- 원본 crop/vector가 충분하면 재사용
- 문제에 없던 힌트·보조선·답 유도 강조를 추가하지 않음
- 원본 problem visual을 solution visual로 대체하지 않음
- 원본에 image가 있는데 임의로 새 SVG로 갈아치우지 않음

### SOLUTION_VISUAL
학생이 해설과 함께 보는 교육용 visual.
- digital-first 허용
- 핵심 관계 강조, 보조선, 단계 패널, 색상 accent, 카드/라벨 계층 허용
- 단, 장식 목적의 색상/아이콘/텍스트 과밀 금지
- 풀이 전체 문장을 그림 안에 복사하지 않음
- 학생 노출 문구는 한국어 우선

### SYSTEM_VISUAL
shared generator/validator/engine/repository-wide visual system 자체가 작업 대상일 때만 사용.
개별 시험지 SVG repair를 SYSTEM_VISUAL로 확대하지 않는다.

## 3. Visual Triage — 전 문항 판단

각 qid를 아래 중 하나로 판정한다.
- `KEEP`: 수학·owner·style·readability까지 현재 기준 PASS
- `POLISH`: geometry는 정확하나 typography/stroke/spacing/composition/style floor 보정 필요
- `REBUILD`: geometry/semantic/composition 구조를 다시 만들어야 함
- `ADD`: 기존 solution visual이 없고 새 visual의 학습 이득이 명확함
- `REMOVE`: 잘못되었거나 중복·오해 유발 visual
- `EXEMPT`: visual이 실질적 이득 없음

별도 necessity 축:
- `VISUAL_REQUIRED`
- `VISUAL_OPTIONAL`
- `VISUAL_EXEMPT`

`OPTIONAL`은 무조건 ADD가 아니다.

## 4. Source Figure Sufficiency / Marginal Benefit

문제 그림이 이미 풀이의 decisive relation을 충분히 보여주면 같은 도형을 다시 그리는 것만으로 ADD하지 않는다.

source figure가 있는 문항에서 solution visual을 ADD하려면 최소 하나가 있어야 한다.
- 풀이에서 새로 쓰는 보조선/수선/접점/분할
- source에는 없는 같은 길이/같은 각/owner 관계
- 복잡한 원본을 decisive reduction으로 단순화
- 계산값이 실제 도형의 어느 곳인지 보여주는 concept anchor
- case 분리를 통해 오해를 줄이는 새 representation

`newVisualInformation=[]`이면 기본값은 KEEP 또는 EXEMPT다.

## 5. Decisive Relation First

좋은 solution visual은 모든 정보를 한 장에 담는 그림이 아니다.
**풀이가 성립하는 결정 관계를 가장 적은 요소로 즉시 보이게 해야 한다.**

우선순위:
1. decisive point / line / circle / interval / region
2. 실제 풀이에서 쓰는 보조선
3. 필요한 label / exact value
4. 필요한 경우에만 axis/tick/grid
5. 필요한 경우에만 계산 card

실제 geometry가 핵심이면 계산 card가 geometry를 대체할 수 없다.

## 6. Backend 선택 철학

GPT는 특정 backend를 직접 실행할 수 없더라도 최종 artifact의 성격을 판단할 때 다음 방향을 따른다.
- STANDARD_SVG: 단순 좌표/직선/원/기본 geometry
- MINIMAL_EXAM_DIAGRAM: 축/grid보다 관계 자체가 핵심
- COMPOSITE_PANEL: case 1/2, 이동 전후, geometry→algebra bridge
- FUNCTION_GRAPH: 함수 곡선/교점/증감/critical shape가 핵심
- NUMBER_LINE / INTERVAL: 구간·경계·길이가 핵심
- RASTER_KEEP: 원본 raster/vector가 더 정확하고 자연스러움
- TIKZ/PGFPLOTS 계열은 전문 vector 조판이 실제 품질을 올릴 때 Codex/backend 후보로만 판단

도구가 있다는 이유로 복잡한 backend를 택하지 않는다.

## 7. Math Authority — 그림보다 수학 사실이 먼저

visual의 수학 authority:
`source + verified/frozen solution facts → numeric/geometry facts → coordinate model → actual visual primitive`

표시 문구가 맞더라도 실제 primitive가 틀리면 FAIL이다.

최소 확인:
- 점 좌표
- 교점
- 중심/반지름
- 수직/평행
- 접선
- 중점/내분
- 등거리/합동/닮음
- 각도/길이
- 함수의 핵심 좌표/절편/기울기
- solution에서 실제 사용한 관계

GPT가 계산 가능한 수치는 직접 재계산하고, 계산 불가/도구 부재를 PASS로 위장하지 않는다.

## 8. Geometry Annotation / Label Owner Binding — CURRENT HARD

**Geometry is primary. Annotation is secondary.**

### 기준 viewport와 글씨 크기
- solution geometry SVG의 publication reference는 **screen-fit/page-fit 축소가 없는 실제 Archive desktop `mode=sol` 해설 화면**이다.
- 기본 qualification viewport는 **1440×1000 desktop**이며, 제품 canonical desktop viewport가 따로 있으면 그 값을 따른다.
- 이 PC reference에서 student-facing point/angle/length/math label은 **11 CSS px 미만 HARD FAIL**, 12px 이상을 기본 목표로 한다.
- 모바일/좁은 화면에서 A4/page 전체가 비례 축소되는 것은 SVG publication gate가 아니다.
- 모바일 별도 render PASS나 모바일 absolute font floor는 요구하지 않는다.
- 같은 도형 안의 점 이름, 각도값, 길이값, 짧은 수학 변수/수치는 **같은 기본 font-size**를 사용한다.
- point를 크게, numeric을 절반 크기로 만드는 hierarchy는 기본값으로 사용하지 않는다.
- SVG user-space에서 도형과 함께 비례 scale되게 한다.

### 점 문자
- owner point와 즉시 결속돼야 한다.
- 도형 중심에서 바깥쪽 free sector를 우선하되 실제 선/원/arc/숫자와의 여백을 보고 배치한다.
- point, segment, angle arc, 다른 label, canvas edge에 붙거나 겹치면 FAIL.

### 각도
각도 숫자는 실제 owner vertex와 두 ray 사이의 wedge에 결속한다.
- arc center = 실제 owner vertex
- arc start/end = 실제 owner rays
- primitive에서 역산한 observed angle이 expected angle과 허용오차 내 일치
- degree label은 wedge 안 또는 명확한 인접 위치
- 직각은 square marker 우선
- 한 꼭짓점 다중 각은 radius 계층화
- 같은 semantic angle의 중복 arc / duplicate primitive / duplicate id 금지
- 위치만으로 owner가 이미 명백하면 불필요한 decorative arc를 강제하지 않음

### 길이
길이 수치는 어느 두 점 사이인지 즉시 보여야 한다.
우선순위:
1. owner가 명백하면 선분 인접/평행 배치
2. 애매하거나 밀집하면 offset dimension + end tick
3. 필요할 때만 짧은 leader/brace

`AB=8`처럼 문장형 label을 기본값으로 쓰지 않는다. 값 `8`만으로 owner가 명백하면 그쪽을 우선한다.

### 영역/넓이
영역값은 해당 region 내부에 두거나 짧은 region leader로 결속한다.

### 충돌 해결 순서
`relocate → owner cue 조정 → geometry/viewBox 확대·재프레이밍 → leader/dimension → 마지막에 최소 font 예외`.
font 축소를 첫 해결책으로 쓰지 않는다.

### semantic identity
source의 A/B/C/D/P 등 entity identity와 SVG point id/좌표/owner metadata가 일치해야 한다.
표시 text가 맞아도 다른 점 owner에 결속된 radius/arc/leader면 FAIL이다.

### 일반 라벨
점 이름, 각도값, 길이값, 선 이름이 서로 겹치거나 다른 owner처럼 읽히면 FAIL.
실제 화면에서 사실상 같은 위치를 점유하면 static 검사 PASS와 무관하게 FAIL이다.

## 9. Problem Image와 SolutionImage 분리

HARD:
- problem image는 source truth
- solutionImage는 explanation aid
- problem raster가 있는데 "더 예쁘게 보인다"는 이유만으로 solution-style SVG로 치환 금지
- 원본 crop이 불완전해도 current crop+발문+보기로 source truth가 확정되면 exam HOLD로 올리지 않음
- 실제 source truth가 불확정할 때만 source repair 경로

## 10. Style Floor

기존 SVG도 존재한다는 이유만으로 KEEP하지 않는다.
KEEP은 다음을 모두 만족해야 한다.
- semantic geometry correct
- decisive relation visible
- label owner clear
- typography readable
- stroke hierarchy 자연스러움
- 정보 밀도 적절
- desktop publication reference 가독성
- clipping/collision 우려 없음
- black-and-white에서도 의미 유지
- 같은 시험지 내 style consistency

geometry가 정확하고 style만 낡았으면 POLISH.
geometry/owner/decisive relation이 틀리면 REBUILD.

## 11. Digital-first solution visual

해설 visual은 학교 시험지의 흑백 도형을 그대로 복제하는 것이 목표가 아니다.
학생 이해를 빠르게 하면:
- 강조색
- 단계 패널
- 핵심선 굵기
- 배경 카드
- 이전/이후 비교
를 사용할 수 있다.

하지만 decoration이 수학 관계보다 앞서면 FAIL.

## 12. Render와 GPT 환경의 한계

### Geometry change render HARD
point/angle/length/region label, arc/dimension/leader, geometry primitive, viewBox, canvas framing 중 하나라도 바꾼 solution SVG는 최종 visual PASS 전에 **실제 Archive desktop `mode=sol` publication reference render review**가 필요하다.
기본 qualification viewport는 **1440×1000**이며 screen-fit/page-fit 축소 상태는 사용하지 않는다.
XML/bbox/static inspection은 구조 검증이며 실제 PC 화면 PASS를 대체하지 않는다.
문항/SVG load 완료 후 final asset SHA/blob과 실제 페이지 asset이 일치하는지 확인한다.

모바일/page-fit 렌더는 SVG publication qualification에서 제외한다.
완성된 SVG가 `viewBox` 기준으로 비례 확대·축소되는 것은 정상 동작이며, 모바일의 축소된 절대 CSS font px로 SVG를 FAIL 처리하지 않는다.

제작자 자기보고 `PASS`는 최종 seal authority가 아니다.
전수 visual campaign은 전체 수정 artifact freeze 후 별도 review pass에서 denominator 전체를 다시 보고, 이후 FAIL 수정은 changed SVG + direct dependency만 targeted recheck한다.

GPT 예약 worker는 local browser/Node/Python harness가 없을 수 있다.

금지:
- 실행하지 않은 render를 PASS라고 기록
- skill command를 실제 실행한 것처럼 보고
- code inspection만으로 collision/clipping을 확정하면서 browser PASS 주장

허용:
- actual SVG bytes/좌표/텍스트 구조 감사
- Git blob/SHA 결속 확인
- source/solution relation 수학 검증
- 명확한 정적 bbox/owner 문제 판정
- 실행 가능한 connector/Actions/validator가 있으면 실제 사용

필요한 실제 render가 불가능하면:
1. 가능한 제작/수리를 끝낸다.
2. `renderStatus=NOT_RUN` 또는 해당 축 `NOT_VERIFIED`.
3. 정확한 visual debt와 target asset을 남긴다.
4. 라인을 self-disable하거나 whole-exam HOLD하지 않는다.
5. R3/release에서 정책상 render가 HARD라면 release 전 executable render owner가 닫아야 한다.

## 13. Evidence 최소값

신규/수정 visual은 가능하면 item-level로:
- qid/questionUid
- source exam SHA / solution SHA
- visual action: KEEP/POLISH/REBUILD/ADD/REMOVE/EXEMPT
- visual necessity
- decisive relation
- expected facts
- coordinate/numeric model
- actual primitive observations
- label owner observations
- style floor status
- final asset SHA/blob
- render status
- unresolved visual debt

전수 geometry/visual sweep에서는 전체 denominator ledger를 남긴다.

## 14. CREATE / R1 / R2 / R3에서의 적용 차이

### CREATE
- 전 문항 necessity audit
- 기존 problem image source fidelity 보존
- solution visual ADD/POLISH/REBUILD 결정
- 필요한 visual을 production artifact에 물리화
- visual evidence를 CREATE evidence에 결속

### R1
- CREATE visual verdict를 정답으로 믿지 않음
- current source+solution에서 fresh recheck
- deterministic visual defect 직접 repair
- KEEP도 style floor까지 확인

### R2
- current visual 독립 재검
- R1과 formal compare
- false PASS, owner drift, geometry mismatch, over-added visual, missing visual을 잡음

### R3
- 시험지 전체 final visual audit
- 확정 가능한 결함은 같은 R3에서 pinpoint repair
- changed/open visual locus + direct dependency 재확인
- source truth 불가일 때만 bounded SOURCE_REPAIR_REQUIRED

### THANOS
인수한 stage가 visual 관련이면 그 stage와 동일한 visual contract를 적용한다. rescue라고 품질 기준을 낮추지 않는다.

## 15. Future Geometry Closure / Visual Sweep Mode

중1 도형 마감, 중2 함수·직선 업그레이드처럼 **기존 production을 visual 중심으로 최종 정리**할 때는 전체 CREATE를 다시 돌리지 않는다.

기본 흐름:
1. 대상 시험지/문항 denominator 확정
2. current main의 existing visual inventory
3. geometry/graph/line/function 관련 qid 전수 triage
4. KEEP/POLISH/REBUILD/ADD/REMOVE/EXEMPT
5. 필요한 것만 전수 수정
6. 수정 완료 artifact freeze
7. **전체 denominator 독립 visual review + actual Archive desktop reference render**
8. 반복 defect가 있으면 rule/skill 최소 보정
9. FAIL SVG만 pinpoint repair
10. changed SVG + direct dependency만 targeted recheck
11. final R3-style seal

대표 문항 pilot만 PASS했다고 campaign을 닫지 않는다.
대표 문항으로 rule을 확정한 뒤 target 시험지 전체에 적용하고, **전체 적용 후 다시 전수검수하여 부족한 패턴을 찾고 수정·targeted recheck까지 닫아야 pilot 완료**다.

이 모드에서 과거 CREATE/R1/R2를 이유 없이 재실행하지 않는다.

## 16. 대표 실패 패턴

다음은 PASS 금지:
- 수치 text는 맞지만 점/선 좌표가 틀림
- 각도 label이 다른 꼭짓점처럼 보임
- 길이값이 어느 선분인지 불명확
- source problem raster를 버리고 임의 SVG로 대체
- 원본 그림과 같은 정보만 반복하는 solution SVG
- visual이 많을수록 좋다고 판단
- 모든 좌표문제에 full axis/grid 강제
- 계산 card가 실제 geometry를 대체
- desktop publication reference에서 라벨이 충돌하지만 XML valid라 PASS
- current skill의 local command를 실행하지 못했는데 실행했다고 주장

## 17. Final Principle

`SKILL.md`를 GPT가 "실행"하는 것이 아니다.
GPT는 최신 skill의 방향을 읽고 이 문서의 실행 계약으로 번역한다.

최종 목표:
- 학생 이해 우선
- source fidelity 보존
- decisive relation 명료화
- 실제 geometry truth
- label owner 명확화
- 불필요한 SVG 생성 억제
- 필요한 visual은 적극 업그레이드
- digital-first 해설
- 실행하지 않은 검증을 PASS로 위장하지 않음
- visual defect 하나로 pipeline 전체를 멈추지 않음
