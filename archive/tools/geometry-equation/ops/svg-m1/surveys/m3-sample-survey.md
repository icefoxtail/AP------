# 중3 해설 그림 표본 조사 (읽기 전용)

조사일 2026-10-30. 저장소는 고치지 않았고 렌더·커밋도 하지 않았다. 기존 해설 그림(SVG)을 눈으로 보려고 PNG로 바꾼 것은 임시 폴더에서만 했다.
단원: 1학기 제곱근과 실수·다항식의 곱셈과 인수분해·이차방정식·이차함수 / 2학기 삼각비·원의 성질·통계(대푯값·산포도·산점도).

## 1. 한눈에 보기

| 항목 | 값 |
|---|---|
| 고른 시험지 | 8개 (폴더마다 옛날 19~21 1개 + 최근 24~26 1개, 학교 8곳 모두 다름) |
| 문항 | 190 |
| 그림 필요 (REQUIRED+BENEFICIAL) | 82 (REQUIRED 38, BENEFICIAL 44) |
| 그림 불필요 (NOT_NEEDED) | 108 |
| 지금 그릴 수 있음 (DRAWABLE) | 78 (이 중 진행 중 E35에 기대는 것 4, E35 없이 바로 가능 74) |
| 빠진 기능 때문에 못 그림 (MISSING) | 4 |
| 기존 해설 그림 | 31개 (KEEP 15, 교체 필요 UPGRADE 16) |
| 새로 만들어야 할 그림 | 51 (그림 필요 82 − 기존 31) |
| 문제에 '그림'이라 했는데 image 없는 문항 | 0 (8개 시험지 기준) |

핵심 결과
- 그림이 필요한 비율은 학기에 따라 크게 다르다. 1학기 4개 시험지는 95문항 중 15개(약 16%), 2학기 4개는 95문항 중 67개(약 71%)다. 1학기는 수직선 작도·이차함수 그래프·넓이 분할 도형 몇 문항뿐이고, 2학기(삼각비·원의 성질)는 거의 모든 도형 문항이 해당한다.
- 지금 엔진 기능으로 핵심 요소가 모두 나오는 문항이 78/82(95%)다. 평면 도형(원·삼각형·접선·내접원)과 이차함수 그래프(overlays·referenceCurves·multi-curve)가 대부분을 덮는다. 빠진 것은 입체 위 보조점 2문항, 산점도 기준선·영역 1문항, 수직선 연속 작도 1문항뿐이다.
- 기존 해설 그림 31개 중 16개는 교체가 낫다. 24_연향중 2학기 기말의 해설 그림 13개는 10개가 라벨 충돌이거나 직각·각 표식 누락이고, 25_풍덕중 2학기 중간 15개 중에는 4개가 결정적 각·길이가 빠져 있다.
- E35(수직선 컴퍼스 작도)가 안 나오면 수직선 4문항(금당 21 q21, 왕운 25 q9·q24, 신흥 20 q4)이 그려지지 않는다. 21_금당중 q21은 정답지 golden item29와 같은 문항이다.

## 2. 폴더별 시험지 수 (해설 있음 / 없음)

해설 있음 = 문항의 solution이 비어 있지 않다. 원장(exam-figure-ledger.json)에 m3 시험지는 하나도 없어 건너뛴 시험지는 없다.

| 폴더 | 시험지 | 해설 전 문항 있음 | 일부 문항만 있음 | 해설 없음(0문항) | 해설이 한 문항이라도 있음 | 전체 문항 수 |
|---|---|---|---|---|---|---|
| 1학기 중간(1mid) | 57 | 51 | 1 | 5 | 52 | 1365 |
| 1학기 기말(1final) | 58 | 52 | 0 | 6 | 52 | 1385 |
| 2학기 중간(2mid) | 40 | 40 | 0 | 0 | 40 | 946 |
| 2학기 기말(2final) | 43 | 38 | 5 | 0 | 43 | 1012 |
| 합계 | 198 | 181 | 6 | 11 | 187 | 4708 |

해설 없는 시험지(0문항): 
- 1학기 중간(1mid): 17_대구교동중_1학기_중간_중3_수학, 17_이수중_1학기_중간_중3_수학, 18_연향중_1학기_중간_중3_수학, 19_서울시흥중_1학기_중간_중3_수학, 19_서울안천중_1학기_중간_중3_수학
- 1학기 기말(1final): 16_경기은계중_1학기_기말_중3_수학, 17_경북창포중_1학기_기말_중3_수학, 17_경북환호여중_1학기_기말_중3_수학, 17_대구동도중_1학기_기말_중3_수학, 17_대구오성중_1학기_기말_중3_수학, 19_서울가산중_1학기_기말_중3_수학
일부 문항만 해설이 있는 시험지:
- 1학기 중간(1mid): 26_연향중_1학기_중간_중3_수학 (22/23)
- 2학기 기말(2final): 15_신흥중_2학기_기말_중3_수학 (17/24), 16_신흥중_2학기_기말_중3_수학 (22/23), 16_왕의중_2학기_기말_중3_수학 (20/24), 17_신흥중_2학기_기말_중3_수학 (20/23), 17_팔마중_2학기_기말_중3_수학 (22/24)

## 3. 고른 시험지

방법: 해설이 전 문항에 있는 시험지만 후보로 두고 폴더마다 옛날(19~21) 1개·최근(24~26) 1개를 seed 20261030으로 무작위 추출했다(학교 중복 제외). 그림 많은 시험지를 일부러 고르지 않았다. 해설 없는 시험지는 고르지 않고 개수만 셌다.

| 폴더 | 시험지 | 문항 | 문제 그림 | 기존 해설 그림 | 그림 필요 | REQ | BEN | DRAWABLE | MISSING | E35 의존 | KEEP | UPGRADE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1mid | 21_금당중_1학기_중간_중3_수학 | 23 | 7 | 0 | 4 | 1 | 3 | 3 | 1 | 1 | 0 | 0 |
| 1mid | 25_왕운중_1학기_중간_중3_기출 | 24 | 3 | 3 | 3 | 3 | 0 | 3 | 0 | 2 | 1 | 2 |
| 1final | 20_신흥중_1학기_기말_중3_수학 | 24 | 2 | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 |
| 1final | 26_삼산중_1학기_기말_중3_기출 | 24 | 6 | 0 | 7 | 2 | 5 | 7 | 0 | 0 | 0 | 0 |
| 2mid | 19_동산중_2학기_중간_중3_수학 | 25 | 15 | 0 | 13 | 4 | 9 | 11 | 2 | 0 | 0 | 0 |
| 2mid | 25_풍덕중_2학기_중간_중3_수학 | 25 | 18 | 15 | 17 | 10 | 7 | 17 | 0 | 0 | 11 | 4 |
| 2final | 20_이수중_2학기_기말_중3_기출 | 22 | 22 | 0 | 22 | 8 | 14 | 22 | 0 | 0 | 0 | 0 |
| 2final | 24_연향중_2학기_기말_중3_기출 | 23 | 21 | 13 | 15 | 9 | 6 | 14 | 1 | 0 | 3 | 10 |

