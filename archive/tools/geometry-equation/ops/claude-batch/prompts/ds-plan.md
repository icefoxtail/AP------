[DeepSeek plan 작성자 — 시험지 하나의 "plan 대기" 문항 전부]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 이 기준. 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF 문서의 대기열·잠금·원장 절차보다 우선한다.
위임 금지: 다른 모델·하위 에이전트에 작업을 넘기지 않는다. git 명령 금지(커밋·푸시는 이 실행을 부른 스크립트가 한다).

[이 일의 목적]
시험지 한 개에서 해설 그림(SVG)이 필요하다고 판정된 문항("대상 문항")마다 엔진 plan 파일을 쓰고 엔진으로 렌더해 ARCHIVE_BOUND까지 확인한다. 그 plan은 나중에 일괄 렌더 → Sonnet 모음 시트 검수 → 메인 PNG 표본 확인 → 게시로 넘어간다. 기준은 "학생이 PC·휴대폰 화면에서 이 그림을 보고 풀이를 따라가며 확인할 수 있는가"다. 너(DeepSeek)는 PNG를 볼 수 있다. 그림을 만든 뒤 **직접 열어 보고** 고친다.

[경로]
- 시험지 JS(읽기 전용): <EXAM>
- plan 폴더: <PLANDIR>  — plan 파일은 여기에 `q<번호>-solution.json`으로 쓴다(번호 = 아래 대상 문항의 "plan 파일" 이름 그대로).
- 작업 폴더 <OUT>: 문항마다 `<OUT>/q<번호>/` (item.json, result.json, out/, fig.png). 임시 스크립트는 <OUT>/scratch/ 에 둔다.
- 대상 문항 목록과 원문·정답·해설은 아래 "[대상 문항]"에 들어 있다(시험지 JS를 따로 읽을 필요는 없다. 문제 그림 파일 경로는 있으면 PNG로 열어 본다).
- `_decisions.jsonl`, `source-revision.json`은 쓰지 않는다(스크립트가 result.json으로 만든다).

[먼저 읽기 — 필요한 만큼, 한 번씩]
1. <WORKTREE>/docs/agents/visual-svg.md 의 "해설 그림 정보 우선", "확률과 통계 해설 그림 필요 판정" 절.
2. <WORKTREE>/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md (plan 계약). 길면 쓸 형태의 절만 grep으로 찾아 읽는다.
3. <WORKTREE>/.tmp/svg-m1/briefs/plan-current.md, deepseek-addendum.md (실제로 반려된 결함 점검표). 형태별 가이드는 <WORKTREE>/.tmp/svg-m1/guide/ 의 guide-graph.md(함수·그래프), guide-plane.md(평면도형·원·합성 패널), guide-solid.md(입체), guide-stat.md(통계), guide-core.md(수직선 등), guide-tips.md. 파일이 크니 capability 이름·오류 코드로 grep한다.
4. 알려진 함정은 <WORKTREE>/docs/plans/archive-one-route-upgrade/svg-plans-expanded/_tools/HANDOFF-plan-line.md 의 "엔진에서 실제로 걸린 것" 절.

[plan 파일은 처음부터 짜지 말고 이미 있는 것을 본뜬다]
같은 형태로 이미 쓴 plan이 <WORKTREE>/docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/ 아래 q*-solution.json 으로 1000개 넘게 있다. 문항 형태(함수 그래프, 접선, 정적분 넓이, 원·직선, 삼각형, 벡터, 수직선, 정규분포 …)가 정해지면 capability로 찾는다.
  grep -rl '"capability": "<capability 이름>"' <WORKTREE>/docs/plans/archive-one-route-upgrade/svg-plans-expanded/original --include='q*-solution.json' | head
