# 검수 묶음 — 25_연향중_2학기_기말_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 23개 / 검사 PASS 22, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 15, NONE 8
- 난이도 분포: 1단계 3, 2단계 16, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q16**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (PT, 난이도)
- **Q20**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 원천 값과 다른 칸 2개 (RPM, 난이도)

---
## Q1 — 객관식 4점


**발문**

다음 그림과 같이 점 $O$를 중심으로 하는 두 동심원에서 작은 원의 접선과 큰 원의 두 교점을 각각 $A$, $B$라 하자. $\overline{AB} = 16,\mathrm{cm}$일 때, 두 원 사이의 색칠한 부분의 넓이는? [4점]

**보기** ① $64\pi,\mathrm{cm}^2$  ② $68\pi,\mathrm{cm}^2$  ③ $72\pi,\mathrm{cm}^2$  ④ $76\pi,\mathrm{cm}^2$  ⑤ $80\pi,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 동심원에서 작은 원의 접선 AB에 내린 수선의 발 M은 AB를 이등분하므로 AM = 8 cm이다.
2. 작은 원의 반지름 r, 큰 원의 반지름 R이라 하면 직각삼각형 OMA에서 R^2 - r^2 = 8^2 = 64이다.
3. 두 원 사이의 색칠한 부분의 넓이는 pi*(R^2 - r^2) = 64*pi cm^2이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 점 $O$를 중심으로 하는 두 동심원

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「작은 원이 직선 $AB$와 만나는 접점을 $M$이라 하」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 중심 O에서 현 AB = 16에 내린 수선이 현을 이등분함을 이용하여 64pi를 산출한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH (원천과 같음) (원천과 같음)
- 이유: 현 AB = 16의 절반인 AM = 8을 직각삼각형에 적용하여 두 동심원의 넓이 차 64pi를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 OMA에서 피타고라스 정리로 R^2 - r^2 = 64를 바로 계산하므로 난이도 2이다.

**4칸**
- given: 동심원←stem:「으로 하는 두 동심원에서 작은 원의」
- goal: 넓이←stem:「색칠한 부분의 넓이는? [4점]」
- method: 정리(NAMED)←solution:「서 피타고라스 정리에 의하여 $$」
- condition: (없음)

**how** 현 AB = 16의 중점 AM = 8에서 R^2 - r^2 = 64를 얻어 넓이 64pi를 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

작은 원이 직선 $AB$와 만나는 접점을 $M$이라 하자. 원의 중심에서 접점에 그은 반지름은 접선과 수직이므로 $\overline{OM} \perp \overline{AB}$이다. 큰 원에서 중심 $O$에서 현 $AB$에 내린 수선은 현을 이등분하므로 $M$은 $\overline{AB}$의 중점이다. $$ \begin{aligned} \overline{AM} = \overline{BM} = \dfrac{\overline{AB}}{2} = \dfrac{16}{2} = 8,\mathrm{cm} \end{aligned} $$ 작은 원의 반지름의 길이를 $r$, 큰 원의 반지름의 길이를 $R$이라 하면 직각삼각형 $OMA$에서 피타고라스 정리에 의하여 $$ \begin{aligned} R^2 &= r^2 + 8^2 \ R^2 - r^2 &= 64 \end{aligned} $$ 색칠한 부분의 넓이는 큰 원의 넓이에서 작은 원의 넓이를 뺀 값이므로 $$ \begin{aligned} \pi R^2 - \pi r^2 &= \pi(R^2 - r^2) \ &= 64\pi,\mathrm{cm}^2 \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

다음 그림의 원 $O$에서 $\overline{OM} \perp \overline{AB}$, $\overline{ON} \perp \overline{AC}$이고 $\overline{OM} = \overline{ON}$이다. $\angle BAC = 44^\circ$일 때, $\angle x = \angle ABC$의 크기는? [3점]

**보기** ① $66^\circ$  ② $68^\circ$  ③ $70^\circ$  ④ $72^\circ$  ⑤ $74^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심 O에서 두 현 AB, AC까지의 거리가 OM = ON으로 같으므로 현의 길이 AB = AC이다.
2. 삼각형 ABC는 AB = AC인 이등변삼각형이므로 꼭지각 44도에 대하여 밑각 angle ABC = (180도 - 44도)/2 = 68도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 $\overline{OM} 

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원의 중심 $O$에서 두 현 $AB, AC$까지의 거리」
**RPM** M3-RPM-069 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이] (원천과 같음)
- 이유: 중심거리 OM = ON으로 두 현 AB, AC의 길이가 같음을 활용하여 68도를 구한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD (원천과 같음) **원천→판정: TM_CIRCLE_CHORD_LENGTH → TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD**
- 이유: 중심거리가 같은 두 현에 의해 생성된 이등변삼각형에서 밑각 68도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 꼭지각 44도로부터 이등변삼각형 밑각 공식으로 68도를 단번에 도출하므로 난이도 2이다.

**4칸**
- given: 이등변삼각형←solution:「점이 $A$인 이등변삼각형이다. 삼각형의」
- goal: 내각←solution:「삼각형의 세 내각의 크기의 합은」
- method: 거리(NAMED)←solution:「AC$까지의 거리가 $\over」
- condition: (없음)

**how** OM = ON으로 AB = AC인 이등변삼각형임을 확인하고 (180 - 44)/2 = 68도로 계산하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심 $O$에서 두 현 $AB, AC$까지의 거리가 $\overline{OM} = \overline{ON}$으로 같다. 한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 $$ \begin{aligned} \overline{AB} = \overline{AC} \end{aligned} $$ 따라서 $\triangle ABC$는 꼭짓점이 $A$인 이등변삼각형이다. 삼각형의 세 내각의 크기의 합은 $180^\circ$이고 꼭지각이 $\angle BAC = 44^\circ$이므로 밑각 $\angle x$의 크기는 $$ \begin{aligned} \angle x &= \dfrac{180^\circ - 44^\circ}{2} \ &= \dfrac{136^\circ}{2} \ &= 68^\circ \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 5점


**발문**

다음 그림에서 $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이고 원 $O$에 내접한다. $\angle BAC = 120^\circ$, $\overline{OA} = \overline{AB} = 8$이고 $\overline{OD} \perp \overline{AB}$일 때, $\overline{OE}$의 길이는? (단, $E$는 $\overline{OD}$와 $\overline{AB}$의 교점이다.) [5점]

**보기** ① $2\sqrt{3}$  ② $3\sqrt{3}$  ③ $4\sqrt{3}$  ④ $5\sqrt{3}$  ⑤ $6\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심 O에서 현 AB에 내린 수선의 발 E는 AB의 중점이므로 AE = 8/2 = 4이다.
2. 반지름 OA = 8이고 angle OEA = 90도인 직각삼각형 OEA에서 OE^2 = 8^2 - 4^2 = 48이다.
3. 따라서 OE = sqrt(48) = 4*sqrt(3)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\triangle ABC$는 $\ove

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원의 중심 $O$에서 현 $AB$에 내린 수선은 현을 」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] (원천과 같음)
- 이유: 중심에서 현 AB = 8에 내린 수선이 현을 이등분하여 AE = 4가 됨을 활용한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH (원천과 같음) (원천과 같음)
- 이유: 현의 길이 AB = 8과 반지름 OA = 8로부터 수선 OE의 길이 4*sqrt(3)을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리 OE = sqrt(8^2 - 4^2) = 4*sqrt(3)으로 바로 계산되므로 난이도 2이다.

**4칸**
- given: 이등변삼각형←stem:「e{AC}$인 이등변삼각형이고 원 $O$」
- goal: 길이←stem:「e{OE}$의 길이는? (단, $」
- method: 정리(NAMED)←solution:「로 피타고라스 정리에 의하여 $$」
- condition: (없음)

**how** 현 AB = 8의 중점 AE = 4와 OA = 8로 피타고라스 정리에서 OE = 4*sqrt(3)을 산출하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심 $O$에서 현 $AB$에 내린 수선은 현을 이등분하므로 교점 $E$는 현 $\overline{AB}$의 중점이다. $$ \begin{aligned} \overline{AE} = \dfrac{\overline{AB}}{2} = \dfrac{8}{2} = 4 \end{aligned} $$ 또한 반지름의 길이는 $\overline{OA} = 8$이다. 직각삼각형 $OEA$에서 $\angle OEA = 90^\circ$이므로 피타고라스 정리에 의하여 $$ \begin{aligned} \overline{OE}^2 + \overline{AE}^2 &= \overline{OA}^2 \ \overline{OE}^2 + 4^2 &= 8^2 \ \overline{OE}^2 + 16 &= 64 \ \overline{OE}^2 &= 48 \ \overline{OE} &= \sqrt{48} = 4\sqrt{3} \end{aligned} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 접점이다. $\angle APB = 60^\circ$, $\overline{OB} = 4,\mathrm{cm}$일 때, $\overline{PA} + \overline{PB}$의 길이는? [4점]

**보기** ① $4\sqrt{3},\mathrm{cm}$  ② $6\sqrt{3},\mathrm{cm}$  ③ $8,\mathrm{cm}$  ④ $8\sqrt{3},\mathrm{cm}$  ⑤ $12,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 P에서 그은 두 접선의 길이는 같으므로 PA = PB이고, OP는 각 APB를 이등분하여 angle BPO = 30도이다.
2. 직각삼각형 PBO에서 OB = 4 cm이므로 PB = 4 / tan(30도) = 4*sqrt(3) cm이다.
3. 따라서 PA + PB = 4*sqrt(3) + 4*sqrt(3) = 8*sqrt(3) cm이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 선분 $\overline{PA}, \

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 밖의 한 점 $P$에서 원에 그은 두 접선의 길이는」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선] (원천과 같음)
- 이유: 원 밖의 점 P에서 그은 두 접선 PA, PB의 길이가 같음을 활용하여 8*sqrt(3)을 구한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH (원천과 같음) (원천과 같음)
- 이유: 접선각 60도와 반지름 OB = 4로부터 접선의 길이 합 8*sqrt(3)을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반각 30도와 tan 30도 공식으로 PB = 4*sqrt(3)을 즉시 구하므로 난이도 2이다.

