# lane20 확통 1학기 중간 기출 딥 감사 — 23_매산여고_1학기_중간_고2_확률과통계.js

- **sourcePath**: `archive/exams/original/high/h2/1mid/23_매산여고_1학기_중간_고2_확률과통계.js`
- **sourceRef / blob SHA**: `main` / `e878d8de0ca7b7a0fe718c5bce034bf80360fdef`
- **라인·범위**: lane20 / 확률과 통계(`probstat`) / 고2 / **1학기 중간 기출**. 1학기 기말은 후속, 2학기 확통은 별도 라인 전담.
- **원본 과목 검증**: 모든 문항 `standardCourse=확률과 통계`; 원본 source 경로·시험지 제목·실제 내용 대조.
- **문항 총수·실제 읽음**: 22 / 22. **KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0**.
- **원본 이미지**: 자산 6개(PNG 3, SVG 3)를 GitHub `main`에서 원문 fetch; PNG 각 이미지 직접 판독, SVG 각 Inkscape PNG 렌더를 시각 확인. 추가 생성·원본 교체 없음.
- **작업 브랜치**: `work/solution-upgrade-lane-20-20261121` / `docs/operations/solution-upgrade-reservations/staged/probstat/23_매산여고_1학기_중간_고2_확률과통계_DEEP_AUDIT.md`
- **수준 경계**: EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / AUDIT_DRAFT_COMPLETE. 이는 MD 심층 감사·개선 풀이 초안 완료만 뜻한다. 전체 core 직접 열람 read-receipt·preflight·Golden/Negative·원본 PDF 페이지 대조·학생 화면 회귀는 **NOT_RUN / EVIDENCE_DEBT**. JS/SVG/main 배포 변경 없음, 출고 PASS 아님.

## Q01 — KEEP

- **qid / ordinal / sourceIdentityKey**: 1 / 1 / `NOT_PRESENT`
- **category / answer**: 순열과 조합의 공식 확인 / `①` (보기: ㄱ, ㄴ, ㄷ | ㄱ, ㄴ | ㄱ, ㄷ | ㄴ, ㄷ | ㄴ)
- **문제 실제 조건**: 다음 보기에서 옳은 것을 모두 고르면? [3.2점] /  / 〔보기〕 / ㄱ. $\frac{7!}{4! \times 3!} = 35$이다. / ㄴ. ${}_3\Pi_4 = 81$이다. / ㄷ. ${}_3\mathrm{H}_4 = 15$이다.
- **기존 solution 실제 발췌**: > ㄱ. $\dfrac{7!}{4!\times3!}=\dfrac{7\times6\times5}{3\times2\times1}=35$이므로 참이다. / ㄴ. 중복순열은 각 자리에 3가지씩 놓으므로 ${}_3\Pi_4=3^4=81$이다. 참이다. / 따라서 ㄱ, ㄴ, ㄷ이 모두 옳으므로 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 7!/(4!3!)=35, 3Π4=81, 3H4=C6,4=15 모두 참; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q02 — KEEP

- **qid / ordinal / sourceIdentityKey**: 2 / 2 / `NOT_PRESENT`
- **category / answer**: 최단 경로로 가는 경우의 수 / `③` (보기: 103 | 104 | 105 | 106 | 107)
- **문제 실제 조건**: 오른쪽 그림과 같은 도로망이 있다. 지점 $\mathrm{P}$에서 지점 $\mathrm{R}$를 거쳐 지점 $\mathrm{Q}$까지 가는 최단 경로의 수를 구하면? [3.3점]
- **기존 solution 실제 발췌**: > 그림에서 $P$는 왼쪽 아래 꼭짓점, $R$은 오른쪽으로 4칸·위로 3칸 간 꼭짓점, $Q$는 $R$에서 오른쪽으로 2칸·위로 1칸 간 꼭짓점이다. / $P$에서 $R$까지는 오른쪽 4번과 위쪽 3번의 순서를 정하므로 ${}_7\mathrm C_3=35$가지이다. / 따라서 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 원본 6×4 도로망에서 P→R (오른4 위3) C7,3=35, R→Q(오른2 위1) C3,1=3, 곱105; ③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q03 — KEEP

