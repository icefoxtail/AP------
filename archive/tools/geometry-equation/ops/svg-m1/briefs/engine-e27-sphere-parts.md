# 엔진 확장 E27: 구의 일부(자른 구)와 단면 원판 (solid-figure-v1)

**먼저(필수):** 이 워크트리는 main 기준일 수 있다. 시작하자마자
`git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`
(새로 만든 너의 워크트리이므로 안전). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

코드: `production/solid-figure-v1.mjs`(이미 SPHERE·HEMISPHERE 있음), 관측기 `solid_figure_observer.py`(+worker), 합성 경로(`composite-panels-v1`의 입체 패널, E5에서 추가됨), 테스트 `tests/solid-figure.test.mjs`·관련 python 테스트, 가이드 3-입체 절.

## 실제로 막힌 문항 (packet `/home/user/AP------/.tmp/svg-m1/packets/<시험지>.json`, questionImage로 원문 확인)
- 25_왕의중_2학기_기말_중1_기출 q11: 지름 10 구를 4등분한 입체(곡면 1/4 + 반원 단면 2개). 정답 50π.
- 25_팔마중_2학기_기말_중1_기출 q22: 반지름 3 구를 중심을 지나는 서로 수직인 세 평면으로 자름 → 1/8 조각 8개, 새로 생긴 원판 면(한 번 자를 때 원판 두 면). 정답 90π.
- 25_팔마중_2학기_기말_중1_기출 q9: 구(r=3)와 원기둥(r=3, h=5)을 나란히(부피 비교) — 합성 패널로 이미 가능한지 확인만.
- 25_왕운중_2학기_기말_중1_기출 q12 [ㄷ]: 구에서 1/8을 떼어 낸 7/8 구(곡면 7/8 + 사분원 단면 3개). 문항 해설의 [ㄷ] 값은 별도 내용 검산 중이니 그림은 기하만 맞춘다.
item: `{"sourcePath":"archive/exams/original/middle/m1/2final/<시험지>.js","ordinal":N}`.

## 목표
1. `SPHERE`에 자르기 지정 `cut:{"kind":"QUARTER"|"OCTANT"|"SEVEN_EIGHTHS"|"HALF"}`(또는 축 평면 집합으로 일반화 — 중심을 지나는 좌표 평면 1~3개로 자른 조각을 고르는 최소 표현). 남는 입체의 곡면 외곽(보이는 부분 실선, 가려진 부분 점선 규칙 유지)과 평면 단면(반원·사분원·원판)을 정확히 그린다. 단면 면 칠(`faces` role)·반지름 길이 라벨(r=5 등)·중심 O 표시.
2. "한 번 자를 때 원판 두 면" 설명용: 같은 구를 자른 뒤 두 조각을 살짝 떼어 놓은 분해(explode) 보기 `explode:true`(조각 사이 간격, 각 단면 원판 칠) — 범위가 크면 1을 먼저 완성하고 2는 설계·거절 코드로 보고.
- 관측기는 plan에서 조각 기하(곡면 경계 타원 호·단면 다각형/원호)를 독립 계산해 최종 SVG의 외곽·단면·실선/점선을 대조한다.
- 지원 범위 밖 자르기(중심을 지나지 않는 평면 등)는 명시적 거절 코드.

## 함께 할 입체 보강(E28, 1·2 다음)
- 이름 없는 입체(`names` 숨김)에서도 면 칠: `highlights.faces`를 면 번호/위치(BASE, TOP, LATERAL i)로 지정해 옆면을 하나씩 다른 색으로 칠할 수 있게(25_풍덕중_2학기_기말_중1_기출 q2 오각뿔대).
- 합성 패널 안 각뿔의 모서리 세기 번호가 SOLID_COUNT_LABEL_FAR로 거절됨 → 번호 배치 보강(q3, 기존 plan `/home/user/AP------/.tmp/svg-m1/runs/25_풍덕중기말-solid1/q3/plan.json`).
- 원뿔대(원뿔을 잘라 낸 아래 부분) 몸체 칠(q8, `/home/user/AP------/.tmp/svg-m1/runs/25_풍덕중기말-solid1/q8/plan.json`).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드 없으면 기존 SVG 바이트 동일.
- 가이드 3-입체 절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. 다른 절은 건드리지 않는다.
- 테스트: 위 테스트 + 추가 테스트, 시작 시 기준 결과 기록 후 비교. 정답지 회귀(바이트 동일): golden item22, 26, 42, 47, 48, 52 — 하나씩, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장 후 비교.
- 실제 문항(q11, q22, q12)을 새 기능으로 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. 해설 그림은 정답 값을 미리 적지 않는다(풀이가 쓰는 반지름·조각 수 등은 적어도 됨). 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e27/<시험지 짧은 이름>-q<N>/`. 정답지에 대표 문항을 `ops/golden/item56/plan.json`으로(+manifest).
- 별도 git worktree(지금 디렉터리). 렌더·테스트는 하나씩(이 기계는 CPU 4개를 여러 작업자가 나눠 쓴다). 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일, 실제 문항별 상태와 PNG 경로, 못 한 부분과 이유, 워크트리 경로·브랜치.
