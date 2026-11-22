# 고2 확률과 통계 2학기 기말 — 24_매산여고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 첫 묶음(최신 연도순 5장) · 2026-11-22 KST. **학생용 해설 감사·수정안 MD 초안**이며 원본 JS 수정·운영 출고 PASS·Golden/Negative 완료를 의미하지 않는다.

## 0. 시험지 고정 정보

- 전용 라인: lane40 · 고2 확률과 통계 · 2학기 기말 원본(최신 연도에서 과거 연도 순).
- 시험지: 24_매산여고_2학기_기말_고2_확률과통계
- 원본 JS: `archive/exams/original/high/h2/2final/24_매산여고_2학기_기말_고2_확률과통계.js`
- 원본 ref: `main`; Git blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`
- sourcePdf 메타데이터 없음; 외부 인쇄 PDF와 원문 대조 NOT_RUN.
- 총 문항/전수 분모: **23문항 (Q01~Q23)**; 원본 content·choices·answer·solution 전문 모두 읽고 독립 수학 검산.
- MD 저장 경로: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2024_maesanyeo_2final_DEEP_AUDIT.md`; 전용 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 PNG: **고유 2개, 문항별 2회 참조**, 전부 실제 다운로드 및 그래프·표·수직선 육안 판독. 이미지를 새로 제작하거나 원본을 변경하지 않음.
- 기존 풀이 SVG: **10문항**에서 경로 메타데이터 확인, 별도 SVG 렌더·학생 화면 QA **NOT_RUN**.
- 감사 방법: 원격 원본 JSON 정적 추출(시험 스크립트 미실행), 직접 그림 실물 대조, 확률분포/조합/조건부확률/표본평균/추정의 수치별 재계산, 보기·정답·해설 전문 일치 확인. 정규근사 문항은 문제에서 제공한 표와 연속성 보정 생략 관례를 별도로 구별.
- 상태: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 23/23 · KEEP 23 · UPGRADE 0 · UNREAD 0**. 운영 PASS, 골든/네거티브/교육과정 검증의 완료 주장은 하지 않음.
- 현재 cursor: `next_qid=NONE`, `UNREAD=[]`.

## 1. Q01~Q23 실제 원문·독립 수학 검산·판정

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
확률변수 $X$의 확률질량함수가\n$P(X=x) = \dfrac{a-x}{25}$ ($x=1, 2, 3, 4, 5$)일 때,\n상수 $a$의 값을 구하면?[3.5점]
~~~

- 원본 선택지: ① 7 / ② 8 / ③ 9 / ④ 10 / ⑤ 11
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 확률질량함수의 모든 확률을 더하면 $1$이다. $\dfrac{a-1}{25}+\dfrac{a-2}{25}+\dfrac{a-3}{25}+\dfrac{a-4}{25}+\dfrac{a-5}{25}=1$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 확률합 Σ_{x=1}^5(a−x)/25=(5a−15)/25=1에서 a8. 개별확률은 7,6,5,4,3을 분자로25여서 음수가 없다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률질량함수의 모든 확률을 더하면 $1$이다.
$\dfrac{a-1}{25}+\dfrac{a-2}{25}+\dfrac{a-3}{25}+\dfrac{a-4}{25}+\dfrac{a-5}{25}=1$
$\dfrac{5a-(1+2+3+4+5)}{25}=1$
$5a-15=25$
$5a=40,\quad a=8$이다.
각 확률은 $\dfrac7{25},\dfrac6{25},\dfrac5{25},\dfrac4{25},\dfrac3{25}$로 모두 $0$ 이상이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
확률변수 $X$가 이항분포 $B\left(32, \dfrac{1}{4}\right)$를 따를 때, $X$의 $E(X)=a$, $V(X)=b$이다. 이 때 $a+b$의 값을 구하면?[3.5점]\n(단, $a, b$는 상수이다.)
~~~