- **qid / ordinal / sourceIdentityKey**: 3 / 3 / `NOT_PRESENT`
- **category / answer**: 중복을 허용한 네 자리 자연수 / `④` (보기: 1724 | 1725 | 1726 | 1727 | 1728)
- **문제 실제 조건**: $6$개의 숫자 $0, 1, 2, 3, 4, 5$에서 중복을 허용하여 네 자리 자연수를 만들 때, 다음 (1), (2)에서 $P+Q$의 값을 구하면? [3.4점] /  / (1) 네 자리의 자연수의 개수는 $P$개이다. / (2) $3000$보다 큰 자연수의 개수는 $Q$개이다.
- **기존 solution 실제 발췌**: > 첫 자리에는 0을 놓을 수 없으므로 첫 자리의 선택은 1, 2, 3, 4, 5의 5가지이다. 나머지 세 자리는 각각 0부터 5까지 6가지씩 선택할 수 있다. / $P=5\times6^3=1080$이다. / 따라서 $P+Q=1080+647=1727$이고, 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 중복 허용 네 자리 첫 비영0 5·6³=1080, 3000 초과 첫4/5 2·6³+첫3(6³−1)=647, 합1727; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q04 — KEEP

- **qid / ordinal / sourceIdentityKey**: 4 / 4 / `NOT_PRESENT`
- **category / answer**: 조합과 양의 정수해 / `⑤` (보기: 215 | 214 | 213 | 212 | 211)
- **문제 실제 조건**: 다음 (1), (2)에서 $P+Q$의 값을 구하면? [3.8점] /  / (1) 다항식 $(a+b+c)^6(x+y)^6$의 전개식에서 서로 다른 항의 개수를 구하면 $P$개이다. / (2) 방정식 $a+b+c=7$에서 $a, b, c$가 모두 양의 정수인 해의 개수는 $Q$개이다.
- **기존 solution 실제 발췌**: > (1) $(a+b+c)^6$에서 지수의 합이 6인 세 변수의 지수쌍은 음이 아닌 정수해의 수와 같다. / $u+v+w=6$의 음이 아닌 정수해는 ${}_{6+3-1}\mathrm C_{3-1}={}_8\mathrm C_2=28$개이다. / 따라서 $P+Q=196+15=211$이고, 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: (a+b+c)^6 항 C8,2=28, (x+y)^6 항7 ⇒P=196; 양의 a+b+c=7 해 C6,2=15 ⇒211; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q05 — KEEP

- **qid / ordinal / sourceIdentityKey**: 5 / 5 / `NOT_PRESENT`
- **category / answer**: 반복 선택 부호의 수 / `②` (보기: 9 | 8 | 7 | 6 | 5)
- **문제 실제 조건**: 기호 ▲, ★를 나열하여 부호를 만든다고 한다. 예를 들면, ▲▲★, ★★▲▲▲와 같이 중복을 허락하여 $300$개의 부호를 만들려면 기호를 최소한 몇 개까지 사용해야 하는가? [3.8점]
- **기존 solution 실제 발췌**: > 길이가 $k$인 부호는 각 자리마다 ▲ 또는 ★를 고르므로 $2^k$개이다. / 길이가 1부터 $n$까지인 부호의 전체 개수는 $2+2^2+\cdots+2^n=2^{n+1}-2$이다. / 따라서 필요한 기호의 최소 개수는 8개이고, 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 두 기호 길이1..n 신호 합2^{n+1}−2≥300, n7은254,n8은510 ⇒8; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q06 — KEEP

