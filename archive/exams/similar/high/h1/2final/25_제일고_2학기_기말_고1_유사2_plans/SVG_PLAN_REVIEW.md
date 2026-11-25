# 제일고 2학기 기말 유사2 — 문제/해설 SVG 플랜 검수 장부

- 기준일: 2026-11-26 KST. 대상 JS: `archive/exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사2.js` (원문 git blob `53a1c65936aabcf4494565f06e5b5cbb2fabaf8d`).
- 경로 접두사 **P**: `archive/exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사2_plans/`. 아래 `P/...`는 이 실제 상대경로를 뜻한다.
- 제일고 1학기 중간 유사 **22문항 전부는 열린 PR #3056과 중복되므로 이번 작성에서 제외**. 본 배치는 2학기 기말 유사2 **22문항 / 44축**만 판정.
- **REQUIRED** 문제 원도형 재현; **BENEFICIAL** 해설 보조 시각자료; **EXEMPT** 장식·단순식·순수 논증으로 플랜 불필요. EXEMPT는 점검 분모에서 제외하며 이유를 행마다 적는다.
- 19개 플랜 중 새 보완 5개 (Q12 P/S, Q17 P/S, Q20 S), 검증된 기존 플랜의 정상 경로 이관 14개. 기존 플랜 원본: `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사2/`.
- **검사**: `plan-lint.cjs --shallow --engine <engine> P/*.plan.json` = 19/19 PASS; `plan-lint.cjs --jobs 3 --engine <engine> P/*.plan.json` = 19/19 PASS. 실제 공식 렌더·PNG·학생 화면·A4 판정은 후속 엔진 운영의 영역이므로 각각 NOT_RUN; 문항별 DRAWN_FEATURE_PARITY는 원문과 plan의 실제 그려지는 필드(곡선/점/선분/라벨/각/직각/면적/방향)를 대조한 별도 검수임.
- 면 채움: Q04 논리 영역, Q11 제1사분면 배제, Q18 면적 S1/S2/S3에만 설명 필요성으로 허용. 문제 축에는 임의 면 채움 없음. 문제 원그림 Q10/12/17에 해설 정답값 강조 없음.

