# 2019 19_매산고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사
- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2019`
- source: `archive/exams/original/high/h2/1mid/19_매산고_1학기_중간_고2_수학I.js`
- source ref / worker branch: `work/solution-upgrade-lane-30-20261121`
- source blob SHA: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/19_매산고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 20/20, `category` 누락 20/20, `questionType` 누락 0/20. 누락값은 추정·대입하지 않고 `NOT_PRESENT` 처리.
- denominator: `20` · actual question/answer/solution read: `20` · KEEP 20 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; pending upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일의 전 문항 `content`·`choices`·`answer`·`solution` 원형을 읽고 수학 계산·진수/밑·정수 끝점·선지 대응·그림 연계를 독립 대조한 MD 예약 감사. 원본 JS·SVG·PNG·정답키·`main` 변경 없음.

## 검토 기준·실물 검증 경계

- 지침: 저장소 `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 기존 lane30 예약 MD 감사의 분모와 상태 체계 유지.
- 수학: 각 원문 조건에서 별도로 지수·로그·삼각함수·실수근·교점·기하·정수 경계를 계산하고 선지/답과 비교. 원본 해설을 전부 읽되 해설 주장만으로 정답 통과시키지 않음.
- 실물 그림: 원본 PNG 5개를 내려받아 이미지 시각 판독, 해설 SVG 3개를 실제 XML로 확인하고 Inkscape 래스터 렌더하여 그림 실물 시각 판독. 이미지 파일 존재 확인만으로 표시 품질 PASS 처리하지 않음.
- 운영 `preflight`·Golden/Negative·서비스 최종 렌더·자동 릴리즈·출고 QA와 원본 변경 후 종속 검사 미실행: `QA_NOT_RUN`. 본 산출물은 결함 위치를 식별하는 감사 문서이며 출고 승인서가 아님.

## 이미지 원본 경로·Git blob 증거

- Q08 PNG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q08.png` · Git blob `7dd0b885d3d6ecc69f93e7f6d0c82d79f9eac20b` · 원본 PNG 실물 판독
- Q10 PNG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q10.png` · Git blob `74bc8607e3fd09d97880ab0dc6377604144ce244` · 원본 PNG 실물 판독
- Q13 PNG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q13.png` · Git blob `0048862f6240b0e0031ed10172ca20ee65946023` · 원본 PNG 실물 판독
- Q14 SVG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q14-solution.svg` · Git blob `82f22d10793b104d70fa84f0a69190f7b4042d0b` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q17 PNG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q17.png` · Git blob `5d0a814a7480e90176d87a7d13d897f4a7affe2b` · 원본 PNG 실물 판독
- Q18 SVG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q18-solution.svg` · Git blob `e6ce856b8ae020d718cc79108a70f81edfdce274` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q20 PNG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20.png` · Git blob `48b5c854af7a6eb279ea38f92f6f9334e31dffed` · 원본 PNG 실물 판독
- Q20 SVG: `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20-solution.svg` · Git blob `8ed1f2e7edc0914655a6d26f11a46c139b658ce0` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `3.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 식을 간단히 한 것은? [3.9점]<br><br>$$4^{\sqrt{5}+1} \div 4^{\sqrt{5}}$$
````

- **원본 `choices` (원순서):**

````text
1. 1
2. \sqrt{2}
3. 2
4. 3
5. 4
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
같은 양의 밑을 가진 거듭제곱끼리 나눌 때에는 지수끼리 뺀다.
$$\frac{4^{\sqrt5+1}}{4^{\sqrt5}}=4^{(\sqrt5+1)-\sqrt5}=4^1=4.$$
지수에 있는 $\sqrt5$가 서로 없어지고 $1$만 남으므로 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 지수 뺄셈 4^(√5+1−√5)=4, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `3.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\log 2=a$, $\log 3=b$일 때, 다음을 $a, b$에 대한 식으로 바르게 나타낸 것은? [3.9점]<br><br>$$\log 12 \times \log\dfrac{4}{3}$$
````

- **원본 `choices` (원순서):**

````text
1. a^2-b^2
2. 2a^2-b^2
3. 4a^2-b^2
4. a^2-2b^2
5. a^2-4b^2
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
상용로그의 곱셈·나눗셈 성질로 각각 $a,b$에 관한 식으로 바꾼다.
$$\log12=\log(4\cdot3)=\log 2^2+\log3=2a+b,$$
$$\log\frac43=\log4-\log3=2\log2-\log3=2a-b.$$
두 식을 곱하면 합차 공식이 적용된다.
$$(2a+b)(2a-b)=(2a)^2-b^2=4a^2-b^2.$$
따라서 ③이다.
````

- **독립 검산·선지·경계 근거:** log12=2a+b, log(4/3)=2a−b, 곱=4a²−b², ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `3.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
함수 $y=3\cdot 2^{x+1}-2$의 그래프의 점근선의 방정식으로 옳은 것은? [3.9점]
````

- **원본 `choices` (원순서):**

````text
1. y=-2
2. x=-2
3. y=0
4. x=2
5. y=2
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$2^{x+1}>0$이므로 $3\cdot2^{x+1}$도 항상 양수이다. $x$가 매우 작아질수록 $2^{x+1}$은 $0$에 가까워진다.
$$y=3\cdot2^{x+1}-2\longrightarrow -2\qquad(x\to-\infty).$$
즉 그래프가 가까워지는 수평선은 $y=-2$이다. $x=-2$와 같은 수직선이 아니므로 ①이다.
````

