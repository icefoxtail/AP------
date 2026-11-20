# 검수 묶음 — 24_금당중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4, CHOICE_DUPLICATE 1)**
- 문항 24개 / 검사 PASS 20, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: SELF_CONTAINED 19, NONE 5
- 난이도 분포: 1단계 1, 2단계 10, 3단계 8, 4단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 검사 코드: CHOICE_ORDER
- **Q5**: 검사 코드: CHOICE_ORDER, CHOICE_DUPLICATE
- **Q13**: 검사 코드: CHOICE_ORDER
- **Q16**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3점


**발문**

다음 그림과 같이 $\angle A$의 크기가 같은 세 직각삼각형 $ABC$, $ADE$, $AFG$($\angle B=\angle D=\angle F=90^\circ$)가 있다. 다음 중 옳지 않은 것은?

**보기** ① $\dfrac{BC}{AC}=\dfrac{DE}{AE}$  ② $\cos A=\dfrac{AC}{AB}$  ③ $\sin A=\dfrac{FG}{AG}$  ④ $\dfrac{AB}{AC}=\dfrac{AF}{AG}$  ⑤ $\tan A=\dfrac{DE}{AD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 직각삼각형 $ABC, ADE, AFG$는 $\angle A$를 공유하므로 모두 닮음이다.
2. $\triangle ABC$에서 $\cos A = \dfrac{AB}{AC}$이다.
3. 따라서 $\cos A = \dfrac{AC}{AB}$라고 한 ②가 옳지 않다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle A$의 크기가 같은 세 직각삼각형

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle A$의 크기가 같은 세 직각삼각형 $ABC$, $ADE$, $AFG$」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 삼각비의 정의인 sin, cos, tan의 비례식을 확인하는 삼각비의 뜻 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 닮은 세 직각삼각형에서 삼각비의 기본 관계식을 검토하는 유형이다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각비의 기초 정의를 확인하는 난이도 1 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「다음 그림과 같이 $\angle A$의 크기가 같은 세 직각삼각형 $ABC$, $ADE$, $AFG$」
- goal: 직각삼각형←stem:「다음 중 옳지 않은 것은?」
- method: 직각삼각형(NAMED)←solution:「세 직각삼각형 $ABC$, $ADE$, $AFG$는 모두 $\angle A$를 공유하므로 닮음이고」
- condition: 선분←choices:「$\cos A=\dfrac{AC}{AB}$」

**how** 직각삼각형의 닮음 성질과 삼각비 코사인의 정의를 대조하여 2번 선지가 거짓임을 판별했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

세 직각삼각형 $ABC$, $ADE$, $AFG$는 모두 $\angle A$를 공유하므로 닮음이고 대응변의 길이의 비가 같다. $\triangle ABC$에서 $\angle A$의 빗변은 $AC$, 이웃한 변은 $AB$이므로 $\cos A = \dfrac{AB}{AC}$이다. 따라서 $\cos A = \dfrac{AC}{AB}$라고 한 ②가 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 $\angle C=90^\circ$, $AB=5$, $BC=\sqrt{11}$인 직각삼각형 $ABC$에서 $\cos B\times\tan B$의 값은?

**보기** ① $\dfrac{\sqrt{11}}{5}$  ② $\dfrac{11}{25}$  ③ $\dfrac{3}{5}$  ④ $\dfrac{4}{5}$  ⑤ $\dfrac{\sqrt{14}}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 피타고라스 정리에 의해 $AC = \sqrt{5^2 - (\sqrt{11})^2} = \sqrt{14}$이다.
2. $\cos B = \dfrac{\sqrt{11}}{5}$, $\tan B = \dfrac{\sqrt{14}}{\sqrt{11}}$이다.
3. 따라서 $\cos B \times \tan B = \dfrac{\sqrt{11}}{5} \times \dfrac{\sqrt{14}}{\sqrt{11}} = \dfrac{\sqrt{14}}{5}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle C=90^\circ$, $AB=5$, $BC=\sqrt{11}$인 직각삼각형 $ABC$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle C=90^\circ$, $AB=5$, $BC=\sqrt{11}$인 직각삼각형 $ABC$에서」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형의 변의 비로 삼각비를 계산하는 삼각비의 뜻 유형이다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각삼각형의 두 변의 길이로부터 삼각비의 값을 유도하여 계산하는 유형이다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리와 삼각비 곱셈을 결합한 난이도 2 문항이다. (문항 토큰 90)

**4칸**
- given: 직각삼각형←stem:「다음 그림과 같이 $\angle C=90^\circ$, $AB=5$, $BC=\sqrt{11}$인 직각삼각형 $ABC$에서」
- goal: 직각삼각형←stem:「$\cos B\times\tan B$의 값은?」
- method: 직각삼각형(NAMED)←solution:「피타고라스 정리에 의해」
- condition: 무리수←solution:「$\cos B = \dfrac{BC}{AB} = \dfrac{\sqrt{11}}{5}$」

**how** 피타고라스 정리로 높이 AC를 구한 후 cos B와 tan B를 곱해 답을 구했다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리에 의해 $$ AC = \sqrt{AB^2 - BC^2} = \sqrt{5^2 - (\sqrt{11})^2} = \sqrt{25-11} = \sqrt{14} $$ 따라서 $\cos B = \dfrac{BC}{AB} = \dfrac{\sqrt{11}}{5}$, $\tan B = \dfrac{AC}{BC} = \dfrac{\sqrt{14}}{\sqrt{11}}$이므로 $$ \cos B \times \tan B = \dfrac{\sqrt{11}}{5} \times \dfrac{\sqrt{14}}{\sqrt{11}} = \dfrac{\sqrt{14}}{5} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

다음 중 계산이 옳은 것은?

**보기** ① $\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{6}$  ② $\sin 0^\circ + \cos 90^\circ = 1$  ③ $2\sin 30^\circ \times \sin 45^\circ = \sqrt{2}$  ④ $\tan 45^\circ \div \sin 60^\circ = \dfrac{\sqrt{3}}{2}$  ⑤ $\cos 0^\circ \times \cos 45^\circ = 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① $\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{2} - \dfrac{\sqrt{3}}{3} = \dfrac{\sqrt{3}}{6}$로 옳다.
2. 다른 보기들의 계산값은 모두 거짓이다.
3. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 계산이 옳은 것은?」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산]
- 이유: 30도, 45도, 60도의 삼각비 사칙연산을 다루는 특수각 계산 유형이다. (문항 토큰 30)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각의 삼각비 값을 이용한 사칙연산의 결과를 판별하는 유형이다. (문항 토큰 30)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 특수각의 삼각비 암기와 분수 계산을 검증하는 난이도 2 문항이다. (문항 토큰 30)

**4칸**
- given: 사칙연산←stem:「다음 중 계산이 옳은 것은?」
- goal: 사칙연산←stem:「다음 중 계산이 옳은 것은?」
- method: 사칙연산(NAMED)←solution:「특수각의 삼각비 값을 각각 대입하면」
- condition: 무리수←choices:「$\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{6}$」

**how** 특수각의 삼각비 값을 각 선지에 대입하여 1번 선지가 참임을 판별했다. (문항 토큰 30)

<details><summary>저장 해설 (판정 검토용)</summary>

특수각의 삼각비 값을 각각 대입하면


* ① $\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{2} - \dfrac{\sqrt{3}}{3} = \dfrac{\sqrt{3}}{6}$(옳음) * ②$\sin 0^\circ + \cos 90^\circ = 0 + 0 = 0$
* ③ $2\times\dfrac{1}{2}\times\dfrac{\sqrt{2}}{2} = \dfrac{\sqrt{2}}{2}$
* ④ $1\div\dfrac{\sqrt{3}}{2} = \dfrac{2\sqrt{3}}{3}$
* ⑤ $1\times\dfrac{\sqrt{2}}{2} = \dfrac{\sqrt{2}}{2}$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $OB=0.68$이다. 아래 삼각비의 표를 이용하여 $\cos 43^\circ$의 값을 구하면?


