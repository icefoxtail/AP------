# 검수 묶음 — 24_신흥중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4)**
- 문항 24개 / 검사 PASS 20, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 5, SELF_CONTAINED 19
- 난이도 분포: 1단계 4, 2단계 10, 3단계 6, 4단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q7**: 검사 코드: CHOICE_ORDER
- **Q8**: 검사 코드: CHOICE_ORDER
- **Q9**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 검사 코드: CHOICE_ORDER / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 검사 코드: CHOICE_ORDER / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

다음 직각삼각형 $ABC$($\angle C=90^\circ, AB=13, AC=12, BC=5$)에서 옳지 않은 것을 모두 고르면? (정답 2개)

**보기** ① $\sin A=\dfrac{5}{13}$  ② $\cos A=\dfrac{13}{12}$  ③ $\tan A=\dfrac{5}{12}$  ④ $\sin B=\dfrac{5}{13}$  ⑤ $\cos B=\dfrac{5}{13}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AB=10, AC=8, BC=6$ 또는 $AB=13, AC=12, BC=5$이다.
2. 피타고라스 정리와 삼각비 정의에 의해 $\cos A = 12/13, \sin B = 12/13$ 등 선지를 판별한다.
3. 따라서 정답은 ②, ④이다.
- 작성자 답: ②, ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형 $ABC$」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형에서 삼각비의 뜻을 다루는 sin·cos·tan 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각삼각형에서 삼각비 정의를 적용하여 각 삼각비 값을 판별하는 유형이다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 삼각비 정의를 대조하는 난이도 1 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$」<br>길이←stem:「AB=13, AC=12, BC=5」
- goal: 삼각비←stem:「옳지 않은 것」
- method: 삼각비(NAMED)←solution:「\cos A=\dfrac{12}{13}」
- condition: 각←stem:「\angle C=90^\circ」

**how** 직각삼각형의 변의 길이로부터 삼각비 정의를 적용하여 참인 선지를 골랐다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle C=90^\circ$이므로 빗변은 $AB=13$이다. 각 $A$에 대하여 $\sin A=\dfrac{5}{13}$, $\cos A=\dfrac{12}{13}$, $\tan A=\dfrac{5}{12}$이므로 ②는 옳지 않다. 각 $B$에 대하여 $\sin B=\dfrac{12}{13}$, $\cos B=\dfrac{5}{13}$이므로 ④도 옳지 않다. 따라서 옳지 않은 것은 ②, ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

다음 그림과 같이 직각변의 길이가 $5$, $12$인 직각삼각형에서 $\sin x + \cos y$의 값은?

**보기** ① $\dfrac{13}{12}$  ② $\dfrac{15}{13}$  ③ $\dfrac{17}{13}$  ④ $\dfrac{19}{13}$  ⑤ $\dfrac{24}{13}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각변의 길이가 $5, 12$인 직각삼각형에서 빗변의 길이는 $\sqrt{5^2+12^2} = 13$이다.
2. 예각 $x, y$에 대하여 $\sin x + \cos y = 12/13 + 5/13 = 17/13$이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 직각변의 길이가

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형에서 삼각비 값을 구하는 sin·cos·tan 유형이다. (문항 토큰 12)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각변의 길이로부터 빗변과 삼각비 식의 값을 계산하는 유형이다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 빗변 계산과 삼각비 덧셈을 수행하는 난이도 2 문항이다. (문항 토큰 12)

**4칸**
- given: 직각삼각형←stem:「직각삼각형」<br>길이←stem:「길이가 $5$, $12$」
- goal: 합←stem:「$\sin x + \cos y$의 값」
- method: 합(NAMED)←solution:「\dfrac{12}{13} + \dfrac{5}{13} = \dfrac{17}{13}」
- condition: 예각←solution:「예각의 크기는 같으므로 $y=x$」

**how** 피타고라스 정리로 빗변을 구하고 삼각비의 합을 계산했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

큰 직각삼각형의 빗변의 길이는 $\sqrt{5^2+12^2}=13$이다. $\sin x = \dfrac{12}{13}$이고, 서로 수직인 두 직선이 이루는 예각의 크기는 같으므로 $y=x$이다. 따라서 $\cos y = \cos x = \dfrac{5}{13}$이므로 $$ \sin x + \cos y = \dfrac{12}{13} + \dfrac{5}{13} = \dfrac{17}{13} $$ 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

$2\sin 45^\circ + \tan 45^\circ - 3\sin 0^\circ + 2\cos 90^\circ$의 값은?

**보기** ① $\sqrt{2}+1$  ② $\sqrt{2}-1$  ③ $-\sqrt{2}+1$  ④ $\sqrt{2}$  ⑤ $2\sqrt{2}+1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2\sin 45^\circ + \tan 45^\circ - 3\cos 30^\circ = 2(\sqrt{2}/2) + 1 - 3(\sqrt{3}/2) = \sqrt{2} + 1 - \dfrac{3\sqrt{3}}{2}$이다.
2. 특수각 $45^\circ, 30^\circ$의 삼각비를 대입하여 계산하면 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「2\sin 45^\circ + \tan 45^\circ」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산]
- 이유: 특수각 삼각비의 사칙연산을 다루는 특수각 계산 유형이다. (문항 토큰 45)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각의 삼각비 값을 이용해 대수식을 계산하는 유형이다. (문항 토큰 45)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 특수각 수치를 직접 계산하는 난이도 1 문항이다. (문항 토큰 45)

**4칸**
- given: 삼각비←stem:「2\sin 45^\circ + \tan 45^\circ」
- goal: 합←stem:「$2\sin 45^\circ + \t」
- method: 삼각비(NAMED)←solution:「\sin 45^\circ=\dfrac{\sqrt{2}}{2}」
- condition: 대입←solution:「2\times\dfrac{\sqrt{2}}{2} + 1」

**how** 특수각의 삼각비 값을 대입하여 식을 계산했다. (문항 토큰 45)

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin 45^\circ=\dfrac{\sqrt{2}}{2}$, $\tan 45^\circ=1$, $\sin 0^\circ=0$, $\cos 90^\circ=0$이므로 $$ 2\times\dfrac{\sqrt{2}}{2} + 1 - 3\times 0 + 2\times 0 = \sqrt{2}+1 $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 5점


**발문**

다음 그림과 같이 $y$절편이 $6$이고, $x$축과 이루는 예각의 크기가 $30^\circ$이며 오른쪽 아래로 향하는 직선의 방정식을 구하면?

