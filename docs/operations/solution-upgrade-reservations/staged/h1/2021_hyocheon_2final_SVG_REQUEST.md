# SVG_REQUEST — 2021 효천고 2학기 기말 q13 두 곡선 넓이의 회전·상쇄

- lane: lane10, work/solution-upgrade-lane-10-20261121
- sourcePath: archive/exams/original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js
- sourceBlobSha: ac6d28a1dab09e28cba4abc8de20f763a924189b
- qid: 13 / old answer ① 40
- 완성 수식 판서: 2021_hyocheon_2final_q13.md
- status: **SVG_REQUEST / VISUAL_HOLD**. 엔진 plan·SVG·렌더·게시를 하지 않았다.

## 정본 문서 링크 — 실제 제작 담당이 먼저 전체를 읽을 것

- [SVG 정본/엔진 강제 규칙](https://github.com/icefoxtail/AP------/blob/main/docs/agents/visual-svg.md)
- [SVG HANDOFF](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md)
- [AUTHOR_GUIDE](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)
- [guide-graph](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md)
- [Golden manifest](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/ops/golden.manifest.json)

## 수학적으로 반드시 보존할 관계

\[
y=
\begin{cases}
-\frac{x^2}{2},&x<0,\\
-\sqrt{2x},&x\ge0,
\end{cases}\qquad
y=\frac{x-20}{3}.
\]
교점과 연결점:
\[
A(-4,-8),\quad O(0,0),\quad B(8,-4).
\]
- 직선 AB는 x−3y−20=0. 왼쪽 곡선 A→O, 오른쪽 곡선 O→B, 선분 AB가 둘러싼 한 영역을 보인다.
- OA와 OB는 회전 관계이며 각각 길이 \(\sqrt{80}\), 기울기 \(2\)와 \(-1/2\)이므로 서로 직각.
- 원점 중심 반시계 90도 회전 \(R(x,y)=(-y,x)\)을 적용하면 A→B, O→O, 왼쪽 곡선의 모든 점 \((u,-u^2/2)\)은 \((u^2/2,u)\)로 이동하여 오른쪽 곡선 \(y=-\sqrt{2x}\)에 정확히 놓인다.
- 왼쪽 곡선과 현 OA 사이의 휘어진 부분 \(S\)는 삼각형 AOB 바깥에 **더해지며**, 오른쪽 곡선과 현 OB 사이의 합동인 휘어진 부분 \(S\)는 안쪽에서 **빼진다**. 핵심은 \(+S-S=0\).
- 따라서 구하는 넓이는 직각삼각형 AOB의 넓이 \(\frac12\sqrt{80}\sqrt{80}=40\). 곡선으로 둘러싸인 영역과 삼각형을 서로 혼동하면 안 된다.

## 그림 구성 요청

- 가능하면 **1패널 원 그래프 + 1패널 90도 회전/상쇄 설명**: 좌표축 동일 단위, 세 점 A/O/B, 곡선 두 조각과 직선 AB, 현 OA/OB, 휘어진 두 영역을 서로 대응되는 점선/라벨 S로 표시.
- 고1 수학 범위에서는 적분 넓이를 계산하지 않으므로 **회전·합동·삼각형 넓이**가 핵심임을 보여준다.
- 원문에 해설 원본 이미지가 없고 사용자가 그림 제작은 별도 엔진 라인에만 맡기라고 했으므로 이 lane에서 SVG를 제작하지 않는다.
- 무리함수+이차함수 두 조각에 직선과 회전 대응이 동시에 필요하다. 단일 함수 패밀리가 이 전체 도형을 지원한다고 **가정하지 말 것**. 엔진 다중 그래프·패널/오버레이의 실제 계약으로 가능한지 먼저 확인하고, 지원되지 않으면 오류 코드·대안 계획을 넘긴다. 수작업 SVG 금지.
- 렌더 시 A(-4,-8), B(8,-4)와 함수값, 수직 OA⊥OB, 두 휘어진 부분의 상대위치, 독립 엔진 관측기, PNG 육안, 학생폰/A4 기준, Golden/Negative와 게시 슬롯을 전부 검수한다.

현재 엔진 제작·실제 SVG·Golden·Negative·브라우저 렌더·출고 PASS 모두 **NOT_RUN**. 운영 JS/SVG/main 미변경.
