# 25 팔마중 2학기 기말 중1 기출 — 전 24문항 문제/해설 2축 SVG 재설계 감사

- 원문: `archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js` (`sha256:97adbc97cb254aa121ad4ee5b783d482de6f0a2008f437bd0d31e0d08e36333a`), 기준 main `93ba3085473c330fb6043fa527abe70af24f7776`.
- JS 24개 전수, 문제 `image`/inline 원본 PNG·SVG 21개, 해설 `solutionImage` 17개 합계 **38개 실제 자산** 존재. contact-sheet의 원본 문제 스캔과 현재 해설 SVG를 직접 비교했다. 별도 고해상도 스캔 독립 재인식은 `EVIDENCE_DEBT`.
- 판정: 48축 중 **KEEP 36 / EXEMPT 10 / REPLAN 2**. KEEP은 원본 시각조건이 유지된 기존 운영 자산이며, 엔진 표식의 부재나 원본의 스캔 형태만으로 무리하게 다시 만들지 않았다. EXEMPT에는 각 축의 텍스트·표만으로 충분한 이유를 적었다.
- 새 plan의 `DRAWN_FEATURE_PARITY=PASS (static)`은 원문 조건 각각에 해당하는 **실제로 그려지는** 엔진 필드를 확인한 결과이지 아직 SVG를 렌더하거나 게시한 증거가 아니다. 전체 렌더·PNG·학생 UI·휴대폰·A4·JS 연결은 `NOT_RUN`. 현행 자산은 `MAINTAINED`, 면제축은 `N/A`.
- 이 PR에서 손으로 쓴 SVG·PNG, 원본 JS·자산 수정은 **0개**다. 두 plan의 조건 23개 `mappedTo`는 실제 객체 필드에 모두 연결된다(두 학교 48/48).

