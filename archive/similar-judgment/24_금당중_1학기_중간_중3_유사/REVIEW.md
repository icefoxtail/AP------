# 검수 묶음 — 24_금당중_1학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 24개 / 검사 PASS 21, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 22, SELF_CONTAINED 2
- 난이도 분포: 1단계 10, 2단계 14
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (RPM, PT)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q24**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, PT)

**발문**

다음 중 제곱근에 대한 설명으로 옳은 것은? [3점]

**보기** ① $7$은 $49$의 양의 제곱근이다.  ② $-3$은 $-9$의 음의 제곱근이다.  ③ 제곱근 $7$은 $\pm\sqrt{7}$이다.  ④ 모든 실수의 제곱근은 항상 $2$개이다.  ⑤ $\sqrt{25} = \pm 5$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $7^2 = 49$이고 $7 > 0$이므로 $7$은 $49$의 양의 제곱근이다. (참)
2. 실수 범위에서 음수의 제곱근은 존재하지 않으므로 $-3$은 $-9$의 음의 제곱근이 아니다.
3. 따라서 옳은 설명은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 제곱근에 대한 설명으로 옳은 것은?」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 개념과 정의를 묻는 제곱근의 뜻 유형이다. (문항 토큰 49)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_CHECK → PT_M3_SQUARE_ROOT_PROPERTY** (원천과 같음)
- 이유: 제곱근의 정의와 성질에 관한 각 선지의 참·거짓을 판별하는 유형이다. (문항 토큰 49)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 제곱근의 기본 개념 정의를 확인하는 난이도 1 문항이다. (문항 토큰 49)

**4칸**
- given: 제곱근←stem:「다음 중 제곱근에 대한 설명으로 옳은 것은?」
- goal: 제곱근←stem:「제곱근에 대한 설명으로 옳은 것은?」
- method: 제곱근(NAMED)←solution:「$7$은 $49$의 양의 제곱근이다.」
- condition: 제곱근←choices:「$7$은 $49$의 양의 제곱근이다.」

**how** 제곱근의 정의를 각 선지의 진위와 대조하여 1번 선지가 참임을 판별했다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 정의와 성질을 각 선지에 대조하여 참과 거짓을 판별한다.


1단계: 각 선지의 진위를 검토한다. ① $7^2 = 49$이고 $7 > 0$이므로 $7$은 $49$의 양의 제곱근이다. (참) ② 실수 범위에서 음수의 제곱근은 존재하지 않으므로 $-3$이 $-9$의 음의 제곱근이라는 설명은 거짓이다. ③ '제곱근 $7$'은 기호 $\sqrt{7}$을 읽은 것이므로 양의 제곱근 $\sqrt{7}$이다. $\pm\sqrt{7}$이라 하였으므로 거짓이다. ④ $0$의 제곱근은 $0$ 하나뿐이고 음수의 제곱근은 없으므로 항상 $2$개라는 설명은 거짓이다. ⑤ 근호 $\sqrt{25}$는 $25$의 양의 제곱근을 나타내므로 $\sqrt{25} = 5$이다. $\pm 5$라 한 것은 거짓이다.


2단계: 옳은 선지를 선택한다. 따라서 옳은 것은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 계산 결과가 옳은 것은? [3점]

**보기** ① $\sqrt{3}+\sqrt{5} = \sqrt{8}$  ② $\sqrt{18}\div\sqrt{3} = \sqrt{6}$  ③ $\sqrt{2}\times\sqrt{7} = 14$  ④ $\sqrt{20} = 4\sqrt{5}$  ⑤ $-\sqrt{(-3)^2} = 3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나눗셈 성질에 의하여 $\sqrt{18} \div \sqrt{3} = \sqrt{\dfrac{18}{3}} = \sqrt{6}$이다.
2. 따라서 계산 결과가 옳은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「제곱근의 사칙연산 및 성질을 각 선지에 적용하여」
**RPM** M3-RPM-008 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫**
- 이유: 근호 안의 수의 나눗셈을 다루는 근호의 몫 유형이다. (문항 토큰 18)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_OPERATION_AUDIT → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_BASIC_CALC_TRUE_FALSE → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호가 포함된 식의 사칙연산 성질을 검증하는 유형이다. (문항 토큰 18)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본적인 근호 계산 공식을 적용하는 난이도 1 문항이다. (문항 토큰 18)

**4칸**
- given: 사칙연산←solution:「제곱근의 사칙연산 및 성질을 각 선지에 적용하여」
- goal: 사칙연산←stem:「다음 중 계산 결과가 옳은 것은?」
- method: 나눗셈(NAMED)←solution:「나눗셈 성질에 의하여」
- condition: 사칙연산←choices:「$\sqrt{18}\div\sqrt{3} = \sqrt{6}$」

**how** 근호의 나눗셈 성질을 적용하여 2번 선지가 옳음을 확인했다. (문항 토큰 18)

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 사칙연산 및 성질을 각 선지에 적용하여 계산 결과를 검증한다.


1단계: 각 선지의 계산을 검토한다. ① 근호 안의 수가 다른 무리수의 덧셈은 근호 안의 수를 합칠 수 없다. 즉 $\sqrt{3}+\sqrt{5} \ne \sqrt{8}$이다. (거짓) ② 나눗셈 성질에 의하여 $$\sqrt{18} \div \sqrt{3} = \sqrt{\dfrac{18}{3}} = \sqrt{6}$$ 따라서 옳다. (참) ③ $\sqrt{2} \times \sqrt{7} = \sqrt{2 \times 7} = \sqrt{14} \ne 14$이다. (거짓) ④ $\sqrt{20} = \sqrt{4 \times 5} = 2\sqrt{5} \ne 4\sqrt{5}$이다. (거짓) ⑤ $\sqrt{(-3)^2} = |-3| = 3$이므로 $-\sqrt{(-3)^2} = -3 \ne 3$이다. (거짓)


2단계: 결론을 도출한다. 따라서 옳은 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{16}$의 양의 제곱근을 $a$, $9$의 양의 제곱근을 $b$, $(-3)^2$의 음의 제곱근을 $c$라고 할 때, $a+b+c$의 값은? [4점]

**보기** ① $-2$  ② $0$  ③ $2$  ④ $4$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{16} = 4$의 양의 제곱근은 $a = 2$이다.
2. $9$의 양의 제곱근은 $b = 3$이다.
3. $(-3)^2 = 9$의 음의 제곱근은 $c = -3$이다.
4. 따라서 $a+b+c = 2 + 3 + (-3) = 2$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{16}$의 양의 제곱근을 $a$, $9$의 양의 제곱근을 $b$, $(-3)^2$의 음의 제곱근을 $c$」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 성질 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 수의 양의 제곱근과 음의 제곱근의 정의를 적용하는 제곱근의 뜻 유형이다. (문항 토큰 16)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_ROOT_VALUE **원천→판정: PT_M3_SQUARE_ROOT_REPEATED_EXTRACTION → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_RADICAL_ROOT_CHAIN → TPL_M3_ROOT_PROPERTY_ROOT_VALUE**
- 이유: 근호와 거듭제곱으로 주어진 수의 제곱근 값을 구하여 계산하는 유형이다. (문항 토큰 16)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다단계로 제곱근을 구하고 합산하는 난이도 2 문항이다. (문항 토큰 16)

**4칸**
- given: 제곱근←stem:「$\sqrt{16}$의 양의 제곱근을 $a$, $9$의 양의 제곱근을 $b$, $(-3)^2$의 음의 제곱근을 $c$」
- goal: 제곱근←stem:「$a+b+c$의 값은?」
- method: 양수(NAMED)←solution:「양의 제곱근이므로」
- condition: 음수←stem:「음의 제곱근을 $c$라고 할 때」

**how** 각 식의 값을 먼저 계산한 뒤 양의 제곱근과 음의 제곱근을 구하여 합산했다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식들의 값을 먼저 계산한 후, 각각의 양의 제곱근과 음의 제곱근을 구하여 합산한다.


1단계: $\sqrt{16}$의 양의 제곱근 $a$를 구한다. $$\sqrt{16} = 4$$ 따라서 '$4$의 양의 제곱근'을 구하는 것이므로 $$a = 2$$


2단계: $9$의 양의 제곱근 $b$를 구한다. $9$의 제곱근은 $\pm 3$이고, 양의 제곱근이므로 $$b = 3$$


3단계: $(-3)^2$의 음의 제곱근 $c$를 구한다. $$(-3)^2 = 9$$ 따라서 '$9$의 음의 제곱근'을 구하는 것이므로 $$c = -3$$


4단계: $a+b+c$의 값을 계산한다. $$a + b + c = 2 + 3 + (-3) = 2$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 두 실수의 대소 관계가 옳은 것은? [4점]

**보기** ① $2\sqrt{3} < \sqrt{11}$  ② $4 < 2+\sqrt{3}$  ③ $\sqrt{6}-1 < \sqrt{5}-1$  ④ $2+\sqrt{10} < -1+2\sqrt{10}$  ⑤ $\sqrt{5}+3 < \sqrt{5}+\sqrt{8}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선지 ④에서 양변에서 $\sqrt{10}$을 빼고 $1$을 더하면 $3 < \sqrt{10}$이 된다.
2. $3 = \sqrt{9} < \sqrt{10}$이므로 $2+\sqrt{10} < -1+2\sqrt{10}$은 참이다.
3. 따라서 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 두 실수의 대소 관계가 옳은 것은?」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 두 실수의 차와 부등식 성질을 이용한 실수의 대소 유형이다. (문항 토큰 11)
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_REAL_NUMBER_INEQUALITY → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_RADICAL_ORDER_COMPARISON → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 무리수와 실수의 대소 관계를 부등식의 성질로 판별하는 유형이다. (문항 토큰 11)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 무리수를 포함한 두 식의 대소 비교를 수행하는 난이도 2 문항이다. (문항 토큰 11)

