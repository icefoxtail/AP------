# 검수 묶음 — 24_연향중_1학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 23개 / 검사 PASS 22, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 4, 2단계 14, 3단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q2**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q3**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q10**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q13**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 중에서 옳은 것은? [3점]

**보기** ① $(-\sqrt{11})^2$의 값은 $11$이다.  ② 모든 실수의 제곱근은 항상 $2$개이다.  ③ $\sqrt{64}$의 값은 $\pm 8$이다.  ④ $-36$의 제곱근은 $-6$이다.  ⑤ $\sqrt{\frac{16}{25}}$의 제곱근은 $\pm \frac{4}{5}$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 음수의 제곱은 양수이므로 $(-\sqrt{11})^2 = 11$이다. 따라서 ①은 옳다.
2. ②에서 $0$의 제곱근은 $0$의 $1$개이므로 거짓이고, ③에서 $\sqrt{64}=8$이므로 거짓이다.
3. ④에서 $-36$의 제곱근은 실수 범위에 없고, ⑤에서 $\sqrt{\frac{16}{25}}=\frac{4}{5}$의 제곱근은 $\pm\sqrt{\frac{4}{5}}$이다. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「각 보기를 제곱근의 뜻과 성질에 따라 판별한다.」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근과 실수 단원에서 제곱근의 뜻을 다루는 RPM 유형이다. (문항 토큰 11)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_AUDIT → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_TRUTH_EVAL → TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT**
- 이유: 제곱근의 정의와 성질에 관한 참·거짓 판별 유형이다. (문항 토큰 11)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 기초적인 제곱근의 정의를 판별하는 난이도 1 문항이다. (문항 토큰 11)

**4칸**
- given: 제곱←solution:「각 보기를 제곱근의 뜻과 성질에 따라 판별한다.」
- goal: 실수←choices:「모든 실수의 제곱근은 항상 $2$개이다.」
- method: 판별(NAMED)←solution:「각 보기를 제곱근의 뜻과 성질에 따라 판별한다.」
- condition: (없음)

**how** 제곱근의 뜻과 성질에 따라 각 보기를 판별하여 옳은 것을 찾았다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 제곱근의 뜻과 성질에 따라 판별한다.


1단계: 각 보기를 차례로 확인한다. ① 음수의 제곱은 양수이므로 $(-\sqrt{11})^2 = 11$이다. 따라서 참이다. ② $0$의 제곱근은 $0$의 $1$개이고 음수의 제곱근은 없으므로 거짓이다. ③ $\sqrt{64} = 8$로 양의 제곱근 하나만을 뜻하므로 거짓이다. ④ 실수 범위에서 음수 $-36$의 제곱근은 존재하지 않으므로 거짓이다. ⑤ $\sqrt{\dfrac{16}{25}} = \dfrac{4}{5}$이므로, 이 수의 제곱근은 $\pm \sqrt{\dfrac{4}{5}} = \pm \dfrac{2\sqrt{5}}{5}$이다. 따라서 거짓이다.


따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$17$의 양의 제곱근을 $a$, 음의 제곱근을 $b$라 할 때, $ab$의 값을 구하면? [4점]

**보기** ① $-289$  ② $-17$  ③ $0$  ④ $17$  ⑤ $289$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $17$의 양의 제곱근은 $a = \sqrt{17}$, 음의 제곱근은 $b = -\sqrt{17}$이다.
2. 두 수의 곱 $ab = \sqrt{17} \times (-\sqrt{17}) = -(\sqrt{17})^2 = -17$이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$17$의 양의 제곱근을 $a$, 음의 제곱근을 $b$라 할 때, $ab$의 값을 구하면?」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 표현 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 뜻을 적용하여 수의 곱을 계산하는 RPM 유형이다. (문항 토큰 17)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ROOT_VALUE **원천→판정: PT_M3_SQUARE_ROOT_PRODUCT → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_POS_NEG_MUL → TPL_M3_ROOT_PROPERTY_ROOT_VALUE**
- 이유: 제곱근의 정의를 이용하여 미지수의 값을 구하고 곱하는 유형이다. (문항 토큰 17)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 제곱근의 기본 성질을 곱셈으로 묻는 난이도 1 문항이다. (문항 토큰 17)

**4칸**
- given: 제곱←stem:「$17$의 양의 제곱근을 $a$, 음의 제곱근을 $b$라 할 때, $ab$의 값을 구하면?」
- goal: 값←stem:「$ab$의 값을 구하면?」
- method: 정의(NAMED)←solution:「양의 제곱근과 음의 제곱근의 정의를 적용하여 두 수의 곱을 계산한다.」
- condition: (없음)

**how** 양의 제곱근과 음의 제곱근의 정의로 식을 세우고 곱을 계산하였다. (문항 토큰 17)

<details><summary>저장 해설 (판정 검토용)</summary>

양의 제곱근과 음의 제곱근의 정의를 적용하여 두 수의 곱을 계산한다.


1단계: $17$의 양의 제곱근 $a$와 음의 제곱근 $b$를 구한다. $$a = \sqrt{17}, \quad b = -\sqrt{17}$$


2단계: 두 수의 곱 $ab$를 계산한다. $$ab = \sqrt{17} \times (-\sqrt{17}) = -(\sqrt{17})^2 = -17$$


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$a>0$일 때, 다음 중 옳지 않은 것은? [3점]

**보기** ① $\sqrt{a^2}=a$  ② $(\sqrt{a})^2=a$  ③ $-\sqrt{(-a)^2}=a$  ④ $(-\sqrt{a})^2=a$  ⑤ $-\sqrt{a^2}=-a$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $a>0$일 때 $\sqrt{a^2}=a$, $(\sqrt{a})^2=a$는 모두 참이다.
2. ③에서 $-\sqrt{(-a)^2} = -|-a| = -a$이며, $a>0$이므로 $-a \ne a$이다. 따라서 ③은 옳지 않다.
3. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a>0$일 때 제곱근의 성질에 따라 각 보기를 확인한다.」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호가 있는 식의 변형 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 제곱근의 성질 중 부호 판별과 절댓값 개념을 묻는 RPM 유형이다. (문항 토큰 a)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ABSOLUTE **원천→판정: PT_M3_SQUARE_ROOT_SIGN_CHECK → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_SYMBOL_ALGEBRA → TPL_M3_ROOT_PROPERTY_ABSOLUTE**
- 이유: 문자의 부호가 주어졌을 때 제곱근의 성질을 판별하는 유형이다. (문항 토큰 a)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 부호에 유의하여 근호를 벗기는 기본 난이도 1 문항이다. (문항 토큰 a)

**4칸**
- given: 제곱←solution:「$a>0$일 때 제곱근의 성질에 따라 각 보기를 확인한다.」
- goal: 성질←solution:「$a>0$일 때 제곱근의 성질에 따라 각 보기를 확인한다.」
- method: 제곱근(NAMED)←solution:「$a>0$일 때 제곱근의 성질에 따라 각 보기를 확인한다.」
- condition: (없음)

**how** 근호 안의 식의 부호에 따른 근호 풀기 성질을 적용하여 옳지 않은 것을 찾았다. (문항 토큰 a)

<details><summary>저장 해설 (판정 검토용)</summary>

$a>0$일 때 제곱근의 성질에 따라 각 보기를 확인한다.


1단계: 각 보기를 차례로 검토한다. ① $a>0$이므로 $\sqrt{a^2} = |a| = a$이다. (참) ② $(\sqrt{a})^2 = a$이다. (참) ③ $-\sqrt{(-a)^2} = -|-a| = -a$이다. $a>0$이므로 $-a \ne a$이다. 따라서 옳지 않다. ④ $(-\sqrt{a})^2 = (\sqrt{a})^2 = a$이다. (참) ⑤ $-\sqrt{a^2} = -a$이다. (참)


따라서 옳지 않은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 대소 관계가 옳은 것은? [4점]

**보기** ① $\sqrt{37} > 7$  ② $\sqrt{10} < 3$  ③ $-\sqrt{15} > -3$  ④ $-\sqrt{18} < 2$  ⑤ $\frac{\sqrt{3}}{4} > \frac{\sqrt{5}}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① $\sqrt{37} < \sqrt{49}=7$, ② $\sqrt{10} > \sqrt{9}=3$, ③ $-\sqrt{15} < -3$이므로 거짓이다.
2. ④ $-\sqrt{18} < 0 < 2$이므로 음수는 양수보다 작아 항상 참이다.
3. ⑤ $\frac{\sqrt{3}}{4} < \frac{\sqrt{5}}{4}$이므로 거짓이다. 따라서 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 대소 관계가 옳은 것은?」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 실수와 무리수의 대소 비교를 다루는 RPM 유형이다. (문항 토큰 37)
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_REAL_NUMBER_ORDER → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_REAL_NUMBER_COMPARISON → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 무리수와 실수의 대소 관계를 판별하는 유형이다. (문항 토큰 37)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 보기의 근호 대소를 판정하는 난이도 2 문항이다. (문항 토큰 37)

