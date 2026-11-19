# 검수 묶음 — 24_문성중_1학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 23개 / 검사 PASS 21, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 6, 2단계 12, 3단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q5**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (PT, TPL, 난이도)
- **Q11**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q12**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q13**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q14**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q22**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q23**: 원천 값과 다른 칸 2개 (PT, TPL)

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다. 다음 빈칸을 채워 $A+B\times C$의 값을 구하면? [4점]


$$\dfrac{9}{2^{3}\times5}=\dfrac{A}{2^{3}\times5^{3}}=\dfrac{A}{B}=C$$

**보기** ① $450$  ② $225$  ③ $350$  ④ $525$  ⑤ $675$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모 $2^3 \times 5$를 $10^3=1000$으로 만들기 위해 분모와 분자에 $5^2=25$를 곱한다. 1000
2. 따라서 $A = 9 \times 25 = 225$, $B = 1000$, $C = 0.225$이다. 225
3. $A + B \times C = 225 + 1000 \times 0.225 = 225 + 225 = 450$이다. 450
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{9}{2」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수로 나타내기 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별**
- 이유: 분모를 1000으로 고쳐 유한소수 값 450을 계산한다. 1000
**유형** PT=PT_M2_FINITE_DECIMAL / TPL=NONE **원천→판정: PT_M2_FINITE_DECIMAL_CONVERSION_BLANK → PT_M2_FINITE_DECIMAL** **원천→판정: TPL_DECIMAL_POWERS_OF_TEN_MATCH → NONE**
- 이유: 분수의 분모를 1000과 같은 10의 거듭제곱으로 고쳐 유한소수로 나타내는 유형이다. 1000
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분모를 1000으로 변형하여 빈칸의 계산값 450을 구하는 기초 문항이다. 1000

**4칸**
- given: 분수←stem:「분수 $\dfrac{9}{2^{3}\times5}$을」
- goal: 유한소수←stem:「유한소수로 나타내는 과정이다」
- method: 거듭제곱(NAMED)←solution:「분모를 $10$의 거듭제곱인」
- condition: (없음)

**how** 분모를 1000으로 맞추어 A=225, B=1000, C=0.225를 구하고 식의 값 450을 계산했다. 1000

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
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 분수 중에서 순환소수로만 나타낼 수 있는 것은? [3점]

**보기** ① $\dfrac{14}{70}$  ② $\dfrac{21}{2^{2}\times3^{2}\times5}$  ③ $\dfrac{27}{180}$  ④ $\dfrac{63}{2^{3}\times3^{2}\times7}$  ⑤ $\dfrac{45}{2\times3^{2}\times5^{2}}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 기약분수의 분모 소인수에 2 또는 5 이외의 소인수가 있으면 순환소수가 된다. 180
2. ② $\frac{21}{2^2 \times 3^2 \times 5} = \frac{7}{2^2 \times 3 \times 5}$이므로 분모에 소인수 3이 남아 순환소수이다.
3. 나머지 ① 14/70=1/5, ③ 27/180=3/20, ④, ⑤는 분모의 소인수가 2 또는 5뿐이므로 유한소수이다. 180
4. 따라서 순환소수로만 나타낼 수 있는 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 분수 중에서 순환소수로」
**RPM** M2-RPM-002 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 분모의 소인수 조건] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 분모의 소인수 조건**
- 이유: 분모 180 등의 소인수를 분석하여 순환소수 여부를 판정한다. 180
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_FINITE_DECIMAL_TEST → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_DECIMAL_FACTOR_SEARCH → NONE**
- 이유: 분수 27/180 등을 기약분수로 나타내어 순환소수가 되는 것을 판별하는 유형이다. 180
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분모 180의 기약분수 소인수를 확인하여 순환소수를 고르는 기본 문항이다. 180

**4칸**
- given: 분수←stem:「다음 분수 중에서」
- goal: 순환소수←stem:「순환소수로만 나타낼 수 있는 것은?」
- method: 기약분수(NAMED)←solution:「기약분수로 나타내었을 때 분모의」
- condition: (없음)

**how** 각 분수를 기약분수로 나타내어 180 등의 분모 소인수를 확인하고 순환소수를 골랐다. 180

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

**발문**

두 수의 대소관계를 바르게 나타낸 것은? [3점]

**보기** ① $0.45 > 0.\dot{4}\dot{5}$  ② $3.2\dot{7} < 3.27$  ③ $0.62 > 0.\dot{6}$  ④ $0.345 < 0.3\dot{4}\dot{5}$  ⑤ $5.\dot{8}\dot{1} > 5.81\dot{8}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 순환소수의 대소 관계는 소수점 아래 자릿수를 차례대로 비교하여 판별한다. 0.345
2. ④ $0.345 = 0.345000\dots$이고 $0.3\dot{4}\dot{5} = 0.345454\dots$이므로 $0.345 < 0.3\dot{4}\dot{5}$는 참이다. 0.345
3. 따라서 바르게 나타낸 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 수의 대소관계를 바르게」
**RPM** M2-RPM-003 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 대소비교 → 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현**
- 이유: 0.345 등 순환소수의 소수 전개 자릿수를 비교하여 대소를 판별한다. 0.345
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_DECIMAL_MAGNITUDE_COMPARE → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_DECIMAL_EXPANSION_PAIR_COMPARE → NONE**
- 이유: 0.345와 같은 유한소수와 순환소수의 대소 관계를 비교하는 유형이다. 0.345
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 0.345와 순환소수의 자리별 대소를 단순 비교하는 문항이다. 0.345

