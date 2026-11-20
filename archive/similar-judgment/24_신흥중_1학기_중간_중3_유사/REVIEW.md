# 검수 묶음 — 24_신흥중_1학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 25개 / 검사 PASS 23, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 24, SELF_CONTAINED 1
- 난이도 분포: 1단계 12, 2단계 12, 3단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q24**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q25**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(-6)^2$의 양의 제곱근을 $a$, $49$의 음의 제곱근을 $b$라 할 때, $a+b$의 값을 구하면? [4점]

**보기** ① $-1$  ② $1$  ③ $-13$  ④ $13$  ⑤ $0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(-6)^2 = 36$의 양의 제곱근은 $a = 6$이다.
2. $49$의 음의 제곱근은 $b = -7$이다.
3. 따라서 $a + b = 6 + (-7) = -1$이다. (정답 ①)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(-6)^2$의 양의 제곱근을 $a$, $49$의 음의 제곱근을 $b$라 할 때」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 뜻을 파악하고 값을 계산하는 제곱근의 뜻 유형이다. (문항 토큰 49)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ROOT_VALUE **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_CHECK → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT → TPL_M3_ROOT_PROPERTY_ROOT_VALUE**
- 이유: 제곱근의 정의와 성질을 이용해 양·음의 제곱근을 계산하는 유형이다. (문항 토큰 49)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 수치 제곱근을 구하여 합을 구하는 난이도 1 문항이다. (문항 토큰 49)

**4칸**
- given: 제곱근←stem:「$(-6)^2$의 양의 제곱근을 $a$, $49$의 음의 제곱근을 $b$라 할 때」
- goal: 제곱근←stem:「$a+b$의 값을 구하면?」
- method: 제곱근(NAMED)←solution:「제곱근의 정의에 따라 양의 제곱근과 음의 제곱근을 각각 구한다.」
- condition: 제곱근←solution:「따라서 정답은 ①이다.」

**how** 거듭제곱수의 값을 계산하고 제곱근 정의에 따라 양과 음의 제곱근을 각각 구했다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

거듭제곱수의 값을 먼저 계산한 후, 제곱근의 정의에 따라 양의 제곱근과 음의 제곱근을 각각 구한다.


1단계: $(-6)^2$의 양의 제곱근 $a$를 구한다. $$(-6)^2 = 36$$ $36$의 제곱근은 $\pm 6$이고, 양의 제곱근이므로 $$a = 6$$


2단계: $49$의 음의 제곱근 $b$를 구한다. $49$의 제곱근은 $\pm 7$이고, 음의 제곱근이므로 $$b = -7$$


3단계: $a+b$의 값을 계산한다. $$a + b = 6 + (-7) = -1$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중에서 옳은 것은? [4점]

**보기** ① $\sqrt{49}$는 $\pm 7$이다.  ② $81$의 양의 제곱근은 $9$이다.  ③ $\sqrt{16}$의 제곱근은 $\pm 4$이다.  ④ 양수 $b$의 제곱근은 $\sqrt{b}$이다.  ⑤ 음의 정수의 제곱근은 $1$개이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $81$의 양의 제곱근은 $9$이므로 ②는 참이다.
2. ① $\sqrt{49}=7$, ③ $\sqrt{16}=4$의 제곱근은 $\pm 2$, ④ $\pm\sqrt{b}$, ⑤ 음의 정수의 제곱근은 없다.
3. 따라서 옳은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 옳은 것은?」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 기본 개념과 근호의 기호적 의미를 다루는 제곱근의 뜻 유형이다. (문항 토큰 49)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT **원천→판정: PT_M3_SQUARE_ROOT_PROPERTY_AUDIT → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_TRUE_FALSE_SET → TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT**
- 이유: 제곱근의 정의와 표현에 대한 참·거짓을 명제별로 판정하는 유형이다. (문항 토큰 49)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 개념 지식을 직접 묻는 난이도 1 문항이다. (문항 토큰 49)

**4칸**
- given: 제곱근←stem:「다음 중에서 옳은 것은?」
- goal: 제곱근←stem:「다음 중에서 옳은 것은?」
- method: 제곱근(NAMED)←solution:「제곱근의 뜻과 근호 기호의 성질을 각 선지에 대조하여 판정한다.」
- condition: 제곱근←solution:「따라서 옳은 것은 ②이다. 따라서 정답은 ②이다.」

**how** 제곱근의 뜻과 근호 기호의 수학적 성질을 바탕으로 각 선지를 검토했다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 뜻과 근호 기호의 성질을 각 선지에 대조하여 판정한다.


1단계: 각 선지의 설명을 검토한다. ① 기호 $\sqrt{49}$는 $49$의 양의 제곱근만을 나타내므로 $\sqrt{49} = 7$이다. $\pm 7$이라 한 것은 거짓이다. ② $9^2 = 81$이고 $9 > 0$이므로 $81$의 양의 제곱근은 $9$이다. (참) ③ $\sqrt{16} = 4$이므로 '$\sqrt{16}$의 제곱근'은 '$4$의 제곱근'을 묻는 것이다. $4$의 제곱근은 $\pm 2$이므로 $\pm 4$라 한 것은 거짓이다. ④ 양수 $b$의 제곱근은 제곱하여 $b$가 되는 모든 수이므로 $\pm\sqrt{b}$의 $2$개이다. $\sqrt{b}$라 한 것은 거짓이다. ⑤ 음수의 제곱근은 실수 범위에서 존재하지 않는다($0$개이다). $1$개라 한 것은 거짓이다.


2단계: 결론을 도출한다. 따라서 옳은 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<보기>에서 옳은 것을 모두 고른 것은? [3점]


<보기> ㉠ $\sqrt{\left(-\dfrac{7}{3}\right)^2} = -\dfrac{7}{3}$ ㉡ $-\left(-\sqrt{\dfrac{1}{5}}\right)^2 = \dfrac{1}{5}$ ㉢ $\sqrt{(-17)^2} = 17$ ㉣ $(-\sqrt{15})^2 = 15$

**보기** ① ㉠, ㉢  ② ㉠, ㉣  ③ ㉢, ㉣  ④ ㉡, ㉢  ⑤ ㉡, ㉣

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㉠ $\sqrt{(-7/3)^2} = 7/3$ (거짓)
2. ㉡ $-(\sqrt{1/5})^2 = -1/5$ (거짓)
3. ㉢ $\sqrt{(-17)^2} = 17$ (참)
4. ㉣ $(-\sqrt{15})^2 = 15$ (참)
5. 따라서 옳은 것은 ㉢, ㉣로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「<보기>에서 옳은 것을 모두 고른 것은?」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 성질 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 근호식의 기본 성질을 검증하는 제곱근의 성질 유형이다. (문항 토큰 17)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ABSOLUTE **원천→판정: PT_M3_SQUARE_ROOT_PROPERTIES_EVAL → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_TRUE_FALSE_SET → TPL_M3_ROOT_PROPERTY_ABSOLUTE**
- 이유: 제곱근의 부호 처리와 절댓값 변환 성질을 판별하는 유형이다. (문항 토큰 17)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본적인 근호 계산 공식을 적용하는 난이도 1 문항이다. (문항 토큰 17)

**4칸**
- given: 제곱근←stem:「<보기>에서 옳은 것을 모두 고른 것은?」
- goal: 제곱근←stem:「옳은 것을 모두 고른 것은?」
- method: 제곱근(NAMED)←solution:「근호의 성질 $(\sqrt{a})^2 = a$, $\sqrt{a^2} = |a|$를 각 보기에 적용하여 참과 거짓을 판별한다.」
- condition: 제곱근←solution:「옳은 것은 ㉢, ㉣이다. 따라서 정답은 ③이다.」

**how** 근호 안 제곱과 근호 밖 제곱의 부호 처리 규칙을 적용해 참인 보기를 판정했다. (문항 토큰 17)

<details><summary>저장 해설 (판정 검토용)</summary>

근호의 성질 $(\sqrt{a})^2 = a$, $\sqrt{a^2} = |a|$를 각 보기에 적용하여 참과 거짓을 판별한다.


1단계: <보기>의 각 식을 검토한다.


* ㉠ $\sqrt{\left(-\dfrac{7}{3}\right)^2} = \left|-\dfrac{7}{3}\right| = \dfrac{7}{3}$이다. $-\dfrac{7}{3}$이라 하였으므로 거짓이다. * ㉡ 괄호 안의$\left(-\sqrt{\dfrac{1}{5}}\right)^2 = \dfrac{1}{5}$이므로, 앞에 마이너스가 붙은 식은 $-\dfrac{1}{5}$이다. $\dfrac{1}{5}$이라 하였으므로 거짓이다. * ㉢$\sqrt{(-17)^2} = |-17| = 17$이므로 참이다. * ㉣$(-\sqrt{15})^2 = (-\sqrt{15}) \times (-\sqrt{15}) = 15$이므로 참이다.


2단계: 옳은 것을 조합한다. 옳은 것은 ㉢, ㉣이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중에서 옳은 것은? [4점]