**4칸**
- given: 접선←stem:「원 $O$의 접선이고 두 점 $」
- goal: 길이←stem:「e{PB}$의 길이는? [4점]」
- method: 탄젠트(NAMED)←solution:「igned} \tan 30^\cir」
- condition: (없음)

**how** 반각 30도와 OB = 4로 직각삼각형에서 PB = 4*sqrt(3)을 얻어 PA + PB = 8*sqrt(3)으로 계산하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점 $P$에서 원에 그은 두 접선의 길이는 같으므로 $\overline{PA} = \overline{PB}$이다. 선분 $OP$는 $\angle APB$를 이등분하므로 $$ \begin{aligned} \angle BPO = \dfrac{60^\circ}{2} = 30^\circ \end{aligned} $$ 반지름 $\overline{OB}$는 접선 $\overline{PB}$에 수직이므로 $\triangle PBO$는 $\angle PBO = 90^\circ$인 직각삼각형이다. $$ \begin{aligned} \tan 30^\circ &= \dfrac{\overline{OB}}{\overline{PB}} = \dfrac{4}{\overline{PB}} \ \dfrac{1}{\sqrt{3}} &= \dfrac{4}{\overline{PB}} \ \overline{PB} &= 4\sqrt{3},\mathrm{cm} \end{aligned} $$ 따라서 $\overline{PA} = 4\sqrt{3},\mathrm{cm}$이므로 두 접선의 길이의 합은 $$ \begin{aligned} \overline{PA} + \overline{PB} &= 4\sqrt{3} + 4\sqrt{3} \ &= 8\sqrt{3},\mathrm{cm} \end{aligned} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

다음 그림과 같이 원 $O$는 $\triangle ABC$의 내접원이고 세 점 $D, E, F$는 접점이다. $\overline{AB} = 10,\mathrm{cm}$, $\overline{AC} = 8,\mathrm{cm}$, $\overline{AF} = 6,\mathrm{cm}$일 때, $\overline{BC}$의 길이는? [4점]

**보기** ① $3,\mathrm{cm}$  ② $4,\mathrm{cm}$  ③ $5,\mathrm{cm}$  ④ $5.5,\mathrm{cm}$  ⑤ $6,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 꼭짓점에서 내접원에 그은 접선의 길이는 같으므로 AE = AF = 6 cm이다.
2. BF = AB - AF = 10 - 6 = 4 cm이고, CE = AC - AE = 8 - 6 = 2 cm이다.
3. BD = BF = 4 cm, CD = CE = 2 cm이므로 BC = BD + CD = 4 + 2 = 6 cm이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$는 $\triangle AB

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형의 꼭짓점에서 내접원에 그은 두 접선의 길이는 서」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] (원천과 같음)
- 이유: 내접원의 접선 길이 성질로 BF = 4, CE = 2를 구하여 BC = 6 cm를 산출한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH (원천과 같음) (원천과 같음)
- 이유: 변 AB = 10, AC = 8과 접선 길이 AF = 6으로부터 변 BC의 길이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 접선 길이 대칭성을 이용해 단순 덧셈과 뺄셈으로 BC = 6 cm을 구하므로 난이도 2이다.

**4칸**
- given: 내접←stem:「e ABC$의 내접원이고 세 점」
- goal: 길이←stem:「e{BC}$의 길이는? [4점]」
- method: 접선(NAMED)←solution:「원에 그은 두 접선의 길이는 서로」
- condition: (없음)

**how** 접선 길이 성질로 BF = 4, CE = 2를 구하고 BC = 4 + 2 = 6 cm를 도출하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 꼭짓점에서 내접원에 그은 두 접선의 길이는 서로 같다. 점 $A$에서 그은 두 접선이므로 $$ \begin{aligned} \overline{AE} = \overline{AF} = 6,\mathrm{cm} \end{aligned} $$ 따라서 $\overline{BF}$와 $\overline{CE}$의 길이는 각각 다음과 같다. $$ \begin{aligned} \overline{BF} &= \overline{AB} - \overline{AF} = 10 - 6 = 4,\mathrm{cm} \ \overline{CE} &= \overline{AC} - \overline{AE} = 8 - 6 = 2,\mathrm{cm} \end{aligned} $$ 점 $B$와 $C$에서 그은 접선의 길이도 각각 같으므로 $$ \begin{aligned} \overline{BD} = \overline{BF} = 4,\mathrm{cm}, \quad \overline{CD} = \overline{CE} = 2,\mathrm{cm} \end{aligned} $$ 따라서 선분 $\overline{BC}$의 길이는 $$ \begin{aligned} \overline{BC} &= \overline{BD} + \overline{CD} \ &= 4 + 2 = 6,\mathrm{cm} \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

다음 그림에서 사각형 $ABCD$는 원에 내접하고 직선 $TT'$은 점 $C$에서의 접선이다. $\wideparen{AB} = \wideparen{BC}$, $\angle BCA = 35^\circ$, $\angle ACD = 60^\circ$일 때, 접선과 현이 이루는 각 $\angle x$의 크기는? [4점]

**보기** ① $50^\circ$  ② $52^\circ$  ③ $54^\circ$  ④ $56^\circ$  ⑤ $58^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원주각 angle BCA = 35도이므로 호 AB = 70도이고, 호 BC = 70도이다.
2. 원주각 angle ACD = 60도이므로 호 AD = 120도이다.
3. 호 CD = 360도 - (70도 + 70도 + 120도) = 100도이므로 접현각 angle x = 100도/2 = 50도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 사각형 $ABCD$는 원에 내접하고 직선

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원주각의 크기는 그 원주각이 바라보는 호의 크기의 절반」
**RPM** M3-RPM-079 [원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각] (원천과 같음)
- 이유: 호 CD = 100도에 대하여 접선과 현이 이루는 각의 성질을 적용해 50도를 구한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_TANGENT_CHORD (원천과 같음) (원천과 같음)
- 이유: 원주각 35도와 60도로부터 호 CD를 구하고 접현각 x = 50도를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 호의 크기의 합이 360도임을 이용해 호 CD = 100도와 각 50도를 순차 계산하므로 난이도 2이다.

**4칸**
- given: 사각형←stem:「다음 그림에서 사각형 $ABCD$는」
- goal: 접선←stem:「$C$에서의 접선이다. $\wi」
- method: 원주각(NAMED)←solution:「원주각의 크기는 그」
- condition: (없음)

**how** 호 AB = 70도, BC = 70도, AD = 120도로 호 CD = 100도를 구해 접현각 x = 50도로 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원주각의 크기는 그 원주각이 바라보는 호의 크기의 절반이다. $\angle BCA = 35^\circ$이므로 호 $AB$의 크기는 $$ \begin{aligned} \wideparen{AB} = 2 \times 35^\circ = 70^\circ \end{aligned} $$ 조건에서 $\wideparen{AB} = \wideparen{BC}$이므로 호 $BC$의 크기도 $70^\circ$이다. 또한 $\angle ACD = 60^\circ$이므로 호 $AD$의 크기는 $$ \begin{aligned} \wideparen{AD} = 2 \times 60^\circ = 120^\circ \end{aligned} $$ 원 전체의 둘레는 $360^\circ$이므로 남은 호 $CD$의 크기는 $$ \begin{aligned} \wideparen{CD} &= 360^\circ - (\wideparen{AB} + \wideparen{BC} + \wideparen{AD}) \ &= 360^\circ - (70^\circ + 70^\circ + 120^\circ) \ &= 360^\circ - 260^\circ = 100^\circ \end{aligned} $$ 접선 $TT'$과 현 $CD$가 이루는 각의 크기는 그 현이 바라보는 호 $CD$의 원주각의 크기와 같으므로 $$ \begin{aligned} \angle x = \dfrac{100^\circ}{2} = 50^\circ \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3점