**4칸**
- given: 실수←stem:「다음 중 두 실수의 대소 관계가 옳은 것은?」
- goal: 대소←stem:「대소 관계가 옳은 것은?」
- method: 부등식(NAMED)←solution:「부등식의 성질로 대소 관계를 판정한다.」
- condition: 무리수←choices:「$2+\sqrt{10} < -1+2\sqrt{10}$」

**how** 부등식의 성질을 이용하여 식을 정리하고 근호 안의 수를 비교했다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

양변을 제곱하거나 공통항을 소거하여 부등식의 성질로 대소 관계를 판정한다.


1단계: 각 선지의 대소 관계를 검토한다. ① $(2\sqrt{3})^2 = 4 \times 3 = 12$이고 $(\sqrt{11})^2 = 11$이다. $12 > 11$이므로 $2\sqrt{3} > \sqrt{11}$이다. (거짓) ② 양변에서 $2$를 빼면 $2 < \sqrt{3}$이 된다. $2 = \sqrt{4} > \sqrt{3}$이므로 $4 > 2+\sqrt{3}$이다. (거짓) ③ 양변에 $1$을 더하면 $\sqrt{6} < \sqrt{5}$가 된다. $6 > 5$이므로 $\sqrt{6} > \sqrt{5}$이다. (거짓) ④ 양변에서 $\sqrt{10}$을 빼고 $1$을 더하면 $$2 + 1 < 2\sqrt{10} - \sqrt{10} \implies 3 < \sqrt{10}$$ $3 = \sqrt{9}$이고 $9 < 10$이므로 $\sqrt{9} < \sqrt{10}$, 즉 $3 < \sqrt{10}$은 참이다. 따라서 $2+\sqrt{10} < -1+2\sqrt{10}$은 옳다. (참) ⑤ 양변에서 $\sqrt{5}$를 빼면 $3 < \sqrt{8}$이 된다. $3 = \sqrt{9} > \sqrt{8}$이므로 거짓이다.


2단계: 결론을 도출한다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림은 한 눈금의 길이가 $1$인 모눈종이 위에 수직선과 직각삼각형 $ABC$를 그린 것이다. $\overline{AB}=\overline{AP}$, $\overline{AC}=\overline{AQ}$일 때, 수직선 위의 두 점 $P, Q$가 나타내는 수의 곱은? [4점]
A B C P Q -2 -1 0 1 2 3 4 5 6

**보기** ① $-5$  ② $-4$  ③ $-3$  ④ $-2$  ⑤ $-1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 피타고라스 정리에 의하여 $\overline{AB} = \overline{AC} = \sqrt{2^2 + 1^2} = \sqrt{5}$이다.
2. 기준점 $A(2)$로부터 $P = 2 - \sqrt{5}, Q = 2 + \sqrt{5}$이다.
3. 따라서 $P \times Q = (2-\sqrt{5})(2+\sqrt{5}) = 4 - 5 = -1$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 모눈종이 위에 수직선과 직각삼각형 $ABC$를 그린 것이다.

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「모눈종이 위에 수직선과 직각삼각형 $ABC$를 그린 것이다.」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 수직선 위에 무리수를 나타내고 좌표를 구하는 무리수의 위치 유형이다. (문항 토큰 ABC)
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING **원천→판정: PT_M3_NUMBER_LINE_MAPPING → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_SQUARE_DIAGONAL_ROTATION → TPL_M3_NUMBER_LINE_IRRATIONAL_MAPPING**
- 이유: 수직선 위에서 직각삼각형을 이용하여 무리수 대응점의 좌표를 찾는 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수직선 위의 위치 결정과 합차 곱셈을 연계한 난이도 2 문항이다. (문항 토큰 ABC)

**4칸**
- given: 수직선←stem:「모눈종이 위에 수직선과 직각삼각형 $ABC$를 그린 것이다.」
- goal: 좌표←stem:「수직선 위의 두 점 $P, Q$가 나타내는 수의 곱은?」
- method: 직각삼각형(NAMED)←solution:「피타고라스 정리를 이용하여 빗변의 길이를 구하고」
- condition: 선분←stem:「$\overline{AB}=\overline{AP}$, $\overline{AC}=\overline{AQ}$일 때」

**how** 직각삼각형의 빗변 길이를 구하고 기준점 A에서 좌우 거리를 계산하여 두 수의 곱을 구했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리를 이용하여 빗변의 길이를 구하고, 기준점 $A$로부터 좌우 대칭인 두 점 $P, Q$의 좌표를 구하여 곱한다.


1단계: 선분 $AB$와 선분 $AC$의 길이를 구한다. 모눈 한 눈금의 길이가 $1$이므로 직각삼각형에서 가로의 길이는 $2$, 세로의 길이는 $1$이다. 피타고라스 정리에 의하여 $$\overline{AB} = \overline{AC} = \sqrt{2^2 + 1^2} = \sqrt{4 + 1} = \sqrt{5}$$


2단계: 두 점 $P, Q$의 좌표를 구한다. 원의 중심 점 $A$의 좌표는 $2$이다.


* 점 $P$는 점 $A$로부터 왼쪽(음의 방향)에 있으므로 $$P = 2 - \sqrt{5}$$
* 점 $Q$는 점 $A$로부터 오른쪽(양의 방향)에 있으므로 $$Q = 2 + \sqrt{5}$$


3단계: 두 점이 나타내는 수의 곱을 계산한다. 합차 공식에 의하여 $$P \times Q = (2 - \sqrt{5})(2 + \sqrt{5}) = 2^2 - (\sqrt{5})^2 = 4 - 5 = -1$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$a=\sqrt{3}, \quad b=\sqrt{5}$일 때, $5\sqrt{3}$을 $a, b$를 사용하여 바르게 나타낸 것은? [4점]

**보기** ① $ab^2$  ② $a^2b$  ③ $ab$  ④ $a^2b^2$  ⑤ $a^3b$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $a = \sqrt{3}, b = \sqrt{5}$에서 $b^2 = 5$이다.
2. $5\sqrt{3} = 5 \times \sqrt{3} = b^2 \times a = ab^2$이다.
3. 따라서 바르게 나타낸 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a=\sqrt{3}, \quad b=\sqrt{5}$일 때」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호의 곱셈과 제곱을 이용하는 근호의 곱 유형이다. (문항 토큰 ab)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_LETTER_REPRESENTATION **원천→판정: PT_M3_RADICAL_VARIABLE_EXPRESSION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_TO_ALGEBRAIC_FORM → TPL_M3_RADICAL_LETTER_REPRESENTATION**
- 이유: 제곱근의 값을 문자로 나타내는 근호식의 문자 표현 유형이다. (문항 토큰 ab)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본적인 거듭제곱과 문자 치환을 적용하는 난이도 1 문항이다. (문항 토큰 ab)

**4칸**
- given: 제곱근←stem:「$a=\sqrt{3}, \quad b=\sqrt{5}$일 때」
- goal: 제곱근←stem:「$5\sqrt{3}$을 $a, b$를 사용하여 바르게 나타낸 것은?」
- method: 거듭제곱(NAMED)←solution:「주어진 근호의 값을 거듭제곱하여 계수 $5$를 $b$로 표현한다.」
- condition: 곱셈←solution:「$5\sqrt{3} = 5 \times \sqrt{3} = b^2 \times a = ab^2$」

**how** 근호식을 제곱하여 정수 계수를 문자로 변환한 뒤 표현했다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 근호의 값을 거듭제곱하여 계수 $5$를 $b$로 표현한다.


1단계: $a, b$의 관계를 파악한다. $a = \sqrt{3}$이고 $b = \sqrt{5}$이다. $b$를 제곱하면 $$b^2 = (\sqrt{5})^2 = 5$$


2단계: $5\sqrt{3}$에 대입한다. $$5\sqrt{3} = 5 \times \sqrt{3} = b^2 \times a = ab^2$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{27} + \dfrac{6}{\sqrt{3}} + \sqrt{6}\times\sqrt{2}$ 를 계산하면? [4점]

**보기** ① $6\sqrt{3}$  ② $7\sqrt{3}$  ③ $8\sqrt{3}$  ④ $9\sqrt{3}$  ⑤ $10\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{27} = 3\sqrt{3}$, $\dfrac{6}{\sqrt{3}} = 2\sqrt{3}$, $\sqrt{6}\times\sqrt{2} = 2\sqrt{3}$이다.
2. 세 항을 더하면 $3\sqrt{3} + 2\sqrt{3} + 2\sqrt{3} = 7\sqrt{3}$이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{27} + \dfrac{6}{\sqrt{3}} + \sqrt{6}\times\sqrt{2}$ 를 계산하면?」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 근호의 덧셈과 분배법칙을 활용하는 분배법칙 유형이다. (문항 토큰 27)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_MIXED_ARITHMETIC → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_LIKE_TERMS_SUM → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 유리화와 덧셈·곱셈이 혼합된 근호식 계산 유형이다. (문항 토큰 27)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 유리화와 동류근호 덧셈의 기본 계산을 수행하는 난이도 1 문항이다. (문항 토큰 27)