각도
  $\sin$
  $\cos$
  $\tan$
  $46^\circ$
  $0.72$
  $0.69$
  $1.04$
  $47^\circ$
  $0.73$
  $0.68$
  $1.07$
  $48^\circ$
  $0.74$
  $0.67$
  $1.11$

**보기** ① $0.67$  ② $0.68$  ③ $0.69$  ④ $0.73$  ⑤ $0.74$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 사분원에서 $\cos x = \dfrac{OB}{OA} = 0.68$이므로 표에서 $x = 47^\circ$이다.
2. $43^\circ + 47^\circ = 90^\circ$이므로 $\cos 43^\circ = \sin 47^\circ = 0.73$이다.
3. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $OB=0.68$이다.

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $OB=0.68$이다.」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 여각 관계와 사분원을 이용하는 삼각비의 관계 유형이다. (문항 토큰 OB)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_TABLE_LOOKUP
- 이유: 사분원과 삼각비표를 연계하여 삼각비의 값을 조회하는 유형이다. (문항 토큰 OB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분원의 기하적 의미와 표 조회를 결합한 난이도 2 문항이다. (문항 토큰 OB)

**4칸**
- given: 선분←stem:「다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $OB=0.68$이다.」
- goal: 선분←stem:「아래 삼각비의 표를 이용하여 $\cos 43^\circ$의 값을 구하면?」
- method: 선분(NAMED)←solution:「사분원의 반지름의 길이가 $1$이므로 $OA=1$이고」
- condition: 선분←solution:「$43^\circ + 47^\circ = 90^\circ$이므로 $\cos 43^\circ = \sin 47^\circ = 0.73$이다.」

**how** 사분원의 선분 길이로 각을 찾고 여각의 삼각비 관계를 이용해 표에서 값을 읽었다. (문항 토큰 OB)

<details><summary>저장 해설 (판정 검토용)</summary>

사분원의 반지름의 길이가 $1$이므로 $OA=1$이고, $\cos x = \dfrac{OB}{OA} = 0.68$이다. 표에서 $\cos 47^\circ = 0.68$이므로 $x=47^\circ$이다. $43^\circ + 47^\circ = 90^\circ$이므로 $\cos 43^\circ = \sin 47^\circ = 0.73$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER, CHOICE_DUPLICATE

**발문**

예각 $A$에 대하여 $\tan A=3$일 때, $\cos A - \sin A$의 값은?

**보기** ① $-\dfrac{\sqrt{10}}{5}$  ② $-\dfrac{\sqrt{10}}{10}$  ③ $-\dfrac{\sqrt{10}}{5}$  ④ $\dfrac{\sqrt{10}}{5}$  ⑤ $\dfrac{2\sqrt{10}}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\tan A = 3$에서 밑변 $1$, 높이 $3$이면 빗변은 $\sqrt{10}$이다.
2. $\cos A = \dfrac{1}{\sqrt{10}}, \sin A = \dfrac{3}{\sqrt{10}}$이다.
3. 따라서 $\cos A - \sin A = \dfrac{-2}{\sqrt{10}} = -\dfrac{\sqrt{10}}{5}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각 $A$에 대하여 $\tan A=3$일 때」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 삼각비 사이의 상호 관계를 이용하는 삼각비의 관계 유형이다. (문항 토큰 10)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: 하나의 삼각비 값으로부터 다른 삼각비 값을 유도하여 식을 정리하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 무리수 유리화와 삼각비 관계 대수를 적용하는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 직각삼각형←stem:「예각 $A$에 대하여 $\tan A=3$일 때」
- goal: 직각삼각형←stem:「$\cos A - \sin A$의 값은?」
- method: 직각삼각형(NAMED)←solution:「밑변의 길이가 $1$, 높이가 $3$인 직각삼각형을 생각하면」
- condition: 무리수←solution:「빗변의 길이는 $\sqrt{1^2+3^2}=\sqrt{10}$이다.」

**how** 탄젠트 값으로 직각삼각형의 세 변을 설정하고 코사인과 사인의 차를 계산했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

$\tan A = 3$이므로 밑변의 길이가 $1$, 높이가 $3$인 직각삼각형을 생각하면 빗변의 길이는 $\sqrt{1^2+3^2}=\sqrt{10}$이다. 따라서 $\cos A = \dfrac{1}{\sqrt{10}}$, $\sin A = \dfrac{3}{\sqrt{10}}$이므로 $$ \cos A - \sin A = \dfrac{1-3}{\sqrt{10}} = -\dfrac{2}{\sqrt{10}} = -\dfrac{\sqrt{10}}{5} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

다음 그림에서 $AB=\sqrt{3}$, $\angle ABC=\angle BCD=90^\circ$, $\angle A=60^\circ$, $\angle D=45^\circ$일 때, $BD$의 길이는?

**보기** ① $3$  ② $3\sqrt{2}$  ③ $3\sqrt{3}$  ④ $4\sqrt{2}$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $ABC$에서 $BC = \sqrt{3}\tan 60^\circ = 3$이다.
2. 직각삼각형 $BCD$는 $\angle D=45^\circ$인 직각이등변삼각형이므로 $BC=CD=3$이다.
3. 따라서 $BD = \sqrt{3^2+3^2} = 3\sqrt{2}$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $AB=\sqrt{3}$, $\angle ABC=\angle BCD=90^\circ$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $AB=\sqrt{3}$, $\angle ABC=\angle BCD=90^\circ$, $\angle A=60^\circ$, $\angle D=45^\circ$일 때」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이]
- 이유: 특수각을 이용하여 도형의 변의 길이를 구하는 각을 이용한 길이 유형이다. (문항 토큰 AB)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 연결된 두 직각삼각형에서 특수각의 삼각비를 이용해 길이를 연쇄 측정하는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 단계의 직각삼각형 삼각비 계산을 연계하는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 직각삼각형←stem:「다음 그림에서 $AB=\sqrt{3}$, $\angle ABC=\angle BCD=90^\circ$, $\angle A=60^\circ$, $\angle D=45^\circ$일 때」
- goal: 선분←stem:「$BD$의 길이는?」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $ABC$에서 $\tan 60^\circ = \dfrac{BC}{AB} = \dfrac{BC}{\sqrt{3}} = \sqrt{3}$이므로 $BC=3$이다.」
- condition: 이등변삼각형←solution:「직각삼각형 $BCD$는 $\angle D=45^\circ$인 직각이등변삼각형이므로」

**how** 직각삼각형 ABC에서 삼각비로 BC를 구하고 직각이등변삼각형 BCD에서 BD를 계산했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ABC$에서 $\tan 60^\circ = \dfrac{BC}{AB} = \dfrac{BC}{\sqrt{3}} = \sqrt{3}$이므로 $BC=3$이다. 직각삼각형 $BCD$는 $\angle D=45^\circ$인 직각이등변삼각형이므로 $BC=CD=3$이고, $$ BD = \sqrt{3^2+3^2} = 3\sqrt{2} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

다음 그림과 같이 한 모서리의 길이가 $12$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$는 $\triangle BCD$의 무게중심이고, $M$은 변 $BC$의 중점이다. 다음 중 옳은 것은?

