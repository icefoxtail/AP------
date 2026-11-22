# 고2 확률과 통계 2학기 기말 — 25_강남여고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 첫 묶음(최신 연도순 5장) · 2026-11-22 KST. **학생용 해설 감사·수정안 MD 초안**이며 원본 JS 수정·운영 출고 PASS·Golden/Negative 완료를 의미하지 않는다.

## 0. 시험지 고정 정보

- 전용 라인: lane40 · 고2 확률과 통계 · 2학기 기말 원본(최신 연도에서 과거 연도 순).
- 시험지: 25_강남여고_2학기_기말_고2_확률과통계
- 원본 JS: `archive/exams/original/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계.js`
- 원본 ref: `main`; Git blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`
- 원본 sourcePdf 메타데이터: `2025_강남여2_확통_2기말.pdf`; PDF와 원문 대조는 NOT_RUN.
- 총 문항/전수 분모: **24문항 (Q01~Q24)**; 원본 content·choices·answer·solution 전문 모두 읽고 독립 수학 검산.
- MD 저장 경로: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_gangnamyeo_2final_DEEP_AUDIT.md`; 전용 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 PNG: **고유 5개, 문항별 10회 참조**, 전부 실제 다운로드 및 그래프·표·수직선 육안 판독. 이미지를 새로 제작하거나 원본을 변경하지 않음.
- 기존 풀이 SVG: **16문항**에서 경로 메타데이터 확인, 별도 SVG 렌더·학생 화면 QA **NOT_RUN**.
- 감사 방법: 원격 원본 JSON 정적 추출(시험 스크립트 미실행), 직접 그림 실물 대조, 확률분포/조합/조건부확률/표본평균/추정의 수치별 재계산, 보기·정답·해설 전문 일치 확인. 정규근사 문항은 문제에서 제공한 표와 연속성 보정 생략 관례를 별도로 구별.
- 상태: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 24/24 · KEEP 24 · UPGRADE 0 · UNREAD 0**. 운영 PASS, 골든/네거티브/교육과정 검증의 완료 주장은 하지 않음.
- 현재 cursor: `next_qid=NONE`, `UNREAD=[]`.

## 1. Q01~Q24 실제 원문·독립 수학 검산·판정

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">1. </span>확률변수 X의 확률분포를 표로 나타내면 다음과 같다. P(X≥2)의 값은? (3점)
~~~

- 원본 선택지: ① 4/5 / ② 7/10 / ③ 3/5 / ④ 1/2 / ⑤ 2/5
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 확률분포표에서 $X\ge 2$에 해당하는 값은 $2,\ 3$이다. $P(X\ge 2)=P(X=2)+P(X=3)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 분포표 실물에서 X=1,2,3의 확률이 3/5,3/10,1/10임을 읽고, 꼬리 P(X≥2)=3/10+1/10=2/5를 독립 합산했다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q01_distribution_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
확률분포표에서 $X\ge 2$에 해당하는 값은 $2,\ 3$이다.
$P(X\ge 2)=P(X=2)+P(X=3)$
$=\dfrac{3}{10}+\dfrac{1}{10}$
$=\dfrac{4}{10}=\dfrac25$
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">2. </span>확률변수 X가 이항분포 B(54, 1/9)을 따를 때, X의 평균은? (3.5점)
~~~

- 원본 선택지: ① 4 / ② 5 / ③ 6 / ④ 7 / ⑤ 8
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> $X\sim B\left(54,\dfrac19\right)$에서 시행 횟수는 $n=54$, 한 번의 성공확률은 $p=\dfrac19$이다. 이항분포의 평균은 $E(X)=np$이므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: X~B(54,1/9)에서 np=54/9=6으로 선택지 ③과 일치한다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim B\left(54,\dfrac19\right)$에서 시행 횟수는 $n=54$, 한 번의 성공확률은 $p=\dfrac19$이다.
이항분포의 평균은 $E(X)=np$이므로
$E(X)=54\times\dfrac19$
$=6$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">3. </span>확률변수 Z가 표준정규분포를 따를 때, 오른쪽 표준정규분포표를 이용하여 P(-1≤Z≤1)의 값은? (3.5점)
~~~

- 원본 선택지: ① 0.3830 / ② 0.6826 / ③ 0.8664 / ④ 0.9544 / ⑤ 1
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 표준정규분포는 평균 $0$을 중심으로 좌우 대칭이다. $P(-1\le Z\le0)=P(0\le Z\le1)=0.3413$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표 z=1.00 행의 중앙면적 0.3413을 확인해 대칭 구간 [-1,1] 면적 2×0.3413=0.6826을 계산했다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q3-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표준정규분포는 평균 $0$을 중심으로 좌우 대칭이다.
$P(-1\le Z\le0)=P(0\le Z\le1)=0.3413$
따라서
$P(-1\le Z\le1)$
$=P(-1\le Z\le0)+P(0\le Z\le1)$
$=0.3413+0.3413$
$=0.6826$
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">4. </span>확률변수 X가 정규분포 N(10, 2^2)을 따를 때, P(X≤14)=P(Z≤a)의 과정에서 상수 a의 값은? (단, Z가 표준정규분포를 따르는 확률변수이다.) (3.8점)
~~~

