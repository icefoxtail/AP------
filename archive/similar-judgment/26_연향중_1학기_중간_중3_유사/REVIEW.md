# 검수 묶음 — 26_연향중_1학기_중간_중3_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 23개 / 검사 PASS 23, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 8, 2단계 15
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (RPM, PT)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, PT)

**발문**

다음 중 제곱근에 대한 설명으로 옳은 것은? [3점]

**보기** ① $144$의 두 제곱근의 합은 $0$이다.  ② $\sqrt{16} = \pm 4$이다.  ③ $0$의 제곱근은 없다.  ④ $\sqrt{64}$의 제곱근은 $\pm 8$이다.  ⑤ $-5$는 $-25$의 음의 제곱근이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① 144의 제곱근은 12와 -12이므로 두 수의 합은 12 + (-12) = 0 으로 참이다.
2. ② sqrt(16) = 4 이므로 +-4가 아니다.
3. ③ 0의 제곱근은 0으로 1개 존재한다.
4. ④ sqrt(64) = 8 이므로 8의 제곱근은 +-sqrt(8) 이다.
5. ⑤ -25는 음수이므로 실수 범위에서 제곱근이 없다. 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「제곱근의 정의와 성질을 각 선지에」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 144의 제곱근인 12와 -12의 합이 0임을 포함하여 제곱근의 정의를 판정한다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_CHECK → PT_M3_SQUARE_ROOT_PROPERTY** (원천과 같음)
- 이유: 144의 제곱근, 16의 양의 제곱근 등 제곱근 명제의 참 거짓을 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 144의 제곱근이 12와 -12임을 알고 정의에 따라 바로 참 거짓을 가리는 1단계 기본 문항이다.

**4칸**
- given: 제곱근←stem:「다음 중 제곱근에 대한 설명으」
- goal: 판정←solution:「용하여 진위를 판정한다. 1단계」
- method: 정의(NAMED)←solution:「제곱근의 정의와 성질을 각」
- condition: 음수←solution:「거짓이다. ⑤ 음수의 제곱은 항상」

**how** 144의 제곱근 12와 -12의 합이 0임을 확인하고 16, 64 등의 보기를 검토하여 1번으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 정의와 성질을 각 선지에 적용하여 진위를 판정한다.

1단계: 각 선지의 설명을 검토한다. ① $144$의 제곱근은 제곱하여 $144$가 되는 수이므로 $12$와 $-12$이다. 두 제곱근의 합은 $12 + (-12) = 0$이므로 참이다. ② $\sqrt{16}$은 $16$의 양의 제곱근을 뜻하므로 $\sqrt{16} = 4$이다. $\pm 4$와 같지 않으므로 거짓이다. ③ $0^2 = 0$이므로 $0$의 제곱근은 $0$으로 $1$개 존재한다. 따라서 거짓이다. ④ $\sqrt{64} = 8$이므로 문제의 질문은 '$8$의 제곱근'을 묻는 것이다. $8$의 제곱근은 $\pm\sqrt{8} = \pm 2\sqrt{2}$이므로 거짓이다. ⑤ 음수의 제곱은 항상 $0$ 이상이므로 실수 범위에서 음수 $-25$의 제곱근은 존재하지 않는다. 따라서 거짓이다.

2단계: 결론을 도출한다. 따라서 옳은 것은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 식을 계산한 값은? [4점] $$\sqrt{(-4)^2} + (-\sqrt{12})^2 \times \sqrt{\frac{1}{36}}$$

**보기** ① $4$  ② $6$  ③ $8$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. sqrt((-4)^2) = 4 이다.
2. (-sqrt(12))^2 = 12 이다.
3. sqrt(1/36) = 1/6 이다.
4. 12 * (1/6) = 2 이므로 전체 식은 4 + 2 = 6 이다.
5. 선지 중 4, 6, 8, 10, 12 에서 답은 ② 6이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「을 계산한 후 사칙연산을 수행한다.」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 12와 36이 포함된 근호식을 제곱근의 성질로 정리하고 곱셈과 덧셈을 수행한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_MIXED_NUMERIC → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_SQUARE_ROOT_ORDER_OF_OPERATIONS → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 12의 제곱근의 제곱과 1/36의 제곱근의 곱셈 및 덧셈 사칙연산을 수행하는 혼합 계산 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 근호 밖으로 빼고 12에 1/6을 곱하여 4+2=6을 얻는 1단계 기본 계산이다.