capability 이름은 가이드에서 찾는다(예: piecewise-polynomial-spike-v1, composite-panels-v1, number-line-figure-v1, stat-chart-figure-v1, construction-spike-v1 …). 찾은 plan 한두 개를 읽고 값만 이 문항에 맞게 바꾼다. **필드를 지어내지 않는다.** 모르는 필드는 가이드에서 정확한 이름을 확인한다. plan 최상위에는 본보기와 같은 모양으로 capability, (형태별 본문), caption, accessibilityDescription, sourceConditions, newVisualInformation 이 있다. sourceConditions 의 첫 항목은 `{"id":"source","condition":"<문항 문제 원문>","mappedTo":"PRESERVED_ARCHIVE_BANK"}` 이다(본보기 참고).

[문항마다 할 일 — 한 문항을 끝내고(result.json까지) 다음 문항으로 간다]
1. 원문·정답·해설을 읽고 풀이가 쓰는 방법을 파악한다. 문제 그림 파일이 있으면 열어 점 이름·배치를 맞춘다. 문항이 풀이에 그림이 도움이 되는지 판단한다(아래 [판정]).
2. FIGURE면 본보기를 찾아 plan을 <PLANDIR>/q<번호>-solution.json 으로 쓴다(UTF-8, node/python 또는 Write 도구).
3. <OUT>/q<번호>/item.json 을 쓴다: {"sourcePath":"<EXAM 의 저장소 상대경로 archive/exams/original/….js>","ordinal":<대상 문항의 "렌더 ordinal" 값 그대로>}
4. 렌더한다(공식 엔진, 환경·브라우저·렌더 잠금 포함. 잠금 때문에 오래 기다릴 수 있으니 기다린다. 프로세스를 죽이지 않는다):
   cd <WORKTREE> && node .tmp/work/render.mjs --item <OUT>/q<번호>/item.json --plan <PLANDIR>/q<번호>-solution.json --out <OUT>/q<번호>/out > <OUT>/q<번호>/render-1.log 2>&1
   결과는 <OUT>/q<번호>/out/figure-result.json 의 status 가 ARCHIVE_BOUND 여야 성공이다. 실패 로그(render-N.log)에 엔진 오류 코드와 `fix` 힌트가 있다. 힌트대로 plan을 고친다.
5. PNG를 만들어 **직접 본다**: node .tmp/svg-m1/svg2png.cjs <OUT>/q<번호>/out/figure-solution.svg <OUT>/q<번호>/fig.png 600 . 안 읽히면 같은 명령 뒤 ".png"를 열어 본다. 보면서 확인한다: 글자·라벨 겹침, 라벨이 대상 곁에 붙어 있는가, 곡선·직선 구별(색·점선), 해설이 쓰는 점·값(교점·극점·절편·구간·중간값)이 읽히는가, 잘리거나 납작하지 않은가, 해설·정답과 그림이 맞는가. 고칠 것이 있으면 plan을 고쳐 4~5를 반복한다. PNG를 실제로 열어 봤다면 result.json 에 "pngViewed": true, 열 수 없었다면 false 로 정직하게 쓴다(열어 보지 않고 봤다고 쓰지 않는다).
6. 렌더는 **문항당 5회 상한**. **같은 오류 코드가 3번 나오면 방법을 바꾼다**(지시선·callouts, 패널 나누기, 라벨 줄이기, 정의역 좁히기, 다른 capability). 그래도 안 되면 UNSUPPORTED로 두고 오류 코드와 시도한 방법을 적는다. 이때 plan 폴더의 q<번호>-solution.json 은 <OUT>/q<번호>/last-plan.json 으로 옮겨 plan 폴더에 남기지 않는다.
7. 끝나면 `<OUT>/q<번호>/result.json` 을 쓴다(아래 형식). 그리고 `<OUT>/SUMMARY.md` 에 그 문항 한 줄을 덧붙인다.