- 원본 선택지: ① 0.5 / ② 1 / ③ 1.2 / ④ 1.5 / ⑤ 2
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> $X\sim N(10,2^2)$이므로 평균은 $10$, 표준편차는 $2$이다. $Z=\dfrac{X-10}{2}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: N(10,2²)에서 14의 z=(14−10)/2=2로 표준화가 정확하다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim N(10,2^2)$이므로 평균은 $10$, 표준편차는 $2$이다.
$Z=\dfrac{X-10}{2}$
$X=14$를 표준화하면
$Z=\dfrac{14-10}{2}=2$이다.
따라서 $P(X\le14)=P(Z\le2)$이고 $a=2$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">5. </span>확률변수 X가 정규분포 N(64, 2^2)를 따를 때, 오른쪽 표준정규분포표를 이용하여 P(62≤X≤68)의 값은? (3.8점)
~~~

- 원본 선택지: ① 0.8185 / ② 0.8332 / ③ 0.8413 / ④ 0.8664 / ⑤ 0.9104
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> $X\sim N(64,2^2)$에서 평균은 $64$, 표준편차는 $2$이다. $Z=\dfrac{X-64}{2}$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: N(64,2²)에서 62,68의 z=-1,2; 실물 표의 0.3413+0.4772=0.8185를 대조했다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q5-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim N(64,2^2)$에서 평균은 $64$, 표준편차는 $2$이다.
$Z=\dfrac{X-64}{2}$
$X=62$일 때 $Z=-1$,
$X=68$일 때 $Z=2$이다.
$P(62\le X\le68)=P(-1\le Z\le2)$
$=P(-1\le Z\le0)+P(0\le Z\le2)$
$=0.3413+0.4772$
$=0.8185$
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">6. </span>확률변수 X에 대하여 E(X)=10, V(X)=4이고, 확률변수 Y에 대하여 Y=2X+5일 때, E(Y)-V(Y)의 값은? (3.8점)
~~~

- 원본 선택지: ① 11 / ② 10 / ③ 9 / ④ 8 / ⑤ 7
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> $Y=2X+5$이므로 평균과 분산을 각각 구한다. $E(Y)=2E(X)+5$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: E(Y)=2·10+5=25이고 V(Y)=2²·4=16이므로 차 9이며, 상수항은 분산에 영향을 주지 않는다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$Y=2X+5$이므로 평균과 분산을 각각 구한다.
$E(Y)=2E(X)+5$
$=2\times10+5=25$
상수항 $5$는 분산을 바꾸지 않으므로
$V(Y)=2^2V(X)$
$=4\times4=16$
따라서
$E(Y)-V(Y)=25-16=9$
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">7. </span>확률변수 X가 정규분포 N(m, σ^2)를 따르고 P(X≥48)=P(X≤52)일 때, 상수 m의 값은? (3.8점)
~~~

- 원본 선택지: ① 55 / ② 52.5 / ③ 50 / ④ 47.5 / ⑤ 45
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 정규분포의 그래프는 평균 $m$을 중심으로 좌우 대칭이다. $P(X\ge48)=P(X\le52)$의 양쪽에서 공통인 $48\le X\le52$ 부분을 빼면 $P(X\lt 48)=P(X\gt 52)$이므로, 두 경계점 $48$과 $52$는 평균에서 같은 거리만큼 떨어져 있다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 정규분포 연속 대칭에서 양쪽 꼬리가 같아 48과 52의 중점 m=(48+52)/2=50이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q7-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
정규분포의 그래프는 평균 $m$을 중심으로 좌우 대칭이다.
$P(X\ge48)=P(X\le52)$의 양쪽에서 공통인 $48\le X\le52$ 부분을 빼면 $P(X\lt 48)=P(X\gt 52)$이므로, 두 경계점 $48$과 $52$는 평균에서 같은 거리만큼 떨어져 있다.
$m-48=52-m$
$2m=100$
$m=50$
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">8. </span>확률변수 X의 확률밀도함수가 f(x)=a(x-2) (2≤x≤5)일 때, 상수 a의 값은? (3.8점)
~~~

- 원본 선택지: ① 5/9 / ② 4/9 / ③ 1/3 / ④ 2/9 / ⑤ 1/9
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> $2\le x\le5$에서 $f(x)=a(x-2)$이므로 $f(2)=0,\quad f(5)=3a$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 밑변 3, 높이 3a인 삼각밀도의 전체 면적 9a/2=1에서 a=2/9를 확인했다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q08-solution.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$2\le x\le5$에서 $f(x)=a(x-2)$이므로
$f(2)=0,\quad f(5)=3a$이다.
확률밀도함수의 그래프 아래 전체 넓이가 $1$이므로 삼각형 넓이를 구한다.
$\dfrac12\times(5-2)\times3a=1$
$\dfrac{9a}{2}=1$
$9a=2$
$a=\dfrac29$
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">9. </span>학생 수가 서로 같은 세 고등학교 A, B, C의 수학점수를 확률변수 X_A, X_B, X_C라고 할 때, X_A, X_B, X_C는 각각 정규분포 N(m_A, σ_A^2), N(m_B, σ_B^2), N(m_C, σ_C^2)을 따른다. 각각의 확률밀도함수의 그래프가 그림과 같다고 할 때, 옳은 것의 개수는? (4점)
~~~

