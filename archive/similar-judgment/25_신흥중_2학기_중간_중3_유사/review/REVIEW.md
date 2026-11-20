# 검수 묶음 — 25_신흥중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 5)**
- 문항 24개 / 검사 PASS 19, FAIL 5, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 9, 2단계 13, 3단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 검사 코드: CHOICE_ORDER
- **Q5**: 검사 코드: CHOICE_ORDER
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q13**: 검사 코드: CHOICE_ORDER
- **Q18**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 직각삼각형 $DEF$에서 옳지 않은 것은?

**보기** ① $\sin D=\dfrac{p}{r}$  ② $\cos D=\dfrac{r}{q}$  ③ $\sin E=\dfrac{q}{r}$  ④ $\tan D=\dfrac{p}{q}$  ⑤ $\tan E=\dfrac{q}{p}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 DEF에서 직각은 꼭짓점 F에 있으므로 빗변은 DE = r이다.
2. 2) 각 D를 기준으로 대변은 EF = p, 이웃한 변은 DF = q이므로 sin D = p/r, cos D = q/r, tan D = p/q이다.
3. 3) 각 E를 기준으로 대변은 DF = q, 이웃한 변은 EF = p이므로 sin E = q/r, tan E = q/p이다.
4. 4) 따라서 cos D = r/q라고 한 ②는 옳지 않다.
5. 5) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 직각삼각형 $DEF$에서 옳지 않은 것은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형 DEF에서 빗변 r과 각 D, E의 대변 p, q에 대한 삼각비 정의 sin, cos, tan의 식을 판별하는 M3-RPM-055 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 직각삼각형 DEF의 변 p, q, r과 각 D의 코사인 정의 cos D = q/r과의 일치 여부를 판별하는 TPL_TRIG_RATIO_BASIC_RELATION 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 DEF의 세 변 p, q, r을 보고 삼각비의 기본 정의를 대조하는 1단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 $DEF$에서 옳지 않은 것은?」
- goal: 삼각비←choices:「$\cos D=\dfrac{r}{q}$」
- method: 빗변(NAMED)←solution:「꼭짓점 $F$에 있으므로 빗변은 $DE=r$이다.」
- condition: 변←solution:「이웃한 변은 $DF=q$이므로」

**how** 직각삼각형 DEF에서 빗변 r과 각 D의 이웃변 q에 대해 cos D = q/r이어야 하므로 r/q라 한 보기 ②가 옳지 않음을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각은 꼭짓점 $F$에 있으므로 빗변은 $DE=r$이다. 각 $D$를 기준으로 보면 대변은 $EF=p$, 이웃한 변은 $DF=q$이므로 $$ \sin D=\dfrac{p}{r}, \quad \cos D=\dfrac{q}{r}, \quad \tan D=\dfrac{p}{q} $$ 각 $E$를 기준으로 보면 대변은 $DF=q$, 이웃한 변은 $EF=p$이므로 $$ \sin E=\dfrac{q}{r}, \quad \tan E=\dfrac{q}{p} $$ 따라서 $\cos D=\dfrac{r}{q}$라고 한 ②가 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

다음 중 계산 결과가 가장 큰 것은?

**보기** ① $\sin 30^\circ \div \cos 60^\circ$  ② $\tan 45^\circ \times \sin 60^\circ$  ③ $\cos 30^\circ \times \tan 30^\circ$  ④ $\tan 60^\circ \div \sin 30^\circ$  ⑤ $\sin 90^\circ + \cos 0^\circ - \tan 0^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) ① sin 30도 / cos 60도 = (1/2) / (1/2) = 1이다.
2. 2) ② tan 45도 * sin 60도 = 1 * (sqrt(3)/2) = sqrt(3)/2이다.
3. 3) ③ cos 30도 * tan 30도 = (sqrt(3)/2) * (sqrt(3)/3) = 1/2이다.
4. 4) ④ tan 60도 / sin 30도 = sqrt(3) / (1/2) = 2*sqrt(3) = sqrt(12)이다.
5. 5) ⑤ sin 90도 + cos 0도 - tan 0도 = 1 + 1 - 0 = 2 = sqrt(4)이다.
6. 6) 2*sqrt(3) = sqrt(12) > 2이므로 결과가 가장 큰 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 계산 결과가 가장 큰 것은?」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산]
- 이유: 30도, 45도, 60도, 90도, 0도의 특수각 삼각비 값을 대입 계산하여 최댓값 2*sqrt(3)을 산출하는 M3-RPM-058 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각 30도, 60도 삼각비 값 계산 결과 1, 2, 2*sqrt(3)의 크기를 비교하는 TPL_TRIG_RATIO_SPECIAL_ANGLE 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 특수각 30도, 45도, 60도의 삼각비 값을 바로 대입하여 사칙연산을 수행하는 1단계 문항이다.

**4칸**
- given: 삼각비←choices:「$\sin 30^\circ \div \cos 60^\circ$」
- goal: 최댓값←stem:「계산 결과가 가장 큰 것은?」
- method: 특수각(NAMED)←solution:「특수각의 삼각비 값을 각각 대입하여 계산한다.」
- condition: 각←choices:「$\tan 60^\circ \div \sin 30^\circ$」

**how** 특수각 계산 결과 ④는 2*sqrt(3) = sqrt(12)로 다른 보기들(1, 2 등)보다 크므로 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

특수각의 삼각비 값을 각각 대입하여 계산한다. $$ \begin{aligned} ①; \sin 30^\circ \div \cos 60^\circ &= \dfrac{1}{2} \div \dfrac{1}{2} = 1 \ ②; \tan 45^\circ \times \sin 60^\circ &= 1 \times \dfrac{\sqrt{3}}{2} = \dfrac{\sqrt{3}}{2} \ ③; \cos 30^\circ \times \tan 30^\circ &= \dfrac{\sqrt{3}}{2} \times \dfrac{\sqrt{3}}{3} = \dfrac{1}{2} \ ④; \tan 60^\circ \div \sin 30^\circ &= \sqrt{3} \div \dfrac{1}{2} = 2\sqrt{3} \ ⑤; \sin 90^\circ + \cos 0^\circ - \tan 0^\circ &= 1 + 1 - 0 = 2 \end{aligned} $$ $2\sqrt{3}=\sqrt{12}>\sqrt{4}=2$이므로 계산 결과가 가장 큰 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$45^\circ < x < 90^\circ$일 때, 다음 식을 간단히 하면? $$\sqrt{(1-\tan x)^2}+\sqrt{(1+\tan x)^2}$$

**보기** ① $2\tan x$  ② $-2\tan x$  ③ $2$  ④ $-2$  ⑤ $0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 45도 < x < 90도 범위에서 tan 45도 = 1이므로 tan x > 1이다.
2. 2) 따라서 1 - tan x < 0이고 1 + tan x > 0이다.
3. 3) sqrt((1 - tan x)^2) = |1 - tan x| = tan x - 1이다.
4. 4) sqrt((1 + tan x)^2) = |1 + tan x| = 1 + tan x이다.
5. 5) 식을 합치면 (tan x - 1) + (1 + tan x) = 2*tan x이다.
6. 6) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$45^\circ < x < 90^\circ$일 때, 다음 식을 간단히 하면? $$\sqrt{(1-\tan x)^2}+\sqrt{(1+\tan x)^2}$$」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 45도 < x < 90도에서 tan x > 1임을 이용하여 근호 안의 식 1 - tan x의 음수 부호를 판별하고 식을 2*tan x로 간단히 하는 M3-RPM-056 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: 각의 범위 45도 < x < 90도에 따른 탄젠트 부호를 판별하여 근호 식을 2*tan x로 대수적으로 단순화하는 TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 범위 45도 < x < 90도에서 tan x > 1을 파악하고 근호 제곱의 부호를 결정하여 2*tan x로 정리하는 2단계 문항이다.

**4칸**
- given: 범위←stem:「$45^\circ < x < 90^\circ$일 때,」
- goal: 무리식←stem:「다음 식을 간단히 하면? $$\sqrt{(1-\tan x)^2}+\sqrt{(1+\tan x)^2}$$」
- method: 절댓값(NAMED)←solution:「근호 안의 제곱을 절댓값으로 정리하면」
- condition: 근호←stem:「$$\sqrt{(1-\tan x)^2}+\sqrt{(1+\tan x)^2}$$」

**how** 45도 < x < 90도에서 tan x > 1이므로 1 - tan x < 0에서 (tan x - 1) + (1 + tan x) = 2*tan x임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$45^\circ < x < 90^\circ$이면 $\tan x > 1$이므로 $$ 1-\tan x < 0, \qquad 1+\tan x > 0 $$ 이다. 근호 안의 제곱을 절댓값으로 정리하면 $$ \begin{aligned} \sqrt{(1-\tan x)^2}+\sqrt{(1+\tan x)^2} &= |1-\tan x|+|1+\tan x| \ &= (\tan x - 1) + (1 + \tan x) \ &= 2\tan x \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 반지름의 길이가 $1$인 사분원과 $\triangle ABC$, $\triangle ADE$를 그렸다. $DE=1.3764$일 때, 아래의 삼각비의 표를 이용하여 $\cos y^\circ$의 값을 구하면?

| 각도 | $\sin$ | $\cos$ | $\tan$ |
| :---: | :---: | :---: | :---: |
| $36^\circ$ | $0.5878$ | $0.8090$ | $0.7265$ |
| $37^\circ$ | $0.6018$ | $0.7986$ | $0.7536$ |
| $53^\circ$ | $0.7986$ | $0.6018$ | $1.3270$ |
| $54^\circ$ | $0.8090$ | $0.5878$ | $1.3764$ |

