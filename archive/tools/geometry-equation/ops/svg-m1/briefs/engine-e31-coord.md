# 엔진 확장 E31: 좌표·그래프 직선 라벨과 표기 (중2 일차함수에서 반복)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-common.md`를 읽고 따른다. 범위: 좌표 작도(SOURCE_COORDINATE_AXES)·그래프(graphPlan, overlays). 평면도형·입체·수직선·통계는 건드리지 않는다.

## 기능 (위에서부터; 하나 끝내고 커밋한 뒤 다음)
1. **간격 좁은 평행선·가파른 직선의 식 라벨 배치**: 라벨 후보를 직선의 보이는 구간 전체(양 끝·중간 여러 t)에서 찾고, 지시선이 자기 직선에 닿게 한다. 작성자가 `labelAt: "START"|"END"|t(0~1)`로 지정 가능. 지금 실패: `OVERLAY_LINE_LEADER_NOT_ON_OWNER`(평행선 쌍), `LAYOUT_INVENTORY_INCOMPLETE`(식 라벨 자리 없음), 가파른 직선 lineLabels 미배치. 실제: `26_왕운중2b/q17`(FAILED, -10x+4y+3=0과 평행선), `26_왕운중2b/q24`(패널1 y=x+4 라벨), `26_왕의중2b/q11`(평행 두 직선 — graph plan이 버려짐), `26_왕의중2b/q22`(y=4x-6이 짧은 선분으로 그려짐).
2. **기호식 직선 라벨**: 좌표 작도 lineLabels·graph overlay 직선에 자유 식 텍스트(`text:"y=ax+6"`, `"x-1=0"`)를 수식으로 조판. 세로선 x=k 라벨도 같은 방식. 실제: `26_왕의중2b/q12`(FAILED, y=ax+6·x절편 6/a), 26_신흥중·팔마중 1학기 기말 q18·q14(x-1=0).
3. **좁은 영역 안 기호 길이 라벨 지시선 밖 배치**: 좁은 삼각형 안 길이 라벨(6/a, 3)이 자리가 없으면 지시선으로 바깥에. 실제: `26_왕의중2b/q12`.
4. **이름 없는 점·교점 좌표 라벨**: overlay 이름 없는 점·두 곡선(직선) 교점·좌표 작도 숨은 점에 좌표 라벨 `(1,-1)`, 분수 좌표 `(3/2, 0)`. 실제: `26_왕의중2b/q19`(교점 (1,-1), y절편 1).
5. **사분면 표시**: 사분면 이름 TEXT 라벨(E30 textLabels가 그래프에도 되면 재사용)과 사분면 색칠(`quadrants:[{n:2, fill:true, label:"제2사분면"}]`). 실제: `26_왕운중2b/q15`(직선이 지나는 사분면 — 지금은 캡션만).
6. **overlay 직선 점선·한 점에서 뻗은 직선 묶음 라벨**: `overlays.lines[].style:"DASHED"`(평행 이동한 직선 표시), 한 점 P(0,1)에서 뻗은 여러 직선의 식/기울기 라벨 배치(부채꼴로 모인 직선). 실제: `25_왕의중2b-plane1/q17`(FAILED, formula·lPA-equation·tPA 자리 없음), `q14`·`q16`(평행선이 실선).
7. **밑 그래프 식 라벨·정의역 제한 직선·합성 그래프 패널**: graphPlan 밑 곡선(직선) 자체의 식 라벨 필드(지금 base line 라벨 없음 — `25_왕의중2b-plane2/q20`), 닫힌 구간 직선(끝점 제한)을 overlays와 함께(`25_진남중2a-plane1/q20`: 직선이 끝점을 넘어 그려지고 최솟값 라벨 빠짐), 합성 패널에 일차함수 그래프 패널 허용(지금 이차 polynomial-spike만, piecewise는 PIECEWISE_POLY_CURVE_TOO_NARROW — `25_왕의중2b-plane2/q23`).
8. **좌표 작도 displayLines와 평행 표식(parallels) 동시 사용**(`25_연향중2c-plane3/q21`), lineLabels 문자 계수 식(ax+y+4=0). **밑 곡선 없는 그래프**: 직선(세로선 포함)만 그리는 그래프(지금은 밑곡선 y=0이 x축 위에 굵게 보임 — `25_연향중2c-plane1/q1`).
9. **piecewise+overlays.lines OVERLAY_LINE_MISMATCH 반복** — 원인 단서(25_연향중2c-plane1/q4 작업자 진단): 자동 viewport가 (0,0),(1,0),(0,1)을 엄격히 포함하지 않으면 visual_engine/viewport.py가 창을 8% 넓혀 그려진 직선 길이가 plan viewport와 어긋난다(STATIC_GRAPH_AUDIT_FAIL OVERLAY_LINE_MISMATCH:g). 관측기와 렌더러가 같은 최종 창을 쓰도록 고친다.(26_동산중 1학기 기말 q10·q14·q24 plan 참고: `/home/user/AP------/.tmp/svg-m1/runs/` 아래 26_동산중 폴더) — 원인 찾아 고치거나 정확한 거절 사유로.

## 실제 문항 다시 그리기
`runs/e31/`에: 26_왕운중2b-q17, 26_왕의중2b-q12(둘 다 FAILED → ARCHIVE_BOUND 목표), 26_왕의중2b-q19·q22, 26_왕운중2b-q15·q24(게시본 개선판). 각 문항 packet은 26_왕운중_1학기_기말_중2_기출, 26_왕의중_1학기_기말_중2_기출. 정답(q17·q12의 값, q24의 a 값들)을 쓰지 않는다.
