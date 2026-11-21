# 검수 묶음 — 25_효천고_1학기_기말_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 23개 / 검사 PASS 20, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 6, 2단계 5, 3단계 6, 4단계 6
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q7**: 검사 코드: CHOICE_ORDER
- **Q12**: 검사 코드: CHOICE_ORDER
- **Q14**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.5점


**발문**

$a_3 = -5$, $a_5 = 1$인 등차수열 $\{a_n\}$에 대하여 $a_7$의 값은?

**보기** ① $5$  ② $6$  ③ $7$  ④ $8$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q1 문제의 조건(a)에 맞추어 식을 세운다.
2. 등차수열 $\{a_n\}$의 공차를 $d$라 하면  
$$a_5 - a_3 = 2d = 1 - (-5) = 6 \implies d = 3$$  
따라서 $a_7 = a_5 + 2d = 1 + 2 \times 3 = 7$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a_3 = -5$, $a_5 = 1$인 등차수열 $\」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] (원천과 같음)
- 이유: Q1(a): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q1(a): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(a): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$\{a_n\}$에 대하여 $a_7$의 값은?」
- method: 정리(NAMED)←solution:「등차수열 $\{a_n\}$의 공차를 $d$라」
- condition: (없음)

**how** Q1(a): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열 $\{a_n\}$의 공차를 $d$라 하면  
$$a_5 - a_3 = 2d = 1 - (-5) = 6 \implies d = 3$$  
따라서 $a_7 = a_5 + 2d = 1 + 2 \times 3 = 7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.5점


**발문**

첫째항부터 차례로 $1, 3, 9, 27, \cdots$인 등비수열 $\{a_n\}$의 일반항은?

**보기** ① $a_n = 3^{n-1}$  ② $a_n = 3n$  ③ $a_n = 3^n$  ④ $a_n = 9^{n-1}$  ⑤ $a_n = 9^n$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q2 문제의 조건(27)에 맞추어 식을 세운다.
2. 첫째항이 $a_1 = 1$, 공비가 $r = 3$인 등비수열이므로 일반항은  
$$a_n = 1 \times 3^{n-1} = 3^{n-1}$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항부터 차례로 $1, 3, 9, 27, \cdots」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 일반항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q2(27): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q2(27): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(27): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「s$인 등비수열 $\{a_n\}$의 일반항은?」
- method: 정리(NAMED)←solution:「첫째항이 $a_1 = 1$, 공비가 $r =」
- condition: (없음)

**how** Q2(27): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째항이 $a_1 = 1$, 공비가 $r = 3$인 등비수열이므로 일반항은  
$$a_n = 1 \times 3^{n-1} = 3^{n-1}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.5점


**발문**

수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_n = 2n^2 + 3n - 2$일 때, $a_1$의 값은?

**보기** ① $-1$  ② $0$  ③ $1$  ④ $2$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q3 문제의 조건(a)에 맞추어 식을 세운다.
2. 첫째항 $a_1$은 $S_1$과 같으므로  
$$a_1 = S_1 = 2(1)^2 + 3(1) - 2 = 3$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q3(a): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q3(a): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(a): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「+ 3n - 2$일 때, $a_1$의 값은?」
- method: 정리(NAMED)←solution:「첫째항 $a_1$은 $S_1$과 같으므로」
- condition: (없음)

**how** Q3(a): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째항 $a_1$은 $S_1$과 같으므로  
$$a_1 = S_1 = 2(1)^2 + 3(1) - 2 = 3$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.5점


**발문**

첫째항이 $2$, 제$15$항이 $30$인 등차수열의 첫째항부터 제$15$항까지의 합은?