- 원본 선택지: ① 11 / ② 12 / ③ 13 / ④ 14 / ⑤ 15
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> $X\sim B\left(32,\dfrac14\right)$이므로 시행 횟수 $n=32$, 성공 확률 $p=\dfrac14$이다. 이항분포의 평균을 구하면

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: B(32,1/4)의 평균8, 분산32(1/4)(3/4)=6, 합14다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim B\left(32,\dfrac14\right)$이므로 시행 횟수 $n=32$, 성공 확률 $p=\dfrac14$이다.
이항분포의 평균을 구하면
$a=E(X)=np$
$=32\times\dfrac14=8$이다.
분산은
$b=V(X)=np(1-p)$
$=32\times\dfrac14\times\dfrac34$
$=8\times\dfrac34=6$이다.
따라서 $a+b=8+6=14$이므로 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
확률변수 $X$가 정규분포 $N(60, 16)$을 따를 때, 확률 $P(56 \le X \le 66)$을 오른쪽 표준정규분포표를 이용하여 구하면?[3.6점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>0.5</td><td>0.1915</td></tr>
<tr><td>1.0</td><td>0.3413</td></tr>
<tr><td>1.5</td><td>0.4332</td></tr>
<tr><td>2.0</td><td>0.4772</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: ① 0.6826 / ② 0.7745 / ③ 0.8185 / ④ 0.8664 / ⑤ 0.9544
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> $X\sim N(60,16)$에서 평균은 $60$, 표준편차는 $\sqrt{16}=4$이다. $Z=\dfrac{X-60}{4}$로 표준화하면

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: N(60,16)의 표준편차4. 56,66을 표준화한 −1,1.5의 중앙확률 0.3413+0.4332=0.7745다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q3-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim N(60,16)$에서 평균은 $60$, 표준편차는 $\sqrt{16}=4$이다.
$Z=\dfrac{X-60}{4}$로 표준화하면
$P(56\le X\le66)$
$=P\left(\dfrac{56-60}{4}\le Z\le\dfrac{66-60}{4}\right)$
$=P(-1\le Z\le1.5)$이다.
$0$을 기준으로 구간을 나누면
$P(-1\le Z\le1.5)$
$=P(-1\le Z\le0)+P(0\le Z\le1.5)$
$=0.3413+0.4332=0.7745$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
두 반 $A, B$의 수학 성적은 정규분포를 따르고, 정규분포곡선은 그림과 같다. 두 반 $A, B$의 수학 성적의 평균을 각각 $m_1, m_2$, 표준편차를 각각 $\sigma_1, \sigma_2$라 할 때, 다음 중 옳은 것은?[3.6점]
~~~

- 원본 선택지: ① $m_1 = m_2, \sigma_1 \gt \sigma_2$ / ② $m_1 \gt m_2, \sigma_1 = \sigma_2$ / ③ $m_1 = m_2, \sigma_1 \lt \sigma_2$ / ④ $m_1 \gt m_2, \sigma_1 \gt \sigma_2$ / ⑤ $m_1 \lt m_2, \sigma_1 \lt \sigma_2$
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 두 정규분포곡선의 대칭축이 그림의 같은 $m$을 지나므로 $m_1=m_2$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 그림의 두 정규곡선 A/B는 모두 중심 m의 수직선을 공유하고 A가 더 좁고 높다. 따라서 m1=m2, σ1<σ2인 ③이다.
- 원본문제 PNG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q4.png` — 실물 판독 완료.
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
두 정규분포곡선의 대칭축이 그림의 같은 $m$을 지나므로
$m_1=m_2$이다.
곡선 $A$는 $B$보다 꼭대기가 높고 폭이 좁다.
평균이 같은 정규분포에서는 표준편차가 작을수록 곡선이 높고 좁아진다.
따라서 $\sigma_1<\sigma_2$이다.
$m_1=m_2,\ \sigma_1<\sigma_2$이므로 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
숫자 $1, 1, 2, 2, 2, 3$이 각각 적힌 공 $6$개가 들어있는 주머니에서 크기가 $2$인 표본을 임의추출했을 때, 표본평균을 $\overline{X}$라 할 때, $P(\overline{X}=2)$를 구하면?[3.7점]
~~~

- 원본 선택지: ① $\dfrac{1}{18}$ / ② $\dfrac{1}{9}$ / ③ $\dfrac{2}{9}$ / ④ $\dfrac{1}{3}$ / ⑤ $\dfrac{13}{36}$
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 표본평균이 $2$이려면 두 추출값의 합이 $4$여야 한다. 두 추출값을 $X_1, X_2$라 하면, 특별한 언급이 없으므로 임의추출은 복원추출로 보아 두 추출은 독립이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 5개 공에서 크기2인 표본을 통상 독립 복원추출로 해석하면 P(1,3)+P(2,2)+P(3,1)=(2·1+3²+1·2)/36=13/36이다. 원문은 복원 여부를 명시하지 않아 독립 표본추출 관례에 의존하는 점을 학생용 설명에 드러낸 기존 풀이가 적절하다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표본평균이 $2$이려면 두 추출값의 합이 $4$여야 한다.
두 추출값을 $X_1, X_2$라 하면, 특별한 언급이 없으므로 임의추출은 복원추출로 보아 두 추출은 독립이다.
각 $i=1,2$에 대하여 $P(X_i=1)=\dfrac26$, $P(X_i=2)=\dfrac36$, $P(X_i=3)=\dfrac16$이다.
합이 $4$인 순서쌍은 $(1,3)$, $(2,2)$, $(3,1)$이므로
$P(\overline X=2)$
$=P(X_1=1, X_2=3)+P(X_1=2, X_2=2)+P(X_1=3, X_2=1)$
$=\dfrac26\times\dfrac16+\dfrac36\times\dfrac36+\dfrac16\times\dfrac26$
$=\dfrac{2+9+2}{36}=\dfrac{13}{36}$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
정규분포 $N(m, 5^2)$을 따르는 모집단에서 크기가 $625$인 표본을 임의추출하여 얻은 표본평균을 이용하여 구한 $m$에 대한 신뢰도 $95\%$의 신뢰구간의 길이를 구하면?[3.7점]\n(단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \le 1.96)=0.95$ 로 계산한다.)
~~~

- 원본 선택지: ① 0.1568 / ② 0.52 / ③ 0.49 / ④ 0.58 / ⑤ 0.784
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 신뢰도 $95\%$의 신뢰구간은 $\overline X\pm1.96\dfrac{\sigma}{\sqrt n}$이다. 양 끝값 사이의 길이는 오차의 한계의 $2$배이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 95% 신뢰구간 길이2×1.96×5/√625=3.92/5=0.784다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
신뢰도 $95\%$의 신뢰구간은 $\overline X\pm1.96\dfrac{\sigma}{\sqrt n}$이다.
양 끝값 사이의 길이는 오차의 한계의 $2$배이다.
$\sigma=5,\quad n=625,\quad\sqrt n=25$이므로
$L=2\times1.96\times\dfrac5{\sqrt{625}}$
$=2\times1.96\times\dfrac5{25}$
$=3.92\times0.2$
$=0.784$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
비슷한 모양의 $5$개의 열쇠 중에서 사물함에 맞는 열쇠는 $1$개만 있다고 한다. 어느 열쇠가 사물함에 맞는지 알아보기 위하여 하나씩 차례로 여는 시도를 하였을 때, 열릴 때까지 시도한 횟수의 분산을 구하면?[3.8점]
~~~

- 원본 선택지: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 6
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 맞는 열쇠는 $5$개 중 하나이고, 실패한 열쇠는 다시 시도하지 않는다. 맞는 열쇠가 시도 순서의 어느 위치에 있는지는 똑같이 가능하므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 맞는 열쇠가 시도 순서1..5의 각 위치에 균일하고 재시험하지 않는 조건에서 E(X)=3,E(X²)=11,V=2다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
맞는 열쇠는 $5$개 중 하나이고, 실패한 열쇠는 다시 시도하지 않는다.
맞는 열쇠가 시도 순서의 어느 위치에 있는지는 똑같이 가능하므로
$P(X=1)=P(X=2)=\cdots=P(X=5)=\dfrac15$이다.
먼저 평균을 구하면
$E(X)=\dfrac{1+2+3+4+5}{5}=\dfrac{15}{5}=3$이다.
제곱의 평균은
$E(X^2)=\dfrac{1^2+2^2+3^2+4^2+5^2}{5}$
$=\dfrac{55}{5}=11$이다.
따라서
$V(X)=E(X^2)-\{E(X)\}^2$
$=11-3^2=2$이다.
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
빨간 공 $3$개와 파란 공 $2$개가 들어 있는 주머니에서 임의로 공 $2$개를 동시에 꺼낼 때, 나오는 파란 공의 개수를 확률변수 $X$라고 하자. $10X-3$의 평균을 구하면?[3.8점]
~~~

- 원본 선택지: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 8
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 전체 $5$개 중 $2$개를 고르는 경우는 $\binom52=10$가지이다. 파란 공의 개수 $X$는 $0,1,2$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 5개에서 파란 공2개를 2개 동시에 비복원추출하면 E(X)=2×2/5=4/5, E(10X−3)=5다. 초등적인 조합분포 3/10,6/10,1/10과도 맞는다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
전체 $5$개 중 $2$개를 고르는 경우는 $\binom52=10$가지이다.
파란 공의 개수 $X$는 $0,1,2$이다.
$P(X=0)=\dfrac{\binom32}{10}=\dfrac3{10}$
$P(X=1)=\dfrac{\binom31\binom21}{10}=\dfrac6{10}$
$P(X=2)=\dfrac{\binom22}{10}=\dfrac1{10}$이다.
따라서 평균은
$E(X)=0\cdot\dfrac3{10}+1\cdot\dfrac6{10}+2\cdot\dfrac1{10}$
$=\dfrac8{10}=\dfrac45$이다.
기댓값의 성질을 적용하면
$E(10X-3)=10E(X)-3$
$=10\cdot\dfrac45-3$
$=8-3=5$이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
확률변수 $X$에 대하여 $E(X)=5$, $V(X)=10$이고, 확률변수 $Y=aX+b$에 대하여 $E(Y)=7$, $V(Y)=40$일 때, 상수 $b$의 값을 구하면? (단, $a>0$)[3.9점]
~~~

- 원본 선택지: ① -1 / ② -2 / ③ -3 / ④ -4 / ⑤ -5
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> $Y=aX+b$에서 상수 $b$를 더해도 분산은 변하지 않는다. 따라서 분산 조건으로 $a$를 먼저 구한다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: V(Y)=a²×10=40, a>0에서 a2; E(Y)=2×5+b=7에서 b=-3이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$Y=aX+b$에서 상수 $b$를 더해도 분산은 변하지 않는다.
따라서 분산 조건으로 $a$를 먼저 구한다.
$V(Y)=a^2V(X)$
$40=10a^2$
$a^2=4$이다.
$a>0$이므로 $a=2$이다.
이제 기댓값 조건에 대입한다.
$E(Y)=aE(X)+b$
$7=2\cdot5+b$
$7=10+b,\quad b=-3$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
다음 그림은 표준정규분포 $N(0, 1)$을 따르는 확률변수 $Z$의 확률밀도함수의 그래프이다. 정규분포 $N(40, 9)$를 따르는 확률변수 $X$에 대하여 $P(a \le X \le 43)$이 색칠한 부분의 넓이와 같을 때, 상수 $a$의 값을 구하면?[4.0점]
~~~

- 원본 선택지: ① 10 / ② 21 / ③ 34 / ④ 41 / ⑤ 66
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 그림에서 색칠한 표준정규분포의 구간은 $-1\le Z\le2$이다. $X\sim N(40,9)$이므로 $Z=\dfrac{X-40}{3}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 음영은 Z∈[-1,2]로 정확히 확인했다. 평균40,σ3인 X의 상한43은 z1. 대칭에 따라 같은 영역은 Z∈[-2,1], 따라서 하한 a=40−2×3=34다.
- 원본문제 PNG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q10.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q10-solution-v3.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
그림에서 색칠한 표준정규분포의 구간은 $-1\le Z\le2$이다.
$X\sim N(40,9)$이므로 $Z=\dfrac{X-40}{3}$이다.
구하는 확률을 표준화하면
$P(a\le X\le43)$
$=P\left(\dfrac{a-40}{3}\le Z\le1\right)$이다.
표준정규분포는 $0$을 중심으로 좌우 대칭이므로
$P(-1\le Z\le2)=P(-2\le Z\le1)$이다.
따라서 아래쪽 경계가 $-2$여야 한다.
$\dfrac{a-40}{3}=-2$
$a-40=-6$
$a=34$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
양의 상수 $k$에 대하여 연속확률변수 $X$가 갖는 값의 범위는 $0 \le X \le 3k$이고, 확률변수 $X$의 확률밀도함수 $f(x)$가\n$f(x) = \begin{cases} k & (0 \le x \le k) \\ \dfrac{3k-x}{2} & (k \lt x \le 3k) \end{cases}$ \n일 때, $P(k \le X \le 2k)$의 값을 구하면?[4.0점]
~~~

- 원본 선택지: ① $\dfrac{1}{8}$ / ② $\dfrac{1}{4}$ / ③ $\dfrac{3}{8}$ / ④ $\dfrac{1}{2}$ / ⑤ $\dfrac{5}{8}$
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 확률밀도함수의 그래프와 $x$축 사이의 전체 넓이는 $1$이다. $0\le x\le k$에서는 높이가 $k$, 폭이 $k$인 직사각형이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: [0,k] 사각형 넓이 k², (k,3k] 삼각형 넓이 k²여서 k²=1/2. [k,2k] 사다리꼴 높이 k,k/2, 폭 k의 넓이3k²/4=3/8이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q11-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률밀도함수의 그래프와 $x$축 사이의 전체 넓이는 $1$이다.
$0\le x\le k$에서는 높이가 $k$, 폭이 $k$인 직사각형이다.
넓이 $=k\times k=k^2$이다.
$k<x\le3k$에서는 높이가 $k$에서 $0$으로 줄어드는 삼각형이다.
넓이 $=\dfrac12\times2k\times k=k^2$이다.
따라서 $k^2+k^2=1$이므로 $k^2=\dfrac12$이다.
이제 $k\le x\le2k$ 구간은 사다리꼴이다.
$f(k)=k,\quad f(2k)=\dfrac{3k-2k}{2}=\dfrac k2$이다.
구하는 확률은 그 사다리꼴의 넓이이므로
$P(k\le X\le2k)=\dfrac12\left(k+\dfrac k2\right)\times k$
$=\dfrac{3k^2}{4}=\dfrac34\times\dfrac12=\dfrac38$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
모집단의 확률변수 $X$는 자연수 $m$에 대하여 정규분포 $N(m, 4^2)$을 따르고 다음 조건을 만족시킨다.
<div class="question-table-wrap">
<table class="question-table">
<tbody>
<tr><td>(가) $P(X \ge 11) \le P(X \le 16)$</td></tr>
<tr><td>(나) $P(X \le 15) \le P(X \ge 10)$</td></tr>
</tbody>
</table>
</div>
이 모집단에서 크기가 $36$인 표본을 임의추출하여 구한 표본평균을 $\overline{X_1}$, 크기가 $4$인 표본을 임의추출하여 구한 표본평균을 $\overline{X_2}$라 할 때, $P(\overline{X_1} \le m-1) + P(\overline{X_2} \ge 27-m)$의 값을 오른쪽 표준정규분포표를 이용하여 구하면?[4.1점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>0.5</td><td>0.1915</td></tr>
<tr><td>1.0</td><td>0.3413</td></tr>
<tr><td>1.5</td><td>0.4332</td></tr>
<tr><td>2.0</td><td>0.4772</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: ① 0.3753 / ② 0.4328 / ③ 0.5328 / ④ 0.6170 / ⑤ 0.6826
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 정규분포는 평균 $m$에 대해 좌우 대칭이다. (가)에서 $P(X\ge11)=P(X\le2m-11)$이므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 평균 m 대칭의 (가)는 2m−11≤16→m≤13.5, (나)는 15≤2m−10→m≥12.5, 자연수 m13. 크기36 평균 z=-1.5 꼬리0.0668, 크기4 평균 상한14 z0.5 꼬리0.3085, 합0.3753이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q12-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
정규분포는 평균 $m$에 대해 좌우 대칭이다.
(가)에서 $P(X\ge11)=P(X\le2m-11)$이므로
$P(X\le2m-11)\le P(X\le16)$
$2m-11\le16,\quad m\le13.5$이다.
(나)에서 $P(X\ge10)=P(X\le2m-10)$이므로
$P(X\le15)\le P(X\le2m-10)$
$15\le2m-10,\quad m\ge12.5$이다.
$m$은 자연수이므로 $m=13$이다.
첫 번째 표본평균의 표준편차는 $\dfrac4{\sqrt{36}}=\dfrac23$이다.
$P(\overline X_1\le m-1)=P\left(Z\le\dfrac{-1}{\frac{2}{3}}\right)$
$=P(Z\le-1.5)=0.5-0.4332=0.0668$이다.
두 번째 표본평균의 표준편차는 $\dfrac4{\sqrt4}=2$이다.
$27-m=14$이므로
$P(\overline X_2\ge14)=P\left(Z\ge\dfrac{14-13}{2}\right)$
$=P(Z\ge0.5)=0.5-0.1915=0.3085$이다.
따라서 두 확률의 합은
$0.0668+0.3085=0.3753$이므로 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
모집단의 확률변수 $X$의 확률질량함수가\n$P(X=x) = \dfrac{k}{3}x$ ($x=3, 6, 9$)\n이다. 이 모집단에서 크기가 $5$인 표본을 임의추출 할 때, 표본평균 $\overline{X}$에 대하여 $V(\overline{X})$의 값은? (단, $k$는 상수이다.)[4.2점]
~~~

- 원본 선택지: ① 1 / ② 2 / ③ 3 / ④ 4 / ⑤ 5
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 확률의 합이 $1$이므로 $\dfrac k3\cdot3+\dfrac k3\cdot6+\dfrac k3\cdot9=1$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: P(X=3,6,9)=k,2k,3k로 k1/6; 평균7, 제곱평균54, 분산5, 표본평균 크기5의 분산1이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률의 합이 $1$이므로
$\dfrac k3\cdot3+\dfrac k3\cdot6+\dfrac k3\cdot9=1$
$k+2k+3k=1,\quad k=\dfrac16$이다.
따라서 $X=3,6,9$의 확률은 차례로 $\dfrac16,\dfrac13,\dfrac12$이다.
$E(X)=3\cdot\dfrac16+6\cdot\dfrac13+9\cdot\dfrac12$
$=\dfrac12+2+\dfrac92=7$이다.
$E(X^2)=3^2\cdot\dfrac16+6^2\cdot\dfrac13+9^2\cdot\dfrac12$
$=\dfrac32+12+\dfrac{81}{2}=54$이다.
모분산은 $V(X)=54-7^2=5$이다.
표본의 크기가 $5$이므로
$V(\overline X)=\dfrac{V(X)}5=\dfrac55=1$이다.
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 고등학교에서 임의로 $n$명을 추출하여 키를 조사하였더니 평균은 $163\text{cm}$, 표준편차는 $3\text{cm}$였다. 모집단이 정규분포를 따를 때, 신뢰도 $95\%$로 모평균을 추정하면 신뢰구간이 $162\text{cm}$ 이상이고 $164\text{cm}$ 이하라 한다. 자연수 $n$의 값을 구하면?[4.2점]\n(단, $n \gt 30$ 이고, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0 \le Z \le 2.0)=0.475$ 로 계산한다.)
~~~

- 원본 선택지: ① 81 / ② 64 / ③ 36 / ④ 16 / ⑤ 4
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 신뢰구간은 $[162,164]$이고 중심은 표본평균 $163$이다. 따라서 오차의 한계는 $164-163=1$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 표본평균163의 95% 오차한계1, 제공 표 z2.0을 사용해 2×3/√n=1→n36. 문제의 n>30도 충족한다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
신뢰구간은 $[162,164]$이고 중심은 표본평균 $163$이다.
따라서 오차의 한계는 $164-163=1$이다.
표준정규분포표에서 $P(0\le Z\le2)=0.475$이므로 신뢰도 $95\%$에 해당하는 신뢰상수는 $2$이다.
오차의 한계 식은
$2\times\dfrac3{\sqrt n}=1$이다.
$\dfrac6{\sqrt n}=1$
$\sqrt n=6$
$n=36$이다.
또한 $n=36>30$이므로 주어진 조건을 만족한다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
확률변수 $X$에 대하여 $E(X)=a$, $E(X^2)=6a+7$일 때, 확률변수 $Y=\dfrac{1}{2}X+1$에 대하여 $\sigma(Y)$의 최댓값을 구하면?[4.3점]
~~~

- 원본 선택지: ① 1 / ② 2 / ③ 3 / ④ 4 / ⑤ 5
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 분산은 제곱의 평균에서 평균의 제곱을 뺀 값이다. $V(X)=E(X^2)-\{E(X)\}^2$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: E(X²)=6a+7,E(X)=a로 V(X)=−(a−3)²+16≤16. Y=X/2+1의 표준편차 최대 (1/2)√16=2다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q15-solution.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
분산은 제곱의 평균에서 평균의 제곱을 뺀 값이다.
$V(X)=E(X^2)-\{E(X)\}^2$
$=(6a+7)-a^2$
$=-(a-3)^2+16$이다.
$(a-3)^2\ge0$이므로 $V(X)\le16$이고 $a=3$일 때 최대이다.
$Y=\dfrac12X+1$이므로 표준편차의 성질에 따라
$\sigma(Y)=\left|\dfrac12\right|\sigma(X)$
$=\dfrac12\sqrt{V(X)}$
$\le\dfrac12\sqrt{16}=2$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
흰 공 $6$개, 검은 공 $a$개가 들어 있는 주머니에서 한 개의 공을 꺼내어 색깔을 확인하고 다시 넣는 시행을 $n$번 반복할 때, 검은 공이 나오는 횟수를 확률변수 $X$라 하면, $X-15$의 평균은 $40$이고, 분산은 $30$이다. 이때, $a+n$의 값을 구하면? (단, $a, n$은 상수이다.)[4.3점]
~~~

- 원본 선택지: ① 126 / ② 127 / ③ 128 / ④ 129 / ⑤ 130
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 공을 뽑은 뒤 다시 넣으므로 검은 공이 나오는 횟수는 이항분포를 따른다. 검은 공이 나올 확률을 $p=\dfrac{a}{a+6}$이라 두면 $X\sim B(n,p)$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 복원추출 검은공 성공확률 a/(a+6), E(X)=55,V(X)=30이라 1−p=30/55=6/11,p5/11. a5,n121로 a+n126이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
공을 뽑은 뒤 다시 넣으므로 검은 공이 나오는 횟수는 이항분포를 따른다.
검은 공이 나올 확률을 $p=\dfrac{a}{a+6}$이라 두면 $X\sim B(n,p)$이다.
평균 조건에서
$E(X-15)=np-15=40$
$np=55$이다.
상수를 빼도 분산은 같으므로
$V(X-15)=V(X)=np(1-p)=30$이다.
$np=55$를 대입하면
$55(1-p)=30$
$1-p=\dfrac6{11},\quad p=\dfrac5{11}$이다.
$\dfrac{a}{a+6}=\dfrac5{11}$이므로
$11a=5a+30$
$6a=30,\quad a=5$이다.
$np=55$에서
$n=55\div\dfrac5{11}=121$이다.
따라서 $a+n=5+121=126$이므로 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 공장에서 생산되는 나사못 $1$개의 길이는 평균이 $3\text{cm}$, 표준편차가 $\sigma\text{cm}$인 정규분포를 따른다고 한다. 이 공장에서 생산된 나사못 중에서 길이가 $2.98\text{cm}$ 이하이거나 $3.02\text{cm}$ 이상인 나사못은 불량으로 판정한다. 이 공장에서 생산된 나사못 중에서 임의로 선택한 나사못 $1$개가 불량일 확률을 오른쪽 표준정규분포표를 이용하여 구한 값이 $0.0456$일 때, $\sigma$의 값을 구하면?[4.4점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>0.5</td><td>0.1915</td></tr>
<tr><td>1.0</td><td>0.3413</td></tr>
<tr><td>1.5</td><td>0.4332</td></tr>
<tr><td>2.0</td><td>0.4772</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: ① 0.05 / ② 0.04 / ③ 0.03 / ④ 0.02 / ⑤ 0.01
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 길이를 $X$라 하면 $X\sim N(3,\sigma^2)$이다. 불량 구간은 $X\le2.98$ 또는 $X\ge3.02$로 평균 $3$을 중심으로 대칭이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 평균3을 중심으로 양쪽 불량 꼬리 합0.0456이면 각 꼬리0.0228, 표 z2. 따라서 0.02/σ=2, σ0.01이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q17-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
길이를 $X$라 하면 $X\sim N(3,\sigma^2)$이다.
불량 구간은 $X\le2.98$ 또는 $X\ge3.02$로 평균 $3$을 중심으로 대칭이다.
따라서 한쪽 꼬리 확률은
$\dfrac{0.0456}{2}=0.0228$이다.
$P(X\ge3.02)=0.0228$이므로
$P\left(Z\ge\dfrac{3.02-3}{\sigma}\right)=0.0228$이다.
표에서 $P(0\le Z\le2)=0.4772$이므로
$P(Z\ge2)=0.5-0.4772=0.0228$이다.
따라서 $\dfrac{0.02}{\sigma}=2$이다.
$0.02=2\sigma,\quad\sigma=0.01$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
25명을 채용하는 어느 회사의 입사시험에 1000명이 지원하였다. 이 입사시험의 성적은 정규분포를 이루고, 1000명의 입사시험 성적은 각각 $x_1, x_2, x_3, \dots, x_{1000}$이다.
$\dfrac{1}{1000}\sum_{i=1}^{1000} x_i = 60$, $\dfrac{1}{1000}\sum_{i=1}^{1000} (x_i - 60)^2 = 100$ 일 때, 이 회사의 입사시험에 합격한 지원자의 입사시험 성적의 최솟값을 오른쪽 표준정규분포표를 이용하여 구한 것은? (단, 입사시험 성적의 동점자는 없다.)[4.4점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>1.53</td><td>0.4370</td></tr>
<tr><td>1.96</td><td>0.4750</td></tr>
<tr><td>2.54</td><td>0.4945</td></tr>
<tr><td>2.75</td><td>0.4970</td></tr>
<tr><td>3.08</td><td>0.4990</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: ① 60.53 / ② 71.96 / ③ 72.54 / ④ 79.6 / ⑤ 89.56
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 주어진 식에서 전체 성적의 평균은 $\overline x=\dfrac1{1000}\sum_{i=1}^{1000}x_i=60$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 주어진 전원 성적 평균60, 분산100에서 σ10, 합격25/1000 상위2.5% 지점 z1.96. 기준점60+1.96×10=79.6이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q18-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
주어진 식에서 전체 성적의 평균은
$\overline x=\dfrac1{1000}\sum_{i=1}^{1000}x_i=60$이다.
분산은 $\dfrac1{1000}\sum_{i=1}^{1000}(x_i-60)^2=100$이므로 표준편차는 $10$이다.
합격자는 $1000$명 중 상위 $25$명이므로 합격 비율은
$\dfrac{25}{1000}=0.025$이다.
합격 최저점을 $c$라 하면
$P(X\ge c)=0.025$이다.
$Z=\dfrac{X-60}{10}$으로 표준화하면
$P\left(Z\ge\dfrac{c-60}{10}\right)=0.025$이다.
$P(0\le Z\le1.96)=0.4750$이므로 $P(Z\ge1.96)=0.025$이다.
$\dfrac{c-60}{10}=1.96$
$c-60=19.6,\quad c=79.6$이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 조건부확률.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
숫자 $1, 3, 5, 7$의 숫자가 하나씩 적혀 있는 $4$개의 공이 들어 있는 주머니와 한 개의 주사위를 사용하여 다음 시행을 한다. 한 개의 주사위를 던져서 짝수의 눈이 나오면 주머니에서 두 개의 공을 동시에 꺼내어 공에 적혀 있는 두 수를 합하여 기록하고, 홀수의 눈이 나오면 주머니에서 두 개의 공을 동시에 꺼내어 공에 적혀 있는 두 수 중 작은 수를 기록한다. 위의 시행을 $2$번 반복하여 기록한 두 수의 평균을 $\overline{X}$라 할 때, $P(\overline{X}=3)$의 값을 구하면?[4.5점] (단, 각 시행에서 꺼낸 공은 주머니에 다시 넣는다.)
~~~

- 원본 선택지: ① $\dfrac{1}{144}$ / ② $\dfrac{1}{72}$ / ③ $\dfrac{1}{48}$ / ④ $\dfrac{1}{36}$ / ⑤ $\dfrac{5}{72}$
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 한 번 시행하여 기록한 수를 $Y$라 하자. 짝수 눈일 확률과 홀수 눈일 확률은 각각 $\dfrac12$이고, 공 두 개의 조합은 $\binom42=6$가지이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 홀수 주사위에서는 뽑은 두 수의 최솟값1,3,5 각각 3,2,1/6, 짝수에서는 합4,6,8,10,12. 각 시행의 Y=1,3,5 확률1/4,1/6,1/12; 평균3이 되려면 두 번 합6의 (1,5),(3,3),(5,1), 합5/72다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 번 시행하여 기록한 수를 $Y$라 하자.
짝수 눈일 확률과 홀수 눈일 확률은 각각 $\dfrac12$이고, 공 두 개의 조합은 $\binom42=6$가지이다.
짝수 눈이면 두 수의 합을 기록한다. 여섯 쌍의 합은
$4,\ 6,\ 8,\ 8,\ 10,\ 12$이다.
홀수 눈이면 작은 수를 기록한다. 여섯 쌍의 작은 수는
$1,\ 1,\ 1,\ 3,\ 3,\ 5$이다.
따라서 구하는 확률에 필요한 값은
$P(Y=1)=\dfrac12\times\dfrac36=\dfrac14$
$P(Y=3)=\dfrac12\times\dfrac26=\dfrac16$
$P(Y=5)=\dfrac12\times\dfrac16=\dfrac1{12}$이다.
두 번의 기록을 $Y_1,Y_2$라 하면
$\overline X=3\ \Longleftrightarrow\ Y_1+Y_2=6$이다.
가능한 순서쌍은 $(1,5),(3,3),(5,1)$뿐이다.
두 시행은 서로 독립이므로
$P(\overline X=3)=\dfrac14\cdot\dfrac1{12}+\dfrac16\cdot\dfrac16+\dfrac1{12}\cdot\dfrac14$
$=\dfrac1{48}+\dfrac1{36}+\dfrac1{48}$
$=\dfrac3{72}+\dfrac2{72}=\dfrac5{72}$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q20 — KEEP

- qid/source ordinal: `20`/20; sourceQid: `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
모집단의 확률변수 $X$가 평균이 $m$, 표준편차가 $\dfrac{1}{5.88}$인 정규분포를 따른다. 이 모집단에서 크기가 $n$인 표본을 임의추출하여 구한 표본평균을 이용하여 모평균 $m$에 대한 신뢰도 $95\%$의 신뢰구간을 구하면 $a \le m \le b$이다. $f(n)=b-a$라 할 때, $n$에 대한 부등식 $f(n) \ge \dfrac{2}{3k}$을 만족시키는 자연수 $n$의 최댓값을 $M$이라 하자. 확률변수 $Y$가 이항분포 $B\left(M, \dfrac{1}{3}\right)$을 따를 때, $E(Y^2)=11$이다. $k$의 값을 구하면? (단, $k$는 자연수이고, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \le 1.96)=0.95$ 로 계산한다.)[4.5점]
~~~

