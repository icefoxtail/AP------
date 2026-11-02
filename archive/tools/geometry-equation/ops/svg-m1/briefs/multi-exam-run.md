# 여러 시험지 묶음 그림 작업 (그림 형태별 묶음, 사용자 지시 2026-11-02)

`/home/user/AP------/.tmp/svg-m1/briefs/plan.md`와 `/home/user/AP------/.tmp/svg-m1/briefs/plan-current.md`를 끝까지 읽고 따른다. 다른 점은 아래뿐이다.

- 대상 목록 `{TARGETS}`의 각 줄은 `EXAM <시험지> | PACKET <경로> | SOURCE <경로> | ord N (형태) [REPLACE/FIGURE ...]: 그림 아이디어`다. 줄마다 그 PACKET·SOURCE를 쓴다.
- 폴더는 `{RUN}/<시험지>/q<ord>/`(item.json, plan.json, out/, figure.png, publish.json). summary.json은 `{RUN}/summary.json` 하나에 `{"exam","ord",...}`로 모은다.
- REPLACE는 기존 그림의 결함(줄에 적힘)을 고친 새 그림이다. 같은 형태 문항이 이어지니 앞 문항에서 통과한 plan 구조를 다음 문항에 재사용한다.
- 문제 그림이 SVG이고 `ns0:` 접두사 때문에 svg2png로 글자만 나오면, Playwright Chromium으로 그 파일을 직접 열어 캡처해 본다(출력은 `{RUN}` 안).
- 렌더 환경: `export PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`. 다른 작업자 4~5명이 동시에 렌더한다: 렌더는 하나씩, 1분 부하 8 이상이면 기다린다.
- 정답은 publish.json caption 끝에만. 그림 안에 정답 값 금지. 떠 있는 글자 금지, 라벨은 대상에 붙인다(지시선 먼저). 점 이름 안쪽·치수선 바깥. `^c` 같은 입력용 표기 금지.
- CONTENT: 문제 그림 값과 해설 값이 다르면 그리지 말고 summary에 `CONTENT:`로 어느 값이 맞는지(문제 그림 기준 재계산 정답 포함) 적는다.
- 저장소 파일 수정·git·테스트 금지. `{RUN}` 밖에 쓰지 않는다. 최종 답장 10줄 이내: 시험지·문항별 상태(ARCHIVE_BOUND/FAILED/UNSUPPORTED)와 렌더 수, CONTENT.
