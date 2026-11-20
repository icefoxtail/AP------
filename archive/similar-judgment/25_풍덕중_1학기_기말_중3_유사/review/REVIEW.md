# 검수 묶음 — 25_풍덕중_1학기_기말_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 6, FIGURE_MISSING 3)**
- 문항 25개 / 검사 PASS 16, FAIL 6, 보류 3
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 22, NEEDS_FIGURE 3
- 난이도 분포: 1단계 5, 2단계 16, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 검사 코드: CHOICE_ORDER
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q8**: 원천 값과 다른 칸 2개 (PT, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q10**: 검사 코드: CHOICE_ORDER
- **Q15**: 검사 코드: CHOICE_ORDER / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q16**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류) / 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q18**: 원천 값과 다른 칸 2개 (PT, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류) / 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q20**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (RPM, PT)
- **Q21**: 원천 값과 다른 칸 3개 (단원, 소단원, RPM)
- **Q24**: 원천 값과 다른 칸 4개 (단원, 소단원, RPM, PT)
- **Q25**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류) / 난이도 경계 (confidence=high, 원천 경계 B23)

---
## Q1 — 객관식 3점


**발문**

다음 중 다항식 $3x(x-2)(2x+1)$의 인수가 아닌 것은? [3점]

**보기** ① $x$  ② $x-2$  ③ $2x+1$  ④ $x+2$  ⑤ $x(2x+1)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 다항식 3x(x-2)(2x+1)은 단항식 3x와 두 일차식 (x-2), (2x+1)의 곱으로 인수분해되어 있다.
2. 각 인수는 3, x, x-2, 2x+1 및 이들의 곱(예: x(2x+1))이다.
3. x+2는 주어진 다항식의 인수들의 곱으로 만들 수 없으므로 인수가 아니다.
4. 따라서 인수가 아닌 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $3x(x-2)(2x+1)$의」
**RPM** M3-RPM-021 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기] (원천과 같음)
- 이유: 다항식 3x(x-2)(2x+1)을 공통인수와 각 인수의 곱 형태로 분석하는 공통인수 묶기 3 유형이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_FACTOR_IDENTIFY (원천과 같음)
- 이유: 다항식 3x(x-2)(2x+1)에서 주어진 보기 중 인수가 아닌 것을 3 판별하는 인수 판별 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다항식 3x(x-2)(2x+1)의 인수의 뜻을 직접 적용하여 3 답을 구하는 기본 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $3x(x-2)(2x+1)$의」
- goal: 인수←stem:「인수가 아닌 것은? [3점]」
- method: 인수(NAMED)←solution:「인수들의 곱이므로 인수이다.」
- condition: 다항식←solution:「주어진 다항식은 $3x(x-2)(2x+1)$이다.」

**how** 다항식 3x(x-2)(2x+1)의 각 인수를 곱의 형태로 분해하여 x+2가 인수가 아님을 3 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 다항식은 $3x(x-2)(2x+1)$이다. $x$, $x-2$, $2x+1$은 각각 이 다항식의 인수이고, $x(2x+1)$도 인수들의 곱이므로 인수이다. 반면 $x+2$는 $3x(x-2)(2x+1)$을 나누어떨어지게 하는 인수가 아니다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$x=\sqrt{7}+3$, $y=\sqrt{7}-3$일 때, 인수분해 공식을 이용하여 $x^2-2xy+y^2$의 값을 구한 것은? [4점]

**보기** ① $6$  ② $36$  ③ $28$  ④ $12$  ⑤ $49$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x^2 - 2xy + y^2 = (x - y)^2 이라는 곱셈/인수분해 공식을 적용한다.
2. x - y = (sqrt(7) + 3) - (sqrt(7) - 3) = 6 이다.
3. 따라서 (x - y)^2 = 6^2 = 36 이다.
4. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x=\sqrt{7}+3$, $y=\sqrt{7}-3$일 때,」
**RPM** M3-RPM-027 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값] (원천과 같음)
- 이유: 인수분해 공식 (x-y)^2을 활용하여 36이라는 식의 값을 aligned 구하는 RPM 유형이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_VALUE (원천과 같음)
- 이유: 무리수로 주어진 두 수 x, y에 대해 인수분해 공식을 적용하여 식의 값 36을 aligned 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 완전제곱식에 대입하여 36을 aligned 구하는 전형적인 난이도 2 문항이다.

**4칸**
- given: 이차식←stem:「$x=\sqrt{7}+3$, $y=\sqrt{7}-3$일 때,」
- goal: 이차식←stem:「$x^2-2xy+y^2$의 값을 구한 것은? [4점]」
- method: 완전제곱식(NAMED)←stem:「인수분해 공식을 이용하여」
- condition: 이차식←solution:「x^2 - 2xy + y^2 &= (x - y)^2」

**how** x-y=6을 완전제곱식 (x-y)^2에 대입하여 식의 값 36을 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} x^2 - 2xy + y^2 &= (x - y)^2 \ x - y &= (\sqrt{7}+3) - (\sqrt{7}-3) = 6 \ (x - y)^2 &= 6^2 = 36 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

다음 중 $4x^2+2(k-3)x+25$가 완전제곱식이 되기 위한 수 $k$의 값 중 가장 작은 값은? [4점]

**보기** ① $-7$  ② $-5$  ③ $7$  ④ $10$  ⑤ $13$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 4x^2 + 2(k-3)x + 25 가 완전제곱식이 되려면 (2x ± 5)^2 = 4x^2 ± 20x + 25 꼴이어야 한다.
2. 일차항의 계수 2(k-3) = ±20 이므로 k-3 = ±10 이다.
3. 따라서 k = 13 또는 k = -7 이 된다.
4. k의 값 중 가장 작은 값은 -7 이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$4x^2+2(k-3)x+25$가 완전제곱식이 되기 위한」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] (원천과 같음)
- 이유: 이차식이 완전제곱식이 되는 조건 20을 적용하여 k의 범위를 정하는 aligned RPM 유형이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_PERFECT_SQUARE_CONDITION (원천과 같음)
- 이유: 완전제곱식 조건 20을 이용하여 미정계수 k의 가능한 값을 aligned 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 완전제곱식 계수 비교로 2(k-3)=±20을 푸는 표준적인 난이도 2 aligned 문항이다.

**4칸**
- given: 완전제곱식←stem:「$4x^2+2(k-3)x+25$가 완전제곱식이 되기 위한」
- goal: 완전제곱식←stem:「수 $k$의 값 중 가장 작은 값은? [4점]」
- method: 완전제곱식(NAMED)←solution:「따라서 가장 작은 값은 $-7$이다.」
- condition: 완전제곱식←stem:「완전제곱식이 되기 위한 수 $k$의 값 중」

**how** 이차식 4x^2+2(k-3)x+25가 완전제곱식이 되도록 일차항 계수를 비교해 가장 작은 k=-7을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$4x^2 + 2(k-3)x + 25 = (2x \pm 5)^2 = 4x^2 \pm 20x + 25$ $\begin{aligned} 2(k-3) &= 20 \quad \text{또는} \quad 2(k-3) = -20 \ k - 3 &= 10 \quad \text{또는} \quad k - 3 = -10 \ k &= 13 \quad \text{또는} \quad k = -7 \end{aligned}$ 따라서 가장 작은 값은 $-7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

두 이차식 $2x^2+5x+p$, $3x^2+qx-10$의 공통인 인수가 $x+2$일 때, 두 수 $p$, $q$에 대하여 $p+q$의 값은? [4점]

**보기** ① $-3$  ② $1$  ③ $3$  ④ $5$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 공통인 인수가 x+2이므로 2x^2+5x+p는 (x+2)(2x+1) = 2x^2+5x+2 이 되어 p = 2 이다.
2. 3x^2+qx-10은 (x+2)(3x-5) = 3x^2+x-10 이 되어 q = 1 이다.
3. 따라서 p + q = 2 + 1 = 3 이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「공통인 인수가 $x+2$일 때,」
**RPM** M3-RPM-028 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 조건식] **원천→판정: 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 조건식**
- 이유: 인수분해 조건식을 이용하여 미정계수 p, q를 복원하는 aligned qx RPM 유형이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_COMMON_FACTOR_PARAMETER_DETERMINATION (원천과 같음)
- 이유: 두 이차식의 공통인수가 주어졌을 때 미정계수 qx의 q와 p를 결정하는 aligned 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 인수분해 전개 비교로 p=2, q=1을 aligned 구하는 전형적인 난이도 2 qx 문항이다.