**보기** ① $0.5878$  ② $0.7265$  ③ $0.8090$  ④ $0.7986$  ⑤ $0.6018$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 사분원의 반지름이 1이므로 AD = 1이다.
2. 2) 직각삼각형 ADE에서 tan x = DE / AD = 1.3764 / 1 = 1.3764이다.
3. 3) 표에서 tan 54도 = 1.3764이므로 x = 54이다.
4. 4) 직각삼각형 ADE에서 y = 90 - 54 = 36이다.
5. 5) 표에서 cos 36도 = 0.8090이다.
6. 6) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 반지름의 길이가 $1$인 사분원과 $\triangle ABC$, $\triangle ADE$를 그렸다. $DE=1.3764$일 때, 아래의 삼각비의 표를 이용하여 $\cos y^\circ$의 값을 구하면?」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이]
- 이유: 반지름 1인 사분원에서 DE = 1.3764로부터 tan 54도와 각 y = 36도를 찾고 표를 읽어 cos 36도 = 0.8090을 구하는 M3-RPM-060 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_TABLE_LOOKUP
- 이유: 사분원의 삼각비 기하 모형과 삼각비 표를 결합하여 DE = 1.3764에서 cos 36도 = 0.8090을 찾는 TPL_TRIG_RATIO_TABLE_LOOKUP 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분원에서 탄젠트 값 1.3764로 각도 54도를 구하고 여각 y = 36도의 코사인 값 0.8090을 표에서 찾는 2단계 문항이다.

**4칸**
- given: 사분원←stem:「반지름의 길이가 $1$인 사분원과」
- goal: 코사인←stem:「$\cos y^\circ$의 값을 구하면?」
- method: 삼각비표(NAMED)←stem:「아래의 삼각비의 표를 이용하여」
- condition: 길이←stem:「$DE=1.3764$일 때,」

**how** tan x = 1.3764에서 x = 54도를 얻고 여각 y = 36도에 대한 cos 36도 = 0.8090임을 표에서 확인하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사분원의 반지름의 길이가 $1$이므로 $AD=1$이다. 직각삼각형 $ADE$에서 $$ \tan x^\circ = \dfrac{DE}{AD} = \dfrac{1.3764}{1} = 1.3764 $$ 삼각비의 표에서 $\tan 54^\circ = 1.3764$이므로 $x=54$이다. 한편 $BC \parallel DE$이고 $AD \perp DE$이므로 직각삼각형 $ADE$에서 $$ y^\circ = \angle AED = 90^\circ - 54^\circ = 36^\circ $$ 따라서 $\cos y^\circ = \cos 36^\circ = 0.8090$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 한 모서리의 길이가 $6,\mathrm{cm}$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$는 $\triangle BCD$의 무게중심이다. $\angle ADH=x^\circ$라 할 때, $\cos x^\circ$의 값은?

**보기** ① $\dfrac{\sqrt{2}}{3}$  ② $\dfrac{\sqrt{2}}{2}$  ③ $\dfrac{\sqrt{6}}{3}$  ④ $\dfrac{1}{3}$  ⑤ $\dfrac{\sqrt{3}}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 한 모서리가 6 cm인 정사면체 ABCD의 밑면 BCD는 한 변이 6 cm인 정삼각형이다.
2. 2) 변 BC의 중점을 M이라 하면 높이 DM = sqrt(6^2 - 3^2) = 3*sqrt(3) cm이다.
3. 3) 점 H는 무게중심이므로 DH = (2/3) * DM = (2/3) * 3*sqrt(3) = 2*sqrt(3) cm이다.
4. 4) AH perp 밑면이므로 직각삼각형 ADH에서 cos x = DH / AD = 2*sqrt(3) / 6 = sqrt(3)/3이다.
5. 5) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 한 모서리의 길이가 $6,\mathrm{cm}$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$는 $\triangle BCD$의 무게중심이다. $\angle ADH=x^\circ$라 할 때, $\cos x^\circ$의 값은?」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변]
- 이유: 모서리 6 cm인 정사면체에서 무게중심 DH = 2*sqrt(3) cm를 구하고 직각삼각형 ADH에서 cos x = sqrt(3)/3을 구하는 M3-RPM-059 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 정사면체 ABCD 꼭짓점 A에서 내린 수선과 밑면 BCD의 무게중심 H가 이루는 직각삼각형 ADH에서 cos x = sqrt(3)/3을 구하는 TPL_TRIG_APPLICATION_DIRECT_MEASURE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 정삼각형 높이 3*sqrt(3)과 무게중심 2:1 내분으로 DH = 2*sqrt(3)을 구하고 빗변 6으로 코사인 sqrt(3)/3을 구하는 2단계 문항이다.

**4칸**
- given: 정사면체←stem:「한 모서리의 길이가 $6,\mathrm{cm}$인 정사면체 $ABCD$의」
- goal: 코사인←stem:「$\cos x^\circ$의 값은?」
- method: 무게중심(NAMED)←stem:「내린 수선의 발 $H$는 $\triangle BCD$의 무게중심이다.」
- condition: 길이←stem:「한 모서리의 길이가 $6,\mathrm{cm}$인」

**how** 밑면 정삼각형의 높이 3*sqrt(3)과 무게중심 DH = 2*sqrt(3)에서 cos x = (2*sqrt(3))/6 = sqrt(3)/3임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

밑면 $BCD$는 한 변의 길이가 $6,\mathrm{cm}$인 정삼각형이다. 변 $BC$의 중점을 $M$이라 하면 $CM=3,\mathrm{cm}$이므로 정삼각형의 높이 $DM$은 $$ DM = \sqrt{6^2-3^2} = 3\sqrt{3},\mathrm{cm} $$ 점 $H$는 $\triangle BCD$의 무게중심이므로 중선 $DM$을 꼭짓점 $D$로부터 $2:1$로 나눈다. $$ DH = \dfrac{2}{3}DM = \dfrac{2}{3}\times 3\sqrt{3} = 2\sqrt{3},\mathrm{cm} $$ $AH$는 밑면에 수직이므로 직각삼각형 $ADH$에서 $$ \cos x^\circ = \dfrac{DH}{AD} = \dfrac{2\sqrt{3}}{6} = \dfrac{\sqrt{3}}{3} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

다음 그림과 같은 직각삼각형 $ABC$에서 $AB \perp CD$, $BC \perp DE$이고, $AB=12,\mathrm{cm}$, $\angle ABC=30^\circ$일 때, $BE$의 길이는?

**보기** ① $4\sqrt{3},\mathrm{cm}$  ② $\dfrac{9\sqrt{3}}{2},\mathrm{cm}$  ③ $5\sqrt{3},\mathrm{cm}$  ④ $\dfrac{9\sqrt{2}}{2},\mathrm{cm}$  ⑤ $6\sqrt{2},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 ABC에서 BC = AB * cos 30도 = 12 * (sqrt(3)/2) = 6*sqrt(3) cm이다.
2. 2) 직각삼각형 BCD에서 BD = BC * cos 30도 = 6*sqrt(3) * (sqrt(3)/2) = 9 cm이다.
3. 3) 직각삼각형 BDE에서 BE = BD * cos 30도 = 9 * (sqrt(3)/2) = (9*sqrt(3)/2) cm이다.
4. 4) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 직각삼각형 $ABC$에서 $AB \perp CD$, $BC \perp DE$이고, $AB=12,\mathrm{cm}$, $\angle ABC=30^\circ$일 때, $BE$의 길이는?」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변]
- 이유: 직각삼각형 ABC, BCD, BDE에서 cos 30도를 연쇄적으로 곱해 AB = 12 cm로부터 BE = 9*sqrt(3)/2 cm를 구하는 M3-RPM-059 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_CHAINED_MEASURE
- 이유: 연속된 수선의 발에 의해 형성된 직각삼각형에서 cos 30도를 연쇄 적용하여 선분 BE = 9*sqrt(3)/2 cm를 구하는 TPL_TRIG_APPLICATION_CHAINED_MEASURE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 직각삼각형에서 cos 30도를 3회 연속 적용하여 변의 길이 9*sqrt(3)/2를 계산하는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「다음 그림과 같은 직각삼각형 $ABC$에서」
- goal: 길이←stem:「$BE$의 길이는?」
- method: 코사인(NAMED)←solution:「BC = AB\cos 30^\circ」
- condition: 수직←stem:「$AB \perp CD$, $BC \perp DE$이고,」

**how** 직각삼각형 ABC에서 BC = 6*sqrt(3), BCD에서 BD = 9, BDE에서 BE = 9*sqrt(3)/2 cm임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ABC$에서 $\angle C=90^\circ$이므로 $$ BC = AB\cos 30^\circ = 12\times\dfrac{\sqrt{3}}{2} = 6\sqrt{3},\mathrm{cm} $$ $AB \perp CD$이므로 직각삼각형 $BCD$에서 $\angle CBD=30^\circ$이다. $$ BD = BC\cos 30^\circ = 6\sqrt{3}\times\dfrac{\sqrt{3}}{2} = 9,\mathrm{cm} $$ 또 $BC \perp DE$이므로 직각삼각형 $BDE$에서도 $\angle DBE=30^\circ$이다. $$ BE = BD\cos 30^\circ = 9\times\dfrac{\sqrt{3}}{2} = \dfrac{9\sqrt{3}}{2},\mathrm{cm} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

일차방정식 $3x-4y+12=0$의 그래프가 $x$축과 이루는 예각의 크기를 $a^\circ$라 할 때, $\sin a^\circ + \cos a^\circ$의 값은?