- **qid / ordinal / sourceIdentityKey**: 6 / 6 / `NOT_PRESENT`
- **category / answer**: 이항전개식의 계수 / `②` (보기: 1 | 2 | 3 | 4 | 5)
- **문제 실제 조건**: $(2x-a)^5$의 전개식에서 $x^3$의 계수와 $x^2$의 계수의 합이 $0$일 때, 양수 $a$의 값을 구하면? [3.7점]
- **기존 solution 실제 발췌**: > $(2x-a)^5$의 일반항에서 $x^3$항은 $x$를 3번 선택한 항이다. / 그 계수는 ${}_5\mathrm C_3\cdot2^3\cdot(-a)^2=80a^2$이다. / 따라서 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: (2x−a)^5 x³ 계수80a², x² 계수−40a³, 합40a²(2−a)=0, a>0⇒a=2; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q07 — KEEP

- **qid / ordinal / sourceIdentityKey**: 7 / 7 / `NOT_PRESENT`
- **category / answer**: 곱으로 주어진 전개식의 계수 / `③` (보기: -4 | -2 | 0 | 2 | 4)
- **문제 실제 조건**: $(x^2-2)\left(x+\frac{1}{x}\right)^5$의 전개식에서 $x^3$의 계수를 구하면? [4점]
- **기존 solution 실제 발췌**: > $(x+\frac1x)^5$의 일반항은 ${}_5\mathrm C_k x^{5-2k}$이다. / $x^2$를 곱한 부분에서 $x^3$이 되려면 $5-2k+2=3$이므로 $k=2$이다. 이때 계수는 ${}_5\mathrm C_2=10$이다. / 따라서 $x^3$의 계수는 $10-10=0$이고, 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: (x²−2)(x+1/x)^5 x³ 계수 C5,2−2C5,1=10−10=0; ③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q08 — KEEP

- **qid / ordinal / sourceIdentityKey**: 8 / 8 / `NOT_PRESENT`
- **category / answer**: 이항계수 항등식 / `⑤` (보기: ${}_n\mathrm{C}_{r-1}, \; {}_{n-1}\mathrm{C}_r, \; {}_n\mathrm{C}_{n-r}$ | ${}_n\mathrm{C}_{r-1}, \; {}_{n-1}\mathrm{C}_{r-1}, \; {}_n\mathrm{C}_{n-r-1}$ | ${}_n\mathrm{C}_r, \; {}_n\mathrm{C}_{r-1}, \; {}_n\mathrm{C}_{n-r}$ | ${}_n\mathrm{C}_r, \; {}_{n-1}\mathrm{C}_{r-1}, \; {}_n\mathrm{C}_{n-r-1}$ | ${}_n\mathrm{C}_r, \; {}_{n-1}\mathrm{C}_{r-1}, \; {}_n\mathrm{C}_{n-r}$)
- **문제 실제 조건**: 다음은 등식 / $${}_n\mathrm{C}_1 + 2 \times {}_n\mathrm{C}_2 + 3 \times {}_n\mathrm{C}_3 + \cdots + n \times {}_n\mathrm{C}_n = n \times 2^{n-1} \quad (n \ge 2)$$ / 이 성립함을 두 가지 방법으로 증명하는 과정이다. (가), (나), (다)에 알맞은 식을 차례로 나열한 것을 고르면? [4.4점] /  / 〔증명〕 / (ⅰ) $r \times \text{(가)} = n \times \text{(나)}$를 이용하여 증명하기. / $$\begin{aligned} / &{}_n\mathrm{C}_1 + 2 \times {}_n\mathrm{C}_2 + 3 \times {}_n\mathrm{C}_3 + \cdots + n \times {}_n\mathrm{C}_n \\ / &= n \times {}_{n-1}\mathrm{C}_0 + n \times {}_{n-1}\mathrm{C}_1 + n \times {}_{n-1}\mathrm{C}_2 + \cdots + n \times {}_{n-1}\mathrm{C}_{n-1} \\ / &= n \times ({}_{n-1}\mathrm{C}_0 + {}_{n-1}\mathrm{C}_1 + {}_{n-1}\mathrm{C}_2 + \cdots + {}_{n-1}\mathrm{C}_{n-1}) \\ / &= n \times 2^{n-1} / \end{aligned}$$ /  / (ⅱ) ${}_n\mathrm{C}_r = \text{(다)}$를 이용하여 증명하기. / $$S = {}_n\mathrm{C}_1 + 2 \times {}_n\mathrm{C}_2 + 3 \times {}_n\mathrm{C}_3 + \cdots + (n-1) \times {}_n\mathrm{C}_{n-1} + n \times {}_n\mathrm{C}_n \quad \cdots \text{①}$$ / 이라고 하면 / $$S = {}_n\mathrm{C}_{n-1} + 2 \times {}_n\mathrm{C}_{n-2} + 3 \times {}_n\mathrm{C}_{n-3} + \cdots + (n-1) \times {}_n\mathrm{C}_1 + n \times {}_n\mathrm{C}_0 \quad \cdots \text{②}$$ / ① + ②를 하면 / $$2S = n \times {}_n\mathrm{C}_0 + n \times {}_n\mathrm{C}_1 + n \times {}_n\mathrm{C}_2 + \cdots + n \times {}_n\mathrm{C}_n = n \times 2^n$$ / 따라서 $S = n \times 2^{n-1}$
- **기존 solution 실제 발췌**: > (ⅰ) ${}_n\mathrm C_r$의 정의에서 $r\cdot{}_n\mathrm C_r=n\cdot{}_{n-1}\mathrm C_{r-1}$이므로 (가)는 ${}_n\mathrm C_r$, (나)는 ${}_{n-1}\mathrm C_{r-1}$이다. / (ⅱ) 조합의 대칭성에 따라 ${}_n\mathrm C_r={}_n\mathrm C_{n-r}$이므로 (다)는 ${}_n\mathrm C_{n-r}$이다. / 따라서 보기에서 (가), (나), (다)는 ${}_n\mathrm C_r$, ${}_{n-1}\mathrm C_{r-1}$, ${}_n\mathrm C_{n-r}$의 순서인 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: rC(n,r)=nC(n−1,r−1)와 C(n,r)=C(n,n−r)를 실제 증명 빈칸에 적용, 가·나·다=(C(n,r),C(n−1,r−1),C(n,n−r)); ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q09 — KEEP