**4칸**
- given: 무리수←stem:「$\sqrt{27} + \dfrac{6}{\sqrt{3}} + \sqrt{6}\times\sqrt{2}$ 를 계산하면?」
- goal: 유리화←solution:「각 항의 근호를 꺼내거나 유리화하여」
- method: 동류항(NAMED)←solution:「$\sqrt{3}$의 동류항으로 정리한 후 덧셈을 수행한다.」
- condition: 유리화←solution:「$\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$」

**how** 각 항을 유리화 및 근호 밖 꺼내기로 정리한 뒤 동류항을 합산했다. (문항 토큰 27)

<details><summary>저장 해설 (판정 검토용)</summary>

각 항의 근호를 꺼내거나 유리화하여 $\sqrt{3}$의 동류항으로 정리한 후 덧셈을 수행한다.


1단계: 각 항을 간단히 한다.


* $\sqrt{27} = \sqrt{9 \times 3} = 3\sqrt{3}$
* $\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$
* $\sqrt{6} \times \sqrt{2} = \sqrt{12} = \sqrt{4 \times 3} = 2\sqrt{3}$


2단계: 세 항을 더한다. $$\sqrt{27} + \dfrac{6}{\sqrt{3}} + \sqrt{6}\times\sqrt{2} = 3\sqrt{3} + 2\sqrt{3} + 2\sqrt{3} = (3 + 2 + 2)\sqrt{3} = 7\sqrt{3}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{2000} = m\sqrt{5}, \quad \dfrac{\sqrt{0.2}}{\sqrt{5}} = n$일 때, $mn$의 값은? [4점]

**보기** ① $\dfrac{1}{4}$  ② $1$  ③ $4$  ④ $10$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\sqrt{2000} = 20\sqrt{5}$이므로 $m = 20$이다.
2. $n = \dfrac{\sqrt{0.2}}{\sqrt{5}} = \sqrt{\dfrac{1}{25}} = \dfrac{1}{5}$이다.
3. 따라서 $mn = 20 \times \dfrac{1}{5} = 4$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{2000} = m\sqrt{5}, \quad \dfrac{\sqrt{0.2}}{\sqrt{5}} = n$일 때」
**RPM** M3-RPM-008 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 제곱근의 곱셈과 나눗셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫**
- 이유: 근호의 곱셈과 나눗셈 성질을 이용하는 근호의 몫 유형이다. (문항 토큰 2000)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_COEFFICIENT_MATCH → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_DUAL_RADICAL_PARAMETER_PRODUCT → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호의 변형과 나눗셈을 통해 미지수를 결정하고 곱하는 유형이다. (문항 토큰 2000)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 제곱인수 추출과 분수 나눗셈을 결합한 난이도 2 문항이다. (문항 토큰 2000)

**4칸**
- given: 제곱근←stem:「$\sqrt{2000} = m\sqrt{5}, \quad \dfrac{\sqrt{0.2}}{\sqrt{5}} = n$일 때」
- goal: 곱셈←stem:「$mn$의 값은?」
- method: 나눗셈(NAMED)←solution:「근호 나눗셈을 통해 $n$을 구한 후 곱한다.」
- condition: 자연수←solution:「$\sqrt{2000} = \sqrt{400 \times 5} = \sqrt{20^2 \times 5} = 20\sqrt{5}$」

**how** 근호 안의 제곱인수를 꺼내어 m을 구하고 나눗셈으로 n을 구하여 곱했다. (문항 토큰 2000)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 제곱 인수를 밖으로 꺼내어 $m$을 구하고, 근호 나눗셈을 통해 $n$을 구한 후 곱한다.


1단계: $m$의 값을 구한다. $$\sqrt{2000} = \sqrt{400 \times 5} = \sqrt{20^2 \times 5} = 20\sqrt{5}$$ 문제에서 $\sqrt{2000} = m\sqrt{5}$이므로 $$m = 20$$


2단계: $n$의 값을 구한다. $$n = \dfrac{\sqrt{0.2}}{\sqrt{5}} = \sqrt{\dfrac{0.2}{5}} = \sqrt{\dfrac{2}{50}} = \sqrt{\dfrac{1}{25}} = \dfrac{1}{5}$$


3단계: $mn$의 값을 계산한다. $$mn = 20 \times \dfrac{1}{5} = 4$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{40-x}$ 가 정수가 되도록 하는 자연수 $x$의 개수는? [4점]

**보기** ① $4$개  ② $5$개  ③ $6$개  ④ $7$개  ⑤ $8$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x$가 자연수이므로 $40-x \le 39$이고, 정수가 되려면 $40-x \ge 0$이어야 한다.
2. $40-x$가 될 수 있는 완전제곱수는 $0, 1, 4, 9, 16, 25, 36$의 7개이다.
3. 각각에 대응하는 자연수 $x$는 $40, 39, 36, 31, 24, 15, 4$로 총 7개이다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{40-x}$ 가 정수가 되도록 하는 자연수 $x$의 개수는?」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근이 자연수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 완전제곱수를 이용해 근호를 벗기는 제곱근의 성질 유형이다. (문항 토큰 40)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_RADICAL_SUBTRACTION_INTEGER → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_RADICAL_DIFFERENCE_PERFECT_SQUARE_COUNT → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 근호식이 정수 또는 자연수가 되는 조건을 구하는 유형이다. (문항 토큰 40)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 0을 포함한 완전제곱수의 개수를 빠짐없이 세어야 하는 난이도 2 문항이다. (문항 토큰 40)

**4칸**
- given: 정수←stem:「$\sqrt{40-x}$ 가 정수가 되도록 하는 자연수 $x$의 개수는?」
- goal: 자연수←stem:「자연수 $x$의 개수는?」
- method: 완전제곱식(NAMED)←solution:「근호 안의 식 $40-x$가 $0$ 이상의 완전제곱수가 되어야 정수가 된다.」
- condition: 자연수←solution:「$x$가 자연수라는 조건을 고려하여」

**how** 근호 안의 식이 0 이상의 완전제곱수가 되는 조건을 만족하는 자연수 개수를 조사했다. (문항 토큰 40)

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 식 $40-x$가 $0$ 이상의 완전제곱수가 되어야 정수가 된다. $x$가 자연수라는 조건을 고려하여 가능한 $x$의 개수를 조사한다.


1단계: $40-x$의 범위를 설정한다. $x$는 자연수이므로 $x \ge 1$이다. 따라서 $$40 - x \le 40 - 1 = 39$$ 또한 근호 안의 수는 음수가 될 수 없고 결과가 정수이어야 하므로 $$40 - x \ge 0$$ 즉, $40 - x$는 $0$ 이상 $39$ 이하의 완전제곱수이어야 한다.


2단계: 범위 안의 완전제곱수를 나열하고 $x$를 구한다. $0$ 이상의 완전제곱수는 $0, 1, 4, 9, 16, 25, 36$이다. 각각에 대응하는 $x$를 구하면:


* $40 - x = 0 \implies x = 40$(자연수) *$40 - x = 1 \implies x = 39$(자연수) *$40 - x = 4 \implies x = 36$(자연수) *$40 - x = 9 \implies x = 31$(자연수) *$40 - x = 16 \implies x = 24$(자연수) *$40 - x = 25 \implies x = 15$(자연수) *$40 - x = 36 \implies x = 4$ (자연수)


3단계: 개수를 센다. 조건을 만족시키는 자연수 $x$는 $4, 15, 24, 31, 36, 39, 40$의 $7$개이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$ab < 0, \quad a > b$ 일 때, $\sqrt{16a^2} + \sqrt{25b^2}$ 을 간단히 하면? [4점]

**보기** ① $-4a - 5b$  ② $-4a + 5b$  ③ $4a + 5b$  ④ $-5a + 4b$  ⑤ $4a - 5b$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $ab < 0, a > b$로부터 $a > 0, b < 0$이다.
2. $\sqrt{16a^2} = |4a| = 4a$, $\sqrt{25b^2} = |5b| = -5b$이다.
3. 따라서 $\sqrt{16a^2} + \sqrt{25b^2} = 4a - 5b$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$ab < 0, \quad a > b$ 일 때」
**RPM** M3-RPM-002 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 근호가 있는 식의 변형 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 성질**
- 이유: 절댓값과 부호를 이용한 근호의 성질 유형이다. (문항 토큰 ab)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_VARIABLE_SIMPLIFY **원천→판정: PT_M3_RADICAL_SIGN_SIMPLIFY → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_VARIABLE_RADICAL_ABSOLUTE_VALUE → TPL_M3_RADICAL_VARIABLE_SIMPLIFY**
- 이유: 문자의 부호 조건에 따라 제곱근 안의 제곱식을 정리하는 유형이다. (문항 토큰 ab)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 문자의 부호를 판별하고 음수 항의 부호 처리를 하는 난이도 2 문항이다. (문항 토큰 ab)