**보기** ① $\dfrac{4}{5}$  ② $1$  ③ $\dfrac{6}{5}$  ④ $\dfrac{7}{5}$  ⑤ $\dfrac{8}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 일차방정식 3x - 4y + 12 = 0을 y에 관해 정리하면 y = (3/4)x + 3이므로 기울기는 3/4이다.
2. 2) x축과 이루는 예각 a에 대해 tan a = 3/4이다.
3. 3) 밑변 4, 높이 3인 직각삼각형에서 빗변은 sqrt(4^2 + 3^2) = 5이다.
4. 4) sin a = 3/5, cos a = 4/5이므로 sin a + cos a = 3/5 + 4/5 = 7/5이다.
5. 5) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $3x-4y+12=0$의 그래프가 $x$축과 이루는 예각의 크기를 $a^\circ$라 할 때, $\sin a^\circ + \cos a^\circ$의 값은?」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 일차방정식 3x - 4y + 12 = 0의 기울기 3/4으로부터 tan a = 3/4을 구하고 빗변 5인 직각삼각형에서 sin a + cos a = 7/5을 산출하는 M3-RPM-056 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 일차방정식 3x - 4y + 12 = 0의 기울기 3/4에서 탄젠트를 얻고 기하학적으로 sin, cos을 유도하여 합 7/5을 계산하는 TPL_TRIG_RATIO_GEOMETRIC_DERIVATION 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 일차방정식 3x - 4y + 12 = 0에서 기울기 3/4을 찾고 피타고라스 정리로 빗변 5를 구해 삼각비 합 7/5을 구하는 2단계 문항이다.

**4칸**
- given: 일차방정식←stem:「일차방정식 $3x-4y+12=0$의」
- goal: 합←solution:「\sin a^\circ + \cos a^\circ = \dfrac{3}{5} + \dfrac{4}{5} = \dfrac{7}{5}」
- method: 기울기(NAMED)←solution:「직선의 기울기는 $\dfrac{3}{4}$이다.」
- condition: 예각←stem:「그래프가 $x$축과 이루는 예각의 크기를 $a^\circ$라 할 때,」

**how** 일차방정식 3x - 4y + 12 = 0의 기울기 3/4에서 빗변 5인 직각삼각형을 얻어 sin a + cos a = 7/5임을 확인해 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차방정식을 $y$에 관하여 정리하면 $$ y = \dfrac{3}{4}x + 3 $$ 이므로 직선의 기울기는 $\dfrac{3}{4}$이다. 따라서 $\tan a^\circ = \dfrac{3}{4}$이다. 밑변의 길이가 $4$, 높이가 $3$인 직각삼각형에서 빗변의 길이는 $\sqrt{4^2+3^2}=5$이므로 $$ \sin a^\circ = \dfrac{3}{5}, \qquad \cos a^\circ = \dfrac{4}{5} $$ 이다. 그러므로 $$ \sin a^\circ + \cos a^\circ = \dfrac{3}{5} + \dfrac{4}{5} = \dfrac{7}{5} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림과 같이 $\triangle ABC$에서 $AB=6,\mathrm{cm}$, $AC=8,\mathrm{cm}$, $\angle B=60^\circ$일 때, $BC$의 길이는?

**보기** ① $(3+\sqrt{37}),\mathrm{cm}$  ② $(3+\sqrt{35}),\mathrm{cm}$  ③ $(4+\sqrt{37}),\mathrm{cm}$  ④ $(3+3\sqrt{3}),\mathrm{cm}$  ⑤ $(6+\sqrt{37}),\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자.
2. 2) 직각삼각형 ABH에서 BH = 6 * cos 60도 = 3 cm, AH = 6 * sin 60도 = 3*sqrt(3) cm이다.
3. 3) 직각삼각형 AHC에서 피타고라스 정리에 의해 HC = sqrt(8^2 - (3*sqrt(3))^2) = sqrt(64 - 27) = sqrt(37) cm이다.
4. 4) 따라서 BC = BH + HC = (3 + sqrt(37)) cm이다.
5. 5) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\triangle ABC$에서 $AB=6,\mathrm{cm}$, $AC=8,\mathrm{cm}$, $\angle B=60^\circ$일 때, $BC$의 길이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 삼각형 ABC에서 꼭짓점 A의 수선으로 높이 3*sqrt(3) cm를 구하고 피타고라스 정리로 선분 BC = (3 + sqrt(37)) cm를 구하는 M3-RPM-061 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_SHARED_HEIGHT
- 이유: 수선의 발 H를 내려 공유 높이 AH = 3*sqrt(3) cm를 삼각비로 구하고 두 직각삼각형을 결합해 BC = 3 + sqrt(37) cm를 도출하는 TPL_TRIG_APPLICATION_SHARED_HEIGHT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 수선 AH를 도입하여 삼각비로 BH = 3, AH = 3*sqrt(3)을 구하고 피타고라스 정리로 HC = sqrt(37)을 합성하는 2단계 문항이다.

**4칸**
- given: 삼각형←stem:「다음 그림과 같이 $\triangle ABC$에서」
- goal: 길이←stem:「$BC$의 길이는?」
- method: 수선(NAMED)←solution:「꼭짓점 $A$에서 변 $BC$에 내린 수선의 발을 $H$라 하자.」
- condition: 각←stem:「$\angle B=60^\circ$일 때,」

**how** 수선 AH = 3*sqrt(3), BH = 3을 구하고 피타고라스 정리로 HC = sqrt(37)을 얻어 BC = 3 + sqrt(37) cm임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

꼭짓점 $A$에서 변 $BC$에 내린 수선의 발을 $H$라 하자. 직각삼각형 $ABH$에서 $$ \begin{aligned} BH &= AB\cos 60^\circ = 6\times\dfrac{1}{2} = 3,\mathrm{cm} \ AH &= AB\sin 60^\circ = 6\times\dfrac{\sqrt{3}}{2} = 3\sqrt{3},\mathrm{cm} \end{aligned} $$ 직각삼각형 $AHC$에서 피타고라스 정리에 의해 $$ HC = \sqrt{AC^2-AH^2} = \sqrt{8^2-(3\sqrt{3})^2} = \sqrt{64-27} = \sqrt{37},\mathrm{cm} $$ 따라서 $BC = BH + HC = (3+\sqrt{37}),\mathrm{cm}$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 $\triangle ABC$에서 $AB=4\sqrt{3}$, $BC=9$, $\angle B=60^\circ$일 때, $\triangle ABC$의 넓이는?

**보기** ① $18$  ② $18\sqrt{3}$  ③ $24$  ④ $24\sqrt{3}$  ⑤ $27$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 삼각형 ABC에서 두 변 AB = 4*sqrt(3), BC = 9와 끼인각 B = 60도가 주어졌다.
2. 2) 삼각형의 넓이 공식 S = (1/2) * AB * BC * sin B를 적용한다.
3. 3) S = (1/2) * 4*sqrt(3) * 9 * sin 60도 = (1/2) * 4*sqrt(3) * 9 * (sqrt(3)/2)이다.
4. 4) 계산하면 S = 27이다.
5. 5) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 $\triangle ABC$에서 $AB=4\sqrt{3}$, $BC=9$, $\angle B=60^\circ$일 때, $\triangle ABC$의 넓이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 두 변 4*sqrt(3), 9와 끼인각 60도의 삼각형 넓이 공식 (1/2)*a*b*sin B를 적용하여 넓이 27을 구하는 M3-RPM-061 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 두 변과 끼인각 60도에 대한 삼각형 넓이 공식을 직접 적용하여 넓이 27을 도출하는 TPL_TRIG_APPLICATION_DIRECT_MEASURE 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 삼각형의 넓이 공식에 두 변의 길이와 sin 60도를 대입하여 바로 계산하는 1단계 기본 문항이다.

**4칸**
- given: 삼각형←stem:「다음 $\triangle ABC$에서」
- goal: 넓이←stem:「$\triangle ABC$의 넓이는?」
- method: 삼각형넓이공식(NAMED)←solution:「\dfrac{1}{2}\times AB\times BC\times\sin B」
- condition: 길이←stem:「$AB=4\sqrt{3}$, $BC=9$,」

**how** 삼각형 넓이 공식 S = (1/2)*4*sqrt(3)*9*sin 60도에서 S = 27임을 계산하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 변 $AB$, $BC$의 길이와 그 끼인각 $B$의 크기가 주어졌으므로 $\triangle ABC$의 넓이는 $$ \begin{aligned} \triangle ABC &= \dfrac{1}{2}\times AB\times BC\times\sin B \ &= \dfrac{1}{2}\times 4\sqrt{3}\times 9\times\sin 60^\circ \ &= \dfrac{1}{2}\times 4\sqrt{3}\times 9\times\dfrac{\sqrt{3}}{2} \ &= 27 \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점


**발문**

다음 그림과 같이 정사각형 $ABCD$에서 두 점 $E$, $F$는 각각 변 $AD$, $CD$의 중점이다. $\angle EBF=x^\circ$라 할 때, $\sin x$의 값은?

