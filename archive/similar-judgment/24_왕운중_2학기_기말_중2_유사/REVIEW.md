# 검수 묶음 — 24_왕운중_2학기_기말_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 23, SELF_CONTAINED 1
- 난이도 분포: 1단계 5, 2단계 12, 3단계 5, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q3**: 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q7**: 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q23**: 풀이 과정에 정답 값이 등장하지 않음
- **Q24**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

흰 공 $3$개, 검은 공 $4$개, 파란 공 $5$개가 들어 있는 주머니에서 공 한 개를 임의로 꺼낼 때, 검은 공을 꺼낼 확률은?

**보기** ① $\dfrac{1}{6}$  ② $\dfrac{1}{4}$  ③ $\dfrac{1}{3}$  ④ $\dfrac{5}{12}$  ⑤ $\dfrac{1}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주머니에 들어 있는 전체 공의 개수는
2. 3 + 4 + 5 = 12  ext{개}
3. 모든 공을 꺼낼 가능성은 같고 검은 공은 $4$개이므로, 검은 공을 꺼낼 확률은
4. rac{4}{12} =  rac{1}{3}
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「흰 공 $3$개, 검은 공 $4$개, 파란 공 $5$개가 들어 있는 주머니에서 공 한 개를 임의로 꺼낼 때, 검은 공을 꺼낼 확률은?」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] (원천과 같음)
- 이유: Q1번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_PROBABILITY_PROPERTIES_APPLICATION / TPL=TPL_PROBABILITY_BASIC_COUNT_RATIO (원천과 같음) (원천과 같음)
- 이유: Q1번 문항은 PT_PROBABILITY_PROPERTIES_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 확률←stem:「흰 공 $3$개, 검은 공 $4$개, 파란 공 $5$개가 들어 있는 주머니에서 공 한 개를 임의로 꺼낼 때, 검은 공을 꺼낼 확률은?」
- goal: 개수←solution:「주머니에 들어 있는 전체 공의 개수는」
- method: 모든(NAMED)←solution:「모든 공을 꺼낼 가능성은 같고 검은 공은 $4$개이므로, 검은 공을 꺼낼 확률은」
- condition: (없음)

**how** Q1번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

주머니에 들어 있는 전체 공의 개수는
$$
3 + 4 + 5 = 12  ext{개}
$$
모든 공을 꺼낼 가능성은 같고 검은 공은 $4$개이므로, 검은 공을 꺼낼 확률은
$$
 rac{4}{12} =  rac{1}{3}
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

세 변의 길이가 각각 다음과 같이 주어졌을 때, 직각삼각형인 것은?

**보기** ① $5\rm \,cm, 12\rm \,cm, 13\rm \,cm$  ② $3\rm \,cm, 5\rm \,cm, 6\rm \,cm$  ③ $4\rm \,cm, 6\rm \,cm, 8\rm \,cm$  ④ $7\rm \,cm, 9\rm \,cm, 11\rm \,cm$  ⑤ $8\rm \,cm, 10\rm \,cm, 14\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으면 피타고라스 정리의 역에 의해 직각삼각형이다.
2. 각 선지를 검토하면 다음과 같다.
3. egin{aligned}
4. ext{① } &5^2 + 12^2 = 25 + 144 = 169 = 13^2 \quad (  ext{직각삼각형}) \
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-07(피타고라스 정리) / M2-07-PYTHAGOREAN_THEOREM(피타고라스 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 변의 길이가 각각 다음과 같이 주어졌을 때, 직각삼각형인 것은?」
**RPM** M2-RPM-103 [도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 피타고라스 정리의 역 > 직각삼각형 판정] (원천과 같음)
- 이유: Q2번 문항은 M2-RPM-103에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M2_PYTHAGOREAN_RELATION / TPL=TPL_M2_PYTHAGOREAN_SIDE_LENGTH **원천→판정: PT_PYTHAGORAS_APPLICATION → PT_M2_PYTHAGOREAN_RELATION** **원천→판정: TPL_RIGHT_TRIANGLE_DETERMINATION → TPL_M2_PYTHAGOREAN_SIDE_LENGTH**
- 이유: Q2번 문항은 PT_M2_PYTHAGOREAN_RELATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 삼각형←stem:「세 변의 길이가 각각 다음과 같이 주어졌을 때, 직각삼각형인 것은?」
- goal: 직각삼각형←stem:「세 변의 길이가 각각 다음과 같이 주어졌을 때, 직각삼각형인 것은?」
- method: 제곱(NAMED)←solution:「삼각형의 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으면 피타고라스 정리의 역에 의해 직각삼각형이다.」
- condition: (없음)

**how** Q2번 문항으로 M2-07 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으면 피타고라스 정리의 역에 의해 직각삼각형이다.
각 선지를 검토하면 다음과 같다.
$$
 egin{aligned}
  ext{① } &5^2 + 12^2 = 25 + 144 = 169 = 13^2 \quad (  ext{직각삼각형}) \
  ext{② } &3^2 + 5^2 = 9 + 25 = 34 
e 36 = 6^2 \
  ext{③ } &4^2 + 6^2 = 16 + 36 = 52 
e 64 = 8^2 \
  ext{④ } &7^2 + 9^2 = 49 + 81 = 130 
e 121 = 11^2 \
  ext{⑤ } &8^2 + 10^2 = 64 + 100 = 164 
e 196 = 14^2
\end{aligned}
$$
따라서 직각삼각형인 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

주머니 속에 빨간 공 $3$개와 초록 공 $5$개가 들어 있다. 이 주머니에서 한 개의 공을 임의로 꺼낼 때, 다음 설명 중 옳은 것은?

**보기** ① 노란 공이 나올 확률은 $\dfrac{1}{8}$이다.  ② 빨간 공이 나올 확률은$\dfrac{5}{8}$이다.  ③ 초록 공이 나올 확률은$1$이다.  ④ 빨간 공 또는 초록 공이 나올 확률은$\dfrac{1}{2}$이다.  ⑤ 초록 공이 나올 확률은 빨간 공이 나올 확률보다 크다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주머니에 들어 있는 전체 공의 개수는 $3 + 5 = 8$개이다.
2. 각 선지를 검토하면 다음과 같다.
3. egin{aligned}
4. ext{① } &  ext{노란 공은 주머니에 없으므로 나올 확률은 } 0  ext{이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「주머니 속에 빨간 공 $3$개와 초록 공 $5$개가 들어 있다.」
**RPM** M2-RPM-115 [확률 > 확률 > 확률의 성질 > 여사건] **원천→판정: 확률 > 확률 > 확률의 뜻과 성질 > 확률의 성질 → 확률 > 확률 > 확률의 성질 > 여사건**
- 이유: Q3번 문항은 M2-RPM-115에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 egin)
**유형** PT=PT_PROBABILITY_PROPERTIES_APPLICATION / TPL=TPL_PROBABILITY_BASIC_COUNT_RATIO (원천과 같음) (원천과 같음)
- 이유: Q3번 문항은 PT_PROBABILITY_PROPERTIES_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 egin)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 egin)

**4칸**
- given: 확률←choices:「노란 공이 나올 확률은 $\dfrac{1}{8}$이다.」
- goal: 또는←choices:「빨간 공 또는 초록 공이 나올 확률은$\dfrac{1}{2}$이다.」
- method: 개수(NAMED)←solution:「주머니에 들어 있는 전체 공의 개수는 $3 + 5 = 8$개이다.」
- condition: (없음)

**how** Q3번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 egin)

<details><summary>저장 해설 (판정 검토용)</summary>

주머니에 들어 있는 전체 공의 개수는 $3 + 5 = 8$개이다.
각 선지를 검토하면 다음과 같다.
$$
 egin{aligned}
  ext{① } &  ext{노란 공은 주머니에 없으므로 나올 확률은 } 0  ext{이다. (거짓)} \
  ext{② } &  ext{빨간 공이 나올 확률은 }  rac{3}{8}  ext{이다. (거짓)} \
  ext{③ } &  ext{초록 공이 나올 확률은 }  rac{5}{8}  ext{이다. (거짓)} \
  ext{④ } &  ext{모든 공이 빨간 공 또는 초록 공이므로 반드시 일어나는 사건의 확률은 } 1  ext{이다. (거짓)} \
  ext{⑤ } &  ext{초록 공이 나올 확률 }  rac{5}{8}  ext{는 빨간 공이 나올 확률 }  rac{3}{8}  ext{보다 크다. (참)}
\end{aligned}
$$
따라서 옳은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

현우네 반 학생 $32$명 중에서 안경을 쓴 학생이 $12$명이라고 한다. 이 $32$명의 학생 중에서 한 명을 임의로 뽑을 때, 안경을 쓰지 않은 학생이 뽑힐 확률은?

**보기** ① $\dfrac{3}{8}$  ② $\dfrac{5}{8}$  ③ $\dfrac{11}{16}$  ④ $\dfrac{3}{4}$  ⑤ $\dfrac{13}{16}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 안경을 쓰지 않은 학생 수는 전체 학생 수에서 안경을 쓴 학생 수를 뺀 것이므로
2. 32 - 12 = 20  ext{명}
3. 따라서 안경을 쓰지 않은 학생이 뽑힐 확률은
4. rac{20}{32} =  rac{5}{8}
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「현우네 반 학생 $32$명 중에서 안경을 쓴 학생이 $12$명이라고 한다.」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 계산 > 어떤 사건이 일어나지 않을 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q4번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 32)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_PROBABILITY_CALCULATION → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_PROBABILITY_COMPLEMENT → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q4번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 32)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 32)

