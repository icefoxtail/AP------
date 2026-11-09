[루나 구현자 — 2학기 기말 시험지 한 개 전체 해설 SVG 구현]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 모두 이 기준, 모든 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF_SVG_CODEX.md의 대기열·잠금·원장·ROOT 조율 절차보다 우선한다. QUEUE.md, 공유 원장, 시도 이력 재구성, 문항별 브랜치, DOM/qualification/publication 검사는 하지 않는다.
위임 금지(사용자 지시 2026-11-08, ~/.codex/AGENTS.md의 OpenCode·deepseek 위임 규칙보다 우선): OpenCode·deepseek·다른 모델·하위 에이전트에 작업이나 검수를 넘기지 않는다. deepseek은 그림을 볼 수 없다. 루나 자신이 PNG를 직접 열어 보고 판단·수정한다. 최종 마무리는 항상 Claude 쪽 Sonnet이 한다.
파일 쓰기: TABLE.md·SUMMARY.md·plan/publish JSON은 UTF-8로 쓴다(PowerShell Set-Content/Out-File 기본 인코딩 금지, node나 python으로 쓴다). 한글이 ?로 깨지면 다시 쓴다. 줄끝은 LF.

[작업 단위 = 시험지 하나 전체] (사용자 결정 2026-11-09)
이번 실행의 대상은 아래 "시험지" 한 개이며, **그 시험지의 모든 문항(Q01부터 마지막까지)을 하나도 빠짐없이 판정하고 처리한다.** 몇 문항만 골라 하지 않는다. 범위는 2학기 기말 고1·고2(수학II·확률과통계)이고, 교육과정 기준은 실행 끝에 붙은 "과목" 줄을 따른다.

먼저 읽기(필요한 만큼): docs/agents/visual-svg.md의 공통 프롬프트 블록(그림 기준), .tmp/svg-m1/briefs/plan-current.md, .tmp/svg-m1/guide/guide-tips.md, guide-graph.md(또는 해당 형태), 계약 원문 archive/tools/geometry-equation/production/AUTHOR_GUIDE.md.

렌더(공식 엔진, 환경·잠금 포함): node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir>
  이 스크립트가 PYTHONPATH·브라우저·렌더 잠금을 처리한다. render.lock을 직접 만들거나 지우지 않는다. 렌더는 반드시 이 스크립트로 한다(루나가 동시에 여럿 돌아 잠금으로 직렬화된다).
  결과가 ARCHIVE_BOUND여야 한다. 렌더 횟수 제한 없음. 실패하면 원인을 고쳐 다시 렌더한다.
PNG 확인: node .tmp/svg-m1/svg2png.cjs <svg> <png> 600 로 만들어 직접 본다.
시험지 JS는 item.json의 sourcePath 경로 그대로 node로 읽는다: global.window={}; eval(fs.readFileSync(경로,'utf8')); window.questionBank (한글 경로를 셸에서 다시 타이핑하지 않는다, PowerShell Get-Content로 읽지 않는다). 읽은 Q01 본문이 시험지·판정표·입력 초안과 같은 시험지인지 먼저 확인한다.

[전 문항 판정 규칙]
먼저 실행 끝의 "기존 해설 그림 분류표"(NONE/NEW/OLD_SVG/OLD_PNG/MISSING_FILE)를 읽고, 모든 문항을 아래 중 하나로 판정한다.

1) 구형 그림(OLD_SVG, OLD_PNG)이 있는 문항 = **UPGRADE: 예외 없이 신형 엔진으로 다시 만든다.**
   - 구형 판별 기준: solutionImage가 .svg인데 파일 앞부분에 data-engine-version=, data-publication-profile=, data-composite=, data-<무엇>="<무엇>-figure-v1" 중 어느 것도 없으면 구형이다. PNG 같은 래스터 해설 그림도 구형이다. (분류표가 이미 계산해 두었으며, 의심되면 파일을 직접 열어 확인한다.)
   - **재작업 전에 구형이 보여 주던 핵심 관계(함수·교점·주기·구간·넓이·점 좌표·보조선 등)를 먼저 목록으로 적는다**(SUMMARY.md에 남김). 신형은 그 관계를 **반드시 모두 담는다.** 담지 못하는 것이 있으면 그 이유(엔진 공백 코드)를 적는다.
   - 구형의 결함은 고친다: 정답 노출(그림 속 값이 곧 정답인 경우 포함), 영어 글자, 빗금 분수(세로 분수만 쓴다), 틀린 축척·틀린 값, 겹친 라벨.
   - 구형 파일은 읽기만 한다(수정·삭제 금지).
   - 신형이 구형보다 낫다는 것을 확인하려고 <OUT>/qNN/compare.png를 만든다(아래 도구). 신형이 구형의 핵심 관계를 빠뜨리거나 더 나쁘면 고쳐 다시 렌더한다. 정말 못 그리면 UNSUPPORTED(빠진 엔진 기능 정확히 기재)로 두고 구형 그대로 두지 않는다(엔진 확장 라인에 넘긴다).
