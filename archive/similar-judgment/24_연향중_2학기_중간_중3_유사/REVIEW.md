# 검수 묶음 — 24_연향중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 6)**
- 문항 23개 / 검사 PASS 17, FAIL 6, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 19, NONE 4
- 난이도 분포: 1단계 2, 2단계 11, 3단계 9, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER
- **Q2**: 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 검사 코드: CHOICE_ORDER / 풀이 과정에 정답 값이 등장하지 않음
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q10**: 검사 코드: CHOICE_ORDER
- **Q12**: 검사 코드: CHOICE_ORDER
- **Q13**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $\overline{AC}=13$, $\overline{BC}=5$일 때, $\cos C$의 값은?

**보기** ① $\dfrac{12}{13}$  ② $\dfrac{5}{12}$  ③ $\dfrac{5}{13}$  ④ $\dfrac{13}{5}$  ⑤ $\dfrac{12}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle B=90^\circ$이므로 빗변은 $\overline{AC}=13$이고, 각 $C$에 이웃한 변은 $\overline{BC}=5$이다.
2. 따라서 $\cos C = \dfrac{\overline{BC}}{\overline{AC}} = \dfrac{5}{13}$이므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $\overline{AC}=13$, $\overline{BC}=5$일 때, $\cos C$의 값은

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $\overline{AC}=13$, $\overline{BC}=5$일 때, $\cos C$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q1번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q1번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $\overline{AC}=13$, $\overline{BC}=5$일 때, $\cos C$의 값은?」
- goal: 직각삼각형←stem:「다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $\overline{AC}=13$, $\overline{BC}=5$일 때, $\cos C$의 값은?」
- method: 빗변(NAMED)←solution:「$\angle B=90^\circ$이므로 빗변은 $\overline{AC}=13$이고, 각 $C$에 이웃한 변은 $\overline{BC}=5$이다.」
- condition: (없음)

**how** Q1번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle B=90^\circ$이므로 빗변은 $\overline{AC}=13$이고, 각 $C$에 이웃한 변은 $\overline{BC}=5$이다. 따라서 $\cos C = \dfrac{\overline{BC}}{\overline{AC}} = \dfrac{5}{13}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 옳은 것은?

**보기** ① $\sin 60^\circ \times \cos 30^\circ = \dfrac{3}{4}$  ② $\cos 30^\circ \times \tan 60^\circ = \dfrac{1}{2}$  ③ $\sin 30^\circ + \cos 60^\circ = \dfrac{1}{2}$  ④ $\tan 45^\circ \div \sin 45^\circ = \dfrac{\sqrt{2}}{2}$  ⑤ $\tan 60^\circ - \cos 45^\circ = \dfrac{2\sqrt{3}-3\sqrt{2}}{6}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 특수각의 삼각비 값을 각각 대입하면 (문항 토큰 60)
2. * ① $\dfrac{\sqrt{3}}{2}\times\dfrac{\sqrt{3}}{2} = \dfrac{3}{4}$(참) * ②$\dfrac{\sqrt{3}}{2}\times\sqrt{3} = \dfrac{3}{2}$
3. * ③ $\dfrac{1}{2}+\dfrac{1}{2} = 1$
4. * ④ $1\div\dfrac{\sqrt{2}}{2} = \sqrt{2}$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 옳은 것은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q2번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 60)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q2번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 60)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 60)

**4칸**
- given: tan←choices:「$\cos 30^\circ \times \tan 60^\circ = \dfrac{1}{2}$」
- goal: 대입←solution:「특수각의 삼각비 값을 각각 대입하면」
- method: 삼각비(NAMED)←solution:「특수각의 삼각비 값을 각각 대입하면」
- condition: (없음)

**how** Q2번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 60)

<details><summary>저장 해설 (판정 검토용)</summary>

특수각의 삼각비 값을 각각 대입하면


* ① $\dfrac{\sqrt{3}}{2}\times\dfrac{\sqrt{3}}{2} = \dfrac{3}{4}$(참) * ②$\dfrac{\sqrt{3}}{2}\times\sqrt{3} = \dfrac{3}{2}$
* ③ $\dfrac{1}{2}+\dfrac{1}{2} = 1$
* ④ $1\div\dfrac{\sqrt{2}}{2} = \sqrt{2}$
* ⑤ $\sqrt{3}-\dfrac{\sqrt{2}}{2} = \dfrac{2\sqrt{3}-\sqrt{2}}{2}$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

아래 그림과 같이 좌표평면 위의 원점 $O$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $38^\circ$에 해당하는 원 위의 점의 좌표가 $(0.79, 0.62)$일 때, 다음 중 옳은 것은?

**보기** ① $\sin 38^\circ \approx 0.79$  ② $\tan 38^\circ \approx 0.78$  ③ $\cos 38^\circ \approx 0.62$  ④ $\sin 52^\circ \approx 0.62$  ⑤ $\cos 52^\circ \approx 0.79$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름이 $1$인 사분원에서 $38^\circ$에 해당하는 점의 좌표가 $(0.79, 0.62)$이므로 $$ \cos 38^\circ \approx 0.79, \qquad \sin 38^\circ \approx 0.62 $$ 또 $\sin 52^\circ = \cos 38^\circ \approx 0.79$, $\cos 52^\circ = \sin 38^\circ \approx 0.62$이다.
2. $\tan 38^\circ = \dfrac{\sin 38^\circ}{\cos 38^\circ} \approx \dfrac{0.62}{0.79} \approx 0.78$이므로 옳은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림과 같이 좌표평면 위의 원점 $O$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $38^\circ$에 해당하는 원 위의 점의 좌표가 $(0

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「아래 그림과 같이 좌표평면 위의 원점 $O$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $38^\circ$에 해당하는 원 위의 점의 좌표가 $(0.79, 0.62)$일 때, 다음 중 옳은 것은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q3번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 38)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q3번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 38)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 38)

**4칸**
- given: 평면←stem:「아래 그림과 같이 좌표평면 위의 원점 $O$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $38^\circ$에 해당하는 원 위의 점의 좌표가 $(0.79, 0.62)$일 때, 다음 중 옳은 것은?」
- goal: 좌표←stem:「아래 그림과 같이 좌표평면 위의 원점 $O$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $38^\circ$에 해당하는 원 위의 점의 좌표가 $(0.79, 0.62)$일 때, 다음 중 옳은 것은?」
- method: 반지름(NAMED)←solution:「반지름이 $1$인 사분원에서 $38^\circ$에 해당하는 점의 좌표가 $(0.79, 0.62)$이므로 $$ \cos 38^\circ \approx 0.79, \qquad \sin 38^\circ \approx 0.62 $$ 또 $\sin 52^\circ = \cos 38^\circ \approx 0.79$, $\cos 52^\circ = \sin 38^\circ \approx 0.62$이다.」
- condition: (없음)

**how** Q3번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 38)

<details><summary>저장 해설 (판정 검토용)</summary>