**보기** ① $AH=4\sqrt{6}$  ② $MC=6\sqrt{3}$  ③ $MD=12\sqrt{3}$  ④ $MH=4\sqrt{3}$  ⑤ $\tan(\angle ADH)=2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 정삼각형에서 $MC=6, MD=6\sqrt{3}$이다.
2. 무게중심 $H$에 의해 $DH=4\sqrt{3}$이다.
3. 직각삼각형 $ADH$에서 $AH = \sqrt{12^2 - (4\sqrt{3})^2} = 4\sqrt{6}$이다.
4. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 모서리의 길이가 $12$인 정사면체 $ABCD$의

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 모서리의 길이가 $12$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$」
**RPM** M3-RPM-066 [삼각비 > 삼각비의 활용 > 복합도형 > 피타고라스 결합]
- 이유: 도형의 대칭성과 피타고라스를 결합하는 피타고라스 결합 유형이다. (문항 토큰 12)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 입체도형 정사면체에서 수선의 발과 피타고라스 정리를 적용하는 유형이다. (문항 토큰 12)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 입체도형 내부 단면과 무게중심 비를 분석하는 난이도 3 문항이다. (문항 토큰 12)

**4칸**
- given: 선분←stem:「한 모서리의 길이가 $12$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$」
- goal: 선분←stem:「다음 중 옳은 것은?」
- method: 정삼각형(NAMED)←solution:「밑면 $BCD$는 한 변의 길이가 $12$인 정삼각형이므로」
- condition: 무게중심←stem:「수선의 발 $H$는 $\triangle BCD$의 무게중심이고, $M$은 변 $BC$의 중점이다.」

**how** 정사면체 밑면의 무게중심과 피타고라스 정리를 결합하여 높이 AH를 구했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

밑면 $BCD$는 한 변의 길이가 $12$인 정삼각형이므로 $MC=6$, $MD=\sqrt{12^2-6^2}=6\sqrt{3}$이다. 무게중심 $H$는 중선 $MD$를 $2:1$로 나누므로 $DH=4\sqrt{3}$, $MH=2\sqrt{3}$이다. 직각삼각형 $ADH$에서 $$ AH = \sqrt{AD^2 - DH^2} = \sqrt{12^2 - (4\sqrt{3})^2} = \sqrt{144-48} = \sqrt{96} = 4\sqrt{6} $$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림과 같은 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=75^\circ$, $\angle C=60^\circ$일 때, $AB$의 길이는?

**보기** ① $5\sqrt{2},\mathrm{cm}$  ② $5\sqrt{3},\mathrm{cm}$  ③ $10,\mathrm{cm}$  ④ $10\sqrt{2},\mathrm{cm}$  ⑤ $5\sqrt{6},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle A = 180^\circ - 75^\circ - 60^\circ = 45^\circ$이다.
2. 수선의 발 $D$를 내리면 $BD = 10\sin 60^\circ = 5\sqrt{3}$이다.
3. 직각이등변삼각형 $ABD$에서 $AB = BD\sqrt{2} = 5\sqrt{6}$이다.
4. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 $\triangle ABC$에서 $BC=10,\mathrm{cm}$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=75^\circ$, $\angle C=60^\circ$일 때」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용]
- 이유: 보조선을 활용하여 직각삼각형을 만드는 보조선 활용 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 일반삼각형에서 보조선 수선을 내려 특수각 삼각비로 변의 길이를 구하는 유형이다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수선 보조선을 직접 작도하고 두 직각삼각형을 연계하는 난이도 3 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「다음 그림과 같은 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=75^\circ$, $\angle C=60^\circ$일 때」
- goal: 선분←stem:「$AB$의 길이는?」
- method: 수선(NAMED)←solution:「꼭짓점 $B$에서 $AC$에 내린 수선의 발을 $D$라 하면」
- condition: 직각삼각형←solution:「직각삼각형 $BCD$에서 $$ BD = BC\sin 60^\circ」

**how** 꼭짓점에서 수선의 발 보조선을 그어 두 직각삼각형으로 분할하여 AB를 계산했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 180^\circ - 75^\circ - 60^\circ = 45^\circ$이다. 꼭짓점 $B$에서 $AC$에 내린 수선의 발을 $D$라 하면 직각삼각형 $BCD$에서 $$ BD = BC\sin 60^\circ = 10\times\dfrac{\sqrt{3}}{2} = 5\sqrt{3},\mathrm{cm} $$ 직각삼각형 $ABD$에서 $\angle A=45^\circ$이므로 직각이등변삼각형이 되어 $$ AB = BD\sqrt{2} = 5\sqrt{6},\mathrm{cm} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

직각삼각형 $ABC$($\angle C=90^\circ$)에서 점 $I$는 내심이고 $\angle BIC=120^\circ$일 때, $\sin A : \cos A : \tan A$는?

**보기** ① $1:\sqrt{3}:2\sqrt{3}$  ② $\sqrt{3}:2:1$  ③ $\sqrt{3}:2:3$  ④ $\sqrt{3}:1:2\sqrt{3}$  ⑤ $2:\sqrt{3}:1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 내심 조건에서 $\dfrac{\angle B}{2} + 45^\circ + 120^\circ = 180^\circ$이므로 $\angle B = 30^\circ, \angle A = 60^\circ$이다.
2. $\sin 60^\circ = \dfrac{\sqrt{3}}{2}, \cos 60^\circ = \dfrac{1}{2}, \tan 60^\circ = \sqrt{3}$이다.
3. 따라서 비례식은 $\sqrt{3} : 1 : 2\sqrt{3}$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형 $ABC$($\angle C=90^\circ$)에서 점 $I$는 내심이고 $\angle BIC=120^\circ$일 때」
**RPM** M3-RPM-057 [삼각비 > 삼각비 > 특수각의 삼각비 > 30°·45°·60°]
- 이유: 특수각 30도와 60도의 삼각비 값을 묻는 30°·45°·60° 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 삼각형의 내심 성질로부터 특수각을 찾고 삼각비의 비례식을 구하는 유형이다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심 각 공식과 특수각 삼각비 비례식을 복합한 난이도 3 문항이다. (문항 토큰 ABC)

**4칸**
- given: 내심←stem:「직각삼각형 $ABC$($\angle C=90^\circ$)에서 점 $I$는 내심이고 $\angle BIC=120^\circ$일 때」
- goal: 직각삼각형←stem:「$\sin A : \cos A : \tan A$는?」
- method: 내심(NAMED)←solution:「$I$는 내심이므로 $\angle IBC=\dfrac{\angle B}{2}$」
- condition: 직각삼각형←solution:「$\angle B=30^\circ$이고 $\angle A=60^\circ$이다.」

**how** 내심 각의 성질로 각 A가 60도임을 구한 후 특수각 삼각비의 연비를 도출했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$I$는 내심이므로 $\angle IBC=\dfrac{\angle B}{2}$, $\angle ICB=\dfrac{90^\circ}{2}=45^\circ$이다. $\triangle BIC$에서 $\dfrac{\angle B}{2} + 45^\circ + 120^\circ = 180^\circ$이므로 $\dfrac{\angle B}{2}=15^\circ$, 즉 $\angle B=30^\circ$이고 $\angle A=60^\circ$이다. 따라서 $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$, $\tan 60^\circ = \sqrt{3}$이므로 $$ \sin A : \cos A : \tan A = \dfrac{\sqrt{3}}{2} : \dfrac{1}{2} : \sqrt{3} = \sqrt{3} : 1 : 2\sqrt{3} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 그림에서 $\angle ACB=90^\circ$, $AB=6\sqrt{2},\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle ABC=45^\circ$, $\angle DAC=60^\circ$일 때, 사각형 $ABCD$의 넓이는?