**보기** ① $\sqrt{12} > 4$  ② $\sqrt{0.2} < 0.4$  ③ $3+\sqrt{5} > 6$  ④ $-\sqrt{\dfrac{1}{3}} < -\dfrac{1}{2}$  ⑤ $-3+\sqrt{7} < -\sqrt{10}+\sqrt{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선지 ① $\sqrt{12} < 4$, ② $\sqrt{0.2} > 0.4$, ③ $3+\sqrt{5} < 6$, ⑤ $-3+\sqrt{7} > -\sqrt{10}+\sqrt{7}$이다.
2. ④ $1/3 > 1/4$이므로 $\sqrt{1/3} > 1/2$, 양변에 음수 곱하면 $-\sqrt{1/3} < -1/2$ (참)
3. 따라서 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 옳은 것은?」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 실수와 무리수의 대소 비교를 다루는 실수의 대소 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_REAL_NUMBER_INEQUALITY → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_RADICAL_ORDER_COMPARISON → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 제곱근을 포함한 실수의 대소 관계와 부등식 성질을 판단하는 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음수 근호식의 대소 비교를 요구하는 난이도 2 문항이다. (문항 토큰 12)

**4칸**
- given: 대소←stem:「다음 중에서 옳은 것은?」
- goal: 대소←stem:「다음 중에서 옳은 것은?」
- method: 부등식(NAMED)←solution:「제곱 또는 부등식의 성질을 적용하여 각 선지의 대소 관계를 판정한다.」
- condition: 무리수←solution:「따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.」

**how** 양변 제곱과 음수 부호에 따른 부등호 역전 성질을 이용해 대소를 판정했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

제곱 또는 부등식의 성질을 적용하여 각 선지의 대소 관계를 판정한다.


1단계: 각 선지의 대소를 검토한다. ① $(\sqrt{12})^2 = 12$이고 $4^2 = 16$이다. $12 < 16$이므로 $\sqrt{12} < 4$이다. (거짓) ② $(\sqrt{0.2})^2 = 0.2$이고 $0.4^2 = 0.16$이다. $0.2 > 0.16$이므로 $\sqrt{0.2} > 0.4$이다. (거짓) ③ $2 < \sqrt{5} < 3$이므로 $3+\sqrt{5} < 3+3 = 6$이다. (거짓) ④ $\dfrac{1}{3} > \dfrac{1}{4}$이므로 $\sqrt{\dfrac{1}{3}} > \sqrt{\dfrac{1}{4}} = \dfrac{1}{2}$이다. 양변에 $-1$을 곱하면 부등호 방향이 바뀌므로 $$-\sqrt{\dfrac{1}{3}} < -\dfrac{1}{2}$$ 따라서 참이다. (참) ⑤ 양변에서 $\sqrt{7}$을 빼면 $-3 < -\sqrt{10}$이 된다. 양변에 $-1$을 곱하면 $3 > \sqrt{10}$, 즉 $\sqrt{9} > \sqrt{10}$이 되어 모순이다. (거짓)


2단계: 결론을 도출한다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<보기>에서 무리수를 모두 고르면 몇 개인가? [3점]


<보기> $$0.\dot{7}, \quad -\sqrt{\dfrac{25}{3}}, \quad \sqrt{0.04}, \quad \sqrt{3}+2, \quad \pi^2, \quad \sqrt{8}, \quad \sqrt{1.6}$$

**보기** ① $1$개  ② $2$개  ③ $3$개  ④ $4$개  ⑤ $5$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 유리수: $0.\dot{7}=7/9$, $\sqrt{0.04}=0.2$, $\sqrt{25/4}=5/2$, $\sqrt{16/9}=4/3$, $3-\sqrt{9}=0$ (5개)
2. 무리수: $-\sqrt{25/3}$, $\sqrt{7}$, $\pi^2$, $\sqrt{8}$, $\sqrt{1.6}$ (5개)
3. 따라서 무리수는 모두 5개로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「<보기>에서 무리수를 모두 고르면 몇 개인가?」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 유리수와 무리수를 구별하는 무리수 판별 유형이다. (문항 토큰 25)
**유형** PT=PT_M3_REAL_NUMBER_CLASSIFICATION / TPL=TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT **원천→판정: PT_M3_IRRATIONAL_COUNT → PT_M3_REAL_NUMBER_CLASSIFICATION** **원천→판정: TPL_M3_REAL_NUMBER_CLASSIFICATION_SET → TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT**
- 이유: 유리수와 무리수의 정의를 적용해 주어진 수들을 분류하는 유형이다. (문항 토큰 25)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수의 분류를 정확히 수행하는 난이도 1 문항이다. (문항 토큰 25)

**4칸**
- given: 무리수←stem:「<보기>에서 무리수를 모두 고르면 몇 개인가?」
- goal: 무리수←stem:「무리수를 모두 고르면 몇 개인가?」
- method: 유리수(NAMED)←solution:「유리수와 무리수의 정의를 적용하여 각 수를 분류한다.」
- condition: 무리수←solution:「따라서 정답은 ⑤이다.」

**how** 순환소수와 제곱수 근호식을 판별하여 무리수의 개수를 세었다. (문항 토큰 25)

<details><summary>저장 해설 (판정 검토용)</summary>

유리수와 무리수의 정의를 적용하여 각 수를 분류한다.


1단계: <보기>의 각 수를 분류한다.


* $0.\dot{7} = \dfrac{7}{9}$(순환소수이므로 유리수) *$-\sqrt{\dfrac{25}{3}} = -\dfrac{5}{\sqrt{3}} = -\dfrac{5\sqrt{3}}{3}$(무리수) — [1개] *$\sqrt{0.04} = \sqrt{0.2^2} = 0.2$(유리수) *$\sqrt{3}+2$(무리수와 유리수의 합이므로 무리수) — [2개] *$\pi^2$(원주율의 제곱이므로 순환하지 않는 무한소수, 무리수) — [3개] *$\sqrt{8} = 2\sqrt{2}$(무리수) — [4개] *$\sqrt{1.6} = \sqrt{\dfrac{16}{10}} = \dfrac{4}{\sqrt{10}} = \dfrac{2\sqrt{10}}{5}$ (근호가 소거되지 않으므로 무리수) — [5개]


2단계: 무리수의 개수를 센다. 무리수는 $-\sqrt{\dfrac{25}{3}}, ; \sqrt{3}+2, ; \pi^2, ; \sqrt{8}, ; \sqrt{1.6}$의 $5$개이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림은 한 눈금의 길이가 $1$인 모눈종이에 두 선분 $\mathrm{AB}$와 $\mathrm{CD}$를 그린 후, $\overline{\mathrm{AB}}=\overline{\mathrm{AP}}$, $\overline{\mathrm{CD}}=\overline{\mathrm{CQ}}$가 되도록 수직선 위에 두 점 $\mathrm{P}$와 $\mathrm{Q}$를 정한 것이다. 다음 중 옳지 않은 것은? [4점]
A B C D P Q -2 -1 0 1 2 3 4 5 6

**보기** ① 점 $\mathrm{P}$가 나타내는 수는 $\sqrt{5}$이다.  ② $\overline{\mathrm{AB}} = \sqrt{5}$  ③ $\overline{\mathrm{CD}} = \sqrt{13}$  ④ $\overline{\mathrm{CP}} = 2 + \sqrt{5}$  ⑤ 점 $\mathrm{Q}$가 나타내는 수는 $2+\sqrt{13}$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 피타고라스 정리에 의해 $AB = \sqrt{2^2+1^2} = \sqrt{5}$이다.
2. $A(0)$에서 왼쪽으로 호를 그렸으므로 $P$의 좌표는 $-\sqrt{5}$이다.
3. 따라서 점 $P$가 나타내는 수가 $\sqrt{5}$라는 설명은 옳지 않다. (정답 ①)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 한 눈금의 길이가 $1$인 모눈종이에 두 선분

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 눈금의 길이가 $1$인 모눈종이에 두 선분 $\mathrm{AB}$와 $\mathrm{CD}$를 그린 후」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 수직선에 무리수를 작도하고 위치를 찾는 무리수의 위치 유형이다. (문항 토큰 AB)
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING **원천→판정: PT_M3_NUMBER_LINE_MAPPING → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_SQUARE_DIAGONAL_ROTATION → TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING**
- 이유: 피타고라스 정리와 원호 회전을 통해 수직선 위 무리수 좌표를 대응시키는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 좌표의 부호와 기준점 이동을 결합 판단하는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 수직선←stem:「한 눈금의 길이가 $1$인 모눈종이에 두 선분 $\mathrm{AB}$와 $\mathrm{CD}$를 그린 후」
- goal: 좌표←stem:「다음 중 옳지 않은 것은?」
- method: 직각삼각형(NAMED)←solution:「피타고라스 정리로 선분의 길이를 구하고, 수직선 기준점과 이동 방향에 따른 좌표를 구한다.」
- condition: 수직선←solution:「따라서 정답은 ①이다.」

**how** 직각삼각형의 빗변 길이를 구하고 기준점과 이동 방향에 따른 수직선 좌표를 확인했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리로 선분의 길이를 구하고, 수직선 기준점과 이동 방향에 따른 좌표를 구한다.


1단계: 선분 $AB$와 선분 $CD$의 길이를 구한다.


* $A(0)$이고 $B$는 $A$로부터 왼쪽으로 $2$칸, 위로 $1$칸 이동한 점이므로 $$\overline{AB} = \sqrt{2^2 + 1^2} = \sqrt{5}$$
* $C(2)$이고 $D$는 $C$로부터 오른쪽으로 $3$칸, 위로 $2$칸 이동한 점이므로 $$\overline{CD} = \sqrt{3^2 + 2^2} = \sqrt{9 + 4} = \sqrt{13}$$


2단계: 두 점 $P, Q$의 좌표와 선분 $CP$의 길이를 구한다.


* 점 $P$는 점 $A(0)$을 중심으로 왼쪽으로 내린 점이므로 $$P = 0 - \sqrt{5} = -\sqrt{5}$$ 따라서 점 $P$가 나타내는 수는 $-\sqrt{5}$이다. 보기 ①의 $\sqrt{5}$라는 설명은 옳지 않다. * 점$Q$는 점 $C(2)$를 중심으로 오른쪽으로 내린 점이므로 $$Q = 2 + \sqrt{13}$$
* 선분 $CP$의 길이는 $C(2)$에서 $P(-\sqrt{5})$를 뺀 것이므로 $$\overline{CP} = 2 - (-\sqrt{5}) = 2 + \sqrt{5}$$


3단계: 결론을 도출한다. 따라서 옳지 않은 것은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

$\mathrm{A, B}$ 두 개의 주사위를 동시에 던져 나오는 눈의 수를 각각 $a, b$라 할 때, $\sqrt{12ab}$ 가 자연수가 될 확률은? [5점]

**보기** ① $\dfrac{1}{12}$  ② $\dfrac{1}{6}$  ③ $\dfrac{1}{4}$  ④ $\dfrac{1}{3}$  ⑤ $\dfrac{1}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{12ab} = \sqrt{2^2 \times 3ab} = 2\sqrt{3ab}$가 자연수가 되려면 $ab = 3k^2$이어야 한다.
2. 주사위 눈의 곱 $ab$ 중 가능한 값: $3 \times 1^2 = 3$, $3 \times 2^2 = 12$
3. $ab=3$: $(1, 3), (3, 1)$ (2가지), $ab=12$: $(2, 6), (3, 4), (4, 3), (6, 2)$ (4가지)
4. 총 경우의 수는 6가지이므로 확률은 $6/36 = 1/6$이다. (정답 ②)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「$\mathrm{A, B}$ 두 개의 주사위를 동시에 던져 나오는 눈의 수를 각각 $a, b$라 할 때, $\sqrt{12ab}$ 가 자연수가 될 확률은?」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근이 자연수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 근호 안의 식이 제곱수가 되는 성질을 다루는 제곱근의 성질 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_RADICAL_DICE_PROBABILITY → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_CONDITION_PROBABILITY → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 제곱수가 되는 조건과 확률론적 순서쌍 세기를 융합한 유형이다. (문항 토큰 12)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 소인수분해 조건과 주사위 곱 순서쌍을 빠짐없이 세어야 하는 난이도 3 문항이다. (문항 토큰 12)

**4칸**
- given: 자연수←stem:「$\mathrm{A, B}$ 두 개의 주사위를 동시에 던져 나오는 눈의 수를 각각 $a, b$라 할 때, $\sqrt{12ab}$ 가 자연수가 될 확률은?」
- goal: 자연수←stem:「$\sqrt{12ab}$ 가 자연수가 될 확률은?」
- method: 제곱근(NAMED)←solution:「근호 안의 식을 소인수분해하여 자연수가 될 조건을 찾고, 주사위 눈의 순서쌍을 조사하여 확률을 구한다.」
- condition: 자연수←solution:「따라서 정답은 ②이다.」

**how** 근호식이 자연수가 되는 소인수 조건을 분석하고 주사위 곱 순서쌍으로 확률을 계산했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 식을 소인수분해하여 자연수가 될 조건을 찾고, 주사위 눈의 순서쌍을 조사하여 확률을 구한다.


1단계: $\sqrt{12ab}$가 자연수가 될 조건을 구한다. $$12 = 2^2 \times 3 \implies \sqrt{12ab} = \sqrt{2^2 \times 3ab} = 2\sqrt{3ab}$$ 이 값이 자연수가 되려면 $3ab$가 완전제곱수이어야 하므로 $$ab = 3 \times k^2 \quad (k\text{는 자연수})$$ 주사위 눈 $a, b$에 대하여 $1 \le a \le 6, 1 \le b \le 6$이므로 $$1 \le ab \le 36$$


2단계: 가능한 $k$에 따른 순서쌍 $(a, b)$를 구한다.


* $k = 1$일 때: $ab = 3 \times 1^2 = 3$ 순서쌍: $(1, 3), (3, 1)$ ($2$가지) *$k = 2$일 때: $ab = 3 \times 2^2 = 12$ 순서쌍: $(2, 6), (3, 4), (4, 3), (6, 2)$ ($4$가지) *$k = 3$일 때: $ab = 3 \times 3^2 = 27$ $27$의 약수 중 주사위 눈($1 \sim 6$)으로 가능한 쌍은 없다. *$k \ge 4$일 때: $ab \ge 3 \times 16 = 48 > 36$이므로 불가능하다.


따라서 조건을 만족시키는 순서쌍 $(a, b)$는 총 $$2 + 4 = 6\text{가지}$$ 이다.


3단계: 확률을 계산한다. 모든 경우의 수는 $6 \times 6 = 36$가지이므로 $$\text{확률} = \dfrac{6}{36} = \dfrac{1}{6}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 계산 결과가 옳은 것은? [4점]

**보기** ① $4\sqrt{2} \times \sqrt{6} = 4\sqrt{8}$  ② $\sqrt{\dfrac{15}{2}} \times \sqrt{\dfrac{2}{5}} = 3$  ③ $\sqrt{3} \times \sqrt{12} \div \dfrac{\sqrt{7}}{\sqrt{3}} = \dfrac{6\sqrt{21}}{7}$  ④ $\sqrt{42} \div 2\sqrt{7} = 2\sqrt{6}$  ⑤ $3\sqrt{8} \div \sqrt{2} = 3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ③ $\sqrt{3} \times \sqrt{12} \div (\sqrt{7}/\sqrt{3}) = 6 \times (\sqrt{3}/\sqrt{7}) = 6\sqrt{3}/\sqrt{7} = 6\sqrt{21}/7$ (참)
2. 따라서 옳은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 계산 결과가 옳은 것은?」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호의 곱셈과 나눗셈을 처리하는 근호의 곱 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_CALCULATION_AUDIT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_ARITHMETIC_ERROR_FINDING → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호를 포함한 사칙연산의 혼합 계산 결과를 참·거짓으로 판별하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사칙연산 복합 단계를 점검하는 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 유리화←stem:「다음 중 계산 결과가 옳은 것은?」
- goal: 유리화←stem:「다음 중 계산 결과가 옳은 것은?」
- method: 유리화(NAMED)←solution:「근호의 곱셈, 나눗셈 및 유리화를 각 선지에 적용하여 계산한다.」
- condition: 유리화←solution:「따라서 정답은 ③이다.」

**how** 근호식의 곱셈과 나눗셈을 역수 곱으로 바꾸고 유리화하여 계산 결과를 검증했다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

근호의 곱셈, 나눗셈 및 유리화를 각 선지에 적용하여 계산한다.


1단계: 각 선지의 계산을 검토한다. ① $4\sqrt{2} \times \sqrt{6} = 4\sqrt{12} = 4(2\sqrt{3}) = 8\sqrt{3} \ne 4\sqrt{8}$이다. (거짓) ② $\sqrt{\dfrac{15}{2}} \times \sqrt{\dfrac{2}{5}} = \sqrt{\dfrac{15}{2} \times \dfrac{2}{5}} = \sqrt{3} \ne 3$이다. (거짓) ③ $\sqrt{3} \times \sqrt{12} = \sqrt{36} = 6$이다. $$6 \div \dfrac{\sqrt{7}}{\sqrt{3}} = 6 \times \dfrac{\sqrt{3}}{\sqrt{7}} = \dfrac{6\sqrt{3}}{\sqrt{7}} = \dfrac{6\sqrt{21}}{7}$$ 따라서 옳다. (참) ④ $\sqrt{42} \div 2\sqrt{7} = \dfrac{\sqrt{42}}{2\sqrt{7}} = \dfrac{\sqrt{6}}{2} \ne 2\sqrt{6}$이다. (거짓) ⑤ $3\sqrt{8} \div \sqrt{2} = 3\sqrt{\dfrac{8}{2}} = 3\sqrt{4} = 3 \times 2 = 6 \ne 3$이다. (거짓)


2단계: 결론을 도출한다. 따라서 옳은 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{2} = a, \quad \sqrt{5} = b$라 할 때, $\sqrt{7}$을 $a, b$를 사용하여 바르게 나타낸 것은? [4점]

**보기** ① $a+b$  ② $a^2+b^2$  ③ $\sqrt{a+b}$  ④ $\sqrt{a^2+b^2}$  ⑤ $\sqrt{ab}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $a = \sqrt{2} \implies a^2 = 2$
2. $b = \sqrt{5} \implies b^2 = 5$
3. $a^2 + b^2 = 2 + 5 = 7$이므로 $\sqrt{7} = \sqrt{a^2 + b^2}$이다. (선지 ⑤의 $\sqrt{ab}$와 구별)
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{2} = a, \quad \sqrt{5} = b$라 할 때」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호 안의 수치를 대수적 문자로 치환 표현하는 근호의 곱 유형이다. (문항 토큰 ab)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_LETTER_REPRESENTATION **원천→판정: PT_M3_RADICAL_VARIABLE_EXPRESSION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_TO_ALGEBRAIC_FORM → TPL_M3_RADICAL_LETTER_REPRESENTATION**
- 이유: 제곱근 값을 문자로 치환하여 다른 근호식을 대수적으로 표현하는 유형이다. (문항 토큰 ab)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문자의 제곱합 꼴을 파악해야 하는 난이도 2 문항이다. (문항 토큰 ab)

**4칸**
- given: 제곱근←stem:「$\sqrt{2} = a, \quad \sqrt{5} = b$라 할 때」
- goal: 제곱근←stem:「$\sqrt{7}$을 $a, b$를 사용하여 바르게 나타낸 것은?」
- method: 제곱근(NAMED)←solution:「주어진 근호를 각각 제곱하여 근호 안의 수를 문자의 이차식으로 표현한다.」
- condition: 제곱근←solution:「따라서 정답은 ④이다.」

**how** 주어진 문자 근호를 제곱하여 근호 안의 수를 문자의 합으로 치환했다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 근호를 각각 제곱하여 근호 안의 수를 문자의 이차식으로 표현한다.


1단계: $a, b$의 제곱의 합을 구한다. $$a = \sqrt{2} \implies a^2 = 2$$ $$b = \sqrt{5} \implies b^2 = 5$$ 두 식을 더하면 $$a^2 + b^2 = 2 + 5 = 7$$


2단계: $\sqrt{7}$에 대입한다. $$7 = a^2 + b^2$$ 이므로 양변에 제곱근을 취하면 $$\sqrt{7} = \sqrt{a^2 + b^2}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 분모를 유리화한 것으로 옳지 않은 것은? [4점]

**보기** ① $\dfrac{3}{\sqrt{7}} = \dfrac{3\sqrt{7}}{7}$  ② $\dfrac{3}{2\sqrt{5}} = \dfrac{3\sqrt{5}}{10}$  ③ $\dfrac{2}{\sqrt{12}} = \dfrac{\sqrt{3}}{3}$  ④ $\dfrac{1}{\sqrt{3}+1} = \dfrac{\sqrt{3}-1}{2}$  ⑤ $\dfrac{3}{2-\sqrt{3}} = 2+\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선지 ③ $\dfrac{2}{\sqrt{12}} = \dfrac{\sqrt{3}}{3}$는 옳다.
2. ⑤ $\dfrac{3}{2-\sqrt{3}} = \dfrac{3(2+\sqrt{3})}{(2-\sqrt{3})(2+\sqrt{3})} = 3(2+\sqrt{3}) = 6+3\sqrt{3}$이다.
3. 선지 ⑤는 $2+\sqrt{3}$이라 하였으므로 옳지 않다.
4. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 분모를 유리화한 것으로 옳지 않은 것은?」
**RPM** M3-RPM-011 [실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 한 항의 유리화] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 한 항의 유리화**
- 이유: 분모의 유리화 공식을 직접 적용하는 한 항의 유리화 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONALIZATION **원천→판정: PT_M3_RATIONALIZATION_AUDIT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_FRACTION_RATIONALIZE_CHECK_SET → TPL_M3_RADICAL_RATIONALIZATION**
- 이유: 분모의 유리화 공식을 직접 적용하여 계산 결과를 판정하는 유형이다. (문항 토큰 10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단순 분모 유리화 규칙을 적용하는 난이도 1 문항이다. (문항 토큰 10)

**4칸**
- given: 유리화←stem:「다음 중 분모를 유리화한 것으로 옳지 않은 것은?」
- goal: 유리화←stem:「분모를 유리화한 것으로 옳지 않은 것은?」
- method: 유리화(NAMED)←solution:「단항 및 다항식 분모의 유리화 공식을 각 선지에 적용하여 결과를 대조한다.」
- condition: 유리화←solution:「따라서 옳지 않은 것은 ⑤이다. 따라서 정답은 ⑤이다.」

**how** 단항 및 다항식 분모의 유리화 공식을 적용하여 선지 결과를 대조했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

단항 및 다항식 분모의 유리화 공식을 각 선지에 적용하여 결과를 대조한다.


1단계: 각 선지의 분모 유리화를 검토한다. ① $\dfrac{3}{\sqrt{7}} = \dfrac{3\sqrt{7}}{7}$ (옳다) ② $\dfrac{3}{2\sqrt{5}} = \dfrac{3\sqrt{5}}{2 \times 5} = \dfrac{3\sqrt{5}}{10}$ (옳다) ③ $\dfrac{2}{\sqrt{12}} = \dfrac{2}{2\sqrt{3}} = \dfrac{1}{\sqrt{3}} = \dfrac{\sqrt{3}}{3}$ (옳다) ④ $\dfrac{1}{\sqrt{3}+1} = \dfrac{\sqrt{3}-1}{(\sqrt{3}+1)(\sqrt{3}-1)} = \dfrac{\sqrt{3}-1}{3-1} = \dfrac{\sqrt{3}-1}{2}$ (옳다) ⑤ $\dfrac{3}{2-\sqrt{3}} = \dfrac{3(2+\sqrt{3})}{(2-\sqrt{3})(2+\sqrt{3})} = \dfrac{3(2+\sqrt{3})}{4-3} = 3(2+\sqrt{3}) = 6+3\sqrt{3}$이다. 선지에 제시된 $2+\sqrt{3}$은 분자의 $3$이 누락되었으므로 옳지 않다.


2단계: 결론을 도출한다. 따라서 옳지 않은 것은 ⑤이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{32} - 2\sqrt{18} - \sqrt{2}\left(3 - \dfrac{6}{\sqrt{12}}\right) = a\sqrt{2} + b\sqrt{6}$ 이 성립할 때, 유리수 $a, b$에 대하여 $a+b$의 값은? [4점]

**보기** ① $-4$  ② $-2$  ③ $0$  ④ $2$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{32} = 4\sqrt{2}, 2\sqrt{18} = 6\sqrt{2}, 6/\sqrt{12} = \sqrt{3}$이다.
2. 식 $= 4\sqrt{2} - 6\sqrt{2} - (3\sqrt{2} - \sqrt{6}) = -5\sqrt{2} + \sqrt{6}$이다.
3. $a = -5, b = 1$이므로 $a + b = -5 + 1 = -4$이다.
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「이 성립할 때, 유리수 $a, b$에 대하여 $a+b$의 값은?」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 동류근호를 묶어 사칙연산을 정리하는 동류근호 유형이다. (문항 토큰 32)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_COEFFICIENT_MATCH → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_EXPRESSION_COEFFICIENT_SUM → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 동류근호 덧셈·뺄셈과 곱셈 혼합 계산을 통해 미정계수를 결정하는 유형이다. (문항 토큰 32)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 복수의 근호 정리와 동류항 계산을 포함한 난이도 2 문항이다. (문항 토큰 32)

**4칸**
- given: 유리수←stem:「이 성립할 때, 유리수 $a, b$에 대하여 $a+b$의 값은?」
- goal: 유리수←stem:「$a+b$의 값은?」
- method: 유리화(NAMED)←solution:「근호 안의 제곱인수를 꺼내고 분배법칙과 분모의 유리화를 적용하여 동류근호 계수를 구한다.」
- condition: 유리수←solution:「따라서 정답은 ①이다.」

**how** 근호 안의 제곱인수를 꺼내고 분배법칙과 분모 유리화로 동류근호를 정리했다. (문항 토큰 32)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 제곱인수를 꺼내고 분배법칙과 분모의 유리화를 적용하여 동류근호 계수를 구한다.


1단계: 각 항을 간단히 정리한다.


* $\sqrt{32} = \sqrt{16 \times 2} = 4\sqrt{2}$
* $2\sqrt{18} = 2(3\sqrt{2}) = 6\sqrt{2}$
* 괄호 안의 유리화: $$\dfrac{6}{\sqrt{12}} = \dfrac{6}{2\sqrt{3}} = \dfrac{3}{\sqrt{3}} = \sqrt{3}$$


2단계: 분배법칙으로 전개한다. $$\sqrt{2}\left(3 - \dfrac{6}{\sqrt{12}}\right) = \sqrt{2}(3 - \sqrt{3}) = 3\sqrt{2} - \sqrt{6}$$


3단계: 식 전체를 결합하여 정리한다. $$\sqrt{32} - 2\sqrt{18} - \sqrt{2}\left(3 - \dfrac{6}{\sqrt{12}}\right) = 4\sqrt{2} - 6\sqrt{2} - (3\sqrt{2} - \sqrt{6})$$ $$= 4\sqrt{2} - 6\sqrt{2} - 3\sqrt{2} + \sqrt{6} = -5\sqrt{2} + \sqrt{6}$$


4단계: $a, b$의 값과 합을 구한다. $$a = -5, \quad b = 1$$ $$a + b = -5 + 1 = -4$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(x+1)^2 + (x-1)(2x+3)$ 의 전개식에서 $x^2$의 계수를 $a$, $x$의 계수를 $b$, 상수항을 $c$라 할 때, $a - b + c$의 값은? [4점]

**보기** ① $-4$  ② $-2$  ③ $0$  ④ $2$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x+1)^2 = x^2 + 2x + 1$, $(x-1)(2x+3) = 2x^2 + x - 3$
2. 두 식의 합은 $3x^2 + 3x - 2$이다. ($a = 3, b = 3, c = -2$)
3. $a - b + c = 3 - 3 + (-2) = -2$이다. (정답 ②)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x+1)^2 + (x-1)(2x+3)$ 의 전개식에서 $x^2$의 계수를 $a$, $x$의 계수를 $b$, 상수항을 $c$라 할 때」
**RPM** M3-RPM-017 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 다항식의 곱셈 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱**
- 이유: 두 일차식의 곱과 합의 제곱 전개를 다루는 두 일차식의 곱 유형이다. (문항 토큰 x)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_POLY_EXPANSION_COEFFICIENT **원천→판정: PT_M3_POLYNOMIAL_EXPANSION_COEFFICIENTS → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_POLYNOMIAL_EXPANSION_ALGEBRAIC_SUM → TPL_M3_POLY_EXPANSION_COEFFICIENT**
- 이유: 다항식 곱셈공식 전개식에서 특정 차수 항의 계수를 구하는 유형이다. (문항 토큰 x)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 곱셈공식 전개 및 계수 비교를 수행하는 난이도 1 문항이다. (문항 토큰 x)

