# 검수 묶음 — 23_순천여고_1학기_중간_고1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 23개 / 검사 PASS 22, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 3, 2단계 9, 3단계 7, 4단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q5**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.6점


**발문**

$1+i+i^2+\cdots+i^{11}+\frac{1}{i^3}$을 간단히 하면? (단, $i=\sqrt{-1}$이다.)

**보기** ① $i$  ② $-i$  ③ $1+i$  ④ $1-i$  ⑤ $0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 허수단위 $i$의 거듭제곱은 주기가 $4$이고 $1+i+i^2+i^3=1+i-1-i=0$이다.
2. $1+i+i^2+\cdots+i^{11}$은 연속한 $4$개 항의 묶음이 $3$개이므로 $1+i+i^2+\cdots+i^{11}=0$ 또한 $\frac{1}{i^3}=\frac{1}{-i}=\frac{i}{-i^2}=i$이므로 $1+i+i^2+\cdots+i^{11}+\frac{1}{i^3}=0+i=i$ 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$1+i+i^2+\cdots+i^{11}+\frac{1」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > i의 거듭제곱 > 주기성 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: 문항1번(토큰:11) 대상 문항1의 복소수의 계산 단원 RPM H1-RPM-023 분류 유형에 해당한다
**유형** PT=PT_H1_COMPLEX_POWER_ROOT / TPL=TPL_H1_COMPLEX_I_PERIOD (원천과 같음) (원천과 같음)
- 이유: 문항1번(토큰:11) 대상 문항1의 복소수의 계산 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항1번(토큰:11) 대상 문항1의 복소수의 계산 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: 허수단위←stem:「$i=\sqrt{-1}$」
- goal: 복소수←stem:「간단히 하면?」
- method: 거듭제곱(NAMED)←solution:「허수단위 $i$의 거듭제곱은 주기가 $4$이고」
- condition: (없음)

**how** 문항1번(토큰:11) 발문과 해설의 문항1 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

허수단위 $i$의 거듭제곱은 주기가 $4$이고 $1+i+i^2+i^3=1+i-1-i=0$이다. $1+i+i^2+\cdots+i^{11}$은 연속한 $4$개 항의 묶음이 $3$개이므로 $1+i+i^2+\cdots+i^{11}=0$ 또한 $\frac{1}{i^3}=\frac{1}{-i}=\frac{i}{-i^2}=i$이므로 $1+i+i^2+\cdots+i^{11}+\frac{1}{i^3}=0+i=i$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.7점


**발문**

등식 $(2-i)\overline{z}=10i$를 만족시키는 복소수 $z$는? (단, $\overline{z}$는 $z$의 켤레복소수이고, $i=\sqrt{-1}$이다.)

**보기** ① $-2+4i$  ② $2-4i$  ③ $-2-4i$  ④ $4-2i$  ⑤ $-4-2i$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 양변을 $2-i$로 나누면 $\begin{aligned} \overline{z} &= \frac{10i}{2-i} \ &= \frac{10i(2+i)}{(2-i)(2+i)} \ &= \frac{20i+10i^2}{4-i^2} \ &= \frac{-10+20i}{5} = -2+4i \end{aligned}$ 따라서 구하는 복소수 $z$는 $\overline{z}$의 켤레복소수이므로 $z=-2-4i$이다.
2. 그러므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「등식 $(2-i)\overline{z}=10i$를 만족」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: 문항2번(토큰:10) 대상 문항2의 복소수의 계산 단원 RPM H1-RPM-023 분류 유형에 해당한다
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_CONJUGATE_NORM (원천과 같음) (원천과 같음)
- 이유: 문항2번(토큰:10) 대상 문항2의 복소수의 계산 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항2번(토큰:10) 대상 문항2의 복소수의 계산 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: 복소수←stem:「복소수 $z$」
- goal: 켤레복소수←stem:「$\overline{z}$는 $z$의 켤레복소수이고」
- method: 유리화(IMPLIED)←solution:「\frac{10i(2+i)}{(2-i)(2+i)}」 — 분모와 분자에 분모의 켤레복소수 2+i를 곱해 분모를 실수로 만듦
- condition: 허수단위←stem:「$i=\sqrt{-1}$」

**how** 문항2번(토큰:10) 발문과 해설의 문항2 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

양변을 $2-i$로 나누면 $\begin{aligned} \overline{z} &= \frac{10i}{2-i} \ &= \frac{10i(2+i)}{(2-i)(2+i)} \ &= \frac{20i+10i^2}{4-i^2} \ &= \frac{-10+20i}{5} = -2+4i \end{aligned}$ 따라서 구하는 복소수 $z$는 $\overline{z}$의 켤레복소수이므로 $z=-2-4i$이다. 그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.7점


**발문**

이차방정식 $x^2-4x+7=0$의 두 근을 $\alpha, \beta$라 할 때, $\alpha^2+\beta^2$의 값은?

**보기** ① $-2$  ② $2$  ③ $9$  ④ $16$  ⑤ $30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차방정식의 근과 계수의 관계에 의하여 $\alpha+\beta=4$, $\alpha\beta=7$이다.
2. 곱셈공식의 변형에 의하여 $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta=4^2-2\cdot 7=16-14=2$ 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $x^2-4x+7=0$의 두 근을 $\alp」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: 문항3번(토큰:16) 대상 문항3의 근과 계수의 관계 단원 RPM H1-RPM-029 분류 유형에 해당한다
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: 문항3번(토큰:16) 대상 문항3의 근과 계수의 관계 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항3번(토큰:16) 대상 문항3의 근과 계수의 관계 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2-4x+7=0$」
- goal: 합←stem:「$\alpha^2+\beta^2$의 값은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」<br>곱셈공식(NAMED)←solution:「곱셈공식의 변형에 의하여」
- condition: (없음)

**how** 문항3번(토큰:16) 발문과 해설의 문항3 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식의 근과 계수의 관계에 의하여 $\alpha+\beta=4$, $\alpha\beta=7$이다. 곱셈공식의 변형에 의하여 $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta=4^2-2\cdot 7=16-14=2$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.8점


**발문**

이차함수 $y=2x^2-3x+a$의 그래프와 직선 $y=x+5$가 접할 때, 상수 $a$의 값은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차함수 $y=2x^2-3x+a$의 그래프와 직선 $y=x+5$가 접하므로 방정식 $2x^2-3x+a=x+5$, 즉 $2x^2-4x+a-5=0$ 이 중근을 가져야 한다.
2. 이 이차방정식의 판별식을 $D$라 하면 $\frac{D}{4}=(-2)^2-2(a-5)=4-2a+10=14-2a=0$ 따라서 $a=7$이다.
3. 그러므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=2x^2-3x+a$의 그래프와 직선 $y」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 접선 조건 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: 문항4번(토큰:10) 대상 문항4의 이차방정식과 이차함수의 관계 단원 RPM H1-RPM-033 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: 문항4번(토큰:10) 대상 문항4의 이차방정식과 이차함수의 관계 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항4번(토큰:10) 대상 문항4의 이차방정식과 이차함수의 관계 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 이차함수←stem:「이차함수 $y=2x^2-3x+a$」<br>직선←stem:「직선 $y=x+5$」
- goal: 상수←stem:「상수 $a$의 값은?」
- method: 판별식(NAMED)←solution:「판별식을 $D$라 하면」
- condition: (없음)

**how** 문항4번(토큰:10) 발문과 해설의 문항4 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=2x^2-3x+a$의 그래프와 직선 $y=x+5$가 접하므로 방정식 $2x^2-3x+a=x+5$, 즉 $2x^2-4x+a-5=0$ 이 중근을 가져야 한다. 이 이차방정식의 판별식을 $D$라 하면 $\frac{D}{4}=(-2)^2-2(a-5)=4-2a+10=14-2a=0$ 따라서 $a=7$이다. 그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

삼차방정식 $x^3+ax^2+bx-5=0$의 한 근이 $\sqrt{5}$일 때, 유리수 $a, b$에 대하여 $a+b$의 값은?

**보기** ① $-6$  ② $-5$  ③ $-2$  ④ $-4$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼차방정식의 계수가 모두 유리수이고 한 근이 $\sqrt{5}$이므로 켤레근 $-\sqrt{5}$도 근이다. (ax)
2. 나머지 한 근을 $\gamma$라 하면 삼차방정식의 근과 계수의 관계에 의하여 세 근의 곱은 $\sqrt{5}\cdot(-\sqrt{5})\cdot\gamma=5 \implies -5\gamma=5 \implies \gamma=-1$ 세 근이 $\sqrt{5}, -\sqrt{5}, -1$이므로 $-a=\sqrt{5}+(-\sqrt{5})+(-1)=-1 \implies a=1$ $b=\sqrt{5}(-\sqrt{5})+(-\sqrt{5})(-1)+(-1)\sqrt{5}=-5$ 따라서 $a+b=1+(-5)=-4$이다.
3. 그러므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_ROOT(복소수와 이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼차방정식 $x^3+ax^2+bx-5=0$의 한 근이 」
**RPM** H1-RPM-031 [방정식과 부등식 > 이차방정식 > 복소수 근 > 허근] (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 복소수와 이차방정식 단원 RPM H1-RPM-031 분류 유형에 해당한다
**유형** PT=PT_H1_COMPLEX_CONDITION_EQUATION / TPL=TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION (원천과 같음) (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 복소수와 이차방정식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 복소수와 이차방정식 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 삼차방정식←stem:「삼차방정식 $x^3+ax^2+bx-5=0$」
- goal: 합←stem:「$a+b$의 값은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: 유리수←stem:「유리수 $a, b$에 대하여」

**how** 문항5번(토큰:ax) 발문과 해설의 문항5 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

삼차방정식의 계수가 모두 유리수이고 한 근이 $\sqrt{5}$이므로 켤레근 $-\sqrt{5}$도 근이다. 나머지 한 근을 $\gamma$라 하면 삼차방정식의 근과 계수의 관계에 의하여 세 근의 곱은 $\sqrt{5}\cdot(-\sqrt{5})\cdot\gamma=5 \implies -5\gamma=5 \implies \gamma=-1$ 세 근이 $\sqrt{5}, -\sqrt{5}, -1$이므로 $-a=\sqrt{5}+(-\sqrt{5})+(-1)=-1 \implies a=1$ $b=\sqrt{5}(-\sqrt{5})+(-\sqrt{5})(-1)+(-1)\sqrt{5}=-5$ 따라서 $a+b=1+(-5)=-4$이다. 그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.9점


**발문**

두 복소수 $z_1, z_2$와 그 켤레복소수 $\overline{z_1}, \overline{z_2}$에 대하여 다음 중 옳지 않은 것은? (단, $i=\sqrt{-1}$이다.)

**보기** ① $z_1+\overline{z_1}$은 항상 실수이다.  ② $\overline{z_1}=-z_1$이면 $z_1$은 순허수이다.  ③ $z_1\overline{z_1}$은 항상 $0$ 이상의 실수이다.  ④ $\overline{z_1+z_2}=\overline{z_1}+\overline{z_2}$가 성립한다.  ⑤ $z_1=\overline{z_1}$이고 $z_2=\overline{z_2}$이면 $z_1 z_2$는 실수이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $z_1=a+bi$ ($a, b$는 실수)라 하면 $\overline{z_1}=a-bi$이다.
2. ① $z_1+\overline{z_1}=2a$이므로 항상 실수이다.
3. (참) ② $\overline{z_1}=-z_1$이면 $a-bi=-a-bi \implies 2a=0 \implies a=0$이므로 $z_1=bi$이다.
4. 이때 $b=0$, 즉 $z_1=0$이면 $z_1$은 실수이지 순허수가 아니다.
5. (거짓) ③ $z_1\overline{z_1}=a^2+b^2\ge 0$이므로 항상 $0$ 이상의 실수이다.
6. (참) ④, ⑤ 켤레복소수의 성질에 의하여 모두 참이다.
7. 따라서 옳지 않은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 복소수 $z_1, z_2$와 그 켤레복소수 $\ov」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] (원천과 같음)
- 이유: 문항6번(토큰:bi) 대상 문항6의 복소수의 계산 단원 RPM H1-RPM-023 분류 유형에 해당한다
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_COMPONENT_OPERATION (원천과 같음) (원천과 같음)
- 이유: 문항6번(토큰:bi) 대상 문항6의 복소수의 계산 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항6번(토큰:bi) 대상 문항6의 복소수의 계산 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 복소수←stem:「두 복소수 $z_1, z_2$」
- goal: 켤레복소수←stem:「그 켤레복소수 $\overline{z_1}, \overline{z_2}$에 대하여 다음 중 옳지 않은 것은?」
- method: 반례(IMPLIED)←solution:「이때 $b=0$, 즉 $z_1=0$이면 $z_1$은 실수이지 순허수가 아니다.」 — z1=0이라는 구체적 반례를 들어 명제가 거짓임을 보임
- condition: 순허수←choices:「$z_1$은 순허수이다.」

**how** 문항6번(토큰:bi) 발문과 해설의 문항6 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$z_1=a+bi$ ($a, b$는 실수)라 하면 $\overline{z_1}=a-bi$이다. ① $z_1+\overline{z_1}=2a$이므로 항상 실수이다. (참) ② $\overline{z_1}=-z_1$이면 $a-bi=-a-bi \implies 2a=0 \implies a=0$이므로 $z_1=bi$이다. 이때 $b=0$, 즉 $z_1=0$이면 $z_1$은 실수이지 순허수가 아니다. (거짓) ③ $z_1\overline{z_1}=a^2+b^2\ge 0$이므로 항상 $0$ 이상의 실수이다. (참) ④, ⑤ 켤레복소수의 성질에 의하여 모두 참이다. 따라서 옳지 않은 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.9점


**발문**

절댓값 기호를 포함한 부등식 $|x+a| \le b$의 해가 $-2 \le x \le 6$일 때, 실수 $a, b$에 대하여 $ab$의 값은? (단, $b>0$이다.)

**보기** ① $-8$  ② $-4$  ③ $-2$  ④ $4$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $b>0$이므로 $|x+a| \le b$를 풀면 $-b \le x+a \le b \implies -b-a \le x \le b-a$ 주어진 해가 $-2 \le x \le 6$이므로 $-b-a=-2, \quad b-a=6$ 두 식을 연립하여 더하면 $-2a=4 \implies a=-2$이고, $b=4$이다.
2. 따라서 $ab=(-2)\cdot 4=-8$이다.
3. 그러므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-SYSTEM_INEQUALITY(연립부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「절댓값 기호를 포함한 부등식 $|x+a| \le b$의」
**RPM** H1-RPM-045 [방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위] (원천과 같음)
- 이유: 문항7번(토큰:ab) 대상 문항7의 연립부등식 단원 RPM H1-RPM-045 분류 유형에 해당한다
**유형** PT=PT_H1_LINEAR_SYSTEM_INEQUALITY / TPL=TPL_H1_LINEAR_INEQUALITY_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항7번(토큰:ab) 대상 문항7의 연립부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항7번(토큰:ab) 대상 문항7의 연립부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 절댓값←stem:「부등식 $|x+a| \le b$」
- goal: 곱←stem:「$ab$의 값은?」
- method: 연립방정식(IMPLIED)←solution:「두 식을 연립하여 더하면」 — 양 끝점 식 -b-a=-2와 b-a=6을 연립방정식으로 풀이함
- condition: 실수←stem:「실수 $a, b$에 대하여」

**how** 문항7번(토큰:ab) 발문과 해설의 문항7 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$b>0$이므로 $|x+a| \le b$를 풀면 $-b \le x+a \le b \implies -b-a \le x \le b-a$ 주어진 해가 $-2 \le x \le 6$이므로 $-b-a=-2, \quad b-a=6$ 두 식을 연립하여 더하면 $-2a=4 \implies a=-2$이고, $b=4$이다. 따라서 $ab=(-2)\cdot 4=-8$이다. 그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

연립방정식 $\begin{cases} x-y=2 \ x^2+y^2=20 \end{cases}$의 해를 $x=\alpha, y=\beta$라 할 때, $|\alpha+\beta|$의 값은?

**보기** ① $2$  ② $4$  ③ $5$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x-y=2$의 양변을 제곱하면 $x^2-2xy+y^2=4$ 여기에 $x^2+y^2=20$을 대입하면 $20-2xy=4 \implies xy=8$이다. (cases)
2. 따라서 $(x+y)^2=x^2+y^2+2xy=20+2\cdot 8=36$ 이므로 $|\alpha+\beta|=\sqrt{36}=6$이다.
3. 그러므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{cases} x-y=2 \ x」
**RPM** H1-RPM-001 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 곱셈 > 곱셈공식 → 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리**
- 이유: 문항8번(토큰:cases) 대상 문항8의 다항식의 기본 연산 단원 RPM H1-RPM-001 분류 유형에 해당한다
**유형** PT=PT_H1_POLY_FORMULA_SYMMETRIC / TPL=TPL_H1_FORMULA_SYMMETRIC (원천과 같음) (원천과 같음)
- 이유: 문항8번(토큰:cases) 대상 문항8의 다항식의 기본 연산 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항8번(토큰:cases) 대상 문항8의 다항식의 기본 연산 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} x-y=2 \ x^2+y^2=20 \end{cases}$」
- goal: 절댓값←stem:「$|\alpha+\beta|$의 값은?」
- method: 곱셈공식(IMPLIED)←solution:「$(x+y)^2=x^2+y^2+2xy=20+2\cdot 8=36$」 — x-y와 x^2+y^2에서 xy를 구하고 (x+y)^2으로 연결하는 곱셈공식 변형을 적용함
- condition: (없음)

**how** 문항8번(토큰:cases) 발문과 해설의 문항8 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$x-y=2$의 양변을 제곱하면 $x^2-2xy+y^2=4$ 여기에 $x^2+y^2=20$을 대입하면 $20-2xy=4 \implies xy=8$이다. 따라서 $(x+y)^2=x^2+y^2+2xy=20+2\cdot 8=36$ 이므로 $|\alpha+\beta|=\sqrt{36}=6$이다. 그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

이차함수 $y=x^2-kx-5$의 그래프가 $x$축과 만나는 두 점 사이의 거리가 $6$일 때, $|k|$의 값은? (단, $k$는 상수이다.)

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차함수 $y=x^2-kx-5$의 그래프가 $x$축과 만나는 두 점의 $x$좌표를 $\alpha, \beta$라 하면 $\alpha, \beta$는 이차방정식 $x^2-kx-5=0$의 두 실근이다.
2. 근과 계수의 관계에 의하여 $\alpha+\beta=k$, $\alpha\beta=-5$이다.
3. 두 점 사이의 거리가 $6$이므로 $|\alpha-\beta|=6$이고, 양변을 제곱하면 $(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=k^2-4(-5)=k^2+20=36$ 따라서 $k^2=16$이므로 $|k|=4$이다.
4. 그러므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2-kx-5$의 그래프가 $x$축과 」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] (원천과 같음)
- 이유: 문항9번(토큰:kx) 대상 문항9의 이차방정식과 이차함수의 관계 단원 RPM H1-RPM-033 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: 문항9번(토큰:kx) 대상 문항9의 이차방정식과 이차함수의 관계 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항9번(토큰:kx) 대상 문항9의 이차방정식과 이차함수의 관계 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-kx-5$」
- goal: 절댓값←stem:「$|k|$의 값은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」<br>곱셈공식(IMPLIED)←solution:「(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta」 — 두 근의 차의 제곱을 합과 곱으로 변형함
- condition: 거리←stem:「두 점 사이의 거리가 $6$일 때」

**how** 문항9번(토큰:kx) 발문과 해설의 문항9 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=x^2-kx-5$의 그래프가 $x$축과 만나는 두 점의 $x$좌표를 $\alpha, \beta$라 하면 $\alpha, \beta$는 이차방정식 $x^2-kx-5=0$의 두 실근이다. 근과 계수의 관계에 의하여 $\alpha+\beta=k$, $\alpha\beta=-5$이다. 두 점 사이의 거리가 $6$이므로 $|\alpha-\beta|=6$이고, 양변을 제곱하면 $(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=k^2-4(-5)=k^2+20=36$ 따라서 $k^2=16$이므로 $|k|=4$이다. 그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

연립일차부등식 $\begin{cases} 2x+3 \le k-x \ 5-4x \le 2x-7 \end{cases}$이 해를 갖도록 하는 정수 $k$의 최솟값은?

**보기** ① $5$  ② $6$  ③ $7$  ④ $8$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫 번째 부등식 $2x+3 \le k-x$를 풀면 $3x \le k-3 \implies x \le \frac{k-3}{3}$ 두 번째 부등식 $5-4x \le 2x-7$을 풀면 $12 \le 6x \implies x \ge 2$ 이 연립부등식이 해를 가지려면 수직선 위에서 공통부분이 존재해야 하므로 $2 \le \frac{k-3}{3} \implies 6 \le k-3 \implies k \ge 9$ 따라서 정수 $k$의 최솟값은 $9$이다. (cases)
2. 그러므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-SYSTEM_INEQUALITY(연립부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립일차부등식 $\begin{cases} 2x+3 \l」
**RPM** H1-RPM-045 [방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위] (원천과 같음)
- 이유: 문항10번(토큰:cases) 대상 문항10의 연립부등식 단원 RPM H1-RPM-045 분류 유형에 해당한다
**유형** PT=PT_H1_LINEAR_SYSTEM_INEQUALITY / TPL=TPL_H1_LINEAR_INEQUALITY_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항10번(토큰:cases) 대상 문항10의 연립부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항10번(토큰:cases) 대상 문항10의 연립부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 연립일차부등식←stem:「연립일차부등식 $\begin{cases} 2x+3 \le k-x \ 5-4x \le 2x-7 \end{cases}$」
- goal: 최솟값←stem:「정수 $k$의 최솟값은?」
- method: 부등식(IMPLIED)←solution:「공통부분이 존재해야 하므로」 — 두 부등식 해의 교집합이 공집합이 아니도록 경계 대소 관계를 세움
- condition: 정수←stem:「정수 $k$」

**how** 문항10번(토큰:cases) 발문과 해설의 문항10 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

첫 번째 부등식 $2x+3 \le k-x$를 풀면 $3x \le k-3 \implies x \le \frac{k-3}{3}$ 두 번째 부등식 $5-4x \le 2x-7$을 풀면 $12 \le 6x \implies x \ge 2$ 이 연립부등식이 해를 가지려면 수직선 위에서 공통부분이 존재해야 하므로 $2 \le \frac{k-3}{3} \implies 6 \le k-3 \implies k \ge 9$ 따라서 정수 $k$의 최솟값은 $9$이다. 그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다항식 $3x^3-4x^2+ax+b$가 $(x-1)^2$으로 나누어떨어질 때의 몫을 $P(x)$라 하자. 이때 $P(2)$의 값은? (단, $a, b$는 상수이다.)

**보기** ① $2$  ② $5$  ③ $8$  ④ $11$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 다항식 $3x^3-4x^2+ax+b$가 $(x-1)^2$으로 나누어떨어지고 최고차항의 계수가 $3$이므로, 몫 $P(x)$를 $P(x)=3x+c$ ($c$는 상수)로 놓을 수 있다.
2. $\begin{aligned} 3x^3-4x^2+ax+b &= (x-1)^2(3x+c) \ &= (x^2-2x+1)(3x+c) \ &= 3x^3+(c-6)x^2+(3-2c)x+c \end{aligned}$ 양변의 $x^2$의 계수를 비교하면 $c-6=-4$이므로 $c=2$이다.
3. 따라서 $P(x)=3x+2$이므로 $P(2)=3\cdot 2+2=8$이다.
4. 그러므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $3x^3-4x^2+ax+b$가 $(x-1)^2」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법] (원천과 같음)
- 이유: 문항11번(토큰:ax) 대상 문항11의 항등식과 계수비교 단원 RPM H1-RPM-007 분류 유형에 해당한다
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_COEFFICIENT_COMPARE (원천과 같음) (원천과 같음)
- 이유: 문항11번(토큰:ax) 대상 문항11의 항등식과 계수비교 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항11번(토큰:ax) 대상 문항11의 항등식과 계수비교 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 다항식←stem:「다항식 $3x^3-4x^2+ax+b$」
- goal: 함숫값←stem:「$P(2)$의 값은?」
- method: 항등식(IMPLIED)←solution:「3x^3-4x^2+ax+b &= (x-1)^2(3x+c)」 — 나누어떨어진다는 조건으로 나눗셈 항등식을 세움<br>계수비교(NAMED)←solution:「양변의 $x^2$의 계수를 비교하면」
- condition: 상수←stem:「$a, b$는 상수이다.」

**how** 문항11번(토큰:ax) 발문과 해설의 문항11 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

다항식 $3x^3-4x^2+ax+b$가 $(x-1)^2$으로 나누어떨어지고 최고차항의 계수가 $3$이므로, 몫 $P(x)$를 $P(x)=3x+c$ ($c$는 상수)로 놓을 수 있다. $\begin{aligned} 3x^3-4x^2+ax+b &= (x-1)^2(3x+c) \ &= (x^2-2x+1)(3x+c) \ &= 3x^3+(c-6)x^2+(3-2c)x+c \end{aligned}$ 양변의 $x^2$의 계수를 비교하면 $c-6=-4$이므로 $c=2$이다. 따라서 $P(x)=3x+2$이므로 $P(2)=3\cdot 2+2=8$이다. 그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

$-1 \le x \le 3$에서 이차부등식 $x^2-4x-a^2+13 \ge 0$이 항상 성립하도록 하는 정수 $a$의 최댓값은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x)=x^2-4x-a^2+13=(x-2)^2+9-a^2$이라 하자.
2. 이차함수 $f(x)$는 아래로 볼록하고 꼭짓점의 $x$좌표 $2$가 주어진 범위 $-1 \le x \le 3$에 포함되므로, 이 범위에서 $f(x)$의 최솟값은 $f(2)=9-a^2$이다.
3. 부등식 $f(x) \ge 0$이 항상 성립하려면 최솟값이 $0$ 이상이어야 하므로 $9-a^2 \ge 0 \implies a^2 \le 9 \implies -3 \le a \le 3$ 따라서 정수 $a$의 최댓값은 $3$이다.
4. 그러므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-1 \le x \le 3$에서 이차부등식 $x^2-」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] (원천과 같음)
- 이유: 문항12번(토큰:13) 대상 문항12의 이차함수의 활용 단원 RPM H1-RPM-037 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항12번(토큰:13) 대상 문항12의 이차함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항12번(토큰:13) 대상 문항12의 이차함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: 이차부등식←stem:「이차부등식 $x^2-4x-a^2+13 \ge 0$」
- goal: 최댓값←stem:「정수 $a$의 최댓값은?」
- method: 최솟값(NAMED)←solution:「이 범위에서 $f(x)$의 최솟값은 $f(2)=9-a^2$이다.」
- condition: 항상성립←stem:「항상 성립하도록 하는」

**how** 문항12번(토큰:13) 발문과 해설의 문항12 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)=x^2-4x-a^2+13=(x-2)^2+9-a^2$이라 하자. 이차함수 $f(x)$는 아래로 볼록하고 꼭짓점의 $x$좌표 $2$가 주어진 범위 $-1 \le x \le 3$에 포함되므로, 이 범위에서 $f(x)$의 최솟값은 $f(2)=9-a^2$이다. 부등식 $f(x) \ge 0$이 항상 성립하려면 최솟값이 $0$ 이상이어야 하므로 $9-a^2 \ge 0 \implies a^2 \le 9 \implies -3 \le a \le 3$ 따라서 정수 $a$의 최댓값은 $3$이다. 그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.1점


**발문**

$x$에 대한 이차방정식 $(a-3)x^2+(a-b)x-(b-3)=0$이 중근을 가질 때, $a+b$의 값은? (단, $a, b$는 상수이다.)

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 $x$에 대한 이차방정식이 중근을 가지므로 판별식 $D=0$이어야 한다.
2. $\begin{aligned} D &= (a-b)^2-4(a-3){-(b-3)} \ &= a^2-2ab+b^2+4(ab-3a-3b+9) \ &= a^2+2ab+b^2-12(a+b)+36 \ &= (a+b)^2-12(a+b)+36 \ &= (a+b-6)^2 = 0 \end{aligned}$ 따라서 $a+b=6$이다.
3. 그러므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-DISCRIMINANT(판별식과 근의 조건) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 이차방정식 $(a-3)x^2+(a-b)x」
**RPM** H1-RPM-028 [방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 판별식] (원천과 같음)
- 이유: 문항13번(토큰:aligned) 대상 문항13의 판별식과 근의 조건 단원 RPM H1-RPM-028 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=TPL_H1_DISCRIMINANT_ROOT_EXISTENCE (원천과 같음) (원천과 같음)
- 이유: 문항13번(토큰:aligned) 대상 문항13의 판별식과 근의 조건 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항13번(토큰:aligned) 대상 문항13의 판별식과 근의 조건 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 이차방정식←stem:「이차방정식 $(a-3)x^2+(a-b)x-(b-3)=0$」
- goal: 합←stem:「$a+b$의 값은?」
- method: 판별식(NAMED)←solution:「판별식 $D=0$이어야 한다.」<br>완전제곱식(IMPLIED)←solution:「(a+b-6)^2 = 0」 — D식을 (a+b-6)^2의 완전제곱식으로 변형함
- condition: 중근←stem:「중근을 가질 때」

**how** 문항13번(토큰:aligned) 발문과 해설의 문항13 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 $x$에 대한 이차방정식이 중근을 가지므로 판별식 $D=0$이어야 한다. $\begin{aligned} D &= (a-b)^2-4(a-3){-(b-3)} \ &= a^2-2ab+b^2+4(ab-3a-3b+9) \ &= a^2+2ab+b^2-12(a+b)+36 \ &= (a+b)^2-12(a+b)+36 \ &= (a+b-6)^2 = 0 \end{aligned}$ 따라서 $a+b=6$이다. 그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.1점


**발문**

삼차방정식 $x^3-2x^2+2x+5=0$의 한 허근을 $\omega$라 하고, $z=\frac{\omega}{\omega-1}$이라 할 때, $z+\overline{z}$의 값은? (단, $\overline{z}$는 $z$의 켤레복소수이다.)

**보기** ① $\frac{5}{3}$  ② $\frac{7}{3}$  ③ $3$  ④ $\frac{10}{3}$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(x)=x^3-2x^2+2x+5$라 하면 $P(-1)=-1-2-2+5=0$이므로 조립제법으로 인수분해하면 $x^3-2x^2+2x+5=(x+1)(x^2-3x+5)=0$ $\omega$는 허근이므로 이차방정식 $x^2-3x+5=0$의 한 근이고, 다른 한 허근은 $\overline{\omega}$이다. (10)
2. 근과 계수의 관계에 의하여 $\omega+\overline{\omega}=3$, $\omega\overline{\omega}=5$이다.
3. 따라서 $\begin{aligned} z+\overline{z} &= \frac{\omega}{\omega-1}+\frac{\overline{\omega}}{\overline{\omega}-1} \ &= \frac{\omega(\overline{\omega}-1)+\overline{\omega}(\omega-1)}{(\omega-1)(\overline{\omega}-1)} \ &= \frac{2\omega\overline{\omega}-(\omega+\overline{\omega})}{\omega\overline{\omega}-(\omega+\overline{\omega})+1} \ &= \frac{2\cdot 5-3}{5-3+1}=\frac{7}{3} \end{aligned}$ 그러므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼차방정식 $x^3-2x^2+2x+5=0$의 한 허근을」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] (원천과 같음)
- 이유: 문항14번(토큰:10) 대상 문항14의 고차방정식의 풀이 단원 RPM H1-RPM-039 분류 유형에 해당한다
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_FACTOR_ROOT (원천과 같음) (원천과 같음)
- 이유: 문항14번(토큰:10) 대상 문항14의 고차방정식의 풀이 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항14번(토큰:10) 대상 문항14의 고차방정식의 풀이 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 삼차방정식←stem:「삼차방정식 $x^3-2x^2+2x+5=0$」
- goal: 합←stem:「$z+\overline{z}$의 값은?」
- method: 인수분해(NAMED)←solution:「조립제법으로 인수분해하면」<br>근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여 $\omega+\overline{\omega}=3$, $\omega\overline{\omega}=5$이다.」
- condition: 허근←stem:「한 허근을 $\omega$라 하고」

**how** 문항14번(토큰:10) 발문과 해설의 문항14 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$P(x)=x^3-2x^2+2x+5$라 하면 $P(-1)=-1-2-2+5=0$이므로 조립제법으로 인수분해하면 $x^3-2x^2+2x+5=(x+1)(x^2-3x+5)=0$ $\omega$는 허근이므로 이차방정식 $x^2-3x+5=0$의 한 근이고, 다른 한 허근은 $\overline{\omega}$이다. 근과 계수의 관계에 의하여 $\omega+\overline{\omega}=3$, $\omega\overline{\omega}=5$이다. 따라서 $\begin{aligned} z+\overline{z} &= \frac{\omega}{\omega-1}+\frac{\overline{\omega}}{\overline{\omega}-1} \ &= \frac{\omega(\overline{\omega}-1)+\overline{\omega}(\omega-1)}{(\omega-1)(\overline{\omega}-1)} \ &= \frac{2\omega\overline{\omega}-(\omega+\overline{\omega})}{\omega\overline{\omega}-(\omega+\overline{\omega})+1} \ &= \frac{2\cdot 5-3}{5-3+1}=\frac{7}{3} \end{aligned}$ 그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.1점


**발문**

부등식 $ax^2-2ax-5 \ge 0$이 해를 갖지 않도록 하는 정수 $a$의 개수는?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (i) $a=0$일 때, 주어진 부등식은 $-5 \ge 0$이 되어 해를 갖지 않는다.
2. (ii) $a \neq 0$일 때, 모든 실수 $x$에 대하여 $ax^2-2ax-5 < 0$이어야 하므로 $a < 0$이고 판별식 $D < 0$이어야 한다.
3. $\frac{D}{4}=(-a)^2-a(-5)=a^2+5a=a(a+5) < 0 \implies -5 < a < 0$ (i), (ii)에 의하여 $-5 < a \le 0$이므로 정수 $a$는 $-4, -3, -2, -1, 0$으로 모두 $5$개이다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-QUADRATIC_INEQUALITY(이차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「부등식 $ax^2-2ax-5 \ge 0$이 해를 갖지 」
**RPM** H1-RPM-047 [방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해] **원천→판정: 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 근의 위치와 해 → 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해**
- 이유: 문항15번(토큰:ax) 대상 문항15의 이차부등식 단원 RPM H1-RPM-047 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_INEQUALITY / TPL=TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항15번(토큰:ax) 대상 문항15의 이차부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항15번(토큰:ax) 대상 문항15의 이차부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 부등식←stem:「부등식 $ax^2-2ax-5 \ge 0$」
- goal: 개수←stem:「정수 $a$의 개수는?」
- method: 경우분류(IMPLIED)←solution:「(i) $a=0$일 때」 — 이차항 계수 a=0과 a!=0인 경우로 나누어 판정함<br>판별식(NAMED)←solution:「판별식 $D < 0$이어야 한다.」
- condition: 정수←stem:「정수 $a$」

**how** 문항15번(토큰:ax) 발문과 해설의 문항15 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

(i) $a=0$일 때, 주어진 부등식은 $-5 \ge 0$이 되어 해를 갖지 않는다. (ii) $a \neq 0$일 때, 모든 실수 $x$에 대하여 $ax^2-2ax-5 < 0$이어야 하므로 $a < 0$이고 판별식 $D < 0$이어야 한다. $\frac{D}{4}=(-a)^2-a(-5)=a^2+5a=a(a+5) < 0 \implies -5 < a < 0$ (i), (ii)에 의하여 $-5 < a \le 0$이므로 정수 $a$는 $-4, -3, -2, -1, 0$으로 모두 $5$개이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.1점


**발문**

$x$에 대한 이차방정식 $x^2-(a-3)x+5-a=0$의 두 근이 모두 정수가 되도록 하는 모든 실수 $a$의 값의 합은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차방정식의 두 정수근을 $\alpha, \beta$ ($lpha \le \beta$)라 하면 근과 계수의 관계에 의하여 $\alpha+\beta=a-3, \quad \alpha\beta=5-a$ 두 식을 변변 더하여 $a$를 소거하면 $\alpha\beta+\alpha+\beta=2$ 양변에 $1$을 더하여 인수분해하면 $(\alpha+1)(\beta+1)=3$ $\alpha+1, \beta+1$은 정수이고 $\alpha \le \beta$이므로 가능한 순서쌍 $(\alpha+1, \beta+1)$은 $(1, 3)$, $(-3, -1)$이다.
2. (i) $\alpha+1=1, \beta+1=3$일 때, $\alpha=0, \beta=2$이므로 $a=\alpha+\beta+3=5$ (ii) $\alpha+1=-3, \beta+1=-1$일 때, $\alpha=-4, \beta=-2$이므로 $a=\alpha+\beta+3=-3$ 따라서 모든 실수 $a$의 값의 합은 $5+(-3)=2$이다.
3. 그러므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 이차방정식 $x^2-(a-3)x+5-a=」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: 문항16번(토큰:lpha) 대상 문항16의 근과 계수의 관계 단원 RPM H1-RPM-029 분류 유형에 해당한다
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: 문항16번(토큰:lpha) 대상 문항16의 근과 계수의 관계 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항16번(토큰:lpha) 대상 문항16의 근과 계수의 관계 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2-(a-3)x+5-a=0$」
- goal: 합←stem:「모든 실수 $a$의 값의 합은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」<br>부정방정식(IMPLIED)←solution:「(\alpha+1)(\beta+1)=3」 — 두 정수근의 곱 형태 부정방정식으로 인수분해해 순서쌍을 구함
- condition: 정수←stem:「두 근이 모두 정수가 되도록」

**how** 문항16번(토큰:lpha) 발문과 해설의 문항16 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식의 두 정수근을 $\alpha, \beta$ ($lpha \le \beta$)라 하면 근과 계수의 관계에 의하여 $\alpha+\beta=a-3, \quad \alpha\beta=5-a$ 두 식을 변변 더하여 $a$를 소거하면 $\alpha\beta+\alpha+\beta=2$ 양변에 $1$을 더하여 인수분해하면 $(\alpha+1)(\beta+1)=3$ $\alpha+1, \beta+1$은 정수이고 $\alpha \le \beta$이므로 가능한 순서쌍 $(\alpha+1, \beta+1)$은 $(1, 3)$, $(-3, -1)$이다. (i) $\alpha+1=1, \beta+1=3$일 때, $\alpha=0, \beta=2$이므로 $a=\alpha+\beta+3=5$ (ii) $\alpha+1=-3, \beta+1=-1$일 때, $\alpha=-4, \beta=-2$이므로 $a=\alpha+\beta+3=-3$ 따라서 모든 실수 $a$의 값의 합은 $5+(-3)=2$이다. 그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.2점


**발문**

모든 실수 $x$에 대하여 부등식 $2|x-2|+|x+4| \ge k$가 항상 성립하도록 하는 실수 $k$의 최댓값은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x)=2|x-2|+|x+4|$라 하고 절댓값 안이 $0$이 되는 $x=-4, 2$를 기준으로 구간을 나누면 (i) $x < -4$일 때, $f(x)=-2(x-2)-(x+4)=-3x > 12$ (ii) $-4 \le x < 2$일 때, $f(x)=-2(x-2)+(x+4)=-x+8$ ($6 < f(x) \le 12$) (iii) $x \ge 2$일 때, $f(x)=2(x-2)+(x+4)=3x \ge 6$ 따라서 $f(x)$는 $x=2$에서 최솟값 $6$을 가지므로, 부등식 $f(x) \ge k$가 모든 실수 $x$에 대하여 성립하려면 $k \le 6$이어야 한다.
2. 그러므로 실수 $k$의 최댓값은 $6$이다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-SYSTEM_INEQUALITY(연립부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「모든 실수 $x$에 대하여 부등식 $2|x-2|+|x+」
**RPM** H1-RPM-045 [방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위] (원천과 같음)
- 이유: 문항17번(토큰:12) 대상 문항17의 연립부등식 단원 RPM H1-RPM-045 분류 유형에 해당한다
**유형** PT=PT_H1_LINEAR_SYSTEM_INEQUALITY / TPL=TPL_H1_LINEAR_INEQUALITY_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항17번(토큰:12) 대상 문항17의 연립부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항17번(토큰:12) 대상 문항17의 연립부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 절댓값←stem:「부등식 $2|x-2|+|x+4| \ge k$」
- goal: 최댓값←stem:「실수 $k$의 최댓값은?」
- method: 경우분류(NAMED)←solution:「기준으로 구간을 나누면」
- condition: 항상성립←stem:「항상 성립하도록 하는」

**how** 문항17번(토큰:12) 발문과 해설의 문항17 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)=2|x-2|+|x+4|$라 하고 절댓값 안이 $0$이 되는 $x=-4, 2$를 기준으로 구간을 나누면 (i) $x < -4$일 때, $f(x)=-2(x-2)-(x+4)=-3x > 12$ (ii) $-4 \le x < 2$일 때, $f(x)=-2(x-2)+(x+4)=-x+8$ ($6 < f(x) \le 12$) (iii) $x \ge 2$일 때, $f(x)=2(x-2)+(x+4)=3x \ge 6$ 따라서 $f(x)$는 $x=2$에서 최솟값 $6$을 가지므로, 부등식 $f(x) \ge k$가 모든 실수 $x$에 대하여 성립하려면 $k \le 6$이어야 한다. 그러므로 실수 $k$의 최댓값은 $6$이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.3점


**발문**

그림과 같이 $\angle C=90^\circ$이고 $\overline{AC}=10$, $\overline{BC}=5$인 직각삼각형 $ABC$의 빗변 $AB$ 위의 점 $P$에서 변 $BC$, $AC$에 내린 수선의 발을 각각 $Q$, $R$라 하자. 직사각형 $PQCR$의 넓이가 두 직각삼각형 $PBQ$, $APR$의 넓이보다 각각 크도록 하는 선분 $QC$의 길이 $a$의 값의 범위가 $m < a < n$일 때, $m+n$의 값은?

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{QC}=a$ ($0 < a < 5$)라 하면 $\overline{BQ}=5-a$이다. (90)
2. $\triangle PBQ \sim \triangle ABC$이므로 $\overline{PQ}:\overline{BQ}=\overline{AC}:\overline{BC}=10:5=2:1$이고, $\overline{PQ}=2(5-a)=10-2a$이다.
3. 또한 $\overline{PR}=\overline{QC}=a$이고 $\overline{AR}=10-(10-2a)=2a$이다.
4. 세 도형의 넓이를 각각 구하면 (직사각형 $PQCR$의 넓이) $=a(10-2a)=10a-2a^2$ ($\triangle PBQ$의 넓이) $=\frac{1}{2}(5-a)(10-2a)=(5-a)^2=a^2-10a+25$ ($\triangle APR$의 넓이) $=\frac{1}{2}\cdot a\cdot 2a=a^2$ 조건에 의하여 (i) $10a-2a^2 > a^2-10a+25 \implies 3a^2-20a+25 < 0 \implies (3a-5)(a-5) < 0 \implies \frac{5}{3} < a < 5$ (ii) $10a-2a^2 > a^2 \implies 3a^2-10a < 0 \implies a(3a-10) < 0 \implies 0 < a < \frac{10}{3}$ (i), (ii)의 공통 범위는 $\frac{5}{3} < a < \frac{10}{3}$이므로 $m=\frac{5}{3}$, $n=\frac{10}{3}$이다.
5. 따라서 $m+n=\frac{5}{3}+\frac{10}{3}=5$이다.
6. 그러므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-QUADRATIC_INEQUALITY(이차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 $\angle C=90^\circ$이고 $」
**RPM** H1-RPM-047 [방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해] **원천→판정: 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 근의 위치와 해 → 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해**
- 이유: 문항18번(토큰:90) 대상 문항18의 이차부등식 단원 RPM H1-RPM-047 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_INEQUALITY / TPL=TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항18번(토큰:90) 대상 문항18의 이차부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항18번(토큰:90) 대상 문항18의 이차부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$」
- goal: 합←stem:「$m+n$의 값은?」
- method: 닮음(IMPLIED)←solution:「\triangle PBQ \sim \triangle ABC」 — 두 직각삼각형의 닮음비 2:1을 이용해 선분 PQ의 길이를 구함<br>연립부등식(IMPLIED)←solution:「(i), (ii)의 공통 범위는」 — 두 넓이 조건에서 나온 이차부등식 두 개의 공통 범위를 구함
- condition: 직사각형←stem:「직사각형 $PQCR$」

**how** 문항18번(토큰:90) 발문과 해설의 문항18 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{QC}=a$ ($0 < a < 5$)라 하면 $\overline{BQ}=5-a$이다. $\triangle PBQ \sim \triangle ABC$이므로 $\overline{PQ}:\overline{BQ}=\overline{AC}:\overline{BC}=10:5=2:1$이고, $\overline{PQ}=2(5-a)=10-2a$이다. 또한 $\overline{PR}=\overline{QC}=a$이고 $\overline{AR}=10-(10-2a)=2a$이다. 세 도형의 넓이를 각각 구하면 (직사각형 $PQCR$의 넓이) $=a(10-2a)=10a-2a^2$ ($\triangle PBQ$의 넓이) $=\frac{1}{2}(5-a)(10-2a)=(5-a)^2=a^2-10a+25$ ($\triangle APR$의 넓이) $=\frac{1}{2}\cdot a\cdot 2a=a^2$ 조건에 의하여 (i) $10a-2a^2 > a^2-10a+25 \implies 3a^2-20a+25 < 0 \implies (3a-5)(a-5) < 0 \implies \frac{5}{3} < a < 5$ (ii) $10a-2a^2 > a^2 \implies 3a^2-10a < 0 \implies a(3a-10) < 0 \implies 0 < a < \frac{10}{3}$ (i), (ii)의 공통 범위는 $\frac{5}{3} < a < \frac{10}{3}$이므로 $m=\frac{5}{3}$, $n=\frac{10}{3}$이다. 따라서 $m+n=\frac{5}{3}+\frac{10}{3}=5$이다. 그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.3점


**발문**

두 다항식 $f(x), g(x)$가 다음 조건을 모두 만족시킬 때, $g(-1)$의 값은? (가) $f(x)+g(x)$를 $x-1$로 나누었을 때의 나머지는 $6$이다. (나) $f(x)-g(x)$를 $x-1$로 나누었을 때의 나머지는 $2$이다. (다) $f(x)$를 $x^2-1$로 나누었을 때의 나머지는 $3x+1$이다. (라) $f(x)g(x)$를 $x+1$로 나누었을 때의 나머지는 $10$이다.

**보기** ① $-8$  ② $-7$  ③ $-6$  ④ $-5$  ⑤ $-4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 나머지정리에 의하여 조건 (가)에서 $f(1)+g(1)=6$, 조건 (나)에서 $f(1)-g(1)=2$이므로 $f(1)=4, g(1)=2$이다.
2. 조건 (다)에서 $f(x)=(x^2-1)Q(x)+3x+1$이라 하면 $f(-1)=3(-1)+1=-2$ 조건 (라)에서 $f(-1)g(-1)=10$이므로 $-2\cdot g(-1)=10 \implies g(-1)=-5$ 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $f(x), g(x)$가 다음 조건을 모두 」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] **원천→판정: 다항식 > 항등식과 나머지정리 > 나머지정리 > 고차식 조건 → 다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지**
- 이유: 문항19번(토큰:10) 대상 문항19의 나머지정리와 인수정리 단원 RPM H1-RPM-009 분류 유형에 해당한다
**유형** PT=PT_H1_REMAINDER_THEOREM / TPL=TPL_H1_REMAINDER_COMPOSITE_DIVISOR (원천과 같음) (원천과 같음)
- 이유: 문항19번(토큰:10) 대상 문항19의 나머지정리와 인수정리 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항19번(토큰:10) 대상 문항19의 나머지정리와 인수정리 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 다항식←stem:「두 다항식 $f(x), g(x)$」
- goal: 함숫값←stem:「$g(-1)$의 값은?」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: 나머지←stem:「나머지는 $10$이다.」

**how** 문항19번(토큰:10) 발문과 해설의 문항19 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 조건 (가)에서 $f(1)+g(1)=6$, 조건 (나)에서 $f(1)-g(1)=2$이므로 $f(1)=4, g(1)=2$이다. 조건 (다)에서 $f(x)=(x^2-1)Q(x)+3x+1$이라 하면 $f(-1)=3(-1)+1=-2$ 조건 (라)에서 $f(-1)g(-1)=10$이므로 $-2\cdot g(-1)=10 \implies g(-1)=-5$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.4점


**발문**

$-1 \le x \le 3$에서 이차함수 $y=x^2-2tx-7$의 최댓값을 $g(t)$라 하자. 방정식 $g(t)=0$을 만족시키는 모든 실수 $t$의 값의 합은?

**보기** ① $\frac{7}{3}$  ② $3$  ③ $\frac{10}{3}$  ④ $\frac{11}{3}$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x)=x^2-2tx-7=(x-t)^2-t^2-7$은 아래로 볼록하고 대칭축은 $x=t$이다.
2. 구간 $[-1, 3]$의 중점이 $x=1$이므로 (i) $t \le 1$일 때, $x=3$에서 최댓값을 가지므로 $g(t)=f(3)=9-6t-7=2-6t$ $g(t)=0 \implies 2-6t=0 \implies t=\frac{1}{3}$ (조건 $t \le 1$을 만족) (ii) $t > 1$일 때, $x=-1$에서 최댓값을 가지므로 $g(t)=f(-1)=1+2t-7=2t-6$ $g(t)=0 \implies 2t-6=0 \implies t=3$ (조건 $t > 1$을 만족) 따라서 모든 실수 $t$의 값의 합은 $\frac{1}{3}+3=\frac{10}{3}$이다.
3. 그러므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-1 \le x \le 3$에서 이차함수 $y=x^2」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] (원천과 같음)
- 이유: 문항20번(토큰:tx) 대상 문항20의 이차함수의 활용 단원 RPM H1-RPM-037 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항20번(토큰:tx) 대상 문항20의 이차함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항20번(토큰:tx) 대상 문항20의 이차함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-2tx-7$」
- goal: 합←stem:「모든 실수 $t$의 값의 합은?」
- method: 축(NAMED)←solution:「대칭축은 $x=t$이다.」<br>경우분류(IMPLIED)←solution:「(i) $t \le 1$일 때」 — 대칭축 t와 구간 중점 1의 대소에 따라 최댓값 위치를 나눔
- condition: 최댓값←stem:「최댓값을 $g(t)$라 하자.」

