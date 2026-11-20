# 검수 묶음 — 24_강남여고_1학기_중간_고2_수학I_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 25개 / 검사 PASS 24, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 25
- 난이도 분포: 1단계 7, 2단계 15, 3단계 1, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 검사 코드: CHOICE_ORDER
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 풀이 과정에 정답 값이 등장하지 않음
- **Q24**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

$27^{\frac{2}{3}} \times 3^{-1}$의 값은? [3점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $6$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$
2. $3^{-1} = \dfrac{1}{3}$
3. $27^{\frac{2}{3}} \times 3^{-1} = 9 \times \dfrac{1}{3} = 3$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$27^{\frac{2}{3}} \times 3^{-1}$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q1번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 27)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q1번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 27)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 27)

**4칸**
- given: 정의←solution:「$27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$」
- goal: 정의←solution:「$27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$」
- method: 정의(NAMED)←solution:「$27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$」
- condition: (없음)

**how** Q1번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 27)

<details><summary>저장 해설 (판정 검토용)</summary>

$27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$  
$3^{-1} = \dfrac{1}{3}$  
$27^{\frac{2}{3}} \times 3^{-1} = 9 \times \dfrac{1}{3} = 3$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

$\log_3 a = 4$일 때, 양수 $a$의 값은? [3점]

**보기** ① $27$  ② $81$  ③ $162$  ④ $243$  ⑤ $729$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 로그의 정의에 의하여 $\log_3 a = 4$이면
2. $a = 3^4 = 81$
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$\log_3 a = 4$일 때, 양수 $a$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q2번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 27)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q2번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 27)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 27)

**4칸**
- given: 양수←stem:「$\log_3 a = 4$일 때, 양수 $a$의 값은?」
- goal: 로그←solution:「로그의 정의에 의하여 $\log_3 a = 4$이면」
- method: 정의(NAMED)←solution:「로그의 정의에 의하여 $\log_3 a = 4$이면」
- condition: (없음)

**how** Q2번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 27)

<details><summary>저장 해설 (판정 검토용)</summary>

로그의 정의에 의하여 $\log_3 a = 4$이면  
$a = 3^4 = 81$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 옳지 않은 것은? [3점]

**보기** ① $60^\circ = \dfrac{\pi}{3}$  ② $\dfrac{3}{4}\pi = 135^\circ$  ③ $\dfrac{5}{9}\pi = 100^\circ$  ④ $-150^\circ = -\dfrac{5}{6}\pi$  ⑤ $\dfrac{7}{6}\pi = 240^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\pi\text{ 라디안} = 180^\circ$이므로
2. ① $60^\circ = 60^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{\pi}{3}$ (참)
3. ② $\dfrac{3}{4}\pi = \dfrac{3}{4} \times 180^\circ = 135^\circ$ (참)
4. ③ $\dfrac{5}{9}\pi = \dfrac{5}{9} \times 180^\circ = 100^\circ$ (참)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「다음 중 옳지 않은 것은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q3번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 60)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q3번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 60)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 60)

**4칸**
- given: 라디안←solution:「$\pi\text{ 라디안} = 180^\circ$이므로」
- goal: 거짓←solution:「⑤ $\dfrac{7}{6}\pi = \dfrac{7}{6} \times 180^\circ = 210^\circ \neq 240^\circ$ (거짓)」
- method: 라디안(NAMED)←solution:「$\pi\text{ 라디안} = 180^\circ$이므로」
- condition: (없음)

**how** Q3번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 60)

<details><summary>저장 해설 (판정 검토용)</summary>

$\pi\text{ 라디안} = 180^\circ$이므로  
① $60^\circ = 60^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{\pi}{3}$ (참)  
② $\dfrac{3}{4}\pi = \dfrac{3}{4} \times 180^\circ = 135^\circ$ (참)  
③ $\dfrac{5}{9}\pi = \dfrac{5}{9} \times 180^\circ = 100^\circ$ (참)  
④ $-150^\circ = -150^\circ \times \dfrac{\pi}{180^\circ} = -\dfrac{5}{6}\pi$ (참)  
⑤ $\dfrac{7}{6}\pi = \dfrac{7}{6} \times 180^\circ = 210^\circ \neq 240^\circ$ (거짓)  
따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.5점


**발문**

중심각의 크기가 $\dfrac{\pi}{4}$이고 호의 길이가 $2\pi$인 부채꼴의 넓이는? [3.5점]

**보기** ① $8\pi$  ② $10\pi$  ③ $12\pi$  ④ $14\pi$  ⑤ $16\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 부채꼴의 반지름의 길이를 $r$라 하면 호의 길이 $l = r\theta$이므로
2. $r \cdot \dfrac{\pi}{4} = 2\pi \implies r = 8$
3. 따라서 부채꼴의 넓이 $S$는
4. $S = \dfrac{1}{2}rl = \dfrac{1}{2} \times 8 \times 2\pi = 8\pi$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「중심각의 크기가 $\dfrac{\pi}{4}$이고 호의 길이가 $2\pi$인 부채꼴의 넓이는?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q4번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q4번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 부채꼴←stem:「중심각의 크기가 $\dfrac{\pi}{4}$이고 호의 길이가 $2\pi$인 부채꼴의 넓이는?」
- goal: 중심←stem:「중심각의 크기가 $\dfrac{\pi}{4}$이고 호의 길이가 $2\pi$인 부채꼴의 넓이는?」
- method: 반지름(NAMED)←solution:「부채꼴의 반지름의 길이를 $r$라 하면 호의 길이 $l = r\theta$이므로」
- condition: (없음)

**how** Q4번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴의 반지름의 길이를 $r$라 하면 호의 길이 $l = r\theta$이므로  
$r \cdot \dfrac{\pi}{4} = 2\pi \implies r = 8$  
따라서 부채꼴의 넓이 $S$는  
$S = \dfrac{1}{2}rl = \dfrac{1}{2} \times 8 \times 2\pi = 8\pi$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

