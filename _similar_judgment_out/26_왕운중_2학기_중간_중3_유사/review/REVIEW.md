# 검수 묶음 — 26_왕운중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: FIGURE_MISSING 4)**
- 문항 23개 / 검사 PASS 19, FAIL 0, 보류 4
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 14, NONE 5, NEEDS_FIGURE 4
- 난이도 분포: 1단계 2, 2단계 16, 3단계 2, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q4**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q7**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q8**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류) / 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q11**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q13**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)

---
## Q1 — 객관식 3점


**발문**

오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$인 직각삼각형 $\text{ABC}$에서 $\overline{\text{AB}} = 12$, $\overline{\text{BC}} = 13$일 때, $\sin B$의 값은? (3점)

**보기** ① $\frac{12}{13}$  ② $\frac{5}{13}$  ③ $\frac{5}{12}$  ④ $\frac{12}{5}$  ⑤ $\frac{13}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 AB=12, BC=13이다.
2. 피타고라스 정리에 의해 AC = sqrt(13^2 - 12^2) = sqrt(25) = 5이다.
3. sin B = AC / BC = 5/13 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$인 직각삼각형 $\text{ABC}$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「\circ$인 직각삼각형 $\text{」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] (원천과 같음)
- 이유: AB=12, BC=13인 직각삼각형에서 대변과 빗변의 비로 sin 값을 구하는 삼각비의 뜻이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION (원천과 같음)
- 이유: 직각삼각형 ABC에서 변의 길이 12, 13을 통해 기본 삼각비 sin B를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: AB=12, BC=13에서 피타고라스 정리로 AC를 구하고 삼각비 정의를 적용하는 기본 문항이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $\text{」
- goal: 삼각형←stem:「irc$인 직각삼각형 $\text{」
- method: 정리(NAMED)←solution:「로 피타고라스 정리에 의해 $$\」
- condition: 직각←stem:「\circ$인 직각삼각형 $\te」

**how** 직각삼각형 ABC에서 AB=12, BC=13을 이용하여 AC=5를 구한 뒤 sin B = 5/13을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle\text{A} = 90^\circ$이므로 피타고라스 정리에 의해 $$\overline{\text{AC}} = \sqrt{13^2 - 12^2} = \sqrt{169 - 144} = \sqrt{25} = 5$$ 따라서 $\sin B = \frac{\overline{\text{AC}}}{\overline{\text{BC}}} = \frac{5}{13}$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

$\cos 30^\circ \times \tan 60^\circ + \sin 30^\circ$를 계산하면? (3점)

**보기** ① $1$  ② $\frac{3}{2}$  ③ $\sqrt{3}$  ④ $2$  ⑤ $\frac{5}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cos 30도 = sqrt(3)/2 이다.
2. tan 60도 = sqrt(3) 이다.
3. sin 30도 = 1/2 이다.
4. (sqrt(3)/2) * sqrt(3) + 1/2 = 3/2 + 1/2 = 2 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「\times \tan 60^\cir」
**RPM** M3-RPM-058 [삼각비 > 삼각비 > 특수각의 삼각비 > 특수각 계산] (원천과 같음)
- 이유: 30도와 60도 특수각의 삼각비를 곱하고 더하는 특수각 계산이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_SPECIAL_ANGLE
- 이유: 30도와 60도 특수각의 삼각비 값을 이용한 식의 계산 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 30도와 60도의 기본 특수각 값을 공식으로 바로 계산하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 탄젠트←stem:「\times \tan 60^\cir」
- method: 탄젠트(NAMED)←stem:「\times \tan 60^\cir」
- condition: (없음)

**how** 30도와 60도의 특수각 삼각비 값을 대입하여 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\cos 30^\circ = \frac{\sqrt{3}}{2}$, $\tan 60^\circ = \sqrt{3}$, $\sin 30^\circ = \frac{1}{2}$이므로 $$\frac{\sqrt{3}}{2} \times \sqrt{3} + \frac{1}{2} = \frac{3}{2} + \frac{1}{2} = 2$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

다음 그림과 같이 반지름의 길이가 $1$인 사분원을 이용하여 보기에서 $35^\circ$의 삼각비의 값으로 옳은 것만을 있는 대로 고르면? (4점) [보기] ㄱ. $\sin 35^\circ = 0.57$ ㄴ. $\cos 35^\circ = 0.57$ ㄷ. $\tan 35^\circ = 0.82$

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄷ  ④ ㄴ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 1인 사분원에서 35도의 높이는 sin 35도 = 0.57 이다.
2. 사분원 밑변 길이는 cos 35도 = 0.82 이므로 ㄴ은 옳지 않다.
3. x=1에서의 접선 높이는 tan 35도 = 0.70 이므로 ㄷ은 옳지 않다.
4. 따라서 옳은 것은 ㄱ 하나이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 다음 그림과 같이 반지름의 길이가 $1$인 사분원을 이용하여

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「\circ$의 삼각비의 값으로 옳은」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계] **원천→판정: 삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan → 삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계**
- 이유: 단위 사분원에서 각 선분 길이가 나타내는 35도 삼각비의 기하학적 관계이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 사분원의 기하적 선분 길이 0.57, 0.82로부터 35도 삼각비 값을 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분원에서 35도의 sin, cos, tan 값을 0.57 등 수치로 확인하는 기본 개념 문항이다.

**4칸**
- given: 반지름←stem:「그림과 같이 반지름의 길이가 $1」
- goal: 삼각비←stem:「\circ$의 삼각비의 값으로 옳은」
- method: 사분원(NAMED)←stem:「이가 $1$인 사분원을 이용하여 보」
- condition: 길이←stem:「같이 반지름의 길이가 $1$인 사」

**how** 사분원 그림에서 35도에 해당하는 선분의 길이를 읽어 sin 35도 = 0.57임을 확인했다.

<details><summary>저장 해설 (판정 검토용)</summary>

반지름의 길이가 $1$인 사분원에서

- $\sin 35^\circ = 0.57$ (ㄱ 참)  
- $\cos 35^\circ = 0.82$ (ㄴ 거짓)  
- $\tan 35^\circ = 0.70$ (ㄷ 거짓) 따라서 옳은 것은 ㄱ뿐이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$, $\overline{\text{AB}} = 8$, $\overline{\text{AC}} = 15$인 직각삼각형 $\text{ABC}$에서 $\overline{\text{DE}} \perp \overline{\text{BC}}$이고 $\angle\text{BDE} = \alpha$라고 할 때, $\tan\alpha$의 값은? (4점)

**보기** ① $\frac{8}{17}$  ② $\frac{15}{17}$  ③ $\frac{8}{15}$  ④ $\frac{15}{8}$  ⑤ $\frac{7}{15}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 DE와 BC가 수직이므로 각 BDE = alpha = 각 C 이다.
2. tan alpha = tan C = AB / AC 이다.
3. AB=8, AC=15 이므로 tan alpha = 8/15 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$, $\overline{\text{AB}} = 8$, $\overline{\text{AC}} = 15$인 직각삼각형 $\text{ABC}$에서 $\overline{\text{DE}} \perp \overline{\text{BC}}$

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「= 15$인 직각삼각형 $\text{」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] (원천과 같음)
- 이유: 직각삼각형 ABC의 변의 길이 AB=8, AC=15로부터 삼각비의 뜻을 적용한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: DE와 BC의 수직 조건에서 같은 각을 찾아 삼각비 tan alpha를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 ABC에서 각의 동위/닮음 관계를 파악하고 AB, AC 비를 구하는 중급 문항이다.

**4칸**
- given: 직각삼각형←stem:「= 15$인 직각삼각형 $\text{」
- goal: 탄젠트←stem:「할 때, $\tan\alpha$의」
- method: 삼각형(NAMED)←stem:「15$인 직각삼각형 $\text{」
- condition: 직각←stem:「= 15$인 직각삼각형 $\te」

**how** 직각삼각형 ABC에서 닮음 각 관계를 이용하여 각 BDE = 각 C임을 찾고 AB=8, AC=15에서 8/15를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle\text{ABC}$에서 $\angle\text{A} = 90^\circ$이므로 $\tan B = \frac{\overline{\text{AC}}}{\overline{\text{AB}}} = \frac{15}{8}$이다. $\triangle\text{BED}$에서 $\angle\text{BED} = 90^\circ$이므로 $\alpha = 90^\circ - B = \angle C$이다. 따라서 $\tan\alpha = \tan C = \frac{\overline{\text{AB}}}{\overline{\text{AC}}} = \frac{8}{15}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

$45^\circ < \angle\text{A} < 90^\circ$일 때, 다음 식을 간단히 한 것으로 옳은 것은? (4점) $$\sqrt{(\sin A - 1)^2} - \sqrt{(1 - \tan A)^2}$$

**보기** ① $\sin A + \tan A$  ② $\tan A - \sin A$  ③ $\sin A - \tan A$  ④ $\sin A + \tan A - 2$  ⑤ $2 - \sin A - \tan A$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 45도 < A < 90도 에서 0 < sin A < 1 이므로 sin A - 1 < 0 이다.
2. tan A > 1 이므로 1 - tan A < 0 이다.
3. sqrt((sin A - 1)^2) = -(sin A - 1) = 1 - sin A 이다.
4. sqrt((1 - tan A)^2) = -(1 - tan A) = tan A - 1 이다.
5. 준식은 (1 - sin A) - (tan A - 1) = 2 - sin A - tan A 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「t{(1 - \tan A)^2}$$」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계] (원천과 같음)
- 이유: 45도와 90도 사이에서 삼각비의 범위와 관계를 이용해 식의 부호를 판별하는 문항이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: 45도와 90도 범위의 각에 대한 삼각비의 대소 관계를 이용한 근호식 간단히 하기 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 45도 기준 삼각비의 크기 관계를 파악하고 근호의 성질을 결합하는 기본 문항이다.

**4칸**
- given: (없음)
- goal: 탄젠트←stem:「t{(1 - \tan A)^2}$$」
- method: 탄젠트(NAMED)←stem:「t{(1 - \tan A)^2}$$」
- condition: (없음)

**how** 45도와 90도 사이 각 A에 대해 sin A < 1, tan A > 1 부호를 판별하여 근호 식을 정리했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$45^\circ < A < 90^\circ$일 때 $0 < \sin A < 1$, $\tan A > 1$이므로 $\sin A - 1 < 0$, $1 - \tan A < 0$이다. $$\sqrt{(\sin A - 1)^2} = -(\sin A - 1) = 1 - \sin A$$ $$\sqrt{(1 - \tan A)^2} = -(1 - \tan A) = \tan A - 1$$ 따라서 준식은 $(1 - \sin A) - (\tan A - 1) = 2 - \sin A - \tan A$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

보기의 삼각비의 값을 작은 것부터 차례로 나열한 것은? (4점) [보기] ㄱ. $\cos 55^\circ$　ㄴ. $\sin 90^\circ$　ㄷ. $\tan 35^\circ$　ㄹ. $\tan 55^\circ$

**보기** ① ㄱ, ㄷ, ㄴ, ㄹ  ② ㄱ, ㄴ, ㄷ, ㄹ  ③ ㄷ, ㄱ, ㄴ, ㄹ  ④ ㄱ, ㄷ, ㄹ, ㄴ  ⑤ ㄷ, ㄴ, ㄱ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cos 55도는 sin 35도와 같다.
2. 0도 < 35도 < 45도 에서 sin 35도 < tan 35도 < 1 이다.
3. sin 90도 = 1 이다.
4. 55도 > 45도 이므로 tan 55도 > 1 이다.
5. 따라서 작은 것부터 나열하면 cos 55도, tan 35도, sin 90도, tan 55도(ㄱ, ㄷ, ㄴ, ㄹ)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「보기의 삼각비의 값을 작은」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계] (원천과 같음)
- 이유: 55도와 35도 각의 변환 및 90도와 45도 기준 삼각비의 대소 관계를 이용한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 55도와 35도, 90도의 삼각비 대소 관계를 비교하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 55도, 35도, 45도 기준 삼각비 크기를 비교하여 순서를 정하는 기본 문항이다.

**4칸**
- given: (없음)
- goal: 삼각비←stem:「보기의 삼각비의 값을 작은」
- method: 탄젠트(NAMED)←stem:「c$　ㄷ. $\tan 35^\cir」
- condition: (없음)

**how** 55도와 35도의 관계 cos 55도 = sin 35도를 이용하여 45도 및 90도 기준 크기 순서를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\cos 55^\circ = \sin 35^\circ$이고, $0^\circ < 35^\circ < 45^\circ$이므로 $\sin 35^\circ < \tan 35^\circ < 1$이다. 또한 $\sin 90^\circ = 1$이고, $55^\circ > 45^\circ$이므로 $\tan 55^\circ > 1$이다. 따라서 작은 것부터 나열하면 ㄱ, ㄷ, ㄴ, ㄹ이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$인 직각삼각형 $\text{ABC}$에서 점 $\text{G}$는 삼각형 $\text{ABC}$의 무게중심이고 점 $\text{D}$는 빗변 $\text{BC}$의 중점이다. $\overline{\text{AC}} = 12\text{ cm}$이고 $\overline{\text{GD}} = 5\text{ cm}$일 때, $\sin B$의 값은? (4점)

**보기** ① $\frac{1}{3}$  ② $\frac{5}{12}$  ③ $\frac{2}{5}$  ④ $\frac{3}{5}$  ⑤ $\frac{4}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 무게중심 G는 중선 AD를 2:1로 나누므로 AG = 2*GD = 10 이고 AD = 15 이다.
2. 직각삼각형 ABC의 빗변 BC의 중점 D는 외심이므로 BD = CD = AD = 15 이다.
3. 따라서 BC = 30 이다.
4. AC = 12 이므로 sin B = AC / BC = 12/30 = 2/5 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 오른쪽 그림과 같이 $\angle\text{A} = 90^\circ$인 직각삼각형 $\text{ABC}$에서 점 $\text{G}$는

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「\circ$인 직각삼각형 $\text{」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan] **원천→판정: 삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용 → 삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan**
- 이유: 직각삼각형 ABC에서 AC=12와 빗변 BC=30의 비로 sin B를 구하는 삼각비의 뜻이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 직각삼각형 ABC의 기하적 성질과 무게중심 GD로부터 삼각비 sin B를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 ABC의 외심과 무게중심 15, 30 길이를 결합하여 삼각비를 구하는 중급 문항이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $\text{」
- goal: 삼각형←stem:「irc$인 직각삼각형 $\text{」
- method: 무게중심(NAMED)←stem:「{ABC}$의 무게중심이고 점 $\t」
- condition: 중점←stem:「t{BC}$의 중점이다. $\ov」

**how** 무게중심 GD=5에서 중선 AD=15, 빗변 BC=30을 구하고 AC=12를 이용하여 sin B = 2/5를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

무게중심 $\text{G}$는 중선 $\text{AD}$를 $2 : 1$로 나누므로 $\overline{\text{AG}} = 2\overline{\text{GD}} = 10\text{ cm}$이고, $\overline{\text{AD}} = 10 + 5 = 15\text{ cm}$이다. 점 $\text{D}$는 직각삼각형 $\text{ABC}$의 빗변의 중점(외심)이므로 $\overline{\text{BD}} = \overline{\text{CD}} = \overline{\text{AD}} = 15\text{ cm}$이다. 따라서 $\overline{\text{BC}} = 30\text{ cm}$이므로 $\sin B = \frac{\overline{\text{AC}}}{\overline{\text{BC}}} = \frac{12}{30} = \frac{2}{5}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

반지름의 길이가 $1$인 사분원을 좌표평면 위에 나타낼 때, $\angle\text{AOB} = a^\circ$, $\angle\text{OBC} = b^\circ$에 대하여 다음 중에서 점 $\text{B}$의 좌표를 나타내는 것은? (4점)

**보기** ① $(\sin a^\circ, \cos b^\circ)$  ② $(\sin b^\circ, \cos b^\circ)$  ③ $(\cos a^\circ, \tan a^\circ)$  ④ $(\cos b^\circ, \sin b^\circ)$  ⑤ $(\sin b^\circ, \cos a^\circ)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 사분원에서 점 B에서 x축에 내린 수선의 발을 C라 하면 OB = 1 이다.
2. 직각삼각형 OBC에서 a + b = 90도 이므로 cos a도 = sin b도, sin a도 = cos b도 이다.
3. 따라서 점 B의 좌표는 (cos a도, sin a도) = (sin b도, cos b도) 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 반지름의 길이가 $1$인 사분원을 좌표평면 위에 나타낼 때, $\angle\text{AOB} = a^\circ$, $\angle\text{OBC} = b^\circ$에 대하여

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「이가 $1$인 사분원을 좌표평면 위」
**RPM** M3-RPM-056 [삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계] **원천→판정: 삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan → 삼각비 > 삼각비 > 삼각비의 뜻 > 삼각비의 관계**
- 이유: 직각삼각형 OBC에서 a+b=90도 관계를 이용해 점 B의 좌표를 나타내는 삼각비의 관계이다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_GEOMETRIC_DERIVATION
- 이유: 사분원과 좌표평면에서 각 AOB와 각 OBC로부터 좌표를 삼각비로 유도하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: OB=1인 사분원에서 각 AOB와 OBC의 90도 여각 관계를 적용하는 기본 문항이다.

**4칸**
- given: 반지름←stem:「반지름의 길이가 $1」
- goal: 좌표←stem:「$인 사분원을 좌표평면 위에 나타」
- method: 사분원(NAMED)←stem:「이가 $1$인 사분원을 좌표평면 위」
- condition: 길이←stem:「반지름의 길이가 $1$인 사」

**how** 사분원 위 점 B에 대해 직각삼각형 OBC의 각 a+b=90도 여각 성질을 이용해 B(sin b, cos b)를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $\text{B}$에서 $x$축에 내린 수선의 발을 $\text{C}$라 하면 $\overline{\text{OB}} = 1$이므로 $\text{B}(\cos a^\circ, \sin a^\circ)$이다. 직각삼각형 $\text{OBC}$에서 $a + b = 90^\circ$이므로 $\cos a^\circ = \sin b^\circ$, $\sin a^\circ = \cos b^\circ$이다. 따라서 $\text{B}(\sin b^\circ, \cos b^\circ)$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 그림과 같이 지름의 길이가 $16$인 원에 내접하는 정팔각형의 넓이를 구하면? (4점)

**보기** ① $32\sqrt{2}$  ② $64\sqrt{2}$  ③ $96\sqrt{2}$  ④ $112\sqrt{2}$  ⑤ $128\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름 16인 원의 반지름은 8이다.
2. 정팔각형의 중심각은 360/8 = 45도 이다.
3. 합동인 이등변삼각형 8개의 넓이 합은 8 * (1/2 * 8 * 8 * sin 45도) = 128*sqrt(2) 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 지름의 길이가 $16$인 원에 내접하는 정팔각형의 넓이를 구하면?

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「는 정팔각형의 넓이를 구하면? (」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이] (원천과 같음)
- 이유: 지름 16인 원에 내접하는 정팔각형을 45도 중심각의 삼각형 8개로 나누어 구하는 다각형의 넓이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 중심각 45도와 삼각비 sin 45도를 이용하여 다각형 넓이 128*sqrt(2)를 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지름 16에서 반지름을 구하고 45도 이등변삼각형 8개로 넓이 128*sqrt(2)를 직접 계산하는 문항이다.

**4칸**
- given: 지름←stem:「그림과 같이 지름의 길이가 $1」
- goal: 넓이←stem:「는 정팔각형의 넓이를 구하면? (」
- method: 접함(NAMED)←stem:「6$인 원에 내접하는 정팔각형의 넓」
- condition: 길이←stem:「같이 지름의 길이가 $16$인」

**how** 지름 16에서 반지름 8, 정팔각형 중심각 360/8 = 45도를 구하여 넓이 128*sqrt(2)를 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 반지름의 길이는 $8$이고, 정팔각형의 한 중심각의 크기는 $\frac{360^\circ}{8} = 45^\circ$이다. 따라서 정팔각형은 합동인 이등변삼각형 $8$개로 나누어지므로 넓이는 $$8 \times \left(\frac{1}{2} \times 8 \times 8 \times \sin 45^\circ\right) = 8 \times 32 \times \frac{\sqrt{2}}{2} = 128\sqrt{2}$$ 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

그림에서 두 점 $\text{A}, \text{B}$는 각각 직선 $y = mx + n$과 $x$축, $y$축의 교점이고 $\overline{\text{AB}} \perp \overline{\text{OH}}$, $\overline{\text{OH}} = 3$이다. $\angle\text{BAO} = \alpha$라 하면 $\tan\alpha = \frac{3}{4}$일 때, 양수 $m, n$에 대하여 $m + n$의 값은? (단, $\text{O}$는 원점이고, 직선은 제 $2$사분면을 지난다.) (4점)

**보기** ① $\frac{7}{2}$  ② $4$  ③ $\frac{17}{4}$  ④ $\frac{9}{2}$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직선 mx+n의 x절편은 -n/m, y절편은 n이다. tan(BAO) = n / (n/m) = m = 3/4 이다.
2. OA = 4k, OB = 3k 라 두면 AB = 5k 이다.
3. 삼각형 OAB의 넓이에서 (1/2)*4k*3k = (1/2)*5k*3 이므로 12k^2 = 15k, k = 5/4 이다.
4. n = OB = 15/4 이고 m = 3/4 이므로 m + n = 18/4 = 9/2 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림에서 두 점 $\text{A}, \text{B}$는 각각 직선 $y = mx + n$과 $x$축, $y$축의 교점이고 $\overline{\text{AB}} \perp \overline{\text{OH}}$, $\overline{\text{OH}} = 3$이다.

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) **원천→판정: M3-05-TRIG_RATIO_APPLICATION → M3-05-TRIG_RATIO**
- 근거 인용: 「$라 하면 $\tan\alpha =」
**RPM** M3-RPM-059 [삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변] **원천→판정: 삼각비 > 삼각비의 활용 > 복합도형 > 피타고라스 결합 → 삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변**
- 이유: 직선 mx+n과 OH=3에서 삼각형 OAB의 넓이와 변의 비 12, 15를 결합해 변의 길이를 구한다.
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_BASIC_RELATION
- 이유: 직선의 기울기 mx+n과 삼각비 tan(BAO)로부터 변의 길이와 절편을 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직선의 절편과 직각삼각형 OAB의 넓이 공식 12, 15를 결합하는 중급 문항이다.

**4칸**
- given: 원점←stem:「xt{O}$는 원점이고, 직선은」
- goal: 탄젠트←stem:「$라 하면 $\tan\alpha =」
- method: 교점(NAMED)←stem:「, $y$축의 교점이고 $\ove」
- condition: 양수←stem:「4}$일 때, 양수 $m, n$에」

**how** 직선 y=mx+n의 절편에서 m=3/4을 찾고 OH=3과 삼각형 OAB의 넓이로부터 n=15/4를 구해 m+n=9/2를 얻었다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{\text{OA}} = a,\ \overline{\text{OB}} = b$라 하면 $\tan\alpha = \frac{b}{a} = \frac{3}{4}$이므로 $a = 4k,\ b = 3k$ ($k > 0$)라 둘 수 있다. 피타고라스 정리에 의해 $\overline{\text{AB}} = 5k$이다. $\triangle\text{OAB}$의 넓이를 두 가지로 표현하면 $$\frac{1}{2} \cdot 4k \cdot 3k = \frac{1}{2} \cdot 5k \cdot 3 \implies 12k^2 = 15k \implies k = \frac{5}{4}$$ 따라서 $\overline{\text{OA}} = 5,\ \overline{\text{OB}} = \frac{15}{4}$이고, 직선은 $(-5, 0)$과 $\left(0, \frac{15}{4}\right)$를 지나므로 기울기 $m = \frac{3}{4}$, $y$절편 $n = \frac{15}{4}$이다. 그러므로 $m + n = \frac{3}{4} + \frac{15}{4} = \frac{9}{2}$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 그림과 같이 $\overline{\text{AC}} = 30\text{ m}$, $\overline{\text{BC}} = 50\text{ m}$, $\angle\text{ACB} = 60^\circ$일 때, 두 지점 $\text{A}$와 $\text{B}$ 사이의 거리를 구하면? (4점)

**보기** ① $10\sqrt{19}\text{ m}$  ② $10\sqrt{17}\text{ m}$  ③ $10\sqrt{21}\text{ m}$  ④ $20\sqrt{5}\text{ m}$  ⑤ $20\sqrt{7}\text{ m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 A에서 BC에 내린 수선의 발을 H라 하면 CH = 30*cos(60도) = 15 이다.
2. AH = 30*sin(60도) = 15*sqrt(3) 이다.
3. BH = 50 - 15 = 35 이다.
4. 직각삼각형 ABH에서 AB = sqrt(35^2 + (15*sqrt(3))^2) = sqrt(1225 + 675) = sqrt(1900) = 10*sqrt(19) 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{\text{AC}} = 30\text{ m}$, $\overline{\text{BC}} = 50\text{ m}$, $\angle\text{ACB} = 60^\circ$일 때

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「B}$ 사이의 거리를 구하면? (」
**RPM** M3-RPM-063 [삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리] **원천→판정: 삼각비 > 삼각비 > 삼각비와 길이 > 직각삼각형의 변 → 삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리**
- 이유: AC=30, BC=50, 60도 조건에서 수선 AH를 내려 두 지점 사이의 거리를 구하는 측정 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 특수각 60도와 변의 길이를 이용해 직각삼각형을 만들어 변 AB의 거리를 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 60도 특수각을 이용하여 수선의 발 H를 잡고 피타고라스 정리로 10*sqrt(19)를 구하는 기본 문항이다.

**4칸**
- given: 직각삼각형←solution:「t{ m}$$ 직각삼각형 $\text{」
- goal: 거리←stem:「B}$ 사이의 거리를 구하면? (」
- method: 정리(NAMED)←solution:「서 피타고라스 정리에 의해 $$\」
- condition: 수선←solution:「}}$에 내린 수선의 발을 $\t」

**how** AC=30과 60도로부터 CH=15, AH=15*sqrt(3), BH=35를 구한 뒤 피타고라스 정리로 AB=10*sqrt(19)를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $\text{A}$에서 $\overline{\text{BC}}$에 내린 수선의 발을 $\text{H}$라 하면 $$\overline{\text{CH}} = 30\cos 60^\circ = 15\text{ m},\quad \overline{\text{AH}} = 30\sin 60^\circ = 15\sqrt{3}\text{ m}$$ $$\overline{\text{BH}} = 50 - 15 = 35\text{ m}$$ 직각삼각형 $\text{ABH}$에서 피타고라스 정리에 의해 $$\overline{\text{AB}} = \sqrt{35^2 + (15\sqrt{3})^2} = \sqrt{1225 + 675} = \sqrt{1900} = 10\sqrt{19}\text{ m}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

그림과 같이 넓이가 $S$인 삼각형 $\text{ABC}$에서 $\overline{\text{AB}}$의 길이는 $20%$ 줄이고 $\overline{\text{BC}}$의 길이는 $20%$ 늘려서 새로운 삼각형 $\text{A}'\text{BC}'$를 만들었다. 새로운 삼각형 $\text{A}'\text{BC}'$의 넓이는? (4점)

**보기** ① $0.92S$  ② $0.94S$  ③ $0.96S$  ④ $S$  ⑤ $1.04S$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 ABC의 넓이는 S = (1/2)*AB*BC*sin B 이다.
2. 변 BA' = 0.8*AB, 변 BC' = 1.2*BC 이다.
3. 새로운 삼각형의 넓이는 (1/2)*(0.8*AB)*(1.2*BC)*sin B = 0.96*S 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림과 같이 넓이가 $S$인 삼각형 $\text{ABC}$에서

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 넓이가 $S$인 삼」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이] (원천과 같음)
- 이유: 삼각형 ABC의 두 변 AB, BC의 길이를 20% 늘이고 줄였을 때 넓이의 변화를 구하는 평면도형 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각형 ABC의 두 변과 끼인각 B를 이용한 넓이 공식에 비율 변화를 적용하여 0.96S를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ABC의 넓이 공식에서 20% 증감에 따른 0.8과 1.2의 곱 0.96S를 구하는 기본 문항이다.

**4칸**
- given: 삼각형←stem:「이가 $S$인 삼각형 $\text{」
- goal: 넓이←stem:「그림과 같이 넓이가 $S$인 삼」
- method: 삼각형(NAMED)←stem:「이가 $S$인 삼각형 $\text{」
- condition: 길이←stem:「{AB}}$의 길이는 $20%$」

**how** 삼각형 ABC의 두 변 AB, BC를 각각 0.8배, 1.2배 변형하여 넓이 0.96S를 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 삼각형 $\text{ABC}$와 $\text{A}'\text{BC}'$는 $\angle\text{B}$를 공유한다. $$S = \frac{1}{2} \overline{\text{AB}} \cdot \overline{\text{BC}} \sin B$$ $\overline{\text{BA}'} = 0.8\overline{\text{AB}}$, $\overline{\text{BC}'} = 1.2\overline{\text{BC}}$이므로 새로운 삼각형의 넓이는 $$\frac{1}{2} (0.8\overline{\text{AB}})(1.2\overline{\text{BC}})\sin B = 0.96 \left(\frac{1}{2}\overline{\text{AB}}\cdot\overline{\text{BC}}\sin B\right) = 0.96S$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

동굴을 탈출하기 위해 두 사람이 긴 끈에 매달려 있다. 그림과 같이 $\overline{\text{AB}} = \overline{\text{AC}} = 4\text{ m}$, $\angle\text{BAH} = 51^\circ$이고 점 $\text{C}$가 지면으로부터 $0.4\text{ m}$ 높이에 있을 때, 점 $\text{B}$의 지면으로부터의 높이 $h$는? (단, $\sin 51^\circ = 0.78$, $\cos 51^\circ = 0.63$, $\tan 51^\circ = 1.23$으로 계산한다.) (4점)

**보기** ① $1.48\text{ m}$  ② $1.88\text{ m}$  ③ $1.92\text{ m}$  ④ $2.12\text{ m}$  ⑤ $2.52\text{ m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 B에서 연직선 AC에 내린 수선의 발을 H라 하면 AH = 4*cos(51도) = 4*0.63 = 2.52 이다.
2. 점 C가 지면에서 0.4 위에 있고 AC = 4 이다.
3. 따라서 높이 h = 4 + 0.4 - 2.52 = 1.88 m 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 그림과 같이 $\overline{\text{AB}} = \overline{\text{AC}} = 4\text{ m}$, $\angle\text{BAH} = 51^\circ$이고 점 $\text{C}$가 지면으로부터 $0.4\text{ m}$ 높이에 있을 때

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「xt{ m}$ 높이에 있을 때,」
**RPM** M3-RPM-063 [삼각비 > 삼각비의 활용 > 측정 문제 > 높이·거리] (원천과 같음)
- 이유: AB=4, AC=4와 각 BAH=51도에서 cos 51도=0.63을 이용해 높이 1.88 m를 구하는 측정 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: 삼각비 51도와 선분 AH를 이용하여 실생활 높이 1.88을 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AB=4와 51도의 cos 값을 이용하여 AH를 계산하고 지면 기준 높이 1.88을 구하는 문항이다.

**4칸**
- given: 직선←solution:「{B}$에서 연직선 $\text{」
- goal: 높이←stem:「xt{ m}$ 높이에 있을 때,」
- method: 탄젠트(NAMED)←stem:「.63$, $\tan 51^\cir」
- condition: 수선←solution:「C}$에 내린 수선의 발을 $\t」

**how** 연직선 AC=4와 각 BAH=51도에서 AH=2.52를 구하고 지면 높이 0.4를 고려하여 h=1.88 m를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $\text{B}$에서 연직선 $\text{AC}$에 내린 수선의 발을 $\text{H}$라 하면 $$\overline{\text{AH}} = 4\cos 51^\circ = 4 \times 0.63 = 2.52\text{ m}$$ 점 $\text{C}$가 지면에서 $0.4\text{ m}$ 위에 있고 $\overline{\text{AC}} = 4\text{ m}$이므로 $$h = 4 + 0.4 - 2.52 = 1.88\text{ m}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5점


**발문**

직사각형 모양의 색종이를 두 점 $\text{A}$와 $\text{C}$가 겹치도록 접었다. $\overline{\text{AB}} = 5\text{ cm}$, $\overline{\text{AP}} = 13\text{ cm}$이고 $\angle\text{CPQ} = x$라 할 때, $\sin x$의 값은? (5점)

**보기** ① $\frac{\sqrt{26}}{26}$  ② $\frac{2\sqrt{26}}{26}$  ③ $\frac{3\sqrt{26}}{26}$  ④ $\frac{4\sqrt{26}}{26}$  ⑤ $\frac{5\sqrt{26}}{26}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접었을 때 PC = PA = 13 이고 직각삼각형 PDC에서 DC = 5 이므로 PD = 12, AD = 25 이다.
2. 접은 각에 의해 각 APQ = 각 CPQ = x 이고, 접는 선 PQ는 대각선 AC의 수직이등분선이다.
3. 직각삼각형 ADC에서 대각선 AC = sqrt(5^2 + 25^2) = 5*sqrt(26) 이다.
4. 직각삼각형 ADC의 각 CAD에 대해 x = 90도 - 각 CAD 이므로 sin x = cos(각 CAD) = AD / AC = 25 / (5*sqrt(26)) = 5*sqrt(26)/26 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 모양의 색종이」
**RPM** M3-RPM-065 [삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용] **원천→판정: 삼각비 > 삼각비의 활용 > 복합도형 > 피타고라스 결합 → 삼각비 > 삼각비의 활용 > 복합도형 > 보조선 활용**
- 이유: 직사각형에서 AB=5, AP=13으로 접은 도형에 보조선을 그어 접은 각의 삼각비 sin x를 구한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 색종이를 접은 각 CPQ=x의 성질과 대각선 AC의 수직이등분선을 결합하여 삼각비를 구하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형 접기에서 AP=13, AD=25를 찾고 접는 선의 각 관계와 대각선 길이를 결합하는 발전 문항이다.

**4칸**
- given: 직사각형←stem:「직사각형 모양의 색종이」
- goal: 사각형←stem:「직사각형 모양의 색종이」
- method: 직각삼각형(NAMED)←solution:「cm}$이다. 직각삼각형 $\text{」
- condition: 수선←solution:「}}$에 내린 수선의 발을 $\t」

**how** 접은 변의 길이 AP=13에서 AD=25를 구하고 대각선 AC=5*sqrt(26)와 여각 관계를 이용해 sin x = 5*sqrt(26)/26을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

접으면 $\text{A}$와 $\text{C}$가 겹치므로 $\overline{\text{PC}} = \overline{\text{PA}} = 13\text{ cm}$이다. 직각삼각형 $\text{PDC}$에서 $\overline{\text{DC}} = 5\text{ cm}$이므로 $\overline{\text{PD}} = \sqrt{13^2 - 5^2} = 12\text{ cm}$이고, $\overline{\text{AD}} = 13 + 12 = 25\text{ cm}$이다. 점 $\text{Q}$에서 $\overline{\text{AD}}$에 내린 수선의 발을 $\text{H}$라 하면 $\overline{\text{QH}} = 5\text{ cm}$이고, $\overline{\text{CQ}} = \overline{\text{AQ}} = t$라 하면 직각삼각형 $\text{ABQ}$에서 $$t^2 = 5^2 + (25 - t)^2 \implies 50t = 650 \implies t = 13\text{ cm}$$ 따라서 $\overline{\text{AH}} = \overline{\text{BQ}} = 25 - 13 = 12\text{ cm}$이므로 $\overline{\text{PH}} = 13 - 12 = 1\text{ cm}$이다. 직각삼각형 $\text{PHQ}$에서 $\overline{\text{PQ}} = \sqrt{1^2 + 5^2} = \sqrt{26}\text{ cm}$이다. 접은 각에 의해 $\angle\text{APQ} = \angle\text{CPQ} = x$이므로 $\sin x = \frac{\overline{\text{QH}}}{\overline{\text{PQ}}} = \frac{5}{\sqrt{26}} = \frac{5\sqrt{26}}{26}$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 5점


**발문**

그림의 $\triangle\text{OAC}$에서 $\angle\text{A} = 90^\circ$, $\overline{\text{OB}} = 13$, $\sin\angle\text{AOB} = \frac{5}{13}$이고 점 $\text{B}$는 $x$축 양의 부분 위의 점이다. $\overline{\text{OB}}$가 $\triangle\text{OAC}$의 넓이를 이등분할 때, 점 $\text{C}$의 좌표는? (5점)

**보기** ① $\left(\frac{194}{13}, -\frac{50}{13}\right)$  ② $\left(\frac{184}{13}, -\frac{60}{13}\right)$  ③ $\left(\frac{190}{13}, -\frac{60}{13}\right)$  ④ $\left(\frac{194}{13}, -\frac{60}{13}\right)$  ⑤ $\left(\frac{184}{13}, -\frac{50}{13}\right)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 OAB에서 OB = 13, sin(AOB) = 5/13 이므로 AB = 5, OA = 12 이다.
2. A의 좌표는 (12*cos(AOB), 12*sin(AOB)) = (12*(12/13), 12*(5/13)) = (144/13, 60/13) 이다.
3. OB가 삼각형 OAC의 넓이를 이등분하므로 B(13, 0)은 선분 AC의 중점이다.
4. 따라서 C의 좌표는 (2*13 - 144/13, 2*0 - 60/13) = (194/13, -60/13) 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림의 $\triangle\text{OAC}$에서 $\angle\text{A} = 90^\circ$, $\overline{\text{OB}} = 13$, $\sin\angle\text{AOB} = \frac{5}{13}$이고

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「{OAC}$의 넓이를 이등분할 때」
**RPM** M3-RPM-060 [삼각비 > 삼각비 > 삼각비와 길이 > 각을 이용한 길이] (원천과 같음)
- 이유: OB=13과 sin(AOB)=5/13으로부터 직각삼각형 OAB의 각과 길이를 이용해 점 C의 좌표 194, 60을 구한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 삼각형 OAC에서 OB=13과 삼각비를 이용해 점 A의 좌표를 구하고 넓이 이등분 조건으로 점 C의 좌표를 구하는 활용 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: OB=13 삼각비 계산과 점 A의 좌표 144/13, 넓이 이등분에 따른 중점 공식을 결합하는 심화 문항이다.

**4칸**
- given: 부분←stem:「$x$축 양의 부분 위의 점이다.」
- goal: 좌표←stem:「xt{C}$의 좌표는? (5점)」
- method: 이등분선(NAMED)←stem:「}$의 넓이를 이등분할 때, 점 $」
- condition: 넓이←stem:「{OAC}$의 넓이를 이등분할 때」