반지름이 $1$인 사분원에서 $38^\circ$에 해당하는 점의 좌표가 $(0.79, 0.62)$이므로 $$ \cos 38^\circ \approx 0.79, \qquad \sin 38^\circ \approx 0.62 $$ 또 $\sin 52^\circ = \cos 38^\circ \approx 0.79$, $\cos 52^\circ = \sin 38^\circ \approx 0.62$이다. $\tan 38^\circ = \dfrac{\sin 38^\circ}{\cos 38^\circ} \approx \dfrac{0.62}{0.79} \approx 0.78$이므로 옳은 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점


**발문**

다음 그림과 같이 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=7,\mathrm{cm}$, $\angle B=120^\circ$인 $\triangle ABC$의 넓이는?

**보기** ① $7\sqrt{3},\mathrm{cm}^2$  ② $\dfrac{21\sqrt{3}}{2},\mathrm{cm}^2$  ③ $12\sqrt{3},\mathrm{cm}^2$  ④ $\dfrac{25\sqrt{3}}{2},\mathrm{cm}^2$  ⑤ $14\sqrt{3},\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle B=120^\circ$이므로 둔각의 외각은 $180^\circ-120^\circ=60^\circ$이다.
2. 높이 $h = 8\sin 60^\circ = 8\times\dfrac{\sqrt{3}}{2} = 4\sqrt{3},\mathrm{cm}$이므로 $$ \triangle ABC = \dfrac{1}{2}\times 7\times 4\sqrt{3} = 14\sqrt{3},\mathrm{cm}^2 $$ 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=7,\mathrm{cm}$, $\angle B=120^\circ$인 $\triangle ABC$의 넓이는

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=7,\mathrm{cm}$, $\angle B=120^\circ$인 $\triangle ABC$의 넓이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q4번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q4번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 넓이←stem:「다음 그림과 같이 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=7,\mathrm{cm}$, $\angle B=120^\circ$인 $\triangle ABC$의 넓이는?」
- goal: 둔각←solution:「$\angle B=120^\circ$이므로 둔각의 외각은 $180^\circ-120^\circ=60^\circ$이다.」
- method: 외각(NAMED)←solution:「$\angle B=120^\circ$이므로 둔각의 외각은 $180^\circ-120^\circ=60^\circ$이다.」
- condition: (없음)

**how** Q4번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle B=120^\circ$이므로 둔각의 외각은 $180^\circ-120^\circ=60^\circ$이다. 높이 $h = 8\sin 60^\circ = 8\times\dfrac{\sqrt{3}}{2} = 4\sqrt{3},\mathrm{cm}$이므로 $$ \triangle ABC = \dfrac{1}{2}\times 7\times 4\sqrt{3} = 14\sqrt{3},\mathrm{cm}^2 $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{3}{4}$일 때, $\tan A$의 값은? (단, $0^\circ < \angle A < 90^\circ$)

**보기** ① $\dfrac{\sqrt{7}}{4}$  ② $\dfrac{3\sqrt{7}}{7}$  ③ $\dfrac{\sqrt{7}}{3}$  ④ $\dfrac{4\sqrt{7}}{7}$  ⑤ $\dfrac{3}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 90)
2. 주어진 조건을 계산하여 정답 ②을(를) 도출한다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{3}{4}$일 때, $\tan A$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q5번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q5번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{3}{4}$일 때, $\tan A$의 값은?」
- goal: 직각삼각형←stem:「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{3}{4}$일 때, $\tan A$의 값은?」
- method: tan(NAMED)←solution:「$\sin A = \dfrac{BC}{AC} = \dfrac{3}{4}$이므로 $BC=3k$, $AC=4k$($k>0$)로 두면 $$ AB = \sqrt{(4k)^2 - (3k)^2} = \sqrt{7}k $$ 따라서 $\tan A = \dfrac{BC}{AB} = \dfrac{3k}{\sqrt{7}k} = \dfrac{3\sqrt{7}}{7}$이므로 정답은 ②이다.」
- condition: (없음)

**how** Q5번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin A = \dfrac{BC}{AC} = \dfrac{3}{4}$이므로 $BC=3k$, $AC=4k$($k>0$)로 두면 $$ AB = \sqrt{(4k)^2 - (3k)^2} = \sqrt{7}k $$ 따라서 $\tan A = \dfrac{BC}{AB} = \dfrac{3k}{\sqrt{7}k} = \dfrac{3\sqrt{7}}{7}$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 $\angle BAC=90^\circ$, $AD \perp BC$인 직각삼각형 $ABC$에서 $\overline{AB}=6$, $\overline{AC}=2\sqrt{3}$이고 $\angle DAC=x$라 할 때, $\tan x$의 값은?

**보기** ① $\sqrt{3}$  ② $\dfrac{1}{2}$  ③ $\dfrac{\sqrt{3}}{2}$  ④ $\dfrac{\sqrt{3}}{3}$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ADC \sim \triangle BAC$이므로 $\angle DAC = \angle B = x$이다.
2. 따라서 $\triangle ABC$에서 $$ \tan x = \tan B = \dfrac{\overline{AC}}{\overline{AB}} = \dfrac{2\sqrt{3}}{6} = \dfrac{\sqrt{3}}{3} $$ 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle BAC=90^\circ$, $AD \perp BC$인 직각삼각형 $ABC$에서 $\overline{AB}=6$, $\overline{AC}=2\sqrt{3}$이고 $\angle DAC=x$라 할 때, $\tan x$의 값은

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle BAC=90^\circ$, $AD \perp BC$인 직각삼각형 $ABC$에서 $\overline{AB}=6$, $\overline{AC}=2\sqrt{3}$이고 $\angle DAC=x$라 할 때, $\tan x$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q6번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 BAC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q6번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 BAC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 BAC)

**4칸**
- given: 삼각형←stem:「다음 그림과 같이 $\angle BAC=90^\circ$, $AD \perp BC$인 직각삼각형 $ABC$에서 $\overline{AB}=6$, $\overline{AC}=2\sqrt{3}$이고 $\angle DAC=x$라 할 때, $\tan x$의 값은?」
- goal: 직각삼각형←stem:「다음 그림과 같이 $\angle BAC=90^\circ$, $AD \perp BC$인 직각삼각형 $ABC$에서 $\overline{AB}=6$, $\overline{AC}=2\sqrt{3}$이고 $\angle DAC=x$라 할 때, $\tan x$의 값은?」
- method: tan(NAMED)←solution:「따라서 $\triangle ABC$에서 $$ \tan x = \tan B = \dfrac{\overline{AC}}{\overline{AB}} = \dfrac{2\sqrt{3}}{6} = \dfrac{\sqrt{3}}{3} $$ 정답은 ④이다.」
- condition: (없음)

**how** Q6번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 BAC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ADC \sim \triangle BAC$이므로 $\angle DAC = \angle B = x$이다. 따라서 $\triangle ABC$에서 $$ \tan x = \tan B = \dfrac{\overline{AC}}{\overline{AB}} = \dfrac{2\sqrt{3}}{6} = \dfrac{\sqrt{3}}{3} $$ 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$인 직각삼각형 $ABC$에서 $\cos A + \tan B \times \sin C$의 값은?

