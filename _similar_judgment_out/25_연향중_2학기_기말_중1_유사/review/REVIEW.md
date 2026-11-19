# 검수 묶음 — 25_연향중_2학기_기말_중1_유사

- 단계: **CONVERTED (판정 검사 미통과: )**
- 문항 23개 / 검사 PASS 23, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 20, SELF_CONTAINED 3
- 난이도 분포: 2단계 13, 3단계 9, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q3**: 원천 값과 다른 칸 5개 (단원, 소단원, RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q6**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q9**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q15**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q16**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q17**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q18**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q22**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q23**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음을 모두 만족시키는 다각형에 대한 설명으로 옳은 것은? [4점]

(가) 모든 변의 길이가 같다.  
(나) 모든 내각의 크기가 같다.  
(다) 10개의 선분으로 둘러싸여 있다.

**보기** ① 내각의 크기의 합은 $1440^\circ$이다.  ② 대각선의 총개수는 $40$개이다.  ③ 한 외각의 크기는 $45^\circ$이다.  ④ 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $8$개이다.  ⑤ 내부의 한 점에서 각 꼭짓점에 선분을 그었을 때 생기는 삼각형의 개수는 $8$개이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 조건 (가), (나), (다)를 만족하는 다각형은 변이 10개인 정십각형이다 (내각의 합 1440).
2. 내각의 크기의 합은 $(10 - 2) \times 180^\circ = 1440^\circ$ 이므로 ①은 옳다.
3. 대각선 총수는 $10 \times 7 / 2 = 35$개, 한 외각은 $360^\circ / 10 = 36^\circ$ 이다.
4. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 다음을 모두 만족시키는 다각형에 대한 설명으로 옳은 것은?

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 만족시키는 다각형에 대한 설명으」
**RPM** M1-RPM-199 [평면도형 > 다각형 > 정다각형 > 정다각형의 성질] **원천→판정: 평면도형 > 다각형 > 정다각형의 성질 > 정다각형의 내각과 외각 → 평면도형 > 다각형 > 정다각형 > 정다각형의 성질**
- 이유: 정십각형의 내각의 합과 대각선 공식 등을 검증하는 M1-RPM-199 정다각형 > 정다각형의 성질에 해당한다 (내각 합 1440, 변 10).
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT **원천→판정: PT_REGULAR_POLYGON_PROPERTIES → PT_M1_POLYGON_ANGLE_AND_COUNT** **원천→판정: TPL_REGULAR_POLYGON_ANGLE_DIAGONAL → TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT**
- 이유: 조건을 통해 정십각형임을 판별하고 내각의 합, 대각선 개수 등 진술을 검토하는 유형이다 (내각 합 1440, 변 10).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정다각형의 기본 공식들을 적용하여 보기의 진술들을 순차적으로 검증하는 난이도 2 문항이다 (내각 합 1440, 변 10).

**4칸**
- given: 다각형←stem:「두 만족시키는 다각형에 대한 설명으」
- goal: 내각←stem:「(나) 모든 내각의 크기가 같다」
- method: 대각선(NAMED)←solution:「: 정십각형의 대각선의 총개수는」
- condition: 선분←stem:「다) 10개의 선분으로 둘러싸여」

**how** 조건을 만족하는 정십각형에 대해 내각의 합이 $(10-2) \times 180^\circ = 1440^\circ$ 임을 확인하여 정답 ①로 판정했다 (변 10).

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (가), (나), (다)를 모두 만족시키는 다각형은 변이 $10$개인 정십각형이다.

1단계: 정십각형의 내각의 크기의 합은  
$$\begin{aligned}  
(10 - 2) \times 180^\circ &= 8 \times 180^\circ \\  
&= 1440^\circ  
\end{aligned}$$  
이므로 ①은 옳다.

2단계: 정십각형의 대각선의 총개수는  
$$\begin{aligned}  
\dfrac{10(10 - 3)}{2} &= \dfrac{10 \times 7}{2} \\  
&= 35\text{개}  
\end{aligned}$$  
이므로 ②는 옳지 않다.

3단계: 다각형의 외각의 크기의 합은 항상 $360^\circ$이므로 정십각형의 한 외각의 크기는  
$$\begin{aligned}  
\dfrac{360^\circ}{10} &= 36^\circ  
\end{aligned}$$  
이므로 ③은 옳지 않다.

4단계: 정십각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는  
$$\begin{aligned}  
10 - 3 &= 7\text{개}  
\end{aligned}$$  
이므로 ④는 옳지 않다.

5단계: 정십각형의 내부의 한 점에서 각 꼭짓점에 선분을 그으면 꼭짓점의 개수와 같은 $10$개의 삼각형이 생기므로 ⑤는 옳지 않다.

따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

두 직선 $AB$와 $CD$가 점 $O$에서 만난다. $\angle AOC = (3x + 10)^\circ$, $\angle BOD = (2x + 40)^\circ$일 때, $\angle BOC$의 크기는? [3점]

**보기** ① $75^\circ$  ② $80^\circ$  ③ $85^\circ$  ④ $90^\circ$  ⑤ $95^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 직선 AB와 CD의 교점 O에서 맞꼭지각의 크기는 같다 (각 AOC, BOD).
2. $3x + 10 = 2x + 40 \implies x = 30$ 이다.
3. $\angle AOC = 3(30^\circ) + 10^\circ = 100^\circ$.
4. 평각 $180^\circ$ 에서 $\angle BOC = 180^\circ - 100^\circ = 80^\circ$ 이다.
5. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 두 직선 $AB$와 $CD$가 점 $O$에서 만난다. $\angle AOC = (3x + 10)^\circ$

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직선 $AB$와 $」
**RPM** M1-RPM-176 [기본 도형 > 기본 도형 > 각 > 맞꼭지각] **원천→판정: 기하 > 기본 도형 > 점, 선, 면, 각 > 맞꼭지각 → 기본 도형 > 기본 도형 > 각 > 맞꼭지각**
- 이유: 맞꼭지각의 크기가 같음을 이용해 일차방정식을 세우는 M1-RPM-176 각 > 맞꼭지각에 해당한다 (직선 AB, CD, 각 AOC, BOD).
**유형** PT=PT_M1_INTERSECTING_ANGLE_RELATIONS / TPL=TPL_M1_INTERSECTING_ANGLE_RELATIONS_EQUATION **원천→판정: PT_VERTICAL_ANGLES_LINEAR_EQUATION → PT_M1_INTERSECTING_ANGLE_RELATIONS** **원천→판정: TPL_VERTICAL_AND_SUPPLEMENTARY_ANGLES → TPL_M1_INTERSECTING_ANGLE_RELATIONS_EQUATION**
- 이유: 맞꼭지각의 성질로 각 방정식을 세워 $x$ 를 구하고 보각을 구하는 유형이다 (직선 AB, CD, 각 AOC, BOD).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 맞꼭지각 일치 조건과 평각 $180^\circ$ 관계를 이용하는 기본 난이도 2 문항이다 (직선 AB, CD, 각 AOC, BOD).

**4칸**
- given: 직선←stem:「두 직선 $AB$와 $」
- goal: 평각←solution:「OC$의 합은 평각인 $180^\」
- method: 맞꼭지각(NAMED)←solution:「에서 만날 때 맞꼭지각의 크기는 서로」
- condition: 대입←solution:「= 30$을 대입하여 $\ang」

**how** 맞꼭지각 $3x+10 = 2x+40$ 에서 $x=30$ 을 구하고 $\angle BOC = 180^\circ - 100^\circ = 80^\circ$ 로 판정했다 (직선 AB, CD).

<details><summary>저장 해설 (판정 검토용)</summary>

두 직선이 한 점에서 만날 때 맞꼭지각의 크기는 서로 같다.

1단계: $\angle AOC$와 $\angle BOD$는 맞꼭지각이므로  
$$\begin{aligned}  
3x + 10 &= 2x + 40 \\  
3x - 2x &= 40 - 10 \\  
x &= 30  
\end{aligned}$$

2단계: 구한 $x = 30$을 대입하여 $\angle AOC$의 크기를 구하면  
$$\begin{aligned}  
\angle AOC &= 3 \times 30^\circ + 10^\circ \\  
&= 90^\circ + 10^\circ \\  
&= 100^\circ  
\end{aligned}$$

3단계: 점 $O$를 지나는 직선 $AB$ 위에서 $\angle AOC$와 $\angle BOC$의 합은 평각인 $180^\circ$이므로  
$$\begin{aligned}  
\angle BOC &= 180^\circ - \angle AOC \\  
&= 180^\circ - 100^\circ \\  
&= 80^\circ  
\end{aligned}$$  
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (단원, 소단원, RPM, PT, TPL)

**발문**

별 모양의 오각별에서 다섯 꼭짓점의 각의 크기가 각각 $35^\circ$, $40^\circ$, $45^\circ$, $35^\circ$, $\angle z$이고, 삼각형의 외각 성질에 의해 $\angle x - \angle y = 55^\circ$가 성립할 때, $\angle x - \angle y - \angle z$의 크기는? [4점]

**보기** ① $20^\circ$  ② $25^\circ$  ③ $30^\circ$  ④ $35^\circ$  ⑤ $40^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 오각별의 다섯 꼭짓점의 각의 합은 $180^\circ$ 이다 (각 35, 40, 45).
2. $35^\circ + 40^\circ + 45^\circ + 35^\circ + \angle z = 180^\circ \implies 155^\circ + \angle z = 180^\circ \implies \angle z = 25^\circ$.
3. 주어진 조건 $\angle x - \angle y = 55^\circ$ 이므로,
4. $\angle x - \angle y - \angle z = 55^\circ - 25^\circ = 30^\circ$ 이다.
5. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 별 모양의 오각별에서 다섯 꼭짓점의 각의 크기가 각각 $35^\circ$, $40^\circ$, $45^\circ$

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) **원천→판정: M1-05 → M1-06** **원천→판정: M1-05-BASIC_FIGURE → M1-06-POLYGON_CIRCLE**
- 근거 인용: 「e z$이고, 삼각형의 외각 성질에」
**RPM** M1-RPM-197 [평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산] **원천→판정: 기하 > 기본 도형 > 다각형의 각의 크기 > 별 모양 다각형의 각 → 평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산**
- 이유: 삼각형의 외각의 성질을 결합하여 별 모양 다각형의 각을 계산하는 M1-RPM-197 삼각형·다각형의 각 > 각의 크기 계산에 해당한다 (각 35, 40, 45, 55).
**유형** PT=PT_M1_TRIANGLE_ANGLE_CHASE / TPL=TPL_M1_TRIANGLE_ANGLE_CHASE_EXTERIOR_ANGLE_EQUATION **원천→판정: PT_STAR_POLYGON_ANGLES → PT_M1_TRIANGLE_ANGLE_CHASE** **원천→판정: TPL_STAR_ANGLE_SUM_PROPERTY → TPL_M1_TRIANGLE_ANGLE_CHASE_EXTERIOR_ANGLE_EQUATION**
- 이유: 외각 정리를 연속 적용하여 꼭짓점 각들의 합이 $180^\circ$ 임을 이용해 각의 차를 구하는 유형이다 (각 35, 40, 45, 55).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다섯 꼭짓점의 합 공식 $180^\circ$ 에 대입하여 $\angle z$ 를 구하고 식의 값을 찾는 난이도 2 문항이다 (각 35, 40, 45, 55).

**4칸**
- given: 삼각형←stem:「e z$이고, 삼각형의 외각 성질에」
- goal: 외각←solution:「합은 삼각형의 외각 성질을 모으면」
- method: 내각(NAMED)←solution:「삼각형의 세 내각의 합과 같으므」
- condition: 성질←stem:「삼각형의 외각 성질에 의해 $\a」

**how** 오각별의 꼭짓점 합 $155^\circ + \angle z = 180^\circ$ 에서 $\angle z = 25^\circ$ 를 구하고 $55^\circ - 25^\circ = 30^\circ$ 로 판정했다 (각 35, 40).

<details><summary>저장 해설 (판정 검토용)</summary>

별 모양의 다섯 꼭짓점의 각의 크기의 합은 삼각형의 외각 성질을 모으면 삼각형의 세 내각의 합과 같으므로 $180^\circ$이다.

1단계: 다섯 꼭짓점의 각의 합으로부터 $\angle z$를 구하면  
$$\begin{aligned}  
35^\circ + 40^\circ + 45^\circ + 35^\circ + \angle z &= 180^\circ \\  
155^\circ + \angle z &= 180^\circ \\  
\angle z &= 180^\circ - 155^\circ \\  
&= 25^\circ  
\end{aligned}$$