| 파일/qid | 축 | 기존 결함/판정 · 원본 에셋 대조 근거 | capability | 실제 plan 경로 | shallow / full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 팔마/q01 | 문제 | EXEMPT: 오각기둥의 모서리·꼭짓점 수가 문자로 제시되어 그림 없이 해결 가능 | — | — | N/A | N/A |
| 팔마/q01 | 해설 | KEEP: `q1-solution.svg` 오각기둥 꼭짓점 10개/모서리 15개와 숨은 모서리 점선·번호를 연결 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q02 | 문제 | KEEP: `q2.png` 한 원 안의 20°/140°/y° 중심각 및 1cm/4cm/x cm 원호·지시선 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q02 | 해설 | KEEP: `q2-solution-v2.svg` 각도 호·호 길이 1/4/xcm, 중심 O, x+y 산술에 필요한 대응관계 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q03 | 문제 | KEEP: `q3.png` 반지름6cm, 서로의 중심을 지나는 두 원 O/O′, A/B와 실제 색칠 영역 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q03 | 해설 | KEEP: `q3-solution.svg` 두 원과 60°·A/B·중심거리6·호 2π의 표시. 좁은 삼각형 영역 채움은 원본의 구하는 경계를 설명 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q04 | 문제 | KEEP: `q4.png` 정다면체를 특정하는 네 조건과 가~라 문장이 원본 표 안에 온전히 있음 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q04 | 해설 | EXEMPT: 각 정다면체의 a+b 값(6,7,7…)을 문장으로 비교하는 순수 셈 | — | — | N/A | N/A |
| 팔마/q05 | 문제 | EXEMPT: 회전체 성질에 대한 다섯 문자 선택지의 참/거짓 구별 | — | — | N/A | N/A |
| 팔마/q05 | 해설 | KEEP: `q5-solution.svg` 원뿔·원뿔대의 회전축 수직 단면을 가는 점선·높이·반지름으로 비교 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q06 | 문제 | KEEP: `q6.png` 반원기둥 앞·뒤 반원, 지름6cm·축 방향 12cm와 숨은 모서리 점선 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q06 | 해설 | **REPLAN**: `q6-solution-v2.svg`의 반원·두 직사각형 전체에 불필요한 회색 면색. 반원 두 장/12×6/12×3π를 채움 없는 세 윤곽선 패널 + 치수선으로 재구성 | `composite-panels-v1` + `construction-spike-v1` | `q06-solution.plan.json` | PASS / PASS | **PASS (static)** |
| 팔마/q07 | 문제 | KEEP: `q7.png` 오른쪽 직각·3/4/5cm와 왼쪽 보조선 4cm 및 사각기둥 높이6cm(발문) | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q07 | 해설 | KEEP: `q7-solution-v2.svg` 두 밑면 삼각형의 6cm²·10cm² 비교, 직각 및 3/4/5/4cm 치수 보존. 면색은 합치는 두 영역 구별에 한정 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q08 | 문제 | KEEP: `q8.png` 정육면체 A,C,F 절단면·xcm와 숨은 내부 모서리 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q08 | 해설 | KEEP: `q8-solution.svg` 정육면체 내 잘린 삼각뿔 B-ACF와 3D 점선·직각 관계 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q09 | 문제 | KEEP: `q9.png` 반구 두 개+원기둥, 반지름3cm·기둥 높이5cm와 뒤 원호 점선 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q09 | 해설 | KEEP: `q9-solution.svg` 반구 2개=구(r3), 원기둥(r3,h5)을 실제 입체 윤곽과 함께 구분 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q10 | 문제 | KEEP: `q10.png` 이등변삼각형 ABC의 꼭짓각 30°, 반원 지름24cm, D/E/O와 음영 부채꼴 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q10 | 해설 | KEEP: `q10-solution-v2.svg` OA/OD 등변관계의 길이눈금, 75°/30°/120° 호와 실제 물어본 DOE 부채꼴만 채움 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q11 | 문제 | KEEP: `q11.png` 정사각형 ABCD, 3cm 두 변과 잘린 사분원·회전축 CD의 점선 표시 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q11 | 해설 | KEEP: `q11-solution-v2.svg` 안쪽 둥근 곡면을 원기둥 겉면과 분리하는 회전영역만 색칠하고 반구/옆면/밑면 넓이를 구분 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q12 | 문제 | KEEP: `q12.png` 데이터 5/6/8/10/7이 원본 상자에 읽히게 존재 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q12 | 해설 | EXEMPT: 5,6,7,8,10 정렬 뒤 중앙값7을 수치로 직접 결정 | — | — | N/A | N/A |
| 팔마/q13 | 문제 | KEEP: `q13.png` 통계 정의 ㄱ~ㅁ 원본 문자 선택지를 스캔 표로 제공 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q13 | 해설 | EXEMPT: 평균·최빈값·중앙값 성질에 대한 문자 명제 판정 | — | — | N/A | N/A |
| 팔마/q14 | 문제 | KEEP: `q14.png` 원본 줄넘기 기록 줄기/잎 0~4단계 25개 모두 보존 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q14 | 해설 | KEEP: `q14-solution-v2.svg` 줄기별 4/6/7/5/3 셈과 5/36/45 동그라미를 정확한 잎 자리로 연결 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q15 | 문제 | KEEP: `q15.png` 키 도수분포표의 130~180 구간·전체30명과 알려진 도수 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q15 | 해설 | EXEMPT: 160cm 이상 9명 중 170cm 이상 2명을 빼는 정수 계산 | — | — | N/A | N/A |
| 팔마/q16 | 문제 | KEEP: `q16.png` 찢긴 40~45m 막대와 계급별 30/35/40/45/50/55 축 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q16 | 해설 | KEEP: `q16-solution.svg` 복원한 40~45m의 9명 막대가 주변 3/6/5/2와 구별되고 범위·눈금이 보존됨 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q17 | 문제 | KEEP: `q17-problem-geometry-20261116.svg` 두 성별 도수분포다각형·점·실선/점선 구분과 O·축 수치 완비 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q17 | 해설 | KEEP: `q17-solution-v2.svg` 120회 이상 남학생 2명, 100~120회 5명 등의 누적을 점 표식으로 설명 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q18 | 문제 | KEEP: `q18.png` TV시청 상대도수 0.15/0.30/0.20/0.10 포함 표 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q18 | 해설 | EXEMPT: 빠진 0.25×40=10명 단순 상대도수 표 계산 | — | — | N/A | N/A |
| 팔마/q19 | 문제 | KEEP: `q19.png` 찢긴 도수분포다각형, 9~17시간 축·부분 꺾은선 보존 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q19 | 해설 | KEEP: `q19-solution.svg` 복원한 13~15시간 결측 구간을 도수 14/전체35명과 결합해 표시 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q20 | 문제 | EXEMPT: 총도수 6:5·부분도수 4:3의 비 비교 문자 문제 | — | — | N/A | N/A |
| 팔마/q20 | 해설 | EXEMPT: 상대도수 비 (4/6):(3/5)=10:9의 식 계산 | — | — | N/A | N/A |
| 팔마/q21 | 문제 | KEEP: `q21.png` 회전축 l, 사다리꼴 AD=5, BC=2, CD=4, AB=5 및 직각표식 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q21 | 해설 | **REPLAN**: `q21-solution-v3.svg` 세 장의 세로 그림에 과밀한 수치·작은 캡션, A4/학생 화면 축소 시 전개도·축단면 이해 저하. 전개도와 축단면을 2패널로 확대, 5/2 원반·모선5, 지름10/4·높이4의 수선·직각 | `composite-panels-v1` (`solid-figure-v1` + `construction-spike-v1`) | `q21-solution.plan.json` | PASS / PASS | **PASS (static)** |
| 팔마/q22 | 문제 | KEEP: `q22.png` 반지름3cm 구의 중심 통과 수직 3회 절단 묘사·대원 경계 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q22 | 해설 | KEEP: `q22-solution-v2.svg` 반구 두 개 및 8조각 구의 절단면·반지름3을 구별하는 국소 색면은 계산상 필요한 새 단면을 가리킴 | 기존 SVG | — | N/A | MAINTAINED |
| 팔마/q23 | 문제 | KEEP: `q23.png` 8개의 숫자 자료 5/8/14/x/2/5/14/11 원본 박스 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q23 | 해설 | EXEMPT: x=5·정렬·최빈값/중앙값 산술 | — | — | N/A | N/A |
| 팔마/q24 | 문제 | KEEP: `q24.png` A/B 두 반 도수분포다각형, 점·축·군 이름과 45~105점 범위 | 기존 PNG | — | N/A | MAINTAINED |
| 팔마/q24 | 해설 | KEEP: `q24-solution-v2.svg` A solid (3,6,7,3,1), B dashed (1,5,8,4,2); 원본의 점별 1:1 대응·상위 2명/6명 안내선 | 기존 SVG | — | N/A | MAINTAINED |