방정식 $9^x = \left(\dfrac{1}{3}\right)^{x - 12}$을 만족시키는 실수 $x$의 값은? [3.5점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 양변의 밑을 $3$으로 통일하면
2. $3^{2x} = 3^{-(x - 12)} = 3^{12 - x}$
3. 지수가 같아야 하므로
4. $2x = 12 - x$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「방정식 $9^x = \left(\dfrac{1}{3}\right)^{x - 12}$을 만족시키는 실수 $x$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q5번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q5번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 실수←stem:「방정식 $9^x = \left(\dfrac{1}{3}\right)^{x - 12}$을 만족시키는 실수 $x$의 값은?」
- goal: 방정식←stem:「방정식 $9^x = \left(\dfrac{1}{3}\right)^{x - 12}$을 만족시키는 실수 $x$의 값은?」
- method: 지수(NAMED)←solution:「지수가 같아야 하므로」
- condition: (없음)

**how** Q5번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

양변의 밑을 $3$으로 통일하면  
$3^{2x} = 3^{-(x - 12)} = 3^{12 - x}$  
지수가 같아야 하므로  
$2x = 12 - x$  
$3x = 12 \implies x = 4$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

방정식 $\log_3(2x - 1) = 2$를 만족시키는 실수 $x$의 값은? [3.5점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 진수 조건에 의하여 $2x - 1 > 0$, 즉 $x > \dfrac{1}{2}$
2. 로그의 정의에 의하여
3. $2x - 1 = 3^2 = 9$
4. $2x = 10 \implies x = 5$ (진수 조건 만족)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「방정식 $\log_3(2x - 1) = 2$를 만족시키는 실수 $x$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q6번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q6번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 실수←stem:「방정식 $\log_3(2x - 1) = 2$를 만족시키는 실수 $x$의 값은?」
- goal: 방정식←stem:「방정식 $\log_3(2x - 1) = 2$를 만족시키는 실수 $x$의 값은?」
- method: 진수(NAMED)←solution:「진수 조건에 의하여 $2x - 1 > 0$, 즉 $x > \dfrac{1}{2}$」
- condition: (없음)

**how** Q6번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

진수 조건에 의하여 $2x - 1 > 0$, 즉 $x > \dfrac{1}{2}$  
로그의 정의에 의하여  
$2x - 1 = 3^2 = 9$  
$2x = 10 \implies x = 5$ (진수 조건 만족)

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.5점


**발문**

다음 계산 과정에서 처음으로 등호가 성립하지 않는 곳은? [3.5점]  
$$243 = 3^5 \underset{\text{①}}{=} \{(-3)^2\}^{\frac{5}{2}} \underset{\text{②}}{=} (-3)^5 \underset{\text{③}}{=} (-1)^5 \cdot 3^5 \underset{\text{④}}{=} -3^5 \underset{\text{⑤}}{=} -243$$

**보기** ①   ②   ③   ④   ⑤ 

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① $3^5 = 9^{\frac{5}{2}} = \{(-3)^2\}^{\frac{5}{2}}$은 성립한다.
2. ② 지수가 유리수 $\dfrac{5}{2}$일 때 지수법칙 $(a^m)^n = a^{mn}$은 밑 $a > 0$일 때만 성립하므로 밑이 $-3 < 0$인 $\{(-3)^2\}^{\frac{5}{2}} = (-3)^{2 \cdot \frac{5}{2}} = (-3)^5$은 성립하지 않는다.
3. 따라서 처음으로 등호가 성립하지 않는 곳은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「다음 계산 과정에서 처음으로 등호가 성립하지 않는 곳은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q7번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q7번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 성립←stem:「다음 계산 과정에서 처음으로 등호가 성립하지 않는 곳은?」
- goal: 유리수←solution:「② 지수가 유리수 $\dfrac{5}{2}$일 때 지수법칙 $(a^m)^n = a^{mn}$은 밑 $a > 0$일 때만 성립하므로 밑이 $-3 < 0$인 $\{(-3)^2\}^{\frac{5}{2}} = (-3)^{2 \cdot \frac{5}{2}} = (-3)^5$은 성립하지 않는다.」
- method: 지수(NAMED)←solution:「② 지수가 유리수 $\dfrac{5}{2}$일 때 지수법칙 $(a^m)^n = a^{mn}$은 밑 $a > 0$일 때만 성립하므로 밑이 $-3 < 0$인 $\{(-3)^2\}^{\frac{5}{2}} = (-3)^{2 \cdot \frac{5}{2}} = (-3)^5$은 성립하지 않는다.」
- condition: (없음)

**how** Q7번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

① $3^5 = 9^{\frac{5}{2}} = \{(-3)^2\}^{\frac{5}{2}}$은 성립한다.  
② 지수가 유리수 $\dfrac{5}{2}$일 때 지수법칙 $(a^m)^n = a^{mn}$은 밑 $a > 0$일 때만 성립하므로 밑이 $-3 < 0$인 $\{(-3)^2\}^{\frac{5}{2}} = (-3)^{2 \cdot \frac{5}{2}} = (-3)^5$은 성립하지 않는다.  
따라서 처음으로 등호가 성립하지 않는 곳은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.5점


**발문**

$\sin(-\theta) = \dfrac{\sqrt{5}}{3}$이고 $\tan\theta > 0$일 때, $\cos(\pi + \theta)$의 값은? [3.5점]

**보기** ① $-\dfrac{\sqrt{5}}{3}$  ② $-\dfrac{2}{3}$  ③ $-\dfrac{1}{3}$  ④ $\dfrac{1}{3}$  ⑤ $\dfrac{2}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\sin(-\theta) = -\sin\theta = \dfrac{\sqrt{5}}{3}$이므로 $\sin\theta = -\dfrac{\sqrt{5}}{3} < 0$ (문항 토큰 3.5)
2. $\tan\theta > 0$이고 $\sin\theta < 0$이므로 $\theta$는 제$3$사분면의 각이고 $\cos\theta < 0$이다.
3. $\cos^2\theta = 1 - \sin^2\theta = 1 - \dfrac{5}{9} = \dfrac{4}{9}$
4. $\cos\theta < 0$이므로 $\cos\theta = -\dfrac{2}{3}$
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$\sin(-\theta) = \dfrac{\sqrt{5}}{3}$이고 $\tan\theta > 0$일 때, $\cos(\pi + \theta)$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q8번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q8번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: tan←stem:「$\sin(-\theta) = \dfrac{\sqrt{5}}{3}$이고 $\tan\theta > 0$일 때, $\cos(\pi + \theta)$의 값은?」
- goal: 사분면←solution:「$\tan\theta > 0$이고 $\sin\theta < 0$이므로 $\theta$는 제$3$사분면의 각이고 $\cos\theta < 0$이다.」
- method: 사분면(NAMED)←solution:「$\tan\theta > 0$이고 $\sin\theta < 0$이므로 $\theta$는 제$3$사분면의 각이고 $\cos\theta < 0$이다.」
- condition: (없음)

**how** Q8번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin(-\theta) = -\sin\theta = \dfrac{\sqrt{5}}{3}$이므로 $\sin\theta = -\dfrac{\sqrt{5}}{3} < 0$  
$\tan\theta > 0$이고 $\sin\theta < 0$이므로 $\theta$는 제$3$사분면의 각이고 $\cos\theta < 0$이다.  
$\cos^2\theta = 1 - \sin^2\theta = 1 - \dfrac{5}{9} = \dfrac{4}{9}$  
$\cos\theta < 0$이므로 $\cos\theta = -\dfrac{2}{3}$  
따라서 $\cos(\pi + \theta) = -\cos\theta = \dfrac{2}{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3.5점


**발문**

곡선 $y = 3^{x - 2} + a$의 점근선과 곡선 $y = \log_2(3x - b)$의 점근선의 교점의 좌표가 $(4, 5)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은? [3.5점]

**보기** ① $17$  ② $18$  ③ $19$  ④ $20$  ⑤ $21$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 곡선 $y = 3^{x - 2} + a$의 점근선은 $y = a$이고, 곡선 $y = \log_2(3x - b)$의 점근선은 $3x - b = 0$, 즉 $x = \dfrac{b}{3}$이다.
2. 두 점근선의 교점의 좌표가 $\left(\dfrac{b}{3}, a\right) = (4, 5)$이므로
3. $\dfrac{b}{3} = 4 \implies b = 12$, $a = 5$
4. 따라서 $a + b = 5 + 12 = 17$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「곡선 $y = 3^{x - 2} + a$의 점근선과 곡선 $y = \log_2(3x - b)$의 점근선의 교점의 좌표가 $(4, 5)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q9번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q9번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 점근선←stem:「곡선 $y = 3^{x - 2} + a$의 점근선과 곡선 $y = \log_2(3x - b)$의 점근선의 교점의 좌표가 $(4, 5)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은?」
- goal: 좌표←stem:「곡선 $y = 3^{x - 2} + a$의 점근선과 곡선 $y = \log_2(3x - b)$의 점근선의 교점의 좌표가 $(4, 5)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은?」
- method: 곡선(NAMED)←solution:「곡선 $y = 3^{x - 2} + a$의 점근선은 $y = a$이고, 곡선 $y = \log_2(3x - b)$의 점근선은 $3x - b = 0$, 즉 $x = \dfrac{b}{3}$이다.」
- condition: (없음)

**how** Q9번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

곡선 $y = 3^{x - 2} + a$의 점근선은 $y = a$이고, 곡선 $y = \log_2(3x - b)$의 점근선은 $3x - b = 0$, 즉 $x = \dfrac{b}{3}$이다.  
두 점근선의 교점의 좌표가 $\left(\dfrac{b}{3}, a\right) = (4, 5)$이므로  
$\dfrac{b}{3} = 4 \implies b = 12$, $a = 5$  
따라서 $a + b = 5 + 12 = 17$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

$0 \le x < 2\pi$에서 부등식  
$$\sin x + \cos\left(\dfrac{\pi}{2} - x\right) < \sqrt{3}$$  
의 해가 $0 \le x < a$, $b < x < 2\pi$일 때, $a + b$의 값은? [4점]

**보기** ① $\dfrac{\pi}{2}$  ② $\dfrac{2\pi}{3}$  ③ $\pi$  ④ $\dfrac{4\pi}{3}$  ⑤ $\dfrac{3\pi}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\cos\left(\dfrac{\pi}{2} - x\right) = \sin x$이므로 주어진 부등식은
2. $2\sin x < \sqrt{3} \implies \sin x < \dfrac{\sqrt{3}}{2}$
3. $0 \le x < 2\pi$에서 $\sin x = \dfrac{\sqrt{3}}{2}$인 $x$는 $\dfrac{\pi}{3}, \dfrac{2\pi}{3}$이므로
4. $\sin x < \dfrac{\sqrt{3}}{2}$의 해는 $0 \le x < \dfrac{\pi}{3}$ 또는 $\dfrac{2\pi}{3} < x < 2\pi$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$0 \le x < 2\pi$에서 부등식」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q10번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q10번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 0)

**4칸**
- given: 부등식←stem:「$0 \le x < 2\pi$에서 부등식」
- goal: 등식←stem:「$0 \le x < 2\pi$에서 부등식」
- method: 또는(NAMED)←solution:「$\sin x < \dfrac{\sqrt{3}}{2}$의 해는 $0 \le x < \dfrac{\pi}{3}$ 또는 $\dfrac{2\pi}{3} < x < 2\pi$」
- condition: (없음)

**how** Q10번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 0)

<details><summary>저장 해설 (판정 검토용)</summary>

$\cos\left(\dfrac{\pi}{2} - x\right) = \sin x$이므로 주어진 부등식은  
$2\sin x < \sqrt{3} \implies \sin x < \dfrac{\sqrt{3}}{2}$  
$0 \le x < 2\pi$에서 $\sin x = \dfrac{\sqrt{3}}{2}$인 $x$는 $\dfrac{\pi}{3}, \dfrac{2\pi}{3}$이므로  
$\sin x < \dfrac{\sqrt{3}}{2}$의 해는 $0 \le x < \dfrac{\pi}{3}$ 또는 $\dfrac{2\pi}{3} < x < 2\pi$  
따라서 $a = \dfrac{\pi}{3}$, $b = \dfrac{2\pi}{3}$이므로 $a + b = \dfrac{\pi}{3} + \dfrac{2\pi}{3} = \pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$$\dfrac{\sin\left(\dfrac{\pi}{2} + \theta\right)\tan^2(\pi - \theta)}{\cos\left(\dfrac{3}{2}\pi - \theta\right)} + \dfrac{\sin^3\left(\dfrac{3}{2}\pi + \theta\right)}{\cos(2\pi - \theta)\cos^2\theta} - \dfrac{\cos\left(\dfrac{5}{2}\pi + \theta\right)}{\sin\left(\dfrac{\pi}{2} + \theta\right)}$$  
의 값은? [4점]

**보기** ① $2$  ② $1$  ③ $0$  ④ $-1$  ⑤ $-2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 변환 공식을 적용하면
2. - $\sin\left(\dfrac{\pi}{2} + \theta\right) = \cos\theta$, $\tan(\pi - \theta) = -\tan\theta$, $\cos\left(\dfrac{3}{2}\pi - \theta\right) = -\sin\theta$
3. 첫째 항: $\dfrac{\cos\theta \cdot (-\tan\theta)^2}{-\sin\theta} = \dfrac{\cos\theta \cdot \frac{\sin^2\theta}{\cos^2\theta}}{-\sin\theta} = -\dfrac{\sin\theta}{\cos\theta} = -\tan\theta$
4. - $\sin\left(\dfrac{3}{2}\pi + \theta\right) = -\cos\theta$, $\cos(2\pi - \theta) = \cos\theta$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$$\dfrac{\sin\left(\dfrac{\pi}{2} + \theta\right)\tan^2(\pi - \theta)}{\cos\left(\dfrac{3}{2}\pi - \theta\right)} + \dfrac{\sin^3\left(\dfrac{3}{2}\pi + \theta\right)}{\cos(2\pi - \theta)\cos^2\theta} - \dfrac{\cos\left(\dfrac{5}{2}\pi + \theta\right)}{\sin\left(\dfrac{\pi}{2} + \theta\right)}$$」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q11번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 2)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q11번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 2)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 2)