**발문**

다음 그림의 원 $O$에서 $\wideparen{AC} = \wideparen{BD}$이고 $\angle ABC = 35^\circ$일 때, 두 현 $\overline{AB}$와 $\overline{CD}$의 교점 $P$에 대하여 $\angle APC$의 크기는? [3점]

**보기** ① $65^\circ$  ② $70^\circ$  ③ $75^\circ$  ④ $80^\circ$  ⑤ $85^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원주각 angle ABC = 35도이므로 호 AC = 2*35도 = 70도이다.
2. 호 AC = 호 BD이므로 호 BD = 70도이다.
3. 두 현의 교점 P에서 angle APC = (호 AC + 호 BD)/2 = (70도 + 70도)/2 = 70도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 $\wideparen{AC}

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle ABC = 35^\circ$는 호 $AC」
**RPM** M3-RPM-080 [원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론] **원천→판정: 원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각 → 원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론**
- 이유: 두 현의 교각 APC가 마주 보는 두 호 70도의 합의 절반임을 활용한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 원주각 35도로부터 구한 두 호의 크기 70도로 두 현의 교각을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 호의 크기 70도와 교각 공식 (70+70)/2 = 70도를 바로 적용하므로 난이도 2이다.

**4칸**
- given: 교점←stem:「e{CD}$의 교점 $P$에 대하」
- goal: 원주각←solution:「$를 바라보는 원주각이므로 호 $A」
- method: 조건(NAMED)←solution:「ned} $$ 조건에서 $\wid」
- condition: (없음)

**how** 호 AC = 호 BD = 70도에서 교각 APC = (70 + 70)/2 = 70도를 산출하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ABC = 35^\circ$는 호 $AC$를 바라보는 원주각이므로 호 $AC$의 크기는 $$ \begin{aligned} \wideparen{AC} = 2 \times 35^\circ = 70^\circ \end{aligned} $$ 조건에서 $\wideparen{AC} = \wideparen{BD}$이므로 호 $BD$의 크기도 $70^\circ$이다. 두 현 $AB$와 $CD$가 원 내부의 점 $P$에서 만나므로 두 현이 이루는 각 $\angle APC$의 크기는 마주 보는 두 호의 크기의 합의 절반이다. $$ \begin{aligned} \angle APC &= \dfrac{\wideparen{AC} + \wideparen{BD}}{2} \ &= \dfrac{70^\circ + 70^\circ}{2} \ &= 70^\circ \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림의 원 $O$에서 $\wideparen{AB} = \wideparen{BC}$이고 중심각 $\angle AOC = 100^\circ$일 때, 호 $BC$에 대한 원주각 $\angle BQC$의 크기는? [4점]

**보기** ① $20^\circ$  ② $22.5^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 중심각 angle AOC = 100도이므로 호 AC = 100도이다.
2. 호 AB = 호 BC이므로 호 BC = 100도/2 = 50도이다.
3. 호 BC에 대한 원주각 angle BQC = 50도/2 = 25도이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 $\wideparen{AB}

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「중심각의 크기는 그 중심각이 바라보는 호의 크기와 같으」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 중심각 100도와 같은 호에 대한 원주각 BQC의 비례 관계를 활용한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 중심각 100도를 이등분한 호 BC로부터 원주각 BQC = 25도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 중심각과 원주각의 1/2 관계를 두 번 적용해 25도를 즉시 구하므로 난이도 2이다.

**4칸**
- given: 중심각←stem:「{BC}$이고 중심각 $\angle」
- goal: 원주각←stem:「BC$에 대한 원주각 $\angle」
- method: 중심(NAMED)←stem:「{BC}$이고 중심각 $\angl」
- condition: (없음)

**how** 중심각 100도에서 호 BC = 50도를 얻고 그 절반으로 원주각 BQC = 25도를 계산하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

중심각의 크기는 그 중심각이 바라보는 호의 크기와 같으므로 $$ \begin{aligned} \wideparen{AC} = \angle AOC = 100^\circ \end{aligned} $$ 조건에서 $\wideparen{AB} = \wideparen{BC}$이므로 두 호의 크기는 각각 다음과 같다. $$ \begin{aligned} \wideparen{AB} = \wideparen{BC} = \dfrac{100^\circ}{2} = 50^\circ \end{aligned} $$ $\angle BQC$는 호 $BC$를 바라보는 원주각이므로 그 크기는 같은 호에 대한 중심각의 절반이다. $$ \begin{aligned} \angle BQC = \dfrac{50^\circ}{2} = 25^\circ \end{aligned} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고 $\angle BAO = 70^\circ$, $\angle BCO = 30^\circ$일 때, $\angle ADC$의 크기는? [4점]

**보기** ① $125^\circ$  ② $130^\circ$  ③ $135^\circ$  ④ $140^\circ$  ⑤ $145^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름에 의해 삼각형 AOB와 BOC는 이등변삼각형이므로 angle ABO = 70도, angle CBO = 30도이다.
2. angle ABC = angle ABO - angle CBO = 70도 - 30도 = 40도이다.
3. 원 O에 내접하는 사각형 ABCD에서 대각의 합은 180도이므로 angle ADC = 180도 - 40도 = 140도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $OA, OB$는 모두 원 $O$의 반지름이므로 」
**RPM** M3-RPM-077 [원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각] (원천과 같음)
- 이유: 내접사각형 ABCD에서 대각의 합이 180도임을 활용하여 140도를 도출한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES (원천과 같음) **원천→판정: TPL_CIRCLE_ANGLE_COMPOSITE → TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES**
- 이유: 이등변삼각형 각 70도, 30도로부터 각 ABC = 40도를 구하고 내접사각형 대각 140도를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 성질과 내접사각형 대각 합 180도를 순차 적용해 140도를 구하므로 난이도 2이다.

**4칸**
- given: 사각형←stem:「다음 그림에서 사각형 $ABCD$는」
- goal: 내접←stem:「원 $O$에 내접하고 $\ang」
- method: 이등변삼각형(NAMED)←solution:「e AOB$는 이등변삼각형이므로 $$ \」
- condition: (없음)

**how** angle ABC = 70도 - 30도 = 40도에서 내접사각형 대각 합으로 angle ADC = 140도를 산출하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

선분 $OA, OB$는 모두 원 $O$의 반지름이므로 $\overline{OA} = \overline{OB}$이다. 따라서 $\triangle AOB$는 이등변삼각형이므로 $$ \begin{aligned} \angle ABO = \angle BAO = 70^\circ \end{aligned} $$ 또한 $\overline{OB} = \overline{OC}$이므로 $\triangle BOC$도 이등변삼각형이다. $$ \begin{aligned} \angle OBC = \angle BCO = 30^\circ \end{aligned} $$ 그림에서 $\angle ABC$는 $\angle ABO$와 $\angle OBC$의 차이이므로 $$ \begin{aligned} \angle ABC &= \angle ABO - \angle OBC \ &= 70^\circ - 30^\circ = 40^\circ \end{aligned} $$ 원에 내접하는 사각형의 마주 보는 두 대각의 크기의 합은 $180^\circ$이므로 $$ \begin{aligned} \angle ADC &= 180^\circ - \angle ABC \ &= 180^\circ - 40^\circ \ &= 140^\circ \end{aligned} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 그림과 같이 사각형 $ABCD$는 원 $O$에 내접하고, 두 변 $\overline{AB}, \overline{CD}$의 연장선의 교점을 $P$, 두 변 $\overline{AD}, \overline{BC}$의 연장선의 교점을 $Q$라 하자. $\angle P = 24^\circ$, $\angle Q = 36^\circ$일 때, $\angle x = \angle BCD$의 크기는? [4점]

**보기** ① $50^\circ$  ② $52^\circ$  ③ $55^\circ$  ④ $58^\circ$  ⑤ $60^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 할선각 조건에서 호 CD - 호 AB = 2*24도 = 48도이고, 호 BC - 호 AD = 2*36도 = 72도이다.
2. 원주 전체의 합이 360도이므로 2(호 AB + 호 AD) + 120도 = 360도에서 호 AB + 호 AD = 120도이다.
3. 원주각 angle x = angle BCD는 (호 AB + 호 AD)/2 = 120도/2 = 60도이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 사각형 $ABCD$는 원 $O$에 내

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 위의 네 호 $\wideparen{AB}, \wid」
**RPM** M3-RPM-080 [원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론] (원천과 같음)
- 이유: 할선각 24도와 36도로부터 호의 합 120도를 구하고 원주각 60도를 도출한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 두 할선이 이루는 각 24도, 36도로부터 내접사각형의 각 x = 60도를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 할선각 방정식을 원주 360도 조건과 연립하여 호의 합을 풀어야 하므로 난이도 3이다.