**4칸**
- given: 계수←stem:「$(x+1)^2 + (x-1)(2x+3)$ 의 전개식에서 $x^2$의 계수를 $a$, $x$의 계수를 $b$, 상수항을 $c$라 할 때」
- goal: 계수←stem:「$a - b + c$의 값은?」
- method: 곱셈공식(NAMED)←solution:「두 식을 각각 곱셈 공식으로 전개하여 동류항끼리 합산한 후 계수를 비교한다.」
- condition: 계수←solution:「따라서 정답은 ②이다.」

**how** 두 식을 각각 곱셈 공식으로 전개하여 동류항끼리 합산한 후 계수를 비교했다. (문항 토큰 x)

<details><summary>저장 해설 (판정 검토용)</summary>

두 식을 각각 곱셈 공식으로 전개하여 동류항끼리 합산한 후 계수를 비교한다.


1단계: 두 다항식을 전개한다.


* $(x+1)^2 = x^2 + 2x + 1$
* $(x-1)(2x+3) = 2x^2 + 3x - 2x - 3 = 2x^2 + x - 3$


2단계: 두 전개식을 더하여 내림차순으로 정리한다. $$(x^2 + 2x + 1) + (2x^2 + x - 3) = (1 + 2)x^2 + (2 + 1)x + (1 - 3) = 3x^2 + 3x - 2$$


