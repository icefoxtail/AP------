# 검수 묶음 — 25_연향중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4)**
- 문항 23개 / 검사 PASS 19, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 17, NONE 6
- 난이도 분포: 1단계 5, 2단계 15, 3단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 검사 코드: CHOICE_ORDER
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q8**: 검사 코드: CHOICE_ORDER
- **Q19**: 원천 값과 다른 칸 2개 (소단원, 난이도)
- **Q20**: 원천 값과 다른 칸 2개 (소단원, 난이도)
- **Q21**: 원천 값과 다른 칸 2개 (소단원, 난이도)
- **Q22**: 원천 값과 다른 칸 2개 (소단원, 난이도)
- **Q23**: 원천 값과 다른 칸 2개 (소단원, 난이도)

---
## Q1 — 객관식 4점


**발문**

다음 그림의 직각삼각형 $ABC$($\angle B=90^\circ$)에서 $AB=4$, $AC=6$이고 변 $BC$의 중점을 $D$라 하자. $\angle BAD=x$일 때, $\sin x$의 값은?

**보기** ① $\dfrac{\sqrt{105}}{19}$  ② $\dfrac{\sqrt{105}}{20}$  ③ $\dfrac{\sqrt{105}}{21}$  ④ $\dfrac{\sqrt{105}}{22}$  ⑤ $\dfrac{\sqrt{105}}{23}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 피타고라스 정리에 의해 BC = sqrt(6^2 - 4^2) = 2*sqrt(5)이다.
2. 점 D가 BC의 중점이므로 BD = sqrt(5)이다.
3. 직각삼각형 ABD에서 AD = sqrt(4^2 + 5) = sqrt(21)이므로 sin x = BD / AD = sqrt(5)/sqrt(21) = sqrt(105)/21이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 직각삼각형 $ABC$($\angle B=9

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle B=90^\circ$, $AB=4$, $」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직각삼각형 ABD에서 대변 BD와 빗변 AD의 비로 sin x = sqrt(105)/21을 정의한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직각삼각형 ABC의 변 AB = 4, AC = 6과 중점 D로부터 삼각비 sin x를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리로 BC = 2*sqrt(5)와 AD = sqrt(21)을 구해 sin x를 계산하므로 난이도 2이다.

**4칸**
- given: 직각삼각형←stem:「다음 그림의 직각삼각형 $ABC$($」
- goal: 삼각형←stem:「음 그림의 직각삼각형 $ABC$($」
- method: 중점(NAMED)←stem:「변 $BC$의 중점을 $D$라 하」
- condition: (없음)

**how** 변 AB = 4와 BD = sqrt(5)로 직각삼각형 ABD에서 sin x = sqrt(105)/21을 산출하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle B=90^\circ$, $AB=4$, $AC=6$이므로 피타고라스 정리에 의해 $$ BC = \sqrt{6^2-4^2} = \sqrt{20} = 2\sqrt{5} $$ 점 $D$는 $BC$의 중점이므로 $BD=\sqrt{5}$이다. 직각삼각형 $ABD$에서 $AD = \sqrt{AB^2+BD^2} = \sqrt{4^2+(\sqrt{5})^2} = \sqrt{21}$이므로 $$ \sin x = \dfrac{BD}{AD} = \dfrac{\sqrt{5}}{\sqrt{21}} = \dfrac{\sqrt{105}}{21} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\angle A+\angle B=90^\circ$인 직각삼각형 $ABC$에서 $4\sin A=-\sin A+3$일 때, $\tan A\times\dfrac{1}{\cos B}+\tan A\times\sin A$의 값은?

**보기** ① $\dfrac{17}{10}$  ② $\dfrac{19}{10}$  ③ $\dfrac{13}{10}$  ④ $\dfrac{21}{20}$  ⑤ $\dfrac{23}{20}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 4*sin A = -sin A + 3에서 5*sin A = 3이므로 sin A = 3/5이다.
2. 예각 A에 대하여 cos A = 4/5, tan A = 3/4이고 각 A + B = 90도이므로 cos B = sin A = 3/5이다.
3. 따라서 tan A * (1/cos B) + tan A * sin A = (3/4)*(5/3) + (3/4)*(3/5) = 5/4 + 9/20 = 34/20 = 17/10이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$4\sin A=-\sin A+3$에서 $5\sin A」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 각 A + B = 90도에서 cos B = sin A와 삼각비의 상호 관계를 이용해 식의 값을 구한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 직각삼각형 ABC의 삼각비 방정식으로부터 식의 값 17/10을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: sin A = 3/5로부터 다른 삼각비를 유도하고 분수 34/20 = 17/10을 계산하므로 난이도 2이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $ABC$에서」
- goal: 삼각형←stem:「irc$인 직각삼각형 $ABC$에서」
- method: 탄젠트(NAMED)←stem:「$일 때, $\tan A\times」
- condition: (없음)

**how** sin A = 3/5와 여각 공식으로 식을 정리하여 17/10을 산출해 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$4\sin A=-\sin A+3$에서 $5\sin A=3$이므로 $\sin A=\dfrac{3}{5}$이다. $A$는 예각이므로 $\cos A=\dfrac{4}{5}$, $\tan A=\dfrac{3}{4}$이고, $\angle A+\angle B=90^\circ$이므로 $\cos B=\sin A=\dfrac{3}{5}$이다. 따라서 $$ \tan A\cdot\dfrac{1}{\cos B}+\tan A\cdot\sin A = \dfrac{3}{4}\cdot\dfrac{5}{3}+\dfrac{3}{4}\cdot\dfrac{3}{5} = \dfrac{5}{4}+\dfrac{9}{20} = \dfrac{34}{20} = \dfrac{17}{10} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 $\angle B=30^\circ$, $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\dfrac{1}{1-\tan A}+\dfrac{1}{1+\tan A}$의 값은?

**보기** ① $-3$  ② $-\sqrt{3}$  ③ $-\dfrac{\sqrt{3}}{3}$  ④ $1$  ⑤ $-1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 B = 30도이므로 각 A = 180도 - 30도 - 90도 = 60도이다.
2. tan A = tan 60도 = sqrt(3)이다.
3. 1/(1 - sqrt(3)) + 1/(1 + sqrt(3)) = 2 / (1 - 3) = 2 / (-2) = -1이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle B=30^\circ$,

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle A = 180^\circ - 30^\ci」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산]
- 이유: 특수각 60도의 탄젠트 값 sqrt(3)을 분수식에 대입하여 계산한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 직각삼각형 ABC의 특수각 30도로부터 각 A = 60도의 삼각비 식을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 A = 60도에서 tan 60도 = sqrt(3)을 구하고 통분하여 -1을 얻으므로 난이도 2이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $ABC$에서」
- goal: 삼각형←stem:「irc$인 직각삼각형 $ABC$에서」
- method: 탄젠트(NAMED)←stem:「c{1}{1-\tan A}+\dfr」
- condition: (없음)

**how** 각 B = 30도에서 각 A = 60도를 얻고 tan 60도 = sqrt(3)을 통분해 -1로 산출하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 180^\circ - 30^\circ - 90^\circ = 60^\circ$이므로 $\tan A = \tan 60^\circ = \sqrt{3}$이다. 두 분수를 통분하여 정리하면 $$ \dfrac{1}{1-\tan A}+\dfrac{1}{1+\tan A} = \dfrac{(1+\tan A)+(1-\tan A)}{1-\tan^2 A} = \dfrac{2}{1-3} = \dfrac{2}{-2} = -1 $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

$\sin(2x-15^\circ)=\dfrac{\sqrt{2}}{2}$일 때, $\angle x$의 크기는? (단, $10^\circ < \angle x < 50^\circ$이다.)

**보기** ① $25^\circ$  ② $30^\circ$  ③ $35^\circ$  ④ $40^\circ$  ⑤ $45^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 10도 < x < 50도이므로 5도 < 2x - 15도 < 85도이다.
2. sin 45도 = sqrt(2)/2이므로 2x - 15도 = 45도에서 2x = 60도, 즉 x = 30도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$10^\circ < x < 50^\circ$이므로 $」
**RPM** M3-RPM-057 [삼각비 > 삼각비 > 특수각의 삼각비 > 30°·45°·60°]
- 이유: 특수각 45도의 사인 값이 sqrt(2)/2임을 이용해 일차방정식 2x - 15 = 45도를 푼다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 사인 함수의 특수각 값 sqrt(2)/2로부터 미지각 x = 30도를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: sin 45도 = sqrt(2)/2를 바로 적용하여 2x = 60도에서 x = 30도를 구하므로 난이도 1이다.

**4칸**
- given: 범위←solution:「c$이다. 이 범위에서 $\sin」
- goal: 범위←solution:「c$이다. 이 범위에서 $\sin」
- method: 범위(NAMED)←solution:「c$이다. 이 범위에서 $\sin」
- condition: (없음)

**how** sin(2x - 15도) = sqrt(2)/2에서 2x - 15 = 45도를 풀어 x = 30도로 계산하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$10^\circ < x < 50^\circ$이므로 $5^\circ < 2x-15^\circ < 85^\circ$이다. 이 범위에서 $\sin 45^\circ = \dfrac{\sqrt{2}}{2}$이므로 $$ 2x - 15^\circ = 45^\circ \implies 2x = 60^\circ \implies x = 30^\circ $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

다음 그림과 같이 반지름의 길이가 $1$이고 중심각의 크기가 $40^\circ$인 부채꼴 $AOB$에서 $AH \perp OB$일 때, 선분 $BH$의 길이는?

**보기** ① $\sin 40^\circ$  ② $\cos 40^\circ$  ③ $1-\sin 40^\circ$  ④ $1-\cos 40^\circ$  ⑤ $\tan 40^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 OA = OB = 1인 부채꼴 AOB에서 AH perp OB이다.
2. 직각삼각형 AOH에서 OH = OA * cos 40도 = cos 40도이다.
3. 따라서 선분 BH = OB - OH = 1 - cos 40도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $1$이고 중심각의 

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO → M3-05-TRIG_RATIO_APPLICATION**
- 근거 인용: 「$OA=OB=1$이고 $AH \perp OB$이므로 직」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이]
- 이유: 직각삼각형 AOH에서 코사인 정의로 OH = cos 40도를 구하고 BH를 유도한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 부채꼴 AOB의 반지름 1과 중심각 40도로부터 선분 BH의 길이를 표현하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단위원에서 코사인의 기하학적 정의로 OH = cos 40도를 파악해 1 - cos 40도를 구하므로 난이도 2이다.

**4칸**
- given: 부채꼴←stem:「\circ$인 부채꼴 $AOB$에서」
- goal: 선분←stem:「OB$일 때, 선분 $BH$의 길」
- method: 중심각(NAMED)←stem:「가 $1$이고 중심각의 크기가 $4」
- condition: (없음)

**how** 직각삼각형 AOH에서 OH = cos 40도를 얻어 선분 BH = 1 - cos 40도로 산출해 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$OA=OB=1$이고 $AH \perp OB$이므로 직각삼각형 $AOH$에서 $$ \cos 40^\circ = \dfrac{OH}{OA} = OH $$ 따라서 $BH = OB - OH = 1 - \cos 40^\circ$이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\tan x=\sqrt{3}$이고 $\sin y=\dfrac{1}{2}$일 때, $\cos(x-y)$의 값은? (단, $0^\circ < \angle x < 90^\circ$, $0^\circ < \angle y < 90^\circ$이다.)

**보기** ① $\dfrac{\sqrt{3}}{2}$  ② $\dfrac{\sqrt{2}}{2}$  ③ $\dfrac{1}{2}$  ④ $0$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 예각에서 tan 60도 = sqrt(3)이므로 x = 60도이고, sin 30도 = 1/2이므로 y = 30도이다.
2. 따라서 x - y = 60도 - 30도 = 30도이고, cos(30도) = sqrt(3)/2이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$, $y$가 모두 예각이므로 $\tan 60^\c」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산]
- 이유: 특수각 x = 60도, y = 30도를 구하고 cos 30도 = sqrt(3)/2를 계산한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각 x = 60도, y = 30도 조건으로부터 두 각의 차의 코사인 값을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x = 60도와 y = 30도를 즉시 찾아 cos 30도 = sqrt(3)/2를 구하므로 난이도 1이다.

