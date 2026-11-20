# 검수 묶음 — 24_금당중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 25개 / 검사 PASS 22, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 25
- 난이도 분포: 1단계 5, 2단계 15, 3단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (소단원, 난이도)
- **Q5**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q6**: 원천 값과 다른 칸 2개 (소단원, RPM) / 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q7**: 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q11**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q16**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q18**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q19**: 검사 코드: CHOICE_ORDER
- **Q23**: 원천 값과 다른 칸 2개 (소단원, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B23)

---
## Q1 — 객관식 3점


**발문**

$\triangle ABC \sim \triangle DEF$이고 닮음비가 $2 : 1$이다. $\overline{BC} = 18\text{ cm}$, $\overline{CA} = 16\text{ cm}$, $\overline{DE} = 7\text{ cm}$일 때, $\triangle DEF$의 둘레의 길이는?

**보기** ① $21\text{ cm}$  ② $22\text{ cm}$  ③ $24\text{ cm}$  ④ $26\text{ cm}$  ⑤ $28\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABC \sim \triangle DEF$이고 닮음비가 2 : 1이다.
2. $\overline{EF} = 18 \times (1/2) = 9\text{ cm}$, $\overline{DF} = 16 \times (1/2) = 8\text{ cm}$이다. (ABC)
3. 따라서 둘레는 $7 + 9 + 8 = 24\text{ cm}$이다. (ABC)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC」
**RPM** M2-RPM-084 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] (원천과 같음)
- 이유: 도형의 닮음 단원의 닮은 도형의 성질 기본 유형이다. (ABC)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE
- 이유: 닮은 도형의 둘레의 비와 변의 길이 계산 기본 유형이다. (ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮음비를 활용해 대응변의 길이를 구하고 둘레를 합산하는 난이도 1 문항이다. (ABC)

**4칸**
- given: 닮음비←stem:「닮음비가 $2 : 1$이다.」
- goal: 선분←stem:「$\triangle DEF$의 둘레의 길이는?」
- method: 선분(NAMED)←solution:「닮음비가 $2 : 1$이므로」
- condition: (없음)

**how** 닮음비 2:1을 이용하여 DEF의 각 변의 길이를 구하고 둘레 24cm를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$와 $\triangle DEF$의 닮음비가 $2 : 1$이므로 $\overline{EF} = \dfrac{1}{2}\overline{BC} = \dfrac{1}{2} \times 18 = 9\text{ cm}$ $\overline{DF} = \dfrac{1}{2}\overline{CA} = \dfrac{1}{2} \times 16 = 8\text{ cm}$ $\therefore (\triangle DEF\text{의 둘레}) = 7 + 9 + 8 = 24\text{ (cm)}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 항상 닮은 도형이라고 할 수 없는 것은?

**보기** ① 반지름의 길이가 다른 두 원  ② 한 내각의 크기가 같은 두 이등변삼각형  ③ 중심각의 크기가 같은 두 부채꼴  ④ 한 예각의 크기가 같은 두 직각삼각형  ⑤ 한 모서리의 길이가 다른 두 정사면체

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원, 중심각이 같은 부채꼴, 직각이등변삼각형, 정사면체 등은 항상 닮은 도형이다. (70)
2. 그러나 두 이등변삼각형은 한 각이 $40^\circ$일 때 꼭짓각과 밑각의 차이로 세 내각이 다를 수 있다. (70)
3. 따라서 항상 닮은 도형이라 할 수 없는 것은 ②이다. (70)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 항상 닮은 도형이라」
**RPM** M2-RPM-085 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각] (원천과 같음)
- 이유: 도형의 닮음 단원의 항상 닮은 도형 판별 유형으로 $40^\circ$ 반례를 다룬다. (70)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE
- 이유: 도형의 닮음 정의와 $40^\circ$ 반례를 판별하는 객관식 기본 유형이다. (70)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 항상 닮은 도형의 성질과 $40^\circ$ 내각 반례를 확인하는 난이도 1 문항이다. (70)

**4칸**
- given: 이등변삼각형←choices:「한 내각의 크기가 같은 두 이등변삼각형」
- goal: 닮음←stem:「항상 닮은 도형이라고 할 수 없는 것은?」
- method: 닮음(NAMED)←solution:「항상 닮은 도형이 아니다」
- condition: (없음)

**how** 한 내각이 $40^\circ$인 두 이등변삼각형의 반례를 통해 닮음 여부를 판별했다. (70)

<details><summary>저장 해설 (판정 검토용)</summary>

② 두 이등변삼각형에서 한 내각이 ^\circ 때 하나는 꼭짓각(^\circ, 70^\circ, 70^\circ$)이고 다른 하나는 밑각(^\circ, 40^\circ, 40^\circ$)이면 세 각이 다를 수 있으므로 항상 닮은 도형이 아니다. ①, ③, ④, ⑤는 모두 항상 닮은 도형이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)

**발문**

$\triangle ABC$에서 점 $M$은 변 $AB$의 중점이고, 점 $M$을 지나고 변 $BC$에 평행한 직선이 변 $AC$와 만나는 점을 $N$이라 하자. $\overline{AB} = 9\text{ cm}$, $\overline{BC} = 13\text{ cm}$, $\overline{AM} = x\text{ cm}$, $\overline{MN} = y\text{ cm}$일 때, $x + y$의 값은?

**보기** ① $11$  ② $9$  ③ $10$  ④ $12$  ⑤ $13$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $M$은 $\overline{AB}$의 중점이므로 $x = 9/2$이다. (ABC)
2. 중점연결정리에 의해 $y = 13/2$이다. (ABC)
3. 따라서 $x + y = 9/2 + 13/2 = 11$이다. (ABC)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) **원천→판정: M2-06-PARALLEL_SEGMENT_RATIO → M2-06-PARALLEL_LENGTH_RATIO**
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-091 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례] (원천과 같음)
- 이유: 평행선과 선분의 길이의 비 단원의 삼각형의 중점연결정리 유형이다. (ABC)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=NONE
- 이유: 삼각형의 중점연결정리를 이용한 선분 길이 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 중점연결정리를 이용해 두 선분의 길이를 구하고 합산하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「$\overline{AB} = 9\text{ cm}$」
- goal: 값←stem:「$x + y$의 값은?」
- method: 선분(NAMED)←solution:「삼각형의 중점연결정리에 의해」
- condition: 평행선←stem:「변 $BC$에 평행한 직선이」

**how** 중점연결정리로 x=9/2, y=13/2를 구하고 합 x+y=11을 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$M$은 $\overline{AB}$의 중점이므로 $x = \overline{AM} = \dfrac{1}{2}\overline{AB} = \dfrac{9}{2}$ 삼각형의 중점연결정리에 의해 $y = \overline{MN} = \dfrac{1}{2}\overline{BC} = \dfrac{13}{2}$ $\therefore x + y = \dfrac{9}{2} + \dfrac{13}{2} = \dfrac{22}{2} = 11$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점


**발문**

두 삼각기둥 $ABC\text{-}DEF$와 $GHI\text{-}JKL$은 서로 닮은 도형이고, 모서리 $EF$에 대응하는 모서리가 $KL$이다. $\overline{EF} = 3\text{ cm}$, $\overline{KL} = 6\text{ cm}$이고 작은 삼각기둥의 부피가 $15\text{ cm}^3$일 때, 큰 삼각기둥의 부피는?