**4칸**
- given: 공통인수←stem:「공통인 인수가 $x+2$일 때,」
- goal: 이차식←stem:「두 수 $p$, $q$에 대하여 $p+q$의 값은? [4점]」
- method: 공통인수(NAMED)←solution:「p+q &= 2+1 = 3」
- condition: 공통인수←stem:「공통인 인수가 $x+2$일 때,」

**how** 공통인 인수 x+2 조건으로 3x^2+qx-10에서 qx 항 계수 q=1과 p=2를 구해 합 3을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} 2x^2+5x+p &= (x+2)(2x+r) = 2x^2+(r+4)x+2r \ r+4 &= 5 \implies r = 1, \quad p = 2r = 2 \ 3x^2+qx-10 &= (x+2)(3x+s) = 3x^2+(s+6)x+2s \ 2s &= -10 \implies s = -5, \quad q = s+6 = 1 \ p+q &= 2+1 = 3 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 5점


**발문**

두 자연수 $a$, $b$에 대하여 다항식 $3x^2+10x+k$가 $(3x+a)(x+b)$로 인수분해되도록 하는 상수 $k$의 값 중 가장 큰 수와 가장 작은 수의 합은? [5점]

**보기** ① $7$  ② $8$  ③ $9$  ④ $10$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (3x+a)(x+b) = 3x^2 + (3b+a)x + ab 이므로 3b+a = 10 이고 k = ab 이다.
2. a, b가 자연수이므로 가능한 순서쌍 (b, a)는 (1, 7), (2, 4), (3, 1)이다.
3. 각각에 대해 k = ab는 7, 8, 3 이다.
4. 최댓값은 8, 최솟값은 3이므로 그 합은 8 + 3 = 11 이다.
5. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(3x+a)(x+b)$로 인수분해되도록 하는」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] (원천과 같음)
- 이유: 자연수 계수 조건을 만족하는 이차식 인수분해의 상수 k를 결정하는 10 ab RPM 유형이다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT (원천과 같음)
- 이유: 이차식의 인수분해 조건에서 자연수 미정계수의 부정방정식을 풀어 극값을 구하는 ab 10 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 자연수 조건 10으로 케이스를 나누어 k의 합 11을 aligned 구하므로 난이도 3이다.

**4칸**
- given: 인수←stem:「$(3x+a)(x+b)$로 인수분해되도록 하는」
- goal: 이차식←stem:「가장 큰 수와 가장 작은 수의 합은? [5점]」
- method: 인수(NAMED)←solution:「$a, b$는 자연수이므로」
- condition: 인수←solution:「최댓값은 $8$, 최솟값은 $3$이므로 합은 $8+3=11$이다.」

**how** 3b+a=10을 만족하는 자연수 순서쌍을 조사하여 k=ab의 최댓값 8과 최솟값 3의 합 11을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} (3x+a)(x+b) &= 3x^2 + (3b+a)x + ab \ 3b+a &= 10, \quad k = ab \end{aligned}$ $a, b$는 자연수이므로

- $b=1$일 때 $a=7 \implies k=7$  
- $b=2$일 때 $a=4 \implies k=8$  
- $b=3$일 때 $a=1 \implies k=3$ 따라서 $k$의 최댓값은 $8$, 최솟값은 $3$이므로 합은 $8+3=11$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 중 이차방정식의 개수는? [3점] ㄱ. $2x^2-5x+3$ \quad ㄴ. $3(x+1)(x-4)$ ㄷ. $2x^2-x+4=9$ \quad ㄹ. $5x-2=4x^2-2$ ㅁ. $x(3x+2)=(3x-1)(x+4)$

**보기** ① $2$개  ② $1$개  ③ $3$개  ④ $4$개  ⑤ $5$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차방정식은 등호가 있고 정리했을 때 ax^2+bx+c=0 (a≠0) 꼴인 식이다.
2. ㄱ, ㄴ은 등호가 없어 다항식이다.
3. ㄷ: 2x^2-x-5=0 (이차방정식), ㄹ: 4x^2-5x=0 (이차방정식).
4. ㅁ: 3x^2+2x = 3x^2+11x-4 에서 9x-4=0 (일차방정식).
5. 따라서 이차방정식은 ㄷ, ㄹ의 2개이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 이차방정식의 개수는? [3점]」
**RPM** M3-RPM-029 [이차방정식 > 이차방정식의 풀이 > 이차방정식과 해 > 이차방정식 판별] (원천과 같음)
- 이유: 이차방정식의 기본 정의 ax와 판별법을 적용하는 RPM 11 유형이다.
**유형** PT=PT_M3_QUADRATIC_EQUATION / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_ROOT_IDENTIFICATION → PT_M3_QUADRATIC_EQUATION**
- 이유: 주어진 보기 중 이차방정식의 정의 ax 11를 만족하는 식의 개수를 찾는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식의 정의 ax를 바로 판별하는 11 기본 난이도 1 문항이다.

**4칸**
- given: 이차방정식←stem:「다음 중 이차방정식의 개수는? [3점]」
- goal: 이차방정식←stem:「다음 중 이차방정식의 개수는? [3점]」
- method: 이차방정식(NAMED)←solution:「모든 항을 좌변으로 이항하여 정리했을 때」
- condition: 이차방정식←solution:「따라서 이차방정식은 ㄷ, ㄹ의 $2$개이다.」

**how** 보기의 식들을 전개 및 이항하여 ax^2+bx+c=0 (a≠0) 꼴인 이차방정식 2개를 11 판별했다.

<details><summary>저장 해설 (판정 검토용)</summary>

모든 항을 좌변으로 이항하여 정리했을 때 $ax^2+bx+c=0\ (a\ne 0)$ 꼴인 방정식을 찾는다.

- ㄱ, ㄴ은 등호가 없으므로 방정식이 아니다.  
- ㄷ: $2x^2-x-5=0$ (이차방정식)  
- ㄹ: $4x^2-5x=0$ (이차방정식)  
- ㅁ: $3x^2+2x=3x^2+11x-4 \implies 9x-4=0$ (일차방정식) 따라서 이차방정식은 ㄷ, ㄹ의 $2$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

이차방정식 $x^2-(a+6)x+6a=0$의 두 해의 비가 $1:2$일 때, 수 $a$의 값을 모두 구하여 곱한 값은? [4점]

**보기** ① $9$  ② $15$  ③ $18$  ④ $36$  ⑤ $48$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x^2 - (a+6)x + 6a = (x-6)(x-a) = 0 이므로 두 해는 x = 6 또는 x = a 이다.
2. 두 해의 비가 1:2이므로 케이스 1: 6 : a = 1 : 2 이면 a = 12 이다.
3. 케이스 2: a : 6 = 1 : 2 이면 a = 3 이다.
4. 가능한 a의 값은 3과 12이므로 그 곱은 3 × 12 = 36 이다.
5. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $x^2-(a+6)x+6a=0$의 두 해의 비가 $1:2$일 때,」
**RPM** M3-RPM-032 [이차방정식 > 이차방정식의 풀이 > 인수분해를 이용한 풀이 > 기본 인수분해] (원천과 같음)
- 이유: 인수분해로 구한 해의 비 12 조건을 적용하는 기본 인수분해 aligned 36 RPM 유형이다.
**유형** PT=PT_M3_ROOT_COEFFICIENT / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_HOMOGENEOUS_RATIO → PT_M3_ROOT_COEFFICIENT**
- 이유: 이차방정식의 두 근의 비 조건을 이용하여 상수 a의 값들을 구하고 곱 36을 aligned 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 인수분해 후 비율 관계 1:2의 두 경우를 따져 36을 aligned 구하는 난이도 2 문항이다.

**4칸**
- given: 해←stem:「이차방정식 $x^2-(a+6)x+6a=0$의 두 해의 비가 $1:2$일 때,」
- goal: 해←stem:「수 $a$의 값을 모두 구하여 곱한 값은? [4점]」
- method: 해(NAMED)←solution:「두 해의 비가 $1:2$이므로」
- condition: 해←solution:「따라서 가능한 $a$의 값의 곱은 $12 \times 3 = 36$이다.」