**4칸**
- given: 대소관계←stem:「두 수의 대소관계를 바르게」
- goal: 대소관계←stem:「바르게 나타낸 것은?」
- method: 순환소수(NAMED)←solution:「순환소수를 소수 전개 꼴로 펼쳐서」
- condition: (없음)

**how** 0.345의 각 자리수를 순환소수의 전개식과 비교하여 참인 부등식을 찾았다. 0.345

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은? [4점]

**보기** ① $9$  ② $12$  ③ $15$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\frac{29}{11} = 2.636363\dots = 2.\dot{6}\dot{3}$이므로 순환마디는 63이고 길이는 2이다. 45
2. $45 = 2 \times 22 + 1$이므로 소수점 아래 45번째 자리의 숫자는 6이다. 45
3. $46 = 2 \times 23$이므로 소수점 아래 46번째 자리의 숫자는 3이다. 45
4. 두 숫자의 곱은 $6 \times 3 = 18$이다. 따라서 정답은 ⑤이다. 45
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{29}{」
**RPM** M2-RPM-003 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현] (원천과 같음)
- 이유: 순환마디의 주기를 이용하여 소수점 아래 45번째 숫자를 구한다. 45
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC → NONE**
- 이유: 분수를 순환소수로 고치고 소수점 아래 45번째 자리의 숫자를 구하는 유형이다. 45
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 순환마디 주기 2를 이용해 45번째와 46번째 숫자를 찾아 곱하는 문항이다. 45

**4칸**
- given: 분수←stem:「분수 $\dfrac{29}{11}$를 소수로」
- goal: 자리←stem:「소수점 아래 45번째 자리의 숫자와」
- method: 나눗셈(NAMED)←solution:「분수 $\dfrac{29}{11}$를 나눗셈하여」
- condition: (없음)

**how** 순환마디 길이 2로 45와 46을 나눈 나머지로 숫자를 결정해 곱 18을 구했다. 45

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은? (단, $a, b$는 한 자리의 자연수이고 $a$와 $b$는 소수(prime number)이며, $a > b$이다.) [5점]