**4칸**
- given: 부등식←stem:「$ab < 0, \quad a > b$ 일 때」
- goal: 제곱근←stem:「$\sqrt{16a^2} + \sqrt{25b^2}$ 을 간단히 하면?」
- method: 절댓값(NAMED)←solution:「각 근호를 절댓값으로 변환하여 정리한다.」
- condition: 음수←solution:「양수가 음수보다 크다.」

**how** 부호 조건을 판정하여 절댓값 기호로 변환한 뒤 식을 간단히 정리했다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

부호 조건으로부터 $a, b$의 부호를 각각 확정하고, 근호의 성질 $\sqrt{A^2} = |A|$를 적용한다.


1단계: $a, b$의 부호를 결정한다. $ab < 0$이므로 $a$와 $b$는 서로 다른 부호이다. $a > b$이므로 양수가 음수보다 크다. 따라서 $$a > 0, \quad b < 0$$


2단계: 각 근호를 절댓값으로 변환하여 정리한다.


* $\sqrt{16a^2} = \sqrt{(4a)^2} = |4a|$ $a > 0$이므로 $4a > 0$, 따라서 $$|4a| = 4a$$
* $\sqrt{25b^2} = \sqrt{(5b)^2} = |5b|$ $b < 0$이므로 $5b < 0$, 따라서 $$|5b| = -(5b) = -5b$$


3단계: 두 식을 더한다. $$\sqrt{16a^2} + \sqrt{25b^2} = 4a + (-5b) = 4a - 5b$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림은 넓이가 각각 $3,\mathrm{cm^2}, ; 27,\mathrm{cm^2}, ; 12,\mathrm{cm^2}$인 정사각형 모양의 색종이 세 장을 밑변을 맞추어 이어 붙인 것이다. 이 색종이로 이루어진 도형의 둘레의 길이는? [5점]
$3$ $27$ $12$

**보기** ① $18\sqrt{3},\mathrm{cm}$  ② $20\sqrt{3},\mathrm{cm}$  ③ $22\sqrt{3},\mathrm{cm}$  ④ $24\sqrt{3},\mathrm{cm}$  ⑤ $26\sqrt{3},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 정사각형의 한 변의 길이는 각각 $\sqrt{3}, 3\sqrt{3}, 2\sqrt{3}$이다.
2. 아랫변과 윗변의 가로 길이 합은 $6\sqrt{3} + 6\sqrt{3} = 12\sqrt{3}$이다.
3. 세로 방향 변들의 길이 합은 $6\sqrt{3}$이다.
4. 따라서 도형의 둘레의 길이는 $12\sqrt{3} + 6\sqrt{3} = 18\sqrt{3}\text{cm}$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 정사각형 모양의 색종이 세 장을 밑변을 맞추어 이어 붙인 것이다.

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 모양의 색종이 세 장을 밑변을 맞추어 이어 붙인 것이다.」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈의 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 무리수 길이의 덧셈을 다루는 동류근호 유형이다. (문항 토큰 cm)
**유형** PT=PT_M3_SQUARE_ROOT_APPLICATION / TPL=TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION **원천→판정: PT_M3_RADICAL_GEOMETRY_PERIMETER → PT_M3_SQUARE_ROOT_APPLICATION** **원천→판정: TPL_M3_ATTACHED_SQUARES_PERIMETER → TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION**
- 이유: 제곱근의 기하학적 넓이 정의를 이용하여 둘레를 구하는 유형이다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접하는 도형의 단차와 둘레를 체계적으로 계산하는 난이도 2 문항이다. (문항 토큰 cm)

**4칸**
- given: 정사각형←stem:「정사각형 모양의 색종이 세 장을 밑변을 맞추어 이어 붙인 것이다.」
- goal: 둘레←stem:「이 색종이로 이루어진 도형의 둘레의 길이는?」
- method: 정사각형(NAMED)←solution:「각 정사각형의 한 변의 길이를 근호로 구한 후」
- condition: 넓이←stem:「넓이가 각각 $3,\mathrm{cm^2}, ; 27,\mathrm{cm^2}, ; 12,\mathrm{cm^2}$인」

**how** 정사각형 넓이에서 한 변의 길이를 근호로 구하고 외곽 둘레를 합산했다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

각 정사각형의 한 변의 길이를 근호로 구한 후, 도형의 전체 외곽 둘레를 계산한다.


1단계: 세 정사각형의 한 변의 길이를 각각 구한다.


* 넓이가 $3,\mathrm{cm^2}$인 정사각형의 한 변: $\sqrt{3},\mathrm{cm}$
* 넓이가 $27,\mathrm{cm^2}$인 정사각형의 한 변: $\sqrt{27} = 3\sqrt{3},\mathrm{cm}$
* 넓이가 $12,\mathrm{cm^2}$인 정사각형의 한 변: $\sqrt{12} = 2\sqrt{3},\mathrm{cm}$


2단계: 가로 방향과 세로 방향의 외곽 변의 길이를 합산한다.


* 아랫변의 총 길이: $$\sqrt{3} + 3\sqrt{3} + 2\sqrt{3} = 6\sqrt{3},\mathrm{cm}$$
* 윗변들의 총 길이의 합: 가로로 투영하면 아랫변의 총 길이와 같으므로 $$\sqrt{3} + 3\sqrt{3} + 2\sqrt{3} = 6\sqrt{3},\mathrm{cm}$$
* 세로 방향 변들의 길이:
   * 맨 왼쪽 세로변: $\sqrt{3},\mathrm{cm}$
   * 맨 오른쪽 세로변: $2\sqrt{3},\mathrm{cm}$
   * 첫 번째와 두 번째 색종이 사이의 높이 차(단차): $3\sqrt{3} - \sqrt{3} = 2\sqrt{3},\mathrm{cm}$
   * 두 번째와 세 번째 색종이 사이의 높이 차(단차): $3\sqrt{3} - 2\sqrt{3} = \sqrt{3},\mathrm{cm}$ 따라서 세로 방향 변들의 총합은 $$\sqrt{3} + 2\sqrt{3} + 2\sqrt{3} + \sqrt{3} = 6\sqrt{3},\mathrm{cm}$$ (이는 가장 높은 가운데 정사각형의 높이 $3\sqrt{3}$의 $2$배와 같다: $2 \times 3\sqrt{3} = 6\sqrt{3}$)


3단계: 전체 둘레의 길이를 구한다. $$\text{둘레} = (\text{가로 합}) + (\text{세로 합}) = (6\sqrt{3} + 6\sqrt{3}) + 6\sqrt{3} = 18\sqrt{3},\mathrm{cm}$$ (또는 세 정사각형 둘레 총합 $4(\sqrt{3}+3\sqrt{3}+2\sqrt{3}) = 24\sqrt{3}$에서 접하는 두 변 $2(\sqrt{3}+2\sqrt{3}) = 6\sqrt{3}$을 빼면 $24\sqrt{3} - 6\sqrt{3} = 18\sqrt{3},\mathrm{cm}$)


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(x+2)(x+8)+k$ 가 완전제곱식이 되도록 하는 상수 $k$의 값은? [4점]

**보기** ① $6$  ② $9$  ③ $12$  ④ $16$  ⑤ $25$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x+2)(x+8)+k = x^2 + 10x + 16 + k$이다.
2. 완전제곱식이 되려면 일차항 계수 $10$의 절반의 제곱인 $25$가 상수항이어야 한다.
3. 따라서 $16 + k = 25$에서 $k = 9$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x+2)(x+8)+k$ 가 완전제곱식이 되도록 하는」
**RPM** M3-RPM-023 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 완전제곱식 만들기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 제곱식**
- 이유: 완전제곱식의 성질을 이용하는 제곱식 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_PERFECT_SQUARE_CONDITION **원천→판정: PT_M3_PERFECT_SQUARE_CONSTANT → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_QUADRATIC_PERFECT_SQUARE_UNKNOWN → TPL_M3_PERFECT_SQUARE_CONDITION**
- 이유: 이차식이 완전제곱식이 되도록 하는 미정계수를 결정하는 유형이다. (문항 토큰 12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 완전제곱식의 기본 공식을 적용하는 난이도 1 문항이다. (문항 토큰 12)

**4칸**
- given: 완전제곱식←stem:「$(x+2)(x+8)+k$ 가 완전제곱식이 되도록 하는」
- goal: 상수항←stem:「상수 $k$의 값은?」
- method: 완전제곱식(NAMED)←solution:「완전제곱식이 될 조건을 적용한다.」
- condition: 일차식←solution:「일차항 계수의 절반의 제곱이 상수항이 되도록 하는」

**how** 식을 전개한 뒤 일차항 계수의 절반의 제곱이 상수항이 되는 조건을 세웠다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

식을 전개한 후 일차항 계수의 절반의 제곱이 상수항이 되도록 하는 조건을 세운다.


1단계: 주어진 식을 전개한다. $$(x+2)(x+8) + k = x^2 + 10x + 16 + k$$


2단계: 완전제곱식이 될 조건을 적용한다. $x^2 + 10x$를 포함하는 완전제곱식은 일차항 계수 $10$의 절반인 $5$의 제곱이 상수항이어야 한다. $$\left(\dfrac{10}{2}\right)^2 = 5^2 = 25$$ 즉, $$(x+5)^2 = x^2 + 10x + 25$$ 이어야 한다.


3단계: $k$의 값을 구한다. $$16 + k = 25 \implies k = 25 - 16 = 9$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(x+a)(x+b) = x^2 + kx + 18$일 때, 다음 중 $k$의 값이 될 수 없는 것은? (단, $a, b$는 정수) [4점]

**보기** ① $-19$  ② $-11$  ③ $-7$  ④ $9$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x+a)(x+b) = x^2 + (a+b)x + ab = x^2 + kx + 18$이므로 $ab = 18, k = a+b$이다.
2. 곱이 $18$인 두 정수쌍의 합 $k$는 $\pm 19, \pm 11, \pm 9$이다.
3. 보기 중 $-7$은 가능한 값에 없다.
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(x+a)(x+b) = x^2 + kx + 18$일 때, 다음 중 $k$의 값이 될 수 없는 것은? (단, $a, b$는 정수)」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 두 일차식의 곱과 계수 관계를 분석하는 이차식 유형이다. (문항 토큰 kx)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT **원천→판정: PT_M3_INTEGER_FACTOR_SUM_POSSIBILITY → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_CONSTANT_PRODUCT_LINEAR_COEFFICIENT_AUDIT → TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT**
- 이유: 정수 조건에서 두 일차식의 곱으로 전개될 때 미정계수의 범위를 구하는 유형이다. (문항 토큰 kx)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음의 정수쌍을 포함한 모든 경우를 분류해야 하는 난이도 2 문항이다. (문항 토큰 kx)