**보기** ① $30\text{ cm}^3$  ② $60\text{ cm}^3$  ③ $90\text{ cm}^3$  ④ $120\text{ cm}^3$  ⑤ $135\text{ cm}^3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 삼각기둥의 닮음비는 $3 : 6 = 1 : 2$이다. (ABC)
2. 부피의 비는 $1^3 : 2^3 = 1 : 8$이다. (ABC)
3. 따라서 큰 삼각기둥의 부피는 $15 \times 8 = 120\text{ cm}^3$이다. (ABC)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 삼각기둥 $ABC\tex」
**RPM** M2-RPM-090 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] (원천과 같음)
- 이유: 도형의 닮음 단원의 입체도형의 부피의 비 유형이다. (ABC)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE
- 이유: 닮은 입체도형의 부피의 비 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 닮음비로부터 입체도형 부피비를 유도하고 계산하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「$\overline{EF} = 3\text{ cm}$」
- goal: 도형←stem:「큰 삼각기둥의 부피는?」
- method: 닮음비(NAMED)←solution:「두 삼각기둥의 닮음비는」
- condition: 도형←stem:「서로 닮은 도형이고」

**how** 삼각기둥의 닮음비 1:2의 세제곱 비인 1:8을 적용해 부피 120을 구했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

두 삼각기둥의 닮음비는 $\overline{EF} : \overline{KL} = 3 : 6 = 1 : 2$이다. 부피의 비는 $1^3 : 2^3 = 1 : 8$이므로 $\therefore (\text{큰 삼각기둥의 부피}) = 15 \times 8 = 120\text{ (cm}^3\text{)}$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

$\triangle ABC$에서 두 점 $D$, $E$는 각각 변 $AB$, 변 $AC$의 연장선(점 $B$, $C$의 바깥쪽) 위의 점이고 $\overline{BC} \parallel \overline{DE}$이다. $\overline{AD} = 15\text{ cm}$, $\overline{BD} = 5\text{ cm}$, $\overline{DE} = 12\text{ cm}$, $\overline{CE} = 4\text{ cm}$일 때, $\triangle ABC$의 둘레의 길이는?

**보기** ① $22\text{ cm}$  ② $23\text{ cm}$  ③ $24\text{ cm}$  ④ $25\text{ cm}$  ⑤ $26\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB} = 15 - 5 = 10\text{ cm}$이다. (ABC)
2. $\triangle ABC \sim \triangle ADE$ 닮음비 $10 : 15 = 2 : 3$이다.
3. $\overline{BC} = 8\text{ cm}$, $\overline{AC} = 8\text{ cm}$이므로 둘레는 $10 + 8 + 8 = 26\text{ cm}$이다. (ABC)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) **원천→판정: M2-06-PARALLEL_SEGMENT_RATIO → M2-06-SIMILAR_FIGURES**
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] **원천→판정: 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA**
- 이유: 도형의 닮음 단원의 삼각형의 닮음 활용 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE
- 이유: 평행선과 삼각형의 닮음비를 이용한 둘레 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 연장선상의 평행선 닮음비를 적용하여 세 변을 합산하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「$\overline{AD} = 15\text{ cm}$」
- goal: 선분←stem:「$\triangle ABC$의 둘레의 길이는?」
- method: 닮음(NAMED)←solution:「$\triangle ABC \sim \triangle ADE$」
- condition: 평행선←stem:「$\overline{BC} \parallel \overline{DE}$」

**how** 연장선 평행선 닮음비 2:3을 이용해 각 변을 구하고 둘레 26cm를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB} = \overline{AD} - \overline{BD} = 15 - 5 = 10\text{ cm}$ $\overline{BC} \parallel \overline{DE}$이므로 $\triangle ABC \sim \triangle ADE$이고 닮음비는 $\overline{AB} : \overline{AD} = 10 : 15 = 2 : 3$이다. $\overline{BC} = 12 \times \dfrac{2}{3} = 8\text{ cm}$ $\dfrac{\overline{AC}}{\overline{AC} + 4} = \dfrac{2}{3} \implies 3\overline{AC} = 2\overline{AC} + 8 \implies \overline{AC} = 8\text{ cm}$ $\therefore (\triangle ABC\text{의 둘레}) = 10 + 8 + 8 = 26\text{ (cm)}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

$\triangle ABC$에서 변 $AB$ 위의 점 $D$, 변 $AC$ 위의 두 점 $F$, $E$가 꼭짓점 $A$로부터 $A$, $F$, $E$, $C$의 순서로 놓여 있고 $\overline{DE} \parallel \overline{BC}$, $\overline{DF} \parallel \overline{BE}$이다. $\overline{AF} = 8$, $\overline{FE} = 4$일 때, $\overline{EC}$의 길이는?