[판정 — result.json 의 decision, 정확히 이 중 하나]
- FIGURE: plan을 쓰고 ARCHIVE_BOUND까지 간 문항.
- EXEMPT: plan을 쓰다 보니(또는 읽어 보니) 그림이 학생에게 보탤 정보가 없는 문항. 사유에 "무엇을 계산하는 문제라서 그림이 보탤 정보가 없다" 수준의 구체적인 한 줄을 쓴다("그림이 필요 없다"만 쓰지 않는다). 특히 확률과 통계의 단순 계산(곱의 법칙·순열·조합·이항계수의 단순 계산, 식만으로 끝나는 확률 계산, 해설에 이미 같은 나열이 있는 문항)이 그렇다. 확통에서 만든다 = 경우를 나열해야 하는 수형도, 정규분포·연속확률분포 곡선과 구간 넓이, 넓이로 푸는 확률밀도 그래프, 이산확률분포 막대, 칸 묶음을 강조하는 주사위 6×6 표, 사건 관계가 핵심인 벤다이어그램, 원순열 배치, 최단경로 격자. 확률분포표·분할표 같은 표는 SVG가 아니라 해설 글 안의 AP Table Engine 몫이므로 EXEMPT로 하고 사유에 "표는 AP Table Engine"을 쓴다. 해설 식을 그림으로 한 번 더 옮긴 것은 도움으로 보지 않는다. 다른 과목도 식 정리만으로 끝나는 계산(다항식 연산, 인수분해, 복소수 사칙, 극한·미분·적분의 기계적 계산)은 EXEMPT다. 단, 극한·연속·미분계수·넓이처럼 그래프를 보면 이해가 되는 문항은 FIGURE다.
- CONTENT: 문제·정답·해설이 서로 모순이거나 해설이 자리표시 문장이어서 문항이 성립하지 않는다(근거 한 줄). 발문·보기·해설 원문은 고치지 않는다.
- UNSUPPORTED: 엔진이 못 그린다. 손으로 메우지 않는다. errorCode(마지막 엔진 오류 코드)와 attempts(시도한 방법과 오류 코드를 한두 문장으로)를 반드시 쓴다.
판단 기준은 "학생 풀이에 조금이라도 도움이 되면 만든다"이다. 엔진 미지원은 백 개 중 한두 개가 정상이다. 더 많이 나오면 plan부터 의심한다.

[result.json 형식 — UTF-8, 문항마다 하나]
{"decision":"FIGURE","why":"구체적인 한국어 한 줄(FIGURE면 그림이 보이는 풀이 관계, EXEMPT/CONTENT면 사유)","pngViewed":true,"note":"선택: 사람이 눈으로 볼 위험(라벨 근접, 눈금 비 등)"}
UNSUPPORTED는 "errorCode":"…", "attempts":"…" 를 더한다. FIGURE 외에는 plan 폴더에 q<번호>-solution.json 을 두지 않는다. 쓴 뒤 node로 다시 읽어 JSON이 읽히고 한글이 깨지지 않았는지 확인한다.