**보기** ① $\dfrac{2}{5}$  ② $\dfrac{1}{2}$  ③ $\dfrac{3}{5}$  ④ $\dfrac{3}{4}$  ⑤ $\dfrac{4}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 정사각형 ABCD의 한 변의 길이를 2라 두면 AE = ED = CF = FD = 1이다.
2. 2) 직각삼각형 ABE, BCF에서 BE = BF = sqrt(2^2 + 1^2) = sqrt(5)이다.
3. 3) 삼각형 EBF의 넓이는 전체 정사각형 넓이 4에서 세 직각삼각형 넓이 1, 1/2, 1을 뺀 3/2이다.
4. 4) 삼각형 EBF의 넓이는 (1/2) * BE * BF * sin x이므로 (1/2) * 5 * sin x = 3/2이다.
5. 5) 따라서 sin x = 3/5이다.
6. 6) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 정사각형 $ABCD$에서 두 점 $E$, $F$는 각각 변 $AD$, $CD$의 중점이다. $\angle EBF=x^\circ$라 할 때, $\sin x$의 값은?」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이]
- 이유: 정사각형 ABCD 내부 삼각형 EBF의 넓이 3/2과 두 변 sqrt(5)를 삼각비 넓이 공식에 대입하여 sin x = 3/5을 구하는 M3-RPM-062 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 정사각형 여사건 넓이 3/2과 두 변 BE = BF = sqrt(5)로부터 sin x = 3/5을 산출하는 TPL_TRIG_APPLICATION_DIRECT_MEASURE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 4 → 2**
- 이유: 정사각형 ABCD에서 여사건으로 삼각형 EBF 넓이 3/2을 구하고 변의 길이 sqrt(5)와 넓이 공식을 결합해 sin x = 3/5을 구하는 2단계 문항이다.

**4칸**
- given: 정사각형←stem:「다음 그림과 같이 정사각형 $ABCD$에서」
- goal: 사인←stem:「$\sin x$의 값은?」
- method: 중점(NAMED)←stem:「두 점 $E$, $F$는 각각 변 $AD$, $CD$의 중점이다.」
- condition: 변←stem:「각각 변 $AD$, $CD$의 중점이다.」

**how** 한 변 2인 정사각형에서 삼각형 EBF 넓이 3/2과 두 변 sqrt(5)로부터 (5/2)*sin x = 3/2에서 sin x = 3/5임을 확인하여 정답 ③로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형 $ABCD$의 한 변의 길이를 $2$라 두면 $AE=ED=CF=FD=1$이다. 직각삼각형 $ABE$, $BCF$에서 피타고라스 정리에 의해 $$ BE = BF = \sqrt{2^2+1^2} = \sqrt{5} $$ 정사각형 $ABCD$의 넓이에서 세 직각삼각형 $ABE$, $EDF$, $BCF$의 넓이를 빼면 $$ \triangle EBF = 4 - \dfrac{1}{2}(2\times 1) - \dfrac{1}{2}(1\times 1) - \dfrac{1}{2}(2\times 1) = \dfrac{3}{2} $$ 한편 $\triangle EBF$의 넓이는 $\dfrac{1}{2}\times BE\times BF\times\sin x$이므로 $$ \dfrac{1}{2}\times\sqrt{5}\times\sqrt{5}\times\sin x = \dfrac{3}{2} \implies \dfrac{5}{2}\sin x = \dfrac{3}{2} $$ 따라서 $\sin x = \dfrac{3}{5}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점


**발문**

다음 그림과 같이 $\angle B=75^\circ$이고, 밑변 $BC$의 길이가 $6\sqrt{2}$인 이등변삼각형 $ABC$($AB=AC$)에서 $AB$의 길이는?

**보기** ① $6+3\sqrt{3}$  ② $6+6\sqrt{3}$  ③ $12\sqrt{2}$  ④ $6+6\sqrt{2}$  ⑤ $12+3\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 이등변삼각형 ABC에서 AB = AC이므로 각 C = 75도, 각 A = 30도이다.
2. 2) 수선 AD를 내리면 BD = 3*sqrt(2)이고 각 BAD = 15도이다.
3. 3) 보조선 점 E를 잡아 직각이등변삼각형 BDE에서 BE = 6, 각 ABE = 30도를 유도한다.
4. 4) 직각삼각형 ABF에서 AF = 3*(sqrt(3) + 1)을 구한다.
5. 5) 따라서 AB = 2*AF = 6 + 6*sqrt(3)이다.
6. 6) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle B=75^\circ$이고, 밑변 $BC$의 길이가 $6\sqrt{2}$인 이등변삼각형 $ABC$($AB=AC$)에서 $AB$의 길이는?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 이등변삼각형 ABC에서 밑각 75도와 밑변 6*sqrt(2)에 보조선을 내려 특수각 삼각비로 AB = 6 + 6*sqrt(3)을 구하는 M3-RPM-061 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_SHARED_HEIGHT
- 이유: 밑각 75도 이등변삼각형에서 공유 수선을 활용해 변의 길이 AB = 6 + 6*sqrt(3)을 유도하는 TPL_TRIG_APPLICATION_SHARED_HEIGHT 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 75도 특수각 분할 및 다단계 보조선 직각삼각형을 활용해 빗변 6 + 6*sqrt(3)을 복원하는 3단계 심화 문항이다.

**4칸**
- given: 이등변삼각형←stem:「이등변삼각형 $ABC$($AB=AC$)에서」
- goal: 길이←stem:「$AB$의 길이는?」
- method: 수선(NAMED)←solution:「꼭짓점 $A$에서 $BC$에 내린 수선의 발을 $D$라 하면」
- condition: 각←stem:「$\angle B=75^\circ$이고,」

**how** 이등변삼각형 ABC에서 75도 각을 45도와 30도로 분할하는 보조선을 적용해 AB = 6 + 6*sqrt(3)임을 유도하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$AB=AC$이므로 $\angle C=75^\circ$, $\angle A=30^\circ$이다. 꼭짓점 $A$에서 $BC$에 내린 수선의 발을 $D$라 하면 $BD=3\sqrt{2}$, $\angle BAD=15^\circ$이다. 선분 $AD$ 위에 $DE=BD=3\sqrt{2}$가 되도록 점 $E$를 잡으면 $\triangle BDE$는 직각이등변삼각형이므로 $$ \angle DBE=45^\circ, \quad BE=3\sqrt{2}\times\sqrt{2}=6, \quad \angle ABE=75^\circ-45^\circ=30^\circ $$ 또 $\angle AEB=180^\circ-45^\circ=135^\circ$이다. 꼭짓점 $A$에서 $BE$의 연장선에 내린 수선의 발을 $F$라 하자. $\angle AEF=45^\circ$이므로 직각삼각형 $AEF$에서 $AF=EF$이다. 직각삼각형 $ABF$에서 $\angle ABF=30^\circ$이므로 $AB=2AF$, $BF=\sqrt{3}AF$이다. $BF=BE+EF=6+AF$이므로 $$ \sqrt{3}AF = 6 + AF \implies (\sqrt{3}-1)AF = 6 \implies AF = \dfrac{6}{\sqrt{3}-1} = 3(\sqrt{3}+1) $$ 따라서 $AB = 2AF = 6+6\sqrt{3}$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

다음 그림과 같이 $\angle A=90^\circ$, $\angle B=30^\circ$, $AC=5,\mathrm{m}$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 $BC$에 내린 수선의 발을 $D$라 할 때, 옳지 않은 것은?

**보기** ① $AD=AC\sin 60^\circ$  ② $CD=AC\cos 60^\circ$  ③ $BD=AB\cos 30^\circ$  ④ $CD=AD\tan 60^\circ$  ⑤ $BC=10,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 ABC에서 각 A = 90도, 각 B = 30도이므로 각 C = 60도이다.
2. 2) BC = AC / sin 30도 = 5 / (1/2) = 10 m이다. (⑤ 옳음)
3. 3) 직각삼각형 ACD에서 AD = AC * sin 60도, CD = AC * cos 60도이다. (①, ② 옳음)
4. 4) 직각삼각형 ABD에서 BD = AB * cos 30도이다. (③ 옳음)
5. 5) 직각삼각형 ACD에서 tan 60도 = AD / CD이므로 CD = AD / tan 60도이다. 따라서 ④는 옳지 않다.
6. 6) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle A=90^\circ$, $\angle B=30^\circ$, $AC=5,\mathrm{m}$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 $BC$에 내린 수선의 발을 $D$라 할 때, 옳지 않은 것은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형 ABC와 ACD에서 sin, cos, tan를 변의 비로 표현하여 tan 60도 = AD/CD로부터 CD = AD/tan 60도임을 검증하는 M3-RPM-055 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 직각삼각형 ACD에서 각 C = 60도의 탄젠트 정의 tan 60도 = AD/CD와의 불일치를 식별하는 TPL_TRIG_RATIO_BASIC_RELATION 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 직각삼각형 내에서 30도와 60도 각에 대한 삼각비 기본 관계식을 점검하는 1단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$의 꼭짓점 $A$에서」
- goal: 진술←stem:「옳지 않은 것은?」
- method: 탄젠트(NAMED)←solution:「직각삼각형 $ACD$에서 $\tan 60^\circ = \dfrac{AD}{CD}$이므로」
- condition: 수선←stem:「꼭짓점 $A$에서 $BC$에 내린 수선의 발을 $D$라 할 때,」

**how** 직각삼각형 ACD에서 tan 60도 = AD / CD이므로 CD = AD / tan 60도이어야 하므로 보기 ④가 옳지 않음을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A=90^\circ$, $\angle B=30^\circ$이므로 $\angle C=60^\circ$이다. 직각삼각형 $ABC$에서 $BC = \dfrac{AC}{\sin 30^\circ} = \dfrac{5}{1/2} = 10,\mathrm{m}$이므로 ⑤는 옳다. 직각삼각형 $ACD$에서 $AD=AC\sin 60^\circ$, $CD=AC\cos 60^\circ$이므로 ①, ②는 옳다. 직각삼각형 $ABD$에서 $BD=AB\cos 30^\circ$이므로 ③도 옳다. 그러나 직각삼각형 $ACD$에서 $\tan 60^\circ = \dfrac{AD}{CD}$이므로 $CD = \dfrac{AD}{\tan 60^\circ}$이다. 따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림의 원 $O$에서 반지름의 길이 $x$의 값은?