**보기** ① $4$  ② $6$  ③ $8$  ④ $9$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{DF} \parallel \overline{BE}$이므로 $\overline{AD} : \overline{DB} = \overline{AF} : \overline{FE} = 8 : 4 = 2 : 1$이다. (ABC)
2. $\overline{DE} \parallel \overline{BC}$이므로 $\overline{AE} : \overline{EC} = \overline{AD} : \overline{DB} = 2 : 1$이다. (ABC)
3. $\overline{AE} = 8 + 4 = 12$이므로 $12 : \overline{EC} = 2 : 1 \implies \overline{EC} = 6$이다. (ABC)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) **원천→판정: M2-06-PARALLEL_SEGMENT_RATIO → M2-06-PARALLEL_LENGTH_RATIO**
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-093 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 평행선 사이 선분비 > 여러 평행선] **원천→판정: 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 비례 활용 > 미지 길이 → 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 평행선 사이 선분비 > 여러 평행선**
- 이유: 평행선 사이의 선분의 길이의 비 단원의 여러 평행선 사이 선분비 유형이다. ($2 : 1$) (ABC)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=NONE
- 이유: 삼각형 내부 다중 평행선 선분 비례 계산 유형이다. ($8, 4$) (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행선 두 쌍의 비례식 $2 : 1$을 연속으로 연계하여 미지 선분을 구하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「$\overline{AF} = 8$, $\overline{FE} = 4$」
- goal: 선분←stem:「$\overline{EC}$의 길이는?」
- method: 선분(NAMED)←solution:「$\overline{AD} : \overline{DB} = \overline{AF} : \overline{FE} = 8 : 4 = 2 : 1$」
- condition: 평행선←stem:「$\overline{DE} \parallel \overline{BC}$, $\overline{DF} \parallel \overline{BE}$」

**how** 이중 평행선에 따른 선분 비 $8 : 4 = 2 : 1$을 연쇄 적용하여 $\overline{EC} = 6$을 구했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{DF} \parallel \overline{BE}$이므로 $\overline{AD} : \overline{DB} = \overline{AF} : \overline{FE} = 8 : 4 = 2 : 1$ $\overline{DE} \parallel \overline{BC}$이므로 $\overline{AE} : \overline{EC} = \overline{AD} : \overline{DB} = 2 : 1$ $\overline{AE} = 8 + 4 = 12$이므로 $12 : \overline{EC} = 2 : 1 \implies \overline{EC} = 6$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\triangle ABC$의 세 중선 $AD$, $BE$, $CF$의 교점인 무게중심을 $G$라 할 때, 다음 중 옳지 않은 것을 모두 고르면? (정답 2개)

**보기** ① $\overline{GA} : \overline{GB} = 1 : 1$  ② $\overline{AG} = 2\overline{GD}$  ③ $\square AFGE = \triangle GBC$  ④ $\triangle ABC = 6\triangle GBD$  ⑤ $\overline{GF} = \dfrac{1}{3}\overline{CG}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 무게중심은 중선을 2:1로 나누므로 ① GA = GB는 거짓이다. (ABC)
2. ⑤ CG : GF = 2:1이므로 GF = 1/2 CG이어야 하므로 ⑤도 거짓이다. (ABC)
3. 따라서 옳지 않은 것은 ①, ⑤이다. (ABC)
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_CENTROID(삼각형의 무게중심의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-097 [도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비] (원천과 같음)
- 이유: 무게중심 단원의 무게중심의 성질 유형이다. (ABC)
**유형** PT=PT_M2_CENTROID / TPL=NONE
- 이유: 삼각형의 무게중심의 성질 참거짓 판정 복수정답 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 무게중심의 선분비 2:1과 넓이 6등분 성질을 종합 판별하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「세 중선 $AD$, $BE$, $CF$」
- goal: 도형←stem:「다음 중 옳지 않은 것을 모두 고르면?」
- method: 선분(NAMED)←solution:「각 중선을 꼭짓점으로부터 $2 : 1$로 나눈다.」
- condition: 삼각형←stem:「$\triangle ABC$의 세 중선」

**how** 무게중심의 2:1 내분 성질과 넓이 분할을 분석하여 거짓인 보기 ①, ⑤를 판정했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

무게중심 $G$는 각 중선을 꼭짓점으로부터 $2 : 1$로 나눈다. ① $\overline{GA}$와 $\overline{GB}$는 서로 다른 중선 위의 선분이므로 일반적으로 같지 않다. (거짓) ② $\overline{AG} : \overline{GD} = 2 : 1$이므로 $\overline{AG} = 2\overline{GD}$이다. (참) ③, ④ 세 중선은 삼각형을 넓이가 같은 $6$개의 작은 삼각형으로 나누므로 $\square AFGE = \triangle GBC = \dfrac{1}{3}\triangle ABC$이고 $\triangle ABC = 6\triangle GBD$이다. (참) ⑤ $\overline{CG} : \overline{GF} = 2 : 1$이므로 $\overline{GF} = \dfrac{1}{2}\overline{CG}$이다. (거짓) $\therefore$ ①, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

$\triangle ABC$의 무게중심을 $G$, 중선 $AD$와 변 $BC$의 교점을 $D$, 선분 $DC$의 중점을 $E$라 하자. 점 $E$를 지나고 선분 $DA$에 평행한 직선이 변 $AC$와 만나는 점을 $F$라 할 때, $\overline{AG} = 16\text{ cm}$이면 $\overline{EF}$의 길이는?

**보기** ① $8\text{ cm}$  ② $9\text{ cm}$  ③ $10\text{ cm}$  ④ $12\text{ cm}$  ⑤ $16\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AG} : \overline{GD} = 2 : 1$에서 $\overline{GD} = 8\text{ cm}$, $\overline{AD} = 24\text{ cm}$이다. (ABC)
2. 중점연결정리에 의해 $\overline{EF} = \dfrac{1}{2}\overline{AD} = 12\text{ cm}$이다. (ABC)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_CENTROID(삼각형의 무게중심의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-097 [도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 좌표·길이 → 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비**
- 이유: 무게중심 단원의 중선과 무게중심 2:1 비 유형이다. (ABC)
**유형** PT=PT_M2_CENTROID / TPL=NONE
- 이유: 무게중심과 중점연결정리 융합 선분 길이 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 무게중심 2:1 비와 삼각형 중점연결정리를 결합한 난이도 2 문항이다. (ABC)

**4칸**
- given: 선분←stem:「$\overline{AG} = 16\text{ cm}$」
- goal: 선분←stem:「$\overline{EF}$의 길이는?」
- method: 선분(NAMED)←solution:「$\overline{AG} : \overline{GD} = 2 : 1$」
- condition: 평행선←stem:「선분 $DA$에 평행한 직선이」

**how** 무게중심 비로 AD=24cm를 구하고 중점연결정리로 EF=12cm를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AG} : \overline{GD} = 2 : 1$이고 $\overline{AG} = 16\text{ cm}$이므로 $\overline{GD} = 8\text{ cm}$, 따라서 $\overline{AD} = 16 + 8 = 24\text{ cm}$ $\triangle ADC$에서 $E$는 $\overline{DC}$의 중점이고 $\overline{EF} \parallel \overline{DA}$이므로 $F$는 $\overline{AC}$의 중점이다. $\therefore \overline{EF} = \dfrac{1}{2}\overline{AD} = \dfrac{1}{2} \times 24 = 12\text{ (cm)}$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$\triangle ABC$의 무게중심을 $G$, 두 변 $AB$, $AC$의 중점을 각각 $D$, $E$라 하자. $\triangle ADE$의 넓이가 $36\text{ cm}^2$일 때, $\triangle GDE$의 넓이는?

**보기** ① $12\text{ cm}^2$  ② $9\text{ cm}^2$  ③ $10\text{ cm}^2$  ④ $15\text{ cm}^2$  ⑤ $18\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ADE와 GDE는 밑변 DE가 공통이므로 넓이의 비는 높이의 비 $3 : 1$이다. (ABC)
2. 따라서 $\triangle GDE = 36 \times (1/3) = 12\text{ cm}^2$이다. (ABC)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_CENTROID(삼각형의 무게중심의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-099 [도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 넓이와 무게중심 > 넓이 분할] **원천→판정: 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 넓이와 무게중심 > 무게중심을 이용한 복합도형 → 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 넓이와 무게중심 > 넓이 분할**
- 이유: 무게중심 단원의 넓이와 무게중심 넓이 분할 유형이다. (ABC)
**유형** PT=PT_M2_CENTROID / TPL=NONE
- 이유: 무게중심과 중점연결선 사이 넓이 분할 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 중점연결선과 무게중심의 높이 비를 유도하여 넓이를 구하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 도형←stem:「$\triangle ADE$의 넓이가 $36\text{ cm}^2$」
- goal: 도형←stem:「$\triangle GDE$의 넓이는?」
- method: 선분(NAMED)←solution:「중점연결정리에 의해」
- condition: 삼각형←stem:「$\triangle ABC$의 무게중심을 $G$」

**how** 공통 밑변 DE에 대한 높이 비 3:1을 적용해 GDE의 넓이 12를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$의 높이를 $h$라 하면 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이고 $A$에서 $\overline{DE}$까지의 거리는 $\dfrac{h}{2}$이다. 무게중심 $G$에서 $\overline{BC}$까지의 거리는 $\dfrac{h}{3}$이므로 $G$에서 $\overline{DE}$까지의 거리는 $\dfrac{h}{2} - \dfrac{h}{3} = \dfrac{h}{6}$이다. $\triangle ADE$와 $\triangle GDE$는 밑변 $DE$가 같으므로 넓이의 비는 높이의 비 $\dfrac{h}{2} : \dfrac{h}{6} = 3 : 1$이다. $\therefore \triangle GDE = 36 \times \dfrac{1}{3} = 12\text{ (cm}^2\text{)}$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

$\overline{AB} = 12\text{ cm}$, $\overline{BC} = 15\text{ cm}$인 직사각형 $ABCD$에서 변 $CD$ 위의 점 $E$를 잡아 $\overline{BE}$를 접는 선으로 하여 꼭짓점 $C$가 변 $AD$ 위의 점 $C'$에 오도록 접었을 때, $\overline{DC'}$의 길이는?

**보기** ① $4\text{ cm}$  ② $5\text{ cm}$  ③ $6\text{ cm}$  ④ $7\text{ cm}$  ⑤ $9\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 접힌 변의 길이로 $\overline{BC'} = 15\text{ cm}$이다. (AB)
2. 직각삼각형 ABC'에서 $\overline{AC'} = \sqrt{15^2 - 12^2} = 9\text{ cm}$이다.
3. 따라서 $\overline{DC'} = 15 - 9 = 6\text{ cm}$이다. (AB)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-07(피타고라스 정리) / M2-07-PYTHAGOREAN_THEOREM(피타고라스 정리) (원천과 같음) **원천→판정: M2-07-PYTHAGOREAN_APPLICATION → M2-07-PYTHAGOREAN_THEOREM**
- 근거 인용: 「$\overline{AB}」
**RPM** M2-RPM-101 [도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 피타고라스 정리 > 직각삼각형의 변 길이] **원천→판정: 도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 도형에의 활용 > 평면도형 길이 → 도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 피타고라스 정리 > 직각삼각형의 변 길이**
- 이유: 피타고라스 정리 단원의 직사각형 접기 도형 변 길이 계산 유형이다. ($12, 15, 6$)
**유형** PT=PT_M2_PYTHAGOREAN_RELATION / TPL=NONE
- 이유: 접은 도형에서의 피타고라스 정리 응용 선분 계산 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형 접기에서 피타고라스 정리를 적용해 변을 구하는 난이도 2 문항이다. (AB)

**4칸**
- given: 선분←stem:「$\overline{AB} = 12\text{ cm}$」
- goal: 선분←stem:「$\overline{DC'}$의 길이는?」
- method: 피타고라스정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: 직사각형←stem:「직사각형 $ABCD$에서」

**how** 직각삼각형에 피타고라스 정리를 적용해 AC'=9를 구하고 DC'=6cm를 계산했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

접기 전후 대응변의 길이가 같으므로 $\overline{BC'} = \overline{BC} = 15\text{ cm}$ 직각삼각형 $ABC'$에서 피타고라스 정리에 의해 $\overline{AC'}^2 + 12^2 = 15^2 \implies \overline{AC'} = 9\text{ cm}$ $\therefore \overline{DC'} = \overline{AD} - \overline{AC'} = 15 - 9 = 6\text{ (cm)}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\angle B = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AC} = 17\text{ cm}$, $\overline{AB} = 8\text{ cm}$, $\overline{BC} = x\text{ cm}$이다. 또 변 $BC$를 한 변으로 하고 $\angle BCD = 90^\circ$인 직각삼각형 $BCD$에서 $\overline{BD} = 25\text{ cm}$, $\overline{CD} = y\text{ cm}$일 때, $x + y$의 값은?

**보기** ① $27$  ② $29$  ③ $31$  ④ $33$  ⑤ $35$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABC에서 $x = \sqrt{17^2 - 8^2} = 15\text{ cm}$이다. (90)
2. 직각삼각형 BCD에서 $y = \sqrt{25^2 - 15^2} = 20\text{ cm}$이다. (90)
3. 따라서 $x + y = 15 + 20 = 35$이다. (90)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-07(피타고라스 정리) / M2-07-PYTHAGOREAN_THEOREM(피타고라스 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle B = 90^」
**RPM** M2-RPM-101 [도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 피타고라스 정리 > 직각삼각형의 변 길이] (원천과 같음)
- 이유: 피타고라스 정리 단원의 두 직각삼각형 연계 변 길이 합산 계산 유형이다. ($17, 8, 25$)
**유형** PT=PT_M2_PYTHAGOREAN_RELATION / TPL=NONE
- 이유: 연속된 직각삼각형에서의 피타고라스 정리 변 길이 계산 유형이다. ($17, 8, 25$) (90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리를 두 직각삼각형에 연속 적용하여 $x+y=35$를 구하는 난이도 2 문항이다. (90)

**4칸**
- given: 선분←stem:「\overline{AC} = 17\text{ cm}」
- goal: 값←stem:「$x + y$의 값은?」
- method: 피타고라스정리(NAMED)←solution:「x^2 + 8^2 = 17^2」
- condition: 직각삼각형←stem:「직각삼각형 $ABC$에서」

**how** 두 직각삼각형에 피타고라스 정리를 순차 적용하여 $x = 15$, $y = 20$을 구하고 $x + y = 35$를 계산했다. (90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$에서 $x^2 + 8^2 = 17^2 \implies x^2 = 289 - 64 = 225 \implies x = 15$ $\triangle BCD$에서 $y^2 + 15^2 = 25^2 \implies y^2 = 625 - 225 = 400 \implies y = 20$ $\therefore x + y = 15 + 20 = 35$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점


**발문**

다음 중에서 미지수가 $2$개인 일차방정식인 것은?

**보기** ① $3x - 2y + 5$  ② $2x + 5y = 9$  ③ $x^2 - 4$  ④ $x^2 + y = 7$  ⑤ $3(x - 1) = x + 5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 보기를 정리하여 미지수의 개수와 차수를 판별한다. (2)
2. ② $2x + 5y - 9 = 0$은 미지수가 $x, y$ $2$개이고 차수가 모두 $1$인 일차방정식이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 미지수가 $2$」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] (원천과 같음)
- 이유: 연립일차방정식 단원의 미지수가 2개인 일차방정식 개념 유형이다. ($2x+5y-9=0$)
**유형** PT=PT_M2_TWO_VARIABLE_LINEAR_EQUATION / TPL=NONE
- 이유: 미지수가 2개인 일차방정식 판별 개념 확인 객관식 유형이다. ($2$)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 미지수가 2개인 일차방정식의 기본 정의를 확인하는 난이도 1 문항이다. ($2x+5y-9=0$)

**4칸**
- given: 일차방정식←stem:「미지수가 $2$개인 일차방정식」
- goal: 일차방정식←stem:「일차방정식인 것은?」
- method: 일차방정식(NAMED)←solution:「$2x + 5y - 9 = 0$으로 미지수가 $2$개인 일차방정식이다.」
- condition: 미지수←stem:「미지수가 $2$개인」

**how** 각 보기를 정리하여 $2x + 5y - 9 = 0$이 미지수가 $2$개인 일차방정식임을 확인했다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 등호가 없는 다항식이다. ② $2x + 5y - 9 = 0$으로 미지수가 $2$개인 일차방정식이다. ③ 등호가 없고 $x$의 차수가 $2$이다. ④ $x$의 차수가 $2$이므로 이차방정식이다. ⑤ $2x - 8 = 0$으로 미지수가 $1$개뿐이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 3점


**발문**

일차방정식 $5x + 2y = 29$를 만족시키는 자연수 $x$와 $y$의 순서쌍 $(x, y)$의 개수는?

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $5x + 2y = 29$에서 자연수 $x$에 $1, 2, 3, 4, 5$를 대입한다.
2. $x=1 \implies y=12$, $x=3 \implies y=7$, $x=5 \implies y=2$이다. (29)
3. 따라서 자연수 순서쌍 $(x, y)$는 $(1, 12), (3, 7), (5, 2)$의 $3$개이다. (29)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $5x + 2y」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] (원천과 같음)
- 이유: 연립일차방정식 단원의 일차방정식의 해의 순서쌍 유형이다. ($5x+2y=29$)
**유형** PT=PT_M2_TWO_VARIABLE_LINEAR_EQUATION / TPL=NONE
- 이유: 일차방정식의 자연수 해의 순서쌍 개수를 구하는 표준 유형이다. ($29$)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 자연수 조건으로 $5x + 2y = 29$의 해를 유한 조사하는 난이도 2 문항이다.

**4칸**
- given: 일차방정식←stem:「일차방정식 $5x + 2y = 29$」
- goal: 순서쌍←stem:「순서쌍 $(x, y)$의 개수는?」
- method: 대입(NAMED)←solution:「$x = 1, 2, 3, 4, 5$를 차례로 대입하면」
- condition: 자연수←stem:「만족시키는 자연수 $x$와 $y$」

**how** $5x + 2y = 29$에 자연수 $x=1,2,3,4,5$를 대입하여 순서쌍 $3$개를 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$, $y$가 자연수이므로 $x = 1, 2, 3, 4, 5$를 차례로 대입하면 $x = 1 \implies 2y = 24 \implies y = 12$ (O) $x = 2 \implies 2y = 19$ (자연수 아님) $x = 3 \implies 2y = 14 \implies y = 7$ (O) $x = 4 \implies 2y = 9$ (자연수 아님) $x = 5 \implies 2y = 4 \implies y = 2$ (O) 따라서 만족하는 순서쌍은 $(1, 12)$, $(3, 7)$, $(5, 2)$의 $3$개이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

두 순서쌍 $(1, 3)$과 $\left(p, -\dfrac{1}{3}p\right)$가 모두 일차방정식 $ax + 3y = 12$의 해일 때, $a + p$의 값은? (단, $a$는 상수이다.)

**보기** ① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $(1, 3)$ 대입으로 $a + 9 = 12 \implies a = 3$이다. (ax)
2. $(p, -p/3)$ 대입으로 $3p - p = 12 \implies p = 6$이다. (ax)
3. 따라서 $a + p = 3 + 6 = 9$이다. (ax)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 순서쌍 $(1, 3)$과」
**RPM** M2-RPM-033 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정**
- 이유: 연립일차방정식 해와 계수 단원의 계수 결정 유형이다. ($ax+3y=12$)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 일차방정식의 해가 주어졌을 때 미정계수 $a, p$를 구하는 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 순서쌍 해를 대입하여 $a = 3, p = 6$을 차례로 구하는 난이도 2 문항이다. (ax)

**4칸**
- given: 순서쌍←stem:「두 순서쌍 $(1, 3)$과 $\left(p, -\dfrac{1}{3}p\right)$」
- goal: 값←stem:「$a + p$의 값은?」
- method: 대입(NAMED)←solution:「$(1, 3)$을 $ax + 3y = 12$에 대입하면」
- condition: 상수←stem:「단, $a$는 상수이다.」

**how** $(1, 3)$을 대입해 $a = 3$을 구하고, $(p, -p/3)$을 대입해 $p = 6$을 구해 $a + p = 9$를 도출했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

$(1, 3)$을 $ax + 3y = 12$에 대입하면 $a + 9 = 12 \implies a = 3$ $\left(p, -\dfrac{1}{3}p\right)$를 $3x + 3y = 12$에 대입하면 $3p + 3\left(-\dfrac{1}{3}p\right) = 12 \implies 3p - p = 12 \implies 2p = 12 \implies p = 6$ $\therefore a + p = 3 + 6 = 9$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 연립방정식 중에서 해가 $x = 2$, $y = -1$인 것은?

**보기** ① $\begin{cases} 3x + 2y = 4 \ x - 3y = 5 \end{cases}$  ② $\begin{cases} x + y = 3 \ x - y = 1 \end{cases}$  ③ $\begin{cases} 2x - y = 3 \ 3x + y = 7 \end{cases}$  ④ $\begin{cases} x + 2y = 4 \ 2x - y = 3 \end{cases}$  ⑤ $\begin{cases} 3x - y = 5 \ x + y = 0 \end{cases}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x = 2, y = -1$을 각 연립방정식에 대입하여 확인한다. (cases)
2. ① $3(2) + 2(-1) = 4$, $2 - 3(-1) = 5$로 두 식이 모두 성립한다. (cases)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 연립방정식 중에서 해가」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] (원천과 같음)
- 이유: 연립일차방정식 단원의 주어진 해를 만족하는 연립방정식 판별 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 주어진 해 $x = 2, y = -1$를 만족하는 연립방정식 찾기 객관식 유형이다. (cases)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 해 $x = 2, y = -1$을 선지 식에 대입해 참거짓을 판정하는 난이도 1 문항이다. (cases)

**4칸**
- given: 해←stem:「해가 $x = 2$, $y = -1$」
- goal: 연립방정식←stem:「다음 연립방정식 중에서」
- method: 대입(NAMED)←solution:「$x = 2$, $y = -1$을 ①에 대입하면」
- condition: (없음)

**how** 해가 $x = 2$, $y = -1$인 연립방정식을 각 선지에 대입하여 ①이 성립함을 검증했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

$x = 2$, $y = -1$을 ①에 대입하면 $3(2) + 2(-1) = 6 - 2 = 4$, $2 - 3(-1) = 2 + 3 = 5$로 두 식이 모두 성립한다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

연립방정식 $\begin{cases} 2(x + 3) = 9 - (y - x) \ 4x - 3 = 2x - 3y + 4 \end{cases}$을 풀면?

**보기** ① $x = -2,\ y = 1$  ② $x = 1,\ y = 2$  ③ $x = 2,\ y = -1$  ④ $x = -1,\ y = 2$  ⑤ $x = 2,\ y = 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 식 정리: $x + y = 3$, 둘째 식 정리: $2x + 3y = 7$이다. (cases)
2. 가감법으로 $y = 1$이고 $x = 2$이다. (cases)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-034 [일차부등식과 연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 괄호가 있는 연립방정식] (원천과 같음)
- 이유: 연립일차방정식의 풀이 단원의 괄호가 있는 연립방정식 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 괄호가 있는 복잡한 연립일차방정식 풀이 유형이다. ($2(x+3)$) (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 괄호 전개 후 가감법으로 $x=2, y=1$을 구하는 표준적인 난이도 2 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} 2(x + 3) = 9 - (y - x)」
- goal: 연립방정식←stem:「연립방정식 $\begin{cases}」
- method: 가감법(NAMED)←solution:「$(2x + 3y) - (2x + 2y) = 7 - 6 \implies y = 1$」
- condition: (없음)

**how** 괄호를 전개하여 $x + y = 3$, $2x + 3y = 7$을 유도한 뒤 가감법으로 $x = 2, y = 1$을 구했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 식을 정리하면 $2x + 6 = 9 - y + x \implies x + y = 3$ 둘째 식을 정리하면 $4x - 3 = 2x - 3y + 4 \implies 2x + 3y = 7$ 첫째 식 $\times 2$: $2x + 2y = 6$ $(2x + 3y) - (2x + 2y) = 7 - 6 \implies y = 1$ $x + 1 = 3 \implies x = 2$ $\therefore x = 2,\ y = 1$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

연립방정식 $\begin{cases} x + 3y = 7 \ 4x - ay = 10 \end{cases}$의 해가 일차방정식 $2x - y = 0$을 만족시킬 때, 상수 $a$의 값은?

**보기** ① $-4$  ② $-3$  ③ $-2$  ④ $2$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = 2x$를 $x + 3y = 7$에 대입하면 $7x = 7 \implies x = 1, y = 2$이다. (cases)
2. $(1, 2)$를 $4x - ay = 10$에 대입하면 $4 - 2a = 10 \implies a = -3$이다. (cases)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-030 [일차부등식과 연립일차방정식 > 연립일차방정식 > 연립방정식의 풀이 > 가감법] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립방정식의 풀이 > 가감법**
- 이유: 연립일차방정식의 풀이 단원의 가감법 및 대입법 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 다른 일차방정식을 만족시키는 연립방정식의 미정계수 결정 유형이다. (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 일차방정식의 관계로부터 해를 먼저 구하고 미정계수를 찾는 난이도 2 문항이다. (cases)

**4칸**
- given: 일차방정식←stem:「일차방정식 $2x - y = 0$」
- goal: 값←stem:「상수 $a$의 값은?」
- method: 대입(NAMED)←solution:「해 $(1, 2)$를 $4x - ay = 10$에 대입하면」
- condition: 상수←stem:「상수 $a$의 값은?」

**how** 조건식 y=2x를 연립해 x=1, y=2를 구하고 a=-3을 계산했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

$2x - y = 0$에서 $y = 2x$를 $x + 3y = 7$에 대입하면 $x + 6x = 7 \implies 7x = 7 \implies x = 1$, $y = 2$ 해 $(1, 2)$를 $4x - ay = 10$에 대입하면 $4(1) - 2a = 10 \implies -2a = 6 \implies a = -3$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

연립방정식 $\begin{cases} 0.3x + 0.1y = 1.2 \ \dfrac{1}{3}x - \dfrac{1}{6}y = \dfrac{1}{2} \end{cases}$의 해가 $(a, b)$일 때, $a + b$의 값은?

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 식 $\times 10$: $3x + y = 12$, 둘째 식 $\times 6$: $2x - y = 3$이다. (cases)
2. 두 식을 더하면 $5x = 15 \implies x = 3$이고 $y = 3$이다. (cases)
3. 따라서 $a + b = 3 + 3 = 6$이다. (cases)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-035 [일차부등식과 연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 분수·소수가 있는 연립방정식] (원천과 같음)
- 이유: 복잡한 꼴의 연립방정식 단원의 분수·소수가 있는 연립방정식 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 분수와 소수를 포함한 연립일차방정식의 풀이 유형이다. ($0.3x, 1/3x$) (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 소수와 분수 계수를 각각 $10$배, $6$배 정수화하여 푸는 난이도 2 계산 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「0.3x + 0.1y = 1.2」
- goal: 값←stem:「$a + b$의 값은?」
- method: 가감법(NAMED)←solution:「두 식을 더하면 $5x = 15 \implies x = 3$」
- condition: 해←stem:「해가 $(a, b)$일 때」

**how** 계수를 정수화하여 $3x + y = 12$, $2x - y = 3$을 얻고 가감법으로 $x = 3, y = 3$을 구해 $a + b = 6$을 도출했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 식 $\times 10$: $3x + y = 12$ 둘째 식 $\times 6$: $2x - y = 3$ 두 식을 더하면 $5x = 15 \implies x = 3$ $3(3) + y = 12 \implies y = 3$ 따라서 $(a, b) = (3, 3)$이므로 $a + b = 3 + 3 = 6$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

민호와 준서가 가위바위보를 하여 이긴 사람은 $2$계단 올라가고, 진 사람은 $1$계단 내려가기로 하였다. 그 결과 처음의 위치보다 민호는 $7$계단 올라가 있고 준서는 $2$계단 내려가 있었다. 두 사람이 가위바위보를 한 전체 횟수는? (단, 비긴 경우는 없었다.)

**보기** ① $5$  ② $3$  ③ $4$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\begin{cases} 2w - l = 7 \ 2l - w = -2 \end{cases}$에서 $w = 2l + 2$ 대입으로 $l = 1, w = 4$이다.
2. 따라서 전체 횟수는 $w + l = 4 + 1 = 5$회이다. (cases)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD(연립일차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「민호와 준서가 가위바위보를」
**RPM** M2-RPM-038 [일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 두 수 관계] (원천과 같음)
- 이유: 연립일차방정식의 활용 단원의 두 수 관계 및 실생활 상황 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 가위바위보 계단 이동 연립방정식 실생활 활용 유형이다. ($7$계단, $-2$계단) (cases)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 가위바위보 승패의 대칭성을 이용해 식 $2w - l = 7$을 세우고 푸는 난이도 3 실생활 응용 문항이다. (cases)

**4칸**
- given: 자연수←stem:「민호는 $7$계단 올라가 있고」
- goal: 자연수←stem:「가위바위보를 한 전체 횟수는?」
- method: 대입법(NAMED)←solution:「$w = 2l + 2$를 첫째 식에 대입하면」
- condition: 미지수←stem:「비긴 경우는 없었다.」

**how** 이긴 횟수 $w$, 진 횟수 $l$로 $2w - l = 7, 2l - w = -2$를 세워 $w = 4, l = 1$에서 전체 횟수 $5$회를 구했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

민호가 이긴 횟수를 $w$, 진 횟수를 $l$이라 하면 준서는 $l$번 이기고 $w$번 졌으므로 $\begin{cases} 2w - l = 7 \ 2l - w = -2 \end{cases}$ 둘째 식에서 $w = 2l + 2$를 첫째 식에 대입하면 $2(2l + 2) - l = 7 \implies 3l + 4 = 7 \implies 3l = 3 \implies l = 1$ $w = 2(1) + 2 = 4$ $\therefore (\text{전체 횟수}) = w + l = 4 + 1 = 5$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점


**발문**

연립방정식 $\begin{cases} ax - by = 5 \ bx + ay = 5 \end{cases}$를 푸는데 잘못하여 $a$, $b$를 서로 바꾸어 놓고 풀었더니 $x = 1$, $y = -2$를 얻었다. 처음 연립방정식의 해는? (단, $a$와 $b$는 상수이다.)

**보기** ① $x = 0,\ y = 2$  ② $x = 1,\ y = -2$  ③ $x = -1,\ y = 2$  ④ $x = 1,\ y = 2$  ⑤ $x = -1,\ y = -2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 바꾼 식에 $x = 1, y = -2$ 대입하여 $a = 3, b = -1$을 구한다. (cases)
2. 원래 식 $\begin{cases} 3x + y = 5 \ -x + 3y = 5 \end{cases}$을 풀면 $x = 1, y = 2$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-033 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정] (원천과 같음)
- 이유: 연립일차방정식 단원의 해와 계수 결정 및 역산 유형이다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 계수를 바꾸어 놓고 푼 연립일차방정식의 역산 유형이다. ($ax-by=5$) (cases)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 잘못 보고 푼 조건으로 계수 $a=3, b=-1$을 먼저 구한 뒤 원래 방정식을 다시 푸는 난이도 3 심화 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「ax - by = 5」
- goal: 해←stem:「처음 연립방정식의 해는?」
- method: 대입법(NAMED)←solution:「$y = 5 - 3x$를 둘째 식에 대입하면」
- condition: 상수←stem:「단, $a$와 $b$는 상수이다.」

**how** 계수를 바꾼 식에 $x = 1, y = -2$를 대입해 $a = 3, b = -1$을 구하고 처음 식의 해 $x = 1, y = 2$를 도출했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

$a$, $b$를 바꾸어 놓은 식 $\begin{cases} bx - ay = 5 \ ax + by = 5 \end{cases}$에 $x = 1$, $y = -2$를 대입하면 $\begin{cases} b + 2a = 5 \ a - 2b = 5 \end{cases}$ 첫째 식 $\times 2$: $4a + 2b = 10$, 둘째 식과 더하면 $5a = 15 \implies a = 3$, $b = -1$ 처음 연립방정식은 $\begin{cases} 3x + y = 5 \ -x + 3y = 5 \end{cases}$이다. 첫째 식에서 $y = 5 - 3x$를 둘째 식에 대입하면 $-x + 3(5 - 3x) = 5 \implies -10x = -10 \implies x = 1$, $y = 2$ $\therefore x = 1,\ y = 2$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4점


**발문**

다음 <보기>의 함수 중 $f(2) = 5$를 만족시키는 것은? 〈보기〉 ㄱ. $f(x) = -2x + 1$  ㄴ. $f(x) = \dfrac{x + 8}{2}$ ㄷ. $f(x) = 3x - 1$  ㄹ. $f(x) = \dfrac{10}{x}$

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄷ  ③ ㄴ, ㄹ  ④ ㄷ, ㄹ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 보기에 x=2를 대입하여 함숫값이 5가 되는 것을 찾는다. (10)
2. ㄴ, ㄷ, ㄹ이 모두 f(2) = 5를 만족하므로 정답은 ⑤이다. (10)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <보기>의 함수 중 $」
**RPM** M2-RPM-046 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값] **원천→판정: 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값**
- 이유: 일차함수 단원의 함숫값 계산 유형이다. (10)
**유형** PT=PT_FUNCTION_VALUE / TPL=NONE
- 이유: 함수의 뜻과 함숫값 계산 기본 유형이다. (10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 주어진 함수식에 x=2를 대입하여 함숫값 계산을 수행하는 난이도 1 문항이다. (10)

**4칸**
- given: 식의값←stem:「$f(2) = 5$」
- goal: 식의값←stem:「$f(2) = 5$를 만족시키는 것은?」
- method: 대입(NAMED)←solution:「f(2) = -2(2) + 1 = -3」
- condition: (없음)

**how** 각 보기의 함수식에 x=2를 대입하여 함숫값 5를 만족하는 식을 판별했다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $f(2) = -2(2) + 1 = -3 \ne 5$ ㄴ. $f(2) = \dfrac{2 + 8}{2} = 5$ (O) ㄷ. $f(2) = 3(2) - 1 = 5$ (O) ㄹ. $f(2) = \dfrac{10}{2} = 5$ (O) $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 5점


**발문**

직사각형 $ABCD$에서 대각선 $\overline{BD}$의 중점을 $O$라 하고, 점 $O$에서 $\overline{BD}$에 수직인 직선과 변 $AD$, 변 $BC$의 교점을 각각 $E$, $F$라고 하자. $\overline{BO} = 10\text{ cm}$, $\overline{BC} = 16\text{ cm}$, $\overline{DC} = 12\text{ cm}$일 때, 다음 물음에 답하시오. (1) $\overline{EO}$의 길이를 구하기 위한 닮음인 두 삼각형을 찾고 닮음 조건을 쓰시오. (2) (1)에서 찾은 두 닮은 삼각형의 닮음비를 쓰시오. (3) $\overline{EO}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle DOE \sim \triangle BCD$ ($\text{AA}$ 닮음), (2) $5 : 8$, (3) $\dfrac{15}{2}\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\angle DOE = \angle BCD = 90^\circ$이고 $\overline{AD} \parallel \overline{BC}$의 엇각으로 $\angle ODE = \angle CBD$이므로 $\triangle DOE \sim \triangle BCD$ (AA 닮음)이다. (ABCD)
2. (2) O는 BD의 중점이므로 $\overline{DO} = 10\text{ cm}$이다. 대응변의 비는 $\overline{DO} : \overline{BC} = 10 : 16 = 5 : 8$이다. (ABCD)
3. (3) $\overline{EO} : \overline{DC} = 5 : 8 \implies \overline{EO} : 12 = 5 : 8 \implies \overline{EO} = 12 \times (5/8) = 15/2\text{ cm}$이다. (ABCD)
- 작성자 답: (1) $\triangle DOE \sim \triangle BCD$ ($\text{AA}$ 닮음), (2) $5 : 8$, (3) $\dfrac{15}{2}\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURES**
- 근거 인용: 「직사각형 $ABCD$에서 대」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] (원천과 같음)
- 이유: 도형의 닮음 단원의 직각삼각형의 닮음 및 선분의 길이 계산 유형이다. ($10, 16, 12$) (ABCD)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE
- 이유: 직사각형 내부 대각선 수선에 의한 삼각형 닮음 증명 및 계산 서술형 유형이다. (ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각과 엇각으로 닮음을 증명하고 닮음비 $5 : 8$로 선분을 구하는 난이도 3 서술형 문항이다. (ABCD)

**4칸**
- given: 선분←stem:「$\overline{BO} = 10\text{ cm}$」
- goal: 선분←stem:「$\overline{EO}$의 길이를 구하기 위한」
- method: 닮음(NAMED)←solution:「$\triangle DOE \sim \triangle BCD$」
- condition: 평행선←solution:「$\overline{AD} \parallel \overline{BC}$이므로」

**how** 직사각형에서 $\triangle DOE \sim \triangle BCD$ (AA닮음)과 닮음비 $10 : 16 = 5 : 8$을 이용해 $\overline{EO} = 15/2$를 구했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\triangle DOE$와 $\triangle BCD$에서 $\angle DOE = \angle BCD = 90^\circ$이고, $\overline{AD} \parallel \overline{BC}$이므로 엇각으로 $\angle ODE = \angle CBD$이다. 따라서 $\triangle DOE \sim \triangle BCD$ ($\text{AA}$ 닮음)이다. (2) $O$는 $\overline{BD}$의 중점이므로 $\overline{DO} = \overline{BO} = 10\text{ cm}$ 대응변 $\overline{DO} : \overline{BC} = 10 : 16 = 5 : 8$ (3) $\overline{EO} : \overline{DC} = 5 : 8 \implies \overline{EO} : 12 = 5 : 8 \implies \overline{EO} = 12 \times \dfrac{5}{8} = \dfrac{15}{2}\text{ (cm)}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

사다리꼴 $ABCD$에서 $\overline{AD} \parallel \overline{EF} \parallel \overline{BC}$이고 점 $E$는 변 $AB$ 위에, 점 $F$는 변 $DC$ 위에 있다. 선분 $EF$가 대각선 $BD$, 대각선 $AC$와 만나는 점을 각각 $P$, $Q$라 하자. $\overline{AE} = 6\text{ cm}$, $\overline{EB} = 3\text{ cm}$, $\overline{AD} = 9\text{ cm}$, $\overline{BC} = 18\text{ cm}$일 때, $\overline{PQ}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $9\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABD$에서 $\overline{EP} \parallel \overline{AD}$이고 $\overline{BE} : \overline{BA} = 3 : 9 = 1 : 3$이므로 $\overline{EP} = 9 \times (1/3) = 3\text{ cm}$이다. (ABCD)
2. $\triangle ABC$에서 $\overline{EQ} \parallel \overline{BC}$이고 $\overline{AE} : \overline{AB} = 6 : 9 = 2 : 3$이므로 $\overline{EQ} = 18 \times (2/3) = 12\text{ cm}$이다. (ABCD)
3. 따라서 $\overline{PQ} = \overline{EQ} - \overline{EP} = 12 - 3 = 9\text{ cm}$이다. (ABCD)
- 작성자 답: $9\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) **원천→판정: M2-06-PARALLEL_SEGMENT_RATIO → M2-06-PARALLEL_LENGTH_RATIO**
- 근거 인용: 「사다리꼴 $ABCD$에서 $」
**RPM** M2-RPM-094 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 평행선 사이 선분비 > 사다리꼴] (원천과 같음)
- 이유: 평행선 사이의 선분의 길이의 비 단원의 사다리꼴 평행선 분할 유형이다. (ABCD)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=NONE
- 이유: 사다리꼴과 평행선 사이의 선분의 길이의 비 응용 서술형 유형이다. ($6, 3, 9, 18$) (ABCD)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 사다리꼴 대각선과 평행선에 의해 나누어지는 두 선분의 길이를 차분 $12 - 3 = 9$로 구하는 복합 문항이다. (ABCD)

**4칸**
- given: 선분←stem:「\overline{AE} = 6\text{ cm}」
- goal: 선분←stem:「$\overline{PQ}$의 길이를 구하시오.」
- method: 선분(NAMED)←solution:「\overline{PQ} = \overline{EQ} - \overline{EP}」
- condition: 평행선←stem:「$\overline{AD} \parallel \overline{EF} \parallel \overline{BC}$」

**how** 사다리꼴에서 평행선 비를 적용해 $\overline{EP} = 3$, $\overline{EQ} = 12$를 구하고 차로 $\overline{PQ} = 9$를 구했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABD$에서 $\overline{EP} \parallel \overline{AD}$이고 $\overline{BE} : \overline{BA} = 3 : (6 + 3) = 1 : 3$이므로 $\overline{EP} : \overline{AD} = 1 : 3 \implies \overline{EP} = 9 \times \dfrac{1}{3} = 3\text{ cm}$ $\triangle ABC$에서 $\overline{EQ} \parallel \overline{BC}$이고 $\overline{AE} : \overline{AB} = 6 : 9 = 2 : 3$이므로 $\overline{EQ} : \overline{BC} = 2 : 3 \implies \overline{EQ} = 18 \times \dfrac{2}{3} = 12\text{ cm}$ $\therefore \overline{PQ} = \overline{EQ} - \overline{EP} = 12 - 3 = 9\text{ (cm)}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 5점


**발문**

민지네 반은 학교 축제를 위해 기념품을 구입하려고 한다. 손거울 $15$개와 열쇠고리 $5$개의 가격은 $33000$원이고, 손거울 $12$개와 열쇠고리 $8$개의 가격은 $31200$원이다. (1) 손거울 $1$개와 열쇠고리 $1$개의 가격을 각각 $x$원, $y$원으로 놓고 문제의 뜻에 맞는 연립방정식을 세우시오. (2) (1)에서 세운 연립방정식을 풀고, 손거울 $1$개와 열쇠고리 $1$개의 가격을 각각 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$, (2) 손거울 $1800$원, 열쇠고리 $1200$원   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 손거울 1개 x원, 열쇠고리 1개 y원이므로 $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$이다.
2. (2) 각 식을 약분하면 $3x + y = 6600, 3x + 2y = 7800$이다. (15)
3. 변끼리 빼면 $y = 1200$이고 $3x + 1200 = 6600 \implies x = 1800$이다. (15)
4. 따라서 손거울은 1800원, 열쇠고리는 1200원이다. (15)
- 작성자 답: (1) $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$, (2) 손거울 $1800$원, 열쇠고리 $1200$원 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD(연립일차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「민지네 반은 학교 축제를 위」
**RPM** M2-RPM-039 [일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 개수·가격] (원천과 같음)
- 이유: 연립일차방정식의 활용 단원의 수와 개수, 개수·가격 유형이다. ($1800, 1200$) (15)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 연립일차방정식의 활용 개수와 가격 실생활 서술형 유형이다. ($33000, 31200$) (15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 실생활 구매 가격으로 식을 세우고 약분하여 연립방정식을 푸는 난이도 2 서술형 문항이다. ($33000, 31200$) (15)

**4칸**
- given: 자연수←stem:「손거울 $15$개와 열쇠고리 $5$개의 가격은 $33000$원이고」
- goal: 자연수←stem:「손거울 $1$개와 열쇠고리 $1$개의 가격을 각각 구하시오.」
- method: 가감법(NAMED)←solution:「$(3x + 2y) - (3x + y) = 7800 - 6600 \implies y = 1200$」
- condition: 연립방정식←stem:「문제의 뜻에 맞는 연립방정식을 세우시오.」

**how** 손거울 $x$원, 열쇠고리 $y$원으로 연립방정식을 세워 가감법으로 $x = 1800, y = 1200$을 구했다. (15)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$ (2) 첫째 식을 $5$로 나누면 $3x + y = 6600$, 둘째 식을 $4$로 나누면 $3x + 2y = 7800$ $(3x + 2y) - (3x + y) = 7800 - 6600 \implies y = 1200$ $3x + 1200 = 6600 \implies 3x = 5400 \implies x = 1800$ 따라서 손거울 $1$개는 $1800$원, 열쇠고리 $1$개는 $1200$원이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 단답형 5점


**발문**

다음 네 일차방정식이 한 쌍의 공통인 해를 가질 때, 두 수 $a$, $b$에 대하여 물음에 답하시오. $$2x - 3y = 17, \qquad x - ay = 13, \qquad bx - y = 19, \qquad -3x + 2y = -18$$ (1) 공통인 해를 구하시오. (2) 두 수 $a$, $b$에 대하여 $ab$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $(4, -3)$, (2) $12$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $a, b$가 없는 두 식 $2x - 3y = 17, -3x + 2y = -18$을 연립한다.
2. 가감법으로 풀면 $x = 4, y = -3$이므로 공통해는 $(4, -3)$이다. (17)
3. (2) $(4, -3)$을 $x - ay = 13$에 대입하면 $4 + 3a = 13 \implies a = 3$이다. (17)
4. $(4, -3)$을 $bx - y = 19$에 대입하면 $4b + 3 = 19 \implies b = 4$이다. (17)
5. 따라서 $ab = 3 \times 4 = 12$이다. (17)
- 작성자 답: (1) $(4, -3)$, (2) $12$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 네 일차방정식이 한 쌍」
**RPM** M2-RPM-033 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정] (원천과 같음)
- 이유: 연립일차방정식 단원의 해와 계수, 공통인 해 유형이다. ($ab=12$) (17)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE
- 이유: 네 일차방정식의 공통해를 이용한 미정계수 결정 서술형 유형이다. ($17, -18$)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 공통해 $(4, -3)$을 먼저 연립하여 구한 후 나머지 두 식에 대입해 $ab=12$를 구하는 난이도 3 문항이다. (17)

**4칸**
- given: 일차방정식←stem:「2x - 3y = 17」
- goal: 값←stem:「두 수 $a$, $b$에 대하여 $ab$의 값을 구하시오.」
- method: 해(NAMED)←solution:「따라서 공통인 해는 $(4, -3)$이다.」
- condition: 해←stem:「한 쌍의 공통인 해를 가질 때」

**how** 계수가 확정된 두 식을 연립해 공통해 $(4, -3)$을 구하고 나머지 두 식에 대입해 $a = 3, b = 4$에서 $ab = 12$를 구했다. (17)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $a$, $b$가 없는 두 식 $\begin{cases} 2x - 3y = 17 \ -3x + 2y = -18 \end{cases}$을 연립하면 첫째 식 $\times 2$: $4x - 6y = 34$, 둘째 식 $\times 3$: $-9x + 6y = -54$ 두 식을 더하면 $-5x = -20 \implies x = 4$ $2(4) - 3y = 17 \implies -3y = 9 \implies y = -3$ 따라서 공통인 해는 $(4, -3)$이다. (2) $(4, -3)$을 $x - ay = 13$에 대입하면 $4 + 3a = 13 \implies 3a = 9 \implies a = 3$ $(4, -3)$을 $bx - y = 19$에 대입하면 $4b + 3 = 19 \implies 4b = 16 \implies b = 4$ $\therefore ab = 3 \times 4 = 12$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