[plan 작성 규칙]
- **한 문항에 한 장.** 장면이 여럿 필요하면 plan 하나를 composite-panels-v1(패널 2~6, 규칙은 AUTHOR_GUIDE와 production/composite-candidate-svg-v1.mjs)로 만든다. 패널 제목은 학생에게 뜻 있는 말(한글·ASCII 16자 이내, 작업 메모 금지). 수직선(number-line-figure-v1)은 해집합을 줄마다 겹쳐 보일 수 있다.
- **해설 그림은 정보가 우선이다**(사용자 결정 2026-11-17). 정답이 그림에 보여도 된다. 교점·극점·절편·구간·중간값·보조선을 최대한 넣고 caption 끝에도 정답을 쓴다. 해설이 값을 구한 문자 미지수는 실제 값으로 그린다. 정답이 "범위의 경계값"이어도 그림에 쓰되, 해설이 예시 하나를 쓰면 예시로 그린 그림은 caption에 "예:"로 밝힌다.
- **caption**: 풀이 요약 2~4문장 + 끝에 정답("따라서 답은 ③이다."). **accessibilityDescription**: 그림에 실제로 보이는 것을 한두 문장(대상·점·선·구간·색), 정답은 쓰지 않는다. plan에 넣지 않은 점·선 이름은 쓰지 않는다. 둘 다 한국어 평문이다. **입력용 표기(^, sqrt, *, \frac, $…$)와 "축척"이라는 말을 쓰지 않는다**(기호로 쓴다: x², √, ≤, ≥, π, −, ×, 분수는 1/3처럼 평문으로. "엑스·루트·제곱"처럼 소리로 풀어 쓰지 않는다). 영어 단어 금지(변수 이름은 허용). 검사기는 archive/tools/svg-language-contract.cjs 이고 스크립트가 caption·accessibilityDescription 에 적용한다.
- 문항에 없는 점·곡선·함수 이름을 그림이나 글에 쓰지 않는다. 쓰려면 caption에서 정의한다. 점 이름은 안쪽, 길이 치수선은 바깥. 라벨 자리가 없으면 지우지 말고 지시선(callout·leader)부터 쓴다. 좌표 라벨은 coordinatePlacement "PANEL"(그림 위 띠)을 쓰지 않고 점 곁에 단다.
- 직선·곡선·원·영역이 여럿이면 색을 달리하고(필요하면 점선·음영) 이름을 대상 곁에 단다. y=x·기울기 ±1 직선·원이 있는 단일 유리·무리함수 그래프는 graphPlan.equalUnits:true.
- 눈금 값에 0을 넣지 않는다(INVALID_AXIS_TICK_VALUE). 근호가 든 좌표는 SOURCE_POINT 식으로 직접 준다. 입력용 식이 엔진 필드에서 요구되는 곳(수식 필드)은 본보기를 따른다.
- 구간별 함수·끊어지는 함수·삼차 근호 교점 등의 엔진 한계는 HANDOFF의 "엔진에서 실제로 걸린 것"을 먼저 본다.
- **손으로 SVG를 쓰거나 고치지 않는다**(엔진 산출물만). 스크립트로 SVG를 조립하지 않는다. 시험지 JS 원문·archive/assets·엔진 코드는 수정하지 않는다. 발문·보기는 고치지 않는다. 검사를 완화하지 않는다. 이름·명령줄 패턴으로 프로세스를 종료하지 않는다(다른 작업이 같이 죽는다).
- 파일은 UTF-8로 쓴다. 셸 echo·리다이렉션·PowerShell을 쓰지 말고 Write 도구 또는 node/python의 파일 쓰기(encoding utf-8)를 쓴다. 쓴 뒤 한글이 ?나 깨진 글자로 바뀌지 않았는지 다시 읽어 확인한다.

[끝내기 전 점검 — 문항마다]
plan.json 글자가 caption·accessibilityDescription 규칙을 지키는가 / 렌더 status가 ARCHIVE_BOUND이고 마지막 렌더가 마지막 plan 수정보다 나중인가(plan을 고쳤으면 다시 렌더) / fig.png 를 만들고 직접 봤는가 / 해설이 쓰는 값이 그림에서 읽히는가 / result.json 이 있는가 / 판정이 FIGURE가 아니면 plan 폴더에 q<번호>-solution.json 이 없는가.

[끝까지 진행] 시간 제한이 느슨하다(시험지당 1~2시간도 정상). 대상 문항 전부에 result.json 이 생길 때까지 멈추지 않는다. "일부만 했다"고 끝내지 않는다. 문항 하나를 끝낼 때마다 그 문항의 산출물을 바로 남긴다. 엔진이 못 그리는 문항에서 오래 붙들지 말고 규칙(문항당 5회)대로 UNSUPPORTED로 두고 다음으로 간다.
최종 메시지는 <OUT>/SUMMARY.md 경로 한 줄.