- **qid / ordinal / sourceIdentityKey**: 9 / 9 / `NOT_PRESENT`
- **category / answer**: 이항계수의 합 / `①` (보기: 19 | 20 | 21 | 22 | 23)
- **문제 실제 조건**: 부등식 / $$2000 < {}_n\mathrm{C}_1 + {}_n\mathrm{C}_2 + {}_n\mathrm{C}_3 + \cdots + {}_n\mathrm{C}_n < 3000$$ / 을 만족시키는 자연수 $n$의 값을 $a$, 방정식 / $${}_n\mathrm{C}_1 + {}_n\mathrm{C}_2 + {}_n\mathrm{C}_3 + \cdots + {}_n\mathrm{C}_n = 255$$ / 를 만족시키는 자연수 $n$의 값을 $b$라고 할 때, $a+b$의 값을 구하면? [4.5점]
- **기존 solution 실제 발췌**: > 이항정리에 따라 ${}_n\mathrm C_0+{}_n\mathrm C_1+\cdots+{}_n\mathrm C_n=2^n$이다. ${}_n\mathrm C_0=1$이므로 ${}_n\mathrm C_1+\cdots+{}_n\mathrm C_n=2^n-1$이다. / $2000<2^n-1<3000$에서 $2001<2^n<3001$이다. 이 사이의 2의 거듭제곱은 $2^{11}=2048$뿐이므로 $a=11$이다. / 따라서 $a+b=11+8=19$이고 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: Σ(k=1..n)C(n,k)=2^n−1, 2000..3000에서 n11, 값255에서 n8⇒합19; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q10 — KEEP