- 원본 선택지: ① 5 / ② 4 / ③ 3 / ④ 2 / ⑤ 1
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 정규분포의 대칭축 위치는 평균, 그래프의 퍼짐은 표준편차가 결정한다. 그림에서 $m_A<m_B=m_C$, $\sigma_A=\sigma_B<\sigma_C$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 세 곡선은 A가 왼쪽, B와 C가 같은 중심, A와 B가 같은 폭, C가 넓다. ㄱ·ㄴ·ㄷ·ㅁ 참, ㄹ 거짓이라 4개이며, 곡선 폭은 평균이 아닌 표준편차로 결정된다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q09_graph_and_statements.png` — 실물 판독 완료.
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
정규분포의 대칭축 위치는 평균, 그래프의 퍼짐은 표준편차가 결정한다.
그림에서 $m_A<m_B=m_C$, $\sigma_A=\sigma_B<\sigma_C$이다.

ㄱ. 평균 양쪽의 넓이는 각각 $\dfrac12$이다.
$P(X_A\ge m_A)+P(X_B\le m_B)=\dfrac12+\dfrac12=1$이므로 참이다.

ㄴ. $m_A<m_B=m_C$이므로 참이다.

ㄷ. $A$와 $B$의 폭은 같고 $C$가 더 넓으므로 $\sigma_A=\sigma_B<\sigma_C$이다. 참이다.

ㄹ. 그래프의 폭이 같은 이유는 평균이 아니라 표준편차가 같기 때문이다. 또 $A$와 $B$의 대칭축 위치가 다른 이유는 평균이 다르기 때문이다. 거짓이다.

ㅁ. $B$와 $C$의 평균은 같고, $C$의 표준편차가 더 커서 그래프가 낮고 넓다. 참이다.

옳은 것은 ㄱ, ㄴ, ㄷ, ㅁ의 $4$개이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">10. </span>어느 고등학교 전체 학생의 자율 학습 참여율은 50%라고 한다. 이 학교 학생 중에서 100명을 임의로 뽑을 때, 자율 학습을 하는 학생의 수를 확률변수 X라고 하면 P(a≤X≤55)=0.8185일 때, 상수 a의 값은? (4점)
~~~

- 원본 선택지: ① 40 / ② 42 / ③ 45 / ④ 50 / ⑤ 52
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 참여 학생 수는 $X\sim B(100,0.5)$이다. $E(X)=100\times0.5=50$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: X~B(100,1/2)의 근사 μ=50,σ=5; 55의 z=1이고 목표 중앙면적 0.8185=0.4772+0.3413이므로 하한 z=-2, a=40이다. 이항확률의 정규근삿값임을 기존 풀이가 명시한다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q10-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
참여 학생 수는 $X\sim B(100,0.5)$이다.
$E(X)=100\times0.5=50$
$V(X)=100\times0.5\times0.5=25$
$\sigma_X=\sqrt{25}=5$
따라서 $X$를 $N(50,5^2)$로 근사한다.
$55$를 표준화하면
$z=\dfrac{55-50}{5}=1$이다.
$P(a\le X\le55)\approx0.8185$이므로
$P(a\le X\le50)$
$\approx0.8185-P(0\le Z\le1)$
$=0.8185-0.3413=0.4772$이다.
표에서 $P(-2\le Z\le0)=0.4772$이므로
$\dfrac{a-50}{5}=-2$
$a=50-10=40$
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">11. </span>정규분포 N(150, 6^2)을 따르는 모집단에서 크기가 36인 표본을 임의추출할 때, 표본평균 X̄에 대하여 P(X̄≥149)의 값은? (4점)
~~~

- 원본 선택지: ① 0.6915 / ② 0.8413 / ③ 0.9104 / ④ 0.9332 / ⑤ 0.9772
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 모집단이 $N(150,6^2)$이고 표본 크기가 $n=36$이므로 표본평균의 평균은 $150$, 표준편차는

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 표본평균의 표준오차 6/√36=1, 149의 z=-1이고 오른쪽 확률 0.5+0.3413=0.8413이다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q11-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모집단이 $N(150,6^2)$이고 표본 크기가 $n=36$이므로
표본평균의 평균은 $150$, 표준편차는
$\sigma_{\overline X}=\dfrac6{\sqrt{36}}=1$이다.
따라서 $\overline X\sim N(150,1^2)$이다.
$Z=\dfrac{\overline X-150}{1}$에서
$\overline X=149$는 $Z=-1$에 대응한다.
$P(\overline X\ge149)=P(Z\ge-1)$
$=\dfrac12+P(0\le Z\le1)$
$=0.5+0.3413$
$=0.8413$
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">12. </span>0≤x≤4에서 정의된 연속확률변수 X가 확률밀도함수 f(x)의 그래프가 그림과 같을 때, P(X≥1)의 값은? (단, a는 상수이다.) (4점)
~~~

- 원본 선택지: ① 1/3 / ② 5/12 / ③ 1/2 / ④ 7/12 / ⑤ 2/3
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 그래프는 $(0,a)$에서 $(3,0)$으로 내려갔다가 $(4,a)$로 올라간다. 전체 넓이가 $1$이므로

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 꺾은선 그래프는 (0,a),(3,0),(4,a)로 읽힌다. 두 삼각형 전체 면적 2a=1, [0,1] 면적 5a/6=5/12이므로 여사건 7/12를 재검산했다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q12_density_graph.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q12-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
그래프는 $(0,a)$에서 $(3,0)$으로 내려갔다가 $(4,a)$로 올라간다.
전체 넓이가 $1$이므로
$\dfrac12\times3\times a+\dfrac12\times1\times a=1$
$2a=1,\quad a=\dfrac12$이다.

구하는 넓이는 $x=1$부터 $4$까지이다.
왼쪽 직선에서 닮음비를 이용하면
$f(1)=\dfrac{3-1}{3}a=\dfrac{2a}{3}$이다.

$1\le x\le3$의 삼각형 넓이:
$\dfrac12\times2\times\dfrac{2a}{3}=\dfrac{2a}{3}$

$3\le x\le4$의 삼각형 넓이:
$\dfrac12\times1\times a=\dfrac a2$

따라서
$P(X\ge1)=\dfrac{2a}{3}+\dfrac a2$
$=\dfrac{7a}{6}=\dfrac{7}{12}$
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">13. </span>정규분포 N(m, σ^2)을 따르는 모집단에서 크기가 100, n인 표본을 임의추출하여 신뢰도 α%로 추정한 모평균 m의 신뢰구간의 길이가 각각 12, 6이라고 한다. 이때 n의 값은? (4점)
~~~

- 원본 선택지: ① 256 / ② 289 / ③ 324 / ④ 361 / ⑤ 400
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 같은 모집단, 같은 신뢰도이므로 신뢰상수 $z$와 모집단 표준편차 $\sigma$는 같다. 신뢰구간의 길이는 $L=\dfrac{2z\sigma}{\sqrt n}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 동일 신뢰수준·모표준편차에서 길이 L∝1/√n; 구간 폭 12에서 6으로 절반이 되려면 표본수 100에서 400으로 4배가 된다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q13-solution.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
같은 모집단, 같은 신뢰도이므로 신뢰상수 $z$와 모집단 표준편차 $\sigma$는 같다.
신뢰구간의 길이는 $L=\dfrac{2z\sigma}{\sqrt n}$이다.

표본 크기 $100$에서 길이가 $12$이므로
$12=\dfrac{2z\sigma}{\sqrt{100}}$
$12=\dfrac{2z\sigma}{10}$
$2z\sigma=120$이다.

표본 크기 $n$에서 길이가 $6$이므로
$6=\dfrac{120}{\sqrt n}$
$\sqrt n=20$
$n=400$
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">14. </span>1부터 6까지의 자연수가 하나씩 적혀 있는 6장의 카드 중에서 임의로 4장의 카드를 동시에 뽑는 시행을 14번 반복한다. n번째 시행에서 뽑은 4장의 카드에 적힌 수 중에서 두 번째로 큰 수를 x_n이라 하자. 14개의 수 x_1, x_2, ..., x_14의 평균을 X̄라 할 때, E(5X̄-15)+V(5X̄+10)의 값은? (4점)
~~~

- 원본 선택지: ① 5 / ② 6 / ③ 7 / ④ 8 / ⑤ 9
- 원본 정답: **③**
- 기존 solution **정확 발췌**:

> 한 번에 4장을 뽑아 두 번째로 큰 수를 $X$라 하자. 전체 경우의 수는 $\binom{6}{4}=15$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 6장 중 4장 동시추출에서 둘째 큰 값 3·4·5의 경우의 수가 각각 3·6·6(전체15); E(X)=21/5,V(X)=14/25. 14회 평균에 대해 E(5X̄−15)=6, V(5X̄+10)=1, 합 7이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 번에 4장을 뽑아 두 번째로 큰 수를 $X$라 하자.
전체 경우의 수는 $\binom{6}{4}=15$이다.
두 번째로 큰 수는 $3,4,5$ 중 하나이다.

$X=3$: $1,2,3$과 $4,5,6$ 중 1장을 뽑는다.
$P(X=3)=\dfrac{{}_2C_2\,{}_3C_1}{15}=\dfrac3{15}=\dfrac15$

$X=4$: $1,2,3$ 중 2장, $4$와 $5,6$ 중 1장을 뽑는다.
$P(X=4)=\dfrac{{}_3C_2\,{}_2C_1}{15}=\dfrac6{15}=\dfrac25$

$X=5$: $1,2,3,4$ 중 2장, $5,6$을 뽑는다.
$P(X=5)=\dfrac{{}_4C_2}{15}=\dfrac6{15}=\dfrac25$

$E(X)=3\cdot\dfrac15+4\cdot\dfrac25+5\cdot\dfrac25=\dfrac{21}{5}$
$E(X^2)=9\cdot\dfrac15+16\cdot\dfrac25+25\cdot\dfrac25=\dfrac{91}{5}$
$V(X)=\dfrac{91}{5}-\left(\dfrac{21}{5}\right)^2$
$=\dfrac{455-441}{25}=\dfrac{14}{25}$

독립인 시행 14번의 표본평균이 $\overline X$이므로
$E(\overline X)=\dfrac{21}{5}$,
$V(\overline X)=\dfrac{14/25}{14}=\dfrac1{25}$이다.

$E(5\overline X-15)=5\cdot\dfrac{21}{5}-15=6$
$V(5\overline X+10)=5^2\cdot\dfrac1{25}=1$
구하는 값은 $6+1=7$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">15. </span>확률변수 X는 이항분포 B(3, p)를 따르고 확률변수 Y는 이항분포 B(4, 2p)를 따른다고 한다. 이때, 10P(X=3)=P(Y≥3)을 만족시키는 양수 p의 값은? (4점)
~~~

- 원본 선택지: ① 11/24 / ② 1/2 / ③ 13/24 / ④ 7/12 / ⑤ 5/8
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> $X\sim B(3,p)$에서 $P(X=3)=p^3$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: X~B(3,p), Y~B(4,2p), P(Y≥3)=32p³−48p⁴; 10p³과 같게 놓고 p>0으로 나누면 p=11/24이며 2p≤1 조건도 통과한다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim B(3,p)$에서
$P(X=3)=p^3$이다.

$Y\sim B(4,2p)$에서
$P(Y\ge3)=P(Y=3)+P(Y=4)$
$={}_4C_3(2p)^3(1-2p)+{}_4C_4(2p)^4$
$=32p^3(1-2p)+16p^4$
$=32p^3-48p^4$이다.

$10P(X=3)=P(Y\ge3)$이므로
$10p^3=32p^3-48p^4$
$p>0$에서 $p^3$으로 나누면
$10=32-48p$
$48p=22$
$p=\dfrac{11}{24}$이다.
$0<2p\le1$도 만족하므로 가능하다.
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">16. </span>표준편차가 σ인 정규분포를 따르는 모집단에서 크기가 n인 표본을 임의추출하여 얻은 모평균 m에 대한 신뢰도 99%의 신뢰구간이 9.42≤m≤14.58이다. 같은 표본을 이용하여 얻은 모평균 m에 대한 신뢰도 95%의 신뢰구간에 속하는 모든 자연수 m의 개수는? (단, Z가 표준정규분포를 따르는 확률변수일 때, P(0≤Z≤1.96)=0.475, P(0≤Z≤2.58)=0.495) (4.5점)
~~~

- 원본 선택지: ① 6 / ② 5 / ③ 4 / ④ 3 / ⑤ 2
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 신뢰구간의 중심은 표본평균이고, 반길이는 신뢰상수와 표준오차의 곱이다. 99% 신뢰구간의 중심:

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 99% 구간 중심 (9.42+14.58)/2=12, 반폭2.58로 표준오차1. 95% 구간 [10.04,13.96]에 포함되는 자연수 11,12,13으로 3개다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q16-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
신뢰구간의 중심은 표본평균이고, 반길이는 신뢰상수와 표준오차의 곱이다.

99% 신뢰구간의 중심:
$\overline x=\dfrac{9.42+14.58}{2}=12$
99% 신뢰구간의 반길이:
$14.58-12=2.58$

99% 신뢰상수가 $2.58$이므로
$2.58\times\dfrac{\sigma}{\sqrt n}=2.58$
$\dfrac{\sigma}{\sqrt n}=1$이다.

같은 표본으로 구한 95% 신뢰구간에서는 중심과 표준오차가 그대로이다.
95% 신뢰상수는 $1.96$이므로
$12-1.96\times1\le m\le12+1.96\times1$
$10.04\le m\le13.96$

포함되는 자연수는 $11,\ 12,\ 13$으로 $3$개이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">17. </span>확률변수 X가 이항분포 B(180, 1/6)을 따를 때, t에 대한 이차방정식 t^2-2Xt+55X-700=0이 실근을 가질 확률은? (4.5점)
(원본 제공 표준정규분포표)
$\begin{array}{c|cccc}z&1.00&1.50&2.00&2.50\\\hline P(0\le Z\le z)&0.3413&0.4332&0.4772&0.4938\end{array}$
~~~

- 원본 선택지: ① 0.1815 / ② 0.3475 / ③ 0.4081 / ④ 0.6826 / ⑤ 0.8185
- 원본 정답: **①**
- 기존 solution **정확 발췌**:

> 이차방정식 $t^2-2Xt+55X-700=0$이 실근을 가지려면 판별식이 $0$ 이상이다. $D=(-2X)^2-4(55X-700)$

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 판별식 4(X−20)(X−35)≥0 조건 X≤20 또는 X≥35. B(180,1/6)의 정규근사 μ30,σ5로 z≤−2 또는 z≥1; 0.0228+0.1587=0.1815다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q17-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
이차방정식 $t^2-2Xt+55X-700=0$이 실근을 가지려면 판별식이 $0$ 이상이다.
$D=(-2X)^2-4(55X-700)$
$=4(X^2-55X+700)$
$=4(X-20)(X-35)$
따라서
$(X-20)(X-35)\ge0$
$X\le20$ 또는 $X\ge35$이다.

$X\sim B\left(180,\dfrac16\right)$이므로
$E(X)=180\times\dfrac16=30$
$V(X)=180\times\dfrac16\times\dfrac56=25$
$\sigma_X=5$이다.
따라서 $X$를 $N(30,5^2)$로 근사한다.

$X=20$은 $Z=-2$, $X=35$는 $Z=1$에 대응한다.
$P(X\le20)+P(X\ge35)$
$\approx P(Z\le-2)+P(Z\ge1)$
$=(0.5-0.4772)+(0.5-0.3413)$
$=0.0228+0.1587=0.1815$
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">18. </span>두 이산확률변수 X, Y의 확률분포를 표로 나타내면 각각 다음과 같다. V(X)=31/5일 때, 5×V(Y)의 값은? (4.5점)
~~~

- 원본 선택지: ① 38 / ② 39 / ③ 40 / ④ 41 / ⑤ 42
- 원본 정답: **②**
- 기존 solution **정확 발췌**:

> 두 확률분포는 모두 $5$를 중심으로 좌우 대칭이므로 $E(X)=E(Y)=5$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 실물 표에서 X와 Y의 중심이 5로 같고, Y는 양끝 1·9에 각각 1/20 증가하며 5에서 1/10 감소한다. 분산 증가분 2×16/20=8/5, 따라서 5V(Y)=39다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q18_distribution_tables.png` — 실물 판독 완료.
- 기존 풀이 SVG: 없음.
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
두 확률분포는 모두 $5$를 중심으로 좌우 대칭이므로
$E(X)=E(Y)=5$이다.
$V(X)=E(X^2)-\{E(X)\}^2$에서
$\dfrac{31}{5}=E(X^2)-25$
$E(X^2)=\dfrac{156}{5}$이다.