3단계: $a, b, c$의 값을 구한다. $$a = 3, \quad b = 3, \quad c = -2$$


4단계: $a - b + c$의 값을 계산한다. $$a - b + c = 3 - 3 + (-2) = -2$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x+y = 6, \quad xy = 4$ 일 때, $x^2 + y^2$의 값은? [4점]

**보기** ① $20$  ② $24$  ③ $28$  ④ $32$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 곱셈공식 변형에 의해 $x^2 + y^2 = (x+y)^2 - 2xy$이다.
2. $x+y = 6, xy = 4$를 대입하면 $x^2 + y^2 = 6^2 - 2(4) = 36 - 8 = 28$이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x+y = 6, \quad xy = 4$ 일 때」
**RPM** M3-RPM-019 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식의 변형 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값**
- 이유: 곱셈공식을 변형하여 식의 값을 계산하는 식의 값 유형이다. (문항 토큰 xy)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_SUM_PRODUCT **원천→판정: PT_M3_SUM_OF_SQUARES_EVAL → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_SYMMETRIC_SUM_PRODUCT_EVAL → TPL_M3_MULTIPLICATION_SUM_PRODUCT**
- 이유: 합과 곱이 주어졌을 때 곱셈공식 변형을 활용해 식의 값을 구하는 유형이다. (문항 토큰 xy)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전형적인 곱셈공식 변형 대입 난이도 1 문항이다. (문항 토큰 xy)

