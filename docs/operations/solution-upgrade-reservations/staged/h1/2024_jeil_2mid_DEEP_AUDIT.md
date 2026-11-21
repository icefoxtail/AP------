# 2024 제일고 고1 2학기 중간고사 기출 — lane40 심층 감사

- 원본: `archive/exams/original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js`, Git blob `cb76d0dc4cf639051015a8a19e2aa1625fe15b45`, 2024 2mid original, 전체 22문항.
- 과목·교육과정 분류: 문항별 실제 `standardCourse`와 단원 확인. 2015 개정 고1 `수학(상)`의 부등식 등과 고1 `수학(하)`의 집합·함수이며, `h1` 폴더명에 의존하지 않음. 원본에 `sourceIdentityKey`는 없으므로 원본 경로·blob·id로 결속.
- 점유: `claims/h1/cb76d0dc4cf639051015a8a19e2aa1625fe15b45.json`, GitHub 독점 `create_file` 커밋 `5ddf76962e0a573192b16d27720341fa6e39c3eb`, `ownerLane=lane40`·blob·source 원격 readback 확인 후 시작.
- 기준 문서: harness `HARNESS_CURRENT`, `GLOBAL_QUEUE_CURRENT`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT`, `docs-manifest.json`, `BOARD_SOLUTION_SAMPLES_CURRENT`; main의 core·학생용 판서·Golden/Negative 실제 본문 확인. q1~q22의 문제·보기·정답·해설 전체를 실제 열람. q13 문제 그림 PNG 열람하여 함숫값 대응 확인. 해설 SVG 등 별도 렌더는 미실시.
- 판정: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE**(전수 22/22, KEEP 22 / UPGRADE 0 / HOLD 0 / UNREAD 0). 아래 원문 핵심과 기존 solution의 정확한 식을 인용하고 독립 검산. 정식 Golden/Negative/학생화면/시각/출고 `NOT_RUN` 또는 `VISUAL_HOLD`, PASS 아님. JS/SVG/main 수정 없음.

## q1 — KEEP
- 원문: $A=\{1,2\},B=\{\{1\},3\}$에 대한 옳지 않은 보기, 답 ④ `$\{1,3\}\subset B$`.
- 기존 설명 `B에는 수 1이 아니라 집합 {1}이 들어 있으므로 거짓`. $1\notin B$, $\{1\}\in B$로 원소/부분집합 층위를 구분하므로 KEEP.

## q2 — KEEP
- 원문: 공집합·전체집합·여집합 관련 등식 중 틀린 것, 답 ⑤ `$A\cap(A\cup B)=A\cup B$`.
- 기존 식 `$A\cap(A\cup B)=A$`. 흡수법칙으로 즉시 반례 가능($A\subsetneq B$), 나머지 기본 법칙도 검토하므로 KEEP.

## q3 — KEEP
- 원문: $A\cup B^c=U$, $A^c\cup B=U$, $B^c\subset A^c$, $A\cup B=B$, $A\cap B=A$ 중 다른 포함관계, 답 ①.
- 기존 해설 `① $A^c\cap B=\emptyset\Rightarrow B\subset A$`, `②~⑤ $A\subset B$`. 드모르간/포함의 역전 계산이 있어 KEEP.

## q4 — KEEP
- 원문: $n(U)=20,n(A)=8,n(B)=9,n(A^c\cup B^c)=18$에서 $n(A\cup B)$, 보기 14~18, 답 ②.
- 기존 식 `$n(A\cap B)=20-18=2$`, `$8+9-2=15$`. 교집합 여집합과 포함배제가 분리되어 KEEP.

## q5 — KEEP
- 원문: $(x+2)(x+3)>0$ 및 $(x-2)(x+2)\le0$ 공통 정수의 합, 답 ② 2.
- 기존 식 `$x<-3\text{ 또는 }x>-2$`, `$-2\le x\le2$`, 교집합 `$-2<x\le2$`, 정수 `$-1,0,1,2$`. 경계 포함과 합 $2$가 정확해 KEEP.

## q6 — KEEP
- 원문: $|2x-1|-|x-1|\le2$인 정수 개수, 답 ⑤ 5.
- 기존 구간 `$x<1/2$, $1/2\le x<1$, $x\ge1$`, 차례로 `-x\le2`, `3x-2\le2`, `x\le2`. 합치면 $[-2,2]$이고 정수 5개, KEEP.

## q7 — KEEP
- 원문: $U=\{1,2,4\},A=\{2,4\},n(A-X)=1$인 $X\subset U$ 개수, 답 ④ 4.
- 기존 식 `$2\times2=4$`: 2와 4 중 정확히 한 원소가 $X$에 포함되고 1은 독립 선택. 중복 없이 모든 경우 확인, KEEP.

## q8 — KEEP
- 원문: $A=\{x:x^2-kx+1<0\}\ne\emptyset$이 $B=(0,5)$에 포함되게 하는 정수 $k$ 개수, 답 ③ 3.
- 기존 식 `$k^2-4>0$`, `$k>2$`, `$26-5k\ge0$`, 따라서 `$2<k\le26/5$`, $k=3,4,5$. $k>2$이면 두 근 양수, 작은 근은 1 아래, $f(5)\ge0$은 큰 근 $\le5$ 조건인 점을 확인해 KEEP.

## q9 — KEEP
- 원문: $U=\{1,\dots,10\}$에서 부분집합 원소합 $f(A)$에 관한 ㄱ~ㄷ, 답 ④(ㄱ·ㄷ).
- 기존 식 `$f(A^c)=f(U)-f(A)$`, 반례 `$A=\{1,4\},B=\{2,3\},f(A)=f(B)=5$`, 서로소 합집합은 합이 더해짐. 세 진술을 각각 검증해 KEEP.

## q10 — KEEP
- 원문: $X=\{-2,-1,0,1,2\}$에서 $Y=\{-1,0,1,2,3\}$으로의 함수 고르기, 답 ④ $k(x)=[x]+1$.
- 기존 식 `$[x]=x$ for integer $x\in X$`, 따라서 출력 `$-1,0,1,2,3$` 모두 $Y$ 안. 다른 보기의 $-2,4,-2,4$ 등 공역 밖 반례를 제시해 KEEP.

## q11 — KEEP
- 원문: $f:X=\{1,2,3,4,5\}\to Y=\{2,3,5,7,11,13\}$ 일대일, $f(3)=5$, 좌측 입력은 $>5$, 우측 입력은 $<5$, 함수 수, 답 ③ 12.
- 기존 식 `$f(1),f(2)$는 $7,11,13$에서 순서 있게 $3\cdot2=6$`, `$f(4),f(5)$는 $2,3$의 $2$순열`, `$6\cdot2=12$`. 독립 곱셈과 일대일 조건 확인, KEEP.

## q12 — KEEP
- 원문: $f(x)=-x+3$, $\sum_{i=1}^k f^i(1)=35$일 때 $k$, 답 ④ 23.
- 기존 식 `$f(1)=2,f^2(1)=1$`, 짝수항 총합 `$3m$`, 홀수항 총합 `$3m+2=35\Rightarrow m=11,k=23$`. 주기2와 마지막 항 포함이 명확해 KEEP.

## q13 — KEEP / VISUAL_HOLD(해설 SVG)
- 원문: 실제 PNG에 있는 $y=f(x),y=g(x),y=x$ 그래프와 점선 좌표 $a,b,c,d,e$의 합성·역합성 중 틀린 것, 답 ③.
- 기존 그래프 독해 `f(d)=c, f(c)=b, f(e)=d, g(c)=d, g(d)=e`. 원본 이미지에서 이 대응을 직접 대조. 특히 `$(g\circ f)(d)=g(c)=d\ne c$`가 ③의 틀린 식이며 `$(f^{-1}\circ g)(c)=f^{-1}(d)=e$`도 참. KEEP.

## q14 — KEEP
- 원문: $f(x)=x^3-2x-2$가 항등함수가 되는 비공집합 정의역 $X$ 개수, 답 ② 3.
- 기존 식 `$f(x)=x\Rightarrow x^3-3x-2=(x-2)(x+1)^2=0$`, 해집합 `$\{-1,2\}$`, 비공집합 부분집합 수 `$2^2-1=3$`. 중근을 다른 원소로 중복 계산하지 않아 KEEP.

## q15 — KEEP
- 원문: $g\circ h=2x-3$, $f\circ g\circ h=4x+1$에서 $f^{-1}(6)$, 답 ⑤ $-1/2$.
- 기존 식 `$t=2x-3\Rightarrow x=(t+3)/2$`, `$f(t)=4(t+3)/2+1=2t+7$`, `$2u+7=6\Rightarrow u=-1/2$`. 입력 치환과 역상 계산을 보이므로 KEEP.

## q16 — KEEP
- 원문: $f(x)=|x-2|$, $f(f(x))=1$의 서로 다른 실근 곱, 답 ① $-15$.
- 기존 식 `$||x-2|-2|=1$` → `$|x-2|=3\text{ 또는 }1$`, 해 `$-1,5,1,3$`, 곱 `$(-1)\cdot5\cdot1\cdot3=-15$`. 두 분기 모두 풀어 KEEP.

## q17 — KEEP
- 원문: $f(x)=x^2$ for $x\ge0$, $f(x)=x$ for $x<0$, 반복합성·역함수 ㄱ~ㄹ 판정, 답 ⑤(모두).
- 기존 식 `f(16)=f(f(4))=f(f(f(2)))=256`, `$f^{-1}(-7)=f(-7)=-7$`, `$(f\circ f)^{-1}(9)=\sqrt3$`. 음수 구간 $y=x$에서 원·역그래프가 무한히 겹쳐 교점 3개 이상. 네 진술 직접 확인, KEEP.

## q18 — KEEP
- 원문: $U=\{a,b,c,d\}$의 공집합 아닌 두 부분집합 $A,B$ 사이 일대일대응 존재하는 순서쌍 수, 답 ① 69.
- 기존 식 `$\binom41^2+\binom42^2+\binom43^2+\binom44^2=16+36+16+1=69$`. 집합 크기 같음 필요충분·순서쌍 별도 선택이 표시돼 KEEP.

## q19 — KEEP
- 원문: 총 20명, 수학 8·영어 6·아무것도 안 함 9, 수학만 신청 인원 서술형, 답 5명.
- 기존 식 `$20-9=11$`, `$8+6-x=11\Rightarrow x=3$`, `$8-3=5$`. 포함배제와 차집합 계산을 별도로 제시해 KEEP.

## q20 — KEEP
- 원문: 정수부분 $[x]$가 있는 이차부등식 `$x^2-[x]-2\le0$` 서술형, 답 $[-1,\sqrt3]\cup\{2\}$.
- 기존 식 `$x^2\le[x]+2\le x+2\Rightarrow(x-2)(x+1)\le0$`; $[-1,0)$에서 `[x]=-1`, $[0,1)$에서 `0`, $[1,2)$에서 `1`, 마지막 $x=2$ 별도 검산. $[-1,\sqrt3]\cup\{2\}$ 경계와 고립점이 모두 포함돼 KEEP.

## q21 — KEEP
- 원문: $f=-2x+3,g=3x+2$, $\big(f\circ(g^{-1}\circ f)^{-1}\circ f\big)^{-1}(x)$ 서술형, 답 $-x/6+11/6$.
- 기존 식 `$(g^{-1}\circ f)^{-1}=f^{-1}\circ g$`, `$f\circ f^{-1}\circ g\circ f=g\circ f$`, `$(g\circ f)(x)=-6x+11$`, 역함수 `$-x/6+11/6$`. 합성 순서 및 일차식 역변형 명시돼 KEEP.

## q22 — KEEP
- 원문: $f(x)=-x^2+bx-2$ for $x\ge-1$, $f(x)=x^2+ax+2$ for $x<-1$가 $\mathbb R\to\mathbb R$ 일대일대응, $a+b$의 최댓값 서술형, 답 $-2$.
- 기존 식 `$b/2\le-1\Rightarrow b\le-2$`, `$-a/2\ge-1\Rightarrow a\le2$`; 각 치역 `$(-\infty,-b-3]$`와 `$(3-a,\infty)$`의 겹침/틈 방지로 `$-b-3=3-a\Rightarrow b=a-6$`. 따라서 `$a+b=2a-6\le-2$`, 등호 $a=2,b=-4$에서 실제 치역 $(-\infty,1]$와 $(1,\infty)$을 연결함. 단조성·경계 포함 조건까지 갖춰 KEEP.

## 완료·인계

- 전수 22/22. **KEEP=22, UPGRADE=0, HOLD=0, UNREAD=0**, 완성 개선 qid 없음, 남은 감사 qid 없음. 모든 KEEP에 실제 원문 제약과 기존 풀이의 계산/반례 및 독립 확인 증거를 기록함.
- 본 단계의 `EXAM_AUDIT_COMPLETE`, `EXAM_DRAFT_COMPLETE`는 **MD 감사 초안 한정**. 원본 해설 SVG/학생 화면/Golden·Negative 정식 실행 `VISUAL_HOLD`/`NOT_RUN`, 출고 PASS 주장 없음.
- 다음은 같은 고1 2학기 중간고사 원본 기출의 다음 연도 미점유 시험지. 타 학기·유사·타과목 이동 금지.
