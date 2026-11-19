# 검수 묶음 — 26_팔마중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: FIGURE_MISSING 5)**
- 문항 24개 / 검사 PASS 19, FAIL 0, 보류 5
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NEEDS_FIGURE 5, NONE 5, SELF_CONTAINED 14
- 난이도 분포: 1단계 2, 2단계 12, 3단계 7, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q2**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q6**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q12**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q13**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q14**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 직각삼각형 $\text{ABC}$에서 $\sin A \times \tan B$의 값은? (3점)

**보기** ① $\frac{1}{2}$  ② $\frac{1}{4}$  ③ $\frac{\sqrt{3}}{4}$  ④ $\frac{\sqrt{3}}{2}$  ⑤ $\frac{3}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 각 C = 90도이고 AB = 6, BC = 3*sqrt(3) 이다.
2. 피타고라스 정리에 의해 AC = sqrt(6^2 - (3*sqrt(3))^2) = sqrt(36 - 27) = 3 이다.
3. sin A = BC / AB = 3*sqrt(3) / 6 = sqrt(3) / 2 이다.
4. tan B = AC / BC = 3 / (3*sqrt(3)) = 1 / sqrt(3) 이다.
5. 따라서 sin A * tan B = (sqrt(3)/2) * (1/sqrt(3)) = 1/2 이므로 답은 1/2(①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 직각삼각형 $\text{ABC}$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 직각삼각형 $\text{ABC}$에서 $\sin A \times \tan B$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] (원천과 같음)
- 이유: 직각삼각형 ABC에서 삼각비 sin과 tan의 정의를 이용해 계산하므로 sin·cos·tan(M3-RPM-055)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION (원천과 같음)
- 이유: 직각삼각형 ABC의 세 변의 길이 관계로부터 삼각비 sin A와 tan B의 값을 유도하므로 도형에서 삼각비 값 유도(TPL_TRIG_RATIO_GEOMETRIC_DERIVATION)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 그림의 직각삼각형 ABC에서 피타고라스 정리로 AC = 3을 구하고 sin A 와 tan B 를 곱해 1/2을 얻는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 $\text{ABC}$에서」
- goal: 삼각비←solution:「따라서 $\sin A = \frac{3\sqrt{3}}{6} = \frac{\sqrt{3}}{2}$」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: (없음)

**how** 직각삼각형 ABC에서 AC = 3 을 구하고 sin A = sqrt(3)/2 와 tan B = 1/sqrt(3) 을 곱해 1/2 로 ①을 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

그림에서 $\angle\text{C} = 90^\circ$, $\overline{\text{AB}} = 6$, $\overline{\text{BC}} = 3\sqrt{3}$이므로 피타고라스 정리에 의해 $$\overline{\text{AC}} = \sqrt{6^2 - (3\sqrt{3})^2} = \sqrt{36 - 27} = 3$$ 따라서 $\sin A = \frac{3\sqrt{3}}{6} = \frac{\sqrt{3}}{2}$, $\tan B = \frac{3}{3\sqrt{3}} = \frac{1}{\sqrt{3}}$이므로 $$\sin A \times \tan B = \frac{\sqrt{3}}{2} \times \frac{1}{\sqrt{3}} = \frac{1}{2}$$ 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 직각삼각형 $\text{ABC}$에서 $\sin B + \cos A$의 값은? (3점)

**보기** ① $\frac{\sqrt{21}}{5}$  ② $\frac{2\sqrt{21}}{5}$  ③ $\frac{4}{5}$  ④ $\frac{2}{5}$  ⑤ $\frac{6}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 각 C = 90도, AB = 5, BC = sqrt(21) 이다.
2. 피타고라스 정리에 의해 AC = sqrt(5^2 - (sqrt(21))^2) = sqrt(25 - 21) = 2 이다.
3. sin B = AC / AB = 2/5 이고 cos A = AC / AB = 2/5 이다.
4. 따라서 sin B + cos A = 2/5 + 2/5 = 4/5 이므로 답은 4/5(③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 직각삼각형 $\text{ABC}$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 직각삼각형 $\text{ABC}$에서 $\sin B + \cos A$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] (원천과 같음)
- 이유: 직각삼각형 ABC에서 삼각비 sin과 cos의 정의를 적용하므로 sin·cos·tan(M3-RPM-055)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION (원천과 같음)
- 이유: 직각삼각형 ABC의 변의 길이로부터 삼각비 sin B 와 cos A 의 값을 유도하여 더하므로 도형에서 삼각비 값 유도(TPL_TRIG_RATIO_GEOMETRIC_DERIVATION)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 그림의 직각삼각형 ABC에서 피타고라스 정리로 AC = 2를 구하고 sin B = 2/5, cos A = 2/5 를 더해 4/5를 내는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 $\text{ABC}$에서」
- goal: 합←solution:「$\sin B + \cos A = \frac{2}{5} + \frac{2}{5} = \frac{4}{5}$」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: (없음)

**how** 직각삼각형 ABC에서 AC = 2 를 얻고 sin B = 2/5 와 cos A = 2/5 의 합으로 4/5 를 구해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $\text{ABC}$에서 $\angle\text{C} = 90^\circ$, $\overline{\text{AB}} = 5$, $\overline{\text{BC}} = \sqrt{21}$이므로 피타고라스 정리에 의해 $$\overline{\text{AC}} = \sqrt{5^2 - (\sqrt{21})^2} = \sqrt{25 - 21} = 2$$ 따라서 $\sin B = \frac{2}{5}$, $\cos A = \frac{2}{5}$이므로 $\sin B + \cos A = \frac{2}{5} + \frac{2}{5} = \frac{4}{5}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$3\tan A - \sqrt{5} = 0$일 때, $\sin A \times \cos A$의 값은? (단, $\angle\text{A}$는 예각) (4점)

**보기** ① $\frac{\sqrt{5}}{14}$  ② $\frac{3\sqrt{5}}{14}$  ③ $\frac{5}{14}$  ④ $\frac{9}{14}$  ⑤ $\frac{3\sqrt{14}}{14}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 3 tan A - sqrt(5) = 0 에서 tan A = sqrt(5) / 3 이다.
2. 밑변 3, 높이 sqrt(5)인 직각삼각형을 그리면 빗변의 길이는 sqrt(3^2 + 5) = sqrt(14) 이다.
3. sin A = sqrt(5) / sqrt(14) 이고 cos A = 3 / sqrt(14) 이다.
4. 따라서 sin A * cos A = (sqrt(5)/sqrt(14)) * (3/sqrt(14)) = 3*sqrt(5) / 14 이므로 답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3\tan A - \sqrt{5} = 0$일 때, $\sin A \times \cos A$의 값은?」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계] (원천과 같음)
- 이유: 주어진 tan A 값으로부터 빗변 14 를 찾아 sin A 와 cos A 의 상호 관계를 다루므로 삼각비의 관계(M3-RPM-056)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION (원천과 같음)
- 이유: 하나의 삼각비 tan A로부터 직각삼각형 빗변 14 를 구해 sin A 와 cos A 의 곱을 구하므로 삼각비의 기본 관계(TPL_TRIG_RATIO_BASIC_RELATION)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: tan A = sqrt(5)/3 에서 빗변 14 를 구하고 sin A 와 cos A 의 곱 3*sqrt(5)/14 를 계산하는 2단계 문항이다.

**4칸**
- given: 예각←stem:「$\angle\text{A}$는 예각」
- goal: 값←stem:「$\sin A \times \cos A$의 값은?」
- method: 직각삼각형(NAMED)←solution:「직각삼각형을 그리면 빗변의 길이는」
- condition: (없음)

**how** tan A = sqrt(5)/3 에서 빗변 sqrt(14)로 sin A = sqrt(5)/sqrt(14), cos A = 3/sqrt(14) 를 곱해 3*sqrt(5)/14 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$3\tan A - \sqrt{5} = 0$에서 $\tan A = \frac{\sqrt{5}}{3}$이다. 밑변의 길이가 $3$, 높이의 길이가 $\sqrt{5}$인 직각삼각형을 그리면 빗변의 길이는 $\sqrt{3^2 + (\sqrt{5})^2} = \sqrt{14}$이다. 따라서 $\sin A = \frac{\sqrt{5}}{\sqrt{14}}$, $\cos A = \frac{3}{\sqrt{14}}$이므로 $$\sin A \times \cos A = \frac{\sqrt{5}}{\sqrt{14}} \times \frac{3}{\sqrt{14}} = \frac{3\sqrt{5}}{14}$$ 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

$\tan x = \frac{\sqrt{3}}{3}$이고 $\sin y = \frac{\sqrt{3}}{2}$일 때, $\sin(x + y)$의 값은? (단, $0^\circ \le x \le 90^\circ$, $0^\circ \le y \le 90^\circ$) (4점)

