# 검수 묶음 — 25_연향중_1학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 23개 / 검사 PASS 22, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 2, 2단계 18, 3단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q8**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q21**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x$가 $11$의 제곱근일 때, 다음 중 항상 옳은 것은? [3점]

**보기** ① $x^2 = 11$  ② $x = 11$  ③ $\sqrt{x} = 11$  ④ $\sqrt{x} = \sqrt{11}$  ⑤ $x^2 = \sqrt{11}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 어떤 수 x가 11의 제곱근이라는 것은 x를 제곱하여 11이 되는 수를 의미한다.
2. 따라서 정의에 의해 x^2 = 11이 항상 성립한다.
3. 선지 중 x^2 = 11을 나타낸 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$가 $11$의 제곱근일 때, 다음 중 항」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 뜻과 정의에 의해 x^2 = 11임을 확인하는 기본 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_DEFINITION **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_CHECK → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT → TPL_M3_ROOT_PROPERTY_DEFINITION**
- 이유: 제곱근의 정의로부터 11의 제곱근 x에 대한 등식을 판별하는 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 11의 제곱근 정의인 x^2 = 11을 바로 찾는 난이도 1 기본 문항이다.

**4칸**
- given: 제곱근←stem:「가 $11$의 제곱근일 때, 다음」
- goal: 관계←solution:「11$ 사이의 관계식을 판별한다.」
- method: 정의(NAMED)←solution:「제곱근의 정의를 적용하여 $」
- condition: 성립조건←solution:「$$ 이 항상 성립한다. 2단계」

**how** 제곱근의 정의에 따라 11의 제곱근 x는 $x^2 = 11$을 만족하므로 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 정의를 적용하여 $x$와 $11$ 사이의 관계식을 판별한다.

1단계: 제곱근의 정의를 검토한다. 어떤 수 $x$를 제곱하여 $a$가 될 때, 즉 $x^2 = a$일 때 $x$를 $a$의 제곱근이라고 한다. 문제에서 $x$가 $11$의 제곱근이라고 하였으므로 $$x^2 = 11$$ 이 항상 성립한다.

2단계: 나머지 선지들의 오류를 검토한다. ② $x = \pm\sqrt{11}$이므로 $x = 11$이라 한 것은 거짓이다. ③, ④ $x$는 음수 $-\sqrt{11}$일 수도 있으므로 실수 범위에서 $\sqrt{x}$를 정의할 수 없다. 따라서 거짓이다. ⑤ $x^2 = 11 \ne \sqrt{11}$이므로 거짓이다.

3단계: 결론을 도출한다. 따라서 항상 옳은 것은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$81$의 두 제곱근을 각각 $a, b$라 할 때, $\sqrt{a-3b}$의 양의 제곱근은? (단, $a>b$) [4점]

**보기** ① $6$  ② $\sqrt{6}$  ③ $3$  ④ $\sqrt{3}$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 81의 두 제곱근은 9와 -9이다.
2. a > b이므로 a = 9, b = -9이다.
3. a - 3b = 9 - 3(-9) = 9 + 27 = 36이다.
4. 따라서 \sqrt{a-3b} = \sqrt{36} = 6이다.
5. 6의 양의 제곱근은 \sqrt{6}이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$81$의 두 제곱근을 각각 $a, b$라 할」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 성질 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 81의 두 제곱근을 구하고 식 a - 3b = 36의 근호 값 6의 양의 제곱근을 계산하는 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ROOT_VALUE **원천→판정: PT_M3_SQUARE_ROOT_REPEATED_EXTRACTION → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_RADICAL_ROOT_CHAIN → TPL_M3_ROOT_PROPERTY_ROOT_VALUE**
- 이유: 제곱근의 대소 조건과 81의 제곱근 연산을 통해 최종 양의 제곱근을 구하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 81의 두 제곱근을 구해 36을 얻고 6의 제곱근까지 2단계로 계산하는 문항이다.

**4칸**
- given: 제곱근←stem:「$81$의 두 제곱근을 각각 $a,」
- goal: 양수←solution:「$6$이 되는 양수는 $\sqrt」
- method: 거듭제곱(NAMED)←stem:「$81$의 두 제곱근을 각각 $a」
- condition: 제곱근←solution:「두 제곱근 $a, b$의」

**how** 81의 제곱근 9, -9를 대입해 $\sqrt{36}=6$을 얻고 6의 양의 제곱근 $\sqrt{6}$인 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 제곱근 $a, b$의 값을 구한 후 식의 값을 계산하고, 최종적으로 그 값의 양의 제곱근을 구한다.

1단계: $a, b$의 값을 구한다. $81$의 두 제곱근은 $\pm\sqrt{81} = \pm 9$이다. $a > b$이므로 $$a = 9, \quad b = -9$$

2단계: $\sqrt{a - 3b}$의 값을 계산한다. $$a - 3b = 9 - 3(-9) = 9 + 27 = 36$$ 따라서 $$\sqrt{a - 3b} = \sqrt{36} = 6$$

3단계: $6$의 양의 제곱근을 구한다. 문제에서 묻는 것은 '$\sqrt{a-3b}$의 양의 제곱근', 즉 '$6$의 양의 제곱근'이다. 제곱하여 $6$이 되는 양수는 $\sqrt{6}$이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$\sqrt{21+a}$가 자연수가 되도록 하는 가장 작은 자연수 $a$의 값은? [4점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \sqrt{21+a}가 자연수가 되려면 21+a가 21보다 큰 완전제곱수이어야 한다.
2. 21보다 큰 완전제곱수는 25, 36, 49 등이 있다.
3. 가장 작은 자연수 a를 구해야 하므로 21+a = 25일 때이다.
4. 따라서 a = 25 - 21 = 4이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{21+a}$가 자연수가 되도록 하」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근이 자연수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 21+a가 완전제곱수 25가 되도록 하는 가장 작은 자연수 a = 4를 구하는 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_RADICAL_ADDITION_SQUARE → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ADDITION_MINIMUM → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 근호 안의 식 21+a가 자연수가 되기 위한 완전제곱수 25 조건을 적용하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 21보다 큰 최초의 완전제곱수 25를 찾아 미지수를 계산하는 기본 문항이다.

**4칸**
- given: 자연수←stem:「21+a}$가 자연수가 되도록 하는」
- goal: 근호←solution:「연수가 되려면 근호 안의 식 $2」
- method: 완전제곱수(NAMED)←solution:「21$보다 큰 완전제곱수이어야 한다.」
- condition: 완전제곱식←solution:「21$보다 큰 완전제곱수이어야 한다.」

**how** 21보다 큰 가장 작은 완전제곱수가 25이므로 $21+a=25$에서 $a=4$인 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sqrt{21+a}$가 자연수가 되려면 근호 안의 식 $21+a$가 $21$보다 큰 완전제곱수이어야 한다.

1단계: $21$보다 큰 완전제곱수를 나열한다. 자연수의 제곱수는 $1, 4, 9, 16, 25, 36, 49, \ldots$이다. $a$가 자연수이므로 $a \ge 1$, 따라서 $$21 + a > 21$$ $21$보다 큰 가장 작은 완전제곱수는 $25$이다.

2단계: 가장 작은 자연수 $a$의 값을 구한다. $$21 + a = 25$$ $$a = 25 - 21 = 4$$ 따라서 $a = 4$일 때 $\sqrt{21+4} = \sqrt{25} = 5$로 자연수가 된다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

자연수 $a$에 대하여 $\sqrt{a}$의 정수 부분을 $f(a)$라 할 때, $f(a)=6$을 만족시키는 자연수 $a$의 개수는? [5점]

**보기** ① $10$개  ② $11$개  ③ $12$개  ④ $13$개  ⑤ $14$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \sqrt{a}의 정수 부분이 6이라는 것은 6 <= \sqrt{a} < 7임을 의미한다.
2. 양변을 제곱하면 36 <= a < 49이다.
3. 이를 만족하는 자연수 a는 36부터 48까지이다.
4. 따라서 자연수 a의 개수는 49 - 36 = 13개이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「자연수 $a$에 대하여 $\sqrt{a}$의 」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수의 정수 부분과 소수 부분 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 정수 부분이 6인 무리수 범위 36 <= a < 49에서 자연수 13개의 개수를 구하는 문제이다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_INTEGER_RANGE **원천→판정: PT_M3_INTEGER_PART_COUNTING → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_RADICAL_FLOOR_RANGE_COUNT → TPL_M3_REAL_COMPARISON_INTEGER_RANGE**
- 이유: 제곱근의 정수 부분 조건으로부터 36과 49 사이의 자연수 개수 13을 세는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부등식 36 <= a < 49를 세우고 정수 개수 13개를 계산하는 기본 문항이다.

**4칸**
- given: 부분←stem:「a}$의 정수 부분을 $f(a)$」
- goal: 개수←stem:「연수 $a$의 개수는? [5점]」
- method: 부등식(NAMED)←solution:「이라는 조건을 부등식으로 나타내고,」
- condition: 범위←solution:「연수 $a$의 범위를 구한다.」

**how** $6 \le \sqrt{a} < 7$에서 $36 \le a < 49$가 되어 $49 - 36 = 13$개인 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sqrt{a}$의 정수 부분이 $6$이라는 조건을 부등식으로 나타내고, 양변을 제곱하여 자연수 $a$의 범위를 구한다.

1단계: 정수 부분의 정의를 부등식으로 나타낸다. $\sqrt{a}$의 정수 부분이 $6$이므로 $$6 \le \sqrt{a} < 7$$

2단계: 부등식의 각 항을 제곱한다. 모든 항이 양수이므로 $$6^2 \le a < 7^2$$ $$36 \le a < 49$$

3단계: 범위 안의 자연수 $a$의 개수를 센다. 자연수 $a$는 $36, 37, 38, \ldots, 48$이다. 개수는 $$49 - 36 = 13\text{개}$$ (또는 $48 - 36 + 1 = 13\text{개}$) 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 <보기>에서 옳은 것을 모두 고른 것은? [4점]