문제 그림 수는 image 필드·본문 <img>·인라인 <svg>를 모두 센 값이다. 판정 기준:
- REQUIRED: 해설이 보조선·파생 점·구분 영역·그래프 특징점을 만들어 쓰고, 그림 없이는 따라가기 어렵다
- BENEFICIAL: 글로도 풀리지만 파생 길이·각·같은 길이·접선 관계를 그림이 한눈에 보여 준다
- NOT_NEEDED: 순수 계산·개념 판별이거나 문제 그림(표)에 이미 모두 있고 풀이가 대입뿐이다
- DRAWABLE은 지금 가이드(진행 중 E31~E35 포함)의 기능만으로 핵심 요소가 모두 나온다는 뜻이다. 렌더 성공을 보장하지 않으며 라벨 밀집 위험이 큰 문항은 risk로 표시했다. 진행 중 기능에 기대면 pending으로 표시했다.
- KEEP=정확하고 라벨이 겹치지 않으며 해설의 결정적 값이 그림에 있다. UPGRADE=라벨 충돌 또는 결정적 각·길이·직각 표식 누락.

## 4. 시험지별 판정

### 1mid · 21_금당중_1학기_중간_중3_수학 (문항 23)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 9 | BENEFICIAL | [NUMLINE] 수직선 컴퍼스 작도: 정사각형 대각선 √2 호로 P, P에서 수선 BP=1을 세운 직각삼각형 OBP의 빗변 OB(=√3)를 반지름으로 한 두 번째 호로 Q | **MISSING**: 수직선 연속 컴퍼스 작도(2단계): 앞 호가 수직선과 만난 점 P 위에 수선 BP=1을 세우고 그 직각삼각형의 빗변 OB(모눈 밖 반지름)를 반지름으로 두 번째 호를 그려 Q를 얻는다. E35의 constructions.source는 모눈 위 선분(√2 한 단계)만 반지름 출처로 받는다. | - |
| 13 | BENEFICIAL | [PLANE] 정사각형 4개를 한 직선 위에 이어 붙인 도형의 둘레(변 2√2, 2, √2, 1과 단차) | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT(길이 sqrt 식)로 네 정사각형 꼭짓점 + displaySegments + planeMarks.expressionLabels(2sqrt(2) 등)·dimensions | - |
| 15 | BENEFICIAL | [PLANE] 합동인 두 사다리꼴을 엇갈려 붙인 직사각형(가로 a+b, 세로 a−b) | DRAWABLE: PLANE_FIGURE_v1: displaySegments + planeMarks.regions(두 사다리꼴 칠) + dimensions BRACE(a+b, a−b) + rightAngles | - |
| 21 | REQUIRED | [NUMLINE] 모눈종이 위 선분 AB·CD를 빗변으로 한 직각삼각형(가로 4·세로 2, 2·1), 호를 수직선에 옮긴 P=−5+2√5, Q=1+√5와 PQ 길이 | DRAWABLE: number-line-figure-v1 numberLine.constructions(center, radius sqrt, arc RIGHT, hits) + source.grid(from,to) + surd 점 라벨 + 거리 괄호 (정답지 golden item29) **[E35 의존]** | - |

NOT_NEEDED: 1 제곱근 정의 판별 · 2 제곱근 계산 · 3 소인수분해 조건 계산 · 4 대소 비교 계산 · 5 정수 조건 개수 세기 · 6 무리수 분류 · 7 제곱근표 읽기(문제 그림에 표가 있음) · 8 실수 체계 개념 판별 · 10 근호 계산 판별 · 11 근호 계산 · 12 근호 대소 비교 계산 · 14 곱셈공식 전개 판별 · 16 곱셈공식 변형(대수; 두 정사각형 그림이 풀이에 쓰이지 않음) · 17 분모 유리화 · 18 인수분해 공통인수 · 19 인수분해 · 20 완전제곱식 조건 · 22 x=2+√3 대입 계산 · 23 제곱근표 값 계산(문제 그림에 표가 있음)

### 1mid · 25_왕운중_1학기_중간_중3_기출 (문항 24)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 9 | REQUIRED | [NUMLINE] 모눈종이 위 정사각형 한 변 AB(1,3)·EF(2,2)를 반지름으로 한 호가 수직선과 만나는 P=−3+√10, Q=2+2√2 | DRAWABLE: number-line-figure-v1 numberLine.constructions(center A=−3·E=2, radius sqrt(10)·2*sqrt(2), arc RIGHT, hits) + source.grid(from,to) + surd 점 라벨 **[E35 의존]** | UPGRADE (q9-solution.svg): AB=√10 라벨이 삼각형 변과 겹쳐 읽히지 않고 E=2·P·Q 라벨 자리가 불규칙 |
| 19 | REQUIRED | [PLANE] 큰 직사각형을 4칸으로 나눈 넓이 2x²·8x·7x·28 → 가로 2x+7, 세로 x+4, 둘레 | DRAWABLE: PLANE_FIGURE_v1: 사각형 4칸 displaySegments + planeMarks.regions(칸마다 label 2x^2·7x·8x·28) + dimensions(2x, 7, x, 4) | KEEP (q19-solution.svg): 격자 분할과 가로·세로 표기가 정확하고 겹침 없음 |
| 24 | REQUIRED | [NUMLINE] 수직선 위 두 직각삼각형(직각변 2·1, 1·3)의 빗변을 반지름으로 한 호 → A=−4−√5, B=−4+√5, C=2−√10, D=2+√10와 BC·AD 길이 | DRAWABLE: number-line-figure-v1 numberLine.constructions(center −4·2, radius sqrt(5)·sqrt(10), arc BOTH, hits) + 두 점 사이 거리 괄호(E34) + surd 점 라벨 **[E35 의존]** | UPGRADE (q24-solution.svg): '반지름 √10' 제목이 호와 겹치고 B·C 점 값 라벨이 서로 가까워 어느 점의 값인지 구분이 약함 |

NOT_NEEDED: 1 제곱근 개념 판별 · 2 제곱근 계산 · 3 근호 곱셈·나눗셈 계산 · 4 무리수 분류 · 5 제곱근표 읽기(표가 문제에 있음) · 6 제곱근표 응용 계산 · 7 인수분해 응용 계산 · 8 근호 값 어림 비교 계산 · 10 규칙 합 계산 · 11 근호 안 문자 부호 판별 · 12 인수분해 검산 · 13 전개 계수 계산 · 14 합차공식 곱 계산 · 15 완전제곱식 조건 · 16 곱셈공식 빈칸 · 17 인수분해 계수 비교 · 18 근호 안 완전제곱식 계산 · 20 정수 조건 개수 세기 · 21 서술형 제곱근·유리화 계산 · 22 인수분해 대입 계산 · 23 완전제곱식 조건 계산

### 1final · 20_신흥중_1학기_기말_중3_수학 (문항 24)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 4 | REQUIRED | [NUMLINE] 모눈 위 기울어진 정사각형의 한 변(가로 2·세로 1)을 반지름으로 한 호가 수직선(중심 −2) 양쪽과 만나는 P, Q | DRAWABLE: number-line-figure-v1 numberLine.constructions(center −2, radius sqrt(5), arc BOTH, hits P·Q) + source.grid(from,to) + 거리 괄호 **[E35 의존]** | - |