- **qid / ordinal / sourceIdentityKey**: 10 / 10 / `NOT_PRESENT`
- **category / answer**: 원순열과 이웃한 두 사람 / `③` (보기: 24 | 120 | 48 | 720 | 240)
- **문제 실제 조건**: 할머니와 할아버지를 포함한 $6$명의 가족이 원탁에 둘러앉을 때, 할머니와 할아버지가 이웃하여 앉는 경우의 수를 구하면? [3.3점]
- **기존 solution 실제 발췌**: > 할머니와 할아버지를 한 묶음으로 보면, 묶음 1개와 나머지 가족 4명, 모두 5개의 단위를 원탁에 배열한다. / 원순열이므로 배열은 $(5-1)!=4!=24$가지이다. / 따라서 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 할머니·할아버지 한 블록과 가족4명, 원탁 다섯 단위4!·블록순서2!=48; ③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q11 — KEEP

- **qid / ordinal / sourceIdentityKey**: 11 / 11 / `NOT_PRESENT`
- **category / answer**: 회전을 같은 것으로 보는 원형 색칠 / `④` (보기: 7 | 120 | 720 | 840 | 24)
- **문제 실제 조건**: 오른쪽 그림과 같이 $6$등분한 원판의 $6$개의 영역이 있다. 서로 다른 $7$가지 색 중에서 $6$가지 색을 택하여 이 $6$개의 영역을 칠하는 모든 방법의 수를 구하면? (단, 회전하여 일치하는 경우는 모두 같은 것으로 보고, 각 색은 $1$번씩만 사용한다.) [3.9점]
- **기존 solution 실제 발췌**: > 서로 다른 7가지 색 중 6가지를 고르고, 고른 6색을 6개 영역에 배치한다. 회전 전의 배열 수는 ${}_7\mathrm P_6=7!=5040$이다. / 6색이 모두 달라 0도가 아닌 회전으로 고정되는 배열은 없고, 회전한 6가지 배열은 같은 것으로 본다. / 따라서 서로 다른 방법의 수는 $5040\div6=840$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 원본 6구역 원판, 서로 다른 7색 중6색 배정 7P6, 회전6으로 나눔⇒840; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q12 — KEEP

- **qid / ordinal / sourceIdentityKey**: 12 / 12 / `NOT_PRESENT`
- **category / answer**: 정육각형 탁자에서의 원순열 / `②` (보기: 11! \times 6 | 11! \times 2 | 12! \times 6 | 12! \times 2 | 10! \times 2)
- **문제 실제 조건**: 정육각형 모양의 탁자에 $12$명이 둘러앉는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.) [4.1점]
- **기존 solution 실제 발췌**: > 12명이 서로 다른 자리 12개에 앉는 일렬 배치는 $12!$가지이다. / 정육각형 탁자를 60도씩 회전한 6가지 배치는 같은 것으로 본다. 모든 사람의 자리가 서로 다르므로 0도가 아닌 회전으로 그대로 고정되는 배치는 없다. / 따라서 서로 다른 회전 배치의 수는 $\dfrac{12!}{6}=2\cdot11!$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 원본 육각형 둘레 12자리 60° 회전 대칭6, 12!/6=2·11!; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q13 — KEEP

- **qid / ordinal / sourceIdentityKey**: 13 / 13 / `NOT_PRESENT`
- **category / answer**: 일대일함수 선택 확률 / `⑤` (보기: \frac{8}{25} | \frac{9}{25} | \frac{2}{5} | \frac{11}{25} | \frac{12}{25})
- **문제 실제 조건**: 두 집합 / $$X = \{7, 8, 9\}, \quad Y = \{a, b, c, d, e\}$$ / 에 대하여 $X$에서 $Y$로의 함수 중에서 임의로 하나를 택할 때, 그 함수가 일대일함수일 확률을 구하면? [3.4점]
- **기존 solution 실제 발췌**: > 전체 함수는 정의역의 세 원소가 각각 공역의 5개 원소 중 하나를 정하므로 $5^3=125$개이다. / 일대일함수는 첫 원소의 함숫값을 5가지, 둘째를 남은 4가지, 셋째를 남은 3가지로 정한다. 따라서 $5\times4\times3=60$개이다. / 구하는 확률은 $\dfrac{60}{125}=\dfrac{12}{25}$이고 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 공역5 정의역3 함수 전체5³, 단사함수5P3=60 ⇒60/125=12/25; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q14 — KEEP

