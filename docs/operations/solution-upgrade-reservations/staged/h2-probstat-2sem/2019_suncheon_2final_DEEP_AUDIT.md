# 고2 확률과 통계 2학기 기말 — 19_순천고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 최종 잔여 8장 묶음 · 2026-11-22 KST. 학생용 수학 해설 감사·수정안 MD **초안**. 원본 JS·보기·정답·이미지·SVG 무수정; 운영 배포 PASS는 별도 단계.

## 0. 시험지 고정 정보

- 전용 라인: **lane40**, 고2 확률과 통계 **2학기 기말 원본**만. 타 과목/학기/유형으로 자동 전환하지 않는다.
- 원본 시험지: `19_순천고_2학기_기말_고2_확률과통계`.
- 원본 JS 경로: `archive/exams/original/high/h2/2final/19_순천고_2학기_기말_고2_확률과통계.js`.
- 원본 ref: `main`; 원본 **Git blob SHA**: `79cc9fdab86a47b87178fb74bb1748d70a1db150`.
- 총 문항 수: **21문항** (Q01~Q21). JS content·choices·answer·기존 solution **전 문항 전문 수록**.
- 인쇄 PDF sourcePdf 메타데이터: 없음. 실제 인쇄 PDF 대조 **NOT_RUN**.
- 감사 MD: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_suncheon_2final_DEEP_AUDIT.md`; 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 그림 고유 PNG: **1개**, 문항 참조 **1회**. 모두 실제 PNG 다운로드·육안 판독; `assets/images` 및 `archive/assets/images` 실제 저장소 경로 대조. 인라인 HTML 표·도형은 원문 전문에 포함.
- 기존 해설 SVG `solutionImage`: **17개** 경로 기록. 별도 렌더·Golden·Negative QA **NOT_RUN**.
- 방법: 원본 JS의 `window.questionBank` JSON 정적 추출(코드 미실행), 모든 문항 독립 수학 검산, 선택지·정답 대응, 각 PNG 원본 도형·숫자·확률표 육안 판독, 일부 정규/이항의 정확 확률·비단조방정식 수치 검산. SVG/인쇄/PDF 검수와 구별.
- 결과: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 21/21; KEEP 21; UPGRADE 0; UNREAD 0.** 수정 필요 문항 없음.
- 완료 cursor: `next_qid=NONE; UNREAD=[]`.

## 1. Q01~Q21 원문·원풀이 전문·독립 수학 검산

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `q01`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
1. 확률변수 $X$의 확률질량함수가<br>$P(X=x)={}_{100}\mathrm{C}_x \left(\frac{1}{5}\right)^x \left(\frac{4}{5}\right)^{100-x} \quad (단, x=0, 1, 2, \cdots, 100)$<br>일 때, $X$의 표준편차는? [3.0점]
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 주어진 식은 이항분포 $X\sim B(100,\frac15)$의 확률질량함수이다. 이항분포에서 $n=100$, $p=\frac15$이므로 분산은 $V(X)=np(1-p)=100\cdot\frac15\cdot\frac45=16$이다. 표준편차는 분산 자체가 아니라 분산의 양의 제곱근이므로 $\sigma(X)=\sqrt{V(X)}=\sqrt{16}=4$이다. 선택지 $1,2,3,4,5$ 중 이 값과 같은 것은 ④뿐이다. 따라서 정답은 ④이다.
- **독립 수학 검산·판정 근거:** B(100,1/5) V16, SD4 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
주어진 식은 이항분포 $X\sim B(100,\frac15)$의 확률질량함수이다.
이항분포에서 $n=100$, $p=\frac15$이므로 분산은
$V(X)=np(1-p)=100\cdot\frac15\cdot\frac45=16$이다.
표준편차는 분산 자체가 아니라 분산의 양의 제곱근이므로
$\sigma(X)=\sqrt{V(X)}=\sqrt{16}=4$이다.
선택지 $1,2,3,4,5$ 중 이 값과 같은 것은 ④뿐이다. 따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `q02`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
2. 100원짜리 동전 2개를 동시에 던져서 앞면이 나온 개수를 확률변수 $X$라고 할 때, 확률변수 $Y=2X+7$의 평균과 분산의 합은? [3.5점]
~~~

- 원본 선택지: ① $10$ / ② $11$ / ③ $12$ / ④ $13$ / ⑤ $14$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 두 동전의 앞면 개수 $X$는 이항분포 $B(2,\frac{1}{2})$를 따른다. 따라서 $E(X)=2\cdot\frac12=1$, $V(X)=2\cdot\frac12\cdot\frac12=\frac12$이다. $Y=2X+7$에 대하여 $E(Y)=2E(X)+7=9$, $V(Y)=2^2V(X)=4\cdot\frac12=2$이다. 따라서 평균과 분산의 합은 $9+2=11$이다. 정답은 ②이다.
- **독립 수학 검산·판정 근거:** B(2,1/2) X mean1,V1/2, Y=2X+7 mean9,V2, 합11 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
두 동전의 앞면 개수 $X$는 이항분포 $B(2,\frac{1}{2})$를 따른다. 따라서 $E(X)=2\cdot\frac12=1$, $V(X)=2\cdot\frac12\cdot\frac12=\frac12$이다. $Y=2X+7$에 대하여 $E(Y)=2E(X)+7=9$, $V(Y)=2^2V(X)=4\cdot\frac12=2$이다. 따라서 평균과 분산의 합은 $9+2=11$이다. 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `q03`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
3. 연속확률변수 $X$가 취하는 값의 범위가 $0 \le X \le 3$이고, 확률변수 $X$의 확률밀도함수가 $f(x)=kx$일 때, 확률 $6P(1 \le X \le 2)$의 값은? [4.0점]
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 확률밀도함수의 전체 넓이가 $1$이므로 $\int_0^3kx\,dx=k\left[\frac{x^2}{2}\right]_0^3=\frac{9k}{2}=1$이다. 따라서 $k=\frac29$이다. $P(1\le X\le2)=\int_1^2\frac29x\,dx=\frac19(2^2-1^2)=\frac13$이다. 문제에서 구하는 값은 $6P(1\le X\le2)=6\cdot\frac13=2$이므로 정답은 ②이다.
- **독립 수학 검산·판정 근거:** f(x)=kx(0≤x≤3), k2/9, ∫1..2 f=1/3→6P=2 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q3-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
확률밀도함수의 전체 넓이가 $1$이므로 $\int_0^3kx\,dx=k\left[\frac{x^2}{2}\right]_0^3=\frac{9k}{2}=1$이다. 따라서 $k=\frac29$이다. $P(1\le X\le2)=\int_1^2\frac29x\,dx=\frac19(2^2-1^2)=\frac13$이다. 문제에서 구하는 값은 $6P(1\le X\le2)=6\cdot\frac13=2$이므로 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `q04`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
4. 이산확률변수 $X$의 확률질량함수가<br>$P(X=x) = \frac{2a}{x(x+2)} \quad (x=1, 3, 5, 7, 9)$<br>일 때, 상수 $a$의 값은 $\frac{q}{p}$이다. $p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [4.5점]
~~~

- 원본 선택지: ① $17$ / ② $18$ / ③ $19$ / ④ $20$ / ⑤ $21$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 확률질량함수의 확률 합은 $1$이다. $\frac{2a}{x(x+2)}=a\left(\frac1x-\frac1{x+2}\right)$로 분해하면 $x=1,3,5,7,9$에 대한 합은 중간 항이 소거되어 $a\left(1-\frac1{11}\right)=\frac{10a}{11}=1$이다. 따라서 $a=\frac{11}{10}$이고 서로소인 자연수 $p=10,q=11$이므로 $p+q=21$이다. 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** PMF 2a/[x(x+2)]는 망원합 a(1−1/11)=1, a11/10, p+q21 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
확률질량함수의 확률 합은 $1$이다. $\frac{2a}{x(x+2)}=a\left(\frac1x-\frac1{x+2}\right)$로 분해하면 $x=1,3,5,7,9$에 대한 합은 중간 항이 소거되어 $a\left(1-\frac1{11}\right)=\frac{10a}{11}=1$이다. 따라서 $a=\frac{11}{10}$이고 서로소인 자연수 $p=10,q=11$이므로 $p+q=21$이다. 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `q05`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
5. 확률변수 $X$가 가질 수 있는 값이 $1, 2, 4, 8$이고<br>$P(X=2x)=2P(X=x) \quad (단, x=1, 2, 4)$일 때, $E(X)=\frac{q}{p}$이다.<br>$p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [4.5점]
~~~

- 원본 선택지: ① $17$ / ② $18$ / ③ $19$ / ④ $20$ / ⑤ $21$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > $P(X=1)=t$라 두면 주어진 관계에 따라 $P(X=2)=2t$, $P(X=4)=4t$, $P(X=8)=8t$이다. 확률 합은 $(1+2+4+8)t=15t=1$이므로 $t=\frac{1}{15}$이다. 기댓값은 $E(X)=1\cdot\frac1{15}+2\cdot\frac2{15}+4\cdot\frac4{15}+8\cdot\frac8{15}=\frac{1+4+16+64}{15}=\frac{85}{15}=\frac{17}{3}$이다. 따라서 $p=3,q=17$, $p+q=20$으로 정답은 ④이다.
- **독립 수학 검산·판정 근거:** P1..8 비1:2:4:8, E(X)=85/15=17/3, 합20 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q5-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
$P(X=1)=t$라 두면 주어진 관계에 따라 $P(X=2)=2t$, $P(X=4)=4t$, $P(X=8)=8t$이다. 확률 합은 $(1+2+4+8)t=15t=1$이므로 $t=\frac{1}{15}$이다. 기댓값은 $E(X)=1\cdot\frac1{15}+2\cdot\frac2{15}+4\cdot\frac4{15}+8\cdot\frac8{15}=\frac{1+4+16+64}{15}=\frac{85}{15}=\frac{17}{3}$이다. 따라서 $p=3,q=17$, $p+q=20$으로 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `q06`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
6. 확률변수 $X$의 확률밀도함수가<br>$f(x) = \begin{cases} k(2+x) & (-2 \le x < 0) \\ k(2-x) & (0 \le x < 2) \\ 0 & (x < -2 \text{ 또는 } x \ge 2) \end{cases}$<br>이다. $P\left(-1 \le X \le \frac{1}{2}\right)$의 값을 $\frac{q}{p}$라 할 때, $p+q$의 값은?<br>(단, $p$와 $q$는 서로소인 자연수이다.) [5.0점]
~~~

- 원본 선택지: ① $51$ / ② $52$ / ③ $53$ / ④ $54$ / ⑤ $55$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 밀도함수의 그래프는 $(-2,0)$에서 $(0,2k)$까지 올라갔다가 $(2,0)$으로 내려오는 삼각형이다. 넓이 $\frac12\cdot4\cdot2k=4k=1$에서 $k=\frac14$이다. 구간 $[-1,0]$의 확률은 $\int_{-1}^0\frac{2+x}{4}\,dx=\left[\frac x2+\frac{x^2}{8}\right]_{-1}^0=\frac38$이다. 구간 $[0,\frac{1}{2}]$는 $\int_0^{\frac{1}{2}}\frac{2-x}{4}\,dx=\left[\frac x2-\frac{x^2}{8}\right]_0^{\frac{1}{2}}=\frac7{32}$이다. 따라서 전체 확률은 $\frac38+\frac7{32}=\frac{19}{32}$, $p+q=32+19=51$
- **독립 수학 검산·판정 근거:** 좌우 선형 밀도에서 k1/4, [−1,1/2] 면적3/8+7/32=19/32, 합51 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q6-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
밀도함수의 그래프는 $(-2,0)$에서 $(0,2k)$까지 올라갔다가 $(2,0)$으로 내려오는 삼각형이다. 넓이 $\frac12\cdot4\cdot2k=4k=1$에서 $k=\frac14$이다. 구간 $[-1,0]$의 확률은 $\int_{-1}^0\frac{2+x}{4}\,dx=\left[\frac x2+\frac{x^2}{8}\right]_{-1}^0=\frac38$이다. 구간 $[0,\frac{1}{2}]$는 $\int_0^{\frac{1}{2}}\frac{2-x}{4}\,dx=\left[\frac x2-\frac{x^2}{8}\right]_0^{\frac{1}{2}}=\frac7{32}$이다. 따라서 전체 확률은 $\frac38+\frac7{32}=\frac{19}{32}$, $p+q=32+19=51$이다. 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `q07`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
7. 양의 실수 $a, b$에 대하여 연속확률변수 $X$가 취하는 값의 범위는 $-a \le X \le 2$이고, 확률변수 $X$의 확률밀도함수가<br>$f(x) = \begin{cases} \frac{b}{a}(x+a) & (-a \le x \le 0) \\ b - \frac{1}{8}x & (0 \le x \le 2) \end{cases}$<br>이다. $P(0 \le X \le 2) = 2P(-a \le X \le 0)$일 때, $b$의 값은 $\frac{q}{p}$이다.<br>$p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [5.5점]
~~~

- 원본 선택지: ① $33$ / ② $34$ / ③ $35$ / ④ $36$ / ⑤ $37$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 확률밀도함수 아래의 전체 넓이는 $1$이다. 주어진 비율에서 오른쪽 구간의 확률은 왼쪽의 $2$배이므로 $P(-a\le X\le0)=\frac13$, $P(0\le X\le2)=\frac23$이다. 오른쪽 밀도 $b-\frac{x}{8}$을 적분하면 $\int_0^2\left(b-\frac{x}{8}\right)dx=\left[bx-\frac{x^2}{16}\right]_0^2=2b-\frac14=\frac23$이다. $2b=\frac{11}{12}$이므로 $b=\frac{11}{24}$이고 $p+q=24+11=35$이다. 또한 왼쪽 구간은 밑변 $a$, 높이 $b$인 삼각형이므로 $\frac{ab}{2}=\frac13$, 즉 $a=\frac{2}{3b}=\frac{16}{11}>0$이다. 오른쪽 끝에서도 
- **독립 수학 검산·판정 근거:** 좌밀도 삼각·우밀도 선형 넓이 1/3:2/3, b11/24,a16/11, 합35 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q7-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
확률밀도함수 아래의 전체 넓이는 $1$이다. 주어진 비율에서 오른쪽 구간의 확률은 왼쪽의 $2$배이므로
$P(-a\le X\le0)=\frac13$, $P(0\le X\le2)=\frac23$이다.
오른쪽 밀도 $b-\frac{x}{8}$을 적분하면
$\int_0^2\left(b-\frac{x}{8}\right)dx=\left[bx-\frac{x^2}{16}\right]_0^2=2b-\frac14=\frac23$이다.
$2b=\frac{11}{12}$이므로 $b=\frac{11}{24}$이고 $p+q=24+11=35$이다.
또한 왼쪽 구간은 밑변 $a$, 높이 $b$인 삼각형이므로 $\frac{ab}{2}=\frac13$, 즉 $a=\frac{2}{3b}=\frac{16}{11}>0$이다.
오른쪽 끝에서도 $f(2)=b-\frac14=\frac5{24}>0$이므로 양의 밀도 조건과 모순되지 않는다. 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `q08`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
8. 확률변수 $X$가 정규분포 $N(50, 4^2)$을 따를 때, 확률 $P(54 \le X \le 62)$을 오른쪽 표준정규분포표를 이용하여 구하면? [3.0점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>3.0</td><td>0.4987</td></tr></table>
~~~

- 원본 선택지: ① $0.1574$ / ② $0.1587$ / ③ $0.6247$ / ④ $0.8185$ / ⑤ $0.8400$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > $X\sim N(50,4^2)$이므로 $Z=\frac{X-50}{4}$로 표준화한다. $X=54$일 때 $Z=1$, $X=62$일 때 $Z=3$이다. 따라서 $P(54\le X\le62)=P(1\le Z\le3)=P(0\le Z\le3)-P(0\le Z\le1)=0.4987-0.3413=0.1574$이다. 정답은 ①이다.
- **독립 수학 검산·판정 근거:** N(50,4²) z1~3의 면적 .4987−.3413=.1574 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q8-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
$X\sim N(50,4^2)$이므로 $Z=\frac{X-50}{4}$로 표준화한다. $X=54$일 때 $Z=1$, $X=62$일 때 $Z=3$이다. 따라서 $P(54\le X\le62)=P(1\le Z\le3)=P(0\le Z\le3)-P(0\le Z\le1)=0.4987-0.3413=0.1574$이다. 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `q09`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
9. 정규분포를 따르는 모집단에서 크기가 25인 표본을 임의추출하여 구한 표본평균 $\overline{X}$의 평균이 $E(\overline{X})=4$, 분산이 $V(\overline{X})=4$일 때, $E(X)+\sigma(X)$의 값은? [3.5점]
~~~

- 원본 선택지: ① $6$ / ② $8$ / ③ $10$ / ④ $12$ / ⑤ $14$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 표본평균의 평균은 모집단의 평균과 같으므로 $E(X)=E(\overline X)=4$이다. 표본평균의 분산은 $V(\overline X)=V(X)/n$이므로 $4=V(X)/25$, $V(X)=100$이다. 모집단의 표준편차는 $\sigma(X)=\sqrt{100}=10$이므로 $E(X)+\sigma(X)=4+10=14$이다. 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** n25, 표본분산4→모분산100; E(X)+SD=4+10=14 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q9-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균의 평균은 모집단의 평균과 같으므로 $E(X)=E(\overline X)=4$이다. 표본평균의 분산은 $V(\overline X)=V(X)/n$이므로 $4=V(X)/25$, $V(X)=100$이다. 모집단의 표준편차는 $\sigma(X)=\sqrt{100}=10$이므로 $E(X)+\sigma(X)=4+10=14$이다. 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `q10`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
10. 다음 대화를 읽고 물음에 답하시오.<br><br>손님 : 계산대의 줄이 너무 긴 것 같아요. 계산대 대기 시간이 너무 길면 고객들의 불만이 생길 텐데요.<br>점원 : 네. 서비스 개선을 위해 고객 100명을 임의추출하여 계산대 대기 시간을 조사하였더니 평균이 6분, 표준편차가 3분인 정규분포를 따른다고 조사되었습니다.<br><br>슈퍼마켓 계산대의 평균 대기 시간 $m$에 대한 신뢰도 95%의 신뢰구간을 구하면? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \le 1.96) = 0.95$로 계산한다.) [3.5점]
~~~

- 원본 선택지: ① $5.902 \le m \le 6.098$ / ② $5.647 \le m \le 6.353$ / ③ $5.582 \le m \le 6.418$ / ④ $5.412 \le m \le 6.588$ / ⑤ $5.246 \le m \le 6.754$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 표본평균은 $\overline x=6$, 표준편차는 $\sigma=3$, 표본크기는 $n=100$이다. 모평균의 $95\%$ 신뢰구간은 $\overline x\pm1.96\frac{\sigma}{\sqrt n}$이다. 오차한계는 $1.96\cdot\frac3{10}=0.588$이므로 $6-0.588\le m\le6+0.588$, 즉 $5.412\le m\le6.588$이다. 다른 보기는 같은 신뢰도와 표본크기의 오차한계가 아니므로 정답은 ④이다.
- **독립 수학 검산·판정 근거:** 표본n100 평균6, 표준편차3, 95% CI 6±.588=[5.412,6.588] 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q10-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균은 $\overline x=6$, 표준편차는 $\sigma=3$, 표본크기는 $n=100$이다. 모평균의 $95\%$ 신뢰구간은 $\overline x\pm1.96\frac{\sigma}{\sqrt n}$이다. 오차한계는 $1.96\cdot\frac3{10}=0.588$이므로 $6-0.588\le m\le6+0.588$, 즉 $5.412\le m\le6.588$이다. 다른 보기는 같은 신뢰도와 표본크기의 오차한계가 아니므로 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `q11`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
11. 남승룡 마라톤 대회에 참가한 순천고등학교 학생들의 달리기 기록은 표준편차가 300초인 정규분포를 따른다고 한다. 이 대회에 참가한 순천고등학교 학생 전체의 달리기 기록의 평균을 신뢰도 99%로 추정할 때, 모평균과 표본평균의 차가 43초 이하가 되도록 하는 표본의 크기 $n$의 최솟값을 구하면? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \le 2.58) = 0.99$로 계산한다.) [4.0점]
~~~

- 원본 선택지: ① $289$ / ② $324$ / ③ $361$ / ④ $400$ / ⑤ $441$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 모평균과 표본평균의 차가 $43$초 이하가 되게 하려면 $99\%$ 신뢰구간의 오차한계가 $43$ 이하여야 한다. 따라서 $2.58\frac{300}{\sqrt n}\le43$이다. 양변에 $\sqrt n$을 곱하면 $774\le43\sqrt n$, 즉 $\sqrt n\ge18$이다. 따라서 $n\ge324$이고 자연수 $n$의 최솟값은 $324$이다. 정답은 ②이다.
- **독립 수학 검산·판정 근거:** 99% 오차한계2.58·300/√n≤43→n324 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
모평균과 표본평균의 차가 $43$초 이하가 되게 하려면 $99\%$ 신뢰구간의 오차한계가 $43$ 이하여야 한다. 따라서 $2.58\frac{300}{\sqrt n}\le43$이다. 양변에 $\sqrt n$을 곱하면 $774\le43\sqrt n$, 즉 $\sqrt n\ge18$이다. 따라서 $n\ge324$이고 자연수 $n$의 최솟값은 $324$이다. 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `q12`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
12. 서로 다른 두 개의 주사위를 동시에 450번 던질 때, 두 주사위의 눈의 수의 차가 2 이하인 사건의 횟수를 확률변수 $X$라고 하자. 확률 $P(X \ge 280)$을 오른쪽 표준정규분포표를 이용하여 구하면? [4.5점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></table>
~~~

- 원본 선택지: ① $0.0228$ / ② $0.0668$ / ③ $0.8185$ / ④ $0.9544$ / ⑤ $0.9772$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 먼저 한 번 던졌을 때의 사건 확률을 구한다. 두 주사위의 눈은 순서가 구별되므로 가능한 순서쌍은 $36$개이다. 눈의 차가 $0$인 경우 $6$개, $1$인 경우 $2\cdot5=10$개, $2$인 경우 $2\cdot4=8$개로 총 $24$개이다. 따라서 성공 확률은 $p=\frac{24}{36}=\frac23$이다. 독립적으로 $450$번 시행하면 $X\sim B(450,\frac23)$이다. $E(X)=450\cdot\frac23=300$, $V(X)=450\cdot\frac23\cdot\frac13=100$, $\sigma(X)=10$이다. 시행 횟수가 충분히 크므로 이항분포를 평균 $300$, 표준편차 $10$인 정규분포로 근사한다. $P(X\ge280)\approx P\left(Z\ge\frac{
- **독립 수학 검산·판정 근거:** 차≤2인 두 주사위 순서쌍24/36, B(450,2/3) μ300 SD10, ≥280 무보정 .9772 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q12-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
먼저 한 번 던졌을 때의 사건 확률을 구한다. 두 주사위의 눈은 순서가 구별되므로 가능한 순서쌍은 $36$개이다.
눈의 차가 $0$인 경우 $6$개, $1$인 경우 $2\cdot5=10$개, $2$인 경우 $2\cdot4=8$개로 총 $24$개이다.
따라서 성공 확률은 $p=\frac{24}{36}=\frac23$이다. 독립적으로 $450$번 시행하면 $X\sim B(450,\frac23)$이다.
$E(X)=450\cdot\frac23=300$, $V(X)=450\cdot\frac23\cdot\frac13=100$, $\sigma(X)=10$이다.
시행 횟수가 충분히 크므로 이항분포를 평균 $300$, 표준편차 $10$인 정규분포로 근사한다.
$P(X\ge280)\approx P\left(Z\ge\frac{280-300}{10}\right)=P(Z\ge-2)$
$=0.5+P(0\le Z\le2)=0.5+0.4772=0.9772$이다.
이 시험지의 표·선택지는 연속성 보정 없이 계산한 근삿값을 요구하므로 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `q13`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
13. 어느 공장에서 생산한 치약의 무게는 평균이 $400\text{g}$, 표준편차가 $20\text{g}$인 정규분포를 따른다고 한다. 이 공장에서는 생산 시스템의 이상 여부를 점검하기 위해 하루에 생산된 치약 중에서 크기가 100인 표본을 임의추출하여 치약의 중량에 대한 표본평균 $\overline{X}$를 구하려고 한다. 이때 $\overline{X}$가 $c$보다 작으면 생산 시스템에 이상이 있는 것으로 판단하고 생산 시스템을 점검하기로 하였다. 이 공장에서 생산 시스템에 이상이 있다고 판단할 확률이 0.0668이라고 할 때, 위의 표준정규분포표를 이용하여 상수 $c$의 값을 구하면? [4.5점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></table>
~~~

- 원본 선택지: ① $396$ / ② $397$ / ③ $398$ / ④ $403$ / ⑤ $404$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 표본크기 $100$이므로 표본평균은 평균 $400$, 표준편차 $20/\sqrt{100}=2$인 정규분포를 따른다. $P(\overline X<c)=0.0668$은 표준정규분포에서 $P(Z<-1.5)=0.5-0.4332=0.0668$에 해당한다. 따라서 $(c-400)/2=-1.5$이고 $c=400-3=397$이다. 정답은 ②이다.
- **독립 수학 검산·판정 근거:** n100 SE2, 아래 꼬리 .0668→z−1.5, c397 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q13-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본크기 $100$이므로 표본평균은 평균 $400$, 표준편차 $20/\sqrt{100}=2$인 정규분포를 따른다. $P(\overline X<c)=0.0668$은 표준정규분포에서 $P(Z<-1.5)=0.5-0.4332=0.0668$에 해당한다. 따라서 $(c-400)/2=-1.5$이고 $c=400-3=397$이다. 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `q14`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
14. 어떤 회사에서 생산한 휴대 전화 배터리를 한 번 충전하여 사용하는 시간은 평균이 $m$분, 표준편차가 40분인 정규분포를 따른다고 한다. 이 회사에서 생산하는 휴대 전화 배터리 중에서 $n$개를 임의추출한 후 한 번 충전하여 사용하는 시간을 조사하였더니 평균이 $\overline{x}$분이었다. 이 회사에서 생산하는 휴대 전화 배터리의 모평균 $m$에 대한 신뢰도 95%의 신뢰구간이 $590.2 \le m \le 609.8$일 때, $\overline{x}$의 값과 자연수 $n$의 값의 합을 구하면? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \le 1.96) = 0.95$로 계산한다.) [5.0점]
~~~

- 원본 선택지: ① $608$ / ② $636$ / ③ $649$ / ④ $664$ / ⑤ $681$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 신뢰구간의 중심은 표본평균이므로 $\overline x=(590.2+609.8)/2=600$이다. 오차한계는 $(609.8-590.2)/2=9.8$이다. $95\%$ 신뢰구간에서 $1.96\frac{40}{\sqrt n}=9.8$이므로 $\sqrt n=\frac{1.96\cdot40}{9.8}=8$, $n=64$이다. 따라서 $\overline x+n=600+64=664$로 정답은 ④이다.
- **독립 수학 검산·판정 근거:** 95% CI 중심600, 반폭9.8, σ40→n64, 합664 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q14-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
신뢰구간의 중심은 표본평균이므로 $\overline x=(590.2+609.8)/2=600$이다. 오차한계는 $(609.8-590.2)/2=9.8$이다. $95\%$ 신뢰구간에서 $1.96\frac{40}{\sqrt n}=9.8$이므로 $\sqrt n=\frac{1.96\cdot40}{9.8}=8$, $n=64$이다. 따라서 $\overline x+n=600+64=664$로 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `q15`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
15. 어느 제과점에서 만든 슈크림빵 한 개의 무게는 평균이 $200\text{g}$, 표준편차가 $30\text{g}$인 정규분포를 따른다고 한다. 이 슈크림빵을 25개씩 임의추출하여 한 상자에 넣어 판매하는데, 슈크림빵 한 상자의 무게가 $4.925\text{kg}$ 이상 $5.3\text{kg}$ 이하일 때 정상 제품으로 분류하여 판매한다고 한다. 이 제과점에서 판매하는 슈크림빵 상자 중에서 임의추출한 한 상자가 정상 제품으로 분류될 확률을 위의 표준정규분포표를 이용하여 구하면? (단, 상자의 무게는 고려하지 않는다.) [5.0점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></table>
~~~

- 원본 선택지: ① $0.3830$ / ② $0.5328$ / ③ $0.6687$ / ④ $0.8185$ / ⑤ $0.9104$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 상자에는 빵이 $25$개 들어 있으므로 총 무게는 $25\overline X$이다. 정상 범위 $4925\le25\overline X\le5300$을 $25$로 나누면 $197\le\overline X\le212$이다. 표본평균의 평균은 $200$, 표준편차는 $30/\sqrt{25}=6$이므로 $Z=(\overline X-200)/6$으로 표준화하면 양 끝은 $-0.5,2$이다. 따라서 $P(197\le\overline X\le212)=P(-0.5\le Z\le2)=0.1915+0.4772=0.6687$이다. 정답은 ③이다.
- **독립 수학 검산·판정 근거:** 25개 빵 총량의 평균5000g, SD150g; 허용 [4925,5300]은 z−.5~2, 확률 .6687 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q15-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
상자에는 빵이 $25$개 들어 있으므로 총 무게는 $25\overline X$이다. 정상 범위 $4925\le25\overline X\le5300$을 $25$로 나누면 $197\le\overline X\le212$이다. 표본평균의 평균은 $200$, 표준편차는 $30/\sqrt{25}=6$이므로 $Z=(\overline X-200)/6$으로 표준화하면 양 끝은 $-0.5,2$이다. 따라서 $P(197\le\overline X\le212)=P(-0.5\le Z\le2)=0.1915+0.4772=0.6687$이다. 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `q16`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
16. 확률변수 $X$가 정규분포 $N(m, \sigma^2)$을 따를 때, 다음 &lt;보기&gt; 중에서 옳은 것을 모두 고른 것은? [5.5점]<br><br>&lt;보기&gt;<br>ㄱ. $P(m-\sigma \le X \le m+\sigma) = 2P(m \le X \le m+\sigma)$<br>ㄴ. 확률변수 $X$의 확률밀도함수의 그래프는 직선 $x=m$에 대하여 대칭이다.<br>ㄷ. $P(m-2\sigma \le X \le m+\sigma) = a$, $P\left(\left|\frac{X-m}{\sigma}\right| \ge 2\right) = b$라고 할 때, 확률 $P(X \ge m+\sigma) = 1+a-\frac{b}{2}$이다.
~~~

- 원본 선택지: ① ㄱ / ② ㄴ / ③ ㄱ, ㄴ / ④ ㄴ, ㄷ / ⑤ ㄱ, ㄴ, ㄷ
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 정규분포의 밀도그래프는 평균 $m$을 중심으로 좌우대칭이다. 각 보기를 따로 판단한다. ㄱ. $[m-\sigma,m]$과 $[m,m+\sigma]$의 확률은 대칭성 때문에 같다. 따라서 $P(m-\sigma\le X\le m+\sigma)=2P(m\le X\le m+\sigma)$이므로 참이다. ㄴ. 정규분포 밀도함수의 대칭축은 $x=m$이므로 참이다. ㄷ. $u=P(0\le Z\le1)$, $v=P(0\le Z\le2)$라 놓으면 $a=u+v$, $b=1-2v$이다. 오른쪽 식 $1+a-\frac b2=\frac12+u+2v$인데, 왼쪽 $P(X\ge m+\sigma)=\frac12-u$이다. $u,v>0$이므로 서로 다르다. 따라서 거짓이다. 옳은 것은 ㄱ과 ㄴ이므로 정답은 ③이다.
- **독립 수학 검산·판정 근거:** 정규 대칭 ㄱㄴ 참, ㄷ 수치/부호 불일치, ③ 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q16-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
정규분포의 밀도그래프는 평균 $m$을 중심으로 좌우대칭이다. 각 보기를 따로 판단한다.<br><br>ㄱ. $[m-\sigma,m]$과 $[m,m+\sigma]$의 확률은 대칭성 때문에 같다. 따라서 $P(m-\sigma\le X\le m+\sigma)=2P(m\le X\le m+\sigma)$이므로 참이다.<br><br>ㄴ. 정규분포 밀도함수의 대칭축은 $x=m$이므로 참이다.<br><br>ㄷ. $u=P(0\le Z\le1)$, $v=P(0\le Z\le2)$라 놓으면 $a=u+v$, $b=1-2v$이다. 오른쪽 식 $1+a-\frac b2=\frac12+u+2v$인데, 왼쪽 $P(X\ge m+\sigma)=\frac12-u$이다. $u,v>0$이므로 서로 다르다. 따라서 거짓이다.<br><br>옳은 것은 ㄱ과 ㄴ이므로 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `q17`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
17. 순천고등학교 학생의 하루 등하교시간은 평균이 40분, 표준편차가 10분인 정규분포를 따른다고 한다. 이 학교 학생의 하루 등하교시간이 42.8분 이상일 확률이 $k$분 이상일 확률의 3배일 때, 상수 $k$의 값은? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0 \le Z \le 0.28) = 0.11$, $P(0 \le Z \le 1.13) = 0.37$로 계산한다.) [5.5점]
~~~

- 원본 선택지: ① $28.7$ / ② $43.1$ / ③ $51.3$ / ④ $61.1$ / ⑤ $69.1$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > $X\sim N(40,10^2)$에서 $42.8$을 표준화하면 $(42.8-40)/10=0.28$이다. 따라서 $P(X\ge42.8)=P(Z\ge0.28)=0.5-0.11=0.39$이다. 이 확률이 $P(X\ge k)$의 $3$배이므로 $P(X\ge k)=\frac{0.39}{3}=0.13$이다. 표에서 $0.5-0.37=0.13$에 해당하는 표준점수는 $1.13$이다. 따라서 $\frac{k-40}{10}=1.13$, $k=40+11.3=51.3$이다. 정답은 ③이다.
- **독립 수학 검산·판정 근거:** z0.28 위꼬리 .39는 z1.13 위꼬리 .13의3배, k51.3 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q17-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
$X\sim N(40,10^2)$에서 $42.8$을 표준화하면 $(42.8-40)/10=0.28$이다. 따라서 $P(X\ge42.8)=P(Z\ge0.28)=0.5-0.11=0.39$이다. 이 확률이 $P(X\ge k)$의 $3$배이므로 $P(X\ge k)=\frac{0.39}{3}=0.13$이다. 표에서 $0.5-0.37=0.13$에 해당하는 표준점수는 $1.13$이다. 따라서 $\frac{k-40}{10}=1.13$, $k=40+11.3=51.3$이다. 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `q18`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
18. 확률변수 $X$는 정규분포 $N(10, 2^2)$, 확률변수 $Y$는 정규분포 $N(m, 2^2)$을 따르고, 확률변수 $X$와 $Y$의 확률밀도함수는 각각 $f(x)$와 $g(x)$이다. $f(12) \le g(20)$을 만족시키는 $m$에 대하여 $P(23 \le Y \le 26)$의 최댓값을 오른쪽 표준정규분포표를 이용하여 구하면? [6.0점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></table>
~~~

- 원본 선택지: ① $0.2857$ / ② $0.5328$ / ③ $0.6247$ / ④ $0.8185$ / ⑤ $0.9104$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 두 분포의 표준편차는 모두 $2$이다. 정규밀도는 평균에서의 거리가 가까울수록 높다. 먼저 $f(12)\le g(20)$을 비교한다. $X$의 평균은 $10$이므로 $|12-10|=2$이다. 따라서 $Y$의 평균 $m$은 $|20-m|\le2$, 즉 $18\le m\le22$를 만족해야 한다. 다음으로 $P(23\le Y\le26)$을 최대로 한다. 모든 허용 평균 $m\le22$는 구간의 왼쪽 끝 $23$보다 작다. 따라서 $m$을 오른쪽으로 옮길수록 구간 $[23,26]$의 모든 점이 평균에 가까워져 그 구간의 정규밀도와 확률이 증가한다. 최댓값은 $m=22$에서 얻는다. $m=22$를 표준화하면 $23\mapsto0.5$, $26\mapsto2$이므로 $P(0.5\le Z\le2)=0.4772-0.19
- **독립 수학 검산·판정 근거:** 밀도 비교 |m−20|≤2→m∈[18,22], 구간23~26 확률은 m22에서 최대 .2857 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q18-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
두 분포의 표준편차는 모두 $2$이다. 정규밀도는 평균에서의 거리가 가까울수록 높다.<br><br>먼저 $f(12)\le g(20)$을 비교한다. $X$의 평균은 $10$이므로 $|12-10|=2$이다. 따라서 $Y$의 평균 $m$은 $|20-m|\le2$, 즉 $18\le m\le22$를 만족해야 한다.<br><br>다음으로 $P(23\le Y\le26)$을 최대로 한다. 모든 허용 평균 $m\le22$는 구간의 왼쪽 끝 $23$보다 작다. 따라서 $m$을 오른쪽으로 옮길수록 구간 $[23,26]$의 모든 점이 평균에 가까워져 그 구간의 정규밀도와 확률이 증가한다. 최댓값은 $m=22$에서 얻는다.<br><br>$m=22$를 표준화하면 $23\mapsto0.5$, $26\mapsto2$이므로 $P(0.5\le Z\le2)=0.4772-0.1915=0.2857$이다.<br><br>따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `q19`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
[서술형 1] 확률변수 $X$의 확률밀도함수 $y=f(x)$ ($-2r \le x \le 2r$)의 그래프가 아래 그림과 같이 반지름의 길이가 $r$인 두 사분원의 호와 두 선분으로 이루어져 있을 때, $P\left(|X| \le \frac{\sqrt{2}}{\sqrt{\pi+6}}\right)$의 값을 구하시오. [6.0점]<br><br><img src="assets/images/19_순천고_2학기_기말_고2_확률과통계/q19.png"><br><br><table class="exam-table"><tr><th>채점 요소</th><th>점수</th></tr><tr><td>(1) $r$의 값을 올바르게 구하였다.</td><td>3점</td></tr><tr><td>(2) 구하고자 하는 확률의 값을 올바르게 구하였다.</td><td>3점</td></tr><tr><td>계</td><td>6점</td></tr></table>
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **\frac{\pi+4}{\pi+6}**
- 기존 solution 정확 발췌: > 그림의 $-2r,-r,0,r,2r$ 경계와 높이 $r,2r$를 먼저 확인한다. 전체 확률은 그래프 아래 넓이 $1$이다. ① 가운데 $[-r,r]$의 높이 $r$인 직사각형 넓이는 $(2r)\cdot r=2r^2$이다. ② 직사각형 위쪽의 두 사분원은 합치면 반지름 $r$인 반원이므로 넓이는 $\frac{\pi r^2}{2}$이다. ③ 좌우 $[-2r,-r]$, $[r,2r]$의 두 직각삼각형 넓이 합은 $2\cdot\frac{r^2}{2}=r^2$이다. 따라서 $1=2r^2+\frac{\pi r^2}{2}+r^2=\frac{\pi+6}{2}r^2$이고, $r^2=\frac2{\pi+6}$, $r=\frac{\sqrt2}{\sqrt{\pi+6}}$이다. 구하려는 사건 $|X|\le\frac{\sqrt2}{\
- **독립 수학 검산·판정 근거:** 실물 두 사분원·두 삼각형: r²=2/(π+6), |X|≤r 확률(π+4)/(π+6) 일치.
- 원본문제 PNG: JS 지정 `assets/images/19_순천고_2학기_기말_고2_확률과통계/q19.png` → 실제 저장소 `assets/images/19_순천고_2학기_기말_고2_확률과통계/q19.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q19-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
그림의 $-2r,-r,0,r,2r$ 경계와 높이 $r,2r$를 먼저 확인한다. 전체 확률은 그래프 아래 넓이 $1$이다.<br><br>① 가운데 $[-r,r]$의 높이 $r$인 직사각형 넓이는 $(2r)\cdot r=2r^2$이다.<br>② 직사각형 위쪽의 두 사분원은 합치면 반지름 $r$인 반원이므로 넓이는 $\frac{\pi r^2}{2}$이다.<br>③ 좌우 $[-2r,-r]$, $[r,2r]$의 두 직각삼각형 넓이 합은 $2\cdot\frac{r^2}{2}=r^2$이다.<br><br>따라서 $1=2r^2+\frac{\pi r^2}{2}+r^2=\frac{\pi+6}{2}r^2$이고, $r^2=\frac2{\pi+6}$, $r=\frac{\sqrt2}{\sqrt{\pi+6}}$이다.<br><br>구하려는 사건 $|X|\le\frac{\sqrt2}{\sqrt{\pi+6}}$은 바로 $-r\le X\le r$이다. 이 구간에는 직사각형과 반원만 들어가고 바깥의 두 삼각형은 포함되지 않는다.<br><br>$P(-r\le X\le r)=2r^2+\frac{\pi r^2}{2}=\frac{\pi+4}{2}\cdot\frac2{\pi+6}=\frac{\pi+4}{\pi+6}$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q20 — KEEP

