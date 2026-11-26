# 25 왕의중 2학기 기말 중1 기출 — 전 24문항 문제/해설 2축 SVG 재설계 감사

- 원문: `archive/exams/original/middle/m1/2final/25_왕의중_2학기_기말_중1_기출.js` (`sha256:f3a51d70663a207c0077163389df5109d7ce548676fcafffb2e82d0b2f68b0c5`), 기준 main `93ba3085473c330fb6043fa527abe70af24f7776`.
- 실증: JS `window.questionBank` 24개를 직접 읽고 `image`, `solutionImage`, 원문 내 `<img>`를 수집. 연결된 문제 PNG/SVG 12개와 해설 SVG 15개 총 27개가 실재하며 축별 원본/현행 자산을 contact-sheet로 대조하였다. 사용된 추가 원시 고해상도 스캔의 별도 대조는 `EVIDENCE_DEBT`.
- 판정: 48축 중 **KEEP 25 / EXEMPT 21 / REPLAN 2**. KEEP은 현행 자산의 학생용 조건이 보존되어 새 엔진 plan을 불필요하게 만들지 않는다는 의미다. EXEMPT는 원문 텍스트·표만으로 충분하며 새 시각자료가 결정적 가치를 더하지 않는 축이다.
- `DRAWN_FEATURE_PARITY`는 **신규 plan이 갖춘 실제 도형 렌더 필드와 JS·원본 에셋의 조건을 독립 비교한 정적 판정**이다. 최종 엔진 SVG/PNG, 휴대폰, A4, 실제 JS 자산 연결과 게시 검수는 별개이며 `NOT_RUN`. 기존 자산은 `MAINTAINED`(시각 대조), 무그림 축은 `N/A`로 기록한다. `PASS`를 실제 제작 완료로 오인하지 않는다.
- 이 플랜 묶음은 원본 JS·기존 SVG/PNG를 수정하지 않는다. 엔진 그림의 생성을 손으로 대체하지 않는다. 연관된 source/plan `mappedTo`의 **25/25 경로가 실재**한다(전체 두 학교 48/48).