**4칸**
- given: 확률←stem:「이 $32$명의 학생 중에서 한 명을 임의로 뽑을 때, 안경을 쓰지 않은 학생이 뽑힐 확률은?」
- goal: 사건←solution:「(또는 여사건의 확률에 의해 $1 - \dfrac{12}{32} = 1 - \dfrac{3}{8} = \dfrac{5}{8}$)」
- method: 여사건(NAMED)←solution:「(또는 여사건의 확률에 의해 $1 - \dfrac{12}{32} = 1 - \dfrac{3}{8} = \dfrac{5}{8}$)」
- condition: (없음)

**how** Q4번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 32)

<details><summary>저장 해설 (판정 검토용)</summary>

안경을 쓰지 않은 학생 수는 전체 학생 수에서 안경을 쓴 학생 수를 뺀 것이므로
$$
32 - 12 = 20  ext{명}
$$
따라서 안경을 쓰지 않은 학생이 뽑힐 확률은
$$
 rac{20}{32} =  rac{5}{8}
$$
(또는 여사건의 확률에 의해 $1 - \dfrac{12}{32} = 1 - \dfrac{3}{8} = \dfrac{5}{8}$)
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$  riangle ABC$에서 변 $AC$의 중점을 $E$라 하고, 중선 $BE$ 위의 점 $G$가 $  riangle ABC$의 무게중심이다. $\overline{BG}=8\rm \,cm$일 때, 선분 $\overline{GE}$의 길이는?

**보기** ① $2\rm \,cm$  ② $\dfrac{5}{2}\rm \,cm$  ③ $3\rm \,cm$  ④ $4\rm \,cm$  ⑤ $\dfrac{9}{2}\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 무게중심은 각 중선을 꼭짓점으로부터 $2:1$로 나눈다.
2. 선분$\overline{BE}$는 꼭짓점 $B$에서 대변의 중점 $E$를 이은 중선이므로
3. egin{aligned}
4. \overline{BG} : \overline{GE} &= 2 : 1 \
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_CENTROID(삼각형의 무게중심의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$  riangle ABC$에서 변 $AC$의 중점을 $E$라 하고, 중선 $BE$ 위의 점 $G$가 $  riangle ABC$의 무게중심이다.」
**RPM** M2-RPM-097 [도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 무게중심 > 중선과 무게중심 → 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비**
- 이유: Q5번 문항은 M2-RPM-097에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 riangle)
**유형** PT=PT_COORD_CENTROID / TPL=TPL_CENTROID_DIRECT **원천→판정: PT_TRIANGLE_CENTROID → PT_COORD_CENTROID** **원천→판정: TPL_TRIANGLE_CENTROID_SEGMENT_RATIO → TPL_CENTROID_DIRECT**
- 이유: Q5번 문항은 PT_COORD_CENTROID 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 riangle)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 riangle)

**4칸**
- given: 중심←stem:「$  riangle ABC$에서 변 $AC$의 중점을 $E$라 하고, 중선 $BE$ 위의 점 $G$가 $  riangle ABC$의 무게중심이다.」
- goal: 무게중심←stem:「$  riangle ABC$에서 변 $AC$의 중점을 $E$라 하고, 중선 $BE$ 위의 점 $G$가 $  riangle ABC$의 무게중심이다.」
- method: 삼각형(NAMED)←solution:「삼각형의 무게중심은 각 중선을 꼭짓점으로부터 $2:1$로 나눈다.」
- condition: (없음)

**how** Q5번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 riangle)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 무게중심은 각 중선을 꼭짓점으로부터 $2:1$로 나눈다. 선분$\overline{BE}$는 꼭짓점 $B$에서 대변의 중점 $E$를 이은 중선이므로
$$
 egin{aligned}
\overline{BG} : \overline{GE} &= 2 : 1 \
\overline{GE} &=  rac{1}{2}\overline{BG} \
&=  rac{1}{2}   imes 8 \
&= 4\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{GE}$의 길이는 $4\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$  riangle ABC$에서 두 변 $AB, AC$의 중점을 각각 $D, E$라 하고, 점 $G$를 $  riangle ABC$의 무게중심이라 하자. 삼각형 $DCE$의 넓이가 $15$일 때, 삼각형 $GBC$의 넓이는?

**보기** ① $16$  ② $18$  ③ $20$  ④ $22$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $D, E$는 각각 변 $AB, AC$의 중점이므로 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이다.
2. $  riangle ADE \sim   riangle ABC$이고 닮음비는 $1:2$이므로 넓이의 비는
3. S_{  riangle ADE} =  rac{1}{4} S_{  riangle ABC}
4. 선분 $\overline{CD}$는 $  riangle ABC$의 중선이므로 $S_{  riangle ADC} = \dfrac{1}{2}S_{  riangle ABC}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_CENTROID(삼각형의 무게중심의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$  riangle ABC$에서 두 변 $AB, AC$의 중점을 각각 $D, E$라 하고, 점 $G$를 $  riangle ABC$의 무게중심이라 하자.」
**RPM** M2-RPM-097 [도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 무게중심 > 무게중심과 삼각형의 넓이 → 도형의 닮음과 피타고라스 정리 > 삼각형의 무게중심 > 중선과 무게중심 > 2:1 비**
- 이유: Q6번 문항은 M2-RPM-097에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 riangle)
**유형** PT=PT_COORD_CENTROID / TPL=TPL_CENTROID_DIRECT **원천→판정: PT_TRIANGLE_CENTROID → PT_COORD_CENTROID** **원천→판정: TPL_TRIANGLE_CENTROID_AREA_RATIO → TPL_CENTROID_DIRECT**
- 이유: Q6번 문항은 PT_COORD_CENTROID 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 riangle)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 riangle)

**4칸**
- given: 중심←stem:「$  riangle ABC$에서 두 변 $AB, AC$의 중점을 각각 $D, E$라 하고, 점 $G$를 $  riangle ABC$의 무게중심이라 하자.」
- goal: 무게중심←stem:「$  riangle ABC$에서 두 변 $AB, AC$의 중점을 각각 $D, E$라 하고, 점 $G$를 $  riangle ABC$의 무게중심이라 하자.」
- method: 결정(NAMED)←solution:「점 $D, E$는 각각 변 $AB, AC$의 중점이므로 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이다.」
- condition: (없음)

**how** Q6번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 riangle)

<details><summary>저장 해설 (판정 검토용)</summary>

점 $D, E$는 각각 변 $AB, AC$의 중점이므로 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이다.
$  riangle ADE \sim   riangle ABC$이고 닮음비는 $1:2$이므로 넓이의 비는
$$
S_{  riangle ADE} =  rac{1}{4} S_{  riangle ABC}
$$
선분 $\overline{CD}$는 $  riangle ABC$의 중선이므로 $S_{  riangle ADC} = \dfrac{1}{2}S_{  riangle ABC}$이다. 점$E$가 선분 $\overline{AC}$의 중점이므로
$$
S_{  riangle DCE} =  rac{1}{2} S_{  riangle ADC} =  rac{1}{4} S_{  riangle ABC}
$$
$S_{  riangle DCE} = 15$이므로 $  riangle ABC$의 전체 넓이는
$$
S_{  riangle ABC} = 4   imes 15 = 60
$$
점 $G$는 $  riangle ABC$의 무게중심이므로 점 $G$와 세 꼭짓점을 연결하여 생기는 세 삼각형의 넓이는 서로 같다.
$$
 egin{aligned}
S_{  riangle GBC} &=  rac{1}{3} S_{  riangle ABC} \
&=  rac{1}{3}   imes 60 \
&= 20
\end{aligned}
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$  riangle ABC$의 두 변 $AB, AC$ 위의 점 $D, E$에 대하여 $\overline{DE} \parallel \overline{BC}$이다. $\overline{AB}=18\rm \,cm$, $\overline{BD}=6\rm \,cm$, $\overline{AE}=10\rm \,cm$일 때, 선분 $\overline{EC}$의 길이는?

**보기** ① $5\rm \,cm$  ② $6\rm \,cm$  ③ $7\rm \,cm$  ④ $8\rm \,cm$  ⑤ $9\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $D$가 변 $\overline{AB}$ 위의 점이므로
2. \overline{AD} = \overline{AB} - \overline{BD} = 18 - 6 = 12\rm \,cm
3. $\overline{DE} \parallel \overline{BC}$이므로 삼각형에서 평행선과 선분의 길이의 비 성질에 따라
4. egin{aligned}
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$  riangle ABC$의 두 변 $AB, AC$ 위의 점 $D, E$에 대하여 $\overline{DE} \parallel \overline{BC}$이다.」
**RPM** M2-RPM-091 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 평행선 사이의 선분의 길이의 비 > 삼각형에서 평행선과 선분의 길이의 비 → 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례**
- 이유: Q7번 문항은 M2-RPM-091에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 riangle)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=TPL_PARALLEL_SEGMENT_RATIO_GENERAL (원천과 같음) (원천과 같음)
- 이유: Q7번 문항은 PT_PARALLEL_SEGMENT_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 riangle)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 riangle)