- qid/source ordinal: `20`/20; sourceQid: `q20`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
[서술형 2] 어느 제과점에서 생산하는 식빵의 무게 $X$는 평균이 $m$, 표준편차가 8인 정규분포를 따른다고 한다. $P(2m-a \le X \le a) = 0.9544$일 때, 이 제과점에서 생산하는 식빵 중에서 임의로 추출한 16개의 식빵의 무게의 표본평균을 $\overline{X}$라 하자. $P(0 \le \overline{X}-a+12 \le 1)$의 값을 오른쪽 표준정규분포표를 이용하여 구하시오. (단, $a$는 $m$보다 큰 상수이고, 무게의 단위는 $\text{g}$이다.) [7.0점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></table><br><table class="exam-table"><tr><th>채점 요소</th><th>점수</th></tr><tr><td>(1) 확률변수 $X$와 $\overline{X}$의 분포를 올바르게 나타내었다.</td><td>1점</td></tr><tr><td>(2) $a$와 $m$의 관계를 식으로 올바르게 나타내었다.</td><td>3점</td></tr><tr><td>(3) 구하고자 하는 확률의 값을 올바르게 구하였다.</td><td>3점</td></tr><tr><td>계</td><td>7점</td></tr></table>
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **0.0166**
- 기존 solution 정확 발췌: > $2m-a$와 $a$의 중점은 $m$이므로 주어진 구간은 평균 $m$을 중심으로 대칭이다. $P(2m-a\le X\le a)=0.9544=2\cdot0.4772$이므로 평균에서 양쪽으로 표준편차 $2$배인 구간이다. 표준편차가 $8$이므로 $a-m=2\cdot8=16$, 즉 $a=m+16$이다. 크기 $16$의 표본평균은 평균 $m$, 표준편차 $8/\sqrt{16}=2$인 정규분포를 따른다. $0\le\overline X-a+12\le1$은 $a-12\le\overline X\le a-11$, 즉 $m+4\le\overline X\le m+5$이다. 표준화하면 $2\le Z\le2.5$이므로 확률은 $0.4938-0.4772=0.0166$이다.
- **독립 수학 검산·판정 근거:** 95.44%의 중앙 ±2σ에서 a=m+16, 표본 n16 SE2; z2~2.5 면적 .0166 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q20-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
$2m-a$와 $a$의 중점은 $m$이므로 주어진 구간은 평균 $m$을 중심으로 대칭이다. $P(2m-a\le X\le a)=0.9544=2\cdot0.4772$이므로 평균에서 양쪽으로 표준편차 $2$배인 구간이다. 표준편차가 $8$이므로 $a-m=2\cdot8=16$, 즉 $a=m+16$이다. 크기 $16$의 표본평균은 평균 $m$, 표준편차 $8/\sqrt{16}=2$인 정규분포를 따른다. $0\le\overline X-a+12\le1$은 $a-12\le\overline X\le a-11$, 즉 $m+4\le\overline X\le m+5$이다. 표준화하면 $2\le Z\le2.5$이므로 확률은 $0.4938-0.4772=0.0166$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q21 — KEEP

- qid/source ordinal: `21`/21; sourceQid: `q21`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `79cc9fdab86a47b87178fb74bb1748d70a1db150`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
[서술형 3] 어느 회사의 입사 시험에서 지원자들의 성적을 알아보기 위하여 임의추출한 64명의 지원자의 점수를 조사하였더니 평균이 240점이었다. 이 회사의 입사 시험에 지원한 전체 지원자들의 점수는 표준편차가 8점인 정규분포를 따르고, 평균 $m$을 신뢰도 $\alpha$%로 추정하였더니 신뢰구간이 $237.5 \le m \le 242.5$이었다. 위의 표준정규분포표를 이용하여 $\alpha$의 값을 구하시오. [7.0점]<br><br><table class="exam-table"><tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr><tr><td>1.0</td><td>0.34</td></tr><tr><td>1.5</td><td>0.43</td></tr><tr><td>2.0</td><td>0.48</td></tr><tr><td>2.5</td><td>0.49</td></tr></table><br><table class="exam-table"><tr><th>채점 요소</th><th>점수</th></tr><tr><td>(1) 신뢰구간을 올바르게 나타내었다.</td><td>2점</td></tr><tr><td>(2) $\alpha$의 조건을 식으로 올바르게 나타내었다.</td><td>2점</td></tr><tr><td>(3) 구하고자 하는 $\alpha$의 값을 올바르게 구하였다.</td><td>3점</td></tr><tr><td>계</td><td>7점</td></tr></table>
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **98**
- 기존 solution 정확 발췌: > 표본평균은 $\overline x=240$, 표본크기는 $64$, 모집단의 표준편차는 $8$이므로 표준오차는 $8/\sqrt{64}=1$이다. 신뢰구간의 오차한계는 $242.5-240=2.5$이다. 신뢰구간의 식 $\overline x\pm z\frac\sigma{\sqrt n}$에서 $z\cdot1=2.5$이므로 $z=2.5$이다. 표에서 $P(0\le Z\le2.5)=0.49$이므로 중앙 확률은 $2\cdot0.49=0.98$이다. 따라서 신뢰도 $\alpha=98$이다.
- **독립 수학 검산·판정 근거:** 신뢰구간 반폭2.5, 표본 SE1→z2.5, 제시된 소수둘째자리 표로 신뢰도98% 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q21-solution-v3.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균은 $\overline x=240$, 표본크기는 $64$, 모집단의 표준편차는 $8$이므로 표준오차는 $8/\sqrt{64}=1$이다. 신뢰구간의 오차한계는 $242.5-240=2.5$이다. 신뢰구간의 식 $\overline x\pm z\frac\sigma{\sqrt n}$에서 $z\cdot1=2.5$이므로 $z=2.5$이다. 표에서 $P(0\le Z\le2.5)=0.49$이므로 중앙 확률은 $2\cdot0.49=0.98$이다. 따라서 신뢰도 $\alpha=98$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

## 2. 그림 실물 증적 및 수학 검증 범위

- 원본 PNG 1개 실물 모두 확인: Q19: `assets/images/19_순천고_2학기_기말_고2_확률과통계/q19.png`.
- PNG를 출제 JS의 상대 경로와 실제 저장소 경로로 각각 기록했다. `archive/assets/images/`와 루트 `assets/images/`가 혼재하므로 실제 위치만 확인 없이 경로를 통일하지 않는다.
- 기존 학생해설 SVG 17개의 필드·원본 경로를 기록했으나 렌더·Golden/Negative·화면 QA·원본 PDF 대조는 **NOT_RUN**이다.
- 전 문항 JS 원문 내용, 선택지, 정답, 기존 해설 전문을 보존하고 수학 판정을 별도 서술했다. UPGRADE 발견은 출고 수정 승인과 같지 않다.

## 3. 시험지 완료 게이트

- **21/21 READ_EVIDENCED; UNREAD=[]; next_qid=NONE; EXAM_AUDIT_COMPLETE.**
- 해설 수정안은 분리 MD에만 존재한다. 원본 source fidelity, SVG 렌더, 인쇄본, Golden/Negative, 학생 UI 검수, 운영 병합은 **HOLD/NOT_RUN**.
