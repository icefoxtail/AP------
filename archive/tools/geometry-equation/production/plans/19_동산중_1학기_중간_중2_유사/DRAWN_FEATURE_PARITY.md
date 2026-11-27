# DRAWN_FEATURE_PARITY — 19_동산중_1학기_중간_중2_유사

> 최신 main 기준 원문 1:1 대비 및 2026-11-27 플랜 전수검수. 검사 범위는 지정한 유사시험지의 문항·해설 두 축뿐이다.

- 원문 25문항, 두 축 50개. 원문 JS의 모든 문항 content·choices·solution을 대조하고 SVG/배경/면채움 삽입 여부를 확인했다.
- 실행형 JSON에는 흰색 배경, `background`, `fill`, `regions`를 지정하지 않았다. 도형은 선·필요한 표식만 사용한다.
- `plan-lint --shallow` / `plan-lint` 전체 검사는 19개 파일을 대상으로 각각 FAIL 0, OK 19. 아래 LINT=OK/OK는 두 검사를 뜻한다.
- `DRAWN_FEATURE_PARITY=STATIC_MATCH`는 원문↔플랜 좌표·곡선·선분·점선·표식을 수학적으로 1:1 확인했다는 뜻이며 **실제 SVG 화면 관측 PASS는 아니다**. Chromium 실행 파일이 없어 렌더 결과 시각 관측은 `ENV_BLOCKED`다.
- `EXEMPT`는 원문에 그림이 없고 문항/해설의 계산·텍스트만으로 충분하여 SVG를 추가하지 않은 축이다.
- `CONTENT_CONFLICT`는 원문의 수학적 모순 때문에 도형을 확정할 수 없는 축이다.
- `ENGINE_CAPABILITY_PENDING`는 일부 실행 가능한 플랜은 있으나 요구한 시각 요소가 엔진의 표현 범위 밖인 축이다.

| qid | 축 | 원문 대비 그릴 요소·판정 근거 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 01 | 문항 | 유한소수·순환소수 판단 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 01 | 해설 | 유한소수·순환소수 판단 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 02 | 문항 | 유리수와 소수 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 02 | 해설 | 유리수와 소수 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 03 | 문항 | 순환소수의 분수 변환 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 03 | 해설 | 순환소수의 분수 변환 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 04 | 문항 | 분수·소수 계산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 04 | 해설 | 분수·소수 계산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 05 | 문항 | 유한소수 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 05 | 해설 | 유한소수 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 06 | 문항 | 소인수분해 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 06 | 해설 | 소인수분해 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 07 | 문항 | 순환마디 계산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 07 | 해설 | 순환마디 계산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 08 | 문항 | 분모 10x가 유한소수가 되지 않는 한 자리 자연수 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 08 | 해설 | 분모 10x가 유한소수가 되지 않는 한 자리 자연수 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 09 | 문항 | 지수법칙 계산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 09 | 해설 | 지수법칙 계산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 10 | 문항 | 지수법칙 비교 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 10 | 해설 | 지수법칙 비교 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 11 | 문항 | 단항식 계산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 11 | 해설 | 단항식 계산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 12 | 문항 | 지수법칙 식 정리 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 12 | 해설 | 지수법칙 식 정리 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 13 | 문항 | 3x²(−2xy³)^a의 지수 a,b,c 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 13 | 해설 | 3x²(−2xy³)^a의 지수 a,b,c 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 14 | 문항 | 문자식을 바르게 계산하는 선지 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 14 | 해설 | 문자식을 바르게 계산하는 선지 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 15 | 문항 | 괄호 전개 후 Ax+By²+C의 계수 합 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 15 | 해설 | 괄호 전개 후 Ax+By²+C의 계수 합 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 16 | 문항 | 직사각형 네 변·네 직각, 높이 4xy, 가로 6x²+2xy² — 기본 면채움 없음, 높이/가로 치수선, 직각표식 4개 | construction-spike-v1 | q16-problem.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 16 | 해설 | 직사각형 네 변·네 직각, 높이 4xy, 가로 6x²+2xy² — 기본 면채움 없음, 높이/가로 치수선, 직각표식 4개 | construction-spike-v1 | q16-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 17 | 문항 | 일차부등식 판별 선지 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 17 | 해설 | 일차부등식 판별 선지 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 18 | 문항 | a<b 동치 부등식 선지 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 18 | 해설 | a<b 동치 부등식 선지 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 19 | 문항 | 부등식 x<5, 열린 끝점 5 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 19 | 해설 | 부등식 x<5, 열린 끝점 5 | number-line-figure-v1 | q19-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 20 | 문항 | 부등식 x<1/2, 열린 끝점 1/2 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 20 | 해설 | 부등식 x<1/2, 열린 끝점 1/2 | number-line-figure-v1 | q20-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 21 | 문항 | 예산 6000원, 총 12개 중 볼펜 정수 1~6 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 21 | 해설 | 예산 6000원, 총 12개 중 볼펜 정수 1~6 | number-line-figure-v1 | q21-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 22 | 문항 | 단항식 곱셈 오류 역산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 22 | 해설 | 단항식 곱셈 오류 역산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 23 | 문항 | x≥(3a−6)/2, 음의 정수해 없음 → a>4/3 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 23 | 해설 | x≥(3a−6)/2, 음의 정수해 없음 → a>4/3 | number-line-figure-v1 | q23-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 24 | 문항 | 자연수 x=1,…,7의 채운 끝점과 정수 표식 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 24 | 해설 | 자연수 x=1,…,7의 채운 끝점과 정수 표식 | number-line-figure-v1 | q24-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 25 | 문항 | 걷기·버스 총 18km, 0<x≤4.5의 거리 구간 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 25 | 해설 | 걷기·버스 총 18km, 0<x≤4.5의 거리 구간 | number-line-figure-v1 | q25-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |

## 검수 범위와 근거

- 문항과 해설을 각각 독립 축으로 기록했다. 점/좌표, 보조선·점선, 직각, 길이·치수선, 곡선 및 끝점, 정수 범위에 대해 sourceConditions와 plan graphPlan/mathPlan을 대조했다.
- 실제 SVG 파일, 손수 SVG, 흰색 바탕 사각형, 시각적으로 임의 생성한 면 채움은 추가하지 않았다.
- 최종 그림에 대한 DOM/픽셀 관측은 브라우저 본체 부재로 아직 실행 불가하다. 이에 `STATIC_MATCH`를 `VISUAL_PASS`로 간주하지 않는다.