**4칸**
- given: 선분←stem:「$\overline{AB}=18\rm \,cm$, $\overline{BD}=6\rm \,cm$, $\overline{AE}=10\rm \,cm$일 때, 선분 $\overline{EC}$의 길이는?」
- goal: 길이←stem:「$\overline{AB}=18\rm \,cm$, $\overline{BD}=6\rm \,cm$, $\overline{AE}=10\rm \,cm$일 때, 선분 $\overline{EC}$의 길이는?」
- method: 삼각형(NAMED)←solution:「$\overline{DE} \parallel \overline{BC}$이므로 삼각형에서 평행선과 선분의 길이의 비 성질에 따라」
- condition: (없음)

**how** Q7번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 riangle)

<details><summary>저장 해설 (판정 검토용)</summary>

점 $D$가 변 $\overline{AB}$ 위의 점이므로
$$
\overline{AD} = \overline{AB} - \overline{BD} = 18 - 6 = 12\rm \,cm
$$
$\overline{DE} \parallel \overline{BC}$이므로 삼각형에서 평행선과 선분의 길이의 비 성질에 따라
$$
 egin{aligned}
\overline{AD} : \overline{BD} &= \overline{AE} : \overline{EC} \
12 : 6 &= 10 : \overline{EC} \
2 : 1 &= 10 : \overline{EC} \
2   imes \overline{EC} &= 10 \
\overline{EC} &= 5\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{EC}$의 길이는 $5\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$500$원짜리 동전 $8$개와 $1000$원짜리 지폐 $6$장으로 $4000$원을 지불하는 방법의 수는? (단, 사용하는 동전이나 지폐의 개수에는 제한이 없으며, $0$개 사용해도 된다.)

**보기** ① $1$가지  ② $2$가지  ③ $3$가지  ④ $4$가지  ⑤ $5$가지

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 사용하는 $500$원짜리 동전의 개수를 $a$, $1000$원짜리 지폐의 장수를 $b$라 하자.
2. 문제의 조건에 의해
3. 500a + 1000b = 4000 \quad (0 \le a \le 8, \; 0 \le b \le 6, \; a, b  ext{는 정수})
4. 양변을 $500$으로 나누면
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「$500$원짜리 동전 $8$개와 $1000$원짜리 지폐 $6$장으로 $4000$원을 지불하는 방법의 수는?」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 경우의 수 > 경우의 수 > 돈을 지불하는 경우의 수 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: Q8번 문항은 M2-RPM-107에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 500)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_COUNTING_CASES → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_COUNTING_ORDERED_PAIRS → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q8번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 500)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 500)

**4칸**
- given: 개수←stem:「(단, 사용하는 동전이나 지폐의 개수에는 제한이 없으며, $0$개 사용해도 된다.)」
- goal: 조건←solution:「문제의 조건에 의해」
- method: 정수(NAMED)←solution:「500a + 1000b = 4000 \quad (0 \le a \le 8, \; 0 \le b \le 6, \; a, b  ext{는 정수})」
- condition: (없음)

**how** Q8번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 500)

<details><summary>저장 해설 (판정 검토용)</summary>

사용하는 $500$원짜리 동전의 개수를 $a$, $1000$원짜리 지폐의 장수를 $b$라 하자.
문제의 조건에 의해
$$
500a + 1000b = 4000 \quad (0 \le a \le 8, \; 0 \le b \le 6, \; a, b  ext{는 정수})
$$
양변을 $500$으로 나누면
$$
a + 2b = 8 \implies a = 8 - 2b
$$
$b$의 값에 따른 $a$의 값을 확인하면 다음과 같다.
$$
 egin{aligned}
b = 0 &\implies a = 8 \quad (  ext{가능: } (8, 0)) \
b = 1 &\implies a = 6 \quad (  ext{가능: } (6, 1)) \
b = 2 &\implies a = 4 \quad (  ext{가능: } (4, 2)) \
b = 3 &\implies a = 2 \quad (  ext{가능: } (2, 3)) \
b = 4 &\implies a = 0 \quad (  ext{가능: } (0, 4))
\end{aligned}
$$
$b \ge 5$이면 $a < 0$이므로 불가능하다. 따라서 지불하는 방법의 수는 모두$5$가지이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$  riangle ABC$의 변 $BC$ 위의 점 $E$, 변 $AC$ 위의 점 $D$에 대하여 $ ngle B =  ngle CDE$이다. $\overline{BE}=5\rm \,cm$, $\overline{EC}=7\rm \,cm$, $\overline{CD}=6\rm \,cm$일 때, 선분 $\overline{AD}$의 길이는?

**보기** ① $7\rm \,cm$  ② $8\rm \,cm$  ③ $9\rm \,cm$  ④ $10\rm \,cm$  ⑤ $11\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 변 $\overline{BC}$의 전체 길이는
2. \overline{BC} = \overline{BE} + \overline{EC} = 5 + 7 = 12\rm \,cm
3. $  riangle ABC$와 $  riangle DEC$에서
4. egin{aligned}
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) (원천과 같음)
- 근거 인용: 「$  riangle ABC$의 변 $BC$ 위의 점 $E$, 변 $AC$ 위의 점 $D$에 대하여 $ ngle B =  ngle CDE$이다.」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] (원천과 같음)
- 이유: Q9번 문항은 M2-RPM-086에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 riangle)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q9번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 riangle)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 riangle)

**4칸**
- given: 선분←stem:「$\overline{BE}=5\rm \,cm$, $\overline{EC}=7\rm \,cm$, $\overline{CD}=6\rm \,cm$일 때, 선분 $\overline{AD}$의 길이는?」
- goal: 길이←stem:「$\overline{BE}=5\rm \,cm$, $\overline{EC}=7\rm \,cm$, $\overline{CD}=6\rm \,cm$일 때, 선분 $\overline{AD}$의 길이는?」
- method: 공통(NAMED)←solution:「ngle C &  ext{는 공통} \」
- condition: (없음)

**how** Q9번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 riangle)

<details><summary>저장 해설 (판정 검토용)</summary>

변 $\overline{BC}$의 전체 길이는
$$
\overline{BC} = \overline{BE} + \overline{EC} = 5 + 7 = 12\rm \,cm
$$
$  riangle ABC$와 $  riangle DEC$에서
$$
 egin{aligned}
 ngle C &  ext{는 공통} \
 ngle B &=  ngle CDE
\end{aligned}
$$
두 쌍의 대응각의 크기가 각각 같으므로
$$
  riangle ABC \sim   riangle DEC \quad (  ext{AA 닮음})
$$
대응변의 길이의 비가 같으므로
$$
 egin{aligned}
\overline{BC} : \overline{DC} &= \overline{AC} : \overline{EC} \
12 : 6 &= \overline{AC} : 7 \
2 : 1 &= \overline{AC} : 7 \
\overline{AC} &= 14\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{AD}$의 길이는
$$
 egin{aligned}
\overline{AD} &= \overline{AC} - \overline{CD} \
&= 14 - 6 \
&= 8\rm \,cm
\end{aligned}
$$
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$ ngle BAC = 90^\circ$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 빗변 $\overline{BC}$에 내린 수선의 발을 $D$라 하자. $\overline{AD}=6\rm \,cm$, $\overline{CD}=4\rm \,cm$일 때, 선분 $\overline{BD}$의 길이는?

**보기** ① $6\rm \,cm$  ② $7\rm \,cm$  ③ $8\rm \,cm$  ④ $9\rm \,cm$  ⑤ $10\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형의 닮음에 의한 높이 공식에서
2. \overline{AD}^2 = \overline{BD}   imes \overline{CD}
3. 이 성립한다.
4. 주어진 값을 대입하면
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) (원천과 같음)
- 근거 인용: 「$ ngle BAC = 90^\circ$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 빗변 $\overline{BC}$에 내린 수선의 발을 $D$라 하자.」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > 직각삼각형의 닮음 공식 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA**
- 이유: Q10번 문항은 M2-RPM-086에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ngle)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q10번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ngle)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ngle)

**4칸**
- given: 삼각형←stem:「$ ngle BAC = 90^\circ$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 빗변 $\overline{BC}$에 내린 수선의 발을 $D$라 하자.」
- goal: 직각삼각형←stem:「$ ngle BAC = 90^\circ$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 빗변 $\overline{BC}$에 내린 수선의 발을 $D$라 하자.」
- method: 닮음(NAMED)←solution:「직각삼각형의 닮음에 의한 높이 공식에서」
- condition: (없음)

**how** Q10번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ngle)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 닮음에 의한 높이 공식에서
$$
\overline{AD}^2 = \overline{BD}   imes \overline{CD}
$$
이 성립한다. 주어진 값을 대입하면
$$
 egin{aligned}
6^2 &= \overline{BD}   imes 4 \
36 &= 4   imes \overline{BD} \
\overline{BD} &= 9\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{BD}$의 길이는 $9\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$1$부터 $25$까지의 자연수가 각각 적힌 $25$개의 공이 들어 있는 주머니에서 공 $1$개를 임의로 꺼낼 때, $4$의 배수 또는 $9$의 배수가 적힌 공이 나올 확률은?