**4칸**
- given: 사각형←stem:「그림과 같이 사각형 $ABCD$는」
- goal: 원주각←solution:「)를 바라보는 원주각이므로 $$ \」
- method: 할선(NAMED)←solution:「$P$에서 두 할선이 이루는 각이」
- condition: (없음)

**how** 할선각 조건 c-a = 48도와 b-d = 72도를 원주 합 360도와 연립해 a+d = 120도에서 각 x = 60도로 계산하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 위의 네 호 $\wideparen{AB}, \wideparen{BC}, \wideparen{CD}, \wideparen{DA}$의 크기를 각각 $a, b, c, d$라 하자. 원 밖의 점 $P$에서 두 할선이 이루는 각이 $24^\circ$이므로 $$ \begin{aligned} \dfrac{c - a}{2} = 24^\circ \implies c - a = 48^\circ \implies c = a + 48^\circ \end{aligned} $$ 원 밖의 점 $Q$에서 두 할선이 이루는 각이 $36^\circ$이므로 $$ \begin{aligned} \dfrac{b - d}{2} = 36^\circ \implies b - d = 72^\circ \implies b = d + 72^\circ \end{aligned} $$ 원 전체의 네 호의 크기의 합은 $360^\circ$이므로 $$ \begin{aligned} a + b + c + d &= 360^\circ \ a + (d + 72^\circ) + (a + 48^\circ) + d &= 360^\circ \ 2(a + d) + 120^\circ &= 360^\circ \ 2(a + d) &= 240^\circ \ a + d &= 120^\circ \end{aligned} $$ $\angle x = \angle BCD$는 호 $BAD$($=a+d$)를 바라보는 원주각이므로 $$ \begin{aligned} \angle x &= \dfrac{a + d}{2} \ &= \dfrac{120^\circ}{2} \ &= 60^\circ \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 $\angle P = 40^\circ$이다. 점 $C$가 작은 호 $AB$ 위의 점일 때, $\angle PAC + \angle PBC$의 값은? [4점]

**보기** ① $70^\circ$  ② $72^\circ$  ③ $74^\circ$  ④ $76^\circ$  ⑤ $78^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접선각 40도에 대하여 작은 호 AB의 중심각은 180도 - 40도 = 140도이므로 호 AB = 140도이다.
2. 접현각 성질에 의해 angle PAC = (호 AC)/2, angle PBC = (호 BC)/2이다.
3. angle PAC + angle PBC = (호 AC + 호 BC)/2 = (호 AB)/2 = 140도/2 = 70도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 선분 $\overline{PA}, \

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 밖의 점 $P$에서 그은 두 접선 $PA, PB$가」
**RPM** M3-RPM-079 [원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각] (원천과 같음)
- 이유: 호 AB = 140도에 대해 두 접선과 현이 이루는 각의 합 70도를 유도한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_TANGENT_CHORD (원천과 같음) (원천과 같음)
- 이유: 접선각 40도로부터 호 AB = 140도를 얻고 접현각의 합 70도를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중심각 140도와 접현각 성질을 결합하여 합 70도를 단번에 도출하므로 난이도 2이다.

**4칸**
- given: 접선←stem:「원 $O$의 접선이고 $\ang」
- goal: 중심각←solution:「AB$에 대한 중심각은 $$ \be」
- method: 성질(NAMED)←solution:「이루는 각의 성질에 의하여 $$」
- condition: (없음)

**how** 접선 각 40도에서 호 AB = 140도를 얻고 접현각의 합이 호의 절반인 70도임을 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 점 $P$에서 그은 두 접선 $PA, PB$가 이루는 각이 $40^\circ$이므로 작은 호 $AB$에 대한 중심각은 $$ \begin{aligned} 180^\circ - 40^\circ = 140^\circ \end{aligned} $$ 따라서 작은 호 $AB$의 크기는 $140^\circ$이다. 접선과 현이 이루는 각의 성질에 의하여 $$ \begin{aligned} \angle PAC = \dfrac{1}{2}\wideparen{AC}, \quad \angle PBC = \dfrac{1}{2}\wideparen{BC} \end{aligned} $$ 점 $C$가 작은 호 $AB$ 위에 있으므로 두 호의 합은 호 $AB$의 크기와 같다. $$ \begin{aligned} \wideparen{AC} + \wideparen{BC} = \wideparen{AB} = 140^\circ \end{aligned} $$ 따라서 두 접현각의 합은 $$ \begin{aligned} \angle PAC + \angle PBC &= \dfrac{\wideparen{AC} + \wideparen{BC}}{2} \ &= \dfrac{140^\circ}{2} \ &= 70^\circ \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점


**발문**

다음은 학생 $8$명의 몸무게를 조사하여 나타낸 것이다. 이 자료의 중앙값은? (단위: $\mathrm{kg}$) $$48, \ 56, \ 52, \ 60, \ 64, \ 45, \ 54, \ 50$$ [3점]

**보기** ① $52,\mathrm{kg}$  ② $53,\mathrm{kg}$  ③ $54,\mathrm{kg}$  ④ $55,\mathrm{kg}$  ⑤ $56,\mathrm{kg}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 8개의 변량을 크기순으로 나열하면 45, 48, 50, 52, 54, 56, 60, 64 kg이다.
2. 짝수 개이므로 중앙값은 4번째 값 52와 5번째 값 54의 평균인 (52 + 54)/2 = 53 kg이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「주어진 $8$개의 변량을 작은 값부터 순서대로 나열하면」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] (원천과 같음)
- 이유: 8개의 변량에서 가운데 두 값 52와 54의 평균으로 중앙값 53을 계산한다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CALCULATE_MEDIAN_AND_MODE_OF_DISCRETE_DATA (원천과 같음)
- 이유: 주어진 8개의 변량으로부터 중앙값 53 kg을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정렬 후 4번째와 5번째 값 52, 54의 평균을 직접 구하므로 난이도 1이다.

**4칸**
- given: 자료←stem:「것이다. 이 자료의 중앙값은?」
- goal: 중앙값←stem:「. 이 자료의 중앙값은? (단위:」
- method: 평균(NAMED)←solution:「($54$)의 평균이다. $$ \」
- condition: (없음)

**how** 정렬된 자료에서 4번째 52와 5번째 54의 평균 (52+54)/2 = 53 kg을 도출하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 $8$개의 변량을 작은 값부터 순서대로 나열하면 다음과 같다. $$45, \ 48, \ 50, \ 52, \ 54, \ 56, \ 60, \ 64$$ 자료의 개수가 $8$개(짝수 개)이므로 중앙값은 한가운데 있는 $4$번째 값($52$)과 $5$번째 값($54$)의 평균이다. $$ \begin{aligned} \dfrac{52 + 54}{2} = \dfrac{106}{2} = 53,\mathrm{kg} \end{aligned} $$ 따라서 중앙값은 $53,\mathrm{kg}$이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

다음 자료는 학생 $11$명이 $1$년 동안 읽은 도서 권수이다. 이 자료의 평균, 중앙값, 최빈값을 각각 $a$권, $b$권, $c$권이라고 할 때, $a, b, c$의 대소 관계로 옳은 것은? (단위: 권) $$6, \ 4, \ 9, \ 8, \ 4, \ 5, \ 3, \ 11, \ 3, \ 4, \ 9$$ [4점]

**보기** ① $c > b > a$  ② $a > c > b$  ③ $a > b > c$  ④ $b > a > c$  ⑤ $b > c > a$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 11개 변량의 총합은 66이므로 평균 a = 66/11 = 6권이다.
2. 크기순 정렬: 3, 3, 4, 4, 4, 5, 6, 8, 9, 9, 11에서 6번째 중앙값 b = 5권이다.
3. 최빈값 c = 4권이므로 a = 6, b = 5, c = 4에서 대소 관계는 a > b > c이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「먼저 주어진 $11$개 변량의 총합을 구하면 $$ \b」
**RPM** M3-RPM-082 [통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교] (원천과 같음)
- 이유: 11개 변량의 총합 66과 평균 a = 6, 중앙값 b = 5, 최빈값 c = 4를 비교하여 a > b > c를 결정한다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_DIRECT (원천과 같음)
- 이유: 11개 변량의 평균 6, 중앙값 5, 최빈값 4의 대소 관계를 판정하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 11개 변량에 대해 총합 66과 대푯값 공식으로 a=6, b=5, c=4를 구하고 비교하므로 난이도 1이다.

**4칸**
- given: 자료←stem:「다음 자료는 학생 $11」
- goal: 대소비교←stem:「b, c$의 대소 관계로 옳은」
- method: 평균(NAMED)←stem:「. 이 자료의 평균, 중앙값, 최」
- condition: (없음)

**how** 11개 변량의 총합 66에서 평균 a = 6, 중앙값 b = 5, 최빈값 c = 4를 산출하여 a > b > c로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

먼저 주어진 $11$개 변량의 총합을 구하면 $$ \begin{aligned} 6+4+9+8+4+5+3+11+3+4+9 = 66 \end{aligned} $$ 따라서 평균 $a$의 값은 $$ \begin{aligned} a = \dfrac{66}{11} = 6 \end{aligned} $$ 자료를 작은 값부터 크기순으로 나열하면 다음과 같다. $$3, \ 3, \ 4, \ 4, \ 4, \ 5, \ 6, \ 8, \ 9, \ 9, \ 11$$ 변량의 개수가 $11$개이므로 중앙값 $b$는 한가운데인 $6$번째 값이다. $$ \begin{aligned} b = 5 \end{aligned} $$ 가장 많이 나타나는 변량은 $4$로 $3$회 나타나므로 최빈값 $c$는 다음과 같다. $$ \begin{aligned} c = 4 \end{aligned} $$ 따라서 $a = 6, b = 5, c = 4$이므로 대소 관계는 $$ \begin{aligned} a > b > c \end{aligned} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

어느 반 학생 $16$명의 국어 성적을 작은 값부터 순서대로 나타내었더니 다음과 같았다. $$52, \ 56, \ 56, \ 58, \ 60, \ 64, \ 64, \ 68, \ 72, \ 72, \ 72, \ 76, \ 80, \ 80, \ 84, \ 88 \ \text{(점)}$$ 이 자료의 중앙값을 $a$점, 최빈값을 $b$점이라 할 때, $b - a$의 값은? [4점]

**보기** ① $0$  ② $1$  ③ $1.5$  ④ $2$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 16개의 정렬된 자료에서 8번째 값 68과 9번째 값 72의 평균인 중앙값 a = (68+72)/2 = 70점이다.
2. 가장 많이 나타나는 값은 72(3회)이므로 최빈값 b = 72점이다.
3. 따라서 b - a = 72 - 70 = 2이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「자료의 개수가 $16$개이므로 중앙값 $a$는 $8$번」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] (원천과 같음)
- 이유: 중앙값 a = 70과 최빈값 b = 72로부터 차이 b - a = 2를 계산한다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CALCULATE_MEDIAN_AND_MODE_OF_DISCRETE_DATA (원천과 같음)
- 이유: 정렬된 성적 16개에서 중앙값 70과 최빈값 72를 구하여 차를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중앙값 70과 최빈값 72를 구하고 뺄셈 b - a = 2를 수행하므로 난이도 2이다.