**보기** ① $0$  ② $\frac{1}{2}$  ③ $\frac{\sqrt{2}}{2}$  ④ $\frac{\sqrt{3}}{2}$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 0도 <= x, y <= 90도 범위에서 tan x = sqrt(3)/3 이므로 x = 30도이다.
2. sin y = sqrt(3)/2 이므로 y = 60도이다.
3. 따라서 x + y = 30 + 60 = 90도이다.
4. sin(x + y) = sin 90도 = 1 이므로 답은 1(⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\tan x = \frac{\sqrt{3}}{3}$이고 $\sin y = \frac{\sqrt{3}}{2}$일 때」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산] (원천과 같음)
- 이유: 특수각 30도와 60도의 삼각비 값을 이용해 연산하므로 특수각 계산(M3-RPM-058)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각의 삼각비 값으로부터 각도 x = 30도, y = 60도를 구하고 sin(x+y)를 계산하므로 특수각의 삼각비(TPL_TRIG_RATIO_SPECIAL_ANGLE)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 특수각 x = 30도, y = 60도를 각각 찾고 sin 90도 = 1 을 계산하는 2단계 문항이다.

**4칸**
- given: tan←stem:「$\tan x = \frac{\sqrt{3}}{3}$이고」
- goal: 값←stem:「$\sin(x + y)$의 값은?」
- method: 대입(IMPLIED)←solution:「따라서 $\sin(x + y) = \sin(30^\circ + 60^\circ) = \sin 90^\circ = 1$이다.」 — 특수각 x=30도, y=60도를 구하여 식에 대입해 계산한다.
- condition: (없음)

**how** tan x = sqrt(3)/3 에서 x = 30도, sin y = sqrt(3)/2 에서 y = 60도를 얻어 sin 90도 = 1 로 ⑤를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$0^\circ \le x, y \le 90^\circ$에서 $\tan x = \frac{\sqrt{3}}{3}$이므로 $x = 30^\circ$이고, $\sin y = \frac{\sqrt{3}}{2}$이므로 $y = 60^\circ$이다. 따라서 $\sin(x + y) = \sin(30^\circ + 60^\circ) = \sin 90^\circ = 1$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

세 내각의 크기의 비가 $3 : 4 : 5$인 삼각형의 가장 작은 내각의 크기를 $A$라고 할 때, $\sin A : \cos A : \tan A$의 값은? (4점)

**보기** ① $1 : \sqrt{2} : 1$  ② $\sqrt{2} : 1 : 1$  ③ $\sqrt{2} : \sqrt{2} : 1$  ④ $1 : 1 : \sqrt{2}$  ⑤ $1 : 2 : \sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 세 내각의 합은 180도이므로 가장 작은 각 A = 180 * 3 / (3 + 4 + 5) = 180 * (3/12) = 45도이다.
2. sin 45도 = sqrt(2)/2, cos 45도 = sqrt(2)/2, tan 45도 = 1 이다.
3. sin A : cos A : tan A = (sqrt(2)/2) : (sqrt(2)/2) : 1 이다.
4. 각 항에 sqrt(2)를 곱하면 1 : 1 : sqrt(2) 가 되므로 답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 내각의 크기의 비가 $3 : 4 : 5$인 삼각형의 가장 작은 내각의 크기를 $A$라고 할 때」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산] (원천과 같음)
- 이유: 특수각 45도의 삼각비 값을 연산하여 간단한 자연수 비로 나타내므로 특수각 계산(M3-RPM-058)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 특수각 A = 45도에서의 삼각비 sin 45도, cos 45도, tan 45도의 비율을 구하므로 특수각의 삼각비(TPL_TRIG_RATIO_SPECIAL_ANGLE)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내각 비 3:4:5에서 A = 45도를 비례배분으로 찾고 세 삼각비의 비 1 : 1 : sqrt(2)를 구하는 2단계 문항이다.

**4칸**
- given: 비←stem:「크기의 비가 $3 : 4 : 5$인」
- goal: 값←stem:「$\sin A : \cos A : \tan A$의 값은?」
- method: 내각(NAMED)←solution:「삼각형의 세 내각의 합은 $180^\circ$이므로」
- condition: (없음)

**how** 내각의 합 180도에서 A = 45도를 구하고 sin 45도, cos 45도, tan 45도의 비를 정리해 1 : 1 : sqrt(2) 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 내각의 합은 $180^\circ$이므로 가장 작은 내각의 크기는 $$A = 180^\circ \times \frac{3}{3 + 4 + 5} = 180^\circ \times \frac{3}{12} = 45^\circ$$ $\sin 45^\circ = \frac{\sqrt{2}}{2}$, $\cos 45^\circ = \frac{\sqrt{2}}{2}$, $\tan 45^\circ = 1$이므로 $$\sin A : \cos A : \tan A = \frac{\sqrt{2}}{2} : \frac{\sqrt{2}}{2} : 1 = 1 : 1 : \sqrt{2}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 그림과 같이 점 $\text{O}$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서 $\sin 38^\circ - \cos 52^\circ + \tan 38^\circ$의 값은? (4점)

**보기** ① $0.78$  ② $0.62$  ③ $0.79$  ④ $0.16$  ⑤ $1.40$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. sin 38도 = cos(90 - 38도) = cos 52도 이므로 sin 38도 - cos 52도 = 0 이다.
2. 따라서 주어진 식은 tan 38도 가 된다.
3. 사분원 그림에서 tan 38도 = 0.78 이다.
4. 따라서 답은 0.78(①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 그림과 같이 점 $\text{O}$를 중심으로 하고

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 점 $\text{O}$를 중심으로 하고 반지름의 길이가 $1$인 사분원에서」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] (원천과 같음)
- 이유: 사분원에서 sin 38도, cos 52도, tan 38도의 정의와 값을 다루므로 sin·cos·tan(M3-RPM-055)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 여각의 삼각비 sin 38도 = cos 52도의 상호 관계를 이용해 식을 간단히 하므로 삼각비의 기본 관계(TPL_TRIG_RATIO_BASIC_RELATION)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sin 38도 = cos 52도 여각 관계로 소거한 뒤 그림에서 tan 38도 = 0.78 을 읽는 2단계 문항이다.

**4칸**
- given: 사분원←stem:「반지름의 길이가 $1$인 사분원에서」
- goal: 값←stem:「$\sin 38^\circ - \cos 52^\circ + \tan 38^\circ$의 값은?」
- method: 삼각비(IMPLIED)←solution:「$\sin 38^\circ = \cos(90^\circ - 38^\circ) = \cos 52^\circ$」 — 여각 관계를 이용해 삼각비 값을 소거하고 계산한다.
- condition: (없음)

**how** sin 38도 - cos 52도 = 0 에서 tan 38도 = 0.78 만 남아 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin 38^\circ = \cos(90^\circ - 38^\circ) = \cos 52^\circ$이므로 $\sin 38^\circ - \cos 52^\circ = 0$이다. 따라서 준식은 $\tan 38^\circ$이고, 그림에서 $\tan 38^\circ = 0.78$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

다음 그림과 같이 학생이 나무로부터 $15\text{ m}$ 떨어진 지점 $\text{A}$에서 나무의 꼭대기 $\text{B}$를 올려본 각의 크기가 $28^\circ$이다. 이 학생의 눈높이가 $1.5\text{ m}$일 때, 이 나무의 높이는? (단, $\sin 28^\circ = 0.470$, $\cos 28^\circ = 0.883$, $\tan 28^\circ = 0.532$로 계산한다.) (4점)