**4칸**
- given: 곱셈공식←stem:「$x+y = 6, \quad xy = 4$ 일 때」
- goal: 곱셈공식←stem:「$x^2 + y^2$의 값은?」
- method: 곱셈공식(NAMED)←solution:「곱셈 공식의 변형을 이용하여 두 수의 제곱의 합을 구한다.」
- condition: 곱셈공식←solution:「따라서 정답은 ③이다.」

**how** 곱셈 공식의 변형을 이용하여 두 수의 제곱의 합을 구했다. (문항 토큰 xy)

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈 공식의 변형을 이용하여 두 수의 제곱의 합을 구한다.


1단계: 곱셈 공식 변형식을 적용한다. $$(x + y)^2 = x^2 + 2xy + y^2 \implies x^2 + y^2 = (x + y)^2 - 2xy$$


2단계: 주어진 값을 대입하여 계산한다. $x+y = 6, xy = 4$이므로 $$x^2 + y^2 = 6^2 - 2(4) = 36 - 8 = 28$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(\sqrt{3}-a\sqrt{2})(\sqrt{3}-2\sqrt{2})$ 가 유리수가 되도록 하는 유리수 $a$의 값은? [5점]

**보기** ① $-5$  ② $-4$  ③ $-3$  ④ $-2$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(\sqrt{3}-a\sqrt{2})(\sqrt{3}-2\sqrt{2}) = (3+4a) - (a+2)\sqrt{6}$
2. 전체 식의 값이 유리수가 되려면 무리수 $\sqrt{6}$의 계수 $-(a+2) = 0$이어야 한다.
3. 따라서 $a = -2$이다. (정답 ④)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(\sqrt{3}-a\sqrt{2})(\sqrt{3}-2\sqrt{2})$ 가 유리수가 되도록 하는 유리수 $a$의 값은?」
**RPM** M3-RPM-014 [실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값**
- 이유: 무리수 혼합 전개에서 식의 유리수 조건을 찾는 식의 값 유형이다. (문항 토큰 3)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONAL_CONDITION **원천→판정: PT_M3_RATIONAL_PRODUCT_CONDITION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_BINOMIAL_RADICAL_PRODUCT_RATIONAL_UNKNOWN → TPL_M3_RADICAL_RATIONAL_CONDITION**
- 이유: 무리수식의 전개 결과가 유리수가 되도록 하는 미정계수 결정 유형이다. (문항 토큰 3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전개 후 무리수 부분 계수 소거 조건을 세우는 난이도 2 문항이다. (문항 토큰 3)

**4칸**
- given: 유리수←stem:「$(\sqrt{3}-a\sqrt{2})(\sqrt{3}-2\sqrt{2})$ 가 유리수가 되도록 하는 유리수 $a$의 값은?」
- goal: 유리수←stem:「유리수 $a$의 값은?」
- method: 유리수(NAMED)←solution:「식을 분배법칙으로 전개하여 유리수 부분과 무리수 $\sqrt{6}$의 부분으로 나눈 후, 무리수의 계수가 $0$이 되는 조건을 적용한다.」
- condition: 유리수←solution:「따라서 정답은 ④이다.」

**how** 식을 분배법칙으로 전개하여 무리수 앞의 계수가 0이 되는 조건을 적용했다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

식을 분배법칙으로 전개하여 유리수 부분과 무리수 $\sqrt{6}$의 부분으로 나눈 후, 무리수의 계수가 $0$이 되는 조건을 적용한다.


1단계: 주어진 곱을 전개한다. $$(\sqrt{3} - a\sqrt{2})(\sqrt{3} - 2\sqrt{2}) = (\sqrt{3})^2 - 2\sqrt{6} - a\sqrt{6} + 2a(\sqrt{2})^2$$ $$= 3 - (a + 2)\sqrt{6} + 4a$$


2단계: 유리수 부분과 무리수 부분으로 정리한다. $$= (3 + 4a) - (a + 2)\sqrt{6}$$


3단계: 전체 식의 값이 유리수가 될 조건을 세운다. $a$가 유리수이므로 $3+4a$도 유리수이다. 전체 식이 유리수가 되려면 무리수 $\sqrt{6}$의 계수가 $0$이어야 한다. $$-(a + 2) = 0 \implies a + 2 = 0 \implies a = -2$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$3003 \times 2997$ 을 계산하는 데 이용되는 가장 편리한 곱셈 공식은? [4점]

**보기** ① $(a+b)^2 = a^2 + 2ab + b^2$  ② $(a-b)^2 = a^2 - 2ab + b^2$  ③ $(x+a)(x+b) = x^2 + (a+b)x + ab$  ④ $(ax+b)(cx+d) = acx^2 + (ad+bc)x + bd$  ⑤ $(a+b)(a-b) = a^2 - b^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $3003 = 3000 + 3$, $2997 = 3000 - 3$이다.
2. $3003 \times 2997 = (3000+3)(3000-3) = 3000^2 - 3^2$
3. 따라서 가장 편리하게 이용되는 곱셈공식은 ⑤ $(a+b)(a-b) = a^2 - b^2$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3003 \times 2997$ 을 계산하는 데 이용되는 가장 편리한 곱셈 공식은?」
**RPM** M3-RPM-018 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식을 이용한 수의 계산 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산**
- 이유: 곱셈공식을 이용한 수의 계산에 적합한 공식을 결정하는 수의 계산 유형이다. (문항 토큰 3003)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT **원천→판정: PT_M3_FORMULA_SELECTION_NUMERICAL → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_ARITHMETIC_EXPANSION_CHOICE → TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT**
- 이유: 수의 계산에 가장 효율적인 곱셈공식을 선택하고 판단하는 유형이다. (문항 토큰 3003)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수치 구조를 보고 알맞은 공식을 식별하는 난이도 1 문항이다. (문항 토큰 3003)

**4칸**
- given: 곱셈공식←stem:「$3003 \times 2997$ 을 계산하는 데 이용되는 가장 편리한 곱셈 공식은?」
- goal: 곱셈공식←stem:「가장 편리한 곱셈 공식은?」
- method: 곱셈공식(NAMED)←solution:「두 수가 대칭 기준수 $3000$으로부터 일정한 거리만큼 떨어져 있음을 이용하여 적용할 공식을 판별한다.」
- condition: 곱셈공식←solution:「따라서 정답은 ⑤이다.」

**how** 기준수 3000으로부터 대칭 거리인 점을 활용해 합차 공식을 선택했다. (문항 토큰 3003)

<details><summary>저장 해설 (판정 검토용)</summary>

두 수가 대칭 기준수 $3000$으로부터 일정한 거리만큼 떨어져 있음을 이용하여 적용할 공식을 판별한다.


1단계: 두 수를 기준수 $3000$을 이용하여 나타낸다. $$3003 = 3000 + 3, \quad 2997 = 3000 - 3$$ 따라서 구하는 식은 다음과 같다. $$3003 \times 2997 = (3000 + 3)(3000 - 3)$$


2단계: 적용되는 곱셈 공식을 찾는다. 합과 차의 곱 꼴이므로 $$(a+b)(a-b) = a^2 - b^2$$ 공식을 이용하면 $3000^2 - 3^2 = 9000000 - 9 = 8999991$로 가장 편리하게 계산할 수 있다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 식에서 $\square$ 안에 알맞은 수는? [4점] $$(x-1)(x+1)(x^2+1)(x^4+1)(x^8+1) = x^{\square} - 1$$

**보기** ① $16$  ② $14$  ③ $12$  ④ $10$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x-1)(x+1) = x^2 - 1$
2. $(x^2-1)(x^2+1) = x^4 - 1$
3. $(x^4-1)(x^4+1) = x^8 - 1$
4. $(x^8-1)(x^8+1) = x^{16} - 1$
5. 따라서 $\square = 16$이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x-1)(x+1)(x^2+1)(x^4+1)(x^8+1) = x^{\square} - 1$」
**RPM** M3-RPM-016 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합과 차의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합과 차의 곱**
- 이유: 합과 차의 곱을 연속 적용하는 곱셈공식 유형이다. (문항 토큰 16)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_CHAIN **원천→판정: PT_M3_CHAINED_DIFFERENCE_OF_SQUARES → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_REPEATED_SUM_DIFF_POWER_EXPANSION → TPL_M3_MULTIPLICATION_CHAIN**
- 이유: 합차 공식을 연쇄적으로 적용하여 최고차항의 지수를 결정하는 유형이다. (문항 토큰 16)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 연쇄적 합차 공식 전개 단계를 거쳐 지수를 구하는 난이도 2 문항이다. (문항 토큰 16)

**4칸**
- given: 합차공식←stem:「$(x-1)(x+1)(x^2+1)(x^4+1)(x^8+1) = x^{\square} - 1$」
- goal: 합차공식←stem:「$\square$ 안에 알맞은 수는?」
- method: 합차공식(NAMED)←solution:「합차 공식을 단계별로 반복 적용하여 최고차항의 지수를 연쇄적으로 확장한다.」
- condition: 합차공식←solution:「따라서 정답은 ①이다.」

