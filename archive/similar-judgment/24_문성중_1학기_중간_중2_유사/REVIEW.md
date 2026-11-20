# 검수 묶음 — 24_문성중_1학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 23개 / 검사 PASS 21, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 7, 2단계 13, 3단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q2**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q19**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다. 다음 빈칸을 채워 $A+B\times C$의 값을 구하면? [4점]


$$\dfrac{9}{2^{3}\times5}=\dfrac{A}{2^{3}\times5^{3}}=\dfrac{A}{B}=C$$

**보기** ① $450$  ② $225$  ③ $350$  ④ $525$  ⑤ $675$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모를 $10$의 거듭제곱인 $10^3=1000$으로 만들기 위해 분모와 분자에 $5^2=25$를 곱한다.
2. \frac{9}{2^3\times5}=\frac{9\times5^2}{2^3\times5\times5^2}=\frac{9\times25}{2^3\times5^3}=\frac{225}{1000}=0.225
3. 따라서 빈칸 $A, B, C$의 값은 각각 다음과 같다.
4. A=225, \quad B=1000, \quad C=0.225
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다.」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수로 나타내기 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별**
- 이유: Q1번 문항은 M2-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 450)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_FINITE_DECIMAL_CONVERSION_BLANK → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_DECIMAL_POWERS_OF_TEN_MATCH → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q1번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 450)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 450)

**4칸**
- given: 소수←stem:「분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다.」
- goal: 분수←stem:「분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다.」
- method: 거듭제곱(NAMED)←solution:「분모를 $10$의 거듭제곱인 $10^3=1000$으로 만들기 위해 분모와 분자에 $5^2=25$를 곱한다.」
- condition: (없음)

**how** Q1번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 450)

<details><summary>저장 해설 (판정 검토용)</summary>

분모를 $10$의 거듭제곱인 $10^3=1000$으로 만들기 위해 분모와 분자에 $5^2=25$를 곱한다.
$$
\frac{9}{2^3\times5}=\frac{9\times5^2}{2^3\times5\times5^2}=\frac{9\times25}{2^3\times5^3}=\frac{225}{1000}=0.225
$$
따라서 빈칸 $A, B, C$의 값은 각각 다음과 같다.
$$
A=225, \quad B=1000, \quad C=0.225
$$
구하는 식의 값을 계산한다.
$$
\begin{aligned}
A+B\times C &= 225 + 1000\times0.225 \
&= 225 + 225 \
&= 450
\end{aligned}
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

다음 분수 중에서 순환소수로만 나타낼 수 있는 것은? [3점]

**보기** ① $\dfrac{14}{70}$  ② $\dfrac{21}{2^{2}\times3^{2}\times5}$  ③ $\dfrac{27}{180}$  ④ $\dfrac{63}{2^{3}\times3^{2}\times7}$  ⑤ $\dfrac{45}{2\times3^{2}\times5^{2}}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 기약분수로 나타내었을 때 분모의 소인수에 $2$ 또는 $5$ 이외의 소인수가 있으면 순환소수이다.
2. \begin{aligned}
3. \text{① } & \frac{14}{70} = \frac{1}{5} \implies \text{분모 소인수 } 5 \text{ (유한소수)} \
4. \text{② } & \frac{21}{2^2\times3^2\times5} = \frac{3\times7}{2^2\times9\times5} = \frac{7}{2^2\times3\times5} \implies \text{분모에 소인수 } 3\text{이 남아 순환소수} \
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 분수 중에서 순환소수로만 나타낼 수 있는 것은?」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] (원천과 같음)
- 이유: Q2번 문항은 M2-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 14)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_FINITE_DECIMAL_TEST → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_REPEATING_DECIMAL_FACTOR_SEARCH → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q2번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 14)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 14)

**4칸**
- given: 소수←stem:「다음 분수 중에서 순환소수로만 나타낼 수 있는 것은?」
- goal: 분수←stem:「다음 분수 중에서 순환소수로만 나타낼 수 있는 것은?」
- method: 소인수(NAMED)←solution:「기약분수로 나타내었을 때 분모의 소인수에 $2$ 또는 $5$ 이외의 소인수가 있으면 순환소수이다.」
- condition: (없음)

**how** Q2번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 14)

<details><summary>저장 해설 (판정 검토용)</summary>

기약분수로 나타내었을 때 분모의 소인수에 $2$ 또는 $5$ 이외의 소인수가 있으면 순환소수이다.
$$
\begin{aligned}
\text{① } & \frac{14}{70} = \frac{1}{5} \implies \text{분모 소인수 } 5 \text{ (유한소수)} \
\text{② } & \frac{21}{2^2\times3^2\times5} = \frac{3\times7}{2^2\times9\times5} = \frac{7}{2^2\times3\times5} \implies \text{분모에 소인수 } 3\text{이 남아 순환소수} \
\text{③ } & \frac{27}{180} = \frac{3}{20} = \frac{3}{2^2\times5} \implies \text{분모 소인수 } 2, 5 \text{ (유한소수)} \
\text{④ } & \frac{63}{2^3\times3^2\times7} = \frac{63}{2^3\times63} = \frac{1}{2^3} \implies \text{분모 소인수 } 2 \text{ (유한소수)} \
\text{⑤ } & \frac{45}{2\times3^2\times5^2} = \frac{45}{2\times9\times25} = \frac{1}{2\times5} \implies \text{분모 소인수 } 2, 5 \text{ (유한소수)}
\end{aligned}
$$
따라서 순환소수로만 나타낼 수 있는 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 수의 대소관계를 바르게 나타낸 것은? [3점]

**보기** ① $0.45 > 0.\dot{4}\dot{5}$  ② $3.2\dot{7} < 3.27$  ③ $0.62 > 0.\dot{6}$  ④ $0.345 < 0.3\dot{4}\dot{5}$  ⑤ $5.\dot{8}\dot{1} > 5.81\dot{8}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 순환소수를 소수 전개 꼴로 펼쳐서 소수점 아래 자릿수를 순서대로 비교한다.
2. \begin{aligned}
3. \text{① } & 0.45 = 0.450000\dots, \quad 0.\dot{4}\dot{5} = 0.454545\dots \implies 0.45 < 0.\dot{4}\dot{5} \text{ (거짓)} \
4. \text{② } & 3.2\dot{7} = 3.277777\dots, \quad 3.27 = 3.270000\dots \implies 3.2\dot{7} > 3.27 \text{ (거짓)} \
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 수의 대소관계를 바르게 나타낸 것은?」
**RPM** M2-RPM-005 [유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 대소비교 → 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로**
- 이유: Q3번 문항은 M2-RPM-005에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0.45)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_DECIMAL_MAGNITUDE_COMPARE → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_DECIMAL_EXPANSION_PAIR_COMPARE → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q3번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0.45)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 0.45)

