# 검수 묶음 — 24_연향중_1학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 23개 / 검사 PASS 20, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 5, 2단계 17, 3단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (PT, TPL)
- **Q2**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q8**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q9**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q10**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (PT, TPL)
- **Q17**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

분수 $\dfrac{7}{54}$을 순환소수로 나타내었을 때, 순환마디를 구하면? [3점]

**보기** ① $296$  ② $962$  ③ $629$  ④ $129$  ⑤ $2962$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $7 \div 54 = 0.1296296\dots$ 이다. (54)
2. 소수점 아래 첫째 자리 1 다음부터 $296$이 한없이 되풀이된다. (54)
3. 따라서 순환마디는 $296$이며 정답은 ①이다. (54)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{7}{5」
**RPM** M2-RPM-003 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현] (원천과 같음)
- 이유: 유리수와 순환소수 단원의 순환마디와 표현 유형에 해당한다. (54)
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_FIND_PERIOD → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_FRACTION_TO_REPEATING_PERIOD → NONE**
- 이유: 분수를 순환소수로 변환하여 순환마디를 찾는 기본 유형이다. (54)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 간단한 나눗셈으로 순환마디를 직접 확인하는 기본 난이도 1 문항이다. (54)

**4칸**
- given: 순환소수←stem:「분수 $\dfrac{7}{54}$을 순환소수로 나타내었을 때」
- goal: 순환마디←stem:「순환마디를 구하면?」
- method: 순환소수(NAMED)←solution:「분수 $\dfrac{7}{54}$을 나눗셈하여 순환소수로 나타낸다.」
- condition: (없음)

**how** 분자를 분모로 나누어 소수점 아래 반복되는 최소 마디를 구했다. (54)

<details><summary>저장 해설 (판정 검토용)</summary>

분수 $\dfrac{7}{54}$을 나눗셈하여 순환소수로 나타낸다.
$$
7 \div 54 = 0.1296296296\dots
$$
소수점 아래 첫째 자리 $1$ 다음부터 $296$이 끝없이 되풀이된다.
$$
\frac{7}{54} = 0.1\dot{2}9\dot{6}
$$
따라서 순환마디는 되풀이되는 가장 짧은 한 부분인 $296$이다.
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

순환소수를 분수로 나타낼 때, $1000x - 10x$를 이용하는 것이 가장 편리한 것은? [4점]

**보기** ① $2.\dot{3}\dot{7}$  ② $0.5\dot{2}\dot{8}$  ③ $1.\dot{4}1\dot{6}$  ④ $3.4\dot{7}$  ⑤ $0.12\dot{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $1000x - 10x$를 이용하려면 소수점 아래 3자리까지 첫 순환마디가 끝나고, 순환하지 않는 자리가 소수점 아래 1자리여야 한다. (1000)
2. ② $1.3\dot{2}\dot{5}$는 소수점 아래 첫째 자리는 순환하지 않고 둘째, 셋째 자리가 순환마디이므로 $1000x - 10x$를 이용한다. (1000)
3. 따라서 알맞은 것은 ②이다. (1000)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「순환소수를 분수로 나타낼 때」
**RPM** M2-RPM-004 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로] (원천과 같음)
- 이유: 유리수와 순환소수 단원의 순환소수를 분수로 나타내기 유형이다. (1000)
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_TO_FRACTION_EQ → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_FRACTION_EQUATION_CHOICE → NONE**
- 이유: 순환소수를 분수로 나타낼 때 적절한 식을 선택하는 유형이다. (1000)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 순환소수를 분수로 고치는 10의 거듭제곱 관계를 이해하는 난이도 2 문항이다. (1000)

**4칸**
- given: 순환소수←stem:「순환소수를 분수로 나타낼 때」
- goal: 다항식←stem:「이용하는 것이 가장 편리한 것은?」
- method: 거듭제곱(NAMED)←solution:「$x$에 $10$의 거듭제곱을 곱하여 소수점 아래 순환마디의 숫자 배열을 완전히 일치시켜 뺀다.」
- condition: (없음)

**how** 순환소수의 순환마디 시작과 끝 위치에 맞춰 10의 거듭제곱 차를 판별했다. (1000)

<details><summary>저장 해설 (판정 검토용)</summary>

$x$에 $10$의 거듭제곱을 곱하여 소수점 아래 순환마디의 숫자 배열을 완전히 일치시켜 뺀다.
$1000x - 10x$를 이용한다는 것은 다음과 같은 구조를 갖는다.
- $1000x$: 소수점 아래 셋째 자리까지 순환마디가 끝나므로 소수점을 오른쪽으로 $3$자리 이동시킨다.
- $10x$: 소수점 아래 첫째 자리는 순환하지 않으므로 소수점을 오른쪽으로 $1$자리 이동시켜 순환마디 바로 앞에 맞춘다.
따라서 소수점 아래 첫째 자리는 비순환이고, 둘째와 셋째 자리가 순환마디인 $0.a\dot{b}\dot{c}$ 꼴이어야 한다.
$$
\begin{aligned}
\text{① } & x = 2.\dot{3}\dot{7} \implies 100x - x \
\text{② } & x = 0.5\dot{2}\dot{8} \implies 1000x = 528.2828\dots, \quad 10x = 5.2828\dots \implies 1000x - 10x \text{ (참)} \
\text{③ } & x = 1.\dot{4}1\dot{6} \implies 1000x - x \
\text{④ } & x = 3.4\dot{7} \implies 100x - 10x \
\text{⑤ } & x = 0.12\dot{5} \implies 1000x - 100x
\end{aligned}
$$
그러므로 가장 편리한 식은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

다음 보기의 분수 중 순환소수로 나타낼 수 있는 것은 모두 몇 개인가? [4점]


$$\dfrac{21}{70}, \quad \dfrac{14}{2 \times 3^{2} \times 7}, \quad \dfrac{35}{2^{2} \times 5^{2} \times 7}, \quad \dfrac{15}{2^{3} \times 3 \times 11}, \quad \dfrac{20}{75}$$

**보기** ① $0$개  ② $1$개  ③ $2$개  ④ $3$개  ⑤ $4$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 기약분수로 나타내었을 때 분모의 소인수 중 2 또는 5 이외의 소인수가 있으면 순환소수이다. (21)
2. 각 분수를 기약분수로 나타내어 분모 소인수를 확인하면 순환소수는 3개이다. (21)
3. 따라서 바른 개수는 ④(3개)이다. (21)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 보기의 분수 중 순환소」
**RPM** M2-RPM-001 [유리수와 순환소수 > 유리수와 순환소수 > 유한소수와 무한소수 > 유한소수 판별] (원천과 같음)
- 이유: 유리수와 순환소수 단원의 유한소수와 순환소수 판별 유형이다. (21)
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_COUNT → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_DECIMAL_COLLECTION_COUNT → NONE**
- 이유: 기약분수의 분모 소인수를 통해 순환소수가 되는 분수를 선별하는 유형이다. (21)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 여러 분수의 기약분수 약분 및 분모 소인수 분해를 비교하는 난이도 2 문항이다. (21)

**4칸**
- given: 기약분수←stem:「다음 보기의 분수 중 순환소수로 나타낼 수 있는 것은 모두 몇 개인가?」
- goal: 순환소수←stem:「순환소수로 나타낼 수 있는 것은 모두 몇 개인가?」
- method: 기약분수(NAMED)←solution:「기약분수로 약분한 후 분모를 소인수분해했을 때, $2$ 또는 $5$ 이외의 소인수가 남아 있으면 순환소수이다.」
- condition: (없음)

**how** 각 분수를 기약분수로 고친 뒤 분모 소인수에 2, 5 외의 수가 있는지 확인했다. (21)

<details><summary>저장 해설 (판정 검토용)</summary>

