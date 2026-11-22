# 고2 확률과 통계 2학기 기말 — 2019_매산고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 최종 잔여 8장 묶음 · 2026-11-22 KST. 학생용 수학 해설 감사·수정안 MD **초안**. 원본 JS·보기·정답·이미지·SVG 무수정; 운영 배포 PASS는 별도 단계.

## 0. 시험지 고정 정보

- 전용 라인: **lane40**, 고2 확률과 통계 **2학기 기말 원본**만. 타 과목/학기/유형으로 자동 전환하지 않는다.
- 원본 시험지: `2019_매산고_2학기_기말_고2_확률과통계`.
- 원본 JS 경로: `archive/exams/original/high/h2/2final/2019_매산고_2학기_기말_고2_확률과통계.js`.
- 원본 ref: `main`; 원본 **Git blob SHA**: `33c689a96705cd2269c448de1f2f0828cbaf5448`.
- 총 문항 수: **19문항** (Q01~Q19). JS content·choices·answer·기존 solution **전 문항 전문 수록**.
- 인쇄 PDF sourcePdf 메타데이터: 없음. 실제 인쇄 PDF 대조 **NOT_RUN**.
- 감사 MD: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_maesan_2final_standalone_DEEP_AUDIT.md`; 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 그림 고유 PNG: **5개**, 문항 참조 **5회**. 모두 실제 PNG 다운로드·육안 판독; `assets/images` 및 `archive/assets/images` 실제 저장소 경로 대조. 인라인 HTML 표·도형은 원문 전문에 포함.
- 기존 해설 SVG `solutionImage`: **10개** 경로 기록. 별도 렌더·Golden·Negative QA **NOT_RUN**.
- 방법: 원본 JS의 `window.questionBank` JSON 정적 추출(코드 미실행), 모든 문항 독립 수학 검산, 선택지·정답 대응, 각 PNG 원본 도형·숫자·확률표 육안 판독, 일부 정규/이항의 정확 확률·비단조방정식 수치 검산. SVG/인쇄/PDF 검수와 구별.
- 결과: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 19/19; KEEP 19; UPGRADE 0; UNREAD 0.** 수정 필요 문항 없음.
- 완료 cursor: `next_qid=NONE; UNREAD=[]`.

## 1. Q01~Q19 원문·원풀이 전문·독립 수학 검산

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `q01`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
다음 중 보기에서 전수조사와 표본조사 중 전수조사에 적합한 것의 개수를 고르면?
ㄱ. 매산고등학교 2학년 학생들의 결핵 검사
ㄴ. 동천의 수질 오염도 검사
ㄷ. 대한민국 인구 주택 총조사
ㄹ. OO제약회사의 신약의 임상 시험
ㅁ. △△전구회사의 전구 수명 검사
~~~

- 원본 선택지: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 전수조사는 조사 대상 전체를 빠짐없이 확인하는 방법이다. ㄱ은 2학년 학생 모두의 결핵 여부를 확인하므로 전수조사에 적합하다. ㄴ은 하천의 수질을 모든 지점에서 조사하기 어려워 표본조사가 적합하다. ㄷ은 국가 전체의 인구와 주택을 조사하므로 전수조사이다. ㄹ은 신약의 효과와 부작용을 일부 대상으로 확인하는 임상시험이므로 표본조사이다. ㅁ은 전구 수명을 모두 시험하면 판매할 전구가 소모되므로 표본조사이다. 따라서 전수조사에 적합한 것은 ㄱ, ㄷ의 2개이다.
- **독립 수학 검산·판정 근거:** 전수조사 2개(학생 결핵검사, 인구총조사) 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
전수조사는 조사 대상 전체를 빠짐없이 확인하는 방법이다.
ㄱ은 2학년 학생 모두의 결핵 여부를 확인하므로 전수조사에 적합하다.
ㄴ은 하천의 수질을 모든 지점에서 조사하기 어려워 표본조사가 적합하다.
ㄷ은 국가 전체의 인구와 주택을 조사하므로 전수조사이다.
ㄹ은 신약의 효과와 부작용을 일부 대상으로 확인하는 임상시험이므로 표본조사이다.
ㅁ은 전구 수명을 모두 시험하면 판매할 전구가 소모되므로 표본조사이다.
따라서 전수조사에 적합한 것은 ㄱ, ㄷ의 2개이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `q02`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
확률변수 $X$의 확률분포를 표로 나타내면 다음과 같을 때, $E(\dfrac Xa)$의 값을 구하면?
$X=0,1,2$일 때 $P(X=x)=\dfrac12,2a,a$이고 합계는 1이다.
~~~

- 원본 선택지: ① $2$ / ② $3$ / ③ $4$ / ④ $5$ / ⑤ $6$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 확률의 합이 1이므로 $\dfrac12+2a+a=1$ $3a=\dfrac12$ $a=\dfrac16$이다. 기댓값은 $E(X)=0\cdot\dfrac12+1\cdot2a+2\cdot a=4a$이다. 따라서 $E\left(\dfrac Xa\right)=\dfrac{E(X)}a=4$이다. 그러므로 정답은 ③이다.
- **독립 수학 검산·판정 근거:** PMF (1/2,2a,a), a1/6, E(X/a)=4 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
확률의 합이 1이므로
$\dfrac12+2a+a=1$
$3a=\dfrac12$
$a=\dfrac16$이다.
기댓값은
$E(X)=0\cdot\dfrac12+1\cdot2a+2\cdot a=4a$이다.
따라서
$E\left(\dfrac Xa\right)=\dfrac{E(X)}a=4$이다.
그러므로 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `q03`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 순열과 조합.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
같은 종류 물건 10개를 서로 다른 종류 접시 3개에 나누어 담는 경우의 수를 구하면? (단, 접시는 일부만 사용해도 된다.)
~~~

- 원본 선택지: ① $21$ / ② $36$ / ③ $45$ / ④ $66$ / ⑤ $120$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 10개의 같은 물건을 3개의 서로 다른 접시에 나누어 담고, 접시는 비워도 된다. 접시에 담기는 개수를 $x_1,x_2,x_3$이라 두면 $x_1+x_2+x_3=10$, $x_1,x_2,x_3\ge0$이다. 별과 막대의 방법으로 10개의 별 사이와 양 끝에 막대 2개를 놓는다. 별 10개와 막대 2개, 모두 12자리에서 막대 2자리만 고르면 되므로 $\binom{12}{2}=\dfrac{12\cdot11}{2}=66$이다. 그러므로 정답은 ④이다.
- **독립 수학 검산·판정 근거:** 비음수 x1+x2+x3=10의 해 C(12,2)=66 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
10개의 같은 물건을 3개의 서로 다른 접시에 나누어 담고, 접시는 비워도 된다.
접시에 담기는 개수를 $x_1,x_2,x_3$이라 두면
$x_1+x_2+x_3=10$,
$x_1,x_2,x_3\ge0$이다.
별과 막대의 방법으로 10개의 별 사이와 양 끝에 막대 2개를 놓는다.
별 10개와 막대 2개, 모두 12자리에서 막대 2자리만 고르면 되므로
$\binom{12}{2}=\dfrac{12\cdot11}{2}=66$이다.
그러므로 정답은 ④이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `q04`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
모평균이 25, 모표준편차가 4인 모집단에서 임의추출한 크기가 4인 표본의 표본평균을 $\overline{X}$라 할 때, $E(\overline{X})\times V(\overline{X})$의 값을 구하면? (4.3점)
~~~

- 원본 선택지: ① $75$ / ② $100$ / ③ $125$ / ④ $150$ / ⑤ $175$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 표본평균의 기댓값과 분산은 $E(\overline X)=\mu=25$, $V(\overline X)=\dfrac{\sigma^2}{n}=\dfrac{4^2}{4}=4$이다. 따라서 $E(\overline X)V(\overline X)=25\cdot4=100$이다. 그러므로 정답은 ②이다.
- **독립 수학 검산·판정 근거:** 표본 n4, E25,V=16/4=4, 곱100 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균의 기댓값과 분산은
$E(\overline X)=\mu=25$,
$V(\overline X)=\dfrac{\sigma^2}{n}=\dfrac{4^2}{4}=4$이다.
따라서
$E(\overline X)V(\overline X)=25\cdot4=100$이다.
그러므로 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `q05`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 이항정리.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
다음 부등식을 만족시키는 최소 자연수 $n$의 값을 구하면?
$1000 < {}_nC_0+{}_nC_1\cdot3+{}_nC_2\cdot3^2+\cdots+{}_nC_n\cdot3^n$
~~~

- 원본 선택지: ① $4$ / ② $5$ / ③ $6$ / ④ $8$ / ⑤ $9$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 이항정리를 적용하면 합은 $\binom n0+\binom n1 3+\binom n2 3^2+\cdots+\binom nn3^n=(1+3)^n=4^n$이다. 따라서 조건은 $4^n>1000$이다. $4^4=256<1000$, $4^5=1024>1000$이므로 최소 자연수는 $n=5$이다. 그러므로 정답은 ②이다.
- **독립 수학 검산·판정 근거:** ΣC(n,r)3^r=4^n>1000, 최소 n5 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
이항정리를 적용하면 합은
$\binom n0+\binom n1 3+\binom n2 3^2+\cdots+\binom nn3^n=(1+3)^n=4^n$이다.
따라서 조건은
$4^n>1000$이다.
$4^4=256<1000$,
$4^5=1024>1000$이므로 최소 자연수는
$n=5$이다.
그러므로 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `q06`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
정규분포 $N(9,1^2)$을 따르는 확률변수 $X$에 대하여 $P(k-3\le X\le k+1)$이 최대가 되도록 하는 상수 $k$의 값을 구하면? (4.5점)
~~~

- 원본 선택지: ① $6$ / ② $7$ / ③ $8$ / ④ $9$ / ⑤ $10$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > $X$의 평균은 9이다. 구간 $[k-3,k+1]$의 길이는 4이고, 중심은 $\dfrac{(k-3)+(k+1)}2=k-1$이다. 정규분포에서 길이가 같은 구간의 확률은 평균을 중심에 둘 때 가장 크다. 따라서 $k-1=9$, $k=10$이다. 그러므로 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** 평균9의 정규분포에서 길이4 구간 중심k−1=9→k10 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q6-solution.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
$X$의 평균은 9이다.
구간 $[k-3,k+1]$의 길이는 4이고, 중심은
$\dfrac{(k-3)+(k+1)}2=k-1$이다.
정규분포에서 길이가 같은 구간의 확률은 평균을 중심에 둘 때 가장 크다.
따라서
$k-1=9$,
$k=10$이다.
그러므로 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `q07`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
매산고등학교 2학년 학생들이 한 달 동안 매점을 이용한 시간은 평균 210분이고 표준편차가 15분인 정규분포를 따른다고 한다. 2학년 학생 중에서 임의로 택한 한 명이 한 달 동안 매점을 이용한 시간이 3시간 이상일 확률을 표준정규분포표를 이용하여 구하면?
~~~

- 원본 선택지: ① $0.3413$ / ② $0.4772$ / ③ $0.4987$ / ④ $0.8413$ / ⑤ $0.9772$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 이용 시간의 평균은 210분, 표준편차는 15분이고 3시간은 180분이다. 표준화하면 $Z=\dfrac{180-210}{15}=-2$이다. 따라서 $P(X\ge180)=P(Z\ge-2)=P(Z\le2)$ $=0.5+P(0\le Z\le2)$ $=0.5+0.4772=0.9772$이다. 그러므로 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** 실물 z1,2,3 표의 값(.3413,.4772,.4987)과 X≥180, z−2 꼬리 .9772 일치.
- 원본문제 PNG: JS 지정 `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q07.png` → 실제 저장소 `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q07.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q7-solution-v2.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
이용 시간의 평균은 210분, 표준편차는 15분이고 3시간은 180분이다.
표준화하면
$Z=\dfrac{180-210}{15}=-2$이다.
따라서
$P(X\ge180)=P(Z\ge-2)=P(Z\le2)$
$=0.5+P(0\le Z\le2)$
$=0.5+0.4772=0.9772$이다.
그러므로 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q08 — KEEP

