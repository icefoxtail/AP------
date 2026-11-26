# 2025 연향중 중1 2학기 기말 — SVG 전면 재감사 및 계획

- 대상: `archive/exams/original/middle/m1/2final/25_연향중_2학기_기말_중1_기출.js` (Git blob `c8b983e95fb71d2523a23240a02abf46cabe95f0`, 감사 기준 `origin/main=6dfc578`).
- 실제 23문항, 문제 23축 + 해설 23축 = 46축. 판정: KEEP 35, EXEMPT 10, REPLAN 1.
- 실제 연결 이미지 15개 문제/원본 PNG + 21개 해설 SVG 확인(HTML <img> 내부 참조도 포함). 원본 문제 스캔과 현행 SVG를 래스터화하여 문항별 조건·도형 표식과 1:1 비교하였다.
- SVG 원본이나 기출 JS, 타 학교·타 학년은 변경하지 않았다. 새 파일은 공식 엔진 실행용 계획 JSON뿐이며 수작업 SVG는 없다.
- `DRAWN_FEATURE_PARITY=PASS`는 현행 연결 이미지 또는 신규 plan 필드와 원문 조건의 **정적 1:1 대조**다. 새 SVG 실제 렌더 검증을 뜻하지 않는다.
- 실제 엔진 렌더는 시도했으나 Chrome 미설치로 `ARCHIVE_PREFLIGHT_FAIL`이 발생했다. 학생 화면·A4 인쇄·새 SVG 게시 검수는 `NOT_RUN`; 이를 PASS로 대체하지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 연향/q01 | problem | EXEMPT: 정팔각형의 조건·판정은 발문 자체로 완결 | — | — | NOT_RUN | N/A |
| 연향/q01 | solution | KEEP: 정팔각형 대각선 5개·외각 45°·내부 분할 8개를 각각 분리해 설명 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q02 | problem | KEEP: 원본 85°·95°·120°·x·y 및 교차선 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q02 | solution | KEEP: 해설의 일직선 이웃각 95°/85°와 x·y 호 표식 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q03 | problem | KEEP: 별 다각형 30°·40°·x·y·z 및 교차 구조 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q03 | solution | KEEP: x,180−x,y,z와 30°·40°의 대응 위치 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q04 | problem | EXEMPT: 반원·현·활꼴에 대한 정의 선택지 | — | — | NOT_RUN | N/A |
| 연향/q04 | solution | KEEP: 반원의 부채꼴·활꼴 비교 도식; 색칠은 구별에 사용 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q05 | problem | EXEMPT: 부채꼴 넓이에서 호의 길이 구하는 순수 계산 | — | — | NOT_RUN | N/A |
| 연향/q05 | solution | EXEMPT: 넓이와 호 길이의 비례식만으로 설명 가능 | — | — | NOT_RUN | N/A |
| 연향/q06 | problem | KEEP: 발문 삽입 원 O와 A,B,C,P, 세 호의 분할 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q06 | solution | KEEP: 중심각 40°/120°/200°·호 비 1:3:5 및 보조 현 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q07 | problem | KEEP: 6×8 직사각형 굴림, 대각선10·직선 l·꼭짓점 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q07 | solution | KEEP: 반지름 6/10/8의 90° 원호와 3π·5π·4π 구간 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q08 | problem | KEEP: 정사각형의 원호 경계와 원본 빗금, 2cm 절반 구간 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q08 | solution | KEEP: 필수 색칠 영역·호와 외곽 4cm·절반 2cm가 서로 맞음 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q09 | problem | EXEMPT: 입체도형 성질에 관한 문장 선택지 | — | — | NOT_RUN | N/A |
| 연향/q09 | solution | KEEP: 육각뿔대·정십이면체·정사면체 비교, 면·모서리 설명 유지 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q10 | problem | KEEP: 전개도와 ①~⑤ 회전체 선택도 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q10 | solution | KEEP: 원뿔대 전개도·큰/작은 밑면·옆면과 비교 설명 유지 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q11 | problem | EXEMPT: 육각뿔대 꼭짓점·정십이면체 모서리 수를 글로 제시 | — | — | NOT_RUN | N/A |
| 연향/q11 | solution | KEEP: 육각뿔대 위·아래 6개 꼭짓점, 정십이면체 30개 모서리 구분 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q12 | problem | KEEP: 원뿔 자취 중심 O·반지름3·이동 원 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q12 | solution | KEEP: 모선6·밑면 둘레6π·페인트 원 넓이 관계 표기 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q13 | problem | KEEP: 수직/수평 단면 원과 직사각형, 3cm·8cm 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q13 | solution | KEEP: 두 단면과 높이8·반지름3 일치 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q14 | problem | KEEP: 구 1/8 절단의 세 직각 단면·반지름6 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q14 | solution | KEEP: 남은 구면7/8 및 새 사분원 절단면 세 개 설명 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q15 | problem | KEEP: 두 그릇의 동일 부피, 6·7·4·x cm와 숨은 모서리 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q15 | solution | KEEP: 삼각뿔/삼각기둥 부피 비교와 대응 단면 수선 보존 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q16 | problem | KEEP: 240°의 원기둥 조각, 반지름3·높이6·숨은 원호 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q16 | solution | KEEP: 위아래 부채꼴·곡면·직사각형 면 세 분류 유지 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q17 | problem | KEEP: 표 및 별도 줄기·잎 PNG의 a,b,c 위치 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q17 | solution | KEEP: a=5,b=8,c=7과 각 줄기 원자료 대응 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q18 | problem | EXEMPT: 17번 원자료/도표를 공유하여 문제 축의 별도 그림 없음 | — | — | NOT_RUN | N/A |
| 연향/q18 | solution | KEEP: 실제 크기에서 10·11번째 값 36·38을 정확히 동그라미·순위 표시 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q19 | problem | EXEMPT: 도수분포표는 HTML 표로 이미 제공 | — | — | NOT_RUN | N/A |
| 연향/q19 | solution | EXEMPT: 상대도수 계산으로 충분; 중복 SVG 불필요 | — | — | NOT_RUN | N/A |
| 연향/q20 | problem | KEEP: 일부 찢긴 도수분포다각형·도수 눈금·점선·시간축 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q20 | solution | KEEP: 결손 구간을 고려한 빈도·계급값과 12명 꼭짓점 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q21 | problem | EXEMPT: a+b=35인 다각형 서술 조건은 수식으로 완결 | — | — | NOT_RUN | N/A |
| 연향/q21 | solution | REPLAN: 기존 도식은 꼭짓점 7개·색칠 삼각형 5개지만 실제 n=20, a=17, b=18인 해설과 불일치 | construction-spike-v1 | `q21-solution.plan.json` | PASS/PASS | PASS(20꼭짓점·20변·17대각선·18삼각형) |
| 연향/q22 | problem | KEEP: A,B,C,D,O,P와 48°·호12cm·같은 길이 눈금 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q22 | solution | KEEP: 이등변·외각 관계 116°/16°와 해당 호/보조선 대응 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q23 | problem | KEEP: 서술형 문제에 삽입된 구·원기둥·원뿔 원본 이미지 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 연향/q23 | solution | KEEP: 세 입체의 공통 반지름 r·높이2r·부피 비 대응 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |

## 신규 계획과 필드 1:1 대조
- q21 solution: 발문 `a=n−3, b=n−2, a+b=35`에서 `n=20`. JSON `mathPlan.nodes`의 20개 둘레 점, `displaySegments[0..19]`의 경계 20개, `displaySegments[20..36]`의 꼭짓점 A 대각선 17개가 실제 18개 삼각형을 만든다. `hiddenPointNames`는 점 이름만 숨기고 선은 숨기지 않는다. 도형의 정다각형 배치는 대표 예시이고 발문의 정다각형 가정이 아니다. 면 채움 없음. **PASS**.
- q18 해설은 미리보기에서 숫자 주석이 밀집해 보였으나 **실제 크기 재확인 결과 10·11 순위와 36·38 잎이 정확하고 충분히 읽혀 KEEP**으로 확정했다.
- 모든 연결 원본 PNG·SVG의 수학 의미와 선/라벨/색칠 필요성을 확인했다. 원본 별도 고해상도 시험지 스캔과 독립 비교가 필요한 경우 `EVIDENCE_DEBT`로 남기며, 연결 원본 PNG 자체는 대조하였다.
