[Sonnet A — 고1 시험지 한 개 해설 SVG 구현·검수 (DeepSeek 초안 인계)]
작업 트리: C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-h1-batch1 (Git Bash; 모든 경로는 이 기준, 먼저 cd). 메인 지시에 시험지 JS 경로, 표 key, 초안 폴더가 있다: <JS>, <key>, <DS> = .tmp/work/runs/<key>/ds-draft(또는 메인이 지정한 ds-draft2 …). 결과는 <REV> = .tmp/work/runs/<key>/exam-rev 에 쓴다(이미 있으면 메인이 지정한 다른 폴더).
이 지시는 옛 흐름의 "루나 구현 + 루나 검수"를 한 번에 맡은 것이다. DeepSeek이 그림을 못 보고 만든 초안을 **네가 PNG를 직접 보고** 고쳐 최종 후보를 만든다. 뒤에 다른 Sonnet(B)이 한 번 더 최종 검수하고 게시한다.
완료 기준은 "학생이 PC·휴대폰에서 그림을 보고 풀이를 이해할 수 있는가"이다. 수치상 완벽주의는 하지 않는다.

금지: 손으로 SVG 작성·수정(렌더는 render.mjs로만), 정답·보기 번호를 그림/alt에 넣기, 원본 시험지 JS·archive/assets·엔진 코드 수정, git 명령, 다른 모델 위임, render.lock 직접 조작, 이름·명령줄 패턴으로 프로세스 종료(taskkill /IM, pkill 등. 다른 작업이 같이 죽는다). 렌더가 오래 걸리면 기다린다.
파일은 UTF-8로 쓴다(Write 도구 또는 node. PowerShell Get-Content/Set-Content 금지). 줄끝 LF.

[토큰 절약 — 반드시]
- 시험지 원문은 전체를 출력하지 않는다. node로 필요한 문항의 content·answer·solution·solutionImage만 뽑는다: node -e "const fs=require('fs');global.window={};eval(fs.readFileSync(process.argv[1],'utf8'));const b=window.questionBank;for(const n of [6,9]){const q=b.find(q=>q.id===n);console.log(n,q.answer,q.content,q.solution)}" "<JS>" (한글 경로는 인자로 넘기고 셸에서 다시 타이핑하지 않는다).
- PNG는 폭 600으로 만들고(node .tmp/svg-m1/svg2png.cjs <svg> <png> 600) 문항당 필요한 만큼만 연다. 같은 PNG를 반복해서 열지 않는다.
- 임시 스크립트·메모는 <REV> 밖(.tmp/work/scratch/<key>-sonnet/)에 둔다. <REV>에는 결과물(TABLE.md, REVIEW.md, qNN/, 필요하면 SUMMARY.md)만 둔다.
- 전체 테스트·런타임 검사는 하지 않는다(게시 단계 몫). 기계 점검은 이 지시의 [기계 점검]만.

[순서]
1. 입력 파악: <DS>/TABLE.md, <DS>/SUMMARY.md(특히 "## Sonnet A가 볼 것" 메모와 UPGRADE 구형 핵심 관계 목록), `node .tmp/work/exam-figs.cjs <JS>`(기존 그림 분류: NONE/NEW/OLD_SVG/OLD_PNG/MISSING_FILE). 첫 문항 Q01 content 앞부분을 node로 읽어 시험지가 맞는지 확인하고 REVIEW.md 첫 줄에 옮겨 적는다. CONTENT 판정이 3건 이상이면 원문을 잘못 읽은 것이니 다시 읽는다.
   과목: 1학기(중간·기말)는 함수 위주다. 일차·이차함수(그래프, 꼭짓점·축, 최대·최소, 교점, 판별식과 직선의 위치 관계, 이차부등식의 해 구간 등) 문항은 그래프가 학생에게 필요하면 빠짐없이 그림을 만든다. 2학기 중간은 도형의 방정식(점·직선·원·이동) 문항에 그림이 도움이 되면 만든다. 교육과정은 고1 범위 안(고2 내용 우회 금지).