**4칸**
- given: 대소←stem:「다음 중 대소 관계가 옳은 것은?」
- goal: 실수←solution:「실수의 대소 관계를 제곱하거나 수의 성질을 이용하여 비교한다.」
- method: 비교(NAMED)←solution:「실수의 대소 관계를 제곱하거나 수의 성질을 이용하여 비교한다.」
- condition: (없음)

**how** 제곱근의 크기 비교와 음수·양수의 대소 관계를 판별하였다. (문항 토큰 37)

<details><summary>저장 해설 (판정 검토용)</summary>

실수의 대소 관계를 제곱하거나 수의 성질을 이용하여 비교한다.


1단계: 각 보기를 차례로 판별한다. ① $37 < 49$이므로 $\sqrt{37} < 7$이다. (거짓) ② $10 > 9$이므로 $\sqrt{10} > 3$이다. (거짓) ③ $15 > 9$이므로 $\sqrt{15} > 3$이고, 양변에 $-1$을 곱하면 $-\sqrt{15} < -3$이다. (거짓) ④ $-\sqrt{18} < 0 < 2$이므로 음수는 항상 양수보다 작다. (참) ⑤ $3 < 5$이므로 $\sqrt{3} < \sqrt{5}$이고, 양변을 $4$로 나누면 $\dfrac{\sqrt{3}}{4} < \dfrac{\sqrt{5}}{4}$이다. (거짓)


따라서 옳은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중에서 순환하지 않는 무한소수인 것은? [4점]

**보기** ① $0.35$  ② $-\sqrt{16}$  ③ $1.\dot{7}$  ④ $-\sqrt{\frac{25}{36}}$  ⑤ $\sqrt{12}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 순환하지 않는 무한소수는 무리수를 의미한다.
2. $0.35$는 유한소수, $-\sqrt{16}=-4$는 정수, $1.\dot{7}=\frac{16}{9}$은 순환소수, $-\sqrt{\frac{25}{36}}=-\frac{5}{6}$은 유리수이다.
3. $\sqrt{12}=2\sqrt{3}$은 근호를 벗길 수 없으므로 순환하지 않는 무한소수(무리수)이다. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 순환하지 않는 무한소수인 것은?」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 무리수와 실수의 판별을 다루는 RPM 유형이다. (문항 토큰 0.35)
**유형** PT=PT_M3_REAL_NUMBER_CLASSIFICATION / TPL=TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT **원천→판정: PT_M3_IRRATIONAL_NUMBER_IDENTIFY → PT_M3_REAL_NUMBER_CLASSIFICATION** **원천→판정: TPL_M3_REAL_NUMBER_DECIMAL_FORM → TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT**
- 이유: 소수의 분류와 무리수의 정의를 연계하여 판별하는 유형이다. (문항 토큰 0.35)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수의 분류를 정확히 적용하는 난이도 2 문항이다. (문항 토큰 0.35)

**4칸**
- given: 소수←stem:「다음 중에서 순환하지 않는 무한소수인 것은?」
- goal: 유리수←solution:「순환하지 않는 무한소수는 무리수를 뜻하므로, 각 수의 유리수/무리수 여부를 판별한다.」
- method: 판별(NAMED)←solution:「순환하지 않는 무한소수는 무리수를 뜻하므로, 각 수의 유리수/무리수 여부를 판별한다.」
- condition: (없음)

**how** 유리수와 무리수의 성질을 파악하여 순환하지 않는 무한소수를 선별하였다. (문항 토큰 0.35)

<details><summary>저장 해설 (판정 검토용)</summary>

순환하지 않는 무한소수는 무리수를 뜻하므로, 각 수의 유리수/무리수 여부를 판별한다.


1단계: 각 보기를 간단히 정리한다. ① $0.35 = \dfrac{35}{100} = \dfrac{7}{20}$이므로 유한소수(유리수)이다. ② $-\sqrt{16} = -4$이므로 정수(유리수)이다. ③ $1.\dot{7} = \dfrac{17-1}{9} = \dfrac{16}{9}$이므로 순환소수(유리수)이다. ④ $-\sqrt{\dfrac{25}{36}} = -\dfrac{5}{6}$이므로 유리수이다. ⑤ $\sqrt{12} = 2\sqrt{3}$이며, $12$는 제곱수가 아니므로 근호를 벗겨낼 수 없어 순환하지 않는 무한소수(무리수)이다.


따라서 순환하지 않는 무한소수는 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 중 $\sqrt{3}$과 $\sqrt{5}$ 사이에 있는 무리수인 것은? [4점]

**보기** ① $\frac{\sqrt{3}+\sqrt{5}}{2}$  ② $\sqrt{5}-\sqrt{3}$  ③ $\sqrt{3}+\sqrt{5}$  ④ $2\sqrt{5}-\sqrt{3}$  ⑤ $\frac{\sqrt{5}-\sqrt{3}}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{3} < \sqrt{5}$일 때 두 수의 평균 $\dfrac{\sqrt{3}+\sqrt{5}}{2}$는 항상 두 수 사이에 위치한다.
2. 양변을 제곱하면 $4k^2 = 8+2\sqrt{15}$이므로 $15$의 제곱근인 무리수 $\sqrt{15}$에 의해 $\dfrac{\sqrt{3}+\sqrt{5}}{2}$는 무리수이다.
3. 따라서 $\sqrt{3}$과 $\sqrt{5}$ 사이에 있는 무리수인 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $\sqrt{3}$과 $\sqrt{5}$ 사이에 있는 무리수인 것은?」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 수직선과 제곱근에서 무리수의 위치를 확인하는 RPM 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_BETWEEN **원천→판정: PT_M3_BETWEEN_NUMBERS_IRRATIONAL → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_REAL_NUMBER_AVERAGE_BOUND → TPL_M3_REAL_COMPARISON_BETWEEN**
- 이유: 두 실수 사이에 위치하는 수의 대소와 무리수 여부를 확인하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 평균의 대소 관계와 무리수 조건을 확인하는 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 무리수←stem:「다음 중 $\sqrt{3}$과 $\sqrt{5}$ 사이에 있는 무리수인 것은?」
- goal: 실수←solution:「1단계: 두 실수의 평균의 위치를 확인한다.」
- method: 조건(NAMED)←solution:「두 실수 사이에 존재하는 수의 성질과 무리수 조건을 확인한다.」
- condition: (없음)

**how** 두 무리수 사이의 값의 대소와 무리수 성질을 파악하였다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

두 실수 사이에 존재하는 수의 성질과 무리수 조건을 확인한다.


1단계: 두 실수의 평균의 위치를 확인한다. $$\sqrt{3} < \sqrt{5}$$이므로, 두 수의 평균 $\dfrac{\sqrt{3}+\sqrt{5}}{2}$는 항상 두 수 사이에 존재한다. $$\sqrt{3} < \frac{\sqrt{3}+\sqrt{5}}{2} < \sqrt{5}$$


2단계: $\dfrac{\sqrt{3}+\sqrt{5}}{2}$가 무리수인지 확인한다. $k = \dfrac{\sqrt{3}+\sqrt{5}}{2}$라 하면 $2k = \sqrt{3}+\sqrt{5}$이고, 양변을 제곱하면 $$4k^2 = 3 + 5 + 2\sqrt{15} = 8 + 2\sqrt{15}$$ $$\sqrt{15} = 2k^2 - 4$$ 만약 $k$가 유리수라면 $\sqrt{15}$도 유리수여야 하지만, $15$는 제곱수가 아니므로 $\sqrt{15}$는 무리수이다. 따라서 $k$는 무리수이다.


3단계: 다른 보기들의 위치를 확인한다. ② $\sqrt{5} < 2\sqrt{3} = \sqrt{12}$이므로 $\sqrt{5}-\sqrt{3} < \sqrt{3}$이다. ③ $\sqrt{3}+\sqrt{5} > \sqrt{5}$이다. ④ $2\sqrt{5}-\sqrt{3} = \sqrt{5} + (\sqrt{5}-\sqrt{3}) > \sqrt{5}$이다. ⑤ $\dfrac{\sqrt{5}-\sqrt{3}}{2} < \sqrt{3}$이다.


따라서 $\sqrt{3}$과 $\sqrt{5}$ 사이에 있는 무리수는 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

수직선 위에 한 변의 길이가 $1$인 정사각형 $\mathrm{ABCD}$가 있다. 꼭짓점 $\mathrm{B}$에 대응하는 수가 $2$이고 대각선 $\overline{\mathrm{BD}}$와 선분 $\overline{\mathrm{BP}}$의 길이가 같을 때, 점 $\mathrm{B}$의 오른쪽 수직선 위에서 점 $\mathrm{P}$에 대응하는 수는? [4점]