**4칸**
- given: 탄젠트←stem:「$\tan x=\sqrt」
- goal: 탄젠트←solution:「예각이므로 $\tan 60^\cir」
- method: 예각(NAMED)←solution:「$y$가 모두 예각이므로 $\ta」
- condition: (없음)

**how** x = 60도, y = 30도에서 x - y = 30도를 얻고 cos 30도 = sqrt(3)/2로 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$, $y$가 모두 예각이므로 $\tan 60^\circ=\sqrt{3}$에서 $x=60^\circ$, $\sin 30^\circ=\dfrac{1}{2}$에서 $y=30^\circ$이다. 따라서 $x-y=30^\circ$이므로 $\cos(x-y) = \cos 30^\circ = \dfrac{\sqrt{3}}{2}$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

다음 보기의 삼각비의 값을 작은 것부터 차례로 나열한 것은?

<보기> ㄱ. $\sin 45^\circ$　ㄴ. $\tan 70^\circ$　ㄷ. $\cos 65^\circ$　ㄹ. $\tan 45^\circ$　ㅁ. $\sin 80^\circ$

**보기** ① ㄱ-ㄷ-ㅁ-ㄹ-ㄴ  ② ㄷ-ㅁ-ㄱ-ㄹ-ㄴ  ③ ㄷ-ㄱ-ㅁ-ㄹ-ㄴ  ④ ㄷ-ㄱ-ㄹ-ㅁ-ㄴ  ⑤ ㄱ-ㅁ-ㄷ-ㄹ-ㄴ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 값을 비교하면 cos 65도 = sin 25도 < sin 45도 = sqrt(2)/2 < sin 80도 < tan 45도 = 1 < tan 70도이다.
2. 따라서 작은 것부터 차례로 나열하면 ㄷ - ㄱ - ㅁ - ㄹ - ㄴ이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「각 삼각비의 대소를 비교하면 다음과 같다.  - ㄷ: 」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계]
- 이유: 0도에서 90도 사이에서 사인의 증가와 코사인의 감소 성질을 바탕으로 대소를 비교한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_MONOTONIC
- 이유: 각도 45도, 65도, 70도, 80도의 삼각비 값의 대소 관계를 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 각도 45도, 65도, 70도, 80도의 사인과 코사인, 탄젠트 값을 순서대로 정렬하므로 난이도 2이다.