- qid/source ordinal: `8`/8; sourceQid: `q08`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
모평균이 $m$, 모표준편차가 $\sigma$인 정규분포를 따르는 모집단에서 크기가 $n_1$인 표본을 임의추출하여 구한 표본평균을 $\overline{X}$, 크기가 $n_2$인 표본을 임의추출하여 구한 표본평균을 $\overline{Y}$라 할 때, 다음 중 옳은 것을 보기에서 고르면?
ㄱ. $E(\overline{X})=m$, $E(\overline{Y})\ne m$
ㄴ. $V(\overline{X})=\dfrac{\sigma^2}{n_1}$, $V(\overline{Y})=\dfrac{\sigma^2}{n_2}$이다.
ㄷ. $9n_1=n_2$이면 $\sigma(\overline{Y})=\dfrac13\times\sigma(\overline{X})$이다.
~~~

- 원본 선택지: ① ㄱ / ② ㄴ / ③ ㄱ,ㄴ / ④ ㄱ,ㄷ / ⑤ ㄴ,ㄷ
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > ㄱ. 표본평균은 모평균을 중심으로 하므로 $E(\overline X)=E(\overline Y)=m$이다. 따라서 ㄱ은 거짓이다. ㄴ. 표본평균의 분산은 모분산을 표본크기로 나누므로 $V(\overline X)=\dfrac{\sigma^2}{n_1}$, $V(\overline Y)=\dfrac{\sigma^2}{n_2}$이다. 따라서 ㄴ은 참이다. ㄷ. $n_2=9n_1$이면 $\sigma(\overline Y)=\dfrac{\sigma}{\sqrt{n_2}}$ $=\dfrac{\sigma}{3\sqrt{n_1}}=\dfrac13\sigma(\overline X)$이다. 따라서 ㄷ은 참이다. 옳은 것은 ㄴ, ㄷ이므로 정답은 ⑤이다.
- **독립 수학 검산·판정 근거:** 표본평균 기대값 m, 분산 σ²/n, n2=9n1이면 SE1/3; ㄴㄷ 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
ㄱ. 표본평균은 모평균을 중심으로 하므로
$E(\overline X)=E(\overline Y)=m$이다.
따라서 ㄱ은 거짓이다.