기약분수로 약분한 후 분모를 소인수분해했을 때, $2$ 또는 $5$ 이외의 소인수가 남아 있으면 순환소수이다.
$$
\begin{aligned}
\text{1) } & \frac{21}{70} = \frac{3}{10} = \frac{3}{2 \times 5} \implies \text{분모 소인수 } 2, 5 \implies \text{유한소수} \
\text{2) } & \frac{14}{2 \times 3^2 \times 7} = \frac{14}{14 \times 3^2} = \frac{1}{3^2} \implies \text{분모에 소인수 } 3\text{이 남으므로 순환소수 (1)} \
\text{3) } & \frac{35}{2^2 \times 5^2 \times 7} = \frac{35}{2^2 \times 25 \times 7} = \frac{5 \times 7}{2^2 \times 5^2 \times 7} = \frac{1}{2^2 \times 5} \implies \text{분모 소인수 } 2, 5 \implies \text{유한소수} \
\text{4) } & \frac{15}{2^3 \times 3 \times 11} = \frac{3 \times 5}{2^3 \times 3 \times 11} = \frac{5}{2^3 \times 11} \implies \text{분모에 소인수 } 11\text{이 남으므로 순환소수 (2)} \
\text{5) } & \frac{20}{75} = \frac{4}{15} = \frac{4}{3 \times 5} \implies \text{분모에 소인수 } 3\text{이 남으므로 순환소수 (3)}
\end{aligned}
$$
따라서 순환소수로 나타낼 수 있는 분수는 $3$개이다.
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

어떤 기약분수를 소수로 나타내는데 유진이는 분모를 잘못 보아 $0.\dot{4}\dot{7}$이라 하였고, 태호는 분자를 잘못 보아 $0.\dot{5}\dot{4}$라 하였다. 처음 기약분수를 순환소수로 바르게 나타내면? [4점]

**보기** ① $4.\dot{2}$  ② $4.\dot{7}$  ③ $4.2\dot{7}$  ④ $4.\dot{7}\dot{2}$  ⑤ $4.\dot{2}\dot{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 유진이는 분모를 잘못 보아 $0.\dot{4}\dot{7} = \frac{47}{99}$이므로 분자는 47이다. (4.2)
2. 태호는 분자를 잘못 보아 $0.\dot{5}\dot{4} = \frac{54}{99} = \frac{6}{11}$이므로 분모는 11이다. (4.2)
3. 처음 기약분수는 $\frac{47}{11} = 4.\dot{2}\dot{7}$이다. (4.2)
4. 따라서 정답은 ⑤이다. (4.2)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 기약분수를 소수로 나타」
**RPM** M2-RPM-004 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로] **원천→판정: 유리수와 순환소수 > 유리수와 순환소수 > 유리수와 소수 표현 > 조건을 만족하는 유리수 → 유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환소수를 분수로**
- 이유: 유리수와 순환소수 단원의 순환소수를 분수로 나타내어 조건 해결하기 유형이다. (4.2)
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_RECONSTRUCT_FRACTION → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_MISTAKEN_REPEATING_DECIMAL_FRACTION_RECOVERY → NONE**
- 이유: 잘못 본 순환소수로부터 처음 기약분수를 복원하는 유형이다. (4.2)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 순환소수를 기약분수로 고치고 올바른 분수식을 복원하는 난이도 2 문항이다. (4.2)

**4칸**
- given: 기약분수←stem:「어떤 기약분수를 소수로 나타내는데 유진이는 분모를 잘못 보아」
- goal: 순환소수←stem:「처음 기약분수를 순환소수로 바르게 나타내면?」
- method: 기약분수(NAMED)←solution:「유진이가 잘못 본 순환소수를 기약분수로 나타낸다.」
- condition: (없음)

**how** 잘못 본 각 순환소수를 기약분수로 고쳐 바른 분자와 분모를 취합했다. (4.2)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 유진이가 잘못 본 순환소수를 기약분수로 나타낸다.
$$
0.\dot{4}\dot{7} = \frac{47}{99}
$$
$47$은 소수이므로 $\dfrac{47}{99}$은 기약분수이다.
유진이는 분모를 잘못 보았으므로 원래 기약분수의 분자는 $47$이다.


2단계: 태호가 잘못 본 순환소수를 기약분수로 나타낸다.
$$
0.\dot{5}\dot{4} = \frac{54}{99} = \frac{6}{11}
$$
태호는 분자를 잘못 보았으므로 원래 기약분수의 분모는 $11$이다.


3단계: 처음 기약분수를 구하고 순환소수로 나타낸다.
$$
\text{처음 기약분수} = \frac{47}{11}
$$
이를 소수로 나타내면
$$
\frac{47}{11} = 4.272727\dots = 4.\dot{2}\dot{7}
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

분수 $\dfrac{2}{7}$를 소수로 나타낼 때, 소수점 아래 40번째 숫자를 $a$, 60번째 숫자를 $b$라 하자. 이때 $a+b$의 값은? [4점]