**4칸**
- given: 삼각비←stem:「다음 보기의 삼각비의 값을 작은」
- goal: 대소비교←solution:「각 삼각비의 대소를 비교하면 다」
- method: 삼각비(NAMED)←stem:「다음 보기의 삼각비의 값을 작은」
- condition: (없음)

**how** 각도 45도, 65도, 70도, 80도의 삼각비 값을 비교하여 ㄷ-ㄱ-ㅁ-ㄹ-ㄴ 순서임을 확인해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 삼각비의 대소를 비교하면 다음과 같다.

- ㄷ: $\cos 65^\circ < \cos 45^\circ = \dfrac{\sqrt{2}}{2}$  
- ㄱ: $\sin 45^\circ = \dfrac{\sqrt{2}}{2}$  
- ㅁ: $45^\circ < 80^\circ < 90^\circ$이므로 $\dfrac{\sqrt{2}}{2} < \sin 80^\circ < 1$  
- ㄹ: $\tan 45^\circ = 1$  
- ㄴ: $70^\circ > 45^\circ$이므로 $\tan 70^\circ > \tan 45^\circ = 1$ 따라서 작은 것부터 나열하면 ㄷ-ㄱ-ㅁ-ㄹ-ㄴ이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 삼각비의 표를 이용하여 $\tan x^\circ=0.2493$, $\cos 15^\circ=y$일 때, $x+y$의 값을 구하면?

| 각도 | $\sin$ | $\cos$ | $\tan$ |
| :---: | :---: | :---: | :---: |
| $14^\circ$ | $0.2419$ | $0.9703$ | $0.2493$ |
| $15^\circ$ | $0.2588$ | $0.9659$ | $0.2679$ |
| $16^\circ$ | $0.2756$ | $0.9613$ | $0.2867$ |

**보기** ① $13.9659$  ② $14.9659$  ③ $14.9703$  ④ $15.9659$  ⑤ $15.9613$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 표에서 tan 14도 = 0.2493이므로 x = 14이다.
2. 또 cos 15도 = 0.9659이므로 y = 0.9659이다.
3. 따라서 x + y = 14 + 0.9659 = 14.9659이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「표에서 $\tan 14^\circ = 0.2493$이므」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 삼각비 표에서 tan 14도 = 0.2493과 cos 15도 = 0.9659를 찾아 합을 계산한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_TABLE_LOOKUP
- 이유: 삼각비의 표에서 주어진 소수 0.2493에 해당하는 각도와 값을 판독하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 표에서 x = 14와 y = 0.9659를 직접 찾아 더하므로 난이도 1이다.

**4칸**
- given: 삼각비←stem:「다음 삼각비의 표를 이용하」
- goal: 탄젠트←stem:「이용하여 $\tan x^\circ」
- method: 삼각비(NAMED)←stem:「다음 삼각비의 표를 이용하」
- condition: (없음)

**how** 표에서 x = 14와 y = 0.9659를 읽어 x + y = 14.9659로 계산하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

표에서 $\tan 14^\circ = 0.2493$이므로 $x=14$이다. 또 $\cos 15^\circ = 0.9659$이므로 $y=0.9659$이다. 따라서 $x+y = 14 + 0.9659 = 14.9659$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 그림과 같이 $\angle C=90^\circ$, $AB=8$, $\angle B=32^\circ$인 직각삼각형 $ABC$에서 $a+b$의 값은? (단, $\sin 32^\circ=0.53$, $\cos 32^\circ=0.85$, $\tan 32^\circ=0.62$로 계산한다.)

**보기** ① $10.96$  ② $10.98$  ③ $11.00$  ④ $11.02$  ⑤ $11.04$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 빗변 AB = 8이고 각 B = 32도이다.
2. a = 8 * sin 32도 = 8 * 0.53 = 4.24이다.
3. b = 8 * cos 32도 = 8 * 0.85 = 6.80이므로 a + b = 4.24 + 6.80 = 11.04이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle C=90^\circ$,

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO → M3-05-TRIG_RATIO_APPLICATION**
- 근거 인용: 「빗변이 $AB=8$이고 $\angle B=32^\cir」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이]
- 이유: 빗변 AB = 8과 각 B = 32도의 삼각비로 두 변 a, b의 길이를 각각 산출한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 직각삼각형 ABC에서 빗변과 삼각비 값으로 두 변의 합 11.04를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sin 32도 = 0.53과 cos 32도 = 0.85를 곱해 합산하여 11.04를 얻으므로 난이도 2이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $ABC$에서」
- goal: 삼각형←stem:「irc$인 직각삼각형 $ABC$에서」
- method: 탄젠트(NAMED)←stem:「.85$, $\tan 32^\cir」
- condition: (없음)

**how** a = 8*0.53 = 4.24와 b = 8*0.85 = 6.80에서 a + b = 11.04를 계산하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

빗변이 $AB=8$이고 $\angle B=32^\circ$이므로 $$ a = 8\sin 32^\circ = 8\times 0.53 = 4.24, \qquad b = 8\cos 32^\circ = 8\times 0.85 = 6.80 $$ 따라서 $a+b = 4.24 + 6.80 = 11.04$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 그림과 같이 지면에 수직으로 서 있는 건물로부터 $40,\mathrm{m}$ 떨어진 지점에서 건물의 꼭대기를 올려다본 각의 크기가 $42^\circ$이다. 사람의 눈높이가 $1.6,\mathrm{m}$일 때, 이 건물의 높이는? (단, $\sin 42^\circ=0.67$, $\cos 42^\circ=0.74$, $\tan 42^\circ=0.90$으로 계산한다.)