**보기** ① $1+\sqrt{2}$  ② $2+\sqrt{2}$  ③ $\sqrt{2}$  ④ $2-\sqrt{2}$  ⑤ $3+\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정사각형 $\text{ABCD}$의 대각선 $\text{BD}$의 길이는 피타고라스 정리에 의해 $\sqrt{1^2+1^2}=\sqrt{2}$이다.
2. 점 $\text{B}$의 좌표가 $1$이고 $\overline{\text{BP}}=\overline{\text{BD}}$이므로 점 $\text{P}$는 점 $\text{B}$에서 오른쪽으로 $\sqrt{2}$만큼 떨어진 점이다.
3. 따라서 점 $\text{P}$에 대응하는 수는 $1+\sqrt{2}$로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「수직선 위에 한 변의 길이가 $1$인 정사각형 $\mathrm{ABCD}$가 있다.」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수를 수직선 위에 나타내기 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 수직선과 제곱근에서 무리수의 수직선 대응 RPM 유형이다. (문항 토큰 ABCD)
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=TPL_M3_NUMBER_LINE_SQUARE_ROTATION **원천→판정: PT_M3_REAL_LINE_COORDINATE → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_PYTHAGORAS_COORDINATE_SHIFT → TPL_M3_NUMBER_LINE_SQUARE_ROTATION**
- 이유: 정사각형의 대각선을 회전시켜 수직선 위의 점의 좌표를 나타내는 유형이다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기준점과 방향, 대각선 길이를 조합하는 난이도 2 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 직선←stem:「수직선 위에 한 변의 길이가 $1$인 정사각형 $\mathrm{ABCD}$가 있다.」
- goal: 대응←stem:「점 $\mathrm{B}$의 오른쪽 수직선 위에서 점 $\mathrm{P}$에 대응하는 수는?」
- method: 좌표(NAMED)←solution:「피타고라스 정리를 이용하여 정사각형의 대각선 길이를 구하고, 기준점으로부터의 거리를 더해 점 $\mathrm{P}$의 좌표를 구한다.」
- condition: (없음)

**how** 피타고라스 정리로 대각선 길이를 구하고 기준점으로부터의 거리를 더해 좌표를 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리를 이용하여 정사각형의 대각선 길이를 구하고, 기준점으로부터의 거리를 더해 점 $\mathrm{P}$의 좌표를 구한다.


1단계: 정사각형의 대각선 길이를 구한다. 한 변의 길이가 $1$인 정사각형의 대각선 길이는 $$\overline{\mathrm{BD}} = \sqrt{1^2 + 1^2} = \sqrt{2}$$


2단계: 선분 $\overline{\mathrm{BP}}$의 길이와 점 $\mathrm{P}$의 위치를 파악한다. $$\overline{\mathrm{BP}} = \overline{\mathrm{BD}} = \sqrt{2}$$ 점 $\mathrm{P}$는 기준점 $\mathrm{B}(2)$의 오른쪽 방향에 위치하므로, 점 $\mathrm{P}$에 대응하는 수는 $$2 + \sqrt{2}$$


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 두 실수의 대소 관계가 옳은 것은? [4점]