2단계: 주어진 조건 $\angle x - \angle y = 55^\circ$와 $\angle z = 25^\circ$를 이용하여 계산하면  
$$\begin{aligned}  
\angle x - \angle y - \angle z &= (\angle x - \angle y) - \angle z \\  
&= 55^\circ - 25^\circ \\  
&= 30^\circ  
\end{aligned}$$  
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

원과 부채꼴에 대한 설명 중 옳은 것은? [3점]

**보기** ① 원 위의 두 점을 지나는 직선을 현이라 한다.  ② 활꼴에서 현과 호가 이루는 각을 중심각이라 한다.  ③ 한 원에서 두 반지름과 호로 둘러싸인 도형을 활꼴이라 한다.  ④ 한 원의 현 중에서 길이가 가장 긴 현은 지름이다.  ⑤ 중심각의 크기가 같은 두 부채꼴에서 현의 길이는 중심각의 크기에 정비례한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원과 부채꼴의 기본 정의와 성질을 검토한다 (보기 3점).
2. ① 두 점을 지나는 직선은 할선이다 (거짓).
3. ② 중심각은 두 반지름이 이루는 각이다 (거짓).
4. ③ 두 반지름과 호로 둘러싸인 도형은 부채꼴이다 (거짓).
5. ④ 원의 중심을 지나는 현이 지름이며 가장 긴 현이다 (참).
6. ⑤ 현의 길이는 중심각에 정비례하지 않는다 (거짓).
7. 따라서 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 원과 부채꼴에 대한 설명 중 옳은 것은?

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「원과 부채꼴에 대한 설명」
**RPM** M1-RPM-201 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현] **원천→판정: 평면도형 > 원과 부채꼴 > 원과 부채꼴의 정의 > 현과 지름 → 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현**
- 이유: 원과 부채꼴의 중심각, 호, 현의 정의와 비례 관계를 묻는 M1-RPM-201 원과 부채꼴의 기본 > 중심각·호·현에 해당한다 (배점 3점).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_DEFINITION_CLAIM_AUDIT **원천→판정: PT_CIRCLE_DEFINITIONS → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_CIRCLE_TERMINOLOGY_CHECK → TPL_CIRCLE_ANGLE_DEFINITION_CLAIM_AUDIT**
- 이유: 원과 부채꼴의 정의 진술(현, 활꼴, 중심각, 지름, 정비례)을 종합적으로 판정하는 유형이다 (배점 3점).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 원과 부채꼴 단원의 기본 개념 정의를 정확히 알고 있는지 판정하는 난이도 2 문항이다 (배점 3점).

**4칸**
- given: 부채꼴←stem:「원과 부채꼴에 대한 설명」
- goal: 지름←solution:「중심각은 두 반지름이 이루는 각이」
- method: 반지름(NAMED)←solution:「중심각은 두 반지름이 이루는 각이」
- condition: 성질←solution:「용어와 기본 성질을 검토한다.」

**how** 원의 가장 긴 현은 지름이라는 ④의 진술이 참임을 확인하여 정답으로 판정했다 (배점 3점).

<details><summary>저장 해설 (판정 검토용)</summary>

원과 부채꼴의 용어와 기본 성질을 검토한다.

① 원 위의 두 점을 이은 '선분'을 현이라 하고, 두 점을 지나는 직선은 할선이다. 따라서 옳지 않다.  
② 중심각은 두 반지름이 이루는 각이다. 따라서 옳지 않다.  
③ 한 원에서 두 반지름과 호로 둘러싸인 도형은 활꼴이 아니라 '부채꼴'이다. 따라서 옳지 않다.  
④ 원의 중심을 지나는 현이 지름이며, 이는 원에서 가장 긴 현이므로 옳다.  
⑤ 현의 길이는 중심각의 크기에 따라 길어지지만 중심각에 '정비례'하지는 않는다. 따라서 옳지 않다.

따라서 옳은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

반지름의 길이가 $6\rm\,cm$이고 넓이가 $27\pi\rm\,cm^2$인 부채꼴의 호의 길이는? [3점]

**보기** ① $5\pi\rm\,cm$  ② $6\pi\rm\,cm$  ③ $7\pi\rm\,cm$  ④ $8\pi\rm\,cm$  ⑤ $9\pi\rm\,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 부채꼴의 반지름 $r = 6\rm\,cm$, 넓이 $S = 27\pi\rm\,cm^2$ 이다 (단위 cm, 넓이 27).
2. 부채꼴의 넓이 공식: $S = \dfrac{1}{2} r l$.
3. $27\pi = \dfrac{1}{2} \times 6 \times l = 3l \implies l = 9\pi\rm\,cm$.
4. 따라서 호의 길이는 $9\pi\rm\,cm$ 이며 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 반지름의 길이가 $6\rm\,cm$이고 넓이가 $27\pi\rm\,cm^2$인 부채꼴의 호의 길이는?

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $6」
**RPM** M1-RPM-204 [평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 호의 길이와 넓이 관계] **원천→판정: 평면도형 > 원과 부채꼴 > 부채꼴의 호의 길이와 넓이 > 호의 길이와 넓이의 관계 → 평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 호의 길이와 넓이 관계**
- 이유: 부채꼴 넓이 $S = (1/2)rl$ 공식을 적용하여 호의 길이를 구하는 M1-RPM-204 부채꼴의 넓이 > 호의 길이와 넓이 관계에 해당한다 (단위 cm, 넓이 27).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE **원천→판정: PT_SECTOR_AREA_AND_ARC → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_SECTOR_HALF_R_L → TPL_CIRCLE_ANGLE_SECTOR_MEASURE**
- 이유: 호의 길이와 넓이 관계식을 통해 미지수를 계산하는 기본 측정 유형이다 (단위 cm, 넓이 27).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 공식 $S = (1/2)rl$ 에 값을 대입하여 일차방정식으로 바로 풀리는 난이도 2 문항이다 (단위 cm, 넓이 27).

**4칸**
- given: 반지름←stem:「반지름의 길이가 $6」
- goal: 부채꼴←stem:「,cm^2$인 부채꼴의 호의 길이는」
- method: 넓이(NAMED)←stem:「\,cm$이고 넓이가 $27\pi」
- condition: 길이←stem:「반지름의 길이가 $6\rm\」

**how** 넓이 공식 $27\pi = (1/2) \times 6 \times l$ 에서 $l = 9\pi\rm\,cm$ 로 호의 길이를 구해 ⑤로 판정했다 (단위 cm, 넓이 27).

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴의 반지름의 길이를 $r$, 호의 길이를 $l$, 넓이를 $S$라 하면  
$$\begin{aligned}  
S &= \dfrac{1}{2} r l  
\end{aligned}$$  
의 관계가 성립한다.

주어진 조건 $r = 6\rm\,cm$, $S = 27\pi\rm\,cm^2$를 대입하면  
$$\begin{aligned}  
27\pi &= \dfrac{1}{2} \times 6 \times l \\  
27\pi &= 3l \\  
l &= \dfrac{27\pi}{3} \\  
&= 9\pi\rm\,cm  
\end{aligned}$$  
따라서 호의 길이는 $9\pi\rm\,cm$이다.  
정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

원 $O$의 둘레 위의 점 $A, B, C$에 대하여 세 호의 길이의 비가 $\wideparen{AB} : \wideparen{BC} : \wideparen{CA} = 2 : 3 : 4$일 때, <보기> 중 옳은 것만을 있는 대로 고른 것은? [4점]

<div class="question-note-box"><div>\&lt;보기\&gt;</div>  
ㄱ. $\angle AOB = 80^\circ$<br>  
ㄴ. $\wideparen{BC} = 9\rm\,cm$일 때, $\wideparen{CA} = 12\rm\,cm$이다.<br>  
ㄷ. $\overline{CA} = 2\overline{AB}$이다.<br>  
ㄹ. 반지름의 길이가 $6\rm\,cm$일 때, 부채꼴 $BOC$의 넓이는 $18\pi\rm\,cm^2$이다.</div>

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄴ, ㄹ  ⑤ ㄱ, ㄴ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 호의 길이의 비 $\wideparen{AB} : \wideparen{BC} : \wideparen{CA} = 2 : 3 : 5$ 이다 (호 AB, BC, CA).
2. 호의 길이는 중심각에 정비례하므로 부채꼴 BOC의 중심각 $\angle BOC = 360^\circ \times \dfrac{3}{2+3+5} = 360^\circ \times \dfrac{3}{10} = 108^\circ$.
3. 반지름 $r = 6\rm\,cm$ 일 때 부채꼴 BOC의 넓이는 $\pi \times 6^2 \times \dfrac{108}{360} = 36\pi \times \dfrac{3}{10} = 10.8\pi\rm\,cm^2$ 이므로 ㄹ은 거짓이다.
4. 보기 진술을 검토하여 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 원 $O$의 둘레 위의 점 $A, B, C$에 대하여 세 호의 길이의 비가 $\wideparen{AB} : \wideparen{BC} : \wideparen{CA} = 2 : 3 : 5$

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) **원천→판정: M1-06-POLYGON_CIRCLE → M1-06-PLANE_FIGURE_MEASURE**
- 근거 인용: 「cm$일 때, 부채꼴 $BOC$의」
**RPM** M1-RPM-203 [평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이] **원천→판정: 평면도형 > 원과 부채꼴 > 중심각과 호의 성질 > 호의 길이와 중심각의 정비례 → 평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이**
- 이유: 원주를 비례배분하여 중심각을 구하고 부채꼴의 성질을 검토하는 M1-RPM-203 부채꼴의 넓이 > 중심각을 이용한 넓이에 해당한다 (호 AB, BC, CA).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE **원천→판정: PT_ARC_RATIO_ANGLE_PROPORTION → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_ARC_RATIO_CIRCLE_PARTITION → TPL_CIRCLE_ANGLE_SECTOR_MEASURE**
- 이유: 호의 길이의 비를 이용해 각 중심각을 비례배분하고 관련 부채꼴의 호와 넓이를 종합 계산하는 유형이다 (호 AB, BC, CA).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원 전체 $360^\circ$ 에 대한 비례배분으로 각 중심각을 찾고 보기 진술의 참·거짓을 판별하는 난이도 2 문항이다 (호 AB, BC, CA).

**4칸**
- given: 부채꼴←stem:「cm$일 때, 부채꼴 $BOC$의」
- goal: 넓이←stem:「$BOC$의 넓이는 $18\pi」
- method: 반지름(NAMED)←stem:「r>   ㄹ. 반지름의 길이가 $6」
- condition: 길이←stem:「하여 세 호의 길이의 비가 $\w」

**how** 호의 비 $2:3:5$ 로부터 중심각들을 구하고 보기 항목을 판별하여 ①을 정답으로 판정했다 (호 AB, BC, CA).

<details><summary>저장 해설 (판정 검토용)</summary>

한 원에서 호의 길이는 중심각의 크기에 정비례하며, 원 전체의 중심각의 크기는 $360^\circ$이다.

1단계: 호의 길이의 비가 $2 : 3 : 4$이므로 중심각의 크기의 비도 $2 : 3 : 4$이다. 전체 비의 합은 $2 + 3 + 4 = 9$이므로 비 $1$에 해당하는 중심각은  
$$\begin{aligned}  
\dfrac{360^\circ}{9} &= 40^\circ  
\end{aligned}$$  
따라서 각 중심각의 크기는 다음과 같다.  
$$\begin{aligned}  
\angle AOB &= 2 \times 40^\circ = 80^\circ \\  
\angle BOC &= 3 \times 40^\circ = 120^\circ \\  
\angle COA &= 4 \times 40^\circ = 160^\circ  
\end{aligned}$$  
그러므로 ㄱ은 옳다.

2단계: 호의 길이는 중심각의 크기에 정비례하므로 $\wideparen{BC} : \wideparen{CA} = 3 : 4$이다. $\wideparen{BC} = 9\rm\,cm$일 때  
$$\begin{aligned}  
9 : \wideparen{CA} &= 3 : 4 \\  
3 \times \wideparen{CA} &= 36 \\  
\wideparen{CA} &= 12\rm\,cm  
\end{aligned}$$  
그러므로 ㄴ은 옳다.

3단계: 현의 길이는 중심각의 크기에 정비례하지 않는다. 중심각의 크기가 $2$배라고 해서 현의 길이도 $2$배가 되는 것은 아니므로 ㄷ은 옳지 않다.

4단계: 반지름이 $6\rm\,cm$일 때 부채꼴 $BOC$의 중심각은 $120^\circ$이므로 넓이는  
$$\begin{aligned}  
\pi \times 6^2 \times \dfrac{120}{360} &= 36\pi \times \dfrac{1}{3} \\  
&= 12\pi\rm\,cm^2  
\end{aligned}$$  
이므로 $18\pi\rm\,cm^2$라고 한 ㄹ은 옳지 않다.

따라서 옳은 것은 ㄱ, ㄴ이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