$Y$에서는 $X$에 비해 양끝 값 $1,9$의 확률이 각각 $\dfrac1{20}$만큼 늘고, 가운데 값 $5$의 확률은 $\dfrac1{10}$만큼 줄었다.
따라서
$E(Y^2)-E(X^2)$
$=1^2\cdot\dfrac1{20}+9^2\cdot\dfrac1{20}-5^2\cdot\dfrac1{10}$
$=\dfrac{1+81}{20}-\dfrac{25}{10}$
$=\dfrac{82-50}{20}=\dfrac85$이다.

평균이 같으므로 분산의 차도 $\dfrac85$이다.
$V(Y)=\dfrac{31}{5}+\dfrac85=\dfrac{39}{5}$
$5V(Y)=39$
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">19. </span>어느 음료 회사에서 생산되는 음료수 한 병의 용량은 평균이 240mL, 표준편차가 12mL인 정규분포를 따른다고 한다. 이 회사에서는 생산된 음료수 9병을 한 상자에 담아 판매하는데 음료수 한 상자에 들어 있는 음료수 9병의 용량에 대한 표본평균 X̄가 234.4mL보다 작거나 249.6mL보다 크면 불량품으로 판정한다고 한다. 이 음료수 공장에서 출하한 음료수 상자 400개 중에서 불량품인 상자가 43개 이하일 확률은? (4.5점)
(원본 제공 표준정규분포표)
$\begin{array}{c|cccc}z&0.5&1.4&1.5&2.4\\\hline P(0\le Z\le z)&0.19&0.41&0.43&0.49\end{array}$
~~~