| 파일/qid | 축 | 기존 결함/판정 · 원본 에셋 대조 근거 | capability | 실제 plan 경로 | shallow / full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 왕의/q01 | 문제 | KEEP: `q1.png` 원본 삼각형·AD 이등분 눈금과 30°/70° 유지 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q01 | 해설 | KEEP: `q1-solution-v2.svg` AD 이등분 두 호·40° 두 개·x·B/C 표기 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q02 | 문제 | KEEP: `q2.png` 육각형·오른쪽 53°/왼쪽 48° 바깥각, 111°/108°/112° 내각·연장선 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q02 | 해설 | **REPLAN**: `q2-solution.svg` 육각형 내부를 회색으로 불필요하게 전면 채움. 회색 제거 + 6변·연장선 2·내외각 호 8개를 실제 plan 필드에 복원 | `construction-spike-v1` | `q02-solution.plan.json` | PASS / PASS | **PASS (static)** |
| 왕의/q03 | 문제 | EXEMPT: 다각형 옳고 그름 문자 선택지·정의 문제 | — | — | N/A | N/A |
| 왕의/q03 | 해설 | EXEMPT: 대각선 개수 공식·정다면체가 아닌 다각형 명제 참거짓 정리 | — | — | N/A | N/A |
| 왕의/q04 | 문제 | KEEP: `q4.png` 원 O, A/B/C/D/E, 세 호의 같은 길이 눈금과 현·반지름 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q04 | 해설 | KEEP: `q4-solution-v2.svg` 같은 중심각·같은 현 눈금, 비교하는 두 삼각형을 구별하는 국소 색영역은 개념 설명에 필요 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q05 | 문제 | EXEMPT: 정다각형 외각 40°→9각형, 대각선 공식으로 해결 | — | — | N/A | N/A |
| 왕의/q05 | 해설 | EXEMPT: n=9, n(n−3)/2=27 대수 계산 | — | — | N/A | N/A |
| 왕의/q06 | 문제 | EXEMPT: 정다면체 성질에 관한 다섯 문자 선택지 | — | — | N/A | N/A |
| 왕의/q06 | 해설 | EXEMPT: 정다면체 면·모서리·꼭짓점 정의로 선택지 판별 | — | — | N/A | N/A |
| 왕의/q07 | 문제 | EXEMPT: 내각합 2340°인 정다각형 외각 크기 공식 | — | — | N/A | N/A |
| 왕의/q07 | 해설 | EXEMPT: 15각형·외각 24° 공식의 수치 계산 | — | — | N/A | N/A |
| 왕의/q08 | 문제 | KEEP: `q8.png` 정사각형 한 변 5cm, 꼭짓점 호와 경계의 원본 빗금 영역 유지 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q08 | 해설 | KEEP: `q8-solution-v2.svg` 원호·정삼각형 보조점 P/Q, 30°/60°와 실제 둘레 호 색을 구분함. 색은 둘레 구분에 필요한 선 강조 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q09 | 문제 | EXEMPT: 각 다면체의 면 개수 비교 문자 선택지 | — | — | N/A | N/A |
| 왕의/q09 | 해설 | EXEMPT: 정팔면체 8, 정사면체 4 등 면 개수 산술 | — | — | N/A | N/A |
| 왕의/q10 | 문제 | EXEMPT: 회전축에 수직인 단면이 항상 합동인 회전체의 이름 선택 | — | — | N/A | N/A |
| 왕의/q10 | 해설 | KEEP: `q10-solution.svg` 원기둥·원뿔 낮은/높은 단면 4개, 높이 따른 단면 반지름 비교를 위해 작은 단면의 색은 허용 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q11 | 문제 | KEEP: `q11.png` 지름10cm 구의 4등분 입체와 절단면 경계·직각 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q11 | 해설 | KEEP: `q11-solution-v2.svg` 곡면 1/4과 반원 두 면을 분리해 국소 색으로 면적 25π+25π를 설명 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q12 | 문제 | KEEP: `q12.png` 원뿔의 뒤쪽 밑원 점선·모선 12cm 치수선 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q12 | 해설 | **REPLAN**: `q12-solution-v2.svg`의 전개도 부채꼴·밑원 전면 회색 채움이 불필요. 원뿔과 반원형 부채꼴+원판을 무채움 2패널로 재구성, 12cm/6cm/180° 실표기 | `composite-panels-v1` + `solid-figure-v1` | `q12-solution.plan.json` | PASS / PASS | **PASS (static)** |
| 왕의/q13 | 문제 | KEEP: `q13.png` 원기둥 안 구 3개, 윗면/아랫면 접촉과 원의 겹침 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q13 | 해설 | KEEP: `q13-solution-v2.svg` 내부 3구와 점선 숨은 원·반지름 r·높이 6r 관계 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q14 | 문제 | KEEP: `q14.png` 정육면체 안 삼각뿔, 숨은 모서리 점선과 절단 평면 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q14 | 해설 | KEEP: `q14-solution.svg` 직각삼각형 밑면과 높이 a·3D 보조 모서리, 밑면만 국소 강조 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q15 | 문제 | EXEMPT: 두 음식점의 평점 표/열거된 자료, 데이터 외 별도 도형 불필요 | — | — | N/A | N/A |
| 왕의/q15 | 해설 | EXEMPT: 정렬·평균·중앙값·최빈값 계산이 문장으로 완결됨 | — | — | N/A | N/A |
| 왕의/q16 | 문제 | EXEMPT: 자유투 10명 원시 자료가 숫자로 직접 주어짐 | — | — | N/A | N/A |
| 왕의/q16 | 해설 | EXEMPT: 평균6·중앙값7·최빈값8의 정렬 계산 | — | — | N/A | N/A |
| 왕의/q17 | 문제 | EXEMPT: 원문 본문에 줄기·잎 데이터가 이미 텍스트 표로 제시됨 | 원문 HTML/표 | — | N/A | N/A |
| 왕의/q17 | 해설 | KEEP: `q17-solution.svg` 줄기별 잎 개수 3/4/5/6/4, 중간값 74·76에 동그라미 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q18 | 문제 | EXEMPT: 주어진 줄기·잎과 도수분포표 내용이 원문 텍스트로 존재 | 원문 HTML/표 | — | N/A | N/A |
| 왕의/q18 | 해설 | KEEP: `q18-solution-v2.svg` 계급별 4/6/5/3/2 실제 셈·세로 묶음으로 값 대응 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q19 | 문제 | KEEP: `q19.png` 찢긴 히스토그램과 5분 간격 축·계급 범위 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q19 | 해설 | KEEP: `q19-solution.svg` 25–30분 사라진 막대(10명)·나머지 3/5/6/11/5와 계급별 합 구분 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q20 | 문제 | KEEP: `q20-problem-geometry-20261116.svg` 두 반의 100m 기록 꺾은선, O·축·실선/점선과 누락 도수 없음 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q20 | 해설 | KEEP: `q20-solution-geometry-20261116.svg` 필요한 집단 도수와 16% 비교 선, 축과 라벨 원본 조건과 일치 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q21 | 문제 | KEEP: `q21.png` 색칠 고리꼴 부채꼴, O·A/B/C/D와 45°·8cm·4cm | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q21 | 해설 | KEEP: `q21-solution-v2.svg` 문제에서 요구한 영역만 빗금, 8cm+4cm·두 호의 둘레 수치 표시 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q22 | 문제 | KEEP: `q22.png` 축 l, 사분원 반지름 6cm, 원호와 현의 빗금 친 활꼴·직각 | 기존 PNG | — | N/A | MAINTAINED |
| 왕의/q22 | 해설 | KEEP: `q22-solution-v2.svg` 사분원·직각·현 및 빗금 영역 유지, 반구−원뿔 회전 관계 설명 | 기존 SVG | — | N/A | MAINTAINED |
| 왕의/q23 | 문제 | EXEMPT: 점수 48,14,64,42,x가 본문에 수치로 주어짐 | — | — | N/A | N/A |
| 왕의/q23 | 해설 | EXEMPT: (168+x)/5=x의 정수 산술식 해결 | — | — | N/A | N/A |
| 왕의/q24 | 문제 | EXEMPT: 통학 거리 상대도수 표가 본문에 수치로 완비 | 원문 HTML/표 | — | N/A | N/A |
| 왕의/q24 | 해설 | EXEMPT: 0.16·전체 300명·8km 이상 합을 표로 계산 | — | — | N/A | N/A |