2. 판정 검증(전 문항): DeepSeek 판정은 초안일 뿐이다. 분류표와 대조한다.
   - OLD_SVG/OLD_PNG 문항은 전부 REPLACE(또는 정당한 UNSUPPORTED/CONTENT)여야 한다. 구형이 그대로 남은 KEEP_EXISTING은 오류.
   - NEW 문항은 기존 신형 PNG를 직접 열어 결함이 없으면 KEEP_EXISTING, 있으면 REPLACE(FIX).
   - EXEMPT는 원문·해설을 읽어 확인한다. 순수 계산이 아니라 그래프·도형이 해설의 핵심이면 FIGURE로 바꿔 만든다. 이유가 약한 EXEMPT("원문에 그림이 있다", "간단하다")는 고치거나 FIGURE로 바꾼다. 1학기 함수 문항이 EXEMPT인데 그래프가 도움이 되면 반드시 만든다.
   - UNSUPPORTED(렌더 실패 후보)는 근거를 의심하고 plan을 고쳐 다시 그려 본다(DeepSeek은 5회에서 멈췄다). CONTENT는 원문으로 직접 확인한다.
3. 그림 문항(FIGURE/REPLACE, UNSUPPORTED 후보 포함)마다 <DS>/qNN 의 figure.png(없으면 svg2png로 생성)를 **직접 열어** 아래 [PNG 확인]을 하고, 고칠 것은 item/plan/publish를 고쳐 `RENDER_PRIORITY=1 node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <REV>/qNN/out` 로 ARCHIVE_BOUND까지 다시 렌더한다(횟수 제한 없음, 같은 오류 3번이면 방법을 바꾼다: 지시선·패널·옵션). 손 SVG 금지. 못 그리면 UNSUPPORTED(빠진 엔진 기능과 오류 코드를 정확히)로 두고 qNN 폴더는 만들지 않는다.
   고칠 것이 없는 문항은 <DS>/qNN 을 out/ 포함 그대로 <REV>/qNN 으로 복사한다(복사 뒤 figure.png 가 svg보다 오래됐으면 다시 만든다).
4. 결과 정리(아래 [결과 형식]), 기계 점검, 끝.