**보기** ① $\dfrac{3\sqrt{3}}{2}$  ② $\sqrt{3}$  ③ $\dfrac{\sqrt{3}}{2}$  ④ $2\sqrt{3}$  ⑤ $\dfrac{1+2\sqrt{3}}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a + 2a + 3a = 180^\circ$에서 $a=30^\circ$이므로 $\angle A=30^\circ$, $\angle B=60^\circ$, $\angle C=90^\circ$이다.
2. $$ \cos A + \tan B \times \sin C = \cos 30^\circ + \tan 60^\circ \times \sin 90^\circ = \dfrac{\sqrt{3}}{2} + \sqrt{3}\times 1 = \dfrac{3\sqrt{3}}{2} $$ 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$인 직각삼각형 $ABC$에서 $\cos A + \tan B \times \sin C$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q7번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q7번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$인 직각삼각형 $ABC$에서 $\cos A + \tan B \times \sin C$의 값은?」
- goal: 직각삼각형←stem:「세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$인 직각삼각형 $ABC$에서 $\cos A + \tan B \times \sin C$의 값은?」
- method: tan(NAMED)←solution:「$$ \cos A + \tan B \times \sin C = \cos 30^\circ + \tan 60^\circ \times \sin 90^\circ = \dfrac{\sqrt{3}}{2} + \sqrt{3}\times 1 = \dfrac{3\sqrt{3}}{2} $$ 따라서 정답은 ①이다.」
- condition: (없음)

**how** Q7번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$a + 2a + 3a = 180^\circ$에서 $a=30^\circ$이므로 $\angle A=30^\circ$, $\angle B=60^\circ$, $\angle C=90^\circ$이다. $$ \cos A + \tan B \times \sin C = \cos 30^\circ + \tan 60^\circ \times \sin 90^\circ = \dfrac{\sqrt{3}}{2} + \sqrt{3}\times 1 = \dfrac{3\sqrt{3}}{2} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림의 $\triangle ABC$에서 $\overline{BC}=16$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\overline{AC}$의 길이는?

**보기** ① $4\sqrt{2}$  ② $6\sqrt{2}$  ③ $8\sqrt{2}$  ④ $12\sqrt{2}$  ⑤ $16\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle A = 180^\circ - 30^\circ - 105^\circ = 45^\circ$이다.
2. $C$에서 $AB$에 내린 수선의 발을 $H$라 하면 $\triangle BCH$에서 $CH = 16\sin 30^\circ = 8$이다.
3. $\triangle ACH$는 $\angle A=45^\circ$인 직각이등변삼각형이므로 $AH=CH=8$이고, $$ AC = \sqrt{8^2+8^2} = 8\sqrt{2} $$ 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 $\triangle ABC$에서 $\overline{BC}=16$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\overline{AC}$의 길이는

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 $\triangle ABC$에서 $\overline{BC}=16$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\overline{AC}$의 길이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q8번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q8번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 길이←stem:「다음 그림의 $\triangle ABC$에서 $\overline{BC}=16$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\overline{AC}$의 길이는?」
- goal: 수선←solution:「$C$에서 $AB$에 내린 수선의 발을 $H$라 하면 $\triangle BCH$에서 $CH = 16\sin 30^\circ = 8$이다.」
- method: 수선의발(NAMED)←solution:「$C$에서 $AB$에 내린 수선의 발을 $H$라 하면 $\triangle BCH$에서 $CH = 16\sin 30^\circ = 8$이다.」
- condition: (없음)

**how** Q8번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 180^\circ - 30^\circ - 105^\circ = 45^\circ$이다. $C$에서 $AB$에 내린 수선의 발을 $H$라 하면 $\triangle BCH$에서 $CH = 16\sin 30^\circ = 8$이다. $\triangle ACH$는 $\angle A=45^\circ$인 직각이등변삼각형이므로 $AH=CH=8$이고, $$ AC = \sqrt{8^2+8^2} = 8\sqrt{2} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점


**발문**

다음 그림과 같이 두 지점 $B$, $C$에서 나무의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $45^\circ$, $60^\circ$이고, $\overline{BC}=18,\mathrm{m}$일 때, 이 나무의 높이는?

**보기** ① $6(3-\sqrt{3}),\mathrm{m}$  ② $9(3+\sqrt{3}),\mathrm{m}$  ③ $6(3+\sqrt{3}),\mathrm{m}$  ④ $9\sqrt{3},\mathrm{m}$  ⑤ $9(3-\sqrt{3}),\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나무의 밑점을 $H$, 높이를 $AH=h,\mathrm{m}$라 하면 $BH=h$, $CH=\dfrac{h}{\sqrt{3}}$이다.
2. $h + \dfrac{h}{\sqrt{3}} = 18 \implies (\sqrt{3}+1)h = 18\sqrt{3} \implies h = \dfrac{18\sqrt{3}}{\sqrt{3}+1} = 9\sqrt{3}(\sqrt{3}-1) = 9(3-\sqrt{3}),\mathrm{m}$ 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 두 지점 $B$, $C$에서 나무의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $45^\circ$, $60^\circ$이고, $\overline{BC}=18,\mathrm{m}$일 때, 이 나무의 높이는

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 두 지점 $B$, $C$에서 나무의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $45^\circ$, $60^\circ$이고, $\overline{BC}=18,\mathrm{m}$일 때, 이 나무의 높이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q9번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 45)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q9번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 45)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 45)

**4칸**
- given: 높이←stem:「다음 그림과 같이 두 지점 $B$, $C$에서 나무의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $45^\circ$, $60^\circ$이고, $\overline{BC}=18,\mathrm{m}$일 때, 이 나무의 높이는?」
- goal: 올려다본각←stem:「다음 그림과 같이 두 지점 $B$, $C$에서 나무의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $45^\circ$, $60^\circ$이고, $\overline{BC}=18,\mathrm{m}$일 때, 이 나무의 높이는?」
- method: 높이(NAMED)←solution:「나무의 밑점을 $H$, 높이를 $AH=h,\mathrm{m}$라 하면 $BH=h$, $CH=\dfrac{h}{\sqrt{3}}$이다.」
- condition: (없음)

**how** Q9번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 45)

<details><summary>저장 해설 (판정 검토용)</summary>

나무의 밑점을 $H$, 높이를 $AH=h,\mathrm{m}$라 하면 $BH=h$, $CH=\dfrac{h}{\sqrt{3}}$이다. $h + \dfrac{h}{\sqrt{3}} = 18 \implies (\sqrt{3}+1)h = 18\sqrt{3} \implies h = \dfrac{18\sqrt{3}}{\sqrt{3}+1} = 9\sqrt{3}(\sqrt{3}-1) = 9(3-\sqrt{3}),\mathrm{m}$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같은 평행사변형 $ABCD$에서 $\overline{AB}=9$, $\overline{AD}=8\sqrt{2}$, $\angle B=45^\circ$일 때, 평행사변형 $ABCD$의 넓이는?

