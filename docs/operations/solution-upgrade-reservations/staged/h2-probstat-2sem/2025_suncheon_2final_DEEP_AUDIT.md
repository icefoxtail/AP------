# 고2 확률과 통계 2학기 기말 — 25_순천고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 첫 묶음(최신 연도순 5장) · 2026-11-22 KST. **학생용 해설 감사·수정안 MD 초안**이며 원본 JS 수정·운영 출고 PASS·Golden/Negative 완료를 의미하지 않는다.

## 0. 시험지 고정 정보

- 전용 라인: lane40 · 고2 확률과 통계 · 2학기 기말 원본(최신 연도에서 과거 연도 순).
- 시험지: 25_순천고_2학기_기말_고2_확률과통계
- 원본 JS: `archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js`
- 원본 ref: `main`; Git blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`
- 원본 sourcePdf 메타데이터: `2025_순천고2_확통_2기말.pdf`; PDF와 원문 대조는 NOT_RUN.
- 총 문항/전수 분모: **24문항 (Q01~Q24)**; 원본 content·choices·answer·solution 전문 모두 읽고 독립 수학 검산.
- MD 저장 경로: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_suncheon_2final_DEEP_AUDIT.md`; 전용 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 PNG: **고유 8개, 문항별 8회 참조**, 전부 실제 다운로드 및 그래프·표·수직선 육안 판독. 이미지를 새로 제작하거나 원본을 변경하지 않음.
- 기존 풀이 SVG: **11문항**에서 경로 메타데이터 확인, 별도 SVG 렌더·학생 화면 QA **NOT_RUN**.
- 감사 방법: 원격 원본 JSON 정적 추출(시험 스크립트 미실행), 직접 그림 실물 대조, 확률분포/조합/조건부확률/표본평균/추정의 수치별 재계산, 보기·정답·해설 전문 일치 확인. 정규근사 문항은 문제에서 제공한 표와 연속성 보정 생략 관례를 별도로 구별.
- 상태: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 24/24 · KEEP 24 · UPGRADE 0 · UNREAD 0**. 운영 PASS, 골든/네거티브/교육과정 검증의 완료 주장은 하지 않음.
- 현재 cursor: `next_qid=NONE`, `UNREAD=[]`.

## 1. Q01~Q24 실제 원문·독립 수학 검산·판정

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
한 개의 주사위를 90번 던져 6의 약수의 눈이 나오는 횟수를 확률변수 X라고 할 때, 확률변수 X^2의 평균 E(X^2)은? [3.4점]
~~~

- 원본 선택지: ① 1640 / ② 1660 / ③ 3580 / ④ 3620 / ⑤ 3640
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 한 번 던져 6의 약수가 나올 확률을 먼저 구한다. $6$의 약수: $1,\,2,\,3,\,6$ (4개)

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 주사위6의 약수 1,2,3,6으로 성공확률2/3, X~B(90,2/3). μ60, V20이므로 E(X²)=60²+20=3620이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 번 던져 6의 약수가 나올 확률을 먼저 구한다.
$6$의 약수: $1,\,2,\,3,\,6$ (4개)
$p=\dfrac{4}{6}=\dfrac{2}{3}$, $X\sim B\left(90,\dfrac{2}{3}\right)$

이항분포의 평균과 분산은
$E(X)=np=90\times\dfrac{2}{3}=60$
$V(X)=np(1-p)=90\times\dfrac{2}{3}\times\dfrac{1}{3}=20$

$V(X)=E(X^2)-\{E(X)\}^2$이므로
$E(X^2)=V(X)+\{E(X)\}^2$
$=20+60^2=3620$

따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
서로 다른 두 개의 동전을 동시에 던지는 시행을 반복할 때, 200번 던져 모두 앞면이 나오는 횟수를 확률변수 X라고 하자. 확률변수 Y=2X+3의 평균을 구하면? [3.4점]
~~~

- 원본 선택지: ① 53 / ② 100 / ③ 103 / ④ 200 / ⑤ 203
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 두 동전을 한 번에 던질 때 모두 앞면이 나올 확률은 $p=\dfrac{1}{2}\times\dfrac{1}{2}=\dfrac{1}{4}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 서로 다른 공정동전 2개가 모두 앞면일 확률1/4, 200회 성공수의 평균50. E(2X+3)=103이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
두 동전을 한 번에 던질 때 모두 앞면이 나올 확률은
$p=\dfrac{1}{2}\times\dfrac{1}{2}=\dfrac{1}{4}$

이 시행을 200번 반복하므로
$X\sim B\left(200,\dfrac{1}{4}\right)$
$E(X)=200\times\dfrac{1}{4}=50$

$Y=2X+3$에서 평균의 성질을 적용하면
$E(Y)=E(2X+3)$
$=2E(X)+3$
$=2\times50+3=103$

따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
정규분포 N(60, 3^2)을 따르는 모집단에서 크기가 36인 표본을 임의추출할 때, 표본평균 X̄는 정규분포 N(a, b^2)을 따른다. 이때 ab의 값은? (단, b>0) [3.4점]
~~~

- 원본 선택지: ① 30 / ② 32 / ③ 35 / ④ 36 / ⑤ 40
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 모집단이 $N(60,3^2)$을 따르고 표본의 크기는 $n=36$이다. 표본평균의 평균과 표준편차는

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: N(60,3²) 모집단의 크기36 표본평균은 μ60,σ=3/6=1/2이며 ab=60×1/2=30이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모집단이 $N(60,3^2)$을 따르고 표본의 크기는 $n=36$이다.
표본평균의 평균과 표준편차는
$E(\bar X)=60$
$\sigma_{\bar X}=\dfrac{3}{\sqrt{36}}=\dfrac{1}{2}$

따라서 표본평균의 분포는
$\bar X\sim N\left(60,\left(\dfrac{1}{2}\right)^2\right)$

$N(a,b^2)$과 비교하면 $a=60$, $b=\dfrac{1}{2}$이므로
$ab=60\times\dfrac{1}{2}=30$