**4칸**
- given: 대소←stem:「두 수의 대소관계를 바르게 나타낸 것은?」
- goal: 대소관계←stem:「두 수의 대소관계를 바르게 나타낸 것은?」
- method: 소수(NAMED)←solution:「순환소수를 소수 전개 꼴로 펼쳐서 소수점 아래 자릿수를 순서대로 비교한다.」
- condition: (없음)

**how** Q3번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 0.45)

<details><summary>저장 해설 (판정 검토용)</summary>

순환소수를 소수 전개 꼴로 펼쳐서 소수점 아래 자릿수를 순서대로 비교한다.
$$
\begin{aligned}
\text{① } & 0.45 = 0.450000\dots, \quad 0.\dot{4}\dot{5} = 0.454545\dots \implies 0.45 < 0.\dot{4}\dot{5} \text{ (거짓)} \
\text{② } & 3.2\dot{7} = 3.277777\dots, \quad 3.27 = 3.270000\dots \implies 3.2\dot{7} > 3.27 \text{ (거짓)} \
\text{③ } & 0.62 = 0.620000\dots, \quad 0.\dot{6} = 0.666666\dots \implies 0.62 < 0.\dot{6} \text{ (거짓)} \
\text{④ } & 0.345 = 0.345000\dots, \quad 0.3\dot{4}\dot{5} = 0.345454\dots \implies 0.345 < 0.3\dot{4}\dot{5} \text{ (참)} \
\text{⑤ } & 5.\dot{8}\dot{1} = 5.818181\dots, \quad 5.81\dot{8} = 5.818888\dots \implies 5.\dot{8}\dot{1} < 5.81\dot{8} \text{ (거짓)}
\end{aligned}
$$
따라서 바르게 나타낸 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은? [4점]

**보기** ① $9$  ② $12$  ③ $15$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분수 $\dfrac{29}{11}$를 나눗셈하여 소수로 나타낸다.
2. \frac{29}{11} = 2.636363\dots = 2.\dot{6}\dot{3}
3. 순환마디는 $63$으로 숫자의 개수는 $2$개이다.
4. 소수점 아래 $n$번째 자리의 숫자는 $n$을 순환마디의 길이 $2$로 나눈 나머지에 의해 결정된다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은?」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별**
- 이유: Q4번 문항은 M2-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 29)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q4번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 29)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 29)

**4칸**
- given: 소수←stem:「분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은?」
- goal: 분수←stem:「분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은?」
- method: 나눗셈(NAMED)←solution:「분수 $\dfrac{29}{11}$를 나눗셈하여 소수로 나타낸다.」
- condition: (없음)

**how** Q4번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 29)

<details><summary>저장 해설 (판정 검토용)</summary>

분수 $\dfrac{29}{11}$를 나눗셈하여 소수로 나타낸다.
$$
\frac{29}{11} = 2.636363\dots = 2.\dot{6}\dot{3}
$$
순환마디는 $63$으로 숫자의 개수는 $2$개이다.
소수점 아래 $n$번째 자리의 숫자는 $n$을 순환마디의 길이 $2$로 나눈 나머지에 의해 결정된다.
$$
\begin{aligned}
45 &= 2 \times 22 + 1 \implies \text{나머지 } 1 \text{이므로 소수점 아래 45번째 자리의 숫자는 } 6 \
46 &= 2 \times 23 + 0 \implies \text{나머지 } 0 \text{이므로 소수점 아래 46번째 자리의 숫자는 } 3
\end{aligned}
$$
따라서 두 숫자의 곱을 계산한다.
$$
6 \times 3 = 18
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은? (단, $a, b$는 한 자리의 자연수이고 $a$와 $b$는 소수(prime number)이며, $a > b$이다.) [5점]

**보기** ① $0.\dot{1}$  ② $0.\dot{2}$  ③ $0.\dot{3}$  ④ $0.\dot{4}$  ⑤ $0.\dot{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 순환소수를 분수로 나타내어 합을 구한다.
2. \begin{aligned}
3. 0.\dot{a}\dot{b} &= \frac{10a+b}{99}, \quad 0.\dot{b}\dot{a} = \frac{10b+a}{99} \
4. 0.\dot{a}\dot{b} + 0.\dot{b}\dot{a} &= \frac{(10a+b) + (10b+a)}{99} = \frac{11(a+b)}{99} = \frac{a+b}{9}
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은?」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별**
- 이유: Q5번 문항은 M2-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 prime)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_REPEATING_DECIMAL_ALGEBRAIC_RELATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_REPEATING_DECIMAL_SUM_DIFFERENCE_PRIME → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q5번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 prime)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 prime)

**4칸**
- given: 소수←stem:「두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은?」
- goal: 순환소수←stem:「두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은?」
- method: 분수(NAMED)←solution:「두 순환소수를 분수로 나타내어 합을 구한다.」
- condition: (없음)

**how** Q5번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 prime)

<details><summary>저장 해설 (판정 검토용)</summary>

두 순환소수를 분수로 나타내어 합을 구한다.
$$
\begin{aligned}
0.\dot{a}\dot{b} &= \frac{10a+b}{99}, \quad 0.\dot{b}\dot{a} = \frac{10b+a}{99} \
0.\dot{a}\dot{b} + 0.\dot{b}\dot{a} &= \frac{(10a+b) + (10b+a)}{99} = \frac{11(a+b)}{99} = \frac{a+b}{9}
\end{aligned}
$$
주어진 조건에서 두 순환소수의 합이 $0.\dot{7} = \dfrac{7}{9}$이므로
$$
\frac{a+b}{9} = \frac{7}{9} \implies a+b = 7
$$
$a, b$는 한 자리의 자연수이자 소수(prime number)이고 $a > b$이다.
한 자리의 소수는 $2, 3, 5, 7$이므로 두 소수의 합이 $7$이 되는 쌍은 다음과 같다.
$$
a = 5, \quad b = 2
$$
따라서 $0.\dot{a}-0.\dot{b}$의 값을 계산한다.
$$
\begin{aligned}
0.\dot{a}-0.\dot{b} &= 0.\dot{5} - 0.\dot{2} \
&= \frac{5}{9} - \frac{2}{9} \
&= \frac{3}{9} = \frac{1}{3} = 0.\dot{3}
\end{aligned}
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

어떤 기약분수를 소수로 나타내는데, 민우는 분모를 잘못 보아 $0.41\dot{6}$으로 나타내고, 지호는 분자를 잘못 보아 $0.\dot{7}\dot{2}$로 나타내었다. 처음 기약분수를 소수로 바르게 나타낸 것은? [4점]