**보기** ① $(18+3\sqrt{3}),\mathrm{cm}^2$  ② $(18+6\sqrt{3}),\mathrm{cm}^2$  ③ $(18+12\sqrt{3}),\mathrm{cm}^2$  ④ $(36+6\sqrt{3}),\mathrm{cm}^2$  ⑤ $(18\sqrt{2}+6\sqrt{3}),\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$는 직각이등변삼각형이므로 $AC=BC=6$이고 넓이는 $18$이다.
2. $\triangle ACD = \dfrac{1}{2}\times 6\times 4\times\sin 60^\circ = 6\sqrt{3}$이다.
3. 따라서 사각형 $ABCD$의 넓이는 $(18+6\sqrt{3})\text{cm}^2$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\angle ACB=90^\circ$, $AB=6\sqrt{2},\mathrm{cm}$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\angle ACB=90^\circ$, $AB=6\sqrt{2},\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle ABC=45^\circ$, $\angle DAC=60^\circ$일 때」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 삼각비를 이용해 두 변과 끼인각으로 넓이를 구하는 삼각형의 높이·넓이 유형이다. (문항 토큰 ACB)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각형의 삼각비 넓이 공식을 이용하여 다각형의 넓이를 구하는 유형이다. (문항 토큰 ACB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각이등변삼각형과 일반삼각형의 넓이 공식을 결합한 난이도 3 문항이다. (문항 토큰 ACB)

**4칸**
- given: 사각형←stem:「다음 그림에서 $\angle ACB=90^\circ$, $AB=6\sqrt{2},\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle ABC=45^\circ$, $\angle DAC=60^\circ$일 때」
- goal: 넓이←stem:「사각형 $ABCD$의 넓이는?」
- method: 넓이(NAMED)←solution:「$\triangle ACD = \dfrac{1}{2}\times 6\times 4\times\sin 60^\circ = 6\sqrt{3},\mathrm{cm}^2$」
- condition: 이등변삼각형←solution:「$\triangle ABC$는 $\angle ACB=90^\circ$, $\angle ABC=45^\circ$인 직각이등변삼각형이므로」

**how** 두 삼각형의 넓이를 각각 직각삼각형과 삼각비 넓이 공식으로 구해 합산했다. (문항 토큰 ACB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$는 $\angle ACB=90^\circ$, $\angle ABC=45^\circ$인 직각이등변삼각형이므로 $AC=BC=6,\mathrm{cm}$이다. 따라서 $\triangle ABC = \dfrac{1}{2}\times 6\times 6 = 18,\mathrm{cm}^2$이다. $\triangle ACD$에서 $AC=6,\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle DAC=60^\circ$이므로 $$ \triangle ACD = \dfrac{1}{2}\times 6\times 4\times\sin 60^\circ = 6\sqrt{3},\mathrm{cm}^2 $$ 그러므로 사각형 $ABCD$의 넓이는 $(18+6\sqrt{3}),\mathrm{cm}^2$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다음 그림과 같이 두 직각삼각형 $ABC$($\angle B=90^\circ, \angle ACB=60^\circ$)와 $ADE$($\angle D=90^\circ, \angle AED=45^\circ$)가 겹쳐져 있다. $AC=AE=8,\mathrm{cm}$일 때, 겹쳐진 부분인 $\triangle ADF$의 넓이는?

**보기** ① $\dfrac{8\sqrt{3}}{3},\mathrm{cm}^2$  ② $4\sqrt{3},\mathrm{cm}^2$  ③ $\dfrac{16\sqrt{3}}{3},\mathrm{cm}^2$  ④ $6\sqrt{3},\mathrm{cm}^2$  ⑤ $8\sqrt{3},\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ADE$에서 $AD = \dfrac{8}{\sqrt{2}} = 4\sqrt{2}$이다.
2. 직각삼각형 $ADF$에서 $DF = 4\sqrt{2}\tan 30^\circ = \dfrac{4\sqrt{6}}{3}$이다.
3. 따라서 $\triangle ADF = \dfrac{1}{2}\times 4\sqrt{2}\times\dfrac{4\sqrt{6}}{3} = \dfrac{16\sqrt{3}}{3}\text{cm}^2$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 두 직각삼각형 $ABC$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직각삼각형 $ABC$($\angle B=90^\circ, \angle ACB=60^\circ$)와 $ADE$($\angle D=90^\circ, \angle AED=45^\circ$)가 겹쳐져 있다.」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 삼각비로 밑변과 높이를 도출해 넓이를 구하는 삼각형의 높이·넓이 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 두 직각삼각형이 겹쳐진 영역의 각과 변을 삼각비로 추론하는 유형이다. (문항 토큰 ABC)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다단계 각 추론과 무리수 분수 넓이 계산이 포함된 난이도 4 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「두 직각삼각형 $ABC$($\angle B=90^\circ, \angle ACB=60^\circ$)와 $ADE$($\angle D=90^\circ, \angle AED=45^\circ$)가 겹쳐져 있다.」
- goal: 넓이←stem:「겹쳐진 부분인 $\triangle ADF$의 넓이는?」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $ADF$에서 $DF = AD\tan 30^\circ」
- condition: 이등변삼각형←solution:「$\triangle ADE$는 빗변이 $AE=8,\mathrm{cm}$인 직각이등변삼각형이므로」

**how** 겹쳐진 직각삼각형에서 특수각을 찾아 밑변과 높이를 구하고 넓이를 계산했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ADE$는 빗변이 $AE=8,\mathrm{cm}$인 직각이등변삼각형이므로 $AD=\dfrac{8}{\sqrt{2}}=4\sqrt{2},\mathrm{cm}$이다. $\triangle ABC$에서 $\angle A=30^\circ$이므로 직각삼각형 $ADF$에서 $DF = AD\tan 30^\circ = 4\sqrt{2}\times\dfrac{\sqrt{3}}{3} = \dfrac{4\sqrt{6}}{3},\mathrm{cm}$이다. 따라서 $\triangle ADF$의 넓이는 $$ \dfrac{1}{2}\times 4\sqrt{2}\times\dfrac{4\sqrt{6}}{3} = \dfrac{16\sqrt{3}}{3},\mathrm{cm}^2 $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

다음 그림과 같이 $120,\mathrm{m}$ 떨어진 두 지점 $A$, $B$에서 탑의 꼭대기 $C$ 지점을 올려본각의 크기가 각각 $60^\circ$와 $45^\circ$일 때, 이 탑의 높이는?

**보기** ① $60(3-\sqrt{3}),\mathrm{m}$  ② $60(3+\sqrt{3}),\mathrm{m}$  ③ $40(3-\sqrt{3}),\mathrm{m}$  ④ $40(3+\sqrt{3}),\mathrm{m}$  ⑤ $60\sqrt{3},\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 탑의 높이를 $h$라 하면 $AD = \dfrac{h}{\sqrt{3}}, DB = h$이다.
2. $\dfrac{h}{\sqrt{3}} + h = 120$에서 $h = \dfrac{120\sqrt{3}}{\sqrt{3}+1} = 60(3-\sqrt{3})$이다.
3. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $120,\mathrm{m}$ 떨어진 두 지점 $A$, $B$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $120,\mathrm{m}$ 떨어진 두 지점 $A$, $B$에서 탑의 꼭대기 $C$ 지점을 올려본각의 크기가 각각 $60^\circ$와 $45^\circ$일 때」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각]
- 이유: 앙각과 부각을 이용해 높이와 거리를 구하는 앙각·부각 유형이다. (문항 토큰 120)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 지면의 두 지점에서 올려본각(앙각)을 이용하여 물체의 높이를 구하는 유형이다. (문항 토큰 120)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 탄젠트 비례식 방정식과 분모 유리화를 수행하는 난이도 3 문항이다. (문항 토큰 120)

**4칸**
- given: 선분←stem:「다음 그림과 같이 $120,\mathrm{m}$ 떨어진 두 지점 $A$, $B$에서 탑의 꼭대기 $C$ 지점을 올려본각의 크기가 각각 $60^\circ$와 $45^\circ$일 때」
- goal: 선분←stem:「이 탑의 높이는?」
- method: 방정식(NAMED)←solution:「$AD + DB = 120$이므로」
- condition: 유리화←solution:「따라서 탑의 높이는 $60(3-\sqrt{3}),\mathrm{m}$이므로」

**how** 두 지점에서의 앙각을 이용해 밑변의 합 방정식을 세우고 유리화하여 높이를 구했다. (문항 토큰 120)

<details><summary>저장 해설 (판정 검토용)</summary>

탑의 발을 $D$, 높이를 $CD=h,\mathrm{m}$라 하면 $AD=\dfrac{h}{\sqrt{3}}$, $DB=h$이다. $AD + DB = 120$이므로 $$ \dfrac{h}{\sqrt{3}} + h = 120 \implies (1+\sqrt{3})h = 120\sqrt{3} \implies h = \dfrac{120\sqrt{3}}{\sqrt{3}+1} = 60\sqrt{3}(\sqrt{3}-1) = 60(3-\sqrt{3}) $$ 따라서 탑의 높이는 $60(3-\sqrt{3}),\mathrm{m}$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

한 변의 길이가 $6$인 정사각형 $ABCD$의 두 변 $AD$, $CD$의 중점을 각각 $M$, $N$이라 하고 $\angle MBN=x^\circ$라 할 때, $\cos x^\circ$의 값은?

**보기** ① $\dfrac{2}{5}$  ② $\dfrac{3}{5}$  ③ $\dfrac{3\sqrt{34}}{34}$  ④ $\dfrac{5\sqrt{34}}{34}$  ⑤ $\dfrac{4}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정사각형 넓이에서 여사건 삼각형 3개의 넓이를 빼면 $\triangle BMN = \dfrac{27}{2}$이다.
2. $\dfrac{1}{2}\times 3\sqrt{5}\times 3\sqrt{5}\times\sin x^\circ = \dfrac{27}{2}$에서 $\sin x^\circ = \dfrac{3}{5}$이다.
3. 예각이므로 $\cos x^\circ = \dfrac{4}{5}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 변의 길이가 $6$인 정사각형 $ABCD$의 두 변 $AD$, $CD$의 중점을 각각 $M$, $N$이라 하고」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 넓이 공식과 삼각비의 관계를 이용하는 삼각형의 높이·넓이 유형이다. (문항 토큰 ABCD)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 정사각형 내부 삼각형의 넓이로부터 삼각비를 역산하는 유형이다. (문항 토큰 ABCD)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 간접 넓이 계산과 삼각비 상호 변환을 요구하는 난이도 4 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 정사각형←stem:「한 변의 길이가 $6$인 정사각형 $ABCD$의 두 변 $AD$, $CD$의 중점을 각각 $M$, $N$이라 하고」
- goal: 정사각형←stem:「$\cos x^\circ$의 값은?」
- method: 넓이(NAMED)←solution:「정사각형의 넓이 $36$에서 세 직각삼각형 $ABM$, $MDN$, $BCN$의 넓이」
- condition: 선분←solution:「$BM=BN=\sqrt{6^2+3^2}=3\sqrt{5}$이다.」

**how** 전체 넓이에서 주변 삼각형들을 빼 넓이를 구하고 삼각비 공식으로 sin을 찾아 cos을 계산했다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$AM=MD=DN=NC=3$이므로 $BM=BN=\sqrt{6^2+3^2}=3\sqrt{5}$이다. 정사각형의 넓이 $36$에서 세 직각삼각형 $ABM$, $MDN$, $BCN$의 넓이 $9$, $\dfrac{9}{2}$, $9$를 빼면 $$ \triangle BMN = 36 - 9 - \dfrac{9}{2} - 9 = \dfrac{27}{2} $$ $\triangle BMN = \dfrac{1}{2}\times BM\times BN\times\sin x^\circ = \dfrac{45}{2}\sin x^\circ = \dfrac{27}{2}$이므로 $\sin x^\circ = \dfrac{3}{5}$이다. $x^\circ$는 예각이므로 $\cos x^\circ = \dfrac{4}{5}$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

다음 그림과 같이 원 $O$의 지름 $AB$와 현 $CD$가 점 $M$에서 수직으로 만난다. $AM=12,\mathrm{cm}$, $MB=4,\mathrm{cm}$일 때, 현 $CD$의 길이는?

**보기** ① $4\sqrt{3},\mathrm{cm}$  ② $8\sqrt{3},\mathrm{cm}$  ③ $6\sqrt{3},\mathrm{cm}$  ④ $4\sqrt{5},\mathrm{cm}$  ⑤ $8\sqrt{5},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 $OA = 8$이고 $OM = 12 - 8 = 4$이다.
2. 직각삼각형 $OMC$에서 $CM = \sqrt{8^2-4^2} = 4\sqrt{3}$이다.
3. 현 $CD = 2CM = 8\sqrt{3}\text{cm}$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$의 지름 $AB$와 현 $CD$가 점 $M$에서 수직으로 만난다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$의 지름 $AB$와 현 $CD$가 점 $M$에서 수직으로 만난다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 원의 중심에서 현에 내린 수선은 현을 이등분함을 이용하는 중심에서 현에 내린 수선 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원의 지름과 현이 수직으로 만날 때 현의 길이를 구하는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원의 반지름과 중심거리, 현의 이등분 성질을 적용하는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림과 같이 원 $O$의 지름 $AB$와 현 $CD$가 점 $M$에서 수직으로 만난다.」
- goal: 선분←stem:「현 $CD$의 길이는?」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $OMC$에서 $CM = \sqrt{8^2-4^2} = 4\sqrt{3},\mathrm{cm}$이므로」
- condition: 선분←stem:「$AM=12,\mathrm{cm}$, $MB=4,\mathrm{cm}$일 때」

**how** 원의 중심과 반지름을 구하고 직각삼각형 피타고라스 정리로 현의 반절을 구해 2배했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

지름 $AB = 12 + 4 = 16,\mathrm{cm}$이므로 원 $O$의 반지름은 $8,\mathrm{cm}$이다. $AO=8,\mathrm{cm}$, $AM=12,\mathrm{cm}$이므로 $OM = 12 - 8 = 4,\mathrm{cm}$이다. 직각삼각형 $OMC$에서 $CM = \sqrt{8^2-4^2} = 4\sqrt{3},\mathrm{cm}$이므로 $CD = 2CM = 8\sqrt{3},\mathrm{cm}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $CD$에 이르는 거리가 같고 $CD=8,\mathrm{cm}$, $\angle BAO=30^\circ$일 때, 원 $O$의 반지름의 길이는?

**보기** ① $4,\mathrm{cm}$  ② $2\sqrt{3},\mathrm{cm}$  ③ $4\sqrt{3},\mathrm{cm}$  ④ $\dfrac{8\sqrt{3}}{3},\mathrm{cm}$  ⑤ $\dfrac{4\sqrt{3}}{3},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB = CD = 8$이다.
2. 수선의 발 $P$에서 $AP = 4$이다.
3. 직각삼각형 $AOP$에서 $AO = \dfrac{4}{\cos 30^\circ} = \dfrac{8\sqrt{3}}{3}\text{cm}$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $CD$에 이르는 거리가 같고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $CD$에 이르는 거리가 같고 $CD=8,\mathrm{cm}$」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 중심에서 현까지의 거리와 현의 길이 관계를 이용하는 중심거리와 현의 길이 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 중심에서 같은 거리에 있는 현의 성질과 특수각 삼각비를 연계하는 유형이다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 현의 성질과 30도 삼각비 계산을 함께 활용하는 난이도 3 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $CD$에 이르는 거리가 같고 $CD=8,\mathrm{cm}$」
- goal: 선분←stem:「원 $O$의 반지름의 길이는?」
- method: 선분(NAMED)←solution:「중심에서 같은 거리에 있는 두 현의 길이는 같으므로」
- condition: 직각삼각형←solution:「직각삼각형 $AOP$에서 $\cos 30^\circ = \dfrac{4}{AO} = \dfrac{\sqrt{3}}{2}$이므로」

**how** 등거리 현의 성질로 AB 길이를 구하고 30도 직각삼각형 삼각비로 반지름을 계산했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=CD=8,\mathrm{cm}$이다. $O$에서 $AB$에 내린 수선의 발을 $P$라 하면 $AP=4,\mathrm{cm}$이다. 직각삼각형 $AOP$에서 $\cos 30^\circ = \dfrac{4}{AO} = \dfrac{\sqrt{3}}{2}$이므로 $AO = \dfrac{8}{\sqrt{3}} = \dfrac{8\sqrt{3}}{3},\mathrm{cm}$이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $AC$에 이르는 거리가 같고 $\angle A=50^\circ$일 때, $\angle B$의 크기 $x$는?

**보기** ① $65^\circ$  ② $60^\circ$  ③ $70^\circ$  ④ $75^\circ$  ⑤ $80^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB = AC$이다.
2. $\triangle ABC$는 이등변삼각형이므로 두 밑각의 크기는 같다.
3. 따라서 $x = \dfrac{180^\circ - 50^\circ}{2} = 65^\circ$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $AC$에 이르는 거리가 같고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $AC$에 이르는 거리가 같고 $\angle A=50^\circ$일 때」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 원의 중심과 현의 거리 성질을 활용하는 중심거리와 현의 길이 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 현의 길이 성질로 이등변삼각형을 판정하고 각의 크기를 구하는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 등거리 현의 길이와 이등변삼각형 밑각 성질을 연계한 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $AC$에 이르는 거리가 같고 $\angle A=50^\circ$일 때」
- goal: 선분←stem:「$\angle B$의 크기 $x$는?」
- method: 이등변삼각형(NAMED)←solution:「중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=AC$이고 $\triangle ABC$는 이등변삼각형이다.」
- condition: 선분←solution:「$x = \dfrac{180^\circ - 50^\circ}{2} = 65^\circ$이다.」

**how** 중심에서 거리가 같은 두 현이 같아 이등변삼각형이 됨을 이용해 밑각을 구했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=AC$이고 $\triangle ABC$는 이등변삼각형이다. $\angle A=50^\circ$이므로 $x = \dfrac{180^\circ - 50^\circ}{2} = 65^\circ$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 그림에서 $PA$, $PQ$, $QC$는 지름이 $AC$인 반원 $O$의 접선이고, 세 점 $A$, $B$, $C$는 그 접점이다. $\angle POQ = x$의 크기를 구하는 과정에서 (가), (나), (다)에 알맞은 것을 차례로 쓴 것은?


$\triangle OAP \equiv \triangle OBP$이므로 $\angle AOP =$ (가) $= \dfrac{1}{2}\angle AOB$ 마찬가지로 $\angle BOQ = \angle COQ =$ (나) $\angle BOC$ 따라서 $x = \angle BOP + \angle BOQ = \dfrac{1}{2}(\angle AOB + \angle BOC) =$ (다)

**보기** ① $\angle BOP,\ \dfrac{1}{3},\ 60^\circ$  ② $\angle COQ,\ \dfrac{1}{2},\ 90^\circ$  ③ $\angle BOP,\ \dfrac{1}{2},\ 90^\circ$  ④ $\angle COQ,\ \dfrac{1}{3},\ 60^\circ$  ⑤ $\angle BOQ,\ \dfrac{1}{2},\ 90^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 합동에 의해 (가)는 $\angle BOP$이다.
2. (나)는 $\dfrac{1}{2}$이다.
3. 평각의 절반이므로 (다)는 $90^\circ$이다.
4. 따라서 알맞은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $PA$, $PQ$, $QC$는 지름이 $AC$인 반원 $O$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $PA$, $PQ$, $QC$는 지름이 $AC$인 반원 $O$의 접선이고」
**RPM** M3-RPM-073 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 각 구하기]
- 이유: 접선이 이루는 각의 성질을 추론하는 접선 조건으로 각 구하기 유형이다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_HALF_ANGLE
- 이유: 원의 접선 성질과 삼각형의 합동으로 각의 관계를 증명하고 빈칸을 채우는 유형이다. (문항 토큰 PA)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 증명 과정의 빈칸을 단계별로 채우는 난이도 2 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「다음 그림에서 $PA$, $PQ$, $QC$는 지름이 $AC$인 반원 $O$의 접선이고」
- goal: 접선←stem:「(가), (나), (다)에 알맞은 것을 차례로 쓴 것은?」
- method: 합동(NAMED)←solution:「$\triangle OAP \equiv \triangle OBP$이므로 $\angle AOP = \angle BOP = \dfrac{1}{2}\angle AOB$이다.」
- condition: 접점←stem:「세 점 $A$, $B$, $C$는 그 접점이다.」