따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
모집단의 확률변수 X의 확률분포를 표로 나타내면 다음과 같다. 이 모집단에서 크기가 4인 표본을 임의추출할 때, 표본평균 X̄의 분산을 구하면? [3.4점]
~~~

- 원본 선택지: ① 1 / ② 1/2 / ③ 1/4 / ④ 1/8 / ⑤ 1/16
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 확률분포표에서 확률의 합은 $1$이다. $\dfrac{1}{8}+a+\dfrac{1}{8}=1$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표의 X=1,2,3 확률 1/8,a,1/8을 읽었다. a3/4, 평균2, 분산1/4, n4 표본평균의 분산1/16이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q4.png` — 실물 판독 완료.
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률분포표에서 확률의 합은 $1$이다.
$\dfrac{1}{8}+a+\dfrac{1}{8}=1$
$a=\dfrac{3}{4}$

모집단의 평균은
$E(X)=1\times\dfrac{1}{8}+2\times\dfrac{3}{4}+3\times\dfrac{1}{8}=2$

분산은 평균에서 떨어진 거리의 제곱에 확률을 곱해 구한다.
$V(X)=(1-2)^2\times\dfrac{1}{8}$
$\qquad +(2-2)^2\times\dfrac{3}{4}+(3-2)^2\times\dfrac{1}{8}$
$=\dfrac{1}{8}+0+\dfrac{1}{8}=\dfrac{1}{4}$

표본의 크기가 $4$이므로
$V(\bar X)=\dfrac{V(X)}{4}=\dfrac{1}{16}$

따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 공장에서 생산된 통조림의 무게는 표준편차가 5g인 정규분포를 따른다고 한다. 이 회사에서 생산된 통조림 100개를 임의추출하여 무게를 재었더니 평균이 170g이었다. 이 공장에서 생산되는 전체 통조림의 평균 무게 m g의 신뢰도 95%의 신뢰구간은? (단, P(|Z|≤1.96)=0.95) [3.4점]
~~~

- 원본 선택지: ① 166.39≤m≤173.61 / ② 166.42≤m≤173.58 / ③ 168.71≤m≤171.29 / ④ 169.02≤m≤170.98 / ⑤ 169.74≤m≤172.26
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 모표준편차 $\sigma=5$, 표본 크기 $n=100$, 표본평균 $\bar x=170$이다. 95% 신뢰구간의 표준정규분포 값은 $1.96$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 모표준편차5, n100, 95% 오차한계1.96×5/10=0.98이므로 169.02~170.98이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모표준편차 $\sigma=5$, 표본 크기 $n=100$, 표본평균 $\bar x=170$이다.
95% 신뢰구간의 표준정규분포 값은 $1.96$이다.

오차한계는
$1.96\times\dfrac{\sigma}{\sqrt n}$
$=1.96\times\dfrac{5}{10}=0.98$

따라서 모평균 $m$의 신뢰구간은
$170-0.98\le m\le170+0.98$
$169.02\le m\le170.98$

따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
평균이 m이고 표준편차가 3인 정규분포를 따르는 모집단에서 크기가 81인 표본을 임의추출하여 얻은 표본평균을 이용하여 구한 모평균 m에 대한 신뢰도 99%의 신뢰구간이 2.14≤m≤a이다. a의 값은? (단, Z가 표준정규분포를 따르는 확률변수일 때, P(|Z|≤2.58)=0.99로 계산한다.) [3.6점]
~~~

- 원본 선택지: ① 3.82 / ② 3.86 / ③ 3.9 / ④ 3.94 / ⑤ 3.98
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 99% 신뢰구간은 표본평균을 중심으로 오차한계만큼 양쪽으로 벌어진다. $\sigma=3$, $n=81$, 신뢰도에 대응하는 값은 $2.58$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 99% 오차한계2.58×3/9=0.86, 왼쪽 끝2.14에서 표본평균3.00, 오른끝3.86이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
99% 신뢰구간은 표본평균을 중심으로 오차한계만큼 양쪽으로 벌어진다.
$\sigma=3$, $n=81$, 신뢰도에 대응하는 값은 $2.58$이다.

오차한계는
$e=2.58\times\dfrac{3}{\sqrt{81}}$
$=2.58\times\dfrac{1}{3}=0.86$

구간의 왼쪽 끝이 $\bar x-e=2.14$이므로
$\bar x=2.14+0.86=3.00$

오른쪽 끝은
$a=\bar x+e=3.00+0.86=3.86$

따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 학교 학생들의 하루 공부 평균 시간은 평균이 m분, 표준편차가 5분인 정규분포를 따른다고 한다. 이 학교 학생들 중 100명을 임의추출할 때, 공부 시간의 표본평균을 X̄분이라 하자. P(X̄≥160)=0.0228을 만족시키는 m의 값을 오른쪽 표준정규분포표를 이용하여 구하면? [3.6점]
~~~

- 원본 선택지: ① 150 / ② 154 / ③ 157 / ④ 159 / ⑤ 161
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 표본평균의 분포를 먼저 구한다. $\bar X\sim N\left(m,\left(\dfrac{5}{\sqrt{100}}\right)^2\right)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표 z2.0의 0.4772 확인. 표본평균 표준편차5/10=0.5, 상단꼬리0.0228의 z2이므로 (160−m)/0.5=2, m159다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q7.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q7-solution-v3.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표본평균의 분포를 먼저 구한다.
$\bar X\sim N\left(m,\left(\dfrac{5}{\sqrt{100}}\right)^2\right)$
$\sigma_{\bar X}=\dfrac{5}{10}=0.5$

주어진 확률을 표준화하면
$P(\bar X\ge160)=P\left(Z\ge\dfrac{160-m}{0.5}\right)=0.0228$

표에서 $P(0\le Z\le2)=0.4772$이므로
$P(Z\ge2)=0.5-0.4772=0.0228$
따라서 $\dfrac{160-m}{0.5}=2$이다.

$160-m=2\times0.5=1$
$m=159$

따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
정규분포 N(65, 5^2)을 따르는 모집단에서 크기가 25인 표본을 임의추출할 때, 오른쪽 표준정규분포표를 이용하여 표본평균 X̄가 63 이상 66.5 이하일 확률을 구하면? [3.6점]
~~~

- 원본 선택지: ① 0.53 / ② 0.68 / ③ 0.77 / ④ 0.84 / ⑤ 0.91
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 표본평균의 평균은 $65$, 표준편차는 $\sigma_{\bar X}=\dfrac{5}{\sqrt{25}}=1$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 정규표가 0.5/1/1.5/2.0에 대해 0.19/0.34/0.43/0.48임을 읽었다. 표본평균 N(65,1²), 경계 z=-2,1.5, 확률0.48+0.43=0.91이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q8.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q8-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표본평균의 평균은 $65$, 표준편차는
$\sigma_{\bar X}=\dfrac{5}{\sqrt{25}}=1$이다.
$\bar X\sim N(65,1^2)$

양 끝값을 각각 표준화한다.
$63\ \rightarrow\ \dfrac{63-65}{1}=-2$
$66.5\ \rightarrow\ \dfrac{66.5-65}{1}=1.5$

구하는 확률은
$P(63\le\bar X\le66.5)=P(-2\le Z\le1.5)$
$=P(0\le Z\le2)+P(0\le Z\le1.5)$
$=0.48+0.43=0.91$

따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
4개의 동전을 동시에 던질 때, 앞면의 개수를 확률변수 X라 하자. 확률변수 Y=aX+b의 평균이 4, 표준편차가 1일 때, 상수 a, b의 값은? (단, a>0) [3.8점]
~~~

- 원본 선택지: ① a=1, b=-2 / ② a=1, b=2 / ③ a=1, b=0 / ④ a=2, b=0 / ⑤ a=2, b=1
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 동전 4개 중 앞면의 개수는 $X\sim B\left(4,\dfrac{1}{2}\right)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: X~B(4,1/2)의 평균2, 표준편차1. Y=aX+b의 표준편차1 및 a>0에서 a1, 평균4에서 b2다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
동전 4개 중 앞면의 개수는
$X\sim B\left(4,\dfrac{1}{2}\right)$

이항분포의 평균과 분산은
$E(X)=4\times\dfrac{1}{2}=2$
$V(X)=4\times\dfrac{1}{2}\times\dfrac{1}{2}=1$
$\sigma(X)=\sqrt{1}=1$

$Y=aX+b$, $a>0$이고 $\sigma(Y)=1$이므로
$\sigma(Y)=a\sigma(X)=a=1$

또 $E(Y)=4$이므로
$4=aE(X)+b=1\times2+b$
$b=2$

따라서 $a=1,\ b=2$이므로 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 공장에서 생산되는 제품의 무게는 평균 30g, 표준편차 5g인 정규분포를 따른다고 한다. 이 공장에서는 무게가 40g 이상인 제품을 불량품으로 판정한다. 생산되는 제품 중에서 임의로 2500개를 택할 때, 불량품이 64개 이상일 확률은? [3.8점]
~~~

- 원본 선택지: ① 0.34 / ② 0.16 / ③ 0.07 / ④ 0.03 / ⑤ 0.02
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 제품 한 개의 무게를 $T$라 하면 $T\sim N(30,5^2)$이다. $40$ g 이상일 확률은

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표 z2의 중앙확률0.48 확인. 무게40g 이상은 z≥2로 p0.02, 불량수 B(2500,.02)≈N(50,7²), 64개 이상 z≥2로 약0.02다. 연속성 보정 없는 교과서 근삿값이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q10.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q10-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
제품 한 개의 무게를 $T$라 하면 $T\sim N(30,5^2)$이다.
$40$ g 이상일 확률은
$p=P\left(Z\ge\dfrac{40-30}{5}\right)=P(Z\ge2)$
$=0.5-0.48=0.02$

2500개 중 불량품 수를 $W$라 하면
$W\sim B(2500,0.02)$
$E(W)=2500\times0.02=50$
$V(W)=2500\times0.02\times0.98=49$
$\sigma(W)=7$

이항분포를 정규분포로 근사하여 구하면
$P(W\ge64)\approx P\left(Z\ge\dfrac{64-50}{7}\right)$
$=P(Z\ge2)=0.5-0.48=0.02$

따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
이산확률변수 X가 가지는 값이 0부터 4까지의 정수이고

P(X=x) = |4x-3|/20 (x=0,1,2,3), a (x=4)

일 때, V((1/a)X)의 값은? (단, a는 0이 아닌 상수이다.) [3.8점]
~~~

- 원본 선택지: ① 101 / ② 121 / ③ 141 / ④ 169 / ⑤ 196
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 먼저 각 $x$에 대한 확률을 구하고, 합이 $1$임을 이용한다. $P(X=0)=\dfrac{3}{20}$, $P(X=1)=\dfrac{1}{20}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: x0..3의 확률은 3,1,5,9를 분자로20, x4는2/20. 평균46/20=23/10, 제곱평균134/20=67/10, 분산141/100, 10X 분산141이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
먼저 각 $x$에 대한 확률을 구하고, 합이 $1$임을 이용한다.
$P(X=0)=\dfrac{3}{20}$, $P(X=1)=\dfrac{1}{20}$
$P(X=2)=\dfrac{5}{20}$, $P(X=3)=\dfrac{9}{20}$
$\dfrac{3+1+5+9}{20}+a=1$
$a=\dfrac{1}{10}$, 따라서 $P(X=4)=\dfrac{2}{20}$

평균을 계산하면
$E(X)=\dfrac{0+1+10+27+8}{20}=\dfrac{23}{10}$

제곱의 평균은
$E(X^2)=\dfrac{0+1+20+81+32}{20}=\dfrac{67}{10}$

분산은
$V(X)=E(X^2)-\{E(X)\}^2$
$=\dfrac{67}{10}-\left(\dfrac{23}{10}\right)^2$
$=\dfrac{670-529}{100}=\dfrac{141}{100}$

$\dfrac{1}{a}=10$이므로 분산의 성질을 이용하면
$V\left(\dfrac{1}{a}X\right)=V(10X)=10^2V(X)$
$=100\times\dfrac{141}{100}=141$

따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 공장에서 생산되는 건전지의 수명은 평균이 300시간, 표준편차가 5시간인 정규분포를 따른다고 한다. 이 공장에서 생산된 건전지 중에서 크기가 100인 표본을 임의추출하여 구한 표본평균을 X̄라고 할 때, P(X̄≥a)=0.98을 만족시키는 상수 a의 값은? [3.8점]

(단, P(0≤Z≤2)=0.48)
~~~

- 원본 선택지: ① 295 / ② 299 / ③ 301 / ④ 305 / ⑤ 309
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 모집단의 분포가 $N(300,5^2)$이고 표본 크기가 $100$이므로 $\sigma_{\bar X}=\dfrac{5}{\sqrt{100}}=0.5$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 표본평균 σ=5/√100=0.5, P(평균≥a)=.98는 왼쪽 경계 z=-2에서 성립, a=300−1=299다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q12-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모집단의 분포가 $N(300,5^2)$이고 표본 크기가 $100$이므로
$\sigma_{\bar X}=\dfrac{5}{\sqrt{100}}=0.5$
$\bar X\sim N(300,0.5^2)$

$P(\bar X\ge a)=0.98$이므로 $a$는 평균 $300$보다 작다.
표에서 $P(0\le Z\le2)=0.48$이므로
$P(Z\ge-2)=0.5+0.48=0.98$

따라서 $a$를 표준화한 값은 $-2$이다.
$\dfrac{a-300}{0.5}=-2$
$a-300=-1$
$a=299$

따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
이산확률변수 X의 확률질량함수가 P(X=x)=a/((x+1)(x+2)) (x=1, 2, ..., 10)일 때, P(X>3a)의 값을 구하면? (단, a는 상수이다.) [3.9점]
~~~

- 원본 선택지: ① 1/36 / ② 1/24 / ③ 1/18 / ④ 1/15 / ⑤ 1/10
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 확률질량함수의 전체 확률이 $1$임을 이용한다. 먼저

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: Σ_{x=1}^{10}1/((x+1)(x+2))=1/2−1/12=5/12이므로 a12/5. 3a7.2 초과인 x8,9,10만 합하면 (12/5)(1/9−1/12)=1/15다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률질량함수의 전체 확률이 $1$임을 이용한다.
먼저
$\dfrac{1}{(x+1)(x+2)}=\dfrac{1}{x+1}-\dfrac{1}{x+2}$

$x=1,2,\ldots,10$까지 더하면 중간 항이 소거되어
$\dfrac{1}{2}-\dfrac{1}{12}=\dfrac{5}{12}$
$a\times\dfrac{5}{12}=1$
$a=\dfrac{12}{5}$

$3a=\dfrac{36}{5}=7.2$이므로 $X>3a$는 $X=8,9,10$이다.

$P(X>3a)=a\left(\dfrac{1}{9\cdot10}+\dfrac{1}{10\cdot11}+\dfrac{1}{11\cdot12}\right)$
$=\dfrac{12}{5}\left(\dfrac{1}{9}-\dfrac{1}{12}\right)$
$=\dfrac{12}{5}\times\dfrac{1}{36}=\dfrac{1}{15}$

따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
평균이 m, 표준편차가 σ인 정규분포를 따르는 모집단에서 임의추출한 크기가 n인 표본의 표본평균을 X̄라 하자. 이 모집단의 확률변수를 X라 할 때, 두 확률변수 X, X̄가 다음 조건을 만족시킨다. m+2n의 값은? [4.0점]

(가) P(X≥12)+P(X̄≥12)=1
(나) P(X≥16)+P(X̄≥10)=1
~~~

- 원본 선택지: ① 16 / ② 18 / ③ 20 / ④ 22 / ⑤ 24
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 모집단과 표본평균의 분포는 $X\sim N(m,\sigma^2)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 두 확률의 오른쪽 꼬리 합이1인 (가)에서 m12, (나)에서 4/σ=2√n/σ로 √n2, n4. m+2n=20이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q14-solution.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모집단과 표본평균의 분포는
$X\sim N(m,\sigma^2)$
$\bar X\sim N\left(m,\dfrac{\sigma^2}{n}\right)$

정규분포에서 오른쪽 꼬리확률의 합이 $1$이면 두 표준화 값은 서로 반대이다.

(가) $P(X\ge12)+P(\bar X\ge12)=1$
$\dfrac{12-m}{\sigma}=-\dfrac{12-m}{\sigma/\sqrt n}$
$(12-m)(1+\sqrt n)=0$
$n>0$이므로 $m=12$이다.

(나) $P(X\ge16)+P(\bar X\ge10)=1$
$\dfrac{16-12}{\sigma}=-\dfrac{10-12}{\sigma/\sqrt n}$
$\dfrac{4}{\sigma}=\dfrac{2\sqrt n}{\sigma}$
$\sqrt n=2$, $n=4$

$m+2n=12+2\times4=20$

따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
0≤X≤6에서 정의된 연속확률변수 X의 확률밀도함수 f(x)가 다음과 같다.

f(x)=a(3-x) (0≤x≤3), f(x)=b/3(x-3) (3≤x≤6)

P(0≤X≤3)=3b일 때, a+b의 값을 구하면? [4.0점]
~~~

- 원본 선택지: ① 4/27 / ② 2/9 / ③ 8/27 / ④ 10/27 / ⑤ 4/9
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 확률밀도함수의 그래프는 $0\le x\le3$과 $3\le x\le6$에서 각각 삼각형을 만든다. 왼쪽 삼각형은 밑변이 $3$, 높이가 $f(0)=3a$이므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 왼쪽 삼각형 넓이9a/2, 오른쪽3b/2, 조건9a/2=3b. 합1에서 a4/27,b2/9, 합10/27이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q15-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률밀도함수의 그래프는 $0\le x\le3$과 $3\le x\le6$에서 각각 삼각형을 만든다.

왼쪽 삼각형은 밑변이 $3$, 높이가 $f(0)=3a$이므로
$P(0\le X\le3)=\dfrac{1}{2}\times3\times3a=\dfrac{9a}{2}$
주어진 조건에 따라
$\dfrac{9a}{2}=3b$
$b=\dfrac{3a}{2}$

오른쪽 삼각형은 밑변이 $3$, 높이가 $f(6)=b$이므로
$P(3\le X\le6)=\dfrac{1}{2}\times3\times b=\dfrac{3b}{2}$

전체 확률이 $1$이므로
$\dfrac{9a}{2}+\dfrac{3b}{2}=1$
$\dfrac{9a}{2}+\dfrac{9a}{4}=1$
$\dfrac{27a}{4}=1$, $a=\dfrac{4}{27}$
$b=\dfrac{3}{2}\times\dfrac{4}{27}=\dfrac{2}{9}$

$a+b=\dfrac{4}{27}+\dfrac{6}{27}=\dfrac{10}{27}$

따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
표준편차가 σ인 모집단에서 n개의 표본을 임의추출하여 모평균을 추정할 때, 다음 중 모평균의 신뢰구간은 a≤m≤b이다. 다음 중 b-a의 값이 가장 큰 것은? (단, 신뢰도는 모두 일정하다.) [4.0점]
~~~

- 원본 선택지: ① n=36, σ=2 / ② n=100, σ=10 / ③ n=25, σ=9 / ④ n=81, σ=12 / ⑤ n=100, σ=11
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 신뢰도가 같으면 신뢰구간의 폭은 $b-a=2z\times\dfrac{\sigma}{\sqrt n}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 신뢰도가 같으면 전체 폭은 σ/√n에 비례. 다섯 값은 1/3,1,9/5,4/3,11/10으로 ③(9/5)가 최대다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
신뢰도가 같으면 신뢰구간의 폭은
$b-a=2z\times\dfrac{\sigma}{\sqrt n}$이다.
여기서 $z$는 모든 보기에서 같으므로 $\dfrac{\sigma}{\sqrt n}$가 가장 큰 것을 고른다.

① $\dfrac{2}{\sqrt{36}}=\dfrac{1}{3}$
② $\dfrac{10}{\sqrt{100}}=1$
③ $\dfrac{9}{\sqrt{25}}=\dfrac{9}{5}=1.8$
④ $\dfrac{12}{\sqrt{81}}=\dfrac{4}{3}$
⑤ $\dfrac{11}{\sqrt{100}}=1.1$

가장 큰 값은 ③의 $1.8$이므로 그 신뢰구간의 폭이 가장 크다.

따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 회사에서 생산하는 연필 1개의 무게는 표준편차 8인 정규분포를 따른다고 한다. 이 회사에서 판매하는 연필 중 n개를 임의로 추출하여 얻은 표본평균을 이용하여, 이 회사에서 판매하는 연필 1개의 무게의 평균 m에 대한 신뢰도 95%의 신뢰구간을 구하면 a≤m≤b이다. b-a≤4를 만족시키는 자연수 n의 최솟값은? (단, 무게의 단위는 g이고, Z가 표준정규분포를 따르는 변수일 때, P(|Z|≤1.96)=0.95로 계산한다.) [4.1점]
~~~

- 원본 선택지: ① 62 / ② 63 / ③ 64 / ④ 65 / ⑤ 66
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 95% 신뢰구간의 폭은 $b-a=2\times1.96\times\dfrac{8}{\sqrt n}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 95% 구간 폭2·1.96·8/√n≤4라서 √n≥7.84, n≥61.4656이고 최소 자연수62다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
95% 신뢰구간의 폭은
$b-a=2\times1.96\times\dfrac{8}{\sqrt n}$이다.

폭이 $4$ 이하라는 조건을 적용하면
$2\times1.96\times\dfrac{8}{\sqrt n}\le4$
$\dfrac{31.36}{\sqrt n}\le4$
$\sqrt n\ge7.84$

양변이 양수이므로 제곱하여
$n\ge(7.84)^2=61.4656$

$n$은 자연수이므로 가능한 최솟값은 $62$이다.

따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
어느 빵집에서 만든 소금빵 한 개의 무게는 평균이 200g, 표준편차가 20g인 정규분포를 따른다고 한다. 이 빵집에서 만드는 소금빵 16개씩 임의추출하여 한 상자에 포장하여 판매한다고 한다. 이 빵집에서 포장된 상자 중에서 임의로 두 개의 상자 A, B를 택했을 때, 두 개의 상자 중 한 개만 그 내용량이 3.12kg 이상 3.36kg 이하일 확률을 오른쪽 표준정규분포표를 이용하여 구하면? [4.1점]
~~~

- 원본 선택지: ① 0.1946 / ② 0.2952 / ③ 0.4712 / ④ 0.6814 / ⑤ 0.8186
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 한 상자의 내용량을 $S$ g이라 하자. 소금빵 16개 무게의 합이므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 z표 1.0→0.34,2.0→0.48. 16개 무게 합 N(3200,80²)에서 [3120,3360]은 z[-1,2], p0.82. 서로 독립인 두 상자 중 딱 하나만 p(1−p) 두 경우이므로 2×0.82×0.18=0.2952다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q18.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q18-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 상자의 내용량을 $S$ g이라 하자.
소금빵 16개 무게의 합이므로
$E(S)=16\times200=3200$
$\sigma(S)=\sqrt{16}\times20=80$
$S\sim N(3200,80^2)$

$3.12$ kg부터 $3.36$ kg까지는 $3120$ g부터 $3360$ g까지이다.
두 끝값을 표준화하면
$\dfrac{3120-3200}{80}=-1$
$\dfrac{3360-3200}{80}=2$

한 상자가 이 범위에 들어올 확률을 $p$라 하면
$p=P(-1\le Z\le2)$
$=P(0\le Z\le1)+P(0\le Z\le2)$
$=0.34+0.48=0.82$

두 상자의 내용량은 서로 독립이므로, 두 상자 중 정확히 한 상자만 조건을 만족하는 경우는
(가) A만 만족: $0.82\times0.18$
(나) B만 만족: $0.18\times0.82$

두 경우를 더하면
$2\times0.82\times0.18=0.2952$

따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
정규분포 N(20, 4^2)을 따르는 모집단에서 크기가 4인 표본을 임의추출하여 구한 표본평균을 X̄, 정규분포 N(100, σ^2)을 따르는 모집단에서의 크기가 16인 표본을 임의추출하여 구한 표본평균을 Ȳ라고 하자. P(X̄≤23)+P(Ȳ≤94)=1일 때, P(Ȳ≤110)을 오른쪽 표준정규분포표를 이용하여 구한 것은? [4.2점]
~~~

- 원본 선택지: ① 0.9938 / ② 0.9772 / ③ 0.9332 / ④ 0.8664 / ⑤ 0.8413
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 두 표본평균의 분포부터 구한다. $\bar X\sim N\left(20,\left(\dfrac{4}{\sqrt4}\right)^2\right)=N(20,2^2)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표 z1.5→0.4332,z2.5→0.4938. X̄~N(20,2²)에서 P(X̄≤23)=0.9332, Ȳ에서 P(≤94)=0.0668→z=-1.5; σY=16, 표본평균 σ4. P(Ȳ≤110)=Φ(2.5)=0.9938이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q19.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q19-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
두 표본평균의 분포부터 구한다.
$\bar X\sim N\left(20,\left(\dfrac{4}{\sqrt4}\right)^2\right)=N(20,2^2)$
$\bar Y\sim N\left(100,\left(\dfrac{\sigma}{\sqrt{16}}\right)^2\right)=N\left(100,\left(\dfrac{\sigma}{4}\right)^2\right)$

먼저 주어진 첫 번째 확률은
$P(\bar X\le23)=P\left(Z\le\dfrac{23-20}{2}\right)$
$=P(Z\le1.5)=0.5+0.4332=0.9332$

확률의 합이 $1$이므로
$P(\bar Y\le94)=1-0.9332=0.0668$
$=P(Z\le-1.5)$

따라서 $\bar Y$를 표준화한 값이 $-1.5$이다.
$\dfrac{94-100}{\sigma/4}=-1.5$
$\dfrac{24}{\sigma}=1.5$
$\sigma=16$
$\sigma_{\bar Y}=\dfrac{16}{4}=4$

이제 구하는 확률은
$P(\bar Y\le110)=P\left(Z\le\dfrac{110-100}{4}\right)$
$=P(Z\le2.5)=0.5+0.4938=0.9938$

따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q20 — KEEP

- qid/source ordinal: `20`/20; sourceQid: `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
평균이 m, 표준편차가 σ인 정규분포를 따르는 어느 모집단에서 크기가 10인 표본을 임의추출하였더니 다음과 같았다.