**how** 삼각비로 A(144/13, 60/13)을 구하고 B(13,0)이 AC의 중점임을 이용해 C(194/13, -60/13)을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $\text{OAB}$에서 $\overline{\text{OB}} = 13$, $\sin\angle\text{AOB} = \frac{5}{13}$이므로 $\overline{\text{AB}} = 5$, $\overline{\text{OA}} = 12$이다. $\angle\text{AOB} = \theta$라 하면 점 $\text{A}$의 좌표는 $$\text{A}(12\cos\theta, 12\sin\theta) = \left(12 \cdot \frac{12}{13}, 12 \cdot \frac{5}{13}\right) = \left(\frac{144}{13}, \frac{60}{13}\right)$$ $\overline{\text{OB}}$가 $\triangle\text{OAC}$의 넓이를 이등분하므로 점 $\text{B}(13, 0)$은 $\overline{\text{AC}}$의 중점이다. 따라서 점 $\text{C}$의 좌표는 $$\left(2 \times 13 - \frac{144}{13},\ 2 \times 0 - \frac{60}{13}\right) = \left(\frac{194}{13}, -\frac{60}{13}\right)$$ 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점


**발문**

다음 그림에서 두 현의 길이가 모두 $16\text{ cm}$이고 원의 반지름의 길이가 $10\text{ cm}$일 때, 원의 중심에서 현까지의 거리 $x$의 값을 구하면? (3점)

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원의 중심 O에서 현에 내린 수선은 현을 이등분하므로 반현의 길이는 16/2 = 8 cm 이다.
2. 반지름이 10 cm 이므로 피타고라스 정리에 의해 x = sqrt(10^2 - 8^2) = sqrt(36) = 6 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 현의 길이가 모두 $16\text{ cm}$이고 원의 반지름의 길이가 $10\text{ cm}$일 때

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「에서 현까지의 거리 $x$의 값을」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 반지름 10과 현의 길이 16에서 중심에서 현에 내린 수선과 반현의 직각삼각형 36, 64를 적용한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 원의 중심에서 현에 내린 수선과 반지름 10을 이용해 현까지의 거리 6을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반지름 10과 현 16에서 반현 8을 이용해 피타고라스 정리로 바로 x=6을 구하는 기본 문항이다.