**보기** ① $34.6,\mathrm{m}$  ② $35.6,\mathrm{m}$  ③ $36.6,\mathrm{m}$  ④ $37.6,\mathrm{m}$  ⑤ $38.6,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 눈높이에서 건물 꼭대기까지의 높이를 h라 하면 수평거리 40 m에서 tan 42도 = h / 40이다.
2. h = 40 * tan 42도 = 40 * 0.90 = 36 m이다.
3. 건물의 높이는 36 + 1.6 = 37.6 m이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 지면에 수직으로 서 있는 건물로부터 

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「눈높이에서 건물 꼭대기까지의 높이를 $h,\mathrm」
**RPM** M3-RPM-063 [삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리]
- 이유: 수평거리 40 m와 올려다본 각 42도에서 tan 42도를 이용해 높이 37.6 m를 계산한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 앙각 42도와 거리 40 m, 눈높이 1.6 m를 이용해 실제 건물 높이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: tan 42도 = 0.90으로 h = 36 m를 구하고 눈높이 1.6 m를 더하므로 난이도 2이다.

**4칸**
- given: 거리←solution:「$라 하면 수평거리가 $40,\m」
- goal: 높이←stem:「다. 사람의 눈높이가 $1.6,\」
- method: 탄젠트(NAMED)←stem:「.74$, $\tan 42^\cir」
- condition: (없음)

**how** h = 40 * 0.90 = 36 m에 눈높이 1.6 m를 더해 건물의 높이 37.6 m를 산출하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

눈높이에서 건물 꼭대기까지의 높이를 $h,\mathrm{m}$라 하면 수평거리가 $40,\mathrm{m}$이므로 $$ \tan 42^\circ = \dfrac{h}{40} \implies h = 40\times 0.90 = 36,\mathrm{m} $$ 건물의 전체 높이는 눈높이 $1.6,\mathrm{m}$를 더하여 $36 + 1.6 = 37.6,\mathrm{m}$이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점


**발문**

다음 그림과 같이 $AB=6,\mathrm{cm}$, $BC=12,\mathrm{cm}$, $\angle B=60^\circ$인 $\triangle ABC$의 넓이는?

**보기** ① $18\sqrt{3},\mathrm{cm}^2$  ② $18\sqrt{2},\mathrm{cm}^2$  ③ $20\sqrt{3},\mathrm{cm}^2$  ④ $24\sqrt{3},\mathrm{cm}^2$  ⑤ $36\sqrt{3},\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 ABC에서 변 AB = 6 cm, BC = 12 cm이고 사이각 B = 60도이다.
2. 삼각형의 넓이는 (1/2) * 6 * 12 * sin 60도 = 36 * (sqrt(3)/2) = 18*sqrt(3) cm^2이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $AB=6,\mathrm{cm}$, 

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A$에서 $BC$에 내린 수선의 길이를 $h$라 하면」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 두 변 AB = 6, BC = 12와 끼인각 60도의 사인 넓이 공식으로 18*sqrt(3)을 계산한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_CHAINED_MEASURE
- 이유: 두 변과 끼인각 60도로 삼각형 ABC의 넓이 18*sqrt(3)을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 넓이 공식 (1/2)*ab*sin B를 바로 적용해 18*sqrt(3)을 구하므로 난이도 1이다.

**4칸**
- given: 넓이←stem:「e ABC$의 넓이는?」
- goal: 넓이←stem:「e ABC$의 넓이는?」
- method: 넓이(NAMED)←solution:「e ABC$의 넓이는 $\dfra」
- condition: (없음)

**how** 변 AB = 6과 BC = 12, sin 60도 공식으로 넓이 18*sqrt(3) cm^2를 산출해 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A$에서 $BC$에 내린 수선의 길이를 $h$라 하면 $$ h = AB\sin 60^\circ = 6\times\dfrac{\sqrt{3}}{2} = 3\sqrt{3},\mathrm{cm} $$ 따라서 $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 12\times 3\sqrt{3} = 18\sqrt{3},\mathrm{cm}^2$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점


**발문**

다음 그림과 같이 반지름의 길이가 $6,\mathrm{cm}$인 원 $O$에 내접하는 $\triangle ABC$에서 $\widehat{AB}:\widehat{BC}:\widehat{CA}=3:4:2$일 때, $\triangle ABO$의 넓이는?

**보기** ① $6\sqrt{3},\mathrm{cm}^2$  ② $8\sqrt{3},\mathrm{cm}^2$  ③ $9\sqrt{3},\mathrm{cm}^2$  ④ $12\sqrt{3},\mathrm{cm}^2$  ⑤ $18\sqrt{3},\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 호의 길이의 비가 3 : 4 : 2이므로 중심각 angle AOB = 360도 * (3 / 9) = 120도이다.
2. 반지름이 6 cm이므로 삼각형 ABO의 넓이는 (1/2) * 6 * 6 * sin(180도 - 120도) = 18 * sin 60도 = 9*sqrt(3) cm^2이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $6,\mathrm{

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 원에서 호의 길이의 비는 중심각의 크기의 비와 같으」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: 호의 비로부터 중심각 120도를 구하고 둔각 삼각형 넓이 공식으로 9*sqrt(3)을 구한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_CHAINED_MEASURE
- 이유: 원 O에 내접하는 삼각형 ABC의 호의 비례배분으로 삼각형 ABO 넓이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 중심각 120도를 비례배분하고 둔각 삼각비 공식으로 9*sqrt(3)을 얻으므로 난이도 2이다.

**4칸**
- given: 반지름←stem:「그림과 같이 반지름의 길이가 $6」
- goal: 넓이←stem:「e ABO$의 넓이는?」
- method: 길이(NAMED)←stem:「같이 반지름의 길이가 $6,\ma」
- condition: (없음)

**how** 호의 비에서 중심각 angle AOB = 120도를 얻고 넓이 공식으로 9*sqrt(3) cm^2를 산출해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

한 원에서 호의 길이의 비는 중심각의 크기의 비와 같으므로 $$ \angle AOB = 360^\circ \times \dfrac{3}{3+4+2} = 120^\circ $$ 점 $O$에서 $AB$에 내린 수선의 발을 $M$이라 하면 $OA=OB=6,\mathrm{cm}$이므로 $\angle AOM=60^\circ$이다. $$ OM = 6\cos 60^\circ = 3,\mathrm{cm}, \qquad AM = 6\sin 60^\circ = 3\sqrt{3},\mathrm{cm} $$ 따라서 $AB = 2AM = 6\sqrt{3},\mathrm{cm}$이므로 $\triangle ABO$의 넓이는 $\dfrac{1}{2}\times 6\sqrt{3}\times 3 = 9\sqrt{3},\mathrm{cm}^2$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점


**발문**

다음 그림과 같이 $AB=6\sqrt{2}$, $BC=16$, $CD=8$, $\angle ABC=45^\circ$, $\angle ACD=30^\circ$인 사각형 $ABCD$의 넓이는?

**보기** ① $4(6+\sqrt{34})$  ② $4(12+\sqrt{34})$  ③ $8(6+\sqrt{34})$  ④ $4(12+\sqrt{17})$  ⑤ $8(12+\sqrt{34})$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. A에서 BC에 내린 수선의 발 H에 대하여 AH = BH = 6*sqrt(2) * sin 45도 = 6이고 HC = 16 - 6 = 10이다.
2. AC = sqrt(6^2 + 10^2) = sqrt(136) = 2*sqrt(34)이다.
3. triangle ABC 넓이는 (1/2)*16*6 = 48이고 triangle ACD 넓이는 (1/2)*2*sqrt(34)*8*sin 30도 = 4*sqrt(34)이므로 합은 4(12 + sqrt(34))이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $AB=6\sqrt{2}$, $BC=

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A$에서 $BC$에 내린 수선의 발을 $H$라 하면 」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이]
- 이유: 보조선 AH로 AC = 2*sqrt(34)를 구하고 두 삼각형의 넓이를 합산하여 사각형 ABCD 넓이를 계산한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_CHAINED_MEASURE
- 이유: 변 BC = 16과 각 45도, 30도로부터 사각형 ABCD의 분할 넓이를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 수선을 내려 AC = 2*sqrt(34)를 구하고 두 삼각형 넓이를 결합하므로 난이도 3이다.