**4칸**
- given: 제곱근←solution:「제곱근의 성질 $\s」
- goal: 사칙연산←solution:「을 계산한 후 사칙연산을 수행한다.」
- method: 성질(NAMED)←solution:「제곱근의 성질 $\sqrt{」
- condition: (없음)

**how** sqrt((-4)^2)=4와 12 * (1/6) = 2를 계산하여 4+2=6을 얻고 2번으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 성질 $\sqrt{a^2} = |a|$와 $(-\sqrt{a})^2 = a$를 이용하여 각 항을 계산한 후 사칙연산을 수행한다.

1단계: 식의 각 항을 단순화한다. $$\sqrt{(-4)^2} = |-4| = 4$$ $$(-\sqrt{12})^2 = 12$$ $$\sqrt{\frac{1}{36}} = \frac{1}{6}$$

2단계: 곱셈을 먼저 계산하고 덧셈을 수행한다. $$(-\sqrt{12})^2 \times \sqrt{\frac{1}{36}} = 12 \times \frac{1}{6} = 2$$ 따라서 전체 식의 값은 $$4 + 2 = 6$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 $\sqrt{180x}$ 가 자연수가 되도록 하는 $150$ 이하의 자연수 $x$의 개수는? [5점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 180 = 2^2 * 3^2 * 5 이므로 180x가 제곱수가 되려면 x = 5n^2 (n은 자연수) 꼴이어야 한다.
2. x <= 150 이므로 5n^2 <= 150 에서 n^2 <= 30 이다.
3. 가능한 자연수 n은 1, 2, 3, 4, 5 의 5개이다.
4. x의 값은 5, 20, 45, 80, 125 이다.
5. 따라서 자연수 x의 개수는 5개이다. 답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「호 안의 수를 소인수분해하여 제곱수가」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호 안을 자연수로 만들기 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 180을 소인수분해하여 x = 5n^2을 얻고 150 이하 조건을 만족하는 자연수 개수를 구한다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_MAKE_RADICAL_NATURAL → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_PRIME_FACTOR_SQUARE_MULTIPLE_COUNT → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 180x가 제곱수가 되기 위한 조건을 구하고 150 이하에서 n^2 <= 30을 만족하는 x의 개수를 세는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 180을 소인수분해하고 5n^2 <= 150에서 n=1부터 5까지 찾는 2단계 계산이다.

**4칸**
- given: 자연수←stem:「80x}$ 가 자연수가 되도록 하는」
- goal: 개수←stem:「연수 $x$의 개수는? [5점]」
- method: 소인수분해(NAMED)←solution:「호 안의 수를 소인수분해하여 제곱수가」
- condition: 조건←solution:「지수 $x$의 조건을 구하고 범위」

**how** 180 = 2^2*3^2*5에서 x=5n^2이고 5n^2 <= 150에서 n^2 <= 30이므로 n=1~5의 5개로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수를 소인수분해하여 제곱수가 되기 위한 미지수 $x$의 조건을 구하고 범위를 만족하는 개수를 센다.

1단계: 근호 안의 자연수 $180$을 소인수분해한다. $$180 = 2^2 \times 3^2 \times 5$$

2단계: $\sqrt{180x}$가 자연수가 되기 위한 $x$의 형태를 결정한다. $180x$가 어떤 자연수의 제곱이 되려면 모든 소인수의 지수가 짝수이어야 한다. 현재 소인수 $2$와 $3$의 지수는 짝수($2$)이고 소인수 $5$의 지수는 홀수($1$)이므로, $x$는 반드시 소인수 $5$를 홀수 개 포함해야 한다. 따라서 $x$는 가장 작은 자연수 $5$에 어떤 자연수의 제곱이 곱해진 형태이어야 한다. $$x = 5n^2 \quad (n\text{은 자연수})$$

3단계: $x \le 150$을 만족하는 자연수 $n$의 개수를 구한다. $$5n^2 \le 150 \implies n^2 \le 30$$ $n$은 자연수이므로 가능한 $n$의 값은 $$n = 1, 2, 3, 4, 5$$ ($n=5$일 때 $5^2 = 25 \le 30$, $n=6$일 때 $6^2 = 36 > 30$) 이에 대응하는 $x$의 값은 $$5 \times 1 = 5, \quad 5 \times 4 = 20, \quad 5 \times 9 = 45, \quad 5 \times 16 = 80, \quad 5 \times 25 = 125$$ 로 모두 $150$ 이하의 자연수이다.

4단계: 결론을 도출한다. 따라서 조건을 만족하는 자연수 $x$의 개수는 $5$개이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

다음 <보기> 중 대소 관계가 옳은 것만을 있는 대로 고른 것은? [4점]

<보기> ㄱ. $\sqrt{10} < 3$ ㄴ. $\sqrt{0.5} > 0.5$ ㄷ. $-4 < -\sqrt{15}$ ㄹ. $-\frac{\sqrt{5}}{3} < -\frac{\sqrt{7}}{3}$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄱ, ㄹ  ④ ㄴ, ㄷ  ⑤ ㄴ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ: 3 = sqrt(9) 이므로 sqrt(10) > 3 이다. 거짓이다.
2. ㄴ: 0.5 = sqrt(0.25) 이고 0.5 > 0.25 이므로 sqrt(0.5) > 0.5 는 참이다.
3. ㄷ: 4 = sqrt(16) 이고 16 > 15 이므로 4 > sqrt(15), 즉 -4 < -sqrt(15) 는 참이다.
4. ㄹ: sqrt(5) < sqrt(7) 이므로 음수를 취하면 -sqrt(5)/3 > -sqrt(7)/3 이다. 거짓이다.
5. 따라서 옳은 것은 ㄴ, ㄷ이다. 답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「제곱근의 대소 비교 성질과」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 근호 안의 수 10과 15를 비교하고 0.5와 0.25 및 음수의 부등호 성질을 적용한다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION **원천→판정: PT_M3_RADICAL_INEQUALITY_AUDIT → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_FOUR_INEQUALITY_PROPOSITIONS → TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION**
- 이유: 근호가 있는 수와 유리수의 대소 및 0.5와 음수 부호에 따른 대소 관계를 판정하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 근호 안으로 넣어 10과 9, 0.5와 0.25, 16과 15를 1단계로 비교 판정하는 기본 문항이다.

**4칸**
- given: 관계←stem:「기> 중 대소 관계가 옳은 것만을」
- goal: 판정←solution:「기에 적용하여 판정한다. 1단계」
- method: 대소비교(NAMED)←solution:「제곱근의 대소 비교 성질과」
- condition: 음수←solution:「비교 성질과 음수의 성질을 각」

**how** 각 보기를 근호로 통일하여 비교한 결과 ㄴ(0.5>0.25)과 ㄷ(-4<-sqrt(15))이 참임을 확인하여 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 대소 비교 성질과 음수의 성질을 각 보기에 적용하여 판정한다.

1단계: 각 보기를 검토한다. ㄱ. $3 = \sqrt{9}$이다. $10 > 9$이므로 $\sqrt{10} > \sqrt{9} = 3$이다. 따라서 $\sqrt{10} < 3$은 거짓이다. ㄴ. $0.5 = \sqrt{0.5^2} = \sqrt{0.25}$이다. $0.5 > 0.25$이므로 $\sqrt{0.5} > \sqrt{0.25} = 0.5$이다. 따라서 참이다. ㄷ. $4 = \sqrt{16}$이다. $16 > 15$이므로 $\sqrt{16} > \sqrt{15}$, 즉 $4 > \sqrt{15}$이다. 양변에 $-1$을 곱하면 부등호 방향이 바뀌므로 $-4 < -\sqrt{15}$이다. 따라서 참이다. ㄹ. $\sqrt{5} < \sqrt{7}$이므로 양변을 $3$으로 나누면 $\frac{\sqrt{5}}{3} < \frac{\sqrt{7}}{3}$이다. 양변에 $-1$을 곱하면 부등호 방향이 바뀌므로 $-\frac{\sqrt{5}}{3} > -\frac{\sqrt{7}}{3}$이다. 따라서 주어진 부등식은 거짓이다.

2단계: 결론을 도출한다. 따라서 옳은 것은 ㄴ, ㄷ이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 <보기> 중 무리수의 개수는? [3점]

<보기> $$\sqrt{0.9}, \quad \pi, \quad -\sqrt{\frac{16}{81}}, \quad \sqrt{12}, \quad 0.3\dot{7}, \quad 2 - \sqrt{5}, \quad \sqrt{0.25}$$

**보기** ① $1$  ② $2$  ③ $3$  ④ $5$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. sqrt(0.9) = 3/sqrt(10) 은 근호가 벗겨지지 않으므로 무리수이다.
2. 파이는 순환하지 않는 무한소수이므로 무리수이다.
3. -sqrt(16/81) = -4/9, 0.3dot{7} = 17/45, sqrt(0.25) = 0.5 는 유리수이다.
4. sqrt(12) = 2*sqrt(3) 과 2 - sqrt(5) 는 무리수이다.
5. 무리수는 총 4개이다. 선지 중 1, 2, 3, 5, 4 에서 답은 ⑤ 4이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「유리수와 무리수의 정의를 적용」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수의 분류 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 0.9와 12의 근호식 및 파이의 무리수 여부와 16/81의 유리수 여부를 분류한다.
**유형** PT=PT_M3_REAL_NUMBER_CLASSIFICATION / TPL=TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT **원천→판정: PT_M3_IRRATIONAL_NUMBER_IDENTIFICATION → PT_M3_REAL_NUMBER_CLASSIFICATION** **원천→판정: TPL_M3_RADICAL_DECIMAL_PI_CLASSIFICATION → TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT**
- 이유: 주어진 수들 중 근호를 벗길 수 없는 0.9, 12와 파이 등의 무리수를 분류하여 개수를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 0.9, 16/81, 0.25의 근호를 판별하고 무리수 4개를 세는 1단계 분류 문항이다.

**4칸**
- given: 무리수←stem:「<보기> 중 무리수의 개수는? [」
- goal: 개수←solution:「계: 무리수의 개수를 센다. 무리」
- method: 정의(NAMED)←solution:「수와 무리수의 정의를 적용하여 근」
- condition: 순환소수←solution:「수 있는 수와 순환소수를 분류한다.」

**how** 0.9, 파이, 12의 근호, 2-sqrt(5)의 4개가 무리수임을 판정하여 선지 ⑤(4)를 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

유리수와 무리수의 정의를 적용하여 근호를 벗길 수 있는 수와 순환소수를 분류한다.

1단계: 제시된 각 수의 성질을 분류한다.

- $\sqrt{0.9} = \sqrt{\frac{9}{10}} = \frac{3}{\sqrt{10}} = \frac{3\sqrt{10}}{10}$: 근호 안의 $10$이 제곱수가 아니므로 무리수이다.  
- $\pi$: 원주율은 순환하지 않는 무한소수이므로 대표적인 무리수이다.  
- $-\sqrt{\frac{16}{81}} = -\frac{4}{9}$: 정수의 비(분수)로 나타낼 수 있으므로 유리수이다.  
- $\sqrt{12} = 2\sqrt{3}$: 근호 안의 $3$이 제곱수가 아니므로 무리수이다.  
- $0.3\dot{7} = \frac{37 - 3}{90} = \frac{34}{90} = \frac{17}{45}$: 순환소수는 분수로 나타낼 수 있으므로 유리수이다.  
- $2 - \sqrt{5}$: (유리수) - (무리수)의 꼴은 항상 무리수이다.  
- $\sqrt{0.25} = \sqrt{0.5^2} = 0.5 = \frac{1}{2}$: 유리수이다.

2단계: 무리수의 개수를 센다. 무리수는 $\sqrt{0.9}, \pi, \sqrt{12}, 2-\sqrt{5}$의 $4$개이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 중 옳은 설명은? [4점]

**보기** ① $2+\sqrt{3}$에 대응하는 점은 수직선 위에 나타낼 수 있다.  ② 순환하지 않는 무한소수는 유리수이다.  ③ 근호를 사용하여 나타낸 수는 모두 무리수이다.  ④ $\sqrt{9}$는 유리수이면서 무리수이다.  ⑤ 무한소수는 모두 무리수이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① 2 + sqrt(3) 은 실수이므로 수직선 위의 한 점에 대응시킬 수 있다. 참이다.
2. ② 순환하지 않는 무한소수는 무리수의 정의이다.
3. ③ sqrt(25) = 5 처럼 근호가 있어도 유리수인 수가 존재한다.
4. ④ 실수는 유리수 또는 무리수 중 하나이며 둘 다일 수는 없다.
5. ⑤ 순환소수는 무한소수이지만 유리수이다. 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_LINE(수직선 위의 실수 표현) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_LINE**
- 근거 인용: 「실수와 수직선의 관계 및」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 실수의 수직선 대응 및 루트 25와 같은 유리수 반례를 들어 명제를 판정한다.
**유형** PT=PT_M3_REAL_NUMBERS / TPL=NONE **원천→판정: PT_M3_REAL_PROPERTIES_TRUTH_VALUE → PT_M3_REAL_NUMBERS** **원천→판정: TPL_M3_REAL_NUMBER_AXIOMS_EVALUATION → NONE**
- 이유: 실수의 수직선 대응과 루트 25와 같은 근호가 있는 유리수의 반례 등 명제의 참 거짓을 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 실수의 수직선 일대일 대응과 루트 25=5 반례를 이용해 1단계로 참 거짓을 판별하는 기본 문항이다.

**4칸**
- given: 수직선←choices:「대응하는 점은 수직선 위에 나타낼」
- goal: 판정←solution:「고 한 설명은 거짓이다. ③ $\」
- method: 정의(NAMED)←solution:「므로 무리수의 정의이다. 유리수라」
- condition: 실수←solution:「실수와 수직선의 관」

**how** 실수는 수직선 위에 항상 대응되며 루트 25=5처럼 근호가 있어도 유리수인 반례를 확인하여 1번으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

실수와 수직선의 관계 및 소수의 분류 체계를 단계별로 확인한다.

1단계: 각 선지의 명제를 검토한다. ① $2+\sqrt{3}$은 무리수이므로 실수이다. 모든 실수는 수직선 위의 한 점에 일대일로 대응하므로 수직선 위에 나타낼 수 있다. 따라서 참이다. ② 순환하지 않는 무한소수는 분수로 나타낼 수 없으므로 무리수의 정의이다. 유리수라고 한 설명은 거짓이다. ③ $\sqrt{25} = 5$처럼 근호를 사용하여 나타낸 수 중에도 유리수가 존재하므로 거짓이다. ④ 실수는 유리수와 무리수로 완전히 구분되며, 어떤 수도 유리수이면서 동시에 무리수일 수는 없다. $\sqrt{9} = 3$은 유리수이다. 따라서 거짓이다. ⑤ 무한소수 중 순환소수는 유리수이므로 모든 무한소수가 무리수인 것은 아니다. 따라서 거짓이다.

2단계: 결론을 도출한다. 따라서 옳은 것은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

세 수 $A = 3 + \sqrt{7}$, $B = 8 - \sqrt{7}$, $C = 2\sqrt{7}$ 의 대소 관계로 옳은 것은? [5점]

**보기** ① $A < B < C$  ② $C < B < A$  ③ $B < C < A$  ④ $B < A < C$  ⑤ $C < A < B$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. B - C = 8 - 3*sqrt(7) = sqrt(64) - sqrt(63) > 0 이므로 C < B 이다.
2. A - B = 2*sqrt(7) - 5 = sqrt(28) - sqrt(25) > 0 이므로 B < A 이다.
3. 따라서 C < B < A 가 성립한다.
4. 선지 중 옳은 것은 ② C < B < A 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「두 실수의 차의 부호를 계산하여」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 차의 부호 계산에서 64와 63, 28과 25의 근호 비교로 세 수의 대소를 결정한다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION **원천→판정: PT_M3_REAL_ORDER_CHAIN → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_THREE_TERM_SUBTRACTION_COMPARISON → TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION**
- 이유: 두 실수의 차를 구하고 64와 63 등의 근호 대소를 비교하여 세 수의 순서를 정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: B-C에서 64와 63, A-B에서 28과 25의 차의 부호를 각각 판별하여 정렬하는 2단계 문항이다.

**4칸**
- given: 관계←solution:「 전체 대소 관계를 종합한」
- goal: 순서←solution:「세 수의 순서를 결정한다. 1단계」
- method: 부호(NAMED)←solution:「두 실수의 차의 부호를 계산하여」
- condition: 근호←solution:「근호 안으로 수를 넣어 비교하면」

**how** B-C에서 64와 63을, A-B에서 28과 25를 비교하여 C < B < A를 도출하고 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 실수의 차의 부호를 계산하여 세 수의 순서를 결정한다.

1단계: $B$와 $C$의 대소를 비교한다. $$B - C = (8 - \sqrt{7}) - 2\sqrt{7} = 8 - 3\sqrt{7}$$ 근호 안으로 수를 넣어 비교하면 $8 = \sqrt{64}$이고 $3\sqrt{7} = \sqrt{9 \times 7} = \sqrt{63}$이다. $64 > 63$이므로 $\sqrt{64} > \sqrt{63}$, 즉 $8 - 3\sqrt{7} > 0$이다. 따라서 $B - C > 0$이므로 $$C < B$$

2단계: $B$와 $A$의 대소를 비교한다. $$A - B = (3 + \sqrt{7}) - (8 - \sqrt{7}) = 2\sqrt{7} - 5$$ 근호 안으로 수를 넣어 비교하면 $2\sqrt{7} = \sqrt{28}$이고 $5 = \sqrt{25}$이다. $28 > 25$이므로 $\sqrt{28} > \sqrt{25}$, 즉 $2\sqrt{7} - 5 > 0$이다. 따라서 $A - B > 0$이므로 $$B < A$$

3단계: 전체 대소 관계를 종합한다. $C < B$이고 $B < A$이므로 $$C < B < A$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

$\sqrt{5.24} = 2.289$, $\sqrt{52.4} = 7.239$ 일 때, $\sqrt{524} = a$, $\sqrt{0.524} = b$라고 하자. $a + 100b$의 값은? [4점]

**보기** ① $93.18$  ② $94.28$  ③ $95.28$  ④ $96.18$  ⑤ $97.28$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. a = sqrt(524) = 10 * sqrt(5.24) = 10 * 2.289 = 22.89 이다.
2. b = sqrt(0.524) = sqrt(52.4) / 10 = 0.7239 이다.
3. 100b = 100 * 0.7239 = 72.39 이다.
4. 따라서 a + 100b = 22.89 + 72.39 = 95.28 이다.
5. 선지 중 답은 ③ 95.28 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「근호 안의 수에 $100$ 또는」
**RPM** M3-RPM-006 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근표를 이용한 값 구하기 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값**
- 이유: 5.24와 52.4의 제곱근표 근삿값에 100의 거듭제곱을 곱하여 a와 b를 계산한다.
**유형** PT=PT_M3_SQUARE_ROOT_TABLE / TPL=NONE **원천→판정: PT_M3_SQUARE_ROOT_TABLE_INTERPOLATION → PT_M3_SQUARE_ROOT_TABLE** **원천→판정: TPL_M3_DECIMAL_SHIFT_APPROXIMATION → NONE**
- 이유: 100의 거듭제곱을 이용하여 5.24와 52.4의 근삿값으로부터 524와 0.524의 값을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 524를 10*sqrt(5.24)=22.89로, 100b를 10*sqrt(52.4)=72.39로 바꾸어 더하는 2단계 계산이다.

**4칸**
- given: 대입←solution:「2.289$를 대입하면 $$a =」
- goal: 근삿값←solution:「시된 제곱근표 근삿값을 이용해 계산한다」
- method: 거듭제곱(NAMED)←solution:「의 거듭제곱을 곱하여 제시된 제곱」
- condition: 논리합←solution:「근호 안의 수에 $100$ 또는」

**how** a=10*2.289=22.89와 100b=10*7.239=72.39를 구하고 22.89 + 72.39 = 95.28을 도출하여 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수에 $100$ 또는 $\frac{1}{100}$의 거듭제곱을 곱하여 제시된 제곱근표 근삿값을 이용해 계산한다.

1단계: $a = \sqrt{524}$의 값을 구한다. 근호 안을 $5.24 \times 100$으로 분해하면 $$a = \sqrt{524} = \sqrt{5.24 \times 100} = 10\sqrt{5.24}$$ 주어진 $\sqrt{5.24} = 2.289$를 대입하면 $$a = 10 \times 2.289 = 22.89$$

2단계: $b = \sqrt{0.524}$의 값을 구한다. 근호 안을 $52.4 \div 100$으로 분해하면 $$b = \sqrt{0.524} = \sqrt{\frac{52.4}{100}} = \frac{\sqrt{52.4}}{10}$$ 주어진 $\sqrt{52.4} = 7.239$를 대입하면 $$b = \frac{7.239}{10} = 0.7239$$

3단계: $a + 100b$의 값을 계산한다. $$100b = 100 \times 0.7239 = 72.39$$ 따라서 $$a + 100b = 22.89 + 72.39 = 95.28$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 계산 중 옳은 것은? [3점]

**보기** ① $\frac{\sqrt{36}}{6} = \sqrt{6}$  ② $-3\sqrt{5} = \sqrt{45}$  ③ $\sqrt{12} + \sqrt{5} = \sqrt{17}$  ④ $7\sqrt{3} - 3\sqrt{3} = 4\sqrt{3}$  ⑤ $\sqrt{20} - \sqrt{18} = \sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① sqrt(36) / 6 = 6 / 6 = 1 이므로 sqrt(6)이 아니다.
2. ② -3*sqrt(5) 는 음수이고 sqrt(45) 는 양수이므로 같지 않다.
3. ③ sqrt(12) + sqrt(5) != sqrt(17) 이다.
4. ④ 7*sqrt(3) - 3*sqrt(3) = (7 - 3)*sqrt(3) = 4*sqrt(3) 으로 옳다.
5. ⑤ sqrt(20) - sqrt(18) = 2*sqrt(5) - 3*sqrt(2) != sqrt(2) 이다. 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「제곱근의 사칙연산 법칙을 적용하」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 36, 45, 12, 18, 20의 근호 계산을 확인하고 동류근호의 뺄셈 법칙을 적용한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_BASIC_OPERATION_AUDIT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_ADDITION_SUBTRACTION_MISCONCEPTIONS → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 36의 제곱근 등 여러 근호 연산 중 동류근호의 뺄셈 계산이 올바른지 검증하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동류근호의 계수 7 - 3 = 4 계산을 36 등의 다른 선지와 함께 1단계로 판별하는 기본 문항이다.

**4칸**
- given: 무리수←solution:「짓) ④ 같은 무리수 $\sqrt{」
- goal: 판정←solution:「선지의 계산을 검증한다. 1단계」
- method: 사칙연산(NAMED)←solution:「제곱근의 사칙연산 법칙을 적용하」
- condition: 계수←solution:「동류근호이므로 계수끼리 계산하면」

**how** 선지 4번에서 7sqrt(3) - 3sqrt(3) = 4sqrt(3)이 동류근호 계산으로 참임을 확인하고 36 등의 오답을 배제하여 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 사칙연산 법칙을 적용하여 각 선지의 계산을 검증한다.

1단계: 각 선지를 검토한다. ① $\frac{\sqrt{36}}{6} = \frac{6}{6} = 1$이므로 $\sqrt{6}$과 다르다. (거짓) ② $-3\sqrt{5}$는 음수이고 $\sqrt{45} = 3\sqrt{5}$는 양수이므로 서로 같지 않다. (거짓) ③ 근호 안의 수끼리는 덧셈을 합칠 수 없으므로 $\sqrt{12} + \sqrt{5} \ne \sqrt{17}$이다. (거짓) ④ 같은 무리수 $\sqrt{3}$을 포함하는 동류근호이므로 계수끼리 계산하면 $$7\sqrt{3} - 3\sqrt{3} = (7 - 3)\sqrt{3} = 4\sqrt{3}$$ 우변과 일치하므로 참이다. ⑤ $\sqrt{20} = 2\sqrt{5}$, $\sqrt{18} = 3\sqrt{2}$이므로 $\sqrt{20} - \sqrt{18} = 2\sqrt{5} - 3\sqrt{2}$이다. 이는 더 이상 간단히 할 수 없으며 $\sqrt{2}$와 같지 않다. (거짓)

2단계: 결론을 도출한다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

밑변의 길이가 $\sqrt{42}\text{ cm}$, 높이가 $\sqrt{20}\text{ cm}$인 삼각형과 세로의 길이가 $\sqrt{14}\text{ cm}$인 직사각형의 넓이가 서로 같다. 이때 직사각형의 가로의 길이 $x\text{ (cm)}$의 값은? [4점]

**보기** ① $\sqrt{11}$  ② $2\sqrt{3}$  ③ $\sqrt{13}$  ④ $\sqrt{14}$  ⑤ $\sqrt{15}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 넓이는 (1/2) * sqrt(42) * sqrt(20) = (1/2) * sqrt(840) = sqrt(210) cm^2 이다.
2. 직사각형의 넓이는 x * sqrt(14) cm^2 이다.
3. 두 넓이가 같으므로 x * sqrt(14) = sqrt(210) 이다.
4. x = sqrt(210) / sqrt(14) = sqrt(15) cm 이다.
5. 선지 중 답은 ⑤ sqrt(15) 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형과 직사각형의 넓이 공식을」
**RPM** M3-RPM-008 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 도형에서의 제곱근 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫**
- 이유: 42와 20의 근호 곱으로 210 넓이를 구하고 14로 나누어 가로 x를 계산한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_AREA_EQUIVALENCE_RADICAL → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_TRIANGLE_RECTANGLE_EQUAL_AREA → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 삼각형과 직사각형의 넓이 공식에 42, 20의 근호 곱셈과 14의 나눗셈을 적용하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 넓이 sqrt(210) cm를 구하고 sqrt(14)로 나누어 x = sqrt(15) cm를 구하는 2단계 계산이다.

**4칸**
- given: 직사각형←stem:「{ cm}$인 직사각형의 넓이가 서로」
- goal: 길이←solution:「용하여 가로의 길이 $x$를 구한」
- method: 방정식(NAMED)←solution:「음을 이용하여 방정식을 세운다. 직」
- condition: 넓이←stem:「인 직사각형의 넓이가 서로 같다.」

**how** 삼각형 넓이 (1/2)*sqrt(42)*sqrt(20) = sqrt(210)과 x*sqrt(14) = sqrt(210)에서 x = sqrt(15) cm를 도출하여 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형과 직사각형의 넓이 공식을 세우고 무리수 곱셈과 나눗셈을 이용하여 가로의 길이 $x$를 구한다.

1단계: 삼각형의 넓이를 계산한다. $$\text{삼각형의 넓이} = \frac{1}{2} \times \sqrt{42} \times \sqrt{20}$$ $$= \frac{1}{2} \times \sqrt{42 \times 20} = \frac{1}{2} \times \sqrt{840} = \frac{1}{2} \times 2\sqrt{210} = \sqrt{210}\text{ cm}^2$$

2단계: 직사각형의 넓이와 같음을 이용하여 방정식을 세운다. 직사각형의 넓이는 $(\text{가로}) \times (\text{세로}) = x \times \sqrt{14}$이므로 $$x\sqrt{14} = \sqrt{210}$$

3단계: $x$의 값을 계산한다. $$x = \frac{\sqrt{210}}{\sqrt{14}} = \sqrt{\frac{210}{14}} = \sqrt{15}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$a > 0$, $b > 0$, $c > 0$이고 $abc = 64$일 때, $$a\sqrt{\frac{18bc}{a}} - b\sqrt{\frac{8ac}{b}} + c\sqrt{\frac{2ab}{c}}$$ 의 값은? [5점]

**보기** ① $16\sqrt{2}$  ② $12\sqrt{2}$  ③ $8\sqrt{2}$  ④ $-8\sqrt{2}$  ⑤ $-16\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. a*sqrt(18bc/a) = sqrt(18abc) = sqrt(18*64) = 24*sqrt(2) 이다.
2. b*sqrt(8ac/b) = sqrt(8abc) = sqrt(8*64) = 16*sqrt(2) 이다.
3. c*sqrt(2ab/c) = sqrt(2abc) = sqrt(2*64) = 8*sqrt(2) 이다.
4. 따라서 24*sqrt(2) - 16*sqrt(2) + 8*sqrt(2) = 16*sqrt(2) 이다.
5. 선지 중 16sqrt(2), 12sqrt(2), 8sqrt(2) 에서 답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「밖의 문자를 제곱하여 근호 안으」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 변형과 식의 값 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호 안으로 문자를 넣어 18abc, 8abc 등을 만들고 abc=64를 대입해 계산한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_SYMMETRIC_RADICAL_VARIABLE_INSERTION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_TRIPLE_PRODUCT_RADICAL_SIMPLIFICATION → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호 밖의 양수를 근호 안으로 들여보내고 abc=64를 대입하여 계산하는 근호의 혼합 계산 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 문자를 근호 안으로 넣고 abc=64를 대입하여 24sqrt(2) - 16sqrt(2) + 8sqrt(2)를 구하는 2단계 계산이다.

**4칸**
- given: 양수←solution:「양수 조건을 이용하」
- goal: 정리←solution:「대입하여 값을 정리한다. - $」
- method: 대입(NAMED)←solution:「bc=64$를 대입하여 계산한다.」
- condition: 근호←solution:「건을 이용하여 근호 밖의 문자를」

**how** 근호 안으로 문자를 넣어 sqrt(18abc) - sqrt(8abc) + sqrt(2abc)로 바꾼 뒤 abc=64를 대입하여 16sqrt(2)로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

양수 조건을 이용하여 근호 밖의 문자를 제곱하여 근호 안으로 넣은 뒤 $abc=64$를 대입하여 계산한다.

1단계: 각 항의 근호 밖의 문자를 근호 안으로 들여보낸다. $a > 0, b > 0, c > 0$이므로 $$a\sqrt{\frac{18bc}{a}} = \sqrt{a^2 \times \frac{18bc}{a}} = \sqrt{18abc}$$ $$b\sqrt{\frac{8ac}{b}} = \sqrt{b^2 \times \frac{8ac}{b}} = \sqrt{8abc}$$ $$c\sqrt{\frac{2ab}{c}} = \sqrt{c^2 \times \frac{2ab}{c}} = \sqrt{2abc}$$

2단계: $abc = 64$를 각 식에 대입하여 값을 정리한다.

- $\sqrt{18abc} = \sqrt{18 \times 64} = \sqrt{9 \times 2 \times 64} = 3 \times 8\sqrt{2} = 24\sqrt{2}$  
- $\sqrt{8abc} = \sqrt{8 \times 64} = \sqrt{4 \times 2 \times 64} = 2 \times 8\sqrt{2} = 16\sqrt{2}$  
- $\sqrt{2abc} = \sqrt{2 \times 64} = 8\sqrt{2}$

3단계: 전체 식의 값을 계산한다. $$\sqrt{18abc} - \sqrt{8abc} + \sqrt{2abc} = 24\sqrt{2} - 16\sqrt{2} + 8\sqrt{2}$$ $$= (24 - 16 + 8)\sqrt{2} = 16\sqrt{2}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

유리수 $a, b$에 대하여 $$\frac{10 + \sqrt{5}}{\sqrt{10}} - \frac{\sqrt{5} + 6}{\sqrt{2}} = a\sqrt{10} + b\sqrt{2}$$ 가 성립할 때, $a + b$의 값은? [4점]

**보기** ① $-3$  ② $-2$  ③ $-1$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (10 + sqrt(5)) / sqrt(10) = (10*sqrt(10) + sqrt(50)) / 10 = sqrt(10) + (1/2)*sqrt(2) 이다.
2. (sqrt(5) + 6) / sqrt(2) = (sqrt(10) + 6*sqrt(2)) / 2 = (1/2)*sqrt(10) + 3*sqrt(2) 이다.
3. 두 식을 빼면 (1 - 1/2)*sqrt(10) + (1/2 - 3)*sqrt(2) = (1/2)*sqrt(10) - (5/2)*sqrt(2) 이다.
4. a = 1/2, b = -5/2 이므로 a + b = -2 이다. 답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「분모의 유리화를 각각 수행하」
**RPM** M3-RPM-008 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫**
- 이유: 분모를 유리화하여 루트 50을 5루트 2로 바꾸고 루트 10과 루트 2의 계수를 구한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONALIZATION **원천→판정: PT_M3_DUAL_RATIONALIZATION_COEFFICIENT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_COMBINED_RADICAL_FRACTIONS → TPL_M3_RADICAL_RATIONALIZATION**
- 이유: 분모를 유리화하고 동류근호를 정리하여 루트 10과 루트 2의 계수 a, b를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분모를 10과 2로 각각 유리화하고 루트 50=5루트 2를 정리해 계수 합을 구하는 2단계 계산이다.

**4칸**
- given: 유리수←stem:「유리수 $a, b$에」
- goal: 계수←solution:「은 후 유리수 계수 $a, b$를」
- method: 유리화(NAMED)←solution:「분모의 유리화를 각각 수행하」
- condition: 분모←solution:「분모의 유리화를 각」

**how** 각 항을 유리화하여 (10+sqrt(5))/sqrt(10)에서 a=1/2, b=-5/2를 얻어 a+b=-2로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

분모의 유리화를 각각 수행하여 동류근호끼리 묶은 후 유리수 계수 $a, b$를 구한다.

1단계: 첫 번째 항을 유리화하여 전개한다. $$\frac{10 + \sqrt{5}}{\sqrt{10}} = \frac{(10 + \sqrt{5})\sqrt{10}}{10} = \frac{10\sqrt{10} + \sqrt{50}}{10}$$ $\sqrt{50} = 5\sqrt{2}$이므로 $$\frac{10\sqrt{10} + 5\sqrt{2}}{10} = \sqrt{10} + \frac{1}{2}\sqrt{2}$$

2단계: 두 번째 항을 유리화하여 전개한다. $$\frac{\sqrt{5} + 6}{\sqrt{2}} = \frac{(\sqrt{5} + 6)\sqrt{2}}{2} = \frac{\sqrt{10} + 6\sqrt{2}}{2} = \frac{1}{2}\sqrt{10} + 3\sqrt{2}$$

3단계: 두 식의 뺄셈을 수행한다. $$\left(\sqrt{10} + \frac{1}{2}\sqrt{2}\right) - \left(\frac{1}{2}\sqrt{10} + 3\sqrt{2}\right)$$ $$= \left(1 - \frac{1}{2}\right)\sqrt{10} + \left(\frac{1}{2} - 3\right)\sqrt{2}$$ $$= \frac{1}{2}\sqrt{10} - \frac{5}{2}\sqrt{2}$$

4단계: $a, b$를 구하고 $a + b$를 계산한다. 우변 $a\sqrt{10} + b\sqrt{2}$와 계수를 비교하면 $$a = \frac{1}{2}, \quad b = -\frac{5}{2}$$ 따라서 $$a + b = \frac{1}{2} + \left(-\frac{5}{2}\right) = -\frac{4}{2} = -2$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

윗변의 길이가 $\sqrt{28}\text{ cm}$, 아랫변의 길이가 $\sqrt{63}\text{ cm}$이고 높이가 $\sqrt{42}\text{ cm}$인 사다리꼴 $\mathrm{ABCD}$의 넓이는? [4점]

**보기** ① $15\sqrt{6}\text{ cm}^2$  ② $\frac{31}{2}\sqrt{6}\text{ cm}^2$  ③ $\frac{35}{2}\sqrt{6}\text{ cm}^2$  ④ $18\sqrt{6}\text{ cm}^2$  ⑤ $\frac{39}{2}\sqrt{6}\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 윗변 = sqrt(28) = 2*sqrt(7) cm, 아랫변 = sqrt(63) = 3*sqrt(7) cm 이다.
2. 윗변 + 아랫변 = 5*sqrt(7) cm 이다.
3. 높이는 sqrt(42) = sqrt(7*6) cm 이다.
4. 넓이 = (5*sqrt(7) * sqrt(42)) / 2 = (5 * 7 * sqrt(6)) / 2 = (35/2)*sqrt(6) cm^2 이다.
5. 선지 중 답은 ③ (35/2)*sqrt(6) cm^2 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「사다리꼴의 윗변과 아랫」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 도형에서의 제곱근 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 28과 63의 근호 덧셈으로 5루트 7을 구하고 42의 근호 곱셈으로 넓이 35/2를 계산한다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_TRAPEZOID_RADICAL_AREA → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_TRAPEZOID_EVALUATION → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 사다리꼴 넓이 공식에 28과 63의 근호 덧셈 및 42의 근호 곱셈을 적용하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 28과 63을 2루트 7과 3루트 7로 고쳐 더하고 42와 곱해 (35/2)루트 6을 구하는 2단계 계산이다.

**4칸**
- given: 사다리꼴←stem:「{ cm}$인 사다리꼴 $\mathr」
- goal: 넓이←stem:「ABCD}$의 넓이는? [4점]」
- method: 공식(NAMED)←solution:「한 뒤 넓이 공식을 적용한다.」
- condition: 높이←stem:「cm}$이고 높이가 $\sqrt」

