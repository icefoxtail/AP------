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
- caption·alt·condition에 "ABCDE"처럼 대문자 4자 이상 연속 점 이름을 쓰지 않는다(런타임 학생 언어 검사가 영어 단어로 판정). "꼭짓점이 A, B, C, D, E인 오각형"처럼 나열한다.

[색 구분 규칙 — 처음부터 적용, 2026-11-10 마스터 확인: "색상이 들어가니까 확실히 구분이 잘 된다"]
팔레트 이름: BLUE · WARM(주황) · GREEN · ROSE(분홍) · VIOLET. 축·기본 도형·라벨 글자는 검정 유지. 세부 문법은 AUTHOR_GUIDE.md §3-9-색(색 묶음), §3-6-영역, 곡선 referenceCurves의 ACCENT/색 옵션.
- 서로 다른 함수(곡선)는 서로 다른 색: 첫째 BLUE, 둘째 WARM, 셋째 GREEN, 넷째 ROSE. 같은 그림에 함수가 3개 겹치면 3색 모두 다르게.
- 곡선과 함께 그린 직선(접선, y=k, 할선, 점근선)은 곡선과 다른 색. 직선이 여럿이면 직선끼리도 다른 색.
- 영역(넓이 S₁, S₂ …)은 영역마다 다른 칠(예: S₁ BLUE, S₂ WARM). 같은 넓이를 보이는 영역은 같은 색(equalAreas).
- 정의역·구간·치역을 축 위에 표시할 때는 대상(곡선·영역)과 구분되는 색으로 칠하거나 강조하고, 정의역과 치역을 동시에 보이면 서로 다른 색.
- 평면도형: 크기가 같은 각·같은 길이·대응변·평행선은 같은 색 묶음(equalAngles·equalLengths·segmentColors·parallels), 서로 다른 관계는 다른 색. 구하는 각/호와 주어진 각/호도 색으로 나눈다.
- 확률·통계: 서로 다른 사건·꼬리·막대 묶음은 다른 색(엔진이 색을 못 받는 계열은 진하기 두 단계로 나누고 TABLE에 '색 옵션 없음'을 적는다).
- 구형 그림에 있던 색 구분은 반드시 보존. 단색이라 둘 이상을 구분할 수 없는 그림은 완성으로 치지 않는다.
- caption/alt에 색 이름을 넣어 어느 색이 무엇인지 말해 준다(예: "파란 곡선 y=f(x), 주황 직선 y=k").