**4칸**
- given: 사각형←stem:「\circ$인 사각형 $ABCD$의」
- goal: 넓이←stem:「$ABCD$의 넓이는?」
- method: 수선(NAMED)←solution:「BC$에 내린 수선의 발을 $H$」
- condition: (없음)

**how** triangle ABC 넓이 48과 triangle ACD 넓이 4*sqrt(34)를 더해 4(12 + sqrt(34))를 산출하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A$에서 $BC$에 내린 수선의 발을 $H$라 하면 $AB=6\sqrt{2}$, $\angle ABC=45^\circ$이므로 $AH=BH=6$이다. $BC=16$이므로 $HC=16-6=10$이고, 직각삼각형 $AHC$에서 $AC=\sqrt{6^2+10^2}=\sqrt{136}=2\sqrt{34}$이다. $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 16\times 6 = 48$이다. $\triangle ACD$의 넓이는 $\dfrac{1}{2}\times AC\times CD\times\sin 30^\circ = \dfrac{1}{2}\times 2\sqrt{34}\times 8\times\dfrac{1}{2} = 4\sqrt{34}$이다. 따라서 사각형 $ABCD$의 넓이는 $48 + 4\sqrt{34} = 4(12+\sqrt{34})$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

다음 그림의 원 $O$에서 $AB \perp OM$이고 $OA=8,\mathrm{cm}$, $OM=3,\mathrm{cm}$일 때, 현 $AB$의 길이는?

**보기** ① $8,\mathrm{cm}$  ② $10,\mathrm{cm}$  ③ $2\sqrt{35},\mathrm{cm}$  ④ $4\sqrt{13},\mathrm{cm}$  ⑤ $2\sqrt{55},\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원의 중심에서 현 AB에 내린 수선은 현을 이등분하므로 AM = BM이다.
2. 직각삼각형 OAM에서 OA = 8 cm, OM = 3 cm이므로 AM = sqrt(8^2 - 3^2) = sqrt(55) cm이다.
3. 따라서 현 AB = 2 * AM = 2*sqrt(55) cm이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 $AB \perp OM$이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원의 중심에서 현에 내린 수선은 현을 이등분하므로 $A」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 중심에서 현 AB에 내린 수선 OM = 3과 반지름 8로부터 현의 길이 2*sqrt(55)를 계산한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 현의 수직이등분 성질과 피타고라스 정리로 현 AB의 길이를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 피타고라스 정리 AM = sqrt(55)와 2배 공식으로 2*sqrt(55)를 바로 구하므로 난이도 1이다.

**4칸**
- given: 길이←stem:「현 $AB$의 길이는?」
- goal: 길이←stem:「현 $AB$의 길이는?」
- method: 수선(NAMED)←solution:「서 현에 내린 수선은 현을 이등분」
- condition: (없음)

**how** 직각삼각형 OAM에서 AM = sqrt(55)를 얻고 현 AB = 2*sqrt(55) cm로 계산하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심에서 현에 내린 수선은 현을 이등분하므로 $AM=BM$이다. 직각삼각형 $OAM$에서 $AM = \sqrt{8^2-3^2} = \sqrt{55},\mathrm{cm}$이므로 $$ AB = 2AM = 2\sqrt{55},\mathrm{cm} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림에서 $\widehat{AB}$는 원의 일부분이다. $CD$가 현 $AB$의 수직이등분선이고 $AD=6$, $CD=3$일 때, 이 원의 반지름의 길이는?

**보기** ① $6$  ② $\dfrac{13}{2}$  ③ $7$  ④ $\dfrac{15}{2}$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. CD가 현 AB의 수직이등분선이므로 원의 중심 O는 직선 CD 위에 있다.
2. 반지름을 r이라 하면 직각삼각형 OAD에서 OD = r - 3이고 AD = 6이다.
3. r^2 = (r - 3)^2 + 6^2에서 r^2 = r^2 - 6r + 45이므로 6r = 45, 즉 r = 15/2이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\widehat{AB}$는 원의 일부분

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「$CD$는 현 $AB$의 수직이등분선이므로 원의 중심 」
**RPM** M3-RPM-068 [원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심]
- 이유: 현 AB = 12의 수직이등분선 CD = 3과 직각삼각형 OAD의 피타고라스 정리로 반지름 15/2를 구한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_PERP_BISECTOR
- 이유: 원호의 현 AB와 수직이등분선 길이로부터 원의 반지름 15/2를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 방정식 r^2 = (r-3)^2 + 36을 세워 6r = 45에서 r = 15/2를 도출하므로 난이도 2이다.

**4칸**
- given: 수직이등분선←stem:「현 $AB$의 수직이등분선이고 $AD=6」
- goal: 반지름←stem:「때, 이 원의 반지름의 길이는?」
- method: 정리(NAMED)←solution:「서 피타고라스 정리에 의해 $$」
- condition: (없음)

