# 2019 19_매산여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사
- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2019`
- source: `archive/exams/original/high/h2/1mid/19_매산여고_1학기_중간_고2_수학I.js`
- source ref / worker branch: `work/solution-upgrade-lane-30-20261121`
- source blob SHA: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/19_매산여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 22/22, `category` 누락 22/22, `questionType` 누락 0/22. 누락값은 추정·대입하지 않고 `NOT_PRESENT` 처리.
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; pending upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일의 전 문항 `content`·`choices`·`answer`·`solution` 원형을 읽고 수학 계산·진수/밑·정수 끝점·선지 대응·그림 연계를 독립 대조한 MD 예약 감사. 원본 JS·SVG·PNG·정답키·`main` 변경 없음.

## 검토 기준·실물 검증 경계

- 지침: 저장소 `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 기존 lane30 예약 MD 감사의 분모와 상태 체계 유지.
- 수학: 각 원문 조건에서 별도로 지수·로그·삼각함수·실수근·교점·기하·정수 경계를 계산하고 선지/답과 비교. 원본 해설을 전부 읽되 해설 주장만으로 정답 통과시키지 않음.
- 실물 그림: 원본 PNG 2개를 내려받아 이미지 시각 판독, 해설 SVG 2개를 실제 XML로 확인하고 Inkscape 래스터 렌더하여 그림 실물 시각 판독. 이미지 파일 존재 확인만으로 표시 품질 PASS 처리하지 않음.
- 운영 `preflight`·Golden/Negative·서비스 최종 렌더·자동 릴리즈·출고 QA와 원본 변경 후 종속 검사 미실행: `QA_NOT_RUN`. 본 산출물은 결함 위치를 식별하는 감사 문서이며 출고 승인서가 아님.

## 이미지 원본 경로·Git blob 증거

- Q06 PNG: `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q06.png` · Git blob `b610edad988d273caf8a4aa947eb5f76f4521cf0` · 원본 PNG 실물 판독
- Q14 SVG: `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q14-solution.svg` · Git blob `12c3e5574108335970035120aa5c8ee5e4a3b890` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q16 SVG: `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q16-solution.svg` · Git blob `3fe9ce42ab9a0895dbc08ebb4c20b562ecf7508d` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q21 PNG: `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q21.png` · Git blob `4634f7181a127db4715d3b627c26807c7efb367d` · 원본 PNG 실물 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$-64$의 세제곱근 중에서 실수인 것을 구하시오. [3.5점]
````

- **원본 `choices` (원순서):**

````text
1. 8
2. 4
3. -4
4. 4i
5. -4i
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
세제곱근은 세 번 곱했을 때 $-64$가 되는 수입니다. 실수 $x$에 대하여 $x^3=-64=(-4)^3$이므로 $x=-4$입니다. 세제곱함수는 실수 범위에서 증가하므로 실수 해는 하나뿐입니다. 따라서 정답은 ③입니다.
````

- **독립 검산·선지·경계 근거:** x³=−64의 유일한 실근−4, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.7`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 설명 중 옳은 것은? [3.7점]
````

- **원본 `choices` (원순서):**

````text
1. $8$의 세제곱근은 $\sqrt[3]{8}$ 뿐이다.
2. $-27$의 세제곱근 중 실수인 것은 없다.
3. $16$의 네제곱근 중 실수인 것은 $\sqrt[4]{16}$ 뿐이다.
4. $n$이 홀수일 때, $5$의 $n$제곱근 중 실수인 것은 한 개다.
5. $n$이 짝수일 때, $-4$의 $n$제곱근 중 실수인 것은 두 개다.
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 $n$제곱근은 $x^n=a$를 만족하는 수라는 뜻입니다. 보기마다 실수 해의 개수를 구별합니다.<br>① $x^3=8$은 실수 해 $2$뿐 아니라 복소수 범위의 다른 두 해도 가지므로 ‘세제곱근이 하나뿐’이라는 말은 틀립니다.<br>② $(-3)^3=-27$이므로 $-27$의 실수 세제곱근은 $-3$입니다.<br>③ $2^4=16$이고 $(-2)^4=16$이므로 실수 네제곱근은 $2,-2$ 두 개입니다.<br>④ 홀수 $n$에 대해 $x^n$은 실수 범위에서 증가하므로 $x^n=5$의 실수 해는 $\sqrt[n]{5}$ 한 개입니다.<br>⑤ 짝수 $n$에 대해 모든 실수 $x$에서 $x^n\ge0$이므로 $x^n=-4$를 만족하는 실수는 없습니다.<br>따라서 옳은 것은 ④입니다.
````

- **독립 검산·선지·경계 근거:** 실수근 개수에서 홀수 n은 양수5에 1개, 나머지 네 진술 거짓, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.7`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
아래의 식을 만족하는 실수 $k$의 값을 구하시오. [3.7점]<br><br>$$\left(\dfrac13\right)+2^0-3^{-2}\times3=k$$
````

- **원본 `choices` (원순서):**

````text
1. 0
2. \dfrac13
3. 1
4. -\dfrac{23}{3}
5. -\dfrac{26}{3}
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$2^0=1$, $3^{-2}=\frac1{9}$입니다. 따라서 $k=\frac13+1-\frac19\times3=\frac13+1-\frac13=1$입니다. 곱셈을 먼저 계산하는 점에 주의합니다. 정답은 ③입니다.
````