**4칸**
- given: 반지름←stem:「}$이고 원의 반지름의 길이가 $1」
- goal: 거리←stem:「에서 현까지의 거리 $x$의 값을」
- method: 중심(NAMED)←stem:「일 때, 원의 중심에서 현까지의」
- condition: 길이←stem:「에서 두 현의 길이가 모두 $16」

**how** 현의 길이 16의 절반 8과 반지름 10으로부터 피타고라스 정리 sqrt(100-64)=6을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심 $\text{O}$에서 현에 내린 수선은 현을 이등분하므로 반현의 길이는 $\frac{16}{2} = 8\text{ cm}$이다. 두 현의 길이가 같으므로 중심에서 두 현까지의 거리도 모두 $x\text{ cm}$로 같다. 피타고라스 정리에 의해 $$x = \sqrt{10^2 - 8^2} = \sqrt{100 - 64} = \sqrt{36} = 6$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

오른쪽 그림과 같이 원 $\text{O}$의 중심에서 두 현 $\text{AB}$와 $\text{AC}$에 이르는 거리가 같고 $\angle\text{B} = 63^\circ$일 때, $\angle x$의 크기를 구하면? (4점)

**보기** ① $54^\circ$  ② $56^\circ$  ③ $58^\circ$  ④ $60^\circ$  ⑤ $63^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원의 중심에서 두 현 AB, AC에 이르는 거리가 같으므로 AB = AC 이다.
2. 삼각형 ABC는 이등변삼각형이므로 각 C = 각 B = 63도 이다.
3. 따라서 각 x = 180도 - (63도 + 63도) = 54도 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 오른쪽 그림과 같이 원 $\text{O}$의 중심에서 두 현 $\text{AB}$와 $\text{AC}$에 이르는 거리가 같고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「xt{O}$의 중심에서 두 현 $」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이] (원천과 같음)
- 이유: 중심에서 두 현 AB, AC까지의 거리가 같으면 현의 길이가 같음을 이용해 이등변삼각형 ABC의 각을 구한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH
- 이유: 중심거리와 현의 길이 관계로부터 이등변삼각형 ABC를 찾아 63도와 180도로 각 54도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 두 현 AB, AC의 길이가 같음을 파악하고 이등변삼각형의 내각의 합 180도로 54도를 구하는 기본 문항이다.