**보기** ① $0.\dot{4}\dot{5}$  ② $0.4\dot{5}$  ③ $0.\dot{5}\dot{4}$  ④ $0.\dot{4}$  ⑤ $0.45$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 학생이 잘못 본 분수를 기약분수로 나타내어 바른 분자와 분모를 찾는다.
2. 1단계: 민우가 얻은 순환소수를 기약분수로 변환한다.
3. 0.41\dot{6} = \frac{416-41}{900} = \frac{375}{900} = \frac{5}{12}
4. 민우는 분모를 잘못 보았으므로 원래 기약분수의 분자는 올바르게 보았다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 기약분수를 소수로 나타내는데, 민우는 분모를 잘못 보아 $0.41\dot{6}$으로 나타내고, 지호는 분자를 잘못 보아 $0.\dot{7}\dot{2}$로 나타내었다.」
**RPM** M2-RPM-005 [유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 조건을 만족하는 유리수 → 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로**
- 이유: Q6번 문항은 M2-RPM-005에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0.41)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_REPEATING_DECIMAL_RECONSTRUCT_FRACTION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_MISTAKEN_REPEATING_DECIMAL_FRACTION_RECOVERY → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q6번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0.41)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 0.41)

**4칸**
- given: 소수←stem:「어떤 기약분수를 소수로 나타내는데, 민우는 분모를 잘못 보아 $0.41\dot{6}$으로 나타내고, 지호는 분자를 잘못 보아 $0.\dot{7}\dot{2}$로 나타내었다.」
- goal: 분수←stem:「어떤 기약분수를 소수로 나타내는데, 민우는 분모를 잘못 보아 $0.41\dot{6}$으로 나타내고, 지호는 분자를 잘못 보아 $0.\dot{7}\dot{2}$로 나타내었다.」
- method: 약분(NAMED)←solution:「두 학생이 잘못 본 분수를 기약분수로 나타내어 바른 분자와 분모를 찾는다.」
- condition: (없음)

**how** Q6번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 0.41)

<details><summary>저장 해설 (판정 검토용)</summary>

두 학생이 잘못 본 분수를 기약분수로 나타내어 바른 분자와 분모를 찾는다.
1단계: 민우가 얻은 순환소수를 기약분수로 변환한다.
$$
0.41\dot{6} = \frac{416-41}{900} = \frac{375}{900} = \frac{5}{12}
$$
민우는 분모를 잘못 보았으므로 원래 기약분수의 분자는 올바르게 보았다. 따라서 처음 기약분수의 분자는 $5$이다.


2단계: 지호가 얻은 순환소수를 기약분수로 변환한다.
$$
0.\dot{7}\dot{2} = \frac{72}{99} = \frac{8}{11}
$$
지호는 분자를 잘못 보았으므로 원래 기약분수의 분모는 올바르게 보았다. 따라서 처음 기약분수의 분모는 $11$이다.


3단계: 처음 기약분수를 구하고 소수로 나타낸다.
$$
\text{처음 기약분수} = \frac{5}{11}
$$
이를 소수로 나타내면
$$
\frac{5}{11} = 0.454545\dots = 0.\dot{4}\dot{5}
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중에서 옳은 것만을 있는 대로 고른 것은? [4점]


ㄱ. 순환소수 중에는 유리수가 아닌 것도 있다.
ㄴ. 모든 유한소수는 분수로 나타낼 수 있다.
ㄷ. 기약분수의 분모를 소인수분해했을 때 2 또는 5 이외의 소인수가 있으면 순환소수로 나타내어진다.
ㄹ. 분수를 소수로 나타내었을 때 순환하지 않는 무한소수가 되는 것도 있다.

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄷ  ③ ㄴ, ㄹ  ④ ㄱ, ㄷ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 유리수와 소수의 정의 및 분류 체계를 각 보기별로 확인한다.
2. \begin{aligned}
3. \text{ㄱ: } & \text{모든 순환소수는 분수 } \frac{a}{b} \text{ (} a, b\text{는 정수, } b \ne 0\text{) 꼴로 나타낼 수 있으므로 항상 유리수이다.
4. (거짓)} \
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 옳은 것만을 있는 대로 고른 것은?」
**RPM** M2-RPM-005 [유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로] (원천과 같음)
- 이유: Q7번 문항은 M2-RPM-005에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_RATIONAL_DECIMAL_THEORY_CHECK → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_RATIONAL_DECIMAL_TRUE_FALSE_SET → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q7번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 유리수←stem:「순환소수 중에는 유리수가 아닌 것도 있다.」
- goal: 소수←stem:「순환소수 중에는 유리수가 아닌 것도 있다.」
- method: 분류(NAMED)←solution:「유리수와 소수의 정의 및 분류 체계를 각 보기별로 확인한다.」
- condition: (없음)

**how** Q7번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