<보기> ㄱ. 순환소수는 유리수이다. ㄴ. $\sqrt{0.64}$는 무리수이다. ㄷ. 수직선 위의 모든 점은 실수에 일대일로 대응한다. ㄹ. 서로 다른 두 무리수 사이에는 무수히 많은 유리수가 존재한다. ㅁ. 무리수는 분수 $\dfrac{a}{b}$ ($a, b$는 정수, $b \ne 0$) 꼴로 나타낼 수 있다.

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄷ  ③ ㄷ, ㄹ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ. 순환소수는 분수로 나타낼 수 있으므로 유리수이다 (참).
2. ㄴ. \sqrt{0.64} = 0.8은 유한소수이므로 유리수이다. 무리수라 하였으므로 거짓이다 (거짓).
3. ㄷ. 수직선 위의 모든 점은 실수와 일대일로 대응한다 (참).
4. ㄹ. 실수의 조밀성에 의해 서로 다른 두 무리수 사이에는 무수히 많은 유리수가 존재한다 (참).
5. ㅁ. 무리수는 분수 a/b (a, b는 정수, b != 0) 꼴로 나타낼 수 없다. 나타낼 수 있다고 하였으므로 거짓이다 (거짓).
6. 따라서 옳은 것은 ㄱ, ㄷ, ㄹ이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <보기>에서 옳은 것을 모두 고른 것은?」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 실수와 무리수의 정의 및 수직선 대응과 0.64 근호식의 진위를 판별하는 문제이다.
**유형** PT=PT_M3_REAL_NUMBERS / TPL=NONE **원천→판정: PT_M3_REAL_NUMBER_TRUE_FALSE_SET → PT_M3_REAL_NUMBERS** **원천→판정: TPL_M3_REAL_NUMBER_THEOREMS → NONE**
- 이유: 0.64 근호값과 실수의 체계 및 조밀성에 관한 각 명제의 참·거짓을 판별하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 유리수와 무리수의 정의, 수직선의 완비성, 0.64 소수 계산을 복합 검증하는 문항이다.

**4칸**
- given: 순환소수←stem:「<보기> ㄱ. 순환소수는 유리수이다.」
- goal: 실수←stem:「의 모든 점은 실수에 일대일로 대」
- method: 무리수(NAMED)←solution:「유리수이다. 무리수라 한 것은 거」
- condition: 수직선←stem:「수이다. ㄷ. 수직선 위의 모든 점」

**how** 0.64의 근호값 0.8은 유리수이므로 ㄴ이 거짓이고 ㄱ, ㄷ, ㄹ이 참이므로 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

실수의 체계, 조밀성 및 수직선 완비성에 대한 각 명제의 진위를 검토한다.

1단계: 각 보기를 검토한다.

- ㄱ: 순환소수는 분수 꼴로 나타낼 수 있으므로 유리수이다. (참)  
- ㄴ: $\sqrt{0.64} = \sqrt{0.8^2} = 0.8 = \dfrac{4}{5}$이므로 유리수이다. 무리수라 한 것은 거짓이다. (거짓)  
- ㄷ: 실수는 수직선 위의 모든 점과 일대일로 대응하므로 수직선 위의 모든 점은 실수에 대응한다. (참)  
- ㄹ: 실수의 조밀성에 의해 서로 다른 두 무리수 사이에는 무수히 많은 유리수(및 무리수)가 존재한다. (참)  
- ㅁ: 분수 $\dfrac{a}{b}$ ($a, b$는 정수, $b \ne 0$) 꼴로 나타낼 수 있는 수는 유리수의 정의이다. 무리수는 이 꼴로 나타낼 수 없는 수이므로 거짓이다. (거짓)

2단계: 옳은 것을 모두 조합한다. 옳은 것은 ㄱ, ㄷ, ㄹ이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

수직선 위의 점 $A$의 좌표가 $-2$이다. 한 눈금의 길이가 $1$인 모눈종이 위에서 점 $A$로부터 가로로 $2$칸, 세로로 $1$칸 이동한 점을 $B$라 하자. $\overline{AB} = \overline{AP}$가 되도록 점 $A$를 중심으로 하고 선분 $AB$를 반지름으로 하는 원호를 그려 수직선의 오른쪽과 만나는 점을 $P$라 할 때, 점 $P$에 대응하는 수는? [4점]

