# 신흥중 21번대 유사시험지 SVG 플랜 — 문제·해설 전수 대조

- 원문: `archive/exams/similar/middle/m2/1mid/21_신흥중_1학기_중간_중2_유사.js` (SHA-256 `5268f622f001a5eb5091cd84a97e0e16237c47bb0977670e848904601329bbf1`)
- 비교 범위: `content`·`choices`와 각 `solution`의 문자/수치/도형, 24문항 × 문제·해설 = 48축 전수.
- 표의 `plan`은 **이 문서와 같은 폴더 내**의 실행 가능한 JSON 파일명이다. `OK/OK`는 `plan-lint.cjs` shallow/full 모두 통과, `PASS`는 플랜에 **그려진 정적 요소**가 원문에 맞는다는 필드 단위 판정이다. 실제 SVG/PNG Archive 렌더링은 환경 제약으로 수행하지 못했다.
- 요약: 48축 중 `EXEMPT` 42, 그릴 실익이 있는 6축 모두 `PASS` 6. 신규 JSON 6개 shallow/full `OK` 6/6. 임의 기본 흰색 배경/면 채움 없음.

| qid | 축 | 판정 | capability | plan | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 원문과의 일치 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT | — | — | N/A | N/A | 유한·순환소수와 유리수에 관한 옳은 문장 두 개를 고르는 선다형 |
| q01 | 해설 | EXEMPT | — | — | N/A | N/A | 선택지의 수치·성질 판단, 도형 없음 |
| q02 | 문제 | EXEMPT | — | — | N/A | N/A | 순환소수 다섯 수 중 최댓값 비교 |
| q02 | 해설 | EXEMPT | — | — | N/A | N/A | 소수 각 자리의 크기 비교 |
| q03 | 문제 | EXEMPT | — | — | N/A | N/A | 유한소수로 쓸 수 있는 분수 선택 |
| q03 | 해설 | EXEMPT | — | — | N/A | N/A | 기약분수 분모의 2·5 소인수 판별 |
| q04 | 문제 | EXEMPT | — | — | N/A | N/A | 7/27의 소수점 아래 50번째 자리 숫자 |
| q04 | 해설 | EXEMPT | — | — | N/A | N/A | 순환마디의 길이와 나머지 계산 |
| q05 | 문제 | EXEMPT | — | — | N/A | N/A | 순환소수 표기의 참/거짓 판별 |
| q05 | 해설 | EXEMPT | — | — | N/A | N/A | 순환마디 점 표기·개념 확인 |
| q06 | 문제 | EXEMPT | — | — | N/A | N/A | 3.25757…를 분수로 만들 식 선택 |
| q06 | 해설 | EXEMPT | — | — | N/A | N/A | 소수식 양변에 10·1000을 곱한 후 소거 |
| q07 | 문제 | EXEMPT | — | — | N/A | N/A | 0.53434…의 분수화 빈칸 (가)~(마) |
| q07 | 해설 | EXEMPT | — | — | N/A | N/A | 제시된 문자 풀이 과정의 각 칸 수치 검증 |
| q08 | 문제 | EXEMPT | — | — | N/A | N/A | 4³ 네 항을 단일 거듭제곱으로 나타냄 |
| q08 | 해설 | EXEMPT | — | — | N/A | N/A | 4×4³=4⁴ 지수계산 |
| q09 | 문제 | EXEMPT | — | — | N/A | N/A | 지수법칙 명제의 참/거짓 판별 |
| q09 | 해설 | EXEMPT | — | — | N/A | N/A | 거듭제곱 법칙별 수식 대조 |
| q10 | 문제 | EXEMPT | — | — | N/A | N/A | ((−2yᵃ)/(3x²))ᵇ = cy¹²/(27xᵈ)의 지수 비교 |
| q10 | 해설 | EXEMPT | — | — | N/A | N/A | a,b,c,d의 계수·지수 연립 계산 |
| q11 | 문제 | EXEMPT | — | — | N/A | N/A | 24⁸/36⁴, (4⁵+4⁵)/(2⁶+2⁶)의 지수 차 |
| q11 | 해설 | EXEMPT | — | — | N/A | N/A | 동일 밑의 지수 정리 |
| q12 | 문제 | EXEMPT | — | — | N/A | N/A | 2ˣ÷2⁴=32의 자연수해 |
| q12 | 해설 | EXEMPT | — | — | N/A | N/A | 2의 지수 비교 |
| q13 | 문제 | EXEMPT | — | — | N/A | N/A | 지수법칙 선택지 중 옳지 않은 명제 |
| q13 | 해설 | EXEMPT | — | — | N/A | N/A | 지수의 합·곱·나눗셈 법칙 검증 |
| q14 | 문제 | BENEFICIAL | solid-figure-v1 | `q14-problem.plan.json` | OK/OK | PASS | 원뿔의 반지름 `3ab`와 높이 `h`의 내측 높이선·반지름선·문자 라벨. 정해지지 않은 외형 길이 비는 **모식도**로만 표시, 원문에 없는 `cm` 단위 제거 |
| q14 | 해설 | BENEFICIAL | solid-figure-v1 | `q14-solution.plan.json` | OK/OK | PASS | `r=3ab`, `V=πr²h/3`에서 계산한 `h=9a−6b`를 수직 높이선에 표시; 면 채움 없음 |
| q15 | 문제 | EXEMPT | — | — | N/A | N/A | 단항식 A=3a⁴/(9a²b²), B=(2/3)ab²의 몫 |
| q15 | 해설 | EXEMPT | — | — | N/A | N/A | A/B의 지수·분수계수 정리 |
| q16 | 문제 | EXEMPT | — | — | N/A | N/A | 6x(x/3+1)와 xy 포함 분수식의 전개 |
| q16 | 해설 | EXEMPT | — | — | N/A | N/A | ax²+by²의 계수 비교 |
| q17 | 문제 | EXEMPT | — | — | N/A | N/A | 부등식이 아닌 것을 두 개 고르는 개념 문제 |
| q17 | 해설 | EXEMPT | — | — | N/A | N/A | 관계식 중 부등호 성립 여부 확인 |
| q18 | 문제 | EXEMPT | — | — | N/A | N/A | 말로 표현된 비교 관계와 부등식의 대응 |
| q18 | 해설 | EXEMPT | — | — | N/A | N/A | 700원×개수 등을 포함한 문장-부등식 검산 |
| q19 | 문제 | EXEMPT | — | — | N/A | N/A | 일차부등식, 해를 묻는 문자식 |
| q19 | 해설 | BENEFICIAL | number-line-figure-v1 | `q19-solution.plan.json` | OK/OK | PASS | 경계 `3` 열린 점, 해 `x<3`의 왼쪽 반직선 |
| q20 | 문제 | EXEMPT | — | — | N/A | N/A | 자연수해 개수 조건은 부등식으로 충분 |
| q20 | 해설 | BENEFICIAL | number-line-figure-v1 | `q20-solution.plan.json` | OK/OK | PASS | `x<23/5`, 열린 경계 `23/5`, 자연수 점 1·2·3·4와 제외되는 5를 각각 보임 |
| q21 | 문제 | EXEMPT | — | — | N/A | N/A | 꽃 구매 단가·배달비의 문장 조건 |
| q21 | 해설 | BENEFICIAL | number-line-figure-v1 | `q21-solution.plan.json` | OK/OK | PASS | 가게 `900x`, 도매 `600x+2400` 비교로 x>8, 8 열린 경계와 최소 자연수 9 강조 |
| q22 | 문제 | EXEMPT | — | — | N/A | N/A | 순환소수 계산 |
| q22 | 해설 | EXEMPT | — | — | N/A | N/A | 분모 소거·분수화 |
| q23 | 문제 | EXEMPT | — | — | N/A | N/A | 순환소수와 분수 연산 |
| q23 | 해설 | EXEMPT | — | — | N/A | N/A | 수치 연산 |
| q24 | 문제 | EXEMPT | — | — | N/A | N/A | 왕복 거리와 속도·휴식시간 문장제 |
| q24 | 해설 | BENEFICIAL | number-line-figure-v1 | `q24-solution.plan.json` | OK/OK | PASS | `x/80+x/60+15≤50`에서 `0≤x≤1200m`, 0·1200 닫힌 경계와 허용 구간 표시 |

## 시각 검수 유의점

1. `q14`의 모식 원뿔은 실제 `3ab`, `9a−6b`에 수치값을 대입한 입체 크기가 아니다. 플랜의 수치 `radius=3, height=6`은 **그림의 투시비에만** 쓰며, 눈에 보이는 길이 라벨은 정확한 문자식이다. 단위는 원문에 없으므로 플랜에도 없다.
2. `q19`~`q24`의 수직선은 해설 축에만 도입했다. 문제 축은 풀이 결과 노출을 방지하기 위해 미작성이다.
3. 모든 작성 JSON에서 배경 흰색 채움과 임의 면 채움이 없다. 길이·점·부등호 열린/닫힌 경계는 엔진의 표준 표기 필드로 적었다.
4. 실제 SVG/PNG Archive 렌더와 눈으로 보는 parity는 **ENV_BLOCKED**: Playwright Chrome이 설치되지 않았고 `/usr/bin/chromium`도 실행 본체가 없다. 따라서 full `plan-lint`와 구분한다.