**4칸**
- given: tan←stem:「$$\dfrac{\sin\left(\dfrac{\pi}{2} + \theta\right)\tan^2(\pi - \theta)}{\cos\left(\dfrac{3}{2}\pi - \theta\right)} + \dfrac{\sin^3\left(\dfrac{3}{2}\pi + \theta\right)}{\cos(2\pi - \theta)\cos^2\theta} - \dfrac{\cos\left(\dfrac{5}{2}\pi + \theta\right)}{\sin\left(\dfrac{\pi}{2} + \theta\right)}$$」
- goal: 변환←solution:「각 변환 공식을 적용하면」
- method: 공식(NAMED)←solution:「각 변환 공식을 적용하면」
- condition: (없음)

**how** Q11번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 2)

<details><summary>저장 해설 (판정 검토용)</summary>

각 변환 공식을 적용하면  
- $\sin\left(\dfrac{\pi}{2} + \theta\right) = \cos\theta$, $\tan(\pi - \theta) = -\tan\theta$, $\cos\left(\dfrac{3}{2}\pi - \theta\right) = -\sin\theta$  
  첫째 항: $\dfrac{\cos\theta \cdot (-\tan\theta)^2}{-\sin\theta} = \dfrac{\cos\theta \cdot \frac{\sin^2\theta}{\cos^2\theta}}{-\sin\theta} = -\dfrac{\sin\theta}{\cos\theta} = -\tan\theta$  
- $\sin\left(\dfrac{3}{2}\pi + \theta\right) = -\cos\theta$, $\cos(2\pi - \theta) = \cos\theta$  
  둘째 항: $\dfrac{(-\cos\theta)^3}{\cos\theta \cdot \cos^2\theta} = \dfrac{-\cos^3\theta}{\cos^3\theta} = -1$  
- $\cos\left(\dfrac{5}{2}\pi + \theta\right) = \cos\left(\dfrac{\pi}{2} + \theta\right) = -\sin\theta$  
  셋째 항: $-\dfrac{-\sin\theta}{\cos\theta} = \tan\theta$  
따라서 전체 식의 값은 $(-\tan\theta) + (-1) + \tan\theta = -1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$-27^5$의 $n$제곱근 중에서 정수인 것이 존재하도록 하는 $2$ 이상의 모든 자연수 $n$의 값의 합은? [4점]

**보기** ① $23$  ② $20$  ③ $18$  ④ $15$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $-27^5 = -(3^3)^5 = -3^{15}$이다.
2. $-3^{15}$의 $n$제곱근 중 실수가 존재하고 그 값이 정수가 되려면
3. 1) 음수의 짝수 제곱근은 실수가 아니므로 $n$은 홀수여야 한다.
4. 2) 이때 유일한 실수인 $n$제곱근은 $-3^{\frac{15}{n}}$이고, 이 값이 정수가 되려면 $\dfrac{15}{n}$이 자연수여야 하므로 $n$은 $15$의 약수여야 한다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$-27^5$의 $n$제곱근 중에서 정수인 것이 존재하도록 하는 $2$ 이상의 모든 자연수 $n$의 값의 합은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q12번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 27)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q12번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 27)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 27)

**4칸**
- given: 자연수←stem:「$-27^5$의 $n$제곱근 중에서 정수인 것이 존재하도록 하는 $2$ 이상의 모든 자연수 $n$의 값의 합은?」
- goal: 정수←stem:「$-27^5$의 $n$제곱근 중에서 정수인 것이 존재하도록 하는 $2$ 이상의 모든 자연수 $n$의 값의 합은?」
- method: 실수(NAMED)←solution:「$-3^{15}$의 $n$제곱근 중 실수가 존재하고 그 값이 정수가 되려면」
- condition: (없음)