- 원본 선택지: ① 1 / ② 3 / ③ 5 / ④ 7 / ⑤ 9
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 모표준편차가 $\sigma=\dfrac1{5.88}$이므로 신뢰도 $95\%$의 신뢰구간 길이는 $f(n)=2\times1.96\times\dfrac{\sigma}{\sqrt n}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 95% 구간 폭 f(n)=2×1.96/(5.88√n)=2/(3√n), f(n)≥2/(3k)는 n≤k², 최대 M=k². Y~B(M,1/3)의 제곱평균 (M²+2M)/9=11에서 M9,k3이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모표준편차가 $\sigma=\dfrac1{5.88}$이므로 신뢰도 $95\%$의 신뢰구간 길이는
$f(n)=2\times1.96\times\dfrac{\sigma}{\sqrt n}$
$=\dfrac{3.92}{5.88\sqrt n}$
$=\dfrac2{3\sqrt n}$이다.
주어진 부등식에 대입하면
$\dfrac2{3\sqrt n}\ge\dfrac2{3k}$
$\sqrt n\le k,\quad n\le k^2$이다.
$k$는 자연수이므로 가능한 자연수 $n$의 최댓값은 $M=k^2$이다.
$Y\sim B\left(M,\dfrac13\right)$에서
$E(Y)=\dfrac M3,\quad V(Y)=\dfrac{2M}{9}$이다.
$E(Y^2)=V(Y)+\{E(Y)\}^2$를 이용하면
$11=\dfrac{2M}{9}+\dfrac{M^2}{9}$
$M^2+2M-99=0$
$(M+11)(M-9)=0$이다.
$M$은 자연수이므로 $M=9$이다.
$k^2=9,\ k>0$에서 $k=3$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q21 — KEEP