**보기** ① $x+\sqrt{3}y-6=0$  ② $\sqrt{3}x+y-6=0$  ③ $x-\sqrt{3}y+6\sqrt{3}=0$  ④ $x+\sqrt{3}y-6\sqrt{3}=0$  ⑤ $\sqrt{3}x+3y-6=0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $y$절편이 $6$이고 $x$축과 이루는 예각의 크기가 $30^\circ$이다.
2. 기울기 $m = -\tan 30^\circ = -\dfrac{\sqrt{3}}{3}$이므로 직선의 방정식은 $y = -\dfrac{\sqrt{3}}{3}x + 6$이다.
3. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $y$절편이 $6$이고

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$y$절편이 $6$」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이]
- 이유: 각과 기울기의 기하적 관계를 다루는 각을 이용한 길이 유형이다. (문항 토큰 30)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직선의 기울기와 탄젠트 삼각비의 관계를 결합한 일차함수 식 결정 유형이다. (문항 토큰 30)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기울기와 삼각비의 융합 개념을 적용하는 난이도 3 문항이다. (문항 토큰 30)

**4칸**
- given: 직선←stem:「$y$절편이 $6$」<br>예각←stem:「예각의 크기가 $30^\circ$」
- goal: 직선←stem:「직선의 방정식」
- method: 삼각비(NAMED)←solution:「\tan 30^\circ」
- condition: 삼각비←solution:「\tan 30^\circ=\dfrac{\sqrt{3}}{3}」

**how** 직선의 기울기가 예각 탄젠트 값에 음의 부호를 붙인 것임을 이용해 직선식을 구했다. (문항 토큰 30)

<details><summary>저장 해설 (판정 검토용)</summary>

오른쪽 아래로 향하므로 기울기는 음수이고, 절댓값은 $\tan 30^\circ=\dfrac{\sqrt{3}}{3}$이다. 기울기가 $-\dfrac{\sqrt{3}}{3}$, $y$절편이 $6$이므로 직선의 방정식은 $y=-\dfrac{\sqrt{3}}{3}x+6$이다. 양변에 $\sqrt{3}$을 곱하여 정리하면 $x+\sqrt{3}y-6\sqrt{3}=0$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

$45^\circ < x < 90^\circ$일 때, $\sqrt{(\sin x+\cos x)^2}+\sqrt{(\sin x-\cos x)^2}$을 간단히 하면?

**보기** ① $2\cos x$  ② $2\sin x$  ③ $0$  ④ $-2\cos x$  ⑤ $-2\sin x$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $45^\circ < x < 90^\circ$에서 $\sin x > \cos x > 0$이다.
2. $\sqrt{(\sin x+\cos x)^2} + \sqrt{(\sin x-\cos x)^2} = |\sin x+\cos x| + |\sin x-\cos x| = (\sin x+\cos x) + (\sin x-\cos x) = 2\sin x$이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$45^\circ < x < 90^\circ$」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 삼각비 사이의 대소와 부호 관계를 다루는 삼각비의 관계 유형이다. (문항 토큰 45)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_MONOTONIC
- 이유: 삼각비의 대소 관계와 근호식의 절댓값 변환을 결합한 정리 유형이다. (문항 토큰 45)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각비 대소 판별과 근호 부호 처리를 함께 요구하는 난이도 2 문항이다. (문항 토큰 45)

**4칸**
- given: 예각←stem:「$45^\circ < x < 90^\circ$」<br>제곱근←stem:「\sqrt{(\sin x+\cos x)^2}」
- goal: 합←stem:「간단히 하면」
- method: 차(NAMED)←solution:「\sin x-\cos x」
- condition: 삼각비←solution:「\sin x > \cos x > 0」

**how** 각의 범위에 따른 sin과 cos의 대소 관계를 이용해 근호식을 간단히 했다. (문항 토큰 45)

<details><summary>저장 해설 (판정 검토용)</summary>

$45^\circ < x < 90^\circ$에서는 $\sin x > \cos x > 0$이므로 $$ |\sin x+\cos x| + |\sin x-\cos x| = (\sin x+\cos x) + (\sin x-\cos x) = 2\sin x $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$일 때, $\tan 50^\circ - \cos 40^\circ$의 값은?

**보기** ① $0.3258$  ② $0.3858$  ③ $0.4058$  ④ $0.4158$  ⑤ $0.4258$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 $1$인 사분원에서 $\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$이다.
2. 차: $1.1918 - 0.7660 = 0.4258$ (선지 중 0.3258 등과 대조)
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $1$인 사분원에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $1$인 사분원」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 사분원 기하 모델에서 삼각비를 다루는 sin·cos·tan 유형이다. (문항 토큰 50)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 단위원(사분원)에서 삼각비의 기하적 정의와 선분 대응 관계를 확인하는 유형이다. (문항 토큰 50)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분원 선분 매핑 기초 개념을 확인하는 난이도 1 문항이다. (문항 토큰 50)

**4칸**
- given: 사분원←stem:「반지름의 길이가 $1$인 사분원」
- goal: 차←stem:「\tan 50^\circ - \cos 40^\circ」
- method: 차(NAMED)←solution:「1.1918 - 0.7660 = 0.4258」
- condition: 삼각비←stem:「$\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$」

**how** 사분원에서 각 삼각비에 대응하는 선분의 길이를 기하적으로 식별했다. (문항 토큰 50)

<details><summary>저장 해설 (판정 검토용)</summary>

$\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$이므로 $$ \tan 50^\circ - \cos 40^\circ = 1.1918 - 0.7660 = 0.4258 $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차방정식 $5x^2-9x+4=0$의 한 근을 $\sin a^\circ$라 할 때, $\cos a^\circ \times \tan a^\circ$의 값을 구하면? (단, $0^\circ < a^\circ < 90^\circ$)

**보기** ① $\dfrac{4}{5}$  ② $1$  ③ $\dfrac{3}{5}$  ④ $\dfrac{3}{4}$  ⑤ $\dfrac{12}{25}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이차방정식 $5x^2 - 9x + 4 = 0 \implies (5x-4)(x-1) = 0$
2. $0^\circ < a^\circ < 90^\circ$이므로 $\sin a^\circ = 4/5$이다. (상수 12, 25 관련 계산)
3. $\cos a^\circ \times \tan a^\circ = \cos a^\circ \times \dfrac{\sin a^\circ}{\cos a^\circ} = \sin a^\circ = 4/5$이다.
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「\sin a^\circ」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 방정식과 삼각비 값의 관계를 다루는 삼각비의 관계 유형이다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: 이차방정식의 해로부터 삼각비를 결정하고 다른 삼각비 값을 연계하는 유형이다. (문항 토큰 90)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식 인수분해와 삼각비 정의를 결합한 난이도 3 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각비←stem:「\sin a^\circ」
- goal: 곱←stem:「\cos a^\circ \times \tan a^\circ」
- method: 삼각비(NAMED)←solution:「\cos a^\circ \times \dfrac{\sin a^\circ}{\cos a^\circ}」
- condition: 예각←stem:「$0^\circ < a^\circ < 90^\circ$」

