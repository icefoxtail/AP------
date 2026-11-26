# 23_풍덕중_1학기_중간_중3_유사3 q01~q12 문제·해설 SVG Plan 감사

- 기준 main: `c4183a9049b8123407803f32f943ad7120a11816`
- 원문: `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3.js` (Git blob `5314f731ebb2e71085dc364f0c4212ca8be5ed31`)
- 범위: q01~q12, 12문항·24축. 원문 JS 및 기존 자산 무변경.
- 감사: EXEMPT 23축, BENEFICIAL 1축, 실제 제작용 plan 1개.
- 검사: 공식 plan-lint shallow 1/1 PASS, full 1/1 PASS; `solveNumberLineFigure` → `numberLineFigureSpec`가 그릴 실제 필드와 source 1:1 대조 PASS 1축.
- 실제 SVG 렌더·PNG·학생 화면·A4: NOT_RUN (후속 엔진 제작 라인).

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 개별 판정 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23_풍덕중_1학기_중간_중3_유사3/q01 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 제곱근 개수 함수 f의 부호 조건 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q01 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 양수·0·음수에 따른 f의 값만 구하면 해가 유일하다 |
| 23_풍덕중_1학기_중간_중3_유사3/q02 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 무리수 여부를 묻는 여섯 보기의 정확한 분류 |
| 23_풍덕중_1학기_중간_중3_유사3/q02 | 해설 | EXEMPT | — | — | N/A | EXEMPT | ㄱ~ㅂ을 직접 정리하면 되고 집합 그림은 중복 |
| 23_풍덕중_1학기_중간_중3_유사3/q03 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호식에서 a,b를 구하는 수식 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q03 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 근호의 곱·나눗셈과 계수 비교로 완결 |
| 23_풍덕중_1학기_중간_중3_유사3/q04 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호를 포함한 분수와 곱의 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q04 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x−3와 y−2의 식 변환이 핵심 |
| 23_풍덕중_1학기_중간_중3_유사3/q05 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 전개식 계수로 a,b를 찾는 대수 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q05 | 해설 | EXEMPT | — | — | N/A | EXEMPT | b=2와 a=−4 대입 후 중간항 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q06 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 일차 인수와 k를 구하는 인수분해 |
| 23_풍덕중_1학기_중간_중3_유사3/q06 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 상수항 비교와 전개식만 필요 |
| 23_풍덕중_1학기_중간_중3_유사3/q07 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 두 자리 자연수 n을 제곱수 조건으로 센다 |
| 23_풍덕중_1학기_중간_중3_유사3/q07 | 해설 | EXEMPT | — | — | N/A | EXEMPT | n=2k²에서 k=3,4,5,6,7의 목록으로 설명된다 |
| 23_풍덕중_1학기_중간_중3_유사3/q08 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 정수 n의 범위가 텍스트로 제시되며 문제 그림은 정답 1을 암시 |
| 23_풍덕중_1학기_중간_중3_유사3/q08 | 해설 | BENEFICIAL | number-line-figure-v1 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3_plans/q08-solution.plan.json` | shallow PASS / full PASS | PASS (엔진 spec) | 정확한 두 무리수 x,y와 정수 1의 상대 위치를 같은 눈금으로 확인 |
| 23_풍덕중_1학기_중간_중3_유사3/q09 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 삼각형·직사각형의 밑변·높이가 말로 충분히 명시된다 |
| 23_풍덕중_1학기_중간_중3_유사3/q09 | 해설 | EXEMPT | — | — | N/A | EXEMPT | ½√24√a=√8√12로 넓이가 같음을 바로 계산하므로 임의 축척 도형은 장식 |
| 23_풍덕중_1학기_중간_중3_유사3/q10 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 유리화 및 대칭식의 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q10 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x+y=4, xy=1을 구하고 식에 대입 |
| 23_풍덕중_1학기_중간_중3_유사3/q11 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 공통 인수에 따른 x=±2 대입 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q11 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 두 다항식 차와 인수정리를 식으로 설명 |
| 23_풍덕중_1학기_중간_중3_유사3/q12 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 공액수의 거듭제곱 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q12 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 공액수 곱 1과 남은 제곱을 연산식으로 설명 |

## 실제 엔진 필드와 원문 대조 — q08 해설

| 원문 조건·풀이 요소 | 엔진 출력의 실제 도형 필드 |
| --- | --- |
| x=3−√5 | r1 label x, dot P0 exact value 3-sqrt(5), x=210.307644 |
| n=1 | r2 label n=1, dot P1 exact value 1, x=242.267602 |
| y=√7−1 | r3 label y, dot P2 exact value -1+sqrt(7), x=329.692356 |
| 원문 범위 x<n≤y를 푸는 점 비교 | r1~r3 axis x1=88 x2=460 공통 매핑, x(P0)<1(P1)<y(P2) |

원문 경계 두 개는 각각 약 0.76393·1.64575이나 plan 점은 소수가 아닌 정확한 무리수 식으로 엔진에 입력했다. 이 BENEFICIAL 도식의 의도는 열린·닫힌 구간의 정식 표기 자체가 아니라 원래 경계 사이에 정수 1이 있음을 한 눈금으로 비교하는 것이다. 끝점의 OPEN/CLOSED 기호는 점 비교 도식에 새로 선언하지 않았으므로 이를 렌더했다고 주장하지 않는다. 문장 x<n≤y는 문제·해설에 이미 있다. 문제용 정답 노출 그림은 만들지 않았다.

필드 대조 근거는 공식 `number-line-v1.mjs`의 `solveNumberLineFigure` 모델과 `numberLineFigureSpec`의 `rows[].axis`, `rows[].dots`, `labels` 결과이다. 이 모듈과 공식 lint·합성 모듈의 Git blob은 실행 시 최신 main 파일 blob과 일치함을 별도 확인했다. 정밀한 좌표·대소관계는 도형 spec PASS이며 **실제 렌더 PNG 눈 검수 PASS를 뜻하지 않는다**.

## 검사·잔여 기록

- 최종 실행용 plan은 위 표의 q08-solution 한 개뿐이다. EXEMPT 상태 파일을 제작용 plan으로 세지 않는다.
- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <plan>`: `q08-solution.plan: OK`, `FAIL 0 / SKIP 0 / OK 1`, 종료코드 0.
- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan>` (full): `q08-solution.plan: OK`, `FAIL 0 / SKIP 0 / OK 1`, 종료코드 0.
- 정적 원문-모델·spec 패리티: q08 해설 1/1 PASS. 나머지 23축 EXEMPT. 이번 범위 `ENGINE_CAPABILITY_PENDING=0`, `EVIDENCE_DEBT=0`.
- 처음 시도한 근삿값 SET + integerPoints plan은 공식 lint 실행 중 종료 137로 검증되지 않아 채택하지 않았다. 정확한 세 점으로 전환한 최종 plan은 shallow/full 양쪽 PASS.
- 별도 미해결은 왕운중 유사3 q23 문제·해설 `EVIDENCE_DEBT` 2축, 풍덕중 유사1 q21 해설 `ENGINE_CAPABILITY_PENDING` 1축. 이 감사 건의 집계에서 제외한다.
