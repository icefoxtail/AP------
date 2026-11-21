# 2023 매산여고 고1 2학기 중간고사 기출 — lane40 심층 감사

- 원본: `archive/exams/original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js`, Git blob `1d51ddf01bcba2a573d65cb3cdec20e161abd05f`, 2023 original/2mid, q1~q23 총 23문항.
- 실제 교육과정: 원본 `standardCourse`는 고1 **수학(상)/수학(하)** 혼합, 단원은 집합·명제·함수·도형의 이동 등 2015 고1 과정. 폴더만으로 분류하지 않았음. `sourceIdentityKey` 없으므로 원본 경로+blob+qid 고정.
- 공유 독점 claim: `claims/h1/1d51ddf01bcba2a573d65cb3cdec20e161abd05f.json`; GitHub `create_file` 커밋 `30386fb6c109da611ad5c53b382459fc1dafa47b`, owner lane40·source·blob readback 확인 후 q1 시작.
- 가이드: `HARNESS_CURRENT`, `GLOBAL_QUEUE_CURRENT`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT`, `docs-manifest.json`, `BOARD_SOLUTION_SAMPLES_CURRENT` 및 main core/학생용 판서/Golden·Negative 본문. 전체 23개 문제·보기·답·기존 풀이 읽음. 원본 문제 `q04-problem-v2.svg`는 Inkscape로 임시 PNG 렌더해 ①~⑤ 시각 판독; `q15.png`,`q16.png`도 실제 열람. 별도 `solutionImage` 독립 렌더/Golden·Negative 정식 게이트/학생 화면/출고는 `VISUAL_HOLD`/`NOT_RUN`, PASS 아님. JS·SVG·main 직접 수정 없음.

## q1 — KEEP
- 원문 `n(\{0\})=0`, `\emptyset\subset\{\emptyset,a,\{b\},b\}`, `n(\emptyset)=1`을 말하는 세 학생 중 옳은 것, 답 ① 범수.
- 기존 식 `$n(\{0\})=1$`, `$\emptyset\subset A$`, `$n(\emptyset)=0$`. 집합 $\{0\}$과 공집합의 개수를 구분해 KEEP.

## q2 — KEEP
- 원문 맛있는 음식, $x^2=-2$ 실근, 25의 약수, 10 이하 자연수 중 집합인 것, 답 ④ ㄴ·ㄷ·ㄹ.
- 기존 설명 `ㄴ은 만족하는 실수가 없어 공집합이지만, 공집합도 집합이다`. $x^2\ge0$으로 ㄴ이 공집합임을 독립 확인, 주관적 ㄱ 제외 근거 있어 KEEP.

## q3 — KEEP
- 원문 100 이하 자연수 부분집합 중 20 이하 소수 **전부 포함**하는 수, 답 ③ $2^{92}$.
- 기존 식 `$2,3,5,7,11,13,17,19$의 $8$개 고정`, 나머지 92개 자유, `$2^{92}$`. 포함 조건을 선택 가능한 원소 수에서 정확히 제외해 KEEP.

## q4 — UPGRADE (`AMBIGUOUS_REGION`, 실제 문제 SVG 렌더 확인)
- 원문 벤다이어그램 중 `$(A\cup B)-(A-C)$`를 색칠한 것, 정답 **⑤**. 원본 `q04-problem-v2.svg`를 실제 렌더해 다섯 보기 판독. ⑤는 B만의 영역, $B\cap C$, $A\cap C$를 포함하되 **$A\cap B\cap C^c$는 색칠하지 않음**.
- 기존 식/문장 그대로: `$A-C=A\cap C^c$이므로 $(A\cup B)-(A-C)=(A\cup B)\cap(A\cap C^c)^c$이다.` / `이는 $A\cup B$에서 $A$에만 속하고 $C$에는 속하지 않는 부분을 제외한 영역이다.`
- 문제점: **“A에만 속하고”**가 $A\cap B^c$라는 **A 단독 영역**으로 오독되면 $A\cap B\cap C^c$를 남기는 오답 그림을 고를 수 있다. 실제 제외 대상은 $A-C=A\cap C^c$로서 **B에 동시에 속하는지와 무관**하다. 기존 등식 자체는 맞지만, 등식에서 그림의 세부 칸으로 가는 설명이 불분명하다. $B\cap A\cap C^c$의 제외를 한 번 더 명확히 계산하고 그림 ⑤와 연결한다.
- 독립 검산: `$(A\cup B)\cap(A^c\cup C)=((A\cup B)\cap A^c)\cup((A\cup B)\cap C)=(B\cap A^c)\cup(A\cap C)\cup(B\cap C)$`. 각 부위를 실제 선택지 ⑤와 대조.

### q4 — 복사 가능한 학생용 개선 solution

집합의 차는 왼쪽 집합에 속하되 오른쪽 집합에는 속하지 않는 원소를 뜻한다. 먼저 빼는 집합 $A-C$를 명확하게 쓰자.
\[
\begin{aligned}
A-C&=A\cap C^c,\\
(A\cup B)-(A-C)
&=(A\cup B)\cap(A\cap C^c)^c\\
&=(A\cup B)\cap(A^c\cup C)\\
&=\big((A\cup B)\cap A^c\big)\cup\big((A\cup B)\cap C\big)\\
&=\big((A\cap A^c)\cup(B\cap A^c)\big)\cup\big((A\cap C)\cup(B\cap C)\big)\\
&=(B\cap A^c)\cup(A\cap C)\cup(B\cap C).
\end{aligned}
\]
따라서 **B에만 속한 부분**, **A와 C가 함께 겹치는 부분**, **B와 C가 함께 겹치는 부분**을 모두 색칠한다. 반면 $A\cap C^c$에 속하는 모든 칸은 B와 겹치더라도 제외한다. 특히 $A\cap B\cap C^c$도 **색칠하지 않는다**.

그림에서 이 영역을 나타낸 것은 **⑤**이다.

- 역검산: 벤다이어그램의 7개 원자영역을 대조하면 B-only 참, A∩B만(¬C) 거짓, A-only 거짓, A∩C만 참, B∩C만 참, 삼중교집합 참, C-only 거짓. 위 집합식과 선택지 ⑤ 일치. SVG 출력 변경·렌더 출고 `NOT_RUN`.

## q5 — KEEP
- 원문 $|U|=100,|A|=69,|B|=43,|A\cap B^c|=38$, $|A^c\cap B^c|$, 답 ② 19.
- 기존 식 `$|A\cap B|=69-38=31$`, `$|A\cup B|=69+43-31=81$`, `$100-81=19$`. 포함배제와 드모르간 계산 모두 보여 KEEP.

## q6 — KEEP
- 원문 명제가 아닌 보기, ④ `25의 배수는 적다`.
- 기존 설명 `①, ②, ③, ⑤는 참 또는 거짓을 분명하게 판별할 수 있지만, ④의 적다는 기준이 없다`. 거짓 명제도 명제라는 구분이 있어 KEEP.

## q7 — KEEP
- 원문 $p:2x^2-3x+1=0$이 $q:x=2a$의 필요조건인 $a$값 합, 답 ⑤ $3/4$.
- 기존 식 `$(2x-1)(x-1)=0\Rightarrow x=1/2,1$`, `$2a=1/2\text{ 또는 }1\Rightarrow a=1/4,1/2$`. 필요조건 방향 $q\Rightarrow p$가 명확해 KEEP.

## q8 — KEEP
- 원문 `$x+y\ge2\Rightarrow x\ge1\text{ 또는 }y\ge1$`의 대우, 답 ②.
- 기존 식 결론 부정 `$x<1\text{ 이고 }y<1$`, 가정 부정 `$x+y<2$`. AND/OR 드모르간과 부등호 경계가 맞아 KEEP.

## q9 — KEEP
- 원문 $Q\cap R=R$, $\neg q$가 $p$의 필요하지만 충분하지 않은 조건, 항상 옳은 것은 ③ `r`은 `q`의 충분조건.
- 기존 식 `$R\subset Q\Rightarrow r\Rightarrow q$`. 추가 조건의 참거짓과 관계없이 이 포함이 성립해 ③ 필연, KEEP.

## q10 — KEEP
- 원문 $|a+b|\ge|a|-|b|$ 증명 빈칸, 답 ① `$>$`, `$ab+|ab|$`, `$ab\le0$`.
- 기존 식 `$|a+b|^2-(|a|-|b|)^2=2(ab+|ab|)\ge0$`, $|a|<|b|$이면 우변 음수, 좌변 비음수. 두 경우와 제곱 비교의 부호 조건을 갖춰 KEEP.

## q11 — KEEP
- 원문 $(-3,4)$를 $(5,-3)$만큼 이동, 답 ② $(2,1)$.
- 기존 식 `$(-3+5,4-3)=(2,1)$`. 두 좌표와 부호를 각각 계산해 KEEP.

## q12 — KEEP
- 원문 $y=2x+2$를 수평 $a$ 이동 $l_1$, 수직 $a$ 이동 $l_2$, 포물선 $y=x^2+x+1$과 교점 조건에서 $m+n$, 답 ① $-5/8$.
- 기존 식 `$l_1:y=2x-2a+2$`와 판별식 `$5-8a\ge0\Rightarrow m=5/8$`, `$l_2:y=2x+2+a$`와 판별식 `$4a+5\ge0\Rightarrow n=-5/4$`, 합 `$5/8-5/4=-5/8$`. 등호에서 접점 허용됨을 확인해 KEEP.

## q13 — KEEP
- 원문 $X=[1,3]$, $Y=[5,a]$, $f(x)=2x+b$가 일대일대응, 답 ④ 12.
- 기존 식 치역 `$[2+b,6+b]=[5,a]$`에서 `$b=3,a=9$`, 합12. 증가함수 양끝 대응 이유가 있어 KEEP.

## q14 — KEEP
- 원문 $\mathbb R\to\mathbb R$ 함수 다섯 중 일대일대응, 답 ④ 조각함수 $x$ if $x<0$, $2x$ if $x\ge0$.
- 기존 설명 음수 전체를 음수로, 비음수 전체를 비음수로 한 번씩 대응. 두 치역이 서로소이고 합이 $\mathbb R$이므로 일대일/전사 둘 다 KEEP.

## q15 — KEEP / 문제 PNG 확인
- 원문 두 삼각형 $f(x,y)=0,g(x,y)=0$이 그림과 같을 때 좌표 치환 선택, 답 ⑤ `$g(x,y)=f(y+3,-x-1)$`.
- 기존 식 `$u=y+3,v=-x-1\Rightarrow(x,y)=(-v-1,u-3)$`, 꼭짓점 $(0,0),(1,1),(2,0)$가 $(-1,-3),(-2,-2),(-1,-1)$로 이동. PNG와 세 꼭짓점 직접 대조, KEEP.

## q16 — KEEP / 문제 PNG 확인
- 원문 $A(0,2),B(0,4),C(0,8)$, $P,Q\in y=x$, $AP+PB+BQ+QC$ 최소일 때 $PQ$, 답 ② $4\sqrt2/3$.
- 기존 식 $A'=(2,0)$, 직선 `$A'B:y=-2x+4$`에서 `$P=(4/3,4/3)$`, $C'=(8,0)$, 직선 `$BC':y=-x/2+4$`에서 `$Q=(8/3,8/3)$`. 두 교점은 해당 반사 선분 내부, 거리 `$\sqrt{(4/3)^2+(4/3)^2}=4\sqrt2/3$`; 근거 모두 있어 KEEP.