유리수와 소수의 정의 및 분류 체계를 각 보기별로 확인한다.
$$
\begin{aligned}
\text{ㄱ: } & \text{모든 순환소수는 분수 } \frac{a}{b} \text{ (} a, b\text{는 정수, } b \ne 0\text{) 꼴로 나타낼 수 있으므로 항상 유리수이다. (거짓)} \
\text{ㄴ: } & \text{모든 유한소수는 분모가 } 10\text{의 거듭제곱인 분수로 나타낼 수 있다. (참)} \
\text{ㄷ: } & \text{기약분수의 분모에 } 2\text{ 또는 } 5 \text{ 이외의 소인수가 있으면 유한소수가 될 수 없으므로 무한소수(순환소수)가 된다. (참)} \
\text{ㄹ: } & \text{분수는 유리수이므로 소수로 나타내면 항상 유한소수이거나 순환소수이다. 순환하지 않는 무한소수가 될 수 없다. (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ㄴ, ㄷ이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$(2^{6})^{3} \div (2^{\Box})^{2} = 2^{10}$일 때, $\Box$ 안에 알맞은 수는? [3점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지수법칙을 이용하여 좌변의 식을 정리한다.
2. \begin{aligned}
3. (2^6)^3 &= 2^{6 \times 3} = 2^{18} \
4. (2^{\Box})^2 &= 2^{2 \times \Box}
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(2^{6})^{3} \div (2^{\Box})^{2} = 2^{10}$일 때, $\Box$ 안에 알맞은 수는?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: Q8번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_EXPONENT_LAW_EQUATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_EXPONENT_DIVISION_VARIABLE_SOLVE → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q8번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 지수←solution:「지수법칙을 이용하여 좌변의 식을 정리한다.」
- goal: 지수법칙←solution:「지수법칙을 이용하여 좌변의 식을 정리한다.」
- method: 정리(NAMED)←solution:「지수법칙을 이용하여 좌변의 식을 정리한다.」
- condition: (없음)

**how** Q8번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

지수법칙을 이용하여 좌변의 식을 정리한다.
$$
\begin{aligned}
(2^6)^3 &= 2^{6 \times 3} = 2^{18} \
(2^{\Box})^2 &= 2^{2 \times \Box}
\end{aligned}
$$
나눗셈 지수법칙에 의하여
$$
(2^6)^3 \div (2^{\Box})^2 = 2^{18 - 2\Box}
$$
우변이 $2^{10}$이므로 지수를 비교하면
$$
\begin{aligned}
18 - 2\Box &= 10 \
2\Box &= 8 \
\Box &= 4
\end{aligned}
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$A = 2^{x-1}$일 때, $8^{x}$을 $A$에 관한 식으로 나타내면? [4점]

**보기** ① $2A^{3}$  ② $4A^{2}$  ③ $4A^{3}$  ④ $8A^{2}$  ⑤ $8A^{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A$와 $2^x$의 관계를 먼저 구한다.
2. \begin{aligned}
3. A &= 2^{x-1} = \frac{2^x}{2} \
4. 2^x &= 2A
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A = 2^{x-1}$일 때, $8^{x}$을 $A$에 관한 식으로 나타내면?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: Q9번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_EXPONENT_SUBSTITUTION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_EXPONENT_BASE_CHANGE_REPRESENTATION → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q9번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 관계←solution:「$A$와 $2^x$의 관계를 먼저 구한다.」
- goal: 거듭제곱←solution:「$8^x$을 밑이 $2$인 거듭제곱으로 변형한다.」
- method: 제곱(NAMED)←solution:「$8^x$을 밑이 $2$인 거듭제곱으로 변형한다.」
- condition: (없음)

**how** Q9번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

$A$와 $2^x$의 관계를 먼저 구한다.
$$
\begin{aligned}
A &= 2^{x-1} = \frac{2^x}{2} \
2^x &= 2A
\end{aligned}
$$
$8^x$을 밑이 $2$인 거듭제곱으로 변형한다.
$$
\begin{aligned}
8^x &= (2^3)^x = (2^x)^3
\end{aligned}
$$
여기에 $2^x = 2A$를 대입한다.
$$
\begin{aligned}
(2^x)^3 &= (2A)^3 \
&= 2^3 \times A^3 \
&= 8A^3
\end{aligned}
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때, 자연수 $n$의 값은? [5점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변의 공통인수 $2^n$을 묶어 식을 정리한다.
2. \begin{aligned}
3. 2^{n+3} + 2^{n+2} + 2^{n+1} &= 2^n \times 2^3 + 2^n \times 2^2 + 2^n \times 2^1 \
4. &= 2^n \times (8 + 4 + 2) \
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때, 자연수 $n$의 값은?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] (원천과 같음)
- 이유: Q10번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 224)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_EXPONENT_SUM_EQUATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_EXPONENT_FACTOR_OUT_SUM_SOLVE → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q10번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 224)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 224)

**4칸**
- given: 자연수←stem:「$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때, 자연수 $n$의 값은?」
- goal: 인수←solution:「좌변의 공통인수 $2^n$을 묶어 식을 정리한다.」
- method: 공통(NAMED)←solution:「좌변의 공통인수 $2^n$을 묶어 식을 정리한다.」
- condition: (없음)

**how** Q10번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 224)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변의 공통인수 $2^n$을 묶어 식을 정리한다.
$$
\begin{aligned}
2^{n+3} + 2^{n+2} + 2^{n+1} &= 2^n \times 2^3 + 2^n \times 2^2 + 2^n \times 2^1 \
&= 2^n \times (8 + 4 + 2) \
&= 2^n \times 14
\end{aligned}
$$
이 식이 $224$와 같으므로
$$
\begin{aligned}
2^n \times 14 &= 224 \
2^n &= \frac{224}{14} = 16
\end{aligned}
$$
$16 = 2^4$이므로 지수를 비교하면
$$
n = 4
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$(x^{3}y^{2})^{4} \times (x^{5}y^{3})^{2} = x^{a}y^{b}$일 때, $a+b$의 값은? [4점]

**보기** ① $36$  ② $32$  ③ $28$  ④ $24$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지수법칙을 적용하여 거듭제곱을 먼저 전개한다.
2. \begin{aligned}
3. (x^3 y^2)^4 &= (x^3)^4 \times (y^2)^4 = x^{12} y^8 \
4. (x^5 y^3)^2 &= (x^5)^2 \times (y^3)^2 = x^{10} y^6
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x^{3}y^{2})^{4} \times (x^{5}y^{3})^{2} = x^{a}y^{b}$일 때, $a+b$의 값은?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: Q11번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 36)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_MONOMIAL_EXPONENT_PRODUCT → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_MONOMIAL_POWER_PRODUCT_COEFFICIENT_SUM → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q11번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 36)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 36)

**4칸**
- given: 거듭제곱←solution:「지수법칙을 적용하여 거듭제곱을 먼저 전개한다.」
- goal: 제곱←solution:「지수법칙을 적용하여 거듭제곱을 먼저 전개한다.」
- method: 전개(NAMED)←solution:「지수법칙을 적용하여 거듭제곱을 먼저 전개한다.」
- condition: (없음)

**how** Q11번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 36)

<details><summary>저장 해설 (판정 검토용)</summary>

지수법칙을 적용하여 거듭제곱을 먼저 전개한다.
$$
\begin{aligned}
(x^3 y^2)^4 &= (x^3)^4 \times (y^2)^4 = x^{12} y^8 \
(x^5 y^3)^2 &= (x^5)^2 \times (y^3)^2 = x^{10} y^6
\end{aligned}
$$
두 식의 곱을 계산한다.
$$
\begin{aligned}
x^{12} y^8 \times x^{10} y^6 &= x^{12+10} y^{8+6} \
&= x^{22} y^{14}
\end{aligned}
$$
우변 $x^a y^b$와 비교하면
$$
a = 22, \quad b = 14
$$
따라서 $a+b$의 값을 계산한다.
$$
a + b = 22 + 14 = 36
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은? [5점]

**보기** ① $10$  ② $12$  ③ $14$  ④ $24$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변을 지수법칙으로 전개하여 우변과 비교한다.
2. (x^a y^b z^c)^d = x^{ad} y^{bd} z^{cd} = x^{36} y^{48} z^{60}
3. 따라서 다음 세 식이 성립한다.
4. ad = 36, \quad bd = 48, \quad cd = 60
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: Q12번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 36)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_EXPONENT_GCD_OPTIMIZATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_EXPONENT_COMMON_FACTOR_MINIMUM → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q12번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 36)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 36)

**4칸**
- given: 자연수←stem:「네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은?」
- goal: 최솟값←stem:「네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은?」
- method: 비교(NAMED)←solution:「좌변을 지수법칙으로 전개하여 우변과 비교한다.」
- condition: (없음)

