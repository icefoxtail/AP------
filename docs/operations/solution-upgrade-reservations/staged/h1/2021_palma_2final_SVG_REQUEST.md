# SVG_REQUEST — 2021 팔마고 고1 2학기 기말 q20·q21

- 요청자: lane10 / branch work/solution-upgrade-lane-10-20261121
- sourcePath: archive/exams/original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js
- sourceBlobSha: 29c20420256218751fe4f3294173e26ae67c2d80
- 신규 그림은 기존 엔진에서만 만든다. 이 문서는 SVG_REQUEST이고 plan.json 생성·SVG/PNG 렌더·게시·화면 검수를 수행한 증거가 아니다.
- 풀이 원문 완성 MD: 2021_palma_2final_q20.md, 2021_palma_2final_q21.md
- 상태: SVG_REQUEST / VISUAL_HOLD / Golden NOT_RUN / Negative NOT_RUN / render NOT_RUN / release NOT_RUN

## 착수 전 확인할 정본 문서 (원격 main 본문 일부와 그래프 관련 규칙 직접 확인함)

1. [Visual SVG 규칙](https://github.com/icefoxtail/AP------/blob/main/docs/agents/visual-svg.md): 신규 SVG 엔진 전용 제작, 문제·해설 슬롯 분리.
2. [SVG 엔진 HANDOFF](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md): 엔진 복원·독립 검산·게시 흐름.
3. [AUTHOR_GUIDE](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md): plan 형식, SVG 직접 작성 금지, 원문과 엔진 출력 검증.
4. [guide-graph](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md): 무리함수 sqrt-affine / 유리함수 rational / multi-curve 범위와 지원 한계.
5. [Golden manifest](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/ops/golden.manifest.json): 엔진이 통과시킨 실제 사례 plan 선택.
6. [문제은행 시각 게이트](https://github.com/icefoxtail/AP------/blob/main/docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md).

주의: 단일 sqrt-affine-spike-v1 그림은 무리곡선 한 개만 표현하므로 직선과 교점 여러 개를 함께 보이는 그림으로 오인하지 않는다. multi-curve-figure-v1/복합 패널 등의 **실제 현재 계약**을 구현자가 전체 문서에서 확인하고 선택한다. 미지원이면 지원 오류와 재현 근거를 남기고 SVG는 보류한다.

## q20 — 무리함수와 기울기 1인 직선의 교점 개수

원문:
\[
y=\sqrt{4x-8}\quad(x\ge2),\qquad y=x+k.
\]
정답:
\[
\boxed{k<-2\text{ 또는 }k=-1}.
\]
그림으로 반드시 표현할 수학적 내용:
- 시작점 (2,0)에서 오른쪽 위로 증가하되 점점 완만해지는 근호 곡선.
- 직선들은 모두 기울기가 1로 같고 k 증가에 따라 평행이동한다.
- k=-3: 교점 한 개. k=-2: **두 개** (2,0), (6,4). 경계 k=-2는 정답에서 제외.
- k=-3/2: 두 개. k=-1: **한 개** (3,2)에서 접함. k=0: 교점 없음.
- 여러 직선을 한 좌표평면에 넣으면 라벨 겹침 우려가 있으니 2~3패널 비교를 우선하되 같은 좌표 단위를 사용. 선은 색뿐 아니라 라벨·실선/점선으로 구별.
- 작은 근이 음수일 때 원래 근호 값 t≥0에 어긋나는 무연근을 실제 교점으로 찍으면 안 된다.
- 엔진 독립검증 기준: t=√(4x−8)≥0, x=(t²+8)/4, (t−2)²=−4(k+1). k=-2에서는 t=0,4로 실제 교점 두 개; k=-1에서 t=2만 유효. 접점 x=3에서 곡선의 기울기 2/√(4x−8)=1.
- q20 학생용 수식 완성: 2021_palma_2final_q20.md

## q21 — 유리함수와 위아래 경계의 동시 그래프

\[
F(x)=\frac{x-1}{x+1}=1-\frac2{x+1},\quad1\le x\le3,
\]
\[
L(x)=-x+1,\qquad U(x)=1-\frac{x}{6}.
\]
정답:
\[
\boxed{a_{\max}=-1,\qquad b_{\min}=-\frac16}.
\]
그림 요구:
- x=1~3 구간에서 F,L,U를 **같은 축에** 보이게, 역할 다른 선을 직접 라벨.
- P=(1,0)에서 F(1)=L(1)=0, Q=(3,1/2)에서 F(3)=U(3)=1/2을 정확히 표시.
- 모든 x∈[1,3]에서 L(x)≤F(x)≤U(x)가 눈으로 비교돼야 한다.
- -1과 -1/6은 **직선의 기울기**이다. 교점 y좌표로 잘못 쓰지 않는다.
- 원문 q21 채점표에 별도 그래프 점수가 있는데 기존 solution에 실제 연결된 해설 그림 증거가 없다. 이 요청은 **해설용 신규 시각자료**이고 문제용 원본을 대체하지 않는다.
- q21 학생용 수식 완성: 2021_palma_2final_q21.md

## 품질·인계 상태

- 엔진 담당은 원본 source와 고정 SHA 일치, item ordinal 20/21, 현재 그래프 계약, 실제 골든 사례와 엔진 plan-lint, 렌더 ARCHIVE_BOUND, 독립 좌표 검산, PNG 눈 검수, 모바일/A4 가독성, 게시 후 JS 슬롯 연결을 각각 확인한다.
- 엔진 미지원이면 수작업 SVG로 대체하지 않고 실패 원인과 가능한 fallback 계획만 남긴다.
- 현재 lane10의 q20/q21 학생 풀이 draft는 완료지만 SVG_REQUEST는 실제 제작이 아니다.
- 운영 JS/SVG/main 직접 변경 없음. 출고 PASS 주장 없음.