- qid/source ordinal: `21`/21; sourceQid: `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[주관식1 (서술형)] 어느 도서관에서 보유한 도서 현황을 조사하였더니 전체 도서의 $20\%$가 종교 도서였다. 이 도서관에서 보유한 도서 400권을 임의로 택하였을 때, 종교 도서가 92권 이상일 확률을 구하는 풀이 과정을 자세히 서술하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0 \le Z \le z)$는 아래 표의 값을 이용한다.)[6점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>0.5</td><td>0.1915</td></tr>
<tr><td>1.0</td><td>0.3413</td></tr>
<tr><td>1.5</td><td>0.4332</td></tr>
<tr><td>2.0</td><td>0.4772</td></tr>
<tr><td>2.5</td><td>0.4938</td></tr>
<tr><td>3.0</td><td>0.4987</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **0.0668**
- 기존 solution **정확 발췌**:

> 400권 중 종교 도서의 권수를 $X$라 하자. 종교 도서를 고를 확률이 $0.2$이므로 $X\sim B(400,0.2)$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 400권의 종교도서 수 B(400,0.2)로 μ80,σ8. 92권 이상은 연속성 보정 없는 z1.5의 오른꼬리0.5−0.4332=0.0668이다. 원본문항과 해설은 근사를 사용한다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q21-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
400권 중 종교 도서의 권수를 $X$라 하자.
종교 도서를 고를 확률이 $0.2$이므로 $X\sim B(400,0.2)$이다.
평균과 분산을 계산하면
$E(X)=400\times0.2=80$
$V(X)=400\times0.2\times0.8=64$이다.
따라서 표준편차는 $\sqrt{64}=8$이다.
시행 횟수가 충분히 크므로 이항분포를 평균 $80$, 표준편차 $8$인 정규분포로 근사한다.
$P(X\ge92)$
$\approx P\left(Z\ge\dfrac{92-80}{8}\right)$
$=P(Z\ge1.5)$이다.
주어진 표에서 $P(0\le Z\le1.5)=0.4332$이므로
$P(Z\ge1.5)=0.5-0.4332=0.0668$이다.
따라서 구하는 확률은 약 $0.0668$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q22 — KEEP

- qid/source ordinal: `22`/22; sourceQid: `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[주관식2 (서술형)] 어느 게임에서는 한 개의 주사위를 던져서 $4$의 약수의 눈이 나오면 $2$점을 얻고, $4$의 약수가 아닌 눈이 나오면 $4$점을 얻는다. 한 개의 주사위를 400번 던져서 얻은 점수가 1160점 이상일 확률을 구하는 과정을 자세히 서술하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0 \le Z \le 2)=0.4772$로 계산한다.)[7점]
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **0.9772**
- 기존 solution **정확 발췌**:

