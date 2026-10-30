# 엔진 확장 E36: 정규분포 곡선과 넓이 표시 (+ 산점도 기준선)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-common.md`를 읽고 따른다(reset 대상 origin 끝은 E30·E34 포함 최신). 범위: 통계 쪽 — 새 capability `normal-curve-figure-v1`(또는 stat-chart-figure-v1의 새 kind, 기존 통계 바이트 동일이 쉬운 쪽)과 stat-chart 산점도. 그래프(graphPlan)·평면·입체·수직선 코드는 건드리지 않는다(다른 작업자 E31·E33·E35가 동시에 고친다).

설계 초안: `/home/user/AP------/.tmp/svg-m1/surveys/h2-sample/survey.md`의 "정규분포 곡선 그림 (normal-curve-figure-v1)" 절(plan 모양·관측기 확인 항목·거절 사례). 원칙: **종 모양 기본형 하나**를 정확한 밀도식으로 그리고, 그 위에 넓이(확률) 표시 도구를 얹는다.

## 기능 (위에서부터; 하나 끝내고 커밋한 뒤 다음)
1. **정규분포 곡선 기본형**: `normal.curves[]:{id, mean, sd, label?}` 1~3개(평균 이동·σ 비교, 평균이 움직이는 비교용 3개까지), x축에 μ, μ±σ, μ±2σ 같은 눈금(`axis.ticks`, 문자 눈금 "m", "m+σ" 허용), 표준화 눈금(z) 선택, μ 대칭축 점선. 관측기: 폴리선이 밀도식과 일치·봉우리 x=μ·σ 비에 맞는 높이비.
2. **넓이(확률) 표시**: `shades[]:{curve, from|null, to|null, tone?}`(한쪽 꼬리·양쪽 구간·두 곡선 꼬리), 넓이 라벨 `areaLabels[]:{shade, text}`(문제가 준 표 값·식 "0.4332", "0.5+0.1915", 미지수 "p"), 대칭 쌍 점선 `symmetry[]:{curve, pair:[a,b]}`. 관측기: 색칠 경계가 from·to에서 수직으로 끊기고 곡선과 x축 사이, 라벨 위치가 자기 영역 안 또는 지시선.
3. **산점도 기준선·영역**: stat-chart 산점도에 기준선(`refLines:[{type:"y=x"|"x=k"|"y=k"}]`), 기준선 한쪽 영역 강조와 그 안 점 개수 라벨. 실제: 24_연향중 2학기 기말 중3 q19(·q18 묶음, `/home/user/AP------/.tmp/svg-m1/surveys/m3-sample/survey.md` 참고).

## 실제 문항 (h2 표본에서 막힌 10문항 중 대표)
packet은 `node /home/user/AP------/.tmp/svg-m1/make-packet.mjs <시험 js 경로> /home/user/AP------/.tmp/svg-m1/runs/e36/packets/<시험>.json --with-existing`으로 만든다. 시험지: `archive/exams/original/high/h2/2mid/22_순천고_2학기_중간_고2_확률과통계.js`(Q6·Q7·Q18·Q20·Q21), `archive/exams/original/high/h2/1final/23_팔마고_1학기_기말_고2_확률과통계.js`(Q8·Q9·Q14·Q17·Q19) — 정확한 파일명은 폴더에서 찾는다. 이 중 최소 6문항을 새 기능으로 그려 `runs/e36/<시험>-q<N>/`에(plan.json, out/figure-solution.svg, figure.png, publish.json, item.json). 정답 값(구하는 확률·k 값)은 쓰지 않는다 — 문제가 준 표 값·중간 넓이는 된다. 산점도는 24_연향중 2학기 기말 중3 q19.
