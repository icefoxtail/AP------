# lane40 · 2026 순천고 2학기 중간 확통 — IN_PROGRESS

- sourcePath: `archive/exams/original/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계.js`
- sourceBlobSha (main): `bb38630fa5c1d0125382801ca343a74e90c97fee`
- sourceKey: `26_순천고_2학기_중간_고2_확률과통계`
- courseKey: probstat / standardCourse: 확률과 통계 / 원본 제목: `26_순천고_2학기_중간_고2_확률과통계` / original 2mid
- denominator **24** / 개별 심층 판정 **13** / KEEP **13**, UPGRADE **0**, HOLD **0**, UNREAD **11** (Q14–Q24)
- 상태: **IN_PROGRESS**; EXAM_AUDIT_COMPLETE=false, EXAM_DRAFT_COMPLETE=false, AUDIT_DRAFT_COMPLETE=false
- nextQid: **14**; 미완료 UPGRADE: 현재까지 없음(나머지 Q14–Q24 미판정)
- 필독: harness `fa258f6ab998c7fd0e2b398956309a43ce967e82`, queue `259bf732ac9932f832077a506c587cb1401a4f7f`, template `eb02a8ed22515b70b0d897949945e40b013eaab6`, board samples `f703929fa816fc4183f28235a355ecd3a1d6ace7`; 관련 core 본문 접근. 별도 Golden/Negative 대상 실물 교정 NOT_RUN, preflight NOT_RUN, 학생 화면 렌더 NOT_RUN.
- Q01–Q13은 이미지 필드 없음. Q14/Q16/Q20 원본 PNG, Q14/Q15/Q16/Q20/Q23 SVG는 아직 실제 판독 전으로 VISUAL_HOLD/NOT_RUN; 이들을 KEEP으로 분류하지 않음.
- 기존 같은 브랜치의 2025 제일고 2기말 MD는 IN_PROGRESS 상태로 보존, 변경 없음. 최신 사용자 버킷 우선순위에 따라 2mid부터 진행.

## 문항별 원문·해설 심층 판정

### Q01 — KEEP

- 원문 조건: 다항식 $\left(x-\frac{2}{x}\right)^5$의 전개식에서 $x$의 계수는? [3.3점]
- 보기: -80 / -40 / 10 / 40 / 80. 정답: ④. source ordinal=1, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `이항정리의 일반항에서 $x$의 지수가 $1$이 되는 항을 찾는다.` / `$\left(x-\frac2x\right)^5$의 일반항은 $\binom5k x^{5-k}\left(-\frac2x\right)^k=\binom5k(-2)^kx^{5-2k}$이다.` / `$x$의 계수이므로 $5-2k=1$, 즉 $k=2$이다.`
- 판정·독립 검산: 일반항의 지수 5−2k=1을 명시하여 k=2를 찾고 조합계수 10과 (-2)^2=4를 곱한다. k=2는 0~5 범위이며 다른 항이 x¹을 만들 수 없다. 독립 검산: k=2 항 10x³·4/x²=40x.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q02 — KEEP

- 원문 조건: 두 사건 $A$, $B$가 서로 배반사건이고 $2P(B)=P(A)$, $P(A\cup B)=\frac56$일 때, $P(A)$의 값은? [3.3점]
- 보기: $\frac5{18}$ / $\frac13$ / $\frac49$ / $\frac59$ / $\frac23$. 정답: ④. source ordinal=2, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `배반사건은 동시에 일어나지 않으므로 교집합 확률이 $0$이다.` / `$P(A\cup B)=P(A)+P(B)=\frac56$이고, $2P(B)=P(A)$이므로 $P(B)=\frac{P(A)}2$이다.` / `따라서 $\frac32P(A)=\frac56$이므로 $P(A)=\frac56\times\frac23=\frac59$이다.`
- 판정·독립 검산: 배반 조건으로 교집합 0을 명시한 뒤 P(B)=P(A)/2를 합사건 공식에 대입한다. 독립 검산: 5/9+5/18=15/18=5/6.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q03 — KEEP

- 원문 조건: 중복순열의 수 ${}_3\Pi_4$의 값을 $a$, 서로 다른 물건 3개 중에 중복을 허용하여 4개를 택하는 중복조합의 수를 $b$라고 할 때, $a+b$의 값은? [3.5점]
- 보기: 96 / 97 / 98 / 99 / 100. 정답: ①. source ordinal=3, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `중복순열은 순서가 있고, 중복조합은 순서가 없다.` / `$3$개 중 중복을 허용하여 $4$번 배열하는 수는 $a={}_3\Pi_4=3^4=81$이다.` / `중복조합은 $b={}_3H_4=\binom{3+4-1}{4}=\binom64=15$이다.`
- 판정·독립 검산: 중복순열 3⁴과 중복조합 C(6,4)를 별도로 설명한다. 독립 검산: C(6,2)=15, 81+15=96.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q04 — KEEP