**4칸**
- given: 정수←stem:「$(x+a)(x+b) = x^2 + kx + 18$일 때, 다음 중 $k$의 값이 될 수 없는 것은? (단, $a, b$는 정수)」
- goal: 계수←stem:「다음 중 $k$의 값이 될 수 없는 것은?」
- method: 계수(NAMED)←solution:「좌변을 전개하여 계수를 비교하고」
- condition: 정수←solution:「곱이 $18$인 두 정수의 합으로」

**how** 곱이 18인 정수 순서쌍을 나열하여 가능한 합 k를 구하고 보기를 판별했다. (문항 토큰 kx)

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 전개하여 계수를 비교하고, 곱이 $18$인 두 정수의 합으로 가능한 모든 $k$의 값을 나열한다.


1단계: 좌변을 전개하여 계수를 비교한다. $$(x+a)(x+b) = x^2 + (a+b)x + ab$$ 이 식이 $x^2 + kx + 18$과 같으므로 $$ab = 18, \quad k = a+b$$


2단계: 곱이 $18$인 두 정수 $a, b$의 순서쌍과 그 합 $k = a+b$를 구한다.


* $a \times b = 1 \times 18 \implies a+b = 19$
* $a \times b = (-1) \times (-18) \implies a+b = -19$
* $a \times b = 2 \times 9 \implies a+b = 11$
* $a \times b = (-2) \times (-9) \implies a+b = -11$
* $a \times b = 3 \times 6 \implies a+b = 9$
* $a \times b = (-3) \times (-6) \implies a+b = -9$ 따라서 가능한 $k$의 값은 $\pm 19, \pm 11, \pm 9$이다.


3단계: 보기에서 될 수 없는 값을 찾는다. 보기 중 $-19, -11, 9, 11$은 모두 가능한 값이고, $-7$은 이 목록에 없다. 따라서 될 수 없는 것은 ③의 $-7$이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$(\sqrt{3}+4)^2 = a + b\sqrt{3}$ 일 때, 유리수 $a, b$에 대하여 $a+b$의 값은? [4점]

**보기** ① $21$  ② $23$  ③ $25$  ④ $27$  ⑤ $29$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(\sqrt{3}+4)^2 = 3 + 8\sqrt{3} + 16 = 19 + 8\sqrt{3}$이다.
2. $a, b$가 유리수이므로 $a = 19, b = 8$이다.
3. 따라서 $a+b = 19 + 8 = 27$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(\sqrt{3}+4)^2 = a + b\sqrt{3}$ 일 때, 유리수 $a, b$에 대하여」
**RPM** M3-RPM-015 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합·차의 제곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈 공식 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 합·차의 제곱**
- 이유: 합의 제곱 공식을 적용하는 합·차의 제곱 유형이다. (문항 토큰 21)
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_EXPANSION **원천→판정: PT_M3_RADICAL_EXPANSION_RATIONAL_MATCH → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_BINOMIAL_RADICAL_SQUARE_COEFFICIENTS → TPL_M3_MULTIPLICATION_EXPANSION**
- 이유: 곱셈공식을 이용하여 식을 전개하고 계수를 비교하는 유형이다. (문항 토큰 21)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 곱셈공식 전개와 무리수 상등을 적용하는 난이도 1 문항이다. (문항 토큰 21)

**4칸**
- given: 유리수←stem:「$(\sqrt{3}+4)^2 = a + b\sqrt{3}$ 일 때, 유리수 $a, b$에 대하여」
- goal: 유리수←stem:「$a+b$의 값은?」
- method: 곱셈공식(NAMED)←solution:「곱셈 공식 완전제곱식을 적용하여 좌변을 전개한 후」
- condition: 무리수←solution:「유리수 부분과 무리수 부분의 계수를 비교한다.」

**how** 완전제곱식 곱셈 공식을 전개하고 유리수부와 무리수부를 비교했다. (문항 토큰 21)

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈 공식 완전제곱식을 적용하여 좌변을 전개한 후 유리수 부분과 무리수 부분의 계수를 비교한다.


1단계: 좌변을 전개한다. $$(\sqrt{3} + 4)^2 = (\sqrt{3})^2 + 2(\sqrt{3})(4) + 4^2 = 3 + 8\sqrt{3} + 16$$ 유리수 항과 무리수 항을 묶으면 $$= (3 + 16) + 8\sqrt{3} = 19 + 8\sqrt{3}$$


2단계: 계수를 비교하여 $a, b$의 값을 구한다. $a, b$가 유리수이고 $\sqrt{3}$이 무리수이므로 $$a = 19, \quad b = 8$$


3단계: $a+b$의 값을 계산한다. $$a + b = 19 + 8 = 27$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 다항식 $4x^2 - 8xy$ 의 인수가 아닌 것은? [3점]

**보기** ① $x$  ② $4x$  ③ $x-2y$  ④ $x^2-2xy$  ⑤ $4x-2y$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $4x^2 - 8xy = 4x(x-2y) = 2^2 \times x \times (x-2y)$이다.
2. $4x-2y = 2(2x-y)$는 원래 다항식의 인수들의 곱으로 표현할 수 없다.
3. 따라서 인수가 아닌 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 다항식 $4x^2 - 8xy$ 의 인수가 아닌 것은?」
**RPM** M3-RPM-021 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 뜻 → 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: 공통인수를 묶어내는 공통인수 묶기 유형이다. (문항 토큰 xy)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_COMMON_FACTOR_IDENTIFICATION **원천→판정: PT_M3_FACTOR_IDENTIFICATION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_POLYNOMIAL_FACTORS_AUDIT → TPL_M3_COMMON_FACTOR_IDENTIFICATION**
- 이유: 다항식을 인수분해하여 가능한 인수를 식별하는 유형이다. (문항 토큰 xy)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 공통인수 추출 후 인수의 정의를 확인하는 난이도 1 문항이다. (문항 토큰 xy)

**4칸**
- given: 다항식←stem:「다음 중 다항식 $4x^2 - 8xy$ 의 인수가 아닌 것은?」
- goal: 인수←stem:「인수가 아닌 것은?」
- method: 공통인수(NAMED)←solution:「다항식을 공통인수로 인수분해하여」
- condition: 인수분해←solution:「주어진 다항식을 완전히 인수분해한다.」

**how** 공통인수로 다항식을 완전히 인수분해하여 각 선지의 인수 여부를 판별했다. (문항 토큰 xy)

<details><summary>저장 해설 (판정 검토용)</summary>

다항식을 공통인수로 인수분해하여 곱의 형태로 나타내어 가능한 인수를 판별한다.


1단계: 주어진 다항식을 완전히 인수분해한다. $$4x^2 - 8xy = 4x(x - 2y) = 2^2 \times x \times (x - 2y)$$


2단계: 각 선지가 인수가 되는지 검토한다.


* ① $x$: $4x(x-2y)$에서 $x$는 인수이다. * ②$4x$: $4x$는 인수이다. * ③$x-2y$: $x-2y$는 인수이다. * ④$x^2 - 2xy = x(x-2y)$이다. 원래 식 $4x(x-2y)$는 $4 \times [x(x-2y)]$이므로 $x^2-2xy$는 인수이다. * ⑤$4x - 2y = 2(2x-y)$이다. 원래 식의 인수 중에 $2x-y$는 존재하지 않는다. 따라서 인수가 아니다.