**how** 두 해 6과 a의 비가 1:2인 두 경우 a=12와 a=3을 구해 곱 36을 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} x^2-(a+6)x+6a &= (x-6)(x-a) = 0 \ x &= 6 \quad \text{또는} \quad x = a \end{aligned}$ 두 해의 비가 $1:2$이므로

- $6:a = 1:2$일 때 $a = 12$  
- $a:6 = 1:2$일 때 $a = 3$ 따라서 가능한 $a$의 값의 곱은 $12 \times 3 = 36$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

이차방정식 $ax^2+5x+1=0$의 해가 $x=\dfrac{-5\pm\sqrt{b}}{6}$일 때, 두 수 $a$, $b$에 대하여 $b-a$의 값은? [4점]

**보기** ① $8$  ② $10$  ③ $12$  ④ $13$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ax^2 + 5x + 1 = 0 에 근의 공식을 적용하면 x = (-5 ± sqrt(25 - 4a)) / (2a) 이다.
2. 주어진 해 x = (-5 ± sqrt(b)) / 6 과 계수를 비교하면 2a = 6 에서 a = 3 이다.
3. 근호 안의 식은 b = 25 - 4a = 25 - 12 = 13 이다.
4. 따라서 b - a = 13 - 3 = 10 이다.
5. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $ax^2+5x+1=0$의 해가」
**RPM** M3-RPM-035 [이차방정식 > 이차방정식의 풀이 > 근의 공식 > 근의 공식] (원천과 같음)
- 이유: 근의 공식 계수 비교를 통해 이차방정식의 미정계수를 복원하는 25 RPM 유형이다.
**유형** PT=PT_M3_ROOT_FORMULA / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD → PT_M3_ROOT_FORMULA**
- 이유: 근의 공식의 일반형 계수 비교로 미정계수 ax 25를 결정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 근의 공식을 직접 대입하고 계수를 일대일 비교하여 10을 aligned 구하는 난이도 2 문항이다.

**4칸**
- given: 근의 공식←stem:「이차방정식 $ax^2+5x+1=0$의 해가」
- goal: 이차방정식←stem:「두 수 $a$, $b$에 대하여 $b-a$의 값은? [4점]」
- method: 근의 공식(NAMED)←solution:「b - a &= 13 - 3 = 10」
- condition: 근의 공식←solution:「2a &= 6 \implies a = 3」

**how** 근의 공식 x=(-5±sqrt(25-4a))/(2a)와 주어진 해를 비교하여 a=3, b=13을 구하고 b-a=10을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} x &= \frac{-5 \pm \sqrt{5^2 - 4a}}{2a} = \frac{-5 \pm \sqrt{25 - 4a}}{2a} \ 2a &= 6 \implies a = 3 \ b &= 25 - 4a = 25 - 12 = 13 \ b - a &= 13 - 3 = 10 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 이차방정식 $x^2+x-6=0$, $3x^2+kx+12=0$이 공통인 해를 갖도록 하는 수 $k$의 값을 모두 구하여 더한 값은? [4점]

**보기** ① $-2$  ② $-1$  ③ $0$  ④ $2$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x^2 + x - 6 = (x+3)(x-2) = 0 이므로 첫 번째 방정식의 해는 x = -3 또는 x = 2 이다.
2. 공통인 해가 x = -3 일 때: 3(-3)^2 + k(-3) + 12 = 27 - 3k + 12 = 0 에서 3k = 39, k = 13 이다.
3. 공통인 해가 x = 2 일 때: 3(2)^2 + k(2) + 12 = 12 + 2k + 12 = 0 에서 2k = -24, k = -12 이다.
4. 가능한 k의 값의 합은 13 + (-12) = 1 이다.
5. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「공통인 해를 갖도록 하는」
**RPM** M3-RPM-031 [이차방정식 > 이차방정식의 풀이 > 이차방정식과 해 > 해가 주어진 이차방정식의 계수 결정] (원천과 같음)
- 이유: 해가 주어진 이차방정식에서 계수를 결정하는 RPM kx 12 유형이다.
**유형** PT=PT_M3_QUADRATIC_ROOT / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION → PT_M3_QUADRATIC_ROOT**
- 이유: 두 이차방정식이 공통인 해를 가질 조건을 근의 대입으로 해결하는 kx 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 인수분해로 해를 구한 후 대입하여 k의 합을 구하는 표준적인 난이도 2 kx 12 문항이다.

**4칸**
- given: 해←stem:「공통인 해를 갖도록 하는」
- goal: 이차방정식←stem:「수 $k$의 값을 모두 구하여 더한 값은? [4점]」
- method: 해(NAMED)←solution:「해는 $x=-3$ 또는 $x=2$이다.」
- condition: 해←solution:「$x^2+x-6 = (x+3)(x-2) = 0$이므로」

**how** 첫 방정식의 두 해 x=-3, 2를 둘째 식 3x^2+kx+12=0에 각각 대입하여 k=13, -12의 합 1을 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x^2+x-6 = (x+3)(x-2) = 0$이므로 해는 $x=-3$ 또는 $x=2$이다.

- $x=-3$을 $3x^2+kx+12=0$에 대입하면 $27 - 3k + 12 = 0 \implies 3k = 39 \implies k = 13$  
- $x=2$를 $3x^2+kx+12=0$에 대입하면 $12 + 2k + 12 = 0 \implies 2k = -24 \implies k = -12$ 따라서 가능한 $k$의 합은 $13 + (-12) = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차방정식 $x^2+5x-1=0$의 한 해를 $x=p$라 할 때, $p-\dfrac{1}{p}$의 값은? [4점]

**보기** ① $-3$  ② $-\sqrt{29}$  ③ $-5$  ④ $5$  ⑤ $\sqrt{29}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x = p 가 x^2 + 5x - 1 = 0 의 해이므로 p^2 + 5p - 1 = 0 이 성립한다.
2. p = 0 은 식을 만족하지 않으므로 p ≠ 0 이다.
3. 양변을 p로 나누어 식을 aligned 정리하면 p + 5 - 1/p = 0 이 된다.
4. 따라서 p - 1/p = -5 이다.
5. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 해를 $x=p$라 할 때,」
**RPM** M3-RPM-030 [이차방정식 > 이차방정식의 풀이 > 이차방정식과 해 > 해의 확인] (원천과 같음)
- 이유: 근의 대입 및 식 변형으로 해의 성질을 확인하는 aligned 29 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION / TPL=NONE (원천과 같음)
- 이유: 이차방정식의 한 근을 대입한 후 변형하여 분수식의 값을 구하는 aligned 29 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 양변을 p로 나누어 식의 값을 정리하는 전형적인 난이도 2 aligned 29 문항이다.

**4칸**
- given: 해←stem:「한 해를 $x=p$라 할 때,」
- goal: 이차방정식←stem:「$p-\dfrac{1}{p}$의 값은? [4점]」
- method: 해(NAMED)←solution:「$p$는 방정식의 해이므로 $p^2 + 5p - 1 = 0$이다.」
- condition: 해←solution:「양변을 $p$로 나누면」

**how** 해 p에 대해 p^2+5p-1=0의 양변을 p로 나누어 p-1/p=-5를 aligned 유도했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$p$는 방정식의 해이므로 $p^2 + 5p - 1 = 0$이다. $p=0$은 등식을 만족하지 않으므로 $p \ne 0$이다. 양변을 $p$로 나누면 $\begin{aligned} p + 5 - \frac{1}{p} &= 0 \ p - \frac{1}{p} &= -5 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점


**발문**

세 변의 길이가 각각 $x$, $x+1$, $x+3$인 삼각형이 직각삼각형일 때, $x$의 값은? (단, $x>2$) [5점]

