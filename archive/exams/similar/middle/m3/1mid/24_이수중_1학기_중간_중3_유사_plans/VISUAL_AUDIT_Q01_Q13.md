# 2024 이수중 중3 1중간 유사 q01~q13: SVG 양축 감사

- source: `archive/exams/similar/middle/m3/1mid/24_이수중_1학기_중간_중3_유사.js` (main `dcf5cd3da7abf58a9037bb295999ed74717e9a44`)
- source blob: `5df79dc1ec70828c98cf2c99c960e6562398c5c1`; SHA256 `a53bc389652e730d797669e17c55d306ecd620856b509146de03aebe8496bc54`
- 범위: q01~q13 **13문항·26축**; q14~q25 **12문항은 다음 회차**. 열린 #1985와 충돌하는 왕운중 q19를 제외하면서 q13을 연결했다. 기존 문제용 plan JSON 25개 중 이번 범위 13개를 확인한 결과 실제 실행형은 q10·q12의 2개, EXEMPT 자리표시자는 11개였다. 둘은 전 회차 완료 근거가 아니므로 유지·검사하되 내용을 불필요하게 덮어쓰지 않았다.
- 별도 열린 PR 68건의 파일 목록과 중복 대조. 이 exact stem의 plan/감사 파일 점유 없음(#956 변경 목록 API 오류는 미확인으로 별도 기록).

## 독립 2축 판정

| qid | 축 | 판정 | capability | plan 경로(24_이수중_1학기_중간_중3_유사_plans/ 아래) | lint | DRAWN_FEATURE_PARITY | 개별 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | √49의 제곱근과 49의 제곱근의 표현 차이를 묻는 참거짓 선택형이다. |
| q01 | 해설 | EXEMPT | — | — | — | 해당 없음 | 7의 제곱근 ±√7을 식과 언어로 구별하면 충분하다. |
| q02 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 음수와 근호를 포함한 다섯 대소관계의 식 진위 판별이다. |
| q02 | 해설 | EXEMPT | — | — | — | 해당 없음 | 역수 및 부호를 취할 때 부등호 방향을 비교하는 대수 설명으로 완결된다. |
| q03 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 주어진 다섯 수의 제곱근을 근호 없이 나타낼 수 있는지 묻는다. |
| q03 | 해설 | EXEMPT | — | — | — | 해당 없음 | √81=9의 제곱근은 ±3인 식 비교가 핵심이며 그림은 반복이다. |
| q04 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 수직선 점과 실수의 일대일 대응·유리수/무리수 조밀성 개념 진위 판단이다. |
| q04 | 해설 | EXEMPT | — | — | — | 해당 없음 | 수직선에 유리수가 빠진 경우의 논리적 반례를 문장으로 설명해야 하며 정적인 몇 점 그림은 무한 성질을 증명하지 못한다. |
| q05 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | √3의 정수 부분 a와 소수 부분 b를 정의로 계산하는 수치 문항이다. |
| q05 | 해설 | EXEMPT | — | — | — | 해당 없음 | 1<√3<2 및 b=√3−1의 식으로 충분하다; 수직선은 계산값 재표시만 한다. |
| q06 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 분모 유리화 식 다섯 개의 옳고 그름 비교이다. |
| q06 | 해설 | EXEMPT | — | — | — | 해당 없음 | 8/√32=√2가 1/2와 다르다는 간단한 대수 검산이다. |
| q07 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | √620의 자리수 이동을 주어진 √6.2 어림값으로 계산한다. |
| q07 | 해설 | EXEMPT | — | — | — | 해당 없음 | 620=6.2×100을 이용한 10배 계산으로 시각적 구조가 늘지 않는다. |
| q08 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 근호 안의 완전제곱수 추출 식 진위 판별이다. |
| q08 | 해설 | EXEMPT | — | — | — | 해당 없음 | √(45/4)=3√5/2를 전개해 보기의 분모4 오류를 대조한다. |
| q09 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | a<0 조건에서 √(a²/49)의 부호 처리 문제다. |
| q09 | 해설 | EXEMPT | — | — | — | 해당 없음 | √(a²)=|a|=−a를 식으로 바로 확인하므로 수직선 그림은 필요 없다. |
| q10 | 문제 | REQUIRED | construction-spike-v1 | q10-problem.plan.json | shallow/full PASS | NOT_VERIFIED | 문항이 수직선의 후보 점 A~E와 좌표3의 단위 정사각형 대각선을 묻고 JS에 연결된 도형이 실제 위치를 제공한다. |
| q10 | 해설 | BENEFICIAL | number-line-figure-v1 | q10-solution.plan.json | shallow/full PASS | NOT_VERIFIED | 해설은 기준점3에서 길이√2를 왼쪽으로 옮기는 호와 정확한 좌표 3−√2를 표시하여 점 E와 값의 연관을 직접 보여 준다. |
| q11 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | 소수·순환소수·근호식 여섯 개 중 무리수의 개수를 분류하는 계산이다. |
| q11 | 해설 | EXEMPT | — | — | — | 해당 없음 | √(1.777…)=4/3 등 각 표현을 유리수/무리수로 환산하면 충분하다. |
| q12 | 문제 | BENEFICIAL | construction-spike-v1 | q12-problem.plan.json | shallow/full PASS | NOT_VERIFIED | 밑변을 맞대고 높이가 차례로 커지는 넓이 8,18,25의 세 정사각형은 계단형 외곽을 파악하는 데 그림이 유익하며 기존 이미지가 있다. |
| q12 | 해설 | BENEFICIAL | construction-spike-v1 | q12-solution.plan.json | shallow/full PASS | NOT_VERIFIED | 해설 도식이 세 정사각형의 외곽선과 폭 5√2+5, 높이5를 결속하면 둘레 2폭+2높이의 이유를 보여 준다. |
| q13 | 문제 | EXEMPT | — | — | EXEMPT JSON OK | 해당 없음 | (2x+a)(2x−a)=4x²−25/9에서 양수 a를 찾는 합차 공식의 미정계수 계산이다. |
| q13 | 해설 | EXEMPT | — | — | — | 해당 없음 | a²=25/9에서 a>0이므로 a=5/3을 선택하는 계수 비교와 부호 판단으로 완결된다. |

## 공식 엔진 실제 모델·그리기 spec 정적 대조

1. **q10 문제, 기존 유지** `construction-spike-v1`: 공식 Python model **11점**, spec OBJECTS **POINT 11 + SEGMENT 5 + EQUATION_LABEL 1 + DIMENSION_LINE 1 = 18**. 문제 원문 3을 엔진 내부 좌표 6으로 두는 2배 화면 정규화(좌표 숫자 자체가 원문 측정 6이라는 조건은 아님). 후보 A~E의 상대 위치는 원문 좌표 −1,0,1,1.2,3−√2에 대응. 단위 정사각형은 내부 한 변2, 대각선 2√2; 화면의 표시 `1`과 좌표 `3`은 원문 단위로 읽는 라벨이다. 정답을 별도 텍스트로 표시하는 새 문제 그림은 만들지 않았다.
2. **q10 해설, 신규** `number-line-figure-v1`: 엔진 `solveNumberLineFigure` 모델 POINTS 행 E=3−√2≈1.585786, 익명 기준점 P0=3. `numberLineFigureSpec`에 점 2개, `la` 왼쪽 작도 호 1개, E 이름과 정확한 근호 좌표 라벨이 존재. 차이 3−(3−√2)=√2를 독립 계산했고 SOURCE 모델에서 원문 길이 1인 정사각형 대각선 √2와 일치한다. 정답을 해설 그림에 표시하는 것은 허용된다.
3. **q12 문제, 기존 유지** `construction-spike-v1`: 정확한 점 **10**, spec POINT **10 + SEGMENT 8 + FILL_REGION 3 = 21**. 영역별 넓이 8/18/25 표시가 원문대로 존재. 한 변 2√2,3√2,5를 주어진 넓이에서 정확히 도출하고 임의 비율을 추가하지 않았다.
4. **q12 해설, 신규** `construction-spike-v1`: 기존 정본의 동일한 exact 10개 정점 좌표를 재사용. spec POINT **10 + SEGMENT 10 + DIMENSION_LINE 2 + FILL_REGION 3 = 25**. 외곽 8개 선분만 BOLD, 내부 경계 2개는 기본선; 총폭 `5sqrt(2)+5`, 최댓높이 `5`가 실제 DIMENSION_LINE 객체에 있다. 독립 둘레 계산 2(2√2+3√2+5)+2·5=10√2+20≈34.1421 cm가 JS 해설·정답 ②와 일치한다. 단위 정사각형 3개의 넓이 구분에 필요한 연한 영역 표시만 유지한다.

위는 엔진이 생성한 **정적 모델/spec의 그려질 필드** 대조다. 실제 SVG/PNG의 화면 픽셀과 학생 UI/A4 검증이 이루어지지 않아 네 축의 DRAWN_FEATURE_PARITY는 **모두 NOT_VERIFIED**, PASS 0이다. 단순 shallow/full PASS를 학생 화면 PASS로 간주하지 않는다.

## 공식 lint·렌더 근거와 후속

- 대상 문제 JSON 13개 + 신규 해설 2개 = **15개 JSON**. `plan-lint.cjs --shallow` **15/15 OK**, `plan-lint.cjs` full **15/15 OK**. 이 가운데 EXEMPT 자리표시자는 11개; 실제 실행형은 4개만이며 shallow/full **4/4 PASS**. 이수중 범위 신규2 / 기존 교정0 / 기존 유지2.
- 공식 의존 폰트 `NotoSansKR.ttf` SHA256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 확인·사용. 엔진 Python·node modules는 공식 고정 환경의 읽기 전용 사본을 사용.
- 공식 `render-plan.mjs` q12 해설 실제 호출: **FAILED, stage=measure, code=ARCHIVE_PREFLIGHT_FAIL**. `/usr/bin/chromium` 런처가 내부 `/usr/lib/chromium/chromium`을 찾지 못해 exit 127. 이 축 SVG/PNG·학생 화면·A4는 **ENV_BLOCKED/NOT_VERIFIED**. 다른 q10 문제·해설 및 q12 문제는 실제 렌더 **NOT_RUN**, 최종 패리티 **NOT_VERIFIED**.
- 신규 ENGINE_CAPABILITY_PENDING **0**, EVIDENCE_DEBT **0**. 기존 별도 미해결은 이전 범위에 유지하며 임의로 PASS로 바꾸지 않는다.