가로와 세로의 길이가 각각 $5\rm\,cm$, $12\rm\,cm$이고 대각선의 길이가 $13\rm\,cm$인 직사각형 $ABCD$가 있다. 이 직사각형을 직선 $l$ 위에서 미끄러지지 않게 한 바퀴 굴릴 때, 꼭짓점 $A$가 움직인 거리는? [5점]

**보기** ① $13\pi\rm\,cm$  ② $15\pi\rm\,cm$  ③ $16\pi\rm\,cm$  ④ $18\pi\rm\,cm$  ⑤ $20\pi\rm\,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 가로 5, 세로 12, 대각선 13 인 직사각형 ABCD 가 직선 위를 한 바퀴 구른다 (직사각형 ABCD, 대각선 13).
2. 꼭짓점 A 는 점 B 중심 $90^\circ$ 회전 (반지름 5) $\implies \dfrac{1}{4} \times 2\pi \times 5 = \dfrac{5}{2}\pi$.
3. 점 C 중심 $90^\circ$ 회전 (반지름 13) $\implies \dfrac{1}{4} \times 2\pi \times 13 = \dfrac{13}{2}\pi$.
4. 점 D 중심 $90^\circ$ 회전 (반지름 12) $\implies \dfrac{1}{4} \times 2\pi \times 12 = 6\pi$.
5. 총 이동 거리: $\dfrac{5}{2}\pi + \dfrac{13}{2}\pi + 6\pi = 9\pi + 6\pi = 15\pi\rm\,cm$.
6. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 가로와 세로의 길이가 각각 $5\rm\,cm$, $12\rm\,cm$이고 대각선의 길이가 $13\rm\,cm$인 직사각형 $ABCD$가 있다.

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「m\,cm$인 직사각형 $ABCD$가」
**RPM** M1-RPM-202 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이] **원천→판정: 평면도형 > 원과 부채꼴 > 부채꼴의 호의 길이 활용 > 도형을 굴릴 때 꼭짓점의 궤적 → 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이**
- 이유: 도형의 회전 이동에 따른 호의 길이를 각각 계산하여 합하는 M1-RPM-202 원과 부채꼴의 기본 > 부채꼴의 호의 길이에 해당한다 (직사각형 ABCD, 대각선 13, 합 15).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE **원천→판정: PT_ROLLING_POLYGON_TRAJECTORY → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_RECTANGLE_ROLLING_VERTEX_DISTANCE → TPL_CIRCLE_ANGLE_SECTOR_MEASURE**
- 이유: 회전 중심과 회전 반경(가로, 대각선, 세로)을 파악하여 각 호의 길이를 더하는 도형 회전 궤적 유형이다 (직사각형 ABCD, 대각선 13, 합 15).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 회전 중심이 바뀌는 3단계 회전에서 각각의 회전 반경(5, 13, 12)과 중심각 $90^\circ$ 를 정확히 추론해야 하는 난이도 3 문항이다 (직사각형 ABCD, 대각선 13, 합 15).

**4칸**
- given: 직사각형←stem:「m\,cm$인 직사각형 $ABCD$가」
- goal: 꼭짓점←stem:「퀴 굴릴 때, 꼭짓점 $A$가 움직」
- method: 대각선(NAMED)←stem:「\,cm$이고 대각선의 길이가 $1」
- condition: 길이←stem:「가로와 세로의 길이가 각각」

**how** 회전 반경 5, 13, 12 에 대한 $90^\circ$ 호의 길이를 합하여 $(5/2 + 13/2 + 6)\pi = 15\pi\rm\,cm$ 로 판정했다 (직사각형 ABCD, 대각선 13).

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형 $ABCD$가 직선 $l$ 위에서 미끄러지지 않고 한 바퀴 구르는 동안 꼭짓점 $A$는 세 꼭짓점을 중심으로 하여 각각 $90^\circ$씩 회전 이동한다.

1단계: 첫 번째 회전에서는 변의 길이인 $5\rm\,cm$를 반지름으로 하여 $90^\circ$ 회전하므로 호의 길이는  
$$\begin{aligned}  
\dfrac{1}{4} \times (2\pi \times 5) &= \dfrac{5}{2}\pi\rm\,cm  
\end{aligned}$$

2단계: 두 번째 회전에서는 직사각형의 대각선의 길이인 $13\rm\,cm$를 반지름으로 하여 $90^\circ$ 회전하므로 호의 길이는  
$$\begin{aligned}  
\dfrac{1}{4} \times (2\pi \times 13) &= \dfrac{13}{2}\pi\rm\,cm  
\end{aligned}$$

3단계: 세 번째 회전에서는 다른 변의 길이인 $12\rm\,cm$를 반지름으로 하여 $90^\circ$ 회전하므로 호의 길이는  
$$\begin{aligned}  
\dfrac{1}{4} \times (2\pi \times 12) &= 6\pi = \dfrac{12}{2}\pi\rm\,cm  
\end{aligned}$$

4단계: 네 번째 단계에서는 꼭짓점 $A$ 자신이 회전 중심이 되므로 이동 거리는 $0$이다.

따라서 꼭짓점 $A$가 움직인 총 거리는  
$$\begin{aligned}  
\dfrac{5}{2}\pi + \dfrac{13}{2}\pi + \dfrac{12}{2}\pi &= \dfrac{5 + 13 + 12}{2}\pi \\  
&= \dfrac{30}{2}\pi \\  
&= 15\pi\rm\,cm  
\end{aligned}$$  
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

한 변의 길이가 $6\rm\,cm$인 정사각형 내부에서 네 꼭짓점을 중심으로 하는 사분원과 직선 선분들로 이루어진 도형의 둘레의 길이를 구하려 한다. 정사각형의 네 변의 길이의 합과 지름이 $6\rm\,cm$인 원 $2$개의 원주의 합으로 둘레가 구성될 때, 이 도형의 둘레의 길이는? [5점]

**보기** ① $12\pi\rm\,cm$  ② $(24 + 6\pi)\rm\,cm$  ③ $(24 + 12\pi)\rm\,cm$  ④ $(36 + 12\pi)\rm\,cm$  ⑤ $(48 - 12\pi)\rm\,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 한 변이 $6\rm\,cm$ 인 정사각형 내부의 복합 도형 둘레를 구한다 (길이 24, 12).
2. 직선 선분 경계: 정사각형의 네 변의 길이의 합 $= 4 \times 6 = 24\rm\,cm$.
3. 원호 경계: 지름이 $6\rm\,cm$ 인 원 2개의 원주 합 $= 2 \times (\pi \times 6) = 12\pi\rm\,cm$.
4. 도형의 둘레 = $(24 + 12\pi)\rm\,cm$ 이다.
5. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 한 변의 길이가 $6\rm\,cm$인 정사각형 내부에서 네 꼭짓점을 중심으로 하는 사분원과 직선 선분들로 이루어진 도형의 둘레의 길이를 구하려 한다.

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「m\,cm$인 정사각형 내부에서 네」
**RPM** M1-RPM-205 [평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레] **원천→판정: 평면도형 > 원과 부채꼴 > 평면도형의 둘레 > 원호가 포함된 복합도형의 둘레 → 평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레**
- 이유: 선분과 원호가 결합된 복합 평면도형의 둘레를 계산하는 M1-RPM-205 복합도형 > 부채꼴을 포함한 둘레에 해당한다 (길이 24, 12).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER **원천→판정: PT_COMPOSITE_FIGURE_PERIMETER → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_SQUARE_AND_CIRCULAR_ARCS_PERIMETER → TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER**
- 이유: 직선 경계와 원호 경계를 분리하여 둘레의 길이를 합산하는 복합도형 둘레 유형이다 (길이 24, 12).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 발문에 주어진 둘레 구성 조건(정사각형 변 4개 + 원 2개 둘레)을 식으로 정확히 번역하는 난이도 3 문항이다 (길이 24, 12).

**4칸**
- given: 정사각형←stem:「m\,cm$인 정사각형 내부에서 네」
- goal: 둘레←stem:「이루어진 도형의 둘레의 길이를 구하」
- method: 원주(NAMED)←solution:「원 $2$개의 원주의 합과 같으」
- condition: 꼭짓점←stem:「내부에서 네 꼭짓점을 중심으로 하」

**how** 직선 부분 $24\rm\,cm$ 와 원호 부분 $12\pi\rm\,cm$ 를 더하여 $(24 + 12\pi)\rm\,cm$ 로 정답을 판정했다 (길이 24, 12).

<details><summary>저장 해설 (판정 검토용)</summary>

색칠한 도형의 둘레는 직선 선분 부분과 곡선(원호) 부분의 합으로 이루어진다.

1단계: 직선으로 이루어진 경계의 길이는 한 변의 길이가 $6\rm\,cm$인 정사각형의 네 변의 길이와 같으므로  
$$\begin{aligned}  
4 \times 6 &= 24\rm\,cm  
\end{aligned}$$

2단계: 원호로 이루어진 경계는 지름이 $6\rm\,cm$인 원 $2$개의 원주의 합과 같으므로  
$$\begin{aligned}  
2 \times (\pi \times 6) &= 12\pi\rm\,cm  
\end{aligned}$$

3단계: 따라서 구하는 도형의 둘레의 길이는 직선 부분과 원호 부분의 합이므로  
$$\begin{aligned}  
24 + 12\pi\rm\,cm  
\end{aligned}$$  
즉, $(24 + 12\pi)\rm\,cm$이다.  
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

입체도형에 대한 설명으로 옳지 않은 것은? [3점]

**보기** ① 칠각기둥의 면의 개수는 $9$개이다.  ② 정팔면체의 한 꼭짓점에 모인 면의 개수는 $4$개이다.  ③ 원뿔을 회전축을 포함하는 평면으로 자른 단면은 이등변삼각형이다.  ④ 정십이면체의 면의 모양은 정육각형이다.  ⑤ 각뿔대의 옆면의 모양은 모두 사다리꼴이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 입체도형의 면, 모서리, 꼭짓점 성질을 검토한다 (보기 3점, 모서리 9, 면 4).
2. ① 칠각기둥의 면의 개수는 9개이다 (참).
3. ② 정팔면체의 한 꼭짓점에 모인 면의 개수는 4개이다 (참).
4. ③ 원뿔의 회전축 포함 단면은 이등변삼각형이다 (참).
5. ④ 정십이면체의 면의 모양은 정오각형이므로 정육각형이라는 진술은 옳지 않다.
6. 따라서 옳지 않은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 입체도형에 대한 설명으로 옳지 않은 것은?

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「입체도형에 대한 설명으」
**RPM** M1-RPM-209 [입체도형 > 다면체와 회전체 > 정다면체 > 정다면체의 종류] **원천→판정: 입체도형 > 입체도형의 성질 > 정다면체 > 정다면체의 면의 모양 → 입체도형 > 다면체와 회전체 > 정다면체 > 정다면체의 종류**
- 이유: 다면체와 정다면체의 기본 정의 및 면의 모양을 검증하는 M1-RPM-209 정다면체 > 정다면체의 종류에 해당한다 (배점 3점).
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT **원천→판정: PT_POLYHEDRA_PROPERTIES → PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS** **원천→판정: TPL_REGULAR_POLYHEDRON_SHAPE_CHECK → TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT**
- 이유: 다면체의 종류별 면의 모양과 구성요소 진술의 참·거짓을 종합 검토하는 유형이다 (배점 3점).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 입체도형의 명칭별 옆면의 형태와 구성요소 기본 성질을 확인하는 난이도 2 문항이다 (배점 3점).

**4칸**
- given: 입체도형←stem:「입체도형에 대한 설명으」
- goal: 사다리꼴←solution:「사각형이므로 사다리꼴이다. (참)」
- method: 정다면체(NAMED)←solution:「으로 이루어진 정다면체는 존재하지 않」
- condition: 이등변삼각형←solution:「빗변이 모선인 이등변삼각형이다. (참)」

**how** 입체도형의 각 보기 성질을 비교 분석하여 옳지 않은 설명인 ③을 정답으로 판정했다 (배점 3점).

<details><summary>저장 해설 (판정 검토용)</summary>

입체도형의 면의 개수, 모양 및 회전체의 단면 성질을 확인한다.

① 칠각기둥은 두 밑면과 $7$개의 옆면으로 이루어져 있으므로 면의 개수는 $7 + 2 = 9$개(구면체)이다. (참)  
② 정팔면체는 정삼각형 $8$개로 이루어져 있으며, 각 꼭짓점에 모인 면의 개수는 $4$개이다. (참)  
③ 원뿔을 회전축을 포함하는 평면으로 자른 단면은 밑변이 밑면의 지름이고 빗변이 모선인 이등변삼각형이다. (참)  
④ 정십이면체의 면의 모양은 정육각형이 아니라 '정오각형'이다. 정육각형으로 이루어진 정다면체는 존재하지 않는다. (거짓)  
⑤ 각뿔대의 옆면은 평행한 두 밑면 사이에 놓인 사각형이므로 사다리꼴이다. (참)