NOT_NEEDED: 1 제곱근 개념 판별 · 2 무리수 개념 판별 · 3 제곱근 개수 합 계산 · 5 절댓값·근호 부호 계산 · 6 근호 대소 비교(제곱 비교) · 7 정수·소수 부분 계산 · 8 근호 계산 · 9 근호 곱셈·나눗셈 · 10 분모 유리화 · 11 함수값 계산 · 12 제곱근표 활용 계산 · 13 완전제곱식 계수 비교 · 14 인수분해 판별 · 15 식의 값(치환) · 16 이차방정식 근 대입 · 17 근의 정의 이용 계산 · 18 이차방정식 인수분해 풀이 · 19 이차방정식 풀이 · 20 중근 조건 계산 · 21 사다리꼴 넓이: 문제 그림에 변 길이·직각 표시가 모두 있고 풀이가 식 대입뿐 · 22 넓이 같은 도형 방정식 계산 · 23 인수분해 과정 오류 지적(서술) · 24 완전제곱식 풀이 단계 채우기(대수)

### 1final · 26_삼산중_1학기_기말_중3_기출 (문항 24)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 8 | BENEFICIAL | [GRAPH] y=2x², y=x², y=−2x² 세 포물선(꼭짓점·폭·x축 대칭 비교) | DRAWABLE: multi-curve-figure-v1: Y_OF_X 곡선 3개(coefficients, domain, label) + axisTickValues | - |
| 15 | REQUIRED | [GRAPH] 포물선 y=x²−2x−3과 x절편 A(−1,0)·C(3,0), 꼭짓점 B(1,−4), 삼각형 ABC | DRAWABLE: piecewise-polynomial-spike-v1 한 조각 + overlays(points axis·curveX, polygons ABC, coordinates:true) + requiredPoints | - |
| 17 | BENEFICIAL | [PLANE] 알콰리즈미의 도형: 가로 x+10 정사각형 = x² + 10x + 10x + 100(㉠=100) | DRAWABLE: PLANE_FIGURE_v1: 정사각형 분할 displaySegments + planeMarks.regions(label x^2·10x·100) + dimensions(x, 10) | - |
| 19 | REQUIRED | [GRAPH] y=2x²와 y=−3x² 두 포물선, A(−1,2)·B(1,2)·C(1,−3)·D(1,0), 삼각형 ABO | DRAWABLE: piecewise-polynomial-spike-v1 + referenceCurves(g=−3x², name) + overlays(points, segments, guides, polygons ABO) | - |
| 20 | BENEFICIAL | [GRAPH] 대칭축 x=2, 한 x절편 −1 → 다른 x절편 5 (표본 a=−1: y=−x²+4x+5) | DRAWABLE: piecewise-polynomial-spike-v1 한 조각 + overlays(세로선 x=2, axis 점 −1·5) + sampleNote(a=-1) | - |
| 22 | BENEFICIAL | [PLANE] 직사각형 종이(가로 x, 세로 x+5)의 네 귀퉁이 2×2를 잘라 만든 상자: 밑면 (x−4)·(x+1), 높이 2 | DRAWABLE: PLANE_FIGURE_v1: 직사각형 + 귀퉁이 정사각형 planeMarks.regions + dimensions(x, x+5, 2) | - |
| 24 | BENEFICIAL | [GRAPH] 꼭짓점 (2,−3)인 포물선이 제3사분면을 지나지 않을 조건(y절편 c=4a−3 ≥ 0) 스케치 | DRAWABLE: piecewise-polynomial-spike-v1 표본 a=1 + requiredPoints(꼭짓점·y절편) (경계 a=3/4와 비교하려면 composite-panels-v1 2패널) | - |

NOT_NEEDED: 1 이차방정식 판별 · 2 중근 판별 · 3 이차함수 정의 판별 · 4 꼭짓점 공식 대입 · 5 근과 계수 계산 · 6 제곱근 풀이 계산 · 7 근의 공식 비교 계산 · 9 대칭이동 식 계산 · 10 표의 계수 분류 개수 세기 · 11 평행이동 식 대입 · 12 평행이동량 계산 · 13 완전제곱식 변환 계산 · 14 꼭짓점 좌표 기울기 계산 · 16 꼭짓점형 변환 계산 · 18 이차방정식 세우기·풀이 · 21 이차방정식 풀이 서술 · 23 문제 그림에 x절편 ±3·y절편 9가 모두 있고 풀이가 그 값을 식에 대입할 뿐

### 2mid · 19_동산중_2학기_중간_중3_수학 (문항 25)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 1 | BENEFICIAL | [GRAPH] y=x²−8x+10 그래프: 꼭짓점 (4,−6), 축 x=4, x<4에서 감소, 지나는 사분면 | DRAWABLE: piecewise-polynomial-spike-v1 한 조각 + requiredPoints(꼭짓점) + overlays 세로선 x=4 | - |
| 3 | BENEFICIAL | [GRAPH] 닭장 넓이 A(x)=−2x²+12x의 꼭짓점 (3,18) (0<x<6) | DRAWABLE: piecewise-polynomial-spike-v1 INTERVAL(0,6) + applicationAxes(x(m)·넓이(m²)) + requiredPoints | - |
| 13 | REQUIRED | [PLANE] 직사각형 종이를 대각선 BD로 접은 점 A′와 교점 E, EC의 길이 | DRAWABLE: PLANE_FIGURE_v1: LINE_REFLECTION(A′)·LINE_INTERSECTION(E) + displaySegments + equalLengths + pointNames A′ (위험: layout) | - |
| 14 | BENEFICIAL | [PLANE] 연속한 직각삼각형(AB=BC=CD=DE=EF, AF=10)과 빗변 AC·AD·AE | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT 연쇄 + rightAngles + equalLengths + expressionLabels | - |
| 15 | BENEFICIAL | [PLANE] AD⊥BC, AD=BD, AB=3√2, ∠C=60°인 삼각형(AD=BD=3, CD=√3) | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles + equalLengths + angles(60) + expressionLabels(3sqrt(2)) | - |
| 16 | BENEFICIAL | [PLANE] 정사각형 ABCD 안의 합동 직각삼각형 4개와 □EFGH(AB=15, AE=12, BE=9) | DRAWABLE: PLANE_FIGURE_v1: DIVISION_POINT/POLAR_POINT + rightAngles + equalLengths + 길이 라벨 | - |
| 17 | REQUIRED | [PLANE] 직각삼각형 세 변 위 정사각형, 수선의 발 L·교점 M, 합동·넓이 관계(AB=8, BC=10, AC=6) | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT 정사각형 + PERPENDICULAR_FOOT(L)·LINE_INTERSECTION(M) + rightAngles + regions (위험: layout(점 10개)) | - |
| 18 | BENEFICIAL | [SOLID] 직육면체(가로 5, 높이 8, 세로 x)의 밑면 대각선과 공간대각선 5√5 | DRAWABLE: solid-figure-v1 PRISM RECT + segments(밑면 대각선 점선·공간대각선) + dims(5, 8, x 기호 라벨, 대각선 5\sqrt{5}) | - |
| 19 | BENEFICIAL | [SOLID] 구(반지름 6)를 중심 O에서 4cm 떨어진 평면으로 자른 단면: 단면 중심 H, 단면 둘레 점 A, 직각삼각형 OHA(OA=6, OH=4, HA=x) | **MISSING**: 입체 위 임의 보조점과 그 점을 잇는 선분·직각: 구 단면의 중심 H·둘레 점 A, 선분 OH·OA·HA, 직각 표식, OH=4 거리 라벨. 지금 SPHERE section LEVEL은 칠한 단면 원판과 dims radius level만 그려 직각삼각형 관계가 안 보인다. | - |
| 20 | BENEFICIAL | [SOLID] 원뿔(밑면 반지름 6, 모선 8): 높이 h를 직각변으로 하는 단면 삼각형 | DRAWABLE: solid-figure-v1 CONE + dims(radius bottom, slant, height 기호 h) + axis | - |
| 21 | BENEFICIAL | [PLANE] 원기둥 옆면 전개도(가로 6π, 세로 8π 직사각형)에서 A→B 한 바퀴 최단 경로(대각선) | DRAWABLE: PLANE_FIGURE_v1 직사각형 + displaySegments 대각선 + expressionLabels(6pi, 8pi; 정답 10π는 쓰지 않음). 원기둥 net은 대각선 강조가 안 되어 평면 그림으로 그린다 | - |
| 22 | REQUIRED | [GRAPH] y=−x²+2x+3: 꼭짓점 (1,4), A(−1,0), B(3,0), C(0,3), 삼각형 ABC | DRAWABLE: piecewise-polynomial-spike-v1 + overlays(points, polygons ABC) + requiredPoints(꼭짓점) | - |
| 25 | REQUIRED | [SOLID] 정육면체를 A·F·C 평면으로 잘라 낸 사면체 B-AFC에서 B가 면 AFC에 내린 수선의 발 J와 BJ(=2√3) | **MISSING**: 입체 면 위 임의 점과 수선: 면 AFC 안의 점 J(수선의 발=삼각형의 무게중심)를 3차원에서 정하고, B→J 선분·직각 표식을 그린다. 지금 cuts·segments·marks는 꼭짓점·모서리 위 이름만 참조한다. | - |

