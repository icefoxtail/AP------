# DRAWN_FEATURE_PARITY 감사 — 비상 기하 「공간도형과 공간좌표」 익힘책 고2

- 원문: `archive/exams/textbooks/비상교육_기하/비상_기하_공간도형과공간좌표_익힘책_고2/비상_기하_공간도형과공간좌표_익힘책_고2.js`
- 범위: 전 25문항 / 문제·해설 **50축**. 원본 `q01`~`q11` 및 `q19.png` **12개** 직접 열람. 원본의 별도 해설 그림 PNG는 없음.
- 원본 대조: 12개를 기준으로 꼭짓점, 순환 순서, 가려진 모서리, 중점, 두 삼각형의 직각, 길이, 이면각과 정사영 및 해설에서 파생되는 보조선까지 하나씩 검사. 원본 배경 흰색·색면 채움은 정보성 있는 평면 α 표기 외 제거 대상으로 취급. Authored plan에 `highlights`/`baseFill`/불필요한 색면 명령은 없음. q07의 연한 `space.planes` 1개는 **원문이 지정한 평면 α의 식별 표식**이므로 단순 장식 채움이 아님.
- 기계 검사: `plan-lint.cjs --shallow` **24/24 OK**, full **24/24 OK** (`UNSUPPORTED` 2개 선언 포함). 실행 가능한 22개는 엔진 `composeSolidFigurePanel`의 독립 Python 정적 SVG 관측기 **22/22 PASS**; 각 SVG를 librsvg로 렌더하여 원본 PNG 및 qid별 발문과 직접 비교. 원문 그림 없는 13문항(26축)은 `EXEMPT_TEXT_ONLY`.
- **엔진 한계 — 투명 배경**: 실행형 22개 plan 자체는 배경을 지정하지 않았으나 엔진 `solid-figure-v1.mjs`가 `<rect fill="#fff"/>`를 강제로 추가함. 이 라인은 엔진을 수정할 권한이 없으므로 `ENGINE_CAPABILITY_PENDING: transparent-background-export`가 모든 실행형 축에 남는다.
- **브라우저 배치 제한**: 실행 가능한 Chrome 바이너리가 없어 학생 화면의 최종 label collision/Archive capture 검증은 미완료(`BROWSER_LAYOUT_PENDING`). 정적 SVG 생성·관측과 원본 비교는 별도로 완료.
- q19의 원문 좌표 A(1,1,0), B(3,2,3), C(2,6,6), D(0,5,3)는 고정 카메라 각에서 평행사변형이 매우 가늘게 투영되었다. 그림에는 축·좌표값이 인쇄되어 있지 않으므로, 두 본문 계획은 그 **좌표점 전체에 동일한 강체변환**을 적용해 xz평면에 배치했다. 원래 모든 길이와 두 내적, 교점 P, 중점 M, 모든 내분비가 보존되는 동등한 도형이다(해설에 쓰인 원래 좌표는 `sourceConditions`에 유지). 왜곡된 가짜 2D 선분 길이를 쓰지 않았다.

## qid별 원본 특징 및 해설의 독립 작도 특징

