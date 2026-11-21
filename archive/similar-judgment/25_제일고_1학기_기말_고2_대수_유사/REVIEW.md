# 검수 묶음 — 25_제일고_1학기_기말_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 23개 / 검사 PASS 20, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 5, 2단계 7, 3단계 9, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q8**: 검사 코드: CHOICE_ORDER
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q13**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.5점


**발문**

함수 $y = 3\cos 4x$의 주기는?

**보기** ① $\frac{\pi}{4}$  ② $\frac{\pi}{2}$  ③ $\pi$  ④ $2\pi$  ⑤ $4\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q1 문제의 조건(bx)에 맞추어 식을 세운다.
2. 함수 $y = a\cos bx$의 주기는 $\frac{2\pi}{|b|}$이므로  
$$T = \frac{2\pi}{|4|} = \frac{\pi}{2}$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y = 3\cos 4x$의 주기는?」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q1(bx): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_GRAPH_TRANSFORM / TPL=TPL_H22A_04_TRIG_GRAPH_TRANSFORM_105 (원천과 같음)
- 이유: Q1(bx): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(bx): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「함수 $y = 3\cos 4x$의 주기는?」
- method: 정리(NAMED)←solution:「함수 $y = a\cos bx$의 주기는 $\」
- condition: (없음)

**how** Q1(bx): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = a\cos bx$의 주기는 $\frac{2\pi}{|b|}$이므로  
$$T = \frac{2\pi}{|4|} = \frac{\pi}{2}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.5점


**발문**

함수 $y = \tan\frac{5}{2}x$의 점근선의 방정식은? (단, $n$은 정수이다.)

**보기** ① $x = \frac{n\pi}{5}$  ② $x = \frac{2n\pi}{5}$  ③ $x = n\pi + \frac{\pi}{5}$  ④ $x = \frac{(2n+1)\pi}{5}$  ⑤ $x = n\pi + \frac{2\pi}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q2 문제의 조건(y)에 맞추어 식을 세운다.
2. $y = \tan u$의 점근선의 방정식은 $u = \frac{\pi}{2} + n\pi$ ($n$은 정수)이므로  
$$\frac{5}{2}x = \frac{\pi}{2} + n\pi$$  
양변에 $\frac{2}{5}$를 곱하면  
$$x = \frac{\pi}{5} + \frac{2n\pi}{5} = \frac{(2n+1)\pi}{5}$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y = \tan\frac{5}{2}x$의 점근선」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > tan → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q2(y): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT (원천과 같음)
- 이유: Q2(y): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(y): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「근선의 방정식은? (단, $n$은 정수이다.)」
- method: 정리(NAMED)←solution:「$y = \tan u$의 점근선의 방정식은 $」
- condition: (없음)

**how** Q2(y): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y = \tan u$의 점근선의 방정식은 $u = \frac{\pi}{2} + n\pi$ ($n$은 정수)이므로  
$$\frac{5}{2}x = \frac{\pi}{2} + n\pi$$  
양변에 $\frac{2}{5}$를 곱하면  
$$x = \frac{\pi}{5} + \frac{2n\pi}{5} = \frac{(2n+1)\pi}{5}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

삼각형 $ABC$에서 $\overline{AC} = 8\sqrt{2}$, $\overline{BC} = a$, $\angle A = 60^\circ$, $\angle B = 45^\circ$이고 외접원의 반지름의 길이가 $R$일 때, $a + R$의 값은?