**how** Q12번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 27)

<details><summary>저장 해설 (판정 검토용)</summary>

$-27^5 = -(3^3)^5 = -3^{15}$이다.  
$-3^{15}$의 $n$제곱근 중 실수가 존재하고 그 값이 정수가 되려면  
1) 음수의 짝수 제곱근은 실수가 아니므로 $n$은 홀수여야 한다.  
2) 이때 유일한 실수인 $n$제곱근은 $-3^{\frac{15}{n}}$이고, 이 값이 정수가 되려면 $\dfrac{15}{n}$이 자연수여야 하므로 $n$은 $15$의 약수여야 한다.  
$2$ 이상의 홀수인 $15$의 약수는 $n = 3, 5, 15$이다.  
따라서 모든 $n$의 값의 합은 $3 + 5 + 15 = 23$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

실수 $x$와 $2$ 이상의 자연수 $n$에 대하여 $x$의 $n$제곱근 중에서 실수인 것의 개수를 $f_n(x)$라 할 때,  
$$f_3\left(\cos\dfrac{2\pi}{3}\right) + f_4\left(\sin\dfrac{7\pi}{6}\right) + f_5\left(\tan\dfrac{3\pi}{4}\right) + f_6\left(\cos\dfrac{\pi}{6}\right)$$  
의 값은? [4점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 삼각함수의 값의 부호를 구하면
2. - $\cos\dfrac{2\pi}{3} = -\dfrac{1}{2} < 0$, $n = 3$ (홀수) $\implies f_3\left(-\dfrac{1}{2}\right) = 1$
3. - $\sin\dfrac{7\pi}{6} = -\dfrac{1}{2} < 0$, $n = 4$ (짝수) $\implies f_4\left(-\dfrac{1}{2}\right) = 0$
4. - $\tan\dfrac{3\pi}{4} = -1 < 0$, $n = 5$ (홀수) $\implies f_5(-1) = 1$
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「실수 $x$와 $2$ 이상의 자연수 $n$에 대하여 $x$의 $n$제곱근 중에서 실수인 것의 개수를 $f_n(x)$라 할 때,」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q13번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 x)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q13번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 x)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 x)

**4칸**
- given: 자연수←stem:「실수 $x$와 $2$ 이상의 자연수 $n$에 대하여 $x$의 $n$제곱근 중에서 실수인 것의 개수를 $f_n(x)$라 할 때,」
- goal: 실수←stem:「실수 $x$와 $2$ 이상의 자연수 $n$에 대하여 $x$의 $n$제곱근 중에서 실수인 것의 개수를 $f_n(x)$라 할 때,」
- method: 부호(NAMED)←solution:「각 삼각함수의 값의 부호를 구하면」
- condition: (없음)

**how** Q13번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 x)

<details><summary>저장 해설 (판정 검토용)</summary>

각 삼각함수의 값의 부호를 구하면  
- $\cos\dfrac{2\pi}{3} = -\dfrac{1}{2} < 0$, $n = 3$ (홀수) $\implies f_3\left(-\dfrac{1}{2}\right) = 1$  
- $\sin\dfrac{7\pi}{6} = -\dfrac{1}{2} < 0$, $n = 4$ (짝수) $\implies f_4\left(-\dfrac{1}{2}\right) = 0$  
- $\tan\dfrac{3\pi}{4} = -1 < 0$, $n = 5$ (홀수) $\implies f_5(-1) = 1$  
- $\cos\dfrac{\pi}{6} = \dfrac{\sqrt{3}}{2} > 0$, $n = 6$ (짝수) $\implies f_6\left(\dfrac{\sqrt{3}}{2}\right) = 2$  
따라서 구하는 값은 $1 + 0 + 1 + 2 = 4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$x$에 대한 이차방정식 $x^2 - 4x + 5a\sin\theta = 0$의 두 근이 $\cos\theta, \tan\theta$일 때, $\dfrac{1 + \sin\theta - \sin^2\theta}{a\cos\theta}$의 값은? (단, $0 < \theta < \dfrac{\pi}{2}$) [4점]

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차방정식의 근과 계수의 관계에 의하여 (문항 토큰 12)
2. $\cos\theta + \tan\theta = 4$, $\cos\theta\tan\theta = 5a\sin\theta$
3. $\cos\theta\tan\theta = \cos\theta \cdot \dfrac{\sin\theta}{\cos\theta} = \sin\theta$이고 $0 < \theta < \dfrac{\pi}{2}$에서 $\sin\theta > 0$이므로
4. $\sin\theta = 5a\sin\theta \implies a = \dfrac{1}{5}$
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$x$에 대한 이차방정식 $x^2 - 4x + 5a\sin\theta = 0$의 두 근이 $\cos\theta, \tan\theta$일 때, $\dfrac{1 + \sin\theta - \sin^2\theta}{a\cos\theta}$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q14번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q14번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 방정식←stem:「$x$에 대한 이차방정식 $x^2 - 4x + 5a\sin\theta = 0$의 두 근이 $\cos\theta, \tan\theta$일 때, $\dfrac{1 + \sin\theta - \sin^2\theta}{a\cos\theta}$의 값은?」
- goal: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2 - 4x + 5a\sin\theta = 0$의 두 근이 $\cos\theta, \tan\theta$일 때, $\dfrac{1 + \sin\theta - \sin^2\theta}{a\cos\theta}$의 값은?」
- method: 계수(NAMED)←solution:「이차방정식의 근과 계수의 관계에 의하여」
- condition: (없음)

**how** Q14번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식의 근과 계수의 관계에 의하여  
$\cos\theta + \tan\theta = 4$, $\cos\theta\tan\theta = 5a\sin\theta$  
$\cos\theta\tan\theta = \cos\theta \cdot \dfrac{\sin\theta}{\cos\theta} = \sin\theta$이고 $0 < \theta < \dfrac{\pi}{2}$에서 $\sin\theta > 0$이므로  
$\sin\theta = 5a\sin\theta \implies a = \dfrac{1}{5}$  
한편 $1 - \sin^2\theta = \cos^2\theta$이므로 구하는 식은  
$\dfrac{1 + \sin\theta - \sin^2\theta}{a\cos\theta} = \dfrac{\cos^2\theta + \sin\theta}{\frac{1}{5}\cos\theta} = 5\left(\cos\theta + \dfrac{\sin\theta}{\cos\theta}\right) = 5(\cos\theta + \tan\theta)$  
$= 5 \times 4 = 20$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

