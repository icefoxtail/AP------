# 2025 왕운중 중1 2학기 기말 — SVG 전면 재감사 및 계획

- 대상: `archive/exams/original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js` (Git blob `4defe464a4586adcf1b27a831994e819d9c60785`, 감사 기준 `origin/main=6dfc578`).
- 실제 24문항, 문제 24축 + 해설 24축 = 48축. 판정: KEEP 33, EXEMPT 13, REPLAN 2.
- 실제 연결 이미지 17개 문제/원본 PNG + 18개 해설 SVG 확인(HTML <img> 내부 참조도 포함). 원본 문제 스캔과 현행 SVG를 래스터화하여 문항별 조건·도형 표식과 1:1 비교하였다.
- SVG 원본이나 기출 JS, 타 학교·타 학년은 변경하지 않았다. 새 파일은 공식 엔진 실행용 계획 JSON뿐이며 수작업 SVG는 없다.
- `DRAWN_FEATURE_PARITY=PASS`는 현행 연결 이미지 또는 신규 plan 필드와 원문 조건의 **정적 1:1 대조**다. 새 SVG 실제 렌더 검증을 뜻하지 않는다.
- 실제 엔진 렌더는 시도했으나 Chrome 미설치로 `ARCHIVE_PREFLIGHT_FAIL`이 발생했다. 학생 화면·A4 인쇄·새 SVG 게시 검수는 `NOT_RUN`; 이를 PASS로 대체하지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 왕운/q01 | problem | KEEP: A,B,C,D,E와 원본 45°·55°·120° 및 x 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q01 | solution | KEEP: 일직선의 이웃각·60°·65°·115°·최종 20° 구조 확인 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q02 | problem | EXEMPT: 다각형 내각합 900°만 주어진 계산형 | — | — | NOT_RUN | N/A |
| 왕운/q02 | solution | KEEP: 7각형의 다섯 삼각형 분할·180°씩 표기; 색칠은 분할 구별 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q03 | problem | KEEP: 정육각형·정오각형 겹침과 x·y 위치 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q03 | solution | KEEP: 두 정다각형의 방향 차·108°/120° 보조각이 실제 교점에 놓임 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q04 | problem | KEEP: 서로의 중심 지나는 두 원 O,O′와 A,B, 반지름3 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q04 | solution | REPLAN: 두 해설 패널의 불필요한 교집합 파란 면 채움을 없애고 120° 중심각·호2π를 한 그림에 직접 표시 | construction-spike-v1 | `q04-solution.plan.json` | PASS/PASS | PASS(두 원·두 중심·두 120°·각 2π) |
| 왕운/q05 | problem | KEEP: 정사각형 한 변6·교점 E·색칠한 둘레 경계 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q05 | solution | KEEP: AE=BE=AB 및 호 두 개, 색칠은 요구된 영역 구별에 필요 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q06 | problem | KEEP: 원 O, A/B/C, 선분·호·중심각 같음 조건 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q06 | solution | KEEP: 중심각 θ·2θ와 현의 같은 길이 표식·면적 비교 영역 보존 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q07 | problem | EXEMPT: 다면체 정의·회전체 성질에 관한 진술형 | — | — | NOT_RUN | N/A |
| 왕운/q07 | solution | EXEMPT: 정의 판정은 그림 없이 설명 완료 | — | — | NOT_RUN | N/A |
| 왕운/q08 | problem | EXEMPT: 정팔각형 면의 정다면체 존재 가능성 문장 | — | — | NOT_RUN | N/A |
| 왕운/q08 | solution | KEEP: 135° 내각 3개=405°와 360° 초과를 비교하는 각 표식 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q09 | problem | KEEP: 직사각형 8×10, 회전축 CD·직각 표시 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q09 | solution | KEEP: 원기둥 반지름8·높이10과 수직 단면 구별 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q10 | problem | EXEMPT: 평균·중앙값 수열이 글로 제시 | — | — | NOT_RUN | N/A |
| 왕운/q10 | solution | EXEMPT: 대입·정렬 계산 외 그림 정보 없음 | — | — | NOT_RUN | N/A |
| 왕운/q11 | problem | KEEP: 반구 반지름r와 원기둥 2r×3r 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q11 | solution | KEEP: 두 부피 비교의 같은 치수·숨은 원호 보존 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q12 | problem | KEEP: ㄱ 원뿔/반구, ㄴ 부채꼴기둥, ㄷ 7/8구 원본 3개 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q12 | solution | REPLAN: 기존 ㄷ 해설 SVG는 75π+25π=100π 오표기; 정답 해설은 425π/4, [ㄱ]·[ㄷ] 입체를 공식 엔진으로 교정 | composite-panels-v1 | `q12-solution.plan.json` | PASS/PASS | PASS(ㄱ 반구+원뿔·ㄷ 7/8구·425π/4) |
| 왕운/q13 | problem | KEEP: 정사각뿔대 윗변6·아랫변12·옆면 높이 x 및 수선 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q13 | solution | KEEP: 측면 사다리꼴의 점선 수선·x·6·12, 네 옆면 관계 일치 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q14 | problem | EXEMPT: 10명의 턱걸이 기록 목록·진술 | — | — | NOT_RUN | N/A |
| 왕운/q14 | solution | EXEMPT: 도수·중앙값 수치 비교에 별도 그림 불필요 | — | — | NOT_RUN | N/A |
| 왕운/q15 | problem | KEEP: 달리기 20명 줄기·잎/도수분포표 원본 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q15 | solution | KEEP: a=b=6 및 줄기 7/9 계급과 빈도 A=2,B=3 대응 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q16 | problem | EXEMPT: 15번의 동일 원자료 표를 공유 | — | — | NOT_RUN | N/A |
| 왕운/q16 | solution | KEEP: 2/6/3/5/4의 다섯 계급과 9명 주석 보존 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q17 | problem | KEEP: 원본 히스토그램 60~160분·빈도 막대 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q17 | solution | KEEP: 도수 4/3/7/9/5·합28, 120분 이상14명 대응 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q18 | problem | KEEP: 도수분포다각형 원본 35~60회·빈도 눈금 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q18 | solution | KEEP: 50회 이상 5+3명과 꺾은선 교점 표시 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q19 | problem | KEEP: 전체/1학년 상대도수 분포표 원본 HTML 아닌 PNG 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q19 | solution | EXEMPT: 도수와 상대도수 역산만 필요; 중복 그림 없음 | — | — | NOT_RUN | N/A |
| 왕운/q20 | problem | KEEP: A/B 학교 점선·실선 일부 찢김·눈금·범례 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q20 | solution | KEEP: 상대도수 0.24/0.16, 누락된 A 0.36·B 0.14의 표시 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q21 | problem | KEEP: B,A,D 직선, 이등변 눈금, 68°·바깥각 x 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q21 | solution | KEEP: 34°·44°·68°·112°의 보조각과 길이 눈금 대응 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q22 | problem | KEEP: S1/S2 색칠 영역·정사각/사분원·AB=8 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q22 | solution | KEEP: 서로 같은 넓이 S1/S2를 분리 색칠해 넓이 관계 보존 | 기존 SVG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q23 | problem | KEEP: 두 직육면체 그릇의 숨은 모서리·12/18/9/x·물부피 확인 | 원본 PNG | — | NOT_RUN | PASS(기존 연결 자산의 원문 대응) |
| 왕운/q23 | solution | EXEMPT: 같은 부피 수식으로 충분, 원본 문제 그림 유지 | — | — | NOT_RUN | N/A |
| 왕운/q24 | problem | EXEMPT: 여학생/남학생 상대도수 표를 HTML로 제공 | — | — | NOT_RUN | N/A |
| 왕운/q24 | solution | EXEMPT: 합계·인원 계산만으로 설명 완료 | — | — | NOT_RUN | N/A |