**4칸**
- given: 중심←stem:「xt{O}$의 중심에서 두 현 $」
- goal: 거리←stem:「}$에 이르는 거리가 같고 $\a」
- method: 이등변삼각형(NAMED)←solution:「{ABC}$는 이등변삼각형이므로 $\an」
- condition: 삼각형←solution:「C}$는 이등변삼각형이므로 $\an」

**how** 중심거리가 같으므로 AB=AC임을 알고 삼각형 ABC에서 180-(63+63)=54도를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $\overline{\text{AB}} = \overline{\text{AC}}$이다. $\triangle\text{ABC}$는 이등변삼각형이므로 $\angle\text{C} = \angle\text{B} = 63^\circ$이다. 따라서 $\angle x = \angle\text{A} = 180^\circ - (63^\circ + 63^\circ) = 54^\circ$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

다음 그림과 같이 $\overline{\text{PA}}, \overline{\text{PB}}$는 반지름의 길이가 $4$인 원 $\text{O}$의 접선이고, 두 점 $\text{A}, \text{B}$는 그 접점이다. $\angle\text{APB} = 60^\circ$일 때, $\overline{\text{PA}}$와 $\overline{\text{PB}}$의 길이의 합을 구하면? (4점)

**보기** ① $4\sqrt{3}$  ② $6\sqrt{3}$  ③ $8$  ④ $8\sqrt{3}$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. OA perp PA, OB perp PB 이고 OA = OB = 4 이므로 삼각형 OAP와 OBP는 합동이다.
2. 각 APO = (1/2)*60도 = 30도 이다.
3. 직각삼각형 OAP에서 PA = 4 / tan(30도) = 4*sqrt(3) 이다.
4. PB = PA = 4*sqrt(3) 이므로 PA + PB = 8*sqrt(3) 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{\text{PA}}, \overline{\text{PB}}$는 반지름의 길이가 $4$인 원 $\text{O}$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「xt{O}$의 접선이고, 두 점」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선] (원천과 같음)
- 이유: 원 밖의 한 점 P에서 그은 두 접선 PA, PB의 길이와 60도 특수각을 결합하여 길이를 구한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 원 밖의 점에서 그은 두 접선의 성질과 30도 직각삼각형 OAP로부터 접선의 길이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선과 반지름 OA의 수직 조건 및 각 APB=60도 이등분을 이용해 8*sqrt(3)을 계산하는 문항이다.