[PNG 확인 — 문항마다 직접 열어서]
1) 원문·정답·해설과 맞는가: 함수·교점·꼭짓점·구간·점 좌표 값이 맞고, 해설이 쓰는 점·교점·점근선이 창 안에 보이는가. 값이 틀리면 원문 기준으로 plan을 고친다.
2) 라벨이 대상 곁에 있고 겹치거나 잘리지 않는가. 점근선 라벨은 자기 점선 곁(y축 이름·눈금 숫자 곁이 아님), 곡선이 여럿이면 각 라벨이 그 곡선 곁(지시선 가능). 라벨을 지워 통과시키지 않는다(지시선·callout 우선).
3) 정답·보기 번호(①~⑤)가 그림·alt에 없는가(그림 속 값이 곧 정답이어도 노출). caption 끝에 "정답은 …이다."(예시 값이면 "예:"). 구하는 값과 같은 예시 곡선·점을 그리지 않는다.
4) 구분해야 할 대상(직선·곡선·원·영역·이동 전후·보조선)이 여럿이면 **색이 1순위**로 달라야 한다(필요하면 선 종류·음영 추가, 각각 라벨). 구형이 색으로 구분하던 것은 신형에서도 유지한다. 옵션이 없어 구분이 약하면 REVIEW 메모에 "구분 표현 부족: 무엇".
5) 해설에 없는 보조선이 그래프처럼 보이지 않는가(보조선은 점선·다른 색, 해설이 쓰는 것만). 그림에 없는 점·선 이름을 caption·alt가 가리키지 않는가. 문제에 없는 함수 이름(g, h)은 caption에서 정의. 치환 변수가 문제 변수와 충돌하지 않는가.
6) y=x·기울기 ±1 직선·원·정사각형이 있으면 가로·세로 눈금이 같은가(y=x가 45°). 유리함수·무리함수 단일 그래프는 graphPlan.equalUnits:true. 반복(합성) 경로가 끊기지 않았고 caption이 말하는 점의 값을 그림에서 읽을 수 있는가.
7) 글자: 좌표·값 라벨이 다른 라벨과 같은 수식 글꼴인가("(3,5)"는 callout 대신 점(overlays.points)에 coordinates:true). 빗금 분수(세로 분수만)·영어 글자·입력용 표기(^2, sqrt, *)·떠 있는 글자·깨진 글자가 없는가. 근호 좌표·교점은 엔진 자동 표기(SELECT_POINT)가 "−1+(−1√10)"처럼 어색하니 SOURCE_POINT로 좌표를 식(add/sub+sqrt)으로 직접 주어 "−1−√10"으로 보이게 하고, 직선 식 라벨이 "y=x+(−√10)"이면 라벨을 끄고 caption에 기호로 쓴다. 점 이름은 선 곁 안쪽, 치수선은 바깥.
8) 교육과정 안인가: 엔진이 못 그린다고 교육과정 밖 그래프나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 본다.
9) alt·caption: 한국어 평문($LaTeX·영어 문장 금지), 수식·변수는 기호(x, y, f(x), √, ², −, ≤, π, 분수는 "4분의 97" 또는 기호. "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀지 않는다), caption은 해설 복사가 아닌 2~4문장 요약+끝 정답. alt는 그림에 실제 보이는 것만(DeepSeek이 그림을 못 보고 쓴 alt는 PNG와 대조해 고친다). publish.json size = out/figure-result.json 의 sizeClass(다르면 sizeClass로 맞춘다).
10) UPGRADE(REPLACE로 구형을 대체) 문항은 compare.png(PYTHONIOENCODING=utf-8 python .tmp/work/compare.py <구형 archive 경로> <REV>/qNN/out/figure-solution.svg <REV>/qNN/compare.png)를 열어 구형의 핵심 관계(함수·교점·주기·구간·넓이·점 좌표·보조선·색 구분)가 신형에 모두 있는지 본다. DeepSeek이 적은 구형 관계 목록이 실제 구형 그림과 맞는지도 확인한다(구형 PNG는 DeepSeek이 보지 못했다). 빠진 관계는 plan을 고쳐 다시 렌더하고 compare를 다시 만든다. 신형이 구형보다 나쁘면 고친다. 구형 파일은 읽기만 한다.

[결과 형식] — 게시 스크립트(make-dec-exam.cjs, build-pub.py)가 그대로 읽는다
- <REV>/TABLE.md: 최종 판정 전 문항 한 줄씩. 형식 정확히 `| 문항 | 판정 | 이유 |` 머리와 `|---|---|---|` 아래에 `| Q05 | REPLACE | 이유 |`. 판정은 FIGURE·REPLACE·KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT 중 하나(파서 `^\|\s*Q?(\d+)\s*\|\s*([A-Z_]+)`). 행 수 = 시험지 문항 수, 시험지 JS에 없는 문항 번호 금지. 판정을 바꾼 문항은 이유에 "검수에서 …로 변경: …". FIGURE/REPLACE 인데 <REV>/qNN/out/figure-solution.svg 가 없으면 게시 스크립트가 UNSUPPORTED로 처리하니, 표와 폴더를 일치시킨다.
- <REV>/qNN/: **최종 FIGURE·REPLACE 문항 전부**. 각 폴더에 item.json, plan.json, publish.json, figure.png, out/figure-solution.svg, out/figure-result.json(+out/ 나머지), UPGRADE면 compare.png. KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT 문항은 qNN 폴더를 만들지 않는다. 게시에서 빼려는 폴더는 `x-qNN-<사유>` 로 이름을 바꾼다.
- <REV>/REVIEW.md: 첫 줄 = Q01 content 앞부분(원문 읽기 확인). 아래 문항별 한 줄: `qNN | PASS(무수정)/FIXED(무엇을)/JUDGMENT_CHANGED(무엇→무엇)/KEEP_EXISTING/EXEMPT_CONFIRMED/UNSUPPORTED/CONTENT | 메모`. UPGRADE는 핵심 관계 보존 O/X를 메모에. "PASS(무수정)"은 위 [PNG 확인]을 실제로 했을 때만 쓴다. 맨 끝에 DeepSeek 초안 대비 바뀐 점 요약, 엔진 공백(엔진이 못 그려 타협한 것)·구분 표현 부족은 따로 한 줄씩.