5, -3, 6, -1, 7, 6, -1, 8, 5, -2

위 표본과 모집단의 표준편차 σ를 이용하여 모평균 m에 대한 신뢰도 99%의 신뢰구간을 구하면 0.42≤m≤5.58이다. 이 모집단의 확률변수 X에 대하여 V(X)의 값을 구하면? (단, Z가 표준정규분포를 따르는 확률변수일 때, P(|Z|≤2.58)=0.99로 계산한다.) [4.3점]
~~~

- 원본 선택지: ① 10/9 / ② 3 / ③ 40/9 / ④ 8 / ⑤ 10
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 표본 10개의 합은 $5-3+6-1+7+6-1+8+5-2=30$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 표본10개 합30으로 평균3, 99% 신뢰구간 [0.42,5.58]의 반폭2.58은 2.58σ/√10. 따라서 σ²=10이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표본 10개의 합은
$5-3+6-1+7+6-1+8+5-2=30$
따라서 표본평균은
$\bar x=\dfrac{30}{10}=3$이다.

99% 신뢰구간은
$\bar x-2.58\dfrac{\sigma}{\sqrt{10}}\le m\le\bar x+2.58\dfrac{\sigma}{\sqrt{10}}$

주어진 신뢰구간은 $0.42\le m\le5.58$이므로
중심은 $3$, 오차한계는
$5.58-3=2.58$이다.