NOT_NEEDED: 2 문제 그림에 꼭짓점 (−1,−4)·절편 1이 모두 있고 풀이가 식 세우기뿐 · 4 편차·분산 개념 판별 · 5 산포 비교: 문제 그림의 막대 5개가 이미 전부 · 6 표에서 최빈값·중앙값 계산 · 7 평균·표준편차 비교 표 · 8 평균·분산 계산 · 9 편차 표 계산 · 10 평균·표준편차 변환 계산 · 11 정사각형 넓이 대입(a²+b²=c²): 문제 그림에 세 넓이 조건이 모두 있고 단계가 한 번 · 12 직각삼각형 변 대입: 문제 그림에 변 길이·직각이 모두 있음 · 23 줄기와 잎 표에서 최빈값·중앙값·평균 계산(표는 문제에 있음) · 24 두 집단 표준편차 비교 계산

단원 밖(피타고라스·입체도형, 2019 구교육과정) 문항: [11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 25]

### 2mid · 25_풍덕중_2학기_중간_중3_수학 (문항 25)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 2 | BENEFICIAL | [PLANE] 빗변 6, ∠B=30°인 직각삼각형: x=3, y=3√3 | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles + angles(30) + expressionLabels | KEEP (q2-solution.svg): 삼각형·각·길이 표기가 정확하고 겹침 없음 |
| 6 | BENEFICIAL | [PLANE] sin A=√5/3 → 변 AB=2, BC=√5, AC=3인 직각삼각형 | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles + expressionLabels(sqrt(5)) | KEEP (q6-solution.svg): 세 변 길이와 직각이 정확히 표기됨 |
| 7 | REQUIRED | [PLANE] BC를 공유하는 45° 직각삼각형과 30° 직각삼각형(BC=2√3, AC=2√6) | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles + angles(30·45) + expressionLabels | KEEP (q7-solution.svg): 공유 변과 두 삼각형이 정확. 오른쪽 상자 라벨 자리만 어색한 정도 |
| 9 | REQUIRED | [PLANE] 직각삼각형 ABC에서 D(BC 위)→AC에 내린 수선의 발 E, ∠CDE=x (닮음) | DRAWABLE: PLANE_FIGURE_v1: PERPENDICULAR_FOOT(E) + rightAngles + angles(x) + expressionLabels(sqrt(29)) | KEEP (q9-solution.svg): 점·직각·길이가 정확하고 겹침 없음 |
| 11 | BENEFICIAL | [COORD] x축과 30°를 이루고 y절편이 2인 직선: 기울기 tan30°=√3/3 | DRAWABLE: construction-spike-v1 SOURCE_COORDINATE_AXES_v1 + SOURCE_LINE(기울기 sqrt 계수) + planeMarks.angles(30) + lineLabels | - |
| 13 | REQUIRED | [PLANE] 산 정상 A에서 터널 BC에 내린 수선의 발 H, 30°·45° 직각삼각형, 터널 길이 BC=4+4√3 | DRAWABLE: PLANE_FIGURE_v1: PERPENDICULAR_FOOT(H) + rightAngles + angles + expressionLabels + dimensions | KEEP (q13-solution.svg): H와 두 직각삼각형, 길이가 정확. 글자가 작은 정도 |
| 14 | BENEFICIAL | [PLANE] 원 O의 두 현(길이 8, 반길이 4)과 중심까지 거리 3, x=3 | DRAWABLE: PLANE_FIGURE_v1 원 + 수선의 발 + rightAngles + equalLengths | KEEP (q14-solution.svg): 같은 길이 현과 같은 거리를 보임 |
| 15 | BENEFICIAL | [PLANE] 같은 길이의 두 현 AB·CD, 중심에서 중점 M·N으로 내린 수선(OM=ON) | DRAWABLE: PLANE_FIGURE_v1 원 + 수선의 발 + equalLengths + rightAngles | KEEP (q15-solution.svg): OM=ON→AB=CD 관계를 표기함 |
| 16 | REQUIRED | [PLANE] 깨진 접시: 현 AB의 중점 D, 중심 O, 반지름 r (AD=DB=6, CD=3) | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + rightAngles + dimensions | KEEP (q16-solution.svg): O·D·C 위치와 길이가 정확 |
| 17 | REQUIRED | [PLANE] 원 O에서 OM=ON → 두 현 PB=BC, 꼭지각 62°, 밑각 x=59° | DRAWABLE: PLANE_FIGURE_v1 원 + 수선의 발 + equalLengths + angles(62, x) | UPGRADE (q17-solution.svg): 62°·x 각 표식과 OM=ON 같은 길이 표식이 없어 해설 핵심 관계가 그림에 없음 |
| 18 | REQUIRED | [PLANE] 원 O에 외접하는 △ABC(AB=3, AC=6, BC=7)와 접선 길이 BP=u, AR=w, CR=x | DRAWABLE: PLANE_FIGURE_v1: ANGLE_BISECTOR 교점으로 내심 + PERPENDICULAR_FOOT 접점 + equalLengths(3묶음) + 변 길이 라벨 | UPGRADE (q18-solution.svg): 변 길이 3·6·7과 접선 길이 x가 그림에 없고 접점 이름만 있음 |
| 19 | REQUIRED | [PLANE] 반원 O의 접선 AD·BC·CD(AB=6, BC=5), AD=DE=x | DRAWABLE: PLANE_FIGURE_v1 반원(planeMarks.arcs highlight:false) + TANGENT_AT_POINT + equalLengths + rightAngles | KEEP (q19-solution.svg): 접선·길이가 정확 |
| 20 | BENEFICIAL | [PLANE] 외부점 P의 두 접선 PA·PB, OA⊥PA, OB⊥PB, OP 공통(RHS 합동) | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + equalLengths | KEEP (q20-solution.svg): RHS 합동 근거를 표기함 |
| 22 | REQUIRED | [PLANE] 눈높이 1.5m, 수평거리 BD=4.5m, 올려본각 54°, 고양이 높이 CE | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles + angles(54) + dimensions(4.5, 1.5) | UPGRADE (q22-solution.svg): 54°·눈높이 1.5m·직각 표식이 없고 CE 값 라벨이 도형에서 떨어져 있음 |
| 23 | BENEFICIAL | [PLANE] □ABCD에서 BC=6, CD=8, ∠CAB=30°, ∠ACD=60°: AC=12, AB=6√3 | DRAWABLE: PLANE_FIGURE_v1: POLAR_POINT + rightAngles(B) + angles(30, 60) + expressionLabels(6sqrt(3), 12) | - |
| 24 | REQUIRED | [PLANE] 원 O 밖 P의 두 접선, ∠APO=30°, PO=16 → OA=8, AP=8√3, □APBO | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + angles(30) + regions(□APBO) | UPGRADE (q24-solution.svg): 30°와 OA⊥AP 직각 표식이 없음 |
| 25 | REQUIRED | [PLANE] 접선 PA·PB·CD (PB=8, PC=7, CD=3), 접선 길이 같음으로 x=6 | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + equalLengths(3묶음) + 길이 라벨 | KEEP (q25-solution.svg): 접선과 길이가 정확. 도형이 작은 정도 |