**보기** ① $36$  ② $72$  ③ $36\sqrt{2}$  ④ $72\sqrt{2}$  ⑤ $54$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $BC = AD = 8\sqrt{2}$이고, 높이 $h = 9\sin 45^\circ = \dfrac{9\sqrt{2}}{2}$이다.
2. 따라서 평행사변형 $ABCD$의 넓이는 $8\sqrt{2} \times \dfrac{9\sqrt{2}}{2} = 72$이다.
3. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 평행사변형 $ABCD$에서 $\overline{AB}=9$, $\overline{AD}=8\sqrt{2}$, $\angle B=45^\circ$일 때, 평행사변형 $ABCD$의 넓이는

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 평행사변형 $ABCD$에서 $\overline{AB}=9$, $\overline{AD}=8\sqrt{2}$, $\angle B=45^\circ$일 때, 평행사변형 $ABCD$의 넓이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q10번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q10번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「다음 그림과 같은 평행사변형 $ABCD$에서 $\overline{AB}=9$, $\overline{AD}=8\sqrt{2}$, $\angle B=45^\circ$일 때, 평행사변형 $ABCD$의 넓이는?」
- goal: 평행←stem:「다음 그림과 같은 평행사변형 $ABCD$에서 $\overline{AB}=9$, $\overline{AD}=8\sqrt{2}$, $\angle B=45^\circ$일 때, 평행사변형 $ABCD$의 넓이는?」
- method: 높이(NAMED)←solution:「$BC = AD = 8\sqrt{2}$이고, 높이 $h = 9\sin 45^\circ = \dfrac{9\sqrt{2}}{2}$이다.」
- condition: (없음)

**how** Q10번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$BC = AD = 8\sqrt{2}$이고, 높이 $h = 9\sin 45^\circ = \dfrac{9\sqrt{2}}{2}$이다. 따라서 평행사변형 $ABCD$의 넓이는 $8\sqrt{2} \times \dfrac{9\sqrt{2}}{2} = 72$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다음 그림과 같이 똑바로 서 있는 나무로부터 $60,\mathrm{m}$ 떨어진 지점에서 나무의 꼭대기를 올려다본 각의 크기가 $36^\circ$이다. 사람의 눈높이가 $1.6,\mathrm{m}$일 때, 이 나무의 높이는? (단, $\sin 36^\circ=0.59$, $\cos 36^\circ=0.81$, $\tan 36^\circ=0.73$으로 계산한다.)

**보기** ① $37.0,\mathrm{m}$  ② $43.8,\mathrm{m}$  ③ $44.4,\mathrm{m}$  ④ $45.4,\mathrm{m}$  ⑤ $50.2,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 눈높이에서 나무 꼭대기까지의 높이는 $h = 60\tan 36^\circ = 60\times 0.73 = 43.8,\mathrm{m}$이다.
2. 따라서 나무 전체의 높이는 $43.8 + 1.6 = 45.4,\mathrm{m}$이므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 똑바로 서 있는 나무로부터 $60,\mathrm{m}$ 떨어진 지점에서 나무의 꼭대기를 올려다본 각의 크기가 $36^\circ$이다

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 똑바로 서 있는 나무로부터 $60,\mathrm{m}$ 떨어진 지점에서 나무의 꼭대기를 올려다본 각의 크기가 $36^\circ$이다.」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q11번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 60)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q11번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 60)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 60)

**4칸**
- given: 올려다본각←stem:「다음 그림과 같이 똑바로 서 있는 나무로부터 $60,\mathrm{m}$ 떨어진 지점에서 나무의 꼭대기를 올려다본 각의 크기가 $36^\circ$이다.」
- goal: 높이←stem:「사람의 눈높이가 $1.6,\mathrm{m}$일 때, 이 나무의 높이는?」
- method: tan(NAMED)←solution:「눈높이에서 나무 꼭대기까지의 높이는 $h = 60\tan 36^\circ = 60\times 0.73 = 43.8,\mathrm{m}$이다.」
- condition: (없음)

**how** Q11번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 60)

<details><summary>저장 해설 (판정 검토용)</summary>

눈높이에서 나무 꼭대기까지의 높이는 $h = 60\tan 36^\circ = 60\times 0.73 = 43.8,\mathrm{m}$이다. 따라서 나무 전체의 높이는 $43.8 + 1.6 = 45.4,\mathrm{m}$이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$45^\circ < x < 90^\circ$이고 $\sqrt{(\sin x-\cos x)^2}+\sqrt{(\sin x+\cos x)^2}=\dfrac{24}{13}$일 때, $\tan x$의 값은?

**보기** ① $\dfrac{12}{5}$  ② $\dfrac{5}{12}$  ③ $\dfrac{12}{13}$  ④ $\dfrac{5}{13}$  ⑤ $\dfrac{13}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $45^\circ < x < 90^\circ$이므로 $\sin x > \cos x > 0$이다.
2. 따라서 $(\sin x - \cos x) + (\sin x + \cos x) = 2\sin x = \dfrac{24}{13}$이므로 $\sin x = \dfrac{12}{13}$이다.
3. $x$는 예각이므로 $\cos x = \sqrt{1 - \left(\dfrac{12}{13}\right)^2} = \dfrac{5}{13}$이고, $$ \tan x = \dfrac{\sin x}{\cos x} = \dfrac{12/13}{5/13} = \dfrac{12}{5} $$ 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$45^\circ < x < 90^\circ$이고 $\sqrt{(\sin x-\cos x)^2}+\sqrt{(\sin x+\cos x)^2}=\dfrac{24}{13}$일 때, $\tan x$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q12번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 45)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q12번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 45)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 45)

**4칸**
- given: tan←stem:「$45^\circ < x < 90^\circ$이고 $\sqrt{(\sin x-\cos x)^2}+\sqrt{(\sin x+\cos x)^2}=\dfrac{24}{13}$일 때, $\tan x$의 값은?」
- goal: 예각←solution:「$x$는 예각이므로 $\cos x = \sqrt{1 - \left(\dfrac{12}{13}\right)^2} = \dfrac{5}{13}$이고, $$ \tan x = \dfrac{\sin x}{\cos x} = \dfrac{12/13}{5/13} = \dfrac{12}{5} $$ 정답은 ①이다.」
- method: 예각(NAMED)←solution:「$x$는 예각이므로 $\cos x = \sqrt{1 - \left(\dfrac{12}{13}\right)^2} = \dfrac{5}{13}$이고, $$ \tan x = \dfrac{\sin x}{\cos x} = \dfrac{12/13}{5/13} = \dfrac{12}{5} $$ 정답은 ①이다.」
- condition: (없음)

**how** Q12번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 45)

<details><summary>저장 해설 (판정 검토용)</summary>

$45^\circ < x < 90^\circ$이므로 $\sin x > \cos x > 0$이다. 따라서 $(\sin x - \cos x) + (\sin x + \cos x) = 2\sin x = \dfrac{24}{13}$이므로 $\sin x = \dfrac{12}{13}$이다. $x$는 예각이므로 $\cos x = \sqrt{1 - \left(\dfrac{12}{13}\right)^2} = \dfrac{5}{13}$이고, $$ \tan x = \dfrac{\sin x}{\cos x} = \dfrac{12/13}{5/13} = \dfrac{12}{5} $$ 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 좌표평면 위의 세 점 $A(0, 0)$, $B(-3, 2)$, $C(2, 3)$을 꼭짓점으로 하는 $\triangle ABC$에서 $\sin B \times \cos B$의 값은?