$2.58\dfrac{\sigma}{\sqrt{10}}=2.58$
$\dfrac{\sigma}{\sqrt{10}}=1$
$\sigma=\sqrt{10}$

모집단 확률변수의 분산은 $V(X)=\sigma^2=10$이다.

따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q21 — KEEP

- qid/source ordinal: `21`/21; sourceQid: `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
두 연속확률변수 X와 Y가 갖는 값의 범위는 -4≤X≤4, -3≤Y≤9이고, X와 Y의 확률밀도함수는 각각 f(x), g(x)이다. 두 함수 f(x), g(x)가 다음 조건을 만족시킬 때, 16P(-3≤X≤3)의 값을 구하면? (단, a, b는 양의 상수이다.) [4.4점]

(가) 0≤x≤4일 때 f(x)=ax+b이고, -4≤x≤4인 모든 실수 x에 대하여 f(-x)=f(x)를 만족시킨다.
(나) -3≤x≤3일 때 g(x)=ax+b이고, 0≤x≤6인 모든 실수 x에 대하여 g(3+x)=g(3-x)를 만족시킨다.
~~~

- 원본 선택지: ① 11 / ② 12 / ③ 13 / ④ 14 / ⑤ 15
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 확률밀도함수는 전체 그래프 아래의 넓이가 $1$이다. 주어진 대칭성을 이용해 $a,b$를 차례로 구한다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: g는 x3 중심 대칭이라 [-3,3] 영역넓이6b, 전체12b=1→b1/12. f는 y축 대칭, [0,4] 영역8a+4b, 전체16a+8b=1→a1/48. [−3,3] 영역9a+6b=11/16, 16배11이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q21-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률밀도함수는 전체 그래프 아래의 넓이가 $1$이다.
주어진 대칭성을 이용해 $a,b$를 차례로 구한다.

먼저 $g$는 직선 $x=3$에 대하여 대칭이다.
$-3\le x\le3$에서 양 끝 높이는
$g(-3)=b-3a$, $g(3)=b+3a$이다.

이 구간의 넓이는 사다리꼴의 넓이로
$\dfrac{6\{(b-3a)+(b+3a)\}}{2}=6b$
대칭인 $3\le x\le9$의 넓이도 $6b$이므로
$12b=1$
$b=\dfrac{1}{12}$

다음으로 $f$는 $y$축 대칭이다.
$0\le x\le4$에서 양 끝 높이는 $b$, $4a+b$이므로
$\dfrac{4\{b+(4a+b)\}}{2}=8a+4b$
전체 넓이가 $1$이므로
$2(8a+4b)=1$
$16a+8b=1$
$16a+\dfrac{2}{3}=1$
$a=\dfrac{1}{48}$

이제 $-3\le X\le3$의 확률을 구한다.
대칭성에 의해 $0\le x\le3$의 넓이를 두 배 하면 된다.
$P(-3\le X\le3)=2\times\dfrac{3\{b+(3a+b)\}}{2}$
$=9a+6b$
$=\dfrac{9}{48}+\dfrac{6}{12}=\dfrac{11}{16}$

$16P(-3\le X\le3)=16\times\dfrac{11}{16}=11$

따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q22 — KEEP

- qid/source ordinal: `22`/22; sourceQid: `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<서술형 1>
지역 A에 살고 있는 성인들의 1인 하루 물 사용량을 확률변수 X, 지역 B에 살고 있는 성인들의 1인 하루 물 사용량을 확률변수 Y라 하자. 두 확률변수 X, Y는 정규분포를 따르고 다음 조건을 만족시킨다.

