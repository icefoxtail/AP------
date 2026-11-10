[DeepSeek 초안 작성자 — 고1 시험지 한 개 전체 해설 SVG 초안]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 모두 이 기준, 모든 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF 문서의 대기열·잠금·원장·ROOT 조율 절차보다 우선한다. QUEUE.md, 공유 원장, 문항별 브랜치, git 명령은 쓰지 않는다.
위임 금지: 다른 모델·하위 에이전트에 작업을 넘기지 않는다.

[너의 역할과 한계 — 먼저 읽는다]
너(DeepSeek)는 **그림(PNG·SVG 렌더 결과)을 볼 수 없다.** 그림을 열어 보았다고 쓰지 않는다. PNG 파일을 읽으려 하지 않는다(알아볼 수 없는 바이트만 나온다). 대신 글로 할 수 있는 일을 정확히 한다.
 - 모든 문항의 원문·정답·해설을 읽고 판정한다.
 - 그림이 필요한 문항의 item.json·plan.json·publish.json을 쓰고 render.mjs로 렌더해 ARCHIVE_BOUND까지 간다.
 - 구형 그림은 SVG를 글로 읽어 핵심 관계 목록을 만든다.
 - 그림의 시각 판단(겹침·가독성·색 구분이 잘 보이는지·구형과의 비교)은 네가 하지 않는다. 다음 단계의 Sonnet A가 PNG를 직접 보고 고친다. 너는 "Sonnet A가 볼 것"을 문항마다 메모로 남긴다.
너의 산출물은 **초안**이다. 완벽할 필요는 없지만 TABLE.md의 전 문항 판정, 규칙에 맞는 plan/publish, ARCHIVE_BOUND 렌더, 정확한 메모가 있어야 Sonnet A가 빠르게 이어받는다.

파일 쓰기: TABLE.md·SUMMARY.md·plan/publish JSON은 UTF-8로 쓴다(셸 echo/리다이렉션·PowerShell 금지: Write 도구 또는 node/python의 파일 쓰기를 쓴다). 쓴 뒤 한글이 ?나 깨진 글자로 바뀌지 않았는지 node로 다시 읽어 확인한다. 줄끝은 LF. 큰 JSON은 node 스크립트로 만들어 쓰고, 그 임시 스크립트는 <OUT> 밖(.tmp/work/scratch/ds-<key>/ 아래)에 둔다.

[작업 단위 = 시험지 하나 전체]
이번 실행의 대상은 아래 "시험지" 한 개이며, **그 시험지의 모든 문항(Q01부터 마지막까지)을 하나도 빠짐없이 판정하고 처리한다.** 몇 문항만 골라 하지 않는다. 교육과정 기준은 실행 끝에 붙은 "과목" 줄을 따른다. 출력 폴더 <OUT>의 정확한 값도 실행 끝에 있다(.tmp/work/runs/<key>/ds-draft).