**how** 이차방정식을 풀어 삼각비 값을 구하고 직각삼각형 비례로 나머지 삼각비를 계산했다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$5x^2-9x+4 = (5x-4)(x-1) = 0$이므로 $x=\dfrac{4}{5}$ 또는 $x=1$이다. $0^\circ < a^\circ < 90^\circ$이므로 $0 < \sin a^\circ < 1$이고, 따라서 $\sin a^\circ = \dfrac{4}{5}$이다. $$ \cos a^\circ \times \tan a^\circ = \cos a^\circ \times \dfrac{\sin a^\circ}{\cos a^\circ} = \sin a^\circ = \dfrac{4}{5} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림에서 $\angle C=90^\circ$, $\angle ABC=30^\circ$, $\angle AEC=60^\circ$이고 $\overline{BE}=8$일 때, $\overline{EC}$의 길이 $x$의 값은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $2\sqrt{3}$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $ABC$에서 $\angle C=90^\circ, \angle ABC=30^\circ, \angle AEC=60^\circ$이다.
2. $\overline{BE}=8$이고 $\triangle ABE$는 이등변삼각형이므로 $\overline{AE} = 8$이다.
3. 직각삼각형 $AEC$에서 $\overline{EC} = 8\cos 60^\circ = 4$이다.
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\angle C=90^\circ$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「$\overline{BE}=8$」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변]
- 이유: 직각삼각형의 변의 길이를 삼각비로 계산하는 직각삼각형의 변 유형이다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각삼각형에서 삼각비와 주어진 변의 길이를 이용해 미지 변을 계산하는 유형이다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 성질과 코사인 삼각비를 결합한 난이도 2 문항이다. (문항 토큰 90)

**4칸**
- given: 길이←stem:「$\overline{BE}=8$」<br>각←stem:「$\angle ABC=30^\circ$, $\angle AEC=60^\circ$」
- goal: 길이←stem:「$\overline{EC}$의 길이 $x$」
- method: 삼각비(NAMED)←solution:「x\tan 60^\circ」
- condition: 직각삼각형←solution:「직각삼각형 $ABC$」

**how** 외각 성질로 이등변삼각형을 확인하고 특수각 직각삼각형에서 변을 구했다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$BC = 8+x$이고 직각삼각형 $ABC$, $AEC$에서 $$ AC = (8+x)\tan 30^\circ = \dfrac{8+x}{\sqrt{3}}, \qquad AC = x\tan 60^\circ = x\sqrt{3} $$ 따라서 $\dfrac{8+x}{\sqrt{3}} = x\sqrt{3} \implies 8+x = 3x \implies x=4$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\triangle ABC$의 넓이는?

**보기** ① $25(\sqrt{3}+1),\mathrm{cm}^2$  ② $\dfrac{25(\sqrt{3}-1)}{2},\mathrm{cm}^2$  ③ $25\sqrt{3},\mathrm{cm}^2$  ④ $\dfrac{25(\sqrt{3}+1)}{2},\mathrm{cm}^2$  ⑤ $50(\sqrt{3}+1),\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$에서 $BC=10\,\mathrm{cm}, \angle B=30^\circ, \angle C=105^\circ$이다.
2. 점 $A$에서 $BC$에 수선 $AD$를 내리면 $\triangle ABD$는 $30^\circ, 60^\circ, 90^\circ$, $\triangle ACD$는 $45^\circ, 45^\circ, 90^\circ$이다.
3. 넓이를 계산하면 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용]
- 이유: 보조선을 그어 삼각비를 활용하는 보조선 활용 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 일반 삼각형에서 보조선 수선을 활용해 삼각비로 변의 길이를 구하는 유형이다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 보조선 수선 작도와 다단계 계산을 포함한 난이도 3 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「$\triangle ABC$」<br>길이←stem:「다음 $\triangle ABC$에서 $BC=」
- goal: 넓이←stem:「$\triangle ABC$의 넓이」
- method: 수선(NAMED)←solution:「내린 수선의 발을 $D$」
- condition: 각←stem:「$\angle B=30^\circ$, $\angle C=105^\circ$」

**how** 수선의 발을 내려 특수각 직각삼각형을 만들고 피타고라스 정리로 변을 구했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 180^\circ - 30^\circ - 105^\circ = 45^\circ$이다. $C$에서 $AB$에 내린 수선의 발을 $D$라 하면 직각삼각형 $BCD$에서 $$ CD = 10\sin 30^\circ = 5,\mathrm{cm}, \qquad BD = 10\cos 30^\circ = 5\sqrt{3},\mathrm{cm} $$ $\triangle ACD$는 $\angle A=45^\circ$인 직각이등변삼각형이므로 $AD=CD=5,\mathrm{cm}$이다. 따라서 $AB = 5 + 5\sqrt{3},\mathrm{cm}$이고 $\triangle ABC$의 넓이는 $$ \dfrac{1}{2}\times (5+5\sqrt{3})\times 5 = \dfrac{25(\sqrt{3}+1)}{2},\mathrm{cm}^2 $$ 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같이 $20,\mathrm{m}$ 떨어진 두 지점 $B$, $C$에서 탑의 꼭대기 $A$ 지점을 올려본 각의 크기가 각각 $60^\circ$, $45^\circ$일 때, 이 탑의 높이 $\overline{AH}$를 구하는 과정이다. (가)~(마)에 들어갈 식이 알맞게 짝지어진 것은?


$\triangle ABH$에서 $\tan 60^\circ = \dfrac{\text{(가)}}{\overline{BH}}$이므로 $\overline{BH} = \text{(나)}$ $\triangle AHC$에서 $\tan 45^\circ = 1$이므로 $\overline{CH} = \text{(다)}$ $\overline{BH}+\overline{CH}=20$이므로 $\overline{AH} = \dfrac{20\sqrt{3}}{\text{(라)}} = \text{(마)}$