(가) 두 확률변수 X, Y의 평균은 각각 220과 240이다.
(나) 확률변수 Y의 표준편차는 확률변수 X의 표준편차의 1.5배이다.

지역 A에 살고 있는 성인 중 임의추출한 n명의 1인 하루 물 사용량의 표본평균을 X̄, 지역 B에 살고 있는 성인 중 임의추출한 9n명의 1인 하루 물 사용량의 표본평균을 Ȳ라 하자. P(X̄≤215)=0.1587일 때, P(Ȳ≥237.5)의 값을 아래 표준정규분포표를 이용하여 풀이와 함께 자세히 서술하시오. (단, 물 사용량의 단위는 L이다.) [부분점수 있음, 6점]
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **0.8413**
- 기존 solution **정확 발췌**:

> 지역 A의 모표준편차를 $\sigma_X$라 두면 지역 B의 모표준편차는 $\sigma_Y=1.5\sigma_X$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 정규표에서 z1.0의 0.3413을 읽었다. A 표본평균 평균220에서 215 이하 꼬리0.1587은 z=-1로 표준오차5. B의 표본수9n, 모σ=1.5배라 표준오차2.5, P(Ȳ≥237.5)=P(Z≥−1)=0.8413이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q22.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q22-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `round4_direct_solved`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
지역 A의 모표준편차를 $\sigma_X$라 두면 지역 B의 모표준편차는
$\sigma_Y=1.5\sigma_X$이다.