**보기** ① $10$  ② $9$  ③ $11$  ④ $12$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원의 중심 O에서 현에 내린 수선은 현을 수직이등분한다.
2. 2) 현의 길이가 12 cm이므로 절반 길이는 6 cm이다.
3. 3) 중심거리가 8 cm이므로 반지름 x를 빗변으로 하는 직각삼각형에서 x^2 = 6^2 + 8^2 = 100이다.
4. 4) x > 0이므로 x = 10이다.
5. 5) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 원 $O$에서 반지름의 길이 $x$의 값은?」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 원의 중심 O에서 현 12 cm에 내린 수선이 현을 이등분하여 6 cm, 중심거리 8 cm로부터 반지름 x = 10을 구하는 M3-RPM-067 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원 중심에서 현에 내린 수선의 이등분 성질과 피타고라스 정리로 반지름 x = 10을 도출하는 TM_CIRCLE_CHORD_LENGTH 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 현의 이등분 길이 6과 중심거리 8로부터 피타고라스 정리 6, 8, 10으로 반지름 10을 바로 구하는 1단계 문항이다.

**4칸**
- given: 원←stem:「다음 그림의 원 $O$에서」
- goal: 반지름←stem:「반지름의 길이 $x$의 값은?」
- method: 현(NAMED)←solution:「원의 중심 $O$에서 현에 내린 수선은 그 현을 이등분한다.」
- condition: 수선←solution:「원의 중심 $O$에서 현에 내린 수선은 그 현을 이등분한다.」

**how** 현 12 cm의 절반 6 cm와 중심거리 8 cm에서 피타고라스 정리 x = sqrt(6^2 + 8^2) = 10임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심 $O$에서 현에 내린 수선은 그 현을 이등분한다. 현의 길이가 $12,\mathrm{cm}$이므로 현의 절반의 길이는 $6,\mathrm{cm}$이다. 중심에서 현까지의 거리가 $8,\mathrm{cm}$이므로 반지름 $x$를 빗변으로 하는 직각삼각형에서 $$ x^2 = 6^2 + 8^2 = 36 + 64 = 100 $$ $x>0$이므로 $x=10$이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

다음 그림의 원 $O$에서 $OD \perp AB$, $OE \perp BC$, $OF \perp AC$이고 $OD=OE=OF$이다. $BC=6\sqrt{3},\mathrm{cm}$일 때, 원 $O$의 넓이는?

**보기** ① $18\pi,\mathrm{cm}^2$  ② $24\pi,\mathrm{cm}^2$  ③ $27\pi,\mathrm{cm}^2$  ④ $32\pi,\mathrm{cm}^2$  ⑤ $36\pi,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) OD = OE = OF이므로 원의 중심에서 세 현에 이르는 거리가 모두 같아 AB = BC = CA = 6*sqrt(3) cm인 정삼각형이다.
2. 2) 한 변 6*sqrt(3) cm인 정삼각형 ABC의 높이는 6*sqrt(3) * (sqrt(3)/2) = 9 cm이다.
3. 3) 정삼각형의 외심은 무게중심과 일치하므로 외접원 반지름 OB = (2/3) * 9 = 6 cm이다.
4. 4) 따라서 원 O의 넓이는 pi * 6^2 = 36*pi cm^2이다.
5. 5) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 원 $O$에서 $OD \perp AB$, $OE \perp BC$, $OF \perp AC$이고 $OD=OE=OF$이다. $BC=6\sqrt{3},\mathrm{cm}$일 때, 원 $O$의 넓이는?」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 중심에서 세 현까지의 거리가 같아 정삼각형임을 식별하고 높이 9 cm와 반지름 6 cm로부터 원 넓이 36*pi cm^2를 구하는 M3-RPM-069 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 원 중심에서 같은 거리에 있는 현의 길이가 같음을 이용해 정삼각형의 외접원 넓이 36*pi cm^2를 도출하는 TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 세 현의 길이가 같아 정삼각형임을 파악하고 무게중심 성질로 반지름 6 cm를 구하여 넓이 36*pi를 계산하는 2단계 문항이다.

**4칸**
- given: 원←stem:「다음 그림의 원 $O$에서」
- goal: 넓이←stem:「원 $O$의 넓이는?」
- method: 정삼각형(NAMED)←solution:「$\triangle ABC$는 정삼각형이다.」
- condition: 수직←stem:「$OD \perp AB$, $OE \perp BC$, $OF \perp AC$이고」

**how** OD = OE = OF에서 정삼각형 한 변 6*sqrt(3)의 높이 9 cm를 얻고 무게중심 반지름 6 cm에서 원의 넓이가 36*pi cm^2임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심에서 같은 거리에 있는 현의 길이는 같다. $OD=OE=OF$이므로 $AB=BC=CA=6\sqrt{3},\mathrm{cm}$이고, $\triangle ABC$는 정삼각형이다. 정삼각형 $ABC$의 높이는 $$ 6\sqrt{3}\times\dfrac{\sqrt{3}}{2} = 9,\mathrm{cm} $$ 점 $O$는 정삼각형 $ABC$의 무게중심과 같으므로 반지름 $OB$의 길이는 $$ OB = \dfrac{2}{3}\times 9 = 6,\mathrm{cm} $$ 따라서 원 $O$의 넓이는 $\pi\times 6^2 = 36\pi,\mathrm{cm}^2$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림에서 $AB \perp OC$이고 교점이 $M$일 때, $AM=8,\mathrm{cm}$, $CM=4,\mathrm{cm}$이면 $OA$의 길이는?

**보기** ① $8,\mathrm{cm}$  ② $9,\mathrm{cm}$  ③ $10,\mathrm{cm}$  ④ $11,\mathrm{cm}$  ⑤ $12,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원 O의 반지름을 r이라 하면 OA = OC = r이고 OM = r - 4이다.
2. 2) AB perp OC이므로 직각삼각형 OMA에서 피타고라스 정리에 의해 r^2 = (r - 4)^2 + 8^2이다.
3. 3) r^2 = r^2 - 8r + 16 + 64에서 8r = 80이므로 r = 10이다.
4. 4) 따라서 OA = 10 cm이다.
5. 5) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $AB \perp OC$이고 교점이 $M$일 때, $AM=8,\mathrm{cm}$, $CM=4,\mathrm{cm}$이면 $OA$의 길이는?」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 반지름 r에 대해 직각삼각형 OMA에서 r^2 = (r-4)^2 + 8^2의 피타고라스 방정식을 풀어 OA = 10 cm를 구하는 M3-RPM-067 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원 중심과 현의 수직 관계에서 반지름 r과 피타고라스 정리 r^2 = (r-4)^2 + 64를 연립해 OA = 10 cm를 도출하는 TM_CIRCLE_CHORD_LENGTH 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반지름 r을 미지수로 두어 직각삼각형 OMA에서 r^2 = (r-4)^2 + 64의 방정식을 세우고 r = 10을 도출하는 2단계 문항이다.

**4칸**
- given: 직각삼각형←solution:「직각삼각형 $OMA$에서 피타고라스 정리에 의해」
- goal: 길이←stem:「$OA$의 길이는?」
- method: 피타고라스정리(NAMED)←solution:「직각삼각형 $OMA$에서 피타고라스 정리에 의해」
- condition: 수직←stem:「$AB \perp OC$이고 교점이 $M$일 때,」

**how** 반지름 r에 대해 직각삼각형 OMA에서 r^2 = (r - 4)^2 + 8^2을 풀어 8r = 80에서 r = OA = 10 cm임을 확인하여 정답 ③로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 $O$의 반지름의 길이를 $r,\mathrm{cm}$라 하면 $OA=OC=r$이고 $OM=r-4$이다. 직각삼각형 $OMA$에서 피타고라스 정리에 의해 $$ \begin{aligned} r^2 &= (r-4)^2 + 8^2 \ r^2 &= r^2 - 8r + 16 + 64 \ 8r &= 80 \ r &= 10 \end{aligned} $$ 따라서 $OA=10,\mathrm{cm}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

다음 그림에서 점 $I$는 $\triangle ABC$의 내심이며 원의 중심이다. $DE=8,\mathrm{cm}$일 때, $FG+HJ$의 값은?

**보기** ① $14,\mathrm{cm}$  ② $16,\mathrm{cm}$  ③ $18,\mathrm{cm}$  ④ $20,\mathrm{cm}$  ⑤ $24,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 점 I는 삼각형 ABC의 내심이므로 세 변 AB, BC, CA에 이르는 거리가 모두 같다.
2. 2) 세 현 DE, FG, HJ는 원의 중심 I에서 같은 거리에 있으므로 현의 길이가 같다.
3. 3) 따라서 DE = FG = HJ = 8 cm이다.
4. 4) 그러므로 FG + HJ = 8 + 8 = 16 cm이다.
5. 5) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 점 $I$는 $\triangle ABC$의 내심이며 원의 중심이다. $DE=8,\mathrm{cm}$일 때, $FG+HJ$의 값은?」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 내심 I에서 세 변까지의 거리가 같음을 이용해 세 현의 길이 DE = FG = HJ = 8 cm로부터 FG + HJ = 16 cm를 구하는 M3-RPM-069 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 원의 중심에서 같은 거리에 있는 현의 길이가 같음을 활용하여 FG + HJ = 16 cm를 도출하는 TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 내심의 정의와 중심거리가 같은 현의 상등 성질을 이용해 8 + 8 = 16을 바로 계산하는 1단계 문항이다.