**보기** ① $\dfrac{1}{3}$  ② $\dfrac{\sqrt{2}}{2}$  ③ $\dfrac{1}{2}$  ④ $1$  ⑤ $\dfrac{3}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $AB^2 = (-3)^2+2^2 = 13$, $AC^2 = 2^2+3^2 = 13$, $BC^2 = (2+3)^2+(3-2)^2 = 26$이다.
2. $AB=AC$이고 $AB^2+AC^2=BC^2$이므로 $\triangle ABC$는 $\angle A=90^\circ$인 직각이등변삼각형이고, $\angle B=45^\circ$이다.
3. 따라서 $\sin B\times\cos B = \sin 45^\circ\times\cos 45^\circ = \dfrac{\sqrt{2}}{2}\times\dfrac{\sqrt{2}}{2} = \dfrac{1}{2}$이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 좌표평면 위의 세 점 $A(0, 0)$, $B(-3, 2)$, $C(2, 3)$을 꼭짓점으로 하는 $\triangle ABC$에서 $\sin B \times \cos B$의 값은

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 좌표평면 위의 세 점 $A(0, 0)$, $B(-3, 2)$, $C(2, 3)$을 꼭짓점으로 하는 $\triangle ABC$에서 $\sin B \times \cos B$의 값은?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q13번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q13번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 평면←stem:「다음 그림과 같이 좌표평면 위의 세 점 $A(0, 0)$, $B(-3, 2)$, $C(2, 3)$을 꼭짓점으로 하는 $\triangle ABC$에서 $\sin B \times \cos B$의 값은?」
- goal: 좌표←stem:「다음 그림과 같이 좌표평면 위의 세 점 $A(0, 0)$, $B(-3, 2)$, $C(2, 3)$을 꼭짓점으로 하는 $\triangle ABC$에서 $\sin B \times \cos B$의 값은?」
- method: 삼각형(NAMED)←solution:「$AB=AC$이고 $AB^2+AC^2=BC^2$이므로 $\triangle ABC$는 $\angle A=90^\circ$인 직각이등변삼각형이고, $\angle B=45^\circ$이다.」
- condition: (없음)

**how** Q13번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$AB^2 = (-3)^2+2^2 = 13$, $AC^2 = 2^2+3^2 = 13$, $BC^2 = (2+3)^2+(3-2)^2 = 26$이다. $AB=AC$이고 $AB^2+AC^2=BC^2$이므로 $\triangle ABC$는 $\angle A=90^\circ$인 직각이등변삼각형이고, $\angle B=45^\circ$이다. 따라서 $\sin B\times\cos B = \sin 45^\circ\times\cos 45^\circ = \dfrac{\sqrt{2}}{2}\times\dfrac{\sqrt{2}}{2} = \dfrac{1}{2}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점


**발문**

다음 그림과 같이 반지름의 길이가 $9,\mathrm{cm}$인 원 $O$에서 길이가 $12,\mathrm{cm}$인 현 $AB$와 원의 중심 $O$ 사이의 거리는?

**보기** ① $3\sqrt{3},\mathrm{cm}$  ② $3\sqrt{5},\mathrm{cm}$  ③ $2\sqrt{10},\mathrm{cm}$  ④ $4\sqrt{3},\mathrm{cm}$  ⑤ $5\sqrt{2},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심 $O$에서 현 $AB$에 내린 수선의 발을 $M$이라 하면 $AM=6,\mathrm{cm}$이다.
2. 직각삼각형 $OAM$에서 $OM = \sqrt{9^2 - 6^2} = \sqrt{45} = 3\sqrt{5},\mathrm{cm}$이다.
3. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $9,\mathrm{cm}$인 원 $O$에서 길이가 $12,\mathrm{cm}$인 현 $AB$와 원의 중심 $O$ 사이의 거리는

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 반지름의 길이가 $9,\mathrm{cm}$인 원 $O$에서 길이가 $12,\mathrm{cm}$인 현 $AB$와 원의 중심 $O$ 사이의 거리는?」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q14번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q14번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 반지름←stem:「다음 그림과 같이 반지름의 길이가 $9,\mathrm{cm}$인 원 $O$에서 길이가 $12,\mathrm{cm}$인 현 $AB$와 원의 중심 $O$ 사이의 거리는?」
- goal: 중심←stem:「다음 그림과 같이 반지름의 길이가 $9,\mathrm{cm}$인 원 $O$에서 길이가 $12,\mathrm{cm}$인 현 $AB$와 원의 중심 $O$ 사이의 거리는?」
- method: 수선(NAMED)←solution:「중심 $O$에서 현 $AB$에 내린 수선의 발을 $M$이라 하면 $AM=6,\mathrm{cm}$이다.」
- condition: (없음)

**how** Q14번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

중심 $O$에서 현 $AB$에 내린 수선의 발을 $M$이라 하면 $AM=6,\mathrm{cm}$이다. 직각삼각형 $OAM$에서 $OM = \sqrt{9^2 - 6^2} = \sqrt{45} = 3\sqrt{5},\mathrm{cm}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선이 현 $AB$와 만나는 점을 $M$, 원과 만나는 점을 $C$라 하자. $\overline{AB}=16,\mathrm{cm}$, $\overline{AC}=4\sqrt{5},\mathrm{cm}$일 때, $\overline{OM}$의 길이는?

**보기** ① $4,\mathrm{cm}$  ② $\dfrac{9}{2},\mathrm{cm}$  ③ $5,\mathrm{cm}$  ④ $\dfrac{11}{2},\mathrm{cm}$  ⑤ $6,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $AM=8,\mathrm{cm}$이고 직각삼각형 $AMC$에서 $MC = \sqrt{(4\sqrt{5})^2 - 8^2} = \sqrt{80-64} = 4,\mathrm{cm}$이다.
2. $OM=x$라 하면 $OA=OC=x+4$이므로 직각삼각형 $OAM$에서 $$ (x+4)^2 = x^2 + 8^2 \implies 8x = 48 \implies x = 6,\mathrm{cm} $$ 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선이 현 $AB$와 만나는 점을 $M$, 원과 만나는 점을 $C$라 하자

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선이 현 $AB$와 만나는 점을 $M$, 원과 만나는 점을 $C$라 하자.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q15번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q15번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 중심←stem:「다음 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선이 현 $AB$와 만나는 점을 $M$, 원과 만나는 점을 $C$라 하자.」
- goal: 수선←stem:「다음 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선이 현 $AB$와 만나는 점을 $M$, 원과 만나는 점을 $C$라 하자.」
- method: 삼각형(NAMED)←solution:「$AM=8,\mathrm{cm}$이고 직각삼각형 $AMC$에서 $MC = \sqrt{(4\sqrt{5})^2 - 8^2} = \sqrt{80-64} = 4,\mathrm{cm}$이다.」
- condition: (없음)

**how** Q15번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$AM=8,\mathrm{cm}$이고 직각삼각형 $AMC$에서 $MC = \sqrt{(4\sqrt{5})^2 - 8^2} = \sqrt{80-64} = 4,\mathrm{cm}$이다. $OM=x$라 하면 $OA=OC=x+4$이므로 직각삼각형 $OAM$에서 $$ (x+4)^2 = x^2 + 8^2 \implies 8x = 48 \implies x = 6,\mathrm{cm} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