NOT_NEEDED: 1 문제 그림에 변 길이가 있고 삼각비 정의 대입뿐 · 3 삼각비 값 계산 · 4 문제 그림(사분원)에 0.60·0.80·1.33이 모두 있고 읽기만 함 · 5 삼각비 성질 판별 · 8 삼각비 대소 판별 · 10 삼각비표 읽기(문제 그림에 표) · 12 삼각비 대소로 근호 정리 · 21 삼각비 값 계산(서술)

### 2final · 20_이수중_2학기_기말_중3_기출 (문항 22)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 1 | BENEFICIAL | [PLANE] 원 O, 현 AB, 수선의 발(중점) H, OA=5, OH=3 → AH=4, AB=8 | DRAWABLE: PLANE_FIGURE_v1 원 + PERPENDICULAR_FOOT + rightAngles + equalLengths + 길이 라벨 | - |
| 2 | BENEFICIAL | [PLANE] OM=ON인 두 현 AB·CD, 수선의 발 M·N이 현을 이등분 | DRAWABLE: PLANE_FIGURE_v1 원 + PERPENDICULAR_FOOT + equalLengths(OM=ON, AM=MB, CN=ND) + rightAngles | - |
| 3 | BENEFICIAL | [PLANE] OM=ON → AB=AC, ∠A=50° → ∠B=65° | DRAWABLE: PLANE_FIGURE_v1 원 + 수선의 발 + equalLengths + angles(50, 65) | - |
| 4 | BENEFICIAL | [PLANE] 접선 PT ⊥ OT, OT=5, PO=10 → PT=5√3 | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + 길이 라벨 | - |
| 5 | REQUIRED | [PLANE] 접선 PA·PB, ∠APB=30°, OP가 각을 이등분, 현 AB와 ∠x | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + angles(30, 15, x) + displaySegments OP | - |
| 6 | BENEFICIAL | [PLANE] 접선 길이 AP=BP=12, 연꼴 □APBO 넓이 108 | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + equalLengths + regions(□APBO) | - |
| 7 | BENEFICIAL | [PLANE] △ABC(8, 7, 6)의 내접원과 접점 D·E·F, 접선 길이 BD=BE, AD=AF, CE=CF | DRAWABLE: PLANE_FIGURE_v1: ANGLE_BISECTOR 교점으로 내심 + PERPENDICULAR_FOOT 접점 + equalLengths(3묶음) (위험: layout) | - |
| 8 | BENEFICIAL | [PLANE] 중심각 ∠AOB=120° → 원주각 ∠APB=x=60° | DRAWABLE: PLANE_FIGURE_v1 원 + angles(120, x) + arcs(MINOR) | - |
| 9 | BENEFICIAL | [PLANE] 지름 AC에 대한 원주각 ∠ABC=90°, ∠CAB=25° | DRAWABLE: PLANE_FIGURE_v1 원 + rightAngles + angles(25, 65, x) | - |
| 10 | BENEFICIAL | [PLANE] 중심각 100° (작은 호), 점 C가 작은 호 위 → ∠ACB=130° | DRAWABLE: PLANE_FIGURE_v1 원 + planeMarks.arcs(MINOR·MAJOR, label 100·260) + angles | - |
| 11 | BENEFICIAL | [PLANE] 교차하는 두 현 AC·BD, 2호AD=3호BC, ∠BPC=70° | DRAWABLE: PLANE_FIGURE_v1 원 + planeMarks.arcs(label 3t·2t) + angles(70, x) | - |
| 12 | REQUIRED | [PLANE] △ABC의 내접원이자 △DEF의 외접원: ∠A=50°, ∠EFD=55°, 중심각 ∠DOF=130° 등 | DRAWABLE: PLANE_FIGURE_v1: ANGLE_BISECTOR 내심 + 접점 + 반지름 OD·OF + rightAngles + angles (위험: layout) | - |
| 13 | REQUIRED | [PLANE] 원에 내접하는 □ABCD와 외부 두 교점(30°)과 ∠x, ∠ADC=115° | DRAWABLE: PLANE_FIGURE_v1 원 + LINE_INTERSECTION(외부 교점) + angles + arcs (위험: layout) | - |
| 14 | BENEFICIAL | [PLANE] 원 O에 내접하는 □ABCD, ∠CAD=115°, ∠ADC=40° → ∠ABD=∠ACD=25° | DRAWABLE: PLANE_FIGURE_v1 원 + angles(115, 40, 25, x) + 같은 호 표식 | - |
| 15 | BENEFICIAL | [PLANE] 접선 AT와 현 AB의 각 70° = 원주각 ∠ACB | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT 직선(arrow BOTH) + angles(70, 50, x) | - |
| 16 | BENEFICIAL | [PLANE] 접선과 현 AD의 각 30° = 원주각 ∠ABD, △ABD | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + angles(30, 40, x) | - |
| 17 | REQUIRED | [PLANE] 두 반원(지름 AB, BC)과 접점 Q의 접선 AP, O′Q⊥AP, ∠QAC=28° → ∠AQC | DRAWABLE: PLANE_FIGURE_v1: CIRCLE + TANGENT_AT_POINT + PERPENDICULAR_FOOT + rightAngles + angles(28, 62, x) (위험: layout(복잡 작도)) | - |
| 18 | REQUIRED | [PLANE] OP=OQ → AB=AC, ∠ACB=50°, AC=6, 중점 P·Q, ∠x·∠y(서술형 5소문항) | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + 수선의 발 + equalLengths + angles(50, y, x) + 길이 라벨 | - |
| 19 | REQUIRED | [PLANE] 접시 조각: 현 AB(AM=BM=9), 중점 M, CM=3, 중심 O, 반지름 r=15 | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + rightAngles + equalLengths + dimensions(9, 3, r 기호) | - |
| 20 | BENEFICIAL | [PLANE] 원에 외접하는 □ABCD, 접점 P·Q·R·S, 접선 길이 AP=AS, BP=BQ, CQ=CR, DR=DS | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT 교점 꼭짓점 + expressionLabels(a·b·c·d를 8개 선분에, equalLengths 눈금은 3묶음 한계라 기호 라벨로 대체) (위험: layout(라벨 8개)) | - |
| 21 | REQUIRED | [PLANE] 무대 AB=10m, 원주각 60°인 점들의 자취(큰 호), 카메라 레일 | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + planeMarks.arcs(MAJOR) + angles(60) + dimensions(10 m) | - |
| 22 | REQUIRED | [PLANE] △ABC의 수선의 발 D·E·F, 수심 P, 지름 AB·BC·CA·AP·BP·CP를 이용한 원에 내접하는 사각형 6개 | DRAWABLE: composite-panels-v1 평면 패널 4개(지름 AB·BC·CA 원 3개 + 지름 AP·BP·CP 원 한 패널) + rightAngles + 원 (위험: layout(6개 사각형)) | - |