**보기** ① $0.\dot{1}$  ② $0.\dot{2}$  ③ $0.\dot{3}$  ④ $0.\dot{4}$  ⑤ $0.\dot{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $0.\dot{a}\dot{b} + 0.\dot{b}\dot{a} = \frac{10a+b}{99} + \frac{10b+a}{99} = \frac{11(a+b)}{99} = \frac{a+b}{9}$이다. 99
2. $\frac{a+b}{9} = 0.\dot{7} = \frac{7}{9}$에서 $a+b=7$이다. 99
3. $a, b$가 소수이고 $a>b$이므로 $a=5, b=2$이다. 99
4. $0.\dot{a}-0.\dot{b} = 0.\dot{5}-0.\dot{2} = \frac{5}{9}-\frac{2}{9} = \frac{3}{9} = 0.\dot{3}$이다. 99
5. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 순환소수 $0.\dot{」
**RPM** M2-RPM-004 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로] (원천과 같음)
- 이유: 분모 99를 이용한 분수 변환으로 미지수를 결정하고 계산한다. 99
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_ALGEBRAIC_RELATION → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_DECIMAL_SUM_DIFFERENCE_PRIME → NONE**
- 이유: 분모 99를 이용하여 순환소수의 합과 차를 계산하는 유형이다. 99
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 순환소수를 분모 99인 분수로 고쳐 소수 조건과 연립해 푸는 응용 문항이다. 99

**4칸**
- given: 순환소수←stem:「두 순환소수 $0.\dot{a}\dot{b}$와」
- goal: 순환소수←stem:「$0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은?」
- method: 분수(NAMED)←solution:「두 순환소수를 분수로 나타내어」
- condition: 자연수←stem:「단, $a, b$는 한 자리의 자연수이고」

**how** 분모 99로 식을 세워 a+b=7에서 소수 a=5, b=2를 찾아 차를 순환소수로 구했다. 99

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
1. 민우: $0.41\dot{6} = \frac{416-41}{900} = \frac{375}{900} = \frac{5}{12}$. 분모를 잘못 보았으므로 올바른 분자는 5이다. 900
2. 지호: $0.\dot{7}\dot{2} = \frac{72}{99} = \frac{8}{11}$. 분자를 잘못 보았으므로 올바른 분모는 11이다. 900
3. 처음 기약분수는 $\frac{5}{11} = 0.4545\dots = 0.\dot{4}\dot{5}$이다. 900
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 기약분수를 소수로 나타」
**RPM** M2-RPM-004 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 조건을 만족하는 유리수 → 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로**
- 이유: 분모 900인 기약분수 변환을 통해 원래 분모와 분자를 구한다. 900
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_RECONSTRUCT_FRACTION → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_MISTAKEN_REPEATING_DECIMAL_FRACTION_RECOVERY → NONE**
- 이유: 분모 900 등을 이용하여 잘못 본 순환소수에서 올바른 기약분수를 복원하는 유형이다. 900
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 순환소수를 900 분수로 바꾼 뒤 올바른 분모와 분자를 조합하는 문항이다. 900

**4칸**
- given: 기약분수←stem:「어떤 기약분수를 소수로 나타내는데」
- goal: 순환소수←stem:「처음 기약분수를 소수로 바르게 나타낸 것은?」
- method: 기약분수(NAMED)←solution:「두 학생이 잘못 본 분수를 기약분수로 나타내어」
- condition: (없음)

**how** 분모 900과 99로 기약분수를 각각 구해 분자 5, 분모 11을 찾아 순환소수로 나타냈다. 900

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
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

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
1. ㄱ: 순환소수는 분수 꼴로 나타낼 수 있으므로 항상 유리수이다 (거짓). 10
2. ㄴ: 모든 유한소수는 분모가 10의 거듭제곱인 분수로 나타낼 수 있다 (참). 10
3. ㄷ: 기약분수 분모에 2 또는 5 이외의 소인수가 있으면 순환소수가 된다 (참). 10
4. ㄹ: 분수는 유리수이므로 순환하지 않는 무한소수가 될 수 없다 (거짓). 10
5. 따라서 옳은 것은 ㄴ, ㄷ으로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 옳은 것만을 있」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 분수를 소수로 → 유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별**
- 이유: 10의 거듭제곱 분수 표현과 유리수 개념의 진위를 판정한다. 10
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_RATIONAL_DECIMAL_THEORY_CHECK → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_RATIONAL_DECIMAL_TRUE_FALSE_SET → NONE**
- 이유: 분모가 10의 거듭제곱인 소수와 유리수의 성질의 참/거짓을 판별하는 유형이다. 10
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 10의 거듭제곱 분수와 순환소수의 유리수 포함 관계를 묻는 개념 문항이다. 10

**4칸**
- given: 유리수←stem:「다음 중에서 옳은 것만을 있는」
- goal: 유리수←stem:「옳은 것만을 있는 대로 고른 것은?」
- method: 분류(NAMED)←solution:「유리수와 소수의 정의 및 분류 체계를」
- condition: (없음)

**how** 10의 거듭제곱과 기약분수 소인수 성질을 점검하여 옳은 보기 ㄴ, ㄷ을 골랐다. 10

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

**발문**

$(2^{6})^{3} \div (2^{\Box})^{2} = 2^{10}$일 때, $\Box$ 안에 알맞은 수는? [3점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(2^6)^3 = 2^{18}$이고 $(2^\Box)^2 = 2^{2\Box}$이다. 18
2. $(2^6)^3 \div (2^\Box)^2 = 2^{18-2\Box} = 2^{10}$이므로 $18 - 2\Box = 10$이다. 18
3. $2\Box = 8 \implies \Box = 4$이다. 18
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(2^{6})^{3} \d」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: 거듭제곱의 나눗셈 지수법칙을 적용하여 지수 18을 계산한다. 18
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_LAW_EQUATION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_DIVISION_VARIABLE_SOLVE → NONE**
- 이유: 지수의 나눗셈에서 18 - 2*box = 10 을 만족하는 네모의 값을 구하는 유형이다. 18
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수 18과 10의 뺄셈 관계를 푸는 기초 지수법칙 문항이다. 18

**4칸**
- given: 지수법칙←stem:「$(2^{6})^{3} \div (2^{\Box})^{2} = 2^{10}$일 때」
- goal: 자연수←stem:「$\Box$ 안에 알맞은 수는?」
- method: 지수법칙(NAMED)←solution:「지수법칙을 이용하여 좌변의 식을 정리한다.」
- condition: (없음)

**how** 지수법칙으로 좌변 지수를 18 - 2*box로 정리해 우변 지수 10과 일치시켜 4를 구했다. 18

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$A = 2^{x-1}$일 때, $8^{x}$을 $A$에 관한 식으로 나타내면? [4점]

**보기** ① $2A^{3}$  ② $4A^{2}$  ③ $4A^{3}$  ④ $8A^{2}$  ⑤ $8A^{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A = 2^{x-1} = \frac{2^x}{2}$에서 $2^x = 2A$이다. aligned
2. $8^x = (2^3)^x = (2^x)^3 = (2A)^3 = 8A^3$이다. aligned
3. 따라서 정답은 ⑤이다. aligned
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A = 2^{x-1}$일」
**RPM** M2-RPM-008 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱] (원천과 같음)
- 이유: 밑이 8인 거듭제곱을 밑이 2인 식으로 바꾸어 나타낸다. aligned
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_SUBSTITUTION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_BASE_CHANGE_REPRESENTATION → NONE**
- 이유: 지수법칙을 이용하여 8^x을 A에 관한 식으로 변형하는 유형이다. aligned
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 2^x = 2A로 바꾼 뒤 8^x에 대입하여 식을 정리하는 문항이다. aligned

**4칸**
- given: 거듭제곱←stem:「$A = 2^{x-1}$일 때」
- goal: 지수←stem:「$8^{x}$을 $A$에 관한 식으로 나타내면?」
- method: 대입(NAMED)←solution:「여기에 $2^x = 2A$를 대입한다.」
- condition: (없음)

**how** 2^x = 2A로 나타내고 8^x = (2^x)^3에 대입하여 8A^3을 구했다. aligned

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
- ⚠ 원천 값과 다른 칸 3개 (PT, TPL, 난이도)

**발문**

$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때, 자연수 $n$의 값은? [5점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $2^{n+3} + 2^{n+2} + 2^{n+1} = 2^n(2^3 + 2^2 + 2^1) = 2^n(8+4+2) = 2^n \times 14$이다. 224
2. $2^n \times 14 = 224 \implies 2^n = \frac{224}{14} = 16 = 2^4$이다. 224
3. 따라서 $n = 4$이다. 정답은 ③이다. 224
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2^{n+3} + 2^{n」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] (원천과 같음)
- 이유: 지수 합식을 정리하여 224와의 비를 계산한다. 224
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_SUM_EQUATION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_FACTOR_OUT_SUM_SOLVE → NONE**
- 이유: 거듭제곱의 합을 공통인수로 묶어 224를 만족하는 n을 구하는 유형이다. 224
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 공통인수 2^n으로 묶어 224/14 = 16을 유도해야 하는 지수 응용 문항이다. 224

**4칸**
- given: 방정식←stem:「$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때」
- goal: 자연수←stem:「자연수 $n$의 값은?」
- method: 공통인수(NAMED)←solution:「좌변의 공통인수 $2^n$을 묶어 식을 정리한다.」
- condition: (없음)

**how** 2^n으로 묶어 계수 14를 분리한 후 224/14=16=2^4에서 n=4를 구했다. 224

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
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$(x^{3}y^{2})^{4} \times (x^{5}y^{3})^{2} = x^{a}y^{b}$일 때, $a+b$의 값은? [4점]

**보기** ① $36$  ② $32$  ③ $28$  ④ $24$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x^3 y^2)^4 = x^{12} y^8$이고 $(x^5 y^3)^2 = x^{10} y^6$이다. 36
2. $x^{12} y^8 \times x^{10} y^6 = x^{12+10} y^{8+6} = x^{22} y^{14}$이다. 36
3. $a = 22, b = 14$이므로 $a+b = 22+14 = 36$이다. 36
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x^{3}y^{2})^{」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: 지수법칙의 곱셈과 거듭제곱을 계산하여 합 36을 구한다. 36
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_MONOMIAL_EXPONENT_PRODUCT → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_MONOMIAL_POWER_PRODUCT_COEFFICIENT_SUM → NONE**
- 이유: 지수법칙을 적용하여 거듭제곱의 곱셈에서 a+b=36을 구하는 유형이다. 36
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 지수법칙을 차례로 적용하여 지수의 합 36을 계산하는 표준 문항이다. 36

**4칸**
- given: 지수법칙←stem:「$(x^{3}y^{2})^{4} \times (x^{5}y^{3})^{2} = x^{a}y^{b}$일 때」
- goal: 지수←stem:「$a+b$의 값은?」
- method: 지수법칙(NAMED)←solution:「지수법칙을 적용하여 거듭제곱을 먼저 전개한다.」
- condition: (없음)

**how** 지수법칙으로 전개하여 x^22 y^14를 얻고 a=22, b=14의 합 36을 구했다. 36

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은? [5점]

**보기** ① $10$  ② $12$  ③ $14$  ④ $24$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x^a y^b z^c)^d = x^{ad} y^{bd} z^{cd} = x^{36} y^{48} z^{60}$에서 $ad=36, bd=48, cd=60$이다. 144
2. $a+b+c = \frac{36+48+60}{d} = \frac{144}{d}$가 최소가 되려면 d는 36, 48, 60의 최대공약수이어야 한다. 144
3. $\gcd(36, 48, 60) = 12$이므로 $d=12$이다. 144
4. $a = 3, b = 4, c = 5$이므로 $a+b+c = 3+4+5 = 12$이다. 144
5. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「네 자연수 $a, b, c,」
**RPM** M2-RPM-008 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱] (원천과 같음)
- 이유: 지수 거듭제곱 식 144/d의 최대공약수 조건을 분석한다. 144
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_GCD_OPTIMIZATION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_COMMON_FACTOR_MINIMUM → NONE**
- 이유: 지수 관계식 144/d에서 최대공약수를 이용해 최솟값을 구하는 유형이다. 144
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수법칙과 최대공약수를 연계하여 144/d의 최솟값을 찾는 심화 문항이다. 144