**how** 직각삼각형 OAD에서 r^2 = (r - 3)^2 + 36을 풀어 반지름 r = 15/2로 계산하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$CD$는 현 $AB$의 수직이등분선이므로 원의 중심 $O$는 직선 $CD$ 위에 있다. 반지름을 $r$이라 하면 $OC=r$, $OD=r-3$이다. 직각삼각형 $OAD$에서 피타고라스 정리에 의해 $$ r^2 = (r-3)^2 + 6^2 \implies r^2 = r^2 - 6r + 9 + 36 \implies 6r = 45 \implies r = \dfrac{15}{2} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

다음 그림과 같이 반지름의 길이가 $6,\mathrm{cm}$인 원 $O$ 위의 한 점이 원의 중심 $O$에 오도록 접었을 때, 접히는 선분 $AB$의 길이는?

**보기** ① $6\sqrt{2},\mathrm{cm}$  ② $6\sqrt{3},\mathrm{cm}$  ③ $8\sqrt{2},\mathrm{cm}$  ④ $9,\mathrm{cm}$  ⑤ $10,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접는 선 AB는 반경 OP를 수직이등분하므로 중심거리 OM = 6 / 2 = 3 cm이다.
2. 직각삼각형 OAM에서 AM = sqrt(6^2 - 3^2) = sqrt(27) = 3*sqrt(3) cm이다.
3. 따라서 선분 AB의 길이는 2 * AM = 6*sqrt(3) cm이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $6,\mathrm{

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 위의 점을 $P$라 하면 $OP=6,\mathrm{」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선]
- 이유: 원의 중심을 지나도록 접은 선의 중심거리 OM = 3과 현 AB = 6*sqrt(3)의 관계를 활용한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 반지름 6 cm인 원을 접었을 때 생기는 현 AB의 길이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 중심거리 OM = 3을 파악하고 직각삼각형에서 3*sqrt(3)의 2배인 6*sqrt(3)을 구하므로 난이도 2이다.

**4칸**
- given: 반지름←stem:「그림과 같이 반지름의 길이가 $6」
- goal: 선분←stem:「때, 접히는 선분 $AB$의 길」
- method: 선분(NAMED)←stem:「때, 접히는 선분 $AB$의 길」
- condition: (없음)

**how** 중심거리 OM = 3과 OA = 6에서 AM = 3*sqrt(3)을 얻어 현 AB = 6*sqrt(3) cm로 계산하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 위의 점을 $P$라 하면 $OP=6,\mathrm{cm}$이고, 접는 선 $AB$는 $OP$의 수직이등분선이다. $AB$와 $OP$의 교점을 $M$이라 하면 $OM=3,\mathrm{cm}$, $OA=6,\mathrm{cm}$이므로 $$ AM = \sqrt{6^2-3^2} = 3\sqrt{3},\mathrm{cm} $$ 따라서 $AB = 2AM = 6\sqrt{3},\mathrm{cm}$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 3점


**발문**

다음 그림과 같이 원 $O$의 두 현 $AB$, $AC$가 원의 중심 $O$로부터 같은 거리에 있다. $\angle MON=124^\circ$일 때, $\angle B$의 크기는?

**보기** ① $62^\circ$  ② $64^\circ$  ③ $66^\circ$  ④ $68^\circ$  ⑤ $70^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심에서 같은 거리에 있는 두 현의 길이는 같으므로 AB = AC이고 triangle ABC는 이등변삼각형이다.
2. 사각형 AMON에서 각 A = 180도 - 124도 = 56도이다.
3. 따라서 angle B = (180도 - 56도) / 2 = 124도 / 2 = 62도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$의 두 현 $AB$, $AC

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이]
- 이유: 중심거리 같은 두 현 AB = AC에 의한 이등변삼각형에서 중심각 MON = 124도로 밑각 62도를 구한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원 O의 두 현의 거리 조건과 각 MON = 124도로부터 삼각형 ABC의 각 B를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각 합 180도로 각 A = 56도를 구하고 이등변삼각형 밑각 62도를 도출하므로 난이도 2이다.

**4칸**
- given: 거리←stem:「$로부터 같은 거리에 있다. $\」
- goal: 중심←stem:「AC$가 원의 중심 $O$로부터」
- method: 이등변삼각형(NAMED)←solution:「e ABC$는 이등변삼각형이다. $OM」
- condition: (없음)

**how** 사각형 AMON에서 각 A = 56도를 얻고 이등변삼각형 밑각 angle B = 62도로 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=AC$이고, $\triangle ABC$는 이등변삼각형이다. $OM \perp AB$, $ON \perp AC$이므로 사각형 $AMON$에서 $$ \angle A = 360^\circ - 90^\circ - 90^\circ - 124^\circ = 56^\circ $$ 따라서 $\angle B = \dfrac{180^\circ - 56^\circ}{2} = 62^\circ$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

다음 그림에서 $PA$, $PB$는 반지름의 길이가 $3,\mathrm{cm}$인 원 $O$의 접선이고 두 점 $A$, $B$는 접점이다. $\angle APB=60^\circ$일 때, 사각형 $APBO$의 넓이는?

**보기** ① $3\sqrt{3},\mathrm{cm}^2$  ② $4\sqrt{3},\mathrm{cm}^2$  ③ $6\sqrt{3},\mathrm{cm}^2$  ④ $9\sqrt{3},\mathrm{cm}^2$  ⑤ $12\sqrt{3},\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 APO = 30도이고 반지름 OA = 3 cm이므로 직각삼각형 AOP에서 PA = 3 / tan 30도 = 3*sqrt(3) cm이다.
2. triangle AOP의 넓이는 (1/2) * 3 * 3*sqrt(3) = (9/2)*sqrt(3) cm^2이다.
3. 따라서 사각형 APBO의 넓이는 2 * (9/2)*sqrt(3) = 9*sqrt(3) cm^2이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $PA$, $PB$는 반지름의 길이가 $

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「$OA \perp PA$, $OB \perp PB$이고」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선]
- 이유: 접선 각 APB = 60도와 반지름 OA = 3으로부터 접선의 길이와 사각형 APBO 넓이를 산출한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 원 밖의 점에서 그은 두 접선과 사각형 APBO의 넓이 9*sqrt(3)을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반각 30도와 tan 30도로 접선 길이 3*sqrt(3)을 얻어 합동 삼각형 두 개의 넓이를 합산하므로 난이도 2이다.

**4칸**
- given: 접선←stem:「원 $O$의 접선이고 두 점 $」
- goal: 넓이←stem:「$APBO$의 넓이는?」
- method: 탄젠트(NAMED)←solution:「$에서 $$ \tan 30^\cir」
- condition: (없음)