> 주사위의 눈 중 $4$의 약수는 $1,2,4$이고, 약수가 아닌 눈은 $3,5,6$이다. 약수가 아닌 눈이 나올 확률은 $\dfrac36=\dfrac12$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 4의 약수가 아닌 주사위 눈 확률1/2, 횟수 X~B(400,.5). 총점 800+2X≥1160이면 X≥180; 근사 μ200,σ10에서 z≥−2라 확률0.9772다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q22-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
주사위의 눈 중 $4$의 약수는 $1,2,4$이고, 약수가 아닌 눈은 $3,5,6$이다.
약수가 아닌 눈이 나올 확률은 $\dfrac36=\dfrac12$이다.
400번 중 약수가 아닌 눈이 나온 횟수를 $X$라 하면
$X\sim B\left(400,\dfrac12\right)$이다.
약수의 눈은 $2$점, 약수가 아닌 눈은 $4$점이므로 전체 점수는
$2(400-X)+4X=800+2X$이다.
$800+2X\ge1160$
$2X\ge360$
$X\ge180$이다.
$X$의 평균과 표준편차는
$E(X)=400\times\dfrac12=200$
$\sigma(X)=\sqrt{400\times\dfrac12\times\dfrac12}=10$이다.
시행 횟수가 충분히 커서 정규분포로 근사하면
$P(X\ge180)\approx P\left(Z\ge\dfrac{180-200}{10}\right)$
$=P(Z\ge-2)$이다.
대칭성을 이용하면
$P(Z\ge-2)=0.5+P(0\le Z\le2)$
$=0.5+0.4772=0.9772$이다.
따라서 구하는 확률은 약 $0.9772$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q23 — KEEP