**4칸**
- given: 지수법칙←stem:「$(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때」
- goal: 최솟값←stem:「$a+b+c$의 최솟값은?」
- method: 최대공약수(NAMED)←solution:「$d$는 $36, 48, 60$의 최대공약수이다.」
- condition: 자연수←stem:「네 자연수 $a, b, c, d$에 대하여」

**how** ad=36, bd=48, cd=60에서 d의 최댓값 12를 구하고 144/12 = 12를 계산했다. 144

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을 계산하면? [4점]

**보기** ① $-12x^{3}y^{5}$  ② $-6x^{3}y^{5}$  ③ $6x^{3}y^{5}$  ④ $12x^{3}y^{5}$  ⑤ $18x^{3}y^{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(-2x^2 y)^3 = -8x^6 y^3$, $(xy^3)^2 = x^2 y^6$이다. 12
2. 나눗셈을 곱셈으로 고치면 $\times \left(-\frac{3}{2x^5 y^4}\right)$이다. 12
3. $(-8x^6 y^3) \times (x^2 y^6) \times \left(-\frac{3}{2x^5 y^4}\right) = (-8) \times \left(-\frac{3}{2}\right) \times x^{8-5} y^{9-4} = 12x^3 y^5$이다. 12
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(-2x^{2}y)^{3}」
**RPM** M2-RPM-011 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산] (원천과 같음)
- 이유: 단항식 혼합 계산으로 계수 12와 문자 지수를 산출한다. 12
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=NONE **원천→판정: PT_M2_MONOMIAL_MIXED_OPERATION → PT_M2_MONOMIAL_MULTIPLICATION_DIVISION** **원천→판정: TPL_MONOMIAL_POWER_MULT_DIV_SIMPLIFY → NONE**
- 이유: 단항식의 거듭제곱과 역수 곱셈을 통해 12x^3 y^5을 계산하는 유형이다. 12
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단항식의 거듭제곱과 부호, 역수 곱셈을 정확히 처리해 12를 구하는 문항이다. 12

**4칸**
- given: 단항식←stem:「$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을」
- goal: 단항식←stem:「$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을 계산하면?」
- method: 역수(NAMED)←solution:「나눗셈은 역수를 곱하는 곱셈으로 바꾼다.」
- condition: (없음)

**how** 거듭제곱을 전개하고 역수를 곱해 계수 12와 차수 x^3 y^5을 구했다. 12

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는? [4점]

**보기** ① $2ab^{2}$  ② $2a^{2}b^{2}$  ③ $4ab^{2}$  ④ $4a^{2}b$  ⑤ $4a^{2}b^{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑넓이 $= (3a^2 b) \times (2ab^2) = 6a^3 b^3$이다. 24
2. 높이 $= \frac{\text{부피}}{\text{밑넓이}} = \frac{24a^5 b^5}{6a^3 b^3} = 4a^{5-3} b^{5-3} = 4a^2 b^2$이다. 24
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「밑면의 가로의 길이가 $3a」
**RPM** M2-RPM-010 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 나눗셈] (원천과 같음)
- 이유: 부피 24를 밑넓이로 나눈 단항식의 나눗셈을 적용한다. 24
**유형** PT=PT_M2_MONOMIAL / TPL=NONE **원천→판정: PT_M2_MONOMIAL_GEOMETRIC_APPLICATION → PT_M2_MONOMIAL** **원천→판정: TPL_CUBOID_HEIGHT_FROM_VOLUME_MONOMIAL → NONE**
- 이유: 직육면체 부피 24a^5 b^5를 밑넓이 6a^3 b^3으로 나누어 높이를 구하는 유형이다. 24
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부피 공식 24 = 밑넓이 * 높이를 이용하여 단항식 나눗셈을 수행하는 문항이다. 24

**4칸**
- given: 직육면체←stem:「밑면의 가로의 길이가 $3a^{2}b$,」
- goal: 높이←stem:「직육면체의 높이는?」
- method: 부피(NAMED)←solution:「직육면체의 부피 공식은 다음과 같다.」
- condition: (없음)

**how** 밑넓이 6a^3 b^3을 구하고 부피 24a^5 b^5에서 나누어 높이 4a^2 b^2을 구했다. 24

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
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은? [4점]

**보기** ① $13$  ② $14$  ③ $15$  ④ $16$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $2^{17} \times 5^{14} = 2^3 \times (2^{14} \times 5^{14}) = 8 \times 10^{14}$이다. 14
2. $8 \times 10^{14}$은 숫자 8 뒤에 0이 14개 붙으므로 자릿수는 $1 + 14 = 15$자리이다. 14
3. 따라서 $n = 15$이다. 정답은 ③이다. 14
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2^{17} \times」
**RPM** M2-RPM-008 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱**
- 이유: 10의 거듭제곱 14승을 묶어 전체 자릿수 15를 도출한다. 14
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_DIGIT_COUNT → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_POWERS_OF_TWO_FIVE_DIGIT_COUNT → NONE**
- 이유: 10의 14 거듭제곱 꼴로 변형하여 자연수의 자릿수를 결정하는 유형이다. 14
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수 14를 맞추어 8 * 10^14로 나타내고 15자리를 구하는 전형적인 문항이다. 14

**4칸**
- given: 자연수←stem:「$2^{17} \times 5^{14}$이 $n$자리 자연수일 때」
- goal: 자릿수←stem:「$n$의 값은?」
- method: 거듭제곱(NAMED)←solution:「$10$의 거듭제곱인 $10 = 2 \times 5$의」
- condition: (없음)

**how** 공통 지수 14로 묶어 8 * 10^14로 표현한 뒤 1+14=15자리를 계산했다. 14

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

**발문**

$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $7x-5y-1$이 되었다. 바르게 계산한 답은? [4점]

**보기** ① $-x+y+9$  ② $-x+y+5$  ③ $-4x+3y+5$  ④ $-x-y+9$  ⑤ $7x-5y+9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(3x-2y+4) - A = 7x-5y-1$에서 $A = (3x-2y+4) - (7x-5y-1) = -4x+3y+5$이다. aligned
2. 바르게 계산하면 $(3x-2y+4) + A = (3x-2y+4) + (-4x+3y+5) = -x+y+9$이다. aligned
3. 따라서 정답은 ①이다. aligned
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3x-2y+4$에 어떤 식」
**RPM** M2-RPM-013 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산] **원천→판정: 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 조건식 활용 → 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산**
- 이유: 다항식의 뺄셈 7x-5y-1을 이항하여 바른 계산을 도출한다. aligned
**유형** PT=PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_MISTAKE_CORRECTION → PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION** **원천→판정: TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER → NONE**
- 이유: 잘못 계산된 식 7x-5y-1에서 원래 식 A를 구하고 바르게 계산하는 유형이다. aligned
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 어떤 식 A를 7x-5y-1로부터 유도하고 덧셈을 수행하는 표준 문항이다. aligned

