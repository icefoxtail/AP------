# 2025 팔마고 고1 1학기 중간 유사 — 2축 SVG plan 검수

- 대상: Q01~Q23 (23문항, 문제·해설 46축).
- 기준 main: fd9a2fd612c2cd4145a9300b2987bcbd279deb9a.
- 원본 JS blob: 09147309e883b28f0c6479d12e558de15df6e3b2.
- 위치: archive/exams/similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사_plans/.
- 제일고는 PR #3056이 작업 중이므로 제외. JS·기존 SVG·엔진·유형은행·교과서는 변경하지 않음.
- 그림 없음은 빈 plan이 아닌 개별 EXEMPT 사유로 기록. 기존 Q03 SVG의 시각품질 재검사는 NOT_RUN.

| qid | 문제 축 판정·사유 | 해설 축 판정·사유 | 실제 신규 plan | 필드 PARITY |
| --- | --- | --- | --- | --- |
| 01 | EXEMPT — 나머지정리 대입식 | EXEMPT — 계수 계산만 수행 | — | N/A |
| 02 | EXEMPT — 양수 세제곱 항등식 | EXEMPT — 제곱합 0으로 a=b=c 유도 | — | N/A |
| 03 | EXEMPT — 판별식 조건의 대수 해석 | BENEFICIAL — 열린 정수 구간. 기존 q3-solution.svg 연결 | 신규 없음, 기존 SVG 유지 | 기존 자산 NOT_RUN |
| 04 | EXEMPT — 몫·나머지의 대수 조건 | EXEMPT — x³−1 인수로 묶기 | — | N/A |
| 05 | EXEMPT — 복소수 거듭제곱의 주기 | EXEMPT — n≡7 (mod 8) 셈 | — | N/A |
| 06 | EXEMPT — 근과 계수의 관계 | EXEMPT — 대칭식 계산 | — | N/A |
| 07 | EXEMPT — 치환 인수분해 | EXEMPT — 인수분해 식 중복 그림 불필요 | — | N/A |
| 08 | EXEMPT — 미지 교점은 식으로 충분 | BENEFICIAL — 포물선과 직선의 두 교점 및 근의 합 | q08-solution | PASS |
| 09 | EXEMPT — 항등식 계수 비교 | EXEMPT — 모든 계수 0 조건 | — | N/A |
| 10 | EXEMPT — 중근 판별식 | EXEMPT — k에 대한 이차방정식 계산 | — | N/A |
| 11 | EXEMPT — 허근의 3주기 | EXEMPT — n의 나머지별 합 | — | N/A |
| 12 | EXEMPT — x+y,xy 치환 | EXEMPT — 실수 근 가능성의 대수 검산 | — | N/A |
| 13 | EXEMPT — 몫·나머지가 동일한 조건 | EXEMPT — P(3) 계수 결정 | — | N/A |
| 14 | EXEMPT — 복소수의 6주기 | EXEMPT — 등비 합 계산 | — | N/A |
| 15 | EXEMPT — k 미정 그래프는 답 암시 | BENEFICIAL — x축 접점과 D=0 대응 | q15-solution | PASS |
| 16 | EXEMPT — 정수 m,n과 중근 조건 | EXEMPT — 정수 k 7개 직접 확인 | — | N/A |
| 17 | REQUIRED — 삼각형·내접 직사각형 배치와 평행 관계 | BENEFICIAL — 닮음과 높이 x·폭 3(4−x)/2 | q17-problem, q17-solution | PASS/PASS |
| 18 | EXEMPT — 다항식 Q(0),Q(1) 결정 | EXEMPT — 항등식 나눗셈 | — | N/A |
| 19 | EXEMPT — 복소수 주기·절댓값 부등식 | EXEMPT — 지수 범위 내 정수 셈 | — | N/A |
| 20 | EXEMPT — 나머지정리 조건식 | EXEMPT — 서술형 대입 계산 | — | N/A |
| 21 | EXEMPT — 높이 함수가 식으로 주어짐 | BENEFICIAL — 최고점과 25m 이상 시간 구간 | q21-solution | PASS |
| 22 | EXEMPT — 짝수차식 인수분해 | EXEMPT — 실수·복소수 인수분해 식 | — | N/A |
| 23 | EXEMPT — k 미지의 직선 위치가 답 암시 | BENEFICIAL — 타원·직선의 단일 접점 | q23-solution | PASS |

