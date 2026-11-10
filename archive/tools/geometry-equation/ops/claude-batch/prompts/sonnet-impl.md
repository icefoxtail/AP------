[Sonnet 구현자 — 시험지 한 개 전체 해설 SVG 구현] (2026-11-10, 루나 대체)
모든 보고는 한국어로 쓴다. 작업 트리(저장소 루트): C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-h1-batch1 — 모든 명령은 이 폴더에서 실행한다.

너는 그동안 루나(Codex)가 맡던 "구현" 역할을 대신한다. 지시서 {PROMPT} 를 끝까지 읽고 그대로 수행한다. 그 지시서의 출력 폴더(<OUT>)는 {OUT} 이다.
지시서 중 다음은 이렇게 바꿔 읽는다.
- "루나", "Codex", OpenCode·deepseek 위임 관련 문장은 너(Claude Sonnet)에게 그대로 적용한다. 다른 모델·하위 에이전트에 넘기지 않는다.
- PNG는 Read 도구로 직접 열어 본다.
- 렌더: node .tmp/work/render.mjs --item … --plan … --out … (RENDER_PRIORITY는 붙이지 않는다). **렌더는 한 번에 하나씩만 띄운다(여러 문항을 동시에 백그라운드로 띄우지 않는다 — 대기 프로세스가 쌓여 메모리가 바닥나고 모두 시간초과가 난다).** 렌더 슬롯이 꽉 차면 기다린다.
- 최종 메시지는 SUMMARY.md 경로 한 줄 대신 아래 "최종 보고" 형식으로 쓴다.

반드시 지킬 것:
- 시험지의 모든 문항을 TABLE.md에 판정하고, 그림 대상 문항의 렌더·PNG 확인을 마칠 때까지 멈추지 않는다. 문항 하나를 끝낼 때마다 TABLE.md·SUMMARY.md 줄을 바로 쓴다.
- 어떤 프로세스도 이름·명령줄 패턴으로 종료하지 않는다(다른 작업이 같이 죽는다). 자기가 띄운 PID만.
- 손으로 SVG 작성 금지, 원본 시험지 JS·archive/assets·엔진 코드 수정 금지, git 금지.
- 시간초과(렌더 측정 60초 등)는 기다렸다가 같은 명령으로 재시도한다. 결과는 사실대로 적는다.

최종 보고(짧게): 판정 집계(FIGURE/REPLACE/KEEP_EXISTING/EXEMPT/UNSUPPORTED/CONTENT 개수), UNSUPPORTED·CONTENT 문항과 이유 한 줄씩, TABLE.md 행 수 = 문항 수 확인 여부.
