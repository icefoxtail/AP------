[루나 1차 검수자 — 고1 2학기 기말 해설 SVG]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 모두 이 기준, 모든 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF_SVG_CODEX.md의 대기열·잠금·원장·ROOT 조율 절차보다 우선한다. QUEUE.md, 공유 원장, 시도 이력 재구성, 문항별 브랜치, DOM/qualification/publication 검사는 하지 않는다.
위임 금지(사용자 지시 2026-11-08, ~/.codex/AGENTS.md의 OpenCode·deepseek 위임 규칙보다 우선): OpenCode·deepseek·다른 모델·하위 에이전트에 작업이나 검수를 넘기지 않는다. deepseek은 그림을 볼 수 없다. 루나 자신이 PNG를 직접 열어 보고 판단·수정한다. 최종 마무리는 항상 Claude 쪽 Sonnet이 한다.
원문 읽기 확인: 판정 전에 node로 시험지 JS를 읽어(global.window={}; eval(파일); window.questionBank) Q01 content 앞부분을 REVIEW.md 첫 줄에 옮겨 적는다. CONTENT(원문과 구현 불일치)가 3건 이상 나오면 원문을 잘못 읽은 것으로 보고 다시 읽은 뒤 판정한다(2026-11-09: 23 팔마 수학II 검수자가 다른 문제를 읽고 전부 CONTENT로 판정).
파일 쓰기: REVIEW.md·SUMMARY.md·plan/publish JSON은 UTF-8로 쓴다(PowerShell Set-Content/Out-File 기본 인코딩 금지, node나 python으로 쓴다). 한글이 ?로 깨지면 다시 쓴다.

기준: docs/agents/visual-svg.md 공통 프롬프트 블록 3번 판정 기준, .tmp/svg-m1/briefs/review1.md. 완료 기준은 "학생이 PC·휴대폰에서 보고 풀이를 이해할 수 있는가"이며 수치상 완벽주의는 하지 않는다.
렌더는 node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir> 로만 한다(환경·잠금 처리 포함, render.lock을 직접 다루지 않는다). PNG: node .tmp/svg-m1/svg2png.cjs <svg> <png> 600

할 일: 구현 출력 폴더 <IMPL>/qNN 각각을
 1) 시험지 JS의 원문·정답·해설과 대조한다. figure.png를 직접 보고(없으면 svg2png로 만든다) 확인: 수학 값이 맞는가, 해설이 쓰는 점·교점·점근선이 창 안에 보이는가, 라벨이 대상 곁에 있고 겹치지 않는가, 정답이 그림·alt에 없는가, caption 끝에 정답이 있는가(예시 값이면 "예:"), publish.json size가 out/figure-result.json의 sizeClass와 같은가(다르면 sizeClass로 맞춘다).
 2) 결과는 <REV>/qNN/에 item.json, plan.json, publish.json, figure.png, out/(최종 ARCHIVE_BOUND 렌더 출력: figure-solution.svg, figure-result.json 등)로 둔다. 문제가 있으면 고친 item/plan/publish로 --out <REV>/qNN/out 재렌더한다(ARCHIVE_BOUND까지, 횟수 제한 없음). 문제가 없으면 구현 결과를 그대로 복사한다.
 3) <REV>/REVIEW.md에 문항별 한 줄: qNN | PASS(무수정)/FIXED(무엇을)/KEEP_EXISTING/UNSUPPORTED/CONTENT | 메모.
금지: 손으로 SVG 작성·수정, 정답을 그림/alt에 넣기, 원본 JS·archive/assets·엔진 코드 수정, git commit/push/병합, 검사 완화.
최종 메시지는 REVIEW.md 경로 한 줄.

특히 확인(최종 검수에서 반복 지적된 것): 해설에 없는 보조선이 그래프처럼 보이지 않는가, 라벨이 대상 곁에 있는가(색 일치는 요구하지 않음), caption·alt가 그림에 없는 이름을 가리키지 않는가, 치환 변수가 문제 변수와 충돌하지 않는가. "PASS(무수정)"는 이 항목을 실제로 확인했을 때만 쓴다.
- y=x·기울기 ±1 직선·원이 있으면 가로·세로 눈금이 같은가(y=x가 45°로 보이는가). 다르면 equalUnits:true로 고쳐 재렌더한다.
- 반복 경로가 끊기지 않았는가, caption이 말하는 점의 값을 그림에서 읽을 수 있는가, 곡선 라벨이 실제 그 곡선 곁에 있는가.
- 라벨을 숨겨 통과시킨 문항은 지시선으로 살릴 수 있는지 먼저 시도한다.
- 그림이 고1 교육과정 안의 대상인가, 해설이 실제로 쓰는 방법을 보여 주는가(교육과정 밖 치환·우회 그래프가 아닌가).
- alt·caption이 한국어 평문인가($ LaTeX·영어 없음), caption이 해설 복사가 아닌 짧은 요약이고 끝에 정답이 있는가.
- 좌표·값 라벨 글꼴이 다른 라벨(수식 글꼴)과 같은가(얇은 일반 글꼴이면 FAIL).
- 점근선 라벨이 y축 이름·눈금 숫자 곁이 아니라 자기 점선 곁에 있는가.
