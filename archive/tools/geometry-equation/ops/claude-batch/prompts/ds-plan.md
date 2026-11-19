[DeepSeek plan 작성자 — 시험지 하나의 "plan 대기" 문항 전부, 글로만 쓴다]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 이 기준. 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF 문서의 대기열·잠금·원장 절차보다 우선한다.
위임 금지: 다른 모델·하위 에이전트에 작업을 넘기지 않는다. git 명령 금지(커밋·푸시는 이 실행을 부른 스크립트가 한다).

[이 일의 목적]
시험지 한 개에서 해설 그림(SVG)이 필요하다고 판정된 문항("대상 문항")마다 엔진 plan 파일을 **글로만** 쓴다. **렌더하지 않는다. PNG를 만들지 않는다.** 렌더 확인은 나중에 공장이 일괄로 하고 실패분은 수리 단계로 간다. 그러니 렌더 오류를 피하려면 plan을 처음부터 짜지 말고, **같은 형태로 이미 통과한 plan을 찾아 본뜨고 값만 바꾼다.** 기준은 "학생이 PC·휴대폰 화면에서 이 그림을 보고 풀이를 따라가며 확인할 수 있는가"다.

[경로]
- 시험지 JS(읽기 전용): <EXAM>
- plan 폴더: <PLANDIR>  — plan 파일은 여기에 `q<번호>-solution.json`으로 쓴다(번호 = 아래 대상 문항의 "plan 파일" 이름 그대로).
- 작업 폴더 <OUT>: 판정이 FIGURE가 아닌 문항의 `<OUT>/q<번호>/result.json` 만 여기에 쓴다. 임시 스크립트는 <OUT>/scratch/ 에 둔다.
- 대상 문항 목록과 원문·정답·해설은 아래 "[대상 문항]"에 들어 있다(시험지 JS를 따로 읽을 필요는 없다. 문제 그림 파일 경로는 있으면 PNG로 열어 본다).
- `_decisions.jsonl`, `source-revision.json`은 쓰지 않는다(스크립트가 만든다).

[먼저 읽기 — 필요한 만큼, 한 번씩]
1. <WORKTREE>/docs/agents/visual-svg.md 의 "해설 그림 정보 우선", "확률과 통계 해설 그림 필요 판정" 절.
2. <WORKTREE>/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md (plan 계약). 길면 쓸 형태의 절만 grep으로 찾아 읽는다.
3. 형태별 가이드 <WORKTREE>/.tmp/svg-m1/guide/ 의 guide-graph.md(함수·그래프), guide-plane.md(평면도형·원·합성 패널), guide-solid.md(입체), guide-stat.md(통계), guide-core.md(수직선 등), guide-tips.md. 파일이 크니 capability 이름·필드 이름으로 grep한다. <WORKTREE>/.tmp/svg-m1/briefs/plan-current.md, deepseek-addendum.md(실제로 반려된 결함 점검표)도 읽는다.