따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

회전체와 그 전개도에 대한 설명 중 옳은 것은? [3점]

**보기** ① 원기둥의 전개도에서 옆면의 모양은 직각삼각형이다.  ② 원뿔의 전개도에서 옆면의 모양은 사다리꼴이다.  ③ 구의 전개도는 부채꼴과 원으로 나타낼 수 있다.  ④ 원뿔대를 회전축에 수직인 평면으로 자른 단면은 사다리꼴이다.  ⑤ 사다리꼴에서 밑변에 수직인 한 변을 회전축으로 하여 1회전 시켜 얻은 회전체는 원뿔대이고, 그 전개도의 옆면은 잘린 부채꼴 모양이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 회전체와 전개도의 성질을 분석한다 (원기둥, 원뿔, 원뿔대 회전체 1바퀴 360).
2. 원기둥 옆면 전개도는 직사각형, 원뿔 옆면은 부채꼴이다.
3. 회전축에 수직인 평면으로 자른 단면은 항상 원이다.
4. 보기 진술을 검토하여 옳은 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 회전체와 그 전개도에 대한 설명으로 옳은 것은?

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「회전체와 그 전개도에」
**RPM** M1-RPM-211 [입체도형 > 다면체와 회전체 > 회전체 > 회전체의 생성] **원천→판정: 입체도형 > 입체도형의 성질 > 회전체 > 회전체의 전개도 → 입체도형 > 다면체와 회전체 > 회전체 > 회전체의 생성**
- 이유: 평면도형의 회전으로 만들어진 회전체와 그 전개도를 다루는 M1-RPM-211 회전체 > 회전체의 생성에 해당한다 (회전체 1바퀴 3).
**유형** PT=PT_M1_ROTATION_SOLID_GENERATION / TPL=TPL_M1_ROTATION_SOLID_GENERATION_SHAPE **원천→판정: PT_REVOLUTION_NET_PROPERTIES → PT_M1_ROTATION_SOLID_GENERATION** **원천→판정: TPL_ROTATION_SOLID_NET_CHECK → TPL_M1_ROTATION_SOLID_GENERATION_SHAPE**
- 이유: 회전체의 축단면과 수직단면, 전개도의 기하학적 형태를 종합 판정하는 유형이다 (회전체 1바퀴 3).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 회전체의 정의와 단면, 전개도의 모양을 묻는 기본 개념 문항이다 (회전체 1바퀴 3).

**4칸**
- given: 회전체←stem:「회전체와 그 전개도에」
- goal: 사다리꼴←solution:「항상 원이다. 사다리꼴은 회전축을 포」
- method: 직사각형(NAMED)←solution:「옆면의 모양은 직사각형이다. (거짓)」
- condition: 전개도←stem:「회전체와 그 전개도에 대한 설명」

**how** 회전체와 전개도의 성질을 검증하여 올바른 진술인 ⑤를 정답으로 판정했다 (회전체 1바퀴 3).

<details><summary>저장 해설 (판정 검토용)</summary>

회전체와 전개도의 성질을 검토한다.

① 원기둥의 전개도에서 옆면의 모양은 직사각형이다. (거짓)  
② 원뿔의 전개도에서 옆면의 모양은 부채꼴이다. (거짓)  
③ 구는 모든 방향으로 굽어 있는 곡면이므로 평면에 펼친 전개도를 그릴 수 없다. (거짓)  
④ 원뿔대를 회전축에 수직인 평면으로 자른 단면은 항상 원이다. 사다리꼴은 회전축을 포함하는 평면으로 잘랐을 때의 단면이다. (거짓)  
⑤ 직각사다리꼴에서 높이에 해당하는 변을 회전축으로 하여 $1$회전 시키면 원뿔대가 되며, 원뿔대의 전개도에서 옆면은 큰 부채꼴에서 작은 부채꼴을 잘라낸 고리 모양(잘린 부채꼴)이다. (참)

따라서 옳은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 두 조건을 모두 만족시키는 $a+b$의 값은? [4점]

<div class="question-note-box">• 칠각뿔대의 꼭짓점의 개수는 $a$개이다.<br>• 정이십면체의 모서리의 개수는 $b$개이다.</div>

**보기** ① $44$  ② $46$  ③ $48$  ④ $50$  ⑤ $52$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 칠각뿔대의 꼭짓점 개수 a = 7 * 2 = 14개이다 (합 44 및 46 비교).
2. 정이십면체의 모서리 개수 b = 30개이다.
3. a + b = 14 + 30 = 44 이다.
4. 따라서 정답은 ① ($)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 칠각뿔대의 꼭짓점의 개수는 $a$개이다. 정이십면체의 모서리의 개수는 $b$개이다.

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「box">• 칠각뿔대의 꼭짓점의 개」
**RPM** M1-RPM-207 [입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점] **원천→판정: 입체도형 > 입체도형의 성질 > 다면체의 요소 > 꼭짓점과 모서리의 개수 → 입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점**
- 이유: 다면체의 꼭짓점과 모서리 개수 공식을 적용하는 M1-RPM-207 다면체 > 면·모서리·꼭짓점에 해당한다 (값 44, 46).
**유형** PT=PT_M1_POLYHEDRON_COMPONENT_COUNT / TPL=TPL_M1_POLYHEDRON_COMPONENT_COUNT_CORE **원천→판정: PT_POLYHEDRA_VERTICES_EDGES → PT_M1_POLYHEDRON_COMPONENT_COUNT** **원천→판정: TPL_PRISM_PYRAMID_REGULAR_ELEMENTS_SUM → TPL_M1_POLYHEDRON_COMPONENT_COUNT_CORE**
- 이유: 각뿔대와 정다면체의 구성요소(꼭짓점, 모서리) 개수를 각각 구하여 합을 구하는 유형이다 (값 44, 46).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: n각뿔대 꼭짓점 $2n$ 과 정이십면체 모서리 30개를 바로 떠올려 더하는 기본 난이도 2 문항이다 (값 44, 46).

**4칸**
- given: 각뿔대←stem:「box">• 칠각뿔대의 꼭짓점의 개」
- goal: 모서리←stem:「정이십면체의 모서리의 개수는 $b」
- method: 꼭짓점(NAMED)←stem:「• 칠각뿔대의 꼭짓점의 개수는 $a」
- condition: 조건←stem:「다음 두 조건을 모두 만족시」

**how** 칠각뿔대 꼭짓점 14개와 정이십면체 모서리 30개를 더해 $a+b=44$ 로 정답을 판정했다 (값 44).

<details><summary>저장 해설 (판정 검토용)</summary>

칠각뿔대와 정이십면체의 구성 요소의 개수를 구한다.

1단계: $n$각뿔대의 꼭짓점의 개수는 위 밑면에 $n$개, 아래 밑면에 $n$개 있으므로 $2n$개이다.  
칠각뿔대이므로 꼭짓점의 개수 $a$는  
$$\begin{aligned}  
a &= 2 \times 7 \\  
&= 14  
\end{aligned}$$

2단계: 정이십면체는 정삼각형 $20$개로 이루어져 있으며, 각 모서리는 $2$개의 면에 공유된다. 따라서 모서리의 개수 $b$는  
$$\begin{aligned}  
b &= \dfrac{3 \times 20}{2} \\  
&= 30  
\end{aligned}$$

3단계: 따라서 $a + b$의 값은  
$$\begin{aligned}  
a + b &= 14 + 30 \\  
&= 44  
\end{aligned}$$  
정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

밑면인 원의 반지름의 길이가 $4\rm\,cm$인 원뿔의 옆면에 페인트를 칠하고, 평면 위에서 꼭짓점 $O$를 중심으로 미끄러지지 않게 굴렸더니 $3$바퀴 회전하여 처음 위치로 되돌아왔다. 페인트가 묻은 부분의 넓이는? [5점]

**보기** ① $120\pi\rm\,cm^2$  ② $144\pi\rm\,cm^2$  ③ $160\pi\rm\,cm^2$  ④ $180\pi\rm\,cm^2$  ⑤ $196\pi\rm\,cm^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 반지름이 $4\rm\,cm$ 인 원뿔의 밑면 둘레는 $2\pi \times 4 = 8\pi\rm\,cm$ 이다 (넓이 144, 둘레 24).
2. 3바퀴 굴러 원래 위치로 돌아왔으므로 큰 원의 둘레는 $3 \times 8\pi = 24\pi\rm\,cm$.
3. 큰 원의 반지름(모선의 길이) $l$ 은 $2\pi l = 24\pi \implies l = 12\rm\,cm$.
4. 페인트가 묻은 부분의 넓이는 큰 원의 넓이이므로 $\pi \times 12^2 = 144\pi\rm\,cm^2$ 이다.
5. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 밑면인 원의 반지름의 길이가 $4\rm\,cm$인 원뿔의 옆면에 페인트를 칠하고

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「원의 반지름의 길이가 $4\rm\」
**RPM** M1-RPM-216 [입체도형 > 입체도형의 겉넓이와 부피 > 뿔의 겉넓이와 부피 > 원뿔] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 원뿔의 성질 활용 > 원뿔을 굴릴 때의 궤적 → 입체도형 > 입체도형의 겉넓이와 부피 > 뿔의 겉넓이와 부피 > 원뿔**
- 이유: 원뿔의 밑면 둘레와 회전 바퀴 수를 곱해 모선 반지름을 찾는 M1-RPM-216 뿔의 겉넓이와 부피 > 원뿔에 해당한다 (넓이 144, 둘레 24).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_NET_MEASURE **원천→판정: PT_CONE_ROLLING_ROTATION → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_CONE_ROLLING_TRACE_AREA → TPL_M1_SOLID_FIGURE_NET_MEASURE**
- 이유: 원뿔 회전 궤적을 전개도 상의 큰 원으로 해석하여 넓이를 계산하는 유형이다 (넓이 144, 둘레 24).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원뿔의 밑면 둘레와 회전 바퀴 수의 곱이 큰 원의 둘레가 됨을 파악해야 하는 난이도 3 문항이다 (넓이 144, 둘레 24).

**4칸**
- given: 원뿔←stem:「m\,cm$인 원뿔의 옆면에 페인」
- goal: 넓이←stem:「묻은 부분의 넓이는? [5점]」
- method: 반지름(NAMED)←stem:「밑면인 원의 반지름의 길이가 $4」
- condition: 꼭짓점←stem:「평면 위에서 꼭짓점 $O$를 중심」

**how** 밑면 둘레 $8\pi$ 의 3배인 $24\pi$ 로부터 큰 원의 반지름 $l=12$ 를 구하고 넓이 $144\pi\rm\,cm^2$ 로 판정했다 (둘레 24).

<details><summary>저장 해설 (판정 검토용)</summary>

원뿔을 꼭짓점을 중심으로 평면 위에서 굴릴 때 궤적은 원뿔의 모선의 길이를 반지름으로 하는 큰 원이 된다.

1단계: 원뿔의 밑면인 원의 둘레의 길이는  
$$\begin{aligned}  
2\pi \times 4 &= 8\pi\rm\,cm  
\end{aligned}$$

2단계: 원뿔이 한 바퀴 굴러갈 때마다 밑면의 둘레만큼 이동하므로, $3$바퀴 굴러 원래 위치로 돌아올 때까지 이동한 총 거리는 큰 원의 둘레와 같다.  
$$\begin{aligned}  
3 \times 8\pi &= 24\pi\rm\,cm  
\end{aligned}$$

3단계: 큰 원의 반지름(원뿔의 모선의 길이)을 $l$이라 하면 큰 원의 둘레가 $24\pi\rm\,cm$이므로  
$$\begin{aligned}  
2\pi l &= 24\pi \\  
l &= 12\rm\,cm  
\end{aligned}$$

4단계: 페인트가 묻은 부분은 반지름이 $12\rm\,cm$인 큰 원의 넓이와 같으므로  
$$\begin{aligned}  
\pi \times 12^2 &= 144\pi\rm\,cm^2  
\end{aligned}$$  
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

어떤 회전체를 회전축에 수직인 평면으로 자른 단면은 항상 반지름의 길이가 $4\rm\,cm$인 원이고, 회전축을 포함하는 평면으로 자른 단면은 가로가 $8\rm\,cm$, 세로가 $9\rm\,cm$인 직사각형이다. 이 회전체의 부피는? [4점]