조류 발전은 빠른 유속을 이용하여 전기를 생산하는 방식으로 어느 조류 발전기는 유속이 $3\sqrt{3}\text{ m/s}$ 이상일 때 발전이 가능하다고 한다. 이 조류 발전기가 설치된 어느 지역에서 시각이 $x$시일 때 유속을 $f(x)\text{ m/s}$라고 하면  
$$f(x) = 6\sin\dfrac{\pi}{12}x \quad (0 \le x \le 12)$$  
라고 한다. $0$시부터 $12$시까지 조류 발전이 가능한 시간은 몇 시간 동안인가? [4점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조류 발전이 가능하려면 $f(x) \ge 3\sqrt{3}$이어야 하므로
2. $6\sin\dfrac{\pi}{12}x \ge 3\sqrt{3} \implies \sin\dfrac{\pi}{12}x \ge \dfrac{\sqrt{3}}{2}$
3. $0 \le x \le 12$에서 $0 \le \dfrac{\pi}{12}x \le \pi$이므로
4. $\dfrac{\pi}{3} \le \dfrac{\pi}{12}x \le \dfrac{2\pi}{3}$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「조류 발전은 빠른 유속을 이용하여 전기를 생산하는 방식으로 어느 조류 발전기는 유속이 $3\sqrt{3}\text{ m/s}$ 이상일 때 발전이 가능하다고 한다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q15번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q15번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 정의←solution:「조류 발전이 가능하려면 $f(x) \ge 3\sqrt{3}$이어야 하므로」
- goal: 정의←solution:「조류 발전이 가능하려면 $f(x) \ge 3\sqrt{3}$이어야 하므로」
- method: 정의(NAMED)←solution:「조류 발전이 가능하려면 $f(x) \ge 3\sqrt{3}$이어야 하므로」
- condition: (없음)

**how** Q15번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

조류 발전이 가능하려면 $f(x) \ge 3\sqrt{3}$이어야 하므로  
$6\sin\dfrac{\pi}{12}x \ge 3\sqrt{3} \implies \sin\dfrac{\pi}{12}x \ge \dfrac{\sqrt{3}}{2}$  
$0 \le x \le 12$에서 $0 \le \dfrac{\pi}{12}x \le \pi$이므로  
$\dfrac{\pi}{3} \le \dfrac{\pi}{12}x \le \dfrac{2\pi}{3}$  
$4 \le x \le 8$  
따라서 발전이 가능한 시간은 $8 - 4 = 4$시간 동안이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

이차함수 $f(x) = \dfrac{x^2}{9} - 4$와 일차함수 $g(x) = \dfrac{2}{3}x + 2$에 대하여 부등식  
$$\log_{\frac{1}{3}} |f(x)| > \log_{\frac{1}{3}} |g(x)|$$  
를 만족시키는 정수 $x$의 개수는? [4점]

**보기** ① $7$  ② $8$  ③ $9$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑이 $\dfrac{1}{3}$ ($0 < \dfrac{1}{3} < 1$)이고 진수 조건 $|f(x)| > 0, |g(x)| > 0$을 고려하면
2. $0 < |f(x)| < |g(x)|$
3. $|f(x)| < |g(x)|$는 $\{f(x) - g(x)\}\{f(x) + g(x)\} < 0$과 같다.
4. (1) $f(x) = g(x)$: $\dfrac{x^2}{9} - 4 = \dfrac{2}{3}x + 2 \implies x^2 - 6x - 54 = 0$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「이차함수 $f(x) = \dfrac{x^2}{9} - 4$와 일차함수 $g(x) = \dfrac{2}{3}x + 2$에 대하여 부등식」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q16번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q16번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 부등식←stem:「이차함수 $f(x) = \dfrac{x^2}{9} - 4$와 일차함수 $g(x) = \dfrac{2}{3}x + 2$에 대하여 부등식」
- goal: 함수←stem:「이차함수 $f(x) = \dfrac{x^2}{9} - 4$와 일차함수 $g(x) = \dfrac{2}{3}x + 2$에 대하여 부등식」
- method: 진수(NAMED)←solution:「밑이 $\dfrac{1}{3}$ ($0 < \dfrac{1}{3} < 1$)이고 진수 조건 $|f(x)| > 0, |g(x)| > 0$을 고려하면」
- condition: (없음)

**how** Q16번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

밑이 $\dfrac{1}{3}$ ($0 < \dfrac{1}{3} < 1$)이고 진수 조건 $|f(x)| > 0, |g(x)| > 0$을 고려하면  
$0 < |f(x)| < |g(x)|$  
$|f(x)| < |g(x)|$는 $\{f(x) - g(x)\}\{f(x) + g(x)\} < 0$과 같다.  
(1) $f(x) = g(x)$: $\dfrac{x^2}{9} - 4 = \dfrac{2}{3}x + 2 \implies x^2 - 6x - 54 = 0$  
근은 $x = 3 - 3\sqrt{7} \approx -4.94$ ($r_2$), $x = 3 + 3\sqrt{7} \approx 10.94$ ($r_4$)  
(2) $f(x) = -g(x)$: $\dfrac{x^2}{9} - 4 = -\dfrac{2}{3}x - 2 \implies x^2 + 6x - 18 = 0$  
근은 $x = -3 - 3\sqrt{3} \approx -8.20$ ($r_1$), $x = -3 + 3\sqrt{3} \approx 2.20$ ($r_3$)  
$r_1 < r_2 < r_3 < r_4$이고 $f - g$, $f + g$ 모두 최고차항 계수가 양수이므로 해는 $(r_1, r_2)$ 또는 $(r_3, r_4)$이다.  
- $(r_1, r_2) \approx (-8.20, -4.94)$의 정수: $-8, -7, -6, -5$ 중 $f(-6) = 0$이므로 $-6$ 제외 $\implies -8, -7, -5$ ($3$개)  
- $(r_3, r_4) \approx (2.20, 10.94)$의 정수: $3, 4, 5, 6, 7, 8, 9, 10$ 중 $f(6) = 0$이므로 $6$ 제외 $\implies 3, 4, 5, 7, 8, 9, 10$ ($7$개)  
따라서 구하는 정수 $x$의 개수는 $3 + 7 = 10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

함수 $f(x) = -2^{|x - a|} + a$의 그래프가 $x$축과 두 점 $A, B$에서 만나고 $\overline{AB} = 8$이다. 함수 $f(x)$가 $x = p$에서 최댓값 $q$를 가질 때, $p + q$의 값은? (단, $a$는 상수이다.) [4점]

**보기** ① $31$  ② $32$  ③ $33$  ④ $34$  ⑤ $35$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x) = 0$에서 $2^{|x - a|} = a$이므로
2. $|x - a| = \log_2 a \implies x = a \pm \log_2 a$
3. 두 교점 사이의 거리가 $\overline{AB} = 2\log_2 a = 8$이므로
4. $\log_2 a = 4 \implies a = 2^4 = 16$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「함수 $f(x) = -2^{|x - a|} + a$의 그래프가 $x$축과 두 점 $A, B$에서 만나고 $\overline{AB} = 8$이다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q17번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q17번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 함수←stem:「함수 $f(x) = -2^{|x - a|} + a$의 그래프가 $x$축과 두 점 $A, B$에서 만나고 $\overline{AB} = 8$이다.」
- goal: 그래프←stem:「함수 $f(x) = -2^{|x - a|} + a$의 그래프가 $x$축과 두 점 $A, B$에서 만나고 $\overline{AB} = 8$이다.」
- method: 교점(NAMED)←solution:「두 교점 사이의 거리가 $\overline{AB} = 2\log_2 a = 8$이므로」
- condition: (없음)

**how** Q17번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x) = 0$에서 $2^{|x - a|} = a$이므로  
$|x - a| = \log_2 a \implies x = a \pm \log_2 a$  
두 교점 사이의 거리가 $\overline{AB} = 2\log_2 a = 8$이므로  
$\log_2 a = 4 \implies a = 2^4 = 16$  
한편 $|x - 16| \ge 0$이므로 $2^{|x - 16|} \ge 1$이고, 따라서  
$f(x) = -2^{|x - 16|} + 16 \le -1 + 16 = 15$  
등호는 $x = 16$일 때 성립하므로 $p = 16$, $q = 15$이다.  
따라서 $p + q = 16 + 15 = 31$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.5점


**발문**