**how** 문항20번(토큰:tx) 발문과 해설의 문항20 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)=x^2-2tx-7=(x-t)^2-t^2-7$은 아래로 볼록하고 대칭축은 $x=t$이다. 구간 $[-1, 3]$의 중점이 $x=1$이므로 (i) $t \le 1$일 때, $x=3$에서 최댓값을 가지므로 $g(t)=f(3)=9-6t-7=2-6t$ $g(t)=0 \implies 2-6t=0 \implies t=\frac{1}{3}$ (조건 $t \le 1$을 만족) (ii) $t > 1$일 때, $x=-1$에서 최댓값을 가지므로 $g(t)=f(-1)=1+2t-7=2t-6$ $g(t)=0 \implies 2t-6=0 \implies t=3$ (조건 $t > 1$을 만족) 따라서 모든 실수 $t$의 값의 합은 $\frac{1}{3}+3=\frac{10}{3}$이다. 그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점


**발문**

최고차항의 계수가 $1$인 두 이차다항식 $P(x), Q(x)$가 다음 조건을 만족시킬 때, $P(0)+Q(3)$의 값을 구하는 과정을 상세히 서술하시오. (가) $(x-2)P(x)=(x+1)Q(x)$ (나) $P(x)Q(x)=x^4+3x^3-2x^2-12x-8$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $7$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (가)에서 $(x-2)P(x)=(x+1)Q(x)$가 항등식이므로 $P(x)$는 $x+1$을 인수로 갖고, $Q(x)$는 $x-2$를 인수로 갖는다.
2. 또한 두 다항식은 최고차항의 계수가 $1$인 이차다항식이므로 상수 $k$에 대하여 $P(x)=(x+1)(x-k), \quad Q(x)=(x-2)(x-k)$ 로 놓을 수 있다.
3. 조건 (나)에 의하여 $P(x)Q(x)=(x+1)(x-2)(x-k)^2=x^4+3x^3-2x^2-12x-8$ 여기서 $(x+1)(x-2)=x^2-x-2$이므로 $x^4+3x^3-2x^2-12x-8$을 $x^2-x-2$로 나누면 $x^4+3x^3-2x^2-12x-8=(x^2-x-2)(x^2+4x+4)=(x+1)(x-2)(x+2)^2$ 따라서 $(x-k)^2=(x+2)^2$이므로 $k=-2$이다.
4. 즉, $P(x)=(x+1)(x+2)$, $Q(x)=(x-2)(x+2)$이므로 $P(0)=1\cdot 2=2$, $Q(3)=1\cdot 5=5$ 따라서 $P(0)+Q(3)=2+5=7$이다.
- 작성자 답: $7$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「최고차항의 계수가 $1$인 두 이차다항식 $P(x), 」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 공통인수 > 단계적 인수분해 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: 문항21번(토큰:12) 대상 문항21의 인수분해 단원 RPM H1-RPM-013 분류 유형에 해당한다
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_STANDARD (원천과 같음) (원천과 같음)
- 이유: 문항21번(토큰:12) 대상 문항21의 인수분해 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항21번(토큰:12) 대상 문항21의 인수분해 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: 다항식←stem:「두 이차다항식 $P(x), Q(x)$」
- goal: 합←stem:「$P(0)+Q(3)$의 값을 구하는 과정을」
- method: 항등식(NAMED)←solution:「$(x-2)P(x)=(x+1)Q(x)$가 항등식이므로」<br>인수분해(IMPLIED)←solution:「(x+1)(x-2)(x+2)^2」 — 사차식을 이차식 x^2-x-2로 나누어 완전제곱식 (x+2)^2을 구함
- condition: 최고차항←stem:「최고차항의 계수가 $1$인」

