# 검수 묶음 — 26_삼산중_1학기_중간_중3_유사2

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 23, SELF_CONTAINED 1
- 난이도 분포: 1단계 5, 2단계 15, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q19**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q24**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 보기 중 옳은 설명은? [3점]

**보기** ① 모든 실수는 각각 수직선 위의 한 점에 대응한다.  ② 근호를 사용하여 나타낸 수는 모두 무리수이다.  ③ 무한소수는 모두 무리수이다.  ④ 0의 제곱근은 존재하지 않는다.  ⑤ 실수는 유리수와 자연수로 이루어져 있다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 실수는 수직선 위의 점과 일대일 대응하므로 1번 명제 '모든 실수는 각각 수직선 위의 한 점에 대응한다'는 참이다.
2. 2. 2번은 sqrt(4)=2와 같이 근호를 써도 유리수가 될 수 있어 거짓이고, 3번은 순환소수가 유리수이므로 거짓이다.
3. 3. 4번은 0의 제곱근이 0 하나 존재하므로 거짓이고, 5번은 실수가 유리수와 무리수로 이루어지므로 거짓이다.
4. 4. 따라서 옳은 설명은 1번이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「모든 실수는 각각 수직선 위의 한 점에 대응한다.」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수와 수직선 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 실수 체계와 무리수, 유리수, 순환소수, 0의 제곱근 등 실수의 기본 성질을 판별하는 M3-RPM-003 레코드에 해당합니다.
**유형** PT=PT_M3_REAL_NUMBER_CLASSIFICATION / TPL=TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT **원천→판정: PT_M3_REAL_NUMBER_PROPERTIES → PT_M3_REAL_NUMBER_CLASSIFICATION** **원천→판정: TPL_M3_REAL_NUMBER_LINE_CORRESPONDENCE → TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT**
- 이유: 수직선과 실수의 대응 및 유리수, 무리수, 0의 제곱근에 관한 명제의 진위를 가리는 TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT 템플릿입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 실수와 수직선, 0의 제곱근 등 기본 정의 1단계를 판별하는 기본 문항입니다.

**4칸**
- given: 실수←choices:「모든 실수는 각각 수직선 위의 한 점에 대응한다.」
- goal: 판정←stem:「다음 보기 중 옳은 설명은? [3점]」
- method: 분류(IMPLIED)←solution:「실수와 수직선의 성질 및 수의 체계를 분석한다.」 — 실수와 유리수, 무리수 분류 체계 분석
- condition: (없음)

**how** 보기의 1번부터 5번까지 명제를 검토하여 실수가 수직선에 1대1 대응함을 확인하고 0의 제곱근이 0임을 감안하여 1번을 정답으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

실수와 수직선의 성질 및 수의 체계를 분석한다.

1단계: 보기의 각 문장을 검토한다. ① 모든 실수는 수직선 위의 한 점에 일대일로 대응하며, 수직선은 실수 전체로 완전히 메울 수 있다. 따라서 참이다. ② $\sqrt{9}=3$과 같이 근호 안의 수가 제곱수이면 유리수가 되므로 근호를 썼다고 해서 모두 무리수인 것은 아니다. 따라서 거짓이다. ③ 무한소수 중에서 순환소수는 분수로 나타낼 수 있는 유리수이므로 모든 무한소수가 무리수인 것은 아니다. 따라서 거짓이다. ④ $0$의 제곱근은 $0$ 하나뿐이므로 존재하지 않는다는 설명은 거짓이다. ⑤ 실수는 유리수와 무리수로 이루어져 있으며 자연수는 유리수에 포함된다. 따라서 거짓이다.

2단계: 결론을 도출한다. 따라서 옳은 설명은 ①이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 계산 결과가 옳은 것은? [3점]

**보기** ① $(\sqrt{7})^2 = 49$  ② $\sqrt{0.004} \times \sqrt{10} = 0.2$  ③ $\sqrt{(-9)^2} = -9$  ④ $\sqrt{169} - (-\sqrt{5})^2 = 6$  ⑤ $\sqrt{(-0.04)^2} \times (\sqrt{50})^2 = 5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 1번은 (sqrt(7))^2 = 7 != 49, 3번은 sqrt((-9)^2) = 9 != -9로 거짓이다.
2. 2. 2번은 sqrt(0.004) * sqrt(10) = sqrt(0.04) = 0.2이므로 참이다.
3. 3. 4번은 sqrt(169) - (-sqrt(5))^2 = 13 - 5 = 8 != 6이고, 5번은 0.04 * 50 = 2 != 5이므로 거짓이다.
4. 4. 따라서 계산 결과가 옳은 것은 2번이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 계산 결과가 옳은 것은? [3점]」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 성질 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호의 곱셈 성질 sqrt(0.004) * sqrt(10) = sqrt(0.04) = 0.2를 계산하는 M3-RPM-007 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_SQUARE_ROOT_ARITHMETIC_CHECK → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RADICAL_BASIC_CALCULATION → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호의 곱셈과 제곱근 성질 sqrt(0.004) * sqrt(10) = 0.2 등의 기본 계산 연산 템플릿입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sqrt(0.004) * sqrt(10) = 0.2 등 근호의 기본 곱셈 및 성질을 단일 단계로 계산하는 1단계 난이도 문항입니다.

**4칸**
- given: 제곱근←solution:「제곱근의 기본 성질 $\sqrt{a^2}=|a|$ 및 곱셈 성질」
- goal: 판정←stem:「다음 중 계산 결과가 옳은 것은? [3점]」
- method: 사칙연산(IMPLIED)←solution:「곱셈 성질 $\sqrt{a}\sqrt{b}=\sqrt{ab}$를 적용하여 각 선지를 계산한다.」 — 근호 곱셈 법칙 적용
- condition: (없음)

**how** 2번 선지에서 sqrt(0.004) * sqrt(10) = sqrt(0.04) = 0.2가 성립함을 계산하여 2번을 정답으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 기본 성질 $\sqrt{a^2}=|a|$ 및 곱셈 성질 $\sqrt{a}\sqrt{b}=\sqrt{ab}$를 적용하여 각 선지를 계산한다.

1단계: 각 선지의 계산 과정을 단계별로 확인한다. ① $(\sqrt{7})^2 = 7$이므로 우변의 $49$와 다르다. (거짓) ② $\sqrt{0.004} \times \sqrt{10} = \sqrt{0.004 \times 10} = \sqrt{0.04} = \sqrt{(0.2)^2} = 0.2$이므로 참이다. ③ $\sqrt{(-9)^2} = |-9| = 9$이므로 우변의 $-9$와 다르다. (거짓) ④ $\sqrt{169} - (-\sqrt{5})^2 = 13 - 5 = 8$이므로 우변의 $6$과 다르다. (거짓) ⑤ $\sqrt{(-0.04)^2} \times (\sqrt{50})^2 = 0.04 \times 50 = 2$이므로 우변의 $5$와 다르다. (거짓)

2단계: 결론을 도출한다. 따라서 계산 결과가 옳은 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 중 두 수 $\sqrt{6}$과 $\sqrt{18}$ 사이에 있는 수가 아닌 것은? [4점]

**보기** ① $\sqrt{10}$  ② $3.5$  ③ $\sqrt{3} + 3$  ④ $\sqrt{6} + 1$  ⑤ $2\sqrt{5} - 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 기준 수의 범위: sqrt(6) ≈ 2.45, sqrt(18) = 3*sqrt(2) ≈ 4.24이다.
2. 2. 1번 sqrt(10) ≈ 3.16, 2번 3.5 = sqrt(12.25), 4번 sqrt(6)+1 ≈ 3.45, 5번 2*sqrt(5)-1 ≈ 3.47은 모두 2.45와 4.24 사이에 있다.
3. 3. 3번 sqrt(3)+3 ≈ 1.732 + 3 = 4.732 > 4.24이므로 sqrt(18)보다 커서 범위 바깥이다.
4. 4. 따라서 사이에 있는 수가 아닌 것은 3번이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-REAL_NUMBER_OPERATIONS → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「두 수 $\sqrt{6}$과 $\sqrt{18}$ 사이에 있는 수가 아닌 것은? [4점]」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 두 무리수 sqrt(6)과 sqrt(18)의 대소 및 근삿값 범위를 다루는 M3-RPM-004 레코드입니다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_BETWEEN **원천→판정: PT_M3_IRRATIONAL_INTERVAL_CHECK → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_BETWEEN_RADICALS_MEMBERSHIP → TPL_M3_REAL_COMPARISON_BETWEEN**
- 이유: sqrt(6)과 sqrt(18) 사이에 위치하는 무리수를 어림하는 TPL_M3_REAL_COMPARISON_BETWEEN 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sqrt(6)과 sqrt(18)의 근삿값 범위를 추정하고 각 선지의 범위를 비교하는 2단계 문항입니다.

**4칸**
- given: 무리수←solution:「기준이 되는 두 무리수의 근삿값」
- goal: 판정←stem:「두 수 $\sqrt{6}$과 $\sqrt{18}$ 사이에 있는 수가 아닌 것은? [4점]」
- method: 대소비교(IMPLIED)←solution:「범위를 설정하여 각 선지의 위치를 비교한다.」 — 무리수 범위 대소 비교
- condition: (없음)

**how** sqrt(6) ≈ 2.45, sqrt(18) ≈ 4.24의 범위를 설정하고 3번 선지 sqrt(3)+3 ≈ 4.73이 sqrt(18)을 초과함을 확인하여 3번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

기준이 되는 두 무리수의 근삿값 또는 제곱 범위를 설정하여 각 선지의 위치를 비교한다.

1단계: 기준 수의 범위를 파악한다. $2^2 = 4 < 6 < 9 = 3^2$이므로 $2 < \sqrt{6} < 3$이고, $\sqrt{6} \approx 2.45$이다. $4^2 = 16 < 18 < 25 = 5^2$이므로 $4 < \sqrt{18} < 5$이고, $\sqrt{18} = 3\sqrt{2} \approx 4.24$이다. 따라서 구하는 범위는 $2.45 < x < 4.24$이다.

2단계: 각 선지의 값을 추정한다. ① $\sqrt{6} < \sqrt{10} < \sqrt{18}$이므로 범위에 포함된다. ② $3.5 = \sqrt{12.25}$이고 $6 < 12.25 < 18$이므로 범위에 포함된다. ③ $1 < \sqrt{3} < 2$에서 $\sqrt{3} \approx 1.732$이므로 $\sqrt{3} + 3 \approx 4.732$이다. 그런데 $\sqrt{18} \approx 4.24$이므로 $\sqrt{3} + 3 > \sqrt{18}$이 되어 범위 바깥에 위치한다. ④ $\sqrt{6} + 1 \approx 2.45 + 1 = 3.45$이며 $2.45 < 3.45 < 4.24$이므로 범위에 포함된다. ⑤ $\sqrt{5} \approx 2.236$이므로 $2\sqrt{5} - 1 \approx 4.472 - 1 = 3.472$이며 $2.45 < 3.472 < 4.24$이므로 범위에 포함된다.

3단계: 결론을 도출한다. 따라서 두 수 사이에 있지 않은 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

세 실수 $a = 3\sqrt{5} - 2$, $b = \sqrt{5} + 2$, $c = 7 - \sqrt{5}$ 의 대소 관계로 옳은 것은? [4점]

**보기** ① $a < b < c$  ② $a < c < b$  ③ $b < c < a$  ④ $b < a < c$  ⑤ $c < a < b$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. a - b = (3*sqrt(5) - 2) - (sqrt(5) + 2) = 2*sqrt(5) - 4 = sqrt(20) - sqrt(16) > 0이므로 a > b, 즉 b < a이다.
2. 2. c - a = (7 - sqrt(5)) - (3*sqrt(5) - 2) = 9 - 4*sqrt(5) = sqrt(81) - sqrt(80) > 0이므로 c > a, 즉 a < c이다.
3. 3. 따라서 세 수의 대소 관계는 b < a < c이다.
4. 4. 따라서 정답은 4번이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「세 실수 $a = 3\sqrt{5} - 2$, $b = \sqrt{5} + 2$, $c = 7 - \sqrt{5}$ 의 대소 관계로 옳은 것은? [4점]」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 실수의 대소 관계 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 세 실수 a, b, c의 차를 계산하여 sqrt(20) > sqrt(16), sqrt(81) > sqrt(80)으로 대소를 비교하는 M3-RPM-004 레코드입니다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_REAL_ORDER_BY_SUBTRACTION → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_THREE_RADICALS_ORDERING → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 세 수의 차 a-b = 2*sqrt(5)-4 = sqrt(20)-sqrt(16) > 0과 c-a = 9-4*sqrt(5) = sqrt(81)-sqrt(80) > 0을 구하여 대소를 비교하는 TPL_M3_REAL_COMPARISON_ORDER 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 수의 차를 구하고 근호 안의 수를 sqrt(20), sqrt(16)과 같이 제곱 비교하여 부호를 결정하는 2단계 문항입니다.

**4칸**
- given: 실수←stem:「세 실수 $a = 3\sqrt{5} - 2$, $b = \sqrt{5} + 2$」
- goal: 대소비교←stem:「대소 관계로 옳은 것은? [4점]」
- method: 사칙연산(IMPLIED)←solution:「두 실수의 차를 구하여 부호를 판정함으로써」 — 차의 부호 판별
- condition: (없음)