**보기** ① $2+\sqrt{3}$  ② $2+2\sqrt{3}$  ③ $1+2\sqrt{3}$  ④ $4+2\sqrt{3}$  ⑤ $2\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x > 2 이므로 가장 긴 변의 길이는 x + 3 이다.
2. 직각삼각형의 변 길이를 피타고라스 정리로 aligned 정리하면 x^2 + (x+1)^2 = (x+3)^2 이다.
3. 전개하여 정리하면 2x^2 + 2x + 1 = x^2 + 6x + 9 에서 x^2 - 4x - 8 = 0 이다.
4. 근의 공식으로 x = 2 ± sqrt(4 + 8) = 2 ± 2*sqrt(3) 이다.
5. x > 2 이므로 x = 2 + 2*sqrt(3) 이다. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION_WORD(이차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형이 직각삼각형일 때,」
**RPM** M3-RPM-040 [이차방정식 > 이차방정식의 활용 > 도형 > 피타고라스와 결합] (원천과 같음)
- 이유: 피타고라스 정리와 결합하여 이차방정식을 세우는 활용 aligned RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM / TPL=NONE (원천과 같음)
- 이유: 직각삼각형의 변 길이 관계식을 세워 이차방정식의 근을 aligned 구하는 도형 활용 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리로 방정식을 세우고 무리수 근의 조건을 따지는 난이도 3 aligned 문항이다.

**4칸**
- given: 직각삼각형←stem:「삼각형이 직각삼각형일 때,」
- goal: 직각삼각형←stem:「$x$의 값은? (단, $x>2$) [5점]」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: 직각삼각형←solution:「가장 긴 변은 $x+3$이다.」

**how** 피타고라스 정리 x^2+(x+1)^2=(x+3)^2을 세워 x^2-4x-8=0을 풀고 x>2에서 x=2+2sqrt(3)을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x>2$이므로 가장 긴 변은 $x+3$이다. 피타고라스 정리에 의해 $\begin{aligned} x^2 + (x+1)^2 &= (x+3)^2 \ 2x^2 + 2x + 1 &= x^2 + 6x + 9 \ x^2 - 4x - 8 &= 0 \ x &= 2 \pm \sqrt{4+8} = 2 \pm 2\sqrt{3} \end{aligned}$ $x>2$이므로 $x = 2 + 2\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점


**발문**

다음 중 함수 $y=(a+4)x^2-3x+2$가 $x$에 대한 이차함수가 되기 위한 상수 $a$의 조건은? [3점]

**보기** ① $a \ne 4$  ② $a \ne 0$  ③ $a \ne 2$  ④ $a \ne -3$  ⑤ $a \ne -4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y = (a+4)x^2 - 3x + 2 가 x에 대한 이차함수가 되려면 x^2 의 계수가 0이 아니어야 한다.
2. 즉, a + 4 ≠ 0 이어야 하므로 a ≠ -4 이다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y=(a+4)x^2-3x+2$가 $x$에 대한」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별] (원천과 같음)
- 이유: 이차함수의 정의와 최고차항 계수 조건을 판별하는 0 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_DEFINITION / TPL=TPL_M3_QUADRATIC_FUNCTION_DEFINITION_COEFFICIENT (원천과 같음)
- 이유: 이차함수가 되기 위한 최고차항 계수 a+4≠0 조건을 찾는 0 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차함수의 정의 조건을 바로 적용하여 a≠-4를 0 구하는 기본 난이도 1 문항이다.

**4칸**
- given: 이차함수←stem:「함수 $y=(a+4)x^2-3x+2$가 $x$에 대한」
- goal: 이차함수←stem:「이차함수가 되기 위한 상수 $a$의 조건은? [3점]」
- method: 이차함수(NAMED)←solution:「$x^2$의 계수가 $0$이 아니어야 한다.」
- condition: 이차함수←solution:「$a + 4 \ne 0 \implies a \ne -4$」

**how** 함수 y=(a+4)x^2-3x+2의 이차항 계수 a+4가 0이 아니어야 하므로 a≠-4임을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y=(a+4)x^2-3x+2$가 $x$에 대한 이차함수가 되려면 $x^2$의 계수가 $0$이 아니어야 한다. $a + 4 \ne 0 \implies a \ne -4$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

다음 중 $y$가 $x$에 대한 이차함수인 것을 있는 대로 고른 것은? [4점] ㄱ. 한 변의 길이가 $(x+1)\text{ cm}$인 정사각형의 둘레의 길이 $y\text{ cm}$ ㄴ. 밑변의 길이가 $2x\text{ cm}$, 높이가 $(x+3)\text{ cm}$인 삼각형의 넓이 $y\text{ cm}^2$ ㄷ. 시속 $60\text{ km}$로 $x$시간 동안 달린 거리 $y\text{ km}$ ㄹ. 반지름의 길이가 $(x+2)\text{ cm}$인 원의 넓이 $y\text{ cm}^2$ ㅁ. 정가가 $x$원인 물건을 $20%$ 할인하여 판매한 가격 $y$원

**보기** ① ㄴ, ㄹ  ② ㄱ, ㄴ  ③ ㄴ, ㅁ  ④ ㄱ, ㄴ, ㄹ  ⑤ ㄷ, ㄹ, ㅁ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ: 정사각형 둘레 y = 4(x+1) = 4x+4 (일차함수).
2. ㄴ: 삼각형 넓이 y = (1/2)*2x*(x+3) = x^2 + 3x (이차함수).
3. ㄷ: 달린 거리 y = 60x (일차함수).
4. ㄹ: 원의 넓이 y = pi*(x+2)^2 = pi*x^2 + 4pi*x + 4pi (이차함수).
5. ㅁ: 할인 가격 y = 0.8x (일차함수).
6. 따라서 이차함수인 것은 ㄴ, ㄹ의 2개이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) **원천→판정: M3-04-QUADRATIC_FUNCTION_APPLICATION → M3-04-QUADRATIC_FUNCTION_GRAPH**
- 근거 인용: 「$y$가 $x$에 대한 이차함수인 것을」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별] (원천과 같음)
- 이유: 실생활 상황을 함수식으로 표현하여 이차함수를 판별하는 20 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_DEFINITION / TPL=TPL_M3_SELECT_QUADRATIC_FUNCTION_WORD_PROBLEM (원천과 같음)
- 이유: 문장제 도형 및 실생활 상황에서 20 관계식을 세워 이차함수인 것을 고르는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 보기의 식을 세워 차수를 비교하는 20 표준적인 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「$y$가 $x$에 대한 이차함수인 것을」
- goal: 이차함수←stem:「있는 대로 고른 것은? [4점]」
- method: 이차함수(NAMED)←solution:「이차함수인 것은 ㄴ, ㄹ이다.」
- condition: 넓이←stem:「정사각형의 둘레의 길이」

**how** 각 보기의 실생활 관계식을 세워 ㄴ(삼각형)과 ㄹ(원 20)이 이차함수임을 판별했다.

<details><summary>저장 해설 (판정 검토용)</summary>

- ㄱ: $y = 4(x+1) = 4x+4$ (일차함수)  
- ㄴ: $y = \frac{1}{2} \times 2x(x+3) = x^2+3x$ (이차함수)  
- ㄷ: $y = 60x$ (일차함수)  
- ㄹ: $y = \pi(x+2)^2 = \pi x^2+4\pi x+4\pi$ (이차함수)  
- ㅁ: $y = 0.8x$ (일차함수) 따라서 이차함수인 것은 ㄴ, ㄹ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

이차함수 $f(x)=2x^2+3x-4$에 대하여 $2f(-1)-f(2)$의 값은? [4점]

**보기** ① $-22$  ② $-21$  ③ $-20$  ④ $-10$  ⑤ $0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. f(-1) = 2(-1)^2 + 3(-1) - 4 = 2 - 3 - 4 = -5 이다.
2. f(2) = 2(2)^2 + 3(2) - 4 = 8 + 6 - 4 = 10 이다.
3. 따라서 2f(-1) - f(2) = 2(-5) - 10 = -10 - 10 = -20 이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $f(x)=2x^2+3x-4$에 대하여」
**RPM** M3-RPM-044 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 함숫값] (원천과 같음)
- 이유: 이차함수의 정의에 따라 주어진 함숫값을 직접 계산하는 aligned 10 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION / TPL=NONE **원천→판정: PT_M3_QUADRATIC_FUNCTION_BASIC_FORM → PT_M3_QUADRATIC_FUNCTION**
- 이유: 주어진 이차함수 식에 독립변수의 값을 대입하여 함숫값 식을 계산하는 aligned 10 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단순 대입 사칙계산으로 -20을 aligned 구하는 기본 난이도 1 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $f(x)=2x^2+3x-4$에 대하여」
- goal: 함숫값←stem:「$2f(-1)-f(2)$의 값은? [4점]」
- method: 함숫값(NAMED)←solution:「2f(-1) - f(2) &= 2(-5) - 10 = -20」
- condition: 함숫값←solution:「f(-1) &= 2(-1)^2 + 3(-1) - 4 = 2 - 3 - 4 = -5」