3단계: 결론을 도출한다. 따라서 인수가 아닌 것은 ⑤이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $2x^2 + 5x - 3$을 $(x+a)(2x+b)$로 인수분해할 때, 정수 $a, b$에 대하여 $a+b$의 값은? [4점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $-2$  ⑤ $-4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 대각선 인수분해에 의하여 $2x^2 + 5x - 3 = (x+3)(2x-1)$이다.
2. $(x+a)(2x+b)$와 비교하면 $a = 3, b = -1$이다.
3. 따라서 $a+b = 3 + (-1) = 2$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $2x^2 + 5x - 3$을 $(x+a)(2x+b)$로 인수분해할 때」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 이차식을 두 일차식의 곱으로 인수분해하는 이차식 유형이다. (문항 토큰 2)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_COEFFICIENT **원천→판정: PT_M3_QUADRATIC_FACTORING_COEFFICIENTS → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_NONUNIT_QUADRATIC_FACTOR_SUM → TPL_M3_FACTORIZATION_COEFFICIENT**
- 이유: 이차식의 인수분해를 통해 미정계수를 구하는 유형이다. (문항 토큰 2)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본 이차식 인수분해를 수행하는 난이도 1 문항이다. (문항 토큰 2)

**4칸**
- given: 다항식←stem:「다항식 $2x^2 + 5x - 3$을 $(x+a)(2x+b)$로 인수분해할 때」
- goal: 정수←stem:「정수 $a, b$에 대하여 $a+b$의 값은?」
- method: 인수분해(NAMED)←solution:「대각선 인수분해법 또는 계수 비교법을 이용하여」
- condition: 계수←solution:「최고차항 계수 $2 = 1 \times 2$」

**how** 이차식을 대각선 공식으로 인수분해하고 계수를 비교하여 합을 구했다. (문항 토큰 2)

<details><summary>저장 해설 (판정 검토용)</summary>

대각선 인수분해법 또는 계수 비교법을 이용하여 정수 $a, b$를 구한다.


1단계: 주어진 이차식을 인수분해한다. $$2x^2 + 5x - 3$$


* 최고차항 계수 $2 = 1 \times 2$
* 상수항 $-3 = 3 \times (-1)$ 대각선으로 곱하여 더하면 $$1 \times (-1) + 2 \times 3 = -1 + 6 = 5$$ 가 되어 일차항 계수 $5$와 일치한다. 따라서 $$2x^2 + 5x - 3 = (x + 3)(2x - 1)$$


2단계: $(x+a)(2x+b)$와 계수를 비교한다. $$a = 3, \quad b = -1$$


3단계: $a+b$의 값을 계산한다. $$a + b = 3 + (-1) = 2$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x=\sqrt{5}+\sqrt{2}, \quad y=\sqrt{5}-\sqrt{2}$ 일 때, $x^2y - xy^2$의 값은? [4점]

**보기** ① $3\sqrt{2}$  ② $6\sqrt{2}$  ③ $-6\sqrt{2}$  ④ $6\sqrt{5}$  ⑤ $12\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x^2y - xy^2 = xy(x-y)$이다.
2. $xy = (\sqrt{5}+\sqrt{2})(\sqrt{5}-\sqrt{2}) = 5 - 2 = 3$이다.
3. $x-y = 2\sqrt{2}$이다.
4. 따라서 $xy(x-y) = 3 \times 2\sqrt{2} = 6\sqrt{2}$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x=\sqrt{5}+\sqrt{2}, \quad y=\sqrt{5}-\sqrt{2}$ 일 때」
**RPM** M3-RPM-027 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 식의 값 구하기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값**
- 이유: 인수분해를 이용해 식의 값을 간편하게 구하는 인수분해를 이용한 식의 값 유형이다. (문항 토큰 xy)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_VALUE **원천→판정: PT_M3_FACTORING_SUBSTITUTION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_CONJUGATE_FACTORING_VALUE → TPL_M3_FACTORIZATION_VALUE**
- 이유: 인수분해 공식을 활용하여 무리수 식의 값을 구하는 유형이다. (문항 토큰 xy)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 공통인수 묶기와 무리수 합차 대입의 기본 계산 난이도 1 문항이다. (문항 토큰 xy)

**4칸**
- given: 무리수←stem:「$x=\sqrt{5}+\sqrt{2}, \quad y=\sqrt{5}-\sqrt{2}$ 일 때」
- goal: 다항식←stem:「$x^2y - xy^2$의 값은?」
- method: 공통인수(NAMED)←solution:「공통인수로 식을 먼저 묶은 후」
- condition: 인수분해←solution:「식을 공통인수 $xy$로 인수분해한다.」

**how** 공통인수로 식을 묶은 뒤 합차 공식과 차를 대입하여 계산했다. (문항 토큰 xy)

<details><summary>저장 해설 (판정 검토용)</summary>

공통인수로 식을 먼저 묶은 후 켤레 무리수의 곱과 차를 대입하여 계산한다.


1단계: 식을 공통인수 $xy$로 인수분해한다. $$x^2y - xy^2 = xy(x - y)$$


2단계: $xy$와 $x-y$의 값을 각각 구한다.


* $xy = (\sqrt{5}+\sqrt{2})(\sqrt{5}-\sqrt{2}) = (\sqrt{5})^2 - (\sqrt{2})^2 = 5 - 2 = 3$
* $x - y = (\sqrt{5}+\sqrt{2}) - (\sqrt{5}-\sqrt{2}) = \sqrt{5} + \sqrt{2} - \sqrt{5} + \sqrt{2} = 2\sqrt{2}$


3단계: 두 값을 곱하여 식의 값을 구한다. $$xy(x - y) = 3 \times 2\sqrt{2} = 6\sqrt{2}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

자연수 $n$에 대하여 $n^2 - 8n - 48$ 이 소수가 될 때, 이 소수를 구하면? [4점]

**보기** ① $13$  ② $15$  ③ $17$  ④ $19$  ⑤ $23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $n^2 - 8n - 48 = (n-12)(n+4)$이다.
2. 식이 소수가 되려면 두 인수 중 작은 인수가 $1$이어야 하므로 $n-12 = 1$에서 $n = 13$이다.
3. 대입하면 $(13-12)(13+4) = 1 \times 17 = 17$이고, $17$은 소수이다.
4. 따라서 구하는 소수는 $17$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「자연수 $n$에 대하여 $n^2 - 8n - 48$ 이 소수가 될 때」
**RPM** M3-RPM-026 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산**
- 이유: 인수분해를 수론적 성질에 적용하는 인수분해를 이용한 수의 계산 유형이다. (문항 토큰 48)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION **원천→판정: PT_M3_PRIME_FACTORING_EVAL → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_QUADRATIC_FACTORED_PRIME_SEARCH → TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION**
- 이유: 인수분해와 소수의 성질을 결합하여 소수를 결정하는 유형이다. (문항 토큰 48)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차식 인수분해 후 소수의 약수 조건을 연계하는 난이도 2 문항이다. (문항 토큰 48)

**4칸**
- given: 자연수←stem:「자연수 $n$에 대하여 $n^2 - 8n - 48$ 이 소수가 될 때」
- goal: 소수←stem:「이 소수를 구하면?」
- method: 인수분해(NAMED)←solution:「이차식을 두 일차식의 곱으로 인수분해한 후」
- condition: 소수←solution:「소수의 정의(약수가 $1$과 자기 자신뿐인 자연수)를 이용하여」

**how** 이차식을 인수분해하고 소수의 정의에 따라 작은 인수가 1임을 이용하여 소수를 구했다. (문항 토큰 48)

<details><summary>저장 해설 (판정 검토용)</summary>

이차식을 두 일차식의 곱으로 인수분해한 후, 소수의 정의(약수가 $1$과 자기 자신뿐인 자연수)를 이용하여 소수를 구한다.


1단계: 주어진 이차식을 인수분해한다. 곱이 $-48$이고 합이 $-8$인 두 정수는 $-12$와 $4$이므로 $$n^2 - 8n - 48 = (n - 12)(n + 4)$$


2단계: 소수가 될 조건을 분석한다. 소수는 $1$보다 큰 자연수 중에서 $1$과 자기 자신만을 약수로 가지는 수이다. 따라서 두 자연수의 곱이 소수가 되려면 작은 인수가 반드시 $1$이어야 한다. 자연수 $n$에 대하여 $n + 4 > n - 12$이므로 작은 인수는 $n - 12$이다. $$n - 12 = 1 \implies n = 13$$


3단계: $n = 13$일 때 식의 값을 계산하고 소수인지 확인한다. $$(13 - 12)(13 + 4) = 1 \times 17 = 17$$ $17$은 $1$과 $17$만을 약수로 가지므로 소수가 맞다. 따라서 구하는 소수는 $17$이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

인수분해 공식을 이용하여 $\sqrt{10\times 11\times 12\times 13+1}$ 의 값을 계산하면? [5점]

**보기** ① $121$  ② $125$  ③ $129$  ④ $131$  ⑤ $135$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $10 \times 11 \times 12 \times 13 = (10 \times 13)(11 \times 12) = 130 \times 132$이다.
2. $130 \times 132 + 1 = (131-1)(131+1) + 1 = 131^2 - 1 + 1 = 131^2$이다.
3. 따라서 $\sqrt{131^2} = 131$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「인수분해 공식을 이용하여 $\sqrt{10\times 11\times 12\times 13+1}$ 의 값을 계산하면?」
**RPM** M3-RPM-026 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 수의 계산 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산**
- 이유: 인수분해 공식을 활용한 수의 계산 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_SUBSTITUTION_FACTORIZATION **원천→판정: PT_M3_CONSECUTIVE_PRODUCT_SQUARE_ROOT → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_FOUR_CONSECUTIVE_NUMBERS_PLUS_ONE → TPL_M3_SUBSTITUTION_FACTORIZATION**
- 이유: 연속한 네 자연수의 곱에 1을 더한 식을 인수분해 공식으로 계산하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수의 적절한 짝짓기와 합차 공식을 연계 적용하는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 인수분해←stem:「인수분해 공식을 이용하여 $\sqrt{10\times 11\times 12\times 13+1}$ 의 값을 계산하면?」
- goal: 인수분해←stem:「의 값을 계산하면?」
- method: 합차공식(NAMED)←solution:「가운데 수를 기준으로 합차 공식을 적용한다.」
- condition: 자연수←solution:「연속하는 네 자연수의 곱에 $1$을 더한 식을」

**how** 연속한 네 수의 곱을 둘씩 짝지어 합차 공식으로 완전제곱수를 만들어 근호를 벗겼다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

연속하는 네 자연수의 곱에 $1$을 더한 식을 적절히 짝지어 전개하고, 치환과 완전제곱식을 이용하여 근호를 벗긴다.


1단계: 네 수의 곱을 합이 같아지도록 짝을 짓는다. $$10 \times 11 \times 12 \times 13 = (10 \times 13) \times (11 \times 12)$$


* $10 \times 13 = 130$
* $11 \times 12 = 132$ 따라서 주어진 식은 다음과 같다. $$\sqrt{130 \times 132 + 1}$$


2단계: 가운데 수를 기준으로 합차 공식을 적용한다. $130$과 $132$의 평균은 $131$이므로 $$130 = 131 - 1, \quad 132 = 131 + 1$$ 따라서 근호 안의 식은 $$130 \times 132 + 1 = (131 - 1)(131 + 1) + 1 = (131^2 - 1) + 1 = 131^2$$


3단계: 제곱근의 값을 구한다. $$\sqrt{131^2} = 131$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$x+y = \sqrt{5}, \quad x-y = \sqrt{3}$ 일 때, $x^4 - y^4$의 값은? [5점]

**보기** ① $2\sqrt{15}$  ② $3\sqrt{15}$  ③ $\dfrac{7\sqrt{15}}{2}$  ④ $\dfrac{9\sqrt{15}}{2}$  ⑤ $4\sqrt{15}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x^4 - y^4 = (x-y)(x+y)(x^2+y^2)$이다.
2. $(x-y)(x+y) = \sqrt{3} \times \sqrt{5} = \sqrt{15}$이다.
3. $2(x^2+y^2) = (x+y)^2 + (x-y)^2 = 5 + 3 = 8$에서 $x^2+y^2 = 4$이다.
4. 따라서 $x^4 - y^4 = \sqrt{15} \times 4 = 4\sqrt{15}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x+y = \sqrt{5}, \quad x-y = \sqrt{3}$ 일 때」
**RPM** M3-RPM-024 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 합과 차] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 합과 차**
- 이유: 제곱의 차를 인수분해하는 합과 차 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_DIFFERENCE_OF_SQUARES_CHAIN **원천→판정: PT_M3_FOURTH_POWER_DIFFERENCE_VALUE → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_RADICAL_SUM_DIFF_POWER_FOUR → TPL_M3_DIFFERENCE_OF_SQUARES_CHAIN**
- 이유: 합차 공식을 거듭 적용하여 다항식을 인수분해하고 식의 값을 구하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 합차 인수분해와 이차식 변형 공식을 병행하는 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 무리수←stem:「$x+y = \sqrt{5}, \quad x-y = \sqrt{3}$ 일 때」
- goal: 다항식←stem:「$x^4 - y^4$의 값은?」
- method: 합차공식(NAMED)←solution:「합차 공식을 거듭 적용하여 사차식을 인수분해하고」
- condition: 곱셈공식←solution:「$x^2 + y^2$의 값을 곱셈 공식 변형으로 구한다.」