| qid | 원본 PNG 및 발문 1:1 작도 목록 | 해설에서 더한 특징 | 판정 |
|---|---|---|---|
| 01 | 정육각기둥 윗면 A~F·아랫면 G~L 12꼭짓점, 18모서리/가려진 점선 | AB 강조·꼬인 8모서리 HI/IJ/KL/LG/CI/DJ/EK/FL | 기하 PASS / BG pending |
| 02 | 사각뿔 A-BCDE, 뒤쪽 모서리 점선, 다섯 꼭짓점 | 밑면 대각선 BD·CE, 대각단면의 7개 평면 이해 | 기하 PASS / BG pending |
| 03 | 정육면체 A~H 및 뒤쪽 모서리, 네 쌍의 직선 | 정삼각형 BGD/AFH와 60° 각 호 각 1개, 두 묶음 색 구별 | 기하 PASS / BG pending |
| 04 | 정사면체 ABCD, AB·CD 중점 E/F | EF, AF/BF/CE/DE 보조선과 E·F의 직각 표시 | 기하 PASS / BG pending |
| 05 | 정육면체, AG 공간점선과 BD 상면 대각선 | AC와 O 중점, AC⊥BD 직각, CG 수직 | 기하 PASS / BG pending |
| 06 | 정육면체 FG 중점 M, DF·HM 두 공간 직선 점선 | 두 직선 방향벡터의 기하 배치 및 cosθ | 기하 PASS / BG pending |
| 07 | 평면 α, △ABC와 수직 △DAC, A/B 직각과 C의 30°·45° | BD 보조선 및 B에서 BC⊥BD 직각 | 기하 PASS / BG pending; 평면 α는 필수 정보성 면 표시 |
| 08 | ABCD 사면체, 4인 네 변과 2√2인 두 변, BC 중점 M | AD 중점 N, AM·DM·MN 수선 및 세 직각 | 기하 PASS / BG pending |
| 09 | 정육면체 CD 중점 M, 공간 삼각형 BGM | △BCM으로 정사영, C의 직각 및 CM | 기하 PASS / BG pending |
| 10 | 직사각형의 BD 접기, 접히기 전 점선, A의 수선발 H∈CD, CH:HD=4:3 | B-H 보조선·△HBD 정사영 및 H 직각 | 기하 PASS / BG pending; 이면각 호 자체는 G4b 미지원 |
| 11 | 기울어진 축의 원뿔 A-BC, 반지름 2·모선 5, 모선 AB∥평면 α | 밑면 원→평면 α 정사영 타원과 2/5 면적비 | `ENGINE_CAPABILITY_PENDING: rotated-cone + cone-plane-projection` |
| 12–18 | 원문 그림 없음: 공간좌표 대칭·거리·수선·중점의 대수 문제 7개 | 별도 SVG 원천 없음 | TEXT_ONLY 면제 |
| 19 | 3차원 좌표가 주어진 평행사변형 ABCD, CD 중점 M, AM∩BD=P | AC의 중점 O, 두 중선 AM·DO, P의 무게중심 | 기하 PASS / BG pending; 강체변환으로 화면 가독성 향상 |
| 20–25 | 원문 그림 없음: 구 방정식·아폴로니오스 구·두 구의 교선 등 6개 대수 문제 | 별도 SVG 원천 없음 | TEXT_ONLY 면제 |

## 모든 문제·해설 축의 기계 검사 원장

`GEO_PASS/BG_PENDING`은 원본에서 수학적으로 필요한 drawn field를 발문·해설별로 1:1 체크하고, 엔진의 정적 SVG 요소 관측에 성공했다는 의미. 이는 흰색 자동 캔버스와 Chrome 브라우저 배치까지 PASS라는 주장이 **아님**. `UNSUPPORTED`는 근사 그림으로 대체하지 않은 엔진 기능 요청이다.

| 파일/qid | 축 | 판정 | capability | plan 경로(본 폴더 기준) | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 익힘/01 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q01-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/01 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q01-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/02 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q02-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/02 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q02-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/03 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q03-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/03 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q03-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/04 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q04-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/04 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q04-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/05 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q05-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/05 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q05-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/06 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q06-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/06 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q06-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/07 | 문항 | 정적 작도 통과 | solid-figure-v1(space) | `q07-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/07 | 해설 | 정적 작도 통과 | solid-figure-v1(space) | `q07-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/08 | 문항 | 정적 작도 통과 | solid-figure-v1(space) | `q08-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/08 | 해설 | 정적 작도 통과 | solid-figure-v1(space) | `q08-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/09 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q09-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/09 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q09-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/10 | 문항 | 정적 작도 통과 | solid-figure-v1(space) | `q10-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/10 | 해설 | 정적 작도 통과 | solid-figure-v1(space) | `q10-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/11 | 문항 | 엔진 대기 | rotated-cone / cone-plane-parallel-generator | `q11-problem.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 익힘/11 | 해설 | 엔진 대기 | tilted-cone-base-projection | `q11-solution.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 익힘/12 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/12 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/13 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/13 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/14 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/14 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/15 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/15 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/16 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/16 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/17 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/17 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/18 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/18 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/19 | 문항 | 정적 작도 통과 | solid-figure-v1(space) | `q19-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/19 | 해설 | 정적 작도 통과 | solid-figure-v1(space) | `q19-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 익힘/20 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/20 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/21 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/21 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/22 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/22 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/23 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/23 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/24 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/24 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/25 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 익힘/25 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |

요약: 50축 = 실행·독립 정적 SVG 검증 **22축**, 엔진 미지원 명시 **2축**, 원문 그림 부재 면제 **26축**. 이미지 12개 전수 열람. **투명배경/Chrome 최종승인은 잔여 기능·환경 대기.**