**보기** ① $-2 + \sqrt{5}$  ② $-1 + \sqrt{5}$  ③ $-2 - \sqrt{5}$  ④ $2 + \sqrt{5}$  ⑤ $-3 + \sqrt{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형의 두 직교하는 변의 길이가 2, 1이므로 빗변 AB의 길이는 \sqrt{2^2 + 1^2} = \sqrt{5}이다.
2. 원호의 반지름은 선분 AB의 길이와 같으므로 AP = \sqrt{5}이다.
3. 원의 중심 A의 좌표가 -2이고 점 P는 점 A의 오른쪽에 위치한다.
4. 따라서 점 P에 대응하는 수는 -2 + \sqrt{5}이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 가로 2칸, 세로 1칸 등 기하 정보가 글에 완비되어 있어 그림 불필요

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_LINE(수직선 위의 실수 표현) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_LINE**
- 근거 인용: 「수직선 위의 점 $A$의 좌표가 $-2$이다.」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 선분 AB 길이를 피타고라스 정리로 구하고 기준점 -2에서 AP 오른쪽 점을 대응시키는 문제이다.
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=NONE **원천→판정: PT_M3_NUMBER_LINE_MAPPING → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_SQUARE_DIAGONAL_ROTATION → NONE**
- 이유: 수직선 위의 기준점과 선분 AB 피타고라스 빗변 길이를 결합하여 대응하는 무리수를 결정하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 가로 2, 세로 1 모눈에서 선분 AB 길이를 구하고 중심 -2에서 더하는 기본 문항이다.

**4칸**
- given: 수직선←stem:「수직선 위의 점 $A」
- goal: 좌표←solution:「점 $P$의 좌표를 구한다.」
- method: 직각삼각형(NAMED)←solution:「이가 $1$인 직각삼각형의 빗변이 선분」
- condition: 반지름←stem:「분 $AB$를 반지름으로 하는 원호」

**how** 선분 AB 길이가 $\sqrt{5}$이고 중심이 -2이므로 오른쪽 점 P는 $-2 + \sqrt{5}$인 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리를 이용하여 반지름 $\overline{AB}$의 길이를 구하고, 수직선 위의 기준점과 이동 방향을 고려하여 점 $P$의 좌표를 구한다.

1단계: 피타고라스 정리로 선분 $AB$의 길이를 구한다. 가로의 길이가 $2$, 세로의 길이가 $1$인 직각삼각형의 빗변이 선분 $AB$이므로 $$\overline{AB} = \sqrt{2^2 + 1^2} = \sqrt{4 + 1} = \sqrt{5}$$

2단계: 점 $P$의 좌표를 결정한다. 원의 중심은 점 $A$이고 좌표는 $-2$이다. 선분 $AP$의 길이는 반지름의 길이와 같으므로 $\overline{AP} = \sqrt{5}$이다. 점 $P$는 점 $A$의 오른쪽(양의 방향)에 위치하므로 $$\text{점 } P\text{의 좌표} = -2 + \sqrt{5}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$\sqrt{5} = 2.236, \quad \sqrt{50} = 7.071$일 때, 다음 중 계산 결과가 옳지 않은 것은? [3점]

**보기** ① $\sqrt{500} = 22.36$  ② $\sqrt{5000} = 223.6$  ③ $\sqrt{0.5} = 0.7071$  ④ $\sqrt{0.05} = 0.2236$  ⑤ $\sqrt{0.005} = 0.07071$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① \sqrt{500} = \sqrt{5 \times 100} = 10\sqrt{5} = 10 \times 2.236 = 22.36 (옳음).
2. ② \sqrt{5000} = \sqrt{50 \times 100} = 10\sqrt{50} = 10 \times 7.071 = 70.71이어야 하는데 223.6으로 잘못 계산되었다 (옳지 않음).
3. ③ \sqrt{0.5} = \sqrt{50 / 100} = \sqrt{50} / 10 = 0.7071 (옳음).
4. ④ \sqrt{0.05} = \sqrt{5 / 100} = \sqrt{5} / 10 = 0.2236 (옳음).
5. ⑤ \sqrt{0.005} = \sqrt{50 / 10000} = \sqrt{50} / 100 = 0.07071 (옳음).
6. 따라서 옳지 않은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{5} = 2.236, \quad 」
**RPM** M3-RPM-006 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 값 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값**
- 이유: 근호 안의 수 5000을 100의 거듭제곱으로 변형하여 50 근삿값과 비교하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_APPROXIMATION **원천→판정: PT_M3_RADICAL_APPROXIMATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_POWER_OF_10_DECIMAL_SHIFT → TPL_M3_RADICAL_APPROXIMATION**
- 이유: 제곱근의 성질을 이용해 근호 밖으로 10을 꺼내어 5000 등의 근삿값을 바르게 산출하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 100과 10000 거듭제곱을 이용해 소수점 이동을 점검하여 5000 오류를 찾는 기본 문항이다.

**4칸**
- given: 근호←solution:「근호 안의 수를 $」
- goal: 변환←solution:「거듭제곱으로 변형하여 $\sqr」
- method: 거듭제곱(NAMED)←solution:「10000$의 거듭제곱으로 변형하여」
- condition: 조합←solution:「지 않은 것을 선택한다. 따라서」

**how** $\sqrt{5000} = 10\sqrt{50} = 70.71$인데 $223.6$으로 잘못 표기된 ②를 정답으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수를 $100$ 또는 $10000$의 거듭제곱으로 변형하여 $\sqrt{5}$ 또는 $\sqrt{50}$을 이용한다.

1단계: 각 선지의 값을 계산한다. ① $\sqrt{500} = \sqrt{5 \times 100} = 10\sqrt{5} = 10 \times 2.236 = 22.36$ (옳다) ② $\sqrt{5000} = \sqrt{50 \times 100} = 10\sqrt{50} = 10 \times 7.071 = 70.71$이다. 선지에 제시된 값은 $223.6$이므로 옳지 않다. ③ $\sqrt{0.5} = \sqrt{\dfrac{50}{100}} = \dfrac{\sqrt{50}}{10} = \dfrac{7.071}{10} = 0.7071$ (옳다) ④ $\sqrt{0.05} = \sqrt{\dfrac{5}{100}} = \dfrac{\sqrt{5}}{10} = \dfrac{2.236}{10} = 0.2236$ (옳다) ⑤ $\sqrt{0.005} = \sqrt{\dfrac{50}{10000}} = \dfrac{\sqrt{50}}{100} = \dfrac{7.071}{100} = 0.07071$ (옳다)

2단계: 옳지 않은 것을 선택한다. 따라서 옳지 않은 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 중 두 실수의 대소 관계가 옳은 것은? [4점]

**보기** ① $-3 > -\sqrt{8}$  ② $\sqrt{6} + 1 < 3$  ③ $4\sqrt{2} > \sqrt{31}$  ④ $\sqrt{8} - 2 < \sqrt{7} - 2$  ⑤ $\sqrt{5} + 2 < 2\sqrt{5} - 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① -3 = -\sqrt{9}이고, \sqrt{9} > \sqrt{8}이므로 -3 < -\sqrt{8}이다 (거짓).
2. ② \sqrt{6} + 1 < 3 <=> \sqrt{6} < 2 <=> \sqrt{6} < \sqrt{4}이므로 거짓이다 (거짓).
3. ③ 4\sqrt{2} = \sqrt{32}이고, 32 > 31이므로 \sqrt{32} > \sqrt{31}이다 (참).
4. ④ 양변에 2를 더하면 \sqrt{8} < \sqrt{7}이 되므로 거짓이다 (거짓).
5. ⑤ \sqrt{5} + 2 < 2\sqrt{5} - 1 <=> 3 < \sqrt{5} <=> \sqrt{9} < \sqrt{5}이므로 거짓이다 (거짓).
6. 따라서 옳은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「다음 중 두 실수의 대소 관계가 옳은 것은? 」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 근호 안으로 수를 넣어 32와 31의 크기를 비교하고 부등식 성질을 적용하는 문제이다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_REAL_NUMBER_INEQUALITY → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_RADICAL_ORDER_COMPARISON → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 무리수의 크기를 근호 내부 수 32, 31 비교 및 부등식 이항으로 판별하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 근호 안팎의 수를 비교하고 32 > 31 성질을 점검하는 기본 문항이다.

**4칸**
- given: 관계←stem:「실수의 대소 관계가 옳은 것은?」
- goal: 대소비교←stem:「중 두 실수의 대소 관계가 옳은」
- method: 부등식(NAMED)←solution:「근의 성질 및 부등식의 성질을 적용」
- condition: 실수←stem:「다음 중 두 실수의 대소 관계가」

**how** $4\sqrt{2} = \sqrt{32} > \sqrt{31}$이므로 32, 31을 비교하여 참인 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 성질 및 부등식의 성질을 적용하여 각 선지의 대소 관계를 판정한다.

1단계: 각 선지의 대소를 검토한다. ① $-3 = -\sqrt{9}$이다. $9 > 8$이므로 $\sqrt{9} > \sqrt{8}$이고, 음수를 곱하면 $-\sqrt{9} < -\sqrt{8}$이다. 즉 $-3 < -\sqrt{8}$이므로 거짓이다. ② 양변에서 $1$을 빼면 $\sqrt{6} < 2 = \sqrt{4}$이다. $6 > 4$이므로 $\sqrt{6} > 2$이어야 하므로 거짓이다. ③ $4\sqrt{2} = \sqrt{4^2 \times 2} = \sqrt{16 \times 2} = \sqrt{32}$이다. $32 > 31$이므로 $\sqrt{32} > \sqrt{31}$, 즉 $4\sqrt{2} > \sqrt{31}$이다. 따라서 참이다. ④ 양변에 $2$를 더하면 $\sqrt{8} < \sqrt{7}$이 된다. $8 > 7$이므로 $\sqrt{8} > \sqrt{7}$이어야 하므로 거짓이다. ⑤ $\sqrt{5} + 2 < 2\sqrt{5} - 1$의 양변에서 $\sqrt{5}$를 빼고 $1$을 더하면 $3 < \sqrt{5} = \sqrt{5}$가 된다. $3 = \sqrt{9} > \sqrt{5}$이므로 거짓이다.

2단계: 옳은 것을 선택한다. 따라서 옳은 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{2} \times \sqrt{3} \times \sqrt{4} \times \sqrt{5} \times \sqrt{6} \times \sqrt{7} = A\sqrt{35}$일 때, 유리수 $A$의 값은? [4점]

**보기** ① $6$  ② $8$  ③ $10$  ④ $12$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변의 모든 근호식을 곱한다.
2. \sqrt{2 \times 3 \times 4 \times 5 \times 6 \times 7}을 계산한다.
3. 소인수분해하면 2 \times 3 \times 2^2 \times 5 \times (2 \times 3) \times 7 = 2^4 \times 3^2 \times (5 \times 7)이다.
4. 근호 밖으로 꺼내면 \sqrt{2^4 \times 3^2 \times 35} = 2^2 \times 3 \times \sqrt{35} = 12\sqrt{35}이다.
5. 따라서 A\sqrt{35} = 12\sqrt{35}이므로 유리수 A의 값은 12이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{2} \times \sqrt{3}」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호의 곱셈에서 제곱인수들을 근호 밖으로 꺼내어 12\sqrt{35}의 A를 구하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=NONE **원천→판정: PT_M3_RADICAL_MULTIPLE_PRODUCT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_CONSECUTIVE_RADICAL_FACTORING → NONE**
- 이유: 연속된 무리수들의 곱을 소인수분해하여 35를 남기고 유리수 12를 도출하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 소인수의 지수를 정리해 완전제곱수를 근호 밖으로 꺼내어 12를 얻는 기본 문항이다.

**4칸**
- given: 유리수←stem:「5}$일 때, 유리수 $A$의 값은」
- goal: 정리←solution:「제곱 인수를 정리하여 $A$를」
- method: 소인수분해(NAMED)←solution:「안의 수들을 소인수분해하여 곱한다.」
- condition: 근호←solution:「곱을 하나의 근호로 묶거나 각」

**how** 근호 내부를 소인수분해하여 $2^4 \times 3^2 \times 35$로부터 $12\sqrt{35}$를 얻어 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

연속된 제곱근들의 곱을 하나의 근호로 묶거나 각 항의 제곱 인수를 정리하여 $A$를 구한다.

1단계: 좌변의 근호 안의 수들을 소인수분해하여 곱한다. $$\sqrt{2 \times 3 \times 4 \times 5 \times 6 \times 7}$$ 각 수를 소인수분해하면 $$2 \times 3 \times 2^2 \times 5 \times (2 \times 3) \times 7$$ 소인수별로 지수를 합산하면 $$= 2^{1 + 2 + 1} \times 3^{1 + 1} \times 5 \times 7 = 2^4 \times 3^2 \times 35$$

2단계: 제곱인수를 근호 밖으로 꺼낸다. $$\sqrt{2^4 \times 3^2 \times 35} = \sqrt{(2^2 \times 3)^2 \times 35} = \sqrt{12^2 \times 35} = 12\sqrt{35}$$

3단계: $A$의 값을 비교한다. $$12\sqrt{35} = A\sqrt{35}$$ 따라서 유리수 $A$의 값은 $12$이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\dfrac{2\sqrt{a}}{4\sqrt{3}} = \dfrac{\sqrt{21}}{6}$일 때, 자연수 $a$의 값은? [4점]

**보기** ① $2$  ② $3$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변의 분수식을 간단히 한다: (2\sqrt{a}) / (4\sqrt{3}) = \sqrt{a} / (2\sqrt{3})이다.
2. 주어진 등식은 \sqrt{a} / (2\sqrt{3}) = \sqrt{21} / 6이다.
3. 양변에 6을 곱하면 (6\sqrt{a}) / (2\sqrt{3}) = \sqrt{21}이다.
4. 좌변을 약분하면 3\sqrt{a} / \sqrt{3} = \sqrt{3}\sqrt{a} = \sqrt{3a}이다.
5. 따라서 \sqrt{3a} = \sqrt{21}이므로 3a = 21, 즉 a = 7이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\dfrac{2\sqrt{a}}{4\sqrt」
**RPM** M3-RPM-008 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫**
- 이유: 근호가 포함된 분수 등식에서 21과 a의 관계를 풀어 자연수 7을 도출하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=NONE **원천→판정: PT_M3_RADICAL_EQUATION_UNKNOWN → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_FRACTION_SOLVE → NONE**
- 이유: 분수식 약분과 분모의 곱셈을 통해 근호 안의 21 값과 일치하는 미지수를 구하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 양변에 6을 곱해 정리하고 21 근호와의 나눗셈을 풀어 a = 7을 찾는 기본 문항이다.

**4칸**
- given: 자연수←stem:「6}$일 때, 자연수 $a$의 값은」
- goal: 등식←solution:「}$$ 따라서 등식은 다음과 같다」
- method: 최소공배수(NAMED)←solution:「양변에 분모의 최소공배수인 $6$을 곱」
- condition: 분수식←solution:「단계: 좌변의 분수식을 간단히 한다」

**how** 양변에 6을 곱해 $\sqrt{3a} = \sqrt{21}$로부터 $3a = 21 \implies a = 7$인 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