**how** 합차 공식을 연속적으로 적용하여 최고차항의 지수를 연쇄적으로 확장했다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

합차 공식을 단계별로 반복 적용하여 최고차항의 지수를 연쇄적으로 확장한다.


1단계: 앞의 두 인수를 곱한다. $$(x - 1)(x + 1) = x^2 - 1$$


2단계: 다음 인수 $(x^2+1)$을 곱한다. $$(x^2 - 1)(x^2 + 1) = (x^2)^2 - 1 = x^4 - 1$$


3단계: 다음 인수 $(x^4+1)$을 곱한다. $$(x^4 - 1)(x^4 + 1) = (x^4)^2 - 1 = x^8 - 1$$


4단계: 마지막 인수 $(x^8+1)$을 곱한다. $$(x^8 - 1)(x^8 + 1) = (x^8)^2 - 1 = x^{16} - 1$$


따라서 $\square = 16$이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 $x-3$을 인수로 갖지 않는 것은? [3점]

**보기** ① $x^2 - 3x$  ② $x^2 + 6x + 9$  ③ $x^2 - 9$  ④ $x^2y - 3xy$  ⑤ $2x^2 - 18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① $x^2 - 3x = x(x-3)$
2. ② $x^2 + 6x + 9 = (x+3)^2$ ($x-3$을 인수로 갖지 않는다)
3. ③ $x^2 - 9 = (x+3)(x-3)$
4. ④ $x^2y - 3xy = xy(x-3)$
5. ⑤ $2x^2 - 18 = 2(x^2-9) = 2(x+3)(x-3)$
6. 따라서 $x-3$을 인수로 갖지 않는 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $x-3$을 인수로 갖지 않는 것은?」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 뜻 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 이차식 인수분해를 통해 인수를 판별하는 인수분해 공식 유형이다. (문항 토큰 xy)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_FACTOR_IDENTIFY **원천→판정: PT_M3_FACTOR_INCLUSION_CHECK → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_LINEAR_FACTOR_MEMBERSHIP_AUDIT → TPL_M3_FACTORIZATION_FACTOR_IDENTIFY**
- 이유: 각 다항식을 인수분해하여 지정된 인수의 포함 여부를 확인하는 유형이다. (문항 토큰 xy)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 다항식 인수분해를 각각 확인하는 난이도 1 문항이다. (문항 토큰 xy)

**4칸**
- given: 인수←stem:「다음 중 $x-3$을 인수로 갖지 않는 것은?」
- goal: 인수←stem:「$x-3$을 인수로 갖지 않는 것은?」
- method: 인수분해(NAMED)←solution:「각 선지의 다항식을 인수분해하여 일차식 $x-3$이 인수로 포함되어 있는지 검토한다.」
- condition: 인수←solution:「따라서 정답은 ②이다.」

**how** 선지의 각 다항식을 인수분해하여 일차식 x-3의 포함 여부를 확인했다. (문항 토큰 xy)

<details><summary>저장 해설 (판정 검토용)</summary>

각 선지의 다항식을 인수분해하여 일차식 $x-3$이 인수로 포함되어 있는지 검토한다.


1단계: 각 선지를 인수분해한다. ① $x^2 - 3x = x(x - 3)$ ($x-3$을 인수로 갖는다.) ② $x^2 + 6x + 9 = (x + 3)^2$ ($x-3$이 아닌 $x+3$을 인수로 갖는다.) ③ $x^2 - 9 = (x - 3)(x + 3)$ ($x-3$을 인수로 갖는다.) ④ $x^2y - 3xy = xy(x - 3)$ ($x-3$을 인수로 갖는다.) ⑤ $2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)$ ($x-3$을 인수로 갖는다.)


2단계: 결론을 도출한다. 따라서 $x-3$을 인수로 갖지 않는 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$2 < x < 5$ 일 때, $\sqrt{x^2 - 10x + 25} - \sqrt{x^2 - 4x + 4}$ 를 간단히 하면? [5점]

**보기** ① $-2x + 3$  ② $-2x + 5$  ③ $-2x + 7$  ④ $2x - 7$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{x^2 - 10x + 25} = \sqrt{(x-5)^2} = |x-5|$
2. $\sqrt{x^2 - 4x + 4} = \sqrt{(x-2)^2} = |x-2|$
3. $2 < x < 5$에서 $|x-5| = -x + 5$, $|x-2| = x - 2$
4. 식 $= (-x + 5) - (x - 2) = -2x + 7$이다. (정답 ③)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2 < x < 5$ 일 때, $\sqrt{x^2 - 10x + 25} - \sqrt{x^2 - 4x + 4}$ 를 간단히 하면?」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호가 있는 식의 변형 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 부호에 따른 제곱근의 근호 벗기기를 다루는 제곱근의 성질 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ABSOLUTE **원천→판정: PT_M3_RADICAL_ABSOLUTE_VALUE → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_INTERVAL_BOUNDED_RADICAL_SIMPLIFY → TPL_M3_ROOT_PROPERTY_ABSOLUTE**
- 이유: 문자의 범위 조건에서 근호 안 완전제곱식을 절댓값 부호로 정리하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 완전제곱식의 부호를 구간에 맞춰 판단해야 하는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 완전제곱식←stem:「$2 < x < 5$ 일 때, $\sqrt{x^2 - 10x + 25} - \sqrt{x^2 - 4x + 4}$ 를 간단히 하면?」
- goal: 완전제곱식←stem:「간단히 하면?」
- method: 완전제곱식(NAMED)←solution:「근호 안의 식을 완전제곱식으로 인수분해한 후 절댓값으로 전환하고, 주어진 범위에서 각 식의 부호를 판별한다.」
- condition: 완전제곱식←solution:「따라서 정답은 ③이다.」

**how** 근호 안을 완전제곱식으로 인수분해하고 x의 범위에 따른 부호로 절댓값을 풀었다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 식을 완전제곱식으로 인수분해한 후 절댓값으로 전환하고, 주어진 범위에서 각 식의 부호를 판별한다.


1단계: 근호 안의 식을 완전제곱식으로 변형한다. $$x^2 - 10x + 25 = (x - 5)^2$$ $$x^2 - 4x + 4 = (x - 2)^2$$ 따라서 주어진 식은 다음과 같다. $$\sqrt{(x-5)^2} - \sqrt{(x-2)^2} = |x - 5| - |x - 2|$$


2단계: 주어진 범위 $2 < x < 5$에서 각 식의 부호를 판별한다.


* $x < 5$이므로 $x - 5 < 0$이다. 따라서 $$|x - 5| = -(x - 5) = 5 - x$$
* $x > 2$이므로 $x - 2 > 0$이다. 따라서 $$|x - 2| = x - 2$$


3단계: 두 식의 뺄셈을 수행한다. $$|x - 5| - |x - 2| = (5 - x) - (x - 2) = 5 - x - x + 2 = -2x + 7$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(2x+1)(2x-5) + k$ 가 완전제곱식이 되도록 하는 상수 $k$의 값은? [4점]

**보기** ① $4$  ② $5$  ③ $7$  ④ $9$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(2x+1)(2x-5) + k = 4x^2 - 10x + 2x - 5 + k = 4x^2 - 8x - 5 + k$ (선지 $16$)
2. 완전제곱식 $(2x-2)^2 = 4x^2 - 8x + 4$가 되려면 $-5 + k = 4$이어야 한다.
3. 따라서 $k = 9$이다. (정답 ④)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(2x+1)(2x-5) + k$ 가 완전제곱식이 되도록 하는 상수 $k$의 값은?」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 완전제곱식 만들기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식**
- 이유: 완전제곱식이 되기 위한 계수 조건을 분석하는 제곱식 유형이다. (문항 토큰 16)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_SQUARE_CONDITION **원천→판정: PT_M3_PERFECT_SQUARE_CONSTANT → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_QUADRATIC_PERFECT_SQUARE_UNKNOWN → TPL_M3_FACTORIZATION_SQUARE_CONDITION**
- 이유: 이차식이 완전제곱식이 되도록 하는 미정 상수를 결정하는 유형이다. (문항 토큰 16)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차식 전개 후 상수항 비교를 수행하는 난이도 1 문항이다. (문항 토큰 16)

**4칸**
- given: 완전제곱식←stem:「$(2x+1)(2x-5) + k$ 가 완전제곱식이 되도록 하는 상수 $k$의 값은?」
- goal: 완전제곱식←stem:「상수 $k$의 값은?」
- method: 완전제곱식(NAMED)←solution:「식을 전개한 후 일차항 계수로부터 완전제곱식이 되기 위한 상수항 조건을 세운다.」
- condition: 완전제곱식←solution:「따라서 정답은 ④이다.」

**how** 식을 전개한 뒤 완전제곱식이 되기 위한 상수항 조건을 세워 k를 구했다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

식을 전개한 후 일차항 계수로부터 완전제곱식이 되기 위한 상수항 조건을 세운다.


1단계: 주어진 식을 전개한다. $$(2x + 1)(2x - 5) + k = 4x^2 - 10x + 2x - 5 + k = 4x^2 - 8x - 5 + k$$


2단계: 완전제곱식의 형태와 비교한다. 이차항이 $4x^2 = (2x)^2$이고 일차항이 $-8x = -2(2x)(2)$이므로, 완전제곱식은 $$(2x - 2)^2 = 4x^2 - 8x + 4$$ 이어야 한다.


3단계: 상수항을 비교하여 $k$의 값을 구한다. $$-5 + k = 4 \implies k = 4 + 5 = 9$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 $2^8 - 1$의 약수가 아닌 것은? [4점]