**보기** ① $7.05\text{ m}$  ② $7.98\text{ m}$  ③ $8.55\text{ m}$  ④ $13.25\text{ m}$  ⑤ $9.48\text{ m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지점 A에서 나무 꼭대기 B를 올려본 각이 28도이고 밑변 거리가 15 m 이다.
2. 눈높이 위 나무 높이는 15 * tan 28도 = 15 * 0.532 = 7.98 m 이다.
3. 학생의 눈높이 1.5 m 를 더하면 전체 높이는 7.98 + 1.5 = 9.48 m 이다.
4. 따라서 나무의 높이는 9.48 m(⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 학생이

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 학생이 나무로부터 $15\text{ m}$ 떨어진 지점 $\text{A}$에서」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각] (원천과 같음)
- 이유: 올려본 각 28도를 이용해 높이를 측정하는 실생활 문제이므로 앙각·부각(M3-RPM-064)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 올려본 각 28도와 거리 15 m 에서 삼각비를 이용해 나무의 높이를 직접 구하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 밑변 15 m 와 tan 28도 = 0.532 로 7.98 m 를 구하고 눈높이 1.5 m 를 더해 9.48 m 를 구하는 2단계 문항이다.

**4칸**
- given: 높이←stem:「이 학생의 눈높이가 $1.5\text{ m}$일 때」
- goal: 높이←stem:「이 나무의 높이는?」
- method: 합(NAMED)←solution:「$$7.98 + 1.5 = 9.48\text{ m}$$」
- condition: (없음)

**how** 거리 15 m 와 tan 28도 = 0.532 에서 높이 7.98 m 에 눈높이 1.5 m 를 합쳐 9.48 m 로 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

눈높이 위의 나무 높이는 $15\tan 28^\circ = 15 \times 0.532 = 7.98\text{ m}$이다. 학생의 눈높이 $1.5\text{ m}$를 더하면 나무의 전체 높이는 $$7.98 + 1.5 = 9.48\text{ m}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림과 같이 $\overline{\text{AC}} = 8$, $\overline{\text{BC}} = 5\sqrt{2}$, $\angle\text{ACB} = 45^\circ$인 삼각형 $\text{ABC}$에서 $\overline{\text{AB}}$의 길이는? (4점)

**보기** ① $4\sqrt{2}$  ② $\sqrt{34}$  ③ $6$  ④ $\sqrt{38}$  ⑤ $2\sqrt{10}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. A에서 BC에 내린 수선의 발을 H라 하면 CH = 8 * cos 45도 = 4*sqrt(2), AH = 8 * sin 45도 = 4*sqrt(2) 이다.
2. BC = 5*sqrt(2) 이므로 BH = 5*sqrt(2) - 4*sqrt(2) = sqrt(2) 이다.
3. 직각삼각형 ABH에서 피타고라스 정리에 의해 AB = sqrt((4*sqrt(2))^2 + (sqrt(2))^2) = sqrt(32 + 2) = sqrt(34) 이다.
4. 따라서 AB = sqrt(34)(②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{\text{AC}} = 8$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\overline{\text{AC}} = 8$, $\overline{\text{BC}} = 5\sqrt{2}$, $\angle\text{ACB} = 45^\circ$인 삼각형 $\text{ABC}$에서」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변] (원천과 같음)
- 이유: 직각삼각형 ABH와 ACH에서 삼각비를 활용해 변의 길이를 결정하므로 직각삼각형의 변(M3-RPM-059)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 삼각형 ABC에서 45도 삼각비와 수선을 이용해 미지 변 AB 길이를 구하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수선의 발 H를 내려 AH = 4*sqrt(2)와 BH = sqrt(2)를 구한 뒤 피타고라스 정리로 AB = sqrt(34)를 계산하는 3단계 발전 문항이다.

**4칸**
- given: 삼각형←stem:「인 삼각형 $\text{ABC}$에서」
- goal: 길이←stem:「$\overline{\text{AB}}$의 길이는?」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: (없음)

**how** 수선 AH = 4*sqrt(2)와 BH = sqrt(2)를 찾고 피타고라스 정리로 AB = sqrt(34) 를 구해 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $\text{A}$에서 $\overline{\text{BC}}$에 내린 수선의 발을 $\text{H}$라 하면 $$\overline{\text{CH}} = 8\cos 45^\circ = 4\sqrt{2},\quad \overline{\text{AH}} = 8\sin 45^\circ = 4\sqrt{2}$$ $$\overline{\text{BH}} = 5\sqrt{2} - 4\sqrt{2} = \sqrt{2}$$ 직각삼각형 $\text{ABH}$에서 피타고라스 정리에 의해 $$\overline{\text{AB}} = \sqrt{(4\sqrt{2})^2 + (\sqrt{2})^2} = \sqrt{32 + 2} = \sqrt{34}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 그림과 같이 $\overline{\text{AB}} = 8\text{ cm}$, $\overline{\text{AC}} = 10\text{ cm}$인 삼각형 $\text{ABC}$의 넓이가 $20\sqrt{2}\text{ cm}^2$일 때, $\angle\text{A}$의 크기는? (단, $\angle\text{A}$는 둔각) (4점)

**보기** ① $105^\circ$  ② $120^\circ$  ③ $125^\circ$  ④ $135^\circ$  ⑤ $150^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 둔각삼각형 ABC의 넓이 공식은 (1/2) * 8 * 10 * sin(180 - A) = 20*sqrt(2) 이다.
2. 40 * sin(180 - A) = 20*sqrt(2) 이므로 sin(180 - A) = sqrt(2) / 2 이다.
3. 180 - A = 45도 이므로 각 A = 180 - 45 = 135도이다.
4. 따라서 각 A = 135도(④)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{\text{AB}} = 8\text{ cm}$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\overline{\text{AB}} = 8\text{ cm}$, $\overline{\text{AC}} = 10\text{ cm}$인 삼각형 $\text{ABC}$의 넓이가 $20\sqrt{2}\text{ cm}^2$일 때」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이] (원천과 같음)
- 이유: 두 변 AB = 8, AC = 10과 끼인각을 이용한 삼각형 ABC의 넓이 공식으로 넓이 20*sqrt(2)를 다루므로 삼각형의 높이·넓이(M3-RPM-061)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 두 변 AB, AC와 넓이로부터 사잇각 A의 크기를 구하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ABC 넓이 20*sqrt(2)에서 sin(180-A) = sqrt(2)/2 를 구하고 각 A = 135도를 결정하는 2단계 문항이다.

**4칸**
- given: 삼각형←stem:「인 삼각형 $\text{ABC}$의」
- goal: 각←stem:「$\angle\text{A}$의 크기는?」
- method: 삼각비(IMPLIED)←solution:「$$\sin(180^\circ - A) = \frac{20\sqrt{2}}{40} = \frac{\sqrt{2}}{2}$$」 — 삼각비 넓이 공식에서 sin(180-A)를 구해 각을 결정한다.
- condition: (없음)

**how** 넓이 공식 40 * sin(180 - A) = 20*sqrt(2) 에서 180 - A = 45도이므로 각 A = 135도로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

둔각삼각형의 넓이 공식에 의해 $$20\sqrt{2} = \frac{1}{2} \cdot 8 \cdot 10 \cdot \sin(180^\circ - A) = 40\sin(180^\circ - A)$$ $$\sin(180^\circ - A) = \frac{20\sqrt{2}}{40} = \frac{\sqrt{2}}{2}$$ $180^\circ - A = 45^\circ$이므로 $\angle\text{A} = 180^\circ - 45^\circ = 135^\circ$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 그림과 같이 $\angle\text{B} = 90^\circ$, $\angle\text{A} = 30^\circ$, $\overline{\text{AC}} = 16$인 직각삼각형 $\text{ABC}$에서 $\overline{\text{AC}} \perp \overline{\text{BD}}$, $\overline{\text{AB}} \perp \overline{\text{DE}}$일 때, 삼각형 $\text{ABD}$의 넓이는? (4점)

**보기** ① $12\sqrt{3}$  ② $16\sqrt{3}$  ③ $24\sqrt{3}$  ④ $32\sqrt{3}$  ⑤ $48\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 AC = 16, 각 A = 30도이므로 AB = 16 * cos 30도 = 8*sqrt(3) 이다.
2. BD 수직 AC 인 직각삼각형 ABD에서 BD = AB * sin 30도 = 8*sqrt(3) * (1/2) = 4*sqrt(3) 이다.
3. AD = AB * cos 30도 = 8*sqrt(3) * (sqrt(3)/2) = 12 이다.
4. 삼각형 ABD 넓이 = (1/2) * AD * BD = (1/2) * 12 * 4*sqrt(3) = 24*sqrt(3) 이다.
5. 따라서 삼각형 ABD의 넓이는 24*sqrt(3)(③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle\text{B} = 90^\circ$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle\text{B} = 90^\circ$, $\angle\text{A} = 30^\circ$, $\overline{\text{AC}} = 16$인 직각삼각형 $\text{ABC}$에서」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용] (원천과 같음)
- 이유: 직각삼각형 내부 수선 BD에 의한 부분삼각형 넓이를 삼각비로 계산하므로 보조선 활용(M3-RPM-065)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 직각삼각형 ABC 내부 수선에서 30도 삼각비를 연쇄 적용해 넓이를 구하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 큰 직각삼각형 ABC에서 AB = 8*sqrt(3)을 구하고 삼각형 ABD에서 30도 삼각비로 넓이 24*sqrt(3)을 계산하는 3단계 발전 문항이다.

**4칸**
- given: 직각삼각형←stem:「인 직각삼각형 $\text{ABC}$에서」
- goal: 넓이←stem:「삼각형 $\text{ABD}$의 넓이는?」
- method: 직각삼각형(NAMED)←solution:「$\overline{\text{BD}} \perp \overline{\text{AC}}$이므로 직각삼각형 $\text{ABD}$에서」
- condition: (없음)