비례식 또는 대각선 곱셈을 이용하여 일차방정식을 세우고 근호 안의 미지수 $a$를 구한다.

1단계: 좌변의 분수식을 간단히 한다. $$\dfrac{2\sqrt{a}}{4\sqrt{3}} = \dfrac{\sqrt{a}}{2\sqrt{3}}$$ 따라서 등식은 다음과 같다. $$\dfrac{\sqrt{a}}{2\sqrt{3}} = \dfrac{\sqrt{21}}{6}$$

2단계: 양변에 분모의 최소공배수인 $6$을 곱한다. $$6 \times \dfrac{\sqrt{a}}{2\sqrt{3}} = 6 \times \dfrac{\sqrt{21}}{6}$$ $$\dfrac{3\sqrt{a}}{\sqrt{3}} = \sqrt{21}$$ $$\sqrt{3} \times \sqrt{a} = \sqrt{21}$$ (또는 대각선으로 곱하면 $6\sqrt{a} = 2\sqrt{3}\sqrt{21} = 2\sqrt{63} = 2(3\sqrt{7}) = 6\sqrt{7}$)

3단계: 양변을 $\sqrt{3}$으로 나누어 $\sqrt{a}$를 구한다. $$\sqrt{a} = \dfrac{\sqrt{21}}{\sqrt{3}} = \sqrt{\dfrac{21}{3}} = \sqrt{7}$$

4단계: 양변을 제곱하여 $a$의 값을 구한다. $$a = 7$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{18} - a\sqrt{2} + \sqrt{25} - \sqrt{50}$을 계산한 결과가 유리수가 되도록 하는 유리수 $a$의 값은? [4점]

**보기** ① $-2$  ② $-1$  ③ $0$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \sqrt{18} = 3\sqrt{2}, \sqrt{25} = 5, \sqrt{50} = 5\sqrt{2}이다.
2. 주어진 식을 대입하여 정리하면 3\sqrt{2} - a\sqrt{2} + 5 - 5\sqrt{2}이다.
3. 유리수 부분과 무리수 부분으로 모으면 5 + (3 - a - 5)\sqrt{2} = 5 + (-2 - a)\sqrt{2}이다.
4. 계산 결과가 유리수가 되려면 무리수 \sqrt{2}의 계수가 0이어야 한다.
5. 따라서 -2 - a = 0이므로 a = -2이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{18} - a\sqrt{2} + 」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 식 18, 25, 50을 정리하고 무리수 부분이 0이 되도록 유리수 a를 정하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONAL_CONDITION **원천→판정: PT_M3_RATIONAL_RESULT_CONDITION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_COEFFICIENT_ZERO → TPL_M3_RADICAL_RATIONAL_CONDITION**
- 이유: 동류근호를 모아 18, 50 근호식에서 유리수가 되도록 미지수의 값을 결정하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 18과 50을 꺼내어 -2 - a = 0을 만족하는 a를 계산하는 문항이다.

**4칸**
- given: 유리수←stem:「계산한 결과가 유리수가 되도록 하는」
- goal: 조건←solution:「가 되기 위한 조건을 세운다.」
- method: 동류항(NAMED)←solution:「rt{2}$의 동류항으로 묶은 후,」
- condition: 무리수←solution:「리수가 되려면 무리수 $\sqrt{」

**how** 식 18, 50을 정리해 $5 + (-2-a)\sqrt{2}$에서 $-2-a=0$이므로 $a=-2$인 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수를 꺼내어 $\sqrt{2}$의 동류항으로 묶은 후, 계산 결과가 유리수가 되기 위한 조건을 세운다.

1단계: 각 항을 간단히 한다.

- $\sqrt{18} = \sqrt{9 \times 2} = 3\sqrt{2}$  
- $\sqrt{25} = 5$  
- $\sqrt{50} = \sqrt{25 \times 2} = 5\sqrt{2}$

2단계: 주어진 식을 동류항끼리 정리한다. $$\sqrt{18} - a\sqrt{2} + \sqrt{25} - \sqrt{50} = 3\sqrt{2} - a\sqrt{2} + 5 - 5\sqrt{2}$$ $$= 5 + (3 - a - 5)\sqrt{2} = 5 + (-a - 2)\sqrt{2}$$

3단계: 계산 결과가 유리수가 될 조건을 적용한다. $a$가 유리수이므로 $-a - 2$도 유리수이다. 전체 식이 유리수가 되려면 무리수 $\sqrt{2}$의 계수가 $0$이어야 한다. $$-a - 2 = 0 \implies a = -2$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<보기>에서 계산 결과가 옳지 않은 것만을 있는 대로 고른 것은? [4점]

<보기> ㄱ. $\dfrac{3}{\sqrt{2}} \times \dfrac{2\sqrt{5}}{5} = \dfrac{3\sqrt{10}}{5}$ ㄴ. $6\sqrt{15} \div (-2\sqrt{3}) = -3\sqrt{5}$ ㄷ. $4\sqrt{3} \times \sqrt{18} \div \sqrt{2} = 12\sqrt{3}$ ㄹ. $2\sqrt{18} \div \sqrt{6} \times \sqrt{3} = 3$ ㅁ. $2\sqrt{3} \div \sqrt{\dfrac{3}{8}} \times \sqrt{20} = 4\sqrt{10}$

**보기** ① ㄱ, ㄴ  ② ㄹ, ㅁ  ③ ㄱ, ㄷ, ㄹ  ④ ㄴ, ㄷ, ㅁ  ⑤ ㄷ, ㄹ, ㅁ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ. (3 / \sqrt{2}) * (2\sqrt{5} / 5) = (6\sqrt{5}) / (5\sqrt{2}) = (6\sqrt{10}) / 10 = (3\sqrt{10}) / 5 (옳음).
2. ㄴ. 6\sqrt{15} / (-2\sqrt{3}) = -3\sqrt{5} (옳음).
3. ㄷ. 4\sqrt{3} * \sqrt{18} / \sqrt{2} = 4\sqrt{3} * 3 = 12\sqrt{3} (옳음).
4. ㄹ. 2\sqrt{18} / \sqrt{6} * \sqrt{3} = 2\sqrt{3} * \sqrt{3} = 6 != 3 (옳지 않음).
5. ㅁ. 2\sqrt{3} / \sqrt{3/8} * \sqrt{20} = 2\sqrt{3} * \sqrt{8/3} * 2\sqrt{5} = 2\sqrt{8} * 2\sqrt{5} = 4\sqrt{2} * 2\sqrt{5} = 8\sqrt{10} != 4\sqrt{10} (옳지 않음).
6. 따라서 옳지 않은 것은 ㄹ, ㅁ이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「<보기>에서 계산 결과가 옳지 않은 것만을 있」
**RPM** M3-RPM-013 [실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 곱셈공식 활용] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 곱셈공식 활용**
- 이유: 근호의 곱셈·나눗셈 및 유리화를 거쳐 10, 15, 18 보기의 계산 오류를 검증하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_CALCULATION_AUDIT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_ARITHMETIC_ERROR_FINDING → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 사칙연산과 분모의 유리화를 적용하여 18, 12 근호식 계산 결과의 옳고 그름을 판별하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다섯 개 근호 연산 보기의 18, 20 계산을 정확히 수행해 오답을 가려내는 문항이다.

**4칸**
- given: 근호←solution:「근호의 곱셈, 나눗」
- goal: 판정←solution:「계산 결과를 검증한다. 1단계」
- method: 유리화(NAMED)←solution:「셈 및 분모의 유리화 규칙을 각 보」
- condition: 다항식의나눗셈←solution:「근호의 곱셈, 나눗셈 및 분모의 유」

**how** ㄹ에서 6 != 3이고 ㅁ에서 8\sqrt{10} != 4\sqrt{10}이므로 옳지 않은 ㄹ, ㅁ인 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호의 곱셈, 나눗셈 및 분모의 유리화 규칙을 각 보기에 적용하여 계산 결과를 검증한다.

1단계: 각 보기를 계산한다.

- ㄱ: $\dfrac{3}{\sqrt{2}} \times \dfrac{2\sqrt{5}}{5} = \dfrac{6\sqrt{5}}{5\sqrt{2}} = \dfrac{6\sqrt{10}}{5 \times 2} = \dfrac{6\sqrt{10}}{10} = \dfrac{3\sqrt{10}}{5}$ (옳다)  
- ㄴ: $6\sqrt{15} \div (-2\sqrt{3}) = \dfrac{6\sqrt{15}}{-2\sqrt{3}} = -3\sqrt{\dfrac{15}{3}} = -3\sqrt{5}$ (옳다)  
- ㄷ: $4\sqrt{3} \times \sqrt{18} \div \sqrt{2} = 4\sqrt{3} \times \sqrt{\dfrac{18}{2}} = 4\sqrt{3} \times \sqrt{9} = 4\sqrt{3} \times 3 = 12\sqrt{3}$ (옳다)  
- ㄹ: $2\sqrt{18} \div \sqrt{6} \times \sqrt{3} = 2\sqrt{\dfrac{18}{6}} \times \sqrt{3} = 2\sqrt{3} \times \sqrt{3} = 2 \times 3 = 6$이다. 선지에 제시된 $3$과 다르므로 옳지 않다.  
- ㅁ: $\sqrt{\dfrac{3}{8}} = \dfrac{\sqrt{3}}{\sqrt{8}} = \dfrac{\sqrt{3}}{2\sqrt{2}}$이므로 $$2\sqrt{3} \div \sqrt{\dfrac{3}{8}} \times \sqrt{20} = 2\sqrt{3} \times \dfrac{2\sqrt{2}}{\sqrt{3}} \times 2\sqrt{5} = (2 \times 2 \times 2) \times \sqrt{2 \times 5} = 8\sqrt{10}$$ 선지에 제시된 $4\sqrt{10}$과 다르므로 옳지 않다.

2단계: 옳지 않은 것만을 고른다. 옳지 않은 것은 ㄹ, ㅁ이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

$\mathrm{A}, \mathrm{B}$ 두 개의 주사위를 동시에 던져 나오는 눈의 수를 각각 $a, b$라 할 때, $\sqrt{48ab}$가 자연수가 될 확률은? [5점]

**보기** ① $\dfrac{1}{3}$  ② $\dfrac{1}{4}$  ③ $\dfrac{1}{6}$  ④ $\dfrac{1}{9}$  ⑤ $\dfrac{1}{12}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \sqrt{48ab} = \sqrt{16 \times 3ab} = 4\sqrt{3ab}이다.
2. 이 값이 자연수가 되려면 3ab가 완전제곱수이어야 하므로 ab = 3k^2 꼴이어야 한다.
3. 주사위 눈의 곱 ab의 범위는 1 <= ab <= 36이다.
4. k = 1일 때 ab = 3: (1, 3), (3, 1)의 2가지이다.
5. k = 2일 때 ab = 12: (2, 6), (3, 4), (4, 3), (6, 2)의 4가지이다.
6. k = 3일 때 ab = 27은 주사위 눈으로 만들 수 없다.
7. 따라서 만족하는 순서쌍은 총 2 + 4 = 6가지이고, 전체 경우의 수는 36이므로 확률은 6/36 = 1/6이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「$\mathrm{A}, \mathrm{B}$ 」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근이 자연수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 48ab가 자연수가 되기 위한 조건 ab = 3, 12를 찾고 36 경우 중 확률 1/6을 계산하는 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_RADICAL_DICE_PROBABILITY → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_CONDITION_PROBABILITY → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 48ab 근호식의 자연수 조건을 완전제곱수로 환산하여 주사위 순서쌍의 확률을 구하는 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 48을 소인수분해하여 ab의 3배수 제곱수 조건을 유도하고 36 중 6개를 세는 문항이다.

**4칸**
- given: 자연수←stem:「48ab}$가 자연수가 될 확률은?」
- goal: 확률←stem:「자연수가 될 확률은? [5점]」
- method: 소인수분해(NAMED)←solution:「b$의 조건을 소인수분해로 찾고, 주사」
- condition: 완전제곱수←solution:「$3ab$가 완전제곱수이어야 하므로」