두 표본평균의 분포는 각각
$\bar X\sim N\left(220,\dfrac{\sigma_X^2}{n}\right)$
$\bar Y\sim N\left(240,\dfrac{(1.5\sigma_X)^2}{9n}\right)$

표에서 $P(0\le Z\le1)=0.3413$이므로
$P(Z\le-1)=0.5-0.3413=0.1587$

주어진 $P(\bar X\le215)=0.1587$을 표준화하면
$\dfrac{215-220}{\sigma_X/\sqrt n}=-1$
$\dfrac{-5}{\sigma_X/\sqrt n}=-1$
$\dfrac{\sigma_X}{\sqrt n}=5$

지역 B의 표본평균의 표준편차는
$\sigma_{\bar Y}=\dfrac{1.5\sigma_X}{\sqrt{9n}}$
$=\dfrac{1.5}{3}\times\dfrac{\sigma_X}{\sqrt n}$
$=\dfrac{1}{2}\times5=2.5$

따라서 구하는 확률은
$P(\bar Y\ge237.5)=P\left(Z\ge\dfrac{237.5-240}{2.5}\right)$
$=P(Z\ge-1)=0.5+0.3413=0.8413$

따라서 구하는 값은 $0.8413$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q23 — KEEP

- qid/source ordinal: `23`/23; sourceQid: `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<서술형 2>
두 집합 A={a,b,c}, B={a,b}에 대하여 다음 시행을 한다.

집합 A의 모든 부분집합 8개 중에서 임의로 한 개를 선택하고, 집합 B의 모든 부분집합 4개 중에서 임의로 한 개를 선택한다. 선택한 두 집합의 교집합의 원소의 개수를 기록한다.

이 시행을 8640번 반복하여 기록한 수가 1인 횟수가 3330 이상일 확률을 아래 표준정규분포표를 이용하여 구한 값이 k일 때, 1000×k의 값을 풀이와 함께 자세히 서술하시오. [부분점수 있음, 7점]
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **23**
- 기존 solution **정확 발췌**:

> 교집합에 들어갈 수 있는 원소는 $a,b$뿐이다. 각 부분집합은 모든 부분집합 중 균등하게 선택하므로, 원소 $a$가 선택된 A의 부분집합에 포함될 확률은 $\dfrac{4}{8}=\dfrac{1}{2}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 두 부분집합 A,B가 독립 균등일 때 a,b 각각 교집합 포함확률1/4 및 서로 독립. 교집합 원소 수1의 p=2(1/4)(3/4)=3/8. 8640회 성공수 μ3240,σ45로 3330 이상 z≥2; 실물 표의 0.477에서 k≈0.023, 1000k=23이다.
- 원본문제 PNG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q23.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q23-solution-v3.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `round4_direct_solved`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
교집합에 들어갈 수 있는 원소는 $a,b$뿐이다.
각 부분집합은 모든 부분집합 중 균등하게 선택하므로, 원소 $a$가 선택된 A의 부분집합에 포함될 확률은 $\dfrac{4}{8}=\dfrac{1}{2}$이다.
B의 부분집합에 포함될 확률도 $\dfrac{2}{4}=\dfrac{1}{2}$이다.

따라서 $a$가 교집합에 들어갈 확률은
$\dfrac{1}{2}\times\dfrac{1}{2}=\dfrac{1}{4}$
$b$도 같으며 두 원소의 포함 여부는 서로 독립이다.

한 번 시행하여 교집합의 원소가 1개일 확률을 $p$라 하면
(가) $a$만 포함: $\dfrac{1}{4}\times\dfrac{3}{4}=\dfrac{3}{16}$
(나) $b$만 포함: $\dfrac{3}{4}\times\dfrac{1}{4}=\dfrac{3}{16}$
$p=\dfrac{3}{16}+\dfrac{3}{16}=\dfrac{3}{8}$

8640번 중 교집합의 원소가 1개인 횟수를 $T$라 하면
$T\sim B\left(8640,\dfrac{3}{8}\right)$
$E(T)=8640\times\dfrac{3}{8}=3240$
$V(T)=8640\times\dfrac{3}{8}\times\dfrac{5}{8}=2025$
$\sigma(T)=45$

정규분포로 근사하면
$k=P(T\ge3330)\approx P\left(Z\ge\dfrac{3330-3240}{45}\right)$
$=P(Z\ge2)$

표에서 $P(0\le Z\le2)=0.477$이므로
$k\approx0.5-0.477=0.023$
$1000k=1000\times0.023=23$

따라서 구하는 값은 $23$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q24 — KEEP

- qid/source ordinal: `24`/24; sourceQid: `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<서술형 3>
여섯 개의 수 3, 3, 3, 4, 4, 6이 각 면에 하나씩 적혀 있는 정육면체 모양의 상자를 던져 바닥에 닿은 면에 적혀 있는 수를 확인한다. 이와 같은 시행을 3회 반복할 때, 바닥에 닿은 면에 적혀 있는 수 중에서 최댓값과 최솟값의 차를 확률변수 X라 하자. 확률변수 X의 분산 V(X)를 풀이와 함께 자세히 서술하시오. (단, 바닥에 닿은 면에 적혀 있는 수가 모두 같으면 X=0이다.) [부분점수 있음, 7점]
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **179/144**
- 기존 solution **정확 발췌**:

> 한 번 던졌을 때 각 수가 나올 확률은 $P(3)=\dfrac{3}{6}=\dfrac{1}{2}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 한 면 값이3,4,6일 확률1/2,1/3,1/6. 세 번 최댓값−최솟값의 분포 X=0,1,2,3에 대해 1/6,5/12,1/12,1/3. E=19/12, E(X²)=15/4, 분산=15/4−361/144=179/144다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `round4_direct_solved`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 번 던졌을 때 각 수가 나올 확률은
$P(3)=\dfrac{3}{6}=\dfrac{1}{2}$
$P(4)=\dfrac{2}{6}=\dfrac{1}{3}$
$P(6)=\dfrac{1}{6}$

세 번 나온 수의 최댓값과 최솟값의 차는 $X=0,1,2,3$ 중 하나이다.
값별로 가능한 경우를 나누어 확률을 구한다.

(가) $X=0$: 세 번 모두 같은 수
$P(X=0)=\left(\dfrac{1}{2}\right)^3+\left(\dfrac{1}{3}\right)^3+\left(\dfrac{1}{6}\right)^3$
$=\dfrac{27+8+1}{216}=\dfrac{1}{6}$

(나) $X=1$: 3과 4만 나오되 둘 다 적어도 한 번 나옴
$P(X=1)=\left(\dfrac{5}{6}\right)^3-\left(\dfrac{1}{2}\right)^3-\left(\dfrac{1}{3}\right)^3$
$=\dfrac{125-27-8}{216}=\dfrac{5}{12}$