**how** a-b = 2*sqrt(5)-4 = sqrt(20)-sqrt(16) > 0에서 b<a, c-a = 9-4*sqrt(5) = sqrt(81)-sqrt(80) > 0에서 a<c임을 도출하여 b<a<c인 4번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 실수의 차를 구하여 부호를 판정함으로써 세 수의 대소 관계를 결정한다.

1단계: $a$와 $b$의 대소를 비교한다. $$a - b = (3\sqrt{5} - 2) - (\sqrt{5} + 2) = 2\sqrt{5} - 4$$ 근호 안으로 수를 넣어 비교하면 $2\sqrt{5} = \sqrt{20}$, $4 = \sqrt{16}$이다. $20 > 16$이므로 $\sqrt{20} > \sqrt{16}$, 즉 $a - b > 0$이다. 따라서 $a > b$, 즉 $b < a$이다.

2단계: $c$와 $a$의 대소를 비교한다. $$c - a = (7 - \sqrt{5}) - (3\sqrt{5} - 2) = 9 - 4\sqrt{5}$$ 근호 안으로 수를 넣어 비교하면 $9 = \sqrt{81}$, $4\sqrt{5} = \sqrt{80}$이다. $81 > 80$이므로 $\sqrt{81} > \sqrt{80}$, 즉 $c - a > 0$이다. 따라서 $c > a$, 즉 $a < c$이다.

3단계: 전체 대소 관계를 종합한다. $b < a$이고 $a < c$이므로 $$b < a < c$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

수직선 위의 점 $\mathrm{B}$를 기준으로, 한 변의 길이가 $3$인 두 정사각형 $\mathrm{ABCD}$와 $\mathrm{DCFE}$가 한 변을 공유하며 나란히 놓여 있다. 선분 $\mathrm{BD}$를 반지름으로 하여 원호를 그려 수직선과 만나는 점을 $\mathrm{P}$, 선분 $\mathrm{BE}$를 반지름으로 하여 원호를 그려 수직선과 만나는 점을 $\mathrm{Q}$라 할 때, 선분 $\mathrm{PQ}$의 길이는? [4점] (단, 점 $\mathrm{P}$와 $\mathrm{Q}$는 점 $\mathrm{B}$의 같은 방향에 위치한다.)