**how** 윗변과 아랫변의 합 5sqrt(7)에 높이 sqrt(42)를 곱하고 2로 나누어 (35/2)sqrt(6) cm^2로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사다리꼴의 윗변과 아랫변을 $a\sqrt{b}$ 꼴로 간단히 한 뒤 넓이 공식을 적용한다.

1단계: 윗변과 아랫변의 길이를 정리한다.

- 윗변의 길이: $\sqrt{28} = \sqrt{4 \times 7} = 2\sqrt{7}\text{ cm}$  
- 아랫변의 길이: $\sqrt{63} = \sqrt{9 \times 7} = 3\sqrt{7}\text{ cm}$  
- 높이: $\sqrt{42}\text{ cm}$

2단계: 사다리꼴 넓이 공식에 대입한다. $$\text{넓이} = \frac{(\text{윗변} + \text{아랫변}) \times \text{높이}}{2}$$ $$= \frac{(2\sqrt{7} + 3\sqrt{7}) \times \sqrt{42}}{2} = \frac{5\sqrt{7} \times \sqrt{42}}{2}$$

3단계: 근호의 곱셈을 계산하고 정리한다. $\sqrt{42} = \sqrt{7 \times 6}$이므로 $$\sqrt{7} \times \sqrt{42} = \sqrt{7} \times \sqrt{7} \times \sqrt{6} = 7\sqrt{6}$$ 따라서 $$\text{넓이} = \frac{5 \times 7\sqrt{6}}{2} = \frac{35}{2}\sqrt{6}\text{ cm}^2$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식을 전개한 것으로 옳은 것은? [3점]

