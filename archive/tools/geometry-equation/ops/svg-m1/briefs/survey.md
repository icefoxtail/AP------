# 표본 조사 (읽기 전용): 남은 학년 시험지에서 해설 그림이 얼마나 필요하고, 지금 엔진으로 얼마나 그릴 수 있나

저장소를 고치지 않는다. 커밋·렌더 금지. 시험지 JS는 작은 python 스크립트(`python3 -I 스크립트`, 스크립트는 출력 폴더에 저장)로 읽고, 시험지 파일 전체를 맥락에 붙여 넣지 않는다.

## 입력
- 시험지: `{FOLDERS}` 안의 원본 기출 JS(`/home/user/AP------/archive/exams/original/...`). 문항 객체에 content(또는 stem)·choices·answer·solution·`image`(문제 그림, `archive/` 기준 경로)·`solutionImage*`.
- 엔진 능력: 아래 요약 가이드를 한 번씩 읽는다(전체 AUTHOR_GUIDE는 너무 크니 읽지 않는다): `/home/user/AP------/.tmp/svg-m1/guide/guide-core.md`, `guide-plane.md`, `guide-graph.md`, `guide-solid.md`, `guide-stat.md`, `guide-tips.md`. 이후 추가된 것(E30·E34·진행 중 E31~E35): 좌표 TEXT 라벨, 평각·각 합 표식, 공통 변, 그래프 축별 배율·overlay 한글 이름, 수직선 행 라벨·점 모양·거리 괄호·부등식 라벨 숨김, 통계 미상 계급·떨어진 계급 합·범례·점도표, 주사위 표 묶음 색·수형도 경로 강조, (진행 중) 좌표·그래프 직선 라벨 배치, 평면 좁은 영역·치수선·호 라벨, 입체 쌓기·축 밖 구·높이 표기, 수직선 컴퍼스 작도(√2)·값 없는 문자 점.
- 이미 처리한 시험지(건너뛴다): `/home/user/AP------/archive/tools/geometry-equation/production/exam-figure-ledger.json`의 exams.

## 방법
1. 지정 폴더의 시험지를 문항 수·기존 solutionImage 수와 함께 나열하고, 지시한 개수만큼 고른다 — 연도(최근·옛날)·학교·학기·과목을 고르게 섞는다(일부러 그림 많은 시험지만 고르지 않는다: 전체를 대표하는 표본). 해설(solution)이 비어 있는 시험지는 고르지 않고 개수만 센다.
2. 고른 시험지의 모든 문항: 해설 그림이 학생에게 정말 도움이 되나 — `REQUIRED` / `BENEFICIAL` / `NOT_NEEDED`. 필요하면 그림 종류와 지금 엔진으로 그릴 수 있는지(`DRAWABLE`, 쓰는 기능 이름) 또는 없는지(`MISSING`, 빠진 기능을 정확히). 핵심 요소 하나(곡선, 표식, 두 번째 함수 등)라도 없으면 DRAWABLE로 세지 않는다. 기존 solutionImage가 있으면 적정(`KEEP`)인지 교체(`UPGRADE`)인지도.
3. 문제에 "그림"이라 했는데 image가 없는 문항(데이터 문제)은 따로 센다.
4. 빠진 기능을 문항 수 순으로 정리하고, 상위 5개는 짧은 설계(plan 모양, 관측기가 최종 SVG에서 확인할 것, 거절 사례, 풀리는 문항).

## 출력
`{OUT}/survey.md`(한국어)와 `{OUT}/survey.json`(`{"exams":[{exam, questions, verdicts:[{ord, need, kind, drawable, capability|missing}]}], "rankedGaps":[{capability, count, ords}], "missingImages":[...], "folderCounts":{...}}`). 최종 답(짧게, 한국어): 고른 시험지, 집계(문항 / 그림 필요(REQUIRED+BENEFICIAL) / 지금 그릴 수 있음 / 빠진 기능 때문에 못 그림 / 교체 필요), 빠진 기능 순위, 폴더별 시험지 수(해설 있음/없음), 파일 경로.