**보기** ① (가): $\overline{AB}$  ② (나): $\dfrac{\overline{AH}}{\sqrt{3}}$  ③ (다): $\dfrac{\overline{AH}}{\sqrt{3}}$  ④ (라): $\sqrt{3}-1$  ⑤ (마): $30+10\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 지점 사이 거리 $20\,\mathrm{m}$, 앙각 $60^\circ, 45^\circ$에서 높이 $\overline{AH}$를 구한다.
2. 직각삼각형 $ABH$에서 $\tan 60^\circ = \overline{AH}/\overline{BH}$ 관계식을 세워 연립하면 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $20,\mathrm{m}$ 떨어진 두 지점

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $20,\mathrm{m}$」
**RPM** M3-RPM-063 [삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리]
- 이유: 실생활 측정 문제에서 높이와 거리를 구하는 높이·거리 유형이다. (문항 토큰 20)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각비의 활용 측정 문제에서 두 각을 이용해 높이를 구하는 유형이다. (문항 토큰 20)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 탄젠트 비례식 연립을 통해 높이를 산출하는 난이도 3 문항이다. (문항 토큰 20)

**4칸**
- given: 거리←stem:「다음 그림과 같이 $20,\mathrm{m}$」<br>각←stem:「각각 $60^\circ$, $45^\circ$」
- goal: 삼각비←stem:「알맞게 짝지어진 것은」
- method: 삼각비(NAMED)←solution:「\tan 60^\circ = \dfrac{\overline{AH}}{\overline{BH}}」
- condition: 높이←stem:「높이 $\overline{AH}$」

**how** 두 지점에서의 앙각과 탄젠트 삼각비 관계식으로 높이를 계산했다. (문항 토큰 20)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABH$에서 $\tan 60^\circ = \dfrac{\overline{AH}}{\overline{BH}} = \sqrt{3}$이므로 (가)는 $\overline{AH}$, (나)는 $\dfrac{\overline{AH}}{\sqrt{3}}$이다. $\triangle AHC$에서 $\overline{CH}=\overline{AH}$이므로 (다)는 $\overline{AH}$이다. $\dfrac{\overline{AH}}{\sqrt{3}}+\overline{AH}=20 \implies \overline{AH}=\dfrac{20\sqrt{3}}{\sqrt{3}+1}=30-10\sqrt{3}$이므로 (라)는 $\sqrt{3}+1$, (마)는 $30-10\sqrt{3}$이다. 따라서 옳게 짝지어진 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다음 그림에서 민지가 연을 올려본각의 크기가 $35^\circ$이고 민지의 손에서 연까지의 거리는 $50,\mathrm{m}$이다. 지면에서 민지의 손까지의 높이가 $1.5,\mathrm{m}$일 때, 지면에서 연까지의 높이는 반올림하여 소수점 아래 첫째 자리까지 구하면? (단, $\sin 35^\circ=0.5736$, $\cos 35^\circ=0.8192$, $\tan 35^\circ=0.7002$)

**보기** ① $28.7,\mathrm{m}$  ② $29.2,\mathrm{m}$  ③ $29.7,\mathrm{m}$  ④ $30.0,\mathrm{m}$  ⑤ $30.2,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 민지와 연 사이의 거리가 $50\,\mathrm{m}$, 올려본각이 $35^\circ$, 손까지 높이 $1.5\,\mathrm{m}$이다.
2. 수직 높이: $50\sin 35^\circ = 50 \times 0.5736 = 28.68\,\mathrm{m}$
3. 전체 높이: $28.68 + 1.5 = 30.18\,\mathrm{m}$로 소수 첫째 자리 반올림하면 $30.2\,\mathrm{m}$이다.
4. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 민지가 연을 올려본각의 크기가

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「연까지의 거리는 $50,\mathrm{m」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각]
- 이유: 올려본각(앙각)을 이용한 측정을 다루는 앙각·부각 유형이다. (문항 토큰 35)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 앙각과 사인의 곱에 관찰자 키를 보정하여 전체 높이를 구하는 실생활 활용 유형이다. (문항 토큰 35)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사인 값 곱셈과 눈높이 보정 덧셈을 수행하는 난이도 2 문항이다. (문항 토큰 35)

**4칸**
- given: 거리←stem:「연까지의 거리는 $50,\mathrm{m」<br>각←stem:「$35^\circ$」
- goal: 높이←stem:「연까지의 높이」
- method: 합(NAMED)←solution:「28.68 + 1.5 = 30.18」
- condition: 높이←stem:「손까지의 높이가 $1.5,\mathrm{」

**how** 앙각 삼각비로 수직 높이를 구하고 관찰자의 눈높이를 더해 지면으로부터의 높이를 구했다. (문항 토큰 35)

<details><summary>저장 해설 (판정 검토용)</summary>

손에서 연까지의 높이 차는 $50\sin 35^\circ = 50\times 0.5736 = 28.68,\mathrm{m}$이다. 지면에서 손까지의 높이 $1.5,\mathrm{m}$를 더하면 $28.68 + 1.5 = 30.18,\mathrm{m}$이다. 소수점 아래 첫째 자리까지 반올림하면 $30.2,\mathrm{m}$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ, AB=7, \angle B=38^\circ$)에 대하여 $\overline{AC}$의 길이로 옳은 것을 모두 고르면? (정답 2개)

**보기** ① $7\sin 38^\circ$  ② $7\cos 38^\circ$  ③ $7\tan 38^\circ$  ④ $7\cos 52^\circ$  ⑤ $7\sin 52^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $\overline{AB}=7, \angle B=38^\circ$이다.
2. $\overline{AC} = 7\sin 38^\circ, \overline{BC} = 7\cos 38^\circ$이다.
3. 따라서 옳은 표현은 ①, ④이다.
- 작성자 답: ①, ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 직각삼각형 $ABC$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형 $ABC$」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변]
- 이유: 변의 길이를 삼각비로 표현하는 직각삼각형의 변 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각삼각형의 변의 길이를 삼각비 기호로 올바르게 표현했는지 판정하는 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각비 표현식의 역수 및 곱 관계를 분별하는 난이도 2 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$」<br>길이←stem:「AB=7」
- goal: 길이←stem:「$\overline{AC}$의 길이」
- method: 삼각비(NAMED)←solution:「7\sin 38^\circ」
- condition: 각←stem:「\angle B=38^\circ」

**how** 직각삼각형의 변과 삼각비의 대수적 표현식을 대조하여 옳은 것을 골랐다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 90^\circ - 38^\circ = 52^\circ$이다. $\angle B=38^\circ$를 기준으로 $\overline{AC}=7\sin 38^\circ$이고, $\angle A=52^\circ$를 기준으로 $\overline{AC}=7\cos 52^\circ$이다. 따라서 옳은 것은 ①, ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림의 $\triangle ABC$에서 $\angle A$의 이등분선이 $\overline{BC}$와 만나는 점을 $P$라 하자. $\angle A=120^\circ$, $\overline{AB}=6$, $\overline{AC}=12$일 때, $\overline{AP}$의 길이는?