## 변경 plan의 실제 그리기 필드 1:1 점검

| plan | 원문·자산에서 확인한 필수 정보 | 실제 렌더 필드 / 독립 수학 판정 | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- |
| `q02-solution.plan.json` | 육각형 변 6, 외각 48°/53°, 내각 111°/108°/112° 및 이웃 내각 132°/127°와 미지 x | `displaySegments` 6변+2 연장선, `planeMarks.angles` 8행, 48+132=180·53+127=180, 6내각 합720·x=130, 면 채움 없음. 원본에 없는 A–H 이름은 실제 표시하지 않음 | **PASS (static)** |
| `q12-solution.plan.json` | 원뿔 모선 12, 밑면 r=6, 전개도 옆면 180° 부채꼴과 밑원 | `panels[0].plan.solids[0]` radius6/height√108, `dims` slant12/radius6; `panels[1].plan.net` radius6/slant12 + `dims` angle180 (360×6/12). `highlights`·`regions` 없음 | **PASS (static)** |

## 출고 분리

- 공식 검사 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <2 plans>` 및 full `<2 plans>`: **둘 다 2/2 PASS**, Git 동일 main 판본의 정식 엔진·고정 폰트 SHA256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`로 실행.
- 원문 이미지 에셋 원본과 현행 연결 27/27, 지정한 문항의 조건 mapping 25/25 경로 실재. 변경 대상은 plan JSON만이고 손 SVG는 0.
- `render-plan.mjs`의 실제 Chrome 렌더, PNG 육안·학생 브라우저·모바일·A4·JS `solutionImage` 교체·배포는 `NOT_RUN`. Chrome 배포본이 없는 환경에서 엔진 출력 화면이 완성되었다고 주장하지 않으며 **기존 SVG는 실제로 그대로 남아 있다**.
- `ENGINE_CAPABILITY_PENDING`: **0건**(이 2개 플랜은 기존 공식 capability만 사용). 미지원으로 실물을 대신하지 않는다.