- 원문 조건: 어떤 시행의 표본공간 $S$가 유한개의 근원사건으로 이루어져 있고 각 근원사건이 일어날 가능성이 모두 같을 때 $S$에 포함되는 두 사건 $A$와 $B$에 대한 설명 중 항상 옳은 것은? (단, $\varnothing$는 공집합이고 $P(A)$는 사건 $A$가 일어날 확률이고 $n(A)$는 사건 $A$의 원소의 개수이다.) [3.5점]
- 보기: $P(S)=P(\varnothing)+\frac12$이다. / $P(A)=2$인 사건 $A$가 존재한다. / $A$ 또는 $B$가 일어나는 사건은 $A\cap B$이다. / $P(A\cup B)=\frac{n(A)+n(B)}{n(S)}=P(A)+P(B)$이다. / $A\cap B=\varnothing$일 때 두 사건 $A$, $B$는 서로 배반사건이다.. 정답: ⑤. source ordinal=4, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `① $P(S)=1$, $P(\varnothing)=0$이므로 $1=\frac12$가 될 수 없다.` / `② 확률은 $0$ 이상 $1$ 이하이므로 $P(A)=2$는 불가능하다.` / `③ $A$ 또는 $B$가 일어나는 사건은 $A\cup B$이다.`
- 판정·독립 검산: ①~⑤를 각기 정의와 합사건 공식으로 검토한다. ④는 교집합 중복 계산이 문제이고 ⑤가 배반의 정의이다. 독립 검산: A=B=S일 때 ④의 우변 2, 좌변 1.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q05 — KEEP

- 원문 조건: 다음 표는 정육면체 모양의 주사위 한 개를 $n$번 던졌을 때 $1$의 눈이 나온 횟수 $r$과 상대도수 $\frac rn$을 나타낸 표이다. 주사위 한 개를 한 번 던졌을 때 $1$의 눈이 나오는 수학적 확률을 $p$라 할 때 표에 대한 설명으로 옳은 것을 보기에서 있는 대로 고른 것은? (단, 주사위의 각각의 눈이 나오는 가능성은 모두 같다.) [3.5점] <table class="question-table"><tr><th>$n$</th><td>10</td><td>100</td><td>500</td><td>1000</td><td>5000</td></tr><tr><th>$r$</th><td>1</td><td>21</td><td>78</td><td>169</td><td>834</td></tr><tr><th>$\frac rn$</th><td>0.1</td><td>0.21</td><td>$a$</td><td>0.169</td><td>0.1668</td></tr></table> <div class="question-note-box">&lt;보기&gt;<br>ㄱ. $a=0.1560$이다.<br>ㄴ. 상대도수 $\frac rn$은 $n=1000$일 때보다 $n=10$일 때 $p$에 더 가깝다.<br>ㄷ. $n$을 한없이 크게 했을 때 상대도수 $\frac rn$이 $p$에 가까워지며 $p$를 주사위에서 $1$의 눈이 나오는 사건의 통계적 확률이라 할 수 있다.</div>
- 보기: ㄱ / ㄱ, ㄴ / ㄱ, ㄷ / ㄴ, ㄷ / ㄱ, ㄴ, ㄷ. 정답: ③. source ordinal=5, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `표에서의 상대도수는 실험 결과이고, $p=\frac16$은 모든 눈이 같은 가능성인 주사위의 이론적 확률이다.` / `ㄱ. $a=\frac{78}{500}=0.1560$이므로 참이다.` / `ㄴ. $n=10$에서 오차는 $|0.1-\frac16|=\frac1{15}$, $n=1000$에서 $|0.169-\frac16|=\frac7{3000}$이다. $\frac1{15}>\frac7{3000}$이므로 거짓이다.`
- 판정·독립 검산: 표의 78/500=0.156과 1/6 대비 오차 1/15, 7/3000을 실제로 계산한다. ㄷ은 수렴 경향이지 매번 단조 접근이라는 뜻이 아님을 명시한다. 독립 검산: 0.169−1/6=7/3000.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q06 — KEEP