**보기** ① $4$  ② $3$  ③ $\dfrac{7}{2}$  ④ $\dfrac{9}{2}$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$에서 $\overline{AB}=6, \overline{AC}=12, \angle A=120^\circ$이다.
2. 각의 이등분선 $\overline{AP}$에 의해 $\triangle ABC = \triangle ABP + \triangle APC$이다.
3. 넓이 공식을 이용해 $\overline{AP}$의 길이를 구하면 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 $\triangle ABC$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 삼각비를 활용한 삼각형의 넓이 계산을 다루는 삼각형의 높이·넓이 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각비를 이용한 삼각형 넓이 공식을 활용하여 넓이 또는 미지수를 구하는 고난도 유형이다. (문항 토큰 ABC)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 넓이 공식의 역산과 복합 기하 관계를 처리하는 난이도 4 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「$\triangle ABC$」<br>길이←stem:「$\overline{AB}=6$, $\overline{AC}=12$」
- goal: 길이←stem:「$\overline{AP}$의 길이」
- method: 넓이(NAMED)←solution:「\triangle ABC = \triangle ABP + \triangle APC」
- condition: 각←stem:「$\angle A=120^\circ$」

**how** 두 변과 끼인각의 사인 값을 이용한 삼각형 넓이 공식을 복합 적용했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle BAP=\angle PAC=60^\circ$이고, $\triangle ABC$의 넓이는 $$ \triangle ABC = \dfrac{1}{2}\times 6\times 12\times\sin 60^\circ = 18\sqrt{3} $$ $\overline{AP}=x$라 하면 $\triangle ABC = \triangle ABP + \triangle APC$이므로 $$ \dfrac{1}{2}\times 6\times x\times\sin 60^\circ + \dfrac{1}{2}\times 12\times x\times\sin 60^\circ = 18\sqrt{3} \implies \dfrac{9\sqrt{3}}{2}x = 18\sqrt{3} \implies x = 4 $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같이 $\triangle ABC$가 원 $O$에 내접하고, $\overline{OM}\perp\overline{AB}$, $\overline{ON}\perp\overline{AC}$일 때, 다음 중 옳지 않은 것은?

**보기** ① $\overline{AB}=2\overline{BM}$  ② $\overline{AC}=2\overline{CN}$  ③ $\overline{BC}=2\overline{MN}$  ④ $\overline{AB}=\overline{AC}$  ⑤ $\overline{MN}\parallel\overline{BC}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$가 원 $O$에 내접하고 $\overline{OM} \perp \overline{AB}, \overline{ON} \perp \overline{AC}$이다.
2. 중심에서 현에 내린 수선은 현을 수직이등분하므로 $M, N$은 중점이다.
3. 따라서 옳지 않은 설명은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\triangle ABC$가 원 $O$에

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$에 내접」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 중심에서 현에 내린 수선의 성질을 다루는 중심에서 현에 내린 수선 유형이다. (문항 토큰 ABC)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원의 중심과 현의 수직이등분 성질을 이용해 현의 길이를 구하는 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수직이등분선과 피타고라스 정리를 결합하는 난이도 2 문항이다. (문항 토큰 ABC)

**4칸**
- given: 원←stem:「원 $O$에 내접」<br>수선←stem:「\overline{OM}\perp\overline{AB}」
- goal: 현←stem:「옳지 않은 것은」
- method: 중점(NAMED)←solution:「중점 연결 정리」
- condition: 중점←solution:「각각 $AB$, $AC$의 중점」

**how** 원의 중심에서 현에 내린 수선이 현을 이등분한다는 성질을 적용했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$OM \perp AB$, $ON \perp AC$이므로 $M$, $N$은 각각 $AB$, $AC$의 중점이다. 따라서 삼각형의 중점 연결 정리에 의해 $\overline{MN}\parallel\overline{BC}$, $\overline{BC}=2\overline{MN}$이 성립한다. 그러나 $\overline{OM}=\overline{ON}$이라는 조건이 없으므로 $\overline{AB}=\overline{AC}$가 항상 성립하지는 않는다. 따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점


**발문**

다음 그림에서 원 $O$의 중심에서 두 현까지의 거리가 모두 $3,\mathrm{cm}$이고 아래 현의 절반의 길이가 $6,\mathrm{cm}$일 때, 위 현의 길이 $x$의 값은?

**보기** ① $10,\mathrm{cm}$  ② $12,\mathrm{cm}$  ③ $14,\mathrm{cm}$  ④ $15,\mathrm{cm}$  ⑤ $16,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원 $O$의 중심에서 두 현까지의 거리가 모두 $3\,\mathrm{cm}$로 같다.
2. 절반의 길이가 $6\,\mathrm{cm}$이므로 전체 현의 길이 $x = 12\,\mathrm{cm}$이다. (선지 10, 14, 15와 비교)
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $O$의 중심에서 두 현까지의 거리가

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 중심에서 현까지의 거리와 현 길이의 관계를 다루는 중심거리와 현의 길이 유형이다. (문항 토큰 cm)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 중심거리와 현의 길이 사이의 일치 관계를 이용한 기하 계산 유형이다. (문항 토큰 cm)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초 등거리 현의 성질을 직접 적용하는 난이도 1 문항이다. (문항 토큰 cm)

**4칸**
- given: 원←stem:「원 $O$」<br>거리←stem:「현까지의 거리가 모두 $3,\mathrm」
- goal: 현←stem:「현의 길이 $x$」
- method: 현(NAMED)←solution:「두 현의 길이는 같으므로」
- condition: 현←stem:「에서 두 현까지의 거리가 모두 $3,\」

**how** 원의 중심으로부터 같은 거리에 있는 두 현의 길이가 같다는 성질을 적용했다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

중심에서 현에 내린 수선은 현을 이등분하므로 아래 현의 길이는 $6+6=12,\mathrm{cm}$이다. 한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 $x=12,\mathrm{cm}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

다음 그림에서 점 $O$를 중심으로 하는 두 원에서 작은 원의 접선이 큰 원과 만나는 두 점을 각각 $A$, $B$라 하자. 두 원의 넓이의 차가 $49\pi,\mathrm{cm}^2$일 때, $\overline{AB}$의 길이는?