- **독립 검산·선지·경계 근거:** x→−∞에서 3·2^(x+1)→0, 수평점근선 y=−2, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `3.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 세 수의 대소관계로 옳은 것은? [3.9점]<br><br>$$a=\log_3 19,\; b=3\log_3(2\sqrt[3]{2}),\; c=2\log_3(3\sqrt{3})$$
````

- **원본 `choices` (원순서):**

````text
1. a<b<c
2. b<a<c
3. b<c<a
4. c<a<b
5. c<b<a
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
밑 $3>1$인 로그함수는 진수가 클수록 값이 크다. 따라서 세 수를 같은 밑의 로그 하나로 나타내어 진수를 비교한다.
$$a=\log_3 19,$$
$$b=3\log_3(2\sqrt[3]{2})=3\log_3(2^{\frac{4}{3}})=\log_3 2^4=\log_3 16,$$
$$c=2\log_3(3\sqrt3)=2\log_3(3^{\frac{3}{2}})=\log_3 3^3=\log_3 27.$$
$16<19<27$이므로 $b<a<c$이다. 따라서 ②이다.
````

- **독립 검산·선지·경계 근거:** 세 진수 19,16,27을 밑3에 대조→b<a<c, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$0 \le x < 2\pi$일 때, 방정식 $3\tan x - \sqrt{3}=0$의 모든 해의 합을 구하면? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac{\pi}{6}
2. \dfrac{2}{3}\pi
3. \pi
4. \dfrac{7}{6}\pi
5. \dfrac{4}{3}\pi
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
주어진 방정식을 정리하면
$$3\tan x-\sqrt3=0\quad\Longrightarrow\quad\tan x=\frac{\sqrt3}{3}=\tan\frac\pi6.$$
탄젠트의 주기는 $\pi$이므로 모든 해는 $x=\frac\pi6+k\pi$($k$는 정수)이다.
$0\le x<2\pi$에 들어가는 해는 $\frac\pi6$, $\frac{7\pi}6$ 두 개이다.
$$\frac\pi6+\frac{7\pi}6=\frac{8\pi}6=\frac{4\pi}3.$$
따라서 ⑤이다.
````

- **독립 검산·선지·경계 근거:** tan x=1/√3의 0~2π 해 π/6,7π/6; 합4π/3, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 중 옳지 않은 것은? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. $0$의 제곱근은 있다.
2. 세제곱근 $-64$는 $-4$이다.
3. $a<0$일 때, $(\sqrt[3]{-a})^3 = -a$이다.
4. $-8$의 세제곱근 중에서 실수인 것은 1개이다.
5. $n$이 짝수일 때, $-1$의 $n$제곱근 중에서 실수인 것은 2개이다.
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
각 선택지가 실수 범위에서 성립하는지 살핀다. $0$의 제곱근은 $0$이고, $(-4)^3=-64$이므로 $-64$의 실수 세제곱근은 $-4$이다. 또한 $a<0$이어도 $\bigl(\sqrt[3]{-a}\bigr)^3=-a$이다.
$-8$의 실수 세제곱근은 $-2$ 하나뿐이므로 ④도 옳다.
하지만 $n$이 짝수이면 모든 실수 $t$에 대하여 $t^n\ge0$이다. 따라서 $t^n=-1$을 만족하는 실수는 없다. '실수인 것이 2개'라는 ⑤가 옳지 않다.
````

- **독립 검산·선지·경계 근거:** 짝수 n에 x^n=−1의 실근은 0개, 다른 보기는 참→⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
임의의 실수 $x$에 대하여 $\log_{30}(x^2-kx-4k)$가 정의되도록 하는 모든 정수 $k$값들의 합을 구하면? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. -120
2. -110
3. -100
4. -90
5. -80
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
로그의 진수는 반드시 양수이다. 밑 $30$은 $30>0$, $30\ne1$이므로 밑에 대한 조건은 이미 만족한다. 따라서 문제는 이차식 $x^2-kx-4k$가 **모든 실수 $x$에서** $0$보다 크게 되는 정수 $k$를 찾는 것이다.
$$x^2-kx-4k>0\qquad(\text{모든 실수 }x).$$
최고차항의 계수가 $1>0$이므로 그래프는 위로 열린 포물선이다. 이 포물선이 $x$축에 닿거나 지나면 진수가 $0$ 이하인 $x$가 생긴다. 따라서 판별식이 반드시 음수여야 한다.
$$D=(-k)^2-4\cdot1\cdot(-4k)=k^2+16k=k(k+16).$$
$$D<0\iff k(k+16)<0\iff -16<k<0.$$
끝점 $k=-16,0$에서는 판별식이 $0$이어서 진수가 $0$이 되는 $x$가 있으므로 포함하지 않는다. 가능한 정수는 $-15,-14,\ldots,-1$로 $15$개이다.
$$(-15)+(-14)+\cdots+(-1)=-\frac{15(15+1)}2=-120.$$
따라서 정답은 ①이다.
````

- **독립 검산·선지·경계 근거:** 모든 실수 x에서 진수 x²−kx−4k>0→판별식 k(k+16)<0; k=−15…−1 합−120, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\log M = 3.4928$, $\log N = 2.5366$이라고 할 때, 다음 상용로그표를 이용하여 $M+N$의 값을 구하면? [4.3점]<br><br><img src="assets/images/19_매산고_1학기_중간_고2_수학I/q08.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
1. 3010
2. 3121
3. 3232
4. 3343
5. 3454
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
상용로그를 $\log M=3.4928$처럼 나타냈을 때 정수 부분 $3$은 $M$이 $10^3$ 이상 $10^4$ 미만임을 알려 주고, 소수 부분 $0.4928$은 앞자리 숫자를 찾는 데 사용한다.
$$\log M=3+0.4928\quad\Longrightarrow\quad M=10^3\times10^{0.4928}.$$
표에서 $0.4928$에 해당하는 유효숫자는 $3.11$이므로 $10^{0.4928}\approx3.11$이다. 따라서
$$M\approx3.11\times10^3=3110.$$
같은 방법으로
$$\log N=2+0.5366\quad\Longrightarrow\quad N=10^2\times10^{0.5366}.$$
표에서 $0.5366$에 해당하는 유효숫자는 $3.44$이므로
$$N\approx3.44\times10^2=344.$$
따라서 표의 근삿값으로 계산한 합은
$$M+N\approx3110+344=3454.$$
문제에서 표를 이용해 구하라고 했으므로 보기 ⑤를 고른다.
````

- **독립 검산·선지·경계 근거:** 로그표 0.4928→3.11, 0.5366→3.44, 자리수 보정 M≈3110,N≈344, 합3454, ⑤. 원본 표에서 행·열 확인.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q08.png` (PNG / blob `7dd0b885d3d6ecc69f93e7f6d0c82d79f9eac20b`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\left(\dfrac{1}{1024}\right)^{\frac{1}{n}}$이 자연수가 되도록 하는 모든 정수 $n$의 합을 구하면? [4.3점]
````

- **원본 `choices` (원순서):**

````text
1. -20
2. -18
3. -16
4. -14
5. -12
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 $1024=2^{10}$으로 바꾸어 밑을 하나로 통일한다.
$$\left(\frac1{1024}\right)^{\frac{1}{n}}=(2^{-10})^{\frac{1}{n}}=2^{-\frac{10}{n}}\qquad(n\ne0).$$
밑 $2$의 거듭제곱이 자연수가 되려면 지수 $-\frac{10}{n}$은 $0$ 이상의 정수여야 한다. 여기서는 분자가 $-10$이므로 지수가 $0$이 될 수 없다. 또한 $2$의 소인수는 $2$뿐이어서 $2$의 유리수 거듭제곱이 정수이면 그 지수는 정수여야 한다.
따라서 $-\frac{10}{n}$은 **양의 정수**이고, $n$은 음수이며 $10$의 약수의 부호를 바꾼 값이다.
$$n=-1,-2,-5,-10.$$
각각의 지수는 $10,5,2,1$이므로 원래 수는 $1024,32,4,2$로 모두 자연수이다.
$$(-1)+(-2)+(-5)+(-10)=-(1+2+5+10)=-18.$$
따라서 ②이다.
````

- **독립 검산·선지·경계 근거:** 2^(−10/n)이 자연수인 정수 n은 −1,−2,−5,−10만, 합−18, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
함수 $f(x)=a\cos(bx-c\pi)+d$의 그래프가 아래쪽 그림과 같을 때, 상수 $a, b, c, d$의 합을 구하면? (단, $a>0$, $b>0$, $0<c<1$) [4.5점]<br><br><img src="assets/images/19_매산고_1학기_중간_고2_수학I/q10.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
그래프에서 가장 높은 점의 $y$좌표는 $4$, 가장 낮은 점은 $-4$이다. 코사인 앞의 계수 $a$는 양수이므로 진폭과 중심선을 이용하면
$$a=\frac{4-(-4)}2=4,\qquad d=\frac{4+(-4)}2=0.$$
$x=\pi$와 $x=9\pi$는 **모두 아래에서 위로** $x$축을 지나는 연속된 같은 위상의 점이다. 그러므로 한 주기는
$$T=9\pi-\pi=8\pi,\qquad \frac{2\pi}{b}=8\pi,\qquad b=\frac14.$$
이제 $x=\pi$에서 함수값이 $0$이라는 사실과 그래프가 상승한다는 방향을 함께 사용한다. 코사인값이 $0$이면서 증가하는 각은 $-\frac\pi2+2k\pi$($k$는 정수)이다.
$$4\cos\left(\frac\pi4-c\pi\right)=0,$$
$$\frac\pi4-c\pi=-\frac\pi2+2k\pi,$$
$$\frac14-c=-\frac12+2k,\qquad c=\frac34-2k.$$
문제에서 $0<c<1$이라고 했으므로 $k=0$만 가능하고 $c=\frac34$이다.
따라서
$$a+b+c+d=4+\frac14+\frac34+0=5.$$
정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** 원본 그래프 최고4·최저−4→a4,d0, 상승 영점 π와9π 주기8π→b1/4, 위상 c3/4. 합5, ④.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q10.png` (PNG / blob `74bc8607e3fd09d97880ab0dc6377604144ce244`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\dfrac{\pi}{2} < \theta < \pi$일 때, 다음 중 그 값이 항상 양수인 것의 개수는? [4.5점]<br><br>$$\dfrac{1}{\cos\theta},\; \dfrac{1}{\tan\theta},\; \sin\theta - \cos\theta,\; \sin(\pi+\theta),\; \cos\left(\dfrac{3}{2}\pi+\theta\right)$$
````

- **원본 `choices` (원순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$\dfrac\pi2<\theta<\pi$이므로 동경은 제2사분면에 있다. 이 사분면에서는
$$\sin\theta>0,\qquad\cos\theta<0,\qquad\tan\theta=\frac{\sin\theta}{\cos\theta}<0.$$
다섯 식의 부호를 하나씩 판단한다.

① $\cos\theta<0$이고 $0$이 아니므로 $\dfrac1{\cos\theta}<0$이다. **양수가 아니다.**

② $\tan\theta<0$이고 $0$이 아니므로 $\dfrac1{\tan\theta}<0$이다. **양수가 아니다.**

③ $\sin\theta-\cos\theta=(\text{양수})-(\text{음수})>0$이다. **항상 양수이다.**

④ $\sin(\pi+\theta)=-\sin\theta<0$이다. **양수가 아니다.**

⑤ 덧셈정리를 쓰면
$$\cos\left(\frac{3\pi}2+\theta\right)=\cos\frac{3\pi}2\cos\theta-\sin\frac{3\pi}2\sin\theta$$
$$=0\cdot\cos\theta-(-1)\sin\theta=\sin\theta>0.$$
따라서 **항상 양수**인 것은 ③과 ⑤의 두 식이고, 개수를 묻는 문제이므로 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** 제II사분면에서 1/cos·1/tan·sin(π+θ)는 음, sin−cos와 cos(3π/2+θ)=sinθ는 양→2개, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.6`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
SS전자에서는 매년 '우주 S 시리즈' 스마트폰을 출시하고 있다. 올해는 10번째 작품으로 '우주 S10'을 출시하였다. 신형 스마트폰 '우주 S10'의 출고가는 100만원이고 이는 전작인 '우주 S9'에 비해 가격이 4% 증가한 것이다. 매년 이와 같이 출고가를 4%씩 올린다고 할 때, 처음으로 출고가 200만원 이상이 되는 제품명은 무엇인가? (단, $\log 2=0.301$, $\log 1.04=0.017$로 계산한다.) [4.6점]
````

- **원본 `choices` (원순서):**

````text
1. 우주 S25
2. 우주 S26
3. 우주 S27
4. 우주 S28
5. 우주 S29
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
우주 S10의 출고가는 $100$만 원이다. 다음 제품부터 매번 $4\%$씩 오르므로, S10 이후 $n$번 가격을 올린 제품의 가격은
$$100(1.04)^n\ \text{만 원}$$
이다. 처음 $200$만 원 이상이 되는 조건을 세우면
$$100(1.04)^n\ge200,$$
$$(1.04)^n\ge2.$$
$1.04>1$이므로 양변에 상용로그를 취해도 부등호의 방향은 바뀌지 않는다.
$$n\log1.04\ge\log2,$$
$$0.017n\ge0.301,\qquad n\ge\frac{301}{17}.$$
최소 정수 $n$을 정할 때 소수 근삿값만 보지 않고 양쪽을 비교하면
$$17\times0.017=0.289<0.301,$$
$$18\times0.017=0.306\ge0.301.$$
따라서 $n=17$번 인상으로는 부족하고 **18번** 인상해야 처음 조건을 만족한다. S10에서 18번 뒤는 S28이므로 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** 가격 (1.04)^n≥2, 제시 로그로 n≥301/17≈17.706→18회 인상, S28, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음은 지수법칙을 적용할 때 밑과 지수에 붙이는 조건이다. 밑줄 친 조건이 잘못된 것을 고르시오. [4.8점]<br><br><img src="assets/images/19_매산고_1학기_중간_고2_수학I/q13.png" class="question-img" alt="지수법칙 선택지 ①~⑤의 조건과 공식"><br><br><small>※ ①의 5)에서 분모 $b$는 $0$이 아니다.</small>
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
이 문제는 밑줄 친 조건이 각 지수법칙을 모두 성립시키는지 살피는 문제이다.
① 자연수 지수에서는 곱셈법칙이 성립한다. 나눗셈 $a^m\div a^n$에는 $a\ne0$이 필요하고, 분수 꼴 $\left(\frac ab\right)^n$에는 $b\ne0$이 필요하다. ①의 5)에서 $b\ne0$이라는 조건을 함께 적용하므로 ①은 성립한다.
② 정수 지수에서는 음의 지수가 가능하므로 밑이 $0$이 아니어야 한다. $a\ne0,\ b\ne0$이면 나열된 법칙이 성립한다.
③ 유리수 지수에는 $\frac12$처럼 짝수 제곱근을 요구하는 지수가 있다. 밑을 단순히 $a\ne0,\ b\ne0$으로만 제한하면 $a=-1$, 지수 $\frac12$도 허용되지만 $(-1)^{\frac{1}{2}}$은 실수에서 정의되지 않는다. 따라서 ③의 조건만으로는 지수법칙을 항상 적용할 수 없다.
④ 무리수 지수와 ⑤ 실수 지수에서는 밑을 $a>0,\ b>0$으로 두었으므로 각 법칙을 실수 범위에서 적용할 수 있다.
따라서 밑줄 친 조건이 잘못된 것은 ③이다.
````