**보기** ① $3$  ② $5$  ③ $15$  ④ $17$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $2^8 - 1 = (2^4 - 1)(2^4 + 1) = (16-1)(16+1) = 15 \times 17 = 3 \times 5 \times 17$
2. 약수: $1, 3, 5, 15, 17, 51, 85, 255$
3. 따라서 $11$은 약수가 아니다. (정답 ⑤)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $2^8 - 1$의 약수가 아닌 것은?」
**RPM** M3-RPM-026 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 수의 계산 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산**
- 이유: 인수분해를 수의 소인수분해와 약수 분석에 활용하는 수의 계산 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION **원천→판정: PT_M3_NUMERICAL_DIFFERENCE_OF_SQUARES_FACTORS → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_EXPONENT_DIFFERENCE_DIVISORS → TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION**
- 이유: 인수분해 공식을 활용해 큰 수의 약수 및 소인수를 분석하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 합차 공식과 정수론적 약수 판별을 결합한 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 합차공식←stem:「다음 중 $2^8 - 1$의 약수가 아닌 것은?」
- goal: 합차공식←stem:「$2^8 - 1$의 약수가 아닌 것은?」
- method: 소수(NAMED)←solution:「합차 공식을 이용하여 $2^8-1$을 소인수분해하고 약수인지 판별한다.」
- condition: 합차공식←solution:「따라서 정답은 ⑤이다.」

**how** 합차 공식을 이용해 큰 거듭제곱 수를 소인수분해하고 약수를 판별했다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

합차 공식을 이용하여 $2^8-1$을 소인수분해하고 약수인지 판별한다.


1단계: 합차 공식으로 식을 인수분해한다. $$2^8 - 1 = (2^4)^2 - 1^2 = (2^4 - 1)(2^4 + 1)$$ 각 인수의 값을 계산하면


* $2^4 - 1 = 16 - 1 = 15$
* $2^4 + 1 = 16 + 1 = 17$ 따라서 $$2^8 - 1 = 15 \times 17 = 255$$


2단계: 소인수분해하여 약수를 조사한다. $$255 = 3 \times 5 \times 17$$


* $3$은 약수이다. *$5$는 약수이다. *$15 = 3 \times 5$이므로 약수이다. *$17$은 약수이다. *$11$: $255 = 11 \times 23 + 2$이므로 $11$로 나누어떨어지지 않는다. 따라서 $11$은 약수가 아니다.


3단계: 결론을 도출한다. 따라서 약수가 아닌 것은 ⑤이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 2점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 1] 다음은 세 학생이 제곱근의 성질에 대하여 설명한 것이다. 잘못 말한 학생의 이름을 쓰고, 그 학생의 설명을 바르게 고쳐 쓰시오. [총 2점]


* 진우: $(-3)^2 = 9$이므로 $\sqrt{(-3)^2} = \sqrt{9} = 3$이야. * 서연:$(-7)^2 = 49$이므로 $\sqrt{49} = \sqrt{(-7)^2} = -7$이야. * 민호:$3 > \dfrac{1}{3}$이므로 $\sqrt{3} > \sqrt{\dfrac{1}{3}}$이야.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 잘못 말한 학생: 서연 / 바르게 고침: $\sqrt{49} = \sqrt{(-7)^2} = 7$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 서연: $\sqrt{49} = \sqrt{(-7)^2} = -7$이라 하였으나, 근호 안 제곱의 값은 항상 양수이므로 $7$이어야 한다.
2. 따라서 잘못 말한 학생은 서연이고, 바르게 고치면 $\sqrt{49} = \sqrt{(-7)^2} = 7$이다.
- 작성자 답: 잘못 말한 학생: 서연 / 바르게 고침: $\sqrt{49} = \sqrt{(-7)^2} = 7$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 세 학생이 제곱근의 성질에 대하여 설명한 것이다.」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 성질 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 근호 기호의 정의와 값의 범위를 다루는 제곱근의 성질 유형이다. (문항 토큰 49)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT **원천→판정: PT_M3_RADICAL_PROPERTY_STUDENT_AUDIT → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_STUDENT_DIALOGUE_ERROR_CORRECTION → TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT**
- 이유: 제곱근의 성질에 대한 학생들의 대화에서 오류를 찾아 바르게 고치는 서술형 유형이다. (문항 토큰 49)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 근호 성질 오류를 식별하고 수정하는 난이도 1 서술형 문항이다. (문항 토큰 49)

**4칸**
- given: 제곱근←stem:「다음은 세 학생이 제곱근의 성질에 대하여 설명한 것이다.」
- goal: 제곱근←stem:「잘못 말한 학생의 이름을 쓰고, 그 학생의 설명을 바르게 고쳐 쓰시오.」
- method: 제곱근(NAMED)←solution:「근호 기호 $\sqrt{A}$의 값은 항상 $0$ 이상의 양의 제곱근(또는 $0$)이어야 한다는 성질을 점검한다.」
- condition: 제곱근←solution:「따라서 정답은 잘못 말한 학생: 서연 / 바르게 고침: $\sqrt{49} = \sqrt{(-7)^2} = 7$이다.」

**how** 근호 기호의 양수성 성질을 기반으로 서연의 오류를 찾고 올바르게 교정했다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 기호 $\sqrt{A}$의 값은 항상 $0$ 이상의 양의 제곱근(또는 $0$)이어야 한다는 성질을 점검한다.


1단계: 세 학생의 설명을 검토하여 잘못 말한 학생을 찾는다. [1점]


* 진우: $(-3)^2 = 9$이고 $\sqrt{9} = 3$이므로 옳다. * 서연:$(-7)^2 = 49$이지만, 기호 $\sqrt{49}$는 $49$의 양의 제곱근을 나타내므로 $7$이어야 한다. $-7$이라고 한 것은 틀렸다. * 민호:$3 > \dfrac{1}{3} > 0$이므로 $\sqrt{3} > \sqrt{\dfrac{1}{3}}$이 옳다. 따라서 잘못 말한 학생은 서연이다.


2단계: 서연의 설명을 바르게 고친다. [1점] $$\sqrt{49} = \sqrt{(-7)^2} = 7$$ (근호가 붙은 수의 값은 음수가 될 수 없으므로 양의 제곱근인 $7$로 고쳐야 한다.)