**보기** ① $12,\mathrm{cm}$  ② $13,\mathrm{cm}$  ③ $14,\mathrm{cm}$  ④ $15,\mathrm{cm}$  ⑤ $16,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 동심원의 넓이의 차가 $49\pi\,\mathrm{cm}^2$이므로 $R^2 - r^2 = 49$이다.
2. 현 $\overline{AB}$의 절반 길이는 $\sqrt{R^2 - r^2} = \sqrt{49} = 7$이다.
3. 따라서 $\overline{AB} = 2 \times 7 = 14\,\mathrm{cm}$이다. (정답 ③)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 점 $O$를 중심으로 하는 두 원에서

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 점 $O$를 중심으로」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 중심과 현의 수선 기하를 다루는 중심에서 현에 내린 수선 유형이다. (문항 토큰 49)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 동심원 기하 모델에서 현의 길이와 두 원의 반지름 관계를 구하는 유형이다. (문항 토큰 49)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동심원의 두 반지름과 현의 반쪽으로 피타고라스 정리를 세우는 난이도 3 문항이다. (문항 토큰 49)

**4칸**
- given: 원←stem:「다음 그림에서 점 $O$를 중심으로」<br>접선←stem:「작은 원의 접선」
- goal: 길이←stem:「$\overline{AB}$의 길이」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $OMA$」
- condition: 넓이←stem:「두 원의 넓이의 차가 $49\pi,\ma」

**how** 동심원에서 큰 원의 현과 작은 원의 접선 관계에 피타고라스 정리를 적용했다. (문항 토큰 49)

<details><summary>저장 해설 (판정 검토용)</summary>

큰 원과 작은 원의 반지름을 각각 $R$, $r$이라 하면 $\pi R^2 - \pi r^2 = 49\pi$, 즉 $R^2 - r^2 = 49$이다. 접점 $M$에 대하여 $OM \perp AB$이므로 직각삼각형 $OMA$에서 $AM^2 = R^2 - r^2 = 49$, $AM = 7,\mathrm{cm}$이다. 따라서 $AB = 2AM = 14,\mathrm{cm}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 그림에서 직선 $PA$는 원 $O$의 접선이고 점 $A$는 접점이다. $\overline{PA}=8\sqrt{3},\mathrm{cm}$, $\overline{PB}=8,\mathrm{cm}$이고 세 점 $P$, $B$, $O$가 한 직선 위에 있을 때, $\overline{BO}$의 길이는?

**보기** ① $4,\mathrm{cm}$  ② $5,\mathrm{cm}$  ③ $6,\mathrm{cm}$  ④ $7,\mathrm{cm}$  ⑤ $8,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직선 $PA$는 원 $O$의 접선이고 $\overline{PA}=8\sqrt{3}\,\mathrm{cm}, \overline{PB}=8\,\mathrm{cm}$이다.
2. $\overline{OA} = r, \overline{PO} = 8 + r$에서 직각삼각형 $PAO$ 피타고라스 정리로 $\overline{BO} = r$을 구하면 ⑤이다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 직선 $PA$는 원 $O$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「원 $O$의 접선」
**RPM** M3-RPM-070 [원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선]
- 이유: 접점과 반지름의 직교성을 다루는 접점의 반지름과 접선 유형이다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE
- 이유: 원의 접선과 접점의 반지름이 이루는 직각 성질을 이용한 각 계산 유형이다. (문항 토큰 PA)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 직각 성질과 삼각형 내각 합을 결합하는 난이도 2 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「원 $O$의 접선」<br>길이←stem:「O}$의 길이는?」
- goal: 길이←stem:「$\overline{BO}$의 길이」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $PAO$」
- condition: 접점←stem:「점 $A$는 접점」

**how** 접점에서의 반지름과 접선이 수직임을 이용해 직각삼각형 각을 구했다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

$BO=AO=r,\mathrm{cm}$라 하면 $PO = 8+r$이다. 접점 $A$에서 $OA \perp PA$이므로 직각삼각형 $PAO$에서 $$ (8+r)^2 = (8\sqrt{3})^2 + r^2 \implies 64+16r+r^2 = 192+r^2 \implies 16r = 128 \implies r = 8 $$ 따라서 $BO=8,\mathrm{cm}$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 원 $O$는 사각형 $ABHD$의 네 변과 접한다. 직사각형 $ABCD$에서 $\overline{AB}=10,\mathrm{cm}$, $\overline{BC}=16,\mathrm{cm}$일 때, $\triangle CDH$의 둘레의 길이는?

**보기** ① $32,\mathrm{cm}$  ② $30,\mathrm{cm}$  ③ $34,\mathrm{cm}$  ④ $36,\mathrm{cm}$  ⑤ $38,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직사각형 $ABCD$에서 $\overline{AB}=10\,\mathrm{cm}, \overline{BC}=16\,\mathrm{cm}$이고 원 $O$는 사각형 $ABHD$의 네 변에 접한다.
2. 접선 길이의 성질을 이용하여 $\triangle CDH$의 둘레의 길이를 구하면 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $O$는 사각형 $ABHD$의 네 변과

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「직사각형 $ABCD$」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 접선 길이 조건을 이용해 다각형 변을 구하는 접선 조건으로 길이 구하기 유형이다. (문항 토큰 ABHD)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH
- 이유: 외접사각형의 대변의 합 성질과 외부점 접선 길이 성질을 이용한 고난도 길이 계산 유형이다. (문항 토큰 ABHD)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외접사각형과 사다리꼴 복합 기하에서 길이를 연립하는 난이도 4 문항이다. (문항 토큰 ABHD)

**4칸**
- given: 사각형←stem:「직사각형 $ABCD$」<br>길이←stem:「둘레의 길이는?」
- goal: 길이←stem:「$\triangle CDH$의 둘레의 길이」
- method: 접점(NAMED)←solution:「접점을 각각 $E$, $F$, $G$, $I$」
- condition: 외접←stem:「네 변과 접한다」

**how** 원에 외접하는 사각형의 대변의 합 등식과 접선 길이 성질을 복합 활용했다. (문항 토큰 ABHD)

<details><summary>저장 해설 (판정 검토용)</summary>

원의 지름이 $AB=10,\mathrm{cm}$이므로 반지름은 $5,\mathrm{cm}$이다. $AD$, $AB$, $BC$, $DH$와 원 $O$의 접점을 각각 $E$, $F$, $G$, $I$라 하면 $AF=AE=5$, $BF=BG=5$이다. $DE = 16-5 = 11$이므로 $DI=11$이고, $GH=HI=x$라 하면 $DH=11+x$, $HC=16-(5+x)=11-x$이다. 따라서 $\triangle CDH$의 둘레의 길이는 $10 + (11+x) + (11-x) = 32,\mathrm{cm}$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림은 원 $O$의 원주 위의 한 점이 원의 중심 $O$에 겹쳐지도록 현 $AB$를 접는 선으로 하여 접은 것이다. 원 위의 한 점 $P$에 대하여 $\overline{AP}=6$, $\overline{BP}=5$일 때, $\triangle PAB$의 넓이는?

