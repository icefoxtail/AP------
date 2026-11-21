# lane10 → SVG 엔진 인계: 2019 금당고 고1 2학기 기말 q16 격자점

- source original: archive/exams/original/high/h1/2final/19_금당고_2학기_기말_고1_기출.js
- fixed source blob SHA: 7af938ef019a078f41055e71ca8b6c5d504c1147
- student complete audit: docs/operations/solution-upgrade-reservations/staged/h1/2019_geumdang_2final_DEEP_AUDIT.md
- qid: q16, 13 격자점에서 사각형을 만드는 네 점 선택 수 445.
- status: SVG_REQUEST / VISUAL_HOLD / NOT_RENDERED; 이 파일은 plan 요청만이며 SVG/JS/main 수정 없음.
- 사전 읽은 정본: docs/agents/visual-svg.md, archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md, archive/tools/geometry-equation/ops/svg-m1/guide/guide-graph.md.

## 실제 수학 정보

정수 \(x,y\) 중
\[
x^2+y^2\le4.
\]
가능한 점은
\[
\begin{aligned}
&(-2,0),(-1,-1),(-1,0),(-1,1),\\
&(0,-2),(0,-1),(0,0),(0,1),(0,2),\\
&(1,-1),(1,0),(1,1),(2,0).
\end{aligned}
\]
총 13개이며 두 좌표축 \(x=0\), \(y=0\)에는 각각 다섯 점이 있다.

나머지 세 점씩 놓인 직선은 정확히
\[
x=-1,\ x=1,\ y=-1,\ y=1,\ y=x,\ y=-x,\ x+y=2,\ x+y=-2,\ x-y=2,\ x-y=-2
\]
의 10개다. 모든 관계는 원본 문항과 학생 풀이 MD를 참조하고, 실제 점 좌표에서 독립 검산할 것.

## 학생용 그림 요청 (가독성 우선)

1. **패널 A: 전체 13점**. 동일한 x/y 눈금과 원점 O, 정수 눈금 −2,−1,0,1,2. 실제 선택 가능한 13점을 모두 명확한 점으로, 범위 밖 점은 표시하지 않는다. 두 좌표축 위 5점씩을 옅은 선 또는 강조해 보여줌.
2. **패널 B: 중앙의 3×3 점**. x=±1,y=±1과 두 대각선 y=±x를 분리 색칠/선종류로 묶되, 한번에 선이 너무 많이 겹치면 두 소패널로 나눔.
3. **패널 C: 바깥 점이 들어간 네 비스듬한 직선**. x±y=±2 네 직선을 각 3점과 함께 강조. 모든 수식과 점의 대응을 실제 좌표로 검산.
4. 요약 캡션: 축 2개에는 점 5개, 나머지 10개 직선에는 점 3개, 따라서 \(715-170-100=445\).
5. **문제용 이미지가 아니라 해설용 이미지**. 기존 문제를 변경하거나 정답을 문제 화면에 노출하지 않기.

엔진 경로는 guide-graph.md의 graphPlan.overlays의 points/lines나 평면도형 지원 범위를 실제 테스트하여 적절한 capability를 결정할 것. 축/점의 좌표는 정확해야 하고 SVG를 수작업으로 생성하지 않는다. 지원하지 않는 패널/색 구분이나 포인트 수 제한이 있으면 오류 코드·실제 plan·대안 엔진 지원 범위를 보고하며 임의 도형으로 대체하지 않는다.

원본 q8/q20/q21 PNG 및 solutionImage는 이 요청의 대상이 아니다. 별도 전용 엔진 작업자가 plan 생성→독립 관측→PNG 렌더→A4/모바일 가독성→Golden/Negative 여부를 기록하기 전에는 VISUAL_HOLD. 작업 완료/출고 PASS 주장 금지.