**4칸**
- given: 내심←stem:「점 $I$는 $\triangle ABC$의 내심이며 원의 중심이다.」
- goal: 합←solution:「그러므로 $FG + HJ = 8 + 8 = 16,\mathrm{cm}$이다.」
- method: 현(NAMED)←solution:「원의 중심에서 같은 거리에 있는 현의 길이는 같으므로」
- condition: 길이←stem:「$DE=8,\mathrm{cm}$일 때,」

**how** 내심 I에서 세 변까지의 거리가 같으므로 세 현의 길이가 모두 8 cm로 같아 FG + HJ = 8 + 8 = 16 cm임을 확인해 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 $\triangle ABC$의 내심이므로 세 변 $AB$, $BC$, $CA$까지의 거리가 모두 같다. 따라서 세 현 $DE$, $FG$, $HJ$는 원의 중심 $I$에서 각각 같은 거리에 있다. 원의 중심에서 같은 거리에 있는 현의 길이는 같으므로 $$ DE = FG = HJ = 8,\mathrm{cm} $$ 그러므로 $FG + HJ = 8 + 8 = 16,\mathrm{cm}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 그림에서 두 직선 $PA$, $PB$가 원 $O$의 접선이고 두 점 $A$, $B$가 접점일 때, $\angle APB=44^\circ$이면 $\angle PAB$의 크기는?

**보기** ① $58^\circ$  ② $62^\circ$  ③ $66^\circ$  ④ $68^\circ$  ⑤ $72^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원 밖의 한 점 P에서 원에 그은 두 접선의 길이는 같으므로 PA = PB이다.
2. 2) 따라서 삼각형 PAB는 이등변삼각형이며 각 PAB = 각 PBA이다.
3. 3) 각 APB = 44도이므로 각 PAB = (180도 - 44도) / 2 = 136도 / 2 = 68도이다.
4. 4) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 직선 $PA$, $PB$가 원 $O$의 접선이고 두 점 $A$, $B$가 접점일 때, $\angle APB=44^\circ$이면 $\angle PAB$의 크기는?」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 원 밖의 점 P에서 그은 두 접선의 길이 PA = PB로부터 이등변삼각형 밑각 각 PAB = (180-44)/2 = 68도를 구하는 M3-RPM-071 문제이다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH
- 이유: 원 외부 점 P에서 그은 접선의 길이가 같아 형성되는 이등변삼각형 PAB의 밑각 68도를 계산하는 TPL_CIRCLE_TANGENT_EQUAL_LENGTH 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선의 길이 상등 성질로 이등변삼각형 밑각 (180 - 44)/2 = 68도를 바로 구하는 1단계 문항이다.

**4칸**
- given: 접선←stem:「두 직선 $PA$, $PB$가 원 $O$의 접선이고」
- goal: 각←stem:「$\angle PAB$의 크기는?」
- method: 이등변삼각형(NAMED)←solution:「따라서 $\triangle PAB$는 이등변삼각형이고,」
- condition: 접점←stem:「두 점 $A$, $B$가 접점일 때,」

**how** PA = PB인 이등변삼각형 PAB에서 각 PAB = (180 - 44)/2 = 68도임을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점 $P$에서 원에 그은 두 접선의 길이는 같으므로 $PA=PB$이다. 따라서 $\triangle PAB$는 이등변삼각형이고, $\angle PAB = \angle PBA$이다. $\angle APB=44^\circ$이므로 $$ \angle PAB = \dfrac{180^\circ - 44^\circ}{2} = \dfrac{136^\circ}{2} = 68^\circ $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림에서 원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접하고, $AB=6$, $AD=9$이다. $DE$가 원 $O$의 접선일 때, $\triangle DEC$의 넓이는?

**보기** ① $\dfrac{27}{2}$  ② $12$  ③ $\dfrac{25}{2}$  ④ $14$  ⑤ $\dfrac{29}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직사각형 ABCD에서 원 O는 AB = 6에 접하므로 지름 6, 반지름 3이다.
2. 2) 접점 성질에 의해 DT = DU = 9 - 3 = 6이다.
3. 3) EC = x라 하면 ET = EV = (9 - x) - 3 = 6 - x이다.
4. 4) 따라서 DE = DT + TE = 6 + (6 - x) = 12 - x이다.
5. 5) 직각삼각형 DEC에서 피타고라스 정리로 (12 - x)^2 = 6^2 + x^2이므로 144 - 24x = 36에서 x = 9/2이다.
6. 6) 삼각형 DEC의 넓이는 (1/2) * 6 * (9/2) = 27/2이다.
7. 7) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접하고, $AB=6$, $AD=9$이다. $DE$가 원 $O$의 접선일 때, $\triangle DEC$의 넓이는?」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 접선 성질로 DE = 12 - x를 설정하고 직각삼각형 DEC에서 피타고라스 정리로 x = 9/2를 구해 넓이 27/2을 구하는 M3-RPM-072 문제이다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE
- 이유: 원 O의 접선 길이 상등과 직각삼각형 DEC의 피타고라스 방정식을 연립하여 넓이 27/2을 산출하는 TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 원과 직사각형의 접점 성질로 DE = 12 - x를 표현하고 피타고라스 정리로 x = 9/2를 풀어 넓이를 구하는 3단계 문항이다.

**4칸**
- given: 직사각형←stem:「원 $O$는 직사각형 $ABCD$의 세 변」
- goal: 넓이←stem:「$\triangle DEC$의 넓이는?」
- method: 피타고라스정리(NAMED)←solution:「직각삼각형 $DEC$에서 피타고라스 정리에 의해」
- condition: 접선←stem:「$DE$가 원 $O$의 접선일 때,」

**how** 접선 길이 상등으로 DE = 12 - x를 설정하고 피타고라스 정리 (12 - x)^2 = 36 + x^2에서 x = 9/2를 얻어 넓이가 27/2임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 $O$는 직사각형의 두 변 $AD$, $BC$에 접하므로 지름은 $AB=6$, 반지름은 $3$이다. $AD$, $BC$, $DE$와 원 $O$의 접점을 각각 $U$, $V$, $T$라 하면 $AU=BV=3$이므로 $$ DT = DU = AD - AU = 9 - 3 = 6 $$ $EC=x$라 하면 $BE=9-x$이므로 $$ ET = EV = BE - BV = (9-x)-3 = 6-x $$ 따라서 $DE = DT + TE = 6 + (6-x) = 12-x$이다. 직각삼각형 $DEC$에서 피타고라스 정리에 의해 $$ (12-x)^2 = 6^2 + x^2 \implies 144 - 24x + x^2 = 36 + x^2 \implies 24x = 108 \implies x = \dfrac{9}{2} $$ 그러므로 $\triangle DEC$의 넓이는 $\dfrac{1}{2}\times 6\times \dfrac{9}{2} = \dfrac{27}{2}$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 그림에서 $\triangle ABC$는 $\angle C=90^\circ$, $BC=8,\mathrm{cm}$, $AC=6,\mathrm{cm}$인 직각삼각형이고, 원 $O$는 $\triangle ABC$의 내접원이다. 세 접점을 각각 $D$, $E$, $F$라 할 때, 원 $O$의 반지름의 길이는?

**보기** ① $1,\mathrm{cm}$  ② $\dfrac{3}{2},\mathrm{cm}$  ③ $\dfrac{5}{3},\mathrm{cm}$  ④ $\dfrac{7}{4},\mathrm{cm}$  ⑤ $2,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 ABC에서 피타고라스 정리로 빗변 AB = sqrt(6^2 + 8^2) = 10 cm이다.
2. 2) 삼각형 ABC의 넓이는 (1/2) * 6 * 8 = 24 cm^2이다.
3. 3) 삼각형의 둘레는 6 + 8 + 10 = 24 cm이다.
4. 4) 내접원 반지름 r에 대해 넓이 공식 (1/2) * r * 24 = 24이므로 12r = 24에서 r = 2 cm이다.
5. 5) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\triangle ABC$는 $\angle C=90^\circ$, $BC=8,\mathrm{cm}$, $AC=6,\mathrm{cm}$인 직각삼각형이고, 원 $O$는 $\triangle ABC$의 내접원이다. 세 접점을 각각 $D$, $E$, $F$라 할 때, 원 $O$의 반지름의 길이는?」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 직각삼각형 ABC의 넓이 24와 둘레 24로부터 내접원 넓이 공식 (1/2)*r*(둘레)를 적용하여 반지름 r = 2 cm를 구하는 M3-RPM-071 문제이다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE
- 이유: 직각삼각형 ABC의 넓이 24와 둘레 24의 관계로부터 내접원 반지름 r = 2 cm를 도출하는 TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리로 빗변 10 cm를 구하고 내접원 반지름 공식 12r = 24에서 r = 2를 계산하는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「$\angle C=90^\circ$, $BC=8,\mathrm{cm}$, $AC=6,\mathrm{cm}$인 직각삼각형이고,」
- goal: 반지름←stem:「원 $O$의 반지름의 길이는?」
- method: 내접원(NAMED)←stem:「원 $O$는 $\triangle ABC$의 내접원이다.」
- condition: 길이←stem:「$BC=8,\mathrm{cm}$, $AC=6,\mathrm{cm}$인」