**how** AB = 8*sqrt(3)을 먼저 구하고 직각삼각형 ABD에서 AD = 12, BD = 4*sqrt(3)으로 넓이 24*sqrt(3)을 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $\text{ABC}$에서 $\overline{\text{AC}} = 16$, $\angle\text{A} = 30^\circ$이므로 $$\overline{\text{AB}} = 16\cos 30^\circ = 8\sqrt{3}$$ $\overline{\text{BD}} \perp \overline{\text{AC}}$이므로 직각삼각형 $\text{ABD}$에서 $$\overline{\text{BD}} = \overline{\text{AB}}\sin 30^\circ = 8\sqrt{3} \times \frac{1}{2} = 4\sqrt{3},\quad \overline{\text{AD}} = \overline{\text{AB}}\cos 30^\circ = 8\sqrt{3} \times \frac{\sqrt{3}}{2} = 12$$ 따라서 $\triangle\text{ABD} = \frac{1}{2} \times 12 \times 4\sqrt{3} = 24\sqrt{3}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

사각형 $\text{ABCD}$의 두 대각선 $\text{AC}$, $\text{BD}$의 길이가 각각 $12\text{ cm}$, $8\text{ cm}$이고, 두 대각선이 이루는 예각의 크기가 $45^\circ$일 때, 사각형 $\text{ABCD}$의 넓이는? (4점)

**보기** ① $24\sqrt{2}\text{ cm}^2$  ② $24\text{ cm}^2$  ③ $48\text{ cm}^2$  ④ $48\sqrt{2}\text{ cm}^2$  ⑤ $24\sqrt{3}\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 대각선의 길이가 12 cm, 8 cm 이고 끼인각이 45도인 사각형 ABCD의 넓이 공식은 (1/2) * 12 * 8 * sin 45도 이다.
2. 48 * (sqrt(2)/2) = 24*sqrt(2) cm^2 이다.
3. 따라서 사각형 ABCD의 넓이는 24*sqrt(2) cm^2(①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $\text{ABCD}$의 두 대각선 $\text{AC}$, $\text{BD}$의 길이가 각각 $12\text{ cm}$, $8\text{ cm}$이고」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이] (원천과 같음)
- 이유: 두 대각선 AC, BD와 각 45도를 이용해 사각형 ABCD 넓이를 계산하므로 다각형의 길이·넓이(M3-RPM-062)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 두 대각선 AC, BD와 45도 사잇각에서 삼각비 넓이 공식을 직접 적용하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사각형 ABCD의 두 대각선 12, 8과 예각 45도로 넓이 24*sqrt(2)를 공식을 써서 바로 구하는 기본 1단계 문항이다.

**4칸**
- given: 대각선←stem:「두 대각선 $\text{AC}$, $\text{BD}$의 길이」
- goal: 넓이←stem:「사각형 $\text{ABCD}$의 넓이는?」
- method: 삼각비(IMPLIED)←solution:「$$\frac{1}{2} \times 12 \times 8 \times \sin 45^\circ = 48 \times \frac{\sqrt{2}}{2} = 24\sqrt{2}\text{ cm}^2$$」 — 삼각비 대각선 넓이 공식으로 넓이를 구한다.
- condition: (없음)

**how** 대각선 공식 (1/2) * 12 * 8 * sin 45도 = 24*sqrt(2) cm^2 로 ①을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 대각선의 길이가 $12\text{ cm}$, $8\text{ cm}$이고 끼인 예각이 $45^\circ$이므로 사각형 $\text{ABCD}$의 넓이는 $$\frac{1}{2} \times 12 \times 8 \times \sin 45^\circ = 48 \times \frac{\sqrt{2}}{2} = 24\sqrt{2}\text{ cm}^2$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

다음 직사각형 $\text{ABCD}$에서 대각선 $\text{AC}$에 꼭짓점 $\text{D}$에서 내린 수선의 발을 $\text{E}$라 하자. $\overline{\text{AE}} = 9$, $\overline{\text{EC}} = 4$이고 $\angle\text{ACB} = x^\circ$일 때, $\cos x^\circ$의 값은? (5점)

**보기** ① $\frac{2\sqrt{13}}{13}$  ② $\frac{3\sqrt{13}}{13}$  ③ $\frac{4\sqrt{13}}{13}$  ④ $\frac{9}{13}$  ⑤ $\frac{3}{13}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. AC = AE + EC = 9 + 4 = 13 이다.
2. 직각삼각형 ADC에서 직각삼각형의 닮음 성질에 의해 AD^2 = AE * AC = 9 * 13 이므로 AD = 3*sqrt(13) 이다.
3. 직사각형에서 BC = AD = 3*sqrt(13) 이다.
4. 직각삼각형 ABC에서 cos x도 = BC / AC = 3*sqrt(13) / 13 이다.
5. 따라서 답은 3*sqrt(13)/13(②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「다음 직사각형 $\text{ABCD}$에서 대각선 $\text{AC}$에 꼭짓점 $\text{D}$에서 내린 수선의 발을 $\text{E}$라 하자.」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용] **원천→판정: 삼각비 > 삼각비의 활용 > 복합도형 > 피타고라스 결합 → 삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용**
- 이유: 직각삼각형 내부 수선 DE와 피타고라스·닮음 정리를 결합해 삼각비를 구하므로 보조선 활용(M3-RPM-065)에 해당한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 직사각형 ABCD 내부 수선과 직각삼각형 닮음으로 변의 길이를 찾아 삼각비 cos x도를 유도하므로 도형에서 삼각비 값 유도(TPL_TRIG_RATIO_GEOMETRIC_DERIVATION)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AC = 13과 직각삼각형 닮음으로 AD = 3*sqrt(13)을 구하고 cos x도 = 3*sqrt(13)/13을 도출하는 3단계 발전 문항이다.

**4칸**
- given: 직사각형←stem:「다음 직사각형 $\text{ABCD}$에서」
- goal: 값←stem:「$\cos x^\circ$의 값은?」
- method: 닮음(NAMED)←solution:「직각삼각형의 닮음에 의해」
- condition: (없음)

**how** AC = 13과 AD^2 = 9*13 = 117 에서 BC = 3*sqrt(13)을 얻고 cos x도 = 3*sqrt(13)/13 으로 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{\text{AC}} = 9 + 4 = 13$이다. 직각삼각형 $\text{ADC}$에서 $\overline{\text{DE}} \perp \overline{\text{AC}}$이므로 직각삼각형의 닮음에 의해 $$\overline{\text{AD}}^2 = \overline{\text{AE}} \cdot \overline{\text{AC}} = 9 \times 13 \implies \overline{\text{AD}} = 3\sqrt{13}$$ 직사각형에서 $\overline{\text{BC}} = \overline{\text{AD}} = 3\sqrt{13}$이므로 직각삼각형 $\text{ABC}$에서 $$\cos x^\circ = \frac{\overline{\text{BC}}}{\overline{\text{AC}}} = \frac{3\sqrt{13}}{13}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 그림과 같이 폭이 $6\text{ cm}$인 종이를 선분 $\text{AC}$를 접는 선으로 하여 접었다. $\angle\text{ABC} = 45^\circ$일 때, 삼각형 $\text{ABC}$의 넓이는? (5점)

**보기** ① $9\text{ cm}^2$  ② $18\text{ cm}^2$  ③ $9\sqrt{2}\text{ cm}^2$  ④ $18\sqrt{2}\text{ cm}^2$  ⑤ $36\sqrt{2}\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 종이를 접었을 때 엇각과 접은 각이 같으므로 삼각형 ABC는 AB = BC 인 이등변삼각형이다.
2. 높이(폭)가 6 cm 이고 각 ABC = 45도이므로 BC = 6 / sin 45도 = 6*sqrt(2) cm 이다.
3. 따라서 밑변 AB = 6*sqrt(2) cm 이다.
4. 삼각형 ABC의 넓이 = (1/2) * 6*sqrt(2) * 6 = 18*sqrt(2) cm^2 이므로 답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 그림과 같이 폭이 $6\text{ cm}$인 종이를

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 폭이 $6\text{ cm}$인 종이를 선분 $\text{AC}$를 접는 선으로 하여 접었다.」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이] (원천과 같음)
- 이유: 밑변 AB와 높이 6 cm를 이용해 삼각형 ABC 넓이를 계산하므로 삼각형의 높이·넓이(M3-RPM-061)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각형 ABC에서 sin 45도와 높이 6을 이용해 밑변과 넓이를 구하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 종이접기 이등변삼각형 성질과 sin 45도로 밑변 6*sqrt(2)를 구하고 넓이 18*sqrt(2)를 도출하는 3단계 발전 문항이다.