**4칸**
- given: 반지름←stem:「{PB}}$는 반지름의 길이가 $4」
- goal: 길이←stem:「$는 반지름의 길이가 $4$인 원」
- method: 접선(NAMED)←stem:「xt{O}$의 접선이고, 두 점」
- condition: 접점←stem:「{B}$는 그 접점이다. $\an」

**how** 접선 성질 PA=PB와 각 APO=30도를 이용해 PA=4*sqrt(3)을 구하고 합 8*sqrt(3)을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{\text{OA}} \perp \overline{\text{PA}}$, $\overline{\text{OB}} \perp \overline{\text{PB}}$이고 $\overline{\text{OA}} = \overline{\text{OB}} = 4$이므로 $\triangle\text{OAP} \equiv \triangle\text{OBP}$ (RHS 합동)이다. 따라서 $\angle\text{APO} = \frac{1}{2}\angle\text{APB} = 30^\circ$이다. 직각삼각형 $\text{OAP}$에서 $\tan 30^\circ = \frac{\overline{\text{OA}}}{\overline{\text{PA}}} = \frac{4}{\overline{\text{PA}}} = \frac{1}{\sqrt{3}}$이므로 $\overline{\text{PA}} = 4\sqrt{3}$이다. $\overline{\text{PB}} = \overline{\text{PA}} = 4\sqrt{3}$이므로 $\overline{\text{PA}} + \overline{\text{PB}} = 8\sqrt{3}$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