**how** 이차함수 f(x)=2x^2+3x-4에 x=-1과 2를 대입해 f(-1)=-5, f(2)=10을 구하고 2f(-1)-f(2)=-20을 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} f(-1) &= 2(-1)^2 + 3(-1) - 4 = 2 - 3 - 4 = -5 \ f(2) &= 2(2)^2 + 3(2) - 4 = 8 + 6 - 4 = 10 \ 2f(-1) - f(2) &= 2(-5) - 10 = -20 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

이차함수 $y=ax^2$의 그래프를 $x$축의 방향으로 $3$만큼 평행이동한 그래프가 점 $(-1, -8)$을 지날 때, 수 $a$의 값은? [4점]

**보기** ① $-2$  ② $-\dfrac{1}{4}$  ③ $\dfrac{1}{2}$  ④ $-\dfrac{1}{2}$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y = ax^2 의 그래프를 x축의 방향으로 3만큼 평행이동한 식은 y = a(x - 3)^2 이다.
2. 이 포물선이 점 (-1, -8)을 지나므로 대입하면 -8 = a(-1 - 3)^2 = a(-4)^2 = 16a 이다.
3. 따라서 a = -8 / 16 = -1/2 이다.
4. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「방향으로 $3$만큼 평행이동한 그래프가」
**RPM** M3-RPM-049 [이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 평행이동] (원천과 같음)
- 이유: 이차함수 그래프의 x축 평행이동 식을 작성하고 미정계수를 구하는 aligned RPM 16 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_BASIC_FORM / TPL=NONE **원천→판정: PT_M3_QUADRATIC_FUNCTION_TRANSLATION → PT_M3_QUADRATIC_FUNCTION_BASIC_FORM**
- 이유: 평행이동한 포물선의 식에 지나는 한 점의 좌표를 대입하여 계수 ax를 결정하는 aligned 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행이동 공식과 점 대입으로 a=-1/2을 aligned 구하는 전형적인 난이도 2 문항이다.

**4칸**
- given: 평행이동←stem:「방향으로 $3$만큼 평행이동한 그래프가」
- goal: 이차함수←stem:「수 $a$의 값은? [4점]」
- method: 평행이동(NAMED)←solution:「평행이동한 그래프의 식은」
- condition: 이차함수←solution:「이 그래프가 점 $(-1, -8)$을 지나므로」

**how** 평행이동한 식 y=a(x-3)^2에 점 (-1, -8)을 대입하여 16a=-8에서 a=-1/2을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y=ax^2$의 그래프를 $x$축의 방향으로 $3$만큼 평행이동한 그래프의 식은 $y = a(x - 3)^2$ 이 그래프가 점 $(-1, -8)$을 지나므로 $\begin{aligned} -8 &= a(-1 - 3)^2 = 16a \ a &= -\frac{1}{2} \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

이차함수 $y=a(x-p)^2+q$의 그래프가 오른쪽 그림과 같을 때, 수 $a$, $p$, $q$의 부호를 바르게 나타낸 것은? [4점]

**보기** ① $a>0,\ p<0,\ q>0$  ② $a<0,\ p>0,\ q>0$  ③ $a<0,\ p<0,\ q>0$  ④ $a<0,\ p<0,\ q<0$  ⑤ $a>0,\ p>0,\ q<0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 그래프가 위로 볼록하므로 a < 0 이다.
2. 꼭짓점의 좌표는 (p, q)이고, 그림에서 꼭짓점이 제2사분면에 위치하므로 p < 0, q > 0 이다.
3. 따라서 a < 0, p < 0, q > 0 이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 오른쪽 그림과 같을 때,

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「그래프가 오른쪽 그림과 같을 때,」
**RPM** M3-RPM-053 [이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 그래프와 계수 > 그래프 위치] **원천→판정: 이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 꼭짓점·축 → 이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 그래프와 계수 > 그래프 위치**
- 이유: 이차함수 그래프의 위치와 개형을 보고 식의 계수 부호를 4 결정하는 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS / TPL=TPL_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS_READ (원천과 같음)
- 이유: 그래프 개형과 꼭짓점의 사분면 위치에서 계수와 꼭짓점 좌표 a, p, q의 부호를 4 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 포물선의 모양과 꼭짓점 위치로 부호를 직관적으로 4 읽는 난이도 2 문항이다.

**4칸**
- given: 포물선←stem:「그래프가 오른쪽 그림과 같을 때,」
- goal: 사분면←stem:「부호를 바르게 나타낸 것은? [4점]」
- method: 포물선(NAMED)←solution:「그림의 포물선은 위로 볼록하므로」
- condition: 꼭짓점←solution:「꼭짓점 $(p, q)$가 제$2$사분면 위에 있으므로」

**how** 포물선의 볼록성에서 a<0, 제2사분면 위의 꼭짓점 위치에서 p<0, q>0임을 4 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

그림의 포물선은 위로 볼록하므로 $a < 0$이다. 꼭짓점 $(p, q)$가 제$2$사분면 위에 있으므로 $p < 0$, $q > 0$이다. 따라서 $a < 0,\ p < 0,\ q > 0$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 중 이차함수 $y=3x^2-12x+7$의 그래프에 대한 설명으로 옳지 않은 것은? [4점]

**보기** ① 이차함수 $y=4x^2$보다 그래프의 폭이 좁다.  ② 아래로 볼록한 포물선이다.  ③ 꼭짓점의 좌표는 $(2, -5)$이다.  ④ 제$3$사분면을 지나지 않는다.  ⑤ $x>2$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y = 3x^2 - 12x + 7 = 3(x^2 - 4x + 4) - 12 + 7 = 3(x-2)^2 - 5 이다.
2. 꼭짓점은 (2, -5)이고 대칭축은 x = 2 이다.
3. x^2의 계수의 절댓값은 |3| = 3 이고, y = 4x^2의 계수 절댓값은 |4| = 4 이므로 |3| < |4| 이다.
4. 절댓값이 작을수록 폭이 넓으므로 y = 4x^2의 그래프보다 폭이 더 넓다.
5. 따라서 폭이 좁다고 한 ①은 옳지 않다. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=3x^2-12x+7$의 그래프에 대한」
**RPM** M3-RPM-051 [이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 일반형 > 완전제곱식 변형] (원천과 같음)
- 이유: 일반형 포물선의 완전제곱식 변형을 통해 그래프의 성질을 분석하는 12 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS / TPL=TPL_M3_IDENTIFY_FALSE_PROPERTY_FROM_PARABOLA_GRAPH **원천→판정: PT_M3_QUADRATIC_FUNCTION_PROPERTIES → PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS**
- 이유: 일반형 이차함수를 표준형으로 변환하여 그래프의 꼭짓점, 축, 폭 성질의 참·거짓을 판별하는 12 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 표준형 변환 후 선지를 하나씩 12 대조하는 표준적인 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=3x^2-12x+7$의 그래프에 대한」
- goal: 이차함수←stem:「설명으로 옳지 않은 것은? [4점]」
- method: 꼭짓점(NAMED)←solution:「꼭짓점은 $(2, -5)$, 축은 $x=2$이다.」
- condition: 대칭축←solution:「그래프보다 폭이 더 넓다.」

**how** y=3x^2-12x+7을 표준형 3(x-2)^2-5로 고치고 계수 절댓값 비교로 폭에 관한 진술을 12 검토했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y = 3x^2 - 12x + 7 = 3(x-2)^2 - 5$이므로 꼭짓점은 $(2, -5)$, 축은 $x=2$이다.