**4칸**
- given: 삼각형←stem:「삼각형 $\text{ABC}$의 넓이는?」
- goal: 넓이←stem:「삼각형 $\text{ABC}$의 넓이는?」
- method: 이등변삼각형(NAMED)←solution:「인 이등변삼각형이다.」
- condition: (없음)

**how** 이등변삼각형 ABC에서 BC = 6/sin 45도 = 6*sqrt(2)를 구하고 넓이 = (1/2)*6*sqrt(2)*6 = 18*sqrt(2)로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

종이의 양쪽 가장자리가 평행하므로 엇각과 접은 각의 크기가 같아 $\triangle\text{ABC}$는 $\overline{\text{AB}} = \overline{\text{BC}}$인 이등변삼각형이다. 점 $\text{C}$에서 $\overline{\text{AB}}$의 연장선에 내린 수선의 길이(종이의 폭)가 $6\text{ cm}$이고 $\angle\text{ABC} = 45^\circ$이므로 $$\overline{\text{BC}} = \frac{6}{\sin 45^\circ} = 6\sqrt{2}\text{ cm}$$ 따라서 $\overline{\text{AB}} = 6\sqrt{2}\text{ cm}$이므로 $\triangle\text{ABC}$의 넓이는 $$\frac{1}{2} \times 6\sqrt{2} \times 6 = 18\sqrt{2}\text{ cm}^2$$ 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 두 그림에서 $x + y$의 값은? (단, 왼쪽 원에서 중심에서 두 현까지의 거리는 같고, 오른쪽 원에서 $\overline{\text{PA}}, \overline{\text{PB}}$는 접선이다.) (3점)