ㄴ. 표본평균의 분산은 모분산을 표본크기로 나누므로
$V(\overline X)=\dfrac{\sigma^2}{n_1}$,
$V(\overline Y)=\dfrac{\sigma^2}{n_2}$이다.
따라서 ㄴ은 참이다.

ㄷ. $n_2=9n_1$이면
$\sigma(\overline Y)=\dfrac{\sigma}{\sqrt{n_2}}$
$=\dfrac{\sigma}{3\sqrt{n_1}}=\dfrac13\sigma(\overline X)$이다.
따라서 ㄷ은 참이다.

옳은 것은 ㄴ, ㄷ이므로 정답은 ⑤이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `q09`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 조건부확률.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
이길 확률이 같은 철수와 영희가 게임을 하여 먼저 5번을 이기는 사람이 상금을 모두 갖기로 하였다. 철수가 3번, 영희가 2번 이긴 상태에서 게임이 중지되었을 때, 철수와 영희에게 상금을 $a:b$로 분배하는 것이 공정하다고 한다. 이때, $\frac{b}{a}$의 값은?
~~~

- 원본 선택지: ① $\dfrac{5}{11}$ / ② $\dfrac{9}{11}$ / ③ $\dfrac{5}{16}$ / ④ $\dfrac{9}{16}$ / ⑤ $\dfrac{11}{16}$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 철수는 먼저 두 번 더 이기면 상금을 얻는다. 마지막 승리는 철수의 두 번째 승리이므로, 그 전에 영희가 이기는 횟수는 0회, 1회, 2회이다. 영희가 0회 이기는 경우에는 $\binom10\left(\dfrac12\right)^2=\dfrac14$이다. 영희가 1회 이기는 경우에는 $\binom21\left(\dfrac12\right)^2\dfrac12=\dfrac14$이다. 영희가 2회 이기는 경우에는 $\binom32\left(\dfrac12\right)^2\left(\dfrac12\right)^2=\dfrac3{16}$이다. 따라서 $P(\text{철수 승})=\dfrac14+\dfrac14+\dfrac3{16}=\dfrac{11}{16}$이다. 영희의 승리 확률은 $1-\dfrac{11}{16}=\
- **독립 수학 검산·판정 근거:** 철수 게임선승 두 번 vs 영희 세 번: 철수11/16, 영희5/16, b/a5/11 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
철수는 먼저 두 번 더 이기면 상금을 얻는다.
마지막 승리는 철수의 두 번째 승리이므로, 그 전에 영희가 이기는 횟수는 0회, 1회, 2회이다.
영희가 0회 이기는 경우에는
$\binom10\left(\dfrac12\right)^2=\dfrac14$이다.
영희가 1회 이기는 경우에는
$\binom21\left(\dfrac12\right)^2\dfrac12=\dfrac14$이다.
영희가 2회 이기는 경우에는
$\binom32\left(\dfrac12\right)^2\left(\dfrac12\right)^2=\dfrac3{16}$이다.
따라서
$P(\text{철수 승})=\dfrac14+\dfrac14+\dfrac3{16}=\dfrac{11}{16}$이다.
영희의 승리 확률은
$1-\dfrac{11}{16}=\dfrac5{16}$이다.
공정한 분배비는 확률비와 같으므로
$a:b=11:5$,
$\dfrac ba=\dfrac5{11}$이다.
그러므로 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `q10`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
정규분포 $N(m,4)$를 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 얻은 표본의 표본평균을 $\overline X$라 할 때, $P(|\overline X-m|\le\dfrac15)$의 확률이 95% 이상이 되게 하는 $n$의 최솟값을 구하면? (단, $P(-1.96\le Z\le1.96)=0.95$이다.) (4.9점)
~~~