상수 $k$에 대하여 함수 $f(x) = \log_3(x - 2) + k$의 그래프의 점근선이 함수 $g(x) = \log_3(x + 7) + 4$의 그래프와 만나는 점을 $A$, 점 $A$를 지나고 기울기가 $-1$인 직선이 함수 $y = f(x)$의 그래프와 만나는 점을 $B$라 하자. 선분 $AB$의 길이가 $3\sqrt{2}$일 때, $k$의 값은? [4.5점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $f(x) = \log_3(x - 2) + k$의 점근선은 직선 $x = 2$이다.
2. $x = 2$를 $g(x) = \log_3(x + 7) + 4$에 대입하면
3. $g(2) = \log_3 9 + 4 = 2 + 4 = 6 \implies A(2, 6)$
4. 점 $B$는 $y = f(x)$ 위의 점이므로 $x$좌표가 $2$보다 크고, 점 $A$를 지나며 기울기가 $-1$인 직선 위에 있으면서 $\overline{AB} = 3\sqrt{2}$이므로
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「상수 $k$에 대하여 함수 $f(x) = \log_3(x - 2) + k$의 그래프의 점근선이 함수 $g(x) = \log_3(x + 7) + 4$의 그래프와 만나는 점을 $A$, 점 $A$를 지나고 기울기가 $-1$인 직선이 함수 $y = f(x)$의 그래프와 만나는 점을 $B$라 하자.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q18번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q18번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 함수←stem:「상수 $k$에 대하여 함수 $f(x) = \log_3(x - 2) + k$의 그래프의 점근선이 함수 $g(x) = \log_3(x + 7) + 4$의 그래프와 만나는 점을 $A$, 점 $A$를 지나고 기울기가 $-1$인 직선이 함수 $y = f(x)$의 그래프와 만나는 점을 $B$라 하자.」
- goal: 그래프←stem:「상수 $k$에 대하여 함수 $f(x) = \log_3(x - 2) + k$의 그래프의 점근선이 함수 $g(x) = \log_3(x + 7) + 4$의 그래프와 만나는 점을 $A$, 점 $A$를 지나고 기울기가 $-1$인 직선이 함수 $y = f(x)$의 그래프와 만나는 점을 $B$라 하자.」
- method: 점근선(NAMED)←solution:「함수 $f(x) = \log_3(x - 2) + k$의 점근선은 직선 $x = 2$이다.」
- condition: (없음)

**how** Q18번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $f(x) = \log_3(x - 2) + k$의 점근선은 직선 $x = 2$이다.  
$x = 2$를 $g(x) = \log_3(x + 7) + 4$에 대입하면  
$g(2) = \log_3 9 + 4 = 2 + 4 = 6 \implies A(2, 6)$  
점 $B$는 $y = f(x)$ 위의 점이므로 $x$좌표가 $2$보다 크고, 점 $A$를 지나며 기울기가 $-1$인 직선 위에 있으면서 $\overline{AB} = 3\sqrt{2}$이므로  
$B = (2 + 3, 6 - 3) = (5, 3)$  
점 $B(5, 3)$이 곡선 $y = \log_3(x - 2) + k$ 위의 점이므로  
$3 = \log_3(5 - 2) + k = 1 + k \implies k = 2$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.5점


**발문**

두 함수 $f(x) = -a^x - \log_2 a$, $g(x) = a^x + \log_2 a$가 다음 <조건>을 만족시킬 때, 양수 $a$의 값은? (단, $a \neq 1$) [4.5점]  
<조건>  
(가) 두 곡선 $y = f(x)$, $y = g(x)$는 만나지 않는다.  
(나) 두 곡선 $y = f(x)$, $y = g(x)$의 두 점근선 사이의 거리는 $6$이다.

**보기** ① $\dfrac{1}{8}$  ② $\dfrac{1}{4}$  ③ $2$  ④ $4$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 곡선 $y = f(x)$와 $y = g(x)$의 점근선은 각각 $y = -\log_2 a$, $y = \log_2 a$이다. (문항 토큰 4.5)
2. 조건 (나)에서 두 점근선 사이의 거리가 $6$이므로
3. $|\log_2 a - (-\log_2 a)| = 2|\log_2 a| = 6 \implies |\log_2 a| = 3$
4. $\log_2 a = 3$ 또는 $\log_2 a = -3$, 즉 $a = 8$ 또는 $a = \dfrac{1}{8}$
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「두 함수 $f(x) = -a^x - \log_2 a$, $g(x) = a^x + \log_2 a$가 다음 <조건>을 만족시킬 때, 양수 $a$의 값은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q19번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q19번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.5)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 4.5)

**4칸**
- given: 함수←stem:「두 함수 $f(x) = -a^x - \log_2 a$, $g(x) = a^x + \log_2 a$가 다음 <조건>을 만족시킬 때, 양수 $a$의 값은?」
- goal: 조건←stem:「두 함수 $f(x) = -a^x - \log_2 a$, $g(x) = a^x + \log_2 a$가 다음 <조건>을 만족시킬 때, 양수 $a$의 값은?」
- method: 점근선(NAMED)←solution:「두 곡선 $y = f(x)$와 $y = g(x)$의 점근선은 각각 $y = -\log_2 a$, $y = \log_2 a$이다.」
- condition: (없음)

**how** Q19번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 4.5)

<details><summary>저장 해설 (판정 검토용)</summary>

두 곡선 $y = f(x)$와 $y = g(x)$의 점근선은 각각 $y = -\log_2 a$, $y = \log_2 a$이다.  
조건 (나)에서 두 점근선 사이의 거리가 $6$이므로  
$|\log_2 a - (-\log_2 a)| = 2|\log_2 a| = 6 \implies |\log_2 a| = 3$  
$\log_2 a = 3$ 또는 $\log_2 a = -3$, 즉 $a = 8$ 또는 $a = \dfrac{1}{8}$  
한편 조건 (가)에서 방정식 $f(x) = g(x)$는  
$-a^x - \log_2 a = a^x + \log_2 a \iff a^x = -\log_2 a$  
모든 실수 $x$에 대하여 $a^x > 0$이므로 두 곡선이 만나지 않으려면 $-\log_2 a \le 0$, 즉 $\log_2 a \ge 0$이어야 한다.  
따라서 $a = 8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.5점


**발문**

곡선 $y = \sin 2x$가 $x$축과 만나는 점과 곡선 $y = \sin 3x$가 $x$축과 만나는 점의 $x$좌표 중 음이 아닌 수를 작은 것부터 차례대로 나열한 것을 $x_1, x_2, x_3, \dots$이라 하자. $x_3 \le x \le x_7$에서 함수 $y = \cos \dfrac{2}{3}x$가 $x = a$에서 최댓값을 갖고 $x = b$에서 최솟값을 가질 때, $a + b$의 값은? [4.5점]

**보기** ① $2\pi$  ② $\dfrac{13}{6}\pi$  ③ $\dfrac{7}{3}\pi$  ④ $\dfrac{5}{2}\pi$  ⑤ $\dfrac{8}{3}\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = \sin 2x$의 $x$절편은 $\dfrac{k\pi}{2}$ ($k \ge 0$인 정수), $y = \sin 3x$의 $x$절편은 $\dfrac{m\pi}{3}$ ($m \ge 0$인 정수)이다. (문항 토큰 4.5)
2. 이 수들을 작은 것부터 차례로 나열하면
3. $x_1 = 0, \; x_2 = \dfrac{\pi}{3}, \; x_3 = \dfrac{\pi}{2}, \; x_4 = \dfrac{2\pi}{3}, \; x_5 = \pi, \; x_6 = \dfrac{4\pi}{3}, \; x_7 = \dfrac{3\pi}{2}, \dots$
4. 따라서 구간은 $\dfrac{\pi}{2} \le x \le \dfrac{3\pi}{2}$이고, $\dfrac{2}{3}x$의 범위는 $\dfrac{\pi}{3} \le \dfrac{2}{3}x \le \pi$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「곡선 $y = \sin 2x$가 $x$축과 만나는 점과 곡선 $y = \sin 3x$가 $x$축과 만나는 점의 $x$좌표 중 음이 아닌 수를 작은 것부터 차례대로 나열한 것을 $x_1, x_2, x_3, \dots$이라 하자.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q20번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q20번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 4.5)

**4칸**
- given: 좌표←stem:「곡선 $y = \sin 2x$가 $x$축과 만나는 점과 곡선 $y = \sin 3x$가 $x$축과 만나는 점의 $x$좌표 중 음이 아닌 수를 작은 것부터 차례대로 나열한 것을 $x_1, x_2, x_3, \dots$이라 하자.」
- goal: 곡선←stem:「곡선 $y = \sin 2x$가 $x$축과 만나는 점과 곡선 $y = \sin 3x$가 $x$축과 만나는 점의 $x$좌표 중 음이 아닌 수를 작은 것부터 차례대로 나열한 것을 $x_1, x_2, x_3, \dots$이라 하자.」
- method: 정수(NAMED)←solution:「$y = \sin 2x$의 $x$절편은 $\dfrac{k\pi}{2}$ ($k \ge 0$인 정수), $y = \sin 3x$의 $x$절편은 $\dfrac{m\pi}{3}$ ($m \ge 0$인 정수)이다.」
- condition: (없음)

