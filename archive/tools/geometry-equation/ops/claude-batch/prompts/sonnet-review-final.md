[Sonnet 검수+최종 — 시험지 한 개] (2026-11-10, 루나 검수 + Sonnet 최종을 한 단계로 통합)
모든 보고는 한국어로 쓴다. 작업 트리(저장소 루트): C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-h1-batch1 — 모든 명령은 이 폴더에서 실행한다.
대상: key {KEY}, JS {JS}. 구현 결과는 {IMPL}, 너의 결과 폴더는 {REV}.

너는 구현자와 독립된 검수자다. 두 단계를 차례로 수행한다.
1단계(검수): 지시서 {REV}/PROMPT.md 를 끝까지 읽고 수행한다("루나"는 너, Codex·deepseek 위임 문장은 "다른 모델에 넘기지 않는다"로 읽는다). 구현 판정이 맞는지(특히 EXEMPT·KEEP_EXISTING·UNSUPPORTED), 구형 핵심 관계와 색 구분이 신형에 보존됐는지, 그림·alt에 정답 노출이 없는지, 교육과정 범위인지 확인한다. 문제가 있으면 보고만 하지 말고 {REV}/qNN 에서 직접 고친다. {REV}/TABLE.md 를 전 문항 판정으로 완성한다.
2단계(최종): 지시서 .tmp/work/prompts/sonnet-final-exam.md 를 읽고 그 확인 항목·마무리 명령을 수행한다({KEY}·{JS}는 위 값, 결과 폴더는 {REV}). make-dec-exam과 build-pub를 실행해 BAD none까지 만든다. 루트 role/title 누락은 bash .tmp/work/a11y.sh <qNN 폴더>.

반드시 지킬 것:
- PNG는 Read 도구로 직접 열어 본다. 렌더는 RENDER_PRIORITY=1 node .tmp/work/render.mjs … 로 한 번에 하나씩.
- 어떤 프로세스도 이름·명령줄 패턴으로 종료하지 않는다. 자기가 띄운 PID만.
- 손 SVG·원본 JS/assets/엔진 수정·git·pubflow·다른 모델 위임 금지.

최종 보고(짧게): 문항별 한 줄(PASS / FIXED(무엇) / OPEN(사유)), 구현 판정을 바꾼 문항과 이유, build-pub BAD 결과, 대표 PNG 2~3개 경로(교체 문항 포함).

- 표준정규분포(Z) 그림의 가로축 제목은 plan의 chart.xLabel로 z로 한다.
- 렌더는 한 번에 하나씩만 띄운다(동시에 여러 개 백그라운드로 띄우지 않는다 — 대기 프로세스가 쌓이면 메모리가 바닥나 모두 시간초과).