**how** 접선의 합동 성질을 이용해 사잇각의 반각 관계와 평각의 합 90도를 추론했다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle OAP \equiv \triangle OBP$이므로 $\angle AOP = \angle BOP = \dfrac{1}{2}\angle AOB$이다. 따라서 (가)는 $\angle BOP$이다. 마찬가지로 $\angle BOQ = \angle COQ = \dfrac{1}{2}\angle BOC$이므로 (나)는 $\dfrac{1}{2}$이다. $\angle AOB + \angle BOC = 180^\circ$이므로 $x = \dfrac{1}{2}\times 180^\circ = 90^\circ$이다. 따라서 (다)는 $90^\circ$이고 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점


**발문**

다음 그림과 같이 원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접한다. $DE$가 원 $O$의 접선이고 $DC=8,\mathrm{cm}$, $DE=10,\mathrm{cm}$일 때, $BE$의 길이는?

**보기** ① $3,\mathrm{cm}$  ② $4,\mathrm{cm}$  ③ $5,\mathrm{cm}$  ④ $8,\mathrm{cm}$  ⑤ $6,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $DCE$에서 $CE = \sqrt{10^2-8^2} = 6$이다.
2. 원의 반지름은 $4$이므로 가로를 $w$라 할 때 $DE = (w-4) + (w-10) = 10$에서 $w = 12$이다.
3. 따라서 $BE = 12 - 6 = 6\text{cm}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접한다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접한다.」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 접선의 길이 성질로 미지수의 길이를 도출하는 접선 조건으로 길이 구하기 유형이다. (문항 토큰 ABCD)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH
- 이유: 외접사각형과 원의 접선 성질을 이용해 길이를 구하는 유형이다. (문항 토큰 ABCD)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 길이 분할과 직각삼각형 피타고라스를 결합한 난이도 4 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 직사각형←stem:「원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접한다.」
- goal: 선분←stem:「$BE$의 길이는?」
- method: 접선(NAMED)←solution:「원의 반지름의 길이는 $\dfrac{8}{2}=4,\mathrm{cm}$이다. 직사각형의 가로 길이를 $BC=AD=w$라 하면 접선의 성질에 의해」
- condition: 선분←stem:「$DC=8,\mathrm{cm}$, $DE=10,\mathrm{cm}$일 때」

