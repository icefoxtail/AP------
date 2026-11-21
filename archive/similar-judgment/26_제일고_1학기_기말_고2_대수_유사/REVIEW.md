# 검수 묶음 — 26_제일고_1학기_기말_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 5)**
- 문항 21개 / 검사 PASS 16, FAIL 5, 보류 0
- 검수 기록: 입력된 verdict 0/21, HOLD 0, 풀이 답 비어 있음 21문항
- 그림 판단 분포: NONE 21
- 난이도 분포: 1단계 4, 2단계 11, 3단계 4, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q10**: 검사 코드: CHOICE_ORDER
- **Q12**: 검사 코드: CHOICE_ORDER
- **Q14**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

삼각형 $ABC$의 외접원의 반지름의 길이가 $6$이고 $\angle A = 45^\circ$일 때, 선분 $BC$의 길이는?

**보기** ① $6\sqrt{2}$  ② $3\sqrt{2}$  ③ $4\sqrt{2}$  ④ $5\sqrt{2}$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q1 문제의 조건(ABC)에 맞추어 식을 세운다.
2. 사인법칙 $\frac{\overline{BC}}{\sin A} = 2R$에 $R = 6$, $A = 45^\circ$를 대입하면  
$$\overline{BC} = 2 \times 6 \times \sin 45^\circ = 12 \times \frac{\sqrt{2}}{2} = 6\sqrt{2}$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$의 외접원의 반지름의 길이가 $6$이고」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q1(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q1(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「^\circ$일 때, 선분 $BC$의 길이는?」
- method: 정리(NAMED)←solution:「사인법칙 $\frac{\overline{BC}」
- condition: (없음)

**how** Q1(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사인법칙 $\frac{\overline{BC}}{\sin A} = 2R$에 $R = 6$, $A = 45^\circ$를 대입하면  
$$\overline{BC} = 2 \times 6 \times \sin 45^\circ = 12 \times \frac{\sqrt{2}}{2} = 6\sqrt{2}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

첫째항이 $5$이고 공차가 $-3$인 등차수열 $\{a_n\}$의 일반항은?

**보기** ① $a_n = -3n + 2$  ② $a_n = -3n + 5$  ③ $a_n = 3n + 2$  ④ $a_n = -3n + 8$  ⑤ $a_n = 5n - 3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q2 문제의 조건(5)에 맞추어 식을 세운다.
2. 등차수열의 일반항 공식 $a_n = a_1 + (n - 1)d$에 $a_1 = 5$, $d = -3$을 대입하면  
$$a_n = 5 + (n - 1)(-3) = -3n + 8$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $5$이고 공차가 $-3$인 등차수열 $\{a」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] (원천과 같음)
- 이유: Q2(5): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q2(5): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(5): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「3$인 등차수열 $\{a_n\}$의 일반항은?」
- method: 정리(NAMED)←solution:「등차수열의 일반항 공식 $a_n = a_1 +」
- condition: (없음)

**how** Q2(5): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열의 일반항 공식 $a_n = a_1 + (n - 1)d$에 $a_1 = 5$, $d = -3$을 대입하면  
$$a_n = 5 + (n - 1)(-3) = -3n + 8$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$\sum_{k=3}^{10} k^2$의 값은?

**보기** ① $375$  ② $380$  ③ $385$  ④ $390$  ⑤ $395$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q3 문제의 조건(10)에 맞추어 식을 세운다.
2. $1$부터 $10$까지의 제곱의 합에서 $k = 1, 2$일 때의 합을 빼면  
$$\sum_{k=3}^{10} k^2 = \sum_{k=1}^{10} k^2 - (1^2 + 2^2) = \frac{10 \times 11 \times 21}{6} - 5 = 385 - 5 = 380$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sum_{k=3}^{10} k^2$의 값은?」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] (원천과 같음)
- 이유: Q3(10): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q3(10): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(10): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\sum_{k=3}^{10} k^2$의 값은?」
- method: 정리(NAMED)←solution:「$1$부터 $10$까지의 제곱의 합에서 $k」
- condition: (없음)

**how** Q3(10): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$1$부터 $10$까지의 제곱의 합에서 $k = 1, 2$일 때의 합을 빼면  
$$\sum_{k=3}^{10} k^2 = \sum_{k=1}^{10} k^2 - (1^2 + 2^2) = \frac{10 \times 11 \times 21}{6} - 5 = 385 - 5 = 380$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

다음 중 임의의 두 수열 $\{a_n\}, \{b_n\}$에 대하여 항상 성립하는 것은? (단, $p, q$는 상수이다.)

**보기** ① $\sum_{k=1}^n q = q$  ② $\sum_{k=1}^n \frac{a_k}{b_k} = \frac{\sum_{k=1}^n a_k}{\sum_{k=1}^n b_k}$ (단, $b_k \ne 0$, $\sum_{k=1}^n b_k \ne 0$)  ③ $\sum_{k=1}^n a_k b_k = \left(\sum_{k=1}^n a_k\right)\left(\sum_{k=1}^n b_k\right)$  ④ $\sum_{k=1}^n (a_k + k) = \sum_{k=1}^n a_k + n$  ⑤ $\sum_{k=1}^n (pa_k - qb_k) = p\sum_{k=1}^n a_k - q\sum_{k=1}^n b_k$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\sum$의 선형성에 의해 $\sum_{k=1}^n (pa_k - qb_k) = p\sum_{k=1}^n a_k - q\sum_{k=1}^n b_k$는 항상 성립한다.
2. (⑤)  
① $\sum_{k=1}^n q = nq$이므로 거짓이다.
3. ②③ 나눗셈과 곱셈은 $\sum$으로 분리할 수 없으므로 거짓이다.
4. ④ $\sum_{k=1}^n (a_k + k) = \sum_{k=1}^n a_k + \frac{n(n+1)}{2}$이므로 거짓이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 임의의 두 수열 $\{a_n\}, \{b_n\」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] **원천→판정: 수열 > 수열의 합 > 합의 기호 Σ > 성질 → 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산**
- 이유: Q4(pa): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q4(pa): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(pa): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「하는 것은? (단, $p, q$는 상수이다.)」
- method: 정리(NAMED)←solution:「$\sum$의 선형성에 의해 $\sum_{k=」
- condition: (없음)

**how** Q4(pa): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sum$의 선형성에 의해 $\sum_{k=1}^n (pa_k - qb_k) = p\sum_{k=1}^n a_k - q\sum_{k=1}^n b_k$는 항상 성립한다. (⑤)  
① $\sum_{k=1}^n q = nq$이므로 거짓이다.  
②③ 나눗셈과 곱셈은 $\sum$으로 분리할 수 없으므로 거짓이다.  
④ $\sum_{k=1}^n (a_k + k) = \sum_{k=1}^n a_k + \frac{n(n+1)}{2}$이므로 거짓이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4.1점


**발문**

다음 중 제$2$항이 $41$, 제$10$항이 $-15$인 등차수열 $\{a_n\}$에 대한 설명으로 옳은 것은?

**보기** ① 공차는 $7$이다.  ② 제$21$항은 $-99$이다.  ③ 첫째항부터 제$15$항까지의 합 $S_{15}$는 $-15$이다.  ④ 일반항 $a_n$은 $a_n = -7n + 48$이다.  ⑤ 첫째항부터 제$n$항까지의 합 $S_n$은 $\frac{n(100 - 7n)}{2}$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 공차를 $d$라 하면 $a_{10} - a_2 = 8d = -15 - 41 = -56 \implies d = -7$이다.
2. (① 거짓)  
$a_1 = a_2 - d = 41 - (-7) = 48$이므로 일반항은 $a_n = 48 - 7(n - 1) = -7n + 55$이다.
3. (④ 거짓)  
$a_{21} = -7(21) + 55 = -92$이다.
4. (② 거짓)  
$a_{15} = -7(15) + 55 = -50$이므로 $S_{15} = \frac{15(48 - 50)}{2} = -15$이다.
5. (③ 참)  
$S_n = \frac{n(48 + 55 - 7n)}{2} = \frac{n(103 - 7n)}{2}$이다.
6. (⑤ 거짓).
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 제$2$항이 $41$, 제$10$항이 $-15」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q5(41): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q5(41): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(41): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$\{a_n\}$에 대한 설명으로 옳은 것은?」
- method: 정리(NAMED)←solution:「공차를 $d$라 하면 $a_{10} - a_2」
- condition: (없음)

**how** Q5(41): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공차를 $d$라 하면 $a_{10} - a_2 = 8d = -15 - 41 = -56 \implies d = -7$이다. (① 거짓)  
$a_1 = a_2 - d = 41 - (-7) = 48$이므로 일반항은 $a_n = 48 - 7(n - 1) = -7n + 55$이다. (④ 거짓)  
$a_{21} = -7(21) + 55 = -92$이다. (② 거짓)  
$a_{15} = -7(15) + 55 = -50$이므로 $S_{15} = \frac{15(48 - 50)}{2} = -15$이다. (③ 참)  
$S_n = \frac{n(48 + 55 - 7n)}{2} = \frac{n(103 - 7n)}{2}$이다. (⑤ 거짓)

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4.1점


**발문**

$\sum_{k=1}^8 (k + 1)^3 - 3\sum_{k=1}^8 k(k + 1) - 7$의 값은?

**보기** ① $1295$  ② $1297$  ③ $1299$  ④ $1301$  ⑤ $1303$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 합의 범위가 $k = 1$부터 $8$까지로 같으므로 하나의 $\sum$로 합쳐 정리한다. (1295)
2. $$(k + 1)^3 - 3k(k + 1) = (k^3 + 3k^2 + 3k + 1) - (3k^2 + 3k) = k^3 + 1$$  
따라서 구하는 값은  
$$\sum_{k=1}^8 (k^3 + 1) - 7 = \left(\frac{8 \times 9}{2}\right)^2 + 8 - 7 = 36^2 + 1 = 1296 + 1 = 1297$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sum_{k=1}^8 (k + 1)^3 - 3\su」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] (원천과 같음)
- 이유: Q6(1295): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q6(1295): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(1295): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「k=1}^8 k(k + 1) - 7$의 값은?」
- method: 정리(NAMED)←solution:「합의 범위가 $k = 1$부터 $8$까지로 같」
- condition: (없음)

**how** Q6(1295): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

합의 범위가 $k = 1$부터 $8$까지로 같으므로 하나의 $\sum$로 합쳐 정리한다.  
$$(k + 1)^3 - 3k(k + 1) = (k^3 + 3k^2 + 3k + 1) - (3k^2 + 3k) = k^3 + 1$$  
따라서 구하는 값은  
$$\sum_{k=1}^8 (k^3 + 1) - 7 = \left(\frac{8 \times 9}{2}\right)^2 + 8 - 7 = 36^2 + 1 = 1296 + 1 = 1297$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4.4점


**발문**

삼각형 $ABC$에 대하여 $\overline{AC}\cos C + \overline{AB}\cos B = \overline{AB}$를 만족시키는 삼각형 $ABC$에 대한 설명으로 옳은 것은?

**보기** ① $\overline{BC} = \overline{AB}$인 이등변삼각형  ② $\triangle ABC$는 정삼각형  ③ $\angle A = 90^\circ$인 직각삼각형  ④ $\angle B = 90^\circ$인 직각삼각형  ⑤ $\overline{AB} = \overline{AC}$인 이등변삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 세 변의 길이를 $a = \overline{BC}$, $b = \overline{CA}$, $c = \overline{AB}$라 하면 주어진 조건은 $b\cos C + c\cos B = c$이다. (ABC)
2. 코사인법칙 $\cos C = \frac{a^2 + b^2 - c^2}{2ab}$, $\cos B = \frac{a^2 + c^2 - b^2}{2ac}$를 대입하면  
$$b \cdot \frac{a^2 + b^2 - c^2}{2ab} + c \cdot \frac{a^2 + c^2 - b^2}{2ac} = \frac{a^2 + b^2 - c^2 + a^2 + c^2 - b^2}{2a} = \frac{2a^2}{2a} = a$$  
따라서 $a = c$, 즉 $\overline{BC} = \overline{AB}$인 이등변삼각형이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에 대하여 $\overline{AC}\」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 삼각형 판정 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q7(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q7(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「삼각형 $ABC$에 대한 설명으로 옳은 것은?」
- method: 정리(NAMED)←solution:「세 변의 길이를 $a = \overline{B」
- condition: (없음)

**how** Q7(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 변의 길이를 $a = \overline{BC}$, $b = \overline{CA}$, $c = \overline{AB}$라 하면 주어진 조건은 $b\cos C + c\cos B = c$이다.  
코사인법칙 $\cos C = \frac{a^2 + b^2 - c^2}{2ab}$, $\cos B = \frac{a^2 + c^2 - b^2}{2ac}$를 대입하면  
$$b \cdot \frac{a^2 + b^2 - c^2}{2ab} + c \cdot \frac{a^2 + c^2 - b^2}{2ac} = \frac{a^2 + b^2 - c^2 + a^2 + c^2 - b^2}{2a} = \frac{2a^2}{2a} = a$$  
따라서 $a = c$, 즉 $\overline{BC} = \overline{AB}$인 이등변삼각형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4.4점


**발문**

세 모서리의 길이가 $l, m, n$인 직육면체에서 $l, m, n$이 이 순서대로 등비수열을 이룬다. 이 직육면체의 부피가 $64$이고 겉넓이가 $168$일 때, 모든 모서리의 길이의 합은?

**보기** ① $76$  ② $80$  ③ $84$  ④ $88$  ⑤ $92$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $l, m, n$이 등비수열을 이루므로 $m^2 = ln$이다.
2. 부피 조건 $lmn = m^3 = 64$에서 $m = 4$이고 $ln = 16$이다.
3. 겉넓이 조건 $2(lm + mn + nl) = 168$에서 $lm + mn + nl = 84$이므로  
$$4(l + n) + 16 = 84 \implies 4(l + n) = 68 \implies l + n = 17$$  
따라서 모든 모서리의 길이의 합은 $4(l + m + n) = 4(17 + 4) = 84$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 모서리의 길이가 $l, m, n$인 직육면체에서 $」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q8(64): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q8(64): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(64): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$168$일 때, 모든 모서리의 길이의 합은?」
- method: 정리(NAMED)←solution:「$l, m, n$이 등비수열을 이루므로 $m^」
- condition: (없음)

**how** Q8(64): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$l, m, n$이 등비수열을 이루므로 $m^2 = ln$이다.  
부피 조건 $lmn = m^3 = 64$에서 $m = 4$이고 $ln = 16$이다.  
겉넓이 조건 $2(lm + mn + nl) = 168$에서 $lm + mn + nl = 84$이므로  
$$4(l + n) + 16 = 84 \implies 4(l + n) = 68 \implies l + n = 17$$  
따라서 모든 모서리의 길이의 합은 $4(l + m + n) = 4(17 + 4) = 84$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4.4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

첫째항이 $5$인 등차수열 $\{a_n\}$에 대하여 수열 $\{b_n\}$을 $b_n = a_n + a_{n+1}$ ($n = 1, 2, 3, \cdots$)이라 하자. $b_8 = 100$일 때, $a_8$의 값은?

**보기** ① $41$  ② $43$  ③ $45$  ④ $49$  ⑤ $47$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 등차수열 $\{a_n\}$의 공차를 $d$라 하면 $a_n = 5 + (n - 1)d$이다.
2. $b_8 = a_8 + a_9 = (5 + 7d) + (5 + 8d) = 10 + 15d = 100$이므로 $15d = 90 \implies d = 6$이다.
3. 따라서 $a_8 = 5 + 7 \times 6 = 47$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $5$인 등차수열 $\{a_n\}$에 대하여 」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] (원천과 같음)
- 이유: Q9(100): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q9(100): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(100): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「b_8 = 100$일 때, $a_8$의 값은?」
- method: 정리(NAMED)←solution:「등차수열 $\{a_n\}$의 공차를 $d$라」
- condition: (없음)

**how** Q9(100): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열 $\{a_n\}$의 공차를 $d$라 하면 $a_n = 5 + (n - 1)d$이다.  
$b_8 = a_8 + a_9 = (5 + 7d) + (5 + 8d) = 10 + 15d = 100$이므로 $15d = 90 \implies d = 6$이다.  
따라서 $a_8 = 5 + 7 \times 6 = 47$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

수열 $\{c_n\}$에 대하여 $\sum_{k=1}^{25} c_{2k-1} = 21$, $\sum_{k=1}^{25} c_{2k} = 15$일 때, $\sum_{k=1}^{50} \cos(k\pi)c_k$의 값은?

**보기** ① $-36$  ② $-15$  ③ $-3$  ④ $-6$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정수 $k$에 대하여 $\cos(k\pi) = (-1)^k$이므로 홀수 항에는 $-1$, 짝수 항에는 $+1$이 곱해진다.
2. $$\sum_{k=1}^{50} \cos(k\pi)c_k = -\sum_{j=1}^{25} c_{2j-1} + \sum_{j=1}^{25} c_{2j} = -21 + 15 = -6$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{c_n\}$에 대하여 $\sum_{k=1}^」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] **원천→판정: 수열 > 수열의 합 > 합의 기호 Σ > 성질 → 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산**
- 이유: Q10(25): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q10(25): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(25): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「^{50} \cos(k\pi)c_k$의 값은?」
- method: 정리(NAMED)←solution:「정수 $k$에 대하여 $\cos(k\pi) =」
- condition: (없음)

**how** Q10(25): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정수 $k$에 대하여 $\cos(k\pi) = (-1)^k$이므로 홀수 항에는 $-1$, 짝수 항에는 $+1$이 곱해진다.  
$$\sum_{k=1}^{50} \cos(k\pi)c_k = -\sum_{j=1}^{25} c_{2j-1} + \sum_{j=1}^{25} c_{2j} = -21 + 15 = -6$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.5점


**발문**

수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n = 3n^2 + 2n$일 때, $\sum_{k=1}^{10} \frac{1}{a_k a_{k+1}}$의 값은?

**보기** ① $\frac{2}{65}$  ② $\frac{4}{65}$  ③ $\frac{6}{65}$  ④ $\frac{8}{65}$  ⑤ $\frac{12}{65}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_1 = S_1 = 3 + 2 = 5$이고, $n \ge 2$일 때 $a_n = S_n - S_{n-1} = (3n^2 + 2n) - \{3(n-1)^2 + 2(n-1)\} = 6n - 1$이다.
2. $n = 1$일 때도 $6(1) - 1 = 5 = a_1$이므로 모든 자연수 $n$에 대해 $a_n = 6n - 1$이다.
3. 부분분수 분해에 의해 $\frac{1}{(6k-1)(6k+5)} = \frac{1}{6}\left(\frac{1}{6k-1} - \frac{1}{6k+5}\right)$이므로  
$$\sum_{k=1}^{10} \frac{1}{a_k a_{k+1}} = \frac{1}{6}\left(\frac{1}{5} - \frac{1}{65}\right) = \frac{1}{6} \times \frac{12}{65} = \frac{2}{65}$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] **원천→판정: 수열 > 수열의 합 > 여러 가지 수열의 합 > 부분분수·망원급수형 → 수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합**
- 이유: Q11(10): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q11(10): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(10): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「rac{1}{a_k a_{k+1}}$의 값은?」
- method: 정리(NAMED)←solution:「$a_1 = S_1 = 3 + 2 = 5$이고」
- condition: (없음)

**how** Q11(10): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_1 = S_1 = 3 + 2 = 5$이고, $n \ge 2$일 때 $a_n = S_n - S_{n-1} = (3n^2 + 2n) - \{3(n-1)^2 + 2(n-1)\} = 6n - 1$이다.  
$n = 1$일 때도 $6(1) - 1 = 5 = a_1$이므로 모든 자연수 $n$에 대해 $a_n = 6n - 1$이다.  
부분분수 분해에 의해 $\frac{1}{(6k-1)(6k+5)} = \frac{1}{6}\left(\frac{1}{6k-1} - \frac{1}{6k+5}\right)$이므로  
$$\sum_{k=1}^{10} \frac{1}{a_k a_{k+1}} = \frac{1}{6}\left(\frac{1}{5} - \frac{1}{65}\right) = \frac{1}{6} \times \frac{12}{65} = \frac{2}{65}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

삼각형 $ABC$의 외접원의 반지름의 길이가 $6$이고, $(\angle A + \angle B) : (\angle A + \angle C) : (\angle B + \angle C) = 4 : 5 : 3$일 때, 선분 $BC$의 길이는?

**보기** ① $6$  ② $12$  ③ $6\sqrt{2}$  ④ $6\sqrt{3}$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $A + B = 4t$, $A + C = 5t$, $B + C = 3t$ ($t > 0$)라 하면 세 식을 더하여  
$$2(A + B + C) = 12t \implies 2\pi = 12t \implies t = \frac{\pi}{6}$$  
앞 두 식을 더하고 셋째 식을 빼면 $2A = (4 + 5 - 3)t = 6t \implies A = 3t = \frac{\pi}{2}$이다. (ABC)
2. 외접원 반지름 $R = 6$이므로 사인법칙에 의해 $\overline{BC} = 2R\sin\frac{\pi}{2} = 12$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$의 외접원의 반지름의 길이가 $6$이고」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q12(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q12(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「5 : 3$일 때, 선분 $BC$의 길이는?」
- method: 정리(NAMED)←solution:「$A + B = 4t$, $A + C = 5t」
- condition: (없음)

**how** Q12(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A + B = 4t$, $A + C = 5t$, $B + C = 3t$ ($t > 0$)라 하면 세 식을 더하여  
$$2(A + B + C) = 12t \implies 2\pi = 12t \implies t = \frac{\pi}{6}$$  
앞 두 식을 더하고 셋째 식을 빼면 $2A = (4 + 5 - 3)t = 6t \implies A = 3t = \frac{\pi}{2}$이다.  
외접원 반지름 $R = 6$이므로 사인법칙에 의해 $\overline{BC} = 2R\sin\frac{\pi}{2} = 12$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.5점


**발문**

삼각형 $ABC$의 넓이가 $24\sqrt{6}$이고 $\sin A : \sin B : \sin C = 5 : 6 : 7$일 때, 삼각형 $ABC$의 둘레의 길이는?

**보기** ① $18$  ② $24$  ③ $27$  ④ $30$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 사인법칙에 의해 $a : b : c = 5 : 6 : 7$이므로 $a = 5t, b = 6t, c = 7t$ ($t > 0$)라 하자. (ABC)
2. 코사인법칙으로 $\cos C$를 구하면  
$$\cos C = \frac{(5t)^2 + (6t)^2 - (7t)^2}{2(5t)(6t)} = \frac{25 + 36 - 49}{60} = \frac{12}{60} = \frac{1}{5}$$  
$0 < C < \pi$이므로 $\sin C = \sqrt{1 - \frac{1}{25}} = \frac{2\sqrt{6}}{5}$이다.
3. 넓이 조건에서 $S = \frac{1}{2}(5t)(6t) \cdot \frac{2\sqrt{6}}{5} = 6\sqrt{6}t^2 = 24\sqrt{6} \implies t^2 = 4 \implies t = 2$이다.
4. 따라서 둘레의 길이는 $(5 + 6 + 7) \times 2 = 36$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$의 넓이가 $24\sqrt{6}$이고 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q13(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q13(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$일 때, 삼각형 $ABC$의 둘레의 길이는?」
- method: 정리(NAMED)←solution:「사인법칙에 의해 $a : b : c = 5 :」
- condition: (없음)

**how** Q13(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사인법칙에 의해 $a : b : c = 5 : 6 : 7$이므로 $a = 5t, b = 6t, c = 7t$ ($t > 0$)라 하자.  
코사인법칙으로 $\cos C$를 구하면  
$$\cos C = \frac{(5t)^2 + (6t)^2 - (7t)^2}{2(5t)(6t)} = \frac{25 + 36 - 49}{60} = \frac{12}{60} = \frac{1}{5}$$  
$0 < C < \pi$이므로 $\sin C = \sqrt{1 - \frac{1}{25}} = \frac{2\sqrt{6}}{5}$이다.  
넓이 조건에서 $S = \frac{1}{2}(5t)(6t) \cdot \frac{2\sqrt{6}}{5} = 6\sqrt{6}t^2 = 24\sqrt{6} \implies t^2 = 4 \implies t = 2$이다.  
따라서 둘레의 길이는 $(5 + 6 + 7) \times 2 = 36$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 함수 $y = 3\sqrt{x}$, $y = \sqrt{x}$의 그래프와 직선 $x = k$ ($k > 0$)가 만나는 점을 각각 $A, B$라 하고, 직선 $x = k$가 $x$축과 만나는 점을 $C$라 하자. $\overline{BC}, \overline{OC}, \overline{AC}$가 이 순서대로 등비수열을 이룰 때, 양수 $k$의 값은? (단, $O$는 원점이다.)

**보기** ① $3$  ② $2$  ③ $\frac{5}{2}$  ④ $\frac{7}{2}$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $A(k, 3\sqrt{k})$, $B(k, \sqrt{k})$, $C(k, 0)$이므로 $\overline{BC} = \sqrt{k}$, $\overline{OC} = k$, $\overline{AC} = 3\sqrt{k}$이다.
2. 세 길이가 이 순서대로 등비수열을 이루므로  
$$\overline{OC}^2 = \overline{BC} \cdot \overline{AC} \implies k^2 = \sqrt{k} \cdot 3\sqrt{k} = 3k$$  
$k > 0$이므로 $k = 3$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 함수 $y = 3\sqrt{x}$, $y = \sq」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q14(BC): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q14(BC): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(BC): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$k$의 값은? (단, $O$는 원점이다.)」
- method: 정리(NAMED)←solution:「$A(k, 3\sqrt{k})$, $B(k,」
- condition: (없음)

**how** Q14(BC): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A(k, 3\sqrt{k})$, $B(k, \sqrt{k})$, $C(k, 0)$이므로 $\overline{BC} = \sqrt{k}$, $\overline{OC} = k$, $\overline{AC} = 3\sqrt{k}$이다.  
세 길이가 이 순서대로 등비수열을 이루므로  
$$\overline{OC}^2 = \overline{BC} \cdot \overline{AC} \implies k^2 = \sqrt{k} \cdot 3\sqrt{k} = 3k$$  
$k > 0$이므로 $k = 3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 5점


**발문**

수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, 모든 자연수 $n$에 대하여 $2S_n = (n + 2)a_{n+1}$이 성립한다. $a_1 = 6$일 때, $a_{10}$의 값은?

**보기** ① $8$  ② $9$  ③ $10$  ④ $12$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $n = 1$일 때 $2S_1 = 3a_2 \implies 12 = 3a_2 \implies a_2 = 4$이다.
2. $n \ge 2$일 때 $2S_n - 2S_{n-1} = (n + 2)a_{n+1} - (n + 1)a_n$이므로  
$$2a_n = (n + 2)a_{n+1} - (n + 1)a_n \implies (n + 3)a_n = (n + 2)a_{n+1} \implies a_{n+1} = \frac{n + 3}{n + 2}a_n$$  
$n = 2$부터 $9$까지 변변 곱하여 약분하면  
$$a_{10} = a_2 \cdot \frac{5}{4} \cdot \frac{6}{5} \cdots \frac{12}{11} = 4 \cdot \frac{12}{4} = 12$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 관계 추론 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q15(10): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_RECURSIVE_SEQUENCE / TPL=TPL_H22A_08_RECURSIVE_SEQUENCE_129 (원천과 같음)
- 이유: Q15(10): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(10): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「_1 = 6$일 때, $a_{10}$의 값은?」
- method: 정리(NAMED)←solution:「$n = 1$일 때 $2S_1 = 3a_2 \」
- condition: (없음)

**how** Q15(10): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$n = 1$일 때 $2S_1 = 3a_2 \implies 12 = 3a_2 \implies a_2 = 4$이다.  
$n \ge 2$일 때 $2S_n - 2S_{n-1} = (n + 2)a_{n+1} - (n + 1)a_n$이므로  
$$2a_n = (n + 2)a_{n+1} - (n + 1)a_n \implies (n + 3)a_n = (n + 2)a_{n+1} \implies a_{n+1} = \frac{n + 3}{n + 2}a_n$$  
$n = 2$부터 $9$까지 변변 곱하여 약분하면  
$$a_{10} = a_2 \cdot \frac{5}{4} \cdot \frac{6}{5} \cdots \frac{12}{11} = 4 \cdot \frac{12}{4} = 12$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점


**발문**

$\overline{AB} = 3\sqrt{34}$, $\overline{AC} = \overline{BC} = 17$인 삼각형 $ABC$에 대하여 선분 $BC$를 지름으로 하는 반원이 선분 $AC$와 만나는 점 중 $C$가 아닌 점을 $D$라 하자. 반원의 호 $CD$ (중심각이 $\pi$보다 작은 호) 위의 점 $E$를 $\overline{DE} = \overline{CE}$가 되도록 잡을 때, 삼각형 $EDC$의 넓이는?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABC$에서 코사인법칙에 의해  
$$\cos C = \frac{17^2 + 17^2 - (3\sqrt{34})^2}{2 \cdot 17 \cdot 17} = \frac{578 - 306}{578} = \frac{272}{578} = \frac{8}{17}$$  
$BC$가 지름이므로 $\angle BDC = 90^\circ$이고 직각삼각형 $BCD$에서 $\overline{CD} = \overline{BC}\cos C = 17 \cdot \frac{8}{17} = 8$이다.
2. 반원의 중심을 $O$, 현 $CD$의 중점을 $H$라 하면 $\overline{OC} = \frac{17}{2}$, $\overline{HC} = 4$이고 $OH \perp CD$이므로  
$$\overline{OH} = \sqrt{\left(\frac{17}{2}\right)^2 - 4^2} = \sqrt{\frac{289 - 64}{4}} = \frac{15}{2}$$  
$\overline{DE} = \overline{CE}$이므로 $E$는 $CD$의 수직이등분선과 호 $CD$의 교점이며 높이 $\overline{EH} = \overline{OE} - \overline{OH} = \frac{17}{2} - \frac{15}{2} = 1$이다.
3. 따라서 삼각형 $EDC$의 넓이는 $\frac{1}{2} \times 8 \times 1 = 4$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = 3\sqrt{34}$, 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q16(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q16(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「되도록 잡을 때, 삼각형 $EDC$의 넓이는?」
- method: 정리(NAMED)←solution:「$\triangle ABC$에서 코사인법칙에」
- condition: (없음)

**how** Q16(AB): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$에서 코사인법칙에 의해  
$$\cos C = \frac{17^2 + 17^2 - (3\sqrt{34})^2}{2 \cdot 17 \cdot 17} = \frac{578 - 306}{578} = \frac{272}{578} = \frac{8}{17}$$  
$BC$가 지름이므로 $\angle BDC = 90^\circ$이고 직각삼각형 $BCD$에서 $\overline{CD} = \overline{BC}\cos C = 17 \cdot \frac{8}{17} = 8$이다.  
반원의 중심을 $O$, 현 $CD$의 중점을 $H$라 하면 $\overline{OC} = \frac{17}{2}$, $\overline{HC} = 4$이고 $OH \perp CD$이므로  
$$\overline{OH} = \sqrt{\left(\frac{17}{2}\right)^2 - 4^2} = \sqrt{\frac{289 - 64}{4}} = \frac{15}{2}$$  
$\overline{DE} = \overline{CE}$이므로 $E$는 $CD$의 수직이등분선과 호 $CD$의 교점이며 높이 $\overline{EH} = \overline{OE} - \overline{OH} = \frac{17}{2} - \frac{15}{2} = 1$이다.  
따라서 삼각형 $EDC$의 넓이는 $\frac{1}{2} \times 8 \times 1 = 4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점


**발문**

점 $O$가 중심이고 반지름의 길이가 $3$인 원이 있다. 원 밖의 한 점 $P$에서 원에 그은 두 접선의 접점을 각각 $A, B$라 하자. $\overline{AP} = 5$일 때, $\overline{AB} = \frac{a}{b}\sqrt{34}$이다. $b - a$의 값은? (단, $a$와 $b$는 서로소인 자연수이다.)

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $OA \perp AP$이므로 직각삼각형 $OAP$에서 $\overline{OP} = \sqrt{3^2 + 5^2} = \sqrt{34}$이다.
2. 현 $AB$와 선분 $OP$의 교점을 $M$이라 하면 $OP \perp AB$이고 $\overline{AM} = \overline{BM}$이다.
3. 직각삼각형 $OAP$의 넓이를 두 가지로 표현하면 $\frac{1}{2} \cdot 3 \cdot 5 = \frac{1}{2} \cdot \sqrt{34} \cdot \overline{AM}$이므로 $\overline{AM} = \frac{15}{\sqrt{34}}$이다.
4. 따라서 $\overline{AB} = 2\overline{AM} = \frac{30}{\sqrt{34}} = \frac{15\sqrt{34}}{17}$이므로 $a = 15$, $b = 17$이고 $b - a = 2$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 중심이고 반지름의 길이가 $3$인 원이 있」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 삼각형의 넓이 > 복합도형 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q17(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_TRIANGLE_AREA / TPL=TPL_H22A_05_TRIANGLE_AREA_113 (원천과 같음)
- 이유: Q17(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「단, $a$와 $b$는 서로소인 자연수이다.)」
- method: 정리(NAMED)←solution:「$OA \perp AP$이므로 직각삼각형 $O」
- condition: (없음)

**how** Q17(AP): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$OA \perp AP$이므로 직각삼각형 $OAP$에서 $\overline{OP} = \sqrt{3^2 + 5^2} = \sqrt{34}$이다.  
현 $AB$와 선분 $OP$의 교점을 $M$이라 하면 $OP \perp AB$이고 $\overline{AM} = \overline{BM}$이다.  
직각삼각형 $OAP$의 넓이를 두 가지로 표현하면 $\frac{1}{2} \cdot 3 \cdot 5 = \frac{1}{2} \cdot \sqrt{34} \cdot \overline{AM}$이므로 $\overline{AM} = \frac{15}{\sqrt{34}}$이다.  
따라서 $\overline{AB} = 2\overline{AM} = \frac{30}{\sqrt{34}} = \frac{15\sqrt{34}}{17}$이므로 $a = 15$, $b = 17$이고 $b - a = 2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5.1점


**발문**

모든 항이 자연수인 수열 $\{a_n\}$에 대하여 다음 조건을 모두 만족시키는 $a_1$의 값의 합은?

(가) $a_5 = 6$  
(나) $1 < a_1 < 20$  
(다) 모든 자연수 $n$에 대하여 $a_{n+1} = \begin{cases} a_n + 1 & (a_n\text{이 }3\text{의 배수가 아닌 경우}) \\ \frac{1}{3}a_n + 2 & (a_n\text{이 }3\text{의 배수인 경우}) \end{cases}$가 성립한다.

**보기** ① $35$  ② $37$  ③ $42$  ④ $47$  ⑤ $54$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_{n+1} = z$로부터 앞 항 $a_n = y$를 역산하는 규칙은 다음과 같다.
2. - $y = z - 1$ (단, $y$는 $3$의 배수가 아닌 자연수)  
- $y = 3(z - 2)$ (단, $z \ge 3$이면 $y$는 양의 $3$의 배수)

$a_5 = 6$부터 차례로 역추적하면:  
- $a_4 \in \{5, 12\}$  
- $a_4 = 5 \implies a_3 \in \{4, 9\}$, $a_4 = 12 \implies a_3 \in \{11, 30\}$이므로 $a_3 \in \{4, 9, 11, 30\}$  
- $a_3 = 4 \implies a_2 \in \{6\}$ ($3$은 $3$의 배수라 제외), $a_3 = 9 \implies a_2 \in \{8, 21\}$, $a_3 = 11 \implies a_2 \in \{10, 27\}$, $a_3 = 30 \implies a_2 \in \{29, 84\}$  
- $a_2 = 6 \implies a_1 \in \{5, 12\}$; $a_2 = 8 \implies a_1 \in \{7, 18\}$; $a_2 = 21 \implies \{20, 57\}$; $a_2 = 10 \implies \{24\}$ ($9$ 제외); $a_2 \ge 27 \implies a_1 \ge 26$  
이 중 $1 < a_1 < 20$을 만족하는 값은 $5, 7, 12, 18$이므로 합은 $5 + 7 + 12 + 18 = 42$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「모든 항이 자연수인 수열 $\{a_n\}$에 대하여 다」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 관계 추론 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q18(20): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_RECURSIVE_SEQUENCE / TPL=TPL_H22A_08_RECURSIVE_SEQUENCE_129 (원천과 같음)
- 이유: Q18(20): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(20): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「경우}) \end{cases}$가 성립한다.」
- method: 정리(NAMED)←solution:「$a_{n+1} = z$로부터 앞 항 $a_n」
- condition: (없음)

**how** Q18(20): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_{n+1} = z$로부터 앞 항 $a_n = y$를 역산하는 규칙은 다음과 같다.  
- $y = z - 1$ (단, $y$는 $3$의 배수가 아닌 자연수)  
- $y = 3(z - 2)$ (단, $z \ge 3$이면 $y$는 양의 $3$의 배수)

$a_5 = 6$부터 차례로 역추적하면:  
- $a_4 \in \{5, 12\}$  
- $a_4 = 5 \implies a_3 \in \{4, 9\}$, $a_4 = 12 \implies a_3 \in \{11, 30\}$이므로 $a_3 \in \{4, 9, 11, 30\}$  
- $a_3 = 4 \implies a_2 \in \{6\}$ ($3$은 $3$의 배수라 제외), $a_3 = 9 \implies a_2 \in \{8, 21\}$, $a_3 = 11 \implies a_2 \in \{10, 27\}$, $a_3 = 30 \implies a_2 \in \{29, 84\}$  
- $a_2 = 6 \implies a_1 \in \{5, 12\}$; $a_2 = 8 \implies a_1 \in \{7, 18\}$; $a_2 = 21 \implies \{20, 57\}$; $a_2 = 10 \implies \{24\}$ ($9$ 제외); $a_2 \ge 27 \implies a_1 \ge 26$  
이 중 $1 < a_1 < 20$을 만족하는 값은 $5, 7, 12, 18$이므로 합은 $5 + 7 + 12 + 18 = 42$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 서술형 6점


**발문**

[서술형 문제 1] 두 직선 $y = 3x$와 $y = -2x$가 이루는 각의 크기를 $\theta$ ($90^\circ < \theta < 180^\circ$)라 할 때, $\theta$의 값을 풀이과정과 함께 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $135^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원점 $O(0, 0)$과 두 직선 위의 점 $P(1, 3)$, $Q(1, -2)$를 잡으면 $\angle POQ = \theta$이다.
2. 두 점 사이의 거리 공식에 의해  
$$\overline{OP} = \sqrt{1^2 + 3^2} = \sqrt{10}, \qquad \overline{OQ} = \sqrt{1^2 + (-2)^2} = \sqrt{5}, \qquad \overline{PQ} = 3 - (-2) = 5$$  
삼각형 $OPQ$에 코사인법칙을 적용하면  
$$\cos\theta = \frac{10 + 5 - 25}{2\sqrt{10}\sqrt{5}} = \frac{-10}{10\sqrt{2}} = -\frac{\sqrt{2}}{2}$$  
$90^\circ < \theta < 180^\circ$이므로 $\theta = 135^\circ$이다.
- 작성자 답: $135^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 문제 1] 두 직선 $y = 3x$와 $y =」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q19(90): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q19(90): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(90): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「heta$의 값을 풀이과정과 함께 서술하시오.」
- method: 정리(NAMED)←solution:「원점 $O(0, 0)$과 두 직선 위의 점 $」
- condition: (없음)

**how** Q19(90): 발문과 해설의 풀이 과정을 점검하여 정답 $135^\circ$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원점 $O(0, 0)$과 두 직선 위의 점 $P(1, 3)$, $Q(1, -2)$를 잡으면 $\angle POQ = \theta$이다.  
두 점 사이의 거리 공식에 의해  
$$\overline{OP} = \sqrt{1^2 + 3^2} = \sqrt{10}, \qquad \overline{OQ} = \sqrt{1^2 + (-2)^2} = \sqrt{5}, \qquad \overline{PQ} = 3 - (-2) = 5$$  
삼각형 $OPQ$에 코사인법칙을 적용하면  
$$\cos\theta = \frac{10 + 5 - 25}{2\sqrt{10}\sqrt{5}} = \frac{-10}{10\sqrt{2}} = -\frac{\sqrt{2}}{2}$$  
$90^\circ < \theta < 180^\circ$이므로 $\theta = 135^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 7점


**발문**

[서술형 문제 2] 등비수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n = 2 \times 3^{n+1} + k$이고, 제$5$항 $a_5$의 값을 $l$이라 할 때, $k + l$의 값을 풀이과정과 함께 서술하시오. (단, $k$는 상수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $966$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_1 = S_1 = 2 \cdot 3^2 + k = 18 + k$이다.
2. $a_2 = S_2 - S_1 = (54 + k) - (18 + k) = 36$, $a_3 = S_3 - S_2 = (162 + k) - (54 + k) = 108$이다.
3. 등비수열의 공비 $r = \frac{a_3}{a_2} = \frac{108}{36} = 3$이므로 $a_2 = 3a_1$에서  
$$36 = 3(18 + k) \implies 12 = 18 + k \implies k = -6$$  
따라서 $a_1 = 12$이고 $l = a_5 = 12 \times 3^4 = 12 \times 81 = 972$이므로 $k + l = -6 + 972 = 966$이다.
- 작성자 답: $966$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_APPLICATION(수열의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 문제 2] 등비수열 $\{a_n\}$의 첫째항」
**RPM** H2-M1-RPM-121 [수열 > 등차수열과 등비수열 > 수열의 활용 > 조건으로 수열 결정] (원천과 같음)
- 이유: Q20(18): 수열의 활용 단원의 RPM H2-M1-RPM-121 유형에 해당한다.
**유형** PT=PT_H22A_06_SEQUENCE_APPLICATION / TPL=TPL_H22A_06_SEQUENCE_APPLICATION_121 (원천과 같음)
- 이유: Q20(18): 수열의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(18): 수열의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「함께 서술하시오. (단, $k$는 상수이다.)」
- method: 정리(NAMED)←solution:「$a_1 = S_1 = 2 \cdot 3^2」
- condition: (없음)

**how** Q20(18): 발문과 해설의 풀이 과정을 점검하여 정답 $966$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_1 = S_1 = 2 \cdot 3^2 + k = 18 + k$이다.  
$a_2 = S_2 - S_1 = (54 + k) - (18 + k) = 36$, $a_3 = S_3 - S_2 = (162 + k) - (54 + k) = 108$이다.  
등비수열의 공비 $r = \frac{a_3}{a_2} = \frac{108}{36} = 3$이므로 $a_2 = 3a_1$에서  
$$36 = 3(18 + k) \implies 12 = 18 + k \implies k = -6$$  
따라서 $a_1 = 12$이고 $l = a_5 = 12 \times 3^4 = 12 \times 81 = 972$이므로 $k + l = -6 + 972 = 966$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점


**발문**

[서술형 문제 3] 수열 $\{a_n\}$을 $a_n = 5^n - 1$ ($n = 1, 2, 3, \cdots$)로 정의하자. 모든 자연수 $n$에 대하여 $a_n$이 $4$의 배수임을 수학적 귀납법으로 증명하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 모든 자연수 $n$에 대하여 $5^n - 1$은 $4$의 배수이다.   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 명제 $P(n)$을 ‘$5^n - 1$은 $4$의 배수이다’라 하자. (3)
2. (ⅰ) $n = 1$일 때, $a_1 = 5^1 - 1 = 4$이므로 $4$의 배수이다.
3. 따라서 $P(1)$은 성립한다.
4. (ⅱ) $n = k$일 때 $P(k)$가 성립한다고 가정하면, 어떤 정수 $m$에 대하여 $5^k - 1 = 4m$이다.
5. $n = k + 1$일 때,  
$$a_{k+1} = 5^{k+1} - 1 = 5 \cdot 5^k - 1 = 5(5^k - 1) + 4 = 5(4m) + 4 = 4(5m + 1)$$  
$5m + 1$은 정수이므로 $a_{k+1}$은 $4$의 배수이고 $P(k + 1)$도 성립한다.
6. (ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $a_n = 5^n - 1$은 $4$의 배수이다.
- 작성자 답: 모든 자연수 $n$에 대하여 $5^n - 1$은 $4$의 배수이다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 문제 3] 수열 $\{a_n\}$을 $a_n 」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수학적 귀납법 > 부등식·나눗셈 증명 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q21(3): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_MATHEMATICAL_INDUCTION / TPL=TPL_H22A_08_MATHEMATICAL_INDUCTION_131 (원천과 같음)
- 이유: Q21(3): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(3): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「4$의 배수임을 수학적 귀납법으로 증명하시오.」
- method: 정리(NAMED)←solution:「명제 $P(n)$을 ‘$5^n - 1$은 $4」
- condition: (없음)

**how** Q21(3): 발문과 해설의 풀이 과정을 점검하여 정답 모든 자연수 $n$에 대하여 $5^n - 1$은 $4$의 배수이다.를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

명제 $P(n)$을 ‘$5^n - 1$은 $4$의 배수이다’라 하자.  
(ⅰ) $n = 1$일 때, $a_1 = 5^1 - 1 = 4$이므로 $4$의 배수이다. 따라서 $P(1)$은 성립한다.

(ⅱ) $n = k$일 때 $P(k)$가 성립한다고 가정하면, 어떤 정수 $m$에 대하여 $5^k - 1 = 4m$이다.  
$n = k + 1$일 때,  
$$a_{k+1} = 5^{k+1} - 1 = 5 \cdot 5^k - 1 = 5(5^k - 1) + 4 = 5(4m) + 4 = 4(5m + 1)$$  
$5m + 1$은 정수이므로 $a_{k+1}$은 $4$의 배수이고 $P(k + 1)$도 성립한다.

(ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $a_n = 5^n - 1$은 $4$의 배수이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