따라서 정답은 잘못 말한 학생: 서연 / 바르게 고침: $\sqrt{49} = \sqrt{(-7)^2} = 7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서·논술형 2] $\sqrt{5.3} \fallingdotseq 2.302, \quad \sqrt{53} \fallingdotseq 7.280$ 일 때, 주어진 근삿값을 이용하여 $\sqrt{530} + \sqrt{0.53}$ 의 값을 구하는 과정과 답을 서술하시오. (단, 소수 셋째 자리에서 반올림하시오.) [총 5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 23.75   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{530} = \sqrt{5.3 \times 100} = 10\sqrt{5.3} \fallingdotseq 10 \times 2.302 = 23.02$
2. $\sqrt{0.53} = \sqrt{53/100} = \sqrt{53}/10 \fallingdotseq 7.280 / 10 = 0.7280$
3. 합: $23.02 + 0.7280 = 23.748$
4. 소수 셋째 자리에서 반올림하면 $23.75$이다.
- 작성자 답: 23.75 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-SQUARE_ROOT_REAL_NUMBER**
- 근거 인용: 「$\sqrt{5.3} \fallingdotseq 2.302, \quad \sqrt{53} \fallingdotseq 7.280$ 일 때」
**RPM** M3-RPM-006 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 값 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 근삿값**
- 이유: 자릿수 변환을 통한 무리수 근삿값 계산을 다루는 근삿값 유형이다. (문항 토큰 5.3)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_APPROXIMATION **원천→판정: PT_M3_RADICAL_APPROXIMATION_DECIMAL_ROUNDING → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_DUAL_POWER_OF_10_APPROX_SUM → TPL_M3_RADICAL_APPROXIMATION**
- 이유: 제곱근의 근삿값과 자릿수 이동을 이용해 수치 계산 후 반올림하는 서술형 유형이다. (문항 토큰 5.3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 100 단위 근호 변환과 소수점 반올림을 정확히 수행하는 난이도 2 문항이다. (문항 토큰 5.3)

**4칸**
- given: 제곱근←stem:「$\sqrt{5.3} \fallingdotseq 2.302, \quad \sqrt{53} \fallingdotseq 7.280$ 일 때」
- goal: 소수←stem:「$\sqrt{530} + \sqrt{0.53}$ 의 값을 구하는 과정과 답을 서술하시오. (단, 소수 셋째 자리에서 반올림하시오.)」
- method: 소수(NAMED)←solution:「$100$의 거듭제곱을 이용하여 주어진 근삿값에 맞추어 변형한 후 합을 구하고 반올림한다.」
- condition: 소수←solution:「따라서 구하는 답은 $23.75$이다. 따라서 정답은 23.75이다.」

**how** 100의 거듭제곱을 활용해 근호 안의 수를 변형하고 근삿값을 더한 뒤 반올림했다. (문항 토큰 5.3)

<details><summary>저장 해설 (판정 검토용)</summary>

$100$의 거듭제곱을 이용하여 주어진 근삿값에 맞추어 변형한 후 합을 구하고 반올림한다.


1단계: $\sqrt{530}$의 값을 계산한다. [2점] $$\sqrt{530} = \sqrt{5.3 \times 100} = 10\sqrt{5.3} \fallingdotseq 10 \times 2.302 = 23.02$$


2단계: $\sqrt{0.53}$의 값을 계산한다. [2점] $$\sqrt{0.53} = \sqrt{\dfrac{53}{100}} = \dfrac{\sqrt{53}}{10} \fallingdotseq \dfrac{7.280}{10} = 0.7280$$


3단계: 두 값을 더하고 소수 셋째 자리에서 반올림한다. [1점] $$\sqrt{530} + \sqrt{0.53} \fallingdotseq 23.02 + 0.7280 = 23.748$$ 소수 셋째 자리의 숫자가 $8$이므로 반올림하면 올림이 된다. $$23.748 \approx 23.75$$


따라서 구하는 답은 $23.75$이다. 따라서 정답은 23.75이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 3] $3\sqrt{12} + \sqrt{72} - \sqrt{48} - \sqrt{32} = a\sqrt{2} + b\sqrt{3}$ 일 때, $a+b$의 값을 구하는 과정과 답을 서술하시오. (단, $a, b$는 유리수) [총 5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 4   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $3\sqrt{12} = 6\sqrt{3}$, $\sqrt{72} = 6\sqrt{2}$, $\sqrt{48} = 4\sqrt{3}$, $\sqrt{32} = 4\sqrt{2}$
2. 식 $= (6\sqrt{2} - 4\sqrt{2}) + (6\sqrt{3} - 4\sqrt{3}) = 2\sqrt{2} + 2\sqrt{3}$
3. $a = 2, b = 2$이므로 $a + b = 2 + 2 = 4$이다.
- 작성자 답: 4 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3\sqrt{12} + \sqrt{72} - \sqrt{48} - \sqrt{32} = a\sqrt{2} + b\sqrt{3}$ 일 때, $a+b$의 값을 구하는 과정과 답을 서술하시오.」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 동류근호의 사칙연산을 정리하는 동류근호 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_COEFFICIENT_MATCH → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_EXPRESSION_COEFFICIENT_SUM → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 동류근호의 덧셈과 뺄셈을 수행하여 계수 비교를 완료하는 서술형 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다항 근호 정리와 서술형 단계 작성을 요구하는 난이도 2 문항이다. (문항 토큰 12)

**4칸**
- given: 유리수←stem:「$3\sqrt{12} + \sqrt{72} - \sqrt{48} - \sqrt{32} = a\sqrt{2} + b\sqrt{3}$ 일 때, $a+b$의 값을 구하는 과정과 답을 서술하시오.」
- goal: 유리수←stem:「$a+b$의 값을 구하는 과정과 답을 서술하시오.」
- method: 유리수(NAMED)←solution:「각 근호를 $k\sqrt{2}$ 또는 $k\sqrt{3}$ 꼴로 간단히 정리한 후 동류항끼리 묶어 계수를 비교한다.」
- condition: 유리수←solution:「따라서 정답은 4이다.」

**how** 각 근호를 간단히 정리한 후 동류근호끼리 묶어 계수의 합을 구했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

각 근호를 $k\sqrt{2}$ 또는 $k\sqrt{3}$ 꼴로 간단히 정리한 후 동류항끼리 묶어 계수를 비교한다.


1단계: 각 항의 근호 안의 수를 꺼내어 간단히 한다. [2점]


* $3\sqrt{12} = 3(2\sqrt{3}) = 6\sqrt{3}$
* $\sqrt{72} = \sqrt{36 \times 2} = 6\sqrt{2}$
* $\sqrt{48} = \sqrt{16 \times 3} = 4\sqrt{3}$
* $\sqrt{32} = \sqrt{16 \times 2} = 4\sqrt{2}$


2단계: 동류근호끼리 묶어 계산한다. [2점] $$3\sqrt{12} + \sqrt{72} - \sqrt{48} - \sqrt{32} = 6\sqrt{3} + 6\sqrt{2} - 4\sqrt{3} - 4\sqrt{2}$$ $$= (6 - 4)\sqrt{2} + (6 - 4)\sqrt{3} = 2\sqrt{2} + 2\sqrt{3}$$


3단계: $a, b$의 값을 비교하고 $a+b$를 계산한다. [1점] $$a\sqrt{2} + b\sqrt{3} = 2\sqrt{2} + 2\sqrt{3} \implies a = 2, \quad b = 2$$ $$a + b = 2 + 2 = 4$$


따라서 구하는 답은 $4$이다. 따라서 정답은 4이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 4] 어느 원기둥의 전개도에서 옆면 직사각형의 가로의 길이(밑면 원의 둘레)는 $6\sqrt{2}\pi,\mathrm{cm}$이고, 세로의 길이(원기둥의 높이)는 $4\sqrt{3},\mathrm{cm}$이다. 이 원기둥의 부피를 구하는 과정과 답을 서술하시오. [총 5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $72\sqrt{3}\pi,\mathrm{cm^3}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 원의 둘레: $2\pi r = 6\sqrt{2}\pi \implies r = 3\sqrt{2}\mathrm{cm}$
2. 밑면의 넓이: $\pi r^2 = \pi (3\sqrt{2})^2 = 18\pi\mathrm{cm^2}$
3. 원기둥의 부피: $18\pi \times 4\sqrt{3} = 72\sqrt{3}\pi\mathrm{cm^3}$이다.
- 작성자 답: $72\sqrt{3}\pi,\mathrm{cm^3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「옆면 직사각형의 가로의 길이(밑면 원의 둘레)는 $6\sqrt{2}\pi,\mathrm{cm}$이고, 세로의 길이(원기둥의 높이)는 $4\sqrt{3},\mathrm{cm}$이다.」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈의 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 도형의 넓이와 부피에 근호 연산을 적용하는 근호의 곱 유형이다. (문항 토큰 cm)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_GEOMETRY **원천→판정: PT_M3_CYLINDER_NET_VOLUME → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_CYLINDER_NET_RADICAL_VOLUME → TPL_M3_RADICAL_GEOMETRY**
- 이유: 입체도형 전개도의 치수를 무리수로 계산하여 원기둥 부피를 구하는 서술형 유형이다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 입체도형 공식과 무리수 곱셈을 결합한 난이도 2 문항이다. (문항 토큰 cm)

**4칸**
- given: 둘레←stem:「옆면 직사각형의 가로의 길이(밑면 원의 둘레)는 $6\sqrt{2}\pi,\mathrm{cm}$이고, 세로의 길이(원기둥의 높이)는 $4\sqrt{3},\mathrm{cm}$이다.」
- goal: 넓이←stem:「이 원기둥의 부피를 구하는 과정과 답을 서술하시오.」
- method: 넓이(NAMED)←solution:「밑면 원의 둘레 공식으로부터 반지름을 구하고, 밑면의 넓이와 높이를 곱하여 원기둥의 부피를 구한다.」
- condition: 넓이←solution:「따라서 구하는 원기둥의 부피는 $72\sqrt{3}\pi,\mathrm{cm^3}$이다. 따라서 정답은 $72\sqrt{3}\pi,\mathrm{cm^3}$이다.」

**how** 전개도의 둘레에서 밑면 반지름을 도출하고 무리수 곱셈으로 부피를 계산했다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

밑면 원의 둘레 공식으로부터 반지름을 구하고, 밑면의 넓이와 높이를 곱하여 원기둥의 부피를 구한다.


1단계: 밑면인 원의 반지름 $r$을 구한다. [2점] 원기둥 전개도에서 옆면의 가로의 길이는 밑면 원의 둘레와 같다. 밑면 원의 반지름을 $r,\mathrm{cm}$라 하면 원의 둘레는 $2\pi r$이므로 $$2\pi r = 6\sqrt{2}\pi$$ 양변을 $2\pi$로 나누면 $$r = 3\sqrt{2},\mathrm{cm}$$


2단계: 밑면의 넓이를 구한다. [1점] $$\text{밑면의 넓이} = \pi r^2 = \pi(3\sqrt{2})^2 = \pi(9 \times 2) = 18\pi,\mathrm{cm^2}$$


3단계: 원기둥의 부피를 계산한다. [2점] 원기둥의 높이는 $h = 4\sqrt{3},\mathrm{cm}$이므로 $$\text{부피} = (\text{밑면의 넓이}) \times (\text{높이}) = 18\pi \times 4\sqrt{3} = 72\sqrt{3}\pi,\mathrm{cm^3}$$


따라서 구하는 원기둥의 부피는 $72\sqrt{3}\pi,\mathrm{cm^3}$이다. 따라서 정답은 $72\sqrt{3}\pi,\mathrm{cm^3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 서술형 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 5] 곱셈 공식을 이용하여 $103^2$ 의 값을 구하는 과정과 답을 서술하시오. [총 3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 10609   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $103^2 = (100 + 3)^2 = 100^2 + 2 \times 100 \times 3 + 3^2$
2. $= 10000 + 600 + 9 = 10609$이다.
- 작성자 답: 10609 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「곱셈 공식을 이용하여 $103^2$ 의 값을 구하는 과정과 답을 서술하시오.」
**RPM** M3-RPM-018 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식을 이용한 수의 계산 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산**
- 이유: 곱셈공식을 수의 계산에 적용하는 수의 계산 유형이다. (문항 토큰 103)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_NUMERIC **원천→판정: PT_M3_NUMERICAL_SQUARE_FORMULA → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_NUMBER_SQUARE_BINOMIAL_EXPAND → TPL_M3_MULTIPLICATION_NUMERIC**
- 이유: 곱셈공식을 이용하여 큰 수의 거듭제곱을 효율적으로 계산하는 서술형 유형이다. (문항 토큰 103)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 합의 제곱 수치 전개를 작성하는 난이도 1 문항이다. (문항 토큰 103)

**4칸**
- given: 곱셈공식←stem:「곱셈 공식을 이용하여 $103^2$ 의 값을 구하는 과정과 답을 서술하시오.」
- goal: 곱셈공식←stem:「$103^2$ 의 값을 구하는 과정과 답을 서술하시오.」
- method: 완전제곱식(NAMED)←solution:「완전제곱식 곱셈 공식 $(a+b)^2 = a^2 + 2ab + b^2$을 이용하여 수를 계산한다.」
- condition: 완전제곱식←solution:「따라서 구하는 답은 $10609$이다. 따라서 정답은 10609이다.」

**how** 103을 100+3으로 분해하고 합의 제곱 곱셈공식을 적용하여 값을 서술했다. (문항 토큰 103)

<details><summary>저장 해설 (판정 검토용)</summary>

완전제곱식 곱셈 공식 $(a+b)^2 = a^2 + 2ab + b^2$을 이용하여 수를 계산한다.


1단계: $103$을 $100+3$으로 변형하여 완전제곱식 공식을 적용한다. [2점] $$103^2 = (100 + 3)^2 = 100^2 + 2(100)(3) + 3^2$$


2단계: 각 항을 계산하여 합산한다. [1점] $$= 10000 + 600 + 9 = 10609$$


따라서 구하는 답은 $10609$이다. 따라서 정답은 10609이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