**보기** ① $(a + 4)^2 = a^2 + 16$  ② $(a - 5)^2 = a^2 - 25$  ③ $(a + 3)(a - 3) = a^2 + 9$  ④ $(x - 3)(x + 4) = x^2 + x - 12$  ⑤ $(2x - 3)(x - 2) = 2x^2 - 5x + 6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① (a + 4)^2 = a^2 + 8a + 16 이다.
2. ② (a - 5)^2 = a^2 - 10a + 25 이다.
3. ③ (a + 3)(a - 3) = a^2 - 9 이다.
4. ④ (x - 3)(x + 4) = x^2 + (-3+4)x - 12 = x^2 + x - 12 로 옳다.
5. ⑤ (2x - 3)(x - 2) = 2x^2 - 7x + 6 이다. 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「곱셈공식을 적용하여 각」
**RPM** M3-RPM-182 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 여러 곱셈공식 비교·판별] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 여러 곱셈공식 비교·판별**
- 이유: 완전제곱식의 16, 25 상수항 및 일차식의 곱에서 -12가 나오는 공식을 비교 판별한다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT **원천→판정: PT_M3_FORMULA_EXPANSION_VERIFICATION → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_STANDARD_PRODUCTS_AUDIT → TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT**
- 이유: 곱셈공식을 적용하여 상수항 16, 25, -12 등의 전개 결과가 올바른지 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 곱셈공식을 1단계로 전개하여 4번의 -12가 일치함을 바로 확인하는 기본 문항이다.