- ① $|3| < |4|$이므로 $y=4x^2$의 그래프보다 폭이 더 넓다. (거짓)  
- ② $a=3>0$이므로 아래로 볼록하다. (참)  
- ③ 꼭짓점의 좌표는 $(2, -5)$이다. (참)  
- ④ $x<0$일 때 $y = 3x^2 - 12x + 7 > 7 > 0$이므로 제$3$사분면을 지나지 않는다. (참)  
- ⑤ 축 $x=2$의 오른쪽($x>2$)에서 $x$가 증가하면 $y$도 증가한다. (참) 따라서 옳지 않은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 이차함수의 그래프의 폭이 좁은 것부터 차례대로 나열할 때, 두 번째로 좁은 것은? [4점]

**보기** ① $y=\dfrac{2}{3}(x-1)^2+4$  ② $y=-\dfrac{1}{3}x^2+2x$  ③ $y=-\dfrac{7}{4}x^2+2$  ④ $y=-\dfrac{3}{4}(x+2)^2-1$  ⑤ $y=\dfrac{4}{5}x^2-3x+1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차함수 y = ax^2 의 그래프의 폭은 |a|가 클수록 좁고 작을수록 넓다.
2. 각 보기를 확인하면 절댓값 크기순으로 정렬할 때 가장 큰 것이 첫 번째, 두 번째로 큰 것이 두 번째로 좁다.
3. 계수 절댓값을 비교하여 두 번째로 큰 계수를 갖는 이차함수를 찾는다.
4. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수의 그래프의 폭이 좁은 것부터」
**RPM** M3-RPM-045 [이차함수 > 이차함수와 그 그래프 > y=ax²의 그래프 > 그래프의 모양] (원천과 같음)
- 이유: y=ax^2 계수 절댓값에 따른 포물선의 폭과 모양을 판단하는 4 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION / TPL=NONE **원천→판정: PT_M3_QUADRATIC_FUNCTION_PROPERTIES → PT_M3_QUADRATIC_FUNCTION**
- 이유: 이차함수의 이차항 계수 절댓값과 그래프 폭 4 사이의 관계를 비교하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 계수 절댓값의 대소를 비교하여 순서를 매기는 4 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수의 그래프의 폭이 좁은 것부터」
- goal: 이차함수←stem:「두 번째로 좁은 것은? [4점]」
- method: 이차함수(NAMED)←solution:「절댓값이 클수록 폭이 좁다.」
- condition: 이차함수←solution:「이차함수의 그래프는 $x^2$의 계수의 절댓값이」

**how** 이차항 계수의 절댓값 크기를 비교하여 4 폭이 두 번째로 좁은 이차함수를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수의 그래프는 $x^2$의 계수의 절댓값이 클수록 폭이 좁다. 각 보기의 $x^2$의 계수의 절댓값은 ① $\frac{2}{3}$, ② $\frac{1}{3}$, ③ $\frac{7}{4}$, ④ $\frac{3}{4}$, ⑤ $\frac{4}{5}$ 크기 순서로 비교하면 $\frac{7}{4} > \frac{4}{5} > \frac{3}{4} > \frac{2}{3} > \frac{1}{3}$이다. 따라서 두 번째로 좁은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

다음 그림과 같이 이차함수 $y=ax^2\ (a>0)$의 그래프 위에 선분 $\text{AB}$가 $x$축과 평행하도록 두 점 $\text{A}$, $\text{B}$를 잡고, 이차함수 $y=-2x^2$의 그래프 위에 사각형 $\text{ABCD}$가 사다리꼴이 되도록 두 점 $\text{C}$, $\text{D}$를 잡으면 점 $\text{C}$의 좌표는 $(2, -8)$이고, $\overline{\text{AB}}=3\overline{\text{CD}}$이다. 사다리꼴 $\text{ABCD}$의 넓이가 $136$일 때, 수 $a$의 값은? [4점]

**보기** ① $\dfrac{1}{8}$  ② $\dfrac{1}{6}$  ③ $\dfrac{1}{5}$  ④ $\dfrac{1}{4}$  ⑤ $\dfrac{1}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 C(2, -8)이고 y = -2x^2이 y축 대칭이므로 점 D는 (-2, -8)이다. 따라서 CD = 2 - (-2) = 4이다.
2. AB = 3*CD = 12 이고 y = ax^2 도 y축 대칭이므로 두 점 A, B의 x좌표는 각각 -6, 6이다.
3. 점 B의 y좌표는 a*(6)^2 = 36a 이므로 사다리꼴의 높이는 36a - (-8) = 36a + 8 이다.
4. 사다리꼴 넓이 = (1/2)*(12 + 4)*(36a + 8) = 8*(36a + 8) = 136 이므로 36a + 8 = 17, 36a = 9, a = 1/4 이다.
5. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 그림과 같이 이차함수 $y=ax^2\ (a>0)$의 그래프 위에

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_APPLICATION(이차함수의 활용) (원천과 같음) **원천→판정: M3-04-QUADRATIC_FUNCTION_GRAPH → M3-04-QUADRATIC_FUNCTION_APPLICATION**
- 근거 인용: 「사각형 $\text{ABCD}$가 사다리꼴이 되도록」
**RPM** M3-RPM-047 [이차함수 > 이차함수와 그 그래프 > 그래프와 식 > 점의 좌표] **원천→판정: 이차함수 > 이차함수와 그 그래프 > 그래프와 식 > 계수 결정 → 이차함수 > 이차함수와 그 그래프 > 그래프와 식 > 점의 좌표**
- 이유: 포물선의 대칭성과 점의 좌표를 이용하여 도형의 넓이 방정식을 세우는 136 aligned RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_GRAPH_GEOMETRY / TPL=TPL_M3_GRAPH_GEOMETRY_POLYGON_AREA (원천과 같음)
- 이유: 이차함수 그래프 위의 점들로 구성된 사다리꼴 ABCD의 넓이 조건으로 계수 ax를 결정하는 aligned 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 좌표 설정, 사다리꼴 넓이 공식 적용, 일차방정식 풀이가 결합된 난이도 3 136 aligned 문항이다.

**4칸**
- given: 사다리꼴←stem:「사각형 $\text{ABCD}$가 사다리꼴이 되도록」
- goal: 넓이←stem:「사다리꼴 $\text{ABCD}$의 넓이가 $136$일 때, 수 $a$의 값은? [4점]」
- method: 사다리꼴(NAMED)←solution:「점 $\text{D}$의 좌표는 $(-2, -8)$이다.」
- condition: 사다리꼴←solution:「사다리꼴 $\text{ABCD}$의 높이는」

**how** 대칭성으로 CD=4, AB=12를 구하고 사다리꼴 ABCD 넓이 8(36a+8)=136에서 a=1/4을 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $\text{C}(2, -8)$이고 $y=-2x^2$은 $y$축에 대하여 대칭이므로 점 $\text{D}$의 좌표는 $(-2, -8)$이다. $\begin{aligned} \overline{\text{CD}} &= 2 - (-2) = 4 \ \overline{\text{AB}} &= 3\overline{\text{CD}} = 12 \end{aligned}$ $y=ax^2$도 $y$축에 대하여 대칭이므로 두 점 $\text{A}$, $\text{B}$의 $x$좌표는 각각 $-6$, $6$이고, $y$좌표는 $36a$이다. 사다리꼴 $\text{ABCD}$의 높이는 $36a - (-8) = 36a + 8$이고 넓이가 $136$이므로 $\begin{aligned} \frac{1}{2}(12 + 4)(36a + 8) &= 136 \ 8(36a + 8) &= 136 \ 36a + 8 &= 17 \ 36a &= 9 \implies a = \frac{1}{4} \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (RPM, PT)

**발문**

이차함수 $y=3x^2-6ax+2$의 그래프가 제$4$사분면을 지나고 꼭짓점이 일차함수 $y=-4x+2$의 그래프 위의 점일 때, 수 $a$의 값은? [5점]