- 원본 선택지: ① 0.98 / ② 0.93 / ③ 0.90 / ④ 0.84 / ⑤ 0.69
- 원본 정답: **⑤**
- 기존 solution **정확 발췌**:

> 한 병의 용량은 $N(240,12^2)$를 따른다. 한 상자의 9병 평균 $\overline X$는

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 병 9개 평균 표준오차 12/3=4; 하한/상한 z=-1.4,2.4에서 불량확률 약 0.1. 400상자 불량 수 B(400,0.1)을 다시 N(40,6²)로 근사해 43 이하 z≤0.5, 약 0.69다. 두 차례의 근사와 표 반올림을 구별한다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q19-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
한 병의 용량은 $N(240,12^2)$를 따른다.
한 상자의 9병 평균 $\overline X$는
$\overline X\sim N\left(240,\left(\dfrac{12}{\sqrt9}\right)^2\right)$
$=N(240,4^2)$이다.

불량 판정 경계를 표준화하면
$\dfrac{234.4-240}{4}=-1.4$
$\dfrac{249.6-240}{4}=2.4$이다.
따라서 한 상자의 불량 확률은
$P(Z<-1.4)+P(Z>2.4)$이다.
확률표의 값을 $0.41,\ 0.49$로 근사하여 계산하면
$p\approx(0.5-0.41)+(0.5-0.49)$
$=0.09+0.01=0.10$이다.

