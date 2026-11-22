# 고2 확률과 통계 2학기 기말 — 25_제일고_2학기_기말_고2_확률과통계_기출 전 문항 심층 감사

> lane40 기말 세 번째 5장 묶음 · 2026-11-22 KST. **학생용 해설 감사·수정안 MD 초안**. 원본 JS·보기·답안·그림·SVG 무수정. 운영 출고 PASS는 별도 단계.

## 0. 시험지 고정 정보

- 전용 라인: **lane40**, 고2 확률과 통계, 2학기 기말 원본. 다른 학기·유형 전환 없음.
- 원본 시험지: `25_제일고_2학기_기말_고2_확률과통계_기출`
- 원본 JS 경로: `archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js`
- 원본 ref: `main`; **source Git blob SHA**: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`.
- sourcePdf 메타데이터: `2025_제일고2_확통_2기말.pdf`. 실제 인쇄 PDF 원문 대조 **NOT_RUN**.
- 총 문항 수: **23문항 (Q01~Q23)**; 실제 JS content·choices·answer·기존 solution **모든 문항의 전문 보존**.
- 감사 MD: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_jeil_2final_gichul_DEEP_AUDIT.md`; 전용 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 PNG: 고유 **1개**·참조 **1회**, 실물 다운로드 및 육안 판독 완료. 이미지 경로는 q.image/q.images/HTML 원문과 실제 GitHub 루트 `assets/images/`를 대조함.
- 기존 학생풀이 SVG: **11개** 경로 확인. 별도 SVG 렌더·Golden/Negative QA **NOT_RUN**.
- 방법: 원격 원본 JS JSON 정적 추출(스크립트 실행 없음), 전 문항 수학 독립 검산, 객관식 인덱스 대조, 원본 도형 실물 판독, 정규분포 참값 및 이항분포 정확값 검산. 실물 PDF / 렌더 QA는 이 단계와 구별.
- 결과: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 23/23; KEEP 20; UPGRADE 3; UNREAD 0.** 수정 문항 Q20, Q21, Q23.
- 이 시험지 cursor: `next_qid=NONE; UNREAD=[]`.

## 1. Q01~Q23 원문·기존 풀이 전문·독립 수학 검산

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `q01`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
확률변수 $X$가 이항분포 $B(48,p)$를 따르고 $V(X)=9$일 때, $p$의 값을 구하면? (단, $0\le p<\dfrac12$이다.) [3.5점]
~~~

- 원본 선택지: ① $\dfrac13$ / ② $\dfrac14$ / ③ $\dfrac15$ / ④ $\dfrac16$ / ⑤ $\dfrac17$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 확률변수 $X$는 $B(48,p)$를 따르므로 분산은 $48p(1-p)$이다. $48p(1-p)=9$ $16p^2-16p+3=0$ $(4p-1)(4p-3)=0$ 따라서 $p=\dfrac14$ 또는 $p=\dfrac34$이다. 그런데 $0\le p\lt \dfrac12$이므로 $p=\dfrac14$이다. 따라서 정답은 ②이다.
- **독립 수학 검산·판정 근거:** B(48,p) 분산 48p(1−p)=9, p<1/2에서 p=1/4; ② 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
확률변수 $X$는 $B(48,p)$를 따르므로 분산은 $48p(1-p)$이다.
$48p(1-p)=9$
$16p^2-16p+3=0$
$(4p-1)(4p-3)=0$
따라서 $p=\dfrac14$ 또는 $p=\dfrac34$이다.
그런데 $0\le p\lt \dfrac12$이므로 $p=\dfrac14$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `q02`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
다음 확률변수 중 연속확률변수인 것은? [3.4점]
~~~

- 원본 선택지: ① 출퇴근길 신호등 정지 횟수 / ② 가족 내 특정 성별의 자녀 수 / ③ 특정 스포츠 경기에서의 득점 수 / ④ 복권 구매 시 당첨된 개수 / ⑤ 여수발 제주도행 비행기의 비행 시간
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 확률변수는 가질 수 있는 값에 따라 이산확률변수와 연속확률변수로 구분한다. ① 출퇴근길 신호등에 멈춘 횟수, ② 가족 내 특정 성별의 자녀 수, ③ 경기에서 얻은 득점 수, ④ 복권에 당첨된 개수는 모두 하나씩 셀 수 있는 정수값을 갖는다. 따라서 이 네 경우는 이산확률변수이다. ⑤ 비행 시간은 $3.2$시간, $3.21$시간처럼 연속된 구간의 실수값을 가질 수 있으므로 연속확률변수이다. 따라서 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** 연속확률변수 사례는 비행시간 ⑤; 나머지 개수형 이산 변수 구분 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
확률변수는 가질 수 있는 값에 따라 이산확률변수와 연속확률변수로 구분한다.

① 출퇴근길 신호등에 멈춘 횟수,
② 가족 내 특정 성별의 자녀 수,
③ 경기에서 얻은 득점 수,
④ 복권에 당첨된 개수는 모두 하나씩 셀 수 있는 정수값을 갖는다.
따라서 이 네 경우는 이산확률변수이다.

⑤ 비행 시간은 $3.2$시간, $3.21$시간처럼 연속된 구간의 실수값을 가질 수 있으므로 연속확률변수이다.