- 원문 조건: 어떤 시행의 표본공간 $S$의 두 사건 $A$, $B$에 대해 사건 $A$가 일어났을 때의 사건 $B$의 조건부확률이 $P(B\mid A)=\frac23$이고 $P(A)=\frac12$일 때 두 사건 $A$, $B$가 동시에 일어날 확률은? [3.7점]
- 보기: $\frac16$ / $\frac13$ / $\frac12$ / $\frac23$ / $\frac56$. 정답: ②. source ordinal=6, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `조건부확률의 정의는 $P(B\mid A)=\frac{P(A\cap B)}{P(A)}$이다.` / `$P(A)=\frac12$이므로 양변에 $P(A)$를 곱해` / `$P(A\cap B)=P(B\mid A)P(A)=\frac23\cdot\frac12=\frac13$을 얻는다.`
- 판정·독립 검산: P(A)>0인 조건부확률 정의에서 양변에 P(A)를 곱한다. 독립 검산: (1/3)/(1/2)=2/3.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q07 — KEEP

- 원문 조건: $\dfrac{{}_{12}C_1+{}_{12}C_3+{}_{12}C_5+\cdots+{}_{12}C_{11}}{{}_{10}C_0+{}_{10}C_1+{}_{10}C_2+\cdots+{}_{10}C_{10}}$의 값은? [3.7점]
- 보기: 1 / 2 / 4 / 8 / 16. 정답: ②. source ordinal=7, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `이항정리에서 $(1+1)^{12}=2^{12}$, $(1-1)^{12}=0$이다.` / `두 식을 빼면 홀수 번째 이항계수의 합의 $2$배가 남으므로` / `${}_{12}C_1+{}_{12}C_3+\cdots+{}_{12}C_{11}=2^{11}$이다.`
- 판정·독립 검산: (1+1)^12−(1−1)^12의 홀수항이 2배로 남는다는 이유를 적었다. 독립 검산: 2^11/2^10=2.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q08 — KEEP

- 원문 조건: $(1+x)^2+(1+x)^3+(1+x)^4+\cdots+(1+x)^{10}$의 전개식에서 $x^4$의 계수를 구하면? [3.7점]
- 보기: ${}_{10}C_4$ / ${}_{10}C_5$ / ${}_{11}C_6$ / ${}_{11}C_7$ / ${}_{12}C_7$. 정답: ③. source ordinal=8, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `구하려는 것은 모든 거듭제곱의 계수가 아니라, 각 전개식의 $x^4$ 계수를 모은 합이다.` / `$(1+x)^2,(1+x)^3$에는 $x^4$ 항이 없으므로 계수가 $0$이다.` / `$k\ge4$이면 $(1+x)^k$의 $x^4$ 계수는 $\binom{k}{4}$이므로 전체는 $\binom44+\binom54+\cdots+\binom{10}{4}$이다.`
- 판정·독립 검산: k=2,3에서 x⁴ 계수가 0임을 먼저 밝히고 파스칼 차분의 망원경 합으로 C(11,5)를 얻는다. 독립 검산: C(11,5)=462=C(11,6).
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q09 — KEEP

- 원문 조건: 어떤 동아리는 남학생 15명, 여학생 10명으로 구성되어 있다. 남학생 중 5명이 1학년, 나머지 10명이 2학년이고 여학생 중 3명이 1학년, 나머지 7명이 2학년이다. 이 동아리의 구성원 중 임의로 택한 1명이 남학생이라는 조건 아래에서 그 학생이 2학년일 확률은? [3.9점]
- 보기: $\frac16$ / $\frac13$ / $\frac12$ / $\frac23$ / $\frac56$. 정답: ④. source ordinal=9, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `'남학생이라고 알려진 상황'에서 표본공간은 동아리 전체 25명이 아니라 남학생 15명이다.` / `$B$: 남학생, $G$: 2학년이라 두면 남학생은 15명, 그중 2학년은 10명이다.` / `$P(G\mid B)=\frac{P(G\cap B)}{P(B)}=\frac{\frac{10}{25}}{\frac{15}{25}}=\frac{10}{15}=\frac23$이다.`
- 판정·독립 검산: 조건 '남학생'으로 표본공간을 15명으로 축소하는 이유와 P(G∩B)/P(B)를 모두 제시한다. 독립 검산: 10/15=2/3.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q10 — KEEP