보기에서 원의 중심을 찾기 위한 세 사람의 대화를 읽고 옳은 것만을 있는 대로 고른 것은? (4점) [보기] 지수: 원에 외접하는 삼각형을 그리고 두 변의 수직이등분선의 교점을 찾으면 돼. 수호: 원에 서로 다른 두 현을 긋고 각 현의 수직이등분선이 만나는 점을 찾으면 돼. 민준: 원에 내접하는 삼각형을 그리고 두 내각의 이등분선이 만나는 점을 찾으면 돼.

**보기** ① 지수  ② 수호  ③ 지수, 수호  ④ 수호, 민준  ⑤ 지수, 민준

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원의 중심은 원 위의 서로 다른 두 현의 수직이등분선의 교점이다.
2. 지수: 외접삼각형의 변의 수직이등분선 교점은 외심으로 원의 중심(내심)과 다르다.
3. 수호: 현의 수직이등분선은 원의 중심을 지나므로 참이다.
4. 민준: 내접삼각형 내각의 이등분선 교점은 내심으로 원의 중심(외심)과 다르다.
5. 따라서 옳은 사람은 4점 배점 문항에서 수호뿐이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「리고 두 변의 수직이등분선의 교점을 찾으」
**RPM** M3-RPM-068 [원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심] (원천과 같음)
- 이유: 원의 중심을 찾기 위해 현의 수직이등분선의 교점을 이용하는 원의 성질이다. 4점 배점 문항이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_PERP_BISECTOR
- 이유: 현의 수직이등분선과 원의 중심의 관계를 대화 형식으로 판정하는 4점 문항 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 원의 중심과 삼각형의 외심, 내심 정의를 구별하고 현의 수직이등분선 성질을 평가하는 4점 문항이다.

