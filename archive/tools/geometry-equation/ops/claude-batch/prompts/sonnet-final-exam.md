모든 보고는 한국어로 쓴다.

먼저 지시서 C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-h1-batch1/.tmp/work/prompts/sonnet-final.md 를 끝까지 읽고 그대로 따른다(맨 끝 프로세스 종료 금지 규칙 포함). 작업 트리(저장소 루트)는 C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-h1-batch1 이고 모든 명령은 거기서 실행한다.

대상: key {KEY}, JS {JS}
- 결과 폴더: .tmp/work/runs/{KEY}/exam-rev (TABLE.md 판정표, REVIEW.md 루나 검수 보고, qNN/). 구현본 .tmp/work/runs/{KEY}/exam-impl.
- REPLACE는 구형 → 신형 교체다. 구형이 보여 주던 핵심 관계는 반드시 신형에 담는다.
- KEEP_EXISTING 문항은 기존 solutionImage SVG에 신형 엔진 마커(data-engine-version= / data-publication-profile= / data-composite= / data-…="…-figure-v1")가 있는지 확인한다. 마커 없는 구형이면 REPLACE로 바꿔 신형을 만들고(렌더까지), 못 하면 UNSUPPORTED로 TABLE.md를 고친다.
- UNSUPPORTED는 기존 엔진 옵션(지시선·라벨 위치·TREE·Venn·표·합성 패널, AUTHOR_GUIDE.md)으로 plan을 바꿔 렌더를 1회 시도한다. 되면 FIGURE/REPLACE로, 안 되면 유지하고 시도한 옵션과 막힌 이유를 한 줄 남긴다.
- CONTENT(원문 오류 주장)는 원문을 node로 직접 읽어 확인한다. 원문 오류가 아니면 해설대로 그림을 만든다.
- dots 초안이 .tmp/work/triage-20261107/inputs/{KEY}/root-inputs 또는 .tmp/work/dots-ref/triage-20261107/inputs/{KEY}/ 에 있으면 비교해 더 나은 쪽을 택한다.
- 끝나면 실행해 BAD none 확인(PYTHONIOENCODING=utf-8):
  node .tmp/work/make-dec-exam.cjs {KEY} {JS} .tmp/work/runs/{KEY}/exam-rev
  python .tmp/work/build-pub.py {KEY} {JS} .tmp/work/runs/{KEY}/exam-rev .tmp/work/dec-{KEY}-exam.json
- 렌더는 RENDER_PRIORITY=1 node .tmp/work/render.mjs … 로 한 번에 하나씩. 어떤 프로세스도 이름·패턴으로 종료하지 마라. 손 SVG·원본 JS/assets/엔진 수정·git·pubflow·다른 모델 위임 금지.

최종 보고(짧게): 문항별 한 줄(PASS / FIXED(무엇) / OPEN(사유)), build-pub BAD 결과, 대표 PNG 2~3개 경로(교체 문항 포함).

- 그림 위쪽에 식 라벨만 따로 쌓여 어느 선/곡선인지 연결이 안 되면 라벨을 해당 선 끝이나 지시선으로 붙인다.
- build-pub BAD가 SVG 루트 role/title 누락이면 `bash .tmp/work/a11y.sh <qNN 폴더>`로 보강한다(손 SVG 아님).

[사용자 피드백 2026-11-10] 선·면으로 구분해야 하는 부분(두 곡선, 두 영역, 경로 등)은 확실히 구분한다. 구분 수단은 색이 1순위다. 구형 그림에 색 구분이 있었으면 신형에서도 그 색 구분을 유지한다. alt·caption의 "영어 금지"는 영어 단어 문장만 뜻한다 — 수식·변수는 기호 그대로 쓴다(예: y=2x−2√5, "와이는 2엑스…"처럼 소리로 풀어 쓰지 않는다). 근호 좌표가 "−1+(−1√10)"처럼 어색하게 자동 표기되면 점을 식 좌표로 직접 주거나 라벨을 끄고 caption에 쓴다.
- 중학교 시험지면 해당 학년 2학기 범위만 쓴다(중3: 삼각비·원의 성질·통계, 중2: 도형의 성질·닮음·피타고라스·확률, 중1: 기본 도형·작도·평면도형·입체도형·통계). 교육과정 밖 표현 금지.

- 표준정규분포(Z) 그림의 가로축 제목은 plan의 chart.xLabel로 z로 한다.
- 렌더는 한 번에 하나씩만 띄운다(동시에 여러 개 백그라운드로 띄우지 않는다 — 대기 프로세스가 쌓이면 메모리가 바닥나 모두 시간초과).
