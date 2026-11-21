# lane10 → 전용 SVG 엔진 라인 인계 — 2020 효천고 고1 2학기 기말

- source path: archive/exams/original/high/h1/2final/20_효천고_2학기_기말_고1_기출.js
- source blob SHA: 8246ea4467f8e4e846106c7697e35f2062326499
- worker draft: docs/operations/solution-upgrade-reservations/staged/h1/2020_hyocheon_2final_DEEP_AUDIT.md
- 대상: **q13 해설 보조 그림**, **q21 서술형 답안의 실제 유리함수 그래프**.
- 현재 상태: **SVG_REQUEST / VISUAL_HOLD / NOT_RENDERED**. 계획 문서일 뿐 그림 제작, 렌더, 검증, 배포가 아니다.
- 실제 읽은 엔진 정본: docs/agents/visual-svg.md, archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md, archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md. 모든 새 SVG는 저장소 전용 엔진으로만 제작하며 SVG 수작업 및 JS/main 직접 변경은 금지.

## q13 — 무리함수 그래프 사이 넓이의 좌우 대칭 설명 그림

확인된 원문:
\[
f(x)=\sqrt{x+4}-2,\qquad g(x)=\sqrt{4-x}+2,\qquad -4\le x\le4.
\]
두 그래프와 두 직선 \(x=-4\), \(x=4\)로 둘러싸인 넓이 \(32\)를 고1 학생에게 설명한다.

그림에 필요한 실제 수학적 관계:
\[
\begin{aligned}
f(x)+2&=\sqrt{4+x},\\
g(-x)-2&=\sqrt{4+x},\\
g(-x)-2&=f(x)+2.
\end{aligned}
\]

요청 구성:
1. 정확한 두 무리함수 곡선, \(x=-4\)와 \(x=4\), \(y=-2\)와 \(y=2\)의 기준선.
2. 기준 직사각형 \([-4,4]\times[-2,2]\)을 희미하게 표시하고, \(y=2\)와 \(g(x)\) 사이의 윗부분은 더할 영역, \(y=-2\)와 \(f(x)\) 사이의 아랫부분은 뺄 영역으로 색이나 패턴을 분리.
3. 두 부분이 y축 기준 거울 대칭이라 면적이 같다는 것을 안내 화살표/캡션으로 드러내기. 정답 숫자 \(32\)를 그림 안에 과도하게 겹쳐 쓰지 않기.
4. 가로 폭 \(8\), 세로 폭 \(4\)임을 위치가 맞는 치수선 또는 학생이 읽을 수 있는 간단한 안내로 표기.

엔진 경로: guide-graph.md의 multi-curve-figure-v1/SQRT 두 곡선과 graphPlan.regions 지원 범위를 실제 확인할 것. 곡선 사이/수평선 사이 여러 영역을 엔진이 지원한다고 추정하지 말 것. 현재 엔진이 정확한 두 색 영역이나 안내를 지원하지 못하면 지원 가능한 선/overlays로 시험하고 실패 코드와 plan을 엔진 갭으로 보고. 손으로 SVG 그리기 금지.

독립 관측: 곡선의 x 범위·정확한 y 값, 채운 영역의 좌우 반사 관계, 축/기준선·라벨, A4 실제 해설 이미지 축척, PNG 렌더를 대조. 아직 관측/출고 NOT_RUN.

## q21 — 부호만 아는 유리함수 개형을 답안에 제시

원본 그림 PNG: archive/assets/images/20_효천고_2학기_기말_고1_기출/q21.png
실제 눈으로 확인한 원래 무리함수는 양의 x축에서 끝나고 왼쪽 아래로 뻗는다.
따라서
\[
a<0,\quad b<0,\quad c>0.
\]

그릴 새 유리함수는
\[
y=\frac{b}{x+a}+c.
\]

**그림이 반드시 지켜야 하는 조건:**

- 수직점근선 \(x=-a>0\)은 y축의 오른쪽, 수평점근선 \(y=c>0\)은 x축의 위쪽에 점선/라벨로 표현한다.
- \(x<-a\)이면 \(x+a<0,b<0\)이라 \(y>c\). 왼쪽 가지는 수평점근선 위쪽에서 수직점근선의 왼쪽 위로 뻗는다.
- \(x>-a\)이면 \(x+a>0,b<0\)이라 \(y<c\). 오른쪽 가지는 수평점근선 아래쪽에서 수직점근선의 오른쪽 아래로 뻗는다.
- y절편은 \((0,c+b/a)\)이며 \(c+b/a>c\). x절편은 \((-a-b/c,0)\)이며 \(-a-b/c>-a>0\).
- 원문은 \(a,b,c\)의 부호만 말하며 **숫자 크기는 미정**이다. 명시적 개형 예시로 \(a=-1,b=-1,c=2\)를 선택하면 \(y=-1/(x-1)+2\), 점근선 \(x=1,y=2\), y절편 \((0,3)\), x절편 \((3/2,0)\)가 되지만, 구체적 수치를 원문 사실처럼 표시하면 안 된다. 예시라면 반드시 캡션에 예시임을 적는다.

엔진 경로: guide-graph.md의 rational-spike-v1/rational 또는 multi-curve-figure-v1/RATIONAL로 엔진 plan을 구성하고, example numeric geometry와 symbolic labels를 구분할 것. 양쪽 가지, 점근선 위치, 양쪽 절편, 라벨 충돌, A4 축척을 실제 엔진 독립 관측기로 검사할 것.

## 인계 및 게이트

- lane10의 학생용 수식 풀이 초안 q13, q21은 위 worker MD에 완료.
- 새 그림은 **이 요청서에서 제작하지 않음**. SVG_REQUEST 2건은 VISUAL_HOLD.
- 엔진에서 plan·SVG·실제 PNG·독립 관측·Golden/Negative/렌더 증거를 남긴 뒤 운영 연계는 별도 승인 절차를 따를 것.
- 지원하지 않는 그림 요소가 있으면 엔진 갭으로 기록하고 임의 SVG 생성 금지. 출고 PASS 아님.