**보기** ① $\dfrac{6}{25}$  ② $\dfrac{7}{25}$  ③ $\dfrac{8}{25}$  ④ $\dfrac{9}{25}$  ⑤ $\dfrac{2}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $1$부터 $25$까지의 자연수 중
2. egin{aligned}
3. 4  ext{의 배수: } &{4, 8, 12, 16, 20, 24} \implies 6  ext{개} \
4. 9  ext{의 배수: } &{9, 18} \implies 2  ext{개}
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$1$부터 $25$까지의 자연수가 각각 적힌 $25$개의 공이 들어 있는 주머니에서 공 $1$개를 임의로 꺼낼 때, $4$의 배수 또는 $9$의 배수가 적힌 공이 나올 확률은?」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 계산 > 사건 A 또는 사건 B가 일어날 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q11번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 25)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_PROBABILITY_CALCULATION → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_PROBABILITY_SUM_RULE → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q11번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 25)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 25)

**4칸**
- given: 자연수←stem:「$1$부터 $25$까지의 자연수가 각각 적힌 $25$개의 공이 들어 있는 주머니에서 공 $1$개를 임의로 꺼낼 때, $4$의 배수 또는 $9$의 배수가 적힌 공이 나올 확률은?」
- goal: 배수←stem:「$1$부터 $25$까지의 자연수가 각각 적힌 $25$개의 공이 들어 있는 주머니에서 공 $1$개를 임의로 꺼낼 때, $4$의 배수 또는 $9$의 배수가 적힌 공이 나올 확률은?」
- method: 공배수(NAMED)←solution:「$4$와 $9$의 공배수는 $36$의 배수이므로 $1$부터 $25$ 사이에는 공배수가 없다.」
- condition: (없음)

**how** Q11번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 25)

<details><summary>저장 해설 (판정 검토용)</summary>

$1$부터 $25$까지의 자연수 중
$$
 egin{aligned}
4  ext{의 배수: } &{4, 8, 12, 16, 20, 24} \implies 6  ext{개} \
9  ext{의 배수: } &{9, 18} \implies 2  ext{개}
\end{aligned}
$$
$4$와 $9$의 공배수는 $36$의 배수이므로 $1$부터 $25$ 사이에는 공배수가 없다.
따라서 두 사건은 동시에 일어나지 않는 배반사건이므로 조건을 만족하는 경우의 수는
$$
6 + 2 = 8
$$
전체 경우의 수는 $25$이므로 구하는 확률은
$$
 rac{8}{25}
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

남학생 $5$명, 여학생 $3$명 중에서 동아리 대표 $2$명을 뽑는 경우의 수는?

**보기** ① $28$  ② $32$  ③ $36$  ④ $42$  ⑤ $56$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 전체 학생 수는
2. 5 + 3 = 8  ext{명}
3. 자격이 같은 대표 $2$명을 뽑는 경우의 수는 순서를 고려하지 않고 $8$명 중에서 $2$명을 택하는 조합의 수와 같다.
4. egin{aligned}
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「남학생 $5$명, 여학생 $3$명 중에서 동아리 대표 $2$명을 뽑는 경우의 수는?」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 경우의 수 > 경우의 수 > 대표를 뽑는 경우의 수 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: Q12번 문항은 M2-RPM-107에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 28)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_COUNTING_CASES → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_COUNTING_COMBINATION → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q12번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 28)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 28)

**4칸**
- given: 경우의수←stem:「남학생 $5$명, 여학생 $3$명 중에서 동아리 대표 $2$명을 뽑는 경우의 수는?」
- goal: 순서←solution:「자격이 같은 대표 $2$명을 뽑는 경우의 수는 순서를 고려하지 않고 $8$명 중에서 $2$명을 택하는 조합의 수와 같다.」
- method: 조합(NAMED)←solution:「자격이 같은 대표 $2$명을 뽑는 경우의 수는 순서를 고려하지 않고 $8$명 중에서 $2$명을 택하는 조합의 수와 같다.」
- condition: (없음)

**how** Q12번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 28)

<details><summary>저장 해설 (판정 검토용)</summary>

전체 학생 수는
$$
5 + 3 = 8  ext{명}
$$
자격이 같은 대표 $2$명을 뽑는 경우의 수는 순서를 고려하지 않고 $8$명 중에서 $2$명을 택하는 조합의 수와 같다.
$$
 egin{aligned}
(  ext{경우의 수}) &=  rac{8   imes 7}{2   imes 1} \
&= 28
\end{aligned}
$$
따라서 구하는 경우의 수는 $28$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$0, 1, 2, 3, 4, 5, 6$의 숫자가 각각 적힌 $7$장의 카드 중에서 서로 다른 $2$장을 뽑아 만들 수 있는 두 자리 자연수의 개수는?

**보기** ① $28$  ② $30$  ③ $32$  ④ $35$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 자리 자연수를 만들 때 (문항 토큰 28)
2. 십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5, 6$의 $6$가지이다.
3. 일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지$6$장의 카드 중 하나가 올 수 있으므로 $6$가지이다.
4. 곱의 법칙에 의해 만들 수 있는 두 자리 자연수의 개수는
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0, 1, 2, 3, 4, 5, 6$의 숫자가 각각 적힌 $7$장의 카드 중에서 서로 다른 $2$장을 뽑아 만들 수 있는 두 자리 자연수의 개수는?」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 경우의 수 > 여러 가지 경우의 수 > 0을 포함하는 자연수의 개수 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: Q13번 문항은 M2-RPM-107에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 28)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_COUNTING_CASES → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_COUNTING_PERMUTATION → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q13번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 28)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 28)

**4칸**
- given: 자연수←stem:「$0, 1, 2, 3, 4, 5, 6$의 숫자가 각각 적힌 $7$장의 카드 중에서 서로 다른 $2$장을 뽑아 만들 수 있는 두 자리 자연수의 개수는?」
- goal: 개수←stem:「$0, 1, 2, 3, 4, 5, 6$의 숫자가 각각 적힌 $7$장의 카드 중에서 서로 다른 $2$장을 뽑아 만들 수 있는 두 자리 자연수의 개수는?」
- method: 자리(NAMED)←solution:「두 자리 자연수를 만들 때」
- condition: (없음)

**how** Q13번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 28)

<details><summary>저장 해설 (판정 검토용)</summary>

두 자리 자연수를 만들 때
십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5, 6$의 $6$가지이다. 일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지$6$장의 카드 중 하나가 올 수 있으므로 $6$가지이다.
곱의 법칙에 의해 만들 수 있는 두 자리 자연수의 개수는
$$
6   imes 6 = 36
$$
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$1$개의 동전을 $5$번 던질 때, 적어도 한 번은 앞면이 나올 확률은?

**보기** ① $\dfrac{15}{16}$  ② $\dfrac{31}{32}$  ③ $\dfrac{7}{8}$  ④ $\dfrac{29}{32}$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. '적어도 한 번은 앞면이 나온다'는 사건의 여사건은 '$5$번 모두 뒷면이 나온다'는 사건이다.
2. 동전을$5$번 던질 때 일어날 수 있는 모든 경우의 수는
3. 2^5 = 32  ext{가지}
4. $5$번 모두 뒷면이 나오는 경우는 $(  ext{뒤},   ext{뒤},   ext{뒤},   ext{뒤},   ext{뒤})$의 $1$가지이므로 그 확률은
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$1$개의 동전을 $5$번 던질 때, 적어도 한 번은 앞면이 나올 확률은?」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 계산 > 적어도 ~일 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q14번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 15)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_PROBABILITY_CALCULATION → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_PROBABILITY_COMPLEMENT → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q14번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 15)

**4칸**
- given: 확률←stem:「$1$개의 동전을 $5$번 던질 때, 적어도 한 번은 앞면이 나올 확률은?」
- goal: 적어도←stem:「$1$개의 동전을 $5$번 던질 때, 적어도 한 번은 앞면이 나올 확률은?」
- method: 사건(NAMED)←solution:「'적어도 한 번은 앞면이 나온다'는 사건의 여사건은 '$5$번 모두 뒷면이 나온다'는 사건이다.」
- condition: (없음)

**how** Q14번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

'적어도 한 번은 앞면이 나온다'는 사건의 여사건은 '$5$번 모두 뒷면이 나온다'는 사건이다. 동전을$5$번 던질 때 일어날 수 있는 모든 경우의 수는
$$
2^5 = 32  ext{가지}
$$
$5$번 모두 뒷면이 나오는 경우는 $(  ext{뒤},   ext{뒤},   ext{뒤},   ext{뒤},   ext{뒤})$의 $1$가지이므로 그 확률은
$$
P(  ext{모두 뒷면}) =  rac{1}{32}
$$
따라서 여사건의 확률에 의해 구하는 확률은
$$
 egin{aligned}
P &= 1 - P(  ext{모두 뒷면}) \
&= 1 -  rac{1}{32} \
&=  rac{31}{32}
\end{aligned}
$$
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

그림과 같이 $\overline{AB} \parallel \overline{EF} \parallel \overline{DC}$이고, 선분 $BC$ 위에 점 $F$가 있다. $\overline{AB}=12\rm \,cm$, $\overline{DC}=8\rm \,cm$일 때, 선분 $\overline{EF}$의 길이는?

