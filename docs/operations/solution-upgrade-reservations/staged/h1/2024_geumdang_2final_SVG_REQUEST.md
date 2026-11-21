# SVG_REQUEST — 2024 금당고 2학기 기말 고1 Q17·Q18

- 요청자: lane10 / 타입: **엔진 팀 인계 전용** — SVG/JS/원본 PNG를 여기서 생성·수정하지 않음
- 원본 JS: \`archive/exams/original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js\`
- sourceBlobSha: \`ddacbfd5d93eb1c2a4f8f786edccc01bc698ac43\`
- 사전 열람: \`docs/agents/visual-svg.md\`, \`archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md\`, \`archive/tools/geometry-equation/ops/svg-m1/briefs/plan.md\`, \`plan-current.md\`, \`guide/guide-core.md\`, \`guide/guide-graph.md\`. 제작 시 반드시 \`archive/tools/geometry-equation/production/AUTHOR_GUIDE.md\`에서 해당 plan 계약과 현재 규칙, Golden 사례를 다시 확인할 것.
- 필수: \`archive/tools/geometry-equation/\` 엔진으로 plan→lint→render→PNG 육안검수→원문 대조. 수동 SVG 금지. render/GOLDEN/기하·표식 검사는 **NOT_RUN**.
- 원본 이미지 불변: 기존 PNG는 지우거나 덮어쓰지 말고 새 엔진 산출물을 후속 검수·연결 단계에 인계.

## Q17 — 문제 그림 A/B 라벨 불일치 (VISUAL_HOLD)

### 실물 증거

- 이미지: \`archive/exams/original/high/h1/2final/assets/images/24_금당고_2학기_기말_고1_기출/q17.png\` (원본 이미지 blob \`d4d47874956f41143f42b68e964dbc04590c21d6\`, 이미지 직접 열람).
- 발문의 실제 정의: “직선 \(y=g(x-k)+k\)가 두 직선 \(y=x\), \(y=f(x)\)와 만나는 점을 **각각 \(A\), \(B\)**라 하자.”
- 원본 그림: 왼쪽 교점(기울기가 더 큰 \(y=f(x)\) 위)에 **A**, 오른쪽 교점(\(y=x\) 위)에 **B**라고 반대로 붙어 있다.
- 기존 정답 및 계산은 발문대로 정확히 \(A=(k,k)\), \(B=(k/(m+1),mk/(m+1))\), 넓이 \(=k^2(m-1)/(2(m+1))=k^2/(2\sqrt3)\), \(k^2=54\). 따라서 **해설의 A/B를 바꾸면 안 된다.** 원본 이미지 라벨만 검토·수정할 별도 그림 요청이다.
- 원문 그림과 발문의 충돌로 학생이 점을 거꾸로 읽을 수 있어 이 문항의 **시각 출고 보류**. 문제 정답/해설을 임의로 바꾸지 않음.

### 엔진 교정 명세

1. 발문과 일치하도록 \(A\)는 **오른쪽 \(y=x\)와 평행이동한 \(y=g(x-k)+k\)의 교점**, \(B\)는 **왼쪽 \(y=f(x)\)와의 교점**으로 놓는다. \(O\)는 원점.
2. \(f(x)=mx\), \(m>1\); \(g(x)=x/m\). 두 직선 사이의 예각 \(30^\circ\)를 표시한다. \(k>0\).
3. 문제 그림에는 **정답 및 최종 좌표 \(k\), \(k/(m+1)\), 54 등을 새로 노출하지 않는다.** 원본 발문의 선·점 이름과 상대 위치만 정확히 보여 준다.
4. 기울기 \(\pm1\), \(y=x\)가 포함되므로 엔진이 허용하는 해당 그래프 capability에서 **\`equalUnits:true\`**, 라벨 겹침·곡선 구분·원점·각 표시를 확인한다. 엔진이 조합을 지원하지 않으면 \`UNSUPPORTED\`와 실패 근거를 남긴다.
5. 원본 q17 PNG를 보존하고 새로운 problemImage 자산 후보를 별도 산출·검수한다. 원본 JS 참조 변경·게시·Golden 판정은 SVG/운영 라인의 승인 후에만.

## Q18 — 해설 그래프 비교 요청 (교육적 BENEFICIAL / 아직 산출 안 됨)

- 기존 문제에는 그림이 없고 학생용 개선 풀이 \`2024_geumdang_2final_q18.md\`에서 \(y_1=1+2/(x-1)\), \(y_2=\sqrt{x-k}\)의 교점을 **좌측 \(x\le-1\)**, **우측 \(x>1\)** 두 부분으로 세었다.
- **해설용** (문제용 아님) 그래프 두 패널을 엔진으로 검토:
  - \(k=-1\): 왼쪽 \((-1,0)\) + 오른쪽 교점 1개 = 총 2개.
  - \(k=0\): 루트 정의역 \(x\ge0\), 왼쪽 교점 0개 + 오른쪽 교점 1개 = 총 1개.
  - 두 패널 모두 \(x=-1,1\)의 유리함수 핵심 경계, \(\sqrt{x-k}\)의 시작점, 점선 \(y=0\), 가능한 교점의 수를 눈에 띄게 구별한다.
  - 교점의 닫힌 좌표를 억지로 소수 추정해 그리지 않는다. 정확한 엔진 교점 계산·표식 기능만 사용한다.
- 현재 \`guide-graph.md\`의 \`multi-curve-figure-v1\` 또는 지원되는 그래프 두 곡선 겹침 플랜과 \`composite-panels-v1\` 계약을 엔진 팀이 확인해 capability를 결정한다. 지원되지 않으면 **UNSUPPORTED로 인계**. 손제작 SVG 금지.
- 최종 기준: 학생에게 \(k=-1\)은 두 교점이라 답에서 제외되는 사실이 명확해야 한다. 계획·제작·PNG 검사·Chrome 렌더 **NOT_RUN**.

## 운영 상태

- \`Q17=HOLD (VISUAL_HOLD)\`, \`Q18=UPGRADE (개선 해설 MD 완료, 그래프 대기)\`.
- 금번 예약의 수학 해설 감사·MD 초안 완료 여부와 **학생 화면 출고/시각 PASS는 별개의 관문**이다.