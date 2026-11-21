# 검수 묶음 — 26_순천고_1학기_기말_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 5)**
- 문항 24개 / 검사 PASS 19, FAIL 5, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 6, 2단계 8, 3단계 8, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q4**: 검사 코드: CHOICE_ORDER
- **Q5**: 검사 코드: CHOICE_ORDER
- **Q8**: 검사 코드: CHOICE_ORDER
- **Q14**: 검사 코드: CHOICE_ORDER
- **Q18**: 검사 코드: CHOICE_ORDER
- **Q24**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3.2점


**발문**

$\cos\frac{5}{6}\pi$의 값은?

**보기** ① $-1$  ② $-\frac{\sqrt{3}}{2}$  ③ $-\frac{1}{2}$  ④ $\frac{1}{2}$  ⑤ $\frac{\sqrt{3}}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q1 문제의 조건(5)에 맞추어 식을 세운다.
2. $$\cos\frac{5}{6}\pi = \cos\left(\pi - \frac{\pi}{6}\right) = -\cos\frac{\pi}{6} = -\frac{\sqrt{3}}{2}$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\cos\frac{5}{6}\pi$의 값은?」
**RPM** H2-M1-RPM-095 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정: 삼각함수 > 삼각함수 > 삼각함수의 성질 > 주기·대칭 → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: Q1(5): 삼각함수의 기본 단원의 RPM H2-M1-RPM-095 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_099 (원천과 같음)
- 이유: Q1(5): 삼각함수의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(5): 삼각함수의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$\cos\frac{5}{6}\pi$의 값은?」
- method: 정리(NAMED)←solution:「$$\cos\frac{5}{6}\pi = \c」
- condition: (없음)

**how** Q1(5): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$$\cos\frac{5}{6}\pi = \cos\left(\pi - \frac{\pi}{6}\right) = -\cos\frac{\pi}{6} = -\frac{\sqrt{3}}{2}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.2점


**발문**

첫째항이 $2$, 공비가 $\sqrt{2}$인 등비수열 $\{a_n\}$의 제$7$항은?

**보기** ① $4\sqrt{2}$  ② $8$  ③ $8\sqrt{2}$  ④ $12$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q2 문제의 조건(12)에 맞추어 식을 세운다.
2. 등비수열의 일반항 $a_n = a_1 r^{n-1}$에 $a_1 = 2$, $r = \sqrt{2}$, $n = 7$을 대입하면  
$$a_7 = 2(\sqrt{2})^{7-1} = 2(\sqrt{2})^6 = 2 \times 2^3 = 16$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $2$, 공비가 $\sqrt{2}$인 등비수열」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 일반항 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q2(12): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q2(12): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(12): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「인 등비수열 $\{a_n\}$의 제$7$항은?」
- method: 정리(NAMED)←solution:「등비수열의 일반항 $a_n = a_1 r^{n」
- condition: (없음)

**how** Q2(12): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

등비수열의 일반항 $a_n = a_1 r^{n-1}$에 $a_1 = 2$, $r = \sqrt{2}$, $n = 7$을 대입하면  
$$a_7 = 2(\sqrt{2})^{7-1} = 2(\sqrt{2})^6 = 2 \times 2^3 = 16$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.3점


**발문**

등차수열 $\{a_n\}$에 대하여 $a_3 = 8$, $a_6 = 20$일 때, $a_{10}$의 값은?

**보기** ① $32$  ② $34$  ③ $36$  ④ $38$  ⑤ $40$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 공차를 $d$라 하면 $a_6 - a_3 = 3d = 20 - 8 = 12 \implies d = 4$이다.
2. 따라서 $a_{10} = a_6 + 4d = 20 + 4 \times 4 = 36$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「등차수열 $\{a_n\}$에 대하여 $a_3 = 8$,」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] (원천과 같음)
- 이유: Q3(20): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q3(20): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(20): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「6 = 20$일 때, $a_{10}$의 값은?」
- method: 정리(NAMED)←solution:「공차를 $d$라 하면 $a_6 - a_3 =」
- condition: (없음)

**how** Q3(20): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공차를 $d$라 하면 $a_6 - a_3 = 3d = 20 - 8 = 12 \implies d = 4$이다.  
따라서 $a_{10} = a_6 + 4d = 20 + 4 \times 4 = 36$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

둘레의 길이가 $10\pi$인 원에 내접하는 삼각형 $ABC$에서 $\sin A = \frac{2}{5}$일 때, $\overline{BC}$의 값은?

**보기** ① $4$  ② $2$  ③ $3$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원의 둘레가 $10\pi$이므로 반지름 $R = 5$이다.
2. 사인법칙에 의해 $\frac{\overline{BC}}{\sin A} = 2R$이므로  
$$\overline{BC} = 2R\sin A = 10 \times \frac{2}{5} = 4$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「둘레의 길이가 $10\pi$인 원에 내접하는 삼각형 $」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q4(10): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_SINE_LAW / TPL=TPL_H22A_05_SINE_LAW_109 (원천과 같음)
- 이유: Q4(10): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(10): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「일 때, $\overline{BC}$의 값은?」
- method: 정리(NAMED)←solution:「원의 둘레가 $10\pi$이므로 반지름 $R」
- condition: (없음)

**how** Q4(10): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 둘레가 $10\pi$이므로 반지름 $R = 5$이다.  
사인법칙에 의해 $\frac{\overline{BC}}{\sin A} = 2R$이므로  
$$\overline{BC} = 2R\sin A = 10 \times \frac{2}{5} = 4$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

함수 $y = 3\sin\left(2x - \frac{\pi}{4}\right) - 1$의 최댓값을 $a$, 최솟값을 $b$, 주기를 $c$라 할 때, $abc$의 값은?