따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `q03`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
다음 표는 A고등학교 2학년 1학기 중간고사에서 국어, 영어, 수학 과목에 대한 재석이의 점수와 전체 학생의 점수의 평균, 표준편차를 나타낸 것이다. 전체 학생의 국어, 영어, 수학 과목의 점수가 각각 정규분포를 따른다고 할 때, 세 과목 중에서 재석이의 성적이 상대적으로 가장 높은 과목과 가장 낮은 과목을 순서대로 짝지은 것은? [3.7점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>과목</th><th>국어</th><th>영어</th><th>수학</th></tr></thead><tbody><tr><th>재석이의 점수</th><td>70점</td><td>80점</td><td>83점</td></tr><tr><th>전체 학생의 평균</th><td>55점</td><td>75점</td><td>68점</td></tr><tr><th>전체 학생의 표준편차</th><td>6점</td><td>5점</td><td>10점</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① 국어, 영어 / ② 국어, 수학 / ③ 수학, 국어 / ④ 수학, 영어 / ⑤ 영어, 수학
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 과목마다 평균과 표준편차가 다르므로 표준점수를 구해 비교한다. 개인의 점수를 $x$, 과목의 평균을 $m$, 표준편차를 $\sigma$라 하면 표준점수는 $z=\dfrac{x-m}{\sigma}$이다. 국어: $z=\dfrac{70-55}{6}=\dfrac{15}{6}=2.5$ 영어: $z=\dfrac{80-75}{5}=\dfrac55=1$ 수학: $z=\dfrac{83-68}{10}=\dfrac{15}{10}=1.5$ $2.5\gt 1.5\gt 1$이므로 상대적으로 가장 높은 과목은 국어, 가장 낮은 과목은 영어이다. 따라서 정답은 ①이다.
- **독립 수학 검산·판정 근거:** 세 과목 표준점수 (2.5,1,1.5) 비교, 국어·영어 순서 ① 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
과목마다 평균과 표준편차가 다르므로 표준점수를 구해 비교한다.
개인의 점수를 $x$, 과목의 평균을 $m$, 표준편차를 $\sigma$라 하면 표준점수는 $z=\dfrac{x-m}{\sigma}$이다.
국어:
$z=\dfrac{70-55}{6}=\dfrac{15}{6}=2.5$
영어:
$z=\dfrac{80-75}{5}=\dfrac55=1$
수학:
$z=\dfrac{83-68}{10}=\dfrac{15}{10}=1.5$
$2.5\gt 1.5\gt 1$이므로 상대적으로 가장 높은 과목은 국어, 가장 낮은 과목은 영어이다.
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `q04`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
확률변수 $X$의 확률질량함수가\n$P(X=x)=\begin{cases}\dfrac{x+a}{12}&(x=-2,-1,0)\\[2pt]\dfrac{ax}{12}&(x=1,2)\end{cases}$\n일 때, $E(6X)$의 값을 구하면? [3.7점]
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 확률질량함수의 모든 확률을 더하면 $1$이다. $\dfrac{a-2}{12}+\dfrac{a-1}{12}+\dfrac a{12}+\dfrac a{12}+\dfrac{2a}{12}=1$ $6a-3=12$ $a=\dfrac52$ 이제 기댓값을 구하면 $E(X)=(-2)\dfrac{a-2}{12}+(-1)\dfrac{a-1}{12}+0\cdot\dfrac a{12}+1\cdot\dfrac a{12}+2\cdot\dfrac{2a}{12}$ $=\dfrac{-2a+4-a+1+a+4a}{12}$ $=\dfrac{2a+5}{12}=\dfrac56$이다. 따라서 $E(6X)=6E(X)=6\cdot\dfrac56=5$이다. 따라서 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** 확률질량함수 정규화 a=5/2, E(6X)=5 계산 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
확률질량함수의 모든 확률을 더하면 $1$이다.
$\dfrac{a-2}{12}+\dfrac{a-1}{12}+\dfrac a{12}+\dfrac a{12}+\dfrac{2a}{12}=1$
$6a-3=12$
$a=\dfrac52$
이제 기댓값을 구하면
$E(X)=(-2)\dfrac{a-2}{12}+(-1)\dfrac{a-1}{12}+0\cdot\dfrac a{12}+1\cdot\dfrac a{12}+2\cdot\dfrac{2a}{12}$
$=\dfrac{-2a+4-a+1+a+4a}{12}$
$=\dfrac{2a+5}{12}=\dfrac56$이다.
따라서 $E(6X)=6E(X)=6\cdot\dfrac56=5$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `q05`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 모집단은 정규분포 $N(50,64)$를 따른다고 한다. 크기가 $8$인 표본을 임의추출할 때, 표본평균 $\overline X$에 대하여 $E(\overline X^2)$의 값을 구하면? [3.7점]
~~~

- 원본 선택지: ① $2501$ / ② $2508$ / ③ $2516$ / ④ $2532$ / ⑤ $2564$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 모집단의 평균은 $50$, 분산은 $64$이다. 크기가 $8$인 표본의 표본평균에 대하여 $E(\overline X)=50$ $V(\overline X)=\dfrac{64}{8}=8$이다. 분산의 성질 $V(Y)=E(Y^2)-\{E(Y)\}^2$을 이용하면 $E(\overline X^2)=V(\overline X)+\{E(\overline X)\}^2$ $=8+50^2=2508$이다. 따라서 정답은 ②이다.
- **독립 수학 검산·판정 근거:** N(50,8²) n=8에서 E(Xbar²)=50²+8=2508 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
모집단의 평균은 $50$, 분산은 $64$이다.
크기가 $8$인 표본의 표본평균에 대하여
$E(\overline X)=50$
$V(\overline X)=\dfrac{64}{8}=8$이다.
분산의 성질 $V(Y)=E(Y^2)-\{E(Y)\}^2$을 이용하면
$E(\overline X^2)=V(\overline X)+\{E(\overline X)\}^2$
$=8+50^2=2508$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `q06`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
상자 안에 $4,3,2,1,1$이 각각 적힌 $5$개의 공이 들어 있다. 이 상자에서 $2$개의 공을 임의추출하여 공에 적힌 숫자의 평균을 $\overline X$라 할 때, $E(5\overline X-3)$의 값을 구하면? [3.7점]
~~~

- 원본 선택지: ① $8$ / ② $9$ / ③ $10$ / ④ $11$ / ⑤ $12$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 상자에 있는 공 다섯 개에 적힌 수의 합은 $4+3+2+1+1=11$이므로 전체 평균은 $\dfrac{11}{5}$이다. 두 공을 임의로 뽑을 때, 각 공이 뽑힐 가능성은 같다. 따라서 뽑은 두 공의 평균인 표본평균의 기댓값도 전체 평균과 같아 $E(\overline X)=\dfrac{11}{5}$이다. 기댓값의 성질을 적용하면 $E(5\overline X-3)=5E(\overline X)-3$ $=5\times\dfrac{11}{5}-3=8$이다. 따라서 정답은 ①이다.
- **독립 수학 검산·판정 근거:** 5개 구슬값의 평균 11/5, E(5 Xbar−3)=8 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
상자에 있는 공 다섯 개에 적힌 수의 합은
$4+3+2+1+1=11$이므로 전체 평균은
$\dfrac{11}{5}$이다.

두 공을 임의로 뽑을 때, 각 공이 뽑힐 가능성은 같다.
따라서 뽑은 두 공의 평균인 표본평균의 기댓값도 전체 평균과 같아
$E(\overline X)=\dfrac{11}{5}$이다.

기댓값의 성질을 적용하면
$E(5\overline X-3)=5E(\overline X)-3$
$=5\times\dfrac{11}{5}-3=8$이다.

따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `q07`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 학교 학생들의 통학시간은 평균이 $30$, 표준편차가 $\sigma$인 정규분포를 따른다고 한다. 이 학교 학생들을 대상으로 $16$명을 임의로 추출하여 조사한 통학시간의 표본평균 $\overline X$에 대하여 $P(30\le\overline X\le36)=0.4772$를 만족시키는 $\sigma$의 값을 표준정규분포표를 이용하여 구하면? [4.0점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $8$ / ② $9$ / ③ $10$ / ④ $11$ / ⑤ $12$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 모집단의 평균은 $30$, 표준편차는 $\sigma$이고 표본의 크기는 $16$이다. 따라서 표본평균 $\overline X$에 대하여 $E(\overline X)=30$ $\sigma_{\overline X}=\dfrac{\sigma}{\sqrt{16}}=\dfrac{\sigma}{4}$이다. 주어진 확률을 표준화하면 $P(30\le\overline X\le36)$ $=P\left(0\le Z\le\dfrac{36-30}{\sigma/4}\right)$ $=P\left(0\le Z\le\dfrac{24}{\sigma}\right)=0.4772$이다. 표에서 $P(0\le Z\le2)=0.4772$이므로 $\dfrac{24}{\sigma}=2$, 즉 $\sigma=12$이
- **독립 수학 검산·판정 근거:** 표본평균 표준오차 σ/4, z=(36−30)/(σ/4)=2에서 σ=12 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q7-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
모집단의 평균은 $30$, 표준편차는 $\sigma$이고 표본의 크기는 $16$이다.
따라서 표본평균 $\overline X$에 대하여
$E(\overline X)=30$
$\sigma_{\overline X}=\dfrac{\sigma}{\sqrt{16}}=\dfrac{\sigma}{4}$이다.
주어진 확률을 표준화하면
$P(30\le\overline X\le36)$
$=P\left(0\le Z\le\dfrac{36-30}{\sigma/4}\right)$
$=P\left(0\le Z\le\dfrac{24}{\sigma}\right)=0.4772$이다.
표에서 $P(0\le Z\le2)=0.4772$이므로
$\dfrac{24}{\sigma}=2$, 즉 $\sigma=12$이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `q08`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
연속확률변수 $X$가 갖는 값의 범위는 $0\le X\le a$이고, $X$의 확률밀도함수의 그래프는 다음과 같다.<br>$P(X\le b)-P(X\ge b)=\dfrac13$, $P(X\le1)=\dfrac16$일 때, $a\times b\times c$의 값을 구하면? (단, $a,b,c$는 상수이다.) [4.0점]
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 확률밀도함수 그래프의 전체 넓이는 $1$이다. $P(X\le b)+P(X\ge b)=1$이므로, 주어진 차이와 함께 풀면 $P(X\le b)=\dfrac23$이다. 즉, 왼쪽 삼각형의 넓이에서 $\dfrac12bc=\dfrac23$ $bc=\dfrac43$이다. 또 $P(X\le1)=\dfrac16\lt \dfrac23=P(X\le b)$이므로 $1\lt b$이다. 구간 $0\le x\le b$에서는 그래프가 직선이고 $f(1)=\dfrac cb$이다. 따라서 $0$부터 $1$까지 작은 삼각형의 넓이는 $\dfrac12\cdot1\cdot\dfrac cb=\dfrac16$ $\dfrac cb=\dfrac13$, 즉 $b=3c$이다. 전체 삼각형의 넓이에서도 $\dfrac1
- **독립 수학 검산·판정 근거:** 시각 확인한 삼각 밀도그림의 두 넓이 조건: b=2,c=2/3,a=3, abc=4 일치.
- 원본문제 PNG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q08.png` (원본 실물 육안 확인; 실제 저장 루트 `assets/images/`).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q8-solution-v2.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
확률밀도함수 그래프의 전체 넓이는 $1$이다.
$P(X\le b)+P(X\ge b)=1$이므로, 주어진 차이와 함께 풀면
$P(X\le b)=\dfrac23$이다.
즉, 왼쪽 삼각형의 넓이에서
$\dfrac12bc=\dfrac23$
$bc=\dfrac43$이다.

또 $P(X\le1)=\dfrac16\lt \dfrac23=P(X\le b)$이므로 $1\lt b$이다.
구간 $0\le x\le b$에서는 그래프가 직선이고 $f(1)=\dfrac cb$이다.
따라서 $0$부터 $1$까지 작은 삼각형의 넓이는
$\dfrac12\cdot1\cdot\dfrac cb=\dfrac16$
$\dfrac cb=\dfrac13$, 즉 $b=3c$이다.

전체 삼각형의 넓이에서도
$\dfrac12ac=1$, 즉 $ac=2$이다.
$bc=\dfrac43$, $b=3c$에서
$3c^2=\dfrac43$
$c=\dfrac23$이다. ($c\gt 0$)
따라서 $b=2$, $a=\dfrac2c=3$이다.
$a\times b\times c=3\cdot2\cdot\dfrac23=4$이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `q09`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
집합 $A=\{1,2,3\}$에 대하여 $A$에서 $A$로의 모든 함수 $f$ 중에서 임의로 하나를 택할 때, 치역의 원소의 개수를 확률변수 $X$라고 하자. $E\left(X-\dfrac19\right)$의 값을 구하면? [4.0점]
~~~

- 원본 선택지: ① $1$ / ② $\dfrac59$ / ③ $2$ / ④ $\dfrac{14}9$ / ⑤ $3$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 집합 $A$의 원소가 $3$개이므로 $A$에서 $A$로 가는 함수는 모두 $3^3=27$개이다. 치역의 원소의 개수 $X$는 $1$, $2$, $3$ 중 하나이다. $X=1$인 경우: 상수함수이므로 $3$개이다. $X=2$인 경우: 치역으로 쓸 두 원소를 고르는 방법은 $\binom{3}{2}=3$가지이다. 고른 두 원소가 모두 함숫값으로 나와야 하므로 $2^3-2=6$가지이다. 따라서 $3\cdot6=18$개이다. $X=3$인 경우: 세 함숫값이 모두 달라야 하므로 $3!=6$개이다. 따라서 $P(X=1)=\dfrac3{27}$, $P(X=2)=\dfrac{18}{27}$, $P(X=3)=\dfrac6{27}$이다. $E(X)=1\cdot\dfrac3{27}+2\cdot
- **독립 수학 검산·판정 근거:** 서로 다른 치역 원소 수 1,2,3의 함수 수 (3,18,6), E=19/9; E(X−1/9)=2 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
집합 $A$의 원소가 $3$개이므로 $A$에서 $A$로 가는 함수는 모두 $3^3=27$개이다.
치역의 원소의 개수 $X$는 $1$, $2$, $3$ 중 하나이다.

$X=1$인 경우: 상수함수이므로 $3$개이다.
$X=2$인 경우: 치역으로 쓸 두 원소를 고르는 방법은 $\binom{3}{2}=3$가지이다.
고른 두 원소가 모두 함숫값으로 나와야 하므로 $2^3-2=6$가지이다.
따라서 $3\cdot6=18$개이다.
$X=3$인 경우: 세 함숫값이 모두 달라야 하므로 $3!=6$개이다.

따라서
$P(X=1)=\dfrac3{27}$, $P(X=2)=\dfrac{18}{27}$, $P(X=3)=\dfrac6{27}$이다.
$E(X)=1\cdot\dfrac3{27}+2\cdot\dfrac{18}{27}+3\cdot\dfrac6{27}$
$=\dfrac{57}{27}=\dfrac{19}{9}$이다.
$E\left(X-\dfrac19\right)=\dfrac{19}{9}-\dfrac19=2$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `q10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
이항분포 $B(n,p)$를 따르는 확률변수 $X$가 다음 조건을 모두 만족시킬 때, $n+5p$의 값을 구한 것은? (단, $0<p<1$이다.) [4.0점]<br><div class="question-note-box">(가) $P(X=1)=\dfrac{40}{3}\times P(X=0)$<br>(나) $E(X)=8$</div>
~~~

- 원본 선택지: ① $21$ / ② $22$ / ③ $23$ / ④ $24$ / ⑤ $25$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > $X\sim B(n,p)$이므로 $P(X=0)=(1-p)^n$ $P(X=1)=np(1-p)^{n-1}$이다. 조건 (가)의 양변을 $P(X=0)\gt 0$으로 나누면 $\dfrac{P(X=1)}{P(X=0)}=\dfrac{np}{1-p}=\dfrac{40}{3}$이다. 조건 (나)에서 $np=E(X)=8$이므로 $\dfrac8{1-p}=\dfrac{40}{3}$ $1-p=\dfrac35$, $p=\dfrac25$이다. $n=\dfrac8p=8\cdot\dfrac52=20$이므로 $n+5p=20+5\cdot\dfrac25=22$이다. 따라서 정답은 ②이다.
- **독립 수학 검산·판정 근거:** B(n,p)에서 np=8, P1/P0=np/(1−p)=40/3이므로 p=2/5,n=20; 22 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
$X\sim B(n,p)$이므로
$P(X=0)=(1-p)^n$
$P(X=1)=np(1-p)^{n-1}$이다.
조건 (가)의 양변을 $P(X=0)\gt 0$으로 나누면
$\dfrac{P(X=1)}{P(X=0)}=\dfrac{np}{1-p}=\dfrac{40}{3}$이다.
조건 (나)에서 $np=E(X)=8$이므로
$\dfrac8{1-p}=\dfrac{40}{3}$
$1-p=\dfrac35$, $p=\dfrac25$이다.
$n=\dfrac8p=8\cdot\dfrac52=20$이므로
$n+5p=20+5\cdot\dfrac25=22$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `q11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 공장에서 생산되는 과자 $1$봉지의 무게는 평균이 $124\rm\,g$, 표준편차가 $6\rm\,g$인 정규분포를 따른다고 한다. 이 공장에서 생산된 과자 중 임의추출한 $9$개를 묶어서 한 세트로 판매한다고 할 때, 한 세트의 무게가 $1134\rm\,g$ 이하일 확률을 표준정규분포표를 이용하여 구하면? (단, 포장 재료의 무게는 제외) [4.0점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.3413$ / ② $0.4772$ / ③ $0.8413$ / ④ $0.9332$ / ⑤ $0.9772$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 과자 한 봉지의 무게를 $X_i$라 하고, $9$개를 합친 무게를 $W=X_1+\cdots+X_9$라 하자. 독립적으로 추출한 무게의 합에 대하여 $E(W)=9\cdot124=1116$ $V(W)=9\cdot6^2=324$ $\sigma_W=\sqrt{324}=18$이다. 따라서 $W$는 평균 $1116$, 표준편차 $18$인 정규분포를 따른다. $P(W\le1134)=P\left(Z\le\dfrac{1134-1116}{18}\right)$ $=P(Z\le1)$ $=0.5+P(0\le Z\le1)$ $=0.5+0.3413=0.8413$이다. 따라서 정답은 ③이다.
- **독립 수학 검산·판정 근거:** 정규 독립합 9개의 평균 1116, 표준편차18, z=1; 확률 0.8413 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q11-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
과자 한 봉지의 무게를 $X_i$라 하고, $9$개를 합친 무게를 $W=X_1+\cdots+X_9$라 하자.
독립적으로 추출한 무게의 합에 대하여
$E(W)=9\cdot124=1116$
$V(W)=9\cdot6^2=324$
$\sigma_W=\sqrt{324}=18$이다.
따라서 $W$는 평균 $1116$, 표준편차 $18$인 정규분포를 따른다.
$P(W\le1134)=P\left(Z\le\dfrac{1134-1116}{18}\right)$
$=P(Z\le1)$
$=0.5+P(0\le Z\le1)$
$=0.5+0.3413=0.8413$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `q12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
정규분포를 따르는 어느 모집단에서 표본을 임의추출하여 추정한 모평균 $m$에 대한 신뢰도 $a\%$의 신뢰구간이 $a\le m\le b$일 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [4.0점]<br>&lt;보기&gt;<br><div class="question-note-box">ㄱ. 표본의 크기가 일정할 때, 신뢰도가 높아지면 $b-a$ 값은 작아진다.<br>ㄴ. 신뢰도가 일정할 때, 표본의 크기가 커지면 $b-a$ 값은 작아진다.<br>ㄷ. $b-a$ 값이 일정할 때, 신뢰도가 높아지면 표본의 크기가 커진다.</div>
~~~

- 원본 선택지: ① ㄱ / ② ㄴ / ③ ㄷ / ④ ㄴ, ㄷ / ⑤ ㄱ, ㄴ, ㄷ
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 모표준편차가 $\sigma$, 표본의 크기가 $n$, 신뢰도에 따른 양의 신뢰상수가 $z$일 때 신뢰구간의 길이는 $L=b-a=2z\dfrac{\sigma}{\sqrt n}$이다. ㄱ. 표본의 크기 $n$이 일정하면 신뢰도가 높아질수록 $z$가 커진다. 따라서 $L$은 커지므로 ㄱ은 거짓이다. ㄴ. 신뢰도가 일정하면 $z$는 일정하다. $n$이 커지면 $\sqrt n$이 커지므로 $L$은 작아진다. 따라서 ㄴ은 참이다. ㄷ. $L$이 일정하려면 $\dfrac z{\sqrt n}$이 일정해야 한다. 신뢰도가 높아져 $z$가 커지면 $\sqrt n$도 커져야 하므로 $n$은 커진다. 따라서 ㄷ은 참이다. 옳은 것은 ㄴ, ㄷ이다. 따라서 정답은 ④이다.
- **독립 수학 검산·판정 근거:** 95% 모평균 신뢰구간 길이의 표본크기/표준편차 의존성 판단 ㄴ·ㄷ 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
모표준편차가 $\sigma$, 표본의 크기가 $n$, 신뢰도에 따른 양의 신뢰상수가 $z$일 때 신뢰구간의 길이는
$L=b-a=2z\dfrac{\sigma}{\sqrt n}$이다.

ㄱ. 표본의 크기 $n$이 일정하면 신뢰도가 높아질수록 $z$가 커진다.
따라서 $L$은 커지므로 ㄱ은 거짓이다.

ㄴ. 신뢰도가 일정하면 $z$는 일정하다.
$n$이 커지면 $\sqrt n$이 커지므로 $L$은 작아진다. 따라서 ㄴ은 참이다.

ㄷ. $L$이 일정하려면 $\dfrac z{\sqrt n}$이 일정해야 한다.
신뢰도가 높아져 $z$가 커지면 $\sqrt n$도 커져야 하므로 $n$은 커진다. 따라서 ㄷ은 참이다.

옳은 것은 ㄴ, ㄷ이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `q13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
표준편차가 $\sigma$인 정규분포를 따르는 모집단에서 크기가 $9$인 표본을 임의추출하여 구한 모평균 $m$에 대한 신뢰도 $95\%$의 신뢰구간이 $40.2\le m\le59.8$이다. 같은 표본을 이용하여 구한 모평균 $m$에 대한 신뢰도 $99\%$의 신뢰구간에 속하는 자연수의 개수를 구하면? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0\le Z\le1.96)=0.475$, $P(0\le Z\le2.58)=0.495$로 계산한다.) [4.0점]
~~~

- 원본 선택지: ① $21$ / ② $22$ / ③ $23$ / ④ $24$ / ⑤ $25$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 95% 신뢰구간의 중심이 표본평균이므로 $\overline x=\dfrac{40.2+59.8}{2}=50$이다. 오차한계는 $59.8-50=9.8$이다. 신뢰도 95%에 대응하는 신뢰상수는 $1.96$이고 $n=9$이므로 $1.96\cdot\dfrac{\sigma}{\sqrt9}=9.8$ $\dfrac{\sigma}{3}=5$이다. 같은 표본으로 신뢰도를 99%로 높이면 신뢰상수는 $2.58$이다. 새 오차한계는 $2.58\cdot\dfrac{\sigma}{3}=2.58\cdot5=12.9$이다. 따라서 신뢰구간은 $50-12.9\le m\le50+12.9$ $37.1\le m\le62.9$이다. 이 구간에 속하는 자연수는 $38,39,\ldots,62$이므로 $62-38
- **독립 수학 검산·판정 근거:** 95% 중심 50·표준오차 5, 99% 반폭 12.9: 구간 [37.1,62.9]의 자연수 25개 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q13-solution-v2.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
95% 신뢰구간의 중심이 표본평균이므로
$\overline x=\dfrac{40.2+59.8}{2}=50$이다.
오차한계는 $59.8-50=9.8$이다.
신뢰도 95%에 대응하는 신뢰상수는 $1.96$이고 $n=9$이므로
$1.96\cdot\dfrac{\sigma}{\sqrt9}=9.8$
$\dfrac{\sigma}{3}=5$이다.

같은 표본으로 신뢰도를 99%로 높이면 신뢰상수는 $2.58$이다.
새 오차한계는
$2.58\cdot\dfrac{\sigma}{3}=2.58\cdot5=12.9$이다.
따라서 신뢰구간은
$50-12.9\le m\le50+12.9$
$37.1\le m\le62.9$이다.
이 구간에 속하는 자연수는 $38,39,\ldots,62$이므로
$62-38+1=25$개이다.
따라서 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `q14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
확률변수 $X$는 정규분포 $N(m,4^2)$을 따르고, 확률변수 $Y$는 정규분포 $N(20,\sigma^2)$을 따른다. 확률변수 $X$의 확률밀도함수 $f(x)$와 두 확률변수 $X,Y$가 다음 조건을 만족시킨다.<br><div class="question-table-wrap"><table class="question-table"><tbody><tr><td>(가) 모든 실수 $x$에 대하여 $f(x+7)=f(23-x)$이다.</td></tr><tr><td>(나) $P(X\ge17)=P(Y\le17)$</td></tr></tbody></table></div><br>$P(X>m-\sigma)$의 값을 표준정규분포표를 이용하여 구한 것은? (단, $\sigma>0$이다.) [4.2점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.6915$ / ② $0.8413$ / ③ $0.9332$ / ④ $0.9772$ / ⑤ $0.9938$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 정규분포의 확률밀도함수는 평균을 중심으로 좌우 대칭이다. 모든 $x$에 대하여 $f(x+7)=f(23-x)$이고 $(x+7)+(23-x)=30$이므로 대칭축은 $15$이다. 따라서 $m=15$이다. $X$의 표준편차는 $4$이므로 $P(X\ge17)=P\left(Z\ge\dfrac{17-15}{4}\right)$ $=P(Z\ge0.5)=0.5-0.1915=0.3085$이다. 조건 (나)에 의해 $P(Y\le17)=P\left(Z\le\dfrac{17-20}{\sigma}\right)=0.3085$이다. $P(Z\le-0.5)=0.3085$이므로 $-\dfrac3{\sigma}=-0.5$, 즉 $\sigma=6$이다. 그러므로 $P(X\gt m-\sigma)=P(X\gt 1
- **독립 수학 검산·판정 근거:** 두 정규밀도 대칭축으로 m=15, σY=6, z=−1.5 꼬리 확률 0.9332 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q14-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
정규분포의 확률밀도함수는 평균을 중심으로 좌우 대칭이다.
모든 $x$에 대하여 $f(x+7)=f(23-x)$이고
$(x+7)+(23-x)=30$이므로 대칭축은 $15$이다.
따라서 $m=15$이다.

$X$의 표준편차는 $4$이므로
$P(X\ge17)=P\left(Z\ge\dfrac{17-15}{4}\right)$
$=P(Z\ge0.5)=0.5-0.1915=0.3085$이다.
조건 (나)에 의해
$P(Y\le17)=P\left(Z\le\dfrac{17-20}{\sigma}\right)=0.3085$이다.
$P(Z\le-0.5)=0.3085$이므로
$-\dfrac3{\sigma}=-0.5$, 즉 $\sigma=6$이다.

그러므로
$P(X\gt m-\sigma)=P(X\gt 15-6)$
$=P\left(Z\gt \dfrac{9-15}{4}\right)$
$=P(Z\gt -1.5)=0.5+0.4332=0.9332$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `q15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 과수원에서 수확한 키위의 무게는 평균 $50\rm\,g$, 표준편차 $5\rm\,g$인 정규분포를 따른다고 한다. 이 키위 중 무게가 $60\rm\,g$ 이상인 것을 $1$등급 상품으로 정한다. 이 과수원에서 수확한 키위 중 $2500$개를 임의로 선택할 때 $1$등급 상품이 $57$개 이상일 확률을 아래 표준정규분포표를 이용하여 구한 것은? [4.2점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.19</td></tr><tr><td>1.0</td><td>0.34</td></tr><tr><td>1.5</td><td>0.43</td></tr><tr><td>2.0</td><td>0.48</td></tr><tr><td>2.5</td><td>0.49</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.01$ / ② $0.02$ / ③ $0.07$ / ④ $0.16$ / ⑤ $0.31$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 키위 한 개의 무게를 $X$라 하면 $X\sim N(50,5^2)$이다. 1등급일 확률 $p$는 $p=P(X\ge60)$ $=P\left(Z\ge\dfrac{60-50}{5}\right)$ $=P(Z\ge2)=0.5-0.48=0.02$이다. 2500개 중 1등급인 키위의 개수를 $Y$라 하면 $Y\sim B(2500,0.02)$로 나타낼 수 있다. $E(Y)=2500\cdot0.02=50$ $V(Y)=2500\cdot0.02\cdot0.98=49$ $\sigma_Y=\sqrt{49}=7$이다. 이항분포를 정규분포로 근사하면 $P(Y\ge57)\approx P\left(Z\ge\dfrac{57-50}{7}\right)$ $=P(Z\ge1)$ $\approx0.5-0.34=0
- **독립 수학 검산·판정 근거:** B(2500,.02)를 N(50,7²) 근사, 57 이상 0.16 일치(연속성 무보정).
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q15-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
키위 한 개의 무게를 $X$라 하면 $X\sim N(50,5^2)$이다.
1등급일 확률 $p$는
$p=P(X\ge60)$
$=P\left(Z\ge\dfrac{60-50}{5}\right)$
$=P(Z\ge2)=0.5-0.48=0.02$이다.

2500개 중 1등급인 키위의 개수를 $Y$라 하면
$Y\sim B(2500,0.02)$로 나타낼 수 있다.
$E(Y)=2500\cdot0.02=50$
$V(Y)=2500\cdot0.02\cdot0.98=49$
$\sigma_Y=\sqrt{49}=7$이다.

이항분포를 정규분포로 근사하면
$P(Y\ge57)\approx P\left(Z\ge\dfrac{57-50}{7}\right)$
$=P(Z\ge1)$
$\approx0.5-0.34=0.16$이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `q16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 공장에서 생산되는 제품의 길이 $X$는 평균이 $m$이고 표준편차가 $4$인 정규분포를 따른다고 한다. $P(m\le X\le a)=0.3413$일 때, 이 공장에서 생산된 제품 중에서 임의추출한 제품 $16$개의 길이의 표본평균이 $(a-2)$ 이상일 확률을 표준정규분포표를 이용하여 구하면? (단, $a$는 상수이고, 길이의 단위는 $\rm cm$이다.) [4.2점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.0062$ / ② $0.0228$ / ③ $0.0668$ / ④ $0.1587$ / ⑤ $0.3085$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 한 제품의 길이 $X$는 평균 $m$, 표준편차 $4$인 정규분포를 따른다. $P(m\le X\le a)=P\left(0\le Z\le\dfrac{a-m}{4}\right)=0.3413$이다. 표에서 $P(0\le Z\le1)=0.3413$이므로 $\dfrac{a-m}{4}=1$ $a=m+4$이다. 표본의 크기가 $16$이므로 표본평균 $\overline X$는 $E(\overline X)=m$ $\sigma_{\overline X}=\dfrac4{\sqrt{16}}=1$이다. $a-2=m+2$이므로 $P(\overline X\ge a-2)=P(\overline X\ge m+2)$ $=P\left(Z\ge\dfrac{m+2-m}{1}\right)$ $=P(Z\ge2)=0.
- **독립 수학 검산·판정 근거:** 모정규 표본평균에서 a=m+4, n=16의 표준오차1; z=2, 0.0228 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q16-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
한 제품의 길이 $X$는 평균 $m$, 표준편차 $4$인 정규분포를 따른다.
$P(m\le X\le a)=P\left(0\le Z\le\dfrac{a-m}{4}\right)=0.3413$이다.
표에서 $P(0\le Z\le1)=0.3413$이므로
$\dfrac{a-m}{4}=1$
$a=m+4$이다.

표본의 크기가 $16$이므로 표본평균 $\overline X$는
$E(\overline X)=m$
$\sigma_{\overline X}=\dfrac4{\sqrt{16}}=1$이다.
$a-2=m+2$이므로
$P(\overline X\ge a-2)=P(\overline X\ge m+2)$
$=P\left(Z\ge\dfrac{m+2-m}{1}\right)$
$=P(Z\ge2)=0.5-0.4772=0.0228$이다.
따라서 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `q17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 지역 고등학생의 수학 시험 점수는 표준편차가 $10$인 정규분포를 따른다고 한다. 이 지역 고등학생 중에서 $400$명을 임의추출하여 모평균 $m$을 신뢰도 $95\%$, $a\%$로 추정한 신뢰구간의 길이는 각각 $l$, $\dfrac34l$이다. $a$의 값을 표준정규분포표를 이용하여 구하면? [4.2점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.190</td></tr><tr><td>1.0</td><td>0.340</td></tr><tr><td>1.5</td><td>0.430</td></tr><tr><td>2.0</td><td>0.475</td></tr><tr><td>2.5</td><td>0.495</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $38$ / ② $64$ / ③ $86$ / ④ $95$ / ⑤ $99$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 신뢰구간의 길이는 신뢰상수를 $z$라 할 때 $L=2z\dfrac{\sigma}{\sqrt n}$이다. 현재 $\sigma=10$, $n=400$이므로 $L=2z\cdot\dfrac{10}{20}=z$이다. 신뢰도 95%에 대해서는 표에서 $z=2$이므로 $l=2$이다. 다른 신뢰도의 구간 길이가 $\dfrac34l$이므로 $L_a=\dfrac34\cdot2=1.5$이다. 따라서 새로운 신뢰상수는 $z_a=1.5$이다. 표에서 $P(0\le Z\le1.5)=0.430$이므로 $a\%=P(-1.5\le Z\le1.5)$ $=2\cdot0.430=0.860$이다. 따라서 $a=86$이다. 따라서 정답은 ③이다.
- **독립 수학 검산·판정 근거:** 오차한계 비율 (z_a/z95)=3/4에서 z_a=1.5, 신뢰도 86% 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
신뢰구간의 길이는 신뢰상수를 $z$라 할 때
$L=2z\dfrac{\sigma}{\sqrt n}$이다.
현재 $\sigma=10$, $n=400$이므로
$L=2z\cdot\dfrac{10}{20}=z$이다.

신뢰도 95%에 대해서는 표에서 $z=2$이므로 $l=2$이다.
다른 신뢰도의 구간 길이가 $\dfrac34l$이므로
$L_a=\dfrac34\cdot2=1.5$이다.
따라서 새로운 신뢰상수는 $z_a=1.5$이다.
표에서 $P(0\le Z\le1.5)=0.430$이므로
$a\%=P(-1.5\le Z\le1.5)$
$=2\cdot0.430=0.860$이다.
따라서 $a=86$이다.
따라서 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `q18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
이산확률변수 $X$에 대한 확률질량함수가 $P(X=n)={}_{100}C_n\left(\dfrac15\right)^n\left(\dfrac45\right)^{100-n}$ $(n=0,1,2,\ldots,100)$으로 주어질 때, 함수 $f(x)$를 다음과 같이 정의하자.<br><div class="question-note-box">$f(x)=P(X\ge4x+20)\quad(-5\le x\le20)$</div><br>이때 보기에서 옳은 것을 모두 고른 것은? [4.5점]<br>&lt;보기&gt;<br><div class="question-note-box">ㄱ. 확률변수 $X$의 분산은 $16$이다.<br>ㄴ. $x_1\le x_2$이면 $f(x_1)\le f(x_2)$이다.<br>ㄷ. $f(-x)+f(x)<1$을 만족하는 $x$가 적어도 하나 존재한다.</div>
~~~

- 원본 선택지: ① ㄱ / ② ㄷ / ③ ㄱ, ㄴ / ④ ㄱ, ㄷ / ⑤ ㄱ, ㄴ, ㄷ
- 원본 정답: **④**
- 기존 solution 정확 발췌: > ㄷ은 큰 이항확률을 직접 계산하지 않고, 기댓값 $E(X)=20$을 여러 꼬리확률의 합으로 바꾸어 존재성을 확인한다. $X\sim B\left(100,\dfrac15\right)$이므로 $E(X)=20$, $V(X)=16$이다. 또한 $f(x)=P(X\ge4x+20)$이다. ㄱ은 분산을 계산하고, ㄴ은 $x$가 커질수록 사건 $X\ge4x+20$이 작아지는 것을 이용한다. ㄷ은 $4x+20$이 반정수가 되도록 몇 개의 $x$를 잡아 확률들을 한꺼번에 비교한다. 먼저 $V(X)=100\times\dfrac15\times\dfrac45=16$ 이므로 ㄱ은 참이다. 또 $x_1\le x_2$이면 $4x_1+20\le4x_2+20$이므로 $\{X\ge4x_2+20\}\subset
- **독립 수학 검산·판정 근거:** B(100,1/5), V=16; f는 비증가. 20개 꼬리쌍의 합<20으로 적어도 하나가 1 미만; ㄱ·ㄷ 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
ㄷ은 큰 이항확률을 직접 계산하지 않고, 기댓값 $E(X)=20$을 여러 꼬리확률의 합으로 바꾸어 존재성을 확인한다.

$X\sim B\left(100,\dfrac15\right)$이므로 $E(X)=20$, $V(X)=16$이다. 또한 $f(x)=P(X\ge4x+20)$이다.

ㄱ은 분산을 계산하고, ㄴ은 $x$가 커질수록 사건 $X\ge4x+20$이 작아지는 것을 이용한다. ㄷ은 $4x+20$이 반정수가 되도록 몇 개의 $x$를 잡아 확률들을 한꺼번에 비교한다.

먼저
$V(X)=100\times\dfrac15\times\dfrac45=16$
이므로 ㄱ은 참이다.

또 $x_1\le x_2$이면 $4x_1+20\le4x_2+20$이므로
$\{X\ge4x_2+20\}\subseteq\{X\ge4x_1+20\}$이다.
따라서 $f(x_1)\ge f(x_2)$이므로 ㄴ은 거짓이다.

이제 ㄷ을 확인하자.
$j=0,1,\ldots,19$에 대하여
$x_j=\dfrac{j+\dfrac12}{4}$
로 두면 $0<x_j<5$이므로 $x_j$와 $-x_j$는 모두 $f$의 정의역에 들어간다.
그리고 $X$는 정수값만 가지므로
$f(-x_j)=P(X\ge20-j)$,
$f(x_j)=P(X\ge21+j)$이다.

따라서 이 20개의 합을 모두 더하면
$\displaystyle\sum_{j=0}^{19}\{f(-x_j)+f(x_j)\}
=P(X\ge1)+P(X\ge2)+\cdots+P(X\ge40)$
이 된다.

한편 기댓값의 정의에서
$E(X)=1P(X=1)+2P(X=2)+\cdots+100P(X=100)$이다.
각 항의 계수만큼 같은 확률을 나누어 쓰면
$E(X)=P(X\ge1)+P(X\ge2)+\cdots+P(X\ge100)=20$
으로 정리할 수 있다.

그러므로
$P(X\ge1)+\cdots+P(X\ge40)<20$
이다. 실제로 $P(X\ge41),\ldots,P(X\ge100)$이 모두 음수가 아니고, 그중 양수인 항이 있기 때문이다.

따라서 20개의 수
$f(-x_0)+f(x_0),\ldots,f(-x_{19})+f(x_{19})$
의 합이 $20$보다 작으므로, 그중 적어도 하나는 $1$보다 작다.
즉 $f(-x)+f(x)<1$을 만족하는 $x$가 적어도 하나 존재하므로 ㄷ은 참이다.

옳은 것은 ㄱ, ㄷ이다.
따라서 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `q19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
어느 동물병원에 입원한 반려견의 몸무게를 확률변수 $X$라 할 때, 정규분포를 따르고 다음 조건을 만족한다고 한다.<br><div class="question-note-box">$P(X\ge4.5)=\dfrac12$<br>$P(X\le5)+P(Z\le-1)=1$</div><br>반려견 중 임의추출한 $25$마리의 몸무게의 표본평균을 $\overline X$라 할 때, $P(\overline X\ge4.6)$의 값을 표준정규분포표를 이용하여 구하면? (단, 몸무게의 단위는 $\rm kg$이다.) [4.5점]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr><tr><td>2.5</td><td>0.4938</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.1587$ / ② $0.1915$ / ③ $0.3085$ / ④ $0.3413$ / ⑤ $0.4332$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 정규분포는 평균을 기준으로 좌우 대칭이다. $P(X\ge4.5)=\dfrac12$이므로 모집단 평균은 $m=4.5$이다. $P(X\le5)+P(Z\le-1)=1$이고 $P(Z\le-1)=0.5-0.3413=0.1587$이므로 $P(X\le5)=1-0.1587=0.8413$이다. 또 $P(Z\le1)=0.8413$이므로 모집단 표준편차 $\sigma$는 $\dfrac{5-4.5}{\sigma}=1$ $\sigma=0.5$이다. 25마리의 몸무게의 표본평균 $\overline X$는 $E(\overline X)=4.5$ $\sigma_{\overline X}=\dfrac{0.5}{\sqrt{25}}=0.1$이다. 따라서 $P(\overline X\ge4.6)=P\left(Z\
- **독립 수학 검산·판정 근거:** 정규분포의 m=4.5, σ=.5, n=25 표준오차.1, 오른쪽 z=1 꼬리 .1587 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q19-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
정규분포는 평균을 기준으로 좌우 대칭이다.
$P(X\ge4.5)=\dfrac12$이므로 모집단 평균은
$m=4.5$이다.

$P(X\le5)+P(Z\le-1)=1$이고
$P(Z\le-1)=0.5-0.3413=0.1587$이므로
$P(X\le5)=1-0.1587=0.8413$이다.
또 $P(Z\le1)=0.8413$이므로 모집단 표준편차 $\sigma$는
$\dfrac{5-4.5}{\sigma}=1$
$\sigma=0.5$이다.

25마리의 몸무게의 표본평균 $\overline X$는
$E(\overline X)=4.5$
$\sigma_{\overline X}=\dfrac{0.5}{\sqrt{25}}=0.1$이다.
따라서
$P(\overline X\ge4.6)=P\left(Z\ge\dfrac{4.6-4.5}{0.1}\right)$
$=P(Z\ge1)=0.5-0.3413=0.1587$이다.
따라서 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q20 — UPGRADE / SOURCE_FIDELITY_HOLD

- qid/source ordinal: `20`/20; sourceQid: `q20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
정규분포 $N(m,\sigma^2)$을 따르는 모집단에서 크기가 $n_1$인 표본을 임의추출하여 신뢰도 $95\%$로 추정한 모평균 $m$의 신뢰구간의 길이는 $l_1$이고, 크기가 $n_2$인 표본을 임의추출하여 신뢰도 $99\%$로 추정한 모평균의 신뢰구간의 길이는 $l_2$라고 한다. $\dfrac{n_2}{n_1}=25$라 할 때, $\dfrac{l_1}{l_2}$의 값을 구하면? (단, $P(0\le Z\le2)=0.475$, $P(0\le Z\le2.5)=0.495$로 계산한다.) [4.5점]
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 신뢰구간의 길이는 신뢰상수 $z$와 표본 크기 $n$에 대해 $L=2z\dfrac{\sigma}{\sqrt n}$이다. 문제의 표에서 신뢰도 95%는 $z=2$, 99%는 $z=2.5$이므로 $l_1=2\cdot2\cdot\dfrac{\sigma}{\sqrt{n_1}}$ $l_2=2\cdot2.5\cdot\dfrac{\sigma}{\sqrt{n_2}}$이다. 두 길이를 나누면 $\dfrac{l_1}{l_2}=\dfrac{2}{2.5}\sqrt{\dfrac{n_2}{n_1}}$이다. $\dfrac{n_2}{n_1}=25$이므로 $\dfrac{l_1}{l_2}=\dfrac45\cdot\sqrt{25}=\dfrac45\cdot5=4$이다. 따라서 정답은 ④이다.
- **독립 수학 검산·판정 근거:** UPGRADE: 신뢰도 99%에 z=2.5 및 P(0≤Z≤2.5)=.495를 동시에 지정한 표가 틀림. 실제 z=.2.576, 결과 비율 약3.80; 원답 4는 가상 표 관행에서만 성립.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
신뢰구간의 길이는 신뢰상수 $z$와 표본 크기 $n$에 대해
$L=2z\dfrac{\sigma}{\sqrt n}$이다.
문제의 표에서 신뢰도 95%는 $z=2$, 99%는 $z=2.5$이므로
$l_1=2\cdot2\cdot\dfrac{\sigma}{\sqrt{n_1}}$
$l_2=2\cdot2.5\cdot\dfrac{\sigma}{\sqrt{n_2}}$이다.
두 길이를 나누면
$\dfrac{l_1}{l_2}=\dfrac{2}{2.5}\sqrt{\dfrac{n_2}{n_1}}$이다.
$\dfrac{n_2}{n_1}=25$이므로
$\dfrac{l_1}{l_2}=\dfrac45\cdot\sqrt{25}=\dfrac45\cdot5=4$이다.
따라서 정답은 ④이다.
~~~

#### UPGRADE — 원본 분리 수정 제안(출고 미적용)

- **오류 및 왜 중요한가:** 95%/99% 표준정규 임계값 대응이 틀린 표: P(0≤Z≤2.5)=.495라고 했지만 실제는 .4938, 99%에서는 z≈2.576(표에서는 2.58)이 필요함. 출제자가 제공한 가상 계산 규칙하에서만 ④ 4를 얻게 됨.
- **원문/선택지 수정안:** 괄호의 조건을 `P(0≤Z≤1.96)=0.475, P(0≤Z≤2.58)=0.495`로 바로잡고, ④ 보기를 `$3.80$`으로 바꾼다. 문제 끝을 `소수 둘째 자리까지 구하면?`으로 변경한다.
- **교정된 학생용 완전 풀이:**

신뢰구간의 길이는 L=2zσ/√n 이다. 첫 구간은 신뢰도 95%이므로 l1=2×1.96σ/√n1, 둘째는 99%이므로 l2=2×2.58σ/√n2이다. 따라서 l1/l2=(1.96/2.58)√(n2/n1)=(1.96/2.58)×5≈3.79845≈3.80이다. 정답은 수정된 ④이다.

- 수정 후 정답: **④ (3.80)**.
- 판정: **원문 지시표 및 보기 수정 전 SOURCE_FIDELITY_HOLD**. 원본 JS·보기·원답·SVG는 건드리지 않음.

- 문항 상태: **UPGRADE | READ_EVIDENCED | SOURCE_FIDELITY_HOLD | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q21 — UPGRADE / SOURCE_FIDELITY_HOLD

- qid/source ordinal: `21`/21; sourceQid: `q21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
[서술형 1] 한 개의 주사위를 $n$번 던져 나온 눈의 수가 소수인 횟수를 확률변수 $X$라고 하자. $P\left(\left|X-\dfrac n2\right|\le9\right)\ge0.86$을 만족시키는 자연수 $n$의 최댓값을 표준정규분포표를 이용하여 구하는 과정을 구체적으로 서술하시오. (단, $n\ge40$이다.) [6점, 부분점수 있음]<br><div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.19</td></tr><tr><td>1.0</td><td>0.34</td></tr><tr><td>1.5</td><td>0.43</td></tr><tr><td>2.0</td><td>0.48</td></tr><tr><td>2.5</td><td>0.49</td></tr></tbody></table></div>
~~~

- 원본 선택지: 서술형 — 없음
- 원본 정답: **144**
- 기존 solution 정확 발췌: > 주사위 한 번에 소수인 눈은 $2,3,5$의 $3$개이므로 소수가 나올 확률은 $\dfrac36=\dfrac12$이다. 따라서 $X\sim B\left(n,\dfrac12\right)$이고 $E(X)=n\cdot\dfrac12=\dfrac n2$, $V(X)=n\cdot\dfrac12\cdot\dfrac12=\dfrac n4$, $\sigma_X=\dfrac{\sqrt n}{2}$이다. $n\ge40$이므로 이항분포를 정규분포로 근사하여 주어진 조건을 표준화한다. $P\left(\left|X-\dfrac n2\right|\le9\right)$ $\approx P\left(\left|Z\right|\le\dfrac{9}{\sqrt n/2}\right)$ $=P\left(-\
- **독립 수학 검산·판정 근거:** UPGRADE: 원문의 이항확률 부등식은 정확 계산 시 n 최댓값 164(P=.862338)인데, 연속성 보정 없는 정규근사에서는 144. 정규근사 값임을 문제에서 명시해야 함.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q21-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
주사위 한 번에 소수인 눈은 $2,3,5$의 $3$개이므로 소수가 나올 확률은 $\dfrac36=\dfrac12$이다.
따라서 $X\sim B\left(n,\dfrac12\right)$이고
$E(X)=n\cdot\dfrac12=\dfrac n2$,
$V(X)=n\cdot\dfrac12\cdot\dfrac12=\dfrac n4$,
$\sigma_X=\dfrac{\sqrt n}{2}$이다.

$n\ge40$이므로 이항분포를 정규분포로 근사하여 주어진 조건을 표준화한다.
$P\left(\left|X-\dfrac n2\right|\le9\right)$
$\approx P\left(\left|Z\right|\le\dfrac{9}{\sqrt n/2}\right)$
$=P\left(-\dfrac{18}{\sqrt n}\le Z\le\dfrac{18}{\sqrt n}\right)$이다.

표에서 $P(0\le Z\le1.5)=0.43$이므로
$P(-1.5\le Z\le1.5)=2\cdot0.43=0.86$이다.
중앙에 대칭인 구간의 확률은 구간의 폭이 넓을수록 커지므로, 정규근사에서
$\dfrac{18}{\sqrt n}\ge1.5$이어야 한다.
$18\ge1.5\sqrt n$
$\sqrt n\le12$
$n\le144$이다.
$n=144$는 $n\ge40$도 만족하므로 구하는 자연수 $n$의 최댓값은 $144$이다.
~~~

#### UPGRADE — 원본 분리 수정 제안(출고 미적용)

- **오류 및 왜 중요한가:** 부등식이 근사가 아닌 정확한 P로 제시되었는데, 원래 이항분포를 정확 계산하면 최대 n=164. 무보정 정규근사로 구한 144는 정확한 최대값이 아님. 홀짝 n의 중앙구간 경계가 달라 단조성이 단순하지 않음.
- **원문/선택지 수정안:** `표준정규분포표를 이용하여` 다음에 `이항분포를 정규분포로 근사하고 연속성 보정은 하지 않는 조건에서, 위 부등식을 만족시키는 것으로 근사되는`을 삽입해 출제의 근사 기준을 명시한다. 원래 정확 부등식으로 유지할 경우 정답을 164로 교체하고 이항확률 계산식을 요구한다.
- **교정된 학생용 완전 풀이:**

소수 눈은 2,3,5이므로 X~B(n,1/2), μ=n/2, σ=√n/2. 무보정 정규근사에서는 P(|X−n/2|≤9)≈P(|Z|≤18/√n)이다. 제시된 표에서 중앙확률 .86은 |Z|≤1.5이므로 18/√n≥1.5, n≤144. 따라서 **무보정 정규근사 기준의** 최대는 144다. 다만 원문에 적힌 **정확한** 부등식에서는 P(|B(164,.5)−82|≤9)≈0.862338≥.86이고, n=166에서는 ≈0.859936<.86; 홀수 n도 164를 넘어서부터 .86 미만이다. 정확 최대는 164이므로 조건을 반드시 구분한다.

- 수정 후 정답: **144 (정규근사 기준); 원문 정확 조건이면 164**.
- 판정: **근사 규칙/정답 범위 확정 전 SOURCE_FIDELITY_HOLD**. 원본 JS·보기·원답·SVG는 건드리지 않음.

- 문항 상태: **UPGRADE | READ_EVIDENCED | SOURCE_FIDELITY_HOLD | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q22 — KEEP

- qid/source ordinal: `22`/22; sourceQid: `q22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
[서술형 2] 주머니 속에 흰 구슬 $4$개, 검은 구슬 $6$개가 들어 있다. $1$이 적힌 카드 $2$장과 $2$가 적힌 카드 $1$장 중 임의의 카드를 한 장 선택하여 카드에 적힌 수만큼 주머니에서 구슬을 임의로 꺼낼 때, 꺼낸 구슬 중에서 흰 구슬의 개수를 확률변수 $X$라 하자. 확률변수 $X$의 확률분포표를 만들고 확률변수 $X$의 평균을 구하는 과정을 구체적으로 서술하시오. [7점, 부분점수 있음]
~~~

- 원본 선택지: 서술형 — 없음
- 원본 정답: **8/15**
- 기존 solution 정확 발췌: > 먼저 $1$이 적힌 카드를 뽑을 확률은 $\dfrac23$, $2$가 적힌 카드를 뽑을 확률은 $\dfrac13$이다. 카드가 $1$인 사건을 $A$, 카드가 $2$인 사건을 $B$라 하자. 사건 $A$가 일어나면 구슬을 $1$개 뽑으므로 $P(X=0\mid A)=\dfrac6{10}=\dfrac35$, $P(X=1\mid A)=\dfrac4{10}=\dfrac25$이다. 사건 $B$가 일어나면 구슬을 $2$개 뽑고, 전체 방법은 $\binom{10}{2}=45$가지이다. 흰 구슬이 $0$개이면 검은 구슬만 $2$개이므로 $P(X=0\mid B)=\dfrac{\binom{6}{2}}{45}=\dfrac13$이다. 흰 구슬이 $1$개이면 흰색과 검은색을 하나씩 뽑으므로 $P
- **독립 수학 검산·판정 근거:** 카드별 흰구슬수 혼합분포 P0=23/45,P1=4/9,P2=2/45, E=8/15 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q22-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
먼저 $1$이 적힌 카드를 뽑을 확률은 $\dfrac23$, $2$가 적힌 카드를 뽑을 확률은 $\dfrac13$이다.
카드가 $1$인 사건을 $A$, 카드가 $2$인 사건을 $B$라 하자.

사건 $A$가 일어나면 구슬을 $1$개 뽑으므로
$P(X=0\mid A)=\dfrac6{10}=\dfrac35$,
$P(X=1\mid A)=\dfrac4{10}=\dfrac25$이다.

사건 $B$가 일어나면 구슬을 $2$개 뽑고, 전체 방법은 $\binom{10}{2}=45$가지이다.
흰 구슬이 $0$개이면 검은 구슬만 $2$개이므로
$P(X=0\mid B)=\dfrac{\binom{6}{2}}{45}=\dfrac13$이다.
흰 구슬이 $1$개이면 흰색과 검은색을 하나씩 뽑으므로
$P(X=1\mid B)=\dfrac{\binom{4}{1}\binom{6}{1}}{45}=\dfrac8{15}$이다.
흰 구슬이 $2$개이면
$P(X=2\mid B)=\dfrac{\binom{4}{2}}{45}=\dfrac2{15}$이다.

각 카드가 선택될 확률을 곱해 더하면
$P(X=0)=\dfrac23\cdot\dfrac35+\dfrac13\cdot\dfrac13=\dfrac{23}{45}$,
$P(X=1)=\dfrac23\cdot\dfrac25+\dfrac13\cdot\dfrac8{15}=\dfrac49$,
$P(X=2)=\dfrac13\cdot\dfrac2{15}=\dfrac2{45}$이다.

따라서 확률분포표는 다음과 같다.
<div class="question-table-wrap"><table class="question-table"><thead><tr><th>$X$</th><th>$0$</th><th>$1$</th><th>$2$</th></tr></thead><tbody><tr><th>$P(X=x)$</th><td>$\dfrac{23}{45}$</td><td>$\dfrac49$</td><td>$\dfrac2{45}$</td></tr></tbody></table></div>
확률의 합은 $\dfrac{23}{45}+\dfrac{20}{45}+\dfrac2{45}=1$이다.
$E(X)=0\cdot\dfrac{23}{45}+1\cdot\dfrac49+2\cdot\dfrac2{45}$
$=\dfrac{20}{45}+\dfrac4{45}=\dfrac{24}{45}=\dfrac8{15}$이다.
따라서 구하는 평균은 $\dfrac8{15}$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q23 — UPGRADE / SOURCE_FIDELITY_HOLD

- qid/source ordinal: `23`/23; sourceQid: `q23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `9247cb7a9b40c56f0bb7c0dbd487ef68b83d8618`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
[서술형 3] 모평균이 $m$, 모표준편차가 $\sigma$인 정규분포를 따르는 모집단에 크기가 $36$인 표본을 임의추출하여 얻은 표본평균이 $\overline x$일 때, 모평균 $m$에 대한 신뢰도 $99\%$의 신뢰구간이 $a\le m\le37$이었다. 같은 모집단에서 크기가 $81$인 표본을 임의추출하여 얻은 표본평균이 $\overline x+2$일 때, 모평균 $m$에 대한 신뢰도 $99\%$의 신뢰구간이 $b\le m\le37$이었다. 이때, $a+b$의 값을 구하는 과정을 구체적으로 서술하시오. (단, $P(0\le Z\le3)=0.495$로 계산한다.) [7점, 부분점수 있음]
~~~

- 원본 선택지: 서술형 — 없음
- 원본 정답: **54**
- 기존 solution 정확 발췌: > 신뢰도 $99\%$에 대응하는 신뢰상수는 문제의 표에 의해 $3$이다. 첫 표본 크기가 $36$이므로 오차한계는 $3\cdot\dfrac{\sigma}{\sqrt{36}}=\dfrac{\sigma}{2}$이다. 둘째 표본 크기가 $81$이므로 오차한계는 $3\cdot\dfrac{\sigma}{\sqrt{81}}=\dfrac{\sigma}{3}$이다. 두 신뢰구간의 상한은 모두 $37$이므로 $\overline x+\dfrac{\sigma}{2}=37$ ① $\overline x+2+\dfrac{\sigma}{3}=37$ ② 가 성립한다. ①에서 ②를 빼면 $\dfrac{\sigma}{2}-\dfrac{\sigma}{3}=2$ $\dfrac{\sigma}{6}=2$ $\si
- **독립 수학 검산·판정 근거:** UPGRADE: P(0≤Z≤3)=.495는 실제 .49865와 다름; 99% z≈2.576. 두 구간의 동일한 신뢰상수가 소거되어 최종 54는 유지됨.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q23-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
신뢰도 $99\%$에 대응하는 신뢰상수는 문제의 표에 의해 $3$이다.
첫 표본 크기가 $36$이므로 오차한계는
$3\cdot\dfrac{\sigma}{\sqrt{36}}=\dfrac{\sigma}{2}$이다.
둘째 표본 크기가 $81$이므로 오차한계는
$3\cdot\dfrac{\sigma}{\sqrt{81}}=\dfrac{\sigma}{3}$이다.

두 신뢰구간의 상한은 모두 $37$이므로
$\overline x+\dfrac{\sigma}{2}=37$ ①
$\overline x+2+\dfrac{\sigma}{3}=37$ ②
가 성립한다.
①에서 ②를 빼면
$\dfrac{\sigma}{2}-\dfrac{\sigma}{3}=2$
$\dfrac{\sigma}{6}=2$
$\sigma=12$이다.

①에 대입하여
$\overline x=37-\dfrac{12}{2}=31$이다.
따라서 첫째 구간의 하한은
$a=\overline x-\dfrac{\sigma}{2}=31-6=25$이다.

둘째 표본평균은 $\overline x+2=33$이고 오차한계는 $\dfrac{12}{3}=4$이므로
$b=33-4=29$이다.
따라서 $a+b=25+29=54$이다.
~~~

#### UPGRADE — 원본 분리 수정 제안(출고 미적용)

- **오류 및 왜 중요한가:** `P(0≤Z≤3)=.495`는 틀림(실제 약 .498650); .495는 z≈2.576의 면적. 이 문항에서는 임계값이 상쇄돼 정답 54 자체는 변하지 않음.
- **원문/선택지 수정안:** 괄호를 `P(0≤Z≤2.58)=0.495로 계산한다`로 수정한다.
- **교정된 학생용 완전 풀이:**

두 99% 신뢰구간의 오차한계를 각각 t1=2.58σ/6, t2=2.58σ/9라고 두면 상한이 모두 37이고 표본평균 차가 2이므로 t1−t2=2다. t1:t2=(1/6):(1/9)=3:2에서 t1=6,t2=4. 첫 표본평균은 37−6=31, 둘째는 31+2=33이다. 하한은 a=31−6=25,b=33−4=29, a+b=54다. 잘못 기재된 z=3 대신 정상 z=2.58을 써도 최종 답은 유지된다.

- 수정 후 정답: **54 (유지)**.
- 판정: **확률표 정정 전 SOURCE_FIDELITY_HOLD**. 원본 JS·보기·원답·SVG는 건드리지 않음.

- 문항 상태: **UPGRADE | READ_EVIDENCED | SOURCE_FIDELITY_HOLD | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

## 2. 이미지·문항 기초 증적

- 고유 PNG 1개 실제 실물과 원문 문제 조건을 대조했다. Q08: `assets/images/25_제일고_2학기_기말_고2_확률과통계_기출/q08.png`.
- 이미지 및 학생풀이 `solutionImage`는 원본 경로를 인용한 것일 뿐, SVG 생성·렌더·Golden·Negative QA PASS를 주장하지 않는다.
- 수학 판정은 원본 JS 정적 본문 및 표·그림 기반; 편집/배포용 PDF 별도 검수 **NOT_RUN**.
- UPGRADE 3건은 문제 정의·표준정규 수치·근사와 정확값의 구분을 포함한 **수정 제안**. 원본 학습문항·정답을 임의 변경하지 않는다.

## 3. 시험지 완료 상태

- **23/23 READ_EVIDENCED; UNREAD=[]; next_qid=NONE; EXAM_AUDIT_COMPLETE.**
- source fidelity, SVG 렌더, Golden/Negative, 인쇄 PDF 대조, 운영출고: **별도 HOLD/NOT_RUN**.