- qid/source ordinal: `23`/23; sourceQid: `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `50f8dfeda14bc837c8d155bbd20bbea0adddde42`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[주관식3 (서술형)] 어느 고등학교 2학년의 수학 점수는 표준편차가 6점인 정규분포를 따른다고 한다. 이 학교 2학년 학생 중에서 36명을 임의추출하여 2학년 전체의 수학 점수 평균 $m$을 신뢰도 $90\%$로 추정한 신뢰구간을 $a \le m \le b$이고, 신뢰도 $s\%$로 추정하면 신뢰구간을 $c \le m \le d$라 할 때, $5(b-a) \ge 16(d-c)$를 만족시키는 실수 $s$의 최댓값을 표준정규분포표를 이용하여 구하고 그 과정을 자세히 서술하시오.[7점]
<div class="question-table-wrap">
<table class="question-table">
<thead>
<tr><th>$z$</th><th>$P(0 \le Z \le z)$</th></tr>
</thead>
<tbody>
<tr><td>0.3</td><td>0.13</td></tr>
<tr><td>0.5</td><td>0.19</td></tr>
<tr><td>1</td><td>0.341</td></tr>
<tr><td>1.6</td><td>0.45</td></tr>
<tr><td>1.9</td><td>0.475</td></tr>
</tbody>
</table>
</div>
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **38**
- 기존 solution **정확 발췌**:

> 모표준편차는 $6$, 표본의 크기는 $36$이므로 $\dfrac{\sigma}{\sqrt n}=\dfrac6{\sqrt{36}}=1$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: n36, 모σ6에서 표본평균 표준오차1. 제공 표의 90% 양측 임계값 z1.6으로 첫 구간 폭3.2; 5×3.2≥16×2zs에서 zs≤0.5. 표에서 P(0≤Z≤.5)=.19, 최대 신뢰도 s=38이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q23-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모표준편차는 $6$, 표본의 크기는 $36$이므로
$\dfrac{\sigma}{\sqrt n}=\dfrac6{\sqrt{36}}=1$이다.
신뢰도 $90\%$일 때 양쪽 꼬리 확률의 합은 $0.1$이고
$P(0\le Z\le z_{90})=\dfrac{0.9}{2}=0.45$이다.
표에서 $z_{90}=1.6$을 얻는다.
따라서 첫 신뢰구간의 길이는
$b-a=2\times1.6\times1=3.2$이다.
신뢰도 $s\%$에 해당하는 양의 신뢰상수를 $z_s$라 하면 두 번째 신뢰구간의 길이는
$d-c=2z_s\times1=2z_s$이다.
주어진 조건에 대입하면
$5(b-a)\ge16(d-c)$
$5\times3.2\ge16\times2z_s$
$16\ge32z_s$
$z_s\le0.5$이다.
신뢰도는 $z_s$가 클수록 커지므로 최댓값은 $z_s=0.5$일 때 얻는다.
표에서 $P(0\le Z\le0.5)=0.19$이므로
$\dfrac{s}{100}=P(-0.5\le Z\le0.5)=2\times0.19=0.38$이다.
따라서 $s$의 최댓값은 $38$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

## 2. 이미지·정답·후속 게이트

- 고유 원본문제 PNG 2개 모두 확인: `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q4.png`, `assets/images/24_매산여고_2학기_기말_고2_확률과통계/q10.png`.
- 그림 참조 총 2회, 모든 이미지의 원본 graph/table/text와 문제 사용처의 계산을 육안 재검산했다.
- 원문 선택지 ①~⑤와 정답 인덱스, 주관식 값, 기존 해설 계산을 모두 대조. KEEP 23; UPGRADE 0; UNREAD 0.
- **운영 출고 전 미실행 항목:** 기존 solutionImage SVG 렌더, 학생 화면 Golden/Negative, 소스 PDF의 인쇄 원본 대조, 개정과정 교차검증, 배포 승인. 이 MD와 독립 검산은 프로덕션 PASS 판정이 아니다.
- 원본 JS/이미지/정답/선택지/기존 해설/SVG 변경 없음. GitHub 전용 브랜치 MD만 생성 예정.