**how** 빗변 10 cm를 구하고 넓이 24 cm^2와 둘레 24 cm에서 (1/2)*r*24 = 24로부터 r = 2 cm임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리에 의해 빗변의 길이는 $$ AB = \sqrt{6^2+8^2} = 10,\mathrm{cm} $$ 원 $O$의 반지름의 길이를 $r,\mathrm{cm}$라 하자. $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 6\times 8 = 24,\mathrm{cm}^2$이고, 둘레의 길이는 $6+8+10=24,\mathrm{cm}$이므로 $$ \dfrac{1}{2}\times r\times (6+8+10) = 24 \implies 12r = 24 \implies r = 2 $$ 따라서 원 $O$의 반지름의 길이는 $2,\mathrm{cm}$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음 그림과 같이 $DA$, $EB$, $DE$는 지름이 $AB$인 반원 $O$의 접선이고, $A$, $B$, $C$는 접점이다. 점 $C$에서 $AB$에 내린 수선의 발을 $F$라 하자. $DA=4,\mathrm{cm}$, $EB=12,\mathrm{cm}$일 때, $CF$의 길이는?

**보기** ① $5,\mathrm{cm}$  ② $\dfrac{11}{2},\mathrm{cm}$  ③ $6,\mathrm{cm}$  ④ $\dfrac{13}{2},\mathrm{cm}$  ⑤ $7,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 점 D에서 반원에 그은 접선이므로 DC = DA = 4 cm이다.
2. 2) 점 E에서 반원에 그은 접선이므로 CE = EB = 12 cm이다.
3. 3) 따라서 DC : CE = 4 : 12 = 1 : 3이다.
4. 4) CF = x라 하고 평행선 닮음비를 적용하면 DC : CE = (x - 4) : (12 - x)이다.
5. 5) 1 : 3 = (x - 4) : (12 - x)에서 3(x - 4) = 12 - x이므로 4x = 24에서 x = 6 cm이다.
6. 6) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $DA$, $EB$, $DE$는 지름이 $AB$인 반원 $O$의 접선이고, $A$, $B$, $C$는 접점이다. 점 $C$에서 $AB$에 내린 수선의 발을 $F$라 하자. $DA=4,\mathrm{cm}$, $EB=12,\mathrm{cm}$일 때, $CF$의 길이는?」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 접선 길이 DC = 4 cm, CE = 12 cm로부터 비 1:3을 구하고 사다리꼴 평행선 비 (x-4):(12-x) = 1:3을 풀어 CF = 6 cm를 구하는 M3-RPM-072 문제이다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH
- 이유: 원 외부 점에서 그은 접선의 길이 성질과 평행선 사이의 선분 길이 비를 이용해 CF = 6 cm를 도출하는 TPL_CIRCLE_TANGENT_EQUAL_LENGTH 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 4 → 2**
- 이유: 접선 상등으로 DC = 4, CE = 12를 구하고 닮음비 1:3으로 방정식 4x = 24를 풀어 CF = 6을 도출하는 2단계 문항이다.

**4칸**
- given: 접선←stem:「반원 $O$의 접선이고, $A$, $B$, $C$는 접점이다.」
- goal: 길이←stem:「$CF$의 길이는?」
- method: 닮음(NAMED)←solution:「닮음인 두 직각삼각형이 생긴다.」
- condition: 수선←stem:「점 $C$에서 $AB$에 내린 수선의 발을 $F$라 하자.」

**how** DC = 4, CE = 12에서 1:3 = (x - 4):(12 - x)를 풀어 4x = 24에서 CF = 6 cm임을 확인하여 정답 ③로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $D$에서 반원에 그은 두 접선의 길이는 같으므로 $DC=DA=4,\mathrm{cm}$이다. 마찬가지로 점 $E$에서도 $CE=EB=12,\mathrm{cm}$이므로 $DC:CE = 4:12 = 1:3$이다. $CF=x,\mathrm{cm}$라 하고, 점 $C$를 지나 $AB$와 평행한 직선을 그어 선분 $AD$의 연장선과 $EB$와 만나는 점을 잡으면 닮음인 두 직각삼각형이 생긴다. $$ DC : CE = (x-4) : (12-x) $$ 이므로 $1:3 = (x-4):(12-x)$이다. $$ 3(x-4) = 12-x \implies 4x = 24 \implies x = 6 $$ 따라서 $CF=6,\mathrm{cm}$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점


**발문**

[서술형 1] 다음 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AC=4,\mathrm{cm}$, $\tan A=2$일 때, $\cos A$의 값을 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{\sqrt{5}}{5}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 ABC에서 tan A = BC / AC = 2이고 AC = 4 cm이므로 BC = 8 cm이다.
2. 2) 피타고라스 정리에 의해 빗변 AB = sqrt(4^2 + 8^2) = sqrt(80) = 4*sqrt(5) cm이다.
3. 3) 따라서 cos A = AC / AB = 4 / (4*sqrt(5)) = sqrt(5)/5이다.
4. 4) 그러므로 답은 sqrt(5)/5이다.
- 작성자 답: $\dfrac{\sqrt{5}}{5}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 다음 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AC=4,\mathrm{cm}$, $\tan A=2$일 때, $\cos A$의 값을 구하는 과정과 답을 쓰시오.」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: tan A = 2와 AC = 4 cm로부터 대변 BC = 8 cm와 빗변 4*sqrt(5) cm를 구하여 cos A = sqrt(5)/5를 산출하는 M3-RPM-055 문제이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 탄젠트 값 2와 이웃변 AC = 4 cm로부터 빗변 AB = 4*sqrt(5) cm를 구하고 코사인 값 sqrt(5)/5를 유도하는 TPL_TRIG_RATIO_BASIC_RELATION 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 탄젠트 정의로 대변 BC = 8 cm를 구하고 피타고라스 정리로 빗변 AB = 4*sqrt(5) cm를 얻어 코사인 값을 계산하는 1단계 서술형 문항이다.

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 $ABC$($\angle C=90^\circ$)에서」
- goal: 코사인←stem:「$\cos A$의 값을 구하는 과정과 답을 쓰시오.」
- method: 탄젠트(NAMED)←stem:「$AC=4,\mathrm{cm}$, $\tan A=2$일 때,」
- condition: 길이←stem:「$AC=4,\mathrm{cm}$,」

**how** tan A = 2에서 BC = 8 cm를 얻고 피타고라스 정리로 빗변 AB = 4*sqrt(5) cm로부터 cos A = sqrt(5)/5임을 유도하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $$ \tan A = \dfrac{BC}{AC} = 2 $$ $AC=4,\mathrm{cm}$이므로 $\dfrac{BC}{4}=2$, 즉 $BC=8,\mathrm{cm}$이다. 피타고라스 정리에 의해 빗변 $AB$의 길이는 $$ AB = \sqrt{AC^2+BC^2} = \sqrt{4^2+8^2} = \sqrt{80} = 4\sqrt{5},\mathrm{cm} $$ 따라서 $$ \cos A = \dfrac{AC}{AB} = \dfrac{4}{4\sqrt{5}} = \dfrac{\sqrt{5}}{5} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

[서술형 2] 다음 그림과 같이 두 지점 $A$와 $B$에서 하늘에 떠 있는 열기구 $C$를 올려본 각의 크기가 각각 $45^\circ$와 $60^\circ$이다. 두 지점 $A$와 $B$ 사이의 거리가 $60,\mathrm{m}$일 때, 지면에서 열기구까지의 높이를 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(90-30\sqrt{3}),\mathrm{m}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 열기구 C에서 지면 AB에 내린 수선의 발을 H라 하고 높이를 h m라 하자.
2. 2) 직각삼각형 ACH에서 tan 45도 = 1이므로 AH = h이다.
3. 3) 직각삼각형 BCH에서 tan 60도 = sqrt(3)이므로 BH = h / sqrt(3)이다.
4. 4) AH + BH = AB = 60이므로 h + h/sqrt(3) = 60이다.
5. 5) 양변에 sqrt(3)을 곱해 (sqrt(3) + 1)h = 60*sqrt(3)에서 h = (90 - 30*sqrt(3)) m이다.
- 작성자 답: $(90-30\sqrt{3}),\mathrm{m}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 다음 그림과 같이 두 지점 $A$와 $B$에서 하늘에 떠 있는 열기구 $C$를 올려본 각의 크기가 각각 $45^\circ$와 $60^\circ$이다. 두 지점 $A$와 $B$ 사이의 거리가 $60,\mathrm{m}$일 때, 지면에서 열기구까지의 높이를 구하는 과정과 답을 쓰시오.」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각]
- 이유: 양 지점에서 올려본 앙각 45도, 60도와 거리 60 m로부터 높이 h의 삼각비 방정식 h + h/sqrt(3) = 60을 풀어 h = (90 - 30*sqrt(3)) m를 구하는 M3-RPM-064 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_SHARED_HEIGHT
- 이유: 두 관측 지점의 올려본 각 45도, 60도와 기저 거리 60 m에서 공유 높이 h = (90 - 30*sqrt(3)) m를 도출하는 TPL_TRIG_APPLICATION_SHARED_HEIGHT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 4 → 2**
- 이유: 탄젠트 45도와 60도를 이용해 밑변의 합 60 m의 일차방정식을 세우고 유리화하여 높이를 구하는 2단계 서술형 문항이다.

**4칸**
- given: 거리←stem:「두 지점 $A$와 $B$ 사이의 거리가 $60,\mathrm{m}$일 때,」
- goal: 높이←stem:「지면에서 열기구까지의 높이를 구하는 과정과 답을 쓰시오.」
- method: 앙각(IMPLIED)←solution:「열기구의 위치 $C$에서 선분 $AB$에 내린 수선의 발을 $H$라 하고,」 — 올려본 각(앙각) 45도와 60도를 이용해 수선의 발 H에 대한 삼각비 식을 세움
- condition: 각←stem:「올려본 각의 크기가 각각 $45^\circ$와 $60^\circ$이다.」