**4칸**
- given: 자료←stem:「점)}$$ 이 자료의 중앙값을 $」
- goal: 중앙값←stem:「$ 이 자료의 중앙값을 $a$점,」
- method: 평균(NAMED)←solution:「($72$)의 평균이다. $$ \」
- condition: (없음)

**how** 중앙값 a = (68+72)/2 = 70과 최빈값 b = 72에서 b - a = 2를 계산하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

자료의 개수가 $16$개이므로 중앙값 $a$는 $8$번째 값($68$)과 $9$번째 값($72$)의 평균이다. $$ \begin{aligned} a = \dfrac{68 + 72}{2} = \dfrac{140}{2} = 70\text{점} \end{aligned} $$ 가장 많이 나타나는 값은 $72$로 $3$회 나타나므로 최빈값 $b$는 다음과 같다. $$ \begin{aligned} b = 72\text{점} \end{aligned} $$ 따라서 $b - a$의 값은 $$ \begin{aligned} b - a = 72 - 70 = 2 \end{aligned} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 세 자료 $A, B, C$에 대한 설명으로 옳지 않은 것은? [4점]

- 자료 $A: 1, 2, 2, 7, 7, 13, 17$  
- 자료 $B: 9, 14, 16, 16, 18, 23$  
- 자료 $C: 5, 5, 5, 9, 9, 9$

**보기** ① 자료 $A$의 평균과 중앙값은 같다.  ② 자료 $A$의 최빈값은 $2, 7$이다.  ③ 자료 $B$의 중앙값과 최빈값은 같다.  ④ 자료 $C$의 최빈값은 $5, 9$이다.  ⑤ 자료 $C$의 중앙값은 $8$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료 A는 총합 49에서 평균 7, 중앙값 7, 최빈값 2, 7이다 (①, ② 옳음).
2. 자료 B는 중앙값 16, 최빈값 16이다 (③ 옳음).
3. 자료 C는 최빈값 5, 9이고, 중앙값은 (5+9)/2 = 7이므로 8이라고 한 ⑤는 옳지 않다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「각 자료의 대푯값을 판별한다.  - 자료 $A$: 총합」
**RPM** M3-RPM-082 [통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교] (원천과 같음)
- 이유: 총합 49인 자료 A와 중앙값 16인 자료 B 및 자료 C의 통계량을 비교하여 참과 거짓을 판별한다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_DIRECT (원천과 같음)
- 이유: 총합 49인 자료 A와 중앙값 16인 자료 B를 통해 자료 C의 오류 진술 ⑤를 찾는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 총합 49에서 구한 자료 A의 평균과 자료 C의 중앙값 7을 순차 확인하므로 난이도 2이다.

**4칸**
- given: 자료←stem:「다음 세 자료 $A, B,」
- goal: 대푯값←solution:「각 자료의 대푯값을 판별한다.」
- method: 판정(NAMED)←solution:「료의 대푯값을 판별한다. - 자」
- condition: (없음)

**how** 총합 49인 자료 A와 달리 자료 C의 중앙값이 (5+9)/2 = 7인데 8로 진술된 ⑤의 오류를 확인하여 정답 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 자료의 대푯값을 판별한다.

- 자료 $A$: 총합은 $1+2+2+7+7+13+17 = 49$이므로 평균은 $\dfrac{49}{7} = 7$이고, 크기순 $4$번째 중앙값도 $7$이다. 또한 $2$와 $7$이 각각 $2$회씩 나타나므로 최빈값은 $2, 7$이다. (①, ② 옳음)  
- 자료 $B$: 변량의 개수가 $6$개이므로 중앙값은 가운데 두 값인 $16, 16$의 평균인 $16$이다. 가장 많이 나타나는 값도 $16$(2회)이므로 중앙값과 최빈값은 같다. (③ 옳음)  
- 자료 $C$: $5$와 $9$가 각각 $3$회씩 가장 많이 나타나므로 최빈값은 $5, 9$이다. (④ 옳음) 자료 $C$의 중앙값은 가운데 $3$번째 값($5$)과 $4$번째 값($9$)의 평균이므로 $$ \begin{aligned} \dfrac{5 + 9}{2} = \dfrac{14}{2} = 7 \end{aligned} $$ 따라서 중앙값이 $8$이라고 기술한 ⑤는 옳지 않다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (PT, 난이도)

**발문**

어느 모둠 학생 $8$명의 턱걸이 횟수를 조사하였더니 다음과 같았다. $$2, \ 3, \ 4, \ 0, \ 4, \ 1, \ 4, \ 6 \ \text{(회)}$$ 다음 보기 중 옳은 것은 모두 몇 개인가? [5점]

<보기> ㄱ. 평균은 $3$회이다. ㄴ. 중앙값은 $4$회이다. ㄷ. 최빈값은 $4$회이다. ㄹ. 표준편차는 $\dfrac{\sqrt{13}}{2}$회이다.

**보기** ① $3$개  ② $2$개  ③ $1$개  ④ $4$개  ⑤ $0$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 총합 24이므로 평균은 24/8 = 3회이다 (ㄱ 옳음).
2. 정렬 0, 1, 2, 3, 4, 4, 4, 6에서 중앙값은 (3+4)/2 = 3.5회, 최빈값은 4회이다 (ㄴ 틀림, ㄷ 옳음).
3. 편차 제곱합은 26이므로 분산 13/4, 표준편차 sqrt(13)/2이다 (ㄹ 옳음). 옳은 것은 ㄱ, ㄷ, ㄹ의 3개이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「주어진 자료의 각 통계량을 검증한다.  - 변량의 총합」
**RPM** M3-RPM-085 [통계 > 대푯값과 산포도 > 산포도 > 표준편차] (원천과 같음)
- 이유: 평균 3, 중앙값 3.5, 최빈값 4, 표준편차 sqrt(13)/2를 계산하여 보기를 검증한다.
**유형** PT=PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE / TPL=TPL_M3_COUNT_TRUE_STATEMENTS_ON_STATISTICS_CONCEPTS **원천→판정: PT_M3_DISPERSION_DEVIATION_PROPERTIES → PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE**
- 이유: 총합 24인 8명의 턱걸이 횟수로부터 대푯값과 산포도 진술의 참 개수 3개를 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 평균 3과 표준편차 sqrt(13)/2 등 4개 보기를 검증하여 3개를 찾으므로 난이도 2이다.

**4칸**
- given: 변량←solution:「증한다. - 변량의 총합은 $2」
- goal: 개수←stem:「$명의 턱걸이 횟수를 조사하였더니」
- method: 판정(NAMED)←solution:「각 통계량을 검증한다. - 변」
- condition: (없음)

