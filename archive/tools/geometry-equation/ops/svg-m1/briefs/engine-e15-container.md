# 엔진 확장 E15: 물 채우기 그릇과 물 높이 그래프 (새 capability)

**먼저(필수):** 이 워크트리는 main 기준일 수 있다. 시작하자마자
`git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`
(새로 만든 너의 워크트리이므로 안전). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

## 실제로 막힌 문항 (중1 "그래프와 그 해석")
- 25_연향중 2학기 중간 중1 q4: 그릇 A(위로 갈수록 넓어짐), B(아래는 넓은 원기둥, 위는 가는 관), C(원기둥)와 높이 그래프 ㄱ·ㄴ·ㄷ 짝짓기(정답 ㄱ-A, ㄴ-C, ㄷ-B).
- 25_왕의중 2학기 중간 중1 q5: 위로 갈수록 넓어지는 물컵(원뿔대) → 기울기가 점점 완만해지는 곡선.
- 23_금당중 2학기 중간 중1 q5: 처음 기울기 일정, 마지막에 더 가팔라짐 → 아래 원기둥 + 위 더 좁은 원기둥(목).
문항 원문(questionImage PNG로 확인): packet `/home/user/AP------/.tmp/svg-m1/packets/<시험지>.json`, item `{"sourcePath":"archive/exams/original/middle/m1/2mid/<시험지>.js","ordinal":N}`
(25_연향중_2학기_중간_중1_기출, 25_왕의중_2학기_중간_중1_수학, 23_금당중_2학기_중간_중1_기출).

## 목표
새 capability `container-fill-figure-v1`(이름은 기존 명명 관례에 맞춰도 됨):
1. **그릇 단면 정의**: 아래에서 위로 쌓는 회전체 조각 `profile:[{"kind":"CYLINDER","radius":r,"height":h},{"kind":"FRUSTUM","r0":a,"r1":b,"height":h}]`(원뿔은 r0=0). 그릇 이름(`name`: A, B, 물컵 등) 선택.
2. **그래프는 엔진이 계산**: 매초 일정한 부피 v로 물을 넣을 때 t(h)=∫πr(h)²dh/v를 정확히 계산해 높이-시간 그래프를 그린다(작성자가 곡선을 그리지 않는다). 조각 경계에서 꺾임점, 원기둥 구간은 직선, 넓어지는 원뿔대는 점점 완만, 좁아지는 원뿔대는 점점 가파름. 축 이름(x 시간, y 높이, 단위 선택)과 원점 O, 숫자 눈금은 작성자가 값을 줄 때만.
3. **그릇과 그래프를 나란히**: 그릇 그림과 그래프의 세로 축척을 같게 해서, 조각 경계 높이에서 그릇→그래프로 가는 가로 점선 안내선(선택 `guides:true`)을 그린다. 그래프 구간 이름표(ㄱ, ㄴ, ㄷ)와 그릇 이름 짝(`pairs`)을 여러 쌍(2~3쌍) 한 그림에 배치(행 단위).
4. 선택 `segmentNotes:[{"segment":i,"text":"단면 넓음 → 천천히"}]`: 짧은 한글 설명을 해당 구간 옆에(겹침 검사 포함).
- 관측기는 plan에서 그릇 단면·그래프 점열을 **독립 계산**해 최종 SVG의 곡선 표본점(허용 오차 명시), 꺾임점 위치, 안내선 높이 일치, 라벨 소속을 검사한다(곡선 모양이 다르거나 안내선 높이가 어긋나면 FAIL).
- 지원 범위 밖(구, 비대칭 그릇 등)은 명시적 거절 코드.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 기존 capability의 출력은 바이트 동일(새 capability를 추가만 한다).
- 기존 capability 하나(예: `production/number-line-v1.mjs`·`number_line_observer.py`, `stat-chart-v1.mjs`)의 구조·Archive 결속·관측기 연결 방식을 그대로 본뜬다. `render-plan.mjs` 분기, 정책/가이드 계약(`phase2.mjs` 등) 등록, 가이드 `production/author-guide-body.md`에 새 절 추가 후 `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성(다른 절은 건드리지 않는다).
- 테스트: 새 테스트 파일(node `--test`, python 관측기는 `python3 -m unittest`) + `tests/author-guide.test.mjs`. 정답지 회귀(바이트 동일): golden item11, item21, item41 — 하나씩 렌더, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장 후 비교.
- 실제 문항 3개를 새 기능으로 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. 해설 그림은 정답을 미리 적지 않는다(짝은 풀이가 설명하는 관계로 보여 주되, 묻는 보기 번호를 쓰지 않는다). 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e15/<시험지 짧은 이름>-q<N>/`. 정답지에 대표 문항을 `ops/golden/item55/plan.json`으로(+manifest).
- 별도 git worktree(지금 디렉터리). 렌더·테스트는 하나씩. 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 capability·필드·오류 코드, 테스트 결과, 정답지 바이트 동일, 실제 문항 3개 상태와 PNG 경로, 못 한 부분과 이유, 워크트리 경로·브랜치.
