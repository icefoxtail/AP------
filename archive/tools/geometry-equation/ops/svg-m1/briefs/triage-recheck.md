# 기존 그림 재검 포함 판정 (2학기 기말 업그레이드, 2026-11-02)

`/home/user/AP------/.tmp/svg-m1/briefs/triage.md`를 끝까지 읽고 따른다. 시험지마다 {PACKET} = `/home/user/AP------/.tmp/svg-m1/packets/EXAM.json`, {OUT} = `/home/user/AP------/.tmp/svg-m1/runs/triage-EXAM.json`.

- existingSolutionImage(SVG)가 있는 문항: "KEEP_EXISTING" 또는 "REPLACE". `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs <svg> <png> 520`로 `/home/user/AP------/.tmp/svg-m1/runs/existing-EXAM/` 안에만 렌더하고, 문제 그림 옆에 놓고 Read로 본다. SVG가 `ns0:` 접두사라 글자만 나오면 Playwright Chromium으로 그 파일을 직접 열어 캡처한다(출력은 같은 폴더).
- 현재 기준 `/home/user/AP------/.tmp/svg-m1/briefs/plan-current.md`를 먼저 읽고 그 기준으로 판정한다: 문제 그림·해설과 일치, 휴대폰에서 읽힘, 글자 겹침·잘림 없음, 떠 있는 글자 없음(라벨은 대상에 붙음), **최종 정답이 그림 안에 없음**(정답은 캡션), 해설의 핵심 중간값 있음, 점 이름 안쪽·치수선 바깥, `^c` 같은 입력용 표기 없음. 모두 통과해야 KEEP. 아니면 REPLACE와 결함, 구체적 figureIdea(그릴 것, 값, 정답은 캡션만).
- SVG 앞 4000자에 ` data-` 속성이 하나도 없으면 엔진 밖 옛 그림: 기본 REPLACE(그림이 필요 없는 문항이면 EXEMPT).
- 그림 없는 문항: triage.md의 FIGURE/EXEMPT. 정책은 가르치는 가치가 있으면 그림을 만드는 쪽; EXEMPT는 그림이 문제 그림 이상을 주지 않는 순수 계산·정의 문항만.
- reason에 저장된 정답·해설 오류는 "CONTENT:"(문제 그림·본문 기준 올바른 정답과 계산 근거를 함께 적는다. 메인이 바로 고친다, 사용자 지시 2026-11-02), 잘리거나 안 읽히는 문제 그림은 "IMAGE:".
- 각 판정에 `family`(SOLID/PLANE/STAT/COORD/NUMBER_LINE/SET/OTHER)를 꼭 넣는다(형태별 묶음에 쓴다).
- 다른 에이전트 호출 금지. {OUT}과 existing-EXAM 폴더의 PNG만 쓴다. 최종 답장 8줄 이내: 시험지별 KEEP/REPLACE/FIGURE/EXEMPT 수와 CONTENT.