**보기** ① $225$  ② $240$  ③ $255$  ④ $270$  ⑤ $285$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q4 문제의 조건(15)에 맞추어 식을 세운다.
2. 등차수열의 합 공식 $S_n = \frac{n(a_1 + a_n)}{2}$에 $n = 15$, $a_1 = 2$, $a_{15} = 30$을 대입하면  
$$S_{15} = \frac{15(2 + 30)}{2} = 15 \times 16 = 240$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $2$, 제$15$항이 $30$인 등차수열의 」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q4(15): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q4(15): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(15): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「등차수열의 첫째항부터 제$15$항까지의 합은?」
- method: 정리(NAMED)←solution:「등차수열의 합 공식 $S_n = \frac{n」
- condition: (없음)

**how** Q4(15): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열의 합 공식 $S_n = \frac{n(a_1 + a_n)}{2}$에 $n = 15$, $a_1 = 2$, $a_{15} = 30$을 대입하면  
$$S_{15} = \frac{15(2 + 30)}{2} = 15 \times 16 = 240$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점


**발문**

삼각형 $ABC$에서 $\overline{AB} = 6$, $\overline{AC} = 7$, $\angle A = 60^\circ$일 때, 삼각형 $ABC$의 넓이는?

**보기** ① $\frac{15\sqrt{3}}{2}$  ② $9\sqrt{3}$  ③ $10\sqrt{3}$  ④ $\frac{21\sqrt{3}}{2}$  ⑤ $21\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q5 문제의 조건(ABC)에 맞추어 식을 세운다.
2. 삼각형 $ABC$의 넓이 $S$는  
$$S = \frac{1}{2} \times \overline{AB} \times \overline{AC} \times \sin A = \frac{1}{2} \times 6 \times 7 \times \sin 60^\circ = 21 \times \frac{\sqrt{3}}{2} = \frac{21\sqrt{3}}{2}$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에서 $\overline{AB} = 6」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 삼각형의 넓이 > 두 변과 끼인각 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q5(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_TRIANGLE_AREA / TPL=TPL_H22A_05_TRIANGLE_AREA_113 (원천과 같음)
- 이유: Q5(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「circ$일 때, 삼각형 $ABC$의 넓이는?」
- method: 정리(NAMED)←solution:「삼각형 $ABC$의 넓이 $S$는  
$$S」
- condition: (없음)

**how** Q5(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형 $ABC$의 넓이 $S$는  
$$S = \frac{1}{2} \times \overline{AB} \times \overline{AC} \times \sin A = \frac{1}{2} \times 6 \times 7 \times \sin 60^\circ = 21 \times \frac{\sqrt{3}}{2} = \frac{21\sqrt{3}}{2}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

다음 중 합의 기호 $\sum$의 성질로 옳지 **않은** 것은? (단, $c$는 상수이다.)

**보기** ① $\sum_{k=1}^{n}(a_k + b_k) = \sum_{k=1}^{n}a_k + \sum_{k=1}^{n}b_k$  ② $\sum_{k=1}^{n}(a_k - b_k) = \sum_{k=1}^{n}a_k - \sum_{k=1}^{n}b_k$  ③ $\sum_{k=1}^{n}(a_k b_k) = \left(\sum_{k=1}^{n}a_k\right)\left(\sum_{k=1}^{n}b_k\right)$  ④ $\sum_{k=1}^{n} ca_k = c\sum_{k=1}^{n} a_k$  ⑤ $\sum_{k=1}^{n} c = cn$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q6 문제의 조건(ca)에 맞추어 식을 세운다.
2. $\sum$은 덧셈, 뺄셈, 상수배에 대해서는 선형성이 성립하지만, 두 수열의 곱에 대해서는 일반적으로  
$$\sum_{k=1}^{n}(a_k b_k) \ne \left(\sum_{k=1}^{n}a_k\right)\left(\sum_{k=1}^{n}b_k\right)$$  
이므로 옳지 않은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 합의 기호 $\sum$의 성질로 옳지 **않은」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] **원천→판정: 수열 > 수열의 합 > 합의 기호 Σ > 성질 → 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산**
- 이유: Q6(ca): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q6(ca): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(ca): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「*않은** 것은? (단, $c$는 상수이다.)」
- method: 정리(NAMED)←solution:「$\sum$은 덧셈, 뺄셈, 상수배에 대해서는」
- condition: (없음)

**how** Q6(ca): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sum$은 덧셈, 뺄셈, 상수배에 대해서는 선형성이 성립하지만, 두 수열의 곱에 대해서는 일반적으로  
$$\sum_{k=1}^{n}(a_k b_k) \ne \left(\sum_{k=1}^{n}a_k\right)\left(\sum_{k=1}^{n}b_k\right)$$  
이므로 옳지 않은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

공차가 $4$인 등차수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_n = pn^2 + 5n$일 때, $a_8$의 값은?

**보기** ① $35$  ② $31$  ③ $33$  ④ $37$  ⑤ $39$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q7 문제의 조건(pn)에 맞추어 식을 세운다.
2. 등차수열의 합 $S_n = \frac{d}{2}n^2 + \left(a_1 - \frac{d}{2}\right)n$에서 $n^2$의 계수가 $\frac{d}{2}$이므로  
$$p = \frac{4}{2} = 2 \implies S_n = 2n^2 + 5n$$  
$n \ge 2$일 때  
$$a_n = S_n - S_{n-1} = (2n^2 + 5n) - \{2(n-1)^2 + 5(n-1)\} = 4n + 3$$  
$n = 1$일 때도 $a_1 = S_1 = 7$로 성립하므로 $a_8 = 4 \times 8 + 3 = 35$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「공차가 $4$인 등차수열 $\{a_n\}$의 첫째항부터」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q7(pn): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q7(pn): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(pn): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「pn^2 + 5n$일 때, $a_8$의 값은?」
- method: 정리(NAMED)←solution:「등차수열의 합 $S_n = \frac{d}{2」
- condition: (없음)

**how** Q7(pn): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열의 합 $S_n = \frac{d}{2}n^2 + \left(a_1 - \frac{d}{2}\right)n$에서 $n^2$의 계수가 $\frac{d}{2}$이므로  
$$p = \frac{4}{2} = 2 \implies S_n = 2n^2 + 5n$$  
$n \ge 2$일 때  
$$a_n = S_n - S_{n-1} = (2n^2 + 5n) - \{2(n-1)^2 + 5(n-1)\} = 4n + 3$$  
$n = 1$일 때도 $a_1 = S_1 = 7$로 성립하므로 $a_8 = 4 \times 8 + 3 = 35$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

$5^2 + 6^2 + 7^2 + \cdots + 11^2$의 값은?

**보기** ① $456$  ② $462$  ③ $468$  ④ $472$  ⑤ $476$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q8 문제의 조건(11)에 맞추어 식을 세운다.
2. 주어진 합은 $1$부터 $11$까지의 제곱의 합에서 $1$부터 $4$까지의 제곱의 합을 뺀 것과 같으므로  
$$\sum_{k=1}^{11} k^2 - \sum_{k=1}^{4} k^2 = \frac{11 \times 12 \times 23}{6} - (1^2 + 2^2 + 3^2 + 4^2) = 506 - 30 = 476$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「$5^2 + 6^2 + 7^2 + \cdots + 11」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] (원천과 같음)
- 이유: Q8(11): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q8(11): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(11): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「7^2 + \cdots + 11^2$의 값은?」
- method: 정리(NAMED)←solution:「주어진 합은 $1$부터 $11$까지의 제곱의」
- condition: (없음)

**how** Q8(11): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 합은 $1$부터 $11$까지의 제곱의 합에서 $1$부터 $4$까지의 제곱의 합을 뺀 것과 같으므로  
$$\sum_{k=1}^{11} k^2 - \sum_{k=1}^{4} k^2 = \frac{11 \times 12 \times 23}{6} - (1^2 + 2^2 + 3^2 + 4^2) = 506 - 30 = 476$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

지름 $\overline{AB}$의 길이가 $26$인 원 $O$ 위의 한 점 $P$에 대하여 $\overline{AP} = 24$이다. $\angle PAB = \theta$라 할 때, $\cos 2\theta$의 값은?

**보기** ① $-\frac{119}{169}$  ② $\frac{119}{169}$  ③ $\frac{120}{169}$  ④ $\frac{125}{169}$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB}$가 원 $O$의 지름이므로 $\angle APB = 90^\circ$이다.
2. 피타고라스 정리에 의해  
$$\overline{BP} = \sqrt{26^2 - 24^2} = \sqrt{676 - 576} = 10$$  
호 $PB$에 대한 원주각이 $\angle PAB = \theta$이므로 중심각은 $\angle POB = 2\theta$이고, $\overline{OP} = \overline{OB} = 13$이다.
3. 삼각형 $POB$에서 코사인법칙을 적용하면  
$$\cos 2\theta = \frac{13^2 + 13^2 - 10^2}{2 \times 13 \times 13} = \frac{169 + 169 - 100}{338} = \frac{238}{338} = \frac{119}{169}$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「지름 $\overline{AB}$의 길이가 $26$인 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q9(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q9(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「할 때, $\cos 2\theta$의 값은?」
- method: 정리(NAMED)←solution:「$\overline{AB}$가 원 $O$의 지」
- condition: (없음)

**how** Q9(AB): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}$가 원 $O$의 지름이므로 $\angle APB = 90^\circ$이다. 피타고라스 정리에 의해  
$$\overline{BP} = \sqrt{26^2 - 24^2} = \sqrt{676 - 576} = 10$$  
호 $PB$에 대한 원주각이 $\angle PAB = \theta$이므로 중심각은 $\angle POB = 2\theta$이고, $\overline{OP} = \overline{OB} = 13$이다.  
삼각형 $POB$에서 코사인법칙을 적용하면  
$$\cos 2\theta = \frac{13^2 + 13^2 - 10^2}{2 \times 13 \times 13} = \frac{169 + 169 - 100}{338} = \frac{238}{338} = \frac{119}{169}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음과 같이 정의되는 수열 $\{a_n\}$에 대하여 $\sum_{k=1}^{24} a_k$의 값은?

$a_1 = 1$, $a_2 = 4$, $a_3 = 16$, $a_{n-1}a_{n+1} = a_n a_{n+2}$ ($n = 2, 3, 4, \cdots$)

**보기** ① $125$  ② $140$  ③ $145$  ④ $150$  ⑤ $160$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 관계식에서 $a_{n+2} = \frac{a_{n-1}a_{n+1}}{a_n}$이므로 차례로 구하면  
$$a_4 = \frac{a_1 a_3}{a_2} = \frac{1 \times 16}{4} = 4, \quad a_5 = \frac{a_2 a_4}{a_3} = \frac{4 \times 4}{16} = 1, \quad a_6 = \frac{a_3 a_5}{a_4} = \frac{16 \times 1}{4} = 4$$  
따라서 수열 $\{a_n\}$은 $1, 4, 16, 4$가 반복되는 주기 $4$인 수열이다.
2. 한 주기의 합은 $1 + 4 + 16 + 4 = 25$이므로  
$$\sum_{k=1}^{24} a_k = 6 \times 25 = 150$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음과 같이 정의되는 수열 $\{a_n\}$에 대하여 」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] (원천과 같음)
- 이유: Q10(24): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_RECURSIVE_SEQUENCE / TPL=TPL_H22A_08_RECURSIVE_SEQUENCE_129 (원천과 같음)
- 이유: Q10(24): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(24): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$ ($n = 2, 3, 4, \cdots$)」
- method: 정리(NAMED)←solution:「주어진 관계식에서 $a_{n+2} = \fra」
- condition: (없음)

**how** Q10(24): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 관계식에서 $a_{n+2} = \frac{a_{n-1}a_{n+1}}{a_n}$이므로 차례로 구하면  
$$a_4 = \frac{a_1 a_3}{a_2} = \frac{1 \times 16}{4} = 4, \quad a_5 = \frac{a_2 a_4}{a_3} = \frac{4 \times 4}{16} = 1, \quad a_6 = \frac{a_3 a_5}{a_4} = \frac{16 \times 1}{4} = 4$$  
따라서 수열 $\{a_n\}$은 $1, 4, 16, 4$가 반복되는 주기 $4$인 수열이다.  
한 주기의 합은 $1 + 4 + 16 + 4 = 25$이므로  
$$\sum_{k=1}^{24} a_k = 6 \times 25 = 150$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

첫째항이 음수인 등비수열 $\{a_n\}$에 대하여 $a_3 a_5 = 16a_8$, $a_1 + |a_2| + |2a_3| = 0$일 때, $a_2$의 값은?

**보기** ① $1$  ② $2$  ③ $4$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 등비수열 $\{a_n\}$의 공비를 $r$라 하면 $a_1 < 0$이고 $r \ne 0$이다.
2. $a_3 a_5 = a_1^2 r^6 = 16a_1 r^7$이므로 양변을 $a_1 r^6$으로 나누면 $a_1 = 16r$이다.
3. $a_1 < 0$이므로 $r < 0$이고, 따라서 $a_2 = 16r^2 > 0$, $2a_3 = 32r^3 < 0$이다.
4. 조건 $a_1 + |a_2| + |2a_3| = 0$에 대입하면  
$$16r + 16r^2 - 32r^3 = 0 \implies 2r^2 - r - 1 = 0 \implies (2r + 1)(r - 1) = 0$$  
$r < 0$이므로 $r = -\frac{1}{2}$이고, $a_1 = 16\left(-\frac{1}{2}\right) = -8$이다.
5. 따라서 $a_2 = a_1 r = (-8)\left(-\frac{1}{2}\right) = 4$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 음수인 등비수열 $\{a_n\}$에 대하여 $」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 일반항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q11(16): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q11(16): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(16): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「2a_3| = 0$일 때, $a_2$의 값은?」
- method: 정리(NAMED)←solution:「등비수열 $\{a_n\}$의 공비를 $r$라」
- condition: (없음)

**how** Q11(16): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등비수열 $\{a_n\}$의 공비를 $r$라 하면 $a_1 < 0$이고 $r \ne 0$이다.  
$a_3 a_5 = a_1^2 r^6 = 16a_1 r^7$이므로 양변을 $a_1 r^6$으로 나누면 $a_1 = 16r$이다.  
$a_1 < 0$이므로 $r < 0$이고, 따라서 $a_2 = 16r^2 > 0$, $2a_3 = 32r^3 < 0$이다.  
조건 $a_1 + |a_2| + |2a_3| = 0$에 대입하면  
$$16r + 16r^2 - 32r^3 = 0 \implies 2r^2 - r - 1 = 0 \implies (2r + 1)(r - 1) = 0$$  
$r < 0$이므로 $r = -\frac{1}{2}$이고, $a_1 = 16\left(-\frac{1}{2}\right) = -8$이다.  
따라서 $a_2 = a_1 r = (-8)\left(-\frac{1}{2}\right) = 4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

수열 $\{a_n\}$에서 $a_n$은 자연수 $n$을 $n$개 이어 붙여 만든 자연수라 하자. (예를 들어 $a_2 = 22$, $a_{10} = 10101010101010101010$이다.) $\log a_n$의 정수 부분을 $b_n$이라 할 때, $\sum_{n=1}^{12} b_n$의 값은? (단, $\log$는 상용로그이다.)

**보기** ① $99$  ② $78$  ③ $88$  ④ $96$  ⑤ $102$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $1 \le n \le 9$일 때, $n$은 한 자리 자연수이므로 $a_n$은 $n$자리 자연수이다. (22)
2. 따라서 $\log a_n$의 정수 부분 $b_n = n - 1$이다.
3. $n = 10, 11, 12$일 때, $n$은 두 자리 자연수이므로 $a_n$은 $2n$자리 자연수이다.
4. 따라서 $b_{10} = 19$, $b_{11} = 21$, $b_{12} = 23$이다.
5. 그러므로  
$$\sum_{n=1}^{12} b_n = \sum_{n=1}^{9} (n - 1) + (19 + 21 + 23) = (0 + 1 + \cdots + 8) + 63 = \frac{8 \times 9}{2} + 63 = 36 + 63 = 99$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$에서 $a_n$은 자연수 $n$을」
**RPM** H2-M1-RPM-067 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정: 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수 → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q12(22): 지수와 로그 단원의 RPM H2-M1-RPM-067 유형에 해당한다.
**유형** PT=PT_H22A_01_COMMON_LOG / TPL=TPL_H22A_01_COMMON_LOG_077 (원천과 같음)
- 이유: Q12(22): 지수와 로그 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(22): 지수와 로그 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「값은? (단, $\log$는 상용로그이다.)」
- method: 정리(NAMED)←solution:「$1 \le n \le 9$일 때, $n$은」
- condition: (없음)

**how** Q12(22): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$1 \le n \le 9$일 때, $n$은 한 자리 자연수이므로 $a_n$은 $n$자리 자연수이다. 따라서 $\log a_n$의 정수 부분 $b_n = n - 1$이다.  
$n = 10, 11, 12$일 때, $n$은 두 자리 자연수이므로 $a_n$은 $2n$자리 자연수이다. 따라서 $b_{10} = 19$, $b_{11} = 21$, $b_{12} = 23$이다.  
그러므로  
$$\sum_{n=1}^{12} b_n = \sum_{n=1}^{9} (n - 1) + (19 + 21 + 23) = (0 + 1 + \cdots + 8) + 63 = \frac{8 \times 9}{2} + 63 = 36 + 63 = 99$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.5점


**발문**

$h > 0$일 때, $n \ge 2$인 모든 자연수 $n$에 대하여 부등식 $(1 + h)^n > 1 + nh$가 성립함을 수학적 귀납법으로 증명하는 과정이다. [4.5점]

(ⅰ) $n =$ ①일 때, (좌변) $= (1 + h)^2 = 1 + 2h +$ ② $> 1 + 2h =$ (우변)이므로 부등식이 성립한다.  
(ⅱ) $n =$ ③ ($③ \ge 2$)일 때 성립한다고 가정하면 $(1 + h)^k > 1 + kh$이다.  
양변에 ④를 곱하면  
$$(1 + h)^{k+1} > (1 + kh)(1 + h) = 1 + (k + 1)h + \text{⑤} > 1 + (k + 1)h$$  
이므로 $n = k + 1$일 때도 성립한다.

다음 중 ①~⑤에 알맞은 것으로 옳지 **않은** 것은?

**보기** ① $2$  ② $h^2$  ③ $k$  ④ $1 + h$  ⑤ $k^2 h$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (ⅰ) $n = 2$일 때 확인하므로 ①은 $2$이고, $(1 + h)^2 = 1 + 2h + h^2$이므로 ②는 $h^2$이다. (nh)
2. (ⅱ) $n = k$일 때 가정하므로 ③은 $k$이고, 양변에 양수 $1 + h$를 곱하므로 ④는 $1 + h$이다.
3. 우변을 전개하면 $(1 + kh)(1 + h) = 1 + (k + 1)h + kh^2$이므로 ⑤에 알맞은 식은 $kh^2$이다.
4. 따라서 옳지 않은 것은 ⑤($k^2 h$)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「$h > 0$일 때, $n \ge 2$인 모든 자연수 」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수학적 귀납법 > 부등식·나눗셈 증명 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q13(nh): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_MATHEMATICAL_INDUCTION / TPL=TPL_H22A_08_MATHEMATICAL_INDUCTION_131 (원천과 같음)
- 이유: Q13(nh): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(nh): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「~⑤에 알맞은 것으로 옳지 **않은** 것은?」
- method: 정리(NAMED)←solution:「(ⅰ) $n = 2$일 때 확인하므로 ①은 $」
- condition: (없음)

**how** Q13(nh): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(ⅰ) $n = 2$일 때 확인하므로 ①은 $2$이고, $(1 + h)^2 = 1 + 2h + h^2$이므로 ②는 $h^2$이다.  
(ⅱ) $n = k$일 때 가정하므로 ③은 $k$이고, 양변에 양수 $1 + h$를 곱하므로 ④는 $1 + h$이다.  
우변을 전개하면 $(1 + kh)(1 + h) = 1 + (k + 1)h + kh^2$이므로 ⑤에 알맞은 식은 $kh^2$이다.  
따라서 옳지 않은 것은 ⑤($k^2 h$)이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

원에 내접하는 사각형 $ABCD$에서 $\overline{AB} = 2$, $\overline{BC} = 3$, $\overline{CD} = 4$, $\overline{DA} = 5$일 때, 사각형 $ABCD$의 넓이는?

**보기** ① $\sqrt{30}$  ② $2\sqrt{30}$  ③ $3\sqrt{30}$  ④ $\frac{5\sqrt{30}}{2}$  ⑤ $4\sqrt{30}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle B = \theta$라 하면 사각형 $ABCD$가 원에 내접하므로 $\angle D = 180^\circ - \theta$이다.
2. $\triangle ABC$와 $\triangle ADC$에서 각각 코사인법칙을 적용하면  
$$\overline{AC}^2 = 2^2 + 3^2 - 2 \times 2 \times 3 \cos\theta = 13 - 12\cos\theta$$  
$$\overline{AC}^2 = 4^2 + 5^2 - 2 \times 4 \times 5 \cos(180^\circ - \theta) = 41 + 40\cos\theta$$  
두 식이 같으므로 $13 - 12\cos\theta = 41 + 40\cos\theta \implies 52\cos\theta = -28 \implies \cos\theta = -\frac{7}{13}$이다.
3. $\sin\theta > 0$이므로 $\sin\theta = \sqrt{1 - \left(-\frac{7}{13}\right)^2} = \frac{\sqrt{120}}{13} = \frac{2\sqrt{30}}{13}$이다.
4. 따라서 사각형 $ABCD$의 넓이 $S$는  
$$S = \frac{1}{2} \times 2 \times 3 \sin\theta + \frac{1}{2} \times 4 \times 5 \sin(180^\circ - \theta) = (3 + 10)\sin\theta = 13 \times \frac{2\sqrt{30}}{13} = 2\sqrt{30}$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「원에 내접하는 사각형 $ABCD$에서 $\overlin」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 삼각형의 넓이 > 복합도형 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q14(ABCD): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_TRIANGLE_AREA / TPL=TPL_H22A_05_TRIANGLE_AREA_113 (원천과 같음)
- 이유: Q14(ABCD): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(ABCD): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「= 5$일 때, 사각형 $ABCD$의 넓이는?」
- method: 정리(NAMED)←solution:「$\angle B = \theta$라 하면 사」
- condition: (없음)

**how** Q14(ABCD): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle B = \theta$라 하면 사각형 $ABCD$가 원에 내접하므로 $\angle D = 180^\circ - \theta$이다.  
$\triangle ABC$와 $\triangle ADC$에서 각각 코사인법칙을 적용하면  
$$\overline{AC}^2 = 2^2 + 3^2 - 2 \times 2 \times 3 \cos\theta = 13 - 12\cos\theta$$  
$$\overline{AC}^2 = 4^2 + 5^2 - 2 \times 4 \times 5 \cos(180^\circ - \theta) = 41 + 40\cos\theta$$  
두 식이 같으므로 $13 - 12\cos\theta = 41 + 40\cos\theta \implies 52\cos\theta = -28 \implies \cos\theta = -\frac{7}{13}$이다.  
$\sin\theta > 0$이므로 $\sin\theta = \sqrt{1 - \left(-\frac{7}{13}\right)^2} = \frac{\sqrt{120}}{13} = \frac{2\sqrt{30}}{13}$이다.  
따라서 사각형 $ABCD$의 넓이 $S$는  
$$S = \frac{1}{2} \times 2 \times 3 \sin\theta + \frac{1}{2} \times 4 \times 5 \sin(180^\circ - \theta) = (3 + 10)\sin\theta = 13 \times \frac{2\sqrt{30}}{13} = 2\sqrt{30}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

공차가 $4$인 등차수열 $\{a_n\}$과 자연수 $m$이  
$$\sum_{k=1}^{m} a_{k+1} = 180, \quad \sum_{k=1}^{m} (a_k + m) = 240$$  
을 만족시킬 때, $m$의 값은?

**보기** ① $7$  ② $8$  ③ $9$  ④ $10$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 번째 식을 전개하면 $\sum_{k=1}^{m} a_k + \sum_{k=1}^{m} m = 240$이므로  
$$\sum_{k=1}^{m} a_k = 240 - m^2$$  
첫 번째 식에서 이 식을 변변 빼면  
$$\sum_{k=1}^{m} (a_{k+1} - a_k) = 180 - (240 - m^2) = m^2 - 60$$  
공차가 $4$이므로 좌변은 $\sum_{k=1}^{m} 4 = 4m$이다.
2. $$m^2 - 4m - 60 = 0 \implies (m - 10)(m + 6) = 0$$  
$m$은 자연수이므로 $m = 10$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「공차가 $4$인 등차수열 $\{a_n\}$과 자연수 $」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] (원천과 같음)
- 이유: Q15(180): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q15(180): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(180): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「40$$  
을 만족시킬 때, $m$의 값은?」
- method: 정리(NAMED)←solution:「두 번째 식을 전개하면 $\sum_{k=1}^」
- condition: (없음)

**how** Q15(180): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 번째 식을 전개하면 $\sum_{k=1}^{m} a_k + \sum_{k=1}^{m} m = 240$이므로  
$$\sum_{k=1}^{m} a_k = 240 - m^2$$  
첫 번째 식에서 이 식을 변변 빼면  
$$\sum_{k=1}^{m} (a_{k+1} - a_k) = 180 - (240 - m^2) = m^2 - 60$$  
공차가 $4$이므로 좌변은 $\sum_{k=1}^{m} 4 = 4m$이다.  
$$m^2 - 4m - 60 = 0 \implies (m - 10)(m + 6) = 0$$  
$m$은 자연수이므로 $m = 10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.7점


**발문**

좌표축 위의 다섯 개의 점 $A(-a, 0)$, $B(0, b)$, $C(c, 0)$, $D(0, -d)$, $E(-e, 0)$ ($a, b, c, d, e > 0$, $a < b$, $e > a$)에 대하여 $\overline{AB} \perp \overline{BC}$, $\overline{BC} \perp \overline{CD}$, $\overline{CD} \perp \overline{DE}$가 성립한다. 세 선분 $\overline{AO}$, $2\overline{OC}$, $\overline{EA}$의 길이가 이 순서대로 등차수열을 이룰 때, 직선 $BC$의 기울기는? (단, $O$는 원점이다.) [4.7점]

**보기** ① $-\frac{1}{4}$  ② $-\frac{1}{3}$  ③ $-\frac{1}{2}$  ④ $-\frac{\sqrt{2}}{2}$  ⑤ $-\frac{\sqrt{3}}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 수직 조건에서 각 인접 직선의 기울기의 곱이 $-1$이므로  
$$\frac{b}{a} \cdot \left(-\frac{b}{c}\right) = -1 \implies b^2 = ac, \quad \left(-\frac{b}{c}\right) \cdot \frac{d}{c} = -1 \implies c^2 = bd, \quad \frac{d}{c} \cdot \left(-\frac{d}{e}\right) = -1 \implies d^2 = ce$$  
또한 $\overline{AO} = a$, $\overline{OC} = c$, $\overline{EA} = e - a$가 이 순서대로 등차수열을 이루므로 등차중항의 성질에 의해  
$$2(2c) = a + (e - a) \implies e = 4c$$  
직선 $BC$의 기울기를 $m = -\frac{b}{c}$ ($m < 0$)라 하면 $d = \frac{c^2}{b} = -\frac{c}{m}$이다. (AB)
2. $d^2 = ce$에 대입하면  
$$\left(-\frac{c}{m}\right)^2 = c \cdot 4c \implies \frac{1}{m^2} = 4 \implies m^2 = \frac{1}{4}$$  
$m < 0$이므로 구하는 기울기는 $m = -\frac{1}{2}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「좌표축 위의 다섯 개의 점 $A(-a, 0)$, $B(」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q16(AB): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q16(AB): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(AB): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「는? (단, $O$는 원점이다.) [4.7점]」
- method: 정리(NAMED)←solution:「수직 조건에서 각 인접 직선의 기울기의 곱이」
- condition: (없음)

**how** Q16(AB): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

수직 조건에서 각 인접 직선의 기울기의 곱이 $-1$이므로  
$$\frac{b}{a} \cdot \left(-\frac{b}{c}\right) = -1 \implies b^2 = ac, \quad \left(-\frac{b}{c}\right) \cdot \frac{d}{c} = -1 \implies c^2 = bd, \quad \frac{d}{c} \cdot \left(-\frac{d}{e}\right) = -1 \implies d^2 = ce$$  
또한 $\overline{AO} = a$, $\overline{OC} = c$, $\overline{EA} = e - a$가 이 순서대로 등차수열을 이루므로 등차중항의 성질에 의해  
$$2(2c) = a + (e - a) \implies e = 4c$$  
직선 $BC$의 기울기를 $m = -\frac{b}{c}$ ($m < 0$)라 하면 $d = \frac{c^2}{b} = -\frac{c}{m}$이다.  
$d^2 = ce$에 대입하면  
$$\left(-\frac{c}{m}\right)^2 = c \cdot 4c \implies \frac{1}{m^2} = 4 \implies m^2 = \frac{1}{4}$$  
$m < 0$이므로 구하는 기울기는 $m = -\frac{1}{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

공차가 양수인 등차수열 $\{a_n\}$에 대하여 $a_5 + a_9 = 0$, $\sum_{k=1}^{5} \frac{1}{a_k a_{k+1}} = \frac{5}{96}$일 때, 일반항 $a_n$은?

**보기** ① $a_n = 4n - 28$  ② $a_n = 3n - 21$  ③ $a_n = 4n - 24$  ④ $a_n = 5n - 35$  ⑤ $a_n = 5n - 30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 등차중항에 의해 $a_5 + a_9 = 2a_7 = 0$이므로 $a_7 = a_1 + 6d = 0$, 즉 $a_1 = -6d$ ($d > 0$)이다.
2. 부분분수 분해를 적용하면  
$$\sum_{k=1}^{5} \frac{1}{a_k a_{k+1}} = \frac{1}{d} \sum_{k=1}^{5} \left(\frac{1}{a_k} - \frac{1}{a_{k+1}}\right) = \frac{1}{d}\left(\frac{1}{a_1} - \frac{1}{a_6}\right)$$  
$a_1 = -6d$, $a_6 = -d$를 대입하면  
$$\frac{1}{d}\left(\frac{1}{-6d} - \frac{1}{-d}\right) = \frac{5}{6d^2} = \frac{5}{96} \implies d^2 = 16 \implies d = 4 \ (d > 0)$$  
따라서 $a_1 = -24$이므로 $a_n = -24 + 4(n - 1) = 4n - 28$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「공차가 양수인 등차수열 $\{a_n\}$에 대하여 $a」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] **원천→판정: 수열 > 수열의 합 > 여러 가지 수열의 합 > 부분분수·망원급수형 → 수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합**
- 이유: Q17(96): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q17(96): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(96): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「c{5}{96}$일 때, 일반항 $a_n$은?」
- method: 정리(NAMED)←solution:「등차중항에 의해 $a_5 + a_9 = 2a_」
- condition: (없음)

**how** Q17(96): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차중항에 의해 $a_5 + a_9 = 2a_7 = 0$이므로 $a_7 = a_1 + 6d = 0$, 즉 $a_1 = -6d$ ($d > 0$)이다.  
부분분수 분해를 적용하면  
$$\sum_{k=1}^{5} \frac{1}{a_k a_{k+1}} = \frac{1}{d} \sum_{k=1}^{5} \left(\frac{1}{a_k} - \frac{1}{a_{k+1}}\right) = \frac{1}{d}\left(\frac{1}{a_1} - \frac{1}{a_6}\right)$$  
$a_1 = -6d$, $a_6 = -d$를 대입하면  
$$\frac{1}{d}\left(\frac{1}{-6d} - \frac{1}{-d}\right) = \frac{5}{6d^2} = \frac{5}{96} \implies d^2 = 16 \implies d = 4 \ (d > 0)$$  
따라서 $a_1 = -24$이므로 $a_n = -24 + 4(n - 1) = 4n - 28$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점


**발문**

반지름의 길이가 $R$인 원 $C$에 내접하는 삼각형 $ABC$와 직선 $AE$가 변 $BC$와 만나는 점 $E$, 원 $C$와 다시 만나는 점 $D$가 다음 조건을 만족시킨다. 삼각형 $ABC$의 넓이가 삼각형 $BDE$의 넓이의 $4$배가 되도록 하는 모든 $\overline{BE}$의 값들의 곱은?

(가) $\angle DBE = \frac{\pi}{6}$  
(나) $\overline{BD} = R = 2$  
(다) $\overline{AB} : \overline{AC} = \overline{BE} : \overline{CE}$  
(라) $\overline{AB}^2 + \overline{AC}^2 = \overline{AB} \cdot \overline{AC} + 12$

**보기** ① $\frac{1}{4}$  ② $\frac{1}{2}$  ③ $\frac{3}{4}$  ④ $\frac{5}{6}$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (나)에서 $\overline{BD} = R = 2$이므로 현 $BD$에 대한 중심각은 $60^\circ$, 원주각은 $\angle BAD = 30^\circ$이다.
2. 조건 (다)에 의해 $AE$는 $\angle A$의 이등분선이므로 $\angle BAC = 60^\circ$이다.
3. $\overline{AB} = c$, $\overline{AC} = b$라 하면 코사인법칙과 조건 (라)에 의해  
$$\overline{BC}^2 = b^2 + c^2 - 2bc\cos 60^\circ = b^2 + c^2 - bc = 12 \implies \overline{BC} = 2\sqrt{3}$$  
$\triangle ACE \sim \triangle BDE$ (AA 닮음)이고 닮음비가 $b : 2$이므로 넓이의 비는 $b^2 : 4$이다.
4. 따라서 $\triangle BDE = \triangle ABC \cdot \frac{b}{b+c} \cdot \frac{4}{b^2} = \triangle ABC \cdot \frac{4}{b(b+c)}$이다.
5. 조건 $\triangle ABC = 4\triangle BDE$에서 $b(b+c) = 16 \implies c = \frac{16 - b^2}{b}$이다.
6. 이를 $b^2 + c^2 - bc = 12$에 대입하고 $t = b^2$이라 하면  
$$t + \frac{(16 - t)^2}{t} - (16 - t) = 12 \implies 3t^2 - 60t + 256 = 0$$  
두 근 $t_1, t_2$는 $0 < t_1, t_2 < 16$을 만족하며 $t_1 + t_2 = 20$, $t_1 t_2 = \frac{256}{3}$이다.
7. 한편 $\overline{BE} = \frac{2\sqrt{3}c}{b+c} = \frac{2\sqrt{3}(16 - t)}{16} = \frac{\sqrt{3}}{8}(16 - t)$이므로 모든 $\overline{BE}$의 곱은  
$$\frac{3}{64}(16 - t_1)(16 - t_2) = \frac{3}{64}\left(256 - 16 \cdot 20 + \frac{256}{3}\right) = \frac{3}{64} \cdot \frac{64}{3} = 1$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $R$인 원 $C$에 내접하는 삼각형 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 삼각형의 넓이 > 복합도형 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q18(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_TRIANGLE_AREA / TPL=TPL_H22A_05_TRIANGLE_AREA_113 (원천과 같음)
- 이유: Q18(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\cdot \overline{AC} + 12$」
- method: 정리(NAMED)←solution:「조건 (나)에서 $\overline{BD} =」
- condition: (없음)

**how** Q18(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (나)에서 $\overline{BD} = R = 2$이므로 현 $BD$에 대한 중심각은 $60^\circ$, 원주각은 $\angle BAD = 30^\circ$이다.  
조건 (다)에 의해 $AE$는 $\angle A$의 이등분선이므로 $\angle BAC = 60^\circ$이다.  
$\overline{AB} = c$, $\overline{AC} = b$라 하면 코사인법칙과 조건 (라)에 의해  
$$\overline{BC}^2 = b^2 + c^2 - 2bc\cos 60^\circ = b^2 + c^2 - bc = 12 \implies \overline{BC} = 2\sqrt{3}$$  
$\triangle ACE \sim \triangle BDE$ (AA 닮음)이고 닮음비가 $b : 2$이므로 넓이의 비는 $b^2 : 4$이다.  
따라서 $\triangle BDE = \triangle ABC \cdot \frac{b}{b+c} \cdot \frac{4}{b^2} = \triangle ABC \cdot \frac{4}{b(b+c)}$이다.  
조건 $\triangle ABC = 4\triangle BDE$에서 $b(b+c) = 16 \implies c = \frac{16 - b^2}{b}$이다.  
이를 $b^2 + c^2 - bc = 12$에 대입하고 $t = b^2$이라 하면  
$$t + \frac{(16 - t)^2}{t} - (16 - t) = 12 \implies 3t^2 - 60t + 256 = 0$$  
두 근 $t_1, t_2$는 $0 < t_1, t_2 < 16$을 만족하며 $t_1 + t_2 = 20$, $t_1 t_2 = \frac{256}{3}$이다.  
한편 $\overline{BE} = \frac{2\sqrt{3}c}{b+c} = \frac{2\sqrt{3}(16 - t)}{16} = \frac{\sqrt{3}}{8}(16 - t)$이므로 모든 $\overline{BE}$의 곱은  
$$\frac{3}{64}(16 - t_1)(16 - t_2) = \frac{3}{64}\left(256 - 16 \cdot 20 + \frac{256}{3}\right) = \frac{3}{64} \cdot \frac{64}{3} = 1$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 다음 조건을 만족시킬 때, $a_2$의 값은?

(가) $1 < a_1 < 2$  
(나) $a_{2n} = a_3 a_n + 1$  
(다) $a_{2n+1} = a_3 a_n - 1$  
(라) $a_{12} - a_{15} = 8$

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (나)에서 $a_6 = a_3^2 + 1$이므로 $a_{12} = a_3 a_6 + 1 = a_3^3 + a_3 + 1$이다.
2. 조건 (다)에서 $a_7 = a_3^2 - 1$이므로 $a_{15} = a_3 a_7 - 1 = a_3^3 - a_3 - 1$이다.
3. 조건 (라)에 대입하면  
$$a_{12} - a_{15} = (a_3^3 + a_3 + 1) - (a_3^3 - a_3 - 1) = 2a_3 + 2 = 8 \implies a_3 = 3$$  
조건 (다)에 $n = 1$을 대입하면 $a_3 = a_3 a_1 - 1 \implies 3 = 3a_1 - 1 \implies a_1 = \frac{4}{3}$ (조건 (가) 만족).
4. 따라서 조건 (나)에 $n = 1$을 대입하면 $a_2 = a_3 a_1 + 1 = 3 \times \frac{4}{3} + 1 = 5$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] (원천과 같음)
- 이유: Q19(12): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_RECURSIVE_SEQUENCE / TPL=TPL_H22A_08_RECURSIVE_SEQUENCE_129 (원천과 같음)
- 이유: Q19(12): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(12): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「(라) $a_{12} - a_{15} = 8$」
- method: 정리(NAMED)←solution:「조건 (나)에서 $a_6 = a_3^2 + 1」
- condition: (없음)

**how** Q19(12): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (나)에서 $a_6 = a_3^2 + 1$이므로 $a_{12} = a_3 a_6 + 1 = a_3^3 + a_3 + 1$이다.  
조건 (다)에서 $a_7 = a_3^2 - 1$이므로 $a_{15} = a_3 a_7 - 1 = a_3^3 - a_3 - 1$이다.  
조건 (라)에 대입하면  
$$a_{12} - a_{15} = (a_3^3 + a_3 + 1) - (a_3^3 - a_3 - 1) = 2a_3 + 2 = 8 \implies a_3 = 3$$  
조건 (다)에 $n = 1$을 대입하면 $a_3 = a_3 a_1 - 1 \implies 3 = 3a_1 - 1 \implies a_1 = \frac{4}{3}$ (조건 (가) 만족).  
따라서 조건 (나)에 $n = 1$을 대입하면 $a_2 = a_3 a_1 + 1 = 3 \times \frac{4}{3} + 1 = 5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 5점


**발문**

첫째항부터 제$2$항까지의 합이 $12$, 첫째항부터 제$4$항까지의 합이 $120$인 등비수열의 일반항 $a_n$을 구하는 과정을 서술하시오. (단, 공비는 자연수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a_n = 3^n$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째항을 $a$, 공비를 $r$이라 하자.
2. $r = 1$이면 $S_4 = 2S_2 = 24 \ne 120$이므로 $r \ne 1$이다.
3. $$S_2 = \frac{a(r^2 - 1)}{r - 1} = 12, \quad S_4 = \frac{a(r^4 - 1)}{r - 1} = S_2(r^2 + 1) = 120$$  
따라서 $12(r^2 + 1) = 120 \implies r^2 + 1 = 10 \implies r^2 = 9$이고, 공비 $r$이 자연수이므로 $r = 3$이다.
4. $S_2 = a(1 + 3) = 12$에서 $a = 3$이므로 일반항은 $a_n = 3 \times 3^{n-1} = 3^n$이다.
- 작성자 답: $a_n = 3^n$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항부터 제$2$항까지의 합이 $12$, 첫째항부터 」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q20(12): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q20(12): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(12): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「정을 서술하시오. (단, 공비는 자연수이다.)」
- method: 정리(NAMED)←solution:「첫째항을 $a$, 공비를 $r$이라 하자. $」
- condition: (없음)

**how** Q20(12): 발문과 해설의 풀이 과정을 점검하여 정답 $a_n = 3^n$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째항을 $a$, 공비를 $r$이라 하자. $r = 1$이면 $S_4 = 2S_2 = 24 \ne 120$이므로 $r \ne 1$이다.  
$$S_2 = \frac{a(r^2 - 1)}{r - 1} = 12, \quad S_4 = \frac{a(r^4 - 1)}{r - 1} = S_2(r^2 + 1) = 120$$  
따라서 $12(r^2 + 1) = 120 \implies r^2 + 1 = 10 \implies r^2 = 9$이고, 공비 $r$이 자연수이므로 $r = 3$이다.  
$S_2 = a(1 + 3) = 12$에서 $a = 3$이므로 일반항은 $a_n = 3 \times 3^{n-1} = 3^n$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점


**발문**

삼각형 $ABC$가 다음 조건을 만족시킬 때, 삼각형 $ABC$의 외접원의 반지름의 길이를 구하는 과정을 서술하시오.

(가) 변 $BC$를 $B$에 가까운 쪽부터 $3 : 1 : 2$로 나누는 두 점을 각각 $P$, $Q$라 한다.  
(나) $\sin(\angle QAP) : \sin(\angle APQ) = 1 : 2\sqrt{2}$  
(다) $\overline{AB} = 4$, $\overline{AQ} = 2\sqrt{2}$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\frac{8\sqrt{7}}{7}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle APQ$에서 사인법칙을 적용하면  
$$\frac{\overline{PQ}}{\sin(\angle QAP)} = \frac{\overline{AQ}}{\sin(\angle APQ)} \implies \overline{PQ} = 2\sqrt{2} \times \frac{1}{2\sqrt{2}} = 1$$  
조건 (가)에 의해 $\overline{BP} = 3$, $\overline{PQ} = 1$, $\overline{QC} = 2$이므로 $\overline{BQ} = 4$, $\overline{BC} = 6$이다.
2. $\triangle ABQ$에서 코사인법칙을 적용하면  
$$\cos B = \frac{4^2 + 4^2 - (2\sqrt{2})^2}{2 \times 4 \times 4} = \frac{16 + 16 - 8}{32} = \frac{3}{4}$$  
$\sin B = \sqrt{1 - \left(\frac{3}{4}\right)^2} = \frac{\sqrt{7}}{4}$이다.
3. 이제 $\triangle ABC$에서 코사인법칙을 적용하면  
$$\overline{AC}^2 = 4^2 + 6^2 - 2 \times 4 \times 6 \times \frac{3}{4} = 16 + 36 - 36 = 16 \implies \overline{AC} = 4$$  
따라서 외접원의 반지름의 길이 $R$은 사인법칙에 의해  
$$2R = \frac{\overline{AC}}{\sin B} = \frac{4}{\frac{\sqrt{7}}{4}} = \frac{16\sqrt{7}}{7} \implies R = \frac{8\sqrt{7}}{7}$$.
- 작성자 답: $\frac{8\sqrt{7}}{7}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$가 다음 조건을 만족시킬 때, 삼각형 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q21(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q21(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「overline{AQ} = 2\sqrt{2}$」
- method: 정리(NAMED)←solution:「$\triangle APQ$에서 사인법칙을 적」
- condition: (없음)

**how** Q21(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 $\frac{8\sqrt{7}}{7}$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle APQ$에서 사인법칙을 적용하면  
$$\frac{\overline{PQ}}{\sin(\angle QAP)} = \frac{\overline{AQ}}{\sin(\angle APQ)} \implies \overline{PQ} = 2\sqrt{2} \times \frac{1}{2\sqrt{2}} = 1$$  
조건 (가)에 의해 $\overline{BP} = 3$, $\overline{PQ} = 1$, $\overline{QC} = 2$이므로 $\overline{BQ} = 4$, $\overline{BC} = 6$이다.  
$\triangle ABQ$에서 코사인법칙을 적용하면  
$$\cos B = \frac{4^2 + 4^2 - (2\sqrt{2})^2}{2 \times 4 \times 4} = \frac{16 + 16 - 8}{32} = \frac{3}{4}$$  
$\sin B = \sqrt{1 - \left(\frac{3}{4}\right)^2} = \frac{\sqrt{7}}{4}$이다.  
이제 $\triangle ABC$에서 코사인법칙을 적용하면  
$$\overline{AC}^2 = 4^2 + 6^2 - 2 \times 4 \times 6 \times \frac{3}{4} = 16 + 36 - 36 = 16 \implies \overline{AC} = 4$$  
따라서 외접원의 반지름의 길이 $R$은 사인법칙에 의해  
$$2R = \frac{\overline{AC}}{\sin B} = \frac{4}{\frac{\sqrt{7}}{4}} = \frac{16\sqrt{7}}{7} \implies R = \frac{8\sqrt{7}}{7}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

세 수 $\frac{a}{b}$, $ab$, $2b$가 다음 조건을 만족시킬 때, 상수 $a, b$의 값을 구하는 과정을 서술하시오.

(가) $a < 0 < b < 1$  
(나) 세 수는 적당히 배열하면 등차수열이 되고, 또 적당히 배열하면 등비수열이 된다. (등차수열과 등비수열이 되는 배열 순서를 각각 밝혀 서술하시오.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a = -1,\ b = \frac{1}{2}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $0 < b < 1$이므로 $\frac{1}{b} > 1 > b$이고, $a < 0$을 곱하면 $\frac{a}{b} < a < ab < 0 < 2b$가 성립한다.
2. 따라서 세 수가 등차수열을 이루는 배열 순서는 크기순인 $\frac{a}{b},\ ab,\ 2b$ (또는 역순)이다.
3. 등차중항에 의해  
$$2ab = \frac{a}{b} + 2b \quad \cdots \text{㉠}$$  
세 수 중 $2$개는 음수, $1$개는 양수이므로 등비수열이 되려면 양수 $2b$가 가운데에 위치해야 한다.
4. 따라서 배열 순서는 $\frac{a}{b},\ 2b,\ ab$ (또는 역순)이다.
5. 등비중항에 의해  
$$(2b)^2 = \frac{a}{b} \cdot ab = a^2 \implies 2b = -a \ (a < 0 < b) \quad \cdots \text{㉡}$$  
㉡에서 $a = -2b$를 ㉠에 대입하면  
$$2(-2b)b = -2 + 2b \implies 4b^2 + 2b - 2 = 0 \implies (2b - 1)(b + 1) = 0$$  
$0 < b < 1$이므로 $b = \frac{1}{2}$이고, $a = -2b = -1$이다.
- 작성자 답: $a = -1,\ b = \frac{1}{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 수 $\frac{a}{b}$, $ab$, $2b$가」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q22(ab): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q22(ab): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(ab): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「이 되는 배열 순서를 각각 밝혀 서술하시오.)」
- method: 정리(NAMED)←solution:「$0 < b < 1$이므로 $\frac{1}{」
- condition: (없음)

**how** Q22(ab): 발문과 해설의 풀이 과정을 점검하여 정답 $a = -1,\ b = \frac{1}{2}$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$0 < b < 1$이므로 $\frac{1}{b} > 1 > b$이고, $a < 0$을 곱하면 $\frac{a}{b} < a < ab < 0 < 2b$가 성립한다.  
따라서 세 수가 등차수열을 이루는 배열 순서는 크기순인 $\frac{a}{b},\ ab,\ 2b$ (또는 역순)이다. 등차중항에 의해  
$$2ab = \frac{a}{b} + 2b \quad \cdots \text{㉠}$$  
세 수 중 $2$개는 음수, $1$개는 양수이므로 등비수열이 되려면 양수 $2b$가 가운데에 위치해야 한다. 따라서 배열 순서는 $\frac{a}{b},\ 2b,\ ab$ (또는 역순)이다. 등비중항에 의해  
$$(2b)^2 = \frac{a}{b} \cdot ab = a^2 \implies 2b = -a \ (a < 0 < b) \quad \cdots \text{㉡}$$  
㉡에서 $a = -2b$를 ㉠에 대입하면  
$$2(-2b)b = -2 + 2b \implies 4b^2 + 2b - 2 = 0 \implies (2b - 1)(b + 1) = 0$$  
$0 < b < 1$이므로 $b = \frac{1}{2}$이고, $a = -2b = -1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

반지름의 길이가 $\overline{O_1 O_2}$인 두 원 $C_1, C_2$의 중심을 각각 $O_1, O_2$라 하자. 원 $C_1$ 위의 서로 다른 세 점 $A, B, C$와 원 $C_2$ 위의 점 $D$에 대하여 세 점 $A, O_1, O_2$와 세 점 $C, O_2, D$는 각각 한 직선 위에 있고, $\angle BO_1 A = \theta_1$, $\angle O_2 O_1 C = \theta_2$, $\angle O_1 O_2 D = \theta_3$이라 할 때 $\theta_3 = \theta_1 + \theta_2$가 성립한다. $\overline{AB} = 4$, $\overline{O_1 D} = 6\sqrt{2}$일 때, $\overline{CO_2} \times \overline{O_2 D}$의 값을 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $28$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 원의 반지름의 길이를 $R$이라 하자. (BO)
2. $\triangle O_1 O_2 C$는 $\overline{O_1 C} = \overline{O_1 O_2} = R$인 이등변삼각형이므로 $\angle O_1 O_2 C = 90^\circ - \frac{\theta_2}{2}$이다.
3. 세 점 $C, O_2, D$가 한 직선 위에 있으므로 $\theta_3 = 180^\circ - \left(90^\circ - \frac{\theta_2}{2}\right) = 90^\circ + \frac{\theta_2}{2}$이다.
4. 조건 $\theta_3 = \theta_1 + \theta_2$에 대입하면 $\theta_1 + \frac{\theta_2}{2} = 90^\circ$이고, 따라서 $\theta_3 = 180^\circ - \theta_1$이다.
5. 한편 $\triangle O_1 O_2 C$에서 코사인법칙에 의해  
$$\overline{CO_2}^2 = 2R^2(1 - \cos\theta_2) = 4R^2\sin^2\frac{\theta_2}{2} \implies \overline{CO_2} = 2R\sin\frac{\theta_2}{2} = 2R\cos\theta_1$$  
따라서 구하는 값은 $\overline{CO_2} \times \overline{O_2 D} = 2R^2\cos\theta_1$이다.
6. $\triangle O_1 AB$와 $\triangle O_1 O_2 D$에서 각각 코사인법칙을 적용하면  
$$\overline{AB}^2 = 16 = 2R^2(1 - \cos\theta_1), \quad \overline{O_1 D}^2 = 72 = 2R^2(1 - \cos\theta_3) = 2R^2(1 + \cos\theta_1)$$  
두 식을 변변 빼면 $72 - 16 = 4R^2\cos\theta_1 \implies 4R^2\cos\theta_1 = 56$이므로  
$$\overline{CO_2} \times \overline{O_2 D} = 2R^2\cos\theta_1 = 28$$.
- 작성자 답: $28$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $\overline{O_1 O_2}$인」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q23(BO): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q23(BO): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23(BO): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「_2 D}$의 값을 구하는 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「두 원의 반지름의 길이를 $R$이라 하자. $」
- condition: (없음)

**how** Q23(BO): 발문과 해설의 풀이 과정을 점검하여 정답 $28$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 원의 반지름의 길이를 $R$이라 하자. $\triangle O_1 O_2 C$는 $\overline{O_1 C} = \overline{O_1 O_2} = R$인 이등변삼각형이므로 $\angle O_1 O_2 C = 90^\circ - \frac{\theta_2}{2}$이다.  
세 점 $C, O_2, D$가 한 직선 위에 있으므로 $\theta_3 = 180^\circ - \left(90^\circ - \frac{\theta_2}{2}\right) = 90^\circ + \frac{\theta_2}{2}$이다.  
조건 $\theta_3 = \theta_1 + \theta_2$에 대입하면 $\theta_1 + \frac{\theta_2}{2} = 90^\circ$이고, 따라서 $\theta_3 = 180^\circ - \theta_1$이다.  
한편 $\triangle O_1 O_2 C$에서 코사인법칙에 의해  
$$\overline{CO_2}^2 = 2R^2(1 - \cos\theta_2) = 4R^2\sin^2\frac{\theta_2}{2} \implies \overline{CO_2} = 2R\sin\frac{\theta_2}{2} = 2R\cos\theta_1$$  
따라서 구하는 값은 $\overline{CO_2} \times \overline{O_2 D} = 2R^2\cos\theta_1$이다.  
$\triangle O_1 AB$와 $\triangle O_1 O_2 D$에서 각각 코사인법칙을 적용하면  
$$\overline{AB}^2 = 16 = 2R^2(1 - \cos\theta_1), \quad \overline{O_1 D}^2 = 72 = 2R^2(1 - \cos\theta_3) = 2R^2(1 + \cos\theta_1)$$  
두 식을 변변 빼면 $72 - 16 = 4R^2\cos\theta_1 \implies 4R^2\cos\theta_1 = 56$이므로  
$$\overline{CO_2} \times \overline{O_2 D} = 2R^2\cos\theta_1 = 28$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