**4칸**
- given: 다항식←stem:「다항식을 전개한 것으」
- goal: 전개←stem:「다항식을 전개한 것으로 옳은」
- method: 곱셈공식(NAMED)←solution:「곱셈공식을 적용하여 각」
- condition: (없음)

**how** 각 식의 곱셈공식을 전개한 결과 4번 (x-3)(x+4) = x^2+x-12가 참임을 확인하고 16, 25 등의 오답을 배제하여 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈공식을 적용하여 각 식의 전개 결과를 비교한다.

1단계: 각 선지를 검토한다. ① $(a + 4)^2 = a^2 + 8a + 16$이므로 우변의 $a^2 + 16$과 다르다. (거짓) ② $(a - 5)^2 = a^2 - 10a + 25$이므로 우변의 $a^2 - 25$와 다르다. (거짓) ③ $(a + 3)(a - 3) = a^2 - 3^2 = a^2 - 9$이므로 우변의 $a^2 + 9$와 다르다. (거짓) ④ $(x - 3)(x + 4) = x^2 + (-3 + 4)x + (-3) \times 4 = x^2 + x - 12$로 우변과 정확히 일치한다. (참) ⑤ $(2x - 3)(x - 2) = 2x^2 - 4x - 3x + 6 = 2x^2 - 7x + 6$이므로 우변의 $2x^2 - 5x + 6$과 다르다. (거짓)

2단계: 결론을 도출한다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 곱셈공식 $(a+b)(a-b) = a^2 - b^2$ 을 이용하여 계산하기에 가장 편리한 수의 계산은? [4점]