NOT_NEEDED: 

### 2final · 24_연향중_2학기_기말_중3_기출 (문항 23)

| 번호 | 필요 | 그림 종류 | 지금 엔진 | 기존 해설 그림 |
|---|---|---|---|---|
| 1 | BENEFICIAL | [PLANE] 반지름 6인 원의 현 AB와 중심 O 사이 거리: 수선의 발 M, AM=4, OM=2√5 | DRAWABLE: PLANE_FIGURE_v1 원 + PERPENDICULAR_FOOT + rightAngles + equalLengths + 길이 라벨 | UPGRADE (solution_q1.svg): '4 cm' 라벨이 M 점 이름과 겹치고 직각·중점 같은 길이 표식이 없음 |
| 2 | BENEFICIAL | [PLANE] 접선 PA·PB, OA=6, OP=11 → PB=√85 (OB⊥PB) | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + 길이 라벨 | UPGRADE (solution_q2.svg): '11 cm'가 원 호와 겹치고 PB 라벨이 선 위에 놓이며 직각 표식이 없음 |
| 3 | REQUIRED | [PLANE] 반원 O(반지름 3)의 접선 AD·BC·CD(=9), 접선 길이 같음으로 □ABCD 둘레 | DRAWABLE: PLANE_FIGURE_v1 반원(planeMarks.arcs highlight:false) + TANGENT_AT_POINT + equalLengths + rightAngles | UPGRADE (solution_q3.svg): '3 cm'가 O 점 이름과 겹치고 접선 길이 같음 표식 없음 |
| 4 | REQUIRED | [PLANE] 원에 내접한 □ABCD와 외부점 P(∠P=35°, ∠ABC=95°) → ∠PCD=60° | DRAWABLE: PLANE_FIGURE_v1 원 + LINE_INTERSECTION(P) + angles(35, 95, 85, x) (위험: layout) | UPGRADE (solution_q4.svg): 95°·35° 라벨이 선·점과 겹치고 각 호 표식이 없음 |
| 5 | REQUIRED | [PLANE] 원의 일부(호 AB): AD=BD=5, CD=1, 중심 O가 CD 연장선 위, 반지름 13 | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + rightAngles + equalLengths + dimensions | UPGRADE (solution_q5.svg): 5 cm·1 cm·C·D 라벨이 서로 겹침, 직각 표식 없음 |
| 6 | REQUIRED | [PLANE] △ABC의 내접원이 △DEF의 외접원: ∠A=60°, ∠B=70° → ∠C=50°, ∠x=65° | DRAWABLE: PLANE_FIGURE_v1: ANGLE_BISECTOR 내심 + 접점 + rightAngles + angles (위험: layout) | UPGRADE (solution_q6.svg): 130°·x=65° 라벨이 선과 겹치고 직각 표식이 일부만 있음 |
| 7 | REQUIRED | [PLANE] 접선 PA·PB, 지름 AC, ∠BAC=32° → ∠ABC=90°, ∠APB=64° | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + angles(32, 64) | KEEP (solution_q7.svg): 점·각·접선 관계가 정확하고 라벨 충돌 없음 |
| 8 | BENEFICIAL | [PLANE] 접선 PT, ∠TPO=30°, PA=6 → PT=6√3 | DRAWABLE: PLANE_FIGURE_v1 원 + TANGENT_AT_POINT + rightAngles + angles(30) + 길이 라벨 | UPGRADE (solution_q8.svg): 'PT=6√3 cm'가 선과 겹치고 A 점 이름이 '6 cm'에 가려짐, 직각 표식 없음 |
| 9 | BENEFICIAL | [PLANE] 직각삼각형(AB=15, AC=9, BC=12)의 내접원 반지름 3과 접점 D·E·F | DRAWABLE: PLANE_FIGURE_v1: ANGLE_BISECTOR 내심 + 접점 + rightAngles + 길이 라벨 | KEEP (solution_q9.svg): 삼각형·내접원·변 길이가 정확하고 겹침 없음 |
| 10 | REQUIRED | [PLANE] 지름 AB 위 반원을 4등분한 호(45°), ∠x+∠y의 원주각 | DRAWABLE: PLANE_FIGURE_v1 원 + planeMarks.arcs(equalGroup 같은 호 표식, E30) + angles(x, y) | UPGRADE (solution_q10.svg): x·y가 각 표식이 아닌 점 위치의 글자이고 같은 호 표식·각 호가 없으며 O가 선들과 겹침 |
| 11 | REQUIRED | [PLANE] 외접원 O, 지름 AQ, AH⊥BC, AB=16, AC=10, CH=5 → AH=5√3, 반지름 16√3/3 | DRAWABLE: PLANE_FIGURE_v1 원(CIRCLE_THROUGH_3) + PERPENDICULAR_FOOT(H) + rightAngles + 길이 라벨 | UPGRADE (solution_q11.svg): 'AH=5√3' 라벨이 겹쳐 읽히지 않고 직각 표식이 없음 |
| 19 | BENEFICIAL | [STAT] 산점도(읽기·듣기 점수)에서 두 점수가 모두 8점 이상인 영역의 점 4개 (Q18의 산점도 공유) | **MISSING**: 산점도 기준선·영역 강조: 세로선 x=8, 가로선 y=8과 오른쪽 위 영역(x≥8, y≥8) 칠, 영역 안 점 개수(엔진이 세어 라벨). 지금 SCATTER는 points·diagonal(y=x)·names만 있다. | - |
| 20 | BENEFICIAL | [STAT] 산점도에서 직선 y=x 위쪽(과학>사회) 점 세기 | DRAWABLE: stat-chart-figure-v1 SCATTER(points 15개 xRange·yRange, diagonal:true) | - |
| 21 | REQUIRED | [PLANE] 정사각형 ABCD(한 변 10)와 두 변에 접하는 원, 현 PQ의 중점 M, BM=r, OM=10−r | DRAWABLE: PLANE_FIGURE_v1: 정사각형 + 원(중심 sqrt 좌표 SOURCE_POINT) + PERPENDICULAR_FOOT + rightAngles + dimensions | KEEP (solution_q21.svg): 정사각형·원·P·Q·M이 정확하고 라벨 충돌 없음 |
| 22 | REQUIRED | [PLANE] 원 위 네 점, 세 호 같음(104°), 두 현의 연장선 교점 E=28°, ∠AFD=76° | DRAWABLE: PLANE_FIGURE_v1 원 + LINE_INTERSECTION(E, F) + arcs(equalGroup) + angles(28, 52, 76) | UPGRADE (solution_q22.svg): 76° 라벨이 O·F 점 이름과 겹치고 같은 호 표식이 없음 |

