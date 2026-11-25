# 2025 제일고 고1 2학기 중간 유사문제 — 문제/해설 2축 SVG plan 검토

- 검토 기준 `main`: `2c7bf78e0e29be2680ee99b1078746cfe89b2df4` (2026-11-26 KST)
- JS 경로: `archive/exams/similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js`
- JS blob SHA: `cb1e336dc2dd7bf187af8c56c32d11b8e5f82859`
- 범위: 22문항, 문제 22축·해설 22축 독립 판정. 작성한 plan은 정확한 JS stem의 `*_plans/`에 둔다.
- 이 배치는 계획만 제출한다. SVG/PNG 렌더, 최종 학생 화면·A4 검수, JS `image`/`solutionImage` 연결은 `NOT_RUN`이다. 기존 PNG는 교체·수정하지 않는다.

## 전 문항의 2축 독립 판정

| qid | 문제 axis | 해설 axis | 판단 근거 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 집합 원소와 부분집합의 기호 판단으로, 영역도는 원소/집합 층위를 오히려 혼동시킴 |
| 02 | REQUIRED / 기존 `q02.png` 유지 | EXEMPT | ①~⑤ 선택지 자체가 다섯 좌표 그래프임. 기존 PNG 5패널의 점·포물선·선분·원·절댓값형을 확인했고, 해설은 수직선 판정법 문장으로 충분 |
| 03 | EXEMPT | EXEMPT | 고정 원소 포함·제외 후 네 원소의 선택 수 2⁴ 계산, 그림 없이 명확 |
| 04 | EXEMPT | BENEFICIAL / `q04-solution` | 발문은 집합식 5개만 묻고, 해설은 X∩Yᶜ∩Z와 ⑤의 X∩(Yᶜ∪Z) 영역 대조가 유익 |
| 05 | EXEMPT | EXEMPT | 집합 연산 4개 진위 판정은 드모르간·흡수·포함 관계의 짧은 식 변형으로 끝남 |
| 06 | EXEMPT | EXEMPT | n(A∩B)≥28+18−40에서 최솟값을 구하는 수식 문제, 벤도는 중복 설명 |
| 07 | EXEMPT | EXEMPT | 각 원소의 출현 횟수 C(6,3)와 전체 합을 곱하는 조합 계산 |
| 08 | EXEMPT | EXEMPT | 서로소·합집합 U의 원소 6개를 직접 분리해 합을 구하는 단순 유한집합 선택 |
| 09 | EXEMPT | EXEMPT | f(3)=4 기준 작은 두 값·큰 두 값의 순서 선택 C(3,2)² 계산 |
| 10 | BENEFICIAL / `q10-problem` | BENEFICIAL / `q10-solution` | 세 꼭짓점 좌표의 공간 배치와 AB=BC 같은 길이 표시를 문제/해설 별도 제공; 문제에는 같은 길이 표시 없음 |
| 11 | EXEMPT | EXEMPT | 무게중심 좌표합 두 번 적용, B·C 개별 위치가 미정이라 대표 삼각형은 임의 정보 추가 |
| 12 | REQUIRED / 기존 `q12.png` 유지 | EXEMPT | 제시 그래프와 선택지 다섯 개가 기존 PNG에 있고, 새 직선의 양의 기울기·음의 절편 부호 판정은 식으로 충분 |
| 13 | EXEMPT | BENEFICIAL / `q13-solution` | 발문은 접선 계수 k 계산이며, 해설에서는 반지름 √13인 원과 k=±13 두 접선의 상대 위치가 도움 |
| 14 | EXEMPT | EXEMPT | 두 직선 법선벡터의 내적 0으로 귀결되는 순수 이차방정식 계산 |
| 15 | REQUIRED / 기존 `q15.png` 유지 | BENEFICIAL / `q15-solution` | 원본 PNG의 A,B,C,D,E와 DE∥BC 배치 확인; 해설은 면적비 1:4→닮음비 1:2→두 중점·평행을 표시 |
| 16 | EXEMPT | BENEFICIAL / `q16-solution` | 문제는 두 직선과 조건을 대수식으로 정확히 주고 미지 P,Q를 문제 그림에 고정하면 풀이 누설 위험; 해설은 A,B,C·외접원·P,Q의 검산 그림 유익 |
| 17 | REQUIRED / 기존 `q17.png` 유지 | BENEFICIAL / `q17-solution` | 원본 PNG 정사각형과 CD 지름 원 확인; 해설에 (3,4) 평행이동으로 C,D, 중점 M과 원 도출 |
| 18 | REQUIRED / 기존 `q18.png` 유지 | BENEFICIAL / `q18-solution` | 원본 PNG의 OABC, D,E,F,P,Q,O′,F′ 배치 확인; 해설은 두 중점·직각으로 접는 선의 수직이등분을 명시 |
| 19 | EXEMPT | EXEMPT | 상수함수 4·항등함수 1·전단사 24를 더하는 셈, 대응도 29개는 중복·장식 |
| 20 | EXEMPT | BENEFICIAL / `q20-solution` | 문제 그림에 미지 내분점 P의 정확한 좌표를 드러내지 않음; 해설은 AP:PB=1:2와 P(0,3) 표시 |
| 21 | EXEMPT | EXEMPT | 유한집합 원소 수 a(7+b)=18을 분해하고 C(7,2)C(5,2)를 계산하는 조합 풀이 |
| 22 | BENEFICIAL / `q22-problem` | BENEFICIAL / `q22-solution` | 문제는 원점·원 중심·주어진 원만 표시, 해설은 두 접점의 OP 최솟값 4·최댓값 16을 치수선으로 대조 |