**보기** ① $4 > \sqrt{10}+1$  ② $\sqrt{15}-2 > 2$  ③ $\sqrt{11}+2 > \sqrt{10}+2$  ④ $5-\sqrt{2} < \sqrt{24}-\sqrt{2}$  ⑤ $7-\sqrt{5} > \sqrt{50}-\sqrt{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 부등식 각 변을 제곱하면 $3^2 < 2x-1 \le 5^2$에서 $9 < 2x-1 \le 25$이다.
2. 각 변에 $1$을 더하면 $10 < 2x \le 26$이고, $2$로 나누면 $5 < x \le 13$이다.
3. 만족하는 자연수 $x$는 $6, 7, 8, 9, 10, 11, 12, 13$의 $8$개이다. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 두 실수의 대소 관계가 옳은 것은?」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 실수의 대소 관계 및 근호 부등식의 정수 해 RPM 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_INTEGER_RANGE **원천→판정: PT_M3_REAL_INEQUALITY_AUDIT → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_ROOT_INEQUALITY_SIMPLIFY → TPL_M3_REAL_COMPARISON_INTEGER_RANGE**
- 이유: 제곱근을 포함한 부등식을 만족하는 자연수 개수를 구하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부등식 변형과 자연수 개수 카운팅의 표준 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 실수←stem:「다음 중 두 실수의 대소 관계가 옳은 것은?」
- goal: 대소←solution:「부등식의 기본 성질을 이용하여 각 선지의 대소 관계를 판별한다.」
- method: 부등식(NAMED)←solution:「부등식의 기본 성질을 이용하여 각 선지의 대소 관계를 판별한다.」
- condition: (없음)

**how** 근호가 포함된 부등식의 각 변을 제곱하여 자연수 해의 개수를 세었다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

부등식의 기본 성질을 이용하여 각 선지의 대소 관계를 판별한다.


1단계: 각 보기를 차례로 확인한다. ① 양변에서 $1$을 빼면 $3 > \sqrt{10}$이 된다. $3 = \sqrt{9} < \sqrt{10}$이므로 성립하지 않는다. (거짓) ② 양변에 $2$를 더하면 $\sqrt{15} > 4$가 된다. $\sqrt{15} < \sqrt{16} = 4$이므로 성립하지 않는다. (거짓) ③ 양변에서 $2$를 빼면 $\sqrt{11} > \sqrt{10}$이 된다. $11 > 10$이므로 $\sqrt{11} > \sqrt{10}$은 참이다. 따라서 성립한다. (참) ④ 양변에 $\sqrt{2}$를 더하면 $5 < \sqrt{24}$가 된다. $5 = \sqrt{25} > \sqrt{24}$이므로 성립하지 않는다. (거짓) ⑤ 양변에 $\sqrt{5}$를 더하면 $7 > \sqrt{50}$이 된다. $7 = \sqrt{49} < \sqrt{50}$이므로 성립하지 않는다. (거짓)


따라서 옳은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

$\sqrt{75}-3\sqrt{3}$을 바르게 계산한 것은? [4점]

**보기** ① $-2\sqrt{3}$  ② $-\sqrt{3}$  ③ $0$  ④ $2\sqrt{3}$  ⑤ $3\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 근호 안의 수를 소인수분해하여 밖으로 꺼내면 $\sqrt{75} = 5\sqrt{3}$, $\sqrt{12} = 2\sqrt{3}$이다.
2. 식에 대입하면 $5\sqrt{3} - 2\sqrt{3} + 2\sqrt{3} = 5\sqrt{3}$이다.
3. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「근호 안의 제곱수를 밖으로 빼내어 동류항 계산을 수행한다.」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호를 포함한 식의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 근호의 덧셈과 뺄셈에서 동류근호 정리를 다루는 RPM 유형이다. (문항 토큰 75)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_SUBTRACTION_BASIC → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_EXTRACTION_SUB → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호를 포함한 식의 기본적인 덧셈과 뺄셈 혼합 계산 유형이다. (문항 토큰 75)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 간단한 근호 정리와 동류근호 계산의 난이도 1 문항이다. (문항 토큰 75)

**4칸**
- given: 제곱←solution:「근호 안의 제곱수를 밖으로 빼내어 동류항 계산을 수행한다.」
- goal: 변형←solution:「1단계: $\sqrt{75}$를 $a\sqrt{b}$ 꼴로 변형한다.」
- method: 동류항(NAMED)←solution:「근호 안의 제곱수를 밖으로 빼내어 동류항 계산을 수행한다.」
- condition: (없음)

**how** 근호 안의 제곱수를 밖으로 빼내어 동류근호끼리 덧셈과 뺄셈을 하였다. (문항 토큰 75)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 제곱수를 밖으로 빼내어 동류항 계산을 수행한다.


1단계: $\sqrt{75}$를 $a\sqrt{b}$ 꼴로 변형한다. $$\sqrt{75} = \sqrt{25 \times 3} = 5\sqrt{3}$$


2단계: 주어진 식을 계산한다. $$\sqrt{75} - 3\sqrt{3} = 5\sqrt{3} - 3\sqrt{3} = (5-3)\sqrt{3} = 2\sqrt{3}$$


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\sqrt{20}\times\sqrt{14}\times\sqrt{35}=a\sqrt{2}$일 때, 유리수 $a$의 값은? [4점]

**보기** ① $10$  ② $25$  ③ $35$  ④ $50$  ⑤ $70$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 식을 정리하면 $\sqrt{20} = 2\sqrt{5}$, $\sqrt{14} = \sqrt{2}\sqrt{7}$, $\sqrt{35} = \sqrt{5}\sqrt{7}$이다.
2. 곱셈과 나눗셈을 차례로 연산하면 $2\sqrt{5} \times \dots$ 계산 결과 $5$가 된다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「$\sqrt{20}\times\sqrt{14}\times\sqrt{35}=a\sqrt{2}$일 때, 유리수 $a$의 값은?」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호를 포함한 식의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호의 곱셈과 나눗셈을 다루는 RPM 유형이다. (문항 토큰 20)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_POWER_DIVISION **원천→판정: PT_M3_RADICAL_MULTIPLICATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_PRIME_FACTOR_PRODUCT → TPL_M3_RADICAL_POWER_DIVISION**
- 이유: 근호가 포함된 식의 곱셈과 나눗셈 연산 유형이다. (문항 토큰 20)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 약분과 소인수분해를 활용하는 난이도 2 문항이다. (문항 토큰 20)

**4칸**
- given: 유리수←stem:「$\sqrt{20}\times\sqrt{14}\times\sqrt{35}=a\sqrt{2}$일 때, 유리수 $a$의 값은?」
- goal: 소인수←solution:「1단계: 근호 안의 곱을 소인수분해 형태로 묶는다.」
- method: 제곱(NAMED)←solution:「3단계: 근호 밖으로 제곱수를 빼내어 $a$의 값을 구한다.」
- condition: (없음)

**how** 근호의 곱셈과 나눗셈 성질을 이용하여 식을 간단히 계산하였다. (문항 토큰 20)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수들을 소인수분해하여 제곱수를 밖으로 인출한다.


1단계: 근호 안의 곱을 소인수분해 형태로 묶는다. $$\sqrt{20} \times \sqrt{14} \times \sqrt{35} = \sqrt{20 \times 14 \times 35}$$ $$20 = 2^2 \times 5, \quad 14 = 2 \times 7, \quad 35 = 5 \times 7$$


2단계: 세 수의 곱을 소인수의 거듭제곱으로 정리한다. $$20 \times 14 \times 35 = (2^2 \times 5) \times (2 \times 7) \times (5 \times 7) = 2^3 \times 5^2 \times 7^2 = 2 \times (2 \times 5 \times 7)^2 = 2 \times 70^2$$


3단계: 근호 밖으로 제곱수를 빼내어 $a$의 값을 구한다. $$\sqrt{70^2 \times 2} = 70\sqrt{2}$$ 따라서 $a\sqrt{2} = 70\sqrt{2}$이므로 $a = 70$이다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\frac{3-2\sqrt{3}}{\sqrt{3}}=a+b\sqrt{3}$일 때, $a+b$의 값은? (단, $a$, $b$는 유리수이다.) [4점]

**보기** ① $-1$  ② $0$  ③ $1$  ④ $2$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모와 분자에 각각 분모의 무리수를 곱하여 유리화한다.
2. 유리화 결과 계수 $a, b$의 값을 구하여 $a+b$를 계산하면 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「(단, $a$, $b$는 유리수이다.) [4점]」
**RPM** M3-RPM-011 [실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 한 항의 유리화] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 한 항의 유리화**
- 이유: 분모의 유리화 기본 원리를 다루는 RPM 유형이다. (문항 토큰 3)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONALIZATION **원천→판정: PT_M3_DENOMINATOR_RATIONALIZE → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RATIONALIZATION_COEFF_SUM → TPL_M3_RADICAL_RATIONALIZATION**
- 이유: 한 항의 분모 유리화와 계수 비교 유형이다. (문항 토큰 3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 표준적인 분모 유리화 계산 난이도 2 문항이다. (문항 토큰 3)

**4칸**
- given: 유리수←stem:「(단, $a$, $b$는 유리수이다.) [4점]」
- goal: 유리화←solution:「1단계: 분모의 근호를 유리화한다.」
- method: 변형(NAMED)←solution:「분모를 유리화하거나 항별로 나누어 $a+b\sqrt{3}$ 꼴로 변형한다.」
- condition: (없음)

**how** 분모의 유리화를 수행하고 계수들을 비교하여 합을 구하였다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

분모를 유리화하거나 항별로 나누어 $a+b\sqrt{3}$ 꼴로 변형한다.


1단계: 분모의 근호를 유리화한다. $$\frac{3-2\sqrt{3}}{\sqrt{3}} = \frac{(3-2\sqrt{3})\sqrt{3}}{\sqrt{3} \times \sqrt{3}} = \frac{3\sqrt{3} - 6}{3}$$


2단계: 분수를 약분하여 유리수 부분과 무리수 부분으로 나눈다. $$\frac{3\sqrt{3} - 6}{3} = \sqrt{3} - 2 = -2 + 1\sqrt{3}$$


3단계: 유리수 $a, b$를 구하고 $a+b$를 계산한다. $$a = -2, \quad b = 1$$ $$a + b = -2 + 1 = -1$$


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

$\sqrt{18}-2\sqrt{24}-\sqrt{2}\left(1+\frac{12}{\sqrt{48}}\right)=a\sqrt{2}+b\sqrt{6}$이 성립할 때, $a+b$의 값은? (단, $a$, $b$는 유리수이다.) [5점]

**보기** ① $-5$  ② $-3$  ③ $0$  ④ $3$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분배법칙을 적용하여 $\sqrt{18}, \sqrt{24}, \sqrt{12}, \sqrt{48}$ 등을 간단히 정리한다.
2. 동류근호끼리 모아 정리한 결과 $a\sqrt{2}+b\sqrt{3}$ 꼴에서 $a, b$를 찾는다.
3. 따라서 계산 결과 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「(단, $a$, $b$는 유리수이다.) [5점]」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호를 포함한 복잡한 식의 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 근호의 사칙연산과 분배법칙을 다루는 RPM 유형이다. (문항 토큰 18)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_COMPLEX_RADICAL_EXPRESSION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_DISTRIBUTIVE_EVAL → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 분배법칙과 근호의 혼합 계산 유형이다. (문항 토큰 18)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 다단계 분배법칙과 동류근호 정리를 거치는 난이도 2 문항이다. (문항 토큰 18)

**4칸**
- given: 유리수←stem:「(단, $a$, $b$는 유리수이다.) [5점]」
- goal: 동류항←solution:「각 근호와 분수를 간단히 정리한 후 괄호를 전개하여 동류항끼리 묶는다.」
- method: 전개(NAMED)←solution:「각 근호와 분수를 간단히 정리한 후 괄호를 전개하여 동류항끼리 묶는다.」
- condition: (없음)

**how** 분배법칙을 전개하고 근호를 정리하여 유리수 계수를 구하였다. (문항 토큰 18)

<details><summary>저장 해설 (판정 검토용)</summary>

각 근호와 분수를 간단히 정리한 후 괄호를 전개하여 동류항끼리 묶는다.


1단계: 각 항을 $k\sqrt{m}$ 꼴로 변형한다. $$\sqrt{18} = 3\sqrt{2}$$ $$2\sqrt{24} = 2\sqrt{4 \times 6} = 4\sqrt{6}$$ $$\frac{12}{\sqrt{48}} = \frac{12}{4\sqrt{3}} = \frac{3}{\sqrt{3}} = \sqrt{3}$$


2단계: 괄호 안의 식에 대입하여 전개한다. $$\sqrt{2}\left(1+\frac{12}{\sqrt{48}}\right) = \sqrt{2}(1+\sqrt{3}) = \sqrt{2} + \sqrt{6}$$


3단계: 전체 식을 대입하여 계산한다. $$3\sqrt{2} - 4\sqrt{6} - (\sqrt{2} + \sqrt{6}) = (3-1)\sqrt{2} + (-4-1)\sqrt{6} = 2\sqrt{2} - 5\sqrt{6}$$


4단계: $a, b$를 구하고 $a+b$를 계산한다. $$a = 2, \quad b = -5$$ $$a + b = 2 + (-5) = -3$$


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

$x=\frac{\sqrt{7}+\sqrt{3}}{2}$, $y=\frac{\sqrt{7}-\sqrt{3}}{2}$일 때, $(x+y)(x-y)$의 값은? [4점]

**보기** ① $-\sqrt{21}$  ② $-4$  ③ $\sqrt{21}$  ④ $4$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모가 합·차 꼴이므로 켤레 무리수를 곱하여 분모를 유리화한다.
2. 전개 및 통분하여 정리하면 식이 간단히 계산되어 값은 $21$ 등이 된다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「두 식의 합과 차를 먼저 구한 후 곱셈을 진행한다.」
**RPM** M3-RPM-012 [실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 합·차 꼴의 유리화] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 곱셈 공식을 이용한 분모의 유리화 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 합·차 꼴의 유리화**
- 이유: 합·차 꼴의 분모 유리화를 다루는 RPM 유형이다. (문항 토큰 21)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONALIZATION **원천→판정: PT_M3_SYMMETRIC_SUM_DIFF_PRODUCT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_CONJUGATE_EVAL → TPL_M3_RADICAL_RATIONALIZATION**
- 이유: 곱셈공식을 이용한 분모의 유리화 유형이다. (문항 토큰 21)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 합차공식을 이용한 유리화 연산 난이도 2 문항이다. (문항 토큰 21)

**4칸**
- given: 합←solution:「두 식의 합과 차를 먼저 구한 후 곱셈을 진행한다.」
- goal: 값←stem:「$(x+y)(x-y)$의 값은? [4점]」
- method: 곱셈(NAMED)←solution:「두 식의 합과 차를 먼저 구한 후 곱셈을 진행한다.」
- condition: (없음)

**how** 합과 차의 곱셈공식을 이용하여 분모를 유리화하였다. (문항 토큰 21)

<details><summary>저장 해설 (판정 검토용)</summary>

두 식의 합과 차를 먼저 구한 후 곱셈을 진행한다.


1단계: $x+y$의 값을 구한다. $$x + y = \frac{(\sqrt{7}+\sqrt{3}) + (\sqrt{7}-\sqrt{3})}{2} = \frac{2\sqrt{7}}{2} = \sqrt{7}$$


2단계: $x-y$의 값을 구한다. $$x - y = \frac{(\sqrt{7}+\sqrt{3}) - (\sqrt{7}-\sqrt{3})}{2} = \frac{2\sqrt{3}}{2} = \sqrt{3}$$


3단계: $(x+y)(x-y)$의 값을 계산한다. $$(x+y)(x-y) = \sqrt{7} \times \sqrt{3} = \sqrt{21}$$


따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(3x-a)(2x+4)$를 전개한 식에서 $x$의 계수가 상수항보다 $8$만큼 크다고 할 때, 상수 $a$의 값은? [4점]

**보기** ① $-5$  ② $-4$  ③ $-3$  ④ $-2$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변 $(3x+a)(bx-4) = 3bx^2 + (ab-12)x - 4a$로 전개된다.
2. 우변 $12x^2+cx-12$와 계수를 비교하면 $3b=12 \implies b=4$, $-4a=-12 \implies a=3$이다.
3. $c = ab-12 = 3(4)-12 = 0$이므로 $a+b+c = 3+4+0 = 7$이다. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(3x-a)(2x+4)$를 전개한 식에서 $x$의 계수가 상수항보다 $8$만큼 크다고 할 때, 상수 $a$의 값은?」
**RPM** M3-RPM-017 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 다항식의 곱셈 공식 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱**
- 이유: 두 일차식의 곱 전개공식을 다루는 RPM 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_POLY_EXPANSION_COEFFICIENT_DETERMINATION **원천→판정: PT_M3_POLYNOMIAL_COEFFICIENT_EQ → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_COEFFICIENT_RELATION_LINEAR → TPL_M3_POLY_EXPANSION_COEFFICIENT_DETERMINATION**
- 이유: 다항식의 전개와 계수비교법으로 미정계수를 구하는 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 계수 비교를 통해 세 상수를 도출하는 난이도 2 문항이다. (문항 토큰 12)

**4칸**
- given: 계수←stem:「$(3x-a)(2x+4)$를 전개한 식에서 $x$의 계수가 상수항보다 $8$만큼 크다고 할 때, 상수 $a$의 값은?」
- goal: 상수←stem:「상수항보다 $8$만큼 크다고 할 때, 상수 $a$의 값은?」
- method: 전개(NAMED)←solution:「다항식을 전개하여 $x$의 계수와 상수항을 $a$에 관한 식으로 나타낸 후 일차방정식을 세워 푼다.」
- condition: (없음)

**how** 두 일차식을 전개하여 동류항끼리 묶은 뒤 양변의 계수를 비교하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

다항식을 전개하여 $x$의 계수와 상수항을 $a$에 관한 식으로 나타낸 후 일차방정식을 세워 푼다.


1단계: 식을 전개하여 동류항별로 묶는다. $$(3x-a)(2x+4) = 6x^2 + 12x - 2ax - 4a = 6x^2 + (12-2a)x - 4a$$


2단계: $x$의 계수와 상수항을 확인한다. $$x\text{의 계수}: 12 - 2a, \quad \text{상수항}: -4a$$


3단계: 주어진 조건에 따라 일차방정식을 세우고 $a$를 구한다. $$(12 - 2a) = -4a + 8$$ $$-2a + 4a = 8 - 12$$ $$2a = -4$$ $$a = -2$$


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 식을 전개하였을 때, $x$의 계수의 절댓값이 가장 큰 것은? [4점]

**보기** ① $(3x+2)^2$  ② $(4x-3)(2x+1)$  ③ $(5x-1)^2$  ④ $(2x+5)(3x+2)$  ⑤ $(6x-3)^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 보기를 전개하면 ①은 $x$의 계수가 $12$, ②는 $-2$, ③은 $-10$, ④는 $19$이다.
2. ⑤번 식 $(6x-3)^2 = 36x^2-36x+9$에서 $x$의 계수의 절댓값은 $36$이다.
3. 따라서 $x$의 계수의 절댓값이 $36$으로 가장 큰 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 식을 전개하였을 때, $x$의 계수의 절댓값이 가장 큰 것은?」
**RPM** M3-RPM-015 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합·차의 제곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식의 응용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합·차의 제곱**
- 이유: 곱셈공식의 전개와 계수 판별 RPM 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_POLY_EXPANSION_COEFFICIENT **원천→판정: PT_M3_EXPANSION_COEFF_MAX → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_COEFFICIENT_ABSOLUTE_COMPARE → TPL_M3_POLY_EXPANSION_COEFFICIENT**
- 이유: 다항식의 곱셈공식 전개식에서 특정 계수의 크기를 판별하는 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 전개식을 빠르게 비교하는 난이도 2 문항이다. (문항 토큰 12)

**4칸**
- given: 전개←stem:「다음 식을 전개하였을 때, $x$의 계수의 절댓값이 가장 큰 것은?」
- goal: 절댓값←stem:「$x$의 계수의 절댓값이 가장 큰 것은?」
- method: 비교(NAMED)←solution:「각 보기를 전개하여 $x$의 계수를 구하고 절댓값을 비교한다.」
- condition: (없음)

**how** 곱셈공식을 적용하여 식을 전개하고 계수의 절댓값을 비교하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 전개하여 $x$의 계수를 구하고 절댓값을 비교한다.


1단계: 각 식의 $x$의 계수를 전개 공식을 통해 계산한다. ① $(3x+2)^2 = 9x^2 + 12x + 4$이므로 $x$의 계수는 $12$, 절댓값은 $|12| = 12$이다. ② $(4x-3)(2x+1) = 8x^2 + (4-6)x - 3 = 8x^2 - 2x - 3$이므로 $x$의 계수는 $-2$, 절댓값은 $|-2| = 2$이다. ③ $(5x-1)^2 = 25x^2 - 10x + 1$이므로 $x$의 계수는 $-10$, 절댓값은 $|-10| = 10$이다. ④ $(2x+5)(3x+2) = 6x^2 + (4+15)x + 10 = 6x^2 + 19x + 10$이므로 $x$의 계수는 $19$, 절댓값은 $|19| = 19$이다. ⑤ $(6x-3)^2 = 36x^2 - 36x + 9$이므로 $x$의 계수는 $-36$, 절댓값은 $|-36| = 36$이다.


2단계: 절댓값의 크기를 비교한다. 절댓값은 각각 $12, 2, 10, 19, 36$이므로 가장 큰 것은 ⑤이다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$x^2+(2p-3)x+49$가 완전제곱식이 될 때, 상수 $p$의 모든 값의 합은? [4점]

**보기** ① $3$  ② $2$  ③ $1$  ④ $-1$  ⑤ $-3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차식 $x^2+ax+49$가 완전제곱식이 되려면 $a = \pm 2\sqrt{49} = \pm 14$이다.
2. 조건에 따라 양수 또는 가능한 $a$의 값을 구하면 $14$이다.
3. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x^2+(2p-3)x+49$가 완전제곱식이 될 때, 상수 $p$의 모든 값의 합은?」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 완전제곱식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식**
- 이유: 인수분해 공식 중 완전제곱식 조건을 다루는 RPM 유형이다. (문항 토큰 49)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_PERFECT_SQUARE_CONDITION **원천→판정: PT_M3_PERFECT_SQUARE_COEFF_SUM → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_PERFECT_SQUARE_PARAM_SUM → TPL_M3_PERFECT_SQUARE_CONDITION**
- 이유: 이차식이 완전제곱식이 될 조건을 이용하여 미정계수를 구하는 유형이다. (문항 토큰 49)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 완전제곱식 계수 공식으로 해결되는 난이도 2 문항이다. (문항 토큰 49)

**4칸**
- given: 제곱←stem:「$x^2+(2p-3)x+49$가 완전제곱식이 될 때, 상수 $p$의 모든 값의 합은?」
- goal: 상수←stem:「상수 $p$의 모든 값의 합은?」
- method: 이차식(NAMED)←solution:「이차식이 완전제곱식이 될 조건을 이용하여 $p$의 값을 구하고 합산한다.」
- condition: (없음)

**how** 완전제곱식이 되기 위한 일차항 계수와 상수항의 관계를 적용하였다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

이차식이 완전제곱식이 될 조건을 이용하여 $p$의 값을 구하고 합산한다.


1단계: 최고차항의 계수가 $1$인 이차식이 완전제곱식이 될 조건을 적용한다. 상수항이 $49 = (\pm 7)^2$이므로 완전제곱식은 $(x+7)^2$ 또는 $(x-7)^2$이다. $$(x \pm 7)^2 = x^2 \pm 14x + 49$$


2단계: 일차항의 계수를 비교하여 $p$의 방정식을 세운다. $$2p - 3 = 14 \quad \text{또는} \quad 2p - 3 = -14$$


3단계: 각 경우의 $p$의 값을 구한다. $$2p = 17 \implies p = \frac{17}{2}$$ $$2p = -11 \implies p = -\frac{11}{2}$$


4단계: 모든 $p$의 값의 합을 계산한다. $$p_1 + p_2 = \frac{17}{2} + \left(-\frac{11}{2}\right) = \frac{6}{2} = 3$$


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$-2 < a < 5$일 때, $\sqrt{a^2-10a+25}-\sqrt{a^2+4a+4}$를 간단히 하면? [4점]

**보기** ① $-2a-7$  ② $-2a+3$  ③ $-2a-3$  ④ $2a+7$  ⑤ $2a-3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 근호 안의 식을 완전제곱식으로 고치면 $\sqrt{a^2-10a+25} = \sqrt{(a-5)^2}$이고 $\sqrt{a^2+4a+4} = \sqrt{(a+2)^2}$이다.
2. $-2 < a < 5$에서 $a-5 < 0$이므로 $\sqrt{(a-5)^2} = -(a-5) = -a+5$이고, $a+2 > 0$이므로 $\sqrt{(a+2)^2} = a+2$이다.
3. 따라서 $(-a+5) - (a+2) = -2a+3$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「근호 안의 식을 완전제곱식으로 인수분해한 후 주어진 범위에서 부호를 판정한다.」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호가 있는 식의 변형 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 제곱근의 성질을 이용하여 식을 간단히 정리하는 RPM 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ABSOLUTE **원천→판정: PT_M3_ROOT_SQUARE_RANGE_SIMPLIFY → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_INTERVAL_ABSOLUTE_EVAL → TPL_M3_ROOT_PROPERTY_ABSOLUTE**
- 이유: 변수의 범위가 주어졌을 때 근호 안의 완전제곱식을 절댓값으로 푸는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 부호 판별과 식의 덧셈을 결합한 표준 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 제곱←solution:「근호 안의 식을 완전제곱식으로 인수분해한 후 주어진 범위에서 부호를 판정한다.」
- goal: 부호←solution:「2단계: 주어진 범위 $-2 < a < 5$에서 각 식의 부호를 판별한다.」
- method: 절댓값(NAMED)←solution:「3단계: 절댓값을 풀고 식을 정리한다.」
- condition: (없음)

**how** 주어진 범위에서 각 인수의 부호를 판정하여 근호를 벗겨 식을 간단히 하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 식을 완전제곱식으로 인수분해한 후 주어진 범위에서 부호를 판정한다.


1단계: 근호 안의 식을 완전제곱식으로 변형한다. $$a^2 - 10a + 25 = (a-5)^2$$ $$a^2 + 4a + 4 = (a+2)^2$$ $$\sqrt{a^2-10a+25} - \sqrt{a^2+4a+4} = \sqrt{(a-5)^2} - \sqrt{(a+2)^2} = |a-5| - |a+2|$$


2단계: 주어진 범위 $-2 < a < 5$에서 각 식의 부호를 판별한다. $$a < 5 \implies a - 5 < 0 \implies |a-5| = -(a-5) = 5 - a$$ $$a > -2 \implies a + 2 > 0 \implies |a+2| = a + 2$$


3단계: 절댓값을 풀고 식을 정리한다. $$(5 - a) - (a + 2) = 5 - a - a - 2 = -2a + 3$$


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 인수분해한 것이 옳지 않은 것은? [3점]

**보기** ① $x^2-25=(x+5)(x-5)$  ② $4x^2-12xy+9y^2=(2x-3y)^2$  ③ $2x^2+5x-3=(x+3)(2x+1)$  ④ $x^2+6x+9=(x+3)^2$  ⑤ $x^2-5x-14=(x-7)(x+2)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 보기를 인수분해 공식을 적용하여 점검한다.
2. ③번 보기는 $x^2+xy-12y^2 = (x+4y)(x-3y)$ 등으로 바르게 인수분해되었다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 인수분해한 것이 옳지 않은 것은?」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 인수분해 기본 공식의 적용을 확인하는 RPM 유형이다. (문항 토큰 25)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_FORMULA_APPLICATION **원천→판정: PT_M3_FACTORIZATION_CORRECTNESS → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_FACTORIZATION_TRUTH_EVAL → TPL_M3_FACTORIZATION_FORMULA_APPLICATION**
- 이유: 인수분해 공식의 올바른 적용 여부를 종합적으로 판별하는 유형이다. (문항 토큰 25)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다양한 인수분해 공식을 대조하는 난이도 2 문항이다. (문항 토큰 25)

**4칸**
- given: 인수분해←stem:「다음 중 인수분해한 것이 옳지 않은 것은?」
- goal: 인수분해←solution:「올바른 인수분해는 $(x+3)(2x-1)$이다.」
- method: 전개(NAMED)←solution:「각 보기를 전개하여 좌변과 일치하는지 확인한다.」
- condition: (없음)

**how** 인수분해 공식을 각 보기에 적용하여 옳게 분해된 식을 골랐다. (문항 토큰 25)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 전개하여 좌변과 일치하는지 확인한다.


1단계: 각 보기를 차례로 검토한다. ① $(x+5)(x-5) = x^2 - 25$로 옳다. ② $(2x-3y)^2 = 4x^2 - 12xy + 9y^2$으로 옳다. ③ 우변을 전개하면 $$(x+3)(2x+1) = 2x^2 + x + 6x + 3 = 2x^2 + 7x + 3$$ 좌변의 $2x^2 + 5x - 3$과 다르므로 옳지 않다. 올바른 인수분해는 $(x+3)(2x-1)$이다. ④ $(x+3)^2 = x^2 + 6x + 9$로 옳다. ⑤ $(x-7)(x+2) = x^2 - 5x - 14$로 옳다.


따라서 옳지 않은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$3(x+2y)^2-2(x+2y)-5$를 인수분해하면 $(3x+ay+b)(x+cy+d)$일 때, 수 $a, b, c, d$에 대하여 $ad+bc$의 값은? (단, $a>0$, $c>0$) [5점]

**보기** ① $-16$  ② $-10$  ③ $-7$  ④ $-4$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $X = x+2y$로 치환하면 $3X^2-2X-5 = (3X-5)(X+1)$이다.
2. $X = x+2y$를 대입하여 정리하면 $(3x+6y-5)(x+2y+1)$이다.
3. $(3x+ay+b)(x+cy+d)$와 비교하면 $a=6, b=-5, c=2, d=1$이므로 $ad+bc = 6(1) + (-5)(2) = -4$이다. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3(x+2y)^2-2(x+2y)-5$를 인수분해하면 $(3x+ay+b)(x+cy+d)$일 때, 수 $a, b, c, d$에 대하여 $ad+bc$의 값은?」
**RPM** M3-RPM-022 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 단계적 인수분해] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 복잡한 식의 인수분해 → 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 단계적 인수분해**
- 이유: 공통부분이 있는 다항식의 인수분해 RPM 유형이다. (문항 토큰 ay)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_SUBSTITUTION_FACTORIZATION **원천→판정: PT_M3_SUBSTITUTION_FACTORIZATION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_COMMON_PART_SUBSTITUTION_EVAL → TPL_M3_SUBSTITUTION_FACTORIZATION**
- 이유: 치환을 이용한 복잡한 식의 인수분해 유형이다. (문항 토큰 ay)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 치환과 환원의 2단계를 요하는 난이도 3 문항이다. (문항 토큰 ay)

**4칸**
- given: 인수분해←stem:「$3(x+2y)^2-2(x+2y)-5$를 인수분해하면 $(3x+ay+b)(x+cy+d)$일 때, 수 $a, b, c, d$에 대하여 $ad+bc$의 값은?」
- goal: 이차식←solution:「2단계: $t$에 관한 이차식을 인수분해한다.」
- method: 치환(NAMED)←solution:「1단계: $x+2y = t$로 치환한다.」
- condition: (없음)

**how** 공통부분을 치환하여 이차식으로 변형한 후 인수분해를 완료하였다. (문항 토큰 ay)

<details><summary>저장 해설 (판정 검토용)</summary>

반복되는 일차식 $x+2y$를 치환하여 인수분해한 후 원래 문자를 대입한다.


1단계: $x+2y = t$로 치환한다. $$3t^2 - 2t - 5$$


2단계: $t$에 관한 이차식을 인수분해한다. $$3t^2 - 2t - 5 = (3t - 5)(t + 1)$$


3단계: $t = x+2y$를 다시 대입하여 정리한다. $$(3(x+2y) - 5)((x+2y) + 1) = (3x + 6y - 5)(x + 2y + 1)$$


4단계: 계수 $a, b, c, d$를 비교한다. $$(3x + ay + b)(x + cy + d) = (3x + 6y - 5)(x + 2y + 1)$$ $a>0, c>0$ 조건이 만족되므로, $$a = 6, \quad b = -5, \quad c = 2, \quad d = 1$$


5단계: $ad+bc$의 값을 계산한다. $$ad + bc = 6 \times 1 + (-5) \times 2 = 6 - 10 = -4$$


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(1-a)(1+a)(1+a^2)(1+a^4)(1+a^8)(1+a^{16})(1+a^{32})=p-a^q$일 때, 두 수 $p, q$에 대하여 $q-p$의 값을 구하면? [5점]

**보기** ① $15$  ② $31$  ③ $32$  ④ $62$  ⑤ $63$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(1-a)(1+a) = 1-a^2$부터 시작하여 연쇄적으로 합차공식을 적용한다.
2. $(1-a^2)(1+a^2)=1-a^4, \dots, (1-a^{32})(1+a^{32}) = 1-a^{64}$이다.
3. $p=1, q=64$이므로 $q-p = 64-1 = 63$으로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「합과 차의 곱셈 공식 $(X-Y)(X+Y) = X^2 - Y^2$을 반복적으로 적용한다.」
**RPM** M3-RPM-016 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합과 차의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식의 응용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합과 차의 곱**
- 이유: 합과 차의 곱을 연쇄적으로 활용하는 곱셈공식 RPM 유형이다. (문항 토큰 16)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_CHAIN **원천→판정: PT_M3_CHAIN_SUM_DIFF_EXPANSION → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_CASCADE_SQUARE_DIFFERENCE → TPL_M3_MULTIPLICATION_CHAIN**
- 이유: 합차공식을 반복 적용하여 거듭제곱 다항식을 간단히 하는 유형이다. (문항 토큰 16)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 연쇄적 곱셈공식 규칙을 추론하는 난이도 3 문항이다. (문항 토큰 16)

**4칸**
- given: 곱셈←solution:「합과 차의 곱셈 공식 $(X-Y)(X+Y) = X^2 - Y^2$을 반복적으로 적용한다.」
- goal: 비교←solution:「3단계: 우변의 $p - a^q$와 계수를 비교한다.」
- method: 인수(NAMED)←solution:「1단계: 앞의 두 인수를 곱한다.」
- condition: (없음)

**how** 합과 차의 곱셈공식을 연쇄적으로 적용하여 거듭제곱 형태의 식을 전개하였다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

합과 차의 곱셈 공식 $(X-Y)(X+Y) = X^2 - Y^2$을 반복적으로 적용한다.


1단계: 앞의 두 인수를 곱한다. $$(1-a)(1+a) = 1 - a^2$$


2단계: 차례로 다음 인수들을 곱해 나간다. $$(1-a^2)(1+a^2) = 1 - a^4$$ $$(1-a^4)(1+a^4) = 1 - a^8$$ $$(1-a^8)(1+a^8) = 1 - a^{16}$$ $$(1-a^{16})(1+a^{16}) = 1 - a^{32}$$ $$(1-a^{32})(1+a^{32}) = 1 - a^{64}$$


3단계: 우변의 $p - a^q$와 계수를 비교한다. $$1 - a^{64} = p - a^q$$ $$p = 1, \quad q = 64$$


4단계: $q-p$의 값을 구한다. $$q - p = 64 - 1 = 63$$


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서·논술형 1] $$\sqrt{54}\left(\frac{1}{\sqrt{2}}-\sqrt{6}\right)-\frac{a}{\sqrt{3}}(\sqrt{48}-3)\text{이 유리수일 때,}$$ 유리수 $a$의 값을 구하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-3$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 첫 번째 항을 분배하면 $\sqrt{54}\left(\frac{1}{\sqrt{2}}-\sqrt{6}\right) = \sqrt{27}-\sqrt{324} = 3\sqrt{3}-18$이다.
2. 두 번째 항은 $\frac{a}{\sqrt{3}}(4\sqrt{3}-3) = 4a - a\sqrt{3}$이다.
3. 전체 식은 $(-18-4a) + (3+a)\sqrt{3}$이며, 유리수가 되려면 $3+a=0 \implies a=-3$이다.
- 작성자 답: $-3$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「[서·논술형 1] $$\sqrt{54}\left(\frac{1}{\sqrt{2}}-\sqrt{6}\right)-\frac{a}{\sqrt{3}}(\sqrt{48}-3)\text{이 유리수일 때,}$$ 유리수 $a$의 값을 구하시오.」
**RPM** M3-RPM-014 [실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호를 포함한 식의 계산의 응용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값**
- 이유: 근호를 포함한 식의 계산과 식의 값 RPM 유형이다. (문항 토큰 54)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONAL_CONDITION **원천→판정: PT_M3_EXPRESSION_BECOMES_RATIONAL → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_EQUALS_RATIONAL_CONDITION → TPL_M3_RADICAL_RATIONAL_CONDITION**
- 이유: 근호가 포함된 식의 계산 결과가 유리수가 될 조건을 구하는 서술형 유형이다. (문항 토큰 54)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분배법칙 전개와 무리수 계수 $0$ 조건을 논리적으로 서술하는 난이도 3 문항이다. (문항 토큰 54)

**4칸**
- given: 유리수←stem:「[서·논술형 1] $$\sqrt{54}\left(\frac{1}{\sqrt{2}}-\sqrt{6}\right)-\frac{a}{\sqrt{3}}(\sqrt{48}-3)\text{이 유리수일 때,}$$ 유리수 $a$의 값을 구하시오.」
- goal: 값←stem:「유리수 $a$의 값을 구하시오.」
- method: 전개(NAMED)←solution:「1단계: 첫 번째 항을 분배법칙으로 전개하여 간단히 한다.」
- condition: (없음)

**how** 식을 전개하여 유리수 부분과 무리수 부분으로 정리하고 무리수 항의 계수를 $0$으로 놓았다. (문항 토큰 54)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식을 전개하여 유리수 부분과 무리수 부분으로 정리한 후, 식이 유리수가 되기 위한 무리수 항의 계수 조건을 세워 $a$를 구한다.


1단계: 첫 번째 항을 분배법칙으로 전개하여 간단히 한다. $$\sqrt{54}\left(\frac{1}{\sqrt{2}}-\sqrt{6}\right) = \sqrt{\frac{54}{2}} - \sqrt{54 \times 6} = \sqrt{27} - \sqrt{324}$$ $$\sqrt{27} = 3\sqrt{3}, \quad \sqrt{324} = 18$$ 따라서 첫 번째 항은 $$3\sqrt{3} - 18$$


2단계: 두 번째 항을 분배법칙으로 전개하여 정리한다. $$\frac{a}{\sqrt{3}}(\sqrt{48}-3) = \frac{a}{\sqrt{3}}(4\sqrt{3}-3) = 4a - \frac{3a}{\sqrt{3}} = 4a - a\sqrt{3}$$


3단계: 전체 식을 유리수 부분과 무리수 부분으로 정리한다. $$(3\sqrt{3} - 18) - (4a - a\sqrt{3}) = (-18 - 4a) + (3 + a)\sqrt{3}$$


4단계: $a$가 유리수이므로 $-18-4a$와 $3+a$도 유리수이다. 전체 식이 유리수가 되려면 무리수 $\sqrt{3}$의 계수가 $0$이어야 한다. $$3 + a = 0 \implies a = -3$$ 이때 식의 값은 $-18 - 4(-3) = -6$으로 유리수가 된다.


따라서 유리수 $a$의 값은 $-3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서·논술형 2] 밑면의 한 변의 길이가 각각 $30,\mathrm{cm}$, $50,\mathrm{cm}$인 정사각형이고, 높이는 모두 $10,\mathrm{cm}$인 직육면체 모양의 두 상자를 끈으로 묶으려고 한다. 작은 상자는 큰 상자 가운데 올려놓고 십자 모양으로 묶어 매듭을 매려고 한다. 매듭을 묶는 데 필요한 끈의 길이가 $30,\mathrm{cm}$일 때, 필요한 총 끈의 길이를 구하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $230+40\sqrt{2},\mathrm{cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 피타고라스 정리에 의해 사선 부분 하나의 길이는 $\sqrt{10^2+10^2} = 10\sqrt{2},(\mathrm{cm})$이다.
2. 한 방향 끈의 길이는 $30 + 2(10\sqrt{2}) + 20 + 50 = 100 + 20\sqrt{2},(\mathrm{cm})$이다.
3. 십자 묶음과 매듭 $30,\mathrm{cm}$를 합하면 $2(100+20\sqrt{2}) + 30 = 230 + 40\sqrt{2},(\mathrm{cm})$이다.
- 작성자 답: $230+40\sqrt{2},\mathrm{cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) **원천→판정: M3-01-OPERATIONS_OF_ROOTS → M3-01-REAL_NUMBER_OPERATIONS**
- 근거 인용: 「[서·논술형 2] 밑면의 한 변의 길이가 각각 $30,\mathrm{cm}$, $50,\mathrm{cm}$인 정사각형이고, 높이는 모두 $10,\mathrm{cm}$인 직육면체 모양의 두 상자를 끈으로 묶으려고 한다.」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호를 포함한 식의 계산의 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 근호를 포함한 식의 계산의 실생활 활용 RPM 유형이다. (문항 토큰 30)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_GEOMETRY **원천→판정: PT_M3_RADICAL_REAL_WORLD_BOX_TIE → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_PYTHAGORAS_BOX_STRING_SUM → TPL_M3_RADICAL_GEOMETRY**
- 이유: 입체도형을 끈으로 묶는 실생활 상황에서 피타고라스 정리와 무리수를 활용하는 서술형 유형이다. (문항 토큰 30)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 공간 지각과 피타고라스 정리, 다단계 덧셈이 요구되는 서술형 난이도 3 문항이다. (문항 토큰 30)

**4칸**
- given: 사각형←stem:「[서·논술형 2] 밑면의 한 변의 길이가 각각 $30,\mathrm{cm}$, $50,\mathrm{cm}$인 정사각형이고, 높이는 모두 $10,\mathrm{cm}$인 직육면체 모양의 두 상자를 끈으로 묶으려고 한다.」
- goal: 길이←stem:「매듭을 묶는 데 필요한 끈의 길이가 $30,\mathrm{cm}$일 때, 필요한 총 끈의 길이를 구하시오.」
- method: 단면(NAMED)←solution:「상자의 단면에서 피타고라스 정리를 이용하여 사선 부분의 길이를 구하고, 십자 방향의 끈 전체 길이에 매듭 길이를 더한다.」
- condition: (없음)

**how** 단면에서 피타고라스 정리로 대각선 길이를 구하고 십자 끈과 매듭의 총 길이를 합산하였다. (문항 토큰 30)

<details><summary>저장 해설 (판정 검토용)</summary>

상자의 단면에서 피타고라스 정리를 이용하여 사선 부분의 길이를 구하고, 십자 방향의 끈 전체 길이에 매듭 길이를 더한다.


1단계: 작은 상자와 큰 상자 사이의 사선 부분의 길이를 구한다. 작은 상자가 큰 상자의 중앙에 놓여 있으므로 한쪽 수평 간격은 $$\frac{50 - 30}{2} = 10,(\mathrm{cm})$$ 작은 상자의 윗면과 큰 상자의 윗면 사이의 높이 차도 작은 상자의 높이와 같으므로 $10,\mathrm{cm}$이다. 피타고라스 정리에 따라 사선 부분 하나의 길이는 $$\sqrt{10^2 + 10^2} = \sqrt{200} = 10\sqrt{2},(\mathrm{cm})$$


2단계: 한 방향으로 상자를 둘러싸는 끈의 길이를 구한다. 한 방향의 끈은 다음 구간들을 지난다.


* 작은 상자 윗면: $30,\mathrm{cm}$
* 사선 부분 2곳: $2 \times 10\sqrt{2} = 20\sqrt{2},(\mathrm{cm})$
* 큰 상자 옆면 2곳: $2 \times 10 = 20,\mathrm{cm}$
* 큰 상자 밑면: $50,\mathrm{cm}$ 따라서 한 방향의 끈의 길이는 $$30 + 20\sqrt{2} + 20 + 50 = 100 + 20\sqrt{2},(\mathrm{cm})$$


3단계: 십자 모양 끈의 전체 길이와 매듭 길이를 합산한다. 직교하는 두 방향으로 묶으므로 두 배를 하고 매듭용 끈 $30,\mathrm{cm}$를 더한다. $$2(100 + 20\sqrt{2}) + 30 = 200 + 40\sqrt{2} + 30 = 230 + 40\sqrt{2},(\mathrm{cm})$$


따라서 필요한 총 끈의 길이는 $230+40\sqrt{2},\mathrm{cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 3] 한 변의 길이가 각각 $x$와 $y$인 두 정사각형이 있다. 두 정사각형의 둘레의 길이의 합은 $60$이고, 넓이의 합은 $125$이다. 두 정사각형의 둘레의 길이의 곱을 구하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $800$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 정사각형의 둘레의 합에서 $4x+4y=60 \implies x+y=15$이고, 넓이의 합에서 $x^2+y^2=125$이다.
2. $(x+y)^2 = x^2+y^2+2xy$에 대입하면 $225 = 125+2xy \implies 2xy=100 \implies xy=50$이다.
3. 두 정사각형의 둘레의 곱은 $(4x)(4y) = 16xy = 16 \times 50 = 800$이다.
- 작성자 답: $800$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 3] 한 변의 길이가 각각 $x$와 $y$인 두 정사각형이 있다.」
**RPM** M3-RPM-020 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 도형 활용] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식의 활용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 도형 활용**
- 이유: 곱셈공식의 도형 활용 RPM 유형이다. (문항 토큰 60)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING **원천→판정: PT_M3_SQUARE_PERIMETER_AREA_SYSTEM → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_GEOMETRIC_SUM_SQUARES_PRODUCT → TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING**
- 이유: 도형의 둘레와 넓이 조건을 곱셈공식의 변형과 연계하여 식의 값을 구하는 서술형 유형이다. (문항 토큰 60)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 곱셈공식 변형과 도형 둘레 곱 계산을 논리적으로 전개하는 서술형 난이도 3 문항이다. (문항 토큰 60)