**how** 사차식을 합차 공식으로 연속 인수분해하고 곱셈 공식 변형으로 각 인수의 값을 구했다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

합차 공식을 거듭 적용하여 사차식을 인수분해하고, 주어진 합과 차로부터 각 인수의 값을 구하여 곱한다.


1단계: $x^4 - y^4$을 합차 공식으로 인수분해한다. $$x^4 - y^4 = (x^2)^2 - (y^2)^2 = (x^2 - y^2)(x^2 + y^2) = (x - y)(x + y)(x^2 + y^2)$$


2단계: $(x-y)(x+y)$의 값을 구한다. $$(x - y)(x + y) = \sqrt{3} \times \sqrt{5} = \sqrt{15}$$


3단계: $x^2 + y^2$의 값을 곱셈 공식 변형으로 구한다. $$(x + y)^2 + (x - y)^2 = (x^2 + 2xy + y^2) + (x^2 - 2xy + y^2) = 2(x^2 + y^2)$$ 주어진 값을 대입하면 $$(\sqrt{5})^2 + (\sqrt{3})^2 = 5 + 3 = 8$$ 따라서 $$2(x^2 + y^2) = 8 \implies x^2 + y^2 = 4$$


4단계: 전체 식의 값을 계산한다. $$x^4 - y^4 = (x - y)(x + y)(x^2 + y^2) = \sqrt{15} \times 4 = 4\sqrt{15}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 1] $36$의 제곱근의 뜻을 문장으로 서술하고, 그 값을 구하시오. [총 4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 뜻: 어떤 수를 제곱하여 36이 될 때, 그 수를 36의 제곱근이라고 한다. / 값: 6과 -6 (또는 $\pm 6$)   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 어떤 수 $x$를 제곱하여 $36$이 될 때, 즉 $x^2 = 36$을 만족시키는 수 $x$를 $36$의 제곱근이라고 한다.
2. $6^2 = 36$이고 $(-6)^2 = 36$이므로 $36$의 제곱근의 값은 $6$과 $-6$ (또는 $\pm 6$)이다.
- 작성자 답: 뜻: 어떤 수를 제곱하여 36이 될 때, 그 수를 36의 제곱근이라고 한다. / 값: 6과 -6 (또는 $\pm 6$) → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 1] $36$의 제곱근의 뜻을 문장으로 서술하고」
**RPM** M3-RPM-001 [실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 뜻 → 실수와 그 연산 > 제곱근과 실수 > 제곱근 > 제곱근의 뜻**
- 이유: 제곱근의 정의와 표현을 묻는 제곱근의 뜻 유형이다. (문항 토큰 36)
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_ROOT_PROPERTY_DEFINITION **원천→판정: PT_M3_SQUARE_ROOT_DEFINITION_WRITTEN → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_SQUARE_ROOT_CONCEPT_EXPLANATION → TPL_M3_ROOT_PROPERTY_DEFINITION**
- 이유: 제곱근의 개념 정의와 구체적 값을 서술하는 유형이다. (문항 토큰 36)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 개념 정의와 값을 묻는 난이도 1 서술형 문항이다. (문항 토큰 36)

**4칸**
- given: 제곱근←stem:「[서·논술형 1] $36$의 제곱근의 뜻을 문장으로 서술하고」
- goal: 제곱근←stem:「그 값을 구하시오.」
- method: 제곱근(NAMED)←solution:「제곱근의 기본 개념 정의를 문장으로 기술하고」
- condition: 자연수←solution:「어떤 수 $x$를 제곱하여 $36$이 될 때」

**how** 제곱근의 수학적 정의를 문장으로 기술하고 제곱하여 36이 되는 두 수를 구했다. (문항 토큰 36)

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 기본 개념 정의를 문장으로 기술하고, 제곱하여 $36$이 되는 수를 구한다.


1단계: $36$의 제곱근의 뜻을 서술한다. [2점] 어떤 수 $x$를 제곱하여 $36$이 될 때, 즉 $x^2 = 36$을 만족시키는 수 $x$를 $36$의 제곱근이라고 한다.


2단계: $36$의 제곱근의 값을 구한다. [2점] $6^2 = 36$이고 $(-6)^2 = 36$이므로 제곱하여 $36$이 되는 수는 $6$과 $-6$이다. 따라서 $36$의 제곱근은 $6$과 $-6$ (또는 $\pm 6$)이다.


따라서 정답은 뜻: 어떤 수를 제곱하여 36이 될 때, 그 수를 36의 제곱근이라고 한다. / 값: 6과 -6 (또는 $\pm 6$)이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 2] 다음 두 다항식을 각각 인수분해하고, 공통인수를 구하는 과정을 서술하시오. [5점] $$3x^2 - 12, \quad 2x^2 + x - 6$$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $3x^2-12 = 3(x-2)(x+2), \quad 2x^2+x-6 = (2x-3)(x+2)$, 공통인수: $x+2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $3x^2 - 12 = 3(x^2 - 4) = 3(x-2)(x+2)$이다.
2. $2x^2 + x - 6 = (x+2)(2x-3)$이다.
3. 두 다항식에 공통으로 포함된 인수는 $x+2$이다.
- 작성자 답: $3x^2-12 = 3(x-2)(x+2), \quad 2x^2+x-6 = (2x-3)(x+2)$, 공통인수: $x+2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 2] 다음 두 다항식을 각각 인수분해하고」
**RPM** M3-RPM-021 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 → 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: 공통인수 추출과 기본 인수분해를 다루는 공통인수 묶기 유형이다. (문항 토큰 12)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_COMMON_FACTOR_BY_FACTORIZATION **원천→판정: PT_M3_COMMON_FACTOR_POLYNOMIALS → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_DUAL_POLYNOMIAL_FACTOR_INTERSECTION → TPL_M3_COMMON_FACTOR_BY_FACTORIZATION**
- 이유: 두 다항식을 각각 인수분해하여 공통인수를 구하는 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 합차 인수분해와 일차식 계수 분해를 결합한 난이도 2 서술형 문항이다. (문항 토큰 12)