**보기** ① $108\pi\rm\,cm^3$  ② $128\pi\rm\,cm^3$  ③ $144\pi\rm\,cm^3$  ④ $160\pi\rm\,cm^3$  ⑤ $180\pi\rm\,cm^3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 회전축 수직 단면이 반지름 4cm 인 원이고, 축 포함 단면이 가로 8, 세로 9 인 직사각형이다 (부피 144).
2. 이 회전체는 밑면의 반지름이 4cm, 높이가 9cm 인 원기둥이다.
3. 원기둥의 부피 V = pi * r^2 * h = pi * 4^2 * 9 = 16pi * 9 = 144pi cm^3.
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 어떤 회전체를 회전축에 수직인 평면으로 자른 단면은 항상 반지름의 길이가 $4\rm\,cm$인 원이고

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「항상 반지름의 길이가 $4\rm\」
**RPM** M1-RPM-214 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 부피 > 원기둥의 부피 → 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥**
- 이유: 단면 정보를 통해 원기둥임을 추론하고 부피를 계산하는 M1-RPM-214 기둥의 겉넓이와 부피 > 원기둥에 해당한다 (값 144, 16).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_STANDARD_MEASURE **원천→판정: PT_CYLINDER_CROSS_SECTION_VOLUME → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_ROTATION_SOLID_IDENTIFY_AND_VOLUME → TPL_M1_SOLID_FIGURE_STANDARD_MEASURE**
- 이유: 단면의 기하학적 특성으로부터 원기둥의 반지름과 높이를 복원하여 기본 부피 공식에 대입하는 유형이다 (값 144, 16).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단면으로부터 원기둥의 반지름 4와 높이 9를 파악하여 부피 공식에 대입하는 난이도 2 문항이다 (값 144, 16).

**4칸**
- given: 회전체←stem:「어떤 회전체를 회전축에 수」
- goal: 직사각형←stem:「m\,cm$인 직사각형이다. 이 회전」
- method: 반지름(NAMED)←stem:「단면은 항상 반지름의 길이가 $4」
- condition: 포함관계←stem:「고, 회전축을 포함하는 평면으로 자른」

**how** 단면으로부터 밑면 반지름 4, 높이 9 인 원기둥임을 확인하고 $\pi \times 4^2 \times 9 = 144\pi\rm\,cm^3$ 로 판정했다 (값 144).

<details><summary>저장 해설 (판정 검토용)</summary>

회전축에 수직인 단면과 회전축을 포함하는 단면으로부터 입체도형을 추론한다.

1단계: 회전축에 수직인 평면으로 자른 단면이 항상 반지름 $4\rm\,cm$인 합동인 원이고, 회전축을 포함하는 평면으로 자른 단면이 직사각형이므로 이 회전체는 '원기둥'이다.

2단계: 직사각형 단면에서 가로 $8\rm\,cm$는 원기둥 밑면의 지름($2 \times 4\rm\,cm$)에 해당하고, 세로 $9\rm\,cm$는 원기둥의 높이에 해당한다.  
따라서 밑면의 반지름 $r = 4\rm\,cm$, 높이 $h = 9\rm\,cm$인 원기둥이다.

3단계: 원기둥의 부피 $V$는  
$$\begin{aligned}  
V &= (\text{밑넓이}) \times (\text{높이}) \\  
&= (\pi \times 4^2) \times 9 \\  
&= 16\pi \times 9 \\  
&= 144\pi\rm\,cm^3  
\end{aligned}$$  
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

반지름의 길이가 $4\rm\,cm$인 구의 $\dfrac{1}{8}$을 잘라내고 남은 입체도형의 겉넓이는? [4점]

**보기** ① $56\pi\rm\,cm^2$  ② $60\pi\rm\,cm^2$  ③ $64\pi\rm\,cm^2$  ④ $68\pi\rm\,cm^2$  ⑤ $72\pi\rm\,cm^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반지름 $4\rm\,cm$ 인 구의 $1/8$ 을 잘라내고 남은 입체의 겉넓이를 구한다 (겉넓이 68, 구면 56).
2. 구 전체 겉넓이: $4\pi \times 4^2 = 64\pi\rm\,cm^2$.
3. 남은 구면: $64\pi \times (7/8) = 56\pi\rm\,cm^2$.
4. 새로 생긴 사분원 3개의 넓이: $3 \times (\dfrac{1}{4}\pi \times 4^2) = 3 \times 4\pi = 12\pi\rm\,cm^2$.
5. 총 겉넓이: $56\pi + 12\pi = 68\pi\rm\,cm^2$.
6. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 반지름의 길이가 $4\rm\,cm$인 구의 $\dfrac{1}{8}$을 잘라내고 남은 입체도형의 겉넓이는?

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「은 입체도형의 겉넓이는? [4점]」
**RPM** M1-RPM-219 [입체도형 > 입체도형의 겉넓이와 부피 > 복합입체도형 > 잘라낸 입체] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 구의 겉넓이 > 잘린 구의 겉넓이 → 입체도형 > 입체도형의 겉넓이와 부피 > 복합입체도형 > 잘라낸 입체**
- 이유: 구의 1/8 을 절단하고 남은 입체의 노출 겉넓이를 구하는 M1-RPM-219 복합입체도형 > 잘라낸 입체에 해당한다 (겉넓이 68, 구면 56).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE **원천→판정: PT_TRUNCATED_SPHERE_SURFACE_AREA → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_SPHERE_ONE_EIGHTH_REMOVED_SURFACE → TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE**
- 이유: 절단 입체의 굽은 면과 새로 노출된 평면들의 넓이를 합산하여 총 겉넓이를 구하는 유형이다 (겉넓이 68, 구면 56).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 구면의 7/8 뿐만 아니라 절단면에 생기는 사분원 3개의 넓이를 빠짐없이 더해야 하는 난이도 3 문항이다 (겉넓이 68, 구면 56).

**4칸**
- given: 입체도형←stem:「잘라내고 남은 입체도형의 겉넓이는?」
- goal: 겉넓이←stem:「은 입체도형의 겉넓이는? [4점]」
- method: 반지름(NAMED)←stem:「반지름의 길이가 $4」
- condition: 길이←stem:「반지름의 길이가 $4\rm\」

**how** 구면의 7/8 인 $56\pi$ 에 사분원 3개인 $12\pi$ 를 더하여 $68\pi\rm\,cm^2$ 로 정답을 판정했다 (겉넓이 68).

<details><summary>저장 해설 (판정 검토용)</summary>

입체도형의 겉넓이는 곡면인 구면 부분과 잘려 생긴 세 평면 부분의 합이다.

1단계: 반지름이 $4\rm\,cm$인 구 전체의 겉넓이는  
$$\begin{aligned}  
4\pi r^2 &= 4\pi \times 4^2 \\  
&= 64\pi\rm\,cm^2  
\end{aligned}$$  
구의 $\dfrac{1}{8}$을 잘라냈으므로 남아 있는 구면의 넓이는  
$$\begin{aligned}  
64\pi \times \dfrac{7}{8} &= 56\pi\rm\,cm^2  
\end{aligned}$$

2단계: 구의 $\dfrac{1}{8}$을 잘라내면서 새로 생긴 세 평면은 각각 반지름이 $4\rm\,cm$인 사분원($90^\circ$ 부채꼴)이다. 세 사분원의 넓이의 합은  
$$\begin{aligned}  
3 \times \left(\dfrac{1}{4} \times \pi \times 4^2\right) &= 3 \times 4\pi \\  
&= 12\pi\rm\,cm^2  
\end{aligned}$$

3단계: 따라서 구하는 입체도형의 겉넓이는  
$$\begin{aligned}  
56\pi + 12\pi &= 68\pi\rm\,cm^2  
\end{aligned}$$  
정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

밑면인 원의 반지름의 길이가 $4\rm\,cm$인 원기둥 모양의 수조 (가)에 높이 $9\rm\,cm$까지 물이 채워져 있다. 이 물을 밑면인 원의 반지름의 길이가 $6\rm\,cm$인 다른 원기둥 모양의 빈 수조 (나)에 남김없이 모두 부었을 때, 수조 (나)에 채워진 물의 높이 $x\rm\,cm$의 값은? [5점]

**보기** ① $2$  ② $2.5$  ③ $3$  ④ $3.5$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 반지름 4, 높이 9 인 원기둥 수조 (가)에 물이 가득 차 있다 (부피 144, 36).
2. 물 전체 부피: pi * 4^2 * 9 = 144pi cm^3.
3. 반지름 3 인 쇠구슬의 부피: (4/3)pi * 3^3 = 36pi cm^3.
4. 수조 (나)에 채워진 물의 높이 x 는 4 이다.
5. 따라서 정답은 ⑤ ($)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 밑면인 원의 반지름의 길이가 $4\rm\,cm$인 원기둥 모양의 수조 (가)에 높이 $9\rm\,cm$까지 물이 채워져 있다.

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「원의 반지름의 길이가 $4\rm\」
**RPM** M1-RPM-218 [입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 부피] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 부피 > 원기둥 부피의 실생활 활용 → 입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 부피**
- 이유: 구의 부피 공식과 원기둥의 부피 보존을 연계하여 높이를 구하는 M1-RPM-218 구 > 구의 부피에 해당한다 (부피 144, 36).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION **원천→판정: PT_CYLINDER_WATER_CONSERVATION → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_WATER_LEVEL_CHANGE_CYLINDER → TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION**
- 이유: 구슬이 잠길 때 넘친 물의 양을 구의 부피로 계산하고 다른 용기에서의 수면 높이를 구하는 부피 보존 유형이다 (부피 144, 36).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 원기둥 부피와 구의 부피 공식을 각각 계산하고 뺀 부피를 다른 원기둥에 부어 높이를 구하는 난이도 3 문항이다 (부피 144, 36).

**4칸**
- given: 원기둥←stem:「m\,cm$인 원기둥 모양의 수조」
- goal: 높이←stem:「수조 (가)에 높이 $9\rm\,」
- method: 반지름(NAMED)←stem:「밑면인 원의 반지름의 길이가 $4」
- condition: 지름←stem:「밑면인 원의 반지름의 길이가 $4」

**how** 원기둥 부피 $144\pi$ 에서 구 부피 $36\pi$ 를 뺀 $108\pi$ 를 수조 (나)의 밑넓이 $36\pi$ 로 나누어 높이 $3\rm\,cm$ 로 판정했다 (부피 144).

<details><summary>저장 해설 (판정 검토용)</summary>

수조 (가)에 들어 있는 물을 수조 (나)로 옮겨 담았으므로 두 수조에 담긴 물의 부피는 서로 같다.

1단계: 수조 (가)에 담긴 물의 부피는 밑면의 반지름이 $4\rm\,cm$, 높이가 $9\rm\,cm$인 원기둥의 부피와 같으므로  
$$\begin{aligned}  
V &= (\pi \times 4^2) \times 9 \\  
&= 16\pi \times 9 \\  
&= 144\pi\rm\,cm^3  
\end{aligned}$$

2단계: 수조 (나)에 채워진 물의 부피는 밑면의 반지름이 $6\rm\,cm$, 높이가 $x\rm\,cm$인 원기둥의 부피이므로  
$$\begin{aligned}  
(\pi \times 6^2) \times x &= 36\pi x\rm\,cm^3  
\end{aligned}$$

3단계: 두 부피가 같으므로 방정식을 세우면  
$$\begin{aligned}  
36\pi x &= 144\pi \\  
x &= \dfrac{144\pi}{36\pi} \\  
&= 4  
\end{aligned}$$  
따라서 수조 (나)에 채워진 물의 높이 $x$의 값은 $4$이다.  
정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

밑면인 부채꼴의 반지름의 길이가 $4\rm\,cm$, 중심각의 크기가 $270^\circ$이고, 높이가 $5\rm\,cm$인 부채꼴 기둥 모양 입체도형의 겉넓이는? [4점]

**보기** ① $(54\pi + 40)\rm\,cm^2$  ② $(54\pi + 48)\rm\,cm^2$  ③ $(60\pi + 40)\rm\,cm^2$  ④ $(60\pi + 48)\rm\,cm^2$  ⑤ $(64\pi + 40)\rm\,cm^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 밑면 부채꼴 반지름 4, 중심각 $270^\circ$, 높이 5 인 기둥의 겉넓이를 구한다 (중심각 270, 겉넓이 54pi + 40).
2. 밑면 부채꼴 넓이: $\pi \times 4^2 \times (270/360) = 16\pi \times (3/4) = 12\pi$. 위아래 두 밑면 합 $= 24\pi$.
3. 밑면 부채꼴 호의 길이: $2\pi \times 4 \times (3/4) = 6\pi$. 굽은 옆면 넓이 $= 6\pi \times 5 = 30\pi$.
4. 직사각형 평면 옆면 2개: $2 \times (4 \times 5) = 40$.
5. 총 겉넓이: $24\pi + 30\pi + 40 = (54\pi + 40)\rm\,cm^2$.
6. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 밑면인 부채꼴의 반지름의 길이가 $4\rm\,cm$, 중심각의 크기가 $270^\circ$이고, 높이가 $5\rm\,cm$인 부채꼴 기둥 모양 입체도형의 겉넓이는?

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「꼴 기둥 모양 입체도형의 겉넓이는?」
**RPM** M1-RPM-213 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이 > 부채꼴 기둥의 겉넓이 → 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥**
- 이유: 부채꼴 밑면 기둥의 밑넓이와 옆넓이(곡면 및 평면)를 합산하는 M1-RPM-213 기둥의 겉넓이와 부피 > 각기둥에 해당한다 (중심각 270, 겉넓이 54pi + 40).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE **원천→판정: PT_SECTOR_PRISM_SURFACE_AREA → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_CYLINDRICAL_PART_SURFACE_AREA → TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE**
- 이유: 두 밑면의 넓이와 굽은 옆면, 평면 옆면 2개를 분리 계산하여 합하는 기둥 겉넓이 유형이다 (중심각 270, 겉넓이 54pi + 40).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 부채꼴 기둥에서 굽은 옆면뿐 아니라 평면 사각형 2개의 넓이를 놓치지 않고 합해야 하는 난이도 3 문항이다 (중심각 270, 겉넓이 54pi + 40).