- **qid / ordinal / sourceIdentityKey**: 14 / 14 / `NOT_PRESENT`
- **category / answer**: 동시추출의 확률 / `④` (보기: \frac{1}{2} | \frac{5}{28} | \frac{17}{28} | \frac{15}{28} | \frac{15}{18})
- **문제 실제 조건**: 흰 공 $5$개와 검은 공 $3$개가 들어 있는 주머니에서 임의로 공 $3$개를 동시에 꺼낼 때, 흰 공 $2$개와 검은 공 $1$개가 나올 확률은? [4점]
- **기존 solution 실제 발췌**: > 전체 8개 공 중 3개를 고르는 경우는 ${}_8\mathrm C_3=56$가지이다. / 흰 공 2개와 검은 공 1개를 고르는 경우는 ${}_5\mathrm C_2\cdot{}_3\mathrm C_1=10\cdot3=30$가지이다. / 따라서 구하는 확률은 $\dfrac{30}{56}=\dfrac{15}{28}$이고 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 흰5 검3 중 3개, 흰2 검1 조합 C5,2·C3,1/C8,3=30/56=15/28; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q15 — KEEP

- **qid / ordinal / sourceIdentityKey**: 15 / 15 / `NOT_PRESENT`
- **category / answer**: 부등식을 만족하는 순서쌍 개수 / `①` (보기: 196 | 198 | 188 | 184 | 182)
- **문제 실제 조건**: $6$ 이하의 자연수 $a, b, c, d, e$에 대하여 부등식 / $$a \le b+1 \le c \le d \le e$$ / 를 만족시키는 모든 순서쌍 $(a, b, c, d, e)$의 개수를 구하면? [4.7점]
- **기존 solution 실제 발췌**: > $b$를 정하면 $a$는 1부터 $b+1$까지 $b+1$가지이다. $b+1\le c$이고 $c\le6$이므로 $b$는 1부터 5까지이다. / $c$를 정했을 때 $c\le d\le e\le6$인 순서쌍 $(d,e)$의 수는 6에서 $c$까지의 수 중 중복을 허용해 2개를 고르는 수와 같으므로 ${}_{8-c}\mathrm C_2$이다. / 따라서 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 1≤a≤b+1≤c≤d≤e≤6에서 b1..5, 각 c≥b+1의 후미 (d,e) C(8−c,2), 합70+60+40+20+6=196; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q16 — KEEP

- **qid / ordinal / sourceIdentityKey**: 16 / 16 / `NOT_PRESENT`
- **category / answer**: 조건을 만족하는 정수해 개수 / `④` (보기: 58 | 59 | 60 | 61 | 62)
- **문제 실제 조건**: 다음 조건을 만족시키는 음이 아닌 정수 $a, b, c$의 모든 순서쌍 $(a, b, c)$의 개수를 구하면? [4.8점] /  / (가) $a+b+c = 12$ / (나) $(a-2)(b-2)(c-2)  / e 0$
- **기존 solution 실제 발췌**: > $a+b+c=12$의 음이 아닌 정수해는 ${}_{12+3-1}\mathrm C_{3-1}={}_{14}\mathrm C_2=91$개이다. / 이 중 $a=2$인 해는 $b+c=10$의 해 11개이다. $b=2$, $c=2$인 경우도 각각 11개이므로 우선 33개를 뺀다. / 따라서 구하는 개수는 $91-33+3=61$이고, 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 합12인 세 비음수해 C14,2=91에서 a/b/c=2 각각11씩 제외, 두 개가2인 3경우 가산⇒61; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q17 — KEEP