**보기** ① $97^2$  ② $105^2$  ③ $304 \times 308$  ④ $(\sqrt{3} + \sqrt{5})^2$  ⑤ $304 \times 296$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① 97^2 = (100 - 3)^2 은 완전제곱식을 이용한다.
2. ② 105^2 = (100 + 5)^2 은 완전제곱식을 이용한다.
3. ③ 304 * 308 = (300 + 4)(300 + 8) 은 두 일차식의 곱을 이용한다.
4. ④ (sqrt(3) + sqrt(5))^2 은 완전제곱식을 이용한다.
5. ⑤ 304 * 296 = (300 + 4)(300 - 4) = 300^2 - 4^2 = 90000 - 16 = 89984 로 합차공식을 이용하기 가장 편리하다. 답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 곱셈공식 $(a+b)(」
**RPM** M3-RPM-018 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 수 계산 활용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산**
- 이유: 304와 296을 300 기준 합차공식으로 변형하여 90000 - 16을 계산한다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT **원천→판정: PT_M3_FORMULA_NUMERICAL_APPROPRIATENESS → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_MATCH_CALCULATION_TO_FORMULA → TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT**
- 이유: 수의 곱셈 304와 296에 합차공식을 적용하여 편리하게 계산하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 304와 296의 평균 300을 기준으로 합과 차의 꼴을 1단계로 찾아내는 기본 문항이다.

**4칸**
- given: 곱셈공식←stem:「다음 중 곱셈공식 $(a+b)(」
- goal: 공식←solution:「가장 적합한 공식을 분석한다.」
- method: 합차공식(NAMED)←solution:「있다. 따라서 합차공식 $(a + b」
- condition: 평균←solution:「두 수의 평균을 기준으로 $」

**how** 304와 296은 (300+4)(300-4)로 합차공식을 바로 적용할 수 있어 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 수의 평균을 기준으로 $(A + B)(A - B)$ 꼴로 표현할 수 있는 계산식을 찾는다.

1단계: 각 선지의 수 계산에 가장 적합한 공식을 분석한다. ① $97^2 = (100 - 3)^2$: 완전제곱식 $(a - b)^2 = a^2 - 2ab + b^2$을 이용한다. ② $105^2 = (100 + 5)^2$: 완전제곱식 $(a + b)^2 = a^2 + 2ab + b^2$을 이용한다. ③ $304 \times 308 = (300 + 4)(300 + 8)$: 일차식의 곱 $(x + a)(x + b) = x^2 + (a + b)x + ab$를 이용한다. ④ $(\sqrt{3} + \sqrt{5})^2$: 완전제곱식 $(a + b)^2 = a^2 + 2ab + b^2$을 이용한다. ⑤ $304$와 $296$의 평균은 $\frac{304 + 296}{2} = 300$이다. 두 수는 $300$을 기준으로 각각 $+4$와 $-4$이므로 $$304 \times 296 = (300 + 4)(300 - 4)$$ 로 나타낼 수 있다. 따라서 합차공식 $(a + b)(a - b) = a^2 - b^2$를 이용하면 $$300^2 - 4^2 = 90000 - 16 = 89984$$ 로 가장 편리하게 계산할 수 있다.

2단계: 결론을 도출한다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x = \frac{1}{\sqrt{7} + \sqrt{6}}$, $y = \frac{1}{\sqrt{7} - \sqrt{6}}$ 일 때, $x^2 + y^2$의 값은? [4점]

**보기** ① $26$  ② $28$  ③ $30$  ④ $32$  ⑤ $34$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x = (sqrt(7) - sqrt(6)) / (7 - 6) = sqrt(7) - sqrt(6) 이다.
2. y = (sqrt(7) + sqrt(6)) / (7 - 6) = sqrt(7) + sqrt(6) 이다.
3. x + y = 2*sqrt(7) 이고 xy = 7 - 6 = 1 이다.
4. x^2 + y^2 = (x + y)^2 - 2xy = (2*sqrt(7))^2 - 2*1 = 28 - 2 = 26 이다.
5. 선지 중 26, 28, 30, 32, 34 에서 답은 ① 26이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「후 곱셈공식의 변형을 이용하여 식」
**RPM** M3-RPM-019 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 변형 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값**
- 이유: 유리화한 x, y의 합과 곱 xy=1을 구하고 곱셈공식 변형으로 28 - 2 = 26을 계산한다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=NONE **원천→판정: PT_M3_SYMMETRIC_EXPRESSION_EVALUATION → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_CONJUGATE_RADICAL_SUM_OF_SQUARES → NONE**
- 이유: 분모를 유리화한 후 합과 곱 xy를 구하고 곱셈공식의 변형으로 28-2=26을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 유리화하여 x+y와 xy=1을 구한 후 28-2=26을 계산하는 2단계 문항이다.

**4칸**
- given: 유리화←solution:「분모를 유리화하여 $x, y」
- goal: 변환←solution:「후 곱셈공식의 변형을 이용하여 식」
- method: 곱셈공식(NAMED)←solution:「히 나타낸 후 곱셈공식의 변형을 이용」
- condition: 분모←solution:「분모를 유리화하여」

**how** x+y = 2sqrt(7), xy = 1로부터 x^2 + y^2 = 28 - 2 = 26을 도출하여 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

분모를 유리화하여 $x, y$를 간단히 나타낸 후 곱셈공식의 변형을 이용하여 식의 값을 구한다.

1단계: $x$와 $y$의 분모를 각각 유리화한다. $$x = \frac{1}{\sqrt{7} + \sqrt{6}} = \frac{\sqrt{7} - \sqrt{6}}{(\sqrt{7} + \sqrt{6})(\sqrt{7} - \sqrt{6})} = \frac{\sqrt{7} - \sqrt{6}}{7 - 6} = \sqrt{7} - \sqrt{6}$$ $$y = \frac{1}{\sqrt{7} - \sqrt{6}} = \frac{\sqrt{7} + \sqrt{6}}{(\sqrt{7} - \sqrt{6})(\sqrt{7} + \sqrt{6})} = \frac{\sqrt{7} + \sqrt{6}}{7 - 6} = \sqrt{7} + \sqrt{6}$$

2단계: 두 수의 합과 곱을 구한다. $$x + y = (\sqrt{7} - \sqrt{6}) + (\sqrt{7} + \sqrt{6}) = 2\sqrt{7}$$ $$xy = (\sqrt{7} - \sqrt{6})(\sqrt{7} + \sqrt{6}) = 7 - 6 = 1$$

3단계: 곱셈공식의 변형을 이용하여 $x^2 + y^2$을 계산한다. $$x^2 + y^2 = (x + y)^2 - 2xy$$ $$= (2\sqrt{7})^2 - 2 \times 1 = 28 - 2 = 26$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

수직선 위의 기준점 $\mathrm{A}(3)$에서 가로가 $3$, 세로가 $1$인 직각삼각형의 빗변을 반지름으로 하여 왼쪽으로 호를 그려 만난 점을 $\mathrm{P}(a)$라 하고, 기준점 $\mathrm{C}(5)$에서 가로가 $1$, 세로가 $3$인 직각삼각형의 빗변을 반지름으로 하여 오른쪽으로 호를 그려 만난 점을 $\mathrm{Q}(b)$라 하자. 두 점이 나타내는 수의 곱 $ab$의 값은? [5점]

**보기** ① $5 - 3\sqrt{10}$  ② $5 - 2\sqrt{10}$  ③ $5 - \sqrt{10}$  ④ $7 - 2\sqrt{10}$  ⑤ $15 - 2\sqrt{10}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형의 빗변 길이는 sqrt(3^2 + 1^2) = sqrt(10) 이다.
2. 점 P의 좌표 a = 3 - sqrt(10) 이고, 점 Q의 좌표 b = 5 + sqrt(10) 이다.
3. ab = (3 - sqrt(10))(5 + sqrt(10)) = 15 + 3*sqrt(10) - 5*sqrt(10) - 10 이다.
4. ab = 5 - 2*sqrt(10) 이다.
5. 선지 중 옳은 것은 ② 5 - 2*sqrt(10) 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_LINE(수직선 위의 실수 표현) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_LINE**
- 근거 인용: 「수직선 위의 기준점」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 수직선 위의 무리수 점 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 피타고라스 빗변 루트 10을 구하여 수직선 점의 좌표 a, b를 정하고 곱 ab를 계산한다.
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING **원천→판정: PT_M3_PYTHAGOREAN_COORDINATE_PRODUCT → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_NUMBER_LINE_RADICAL_PAIR_PRODUCT → TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING**
- 이유: 피타고라스 길이 루트 10으로 수직선 위의 점 a, b를 매핑하고 두 수의 곱 ab를 전개하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 빗변 루트 10을 구해 좌표 3-sqrt(10), 5+sqrt(10)를 설정하고 전개하여 ab를 구하는 2단계 계산이다.

**4칸**
- given: 수직선←stem:「수직선 위의 기준점」
- goal: 전개←solution:「칙을 이용하여 전개하면 $$ab」
- method: 직각삼각형(NAMED)←solution:「스 정리로 두 직각삼각형의 빗변 길이를」
- condition: 반지름←solution:「용하여 원호의 반지름을 구하고, 기」

**how** a = 3 - sqrt(10), b = 5 + sqrt(10)를 구하고 곱 ab = 15 - 2sqrt(10) - 10 = 5 - 2sqrt(10)를 도출하여 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리를 이용하여 원호의 반지름을 구하고, 기준점으로부터의 방향에 따라 좌표를 정한 후 다항식 곱셈을 수행한다.

1단계: 피타고라스 정리로 두 직각삼각형의 빗변 길이를 구한다. 가로 $3$, 세로 $1$인 직각삼각형의 빗변 길이는 $$\sqrt{3^2 + 1^2} = \sqrt{9 + 1} = \sqrt{10}$$ 가로 $1$, 세로 $3$인 직각삼각형의 빗변 길이 역시 $$\sqrt{1^2 + 3^2} = \sqrt{1 + 9} = \sqrt{10}$$

2단계: 두 점 $\mathrm{P}$와 $\mathrm{Q}$가 나타내는 수 $a, b$를 구한다.

- 점 $\mathrm{P}$는 기준점 $3$에서 왼쪽(음의 방향)으로 $\sqrt{10}$만큼 이동한 점이므로 $$a = 3 - \sqrt{10}$$  
- 점 $\mathrm{Q}$는 기준점 $5$에서 오른쪽(양의 방향)으로 $\sqrt{10}$만큼 이동한 점이므로 $$b = 5 + \sqrt{10}$$

3단계: 두 수의 곱 $ab$를 계산한다. $$ab = (3 - \sqrt{10})(5 + \sqrt{10})$$ 분배법칙을 이용하여 전개하면 $$ab = 3 \times 5 + 3\sqrt{10} - 5\sqrt{10} - (\sqrt{10})^2$$ $$= 15 - 2\sqrt{10} - 10 = 5 - 2\sqrt{10}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $x^2 - y^2 + 6y - 9$ 를 인수분해 한 것으로 옳은 것은? [4점]

**보기** ① $(x + y + 3)(x - y - 3)$  ② $(x + y - 3)(x - y - 3)$  ③ $(x + y - 3)(x - y + 3)$  ④ $(x - y + 3)(x - y - 3)$  ⑤ $(x + y + 3)(x - y + 3)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. x^2 - y^2 + 6y - 9 = x^2 - (y^2 - 6y + 9) 로 묶는다.
2. y^2 - 6y + 9 = (y - 3)^2 이므로 x^2 - (y - 3)^2 이 된다.
3. 합차공식을 적용하면 (x + (y - 3))(x - (y - 3)) 이다.
4. 정리하면 (x + y - 3)(x - y + 3) 이다.
5. 따라서 옳은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「- 9$ 를 인수분해 한 것으로 옳」
**RPM** M3-RPM-024 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 합과 차] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 복잡한 식의 인수분해(항이 4개인 식) → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 합과 차**
- 이유: 세 항을 완전제곱식으로 묶어 x^2 - (y - 3)^2 꼴로 만든 뒤 합과 차의 공식을 적용한다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_GROUPING_FACTORIZATION **원천→판정: PT_M3_FOUR_TERM_SQUARE_DIFFERENCE → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_ONE_THREE_SPLIT_FACTORING → TPL_M3_GROUPING_FACTORIZATION**
- 이유: 항이 4개인 다항식을 1-3으로 묶어 완전제곱식과 합차공식을 적용하여 인수분해하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: y의 완전제곱식 -(y-3)^2을 묶어내고 합차공식 A^2 - B^2을 적용하는 2단계 인수분해이다.

**4칸**
- given: 다항식←stem:「다항식 $x^2 -」
- goal: 인수분해←stem:「- 9$ 를 인수분해 한 것으로 옳」
- method: 완전제곱식(NAMED)←solution:「-3$ 묶음의 완전제곱식으로 변형한 후」
- condition: 합차공식←solution:「로 변형한 후 합차공식을 적용한다.」

**how** x^2 - (y - 3)^2으로 묶은 후 합차공식을 적용하여 (x + y - 3)(x - y + 3)인 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

항이 4개인 다항식을 $3-1$ 또는 $1-3$ 묶음의 완전제곱식으로 변형한 후 합차공식을 적용한다.

1단계: 뒤의 세 항을 마이너스로 묶어 완전제곱식을 만든다. $$-y^2 + 6y - 9 = -(y^2 - 6y + 9) = -(y - 3)^2$$ 따라서 주어진 다항식은 다음과 같이 변형된다. $$x^2 - y^2 + 6y - 9 = x^2 - (y - 3)^2$$

2단계: 합차공식 $A^2 - B^2 = (A + B)(A - B)$를 적용한다. 여기서 $A = x$, $B = y - 3$이므로 $$x^2 - (y - 3)^2 = {x + (y - 3)}{x - (y - 3)}$$ $$= (x + y - 3)(x - y + 3)$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

넓이가 각각 $3x^2$인 정사각형 $3$개, 넓이가 각각 $x$인 직사각형 $7$개, 넓이가 각각 $1$인 정사각형 $2$개를 겹치지 않게 이어 붙여 하나의 새로운 직사각형을 만들 때, 이 새로운 직사각형의 둘레의 길이는? [4점]

**보기** ① $4x + 3$  ② $6x + 6$  ③ $8x + 4$  ④ $8x + 6$  ⑤ $3x^2 + 7x + 2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 전체 직사각형의 넓이 S = 3x^2 + 7x + 2 이다.
2. 이차식을 인수분해하면 3x^2 + 7x + 2 = (3x + 1)(x + 2) 이다.
3. 가로와 세로의 길이는 각각 3x + 1 과 x + 2 이다.
4. 둘레 = 2 * ((3x + 1) + (x + 2)) = 2 * (4x + 3) = 8x + 6 이다.
5. 선지 중 답은 ④ 8x + 6 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「현하고, 이를 인수분해하여 가로와 세」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 도형 활용 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 3x^2 + 7x + 2를 (3x + 1)(x + 2)로 인수분해하여 둘레 8x + 6을 계산한다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_QUADRATIC_FACTORIZATION_SUM **원천→판정: PT_M3_ALGEBRAIC_TILE_PERIMETER → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_COMBINED_TILES_RECTANGLE_PERIMETER → TPL_M3_QUADRATIC_FACTORIZATION_SUM**
- 이유: 도형의 넓이 합 3x^2 + 7x + 2 이차식을 인수분해하여 가로와 세로의 길이를 찾고 둘레 8x + 6을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전체 넓이 3x^2 + 7x + 2를 인수분해하고 2배하여 둘레 8x + 6을 구하는 2단계 계산이다.

**4칸**
- given: 직사각형←stem:「각각 $x$인 직사각형 $7$개, 넓」
- goal: 둘레←stem:「운 직사각형의 둘레의 길이는? [」
- method: 인수분해(NAMED)←solution:「현하고, 이를 인수분해하여 가로와 세」
- condition: 상수항←solution:「mes 1$, 상수항 $2 = 1」

**how** 총 넓이 S = 3x^2 + 7x + 2 = (3x + 1)(x + 2)에서 둘레 2(4x + 3) = 8x + 6을 도출하여 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형 조각들의 넓이의 총합을 이차다항식으로 표현하고, 이를 인수분해하여 가로와 세로의 길이를 구한 뒤 둘레를 계산한다.

1단계: 새로운 직사각형 전체의 넓이를 다항식으로 나타낸다.

- 넓이가 $x^2$인 조각 $3$개의 넓이 합: $3x^2$  
- 넓이가 $x$인 조각 $7$개의 넓이 합: $7x$  
- 넓이가 $1$인 조각 $2$개의 넓이 합: $2$ 따라서 전체 넓이는 $$S = 3x^2 + 7x + 2$$

2단계: 다항식을 인수분해하여 직사각형의 가로와 세로 길이를 구한다. 이차항 계수 $3 = 3 \times 1$, 상수항 $2 = 1 \times 2$이므로 $$3 \times 2 + 1 \times 1 = 6 + 1 = 7$$ 로 일차항 계수와 일치한다. 따라서 $$3x^2 + 7x + 2 = (3x + 1)(x + 2)$$ 직사각형의 가로와 세로의 길이는 각각 $3x + 1$과 $x + 2$이다.

3단계: 직사각형의 둘레의 길이를 계산한다. $$\text{둘레} = 2 \times {(\text{가로}) + (\text{세로})}$$ $$= 2{(3x + 1) + (x + 2)} = 2(4x + 3) = 8x + 6$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $(x - 4)(x + 8) + k$ 가 완전제곱식이 되도록 하는 상수 $k$의 값은? [4점]

**보기** ① $16$  ② $20$  ③ $28$  ④ $32$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (x - 4)(x + 8) + k = x^2 + 4x - 32 + k 이다.
2. 완전제곱식이 되려면 상수항은 일차항 계수 4의 절반의 제곱이어야 한다.
3. (4 / 2)^2 = 2^2 = 4 이다.
4. 따라서 k - 32 = 4 이므로 k = 32 + 4 = 36 이다.
5. 선지 중 16, 20, 28, 32, 36 에서 답은 ⑤ 36이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「+ k$ 가 완전제곱식이 되도록 하는」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 완전제곱식이 될 조건 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식**
- 이유: 전개식 x^2 + 4x - 32 + k에서 4의 절반의 제곱이 k - 32와 같음을 이용해 36을 구한다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_PERFECT_SQUARE_CONDITION **원천→판정: PT_M3_PERFECT_SQUARE_CONSTANT_FIND → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_EXPANDED_QUADRATIC_PERFECT_SQUARE → TPL_M3_PERFECT_SQUARE_CONDITION**
- 이유: 다항식을 전개한 후 상수항 k - 32가 완전제곱식이 될 조건을 만족하도록 k = 36을 결정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전개하여 상수항 k - 32를 정리하고 (4/2)^2 = 4로부터 k = 36을 구하는 2단계 계산이다.

**4칸**
- given: 다항식←stem:「다항식 $(x - 4」
- goal: 상수←stem:「되도록 하는 상수 $k$의 값은」
- method: 완전제곱식(NAMED)←solution:「같아야 하는 완전제곱식의 조건을 적용」
- condition: 상수항←solution:「절반의 제곱이 상수항과 같아야 하는」

**how** (x - 4)(x + 8) + k = x^2 + 4x - 32 + k에서 k - 32 = 4이므로 k = 36을 도출하여 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

다항식을 전개한 후 일차항 계수의 절반의 제곱이 상수항과 같아야 하는 완전제곱식의 조건을 적용한다.

1단계: 주어진 다항식을 전개하여 내림차순으로 정리한다. $$(x - 4)(x + 8) + k = x^2 + (8 - 4)x - 32 + k$$ $$= x^2 + 4x + (k - 32)$$

2단계: 완전제곱식이 될 조건을 적용한다. 이차식 $x^2 + 4x + (k - 32)$가 완전제곱식 $(x + 2)^2 = x^2 + 4x + 4$가 되려면 상수항이 일차항 계수 $4$의 절반의 제곱과 같아야 한다. $$\left(\frac{4}{2}\right)^2 = 2^2 = 4$$ 따라서 $$k - 32 = 4$$

3단계: $k$의 값을 구한다. $$k = 32 + 4 = 36$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서술형 1] $xy < 0$이고 $x < y$일 때, $\sqrt{(-2x)^2} - \sqrt{9y^2} + \sqrt{(x - y)^2}$ 를 간단히 하는 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-3x - 2y$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. xy < 0 이고 x < y 이므로 x < 0, y > 0 이고 x - y < 0 이다.
2. sqrt((-2x)^2) = |-2x| = -2x 이다.
3. sqrt(9y^2) = |3y| = 3y 이다.
4. sqrt((x - y)^2) = |x - y| = -(x - y) = -x + y 이다.
5. 식 전체 = (-2x) - (3y) + (-x + y) = -3x - 2y 이다.
- 작성자 답: -3x - 2y → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「부호 조건을 파악하고 $」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 문자를 포함한 식의 제곱근 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: xy < 0 부호 조건으로부터 각 항의 절댓값을 벗겨 식을 간단히 정리한다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_VARIABLE_SIMPLIFY **원천→판정: PT_M3_RADICAL_SIGN_SIMPLIFICATION → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_VARIABLE_RADICAL_SUM_DIFFERENCE → TPL_M3_RADICAL_VARIABLE_SIMPLIFY**
- 이유: xy < 0 및 x < y 부호 조건을 이용하여 근호 안의 식을 절댓값으로 풀고 정리하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: xy < 0에서 부호를 판정하고 세 항의 절댓값을 각각 벗겨 정리하는 2단계 서술형 계산이다.

**4칸**
- given: 조건←solution:「부호 조건을 파악하고 $」
- goal: 동류항←solution:「값을 벗긴 후 동류항을 정리한다.」
- method: 성질(NAMED)←solution:「= |A|$의 성질을 적용하여 각」
- condition: 절댓값←solution:「하여 각 항의 절댓값을 벗긴 후 동」

**how** xy < 0, x < y에서 x < 0, y > 0을 얻고 |-2x| - |3y| + |x-y| = -2x - 3y - x + y = -3x - 2y로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

부호 조건을 파악하고 $\sqrt{A^2} = |A|$의 성질을 적용하여 각 항의 절댓값을 벗긴 후 동류항을 정리한다.

단계별 서술: 1단계: $x, y$의 부호 및 $x - y$의 부호를 판정한다. $xy < 0$이므로 $x$와 $y$는 서로 다른 부호이다. 그런데 $x < y$이므로 $$x < 0, \quad y > 0$$ 또한 작은 수에서 큰 수를 뺐으므로 $$x - y < 0$$

2단계: 각 항의 근호를 절댓값으로 변환하고 부호에 따라 정리한다.

- $x < 0$이므로 $-2x > 0$이다. $$\sqrt{(-2x)^2} = |-2x| = -2x$$  
- $y > 0$이므로 $3y > 0$이다. $$\sqrt{9y^2} = \sqrt{(3y)^2} = |3y| = 3y$$  
- $x - y < 0$이므로 $$\sqrt{(x - y)^2} = |x - y| = -(x - y) = -x + y$$

3단계: 식 전체를 결합하여 간단히 정리한다. $$\sqrt{(-2x)^2} - \sqrt{9y^2} + \sqrt{(x - y)^2} = (-2x) - (3y) + (-x + y)$$ $$= -2x - 3y - x + y = -3x - 2y$$

따라서 답은 $-3x - 2y$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서술형 2] $a - b = 6$, $ab = 3$일 때, $\frac{a^3 + a^2b + ab^2 + b^3}{a + b}$ 의 값을 인수분해와 곱셈공식을 이용하여 구하는 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $42$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분자 = a^2(a + b) + b^2(a + b) = (a + b)(a^2 + b^2) 이다.
2. a + b != 0 이므로 분모와 약분하면 a^2 + b^2 이 된다.
3. 곱셈공식 변형을 적용하면 a^2 + b^2 = (a - b)^2 + 2ab 이다.
4. a - b = 6, ab = 3 을 대입하면 6^2 + 2*3 = 36 + 6 = 42 이다.
5. 따라서 구하는 식의 값은 42이다.
- 작성자 답: $42$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「어 공통인수로 인수분해하여 약분한 후」
**RPM** M3-RPM-021 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 식의 값 구하기 → 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: 공통인수로 묶어 약분하고 ab=3 대입 후 36 + 6 = 42를 구한다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_COMMON_FACTOR_IDENTIFICATION **원천→판정: PT_M3_FRACTIONAL_FACTORING_EVALUATION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_CUBIC_PAIR_FACTOR_REDUCE → TPL_M3_COMMON_FACTOR_IDENTIFICATION**
- 이유: 분자를 공통인수로 묶어 약분한 뒤 ab를 이용한 곱셈공식 변형으로 42를 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 분자를 인수분해하여 약분하고 (a-b)^2 + 2ab = 36 + 6 = 42를 계산하는 2단계 서술형 문항이다.

**4칸**
- given: 분수식←solution:「$ 2단계: 분수식을 약분한다.」
- goal: 대입←solution:「b = 3$을 대입하면 $$a^2」
- method: 공통인수(NAMED)←solution:「을 둘씩 묶어 공통인수로 인수분해하여」
- condition: 약분←solution:「인수분해하여 약분한 후 곱셈공식」

**how** 분자를 (a+b)(a^2+b^2)로 인수분해하여 약분하고 (a-b)^2+2ab = 36+6 = 42를 도출하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

분자의 4개 항을 둘씩 묶어 공통인수로 인수분해하여 약분한 후 곱셈공식의 변형을 적용하여 서술한다.

단계별 서술: 1단계: 분자의 다항식 $a^3 + a^2b + ab^2 + b^3$을 인수분해한다. 앞의 두 항과 뒤의 두 항에서 각각 공통인수를 묶어내면 $$a^3 + a^2b + ab^2 + b^3 = a^2(a + b) + b^2(a + b)$$ 공통인수 $a + b$로 묶으면 $$= (a + b)(a^2 + b^2)$$

2단계: 분수식을 약분한다. $ab = 3 > 0$이므로 $a$와 $b$는 같은 부호이다. 만약 $a + b = 0$이라면 $b = -a$가 되어 $ab = -a^2 \le 0$이므로 $ab = 3 > 0$이라는 조건에 모순이다. 따라서 $a + b \ne 0$이므로 분모와 분자의 $a + b$를 약분할 수 있다. $$\frac{a^3 + a^2b + ab^2 + b^3}{a + b} = \frac{(a + b)(a^2 + b^2)}{a + b} = a^2 + b^2$$

3단계: 곱셈공식의 변형을 이용하여 $a^2 + b^2$의 값을 계산한다. $$a^2 + b^2 = (a - b)^2 + 2ab$$ 주어진 조건 $a - b = 6$, $ab = 3$을 대입하면 $$a^2 + b^2 = 6^2 + 2 \times 3 = 36 + 6 = 42$$

따라서 구하는 식의 값은 $42$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 3] $x = 3 + \sqrt{5}$일 때, $x^2 - 6x + 5$의 값을 구하려고 한다. 다음 물음에 답하고 과정을 서술하시오. [총 7점, 부분점수 있음]

(1) 인수분해를 이용하여 위의 식의 값을 구하는 과정을 서술하시오. [4점] (2) 완전제곱식을 이용하여 위의 식의 값을 구하는 과정을 서술하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 1, (2) 1   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 가지 방법인 인수분해형 vs 완전제곱식형 풀이를 적용한다.
2. (1) x^2 - 6x + 5 = (x - 1)(x - 5) = (sqrt(5) + 2)(sqrt(5) - 2) = 5 - 4 = 1 이다.
3. (2) x^2 - 6x + 5 = (x - 3)^2 - 4 이고 x - 3 = sqrt(5) 이므로 (sqrt(5))^2 - 4 = 5 - 4 = 1 이다.
4. 따라서 (1)과 (2)의 결과는 모두 1이다.
- 작성자 답: (1) 1, (2) 1 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「음] (1) 인수분해를 이용하여 위」
**RPM** M3-RPM-027 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 식의 값 구하기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값**
- 이유: 인수분해형 vs 완전제곱식형 두 대수적 방법으로 무리수 대입 식의 값을 구한다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION **원천→판정: PT_M3_DUAL_METHOD_RADICAL_POLYNOMIAL → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_FACTOR_VS_COMPLETING_SQUARE_EVALUATION → TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION**
- 이유: 인수분해 방법 vs 완전제곱식 변형 방법 두 가지 절차로 식의 값을 서술하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 인수분해형 vs 완전제곱식형 두 방식으로 각각 1을 유도하는 2단계 서술형 문항이다.