**how** 평균 3, 중앙값 3.5, 최빈값 4, 표준편차 sqrt(13)/2로 옳은 보기 ㄱ, ㄷ, ㄹ 3개를 확인하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 자료의 각 통계량을 검증한다.

- 변량의 총합은 $2+3+4+0+4+1+4+6 = 24$이므로 평균은 $$ \begin{aligned} \dfrac{24}{8} = 3\text{회} \quad (\text{ㄱ 옳음}) \end{aligned} $$  
- 자료를 작은 값부터 크기순으로 나열하면 $0, 1, 2, 3, 4, 4, 4, 6$이다. 자료의 개수가 $8$개이므로 중앙값은 $4$번째 값($3$)과 $5$번째 값($4$)의 평균이다. $$ \begin{aligned} \dfrac{3 + 4}{2} = 3.5\text{회} \quad (\text{ㄴ 옳지 않음}) \end{aligned} $$  
- 가장 많이 나타나는 변량은 $4$회로 $3$번 나타나므로 최빈값은 $4$회이다. (ㄷ 옳음)  
- 평균 $3$에 대한 각 변량의 편차는 $-1, 0, 1, -3, 1, -2, 1, 3$이다. 편차의 제곱의 합은 $$ \begin{aligned} (-1)^2 + 0^2 + 1^2 + (-3)^2 + 1^2 + (-2)^2 + 1^2 + 3^2 &= 1 + 0 + 1 + 9 + 1 + 4 + 1 + 9 \ &= 26 \end{aligned} $$ 따라서 분산은 $\dfrac{26}{8} = \dfrac{13}{4}$이고, 표준편차는 $$ \begin{aligned} \sqrt{\dfrac{13}{4}} = \dfrac{\sqrt{13}}{2}\text{회} \quad (\text{ㄹ 옳음}) \end{aligned} $$ 따라서 보기 중 옳은 것은 ㄱ, ㄷ, ㄹ의 $3$개이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점


**발문**

$5$개의 수 $5, 9, x, y, 6$의 평균이 $6$이고 분산이 $3.8$일 때, $x^2 + y^2$의 값은? [5점]

**보기** ① $54$  ② $57$  ③ $60$  ④ $63$  ⑤ $66$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평균이 6이므로 총합은 30에서 5 + 9 + x + y + 6 = 30, 즉 x + y = 10이다.
2. 분산이 3.8이므로 편차 제곱의 합은 5 * 3.8 = 19이다.
3. (-1)^2 + 3^2 + (x-6)^2 + (y-6)^2 + 0 = 19에서 (x-6)^2 + (y-6)^2 = 9이고 x^2 + y^2 - 12(10) + 72 = 9에서 x^2 + y^2 = 57이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다섯 수의 평균이 $6$이므로 총합은 $5 \times」
**RPM** M3-RPM-084 [통계 > 대푯값과 산포도 > 산포도 > 분산] (원천과 같음)
- 이유: 평균 6과 분산 3.8의 편차제곱합 식을 연립하여 x^2 + y^2 = 57을 구한다.
**유형** PT=PT_M3_DISPERSION_DEVIATION_PROPERTIES / TPL=TPL_M3_DISPERSION_DEVIATION_PROPERTIES_PARAMETER (원천과 같음)
- 이유: 평균과 분산 조건으로부터 미지수 제곱의 합 x^2 + y^2 = 57을 도출하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: x + y = 10과 편차 제곱합 식을 전개하여 x^2 + y^2 = 57을 구하므로 난이도 2이다.

**4칸**
- given: 변량←solution:「8$이므로 각 변량의 편차의 제곱」
- goal: 분산←stem:「이 $6$이고 분산이 $3.8$일」
- method: 전개(NAMED)←solution:「$$ 좌변을 전개하여 정리하면」
- condition: (없음)

**how** x + y = 10과 편차 제곱합 (x-6)^2 + (y-6)^2 = 9를 전개해 x^2 + y^2 = 57을 도출하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

다섯 수의 평균이 $6$이므로 총합은 $5 \times 6 = 30$이다. $$ \begin{aligned} 5 + 9 + x + y + 6 &= 30 \ x + y + 20 &= 30 \ x + y &= 10 \end{aligned} $$ 분산이 $3.8$이므로 각 변량의 편차의 제곱의 평균은 $3.8$이다. 따라서 편차의 제곱의 합은 $$ \begin{aligned} 5 \times 3.8 = 19 \end{aligned} $$ 평균 $6$에 대한 각 변량의 편차의 제곱의 합을 세우면 $$ \begin{aligned} (5-6)^2 + (9-6)^2 + (x-6)^2 + (y-6)^2 + (6-6)^2 &= 19 \ (-1)^2 + 3^2 + (x-6)^2 + (y-6)^2 + 0 &= 19 \ 1 + 9 + (x-6)^2 + (y-6)^2 &= 19 \ (x-6)^2 + (y-6)^2 &= 9 \end{aligned} $$ 좌변을 전개하여 정리하면 $$ \begin{aligned} x^2 - 12x + 36 + y^2 - 12y + 36 &= 9 \ x^2 + y^2 - 12(x+y) + 72 &= 9 \end{aligned} $$ $x+y = 10$을 대입하면 $$ \begin{aligned} x^2 + y^2 - 12(10) + 72 &= 9 \ x^2 + y^2 - 120 + 72 &= 9 \ x^2 + y^2 - 48 &= 9 \ x^2 + y^2 &= 57 \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

$4$개의 변량 $a, b, c, d$의 평균을 $m$, 분산을 $v$라고 할 때, $4$개의 새로운 변량 $a+5, b+5, c+5, d+5$의 평균과 분산을 바르게 짝지은 것은? [4점]

**보기** ① $m, \ v$  ② $m+5, \ v+5$  ③ $m+5, \ v$  ④ $m, \ v+5$  ⑤ $m+5, \ 5v$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. aligned 식과 같이 변량에 5를 더하면 새로운 평균은 m + 5이다.
2. 각 변량의 편차는 (a+5) - (m+5) = a - m으로 변함이 없으므로 분산은 그대로 v이다.
3. 따라서 새로운 평균과 분산은 m+5, v이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「각 변량에 같은 수 $5$를 더하면 자료 전체가 오른쪽」
**RPM** M3-RPM-087 [통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론] **원천→판정: 통계 > 대푯값과 산포도 > 자료 비교 > 평균과 산포도 비교 → 통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론**
- 이유: aligned 식에서 변량 a, b, c, d에 5를 더해도 편차는 불변이므로 분산 v를 확인한다.
**유형** PT=PT_M3_LINEAR_TRANSFORMATION_STATISTICS / TPL=TPL_M3_LINEAR_TRANSFORMATION_STATISTICS_TRANSLATION (원천과 같음)
- 이유: aligned 식에서 변량의 평행이동에 따른 평균 m+5와 분산 v를 파악하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: aligned 전개에 의해 평균은 5 증가하고 분산은 변하지 않으므로 난이도 1이다.

**4칸**
- given: 변량←stem:「$4$개의 변량 $a, b,」
- goal: 분산←stem:「균을 $m$, 분산을 $v$라고」
- method: 평행이동(NAMED)←solution:「로 $5$만큼 평행이동하므로 새로운」
- condition: (없음)

**how** aligned 식에서 변량에 5를 더하면 평균은 m+5가 되고 분산은 v임을 확인하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 변량에 같은 수 $5$를 더하면 자료 전체가 오른쪽으로 $5$만큼 평행이동하므로 새로운 평균은 기존 평균보다 $5$만큼 커진다. $$ \begin{aligned} \text{새로운 평균} = m + 5 \end{aligned} $$ 새로운 평균에 대한 각 변량의 편차를 계산하면 다음과 같다. $$ \begin{aligned} (a+5) - (m+5) &= a - m \ (b+5) - (m+5) &= b - m \ (c+5) - (m+5) &= c - m \ (d+5) - (m+5) &= d - m \end{aligned} $$ 모든 편차가 기존 편차와 완전히 일치하므로 편차의 제곱의 평균인 분산도 변하지 않는다. $$ \begin{aligned} \text{새로운 분산} = v \end{aligned} $$ 따라서 새로운 평균과 분산은 $m+5, v$이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

어느 반 학생 $20$명의 중간고사 점수와 기말고사 점수를 조사한 산점도에 대한 다음 설명 중 옳은 것은? [4점] (단, 중간고사 점수의 최빈값은 $70$점(4명)이고, 기말고사 점수가 $90$점 이상인 학생 $6$명의 중간고사 점수의 평균은 $88$점이며, 두 점수가 모두 $70$점 미만인 학생은 $3$명이다.)

