# 기하 유형은행 104~112 — 문항별 SVG 엔진 plan 인계 (2026-11-25)

## 범위와 검증 분모

- 기준: 2026-11-25 `origin/main` **`a3cbe20214472713b8502bba7e9196263d27b9f3`**. 작업 전 열린 관련 figure-plan PR 0건. 이전 #3019에서 `104-q01, q02`까지 병합됨. `104-q03`은 현행 원본에 `[그림: …]`이 없어 제외.
- 기하 파일 104, 105, 106, 110, 111, 112의 **그림 지시 문항 15개**를 원문 발문·보기·정답·해설과 직접 대조함. 중간 107~109, 111의 나머지, 112의 나머지는 문제용 `[그림]` 지시가 없어 이번 제작 목록에 포함하지 않음. “그림 제외”는 해당 파일·문항의 해설 시각자료 EXEMPT 판정이 아님.
- **15개 모두** `construction-spike-v1` 공식 엔진용 `qNN-problem.plan.json` 실사용 입력. `caption`, `accessibilityDescription`, `sourceConditions` 조건별 `mappedTo`, `newVisualInformation` 구비. JS 원본 및 `image`, `solutionImage`는 변경하지 않음.
- plan-lint **shallow 15/15 PASS**, **full 15/15 PASS** (별도 설치된 SymPy 의존성 및 본 워크트리의 공식 visual_engine 심볼릭 검증). *별개 독립 SymPy*로 원문에 주어진 기하 관계·벡터 항등식·수치 정답 **15/15 PASS**, 원문 `[그림]` 존재/필수 필드/원문 밖 정답 노출 점검 **15/15 PASS**.
- `DRAWN_FEATURE_PARITY`: **15/15 PASS (plan에 실제 렌더되는 필드가 있음을 정적 확인)**. 기존 엔진 미지원으로 판정된 필수 표식은 이번 신규 15개에서 0건. 이 수치는 SVG 파일/PNG 실물의 눈 검수 PASS가 아님. 실제 엔진 렌더에서 font·text label 배치 등의 오류가 발생하면 해당 qid 재검수 필요.
- 모든 qid의 `sourceVsPlan=REVIEWED`, `planLintShallow=PASS`, `planLintFull=PASS`, `independentMath=PASS`, `answerLeak=PASS`, `featureParity=PASS`. **전 qid** `render=NOT_RUN`, `PNG=NOT_RUN`, `studentView=NOT_RUN`, `phone390px=NOT_RUN`, `A4=NOT_RUN`, `JSLink=NOT_RUN`, `publication=NOT_RUN`. 렌더·학생 화면 검수·게시 담당: **안티그래비티**.

## qid별 실제 작성과 시각 필드 충실도

plan 경로의 공통 루트: `archive/tools/geometry-equation/production/plans/`. 아래의 `NN/qXX`는 다음의 정확한 stem+파일명으로 매핑된다: `NN`은 아래 6개 파일 이름에서 확인하고 파일은 `qXX-problem.plan.json`이다. 정본 경로는 본 PR의 실제 15개 JSON이다.

