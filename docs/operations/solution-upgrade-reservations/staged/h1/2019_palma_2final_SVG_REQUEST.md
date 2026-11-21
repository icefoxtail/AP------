# lane10 → SVG 전용 엔진 인계: 2019 팔마고 고1 2학기 기말 q20 교점 개수

- original source: archive/exams/original/high/h1/2final/19_팔마고_2학기_기말_고1_기출.js
- source blob SHA: c6ed2e0417ff9d6d91eabc58da23a0ffcd82719c
- student draft: docs/operations/solution-upgrade-reservations/staged/h1/2019_palma_2final_DEEP_AUDIT.md
- qid q20, **SVG_REQUEST / VISUAL_HOLD / NOT_RENDERED**, plan-only.
- 실제 읽은 엔진 문서: docs/agents/visual-svg.md, archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md, archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md. 운영 JS/main 직접 수정 금지. SVG 수작업 금지.

## 정확한 함수와 학생에게 보여줄 비교

\[
f(x)=\frac{3x-2}{x-2}=3+\frac4{x-2},\qquad
g_k(x)=\sqrt{x-k}-k,\quad x\ge k.
\]
원래 문제는 **두 그래프의 교점이 2개인 실수 \(k\)**의 범위를 구하라는 것. 답은
\[
\boxed{-2\le k\le1}.
\]

교점 수는 다음과 같다.

- \(f\)는 \(x=2\)를 경계로 두 가지로 갈라지며 양쪽 가지에서 각각 감소한다. \(g_k\)는 근호 정의역에서 증가한다.
- **오른쪽 \(x>2\)**에는 모든 \(k\)에 대해 교점이 정확히 하나다.
- **왼쪽 \(k\le x<2\)**에는 \(k<2\)일 때만 후보가 존재한다. 시작점 차는
\[
f(k)-g_k(k)=\frac{(k+2)(k-1)}{k-2}.
\]
왼쪽에 한 번 만나려면 이 값이 0 이상이어야 하므로 \(-2\le k\le1\).
- **경계 예:** \(k=-2\)이면 \(x=-2\)에서 \(f(-2)=g_{-2}(-2)=2\); \(k=1\)이면 \(x=1\)에서 \(f(1)=g_1(1)=-1\). 두 끝 k도 포함.
- 비교 예 \(k=0\): \(g_0(x)=\sqrt x\), 왼쪽 (0,1) 사이에서 교점 하나, 오른쪽 (3,16) 사이에서 교점 하나. (단 \(f(0)=1>g_0(0)=0,\ f(1)=-1<g_0(1)=1,\ f(3)=7>\sqrt3,\ f(16)=3+4/14<4=g_0(16)\).)

## 엔진에 부탁할 학생용 그림

1. 동일한 축척의 2~3패널: \(k=0\) (좌우 두 교점), \(k=-2\) (왼쪽 끝점 포함), \(k=1\) (왼쪽 끝점 포함). 3패널이 너무 작으면 대표 \(k=0\) 한 패널과 작은 경계 메모로 단순화.
2. 수직점근선 \(x=2\) 및 좌·우의 \(f\) 두 가지를 끊어진 형태로 정확히 표시. \(g_k\)의 정의역 시작점 \((k,-k)\)은 닫힌 점이고 실제 원문의 부등호가 포함하는지 확인.
3. 오른쪽 교점과 왼쪽 교점은 서로 다른 표시, 방정식과 위아래 관계가 학생에게 보이도록 보조선을 최소화.
4. **원문 그래프를 숫자 모르는 k의 일반 정답 그래프로 오인시키지 않기**. 수치를 넣은 것은 대표 예시이므로 캡션에 반드시 k 값을 쓴다.
5. guide-graph.md의 multi-curve-figure-v1 RATIONAL+SQRT 계열 지원 여부와 독립 관측기로 두 함수값/근호 정의역/점근선/교점의 실제 좌표, PNG 렌더, 학생 A4 폭 크기, 선·라벨 충돌을 검증. 엔진 미지원이면 오류 코드·재현 plan을 반환하고 임의 SVG 생성 금지.

## 출고 게이트

이 문서는 SVG 요청일 뿐 실제 생성/검수/게시가 아니다. SVG 생성, 실제 PNG, Golden/Negative, 렌더, 학생 UI 반영 **NOT_RUN**. 출고 PASS 아님.
