# 2021 향림중 중2 2학기 중간: 문제/해설 SVG 재설계 인수 검수

## 범위·검증 기준

- 유일한 대상: `archive/exams/original/middle/m2/2mid/21_향림중_2학기_중간_중2_수학.js`의 q01–q26, 문제/해설 각 1축 총 **52축**.
- 원본 `archive/assets/images/21_향림중_2학기_중간_중2_수학/`의 q05/q07/q14–q20/q22 및 서술형 s02–s04, q16 선택지 5개, 복원된 q19/q20 PNG와 기존 SVG를 문항 텍스트와 대조. q05/q07 원본 가장자리·스캔 잡음과 q19/q20 구형 잘림은 복원/현행 에셋으로 보완하였지만, 원본 손상 부분에 대한 독립적 1:1 증거는 제한된다.
- `plan-lint.cjs`는 `*.plan.json` 개별 경로 34개를 shallow/full로 검사해 **34/34 PASS**. 기존 `q14-solution.plan.json`, `q20-solution.plan.json`은 검수만 하고 손대지 않았다.
- `C✓`는 원문에 명시된 기울기·점·지시선·각·원호 등 **실제 plan 그리기 필드**의 조건 대응과 린트 통과를 뜻한다. 시각적 최종 `DRAWN_FEATURE_PARITY=PASS`가 아니다. `R?`는 브라우저 렌더 `ARCHIVE_PREFLIGHT_FAIL`(Chrome 실행 바이너리 부재 및 공식 설치 소스 403) 때문에 원본 대비 픽셀·라벨·학생/A4 1:1 검수를 할 수 없음을 뜻한다.
- `E`는 원본 이미지 일부 결손의 `EVIDENCE_DEBT`, `P`는 명시한 `ENGINE_CAPABILITY_PENDING`, `–`는 시각 에셋이 없어 `EXEMPT`라는 뜻이다. 별도 해설 도형이 원문에는 없던 문항은 **원문 수치에서 유도한 풀이용 보조 그림**으로 구분한다.