| 파일/qid | 축 | 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 원문 ↔ 그려지는 필드 / EXEMPT 사유 |
|---|---|---|---|---|---|---|---|
| 제일고 기말 유사2/Q01 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 명제 x²+1>0의 판정: 도형·함수 그래프 조건 없음 |
| 제일고 기말 유사2/Q01 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 전칭명제 증명만 있어 그림 불필요 |
| 제일고 기말 유사2/Q02 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 평행이동 좌표 발문으로 그림 없음 |
| 제일고 기말 유사2/Q02 | 해설 | BENEFICIAL | construction-spike-v1 | `P/q2-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | P(1,-2)→Q(-3,4), A(6,-5)→R(2,1), 두 화살표·네 좌표 |
| 제일고 기말 유사2/Q03 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 접선 조건은 방정식·좌표로 제시됨 |
| 제일고 기말 유사2/Q03 | 해설 | BENEFICIAL | construction-spike-v1 | `P/q3-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | C(2,-1), T(5,1), K(1,7), 원·접선 3x+2y=17·CT·직각 |
| 제일고 기말 유사2/Q04 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 함의 관계는 부등식 글로 제시됨 |
| 제일고 기말 유사2/Q04 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `P/q4-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 경계 x+y=7, x=2, y=5 및 x>2∧y>5 반평면 |
| 제일고 기말 유사2/Q05 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 조건 p,q,r는 부등식이며 별도 원그림 없음 |
| 제일고 기말 유사2/Q05 | 해설 | BENEFICIAL | number-line-figure-v1 | `P/q5-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | P/Q/R 3줄: -2·5 닫힘, -1 열림, R의 5 닫힘 |
| 제일고 기말 유사2/Q06 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 두 점과 x축의 최단거리 발문(원그림 없음) |
| 제일고 기말 유사2/Q06 | 해설 | BENEFICIAL | construction-spike-v1 | `P/q6-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | A(1,3), A'(1,-3), B(9,3), P(5,0); AP·PB·A'P·AA' |
| 제일고 기말 유사2/Q07 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 원방정식·접선이 지나는 점만 제시 |
| 제일고 기말 유사2/Q07 | 해설 | BENEFICIAL | construction-spike-v1 | `P/q7-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | C(1,-3), P(-2,1), 접선 2개·접점 2개·반지름·직각 2개 |
| 제일고 기말 유사2/Q08 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 참·거짓 진술 논리문: 공간 배치가 정보 아님 |
| 제일고 기말 유사2/Q08 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 진술별 모순 추론만 있음 |
| 제일고 기말 유사2/Q09 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 절편과 이등분 관계가 텍스트로 주어짐; 정답 절편 표시 금지 |
| 제일고 기말 유사2/Q09 | 해설 | BENEFICIAL | construction-spike-v1 | `P/q9-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | O, A(4,0), B(0,6), P(2,3); OA·OB·AB 삼각형 |
| 제일고 기말 유사2/Q10 | 문제 | REQUIRED | set-diagram-figure-v1 | `P/q10-problem.plan.json` | PASS/PASS | PASS (REVIEWED) | X→X 1↦3,2↦4,3↦5,4↦1,5↦2 5개 화살표; 답 강조 없음 |
| 제일고 기말 유사2/Q10 | 해설 | BENEFICIAL | set-diagram-figure-v1 | `P/q10-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 원래 5개 화살표 유지, 5→2→4 경로만 강조 |
| 제일고 기말 유사2/Q11 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | k가 든 무리함수 조건은 수식만 제시 |
| 제일고 기말 유사2/Q11 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `P/q11-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | k=2 대표 그래프 y=−√(x+4)+2 및 제1사분면 구역 |
| 제일고 기말 유사2/Q12 | 문제 | REQUIRED | piecewise-polynomial-spike-v1 | `P/q12-problem.plan.json` | PASS/PASS | PASS (REVIEWED) | f(2)=1,f(5)=2,f(7)=5 곡선·눈금·점·점선 가이드·y=x·y=f(x) |
| 제일고 기말 유사2/Q12 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | `P/q12-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 같은 곡선 및 대각선, (5,2),(7,5), 중간점(5,5)·역함수 추적 |
| 제일고 기말 유사2/Q13 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 유리함수 y=(3x−4)/(x−2) 수식 조건; 원그림 없음 |
| 제일고 기말 유사2/Q13 | 해설 | BENEFICIAL | rational-spike-v1 | `P/q13-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 점(2,3), 점근선 x=2·y=3, 대칭축 y=x+1·y=−x+5, 비교선 y=−x+3 |
| 제일고 기말 유사2/Q14 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | k 미지수를 포함한 식·넓이 조건; 문제에 풀이 수치 노출 금지 |
| 제일고 기말 유사2/Q14 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `P/q14-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | f,g 두 유리곡선, 자동 점근선 x=2,y=1,x=−4,y=4, 네 꼭짓점·사각형 네 변 |
| 제일고 기말 유사2/Q15 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 일차함수 합성·역함수 조건은 대수식 |
| 제일고 기말 유사2/Q15 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 연립방정식으로 a,b 결정; 공간적 설명 불필요 |
| 제일고 기말 유사2/Q16 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 유리식 합성과 정의역 조건으로 원그림 없음 |
| 제일고 기말 유사2/Q16 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 소거·제외점 판별은 대수 풀이; 임의 그래프가 구멍을 누락할 우려 |
| 제일고 기말 유사2/Q17 | 문제 | REQUIRED | multi-curve-figure-v1 | `P/q17-problem.plan.json` | PASS/PASS | PASS (REVIEWED) | √(4x),√(2x), A(4,4)·B(4,0)·C(8,0)·D(8,4)와 4변, B 직각; 숫자 눈금·정답 없음 |
| 제일고 기말 유사2/Q17 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `P/q17-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 두 무리곡선과 정사각형, B 직각, x=4·8/y=4 눈금, DA 길이 4 |
| 제일고 기말 유사2/Q18 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | f,g 조각별 수식 발문(원그림 없음) |
| 제일고 기말 유사2/Q18 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | `P/q18-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | 합성함수 3구간, (0,3)→(1,2)→(3/2,3)→(2,0), 면적 S1/S2/S3 음영 |
| 제일고 기말 유사2/Q19 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 전칭명제 부정·정수 k 판정 조건은 수식 |
| 제일고 기말 유사2/Q19 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | `P/q19-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | D/4=k²−k−6 포물선, 근(−2,0)·(3,0), 꼭짓점(1/2,−25/4) |
| 제일고 기말 유사2/Q20 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 역함수 교점의 거리는 수식으로 질의; 원그림 없음 |
| 제일고 기말 유사2/Q20 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `P/q20-solution.plan.json` | PASS/PASS | PASS (REVIEWED) | y=√(x−2)+2, y=(x−2)²+2, y=x, 교점(2,2)·(3,3), 연결선·길이√2 |
| 제일고 기말 유사2/Q21 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 유리식 망원합: 배치형 도식 필요 없음 |
| 제일고 기말 유사2/Q21 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 분수 항의 상쇄 계산만 있음 |
| 제일고 기말 유사2/Q22 | 문제 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 3으로 나눈 나머지와 모순증명 |
| 제일고 기말 유사2/Q22 | 해설 | EXEMPT | — | `—` | N/A | N/A (EXEMPT) | 합동식·대우 논증으로 시각자료 없음 |

## 검수 총계 및 출판 경계

- 22문항, 44축 = 원그림 문제 REQUIRED 3 + 해설 BENEFICIAL 16 + EXEMPT 25; DRAWN_FEATURE_PARITY **19/19 PASS**, `ENGINE_CAPABILITY_PENDING 0`.
- 실제 실행 플랜 19개 (`5개 보완 + 14개 경로 이관`), shallow 19/19, full 19/19. Q12/17/20의 이전 원도형 누락(대각선 라벨·직각/길이·교점 1개)을 보완.
- DRAWN_FEATURE_PARITY의 PASS는 **원문 값/관계 ↔ JSON 렌더 필드에 대한 사전 검수**만 뜻한다. 출판용 SVG/PNG 실물, 학생 화면, A4 렌더 시각검수는 진행하지 않았으며 `NOT_RUN`으로 남긴다. JS 원문·원본 SVG/PNG·유형은행·교과서는 수정하지 않았다.