**4칸**
- given: 다항식←stem:「$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을」
- goal: 다항식←stem:「바르게 계산한 답은?」
- method: 이항(NAMED)←solution:「양변을 이항하여 $A$에 대하여 정리한다.」
- condition: (없음)

**how** 이항을 통해 A=-4x+3y+5를 찾고 원래 식과 더해 -x+y+9를 얻었다. aligned

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x + \left(\dfrac{3}{4}x^{3}-\dfrac{9}{4}x^{4}\right) \div \left(-\dfrac{3}{4}x^{2}\right)$을 계산하였을 때, $x^2$의 계수를 $a$, $x$의 계수를 $b$라 하자. 이때 $b-a$의 값은? [4점]

**보기** ① $11$  ② $23$  ③ $29$  ④ $-11$  ⑤ $-23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(6x^2-3x^3) \div \frac{1}{3}x = (6x^2-3x^3) \times \frac{3}{x} = 18x - 9x^2$이다. 23
2. $\left(\frac{3}{4}x^3 - \frac{9}{4}x^4\right) \div \left(-\frac{3}{4}x^2\right) = -x + 3x^2$이다. 23
3. 두 식의 합은 $(18x-9x^2) + (-x+3x^2) = -6x^2 + 17x$이다. 23
4. $a = -6, b = 17$이므로 $b-a = 17 - (-6) = 23$이다. 23
5. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(6x^{2}-3x^{3}」
**RPM** M2-RPM-015 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 다항식을 단항식으로 나누기] (원천과 같음)
- 이유: 다항식을 단항식으로 나눈 뒤 계수 23을 계산한다. 23
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_DIVISION_COEFFICIENT_DIFF → PT_M2_POLYNOMIAL** **원천→판정: TPL_POLYNOMIAL_MONOMIAL_DIV_COEFF_EVAL → NONE**
- 이유: 다항식의 나눗셈을 전개하고 동류항을 정리해 계수 차이 23을 구하는 유형이다. 23
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분수 계수가 있는 다항식 나눗셈 후 동류항 계수 차 23을 구하는 문항이다. 23