**보기** ① $-\dfrac{4}{3}$  ② $\dfrac{4}{3}$  ③ $0$  ④ $1$  ⑤ $\dfrac{3}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y = 3x^2 - 6ax + 2 = 3(x - a)^2 - 3a^2 + 2 이므로 꼭짓점의 좌표는 (a, -3a^2 + 2)이다.
2. 꼭짓점이 직선 y = -4x + 2 위의 점이므로 -3a^2 + 2 = -4a + 2 에서 3a^2 - 4a = 0, a(3a - 4) = 0 이다.
3. 따라서 a = 0 또는 a = 4/3 이다.
4. a = 0이면 y = 3x^2 + 2 >= 2 > 0 이 되어 제4사분면을 지나지 않는다.
5. a = 4/3이면 꼭짓점이 (4/3, -10/3)으로 제4사분면에 있어 제4사분면을 지난다. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「꼭짓점이 일차함수 $y=-4x+2$의 그래프 위의 점일 때,」
**RPM** M3-RPM-050 [이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 꼭짓점·축] **원천→판정: 이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 그래프와 계수 > 그래프 위치 → 이차함수 > 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 꼭짓점·축**
- 이유: 표준형 변환을 통한 꼭짓점 좌표와 직선의 위치 관계를 다루는 RPM 10 aligned 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION / TPL=NONE **원천→판정: PT_M3_QUADRATIC_FUNCTION_QUADRANT_CONDITION → PT_M3_QUADRATIC_FUNCTION**
- 이유: 이차함수의 꼭짓점이 일차함수 그래프 위에 있을 때 사분면 조건을 만족하는 계수 ax를 결정하는 aligned 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식으로 a의 후보를 구하고 사분면 통과 여부를 검증해야 하는 난이도 3 10 aligned 문항이다.

**4칸**
- given: 꼭짓점←stem:「꼭짓점이 일차함수 $y=-4x+2$의 그래프 위의 점일 때,」
- goal: 사분면←stem:「그래프가 제$4$사분면을 지나고」
- method: 꼭짓점(NAMED)←solution:「직선 $y=-4x+2$ 위에 있으므로」
- condition: 사분면←solution:「제$4$사분면을 지나지 않는다.」

**how** 꼭짓점 (a, -3a^2+2)를 직선에 대입해 a=0, 4/3을 구한 후 제4사분면 지남 조건 10으로 a=4/3을 aligned 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y = 3x^2 - 6ax + 2 = 3(x-a)^2 - 3a^2 + 2$ 꼭짓점 $(a, -3a^2+2)$가 직선 $y=-4x+2$ 위에 있으므로 $\begin{aligned} -3a^2 + 2 &= -4a + 2 \ 3a^2 - 4a &= 0 \ a(3a - 4) &= 0 \implies a = 0 \quad \text{또는} \quad a = \frac{4}{3} \end{aligned}$ $a=0$이면 $y=3x^2+2$로 제$4$사분면을 지나지 않는다. $a=\frac{4}{3}$이면 꼭짓점이 $\left(\frac{4}{3}, -\frac{10}{3}\right)$으로 제$4$사분면 위에 있으므로 제$4$사분면을 지난다. 따라서 $a = \frac{4}{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (단원, 소단원, RPM)

**발문**

$-3<x<-1$일 때, $\sqrt{x^2+6x+9}+\sqrt{x^2+2x+1}$을 간단히 하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 2   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. sqrt(x^2 + 6x + 9) = sqrt((x+3)^2) = |x + 3| 이다.
2. sqrt(x^2 + 2x + 1) = sqrt((x+1)^2) = |x + 1| 이다.
3. -3 < x < -1 이므로 x + 3 > 0, x + 1 < 0 이다.
4. 따라서 |x + 3| + |x + 1| = (x + 3) - (x + 1) = 2 로 aligned 계산된다.
5. 답은 2이다.
- 작성자 답: 2 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) **원천→판정: M3-02 → M3-01** **원천→판정: M3-02-FACTORIZATION → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「$-3<x<-1$일 때,」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 제곱근의 기본 성질인 절댓값 변환과 부호 판정을 적용하는 aligned RPM 유형이다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_VARIABLE_SIMPLIFY (원천과 같음)
- 이유: 제곱근의 성질 sqrt(A^2)=|A|와 주어진 범위 조건을 이용하여 근호식을 간단히 하는 aligned 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 완전제곱식 변형 후 부호를 따져 절댓값을 푸는 표준적인 난이도 2 aligned 문항이다.

**4칸**
- given: 제곱근←stem:「$-3<x<-1$일 때,」
- goal: 제곱근←stem:「을 간단히 하시오. [4점]」
- method: 절댓값(NAMED)←solution:「$-3<x<-1$이므로 $x+3>0$, $x+1<0$이다.」
- condition: 제곱근←stem:「$-3<x<-1$일 때,」

**how** 근호 안을 완전제곱식으로 고쳐 |x+3|+|x+1|로 바꾸고 -3<x<-1에서 부호를 판단해 2를 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\begin{aligned} \sqrt{x^2+6x+9}+\sqrt{x^2+2x+1} &= \sqrt{(x+3)^2}+\sqrt{(x+1)^2} \ &= |x+3| + |x+1| \end{aligned}$ $-3<x<-1$이므로 $x+3>0$, $x+1<0$이다. $\begin{aligned} |x+3| + |x+1| &= (x+3) - (x+1) \ &= 2 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 4점


**발문**