**how** 접선의 길이 성질을 이용해 미지수 가로 w의 방정식을 세우고 선분 BE의 길이를 구했다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $DCE$에서 $DC=8,\mathrm{cm}$, $DE=10,\mathrm{cm}$이므로 $CE=\sqrt{10^2-8^2}=6,\mathrm{cm}$이다. 원의 반지름의 길이는 $\dfrac{8}{2}=4,\mathrm{cm}$이다. 직사각형의 가로 길이를 $BC=AD=w$라 하면 접선의 성질에 의해 $DI = w-4$, $EI = BE-4 = (w-6)-4 = w-10$이다. $DE = DI + EI = (w-4)+(w-10) = 10$이므로 $2w = 24$, $w = 12,\mathrm{cm}$이다. 따라서 $BE = BC - CE = 12 - 6 = 6,\mathrm{cm}$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 그림에서 두 직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 그 접점이다. $PA=4\sqrt{3},\mathrm{cm}$, $OA=4,\mathrm{cm}$일 때, 다음 중 옳은 것은?

**보기** ① $PB=4,\mathrm{cm}$  ② $PO=8\sqrt{3},\mathrm{cm}$  ③ $\angle APB=30^\circ$  ④ 색칠한 부분의 넓이 $= \left(16\sqrt{3}-\dfrac{16\pi}{3}\right),\mathrm{cm}^2$  ⑤ 부채꼴 $OAB$의 넓이 $= 16\pi,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $PO = \sqrt{4^2+(4\sqrt{3})^2} = 8$이고 $\angle APO = 30^\circ, \angle AOB = 120^\circ$이다.
2. 사각형 $PAOB = 16\sqrt{3}$, 부채꼴 $OAB = \dfrac{16\pi}{3}$이다.
3. 따라서 색칠한 부분의 넓이는 $\left(16\sqrt{3}-\dfrac{16\pi}{3}\right)\text{cm}^2$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 그 접점이다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 그 접점이다.」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 원 밖의 한 점에서 그은 두 접선의 성질을 활용하는 한 점에서 그은 두 접선 유형이다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_ARC_AREA
- 이유: 접선과 반지름이 이루는 직각삼각형에서 부채꼴을 뺀 영역의 넓이를 구하는 유형이다. (문항 토큰 PA)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 특수각 삼각비와 부채꼴 넓이 뺄셈을 결합한 난이도 3 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「다음 그림에서 두 직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 그 접점이다.」
- goal: 넓이←stem:「다음 중 옳은 것은?」
- method: 부채꼴(NAMED)←solution:「부채꼴 $OAB$의 넓이는 $\pi\times 4^2\times\dfrac{120^\circ}{360^\circ} = \dfrac{16\pi}{3},\mathrm{cm}^2$이다.」
- condition: 선분←stem:「$PA=4\sqrt{3},\mathrm{cm}$, $OA=4,\mathrm{cm}$일 때」