**how** 48ab에서 ab = 3, 12인 6가지 경우를 찾아 전체 36으로 나누어 $1/6$인 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sqrt{48ab}$가 자연수가 되기 위한 $ab$의 조건을 소인수분해로 찾고, 주사위 눈의 순서쌍 $(a, b)$의 개수를 구하여 확률을 계산한다.

1단계: $\sqrt{48ab}$가 자연수가 될 조건을 구한다. $48$을 소인수분해하면 $$48 = 2^4 \times 3$$ 따라서 $$\sqrt{48ab} = \sqrt{2^4 \times 3ab} = 4\sqrt{3ab}$$ 이 값이 자연수가 되려면 $3ab$가 완전제곱수이어야 하므로 $ab$는 다음과 같은 꼴이어야 한다. $$ab = 3 \times k^2 \quad (k\text{는 자연수})$$

2단계: 주사위 눈의 곱 $ab$의 범위를 고려하여 순서쌍 $(a, b)$를 구한다. $1 \le a \le 6, 1 \le b \le 6$이므로 $$1 \le ab \le 36$$

- $k = 1$일 때: $ab = 3 \times 1^2 = 3$ 순서쌍: $(1, 3), (3, 1)$ ($2$가지)  
- $k = 2$일 때: $ab = 3 \times 2^2 = 12$ 순서쌍: $(2, 6), (3, 4), (4, 3), (6, 2)$ ($4$가지)  
- $k = 3$일 때: $ab = 3 \times 3^2 = 27$ $27 = 3 \times 9$이지만 주사위 눈은 $6$ 이하이므로 불가능하다.  
- $k \ge 4$일 때: $ab \ge 3 \times 16 = 48 > 36$이므로 불가능하다.

따라서 조건을 만족시키는 순서쌍 $(a, b)$는 총 $$2 + 4 = 6\text{가지}$$ 이다.

3단계: 확률을 구한다. 두 개의 주사위를 던질 때 일어날 수 있는 모든 경우의 수는 $6 \times 6 = 36$가지이다. 따라서 구하는 확률은 $$\dfrac{6}{36} = \dfrac{1}{6}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(-2a-3b)(a-b) = Aa^2 + Bab + Cb^2$일 때, 상수 $A, B, C$에 대하여 $ABC$의 값은? [3점]

**보기** ① $-6$  ② $-3$  ③ $2$  ④ $6$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (-2a - 3b)(a - b)를 분배법칙으로 전개한다.
2. -2a(a - b) - 3b(a - b) = -2a^2 + 2ab - 3ab + 3b^2이다.
3. 동류항을 정리하면 -2a^2 - ab + 3b^2이다.
4. 우변 Aa^2 + Bab + Cb^2와 계수를 비교하면 A = -2, B = -1, C = 3이다.
5. 따라서 ABC = (-2) \times (-1) \times 3 = 6이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(-2a-3b)(a-b) = Aa^2 + B」
**RPM** M3-RPM-017 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 다항식의 곱셈 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱**
- 이유: 다항식을 전개하여 계수 A, B, C를 구하고 곱 ABC = 6을 계산하는 문제이다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_COEFFICIENT **원천→판정: PT_M3_POLYNOMIAL_EXPANSION_BASIC → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_BINOMIAL_DISTRIBUTIVE_COEFFICIENTS → TPL_M3_MULTIPLICATION_COEFFICIENT**
- 이유: 두 일차식의 곱을 전개하여 동류항 ab를 모으고 계수 관계 ABC를 결정하는 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분배법칙으로 전개해 ab 계수를 모으고 A = -2, B = -1, C = 3을 곱해 ABC를 구하는 기본 문항이다.

**4칸**
- given: 상수←stem:「^2$일 때, 상수 $A, B,」
- goal: 계수←solution:「을 정리한 후 계수를 비교한다.」
- method: 분배법칙(NAMED)←solution:「두 일차식을 분배법칙으로 전개하여」
- condition: 동류항←solution:「으로 전개하여 동류항을 정리한 후」

**how** 전개식 $-2a^2 - ab + 3b^2$로부터 $A=-2, B=-1, C=3$을 얻어 $ABC = 6$인 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

좌변의 두 일차식을 분배법칙으로 전개하여 동류항을 정리한 후 계수를 비교한다.

1단계: 좌변을 분배하여 전개한다. $$(-2a - 3b)(a - b) = (-2a) \times a + (-2a) \times (-b) + (-3b) \times a + (-3b) \times (-b)$$ $$= -2a^2 + 2ab - 3ab + 3b^2$$

2단계: 동류항을 정리한다. $$= -2a^2 - ab + 3b^2$$

3단계: 우변의 계수와 비교하여 $A, B, C$의 값을 구한다. $Aa^2 + Bab + Cb^2 = -2a^2 - ab + 3b^2$이므로 $$A = -2, \quad B = -1, \quad C = 3$$

4단계: $ABC$의 값을 계산한다. $$ABC = (-2) \times (-1) \times 3 = 6$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 $\square$ 안에 알맞은 수가 가장 작은 것은? [4점]

**보기** ① $(3x-2)^2 = 9x^2 - \square x + 4$  ② $(x+5)^2 = x^2 + 10x + \square$  ③ $(x+7)(x-2) = x^2 + 5x - \square$  ④ $(a+4b)(a-4b) = a^2 - \square b^2$  ⑤ $(3x-4y)(-x-2y) = -3x^2 - 2xy + \square y^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① (3x - 2)^2 = 9x^2 - 12x + 4이므로 네모 = 12이다.
2. ② (x + 5)^2 = x^2 + 10x + 25이므로 네모 = 25이다.
3. ③ (x + 7)(x - 2) = x^2 + 5x - 14이므로 네모 = 14이다.
4. ④ (a + 4b)(a - 4b) = a^2 - 16b^2이므로 네모 = 16이다.
5. ⑤ (3x - 4y)(-x - 2y) = -3x^2 - 6xy + 4xy + 8y^2 = -3x^2 - 2xy + 8y^2이므로 네모 = 8이다.
6. 구한 네모의 값은 각각 12, 25, 14, 16, 8이므로 가장 작은 수는 8이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $\square$ 안에 알맞은 수가 」
**RPM** M3-RPM-182 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 여러 곱셈공식 비교·판별] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 여러 곱셈공식 비교·판별**
- 이유: 곱셈공식을 적용하여 10, 12, 25, 14, 16 선지의 네모 값을 비교해 최소값 8을 찾는 문제이다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT **원천→판정: PT_M3_COEFFICIENT_MINIMUM_SEARCH → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_EXPANSION_COEFFICIENT_RANKING → TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT**
- 이유: 다섯 가지 곱셈공식을 전개하여 xy 등 각 네모 안의 계수를 산출하고 크기를 비교하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다섯 보기를 전개해 네모 안의 수 12, 25, 14, 16, 8을 구해 최소를 선택하는 문항이다.

**4칸**
- given: 곱셈공식←solution:「곱셈 공식을 적용하」
- goal: 대소비교←solution:「구하여 크기를 비교한다. 1단계」
- method: 전개(NAMED)←solution:「선지의 좌변을 전개하고, $\sq」
- condition: 양수←solution:「안에 들어갈 양수 값을 각각 구」

**how** 각 보기를 전개해 12, 25, 14, 16과 비교하여 ⑤의 네모가 8로 가장 작으므로 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈 공식을 적용하여 각 선지의 좌변을 전개하고, $\square$ 안에 들어갈 양수 값을 각각 구하여 크기를 비교한다.