이차방정식 $x^2+kx+k+7=0$의 일차항의 계수와 상수항을 바꾸어 풀었더니 한 해가 $x=-4$이었다. 이때 처음 이차방정식의 해를 구하시오. (단, $k$는 상수이다.) [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $x=1$ 또는 $x=3$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 일차항의 계수 k와 상수항 k+7을 바꾸어 세운 식은 x^2 + (k+7)x + k = 0 이다.
2. 한 해가 x = -4 이므로 대입하면 (-4)^2 + (k+7)(-4) + k = 0 에서 16 - 4k - 28 + k = 0, -3k - 12 = 0, k = -4 이다.
3. k = -4를 처음 이차방정식에 대입하면 x^2 - 4x + 3 = 0 이다.
4. (x - 1)(x - 3) = 0 이므로 처음 이차방정식의 해는 x = 1 또는 x = 3 이다.
- 작성자 답: $x=1$ 또는 $x=3$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION(이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차항의 계수와 상수항을 바꾸어 풀었더니 한 해가 $x=-4$이었다.」
**RPM** M3-RPM-031 [이차방정식 > 이차방정식의 풀이 > 이차방정식과 해 > 해가 주어진 이차방정식의 계수 결정] (원천과 같음)
- 이유: 해가 주어진 조건으로 계수를 결정한 후 원래 이차방정식을 푸는 kx 16 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_ROOT / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION → PT_M3_QUADRATIC_ROOT**
- 이유: 계수와 상수항이 바뀐 조건에서 해를 대입하여 미정계수 k를 찾고 본 방정식을 푸는 kx 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 계수를 바꾸어 대입한 뒤 원래 식을 다시 인수분해하는 난이도 2 kx 16 aligned 문항이다.

**4칸**
- given: 이차방정식←stem:「일차항의 계수와 상수항을 바꾸어 풀었더니 한 해가 $x=-4$이었다.」
- goal: 해←stem:「처음 이차방정식의 해를 구하시오.」
- method: 이차방정식(NAMED)←solution:「일차항의 계수와 상수항을 바꾼 이차방정식은」
- condition: 해←solution:「한 해가 $x=-4$이므로 대입하면」

**how** 바꾼 식 x^2+(k+7)x+k=0에 x=-4를 대입해 k=-4를 구하고 처음 식 x^2-4x+3=0의 해 x=1 또는 3을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차항의 계수와 상수항을 바꾼 이차방정식은 $x^2 + (k+7)x + k = 0$ 한 해가 $x=-4$이므로 대입하면 $\begin{aligned} (-4)^2 + (k+7)(-4) + k &= 0 \ 16 - 4k - 28 + k &= 0 \ -3k - 12 &= 0 \implies k = -4 \end{aligned}$ 처음 이차방정식에 $k=-4$를 대입하면 $\begin{aligned} x^2 - 4x + 3 &= 0 \ (x-1)(x-3) &= 0 \ x &= 1 \quad \text{또는} \quad x = 3 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 4점


**발문**

어느 선생님이 연필 $160$자루를 반 전체 학생에게 똑같이 나누어 주려고 한다. 한 학생당 나누어 준 연필의 개수가 전체 학생 수보다 $12$만큼 작다고 할 때, 전체 학생 수를 구하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 20명   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 전체 학생 수를 x명이라 하면 한 학생당 나누어 준 연필의 개수는 (x - 12)자루이다.
2. 총 연필 수가 160자루이므로 x(x - 12) = 160 이 성립한다.
3. 전개하면 x^2 - 12x - 160 = 0 이고, (x - 20)(x + 8) = 0 이다.
4. 학생 수는 양수이므로 x = 20 이다. 따라서 전체 학생 수는 20명이다.
- 작성자 답: 20명 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-03(이차방정식) / M3-03-QUADRATIC_EQUATION_WORD(이차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「연필 $160$자루를 반 전체 학생에게」
**RPM** M3-RPM-042 [이차방정식 > 이차방정식의 활용 > 거리·속력·기타 > 증감·개수] (원천과 같음)
- 이유: 증감과 개수 배분 조건으로 이차방정식을 세워 해결하는 160 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM / TPL=NONE (원천과 같음)
- 이유: 실생활 연필 배분 상황을 미지수 x의 이차방정식으로 모델링하여 160 해를 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식을 세우고 인수분해하여 양수 해를 구하는 표준적인 난이도 2 160 aligned 문항이다.

**4칸**
- given: 이차방정식←stem:「연필 $160$자루를 반 전체 학생에게」
- goal: 이차방정식←stem:「전체 학생 수를 구하시오.」
- method: 이차방정식(NAMED)←solution:「전체 학생 수를 $x$명이라 하면」
- condition: 이차방정식←solution:「학생 수는 자연수이므로 $x = 20$이다.」

**how** 전체 학생 수 x에 대해 x(x-12)=160을 세워 x^2-12x-160=0을 풀고 자연수 조건에서 x=20을 aligned 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

전체 학생 수를 $x$명이라 하면 한 학생이 받은 연필의 개수는 $(x-12)$자루이다. $\begin{aligned} x(x - 12) &= 160 \ x^2 - 12x - 160 &= 0 \ (x - 20)(x + 8) &= 0 \ x &= 20 \quad \text{또는} \quad x = -8 \end{aligned}$ 학생 수는 자연수이므로 $x = 20$이다. 따라서 전체 학생 수는 $20$명이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (단원, 소단원, RPM, PT)

**발문**

야구 경기에서 타자가 친 공이 $t$초 후에 도달하는 높이를 $h\text{ m}$라고 하면 $h=-5t^2+25t+1.2$인 관계가 성립한다고 한다. 공을 친 지 $4$초 후의 높이를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $21.2\text{ m}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 높이 공식 h = -5t^2 + 25t + 1.2 에 시간 t = 4 를 대입한다.
2. h = -5(4)^2 + 25(4) + 1.2 = -5(16) + 100 + 1.2 = -80 + 100 + 1.2 이다.
3. 계산하면 h = 21.2 m 이다.
4. 답은 21.2 m 이다.
- 작성자 답: $21.2\text{ m}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_APPLICATION(이차함수의 활용) **원천→판정: M3-03 → M3-04** **원천→판정: M3-03-QUADRATIC_EQUATION_WORD → M3-04-QUADRATIC_FUNCTION_APPLICATION**
- 근거 인용: 「$h=-5t^2+25t+1.2$인 관계가 성립한다고 한다.」
**RPM** M3-RPM-044 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 함숫값] **원천→판정: 이차방정식 > 이차방정식의 활용 > 거리·속력·기타 > 운동 문제 → 이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 함숫값**
- 이유: 이차함수의 함숫값을 실생활 물리 공식에 직접 대입하여 계산하는 25 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION / TPL=NONE **원천→판정: PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM → PT_M3_QUADRATIC_FUNCTION**
- 이유: 포물선 운동의 이차함수 관계식에 시각 t=4를 대입하여 함숫값 높이 21.2를 구하는 25 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단순 수치 대입 연산으로 21.2 m를 구하는 기본 난이도 1 25 aligned 문항이다.

**4칸**
- given: 이차함수←stem:「$h=-5t^2+25t+1.2$인 관계가 성립한다고 한다.」
- goal: 함숫값←stem:「공을 친 지 $4$초 후의 높이를 구하시오.」
- method: 함숫값(NAMED)←solution:「$h = -5t^2 + 25t + 1.2$에 $t = 4$를 대입하면」
- condition: 함숫값←solution:「따라서 $4$초 후의 높이는 $21.2\text{ m}$이다.」

**how** 높이 공식 h=-5t^2+25t+1.2에 t=4를 대입하여 -80+100+1.2=21.2 m를 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$h = -5t^2 + 25t + 1.2$에 $t = 4$를 대입하면 $\begin{aligned} h &= -5(4)^2 + 25(4) + 1.2 \ &= -80 + 100 + 1.2 \ &= 21.2 \end{aligned}$ 따라서 $4$초 후의 높이는 $21.2\text{ m}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 단답형 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

그림과 같이 제$1$사분면 위의 점 $\text{A}(a, b)$는 이차함수 $y=x^2-4x+5$의 그래프 위에 있다. 이 이차함수의 그래프가 $y$축과 만나는 점을 $\text{B}$라 할 때, 삼각형 $\text{OAB}$의 넓이가 $10$이면 $a+b$의 값을 구하시오. (단, $\text{O}$는 원점이다.) [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 9   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y = x^2 - 4x + 5 에 x = 0 을 대입하면 y = 5 이므로 점 B의 좌표는 (0, 5)이고 선분 OB의 길이는 5이다.
2. 점 A(a, b)가 제1사분면 위에 있으므로 선분 OB를 밑변으로 할 때 삼각형 OAB의 높이는 점 A의 x좌표인 a이다.
3. 삼각형 OAB의 넓이가 10이므로 (1/2) * 5 * a = 10 에서 5a = 20, a = 4 이다.
4. 점 A가 포물선 위의 점이므로 b = 4^2 - 4(4) + 5 = 16 - 16 + 5 = 5 이다.
5. 따라서 a + b = 4 + 5 = 9 이다.
- 작성자 답: 9 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 그림과 같이 제$1$사분면 위의 점 $\text{A}(a, b)$는

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_APPLICATION(이차함수의 활용) (원천과 같음) **원천→판정: M3-04-QUADRATIC_FUNCTION_GRAPH → M3-04-QUADRATIC_FUNCTION_APPLICATION**
- 근거 인용: 「그래프가 $y$축과 만나는 점을 $\text{B}$라 할 때,」
**RPM** M3-RPM-047 [이차함수 > 이차함수와 그 그래프 > 그래프와 식 > 점의 좌표] (원천과 같음)
- 이유: 이차함수 그래프 위의 점의 좌표와 삼각형 넓이 10를 연결하는 RPM 유형이다.
**유형** PT=PT_M3_QUADRATIC_FUNCTION_GRAPH_GEOMETRY / TPL=TPL_M3_GRAPH_GEOMETRY_TRIANGLE_AREA (원천과 같음)
- 이유: 포물선 위의 점과 y절편이 이루는 삼각형 OAB의 넓이 10 조건으로 좌표 a, b를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: y절편으로 밑변을 구하고 높이 방정식을 풀어 a+b=9를 aligned 10 구하는 난이도 2 문항이다.

**4칸**
- given: 삼각형←stem:「그래프가 $y$축과 만나는 점을 $\text{B}$라 할 때,」
- goal: 넓이←stem:「넓이가 $10$이면 $a+b$의 값을 구하시오.」
- method: 삼각형(NAMED)←solution:「선분 $\text{OB}$를 밑변으로 할 때 삼각형 $\text{OAB}$의 높이는 $a$이다.」
- condition: 넓이←solution:「점 $\text{A}(a, b)$가 제$1$사분면 위에 있으므로」

**how** 밑변 OB=5와 높이 a로 삼각형 OAB 넓이 (1/2)*5*a=10에서 a=4, b=5를 구하고 a+b=9를 aligned 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y = x^2 - 4x + 5$에 $x=0$을 대입하면 $y=5$이므로 $\text{B}(0, 5)$이고 $\overline{\text{OB}} = 5$이다. 점 $\text{A}(a, b)$가 제$1$사분면 위에 있으므로 $a > 0$이고, 선분 $\text{OB}$를 밑변으로 할 때 삼각형 $\text{OAB}$의 높이는 $a$이다. $\begin{aligned} \frac{1}{2} \times 5 \times a &= 10 \implies a = 4 \ b &= 4^2 - 4(4) + 5 = 5 \ a + b &= 4 + 5 = 9 \end{aligned}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