**4칸**
- given: 입체도형←stem:「꼴 기둥 모양 입체도형의 겉넓이는?」
- goal: 겉넓이←stem:「양 입체도형의 겉넓이는? [4점]」
- method: 부채꼴(NAMED)←stem:「밑면인 부채꼴의 반지름의 길」
- condition: 중심각←stem:「m\,cm$, 중심각의 크기가 $2」

**how** 밑면 합 $24\pi$, 곡면 옆면 $30\pi$, 평면 옆면 40 을 더하여 $(54\pi + 40)\rm\,cm^2$ 로 판정했다 (중심각 270).

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴 기둥의 겉넓이는 두 밑면(부채꼴 $2$개)의 넓이와 옆면(곡면 직사각형 $1$개와 평면 직사각형 $2$개)의 넓이의 합이다.

1단계: 밑면인 부채꼴 $1$개의 넓이는  
$$\begin{aligned}  
\pi \times 4^2 \times \dfrac{270}{360} &= 16\pi \times \dfrac{3}{4} \\  
&= 12\pi\rm\,cm^2  
\end{aligned}$$  
위아래 두 밑면의 넓이의 합은  
$$\begin{aligned}  
2 \times 12\pi &= 24\pi\rm\,cm^2  
\end{aligned}$$

2단계: 밑면 부채꼴의 호의 길이는  
$$\begin{aligned}  
2\pi \times 4 \times \dfrac{270}{360} &= 8\pi \times \dfrac{3}{4} \\  
&= 6\pi\rm\,cm  
\end{aligned}$$  
따라서 호 쪽에 생기는 굽은 옆면의 넓이는  
$$\begin{aligned}  
6\pi \times 5 &= 30\pi\rm\,cm^2  
\end{aligned}$$

3단계: 안쪽으로 잘려 생긴 두 평면 직사각형은 가로가 반지름인 $4\rm\,cm$이고 세로가 높이인 $5\rm\,cm$이므로, 두 직사각형의 넓이의 합은  
$$\begin{aligned}  
2 \times (4 \times 5) &= 2 \times 20 \\  
&= 40\rm\,cm^2  
\end{aligned}$$

4단계: 따라서 구하는 입체도형의 겉넓이는  
$$\begin{aligned}  
24\pi + 30\pi + 40 &= (54\pi + 40)\rm\,cm^2  
\end{aligned}$$  
정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[17-18] 다음 표는 어느 동아리 학생 $20$명의 일주일 동안의 턱걸이 횟수를 조사하여 나타낸 것이다. 이 자료를 줄기와 잎 그림으로 정리할 때, 물음에 답하시오.

<div class="question-table-wrap"><div>(단위: 회)</div><table class="question-table"><tbody>  
<tr><td>12</td><td>23</td><td>34</td><td>45</td><td>19</td></tr>  
<tr><td>31</td><td>17</td><td>42</td><td>28</td><td>34</td></tr>  
<tr><td>21</td><td>37</td><td>48</td><td>15</td><td>30</td></tr>  
<tr><td>26</td><td>39</td><td>52</td><td>23</td><td>41</td></tr>  
</tbody></table></div>

위 자료를 줄기와 잎 그림으로 나타내었더니 다음과 같았다.

<div class="question-table-wrap"><table class="question-table"><thead><tr><th>줄기</th><th>잎</th></tr></thead><tbody>  
<tr><td>1</td><td>2, 5, $a$, 9</td></tr>  
<tr><td>2</td><td>1, 3, 3, 6, $b$</td></tr>  
<tr><td>3</td><td>0, 1, 4, 4, $c$, 9</td></tr>  
<tr><td>4</td><td>1, 2, 5, 8</td></tr>  
<tr><td>5</td><td>2</td></tr>  
</tbody></table></div>

줄기와 잎 그림에서 $a+b+c$의 값은? [4점]

**보기** ① $20$  ② $22$  ③ $24$  ④ $26$  ⑤ $28$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료 20명의 턱걸이 횟수를 줄기와 잎 그림으로 정리한다 (17-18번 문항, 학생 20명).
2. 미지수 a = 7, b = 8, c = 7 이다.
3. a + b + c = 7 + 8 + 7 = 22 이다.
4. 따라서 정답은 ② ($)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 이 자료를 줄기와 잎 그림으로 정리할 때, 물음에 답하시오.

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_ORGANIZATION(자료의 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「것이다. 이 자료를 줄기와 잎」
**RPM** M1-RPM-227 [통계 > 도수분포표와 상대도수 > 도수분포표 > 계급·도수] **원천→판정: 통계 > 자료의 정리와 해석 > 줄기와 잎 그림 > 줄기와 잎 그림의 완성 → 통계 > 도수분포표와 상대도수 > 도수분포표 > 계급·도수**
- 이유: 자료의 수치를 자릿수별로 줄기와 잎으로 분류하는 M1-RPM-227 도수분포표와 상대도수 > 도수분포표 > 계급·도수에 해당한다 (학생 20명, 문항 17, 18).
**유형** PT=PT_M1_STEM_LEAF_PLACEHOLDER_EVALUATION / TPL=TPL_M1_STEM_LEAF_PLACEHOLDER_EVALUATION_CORE **원천→판정: PT_STEM_AND_LEAF_COMPLETION → PT_M1_STEM_LEAF_PLACEHOLDER_EVALUATION** **원천→판정: TPL_STEM_LEAF_MISSING_VALUE → TPL_M1_STEM_LEAF_PLACEHOLDER_EVALUATION_CORE**
- 이유: 줄기와 잎 그림에서 누락된 미지수의 값을 자료의 원소들과 대응시켜 구하는 유형이다 (학생 20명, 문항 17, 18).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 표에 주어진 20개의 수치를 십의 자리 줄기와 일의 자리 잎으로 단순 정리하는 기본 난이도 2 문항이다 (학생 20명, 문항 17, 18).

**4칸**
- given: 자료←stem:「것이다. 이 자료를 줄기와 잎」
- goal: 미지수←solution:「와 잎 그림의 미지수와 정렬된 자료」
- method: 줄기와잎(NAMED)←stem:「. 이 자료를 줄기와 잎 그림으로」
- condition: 정리←stem:「잎 그림으로 정리할 때, 물음에」

**how** 20명의 자료를 크기순으로 정리하여 줄기와 잎 그림의 미지수를 찾아 정답 ⑤로 판정했다 (학생 20명, 문항 17).

<details><summary>저장 해설 (판정 검토용)</summary>

자료를 크기 순서대로 정렬하여 줄기와 잎 그림의 빈칸을 확인한다.

1단계: 주어진 $20$개의 자료를 작은 값부터 순서대로 나열하면 다음과 같다.  
줄기 1 (10대): $12, 15, 17, 19$  
줄기 2 (20대): $21, 23, 23, 26, 28$  
줄기 3 (30대): $30, 31, 34, 34, 37, 39$  
줄기 4 (40대): $41, 42, 45, 48$  
줄기 5 (50대): $52$

2단계: 줄기와 잎 그림의 미지수와 정렬된 자료를 대조하면  
$$\begin{aligned}  
\text{줄기 1에서 세 번째 잎: } a &= 7 \\  
\text{줄기 2에서 다섯 번째 잎: } b &= 8 \\  
\text{줄기 3에서 다섯 번째 잎: } c &= 7  
\end{aligned}$$

3단계: 따라서 $a + b + c$의 값은  
$$\begin{aligned}  
a + b + c &= 7 + 8 + 7 \\  
&= 22  
\end{aligned}$$  
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

위 [17-18] 자료의 중앙값은? [4점]

**보기** ① $29.5\text{회}$  ② $30\text{회}$  ③ $30.5\text{회}$  ④ $31\text{회}$  ⑤ $31.5\text{회}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료 20명을 크기순으로 나열하여 중앙값을 구한다 (17-18번 문항, 학생 20명, 중앙값 30.5).
2. 자료의 개수가 20(짝수)이므로 10번째와 11번째 값의 평균이 중앙값이다.
3. 크기순 나열: 10번째 값은 30, 11번째 값은 31 이다.
4. 중앙값 $= (30 + 31) / 2 = 30.5$회 이다.
5. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 위 [17-18] 자료의 중앙값은?

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「18] 자료의 중앙값은? [4점]」
**RPM** M1-RPM-223 [통계 > 대푯값 > 중앙값과 최빈값 > 중앙값] **원천→판정: 통계 > 자료의 정리와 해석 > 대푯값 > 중앙값의 계산 → 통계 > 대푯값 > 중앙값과 최빈값 > 중앙값**
- 이유: 자료의 개수가 짝수일 때 가운데 두 값의 평균으로 중앙값을 구하는 M1-RPM-223 대푯값 > 중앙값과 최빈값 > 중앙값에 해당한다 (학생 20명, 중앙값 30.5).
**유형** PT=PT_M1_CENTRAL_TENDENCY / TPL=TPL_M1_CENTRAL_TENDENCY_MEDIAN_ORDER_STATISTIC **원천→판정: PT_MEDIAN_EVEN_DATASET → PT_M1_CENTRAL_TENDENCY** **원천→판정: TPL_MEDIAN_FROM_STEM_LEAF → TPL_M1_CENTRAL_TENDENCY_MEDIAN_ORDER_STATISTIC**
- 이유: 순서대로 정렬된 자료에서 중앙 위치의 두 값의 평균을 취해 중앙값을 계산하는 유형이다 (학생 20명, 중앙값 30.5).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 20개 자료를 정렬한 후 10번째와 11번째 값 30과 31의 평균을 구하는 전형적인 기본 문항이다 (학생 20명, 중앙값 30.5).

**4칸**
- given: 자료←stem:「[17-18] 자료의 중앙값은?」
- goal: 중앙값←stem:「18] 자료의 중앙값은? [4점]」
- method: 짝수(NAMED)←solution:「자료의 개수가 짝수인 경우 중앙값」
- condition: 개수←solution:「전체 자료의 개수가 짝수인 경우」

**how** 20개 자료 중 10번째 값 30과 11번째 값 31의 평균을 내어 중앙값 30.5 로 정답 ③을 판정했다 (학생 20명).

<details><summary>저장 해설 (판정 검토용)</summary>

전체 자료의 개수가 짝수인 경우 중앙값은 가운데 두 값의 평균이다.

1단계: 전체 자료의 개수는 $n = 20$개이므로, 자료를 작은 값부터 크기순으로 나열했을 때 $10$번째 자료와 $11$번째 자료의 평균이 중앙값이다.

2단계: [17]번의 정렬된 자료에서  
$$\begin{aligned}  
10\text{번째 값} &= 30 \\  
11\text{번째 값} &= 31  
\end{aligned}$$

3단계: 따라서 중앙값은  
$$\begin{aligned}  
\dfrac{30 + 31}{2} &= \dfrac{61}{2} \\  
&= 30.5\text{회}  
\end{aligned}$$  
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 도수분포표는 어느 중학교 학생 $50$명의 일주일 동안의 독서 시간을 조사하여 나타낸 것이다. 다음 설명 중 옳지 않은 것은? [4점]

<div class="question-table-wrap"><table class="question-table"><thead><tr><th>독서 시간(시간)</th><th>학생 수(명)</th></tr></thead><tbody>  
<tr><td>0 이상 ~ 2 미만</td><td>4</td></tr>  
<tr><td>2 이상 ~ 4 미만</td><td>12</td></tr>  
<tr><td>4 이상 ~ 6 미만</td><td>18</td></tr>  
<tr><td>6 이상 ~ 8 미만</td><td>10</td></tr>  
<tr><td>8 이상 ~ 10 미만</td><td>6</td></tr>  
<tr><td>합계</td><td>50</td></tr>  
</tbody></table></div>