**how** 각 APO = 30도에서 PA = 3*sqrt(3)을 구하고 두 직각삼각형의 넓이를 더해 9*sqrt(3) cm^2로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$OA \perp PA$, $OB \perp PB$이고 $\angle APO=30^\circ$이므로 직각삼각형 $AOP$에서 $$ \tan 30^\circ = \dfrac{OA}{PA} = \dfrac{3}{PA} \implies PA = 3\sqrt{3},\mathrm{cm} $$ 사각형 $APBO$는 합동인 두 직각삼각형 $AOP$, $BOP$로 이루어져 있으므로 넓이는 $$ 2\times\left(\dfrac{1}{2}\times 3\times 3\sqrt{3}\right) = 9\sqrt{3},\mathrm{cm}^2 $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

다음 그림에서 $AT$, $AT'$, $BC$는 원 $O$의 접선이고 세 점 $T$, $T'$, $E$는 접점이다. $AO=13,\mathrm{cm}$, $OT=5,\mathrm{cm}$일 때, $\triangle ABC$의 둘레의 길이는?

**보기** ① $16,\mathrm{cm}$  ② $18,\mathrm{cm}$  ③ $20,\mathrm{cm}$  ④ $22,\mathrm{cm}$  ⑤ $24,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 AOT에서 AO = 13 cm, OT = 5 cm이므로 AT = sqrt(13^2 - 5^2) = 12 cm이다.
2. 접선의 성질에 의해 AT = AT = 12 cm이고 BT = BE, CT = CE이다.
3. 따라서 triangle ABC의 둘레의 길이는 AT + AT = 2 * 12 = 24 cm이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $AT$, $AT'$, $BC$는 원 $

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「$OT \perp AT$이므로 직각삼각형 $AOT$에서」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 접선의 길이 AT = 12 cm와 삼각형 ABC 둘레가 2*AT = 24 cm가 됨을 활용한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 직각삼각형 AOT의 피타고라스 정리와 접선 성질로 삼각형 ABC의 둘레를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 피타고라스 정리로 AT = 12를 구하고 둘레 공식 2*AT = 24 cm를 바로 적용하므로 난이도 2이다.

**4칸**
- given: 접선←stem:「원 $O$의 접선이고 세 점 $」
- goal: 둘레←stem:「e ABC$의 둘레의 길이는?」
- method: 접선(NAMED)←stem:「원 $O$의 접선이고 세 점 $」
- condition: (없음)

**how** 직각삼각형 AOT에서 AT = 12 cm를 얻어 삼각형 ABC의 둘레를 2*12 = 24 cm로 계산하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$OT \perp AT$이므로 직각삼각형 $AOT$에서 $AT = \sqrt{13^2-5^2} = 12,\mathrm{cm}$이다. 접선의 성질에 의해 $AT=AT'=12$, $BT=BE$, $CT'=CE$이므로 $\triangle ABC$의 둘레의 길이는 $$ AB+BC+CA = (AB+BT)+(AC+CT') = AT+AT' = 12+12 = 24,\mathrm{cm} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

다음 그림에서 $DA$, $CB$, $CD$는 지름이 $AB$인 반원 $O$의 접선이고 세 점 $A$, $B$, $E$는 접점이다. $AO=6,\mathrm{cm}$, $DC=16,\mathrm{cm}$일 때, 사각형 $ABCD$의 둘레의 길이는?

**보기** ① $40,\mathrm{cm}$  ② $42,\mathrm{cm}$  ③ $44,\mathrm{cm}$  ④ $46,\mathrm{cm}$  ⑤ $48,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. AO = 6 cm이므로 반원의 지름 AB = 12 cm이다.
2. 접선의 길이는 같으므로 DA = DE, CB = CE이고 AD + BC = DE + CE = DC = 16 cm이다.
3. 따라서 사각형 ABCD의 둘레는 AB + BC + CD + DA = 12 + 16 + 16 = 44 cm이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $DA$, $CB$, $CD$는 지름이 

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「$AO=6,\mathrm{cm}$이므로 반원의 지름 $」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 반원의 지름 AB = 12와 접선의 성질 AD + BC = 16을 더해 둘레 44 cm를 산출한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 반원의 접선과 접점 조건으로부터 사각형 ABCD의 둘레를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 지름 12와 접선 합 AD + BC = 16을 더해 단순 덧셈 12 + 16 + 16 = 44를 수행하므로 난이도 2이다.

**4칸**
- given: 반원←stem:「이 $AB$인 반원 $O$의 접선」
- goal: 둘레←stem:「$ABCD$의 둘레의 길이는?」
- method: 접선(NAMED)←stem:「반원 $O$의 접선이고 세 점 $」
- condition: (없음)

**how** 지름 AB = 12 cm와 접선 성질 AD + BC = DC = 16 cm에서 둘레 44 cm를 산출하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$AO=6,\mathrm{cm}$이므로 반원의 지름 $AB=12,\mathrm{cm}$이다. 접선의 길이는 같으므로 $DA=DE$, $CB=CE$이고, 따라서 $AD+BC=DE+CE=DC=16,\mathrm{cm}$이다. 그러므로 사각형 $ABCD$의 둘레의 길이는 $$ AB + (AD + BC) + CD = 12 + 16 + 16 = 44,\mathrm{cm} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

[서술형] 다음 그림과 같이 $EF=6,\mathrm{cm}$, $FG=8,\mathrm{cm}$, $AE=6,\mathrm{cm}$인 직육면체 $ABCD-EFGH$에서 $\angle AGE=x$라 할 때, $\cos x$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{5\sqrt{34}}{34}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 EFGH에서 가로 6 cm, 세로 8 cm이므로 EG = sqrt(6^2 + 8^2) = 10 cm이다.
2. AE = 6 cm이므로 직각삼각형 AEG에서 AG = sqrt(10^2 + 6^2) = sqrt(136) = 2*sqrt(34) cm이다.
3. 따라서 cos x = EG / AG = 10 / (2*sqrt(34)) = 5 / sqrt(34) = (5*sqrt(34))/34이다.
- 작성자 답: $\dfrac{5\sqrt{34}}{34}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형] 다음 그림과 같이 $EF=6,\mathrm{

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「밑면 $EFGH$의 가로와 세로가 각각 $6,\math」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: 직육면체의 대각선 AG와 밑면 대각선 EG = 10의 비로부터 cos x를 계산한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직육면체 ABCD-EFGH에서 공간 대각선의 삼각비 cos x를 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 밑면 대각선 10과 공간 대각선 2*sqrt(34)를 차례로 구해 코사인 정의를 적용하므로 난이도 2이다.

**4칸**
- given: 직육면체←stem:「m{cm}$인 직육면체 $ABCD-E」
- goal: 직각삼각형←solution:「EG$이므로 직각삼각형 $AEG$에서」
- method: 삼각형(NAMED)←solution:「G$이므로 직각삼각형 $AEG$에서」
- condition: (없음)

**how** 밑면 대각선 EG = 10과 AG = 2*sqrt(34)로부터 cos x = (5*sqrt(34))/34를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

밑면 $EFGH$의 가로와 세로가 각각 $6,\mathrm{cm}$, $8,\mathrm{cm}$이므로 $$ EG = \sqrt{6^2+8^2} = 10,\mathrm{cm} $$ $AE=6,\mathrm{cm}$이고 $AE \perp EG$이므로 직각삼각형 $AEG$에서 $$ AG = \sqrt{10^2+6^2} = \sqrt{136} = 2\sqrt{34},\mathrm{cm} $$ 따라서 $$ \cos x = \dfrac{EG}{AG} = \dfrac{10}{2\sqrt{34}} = \dfrac{5\sqrt{34}}{34} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

[서술형] 좌표평면 위의 세 점 $A(4, 5)$, $B(-2, 1)$, $C(2, -2)$를 꼭짓점으로 하는 $\triangle ABC$에 대하여 $\tan B$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{17}{6}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 점 사이의 거리 공식에서 AB^2 = 52, BC = 5, AC^2 = 53이다.
2. A에서 직선 BC에 내린 수선의 발 H에 대하여 직선 거리 공식으로 높이 AH = 34/5를 얻는다.
3. BH = sqrt(AB^2 - AH^2) = sqrt(52 - 1156/25) = 12/5이므로 tan B = AH / BH = (34/5)/(12/5) = 17/6이다.
- 작성자 답: $\dfrac{17}{6}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「두 점 사이의 거리 공식에 의해 $$ AB^2 = (4」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용]
- 이유: 좌표평면의 삼각형 ABC에서 수선 AH = 34/5를 내려 tan B = 17/6을 유도한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 좌표평면의 세 점 A, B, C로 이루어진 삼각형 ABC에서 tan B의 값을 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 수선의 발 H를 도입해 높이 AH = 34/5와 밑변 분할 BH = 12/5를 계산해 탄젠트를 구하므로 난이도 3이다.

**4칸**
- given: 꼭짓점←stem:「, -2)$를 꼭짓점으로 하는 $\」
- goal: 탄젠트←stem:「에 대하여 $\tan B$의 값을」
- method: 수선(NAMED)←solution:「BC$에 내린 수선의 발을 $H$」
- condition: (없음)