**4칸**
- given: 다항식←stem:「[서·논술형 2] 다음 두 다항식을 각각 인수분해하고」
- goal: 공통인수←stem:「공통인수를 구하는 과정을 서술하시오.」
- method: 합차공식(NAMED)←solution:「공통인수 $3$으로 묶은 후 합차 공식을 적용한다.」
- condition: 이차식←solution:「두 다항식을 각각 공통인수 및 대각선 인수분해법으로」

**how** 각 다항식을 공통인수와 대각선 인수분해로 분해한 후 공통인수를 찾았다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

두 다항식을 각각 공통인수 및 대각선 인수분해법으로 완전히 인수분해한 후 공통된 일차식을 찾는다.


1단계: $3x^2 - 12$를 인수분해한다. [2점] 공통인수 $3$으로 묶은 후 합차 공식을 적용한다. $$3x^2 - 12 = 3(x^2 - 4) = 3(x^2 - 2^2) = 3(x - 2)(x + 2)$$


2단계: $2x^2 + x - 6$을 인수분해한다. [2점] 최고차항 계수 $2 = 1 \times 2$, 상수항 $-6 = 2 \times (-3)$으로 분해하여 대각선으로 곱하면 $$1 \times (-3) + 2 \times 2 = -3 + 4 = 1$$ 이므로 $$2x^2 + x - 6 = (x + 2)(2x - 3)$$


3단계: 두 다항식의 공통인수를 구한다. [1점] 두 식에 공통으로 포함된 인수는 $x + 2$이다.


따라서 정답은 $3x^2-12 = 3(x-2)(x+2), \quad 2x^2+x-6 = (2x-3)(x+2)$, 공통인수: $x+2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 3] 두 수 $A, B$가 다음과 같을 때, $A+B$의 값을 구하는 과정을 서술하시오. [총 6점] $$A = \sqrt{2}(\sqrt{7}+5) - \sqrt{7}(\sqrt{14}-3\sqrt{2})$$ $$B = \sqrt{24} \div \sqrt{6} - 4\sqrt{2}$$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2 - 6\sqrt{2} + 4\sqrt{14}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A = \sqrt{14} + 5\sqrt{2} - 7\sqrt{2} + 3\sqrt{14} = 4\sqrt{14} - 2\sqrt{2}$이다.
2. $B = \sqrt{4} - 4\sqrt{2} = 2 - 4\sqrt{2}$이다.
3. 따라서 $A+B = 2 + (-2-4)\sqrt{2} + 4\sqrt{14} = 2 - 6\sqrt{2} + 4\sqrt{14}$이다.
- 작성자 답: $2 - 6\sqrt{2} + 4\sqrt{14}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 수 $A, B$가 다음과 같을 때」
**RPM** M3-RPM-010 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙**
- 이유: 근호의 분배법칙과 동류근호 덧셈을 수행하는 분배법칙 유형이다. (문항 토큰 14)
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_STEP_ARITHMETIC_SUM → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_DUAL_EXPRESSION_RADICAL_EVAL → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 무리수의 분배법칙과 나눗셈을 이용한 혼합 계산 서술형 유형이다. (문항 토큰 14)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다항 근호식 전개와 동류항 계산 단계가 포함된 난이도 2 서술형 문항이다. (문항 토큰 14)

**4칸**
- given: 무리수←stem:「두 수 $A, B$가 다음과 같을 때」
- goal: 무리수←stem:「$A+B$의 값을 구하는 과정을 서술하시오.」
- method: 분배법칙(NAMED)←solution:「분배법칙과 나눗셈을 이용하여 두 수 $A, B$를 각각 간단히 정리한 후」
- condition: 동류항←solution:「동류항끼리 묶어 정리하면」

**how** 분배법칙과 근호 나눗셈으로 A, B를 각각 간단히 한 뒤 동류항을 합산했다. (문항 토큰 14)

<details><summary>저장 해설 (판정 검토용)</summary>

분배법칙과 나눗셈을 이용하여 두 수 $A, B$를 각각 간단히 정리한 후 동류항을 합산한다.


1단계: $A$의 값을 전개하여 정리한다. [3점] $$A = \sqrt{2}(\sqrt{7}+5) - \sqrt{7}(\sqrt{14}-3\sqrt{2})$$ $$= \sqrt{14} + 5\sqrt{2} - \sqrt{98} + 3\sqrt{14}$$ 여기서 $\sqrt{98} = \sqrt{49 \times 2} = 7\sqrt{2}$이므로 $$A = \sqrt{14} + 5\sqrt{2} - 7\sqrt{2} + 3\sqrt{14}$$ 동류항끼리 묶어 정리하면 $$A = (1 + 3)\sqrt{14} + (5 - 7)\sqrt{2} = 4\sqrt{14} - 2\sqrt{2}$$


2단계: $B$의 값을 계산하여 정리한다. [2점] $$B = \sqrt{24} \div \sqrt{6} - 4\sqrt{2}$$ $$= \sqrt{\dfrac{24}{6}} - 4\sqrt{2} = \sqrt{4} - 4\sqrt{2} = 2 - 4\sqrt{2}$$


3단계: $A+B$의 값을 계산한다. [1점] $$A + B = (4\sqrt{14} - 2\sqrt{2}) + (2 - 4\sqrt{2})$$ $$= 2 + (-2 - 4)\sqrt{2} + 4\sqrt{14} = 2 - 6\sqrt{2} + 4\sqrt{14}$$


따라서 정답은 $2 - 6\sqrt{2} + 4\sqrt{14}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서·논술형 4] $x = \dfrac{1}{2-\sqrt{3}}, \quad y = \dfrac{1}{2+\sqrt{3}}$ 일 때, $x^2 - y^2$의 값을 구하는 과정을 서술하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8\sqrt{3}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모를 유리화하면 $x = 2+\sqrt{3}, y = 2-\sqrt{3}$이다.
2. $x+y = 4, x-y = 2\sqrt{3}$이다.
3. 합차 공식에 의하여 $x^2 - y^2 = (x+y)(x-y) = 4 \times 2\sqrt{3} = 8\sqrt{3}$이다.
- 작성자 답: $8\sqrt{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x = \dfrac{1}{2-\sqrt{3}}, \quad y = \dfrac{1}{2+\sqrt{3}}$ 일 때」
**RPM** M3-RPM-027 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 식의 값 구하기 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값**
- 이유: 합차 공식을 이용해 식의 값을 구하는 인수분해를 이용한 식의 값 유형이다. (문항 토큰 4)
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_VALUE **원천→판정: PT_M3_CONJUGATE_DIFFERENCE_OF_SQUARES → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_RATIONALIZATION_SQUARE_DIFF_VALUE → TPL_M3_FACTORIZATION_VALUE**
- 이유: 분모의 유리화와 인수분해 공식을 연계하여 식의 값을 구하는 유형이다. (문항 토큰 4)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 유리화와 합차 곱셈 공식 변형을 함께 적용하는 난이도 2 서술형 문항이다. (문항 토큰 4)

**4칸**
- given: 무리수←stem:「$x = \dfrac{1}{2-\sqrt{3}}, \quad y = \dfrac{1}{2+\sqrt{3}}$ 일 때」
- goal: 다항식←stem:「$x^2 - y^2$의 값을 구하는 과정을 서술하시오.」
- method: 유리화(NAMED)←solution:「분모를 각각 유리화한 후 합차 공식을 이용하여」
- condition: 합차공식←solution:「합차 공식에 의하여」

**how** 분모를 유리화한 후 합차 공식을 적용하여 x^2 - y^2을 신속하게 계산했다. (문항 토큰 4)

<details><summary>저장 해설 (판정 검토용)</summary>

분모를 각각 유리화한 후 합차 공식을 이용하여 제곱의 차를 효율적으로 계산한다.


1단계: $x, y$의 분모를 각각 유리화한다. [2점]


* $$x = \dfrac{1}{2-\sqrt{3}} = \dfrac{2+\sqrt{3}}{(2-\sqrt{3})(2+\sqrt{3})} = \dfrac{2+\sqrt{3}}{2^2 - (\sqrt{3})^2} = \dfrac{2+\sqrt{3}}{4-3} = 2+\sqrt{3}$$
* $$y = \dfrac{1}{2+\sqrt{3}} = \dfrac{2-\sqrt{3}}{(2+\sqrt{3})(2-\sqrt{3})} = \dfrac{2-\sqrt{3}}{4-3} = 2-\sqrt{3}$$


2단계: $x+y$와 $x-y$의 값을 구한다. [2점]


* $$x + y = (2+\sqrt{3}) + (2-\sqrt{3}) = 4$$
* $$x - y = (2+\sqrt{3}) - (2-\sqrt{3}) = 2 + \sqrt{3} - 2 + \sqrt{3} = 2\sqrt{3}$$


3단계: $x^2 - y^2$의 값을 계산한다. [1점] 합차 공식에 의하여 $$x^2 - y^2 = (x + y)(x - y) = 4 \times 2\sqrt{3} = 8\sqrt{3}$$


따라서 정답은 $8\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
