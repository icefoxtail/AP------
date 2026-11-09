[루나 구현자 — 고1 2학기 기말 해설 SVG 렌더]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 모두 이 기준, 모든 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF_SVG_CODEX.md의 대기열·잠금·원장·ROOT 조율 절차보다 우선한다. QUEUE.md, 공유 원장, 시도 이력 재구성, 문항별 브랜치, DOM/qualification/publication 검사는 하지 않는다.
위임 금지(사용자 지시 2026-11-08, ~/.codex/AGENTS.md의 OpenCode·deepseek 위임 규칙보다 우선): OpenCode·deepseek·다른 모델·하위 에이전트에 작업이나 검수를 넘기지 않는다. deepseek은 그림을 볼 수 없다. 루나 자신이 PNG를 직접 열어 보고 판단·수정한다. 최종 마무리는 항상 Claude 쪽 Sonnet이 한다.
파일 쓰기: REVIEW.md·SUMMARY.md·plan/publish JSON은 UTF-8로 쓴다(PowerShell Set-Content/Out-File 기본 인코딩 금지, node나 python으로 쓴다). 한글이 ?로 깨지면 다시 쓴다.

먼저 읽기(필요한 만큼): docs/agents/visual-svg.md의 공통 프롬프트 블록(그림 기준), .tmp/svg-m1/briefs/plan-current.md, .tmp/svg-m1/guide/guide-tips.md, guide-graph.md(또는 해당 형태), 계약 원문 archive/tools/geometry-equation/production/AUTHOR_GUIDE.md.

렌더(공식 엔진, 환경·잠금 포함): node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir>
  이 스크립트가 PYTHONPATH·브라우저·렌더 잠금을 처리한다. render.lock을 직접 만들거나 지우지 않는다. 렌더는 반드시 이 스크립트로 한다.
  결과가 ARCHIVE_BOUND여야 한다. 렌더 횟수 제한 없음. 실패하면 원인을 고쳐 다시 렌더한다.
PNG 확인: node .tmp/svg-m1/svg2png.cjs <svg> <png> 600 로 만들어 직접 본다.

할 일: 아래 시험지의 지정 문항마다
 1) 시험지 JS에서 문항 원문·정답·해설·기존 그림(solutionImage*)을 읽는다. 입력 초안(root-inputs/qNN의 item/plan/publish)은 출발점일 뿐이며 틀리면 고친다.
 2) 함수·유리·무리함수 그래프는 학생 이해에 조금이라도 도움이 되면 만든다. 기존 그림이 있다는 이유만으로 건너뛰지 않는다. 단, 기존 그림이 이미 새 엔진으로 결함 없이(정답 노출 없음, 틀린 값 없음, 라벨 정상) 만들어져 있으면 재작업하지 않고 STATUS에 KEEP_EXISTING과 이유를 적는다.
 3) 출력 폴더 <OUT>/qNN/에 item.json, plan.json, publish.json, figure.png를 두고, 렌더는 --out <OUT>/qNN/out 으로 한다(최종 성공본이 out/에 있게).
 4) publish.json: {"alt": 그림 설명(정답 없음), "caption": 풀이 요약 + 끝에 정답(예시 값이면 "예:"로 시작), "size": 렌더 결과 out/figure-result.json의 sizeClass와 같은 값}
 5) <OUT>/SUMMARY.md에 문항별 한 줄: qNN | ARCHIVE_BOUND/KEEP_EXISTING/UNSUPPORTED/CONTENT | 렌더 수 | 메모.

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
- 그림은 고1 교육과정 안의 대상(일차분모 유리함수, 무리함수, 이차함수 등)과 해설이 실제로 쓰는 방법만 그린다. 엔진이 못 그린다고 교육과정 밖 그래프(예: 4/t³)나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 검토한다.
- alt·caption은 한국어 평문으로 쓴다($…$ LaTeX·영어 금지). (수식·변수는 기호로 쓴다: x, y, f(x), √, ², −, ≤, π, 분수는 "4분의 97" 또는 기호. "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀어 쓰지 않는다. "영어 금지"는 영어 단어 문장을 뜻하며 변수 이름은 해당하지 않는다.) caption은 해설 전문 복사가 아니라 2~4문장 요약 + 끝에 "정답은 …이다."
- 좌표 라벨은 다른 라벨과 같은 수식 글꼴로 쓴다. callout 글자에 쉼표가 있으면 일반 글꼴(TEXT)로 강제되므로 "(3,5)"는 callout 대신 그 점(overlays.points)에 "coordinates":true(+labelDirection)를 쓴다. 축 눈금 곁이라 자리가 안 맞으면 callout으로 "x=1" 같은 쉼표 없는 식을 쓴다.
- 시험지 JS는 item.json의 sourcePath 경로를 그대로 node로 읽는다(한글 경로를 셸에서 다시 타이핑하지 않는다). 읽은 Q02 본문이 판정표·입력 초안과 같은 문항인지 먼저 확인하고, 다르면 경로를 다시 확인한다.
- 세로 점근선 라벨(x=a)이 y축이나 "y" 축 이름 곁에 붙으면 y축 라벨처럼 읽힌다. verticalAsymptoteLabelAt로 점선 바로 곁에 두고 y축과 떨어뜨린다. 가로 점근선 라벨(y=b)도 다른 눈금 숫자와 떨어져 점선 곁에 있게 한다(asymptoteLabelAt).