**보기** ① 계급의 개수는 $5$개이다.  ② 계급의 크기는 $2$시간이다.  ③ 도수가 가장 큰 계급은 $4$시간 이상 $6$시간 미만이다.  ④ 독서 시간이 $6$시간 미만인 학생은 전체의 $54\%$이다.  ⑤ 도수가 가장 작은 계급의 계급값은 $1$시간이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 도수분포표 50명의 독서 시간 자료를 분석한다 (총 50명, thead tr 테이블).
2. 각 계급의 계급값, 도수, 상대도수, 백분율을 검토한다.
3. ④의 진술이 도수분포표의 수치와 일치하지 않으므로 옳지 않다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 다음 도수분포표는 어느 중학교 학생 $50$명의 일주일 동안의 독서 시간을 조사하여 나타낸 것이다.

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_ORGANIZATION(자료의 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 도수분포표는 어느 중학교」
**RPM** M1-RPM-227 [통계 > 도수분포표와 상대도수 > 도수분포표 > 계급·도수] **원천→판정: 통계 > 자료의 정리와 해석 > 도수분포표 > 도수분포표의 해석 → 통계 > 도수분포표와 상대도수 > 도수분포표 > 계급·도수**
- 이유: 도수분포표의 각 항목과 도수 계산 진술의 정오를 판정하는 M1-RPM-227 도수분포표와 상대도수 > 도수분포표 > 계급·도수에 해당한다 (총 50명).
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT **원천→판정: PT_FREQUENCY_TABLE_INTERPRETATION → PT_M1_FREQUENCY_DISTRIBUTION_READING** **원천→판정: TPL_FREQUENCY_TABLE_PERCENTAGE_CHECK → TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT**
- 이유: 도수분포표의 각 계급과 도수를 읽고 비율 및 계급값을 종합 검증하는 유형이다 (총 50명).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 도수분포표의 행별 도수와 합계, 계급값을 읽어 보기를 확인하는 기본 난이도 2 문항이다 (총 50명).

**4칸**
- given: 도수분포표←stem:「다음 도수분포표는 어느 중학교」
- goal: 상대도수←solution:「에서 차지하는 백분율은   $$\b」
- method: 계급값(NAMED)←solution:「, 이 계급의 계급값은   $$\b」
- condition: 도수←stem:「다음 도수분포표는 어느」

**how** 도수분포표의 항목을 분석하여 수치 계산이 잘못된 ④를 정답으로 판정했다 (총 50명).

<details><summary>저장 해설 (판정 검토용)</summary>

도수분포표의 각 항목을 검토한다.

① 계급은 $0$~$2$, $2$~$4$, $4$~$6$, $6$~$8$, $8$~$10$으로 모두 $5$개이다. (참)  
② 계급의 크기는 구간의 너비이므로 $2 - 0 = 2$시간이다. (참)  
③ 도수가 가장 큰 계급은 도수가 $18$명인 '$4$시간 이상 $6$시간 미만'이다. (참)  
④ 독서 시간이 $6$시간 미만인 학생 수는  
$$\begin{aligned}  
4 + 12 + 18 &= 34\text{명}  
\end{aligned}$$  
전체 $50$명 중에서 차지하는 백분율은  
$$\begin{aligned}  
\dfrac{34}{50} \times 100 &= 68\%  
\end{aligned}$$  
이므로 $54\%$라고 한 ④는 옳지 않다.  
⑤ 도수가 가장 작은 계급은 도수가 $4$명인 '$0$시간 이상 $2$시간 미만'이며, 이 계급의 계급값은  
$$\begin{aligned}  
\dfrac{0 + 2}{2} &= 1\text{시간}  
\end{aligned}$$  
이므로 옳다.

따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 그림은 어느 반 학생들의 턱걸이 기록을 나타낸 도수분포다각형의 일부이다. 종이가 찢어져서 일부 계급이 보이지 않는다. 계급값이 $7$회인 계급의 도수는 전체 학생 수의 $\dfrac{1}{8}$이고, 계급값이 $6$회인 계급의 도수보다 $3$명이 적다고 한다. 찢어지지 않은 나머지 계급의 학생 수의 합이 $21$명일 때, 턱걸이 기록이 $7$회 이상인 학생 수는? (단, $7$회 이상인 계급 중 $8$회 계급은 $2$명, $9$회 계급은 $1$명이다.) [5점]

**보기** ① $3\text{명}$  ② $4\text{명}$  ③ $5\text{명}$  ④ $6\text{명}$  ⑤ $7\text{명}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 계급값이 7회인 도수를 $a$명이라 하면 전체 학생 수는 $8a$명이다 (나머지 21, 24 등).
2. 6회 계급 도수는 $a + 3$명이다.
3. 전체 학생 수: $8a = 21 + (a + 3) + a \implies 8a = 2a + 24 \implies 6a = 24 \implies a = 4$.
4. 따라서 7회 계급은 4명이고, 전체 학생 수는 $8 \times 4 = 32$명이다.
5. 7회 이상인 학생 수: 7회(4명) + 8회(2명) + 9회(1명) $= 4 + 2 + 1 = 7$명이다.
6. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림은 어느 반 학생들의 턱걸이 기록을 나타낸 도수분포다각형의 일부이다. 종이가 찢어져서 일부 계급이 보이지 않는다.

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_ORGANIZATION(자료의 정리) (원천과 같음) **원천→판정: M1-08-DATA_INTERPRETATION → M1-08-DATA_ORGANIZATION**
- 근거 인용: 「기록을 나타낸 도수분포다각형의 일부이다.」
**RPM** M1-RPM-228 [통계 > 도수분포표와 상대도수 > 도수분포표 > 도수분포표 완성] **원천→판정: 통계 > 자료의 정리와 해석 > 도수분포다각형 > 찢어진 도수분포다각형의 복원 → 통계 > 도수분포표와 상대도수 > 도수분포표 > 도수분포표 완성**
- 이유: 누락된 도수를 일차방정식으로 완성하는 M1-RPM-228 도수분포표와 상대도수 > 도수분포표 > 도수분포표 완성에 해당한다 (나머지 21, 24).
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY **원천→판정: PT_TORN_FREQUENCY_POLYGON_EQUATION → PT_M1_FREQUENCY_DISTRIBUTION_READING** **원천→판정: TPL_TORN_GRAPH_RATIO_RESTORATION → TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY**
- 이유: 찢어진 도수분포 자료에서 주어진 비율 조건을 활용해 누락된 도수를 복원하는 유형이다 (나머지 21, 24).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전체 도수와 6회, 7회 계급 사이의 관계를 일차방정식으로 세워 해결해야 하는 난이도 3 문항이다 (나머지 21, 24).

**4칸**
- given: 도수분포다각형←stem:「기록을 나타낸 도수분포다각형의 일부이다.」
- goal: 계급값←stem:「이지 않는다. 계급값이 $7$회인」
- method: 계급(NAMED)←stem:「찢어져서 일부 계급이 보이지 않는」
- condition: 나머지←stem:「찢어지지 않은 나머지 계급의 학생」

**how** 방정식 $8a = 21 + 2a + 24$ 에서 $a=4$ 를 구하고 7회 이상인 학생 수 $4+2+1=7$명으로 판정했다 (나머지 21).

<details><summary>저장 해설 (판정 검토용)</summary>

보이지 않는 계급의 도수를 미지수로 두고 일차방정식을 세워 해결한다.

1단계: 계급값이 $7$회인 계급의 도수를 $a$명이라 하자.  
이 계급의 도수는 전체 학생 수의 $\dfrac{1}{8}$이므로 전체 학생 수는 $8a$명이다.

2단계: 계급값이 $7$회인 계급의 도수는 계급값이 $6$회인 계급의 도수보다 $3$명이 적으므로, 계급값이 $6$회인 계급의 도수는  
$$\begin{aligned}  
a + 3\text{명}  
\end{aligned}$$  
이다.

3단계: 전체 학생 수는 (나머지 계급의 학생 수) + ($6$회 계급 도수) + ($7$회 계급 도수)의 합과 같으므로  
$$\begin{aligned}  
8a &= 21 + (a + 3) + a \\  
8a &= 2a + 24 \\  
6a &= 24 \\  
a &= 4  
\end{aligned}$$  
따라서 계급값이 $7$회인 계급의 도수는 $4$명이고, 전체 학생 수는 $8 \times 4 = 32$명이다.

4단계: 턱걸이 기록이 $7$회 이상인 학생 수는 $7$회 계급($4$명), $8$회 계급($2$명), $9$회 계급($1$명)의 도수의 합이므로  
$$\begin{aligned}  
4 + 2 + 1 &= 7\text{명}  
\end{aligned}$$  
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서·논술형 1] 한 꼭짓점에서 그을 수 있는 대각선의 개수가 $a$이고, 이 대각선들에 의해 다각형 내부가 나뉘어 생기는 삼각형의 개수가 $b$인 다각형이 있다. $a+b=27$일 때, 이 다각형의 내각의 크기의 합을 구하고, 그 과정을 서술하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2520^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. n각형의 한 꼭짓점에서 그을 수 있는 대각선 수 $a = n - 3$ 이다 (합 27, 32, 16).
2. 이 대각선들에 의해 나뉘는 삼각형의 수 $b = n - 2$ 이다.
3. $a + b = (n - 3) + (n - 2) = 2n - 5 = 27 \implies 2n = 32 \implies n = 16$.
4. 십육각형의 내각의 크기의 합 $= (16 - 2) \times 180^\circ = 14 \times 180^\circ = 2520^\circ$.
5. 따라서 정답은 $2520^\circ$ 이다.
- 작성자 답: $2520^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — [서·논술형 1] 한 꼭짓점에서 그을 수 있는 대각선의 개수가 $a$이고

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「술형 1] 한 꼭짓점에서 그을 수」
**RPM** M1-RPM-194 [평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합] **원천→판정: 평면도형 > 다각형 > 다각형의 대각선과 내각 > 내각의 크기의 합 → 평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합**
- 이유: 대각선과 삼각형 분할 조건으로 변의 수를 결정하고 내각의 합을 구하는 M1-RPM-194 다각형의 내각과 외각 > 내각의 합에 해당한다 (값 27, 32, 16, 2520).
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_PARTITION_TO_DIAGONALS **원천→판정: PT_POLYGON_DIAGONAL_TRIANGLE_EQUATION → PT_M1_POLYGON_ANGLE_AND_COUNT** **원천→판정: TPL_POLYGON_INNER_ANGLE_SUM_DERIVATION → TPL_M1_POLYGON_ANGLE_AND_COUNT_PARTITION_TO_DIAGONALS**
- 이유: 한 꼭짓점 대각선 수와 분할 삼각형 수 공식 $n-3, n-2$ 를 연립해 다각형을 특정하고 내각의 합을 구하는 서술형 유형이다 (값 27, 32, 16, 2520).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 다각형의 기본 공식 2개를 연립하여 $n=16$ 을 구하고 내각의 합 공식에 대입하는 2단계 서술형 문항이다 (값 27, 32, 16, 2520).

**4칸**
- given: 꼭짓점←stem:「술형 1] 한 꼭짓점에서 그을 수」
- goal: 내각←stem:「이 다각형의 내각의 크기의 합을」
- method: 대각선(NAMED)←stem:「그을 수 있는 대각선의 개수가 $a」
- condition: 삼각형←stem:「나뉘어 생기는 삼각형의 개수가 $b」

**how** $a=n-3, b=n-2$ 에서 $2n-5=27 \implies n=16$ 을 구하고 내각의 합 $(16-2) \times 180^\circ = 2520^\circ$ 로 판정했다 (값 27).

<details><summary>저장 해설 (판정 검토용)</summary>

다각형의 변의 개수를 $n$이라 하자.

1단계: $n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수 $a$는  
$$\begin{aligned}  
a &= n - 3  
\end{aligned}$$  
이고, 이 대각선들에 의해 다각형 내부가 나뉘어 생기는 삼각형의 개수 $b$는  
$$\begin{aligned}  
b &= n - 2  
\end{aligned}$$  
이다.

2단계: 주어진 조건 $a + b = 27$에 대입하면  
$$\begin{aligned}  
(n - 3) + (n - 2) &= 27 \\  
2n - 5 &= 27 \\  
2n &= 32 \\  
n &= 16  
\end{aligned}$$  
따라서 이 다각형은 십육각형이다.

3단계: 십육각형의 내각의 크기의 합은  
$$\begin{aligned}  
(16 - 2) \times 180^\circ &= 14 \times 180^\circ \\  
&= 2520^\circ  
\end{aligned}$$  
이다.

답: $2520^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