**보기** ① 중간고사 점수의 최빈값은 $85$점이다.  ② 중간고사 점수와 기말고사 점수 사이에는 음의 상관관계가 있다.  ③ 중간고사 점수가 $80$점 이상인 학생은 $10$명이다.  ④ 두 점수가 모두 $70$점 미만인 학생의 비율은 전체의 $15%$이다.  ⑤ 기말고사 점수가 $90$점 이상인 학생들의 중간고사 점수의 평균은 $95$점이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 점수가 모두 70점 미만인 학생 수는 3명이다.
2. 전체 학생 수가 20명이므로 비율은 (3 / 20) * 100 = 15%이다.
3. 따라서 ④의 설명이 옳다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 어느 반 학생 $20$명의 중간고사 점수와 기말고사 점

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「각 보기를 조건에 따라 검증한다. ① 문제의 조건에서 」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] (원천과 같음)
- 이유: 20명의 학생 중 70점 미만 3명의 비율 15%를 산점도 조건에서 계산한다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO
- 이유: 산점도 자료 조건으로부터 특정 구간 학생 비율 15%를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전체 20명 중 3명의 백분율을 (3/20)*100 = 15%로 바로 계산하므로 난이도 2이다.

**4칸**
- given: 산점도←stem:「점수를 조사한 산점도에 대한 다음」
- goal: 비율←solution:「0$명에 대한 비율은 다음과 같다」
- method: 판정(NAMED)←solution:「조건에 따라 검증한다. ① 문제」
- condition: (없음)

**how** 두 점수 모두 70점 미만인 학생 3명의 비율을 (3/20)*100 = 15%로 계산하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 조건에 따라 검증한다. ① 문제의 조건에서 중간고사 점수의 최빈값은 $70$점($4$명)이므로 옳지 않다. ② 중간고사 점수가 높을수록 대체로 기말고사 점수도 높아지므로 두 변량 사이에는 양의 상관관계가 있다. 음의 상관관계라고 한 설명은 옳지 않다. ③ 중간고사 점수가 $80$점 이상인 학생 수는 조건과 부합하지 않는다. (옳지 않음) ④ 두 점수가 모두 $70$점 미만인 학생 수는 $3$명이므로 전체 $20$명에 대한 비율은 다음과 같다. $$ \begin{aligned} \dfrac{3}{20} \times 100 = 15% \end{aligned} $$ 따라서 ④의 설명은 옳다. ⑤ 문제의 조건에서 기말고사 점수가 $90$점 이상인 학생들의 중간고사 점수의 평균은 $88$점이므로 $95$점이라는 설명은 옳지 않다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

어느 학교 학생들의 영어 성적($x$축)과 국어 성적($y$축)에 대한 산점도에서 학생 $A, B, C, D$의 위치가 다음과 같다.

- 점 $A$는 오른쪽 위 끝에 위치한다.  
- 점 $B$는 직선 $y=x$의 아래쪽(오른쪽 아래)에 위치한다.  
- 점 $C$는 왼쪽 아래 끝에 위치한다.  
- 점 $D$는 직선 $y=x$의 위쪽(왼쪽 위)에 위치한다. 다음 설명 중 옳지 않은 것은? [4점]

**보기** ① B는 C보다 영어 성적이 우수하다.  ② D는 B보다 국어 성적이 우수하다.  ③ A는 영어 성적과 국어 성적이 모두 우수한 편이다.  ④ 영어 성적과 국어 성적 사이에는 대체로 양의 상관관계가 있다.  ⑤ D는 국어 성적보다 영어 성적이 더 우수하다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 산점도에서 x축은 영어 성적, y축은 국어 성적이다.
2. 점 D는 직선 y=x의 위쪽에 위치하므로 y > x, 즉 국어 성적이 영어 성적보다 더 우수하다.
3. 따라서 영어 성적이 더 우수하다고 한 ⑤는 옳지 않다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 어느 학교 학생들의 영어 성적($x$축)과 국어 성적(

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「산점도에서 가로축($x$축)은 영어 성적, 세로축($y」
**RPM** M3-RPM-090 [통계 > 상관관계 > 상관관계 > 양의 상관관계] (원천과 같음)
- 이유: 직선 y=x의 영역과 산점도 점의 위치를 해석하여 국어와 영어 성적을 비교한다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_CORRELATION_TYPE_JUDGMENT
- 이유: 산점도에서 y=x 기준 점 D의 위치(y > x)를 파악해 오류 진술 ⑤를 찾는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 직선 y=x 위쪽 점 D의 의미(국어 > 영어)를 직관적으로 판별하므로 난이도 2이다.

**4칸**
- given: 산점도←stem:「$축)에 대한 산점도에서 학생 $A」
- goal: 위치←stem:「C, D$의 위치가 다음과 같다」
- method: 직선(NAMED)←stem:「점 $B$는 직선 $y=x$의」
- condition: (없음)

**how** 점 D가 직선 y=x 위쪽에 위치하여 y > x이므로 국어가 더 우수함을 확인해 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

산점도에서 가로축($x$축)은 영어 성적, 세로축($y$축)은 국어 성적을 나타낸다. ① 점 $B$는 점 $C$보다 오른쪽에 위치하므로 영어 성적이 더 우수하다. (옳음) ② 점 $D$는 점 $B$보다 위쪽에 위치하므로 국어 성적이 더 우수하다. (옳음) ③ 점 $A$는 산점도의 오른쪽 위 끝에 위치하므로 영어와 국어 성적이 모두 우수하다. (옳음) ④ 점들이 전체적으로 오른쪽 위로 향하는 띠 모양으로 분포하므로 양의 상관관계가 있다. (옳음) ⑤ 점 $D$는 직선 $y=x$의 위쪽(왼쪽 위)에 위치하므로 세로 좌표(국어 성적)가 가로 좌표(영어 성적)보다 크다 ($y > x$). 따라서 국어 성적이 영어 성적보다 더 우수하므로 ‘영어 성적이 더 우수하다’고 한 ⑤의 설명은 옳지 않다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

[서·논술형 1] 다음 그림의 원 $O$에서 선분 $\overline{CM}$은 현 $\overline{AB}$와 수직이고 $\overline{AM} = \overline{BM} = 12,\mathrm{cm}$, $\overline{CA} = 6\sqrt{5},\mathrm{cm}$이다. 점 $M$은 선분 $\overline{AB}$의 중점이고 세 점 $C, M, O$는 한 직선 위에 있을 때, 원 $O$의 넓이를 구하고 그 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $225\pi,\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 AMC에서 피타고라스 정리로 CM = sqrt((6*sqrt(5))^2 - 12^2) = sqrt(36) = 6 cm이다.
2. 원의 반지름을 R = x + 6이라 하면 직각삼각형 OMA에서 (x + 6)^2 = x^2 + 12^2이므로 12x = 108, 즉 x = 9 cm이다.
3. 반지름 R = 9 + 6 = 15 cm이므로 원 O의 넓이는 pi * 15^2 = 225*pi cm^2이다.
- 작성자 답: $225\pi,\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서·논술형 1] 다음 그림의 원 $O$에서 선분 $\

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{CM} \perp \overline」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] **원천→판정: 원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심 → 원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선**
- 이유: 현의 수직이등분선 성질과 피타고라스 정리로 반지름 15와 넓이 225pi를 산출한다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_LENGTH (원천과 같음) (원천과 같음)
- 이유: 현의 반 AM = 12와 CA = 6*sqrt(5)로부터 반지름 15와 넓이 225pi를 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 두 직각삼각형 AMC, OMA에서 피타고라스 정리를 연립해 R = 15를 구하므로 난이도 3이다.

**4칸**
- given: 선분←stem:「원 $O$에서 선분 $\overl」
- goal: 넓이←stem:「원 $O$의 넓이를 구하고 그」
- method: 정리(NAMED)←solution:「. 피타고라스 정리에 의하여 선분」
- condition: (없음)

**how** 직각삼각형 AMC에서 CM = 6을 구하고 직각삼각형 OMA에서 R = 15를 얻어 넓이 225pi로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{CM} \perp \overline{AB}$이므로 $\triangle AMC$는 $\angle AMC = 90^\circ$인 직각삼각형이다. 피타고라스 정리에 의하여 선분 $\overline{CM}$의 길이를 구하면 $$ \begin{aligned} \overline{CM}^2 &= \overline{CA}^2 - \overline{AM}^2 \ &= (6\sqrt{5})^2 - 12^2 \ &= 180 - 144 = 36 \ \overline{CM} &= 6,\mathrm{cm} \end{aligned} $$ 점 $M$이 현 $\overline{AB}$의 중점이고 $\overline{CM} \perp \overline{AB}$이므로 원의 중심 $O$는 직선 $CM$ 위에 있다. 선분 $\overline{OM} = x,\mathrm{cm}$라 두면 원의 반지름의 길이는 다음과 같다. $$ \begin{aligned} R = \overline{OC} = x + 6,\mathrm{cm} \end{aligned} $$ 직각삼각형 $OMA$에서 $\overline{OA} = R = x + 6$이므로 피타고라스 정리에 의하여 $$ \begin{aligned} \overline{OA}^2 &= \overline{OM}^2 + \overline{AM}^2 \ (x + 6)^2 &= x^2 + 12^2 \ x^2 + 12x + 36 &= x^2 + 144 \ 12x &= 108 \ x &= 9,\mathrm{cm} \end{aligned} $$ 따라서 원 $O$의 반지름의 길이는 다음과 같다. $$ \begin{aligned} R = \overline{OC} = 9 + 6 = 15,\mathrm{cm} \end{aligned} $$ 그러므로 원 $O$의 넓이는 $$ \begin{aligned} \pi R^2 &= \pi \times 15^2 \ &= 225\pi,\mathrm{cm}^2 \end{aligned} $$ 따라서 구하는 원의 넓이는 $225\pi,\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점