**how** Q20번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 4.5)

<details><summary>저장 해설 (판정 검토용)</summary>

$y = \sin 2x$의 $x$절편은 $\dfrac{k\pi}{2}$ ($k \ge 0$인 정수), $y = \sin 3x$의 $x$절편은 $\dfrac{m\pi}{3}$ ($m \ge 0$인 정수)이다.  
이 수들을 작은 것부터 차례로 나열하면  
$x_1 = 0, \; x_2 = \dfrac{\pi}{3}, \; x_3 = \dfrac{\pi}{2}, \; x_4 = \dfrac{2\pi}{3}, \; x_5 = \pi, \; x_6 = \dfrac{4\pi}{3}, \; x_7 = \dfrac{3\pi}{2}, \dots$  
따라서 구간은 $\dfrac{\pi}{2} \le x \le \dfrac{3\pi}{2}$이고, $\dfrac{2}{3}x$의 범위는 $\dfrac{\pi}{3} \le \dfrac{2}{3}x \le \pi$이다.  
구간 $\left[\dfrac{\pi}{3}, \pi\right]$에서 코사인함수는 감소하므로  
- $x = \dfrac{\pi}{2}$일 때 최댓값 $\cos\dfrac{\pi}{3} = \dfrac{1}{2}$ $\implies a = \dfrac{\pi}{2}$  
- $x = \dfrac{3\pi}{2}$일 때 최솟값 $\cos\pi = -1$ $\implies b = \dfrac{3\pi}{2}$  
따라서 $a + b = \dfrac{\pi}{2} + \dfrac{3\pi}{2} = 2\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 양수 $a, b$에 대하여 $0 \le x \le 2\pi$에서 정의된 함수 $f(x) = a\sin 2x + b$가 있다. $-a + b \le t \le a + b$인 실수 $t$에 대하여 함수 $y = f(x)$의 그래프와 직선 $y = t$가 만나는 서로 다른 모든 점의 $x$좌표의 합을 $g(t)$라 하자. 함수 $g(t)$가 다음 <조건>을 만족시킬 때, $ab$의 값은? [4.5점]  
<조건>  
(가) $g(2) + g(5) = \dfrac{13}{2}\pi$  
(나) 함수 $g(t)$는 $t = 12$일 때 최솟값을 갖는다.

**보기** ① $20$  ② $24$  ③ $32$  ④ $35$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $0 \le x \le 2\pi$에서 $y = a\sin 2x + b$는 주기가 $\pi$이므로 $2$주기가 그려진다. (문항 토큰 ab)
2. $t$의 값에 따른 교점의 $x$좌표의 합 $g(t)$는 다음과 같다.
3. - $t = a + b$: 교점은 $\dfrac{\pi}{4}, \dfrac{5\pi}{4}$이므로 $g(a + b) = \dfrac{3}{2}\pi$
4. - $b < t < a + b$ 또는 $-a + b < t < b$: 교점이 $4$개이고 $x = \pi$에 대해 대칭이거나 각 주기의 합이 $2\pi$이므로 $g(t) = 4\pi$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「두 양수 $a, b$에 대하여 $0 \le x \le 2\pi$에서 정의된 함수 $f(x) = a\sin 2x + b$가 있다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q21번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ab)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q21번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ab)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 ab)

**4칸**
- given: 함수←stem:「두 양수 $a, b$에 대하여 $0 \le x \le 2\pi$에서 정의된 함수 $f(x) = a\sin 2x + b$가 있다.」
- goal: 정의←stem:「두 양수 $a, b$에 대하여 $0 \le x \le 2\pi$에서 정의된 함수 $f(x) = a\sin 2x + b$가 있다.」
- method: 주기(NAMED)←solution:「$0 \le x \le 2\pi$에서 $y = a\sin 2x + b$는 주기가 $\pi$이므로 $2$주기가 그려진다.」
- condition: (없음)

**how** Q21번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ab)

<details><summary>저장 해설 (판정 검토용)</summary>

$0 \le x \le 2\pi$에서 $y = a\sin 2x + b$는 주기가 $\pi$이므로 $2$주기가 그려진다.  
$t$의 값에 따른 교점의 $x$좌표의 합 $g(t)$는 다음과 같다.  
- $t = a + b$: 교점은 $\dfrac{\pi}{4}, \dfrac{5\pi}{4}$이므로 $g(a + b) = \dfrac{3}{2}\pi$  
- $b < t < a + b$ 또는 $-a + b < t < b$: 교점이 $4$개이고 $x = \pi$에 대해 대칭이거나 각 주기의 합이 $2\pi$이므로 $g(t) = 4\pi$  
- $t = b$: 교점은 $0, \dfrac{\pi}{2}, \pi, \dfrac{3\pi}{2}, 2\pi$이므로 $g(b) = 5\pi$  
- $t = -a + b$: 교점은 $\dfrac{3\pi}{4}, \dfrac{7\pi}{4}$이므로 $g(-a + b) = \dfrac{5}{2}\pi$  
조건 (나)에서 $g(t)$의 최솟값은 $\dfrac{3}{2}\pi$이고 그때 $t = a + b$이므로 $a + b = 12$  
조건 (가)에서 $g(2) + g(5) = \dfrac{13}{2}\pi = \dfrac{5}{2}\pi + 4\pi$이므로 $t = 2$가 최솟값 $-a + b$이고 $t = 5$는 $-a + b < 5 < b$를 만족한다.  
따라서 $-a + b = 2$, $a + b = 12$를 연립하면 $b = 7, a = 5$ (이때 $-a+b=2 < 5 < 7=b$ 성립)  
그러므로 $ab = 5 \times 7 = 35$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

서술형1. 원점 $O$와 점 $P(-5, 12)$를 지나는 동경 $OP$가 나타내는 각을 $\theta$라 할 때, $\sin\theta + \cos\theta + \tan\theta = -\dfrac{q}{p}$이다. 이때 $p + q$의 값을 구하시오. (단, $p$와 $q$는 서로소인 자연수이다.) [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $186$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $r = \overline{OP} = \sqrt{(-5)^2 + 12^2} = \sqrt{25 + 144} = 13$
2. 삼각함수의 정의에 의하여
3. $\sin\theta = \dfrac{12}{13}$, $\cos\theta = -\dfrac{5}{13}$, $\tan\theta = -\dfrac{12}{5}$
4. $\sin\theta + \cos\theta + \tan\theta = \dfrac{12}{13} - \dfrac{5}{13} - \dfrac{12}{5} = \dfrac{7}{13} - \dfrac{12}{5} = \dfrac{35 - 156}{65} = -\dfrac{121}{65}$
- 작성자 답: $186$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「서술형1.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q22번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q22번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 동경←stem:「원점 $O$와 점 $P(-5, 12)$를 지나는 동경 $OP$가 나타내는 각을 $\theta$라 할 때, $\sin\theta + \cos\theta + \tan\theta = -\dfrac{q}{p}$이다.」
- goal: 지나는←stem:「원점 $O$와 점 $P(-5, 12)$를 지나는 동경 $OP$가 나타내는 각을 $\theta$라 할 때, $\sin\theta + \cos\theta + \tan\theta = -\dfrac{q}{p}$이다.」
- method: 함수(NAMED)←solution:「삼각함수의 정의에 의하여」
- condition: (없음)

**how** Q22번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $186$을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

$r = \overline{OP} = \sqrt{(-5)^2 + 12^2} = \sqrt{25 + 144} = 13$  
삼각함수의 정의에 의하여  
$\sin\theta = \dfrac{12}{13}$, $\cos\theta = -\dfrac{5}{13}$, $\tan\theta = -\dfrac{12}{5}$  
$\sin\theta + \cos\theta + \tan\theta = \dfrac{12}{13} - \dfrac{5}{13} - \dfrac{12}{5} = \dfrac{7}{13} - \dfrac{12}{5} = \dfrac{35 - 156}{65} = -\dfrac{121}{65}$  
$65$와 $121$은 서로소이므로 $p = 65$, $q = 121$이다.  
따라서 $p + q = 65 + 121 = 186$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

서술형2. 두 부등식 $\left(\dfrac{1}{2}\right)^{2x} > \dfrac{1}{64}$, $27^{x^2 + 2x - 4} \le 9^{x^2 + x}$을 모두 만족시키는 정수 $x$의 개수를 구하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $9$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\left(\dfrac{1}{2}\right)^{2x} > \left(\dfrac{1}{2}\right)^6$에서 밑 $\dfrac{1}{2} < 1$이므로
2. $2x < 6 \implies x < 3$
3. (2) $27^{x^2 + 2x - 4} \le 9^{x^2 + x}$에서 밑을 $3$으로 통일하면
4. $3^{3(x^2 + 2x - 4)} \le 3^{2(x^2 + x)}$
- 작성자 답: $9$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「서술형2.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q23번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 64)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q23번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 64)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 64)