다음 그림에서 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다. $\angle APB=50^\circ$, $\overline{OA}=6,\mathrm{cm}$일 때, 색칠한 큰 부채꼴 $OAB$의 넓이는?

**보기** ① $13\pi,\mathrm{cm}^2$  ② $18\pi,\mathrm{cm}^2$  ③ $20\pi,\mathrm{cm}^2$  ④ $23\pi,\mathrm{cm}^2$  ⑤ $26\pi,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $OA \perp PA$, $OB \perp PB$이므로 $\angle AOB = 360^\circ - 90^\circ - 90^\circ - 50^\circ = 130^\circ$이다.
2. 큰 부채꼴 $OAB$의 중심각은 $360^\circ - 130^\circ = 230^\circ$이므로 넓이는 $$ \pi\times 6^2\times\dfrac{230^\circ}{360^\circ} = 23\pi,\mathrm{cm}^2 $$ 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q16번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q16번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 PA)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「다음 그림에서 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다.」
- goal: 접점←stem:「다음 그림에서 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다.」
- method: 부채꼴(NAMED)←solution:「큰 부채꼴 $OAB$의 중심각은 $360^\circ - 130^\circ = 230^\circ$이므로 넓이는 $$ \pi\times 6^2\times\dfrac{230^\circ}{360^\circ} = 23\pi,\mathrm{cm}^2 $$ 따라서 정답은 ④이다.」
- condition: (없음)

**how** Q16번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

$OA \perp PA$, $OB \perp PB$이므로 $\angle AOB = 360^\circ - 90^\circ - 90^\circ - 50^\circ = 130^\circ$이다. 큰 부채꼴 $OAB$의 중심각은 $360^\circ - 130^\circ = 230^\circ$이므로 넓이는 $$ \pi\times 6^2\times\dfrac{230^\circ}{360^\circ} = 23\pi,\mathrm{cm}^2 $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 그림과 같이 다리의 아치에서 원의 일부분을 찾았다. 점 $M$은 $\overline{AB}$의 중점이고 $CM \perp AB$, $\overline{AB}=16,\mathrm{m}$, $\overline{CM}=4,\mathrm{m}$일 때, 이 원의 둘레의 길이는?

**보기** ① $20\pi,\mathrm{m}$  ② $16\pi,\mathrm{m}$  ③ $18\pi,\mathrm{m}$  ④ $22\pi,\mathrm{m}$  ⑤ $24\pi,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름을 $r,\mathrm{m}$라 하면 $AM=8,\mathrm{m}$, $OM=r-4$이다.
2. 직각삼각형 $OAM$에서 $r^2 = (r-4)^2 + 8^2 \implies 8r = 80 \implies r = 10,\mathrm{m}$이다.
3. 따라서 원의 둘레의 길이는 $2\pi\times 10 = 20\pi,\mathrm{m}$이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 다리의 아치에서 원의 일부분을 찾았다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 다리의 아치에서 원의 일부분을 찾았다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q17번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q17번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 부분←stem:「다음 그림과 같이 다리의 아치에서 원의 일부분을 찾았다.」
- goal: 중점←stem:「점 $M$은 $\overline{AB}$의 중점이고 $CM \perp AB$, $\overline{AB}=16,\mathrm{m}$, $\overline{CM}=4,\mathrm{m}$일 때, 이 원의 둘레의 길이는?」
- method: 반지름(NAMED)←solution:「반지름을 $r,\mathrm{m}$라 하면 $AM=8,\mathrm{m}$, $OM=r-4$이다.」
- condition: (없음)

**how** Q17번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

반지름을 $r,\mathrm{m}$라 하면 $AM=8,\mathrm{m}$, $OM=r-4$이다. 직각삼각형 $OAM$에서 $r^2 = (r-4)^2 + 8^2 \implies 8r = 80 \implies r = 10,\mathrm{m}$이다. 따라서 원의 둘레의 길이는 $2\pi\times 10 = 20\pi,\mathrm{m}$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

다음 그림에서 $PT$는 원 $O$의 접선이고 점 $T$는 접점이다. 세 점 $P$, $A$, $O$가 한 직선 위에 있고 $\angle TPO=30^\circ$, $\overline{PA}=8,\mathrm{cm}$일 때, $\overline{PT}$의 길이는?

**보기** ① $6\sqrt{3},\mathrm{cm}$  ② $8\sqrt{2},\mathrm{cm}$  ③ $8\sqrt{3},\mathrm{cm}$  ④ $12\sqrt{3},\mathrm{cm}$  ⑤ $16,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름을 $r,\mathrm{cm}$라 하면 $AO=OT=r$, $PO=8+r$이다.
2. $OT \perp PT$이므로 직각삼각형 $PTO$에서 $\sin 30^\circ = \dfrac{r}{8+r} = \dfrac{1}{2} \implies r = 8,\mathrm{cm}$, $PO = 16,\mathrm{cm}$이다.
3. 따라서 $\overline{PT} = 16\cos 30^\circ = 8\sqrt{3},\mathrm{cm}$이므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $PT$는 원 $O$의 접선이고 점 $T$는 접점이다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $PT$는 원 $O$의 접선이고 점 $T$는 접점이다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q18번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 PT)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q18번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 PT)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 PT)

**4칸**
- given: 접선←stem:「다음 그림에서 $PT$는 원 $O$의 접선이고 점 $T$는 접점이다.」
- goal: 접점←stem:「다음 그림에서 $PT$는 원 $O$의 접선이고 점 $T$는 접점이다.」
- method: 반지름(NAMED)←solution:「반지름을 $r,\mathrm{cm}$라 하면 $AO=OT=r$, $PO=8+r$이다.」
- condition: (없음)

**how** Q18번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 PT)

<details><summary>저장 해설 (판정 검토용)</summary>

반지름을 $r,\mathrm{cm}$라 하면 $AO=OT=r$, $PO=8+r$이다. $OT \perp PT$이므로 직각삼각형 $PTO$에서 $\sin 30^\circ = \dfrac{r}{8+r} = \dfrac{1}{2} \implies r = 8,\mathrm{cm}$, $PO = 16,\mathrm{cm}$이다. 따라서 $\overline{PT} = 16\cos 30^\circ = 8\sqrt{3},\mathrm{cm}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다. $\overline{AB}=7,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{AC}=9,\mathrm{cm}$일 때, $\overline{CF}$의 길이는?

**보기** ① $3,\mathrm{cm}$  ② $4,\mathrm{cm}$  ③ $5,\mathrm{cm}$  ④ $6,\mathrm{cm}$  ⑤ $7,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $AD=AF=x$라 하면 $BD=BE=7-x$, $CF=CE=9-x$이다.
2. $BC = BE + CE = 10$이므로 $(7-x)+(9-x) = 10 \implies 2x = 6 \implies x = 3$이다.
3. 따라서 $\overline{CF} = 9 - 3 = 6,\mathrm{cm}$이므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q19번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q19번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 접점←stem:「다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
- goal: 내접←stem:「다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
- method: 접점(NAMED)←stem:「다음 그림에서 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
- condition: (없음)