**발문**

[서·논술형 2] 다음 그림과 같이 반지름의 길이가 $12,\mathrm{cm}$인 원 $O$에서 점 $P$는 두 현 $\overline{AB}$와 $\overline{CD}$의 연장선의 교점이다. $\wideparen{AB} = 8\pi,\mathrm{cm}$, $\wideparen{CD} = 4\pi,\mathrm{cm}$, $\angle APC = 30^\circ$일 때, 호 $\wideparen{AC}$의 길이를 구하고 그 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8\pi,\mathrm{cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 12 cm인 원의 둘레는 24*pi cm이다. 호 AB = 8*pi의 중심각은 120도, 호 CD = 4*pi의 중심각은 60도이다.
2. 호 AC의 중심각을 x, 호 BD의 중심각을 y라 하면 x + y = 180도이고, 할선각 공식에서 (x - y)/2 = 30도, 즉 x - y = 60도이다.
3. 연립하면 2x = 240도에서 x = 120도이므로 호 AC의 길이는 24*pi * (120/360) = 8*pi cm이다.
- 작성자 답: $8\pi,\mathrm{cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서·논술형 2] 다음 그림과 같이 반지름의 길이가 $

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $12,\mathrm{cm}$이므로 원」
**RPM** M3-RPM-080 [원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론] (원천과 같음)
- 이유: 할선각 30도와 원의 둘레 24pi로부터 호 AC의 중심각 120도와 길이 8pi를 구한다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 두 할선의 교각 30도와 두 호의 길이 8pi, 4pi를 연립해 호 AC의 길이를 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중심각의 합 180도와 차 60도를 연립하여 중심각 120도와 호의 길이 8pi를 구하므로 난이도 3이다.

**4칸**
- given: 반지름←stem:「그림과 같이 반지름의 길이가 $1」
- goal: 길이←stem:「같이 반지름의 길이가 $12,\m」
- method: 할선(NAMED)←solution:「$P$에서 두 할선이 이루는 각의」
- condition: (없음)

**how** 둘레 24pi에서 중심각 합 180도와 할선각 차 60도를 연립해 x = 120도로 호 AC = 8pi를 산출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

반지름의 길이가 $12,\mathrm{cm}$이므로 원 $O$의 전체 둘레의 길이는 다음과 같다. $$ \begin{aligned} 2\pi \times 12 = 24\pi,\mathrm{cm} \end{aligned} $$ 호 $\wideparen{AB}$의 길이가 $8\pi,\mathrm{cm}$이므로 그에 대한 중심각의 크기는 $$ \begin{aligned} 360^\circ \times \dfrac{8\pi}{24\pi} = 360^\circ \times \dfrac{1}{3} = 120^\circ \end{aligned} $$ 호 $\wideparen{CD}$의 길이가 $4\pi,\mathrm{cm}$이므로 그에 대한 중심각의 크기는 $$ \begin{aligned} 360^\circ \times \dfrac{4\pi}{24\pi} = 360^\circ \times \dfrac{1}{6} = 60^\circ \end{aligned} $$ 호 $\wideparen{AC}$의 중심각을 $x^\circ$, 호 $\wideparen{BD}$의 중심각을 $y^\circ$라 하자. 네 호의 중심각의 합은 $360^\circ$이므로 $$ \begin{aligned} x + y + 120^\circ + 60^\circ &= 360^\circ \ x + y &= 180^\circ \quad \cdots \text{ (1)} \end{aligned} $$ 원 밖의 점 $P$에서 두 할선이 이루는 각의 크기는 두 호의 중심각의 차의 절반이므로 $$ \begin{aligned} \dfrac{x - y}{2} &= 30^\circ \ x - y &= 60^\circ \quad \cdots \text{ (2)} \end{aligned} $$ 식 (1)과 식 (2)를 더하면 $$ \begin{aligned} 2x &= 240^\circ \ x &= 120^\circ \end{aligned} $$ 따라서 호 $\wideparen{AC}$의 중심각의 크기는 $120^\circ$이다. 그러므로 호 $\wideparen{AC}$의 길이는 다음과 같다. $$ \begin{aligned} 24\pi \times \dfrac{120^\circ}{360^\circ} &= 24\pi \times \dfrac{1}{3} \ &= 8\pi,\mathrm{cm} \end{aligned} $$ 따라서 구하는 호 $\wideparen{AC}$의 길이는 $8\pi,\mathrm{cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

[서·논술형 3] $4$개의 수 $2a+3, 2b+3, 2c+3, 2d+3$의 평균이 $13$이고, 분산이 $16$일 때, $a^2 + b^2 + c^2 + d^2$의 값을 구하고 그 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $116$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 4개의 수 2a+3, 2b+3, 2c+3, 2d+3의 평균이 13이므로 원래 평균 m = (13 - 3)/2 = 5이고 합 a+b+c+d = 20이다.
2. 새로운 분산 16은 원래 분산 V의 2^2 = 4배이므로 V = 4이다.
3. 편차 제곱합 sum((a-5)^2) = 4 * 4 = 16이고, 전개하면 sum(a^2) - 10(20) + 100 = 16에서 a^2 + b^2 + c^2 + d^2 = 116이다.
- 작성자 답: $116$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a, b, c, d$의 평균을 $m$이라 하자. 각 」
**RPM** M3-RPM-087 [통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 분산 → 통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론**
- 이유: 선형변환된 평균 13과 분산 16으로부터 원래 평균 5와 분산 4를 구하고 제곱합 116을 산출한다.
**유형** PT=PT_M3_LINEAR_TRANSFORMATION_STATISTICS / TPL=TPL_M3_LINEAR_TRANSFORMATION_STATISTICS_AFFINE (원천과 같음)
- 이유: 선형변환된 변량의 평균 13과 분산 16을 이용해 원래 변량의 제곱의 합 116을 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 선형변환 성질로 평균 5, 분산 4를 구하고 편차제곱합 전개식을 풀어 116을 얻으므로 난이도 3이다.

**4칸**
- given: 변량←solution:「라 하자. 각 변량을 $2$배한」
- goal: 분산←stem:「$13$이고, 분산이 $16$일」
- method: 전개(NAMED)←solution:「좌변의 식을 전개하면 $$ \b」
- condition: (없음)

**how** 평균 13에서 m = 5, 분산 16에서 V = 4를 얻고 편차 제곱합 전개로 a^2+b^2+c^2+d^2 = 116을 산출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a, b, c, d$의 평균을 $m$이라 하자. 각 변량을 $2$배한 후 $3$을 더한 네 수의 평균이 $13$이므로 $$ \begin{aligned} 2m + 3 &= 13 \ 2m &= 10 \ m &= 5 \end{aligned} $$ 따라서 네 수의 총합은 다음과 같다. $$ \begin{aligned} a + b + c + d = 4 \times 5 = 20 \end{aligned} $$ 각 변량을 $2$배하고 $3$을 더했을 때의 분산은 원래 분산의 $2^2 = 4$배이고, 상수를 더하는 것은 분산에 영향을 주지 않는다. 따라서 $a, b, c, d$의 분산을 $V$라 하면 $$ \begin{aligned} 4V &= 16 \ V &= 4 \end{aligned} $$ 분산의 정의에 의하여 각 변량의 편차의 제곱의 평균은 $4$이다. $$ \begin{aligned} \dfrac{(a-5)^2 + (b-5)^2 + (c-5)^2 + (d-5)^2}{4} &= 4 \ (a-5)^2 + (b-5)^2 + (c-5)^2 + (d-5)^2 &= 16 \end{aligned} $$ 좌변의 식을 전개하면 $$ \begin{aligned} &(a^2 - 10a + 25) + (b^2 - 10b + 25) + (c^2 - 10c + 25) + (d^2 - 10d + 25) \ &= a^2 + b^2 + c^2 + d^2 - 10(a + b + c + d) + 100 = 16 \end{aligned} $$ 여기에 $a + b + c + d = 20$을 대입하면 $$ \begin{aligned} a^2 + b^2 + c^2 + d^2 - 10(20) + 100 &= 16 \ a^2 + b^2 + c^2 + d^2 - 200 + 100 &= 16 \ a^2 + b^2 + c^2 + d^2 - 100 &= 16 \ a^2 + b^2 + c^2 + d^2 &= 116 \end{aligned} $$ 따라서 구하는 값은 $116$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