**how** h + h/sqrt(3) = 60에서 (sqrt(3) + 1)h = 60*sqrt(3)을 유리화하여 높이 h = (90 - 30*sqrt(3)) m임을 유도하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

열기구의 위치 $C$에서 선분 $AB$에 내린 수선의 발을 $H$라 하고, 높이 $CH$를 $h,\mathrm{m}$라 하자. 직각삼각형 $ACH$에서 $\tan 45^\circ = \dfrac{CH}{AH} = 1$이므로 $AH = h$이다. 직각삼각형 $BCH$에서 $\tan 60^\circ = \dfrac{CH}{BH} = \sqrt{3}$이므로 $BH = \dfrac{h}{\sqrt{3}}$이다. $AH + BH = AB = 60$이므로 $$ h + \dfrac{h}{\sqrt{3}} = 60 \implies (\sqrt{3}+1)h = 60\sqrt{3} $$ 양변을 $\sqrt{3}+1$로 나누어 분모를 유리화하면 $$ h = \dfrac{60\sqrt{3}}{\sqrt{3}+1} = \dfrac{60\sqrt{3}(\sqrt{3}-1)}{(\sqrt{3}+1)(\sqrt{3}-1)} = 30\sqrt{3}(\sqrt{3}-1) = 90-30\sqrt{3} $$ 따라서 지면에서 열기구까지의 높이는 $(90-30\sqrt{3}),\mathrm{m}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 4점


**발문**

[서술형 3] 다음은 원 모양의 도자기 접시가 세 조각으로 깨진 것이다. 세 학생이 원의 중심을 찾아 깨지기 전의 접시 모양을 복원하려고 한다. 아래의 세 학생 중에서 옳게 말한 사람을 찾고, 원의 중심을 찾는 방법을 설명하시오. 민호: 조각 ①은 너무 작아서 중심을 찾을 수 없어. 지아: 중심은 조각 ② 안에 들어 있으니까 조각 ②가 꼭 있어야 해. 서윤: 세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 서윤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원의 현의 수직이등분선은 항상 원의 중심을 지난다.
2. 2) 깨진 조각 중 어느 하나라도 원호의 일부가 남아 있으면 호 위에 서로 다른 세 점 A, B, C를 잡을 수 있다.
3. 3) 두 현 AB와 BC의 수직이등분선을 작도하여 연장하면 교점이 원의 중심이 된다.
4. 4) 따라서 중심이 조각 바깥에 있더라도 어느 조각을 이용해도 원의 중심을 찾을 수 있으므로 서윤이가 옳다.
- 작성자 답: 서윤 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 다음은 원 모양의 도자기 접시가 세 조각으로 깨진 것이다. 세 학생이 원의 중심을 찾아 깨지기 전의 접시 모양을 복원하려고 한다. 아래의 세 학생 중에서 옳게 말한 사람을 찾고, 원의 중심을 찾는 방법을 설명하시오. 민호: 조각 ①은 너무 작아서 중심을 찾을 수 없어. 지아: 중심은 조각 ② 안에 들어 있으니까 조각 ②가 꼭 있어야 해. 서윤: 세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.」
**RPM** M3-RPM-068 [원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심]
- 이유: 원의 현 AB, BC의 수직이등분선이 항상 중심을 지난다는 성질을 이용하여 깨진 원호에서 두 현의 수직이등분선 교점으로 중심을 복원함을 논술하는 M3-RPM-068 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_PERP_BISECTOR
- 이유: 원호의 두 현 AB, BC의 수직이등분선 교점이 원의 중심임을 정당화하여 옳게 말한 학생 서윤을 식별하는 TM_CIRCLE_CHORD_PERP_BISECTOR 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 현 AB, BC의 수직이등분선이 원의 중심을 지난다는 기본 기하학적 정리를 설명하고 학생을 선별하는 1단계 서술형 문항이다.

**4칸**
- given: 원←stem:「다음은 원 모양의 도자기 접시가 세 조각으로 깨진 것이다.」
- goal: 중심←stem:「원의 중심을 찾는 방법을 설명하시오.」
- method: 수직이등분선(NAMED)←solution:「원의 현의 수직이등분선은 항상 원의 중심을 지난다.」
- condition: 현←solution:「호 위에서 서로 다른 세 점 $A$, $B$, $C$를 잡고 두 현 $AB$, $BC$를 긋는다.」

**how** 현 AB, BC의 수직이등분선은 항상 원의 중심을 지나므로 호의 일부만 있어도 작도 연장을 통해 교점을 찾을 수 있어 서윤이가 옳음을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

옳게 말한 학생은 **서윤**이다. 원의 현의 수직이등분선은 항상 원의 중심을 지난다. 깨진 조각 중 어느 하나라도 원호의 일부가 남아 있으므로, 그 호 위에서 서로 다른 세 점 $A$, $B$, $C$를 잡고 두 현 $AB$, $BC$를 긋는다. 현 $AB$의 수직이등분선과 현 $BC$의 수직이등분선을 작도하여 연장하면, 두 수직이등분선이 만나는 교점이 깨지기 전 원의 중심이 된다. 중심이 조각 바깥에 있더라도 수직이등분선을 연장하면 교점을 구할 수 있으므로 어느 조각을 이용해도 중심을 찾을 수 있다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점


**발문**

[서술형 4] 다음 그림에서 두 반직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 각각 그 접점이다. $\angle APB=60^\circ$, $PA=3\sqrt{3},\mathrm{cm}$일 때, 어두운 부분(사각형 $PAOB$에서 부채꼴 $AOB$를 제외한 부분)의 넓이를 구하는 과정과 답을 쓰시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(9\sqrt{3}-3\pi),\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 접선과 반지름의 수직 조건에 의해 각 OAP = 각 OBP = 90도이다.
2. 2) 직각삼각형 OAP에서 각 APO = 30도이므로 반지름 OA = PA * tan 30도 = 3*sqrt(3) * (sqrt(3)/3) = 3 cm이다.
3. 3) 사각형 PAOB에서 각 AOB = 360도 - 90도 - 90도 - 60도 = 120도이다.
4. 4) 사각형 PAOB의 넓이는 2 * ((1/2) * 3*sqrt(3) * 3) = 9*sqrt(3) cm^2이다.
5. 5) 부채꼴 AOB의 넓이는 pi * 3^2 * (120/360) = 3*pi cm^2이다.
6. 6) 따라서 어두운 부분의 넓이는 (9*sqrt(3) - 3*pi) cm^2이다.
- 작성자 답: $(9\sqrt{3}-3\pi),\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_PROPERTY(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 다음 그림에서 두 반직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 각각 그 접점이다. $\angle APB=60^\circ$, $PA=3\sqrt{3},\mathrm{cm}$일 때, 어두운 부분(사각형 $PAOB$에서 부채꼴 $AOB$를 제외한 부분)의 넓이를 구하는 과정과 답을 쓰시오.」
**RPM** M3-RPM-070 [원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선]
- 이유: 접선 각 60도와 PA = 3*sqrt(3) cm로부터 반지름 3 cm를 구하고 사각형 PAOB 넓이 9*sqrt(3)과 중심각 120도 부채꼴 넓이 3*pi의 차를 구하는 M3-RPM-070 문제이다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_ARC_AREA
- 이유: 접선으로 둘러싸인 사각형 PAOB의 넓이 9*sqrt(3) cm^2에서 중심각 120도 부채꼴 넓이 3*pi cm^2를 빼어 영역 넓이를 계산하는 TPL_CIRCLE_TANGENT_ARC_AREA 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 탄젠트 30도로 반지름 3 cm를 구하고 사각형 넓이 9*sqrt(3)과 부채꼴 넓이 3*pi의 차를 도출하는 2단계 서술형 문항이다.

**4칸**
- given: 접선←stem:「두 반직선 $PA$, $PB$는 원 $O$의 접선이고」
- goal: 넓이←stem:「어두운 부분(사각형 $PAOB$에서 부채꼴 $AOB$를 제외한 부분)의 넓이를 구하는 과정과 답을 쓰시오.」
- method: 부채꼴(NAMED)←stem:「부채꼴 $AOB$를 제외한 부분)의 넓이를 구하는」
- condition: 접점←stem:「두 점 $A$, $B$는 각각 그 접점이다.」

**how** 직각삼각형 OAP에서 반지름 OA = 3 cm를 구하고 사각형 PAOB 넓이 9*sqrt(3)에서 부채꼴 AOB 넓이 3*pi를 빼어 (9*sqrt(3) - 3*pi) cm^2임을 서술하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

접선과 반지름은 접점에서 수직이므로 $\angle OAP=\angle OBP=90^\circ$이다. 두 직각삼각형 $OAP$, $OBP$는 $OA=OB$, $OP$가 공통이므로 합동이고 $\angle APO=\dfrac{1}{2}\angle APB=30^\circ$이다. 직각삼각형 $OAP$에서 반지름 $OA$의 길이는 $$ OA = PA\tan 30^\circ = 3\sqrt{3}\times\dfrac{\sqrt{3}}{3} = 3,\mathrm{cm} $$ 사각형 $PAOB$에서 $\angle AOB = 360^\circ - 90^\circ - 90^\circ - 60^\circ = 120^\circ$이다. 사각형 $PAOB$의 넓이는 $$ 2\times\triangle OAP = 2\times\left(\dfrac{1}{2}\times 3\sqrt{3}\times 3\right) = 9\sqrt{3},\mathrm{cm}^2 $$ 부채꼴 $AOB$의 넓이는 $$ \pi\times 3^2\times\dfrac{120^\circ}{360^\circ} = 3\pi,\mathrm{cm}^2 $$ 따라서 어두운 부분의 넓이는 $(9\sqrt{3}-3\pi),\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