## 신규 계획과 필드 1:1 대조
- q04 solution: `mathPlan.nodes[0..5]`는 반지름 3, 중심 간 거리 3인 두 원과 그 공통 교점 A,B를 정확히 만든다. `displayCircles`, `displaySegments`, `planeMarks.angles[0..1]`(120°), `planeMarks.arcs[0..1]`(각각 2π), `expressionLabels[0]`(3)을 화면 필드로 대응했다. 영역 채움 없음. **PASS**.
- q12 solution: `panels[0].plan.solids`는 반구(반지름 6)+원뿔(모선 10, 높이 8), `panels[1].plan.solids[0]`는 반지름 5 구의 `cut:SEVEN_EIGHTHS`다. 구면 `175π/2`와 절단면 `75π/4` 합 `425π/4`(=106.25π)로 원문 해설과 일치하고 기존 SVG의 `100π` 오표기를 제거했다. **PASS**.
- [ㄴ] 부채꼴 기둥의 원본 문제 PNG는 그대로 유지하고, 공식 해설 텍스트의 `270+144π` 및 이 계획의 캡션이 비교값을 보존한다. 기존 해설 SVG도 [ㄱ]·[ㄷ] 두 패널이었으므로 [ㄴ]을 그럴듯한 다면체로 대체하지 않았다. 별도 3D [ㄴ] 패널까지 추가해야 한다면 엔진의 **원호 밑면 기둥(SECTOR_PRISM, 곡면 옆넓이·호 라벨)** 기능이 필요하다. 이번 계획의 필수 렌더 기능은 모두 현재 엔진에서 지원하며 `ENGINE_CAPABILITY_PENDING=0`.
- 원본 문제 PNG는 직접 비교했고, 별도 고해상도 원본 스캔과의 독립 비교 자료는 `EVIDENCE_DEBT`.