**how** Q12번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 36)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 지수법칙으로 전개하여 우변과 비교한다.
$$
(x^a y^b z^c)^d = x^{ad} y^{bd} z^{cd} = x^{36} y^{48} z^{60}
$$
따라서 다음 세 식이 성립한다.
$$
ad = 36, \quad bd = 48, \quad cd = 60
$$
$a, b, c, d$는 자연수이므로 $d$는 $36, 48, 60$의 공약수이다.
$a+b+c$의 값을 나타내면
$$
a+b+c = \frac{36}{d} + \frac{48}{d} + \frac{60}{d} = \frac{36+48+60}{d} = \frac{144}{d}
$$
$a+b+c$가 최솟값을 가지려면 분모 $d$가 최대이어야 하므로, $d$는 $36, 48, 60$의 최대공약수이다.
$$
\begin{aligned}
36 &= 2^2 \times 3^2 \
48 &= 2^4 \times 3 \
60 &= 2^2 \times 3 \times 5 \
\gcd(36, 48, 60) &= 2^2 \times 3 = 12
\end{aligned}
$$
따라서 $d$의 최댓값은 $12$이다.
이때 $a, b, c$의 값을 구하면
$$
a = \frac{36}{12} = 3, \quad b = \frac{48}{12} = 4, \quad c = \frac{60}{12} = 5
$$
따라서 $a+b+c$의 최솟값은
$$
a + b + c = 3 + 4 + 5 = 12
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을 계산하면? [4점]

**보기** ① $-12x^{3}y^{5}$  ② $-6x^{3}y^{5}$  ③ $6x^{3}y^{5}$  ④ $12x^{3}y^{5}$  ⑤ $18x^{3}y^{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 단항식의 거듭제곱을 먼저 계산한다.
2. \begin{aligned}
3. (-2x^2 y)^3 &= (-2)^3 \times (x^2)^3 \times y^3 = -8x^6 y^3 \
4. (xy^3)^2 &= x^2 \times (y^3)^2 = x^2 y^6
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을 계산하면?」
**RPM** M2-RPM-009 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 곱셈] **원천→판정: 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산 → 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 곱셈**
- 이유: Q13번 문항은 M2-RPM-009에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 xy)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_MONOMIAL_MIXED_OPERATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_MONOMIAL_POWER_MULT_DIV_SIMPLIFY → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q13번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 xy)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 xy)

**4칸**
- given: 거듭제곱←solution:「단항식의 거듭제곱을 먼저 계산한다.」
- goal: 제곱←solution:「단항식의 거듭제곱을 먼저 계산한다.」
- method: 단항식(NAMED)←solution:「단항식의 거듭제곱을 먼저 계산한다.」
- condition: (없음)

**how** Q13번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 xy)

<details><summary>저장 해설 (판정 검토용)</summary>

단항식의 거듭제곱을 먼저 계산한다.
$$
\begin{aligned}
(-2x^2 y)^3 &= (-2)^3 \times (x^2)^3 \times y^3 = -8x^6 y^3 \
(xy^3)^2 &= x^2 \times (y^3)^2 = x^2 y^6
\end{aligned}
$$
나눗셈은 역수를 곱하는 곱셈으로 바꾼다.
$$
\div \left(-\frac{2}{3}x^5 y^4\right) = \times \left(-\frac{3}{2x^5 y^4}\right)
$$
전체 식을 곱셈으로 결합하여 계수와 문자를 정리한다.
$$
\begin{aligned}
& (-8x^6 y^3) \times (x^2 y^6) \times \left(-\frac{3}{2x^5 y^4}\right) \
&= \left[(-8) \times 1 \times \left(-\frac{3}{2}\right)\right] \times \frac{x^{6+2} y^{3+6}}{x^5 y^4} \
&= 12 \times \frac{x^8 y^9}{x^5 y^4} \
&= 12 x^{8-5} y^{9-4} \
&= 12 x^3 y^5
\end{aligned}
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는? [4점]

**보기** ① $2ab^{2}$  ② $2a^{2}b^{2}$  ③ $4ab^{2}$  ④ $4a^{2}b$  ⑤ $4a^{2}b^{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직육면체의 부피 공식은 다음과 같다.
2. \text{부피} = \text{밑넓이} \times \text{높이}
3. 밑면의 넓이를 계산한다.
4. \begin{aligned}
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는?」
**RPM** M2-RPM-009 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 곱셈] **원천→판정: 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 나눗셈 → 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 곱셈**
- 이유: Q14번 문항은 M2-RPM-009에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ab)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_MONOMIAL_GEOMETRIC_APPLICATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_CUBOID_HEIGHT_FROM_VOLUME_MONOMIAL → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q14번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ab)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ab)

**4칸**
- given: 길이←stem:「밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는?」
- goal: 높이←stem:「밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는?」
- method: 부피(NAMED)←solution:「직육면체의 부피 공식은 다음과 같다.」
- condition: (없음)

**how** Q14번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

직육면체의 부피 공식은 다음과 같다.
$$
\text{부피} = \text{밑넓이} \times \text{높이}
$$
밑면의 넓이를 계산한다.
$$
\begin{aligned}
\text{밑넓이} &= (3a^2 b) \times (2ab^2) \
&= (3 \times 2) \times (a^2 \times a) \times (b \times b^2) \
&= 6a^3 b^3
\end{aligned}
$$
따라서 직육면체의 높이는 부피를 밑넓이로 나눈 값이다.
$$
\begin{aligned}
\text{높이} &= \frac{24a^5 b^5}{6a^3 b^3} \
&= \frac{24}{6} \times a^{5-3} \times b^{5-3} \
&= 4a^2 b^2
\end{aligned}
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은? [4점]

**보기** ① $13$  ② $14$  ③ $15$  ④ $16$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $10$의 거듭제곱인 $10 = 2 \times 5$의 성질을 이용하기 위해 지수를 일치시킨다.
2. \begin{aligned}
3. 2^{17} \times 5^{14} &= 2^{3+14} \times 5^{14} \
4. &= 2^3 \times (2^{14} \times 5^{14}) \
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] (원천과 같음)
- 이유: Q15번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 17)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_EXPONENT_DIGIT_COUNT → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_POWERS_OF_TWO_FIVE_DIGIT_COUNT → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q15번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 17)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 17)

**4칸**
- given: 자연수←stem:「$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은?」
- goal: 자리←stem:「$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은?」
- method: 거듭제곱(NAMED)←solution:「$10$의 거듭제곱인 $10 = 2 \times 5$의 성질을 이용하기 위해 지수를 일치시킨다.」
- condition: (없음)

**how** Q15번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 17)

<details><summary>저장 해설 (판정 검토용)</summary>

$10$의 거듭제곱인 $10 = 2 \times 5$의 성질을 이용하기 위해 지수를 일치시킨다.
$$
\begin{aligned}
2^{17} \times 5^{14} &= 2^{3+14} \times 5^{14} \
&= 2^3 \times (2^{14} \times 5^{14}) \
&= 8 \times (2 \times 5)^{14} \
&= 8 \times 10^{14}
\end{aligned}
$$
$8 \times 10^{14}$은 숫자 $8$ 뒤에 $0$이 $14$개 붙는 수이다.
따라서 자릿수 $n$은
$$
n = 1 + 14 = 15
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $7x-5y-1$이 되었다. 바르게 계산한 답은? [4점]