2) 그림이 없는 문항(NONE)이 함수·그래프·도형·통계 단원이고 해설 그림이 학생에게 조금이라도 도움이 되면 = **NEW: 만든다.** 문제가 순수 계산(순열·조합 계산, 복소수 사칙 등)이라 그림이 도움이 안 되면 EXEMPT(구체 이유 한 줄: "무엇을 계산하는 문제라서 그림이 보탤 정보가 없다" 수준으로). "원문에 그림이 이미 있다"만으로는 약하다(해설 그림이 원문 그림을 넘어서는 정보가 있으면 만든다).
3) 이미 신형인 그림(NEW 분류)이 있으면 결함을 점검한다: 정답·보기 번호 노출, 틀린 값, 빗금 분수, 영어, 라벨 겹침·혼잡, 교육과정 밖 표현, 해설과 불일치. 결함이 있으면 **FIX**(고쳐 다시 렌더). 결함이 없으면 **KEEP**(기존 유지, 이유 한 줄).
4) 엔진이 정말 못 그리면 **UNSUPPORTED** + 빠진 엔진 기능을 정확히 적는다(시도한 방법과 오류 코드). 문제·해설·정답이 서로 모순이면 **CONTENT**(근거 한 줄). 두 경우 모두 그리지 않는다.
5) 입력 초안(.tmp/work/triage-20261107/inputs/<key>/root-inputs/qNN/{item,plan,publish}.json, STATUS.md)은 그 상태(DRAFT_ONLY 포함)와 상관없이 **출발점**이다. 원문·해설과 대조해 틀리면 고친다. 기존 판정표(.tmp/work/triage-20261107/<key>.md)는 참고만 한다(지시가 아니다).

판정과 TABLE.md 판정어의 대응: NEW → FIGURE, UPGRADE·FIX → REPLACE, KEEP → KEEP_EXISTING, EXEMPT → EXEMPT, UNSUPPORTED → UNSUPPORTED, CONTENT → CONTENT.

[구현 규칙]
 1) 시험지 JS에서 문항 원문·정답·해설·기존 그림(solutionImage*)을 읽는다.
 2) 출력 폴더 <OUT>/qNN/에 item.json, plan.json, publish.json, figure.png를 두고, 렌더는 --out <OUT>/qNN/out 으로 한다(최종 성공본이 out/에 있게). FIGURE·REPLACE 문항만 폴더를 만든다(EXEMPT·KEEP_EXISTING·UNSUPPORTED·CONTENT는 qNN 폴더를 만들지 않는다. 사유는 TABLE.md·SUMMARY.md에만 적는다).
 3) publish.json: {"alt": 그림 설명(정답 없음, 그림에 실제 보이는 것만), "caption": 풀이 요약 2~4문장 + 끝에 "정답은 …이다."(예시 값이면 "예:"로 시작), "size": 렌더 결과 out/figure-result.json의 sizeClass와 같은 값}. alt·caption은 한국어 평문($…$ LaTeX·영어 금지).
 4) UPGRADE 문항은 <OUT>/qNN/compare.png를 만든다: PYTHONIOENCODING=utf-8 python .tmp/work/compare.py <구형 파일(svg/png, archive/ 아래 경로)> <OUT>/qNN/out/figure-solution.svg <OUT>/qNN/compare.png . 왼쪽 구형·오른쪽 신형, 상단에 "구형"/"신형"이 붙는다. 만든 뒤 직접 열어 구형의 핵심 관계가 신형에 있는지 눈으로 확인한다.
 5) <OUT>/TABLE.md — 전 문항 한 줄씩, 정확히 이 형식(다른 판정어·누락 문항 금지, 파서가 `^| Q?(\d+) | ([A-Z_]+)`로 읽는다):
      | 문항 | 판정 | 이유 |
      |---|---|---|
      | Q01 | EXEMPT | 순열 계산 문제라 그림이 보탤 정보가 없다. |
      | Q05 | REPLACE | 구형 SVG를 신형으로 재작업: (핵심 관계 요약) |
    판정은 정확히 FIGURE·REPLACE·KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT 중 하나. 이유는 구체적으로(한 줄).
 6) <OUT>/SUMMARY.md — 전 문항 한 줄씩: `qNN | 판정(FIGURE/REPLACE/KEEP_EXISTING/EXEMPT/UNSUPPORTED/CONTENT) | 렌더 수 | (UPGRADE면) 구형 핵심 관계 → 신형 반영 여부(관계마다 O/X) | 메모`. 시험지 전체 문항 수와 TABLE.md 행 수가 같아야 한다.
 7) 끝나기 전에 확인: 문항 수 = TABLE.md 행 수, FIGURE/REPLACE 문항마다 out/figure-result.json status=ARCHIVE_BOUND이고 publish.json size = sizeClass, UPGRADE 문항마다 compare.png가 있다.