**보기** ① $8+8\sqrt{3}$  ② $8+8\sqrt{2}$  ③ $16$  ④ $8+8\sqrt{5}$  ⑤ $8+8\sqrt{6}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q3 문제의 조건(ABC)에 맞추어 식을 세운다.
2. 사인법칙 $\frac{\overline{AC}}{\sin B} = 2R$에 $\overline{AC} = 8\sqrt{2}$, $B = 45^\circ$를 대입하면  
$$2R = \frac{8\sqrt{2}}{\sin 45^\circ} = \frac{8\sqrt{2}}{\frac{\sqrt{2}}{2}} = 16 \implies R = 8$$  
또한 $\frac{a}{\sin A} = 2R$이므로  
$$a = 16\sin 60^\circ = 16 \times \frac{\sqrt{3}}{2} = 8\sqrt{3}$$  
따라서 $a + R = 8 + 8\sqrt{3}$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에서 $\overline{AC} = 8」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] (원천과 같음)
- 이유: Q3(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q3(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「길이가 $R$일 때, $a + R$의 값은?」
- method: 정리(NAMED)←solution:「사인법칙 $\frac{\overline{AC}」
- condition: (없음)

**how** Q3(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사인법칙 $\frac{\overline{AC}}{\sin B} = 2R$에 $\overline{AC} = 8\sqrt{2}$, $B = 45^\circ$를 대입하면  
$$2R = \frac{8\sqrt{2}}{\sin 45^\circ} = \frac{8\sqrt{2}}{\frac{\sqrt{2}}{2}} = 16 \implies R = 8$$  
또한 $\frac{a}{\sin A} = 2R$이므로  
$$a = 16\sin 60^\circ = 16 \times \frac{\sqrt{3}}{2} = 8\sqrt{3}$$  
따라서 $a + R = 8 + 8\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.5점


**발문**

등차수열 $\{a_n\}$에 대하여 $a_1 = 3$, $a_{12} = 27$일 때, 첫째항부터 제$12$항까지의 합 $S_{12}$의 값은?

**보기** ① $150$  ② $160$  ③ $168$  ④ $174$  ⑤ $180$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q4 문제의 조건(12)에 맞추어 식을 세운다.
2. 등차수열의 합 공식 $S_n = \frac{n(a_1 + a_n)}{2}$에 $n = 12$, $a_1 = 3$, $a_{12} = 27$을 대입하면  
$$S_{12} = \frac{12(3 + 27)}{2} = 6 \times 30 = 180$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「등차수열 $\{a_n\}$에 대하여 $a_1 = 3$,」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q4(12): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q4(12): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(12): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「제$12$항까지의 합 $S_{12}$의 값은?」
- method: 정리(NAMED)←solution:「등차수열의 합 공식 $S_n = \frac{n」
- condition: (없음)

**how** Q4(12): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등차수열의 합 공식 $S_n = \frac{n(a_1 + a_n)}{2}$에 $n = 12$, $a_1 = 3$, $a_{12} = 27$을 대입하면  
$$S_{12} = \frac{12(3 + 27)}{2} = 6 \times 30 = 180$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점


**발문**

세 수 $3$, $x$, $3x - 6$이 이 순서대로 등비수열을 이룰 때, 가능한 모든 실수 $x$의 값의 합은?

**보기** ① $6$  ② $7$  ③ $9$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q5 문제의 조건(10)에 맞추어 식을 세운다.
2. 세 수 $3$, $x$, $3x - 6$이 이 순서대로 등비수열을 이루므로 등비중항의 성질에 의하여  
$$x^2 = 3(3x - 6) \implies x^2 - 9x + 18 = 0$$  
$$(x - 3)(x - 6) = 0 \implies x = 3 \text{ 또는 } x = 6$$  
따라서 가능한 모든 $x$의 값의 합은 $3 + 6 = 9$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 수 $3$, $x$, $3x - 6$이 이 순서대로」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q5(10): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q5(10): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(10): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「때, 가능한 모든 실수 $x$의 값의 합은?」
- method: 정리(NAMED)←solution:「세 수 $3$, $x$, $3x - 6$이 이」
- condition: (없음)

**how** Q5(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 수 $3$, $x$, $3x - 6$이 이 순서대로 등비수열을 이루므로 등비중항의 성질에 의하여  
$$x^2 = 3(3x - 6) \implies x^2 - 9x + 18 = 0$$  
$$(x - 3)(x - 6) = 0 \implies x = 3 \text{ 또는 } x = 6$$  
따라서 가능한 모든 $x$의 값의 합은 $3 + 6 = 9$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

두 수열 $\{a_n\}$, $\{b_n\}$에 대하여 $\sum_{k=1}^{10} a_k = 9$, $\sum_{k=1}^{10} (3a_k - b_k) = 15$일 때, $\sum_{k=1}^{10} b_k$의 값은?

**보기** ① $8$  ② $12$  ③ $15$  ④ $18$  ⑤ $21$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q6 문제의 조건(10)에 맞추어 식을 세운다.
2. $\sum$의 성질을 이용하여 식을 분리하면  
$$\sum_{k=1}^{10} (3a_k - b_k) = 3\sum_{k=1}^{10} a_k - \sum_{k=1}^{10} b_k = 15$$  
$\sum_{k=1}^{10} a_k = 9$를 대입하면  
$$3 \times 9 - \sum_{k=1}^{10} b_k = 15 \implies \sum_{k=1}^{10} b_k = 27 - 15 = 12$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 수열 $\{a_n\}$, $\{b_n\}$에 대하여」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] **원천→판정: 수열 > 수열의 합 > 합의 기호 Σ > 성질 → 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산**
- 이유: Q6(10): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q6(10): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(10): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\sum_{k=1}^{10} b_k$의 값은?」
- method: 정리(NAMED)←solution:「$\sum$의 성질을 이용하여 식을 분리하면」
- condition: (없음)

**how** Q6(10): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sum$의 성질을 이용하여 식을 분리하면  
$$\sum_{k=1}^{10} (3a_k - b_k) = 3\sum_{k=1}^{10} a_k - \sum_{k=1}^{10} b_k = 15$$  
$\sum_{k=1}^{10} a_k = 9$를 대입하면  
$$3 \times 9 - \sum_{k=1}^{10} b_k = 15 \implies \sum_{k=1}^{10} b_k = 27 - 15 = 12$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

$\sin\theta = \frac{\sqrt{10}}{10}$ ($0 < \theta < \frac{\pi}{2}$)일 때, $\frac{\cos\theta}{\sin(\pi - \theta)} + \frac{\sin\left(\frac{\pi}{2} + \theta\right)}{\cos\left(\frac{\pi}{2} - \theta\right)}$의 값은?

**보기** ① $-6$  ② $-\frac{1}{3}$  ③ $\frac{1}{3}$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q7 문제의 조건(10)에 맞추어 식을 세운다.
2. 삼각함수의 각 변환 성질에 의하여  
$$\sin(\pi - \theta) = \sin\theta, \quad \sin\left(\frac{\pi}{2} + \theta\right) = \cos\theta, \quad \cos\left(\frac{\pi}{2} - \theta\right) = \sin\theta$$  
이므로 주어진 식은  
$$\frac{\cos\theta}{\sin\theta} + \frac{\cos\theta}{\sin\theta} = 2\frac{\cos\theta}{\sin\theta}$$  
한편 $0 < \theta < \frac{\pi}{2}$에서 $\cos\theta > 0$이므로  
$$\cos\theta = \sqrt{1 - \sin^2\theta} = \sqrt{1 - \frac{10}{100}} = \frac{3\sqrt{10}}{10}$$  
따라서 구하는 값은 $2 \times \frac{\frac{3\sqrt{10}}{10}}{\frac{\sqrt{10}}{10}} = 2 \times 3 = 6$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sin\theta = \frac{\sqrt{10}}」
**RPM** H2-M1-RPM-095 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정: 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계 → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: Q7(10): 삼각함수의 기본 단원의 RPM H2-M1-RPM-095 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_099 (원천과 같음)
- 이유: Q7(10): 삼각함수의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(10): 삼각함수의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「2} - \theta\right)}$의 값은?」
- method: 정리(NAMED)←solution:「삼각함수의 각 변환 성질에 의하여  
$$\s」
- condition: (없음)

**how** Q7(10): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각함수의 각 변환 성질에 의하여  
$$\sin(\pi - \theta) = \sin\theta, \quad \sin\left(\frac{\pi}{2} + \theta\right) = \cos\theta, \quad \cos\left(\frac{\pi}{2} - \theta\right) = \sin\theta$$  
이므로 주어진 식은  
$$\frac{\cos\theta}{\sin\theta} + \frac{\cos\theta}{\sin\theta} = 2\frac{\cos\theta}{\sin\theta}$$  
한편 $0 < \theta < \frac{\pi}{2}$에서 $\cos\theta > 0$이므로  
$$\cos\theta = \sqrt{1 - \sin^2\theta} = \sqrt{1 - \frac{10}{100}} = \frac{3\sqrt{10}}{10}$$  
따라서 구하는 값은 $2 \times \frac{\frac{3\sqrt{10}}{10}}{\frac{\sqrt{10}}{10}} = 2 \times 3 = 6$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

넓이가 $96$인 삼각형 $ABC$에서 $\sin A : \sin B : \sin C = 3 : 4 : 5$일 때, 삼각형 $ABC$의 둘레의 길이는?

**보기** ① $48$  ② $36$  ③ $40$  ④ $54$  ⑤ $60$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 사인법칙에 의하여 세 변의 길이의 비는 $a : b : c = \sin A : \sin B : \sin C = 3 : 4 : 5$이다.
2. $a = 3k$, $b = 4k$, $c = 5k$ ($k > 0$)라 하면 $(3k)^2 + (4k)^2 = (5k)^2$이므로 $\angle C = 90^\circ$인 직각삼각형이다.
3. 넓이가 $96$이므로  
$$\frac{1}{2} \times 3k \times 4k = 6k^2 = 96 \implies k^2 = 16 \implies k = 4$$  
따라서 둘레의 길이는 $3k + 4k + 5k = 12k = 48$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「넓이가 $96$인 삼각형 $ABC$에서 $\sin A 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q8(96): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q8(96): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(96): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$일 때, 삼각형 $ABC$의 둘레의 길이는?」
- method: 정리(NAMED)←solution:「사인법칙에 의하여 세 변의 길이의 비는 $a」
- condition: (없음)

**how** Q8(96): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사인법칙에 의하여 세 변의 길이의 비는 $a : b : c = \sin A : \sin B : \sin C = 3 : 4 : 5$이다.  
$a = 3k$, $b = 4k$, $c = 5k$ ($k > 0$)라 하면 $(3k)^2 + (4k)^2 = (5k)^2$이므로 $\angle C = 90^\circ$인 직각삼각형이다.  
넓이가 $96$이므로  
$$\frac{1}{2} \times 3k \times 4k = 6k^2 = 96 \implies k^2 = 16 \implies k = 4$$  
따라서 둘레의 길이는 $3k + 4k + 5k = 12k = 48$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

한 관측 지점 $P$에서 두 나무 $A$, $B$까지의 거리와 두 나무를 바라본 각의 크기를 측정하였더니 $\overline{AP} = 5\text{m}$, $\overline{BP} = 8\text{m}$, $\angle APB = 60^\circ$이었다. 두 나무 $A$, $B$ 사이의 거리는?

**보기** ① $5\text{m}$  ② $\sqrt{39}\text{m}$  ③ $2\sqrt{10}\text{m}$  ④ $6\text{m}$  ⑤ $7\text{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q9 문제의 조건(AP)에 맞추어 식을 세운다.
2. 삼각형 $PAB$에서 코사인법칙을 적용하면  
$$\overline{AB}^2 = \overline{AP}^2 + \overline{BP}^2 - 2\overline{AP}\cdot\overline{BP}\cos 60^\circ$$  
$$= 5^2 + 8^2 - 2 \times 5 \times 8 \times \frac{1}{2} = 25 + 64 - 40 = 49$$  
$\overline{AB} > 0$이므로 $\overline{AB} = 7\text{m}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 관측 지점 $P$에서 두 나무 $A$, $B$까지의」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q9(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q9(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(AP): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「다. 두 나무 $A$, $B$ 사이의 거리는?」
- method: 정리(NAMED)←solution:「삼각형 $PAB$에서 코사인법칙을 적용하면」
- condition: (없음)

**how** Q9(AP): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형 $PAB$에서 코사인법칙을 적용하면  
$$\overline{AB}^2 = \overline{AP}^2 + \overline{BP}^2 - 2\overline{AP}\cdot\overline{BP}\cos 60^\circ$$  
$$= 5^2 + 8^2 - 2 \times 5 \times 8 \times \frac{1}{2} = 25 + 64 - 40 = 49$$  
$\overline{AB} > 0$이므로 $\overline{AB} = 7\text{m}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

양수 $a, b, c$에 대하여 함수 $y = a\cos b(x - c) + 2$의 최댓값은 $5$, 최솟값은 $-1$이고, 이웃한 두 최댓값이 나타나는 $x$좌표는 각각 $\frac{\pi}{3}$과 $\frac{7\pi}{3}$이다. $\frac{abc}{\pi}$의 최솟값은?

**보기** ① $\frac{1}{3}$  ② $\frac{1}{2}$  ③ $1$  ④ $2$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a > 0$이므로 최댓값 조건에서 $a + 2 = 5 \implies a = 3$이다.
2. (최솟값 $-3 + 2 = -1$도 일치한다.)  
이웃한 두 최댓값 사이의 간격이 주기 $T$이므로  
$$T = \frac{7\pi}{3} - \frac{\pi}{3} = 2\pi$$  
$b > 0$이므로 $\frac{2\pi}{b} = 2\pi \implies b = 1$이다.
3. 또한 $x = \frac{\pi}{3}$에서 최댓값을 가지므로 어떤 정수 $n$에 대하여  
$$1\left(\frac{\pi}{3} - c\right) = 2n\pi \implies c = \frac{\pi}{3} - 2n\pi$$  
양수 $c$의 최솟값은 $n = 0$일 때 $c = \frac{\pi}{3}$이다.
4. 따라서 $\frac{abc}{\pi}$의 최솟값은 $\frac{3 \times 1 \times \frac{\pi}{3}}{\pi} = 1$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「양수 $a, b, c$에 대하여 함수 $y = a\co」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 평행이동 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q10(abc): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_TRANSFORM / TPL=TPL_FUNCTION_GRAPH_TRANSLATION (원천과 같음)
- 이유: Q10(abc): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(abc): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$\frac{abc}{\pi}$의 최솟값은?」
- method: 정리(NAMED)←solution:「$a > 0$이므로 최댓값 조건에서 $a +」
- condition: (없음)

**how** Q10(abc): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a > 0$이므로 최댓값 조건에서 $a + 2 = 5 \implies a = 3$이다. (최솟값 $-3 + 2 = -1$도 일치한다.)  
이웃한 두 최댓값 사이의 간격이 주기 $T$이므로  
$$T = \frac{7\pi}{3} - \frac{\pi}{3} = 2\pi$$  
$b > 0$이므로 $\frac{2\pi}{b} = 2\pi \implies b = 1$이다.  
또한 $x = \frac{\pi}{3}$에서 최댓값을 가지므로 어떤 정수 $n$에 대하여  
$$1\left(\frac{\pi}{3} - c\right) = 2n\pi \implies c = \frac{\pi}{3} - 2n\pi$$  
양수 $c$의 최솟값은 $n = 0$일 때 $c = \frac{\pi}{3}$이다.  
따라서 $\frac{abc}{\pi}$의 최솟값은 $\frac{3 \times 1 \times \frac{\pi}{3}}{\pi} = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

공차가 $0$이 아닌 등차수열 $\{a_n\}$에 대하여 $a_4 - 2a_{12} = 0$이고 $a_k - 3a_{16} = 0$일 때, 자연수 $k$의 값은?

**보기** ① $6$  ② $8$  ③ $9$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q11 문제의 조건(12)에 맞추어 식을 세운다.
2. 첫째항을 $a_1$, 공차를 $d$ ($d \ne 0$)라 하면  
$$a_4 - 2a_{12} = (a_1 + 3d) - 2(a_1 + 11d) = -a_1 - 19d = 0 \implies a_1 = -19d$$  
이를 $a_k = 3a_{16}$에 대입하면  
$$a_1 + (k - 1)d = 3(a_1 + 15d)$$  
$$-19d + (k - 1)d = 3(-19d + 15d) = -12d$$  
$d \ne 0$이므로 양변을 $d$로 나누면 $k - 20 = -12 \implies k = 8$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「공차가 $0$이 아닌 등차수열 $\{a_n\}$에 대하」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] (원천과 같음)
- 이유: Q11(12): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q11(12): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(12): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「16} = 0$일 때, 자연수 $k$의 값은?」
- method: 정리(NAMED)←solution:「첫째항을 $a_1$, 공차를 $d$ ($d \」
- condition: (없음)

**how** Q11(12): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째항을 $a_1$, 공차를 $d$ ($d \ne 0$)라 하면  
$$a_4 - 2a_{12} = (a_1 + 3d) - 2(a_1 + 11d) = -a_1 - 19d = 0 \implies a_1 = -19d$$  
이를 $a_k = 3a_{16}$에 대입하면  
$$a_1 + (k - 1)d = 3(a_1 + 15d)$$  
$$-19d + (k - 1)d = 3(-19d + 15d) = -12d$$  
$d \ne 0$이므로 양변을 $d$로 나누면 $k - 20 = -12 \implies k = 8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

한 변의 길이가 $1$인 정사각형 모양의 종이가 있다. 첫 번째 시행에서 각 변의 중점을 이어 만든 네 개의 정사각형 중 왼쪽 위의 정사각형을 색칠하고, 두 번째 시행에서는 남은 오른쪽 아래의 정사각형에 같은 방법으로 한 개를 색칠한다. 이와 같은 시행을 반복할 때, $n$번째 시행에서 색칠하는 정사각형의 넓이를 $a_n$이라 하자. 색칠한 정사각형의 넓이의 합 $\sum_{k=1}^{n} a_k$가 처음으로 $\frac{85}{256}$보다 커지는 자연수 $n$의 값은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_1 = \frac{1}{4}$이고 매 시행마다 색칠되는 정사각형의 넓이는 직전의 $\frac{1}{4}$배이므로 $a_n = \left(\frac{1}{4}\right)^n$이다.
2. 따라서 첫째항부터 제$n$항까지의 합은  
$$\sum_{k=1}^{n} a_k = \frac{\frac{1}{4}\left\{1 - \left(\frac{1}{4}\right)^n\right\}}{1 - \frac{1}{4}} = \frac{1}{3}\left(1 - \frac{1}{4^n}\right)$$  
부등식 $\frac{1}{3}\left(1 - \frac{1}{4^n}\right) > \frac{85}{256}$을 풀면  
$$1 - \frac{1}{4^n} > \frac{255}{256} \implies \frac{1}{4^n} < \frac{1}{256} = \frac{1}{4^4}$$  
이므로 $n > 4$이다.
3. 따라서 구하는 자연수 $n$의 최솟값은 $5$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 변의 길이가 $1$인 정사각형 모양의 종이가 있다.」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q12(85): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q12(85): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(85): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「{256}$보다 커지는 자연수 $n$의 값은?」
- method: 정리(NAMED)←solution:「$a_1 = \frac{1}{4}$이고 매 시」
- condition: (없음)

**how** Q12(85): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_1 = \frac{1}{4}$이고 매 시행마다 색칠되는 정사각형의 넓이는 직전의 $\frac{1}{4}$배이므로 $a_n = \left(\frac{1}{4}\right)^n$이다.  
따라서 첫째항부터 제$n$항까지의 합은  
$$\sum_{k=1}^{n} a_k = \frac{\frac{1}{4}\left\{1 - \left(\frac{1}{4}\right)^n\right\}}{1 - \frac{1}{4}} = \frac{1}{3}\left(1 - \frac{1}{4^n}\right)$$  
부등식 $\frac{1}{3}\left(1 - \frac{1}{4^n}\right) > \frac{85}{256}$을 풀면  
$$1 - \frac{1}{4^n} > \frac{255}{256} \implies \frac{1}{4^n} < \frac{1}{256} = \frac{1}{4^4}$$  
이므로 $n > 4$이다. 따라서 구하는 자연수 $n$의 최솟값은 $5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

공차가 $2$인 등차수열 $\{a_n\}$에 대하여 세 항 $a_2$, $a_5$, $a_{14}$가 이 순서대로 등비수열을 이룰 때, $a_9$의 값은?

**보기** ① $17$  ② $15$  ③ $19$  ④ $21$  ⑤ $23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q13 문제의 조건(14)에 맞추어 식을 세운다.
2. 공차가 $2$이므로 첫째항을 $a_1$이라 하면  
$$a_2 = a_1 + 2, \quad a_5 = a_1 + 8, \quad a_{14} = a_1 + 26$$  
세 항이 등비수열을 이루므로 등비중항의 성질에 의하여  
$$(a_1 + 8)^2 = (a_1 + 2)(a_1 + 26)$$  
$$a_1^2 + 16a_1 + 64 = a_1^2 + 28a_1 + 52$$  
$$12a_1 = 12 \implies a_1 = 1$$  
따라서 $a_9 = a_1 + 8 \times 2 = 1 + 16 = 17$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「공차가 $2$인 등차수열 $\{a_n\}$에 대하여 세」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q13(14): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q13(14): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(14): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「대로 등비수열을 이룰 때, $a_9$의 값은?」
- method: 정리(NAMED)←solution:「공차가 $2$이므로 첫째항을 $a_1$이라 하」
- condition: (없음)

**how** Q13(14): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공차가 $2$이므로 첫째항을 $a_1$이라 하면  
$$a_2 = a_1 + 2, \quad a_5 = a_1 + 8, \quad a_{14} = a_1 + 26$$  
세 항이 등비수열을 이루므로 등비중항의 성질에 의하여  
$$(a_1 + 8)^2 = (a_1 + 2)(a_1 + 26)$$  
$$a_1^2 + 16a_1 + 64 = a_1^2 + 28a_1 + 52$$  
$$12a_1 = 12 \implies a_1 = 1$$  
따라서 $a_9 = a_1 + 8 \times 2 = 1 + 16 = 17$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

$\sum_{k=1}^{11} \left(\frac{k}{k+1} + \frac{k+1}{k}\right) = \frac{a}{12}$일 때, 상수 $a$의 값은?

**보기** ① $263$  ② $265$  ③ $271$  ④ $273$  ⑤ $275$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q14 문제의 조건(11)에 맞추어 식을 세운다.
2. 일반항을 통분하여 분리하면  
$$\frac{k}{k+1} + \frac{k+1}{k} = \frac{k^2 + (k+1)^2}{k(k+1)} = \frac{2k(k+1) + 1}{k(k+1)} = 2 + \frac{1}{k(k+1)} = 2 + \left(\frac{1}{k} - \frac{1}{k+1}\right)$$  
따라서 주어진 합은  
$$\sum_{k=1}^{11} 2 + \sum_{k=1}^{11} \left(\frac{1}{k} - \frac{1}{k+1}\right) = 22 + \left(1 - \frac{1}{12}\right) = 22 + \frac{11}{12} = \frac{275}{12}$$  
그러므로 $a = 275$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sum_{k=1}^{11} \left(\frac{k」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] **원천→판정: 수열 > 수열의 합 > 여러 가지 수열의 합 > 부분분수·망원급수형 → 수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합**
- 이유: Q14(11): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q14(11): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(11): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「c{a}{12}$일 때, 상수 $a$의 값은?」
- method: 정리(NAMED)←solution:「일반항을 통분하여 분리하면  
$$\frac{」
- condition: (없음)

**how** Q14(11): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

일반항을 통분하여 분리하면  
$$\frac{k}{k+1} + \frac{k+1}{k} = \frac{k^2 + (k+1)^2}{k(k+1)} = \frac{2k(k+1) + 1}{k(k+1)} = 2 + \frac{1}{k(k+1)} = 2 + \left(\frac{1}{k} - \frac{1}{k+1}\right)$$  
따라서 주어진 합은  
$$\sum_{k=1}^{11} 2 + \sum_{k=1}^{11} \left(\frac{1}{k} - \frac{1}{k+1}\right) = 22 + \left(1 - \frac{1}{12}\right) = 22 + \frac{11}{12} = \frac{275}{12}$$  
그러므로 $a = 275$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

$0 \le x < 2\pi$일 때, 두 부등식 $\sin x > \frac{1}{2}$, $\cos x < \frac{\sqrt{2}}{2}$를 동시에 만족시키는 $x$의 값의 범위가 $a\pi < x < b\pi$이다. $ab$의 값은?

**보기** ① $\frac{1}{8}$  ② $\frac{1}{6}$  ③ $\frac{5}{24}$  ④ $\frac{1}{4}$  ⑤ $\frac{7}{24}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $0 \le x < 2\pi$에서 $\sin x > \frac{1}{2}$을 만족시키는 범위는  
$$\frac{\pi}{6} < x < \frac{5\pi}{6}$$  
또 $\cos x < \frac{\sqrt{2}}{2}$를 만족시키는 범위는  
$$\frac{\pi}{4} < x < \frac{7\pi}{4}$$  
두 범위의 공통 부분은 $\frac{\pi}{4} < x < \frac{5\pi}{6}$이므로 $a = \frac{1}{4}$, $b = \frac{5}{6}$이다.
2. 따라서 $ab = \frac{1}{4} \times \frac{5}{6} = \frac{5}{24}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_EQUATION(삼각방정식과 부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0 \le x < 2\pi$일 때, 두 부등식 $\s」
**RPM** H2-M1-RPM-101 [삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해] (원천과 같음)
- 이유: Q15(ab): 삼각방정식과 부등식 단원의 RPM H2-M1-RPM-101 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_EQUATION / TPL=TPL_H22A_04_TRIG_EQUATION_101 (원천과 같음)
- 이유: Q15(ab): 삼각방정식과 부등식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(ab): 삼각방정식과 부등식 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「< x < b\pi$이다. $ab$의 값은?」
- method: 정리(NAMED)←solution:「$0 \le x < 2\pi$에서 $\sin」
- condition: (없음)

**how** Q15(ab): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$0 \le x < 2\pi$에서 $\sin x > \frac{1}{2}$을 만족시키는 범위는  
$$\frac{\pi}{6} < x < \frac{5\pi}{6}$$  
또 $\cos x < \frac{\sqrt{2}}{2}$를 만족시키는 범위는  
$$\frac{\pi}{4} < x < \frac{7\pi}{4}$$  
두 범위의 공통 부분은 $\frac{\pi}{4} < x < \frac{5\pi}{6}$이므로 $a = \frac{1}{4}$, $b = \frac{5}{6}$이다.  
따라서 $ab = \frac{1}{4} \times \frac{5}{6} = \frac{5}{24}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.3점


**발문**

양수 $k$에 대하여 함수 $y = \sin\frac{k}{3}x$ ($x > 0$)의 그래프와 직선 $y = a$ ($0 < a < 1$)의 교점의 $x$좌표 중 가장 작은 수를 $\alpha$, 두 번째로 작은 수를 $\beta$라 하고, 직선 $y = -a$와의 교점의 $x$좌표 중 가장 작은 수를 $\gamma$, 두 번째로 작은 수를 $\delta$라 하자. $\tan(\alpha + \beta + \gamma + \delta) = 1$을 만족시키는 양수 $k$의 최댓값은?

**보기** ① $36$  ② $48$  ③ $54$  ④ $60$  ⑤ $72$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $y = \sin\frac{k}{3}x$의 주기는 $T = \frac{2\pi}{\frac{k}{3}} = \frac{6\pi}{k}$이다. (36)
2. $0 < a < 1$이므로 $\alpha, \beta$는 첫 번째 마루 $x = \frac{T}{4}$에 대하여 대칭이어서 $\alpha + \beta = \frac{T}{2}$이다.
3. 마찬가지로 $\gamma, \delta$는 첫 번째 골 $x = \frac{3T}{4}$에 대하여 대칭이어서 $\gamma + \delta = \frac{3T}{2}$이다.
4. 따라서 $\alpha + \beta + \gamma + \delta = 2T = \frac{12\pi}{k}$이다.
5. $\tan\frac{12\pi}{k} = 1$이므로 정수 $n$에 대하여 $\frac{12\pi}{k} = n\pi + \frac{\pi}{4}$이고,  
$$k = \frac{48}{4n + 1}$$  
양수 $k$가 최대가 되려면 양수인 분모 $4n + 1$이 최소여야 하므로 $n = 0$일 때 $k = 48$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「양수 $k$에 대하여 함수 $y = \sin\frac{」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q16(36): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE (원천과 같음)
- 이유: Q16(36): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(36): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「= 1$을 만족시키는 양수 $k$의 최댓값은?」
- method: 정리(NAMED)←solution:「함수 $y = \sin\frac{k}{3}x$」
- condition: (없음)

**how** Q16(36): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = \sin\frac{k}{3}x$의 주기는 $T = \frac{2\pi}{\frac{k}{3}} = \frac{6\pi}{k}$이다.  
$0 < a < 1$이므로 $\alpha, \beta$는 첫 번째 마루 $x = \frac{T}{4}$에 대하여 대칭이어서 $\alpha + \beta = \frac{T}{2}$이다.  
마찬가지로 $\gamma, \delta$는 첫 번째 골 $x = \frac{3T}{4}$에 대하여 대칭이어서 $\gamma + \delta = \frac{3T}{2}$이다.  
따라서 $\alpha + \beta + \gamma + \delta = 2T = \frac{12\pi}{k}$이다.  
$\tan\frac{12\pi}{k} = 1$이므로 정수 $n$에 대하여 $\frac{12\pi}{k} = n\pi + \frac{\pi}{4}$이고,  
$$k = \frac{48}{4n + 1}$$  
양수 $k$가 최대가 되려면 양수인 분모 $4n + 1$이 최소여야 하므로 $n = 0$일 때 $k = 48$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.8점


**발문**

선분 $AB$를 지름으로 하는 반원의 호 $AB$ 위의 점 $C$에 대하여 호 $BC$의 사등분점 중 점 $B$에 가장 가까운 점을 $D$라 하고, 호 $CD$를 이등분하는 점을 $E$라 하자. $\angle BAC = \frac{\pi}{3}$이고 $\overline{CD}^2 = \overline{CE}^2 + 16\sqrt{2}$일 때, $\overline{BC}^2$의 값은?

**보기** ① $24$  ② $32$  ③ $36$  ④ $48$  ⑤ $64$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 반원의 중심을 $O$, 반지름의 길이를 $R$이라 하자. (AB)
2. $\angle BAC = \frac{\pi}{3}$는 호 $BC$에 대한 원주각이므로 중심각 $\angle BOC = \frac{2\pi}{3}$이다.
3. 점 $D$는 호 $BC$의 사등분점 중 $B$에 가장 가까운 점이므로 $\angle BOD = \frac{1}{4} \cdot \frac{2\pi}{3} = \frac{\pi}{6}$이고,  
$$\angle COD = \frac{2\pi}{3} - \frac{\pi}{6} = \frac{\pi}{2}$$  
점 $E$는 호 $CD$의 중점이므로 $\angle COE = \frac{\pi}{4}$이다.
4. 코사인법칙에 의하여  
$$\overline{CD}^2 = R^2 + R^2 - 2R^2\cos\frac{\pi}{2} = 2R^2$$  
$$\overline{CE}^2 = R^2 + R^2 - 2R^2\cos\frac{\pi}{4} = R^2(2 - \sqrt{2})$$  
조건 $\overline{CD}^2 = \overline{CE}^2 + 16\sqrt{2}$에 대입하면  
$$2R^2 = R^2(2 - \sqrt{2}) + 16\sqrt{2} \implies R^2\sqrt{2} = 16\sqrt{2} \implies R^2 = 16$$  
한편 $\angle ACB = \frac{\pi}{2}$이므로 $\overline{BC} = 2R\sin\frac{\pi}{3} = R\sqrt{3}$이고, 따라서 $\overline{BC}^2 = 3R^2 = 48$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $AB$를 지름으로 하는 반원의 호 $AB$ 위의」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 삼각형 판정 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q17(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q17(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「때, $\overline{BC}^2$의 값은?」
- method: 정리(NAMED)←solution:「반원의 중심을 $O$, 반지름의 길이를 $R$」
- condition: (없음)

**how** Q17(AB): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

반원의 중심을 $O$, 반지름의 길이를 $R$이라 하자.  
$\angle BAC = \frac{\pi}{3}$는 호 $BC$에 대한 원주각이므로 중심각 $\angle BOC = \frac{2\pi}{3}$이다.  
점 $D$는 호 $BC$의 사등분점 중 $B$에 가장 가까운 점이므로 $\angle BOD = \frac{1}{4} \cdot \frac{2\pi}{3} = \frac{\pi}{6}$이고,  
$$\angle COD = \frac{2\pi}{3} - \frac{\pi}{6} = \frac{\pi}{2}$$  
점 $E$는 호 $CD$의 중점이므로 $\angle COE = \frac{\pi}{4}$이다.  
코사인법칙에 의하여  
$$\overline{CD}^2 = R^2 + R^2 - 2R^2\cos\frac{\pi}{2} = 2R^2$$  
$$\overline{CE}^2 = R^2 + R^2 - 2R^2\cos\frac{\pi}{4} = R^2(2 - \sqrt{2})$$  
조건 $\overline{CD}^2 = \overline{CE}^2 + 16\sqrt{2}$에 대입하면  
$$2R^2 = R^2(2 - \sqrt{2}) + 16\sqrt{2} \implies R^2\sqrt{2} = 16\sqrt{2} \implies R^2 = 16$$  
한편 $\angle ACB = \frac{\pi}{2}$이므로 $\overline{BC} = 2R\sin\frac{\pi}{3} = R\sqrt{3}$이고, 따라서 $\overline{BC}^2 = 3R^2 = 48$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.7점


**발문**

$1$이 아닌 양의 실수 $a, b, c$가 이 순서대로 등비수열을 이룰 때, $\langle$보기$\rangle$에서 항상 옳은 것만을 모두 고른 것은? (4.7점)

ㄱ. $a + c$의 최솟값은 $2b$이다.  
ㄴ. $\log_3 a$, $\log_3 b$, $\log_3 c$는 이 순서대로 등차수열을 이룬다.  
ㄷ. $\log_a x = \log_b y = \log_c z = 4$이면 $x, y, z$는 이 순서대로 등차수열을 이룬다.

**보기** ① ㄱ, ㄴ  ② ㄱ  ③ ㄴ, ㄷ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a, b, c > 0$이고 $b^2 = ac$가 성립한다. (4.7)
2. ㄱ.
3. 산술평균과 기하평균의 관계에 의해 $a + c \ge 2\sqrt{ac} = 2b$이고, 등호는 $a = c = b$일 때 성립하므로 최솟값은 $2b$이다.
4. (참)  
ㄴ.
5. $\log_3 a + \log_3 c = \log_3(ac) = \log_3 b^2 = 2\log_3 b$이므로 세 수는 이 순서대로 등차수열을 이룬다.
6. (참)  
ㄷ.
7. $x = a^4$, $y = b^4$, $z = c^4$이므로 $y^2 = b^8 = (ac)^4 = a^4 c^4 = xz$가 성립한다.
8. 즉 $x, y, z$는 등비수열을 이루며 항상 등차수열을 이루는 것은 아니다.
9. (거짓)  
따라서 옳은 것은 ㄱ, ㄴ이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「$1$이 아닌 양의 실수 $a, b, c$가 이 순서대」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 중항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q18(4.7): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q18(4.7): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(4.7): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「y, z$는 이 순서대로 등차수열을 이룬다.」
- method: 정리(NAMED)←solution:「$a, b, c > 0$이고 $b^2 = ac」
- condition: (없음)

**how** Q18(4.7): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a, b, c > 0$이고 $b^2 = ac$가 성립한다.  
ㄱ. 산술평균과 기하평균의 관계에 의해 $a + c \ge 2\sqrt{ac} = 2b$이고, 등호는 $a = c = b$일 때 성립하므로 최솟값은 $2b$이다. (참)  
ㄴ. $\log_3 a + \log_3 c = \log_3(ac) = \log_3 b^2 = 2\log_3 b$이므로 세 수는 이 순서대로 등차수열을 이룬다. (참)  
ㄷ. $x = a^4$, $y = b^4$, $z = c^4$이므로 $y^2 = b^8 = (ac)^4 = a^4 c^4 = xz$가 성립한다. 즉 $x, y, z$는 등비수열을 이루며 항상 등차수열을 이루는 것은 아니다. (거짓)  
따라서 옳은 것은 ㄱ, ㄴ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.3점


**발문**

첫째항이 $3$이고 공비가 음수인 등비수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하고, 수열 $\{(a_n)^2\}$의 첫째항부터 제$n$항까지의 합을 $T_n$이라 하자. $T_4 = 135$일 때, $S_4 = p + q\sqrt{r}$이다. $\frac{p}{q} + r$의 값은? (단, $p, q, r$은 유리수이고, $r$은 소수이다.)

**보기** ① $-3$  ② $-2$  ③ $-1$  ④ $0$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 수열 $\{a_n\}$의 공비를 $R$ ($R < 0$)이라 하면 수열 $\{(a_n)^2\}$은 첫째항이 $9$, 공비가 $R^2$인 등비수열이다.
2. $R^2 = t$ ($t > 0$)로 놓으면  
$$T_4 = \frac{9(t^4 - 1)}{t - 1} = 9(t^3 + t^2 + t + 1) = 135 \implies t^3 + t^2 + t + 1 = 15$$  
$$t^3 + t^2 + t - 14 = 0 \implies (t - 2)(t^2 + 3t + 7) = 0$$  
$t > 0$이므로 $t = R^2 = 2$이고, $R < 0$이므로 $R = -\sqrt{2}$이다.
3. 이제 $S_4$를 구하면  
$$S_4 = \frac{3\{(-\sqrt{2})^4 - 1\}}{-\sqrt{2} - 1} = \frac{9}{-(\sqrt{2} + 1)} = -9(\sqrt{2} - 1) = 9 - 9\sqrt{2}$$  
따라서 $p = 9$, $q = -9$, $r = 2$이므로 $\frac{p}{q} + r = \frac{9}{-9} + 2 = 1$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $3$이고 공비가 음수인 등비수열 $\{a_n」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q19(135): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q19(135): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(135): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「q, r$은 유리수이고, $r$은 소수이다.)」
- method: 정리(NAMED)←solution:「수열 $\{a_n\}$의 공비를 $R$ ($R」
- condition: (없음)

**how** Q19(135): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

수열 $\{a_n\}$의 공비를 $R$ ($R < 0$)이라 하면 수열 $\{(a_n)^2\}$은 첫째항이 $9$, 공비가 $R^2$인 등비수열이다.  
$R^2 = t$ ($t > 0$)로 놓으면  
$$T_4 = \frac{9(t^4 - 1)}{t - 1} = 9(t^3 + t^2 + t + 1) = 135 \implies t^3 + t^2 + t + 1 = 15$$  
$$t^3 + t^2 + t - 14 = 0 \implies (t - 2)(t^2 + 3t + 7) = 0$$  
$t > 0$이므로 $t = R^2 = 2$이고, $R < 0$이므로 $R = -\sqrt{2}$이다.  
이제 $S_4$를 구하면  
$$S_4 = \frac{3\{(-\sqrt{2})^4 - 1\}}{-\sqrt{2} - 1} = \frac{9}{-(\sqrt{2} + 1)} = -9(\sqrt{2} - 1) = 9 - 9\sqrt{2}$$  
따라서 $p = 9$, $q = -9$, $r = 2$이므로 $\frac{p}{q} + r = \frac{9}{-9} + 2 = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.4점


**발문**

다음 조건을 만족시키는 모든 수열 $\{a_n\}$에 대하여 $|a_5|$의 최댓값과 최솟값을 각각 $M$, $m$이라 할 때, $\frac{M}{m}$의 값은?

(가) $a_2 = 16$, $a_3 a_4 > 0$  
(나) $2$ 이상의 모든 자연수 $n$에 대하여 $\sum_{k=1}^{n} a_k = 3|a_n|$이다.

**보기** ① $4$  ② $6$  ③ $8$  ④ $12$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $n \ge 3$일 때 조건 (나)의 두 식을 변변 빼면  
$$a_n = 3|a_n| - 3|a_{n-1}| \implies 3|a_{n-1}| = 3|a_n| - a_n$$  
(ⅰ) $a_n > 0$이면 $3|a_{n-1}| = 2a_n \implies |a_n| = \frac{3}{2}|a_{n-1}|$  
(ⅱ) $a_n < 0$이면 $3|a_{n-1}| = -4a_n \implies |a_n| = \frac{3}{4}|a_{n-1}|$  
한편 $n = 2$일 때 $a_1 + 16 = 48 \implies a_1 = 32$로 존재하며, $|a_2| = 16$이다.
2. 조건 (가)에서 $a_3$과 $a_4$는 같은 부호이므로:  
- $a_3 > 0, a_4 > 0$이면 $|a_3| = 24$, $|a_4| = 36$이고 $|a_5|$는 $36 \times \frac{3}{2} = 54$ 또는 $36 \times \frac{3}{4} = 27$이다.
3. - $a_3 < 0, a_4 < 0$이면 $|a_3| = 12$, $|a_4| = 9$이고 $|a_5|$는 $9 \times \frac{3}{2} = \frac{27}{2}$ 또는 $9 \times \frac{3}{4} = \frac{27}{4}$이다.
4. 따라서 $M = 54$, $m = \frac{27}{4}$이므로 $\frac{M}{m} = \frac{54}{\frac{27}{4}} = 8$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 조건을 만족시키는 모든 수열 $\{a_n\}$에 」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] (원천과 같음)
- 이유: Q20(16): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_RECURSIVE_SEQUENCE / TPL=TPL_H22A_08_RECURSIVE_SEQUENCE_129 (원천과 같음)
- 이유: Q20(16): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(16): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「k=1}^{n} a_k = 3|a_n|$이다.」
- method: 정리(NAMED)←solution:「$n \ge 3$일 때 조건 (나)의 두 식을」
- condition: (없음)

**how** Q20(16): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$n \ge 3$일 때 조건 (나)의 두 식을 변변 빼면  
$$a_n = 3|a_n| - 3|a_{n-1}| \implies 3|a_{n-1}| = 3|a_n| - a_n$$  
(ⅰ) $a_n > 0$이면 $3|a_{n-1}| = 2a_n \implies |a_n| = \frac{3}{2}|a_{n-1}|$  
(ⅱ) $a_n < 0$이면 $3|a_{n-1}| = -4a_n \implies |a_n| = \frac{3}{4}|a_{n-1}|$  
한편 $n = 2$일 때 $a_1 + 16 = 48 \implies a_1 = 32$로 존재하며, $|a_2| = 16$이다.  
조건 (가)에서 $a_3$과 $a_4$는 같은 부호이므로:  
- $a_3 > 0, a_4 > 0$이면 $|a_3| = 24$, $|a_4| = 36$이고 $|a_5|$는 $36 \times \frac{3}{2} = 54$ 또는 $36 \times \frac{3}{4} = 27$이다.  
- $a_3 < 0, a_4 < 0$이면 $|a_3| = 12$, $|a_4| = 9$이고 $|a_5|$는 $9 \times \frac{3}{2} = \frac{27}{2}$ 또는 $9 \times \frac{3}{4} = \frac{27}{4}$이다.  
따라서 $M = 54$, $m = \frac{27}{4}$이므로 $\frac{M}{m} = \frac{54}{\frac{27}{4}} = 8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 10점


**발문**

$0 \le x < 2\pi$에서 함수  
$$f(x) = \cos^2\left(\frac{7}{6}\pi - 2x\right) + \cos\left(2x - \frac{2}{3}\pi\right) - 1$$  
은 $x = \alpha$일 때 최댓값을 갖고, $x = \beta$일 때 최솟값을 갖는다. 다음 물음에 답하시오. (총 10점)

(1) $\sin\left(2x - \frac{\pi}{6}\right)$를 $t$로 치환하여 함수 $f(x)$를 $t$에 대한 함수 $g(t)$로 나타내시오. (단, $t$의 범위도 함께 구하시오.) (4점)  
(2) $\alpha$의 최솟값과 $\beta$의 최댓값을 각각 구하시오. (4점)  
(3) $\frac{12}{\pi}(\beta - \alpha)$의 최댓값을 구하시오. (2점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $g(t) = -t^2 + t$ (단, $-1 \le t \le 1$), (2) $\alpha$의 최솟값: $\frac{\pi}{6}$, $\beta$의 최댓값: $\frac{11\pi}{6}$, (3) $20$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\theta = 2x - \frac{\pi}{6}$이라 하면 $\frac{7}{6}\pi - 2x = \pi - \theta$이므로 $\cos^2(\pi - \theta) = \cos^2\theta = 1 - \sin^2\theta$이다. (10)
2. 또 $2x - \frac{2}{3}\pi = \theta - \frac{\pi}{2}$이므로 $\cos\left(\theta - \frac{\pi}{2}\right) = \sin\theta$이다.
3. 따라서 $f(x) = (1 - \sin^2\theta) + \sin\theta - 1 = -\sin^2\theta + \sin\theta$이므로  
$$g(t) = -t^2 + t \quad (-1 \le t \le 1)$$

(2) $g(t) = -\left(t - \frac{1}{2}\right)^2 + \frac{1}{4}$이므로 최댓값은 $t = \frac{1}{2}$일 때, 최솟값은 $t = -1$일 때 갖는다.
4. $0 \le x < 2\pi$에서 $-\frac{\pi}{6} \le 2x - \frac{\pi}{6} < \frac{23\pi}{6}$이다.
5. $\sin\left(2x - \frac{\pi}{6}\right) = \frac{1}{2}$에서 $2x - \frac{\pi}{6} = \frac{\pi}{6}, \frac{5\pi}{6}, \frac{13\pi}{6}, \frac{17\pi}{6}$이므로 $x = \frac{\pi}{6}, \frac{\pi}{2}, \frac{7\pi}{6}, \frac{3\pi}{2}$이고, $\alpha$의 최솟값은 $\frac{\pi}{6}$이다.
6. $\sin\left(2x - \frac{\pi}{6}\right) = -1$에서 $2x - \frac{\pi}{6} = \frac{3\pi}{2}, \frac{7\pi}{2}$이므로 $x = \frac{5\pi}{6}, \frac{11\pi}{6}$이고, $\beta$의 최댓값은 $\frac{11\pi}{6}$이다.
7. (3) $\frac{12}{\pi}(\beta - \alpha)$의 최댓값은 $\beta$가 최대이고 $\alpha$가 최소일 때이므로  
$$\frac{12}{\pi}\left(\frac{11\pi}{6} - \frac{\pi}{6}\right) = \frac{12}{\pi} \cdot \frac{5\pi}{3} = 20$$.
- 작성자 답: (1) $g(t) = -t^2 + t$ (단, $-1 \le t \le 1$), (2) $\alpha$의 최솟값: $\frac{\pi}{6}$, $\beta$의 최댓값: $\frac{11\pi}{6}$, (3) $20$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0 \le x < 2\pi$에서 함수   $$f(x)」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q21(10): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_BOUND_COEFFICIENT (원천과 같음)
- 이유: Q21(10): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(10): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\alpha)$의 최댓값을 구하시오. (2점)」
- method: 정리(NAMED)←solution:「(1) $\theta = 2x - \frac{」
- condition: (없음)

**how** Q21(10): 발문과 해설의 풀이 과정을 점검하여 정답 (1) $g(t) = -t^2 + t$ (단, $-1 \le t \le 1$), (2) $\alpha$의 최솟값: $\frac{\pi}{6}$, $\beta$의 최댓값: $\frac{11\pi}{6}$, (3) $20$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\theta = 2x - \frac{\pi}{6}$이라 하면 $\frac{7}{6}\pi - 2x = \pi - \theta$이므로 $\cos^2(\pi - \theta) = \cos^2\theta = 1 - \sin^2\theta$이다.  
또 $2x - \frac{2}{3}\pi = \theta - \frac{\pi}{2}$이므로 $\cos\left(\theta - \frac{\pi}{2}\right) = \sin\theta$이다.  
따라서 $f(x) = (1 - \sin^2\theta) + \sin\theta - 1 = -\sin^2\theta + \sin\theta$이므로  
$$g(t) = -t^2 + t \quad (-1 \le t \le 1)$$

(2) $g(t) = -\left(t - \frac{1}{2}\right)^2 + \frac{1}{4}$이므로 최댓값은 $t = \frac{1}{2}$일 때, 최솟값은 $t = -1$일 때 갖는다.  
$0 \le x < 2\pi$에서 $-\frac{\pi}{6} \le 2x - \frac{\pi}{6} < \frac{23\pi}{6}$이다.  
$\sin\left(2x - \frac{\pi}{6}\right) = \frac{1}{2}$에서 $2x - \frac{\pi}{6} = \frac{\pi}{6}, \frac{5\pi}{6}, \frac{13\pi}{6}, \frac{17\pi}{6}$이므로 $x = \frac{\pi}{6}, \frac{\pi}{2}, \frac{7\pi}{6}, \frac{3\pi}{2}$이고, $\alpha$의 최솟값은 $\frac{\pi}{6}$이다.  
$\sin\left(2x - \frac{\pi}{6}\right) = -1$에서 $2x - \frac{\pi}{6} = \frac{3\pi}{2}, \frac{7\pi}{2}$이므로 $x = \frac{5\pi}{6}, \frac{11\pi}{6}$이고, $\beta$의 최댓값은 $\frac{11\pi}{6}$이다.

(3) $\frac{12}{\pi}(\beta - \alpha)$의 최댓값은 $\beta$가 최대이고 $\alpha$가 최소일 때이므로  
$$\frac{12}{\pi}\left(\frac{11\pi}{6} - \frac{\pi}{6}\right) = \frac{12}{\pi} \cdot \frac{5\pi}{3} = 20$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

[서술형 4] 다항식 $P(x) = x^8 + x^7 + \cdots + x + 1$을 $x - 3$으로 나눈 몫을 $Q(x)$라 할 때, $Q(x)$를 $x - 1$로 나눈 나머지를 구하고 그 과정을 서술하시오. (5점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $4916$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 나눗셈의 항등식에 의하여  
$$P(x) = (x - 3)Q(x) + P(3)$$  
$Q(x)$를 $x - 1$로 나눈 나머지는 나머지정리에 의하여 $Q(1)$이다.
2. 위 항등식의 양변에 $x = 1$을 대입하면  
$$P(1) = -2Q(1) + P(3) \implies Q(1) = \frac{P(3) - P(1)}{2}$$  
여기서 $P(1) = 1 + 1 + \cdots + 1 = 9$이고,  
$P(3) = 1 + 3 + 3^2 + \cdots + 3^8$은 첫째항이 $1$, 공비가 $3$, 항의 개수가 $9$인 등비수열의 합이므로  
$$P(3) = \frac{3^9 - 1}{3 - 1} = \frac{19683 - 1}{2} = 9841$$  
따라서 구하는 나머지는 $Q(1) = \frac{9841 - 9}{2} = \frac{9832}{2} = 4916$이다.
- 작성자 답: $4916$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 다항식 $P(x) = x^8 + x^7 」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q22(19683): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q22(19683): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(19683): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「머지를 구하고 그 과정을 서술하시오. (5점)」
- method: 정리(NAMED)←solution:「나눗셈의 항등식에 의하여  
$$P(x) =」
- condition: (없음)

**how** Q22(19683): 발문과 해설의 풀이 과정을 점검하여 정답 $4916$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

나눗셈의 항등식에 의하여  
$$P(x) = (x - 3)Q(x) + P(3)$$  
$Q(x)$를 $x - 1$로 나눈 나머지는 나머지정리에 의하여 $Q(1)$이다.  
위 항등식의 양변에 $x = 1$을 대입하면  
$$P(1) = -2Q(1) + P(3) \implies Q(1) = \frac{P(3) - P(1)}{2}$$  
여기서 $P(1) = 1 + 1 + \cdots + 1 = 9$이고,  
$P(3) = 1 + 3 + 3^2 + \cdots + 3^8$은 첫째항이 $1$, 공비가 $3$, 항의 개수가 $9$인 등비수열의 합이므로  
$$P(3) = \frac{3^9 - 1}{3 - 1} = \frac{19683 - 1}{2} = 9841$$  
따라서 구하는 나머지는 $Q(1) = \frac{9841 - 9}{2} = \frac{9832}{2} = 4916$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

[서술형 5] 자연수 $n$에 대하여 등식  
$$1 \times (n+1) + 2 \times n + 3 \times (n-1) + \cdots + n \times 2 = \frac{n(n+a)(n+b)}{6}$$  
이 성립할 때, 상수 $a, b$의 값을 구하고 그 과정을 서술하시오. (5점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a = 1,\ b = 5$ 또는 $a = 5,\ b = 1$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q23 문제의 조건(5)에 맞추어 식을 세운다.
2. 좌변의 제$k$번째 항은 $k(n + 2 - k)$이므로 좌변을 $\sum$로 나타내면  
$$\sum_{k=1}^{n} k(n + 2 - k) = (n + 2)\sum_{k=1}^{n} k - \sum_{k=1}^{n} k^2$$  
자연수의 거듭제곱의 합 공식을 대입하면  
$$= (n + 2) \cdot \frac{n(n + 1)}{2} - \frac{n(n + 1)(2n + 1)}{6}$$  
$$= \frac{n(n + 1)}{6}\{3(n + 2) - (2n + 1)\} = \frac{n(n + 1)(n + 5)}{6}$$  
따라서 $a = 1, b = 5$ 또는 $a = 5, b = 1$이다.
- 작성자 답: $a = 1,\ b = 5$ 또는 $a = 5,\ b = 1$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 5] 자연수 $n$에 대하여 등식   $$1 」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] (원천과 같음)
- 이유: Q23(5): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q23(5): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23(5): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「값을 구하고 그 과정을 서술하시오. (5점)」
- method: 정리(NAMED)←solution:「좌변의 제$k$번째 항은 $k(n + 2 -」
- condition: (없음)

**how** Q23(5): 발문과 해설의 풀이 과정을 점검하여 정답 $a = 1,\ b = 5$ 또는 $a = 5,\ b = 1$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

좌변의 제$k$번째 항은 $k(n + 2 - k)$이므로 좌변을 $\sum$로 나타내면  
$$\sum_{k=1}^{n} k(n + 2 - k) = (n + 2)\sum_{k=1}^{n} k - \sum_{k=1}^{n} k^2$$  
자연수의 거듭제곱의 합 공식을 대입하면  
$$= (n + 2) \cdot \frac{n(n + 1)}{2} - \frac{n(n + 1)(2n + 1)}{6}$$  
$$= \frac{n(n + 1)}{6}\{3(n + 2) - (2n + 1)\} = \frac{n(n + 1)(n + 5)}{6}$$  
따라서 $a = 1, b = 5$ 또는 $a = 5, b = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