**4칸**
- given: 삼각형←stem:「원에 외접하는 삼각형을 그리고 두」
- goal: 수직이등분선←stem:「리고 두 변의 수직이등분선의 교점을 찾으」
- method: 이등분선(NAMED)←stem:「두 변의 수직이등분선의 교점을 찾으」
- condition: 접함←stem:「지수: 원에 외접하는 삼각형을 그리」

**how** 수호의 설명만이 현의 수직이등분선이 원의 중심을 지난다는 원의 성질에 부합함을 확인했다. 4점 문항이다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심은 원 위의 서로 다른 두 현의 수직이등분선의 교점이다.

- 지수: 원에 외접하는 삼각형의 두 변의 수직이등분선의 교점은 원의 중심이 아니라 삼각형의 외심이다. (거짓)  
- 수호: 서로 다른 두 현의 수직이등분선은 각각 원의 중심을 지나므로 교점이 원의 중심이다. (참)  
- 민준: 내접하는 삼각형의 내각의 이등분선의 교점은 내심이므로 원의 중심이 아니다. (거짓) 따라서 옳은 사람은 수호뿐이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점


**발문**

그림과 같이 가로의 길이가 $12\text{ cm}$, 세로의 길이가 $8\text{ cm}$인 직사각형 $\text{ABCD}$의 $3$개의 변에 원 $\text{O}$가 내접하고 $\overline{\text{DE}}$는 원 $\text{O}$의 접선일 때, $\overline{\text{EC}}$의 길이를 구하면? (5점)