**4칸**
- given: 다항식←stem:「$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x +」
- goal: 계수←stem:「이때 $b-a$의 값은?」
- method: 동류항(NAMED)←solution:「두 결과의 합을 동류항끼리 정리한다.」
- condition: (없음)

**how** 각각의 나눗셈을 전개해 -6x^2+17x를 얻고 b-a = 17-(-6) = 23을 계산했다. 23

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
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 부등식 중에서 $x=2$를 해로 갖는 것은? [3점]

**보기** ① $3x-1 > 7$  ② $2x \le 5-x$  ③ $4-3x \ge 0$  ④ $5x-4 < 3x+3$  ⑤ $1-2x > x$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 부등식에 $x=2$를 대입하여 성립하는지 확인한다. aligned
2. ④ $5(2) - 4 = 6 < 3(2) + 3 = 9$ (참). aligned
3. 나머지 ①, ②, ③, ⑤는 모두 거짓이다. aligned
4. 따라서 $x=2$를 해로 갖는 것은 ④이다. aligned
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 부등식 중에서 $x=2」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형 → 일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질**
- 이유: 수 2를 대입하여 일차부등식의 참 거짓을 판별한다. aligned
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_SOLUTION_CHECK → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_INEQUALITY_VALUE_MEMBERSHIP_TEST → NONE**
- 이유: 주어진 수 2가 일차부등식의 해가 되는지 판별하는 유형이다. aligned
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수 2를 부등식에 직접 대입하여 성립 여부를 확인하는 기초 문항이다. aligned