**보기** ① $-x+y+9$  ② $-x+y+5$  ③ $-4x+3y+5$  ④ $-x-y+9$  ⑤ $7x-5y+9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 잘못 계산한 식으로부터 어떤 식 $A$를 구한다.
2. (3x-2y+4) - A = 7x-5y-1
3. 양변을 이항하여 $A$에 대하여 정리한다.
4. \begin{aligned}
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $7x-5y-1$이 되었다.」
**RPM** M2-RPM-016 [식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값] **원천→판정: 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 조건식 활용 → 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값**
- 이유: Q16번 문항은 M2-RPM-016에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_POLYNOMIAL_MISTAKE_CORRECTION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q16번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 어떤←stem:「$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $7x-5y-1$이 되었다.」
- goal: 정리←solution:「양변을 이항하여 $A$에 대하여 정리한다.」
- method: 이항(NAMED)←solution:「양변을 이항하여 $A$에 대하여 정리한다.」
- condition: (없음)

**how** Q16번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

잘못 계산한 식으로부터 어떤 식 $A$를 구한다.
$$
(3x-2y+4) - A = 7x-5y-1
$$
양변을 이항하여 $A$에 대하여 정리한다.
$$
\begin{aligned}
A &= (3x-2y+4) - (7x-5y-1) \
&= 3x - 2y + 4 - 7x + 5y + 1 \
&= -4x + 3y + 5
\end{aligned}
$$
바르게 계산한 식은 원래의 식에 $A$를 더한 값이므로 대입하여 계산한다.
$$
\begin{aligned}
(3x-2y+4) + A &= (3x-2y+4) + (-4x+3y+5) \
&= (3-4)x + (-2+3)y + (4+5) \
&= -x + y + 9
\end{aligned}
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x + \left(\dfrac{3}{4}x^{3}-\dfrac{9}{4}x^{4}\right) \div \left(-\dfrac{3}{4}x^{2}\right)$을 계산하였을 때, $x^2$의 계수를 $a$, $x$의 계수를 $b$라 하자. 이때 $b-a$의 값은? [4점]

**보기** ① $11$  ② $23$  ③ $29$  ④ $-11$  ⑤ $-23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 나눗셈 식을 각각 전개하여 계산한다.
2. 1단계: 첫 번째 식을 계산한다.
3. \begin{aligned}
4. (6x^2 - 3x^3) \div \frac{1}{3}x &= (6x^2 - 3x^3) \times \frac{3}{x} \
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x + \left(\dfrac{3}{4}x^{3}-\dfrac{9}{4}x^{4}\right) \div \left(-\dfrac{3}{4}x^{2}\right)$을 계산하였을 때, $x^2$의 계수를 $a$, $x$의 계수를 $b$라 하자.」
**RPM** M2-RPM-014 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙] **원천→판정: 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 다항식을 단항식으로 나누기 → 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙**
- 이유: Q17번 문항은 M2-RPM-014에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 11)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_POLYNOMIAL_DIVISION_COEFFICIENT_DIFF → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_POLYNOMIAL_MONOMIAL_DIV_COEFF_EVAL → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q17번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 11)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 11)

**4칸**
- given: 계수←stem:「$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x + \left(\dfrac{3}{4}x^{3}-\dfrac{9}{4}x^{4}\right) \div \left(-\dfrac{3}{4}x^{2}\right)$을 계산하였을 때, $x^2$의 계수를 $a$, $x$의 계수를 $b$라 하자.」
- goal: 전개←solution:「두 나눗셈 식을 각각 전개하여 계산한다.」
- method: 나눗셈(NAMED)←solution:「두 나눗셈 식을 각각 전개하여 계산한다.」
- condition: (없음)

**how** Q17번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

두 나눗셈 식을 각각 전개하여 계산한다.
1단계: 첫 번째 식을 계산한다.
$$
\begin{aligned}
(6x^2 - 3x^3) \div \frac{1}{3}x &= (6x^2 - 3x^3) \times \frac{3}{x} \
&= 6x^2 \times \frac{3}{x} - 3x^3 \times \frac{3}{x} \
&= 18x - 9x^2
\end{aligned}
$$


2단계: 두 번째 식을 계산한다.
$$
\begin{aligned}
\left(\frac{3}{4}x^3 - \frac{9}{4}x^4\right) \div \left(-\frac{3}{4}x^2\right) &= \left(\frac{3}{4}x^3 - \frac{9}{4}x^4\right) \times \left(-\frac{4}{3x^2}\right) \
&= \frac{3}{4}x^3 \times \left(-\frac{4}{3x^2}\right) - \frac{9}{4}x^4 \times \left(-\frac{4}{3x^2}\right) \
&= -x + 3x^2
\end{aligned}
$$


3단계: 두 결과의 합을 동류항끼리 정리한다.
$$
\begin{aligned}
(18x - 9x^2) + (-x + 3x^2) &= (-9+3)x^2 + (18-1)x \
&= -6x^2 + 17x
\end{aligned}
$$
따라서 $x^2$의 계수 $a$와 $x$의 계수 $b$는 다음과 같다.
$$
a = -6, \quad b = 17
$$
구하는 식 $b-a$의 값을 계산한다.
$$
b - a = 17 - (-6) = 17 + 6 = 23
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

다음 부등식 중에서 $x=2$를 해로 갖는 것은? [3점]

**보기** ① $3x-1 > 7$  ② $2x \le 5-x$  ③ $4-3x \ge 0$  ④ $5x-4 < 3x+3$  ⑤ $1-2x > x$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x=2$를 각 부등식에 대입하여 부등식이 참이 되는지 확인한다.
2. \begin{aligned}
3. \text{① } & 3(2) - 1 = 5 > 7 \text{ (거짓)} \
4. \text{② } & 2(2) = 4 \le 5 - 2 = 3 \text{ (거짓)} \
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 부등식 중에서 $x=2$를 해로 갖는 것은?」
**RPM** M2-RPM-020 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형] (원천과 같음)
- 이유: Q18번 문항은 M2-RPM-020에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY **원천→판정: PT_M2_INEQUALITY_SOLUTION_CHECK → PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED** **원천→판정: TPL_INEQUALITY_VALUE_MEMBERSHIP_TEST → TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY**
- 이유: Q18번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 부등식←stem:「다음 부등식 중에서 $x=2$를 해로 갖는 것은?」
- goal: 등식←stem:「다음 부등식 중에서 $x=2$를 해로 갖는 것은?」
- method: 대입(NAMED)←solution:「$x=2$를 각 부등식에 대입하여 부등식이 참이 되는지 확인한다.」
- condition: (없음)

**how** Q18번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