[기계 점검 — 끝내기 전 node로 한 번]
문항 수 = TABLE.md 행 수; FIGURE/REPLACE 문항마다 out/figure-result.json status=ARCHIVE_BOUND 이고 identity.questionUid = "<JS 파일명(확장자 제외)>|<문항 id>"; publish.json size = sizeClass; alt·caption 비어 있지 않음, alt에 ①~⑤ 없음, SVG <title> 글자 깨짐(?) 없음; OLD 분류 문항이 모두 REPLACE/UNSUPPORTED/CONTENT; UPGRADE마다 compare.png 있음; y=x·기울기 ±1 직선·원이 든 단일 rational/sqrt-affine 그래프는 equalUnits:true.

[끝까지 진행] 시간·분량 제한은 없다. 시험지의 모든 문항이 TABLE.md에 판정되고 그림 문항의 PNG 확인·렌더가 끝날 때까지 멈추지 않는다. 문항 하나를 끝낼 때마다 그 문항의 산출물과 TABLE.md·REVIEW.md 줄을 바로 써서 진행분을 남긴다.
최종 보고(짧게, 한국어): 시험지 key | 문항 수 | 그림 문항 수(FIGURE/REPLACE) | qNN별 PASS/FIXED(무엇)/ADDED/UNSUPPORTED 한 줄씩(PASS는 묶어서), 엔진 공백, 대표 PNG 경로 2~3개, TABLE.md를 DeepSeek 초안에서 바꿨는지.

