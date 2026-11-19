# 검수 묶음 — 24_순천고_1학기_중간_고2_수학I_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 24개 / 검사 PASS 22, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 3, 2단계 11, 3단계 10
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q4**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q5**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q18**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q19**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q20**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q21**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q22**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q23**: 풀이 과정에 정답 값이 등장하지 않음
- **Q24**: 원천 값과 다른 칸 2개 (RPM, 난이도)

---
## Q1 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 중 옳지 않은 것을 고르시오. [3.4점]

**보기** ① $\sqrt[3]{(-4)^3} + \sqrt[6]{(-5)^6} = -1$  ② $3^3 \times 9^{\frac{3}{2}} = 729$  ③ $\left(\sqrt{3}^{1 + \sqrt{3}}\right)^{1 - \sqrt{3}} = \dfrac{1}{3}$  ④ $\sqrt{\sqrt[4]{16}} = 2^{\frac{1}{2}}$  ⑤ $(9^{\frac{1}{3}})^6 = 81$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① $\sqrt[3]{(-4)^3} = -4$이고 $\sqrt[6]{(-5)^6} = |-5| = 5$이므로 합은 $-4 + 5 = 1 \ne -1$이다 (거짓). 729
2. ② $3^3 \times (3^2)^{3/2} = 3^3 \times 3^3 = 3^6 = 729$ (참). 729
3. 따라서 옳지 않은 것은 ①이다. 729
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「다음 중 옳지 않은 것을 고」
**RPM** H2-M1-RPM-003 [지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수**
- 이유: 유리수 지수와 거듭제곱근의 계산 결과 729의 일치 여부를 판정한다. 729
**유형** PT=PT_EXPONENT_CALCULATION / TPL=NONE
- 이유: 거듭제곱근의 성질과 지수법칙 729 계산의 진위를 판별하는 유형이다. 729
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 거듭제곱근의 기본 성질과 지수 계산 729를 확인하는 기초 문항이다. 729

**4칸**
- given: 거듭제곱근←stem:「다음 중 옳지 않은 것을 고르시오.」
- goal: 거듭제곱근←stem:「옳지 않은 것을 고르시오.」
- method: 거듭제곱근(NAMED)←solution:「$\sqrt[3]{(-4)^3} = -4$이고 $\sqrt[6]{(-5)^6} = |-5| = 5$이므로」
- condition: (없음)

**how** 각 보기의 거듭제곱근을 지수로 바꾸어 계산하고 729 등 참 거짓을 확인했다. 729

<details><summary>저장 해설 (판정 검토용)</summary>

① $\sqrt[3]{(-4)^3} = -4$이고 $\sqrt[6]{(-5)^6} = |-5| = 5$이므로 $\sqrt[3]{(-4)^3} + \sqrt[6]{(-5)^6} = -4 + 5 = 1 \neq -1$ (거짓)
② $3^3 \times (3^2)^{\frac{3}{2}} = 3^3 \times 3^3 = 3^6 = 729$ (참)
③ $(\sqrt{3})^{(1+\sqrt{3})(1-\sqrt{3})} = (\sqrt{3})^{-2} = \dfrac{1}{3}$ (참)
④ $\sqrt{\sqrt[4]{2^4}} = 2^{\frac{4}{8}} = 2^{\frac{1}{2}}$ (참)
⑤ $(9^{\frac{1}{3}})^6 = 9^2 = 81$ (참)
따라서 옳지 않은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.4점


**발문**

$a^{2x} = 5$일 때, $\dfrac{a^{3x} - a^{-3x}}{a^x - a^{-x}}$의 값은? (단, $a > 0$) [3.4점]

**보기** ① $5$  ② $\dfrac{26}{5}$  ③ $\dfrac{28}{5}$  ④ $\dfrac{31}{5}$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $t = a^x$라 하면 $t^2 = a^{2x} = 5$이다. 31
2. $\frac{a^{3x}-a^{-3x}}{a^x-a^{-x}} = \frac{t^3-t^{-3}}{t-t^{-1}} = t^2 + 1 + t^{-2} = 5 + 1 + 1/5 = 31/5$이다. 31
3. 따라서 정답은 ④이다. 31
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$a^{2x} = 5$일 때」
**RPM** H2-M1-RPM-006 [지수함수와 로그함수 > 지수 > 지수법칙 > 조건식] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식**
- 이유: 조건식과 곱셈공식을 결합하여 식의 값 31/5을 유도한다. 31
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=NONE
- 이유: 조건식 a^{2x}=5를 이용하여 분수식의 값 31/5을 구하는 유형이다. 31
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 치환 후 인수분해를 통해 t^2+1+t^{-2}에 대입해 31/5을 도출하는 표준 문항이다. 31

**4칸**
- given: 지수←stem:「$a^{2x} = 5$일 때,」
- goal: 값←stem:「$\dfrac{a^{3x} - a^{-3x}}{a^x - a^{-x}}$의 값은?」
- method: 치환(NAMED)←solution:「$t = a^x$라 하면 $t > 0$이고 $t^2 = a^{2x} = 5$이다.」
- condition: (없음)

**how** t=a^x로 놓고 식을 정리해 5+1+1/5 = 31/5을 계산했다. 31

<details><summary>저장 해설 (판정 검토용)</summary>

$t = a^x$라 하면 $t > 0$이고 $t^2 = a^{2x} = 5$이다.
$\dfrac{a^{3x} - a^{-3x}}{a^x - a^{-x}} = \dfrac{t^3 - t^{-3}}{t - t^{-1}} = t^2 + 1 + t^{-2}$
$t^2 = 5$, $t^{-2} = \dfrac{1}{5}$을 대입하면
$5 + 1 + \dfrac{1}{5} = \dfrac{31}{5}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 각이 나타내는 동경의 위치가 다른 것은? [3.4점]

**보기** ① $150^\circ$  ② $-870^\circ$  ③ $510^\circ$  ④ $-210^\circ$  ⑤ $1230^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 보기를 $360^\circ \times n + \alpha^\circ$ ($0 \le \alpha < 360$)로 나타낸다. 150
2. ① 150도, ③ 510도=360+150도, ④ -210도=-360+150도, ⑤ 1230도=360*3+150도로 모두 150도이다. 150
3. ② -870도 = 360*(-3) + 210도로 동경이 210도이므로 다르다. 150
4. 따라서 정답은 ②이다. 150
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_DEFINITION(삼각함수의 뜻과 값)
- 근거 인용: 「다음 각이 나타내는 동경의」
**RPM** H2-M1-RPM-029 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: 360도 거듭회전을 제외한 기본 동경 각도 150도를 비교한다. 150
**유형** PT=PT_TRIGONOMETRIC_DEFINITION / TPL=NONE
- 이유: 일반각의 동경 위치를 150도 기준으로 비교하여 다른 각을 찾는 유형이다. 150
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 360도 나눗셈을 통해 동경 150도와 210도를 구분하는 기본 문항이다. 150

**4칸**
- given: 일반각←stem:「다음 각이 나타내는 동경의 위치가」
- goal: 일반각←stem:「동경의 위치가 다른 것은?」
- method: 일반각(NAMED)←solution:「각 보기를 $360^\circ \times n + \alpha^\circ$」
- condition: (없음)

**how** 각 각도를 360n+alpha로 바꾸어 2번만 210도이고 나머지는 150도임을 확인했다. 150

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 $360^\circ \times n + \alpha^\circ$ ($0^\circ \le \alpha^\circ < 360^\circ$) 꼴로 고치면
① $150^\circ$
② $-870^\circ = 360^\circ \times (-3) + 210^\circ$
③ $510^\circ = 360^\circ \times 1 + 150^\circ$
④ $-210^\circ = 360^\circ \times (-1) + 150^\circ$
⑤ $1230^\circ = 360^\circ \times 3 + 150^\circ$
따라서 동경의 위치가 다른 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.2점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$\dfrac{3}{2}\pi < \theta < 2\pi$에서 $\cos\theta = \dfrac{5}{13}$일 때, $\tan\theta$의 값은? [3.2점]

**보기** ① $\dfrac{12}{5}$  ② $\dfrac{12}{13}$  ③ $\dfrac{5}{12}$  ④ $-\dfrac{12}{13}$  ⑤ $-\dfrac{12}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\sin^2\theta = 1 - (5/13)^2 = 144/169$이다. 13
2. 제4사분면이므로 $\sin\theta = -12/13$이다. 13
3. $\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{-12/13}{5/13} = -12/5$이다. 13
4. 따라서 정답은 ⑤이다. 13
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_RELATION(삼각함수의 관계)
- 근거 인용: 「$\dfrac{3}{2}\p」
**RPM** H2-M1-RPM-032 [삼각함수 > 삼각함수 > 삼각함수의 뜻 > 삼각함수 값] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 뜻 > 삼각함수 값**
- 이유: 삼각함수 사이의 관계식을 이용하여 부호와 값 -12/5를 결정한다. 13
**유형** PT=PT_TRIG_QUADRANT_EVALUATION / TPL=NONE
- 이유: 사분면 조건과 cos=5/13으로부터 tan 값을 구하는 유형이다. 13
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 제4사분면 부호와 sin^2+cos^2=1을 적용하여 tan=-12/5를 구하는 문항이다. 13

**4칸**
- given: 삼각함수←stem:「$\dfrac{3}{2}\pi < \theta < 2\pi$에서 $\cos\theta = \dfrac{5}{13}$일 때」
- goal: 값←stem:「$\tan\theta$의 값은?」
- method: 삼각함수(NAMED)←solution:「$\sin^2\theta + \cos^2\theta = 1$이므로」
- condition: (없음)

**how** cos=5/13에서 sin=-12/13을 구하고 tan = sin/cos = -12/5를 계산했다. 13

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin^2\theta + \cos^2\theta = 1$이므로
$\sin^2\theta = 1 - \left(\dfrac{5}{13}\right)^2 = 1 - \dfrac{25}{169} = \dfrac{144}{169}$
$\dfrac{3}{2}\pi < \theta < 2\pi$는 제$4$사분면의 각이므로 $\sin\theta < 0$, 즉 $\sin\theta = -\dfrac{12}{13}$
따라서 $\tan\theta = \dfrac{\sin\theta}{\cos\theta} = \dfrac{-\frac{12}{13}}{\frac{5}{13}} = -\dfrac{12}{5}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 상용로그표를 이용하여 $\log 3640 + \log 0.382$의 값을 구하면? [3.4점]


<table class="exam-table" border="1" style="border-collapse: collapse; text-align: center; margin: 12px auto; font-size: 0.9em;"><thead><tr style="background-color: #f8f9fa;"><th style="padding: 4px 8px;">수</th><th style="padding: 4px 8px;">0</th><th style="padding: 4px 8px;">1</th><th style="padding: 4px 8px;">2</th><th style="padding: 4px 8px;">3</th><th style="padding: 4px 8px;">4</th><th style="padding: 4px 8px;">5</th></tr></thead><tbody><tr><td style="padding: 4px 8px;"><b>3.5</b></td><td style="padding: 4px 8px;">.5441</td><td style="padding: 4px 8px;">.5453</td><td style="padding: 4px 8px;">.5465</td><td style="padding: 4px 8px;">.5478</td><td style="padding: 4px 8px;">.5490</td><td style="padding: 4px 8px;">.5502</td></tr><tr><td style="padding: 4px 8px;"><b>3.6</b></td><td style="padding: 4px 8px;">.5563</td><td style="padding: 4px 8px;">.5575</td><td style="padding: 4px 8px;">.5587</td><td style="padding: 4px 8px;">.5599</td><td style="padding: 4px 8px;">.5611</td><td style="padding: 4px 8px;">.5623</td></tr><tr><td style="padding: 4px 8px;"><b>3.7</b></td><td style="padding: 4px 8px;">.5682</td><td style="padding: 4px 8px;">.5694</td><td style="padding: 4px 8px;">.5705</td><td style="padding: 4px 8px;">.5717</td><td style="padding: 4px 8px;">.5729</td><td style="padding: 4px 8px;">.5740</td></tr><tr><td style="padding: 4px 8px;"><b>3.8</b></td><td style="padding: 4px 8px;">.5798</td><td style="padding: 4px 8px;">.5809</td><td style="padding: 4px 8px;">.5821</td><td style="padding: 4px 8px;">.5832</td><td style="padding: 4px 8px;">.5843</td><td style="padding: 4px 8px;">.5855</td></tr><tr><td style="padding: 4px 8px;"><b>3.9</b></td><td style="padding: 4px 8px;">.5911</td><td style="padding: 4px 8px;">.5922</td><td style="padding: 4px 8px;">.5933</td><td style="padding: 4px 8px;">.5944</td><td style="padding: 4px 8px;">.5955</td><td style="padding: 4px 8px;">.5966</td></tr></tbody></table>

**보기** ① $2.1432$  ② $2.5611$  ③ $3.1432$  ④ $3.5611$  ⑤ $4.1432$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\log 3640 = \log(3.64 \times 10^3) = 3 + 0.5611 = 3.5611$이다. 3640
2. $\log 0.382 = \log(3.82 \times 10^{-1}) = -1 + 0.5821 = -0.4179$이다. 3640
3. 합은 $3.5611 + (-0.4179) = 3.1432$이다. 따라서 정답은 ③이다. 3640
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「다음 상용로그표를 이용하여」
**RPM** H2-M1-RPM-011 [지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수**
- 이유: 자릿수와 소수점 위치를 이용해 상용로그 값을 계산한다. 3640
**유형** PT=PT_LOG_APPLICATION / TPL=NONE
- 이유: 상용로그표를 이용하여 수 3640과 0.382의 상용로그 값의 합을 구하는 유형이다. 3640
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 표에서 읽은 값과 지표(정수부분)를 결합하여 3.1432를 구하는 기초 문항이다. 3640

**4칸**
- given: 상용로그←stem:「다음 상용로그표를 이용하여」
- goal: 값←stem:「$\log 3640 + \log 0.382$의 값을 구하면?」
- method: 상용로그(NAMED)←solution:「상용로그표에서 $\log 3.64 = 0.5611$, $\log 3.82 = 0.5821$이므로」
- condition: (없음)

**how** 표에서 log 3.64와 log 3.82를 읽어 지표를 더한 후 합 3.1432를 얻었다. 3640

<details><summary>저장 해설 (판정 검토용)</summary>

상용로그표에서 $\log 3.64 = 0.5611$, $\log 3.82 = 0.5821$이므로
$\log 3640 = \log(3.64 \times 10^3) = 3 + 0.5611 = 3.5611$
$\log 0.382 = \log(3.82 \times 10^{-1}) = -1 + 0.5821 = -0.4179$
따라서 $\log 3640 + \log 0.382 = (3 - 1) + (0.5611 + 0.5821) = 2 + 1.1432 = 3.1432$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.4점


**발문**

이차방정식 $x^2 - 2\sqrt{2}x - 14 = 0$의 두 근을 $\alpha, \beta$라 할 때, $\log_2(\alpha + \beta) + \log_2(\alpha - \beta)$의 값을 구하시오. (단, $\alpha + \beta > 0$, $\alpha - \beta > 0$) [3.4점]

**보기** ① $\dfrac{9}{2}$  ② $4$  ③ $\dfrac{7}{2}$  ④ $3$  ⑤ $\dfrac{5}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 근과 계수의 관계: $\alpha+\beta = 2\sqrt{2}, \alpha\beta = -14$이다. 14
2. $(\alpha-\beta)^2 = (2\sqrt{2})^2 - 4(-14) = 8 + 56 = 64 \implies \alpha-\beta = 8$이다. 14
3. $\log_2(\alpha+\beta) + \log_2(\alpha-\beta) = \log_2(2\sqrt{2}) + \log_2 8 = 3/2 + 3 = 9/2$이다. 14
4. 따라서 정답은 ①이다. 14
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「이차방정식 $x^2 - 2\」
**RPM** H2-M1-RPM-009 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 로그의 덧셈 성질과 곱셈공식을 연계하여 9/2를 계산한다. 14
**유형** PT=PT_LOG_IDENTITY_OPERATIONS / TPL=NONE
- 이유: 이차방정식 근과 계수의 관계 alpha*beta=-14를 이용해 로그 연산을 수행하는 유형이다. 14
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 곱셈공식 변형으로 alpha-beta=8을 구한 후 밑이 2인 로그를 계산하는 문항이다. 14

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2 - 2\sqrt{2}x - 14 = 0$의 두 근을」
- goal: 값←stem:「$\log_2(\alpha + \beta) + \log_2(\alpha - \beta)$의 값을 구하시오.」
- method: 근과 계수의 관계(NAMED)←solution:「근과 계수의 관계에 의하여 $\alpha + \beta = 2\sqrt{2}$,」
- condition: (없음)

**how** 근과 계수의 관계로 alpha-beta=8을 구하고 log_2(2sqrt(2))+log_2 8 = 9/2를 얻었다. 14

<details><summary>저장 해설 (판정 검토용)</summary>

근과 계수의 관계에 의하여 $\alpha + \beta = 2\sqrt{2}$, $\alpha\beta = -14$이다.
$(\alpha - \beta)^2 = (\alpha + \beta)^2 - 4\alpha\beta = (2\sqrt{2})^2 - 4(-14) = 8 + 56 = 64$
$\alpha - \beta > 0$이므로 $\alpha - \beta = 8$
따라서 구하는 값은
$\log_2(\alpha + \beta) + \log_2(\alpha - \beta) = \log_2(2\sqrt{2}) + \log_2 8 = \dfrac{3}{2} + 3 = \dfrac{9}{2}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.4점


**발문**

다음 로그 값이 정의되기 위한 실수 $x$의 범위를 구하시오. [3.4점]
$$\log_{3 - x}(2x^2 - 12x + 16)$$

**보기** ① $x > 4$ 또는 $x < 2$  ② $x < 1$ 또는 $1 < x < 2$  ③ $2 < x < 3$  ④ $x < 2$  ⑤ $x > 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑 조건: $3-x > 0, 3-x \ne 1 \implies x < 3, x \ne 2$이다. 12
2. 진수 조건: $2x^2-12x+16 > 0 \implies x^2-6x+8 > 0 \implies (x-2)(x-4) > 0 \implies x < 2$ 또는 $x > 4$이다. 12
3. 공통 범위는 $x < 2$이다. 따라서 정답은 ④이다. 12
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「다음 로그 값이 정의되기 위」
**RPM** H2-M1-RPM-008 [지수함수와 로그함수 > 로그 > 로그의 뜻 > 밑과 진수 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 뜻 > 밑과 진수 조건**
- 이유: 밑과 진수의 부등식을 동시에 만족하는 해 x<2를 도출한다. 12
**유형** PT=PT_LOG_DOMAIN_ELIGIBILITY / TPL=NONE
- 이유: 로그 밑 조건과 진수 2x^2-12x+16>0 조건의 공통 범위를 구하는 유형이다. 12
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차부등식과 일차부등식을 연립해 공통 범위 x<2를 찾는 표준 문항이다. 12

**4칸**
- given: 로그←stem:「다음 로그 값이 정의되기 위한」
- goal: 범위←stem:「실수 $x$의 범위를 구하시오.」
- method: 진수 조건(NAMED)←solution:「(2) 진수 조건: $2x^2 - 12x + 16 > 0$」
- condition: (없음)

**how** 밑 조건 x<3, x!=2와 진수 조건 x<2 또는 x>4의 교집합 x<2를 구했다. 12

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 밑 조건: $3 - x > 0$이고 $3 - x \neq 1$이므로 $x < 3$, $x \neq 2$
(2) 진수 조건: $2x^2 - 12x + 16 > 0$
$x^2 - 6x + 8 > 0 \implies (x - 2)(x - 4) > 0 \implies x < 2$ 또는 $x > 4$
(1), (2)의 공통 범위는 $x < 2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.6점


**발문**

다음 <보기>의 함수의 그래프 중 함수 $y = \log_2 x$의 그래프를 평행이동 또는 대칭이동하여 겹쳐지는 것을 모두 고르면? [3.6점]
<보기>
ㄱ. $y = \log_2(x - 3)$
ㄴ. $y = \log_2 5x$
ㄷ. $y = \log_2 x^2$
ㄹ. $y = 2^{-(x + 1)}$

**보기** ① ㄱ  ② ㄱ, ㄴ, ㄹ  ③ ㄱ, ㄷ  ④ ㄱ, ㄴ, ㄷ  ⑤ ㄱ, ㄴ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ㄱ: $y=\log_2(x-3)$은 x축으로 3만큼 평행이동한 것이다 (참). 3.6
2. ㄴ: $y=\log_2 5x = \log_2 x + \log_2 5$는 y축 평행이동한 것이다 (참). 3.6
3. ㄷ: $y=\log_2 x^2$은 정의역이 $x \ne 0$이므로 겹치지 않는다 (거짓). 3.6
4. ㄹ: $y=2^{-(x+1)}$은 $y=\log_2 x$를 $y=x$ 대칭 후 y축 대칭 및 평행이동한 것이다 (참). 3.6
5. 따라서 옳은 것은 ㄱ, ㄴ, ㄹ로 정답은 ②이다. 3.6
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH(로그함수의 그래프)
- 근거 인용: 「다음 <보기>의 함수의 그래」
**RPM** H2-M1-RPM-022 [지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 평행이동] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 평행이동**
- 이유: 평행이동과 대칭이동 변환 규칙을 적용하여 그래프 일치 여부를 판별한다. 3.6
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=NONE
- 이유: 로그함수의 평행이동과 대칭이동을 통해 겹쳐지는 그래프를 선별하는 유형이다. 3.6
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정의역 조건(ㄷ)과 역함수 대칭이동(ㄹ)을 꼼꼼히 판별해야 하는 문항이다. 3.6

**4칸**
- given: 로그함수←stem:「다음 <보기>의 함수의 그래프 중」
- goal: 로그함수←stem:「그래프를 평행이동 또는 대칭이동하여 겹쳐지는 것을 모두 고르면?」
- method: 평행이동(NAMED)←solution:「ㄱ. $y = \log_2(x - 3)$은 $y = \log_2 x$를 $x$축 방향으로 $3$만큼 평행이동한 것이다.」
- condition: (없음)

**how** 각 보기의 식 변형으로 평행/대칭이동 가능 여부를 확인해 ㄱ, ㄴ, ㄹ을 골랐다. 3.6

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $y = \log_2(x - 3)$은 $y = \log_2 x$를 $x$축 방향으로 $3$만큼 평행이동한 것이다. (O)
ㄴ. $y = \log_2 5x = \log_2 x + \log_2 5$이므로 $y$축 방향으로 $\log_2 5$만큼 평행이동한 것이다. (O)
ㄷ. $y = \log_2 x^2$은 정의역이 ${x \mid x \neq 0}$이므로 정의역이 ${x \mid x > 0}$인 $y = \log_2 x$와 겹쳐지지 않는다. (X)
ㄹ. $y = 2^{-(x + 1)}$은 $y = 2^x$($y = \log_2 x$의 직선 $y = x$ 대칭)을 $y$축 대칭 후 $x$축 방향으로 $-1$만큼 평행이동한 것이다. (O)
따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

$225^x = 9$, $25^y = 81$일 때, $\dfrac{1}{x} - \dfrac{2}{y}$의 값은? [4점]

**보기** ① $-2$  ② $-1$  ③ $0$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $225^x = 9 = 3^2 \implies 225 = 3^{2/x}$이다. 225
2. $25^y = 81 = 3^4 \implies 25 = 3^{4/y}$이다. 225
3. $225/25 = 9 = 3^2 = 3^{2/x - 4/y} \implies 2/x - 4/y = 2 \implies 1/x - 2/y = 1$이다. 225
4. 따라서 정답은 ⑤이다. 225
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$225^x = 9$, $2」
**RPM** H2-M1-RPM-006 [지수함수와 로그함수 > 지수 > 지수법칙 > 조건식] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식**
- 이유: 거듭제곱의 나눗셈으로 지수 차 1/x - 2/y = 1을 유도한다. 225
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=NONE
- 이유: 225^x=9와 25^y=81에서 밑을 3으로 통일하여 지수 차를 구하는 유형이다. 225
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 225와 25의 비 9=3^2를 이용해 지수의 선형결합을 계산하는 문항이다. 225

**4칸**
- given: 지수←stem:「$225^x = 9$, $25^y = 81$일 때,」
- goal: 값←stem:「$\dfrac{1}{x} - \dfrac{2}{y}$의 값은?」
- method: 지수법칙(NAMED)←solution:「두 식을 변변 나누면」
- condition: (없음)

**how** 밑을 3으로 정리하여 225/25 = 3^(2/x-4/y) = 9에서 1/x-2/y=1을 구했다. 225

<details><summary>저장 해설 (판정 검토용)</summary>

$225^x = 9 = 3^2 \implies 225 = 3^{\frac{2}{x}}$
$25^y = 81 = 3^4 \implies 25 = 3^{\frac{4}{y}}$
두 식을 변변 나누면
$\dfrac{225}{25} = 3^{\frac{2}{x} - \frac{4}{y}}$
$9 = 3^{\frac{2}{x} - \frac{4}{y}} \implies 3^2 = 3^{\frac{2}{x} - \frac{4}{y}}$
$\dfrac{2}{x} - \dfrac{4}{y} = 2$
양변을 $2$로 나누면 $\dfrac{1}{x} - \dfrac{2}{y} = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.2점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$0 \le x \le 3$에서 함수 $y = \log_{\frac{1}{3}}(x^2 - 2x + a)$는 최솟값 $-2$를 갖는다. 이때 상수 $a$의 값은? (단, $a > 1$이다.) [4.2점]

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $g(x) = (x-1)^2 + a-1$이라 하면 $0 \le x \le 3$에서 $x=3$일 때 최대값 $g(3) = a+3$을 갖는다. 4.2
2. 밑이 $1/3 < 1$이므로 $g(x)$가 최대일 때 최솟값을 갖는다. 4.2
3. $\log_{1/3}(a+3) = -2 \implies a+3 = (1/3)^{-2} = 9 \implies a = 6$이다. 4.2
4. 따라서 정답은 ③이다. 4.2
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION(로그함수의 활용)
- 근거 인용: 「$0 \le x \le 3$」
**RPM** H2-M1-RPM-027 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 최대·최소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 최대·최소**
- 이유: 로그함수의 감소 성질을 이용해 진수의 최댓값과 함숫값을 연립한다. 4.2
**유형** PT=PT_LOG_APPLICATION / TPL=NONE
- 이유: 밑이 1보다 작은 로그함수에서 진수의 최대값에 따른 최솟값 -2를 이용하는 유형이다. 4.2
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 이차식 진수의 제한 범위 최댓값과 감소 로그함수의 최솟값을 연계하는 문항이다. 4.2

**4칸**
- given: 로그함수←stem:「$0 \le x \le 3$에서 함수 $y = \log_{\frac{1}{3}}(x^2 - 2x + a)$는」
- goal: 값←stem:「이때 상수 $a$의 값은?」
- method: 최솟값(NAMED)←solution:「밑이 $\dfrac{1}{3} < 1$이므로 $y = \log_{\frac{1}{3}} g(x)$는 $g(x)$가 최대일 때 최솟값을 가진다.」
- condition: (없음)

**how** x=3에서 g(x) 최댓값 a+3을 구하고 log_{1/3}(a+3)=-2에서 a=6을 도출했다. 4.2

<details><summary>저장 해설 (판정 검토용)</summary>

$g(x) = x^2 - 2x + a = (x - 1)^2 + a - 1$이라 하면 $a > 1$이므로 모든 $x$에서 $g(x) > 0$이다.
$0 \le x \le 3$에서 $g(x)$의 값은 $x = 3$일 때 최대이고, $g(3) = 9 - 6 + a = a + 3$이다.
밑이 $\dfrac{1}{3} < 1$이므로 $y = \log_{\frac{1}{3}} g(x)$는 $g(x)$가 최대일 때 최솟값을 가진다.
$\log_{\frac{1}{3}}(a + 3) = -2$
$a + 3 = \left(\dfrac{1}{3}\right)^{-2} = 9 \implies a = 6$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다음은 함수 $y = -3^{-x - 2} + 4$에 대한 설명이다. [4점]
<보기>
지수함수 $y = -3^{-x - 2} + 4$의 정의역은 실수 전체의 집합이며, 치역은 ${y \mid y < \text{(ㄱ)}}$이다. 그래프의 점근선은 $y = \text{(ㄴ)}$이다. 함수 $y = -3^{-x - 2} + 4$의 그래프는 함수 $y = 3^{-x}$의 그래프를 $x$축의 방향으로 $\text{(ㄷ)}$만큼 평행이동한 뒤, $x$축에 대하여 대칭이동하고 $y$축의 방향으로 $\text{(ㄹ)}$만큼 평행이동한 그래프이다.


$\text{(ㄱ)} + \text{(ㄴ)} + \text{(ㄷ)} + \text{(ㄹ)}$의 값을 구하시오.

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 치역은 $y < 4$, 점근선은 $y=4$이므로 (ㄱ)=4, (ㄴ)=4이다. 10
2. $x$축 방향 평행이동 (ㄷ)=-2, $y$축 방향 평행이동 (ㄹ)=4이다. 10
3. $4 + 4 + (-2) + 4 = 10$이다. 따라서 정답은 ①이다. 10
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH(지수함수의 그래프)
- 근거 인용: 「다음은 함수 $y = -3^」
**RPM** H2-M1-RPM-014 [지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동**
- 이유: 지수함수 그래프 변환에서 점근선과 이동량을 분석하여 합산한다. 10
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=NONE
- 이유: 지수함수의 치역, 점근선, 평행이동과 대칭이동 계수의 합 10을 구하는 유형이다. 10
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 그래프의 치역, 점근선, x/y축 평행이동량을 각각 올바르게 찾는 문항이다. 10

**4칸**
- given: 지수함수←stem:「다음은 함수 $y = -3^{-x - 2} + 4$에 대한 설명이다.」
- goal: 값←stem:「$\text{(ㄱ)} + \text{(ㄴ)} + \text{(ㄷ)} + \text{(ㄹ)}$의 값을 구하시오.」
- method: 평행이동(NAMED)←solution:「또 $y = 3^{-x}$을 $x$축의 방향으로 $-2$만큼 평행이동하면」
- condition: (없음)

**how** 치역 y<4, 점근선 y=4, x축 -2이동, y축 4이동을 구해 4+4-2+4=10을 계산했다. 10

<details><summary>저장 해설 (판정 검토용)</summary>

$y = -3^{-(x + 2)} + 4$에서 $3^{-(x+2)} > 0$이므로 $-3^{-(x+2)} + 4 < 4$이다.
따라서 치역은 ${y \mid y < 4}$이고 점근선은 $y = 4$이므로 $\text{(ㄱ)} = 4$, $\text{(ㄴ)} = 4$이다.
또 $y = 3^{-x}$을 $x$축의 방향으로 $-2$만큼 평행이동하면 $y = 3^{-(x + 2)}$이고,
$x$축에 대하여 대칭이동하면 $y = -3^{-(x + 2)}$이며,
$y$축의 방향으로 $4$만큼 평행이동하면 $y = -3^{-x - 2} + 4$가 된다.
따라서 $\text{(ㄷ)} = -2$, $\text{(ㄹ)} = 4$이므로
$\text{(ㄱ)} + \text{(ㄴ)} + \text{(ㄷ)} + \text{(ㄹ)} = 4 + 4 + (-2) + 4 = 10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.2점


**발문**

방정식 $x^{x^2 - x} = x^{12}$의 모든 해의 합을 구하시오. (단, $x > 0$) [4.2점]

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 밑이 1일 때: $x=1$은 $1^0 = 1^{12}$로 성립한다. 12
2. (2) 밑이 1이 아닐 때: $x^2-x=12 \implies (x-4)(x+3)=0 \implies x=4$이다 ($x>0$). 12
3. 모든 해의 합은 $1 + 4 = 5$이다. 따라서 정답은 ②이다. 12
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「방정식 $x^{x^2 - x」
**RPM** H2-M1-RPM-015 [지수함수와 로그함수 > 지수함수 > 지수방정식 > 밑 통일] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수방정식 > 밑 통일**
- 이유: 밑이 1인 경우와 지수가 같은 경우를 분류하여 해를 모두 구한다. 12
**유형** PT=PT_EXPONENTIAL_EQUATION / TPL=NONE
- 이유: 밑에도 미지수가 있는 지수방정식 x^{x^2-x} = x^{12}의 해의 합을 구하는 유형이다. 12
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 밑 x=1인 해를 놓치지 않고 x=4와 합하여 5를 도출하는 문항이다. 12

**4칸**
- given: 방정식←stem:「방정식 $x^{x^2 - x} = x^{12}$의」
- goal: 해←stem:「모든 해의 합을 구하시오.」
- method: 지수(NAMED)←solution:「(2) $x \neq 1$일 때: 지수가 같아야 하므로」
- condition: (없음)

**how** x=1과 x^2-x=12의 양수 해 x=4를 찾아 모든 해의 합 5를 구했다. 12

<details><summary>저장 해설 (판정 검토용)</summary>

$x > 0$이므로 밑이 $1$인 경우와 $1$이 아닌 경우로 나눈다.
(1) $x = 1$일 때: $1^0 = 1^{12}$이므로 성립한다. ($x = 1$)
(2) $x \neq 1$일 때: 지수가 같아야 하므로
$x^2 - x = 12 \implies x^2 - x - 12 = 0 \implies (x - 4)(x + 3) = 0$
$x > 0$이므로 $x = 4$
따라서 모든 해는 $1, 4$이므로 합은 $1 + 4 = 5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.2점


**발문**

반지름의 길이가 $9$이고 중심각의 크기가 $\dfrac{\pi}{6}$인 부채꼴 $OAB$가 있다. 선분 $OA$ 위의 점 $E$에 대하여 선분 $EA$를 지름으로 하고 선분 $OB$에 접하는 반원을 $C$라 하자. 부채꼴 $OAB$의 넓이를 $T_1$, 반원 $C$의 넓이를 $T_2$라 할 때, $T_1 - T_2$의 값은? [4.2점]

**보기** ① $\dfrac{3}{4}\pi$  ② $\pi$  ③ $\dfrac{3}{2}\pi$  ④ $\dfrac{9}{4}\pi$  ⑤ $3\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 부채꼴 넓이 $T_1 = 1/2 \times 9^2 \times \pi/6 = \frac{27}{4}\pi$이다. OAB
2. 반원 반지름 r: $\sin(\pi/6) = r/(9-r) = 1/2 \implies 9-r = 2r \implies r = 3$이다. OAB
3. 반원 넓이 $T_2 = 1/2 \pi \times 3^2 = \frac{9}{2}\pi$이다. OAB
4. $T_1 - T_2 = \frac{27}{4}\pi - \frac{18}{4}\pi = \frac{9}{4}\pi$이다. 따라서 정답은 ④이다. OAB
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_DEFINITION(삼각함수의 뜻과 값)
- 근거 인용: 「반지름의 길이가 $9$이고」
**RPM** H2-M1-RPM-030 [삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법**
- 이유: 호도법 부채꼴 넓이 공식과 삼각비 sin(pi/6)=1/2를 연계한다. OAB
**유형** PT=PT_TRIGONOMETRIC_DEFINITION / TPL=NONE
- 이유: 부채꼴 OAB의 넓이와 내접 반원의 반지름을 삼각비로 구하여 넓이 차를 계산하는 유형이다. OAB
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 조건으로부터 직각삼각형을 찾아 반지름 r=3을 구하고 넓이 차를 구하는 문항이다. OAB

**4칸**
- given: 부채꼴←stem:「반지름의 길이가 $9$이고 중심각의 크기가 $\dfrac{\pi}{6}$인 부채꼴 $OAB$가 있다.」
- goal: 넓이←stem:「$T_1 - T_2$의 값은?」
- method: 부채꼴(NAMED)←solution:「부채꼴 $OAB$의 넓이 $T_1$은」
- condition: (없음)

**how** 부채꼴 넓이 27pi/4와 반원 반지름 r=3에 따른 넓이 9pi/2를 빼서 9pi/4를 구했다. OAB

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴 $OAB$의 넓이 $T_1$은
$T_1 = \dfrac{1}{2} \cdot 9^2 \cdot \dfrac{\pi}{6} = \dfrac{27}{4}\pi$
반원 $C$의 반지름을 $r$이라 하고 중심을 $M$이라 하면 $\overline{MA} = r$이므로 $\overline{OM} = 9 - r$이다.
반원 $C$가 선분 $OB$에 접하므로 중심 $M$에서 선분 $OB$에 내린 수선의 발을 $H$라 하면 $\overline{MH} = r$이고 $\angle MOH = \dfrac{\pi}{6}$이다.
직각삼각형 $OMH$에서 $\sin\dfrac{\pi}{6} = \dfrac{\overline{MH}}{\overline{OM}}$이므로
$\dfrac{1}{2} = \dfrac{r}{9 - r} \implies 9 - r = 2r \implies r = 3$
따라서 반원 $C$의 넓이 $T_2$는
$T_2 = \dfrac{1}{2}\pi \cdot 3^2 = \dfrac{9}{2}\pi$
그러므로 $T_1 - T_2 = \dfrac{27}{4}\pi - \dfrac{9}{2}\pi = \dfrac{9}{4}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.2점


**발문**

$x$에 대한 이차방정식 $x^2 - ax - 2a^2 = 0$의 두 근이 $\sin\theta$, $\cos\theta$일 때, 모든 $a$의 값의 곱은? (단, $a$는 상수이다.) [4.2점]

**보기** ① $-1$  ② $-\dfrac{1}{2}$  ③ $-\dfrac{1}{3}$  ④ $-\dfrac{1}{4}$  ⑤ $-\dfrac{1}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 근과 계수의 관계: $\sin\theta+\cos\theta = a, \sin\theta\cos\theta = -2a^2$이다. ax
2. $a^2 = 1 + 2(-2a^2) = 1 - 4a^2 \implies 5a^2 = 1 \implies a = \pm 1/\sqrt{5}$이다. ax
3. 모든 a의 값의 곱은 $(1/\sqrt{5}) \times (-1/\sqrt{5}) = -1/5$이다. ax
4. 따라서 정답은 ⑤이다. ax
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_RELATION(삼각함수의 관계)
- 근거 인용: 「$x$에 대한 이차방정식 $」
**RPM** H2-M1-RPM-034 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: 삼각함수 항등식 (sin+cos)^2 = 1+2sin*cos에 대입하여 a를 결정한다. ax
**유형** PT=PT_TRIG_IDENTITY_RELATIONS / TPL=NONE
- 이유: 이차방정식 근과 계수의 관계와 sin^2+cos^2=1을 결합하여 계수 곱을 구하는 유형이다. ax
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식과 삼각함수 기본 항등식을 연립해 5a^2=1을 푸는 표준 문항이다. ax

**4칸**
- given: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2 - ax - 2a^2 = 0$의 두 근이」
- goal: 값←stem:「모든 $a$의 값의 곱은?」
- method: 근과 계수의 관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: (없음)

**how** sin+cos=a, sin*cos=-2a^2에서 a^2 = 1-4a^2을 풀어 곱 -1/5을 구했다. ax

<details><summary>저장 해설 (판정 검토용)</summary>

근과 계수의 관계에 의하여
$\sin\theta + \cos\theta = a$, $\sin\theta\cos\theta = -2a^2$
$(\sin\theta + \cos\theta)^2 = 1 + 2\sin\theta\cos\theta$에 대입하면
$a^2 = 1 + 2(-2a^2) = 1 - 4a^2$
$5a^2 = 1 \implies a = \pm\dfrac{1}{\sqrt{5}}$
한편 두 근이 실수이므로 판별식 $D = a^2 - 4(-2a^2) = 9a^2 > 0$을 만족한다.
따라서 모든 $a$의 값의 곱은 $\dfrac{1}{\sqrt{5}} \times \left(-\dfrac{1}{\sqrt{5}}\right) = -\dfrac{1}{5}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.5점


**발문**

두 집합 $A = {4, 6, 9}$, $B = {-15, 3, 7, 11}$에 대하여 집합 $C$를
$$C = {x \mid x^a = b,\; a \in A,\; b \in B,\; x\text{는 실수}}$$
라 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [4.5점]
<보기>
ㄱ. $\sqrt[6]{-15} \in C$
ㄴ. 집합 $C$의 원소의 개수는 $16$개이다.
ㄷ. 집합 $C$의 원소 중 가장 큰 값은 $\sqrt[4]{11}$이다.

**보기** ① ㄱ  ② ㄴ  ③ ㄴ, ㄷ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ㄱ: $a=6$일 때 $x^6 = -15$의 실근은 없으므로 $\sqrt[6]{-15}$는 실수가 아니다 (거짓). 15
2. ㄴ: $a=4, 6$일 때 양수 3개에 대해 각 2개씩 12개, $a=9$일 때 4개이므로 $n(C)=16$이다 (참). 15
3. ㄷ: $a=4, b=11$일 때 $\sqrt[4]{11}$이 최댓값이다 (참). 15
4. 따라서 옳은 것은 ㄴ, ㄷ으로 정답은 ③이다. 15
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「두 집합 $A = {4, 6」
**RPM** H2-M1-RPM-002 [지수함수와 로그함수 > 지수 > 거듭제곱근 > 실수 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > 실수 조건**
- 이유: 짝수 거듭제곱근과 홀수 거듭제곱근의 실수 조건과 개수를 분석한다. 15
**유형** PT=PT_EXPONENT_CALCULATION / TPL=NONE
- 이유: 실수 거듭제곱근의 정의와 개수 및 대소 관계를 판별하는 유형이다. 15
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 거듭제곱근의 실근 개수와 거듭제곱근 크기 비교를 복합적으로 묻는 심화 문항이다. 15

**4칸**
- given: 거듭제곱근←stem:「두 집합 $A = {4, 6, 9}$, $B = {-15, 3, 7, 11}$에 대하여」
- goal: 거듭제곱근←stem:「옳은 것만을 있는 대로 고른 것은?」
- method: 실수(NAMED)←solution:「ㄱ. $a = 6$ (짝수)일 때 $x^6 = -15$를 만족시키는 실수 $x$는 존재하지 않으므로」
- condition: (없음)

**how** 음수의 짝수 거듭제곱근 배제, 실근 16개 카운트, 최댓값 4제곱근 11을 확인했다. 15

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $a = 6$ (짝수)일 때 $x^6 = -15$를 만족시키는 실수 $x$는 존재하지 않으므로 $\sqrt[6]{-15}$는 실수가 아니다. (거짓)
ㄴ. 각 $(a, b)$에 대한 실근 $x$의 개수를 세면 다음과 같다.
- $a = 4, 6$ (짝수): $b \in {3, 7, 11}$일 때 각 $2$개씩, $b = -15$일 때 $0$개이므로 $2 \times 3 \times 2 = 12$개
- $a = 9$ (홀수): $b \in {-15, 3, 7, 11}$일 때 각 $1$개씩이므로 $4$개
$3, 7, 11, -15$로부터 나오는 실수 거듭제곱근이 모두 서로 다르므로 $n(C) = 12 + 4 = 16$이다. (참)
ㄷ. 집합 $C$의 양수 원소는 $b \in {3, 7, 11}$에 대하여 $\sqrt[a]{b}$ 꼴이므로 밑 $b$가 가장 크고 지수 $\dfrac{1}{a}$이 가장 클 때 최대이다. 즉, $a = 4, b = 11$일 때 $\sqrt[4]{11}$이 가장 큰 값이다. (참)
따라서 옳은 것은 ㄴ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\pi < \theta < \dfrac{3}{2}\pi$이고 $\tan\theta + \dfrac{1}{\tan\theta} = 6$이라 하자. 이때 $\sin^3\theta + \cos^3\theta$의 값은? [4.5점]

**보기** ① $-\dfrac{5\sqrt{3}}{9}$  ② $-\dfrac{5\sqrt{3}}{18}$  ③ $\dfrac{5\sqrt{3}}{18}$  ④ $\dfrac{5\sqrt{3}}{9}$  ⑤ $-\dfrac{7\sqrt{3}}{9}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\tan\theta + 1/\tan\theta = 1/(\sin\theta\cos\theta) = 6 \implies \sin\theta\cos\theta = 1/6$이다. 18
2. 제3사분면이므로 $\sin\theta+\cos\theta = -\sqrt{1 + 2(1/6)} = -\frac{2\sqrt{3}}{3}$이다. 18
3. $\sin^3\theta+\cos^3\theta = (-\frac{2\sqrt{3}}{3})(1 - 1/6) = -\frac{5\sqrt{3}}{9}$이다. 18
4. 따라서 정답은 ①이다. 18
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_RELATION(삼각함수의 관계)
- 근거 인용: 「$\pi < \theta <」
**RPM** H2-M1-RPM-034 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: tan를 sin/cos로 변형해 sin*cos를 구하고 곱셈공식으로 세제곱 합을 계산한다. 18
**유형** PT=PT_TRIG_IDENTITY_RELATIONS / TPL=NONE
- 이유: tan의 합 조건으로부터 삼각함수의 세제곱 합을 계산하는 유형이다. 18
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분면 부호와 sin^3+cos^3 인수분해 공식을 복합 적용하는 문항이다. 18

**4칸**
- given: 삼각함수←stem:「$\pi < \theta < \dfrac{3}{2}\pi$이고 $\tan\theta + \dfrac{1}{\tan\theta} = 6$이라 하자.」
- goal: 값←stem:「이때 $\sin^3\theta + \cos^3\theta$의 값은?」
- method: 삼각함수(NAMED)←solution:「$\tan\theta + \dfrac{1}{\tan\theta} = \dfrac{\sin\theta}{\cos\theta} + \dfrac{\cos\theta}{\sin\theta}」
- condition: (없음)

**how** sin*cos=1/6과 sin+cos=-2sqrt(3)/3을 구하고 세제곱 합 공식으로 -5sqrt(3)/9를 얻었다. 18

<details><summary>저장 해설 (판정 검토용)</summary>

$\tan\theta + \dfrac{1}{\tan\theta} = \dfrac{\sin\theta}{\cos\theta} + \dfrac{\cos\theta}{\sin\theta} = \dfrac{\sin^2\theta + \cos^2\theta}{\sin\theta\cos\theta} = \dfrac{1}{\sin\theta\cos\theta} = 6$
따라서 $\sin\theta\cos\theta = \dfrac{1}{6}$
$(\sin\theta + \cos\theta)^2 = 1 + 2\sin\theta\cos\theta = 1 + \dfrac{1}{3} = \dfrac{4}{3}$
$\pi < \theta < \dfrac{3}{2}\pi$는 제$3$사분면의 각이므로 $\sin\theta < 0, \cos\theta < 0$이어서 $\sin\theta + \cos\theta = -\dfrac{2}{\sqrt{3}} = -\dfrac{2\sqrt{3}}{3}$이다.
그러므로 $\sin^3\theta + \cos^3\theta = (\sin\theta + \cos\theta)(1 - \sin\theta\cos\theta) = \left(-\dfrac{2\sqrt{3}}{3}\right)\left(1 - \dfrac{1}{6}\right) = -\dfrac{5\sqrt{3}}{9}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.7점


**발문**

정육면체 $ABCD-EFGH$의 부피가 $2^7$일 때, 삼각형 $AFC$의 넓이가 $\sqrt{3} \times 2^{\frac{p}{q}}$이다. 이때 서로소인 두 자연수 $p, q$에 대하여 $10p + q$의 값은? [4.7점]

**보기** ① $83$  ② $113$  ③ $123$  ④ $133$  ⑤ $143$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 한 모서리 $s = 2^{7/3}$이다. 10 ABCD
2. 정삼각형 AFC의 한 변의 길이는 $s\sqrt{2}$이므로 넓이는 $\frac{\sqrt{3}}{4}(s\sqrt{2})^2 = \frac{\sqrt{3}}{2}s^2 = \sqrt{3} \times 2^{11/3}$이다. 10 ABCD
3. $p=11, q=3$이므로 $10p + q = 10(11) + 3 = 113$이다. 10 ABCD
4. 따라서 정답은 ②이다. 10 ABCD
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「정육면체 $ABCD-EFGH」
**RPM** H2-M1-RPM-004 [지수함수와 로그함수 > 지수 > 지수의 확장 > 실수 지수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수의 확장 > 실수 지수**
- 이유: 유리수 지수 계산을 통해 넓이 2^{11/3}의 지수 p, q를 도출한다. 10 ABCD
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=NONE
- 이유: 입체도형 부피 2^7로부터 정삼각형 단면의 넓이를 지수식으로 표현하는 유형이다. 10 ABCD
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 입체도형 대각선 길이와 유리수 지수 연산을 융합한 응용 문항이다. 10 ABCD

**4칸**
- given: 지수←stem:「정육면체 $ABCD-EFGH$의 부피가 $2^7$일 때」
- goal: 값←stem:「이때 서로소인 두 자연수 $p, q$에 대하여 $10p + q$의 값은?」
- method: 넓이(NAMED)←solution:「$\triangle AFC$의 넓이는」
- condition: (없음)

**how** s=2^{7/3}에서 넓이 sqrt(3)*2^{11/3}을 구하고 p=11, q=3에서 10p+q=113을 얻었다. 10 ABCD

<details><summary>저장 해설 (판정 검토용)</summary>

정육면체의 한 모서리의 길이를 $s$라 하면 $s^3 = 2^7$이므로 $s = 2^{\frac{7}{3}}$이다.
세 선분 $AF, FC, CA$는 각각 정육면체의 한 면의 대각선이므로 길이가 모두 $s\sqrt{2}$로 같고, 따라서 $\triangle AFC$는 한 변의 길이가 $s\sqrt{2}$인 정삼각형이다.
$\triangle AFC$의 넓이는
$\dfrac{\sqrt{3}}{4}(s\sqrt{2})^2 = \dfrac{\sqrt{3}}{2}s^2 = \dfrac{\sqrt{3}}{2} \cdot \left(2^{\frac{7}{3}}\right)^2 = \sqrt{3} \times 2^{\frac{14}{3} - 1} = \sqrt{3} \times 2^{\frac{11}{3}}$
따라서 $p = 11, q = 3$이므로 $10p + q = 10 \times 11 + 3 = 113$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$-7 \le x \le 7$에서 정의된 함수 $f$가 다음 조건을 만족시킨다.
(가) $f(x) = \begin{cases} -x + 1 & (0 \le x \le 1) \ -|x - 3| + 2 & (1 < x < 5) \ 2x - 10 & (5 \le x \le 7) \end{cases}$
(나) 모든 실수 $x$에 대하여 $f(-x) = f(x)$
두 함수 $y = f(x)$와 $y = 2^{-\frac{x}{4}}$의 그래프의 교점의 개수를 구하시오. [4.7점]

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x \ge 0$ 구간에서 $x=0$ 교점 1개, $(1, 3), (3, 5), (5, 7)$에서 각 1개씩 총 4개이다. cases 10
2. $x < 0$ 구간에서 $(-3, -1), (-5, -3), (-7, -5)$에서 각 1개씩 총 3개이다. cases 10
3. 전체 교점의 개수는 $4 + 3 = 7$개이다. cases 10
4. 따라서 정답은 ④이다. cases 10
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「$-7 \le x \le 7」
**RPM** H2-M1-RPM-020 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 우함수 대칭성과 지수함수의 함숫값 비교를 통해 교점 개수 7을 도출한다. cases 10
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=NONE
- 이유: 구간별 절댓값 함수와 지수함수 그래프의 교점 개수를 판별하는 유형이다. cases 10
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 꺾인 점들의 높이와 지수함수의 감소 거동을 비교해야 하는 고난도 문항이다. cases 10

**4칸**
- given: 함수←stem:「$-7 \le x \le 7$에서 정의된 함수 $f$가」
- goal: 교점←stem:「그래프의 교점의 개수를 구하시오.」
- method: 대칭(NAMED)←solution:「$y = f(x)$는 $y$축에 대하여 대칭이고,」
- condition: (없음)

**how** x>=0에서 교점 4개, x<0에서 교점 3개를 대소 비교로 확인해 총 7개를 구했다. cases 10

<details><summary>저장 해설 (판정 검토용)</summary>

$y = f(x)$는 $y$축에 대하여 대칭이고, $0 \le x \le 7$에서 꺾인 점의 좌표는 $(0, 1), (1, 0), (3, 2), (5, 0), (7, 4)$이다.
함수 $g(x) = 2^{-\frac{x}{4}}$은 감소함수이며 주요 점에서의 값을 비교하면 다음과 같다.
- $x \ge 0$ 구간:
  - $x = 0$: $f(0) = g(0) = 1$ (교점 $1$개)
  - $x = 1$: $f(1) = 0 < g(1) = 2^{-\frac{1}{4}}$
  - $x = 3$: $f(3) = 2 > g(3) = 2^{-\frac{3}{4}}$ (구간 $(1, 3)$에서 교점 $1$개)
  - $x = 5$: $f(5) = 0 < g(5) = 2^{-\frac{5}{4}}$ (구간 $(3, 5)$에서 교점 $1$개)
  - $x = 7$: $f(7) = 4 > g(7) = 2^{-\frac{7}{4}}$ (구간 $(5, 7)$에서 교점 $1$개)
- $x < 0$ 구간 ($g$는 $1$에서 증가):
  - $x = -1$: $f(-1) = 0 < g(-1) = 2^{\frac{1}{4}}$
  - $x = -3$: $f(-3) = 2 > g(-3) = 2^{\frac{3}{4}}$ ($2^4=16 > 2^3=8$이므로 구간 $(-3, -1)$에서 교점 $1$개)
  - $x = -5$: $f(-5) = 0 < g(-5) = 2^{\frac{5}{4}}$ (구간 $(-5, -3)$에서 교점 $1$개)
  - $x = -7$: $f(-7) = 4 > g(-7) = 2^{\frac{7}{4}}$ ($2^8=256 > 2^7=128$이므로 구간 $(-7, -5)$에서 교점 $1$개)
따라서 교점의 개수는 $4 + 3 = 7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

함수 $y = 4\log_2(x - 1)$의 그래프 위의 한 점 $A$를 지나고 $x$축에 평행한 직선이 함수 $y = 2^{x - 3}$의 그래프와 만나는 점을 $B$, 점 $B$를 지나고 $y$축에 평행한 직선이 함수 $y = 4\log_2(x - 1)$의 그래프와 만나는 점을 $D$, 점 $D$를 지나고 $x$축에 평행한 직선이 함수 $y = 2^{x - 3}$의 그래프와 만나는 점을 $C$라 하자. $\overline{AB} = 2$, $\overline{BD} = 4$일 때, 사각형 $ABCD$의 넓이는? (단, 점 $A$의 $x$좌표는 점 $B$의 $x$좌표보다 작고, 점 $D$의 $y$좌표는 점 $B$의 $y$좌표보다 크다.) [4.8점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $\dfrac{11}{2}$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $A(a, 4\log_2(a-1)), B(a+2, 4\log_2(a-1))$에서 $\overline{BD}=4$이므로 $a=3$이다. 11 ABCD
2. 따라서 $A(3, 4), B(5, 4), D(5, 8), C(6, 8)$이다. 11 ABCD
3. 사다리꼴 넓이는 $\frac{2+1}{2} \times 4 = 6$이다. 11 ABCD
4. 따라서 정답은 ⑤이다. 11 ABCD
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH(로그함수의 그래프)
- 근거 인용: 「함수 $y = 4\log_2」
**RPM** H2-M1-RPM-028 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점**
- 이유: 두 곡선의 좌표 관계식으로부터 꼭짓점을 결정하고 넓이를 계산한다. 11 ABCD
**유형** PT=PT_LOG_APPLICATION / TPL=NONE
- 이유: 로그함수와 지수함수 위의 점들로 이루어진 사다리꼴의 넓이 6을 구하는 유형이다. 11 ABCD
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 점 A, B, D, C의 좌표를 연립방정식으로 구하고 사다리꼴 넓이를 구하는 문항이다. 11 ABCD

**4칸**
- given: 로그함수←stem:「함수 $y = 4\log_2(x - 1)$의 그래프 위의 한 점 $A$를 지나고」
- goal: 넓이←stem:「사각형 $ABCD$의 넓이는?」
- method: 좌표(NAMED)←solution:「따라서 $A(3, 4)$, $B(5, 4)$, $D(5, 8)$이다.」
- condition: (없음)

**how** BD=4로부터 a=3을 구하고 사다리꼴 밑변 2, 윗변 1, 높이 4로 넓이 6을 계산했다. 11 ABCD

<details><summary>저장 해설 (판정 검토용)</summary>

$A(a, 4\log_2(a - 1))$이라 하면 $\overline{AB} = 2$이고 $x_B > x_A$이므로 $B(a + 2, 4\log_2(a - 1))$이다.
점 $D$는 $x = a + 2$에서 곡선 $y = 4\log_2(x - 1)$ 위의 점이고 $\overline{BD} = 4$이므로
$4\log_2(a + 1) - 4\log_2(a - 1) = 4 \implies \log_2 \dfrac{a + 1}{a - 1} = 1 \implies \dfrac{a + 1}{a - 1} = 2 \implies a = 3$
따라서 $A(3, 4)$, $B(5, 4)$, $D(5, 8)$이다. ($B(5, 4)$는 $y = 2^{5-3} = 4$를 만족한다.)
점 $C$는 $y = 2^{x - 3}$ 위의 점 중 $y = 8$인 점이므로 $2^{x - 3} = 8 \implies x = 6$, 즉 $C(6, 8)$이다.
사다리꼴 $ABCD$에서 $\overline{AB} = 2$, $\overline{DC} = 6 - 5 = 1$, 높이 $\overline{BD} = 4$이므로 넓이는
$\dfrac{2 + 1}{2} \times 4 = 6$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

세 곡선 $y = 3^{x - 1}$, $y = \log_3(x - 1)$, $y = \log_{\frac{1}{2}}(x - 2)$와 $x$축, $y$축으로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하시오. [4.8점]

**보기** ① $5$개  ② $6$개  ③ $7$개  ④ $8$개  ⑤ $9$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=0$일 때 $(0, 0)$의 1개. 2.5
2. $x=1$일 때 $(1, 0), (1, 1)$의 2개. 2.5
3. $x=2$일 때 $(2, 0), (2, 1), (2, 2), (2, 3)$의 4개. 2.5
4. 전체 정수점의 개수는 $1 + 2 + 4 = 7$개이다. 따라서 정답은 ③이다. 2.5
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH(로그함수의 그래프)
- 근거 인용: 「세 곡선 $y = 3^{x」
**RPM** H2-M1-RPM-028 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점**
- 이유: 곡선의 경계식에 x 정수값을 대입하여 y 정수점의 개수 7을 도출한다. 2.5
**유형** PT=PT_LOG_APPLICATION / TPL=NONE
- 이유: 지수함수와 로그함수로 둘러싸인 영역 내부의 격자점(정수점) 개수를 세는 유형이다. 2.5
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 세 곡선의 경계와 점근선을 정확히 파악하여 x별 정수점을 세는 심화 문항이다. 2.5

**4칸**
- given: 로그함수←stem:「세 곡선 $y = 3^{x - 1}$, $y = \log_3(x - 1)$,」
- goal: 좌표←stem:「$x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하시오.」
- method: 절편(NAMED)←solution:「각 곡선의 $x$절편과 $y$절편을 확인하면」
- condition: (없음)

**how** x=0에서 1개, x=1에서 2개, x=2에서 4개로 총 7개의 정수점을 세었다. 2.5

<details><summary>저장 해설 (판정 검토용)</summary>

각 곡선의 $x$절편과 $y$절편을 확인하면
- $y = 3^{x - 1}$: $(0, \frac{1}{3})$, $(1, 1)$, $(2, 3)$을 지난다.
- $y = \log_3(x - 1)$: $(2, 0)$, $(4, 1)$을 지난다.
- $y = \log_{\frac{1}{2}}(x - 2)$: 점근선 $x = 2$, $(3, 0)$, $(2.5, 1)$을 지난다.
둘러싸인 영역 내 정수점 $(x, y)$를 $x$좌표별로 세면
- $x = 0$: $0 \le y \le \dfrac{1}{3} \implies (0, 0)$ ($1$개)
- $x = 1$: $0 \le y \le 1 \implies (1, 0), (1, 1)$ ($2$개)
- $x = 2$: $\log_3(2 - 1) = 0 \le y \le 3 \implies (2, 0), (2, 1), (2, 2), (2, 3)$ ($4$개)
- $x = 3$: $\log_{\frac{1}{2}}(3 - 2) = 0 < \log_3 2$이므로 영역에 포함되는 정수점이 없다.
따라서 구하는 점의 개수는 $1 + 2 + 4 = 7$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

서답형 1. (서술형) 다음 부등식을 푸시오. [4점]
$$(x + 1)^{x^2 - 12} < (x + 1)^{-x^2 + 2x} \quad (\text{단, } x > -1)$$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $0 < x < 3$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑 $x+1 > 0$이므로 범위를 나누어 푼다. 12
2. (1) $-1 < x < 0$일 때: 부등호 반전 $x^2-12 > -x^2+2x \implies (x-3)(x+2)>0$으로 공통 범위 없음. 12
3. (2) $x=0$일 때 성립 안 함. 12
4. (3) $x > 0$일 때: 부등호 유지 $(x-3)(x+2)<0 \implies 0 < x < 3$이다. 12
5. 따라서 해는 $0 < x < 3$이다. 12
- 작성자 답: $0 < x < 3$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「서답형 1. (서술형) 다음」
**RPM** H2-M1-RPM-017 [지수함수와 로그함수 > 지수함수 > 지수부등식 > 밑의 범위에 따른 부등호] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수부등식 > 밑의 범위에 따른 부등호**
- 이유: 밑의 범위 0<x+1<1과 x+1>1에 따른 부등호 방향 변화를 적용한다. 12
**유형** PT=PT_EXPONENTIAL_INEQUALITY / TPL=NONE
- 이유: 밑에 미지수가 포함된 지수부등식에서 밑의 범위를 분류하여 해를 구하는 유형이다. 12
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 밑 조건에 따라 부등호 방향을 나누어 서술해야 하는 서술형 문항이다. 12

**4칸**
- given: 부등식←stem:「서답형 1. (서술형) 다음 부등식을 푸시오.」
- goal: 해←stem:「다음 부등식을 푸시오.」
- method: 부등식(NAMED)←solution:「밑 $x + 1 > 0$이므로 $x + 1$의 범위에 따라 세 경우로 나눈다.」
- condition: (없음)

**how** x+1>1일 때 지수 부등식을 풀어 해 0<x<3을 서술형으로 구했다. 12

<details><summary>저장 해설 (판정 검토용)</summary>

밑 $x + 1 > 0$이므로 $x + 1$의 범위에 따라 세 경우로 나눈다.
(1) $0 < x + 1 < 1$, 즉 $-1 < x < 0$일 때: 부등호 방향이 바뀌므로
$x^2 - 12 > -x^2 + 2x \implies 2x^2 - 2x - 12 > 0 \implies (x - 3)(x + 2) > 0$
$x < -2$ 또는 $x > 3$이므로 $-1 < x < 0$과의 공통 범위는 없다.
(2) $x + 1 = 1$, 즉 $x = 0$일 때: $1^{-12} < 1^0$은 성립하지 않는다.
(3) $x + 1 > 1$, 즉 $x > 0$일 때: 부등호 방향이 유지되므로
$(x - 3)(x + 2) < 0 \implies -2 < x < 3$
$x > 0$과의 공통 범위는 $0 < x < 3$이다.
따라서 구하는 부등식의 해는 $0 < x < 3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

서답형 2. (서술형) $-10 \le x \le 10$에서 다음 부등식
$$\log_{x - 1}(2x^2 - 7x + 6) > 2$$
을 만족하는 정수 $x$의 개수를 풀이 과정과 함께 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $7$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑 조건 $x>1, x \ne 2$, 진수 조건 $x < 3/2$ 또는 $x > 2$이다. 10
2. $x > 2$일 때 $2x^2-7x+6 > (x-1)^2 \implies x^2-5x+5 > 0 \implies x > \frac{5+\sqrt{5}}{2} \approx 3.62$이다. 10
3. $-10 \le x \le 10$에서 만족하는 정수는 $4, 5, 6, 7, 8, 9, 10$의 7개이다. 10
- 작성자 답: $7$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION(로그함수의 활용)
- 근거 인용: 「서답형 2. (서술형) $-」
**RPM** H2-M1-RPM-025 [지수함수와 로그함수 > 로그함수 > 로그부등식 > 정의역·밑 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그부등식 > 정의역·밑 조건**
- 이유: 밑과 진수 조건을 확인하고 밑이 1보다 큰 구간에서 부등식을 풀어 7개를 찾는다. 10
**유형** PT=PT_LOG_FUNCTION_INEQUALITY / TPL=NONE
- 이유: 밑과 진수에 미지수가 있는 로그부등식을 풀고 정수해의 개수 7을 구하는 유형이다. 10
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 밑의 범위 분할과 근의 공식을 이용한 정수해 선별 서술형 문항이다. 10

**4칸**
- given: 부등식←stem:「$-10 \le x \le 10$에서 다음 부등식」
- goal: 정수←stem:「만족하는 정수 $x$의 개수를 풀이 과정과 함께 서술하시오.」
- method: 진수 조건(NAMED)←solution:「밑 조건과 진수 조건에 의하여」
- condition: (없음)

**how** 밑 조건, 진수 조건을 구하고 x>3.62와 연립해 4부터 10까지 7개를 구했다. 10

<details><summary>저장 해설 (판정 검토용)</summary>

밑 조건과 진수 조건에 의하여
$x - 1 > 0, x - 1 \neq 1 \implies x > 1, x \neq 2$
$2x^2 - 7x + 6 = (2x - 3)(x - 2) > 0 \implies x < \dfrac{3}{2}$ 또는 $x > 2$
(1) $1 < x < 2$ (밑 $0 < x - 1 < 1$)일 때: $1 < x < \dfrac{3}{2}$이므로 정수 없음.
(2) $x > 2$ (밑 $x - 1 > 1$)일 때:
$2x^2 - 7x + 6 > (x - 1)^2 = x^2 - 2x + 1$
$x^2 - 5x + 5 > 0 \implies x < \dfrac{5 - \sqrt{5}}{2} \approx 1.38$ 또는 $x > \dfrac{5 + \sqrt{5}}{2} \approx 3.62$
$-10 \le x \le 10$이고 $x > 2$인 범위와 합치면 $4 \le x \le 10$인 정수 $x = 4, 5, 6, 7, 8, 9, 10$의 $7$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

서답형 3. (서술형) 방사성 물질을 보관하는 곳에는 외부로 방사선 입자가 누출되는 것을 방지하기 위하여 특수 보호막을 설치한다. 어떤 방사선 입자의 $25\%$를 막아주는 보호막을 $10$장 설치하였을 때, $10$장째 보호막을 통과한 방사선 입자의 양은 처음 양의 약 몇 $\%$인지 풀이 과정과 함께 서술하시오. (단, $\log 2 = 0.3010$, $\log 3 = 0.4771$, $\log 5.636 = 0.7510$이다.) [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 약 $5.64\%$ (약 $5.6\%$)   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $k = (3/4)^{10}$이라 하고 상용로그를 취하면 $\log k = 10(0.4771 - 2 \times 0.3010) = -1.2490$이다. 25
2. $-1.2490 = -2 + 0.7510 = \log 10^{-2} + \log 5.636 = \log 0.05636$이다. 25
3. 따라서 $k = 0.05636$이므로 약 5.6%이다. 25
- 작성자 답: 약 $5.64\%$ (약 $5.6\%$) → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-EXPONENT_LOG_APPLICATION(지수와 로그의 활용)
- 근거 인용: 「서답형 3. (서술형) 방사」
**RPM** H2-M1-RPM-012 [지수함수와 로그함수 > 로그 > 상용로그 > 소수점 위치] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 소수점 위치**
- 이유: 상용로그 계산으로 (3/4)^10의 값을 추정하여 백분율 5.6%를 도출한다. 25
**유형** PT=PT_EXPONENTIAL_DECAY / TPL=NONE
- 이유: 방사선 차단율 25%의 연속 적용 실생활 문제를 상용로그로 해결하는 유형이다. 25
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 상용로그 지표와 가수 분리를 통해 0.05636을 유도하는 서술형 문항이다. 25

**4칸**
- given: 상용로그←stem:「단, $\log 2 = 0.3010$, $\log 3 = 0.4771$,」
- goal: 상용로그←stem:「처음 양의 약 몇 $\%$인지 풀이 과정과 함께 서술하시오.」
- method: 상용로그(NAMED)←solution:「$10$장을 통과한 후의 비율을 $k = \left(\dfrac{3}{4}\right)^{10}$이라 하고 상용로그를 취하면」
- condition: (없음)

**how** log k = -1.2490 = -2 + 0.7510에서 k=0.05636을 얻어 약 5.6%를 구했다. 25

<details><summary>저장 해설 (판정 검토용)</summary>

보호막을 $1$장 통과할 때마다 입자의 $25\%$가 차단되므로 $75\% = \dfrac{3}{4}$이 통과한다.
$10$장을 통과한 후의 비율을 $k = \left(\dfrac{3}{4}\right)^{10}$이라 하고 상용로그를 취하면
$\log k = 10(\log 3 - 2\log 2) = 10(0.4771 - 2 \times 0.3010) = 10 \times (-0.1249) = -1.2490$
$-1.2490 = -2 + 0.7510 = \log 10^{-2} + \log 5.636 = \log 0.05636$
따라서 $k = 0.05636$이므로 처음 양의 약 $5.636\%$ (약 $5.6\%$)이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

서답형 4. (서술형) 두 함수 $y = \left(\dfrac{4}{3}\right)^{x + 1} + 2$, $y = \left(\dfrac{4}{3}\right)^{x - 2} - 1$의 그래프가 기울기가 $-1$인 직선과 만나는 교점을 각각 $A, B$라 하자. 두 점 $A, B$의 중점이 $\left(\dfrac{5}{2}, a\right)$이고 원점을 $O$라 할 때, 삼각형 $OAB$의 넓이를 $S$라 하자. $\dfrac{2S}{a}$의 값을 구하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{258}{41}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행이동 $(3, -3)$으로부터 $A(1, 34/9), B(4, 7/9)$이고 중점 y좌표 $a = 41/18$이다. OAB
2. 선분 $AB = 3\sqrt{2}$, 원점과 직선 사이 거리 $h = \frac{43}{9\sqrt{2}}$이므로 넓이 $S = 43/6$이다. OAB
3. $\frac{2S}{a} = \frac{2 \times 43/6}{41/18} = \frac{258}{41}$이다. OAB
- 작성자 답: $\dfrac{258}{41}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「서답형 4. (서술형) 두」
**RPM** H2-M1-RPM-020 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 두 지수함수의 평행이동 관계와 중점 좌표로부터 꼭짓점과 넓이를 구한다. OAB
**유형** PT=PT_EXPONENTIAL_EQUATION / TPL=NONE
- 이유: 지수함수의 평행이동 벡터와 직선 기울기 관계를 이용해 삼각형 OAB 넓이를 구하는 유형이다. OAB
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 기울기 -1 직선과의 교점을 평행이동 벡터로 찾고 점과 직선 사이 거리로 푸는 고난도 서술형이다. OAB

**4칸**
- given: 지수함수←stem:「두 함수 $y = \left(\dfrac{4}{3}\right)^{x + 1} + 2$,」
- goal: 값←stem:「$\dfrac{2S}{a}$의 값을 구하시오.」
- method: 평행이동(NAMED)←solution:「곡선 $y = g(x)$는 곡선 $y = f(x)$를 $x$축의 방향으로 $3$만큼,」
- condition: (없음)

**how** A(1, 34/9), B(4, 7/9)에서 a=41/18, S=43/6을 구하고 2S/a = 258/41을 계산했다. OAB

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x) = \left(\dfrac{4}{3}\right)^{x + 1} + 2$, $g(x) = \left(\dfrac{4}{3}\right)^{x - 2} - 1$이라 하면 $g(x) = f(x - 3) - 3$이므로
곡선 $y = g(x)$는 곡선 $y = f(x)$를 $x$축의 방향으로 $3$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 것이다.
평행이동 벡터 $(3, -3)$이 기울기 $-1$인 직선과 평행하므로 $B$는 $A$를 $(3, -3)$만큼 평행이동한 점이다.
중점 $M\left(\dfrac{5}{2}, a\right)$로부터 $A$의 $x$좌표는 $\dfrac{5}{2} - \dfrac{3}{2} = 1$이고, $B$의 $x$좌표는 $\dfrac{5}{2} + \dfrac{3}{2} = 4$이다.
점 $A(1, f(1))$의 $y$좌표는 $\left(\dfrac{4}{3}\right)^2 + 2 = \dfrac{16}{9} + 2 = \dfrac{34}{9}$이고, $B$의 $y$좌표는 $\dfrac{34}{9} - 3 = \dfrac{7}{9}$이다.
따라서 $a = \dfrac{\frac{34}{9} + \frac{7}{9}}{2} = \dfrac{41}{18}$이다.
선분 $AB$의 길이는 $\sqrt{3^2 + (-3)^2} = 3\sqrt{2}$이고, 직선 $AB$의 방정식은 $x + y = \dfrac{5}{2} + \dfrac{41}{18} = \dfrac{43}{9}$이다.
원점 $O$에서 직선 $AB$까지의 거리 $h = \dfrac{43}{9\sqrt{2}}$이므로 삼각형 $OAB$의 넓이 $S$는
$S = \dfrac{1}{2} \times 3\sqrt{2} \times \dfrac{43}{9\sqrt{2}} = \dfrac{43}{6}$
따라서 $\dfrac{2S}{a} = \dfrac{2 \times \frac{43}{6}}{\frac{41}{18}} = \dfrac{43}{3} \times \dfrac{18}{41} = \dfrac{258}{41}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