1단계: 각 선지의 $\square$ 안의 수를 구한다. ① $(3x-2)^2 = (3x)^2 - 2(3x)(2) + 2^2 = 9x^2 - 12x + 4$ 따라서 $\square = 12$ ② $(x+5)^2 = x^2 + 2(x)(5) + 5^2 = x^2 + 10x + 25$ 따라서 $\square = 25$ ③ $(x+7)(x-2) = x^2 + (7-2)x + 7(-2) = x^2 + 5x - 14$ 따라서 $\square = 14$ ④ $(a+4b)(a-4b) = a^2 - (4b)^2 = a^2 - 16b^2$ 따라서 $\square = 16$ ⑤ $(3x-4y)(-x-2y) = 3x(-x) + 3x(-2y) + (-4y)(-x) + (-4y)(-2y)$ $$= -3x^2 - 6xy + 4xy + 8y^2 = -3x^2 - 2xy + 8y^2$$ 따라서 $\square = 8$

2단계: 다섯 수를 비교한다. $$8 < 12 < 14 < 16 < 25$$ 따라서 $\square$ 안에 들어갈 수가 가장 작은 것은 ⑤의 $8$이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 중 완전제곱식으로 인수분해할 수 없는 것은? [4점]

**보기** ① $9a^2 + 15ab + 4b^2$  ② $x^2 - 14x + 49$  ③ $a^2 + 8ab + 16b^2$  ④ $4x^2 - 12x + 9$  ⑤ $x^2 + x + \dfrac{1}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① 9a^2 + 15ab + 4b^2 = (3a)^2 + 15ab + (2b)^2에서 가운데 항은 2 * 3a * 2b = 12ab이어야 하므로 15ab와 달라 완전제곱식이 아니다.
2. ② x^2 - 14x + 49 = (x - 7)^2 (완전제곱식).
3. ③ a^2 + 8ab + 16b^2 = (a + 4b)^2 (완전제곱식).
4. ④ 4x^2 - 12x + 9 = (2x - 3)^2 (완전제곱식).
5. ⑤ x^2 + x + 1/4 = (x + 1/2)^2 (완전제곱식).
6. 따라서 완전제곱식으로 인수분해할 수 없는 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 완전제곱식으로 인수분해할 수 없는 것」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 완전제곱식 만들기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식**
- 이유: 이차식의 계수 관계를 확인하여 15ab 항이 완전제곱 조건에 맞지 않음을 판별하는 문제이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_SQUARE_CONDITION **원천→판정: PT_M3_PERFECT_SQUARE_AUDIT → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_TRINOMIAL_FACTORABILITY_CHECK → TPL_M3_FACTORIZATION_SQUARE_CONDITION**
- 이유: 완전제곱식의 계수 조건과 선지의 15ab 일치 여부를 검증하여 인수분해 불가를 판별하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 가운데 항이 2*3a*2b = 12ab여야 하는데 15ab로 주어진 ①을 판별하는 기본 문항이다.

**4칸**
- given: 완전제곱식←stem:「다음 중 완전제곱식으로 인수분해할」
- goal: 조합←solution:「수 없는 것을 선택한다. 따라서」
- method: 판정(NAMED)←solution:「완전제곱식으로 판별한다. ① $9」
- condition: 계수←solution:「와 각 선지의 계수 관계를 점검한」

**how** ①에서 $2 \times 3a \times 2b = 12ab \ne 15ab$이므로 완전제곱식이 아닌 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

완전제곱식 $(Ax \pm By)^2 = A^2x^2 \pm 2ABxy + B^2y^2$의 형태와 각 선지의 계수 관계를 점검한다.

1단계: 각 선지를 완전제곱식으로 판별한다. ① $9a^2 + 15ab + 4b^2$: 양 끝 항이 $(3a)^2$, $(2b)^2$이므로 완전제곱식이 되려면 가운데 일차항은 $$\pm 2(3a)(2b) = \pm 12ab$$ 이어야 한다. 현재 식의 가운데 항은 $15ab$이므로 완전제곱식으로 인수분해할 수 없다. ② $x^2 - 14x + 49 = (x - 7)^2$ (완전제곱식) ③ $a^2 + 8ab + 16b^2 = (a + 4b)^2$ (완전제곱식) ④ $4x^2 - 12x + 9 = (2x - 3)^2$ (완전제곱식) ⑤ $x^2 + x + \dfrac{1}{4} = \left(x + \dfrac{1}{2}\right)^2$ (완전제곱식)

2단계: 완전제곱식으로 인수분해할 수 없는 것을 선택한다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x = \dfrac{1}{\sqrt{5}+2}, \quad y = \dfrac{1}{\sqrt{5}-2}$일 때, $x^2+y^2$의 값은? [4점]

