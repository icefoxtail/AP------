# lane10 → SVG 엔진 라인: 2019 강남여고 고1 2학기 기말 q21 보조 그림

- source: archive/exams/original/high/h1/2final/19_강남여고_2학기_기말_고1_기출.js
- source original blob SHA: 000191c34e6b23d50d23a71ca7de1e5e848349d0
- student MD: docs/operations/solution-upgrade-reservations/staged/h1/2019_gangnam-girls_2final_DEEP_AUDIT.md
- qid: q21, 원문 선택지 ④, 정답 가능한 네 정수쌍의 수 8.
- status: **SVG_REQUEST / VISUAL_HOLD / NOT_RENDERED**, 문서만 작성함. 운영 JS/SVG/main 직접 변경 없음.
- 사전 문서: docs/agents/visual-svg.md; archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md; archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md. 엔진 정본으로만 새 SVG 생성.

## 교점·치역 설명을 위한 그림 목표

원문 조각 함수는
\[
f(x)=
\begin{cases}
-\sqrt{ax+6}+2a & (x\le-6/a),\\
\dfrac{cx+d}{x+b} & (x>-6/a).
\end{cases}
\]
일대일 대응 조건에서
\[
a<0,\quad b=6/a,\quad c=2a,\quad d>12.
\]
이에 따라 **좌측의 치역은 \((-\infty,2a]\)**, **우측의 치역은 \((2a,\infty)\)** 이며, 두 구간은 겹치지 않고 실수 전체를 채운다.

그림 요청 2가지 중 엔진이 정확히 지원하는 최소 구성을 채택해도 된다.

1. **조각 함수 그래프(권장)**: 같은 좌표축에서 제곱근의 왼쪽 가지는 경계 \(x=-6/a\)까지 올라와 높이 \(2a\)에서 **닫힌 점**, 오른쪽 유리함수 가지는 경계에서 수직점근선으로 높이 +∞까지 뻗고 \(x\to+\infty\)에서 수평점근선 \(y=2a\)에 위쪽에서 다가간다. 두 곡선을 다른 선 스타일/색으로 구분하고 경계 \(x=-6/a\), 수평선 \(y=2a\)를 명확히 표기한다.
2. **치역 구간 그림(대안)**: y축에 \((-\infty,2a]\)와 \((2a,\infty)\)를 두 구간으로 색 구분하고 \(y=2a\)에서 왼쪽 식이 포함(닫힌 점), 오른쪽 식이 제외(열린 점)임을 표시한다. 동시에 이어져 모든 실수값을 딱 한 번씩 덮는다는 것이 시각적으로 드러나야 한다.

계수 a,b,c,d의 **유일한 정답값을 알고 있는 문제가 아니라 네 가지 a와 두 가지 d가 가능**하므로 구체적 크기를 원문 사실처럼 표기하지 말 것. 엔진이 숫자 계수를 요구한다면 조건을 만족하는 **검산 예시** \((a,b,c,d)=(-1,-6,-2,13)\)로 그리되 반드시 예시임을 캡션에 적는다.

예시 함수:
\[
f(x)=
\begin{cases}
-\sqrt{6-x}-2&(x\le6),\\
-2+\dfrac1{x-6}&(x>6).
\end{cases}
\]
첫째 가지는 \(x\le6\), \(y\le-2\)에서 높이 \(-2\)의 닫힌 점으로 끝나고, 둘째 가지는 \(x>6\), \(y>-2\)에서 \(x=6\) 수직점근선과 \(y=-2\) 수평점근선을 가진다.

guide-graph.md의 multi-curve-figure-v1의 SQRT/RATIONAL 표현이나 지원되는 별도 한 장 도형을 실제로 검사할 것. **한 그림에서 조각의 정의역 끝·열린/닫힌 점, 서로 다른 두 곡선의 점근선, 라벨, A4 크기, 정확한 곡선 좌표를 독립 관측**한다. 엔진이 이를 지원하지 않는다면 오류 코드와 재현 plan을 갭으로 보고하고 손으로 SVG를 만들거나 데이터에 덮어쓰지 말 것.

## 게이트

이 요청 문서 자체는 이미지가 아님. SVG 생성, 실제 PNG 렌더, 관측기, Golden/Negative, 학생 화면, 출고는 모두 **NOT_RUN**. 새 그림 제작은 전용 엔진 작업자, 운영 JS 적용/병합은 승인된 후속 절차에서 수행한다.