**보기** ① $15$  ② $\dfrac{15\sqrt{2}}{2}$  ③ $\dfrac{15\sqrt{3}}{2}$  ④ $15\sqrt{3}$  ⑤ $30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원 $O$에서 $\overline{AP}=6, \overline{BP}=5$이고 호 $AB$에 대한 원주각을 활용한다.
2. $\triangle PAB$의 넓이를 구하면 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림은 원 $O$의 원주 위의 한 점이 원의 중심

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_INSCRIBED_ANGLE → M3-06-CIRCLE_LINE**
- 근거 인용: 「원 $O$」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 중심과 현의 수직이등분 기하를 응용하는 중심에서 현에 내린 수선 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원 접기 대칭 모델에서 중심거리 $R/2$와 피타고라스 정리로 현 길이를 구하는 고난도 유형이다. (문항 토큰 AB)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접기 대칭 조건에서 중심거리를 파악해야 하는 난이도 4 문항이다. (문항 토큰 AB)

**4칸**
- given: 원←stem:「원 $O$」<br>길이←stem:「$\overline{AP}=6$, $\overline{BP}=5$」
- goal: 넓이←stem:「$\triangle PAB$의 넓이」
- method: 원주각(NAMED)←solution:「원주각은 중심각의 절반」
- condition: 현←stem:「현 $AB$」

**how** 원을 접었을 때 수선의 길이가 반지름의 절반이 됨을 이용해 현의 길이를 구했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

중심 $O$에 겹쳐지는 점을 $Q$라 하면 $\triangle AOQ$, $\triangle BOQ$는 정삼각형이므로 $\angle AOB=120^\circ$이다. 원주각은 중심각의 절반이므로 $\angle APB=60^\circ$이다. 따라서 $\triangle PAB$의 넓이는 $\dfrac{1}{2}\times 6\times 5\times\sin 60^\circ = \dfrac{15\sqrt{3}}{2}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음 그림에서 $\triangle ABC$는 $\angle C=90^\circ$, $\overline{BC}=8,\mathrm{cm}$, $\overline{AC}=6,\mathrm{cm}$인 직각삼각형이고 원 $O$는 $\triangle ABC$의 내접원이다. 원 $O$의 반지름의 길이는?

**보기** ① $1,\mathrm{cm}$  ② $2,\mathrm{cm}$  ③ $\dfrac{5}{2},\mathrm{cm}$  ④ $3,\mathrm{cm}$  ⑤ $\dfrac{7}{2},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$는 $\angle C=90^\circ$인 직각삼각형이고 $\overline{BC}=8\,\mathrm{cm}, \overline{AC}=6\,\mathrm{cm}$이다.
2. 빗변 $\overline{AB} = 10\,\mathrm{cm}$이고 내접원의 반지름 $r = (6+8-10)/2 = 2\,\mathrm{cm}$이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\triangle ABC$는 $\angle C=90^\circ$

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「직각삼각형이고」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 접선 길이와 내접원 기하를 다루는 한 점에서 그은 두 접선 유형이다. (문항 토큰 ABC)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE
- 이유: 직각삼각형의 내접원 반지름과 접선의 성질을 이용한 기하 계산 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 세 변과 내접원 반지름 공식을 적용하는 난이도 2 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「직각삼각형이고」<br>길이←stem:「반지름의 길이는?」
- goal: 반지름←stem:「반지름의 길이」
- method: 넓이(NAMED)←solution:「$\triangle ABC$의 넓이는」
- condition: 각←stem:「$\angle C=90^\circ$」

**how** 직각삼각형의 내접원 접선 성질과 넓이 관계식을 이용해 내접원 반지름을 구했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$AB = \sqrt{6^2+8^2} = 10,\mathrm{cm}$이고, $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 6\times 8 = 24,\mathrm{cm}^2$이다. 내접원의 반지름을 $r,\mathrm{cm}$라 하면 $\dfrac{1}{2}r(6+8+10) = 24 \implies 12r = 24 \implies r = 2,\mathrm{cm}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점


**발문**

[서술형 1] 다음 그림과 같이 한 변의 길이가 $12,\mathrm{cm}$인 정사각형 $ABCD$에서 $\overline{CD}$ 위의 한 점 $E$에 대하여 $\overline{BE}$를 한 변으로 하는 정사각형 $BEFG$를 그렸더니 $\angle ABE=60^\circ$가 되었다. 두 정사각형이 겹치는 색칠한 부분의 넓이를 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(192-56\sqrt{3}),\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 한 변의 길이가 $12\,\mathrm{cm}$인 정사각형 $ABCD$에서 $\angle ABE=60^\circ$이다.
2. 각 부분의 넓이를 삼각비로 구하여 색칠한 부분의 넓이를 계산하면 $(192-56\sqrt{3})\,\mathrm{cm}^2$이다.
- 작성자 답: $(192-56\sqrt{3}),\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 1] 다음 그림과 같이 한 변의 길이가

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 $ABCD$」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이]
- 이유: 다각형의 넓이 계산에 삼각비를 활용하는 다각형의 길이·넓이 유형이다. (문항 토큰 12)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 다각형 내부에서 삼각비로 분할 넓이를 구하고 음영 부분 넓이를 완성하는 서술형 고난도 유형이다. (문항 토큰 12)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 복합 도형 분할과 특수각 삼각비 연산을 종합 서술하는 난이도 4 문항이다. (문항 토큰 12)

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$」<br>각←stem:「$\angle ABE=60^\circ$」
- goal: 넓이←stem:「색칠한 부분의 넓이」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $BCE$」
- condition: 길이←stem:「한 변의 길이가 $12,\mathrm{c」

**how** 도형을 분할하여 특수각 삼각비로 각 부분의 넓이를 계산하고 차를 구했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle EBC = 90^\circ - 60^\circ = 30^\circ$이므로 직각삼각형 $BCE$에서 $CE = 12\tan 30^\circ = 4\sqrt{3},\mathrm{cm}$이고, $DE = 12 - 4\sqrt{3},\mathrm{cm}$이다. $EF$와 $AD$의 교점을 $H$라 하면 $\angle DEH = 30^\circ$이므로 직각삼각형 $DHE$에서 $HD = \dfrac{12-4\sqrt{3}}{\sqrt{3}} = 4\sqrt{3}-4,\mathrm{cm}$이다. $\triangle BCE = \dfrac{1}{2}\times 12\times 4\sqrt{3} = 24\sqrt{3}$, $\triangle EHD = \dfrac{1}{2}(12-4\sqrt{3})(4\sqrt{3}-4) = 32\sqrt{3}-48$이다. 따라서 색칠한 부분의 넓이는 $12^2 - 24\sqrt{3} - (32\sqrt{3}-48) = (192-56\sqrt{3}),\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

[서술형 2] 다음 그림과 같이 $16,\mathrm{m}$ 떨어진 두 지점 $B$와 $D$에서 건물의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $30^\circ$, $45^\circ$이다. 이 건물의 높이 $\overline{AC}$를 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8(\sqrt{3}+1),\mathrm{m}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $16\,\mathrm{m}$ 떨어진 두 지점에서 올려본각 $30^\circ, 45^\circ$를 이용해 건물의 높이를 구한다.
2. 탄젠트 방정식을 풀면 높이는 $8(\sqrt{3}+1)\,\mathrm{m}$이다.
- 작성자 답: $8(\sqrt{3}+1),\mathrm{m}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 2] 다음 그림과 같이 $16,\mathrm{m}$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 다음 그림과 같이 $16,\ma」
**RPM** M3-RPM-063 [삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리]
- 이유: 거리와 앙각으로부터 높이를 구하는 높이·거리 유형이다. (문항 토큰 16)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 측정 문제에서 삼각비의 활용으로 높이 방정식을 세우고 서술형으로 풀이하는 유형이다. (문항 토큰 16)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 탄젠트 덧셈/연립 방정식과 분모 유리화를 서술하는 난이도 3 문항이다. (문항 토큰 16)

