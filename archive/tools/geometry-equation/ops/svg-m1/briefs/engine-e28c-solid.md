# 엔진 확장 E28c·E4b·E5b: 입체 — 라벨 규칙 완화·한글 라벨, 전개도 면 기호, 꼭짓점 세 개 절단, 패널 5~6개, 원기둥 안 구 여러 개

**먼저(필수):** 시작하자마자 `git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`(새로 만든 너의 워크트리이므로 안전; E28b·E29 이름 없는 꼭짓점 참조·전개도 faceLabels·정다면체가 이미 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

코드: `production/solid-figure-v1.mjs`, `production/sphere-parts.mjs`, 합성 패널(`composite-panels-v1`·`composite-candidate-svg-v1.mjs`), 관측기 `production/solid_figure_observer.py`(+worker), 테스트 `tests/solid-figure.test.mjs`·`tests/test_solid_figure_observer.py`·composite 관련, 가이드 3-입체 절·합성 패널 절. hints는 `archive/tools/geometry-equation/ops/tools/hints.mjs`(리눅스 경로, 수정 가능).

## 기능 (실제 막힌 문항 순; plan·그림은 `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/`, packet은 `/home/user/AP------/.tmp/svg-m1/packets/`)
1. **라벨 규칙 완화·한글 라벨** (가장 많이 막힘): 지금 이름 없는 입체·전개도 패널은 라벨이 하나도 없으면 `SOLID_FIGURE_NEEDS_A_LABEL`로 거절돼, 작업자가 원문에 없는 `a`·`h`·꼭짓점 번호 1~12를 억지로 붙인다(검토 FAIL). (a) 강조(highlights·segments role·면 칠)나 패널 캡션이 있으면 라벨 없이도 통과, (b) 입체에 한글 TEXT 라벨(`labels:[{text:"회전축",at:<꼭짓점참조|축|면>}]` 또는 회전체 `axis:{label:"회전축"}`) 허용 — 관측기는 라벨 소속을 검사. 실제: `24_율촌중기말-solid1/q1`(전개도 두 개에서 `a` 제거, 면 세기 번호로), `q4`(가운데 점선에 "회전축"), `25_신흥중기말-solid1/q6`·`q7`(e28b 폴더 `/home/user/AP------/.tmp/svg-m1/runs/e28b/25_신흥중기말-solid1-q6`·`-q7`: 꼭짓점 번호 대신 강조만; q7은 정육면체 모서리 위/아래/세로 묶음 강조, 정이십면체 한 꼭짓점의 5면 칠).
2. **전개도 면 기호**: `net.faceLabels` text에 비ASCII 기호(①~⑩, 가~하, (1)~(9)) 허용(넓이 숫자 검산 규칙은 그대로). 원뿔 전개도 부채꼴 면 라벨이 `SOLID_FACE_LABEL_OUTSIDE_FACE`로 오판되는 것 수정(`24_향림중기말-solid1/q11`). 전개도 변 길이 라벨(`net.edgeLabels:[{face,edge,text}]`)과 밑면 직각(`net.rightAngles` 이미 있음) — `24_율촌중기말-solid2/q19`(직각삼각형 밑면 6·8·10, 높이 10).
3. **원뿔 모선 같음 표시**: 이름 없는 원뿔의 좌·우 모선에 같은 길이 눈금(`marks.equalSlant:true` 등) — `24_향림중기말-solid1/q3`.
4. **E4b 꼭짓점 세 개 절단**: `cuts:[{vertices:["A","C","F"]}]`(꼭짓점 이름 또는 `#b0` 참조) — 직육면체 한 꼭짓점을 잘라 낸 입체와 잘린 삼각뿔, 숨은선 점선. 관측기는 남은 꼭짓점·모서리·면을 독립 계산. 실제: `24_향림중-solid2/q16`(analysis.txt 참고), 23_왕운중 2학기 중간 q16(면 AGC 절단).
5. **E5b 합성 패널 5~6개**: 2×3 격자(캡션 높이 포함) — `24_율촌중기말-solid2/q3`(원기둥·원뿔·원뿔대·구·반구 5종 단면).
6. **원기둥 안 여러 구**: `inside:[{kind:"SPHERE",r,centerZ}...]` 또는 `stack:{count,r}` — 공 3개가 꼭 맞는 원기둥(`24_율촌중기말-solid2/q21`, 24_왕운중 2학기 기말 q23). 관측기는 접함·높이 독립 검사.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드가 없으면 기존 SVG 바이트 동일. 1(a) 완화는 "라벨 없음"만 허용하는 것이지 다른 검사를 끄는 것이 아니다.
- 가이드 3-입체·합성 패널 절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. hints.mjs에 새 코드 안내 한 줄씩.
- 테스트(python은 `PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest ...`), 시작 시 기준 기록 후 비교. 정답지 회귀(바이트 동일): golden item22, 26, 36, 42, 47, 48, 52, 56, 59 — 하나씩, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장.
- 실제 문항을 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인; 원문에 없는 이름·기호를 쓰지 않는다; 정답 값을 그림에 쓰지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json)는 `/home/user/AP------/.tmp/svg-m1/runs/e28c/<폴더>-q<N>/`. 정답지에 대표 문항 `ops/golden/item61/plan.json`(+manifest).
- 별도 git worktree. 렌더·테스트는 하나씩(CPU 4개 공유). 커밋은 기능별 `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트, 정답지 바이트 동일, 실제 문항별 상태·PNG 경로, 못 한 부분과 이유, 워크트리·브랜치.