- **독립 검산·선지·경계 근거:** 1/3+1−3·(1/9)=1, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
세 양수 $a,b,c$에 대하여 $a=\sqrt[6]{3}$, $b=\sqrt[5]{5}$, $c=\sqrt[3]{7}$이다. $(abc)^n$이 자연수가 되도록 하는 세 자리 자연수 $n$의 최솟값을 구하시오. [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. 112
2. 114
3. 116
4. 118
5. 120
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 세 거듭제곱근을 지수로 바꿉니다.<br>$a=3^{\frac{1}{6}},\quad b=5^{\frac{1}{5}},\quad c=7^{\frac{1}{3}}$<br>따라서 $n$제곱하면 다음과 같습니다.<br>$(abc)^n=3^{\frac{n}{6}}\times5^{\frac{n}{5}}\times7^{\frac{n}{3}}$<br>$3,5,7$은 서로 다른 소수이므로 자연수가 되려면 세 지수 $\frac{n}{6},\frac{n}{5},\frac{n}{3}$이 모두 자연수여야 합니다.<br>즉 $n$은 $6,5,3$의 공배수입니다.<br>$6=2\times3$이고 $5$는 서로소이므로 최소공배수는 $2\times3\times5=30$입니다.<br>하지만 $30$은 두 자리 수입니다. 세 자리 자연수인 공배수를 작은 것부터 확인하면<br>$30,\ 60,\ 90,\ 120,\ldots$<br>처음으로 세 자리가 되는 값은 $120$입니다. 따라서 정답은 ⑤입니다.
````

- **독립 검산·선지·경계 근거:** 3,5,7의 소수 지수가 정수이려면 n은 lcm(6,5,3)=30의 배수; 최초 세 자리120, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 식을 간단히 하려고 한다. 각 $a,b,c$에 대하여<br>$$\log_{\sqrt2}9\times\log_{\sqrt3}9\times\log_3 2=\log_{\sqrt2}9\times\log_3 2\times\log_{\sqrt3}9=a\times b\log_3 3=c$$<br>일 때, $\log_4 abc$의 값으로 알맞은 것은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 0
2. 1
3. 2
4. 3
5. 4
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
식을 앞에서부터 모두 계산하기보다, 로그의 곱에서 먼저 간단해지는 부분을 찾습니다.<br>밑변환 공식 $\log_b a=\dfrac{\log a}{\log b}$를 사용하면<br>$\log_{\sqrt2}9=\dfrac{2\log3}{(\frac{1}{2})\log2}=4\log_2 3$입니다.<br>따라서 이 항과 $\log_3 2$를 곱한 부분은<br>$\log_{\sqrt2}9\cdot\log_3 2=4\log_2 3\cdot\dfrac1{\log_2 3}=4$이므로 $a=4$입니다.<br>나머지 항도 $\log_{\sqrt3}9=\dfrac{2\log3}{(\frac{1}{2})\log3}=4$이므로 $b=4$입니다.<br>$\log_3 3=1$이어서 원래 곱의 값은 $c=a\cdot b\cdot\log_3 3=4\cdot4\cdot1=16$입니다.<br>그러므로 $abc=4\cdot4\cdot16=256=4^4$이고 $\log_4(abc)=\log_4 4^4=4$입니다. 정답은 ⑤입니다.
````

- **독립 검산·선지·경계 근거:** log_(√2)9=4log₂3, log₃2의 곱4, log_(√3)9=4; a=4,b=4,c=16, log₄256=4, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
그림은 양수 $a$에 대하여 함수 $y=(\frac{1}{a})^x$의 그래프를 그린 것이다. $a$의 값이 가장 작은 것은? [4.3점]<br><br><img src="assets/images/19_매산여고_1학기_중간_고2_수학I/q06.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
1. ①
2. ②
3. ③
4. ④
5. ⑤
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
그림의 함수는 $y=(\frac{1}{a})^x$이므로 밑을 $b=\frac{1}{a}$로 바꾸어 생각합니다. $a$가 작아질수록 그 역수인 $b$는 커집니다.<br>지수함수 $y=b^x$는 $b>1$일 때 오른쪽으로 갈수록 증가하고, $0<b<1$일 때 감소합니다. 따라서 $a$가 가장 작은 후보는 증가 곡선인 ④, ⑤ 중에 있습니다.<br>두 증가 곡선을 같은 양의 $x$에서 비교하면 ④가 ⑤보다 더 높은 곳에 있습니다. $x>0$에서는 밑 $b$가 클수록 $b^x$가 크므로 $b_{④}>b_{⑤}>1$입니다.<br>역수를 취하면 부등호가 바뀌어 $a_{④}=1/b_{④}<1/b_{⑤}=a_{⑤}$입니다. 감소 곡선들의 밑은 $b<1$이어서 $a>1$이므로 ④보다 작을 수 없습니다.<br>따라서 $a$가 가장 작은 그래프는 ④입니다.
````

- **독립 검산·선지·경계 근거:** a 최소⇔밑1/a 최대; 원본 PNG에서 증가 곡선 ④가 ⑤보다 가파르고 높아 ④.
- **그림 실물 근거:** `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q06.png` (PNG / blob `b610edad988d273caf8a4aa947eb5f76f4521cf0`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.4`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
물 $1\mathrm{ml}$당 처음 박테리아의 수를 $C_0$, 약품 투여 $t$시간 후 수를 $C$라 할 때 $\log(C/C_0)=-0.2t$이다. $C_0=4\times10^5$, $C=10520$일 때 $t$를 구하시오. (단, $\log2.63=0.42$) [4.4점]
````

- **원본 `choices` (원순서):**

````text
1. 1.9
2. 3.9
3. 5.9
4. 7.9
5. 9.9
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 $C/C_0$를 계산해 처음 수의 몇 배가 남았는지 확인합니다.<br>$\dfrac{C}{C_0}=\dfrac{10520}{4\times10^5}=\dfrac{10520}{400000}=0.0263=2.63\times10^{-2}$입니다.<br>상용로그의 곱셈 성질을 이용하면<br>$\log\dfrac{C}{C_0}=\log(2.63\times10^{-2})=\log2.63+\log10^{-2}$<br>$=0.42-2=-1.58$입니다.<br>문제의 식 $\log(C/C_0)=-0.2t$에 대입하면 $-1.58=-0.2t$이므로<br>$t=\dfrac{1.58}{0.2}=\dfrac{15.8}{2}=7.9$입니다.<br>따라서 약품 투여 후 $7.9$시간이며, 보기 ④입니다. 시간과 분으로 쓰면 $0.9\times60=54$분이므로 $7$시간 $54$분입니다.
````

- **독립 검산·선지·경계 근거:** C/C₀=0.0263, log=0.42−2=−1.58, −0.2t=−1.58→t7.9, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$100<x<1000$이고 $\log\sqrt{x}$와 $\log x^3$의 차가 정수일 때, $\log x$의 값들의 합을 구하시오. [4.5점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac{23}{5}
2. \dfrac{24}{5}
3. \dfrac{26}{5}
4. \dfrac{27}{5}
5. \dfrac{28}{5}
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
상용로그는 증가하므로 $100<x<1000$에 로그를 취하면<br>$\log100<\log x<\log1000$, 즉 $2<\log x<3$입니다.<br>두 로그의 차를 하나의 $\log x$로 바꿉니다.<br>$\log\sqrt{x}-\log x^3=\dfrac12\log x-3\log x=-\dfrac52\log x$입니다.<br>$2<\log x<3$에 음수 $-\frac{5}{2}$를 곱할 때 부등호 방향이 바뀌므로<br>$-\dfrac{15}{2}<-\dfrac52\log x<-5$입니다.<br>즉 $-7.5$보다 크고 $-5$보다 작은 정수는 $-7,-6$ 두 개뿐입니다.<br>$-\dfrac52\log x=-7$이면 $\log x=\dfrac{14}{5}$이고, $-\dfrac52\log x=-6$이면 $\log x=\dfrac{12}{5}$입니다. 두 값은 모두 $2$와 $3$ 사이이므로 조건에 맞습니다.<br>합은 $\dfrac{14}{5}+\dfrac{12}{5}=\dfrac{26}{5}$, 정답은 ③입니다.
````

- **독립 검산·선지·경계 근거:** t=logx∈(2,3), 두 로그의 차 −(5/2)t는 (−7.5,−5); 정수−7,−6→t합26/5, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
함수 $y=(\frac{1}{3})^{x-1}+1$의 점근선이 $y=k$이고, $-2\le x\le1$에서 최솟값이 $m$일 때 $k+m$을 구하시오. [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 1
2. 2
3. 3
4. 5
5. 10
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
지수함수의 기본형 $y=(\frac{1}{3})^{x-1}$은 항상 양수이고, 그래프를 위로 $1$만큼 평행이동한 것이 $y=(\frac{1}{3})^{x-1}+1$입니다.<br>따라서 수평점근선은 $y=1$이므로 $k=1$입니다.<br>밑 $\frac{1}{3}$은 $0$과 $1$ 사이이므로 $x$가 커질수록 $(\frac{1}{3})^{x-1}$은 작아집니다. 상수 $1$을 더해도 감소 성질은 변하지 않습니다.<br>그러므로 $-2\le x\le1$에서 최솟값은 가장 오른쪽인 $x=1$에서 얻습니다.<br>$m=(\frac{1}{3})^{1-1}+1=(\frac{1}{3})^0+1=1+1=2$입니다.<br>따라서 $k+m=1+2=3$이므로 정답은 ③입니다.
````

- **독립 검산·선지·경계 근거:** y=(1/3)^(x−1)+1 점근선 y=1, [−2,1] 최솟값 x1에서2, 합3, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
두 함수 $y=\log_3(9x)$, $y=\log_3(\frac{x}{3})$의 그래프와 직선 $y=k$가 만나는 점을 각각 $A,B$라 하고, 각 점을 지나는 수직선과 다른 그래프의 교점을 $C,D$라 한다. $AB=7$일 때 두 그래프와 $AC,BD$로 둘러싸인 도형의 넓이를 구하시오. [4.8점]
````

- **원본 `choices` (원순서):**

````text
1. 24
2. 21
3. 18
4. 15
5. 12
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 두 로그함수의 식을 같은 형태로 고칩니다.<br>$y_1=\log_3(9x)=\log_3x+2$<br>$y_2=\log_3(\frac{x}{3})=\log_3x-1$<br>따라서 같은 $x$에서 두 그래프의 높이 차는 항상<br>$y_1-y_2=(\log_3x+2)-(\log_3x-1)=3$입니다.<br>두 그래프와 수직선 $AC$, $BD$ 사이의 영역은 곡선으로 둘러싸여 있지만, 어느 $x$에서 잘라도 세로 길이가 정확히 $3$으로 같습니다.<br>직선 $y=k$ 위의 $A,B$는 같은 높이에 있으므로 $AB=7$은 두 수직선 사이의 가로 길이입니다.<br>따라서 가로 길이 $7$인 구간에서 높이 $3$인 띠의 넓이는<br>$S=7\times3=21$입니다.<br>구하는 넓이는 $21$이므로 정답은 ②입니다.
````

- **독립 검산·선지·경계 근거:** 같은 x에서 두 로그함수의 높이 차3, 수직 경계 사이 가로거리 AB=7→띠 넓이21, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
이차방정식 $x^2-2x\log a+\log a^2=0$이 서로 다른 두 허근을 갖게 하는 자연수 $a$의 개수를 구하시오. [4.3점]
````

- **원본 `choices` (원순서):**

````text
1. 0개
2. 8개
3. 48개
4. 98개
5. 100개
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
이 문제의 상수항은 $(\log a)^2$가 아니라 $\log(a^2)$입니다. 두 식을 구별하는 것이 중요합니다.<br>자연수 $a$는 양수이므로 상용로그의 성질에 따라<br>$\log(a^2)=2\log a$입니다.<br>$L=\log a$라고 놓으면 주어진 방정식은<br>$x^2-2Lx+2L=0$입니다.<br>이차방정식이 서로 다른 두 허근을 가지려면 판별식이 $0$보다 작아야 합니다.<br>$D=(-2L)^2-4\times1\times2L$<br>$=4L^2-8L=4L(L-2)<0$<br>곱 $L(L-2)$가 음수이므로 두 경계 $0,2$ 사이에 있어야 합니다.<br>$0<L<2$<br>$0<\log a<2$이고 상용로그는 증가하므로<br>$\log1<\log a<\log100$<br>$1<a<100$입니다.<br>이 범위의 자연수는 $2,3,\ldots,99$이고 개수는<br>$99-2+1=98$개입니다. 따라서 정답은 ④입니다.
````

- **독립 검산·선지·경계 근거:** log(a²)=2log a, 판별식 4log a(log a−2)<0→1<a<100, 자연수98개, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.8`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\theta$가 제3사분면의 각이고 $\cos\theta=-\frac{5}{13}$일 때 $\frac{1}{\sin\theta}+\frac{1}{\tan\theta}$의 값은? [3.8점]
````

- **원본 `choices` (원순서):**

````text
1. -\dfrac23
2. \dfrac13
3. -\dfrac43
4. \dfrac23
5. -\dfrac13
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
제3사분면에서는 사인과 코사인이 모두 음수입니다.<br>$\sin^2\theta+\cos^2\theta=1$, $\cos\theta=-\frac{5}{13}$이므로<br>$\sin^2\theta=1-(-\frac{5}{13})^2$<br>$=1-\frac{25}{169}=\frac{144}{169}$입니다.<br>제3사분면이라는 조건을 사용하여 음의 부호를 선택하면<br>$\sin\theta=-\frac{12}{13}$입니다.<br>이제 탄젠트를 계산합니다.<br>$\tan\theta=\dfrac{\sin\theta}{\cos\theta}=\dfrac{-\frac{12}{13}}{-\frac{5}{13}}=\frac{12}{5}$<br>문제의 식은 **두 역수의 합**이므로<br>$\dfrac1{\sin\theta}+\dfrac1{\tan\theta}$<br>$=-\frac{13}{12}+\frac{5}{12}=-\frac{8}{12}=-\frac{2}{3}$입니다.<br>따라서 정답은 ①입니다.
````

- **독립 검산·선지·경계 근거:** III사분면 sin=−12/13, tan=12/5, 역수 합−13/12+5/12=−2/3, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.6`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
다음 중 $120^\circ$의 동경이 나타내는 사분면에 위치하지 않는 각을 고르시오. [3.6점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac94\pi
2. 455^\circ
3. -\dfrac43\pi
4. \dfrac23\pi
5. -260^\circ
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$120^\circ$의 동경은 제2사분면에 있습니다. 각을 $360^\circ$의 정수배만큼 더하거나 빼도 동경의 위치는 바뀌지 않습니다.<br>① $\dfrac{9\pi}{4}\times\dfrac{180^\circ}{\pi}=405^\circ=360^\circ+45^\circ$이므로 제1사분면입니다.<br>② $455^\circ=360^\circ+95^\circ$이므로 제2사분면입니다.<br>③ $-\dfrac{4\pi}{3}\times\dfrac{180^\circ}{\pi}=-240^\circ=-360^\circ+120^\circ$이므로 제2사분면입니다.<br>④ $\dfrac{2\pi}{3}=120^\circ$이므로 제2사분면입니다.<br>⑤ $-260^\circ=-360^\circ+100^\circ$이므로 제2사분면입니다.<br>따라서 제2사분면에 있지 않은 각은 ①입니다.
````

- **독립 검산·선지·경계 근거:** 각을 mod360° 정리: ① 405°=I, ②95°·③120°·④120°·⑤100°는 II→①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.7`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
방정식 $\cos(\pi x/2)=\frac{x}{9}$의 서로 다른 실근의 개수를 구하시오. [4.7점]
````

- **원본 `choices` (원순서):**

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
교점의 개수를 세기 위해 $g(x)=\cos(\pi x/2)-\frac{x}{9}$라고 놓습니다. 원래 방정식의 실근은 $g(x)=0$이 되는 $x$입니다.<br>**① 범위와 부호를 먼저 정합니다.** $-1\le\cos(\pi x/2)\le1$이므로 $-9\le x\le9$입니다. $x<0$에서는 $\frac{x}{9}<0$이므로 코사인이 음수인 골짜기만, $x>0$에서는 코사인이 양수인 봉우리만 확인하면 됩니다. $x=0$은 $g(0)=1$이어서 해가 아닙니다.<br>**② 음수인 $x$에서의 교점:** 코사인이 음수인 구간은 $(-7,-5)$와 $(-3,-1)$입니다.<br>$g(-7)=\frac{7}{9}>0$, $g(-6)=-1+\frac{6}{9}=-\frac{1}{3}<0$, $g(-5)=\frac{5}{9}>0$이므로 첫 골짜기의 왼쪽과 오른쪽에 각각 교점이 있습니다.<br>$g(-3)=\frac{3}{9}>0$, $g(-2)=-1+\frac{2}{9}=-\frac{7}{9}<0$, $g(-1)=\frac{1}{9}>0$이므로 두 번째 골짜기도 양쪽에 각각 교점이 있습니다.<br>따라서 음수인 해는 $2+2=4$개입니다.<br>**③ 양수인 $x$에서의 교점:** 코사인이 양수인 구간은 $(0,1)$, $(3,5)$, $(7,9)$입니다.<br>$g(0)=1>0$, $g(1)=-\frac{1}{9}<0$이므로 $(0,1)$에서 $1$개입니다.<br>$g(3)=-\frac{3}{9}<0$, $g(4)=1-\frac{4}{9}=\frac{5}{9}>0$, $g(5)=-\frac{5}{9}<0$이므로 $(3,4)$와 $(4,5)$에서 각각 $1$개입니다.<br>$g(7)=-\frac{7}{9}<0$, $g(8)=1-\frac{8}{9}=\frac{1}{9}>0$, $g(9)=-1<0$이므로 $(7,8)$과 $(8,9)$에서 각각 $1$개입니다.<br>따라서 양수인 해는 $1+2+2=5$개입니다.<br>**④ 더 많은 교점이 없는 이유:** 코사인 그래프는 음수인 각 골짜기에서 아래로 볼록하고, 양수인 각 봉우리에서 위로 볼록합니다. 직선 $y=\frac{x}{9}$를 뺀 $g(x)$도 각 구간에서 같은 굽는 방향을 유지하므로 한 골짜기나 봉우리에서 $0$을 세 번 이상 지나갈 수 없습니다. 위에서 찾은 교점 외에는 추가 교점이 없습니다. 코사인과 직선의 부호가 서로 다른 나머지 구간에도 교점이 없습니다.<br>따라서 서로 다른 실근은 $4+5=9$개이고, 정답은 **②**입니다.
````

- **독립 검산·선지·경계 근거:** cos(πx/2)=x/9는 x∈[−9,9]에 국한. 음의 골짜기 2개×2, 양의 봉우리 포함 1+2+2로 총9; SVG 교점 9개 확인.
- **그림 실물 근거:** `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q14-solution.svg` (SVG / blob `12c3e5574108335970035120aa5c8ee5e4a3b890`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.4`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\dfrac{\sqrt{\cos\theta}}{\sqrt{\sin\theta}}=\sqrt{\dfrac{\cos\theta}{\sin\theta}}$, $\sin\theta\cos\theta\ne0$일 때 $-\pi\le\theta\le\pi$에서 가능한 $\theta$는? [4.4점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac\pi3
2. -\dfrac\pi3
3. \dfrac{2\pi}3
4. -\dfrac{2\pi}3
5. \pi
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 제곱근이 **실수**로 정의되는 조건부터 확인합니다.<br>분모 $\sqrt{\sin\theta}$가 $0$이 아니어야 하므로 $\sin\theta>0$입니다.<br>또한 $\sqrt{\cos\theta}$가 실수이고 $\sin\theta\cos\theta\ne0$이므로 $\cos\theta>0$입니다.<br>따라서 $\sin\theta>0$, $\cos\theta>0$을 동시에 만족하는 **제1사분면**의 각만 가능합니다.<br>이때 $\sqrt{\sin\theta}>0$이므로 제곱근의 몫을 하나로 합칠 수 있습니다.<br>$\dfrac{\sqrt{\cos\theta}}{\sqrt{\sin\theta}}=\sqrt{\dfrac{\cos\theta}{\sin\theta}}$<br>주어진 범위 $-\pi\le\theta\le\pi$에서 제1사분면인 보기는 $\theta=\pi/3$뿐입니다.<br>따라서 정답은 ①입니다.
````

- **독립 검산·선지·경계 근거:** 두 실수 제곱근의 분모·분자 조건 sinθ>0,cosθ>0→제I사분면 보기 π/3, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `3.8`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
함수 $f(x)=2\sin(2x-\pi)+1$에 대한 설명 중 옳은 것은? [3.8점]
````

- **원본 `choices` (원순서):**

````text
1. 함수 $g(x)=\tan2x$와 주기가 같다.
2. 최댓값은 2이다.
3. 최솟값은 -3이다.
4. $0\le x\le\pi/2$에서 $x$가 증가하면 $y$는 감소한다.
5. $f(0)+f(\pi)=2$
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
삼각함수의 주기와 최댓값·최솟값을 판단하기 쉽도록 먼저 식을 바꿉니다.<br>$\sin(2x-\pi)=-\sin2x$이므로 $f(x)=1-2\sin2x$입니다.<br>① $\sin2x$의 주기는 $2\pi/2=\pi$이고 $\tan2x$의 주기는 $\pi/2$입니다. 두 주기는 다릅니다.<br>②③ $-1\le\sin2x\le1$이므로 $-2\le-2\sin2x\le2$, 따라서 $-1\le f(x)\le3$입니다. 최댓값은 $3$, 최솟값은 $-1$이므로 둘 다 틀립니다.<br>④ $0\le x\le\pi/2$이면 $0\le2x\le\pi$입니다. $\sin2x$는 $x=0$부터 $\pi/4$까지 증가하고 $\pi/4$부터 $\pi/2$까지 감소하므로, $f(x)=1-2\sin2x$는 먼저 감소했다가 증가합니다. 구간 전체에서 계속 감소하지 않습니다.<br>⑤ $f(0)=1-2\sin0=1$, $f(\pi)=1-2\sin2\pi=1$이므로 $f(0)+f(\pi)=2$입니다.<br>따라서 옳은 것은 ⑤입니다.
````

- **독립 검산·선지·경계 근거:** f=1−2sin2x의 주기π, 범위[−1,3], 단조 아님, f0+fπ=2만 참→⑤.
- **그림 실물 근거:** `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q16-solution.svg` (SVG / blob `3fe9ce42ab9a0895dbc08ebb4c20b562ecf7508d`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
$\sin\theta+\cos(\pi/2+\pi/6)+\cos(\pi/2-\pi/3)=-\frac{1}{2}$를 만족하는 $0\le\theta\le2\pi$의 모든 $\theta$의 합은? [4.3점]
````

- **원본 `choices` (원순서):**

````text
1. \pi
2. \dfrac43\pi
3. 2\pi
4. \dfrac73\pi
5. 3\pi
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
주어진 식의 두 코사인값을 먼저 정확히 계산해 $\sin\theta$만 남깁니다.<br>$\cos(\pi/2+\pi/6)=\cos(2\pi/3)=-\dfrac12$이고<br>$\cos(\pi/2-\pi/3)=\cos(\pi/6)=\dfrac{\sqrt3}{2}$입니다.<br>이를 대입하면 $\sin\theta-\dfrac12+\dfrac{\sqrt3}{2}=-\dfrac12$이므로, 양변에 $\frac{1}{2}$를 더해 $\sin\theta+\dfrac{\sqrt3}{2}=0$을 얻습니다.<br>따라서 $\sin\theta=-\dfrac{\sqrt3}{2}$입니다.<br>사인값이 음수인 곳은 제3·제4사분면이고, 기준각은 $\pi/3$입니다. $0\le\theta\le2\pi$에서 가능한 각은<br>$\theta=\pi+\pi/3=4\pi/3$, $\theta=2\pi-\pi/3=5\pi/3$입니다.<br>두 각의 합은 $\dfrac{4\pi}{3}+\dfrac{5\pi}{3}=\dfrac{9\pi}{3}=3\pi$이므로 정답은 ⑤입니다.
````

- **독립 검산·선지·경계 근거:** 상수 코사인 합 (−1/2+√3/2)에서 sinθ=−√3/2; 두 각4π/3,5π/3의 합3π, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `단답형` / `5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[단답형1] $y=\log_a x$ ($a>0,a\ne1$)의 성질을 보기 번호로 골라 $\text{㉠}-\text{㉡}+\text{㉢}-\text{㉣}+\text{㉤}-\text{㉥}$을 계산하시오. [5점]<br>㉠ 정의역, ㉡ 치역, ㉢ $a>1$일 때 변화, ㉣ $0<a<1$일 때 변화, ㉤ 그래프가 지나는 점, ㉥ 점근선이 되는 축.<br>① $(0,0)$ ② $(0,1)$ ③ $(1,0)$ ④ $(1,1)$ ⑤ 실수 전체 ⑥ 양의 실수 전체 ⑦ 증가 ⑧ 감소 ⑨ $x$축 ⑩ $y$축
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `-7`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
로그함수 $y=\log_a x$의 정의역·치역·증감·지나는 점·점근선을 차례로 확인합니다.<br>**㉠ 정의역:** 로그의 진수는 $x>0$이어야 하므로 양의 실수 전체, 보기 ⑥입니다.<br>**㉡ 치역:** $x$가 양수 범위에서 변하면 로그값은 모든 실숫값을 가질 수 있으므로 보기 ⑤입니다.<br>**㉢ $a>1$일 때:** $x$가 커질수록 $y$도 커지는 증가함수이므로 보기 ⑦입니다.<br>**㉣ $0<a<1$일 때:** $x$가 커질수록 $y$가 작아지는 감소함수이므로 보기 ⑧입니다.<br>**㉤ 지나는 점:** $\log_a1=0$이므로 $(1,0)$, 보기 ③입니다.<br>**㉥ 점근선:** $x$는 $0$보다 커야 하고 그래프는 $x=0$인 $y$축에 가까워지므로 보기 ⑩입니다.<br>따라서 번호를 문제에서 정한 순서와 부호대로 계산하면<br>$6-5+7-8+3-10$<br>$=1+7-8+3-10$<br>$=8-8+3-10$<br>$=0+3-10=-7$입니다.
````

- **독립 검산·선지·경계 근거:** 로그함수 정의역 ⑥, 치역 ⑤, 증가⑦·감소⑧, 경유점③, 점근선⑩→6−5+7−8+3−10=−7.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `단답형` / `5`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[단답형2] 방정식 $-\sin^2x-\cos x=a$가 실근을 갖기 위한 실수 $a$의 범위가 $q\le a\le p$일 때 $pq$를 구하시오. [5점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `-\dfrac54`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
실근 $x$가 존재할 때 $\cos x$가 가질 수 있는 값은 $-1$부터 $1$까지입니다.<br>$t=\cos x$로 놓으면 $-1\le t\le1$이고, $\sin^2x=1-\cos^2x=1-t^2$이므로<br>$-\sin^2x-\cos x$<br>$=-(1-t^2)-t$<br>$=t^2-t-1$<br>$=(t-\frac{1}{2})^2-\frac{5}{4}$입니다.<br>**최솟값:** 제곱은 $0$ 이상이고 $t=\frac{1}{2}$는 $[-1,1]$ 안에 있으므로<br>$q=(\frac{1}{2}-\frac{1}{2})^2-\frac{5}{4}=-\frac{5}{4}$입니다.<br>**최댓값:** 위로 열린 포물선이므로 닫힌구간 양 끝의 값을 비교합니다.<br>$t=-1$이면 $(-1)^2-(-1)-1=1$<br>$t=1$이면 $1-1-1=-1$입니다.<br>따라서 $p=1$이고 실근을 갖는 $a$의 범위는<br>$-5/4\le a\le1$입니다.<br>구하는 곱은 $pq=(-\frac{5}{4})\times1=-\frac{5}{4}$입니다.
````

- **독립 검산·선지·경계 근거:** t=cos x∈[−1,1], a=t²−t−1; 최소−5/4 at t1/2, 최대1 at t−1, 곱−5/4.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `서술형` / `NOT_PRESENT`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[서술형1] (가) $\log_3(2^x-13)<5$, (나) $\log_2x+\log_2(x-2)\ge3$이다. (1) (가)의 해 (2) (나)의 해 (3) 둘 다 만족하는 정수 $x$의 합을 구하시오. [총 7점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `(1) $\log_2 13<x<8$; (2) $x\ge4$; (3) 22`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
**(1) (가)의 해:** 로그의 진수는 양수이므로 $2^x-13>0$, 즉 $2^x>13$이 먼저 필요합니다.<br>밑 $3>1$인 로그함수는 증가하므로<br>$\log_3(2^x-13)<5$는 $2^x-13<3^5=243$과 같습니다.<br>진수 조건까지 합치면 $0<2^x-13<243$이므로 $13<2^x<256=2^8$입니다.<br>밑 $2>1$인 지수함수도 증가하므로 $\log_2 13<x<8$입니다.<br>**(2) (나)의 해:** 두 로그의 진수가 모두 양수여야 하므로 $x>0$, $x-2>0$에서 $x>2$입니다.<br>이 범위에서 $\log_2x+\log_2(x-2)=\log_2[x(x-2)]$이므로<br>$\log_2[x(x-2)]\ge3=\log_2 8$입니다.<br>밑 $2>1$이므로 $x(x-2)\ge8$, 즉 $x^2-2x-8\ge0$입니다.<br>$(x-4)(x+2)\ge0$의 해는 $x\le-2$ 또는 $x\ge4$이지만, 진수 조건 $x>2$를 함께 만족하는 것은 $x\ge4$뿐입니다.<br>**(3) 공통 정수의 합:** 두 해를 겹치면 $\max(4,\log_2 13)\le x<8$입니다. $2^3=8<13<16=2^4$이므로 $3<\log_2 13<4$이고, 따라서 $4\le x<8$입니다.<br>정수 $x$는 $4,5,6,7$ 네 개이며 합은 $4+5+6+7=22$입니다.
````

- **독립 검산·선지·경계 근거:** (가) log₂13<x<8, (나) x≥4. 정수 공통해4,5,6,7 합22.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `서술형` / `NOT_PRESENT`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[서술형2] 아래 상용로그 표를 이용하여 $\log(\log54.4+\log0.54-1)$을 구하시오. [총 7점]<br><img src="assets/images/19_매산여고_1학기_중간_고2_수학I/q21.png" class="question-img"><br>(1) $\log5.44$, $\log5.4$를 읽으시오. (2) $\log54.4$, $\log0.54$를 구하시오. (3) 전체 값을 구하시오. (단, $\log4.68=0.6702$)
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `(1) 0.7356, 0.7324; (2) 1.7356, -0.2676; (3) -0.3298`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
**(1) 표에서 필요한 로그값을 읽습니다.**<br>$5.4$행에서 끝자리 $4$인 열을 찾으면 $\log5.44=0.7356$입니다.<br>같은 행에서 끝자리 $0$인 열을 찾으면 $\log5.4=0.7324$입니다.<br>**(2) $10$배·$10$분의 $1$배의 로그를 구합니다.**<br>$54.4=5.44\times10$이므로<br>$\log54.4=\log5.44+\log10$<br>$=0.7356+1=1.7356$입니다.<br>$0.54=\frac{5.4}{10}$이므로<br>$\log0.54=\log5.4-\log10$<br>$=0.7324-1=-0.2676$입니다.<br>**(3) 괄호 안을 먼저 계산합니다.**<br>$\log54.4+\log0.54-1$<br>$=1.7356-0.2676-1$<br>$=0.4680$입니다.<br>따라서 구하는 값은 $\log0.4680$입니다.<br>$0.4680=\frac{4.68}{10}$이므로<br>$\log0.4680=\log4.68-\log10$<br>$=0.6702-1=-0.3298$입니다.
````

- **독립 검산·선지·경계 근거:** 원본 상용로그표 5.44→.7356,5.40→.7324; log54.4=1.7356,log0.54=−.2676; 내부 .4680, log=.6702−1=−.3298.
- **그림 실물 근거:** `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q21.png` (PNG / blob `4634f7181a127db4715d3b627c26807c7efb367d`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22` · questionUid: `NOT_PRESENT` · source blob: `be233470eeee71ba3bbf583880d92c2069eddbd2`
- 유형/배점: `서술형` / `NOT_PRESENT`; 원본 standardCourse/category: `NOT_PRESENT` / `NOT_PRESENT`
- **원본 `content` 전체:**

````text
[서술형3] 에빙하우스의 망각 모형 $P=P_0/(t+3)^c$에서 (1) $P_0=150,c=0.48$일 때 $P\le50$이 되는 최소 정수 개월 수(단 $\log3=0.48$), (2) $P_0=80,c=0.3,t=2$일 때 $P$를 구하시오. (단 $\log2=0.30,\log3=0.48,\log4.9=0.69$) [총 6점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `(1) 7개월; (2) 49`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
**(1) 최소 정수 개월 수:** $P_0=150$, $c=0.48$을 대입하면 $P=\dfrac{150}{(t+3)^{0.48}}$입니다. 시간 $t\ge0$에서 분모는 양수입니다.<br>$P\le50$을 풀면 $\dfrac{150}{(t+3)^{0.48}}\le50$이므로 $(t+3)^{0.48}\ge3$입니다.<br>상용로그는 증가하므로 양변에 로그를 취해<br>$0.48\log(t+3)\ge\log3=0.48$을 얻습니다.<br>$0.48>0$으로 나누면 $\log(t+3)\ge1=\log10$이고, 따라서 $t+3\ge10$, $t\ge7$입니다. 최소 정수 개월 수는 $7$개월입니다.<br>**(2) 2개월 후 기억 상태:** $P_0=80$, $c=0.3$, $t=2$를 대입하면 $P=\dfrac{80}{5^{0.3}}$입니다.<br>로그를 취하면 $\log P=\log80-0.3\log5$입니다.<br>$\log80=\log(2^3\cdot10)=3\log2+1=3\cdot0.30+1=1.90$이고<br>$\log5=\log(\frac{10}{2})=1-\log2=1-0.30=0.70$입니다.<br>따라서 $\log P=1.90-0.3\cdot0.70=1.90-0.21=1.69$입니다.<br>문제에서 $\log4.9=0.69$로 계산하라 했으므로 $\log49=\log(4.9\cdot10)=1.69$입니다. 주어진 근삿값에 따라 $P\approx49$로 계산합니다. 답은 $49$입니다.
````

- **독립 검산·선지·경계 근거:** 망각식 P₀/(t+3)^c: (1) log(t+3)≥1→t≥7; (2) 제시 상용로그 근삿값으로 logP=1.69→49.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

## 수납·잔여

- 실제 원문 문항 22/22, 해설 22/22, 답 22/22 확인. 연결 이미지 4/4를 물리적 렌더 또는 PNG 육안으로 대조.
- 분류: KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0. UPGRADE는 MD에만 개선안을 적었으며 해당 원본 파일을 아직 직접 수정하지 않음.
- 보류 이유: 없음. 학생 서비스 릴리즈·Golden/Negative preflight는 별도 작업으로 `NOT_RUN`.