**보기** ① $\dfrac{21}{5}\rm \,cm$  ② $\dfrac{22}{5}\rm \,cm$  ③ $\dfrac{23}{5}\rm \,cm$  ④ $\dfrac{24}{5}\rm \,cm$  ⑤ $5\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{AB} \parallel \overline{DC}$이므로 엇각과 맞꼭지각에 의해
2. riangle ABE \sim   riangle CDE \quad (  ext{AA 닮음})
3. 대응변의 길이의 비는
4. \overline{BE} : \overline{ED} = \overline{AB} : \overline{DC} = 12 : 8 = 3 : 2
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림과 같이 $\overline{AB} \parallel \overline{EF} \parallel \overline{DC}$이고, 선분 $BC$ 위에 점 $F$가 있다

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 $\overline{AB} \parallel \overline{EF} \parallel \overline{DC}$이고, 선분 $BC$ 위에 점 $F$가 있다.」
**RPM** M2-RPM-091 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 평행선 사이의 선분의 길이의 비 > 평행선과 선분의 길이의 비의 응용 → 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례**
- 이유: Q15번 문항은 M2-RPM-091에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=TPL_PARALLEL_SEGMENT_RATIO_GENERAL (원천과 같음) (원천과 같음)
- 이유: Q15번 문항은 PT_PARALLEL_SEGMENT_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「그림과 같이 $\overline{AB} \parallel \overline{EF} \parallel \overline{DC}$이고, 선분 $BC$ 위에 점 $F$가 있다.」
- goal: 길이←stem:「$\overline{AB}=12\rm \,cm$, $\overline{DC}=8\rm \,cm$일 때, 선분 $\overline{EF}$의 길이는?」
- method: 꼭지각(NAMED)←solution:「$\overline{AB} \parallel \overline{DC}$이므로 엇각과 맞꼭지각에 의해」
- condition: (없음)

**how** Q15번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB} \parallel \overline{DC}$이므로 엇각과 맞꼭지각에 의해
$$
  riangle ABE \sim   riangle CDE \quad (  ext{AA 닮음})
$$
대응변의 길이의 비는
$$
\overline{BE} : \overline{ED} = \overline{AB} : \overline{DC} = 12 : 8 = 3 : 2
$$
따라서 선분 $\overline{BE}$와 $\overline{BD}$의 길이의 비는
$$
\overline{BE} : \overline{BD} = 3 : (3 + 2) = 3 : 5
$$
$  riangle BDC$에서 $\overline{EF} \parallel \overline{DC}$이므로 $  riangle BEF \sim   riangle BDC$이고
$$
 egin{aligned}
\overline{EF} : \overline{DC} &= \overline{BE} : \overline{BD} \
\overline{EF} : 8 &= 3 : 5 \
5   imes \overline{EF} &= 24 \
\overline{EF} &=  rac{24}{5}\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{EF}$의 길이는 $\dfrac{24}{5}\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$A$ 주머니에는 빨간 공 $3$개와 파란 공 $4$개가 들어 있고, $B$ 주머니에는 빨간 공 $5$개와 파란 공 $2$개가 들어 있다. 두 주머니 $A, B$에서 각각 공을 한 개씩 임의로 꺼낼 때, 두 공의 색깔이 서로 다를 확률은?

**보기** ① $\dfrac{24}{49}$  ② $\dfrac{25}{49}$  ③ $\dfrac{26}{49}$  ④ $\dfrac{27}{49}$  ⑤ $\dfrac{4}{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 주머니 $A, B$에서 꺼낸 공의 색깔이 다를 경우는 두 가지 배반사건으로 나뉜다.
2. 첫째, 주머니$A$에서 빨간 공, 주머니 $B$에서 파란 공을 꺼낼 확률:
3. P_1 =  rac{3}{7}   imes  rac{2}{7} =  rac{6}{49}
4. 둘째, 주머니 $A$에서 파란 공, 주머니 $B$에서 빨간 공을 꺼낼 확률:
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A$ 주머니에는 빨간 공 $3$개와 파란 공 $4$개가 들어 있고, $B$ 주머니에는 빨간 공 $5$개와 파란 공 $2$개가 들어 있다.」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 계산 > 서로 다른 색을 뽑을 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q16번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 24)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_PROBABILITY_CALCULATION → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_PROBABILITY_SUM_RULE → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q16번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 24)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 24)

**4칸**
- given: 확률←stem:「두 주머니 $A, B$에서 각각 공을 한 개씩 임의로 꺼낼 때, 두 공의 색깔이 서로 다를 확률은?」
- goal: 반사←solution:「두 주머니 $A, B$에서 꺼낸 공의 색깔이 다를 경우는 두 가지 배반사건으로 나뉜다.」
- method: 사건(NAMED)←solution:「두 주머니 $A, B$에서 꺼낸 공의 색깔이 다를 경우는 두 가지 배반사건으로 나뉜다.」
- condition: (없음)

**how** Q16번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 24)

<details><summary>저장 해설 (판정 검토용)</summary>

두 주머니 $A, B$에서 꺼낸 공의 색깔이 다를 경우는 두 가지 배반사건으로 나뉜다. 첫째, 주머니$A$에서 빨간 공, 주머니 $B$에서 파란 공을 꺼낼 확률:
$$
P_1 =  rac{3}{7}   imes  rac{2}{7} =  rac{6}{49}
$$
둘째, 주머니 $A$에서 파란 공, 주머니 $B$에서 빨간 공을 꺼낼 확률:
$$
P_2 =  rac{4}{7}   imes  rac{5}{7} =  rac{20}{49}
$$
두 사건은 동시에 일어날 수 없으므로, 구하는 확률은 합의 법칙에 의해
$$
 egin{aligned}
P &= P_1 + P_2 \
&=  rac{6}{49} +  rac{20}{49} \
&=  rac{26}{49}
\end{aligned}
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

주사위 한 개를 두 번 던져 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라고 할 때, 다음 두 조건을 동시에 만족시킬 확률은?
<조건>
(가) $a e b$
(나) 두 직선 $y = 3x + 2$와 $y = ax + b$는 한 점에서 만난다.

**보기** ① $\dfrac{25}{36}$  ② $\dfrac{13}{18}$  ③ $\dfrac{7}{9}$  ④ $\dfrac{29}{36}$  ⑤ $\dfrac{5}{6}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주사위를 두 번 던져 나오는 순서쌍 $(a, b)$의 전체 경우의 수는 $6   imes 6 = 36$가지이다.
2. 조건 (가)에 의해$a e b$이어야 하므로, 같은 눈이 나오는 $6$가지 $(1, 1), (2, 2), \dots, (6, 6)$을 제외하면
3. 36 - 6 = 30  ext{가지}
4. 조건 (나)에서 두 직선 $y = 3x + 2$와 $y = ax + b$가 한 점에서 만나려면 두 직선의 기울기가 달라야 한다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「주사위 한 개를 두 번 던져 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라고 할 때, 다음 두 조건을 동시에 만족시킬 확률은?」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 뜻 > 경우의 수를 이용한 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q17번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_PROBABILITY_PROPERTIES_APPLICATION / TPL=TPL_PROBABILITY_BASIC_COUNT_RATIO (원천과 같음) (원천과 같음)
- 이유: Q17번 문항은 PT_PROBABILITY_PROPERTIES_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 확률←stem:「주사위 한 개를 두 번 던져 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라고 할 때, 다음 두 조건을 동시에 만족시킬 확률은?」
- goal: 조건←stem:「주사위 한 개를 두 번 던져 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라고 할 때, 다음 두 조건을 동시에 만족시킬 확률은?」
- method: 순서(NAMED)←solution:「주사위를 두 번 던져 나오는 순서쌍 $(a, b)$의 전체 경우의 수는 $6   imes 6 = 36$가지이다.」
- condition: (없음)

**how** Q17번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

주사위를 두 번 던져 나오는 순서쌍 $(a, b)$의 전체 경우의 수는 $6   imes 6 = 36$가지이다. 조건 (가)에 의해$a e b$이어야 하므로, 같은 눈이 나오는 $6$가지 $(1, 1), (2, 2), \dots, (6, 6)$을 제외하면
$$
36 - 6 = 30  ext{가지}
$$
조건 (나)에서 두 직선 $y = 3x + 2$와 $y = ax + b$가 한 점에서 만나려면 두 직선의 기울기가 달라야 한다.
$$
a 
e 3
$$
따라서 (가)를 만족하는 $30$가지 중에서 기울기가 $3$인 경우, 즉 $a = 3$이고 $b e 3$인 경우를 제외해야 한다.
$a = 3$일 때 가능한 순서쌍은
$$
(3, 1), \quad (3, 2), \quad (3, 4), \quad (3, 5), \quad (3, 6) \implies 5  ext{가지}
$$
따라서 두 조건 (가), (나)를 동시에 만족시키는 경우의 수는
$$
30 - 5 = 25  ext{가지}
$$
구하는 확률은
$$
 rac{25}{36}
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$의 두 변 $AD$와 $BC$의 삼등분점을 각각 $E, F$와 $G, H$라 하자 (점의 순서는 $A-E-F-D$, $B-G-H-C$). 선분 $GF$와 선분 $AH$의 교점을 $P$, 선분 $GF$와 대각선 $AC$의 교점을 $Q$라 하자. 삼각형 $APQ$의 넓이가 $3$일 때, 평행사변형 $ABCD$의 넓이는?