불량 상자 수를 $Y$라 하면 $Y\sim B(400,0.10)$으로 근사하여
$E(Y)=400\times0.10=40$
$V(Y)=400\times0.10\times0.90=36$
$\sigma_Y=6$이다.
다시 $Y$를 $N(40,6^2)$로 근사하면
$P(Y\le43)\approx P\left(Z\le\dfrac{43-40}{6}\right)$
$=P(Z\le0.5)$
$=0.5+0.19=0.69$
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q20 — KEEP

- qid/source ordinal: `20`/20; sourceQid: `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
<span style="display:none">20. </span>평균이 m, 표준편차가 4인 정규분포를 따르는 모집단에서 크기가 n인 표본을 임의추출할 때, 표본평균 X̄에 대하여 f(m)=P(X̄≤1.96×4/√n)라고 하자. 이때, f(0)+f(1.8)≤1.025를 만족시키는 n의 최솟값은? (단, Z가 표준정규분포를 따르는 확률변수일 때, P(0≤Z≤1.64)=0.450, P(0≤Z≤1.96)=0.475로 계산한다.) (5점)
~~~

- 원본 선택지: ① 25 / ② 36 / ③ 49 / ④ 64 / ⑤ 81
- 원본 정답: **④**
- 기존 solution **정확 발췌**:

> 표본평균은 $\overline X\sim N\left(m,\dfrac{16}{n}\right)$이므로 표준편차는 $\dfrac4{\sqrt n}$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: f(0)=Φ(1.96)=0.975, 합 조건으로 f(1.8)≤0.05. Φ 인자 1.96−1.8√n/4≤−1.64에서 n≥64다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q20-solution-v3.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `answer_filled_from_answer_pdf_visual_table`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
표본평균은 $\overline X\sim N\left(m,\dfrac{16}{n}\right)$이므로
표준편차는 $\dfrac4{\sqrt n}$이다.
$f(m)=P\left(\overline X\le1.96\cdot\dfrac4{\sqrt n}\right)$
$=P\left(Z\le\dfrac{1.96(4/\sqrt n)-m}{4/\sqrt n}\right)$
$=P\left(Z\le1.96-\dfrac{m\sqrt n}{4}\right)$이다.

$m=0$일 때
$f(0)=P(Z\le1.96)=0.5+0.475=0.975$

따라서 $f(0)+f(1.8)\le1.025$는
$f(1.8)\le1.025-0.975=0.05$이다.
$P(Z\le-1.64)=0.5-0.450=0.05$이므로
$1.96-\dfrac{1.8\sqrt n}{4}\le-1.64$
$\dfrac{1.8\sqrt n}{4}\ge3.60$
$1.8\sqrt n\ge14.4$
$\sqrt n\ge8$
$n\ge64$이다.
최소 자연수는 $64$이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q21 — KEEP

- qid/source ordinal: `21`/21; sourceQid: `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[서술형 1] 동전 1개를 던져서 앞면이 나오면 4점을 얻고, 뒷면이 나오면 3점을 잃는 게임을 하였다. 동전 1개를 100번 던진 후, 최종점수가 120점 이상일 확률을 구하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0\le Z\le2.0)=0.4772$) (5점)
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **0.0228**
- 기존 solution **정확 발췌**:

> 앞면이 나온 횟수를 $X$라 하면 뒷면이 나온 횟수는 $100-X$이다. 총점은

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 앞면 횟수 X~B(100,1/2), 최종점수 4X−3(100−X)=7X−300. 120점 이상은 X≥60, 정규근사 z≥2의 꼬리 0.0228이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q21-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `direct_solved_round5`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
앞면이 나온 횟수를 $X$라 하면 뒷면이 나온 횟수는 $100-X$이다.
총점은
$4X-3(100-X)$
$=4X-300+3X=7X-300$이다.

총점이 $120$점 이상인 조건은
$7X-300\ge120$
$7X\ge420$
$X\ge60$이다.

앞면이 나올 확률은 $\dfrac12$이므로
$X\sim B\left(100,\dfrac12\right)$이다.
$E(X)=100\times\dfrac12=50$
$V(X)=100\times\dfrac12\times\dfrac12=25$
$\sigma_X=5$이다.
따라서 $X$를 $N(50,5^2)$로 근사한다.
$P(X\ge60)\approx P\left(Z\ge\dfrac{60-50}{5}\right)$
$=P(Z\ge2)$
$=0.5-0.4772=0.0228$
따라서 구하는 확률은 $0.0228$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q22 — KEEP

- qid/source ordinal: `22`/22; sourceQid: `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[서술형 2] 확률변수 $X$가 정규분포 $N(100,9)$를 따를 때, 정규분포를 따르는 확률변수 $Y$가 $Y=3X-100$에 대하여 $P(Y\ge191)$을 구하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0\le Z\le1.0)=0.3413$로 계산한다.) (5점)
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **0.8413**
- 기존 solution **정확 발췌**:

> $X\sim N(100,9)$이므로 $E(X)=100,\quad \sigma_X=\sqrt9=3$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: Y=3X−100의 평균 200, 표준편차 3×3=9. 191의 z=-1이므로 P(Y≥191)=0.8413이다.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(문제 본문에 인라인 표·수식 포함 가능).
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q22-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `direct_solved_round5`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
$X\sim N(100,9)$이므로
$E(X)=100,\quad \sigma_X=\sqrt9=3$이다.

$Y=3X-100$에서
$E(Y)=3E(X)-100$
$=3\times100-100=200$이다.
$V(Y)=3^2V(X)=9\times9=81$,
$\sigma_Y=\sqrt{81}=9$이다.
따라서 $Y\sim N(200,9^2)$이다.

$Y=191$을 표준화하면
$Z=\dfrac{191-200}{9}=-1$이다.
$P(Y\ge191)=P(Z\ge-1)$
$=0.5+P(0\le Z\le1)$
$=0.5+0.3413$
$=0.8413$
따라서 구하는 확률은 $0.8413$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q23 — KEEP

- qid/source ordinal: `23`/23; sourceQid: `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[서술형 3] 정규분포 $N(300,625)$를 따르는 모집단에서 크기가 $n$인 표본을 임의추출할 때, 표본평균 $\overline X$에 대하여 $P(298\le\overline X\le302)=0.9544$이다. $n$의 값을 구하시오. (5점)
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **625**
- 기존 solution **정확 발췌**:

