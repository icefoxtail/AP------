# G19: 정규분포 — 문제 표 값 넓이 라벨 · 정규곡선 합성 패널 · 좁은 꼬리 지시선 라벨 · σ 비 한도 · 수직선 소수 끝점 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g19`로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g19/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순(1~3 핵심).
워크트리 기준은 작업 브랜치: `git fetch origin ccr-467a4126-sn3mnl && git reset --hard origin/ccr-467a4126-sn3mnl`, `git log --oneline -3`에 G19 지시서 커밋이 보여야 한다. 같은 시간에 다른 작업자가 그래프 엔진(phase2.mjs·graph_observer.py, G18a)을 고친다 — 그 파일은 건드리지 않는다.

## 왜 (학생에게 무엇이 좋은가)
고2 확률과통계 해설은 "표준정규분포표에서 P(0≤Z≤1)=0.34", "두 분포를 표준화해 나란히 비교", "꼬리 넓이 0.02"로 푼다. 25·24 고2 기말 그림을 그리며 문제에 주어진 반올림 표 값(0.34, 0.477, 0.02)을 그림에 쓰지 못하고(적분값 2e-4 일치 요구), 정규곡선을 패널로 나란히 놓지 못하고, 좁은 꼬리 넓이 라벨이 자리 없음으로 거절돼 값이 모두 캡션으로 밀렸다. 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다.

## 지금 코드
`production/stat-chart-v1.mjs`(NORMAL_CURVE·NUMBER_LINE 등), 관측 `production/stat_chart_observer.py`(+ worker), 합성 `production/composite-candidate-svg-v1.mjs`·`render-plan.mjs`(G16 stat 패널은 DOT_PLOT·SCATTER만: STAT_PANEL_KIND_UNSUPPORTED). 가이드 `production/author-guide-body.md` 통계 절.

## 기능 1: 문제 표 값 넓이 라벨
- `areaLabels[i].source:"TABLE"` + `text:"0.34"` — 문제에 주어진 표 값(반올림)을 그대로 쓴다. 관측기는 적분값과의 차이가 0.01 이하(2자리 표) 또는 0.0005 이하(4자리 표, 소수 자릿수로 판정)인지 확인. 기본(source 없음)은 지금처럼 2e-4.
- 샘플: 25 금당고 고2 확통 q11(0.34), 25 순천고 q12(0.48, 0.98), 25 강남여고 q19(0.41, 0.49, 0.19). 지금 plan: `/home/user/AP------/.tmp/svg-m1/runs/h2f-stat1/<시험지>/q<N>/`.

## 기능 2: 좁은 꼬리 넓이 라벨을 지시선으로
- 꼬리가 좁아 영역 안에 글자가 안 들어가면 곡선 바깥(위쪽 빈 곳)에 라벨을 두고 짧은 지시선으로 그 영역을 가리킨다(`placement:"LEADER"` 또는 자동 대체). 지금 STAT_NORMAL_AREA_LABEL_NO_ROOM.
- 관측기: 지시선 끝이 해당 영역 안(또는 경계 위)인지.
- 샘플: 25 강남여고 q20(−1.64 꼬리 p), 25 금당고 q12(양쪽 꼬리), 25 순천고 q7·q23(`.../h2f-stat2/<시험지>/q<N>/`).

## 기능 3: 정규곡선 합성 패널
- `composite-panels-v1` stat 패널에 NORMAL_CURVE 허용(2~3 패널, 세로 쌓기 권장: 표준화 전·후 또는 두 분포). 패널 사이 같은 Z 눈금 정렬은 선택.
- 샘플: 25 강남여고 q19(N(240,4²)와 N(40,6²)), 24 매산여고 q10(두 꼬리 비교), 25 강남여고 q24(X, Y 두 분포).

## 기능 4: σ 비 한도·글자 σ 두 곡선 (남는 시간)
- 한 그림 두 곡선의 σ 비 한도 4 → 10(표본평균 분포 σ/√n, n=64 → 8). 글자 σ 곡선 2개(σ와 σ/√n) 허용.
- 샘플: 25 제일고 q19(비 5), 25 금당고 q19(σ와 σ/√n, 비 8).

## 기능 5: 수직선 소수 끝점 (남는 시간)
- NUMBER_LINE 값에 소수(소수점 둘째 자리까지) 허용(지금 NUMBER_LINE_VALUE_INVALID). 신뢰구간 40.2~59.8 같은 표시.
- 샘플: 25 제일고 q13.

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 NORMAL_CURVE·NUMBER_LINE·stat 합성(item111g16 포함) 항목 10개 안팎. 새 항목 `item114g19`(표 값 라벨 + 지시선) + manifest.

## 실제 문항 결과
`runs/g19/<시험 약칭>-q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답). 기존 폴더의 publish.json을 출발점으로.