**보기** ① $36$  ② $42$  ③ $45$  ④ $48$  ⑤ $54$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행사변형 $ABCD$의 전체 넓이를 $S$, 높이를 $h$라 하자.
2. $\overline{AF} = \dfrac{2}{3}\overline{AD}$이고 $\overline{GC} = \dfrac{2}{3}\overline{BC}$이며 $\overline{AD} = \overline{BC}$이므로
3. \overline{AF} = \overline{GC}, \quad \overline{AF} \parallel \overline{GC}
4. 따라서 사각형 $AFGC$는 평행사변형이고, 두 대각선 $AC$와 $FG$는 서로를 이등분하므로 점 $Q$는 대각선 $\overline{AC}$의 중점이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$의 두 변 $AD$와 $BC$의 삼등분점을 각각 $E, F$와 $G, H$라 하자 (점의 순서는 $A-E-F-D$, $B-G-H-C$).」
**RPM** M2-RPM-084 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 무게중심 > 평행사변형과 무게중심의 응용 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비**
- 이유: Q18번 문항은 M2-RPM-084에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_COORD_CENTROID / TPL=TPL_CENTROID_DIRECT **원천→판정: PT_TRIANGLE_CENTROID → PT_COORD_CENTROID** **원천→판정: TPL_PARALLELOGRAM_CENTROID_AREA → TPL_CENTROID_DIRECT**
- 이유: Q18번 문항은 PT_COORD_CENTROID 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 순서←stem:「평행사변형 $ABCD$의 두 변 $AD$와 $BC$의 삼등분점을 각각 $E, F$와 $G, H$라 하자 (점의 순서는 $A-E-F-D$, $B-G-H-C$).」
- goal: 평행사변형←stem:「평행사변형 $ABCD$의 두 변 $AD$와 $BC$의 삼등분점을 각각 $E, F$와 $G, H$라 하자 (점의 순서는 $A-E-F-D$, $B-G-H-C$).」
- method: 평행(NAMED)←solution:「평행사변형 $ABCD$의 전체 넓이를 $S$, 높이를 $h$라 하자.」
- condition: (없음)

**how** Q18번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$의 전체 넓이를 $S$, 높이를 $h$라 하자.
$\overline{AF} = \dfrac{2}{3}\overline{AD}$이고 $\overline{GC} = \dfrac{2}{3}\overline{BC}$이며 $\overline{AD} = \overline{BC}$이므로
$$
\overline{AF} = \overline{GC}, \quad \overline{AF} \parallel \overline{GC}
$$
따라서 사각형 $AFGC$는 평행사변형이고, 두 대각선 $AC$와 $FG$는 서로를 이등분하므로 점 $Q$는 대각선 $\overline{AC}$의 중점이다.
$$
\overline{AQ} =  rac{1}{2}\overline{AC}
$$
$  riangle AGC$에서 $\overline{GQ}$는 중선이고, $\overline{GH} = \overline{HC}$이므로 $\overline{AH}$도 중선이다. 따라서 교점$P$는 $  riangle AGC$의 무게중심이다.
무게중심의 성질에 의해
$$
\overline{AP} : \overline{PH} = 2 : 1 \implies  rac{\overline{AP}}{\overline{AH}} =  rac{2}{3}
$$
공통각 $A$를 갖는 두 삼각형 $  riangle APQ$와 $  riangle AHC$의 넓이의 비는
$$
 rac{S_{  riangle APQ}}{S_{  riangle AHC}} =  rac{\overline{AP}}{\overline{AH}}   imes  rac{\overline{AQ}}{\overline{AC}} =  rac{2}{3}   imes  rac{1}{2} =  rac{1}{3}
$$
한편 $  riangle AHC$의 밑변 $\overline{HC} = \dfrac{1}{3}\overline{BC}$이므로
$$
S_{  riangle AHC} =  rac{1}{2}   imes \overline{HC}   imes h =  rac{1}{2}   imes  rac{1}{3}\overline{BC}   imes h =  rac{1}{6} S
$$
따라서 $  riangle APQ$의 넓이는
$$
S_{  riangle APQ} =  rac{1}{3} S_{  riangle AHC} =  rac{1}{3}   imes  rac{1}{6}S =  rac{1}{18}S
$$
$S_{  riangle APQ} = 3$이므로 평행사변형 $ABCD$의 넓이 $S$는
$$
S = 18   imes 3 = 54
$$
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

한 변의 길이가 $1$인 정삼각형 $ABC$와 한 변의 길이가 $1$인 정사각형 $BDEC$가 변 $BC$를 공유하고 있다. 서로 다른 $2$개의 주사위를 동시에 던져 나온 두 눈의 수의 합만큼 두 점 $P, Q$가 각각 움직인다. 점 $P$는 꼭짓점 $B$에서 출발하여 시계 반대 방향($B   o C   o A   o B$)으로 정삼각형의 변 위를 움직이고, 점 $Q$는 꼭짓점 $C$에서 출발하여 시계 반대 방향($C   o B   o D   o E   o C$)으로 정사각형의 변 위를 움직인다. 두 점 $P, Q$가 같은 꼭짓점에서 만나게 될 확률은?

**보기** ① $\dfrac{1}{6}$  ② $\dfrac{7}{36}$  ③ $\dfrac{2}{9}$  ④ $\dfrac{1}{4}$  ⑤ $\dfrac{5}{18}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 주사위 눈의 수의 합을 $s$라 하면 $2 \le s \le 12$이다.
2. 두 도형이 만나는 꼭짓점은 공통변$\overline{BC}$의 양 끝점인 $B$와 $C$뿐이다.
3. 점$P$의 위치 (둘레 $3$, 출발점 $B$):
4. s \equiv 0 \pmod 3 \implies B, \quad s \equiv 1 \pmod 3 \implies C, \quad s \equiv 2 \pmod 3 \implies A
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 변의 길이가 $1$인 정삼각형 $ABC$와 한 변의 길이가 $1$인 정사각형 $BDEC$가 변 $BC$를 공유하고 있다.」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 확률 > 확률의 뜻 > 경우의 수를 이용한 확률 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: Q19번 문항은 M2-RPM-107에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_PROBABILITY_PROPERTIES_APPLICATION / TPL=TPL_PROBABILITY_BASIC_COUNT_RATIO (원천과 같음) (원천과 같음)
- 이유: Q19번 문항은 PT_PROBABILITY_PROPERTIES_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「한 변의 길이가 $1$인 정삼각형 $ABC$와 한 변의 길이가 $1$인 정사각형 $BDEC$가 변 $BC$를 공유하고 있다.」
- goal: 정삼각형←stem:「한 변의 길이가 $1$인 정삼각형 $ABC$와 한 변의 길이가 $1$인 정사각형 $BDEC$가 변 $BC$를 공유하고 있다.」
- method: 꼭짓점(NAMED)←solution:「두 도형이 만나는 꼭짓점은 공통변$\overline{BC}$의 양 끝점인 $B$와 $C$뿐이다.」
- condition: (없음)

**how** Q19번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

두 주사위 눈의 수의 합을 $s$라 하면 $2 \le s \le 12$이다. 두 도형이 만나는 꼭짓점은 공통변$\overline{BC}$의 양 끝점인 $B$와 $C$뿐이다. 점$P$의 위치 (둘레 $3$, 출발점 $B$):
$$
s \equiv 0 \pmod 3 \implies B, \quad s \equiv 1 \pmod 3 \implies C, \quad s \equiv 2 \pmod 3 \implies A
$$
점 $Q$의 위치 (둘레 $4$, 출발점 $C$):
$$
s \equiv 0 \pmod 4 \implies C, \quad s \equiv 1 \pmod 4 \implies B, \quad s \equiv 2 \pmod 4 \implies D, \quad s \equiv 3 \pmod 4 \implies E
$$
두 점이 만나려면 둘 다 점 $B$에 있거나 둘 다 점 $C$에 있어야 한다. 첫째, 점$B$에서 만나는 경우:
$$
s \equiv 0 \pmod 3 \quad   ext{이고} \quad s \equiv 1 \pmod 4
$$
$2 \le s \le 12$인 정수 중 이를 만족하는 수는 $s = 9$이다. 두 눈의 합이$9$인 순서쌍은 $(3, 6), (4, 5), (5, 4), (6, 3)$의 $4$가지이다. 둘째, 점$C$에서 만나는 경우:
$$
s \equiv 1 \pmod 3 \quad   ext{이고} \quad s \equiv 0 \pmod 4
$$
$2 \le s \le 12$인 정수 중 이를 만족하는 수는 $s = 4$이다. 두 눈의 합이$4$인 순서쌍은 $(1, 3), (2, 2), (3, 1)$의 $3$가지이다.
두 경우는 동시에 일어날 수 없으므로 만나는 전체 경우의 수는
$$
4 + 3 = 7  ext{가지}
$$
전체 경우의 수는 $6   imes 6 = 36$가지이므로 구하는 확률은
$$
 rac{7}{36}
$$
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$ ngle A = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=6\rm \,cm$, $\overline{BC}=10\rm \,cm$이고, $ ngle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자. 점 $D$에서 빗변 $BC$에 내린 수선의 발을 $E$, 점 $E$를 지나고 선분 $BD$에 평행한 직선이 변 $AC$와 만나는 점을 $F$, 점 $F$에서 변 $BC$에 내린 수선의 발을 $G$라 할 때, 선분 $\overline{FG}$의 길이는?