**보기** ① $-4\pi$  ② $-6\pi$  ③ $8\pi$  ④ $-8\pi$  ⑤ $4\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $-1 \le \sin\left(2x - \frac{\pi}{4}\right) \le 1$이므로 최댓값 $a = 3 - 1 = 2$, 최솟값 $b = -3 - 1 = -4$이다.
2. 주기는 $c = \frac{2\pi}{2} = \pi$이므로 $abc = 2 \times (-4) \times \pi = -8\pi$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y = 3\sin\left(2x - \frac{」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q5(abc): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_GRAPH_TRANSFORM / TPL=TPL_H22A_04_TRIG_GRAPH_TRANSFORM_105 (원천과 같음)
- 이유: Q5(abc): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(abc): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「주기를 $c$라 할 때, $abc$의 값은?」
- method: 정리(NAMED)←solution:「$-1 \le \sin\left(2x - \f」
- condition: (없음)

**how** Q5(abc): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$-1 \le \sin\left(2x - \frac{\pi}{4}\right) \le 1$이므로 최댓값 $a = 3 - 1 = 2$, 최솟값 $b = -3 - 1 = -4$이다.  
주기는 $c = \frac{2\pi}{2} = \pi$이므로 $abc = 2 \times (-4) \times \pi = -8\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

삼각형 $ABC$에서 $\overline{AB} = 4$, $\overline{BC} = 6$, $\cos B = \frac{\sqrt{7}}{4}$일 때, 삼각형 $ABC$의 넓이는?

**보기** ① $6$  ② $8$  ③ $9$  ④ $12$  ⑤ $6\sqrt{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q6 문제의 조건(ABC)에 맞추어 식을 세운다.
2. 삼각형의 내각 $B$에 대하여 $\sin B > 0$이므로  
$$\sin B = \sqrt{1 - \cos^2 B} = \sqrt{1 - \frac{7}{16}} = \frac{3}{4}$$  
따라서 삼각형 $ABC$의 넓이는  
$$S = \frac{1}{2} \cdot \overline{AB} \cdot \overline{BC} \cdot \sin B = \frac{1}{2} \times 4 \times 6 \times \frac{3}{4} = 9$$.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에서 $\overline{AB} = 4」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 삼각형의 넓이 > 두 변과 끼인각 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q6(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_TRIANGLE_AREA / TPL=TPL_H22A_05_TRIANGLE_AREA_113 (원천과 같음)
- 이유: Q6(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「}{4}$일 때, 삼각형 $ABC$의 넓이는?」
- method: 정리(NAMED)←solution:「삼각형의 내각 $B$에 대하여 $\sin B」
- condition: (없음)

**how** Q6(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 내각 $B$에 대하여 $\sin B > 0$이므로  
$$\sin B = \sqrt{1 - \cos^2 B} = \sqrt{1 - \frac{7}{16}} = \frac{3}{4}$$  
따라서 삼각형 $ABC$의 넓이는  
$$S = \frac{1}{2} \cdot \overline{AB} \cdot \overline{BC} \cdot \sin B = \frac{1}{2} \times 4 \times 6 \times \frac{3}{4} = 9$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.6점


**발문**

첫째항이 $3$, 제$6$항이 $18$인 등차수열의 첫째항부터 제$10$항까지의 합은?

**보기** ① $150$  ② $165$  ③ $180$  ④ $195$  ⑤ $210$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 공차를 $d$라 하면 $a_6 = 3 + 5d = 18 \implies d = 3$이다.
2. 제$10$항은 $a_{10} = 3 + 9 \times 3 = 30$이므로 첫째항부터 제$10$항까지의 합은  
$$S_{10} = \frac{10(3 + 30)}{2} = 5 \times 33 = 165$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $3$, 제$6$항이 $18$인 등차수열의 첫」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q7(18): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q7(18): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(18): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「등차수열의 첫째항부터 제$10$항까지의 합은?」
- method: 정리(NAMED)←solution:「공차를 $d$라 하면 $a_6 = 3 + 5d」
- condition: (없음)

**how** Q7(18): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공차를 $d$라 하면 $a_6 = 3 + 5d = 18 \implies d = 3$이다.  
제$10$항은 $a_{10} = 3 + 9 \times 3 = 30$이므로 첫째항부터 제$10$항까지의 합은  
$$S_{10} = \frac{10(3 + 30)}{2} = 5 \times 33 = 165$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

수열 $\{a_n\}$의 일반항이 $a_n = n + 8$일 때, $\sum_{k=1}^{40} \frac{1}{\sqrt{a_k} + \sqrt{a_{k+1}}}$의 값은?

**보기** ① $1$  ② $2$  ③ $3$  ④ $5$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q8 문제의 조건(40)에 맞추어 식을 세운다.
2. $a_k = k + 8$, $a_{k+1} = k + 9$이므로 분모를 유리화하면  
$$\frac{1}{\sqrt{k + 8} + \sqrt{k + 9}} = \frac{\sqrt{k + 9} - \sqrt{k + 8}}{(k + 9) - (k + 8)} = \sqrt{k + 9} - \sqrt{k + 8}$$  
따라서 $k = 1$부터 $40$까지 더하면 인접한 항이 소거되어  
$$\sum_{k=1}^{40} (\sqrt{k + 9} - \sqrt{k + 8}) = \sqrt{49} - \sqrt{9} = 7 - 3 = 4$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 일반항이 $a_n = n + 」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] **원천→판정: 수열 > 수열의 합 > 여러 가지 수열의 합 > 부분분수·망원급수형 → 수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합**
- 이유: Q8(40): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q8(40): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(40): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「} + \sqrt{a_{k+1}}}$의 값은?」
- method: 정리(NAMED)←solution:「$a_k = k + 8$, $a_{k+1} =」
- condition: (없음)

**how** Q8(40): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_k = k + 8$, $a_{k+1} = k + 9$이므로 분모를 유리화하면  
$$\frac{1}{\sqrt{k + 8} + \sqrt{k + 9}} = \frac{\sqrt{k + 9} - \sqrt{k + 8}}{(k + 9) - (k + 8)} = \sqrt{k + 9} - \sqrt{k + 8}$$  
따라서 $k = 1$부터 $40$까지 더하면 인접한 항이 소거되어  
$$\sum_{k=1}^{40} (\sqrt{k + 9} - \sqrt{k + 8}) = \sqrt{49} - \sqrt{9} = 7 - 3 = 4$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

삼각형 $ABC$에 대하여 $\overline{BC} = a$, $\overline{CA} = b$, $\overline{AB} = c$, 넓이를 $S$라 할 때, $S = \frac{1}{4}a^2\tan B$를 만족시키는 삼각형은 어떤 삼각형인가? (단, $\angle B \ne \frac{\pi}{2}$)

**보기** ① $a = b$인 이등변삼각형  ② $a = c$인 이등변삼각형  ③ $A = \frac{\pi}{2}$인 직각삼각형  ④ $b = c$인 이등변삼각형  ⑤ $C = \frac{\pi}{2}$인 직각삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형의 넓이 $S = \frac{1}{2}ac\sin B$를 조건식에 대입하면  
$$\frac{1}{2}ac\sin B = \frac{1}{4}a^2\frac{\sin B}{\cos B}$$  
$a > 0, \sin B > 0, \cos B \ne 0$이므로 양변을 정리하면 $2c\cos B = a$이다. (ABC)
2. 코사인법칙 $b^2 = a^2 + c^2 - 2ac\cos B$에 $2c\cos B = a$를 대입하면  
$$b^2 = a^2 + c^2 - a^2 = c^2 \implies b = c$$  
따라서 $b = c$인 이등변삼각형이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에 대하여 $\overline{BC} 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 삼각형 판정 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q9(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q9(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「gle B \ne \frac{\pi}{2}$)」
- method: 정리(NAMED)←solution:「삼각형의 넓이 $S = \frac{1}{2}a」
- condition: (없음)

**how** Q9(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 넓이 $S = \frac{1}{2}ac\sin B$를 조건식에 대입하면  
$$\frac{1}{2}ac\sin B = \frac{1}{4}a^2\frac{\sin B}{\cos B}$$  
$a > 0, \sin B > 0, \cos B \ne 0$이므로 양변을 정리하면 $2c\cos B = a$이다.  
코사인법칙 $b^2 = a^2 + c^2 - 2ac\cos B$에 $2c\cos B = a$를 대입하면  
$$b^2 = a^2 + c^2 - a^2 = c^2 \implies b = c$$  
따라서 $b = c$인 이등변삼각형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

두 수열 $\{a_n\}, \{b_n\}$에 대하여 $\sum_{k=1}^{10} (2a_k - b_k) = 11$, $\sum_{k=1}^{10} (a_k + 2b_k) = 18$일 때, $\sum_{k=1}^{10} (a_k - b_k)$의 값은?

**보기** ① $3$  ② $5$  ③ $7$  ④ $9$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $A = \sum_{k=1}^{10} a_k$, $B = \sum_{k=1}^{10} b_k$라 하면  
$$2A - B = 11, \qquad A + 2B = 18$$  
첫째 식을 $2$배하여 둘째 식과 더하면 $5A = 40 \implies A = 8$이고, $B = 2(8) - 11 = 5$이다.
2. 따라서 $\sum_{k=1}^{10} (a_k - b_k) = A - B = 8 - 5 = 3$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 수열 $\{a_n\}, \{b_n\}$에 대하여 $」
**RPM** H2-M1-RPM-123 [수열 > 수열의 합 > 합의 기호 Σ > Σ 계산] **원천→판정: 수열 > 수열의 합 > 합의 기호 Σ > 성질 → 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산**
- 이유: Q10(10): 수열의 기본 단원의 RPM H2-M1-RPM-123 유형에 해당한다.
**유형** PT=PT_H22A_07_SIGMA_NOTATION / TPL=TPL_H22A_07_SIGMA_NOTATION_123 (원천과 같음)
- 이유: Q10(10): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(10): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「1}^{10} (a_k - b_k)$의 값은?」
- method: 정리(NAMED)←solution:「$A = \sum_{k=1}^{10} a_k$」
- condition: (없음)

**how** Q10(10): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A = \sum_{k=1}^{10} a_k$, $B = \sum_{k=1}^{10} b_k$라 하면  
$$2A - B = 11, \qquad A + 2B = 18$$  
첫째 식을 $2$배하여 둘째 식과 더하면 $5A = 40 \implies A = 8$이고, $B = 2(8) - 11 = 5$이다.  
따라서 $\sum_{k=1}^{10} (a_k - b_k) = A - B = 8 - 5 = 3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.1점


**발문**

삼각형 $ABC$가 다음 조건을 만족시킬 때, 삼각형 $ABC$의 넓이는?

(가) $\cos A = \frac{1}{2}$  
(나) 삼각형 $ABC$의 외접원의 넓이는 $\frac{196}{3}\pi$이다.  
(다) $\overline{AB} : \overline{AC} = 3 : 8$이다.

**보기** ① $12\sqrt{3}$  ② $16\sqrt{3}$  ③ $20\sqrt{3}$  ④ $24\sqrt{3}$  ⑤ $28\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (가) $\cos A = \frac{1}{2}$이고 $0 < A < \pi$이므로 $A = 60^\circ$이다. (ABC)
2. (나) 외접원 반지름 $R$에 대하여 $\pi R^2 = \frac{196}{3}\pi \implies R = \frac{14}{\sqrt{3}}$이다.
3. 사인법칙에 의해 $\overline{BC} = 2R\sin 60^\circ = 2 \cdot \frac{14}{\sqrt{3}} \cdot \frac{\sqrt{3}}{2} = 14$이다.
4. (다) $\overline{AB} = 3t$, $\overline{AC} = 8t$ ($t > 0$)라 두고 코사인법칙을 적용하면  
$$14^2 = (3t)^2 + (8t)^2 - 2(3t)(8t)\cos 60^\circ = (9 + 64 - 24)t^2 = 49t^2$$  
$t > 0$이므로 $t = 2$이고 $\overline{AB} = 6$, $\overline{AC} = 16$이다.
5. 따라서 넓이는 $S = \frac{1}{2} \times 6 \times 16 \times \sin 60^\circ = 24\sqrt{3}$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$가 다음 조건을 만족시킬 때, 삼각형 」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q11(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q11(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\overline{AC} = 3 : 8$이다.」
- method: 정리(NAMED)←solution:「(가) $\cos A = \frac{1}{2}」
- condition: (없음)

**how** Q11(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(가) $\cos A = \frac{1}{2}$이고 $0 < A < \pi$이므로 $A = 60^\circ$이다.  
(나) 외접원 반지름 $R$에 대하여 $\pi R^2 = \frac{196}{3}\pi \implies R = \frac{14}{\sqrt{3}}$이다.  
사인법칙에 의해 $\overline{BC} = 2R\sin 60^\circ = 2 \cdot \frac{14}{\sqrt{3}} \cdot \frac{\sqrt{3}}{2} = 14$이다.  
(다) $\overline{AB} = 3t$, $\overline{AC} = 8t$ ($t > 0$)라 두고 코사인법칙을 적용하면  
$$14^2 = (3t)^2 + (8t)^2 - 2(3t)(8t)\cos 60^\circ = (9 + 64 - 24)t^2 = 49t^2$$  
$t > 0$이므로 $t = 2$이고 $\overline{AB} = 6$, $\overline{AC} = 16$이다.  
따라서 넓이는 $S = \frac{1}{2} \times 6 \times 16 \times \sin 60^\circ = 24\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.2점


**발문**

함수 $y = \tan\left(2x - \frac{\pi}{2}\right) + 3$의 그래프에 대한 설명으로 옳지 않은 것은?

**보기** ① 치역은 실수 전체의 집합이다.  ② 점근선의 방정식은 $x = \frac{n\pi}{2} + \frac{\pi}{4}$ (단, $n$은 정수)이다.  ③ 주기는 $\frac{\pi}{2}$이다.  ④ 최댓값은 존재하지 않는다.  ⑤ 점 $\left(\frac{\pi}{4}, 3\right)$을 지난다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 탄젠트함수의 치역은 실수 전체이므로 참이다.
2. ② 점근선은 $2x - \frac{\pi}{2} = \frac{\pi}{2} + n\pi$ ($n$은 정수)일 때이므로 $2x = (n + 1)\pi \implies x = \frac{(n + 1)\pi}{2}$, 즉 $x = \frac{m\pi}{2}$ ($m$은 정수)이다.
3. 따라서 ②는 거짓이다.
4. ③ 주기는 $\frac{\pi}{2}$이므로 참이다.
5. ④ 탄젠트함수는 최댓값·최솟값이 없으므로 참이다.
6. ⑤ $x = \frac{\pi}{4}$일 때 $y = \tan 0 + 3 = 3$이므로 참이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y = \tan\left(2x - \frac{\」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 평행이동 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q12(y): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_TRANSFORM / TPL=TPL_FUNCTION_GRAPH_TRANSLATION (원천과 같음)
- 이유: Q12(y): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(y): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$의 그래프에 대한 설명으로 옳지 않은 것은?」
- method: 정리(NAMED)←solution:「① 탄젠트함수의 치역은 실수 전체이므로 참이다」
- condition: (없음)

**how** Q12(y): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 탄젠트함수의 치역은 실수 전체이므로 참이다.  
② 점근선은 $2x - \frac{\pi}{2} = \frac{\pi}{2} + n\pi$ ($n$은 정수)일 때이므로 $2x = (n + 1)\pi \implies x = \frac{(n + 1)\pi}{2}$, 즉 $x = \frac{m\pi}{2}$ ($m$은 정수)이다. 따라서 ②는 거짓이다.  
③ 주기는 $\frac{\pi}{2}$이므로 참이다.  
④ 탄젠트함수는 최댓값·최솟값이 없으므로 참이다.  
⑤ $x = \frac{\pi}{4}$일 때 $y = \tan 0 + 3 = 3$이므로 참이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.2점


**발문**

첫째항이 $1$인 등비수열 $\{a_n\}$에 대하여 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_n = 7$, $S_{2n} = 63$일 때, $\sum_{k=1}^n a_{2k}$의 값은?

**보기** ① $21$  ② $30$  ③ $36$  ④ $40$  ⑤ $42$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 공비를 $r$이라 하면 $S_{2n} = S_n(1 + r^n)$이므로 $63 = 7(1 + r^n) \implies r^n = 8$이다.
2. $r \ne 1$이고 $a_1 = 1$이므로 $S_n = \frac{r^n - 1}{r - 1} = \frac{7}{r - 1} = 7 \implies r = 2$이다.
3. 짝수 번째 항 $a_{2k} = 2^{2k-1} = 2 \cdot 4^{k-1}$의 첫 $n$항의 합은  
$$\sum_{k=1}^n a_{2k} = 2 \cdot \frac{4^n - 1}{4 - 1} = \frac{2\{(2^n)^2 - 1\}}{3} = \frac{2(8^2 - 1)}{3} = \frac{2 \times 63}{3} = 42$$.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「첫째항이 $1$인 등비수열 $\{a_n\}$에 대하여 」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등비수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q13(63): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_GEOMETRIC_SEQUENCE / TPL=TPL_H22A_06_GEOMETRIC_SEQUENCE_118 (원천과 같음)
- 이유: Q13(63): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(63): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\sum_{k=1}^n a_{2k}$의 값은?」
- method: 정리(NAMED)←solution:「공비를 $r$이라 하면 $S_{2n} = S_」
- condition: (없음)

**how** Q13(63): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공비를 $r$이라 하면 $S_{2n} = S_n(1 + r^n)$이므로 $63 = 7(1 + r^n) \implies r^n = 8$이다.  
$r \ne 1$이고 $a_1 = 1$이므로 $S_n = \frac{r^n - 1}{r - 1} = \frac{7}{r - 1} = 7 \implies r = 2$이다.  
짝수 번째 항 $a_{2k} = 2^{2k-1} = 2 \cdot 4^{k-1}$의 첫 $n$항의 합은  
$$\sum_{k=1}^n a_{2k} = 2 \cdot \frac{4^n - 1}{4 - 1} = \frac{2\{(2^n)^2 - 1\}}{3} = \frac{2(8^2 - 1)}{3} = \frac{2 \times 63}{3} = 42$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $S_n = -n^2 + 7n + 8$이다. $\sum_{k=1}^7 |a_k|$의 값은?

**보기** ① $32$  ② $28$  ③ $30$  ④ $34$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_1 = S_1 = -1 + 7 + 8 = 14$이다.
2. $n \ge 2$일 때 $a_n = S_n - S_{n-1} = (-n^2 + 7n + 8) - \{-(n-1)^2 + 7(n-1) + 8\} = -2n + 8$이다.
3. 따라서 $a_2, a_3, \dots, a_7$은 차례로 $4, 2, 0, -2, -4, -6$이므로  
$$\sum_{k=1}^7 |a_k| = 14 + 4 + 2 + 0 + 2 + 4 + 6 = 32$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_APPLICATION(수열의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합」
**RPM** H2-M1-RPM-121 [수열 > 등차수열과 등비수열 > 수열의 활용 > 조건으로 수열 결정] (원천과 같음)
- 이유: Q14(32): 수열의 활용 단원의 RPM H2-M1-RPM-121 유형에 해당한다.
**유형** PT=PT_H22A_06_SEQUENCE_APPLICATION / TPL=TPL_H22A_06_SEQUENCE_APPLICATION_121 (원천과 같음)
- 이유: Q14(32): 수열의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(32): 수열의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$\sum_{k=1}^7 |a_k|$의 값은?」
- method: 정리(NAMED)←solution:「$a_1 = S_1 = -1 + 7 + 8 =」
- condition: (없음)

**how** Q14(32): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_1 = S_1 = -1 + 7 + 8 = 14$이다.  
$n \ge 2$일 때 $a_n = S_n - S_{n-1} = (-n^2 + 7n + 8) - \{-(n-1)^2 + 7(n-1) + 8\} = -2n + 8$이다.  
따라서 $a_2, a_3, \dots, a_7$은 차례로 $4, 2, 0, -2, -4, -6$이므로  
$$\sum_{k=1}^7 |a_k| = 14 + 4 + 2 + 0 + 2 + 4 + 6 = 32$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.4점


**발문**

$0 \le x < 12$에서 함수 $y = 4\sin\frac{\pi}{4}x$의 그래프와 직선 $y = 2$가 만나는 네 점을 $x$좌표가 작은 것부터 차례로 $A, B, C, D$라 하자. 이때 삼각형 $BOC$의 넓이를 $S$, 선분 $AD$의 길이를 $l$이라 하면 $S + l$의 값은? (단, $O$는 원점이다.)

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $4\sin\frac{\pi}{4}x = 2 \implies \sin\frac{\pi}{4}x = \frac{1}{2}$이다.
2. $0 \le x < 12$에서 $0 \le \frac{\pi}{4}x < 3\pi$이므로 $\frac{\pi}{4}x = \frac{\pi}{6}, \frac{5\pi}{6}, \frac{13\pi}{6}, \frac{17\pi}{6}$이다.
3. 따라서 네 점의 $x$좌표는 차례로 $\frac{2}{3}, \frac{10}{3}, \frac{26}{3}, \frac{34}{3}$이다.
4. 네 점의 $y$좌표가 모두 $2$이므로 $\overline{BC} = \frac{26}{3} - \frac{10}{3} = \frac{16}{3}$이고,  
$$S = \frac{1}{2} \times \frac{16}{3} \times 2 = \frac{16}{3}, \qquad l = \overline{AD} = \frac{34}{3} - \frac{2}{3} = \frac{32}{3}$$  
따라서 $S + l = \frac{16}{3} + \frac{32}{3} = 16$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0 \le x < 12$에서 함수 $y = 4\sin」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q15(12): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE (원천과 같음)
- 이유: Q15(12): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(12): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「+ l$의 값은? (단, $O$는 원점이다.)」
- method: 정리(NAMED)←solution:「$4\sin\frac{\pi}{4}x = 2」
- condition: (없음)

**how** Q15(12): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$4\sin\frac{\pi}{4}x = 2 \implies \sin\frac{\pi}{4}x = \frac{1}{2}$이다.  
$0 \le x < 12$에서 $0 \le \frac{\pi}{4}x < 3\pi$이므로 $\frac{\pi}{4}x = \frac{\pi}{6}, \frac{5\pi}{6}, \frac{13\pi}{6}, \frac{17\pi}{6}$이다.  
따라서 네 점의 $x$좌표는 차례로 $\frac{2}{3}, \frac{10}{3}, \frac{26}{3}, \frac{34}{3}$이다.  
네 점의 $y$좌표가 모두 $2$이므로 $\overline{BC} = \frac{26}{3} - \frac{10}{3} = \frac{16}{3}$이고,  
$$S = \frac{1}{2} \times \frac{16}{3} \times 2 = \frac{16}{3}, \qquad l = \overline{AD} = \frac{34}{3} - \frac{2}{3} = \frac{32}{3}$$  
따라서 $S + l = \frac{16}{3} + \frac{32}{3} = 16$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.4점


**발문**

수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $S_n = 2^{n+2} - 4$가 성립한다. 이때 $\sum_{k=1}^{12} \log_2\left(\frac{a_k}{2}\right)$의 값은?

**보기** ① $66$  ② $78$  ③ $84$  ④ $91$  ⑤ $105$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a_1 = S_1 = 8 - 4 = 4 = 2^{1+1}$이고, $n \ge 2$일 때  
$$a_n = S_n - S_{n-1} = (2^{n+2} - 4) - (2^{n+1} - 4) = 2^{n+1}$$  
이므로 모든 자연수 $k$에 대하여 $a_k = 2^{k+1}$이다.
2. 따라서 $\log_2\left(\frac{a_k}{2}\right) = \log_2(2^k) = k$이므로  
$$\sum_{k=1}^{12} \log_2\left(\frac{a_k}{2}\right) = \sum_{k=1}^{12} k = \frac{12 \times 13}{2} = 78$$.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-07(수열의 합) / H22-A-07-SEQUENCE_SUM(수열의 합) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합」
**RPM** H2-M1-RPM-125 [수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합] (원천과 같음)
- 이유: Q16(12): 수열의 합 단원의 RPM H2-M1-RPM-125 유형에 해당한다.
**유형** PT=PT_H22A_07_SEQUENCE_SUM / TPL=TPL_H22A_07_SEQUENCE_SUM_125 (원천과 같음)
- 이유: Q16(12): 수열의 합 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(12): 수열의 합 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「frac{a_k}{2}\right)$의 값은?」
- method: 정리(NAMED)←solution:「$a_1 = S_1 = 8 - 4 = 4 =」
- condition: (없음)

**how** Q16(12): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a_1 = S_1 = 8 - 4 = 4 = 2^{1+1}$이고, $n \ge 2$일 때  
$$a_n = S_n - S_{n-1} = (2^{n+2} - 4) - (2^{n+1} - 4) = 2^{n+1}$$  
이므로 모든 자연수 $k$에 대하여 $a_k = 2^{k+1}$이다.  
따라서 $\log_2\left(\frac{a_k}{2}\right) = \log_2(2^k) = k$이므로  
$$\sum_{k=1}^{12} \log_2\left(\frac{a_k}{2}\right) = \sum_{k=1}^{12} k = \frac{12 \times 13}{2} = 78$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.7점


**발문**

모든 자연수 $n$에 대하여 함수 $y = 3|\sin 2x|$의 그래프와 직선 $y = \frac{3}{n\pi}x$의 교점의 개수를 $f(n)$이라 하자. 이때 $f(1) + f(2) + f(3) + f(4)$의 값은?

**보기** ① $32$  ② $36$  ③ $38$  ④ $40$  ⑤ $44$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 방정식 $3|\sin 2x| = \frac{3}{n\pi}x$는 $|\sin 2x| = \frac{x}{n\pi}$와 같다. (32)
2. $0 \le |\sin 2x| \le 1$이므로 교점은 $0 \le x \le n\pi$에서만 생긴다.
3. $|\sin 2x|$의 주기는 $\frac{\pi}{2}$이므로 구간 $[0, n\pi]$에는 높이 $1$인 봉우리가 $2n$개 있다.
4. - 첫 구간 $\left[0, \frac{\pi}{2}\right]$에서는 원점 $(0, 0)$과 내려가는 부분에서 각각 $1$번씩 만나므로 $2$개다.
5. - 나머지 $2n - 1$개의 구간에서는 각 봉우리 꼭대기에서 직선의 높이가 $1$ 미만이므로 올라갈 때와 내려갈 때 각각 $1$번씩, 구간마다 $2$개씩 만난다.
6. 따라서 $f(n) = 2 + 2(2n - 1) = 4n$이므로  
$$f(1) + f(2) + f(3) + f(4) = 4 + 8 + 12 + 16 = 40$$.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「모든 자연수 $n$에 대하여 함수 $y = 3|\sin」
**RPM** H2-M1-RPM-103 [삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos] **원천→판정: 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점 → 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos**
- 이유: Q17(32): 삼각함수의 그래프 단원의 RPM H2-M1-RPM-103 유형에 해당한다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE (원천과 같음)
- 이유: Q17(32): 삼각함수의 그래프 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(32): 삼각함수의 그래프 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「f(2) + f(3) + f(4)$의 값은?」
- method: 정리(NAMED)←solution:「방정식 $3|\sin 2x| = \frac{3」
- condition: (없음)

**how** Q17(32): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

방정식 $3|\sin 2x| = \frac{3}{n\pi}x$는 $|\sin 2x| = \frac{x}{n\pi}$와 같다.  
$0 \le |\sin 2x| \le 1$이므로 교점은 $0 \le x \le n\pi$에서만 생긴다.  
$|\sin 2x|$의 주기는 $\frac{\pi}{2}$이므로 구간 $[0, n\pi]$에는 높이 $1$인 봉우리가 $2n$개 있다.  
- 첫 구간 $\left[0, \frac{\pi}{2}\right]$에서는 원점 $(0, 0)$과 내려가는 부분에서 각각 $1$번씩 만나므로 $2$개다.  
- 나머지 $2n - 1$개의 구간에서는 각 봉우리 꼭대기에서 직선의 높이가 $1$ 미만이므로 올라갈 때와 내려갈 때 각각 $1$번씩, 구간마다 $2$개씩 만난다.  
따라서 $f(n) = 2 + 2(2n - 1) = 4n$이므로  
$$f(1) + f(2) + f(3) + f(4) = 4 + 8 + 12 + 16 = 40$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.7점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\overline{AB} = 8$, $\overline{BC} = 15$, $\angle ABC = \frac{\pi}{3}$인 삼각형 $ABC$가 있다. 선분 $AC$ 위의 점 $P$에서 두 직선 $AB, BC$에 내린 수선의 발을 각각 $Q, R$이라 할 때, 선분 $QR$의 길이의 최솟값은?

**보기** ① $\frac{90}{13}$  ② $\frac{60\sqrt{3}}{13}$  ③ $\frac{45}{13}$  ④ $\frac{120}{13}$  ⑤ $\frac{30\sqrt{3}}{13}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle BQP = \angle BRP = \frac{\pi}{2}$이므로 네 점 $B, Q, P, R$은 선분 $BP$를 지름으로 하는 한 원 위에 있다.
2. 따라서 $\triangle BQR$의 외접원의 지름이 $\overline{BP}$이므로 사인법칙에 의하여  
$$\overline{QR} = \overline{BP} \cdot \sin\frac{\pi}{3} = \frac{\sqrt{3}}{2}\overline{BP}$$  
그러므로 $\overline{QR}$이 최소일 때는 $\overline{BP}$가 최소일 때, 즉 점 $B$에서 선분 $AC$에 내린 수선의 길이 $h$와 같을 때이다.
3. (예각삼각형이므로 수선의 발은 선분 $AC$ 위에 놓인다.)  
$\triangle ABC$에서 코사인법칙에 의해  
$$\overline{AC}^2 = 8^2 + 15^2 - 2 \cdot 8 \cdot 15 \cdot \cos\frac{\pi}{3} = 64 + 225 - 120 = 169 \implies \overline{AC} = 13$$  
삼각형 $ABC$의 넓이 $S = \frac{1}{2} \cdot 8 \cdot 15 \cdot \sin\frac{\pi}{3} = 30\sqrt{3} = \frac{1}{2} \cdot 13 \cdot h$에서 $h = \frac{60\sqrt{3}}{13}$이므로  
$$\overline{QR}_{\min} = \frac{\sqrt{3}}{2} \cdot \frac{60\sqrt{3}}{13} = \frac{90}{13}$$.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = 8$, $\overlin」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q18(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q18(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(AB): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「라 할 때, 선분 $QR$의 길이의 최솟값은?」
- method: 정리(NAMED)←solution:「$\angle BQP = \angle BRP」
- condition: (없음)

**how** Q18(AB): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle BQP = \angle BRP = \frac{\pi}{2}$이므로 네 점 $B, Q, P, R$은 선분 $BP$를 지름으로 하는 한 원 위에 있다.  
따라서 $\triangle BQR$의 외접원의 지름이 $\overline{BP}$이므로 사인법칙에 의하여  
$$\overline{QR} = \overline{BP} \cdot \sin\frac{\pi}{3} = \frac{\sqrt{3}}{2}\overline{BP}$$  
그러므로 $\overline{QR}$이 최소일 때는 $\overline{BP}$가 최소일 때, 즉 점 $B$에서 선분 $AC$에 내린 수선의 길이 $h$와 같을 때이다. (예각삼각형이므로 수선의 발은 선분 $AC$ 위에 놓인다.)  
$\triangle ABC$에서 코사인법칙에 의해  
$$\overline{AC}^2 = 8^2 + 15^2 - 2 \cdot 8 \cdot 15 \cdot \cos\frac{\pi}{3} = 64 + 225 - 120 = 169 \implies \overline{AC} = 13$$  
삼각형 $ABC$의 넓이 $S = \frac{1}{2} \cdot 8 \cdot 15 \cdot \sin\frac{\pi}{3} = 30\sqrt{3} = \frac{1}{2} \cdot 13 \cdot h$에서 $h = \frac{60\sqrt{3}}{13}$이므로  
$$\overline{QR}_{\min} = \frac{\sqrt{3}}{2} \cdot \frac{60\sqrt{3}}{13} = \frac{90}{13}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.8점


**발문**

수열 $\{a_n\}$이 다음 조건을 모두 만족시킬 때, $a_2 + a_5$의 값은?

(가) $|a_1| = 1$  
(나) 모든 자연수 $n$에 대하여 $|a_{n+1}| = 2|a_n|$이다.  
(다) $\sum_{k=1}^6 a_k = 29$

**보기** ① $-18$  ② $-16$  ③ $-14$  ④ $-12$  ⑤ $-10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (가), (나)에서 $|a_1|, |a_2|, \dots, |a_6|$은 차례로 $1, 2, 4, 8, 16, 32$이고, 모두 양수일 때의 합은 $63$이다.
2. 어떤 항의 부호가 음수이면 전체 합은 그 항 절댓값의 $2$배만큼 감소한다.
3. 음수인 항들의 절댓값의 합을 $T$라 하면 $63 - 2T = 29 \implies 2T = 34 \implies T = 17$이다.
4. $\{1, 2, 4, 8, 16, 32\}$의 부분집합 중 합이 $17$이 되는 조합은 $1 + 16$뿐이므로 $a_1 = -1, a_5 = -16$이고 나머지 항은 양수이다.
5. 따라서 $a_2 + a_5 = 2 + (-16) = -14$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_APPLICATION(수열의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$이 다음 조건을 모두 만족시킬 때」
**RPM** H2-M1-RPM-121 [수열 > 등차수열과 등비수열 > 수열의 활용 > 조건으로 수열 결정] **원천→판정: 수열 > 등차수열과 등비수열 > 수열의 활용 > 귀납적 패턴 → 수열 > 등차수열과 등비수열 > 수열의 활용 > 조건으로 수열 결정**
- 이유: Q19(29): 수열의 활용 단원의 RPM H2-M1-RPM-121 유형에 해당한다.
**유형** PT=PT_H22A_06_SEQUENCE_APPLICATION / TPL=TPL_H22A_06_SEQUENCE_APPLICATION_121 (원천과 같음)
- 이유: Q19(29): 수열의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(29): 수열의 활용 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「) $\sum_{k=1}^6 a_k = 29$」
- method: 정리(NAMED)←solution:「(가), (나)에서 $|a_1|, |a_2|,」
- condition: (없음)

**how** Q19(29): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(가), (나)에서 $|a_1|, |a_2|, \dots, |a_6|$은 차례로 $1, 2, 4, 8, 16, 32$이고, 모두 양수일 때의 합은 $63$이다.  
어떤 항의 부호가 음수이면 전체 합은 그 항 절댓값의 $2$배만큼 감소한다.  
음수인 항들의 절댓값의 합을 $T$라 하면 $63 - 2T = 29 \implies 2T = 34 \implies T = 17$이다.  
$\{1, 2, 4, 8, 16, 32\}$의 부분집합 중 합이 $17$이 되는 조합은 $1 + 16$뿐이므로 $a_1 = -1, a_5 = -16$이고 나머지 항은 양수이다.  
따라서 $a_2 + a_5 = 2 + (-16) = -14$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.8점


**발문**

다음은 수열 $\{a_n\}$이 $a_1 = 2$이고, 모든 자연수 $n$에 대하여 $\sum_{k=1}^n a_k = n^2 a_n$을 만족시킬 때, 모든 자연수 $n$에 대하여  
$$a_n = \frac{4}{n(n+1)} \qquad \cdots (*)$$  
임을 수학적 귀납법을 이용하여 증명한 것이다.

(ⅰ) $n = 1$일 때, $(\text{좌변}) = 2$이고 $(\text{우변}) = \frac{4}{1 \times 2} = 2$이므로 $(*)$이 성립한다.  
(ⅱ) $n = m$일 때, $a_m = \frac{4}{m(m+1)}$이 성립한다고 가정하자.  
$n = m + 1$일 때, $\sum_{k=1}^{m+1} a_k = (m+1)^2 a_{m+1}$이다.  
$\sum_{k=1}^{m+1} a_k = \sum_{k=1}^m a_k + a_{m+1}$이고, 주어진 식과 가정에 의하여 $\sum_{k=1}^m a_k = m^2 a_m = (\text{가})$ 이므로 $(\text{가}) + a_{m+1} = (m+1)^2 a_{m+1}$이다.  
식을 $a_{m+1}$에 대하여 묶어서 정리하면 $(\text{가}) = (\text{나}) \times a_{m+1}$이다.  
따라서 $a_{m+1} = \frac{4}{(m+1)(m+2)}$이다. 그러므로 $n = m + 1$일 때도 $(*)$이 성립한다.  
(ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $(*)$이 성립한다.

위의 (가), (나)에 알맞은 식을 각각 $f(m), g(m)$이라 할 때, $f(3) \times g(4)$의 값은?

**보기** ① $48$  ② $54$  ③ $60$  ④ $64$  ⑤ $72$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q20 문제의 조건(48)에 맞추어 식을 세운다.
2. (가) 귀납 가정 $a_m = \frac{4}{m(m+1)}$을 대입하면  
$$f(m) = m^2 a_m = m^2 \cdot \frac{4}{m(m+1)} = \frac{4m}{m + 1}$$  
(나) $f(m) + a_{m+1} = (m + 1)^2 a_{m+1}$에서 $a_{m+1}$ 항을 모으면  
$$f(m) = \{(m + 1)^2 - 1\} a_{m+1} = m(m + 2) a_{m+1} \implies g(m) = m(m + 2)$$  
따라서 $f(3) = \frac{12}{4} = 3$, $g(4) = 4 \times 6 = 24$이므로 $f(3) \times g(4) = 3 \times 24 = 72$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 수열 $\{a_n\}$이 $a_1 = 2$이고,」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수학적 귀납법 > 등식 증명 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q20(48): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_MATHEMATICAL_INDUCTION / TPL=TPL_H22A_08_MATHEMATICAL_INDUCTION_131 (원천과 같음)
- 이유: Q20(48): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(48): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「, $f(3) \times g(4)$의 값은?」
- method: 정리(NAMED)←solution:「(가) 귀납 가정 $a_m = \frac{4}」
- condition: (없음)

**how** Q20(48): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(가) 귀납 가정 $a_m = \frac{4}{m(m+1)}$을 대입하면  
$$f(m) = m^2 a_m = m^2 \cdot \frac{4}{m(m+1)} = \frac{4m}{m + 1}$$  
(나) $f(m) + a_{m+1} = (m + 1)^2 a_{m+1}$에서 $a_{m+1}$ 항을 모으면  
$$f(m) = \{(m + 1)^2 - 1\} a_{m+1} = m(m + 2) a_{m+1} \implies g(m) = m(m + 2)$$  
따라서 $f(3) = \frac{12}{4} = 3$, $g(4) = 4 \times 6 = 24$이므로 $f(3) \times g(4) = 3 \times 24 = 72$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점


**발문**

등차수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_3 = 27$, $S_8 = 32$일 때, $S_n$의 값이 최대가 되는 $n$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $6$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째항을 $a$, 공차를 $d$라 하면  
$$S_3 = \frac{3}{2}(2a + 2d) = 27 \implies a + d = 9$$  
$$S_8 = \frac{8}{2}(2a + 7d) = 32 \implies 2a + 7d = 8$$  
첫째 식의 $2$배를 둘째 식에서 빼면 $5d = -10 \implies d = -2$이고 $a = 11$이다.
2. 따라서 $S_n = \frac{n}{2}\{22 - 2(n - 1)\} = n(12 - n) = 36 - (n - 6)^2$이므로 $n = 6$일 때 최댓값 $36$을 갖는다.
- 작성자 답: $6$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-06(등차수열과 등비수열) / H22-A-06-SEQUENCE_BASIC(수열의 기본) (원천과 같음) (원천과 같음)
- 근거 인용: 「등차수열 $\{a_n\}$의 첫째항부터 제$n$항까지의」
**RPM** H2-M1-RPM-115 [수열 > 등차수열과 등비수열 > 등차수열 > 일반항] **원천→판정: 수열 > 등차수열과 등비수열 > 등차수열 > 합 → 수열 > 등차수열과 등비수열 > 등차수열 > 일반항**
- 이유: Q21(27): 수열의 기본 단원의 RPM H2-M1-RPM-115 유형에 해당한다.
**유형** PT=PT_H22A_06_ARITHMETIC_SEQUENCE / TPL=TPL_H22A_06_ARITHMETIC_SEQUENCE_115 (원천과 같음)
- 이유: Q21(27): 수열의 기본 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(27): 수열의 기본 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「구하는 과정을 풀이 과정과 함께 서술하시오.」
- method: 정리(NAMED)←solution:「첫째항을 $a$, 공차를 $d$라 하면  
$」
- condition: (없음)

**how** Q21(27): 발문과 해설의 풀이 과정을 점검하여 정답 $6$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째항을 $a$, 공차를 $d$라 하면  
$$S_3 = \frac{3}{2}(2a + 2d) = 27 \implies a + d = 9$$  
$$S_8 = \frac{8}{2}(2a + 7d) = 32 \implies 2a + 7d = 8$$  
첫째 식의 $2$배를 둘째 식에서 빼면 $5d = -10 \implies d = -2$이고 $a = 11$이다.  
따라서 $S_n = \frac{n}{2}\{22 - 2(n - 1)\} = n(12 - n) = 36 - (n - 6)^2$이므로 $n = 6$일 때 최댓값 $36$을 갖는다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

$0 \le x \le 3\pi$일 때, 부등식 $-2\cos^2(\pi + x) + \cos\left(\frac{\pi}{2} - x\right) + 1 \ge 0$의 해를 구하는 과정을 풀이 과정과 함께 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\left[\frac{\pi}{6}, \frac{5\pi}{6}\right] \cup \left\{\frac{3\pi}{2}\right\} \cup \left[\frac{13\pi}{6}, \frac{17\pi}{6}\right]$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\cos(\pi + x) = -\cos x$, $\cos\left(\frac{\pi}{2} - x\right) = \sin x$이므로 주어진 부등식은  
$$-2\cos^2 x + \sin x + 1 \ge 0$$  
$\cos^2 x = 1 - \sin^2 x$를 대입하면  
$$-2(1 - \sin^2 x) + \sin x + 1 \ge 0 \implies 2\sin^2 x + \sin x - 1 \ge 0 \implies (2\sin x - 1)(\sin x + 1) \ge 0$$  
$-1 \le \sin x \le 1$이므로 $\sin x \ge \frac{1}{2}$ 또는 $\sin x = -1$이다.
2. $0 \le x \le 3\pi$에서 $\sin x \ge \frac{1}{2}$의 해는 $\frac{\pi}{6} \le x \le \frac{5\pi}{6}$ 또는 $\frac{13\pi}{6} \le x \le \frac{17\pi}{6}$이고, $\sin x = -1$의 해는 $x = \frac{3\pi}{2}$이다.
3. 따라서 구하는 해는 $\left[\frac{\pi}{6}, \frac{5\pi}{6}\right] \cup \left\{\frac{3\pi}{2}\right\} \cup \left[\frac{13\pi}{6}, \frac{17\pi}{6}\right]$이다.
- 작성자 답: $\left[\frac{\pi}{6}, \frac{5\pi}{6}\right] \cup \left\{\frac{3\pi}{2}\right\} \cup \left[\frac{13\pi}{6}, \frac{17\pi}{6}\right]$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_EQUATION(삼각방정식과 부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0 \le x \le 3\pi$일 때, 부등식 $-2」
**RPM** H2-M1-RPM-101 [삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해] **원천→판정: 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해 → 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해**
- 이유: Q22(13): 삼각방정식과 부등식 단원의 RPM H2-M1-RPM-101 유형에 해당한다.
**유형** PT=PT_H22A_04_TRIG_EQUATION / TPL=TPL_H22A_04_TRIG_EQUATION_101 (원천과 같음)
- 이유: Q22(13): 삼각방정식과 부등식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(13): 삼각방정식과 부등식 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「구하는 과정을 풀이 과정과 함께 서술하시오.」
- method: 정리(NAMED)←solution:「$\cos(\pi + x) = -\cos x$」
- condition: (없음)

**how** Q22(13): 발문과 해설의 풀이 과정을 점검하여 정답 $\left[\frac{\pi}{6}, \frac{5\pi}{6}\right] \cup \left\{\frac{3\pi}{2}\right\} \cup \left[\frac{13\pi}{6}, \frac{17\pi}{6}\right]$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\cos(\pi + x) = -\cos x$, $\cos\left(\frac{\pi}{2} - x\right) = \sin x$이므로 주어진 부등식은  
$$-2\cos^2 x + \sin x + 1 \ge 0$$  
$\cos^2 x = 1 - \sin^2 x$를 대입하면  
$$-2(1 - \sin^2 x) + \sin x + 1 \ge 0 \implies 2\sin^2 x + \sin x - 1 \ge 0 \implies (2\sin x - 1)(\sin x + 1) \ge 0$$  
$-1 \le \sin x \le 1$이므로 $\sin x \ge \frac{1}{2}$ 또는 $\sin x = -1$이다.  
$0 \le x \le 3\pi$에서 $\sin x \ge \frac{1}{2}$의 해는 $\frac{\pi}{6} \le x \le \frac{5\pi}{6}$ 또는 $\frac{13\pi}{6} \le x \le \frac{17\pi}{6}$이고, $\sin x = -1$의 해는 $x = \frac{3\pi}{2}$이다.  
따라서 구하는 해는 $\left[\frac{\pi}{6}, \frac{5\pi}{6}\right] \cup \left\{\frac{3\pi}{2}\right\} \cup \left[\frac{13\pi}{6}, \frac{17\pi}{6}\right]$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 4점


**발문**

삼각형 $ABC$에서 $\sin^2 A + 3\sin^2 B = 4\sin^2 C$일 때, $\cos C$의 최솟값을 구하는 과정을 풀이 과정과 함께 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\frac{\sqrt{3}}{4}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 세 변의 길이를 $a, b, c$라 하면 사인법칙에 의해 $\sin A : \sin B : \sin C = a : b : c$이므로 $a^2 + 3b^2 = 4c^2$, 즉 $c^2 = \frac{a^2 + 3b^2}{4}$이다. (ABC)
2. 코사인법칙에 대입하면  
$$\cos C = \frac{a^2 + b^2 - c^2}{2ab} = \frac{a^2 + b^2 - \frac{a^2 + 3b^2}{4}}{2ab} = \frac{3a^2 + b^2}{8ab} = \frac{1}{8}\left(\frac{3a}{b} + \frac{b}{a}\right)$$  
$a > 0, b > 0$이므로 산술·기하평균의 부등식에 의하여  
$$\cos C \ge \frac{1}{8} \cdot 2\sqrt{\frac{3a}{b} \cdot \frac{b}{a}} = \frac{\sqrt{3}}{4}$$  
등호는 $\frac{3a}{b} = \frac{b}{a}$ ($b = \sqrt{3}a$, $c = \frac{\sqrt{10}}{2}a$로 삼각형이 성립)일 때 성립하므로 최솟값은 $\frac{\sqrt{3}}{4}$이다.
- 작성자 답: $\frac{\sqrt{3}}{4}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-05(사인법칙과 코사인법칙) / H22-A-05-CORE(사인법칙과 코사인법칙 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$에서 $\sin^2 A + 3\sin^」
**RPM** H2-M1-RPM-109 [삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름] **원천→판정: 삼각함수 > 삼각함수의 활용 > 코사인법칙 > 변·각 계산 → 삼각함수 > 삼각함수의 활용 > 사인법칙 > 외접원 반지름**
- 이유: Q23(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 RPM H2-M1-RPM-109 유형에 해당한다.
**유형** PT=PT_H22A_05_COSINE_LAW / TPL=TPL_H22A_05_COSINE_LAW_111 (원천과 같음)
- 이유: Q23(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23(ABC): 사인법칙과 코사인법칙 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「구하는 과정을 풀이 과정과 함께 서술하시오.」
- method: 정리(NAMED)←solution:「세 변의 길이를 $a, b, c$라 하면 사인」
- condition: (없음)

**how** Q23(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 $\frac{\sqrt{3}}{4}$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 변의 길이를 $a, b, c$라 하면 사인법칙에 의해 $\sin A : \sin B : \sin C = a : b : c$이므로 $a^2 + 3b^2 = 4c^2$, 즉 $c^2 = \frac{a^2 + 3b^2}{4}$이다.  
코사인법칙에 대입하면  
$$\cos C = \frac{a^2 + b^2 - c^2}{2ab} = \frac{a^2 + b^2 - \frac{a^2 + 3b^2}{4}}{2ab} = \frac{3a^2 + b^2}{8ab} = \frac{1}{8}\left(\frac{3a}{b} + \frac{b}{a}\right)$$  
$a > 0, b > 0$이므로 산술·기하평균의 부등식에 의하여  
$$\cos C \ge \frac{1}{8} \cdot 2\sqrt{\frac{3a}{b} \cdot \frac{b}{a}} = \frac{\sqrt{3}}{4}$$  
등호는 $\frac{3a}{b} = \frac{b}{a}$ ($b = \sqrt{3}a$, $c = \frac{\sqrt{10}}{2}a$로 삼각형이 성립)일 때 성립하므로 최솟값은 $\frac{\sqrt{3}}{4}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

수열 $\{a_n\}$이 다음과 같이 귀납적으로 정의되어 있다.  
$$a_1 = 1, \qquad a_{n+1} = a_n + \frac{2}{(2n - 1)(2n + 1)} \quad (n = 1, 2, 3, \cdots)$$  
모든 자연수 $n$에 대하여 $a_n = 2 - \frac{1}{2n - 1}$이 성립함을 수학적 귀납법으로 증명하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 주어진 등식은 모든 자연수 $n$에 대하여 성립한다.   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (ⅰ) $n = 1$일 때,  
$a_1 = 1$이고 $2 - \frac{1}{2(1) - 1} = 2 - 1 = 1$이므로 성립한다.
2. (ⅱ) $n = k$일 때 $a_k = 2 - \frac{1}{2k - 1}$이 성립한다고 가정하자.
3. 점화식에 대입하면  
$$a_{k+1} = a_k + \frac{2}{(2k - 1)(2k + 1)} = 2 - \frac{1}{2k - 1} + \frac{2}{(2k - 1)(2k + 1)}$$  
$$= 2 - \frac{(2k + 1) - 2}{(2k - 1)(2k + 1)} = 2 - \frac{2k - 1}{(2k - 1)(2k + 1)} = 2 - \frac{1}{2k + 1}$$  
따라서 $n = k + 1$일 때도 성립한다.
4. (ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $a_n = 2 - \frac{1}{2n - 1}$이 성립한다.
- 작성자 답: 주어진 등식은 모든 자연수 $n$에 대하여 성립한다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-08(수학적 귀납법) / H22-A-08-CORE(수학적 귀납법 핵심 개념) (원천과 같음) (원천과 같음)
- 근거 인용: 「수열 $\{a_n\}$이 다음과 같이 귀납적으로 정의되」
**RPM** H2-M1-RPM-129 [수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기] **원천→판정: 수열 > 수학적 귀납법 > 수학적 귀납법 > 등식 증명 → 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기**
- 이유: Q24(a): 수학적 귀납법 핵심 개념 단원의 RPM H2-M1-RPM-129 유형에 해당한다.
**유형** PT=PT_H22A_08_MATHEMATICAL_INDUCTION / TPL=TPL_H22A_08_MATHEMATICAL_INDUCTION_131 (원천과 같음)
- 이유: Q24(a): 수학적 귀납법 핵심 개념 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24(a): 수학적 귀납법 핵심 개념 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「}$이 성립함을 수학적 귀납법으로 증명하시오.」
- method: 정리(NAMED)←solution:「(ⅰ) $n = 1$일 때,  
$a_1 =」
- condition: (없음)

**how** Q24(a): 발문과 해설의 풀이 과정을 점검하여 정답 주어진 등식은 모든 자연수 $n$에 대하여 성립한다.를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(ⅰ) $n = 1$일 때,  
$a_1 = 1$이고 $2 - \frac{1}{2(1) - 1} = 2 - 1 = 1$이므로 성립한다.

(ⅱ) $n = k$일 때 $a_k = 2 - \frac{1}{2k - 1}$이 성립한다고 가정하자.  
점화식에 대입하면  
$$a_{k+1} = a_k + \frac{2}{(2k - 1)(2k + 1)} = 2 - \frac{1}{2k - 1} + \frac{2}{(2k - 1)(2k + 1)}$$  
$$= 2 - \frac{(2k + 1) - 2}{(2k - 1)(2k + 1)} = 2 - \frac{2k - 1}{(2k - 1)(2k + 1)} = 2 - \frac{1}{2k + 1}$$  
따라서 $n = k + 1$일 때도 성립한다.

(ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $a_n = 2 - \frac{1}{2n - 1}$이 성립한다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