- 원본 선택지: ① 383 / ② 384 / ③ 385 / ④ 386 / ⑤ 387
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 표본평균의 표준편차는 $\sigma(\overline X)=\dfrac2{\sqrt n}$이다. 중앙 확률이 0.95 이상이 되려면 $\dfrac{\frac{1}{5}}{2/\sqrt n}\ge1.96$이어야 한다. 따라서 $\sqrt n\ge1.96\cdot10=19.6$, $n\ge19.6^2=384.16$이다. $n$은 자연수이므로 최솟값은 385이다. 그러므로 정답은 ③이다.
- **독립 수학 검산·판정 근거:** N(m,4), n일 때 중앙 0.95 목표 ±.2: √n≥19.6, 최소385 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q10-solution.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균의 표준편차는
$\sigma(\overline X)=\dfrac2{\sqrt n}$이다.
중앙 확률이 0.95 이상이 되려면
$\dfrac{\frac{1}{5}}{2/\sqrt n}\ge1.96$이어야 한다.
따라서
$\sqrt n\ge1.96\cdot10=19.6$,
$n\ge19.6^2=384.16$이다.
$n$은 자연수이므로 최솟값은 385이다.
그러므로 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `q11`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
표준편차가 4인 정규분포를 따르는 모집단에서 크기가 64인 표본을 임의추출하여 구한 표본평균이 32일 때,
모집단 평균 $m$에 대한 신뢰도 95%와 99%의 신뢰구간을 각각 구하면 $a\le m\le b$와 $c\le m\le d$이다. 이때 $a-b+c-d$의 값을 구하면? (단, $Z$가 표준정규분포를 따르는 확률변수일 때 $P(|Z|\le1.96)=0.95$, $P(|Z|\le2.58)=0.99$로 계산한다.) (4.9점)
~~~