**보기** ① $\sqrt{5} - \sqrt{2}$  ② $3 + \sqrt{5}$  ③ $6\sqrt{2} - 3\sqrt{3}$  ④ $2\sqrt{5} - 2\sqrt{2}$  ⑤ $3\sqrt{5} - 3\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 정사각형 ABCD의 가로와 세로가 3이므로 피타고라스 정리에 의해 대각선 BD = sqrt(3^2 + 3^2) = 3*sqrt(2)이다. BP = BD = 3*sqrt(2).
2. 2. 직사각형 ABFE의 가로는 3+3=6, 세로는 3이므로 대각선 BE = sqrt(6^2 + 3^2) = sqrt(45) = 3*sqrt(5)이다. BQ = BE = 3*sqrt(5).
3. 3. P와 Q는 점 B의 같은 방향에 위치하므로 PQ = BQ - BP = 3*sqrt(5) - 3*sqrt(2)이다.
4. 4. 따라서 정답은 5번이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 한 변의 길이가 $3$인 두 정사각형 $\mathrm{ABCD}$와 $\mathrm{DCFE}$가 한 변을 공유하며 나란히 놓여 있다.

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_LINE(수직선 위의 실수 표현) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_LINE**
- 근거 인용: 「수직선 위의 점 $\mathrm{B}$를 기준으로」
**RPM** M3-RPM-005 [실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 수직선 위의 무리수 점 → 실수와 그 연산 > 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치**
- 이유: 정사각형 ABCD의 대각선 BD, BE를 회전하여 수직선 위 점 PQ 길이를 구하는 M3-RPM-005 레코드입니다.
**유형** PT=PT_M3_REAL_NUMBER_LINE / TPL=TPL_M3_NUMBER_LINE_SQUARE_ROTATION **원천→판정: PT_M3_SQUARE_ROOT_NUMBER_LINE_SEGMENT → PT_M3_REAL_NUMBER_LINE** **원천→판정: TPL_M3_ADJACENT_SQUARE_DIAGONAL_DIFFERENCE → TPL_M3_NUMBER_LINE_SQUARE_ROTATION**
- 이유: 정사각형 ABCD의 대각선 BD=3*sqrt(2), BE=3*sqrt(5)를 반지름으로 원호를 회전하여 수직선 위 PQ 거리를 구하는 TPL_M3_NUMBER_LINE_SQUARE_ROTATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 한 변이 3인 두 정사각형 ABCD에서 대각선 BD, BE 길이를 피타고라스 정리로 구하고 PQ 거리를 구하는 2단계 문항입니다.

**4칸**
- given: 정사각형←stem:「한 변의 길이가 $3$인 두 정사각형 $\mathrm{ABCD}$와 $\mathrm{DCFE}$가 한 변을 공유하며 나란히 놓여 있다.」<br>수직선←stem:「수직선 위의 점 $\mathrm{B}$를 기준으로」
- goal: 길이←stem:「선분 $\mathrm{PQ}$의 길이는? [4점]」
- method: 피타고라스정리(IMPLIED)←solution:「피타고라스 정리를 이용해 구한 후 두 점 사이의 거리를 계산한다.」 — 대각선 길이 계산에 피타고라스 정리 적용
- condition: (없음)

**how** 정사각형 ABCD의 대각선 BD = 3*sqrt(2)와 직사각형의 대각선 BE = sqrt(6^2+3^2) = 3*sqrt(5)를 구하고 PQ = 3*sqrt(5)-3*sqrt(2)를 계산하여 5번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형 및 정사각형의 대각선 길이를 피타고라스 정리를 이용해 구한 후 두 점 사이의 거리를 계산한다.

1단계: 대각선 $\mathrm{BD}$의 길이를 구한다. 정사각형 $\mathrm{ABCD}$의 가로와 세로의 길이가 각각 $3$이므로 직각삼각형에서 $$\mathrm{BD} = \sqrt{3^2 + 3^2} = \sqrt{9 + 9} = \sqrt{18} = 3\sqrt{2}$$ 원호를 회전하여 수직선 위에 점 $\mathrm{P}$를 잡았으므로 $\mathrm{BP} = \mathrm{BD} = 3\sqrt{2}$이다.

2단계: 대각선 $\mathrm{BE}$의 길이를 구한다. 두 정사각형을 이어 붙인 직사각형 $\mathrm{ABFE}$의 가로 길이는 $3 + 3 = 6$이고 세로 길이는 $3$이다. 직각삼각형 $\mathrm{ABE}$에서 피타고라스 정리에 의해 $$\mathrm{BE} = \sqrt{6^2 + 3^2} = \sqrt{36 + 9} = \sqrt{45} = 3\sqrt{5}$$ 원호를 회전하여 수직선 위에 점 $\mathrm{Q}$를 잡았으므로 $\mathrm{BQ} = \mathrm{BE} = 3\sqrt{5}$이다.

3단계: 선분 $\mathrm{PQ}$의 길이를 계산한다. 두 점 $\mathrm{P}, \mathrm{Q}$는 점 $\mathrm{B}$로부터 같은 방향에 놓여 있으므로 $$\mathrm{PQ} = \mathrm{BQ} - \mathrm{BP} = 3\sqrt{5} - 3\sqrt{2}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

$1 < x < y$일 때, 보기의 네 수를 작은 것부터 차례대로 나열한 것으로 옳은 것은? [4점] <보기> $$A = \frac{x}{y}, \quad B = \sqrt{\frac{x}{y}}, \quad C = \sqrt{\frac{y}{x}}, \quad D = y$$

**보기** ① $A, B, C, D$  ② $A, C, B, D$  ③ $B, A, C, D$  ④ $D, C, B, A$  ⑤ $C, A, B, D$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 1 < x < y이므로 양변을 y로 나누면 0 < x/y < 1이다. 0 < t < 1에서 t < sqrt(t)이므로 A = x/y < sqrt(x/y) = B < 1이다.
2. 2. y/x > 1이므로 C = sqrt(y/x) > 1이다. 따라서 B < 1 < C이다.
3. 3. C^2 = y/x < y (x > 1이므로), y < y^2 = D^2 (y > 1이므로) 따라서 C < D이다.
4. 4. 따라서 작은 것부터 차례대로 나열하면 A, B, C, D이다. 따라서 정답은 1번이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_COMPARISON(실수와 무리수의 대소 비교) (원천과 같음) **원천→판정: M3-01-SQUARE_ROOT_REAL_NUMBER → M3-01-REAL_NUMBER_COMPARISON**
- 근거 인용: 「$1 < x < y$일 때, 보기의 네 수를 작은 것부터 차례대로 나열한 것으로 옳은 것은? [4점]」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 문자를 포함한 제곱근의 대소 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 1 < x < y 조건에서 A, B, C, D의 대소를 문자로 비교하는 M3-RPM-004 레코드입니다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_ORDER **원천→판정: PT_M3_VARIABLE_RADICAL_ORDERING → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_FRACTION_ROOT_CHAIN_ORDER → TPL_M3_REAL_COMPARISON_ORDER**
- 이유: 0 < x/y < 1에서 A < B < 1 < C < D로 대소를 비교하는 TPL_M3_REAL_COMPARISON_ORDER 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 1 < x < y 조건에서 분수식과 근호 식 A, B, C, D의 대소를 2단계로 연쇄 비교하는 문항입니다.

**4칸**
- given: 실수←solution:「실수 $t$에 대하여 $t < \sqrt{t} < 1$이 성립한다.」
- goal: 대소비교←solution:「상대적 크기를 논리적으로 비교한다.」
- method: 대소비교(IMPLIED)←solution:「전체 대소 순서를 정리한다.」 — 부등식과 제곱근 성질로 대소 순서 비교
- condition: (없음)

**how** 0 < x/y < 1에서 A < B < 1이고 C = sqrt(y/x) > 1, C < D임을 보여 A, B, C, D 순서인 1번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$1 < x < y$의 부등식 조건을 이용하여 분수식과 근호 식의 상대적 크기를 논리적으로 비교한다.

1단계: $A$와 $B$의 크기를 비교한다. $1 < x < y$이므로 양변을 $y$로 나누면 $0 < \frac{x}{y} < 1$이다. $0 < t < 1$인 실수 $t$에 대하여 $t < \sqrt{t} < 1$이 성립한다. 따라서 $A = \frac{x}{y} < \sqrt{\frac{x}{y}} = B < 1$이다.

2단계: $B$와 $C$의 크기를 비교한다. $1 < x < y$에서 양변을 $x$로 나누면 $\frac{y}{x} > 1$이다. $1$보다 큰 수의 제곱근은 $1$보다 크므로 $C = \sqrt{\frac{y}{x}} > 1$이다. 앞서 $B < 1$이었으므로 $B < C$이다.

3단계: $C$와 $D$의 크기를 비교한다. $C^2 = \frac{y}{x}$이고 $D^2 = y^2$이다. $1 < x$이므로 $\frac{y}{x} < y$가 성립한다. 또한 $1 < y$이므로 $y < y^2$이다. 따라서 $C^2 = \frac{y}{x} < y < y^2 = D^2$이므로 $C < D$이다.

4단계: 전체 대소 순서를 정리한다. $$A < B < 1 < C < D$$ 따라서 작은 것부터 차례대로 나열한 것은 $A, B, C, D$이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

세 실수 $\sqrt{x}, \sqrt{y}, \sqrt{x+y}$가 모두 무리수가 되도록 하는 $8$ 이하의 자연수 $x, y$의 순서쌍 $(x, y)$의 개수는? [5점]

**보기** ① $28$  ② $30$  ③ $32$  ④ $34$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 8 이하의 자연수 1부터 8 중 제곱수는 1, 4이다. sqrt(x)와 sqrt(y)가 모두 무리수이려면 x, y in {2, 3, 5, 6, 7, 8}이어야 하며, 전체 순서쌍 개수는 6 * 6 = 36개이다.
2. 2. sqrt(x+y)가 유리수가 되는 경우, 즉 x+y가 완전제곱수 4, 9, 16이 되는 순서쌍을 센다.
3. 3. x+y=4는 (2,2)의 1개, x+y=9는 (2,7), (3,6), (6,3), (7,2)의 4개, x+y=16은 (8,8)의 1개로 총 1+4+1 = 6개이다.
4. 4. 따라서 구하는 순서쌍 개수는 36 - 6 = 30개이다. 따라서 정답은 2번이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-SQUARE_ROOT_REAL_NUMBER(제곱근과 실수) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 실수 $\sqrt{x}, \sqrt{y}, \sqrt{x+y}$가 모두 무리수가 되도록 하는 $8$ 이하의 자연수」
**RPM** M3-RPM-003 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 무리수가 될 조건 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 무리수 판별**
- 이유: 세 수 sqrt(x), sqrt(y), sqrt(x+y)가 무리수가 되는 전체 36개 중 6개를 빼서 30개를 구하는 M3-RPM-003 레코드입니다.
**유형** PT=PT_M3_SQUARE_ROOT_PROPERTY / TPL=TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION **원천→판정: PT_M3_SIMULTANEOUS_IRRATIONAL_PAIRS → PT_M3_SQUARE_ROOT_PROPERTY** **원천→판정: TPL_M3_COMPLEMENTARY_SQUARE_SUM_COUNT → TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION**
- 이유: 자연수 x, y에 대해 sqrt(x), sqrt(y), sqrt(x+y)가 무리수가 되는 36개 중 합이 4, 9, 16인 6개를 제외하는 TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION 템플릿입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 제곱수 1, 4를 제외한 6*6=36개에서 x+y=4, 9, 16이 되는 6개를 여사건으로 제외하여 30개를 구하는 3단계 심화 문항입니다.

**4칸**
- given: 무리수←stem:「세 실수 $\sqrt{x}, \sqrt{y}, \sqrt{x+y}$가 모두 무리수가 되도록 하는」<br>자연수←stem:「$8$ 이하의 자연수 $x, y$의 순서쌍」
- goal: 개수←stem:「순서쌍 $(x, y)$의 개수는? [5점]」
- method: 완전제곱수(IMPLIED)←solution:「$4 \le x+y \le 16$ 범위의 완전제곱수는 $4, 9, 16$이다.」 — 합이 완전제곱수가 되는 경우를 여사건으로 제외
- condition: (없음)

**how** 8 이하 자연수 중 1, 4를 뺀 6개의 수로 만든 36개 쌍에서 x+y가 4, 9, 16인 6개를 빼서 30개로 2번을 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

여사건의 원리를 사용하여 전체 순서쌍에서 제곱수가 되는 경우를 제외한다.

1단계: $\sqrt{x}$와 $\sqrt{y}$가 무리수가 되는 자연수 $x, y$의 후보군을 정한다. $8$ 이하의 자연수 ${1, 2, 3, 4, 5, 6, 7, 8}$ 중 제곱수는 $1, 4$이다. 따라서 $\sqrt{x}$와 $\sqrt{y}$가 모두 무리수가 되려면 $$x, y \in {2, 3, 5, 6, 7, 8}$$ 이어야 한다. 가능한 원소는 각각 $6$개이므로 기초 순서쌍 $(x, y)$의 개수는 $$6 \times 6 = 36\text{개}$$

2단계: $\sqrt{x+y}$가 유리수(자연수), 즉 $x+y$가 제곱수가 되는 순서쌍을 찾아 제외한다. $x, y \ge 2$이므로 $x+y \ge 4$이고, $x, y \le 8$이므로 $x+y \le 16$이다. $4 \le x+y \le 16$ 범위의 완전제곱수는 $4, 9, 16$이다.

- $x+y = 4$: $(2, 2)$의 $1$개  
- $x+y = 9$: $x, y \in {2, 3, 5, 6, 7, 8}$에서 합이 $9$인 순서쌍은 $(2, 7), (3, 6), (6, 3), (7, 2)$의 $4$개 ($1+8=9$는 $1$이 제외되었으므로 불가능)  
- $x+y = 16$: $x=8, y=8$인 $(8, 8)$의 $1$개 제외해야 하는 순서쌍의 총 개수는 $$1 + 4 + 1 = 6\text{개}$$

3단계: 조건을 만족하는 순서쌍의 개수를 구한다. $$36 - 6 = 30\text{개}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 제곱근의 계산 결과로 옳은 것은? [3점]

**보기** ① $\frac{\sqrt{7}-\sqrt{5}}{\sqrt{5}} = \frac{\sqrt{7}-5}{5}$  ② $\sqrt{24} + 3\sqrt{6} - \sqrt{54} = 4\sqrt{6}$  ③ $5\sqrt{2} + 3\sqrt{7} - 2\sqrt{2} + 4\sqrt{7} = 3\sqrt{2} + 7\sqrt{7}$  ④ $\frac{1}{\sqrt{10}}\left(\frac{\sqrt{5}}{2} + \sqrt{2}\right) = \frac{\sqrt{2}}{4} + 1$  ⑤ $\sqrt{12}\left(\frac{\sqrt{7}}{\sqrt{3}} + \sqrt{3}\right) - 3\sqrt{7} = 6 + \sqrt{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 1번은 (sqrt(7)-sqrt(5))/sqrt(5) = (sqrt(35)-5)/5 != (sqrt(7)-5)/5로 거짓이다.
2. 2. 2번은 sqrt(24) + 3*sqrt(6) - sqrt(54) = 2*sqrt(6) + 3*sqrt(6) - 3*sqrt(6) = 2*sqrt(6) != 4*sqrt(6)로 거짓이다.
3. 3. 3번은 5*sqrt(2) + 3*sqrt(7) - 2*sqrt(2) + 4*sqrt(7) = 3*sqrt(2) + 7*sqrt(7)로 참이다.
4. 4. 4번은 1/sqrt(10) * (sqrt(5)/2 + sqrt(2)) = sqrt(2)/4 + sqrt(5)/5 != sqrt(2)/4 + 1로 거짓이다.
5. 5. 5번은 sqrt(12)*(sqrt(7)/sqrt(3)+sqrt(3)) - 3*sqrt(7) = 2*sqrt(7)+6 - 3*sqrt(7) = 6 - sqrt(7) != 6 + sqrt(7)로 거짓이다. 따라서 옳은 것은 3번이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 제곱근의 계산 결과로 옳은 것은? [3점]」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: sqrt(24) + 3*sqrt(6) - sqrt(54) 등 근호의 덧셈과 뺄셈 및 동류근호 계산을 다루는 M3-RPM-009 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_EXPRESSION_SIMPLIFICATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_LIKE_RADICAL_OPERATIONS_CHECK → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: sqrt(24)+3*sqrt(6)-sqrt(54) 및 5*sqrt(2)-2*sqrt(2)=3*sqrt(2), 3*sqrt(7)+4*sqrt(7)=7*sqrt(7)의 동류근호 연산 템플릿입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sqrt(24)와 sqrt(54)를 간단히 하고 동류근호의 덧셈과 뺄셈을 1단계로 계산하는 기본 문항입니다.

**4칸**
- given: 제곱근←stem:「다음 중 제곱근의 계산 결과로 옳은 것은? [3점]」
- goal: 판정←stem:「다음 중 제곱근의 계산 결과로 옳은 것은? [3점]」
- method: 사칙연산(IMPLIED)←solution:「근호의 분배법칙, 유리화, 동류근호 덧셈·뺄셈을」 — 동류근호 덧셈 뺄셈 수행
- condition: (없음)

**how** sqrt(24)+3*sqrt(6)-sqrt(54) = 2*sqrt(6) != 4*sqrt(6) 등을 검토하고 3번 선지 5*sqrt(2)+3*sqrt(7)-2*sqrt(2)+4*sqrt(7) = 3*sqrt(2)+7*sqrt(7)이 참임을 확인하여 3번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호의 분배법칙, 유리화, 동류근호 덧셈·뺄셈을 각 선지에 적용하여 진위를 확인한다.

1단계: 각 선지의 계산 과정을 검토한다. ① $\frac{\sqrt{7}-\sqrt{5}}{\sqrt{5}} = \frac{(\sqrt{7}-\sqrt{5})\sqrt{5}}{5} = \frac{\sqrt{35}-5}{5}$이므로 우변의 $\frac{\sqrt{7}-5}{5}$와 다르다. (거짓) ② $\sqrt{24} + 3\sqrt{6} - \sqrt{54} = 2\sqrt{6} + 3\sqrt{6} - 3\sqrt{6} = 2\sqrt{6}$이므로 우변의 $4\sqrt{6}$과 다르다. (거짓) ③ 동류근호끼리 묶어 계산한다. $$(5\sqrt{2} - 2\sqrt{2}) + (3\sqrt{7} + 4\sqrt{7}) = 3\sqrt{2} + 7\sqrt{7}$$ 우변과 정확히 일치한다. (참) ④ $\frac{1}{\sqrt{10}}\left(\frac{\sqrt{5}}{2} + \sqrt{2}\right) = \frac{\sqrt{5}}{2\sqrt{10}} + \frac{\sqrt{2}}{\sqrt{10}} = \frac{1}{2\sqrt{2}} + \frac{1}{\sqrt{5}} = \frac{\sqrt{2}}{4} + \frac{\sqrt{5}}{5}$이므로 우변과 다르다. (거짓) ⑤ $\sqrt{12}\left(\frac{\sqrt{7}}{\sqrt{3}} + \sqrt{3}\right) - 3\sqrt{7} = 2\sqrt{3}\left(\frac{\sqrt{7}}{\sqrt{3}} + \sqrt{3}\right) - 3\sqrt{7} = (2\sqrt{7} + 6) - 3\sqrt{7} = 6 - \sqrt{7}$이므로 우변의 $6 + \sqrt{7}$과 다르다. (거짓)

2단계: 결론을 도출한다. 따라서 옳은 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\sqrt{48000}$은 $\sqrt{30}$의 $A$배이고, $\frac{\sqrt{0.6}}{\sqrt{50}}$은 $\sqrt{1.2}$의 $B$배일 때, $A \times B$의 값은? [4점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. sqrt(48000) = sqrt(1600 * 30) = sqrt(40^2 * 30) = 40*sqrt(30)이므로 A = 40이다.
2. 2. sqrt(0.6)/sqrt(50) = sqrt(0.6/50) = sqrt(1.2/100) = sqrt(1.2)/10이므로 B = 1/10이다.
3. 3. 따라서 A * B = 40 * (1/10) = 4이다.
4. 4. 따라서 정답은 4번이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{48000}$은 $\sqrt{30}$의 $A$배이고, $\frac{\sqrt{0.6}}{\sqrt{50}}$은 $\sqrt{1.2}$의 $B$배일 때, $A \times B$의 값은? [4점]」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 변형과 배수 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 근호 밖으로 제곱수를 꺼내어 48000 = 1600 * 30에서 A=40, B=1/10을 구하는 M3-RPM-007 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_MAGNIFICATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_SCALE_FACTOR_PRODUCT → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 근호 변형을 통해 A=40, B=1/10을 구하고 곱 A * B = 4를 계산하는 TPL_M3_RADICAL_MIXED_OPERATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sqrt(48000)=40*sqrt(30)과 sqrt(0.6/50)=sqrt(1.2)/10으로 A=40, B=1/10을 구한 뒤 곱을 계산하는 2단계 문항입니다.

**4칸**
- given: 근호←solution:「근호 안의 수의 거듭제곱 인수를 근호 밖으로 꺼내는 성질을 이용하여」
- goal: 식의값←stem:「$A \times B$의 값은? [4점]」
- method: 사칙연산(IMPLIED)←solution:「$A \times B$의 값을 계산한다.」 — 근호 변형 및 곱셈 연산
- condition: (없음)

**how** sqrt(48000)=40*sqrt(30)에서 A=40, sqrt(0.6/50)=sqrt(1.2)/10에서 B=1/10을 구하여 A * B = 40 * (1/10) = 4인 4번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호 안의 수의 거듭제곱 인수를 근호 밖으로 꺼내는 성질을 이용하여 배수를 구한다.

1단계: $A$의 값을 구한다. $$\sqrt{48000} = \sqrt{1600 \times 30} = \sqrt{40^2 \times 30} = 40\sqrt{30}$$ 따라서 $\sqrt{48000}$은 $\sqrt{30}$의 $40$배이므로 $$A = 40$$

2단계: $B$의 값을 구한다. 근호 안을 분수로 합쳐 계산한다. $$\frac{\sqrt{0.6}}{\sqrt{50}} = \sqrt{\frac{0.6}{50}} = \sqrt{\frac{0.6 \times 2}{50 \times 2}} = \sqrt{\frac{1.2}{100}} = \frac{\sqrt{1.2}}{10} = \frac{1}{10}\sqrt{1.2}$$ 따라서 $\frac{\sqrt{0.6}}{\sqrt{50}}$은 $\sqrt{1.2}$의 $\frac{1}{10}$배이므로 $$B = \frac{1}{10}$$

3단계: $A \times B$의 값을 계산한다. $$A \times B = 40 \times \frac{1}{10} = 4$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

밑변의 길이가 $\sqrt{72}\text{ cm}$, 높이가 $\sqrt{40}\text{ cm}$인 삼각형 $\mathrm{ABC}$의 넓이가 한 대각선의 길이가 $\sqrt{5}\text{ cm}$인 마름모 $\mathrm{DEFG}$의 넓이의 $4$배일 때, 마름모의 다른 한 대각선 $\overline{\mathrm{DF}}$의 길이는? [4점]

**보기** ① $2\sqrt{5}\text{ cm}$  ② $3\sqrt{2}\text{ cm}$  ③ $4\sqrt{3}\text{ cm}$  ④ $2\sqrt{10}\text{ cm}$  ⑤ $6\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 삼각형 ABC의 밑변은 sqrt(72) = 6*sqrt(2) cm, 높이는 sqrt(40) = 2*sqrt(10) cm이므로 넓이는 1/2 * 6*sqrt(2) * 2*sqrt(10) = 6*sqrt(20) = 12*sqrt(5) cm^2이다.
2. 2. 마름모 DEFG의 넓이는 삼각형 넓이의 1/4이므로 12*sqrt(5) / 4 = 3*sqrt(5) cm^2이다.
3. 3. 마름모의 넓이는 1/2 * sqrt(5) * DF = 3*sqrt(5)이므로 1/2 * DF = 3에서 DF = 6 cm이다.
4. 4. 따라서 마름모의 다른 한 대각선 길이는 6 cm이다. 따라서 정답은 5번이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「밑변의 길이가 $\sqrt{72}\text{ cm}$, 높이가 $\sqrt{40}\text{ cm}$인 삼각형 $\mathrm{ABC}$의 넓이가」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 도형에서의 제곱근 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 삼각형 ABC와 마름모 DEFG 넓이에서 sqrt(72) * sqrt(40) = 12*sqrt(5) 등 근호의 곱셈을 기하에 활용하는 M3-RPM-007 레코드입니다.
**유형** PT=PT_M3_SQUARE_ROOT_APPLICATION / TPL=TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION **원천→판정: PT_M3_RADICAL_PLANE_GEOMETRY_AREA → PT_M3_SQUARE_ROOT_APPLICATION** **원천→판정: TPL_M3_TRIANGLE_RHOMBUS_AREA_EQUATION → TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION**
- 이유: 삼각형과 마름모의 넓이 공식 및 제곱근 곱셈 sqrt(72)*sqrt(40)을 적용하여 대각선 DF=6을 구하는 TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형의 넓이 12*sqrt(5)와 마름모의 넓이 3*sqrt(5)를 구하고 대각선 DF=6을 계산하는 2단계 문항입니다.

**4칸**
- given: 삼각형←stem:「삼각형 $\mathrm{ABC}$의 넓이가」<br>마름모←stem:「마름모 $\mathrm{DEFG}$의 넓이의 $4$배일 때」
- goal: 길이←stem:「마름모의 다른 한 대각선 $\overline{\mathrm{DF}}$의 길이는? [4점]」
- method: 넓이(IMPLIED)←solution:「삼각형과 마름모의 넓이 공식 및 제곱근의 곱셈을 이용하여」 — 삼각형 및 마름모 넓이 공식을 적용하여 대각선 길이 계산
- condition: (없음)

**how** 삼각형 ABC의 넓이 1/2 * 6*sqrt(2) * 2*sqrt(10) = 12*sqrt(5)에서 마름모 DEFG의 넓이 3*sqrt(5)를 구하고 1/2 * sqrt(5) * DF = 3*sqrt(5)에서 DF=6으로 5번을 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형과 마름모의 넓이 공식 및 제곱근의 곱셈을 이용하여 미지수의 길이를 구한다.

1단계: 삼각형 $\mathrm{ABC}$의 넓이를 계산한다. 밑변은 $\sqrt{72} = \sqrt{36 \times 2} = 6\sqrt{2}\text{ cm}$이고, 높이는 $\sqrt{40} = \sqrt{4 \times 10} = 2\sqrt{10}\text{ cm}$이다. 삼각형의 넓이는 $$S_{\triangle} = \frac{1}{2} \times 6\sqrt{2} \times 2\sqrt{10} = 6\sqrt{20} = 6 \times 2\sqrt{5} = 12\sqrt{5}\text{ cm}^2$$

2단계: 마름모 $\mathrm{DEFG}$의 넓이를 구한다. 삼각형의 넓이가 마름모의 넓이의 $4$배이므로 $$S_{\text{마름모}} = \frac{S_{\triangle}}{4} = \frac{12\sqrt{5}}{4} = 3\sqrt{5}\text{ cm}^2$$

3단계: 마름모의 대각선 $\overline{\mathrm{DF}}$의 길이를 구한다. 마름모의 두 대각선의 길이를 $d_1 = \sqrt{5}$, $d_2 = \overline{\mathrm{DF}}$라 하면 마름모의 넓이 공식에 의해 $$S_{\text{마름모}} = \frac{1}{2} \times \sqrt{5} \times \overline{\mathrm{DF}} = 3\sqrt{5}$$ 양변의 $\sqrt{5}$를 나누면 $$\frac{1}{2} \times \overline{\mathrm{DF}} = 3$$ $$\overline{\mathrm{DF}} = 6\text{ cm}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

유리수 $a, b$에 대하여 등식 $$3\sqrt{5} - 4\sqrt{3} + a\sqrt{5} + b\sqrt{3} = \frac{5\sqrt{5}}{2} - \frac{17\sqrt{3}}{4}$$ 이 성립할 때, $a + b$의 값은? [4점]

**보기** ① $-\frac{3}{4}$  ② $-\frac{1}{2}$  ③ $-\frac{1}{4}$  ④ $\frac{1}{4}$  ⑤ $\frac{3}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 좌변을 동류근호끼리 묶으면 (3 + a)*sqrt(5) + (b - 4)*sqrt(3)이다.
2. 2. 우변 5/2 * sqrt(5) - 17/4 * sqrt(3)과 계수를 비교하면 3 + a = 5/2에서 a = -1/2 = -2/4이다.
3. 3. b - 4 = -17/4에서 b = -1/4이다.
4. 4. 따라서 a + b = -2/4 - 1/4 = -3/4이다. 따라서 정답은 1번이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「유리수 $a, b$에 대하여 등식」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 유리수와 무리수의 상등 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 우변의 -17/4*sqrt(3)과 동류근호 b-4를 비교하여 a=-1/2, b=-1/4을 구하는 M3-RPM-009 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_COEFFICIENT_IDENTIFICATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_RATIONAL_COEFFICIENT_MATCH → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: 우변의 -17/4*sqrt(3)과 동류근호 (3+a)*sqrt(5)+(b-4)*sqrt(3)의 계수를 비교하여 a=-1/2, b=-1/4, a+b=-3/4을 구하는 TPL_M3_RADICAL_MIXED_OPERATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동류근호로 묶고 우변의 -17/4*sqrt(3)과 비교하여 a=-1/2, b=-1/4을 구하여 합 a+b=-3/4을 계산하는 2단계 문항입니다.

**4칸**
- given: 유리수←stem:「유리수 $a, b$에 대하여 등식」
- goal: 식의값←stem:「$a + b$의 값은? [4점]」
- method: 사칙연산(IMPLIED)←solution:「같은 근호를 포함하는 동류항끼리 묶어 계수를 비교한다.」 — 동류근호 계수 비교 및 유리수 덧셈
- condition: (없음)

**how** 좌변을 (3+a)*sqrt(5)+(b-4)*sqrt(3)으로 묶어 우변의 5/2*sqrt(5) - 17/4*sqrt(3)과 비교해 a=-1/2, b=-1/4을 구하고 a+b = -3/4인 1번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

유리수와 무리수의 상등 성질을 이용하여 같은 근호를 포함하는 동류항끼리 묶어 계수를 비교한다.

1단계: 좌변을 동류근호끼리 정리한다. $$3\sqrt{5} - 4\sqrt{3} + a\sqrt{5} + b\sqrt{3} = (3 + a)\sqrt{5} + (b - 4)\sqrt{3}$$

2단계: 우변의 계수와 비교하여 $a$와 $b$를 구한다. $a, b$가 유리수이고 $\sqrt{5}, \sqrt{3}$은 서로 다른 무리수이므로 $$3 + a = \frac{5}{2} \implies a = \frac{5}{2} - 3 = -\frac{1}{2}$$ $$b - 4 = -\frac{17}{4} \implies b = 4 - \frac{17}{4} = \frac{16 - 17}{4} = -\frac{1}{4}$$

3단계: $a + b$의 값을 계산한다. $$a + b = -\frac{1}{2} + \left(-\frac{1}{4}\right) = -\frac{2}{4} - \frac{1}{4} = -\frac{3}{4}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

유리수 $a, b$에 대하여 $$-\sqrt{98}\left(\frac{\sqrt{3}}{7} - \sqrt{2}\right) - \sqrt{54} \div \sqrt{2} \times \sqrt{32} = a + b\sqrt{6}$$ 이 성립할 때, $a + b$의 값은? [4점]

**보기** ① $-1$  ② $1$  ③ $2$  ④ $14$  ⑤ $27$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. -sqrt(98) = -7*sqrt(2)이므로 -7*sqrt(2)*(sqrt(3)/7 - sqrt(2)) = -sqrt(6) + 14 = 14 - sqrt(6)이다.
2. 2. sqrt(54) / sqrt(2) * sqrt(32) = sqrt(27) * sqrt(32) = 3*sqrt(3) * 4*sqrt(2) = 12*sqrt(6)이다.
3. 3. 두 식을 결합하면 (14 - sqrt(6)) - 12*sqrt(6) = 14 - 13*sqrt(6)이다.
4. 4. a = 14, b = -13이므로 a + b = 14 - 13 = 1이다. 따라서 정답은 2번이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-\sqrt{98}\left(\frac{\sqrt{3}}{7} - \sqrt{2}\right) - \sqrt{54} \div \sqrt{2} \times \sqrt{32} = a + b\sqrt{6}$」
**RPM** M3-RPM-014 [실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값**
- 이유: 근호의 분배법칙과 사칙연산 혼합 계산으로 sqrt(98), sqrt(54), sqrt(32)를 정리하여 a=14, b=-13을 구하는 M3-RPM-014 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_MIXED_OPERATION **원천→판정: PT_M3_RADICAL_MIXED_EVALUATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_EXPAND_AND_DIVIDE_RADICAL → TPL_M3_RADICAL_MIXED_OPERATION**
- 이유: -7*sqrt(2)*(sqrt(3)/7-sqrt(2)) - 12*sqrt(6) = 14-13*sqrt(6)으로 정리하여 a+b=1을 구하는 TPL_M3_RADICAL_MIXED_OPERATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: sqrt(98)=7*sqrt(2), sqrt(54)=3*sqrt(6), sqrt(32)=4*sqrt(2)를 전개 및 혼합 연산하여 a=14, b=-13을 구하는 2단계 문항입니다.

**4칸**
- given: 유리수←stem:「유리수 $a, b$에 대하여」
- goal: 식의값←stem:「$a + b$의 값은? [4점]」
- method: 사칙연산(IMPLIED)←solution:「근호의 분배법칙과 사칙연산의 혼합 계산을 순서대로 진행하여」 — 근호 분배법칙 및 사칙연산 혼합 계산
- condition: (없음)

**how** 첫째 항에서 14-sqrt(6), 둘째 항에서 12*sqrt(6)을 얻어 14-13*sqrt(6) = a+b*sqrt(6)에서 a=14, b=-13으로 a+b=1인 2번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

근호의 분배법칙과 사칙연산의 혼합 계산을 순서대로 진행하여 $a+b\sqrt{6}$ 꼴로 정리한다.

1단계: 첫 번째 항을 분배하여 전개한다. $\sqrt{98} = \sqrt{49 \times 2} = 7\sqrt{2}$이므로 $$-\sqrt{98}\left(\frac{\sqrt{3}}{7} - \sqrt{2}\right) = -7\sqrt{2}\left(\frac{\sqrt{3}}{7} - \sqrt{2}\right)$$ $$= -\left(7\sqrt{2} \times \frac{\sqrt{3}}{7}\right) + 7\sqrt{2} \times \sqrt{2} = -\sqrt{6} + 7 \times 2 = 14 - \sqrt{6}$$

2단계: 두 번째 항의 나눗셈과 곱셈을 계산한다. $$\sqrt{54} \div \sqrt{2} \times \sqrt{32} = \sqrt{\frac{54}{2}} \times \sqrt{32} = \sqrt{27} \times \sqrt{32}$$ $$= 3\sqrt{3} \times 4\sqrt{2} = 12\sqrt{6}$$

3단계: 두 결과를 결합하여 $a, b$를 구한다. $$(14 - \sqrt{6}) - 12\sqrt{6} = 14 - 13\sqrt{6}$$ 주어진 우변 $a + b\sqrt{6}$과 비교하면 $$a = 14, \quad b = -13$$

4단계: $a + b$를 계산한다. $$a + b = 14 + (-13) = 1$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

가로의 길이가 $8$, 세로의 길이가 $4$인 직사각형을 잘라 빗변의 길이가 $4\sqrt{5}$이고 두 직교변이 각각 $8, 4$인 합동인 직각삼각형 $2$조각과, 두 등변의 길이가 각각 $2\sqrt{5}$이고 밑변이 $4$인 이등변삼각형 $2$조각을 만들었다. 이 네 조각을 겹치지 않게 변끼리 이어 붙여 새로운 다각형을 만들 때, 맞닿아 다각형의 내부에 포함된 선분의 길이의 합이 $8 + 4\sqrt{5}$이었다. 이때 완성된 다각형의 바깥 둘레의 길이는? [5점]

**보기** ① $12 + 6\sqrt{5}$  ② $14 + 8\sqrt{5}$  ③ $16 + 8\sqrt{5}$  ④ $18 + 10\sqrt{5}$  ⑤ $20 + 8\sqrt{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 직각삼각형 2개의 둘레 합은 2*(8 + 4 + 4*sqrt(5)) = 24 + 8*sqrt(5)이다.
2. 2. 이등변삼각형 2개의 둘레 합은 2*(4 + 2*sqrt(5) + 2*sqrt(5)) = 8 + 8*sqrt(5)이다.
3. 3. 네 조각의 둘레 총합은 (24 + 8*sqrt(5)) + (8 + 8*sqrt(5)) = 32 + 16*sqrt(5)이다.
4. 4. 맞닿은 내부 선분의 길이 합이 8 + 4*sqrt(5)이므로 바깥 둘레는 32 + 16*sqrt(5) - 2*(8 + 4*sqrt(5)) = 16 + 8*sqrt(5)이다. 따라서 정답은 3번이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「가로의 길이가 $8$, 세로의 길이가 $4$인 직사각형을 잘라 빗변의 길이가 $4\sqrt{5}$이고」
**RPM** M3-RPM-009 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 무리수를 포함한 둘레의 계산 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호**
- 이유: 직각삼각형과 이등변삼각형 둘레 총합 32+16*sqrt(5)에서 내부 선분 2(8+4*sqrt(5))를 빼는 M3-RPM-009 레코드입니다.
**유형** PT=PT_M3_SQUARE_ROOT_APPLICATION / TPL=TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION **원천→판정: PT_M3_RADICAL_PUZZLE_PERIMETER → PT_M3_SQUARE_ROOT_APPLICATION** **원천→판정: TPL_M3_DISSECTED_POLYGON_BOUNDARY → TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION**
- 이유: 도형 조각의 둘레 총합 32+16*sqrt(5)에서 맞닿은 길이의 2배 16+8*sqrt(5)를 빼서 바깥 둘레 16+8*sqrt(5)를 구하는 TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION 템플릿입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 네 조각의 둘레 총합 32+16*sqrt(5)를 구하고 내부 선분의 2배를 빼는 기하 논리를 결합한 3단계 문항입니다.

**4칸**
- given: 직사각형←stem:「가로의 길이가 $8$, 세로의 길이가 $4$인 직사각형을 잘라」<br>직각삼각형←stem:「합동인 직각삼각형 $2$조각과」
- goal: 길이←stem:「이때 완성된 다각형의 바깥 둘레의 길이는? [5점]」
- method: 사칙연산(IMPLIED)←solution:「각 조각의 전체 둘레의 합에서 맞닿아 내부로 들어간 선분 길이의 $2$배를 뺀 값과 같음을 이용한다.」 — 둘레 총합에서 겹친 선분의 2배를 감산
- condition: (없음)

**how** 네 조각 둘레 총합 (24+8*sqrt(5))+(8+8*sqrt(5))=32+16*sqrt(5)에서 내부 선분 2(8+4*sqrt(5))=16+8*sqrt(5)를 빼서 16+8*sqrt(5)인 3번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

도형을 변끼리 이어 붙였을 때 완성된 다각형의 둘레는 각 조각의 전체 둘레의 합에서 맞닿아 내부로 들어간 선분 길이의 $2$배를 뺀 값과 같음을 이용한다.

1단계: 네 조각의 둘레의 총합을 구한다.

- 직각삼각형 한 조각의 세 변의 길이는 $8, 4, 4\sqrt{5}$이므로 $$\text{직각삼각형 } 1\text{개 둘레} = 8 + 4 + 4\sqrt{5} = 12 + 4\sqrt{5}$$ $2$개의 둘레 합은 $2(12 + 4\sqrt{5}) = 24 + 8\sqrt{5}$이다.  
    
- 이등변삼각형 한 조각의 세 변의 길이는 $4, 2\sqrt{5}, 2\sqrt{5}$이므로 $$\text{이등변삼각형 } 1\text{개 둘레} = 4 + 2\sqrt{5} + 2\sqrt{5} = 4 + 4\sqrt{5}$$ $2$개의 둘레 합은 $2(4 + 4\sqrt{5}) = 8 + 8\sqrt{5}$이다.

따라서 네 조각의 둘레의 총합 $L_{\text{총합}}$은 $$L_{\text{총합}} = (24 + 8\sqrt{5}) + (8 + 8\sqrt{5}) = 32 + 16\sqrt{5}$$

2단계: 다각형의 바깥 둘레를 계산한다. 두 조각이 한 선분에서 맞닿으면 그 선분은 두 조각 모두에서 둘레에서 제외되므로, 내부 접촉 선분 길이의 합을 $I$라 할 때 다각형의 둘레 $P$는 $$P = L_{\text{총합}} - 2I$$ 문제에서 $I = 8 + 4\sqrt{5}$이므로 $$P = (32 + 16\sqrt{5}) - 2(8 + 4\sqrt{5})$$ $$= 32 + 16\sqrt{5} - 16 - 8\sqrt{5} = 16 + 8\sqrt{5}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $(3a - 4b)(4a + 3b)$를 전개했을 때, $ab$의 계수는? [3점]

**보기** ① $-15$  ② $-11$  ③ $-9$  ④ $-7$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 식 (3a - 4b)(4a + 3b)를 분배법칙으로 전개하면 3a(4a + 3b) - 4b(4a + 3b) = 12a^2 + 9ab - 16ab - 12b^2이다.
2. 2. 동류항을 정리하면 12a^2 + (9 - 16)ab - 12b^2 = 12a^2 - 7ab - 12b^2이다.
3. 3. 따라서 ab의 계수는 -7이다.
4. 4. 따라서 정답은 4번이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $(3a - 4b)(4a + 3b)$를 전개했을 때, $ab$의 계수는? [3점]」
**RPM** M3-RPM-017 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 다항식의 전개 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱**
- 이유: 두 일차식 (3a - 4b)(4a + 3b)의 곱셈 전개와 ab 계수 계산을 다루는 M3-RPM-017 레코드입니다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_POLY_EXPANSION_COEFFICIENT **원천→판정: PT_M3_POLYNOMIAL_CROSS_COEFFICIENT → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_EXPAND_AND_EXTRACT_COEFFICIENT → TPL_M3_POLY_EXPANSION_COEFFICIENT**
- 이유: 다항식 (3a - 4b)(4a + 3b)를 전개하여 9ab - 16ab = -7ab의 계수를 추출하는 TPL_M3_POLY_EXPANSION_COEFFICIENT 템플릿입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 일차식의 곱을 분배법칙으로 전개하여 ab 계수 -7을 1단계로 구하는 기본 문항입니다.

**4칸**
- given: 다항식←stem:「다항식 $(3a - 4b)(4a + 3b)$를 전개했을 때」
- goal: 계수←stem:「$ab$의 계수는? [3점]」
- method: 사칙연산(IMPLIED)←solution:「다항식의 곱셈에서 분배법칙을 적용하여 전개하고 동류항을 정리한다.」 — 분배법칙 적용 곱셈 전개
- condition: (없음)

**how** (3a - 4b)(4a + 3b)를 전개하여 12a^2 - 7ab - 12b^2을 얻고 ab의 계수가 -7임을 확인하여 4번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

다항식의 곱셈에서 분배법칙을 적용하여 전개하고 동류항을 정리한다.

1단계: 식을 분배법칙으로 전개한다. $$(3a - 4b)(4a + 3b) = 3a(4a + 3b) - 4b(4a + 3b)$$ $$= 12a^2 + 9ab - 16ab - 12b^2$$

2단계: 동류항을 정리한다. $$12a^2 + (9 - 16)ab - 12b^2 = 12a^2 - 7ab - 12b^2$$

3단계: $ab$의 계수를 확인한다. $ab$ 앞의 계수는 $-7$이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

유리수 $a, b$에 대하여 $$\frac{1}{\sqrt{45}} \times \frac{1}{-2+\sqrt{5}} = a + b\sqrt{5}$$ 가 성립할 때, $a - b$의 값은? [4점]

**보기** ① $-\frac{2}{15}$  ② $-\frac{1}{5}$  ③ $\frac{1}{15}$  ④ $\frac{2}{15}$  ⑤ $\frac{1}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 1/sqrt(45) = 1/(3*sqrt(5))이다.
2. 2. 1/(-2+sqrt(5)) = 1/(sqrt(5)-2) = (sqrt(5)+2)/(5-4) = sqrt(5)+2이다.
3. 3. 두 식의 곱은 (sqrt(5)+2)/(3*sqrt(5)) = (5+2*sqrt(5))/15 = 1/3 + 2/15 * sqrt(5)이다.
4. 4. a = 1/3 = 5/15, b = 2/15이므로 a - b = 5/15 - 2/15 = 3/15 = 1/5이다. 따라서 정답은 5번이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「유리수 $a, b$에 대하여」
**RPM** M3-RPM-012 [실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 합·차 꼴의 유리화] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 분모의 유리화 > 합·차 꼴의 유리화**
- 이유: 1/(sqrt(5)-2)의 분모의 유리화와 1/sqrt(45) 계산을 다루는 M3-RPM-012 레코드입니다.
**유형** PT=PT_M3_RADICAL_CALCULATION / TPL=TPL_M3_RADICAL_RATIONALIZATION **원천→판정: PT_M3_CONJUGATE_RATIONALIZATION → PT_M3_RADICAL_CALCULATION** **원천→판정: TPL_M3_PRODUCT_OF_RATIONALIZED_RADICALS → TPL_M3_RADICAL_RATIONALIZATION**
- 이유: 합차공식을 이용한 분모의 유리화로 (5+2*sqrt(5))/15를 정리하여 a-b=1/5를 구하는 TPL_M3_RADICAL_RATIONALIZATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 1/sqrt(45)와 합차공식 분모 유리화를 거쳐 분모 15인 (5+2*sqrt(5))/15에서 a-b=1/5를 구하는 2단계 문항입니다.

**4칸**
- given: 유리수←stem:「유리수 $a, b$에 대하여」
- goal: 식의값←stem:「$a - b$의 값은? [4점]」
- method: 유리화(IMPLIED)←solution:「분모의 유리화 및 제곱근의 단순화를 차례로 적용하여」 — 분모의 유리화 공식 적용
- condition: (없음)

**how** 1/sqrt(45)와 분모를 유리화한 식의 곱 (sqrt(5)+2)/(3*sqrt(5)) = (5+2*sqrt(5))/15에서 a=5/15, b=2/15를 얻어 a-b=3/15=1/5인 5번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

분모의 유리화 및 제곱근의 단순화를 차례로 적용하여 식을 $a+b\sqrt{5}$ 꼴로 변형한다.

1단계: 각 분수의 분모를 변형 및 유리화한다.

- $\sqrt{45} = \sqrt{9 \times 5} = 3\sqrt{5}$  
- $\frac{1}{-2+\sqrt{5}} = \frac{1}{\sqrt{5}-2}$에 합차공식을 이용하여 유리화하면 $$\frac{1}{\sqrt{5}-2} = \frac{\sqrt{5}+2}{(\sqrt{5}-2)(\sqrt{5}+2)} = \frac{\sqrt{5}+2}{5-4} = \sqrt{5}+2$$

2단계: 두 식의 곱을 계산한다. $$\frac{1}{\sqrt{45}} \times \frac{1}{-2+\sqrt{5}} = \frac{1}{3\sqrt{5}} \times (\sqrt{5}+2) = \frac{\sqrt{5}+2}{3\sqrt{5}}$$ 분모와 분자에 $\sqrt{5}$를 곱해 분모를 유리화한다. $$\frac{(\sqrt{5}+2)\sqrt{5}}{3\sqrt{5} \times \sqrt{5}} = \frac{5 + 2\sqrt{5}}{3 \times 5} = \frac{5 + 2\sqrt{5}}{15}$$ $$= \frac{5}{15} + \frac{2}{15}\sqrt{5} = \frac{1}{3} + \frac{2}{15}\sqrt{5}$$

3단계: $a, b$의 값을 구하고 $a - b$를 계산한다. $a, b$가 유리수이므로 $$a = \frac{1}{3} = \frac{5}{15}, \quad b = \frac{2}{15}$$ 따라서 $$a - b = \frac{5}{15} - \frac{2}{15} = \frac{3}{15} = \frac{1}{5}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

민호와 지우가 곱셈공식을 이용하여 수를 계산하는 과정을 나타낸 것이다. 두 사람의 설명 중 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4점] 민호: $96^2 = (100 - 4)^2 = 100^2 + 4^2 = 10016$ 지우: $504 \times 496 = (500 + 4)(500 - 4) = \text{(가)} = 249984$ <보기> ㄱ. 민호는 곱셈공식 $(a - b)^2 = a^2 - 2ab + b^2$에서 $-2ab$ 항을 빠뜨리고 계산하였다. ㄴ. 민호의 계산 결과인 $10016$은 실제 $96^2$의 값보다 $800$만큼 더 크다. ㄷ. 지우의 계산 과정 중 (가)에 들어갈 알맞은 식은 $500^2 + 4^2$이다. ㄹ. 복잡한 수의 계산에서 곱셈공식을 활용하면 계산 과정을 단순화할 수 있다.

**보기** ① ㄱ, ㄴ, ㄹ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄴ, ㄹ  ⑤ ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 민호의 96^2 = (100 - 4)^2 = 100^2 - 2*100*4 + 4^2 = 10000 - 800 + 16 = 9216이다. 민호는 -2ab 항을 빠뜨리고 10016으로 계산하였으므로 ㄱ은 참이다.
2. 2. 10016 - 9216 = 800이므로 민호의 계산값은 실제보다 800만큼 더 크다. 따라서 ㄴ은 참이다.
3. 3. 지우의 504 * 496 = (500 + 4)(500 - 4) = 500^2 - 4^2 = 249984이므로 (가)는 500^2 - 4^2이어야 한다. 따라서 ㄷ은 거짓이다.
4. 4. 곱셈공식을 활용하면 큰 수의 계산 과정을 단순화할 수 있으므로 ㄹ은 참이다. 따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다. 정답은 1번이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「민호와 지우가 곱셈공식을 이용하여 수를 계산하는 과정을 나타낸 것이다.」
**RPM** M3-RPM-018 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 수 계산 활용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산**
- 이유: 곱셈공식 96^2 = (100-4)^2 = 10016의 오류와 504*496 = (500+4)(500-4)의 수 계산을 다루는 M3-RPM-018 레코드입니다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT **원천→판정: PT_M3_FORMULA_NUMERICAL_ERROR_AUDIT → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_STUDENT_CALCULATION_ERROR_INSPECTION → TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT**
- 이유: 곱셈공식을 이용한 수 계산 (100-4)^2 = 9216과 504*496 = 249984의 오류 검증 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: (100-4)^2 전개식 오류 10016과 504*496 합차공식의 수 계산 진위를 2단계로 판별하는 문항입니다.

**4칸**
- given: 곱셈공식←stem:「민호와 지우가 곱셈공식을 이용하여 수를 계산하는 과정을 나타낸 것이다.」
- goal: 판정←stem:「두 사람의 설명 중 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4점]」
- method: 사칙연산(IMPLIED)←solution:「곱셈공식 $(a-b)^2 = a^2 - 2ab + b^2$과 $(a+b)(a-b) = a^2 - b^2$의 수 계산 활용 원리를」 — 곱셈공식을 이용한 수 계산 분석
- condition: (없음)

**how** 민호의 96^2 계산에서 -2ab 누락(ㄱ 참), 10016-9216=800(ㄴ 참), 지우의 504*496 식에서 (가)는 500^2-4^2(ㄷ 거짓), ㄹ 참으로 ㄱ, ㄴ, ㄹ인 1번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈공식 $(a-b)^2 = a^2 - 2ab + b^2$과 $(a+b)(a-b) = a^2 - b^2$의 수 계산 활용 원리를 보기별로 분석한다.

1단계: 민호의 계산 과정을 검토한다. $(100 - 4)^2$을 올바르게 전개하면 $$(100 - 4)^2 = 100^2 - 2 \times 100 \times 4 + 4^2 = 10000 - 800 + 16 = 9216$$ 민호는 중간의 $-2 \times 100 \times 4 = -800$ 항을 빠뜨리고 $100^2 + 4^2 = 10016$으로 계산하였다. 따라서 ㄱ은 참이다. 민호의 계산값 $10016$과 실제값 $9216$의 차이는 $$10016 - 9216 = 800$$ 이므로 실제 값보다 $800$만큼 더 크다. 따라서 ㄴ은 참이다.

2단계: 지우의 계산 과정을 검토한다. $504 \times 496 = (500 + 4)(500 - 4)$에 합차공식을 적용하면 $$(500 + 4)(500 - 4) = 500^2 - 4^2 = 250000 - 16 = 249984$$ 따라서 (가)에 들어갈 식은 $500^2 - 4^2$이어야 하므로 $500^2 + 4^2$라는 ㄷ의 설명은 거짓이다.

3단계: ㄹ을 검토한다. 곱셈공식을 수 계산에 활용하면 직접 곱셈하는 번거로움을 줄이고 자릿수 연산을 단순화할 수 있으므로 참이다.

4단계: 결론을 도출한다. 따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

한 변의 길이가 $2x$인 정사각형 모양의 사진 $6$장을 빈틈없이 이어 붙여 직사각형 모양의 전시 포스터를 제작하려고 한다. 사진을 가로로 $3$장, 세로로 $2$장 배치한 후, 이 직사각형 둘레를 따라 좌·우에 각각 $3$, 상·하에 각각 $2$의 일정한 폭을 갖는 여백을 두어 전체 포스터를 완성하였다. 포스터 전체의 넓이를 나타내는 다항식은? [4점] (단, 사진과 여백은 서로 겹치지 않는다.)

**보기** ① $24x^2 + 36x + 24$  ② $24x^2 + 48x + 24$  ③ $24x^2 + 52x + 24$  ④ $48x^2 + 48x + 24$  ⑤ $48x^2 + 56x + 24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 한 변이 2x인 정사각형 사진이 가로로 3장이므로 가로 길이는 2x * 3 = 6x, 세로로 2장이므로 세로 길이는 2x * 2 = 4x이다.
2. 2. 좌우 여백 각각 3을 더한 전체 가로는 6x + 3 + 3 = 6x + 6이다. 상하 여백 각각 2를 더한 전체 세로는 4x + 2 + 2 = 4x + 4이다.
3. 3. 전체 포스터의 넓이는 (6x + 6)(4x + 4) = 24x^2 + 24x + 24x + 24 = 24x^2 + 48x + 24이다.
4. 4. 따라서 정답은 2번이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「포스터 전체의 넓이를 나타내는 다항식은? [4점]」
**RPM** M3-RPM-020 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 도형 활용] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 도형 활용 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식의 활용 > 도형 활용**
- 이유: 가로 6x+6, 세로 4x+4의 직사각형 포스터 넓이 24x^2 + 48x + 24를 구하는 M3-RPM-020 레코드입니다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING **원천→판정: PT_M3_POLYNOMIAL_BORDER_AREA → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_PHOTO_GRID_MARGIN_EXPANSION → TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING**
- 이유: 직사각형 가로 6x+6과 세로 4x+4를 곱하여 (6x+6)(4x+4) = 24x^2+48x+24를 전개하는 TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사진 배열 가로 6x, 세로 4x에 여백을 더하여 (6x+6)(4x+4) = 24x^2+48x+24를 전개하는 2단계 기하 활용 문항입니다.

**4칸**
- given: 정사각형←stem:「한 변의 길이가 $2x$인 정사각형 모양의 사진 $6$장을」<br>직사각형←stem:「직사각형 모양의 전시 포스터를 제작하려고 한다.」
- goal: 다항식←stem:「포스터 전체의 넓이를 나타내는 다항식은? [4점]」
- method: 넓이(IMPLIED)←solution:「여백을 더하여 전체 직사각형의 변의 길이를 구한 뒤 다항식의 곱셈을 수행한다.」 — 직사각형 넓이 다항식 전개
- condition: (없음)

**how** 전체 가로 6x+6과 전체 세로 4x+4의 곱 (6x+6)(4x+4) = 24x^2+48x+24를 계산하여 2번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

사진 배열로 구성된 안쪽 직사각형의 가로·세로에 여백을 더하여 전체 직사각형의 변의 길이를 구한 뒤 다항식의 곱셈을 수행한다.

1단계: 사진 부분의 가로와 세로의 길이를 구한다. 한 변이 $2x$인 정사각형이 가로로 $3$장 배치되므로 $$\text{사진 가로 길이} = 2x \times 3 = 6x$$ 세로로 $2$장 배치되므로 $$\text{사진 세로 길이} = 2x \times 2 = 4x$$

2단계: 여백을 포함한 포스터 전체의 가로와 세로의 길이를 구한다.

- 좌·우에 각각 $3$의 여백이 있으므로 $$\text{전체 가로 길이} = 6x + 3 + 3 = 6x + 6$$  
- 상·하에 각각 $2$의 여백이 있으므로 $$\text{전체 세로 길이} = 4x + 2 + 2 = 4x + 4$$

3단계: 포스터 전체의 넓이를 다항식으로 전개한다. $$\text{전체 넓이} = (6x + 6)(4x + 4)$$ $$= 6x(4x + 4) + 6(4x + 4)$$ $$= 24x^2 + 24x + 24x + 24 = 24x^2 + 48x + 24$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $6x^2 - 7x - 20$을 인수분해하면 $(ax + b)(cx + d)$일 때, 두 일차식 $ax + b$와 $cx + d$의 합은? (단, $a, b, c, d$는 정수이고 $a, c > 0$) [4점]

**보기** ① $5x - 9$  ② $5x - 5$  ③ $5x - 1$  ④ $5x + 1$  ⑤ $7x - 8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 다항식 6x^2 - 7x - 20을 대각선 곱셈법으로 인수분해하면 (2x - 5)(3x + 4)이다.
2. 2. a, c > 0이고 정수이므로 ax + b = 2x - 5, cx + d = 3x + 4이다.
3. 3. 두 일차식의 합을 구하면 (2x - 5) + (3x + 4) = (2 + 3)x + (-5 + 4) = 5x - 1이다.
4. 4. 따라서 정답은 3번이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $6x^2 - 7x - 20$을 인수분해하면 $(ax + b)(cx + d)$일 때」
**RPM** M3-RPM-025 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > ax^2+bx+c의 인수분해 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식 > 이차식**
- 이유: 이차식 6x^2 - 7x - 20의 인수분해를 통해 ax+b와 cx+d의 합 5x-1을 구하는 M3-RPM-025 레코드입니다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_FORMULA_APPLICATION **원천→판정: PT_M3_AC_METHOD_FACTOR_SUM → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_NON_MONIC_QUADRATIC_FACTOR_SUM → TPL_M3_FACTORIZATION_FORMULA_APPLICATION**
- 이유: 이차식 6x^2 - 7x - 20을 (2x-5)(3x+4)로 인수분해하여 합 (2x-5)+(3x+4) = 5x-1을 계산하는 TPL_M3_FACTORIZATION_FORMULA_APPLICATION 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 6x^2-7x-20을 대각선 인수분해하여 두 일차식의 합 5x-1을 구하는 2단계 문항입니다.

**4칸**
- given: 다항식←stem:「다항식 $6x^2 - 7x - 20$을 인수분해하면 $(ax + b)(cx + d)$일 때」
- goal: 합←stem:「두 일차식 $ax + b$와 $cx + d$의 합은?」
- method: 인수분해(IMPLIED)←solution:「대각선 곱셈 인수분해 방법을 적용하여 이차식을 두 일차식의 곱으로 분해한 후 합을 구한다.」 — 대각선 곱셈 인수분해 적용
- condition: (없음)

**how** 6x^2 - 7x - 20을 대각선 곱셈으로 (2x-5)(3x+4)로 인수분해하고 합 (2+3)x + (-5+4) = 5x-1을 구하여 3번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

대각선 곱셈 인수분해 방법을 적용하여 이차식을 두 일차식의 곱으로 분해한 후 합을 구한다.

1단계: $6x^2 - 7x - 20$을 인수분해한다. 이차항 계수 $6 = 2 \times 3$, 상수항 $-20 = (-5) \times 4$로 두면 대각선 곱의 합은 $$2 \times 4 + 3 \times (-5) = 8 - 15 = -7$$ 로 일차항의 계수 $-7$과 정확히 일치한다. 따라서 $$6x^2 - 7x - 20 = (2x - 5)(3x + 4)$$

2단계: 두 인수의 합을 계산한다. 두 일차식은 $2x - 5$와 $3x + 4$이므로 $$(2x - 5) + (3x + 4) = (2 + 3)x + (-5 + 4) = 5x - 1$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다항식 $x^2 + 10x + k$가 두 일차식 $(x + a)(x + b)$의 곱으로 인수분해될 때, 상수 $k$의 최댓값과 최솟값의 합은? (단, $a, b$는 자연수) [5점]

**보기** ① $28$  ② $30$  ③ $32$  ④ $34$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. (x + a)(x + b) = x^2 + (a + b)x + ab = x^2 + 10x + k이므로 a + b = 10이고 k = ab이다.
2. 2. a, b가 자연수이므로 순서쌍 (a, b)는 (1, 9), (2, 8), (3, 7), (4, 6), (5, 5)이다.
3. 3. 각각의 곱 k는 9, 16, 21, 24, 25이다. 따라서 최솟값 m = 9, 최댓값 M = 25이다.
4. 4. 따라서 최댓값과 최솟값의 합은 25 + 9 = 34이다. 따라서 정답은 4번이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $x^2 + 10x + k$가 두 일차식 $(x + a)(x + b)$의 곱으로 인수분해될 때」
**RPM** M3-RPM-028 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 조건식] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해를 이용한 미정계수의 최대·최소 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 조건식**
- 이유: x^2 + 10x + k의 인수분해 조건 a+b=10에서 k=ab의 최댓값 25와 최솟값 9의 합 34를 구하는 M3-RPM-028 레코드입니다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT **원천→판정: PT_M3_FACTORABLE_CONSTANT_EXTREMA → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_FIXED_SUM_PRODUCT_EXTREMA → TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT**
- 이유: 자연수 a+b=10 조건에서 x^2+10x+k의 k=ab 최솟값 9와 최댓값 25를 구하여 M+m=34를 계산하는 TPL_M3_FACTORIZATION_INTEGER_CONSTRAINT 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: x^2+10x+k에서 a+b=10을 만족하는 자연수 쌍을 조사하여 k=ab의 최댓값 25와 최솟값 9를 구하고 합 34를 계산하는 2단계 문항입니다.

**4칸**
- given: 다항식←stem:「다항식 $x^2 + 10x + k$가 두 일차식」<br>자연수←stem:「(단, $a, b$는 자연수) [5점]」
- goal: 최댓값←stem:「상수 $k$의 최댓값과 최솟값의 합은?」
- method: 사칙연산(IMPLIED)←solution:「$k$의 최솟값과 최댓값을 찾아 합을 계산한다.」 — 자연수 곱의 최대 최소 탐색
- condition: (없음)

**how** x^2+10x+k에서 a+b=10인 자연수 쌍에서 k=ab의 최솟값 1*9=9, 최댓값 5*5=25를 찾아 25+9=34인 4번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

근과 계수의 관계 및 전개식을 통해 $a+b=10$과 $k=ab$의 조건을 설정하고 자연수 순서쌍을 나열하여 $k$의 범위를 구한다.

1단계: $a, b$와 $k$의 관계식을 유도한다. $$(x + a)(x + b) = x^2 + (a + b)x + ab = x^2 + 10x + k$$ 계수를 비교하면 $$a + b = 10, \quad k = ab$$

2단계: 합이 $10$인 자연수 순서쌍 $(a, b)$ ($a \le b$)와 그 곱 $k$를 조사한다.

- $a = 1, b = 9 \implies k = 1 \times 9 = 9$  
- $a = 2, b = 8 \implies k = 2 \times 8 = 16$  
- $a = 3, b = 7 \implies k = 3 \times 7 = 21$  
- $a = 4, b = 6 \implies k = 4 \times 6 = 24$  
- $a = 5, b = 5 \implies k = 5 \times 5 = 25$

3단계: $k$의 최솟값과 최댓값을 찾아 합을 계산한다.

- $k$의 최솟값 $m = 9$  
- $k$의 최댓값 $M = 25$ 따라서 구하는 합은 $$M + m = 25 + 9 = 34$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

세 자연수 $a, b, c$에 대하여 $x$에 대한 두 이차식 $x^2 + ax + 36$, $x^2 + bx - 24$를 각각 인수분해했을 때 공통인수가 $x + c$이다. 이때 $a - b + c$의 값은? (단, $c$는 한 자리 자연수) [5점]

**보기** ① $12$  ② $13$  ③ $14$  ④ $15$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. x = -c를 대입하면 (-c)^2 + a(-c) + 36 = 0에서 a = c + 36/c이고, (-c)^2 + b(-c) - 24 = 0에서 b = c - 24/c이다.
2. 2. a, b, c가 자연수이므로 c는 36과 24의 공약수인 1, 2, 3, 4, 6, 12 중 하나이다.
3. 3. b > 0이어야 하므로 c^2 > 24이고, c는 한 자리 자연수이므로 c = 6이다.
4. 4. c = 6일 때 a = 6 + 6 = 12, b = 6 - 4 = 2이다. 따라서 a - b + c = 12 - 2 + 6 = 16이다. 정답은 5번이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 두 이차식 $x^2 + ax + 36$, $x^2 + bx - 24$를 각각 인수분해했을 때 공통인수가 $x + c$이다.」
**RPM** M3-RPM-021 [다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수를 이용한 미정계수 결정 → 다항식의 곱셈과 인수분해 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: x^2+ax+36과 x^2+bx-24의 공통인수 x+c로부터 c=6, a=12, b=2를 구하는 M3-RPM-021 레코드입니다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_COMMON_FACTOR_PARAMETER_DETERMINATION **원천→판정: PT_M3_COMMON_FACTOR_PARAMETRIC_DETERMINATION → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_DUAL_QUADRATIC_COMMON_FACTOR_SYSTEM → TPL_M3_COMMON_FACTOR_PARAMETER_DETERMINATION**
- 이유: x^2+ax+36과 x^2+bx-24의 공통인수 x+c에서 c=6, a=12, b=2, a-b+c=16을 구하는 TPL_M3_COMMON_FACTOR_PARAMETER_DETERMINATION 템플릿입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x^2+ax+36과 x^2+bx-24에 x=-c를 대입하여 c가 공약수임을 도출하고 c=6, a=12, b=2를 특정하는 3단계 심화 문항입니다.

**4칸**
- given: 자연수←stem:「세 자연수 $a, b, c$에 대하여」
- goal: 식의값←stem:「이때 $a - b + c$의 값은? (단, $c$는 한 자리 자연수) [5점]」
- method: 공통인수(IMPLIED)←solution:「공통인수의 성질을 이용하여 $x = -c$를 대입했을 때」 — 공통인수 대입을 통한 미정계수 결정
- condition: (없음)

**how** x=-c를 대입해 x^2+ax+36과 x^2+bx-24에서 a=c+36/c, b=c-24/c를 얻고 c^2>24인 한 자리 자연수 c=6에서 a=12, b=2, a-b+c=16인 5번으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

공통인수의 성질을 이용하여 $x = -c$를 대입했을 때 두 식이 모두 $0$이 됨을 연립하여 $a, b, c$를 결정한다.

1단계: 공통인수 조건을 수식으로 표현한다. $x + c$가 두 이차식의 인수이므로 $x = -c$를 대입하면 두 식의 값은 모두 $0$이다. $$(-c)^2 + a(-c) + 36 = 0 \implies c^2 - ac + 36 = 0 \implies ac = c^2 + 36 \implies a = c + \frac{36}{c}$$ $$(-c)^2 + b(-c) - 24 = 0 \implies c^2 - bc - 24 = 0 \implies bc = c^2 - 24 \implies b = c - \frac{24}{c}$$

2단계: $c$의 후보를 좁히고 자연수 조건을 적용한다. $a, b, c$가 모두 자연수이므로 $c$는 $36$과 $24$의 공약수이어야 한다. $36$과 $24$의 공약수는 $1, 2, 3, 4, 6, 12$이다. 또한 $b = c - \frac{24}{c} > 0$이어야 하므로 $$c^2 > 24$$ 이를 만족하는 공약수는 $c = 6$과 $c = 12$이다. 문제의 조건에서 $c$는 한 자리 자연수이므로 $$c = 6$$

3단계: $a, b$의 값을 구하고 검산한다. $c = 6$을 대입하면 $$a = 6 + \frac{36}{6} = 6 + 6 = 12$$ $$b = 6 - \frac{24}{6} = 6 - 4 = 2$$ 실제로 두 이차식을 인수분해하면 $$x^2 + 12x + 36 = (x + 6)^2$$ $$x^2 + 2x - 24 = (x + 6)(x - 4)$$ 로 공통인수 $x + 6$을 정확히 갖는다.

4단계: $a - b + c$의 값을 계산한다. $$a - b + c = 12 - 2 + 6 = 16$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<서술형 1> 다음 물음에 답하고, 그 과정을 서술하시오. [총 6점, 부분점수 있음] (1) $\sqrt{26} < x \le \sqrt{95}$를 만족하는 자연수 $x$의 개수를 구하시오. [3점] (2) $\sqrt{10}$보다 크거나 같고 $\sqrt{y}$보다 작은 자연수의 개수가 $5$개가 되도록 하는 자연수 $y$의 개수를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 4 (2) 17   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 5^2 = 25 < 26 < 36이므로 5 < sqrt(26) < 6이고, 9^2 = 81 < 95 < 100이므로 9 < sqrt(95) < 10이다. 따라서 sqrt(26) < x <= sqrt(95)를 만족하는 자연수 x는 6, 7, 8, 9의 4개이다.
2. 2. 3 < sqrt(10) < 4이므로 sqrt(10) 이상의 가장 작은 자연수는 4이다. 4부터 연속된 5개의 자연수는 4, 5, 6, 7, 8이다.
3. 3. 이 5개의 자연수가 sqrt(y)보다 작고 9는 sqrt(y) 이상이어야 하므로 8 < sqrt(y) <= 9이다.
4. 4. 제곱하면 64 < y <= 81이므로 자연수 y는 65부터 81까지의 81 - 64 = 17개이다. 따라서 정답은 (1) 4, (2) 17이다.
- 작성자 답: (1) 4 (2) 17 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「(1) $\sqrt{26} < x \le \sqrt{95}$를 만족하는 자연수 $x$의 개수를 구하시오. [3점]」
**RPM** M3-RPM-004 [실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소] **원천→판정: 수와 연산 > 실수와 그 연산 > 제곱근과 실수 > 제곱근의 부등식 → 실수와 그 연산 > 제곱근과 실수 > 무리수와 실수 > 실수의 대소**
- 이유: 제곱근 부등식 sqrt(26) < x <= sqrt(95)에서 4개, 64 < y <= 81에서 17개를 구하는 M3-RPM-004 레코드입니다.
**유형** PT=PT_M3_REAL_NUMBER_COMPARISON / TPL=TPL_M3_REAL_COMPARISON_INTEGER_RANGE **원천→판정: PT_M3_RADICAL_INEQUALITY_INTEGER_COUNT → PT_M3_REAL_NUMBER_COMPARISON** **원천→판정: TPL_M3_DOUBLE_SIDED_SQUARE_ROOT_COUNT → TPL_M3_REAL_COMPARISON_INTEGER_RANGE**
- 이유: 제곱근의 부등식 sqrt(26) < x <= sqrt(95)와 64 < y <= 81에서 자연수 개수 4개와 17개를 구하는 TPL_M3_REAL_COMPARISON_INTEGER_RANGE 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 제곱수 범위를 이용하여 부등식 sqrt(26) < x <= sqrt(95)를 만족하는 자연수 개수 (1) 4개, (2) 17개를 2단계로 구하는 서술형 문항입니다.

**4칸**
- given: 자연수←stem:「만족하는 자연수 $x$의 개수를 구하시오. [3점]」
- goal: 개수←stem:「자연수 $y$의 개수를 구하시오. [3점]」
- method: 사칙연산(IMPLIED)←solution:「부등식 $\sqrt{26} < x \le \sqrt{95}$를 만족하는 자연수 $x$를 구한다.」 — 제곱근 부등식을 풀어 자연수 개수 계산
- condition: (없음)

**how** 5<sqrt(26)<6, 9<sqrt(95)<10에서 x는 6..9의 4개, 4부터 8까지 5개이므로 64<y<=81에서 y는 81-64=17개로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

제곱근의 정수 부분과 연속된 자연수의 개수를 부등식으로 표현하여 서술한다.

(1) 단계별 서술: 1단계: $\sqrt{26}$과 $\sqrt{95}$의 범위를 제곱수로 파악한다. $5^2 = 25 < 26 < 36 = 6^2$이므로 $5 < \sqrt{26} < 6$이다. $9^2 = 81 < 95 < 100 = 10^2$이므로 $9 < \sqrt{95} < 10$이다. 2단계: 부등식 $\sqrt{26} < x \le \sqrt{95}$를 만족하는 자연수 $x$를 구한다. $5 < \sqrt{26} < x$이므로 가능한 자연수 $x$는 $6$ 이상이다. $x \le \sqrt{95} < 10$이므로 가능한 자연수 $x$는 $9$ 이하이다. 따라서 조건을 만족하는 자연수 $x$는 $6, 7, 8, 9$이다. 개수는 $4$개이다.

(2) 단계별 서술: 1단계: $\sqrt{10}$의 정수 부분을 파악하고 시작 자연수를 결정한다. $3^2 = 9 < 10 < 16 = 4^2$이므로 $3 < \sqrt{10} < 4$이다. 따라서 $\sqrt{10} \le n$을 만족하는 가장 작은 자연수는 $n = 4$이다. 2단계: 포함되는 $5$개의 연속된 자연수를 정한다. $4$부터 시작하여 연속된 $5$개의 자연수는 $4, 5, 6, 7, 8$이다. 3단계: $\sqrt{y}$의 범위를 설정하여 $y$의 개수를 구한다. 이 $5$개의 자연수는 $\sqrt{y}$보다 작아야 하고, 다음 자연수인 $9$는 $\sqrt{y}$보다 작지 않아야 하므로 $$8 < \sqrt{y} \le 9$$ 각 변이 양수이므로 제곱하면 $$64 < y \le 81$$ 이를 만족하는 자연수 $y$는 $65$부터 $81$까지이므로 개수는 $$81 - 64 = 17\text{개}$$

따라서 (1) 4, (2) 17이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<서술형 2> 다음 조건을 만족하는 세 자연수 $A, B, C$에 대하여 각 물음에 답하고 과정을 서술하시오. [총 5점, 부분점수 있음] [조건 1] $(x + A)(x - 2)$를 전개했을 때의 상수항은 $(x - 3)(x - 7)$을 전개했을 때의 $x$의 계수와 같다. [조건 2] $x^2 + Bx + 30 = (x + A)(x + C)$ (1) [조건 1]을 이용하여 자연수 $A$의 값을 구하시오. [1점] (2) [조건 2]를 이용하여 자연수 $B, C$의 값을 각각 구하시오. [2점] (3) 구한 $A, B, C$의 값을 이용하여 다항식 $(Ax + B)(Cx - 3)$을 전개하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) A=5 (2) B=11, C=6 (3) 30x^2+51x-33   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. (x + A)(x - 2)의 상수항은 -2A이고, (x - 3)(x - 7) = x^2 - 10x + 21의 x 계수는 -10이므로 -2A = -10에서 A = 5이다.
2. 2. (x + 5)(x + C) = x^2 + (5 + C)x + 5C = x^2 + Bx + 30에서 상수항 5C = 30이므로 C = 6이고, 일차항 B = 5 + 6 = 11이다.
3. 3. (Ax + B)(Cx - 3) = (5x + 11)(6x - 3) = 30x^2 - 15x + 66x - 33 = 30x^2 + 51x - 33이다.
4. 4. 따라서 정답은 (1) A=5, (2) B=11, C=6, (3) 30x^2+51x-33이다.
- 작성자 답: (1) A=5 (2) B=11, C=6 (3) 30x^2+51x-33 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-POLYNOMIAL_MULTIPLICATION(다항식의 곱셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「[조건 1] $(x + A)(x - 2)$를 전개했을 때의 상수항은 $(x - 3)(x - 7)$을 전개했을 때의 $x$의 계수와 같다.」
**RPM** M3-RPM-017 [다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 미정계수를 포함한 식의 전개 → 다항식의 곱셈과 인수분해 > 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱**
- 이유: 두 일차식의 전개와 계수비교로 A=5, B=11, C=6 및 (5x+11)(6x-3) 전개를 다루는 M3-RPM-017 레코드입니다.
**유형** PT=PT_M3_POLY_MULTIPLICATION / TPL=TPL_M3_POLY_EXPANSION_COEFFICIENT **원천→판정: PT_M3_POLYNOMIAL_COEFFICIENT_CHAIN → PT_M3_POLY_MULTIPLICATION** **원천→판정: TPL_M3_COEFFICIENT_MATCH_SUBSTITUTION_EXPANSION → TPL_M3_POLY_EXPANSION_COEFFICIENT**
- 이유: 계수비교로 A=5, C=6, B=11을 구하고 (5x+11)(6x-3) = 30x^2+51x-33을 전개하는 TPL_M3_POLY_EXPANSION_COEFFICIENT 템플릿입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 조건 1에서 A=5, 조건 2에서 C=6, B=11을 구하고 (5x+11)(6x-3) 식을 전개하는 2단계 서술형 문항입니다.

**4칸**
- given: 자연수←stem:「다음 조건을 만족하는 세 자연수 $A, B, C$에 대하여」
- goal: 다항식←stem:「다항식 $(Ax + B)(Cx - 3)$을 전개하시오. [2점]」
- method: 계수(IMPLIED)←solution:「다항식의 전개와 계수비교법을 단계별로 적용하여 서술한다.」 — 전개식 계수비교를 통해 미정계수 결정
- condition: (없음)

**how** -2A=-10에서 A=5, 5C=30에서 C=6, B=11을 구하고 (5x+11)(6x-3) = 30x^2+51x-33으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

다항식의 전개와 계수비교법을 단계별로 적용하여 서술한다.

(1) 단계별 서술: $(x + A)(x - 2) = x^2 + (A - 2)x - 2A$이므로 전개식의 상수항은 $-2A$이다. 한편 $(x - 3)(x - 7) = x^2 - 10x + 21$이므로 $x$의 계수는 $-10$이다. [조건 1]에 의해 상수항과 $x$의 계수가 같으므로 $$-2A = -10 \implies A = 5$$

(2) 단계별 서술: $A = 5$를 [조건 2]의 우변에 대입하여 전개하면 $$(x + 5)(x + C) = x^2 + (5 + C)x + 5C$$ 이 식이 $x^2 + Bx + 30$과 일치해야 하므로 계수를 비교한다. 상수항: $5C = 30 \implies C = 6$ 일차항: $B = 5 + C = 5 + 6 = 11$ 따라서 $B = 11, C = 6$이다.

(3) 단계별 서술: 구한 $A = 5, B = 11, C = 6$을 $(Ax + B)(Cx - 3)$에 대입하면 $$(5x + 11)(6x - 3)$$ 이를 분배법칙을 이용하여 전개하면 $$(5x)(6x) + (5x)(-3) + 11(6x) + 11(-3)$$ $$= 30x^2 - 15x + 66x - 33 = 30x^2 + 51x - 33$$

따라서 (1) A=5, (2) B=11, C=6, (3) 30x^2+51x-33 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<서술형 3> 다음 물음에 답하고, 그 과정을 서술하시오. [총 4점, 부분점수 있음] (1) 인수분해 공식을 이용하여 다항식 $x^2 + 14x + 40$을 인수분해하시오. [2점] (2) (1)의 결과를 이용하여 $86^2 + 14 \times 86 + 40$의 값을 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) (x+4)(x+10) (2) 8640   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 상수항 40과 일차항 계수 14에 대해 4 * 10 = 40, 4 + 10 = 14이므로 x^2 + 14x + 40 = (x + 4)(x + 10)이다.
2. 2. 86^2 + 14*86 + 40은 x = 86을 대입한 식과 같으므로 (86 + 4)(86 + 10) = 90 * 96이다.
3. 3. 90 * 96 = 8640이다.
4. 4. 따라서 정답은 (1) (x+4)(x+10), (2) 8640이다.
- 작성자 답: (1) (x+4)(x+10) (2) 8640 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-02(다항식의 곱셈과 인수분해) / M3-02-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「(1) 인수분해 공식을 이용하여 다항식 $x^2 + 14x + 40$을 인수분해하시오. [2점]」
**RPM** M3-RPM-026 [다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산] **원천→판정: 문자와 식 > 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해 공식의 수 계산 활용 → 다항식의 곱셈과 인수분해 > 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산**
- 이유: 인수분해 (x+4)(x+10)을 이용하여 86^2 + 14*86 + 40 = 90*96 = 8640의 수 계산을 수행하는 M3-RPM-026 레코드입니다.
**유형** PT=PT_M3_POLY_FACTORIZATION / TPL=TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION **원천→판정: PT_M3_FACTORING_FORMULA_ARITHMETIC → PT_M3_POLY_FACTORIZATION** **원천→판정: TPL_M3_QUADRATIC_FACTOR_THEN_EVALUATE → TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION**
- 이유: 이차식 x^2+14x+40 = (x+4)(x+10)의 인수분해를 수 계산 90*96 = 8640에 적용하는 TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION 템플릿입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차식 x^2+14x+40 인수분해와 x=86 대입 수 계산 8640을 1단계로 적용하는 기본 서술형 문항입니다.

**4칸**
- given: 인수분해←stem:「(1) 인수분해 공식을 이용하여 다항식 $x^2 + 14x + 40$을 인수분해하시오. [2점]」
- goal: 식의값←stem:「$86^2 + 14 \times 86 + 40$의 값을 구하시오. [2점]」
- method: 사칙연산(IMPLIED)←solution:「다항식과 수 계산에 연계 적용하여 서술한다.」 — 인수분해 결과에 수 대입 계산
- condition: (없음)

**how** x^2+14x+40 = (x+4)(x+10)에 x=86을 대입하여 (86+4)(86+10) = 90*96 = 8640으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

인수분해 공식 $x^2 + (a+b)x + ab = (x+a)(x+b)$를 다항식과 수 계산에 연계 적용하여 서술한다.

(1) 단계별 서술: 상수항 $40$과 일차항의 계수 $14$에 대하여 두 수의 곱이 $40$이고 합이 $14$인 두 자연수를 찾으면 $4$와 $10$이다. $$4 \times 10 = 40, \quad 4 + 10 = 14$$ 따라서 인수분해 공식을 적용하면 $$x^2 + 14x + 40 = (x + 4)(x + 10)$$

(2) 단계별 서술: 주어진 식 $86^2 + 14 \times 86 + 40$은 (1)의 다항식 $x^2 + 14x + 40$에 $x = 86$을 대입한 식과 같다. (1)의 인수분해된 결과에 $x = 86$을 대입하면 $$86^2 + 14 \times 86 + 40 = (86 + 4)(86 + 10)$$ $$= 90 \times 96$$ 두 수의 곱을 계산하면 $$90 \times 96 = 8640$$

따라서 (1) (x+4)(x+10), (2) 8640 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

<서술형 4> 가로의 길이가 $x(x > \sqrt{10})$, 세로의 길이가 $\sqrt{10}$인 직사각형 $\mathrm{ABCD}$가 있다. 이 직사각형의 긴 변을 이등분하여 두 개의 합동인 직사각형을 만들 때, 새로 만들어진 직사각형은 처음 직사각형 $\mathrm{ABCD}$와 서로 닮음이다. 이와 같은 긴 변 이등분 과정을 반복하여 닮은 직사각형들을 계속 만들어 갈 때, 다음 물음에 답하고 그 과정을 서술하시오. [총 5점, 부분점수 있음] (단, 모든 계산 결과는 가장 간단한 형태로 나타낼 것) (1) 처음 직사각형 가로의 길이 $x$의 값을 구하시오. [1점] (2) 가로 변을 계속해서 절반씩 분할하여 만든 선분 중, 처음 직사각형의 세로 선분 $\overline{\mathrm{AB}} = \sqrt{10}$과 $3$번째로 생기는 평행한 선분 $\overline{\mathrm{JK}} = \frac{\sqrt{10}}{4}$를 윗변과 아랫변으로 하고, 두 선분 사이의 거리가 $\frac{3\sqrt{5}}{2}$인 사다리꼴 $\mathrm{ABJK}$의 넓이를 구하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 2\sqrt{5} (2) \frac{75\sqrt{2}}{16}   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1. 직사각형 ABCD의 긴 변 x와 짧은 변 sqrt(10)에 대해 이등분한 직사각형의 두 변은 sqrt(10)과 x/2이다. 닮음비 x/sqrt(10) = sqrt(10)/(x/2)에서 x^2/2 = 10, x^2 = 20이므로 x = sqrt(20) = 2*sqrt(5)이다.
2. 2. 사다리꼴 ABJK의 윗변은 sqrt(10), 아랫변은 sqrt(10)/4, 높이는 3*sqrt(5)/2이다.
3. 3. 윗변 + 아랫변 = sqrt(10) + sqrt(10)/4 = 5*sqrt(10)/4이다.
4. 4. 넓이는 1/2 * (5*sqrt(10)/4) * (3*sqrt(5)/2) = 15*sqrt(50)/16 = (15 * 5*sqrt(2))/16 = 75*sqrt(2)/16이다. 따라서 정답은 (1) 2*sqrt(5), (2) 75*sqrt(2)/16이다.
- 작성자 답: (1) 2\sqrt{5} (2) \frac{75\sqrt{2}}{16} → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-01(실수와 그 계산) / M3-01-REAL_NUMBER_OPERATIONS(근호를 포함한 식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「가로의 길이가 $x(x > \sqrt{10})$, 세로의 길이가 $\sqrt{10}$인 직사각형 $\mathrm{ABCD}$가 있다.」
**RPM** M3-RPM-007 [실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱] **원천→판정: 수와 연산 > 실수와 그 연산 > 근호를 포함한 식의 계산 > 닮음도형에서의 제곱근 활용 → 실수와 그 연산 > 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱**
- 이유: 직사각형 ABCD의 닮음비 x/sqrt(10) = sqrt(10)/(x/2)에서 x=2*sqrt(5)를 구하고 사다리꼴 ABJK 넓이 75*sqrt(2)/16을 계산하는 M3-RPM-007 레코드입니다.
**유형** PT=PT_M3_SQUARE_ROOT_APPLICATION / TPL=TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION **원천→판정: PT_M3_SIMILAR_RECTANGLE_RADICAL_TRAPEZOID → PT_M3_SQUARE_ROOT_APPLICATION** **원천→판정: TPL_M3_ITERATED_HALVING_SIMILAR_RECTANGLE → TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION**
- 이유: 직사각형 닮음비 x^2=20에서 x=2*sqrt(5)를 구하고 사다리꼴 넓이 공식 1/2*(5*sqrt(10)/4)*(3*sqrt(5)/2) = 75*sqrt(2)/16을 계산하는 TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION 템플릿입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮음비 비례식으로 x=2*sqrt(5)를 구하고 사다리꼴 ABJK의 넓이 75*sqrt(2)/16을 계산하는 3단계 심화 문항입니다.

**4칸**
- given: 직사각형←stem:「가로의 길이가 $x(x > \sqrt{10})$, 세로의 길이가 $\sqrt{10}$인 직사각형 $\mathrm{ABCD}$가 있다.」
- goal: 넓이←stem:「사다리꼴 $\mathrm{ABJK}$의 넓이를 구하시오. [4점]」
- method: 사칙연산(IMPLIED)←solution:「사다리꼴의 넓이 공식에 대입하여 계산한다.」 — 사다리꼴 넓이 공식 및 근호 곱셈 적용
- condition: (없음)

**how** 닮음비 x/sqrt(10) = sqrt(10)/(x/2)에서 x^2=20, x=2*sqrt(5)를 구하고 사다리꼴 넓이 1/2*(5*sqrt(10)/4)*(3*sqrt(5)/2) = 75*sqrt(2)/16으로 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형의 닮음비 비례식과 무리수 사다리꼴 넓이 공식을 적용하여 서술한다.

(1) 단계별 서술: 처음 직사각형 $\mathrm{ABCD}$의 가로의 길이는 $x$, 세로의 길이는 $\sqrt{10}$이며 $x > \sqrt{10}$이다. 긴 변인 가로를 이등분하여 만든 새 직사각형의 두 변의 길이는 $\sqrt{10}$과 $\frac{x}{2}$이다. 두 직사각형이 서로 닮음이므로 대응하는 긴 변과 짧은 변의 비가 같다. $$\frac{x}{\sqrt{10}} = \frac{\sqrt{10}}{\frac{x}{2}}$$ 외항의 곱과 내항의 곱이 같으므로 $$x \times \frac{x}{2} = (\sqrt{10})^2 \implies \frac{x^2}{2} = 10 \implies x^2 = 20$$ $x > \sqrt{10} > 0$이므로 $$x = \sqrt{20} = 2\sqrt{5}$$

(2) 단계별 서술: 1단계: 사다리꼴의 윗변과 아랫변, 높이를 확인한다.

- 윗변의 길이: $\overline{\mathrm{AB}} = \sqrt{10}$  
- 아랫변의 길이: $\overline{\mathrm{JK}} = \frac{\sqrt{10}}{4}$  
- 사다리꼴의 높이(두 평행선 사이의 거리): $h = \frac{3\sqrt{5}}{2}$

2단계: 사다리꼴의 넓이 공식에 대입하여 계산한다. $$\text{넓이} = \frac{1}{2} \times (\text{윗변} + \text{아랫변}) \times \text{높이}$$ $$= \frac{1}{2} \times \left(\sqrt{10} + \frac{\sqrt{10}}{4}\right) \times \frac{3\sqrt{5}}{2}$$ 괄호 안을 통분하여 정리하면 $$\sqrt{10} + \frac{\sqrt{10}}{4} = \frac{5\sqrt{10}}{4}$$ 따라서 넓이는 $$\frac{1}{2} \times \frac{5\sqrt{10}}{4} \times \frac{3\sqrt{5}}{2} = \frac{15\sqrt{50}}{16}$$ $\sqrt{50} = \sqrt{25 \times 2} = 5\sqrt{2}$이므로 $$\frac{15 \times 5\sqrt{2}}{16} = \frac{75\sqrt{2}}{16}$$

따라서 (1) $2\sqrt{5}$, (2) $\frac{75\sqrt{2}}{16}$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