## 실제 렌더 가능한 계획과 1:1 DRAWN_FEATURE_PARITY 점검

아래 경로는 이 장부와 같은 `*_plans/` 폴더 안의 파일명이다. `shallow`와 `full`은 저장소 공식 `plan-lint.cjs`로 개별 실행했다. `PASS`는 **발문/해설 조건 대비 plan의 그려지는 필드**를 수학적으로 대조한 결과이지, 렌더 SVG의 화면 검사 통과를 뜻하지 않는다.

| qid/축 | capability | plan | shallow/full | DRAWN_FEATURE_PARITY — 실제 그려지는 필드 |
| --- | --- | --- | --- | --- |
| 04 해설 | composite-panels-v1 + set-diagram | `q04-solution.plan.json` | PASS/PASS | PASS — 패널 ①~④ `shade:X∩Y^c∩Z`, ⑤ `shade:X∩(Y^c∪Z)`, X/Y/Z 원 3개 |
| 10 문제 | construction-spike-v1 | `q10-problem.plan.json` | PASS/PASS | PASS — A(−2,1),B(1,5),C(4,1), AB/BC/CA 선분, 등변 눈금 없음 |
| 10 해설 | construction-spike-v1 | `q10-solution.plan.json` | PASS/PASS | PASS — 앞 좌표·세 변, `planeMarks.equalLengths` AB=BC |
| 13 해설 | construction-spike-v1 | `q13-solution.plan.json` | PASS/PASS | PASS — 중심 (3,−2), 반지름 √13의 `CIRCLE_CENTER_RADIUS`, 직선 2x+3y±13=0과 식 라벨 |
| 15 해설 | construction-spike-v1 | `q15-solution.plan.json` | PASS/PASS | PASS — A(2,6),B(−1,1),C(5,−5), D=mid(AB),E=mid(AC), `sDE`와 `sBC` 평행 표식 |
| 16 해설 | construction-spike-v1 | `q16-solution.plan.json` | PASS/PASS | PASS — l1/l2에서 A(0,−4),B(−2,0),C(8,0); M=mid(BC)=(3,0), 원 r5, P(12,12), Q=centroid(P,B,C)=(6,4) |
| 17 해설 | construction-spike-v1 | `q17-solution.plan.json` | PASS/PASS | PASS — A(6,3),B(2,6), C=B+(3,4),D=A+(3,4), M=mid(C,D), 원 r5/2, CD 직경 |
| 18 해설 | construction-spike-v1 | `q18-solution.plan.json` | PASS/PASS | PASS — 정사각형 변27, D/E 높이15, F(13,0), P(0,39/2),Q(27,3/2), O′(18,27),F′(23,15), 중점 M1/M2, `rightAngles` 두 개 |
| 20 해설 | construction-spike-v1 | `q20-solution.plan.json` | PASS/PASS | PASS — A(−2,1), B(4,7), `DIVISION_POINT` m:n=1:2→P(0,3), 각 구간 라벨 1·2 |
| 22 문제 | construction-spike-v1 | `q22-problem.plan.json` | PASS/PASS | PASS — O 원점, C(6,8), 원 r6, OC 점선; 구하는 정수 거리는 표시하지 않음 |
| 22 해설 | construction-spike-v1 | `q22-solution.plan.json` | PASS/PASS | PASS — O,C, 반지름 6, 같은 직선 위 내측·외측 접점 N/F(숨은 이름), `dimensions` 4·16 |

## 검증·후속 인계

- 대상 22문항/문제 22축/해설 22축 모두 판정. 신규 실행 plan **11개**: 문제 2, 해설 9. 기존 문제 PNG 5개 유지, 두 축 면제 총 28건(문제 15, 해설 13).
- lint: shallow **11/11 PASS**, full **11/11 PASS**. full은 기존 환경에 설치되어 있던 SHA256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`인 NotoSansKR.ttf와 기존 node_modules를 로컬에 연결해 실행.
- 조건→그려지는 필드 1:1 검토 **11/11 PASS**. `ENGINE_CAPABILITY_PENDING` **0건**. 렌더 및 학생 화면/A4는 **11/11 NOT_RUN**; 후속 엔진 담당자의 실물 검수는 별도 필요.
- 문제용 두 plan에서는 정답·해설 보조값을 숨겼다. 면 채움은 04번 해설의 **집합 영역 대조 목적**에만 사용한다. 기존 PNG 및 원본 JS/유형은행/교과서 미수정.