**how** 수선 AH = 34/5와 BH = 12/5를 구하여 tan B = (34/5)/(12/5) = 17/6으로 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 점 사이의 거리 공식에 의해 $$ AB^2 = (4+2)^2+(5-1)^2 = 52, \quad BC = \sqrt{(2+2)^2+(-2-1)^2} = 5, \quad AC^2 = (4-2)^2+(5+2)^2 = 53 $$ $A$에서 직선 $BC$에 내린 수선의 발을 $H$라 하고 $BH=t$, $AH=h$라 하면 두 직각삼각형 $ABH$, $ACH$에서 $$ h^2 + t^2 = 52, \qquad h^2 + (5-t)^2 = 53 $$ 두 식을 빼면 $t^2 - (5-t)^2 = -1$, 즉 $10t - 25 = -1$이므로 $t = \dfrac{12}{5}$이다. $$ h^2 = 52 - \left(\dfrac{12}{5}\right)^2 = \dfrac{1156}{25} \implies h = \dfrac{34}{5} $$ 따라서 $\tan B = \dfrac{AH}{BH} = \dfrac{34/5}{12/5} = \dfrac{17}{6}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

[서술형] 다음 그림에서 원 $O$는 $\angle B=90^\circ$인 직각삼각형 $ABC$의 내접원이고, 세 점 $D$, $E$, $F$는 접점이다. $AF=6,\mathrm{cm}$, $CF=9,\mathrm{cm}$일 때, $\triangle ABC$에서 원 $O$를 제외한 색칠한 부분의 넓이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(54-9\pi),\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접선의 성질에 의해 AD = AF = 6 cm, CE = CF = 9 cm이고 내접원 반지름을 r이라 하면 BD = BE = r이다.
2. 직각삼각형 ABC에서 (6 + r)^2 + (9 + r)^2 = 15^2를 풀면 2r^2 + 30r - 108 = 0에서 r = 3 cm이다.
3. 삼각형 ABC의 넓이는 (1/2)*9*12 = 54 cm^2이고 원의 넓이는 9*pi cm^2이므로 색칠한 넓이는 (54 - 9*pi) cm^2이다.
- 작성자 답: $(54-9\pi),\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서술형] 다음 그림에서 원 $O$는 $\angle B

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_PROPERTY → M3-06-CIRCLE_LINE**
- 근거 인용: 「한 점에서 원에 그은 두 접선의 길이는 같으므로 $AD」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기]
- 이유: 직각삼각형 ABC의 내접원 접선 길이 AF = 6 cm, CF = 9 cm로 세 변을 표현하고 피타고라스 정리로 r = 3 및 넓이를 구한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 직각삼각형 ABC의 내접원과 접선 조건으로부터 원을 제외한 부분의 넓이를 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 직각삼각형 ABC에서 이차방정식을 풀어 내접원 반지름 r = 3 cm를 구하고 넓이 차를 계산하므로 난이도 3이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $ABC$의」
- goal: 넓이←stem:「색칠한 부분의 넓이를 구하시오.」
- method: 접선(NAMED)←solution:「원에 그은 두 접선의 길이는 같으」
- condition: (없음)

**how** 피타고라스 정리로 r = 3 cm를 얻어 삼각형 넓이 54와 원 넓이 9pi의 차 (54 - 9pi) cm^2를 산출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

한 점에서 원에 그은 두 접선의 길이는 같으므로 $AD=AF=6,\mathrm{cm}$, $CE=CF=9,\mathrm{cm}$이다. 내접원의 반지름의 길이를 $r,\mathrm{cm}$라 하면 $\angle B=90^\circ$이므로 $BDOE$는 한 변이 $r$인 정사각형이 되어 $BD=BE=r$이다. 따라서 $AB=6+r$, $BC=9+r$, $AC=6+9=15$이므로 직각삼각형 $ABC$에서 $$ (6+r)^2 + (9+r)^2 = 15^2 \implies 2r^2 + 30r - 108 = 0 \implies r^2 + 15r - 54 = 0 $$ $(r-3)(r+18)=0$이고 $r>0$이므로 $r=3$이다. 따라서 $AB=9,\mathrm{cm}$, $BC=12,\mathrm{cm}$이므로 $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 9\times 12 = 54,\mathrm{cm}^2$, 원 $O$의 넓이는 $9\pi,\mathrm{cm}^2$이다. 그러므로 색칠한 부분의 넓이는 $(54-9\pi),\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