## q17 — KEEP
- 원문 진리 조건 두 개의 대우·역 중 참 개수에 따른 $f(a,b)f(b,c)=-9$, 결합식 값, 답 ③ 0.
- 기존 식 `$f(a,b),f(b,c)$는 $3,-3$의 조합`, 동치 관계 하나와 진부분집합 관계 하나이므로 `$f(c,a)=-3$`, `$f(a,a)=3$`, `3+9-9-3=0`. 조건 관계의 방향이 결과의 ±3 판정에 영향을 주지 않음을 설명해 KEEP.

## q18 — KEEP
- 원문 $X=\{1,2,3,4\}$에서 $g(1)=2,g(2)=1,g(3)=g(4)=3,f(4)=2$, $h(x)=\max(f(x),g(x))$가 전단사, $f(2)+h(2)$, 답 ① 2.
- 기존 식 `$h(4)=3$`, `$h(3)\ge3$과 전단사로 `$h(3)=4$`, 나머지 $h(1)=2,h(2)=1$, `$\max(f(2),1)=1\Rightarrow f(2)=1$`. 네 치역을 배타적으로 세어 KEEP.

## q19 — KEEP
- 원문 $a,b>0$, $(a+b)(2/a+8/b)\ge k$의 최대 $k$, 답 18.
- 기존 식 `$=10+2b/a+8a/b\ge10+2\sqrt{16}=18$`, 등호 `$2b/a=8a/b\Rightarrow b=2a$`. 양수/등호 조건 분명해 KEEP.

## q20 — KEEP
- 원문 $A=\{1,2,3,4\},B=\{1,\dots,7\}$, $|P\cap A|=2,P\subset B,\sum P=20$, 답 $\{3,4,6,7\}$.
- 기존 식 $A$에서 두 원소합 범위 3~7, $\{5,6,7\}$에서 필요한 합 13~17은 `$6+7=13$`뿐, 나머지 `$3+4=7$`. 네 원소를 실제 대입해 총합20·교집합2 확인, KEEP.

## q21 — KEEP
- 원문 원 중심 $(4,-3)$을 $(-2,3)$ 이동한 다음 $y=x$ 대칭, 넓이 이등분선 $y=2x+k$, 답 $k=2$.
- 기존 식 중심 `$(4,-3)\to(2,0)\to(0,2)$`, 직선 중심대입 `$2=2\cdot0+k\Rightarrow k=2$`. 반지름/이등분 조건 일치해 KEEP.

## q22 — KEEP
- 원문 `어떤 실수 $x$에 대해 $x^2-6x+a<0$`의 부정이 참, 부정·$a$ 범위, 답 전칭 `$\ge0$`, $a\ge9$.
- 기존 식 `$x^2-6x+a=(x-3)^2+a-9$`, 최솟값 $a-9\ge0$. 존재문 부정→전칭 부등호 전환과 등호점이 있어 KEEP.

## q23 — KEEP
- 원문 $n\ge2$ 자연수일 때 $\sqrt{n^2-1}$ 무리수 귀류법 서술형.
- 기존 식 기약분수 $p/q$ 가정, `$p^2=q^2(n^2-1)\Rightarrow q=1$`, `$(n-p)(n+p)=1$`은 두 양의 정수이므로 둘 다1, `$n=1$` 모순. 기약조건·인수 양수·귀류 흐름이 완비돼 KEEP.

## 완료·인계

- **23문항 전수 읽음, KEEP 22 / UPGRADE 1(q4) / HOLD 0 / UNREAD 0.** q4 전체 학생용 대체 풀이 작성·영역별 독립 검산 완료, 남은 qid 없음. `EXAM_AUDIT_COMPLETE` 및 `EXAM_DRAFT_COMPLETE`는 MD 초안에 한함.
- 기존 그림 SVG의 출고 렌더·학생 화면·Golden/Negative 정식 실행은 `VISUAL_HOLD`/`NOT_RUN`; JS/SVG/main 수정 및 출고 승인 없음.