NOT_NEEDED: 12 자료 목록에서 평균·중앙값 비교(계산) · 13 도수 표에서 중앙값·최빈값 계산(표는 문제 그림) · 14 중앙값 계산(조건 텍스트) · 15 자료 목록에서 평균·분산 계산 · 16 편차 표 계산(표는 문제 그림) · 17 중앙값·평균 조건 계산 · 18 산점도 읽기: 문제 그림에 점이 모두 있고 풀이는 같은 가로 줄 세기 · 23 분산 조건 방정식 계산

## 5. 기존 해설 그림 점검 (KEEP / UPGRADE)

기존 해설 그림 31개를 PNG로 바꿔 직접 보았다. KEEP 15, UPGRADE 16.

- 25_왕운중 1학기 중간(손으로 만든 SVG 3개): q19 KEEP, q9·q24 UPGRADE(라벨이 변·호와 겹침).
- 25_풍덕중 2학기 중간(엔진 그림 15개): 11개 KEEP. q17(62°·x 각과 OM=ON 표식 없음), q18(변 3·6·7과 접선 길이 없음), q22(54°·눈높이 1.5m 없음), q24(30°·직각 표식 없음)는 결정적 값이 빠져 UPGRADE. 이 4개는 지금 엔진의 planeMarks(angles·rightAngles·equalLengths·dimensions)로 다시 그리면 된다.
- 24_연향중 2학기 기말(13개): q7·q9·q21 KEEP, 나머지 10개(q1·q2·q3·q4·q5·q6·q8·q10·q11·q22)는 라벨이 점 이름·선과 겹치고 직각·각·같은 호 표식이 없어 UPGRADE.

## 6. 문제에 "그림"이라 했는데 image가 없는 문항

선택한 8개 시험지에서 발문에 '그림'이라 했는데 image(필드·<img>·<svg>)가 없는 문항은 없다. 24_연향중 2학기 기말 q19는 q18의 산점도를 공유하는 묶음 문항이라 자기 image가 없지만 발문에 '그림'이라는 말은 없다(공유 지문).

폴더 전체(참고, 발문에 "그림"이 있는데 image·<img>·<svg>·<table>이 없는 문항): 1mid 1문항, 1final 4문항, 2mid 8문항, 2final 0문항 — 드물다.

다른 데이터 문제(그림 자체는 있으나 상태가 나쁨):
- 21_금당중_1학기_중간_중3_수학 [9, 13, 15, 21]: 문제 그림 PNG가 잘려 있다(q09는 수직선 오른쪽·P·Q 라벨이 잘림, q13은 정사각형 D가 반쯤 잘림, q15는 사다리꼴 변 a·b 라벨이 잘림, s01은 아래 문구가 섞여 있고 모눈이 흐림). 원문 그림을 다시 자르거나 엔진 그림으로 대체해야 해설 그림과 맞출 수 있다. (archive/exams/original/middle/m3/1mid/assets/images/21_금당중_1학기_중간_중3_수학/{q09,q13,q15,s01}.png (이 시험지의 그림은 archive/assets/images가 아니라 시험 폴더 안 assets에 있다))
- 20_이수중_2학기_기말_중3_기출 해설 다수: 해설 solution이 $ 구분자 없이 TeX 그대로 쓰여 있다(예: AH^2+OH^2=OA^2, \angle B=\angle C). 렌더 시 수식이 깨질 수 있음(math-delimit 점검 대상).
- 19_동산중_2학기_중간_중3_수학 [11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 25]: 2019년 시험지라 구교육과정 단원(피타고라스 정리·입체도형 측정)이 들어 있다. 사용자가 적은 중3 2학기 단원(삼각비·원의 성질·통계) 밖이지만 문항이라 판정에는 포함했다(그림 필요 9문항).

## 7. 빠진 기능 순위 (문항 수 순)

표본에서 못 그리는 문항은 4개이고 기능으로는 3개다. 문항 수가 모두 1~2라 순위는 표본 크기의 한계가 있다(아래 "추정" 참고).

| 순위 | 빠진 기능 | 문항 수 | 문항 |
|---|---|---|---|
| 1 | 입체 위의 임의 보조점과 그 점을 잇는 선분·직각·거리 표기 (면 위 수선의 발 J, 구 단면의 중심 H·둘레 점 A) | 2 | 19_동산중_2학기_중간_중3_수학#19, 19_동산중_2학기_중간_중3_수학#25 |
| 2 | 산점도 기준선·영역 강조와 영역 안 점 개수 (SCATTER에 세로·가로 기준선, 사분 영역 칠, 개수 라벨) | 1 | 24_연향중_2학기_기말_중3_기출#19 |
| 3 | 수직선 연속 컴퍼스 작도: 앞 호의 교점 위에 수선을 세워 만든 직각삼각형의 빗변(모눈 밖 반지름)으로 다음 호 | 1 | 21_금당중_1학기_중간_중3_수학#9 |

### 설계 1. 입체 위의 임의 보조점과 그 점을 잇는 선분·직각·거리 표기 (면 위 수선의 발 J, 구 단면의 중심 H·둘레 점 A)

- 참고: gaps.md E27b(구 중심 직각 표시·단면 넓이 라벨), E28f/E28h(높이의 발이 꼭짓점이 아닌 직각 표시)
- plan 모양: solid-figure-v1 항목에 points:[{"name":"J","on":{"polygon":["A","F","C"],"at":"FOOT_FROM","from":"B"}}] (면 위 점; 정확한 위치는 엔진이 3차원에서 계산: 수선의 발, 무게중심, 비율 중 하나) 와 구 단면용 sectionPoints:{"center":"H","rim":"A"}(LEVEL 단면의 중심·둘레 한 점). 이어 segments:[{"from":"B","to":"J","role":"ACCENT"}], 구는 segments:[{"from":"O","to":"H"},{"from":"O","to":"A"},{"from":"H","to":"A"}], marks.rightAngles:[{"at":"J","refs":["B","A"]}], dims:[{"from":"O","to":"H","label":"4"}].
- 관측기가 최종 SVG에서 확인할 것: plan만으로 3차원 모델을 다시 만들어 점이 지정한 면(또는 단면 원) 위에 있는지, BJ가 면의 두 모서리 방향과 모두 수직인지(내적 0), OA=R·OH=d·HA=√(R²−d²)인지를 계산하고, 최종 SVG에서 점 표식·선분(가려지면 점선)·직각 표식·거리 라벨의 위치를 대조한다.
- 거절 사례: SOLID_POINT_NOT_ON_FACE(점이 면 밖), SOLID_FOOT_DEGENERATE(B가 이미 면 위), SOLID_POINT_NAME_DUPLICATE, SOLID_SECTION_POINT_REQUIRES_LEVEL(LEVEL 단면 없는 구), 숨은 면 위 점의 라벨 자리 없음은 SOLID_LABELS_NO_ROOM.
- 풀리는 문항: 19_동산중 2학기 중간 q19(구 단면 직각삼각형), q25(정육면체 절단 사면체의 높이 BJ). 같은 계열: 구·원뿔 단면, 정육면체 안의 사면체 높이 문항.