**4칸**
- given: 무리수←solution:「무리수 대입 식의 값」
- goal: 대입←solution:「무리수 대입 식의 값을 구」
- method: 인수분해(NAMED)←stem:「음] (1) 인수분해를 이용하여 위」
- condition: 완전제곱식←stem:「4점] (2) 완전제곱식을 이용하여 위」

**how** 인수분해형 vs 완전제곱식형의 두 가지 방법으로 각각 식의 값 1을 도출하여 (1) 1, (2) 1로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

무리수 대입 식의 값을 구하는 두 가지 대표적 대수 방법(인수분해형 vs 완전제곱식형)을 단계별로 서술한다.

단계별 서술: (1) 인수분해를 이용한 풀이: 1단계: 다항식 $x^2 - 6x + 5$를 인수분해한다. 합이 $-6$이고 곱이 $5$인 두 수는 $-1$과 $-5$이므로 $$x^2 - 6x + 5 = (x - 1)(x - 5)$$ 2단계: $x = 3 + \sqrt{5}$를 인수분해된 식에 대입한다. $$x - 1 = (3 + \sqrt{5}) - 1 = 2 + \sqrt{5} = \sqrt{5} + 2$$ $$x - 5 = (3 + \sqrt{5}) - 5 = \sqrt{5} - 2$$ 3단계: 두 인수의 곱을 합차공식을 이용하여 계산한다. $$(x - 1)(x - 5) = (\sqrt{5} + 2)(\sqrt{5} - 2) = (\sqrt{5})^2 - 2^2 = 5 - 4 = 1$$

(2) 완전제곱식을 이용한 풀이: 1단계: 다항식 $x^2 - 6x + 5$를 완전제곱식을 포함한 형태로 변형한다. $$x^2 - 6x + 5 = (x^2 - 6x + 9) - 4 = (x - 3)^2 - 4$$ 2단계: 주어진 조건 $x = 3 + \sqrt{5}$에서 근호만 남기도록 이항한다. $$x - 3 = \sqrt{5}$$ 3단계: $x - 3 = \sqrt{5}$를 변형된 식에 대입한다. $$(x - 3)^2 - 4 = (\sqrt{5})^2 - 4 = 5 - 4 = 1$$

따라서 (1), (2)의 결과는 모두 $1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