- **독립 검산·선지·경계 근거:** 원본 PNG의 ③은 유리 지수의 밑을 a≠0,b≠0만 제시; 음수의 짝수근이 실수에서 정의되지 않아 ③만 조건 오류.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q13.png` (PNG / blob `0048862f6240b0e0031ed10172ca20ee65946023`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
함수 $f(x)=\log_{\frac{1}{3}}(x^2+4x+7)$에 대하여 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4.9점]<br><br><b><보기></b><br>ㄱ. 정의역은 실수 전체이다.<br>ㄴ. 함수 $f(x)$는 감소함수이다.<br>ㄷ. $f(x)$의 최댓값은 $-1$이다.
````

- **원본 `choices` (원순서):**

````text
1. ㄱ
2. ㄱ, ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
<보기>의 각 명제가 함수 전체에서 성립하는지 하나씩 확인한다.

**ㄱ. 정의역**
로그는 진수가 양수일 때만 정의된다. 완전제곱식으로 바꾸면
$$x^2+4x+7=(x+2)^2+3\ge3>0.$$
모든 실수 $x$에서 진수가 양수이므로 정의역은 실수 전체이다. **ㄱ은 참이다.**

**ㄴ. 감소함수 여부**
진수 $(x+2)^2+3$은 $x=-2$까지 감소하고 $x=-2$ 이후 증가한다. 밑이 $\frac13$인 로그는 진수가 커질수록 값이 작아진다. 따라서 $f(x)$는 $x=-2$까지는 증가하고, 그 뒤에는 감소한다. 실제로
$$f(-3)=\log_{\frac{1}{3}}4<-1=\log_{\frac{1}{3}}3=f(-2)$$
이므로 $-3<-2$인데도 함수값은 증가한다. 실수 전체에서 감소함수가 아니므로 **ㄴ은 거짓이다.**

**ㄷ. 최댓값**
밑이 $0<\frac13<1$인 로그는 진수가 작을수록 함수값이 크다. 진수의 최솟값은 $x=-2$에서 $3$이므로
$$f(x)\le\log_{\frac{1}{3}}3=-1\qquad\bigl((\tfrac13)^{-1}=3\bigr).$$
$x=-2$에서 실제로 $-1$이 되므로 최댓값은 $-1$이다. **ㄷ은 참이다.**
따라서 ㄱ, ㄷ만 옳고 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** 진수 (x+2)²+3≥3, 밑1/3 감소; ㄱ정의역 전실수·ㄷ최댓값−1 참, ㄴ전체 단조감소 거짓→③.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q14-solution.svg` (SVG / blob `82f22d10793b104d70fa84f0a69190f7b4042d0b`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `객관식` / `4.9`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\sin\theta + \cos\theta = \dfrac{1}{2}$일 때, $\sin^4\theta + \cos^4\theta$의 값은? [4.9점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac{21}{32}
2. \dfrac{23}{32}
3. \dfrac{25}{32}
4. \dfrac{27}{32}
5. \dfrac{29}{32}
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$\sin\theta$와 $\cos\theta$의 **합**이 주어졌으므로, 합을 제곱하여 두 수의 곱 $\sin\theta\cos\theta$를 먼저 구한다.
$$\left(\sin\theta+\cos\theta\right)^2=\left(\frac12\right)^2=\frac14.$$
왼쪽을 전개하고 $\sin^2\theta+\cos^2\theta=1$을 이용하면
$$\sin^2\theta+2\sin\theta\cos\theta+\cos^2\theta=\frac14,$$
$$1+2\sin\theta\cos\theta=\frac14,$$
$$2\sin\theta\cos\theta=-\frac34,$$
$$\sin\theta\cos\theta=-\frac38.$$
구하는 네제곱의 합은 제곱의 합과 곱을 이용해 바꿀 수 있다.
$$\sin^4\theta+\cos^4\theta=(\sin^2\theta+\cos^2\theta)^2-2\sin^2\theta\cos^2\theta.$$
여기에 위에서 구한 곱을 대입하면
$$=1^2-2\left(-\frac38\right)^2=1-2\cdot\frac9{64}$$
$$=\frac{64}{64}-\frac{18}{64}=\frac{46}{64}=\frac{23}{32}.$$
따라서 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** sin+cos=1/2→sin cos=−3/8; 네제곱 합1−2·9/64=23/32, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `주관식` / `4`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[단답형1] $\cos^2 0^\circ + \cos^2 1^\circ + \cdots + \cos^2 89^\circ + \cos^2 90^\circ$의 값을 구하시오. [4점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `91/2`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$0^\circ$부터 $90^\circ$까지는 양 끝을 포함하여 $91$개의 항이 있다. 여각의 코사인 관계
$$\cos(90^\circ-t)=\sin t$$
와 $\sin^2t+\cos^2t=1$을 이용하면, 두 각의 합이 $90^\circ$인 항끼리 묶을 수 있다.
$$\cos^2 0^\circ+\cos^2 90^\circ=1^2+0^2=1,$$
$$\cos^2 1^\circ+\cos^2 89^\circ=\cos^2 1^\circ+\sin^2 1^\circ=1,$$
$$\cdots$$
$$\cos^2 44^\circ+\cos^2 46^\circ=1.$$
$0^\circ$와 $90^\circ$부터 $44^\circ$와 $46^\circ$까지는 총 $45$쌍, 즉 $90$개 항이다. 가운데 $45^\circ$는 자기 자신과 짝이므로 **한 번만** 더해야 한다.
$$\cos^2 45^\circ=\left(\frac{\sqrt2}2\right)^2=\frac12.$$
따라서 전체 합은
$$45\times1+\frac12=\frac{90}2+\frac12=\frac{91}2.$$
답은 $\dfrac{91}{2}$이다.
````

- **독립 검산·선지·경계 근거:** 0°~90° 여각45쌍은 각 1, 중앙45°의 제곱코사인1/2 추가→91/2.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `주관식` / `5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[단답형2] 함수 $y=2^x$의 그래프와 기울기가 1인 직선이 두 점에서 만날 때, 만나는 두 점을 각각 $\mathrm{A}(\alpha, 2^\alpha)$, $\mathrm{B}(\beta, 2^\beta)$라 하자. $\overline{\mathrm{AB}}=3\sqrt{2}$일 때, $\alpha+\beta$의 값을 구하시오. (단, $\log 2=0.30$, $\log 3=0.48$, $\log 7=0.85$로 계산한다.) [5점]<br><br><img src="assets/images/19_매산고_1학기_중간_고2_수학I/q17.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `8/15`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
두 교점이 기울기 $1$인 같은 직선 위에 있으므로, $x$좌표가 작은 점을 $\mathrm A$, 큰 점을 $\mathrm B$로 잡아 $\beta>\alpha$라고 놓아도 된다. 직선의 기울기 공식에서
$$\frac{2^\beta-2^\alpha}{\beta-\alpha}=1,$$
$$2^\beta-2^\alpha=\beta-\alpha.$$
이 식은 두 점의 $y$좌표 차와 $x$좌표 차가 같다는 뜻이다. 거리 조건에 그대로 대입하면
$$\overline{\mathrm{AB}}=\sqrt{(\beta-\alpha)^2+(2^\beta-2^\alpha)^2}$$
$$=\sqrt{(\beta-\alpha)^2+(\beta-\alpha)^2}=\sqrt2(\beta-\alpha)=3\sqrt2.$$
$\beta>\alpha$이므로 $\beta-\alpha=3$, 즉 $\beta=\alpha+3$이다.
$$2^\beta-2^\alpha=3\quad\Longrightarrow\quad2^{\alpha+3}-2^\alpha=3,$$
$$2^\alpha(2^3-1)=3\quad\Longrightarrow\quad7\cdot2^\alpha=3,$$
$$2^\alpha=\frac37.$$
양변에 상용로그를 취하면
$$\alpha\log2=\log3-\log7,$$
$$\alpha=\frac{0.48-0.85}{0.30}=\frac{-0.37}{0.30}=-\frac{37}{30}.$$
$$\beta=\alpha+3=-\frac{37}{30}+\frac{90}{30}=\frac{53}{30}.$$
따라서
$$\alpha+\beta=-\frac{37}{30}+\frac{53}{30}=\frac{16}{30}=\frac8{15}.$$
답은 $\dfrac8{15}$이다.
````

- **독립 검산·선지·경계 근거:** 기울기1과 거리3√2로 Δx=3, 7·2^α=3; 제시 로그로 α=−37/30, β=53/30, 합8/15.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q17.png` (PNG / blob `5d0a814a7480e90176d87a7d13d897f4a7affe2b`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `주관식` / `6`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[단답형3] 두 함수 $y=|2\sin(\pi x)+1|$과 $y=[\log_2 x]$의 교점의 개수를 구하시오. [6점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `13`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$[\log_2x]$는 $\log_2x$ 이하의 최대 정수이므로 $x>0$에서 정수값만 갖는다. 한편
$$-1\le\sin\pi x\le1\quad\Longrightarrow\quad-1\le2\sin\pi x+1\le3,$$
$$0\le|2\sin\pi x+1|\le3.$$
따라서 교점에서는 $[\log_2x]$가 $0,1,2,3$ 중 하나여야 한다. $[\log_2x]=k$의 범위는
$$k\le\log_2x<k+1\quad\Longleftrightarrow\quad2^k\le x<2^{k+1}.$$
**오른쪽 끝점은 포함하지 않는다**는 점에 주의하여 네 경우를 나눈다.

**① $[\log_2x]=0$:** $1\le x<2$이고 $|2\sin\pi x+1|=0$이다.
$$2\sin\pi x+1=0\iff\sin\pi x=-\frac12.$$
$\pi x$가 $\pi$ 이상 $2\pi$ 미만인 범위에서
$$\pi x=\frac{7\pi}6,\frac{11\pi}6\quad\Longrightarrow\quad x=\frac76,\frac{11}6.$$
따라서 **2개**이다.

**② $[\log_2x]=1$:** $2\le x<4$이고 $|2\sin\pi x+1|=1$이다.
$$2\sin\pi x+1=1\quad\text{또는}\quad2\sin\pi x+1=-1,$$
$$\sin\pi x=0\quad\text{또는}\quad\sin\pi x=-1.$$
$[2,4)$에서 $\sin\pi x=0$인 정수는 $x=2,3$이고, $\sin\pi x=-1$인 해는 $x=\frac72$이다. $x=4$는 오른쪽 끝점이므로 제외한다. 따라서 **3개**이다.

**③ $[\log_2x]=2$:** $4\le x<8$이고 $|2\sin\pi x+1|=2$이다.
$$\sin\pi x=\frac12\quad\text{또는}\quad\sin\pi x=-\frac32.$$
사인값은 $-1$보다 작을 수 없으므로 뒤의 식은 불가능하다. 앞의 식의 해는 각 주기 $2$마다 두 개씩 나오므로
$$x=\frac{25}6,\frac{29}6,\frac{37}6,\frac{41}6$$
의 **4개**이다.

**④ $[\log_2x]=3$:** $8\le x<16$이고 $|2\sin\pi x+1|=3$이다.
$$\sin\pi x=1\quad\text{또는}\quad\sin\pi x=-2.$$
뒤의 식은 불가능하다. $\sin\pi x=1$은 $x=\frac12+2n$($n$은 정수)에서 성립하므로 주어진 범위의 해는
$$x=\frac{17}2,\frac{21}2,\frac{25}2,\frac{29}2$$
의 **4개**이다.

네 구간은 겹치지 않으므로 교점은
$$2+3+4+4=13$$
개이다. 답은 $13$이다.
````

- **독립 검산·선지·경계 근거:** ⌊log₂x⌋=0,1,2,3만 가능; 구간 [1,2),[2,4),[4,8),[8,16)에 근 2,3,4,4개→13. 끝점 제외 재확인.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q18-solution.svg` (SVG / blob `e6ce856b8ae020d718cc79108a70f81edfdce274`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `서술형` / `10`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[서술형1] 함수 $f(x)=2^{x-2}-2$와 그 역함수 $g(x)=f^{-1}(x)$에 대하여 $\left(\dfrac{1}{2}\right)^{f(x)} > 2^{-g(x)}$를 만족하는 정수 $x$의 개수를 구하는 과정을 서술하시오. [10점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `6`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 두 함수가 **같은 $x$에서 정의되는 범위**를 확인한다. $f(x)=2^{x-2}-2$는 모든 실수에서 정의되고, $f(x)>-2$이므로 역함수의 정의역은 $x>-2$이다.
$$g(x)=f^{-1}(x)=\log_2(x+2)+2\qquad(x>-2).$$
$\left(\frac12\right)^{f(x)}=2^{-f(x)}$이고 밑 $2>1$이므로 원래 부등식은
$$2^{-f(x)}>2^{-g(x)}\iff-f(x)>-g(x)\iff f(x)<g(x).$$
정수 $x$는 $-1,0,1,\ldots$만 가능하다.

**① $-1\le x\le4$인 정수:** $f$와 $g$는 모두 증가함수이다. 따라서
$$f(x)\le f(4)=2^{4-2}-2=4-2=2,$$
$$g(x)\ge g(-1)=\log_2 1+2=2.$$
$f(x)=2$가 되려면 $x=4$, $g(x)=2$가 되려면 $x=-1$이어야 하므로 **같은 $x$에서 두 등호가 동시에 성립하지 않는다**. 따라서 이 범위에서는 항상 $f(x)<g(x)$이고, 정수는 $-1,0,1,2,3,4$의 **6개**이다.

**② $x\ge5$인 정수:** 먼저 $x=5$를 확인한다.
$$f(5)=2^3-2=6,\qquad g(5)=2+\log_2 7<2+3=5.$$
따라서 $f(5)>g(5)$이다. 이제 정수 $x\ge5$가 $1$씩 커질 때 두 함수가 얼마나 증가하는지 비교한다.
$$f(x+1)-f(x)=2^{x-1}-2^{x-2}=2^{x-2}\ge8,$$
$$g(x+1)-g(x)=\log_2(x+3)-\log_2(x+2)=\log_2\left(1+\frac1{x+2}\right)<1.$$
즉 한 칸 증가할 때마다 $f$는 $8$ 이상 증가하지만 $g$는 $1$보다 작게 증가한다. 이미 $x=5$에서 $f>g$이므로 그 뒤에도 $f(x)>g(x)$가 유지된다. 이 범위에는 해가 없다.

따라서 조건을 만족하는 정수는 $-1,0,1,2,3,4$이고, 구하는 개수는 **6개**이다.
````

- **독립 검산·선지·경계 근거:** 역함수 정의역 x>−2, f<g를 정수에 대조하면 x=−1,0,1,2,3,4 여섯 개; x≥5는 f 증가가 g보다 빠름.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20` · questionUid: `NOT_PRESENT` · source blob: `d9a2a8dea2375930a52d0d4b15af1f070f4531ae`
- 유형/배점: `서술형` / `10`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[서술형2] 그림과 같이 원점 $\mathrm{O}$를 중심으로 하고 반지름의 길이가 1인 원 위의 점 $\mathrm{P}$가 제2사분면에 있을 때 동경 $\mathrm{OP}$가 나타내는 각의 크기를 $\theta$라고 하자. 점 $\mathrm{A}(-1, 0)$을 지나는 직선 $x=-1$과 동경 $\mathrm{OP}$가 만나는 점을 $\mathrm{B}$, 점 $\mathrm{A}$에서 동경 $\mathrm{OP}$에 수직으로 내린 수선의 발을 $\mathrm{C}$, 점 $\mathrm{C}$에서 $x$축에 수직으로 내린 수선의 발을 $\mathrm{D}$라 하자. 삼각형 $\mathrm{OCD}$의 넓이를 $S_1$, 삼각형 $\mathrm{ABC}$의 넓이를 $S_2$라고 할 때, $\theta$에 대한 삼각함수로 표현하여 $\dfrac{S_1}{S_2}$의 값을 구하는 과정을 서술하시오. [10점]<br><br><img src="assets/images/19_매산고_1학기_중간_고2_수학I/q20.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `\dfrac{\cos^4\theta}{\sin^2\theta}`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
그림의 점 $\mathrm P$가 제2사분면에 있으므로 $\frac\pi2<\theta<\pi$이다. $\alpha=\pi-\theta$라고 두면 $0<\alpha<\frac\pi2$이고, 왼쪽 방향의 $x$축과 동경 $\mathrm{OP}$가 이루는 예각이 $\alpha$이다. 따라서
$$\sin\alpha=\sin\theta,\qquad\cos\alpha=-\cos\theta.$$
점 $\mathrm C$는 $\mathrm A$에서 $\mathrm{OP}$에 내린 수선의 발이므로 $\angle\mathrm{OCA}=90^\circ$이다. 직각삼각형 $\mathrm{OAC}$에서 $\mathrm{OA}=1$을 빗변으로 보면
$$\mathrm{OC}=\mathrm{OA}\cos\alpha=\cos\alpha,$$
$$\mathrm{AC}=\mathrm{OA}\sin\alpha=\sin\alpha.$$
$\mathrm C$에서 $x$축에 내린 발이 $\mathrm D$이므로 $\triangle\mathrm{OCD}$도 직각삼각형이다. $\angle\mathrm{COD}=\alpha$에서
$$\mathrm{OD}=\mathrm{OC}\cos\alpha=\cos^2\alpha,$$
$$\mathrm{CD}=\mathrm{OC}\sin\alpha=\sin\alpha\cos\alpha.$$
따라서 $\triangle\mathrm{OCD}$의 밑변을 $\mathrm{OD}$, 높이를 $\mathrm{CD}$로 잡으면
$$S_1=\frac12\mathrm{OD}\cdot\mathrm{CD}=\frac12\cos^2\alpha\cdot\sin\alpha\cos\alpha=\frac12\sin\alpha\cos^3\alpha.$$
이제 $\triangle\mathrm{ABC}$의 넓이를 구한다. $\mathrm{AB}$는 $x=-1$ 위의 수직선분이고, $\mathrm{OA}=1$이다. 직각삼각형 $\mathrm{OAB}$에서
$$\tan\alpha=\frac{\mathrm{AB}}{\mathrm{OA}}=\mathrm{AB},\qquad\mathrm{AB}=\tan\alpha.$$
$\mathrm{AB}$를 밑변으로 잡을 때 높이는 $\mathrm C$에서 수직선 $x=-1$까지의 **수평 거리**이다. 점 $\mathrm D$의 $x$좌표는 $-\mathrm{OD}=-\cos^2\alpha$이므로 이 거리는
$$\mathrm{AD}=1-\mathrm{OD}=1-\cos^2\alpha=\sin^2\alpha.$$
따라서
$$S_2=\frac12\mathrm{AB}\cdot\mathrm{AD}=\frac12\tan\alpha\cdot\sin^2\alpha$$
$$=\frac12\frac{\sin\alpha}{\cos\alpha}\sin^2\alpha=\frac{\sin^3\alpha}{2\cos\alpha}.$$
두 넓이는 양수이고 $0<\alpha<\frac\pi2$이므로 분모가 $0$이 되지 않는다. 이제 비를 구하면
$$\frac{S_1}{S_2}=\frac{\frac12\sin\alpha\cos^3\alpha}{\frac{\sin^3\alpha}{2\cos\alpha}}$$
$$=\frac{\sin\alpha\cos^3\alpha}{1}\cdot\frac{\cos\alpha}{\sin^3\alpha}=\frac{\cos^4\alpha}{\sin^2\alpha}.$$
마지막으로 $\cos^4\alpha=(-\cos\theta)^4=\cos^4\theta$, $\sin^2\alpha=\sin^2\theta$이므로
$$\boxed{\frac{S_1}{S_2}=\frac{\cos^4\theta}{\sin^2\theta}}.$$
따라서 답은 $\dfrac{\cos^4\theta}{\sin^2\theta}$이다.
````

- **독립 검산·선지·경계 근거:** 원본 단위원 그림에서 α=π−θ, S1=(1/2)sinα cos³α, S2=(sin³α)/(2cosα); 비 cos⁴θ/sin²θ. 두 직각삼각형 배치 확인.
- **그림 실물 근거:** `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20.png` (PNG / blob `48b5c854af7a6eb279ea38f92f6f9334e31dffed`); `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20-solution.svg` (SVG / blob `8ed1f2e7edc0914655a6d26f11a46c139b658ce0`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

## 수납·잔여

- 실제 원문 문항 20/20, 해설 20/20, 답 20/20 확인. 연결 이미지 8/8를 물리적 렌더 또는 PNG 육안으로 대조.
- 분류: KEEP 20, UPGRADE 0, HOLD 0, UNREAD 0. UPGRADE는 MD에만 개선안을 적었으며 해당 원본 파일을 아직 직접 수정하지 않음.
- 보류 이유: 없음. 학생 서비스 릴리즈·Golden/Negative preflight는 별도 작업으로 `NOT_RUN`.