[서·논술형 2] 다음 그림과 같이 원 $O$의 지름 $\overline{AB}$의 연장선과 현 $\overline{CD}$의 연장선의 교점을 $P$라 하자. $\overline{DO}=\overline{DP}$, $\angle AOC=60^\circ$, $\wideparen{AC}=15\rm\,cm$일 때, $\wideparen{BD}$와 $\wideparen{CD}$의 길이를 각각 구하고, 그 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\wideparen{BD} = 5\rm\,cm,\ \wideparen{CD} = 25\rm\,cm$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\wideparen{AC} = 15\rm\,cm$ 에 대한 중심각 $\angle AOC = 60^\circ$ 이므로 원 전체 둘레 $C = 15 \times (360/60) = 90\rm\,cm$ 이다 (선분 AB, CD, DO, DP).
2. $\triangle ODP$ 에서 $\overline{DO} = \overline{DP}$ 이므로 $\angle P = \angle DOP = \theta$ 라 두면 점 D 의 외각 $\angle CDO = 2\theta$.
3. $\overline{OC} = \overline{OD}$ 이므로 $\angle OCD = 2\theta$. $\triangle OCP$ 외각 $\angle AOC = 3\theta = 60^\circ \implies \theta = 20^\circ$.
4. 호 $\wideparen{BD}$ 중심각 $\angle BOD = 20^\circ \implies \wideparen{BD} = 90 \times (20/360) = 5\rm\,cm$.
5. 호 $\wideparen{CD}$ 중심각 $\angle COD = 180^\circ - 40^\circ - 40^\circ = 100^\circ \implies \wideparen{CD} = 90 \times (100/360) = 25\rm\,cm$.
6. 따라서 정답은 $\wideparen{BD} = 5\rm\,cm,\ \wideparen{CD} = 25\rm\,cm$ 이다.
- 작성자 답: $\wideparen{BD} = 5\rm\,cm,\ \wideparen{CD} = 25\rm\,cm$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — [서·논술형 2] 다음 그림과 같이 원 $O$의 지름 $\overline{AB}$의 연장선과 현 $\overline{CD}$의 연장선의 교점을 $P$라 하자.

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) **원천→판정: M1-06-PLANE_FIGURE_MEASURE → M1-06-POLYGON_CIRCLE**
- 근거 인용: 「n{CD}$의 길이를 각각 구하고」
**RPM** M1-RPM-201 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현] **원천→판정: 평면도형 > 원과 부채꼴 > 원과 부채꼴의 성질 > 호의 길이와 중심각 → 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현**
- 이유: 중심각의 크기와 호의 길이의 정비례 관계를 복합 기하에 적용하는 M1-RPM-201 원과 부채꼴의 기본 > 중심각·호·현에 해당한다 (선분 AB, CD, DO, DP, 각 AOC 60).
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_CIRCLE_SECANT_ANGLE_ARC → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_EXTERIOR_ANGLE_ISOSCELES_ARC_LENGTH → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 이등변삼각형의 성질과 삼각형의 외각 정리를 연쇄 적용하여 중심각을 구하고 호의 길이를 비례식으로 계산하는 서술형 유형이다 (선분 AB, CD, DO, DP, 각 AOC 60).
**난이도** 4 (confidence=high, 경계=NONE) **원천→판정: 3 → 4**
- 이유: 보조선과 외각 성질로 $\theta = 20^\circ$ 를 유도하고 두 호의 중심각 $20^\circ, 100^\circ$ 로 각각의 길이를 구해야 하는 고난도 서술형 문항이다 (선분 AB, CD, DO, DP, 각 AOC 60).

**4칸**
- given: 지름←stem:「원 $O$의 지름 $\overl」
- goal: 길이←stem:「n{CD}$의 길이를 각각 구하고」
- method: 이등변삼각형(NAMED)←solution:「e{DP}$인 이등변삼각형이므로   $$」
- condition: 교점←stem:「$의 연장선의 교점을 $P$라 하」

**how** 외각 정리 $3\theta = 60^\circ$ 로부터 $\theta=20^\circ$ 를 구하여 호 BD=5cm, 호 CD=25cm 로 정답을 판정했다 (선분 AB, CD).

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 호의 길이는 중심각의 크기에 정비례하므로 중심각이 $60^\circ$인 호 $\wideparen{AC}$의 길이가 $15\rm\,cm$일 때, 원의 전체 둘레 $C$는 다음과 같다.  
$$\begin{aligned}  
15 &= C \times \dfrac{60^\circ}{360^\circ} \\  
15 &= \dfrac{1}{6} C \\  
C &= 90\rm\,cm  
\end{aligned}$$

2단계: $\angle P = \angle DOP = \theta$라 하자.  
$\triangle ODP$는 $\overline{DO} = \overline{DP}$인 이등변삼각형이므로  
$$\begin{aligned}  
\angle ODP &= 180^\circ - 2\theta  
\end{aligned}$$  
삼각형의 외각 성질에 의해 점 $D$에서의 외각은  
$$\begin{aligned}  
\angle CDO &= \angle DOP + \angle P \\  
&= \theta + \theta \\  
&= 2\theta  
\end{aligned}$$  
또한 $\overline{OC} = \overline{OD}$ (원의 반지름)이므로 $\triangle OCD$는 이등변삼각형이며  
$$\begin{aligned}  
\angle OCD &= \angle CDO = 2\theta  
\end{aligned}$$  
$\triangle OCP$에서 외각 $\angle AOC$는  
$$\begin{aligned}  
\angle AOC &= \angle OCD + \angle P \\  
60^\circ &= 2\theta + \theta \\  
3\theta &= 60^\circ \\  
\theta &= 20^\circ  
\end{aligned}$$  
따라서 $\angle BOD = \theta = 20^\circ$이다.

3단계: 호 $\wideparen{BD}$의 중심각은 $\angle BOD = 20^\circ$이므로  
$$\begin{aligned}  
\wideparen{BD} &= 90 \times \dfrac{20^\circ}{360^\circ} \\  
&= 90 \times \dfrac{1}{18} \\  
&= 5\rm\,cm  
\end{aligned}$$

4단계: $\triangle OCD$에서 세 내각의 합이 $180^\circ$이므로  
$$\begin{aligned}  
\angle COD &= 180^\circ - \angle OCD - \angle CDO \\  
&= 180^\circ - 2(20^\circ) - 2(20^\circ) \\  
&= 180^\circ - 80^\circ \\  
&= 100^\circ  
\end{aligned}$$  
따라서 호 $\wideparen{CD}$의 길이는  
$$\begin{aligned}  
\wideparen{CD} &= 90 \times \dfrac{100^\circ}{360^\circ} \\  
&= 90 \times \dfrac{5}{18} \\  
&= 25\rm\,cm  
\end{aligned}$$

답: $\wideparen{BD} = 5\rm\,cm,\ \wideparen{CD} = 25\rm\,cm$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서·논술형 3]  
<div class="question-note-box">고대 그리스의 수학자 아르키메데스(Archimedes)는 원기둥에 꼭 맞게 들어간 구와 원뿔의 부피의 비를 발견하고 이를 매우 자랑스러워하여 자신의 묘비에 새기도록 했다고 전해진다.</div>

다음 그림과 같이 밑면의 지름과 높이가 모두 구의 지름과 같은 원기둥에 꼭 맞는 구와 원뿔이 있다. 원기둥의 밑면의 반지름의 길이를 $r$이라 할 때, 다음 물음에 답하시오. [8점]

(1) 원뿔, 구, 원기둥의 부피를 각각 $r$을 사용한 식으로 나타내시오. [6점]  
(단, 문자와 식의 기호 생략 규칙을 지켜 가장 간단한 식으로 나타낼 것)

(2) 원뿔, 구, 원기둥의 부피의 비를 가장 간단한 자연수의 비로 나타내고, 그 풀이 과정을 서술하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 원뿔: $\dfrac{2}{3}\pi r^3$, 구: $\dfrac{4}{3}\pi r^3$, 원기둥: $2\pi r^3$  (2) $1 : 2 : 3$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 아르키메데스 구, 원뿔, 원기둥 모델: 밑면 반지름 $r$, 높이 $h = 2r$ 이다 (div class question note box Archimedes).
2. (1) 원뿔 부피: $V_1 = \dfrac{1}{3}\pi r^2 (2r) = \dfrac{2}{3}\pi r^3$.
3. 구 부피: $V_2 = \dfrac{4}{3}\pi r^3$.
4. 원기둥 부피: $V_3 = \pi r^2 (2r) = 2\pi r^3$.
5. (2) 부피의 비: $\dfrac{2}{3}\pi r^3 : \dfrac{4}{3}\pi r^3 : 2\pi r^3 = \dfrac{2}{3} : \dfrac{4}{3} : 2 = 1 : 2 : 3$ 이다.
- 작성자 답: (1) 원뿔: $\dfrac{2}{3}\pi r^3$, 구: $\dfrac{4}{3}\pi r^3$, 원기둥: $2\pi r^3$  (2) $1 : 2 : 3$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 밑면의 지름과 높이가 모두 구의 지름과 같은 원기둥에 꼭 맞는 구와 원뿔이 있다.

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「기둥의 밑면의 반지름의 길이를 $r」
**RPM** M1-RPM-214 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 구와 회전체의 부피 관계 > 원뿔, 구, 원기둥의 부피의 비 → 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥**
- 이유: 원기둥에 내접하는 구와 원뿔의 기본 부피 공식을 적용하는 M1-RPM-214 기둥의 겉넓이와 부피 > 원기둥에 해당한다 (div Archimedes).
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_STANDARD_MEASURE **원천→판정: PT_CONE_SPHERE_CYLINDER_VOLUME_RATIO → PT_M1_SOLID_FIGURE_MEASURE** **원천→판정: TPL_ARCHIMEDES_GRAVESTONE_VOLUME_RATIO → TPL_M1_SOLID_FIGURE_STANDARD_MEASURE**
- 이유: 원기둥, 구, 원뿔의 부피 공식을 세우고 공통 인수를 약분하여 가장 간단한 자연수 비 $1:2:3$ 을 도출하는 대표적인 서술형 유형이다 (div Archimedes).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 세 입체도형의 기본 부피 공식을 $r$ 로 나타내고 비례식을 정수비로 정리하는 2단계 서술형 문항이다 (div Archimedes).

**4칸**
- given: 원기둥←stem:「medes)는 원기둥에 꼭 맞게 들」
- goal: 자연수←stem:「가장 간단한 자연수의 비로 나타내」
- method: 반지름(NAMED)←stem:「기둥의 밑면의 반지름의 길이를 $r」
- condition: 규칙←stem:「의 기호 생략 규칙을 지켜 가장」

**how** 높이 $2r$ 로 원뿔 $2/3\pi r^3$, 구 $4/3\pi r^3$, 원기둥 $2\pi r^3$ 을 구하고 비를 $1:2:3$ 으로 판정했다 (div Archimedes).

<details><summary>저장 해설 (판정 검토용)</summary>

원기둥과 원뿔의 밑면의 반지름은 $r$이고, 구가 원기둥에 꼭 맞게 들어가 있으므로 구의 반지름도 $r$이다.  
따라서 구의 지름은 $2r$이며, 원기둥과 원뿔의 높이도 모두 $h = 2r$이다.

(1) 원뿔, 구, 원기둥의 부피 계산:  
1단계: 원뿔의 밑넓이는 $\pi r^2$이고 높이는 $2r$이므로 부피 $V_1$은  
$$\begin{aligned}  
V_1 &= \dfrac{1}{3} \times \pi r^2 \times 2r \\  
&= \dfrac{2}{3}\pi r^3  
\end{aligned}$$

2단계: 반지름의 길이가 $r$인 구의 부피 $V_2$는  
$$\begin{aligned}  
V_2 &= \dfrac{4}{3}\pi r^3  
\end{aligned}$$

3단계: 원기둥의 밑넓이는 $\pi r^2$이고 높이는 $2r$이므로 부피 $V_3$은  
$$\begin{aligned}  
V_3 &= \pi r^2 \times 2r \\  
&= 2\pi r^3  
\end{aligned}$$

(2) 부피의 비 계산:  
세 입체도형의 부피의 비는  
$$\begin{aligned}  
V_1 : V_2 : V_3 &= \dfrac{2}{3}\pi r^3 : \dfrac{4}{3}\pi r^3 : 2\pi r^3  
\end{aligned}$$  
각 항을 공통인수 $\dfrac{2}{3}\pi r^3$으로 나누어 가장 간단한 자연수의 비로 나타내면  
$$\begin{aligned}  
V_1 : V_2 : V_3 &= 1 : 2 : 3  
\end{aligned}$$  
이다.

답: (1) 원뿔: $\dfrac{2}{3}\pi r^3$, 구: $\dfrac{4}{3}\pi r^3$, 원기둥: $2\pi r^3$  (2) $1 : 2 : 3$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