**how** 접선 직각삼각형에서 중심각을 찾고 사각형 넓이에서 부채꼴 넓이를 뺐다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

$PO = \sqrt{4^2+(4\sqrt{3})^2} = 8,\mathrm{cm}$이고 $\sin\angle APO = \dfrac{4}{8} = \dfrac{1}{2}$이므로 $\angle APO=30^\circ$, $\angle APB=60^\circ$, $\angle AOB=120^\circ$이다. 사각형 $PAOB$의 넓이는 $2\times\dfrac{1}{2}\times 4\times 4\sqrt{3} = 16\sqrt{3},\mathrm{cm}^2$, 부채꼴 $OAB$의 넓이는 $\pi\times 4^2\times\dfrac{120^\circ}{360^\circ} = \dfrac{16\pi}{3},\mathrm{cm}^2$이다. 따라서 색칠한 부분의 넓이는 $\left(16\sqrt{3}-\dfrac{16\pi}{3}\right),\mathrm{cm}^2$이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음 그림과 같이 중심이 같은 두 원에서 큰 원의 길이가 $6$인 현이 작은 원에 접하면서 작은 원을 따라 한 바퀴 돌았을 때, 현이 지나간 부분의 넓이는?

**보기** ① $3\pi$  ② $6\pi$  ③ $9\pi$  ④ $12\pi$  ⑤ $36\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 현의 절반 길이가 $3$이므로 피타고라스 정리에 의해 $R^2 - r^2 = 3^2 = 9$이다.
2. 현이 지나간 고리 모양 부분의 넓이는 $\pi(R^2 - r^2) = 9\pi$이다. (보기에 $12\pi, 36\pi$ 제시)
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 중심이 같은 두 원에서 큰 원의 길이가 $6$인 현이

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「중심이 같은 두 원에서 큰 원의 길이가 $6$인 현이 작은 원에 접하면서」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 동심원 구조에서 원의 중심에서 현에 내린 수선의 성질을 이용하는 중심에서 현에 내린 수선 유형이다. (문항 토큰 12)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 동심원에서 접현의 길이와 피타고라스 정리를 이용해 원환의 넓이를 구하는 유형이다. (문항 토큰 12)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반지름의 개별 값 없이 제곱의 차만으로 넓이를 도출하는 난이도 3 문항이다. (문항 토큰 12)

**4칸**
- given: 선분←stem:「중심이 같은 두 원에서 큰 원의 길이가 $6$인 현이 작은 원에 접하면서」
- goal: 넓이←stem:「현이 지나간 부분의 넓이는?」
- method: 직각삼각형(NAMED)←solution:「피타고라스 정리에 의해 $R^2 - r^2 = 3^2 = 9$이다.」
- condition: 선분←solution:「길이가 $6$인 현의 절반의 길이는 $3$이므로」

**how** 피타고라스 정리로 두 반지름 제곱의 차를 구하고 원환의 넓이 공식에 대입했다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

큰 원의 반지름을 $R$, 작은 원의 반지름을 $r$이라 하자. 길이가 $6$인 현의 절반의 길이는 $3$이므로 피타고라스 정리에 의해 $R^2 - r^2 = 3^2 = 9$이다. 따라서 현이 지나간 도넛 모양 부분의 넓이는 $\pi R^2 - \pi r^2 = \pi(R^2 - r^2) = 9\pi$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점


**발문**

[서술형 1] 다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AB=10$, $\angle B=32^\circ$일 때, $x+y$의 값을 구하시오. (단, $\sin 32^\circ=0.53$, $\cos 32^\circ=0.85$, $\tan 32^\circ=0.62$로 계산하시오.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $13.8$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x = AC = 10\sin 32^\circ = 10 \times 0.53 = 5.3$이다.
2. $y = BC = 10\cos 32^\circ = 10 \times 0.85 = 8.5$이다.
3. 따라서 $x+y = 5.3 + 8.5 = 13.8$이다.
- 작성자 답: $13.8$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 1] 다음 그림과 같은 직각삼각형

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AB=10$, $\angle B=32^\circ$일 때」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변]
- 이유: 삼각비와 빗변의 길이를 이용해 변을 구하는 직각삼각형의 변 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_TABLE_LOOKUP
- 이유: 직각삼각형에서 주어진 각의 삼각비 근삿값을 대입해 변의 길이를 구하는 서술형 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각비의 정의와 소수 계산을 적용하는 난이도 2 서술형 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「[서술형 1] 다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AB=10$, $\angle B=32^\circ$일 때」
- goal: 직각삼각형←stem:「$x+y$의 값을 구하시오.」
- method: 직각삼각형(NAMED)←solution:「빗변이 $AB=10$이고 $\angle B=32^\circ$이므로」
- condition: 소수←stem:「$\sin 32^\circ=0.53$, $\cos 32^\circ=0.85$」

**how** 주어진 삼각비 값을 빗변에 곱하여 두 변의 길이를 구하고 합산했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

빗변이 $AB=10$이고 $\angle B=32^\circ$이므로 $$ x = AC = 10\sin 32^\circ = 10\times 0.53 = 5.3, \qquad y = BC = 10\cos 32^\circ = 10\times 0.85 = 8.5 $$ 따라서 $x+y = 5.3 + 8.5 = 13.8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

