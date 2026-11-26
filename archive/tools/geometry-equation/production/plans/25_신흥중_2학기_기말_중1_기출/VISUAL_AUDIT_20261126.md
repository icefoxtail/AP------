# 2025 신흥중 중1 2학기 기말 — SVG 전수 시각 재감사

- 원본: `archive/exams/original/middle/m1/2final/25_신흥중_2학기_기말_중1_기출.js` (Git blob `e7f146729a388c4314557eca0437ace9328e602b`)
- 범위: 실제 22문항, 문제 22축 + 해설 22축 = 44축. 대상 JS와 기존 모든 SVG·PNG는 변경하지 않음.
- 확인: 전 문항 발문/해설과 실제 연결 SVG 1:1 확인, 문제/해설 40개 이미지를 래스터화해 접촉 시트와 개별 필요 축을 직접 관찰. 일부 원본 `<ns0:svg>` 7개는 SVG 뷰어 호환 때문에 검사용 **메모리 내부에서만** 표준 namespace로 정규화하여 래스터화했다. 이 작업으로 저장소 자산을 재작성/교체하지 않음.
- `EVIDENCE_DEBT`: 별도의 원본 스캔 PNG가 이 저장소에서 확인되지 않으므로 원본 스캔과의 직접 픽셀 차이는 미검증. 현행 연결 SVG/발문과 수학적 조건의 정확성은 별도 확인. PC·휴대폰·A4 실제 학생 화면 검수는 `NOT_RUN`.
- `REPLAN`은 공식 엔진 plan으로 수정 예정, `KEEP`은 학생용 정보가 보존된 현행 그림, `EXEMPT`는 해당 축의 그림이 불필요하거나 중복. `DRAWN_FEATURE_PARITY=PASS`는 신규 plan의 필드 대조로서 실제 SVG 렌더 완료가 아니다.

| 파일/qid | 축 | 기존 결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 신흥/q01 | problem | EXEMPT: 원·부채꼴 개념 설명 선택지 | — | — | NOT_RUN | N/A |
| 신흥/q01 | solution | KEEP: 중심각·호·반원 개념별 비교 도식 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q02 | problem | KEEP: 원 O, ∠AOB 60°, ∠COD 20° 및 A,B,C,D 라벨 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q02 | solution | REPLAN: 세 개 작은 패널·면 채움 대신 두 중심각과 두 현을 한 원에 통합 | construction-spike-v1 | `q02-solution.plan.json` | PASS/PASS | PASS(원·각·현 1:1) |
| 신흥/q03 | problem | KEEP: 반원, AD∥OC, 36°, 호 AD=24cm 표기 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q03 | solution | REPLAN: 불필요한 두 회색 부채꼴 제거; 평행 표식·36/108/36°·24cm 유지 | construction-spike-v1 | `q03-solution.plan.json` | PASS/PASS | PASS(각·평행·호 1:1) |
| 신흥/q04 | problem | KEEP: 차집합 부채꼴의 색칠은 문제의 넓이/둘레 구분에 필요, 4cm·8cm·45° | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q04 | solution | KEEP: 반지름·호의 길이와 구할 경계 표시 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q05 | problem | KEEP: 직사각형 ABCD, 부채꼴 ABE, AB=6cm와 두 색칠 영역 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q05 | solution | KEEP: 같은 넓이의 두 영역과 겹침 S의 관계 비교 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q06 | problem | EXEMPT: 다면체 선택지 자체가 구성 설명 | — | — | NOT_RUN | N/A |
| 신흥/q06 | solution | KEEP: 면·꼭짓점의 수를 확인하는 다면체 비교 패널 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q07 | problem | EXEMPT: 정다면체 정의·성질을 문장으로 제시 | — | — | NOT_RUN | N/A |
| 신흥/q07 | solution | KEEP: 정다면체 모서리·면 수의 위치 설명 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q08 | problem | EXEMPT: 회전체의 성질 선택지 | — | — | NOT_RUN | N/A |
| 신흥/q08 | solution | KEEP: 원기둥·구·원뿔의 회전 단면 비교 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q09 | problem | KEEP: 삼각기둥의 3/4/5cm 삼각형, 길이 6cm와 숨은 모서리 점선 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q09 | solution | KEEP: 전개도 5×6/4×6/3×6 직사각형과 삼각형 두 개 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q10 | problem | KEEP: 반구 2개+원기둥, 반지름 4cm, 원기둥 높이 6cm | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q10 | solution | KEEP: 원기둥 옆면과 구의 곡면 계산을 분리한 패널 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q11 | problem | KEEP: 사각뿔 높이 4cm+사각기둥 높이 3cm, 밑면 한 변 6cm | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q11 | solution | KEEP: 부피 계산의 두 부분·수선 관계 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q12 | problem | KEEP: 원기둥 안에 구 2개 접촉·지름 6cm | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q12 | solution | KEEP: 두 구와 원기둥의 부피 비교 도식 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q13 | problem | KEEP: 구를 꺼낸 원기둥의 물 높이 4cm, 액면만 옅게 채움 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q13 | solution | KEEP: 구의 부피와 물 높이 비의 단면 비교 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q14 | problem | KEEP: 줄기 0~4의 잎 6/8/4/1/1개, 총 20개 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q14 | solution | REPLAN: 기존 줄마다 겹친 순위·동그라미 제거, 큰 쪽 10번째 잎만 정확히 강조 | stat-chart-figure-v1 | `q14-solution.plan.json` | PASS/PASS | PASS(20값·순위 1:1) |
| 신흥/q15 | problem | KEEP: 0~25장 5장 계급, 3/?/?/14/2·합계 30명 보존 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q15 | solution | REPLAN: 두 미상 계급을 빈 칸으로 보여 준 불명확성, ?와 9/21명 묶음 표기로 보강 | stat-chart-figure-v1 | `q15-solution.plan.json` | PASS/PASS | PASS(계급·도수·미상·70% 1:1) |
| 신흥/q16 | problem | KEEP: 7계급 히스토그램 2/5/8/4/2/3/1명 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q16 | solution | KEEP: 20km 미만 7명과 큰 쪽 4번째 포함 계급 강조 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q17 | problem | KEEP: 도수 2/3/5/6/4, 각 계급의 중간값 점 연결 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q17 | solution | KEEP: 5번째 큰 기록은 30~40계급·도수 6명 표시 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q18 | problem | KEEP: A/B 학교 상대도수 두 꺾은선과 실선·점선 구별 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q18 | solution | KEEP: A의 20시간 이상 상대도수 0.30 관계 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q19 | problem | KEEP: 한 변 10cm 정사각형의 두 사분원 교집합만 채움 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q19 | solution | REPLAN: 렌즈 바깥 두 모서리의 불필요한 회색 면 채움 제거 | construction-spike-v1 | `q19-solution.plan.json` | PASS/PASS | PASS(두 호·렌즈·10cm 1:1) |
| 신흥/q20 | problem | KEEP: 정삼각형 10개로 구성된 이중뿔의 숨은 모서리 점선 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q20 | solution | KEEP: 위·아래/가운데 꼭짓점에 모인 5·4개 면 구분 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q21 | problem | KEEP: 회전축 l과 윗변 4cm·밑변 8cm·빗변 9cm | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q21 | solution | KEEP: 회전체의 원뿔대/원뿔 차분 설명 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q22 | problem | KEEP: 원자료 7,15,11,114,5,5,13,10,8,12를 표에 그대로 표시 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 신흥/q22 | solution | KEEP: 114 큰 값의 축 생략 기호와 도수점, 대표값 비교 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |

## 변경 plan별 실제 그려지는 필드 대조

| qid·축 | 원문/현행 자산에서 필요한 시각 정보 | JSON의 엔진 그림 필드 | 판정 |
|---|---|---|---|
| q02 solution | O 중심의 같은 원, AOB 60°, COD 20°, 현 AB·CD | `displayCircles`, `displaySegments`, `planeMarks.angles[0..1]`; 영역 채움 없음 | PASS |
| q03 solution | 반원 위 A-D-C-B, AD∥OC, DAO/ADO/BOC=36°, AOD=108°, 호 AD=24cm | `planeMarks.arcs[0..1]`, `angles[0..3]`, `parallels[0]`; 실제 길이 미상이라 반지름은 대표축척 | PASS(대표 도식 명시) |
| q14 solution | 잎 20개(0줄 6,1줄 8,2줄 4,3줄 1,4줄 1), 10번째로 큰 12권 | `chart.values`, `marks[0].rank=11`, `rankLabels:FROM_LARGEST` | PASS |
| q15 solution | 계급 [0,5,10,15,20,25], [3,?, ?,14,2], 합 30, 10장 이상 70%=21명 | `chart.boundaries`, `series[0].frequencies`, `unknownLabels`, `classSums` | PASS |
| q19 solution | 정사각형 10cm, 중심이 다른 90° 호 두 개, 겹친 렌즈만 색칠 | `displaySegments`, `planeMarks.arcs`, `regions[0].shapes[0].loop`, `dimensions[0]` | PASS |

- 공식 검사: 위 5개 모두 `plan-lint.cjs --shallow` 및 full `PASS`. 정확한 NotoSansKR.ttf SHA256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`와 공식 runtime 의존성에서 검증. 엔진 산출 SVG·PNG·학생 화면·A4 검수와 JS 연결·게시 여부는 별도 `NOT_RUN`.
- 본 수정에서 원래 JS에 없던 수치·구하려는 값은 문제 그림에 노출하지 않음. 모든 변경은 해설 축의 계획만 생성한다.