**how** 문항21번(토큰:12) 발문과 해설의 문항21 풀이 단계를 점검하여 최종 정답 $7$를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (가)에서 $(x-2)P(x)=(x+1)Q(x)$가 항등식이므로 $P(x)$는 $x+1$을 인수로 갖고, $Q(x)$는 $x-2$를 인수로 갖는다. 또한 두 다항식은 최고차항의 계수가 $1$인 이차다항식이므로 상수 $k$에 대하여 $P(x)=(x+1)(x-k), \quad Q(x)=(x-2)(x-k)$ 로 놓을 수 있다. 조건 (나)에 의하여 $P(x)Q(x)=(x+1)(x-2)(x-k)^2=x^4+3x^3-2x^2-12x-8$ 여기서 $(x+1)(x-2)=x^2-x-2$이므로 $x^4+3x^3-2x^2-12x-8$을 $x^2-x-2$로 나누면 $x^4+3x^3-2x^2-12x-8=(x^2-x-2)(x^2+4x+4)=(x+1)(x-2)(x+2)^2$ 따라서 $(x-k)^2=(x+2)^2$이므로 $k=-2$이다. 즉, $P(x)=(x+1)(x+2)$, $Q(x)=(x-2)(x+2)$이므로 $P(0)=1\cdot 2=2$, $Q(3)=1\cdot 5=5$ 따라서 $P(0)+Q(3)=2+5=7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점