$x=2$를 각 부등식에 대입하여 부등식이 참이 되는지 확인한다.
$$
\begin{aligned}
\text{① } & 3(2) - 1 = 5 > 7 \text{ (거짓)} \
\text{② } & 2(2) = 4 \le 5 - 2 = 3 \text{ (거짓)} \
\text{③ } & 4 - 3(2) = -2 \ge 0 \text{ (거짓)} \
\text{④ } & 5(2) - 4 = 6 < 3(2) + 3 = 9 \text{ (참)} \
\text{⑤ } & 1 - 2(2) = -3 > 2 \text{ (거짓)}
\end{aligned}
$$
따라서 $x=2$를 해로 갖는 부등식은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$a+2 \le b+2$일 때, $\Box$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? [4점]

**보기** ① $a-5 \;\Box\; b-5$  ② $3a+1 \;\Box\; 3b+1$  ③ $\dfrac{a}{2}-4 \;\Box\; \dfrac{b}{2}-4$  ④ $a-(-3) \;\Box\; b-(-3)$  ⑤ $7-2a \;\Box\; 7-2b$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $a+2 \le b+2$의 양변에서 $2$를 빼면 (문항 토큰 aligned)
2. a \le b
3. 부등식의 양변에 같은 수를 더하거나 빼도, 양수를 곱하거나 나누어도 부등호의 방향은 바뀌지 않는다.
4. 그러나 음수를 곱하거나 나누면 부등호의 방향이 바뀐다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a+2 \le b+2$일 때, $\Box$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는?」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: Q19번 문항은 M2-RPM-018에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY **원천→판정: PT_M2_INEQUALITY_PROPERTY_DIRECTION → PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED** **원천→판정: TPL_INEQUALITY_TRANSFORM_DIRECTION_AUDIT → TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY**
- 이유: Q19번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 나머지←stem:「$a+2 \le b+2$일 때, $\Box$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는?」
- goal: 부등식←solution:「부등식의 양변에 같은 수를 더하거나 빼도, 양수를 곱하거나 나누어도 부등호의 방향은 바뀌지 않는다.」
- method: 등식(NAMED)←solution:「부등식의 양변에 같은 수를 더하거나 빼도, 양수를 곱하거나 나누어도 부등호의 방향은 바뀌지 않는다.」
- condition: (없음)

**how** Q19번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

$a+2 \le b+2$의 양변에서 $2$를 빼면
$$
a \le b
$$
부등식의 양변에 같은 수를 더하거나 빼도, 양수를 곱하거나 나누어도 부등호의 방향은 바뀌지 않는다.
그러나 음수를 곱하거나 나누면 부등호의 방향이 바뀐다.
$$
\begin{aligned}
\text{① } & a \le b \implies a-5 \le b-5 \quad (\le) \
\text{② } & a \le b \implies 3a+1 \le 3b+1 \quad (\le) \
\text{③ } & a \le b \implies \frac{a}{2}-4 \le \frac{b}{2}-4 \quad (\le) \
\text{④ } & a \le b \implies a-(-3) \le b-(-3) \quad (\le) \
\text{⑤ } & a \le b \text{의 양변에 } -2\text{를 곱하면 } -2a \ge -2b, \text{ 양변에 } 7\text{을 더하면 } 7-2a \ge 7-2b \quad (\ge)
\end{aligned}
$$
따라서 부등호의 방향이 나머지 넷과 다른 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$-7 \le x \le 3$일 때, $\dfrac{1}{2} + ax$의 최댓값이 $4$, 최솟값이 $b$이다. $a < 0$일 때, 상수 $a, b$에 대하여 $a-b$의 값은? [5점]

**보기** ① $-\dfrac{3}{2}$  ② $-\dfrac{1}{2}$  ③ $\dfrac{1}{2}$  ④ $\dfrac{3}{2}$  ⑤ $\dfrac{5}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $a < 0$이므로 부등식 $-7 \le x \le 3$의 각 변에 음수 $a$를 곱하면 부등호의 방향이 바뀐다.
2. -7 \le x \le 3 \implies 3a \le ax \le -7a
3. 각 변에 $\dfrac{1}{2}$을 더하면
4. \frac{1}{2} + 3a \le \frac{1}{2} + ax \le \frac{1}{2} - 7a
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-7 \le x \le 3$일 때, $\dfrac{1}{2} + ax$의 최댓값이 $4$, 최솟값이 $b$이다.」
**RPM** M2-RPM-022 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건 → 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수**
- 이유: Q20번 문항은 M2-RPM-022에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY **원천→판정: PT_M2_INEQUALITY_COEFFICIENT_CONDITION → PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED** **원천→판정: TPL_LINEAR_EXPRESSION_BOUND_OPTIMIZATION → TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY**
- 이유: Q20번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 최댓값←stem:「$-7 \le x \le 3$일 때, $\dfrac{1}{2} + ax$의 최댓값이 $4$, 최솟값이 $b$이다.」
- goal: 최솟값←stem:「$-7 \le x \le 3$일 때, $\dfrac{1}{2} + ax$의 최댓값이 $4$, 최솟값이 $b$이다.」
- method: 부등식(NAMED)←solution:「$a < 0$이므로 부등식 $-7 \le x \le 3$의 각 변에 음수 $a$를 곱하면 부등호의 방향이 바뀐다.」
- condition: (없음)

**how** Q20번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

$a < 0$이므로 부등식 $-7 \le x \le 3$의 각 변에 음수 $a$를 곱하면 부등호의 방향이 바뀐다.
$$
-7 \le x \le 3 \implies 3a \le ax \le -7a
$$
각 변에 $\dfrac{1}{2}$을 더하면
$$
\frac{1}{2} + 3a \le \frac{1}{2} + ax \le \frac{1}{2} - 7a
$$
따라서 $\dfrac{1}{2} + ax$의 최댓값은 $\dfrac{1}{2} - 7a$이고, 최솟값은 $\dfrac{1}{2} + 3a$이다.


1단계: 최댓값 조건을 이용하여 $a$를 구한다.
$$
\begin{aligned}
\frac{1}{2} - 7a &= 4 \
-7a &= 4 - \frac{1}{2} = \frac{7}{2} \
a &= -\frac{1}{2}
\end{aligned}
$$
$a = -\frac{1}{2} < 0$이므로 주어진 조건 $a < 0$을 만족한다.


2단계: 최솟값 $b$를 구한다.
$$
\begin{aligned}
b &= \frac{1}{2} + 3a \
&= \frac{1}{2} + 3\left(-\frac{1}{2}\right) \
&= \frac{1}{2} - \frac{3}{2} = -1
\end{aligned}
$$


3단계: $a-b$의 값을 계산한다.
$$
\begin{aligned}
a - b &= -\frac{1}{2} - (-1) \
&= -\frac{1}{2} + 1 \
&= \frac{1}{2}
\end{aligned}
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다. 다음 물음에 답하시오. [7점]