## DRAWN_FEATURE_PARITY — 원문과 실제 그려지는 필드 1:1 대조

| plan | 독립 계산 | 렌더 필드 실재 확인 | 판정 |
| --- | --- | --- | --- |
| q08-solution | 2x²−12x−4=0 ⇒ x=3±√11, y=22±7√11 | curves 두 행 coefficients=[-3,-5,2]·[1,7], overlays.points[A,B] 정확 교점과 이름 | PASS |
| q15-solution | a=−4,k=6 ⇒ y=(x−2)², D=0 | curves[touch] [4,-4,1], overlays.points[T]=(2,0)와 x축 | PASS |
| q17-problem | 밑변 6 높이 4, 동형 도식 높이 8/5·폭 18/5 | mathPlan.nodes 8점, displaySegments 7선분, dimensions[dBase] 라벨 6, expressionLabels[lHeight] 라벨 4, rightAngles[rFoot], parallels[pTop] | PASS |
| q17-solution | x=8/5일 때 3(4−x)/2=18/5. 일반적으로 닮음 비 6:4 | 문제 도식 필드 + dimensions[dX] 라벨 x, dimensions[dWidth] 라벨 3(4-x)/2 | PASS |
| q21-solution | 최고점 (2,30), h(t)=25는 t=1,3 | curves[height,threshold] 계수 [10,20,-5]·[25,0], overlays.points[V,A,B], 축 눈금 1·2·3/25·30 | PASS |
| q23-solution | x²/6+y²/3=1, y=x−3, 접점 (2,−1), 판별식 0 | conic ELLIPSE a²=6,b²=3; lines[l] slope=1 intercept=−3 tangent=true 식 라벨; points[T] 좌표 | PASS |

- sourceVsPlan: 신규 plan 6건 모두 REVIEWED. 6건 모두 좌표·곡선·선분·라벨을 실제 표시 필드에서 찾음. Q17 직각은 최상위 rightAngles, 평행 표식은 planeMarks.parallels, 길이·비율 표시는 dimensions와 expressionLabels에 있음. 나머지 문항은 각·직각표식이 별도로 필요하지 않음(N/A).
- Q17 문제는 최적 높이나 최대 넓이를 보여 주지 않는다. 임의 높이 8/5는 도형을 그리기 위한 대표 좌표이고 화면 라벨은 밑변 6·높이 4만 사용. 문제 그림 답 비노출, 6개 plan 모두 면 채움 0건.
- ENGINE_CAPABILITY_PENDING: 0. 그러나 lint는 실제 SVG 레이아웃·PNG·학생 화면·A4를 대체하지 않는다. 렌더/PNG/student/A4 = NOT_RUN.

## 공식 검사와 범위 밖 내용 발견

- shallow: 6 OK / 0 FAIL / 0 SKIP.
- full: 6 OK / 0 FAIL / 0 SKIP. 검사 명령은 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs [--shallow] <6개 plan JSON>.
- full 환경: AUTHOR_GUIDE의 dependency-lock에 고정된 NotoSansKR.ttf SHA-256 194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252, MathJax 3.2.2, OpenType 1.3.4, SymPy 1.14.0 확인.
- Q21 발문은 “지면에서 쏘아 올린”이라고 하면서 h(0)=10m이다. 계획은 주어진 함수 및 해설에 정확히 대응하며, 초기 높이 문장은 별도 JS 내용 검수 필요.
- Q23은 서논술형인데 JS answer가 “③”으로 저장되어 있다. 해설의 실제 답 k=3에 맞는 SVG 해설 계획만 작성함. 해당 답안 필드 수정은 이 배치 범위 밖.
- 기존 Q03 SVG의 렌더·시각품질은 본 작업에서 다시 검사하지 않아 NOT_RUN. 새 SVG·PNG·학생용 연결·게시 모두 NOT_RUN.