**how** Q19번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$AD=AF=x$라 하면 $BD=BE=7-x$, $CF=CE=9-x$이다. $BC = BE + CE = 10$이므로 $(7-x)+(9-x) = 10 \implies 2x = 6 \implies x = 3$이다. 따라서 $\overline{CF} = 9 - 3 = 6,\mathrm{cm}$이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음 그림에서 원 $O$는 $\angle A=90^\circ$인 직각삼각형 $ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다. $\overline{BE}=8,\mathrm{cm}$, $\overline{CE}=12,\mathrm{cm}$일 때, 원 $O$의 넓이는?

**보기** ① $4\pi,\mathrm{cm}^2$  ② $8\pi,\mathrm{cm}^2$  ③ $9\pi,\mathrm{cm}^2$  ④ $12\pi,\mathrm{cm}^2$  ⑤ $16\pi,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $BD=BE=8,\mathrm{cm}$, $CF=CE=12,\mathrm{cm}$이고 내접원의 반지름을 $r,\mathrm{cm}$라 하면 $AD=AF=r$이다.
2. $AB=r+8$, $AC=r+12$, $BC=20$이므로 직각삼각형 $ABC$에서 $$ (r+8)^2 + (r+12)^2 = 20^2 \implies 2r^2 + 40r - 192 = 0 \implies r^2 + 20r - 96 = 0 $$ $(r-4)(r+24)=0$이고 $r>0$이므로 $r=4,\mathrm{cm}$이다.
3. 따라서 원 $O$의 넓이는 $\pi\times 4^2 = 16\pi,\mathrm{cm}^2$이므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $O$는 $\angle A=90^\circ$인 직각삼각형 $ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $O$는 $\angle A=90^\circ$인 직각삼각형 $ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q20번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q20번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「다음 그림에서 원 $O$는 $\angle A=90^\circ$인 직각삼각형 $ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
- goal: 직각삼각형←stem:「다음 그림에서 원 $O$는 $\angle A=90^\circ$인 직각삼각형 $ABC$의 내접원이고 세 점 $D$, $E$, $F$는 접점이다.」
- method: 반지름(NAMED)←solution:「$BD=BE=8,\mathrm{cm}$, $CF=CE=12,\mathrm{cm}$이고 내접원의 반지름을 $r,\mathrm{cm}$라 하면 $AD=AF=r$이다.」
- condition: (없음)

**how** Q20번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$BD=BE=8,\mathrm{cm}$, $CF=CE=12,\mathrm{cm}$이고 내접원의 반지름을 $r,\mathrm{cm}$라 하면 $AD=AF=r$이다. $AB=r+8$, $AC=r+12$, $BC=20$이므로 직각삼각형 $ABC$에서 $$ (r+8)^2 + (r+12)^2 = 20^2 \implies 2r^2 + 40r - 192 = 0 \implies r^2 + 20r - 96 = 0 $$ $(r-4)(r+24)=0$이고 $r>0$이므로 $r=4,\mathrm{cm}$이다. 따라서 원 $O$의 넓이는 $\pi\times 4^2 = 16\pi,\mathrm{cm}^2$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 7점


**발문**

[서·논술형 1] 다음 그림과 같이 한 모서리의 길이가 $6$인 정육면체 $ABCD-EFGH$의 꼭짓점 $D$에서 대각선 $\overline{BH}$에 내린 수선의 발을 $N$이라 하고 $\angle NDH=x$라 할 때, $\sin x - \cos x + \tan x$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $BD = 6\sqrt{2}$, $DH = 6$이므로 $BH = \sqrt{(6\sqrt{2})^2+6^2} = 6\sqrt{3}$이다.
2. $\triangle DNH \sim \triangle DBH$이므로 $x = \angle NDH = \angle DBH$이다.
3. 직각삼각형 $DBH$에서 $$ \sin x = \dfrac{6}{6\sqrt{3}} = \dfrac{\sqrt{3}}{3}, \qquad \cos x = \dfrac{6\sqrt{2}}{6\sqrt{3}} = \dfrac{\sqrt{6}}{3}, \qquad \tan x = \dfrac{6}{6\sqrt{2}} = \dfrac{\sqrt{2}}{2} $$ 따라서 $\sin x - \cos x + \tan x = \dfrac{\sqrt{3}}{3} - \dfrac{\sqrt{6}}{3} + \dfrac{\sqrt{2}}{2} = \dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$이다.
- 작성자 답: $\dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 모서리의 길이가 $6$인 정육면체 $ABCD-EFGH$의 꼭짓점 $D$에서 대각선 $\overline{BH}$에 내린 수선의 발을 $N$이라 하고 $\angle NDH=x$라 할 때, $\sin x - \cos x + \tan x$의 값을 구하시오

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 1] 다음 그림과 같이 한 모서리의 길이가 $6$인 정육면체 $ABCD-EFGH$의 꼭짓점 $D$에서 대각선 $\overline{BH}$에 내린 수선의 발을 $N$이라 하고 $\angle NDH=x$라 할 때, $\sin x - \cos x + \tan x$의 값을 구하시오.」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q21번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q21번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 수선←stem:「[서·논술형 1] 다음 그림과 같이 한 모서리의 길이가 $6$인 정육면체 $ABCD-EFGH$의 꼭짓점 $D$에서 대각선 $\overline{BH}$에 내린 수선의 발을 $N$이라 하고 $\angle NDH=x$라 할 때, $\sin x - \cos x + \tan x$의 값을 구하시오.」
- goal: 길이←stem:「[서·논술형 1] 다음 그림과 같이 한 모서리의 길이가 $6$인 정육면체 $ABCD-EFGH$의 꼭짓점 $D$에서 대각선 $\overline{BH}$에 내린 수선의 발을 $N$이라 하고 $\angle NDH=x$라 할 때, $\sin x - \cos x + \tan x$의 값을 구하시오.」
- method: 삼각형(NAMED)←solution:「직각삼각형 $DBH$에서 $$ \sin x = \dfrac{6}{6\sqrt{3}} = \dfrac{\sqrt{3}}{3}, \qquad \cos x = \dfrac{6\sqrt{2}}{6\sqrt{3}} = \dfrac{\sqrt{6}}{3}, \qquad \tan x = \dfrac{6}{6\sqrt{2}} = \dfrac{\sqrt{2}}{2} $$ 따라서 $\sin x - \cos x + \tan x = \dfrac{\sqrt{3}}{3} - \dfrac{\sqrt{6}}{3} + \dfrac{\sqrt{2}}{2} = \dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$이다.」
- condition: (없음)

**how** Q21번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 $\dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$BD = 6\sqrt{2}$, $DH = 6$이므로 $BH = \sqrt{(6\sqrt{2})^2+6^2} = 6\sqrt{3}$이다. $\triangle DNH \sim \triangle DBH$이므로 $x = \angle NDH = \angle DBH$이다. 직각삼각형 $DBH$에서 $$ \sin x = \dfrac{6}{6\sqrt{3}} = \dfrac{\sqrt{3}}{3}, \qquad \cos x = \dfrac{6\sqrt{2}}{6\sqrt{3}} = \dfrac{\sqrt{6}}{3}, \qquad \tan x = \dfrac{6}{6\sqrt{2}} = \dfrac{\sqrt{2}}{2} $$ 따라서 $\sin x - \cos x + \tan x = \dfrac{\sqrt{3}}{3} - \dfrac{\sqrt{6}}{3} + \dfrac{\sqrt{2}}{2} = \dfrac{2\sqrt{3}-2\sqrt{6}+3\sqrt{2}}{6}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 6점