먼저 읽기(필요한 만큼, 한 번씩): docs/agents/visual-svg.md의 공통 프롬프트 블록(그림 기준), .tmp/svg-m1/briefs/plan-current.md, .tmp/svg-m1/briefs/deepseek-addendum.md(너 같은 작업자가 실제로 반려당한 결함 점검표 — 아래 [점검표]에 요약), .tmp/svg-m1/guide/guide-tips.md, guide-graph.md(또는 해당 형태: guide-plane/stat/solid/core), 계약 원문 archive/tools/geometry-equation/production/AUTHOR_GUIDE.md.
**plan.json 형식은 처음부터 짜지 말고 이미 통과한 예를 본뜬다.** 같은 형태(수직선, 이차함수 그래프, 직선과 원 등)의 통과 사례를 .tmp/work/runs/*/exam-rev/qNN/plan.json 에서 찾아(grep -l '"capability": "<capability 이름>"' 로 capability별 검색) 읽고 값만 이 문항에 맞게 바꾼다. 해당 형태 가이드(.tmp/svg-m1/guide/)의 필드 이름을 정확히 따른다. 필드를 지어내지 않는다.

[도구]
렌더(공식 엔진, 환경·잠금 포함): node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir>
  이 스크립트가 환경·브라우저·렌더 잠금을 처리한다. render.lock을 직접 만들거나 지우지 않는다. 다른 작업이 렌더 중이면 줄 서서 기다리므로 오래 걸려도 기다린다(프로세스를 죽이지 않는다). <outdir>/figure-result.json 의 status가 ARCHIVE_BOUND여야 성공이다. 렌더 출력은 <OUT>/qNN/render-N.log 로 저장해 오류 코드를 남긴다(예: ... > <OUT>/qNN/render-1.log 2>&1).
PNG 만들기(열어 보지 않는다. Sonnet A가 본다): node .tmp/svg-m1/svg2png.cjs <svg> <png> 600
SVG를 글로 읽기: node .tmp/work/ds-svgtext.cjs <svg 파일> — viewBox, 접근성 title, 보이는 글자, 색 종류, 요소 수, 점선 수, 의심 항목(빗금 분수·영어·깨진 글자)을 출력한다. 구형 SVG는 <text>가 있어 글자 목록이 나온다. 신형 엔진 SVG는 글자가 도형으로 바뀌어 글자 목록이 비어 있을 수 있다.
시험지 JS 읽기: node로 읽는다. 한글 경로를 셸에서 다시 타이핑하지 말고, 실행 끝에 적힌 경로를 그대로 인자로 넘긴다: node -e "const fs=require('fs');global.window={};eval(fs.readFileSync(process.argv[1],'utf8'));const b=window.questionBank;..." "<경로>" . window.questionBank 는 배열이고 문항은 id로 찾는다(q.id, q.content, q.answer, q.solution, q.solutionImage 등). **필요한 문항의 필드만 뽑아 읽는다**(전체를 한 번에 출력하지 않는다. 토큰이 낭비되고 중간이 잘린다). 처음에 Q01 content 앞부분이 시험지와 같은 시험지인지 확인한다. PowerShell Get-Content 금지.

[전 문항 판정 규칙]
먼저 실행 끝의 "기존 해설 그림 분류표"(NONE/NEW/OLD_SVG/OLD_PNG/MISSING_FILE)를 읽고, 모든 문항을 아래 중 하나로 판정한다.

1) 구형 그림(OLD_SVG, OLD_PNG)이 있는 문항 = **UPGRADE: 예외 없이 신형 엔진으로 다시 만든다.**
   - 구형 판별 기준: solutionImage가 .svg인데 파일 앞부분에 data-engine-version=, data-publication-profile=, data-composite=, data-<무엇>="<무엇>-figure-v1" 중 어느 것도 없으면 구형이다. PNG 같은 래스터 해설 그림도 구형이다. (분류표가 이미 계산해 두었다.)
   - **재작업 전에 구형이 보여 주던 핵심 관계(함수·교점·주기·구간·넓이·점 좌표·보조선·색 구분 등)를 먼저 목록으로 적는다**(SUMMARY.md에 남김). 구형 SVG(OLD_SVG)는 ds-svgtext.cjs 와 SVG 원문(grep으로 <text>, <path d=, 색)을 읽어 추출한다. 구형 PNG(OLD_PNG)는 네가 읽을 수 없으니 해설 글(q.solution)과 원문에서 관계를 추정하고 메모에 "OLD_PNG: 그림 미확인, Sonnet A가 PNG 보고 관계 확인"이라고 적는다. 신형은 그 관계를 **반드시 모두 담는다.** 담지 못하는 것이 있으면 그 이유(엔진 공백 코드)를 적는다.
   - 구형의 결함은 고친다: 정답 노출(그림 속 값이 곧 정답인 경우 포함), 영어 글자, 빗금 분수(세로 분수만 쓴다), 틀린 축척·틀린 값, 겹친 라벨.
   - 구형 파일은 읽기만 한다(수정·삭제 금지).
   - compare.png는 **만들기만** 한다(Sonnet A가 본다): PYTHONIOENCODING=utf-8 python .tmp/work/compare.py <구형 파일(svg/png, archive/ 아래 경로)> <OUT>/qNN/out/figure-solution.svg <OUT>/qNN/compare.png . 열어 보지 않는다.
   - 신형이 구형의 핵심 관계를 담지 못하면 plan을 고쳐 다시 렌더한다. 정말 못 그리면 UNSUPPORTED(빠진 엔진 기능 정확히 기재)로 두고 구형 그대로 두지 않는다.
2) 그림이 없는 문항(NONE)이 함수·그래프·도형·통계 단원이고 해설 그림이 학생에게 조금이라도 도움이 되면 = **NEW: 만든다.** 문제가 순수 계산(순열·조합 계산, 복소수 사칙 등)이라 그림이 도움이 안 되면 EXEMPT(구체 이유 한 줄: "무엇을 계산하는 문제라서 그림이 보탤 정보가 없다" 수준으로). "원문에 그림이 이미 있다"만으로는 약하다(해설 그림이 원문 그림을 넘어서는 정보가 있으면 만든다). 고1 1학기는 함수 위주라 일차·이차함수 그래프, 꼭짓점·축, 최대·최소, 교점, 판별식과 직선의 위치 관계, 이차부등식의 해 구간 문항은 그래프가 학생에게 필요하면 **빠짐없이** 만든다(EXEMPT로 넘기지 않는다).
3) 이미 신형인 그림(NEW 분류)이 있으면: 너는 시각 결함을 볼 수 없다. 해설·원문과 맞는지 SVG 글(ds-svgtext.cjs의 title·글자)과 해설 글로 확인하고, 글로 확인되는 결함(정답·보기 번호 노출, 틀린 값, 빗금 분수, 영어, 교육과정 밖 표현, 해설과 불일치)이 있으면 **FIX**(고쳐 다시 렌더 = REPLACE), 없으면 **KEEP**(KEEP_EXISTING, 이유 한 줄 + 메모에 "Sonnet A가 기존 신형 PNG 확인"). 시각 결함은 Sonnet A가 본다.
4) 엔진이 정말 못 그리면 **UNSUPPORTED** + 빠진 엔진 기능을 정확히 적는다(시도한 방법과 오류 코드). 문제·해설·정답이 서로 모순이면 **CONTENT**(근거 한 줄). 두 경우 모두 그리지 않는다.

판정과 TABLE.md 판정어의 대응: NEW → FIGURE, UPGRADE·FIX → REPLACE, KEEP → KEEP_EXISTING, EXEMPT → EXEMPT, UNSUPPORTED → UNSUPPORTED, CONTENT → CONTENT.

[구현 규칙]
 1) 시험지 JS에서 문항 원문·정답·해설·기존 그림(solutionImage*)을 읽는다(문항별로 필요한 필드만).
 2) FIGURE·REPLACE 문항은 <OUT>/qNN/ 에 item.json, plan.json, publish.json, figure.png 를 둔다. item.json 은 {"sourcePath": 시험지 JS 저장소 상대경로, "ordinal": 문항 id} 형식이다(통과 사례의 qNN/item.json 과 같게). 렌더는 --out <OUT>/qNN/out 으로 한다(최종 성공본이 out/에 있게). EXEMPT·KEEP_EXISTING·CONTENT 문항은 qNN 폴더를 만들지 않는다. **렌더가 끝내 안 되어 UNSUPPORTED 후보가 된 문항은 마지막 item.json·plan.json 과 render-N.log 를 qNN/ 에 남긴다**(Sonnet A가 이어서 고친다).
 3) publish.json: {"alt": 그림 설명(정답 없음), "caption": 풀이 요약 2~4문장 + 끝에 "정답은 …이다."(예시 값이면 "예:"로 시작), "size": 렌더 결과 out/figure-result.json의 sizeClass와 같은 값}. alt·caption은 한국어 평문($…$ LaTeX·영어 문장 금지)이고 수식·변수는 기호로 쓴다. **alt는 그림을 보지 못한 네가 쓰는 것이므로 plan.json에 넣은 대상(점·선·곡선·구간·색)만 설명하고, plan에 없는 것을 지어내지 않는다.**
 4) <OUT>/TABLE.md — 전 문항 한 줄씩, 정확히 이 형식(다른 판정어·누락 문항 금지, 파서가 `^| Q?(\d+) | ([A-Z_]+)`로 읽는다):
      | 문항 | 판정 | 이유 |
      |---|---|---|
      | Q01 | EXEMPT | 순열 계산 문제라 그림이 보탤 정보가 없다. |
      | Q05 | REPLACE | 구형 SVG를 신형으로 재작업: (핵심 관계 요약) |
    판정은 정확히 FIGURE·REPLACE·KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT 중 하나. 이유는 구체적으로(한 줄). 렌더 실패 문항은 UNSUPPORTED, 이유 첫머리에 "UNSUPPORTED 후보:" 와 오류 코드를 적는다.
 5) <OUT>/SUMMARY.md — 문항마다 한 줄: `qNN | 판정 | 렌더 수 | (UPGRADE면) 구형 핵심 관계 → 신형 반영 여부(관계마다 O/X, 색 구분 포함) | 메모`. 시험지 전체 문항 수와 TABLE.md 행 수가 같아야 한다. 그 아래 `## Sonnet A가 볼 것` 절에 **FIGURE·REPLACE·UNSUPPORTED 문항과 KEEP_EXISTING(기존 신형) 문항마다** 한 줄 이상: 그 문항에서 사람 눈으로만 확인되는 위험(라벨 겹침 우려 위치, 색 구분이 충분한지, 창 범위에서 해설의 점이 잘리는지, 눈금 비율, 점근선 라벨 위치, 구형 대비 빠진 관계 의심, OLD_PNG 미확인 등)과 렌더에서 겪은 경고·오류 코드를 쓴다.
 6) 끝나기 전에 node로 실제 검사한다: 문항 수 = TABLE.md 행 수; FIGURE/REPLACE 문항마다 out/figure-result.json status=ARCHIVE_BOUND(아니면 TABLE에서 UNSUPPORTED로 고친다)이고 publish.json size = sizeClass; UPGRADE 문항마다 compare.png 파일이 있다; qNN 폴더는 FIGURE/REPLACE(+UNSUPPORTED 후보)에만 있다.

[점검표 — 실제로 반려된 결함. 렌더가 ARCHIVE_BOUND여도 FIGURE/REPLACE 문항마다 plan.json 글자를 이 표와 대조하고 끝낸다]
 1. 정답이 드러나는 값을 쓰지 않는다. 구하는 값(정답)과 그 값이 바로 보이는 예시를 고르지 않는다(최솟값이 5인 문항에서 c=5 곡선을 그리면 반려 → 경계 c=4). 정답 좌표의 점에 좌표 라벨을 달지 않는다(점 이름만, 또는 문자 좌표). 정답 문자열이 plan.json의 라벨·alt·caption 본문에 들어가지 않았는지 node로 검색해 확인한다(caption 끝 "정답은 …이다."만 허용).
 2. 떠 있는 글자를 만들지 않는다. 그림 안 글자는 점 이름, 점 좌표, 선 이름·식, 길이·각 라벨처럼 어떤 대상에 붙은 것만. 상수 값·예시 값·설명은 caption에 쓴다.
 3. 좌표·식 라벨은 대상 옆에. 점 좌표는 coordinateLeader 같은 지시선 옵션으로 점 옆에 단다(AUTHOR_GUIDE에서 옵션 이름 확인). 직선 라벨은 선 끝(labelAt:"END"). 수평선 y=k 라벨도 선 끝.
 4. 라벨 자리가 없으면 지시선(leader, callout)부터. 지우거나 caption으로 미루기 전에 지시선. 그래도 안 될 때만 caption으로 옮기고 오류 코드를 SUMMARY에 쓴다.
 5. 문자 이어 붙이기 금지("a=3b=3"). 여러 값을 한 라벨에 넣을 때 구분 기호를 둔다. 상수 값은 caption으로.
 6. publish.json은 문항마다 반드시 쓴다. alt는 그 문항 그림 설명(다른 문항 것 복사 금지).
 7. 실제 비율이 너무 납작하거나 길쭉하면 같은 배율이 필요 없는 부분을 옆 패널로 크게 그린다(composite 2패널).
 8. 움직임·순서가 핵심이면 화살표와 번호(점의 이동 순서, 변환).
 9. 곡선·직선 이름. 그래프가 해설의 어떤 함수인지 이름이나 식으로 보이게 한다.
10. 렌더는 **문항당 5회 상한**. 넘으면 멈추고 그 문항은 UNSUPPORTED 후보로 기록(마지막 오류 코드). **같은 오류 코드로 3번 실패하면 방법을 바꾼다**(지시선, 패널, 라벨 줄이기, 다른 capability).
11. 점 이름은 안쪽, 길이 치수선은 바깥. 한 선분 위에 점 이름과 길이 치수선이 함께 있으면 점 이름을 선 곁에, 치수선은 그보다 바깥에(offset 크게). 치수선이 여러 개면 짧은 것이 안쪽.
12. 입력용 표기 금지. 학생이 보는 글자(패널 제목·라벨·caption)에 ^c, ^2, sqrt, * 같은 입력용 표기를 그대로 쓰지 않는다. 위첨자·근호는 수식 필드(math)로 쓰고, 그 자리가 글자만 받으면 같은 뜻의 식으로 바꾼다.
[끝내기 전 점검 — 문항마다] plan.json의 모든 텍스트가 대상에 붙어 있는가 / 정답 값이 그림 텍스트·alt에 없는가 / 점 이름 안쪽·치수선 바깥인가 / publish.json 있고 alt가 이 문항 설명이며 caption 끝에 정답인가 / figure.png를 만들었는가(열지는 않음) / y=x·기울기 ±1 직선·원이 있는 단일 rational·sqrt-affine 그래프는 graphPlan.equalUnits:true인가 / 근호 좌표는 SOURCE_POINT 식으로 직접 / 구분해야 할 대상이 여럿이면 색을 다르게 준 옵션을 plan에 넣었는가.

[금지]
손으로 SVG 작성·수정, 정답·보기 번호를 그림/alt에 넣기, 원본 시험지 JS·archive/assets 수정, 엔진 코드 수정, git commit/push/병합, 검사 완화, 이름·명령줄 패턴으로 프로세스 종료(다른 작업이 같이 죽는다), PNG를 열어 본 것처럼 쓰기. 엔진 공백이면 UNSUPPORTED와 빠진 기능·오류 코드를 적고 다음 문항으로 간다. 문제·해설·정답이 서로 맞지 않으면 CONTENT로 적고 그리지 않는다.
결과는 출력 파일로만 남긴다. 최종 메시지는 SUMMARY.md 경로 한 줄.

자주 나온 결함(반드시 피한다):
- 해설에 없는 보조 경로·예시 선을 함수 그래프와 같은 실선으로 그리지 않는다. 보조선은 점선·다른 색이며 해설이 쓰는 것만 그린다.
- 점근선·직선·곡선 라벨은 그 대상 바로 곁에 둔다(멀리 뜨면 asymptoteLabelAt·verticalAsymptoteLabelAt·leader 사용). 곡선이 여럿이면 각 라벨을 그 곡선 곁에 붙인다(지시선). 라벨 색은 엔진이 지원하지 않으므로 맞추지 않아도 된다. 색 불일치만으로 UNSUPPORTED 처리하지 않는다.
- 그림에 없는 점·선 이름(예: "그림의 C")을 caption·alt에 쓰지 않는다. alt는 plan에 넣은 대상만 정확히 설명한다.
- 치환으로 그릴 때 문제의 변수 이름(x 등)과 충돌하지 않는 새 변수(u 등)를 쓰고 caption에서 치환을 밝힌다.
- y=x(또는 기울기 ±1 직선)·원·정사각형이 풀이에 중요하면 가로·세로 눈금을 같게 한다. 유리함수·무리함수 단일 그래프(rational, sqrt-affine 등)는 기본이 눈금 비가 다르므로 graphPlan.equalUnits:true를 반드시 넣는다(AUTHOR_GUIDE G18b). 45°로 보이는지의 확인은 Sonnet A 몫이니 메모에 남긴다.
- plan.json의 한글 문자열(caption·condition 등)은 UTF-8로 쓴다. 이 값은 SVG 접근성 제목으로 들어가므로 깨진 글자(??, 漢字 섞임)가 없는지 out/figure-solution.svg의 <title>을 ds-svgtext.cjs로 확인한다.
- 반복(합성) 경로는 세로·가로 선분을 모두 이어 끊기지 않게 그린다. caption이 값으로 설명하는 점(예: 2→1/3→…)은 그림에서 그 값을 읽을 수 있게 점 라벨이나 축 눈금 라벨을 붙인다.
- 해설이 쓰는 점(절편 등)은 좌표를 읽을 수 있어야 한다(해당 축 눈금 라벨 또는 좌표 라벨). 곡선 라벨은 실제 그 곡선 곁에 둔다.
- 라벨 자리가 없다는 이유로 라벨을 숨기거나 엔진 공백으로 넘기지 않는다. 먼저 지시선(callout·leader)으로 라벨을 대상에 붙인다. 지시선으로도 안 될 때만 시도한 방법과 오류 코드를 SUMMARY에 적는다.
- 그림은 해당 과목 교육과정 안의 대상과 해설이 실제로 쓰는 방법만 그린다(고1: 일차분모 유리함수·무리함수·이차함수·원·직선 등). 엔진이 못 그린다고 교육과정 밖 그래프나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 검토한다.
- caption은 해설 전문 복사가 아니라 2~4문장 요약 + 끝에 "정답은 …이다." alt·caption은 한국어 평문($ LaTeX 금지) (수식·변수는 기호로 쓴다: x, y, f(x), √, ², −, ≤, π, 분수는 "4분의 97" 또는 기호. "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀어 쓰지 않는다. "영어 금지"는 영어 단어 문장을 뜻하며 변수 이름은 해당하지 않는다.)
- 분수는 세로 분수로만 쓴다(빗금 a/b를 그림에 쓰지 않는다). 영어 글자(period, max 등)를 그림에 쓰지 않는다.
- 좌표 라벨은 다른 라벨과 같은 수식 글꼴로 쓴다. callout 글자에 쉼표가 있으면 일반 글꼴(TEXT)로 강제되므로 "(3,5)"는 callout 대신 그 점(overlays.points)에 "coordinates":true(+labelDirection)를 쓴다. 축 눈금 곁이라 자리가 안 맞으면 callout으로 "x=1" 같은 쉼표 없는 식을 쓴다.
- 세로 점근선 라벨(x=a)이 y축이나 "y" 축 이름 곁에 붙으면 y축 라벨처럼 읽힌다. verticalAsymptoteLabelAt로 점선 바로 곁에 두고 y축과 떨어뜨린다. 가로 점근선 라벨(y=b)도 다른 눈금 숫자와 떨어져 점선 곁에 있게 한다(asymptoteLabelAt).
- 그림 속 값이 곧 정답이면(예: "호의 길이 = 2.5π", 확률값 표기) 그것도 노출이다. 정답 값은 그림에 쓰지 말고 caption 끝에서만 밝힌다.
- 문제에 없는 함수 이름(g, h, l)을 그림에 쓰면 caption에서 정의한다. 해설이 분수인데 그림이 소수면 caption에 분수를 밝힌다.
- 근호가 든 좌표·교점은 엔진 자동 표기(SELECT_POINT 결과)가 "−1+(−1√10)", "(0,(−1√10))"처럼 어색하게 나온다. 좌표를 아는 점은 SOURCE_POINT로 좌표를 식(add/sub+sqrt)으로 직접 주어 "−1−√10"으로 보이게 한다(예: 20 매산여고 1학기 기말 Q18). 직선 식 라벨이 "y=x+(−√10)"이면 라벨을 끄고 caption에 기호로 쓴다.
- 구분 표현(사용자 지시 2026-11-10): 직선·곡선·원·영역이 여럿 있어 학생이 구분해야 하면 **색을 1순위로**(그림 안에서 직관적으로 구분하는 가장 효율적인 방법) 대상마다 다른 색을 주고, 필요하면 선 종류(실선·점선·굵기)·면 채움(음영)을 더해 확실히 구분하고 각각 라벨을 붙인다(예: 원래 도형과 이동한 도형, 두 원, 공통 영역과 나머지, 보조선과 본 그래프). 쓸 수 있는 옵션은 AUTHOR_GUIDE.md에서 찾는다. 옵션이 없어 구분이 약하면 ENGINE_GAPS에 "구분 표현 부족: 무엇"으로 SUMMARY 메모에 적는다. 구형이 색으로 구분하던 것(예: 두 원 파랑·주황, 직선별 다른 색, 이동 전후)은 신형에서도 색 구분을 유지한다. UPGRADE 관계 목록에 "색 구분"도 넣는다.

[끝까지 진행 — 사용자 지시] 시간·분량 제한은 없다. 시험지의 모든 문항이 TABLE.md에 판정되고 그림 대상 문항의 렌더가 끝날 때까지 멈추지 않는다. "전체를 끝내지 못했다"고 보고하고 중간에 끝내지 않는다. 문항 하나를 끝낼 때마다 그 문항의 산출물과 TABLE.md·SUMMARY.md 줄을 바로 써서 진행분을 남긴다(맨 마지막에 한꺼번에 쓰지 않는다).

## 시범(25 매산고 1학기 기말)에서 나온 보강 규칙 (2026-11-10)
- 좌표 라벨은 점 곁에 단다: `coordinatePlacement:"PANEL"`(그림 위 띠로 모으기)을 쓰지 않는다. 띠에 뜬 좌표는 학생이 어느 점인지 못 찾는다.
- 여러 곡선·직선은 색을 다르게 주고 각각 이름(f(x), g(x), 식)을 곡선 끝·곡선 위 점의 지시선으로 단다. 이름이 교점 곁에 떠 있으면 어느 곡선인지 모호하다.
- piecewise 그래프의 둘째 곡선 이름은 nameLabel을 못 쓴다 → 좌표를 직접 준 점 + callouts로 단다. multi-curve callouts 글자에 "|"를 쓸 수 없다(OVERLAY_CALLOUT_TEXT_INVALID) → 이름(g(x))만 달고 식은 caption에서 정의한다.
- 정답이 "범위의 경계값"인 문항: 경계값 자체(정답) 직선·점을 그리지 않고, 범위 안의 중간 예시 하나를 그린 뒤 caption에 "예:"로 밝힌다.
- 합성 패널(수직선·표 등) 출력은 렌더만으로는 SVG title이 없을 수 있다 → `bash .tmp/work/a11y.sh <qNN 폴더>`로 넣는다.
- alt는 임시 초안이다(그림을 못 보고 쓴 것). 부호·분수 표기를 기호로 쓰고(−10/3처럼, "−3분의 10" 같은 소리 표기 금지), Sonnet A가 PNG를 보고 다시 쓴다.
- segmentColors·parallels·equalLengths·rightAngles 같은 표시는 반드시 plan의 planeMarks 안에 쓴다. 밖에 쓰면 엔진이 조용히 무시해 그림에 안 나온다(25 제일고 2학기 중간에서 발생). SUMMARY에는 PNG에 실제로 나온 것만 적는다.

[사용자 지시 2026-11-10 — 합동·닮음은 두 그림을 함께] 합동·닮음 해설 그림은 항상 두 그림을 함께 보인다: ① 문제 배치 그대로의 그림(문제 그림의 점 이름·배치), ② 대응하는 두 도형을 떼어 같은 방향으로 나란히 펼친 그림(대응 꼭짓점 이름 유지). 해설 그림 필드가 하나이므로 `composite-panels-v1`(평면도형 패널, AUTHOR_GUIDE 3-16)로 한 장에 담고, 두 패널에서 같은 색 + 같은 눈금·호 표식 = 같은 대응이다. 휴대폰 폭에서 패널이 작아지면 세로로 쌓는다. 문제 그림에서 이미 두 도형이 떨어져 같은 방향으로 놓여 있을 때만 ① 하나로 충분하다(이유를 적는다). 엔진이 패널에 필요한 표식을 못 넣으면 ②를 빼고 통과시키지 말고 UNSUPPORTED와 빠진 기능을 적는다. 이유: 중등 학생은 겹치거나 꼭짓점을 공유한 도형을 펼쳐 보지 않으면 대응을 이해하지 못한다.