(1) 순환소수를 $x$로 놓고 기약분수로 나타내는 과정을 서술하시오. [4점]
(2) $A$의 값 중 가장 작은 세 자리의 자연수를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\dfrac{28}{15}$, (2) $105$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 순환소수 $1.8\dot{6}$을 $x$라 하면
2. x = 1.8666\dots
3. 소수점 아래 순환마디의 자릿수를 맞추기 위해 양변에 $100$과 $10$을 각각 곱한다.
4. \begin{aligned}
- 작성자 답: (1) $\dfrac{28}{15}$, (2) $105$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다.」
**RPM** M2-RPM-005 [유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 조건을 만족하는 유리수 → 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로**
- 이유: Q21번 문항은 M2-RPM-005에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 1.8)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_REPEATING_TO_NATURAL_PRODUCT → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_REPEATING_FRACTION_MULTIPLIER_DIGIT_BOUND → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q21번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 1.8)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 1.8)

**4칸**
- given: 자연수←stem:「[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다.」
- goal: 소수←stem:「[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다.」
- method: 순환소수(NAMED)←solution:「(1) 순환소수 $1.8\dot{6}$을 $x$라 하면」
- condition: (없음)

**how** Q21번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 (1) $\dfrac{28}{15}$, (2) $105$을(를) 바르게 구하였다. (문항 토큰 1.8)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 순환소수 $1.8\dot{6}$을 $x$라 하면
$$
x = 1.8666\dots
$$
소수점 아래 순환마디의 자릿수를 맞추기 위해 양변에 $100$과 $10$을 각각 곱한다.
$$
\begin{aligned}
100x &= 186.666\dots \
10x &= 18.666\dots
\end{aligned}
$$
변끼리 빼면 소수점 아래 순환마디 부분이 소거된다.
$$
\begin{aligned}
100x - 10x &= 186.666\dots - 18.666\dots \
90x &= 168 \
x &= \frac{168}{90} = \frac{28}{15}
\end{aligned}
$$
따라서 구하는 기약분수는 $\dfrac{28}{15}$이다.


(2) $x \times A = \dfrac{28}{15} \times A$가 자연수가 되어야 한다.
$28$과 $15$는 서로소이므로, 분모 $15$가 약분되어 소거되려면 $A$는 $15$의 배수이어야 한다.
$15$의 배수를 작은 수부터 나열하면
$$
15, \quad 30, \quad 45, \quad 60, \quad 75, \quad 90, \quad 105, \quad 120, \quad \dots
$$
이 중 가장 작은 세 자리의 자연수는 $105$이다.
따라서 구하는 $A$의 값은 $105$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 2번] $\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변을 지수법칙을 이용하여 전개한다.
2. \left(\frac{2x^3}{y^a}\right)^b = \frac{2^b \times (x^3)^b}{(y^a)^b} = \frac{2^b x^{3b}}{y^{ab}}
3. 우변 $\dfrac{8x^c}{y^{12}}$과 계수 및 각 문자의 지수를 비교한다.
4. 1단계: 분자의 계수를 비교한다.
- 작성자 답: $-2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2번] $\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오.」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: Q22번 문항은 M2-RPM-007에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS **원천→판정: PT_M2_MONOMIAL_EXPONENT_COMPARE_EQUATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_MONOMIAL_QUOTIENT_POWER_COEFFICIENT_MATCH → TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS**
- 이유: Q22번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 상수←stem:「[서술형 2번] $\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오.」
- goal: 전개←solution:「좌변을 지수법칙을 이용하여 전개한다.」
- method: 지수(NAMED)←solution:「좌변을 지수법칙을 이용하여 전개한다.」
- condition: (없음)

**how** Q22번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 $-2$을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 지수법칙을 이용하여 전개한다.
$$
\left(\frac{2x^3}{y^a}\right)^b = \frac{2^b \times (x^3)^b}{(y^a)^b} = \frac{2^b x^{3b}}{y^{ab}}
$$
우변 $\dfrac{8x^c}{y^{12}}$과 계수 및 각 문자의 지수를 비교한다.


1단계: 분자의 계수를 비교한다.
$$
2^b = 8 = 2^3 \implies b = 3
$$


2단계: 분자의 $x$의 지수를 비교한다.
$$
3b = c \implies c = 3 \times 3 = 9
$$


3단계: 분모의 $y$의 지수를 비교한다.
$$
ab = 12 \implies a \times 3 = 12 \implies a = 4
$$


4단계: $a+b-c$의 값을 계산한다.
$$
\begin{aligned}
a + b - c &= 4 + 3 - 9 \
&= 7 - 9 \
&= -2
\end{aligned}
$$
따라서 구하는 값은 $-2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 3번] $-3 \le x \le 5$일 때, $a \le 4 - \dfrac{1}{2}x \le b$이다. 이때 $4ab$의 값을 구하는 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $33$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.
2. 1단계: 각 변에 $-\dfrac{1}{2}$을 곱한다.
3. 음수를 곱하므로 부등호의 방향이 바뀐다.
4. \begin{aligned}
- 작성자 답: $33$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3번] $-3 \le x \le 5$일 때, $a \le 4 - \dfrac{1}{2}x \le b$이다.」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: Q23번 문항은 M2-RPM-018에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ab)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY **원천→판정: PT_M2_INEQUALITY_INTERVAL_TRANSFORM → PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED** **원천→판정: TPL_LINEAR_RANGE_PRODUCT_EVAL → TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY**
- 이유: Q23번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ab)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ab)

**4칸**
- given: 부등식←solution:「주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.」
- goal: 범위←solution:「주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.」
- method: 등식(NAMED)←solution:「주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.」
- condition: (없음)

**how** Q23번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 $33$을(를) 바르게 구하였다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.


1단계: 각 변에 $-\dfrac{1}{2}$을 곱한다. 음수를 곱하므로 부등호의 방향이 바뀐다.
$$
\begin{aligned}
-3 \times \left(-\frac{1}{2}\right) &\ge -\frac{1}{2}x \ge 5 \times \left(-\frac{1}{2}\right) \
\frac{3}{2} &\ge -\frac{1}{2}x \ge -\frac{5}{2} \
-\frac{5}{2} &\le -\frac{1}{2}x \le \frac{3}{2}
\end{aligned}
$$


2단계: 각 변에 $4$를 더한다.
$$
\begin{aligned}
4 - \frac{5}{2} &\le 4 - \frac{1}{2}x \le 4 + \frac{3}{2} \
\frac{8-5}{2} &\le 4 - \frac{1}{2}x \le \frac{8+3}{2} \
\frac{3}{2} &\le 4 - \frac{1}{2}x \le \frac{11}{2}
\end{aligned}
$$
주어진 부등식 $a \le 4 - \dfrac{1}{2}x \le b$와 비교하면
$$
a = \frac{3}{2}, \quad b = \frac{11}{2}
$$


3단계: $4ab$의 값을 계산한다.
$$
\begin{aligned}
4ab &= 4 \times \frac{3}{2} \times \frac{11}{2} \
&= 4 \times \frac{33}{4} \
&= 33
\end{aligned}
$$
따라서 구하는 $4ab$의 값은 $33$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