**발문**

그림과 같이 이차함수 $y=f(x)$의 그래프와 기울기가 $2$인 직선 $y=g(x)$에 대하여 부등식 $f(x) \ge g(x)$의 해가 $-1 \le x \le 1$이고, $f(-2)=f(4)=0$일 때, $f(x)$와 $g(x)$를 각각 구하는 과정을 상세히 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $f(x)=-x^2+2x+8$, $g(x)=2x+7$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(-2)=f(4)=0$이므로 이차함수 $f(x)$를 $f(x)=a(x+2)(x-4)=a(x^2-2x-8)=ax^2-2ax-8a$ ($a \neq 0$) 로 놓을 수 있다.
2. 부등식 $f(x) \ge g(x)$, 즉 $f(x)-g(x) \ge 0$의 해가 $-1 \le x \le 1$이므로 이차항의 계수 $a < 0$이고 $f(x)-g(x)=a(x+1)(x-1)=a(x^2-1)=ax^2-a$ 이다.
3. 따라서 $\begin{aligned} g(x) &= f(x)-{f(x)-g(x)} \ &= (ax^2-2ax-8a)-(ax^2-a) \ &= -2ax-7a \end{aligned}$ 직선 $y=g(x)$의 기울기가 $2$이므로 $-2a=2 \implies a=-1$ ($a<0$을 만족)이다.
4. 그러므로 구하는 두 식은 $f(x)=-x^2+2x+8$, $g(x)=2x+7$이다.
- 작성자 답: $f(x)=-x^2+2x+8$, $g(x)=2x+7$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-QUADRATIC_INEQUALITY(이차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 이차함수 $y=f(x)$의 그래프와 기울기」
**RPM** H1-RPM-047 [방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해] **원천→판정: 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 근의 위치와 해 → 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해**
- 이유: 문항22번(토큰:ax) 대상 문항22의 이차부등식 단원 RPM H1-RPM-047 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_INEQUALITY / TPL=TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL (원천과 같음) (원천과 같음)
- 이유: 문항22번(토큰:ax) 대상 문항22의 이차부등식 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항22번(토큰:ax) 대상 문항22의 이차부등식 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: 이차함수←stem:「이차함수 $y=f(x)$」<br>직선←stem:「직선 $y=g(x)$」
- goal: 다항식←stem:「$f(x)$와 $g(x)$를 각각 구하는 과정을」
- method: 인수(IMPLIED)←solution:「f(x)=a(x+2)(x-4)」 — x절편과 부등식 해의 경계를 이용해 두 식을 인수 형태로 설정함
- condition: 기울기←stem:「기울기가 $2$인」

**how** 문항22번(토큰:ax) 발문과 해설의 문항22 풀이 단계를 점검하여 최종 정답 $f(x)=-x^2+2x+8$, $g(x)=2x+7$를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(-2)=f(4)=0$이므로 이차함수 $f(x)$를 $f(x)=a(x+2)(x-4)=a(x^2-2x-8)=ax^2-2ax-8a$ ($a \neq 0$) 로 놓을 수 있다. 부등식 $f(x) \ge g(x)$, 즉 $f(x)-g(x) \ge 0$의 해가 $-1 \le x \le 1$이므로 이차항의 계수 $a < 0$이고 $f(x)-g(x)=a(x+1)(x-1)=a(x^2-1)=ax^2-a$ 이다. 따라서 $\begin{aligned} g(x) &= f(x)-{f(x)-g(x)} \ &= (ax^2-2ax-8a)-(ax^2-a) \ &= -2ax-7a \end{aligned}$ 직선 $y=g(x)$의 기울기가 $2$이므로 $-2a=2 \implies a=-1$ ($a<0$을 만족)이다. 그러므로 구하는 두 식은 $f(x)=-x^2+2x+8$, $g(x)=2x+7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 7점


**발문**

그림과 같이 이차함수 $y=x^2-16$의 그래프와 $x$축으로 둘러싸인 부분에 내접하는 직사각형 $ABCD$의 두 꼭짓점 $A, D$는 $x$축 위에 있고, 두 꼭짓점 $B, C$는 이차함수 $y=x^2-16$의 그래프 위에 있다. 제$4$사분면 위의 점 $C$의 좌표를 $(t, t^2-16)$이라 할 때, 다음 물음에 답하시오. (1) 직사각형 $ABCD$의 둘레의 길이 $L(t)$를 $t$에 대한 식으로 나타내고, $t$의 값의 범위를 구하시오. [4점] (2) 직사각형 $ABCD$의 둘레의 길이 $L(t)$의 최댓값을 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $L(t)=-2t^2+4t+32$ ($0 < t < 4$), (2) $34$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 이차함수 $y=x^2-16$의 그래프가 $x$축과 만나는 점의 $x$좌표는 $x^2-16=0$에서 $x=-4$ 또는 $x=4$이다.
2. 점 $C(t, t^2-16)$이 제$4$사분면 위에 있으므로 $0 < t < 4$이다.
3. 그래프가 $y$축에 대하여 대칭이므로 $\overline{BC}=2t$이고, 세로의 길이는 $\overline{CD}=0-(t^2-16)=16-t^2$이다.
4. 따라서 직사각형 $ABCD$의 둘레의 길이 $L(t)$는 $L(t)=2(2t+16-t^2)=-2t^2+4t+32$ ($0 < t < 4$) (2) $L(t)=-2t^2+4t+32=-2(t-1)^2+34$ $0 < t < 4$에서 이차함수 $L(t)$는 위로 볼록하고 꼭짓점의 좌표 $t=1$이 범위에 속하므로 $t=1$일 때 최댓값 $34$를 갖는다.
- 작성자 답: (1) $L(t)=-2t^2+4t+32$ ($0 < t < 4$), (2) $34$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 이차함수 $y=x^2-16$의 그래프와 $」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: 문항23번(토큰:16) 대상 문항23의 이차함수의 활용 단원 RPM H1-RPM-037 분류 유형에 해당한다
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: 문항23번(토큰:16) 대상 문항23의 이차함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항23번(토큰:16) 대상 문항23의 이차함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-16$」<br>직사각형←stem:「직사각형 $ABCD$」
- goal: 둘레←stem:「둘레의 길이 $L(t)$를」<br>최댓값←stem:「둘레의 길이 $L(t)$의 최댓값을 구하시오.」
- method: 대칭성(IMPLIED)←solution:「$y$축에 대하여 대칭이므로」 — 포물선 y=x^2-16의 y축 대칭성을 이용해 가로 길이를 2t로 구함<br>완전제곱식(IMPLIED)←solution:「-2(t-1)^2+34」 — 이차함수를 표준형으로 변형해 꼭짓점에서 최댓값을 구함
- condition: 사분면←stem:「제$4$사분면 위의 점 $C$」

**how** 문항23번(토큰:16) 발문과 해설의 문항23 풀이 단계를 점검하여 최종 정답 (1) $L(t)=-2t^2+4t+32$ ($0 < t < 4$), (2) $34$를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 이차함수 $y=x^2-16$의 그래프가 $x$축과 만나는 점의 $x$좌표는 $x^2-16=0$에서 $x=-4$ 또는 $x=4$이다. 점 $C(t, t^2-16)$이 제$4$사분면 위에 있으므로 $0 < t < 4$이다. 그래프가 $y$축에 대하여 대칭이므로 $\overline{BC}=2t$이고, 세로의 길이는 $\overline{CD}=0-(t^2-16)=16-t^2$이다. 따라서 직사각형 $ABCD$의 둘레의 길이 $L(t)$는 $L(t)=2(2t+16-t^2)=-2t^2+4t+32$ ($0 < t < 4$) (2) $L(t)=-2t^2+4t+32=-2(t-1)^2+34$ $0 < t < 4$에서 이차함수 $L(t)$는 위로 볼록하고 꼭짓점의 좌표 $t=1$이 범위에 속하므로 $t=1$일 때 최댓값 $34$를 갖는다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