- 원본 선택지: ① $-4.54$ / ② $-3.92$ / ③ $-2.58$ / ④ $-1.96$ / ⑤ $-0.62$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 표본평균의 표준편차는 $\dfrac4{\sqrt{64}}=\dfrac12$이다. 신뢰도 95%의 신뢰구간은 $32\pm1.96\cdot\dfrac12=32\pm0.98$, 따라서 $a=31.02$, $b=32.98$이다. 신뢰도 99%의 신뢰구간은 $32\pm2.58\cdot\dfrac12=32\pm1.29$, 따라서 $c=30.71$, $d=33.29$이다. 그러므로 $a-b+c-d=(31.02-32.98)+(30.71-33.29)$ $=-1.96-2.58=-4.54$이다. 정답은 ①이다.
- **독립 수학 검산·판정 근거:** n64 SE0.5, 95/99 CI 전체 길이 1.96과2.58, 합−4.54 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q11-solution.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균의 표준편차는
$\dfrac4{\sqrt{64}}=\dfrac12$이다.
신뢰도 95%의 신뢰구간은
$32\pm1.96\cdot\dfrac12=32\pm0.98$,
따라서 $a=31.02$, $b=32.98$이다.
신뢰도 99%의 신뢰구간은
$32\pm2.58\cdot\dfrac12=32\pm1.29$,
따라서 $c=30.71$, $d=33.29$이다.
그러므로
$a-b+c-d=(31.02-32.98)+(30.71-33.29)$
$=-1.96-2.58=-4.54$이다.
정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `q12`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
정규분포 $N(40,8^2)$을 따르는 모집단에서 크기가 16인 표본을 임의추출하여 구한 표본평균을 $\overline X$, 정규분포 $N(70,\sigma^2)$을 따르는 모집단에서 크기가 25인 표본을 임의추출하여 구한 표본평균을 $\overline Y$라 하자. $P(\overline X\le43)+P(\overline Y\le64)=1$일 때, $P(\overline Y\ge66)$의 값을 표준정규분포표를 이용하여 구한 것은? (5.1점)
<div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>1</td><td>0.3413</td></tr><tr><td>1.2</td><td>0.3849</td></tr><tr><td>1.4</td><td>0.4192</td></tr><tr><td>1.6</td><td>0.4452</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① $0.8413$ / ② $0.8644$ / ③ $0.8849$ / ④ $0.9192$ / ⑤ $0.9452$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 먼저 $\overline X$의 표준편차는 $\dfrac8{\sqrt{16}}=2$이다. 따라서 $P(\overline X\le43)=P\left(Z\le\dfrac{43-40}{2}\right)=P(Z\le1.5)$이다. 주어진 조건에서 $P(\overline Y\le64)=1-P(Z\le1.5)$ $=P(Z\ge1.5)=P(Z\le-1.5)$이다. $\overline Y$의 평균은 70, 표준편차는 $\dfrac{\sigma}{\sqrt{25}}=\dfrac{\sigma}{5}$이므로 $\dfrac{64-70}{\sigma/5}=-1.5$, $\sigma=20$이다. 따라서 $\overline Y$의 표준편차는 4이고, $P(\overline Y\ge66)=P\left(Z\ge\dfrac{66-70}{4
- **독립 수학 검산·판정 근거:** 첫 표본 SE2,z1.5와 여사건 대칭, 둘째 SE4, Ybar≥66은 z≥−1 확률 .8413 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q12-solution.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
먼저 $\overline X$의 표준편차는
$\dfrac8{\sqrt{16}}=2$이다.
따라서
$P(\overline X\le43)=P\left(Z\le\dfrac{43-40}{2}\right)=P(Z\le1.5)$이다.
주어진 조건에서
$P(\overline Y\le64)=1-P(Z\le1.5)$
$=P(Z\ge1.5)=P(Z\le-1.5)$이다.
$\overline Y$의 평균은 70, 표준편차는 $\dfrac{\sigma}{\sqrt{25}}=\dfrac{\sigma}{5}$이므로
$\dfrac{64-70}{\sigma/5}=-1.5$,
$\sigma=20$이다.
따라서 $\overline Y$의 표준편차는 4이고,
$P(\overline Y\ge66)=P\left(Z\ge\dfrac{66-70}{4}\right)$
$=P(Z\ge-1)=0.5+P(0\le Z\le1)$
$=0.5+0.3413=0.8413$이다.
그러므로 정답은 ①이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `q13`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
다음은 정규분포 $N(m,\sigma^2)$를 따르는 확률변수 $X$에 대한 확률밀도함수 그래프이다. $P(5\le X\le15)=0.6826$, $P(0\le X\le20)=0.9544$, $P(-5\le X\le25)=0.9974$를 만족할 때,
정규분포 $N(m,\sigma^2)$를 따르는 모집단에서 크기가 25인 표본을 임의추출한다. 이때 표본평균 $\overline X$가 9 이상 12 이하일 확률은? (단, $X$의 값과 평균 $m$의 차가 $\sigma$, $2\sigma$, $3\sigma$ 이하일 확률은 각각 0.6826, 0.9544, 0.9974이다.) (5.2점)
~~~

- 원본 선택지: ① $0.6826$ / ② $0.8185$ / ③ $0.84$ / ④ $0.9759$ / ⑤ $0.9974$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 그래프에서 중심은 10이다. $P(5\le X\le15)=0.6826$은 평균에서 양쪽으로 표준편차 1만큼의 구간이므로 $m=10$, $\sigma=5$이다. 크기 25인 표본의 표본평균은 평균 10, 표준편차 $\dfrac5{\sqrt{25}}=1$인 정규분포를 따른다. 따라서 $P(9\le\overline X\le12)=P(-1\le Z\le2)$ $=P(0\le Z\le1)+P(0\le Z\le2)$ $=0.3413+0.4772=0.8185$이다. 그러므로 정답은 ②이다.
- **독립 수학 검산·판정 근거:** 정규 실물 이미지 중심10, ±5/±10/±15 범위를 확인, 표본 SE1, z−1~2 확률 .8185 일치.
- 원본문제 PNG: JS 지정 `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q13.png` → 실제 저장소 `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q13.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q13-solution-v2.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
그래프에서 중심은 10이다.
$P(5\le X\le15)=0.6826$은 평균에서 양쪽으로 표준편차 1만큼의 구간이므로
$m=10$, $\sigma=5$이다.
크기 25인 표본의 표본평균은 평균 10, 표준편차
$\dfrac5{\sqrt{25}}=1$인 정규분포를 따른다.
따라서
$P(9\le\overline X\le12)=P(-1\le Z\le2)$
$=P(0\le Z\le1)+P(0\le Z\le2)$
$=0.3413+0.4772=0.8185$이다.
그러므로 정답은 ②이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `q14`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
매산고 학생들의 하루 페이스북 사용시간은 평균이 $m$분, 표준편차가 8분인 정규분포를 따른다고 한다. 매산고 학생 중 64명을 임의추출하여 모집단 평균 $m$을 신뢰도 90%로 추정한 신뢰구간은 $a\le m\le b$이고, 신뢰도 $k$%로 추정한 신뢰구간은 $c\le m\le d$이다. $26\times(b-a)=33\times(d-c)$를 만족할 때, 아래 표준정규분포표를 이용하여 $k$의 값을 구하면? (5.3점)
<div class="question-table-wrap"><table class="question-table"><thead><tr><th>$z$</th><th>$P(0\le Z\le z)$</th></tr></thead><tbody><tr><td>0.66</td><td>0.25</td></tr><tr><td>1.10</td><td>0.36</td></tr><tr><td>1.30</td><td>0.40</td></tr><tr><td>1.65</td><td>0.45</td></tr><tr><td>1.95</td><td>0.47</td></tr><tr><td>2.05</td><td>0.48</td></tr></tbody></table></div>
~~~

- 원본 선택지: ① 50 / ② 72 / ③ 80 / ④ 94 / ⑤ 96
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 표본평균의 표준편차는 $\dfrac8{\sqrt{64}}=1$이다. 90% 신뢰구간에서 표준정규 임계값은 표에 따라 $z=1.65$이므로 $b-a=2\cdot1.65\cdot1=3.30$이다. 조건에 대입하면 $26(3.30)=33(d-c)$, $d-c=\dfrac{26\cdot3.30}{33}=2.60$이다. 신뢰구간의 반폭은 $1.30$이므로 임계값은 $z=1.30$이다. 표에서 $P(0\le Z\le1.30)=0.40$이므로 중앙 신뢰도는 $2\cdot0.40=0.80$, 즉 $k=80$이다. 그러므로 정답은 ③이다.
- **독립 수학 검산·판정 근거:** 90% z1.65, 길이3.30; 비26:33에서 새 z1.30→신뢰도80% 일치(학교식 표 기준).
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q14-solution.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
표본평균의 표준편차는
$\dfrac8{\sqrt{64}}=1$이다.
90% 신뢰구간에서 표준정규 임계값은 표에 따라 $z=1.65$이므로
$b-a=2\cdot1.65\cdot1=3.30$이다.
조건에 대입하면
$26(3.30)=33(d-c)$,
$d-c=\dfrac{26\cdot3.30}{33}=2.60$이다.
신뢰구간의 반폭은 $1.30$이므로 임계값은 $z=1.30$이다.
표에서 $P(0\le Z\le1.30)=0.40$이므로 중앙 신뢰도는
$2\cdot0.40=0.80$,
즉 $k=80$이다.
그러므로 정답은 ③이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `q15`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
단답형 1. <보기 1>은 연속확률변수 $X$에 대하여 $0\le x\le1$에서 정의된 확률밀도함수이다. <보기 2>는 이산확률변수 $Z$에 대한 확률분포이다.
<보기 1>의 확률밀도함수와 $x$축 사이의 넓이를 $S$라 할 때, $4(a+b+S)$의 값을 구하시오. (5점)
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **9**
- 기존 solution 정확 발췌: > 확률밀도함수 아래의 넓이는 두 삼각형 넓이의 합이다. 각 삼각형의 밑변은 $\dfrac12$, 높이는 2이므로 $S=2\cdot\dfrac12\cdot\dfrac12\cdot2=1$이다. 확률분포표에서 확률의 합은 1이므로 $\dfrac12+\dfrac14+a=1$, $a=\dfrac14$이고 합계 $b=1$이다. 따라서 $4(a+b+S)=4\left(\dfrac14+1+1\right)=9$이다.
- **독립 수학 검산·판정 근거:** 실물 쌍봉 삼각 밀도 총면적 S1, 분포표 a1/4,b1; 4(a+b+S)=9 일치.
- 원본문제 PNG: JS 지정 `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q15.png` → 실제 저장소 `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q15.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q15.png` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
확률밀도함수 아래의 넓이는 두 삼각형 넓이의 합이다. 각 삼각형의 밑변은 $\dfrac12$, 높이는 2이므로
$S=2\cdot\dfrac12\cdot\dfrac12\cdot2=1$이다.
확률분포표에서 확률의 합은 1이므로
$\dfrac12+\dfrac14+a=1$,
$a=\dfrac14$이고 합계 $b=1$이다.
따라서
$4(a+b+S)=4\left(\dfrac14+1+1\right)=9$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `q16`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
단답형 2. 모집단의 확률분포를 표로 나타내면 다음과 같다. 이 모집단에서 크기가 2인 표본을 임의추출할 때, 표본평균을 $\overline X$라 하면 $P(\overline X=-2)+P(\overline X=2)=\dfrac38$이다. 이때 상수 $a+b$의 값을 구하시오. (5점)
<div class="question-table-wrap"><table class="question-table"><thead><tr><th>$X$</th><th>-4</th><th>0</th><th>4</th><th>합계</th></tr></thead><tbody><tr><th>$P(X=x)$</th><td>$\dfrac13$</td><td>$2a$</td><td>$b$</td><td>1</td></tr></tbody></table></div>
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **$\dfrac{13}{24}$**
- 기존 solution 정확 발췌: > 모든 확률의 합에서 $\dfrac13+2a+b=1$, $b=\dfrac23-2a$이다. 크기 2의 독립추출에서 표본평균이 $-2$인 경우는 $(-4,0),(0,-4)$이므로 확률은 $2\cdot\dfrac13\cdot2a=\dfrac{4a}{3}$이다. 표본평균이 2인 경우는 $(0,4),(4,0)$이므로 확률은 $2\cdot2a\cdot b=4ab$이다. 조건에 대입하면 $\dfrac{4a}{3}+4a\left(\dfrac23-2a\right)=\dfrac38$, $64a^2-32a+3=0$, $(8a-1)(8a-3)=0$이다. $a=\dfrac18$ 또는 $a=\dfrac38$인데, $a=\dfrac38$이면 $b=\dfrac23-\dfrac34<0$이므로 불가능하다. 따라서 $a=\dfrac18$, $
- **독립 수학 검산·판정 근거:** P(Xbar=±2)=4a/3+4ab=3/8, 가능한 a1/8,b5/12, 합13/24 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
모든 확률의 합에서
$\dfrac13+2a+b=1$,
$b=\dfrac23-2a$이다.
크기 2의 독립추출에서 표본평균이 $-2$인 경우는 $(-4,0),(0,-4)$이므로 확률은
$2\cdot\dfrac13\cdot2a=\dfrac{4a}{3}$이다.
표본평균이 2인 경우는 $(0,4),(4,0)$이므로 확률은
$2\cdot2a\cdot b=4ab$이다.
조건에 대입하면
$\dfrac{4a}{3}+4a\left(\dfrac23-2a\right)=\dfrac38$,
$64a^2-32a+3=0$,
$(8a-1)(8a-3)=0$이다.
$a=\dfrac18$ 또는 $a=\dfrac38$인데, $a=\dfrac38$이면 $b=\dfrac23-\dfrac34<0$이므로 불가능하다.
따라서 $a=\dfrac18$, $b=\dfrac5{12}$이고
$a+b=\dfrac18+\dfrac5{12}=\dfrac{13}{24}$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `q17`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
단답형 3. 시행 점수 $X$에 대하여 $X$의 평균이 $m$점이고 표준편차가 $\sigma$점일 때, $T=20\left(\dfrac{X-m}{\sigma}\right)+100$을 $X$의 표준점수라 하자. 평균이 60점이고 표준편차가 10점인 수학 시험에서 90점을 맞은 철수의 표준점수가 평균이 55점이고 표준편차가 15점인 확률과 통계 시험에서 $a$점을 맞은 영수의 표준점수와 같다고 할 때,
$a$의 값을 구하시오. (5점)
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **100**
- 기존 solution 정확 발췌: > 철수의 표준점수는 $T=20\left(\dfrac{90-60}{10}\right)+100=160$이다. 영수의 표준점수도 160이므로 $20\left(\dfrac{a-55}{15}\right)+100=160$, $\dfrac{a-55}{15}=3$, $a=100$이다.
- **독립 수학 검산·판정 근거:** 선형 표준점수 160 동일 조건 영수 점수 a100 일치.
- 원본문제 PNG: 별도 외부 PNG 없음 (인라인 HTML/표는 원문 전문에 포함).
- 기존 학생 풀이 SVG: 없음.
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
철수의 표준점수는
$T=20\left(\dfrac{90-60}{10}\right)+100=160$이다.
영수의 표준점수도 160이므로
$20\left(\dfrac{a-55}{15}\right)+100=160$,
$\dfrac{a-55}{15}=3$,
$a=100$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `q18`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 통계적 추정.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
[서술형1] 매산고 학생들의 하루 SNS 이용시간은 평균이 45분, 표준편차가 10분인 정규분포를 따른다고 한다. 매산여고 학생들을 대상으로 하루 SNS 이용시간을 조사하였더니 평균이 50분이고 표준편차가 $\sigma$분인 정규분포를 따르는 것을 발견하였다. 위의 내용을 바탕으로 아래의 <자료1>, <자료2>를 활용하여 문제를 해결하시오. (10점)
1-1. <자료1>은 매산고와 매산여고 학생들의 SNS 사용시간을 정규분포곡선으로 나타낸 것이다. ①, ②에 각각 해당하는 학교를 제시하고, 그래프 분석을 통해 $\sigma$의 범위를 추측하시오. (3점)
1-2. 매산고에서 임의추출한 25명의 표본평균이 43분 이상, 47분 이하일 확률과 매산여고에서 임의추출한 16명의 표본평균이 49분 이상 51분 이하일 확률이 같다고 한다. 이를 이용하여 $\sigma$값을 구하시오. 또한, 매산여고에서 임의추출한 64명에 대하여 사용시간 $\overline X$분 이상일 확률이 $\dfrac{57}{2500}$이라고 한다. <자료2>를 활용하여 이 경우의 $\overline X$값을 구하시오. (7점)
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **1-1: ① 매산고, ② 매산여고; $0<\sigma<10$. 1-2: $\sigma=4$분, $\overline{X}=51$분.**
- 기존 solution 정확 발췌: > 자료1에서 평균이 45분인 넓은 곡선은 매산고, 평균이 50분인 좁은 곡선은 매산여고이다. 매산여고의 표준편차는 매산고보다 작으므로 $0<\sigma<10$이다. 매산고 표본 25명의 표본평균 표준편차는 $\dfrac{10}{\sqrt{25}}=2$이다. 따라서 $P(43\le\overline X\le47)=P(-1\le Z\le1)=0.6826$이다. 매산여고 표본 16명의 표본평균 표준편차는 $\dfrac{\sigma}{4}$이다. $P(49\le\overline Y\le51)=0.6826$이므로 그 구간도 평균 50을 중심으로 표준화 폭 1이다. $\dfrac{1}{\sigma/4}=1$, $\sigma=4$이다. 이제 매산여고 표본 64명의 표본평균 표준편차는 $\dfrac4{\sqrt{64}}=\d
- **독립 수학 검산·판정 근거:** 실물 ① 넓은 곡선 μ45 σ10, ② 좁은 곡선 μ50 σ4; 표본 SE0.5, z2 상한51 일치.
- 원본문제 PNG: JS 지정 `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q18.png` → 실제 저장소 `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q18.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q18-solution-v2.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
자료1에서 평균이 45분인 넓은 곡선은 매산고, 평균이 50분인 좁은 곡선은 매산여고이다.
매산여고의 표준편차는 매산고보다 작으므로
$0<\sigma<10$이다.

매산고 표본 25명의 표본평균 표준편차는
$\dfrac{10}{\sqrt{25}}=2$이다.
따라서
$P(43\le\overline X\le47)=P(-1\le Z\le1)=0.6826$이다.
매산여고 표본 16명의 표본평균 표준편차는 $\dfrac{\sigma}{4}$이다.
$P(49\le\overline Y\le51)=0.6826$이므로 그 구간도 평균 50을 중심으로 표준화 폭 1이다.
$\dfrac{1}{\sigma/4}=1$,
$\sigma=4$이다.

이제 매산여고 표본 64명의 표본평균 표준편차는
$\dfrac4{\sqrt{64}}=\dfrac12$이다.
$P(\overline X\ge x)=\dfrac{57}{2500}=0.0228$이고
$P(Z\ge2)=0.5-0.4772=0.0228$이므로
$\dfrac{x-50}{\frac{1}{2}}=2$,
$x=51$분이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `q19`; sourceIdentityKey: `NOT_PRESENT`; source Git blob: `33c689a96705cd2269c448de1f2f0828cbaf5448`; 단원: 확률분포.
- 실제 원문 문제·수치·표·보기 조건 (JS content 정확 보존):

~~~text
[서술형2] 한 개의 주사위를 던져 나온 눈의 수를 $a$라 하자. 좌표평면에서 이차함수 $y=x^2+2x+2$와 직선 $-x+2y=a$가 만나는 사건을 $A$라 할 때, 주사위를 던지는 시행을 72번 시행하여 사건 $A$가 44번 이상 발생할 확률을 구하고자 한다. 다음을 단계별로 해결하시오. (10점)
2-1. 이차함수 $y=x^2+2x+2$와 직선 $-x+2y=a$가 만나는 주사위 눈의 수 $a$를 모두 구하시오. (단, $a$는 6 이하의 자연수이다.) (3점)
2-2. 확률변수 $X$가 주사위를 던졌을 때 사건 $A$가 일어나는 수라고 할 때, 확률변수 $X$는 이항분포 $B(n,p)$를 따른다. 이때 $E(X)$와 $V(X)$의 값을 구하시오. (3점)
2-3. 72는 충분히 큰 수이므로 확률변수 $X$가 근사적으로 정규분포를 따른다고 할 때, $P(X\ge44)$의 값을 구하시오. (단, 표준정규분포표를 이용한다.) (4점)
표: $z=1,2,3$일 때 $P(0\le Z\le z)=0.3413,0.4772,0.4987$.
~~~

- 원본 선택지: 서술형 — 원본 선택지 없음
- 원본 정답: **2-1: $a=3,4,5,6$. 2-2: $E(X)=48$, $V(X)=16$. 2-3: $0.8413$.**
- 기존 solution 정확 발췌: > 교점을 구하려고 직선식을 $y$에 대해 정리한다. $-x+2y=a$에서 $y=\dfrac{x+a}{2}$이다. 포물선과 만나려면 $x^2+2x+2=\dfrac{x+a}{2}$, $2x^2+3x+4-a=0$이 실근을 가져야 한다. 판별식 조건은 $D=3^2-4\cdot2(4-a)=8a-23\ge0$, $a\ge\dfrac{23}{8}$이다. $a$는 6 이하의 자연수이므로 가능한 눈은 $a=3,4,5,6$이다. 따라서 한 번 시행에서 사건 $A$의 확률은 $p=\dfrac46=\dfrac23$이다. 72번 시행에서 성공 횟수 $X$는 $B(72,\dfrac23)$를 따르므로 $E(X)=np=72\cdot\dfrac23=48$, $V(X)=np(1-p)=72\cdot\dfrac23\cdot\dfrac13=16$
- **독립 수학 검산·판정 근거:** 직선·이차함수 판별식8a−23≥0→주사위 눈3,4,5,6, 72회 B(72,2/3) μ48 σ4, ≥44 무보정 .8413 일치.
- 원본문제 PNG: JS 지정 `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q19.png` → 실제 저장소 `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q19.png` (원본 실물 육안 확인)
- 기존 학생 풀이 SVG: `assets/images/2019_매산고_2학기_기말_고2_확률과통계/q19-solution-v2.svg` (원본 경로만 확인, SVG 렌더 **NOT_RUN**).
- 기존 solution **전문** (원본 유지, 변경 없음):

~~~text
교점을 구하려고 직선식을 $y$에 대해 정리한다.
$-x+2y=a$에서 $y=\dfrac{x+a}{2}$이다.
포물선과 만나려면
$x^2+2x+2=\dfrac{x+a}{2}$,
$2x^2+3x+4-a=0$이 실근을 가져야 한다.
판별식 조건은
$D=3^2-4\cdot2(4-a)=8a-23\ge0$,
$a\ge\dfrac{23}{8}$이다.
$a$는 6 이하의 자연수이므로 가능한 눈은
$a=3,4,5,6$이다.
따라서 한 번 시행에서 사건 $A$의 확률은 $p=\dfrac46=\dfrac23$이다.

72번 시행에서 성공 횟수 $X$는 $B(72,\dfrac23)$를 따르므로
$E(X)=np=72\cdot\dfrac23=48$,
$V(X)=np(1-p)=72\cdot\dfrac23\cdot\dfrac13=16$이다.

정규근사를 하면 $X$는 평균 48, 표준편차 4인 정규분포로 근사된다.
연속성 보정 없이 문제의 경계 44를 표준화하면
$Z=\dfrac{44-48}{4}=-1$이다.
따라서
$P(X\ge44)\approx P(Z\ge-1)$
$=0.5+P(0\le Z\le1)$
$=0.5+0.3413=0.8413$이다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원문 content/choices/answer/solution/이미지 변경 없음.

## 2. 그림 실물 증적 및 수학 검증 범위

- 원본 PNG 5개 실물 모두 확인: Q07: `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q07.png`; Q13: `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q13.png`; Q15: `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q15.png`; Q18: `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q18.png`; Q19: `archive/assets/images/2019_매산고_2학기_기말_고2_확률과통계/q19.png`.
- PNG를 출제 JS의 상대 경로와 실제 저장소 경로로 각각 기록했다. `archive/assets/images/`와 루트 `assets/images/`가 혼재하므로 실제 위치만 확인 없이 경로를 통일하지 않는다.
- 기존 학생해설 SVG 10개의 필드·원본 경로를 기록했으나 렌더·Golden/Negative·화면 QA·원본 PDF 대조는 **NOT_RUN**이다.
- 전 문항 JS 원문 내용, 선택지, 정답, 기존 해설 전문을 보존하고 수학 판정을 별도 서술했다. UPGRADE 발견은 출고 수정 승인과 같지 않다.

## 3. 시험지 완료 게이트

- **19/19 READ_EVIDENCED; UNREAD=[]; next_qid=NONE; EXAM_AUDIT_COMPLETE.**
- 해설 수정안은 분리 MD에만 존재한다. 원본 source fidelity, SVG 렌더, 인쇄본, Golden/Negative, 학생 UI 검수, 운영 병합은 **HOLD/NOT_RUN**.