- **qid / ordinal / sourceIdentityKey**: 17 / 17 / `NOT_PRESENT`
- **category / answer**: 단조함수의 개수와 나눗셈 조건 / `⑤` (보기: 241 | 243 | 245 | 247 | 249)
- **문제 실제 조건**: 집합 $X = \{1, 2, 3, 4, 5, 6\}$에 대하여 함수 $f : X \to X$ 중에서 다음 조건을 만족시키는 함수 $f$의 개수를 구하면? [4.8점] /  / (가) $f(2) \times f(5)$는 $3$의 배수이다. / (나) 집합 $X$의 임의의 두 원소 $x_1, x_2$에 대하여 $x_1 < x_2$이면 $f(x_1) \le f(x_2)$이다.
- **기존 solution 실제 발췌**: > $f(1)\le\cdots\le f(6)$인 함수는 1부터 6까지에서 중복을 허용해 6개를 고르는 것과 같으므로 전체 개수는 ${}_{11}\mathrm C_6=462$이다. / $f(2)f(5)$가 3의 배수가 아닌 경우를 센다. $x=f(2)$, $y=f(5)$라 하면 $x\le y$이고, 두 값 모두 3의 배수가 아니므로 $x,y\in\{1,2,4,5\}$이다. / 따라서 조건을 만족하는 함수는 $462-213=249$개이고, 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 비감소 f1..f6 전체 C11,6=462, f2·f5 3의 배수 아닌 경우 213을 (f2,f5)∈{1,2,4,5}²로 합산, 차249; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q18 — KEEP

- **qid / ordinal / sourceIdentityKey**: 18 / 18 / `NOT_PRESENT`
- **category / answer**: 서로 인접하지 않는 선택 후 배정 / `③` (보기: 330 | 333 | 336 | 339 | 342)
- **문제 실제 조건**: 어느 수영장에 $1$번부터 $10$번까지 $10$개의 레인이 있다. $3$명의 학생이 서로 다른 레인의 번호를 각각 $1$개씩 선택할 때, $3$명의 학생이 선택한 레인의 세 번호 중 어느 두 번호도 연속되지 않도록 선택하는 경우의 수를 구하면? [4.9점]
- **기존 solution 실제 발췌**: > 선택한 레인 번호를 $i_1<i_2<i_3$라 하자. 서로 연속되지 않으므로 $i_2-i_1\ge2$, $i_3-i_2\ge2$이다. / $j_1=i_1$, $j_2=i_2-1$, $j_3=i_3-2$로 바꾸면 $1\le j_1<j_2<j_3\le8$이 된다. / 전체 경우의 수는 $56\times6=336$이고, 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 10레인 중 비연속3개 집합 C(10−3+1,3)=C8,3=56, 세 학생에 배정3!⇒336; ③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q19 — KEEP

- **qid / ordinal / sourceIdentityKey**: 19 / 19 / `NOT_PRESENT`
- **category / answer**: 동일한 물건의 분배 / `1127`
- **문제 실제 조건**: $5$명의 학생들이 같은 종류의 빵 $10$개를 나누어 가지는 방법의 수를 $A$, 적어도 하나씩 모두 가질 때의 방법의 수를 $B$라고 할 때, $A+B$의 값을 구하면? [4점]
- **기존 solution 실제 발췌**: > 각 학생이 받는 빵의 개수를 $x_1,\ldots,x_5$라 하자. / $A$에서는 받지 않는 학생이 있을 수 있으므로 $x_1+\cdots+x_5=10$의 음이 아닌 정수해를 센다. / 따라서 $A+B=1001+126=1127$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 동일 빵10개를 5명에게 비음수 분배 A=C14,4=1001, 전원 양수 B=C9,4=126 ⇒1127.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q20 — KEEP

- **qid / ordinal / sourceIdentityKey**: 20 / 20 / `NOT_PRESENT`
- **category / answer**: 판별식 조건을 이용한 확률 / `7/12`
- **문제 실제 조건**: 서로 다른 두 주사위 $\mathrm{A}, \mathrm{B}$를 동시에 던져서 나온 눈의 수를 $a, b$라 할 때, 이차방정식 $x^2 - 2ax + 3b = 0$이 실근을 가질 확률을 구하면? [4점]
- **기존 solution 실제 발췌**: > 서로 다른 두 주사위의 결과 $(a,b)$는 모두 $6\times6=36$가지로 같은 확률이다. / 이차방정식이 실근을 가질 조건은 판별식이 0 이상인 것이다. / 따라서 확률은 $\dfrac{21}{36}=\dfrac{7}{12}$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 서로 다른 주사위 a,b의 D=4(a²−3b)≥0, a1..6별 b허용수0,1,3,5,6,6 총21/36=7/12.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q21 — KEEP