[서술형 2] 다음 직각삼각형 $ABC$($\angle ACB=90^\circ$)에서 점 $D$는 변 $BC$ 위의 점이고 $BD=4$, $\angle ABC=15^\circ$, $\angle ADC=30^\circ$일 때, $\tan 15^\circ$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2-\sqrt{3}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle BAD = 15^\circ$이므로 $\triangle ABD$는 이등변삼각형이고 $AD = BD = 4$이다.
2. 직각삼각형 $ACD$에서 $AC = 4\sin 30^\circ = 2, CD = 4\cos 30^\circ = 2\sqrt{3}$이다.
3. 따라서 $\tan 15^\circ = \dfrac{2}{4+2\sqrt{3}} = 2-\sqrt{3}$이다.
- 작성자 답: $2-\sqrt{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 직각삼각형 $ABC$($\angle ACB=90^\circ$)에서 점 $D$는 변 $BC$ 위의 점이고」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용]
- 이유: 도형의 각과 보조선을 활용하는 보조선 활용 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 이등변삼각형과 특수각 직각삼각형을 이용해 15도의 삼각비를 유도하는 서술형 유형이다. (문항 토큰 ABC)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 15도 삼각비의 기하적 유도와 분모 유리화를 서술하는 난이도 4 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 $ABC$($\angle ACB=90^\circ$)에서 점 $D$는 변 $BC$ 위의 점이고」
- goal: 직각삼각형←stem:「$\tan 15^\circ$의 값을 구하시오.」
- method: 이등변삼각형(NAMED)←solution:「따라서 $\triangle ABD$는 이등변삼각형이므로 $AD = BD = 4$이다.」
- condition: 유리화←solution:「$\tan 15^\circ = \dfrac{AC}{BC} = \dfrac{2}{4+2\sqrt{3}} = \dfrac{1}{2+\sqrt{3}} = 2-\sqrt{3}$」

**how** 외각과 이등변삼각형 성질로 보조변 길이를 구한 후 분모를 유리화해 tan 15도를 도출했다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ADB = 180^\circ - 30^\circ = 150^\circ$이므로 $\triangle ABD$에서 $\angle BAD = 180^\circ - 15^\circ - 150^\circ = 15^\circ$이다. 따라서 $\triangle ABD$는 이등변삼각형이므로 $AD = BD = 4$이다. 직각삼각형 $ACD$에서 $\angle ADC=30^\circ$이므로 $$ AC = 4\sin 30^\circ = 2, \qquad CD = 4\cos 30^\circ = 2\sqrt{3} $$ 따라서 $BC = BD + CD = 4 + 2\sqrt{3}$이므로 $$ \tan 15^\circ = \dfrac{AC}{BC} = \dfrac{2}{4+2\sqrt{3}} = \dfrac{1}{2+\sqrt{3}} = 2-\sqrt{3} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

[서술형 3] 다음 그림은 원 모양의 접시가 세 조각으로 깨진 것이다. 세 학생 A, B, C가 원의 중심을 찾아 깨지기 전의 접시 모양을 복원하려고 한다. 옳게 말한 학생을 찾고, 원의 중심을 찾는 방법을 설명하시오. 학생 A: 조각 ①은 너무 작아서 중심을 찾을 수 없어. 학생 B: 중심이 들어 있는 가장 큰 조각 ②만 있어야 중심을 찾을 수 있어. 학생 C: 세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 학생 C   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 옳게 말한 학생은 학생 C이다.
2. 원호 위의 세 점 $P, Q, R$을 잡아 두 현 $PQ, QR$을 긋고, 두 현의 수직이등분선의 교점을 찾으면 중심이 된다.
- 작성자 답: 학생 C → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 3] 다음 그림은 원 모양의 접시가 세 조각으로 깨진 것이다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 다음 그림은 원 모양의 접시가 세 조각으로 깨진 것이다.」
**RPM** M3-RPM-068 [원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심]
- 이유: 현의 수직이등분선과 원의 중심의 관계를 묻는 현의 수직이등분선과 중심 유형이다. (문항 토큰 PQ)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_PERP_BISECTOR
- 이유: 원의 중심 작도 원리인 현의 수직이등분선 성질을 실생활에 적용하는 서술형 유형이다. (문항 토큰 PQ)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기하학적 작도 원리를 논리적 문장으로 서술하는 난이도 2 문항이다. (문항 토큰 PQ)

**4칸**
- given: 선분←stem:「[서술형 3] 다음 그림은 원 모양의 접시가 세 조각으로 깨진 것이다.」
- goal: 선분←stem:「옳게 말한 학생을 찾고, 원의 중심을 찾는 방법을 설명하시오.」
- method: 수직이등분선(NAMED)←solution:「현 $PQ$의 수직이등분선과 현 $QR$의 수직이등분선은 모두 원래 원의 중심을 지나므로」
- condition: 선분←stem:「세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.」

**how** 현의 수직이등분선이 원의 중심을 지난다는 정리를 서술하고 올바른 학생 C를 선택했다. (문항 토큰 PQ)

<details><summary>저장 해설 (판정 검토용)</summary>

옳게 말한 학생은 학생 C이다. 한 조각의 원호 위에서 서로 다른 세 점 $P$, $Q$, $R$을 잡아 두 현 $PQ$, $QR$을 긋는다. 현 $PQ$의 수직이등분선과 현 $QR$의 수직이등분선은 모두 원래 원의 중심을 지나므로, 두 수직이등분선을 연장하여 만나는 교점이 원의 중심이 된다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점


**발문**

[서술형 4] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $AB \perp OM$, $OA=8,\mathrm{cm}$, $OM=4,\mathrm{cm}$, $DB=\sqrt{3},\mathrm{cm}$일 때, 두 원 사이의 어두운 고리 부분의 넓이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $21\pi,\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $OAM$에서 $AM = \sqrt{8^2-4^2} = 4\sqrt{3}$이므로 $MB = 4\sqrt{3}$이다.
2. $MD = 4\sqrt{3} - \sqrt{3} = 3\sqrt{3}$이다.
3. 작은 원 반지름의 제곱은 $OD^2 = 4^2 + (3\sqrt{3})^2 = 43$이다.
4. 따라서 고리 부분의 넓이는 $(64-43)\pi = 21\pi\text{cm}^2$이다.
- 작성자 답: $21\pi,\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형 4] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 서로 다른 두 원에서 $AB \perp OM$, $OA=8,\mathrm{cm}$, $OM=4,\mathrm{cm}$, $DB=\sqrt{3},\mathrm{cm}$일 때」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 동심원 고리 영역에서 현과 수선의 성질을 결합한 중심에서 현에 내린 수선 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 동심원에서 수직인 선분과 피타고라스 정리로 원환의 넓이를 구하는 서술형 유형이다. (문항 토큰 AB)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다단계 피타고라스 정리와 원환 넓이 계산을 결합한 난이도 4 서술형 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「반지름의 길이가 서로 다른 두 원에서 $AB \perp OM$, $OA=8,\mathrm{cm}$, $OM=4,\mathrm{cm}$, $DB=\sqrt{3},\mathrm{cm}$일 때」
- goal: 넓이←stem:「두 원 사이의 어두운 고리 부분의 넓이를 구하시오.」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $OAM$에서 $AM = \sqrt{8^2 - 4^2} = \sqrt{48} = 4\sqrt{3},\mathrm{cm}$이므로」
- condition: 선분←solution:「$AB \perp OM$이므로 $M$은 현 $AB$의 중점이고 $AM=MB$이다.」

**how** 직각삼각형 두 개에서 피타고라스 정리로 두 원의 반지름 제곱을 각각 구해 넓이 차를 계산했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$AB \perp OM$이므로 $M$은 현 $AB$의 중점이고 $AM=MB$이다. 직각삼각형 $OAM$에서 $AM = \sqrt{8^2 - 4^2} = \sqrt{48} = 4\sqrt{3},\mathrm{cm}$이므로 $MB=4\sqrt{3},\mathrm{cm}$이다. 점 $D$가 선분 $MB$ 위에 있으므로 $MD = MB - DB = 4\sqrt{3} - \sqrt{3} = 3\sqrt{3},\mathrm{cm}$이다. 직각삼각형 $OMD$에서 작은 원의 반지름의 제곱은 $$ OD^2 = OM^2 + MD^2 = 4^2 + (3\sqrt{3})^2 = 16 + 27 = 43 $$ 따라서 어두운 부분의 넓이는 $\pi \times OA^2 - \pi \times OD^2 = (64 - 43)\pi = 21\pi,\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