**보기** ① $7$  ② $9$  ③ $11$  ④ $13$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\frac{2}{7} = 0.\dot{2}8571\dot{4}$로 순환마디는 $2, 8, 5, 7, 1, 4$의 6개 숫자이다. (40)
2. $40 = 6 \times 6 + 4$이므로 40번째 숫자는 4번째 숫자인 $7$이다 ($a=7$). (40)
3. $60 = 6 \times 10$이므로 60번째 숫자는 6번째 숫자인 $4$이다 ($b=4$). (40)
4. 따라서 $a+b = 7+4 = 11$이며 정답은 ③이다. (40)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-REPEATING_DECIMAL(유리수와 순환소수) (원천과 같음) (원천과 같음)
- 근거 인용: 「분수 $\dfrac{2}{7」
**RPM** M2-RPM-003 [유리수와 순환소수 > 유리수와 순환소수 > 순환소수 > 순환마디와 표현] (원천과 같음)
- 이유: 유리수와 순환소수 단원의 순환소수의 자릿수 규칙 유형이다. (40)
**유형** PT=PT_M2_REPEATING_DECIMAL / TPL=NONE **원천→판정: PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE → PT_M2_REPEATING_DECIMAL** **원천→판정: TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC → NONE**
- 이유: 순환소수의 순환마디 주기를 이용해 n번째 자리 숫자를 구하는 유형이다. (40)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 나머지 주기를 활용해 소수점 아래 자릿수를 결정하는 난이도 2 문항이다. (40)

**4칸**
- given: 순환소수←stem:「분수 $\dfrac{2}{7}$를 소수로 나타낼 때」
- goal: 상수←stem:「이때 $a+b$의 값은?」
- method: 순환마디(NAMED)←solution:「분수 $\dfrac{2}{7}$를 나눗셈하여 순환소수로 나타낸다.」
- condition: (없음)

**how** 순환마디 길이의 나머지를 이용하여 특정 자릿수의 숫자를 구하고 합했다. (40)

<details><summary>저장 해설 (판정 검토용)</summary>

분수 $\dfrac{2}{7}$를 나눗셈하여 순환소수로 나타낸다.
$$
2 \div 7 = 0.285714285714\dots = 0.\dot{2}8571\dot{4}
$$
순환마디는 $285714$로 숫자의 개수는 $6$개이다.


1단계: 소수점 아래 $40$번째 숫자 $a$를 구한다.
$40$을 순환마디의 길이 $6$으로 나눈 나머지를 계산한다.
$$
40 = 6 \times 6 + 4
$$
나머지가 $4$이므로 $a$는 순환마디 $285714$의 $4$번째 숫자인 $7$이다.
$$
a = 7
$$


2단계: 소수점 아래 $60$번째 숫자 $b$를 구한다.
$60$을 순환마디의 길이 $6$으로 나눈 나머지를 계산한다.
$$
60 = 6 \times 10 + 0
$$
나누어떨어지므로 $b$는 순환마디 $285714$의 마지막($6$번째) 숫자인 $4$이다.
$$
b = 4
$$


3단계: $a+b$의 값을 계산한다.
$$
a + b = 7 + 4 = 11
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 계산이 옳은 것은? [4점]

**보기** ① $\left(a^{4}\right)^{3} = a^{12}$  ② $a^{3} \times a^{5} = a^{15}$  ③ $a^{8} \div a^{4} = a^{2}$  ④ $a^{6} \div a^{6} = 0$  ⑤ $\left(2a^{2}b\right)^{3} = 6a^{6}b^{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지수법칙 $(a^m)^n = a^{mn}$에 의해 $(a^4)^3 = a^{12}$이다. (12)
2. ① $(a^4)^3 = a^{12}$는 옳다. (12)
3. 나머지 선지들은 지수법칙 적용 오류가 있다. (12)
4. 따라서 옳은 것은 ①이다. (12)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 계산이 옳은 것은?」
**RPM** M2-RPM-007 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫] **원천→판정: 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱 → 식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 곱·몫**
- 이유: 식의 계산 단원의 지수법칙 기본 연산 유형이다. (12)
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_LAW_AUDIT → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_LAWS_TRUE_FALSE_SET → NONE**
- 이유: 지수법칙의 적용 결과가 참인지 거짓인지 판별하는 유형이다. (12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수법칙의 기본 공식을 직접 대조하는 기초 난이도 1 문항이다. (12)

**4칸**
- given: 지수법칙←stem:「다음 중 계산이 옳은 것은?」
- goal: 등식←stem:「다음 중 계산이 옳은 것은?」
- method: 지수법칙(NAMED)←solution:「지수법칙을 각 선지에 적용하여 계산 결과를 검증한다.」
- condition: (없음)

**how** 거듭제곱의 곱, 나눗셈, 거듭제곱 규칙을 대조하여 옳은 선지를 골랐다. (12)

<details><summary>저장 해설 (판정 검토용)</summary>

지수법칙을 각 선지에 적용하여 계산 결과를 검증한다.
$$
\begin{aligned}
\text{① } & (a^4)^3 = a^{4 \times 3} = a^{12} \text{ (참)} \
\text{② } & a^3 \times a^5 = a^{3+5} = a^8 \ne a^{15} \text{ (거짓)} \
\text{③ } & a^8 \div a^4 = a^{8-4} = a^4 \ne a^2 \text{ (거짓)} \
\text{④ } & a^6 \div a^6 = 1 \ne 0 \text{ (거짓)} \
\text{⑤ } & (2a^2 b)^3 = 2^3 \times (a^2)^3 \times b^3 = 8a^6 b^3 \ne 6a^6 b^3 \text{ (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$A = 4x^{3}y^{2} \times (-2xy^{2})^{2}$, $B = 18x^{4}y^{5} \div \dfrac{9}{4}x^{2}y$ 일 때, $A \div B$를 계산하면? [4점]

**보기** ① $2x^{2}y^{3}$  ② $2x^{3}y^{2}$  ③ $4x^{3}y^{2}$  ④ $8x^{3}y^{2}$  ⑤ $2x^{7}y^{10}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A = 4x^3 y^2 \times 4x^2 y^4 = 16x^5 y^6$ 이다. (xy)
2. $B = 18x^4 y^5 \times \frac{4}{9x^2 y} = 8x^2 y^4$ 이다. (xy)
3. $A \div B = \frac{16x^5 y^6}{8x^2 y^4} = 2x^3 y^2$ 이다. (xy)
4. 정답 선지에서 $2x^3 y^2$에 해당하는 ②이다. (xy)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A = 4x^{3}y^{2」
**RPM** M2-RPM-011 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산] (원천과 같음)
- 이유: 식의 계산 단원의 단항식의 곱셈과 나눗셈 복합 계산 유형이다. (xy)
**유형** PT=PT_M2_MONOMIAL / TPL=NONE **원천→판정: PT_M2_MONOMIAL_CHAIN_EVALUATION → PT_M2_MONOMIAL** **원천→판정: TPL_MONOMIAL_TWO_STEP_DIVISION → NONE**
- 이유: 단항식의 곱셈과 나눗셈의 복합 연산 유형이다. (xy)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단항식의 거듭제곱 및 곱셈, 나눗셈 복합 연산을 수행하는 난이도 2 문항이다. (xy)

**4칸**
- given: 단항식←stem:「일 때, $A \div B$를 계산하면?」
- goal: 단항식←stem:「$A \div B$를 계산하면?」
- method: 단항식(NAMED)←solution:「식 $A$를 간단히 계산한다.」
- condition: (없음)

**how** 각 단항식의 거듭제곱과 나눗셈을 정리한 후 A를 B로 나누었다. (xy)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 식 $A$를 간단히 계산한다.
$$
(-2xy^2)^2 = (-2)^2 \times x^2 \times (y^2)^2 = 4x^2 y^4
$$
$$
\begin{aligned}
A &= 4x^3 y^2 \times 4x^2 y^4 \
&= (4 \times 4) \times x^{3+2} y^{2+4} \
&= 16x^5 y^6
\end{aligned}
$$


2단계: 식 $B$를 역수 곱셈으로 간단히 계산한다.
$$
\begin{aligned}
B &= 18x^4 y^5 \div \frac{9}{4}x^2 y \
&= 18x^4 y^5 \times \frac{4}{9x^2 y} \
&= \left(18 \times \frac{4}{9}\right) x^{4-2} y^{5-1} \
&= 8x^2 y^4
\end{aligned}
$$


3단계: $A \div B$를 계산한다.
$$
\begin{aligned}
A \div B &= \frac{16x^5 y^6}{8x^2 y^4} \
&= \left(\frac{16}{8}\right) x^{5-2} y^{6-4} \
&= 2x^3 y^2
\end{aligned}
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

다음 $\square$ 안에 알맞은 단항식은? [3점]


$$\square \times (-4x^{3}) = 24x^{8}$$

**보기** ① $6x^{5}$  ② $-6x^{4}$  ③ $6x^{4}$  ④ $-6x^{5}$  ⑤ $-8x^{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\square \times (-4x^3) = 24x^8$ 에서 $\square = 24x^8 \div (-4x^3)$ 이다. (24)
2. 계수는 $24 \div (-4) = -6$, 문자는 $x^8 \div x^3 = x^5$ 이므로 $-6x^5$ 이다. (24)
3. 따라서 알맞은 단항식은 ④이다. (24)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 $\square$ 안에」
**RPM** M2-RPM-010 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 나눗셈] (원천과 같음)
- 이유: 식의 계산 단원의 단항식의 나눗셈 유형이다. (24)
**유형** PT=PT_M2_MONOMIAL / TPL=NONE **원천→판정: PT_M2_MONOMIAL_BLANK_SOLVE → PT_M2_MONOMIAL** **원천→판정: TPL_MONOMIAL_PRODUCT_BLANK → NONE**
- 이유: 단항식의 곱셈식에서 미지의 단항식을 구하는 유형이다. (24)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단항식 나눗셈의 계수와 지수 연산을 수행하는 기초 난이도 1 문항이다. (24)

**4칸**
- given: 단항식←stem:「다음 $\square$ 안에 알맞은 단항식은?」
- goal: 단항식←stem:「안에 알맞은 단항식은?」
- method: 단항식(NAMED)←solution:「등식의 성질을 이용하여 $\square$를 구한다.」
- condition: (없음)

**how** 곱셈식을 역연산 나눗셈으로 변환하여 네모에 들어갈 단항식을 구했다. (24)

<details><summary>저장 해설 (판정 검토용)</summary>

등식의 성질을 이용하여 $\square$를 구한다.
$$
\begin{aligned}
\square &= \frac{24x^8}{-4x^3} \
&= \left(\frac{24}{-4}\right) x^{8-3} \
&= -6x^5
\end{aligned}
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

$\left(\dfrac{8}{3}\right)^{a} = \dfrac{2^{b}}{81}$ 일 때, 두 자연수 $a, b$의 값으로 옳은 것은? [4점]

**보기** ① $a=2, b=6$  ② $a=3, b=9$  ③ $a=4, b=8$  ④ $a=4, b=10$  ⑤ $a=4, b=12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\left(\frac{8}{3}\right)^a = \frac{(2^3)^a}{3^a} = \frac{2^{3a}}{3^a}$ 이다. (81)
2. 우변이 $\frac{2^b}{81} = \frac{2^b}{3^4}$ 이므로 $3^a = 3^4$ 에서 $a=4$ 이다. (81)
3. $b = 3a = 3 \times 4 = 12$ 이다. (81)
4. 따라서 $a=4, b=12$ 이며 정답은 ⑤이다. (81)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\left(\dfrac{8」
**RPM** M2-RPM-008 [식의 계산 > 단항식의 계산 > 지수법칙 > 거듭제곱의 거듭제곱] (원천과 같음)
- 이유: 식의 계산 단원의 지수법칙 거듭제곱의 거듭제곱 유형이다. (81)
**유형** PT=PT_M2_EXPONENT_LAWS / TPL=NONE **원천→판정: PT_M2_EXPONENT_COMPARE_FRACTION → PT_M2_EXPONENT_LAWS** **원천→판정: TPL_EXPONENT_POWER_FRACTION_SOLVE → NONE**
- 이유: 지수법칙을 이용하여 미지인 지수들을 결정하는 유형이다. (81)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 거듭제곱의 거듭제곱 및 분수의 거듭제곱 법칙을 연계하는 난이도 2 문항이다. (81)

**4칸**
- given: 등식←stem:「$\left(\dfrac{8}{3}\right)^{a} = \dfrac{2^{b}}{81}$ 일 때」
- goal: 상수←stem:「두 자연수 $a, b$의 값으로 옳은 것은?」
- method: 소인수(NAMED)←solution:「좌변을 소인수 $2$와 $3$의 거듭제곱으로 나타낸다.」
- condition: (없음)

**how** 밑을 소인수분해하여 분모와 분자의 지수를 각각 비교했다. (81)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 소인수 $2$와 $3$의 거듭제곱으로 나타낸다.
$$
8 = 2^3 \implies \left(\frac{8}{3}\right)^a = \left(\frac{2^3}{3}\right)^a = \frac{(2^3)^a}{3^a} = \frac{2^{3a}}{3^a}
$$
우변의 분모 $81$을 소인수분해한다.
$$
81 = 3^4
$$
따라서 주어진 등식은 다음과 같다.
$$
\frac{2^{3a}}{3^a} = \frac{2^b}{3^4}
$$
분모의 지수를 비교하면
$$
a = 4
$$
분자의 지수를 비교하면
$$
b = 3a = 3 \times 4 = 12
$$
따라서 $a = 4, b = 12$이다.
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

등식 $3x^{A} \times (-2x)^{2} \div 4x^{3} = Bx^{6}$ 이 성립할 때, $A+B$의 값은? (단, $A$는 자연수, $B$는 상수) [4점]

**보기** ① $8$  ② $9$  ③ $10$  ④ $11$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(-2x)^2 = 4x^2$ 이다. (Bx)
2. 좌변은 $3x^A \times 4x^2 \div 4x^3 = 12x^{A+2} \div 4x^3 = 3x^{A+2-3} = 3x^{A-1}$ 이다. (Bx)
3. 우변이 $Bx^6$ 이므로 $B=3$, $A-1=6 \implies A=7$ 이다. (Bx)
4. 따라서 $A+B = 7+3 = 10$ 이며 정답은 ③이다. (Bx)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「등식 $3x^{A} \tim」
**RPM** M2-RPM-011 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산] (원천과 같음)
- 이유: 식의 계산 단원의 미정계수 A와 B를 결정하는 단항식 연산 유형이다. (Bx)
**유형** PT=PT_M2_MONOMIAL / TPL=NONE **원천→판정: PT_M2_MONOMIAL_UNKNOWN_COEFFICIENT_EXPONENT → PT_M2_MONOMIAL** **원천→판정: TPL_MONOMIAL_MIXED_COEFFICIENT_DEGREE_MATCH → NONE**
- 이유: 단항식의 곱셈과 나눗셈을 이용한 미정계수 결정 유형이다. (Bx)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단항식 혼합 계산 후 계수와 지수를 비교하여 미지수를 구하는 난이도 2 문항이다. (Bx)

**4칸**
- given: 등식←stem:「이 성립할 때, $A+B$의 값은?」
- goal: 상수←stem:「$A+B$의 값은?」
- method: 지수법칙(NAMED)←solution:「좌변을 지수법칙을 이용하여 정리한다.」
- condition: 상수←stem:「단, $A$는 자연수, $B$는 상수」

**how** 좌변을 지수법칙으로 정리하여 양변의 계수와 지수를 비교했다. (Bx)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 지수법칙을 이용하여 정리한다.
1단계: $(-2x)^2$을 거듭제곱한다.
$$
(-2x)^2 = (-2)^2 \times x^2 = 4x^2
$$


2단계: 곱셈과 나눗셈을 순서대로 계산한다.
$$
\begin{aligned}
3x^A \times 4x^2 \div 4x^3 &= 12x^{A+2} \div 4x^3 \
&= \left(\frac{12}{4}\right) x^{A+2-3} \
&= 3x^{A-1}
\end{aligned}
$$


3단계: 우변 $Bx^6$과 계수 및 지수를 비교한다.
$$
\begin{aligned}
B &= 3 \
A - 1 &= 6 \implies A = 7
\end{aligned}
$$


4단계: $A+B$의 값을 계산한다.
$$
A + B = 7 + 3 = 10
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

${4y + 3(2x-1)} - 4{x - (3y+2)}$ 를 간단히 하였을 때, 상수항을 포함한 모든 계수의 합은? [4점]

**보기** ① $23$  ② $25$  ③ $27$  ④ $29$  ⑤ $31$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 첫 번째 식: $4y + 6x - 3 = 6x + 4y - 3$ 이다. (23)
2. 두 번째 식: $4(x - 3y - 2) = 4x - 12y - 8$ 이다. (23)
3. 두 식의 차: $(6x + 4y - 3) - (4x - 12y - 8) = 2x + 16y + 5$ 이다. (23)
4. 모든 계수와 상수항의 합: $2 + 16 + 5 = 23$ 이며 정답은 ①이다. (23)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「${4y + 3(2x-1)}」
**RPM** M2-RPM-013 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산] **원천→판정: 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 식의 덧셈·뺄셈 → 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산**
- 이유: 식의 계산 단원의 괄호가 있는 다항식의 덧셈과 뺄셈 유형이다. (23)
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_COEFFICIENT_SUM → PT_M2_POLYNOMIAL** **원천→판정: TPL_POLYNOMIAL_BRACKETS_SUM_EVAL → NONE**
- 이유: 다항식의 괄호 전개와 동류항 정리 및 계수의 합 구하기 유형이다. (23)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다중 괄호 전개 및 부호 주의를 요하는 다항식 연산 난이도 2 문항이다. (23)

**4칸**
- given: 다항식←stem:「${4y + 3(2x-1)} - 4{x - (3y+2)}$ 를 간단히 하였을 때」
- goal: 계수←stem:「상수항을 포함한 모든 계수의 합은?」
- method: 다항식(NAMED)←solution:「소괄호와 중괄호를 순서대로 풀어 동류항끼리 정리한다.」
- condition: (없음)

**how** 괄호를 순차적으로 풀고 동류항을 정리한 후 계수들의 합을 구했다. (23)

<details><summary>저장 해설 (판정 검토용)</summary>

소괄호와 중괄호를 순서대로 풀어 동류항끼리 정리한다.
1단계: 첫 번째 중괄호 안의 식을 전개한다.
$$
\begin{aligned}
{4y + 3(2x-1)} &= 4y + 6x - 3 \
&= 6x + 4y - 3
\end{aligned}
$$


2단계: 두 번째 중괄호 안의 식을 전개한다.
$$
\begin{aligned}
x - (3y+2) &= x - 3y - 2 \
-4{x - 3y - 2} &= -4x + 12y + 8
\end{aligned}
$$


3단계: 전체 식을 동류항끼리 정리한다.
$$
\begin{aligned}
(6x + 4y - 3) + (-4x + 12y + 8) &= (6-4)x + (4+12)y + (-3+8) \
&= 2x + 16y + 5
\end{aligned}
$$


4단계: 상수항을 포함한 모든 계수의 합을 구한다.
$x$의 계수: $2$
$y$의 계수: $16$
상수항: $5$
$$
2 + 16 + 5 = 23
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

어떤 식에 $-3x^{2}+2x-5$를 더해야 할 것을 잘못하여 빼었더니 $5x^{2}-4x+3$이 되었다. 바르게 계산한 식은? [4점]

**보기** ① $-x^{2}+4x-7$  ② $-x^{2}-7$  ③ $2x^{2}-2x-2$  ④ $-x^{2}+7$  ⑤ $8x^{2}-6x+8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A - (-3x^2+2x-5) = 5x^2-4x+3$ 이므로 $A = 5x^2-4x+3 + (-3x^2+2x-5) = 2x^2-2x-2$ 이다. (aligned)
2. 바르게 계산한 식은 $A + (-3x^2+2x-5) = (2x^2-2x-2) + (-3x^2+2x-5) = -x^2-7$ 이다. (aligned)
3. 따라서 바르게 계산한 식은 ②이다. (aligned)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 식에 $-3x^{2}+」
**RPM** M2-RPM-012 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리] **원천→판정: 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 조건식 활용 → 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리**
- 이유: 식의 계산 단원의 다항식의 덧셈과 뺄셈 동류항 정리 유형이다. (aligned)
**유형** PT=PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_MISTAKE_CORRECTION → PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION** **원천→판정: TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER → NONE**
- 이유: 잘못 계산한 다항식의 바른 계산 복원 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 잘못 계산한 식의 역연산과 바른 식 계산을 수행하는 난이도 2 문항이다. (aligned)

**4칸**
- given: 다항식←stem:「어떤 식에 $-3x^{2}+2x-5$를 더해야 할 것을 잘못하여 빼었더니 $5x^{2}-4x+3$이 되었다.」
- goal: 다항식←stem:「바르게 계산한 식은?」
- method: 다항식(NAMED)←solution:「잘못 계산한 등식으로부터 어떤 식 $A$를 구한다.」
- condition: (없음)

**how** 잘못된 식의 결과를 이용해 어떤 식을 구한 후 올바른 덧셈 연산을 적용했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

잘못 계산한 등식으로부터 어떤 식 $A$를 구한다.
$$
A - (-3x^2 + 2x - 5) = 5x^2 - 4x + 3
$$
양변에 $(-3x^2 + 2x - 5)$를 더한다.
$$
\begin{aligned}
A &= (5x^2 - 4x + 3) + (-3x^2 + 2x - 5) \
&= (5-3)x^2 + (-4+2)x + (3-5) \
&= 2x^2 - 2x - 2
\end{aligned}
$$
바르게 계산한 식은 원래 식 $A$에 $(-3x^2 + 2x - 5)$를 더한 값이므로 계산한다.
$$
\begin{aligned}
A + (-3x^2 + 2x - 5) &= (2x^2 - 2x - 2) + (-3x^2 + 2x - 5) \
&= (2-3)x^2 + (-2+2)x + (-2-5) \
&= -x^2 + 0x - 7 \
&= -x^2 - 7
\end{aligned}
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x = 5, y = \dfrac{4}{3}$ 일 때, 식 $6x - {5y + (8x^{2}-4xy) \div 2x}$ 의 값은? [4점]

**보기** ① $2$  ② $4$  ③ $5$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(8x^2 - 4xy) \div 2x = 4x - 2y$ 이다. (xy)
2. 중괄호 내부: $5y + 4x - 2y = 4x + 3y$ 이다. (xy)
3. 전체 식 정리: $6x - (4x + 3y) = 2x - 3y$ 이다. (xy)
4. $x=5, y=\frac{4}{3}$ 대입: $2(5) - 3(\frac{4}{3}) = 10 - 4 = 6$ 이다. (xy)
5. 정답 선지에서 6에 해당하는 ④이다. (xy)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x = 5, y = \df」
**RPM** M2-RPM-016 [식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값] **원천→판정: 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값 구하기 → 식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값**
- 이유: 식의 계산 단원의 식의 값과 활용 유형이다. (xy)
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_SUBSTITUTION_EVALUATION → PT_M2_POLYNOMIAL** **원천→판정: TPL_POLYNOMIAL_SIMPLIFY_THEN_EVALUATE → NONE**
- 이유: 다항식의 혼합 계산 및 식의 값 대입 유형이다. (xy)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다항식의 나눗셈 전개 후 식의 값을 대입하여 계산하는 난이도 2 문항이다. (xy)

**4칸**
- given: 미지수←stem:「$x = 5, y = \dfrac{4}{3}$ 일 때」
- goal: 다항식←stem:「의 값은? [4점]」
- method: 다항식(NAMED)←solution:「소괄호 안의 다항식을 단항식으로 나눈다.」
- condition: (없음)

**how** 다항식을 단항식으로 나눈 후 식을 간단히 하여 수치를 대입했다. (xy)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 소괄호 안의 다항식을 단항식으로 나눈다.
$$
\begin{aligned}
(8x^2 - 4xy) \div 2x &= \frac{8x^2}{2x} - \frac{4xy}{2x} \
&= 4x - 2y
\end{aligned}
$$


2단계: 중괄호 안의 식을 정리한다.
$$
5y + (4x - 2y) = 4x + 3y
$$


3단계: 전체 식을 간단히 정리한다.
$$
\begin{aligned}
6x - (4x + 3y) &= 6x - 4x - 3y \
&= 2x - 3y
\end{aligned}
$$


4단계: $x = 5, y = \dfrac{4}{3}$를 대입하여 식의 값을 구한다.
$$
\begin{aligned}
2x - 3y &= 2(5) - 3\left(\frac{4}{3}\right) \
&= 10 - 4 \
&= 6
\end{aligned}
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\dfrac{1}{3}a(9a-6b) - \dfrac{3}{4}a(8a-12b)$ 를 간단히 하였을 때, $ab$의 계수에서 $a^2$의 계수를 뺀 값은? [4점]

**보기** ① $-10$  ② $-4$  ③ $4$  ④ $7$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\frac{1}{3}a(9a-6b) = 3a^2 - 2ab$ 이다. (12)
2. $\frac{3}{4}a(8a-12b) = 6a^2 - 9ab$ 이다. (12)
3. 두 식의 차: $(3a^2 - 2ab) - (6a^2 - 9ab) = -3a^2 + 7ab$ 이다. (12)
4. $ab$의 계수는 $7$, $a^2$의 계수는 $-3$이므로 차는 $7 - (-3) = 10$이다. (12)
5. 따라서 정답은 ⑤이다. (12)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\dfrac{1}{3}a(」
**RPM** M2-RPM-014 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙] **원천→판정: 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 단항식과 다항식의 곱셈 → 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙**
- 이유: 식의 계산 단원의 단항식과 다항식의 분배법칙 유형이다. (12)
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE **원천→판정: PT_M2_POLYNOMIAL_EXPANSION_COEFFICIENT_SUBTRACTION → PT_M2_POLYNOMIAL** **원천→판정: TPL_POLYNOMIAL_DISTRIBUTIVE_COEFF_DIFF → NONE**
- 이유: 분배법칙을 통한 다항식 전개 및 특정 항의 계수 계산 유형이다. (12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단항식과 다항식의 곱셈 전개 및 계수 간 연산을 다루는 난이도 2 문항이다. (12)

**4칸**
- given: 다항식←stem:「$\dfrac{1}{3}a(9a-6b) - \dfrac{3}{4}a(8a-12b)$ 를 간단히 하였을 때」
- goal: 계수←stem:「$ab$의 계수에서 $a^2$의 계수를 뺀 값은?」
- method: 다항식(NAMED)←solution:「분배법칙을 이용하여 각 식을 전개한다.」
- condition: (없음)

**how** 분배법칙을 적용하여 전개하고 동류항을 정리한 후 계수의 차를 계산했다. (12)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 분배법칙을 이용하여 각 식을 전개한다.
$$
\begin{aligned}
\frac{1}{3}a(9a-6b) &= \frac{1}{3}a \times 9a - \frac{1}{3}a \times 6b \
&= 3a^2 - 2ab
\end{aligned}
$$
$$
\begin{aligned}
-\frac{3}{4}a(8a-12b) &= -\frac{3}{4}a \times 8a + \left(-\frac{3}{4}a\right) \times (-12b) \
&= -6a^2 + 9ab
\end{aligned}
$$


2단계: 동류항끼리 모아 식을 정리한다.
$$
\begin{aligned}
(3a^2 - 2ab) + (-6a^2 + 9ab) &= (3-6)a^2 + (-2+9)ab \
&= -3a^2 + 7ab
\end{aligned}
$$
따라서 $a^2$의 계수는 $-3$이고, $ab$의 계수는 $7$이다.


3단계: $ab$의 계수에서 $a^2$의 계수를 뺀 값을 계산한다.
$$
7 - (-3) = 7 + 3 = 10
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 $\square$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? [4점]

**보기** ① $a+4 < b+4 \implies a \;\square\; b$  ② $3a-2 < 3b-2 \implies a \;\square\; b$  ③ $5-2a < 5-2b \implies a \;\square\; b$  ④ $\dfrac{a}{3}+1 < \dfrac{b}{3}+1 \implies a \;\square\; b$  ⑤ $a \div (-5) > b \div (-5) \implies a \;\square\; b$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 부등식의 양변에 음수를 곱하거나 나눌 때만 부등호의 방향이 바뀐다. (aligned)
2. 각 선지에서 $a$와 $b$의 부등호 방향을 판별하면 ③만 다른 방향이다. (aligned)
3. 따라서 부등호 방향이 다른 하나는 ③이다. (aligned)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $\square$」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: 일차부등식 단원의 부등식의 성질 유형이다. (aligned)
**유형** PT=PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE / TPL=NONE **원천→판정: PT_M2_INEQUALITY_PROPERTY_DIRECTION → PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE** **원천→판정: TPL_INEQUALITY_TRANSFORM_DIRECTION_AUDIT → NONE**
- 이유: 부등식의 성질 적용의 옳고 그름 및 방향 판별 유형이다. (aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부등식의 기본 성질과 음수 연산 시 방향 전환을 묻는 기본 난이도 1 문항이다. (aligned)

**4칸**
- given: 부등식←stem:「다음 중 $\square$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는?」
- goal: 부등식←stem:「나머지 넷과 다른 하나는?」
- method: 부등식(NAMED)←solution:「부등식의 성질을 이용하여 각 선지에서 $a$와 $b$의 대소 관계를 구한다.」
- condition: (없음)

**how** 부등식의 양변에 같은 수를 더하거나 뺄 때, 곱하거나 나눌 때의 성질을 검토했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

부등식의 성질을 이용하여 각 선지에서 $a$와 $b$의 대소 관계를 구한다.
$$
\begin{aligned}
\text{① } & a+4 < b+4 \implies a < b \quad (<) \
\text{② } & 3a-2 < 3b-2 \implies 3a < 3b \implies a < b \quad (<) \
\text{③ } & 5-2a < 5-2b \implies -2a < -2b \implies a > b \quad (>) \
\text{④ } & \frac{a}{3}+1 < \frac{b}{3}+1 \implies \frac{a}{3} < \frac{b}{3} \implies a < b \quad (<) \
\text{⑤ } & -\frac{a}{5} > -\frac{b}{5} \implies a < b \quad (<)
\end{aligned}
$$
선지 ①, ②, ④, ⑤는 모두 $a < b$이지만, ③은 $a > b$이다.
따라서 부등호의 방향이 나머지 넷과 다른 하나는 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

일차부등식 $3x-5 \le 10-2x$ 를 만족시키는 자연수 $x$의 개수는? [4점]

**보기** ① $3$개  ② $2$개  ③ $4$개  ④ $5$개  ⑤ $1$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $3x - 5 \le 10 - 2x$ 에서 $3x + 2x \le 10 + 5$ 이다. (10)
2. $5x \le 15$ 이므로 $x \le 3$ 이다. (10)
3. 만족시키는 자연수 $x$는 $1, 2, 3$의 3개이다. (10)
4. 따라서 자연수의 개수는 ①(3개)이다. (10)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $3x-5 \le」
**RPM** M2-RPM-020 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형] (원천과 같음)
- 이유: 일차부등식 단원의 기본 일차부등식 풀이 유형이다. (10)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_LINEAR_INEQUALITY_SOLVE_COUNT → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_INEQUALITY_NATURAL_SOLUTION_COUNT → NONE**
- 이유: 기본 일차부등식을 풀어 자연수 해의 개수를 구하는 유형이다. (10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 일차부등식의 기본 풀이와 자연수 해 개수를 묻는 난이도 1 문항이다. (10)

**4칸**
- given: 부등식←stem:「일차부등식 $3x-5 \le 10-2x$ 를 만족시키는」
- goal: 부등식←stem:「자연수 $x$의 개수는?」
- method: 부등식(NAMED)←solution:「주어진 일차부등식을 푼다.」
- condition: 미지수←stem:「자연수 $x$」

**how** 동류항을 이항하여 부등식을 푼 후 범위 내 자연수를 세었다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 일차부등식을 푼다.
$$
\begin{aligned}
3x - 5 &\le 10 - 2x \
3x + 2x &\le 10 + 5 \
5x &\le 15 \
x &\le 3
\end{aligned}
$$
$x \le 3$을 만족시키는 자연수 $x$는 $1, 2, 3$의 $3$개이다.
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

일차부등식 $2x-a > 5x+1$ 의 해가 $x < -3$ 일 때, 상수 $a$의 값은? [4점]

**보기** ① $6$  ② $8$  ③ $10$  ④ $-8$  ⑤ $-10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $2x - a > 5x + 1 \implies -3x > a + 1 \implies x < -\frac{a+1}{3}$ 이다. (10)
2. 해 $x < -3$과 같으므로 $-\frac{a+1}{3} = -3$ 이다. (10)
3. $a+1 = 9 \implies a = 8$ 이다. (10)
4. 따라서 상수 $a$의 값은 ②이다. (10)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $2x-a > 5」
**RPM** M2-RPM-023 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건] (원천과 같음)
- 이유: 일차부등식 단원의 주어진 해에 따른 계수 a 결정 유형이다. (10)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_COEFFICIENT_MATCH → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_INEQUALITY_TARGET_SOLUTION_COEFF_SOLVE → NONE**
- 이유: 해의 조건이 주어졌을 때 미지수의 값을 구하는 일차부등식 유형이다. (10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 주어진 해의 조건으로부터 일차부등식의 계수 미지수를 결정하는 난이도 2 문항이다. (10)

**4칸**
- given: 부등식←stem:「일차부등식 $2x-a > 5x+1$ 의 해가 $x < -3$ 일 때」
- goal: 상수←stem:「상수 $a$의 값은?」
- method: 부등식(NAMED)←solution:「주어진 일차부등식을 $x$에 대하여 푼다.」
- condition: (없음)

**how** 미지수를 포함한 일차부등식을 x에 대해 풀고 주어진 해와 비교하여 a를 구했다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 일차부등식을 $x$에 대하여 푼다.
$$
\begin{aligned}
2x - a &> 5x + 1 \
2x - 5x &> a + 1 \
-3x &> a + 1
\end{aligned}
$$
양변을 음수 $-3$으로 나누면 부등호의 방향이 바뀐다.
$$
x < -\frac{a+1}{3}
$$
이 부등식의 해가 $x < -3$과 같으므로 경곗값을 비교한다.
$$
\begin{aligned}
-\frac{a+1}{3} &= -3 \
a + 1 &= 9 \
a &= 8
\end{aligned}
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차부등식 $x-4 \le -3x+4a$ 의 해 중 가장 큰 정수가 $-1$ 일 때, 상수 $a$의 값의 범위는? [5점]

**보기** ① $-2 < a \le -1$  ② $-2 \le a \le -1$  ③ $-1 \le a < 0$  ④ $-2 \le a < -1$  ⑤ $0 \le a < 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x - 4 \le -3x + 4a \implies 4x \le 4a + 4 \implies x \le a + 1$ 이다. (aligned)
2. 해 중 가장 큰 정수가 $-1$이 되려면 수직선상에서 $-1 \le a+1 < 0$ 이어야 한다. (aligned)
3. 각 변에서 1을 빼면 $-2 \le a < -1$ 이다. (aligned)
4. 선지 중 올바른 범위는 ④이다. (aligned)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $x-4 \le」
**RPM** M2-RPM-022 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수 해의 개수 → 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수**
- 이유: 일차부등식 단원의 정수해 개수 및 조건 유형이다. (aligned)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_MAX_INTEGER_CONDITION → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_INEQUALITY_INTEGER_BOUND_PARAMETER_RANGE → NONE**
- 이유: 조건을 만족시키는 최대 정수 해로부터 상수의 범위를 결정하는 유형이다. (aligned)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수직선상에서 경계 포함 여부(등호 조건)를 정밀하게 분석해야 하는 난이도 3 문항이다. (aligned)

**4칸**
- given: 부등식←stem:「일차부등식 $x-4 \le -3x+4a$ 의 해 중 가장 큰 정수가 $-1$ 일 때」
- goal: 상수←stem:「상수 $a$의 값의 범위는?」
- method: 부등식(NAMED)←solution:「주어진 부등식을 $x$에 대하여 푼다.」
- condition: 부등식←stem:「가장 큰 정수가 $-1$」

**how** x에 대해 정리한 후 수직선상에서 가장 큰 정수 조건을 만족하는 경계값을 결정했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 주어진 부등식을 $x$에 대하여 푼다.
$$
\begin{aligned}
x - 4 &\le -3x + 4a \
x + 3x &\le 4a + 4 \
4x &\le 4a + 4 \
x &\le a + 1
\end{aligned}
$$


2단계: 가장 큰 정수해가 $-1$이 되는 조건을 수직선 위에서 파악한다.
$x \le a+1$을 만족시키는 정수 중 최댓값이 $-1$이 되려면,
$-1$은 해에 포함되어야 하고, $-1$보다 큰 정수인 $0$은 해에 포함되지 않아야 한다.
$$
-1 \le a+1 < 0
$$


3단계: 각 변에서 $1$을 빼어 $a$의 범위를 구한다.
$$
-2 \le a < -1
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차부등식 $\dfrac{2x+1}{4} < 0.75 + \dfrac{1}{3}x$ 를 만족시키는 가장 큰 정수 $x$의 값은? [4점]

**보기** ① $-2$  ② $-1$  ③ $0$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $0.75 = \frac{3}{4}$ 이므로 부등식은 $\frac{2x+1}{4} < \frac{3}{4} + \frac{1}{3}x$ 이다. (0.75)
2. 양변에 분모의 최소공배수 12를 곱하면 $3(2x+1) < 9 + 4x$ 이다. (0.75)
3. $6x + 3 < 9 + 4x \implies 2x < 6 \implies x < 3$ 이다. (0.75)
4. 만족시키는 가장 큰 정수는 2이다. (0.75)
5. 따라서 정답은 ⑤이다. (0.75)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $\dfrac{2」
**RPM** M2-RPM-021 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 복잡한 식의 풀이 → 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식**
- 이유: 일차부등식 단원의 괄호·분수·소수가 있는 부등식 유형이다. (0.75)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_MIXED_COEFFICIENT_SOLVE → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_INEQUALITY_FRACTION_DECIMAL_INTEGER_MAX → NONE**
- 이유: 분수와 소수를 포함한 일차부등식의 풀이 및 정수 해 구하기 유형이다. (0.75)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분수와 소수가 혼합된 일차부등식을 풀고 최대 정수를 찾는 난이도 2 문항이다. (0.75)

**4칸**
- given: 부등식←stem:「일차부등식 $\dfrac{2x+1}{4} < 0.75 + \dfrac{1}{3}x$ 를 만족시키는」
- goal: 미지수←stem:「가장 큰 정수 $x$의 값은?」
- method: 기약분수(NAMED)←solution:「소수 $0.75$를 분수로 고친다.」
- condition: 미지수←stem:「가장 큰 정수 $x$」

**how** 소수를 분수로 바꾸고 양변에 12를 곱하여 정수 계수로 고쳐 풀었다. (0.75)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 소수 $0.75$를 분수로 고친다.
$$
0.75 = \frac{75}{100} = \frac{3}{4}
$$
따라서 부등식은 다음과 같다.
$$
\frac{2x+1}{4} < \frac{3}{4} + \frac{1}{3}x
$$


2단계: 분모의 최소공배수인 $12$를 양변에 곱하여 계수를 정수로 만든다.
$$
\begin{aligned}
12 \times \left(\frac{2x+1}{4}\right) &< 12 \times \left(\frac{3}{4} + \frac{1}{3}x\right) \
3(2x+1) &< 3 \times 3 + 4x \
6x + 3 &< 9 + 4x
\end{aligned}
$$


3단계: 이항하여 부등식을 푼다.
$$
\begin{aligned}
6x - 4x &< 9 - 3 \
2x &< 6 \
x &< 3
\end{aligned}
$$


4단계: $x < 3$을 만족시키는 가장 큰 정수를 구한다.
$3$보다 작은 정수 $\dots, 0, 1, 2$ 중 가장 큰 정수는 $2$이다.
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

기차역에서 기차 출발 시각까지 $1$시간 $20$분의 여유가 있다. 상점에 가서 물건을 사는 데 $20$분이 걸리고, 시속 $3\,\mathrm{km}$로 걸어서 다녀오려고 한다. 역에서 최대 몇 $\mathrm{km}$ 떨어진 상점까지 다녀올 수 있는가? [5점]

**보기** ① $1.2\,\mathrm{km}$  ② $1.4\,\mathrm{km}$  ③ $1.5\,\mathrm{km}$  ④ $1.8\,\mathrm{km}$  ⑤ $2.0\,\mathrm{km}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 왕복 걷는 데 쓸 수 있는 시간은 $1$시간 $20$분 $- 20$분 $= 1$시간이다. (20)
2. 역에서 상점까지의 거리를 $x\,\mathrm{km}$라 하면 왕복 걸린 시간은 $\frac{2x}{3}$시간이다. (20)
3. $\frac{2x}{3} \le 1 \implies 2x \le 3 \implies x \le 1.5$ 이다. (20)
4. 따라서 최대 $1.5\,\mathrm{km}$ 이내 상점을 이용할 수 있으므로 정답은 ③이다. (20)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY_WORD(일차부등식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「기차역에서 기차 출발 시각까」
**RPM** M2-RPM-026 [일차부등식과 연립일차방정식 > 일차부등식의 활용 > 거리·속력·시간 > 시간 제한] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 활용 > 거리·속력·시간 → 일차부등식과 연립일차방정식 > 일차부등식의 활용 > 거리·속력·시간 > 시간 제한**
- 이유: 일차부등식의 활용 단원의 거리·속력·시간 시간 제한 유형이다. (20)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=NONE **원천→판정: PT_M2_INEQUALITY_SPEED_DISTANCE_TIME → PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED** **원천→판정: TPL_SPEED_ROUND_TRIP_TIME_LIMIT → NONE**
- 이유: 왕복 이동 시간 제한을 활용한 일차부등식 실생활 활용 유형이다. (20)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 거리, 속력, 시간 관계를 이용하여 일차부등식 활용 식을 세우는 난이도 2 문항이다. (20)

**4칸**
- given: 속력←stem:「시속 $3\,\mathrm{km}$로 걸어서 다녀오려고 한다.」
- goal: 거리←stem:「역에서 최대 몇 $\mathrm{km}$ 떨어진 상점까지 다녀올 수 있는가?」
- method: 거리(NAMED)←solution:「순수하게 걷는 데 사용할 수 있는 시간을 계산한다.」
- condition: 속력←stem:「상점에 가서 물건을 사는 데 $20$분이 걸리고」

**how** 왕복 이동 시간에 물건 사는 시간을 더한 총 시간이 여유 시간 이하임을 이용했다. (20)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 순수하게 걷는 데 사용할 수 있는 시간을 계산한다.
전체 여유 시간은 $1$시간 $20$분이고 물건 사는 데 $20$분이 걸리므로
$$
1\text{시간 } 20\text{분} - 20\text{분} = 1\text{시간}
$$


2단계: 역에서 상점까지의 거리를 $x\,\mathrm{km}$라 하고 부등식을 세운다.
시속 $3\,\mathrm{km}$로 갈 때 걸리는 시간은 $\dfrac{x}{3}$시간이고, 올 때 걸리는 시간도 $\dfrac{x}{3}$시간이다.
왕복 걸린 시간의 합이 $1$시간 이하이어야 하므로
$$
\frac{x}{3} + \frac{x}{3} \le 1
$$


3단계: 부등식을 푼다.
$$
\begin{aligned}
\frac{2x}{3} &\le 1 \
2x &\le 3 \
x &\le \frac{3}{2} = 1.5
\end{aligned}
$$
따라서 최대 $1.5\,\mathrm{km}$ 떨어진 상점까지 다녀올 수 있다.
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 1번] 밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피는 밑면의 반지름의 길이가 $3b$, 높이가 $2a$인 원기둥의 부피의 몇 배인지 구하고 그 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{2a}{9b}$배   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원뿔의 부피: $V_1 = \frac{1}{3} \times \pi (2a)^2 \times 3b = 4\pi a^2 b$ 이다. (aligned)
2. 원기둥의 부피: $V_2 = \pi (3b)^2 \times 2a = 18\pi a b^2$ 이다. (aligned)
3. 원뿔 부피는 원기둥 부피의 $\frac{V_1}{V_2} = \frac{4\pi a^2 b}{18\pi a b^2} = \frac{2a}{9b}$ 배이다. (aligned)
4. 따라서 정답은 $\frac{2a}{9b}$배이다. (aligned)
- 작성자 답: $\dfrac{2a}{9b}$배 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-EXPONENT_LAW(지수법칙) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1번] 밑면의 반지」
**RPM** M2-RPM-011 [식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산] **원천→판정: 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 단항식의 나눗셈 → 식의 계산 > 단항식의 계산 > 단항식의 곱셈과 나눗셈 > 혼합 계산**
- 이유: 식의 계산 단원의 입체도형 부피와 단항식의 나눗셈 비 유형이다. (aligned)
**유형** PT=PT_M2_MONOMIAL / TPL=NONE **원천→판정: PT_M2_MONOMIAL_GEOMETRIC_VOLUME_RATIO → PT_M2_MONOMIAL** **원천→판정: TPL_CONE_CYLINDER_VOLUME_RATIO_ALGEBRAIC → NONE**
- 이유: 단항식의 계산을 이용한 입체도형 부피의 비 계산 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 입체도형 부피 공식과 단항식 나눗셈을 융합한 서술형 난이도 2 문항이다. (aligned)

**4칸**
- given: 반지름←stem:「밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피는」
- goal: 단항식←stem:「원기둥의 부피의 몇 배인지 구하고 그 과정을 서술하시오.」
- method: 단항식(NAMED)←solution:「밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피 $V_1$을 구한다.」
- condition: (없음)

**how** 원뿔과 원기둥의 부피 공식을 단항식으로 나타내어 비율을 구했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피 $V_1$을 구한다.
$$
\begin{aligned}
V_1 &= \frac{1}{3} \times \pi \times (2a)^2 \times 3b \
&= \frac{1}{3} \times \pi \times 4a^2 \times 3b \
&= 4\pi a^2 b
\end{aligned}
$$


2단계: 밑면의 반지름의 길이가 $3b$, 높이가 $2a$인 원기둥의 부피 $V_2$를 구한다.
$$
\begin{aligned}
V_2 &= \pi \times (3b)^2 \times 2a \
&= \pi \times 9b^2 \times 2a \
&= 18\pi ab^2
\end{aligned}
$$


3단계: 원뿔의 부피가 원기둥 부피의 몇 배인지 비율 $\dfrac{V_1}{V_2}$를 구한다.
$$
\begin{aligned}
\frac{V_1}{V_2} &= \frac{4\pi a^2 b}{18\pi ab^2} \
&= \frac{4}{18} \times \frac{a^2}{a} \times \frac{b}{b^2} \
&= \frac{2a}{9b}
\end{aligned}
$$
따라서 원뿔의 부피는 원기둥 부피의 $\dfrac{2a}{9b}$배이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 2번] 두 일차부등식 $4x-3 \le 2x+5$ 와 $2x-a \ge 4(x-3)+2$ 의 해가 서로 같을 때, 상수 $a$의 값을 구하는 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 첫 번째 부등식: $4x - 3 \le 2x + 5 \implies 2x \le 8 \implies x \le 4$ 이다. (aligned)
2. 두 번째 부등식: $2x - a \ge 4x - 12 + 2 \implies -2x \ge a - 10 \implies x \le \frac{10-a}{2}$ 이다. (aligned)
3. 두 해가 서로 같으므로 $\frac{10-a}{2} = 4 \implies 10-a = 8 \implies a = 2$ 이다. (aligned)
4. 따라서 상수 $a$의 값은 $2$이다. (aligned)
- 작성자 답: $2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2번] 두 일차부등」
**RPM** M2-RPM-023 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 해가 서로 같을 때 → 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건**
- 이유: 일차부등식 단원의 두 일차부등식 해의 일치 조건으로 상수 a 구하기 서술형 유형이다. (aligned)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_EQUIVALENT_INEQUALITIES_COEFFICIENT → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_SAME_SOLUTION_INEQUALITIES_SOLVE → NONE**
- 이유: 두 일차부등식의 해가 서로 같을 조건의 미지수 구하기 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 부등식의 해가 일치함을 이용하여 미지수를 구하는 서술형 난이도 2 문항이다. (aligned)

**4칸**
- given: 부등식←stem:「두 일차부등식 $4x-3 \le 2x+5$ 와 $2x-a \ge 4(x-3)+2$ 의 해가 서로 같을 때」
- goal: 상수←stem:「상수 $a$의 값을 구하는 과정을 서술하시오.」
- method: 부등식(NAMED)←solution:「첫 번째 일차부등식을 푼다.」
- condition: (없음)

**how** 두 일차부등식을 각각 x에 대해 푼 뒤 해의 경계값을 일치시켜 a를 구했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 첫 번째 일차부등식을 푼다.
$$
\begin{aligned}
4x - 3 &\le 2x + 5 \
4x - 2x &\le 5 + 3 \
2x &\le 8 \
x &\le 4
\end{aligned}
$$


2단계: 두 번째 일차부등식을 괄호를 풀어 정리한다.
$$
\begin{aligned}
2x - a &\ge 4(x-3) + 2 \
2x - a &\ge 4x - 12 + 2 \
2x - a &\ge 4x - 10 \
2x - 4x &\ge a - 10 \
-2x &\ge a - 10
\end{aligned}
$$
양변을 음수 $-2$로 나누면 부등호의 방향이 바뀐다.
$$
x \le \frac{-(a-10)}{2} = \frac{10-a}{2}
$$


3단계: 두 부등식의 해가 서로 같으므로 경곗값을 비교하여 방정식을 세운다.
$$
\begin{aligned}
\frac{10-a}{2} &= 4 \
10 - a &= 8 \
a &= 2
\end{aligned}
$$
따라서 구하는 상수 $a$의 값은 $2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 3번] 어느 체험 학습장의 입장료는 어른이 $1200$원, 어린이가 $800$원이다. 어른과 어린이를 합하여 모두 $30$명이 입장하려고 할 때, 총 입장료가 $28000$원 이하가 되게 하려면 어른은 최대 몇 명까지 입장할 수 있는지 구하는 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $10$명   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 어른 수를 $x$명이라 하면 어린이 수는 $30-x$명이다. (1200)
2. 총 입장료 부등식: $1200x + 800(30-x) \le 28000$ 이다. (1200)
3. 양변을 400으로 나누면 $3x + 2(30-x) \le 70 \implies 3x + 60 - 2x \le 70 \implies x \le 10$ 이다. (1200)
4. 따라서 어른은 최대 10명까지 입장할 수 있다. (1200)
- 작성자 답: $10$명 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY_WORD(일차부등식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3번] 어느 체험」
**RPM** M2-RPM-024 [일차부등식과 연립일차방정식 > 일차부등식의 활용 > 수량 관계 > 이상·이하 조건] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 활용 > 비용과 금액 → 일차부등식과 연립일차방정식 > 일차부등식의 활용 > 수량 관계 > 이상·이하 조건**
- 이유: 일차부등식의 활용 단원의 수량 관계 이상·이하 조건 유형이다. (1200)
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_INEQUALITY_TOTAL_COST_LIMIT → PT_M2_LINEAR_INEQUALITY** **원천→판정: TPL_TWO_ITEM_BUDGET_MAX_QUANTITY → NONE**
- 이유: 수량 관계와 총 금액 제한을 활용한 일차부등식 활용 유형이다. (1200)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 실생활 인원 및 금액 조건을 일차부등식으로 모델링하는 서술형 난이도 2 문항이다. (1200)

**4칸**
- given: 미지수←stem:「어느 체험 학습장의 입장료는 어른이 $1200$원, 어린이가 $800$원이다.」
- goal: 미지수←stem:「어른은 최대 몇 명까지 입장할 수 있는지 구하는 과정을 서술하시오.」
- method: 미지수(NAMED)←solution:「입장하는 어른의 수를 $x$명이라 하면, 전체 인원이 $30$명이므로 어린이의 수는 $(30 - x)$명이다.」
- condition: 부등식←stem:「총 입장료가 $28000$원 이하가 되게 하려면」

**how** 어른 인원을 x로 두고 총 입장료에 대한 부등식을 세워 최대 정수를 구했다. (1200)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 미지수를 정한다.
입장하는 어른의 수를 $x$명이라 하면, 전체 인원이 $30$명이므로 어린이의 수는 $(30 - x)$명이다. (단, $x$는 $0 \le x \le 30$인 정수)


2단계: 총 입장료에 대한 부등식을 세운다.
$$
1200x + 800(30 - x) \le 28000
$$


3단계: 부등식을 푼다.
양변을 $100$으로 나눈다.
$$
12x + 8(30 - x) \le 280
$$
괄호를 풀어 전개한다.
$$
\begin{aligned}
12x + 240 - 8x &\le 280 \
4x + 240 &\le 280 \
4x &\le 280 - 240 \
4x &\le 40 \
x &\le 10
\end{aligned}
$$


4단계: 문제의 조건에 맞는 답을 구한다.
$x \le 10$이므로 어른은 최대 $10$명까지 입장할 수 있다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