> 모집단이 $N(300,625)$이므로 평균은 $300$, 표준편차는 $\sqrt{625}=25$이다.

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: N(300,25²)의 표본평균 표준오차 25/√n, [298,302]의 표준화 반폭 2√n/25. 중앙확률 0.9544는 z=2이므로 n=625다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q23-solution-v2.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `direct_solved_round5`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
모집단이 $N(300,625)$이므로
평균은 $300$, 표준편차는 $\sqrt{625}=25$이다.
크기 $n$인 표본평균의 분포는
$\overline X\sim N\left(300,\dfrac{625}{n}\right)$이고
표준오차는 $\dfrac{25}{\sqrt n}$이다.

$298$과 $302$는 평균 $300$의 좌우에서 각각 $2$만큼 떨어져 있다.
표준화하면
$P(298\le\overline X\le302)$
$=P\left(-\dfrac{2\sqrt n}{25}\le Z\le\dfrac{2\sqrt n}{25}\right)$
$=0.9544$이다.

평균의 양쪽 넓이가 같으므로
$P\left(0\le Z\le\dfrac{2\sqrt n}{25}\right)$
$=\dfrac{0.9544}{2}=0.4772$이다.
표에서 $P(0\le Z\le2)=0.4772$이므로
$\dfrac{2\sqrt n}{25}=2$
$\sqrt n=25$
$n=625$
따라서 구하는 표본 크기는 $625$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

### Q24 — KEEP

- qid/source ordinal: `24`/24; sourceQid: `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `04402124c203ac7fbdac2247fc569dc11461b793`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 무첨가):

~~~text
[서술형 4] 정규분포 $N(80,5^2)$를 따르는 확률변수 $X$와 정규분포를 따르는 확률변수 $Y$가 $Y=-3X+a$를 만족시킨다. $P(b\le X\le75)=0.1359$, $P(a-240\le Y\le b)=0.3413$일 때, 오른쪽 표준정규분포표를 이용하여 상수 $a,b$의 값을 구하시오. (5점)
~~~

- 원본 선택지: (주관식/서술형: 객관식 선택지 없음)
- 원본 정답: **a=295, b=70**
- 기존 solution **정확 발췌**:

> 먼저 $X\sim N(80,5^2)$에서 $b$를 구한다. $X=75$를 표준화하면

- 학생 해설의 핵심 경로·**독립 검산** 및 판정 이유: 첫 조건에서 P(b≤X≤75)=0.1359=0.4772−0.3413 이는 P(−2≤Z≤−1)=0.1359이므로 b=70. Y=-3X+a의 평균 a−240, 표준편차15, P(Y∈[a−240,70])=0.3413은 상한 z=1이라 a=295다.
- 원본문제 PNG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png` — 실물 판독 완료.
- 기존 풀이 SVG: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q24-solution-v3.svg` (경로만 확인, 렌더 **NOT_RUN**).
- 원본 answerStatus 메타데이터: `direct_solved_round5`.
- 기존 solution **전문** (원본 보존, 변경 없음):

~~~text
먼저 $X\sim N(80,5^2)$에서 $b$를 구한다.
$X=75$를 표준화하면
$\dfrac{75-80}{5}=-1$이다.

$P(b\le X\le75)=0.1359$이고
$P(1\le Z\le2)$
$=0.4772-0.3413=0.1359$이다.
따라서 구간의 표준화한 양끝값은 $-2,\ -1$이다.
$\dfrac{b-80}{5}=-2$
$b-80=-10$
$b=70$이다.

이제 $Y=-3X+a$의 평균과 표준편차를 구한다.
$E(Y)=-3\times80+a=a-240$
$V(Y)=(-3)^2\times5^2=225$
$\sigma_Y=15$이므로
$Y\sim N(a-240,15^2)$이다.

$P(a-240\le Y\le b)=0.3413$에서 아래끝 $a-240$은 바로 $Y$의 평균이다.
따라서
$P\left(0\le Z\le\dfrac{b-(a-240)}{15}\right)=0.3413$이다.
표에서 $P(0\le Z\le1)=0.3413$이므로
$\dfrac{b-a+240}{15}=1$
$b-a+240=15$이다.
$b=70$을 대입하면
$70-a+240=15$
$310-a=15$
$a=295$이다.
따라서 구하는 값은 $a=295,\ b=70$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**; JS·정답·보기·SVG 미변경.

## 2. 이미지·정답·후속 게이트

- 고유 원본문제 PNG 5개 모두 확인: `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q01_distribution_table.png`, `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q03_standard_normal_table.png`, `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q09_graph_and_statements.png`, `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q12_density_graph.png`, `assets/images/25_강남여고_2학기_기말_고2_확률과통계/q18_distribution_tables.png`.
- 그림 참조 총 10회, 모든 이미지의 원본 graph/table/text와 문제 사용처의 계산을 육안 재검산했다.
- 원문 선택지 ①~⑤와 정답 인덱스, 주관식 값, 기존 해설 계산을 모두 대조. KEEP 24; UPGRADE 0; UNREAD 0.
- **운영 출고 전 미실행 항목:** 기존 solutionImage SVG 렌더, 학생 화면 Golden/Negative, 소스 PDF의 인쇄 원본 대조, 개정과정 교차검증, 배포 승인. 이 MD와 독립 검산은 프로덕션 PASS 판정이 아니다.
- 원본 JS/이미지/정답/선택지/기존 해설/SVG 변경 없음. GitHub 전용 브랜치 MD만 생성 예정.