**보기** ① $1\rm \,cm$  ② $\dfrac{9}{10}\rm \,cm$  ③ $\dfrac{11}{10}\rm \,cm$  ④ $\dfrac{6}{5}\rm \,cm$  ⑤ $\dfrac{7}{5}\rm \,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직각삼각형 $ABC$에서 피타고라스 정리에 의해
2. \overline{AC} = \sqrt{10^2 - 6^2} = 8\rm \,cm
3. $\overline{BD}$가 $ ngle B$의 이등분선이므로 각의 이등분선의 성질에 의해
4. egin{aligned}
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) (원천과 같음)
- 근거 인용: 「$ ngle A = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=6\rm \,cm$, $\overline{BC}=10\rm \,cm$이고, $ ngle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
**RPM** M2-RPM-084 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 내각의 이등분선 > 내각의 이등분선과 선분의 길이의 비 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비**
- 이유: Q20번 문항은 M2-RPM-084에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ngle)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q20번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ngle)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 ngle)

**4칸**
- given: 삼각형←stem:「$ ngle A = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=6\rm \,cm$, $\overline{BC}=10\rm \,cm$이고, $ ngle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
- goal: 직각삼각형←stem:「$ ngle A = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=6\rm \,cm$, $\overline{BC}=10\rm \,cm$이고, $ ngle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
- method: 피타고라스정리(NAMED)←solution:「직각삼각형 $ABC$에서 피타고라스 정리에 의해」
- condition: (없음)

**how** Q20번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ngle)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ABC$에서 피타고라스 정리에 의해
$$
\overline{AC} = \sqrt{10^2 - 6^2} = 8\rm \,cm
$$
$\overline{BD}$가 $ ngle B$의 이등분선이므로 각의 이등분선의 성질에 의해
$$
 egin{aligned}
\overline{AD} : \overline{DC} &= \overline{AB} : \overline{BC} = 6 : 10 = 3 : 5 \
\overline{AD} &= 8   imes  rac{3}{3+5} = 3\rm \,cm \
\overline{DC} &= 8   imes  rac{5}{3+5} = 5\rm \,cm
\end{aligned}
$$
$  riangle ABD$와 $  riangle EBD$에서 $ ngle A =  ngle DEB = 90^\circ$, $ ngle ABD =  ngle EBD$, $\overline{BD}$는 공통이므로
$$
  riangle ABD \equiv   riangle EBD \quad (  ext{RHA 합동})
$$
따라서 $\overline{DE} = \overline{AD} = 3\rm \,cm$이다. 직각삼각형$CDE$에서 피타고라스 정리에 의해
$$
\overline{CE} = \sqrt{\overline{DC}^2 - \overline{DE}^2} = \sqrt{5^2 - 3^2} = 4\rm \,cm
$$
$\overline{EF} \parallel \overline{BD}$이므로 $  riangle CEF \sim   riangle CBD$이고 닮음비는
$$
\overline{CE} : \overline{CB} = 4 : 10 = 2 : 5
$$
따라서 $\overline{CF} : \overline{CD} = 2 : 5$이다.
$\overline{FG} \perp \overline{BC}$이고 $\overline{DE} \perp \overline{BC}$이므로 $\overline{FG} \parallel \overline{DE}$이다.
$  riangle CGF \sim   riangle CED$이고 닮음비는 $\overline{CF} : \overline{CD} = 2 : 5$이므로
$$
 egin{aligned}
\overline{FG} : \overline{DE} &= 2 : 5 \
\overline{FG} : 3 &= 2 : 5 \
5   imes \overline{FG} &= 6 \
\overline{FG} &=  rac{6}{5}\rm \,cm
\end{aligned}
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 1] 사각형 $ABCD$에서 $ ngle A =  ngle C = 90^\circ$이고 $\overline{AB}=8\rm \,cm$, $\overline{AD}=4\rm \,cm$, $\overline{BC}=2\rm \,cm$, $\overline{CD}=x\rm \,cm$일 때, $x$의 값을 구하고 그 과정을 서술하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2\sqrt{19}\rm \,cm$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 대각선 $\overline{BD}$를 그으면 $  riangle ABD$와 $  riangle BCD$는 각각 빗변이 $\overline{BD}$인 직각삼각형이다.
2. 직각삼각형$ABD$에서 피타고라스 정리에 의해
3. egin{aligned}
4. \overline{BD}^2 &= \overline{AB}^2 + \overline{AD}^2 \
- 작성자 답: $2\sqrt{19}\rm \,cm$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-07(피타고라스 정리) / M2-07-PYTHAGOREAN_APPLICATION(피타고라스 정리의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 사각형 $ABCD$에서 $ ngle A =  ngle C = 90^\circ$이고 $\overline{AB}=8\rm \,cm$, $\overline{AD}=4\rm \,cm$, $\overline{BC}=2\rm \,cm$, $\overline{CD}=x\rm \,cm$일 때, $x$의 값을 구하고 그 과정을 서술하시오.」
**RPM** M2-RPM-105 [도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 도형에의 활용 > 평면도형 길이] **원천→판정: 도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 피타고라스 정리의 활용 > 평면도형에서의 활용 → 도형의 닮음과 피타고라스 정리 > 피타고라스 정리 > 도형에의 활용 > 평면도형 길이**
- 이유: Q21번 문항은 M2-RPM-105에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_M2_PYTHAGOREAN_RELATION / TPL=TPL_M2_PYTHAGOREAN_SIDE_LENGTH **원천→판정: PT_PYTHAGORAS_APPLICATION → PT_M2_PYTHAGOREAN_RELATION** **원천→판정: TPL_PYTHAGORAS_QUADRILATERAL → TPL_M2_PYTHAGOREAN_SIDE_LENGTH**
- 이유: Q21번 문항은 PT_M2_PYTHAGOREAN_RELATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「[서술형 1] 사각형 $ABCD$에서 $ ngle A =  ngle C = 90^\circ$이고 $\overline{AB}=8\rm \,cm$, $\overline{AD}=4\rm \,cm$, $\overline{BC}=2\rm \,cm$, $\overline{CD}=x\rm \,cm$일 때, $x$의 값을 구하고 그 과정을 서술하시오.」
- goal: 삼각형←solution:「대각선 $\overline{BD}$를 그으면 $  riangle ABD$와 $  riangle BCD$는 각각 빗변이 $\overline{BD}$인 직각삼각형이다.」
- method: 직각삼각형(NAMED)←solution:「대각선 $\overline{BD}$를 그으면 $  riangle ABD$와 $  riangle BCD$는 각각 빗변이 $\overline{BD}$인 직각삼각형이다.」
- condition: (없음)

**how** Q21번 문항으로 M2-07 단원의 기본 개념과 성질을 적용하여 $2\sqrt{19}\rm \,cm$을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

대각선 $\overline{BD}$를 그으면 $  riangle ABD$와 $  riangle BCD$는 각각 빗변이 $\overline{BD}$인 직각삼각형이다. 직각삼각형$ABD$에서 피타고라스 정리에 의해
$$
 egin{aligned}
\overline{BD}^2 &= \overline{AB}^2 + \overline{AD}^2 \
&= 8^2 + 4^2 \
&= 64 + 16 \
&= 80
\end{aligned}
$$
직각삼각형 $BCD$에서 피타고라스 정리에 의해
$$
\overline{BD}^2 = \overline{BC}^2 + \overline{CD}^2
$$
위에서 구한 $\overline{BD}^2 = 80$을 대입하면
$$
 egin{aligned}
80 &= 2^2 + x^2 \
80 &= 4 + x^2 \
x^2 &= 76
\end{aligned}
$$
길이는 양수이므로
$$
x = \sqrt{76} = 2\sqrt{19}\rm \,cm
$$
따라서 $x$의 값은 $2\sqrt{19}\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 2] 어느 지역에서 비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이고, 비가 오지 않은 다음 날 비가 올 확률은 $\dfrac{1}{3}$이라고 한다. 월요일에 비가 왔을 때, 이틀 후인 수요일에 비가 올 확률을 구하고 그 과정을 서술하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{37}{75}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 월요일에 비가 왔으므로, 화요일의 날씨에 따라 다음의 두 가지 경우로 나누어 생각한다.
2. 첫째, 화요일에 비가 오고, 수요일에도 비가 오는 경우:
3. 비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이므로
4. P_1 =  rac{3}{5}   imes  rac{3}{5} =  rac{9}{25}
- 작성자 답: $\dfrac{37}{75}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 어느 지역에서 비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이고, 비가 오지 않은 다음 날 비가 올 확률은 $\dfrac{1}{3}$이라고 한다.」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 계산 > 연속하여 일어나는 사건의 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q22번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 rac)
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=TPL_M2_BASIC_COUNTING_ADD_CASES **원천→판정: PT_PROBABILITY_CALCULATION → PT_M2_BASIC_COUNTING_CASE_SPLIT** **원천→판정: TPL_PROBABILITY_PRODUCT_RULE → TPL_M2_BASIC_COUNTING_ADD_CASES**
- 이유: Q22번 문항은 PT_M2_BASIC_COUNTING_CASE_SPLIT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 rac)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 rac)

**4칸**
- given: 확률←stem:「[서술형 2] 어느 지역에서 비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이고, 비가 오지 않은 다음 날 비가 올 확률은 $\dfrac{1}{3}$이라고 한다.」
- goal: 인수←stem:「월요일에 비가 왔을 때, 이틀 후인 수요일에 비가 올 확률을 구하고 그 과정을 서술하시오.」
- method: 법칙(NAMED)←solution:「두 경우는 동시에 일어날 수 없으므로, 수요일에 비가 올 확률은 합의 법칙에 의해」
- condition: (없음)