**발문**

[서·논술형 2] 다음 그림과 같이 $\overline{AB}=4\sqrt{3},\mathrm{cm}$, $\overline{AD}=6,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{CD}=8,\mathrm{cm}$이고 $\angle BAD=150^\circ$, $\angle BCD=60^\circ$인 사각형 $ABCD$의 넓이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $26\sqrt{3},\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 대각선 $BD$를 그어 사각형을 $\triangle ABD$와 $\triangle BCD$로 나눈다.
2. $\angle BAD=150^\circ$이므로 $\triangle ABD$의 넓이는 $$ \triangle ABD = \dfrac{1}{2}\times 4\sqrt{3}\times 6\times\sin(180^\circ-150^\circ) = 12\sqrt{3}\times\dfrac{1}{2} = 6\sqrt{3},\mathrm{cm}^2 $$ $\triangle BCD$의 넓이는 $$ \triangle BCD = \dfrac{1}{2}\times 10\times 8\times\sin 60^\circ = 40\times\dfrac{\sqrt{3}}{2} = 20\sqrt{3},\mathrm{cm}^2 $$ 따라서 사각형 $ABCD$의 넓이는 $6\sqrt{3} + 20\sqrt{3} = 26\sqrt{3},\mathrm{cm}^2$이다.
- 작성자 답: $26\sqrt{3},\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{AB}=4\sqrt{3},\mathrm{cm}$, $\overline{AD}=6,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{CD}=8,\mathrm{cm}$이고 $\angle BAD=150^\circ$, $\angle BCD=60^\circ$인 사각형 $ABCD$의 넓이를 구하시오

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 2] 다음 그림과 같이 $\overline{AB}=4\sqrt{3},\mathrm{cm}$, $\overline{AD}=6,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{CD}=8,\mathrm{cm}$이고 $\angle BAD=150^\circ$, $\angle BCD=60^\circ$인 사각형 $ABCD$의 넓이를 구하시오.」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q22번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q22번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 사각형←stem:「[서·논술형 2] 다음 그림과 같이 $\overline{AB}=4\sqrt{3},\mathrm{cm}$, $\overline{AD}=6,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{CD}=8,\mathrm{cm}$이고 $\angle BAD=150^\circ$, $\angle BCD=60^\circ$인 사각형 $ABCD$의 넓이를 구하시오.」
- goal: 넓이←stem:「[서·논술형 2] 다음 그림과 같이 $\overline{AB}=4\sqrt{3},\mathrm{cm}$, $\overline{AD}=6,\mathrm{cm}$, $\overline{BC}=10,\mathrm{cm}$, $\overline{CD}=8,\mathrm{cm}$이고 $\angle BAD=150^\circ$, $\angle BCD=60^\circ$인 사각형 $ABCD$의 넓이를 구하시오.」
- method: 대각선(NAMED)←solution:「대각선 $BD$를 그어 사각형을 $\triangle ABD$와 $\triangle BCD$로 나눈다.」
- condition: (없음)

**how** Q22번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 $26\sqrt{3},\mathrm{cm}^2$을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

대각선 $BD$를 그어 사각형을 $\triangle ABD$와 $\triangle BCD$로 나눈다. $\angle BAD=150^\circ$이므로 $\triangle ABD$의 넓이는 $$ \triangle ABD = \dfrac{1}{2}\times 4\sqrt{3}\times 6\times\sin(180^\circ-150^\circ) = 12\sqrt{3}\times\dfrac{1}{2} = 6\sqrt{3},\mathrm{cm}^2 $$ $\triangle BCD$의 넓이는 $$ \triangle BCD = \dfrac{1}{2}\times 10\times 8\times\sin 60^\circ = 40\times\dfrac{\sqrt{3}}{2} = 20\sqrt{3},\mathrm{cm}^2 $$ 따라서 사각형 $ABCD$의 넓이는 $6\sqrt{3} + 20\sqrt{3} = 26\sqrt{3},\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 7점


**발문**

[서·논술형 3] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $\overline{AB}\perp\overline{OM}$, $\overline{OA}=10,\mathrm{cm}$, $\overline{OM}=6,\mathrm{cm}$, $\overline{DB}=3,\mathrm{cm}$일 때, $\overline{OD}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\sqrt{61},\mathrm{cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $OM \perp AB$이므로 $M$은 $AB$의 중점이다.
2. 직각삼각형 $OMB$에서 $MB = \sqrt{10^2 - 6^2} = 8,\mathrm{cm}$이고, 점 $D$가 선분 $MB$ 위에 있으므로 $MD = 8 - 3 = 5,\mathrm{cm}$이다.
3. 따라서 직각삼각형 $OMD$에서 $OD = \sqrt{6^2 + 5^2} = \sqrt{61},\mathrm{cm}$이다.
- 작성자 답: $\sqrt{61},\mathrm{cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $\overline{AB}\perp\overline{OM}$, $\overline{OA}=10,\mathrm{cm}$, $\overline{OM}=6,\mathrm{cm}$, $\overline{DB}=3,\mathrm{cm}$일 때, $\overline{OD}$의 길이를 구하시오

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 3] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $\overline{AB}\perp\overline{OM}$, $\overline{OA}=10,\mathrm{cm}$, $\overline{OM}=6,\mathrm{cm}$, $\overline{DB}=3,\mathrm{cm}$일 때, $\overline{OD}$의 길이를 구하시오.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: Q23번 문항은 M3-RPM-067에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC
- 이유: Q23번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 반지름←stem:「[서·논술형 3] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $\overline{AB}\perp\overline{OM}$, $\overline{OA}=10,\mathrm{cm}$, $\overline{OM}=6,\mathrm{cm}$, $\overline{DB}=3,\mathrm{cm}$일 때, $\overline{OD}$의 길이를 구하시오.」
- goal: 중심←stem:「[서·논술형 3] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $\overline{AB}\perp\overline{OM}$, $\overline{OA}=10,\mathrm{cm}$, $\overline{OM}=6,\mathrm{cm}$, $\overline{DB}=3,\mathrm{cm}$일 때, $\overline{OD}$의 길이를 구하시오.」
- method: 중점(NAMED)←solution:「$OM \perp AB$이므로 $M$은 $AB$의 중점이다.」
- condition: (없음)

**how** Q23번 문항으로 M3-06 단원의 기본 개념과 성질을 적용하여 $\sqrt{61},\mathrm{cm}$을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$OM \perp AB$이므로 $M$은 $AB$의 중점이다. 직각삼각형 $OMB$에서 $MB = \sqrt{10^2 - 6^2} = 8,\mathrm{cm}$이고, 점 $D$가 선분 $MB$ 위에 있으므로 $MD = 8 - 3 = 5,\mathrm{cm}$이다. 따라서 직각삼각형 $OMD$에서 $OD = \sqrt{6^2 + 5^2} = \sqrt{61},\mathrm{cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