### 설계 2. 산점도 기준선·영역 강조와 영역 안 점 개수 (SCATTER에 세로·가로 기준선, 사분 영역 칠, 개수 라벨)

- 참고: q18의 같은 가로 줄(듣기 8점) 점 세기도 같은 기능(행 강조)으로 보임. 상관관계 산점도 문항의 일반 패턴
- plan 모양: stat-chart-figure-v1 SCATTER에 guides:[{"axis":"x","value":8},{"axis":"y","value":8}], regions:[{"id":"pass","xMin":8,"yMin":8,"fill":"LIGHT","countLabel":true}] 선택 highlightRow:{"axis":"y","value":8}. 개수는 엔진이 points에서 세어 영역 곁에 쓴다(작성자가 값을 쓰지 않음).
- 관측기가 최종 SVG에서 확인할 것: plan의 points로 영역 안 점 수를 다시 세어 최종 SVG의 개수 글자와 대조, 기준선이 정확한 눈금 위에 있는지, 영역 칠이 점·선·라벨 아래인지, 영역 안·밖 점의 강조가 plan과 같은지 읽는다.
- 거절 사례: STAT_SCATTER_GUIDE_OUT_OF_RANGE(기준값이 xRange·yRange 밖), STAT_SCATTER_REGION_EMPTY(영역 안 점 0), STAT_SCATTER_COUNT_MISMATCH(작성자가 쓴 개수가 센 값과 다름), STAT_SCATTER_REGION_NOT_ON_STEP.
- 풀리는 문항: 24_연향중 2학기 기말 q19(읽기·듣기 모두 8점 이상 4명). q18(듣기 8점 줄) 행 강조도 같은 필드.

### 설계 3. 수직선 연속 컴퍼스 작도: 앞 호의 교점 위에 수선을 세워 만든 직각삼각형의 빗변(모눈 밖 반지름)으로 다음 호

- 참고: E35 진행 중 기능의 확장. √2→√3→√5 나선(제곱근 작도) 문항 계열
- plan 모양: numberLine.constructions 항목에 source:{"perpendicularAt":{"from":"P","height":"1"}} 를 허용하고 radius:{"hypotenuseOf":["P","B"]} 로 앞 단계 점과 연결(체인 id 참조). 예: c1: center O, radius sqrt(2)(grid 대각선) hits P; c2: center O, radius {from c1.P, up 1}, hits Q → Q=√3.
- 관측기가 최종 SVG에서 확인할 것: 체인의 각 단계에서 중심·반지름·교점을 plan에서 독립 계산(√2, √3)해 최종 SVG의 호 반지름·수선 위치·직각 표식·교점 위치와 대조, 수선 길이 BP가 plan 높이와 같은지 확인.
- 거절 사례: NUMBER_LINE_CONSTRUCTION_CHAIN_UNKNOWN(참조한 앞 단계·점 없음), NUMBER_LINE_CONSTRUCTION_HEIGHT_INVALID(0 이하), 호가 수직선에 닿지 않으면 기존 NUMBER_LINE_CONSTRUCTION_HIT_MISSING.
- 풀리는 문항: 21_금당중 1학기 중간 q9(√3). 같은 계열 제곱근 나선 작도 문항.

### 의존 항목 (빠진 기능은 아니지만 진행 중인 E35가 나와야 그려짐)
- E35 수직선 컴퍼스 작도 — number-line-figure-v1 numberLine.constructions + source.grid + arc BOTH + 거리 괄호(E34) — 4문항: 20_신흥중_1학기_기말_중3_수학#4, 21_금당중_1학기_중간_중3_수학#21, 25_왕운중_1학기_중간_중3_기출#24, 25_왕운중_1학기_중간_중3_기출#9
  - 이 4문항은 DRAWABLE로 세었지만 E35가 (1) 모눈 위 선분을 반지름 출처로 그리는 source.grid, (2) 호가 중심 양쪽(BOTH)으로 수직선과 만나는 hits, (3) 음수 포함 임의 정수 눈금 위의 중심(−5, −4, −3, −2, 1, 2), (4) 두 점 사이 거리 괄호 라벨을 모두 내놓아야 그려진다. 21_금당중 q21은 정답지 golden item29 그대로이므로 E35의 1차 완료 기준과 같다.

### 라벨 밀집 위험 (DRAWABLE이지만 LAYOUT_INVENTORY_INCOMPLETE 가능성)
19_동산중_2학기_중간_중3_수학#13, 19_동산중_2학기_중간_중3_수학#17, 20_이수중_2학기_기말_중3_기출#12, 20_이수중_2학기_기말_중3_기출#13, 20_이수중_2학기_기말_중3_기출#17, 20_이수중_2학기_기말_중3_기출#20, 20_이수중_2학기_기말_중3_기출#22, 20_이수중_2학기_기말_중3_기출#7, 24_연향중_2학기_기말_중3_기출#4, 24_연향중_2학기_기말_중3_기출#6

## 8. 추정 (참고)

| 폴더 | 표본 문항 | 표본 그림 필요 | 비율 | 폴더 전체 문항 | 추정 그림 필요 문항 |
|---|---|---|---|---|---|
| 1학기 중간(1mid) | 47 | 7 | 15% | 1365 | 약 203 |
| 1학기 기말(1final) | 48 | 8 | 17% | 1385 | 약 231 |
| 2학기 중간(2mid) | 50 | 30 | 60% | 946 | 약 568 |
| 2학기 기말(2final) | 45 | 37 | 82% | 1012 | 약 832 |
| 합계 | 190 | 82 | 43% | 4708 | 약 1834 |

폴더마다 시험지 2개(최근 1·옛날 1)만 본 표본이라 오차가 크다. 학기별 차이(1학기 약 16%, 2학기 약 71%)는 뚜렷하지만 폴더 안 변동도 크다(2mid: 19_동산 13/25 vs 25_풍덕 17/25). 질문 수는 해설이 있는 시험지와 없는 시험지를 모두 포함한 전체 문항 수다.

## 9. 한계

- 시험지 8개·190문항 표본이다. 문항별 판정은 문제 그림(PNG/SVG)과 해설 글을 직접 보고 내렸다.
- DRAWABLE은 가이드에 적힌 기능(요약 가이드 6종 + 진행 중 E31~E35 + 필요한 곳은 전체 AUTHOR_GUIDE·construction.py의 연산 목록을 grep)에 근거한 판정이다. 렌더하지 않았으므로 라벨 자리·작도 조합이 실패할 수 있다.
- "NOT_NEEDED"와 "BENEFICIAL"의 경계는 판단이 들어간다. 이 보고서는 문제 그림에 모든 값이 있고 풀이가 대입 한 단계뿐인 도형 문항(예: 19_동산 q11·q12, 20_신흥 q21)은 NOT_NEEDED로 두고, 풀이가 파생 길이·각·접선 관계·보조 점을 만드는 문항은 BENEFICIAL 이상으로 셌다.