**4칸**
- given: 부등식←stem:「다음 부등식 중에서」
- goal: 해←stem:「$x=2$를 해로 갖는 것은?」
- method: 대입(NAMED)←solution:「$x=2$를 각 부등식에 대입하여」
- condition: (없음)

**how** 각 보기에 x=2를 대입해 좌변 6 < 우변 9가 참인 4번을 찾았다. aligned

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
1. $a+2 \le b+2$의 양변에서 2를 빼면 $a \le b$이다. aligned
2. ①, ②, ③, ④는 부등호 방향이 바뀌지 않아 $\le$이다. aligned
3. ⑤ $a \le b$의 양변에 음수 -2를 곱하면 $-2a \ge -2b$가 되어 부등호의 방향이 반대로 바뀐다. aligned
4. 따라서 부등호 방향이 다른 것은 ⑤이다. aligned
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a+2 \le b+2$일」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: 음수 -2를 곱했을 때 부등호 방향이 반대가 되는 성질을 확인한다. aligned
**유형** PT=PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE / TPL=NONE **원천→판정: PT_M2_INEQUALITY_PROPERTY_DIRECTION → PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE** **원천→판정: TPL_INEQUALITY_TRANSFORM_DIRECTION_AUDIT → NONE**
- 이유: 부등식의 성질을 이용하여 음수를 곱할 때 부등호 방향 변화를 판별하는 유형이다. aligned
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음수 곱셈 시 부등호 방향 반전 성질을 묻는 기본 개념 문항이다. aligned

**4칸**
- given: 부등식←stem:「$a+2 \le b+2$일 때,」
- goal: 부등식←stem:「부등호의 방향이 나머지 넷과 다른 하나는?」
- method: 부등식(NAMED)←solution:「부등식의 양변에 같은 수를 더하거나 빼도」
- condition: (없음)

**how** 양변에 음수 -2를 곱하면 부등호 방향이 반대로 바뀌는 성질을 이용해 5번을 골랐다. aligned

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
1. $-7 \le x \le 3$이고 $a < 0$이므로 각 변에 a를 곱하면 $3a \le ax \le -7a$이다. ax aligned
2. $\frac{1}{2} + 3a \le \frac{1}{2} + ax \le \frac{1}{2} - 7a$이다. ax aligned
3. 최댓값: $\frac{1}{2} - 7a = 4 \implies -7a = \frac{7}{2} \implies a = -\frac{1}{2}$이다. ax aligned
4. 최솟값: $b = \frac{1}{2} + 3\left(-\frac{1}{2}\right) = -1$이다. ax aligned
5. $a - b = -\frac{1}{2} - (-1) = \frac{1}{2}$이다. 따라서 정답은 ③이다. ax aligned
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-7 \le x \le 3」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건 → 일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질**
- 이유: 부등식의 각 변에 음수를 곱해 최댓값 4를 만족하는 ax의 a를 찾는다. ax aligned
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_COEFFICIENT_CONDITION → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_LINEAR_EXPRESSION_BOUND_OPTIMIZATION → NONE**
- 이유: 범위 -7 <= x <= 3에서 음수 a를 곱한 식 ax의 최댓값과 최솟값을 구하는 유형이다. ax aligned
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음수 조건 a<0에서 ax의 부등호 반전과 최댓값 4를 연립하여 a-b를 구하는 응용 문항이다. ax aligned

**4칸**
- given: 부등식←stem:「$-7 \le x \le 3$일 때,」
- goal: 최댓값←stem:「상수 $a, b$에 대하여 $a-b$의 값은?」
- method: 최댓값(NAMED)←solution:「최댓값 조건을 이용하여 $a$를 구한다.」
- condition: 조건←stem:「$a < 0$일 때, 상수 $a, b$에 대하여」

**how** a<0일 때 ax의 부등호 방향을 바꾸어 최댓값 식 1/2-7a=4에서 a=-1/2, b=-1을 구해 a-b=1/2을 얻었다. ax aligned

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
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다. 다음 물음에 답하시오. [7점]