| 원본·qid | 실제 plan 구성 / 원문-그림 별도 대조 | 실제 그려지는 필수 숫자·방향·표식 | 정적 parity |
| --- | --- | --- | --- |
| **104-q04** | OAB, OA의 2:1점 M, AB의 1:3점 N, 유향선분 M→N. `DIVISION_POINT` 2개. | `planeMarks.vectors`의 OA=`vec(a)`, OB=`vec(b)`, MN=`vec(MN)`와 `textLabels`의 `OM:MA=2:1`, `AN:NB=1:3` | PASS |
| **104-q05** | 직사각형 OABC, AB의 2:1점 M·BC의 1:2점 N. 직교하는 정확한 대표 좌표. | `displaySegments` 여섯 개가 직사각형·내분 양쪽 선분을 구성하며 `textLabels`에 `AM:MB=2:1`, `BN:NC=1:2`를 직접 씀 | PASS |
| **104-q06** | OA=4, OB=3인 직각삼각형, `DIVISION_POINT(A,B;3:2)`의 P. | `rightAngles`의 O 사각 직각과 `dimensions`에 4·3. 구하는 AP 길이는 표시하지 않음 | PASS |
| **104-q07** | BA=2, BC=3, ∠ABC=60°. `POLAR_POINT`로 회전 구성. | `planeMarks.angles`의 실제 60° 호·라벨 및 `dimensions` 2·3. 미지 P·AP는 그리지 않음 | PASS |
| **104-q08** | ABC에서 D=AB의 1:2, E=AC의 2:1, F=AC의 1:2, P=BF∩DE. `LINE_INTERSECTION` 사용. | 실제 BF·DE 교차, A→B=`vec(a)`·A→C=`vec(b)`와 `textLabels` 세 내분비 (`AD:DB`, `AE:EC`, `AF:FC`). 외곽선의 같은 화살표 위 중복 선분은 제거 | PASS |
| **105-q01** | AB=5, AC=3인 삼각형의 A각 이등분선 AD, D=BC 5:3 내분. | 실제 `dimensions` 5·3, 각 크기가 같은 `planeMarks.angles` 두 호(대표 좌표의 45° 수치는 숨김) | PASS |
| **105-q02** | AB=5, AC=2, D=BC 5:2 내분, I=AD 위 진짜 내심, 내접원. | 치수선 5·2, 같은 각호 2개, I 중심 반지름 `(7−√29)/2`의 실제 `displayCircles` 원. 도출 결과 `m−n`은 표기하지 않음 | PASS |
| **105-q03** | 실제 세 변 7·8·5, I=내심, 내접원 및 A→I. | `dimensions` 7·8·5, `displayCircles` 반지름 √3, `vectors`의 `vec(AI)` 유향 화살표 | PASS |
| **106-q02** | ABC의 `CENTROID` G, A→B p, A→C q, B→G 유향선분. | 3개의 서로 다른 `planeMarks.vectors`; 무게중심 계산 위치 | PASS |
| **106-q03** | OAB에서 OA·OB의 중점 M·N과 AN·BM의 무게중심 교점 G. | `MIDPOINT`×2·`CENTROID`×1, 실제 중선 AN·BM 선분, 위치벡터 `vec(a)`, `vec(b)` | PASS |
| **106-q04** | ABC의 무게중심 G, AB 중점 M, AC 중점 N. | G→M=`vec(p)`·G→N=`vec(q)` 두 화살표와 실제 양쪽 변 중점 | PASS |
| **106-q05** | P(8,15)를 중심으로 한 원, 그 위 정삼각형 ABC. 반지름은 조건에 없는 대표값 4. | `SOURCE_COORDINATE_AXES_v1`, P의 실제 `coordinateLabels` (8,15), 점선 OP, `displayCircles`와 P 중심 ±120°의 A·B·C | PASS |
| **110-q04** | OA=OB=AB=2√3인 정삼각형 AOB, 끼인각 60°. | 양 변 `dimensions`에 `2sqrt(3)` 및 각호 `60`. **요구된 넓이를 알려 주는 평행사변형은 정답 노출 방지로 그리지 않음** | PASS |
| **111-q05** | 모눈 한 칸 1, a=(2,1), b=(1,−1), c=(3,3). | **실제 `displaySegments` 모눈선 13개**(세로 6+가로 7)와 방향·성분이 정확한 화살표 3개; 보조 격자점은 `hiddenPointStyle:NONE` | PASS |
| **112-q04** | 모눈 한 칸 1, a=(1,1), b=(2,1), c=(3,−1). | **실제 `displaySegments` 모눈선 12개**(세로 6+가로 6)와 정확한 화살표 3개. 찾을 d의 최종 성분·크기는 노출하지 않음 | PASS |

### 좌표·해설 독립 확인

- 104-q04 `MN=(1/12)OA+(1/4)OB`, q05 `x+y=6/5`, q06 `AP=3`, q07 `|AB+2AC|=6`, q08 교점의 `m+n=7/15`.
- 105-q01 `BD:DC=5:3`; q02 내심은 `(r,r)`이고 `r=(7−√29)/2`, 정확한 수평·수직 직선 접거리 `r`; q03 `B=(0,0), C=(5,0), A=(1,4√3), I=(2,√3)`, 이때 AB=7·AC=8·BC=5이고 원 반지름 √3.
- 106-q02 `BG=−(2/3)AB+(1/3)AC`; q03 G는 두 중선 위에 있음; q04 `CA=4GM+2GN`; q05 P=(8,15), 원주점 세 개는 같은 중심에서 120° 간격, 위치벡터 합의 길이 51.
- 110-q04 평행사변형 넓이는 독립 계산하면 6√3이나 **문제 그림에는 미표시**. 111-q05 `p=2,q=−1`; 112-q04 `d=(2,4)`, 길이 `2√5`; 모두 원문 보기 정답과 일치.

### 원본 소스 연결 (Git blob SHA-1)

| JS stem 번호 | 원본 SHA | 대상 qid |
| --- | --- | --- |
| 104 | `8fb3789fe71a205de93fa9bd1cf3d636558fbeb1` | 04, 05, 06, 07, 08 |
| 105 | `48d46b326babbc47a7fa89a0bd43c5ca29bda648` | 01, 02, 03 |
| 106 | `38c77b2f806b14fd4e0c1f9453569c745b0b3b88` | 02, 03, 04, 05 |
| 110 | `dae6a08f2af96195389157f3b2d1040ede1c1ee0` | 04 |
| 111 | `9258127ecb9f04825baa1aa7562e6d1f0f7ec096` | 05 |
| 112 | `6e646b26f52d50d607f1a2f77842edb88408fa35` | 04 |

### 엔진 렌더 인계와 다음 번호

- 모든 JSON의 `sourceConditions[].mappedTo`는 실제 노드·표식으로 연결됨. 위 표의 `featureParity=PASS`는 **필수 시각정보의 필드 존재** 판정이고 SVG의 라벨 배치 성공이나 스크린샷 품질을 미리 보장하지 않음.
- 안티그래비티: plan 각각 공식 엔진 렌더 → 생성 SVG·PNG·학생 화면 390px·A4 보기 → 가림/겹침·표식·크기 점검 → 필요 시 엔진 개선/재렌더 → JS 게시. 문제/해설 두 축은 별도 판정·제작으로 후속 처리.
- 이번 배치 이후 다음 미작성 **기하 `117-q01`**. 113~116은 이번 순서상 문제용 `[그림]` 지시가 없으며, 117에는 q01~q03이 있음. 기하 완료 전 미적분II·시험지·유사·교과서·문제집으로 이동하지 않음.