금지: 손으로 SVG 작성·수정, 정답·보기 번호를 그림/alt에 넣기, 원본 시험지 JS·archive/assets 수정, 엔진 코드 수정, git commit/push/병합, 검사 완화. 엔진 공백이면 UNSUPPORTED와 빠진 기능을 적고 다음 문항으로 간다. 문제·해설·정답이 서로 맞지 않으면 CONTENT로 적고 그리지 않는다.
결과는 출력 파일로만 남긴다. 최종 메시지는 SUMMARY.md 경로 한 줄.

자주 나온 결함(반드시 피한다):
- 해설에 없는 보조 경로·예시 선을 함수 그래프와 같은 실선으로 그리지 않는다. 보조선은 점선·다른 색이며 해설이 쓰는 것만 그린다.
- 점근선·직선·곡선 라벨은 그 대상 바로 곁에 둔다(멀리 뜨면 asymptoteLabelAt·verticalAsymptoteLabelAt·leader 사용). 곡선이 여럿이면 각 라벨을 그 곡선 곁에 붙인다(지시선). 라벨 색은 엔진이 지원하지 않으므로 맞추지 않아도 된다. 색 불일치만으로 UNSUPPORTED 처리하지 않는다.
- 그림에 없는 점·선 이름(예: "그림의 C")을 caption·alt에 쓰지 않는다. alt는 그림에 실제 보이는 것만 정확히 설명한다.
- 치환으로 그릴 때 문제의 변수 이름(x 등)과 충돌하지 않는 새 변수(u 등)를 쓰고 caption에서 치환을 밝힌다.
- y=x(또는 기울기 ±1 직선)·원·정사각형이 풀이에 중요하면 가로·세로 눈금을 같게 한다. 유리함수·무리함수 단일 그래프(rational, sqrt-affine 등)는 기본이 눈금 비가 다르므로 graphPlan.equalUnits:true를 반드시 넣는다(AUTHOR_GUIDE G18b). y=x가 45°로 보이는지 PNG에서 확인한다.
- plan.json의 한글 문자열(caption·condition 등)은 UTF-8로 쓴다. 이 값은 SVG 접근성 제목으로 들어가므로 깨진 글자(??, 漢字 섞임)가 없는지 out/figure-solution.svg의 <title>을 확인한다.
- 반복(합성) 경로는 세로·가로 선분을 모두 이어 끊기지 않게 그린다. caption이 값으로 설명하는 점(예: 2→1/3→…)은 그림에서 그 값을 읽을 수 있게 점 라벨이나 축 눈금 라벨을 붙인다.
- 해설이 쓰는 점(절편 등)은 좌표를 읽을 수 있어야 한다(해당 축 눈금 라벨 또는 좌표 라벨). 곡선 라벨은 실제 그 곡선 곁에 둔다.
- 라벨 자리가 없다는 이유로 라벨을 숨기거나 엔진 공백으로 넘기지 않는다. 먼저 지시선(callout·leader)으로 라벨을 대상에 붙인다. 지시선으로도 안 될 때만 시도한 방법과 오류 코드를 SUMMARY에 적는다.
- 그림은 해당 과목 교육과정 안의 대상과 해설이 실제로 쓰는 방법만 그린다(고1: 일차분모 유리함수·무리함수·이차함수·원·직선 등, 고2 수학II: 다항함수 극한·미분·적분, 고2 확률과통계: 경우의 수·확률·분포·통계적 추정). 엔진이 못 그린다고 교육과정 밖 그래프(예: 4/t³)나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 검토한다.
- caption은 해설 전문 복사가 아니라 2~4문장 요약 + 끝에 "정답은 …이다."
- 분수는 세로 분수로만 쓴다(빗금 a/b를 그림에 쓰지 않는다). 영어 글자(period, max 등)를 그림에 쓰지 않는다.
- 좌표 라벨은 다른 라벨과 같은 수식 글꼴로 쓴다. callout 글자에 쉼표가 있으면 일반 글꼴(TEXT)로 강제되므로 "(3,5)"는 callout 대신 그 점(overlays.points)에 "coordinates":true(+labelDirection)를 쓴다. 축 눈금 곁이라 자리가 안 맞으면 callout으로 "x=1" 같은 쉼표 없는 식을 쓴다.
- 세로 점근선 라벨(x=a)이 y축이나 "y" 축 이름 곁에 붙으면 y축 라벨처럼 읽힌다. verticalAsymptoteLabelAt로 점선 바로 곁에 두고 y축과 떨어뜨린다. 가로 점근선 라벨(y=b)도 다른 눈금 숫자와 떨어져 점선 곁에 있게 한다(asymptoteLabelAt).
- 그림 속 값이 곧 정답이면(예: "호의 길이 = 2.5π", 확률값 표기) 그것도 노출이다. 정답 값은 그림에 쓰지 말고 caption 끝에서만 밝힌다.
- 문제에 없는 함수 이름(g, h, l)을 그림에 쓰면 caption에서 정의한다. 표준정규분포면 가로축 이름 z. 해설이 분수인데 그림이 소수면 caption에 분수를 밝힌다.