- **qid / ordinal / sourceIdentityKey**: 21 / 21 / `NOT_PRESENT`
- **category / answer**: 조합확률로 구슬 수를 역산 / `(1) 7개; (2) 9개`
- **문제 실제 조건**: 주머니 A와 주머니 B에는 각각 흰 구슬과 빨간 구슬이 모두 합하여 $12$개 들어 있다. 각 주머니에서 구슬 $4$개를 동시에 꺼낸다고 하자. 다음을 구하는 과정을 서술하시오. [10점] /  / (1) 주머니 A에서 모두 흰 구슬이 나올 확률이 $\frac{7}{99}$일 때, 주머니 A 안에 들어 있는 흰 구슬의 개수를 구하시오. (5점) /  / (2) 주머니 B에서 흰 구슬 $3$개와 빨간 구슬 $1$개가 나올 확률이 $\frac{28}{55}$일 때, 주머니 B 안에 들어 있는 흰 구슬의 개수를 구하시오. (5점)
- **기존 solution 실제 발췌**: > 각 주머니에서 구슬 $4$개를 고르는 경우의 수는 $\binom{12}{4}=495$가지이다. / (1) 첫 번째 주머니의 흰 구슬 수를 $x$라 하자. 모두 흰 구슬을 고르는 경우는 $\binom{x}{4}$가지이므로 / 따라서 정답은 (1) $7$개, (2) $9$개이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 각12구슬에서4개: A 흰 x개 모두 흰 확률 Cx,4/495=7/99 ⇒Cx,4=35⇒x7. B 흰 y개 3흰1빨 C(y,3)(12−y)=252⇒y9.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q22 — KEEP

- **qid / ordinal / sourceIdentityKey**: 22 / 22 / `NOT_PRESENT`
- **category / answer**: 포함관계가 있는 부분집합 사슬 / `1048576`
- **문제 실제 조건**: 전체집합 $U = \{x \mid x\text{는 } 10 \text{ 이하의 자연수}\}$의 세 부분집합 $S_1, S_2, S_3$이 $S_1 \subset S_2 \subset S_3$을 만족시킨다. 집합 $S_1, S_2, S_3$의 모든 $(S_1, S_2, S_3)$의 개수를 구하는 과정을 서술하시오. [10점]
- **기존 solution 실제 발췌**: > 각 원소가 $S_1,S_2,S_3$에 속하는 모습으로 나누어 센다. / $S_1\subset S_2\subset S_3$이므로 한 원소는 다음 네 경우 중 하나이다. / 각 원소마다 네 선택이 있고, 전체 원소 10개가 하나씩 선택되므로 순서삼중항의 수는 $4^{10}=1048576$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 10원소의 S1⊆S2⊆S3를 원소별 네 상태(밖·S3만·S2부터·S1부터)로 할당⇒4¹⁰=1048576.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## 시험지 완료 / 인계

- 문항 22개를 문제 원문·선택지·정답·기존 solution과 대조하여 판정 완료. **KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0**.
- UPGRADE로 분류할 계산·논증 결함은 이번 시험지에서 확인하지 않았다. 새로운 해설을 임의로 만들지 않는다.
- 그림 PNG 3개·SVG 3개 시각 확인. 외부 정답지/원본 PDF 대조·Golden/Negative·회귀 및 출고는 **NOT_RUN**.
- 이 문서는 학습자 배포 파일이 아닌 심층 감사용 **AUDIT_DRAFT_COMPLETE** 기록이다. 변경 파일은 이 MD 한 개뿐이며 원본 시험지·그림·다른 lane 및 `main`은 수정하지 않는다.