## 신규 plan의 1:1 수학·그림 검수

| plan | 원본 조건·기존 결함 | 엔진에서 실제 그리는 객체 | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- |
| `q06-solution.plan.json` | 지름6, 반원 두 장, 반원기둥 높이12. 반원곡면 폭은 πr=3π, 전체 평면은 12×6. 기존 SVG는 모든 면이 회색 | `panels[0]` 원호 `planeMarks.arcs[0]` + 지름6 치수, `panels[1]` 직사각형과 12/6 치수, `panels[2]` 직사각형과 12/3π 치수. 원호 곡면의 대표 높이 9.42478은 3π의 수치 근사(약 2.0e-6 차)이며 길이의 의미·기호는 그대로. 전 패널 `regions`·면 `fill` 없음 | **PASS (static)** |
| `q21-solution.plan.json` | 원본 AD5/BC2/AB5/CD4, 축 l을 도는 원뿔대, 전개도와 축단면 필수. 기존 3패널 축소 문제 | `panels[0].plan.net` CONE_FRUSTUM radius5/topRadius2/slant5, 두 원과 고리형 부채꼴 + 호 길이/반지름 치수 다섯 개; `panels[1]` 4변 사다리꼴, 높이 점선 2개, `rightAngles` 실제 직각, `dimensions` 상지름10/하지름4/높이4. √((5−2)²+4²)=5, 축단면 넓이 (10+4)/2×4=28 독립 확인. 불필요한 채움 없음 | **PASS (static)** |

## 검사와 미완료 분리

- 공식 `plan-lint.cjs --shallow` **2/2 PASS**, full **2/2 PASS** (공식 고정 폰트 SHA256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 및 공식 엔진 의존성). 정적 원문→조건→그리기 필드 대조 및 `mappedTo` 경로 **23/23**.
- 원본 PNG 및 현행 해설 SVG **38/38** 존재·육안 확인. 사진의 원시 고해상도 원본과는 별도 `EVIDENCE_DEBT`.
- `render-plan.mjs` Chrome 실제 렌더, 신규 그림 실물·학생 화면·A4·JS 링크 교체·배포 **NOT_RUN**. 따라서 **현재 학생용 SVG는 구버전 그대로**이며 계획만 운영 `main`에 들어갈 수 있다.
- `ENGINE_CAPABILITY_PENDING`: 0건. 두 plan은 현재 지원되는 `construction-spike-v1`·`solid-figure-v1`·`composite-panels-v1`의 렌더 필드만 사용한다.