(1) 순환소수를 $x$로 놓고 기약분수로 나타내는 과정을 서술하시오. [4점]
(2) $A$의 값 중 가장 작은 세 자리의 자연수를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\dfrac{28}{15}$, (2) $105$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) $x = 1.8666\dots$라 하면 $100x = 186.666\dots$, $10x = 18.666\dots$이다. 105
2. 변끼리 빼면 $90x = 168 \implies x = \frac{168}{90} = \frac{28}{15}$이다. 105
3. (2) $x \times A = \frac{28}{15} \times A$가 자연수가 되려면 A는 15의 배수이어야 한다. 105
4. 15의 배수 중 가장 작은 세 자리의 자연수는 105이다. 105
- 작성자 답: (1) $\dfrac{28}{15}$, (2) $105$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1번] 순환소수 $」
**RPM** M2-RPM-004 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 조건을 만족하는 유리수 → 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로**
- 이유: 분수 변환 후 분모 15의 배수 중 세 자리 최솟값 105를 결정한다. 105
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_TO_NATURAL_PRODUCT → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_FRACTION_MULTIPLIER_DIGIT_BOUND → NONE**
- 이유: 순환소수를 기약분수로 나타내고 자연수가 되기 위한 세 자리 수 105를 구하는 유형이다. 105
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 100x-10x 방식을 서술하고 분모 15의 배수 중 최소 세 자리 수 105를 찾는 서술형 문항이다. 105

**4칸**
- given: 순환소수←stem:「순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면」
- goal: 기약분수←stem:「(1) 순환소수를 $x$로 놓고 기약분수로 나타내는 과정을」
- method: 기약분수(NAMED)←solution:「따라서 구하는 기약분수는 $\dfrac{28}{15}$이다.」
- condition: 자연수←stem:「가장 작은 세 자리의 자연수를 구하시오.」

**how** 100x-10x=90x=168에서 28/15를 구하고 분모 15의 배수 중 세 자리 최솟값 105를 구했다. 105

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
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

[서술형 2번] $\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\left(\frac{2x^3}{y^a}\right)^b = \frac{2^b x^{3b}}{y^{ab}} = \frac{8x^c}{y^{12}}$이다. 12
2. 계수 비교: $2^b = 8 = 2^3 \implies b = 3$이다. 12
3. x 지수 비교: $c = 3b = 9$이다. 12
4. y 지수 비교: $ab = 12 \implies 3a = 12 \implies a = 4$이다. 12
5. $a + b - c = 4 + 3 - 9 = -2$이다. 12
- 작성자 답: $-2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2번] $\left」
**RPM** M2-RPM-008 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱] (원천과 같음)
- 이유: 분수 거듭제곱 전개와 y의 지수 12 비교를 통해 미지수를 결정한다. 12
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_MONOMIAL_EXPONENT_COMPARE_EQUATION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_MONOMIAL_QUOTIENT_POWER_COEFFICIENT_MATCH → NONE**
- 이유: 지수법칙 전개와 계수 및 지수 12를 비교하여 상수의 연산값을 구하는 유형이다. 12
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 거듭제곱 지수법칙으로 계수 8과 지수 12를 비교해 a, b, c를 구하는 서술형 문항이다. 12

**4칸**
- given: 지수법칙←stem:「$\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때」
- goal: 상수←stem:「$a+b-c$의 값을 구하는 과정을 서술하시오.」
- method: 지수법칙(NAMED)←solution:「좌변을 지수법칙을 이용하여 전개한다.」
- condition: (없음)

**how** 좌변을 전개해 2^b=8, ab=12, 3b=c에서 b=3, a=4, c=9를 구하고 4+3-9=-2를 얻었다. 12

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

**발문**

[서술형 3번] $-3 \le x \le 5$일 때, $a \le 4 - \dfrac{1}{2}x \le b$이다. 이때 $4ab$의 값을 구하는 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $33$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $-3 \le x \le 5$의 각 변에 $-\frac{1}{2}$을 곱하면 $-\frac{5}{2} \le -\frac{1}{2}x \le \frac{3}{2}$이다. 33
2. 각 변에 4를 더하면 $\frac{3}{2} \le 4 - \frac{1}{2}x \le \frac{11}{2}$이다. 33
3. $a = \frac{3}{2}, b = \frac{11}{2}$이므로 $4ab = 4 \times \frac{3}{2} \times \frac{11}{2} = 33$이다. 33
- 작성자 답: $33$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3번] $-3 \l」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: 부등식의 각 변에 수를 곱하고 더해 범위 양 끝값의 곱 33을 구한다. 33
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_INTERVAL_TRANSFORM → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_LINEAR_RANGE_PRODUCT_EVAL → NONE**
- 이유: 부등식의 성질을 이용하여 일차식의 범위를 구하고 곱 33을 구하는 유형이다. 33
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음수 곱셈 시 부등호 반전과 덧셈을 거쳐 4ab=33을 도출하는 서술형 문항이다. 33

**4칸**
- given: 부등식←stem:「$-3 \le x \le 5$일 때,」
- goal: 식의 값←stem:「이때 $4ab$의 값을 구하는 과정을 서술하시오.」
- method: 범위(NAMED)←solution:「$4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.」
- condition: (없음)

**how** 각 변에 -1/2를 곱하고 4를 더해 a=3/2, b=11/2를 구한 뒤 4ab=33을 계산했다. 33

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