**보기** ① $14$  ② $18$  ③ $20$  ④ $22$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x의 분모를 유리화하면 x = (\sqrt{5} - 2) / ((\sqrt{5}+2)(\sqrt{5}-2)) = \sqrt{5} - 2이다.
2. y의 분모를 유리화하면 y = (\sqrt{5} + 2) / ((\sqrt{5}-2)(\sqrt{5}+2)) = \sqrt{5} + 2이다.
3. x + y = (\sqrt{5} - 2) + (\sqrt{5} + 2) = 2\sqrt{5}이다.
4. xy = (\sqrt{5} - 2)(\sqrt{5} + 2) = 5 - 4 = 1이다.
5. 곱셈 공식의 변형을 이용하면 x^2 + y^2 = (x + y)^2 - 2xy = (2\sqrt{5})^2 - 2(1) = 20 - 2 = 18이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x = \dfrac{1}{\sqrt{5}+2」
**RPM** M3-RPM-019 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식을 이용한 식의 값 구하기 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값**
- 이유: 분모를 유리화하여 합과 xy 곱을 구하고 식의 값 18을 계산하는 문제이다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_VALUE **원천→판정: PT_M3_CONJUGATE_SUM_OF_SQUARES → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_SYMMETRIC_EXPRESSION_VALUE → TPL_M3_MULTIPLICATION_VALUE**
- 이유: 무리수 분모를 유리화한 후 곱셈 공식의 변형으로 18 식의 값을 도출하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분모를 유리화하여 x+y와 xy를 구하고 공식에 대입해 18을 얻는 기본 문항이다.

**4칸**
- given: 분모←solution:「분모의 켤레식을 곱」
- goal: 거듭제곱←solution:「(또는 직접 제곱의 합으로 계산」
- method: 유리화(NAMED)←solution:「레식을 곱하여 유리화한 후, 곱셈」
- condition: 곱셈공식←solution:「유리화한 후, 곱셈 공식의 변형을」

**how** 유리화하여 $x+y=2\sqrt{5}, xy=1$로부터 $x^2+y^2 = 20-2 = 18$인 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

분모의 켤레식을 곱하여 유리화한 후, 곱셈 공식의 변형을 이용하여 $x^2+y^2$을 구한다.

1단계: $x, y$의 분모를 각각 유리화한다. $$x = \dfrac{\sqrt{5}-2}{(\sqrt{5}+2)(\sqrt{5}-2)} = \dfrac{\sqrt{5}-2}{5-4} = \sqrt{5}-2$$ $$y = \dfrac{\sqrt{5}+2}{(\sqrt{5}-2)(\sqrt{5}+2)} = \dfrac{\sqrt{5}+2}{5-4} = \sqrt{5}+2$$

2단계: $x+y$와 $xy$의 값을 구한다. $$x + y = (\sqrt{5}-2) + (\sqrt{5}+2) = 2\sqrt{5}$$ $$xy = (\sqrt{5}-2)(\sqrt{5}+2) = 5 - 4 = 1$$

3단계: 곱셈 공식 변형식을 적용하여 $x^2+y^2$을 계산한다. $$x^2 + y^2 = (x + y)^2 - 2xy$$ $$= (2\sqrt{5})^2 - 2(1) = 20 - 2 = 18$$ (또는 직접 제곱의 합으로 계산: $x^2 = (\sqrt{5}-2)^2 = 5 - 4\sqrt{5} + 4 = 9 - 4\sqrt{5}$ $y^2 = (\sqrt{5}+2)^2 = 5 + 4\sqrt{5} + 4 = 9 + 4\sqrt{5}$ $x^2 + y^2 = (9 - 4\sqrt{5}) + (9 + 4\sqrt{5}) = 18$)

따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(ax+b)(x-2)$를 전개하면 $2x^2+3x-14$이고, $3x^2+cx+4$를 인수분해하면 $(x-d)(3x-2)$이다. 이때 $a+b+c+d$의 값은? (단, $a, b, c, d$는 상수) [4점]

**보기** ① $-2$  ② $1$  ③ $3$  ④ $5$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (ax + b)(x - 2) = ax^2 + (b - 2a)x - 2b이다.
2. 이 식이 2x^2 + 3x - 14와 같으므로 a = 2, -2b = -14에서 b = 7이다. (b - 2a = 7 - 4 = 3 성립).
3. (x - d)(3x - 2) = 3x^2 - (2 + 3d)x + 2d이다.
4. 이 식이 3x^2 + cx + 4와 같으므로 2d = 4에서 d = 2이다.
5. c = -(2 + 3d) = -(2 + 6) = -8이다.
6. 따라서 a + b + c + d = 2 + 7 + (-8) + 2 = 3이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(ax+b)(x-2)$를 전개하면 $2x^2」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 전개식 ax 항과 인수분해 식의 계수 비교를 통해 14와 상수를 결정하는 문제이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_COEFFICIENT **원천→판정: PT_M3_COEFFICIENT_MATCH_SYSTEM → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_DUAL_POLYNOMIAL_COEFFICIENT_SUM → TPL_M3_FACTORIZATION_COEFFICIENT**
- 이유: 이차식의 전개와 인수분해에서 ax, cx 등의 계수를 일치시켜 합을 구하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 식의 최고차항과 상수항을 비교해 미정계수를 찾고 14 관계를 검증하는 문항이다.

**4칸**
- given: 전개←stem:「(x-2)$를 전개하면 $2x^2」
- goal: 상수←stem:「c, d$는 상수) [4점]」
- method: 인수분해(NAMED)←stem:「+cx+4$를 인수분해하면 $(x-d」
- condition: 계수←solution:「과 인수분해의 계수 비교를 통해」

**how** ax 전개식과 인수분해 식의 14 계수 비교로 $a=2, b=7, c=-8, d=2$를 얻어 합 3인 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

전개 공식과 인수분해의 계수 비교를 통해 각각의 미정계수 $a, b, c, d$를 구한 후 합산한다.

1단계: 첫 번째 식에서 $a, b$를 구한다. $$(ax + b)(x - 2) = ax^2 + (-2a + b)x - 2b$$ 이 식이 $2x^2 + 3x - 14$와 같으므로 계수를 비교하면

- 최고차항: $a = 2$  
- 상수항: $-2b = -14 \implies b = 7$ (일차항 계수 확인: $-2(2) + 7 = 3$으로 일치한다.)

2단계: 두 번째 식에서 $c, d$를 구한다. $$(x - d)(3x - 2) = 3x^2 + (-2 - 3d)x + 2d$$ 이 식이 $3x^2 + cx + 4$와 같으므로 계수를 비교하면

- 상수항: $2d = 4 \implies d = 2$  
- 일차항 계수: $c = -2 - 3d = -2 - 3(2) = -8$

3단계: $a+b+c+d$의 값을 계산한다. $$a + b + c + d = 2 + 7 + (-8) + 2 = 3$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\dfrac{20005^2 + 4 \times 20005 - 5}{20004}$의 값을 구하면? [4점]

**보기** ① $20004$  ② $20006$  ③ $20008$  ④ $20010$  ⑤ $20012$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x = 20005라 두면 분모는 20004 = x - 1이다.
2. 분자는 x^2 + 4x - 5이다.
3. 분자의 이차식을 인수분해하면 (x + 5)(x - 1)이다.
4. 따라서 주어진 식은 ((x + 5)(x - 1)) / (x - 1) = x + 5이다.
5. x = 20005를 대입하면 20005 + 5 = 20010이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\dfrac{20005^2 + 4 \time」
**RPM** M3-RPM-026 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 수의 계산 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산**
- 이유: 20005를 치환하여 이차식을 인수분해하고 20004로 약분하여 20010을 계산하는 문제이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_NUMERIC **원천→판정: PT_M3_NUMERICAL_FACTORING_FRACTION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_SUBSTITUTION_RATIONAL_SIMPLIFY → TPL_M3_FACTORIZATION_NUMERIC**
- 이유: 복잡한 수 20005를 문자로 치환해 인수분해와 약분으로 20010을 구하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 20005 = x 치환 후 약분하여 x+5 = 20010을 손쉽게 도출하는 기본 문항이다.

**4칸**
- given: 분모←solution:「05$라 두면 분모는 다음과 같다」
- goal: 대입←solution:「계: 분수식에 대입하여 약분한다.」
- method: 인수분해(NAMED)←solution:「하여 이차식을 인수분해한 후 약분하여」
- condition: 이차식←solution:「자로 치환하여 이차식을 인수분해한」

**how** $x=20005$ 치환으로 $((x+5)(x-1))/(x-1) = x+5 = 20010$인 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

큰 수를 문자로 치환하여 이차식을 인수분해한 후 약분하여 식의 값을 구한다.

1단계: 공통이 되는 수를 문자로 치환한다. $t = 20005$라 두면 분모는 다음과 같다. $$20004 = t - 1$$

2단계: 분자의 식을 $t$에 관하여 인수분해한다. $$t^2 + 4t - 5 = (t + 5)(t - 1)$$

3단계: 분수식에 대입하여 약분한다. $$\dfrac{t^2 + 4t - 5}{t - 1} = \dfrac{(t + 5)(t - 1)}{t - 1} = t + 5$$

4단계: $t = 20005$를 대입하여 계산한다. $$t + 5 = 20005 + 5 = 20010$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$-4 < x < 5$일 때, 다음 식을 간단히 하면? [5점] $$\sqrt{x^2+8x+16} - \sqrt{x^2-10x+25}$$

**보기** ① $-2x+1$  ② $-9$  ③ $9$  ④ $2x-9$  ⑤ $2x-1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 근호 안의 식을 완전제곱식으로 인수분해한다.
2. \sqrt{x^2+8x+16} = \sqrt{(x+4)^2} = |x+4|이다.
3. \sqrt{x^2-10x+25} = \sqrt{(x-5)^2} = |x-5|이다.
4. 주어진 범위 -4 < x < 5에서 x+4 > 0이므로 |x+4| = x+4이다.
5. x-5 < 0이므로 |x-5| = -(x-5) = -x+5이다.
6. 따라서 |x+4| - |x-5| = (x+4) - (-(x-5)) = (x+4) + (x-5) = 2x - 1이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-4 < x < 5$일 때, 다음 식을 간단」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호가 있는 식의 변형 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 식 16, 25 완전제곱식을 절댓값으로 바꾸고 10 계수 범위를 점검해 식을 정리하는 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ABSOLUTE **원천→판정: PT_M3_RADICAL_ABSOLUTE_VALUE → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_INTERVAL_BOUNDED_RADICAL_SIMPLIFY → TPL_M3_ROOT_PROPERTY_ABSOLUTE**
- 이유: 근호 안의 16, 25 완전제곱식을 절댓값으로 변환하고 부호를 판별해 정리하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 완전제곱식의 절댓값 성질과 -4 < x < 5 부호를 적용하여 25 상수를 계산하는 문항이다.

**4칸**
- given: 근호←solution:「근호 안의 식을 완」
- goal: 정리←solution:「호를 판정하여 정리한다. 1단계」
- method: 완전제곱식(NAMED)←solution:「호 안의 식을 완전제곱식으로 인수분해한」
- condition: 절댓값←solution:「인수분해한 후 절댓값 기호로 변환하」

**how** 16, 25의 완전제곱식으로부터 $|x+4| - |x-5| = (x+4) - (-(x-5)) = 2x-1$이므로 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 식을 완전제곱식으로 인수분해한 후 절댓값 기호로 변환하고, 주어진 $x$의 범위에 따라 부호를 판정하여 정리한다.

1단계: 근호 안의 식을 완전제곱식으로 나타낸다. $$x^2 + 8x + 16 = (x + 4)^2$$ $$x^2 - 10x + 25 = (x - 5)^2$$ 따라서 주어진 식은 다음과 같다. $$\sqrt{(x+4)^2} - \sqrt{(x-5)^2} = |x + 4| - |x - 5|$$

2단계: 주어진 범위에서 각 식의 부호를 판정한다. $$-4 < x < 5$$

- $x > -4$이므로 $x + 4 > 0$이다. 따라서 $$|x + 4| = x + 4$$  
- $x < 5$이므로 $x - 5 < 0$이다. 따라서 $$|x - 5| = -(x - 5) = 5 - x$$

3단계: 두 식의 뺄셈을 수행한다. $$|x + 4| - |x - 5| = (x + 4) - (5 - x)$$ $$= x + 4 - 5 + x = 2x - 1$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

[서·논술형 1] $20 \le n < 300$인 자연수 $n$에 대하여 $\sqrt{40n}$이 자연수가 되도록 하는 $n$의 개수를 구하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 4개   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \sqrt{40n} = \sqrt{4 \times 10n} = 2\sqrt{10n}이다.
2. 이 식이 자연수가 되려면 근호 안의 수 10n = 2 \times 5 \times n이 완전제곱수이어야 한다.
3. 따라서 소인수의 지수가 모두 짝수가 되어야 하므로 n = 10k^2 (k는 자연수) 꼴이어야 한다.
4. 주어진 조건 20 <= n < 300에 대입하면 20 <= 10k^2 < 300이다.
5. 양변을 10으로 나누면 2 <= k^2 < 30이다.
6. 이를 만족하는 자연수 k는 2, 3, 4, 5의 4개이고, 이때 n은 각각 40, 90, 160, 250이다.
7. 따라서 n의 개수는 4개이다.
- 작성자 답: 4개 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「[서·논술형 1] $20 \le n < 300」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근이 자연수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 40n이 자연수가 되는 일반형 10k^2을 세우고 20과 300 사이의 개수 4개를 구하는 문제이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_RADICAL_TO_NATURAL_NUMBER → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_PRIME_FACTORIZATION_SQUARE_COUNT → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 소인수분해로 40n의 완전제곱수 조건을 구하고 20과 300 범위의 자연수 개수를 세는 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 40을 소인수분해해 n = 10k^2을 세우고 20과 300 사이 k의 개수 4개를 세는 서술형 문항이다.

**4칸**
- given: 자연수←stem:「< 300$인 자연수 $n$에 대하」
- goal: 개수←stem:「하는 $n$의 개수를 구하시오.」
- method: 소인수분해(NAMED)←solution:「이어야 한다. 소인수분해를 통해 $n$」
- condition: 완전제곱수←solution:「$40n$이 완전제곱수이어야 한다.」

**how** $n = 10k^2$ 꼴에서 $2 \le k^2 < 30$을 만족하는 $k = 2, 3, 4, 5$로 4개임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sqrt{40n}$이 자연수가 되려면 근호 안의 수 $40n$이 완전제곱수이어야 한다. 소인수분해를 통해 $n$의 조건을 구하고 주어진 범위의 자연수 개수를 센다.

1단계: $40$을 소인수분해하여 $n$의 일반형을 구한다. [2점] $$40 = 2^3 \times 5 = 2^2 \times 2 \times 5 = 2^2 \times 10$$ $40n$이 어떤 자연수의 제곱이 되려면 소인수분해했을 때 모든 소인수의 지수가 짝수이어야 한다. 이미 $2^2$의 지수는 짝수이므로, 지수가 홀수인 소인수 $2$와 $5$의 지수를 짝수로 만들어 주어야 한다. 따라서 자연수 $n$은 다음과 같은 꼴이어야 한다. $$n = 10 \times k^2 \quad (k\text{는 자연수})$$

2단계: 주어진 범위 $20 \le n < 300$에 대입하여 $k$의 범위를 구한다. [3점] $$20 \le 10k^2 < 300$$ 양변을 $10$으로 나누면 $$2 \le k^2 < 30$$ $k$는 자연수이므로 가능한 $k$의 값과 그에 따른 $n$의 값을 구하면

- $k = 2$일 때: $n = 10 \times 2^2 = 40$  
- $k = 3$일 때: $n = 10 \times 3^2 = 90$  
- $k = 4$일 때: $n = 10 \times 4^2 = 160$  
- $k = 5$일 때: $n = 10 \times 5^2 = 250$  
- $k = 6$일 때: $n = 10 \times 6^2 = 360 \ge 300$ (범위 초과)

3단계: 개수를 센다. [1점] 따라서 조건을 만족시키는 자연수 $n$은 $40, 90, 160, 250$의 $4$개이다. 따라서 정답은 4개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 2] 어느 맑은 날, 해발 $h,\mathrm{m}$인 곳에서 사람의 눈으로 볼 수 있는 가장 먼 거리가 $\sqrt{12.6h},\mathrm{km}$라 할 때, 해발 $300,\mathrm{m}$인 전망대에서 사람의 눈으로 볼 수 있는 가장 먼 거리를 소수로 나타내시오. (단, $\sqrt{3.78} = 1.944, \quad \sqrt{37.8} = 6.148$로 계산한다.) [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 61.48 km   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 해발 h m인 곳에서 볼 수 있는 가장 먼 거리는 \sqrt{12.6h} km이다.
2. 해발 300 m이므로 h = 300을 대입한다.
3. 거리 = \sqrt{12.6 \times 300} = \sqrt{3780} km이다.
4. 3780 = 37.8 \times 100이므로 \sqrt{3780} = 10\sqrt{37.8}이다.
5. 주어진 조건 \sqrt{37.8} = 6.148을 대입하면 10 \times 6.148 = 61.48 km이다.
6. 따라서 가장 먼 거리는 61.48 km이다.
- 작성자 답: 61.48 km → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 2] 어느 맑은 날, 해발 $h,」
**RPM** M3-RPM-006 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 실생활 활용 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값**
- 이유: 식 12.6h에 h = 300을 대입해 37.8 근삿값을 적용하여 61.48 km 거리를 구하는 문제이다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_APPROXIMATION **원천→판정: PT_M3_REAL_LIFE_RADICAL_FORMULA → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_SCIENTIFIC_FORMULA_EVAL → TPL_M3_RADICAL_APPROXIMATION**
- 이유: 근호식에 300을 대입하고 100의 거듭제곱으로 변형해 61.48 km 근삿값을 산출하는 서술형 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 12.6 * 300 = 3780에서 10*6.148 = 61.48 km를 유도하는 서술형 실생활 문항이다.

**4칸**
- given: 높이←solution:「주어진 높이 $h = 30」
- goal: 거리←solution:「삿값에 맞추어 거리를 계산한다.」
- method: 근삿값(NAMED)←solution:「용하여 주어진 근삿값에 맞추어 거리」
- condition: 대입←solution:「00$을 식에 대입한 후, 제곱근」

**how** $\sqrt{12.6 \times 300} = 10\sqrt{37.8} = 10 \times 6.148 = 61.48\text{ km}$로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 높이 $h = 300$을 식에 대입한 후, 제곱근의 성질을 이용하여 주어진 근삿값에 맞추어 거리를 계산한다.

1단계: 식에 $h = 300$을 대입한다. [2점] $$\text{거리} = \sqrt{12.6 \times 300}$$

2단계: 근호 안의 수를 계산하고 $100$의 거듭제곱으로 변형한다. [3점] $$12.6 \times 300 = 126 \times 30 = 3780$$ 따라서 $$\sqrt{3780} = \sqrt{37.8 \times 100} = 10\sqrt{37.8}$$

3단계: 주어진 근삿값을 대입하여 소수로 계산한다. [2점] 문제에서 $\sqrt{37.8} = 6.148$이므로 $$10\sqrt{37.8} = 10 \times 6.148 = 61.48,\mathrm{km}$$

따라서 보이는 가장 먼 거리는 $61.48,\mathrm{km}$이다. 따라서 정답은 61.48 km이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 3] 주사위를 두 번 던져서 나오는 눈의 수를 차례로 $a, b$라고 할 때, $x^2-ax+b$가 일차식의 곱으로 인수분해 될 확률을 구하시오. (단, 완전제곱식으로 인수분해되는 경우는 제외한다.) [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 5/36   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x^2 - ax + b가 두 일차식의 곱으로 인수분해되려면 x^2 - ax + b = (x - m)(x - n) (m, n은 자연수)이어야 한다.
2. 우변을 전개하면 x^2 - (m + n)x + mn이므로 m + n = a, mn = b이다.
3. 주사위 눈이므로 1 <= a, b <= 6이다. 완전제곱식이 아니므로 m != n이다.
4. 1 <= m < n이라 둘 때 가능한 (m, n) 순서쌍을 조사한다.
5. m = 1일 때: n = 2이면 a = 3, b = 2; n = 3이면 a = 4, b = 3; n = 4이면 a = 5, b = 4; n = 5이면 a = 6, b = 5이다.
6. m = 2일 때: n = 3이면 a = 5, b = 6이다. (n = 4이면 b = 8 > 6이므로 불가).
7. 따라서 가능한 (a, b) 순서쌍은 (3, 2), (4, 3), (5, 4), (6, 5), (5, 6)의 5가지이다.
8. 주사위를 두 번 던질 때 나오는 모든 경우의 수는 36이므로 구하는 확률은 5/36이다.
- 작성자 답: 5/36 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 발문에 그림 언급 없음

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 3] 주사위를 두 번 던져서 나오」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: x^2 - ax + b가 인수분해될 조건 mn = b, m+n = a를 분류해 36 중 5개의 확률을 구하는 문제이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=NONE **원천→판정: PT_M3_FACTORING_PROBABILITY → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_DICE_COEFFICIENT_FACTORABLE_PROBABILITY → NONE**
- 이유: 이차식 ax 인수분해 조건에서 완전제곱식을 제외한 주사위 눈 순서쌍의 확률을 계산하는 서술형 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: ax 부정방정식의 해를 주사위 눈 범위에서 분류하여 5/36을 유도하는 서술형 복합 문항이다.

**4칸**
- given: 일차식←stem:「-ax+b$가 일차식의 곱으로 인수」
- goal: 확률←stem:「인수분해 될 확률을 구하시오.」
- method: 인수분해(NAMED)←stem:「차식의 곱으로 인수분해 될 확률을 구」
- condition: 제외←stem:「해되는 경우는 제외한다.) [7점」

**how** 완전제곱식을 제외하고 인수분해되는 순서쌍 5가지를 찾아 36으로 나눈 5/36으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차식이 두 일차식의 곱으로 인수분해될 조건을 부정방정식 형태로 세우고, 완전제곱식을 제외한 주사위 눈의 순서쌍 $(a, b)$를 전수 분류하여 확률을 구한다.

1단계: 인수분해 조건식을 세운다. [2점] $x^2 - ax + b$가 두 일차식의 곱으로 인수분해되려면 $$x^2 - ax + b = (x - m)(x - n) \quad (m, n\text{은 자연수})$$ 꼴이어야 한다. 우변을 전개하면 $$x^2 - (m + n)x + mn = x^2 - ax + b$$ 이므로 $$m + n = a, \quad mn = b$$ 문제에서 $a, b$는 주사위의 눈이므로 $1 \le a \le 6, 1 \le b \le 6$이다. 또한 완전제곱식으로 인수분해되는 경우는 제외하므로 $m \ne n$이어야 한다. 일반성을 잃지 않고 $m < n$이라 하자.

2단계: $b = mn$ ($1 \le b \le 6$)의 값에 따라 가능한 $(m, n)$과 $a = m + n$을 조사한다. [3점]

- $b = 1$일 때: $mn = 1 \implies m = 1, n = 1$ (완전제곱식이므로 제외)  
- $b = 2$일 때: $mn = 2 \implies m = 1, n = 2$ $$a = 1 + 2 = 3 \le 6 \implies (a, b) = (3, 2) \quad (1\text{가지})$$  
- $b = 3$일 때: $mn = 3 \implies m = 1, n = 3$ $$a = 1 + 3 = 4 \le 6 \implies (a, b) = (4, 3) \quad (1\text{가지})$$  
- $b = 4$일 때: $mn = 4$  
  - $m = 1, n = 4 \implies a = 1 + 4 = 5 \le 6 \implies (a, b) = (5, 4) \quad (1\text{가지})$  
  - $m = 2, n = 2$ (완전제곱식이므로 제외)  
- $b = 5$일 때: $mn = 5 \implies m = 1, n = 5$ $$a = 1 + 5 = 6 \le 6 \implies (a, b) = (6, 5) \quad (1\text{가지})$$  
- $b = 6$일 때: $mn = 6$  
  - $m = 1, n = 6 \implies a = 1 + 6 = 7 > 6$ (주사위 눈 범위를 벗어나므로 제외)  
  - $m = 2, n = 3 \implies a = 2 + 3 = 5 \le 6 \implies (a, b) = (5, 6) \quad (1\text{가지})$

따라서 조건을 만족시키는 순서쌍 $(a, b)$는 $(3, 2), (4, 3), (5, 4), (6, 5), (5, 6)$의 총 $5$가지이다.

3단계: 확률을 구한다. [2점] 주사위를 두 번 던질 때 나오는 모든 경우의 수는 $6 \times 6 = 36$가지이다. 따라서 구하는 확률은 $$\dfrac{5}{36}$$ 따라서 정답은 5/36이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