**how** Q22번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 $\dfrac{37}{75}$을(를) 바르게 구하였다. (문항 토큰 rac)

<details><summary>저장 해설 (판정 검토용)</summary>

월요일에 비가 왔으므로, 화요일의 날씨에 따라 다음의 두 가지 경우로 나누어 생각한다.
첫째, 화요일에 비가 오고, 수요일에도 비가 오는 경우:
비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이므로
$$
P_1 =  rac{3}{5}   imes  rac{3}{5} =  rac{9}{25}
$$
둘째, 화요일에 비가 오지 않고, 수요일에 비가 오는 경우:
비가 온 다음 날 비가 오지 않을 확률은 $1 - \dfrac{3}{5} = \dfrac{2}{5}$이고, 비가 오지 않은 다음 날 비가 올 확률은$\dfrac{1}{3}$이므로
$$
P_2 =  rac{2}{5}   imes  rac{1}{3} =  rac{2}{15}
$$
두 경우는 동시에 일어날 수 없으므로, 수요일에 비가 올 확률은 합의 법칙에 의해
$$
 egin{aligned}
P &= P_1 + P_2 \
&=  rac{9}{25} +  rac{2}{15} \
&=  rac{27}{75} +  rac{10}{75} \
&=  rac{37}{75}
\end{aligned}
$$
따라서 수요일에 비가 올 확률은 $\dfrac{37}{75}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 3] $0, 1, 2, 3, 4, 5$의 숫자가 각각 하나씩 적힌 $6$장의 카드 중에서 서로 다른 $2$장을 임의로 뽑아 두 자리 자연수를 만들 때, 그 수가 홀수일 확률을 구하고 그 과정을 서술하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{12}{25}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 첫째, 만들 수 있는 두 자리 자연수의 전체 개수를 구한다. (문항 토큰 imes)
2. 십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5$의 $5$가지이다.
3. 일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지$5$장의 카드 중 하나가 올 수 있으므로 $5$가지이다.
4. 따라서 전체 경우의 수는 곱의 법칙에 의해
- 작성자 답: $\dfrac{12}{25}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_BASIC(확률의 뜻과 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] $0, 1, 2, 3, 4, 5$의 숫자가 각각 하나씩 적힌 $6$장의 카드 중에서 서로 다른 $2$장을 임의로 뽑아 두 자리 자연수를 만들 때, 그 수가 홀수일 확률을 구하고 그 과정을 서술하시오.」
**RPM** M2-RPM-113 [확률 > 확률 > 확률의 뜻 > 동등가능한 경우] **원천→판정: 확률 > 확률 > 확률의 뜻 > 경우의 수를 이용한 확률 → 확률 > 확률 > 확률의 뜻 > 동등가능한 경우**
- 이유: Q23번 문항은 M2-RPM-113에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 imes)
**유형** PT=PT_PROBABILITY_PROPERTIES_APPLICATION / TPL=TPL_PROBABILITY_BASIC_COUNT_RATIO (원천과 같음) (원천과 같음)
- 이유: Q23번 문항은 PT_PROBABILITY_PROPERTIES_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 imes)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 imes)

**4칸**
- given: 자연수←stem:「[서술형 3] $0, 1, 2, 3, 4, 5$의 숫자가 각각 하나씩 적힌 $6$장의 카드 중에서 서로 다른 $2$장을 임의로 뽑아 두 자리 자연수를 만들 때, 그 수가 홀수일 확률을 구하고 그 과정을 서술하시오.」
- goal: 확률←stem:「[서술형 3] $0, 1, 2, 3, 4, 5$의 숫자가 각각 하나씩 적힌 $6$장의 카드 중에서 서로 다른 $2$장을 임의로 뽑아 두 자리 자연수를 만들 때, 그 수가 홀수일 확률을 구하고 그 과정을 서술하시오.」
- method: 개수(NAMED)←solution:「첫째, 만들 수 있는 두 자리 자연수의 전체 개수를 구한다.」
- condition: (없음)

**how** Q23번 문항으로 M2-08 단원의 기본 개념과 성질을 적용하여 $\dfrac{12}{25}$을(를) 바르게 구하였다. (문항 토큰 imes)

<details><summary>저장 해설 (판정 검토용)</summary>

첫째, 만들 수 있는 두 자리 자연수의 전체 개수를 구한다.
십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5$의 $5$가지이다. 일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지$5$장의 카드 중 하나가 올 수 있으므로 $5$가지이다.
따라서 전체 경우의 수는 곱의 법칙에 의해
$$
N = 5   imes 5 = 25  ext{가지}
$$
둘째, 만든 두 자리 자연수가 홀수인 경우의 수를 구한다.
홀수가 되려면 일의 자리에 올 수 있는 숫자는 $1, 3, 5$의 $3$가지이다. 일의 자리의 숫자를 하나 정했을 때, 십의 자리에는$0$과 이미 일의 자리에 쓰인 숫자를 제외해야 하므로 올 수 있는 숫자는
$$
6 - 2 = 4  ext{가지}
$$
따라서 홀수인 두 자리 자연수의 개수는 곱의 법칙에 의해
$$
3   imes 4 = 12  ext{가지}
$$
셋째, 구하는 확률은
$$
P =  rac{12}{25}
$$
따라서 구하는 확률은 $\dfrac{12}{25}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 4] 세 평행한 직선 $l, m, n$이 두 직선과 만나는 점을 각각 $A, B, C$와 $D, E, F$라 하자. $\overline{AB}=6\rm \,cm$, $\overline{BC}=9\rm \,cm$, $\overline{AD}=10\rm \,cm$, $\overline{CF}=25\rm \,cm$일 때, 선분 $\overline{BE}$의 길이를 구하고 그 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $16\rm \,cm$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $A$를 지나고 직선 $DF$에 평행한 직선을 그어 직선 $m, n$과 만나는 점을 각각 $E', F'$이라 하자.
2. $\overline{AD} \parallel \overline{E'E} \parallel \overline{F'F}$이고 $\overline{AF'} \parallel \overline{DF}$이므로 사각형 $ADE'E$와 사각형 $ADF'F$는 모두 평행사변형이다.
3. 따라서 대변의 길이가 같으므로
4. \overline{BE'} = \overline{CF'} = \overline{AD} = 10\rm \,cm
- 작성자 답: $16\rm \,cm$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_LENGTH_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 세 평행한 직선 $l, m, n$이 두 직선과 만나는 점을 각각 $A, B, C$와 $D, E, F$라 하자.」
**RPM** M2-RPM-091 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 평행선 사이의 선분의 길이의 비 > 사다리꼴에서 평행선과 선분의 길이의 비 → 도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례**
- 이유: Q24번 문항은 M2-RPM-091에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_PARALLEL_SEGMENT_RATIO / TPL=TPL_PARALLEL_SEGMENT_RATIO_GENERAL (원천과 같음) (원천과 같음)
- 이유: Q24번 문항은 PT_PARALLEL_SEGMENT_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 직선←stem:「[서술형 4] 세 평행한 직선 $l, m, n$이 두 직선과 만나는 점을 각각 $A, B, C$와 $D, E, F$라 하자.」
- goal: 평행←stem:「[서술형 4] 세 평행한 직선 $l, m, n$이 두 직선과 만나는 점을 각각 $A, B, C$와 $D, E, F$라 하자.」
- method: 지나(NAMED)←solution:「점 $A$를 지나고 직선 $DF$에 평행한 직선을 그어 직선 $m, n$과 만나는 점을 각각 $E', F'$이라 하자.」
- condition: (없음)

**how** Q24번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 $16\rm \,cm$을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

점 $A$를 지나고 직선 $DF$에 평행한 직선을 그어 직선 $m, n$과 만나는 점을 각각 $E', F'$이라 하자.
$\overline{AD} \parallel \overline{E'E} \parallel \overline{F'F}$이고 $\overline{AF'} \parallel \overline{DF}$이므로 사각형 $ADE'E$와 사각형 $ADF'F$는 모두 평행사변형이다.
따라서 대변의 길이가 같으므로
$$
\overline{BE'} = \overline{CF'} = \overline{AD} = 10\rm \,cm
$$
선분 $\overline{F'F}$의 길이는
$$
\overline{F'F} = \overline{CF} - \overline{CF'} = 25 - 10 = 15\rm \,cm
$$
$  riangle ACF'$에서 $\overline{E'E} \parallel \overline{F'F}$이므로 삼각형에서 평행선 사이의 선분의 길이의 비 성질에 의해
$$
 egin{aligned}
\overline{AB} : \overline{AC} &= \overline{E'E} : \overline{F'F} \
6 : (6 + 9) &= \overline{E'E} : 15 \
6 : 15 &= \overline{E'E} : 15 \
2 : 5 &= \overline{E'E} : 15 \
5   imes \overline{E'E} &= 30 \
\overline{E'E} &= 6\rm \,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{BE}$의 길이는
$$
 egin{aligned}
\overline{BE} &= \overline{BE'} + \overline{E'E} \
&= 10 + 6 \
&= 16\rm \,cm
\end{aligned}
$$
따라서 선분 $\overline{BE}$의 길이는 $16\rm \,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