**4칸**
- given: 거리←stem:「[서술형 2] 다음 그림과 같이 $16,\ma」<br>각←stem:「각각 $30^\circ$, $45^\circ$」
- goal: 높이←stem:「건물의 높이 $\overline{AC}$」
- method: 삼각비(NAMED)←solution:「\tan 30^\circ」
- condition: 높이←stem:「높이 $\overline{AC}$」

**how** 두 지점에서의 앙각을 이용해 탄젠트 분수 방정식을 세우고 유리화하여 높이를 도출했다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

건물의 높이를 $AC=x,\mathrm{m}$라 하면 $\triangle ADC$에서 $\tan 45^\circ = \dfrac{x}{DC} = 1$이므로 $DC=x$이다. $BC = 16+x$이므로 $\triangle ABC$에서 $\tan 30^\circ = \dfrac{x}{16+x} = \dfrac{1}{\sqrt{3}}$이다. $(\sqrt{3}-1)x = 16 \implies x = \dfrac{16}{\sqrt{3}-1} = 8(\sqrt{3}+1),\mathrm{m}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

[서술형 3] 다음 그림의 원 $O$에서 $\overline{OL}=\overline{OM}=\overline{ON}$이고 $\overline{AB}=8,\mathrm{cm}$일 때, $\triangle ABC$의 넓이를 구하는 과정과 답을 쓰시오. (단, $L, M, N$은 중심 $O$에서 세 변에 내린 수선의 발이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $16\sqrt{3},\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원 $O$에서 $\overline{AB}=8\,\mathrm{cm}$이고 세 현의 길이가 같아 정삼각형을 이룬다.
2. 피타고라스 정리와 삼각비로 계산하면 넓이는 $16\sqrt{3}\,\mathrm{cm}^2$이다.
- 작성자 답: $16\sqrt{3},\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 3] 다음 그림의 원 $O$에서

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 현의 수선 성질을 이용한 기하 계산을 다루는 중심에서 현에 내린 수선 유형이다. (문항 토큰 OL)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원의 현과 중심 사이의 수선 성질을 이용해 삼각형의 넓이를 구하는 서술형 유형이다. (문항 토큰 OL)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 현의 길이 계산과 삼각형 넓이 도출 과정을 서술하는 난이도 2 문항이다. (문항 토큰 OL)

**4칸**
- given: 원←stem:「원 $O$」<br>길이←stem:「[서술형 3] 다음 그림의 원 $O$에서 $\」
- goal: 넓이←stem:「$\triangle ABC$의 넓이」
- method: 현(NAMED)←solution:「세 현의 길이는 같아」
- condition: 수선←stem:「내린 수선의 발」

**how** 중심에서 현에 내린 수선과 반지름으로 직각삼각형을 구성하여 넓이를 서술했다. (문항 토큰 OL)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{OL}=\overline{OM}=\overline{ON}$이므로 중심에서 같은 거리에 있는 세 현의 길이는 같아 $AB=BC=CA=8,\mathrm{cm}$인 정삼각형이다. 정삼각형의 높이는 $h = \sqrt{8^2 - 4^2} = 4\sqrt{3},\mathrm{cm}$이므로 $$ \triangle ABC = \dfrac{1}{2}\times 8\times 4\sqrt{3} = 16\sqrt{3},\mathrm{cm}^2 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점


**발문**

[서술형 4] 다음 그림에서 $\overrightarrow{AD}$, $\overrightarrow{AE}$, $\overline{BC}$는 원 $O$의 접선이고 세 점 $D$, $E$, $F$는 접점이다. $\overline{AE}=14,\mathrm{cm}$일 때, $\triangle ABC$의 둘레의 길이를 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $28,\mathrm{cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{AE}=14\,\mathrm{cm}$이고 원 $O$의 두 접선의 길이는 같다.
2. 접선 길이 치환에 의해 $\triangle ABC$의 둘레의 길이는 $2 \times 14 = 28\,\mathrm{cm}$이다.
- 작성자 답: $28,\mathrm{cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 4] 다음 그림에서

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「원 $O$의 접선」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 한 점에서 그은 두 접선의 길이 성질을 다루는 한 점에서 그은 두 접선 유형이다. (문항 토큰 AD)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH
- 이유: 원의 외부점 접선 길이의 일치 성질을 활용해 삼각형의 둘레를 구하는 서술형 유형이다. (문항 토큰 AD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 길이 치환 과정을 논리적으로 서술하는 난이도 2 문항이다. (문항 토큰 AD)

**4칸**
- given: 접선←stem:「원 $O$의 접선」<br>길이←stem:「둘레의 길이를 구하는 과정과 답을 쓰시」
- goal: 길이←stem:「$\triangle ABC$의 둘레의 길이」
- method: 접선(NAMED)←solution:「두 접선의 길이는 같으므로」
- condition: 접점←stem:「세 점 $D$, $E$, $F$는 접점」

**how** 외부점에서 그은 두 접선 길이가 같다는 성질을 변의 치환에 적용해 둘레를 구했다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점에서 원에 그은 두 접선의 길이는 같으므로 $AD=AE=14,\mathrm{cm}$, $BD=BF$, $CE=CF$이다. 따라서 $\triangle ABC$의 둘레의 길이는 $$ AB+BC+CA = (AB+BF)+(CF+AC) = (AB+BD)+(CE+AC) = AD+AE = 14+14 = 28,\mathrm{cm} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