**보기** ① $3\text{ cm}$  ② $4\text{ cm}$  ③ $\frac{9}{2}\text{ cm}$  ④ $5\text{ cm}$  ⑤ $6\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직사각형 ABCD에서 원 O의 반지름은 8/2 = 4 cm 이다.
2. D에서 원 O에 그은 접선의 길이는 DT = 12 - 4 = 8 cm 이다.
3. EC = x 라 두면 ET = EV = (12 - 4) - x = 8 - x 이므로 DE = 8 + (8 - x) = 16 - x 이다.
4. 직각삼각형 ECD에서 8^2 + x^2 = (16 - x)^2 이므로 64 + x^2 = 256 - 32x + x^2 에서 32x = 192, x = 6 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림과 같이 가로의 길이가 $12\text{ cm}$, 세로의 길이가 $8\text{ cm}$인 직사각형 $\text{ABCD}$의 $3$개의 변에 원 $\text{O}$가 내접하고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「{ cm}$인 직사각형 $\text{」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 직사각형 ABCD에 내접하는 원과 접선 DE에서 접선 길이 성질 16-x와 피타고라스 정리를 결합한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 직사각형과 원의 접선 성질을 이용해 DE=16-x를 세우고 직각삼각형 ECD에서 EC=6을 구하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형의 세 변에 접하는 원의 접선 성질과 직각삼각형 피타고라스 정리 256, 192를 결합하는 응용 문항이다.

**4칸**
- given: 직사각형←stem:「{ cm}$인 직사각형 $\text{」
- goal: 길이←stem:「같이 가로의 길이가 $12\te」
- method: 접선(NAMED)←stem:「xt{O}$의 접선일 때, $\o」
- condition: 내접←stem:「xt{O}$가 내접하고 $\ove」

**how** 접선 DT=8, ET=8-x로 DE=16-x를 세운 뒤 직각삼각형 ECD에서 피타고라스 정리로 EC=6을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 $\text{O}$의 반지름의 길이는 $\frac{8}{2} = 4\text{ cm}$이다. $\overline{\text{DE}}$의 접점을 $\text{T}$, 변 $\text{BC}$와의 접점을 $\text{V}$라 하자. 점 $\text{D}$에서 원 $\text{O}$에 그은 두 접선의 길이는 같으므로 $\overline{\text{DT}} = 12 - 4 = 8\text{ cm}$이다. $\overline{\text{EC}} = x\text{ cm}$라 하면 $\overline{\text{ET}} = \overline{\text{EV}} = (12 - 4) - x = (8 - x)\text{ cm}$이므로 $\overline{\text{DE}} = 8 + (8 - x) = (16 - x)\text{ cm}$이다. 직각삼각형 $\text{ECD}$에서 피타고라스 정리에 의해 $$8^2 + x^2 = (16 - x)^2 \implies 64 + x^2 = 256 - 32x + x^2 \implies 32x = 192 \implies x = 6$$ 따라서 $\overline{\text{EC}} = 6\text{ cm}$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 7점


**발문**

다음 그림에서 원 $\text{O}$는 $\triangle\text{ABC}$에 내접하고, 점 $\text{D}, \text{E}, \text{F}$는 접점이다. $\overline{\text{AB}} = 12\text{ cm}$, $\overline{\text{BE}} = 7\text{ cm}$, $\overline{\text{BC}} = 13\text{ cm}$일 때, $\triangle\text{ABC}$의 둘레의 길이를 구하시오. (7점) ($\overline{\text{BD}}, \overline{\text{CF}}, \overline{\text{AF}}$ 길이 구하기 각각 2점, $\triangle\text{ABC}$의 둘레의 길이 구하기 1점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $36\text{ cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 BD = BE = 7 cm 이다.
2. AD = AB - BD = 12 - 7 = 5 cm 이므로 AF = AD = 5 cm 이다.
3. CE = BC - BE = 13 - 7 = 6 cm 이므로 CF = CE = 6 cm 이다.
4. 삼각형 ABC의 둘레는 2*(7 + 5 + 6) = 36 cm 이다.
- 작성자 답: $36\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $\text{O}$는 $\triangle\text{ABC}$에 내접하고, 점 $\text{D}, \text{E}, \text{F}$는 접점이다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「{ABC}$의 둘레의 길이를 구하」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 내접원의 접선 길이 성질 BD=BE=7, AD=AF=5, CE=CF=6을 이용해 둘레 36을 구한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 삼각형 ABC에 내접하는 원의 접선 성질을 이용해 변의 길이와 둘레 36을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AB=12, BC=13에서 접선의 길이 성질을 차례로 적용해 둘레 36을 구하는 기본 서술형 문항이다.

**4칸**
- given: 접점←stem:「xt{F}$는 접점이다. $\ov」
- goal: 둘레←stem:「{ABC}$의 둘레의 길이를 구하」
- method: 접점(NAMED)←stem:「xt{F}$는 접점이다. $\ov」
- condition: 내접←stem:「{ABC}$에 내접하고, 점 $\」

**how** 접선 길이 성질로 BD=7, AF=5, CF=6을 구한 뒤 둘레 2*(7+5+6)=36 cm를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점에서 원에 그은 두 접선의 길이는 같으므로

- $\overline{\text{BD}} = \overline{\text{BE}} = 7\text{ cm}$  
- $\overline{\text{AD}} = \overline{\text{AB}} - \overline{\text{BD}} = 12 - 7 = 5\text{ cm} \implies \overline{\text{AF}} = \overline{\text{AD}} = 5\text{ cm}$  
- $\overline{\text{CE}} = \overline{\text{BC}} - \overline{\text{BE}} = 13 - 7 = 6\text{ cm} \implies \overline{\text{CF}} = \overline{\text{CE}} = 6\text{ cm}$ 따라서 $\triangle\text{ABC}$의 둘레의 길이는 $$2(7 + 5 + 6) = 36\text{ cm}$$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 7점


**발문**

다음 그림과 같이 $\angle\text{ABD} = 90^\circ$, $\overline{\text{AD}} = 12\text{ cm}$, $\angle\text{DAB} = 60^\circ$, $\overline{\text{DC}} = 10\text{ cm}$, $\angle\text{BDC} = 30^\circ$인 $\square\text{ABCD}$의 넓이를 구하시오. (7점) ($\overline{\text{BD}}$의 길이를 구한 경우 1점, $\triangle\text{ABD}$의 넓이를 구한 경우 2점, $\triangle\text{DBC}$의 넓이를 구한 경우 2점, $\square\text{ABCD}$의 넓이를 구한 경우 2점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $33\sqrt{3}\text{ cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 ABD에서 AD=12, 60도이므로 AB = 12*cos(60도) = 6, BD = 12*sin(60도) = 6*sqrt(3) 이다.
2. 삼각형 ABD의 넓이는 (1/2)*6*6*sqrt(3) = 18*sqrt(3) 이다.
3. 삼각형 DBC에서 DC=10, 30도이므로 넓이는 (1/2)*6*sqrt(3)*10*sin(30도) = 15*sqrt(3) 이다.
4. 사각형 ABCD의 넓이는 18*sqrt(3) + 15*sqrt(3) = 33*sqrt(3) cm^2 이다.
- 작성자 답: $33\sqrt{3}\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle\text{ABD} = 90^\circ$, $\overline{\text{AD}} = 12\text{ cm}$, $\angle\text{DAB} = 60^\circ$, $\overline{\text{DC}} = 10\text{ cm}$, $\angle\text{BDC} = 30^\circ$인 $\square\text{ABCD}$의 넓이를 구하시오.

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「ABCD}$의 넓이를 구하시오.」
**RPM** M3-RPM-062 [삼각비 > 삼각비의 활용 > 평면도형 > 다각형의 길이·넓이] (원천과 같음)
- 이유: 직각삼각형 ABD와 삼각형 DBC의 넓이 18*sqrt(3), 15*sqrt(3)을 합하여 사각형 ABCD의 넓이를 구한다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE
- 이유: 특수각 60도, 30도와 두 변의 길이를 이용해 다각형 ABCD의 넓이 33*sqrt(3)을 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: AD=12와 DC=10에서 BD=6*sqrt(3)을 구하고 두 삼각형의 넓이 합을 구하는 기본 서술형 문항이다.

**4칸**
- given: 직각삼각형←solution:「직각삼각형 $\text{」
- goal: 넓이←stem:「ABCD}$의 넓이를 구하시오.」
- method: 직각삼각형(NAMED)←solution:「직각삼각형 $\text{」
- condition: 길이←stem:「{BD}}$의 길이를 구한 경우」

**how** 삼각형 ABD 넓이 18*sqrt(3)과 DBC 넓이 15*sqrt(3)을 각각 구하여 사각형 ABCD의 넓이 33*sqrt(3)을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $\text{ABD}$에서 $\overline{\text{AD}} = 12\text{ cm}$, $\angle\text{DAB} = 60^\circ$이므로 $$\overline{\text{AB}} = 12\cos 60^\circ = 6\text{ cm},\quad \overline{\text{BD}} = 12\sin 60^\circ = 6\sqrt{3}\text{ cm}$$ $$\triangle\text{ABD} = \frac{1}{2} \times 6 \times 6\sqrt{3} = 18\sqrt{3}\text{ cm}^2$$ $\triangle\text{DBC}$에서 $\overline{\text{DC}} = 10\text{ cm}$, $\angle\text{BDC} = 30^\circ$이므로 $$\triangle\text{DBC} = \frac{1}{2} \times 6\sqrt{3} \times 10 \times \sin 30^\circ = 30\sqrt{3} \times \frac{1}{2} = 15\sqrt{3}\text{ cm}^2$$ 따라서 $\square\text{ABCD} = 18\sqrt{3} + 15\sqrt{3} = 33\sqrt{3}\text{ cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 6점


**발문**

물체를 올려본각 또는 내려본각의 크기를 측정하는 기구를 ‘클리노미터(clinometer)’라고 한다. 그림과 같이 측정자의 눈높이는 $1.5\text{ m}$, 측정자와 나무 사이의 거리는 $12\text{ m}$이고, 빨대와 수직인 실이 이루는 각이 $60^\circ$일 때, 측정자가 측정한 나무의 높이를 구하시오. (6점) (올바른 삼각비를 이용하는 과정 3점, 측정한 나무의 높이를 구하는 과정 3점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(1.5 + 4\sqrt{3})\text{ m}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 빨대와 수직인 실이 60도를 이루므로 수평선과 이루는 올려본각은 90 - 60 = 30도 이다.
2. 눈높이 위 나무 높이는 12*tan(30도) = 12*(sqrt(3)/3) = 4*sqrt(3) 이다.
3. 측정자의 눈높이 1.5 m를 더하면 나무의 높이는 (1.5 + 4*sqrt(3)) m 이다.
- 작성자 답: $(1.5 + 4\sqrt{3})\text{ m}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림과 같이 측정자의 눈높이는 $1.5\text{ m}$, 측정자와 나무 사이의 거리는 $12\text{ m}$이고

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「나무 사이의 거리는 $12\te」
**RPM** M3-RPM-064 [삼각비 > 삼각비의 활용 > 측정 문제 > 앙각·부각] (원천과 같음)
- 이유: clinometer에서 60도 각을 이용해 30도 앙각을 찾고 거리 12와 눈높이 1.5로 높이를 구하는 앙각 문제이다.
**유형** PT=PT_TRIG_RATIO_APPLICATION / TPL=TPL_TRIG_APPLICATION_DIRECT_MEASURE (원천과 같음)
- 이유: clinometer로 측정한 60도 각과 거리 12로부터 실생활 나무의 높이를 구하는 삼각비 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: clinometer 60도에서 30도 올려본각을 유도하고 거리 12와 눈높이 1.5를 결합하는 기본 응용 문항이다.

**4칸**
- given: 거리←stem:「나무 사이의 거리는 $12\te」
- goal: 올려본각←stem:「물체를 올려본각 또는 내려본각」
- method: 삼각비(NAMED)←stem:「점) (올바른 삼각비를 이용하는 과」
- condition: 내려본각←stem:「올려본각 또는 내려본각의 크기를 측정」

**how** 실이 이루는 각 60도에서 올려본각 30도를 찾고 거리 12와 눈높이 1.5로부터 나무 높이 (1.5+4*sqrt(3)) m를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

빨대와 수직인 실이 이루는 각이 $60^\circ$이므로 빨대가 수평선과 이루는 올려본각은 $90^\circ - 60^\circ = 30^\circ$이다. 눈높이보다 높은 나무의 길이를 $x\text{ m}$라 하면 $$x = 12\tan 30^\circ = 12 \times \frac{\sqrt{3}}{3} = 4\sqrt{3}\text{ m}$$ 여기에 측정자의 눈높이 $1.5\text{ m}$를 더하면 나무의 높이는 $(1.5 + 4\sqrt{3})\text{ m}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