[plan 파일은 본뜬다 — 필드를 지어내지 않는다]
같은 형태로 이미 통과한 plan이 아래에 많다.
- <WORKTREE>/docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/ 아래 q*-solution.json (1000개 넘음)
- <WORKTREE>/archive/tools/geometry-equation/ops/golden/*/plan.json (렌더 통과 본보기)
문항 형태(함수 그래프, 접선, 정적분 넓이, 원·직선, 삼각형, 벡터, 입체, 수직선, 정규분포 …)를 정하고 capability로 찾는다.
  grep -rl '"capability": "<capability 이름>"' <WORKTREE>/docs/plans/archive-one-route-upgrade/svg-plans-expanded/original --include='q*-solution.json' | head
capability 이름은 가이드에서 찾는다(예: piecewise-polynomial-spike-v1, composite-panels-v1, number-line-figure-v1, stat-chart-figure-v1, construction-spike-v1, solid-figure-v1 …). 찾은 plan 두세 개를 읽고 구조와 필드 이름을 그대로 두고 값만 이 문항에 맞게 바꾼다. 모르는 필드는 가이드에서 정확한 이름을 확인한다. 본보기에 없는 최상위 필드를 쓰면 스크립트가 거절한다. plan 최상위에는 본보기와 같은 모양으로 capability, (형태별 본문), caption, accessibilityDescription, sourceConditions, newVisualInformation 이 있다. sourceConditions 의 첫 항목은 `{"id":"source","condition":"<문항 문제 원문>","mappedTo":"PRESERVED_ARCHIVE_BANK"}` 이다(본보기 참고).

[엔진에서 흔히 걸리는 것 — 미리 피한다]
- 눈금 값 `axisTickValues`에 0을 넣지 않는다(INVALID_AXIS_TICK_VALUE). 눈금 라벨이 점 좌표 라벨과 겹치면 눈금을 줄인다.
- 구간별 다항(piecewise-polynomial): `requiredPoints`는 곡선 위의 점만, 꼭짓점·극점·꺾임점을 모두 넣는다(극점이 근호여도 그 값 그대로). 삼차함수의 두 극점이 너무 가까우면 정의역을 좁힌다. 삼차 + 근호 교점 목록은 시간 초과가 나니 정의역을 좁히거나 목록을 줄인다.
- 불연속 조각함수(piecewise-discontinuous): 조각 차수 2 이하, 양쪽이 모두 열린 경계는 `jumpValues` 필요. 끊어지는 조각함수의 비정수 x 필수점은 엔진 한계일 수 있다.
- composite-panels-v1: 패널 수 — 벤 2~6, 평면도형 2~5, 그래프 2패널, 다중곡선 정확히 2패널, 통계 2~4, 입체 2~6. 패널 제목은 한글·ASCII 16자 이내. 패널 안 plan에는 caption·sourceConditions·newVisualInformation을 쓰지 않는다(최상위와 패널 caption에). 그림이 쪽 높이를 넘지 않게 패널을 적게.
- 수직선: 근호 끝값이 다른 끝과 너무 가까우면 라벨이 겹친다(공통 범위 RESULT 줄을 빼고 줄만 비교). 구간 끝점 state(OPEN/CLOSED)를 정확히.
- 지시선 callout 글자에 "|"를 쓰지 않는다. 쉼표가 든 좌표는 점의 coordinates 옵션을 쓴다.
- 평면도형의 segmentColors·parallels·equalLengths·rightAngles는 planeMarks 안에 쓴다(밖에 쓰면 조용히 무시된다).
- y=x·기울기 ±1 직선·원이 있는 단일 유리·무리함수 그래프는 graphPlan.equalUnits:true.

[판정 — 문항마다 하나]
- **FIGURE**: plan을 쓴 문항. plan 파일이 있으면 FIGURE로 본다(result.json 불필요).
- **EXEMPT**: 그림이 학생에게 보탤 정보가 없는 문항. 사유에 "무엇을 계산하는 문제라서 그림이 보탤 정보가 없다" 수준의 구체적인 한 줄을 쓴다("그림이 필요 없다"만 쓰지 않는다). 특히 확률과 통계의 단순 계산(곱의 법칙·순열·조합·이항계수의 단순 계산, 식만으로 끝나는 확률 계산, 해설에 이미 같은 나열이 있는 문항)이 그렇다. 확통에서 만든다 = 경우를 나열해야 하는 수형도, 정규분포·연속확률분포 곡선과 구간 넓이, 넓이로 푸는 확률밀도 그래프, 이산확률분포 막대, 칸 묶음을 강조하는 주사위 6×6 표, 사건 관계가 핵심인 벤다이어그램, 원순열 배치, 최단경로 격자. 확률분포표·분할표 같은 표는 SVG가 아니라 AP Table Engine 몫이므로 EXEMPT로 하고 사유에 "표는 AP Table Engine"을 쓴다. 해설 식을 그림으로 한 번 더 옮긴 것은 도움으로 보지 않는다. 다른 과목도 식 정리만으로 끝나는 계산(다항식 연산, 인수분해, 복소수 사칙, 극한·미분·적분의 기계적 계산)은 EXEMPT다. 단, 극한·연속·미분계수·넓이처럼 그래프를 보면 이해가 되는 문항은 FIGURE다.
- **CONTENT**: 문제·정답·해설이 서로 모순이거나 해설이 자리표시 문장이어서 문항이 성립하지 않는다(근거 한 줄). 발문·보기·해설 원문은 고치지 않는다.
- **UNSUPPORTED**: 엔진이 지원하지 않는 형태라고 **확실할 때만** 쓴다(가이드·본보기를 찾아 봐도 그 형태의 capability가 없을 때). 어려워 보인다는 이유로 쓰지 않는다. 비슷한 capability의 본보기가 있으면 그것으로 FIGURE를 쓴다. errorCode 칸에는 근거(찾아 본 capability·가이드 절)를 쓴다.
판단 기준은 "학생 풀이에 조금이라도 도움이 되면 만든다"이다.

[result.json — FIGURE가 아닌 문항만, UTF-8]
`<OUT>/q<번호>/result.json`: {"decision":"EXEMPT|CONTENT|UNSUPPORTED","why":"구체적인 한국어 한 줄 사유"}. UNSUPPORTED는 "errorCode":"근거 한 줄", "attempts":"찾아 본 방법" 을 더한다. FIGURE가 아닌 문항은 plan 폴더에 q<번호>-solution.json 을 두지 않는다. 쓴 뒤 node로 다시 읽어 JSON이 읽히고 한글이 깨지지 않았는지 확인한다.

[plan 작성 규칙]
- **한 문항에 한 장.** 장면이 여럿 필요하면 plan 하나를 composite-panels-v1로 만든다(위 패널 규칙). 수직선(number-line-figure-v1)은 해집합을 줄마다 겹쳐 보일 수 있다.
- **해설 그림은 정보가 우선이다**(사용자 결정 2026-11-17). 정답이 그림에 보여도 된다. 교점·극점·절편·구간·중간값·보조선을 최대한 넣고 caption 끝에도 정답을 쓴다. 해설이 값을 구한 문자 미지수는 실제 값으로 그린다. 해설이 예시 하나를 쓰면 caption에 "예:"로 밝힌다.
- **caption**: 풀이 요약 2~4문장 + 끝에 정답("따라서 답은 ③이다."). **accessibilityDescription**: 그림에 실제로 보이는 것을 한두 문장(대상·점·선·구간·색), 정답은 쓰지 않는다. plan에 넣지 않은 점·선 이름은 쓰지 않는다. 둘 다 한국어 평문이다. **입력용 표기(^, sqrt, *, \frac, $…$)와 "축척"이라는 말을 쓰지 않는다**(기호로 쓴다: x², √, ≤, ≥, π, −, ×, 분수는 1/3처럼 평문으로). 영어 단어 금지(변수 이름은 허용). 검사기는 archive/tools/svg-language-contract.cjs 이고 스크립트가 적용한다.
- 문항에 없는 점·곡선·함수 이름을 그림이나 글에 쓰지 않는다. 쓰려면 caption에서 정의한다. 점 이름은 안쪽, 길이 치수선은 바깥. 라벨 자리가 없으면 지우지 말고 지시선(callout·leader)부터. 좌표 라벨은 coordinatePlacement "PANEL"을 쓰지 않고 점 곁에 단다.
- 직선·곡선·원·영역이 여럿이면 색을 달리하고(필요하면 점선·음영) 이름을 대상 곁에 단다.
- **손으로 SVG를 쓰지 않는다**(엔진 plan만). 시험지 JS 원문·archive/assets·엔진 코드는 수정하지 않는다. 발문·보기는 고치지 않는다. 검사를 완화하지 않는다.
- 파일은 UTF-8로 쓴다. 셸 echo·리다이렉션·PowerShell을 쓰지 말고 Write 도구 또는 node/python의 파일 쓰기(encoding utf-8, 줄끝 LF)를 쓴다. 쓴 뒤 한글이 ?나 깨진 글자로 바뀌지 않았는지, JSON이 읽히는지 다시 읽어 확인한다.

[끝내기 전 점검 — 문항마다]
plan이 본보기와 같은 구조·필드 이름인가 / capability가 맞는가 / caption·accessibilityDescription 규칙을 지키는가 / sourceConditions가 있는가 / 판정이 FIGURE가 아니면 result.json 이 있고 plan 폴더에 q<번호>-solution.json 이 없는가 / JSON이 node로 읽히는가.

[끝까지 진행] 대상 문항 전부에 plan 파일 또는 result.json 이 생길 때까지 멈추지 않는다. 한 문항을 끝낼 때마다 바로 파일을 남긴다. 문항당 오래 붙들지 않는다(본보기를 찾고 값을 바꾼다).
최종 메시지는 처리한 문항 수 한 줄.