**4칸**
- given: 사각형←stem:「[서·논술형 3] 한 변의 길이가 각각 $x$와 $y$인 두 정사각형이 있다.」
- goal: 곱셈←solution:「정사각형의 둘레와 넓이 공식을 곱셈 공식의 변형과 연계하여 문제를 해결한다.」
- method: 변형(NAMED)←solution:「정사각형의 둘레와 넓이 공식을 곱셈 공식의 변형과 연계하여 문제를 해결한다.」
- condition: (없음)

**how** 도형 조건을 곱셈공식 변형식에 대입하여 미지수의 곱을 구하고 둘레의 곱을 계산하였다. (문항 토큰 60)

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형의 둘레와 넓이 공식을 곱셈 공식의 변형과 연계하여 문제를 해결한다.


1단계: 둘레의 합 조건을 식으로 나타낸다. 정사각형의 둘레는 한 변의 길이의 $4$배이므로 $$4x + 4y = 60 \implies 4(x+y) = 60 \implies x + y = 15$$


2단계: 넓이의 합 조건을 식으로 나타낸다. 정사각형의 넓이는 (한 변의 길이)$^2$이므로 $$x^2 + y^2 = 125$$


3단계: 곱셈 공식을 이용하여 $xy$의 값을 구한다. $$(x+y)^2 = x^2 + y^2 + 2xy$$ 두 조건을 대입하면 $$15^2 = 125 + 2xy$$ $$225 = 125 + 2xy$$ $$2xy = 100 \implies xy = 50$$


4단계: 두 정사각형의 둘레의 길이의 곱을 구한다. 두 둘레의 곱은 $$(4x) \times (4y) = 16xy$$ $xy = 50$을 대입하면 $$16 \times 50 = 800$$


따라서 두 정사각형의 둘레의 길이의 곱은 $800$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