| 파일/qid | 축 | 기존결함/판정 및 원문 대조 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 향림/q01 | 문제 | 함수 판별 진술 | EXEMPT | – | N/A | N/A |
| 향림/q01 | 해설 | 함수 정의 | EXEMPT | – | N/A | N/A |
| 향림/q02 | 문제 | 함수값 수식 | EXEMPT | – | N/A | N/A |
| 향림/q02 | 해설 | 함수값 대입 | EXEMPT | – | N/A | N/A |
| 향림/q03 | 문제 | 일차함수 보기 수식 | EXEMPT | – | N/A | N/A |
| 향림/q03 | 해설 | 함수 꼴 확인 | EXEMPT | – | N/A | N/A |
| 향림/q04 | 문제 | x절편 5/2 텍스트 조건만 | EXEMPT | – | N/A | N/A |
| 향림/q04 | 해설 | 기존 풀이 그림 부재: y=−2x+5, (5/2,0) 및 (0,5) 그래프 보강 | piecewise-polynomial-spike-v1 | [q04-solution.plan.json](q04-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q05 | 문제 | 원본 스캔 가장자리 손상, 기존 직선 y절편 3/x절편 1의 점·눈금 보강 | piecewise-polynomial-spike-v1 | [q05-problem.plan.json](q05-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 향림/q05 | 해설 | (0,3),(1,0)에서 기울기 −3; 원본 스캔 일부 잘림 | piecewise-polynomial-spike-v1 | [q05-solution.plan.json](q05-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 향림/q06 | 문제 | 일차함수 식만 제시 | EXEMPT | – | N/A | N/A |
| 향림/q06 | 해설 | 기존 그림 없음: (2,0),(0,−3) 연결 직선 y=3x/2−3 보강 | piecewise-polynomial-spike-v1 | [q06-solution.plan.json](q06-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q07 | 문제 | 숫자가 없는 개형: 하향 기울기·음의 절편만, 원문식 y=ax−b 지시선(수치 눈금 날조 금지) | piecewise-polynomial-spike-v1 | [q07-problem.plan.json](q07-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 향림/q07 | 해설 | a<0, −b<0의 부호를 보조 식 라벨로 판독 | piecewise-polynomial-spike-v1 | [q07-solution.plan.json](q07-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 향림/q08 | 문제 | 두 점 좌표 텍스트 | EXEMPT | – | N/A | N/A |
| 향림/q08 | 해설 | 기존 풀이 그림 없음: (1,1),(4,−2), y=−x+2 직선 | piecewise-polynomial-spike-v1 | [q08-solution.plan.json](q08-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q09 | 문제 | 요금 서술식 | EXEMPT | – | N/A | N/A |
| 향림/q09 | 해설 | 일차방정식 풀이 | EXEMPT | – | N/A | N/A |
| 향림/q10 | 문제 | 세 직선의 식만 제시 | EXEMPT | – | N/A | N/A |
| 향림/q10 | 해설 | 기존 도형 없음: y=−x−3, y=x/4+2, x=0의 교점·삼각형 | piecewise-polynomial-spike-v1 | [q10-solution.plan.json](q10-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q11 | 문제 | 두 일차방정식의 비교 | EXEMPT | – | N/A | N/A |
| 향림/q11 | 해설 | 중복·평행 판별 수식 | EXEMPT | – | N/A | N/A |
| 향림/q12 | 문제 | 교점의 x=3 텍스트 | EXEMPT | – | N/A | N/A |
| 향림/q12 | 해설 | 기존 그림 없음: 두 직선·교점 (3,−1) | piecewise-polynomial-spike-v1 | [q12-solution.plan.json](q12-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q13 | 문제 | 두 직선과 수평선의 식 | EXEMPT | – | N/A | N/A |
| 향림/q13 | 해설 | 기존 그림 없음: 교점 (2,1), 두 직선, y=1 수평 보조선 | piecewise-polynomial-spike-v1 | [q13-solution.plan.json](q13-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q14 | 문제 | AB=AC 등변 눈금, BC 8, ∠B 68, A의 각 이등분·직각 | construction-spike-v1 | [q14-problem.plan.json](q14-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q14 | 해설 | 기존 공식 plan 검수: BD=DC=4, ∠BAD=∠DAC=22, 90° | construction-spike-v1 | [q14-solution.plan.json](q14-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q15 | 문제 | AB=AC, B 내각/ C 외각 이등분 호, 밑변 점선 연장, ∠ABD 22 | construction-spike-v1 | [q15-problem.plan.json](q15-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q15 | 해설 | ∠BDC=46°, 보조 호 및 외각선 유지 | construction-spike-v1 | [q15-solution.plan.json](q15-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q16 | 문제 | 기준 직각삼각형 10/40/직각 + 별도 원본 선택지 ①~⑤ 5컷. 엔진 6면 단일 합성 제한, 두 계획으로 분리 | construction-spike-v1 + composite-panels-v1 | [q16-problem.plan.json](q16-problem.plan.json), [q16-choices.plan.json](q16-choices.plan.json) | PASS/PASS(양쪽) | **P: SIX_PLANE_PANELS_INTEGRATION** / R? |
| 향림/q16 | 해설 | RHA 합동: 기준 40°+⑤의 50°, 선택지 다섯 컷 별도 구성 | construction-spike-v1 | [q16-solution.plan.json](q16-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q17 | 문제 | C 90°, DM⊥AB, AM=BM, AD 각이등분(호); 수선·중점 근호 좌표 정확 작도 | construction-spike-v1 | [q17-problem.plan.json](q17-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q17 | 해설 | CD=DM 추가 동일 눈금, 각 관계·수직 유지 | construction-spike-v1 | [q17-solution.plan.json](q17-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q18 | 문제 | B/D/E 세 직각, AB=BC 등변 눈금, AD 6/CE 8/AB 10 | construction-spike-v1 | [q18-problem.plan.json](q18-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q18 | 해설 | RHA 합동으로 DE 14, 사다리꼴 넓이 98(설명) | construction-spike-v1 | [q18-solution.plan.json](q18-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q19 | 문제 | 복원 PNG 확인: 외심 O, OB/OC 반지름, ∠BOC 110/∠OCA 20 | construction-spike-v1 | [q19-problem.plan.json](q19-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q19 | 해설 | 원주각 ∠BAC=55 추가 | construction-spike-v1 | [q19-solution.plan.json](q19-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q20 | 문제 | 복원 PNG 확인: 내심 I, 세 변에 내린 수선과 직각, 해설 전용 등거리 눈금은 제외 | construction-spike-v1 | [q20-problem.plan.json](q20-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q20 | 해설 | 기존 공식 plan 검수: ID=IE=IF 등거리 눈금과 접점 수선 3개 | construction-spike-v1 | [q20-solution.plan.json](q20-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q21 | 문제 | 삼각형 정리 진술·보기 | EXEMPT | – | N/A | N/A |
| 향림/q21 | 해설 | 합동·내심/외심 판별 | EXEMPT | – | N/A | N/A |
| 향림/q22 | 문제 | 직각삼각형·외접원/내접원 두 동심 아닌 원, 반지름 17/2와 3 | construction-spike-v1 | [q22-problem.plan.json](q22-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q22 | 해설 | 8–15–17 삼각형·반지름 3, 넓이 60(풀이) | construction-spike-v1 | [q22-solution.plan.json](q22-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q23 | 문제 | 일차함수 평행이동 서술식 | EXEMPT | – | N/A | N/A |
| 향림/q23 | 해설 | 기존 그림 없음: y=x+3, (2,5) 표시 | piecewise-polynomial-spike-v1 | [q23-solution.plan.json](q23-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q24 | 문제 | 원본 s02 확인: 좌표축·A(1,4)–B(3,3) 선분·양 끝 채운 점 | piecewise-polynomial-spike-v1 | [q24-problem.plan.json](q24-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q24 | 해설 | y=3x+1, y=3x−6 평행선과 AB, −6≤b≤1의 양 끝 사례 | piecewise-polynomial-spike-v1 | [q24-solution.plan.json](q24-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q25 | 문제 | 원본 s03: 사각기둥 수조 외곽/은선만 재현. **부분 수위·수도꼭지·물줄기 미지원** | solid-figure-v1 | [q25-problem.plan.json](q25-problem.plan.json) | PASS/PASS | **P: PRISM_LEVEL_WATER_SURFACE + FAUCET_AND_FLOWING_STREAM** / R? |
| 향림/q25 | 해설 | 물높이 그래프 (5,20),(15,40),(40,90)과 기울기 2 | piecewise-polynomial-spike-v1 | [q25-solution.plan.json](q25-solution.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q26 | 문제 | 원본 s04: O 외심, ∠OAB 48/∠OCA 32, AO 9, **짧은 호 BC를 독립 arc mark로 표시** | construction-spike-v1 | [q26-problem.plan.json](q26-problem.plan.json) | PASS/PASS | C✓ / R? |
| 향림/q26 | 해설 | ∠BOC 160과 호 BC, 호 길이 8π(풀이) | construction-spike-v1 | [q26-solution.plan.json](q26-solution.plan.json) | PASS/PASS | C✓ / R? |

## DRAWN_FEATURE_PARITY 및 운영 인계

- 시각 계획 **33축 + q16 선택지 보조 plan 1개 = 34/34** shallow/full PASS. 텍스트 전용 **19/19축 EXEMPT**.
- 새 계획 **32개**, 기존 유지·검증 **2개**. `q16-choices.plan.json`은 원본의 5개 선지를 각각 2열 패널로 구성한다. 현행 단일 문항 이미지 하나에 6개의 참조·선지 패널을 합치려면 엔진 5개 평면 패널 상한을 확장하거나 2개 시각 에셋의 문항 연결 기능이 필요하다.
- `ENGINE_CAPABILITY_PENDING` ① q16: **6개 평면 그림 통합/두 에셋 연동** ② q25: **각기둥 내부 부분 수위의 선분·수면/물 면 채움**, **수도꼭지 및 물줄기 프롭**. 일반 면 채움은 없고, 물 면만 의도적 채움 대상이다.
- `EVIDENCE_DEBT`: q05/q07 원본 스캔의 잘린 가장자리·잡음; q19/q20은 복원된 PNG와 현행 에셋에 근거. **실제 SVG `DRAWN_FEATURE_PARITY` 미완료**: `render-plan.mjs`의 Chrome 사전검사 실패. 렌더링·PNG·학생/A4 원본 1:1 비교는 후속 환경에서 별도 승인이 필요하다. `plan-lint=PASS`를 시각 완성으로 오인하지 않는다.