## 시범(25 매산고 1학기 기말)에서 나온 보강 규칙 (2026-11-10)
- 좌표 라벨은 기본으로 점 곁에 단다. 점이 빽빽해 곁에 둘 자리가 없으면 그림 위 좌표 띠(이름이 붙은 A(x, y) 꼴)를 써도 정상이다(사용자 선호, 학원 PC와 통일 2026-11-10). 고칠 대상은 (1) 자리가 넉넉한데 띠로 밀린 경우, (2) 띠의 좌표에 점 이름이 없어("(2,1)"만) 어느 점인지 모르는 경우, (3) 띠에 정답 값이 찍힌 경우, (4) 식·설명 글자가 대상 없이 떠 있는 경우다.
- 여러 곡선·직선은 색을 다르게 주고 각각 이름(f(x), g(x), 식)을 곡선 끝·곡선 위 점의 지시선으로 단다. 이름이 교점 곁에 떠 있으면 어느 곡선인지 모호하다.
- piecewise 그래프의 둘째 곡선 이름은 nameLabel을 못 쓴다 → 좌표를 직접 준 점 + callouts로 단다. multi-curve callouts 글자에 "|"를 쓸 수 없다(OVERLAY_CALLOUT_TEXT_INVALID) → 이름(g(x))만 달고 식은 caption에서 정의한다.
- 정답이 "범위의 경계값"인 문항: 경계값 자체(정답) 직선·점을 그리지 않고, 범위 안의 중간 예시 하나를 그린 뒤 caption에 "예:"로 밝힌다.
- 합성 패널(수직선·표 등) 출력은 렌더만으로는 SVG title이 없을 수 있다 → `bash .tmp/work/a11y.sh <qNN 폴더>`로 넣는다.
- DeepSeek 초안의 alt는 임시본이다. PNG를 보고 실제 보이는 것으로 다시 쓴다.
- 끝나면 <REV>/IMPL_DONE 빈 파일을 만든다(메인이 다음 단계 시작 신호로 쓴다).
- 좌표 직선·원은 색 옵션이 없다 → planeMarks의 색 선분·강조 호(segmentColors 등)로 덧그려 구분한다. DeepSeek이 이런 표시를 planeMarks 밖에 써서 무시되는 일이 있다(SUMMARY 과장 주의, PNG만 믿는다).
- 점 이름 라벨은 위치를 직접 못 정한다. 이름이 선 건너편·먼 곳에 놓이면 coordinateCanvas 크기·비율을 바꿔 다시 렌더한다(25 팔마고 2학기 중간 Q18에서 해결). 엉뚱한 곳을 가리키는 라벨은 두지 않는다.
- alt·caption의 분수는 "3분의 20"처럼 쓴다(20/3 금지).
- 고1 교육과정 밖 그래프 금지: 삼차 이상 다항함수의 그래프(극대·극소·접함 모양)는 고1에서 배우지 않는다. 해설이 인수분해·대입으로 끝나면 EXEMPT로 둔다(24 제일고 2학기 중간 Q14, 메인 판정).
- alt·caption의 분수에서 분자·분모가 여러 항이면 괄호로 묶는다: "2분의 (k−1)", "3분의 (3−2√6)". "2분의 k−1"은 범위가 모호하다(Sonnet B가 반복해서 고친 결함).
- 색 순서(학원 PC와 통일, 2026-11-10): 서로 다른 함수는 BLUE → WARM(주황) → GREEN → ROSE 순서. 직선(접선·y=k)은 곡선과 다른 색. 영역 S₁·S₂는 다른 색, 넓이가 같은 영역은 같은 색. 정의역·치역은 다른 색. 평면도형의 같은 각·같은 길이·대응변은 같은 색 묶음, 구하는 각과 주어진 각은 다른 색. caption·alt에 색 이름을 적는다.
- 대문자 4자 이상 연속 점 이름("ABCDE")은 런타임 학생 언어 검사에서 영어 단어로 걸린다(학원 PC #1607 CI 실패). alt·caption에서는 "다각형 ABCD"처럼 쓰지 말고 "사각형 A, B, C, D" 식으로 끊거나 3자 이하로 쓴다.

[사용자 지시 2026-11-10 — 합동·닮음은 두 그림을 함께] 합동·닮음 해설 그림은 항상 두 그림을 함께 보인다: ① 문제 배치 그대로의 그림(문제 그림의 점 이름·배치), ② 대응하는 두 도형을 떼어 같은 방향으로 나란히 펼친 그림(대응 꼭짓점 이름 유지). 해설 그림 필드가 하나이므로 `composite-panels-v1`(평면도형 패널, AUTHOR_GUIDE 3-16)로 한 장에 담고, 두 패널에서 같은 색 + 같은 눈금·호 표식 = 같은 대응이다. 휴대폰 폭에서 패널이 작아지면 세로로 쌓는다. 문제 그림에서 이미 두 도형이 떨어져 같은 방향으로 놓여 있을 때만 ① 하나로 충분하다(이유를 적는다). 엔진이 패널에 필요한 표식을 못 넣으면 ②를 빼고 통과시키지 말고 UNSUPPORTED와 빠진 기능을 적는다. 이유: 중등 학생은 겹치거나 꼭짓점을 공유한 도형을 펼쳐 보지 않으면 대응을 이해하지 못한다.