- 원문 조건: $9^{11}+11^{11}$의 백의 자리의 수를 $a$, 십의 자리의 수를 $b$, 일의 자리의 수를 $c$라고 할 때, $a+b+c$의 값은? [3.9점]
- 보기: 0 / 1 / 2 / 3 / 4. 정답: ⑤. source ordinal=10, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `$9=10-1$, $11=10+1$로 놓고 이항정리를 사용한다.` / `두 식을 더하면 $(-1)$의 홀수 거듭제곱이 붙은 항끼리 소거된다.` / `따라서`
- 판정·독립 검산: 10±1의 11제곱을 더하면 짝수 k항이 상쇄되고 홀수 k항만 남는다는 구조를 제시한다. 10³ 이상의 항은 1000의 배수이다. 독립 검산: 합을 1000으로 나눈 나머지 220, 자리수 합 4.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q11 — KEEP

- 원문 조건: 네 자리의 자연수 중에서 각 자리의 수의 합이 $10$인 모든 자연수의 개수는? [4.1점]
- 보기: 219 / 230 / 240 / 250 / 260. 정답: ①. source ordinal=11, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `천의 자리는 0이 될 수 없으므로 1을 먼저 배정한 뒤 중복조합으로 센다.` / `천·백·십·일의 숫자를 각각 $a,b,c,d$라 하면 $1\le a\le9$, $0\le b,c,d\le9$, $a+b+c+d=10$이다.` / `$x=a-1$로 두면 $x+b+c+d=9$인 음이 아닌 정수해를 센다. 일단 상한을 무시하면 $\binom{12}{3}=220$개이다.`
- 판정·독립 검산: 천의 자리에서 1을 빼 x+b+c+d=9로 바꾸고 음이 아닌 해 C(12,3)에서 a=10인 단 하나를 제외한다. 독립 검산: 220−1=219.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q12 — KEEP

- 원문 조건: 여섯 개의 알파벳 $S$, $O$, $C$, $C$, $E$, $R$을 일렬로 배열할 때 $S$와 $R$이 서로 이웃할 확률은? [4.1점]
- 보기: $\frac16$ / $\frac13$ / $\frac12$ / $\frac23$ / $\frac56$. 정답: ②. source ordinal=12, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `같은 $C$ 두 개를 서로 다른 물건처럼 세면 중복되므로 $2!$로 나눈다.` / `전체 배열은 $\frac{6!}{2!}=360$개이다.` / `$S,R$이 이웃한다면 두 글자를 한 덩어리로 보고 $[SR],O,C,C,E$ 다섯 대상을 배열한다. 덩어리 안에서는 $SR,RS$의 두 순서가 가능하다.`
- 판정·독립 검산: 중복 글자 C,C에 대한 2! 나눗셈을 전체와 유리한 배열 양쪽에 적용하고 SR/RS 2배를 명시한다. 독립 검산: (2·5!/2!)/(6!/2!)=2/6=1/3.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

### Q13 — KEEP

- 원문 조건: 두 집합 $A=\{a,b\}$, $B=\{1,2,3,4,5,6,7,8,9\}$에 대하여 $A$에서 $B$로의 함수 중에서 임의로 함수 $1$개를 택할 때, 이 함수의 모든 함숫값의 곱이 $6$의 배수가 아닐 확률을 구하면? [4.3점]
- 보기: $\frac{50}{81}$ / $\frac{17}{27}$ / $\frac{52}{81}$ / $\frac{53}{81}$ / $\frac23$. 정답: ③. source ordinal=13, sourceIdentityKey=NOT_PRESENT, blob=bb38630fa5c1d0125382801ca343a74e90c97fee.
- 기존 solution 핵심 원문: `함수는 $f(a)$, $f(b)$를 각각 $1$부터 $9$ 중 하나로 정하므로 전체가 $9^2=81$가지이다.` / `곱이 $6$의 배수가 아니려면 인수 $2$가 없거나 인수 $3$이 없어야 한다.` / `$2$의 배수가 없는 함수는 각 함숫값이 홀수 $5$개 중 하나이므로 $5^2=25$가지이다.`
- 판정·독립 검산: 곱이 6의 배수가 아닌 경우를 2의 인수가 없거나 3의 인수가 없는 경우의 합집합으로 분해하고 교집합을 뺀다. 독립 검산: 5²+6²−3²=52, 전체 9²=81.
- 상태: READ_EVIDENCED / 수학적 개별 확인; Golden·Negative·학생 렌더 NOT_RUN.

## 미완료 및 재개

Q14–Q24는 **UNREAD 11문항**. 원본 파일 구조상 존재는 확인했으나 개별 조건·정답·기존 풀이에 대한 완전 판정/검산은 수행하지 않았다. 다음 실행 **Q14부터** 실제 PNG/SVG 확보 및 필요 시 렌더 후 계속한다. 시험지 전체 완료·출고 PASS 주장 금지.