**4칸**
- given: 정수←stem:「두 부등식 $\left(\dfrac{1}{2}\right)^{2x} > \dfrac{1}{64}$, $27^{x^2 + 2x - 4} \le 9^{x^2 + x}$을 모두 만족시키는 정수 $x$의 개수를 구하시오.」
- goal: 부등식←stem:「두 부등식 $\left(\dfrac{1}{2}\right)^{2x} > \dfrac{1}{64}$, $27^{x^2 + 2x - 4} \le 9^{x^2 + x}$을 모두 만족시키는 정수 $x$의 개수를 구하시오.」
- method: 범위(NAMED)←solution:「(1), (2)의 공통 범위는 $-6 \le x \le 2$이므로 정수 $x$는 $-6, -5, \dots, 2$의 $9$개이다.」
- condition: (없음)

**how** Q23번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $9$을(를) 바르게 구하였다. (문항 토큰 64)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\left(\dfrac{1}{2}\right)^{2x} > \left(\dfrac{1}{2}\right)^6$에서 밑 $\dfrac{1}{2} < 1$이므로  
$2x < 6 \implies x < 3$  
(2) $27^{x^2 + 2x - 4} \le 9^{x^2 + x}$에서 밑을 $3$으로 통일하면  
$3^{3(x^2 + 2x - 4)} \le 3^{2(x^2 + x)}$  
밑 $3 > 1$이므로  
$3x^2 + 6x - 12 \le 2x^2 + 2x$  
$x^2 + 4x - 12 \le 0 \implies (x + 6)(x - 2) \le 0 \implies -6 \le x \le 2$  
(1), (2)의 공통 범위는 $-6 \le x \le 2$이므로 정수 $x$는 $-6, -5, \dots, 2$의 $9$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

서술형3. 함수 $f(x) = a\cos b(x - \pi) + c$ ($a > 0, b > 0$)의 최댓값이 $5$, 최솟값이 $-1$이고, 이 함수의 그래프에서 연속한 두 최솟값을 갖는 점의 $x$좌표가 각각 $0$과 $2\pi$일 때, $f\left(\dfrac{4}{3}\pi\right)$의 값을 구하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{7}{2}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a > 0$이고 최댓값이 $5$, 최솟값이 $-1$이므로
2. $a = \dfrac{5 - (-1)}{2} = 3$, $c = \dfrac{5 + (-1)}{2} = 2$
3. 연속한 두 최솟값의 $x$좌표가 $0$과 $2\pi$이므로 주기 $P = 2\pi - 0 = 2\pi$
4. $b > 0$이므로 $\dfrac{2\pi}{b} = 2\pi \implies b = 1$
- 작성자 답: $\dfrac{7}{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「서술형3.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q24번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q24번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3)

**4칸**
- given: 함수←stem:「함수 $f(x) = a\cos b(x - \pi) + c$ ($a > 0, b > 0$)의 최댓값이 $5$, 최솟값이 $-1$이고, 이 함수의 그래프에서 연속한 두 최솟값을 갖는 점의 $x$좌표가 각각 $0$과 $2\pi$일 때, $f\left(\dfrac{4}{3}\pi\right)$의 값을 구하시오.」
- goal: 그래프←stem:「함수 $f(x) = a\cos b(x - \pi) + c$ ($a > 0, b > 0$)의 최댓값이 $5$, 최솟값이 $-1$이고, 이 함수의 그래프에서 연속한 두 최솟값을 갖는 점의 $x$좌표가 각각 $0$과 $2\pi$일 때, $f\left(\dfrac{4}{3}\pi\right)$의 값을 구하시오.」
- method: 최댓값(NAMED)←solution:「$a > 0$이고 최댓값이 $5$, 최솟값이 $-1$이므로」
- condition: (없음)

**how** Q24번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $\dfrac{7}{2}$을(를) 바르게 구하였다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

$a > 0$이고 최댓값이 $5$, 최솟값이 $-1$이므로  
$a = \dfrac{5 - (-1)}{2} = 3$, $c = \dfrac{5 + (-1)}{2} = 2$  
연속한 두 최솟값의 $x$좌표가 $0$과 $2\pi$이므로 주기 $P = 2\pi - 0 = 2\pi$  
$b > 0$이므로 $\dfrac{2\pi}{b} = 2\pi \implies b = 1$  
따라서 $f(x) = 3\cos(x - \pi) + 2$이므로  
$f\left(\dfrac{4}{3}\pi\right) = 3\cos\left(\dfrac{4}{3}\pi - \pi\right) + 2 = 3\cos\dfrac{\pi}{3} + 2 = 3 \cdot \dfrac{1}{2} + 2 = \dfrac{7}{2}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 서술형 5점


**발문**

서술형4. $\log_{x - 1}(4 - x)$의 값이 정의되도록 하는 정수 $x$의 값을 $\alpha$라 할 때, $\log_2(\alpha^3 + 9) - \log_2 \alpha^2$의 값을 구하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\log_{x - 1}(4 - x)$가 정의되려면 밑 조건과 진수 조건을 만족해야 한다. (문항 토큰 36)
2. (1) 밑 조건: $x - 1 > 0$이고 $x - 1 \neq 1 \implies x > 1$, $x \neq 2$
3. (2) 진수 조건: $4 - x > 0 \implies x < 4$
4. (1), (2)를 만족하는 정수 $x$는 $\alpha = 3$이다.
- 작성자 답: $2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「서술형4.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q25번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 36)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q25번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 36)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q25번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 36)

**4칸**
- given: 정수←stem:「$\log_{x - 1}(4 - x)$의 값이 정의되도록 하는 정수 $x$의 값을 $\alpha$라 할 때, $\log_2(\alpha^3 + 9) - \log_2 \alpha^2$의 값을 구하시오.」
- goal: 정의←stem:「$\log_{x - 1}(4 - x)$의 값이 정의되도록 하는 정수 $x$의 값을 $\alpha$라 할 때, $\log_2(\alpha^3 + 9) - \log_2 \alpha^2$의 값을 구하시오.」
- method: 진수(NAMED)←solution:「$\log_{x - 1}(4 - x)$가 정의되려면 밑 조건과 진수 조건을 만족해야 한다.」
- condition: (없음)

**how** Q25번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $2$을(를) 바르게 구하였다. (문항 토큰 36)

<details><summary>저장 해설 (판정 검토용)</summary>

$\log_{x - 1}(4 - x)$가 정의되려면 밑 조건과 진수 조건을 만족해야 한다.  
(1) 밑 조건: $x - 1 > 0$이고 $x - 1 \neq 1 \implies x > 1$, $x \neq 2$  
(2) 진수 조건: $4 - x > 0 \implies x < 4$  
(1), (2)를 만족하는 정수 $x$는 $\alpha = 3$이다.  
따라서 구하는 값은  
$\log_2(3^3 + 9) - \log_2 3^2 = \log_2 36 - \log_2 9 = \log_2 \dfrac{36}{9} = \log_2 4 = 2$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