**보기** ① $19$  ② $21$  ③ $27$  ④ $25$  ⑤ $29$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 왼쪽 원에서 중심으로부터 거리가 같은 두 현은 길이가 같고 수선은 현을 이등분하므로 x = 2 * 7 = 14 이다.
2. 오른쪽 원에서 접선 PA는 반지름 OA와 수직이므로 피타고라스 정리에 의해 y = sqrt(5^2 + 12^2) = 13 이다.
3. 따라서 x + y = 14 + 13 = 27 이므로 답은 27(③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 두 그림에서 $x + y$의 값은?

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 두 그림에서 $x + y$의 값은? (단, 왼쪽 원에서 중심에서 두 현까지의 거리는 같고」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 접선 PA와 반지름의 수직 조건 및 직각삼각형 피타고라스 정리로 y = 13 을 구하므로 접선 조건으로 길이 구하기(M3-RPM-072)에 해당한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD
- 이유: 중심에서 같은 거리에 있는 두 현의 길이 x = 14 와 접선 PA 성질을 이용하므로 등거리 현(TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 현의 이등분 성질로 x = 14를 구하고 접선 직각삼각형으로 y = 13을 구해 합 27을 얻는 2단계 문항이다.

**4칸**
- given: 접선←stem:「$\overline{\text{PA}}, \overline{\text{PB}}$는 접선이다」
- goal: 값←stem:「$x + y$의 값은?」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: (없음)

**how** 현 성질 x = 14 와 접선 피타고라스 y = 13 에서 x + y = 27 로 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

왼쪽 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같고 수선은 현을 이등분하므로 $$x = 2 \times 7 = 14$$ 오른쪽 원에서 $\overline{\text{OA}} \perp \overline{\text{PA}}$이고 $\overline{\text{OA}} = 5$, $\overline{\text{PA}} = 12$이므로 피타고라스 정리에 의해 $$y = \overline{\text{PO}} = \sqrt{5^2 + 12^2} = \sqrt{25 + 144} = 13$$ 따라서 $x + y = 14 + 13 = 27$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림과 같이 원 $\text{O}$의 지름 $\text{AB}$와 현 $\text{CD}$가 점 $\text{M}$에서 수직으로 만난다. $\overline{\text{AM}} = 12\text{ cm}$, $\overline{\text{MB}} = 4\text{ cm}$일 때, $\overline{\text{CD}}$의 길이는? (4점)

**보기** ① $4\sqrt{2}\text{ cm}$  ② $4\sqrt{3}\text{ cm}$  ③ $6\sqrt{3}\text{ cm}$  ④ $8\sqrt{2}\text{ cm}$  ⑤ $8\sqrt{3}\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름 AB = AM + MB = 12 + 4 = 16 cm 이므로 반지름 r = 8 cm 이다.
2. OM = 8 - 4 = 4 cm 이다.
3. 직각삼각형 OMC에서 OC = 8 cm 이므로 CM = sqrt(8^2 - 4^2) = sqrt(48) = 4*sqrt(3) cm 이다.
4. 원의 중심에서 현에 내린 수선은 현을 이등분하므로 CD = 2 * CM = 8*sqrt(3) cm 이다.
5. 따라서 CD = 8*sqrt(3) cm(⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $\text{O}$의 지름 $\text{AB}$와

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $\text{O}$의 지름 $\text{AB}$와 현 $\text{CD}$가 점 $\text{M}$에서 수직으로 만난다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 원의 중심에서 현 CD에 내린 수선이 현을 이등분하는 성질을 이용하므로 중심에서 현에 내린 수선(M3-RPM-067)에 해당한다.
**유형** PT=PT_M3_CIRCLE_CHORD / TPL=NONE
- 이유: 현의 수직이등분선 성질과 피타고라스 정리를 이용해 현 CD의 길이를 구하므로 원의 현(PT_M3_CIRCLE_CHORD)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지름 16 cm에서 반지름 8과 OM = 4를 구하고 피타고라스 정리와 현의 이등분으로 CD = 8*sqrt(3) cm를 얻는 2단계 문항이다.

**4칸**
- given: 지름←stem:「원 $\text{O}$의 지름 $\text{AB}$와」
- goal: 길이←stem:「$\overline{\text{CD}}$의 길이는?」
- method: 수선(NAMED)←solution:「현에 내린 수선은 현을 이등분하므로」
- condition: (없음)

**how** 반지름 8과 OM = 4에서 CM = 4*sqrt(3)을 찾고 2배하여 CD = 8*sqrt(3) cm 로 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

지름 $\overline{\text{AB}} = 12 + 4 = 16\text{ cm}$이므로 반지름의 길이는 $8\text{ cm}$이다. 따라서 $\overline{\text{OM}} = 8 - 4 = 4\text{ cm}$이다. 직각삼각형 $\text{OMC}$에서 $\overline{\text{OC}} = 8\text{ cm}$이므로 $$\overline{\text{CM}} = \sqrt{8^2 - 4^2} = \sqrt{64 - 16} = \sqrt{48} = 4\sqrt{3}\text{ cm}$$ 현에 내린 수선은 현을 이등분하므로 $\overline{\text{CD}} = 2\overline{\text{CM}} = 8\sqrt{3}\text{ cm}$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

다음 그림에서 $\overline{\text{OM}} \perp \overline{\text{AB}}$, $\overline{\text{ON}} \perp \overline{\text{BC}}$이고 $\overline{\text{OM}} = \overline{\text{ON}}$이다. $\angle\text{MON} = 124^\circ$일 때, $\angle\text{ACB}$의 크기는? (4점)

**보기** ① $58^\circ$  ② $62^\circ$  ③ $64^\circ$  ④ $68^\circ$  ⑤ $124^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. OM = ON 이므로 두 현 AB와 BC의 길이가 같고 대응하는 중심각 AOB = BOC 이다.
2. 중심에서 현에 내린 수선은 중심각을 이등분하므로 각 AOB = 각 MON = 124도이다.
3. 원주각은 중심각의 절반이므로 각 ACB = (1/2) * 각 AOB = (1/2) * 124 = 62도이다.
4. 따라서 각 ACB = 62도(②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\overline{\text{OM}} \perp \overline{\text{AB}}$

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\overline{\text{OM}} \perp \overline{\text{AB}}$, $\overline{\text{ON}} \perp \overline{\text{BC}}$이고 $\overline{\text{OM}} = \overline{\text{ON}}$이다.」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 중심각 124도로부터 원주각 각 ACB = 62도를 구하는 관계를 다루므로 중심각과 원주각(M3-RPM-075)에 해당한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음)
- 이유: 호 AB에 대한 중심각 AOB = 124도와 원주각 ACB의 절반 관계를 이용하므로 원주각과 중심각(TPL_CIRCLE_ANGLE_CENTER_ARC)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: OM = ON 으로 중심각 AOB = 124도를 구하고 원주각 성질로 각 ACB = 62도를 계산하는 3단계 발전 문항이다.

**4칸**
- given: 수선←solution:「중심에서 현에 내린 수선은 중심각을 이등분하므로」
- goal: 각←stem:「$\angle\text{ACB}$의 크기는?」
- method: 원주각(NAMED)←solution:「원주각은 중심각의 절반이므로」
- condition: (없음)

**how** OM = ON 에서 중심각 AOB = 124도를 얻고 원주각 각 ACB = (1/2) * 124 = 62도로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{\text{OM}} = \overline{\text{ON}}$이므로 두 현의 길이가 같고($\overline{\text{AB}} = \overline{\text{BC}}$), 대응하는 중심각도 $\angle\text{AOB} = \angle\text{BOC}$로 같다. 중심에서 현에 내린 수선은 중심각을 이등분하므로 $$\angle\text{AOB} = \angle\text{MON} = 124^\circ$$ 원주각은 중심각의 절반이므로 $\angle\text{ACB} = \frac{1}{2}\angle\text{AOB} = \frac{1}{2} \times 124^\circ = 62^\circ$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 그림에서 두 점 $\text{A}$와 $\text{B}$는 점 $\text{P}$에서 원 $\text{O}$에 그은 두 접선의 접점이다. $\overline{\text{PA}} = 8\text{ cm}$, $\angle\text{APB} = 60^\circ$일 때, 삼각형 $\text{APB}$의 넓이는? (4점)

**보기** ① $16\sqrt{3}\text{ cm}^2$  ② $16\sqrt{2}\text{ cm}^2$  ③ $16\text{ cm}^2$  ④ $32\sqrt{2}\text{ cm}^2$  ⑤ $32\sqrt{3}\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원 밖의 점 P에서 그은 두 접선의 길이는 같으므로 PB = PA = 8 cm 이다.
2. 삼각형 APB의 넓이는 (1/2) * PA * PB * sin(각 APB) 이다.
3. 넓이 = (1/2) * 8 * 8 * sin 60도 = 32 * (sqrt(3)/2) = 16*sqrt(3) cm^2 이다.
4. 따라서 삼각형 APB의 넓이는 16*sqrt(3) cm^2(①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 점 $\text{A}$와 $\text{B}$는

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 점 $\text{A}$와 $\text{B}$는 점 $\text{P}$에서 원 $\text{O}$에 그은 두 접선의 접점이다.」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선] (원천과 같음)
- 이유: 점 P에서 그은 두 접선 PA = PB = 8 cm 의 성질을 이용하므로 한 점에서 그은 두 접선(M3-RPM-071)에 해당한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH (원천과 같음)
- 이유: 외부점 P에서 원에 그은 두 접선 PA = PB = 8 과 각 APB = 60도에서 넓이를 구하므로 등접선(TPL_CIRCLE_TANGENT_EQUAL_LENGTH)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선의 성질로 PB = PA = 8 cm을 확인하고 사잇각 60도 삼각비 공식으로 넓이 16*sqrt(3)을 계산하는 2단계 문항이다.

**4칸**
- given: 접점←stem:「두 접선의 접점이다.」
- goal: 넓이←stem:「삼각형 $\text{APB}$의 넓이는?」
- method: 접선(NAMED)←solution:「원에 그은 두 접선의 길이는 같으므로」
- condition: (없음)

**how** PA = PB = 8 cm 과 각 APB = 60도에서 넓이 = (1/2)*8*8*sin 60도 = 16*sqrt(3) cm^2 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점 $\text{P}$에서 원에 그은 두 접선의 길이는 같으므로 $\overline{\text{PB}} = \overline{\text{PA}} = 8\text{ cm}$이다. 따라서 $\triangle\text{APB}$의 넓이는 $$\frac{1}{2} \times 8 \times 8 \times \sin 60^\circ = 32 \times \frac{\sqrt{3}}{2} = 16\sqrt{3}\text{ cm}^2$$ 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

다음 그림에서 사각형 $\text{ABCD}$가 원 $\text{O}$에 외접할 때, $\overline{\text{AB}} = 7\text{ cm}$, $\overline{\text{AD}} = 5\text{ cm}$, $\overline{\text{BC}} = 10\text{ cm}$이면 $\overline{\text{CD}}$의 길이는? (4점)

**보기** ① $5\text{ cm}$  ② $6\text{ cm}$  ③ $7\text{ cm}$  ④ $8\text{ cm}$  ⑤ $9\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원에 외접하는 사각형 ABCD에서 대변의 길이의 합은 서로 같다.
2. AB + CD = AD + BC 이다.
3. 7 + CD = 5 + 10 = 15 이므로 CD = 8 cm 이다.
4. 따라서 CD의 길이는 8 cm(④)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 사각형 $\text{ABCD}$가

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 사각형 $\text{ABCD}$가 원 $\text{O}$에 외접할 때」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 접선으로 이루어진 외접사각형 ABCD에서 변의 길이를 결정하므로 접선 조건으로 길이 구하기(M3-RPM-072)에 해당한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=NONE (원천과 같음)
- 이유: 원 O에 외접하는 사각형 ABCD의 마주 보는 두 쌍의 변의 합 성질을 이용하므로 원과 직선(PT_CIRCLE_LINE_RELATION)이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외접사각형 ABCD 대변의 합 공식 7 + CD = 5 + 10 에서 CD = 8 cm 를 바로 구하는 기본 1단계 문항이다.

**4칸**
- given: 사각형←stem:「사각형 $\text{ABCD}$가 원 $\text{O}$에」
- goal: 길이←stem:「$\overline{\text{CD}}$의 길이는?」
- method: 합(NAMED)←solution:「두 변의 길이의 합은 서로 같으므로」
- condition: (없음)

**how** 외접사각형 공식 AB + CD = AD + BC 에서 7 + CD = 15 이므로 CD = 8 cm 로 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원에 외접하는 사각형에서 마주 보는 두 변의 길이의 합은 서로 같으므로 $$\overline{\text{AB}} + \overline{\text{CD}} = \overline{\text{AD}} + \overline{\text{BC}}$$ $$7 + \overline{\text{CD}} = 5 + 10 \implies \overline{\text{CD}} = 8\text{ cm}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 그림에서 $\overline{\text{BC}}$는 반원 $\text{O}$의 지름이고 $\overline{\text{AB}}, \overline{\text{AD}}, \overline{\text{CD}}$는 반원 $\text{O}$의 접선이다. 점 $\text{E}$가 접점이고 $\overline{\text{AB}} = 4\text{ cm}$, $\overline{\text{CD}} = 9\text{ cm}$일 때, 반원 $\text{O}$의 넓이는? (4점)

**보기** ① $12\pi\text{ cm}^2$  ② $16\pi\text{ cm}^2$  ③ $18\pi\text{ cm}^2$  ④ $24\pi\text{ cm}^2$  ⑤ $36\pi\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접선의 성질에 의해 AE = AB = 4 cm, DE = CD = 9 cm 이므로 AD = 4 + 9 = 13 cm 이다.
2. A에서 CD에 내린 수선의 발을 H라 하면 DH = 9 - 4 = 5 cm 이다.
3. 직각삼각형 AHD에서 피타고라스 정리에 의해 BC = AH = sqrt(13^2 - 5^2) = 12 cm 이다.
4. 반원 O의 반지름은 6 cm 이다.
5. 따라서 반원 O의 넓이 = (1/2) * pi * 6^2 = 18*pi cm^2 이므로 답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\overline{\text{BC}}$는 반원 $\text{O}$의

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\overline{\text{BC}}$는 반원 $\text{O}$의 지름이고 $\overline{\text{AB}}, \overline{\text{AD}}, \overline{\text{CD}}$는 반원 $\text{O}$의 접선이다.」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 접선 조건을 결합해 반원의 지름 BC = 12 와 넓이를 계산하므로 접선 조건으로 길이 구하기(M3-RPM-072)에 해당한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH (원천과 같음)
- 이유: 접선 길이 AE = AB = 4, DE = CD = 9 가 같음을 핵심으로 이용해 사다리꼴 변을 구하므로 등접선(TPL_CIRCLE_TANGENT_EQUAL_LENGTH)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 성질로 AD = 13을 찾고 수선 AH로 지름 BC = 12를 구해 반원 넓이 18*pi를 계산하는 3단계 발전 문항이다.

**4칸**
- given: 반원←stem:「반원 $\text{O}$의 지름이고」
- goal: 넓이←stem:「반원 $\text{O}$의 넓이는?」
- method: 수선(NAMED)←solution:「내린 수선의 발을 $\text{H}$라 하면」
- condition: (없음)

**how** AD = 13 과 DH = 5 에서 피타고라스로 지름 BC = 12, 반지름 6을 얻어 반원 넓이 18*pi 로 ③을 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 접선의 길이가 같으므로 $\overline{\text{AE}} = \overline{\text{AB}} = 4\text{ cm}$, $\overline{\text{DE}} = \overline{\text{CD}} = 9\text{ cm}$이고, $\overline{\text{AD}} = 4 + 9 = 13\text{ cm}$이다. 점 $\text{A}$에서 $\overline{\text{CD}}$에 내린 수선의 발을 $\text{H}$라 하면 $\overline{\text{DH}} = 9 - 4 = 5\text{ cm}$이다. 직각삼각형 $\text{AHD}$에서 $$\overline{\text{BC}} = \overline{\text{AH}} = \sqrt{13^2 - 5^2} = \sqrt{169 - 25} = 12\text{ cm}$$ 반원 $\text{O}$의 반지름은 $6\text{ cm}$이므로 반원의 넓이는 $\frac{1}{2} \pi \times 6^2 = 18\pi\text{ cm}^2$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점


**발문**

다음 그림에서 중심이 같은 두 원의 반지름의 길이는 각각 $5, 13$이고 점 $\text{Q}, \text{R}$은 작은 원의 접점이다. 큰 원의 두 현 $\text{AB}$와 $\text{CD}$의 교점을 $\text{P}$라 할 때, $\overline{\text{AP}}$의 길이는? (단, $\overline{\text{AB}} \perp \overline{\text{CD}}$이고 $\text{A}$는 $\text{P}$에서 먼 쪽 끝점이다.) (5점)

**보기** ① $7$  ② $12$  ③ $13$  ④ $15$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심 O에서 현 AB, CD까지의 거리는 작은 원의 반지름인 5이다.
2. 큰 원 반지름이 13이므로 피타고라스 정리에 의해 반현 AQ = sqrt(13^2 - 5^2) = 12 이다.
3. AB 수직 CD 이고 OQ = OR = 5 이므로 사각형 OQPR은 한 변이 5인 정사각형이다.
4. 따라서 QP = 5 이다.
5. AP = AQ + QP = 12 + 5 = 17 이므로 답은 17(⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 중심이 같은 두 원의

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 중심이 같은 두 원의 반지름의 길이는 각각 $5, 13$이고 점 $\text{Q}, \text{R}$은 작은 원의 접점이다.」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 원의 중심에서 현 AB에 내린 수선 OQ = 5 와 반현 길이를 다루므로 중심에서 현에 내린 수선(M3-RPM-067)에 해당한다.
**유형** PT=PT_M3_CIRCLE_CHORD / TPL=NONE
- 이유: 현의 중심거리 5와 피타고라스 정리로 반현 AQ = 12 를 구하므로 원의 현(PT_M3_CIRCLE_CHORD)이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반지름 5와 13으로 반현 12를 구하고 정사각형 OQPR의 변 5를 더해 AP = 17을 도출하는 4단계 심화 문항이다.

**4칸**
- given: 반지름←stem:「두 원의 반지름의 길이는」
- goal: 길이←stem:「$\overline{\text{AP}}$의 길이는?」
- method: 정사각형(NAMED)←solution:「사각형 $\text{OQPR}$은 한 변의 길이가 $5$인 정사각형이고」
- condition: (없음)

**how** 반현 AQ = sqrt(13^2 - 5^2) = 12 와 정사각형 변 QP = 5 에서 AP = 17 로 ⑤를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 현이 작은 원에 접하므로 중심 $\text{O}$에서 각 현까지의 거리는 모두 작은 원의 반지름 $5$이다. 큰 원의 반지름이 $13$이므로 두 현의 반길이는 $\sqrt{13^2 - 5^2} = 12$이다. $\overline{\text{AB}} \perp \overline{\text{CD}}$이고 $\overline{\text{OQ}} = \overline{\text{OR}} = 5$이므로 사각형 $\text{OQPR}$은 한 변의 길이가 $5$인 정사각형이고 $\overline{\text{QP}} = 5$이다. 점 $\text{Q}$가 현 $\text{AB}$의 중점이므로 $\overline{\text{AQ}} = 12$이고, 따라서 $\overline{\text{AP}} = \overline{\text{AQ}} + \overline{\text{QP}} = 12 + 5 = 17$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 5점


**발문**

다음 그림과 같이 한 모서리의 길이가 $4$인 정육면체에서 $\angle\text{CEG} = x^\circ$라 할 때, $\sin x^\circ \times \tan x^\circ$의 값을 구하는 과정을 설명하시오. (5점, 부분점수 있음)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\frac{\sqrt{6}}{6}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정육면체에서 EG = 4*sqrt(2) 이고 CG = 4 이다.
2. 직각삼각형 EGC에서 공간대각선 EC = sqrt((4*sqrt(2))^2 + 4^2) = sqrt(48) = 4*sqrt(3) 이다.
3. sin x도 = CG / EC = 4 / (4*sqrt(3)) = 1 / sqrt(3) 이다.
4. tan x도 = CG / EG = 4 / (4*sqrt(2)) = 1 / sqrt(2) 이다.
5. 따라서 sin x도 * tan x도 = (1/sqrt(3)) * (1/sqrt(2)) = 1/sqrt(6) = sqrt(6)/6 이다.
- 작성자 답: $\frac{\sqrt{6}}{6}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 모서리의

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 한 모서리의 길이가 $4$인 정육면체에서 $\angle\text{CEG} = x^\circ$라 할 때」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용] **원천→판정: 삼각비 > 삼각비의 활용 > 복합도형 > 피타고라스 결합 → 삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용**
- 이유: 정육면체 공간도형 직각삼각형 EGC에서 EG = 4*sqrt(2) 와 공간대각선 EC 로 삼각비를 결합하므로 보조선 활용(M3-RPM-065)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 정육면체 내부 직각삼각형 EGC에서 공간대각선과 모서리를 이용해 삼각비를 계산하므로 삼각비로 직접 길이·높이·거리 구하기(TPL_TRIG_APPLICATION_DIRECT_MEASURE)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 면대각선 EG = 4*sqrt(2)와 공간대각선 EC = 4*sqrt(3)을 구해 sin x도 와 tan x도의 곱 sqrt(6)/6을 구하는 3단계 발전 문항이다.

**4칸**
- given: 정육면체←stem:「길이가 $4$인 정육면체에서」
- goal: 값←stem:「$\sin x^\circ \times \tan x^\circ$의 값을 구하는」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $\text{EGC}$에서」
- condition: (없음)

**how** EG = 4*sqrt(2), EC = 4*sqrt(3)에서 sin x도 = 1/sqrt(3), tan x도 = 1/sqrt(2)를 곱해 sqrt(6)/6을 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

정육면체에서 $\overline{\text{EG}}$는 밑면 정사각형의 대각선이므로 $\overline{\text{EG}} = 4\sqrt{2}$이고, $\overline{\text{CG}} = 4$이다. 직각삼각형 $\text{EGC}$에서 $\angle\text{EGC} = 90^\circ$이므로 공간대각선 $\overline{\text{EC}} = \sqrt{(4\sqrt{2})^2 + 4^2} = \sqrt{48} = 4\sqrt{3}$이다. 따라서 $\sin x^\circ = \frac{4}{4\sqrt{3}} = \frac{1}{\sqrt{3}}$, $\tan x^\circ = \frac{4}{4\sqrt{2}} = \frac{1}{\sqrt{2}}$이므로 $$\sin x^\circ \times \tan x^\circ = \frac{1}{\sqrt{3}} \times \frac{1}{\sqrt{2}} = \frac{1}{\sqrt{6}} = \frac{\sqrt{6}}{6}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 5점


**발문**

다음 그림과 같이 성 밖의 $\text{A}$ 지점에서 성벽의 꼭대기 $\text{B}$ 지점을 올려본 각의 크기가 $30^\circ$이고, 성 쪽으로 $30\text{ m}$ 다가간 $\text{D}$ 지점에서 $\text{B}$ 지점을 올려본 각의 크기가 $45^\circ$이었다. 이때 성벽의 높이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $15(\sqrt{3} + 1)\text{ m}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 성벽의 높이를 h m라 하면 직각삼각형 BCD에서 CD = h / tan 45도 = h m 이다.
2. 직각삼각형 BCA에서 AC = h / tan 30도 = h*sqrt(3) m 이다.
3. AC - CD = 30 m 이므로 h*sqrt(3) - h = 30 이다.
4. (sqrt(3) - 1)h = 30 에서 h = 30 / (sqrt(3) - 1) = 15*(sqrt(3) + 1) m 이다.
5. 따라서 성벽의 높이는 15*(sqrt(3) + 1) m 이다.
- 작성자 답: $15(\sqrt{3} + 1)\text{ m}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 성 밖의

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 성 밖의 $\text{A}$ 지점에서 성벽의 꼭대기 $\text{B}$ 지점을 올려본 각의 크기가 $30^\circ$이고」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각] (원천과 같음)
- 이유: 올려본각 30도와 45도를 이용해 성벽 높이를 측정하는 전형적인 문제이므로 앙각·부각(M3-RPM-064)에 해당한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_SHARED_HEIGHT (원천과 같음)
- 이유: 두 지점에서 측정한 앙각과 거리 30 m를 이용해 공통 높이를 구하므로 공통 높이·거리 측량(TPL_TRIG_APPLICATION_SHARED_HEIGHT)이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 올려본각 30도, 45도로 h*sqrt(3) - h = 30 방정식을 세우고 유리화하여 15*(sqrt(3)+1) m를 구하는 4단계 심화 문항이다.

**4칸**
- given: 높이←stem:「성벽의 높이를 구하는 과정을」
- goal: 높이←stem:「성벽의 높이를 구하는 과정을」
- method: 유리화(IMPLIED)←solution:「$$h = \frac{30}{\sqrt{3} - 1} = \frac{30(\sqrt{3} + 1)}{(\sqrt{3} - 1)(\sqrt{3} + 1)} = 15(\sqrt{3} + 1)\text{ m}$$」 — 켤레무리수를 곱하여 분모를 유리화한다.
- condition: (없음)

**how** CD = h 와 AC = h*sqrt(3) 에서 h*(sqrt(3)-1) = 30 으로 높이 h = 15*(sqrt(3)+1) m 를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

성벽의 밑점을 $\text{C}$, 성벽의 높이를 $\overline{\text{BC}} = h\text{ m}$라 하자. 직각삼각형 $\text{BCD}$에서 $\angle\text{BDC} = 45^\circ$이므로 $\overline{\text{CD}} = \frac{h}{\tan 45^\circ} = h\text{ m}$이다. 직각삼각형 $\text{BCA}$에서 $\angle\text{BAC} = 30^\circ$이므로 $\overline{\text{AC}} = \frac{h}{\tan 30^\circ} = h\sqrt{3}\text{ m}$이다. $\overline{\text{AD}} = \overline{\text{AC}} - \overline{\text{CD}} = 30$이므로 $$h\sqrt{3} - h = 30 \implies (\sqrt{3} - 1)h = 30$$ $$h = \frac{30}{\sqrt{3} - 1} = \frac{30(\sqrt{3} + 1)}{(\sqrt{3} - 1)(\sqrt{3} + 1)} = 15(\sqrt{3} + 1)\text{ m}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 5점


**발문**

다음 그림에서 $\overline{\text{AB}} \perp \overline{\text{OC}}$이고 $\overline{\text{BM}} = 8\text{ cm}$, $\overline{\text{CM}} = 4\text{ cm}$일 때, 원의 반지름의 길이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $10\text{ cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름을 r cm라 하면 OB = r cm, OM = (r - 4) cm 이다.
2. 직각삼각형 OMB에서 피타고라스 정리에 의해 r^2 = (r - 4)^2 + 8^2 이다.
3. r^2 = r^2 - 8r + 16 + 64 에서 8r = 80 이므로 r = 10 이다.
4. 따라서 원의 반지름의 길이는 10 cm 이다.
- 작성자 답: $10\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\overline{\text{AB}} \perp \overline{\text{OC}}$이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\overline{\text{AB}} \perp \overline{\text{OC}}$이고 $\overline{\text{BM}} = 8\text{ cm}$, $\overline{\text{CM}} = 4\text{ cm}$일 때」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 원의 중심에서 현 AB에 내린 수선에 피타고라스 정리를 적용하므로 중심에서 현에 내린 수선(M3-RPM-067)에 해당한다.
**유형** PT=PT_M3_CIRCLE_CHORD / TPL=NONE **원천→판정: PT_CIRCLE_LINE_RELATION → PT_M3_CIRCLE_CHORD**
- 이유: 현 AB의 수선과 반지름 r의 피타고라스 방정식을 이용하므로 원의 현(PT_M3_CIRCLE_CHORD)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: OM = r - 4로 설정하고 직각삼각형 피타고라스 방정식 r^2 = (r-4)^2 + 8^2에서 r = 10을 구하는 2단계 문항이다.

**4칸**
- given: 반지름←stem:「원의 반지름의 길이를 구하는」
- goal: 길이←stem:「반지름의 길이를 구하는 과정을」
- method: 피타고라스 정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: (없음)

**how** OM = r - 4 와 BM = 8 에서 피타고라스 방정식 r^2 = (r-4)^2 + 64 로 반지름 r = 10 cm 를 산출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 반지름의 길이를 $r\text{ cm}$라 하면 $\overline{\text{OB}} = r\text{ cm}$이고 $\overline{\text{OM}} = (r - 4)\text{ cm}$이다. 직각삼각형 $\text{OMB}$에서 피타고라스 정리에 의해 $$r^2 = (r - 4)^2 + 8^2$$ $$r^2 = r^2 - 8r + 16 + 64 \implies 8r = 80 \implies r = 10$$ 따라서 원의 반지름의 길이는 $10\text{ cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 5점


**발문**

다음 그림에서 원 $\text{O}$는 직사각형 $\text{ABCD}$의 세 변과 접하고, 세 점 $\text{E}, \text{F}, \text{G}$는 접점이다. 또 $\overline{\text{DH}}$는 원 $\text{O}$의 접선이고 점 $\text{I}$는 접점이며 $\overline{\text{DH}} = 10\text{ cm}$, $\overline{\text{DC}} = 8\text{ cm}$일 때, $\overline{\text{GH}}$의 길이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2\text{ cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 DCH에서 피타고라스 정리에 의해 CH = sqrt(10^2 - 8^2) = 6 cm 이다.
2. 원 O의 지름이 DC = 8 cm 이므로 반지름은 4 cm 이고 AE = BG = 4 cm 이다.
3. GH = x cm라 하면 BC = 4 + x + 6 = 10 + x cm 이므로 DE = AD - 4 = (10 + x) - 4 = 6 + x cm 이다.
4. 외부점에서 그은 접선의 길이가 같으므로 DI = DE = 6 + x, HI = HG = x 이다.
5. DH = DI + HI = (6 + x) + x = 10 에서 2x = 4 이므로 x = 2 cm 이다.
6. 따라서 GH의 길이는 2 cm 이다.
- 작성자 답: $2\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $\text{O}$는 직사각형

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $\text{O}$는 직사각형 $\text{ABCD}$의 세 변과 접하고」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 직사각형 ABCD와 접선 DH 조건으로 GH = 2 cm 를 구하므로 접선 조건으로 길이 구하기(M3-RPM-072)에 해당한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_EQUAL_LENGTH (원천과 같음)
- 이유: 외부점에서 그은 두 접선의 길이 DI = DE = 6 + x, HI = HG = x 가 같음을 이용하므로 등접선(TPL_CIRCLE_TANGENT_EQUAL_LENGTH)이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: CH = 6 cm와 반지름 4 cm로부터 DE = 6 + x를 표현하고 DH = 10 cm 접선 방정식으로 x = 2 cm를 도출하는 4단계 심화 문항이다.

**4칸**
- given: 직사각형←stem:「직사각형 $\text{ABCD}$의 세 변과」
- goal: 길이←stem:「$\overline{\text{GH}}$의 길이를 구하는」
- method: 접선(NAMED)←solution:「그은 접선의 길이가 같으므로」
- condition: (없음)

**how** CH = 6 과 접선 성질 DI = 6 + x, HI = x 에서 DH = 6 + 2x = 10 으로 GH = 2 cm 를 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $\text{DCH}$에서 피타고라스 정리에 의해 $\overline{\text{CH}} = \sqrt{10^2 - 8^2} = 6\text{ cm}$이다. 원 $\text{O}$는 직사각형의 위·아래 두 변 $\text{AD}, \text{BC}$에 접하므로 지름이 $\overline{\text{DC}} = 8\text{ cm}$이고 반지름은 $4\text{ cm}$이다. 따라서 $\overline{\text{AE}} = \overline{\text{BG}} = 4\text{ cm}$이다. $\overline{\text{GH}} = x\text{ cm}$라 하면 $\overline{\text{BC}} = 4 + x + 6 = (10 + x)\text{ cm}$이므로 $\overline{\text{DE}} = \overline{\text{AD}} - 4 = (6 + x)\text{ cm}$이다. 점 $\text{D}$와 점 $\text{H}$에서 그은 접선의 길이가 같으므로 $\overline{\text{DI}} = \overline{\text{DE}} = 6 + x$, $\overline{\text{HI}} = \overline{\text{HG}} = x$이다. $$\overline{\text{DH}} = (6 + x) + x = 10 \implies 2x = 4 \implies x = 2$$ 따라서 $\overline{\text{GH}} = 2\text{ cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
