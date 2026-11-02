# G16: 통계 표시 — 점도표 평균선·편차 · 산점도 일반 직선·점 색·추세 화살표 · 통계 합성 패널 · 직사각 주사위 표 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g16`으로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g16/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순(1~3이 핵심, 4~5는 남는 시간).
워크트리 기준은 origin/main(G15 PR #1220 포함)이다. `git log --oneline -1`로 확인.

## 왜 (학생에게 무엇이 좋은가)
중3 2학기 통계(대푯값·분산·산점도)와 중2 확률 해설은 "평균에서 각 자료가 얼마나 떨어졌나", "직선 x+y=14 위쪽 점을 센다", "두 반의 분포를 나란히 비교"로 푼다. 지금 엔진은 점도표에 평균선·편차를, 산점도에 x=k·y=k·y=x 말고는 직선을 못 그리고, 통계 그림을 패널로 나란히 놓지 못해 이 해설 그림이 문제 그림 복사에 그치거나 빠진다(25·24 중3 기말 작업에서 10문항 이상). 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다.

## 지금 코드
`production/stat-chart-v1.mjs`(DOT_PLOT·SCATTER·DICE_TABLE·TREE·HISTOGRAM 등, 키 화이트리스트), 관측기 `production/stat_chart_observer.py`(+ worker), 합성 `production/composite-candidate-svg-v1.mjs`(`compositePanels`; G13b에서 set 패널을 넣은 방식 참고), `render-plan.mjs` 패널 분기, 합성 관측 `archive-inverse-observation-v1.mjs`. 가이드 `production/author-guide-body.md` 통계 절.

## 기능 1: 점도표 표시 (DOT_PLOT)
- 필드(옵트인): `marks:{meanLine:{value,label?}, medianLine:{value,label?}, highlight:[{value,count?,color}], deviations:true}`.
  - meanLine/medianLine: 세로 점선 + 라벨(기본 "평균 72"). value는 정확값(분수 허용) — 관측기는 자료로 다시 계산해 일치를 확인(평균·중앙값이 자료와 다르면 `STAT_DOT_MEAN_MISMATCH`/`STAT_DOT_MEDIAN_MISMATCH`).
  - highlight: 특정 값의 점 색(C1 팔레트) — 이상값·최빈값 강조.
  - deviations: 각 점 열 아래(또는 위)에 편차(값−평균) 라벨. 자리가 없으면 거절 `STAT_DOT_DEVIATION_NO_ROOM`.
- 샘플: 25 금당중 중3 q12·q17, 25 연향중 중3 q13·q15, 24 신흥중 중3 q14 (지금 그림 `/home/user/AP------/.tmp/svg-m1/runs/f2524m3-stat2/<시험지>/q<N>/` plan.json 출발).

## 기능 2: 산점도 일반 직선·점 색·추세 화살표 (SCATTER)
- `refLines`에 `{"kind":"LINE","a":1,"b":1,"c":14,"label":"x+y=14","style":"DASHED"}`(ax+by=c, 정수·분수). 기존 x=k·y=k·y=x는 그대로.
- `pointGroups:[{"points":[[8,10],...],"color":"BLUE","label?":"..."}]` — 조건을 만족하는 점 색. 관측기: 그 점들이 실제로 조건(직선 위/아래)을 만족하는지가 아니라, 지정한 좌표의 점이 지정 색인지 확인.
- `trendArrow:{"direction":"UP"|"DOWN"}` — 양·음의 상관 띠 위에 화살표(라벨 없이).
- `regions`에 반평면 `{"kind":"HALF_PLANE","a":1,"b":1,"c":12,"side":"GE"}`(ax+by≥c 또는 LE, GT/LT는 경계 점선) 옅은 색칠. 관측기는 칠한 다각형이 그래프 틀과 그 반평면의 교집합인지 확인.
- 거절: `STAT_SCATTER_LINE_INVALID`(a=b=0, 그래프 범위 밖), `STAT_SCATTER_GROUP_POINT_UNKNOWN`(자료에 없는 점).
- 샘플: 24 신흥중 중3 q20(x+y≥14, 데이터는 24 연향중 q18 문제 그림과 같은 15점 — 정답 논란이 있으니 그림만, caption 없이 메인 보고), 25 신흥중 중3 q20(y−x=2, x+y=10, 네 점 색), 25 신흥중 중3 q18(추세 화살표), 25 신흥중 중3 q24(x+y≥12 영역·점 색). 지금 그림·GAP: `/home/user/AP------/.tmp/svg-m1/runs/f2524m3-stat1/summary.json`, `.../f2524m3-stat2/summary.json`.

## 기능 3: 통계 합성 패널
- `composite-panels-v1`에 stat-chart 패널 2~4개(같은 합성 안에서 stat만; 섞으면 `COMPOSITE_STAT_PANEL_MIXED_<i>`). 2열 격자, 패널 제목 규칙은 기존. G13b set 패널과 같은 구조로.
- 관측기: 패널마다 stat 관측기를 그 영역에 적용.
- 샘플: 25 연향중 중3 q18, 25 풍덕중 중3 q19, 24 신흥중 중3 q18, 25 왕운중 중3 q16(점도표 2~3패널 + 평균선) (UNSUPPORTED였던 것, 해당 summary.json 참고).

## 기능 4: 직사각 주사위 표·칸 값 (DICE_TABLE) — 남는 시간
- `rowFaces`·`colFaces`(각 1~8개, 정수 목록)로 직사각 표. `cellText:"EXPR"` + `cellExpr:"2a+b"`(a=열 값, b=행 값, 정수 연산만)로 칸에 값. 기존 PAIR/SUM/PRODUCT/NONE 그대로.
- 샘플: 25 팔마중 중2 q23(8×3), q12(2a+b 금액) — 지금 그림 `/home/user/AP------/.tmp/svg-m1/runs/f25m2-misc/`.

## 기능 5: 수형도 경로 색·수직선 화살표 개수 — 남는 시간
- TREE `highlightPaths[].color`(C1 팔레트, 경로마다 다른 색). NUMBER_LINE spans 한 줄 상한 3 → 6.
- 샘플: 25 연향중 중2 q23(경로 셋 색), 25 팔마중 중2 q18(+2, −1, −1, −1 네 화살표).

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 stat-chart를 쓰는 항목(DOT_PLOT·SCATTER·DICE_TABLE·TREE·NUMBER_LINE 각 1~2개, item21·item41·item34h 포함)과 composite 대표(item24, item36, item107g13b)를 고른다(15개 안팎). 새 항목 `item111g16`(점도표 평균선) + manifest.

## 실제 문항 결과
`runs/g16/<시험 약칭>-q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답, 서술형 소문항 답도 caption만).