(다) $X=2$: 4와 6만 나오되 둘 다 적어도 한 번 나옴
$P(X=2)=\left(\dfrac{1}{2}\right)^3-\left(\dfrac{1}{3}\right)^3-\left(\dfrac{1}{6}\right)^3$
$=\dfrac{27-8-1}{216}=\dfrac{1}{12}$

(라) $X=3$: 3과 6이 모두 나옴
$P(X=3)=1-\left(\dfrac{1}{6}+\dfrac{5}{12}+\dfrac{1}{12}\right)$
$=\dfrac{1}{3}$

위 확률의 합은 $1$이다.
평균과 제곱의 평균을 구하면
$E(X)=0\times\dfrac{1}{6}+1\times\dfrac{5}{12}+2\times\dfrac{1}{12}+3\times\dfrac{1}{3}$
$=\dfrac{5+2+12}{12}=\dfrac{19}{12}$

$E(X^2)=0^2\times\dfrac{1}{6}+1^2\times\dfrac{5}{12}+2^2\times\dfrac{1}{12}+3^2\times\dfrac{1}{3}$
$=\dfrac{5+4+36}{12}=\dfrac{15}{4}$

분산은
$V(X)=E(X^2)-\{E(X)\}^2$
$=\dfrac{15}{4}-\left(\dfrac{19}{12}\right)^2$
$=\dfrac{540-361}{144}=\dfrac{179}{144}$

따라서 구하는 값은 $\dfrac{179}{144}$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

## 2. 이미지·정답·후속 게이트

- 고유 원본문제 PNG 8개 모두 확인: `assets/images/25_순천고_2학기_기말_고2_확률과통계/q4.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q7.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q8.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q10.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q18.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q19.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q22.png`, `assets/images/25_순천고_2학기_기말_고2_확률과통계/q23.png`.
- 그림 참조 총 8회, 모든 이미지의 원본 graph/table/text와 문제 사용처의 계산을 육안 재검산했다.
- 원문 선택지 ①~⑤와 정답 인덱스, 주관식 값, 기존 해설 계산을 모두 대조. KEEP 24; UPGRADE 0; UNREAD 0.
- **운영 출고 전 미실행 항목:** 기존 solutionImage SVG 렌더, 학생 화면 Golden/Negative, 소스 PDF의 인쇄 원본 대조, 개정과정 교차검증, 배포 승인. 이 MD와 독립 검산은 프로덕션 PASS 판정이 아니다.
- 원본 JS/이미지/정답/선택지/기존 해설/SVG 변경 없음. GitHub 전용 브랜치 MD만 생성 예정.
