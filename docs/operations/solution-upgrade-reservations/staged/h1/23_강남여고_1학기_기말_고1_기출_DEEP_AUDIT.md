# 2023 강남여고 고1 1학기 기말 — 문항별 심층 감사 완료 (출고 QA 미실행)

- lane30 / original / h1/1final / 2023 / 2015 교육과정 수학(상).
- sourcePath: `archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js`
- sourceBlobSha: `89d4bacd0ccb07cd4dc0627b07ac2b03d651aee6`.
- 현재 상태: AUDIT_COMPLETE; nextQid=NONE; 25/25 수학·문항 본문 판독, KEEP 24 / UPGRADE 1(q21) / HOLD 0 / UNREAD 0 (원본 PNG 3개 판독 완료; 기존 solution SVG 시각 QA 별도 NOT_RUN), q1~q7 수학적 KEEP 포함.
- 원본 solutionImage SVG의 실물 시각 검증은 아직 NOT_RUN. q1,q3~q7 및 다른 기존 solutionImage SVG의 시각 QA는 별도 NOT_RUN.
- EXAM_AUDIT_COMPLETE=YES (원본 문제 PNG 판독 포함, 문항별 감사 완료; solution SVG 시각 QA 별도 NOT_RUN); EXAM_DRAFT_COMPLETE=YES (q21 완성 풀이 작성); Golden/Negative calibration=NOT_RUN; student exam/sol/ans render=NOT_RUN; 출고 PASS 아님.
- 이번 실행은 원격 source와 하네스·템플릿·판서 샘플·core 문서의 접근 및 시작 부분을 확인했으나 core 전체 판독·Golden/Negative 실물 판독은 완료하지 못함. 따라서 완전한 preflight 완료 주장 금지.

## q1 — KEEP (수학 검토 잠정, SVG QA 미실행)
- 원문: 연립부등식 `2x-4>0, -3+x≤1`의 정수해 개수. 보기 1,2,3,4,5. answer ②.
- 기존 solution: `첫 번째 부등식에서 $2x-4>0$이므로 $2x>4$, 따라서 $x>2$이다.` / `두 조건을 동시에 만족하려면 $2<x\\le4$이어야 한다.`
- 검산: 2x−4>0 → x>2; x−3≤1 → x≤4. 교집합 (2,4]의 정수 {3,4} 두 개. 기존 풀이에 두 조건과 경계가 모두 나와 KEEP.
- solutionImage q1-solution.svg NOT_RUN.

## q2 — KEEP
- 원문: A(2,3), B(a,−1)의 거리 5, 양수 a. 보기 1,2,3,4,5. answer ⑤.
- 기존 solution: `$(a-2)^2+(-1-3)^2=5^2$` / `$a=5$ 또는 $a=-1$이다.`
- 검산: (a−2)²+16=25 → (a−2)²=9 → a=5 또는 −1; 양수 조건으로 5. 양수 조건을 실제 적용하여 KEEP.

## q3 — KEEP (SVG QA 미실행)
- 원문: A(−5,2), B(1,5)를 2:1 내분 P, 외분 Q, 거리 PQ. 보기 √5,2√5,3√5,4√5,5√5. answer ④.
- 기존 solution: `$P\\left(\\dfrac{2\\cdot1+1\\cdot(-5)}{3},\\dfrac{2\\cdot5+1\\cdot2}{3}\\right)=(-1,4)$` / `$Q\\left(\\dfrac{2\\cdot1-1\\cdot(-5)}{2-1},\\dfrac{2\\cdot5-1\\cdot2}{2-1}\\right)=(7,8)$`.
- 검산: P=(−1,4), Q=(7,8); PQ=√(8²+4²)=√80=4√5. 내·외분 분모 3과 1을 구별했고 거리 전개도 충분하여 KEEP.
- solutionImage q3-solution-v2.svg NOT_RUN.

## q4 — KEEP (SVG QA 미실행)
- 원문: A(5,2),B(2,4),C(−1,−3) 삼각형 무게중심 G=(a,b)의 a+b. 보기 1,2,3,4,5. answer ③.
- 기존 solution: `$G=\\left(\\dfrac{5+2+(-1)}{3},\\dfrac{2+4+(-3)}{3}\\right)=(2,1)$이다.`
- 검산: x좌표 (5+2−1)/3=2, y좌표 (2+4−3)/3=1, 합3. 두 좌표의 평균을 각각 실제 전개하여 KEEP.
- solutionImage q4-solution.svg NOT_RUN.

## q5 — KEEP (SVG QA 미실행)
- 원문: (5,1)을 지나고 2x+y−3=0에 평행한 직선. 보기 y=−2x+11, y=2x+11, y=−2x−11, y=2x−11, y=3x+5. answer ①.
- 기존 solution: `$y-1=-2(x-5)$이다.` / `정리하면 $y-1=-2x+10$, 따라서 $y=-2x+11$이다.`
- 검산: 기존 직선 y=−2x+3의 기울기 −2; 점 (5,1) 대입해 1=−10+11. 괄호 전개가 실제 나와 KEEP.
- solutionImage q5-solution-v2.svg NOT_RUN.

## q6 — KEEP (SVG QA 미실행)
- 원문: 원점 중심 반지름 r인 원이 3x−y−10=0에 접함. 보기 3,√10,√11,2√3,√13. answer ②.
- 기존 solution: `$\\dfrac{|3\\cdot0-0-10|}{\\sqrt{3^2+(-1)^2}}=\\dfrac{10}{\\sqrt{10}}=\\sqrt{10}$이다.`
- 검산: 원점과 직선 거리 10/√10=√10. 수선의 발 H=(3,−1)도 직선 위(9+1−10=0)이며 OH=√10. 접선 조건 적용 명확하여 KEEP.
- solutionImage q6-solution-v2.svg NOT_RUN.

## q7 — KEEP (SVG QA 미실행)
- 원문: 5x−2y+3=0을 x방향 +2, y방향 a 평행이동, 이동 직선이 (3,2)를 지남. 보기 −5,−4,−3,−2,−1. answer ④.
- 기존 solution: `$5(x-2)-2(y-a)+3=0$이다.` / `$15-4+2a-7=0$에서 $2a+4=0$, 따라서 $a=-2$이다.`
- 검산: 5(x−2)−2(y−a)+3=5x−2y+2a−7=0; (3,2) 대입 15−4+2a−7=0 → a=−2. 좌표 이동의 역치환과 계산이 제시되어 KEEP.
- solutionImage q7-solution-v2.svg NOT_RUN.

## 재개
- q8부터 원본 문항/보기/answer/solution을 실제 읽고 끝 문항까지 전수 판정할 것.
- 모든 원본 SVG/PNG 파일을 실제 fetch·판독하고 관련 KEEP을 다시 확인할 것.
- Golden 2~3개 및 Negative 원문, core 문서 전체, 학생 화면 QA 미실행을 유지할 것.
- 이미 완료한 2025/2024 및 2023 기존 MD를 재작업 건수에 포함하지 말 것.


## 이번 실행 q8~q25 원본 전수 판독·독립 검산

- 원본 SHA `89d4bacd0ccb07cd4dc0627b07ac2b03d651aee6`; 총 25문항. 아래 q별 원문·보기·정답·solution 핵심식 직접 판독. 기존 q1~q7 기록 유지.
- PNG q17/q20/q25는 후속 실행에서 원본 파일 실물 판독 완료로 KEEP 전환했다. SVG 전체 시각 검증 NOT_RUN; 수학적 판정과 시각 출고 판정 구별.

### q8 — KEEP
- 원문 조건: 삼차방정식 $x^3-2x^2-5x+6=0$의 세 실근을 $\alpha,\beta,\gamma$라 할 때, $\alpha<\beta<\gamma$를 만족시키는 $\gamma$의 값은?
- 보기: $-3$ / $-2$ / $1$ / $3$ / $6$; 원본 answer: ④
- 기존 solution 핵심 원문: $x=1$을 대입하면 $1-2-5+6=0$이므로 $x-1$이 인수이다. / 따라서 / $x^3-2x^2-5x+6=(x-1)(x^2-x-6)=(x-1)(x-3)(x+2)$이다.
- 독립 검산·판정: x=1 대입 0; (x−1)(x−3)(x+2) 전개하면 x³−2x²−5x+6, 최대근 3=④.
- 이미지: 문제 이미지 없음; solutionImage=없음; 실제 시각 QA NOT_RUN.

### q9 — KEEP
- 원문 조건: 연립방정식 $\begin{cases}x-y=3\\xy+x+1=0\end{cases}$의 해를 $x=a$, $y=b$라 할 때, $a+b$의 값은?
- 보기: $-2$ / $-1$ / $1$ / $2$ / $3$; 원본 answer: ②
- 기존 solution 핵심 원문: $x-y=3$에서 $x=y+3$이다. / 이를 $xy+x+1=0$에 대입하면 / $(y+3)y+(y+3)+1=0$이다.
- 독립 검산·판정: x=y+3 대입 → y²+4y+4=(y+2)²=0, y=−2,x=1, 합 −1=②.
- 이미지: 문제 이미지 없음; solutionImage=없음; 실제 시각 QA NOT_RUN.

### q10 — KEEP
- 원문 조건: 부등식 $|x+1|+|x-2|<5$를 만족시키는 정수 $x$의 개수를 구하면?
- 보기: $0$ / $1$ / $2$ / $3$ / $4$; 원본 answer: ⑤
- 기존 solution 핵심 원문: [키포인트] 절댓값 기호 안이 $0$이 되는 $x=-1$, $x=2$를 기준으로 범위를 나눈다. / $x<-1$일 때 $|x+1|+|x-2|=-(x+1)-(x-2)=-2x+1$이므로 $-2x+1<5$, 따라서 $x>-2$이다. 이 경우 $-2<x<-1$이다. / $-1\le x<2$일 때 $|x+1|+|x-2|=(x+1)-(x-2)=3$이므로 항상 $5$보다 작다.
- 독립 검산·판정: 구간 x<−1, −1≤x<2, x≥2를 합쳐 −2<x<3, 정수 −1,0,1,2 네 개=⑤.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q10-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q11 — KEEP
- 원문 조건: 두 함수 $f(x)=mx^2-4x+4$, $g(x)=-2x^2+2mx+1$이 있다. 모든 실수 $x$에 대하여 항상 $g(x)<f(x)$를 만족하는 실수 $m$의 값의 범위는?
- 보기: $-2\le m<1$ / $-2<m\le3$ / $-1\le m<2$ / $-1<m\le2$ / $-2\le m\le3$; 원본 answer: ①
- 기존 solution 핵심 원문: [키포인트] $g(x)<f(x)$를 $f(x)-g(x)>0$으로 바꾸어 모든 실수에서 양수가 되는 조건을 찾는다. / $f(x)-g(x)=(m+2)x^2+(-4-2m)x+3$이다. / 먼저 $m=-2$이면 $f(x)-g(x)=3$이므로 조건을 만족한다.
- 독립 검산·판정: m=−2이면 상수 3>0. m>−2에서 D/4=(m+2)(m−1)<0 → −2<m<1, 합쳐 −2≤m<1=①.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q11-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q12 — KEEP
- 원문 조건: 세 직선 $x+2y=3$, $4x-3y=6$, $ax+y=3$의 세 교점을 꼭짓점으로 하는 삼각형이 직각삼각형일 때, 모든 상수 $a$값의 곱은?
- 보기: $-\dfrac32$ / $-\dfrac12$ / $-\dfrac54$ / $\dfrac53$ / $\dfrac34$; 원본 answer: ①
- 기존 solution 핵심 원문: 직선 $x+2y=3$의 기울기는 $-\dfrac12$이다. / 직선 $4x-3y=6$의 기울기는 $\dfrac43$이다. / 직선 $ax+y=3$의 기울기는 $-a$이다.
- 독립 검산·판정: 기울기 −1/2,4/3,−a. 수직 조건 a=−2 또는 3/4, 곱 −3/2=①. 세 직선 공점이 아님도 확인 필요: 두 값에서 기존 두 직선 교점은 (3,0), 제3직선 대입 각각 −6≠3, 9/4≠3.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q12-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q13 — KEEP
- 원문 조건: 직선 $2x+y+3+k(x+2y)=0$이 실수 $k$에 관계없이 항상 점 $P$를 지날 때, 점 $P$와 직선 $2x-y+10=0$ 사이의 거리는?
- 보기: $\sqrt3$ / $2$ / $\sqrt5$ / $6$ / $\sqrt7$; 원본 answer: ③
- 기존 solution 핵심 원문: 직선 $2x+y+3+k(x+2y)=0$이 모든 $k$에 대하여 한 점 $P$를 지나려면 / $2x+y+3=0$, $x+2y=0$을 동시에 만족해야 한다. / $x+2y=0$에서 $x=-2y$이다.
- 독립 검산·판정: k 계수와 상수항 동시에 0 → P=(−2,1), 거리 |−4−1+10|/√5=√5=③.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q13-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q14 — KEEP
- 원문 조건: 원 $x^2+y^2=2$와 직선 $y=-x+k$가 만나지 않도록 하는 실수 $k$의 값의 범위는?
- 보기: $k<-\sqrt6$ 또는 $k>\sqrt6$ / $-\sqrt6<k<\sqrt6$ / $-\sqrt3<k<\sqrt3$ / $-2<k<2$ / $k<-2$ 또는 $k>2$; 원본 answer: ⑤
- 기존 solution 핵심 원문: 원 $x^2+y^2=2$의 중심은 $(0,0)$이고 반지름은 $\sqrt2$이다. / 직선 $y=-x+k$를 정리하면 $x+y-k=0$이다. / 원점에서 이 직선까지의 거리는 $\dfrac{|k|}{\sqrt{1^2+1^2}}=\dfrac{|k|}{\sqrt2}$이다.
- 독립 검산·판정: 반지름 √2, 원점~직선 거리 |k|/√2>√2 → |k|>2=⑤; 접선 경계 제외.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q14-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q15 — KEEP
- 원문 조건: 점 $A(-2,2)$에서 원 $x^2+y^2-2x+4y=0$에 그은 접선의 길이는?
- 보기: $\sqrt5$ / $2\sqrt5$ / $3\sqrt5$ / $\sqrt6$ / $\sqrt7$; 원본 answer: ②
- 기존 solution 핵심 원문: $x^2-2x+y^2+4y=0$, / $(x-1)^2+(y+2)^2=5$이다. / 따라서 중심은 $C(1,-2)$, 반지름은 $\sqrt5$이다.
- 독립 검산·판정: 완전제곱 (x−1)²+(y+2)²=5, AC=5, 접선 AT=√(25−5)=2√5=②.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q15-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q16 — KEEP
- 원문 조건: 방정식 $f(x,y)=0$이 나타내는 도형 $F$를 방정식 $f(-y,x+2)=0$이 나타내는 도형 $F'$으로 옮기는 이동에 의하여 도형 $F$ 위의 점 $P(1,2)$는 도형 $F'$ 위의 점 $(a,b)$로 옮겨진다. $(a,b)$를 구하면?
- 보기: $(-1,2)$ / $(-1,0)$ / $(0,-1)$ / $(-1,4)$ / $(-2,3)$; 원본 answer: ③
- 기존 solution 핵심 원문: [키포인트] 새 도형의 식 $f(-y,x+2)=0$은 원래 도형의 점 $(X,Y)$가 새 좌표 $(x,y)$에서 $X=-y$, $Y=x+2$로 대응함을 뜻한다. / 그러면 $-b=1$, $a+2=2$이어야 한다. / 따라서 $b=-1$, $a=0$이다.
- 독립 검산·판정: 원점 (X,Y)=(1,2)과 변환 X=−b,Y=a+2를 연립하면 (a,b)=(0,−1)=③.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q16-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q17 — KEEP (원본 PNG 실물 확인)
- 원문 조건: 오른쪽 그림과 같이 $AB=10$, $AD=6$인 직사각형 $ABCD$에서 변 $AD$의 중점에서 출발하여 변 $AB$, $BC$를 거쳐 변 $CD$를 $1:4$로 내분하는 점에 이르는 최단거리는?
- 보기: $12$ / $\sqrt{145}$ / $13$ / $\sqrt{172}$ / $15$; 원본 answer: ⑤
- 기존 solution 핵심 원문: 직사각형을 좌표평면에 놓아 $A=(0,10)$, $D=(6,10)$, $B=(0,0)$, $C=(6,0)$으로 두자. 출발점 $S$는 $AD$의 중점이므로 $S=(3,10)$이다. / $CD=AB=10$이고 $CT:TD=1:4$이므로 $CT=2$이다. 따라서 도착점은 $T=(6,2)$이다. / 경로가 $AB$, $BC$를 차례로 지나므로 두 변을 차례로 펼친다. $AB$를 기준으로 반사하면 $T$는 $T_1=(-6,2)$로 옮겨지고, 이어서 $BC$를 기준으로 반사하면 $T_1$은 $T_2=(-6,-2)$로 옮겨진다. 반사는 거리를 보존하므로 원래의 꺾인 경로는 펼친 그림에서 $S$와 $T_2$를 잇는 꺾인 경로와 길이가 같다.
- 독립 검산·판정: 직사각형 A(0,10),B(0,0),C(6,0),D(6,10), S(3,10), T(6,2). 두 반사 후 T′=(−6,−2), 길이 √(9²+12²)=15=⑤. 경로 교차 순서도 x=0에서 y=6, y=0에서 x=−4.5로 맞지만 원본 PNG 미검증.
- 이미지: assets/images/23_강남여고_1학기_기말_고1_기출/q17.png; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q17-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q18 — KEEP
- 원문 조건: 연립이차부등식 $\begin{cases}x^2-2x-15\le0\\x^2-(a+2)x+2a>0\end{cases}$을 만족시키는 정수 $x$가 $4$개가 되게 하는 실수 $a$의 값은?
- 보기: $-3<a<-2$ / $-3\le a<-2$ / $-3<a\le-2$ / $-3\le a\le-2$ / $2<a\le3$; 원본 answer: ③
- 기존 solution 핵심 원문: $x^2-(a+2)x+2a=(x-a)(x-2)>0$이다. / 따라서 해는 두 수 $a$, $2$의 바깥쪽이다. / 정답 범위가 음수 쪽이므로 $a<2$인 경우를 보면, 두 번째 부등식의 해는 $x<a$ 또는 $x>2$이다.
- 독립 검산·판정: 첫 조건 정수 −3..5, (x−a)(x−2)>0. a<2이면 3,4,5 기본 3개에 −3만 추가: −3<a≤−2. a≥2이면 x<2의 정수 −3..1이 이미 5개라 불가. 답③.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q18-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q19 — KEEP
- 원문 조건: 삼차방정식 $x^3=1$의 한 허근을 $\omega$라 하고, 양의 정수 $n$에 대하여 $f(n)=\dfrac{\omega^n}{1+\omega^{2n}}$이라 정의할 때, $f(1)+f(2)+f(3)+f(4)+\cdots+f(13)$의 값은?
- 보기: $-7$ / $-6$ / $-5$ / $-4$ / $-3$; 원본 answer: ①
- 기존 solution 핵심 원문: [키포인트] $\omega^3=1$, $1+\omega+\omega^2=0$이므로 $n$을 $3$으로 나눈 나머지에 따라 값이 반복된다. / $n=1$일 때 / $f(1)=\dfrac{\omega}{1+\omega^2}=\dfrac{\omega}{-\omega}=-1$이다.
- 독립 검산·판정: ω³=1, 1+ω+ω²=0. f(1)=f(2)=−1,f(3)=1/2, 주기합 −3/2, 네 주기+f(13)=−6−1=−7=①.
- 이미지: 문제 이미지 없음; solutionImage=없음; 실제 시각 QA NOT_RUN.

### q20 — KEEP (원본 PNG 실물 확인)
- 원문 조건: 다음 정사각형 $ABCD$에 대하여 $\overline{AD}$의 중점을 $M$이라고 했을 때, $\overline{MB}$를 $3:2$로 내분한 점, $\overline{BC}$를 $2:1$로 내분한 점과 점 $D$를 세 꼭짓점으로 하는 삼각형의 넓이를 $S$, 정사각형 $ABCD$의 넓이를 $T$라고 했을 때, $S=kT$를 만족하는 실수 $k$의 값은?
- 보기: $\dfrac7{30}$ / $\dfrac3{10}$ / $\dfrac{11}{30}$ / $\dfrac7{10}$ / $\dfrac9{10}$; 원본 answer: ②
- 기존 solution 핵심 원문: 그러면 정사각형의 넓이는 $T=a^2$이다. / 즉 $MP:PB=3:2$이므로 내분점 공식에 의해 / $P=\left(\dfrac{2\cdot \frac a2+3\cdot0}{5},\dfrac{2\cdot a+3\cdot0}{5}\right)=\left(\dfrac a5,\dfrac{2a}5\right)$이다.
- 독립 검산·판정: P=(a/5,2a/5), Q=(2a/3,0), D=(a,a), 행렬식 넓이 1/2(7a²/25+8a²/25)=3a²/10, k=3/10=②. 원본 PNG 미검증.
- 이미지: assets/images/23_강남여고_1학기_기말_고1_기출/q20.png; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q20-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q21 — UPGRADE
- 원문 조건: 좌표평면 위의 두 점 $A(-1,-9)$, $B(5,3)$에 대하여 $\angle APB=45^\circ$를 만족시키는 점 $P$가 있다. 서로 다른 세 점 $A$, $B$, $P$를 지나는 원의 중심을 $C$라 하자. 선분 $OC$의 길이를 $k$라 할 때, $k$의 최댓값을 구하면? (단, $O$는 원점이다.)
- 보기: $4$ / $6$ / $8$ / $10$ / $12$; 원본 answer: ④
- 기존 solution 핵심 원문: $AB=\sqrt{(5+1)^2+(3+9)^2}=\sqrt{6^2+12^2}=6\sqrt5$이다. / 원주각 $\angle APB=45^\circ$에 대응하는 중심각 $\angle ACB$는 $90^\circ$이다. / 계산/도식 확인: $AB$의 기울기는 $\dfrac{3-(-9)}{5-(-1)}=2$이므로 수직이등분선의 기울기는 $-\dfrac12$이다. 중점 $M(2,-3)$을 지나므로 수직이등분선은 $y=-\dfrac12x-2$이다. 중심을 $C(x,y)$라 두면 $CM^2=(x-2)^2+(y+3)^2=45$이고, $y+3=-\dfrac12(x-2)$이므로 $\dfrac54(x-2)^2=45$이다. 따라서 $x-2=\pm6$이고, 수직이등분선에 대입하면 $C=(-4,0)$ 또는 $(8,-6)$이다.
- 독립 검산·판정: 기존 해설에서 '따라서 정답은 ④' 뒤에 다시 R과 CM 계산을 붙여 풀이 순서가 뒤집힘. 완성 풀이 아래 별도 기재.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q21-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q22 — KEEP
- 원문 조건: 점 $(-4,3)$을 지나고 직선 $3x-9y+4=0$에 수직인 직선의 방정식을 구하는 풀이 과정을 쓰시오.
- 보기: 서답형; 원본 answer: $y=-3x-9$
- 기존 solution 핵심 원문: 먼저 직선 $3x-9y+4=0$을 $y$에 대하여 정리한다. / $-9y=-3x-4$이므로 $y=\dfrac13x+\dfrac49$이다. / 따라서 이 직선의 기울기는 $\dfrac13$이다.
- 독립 검산·판정: 원직선 기울기 1/3, 수직 기울기 −3, y−3=−3(x+4) → y=−3x−9, 서답 일치.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q22-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q23 — KEEP
- 원문 조건: 연립방정식 $\begin{cases}4x-y=a\\x+y=2\end{cases}$의 해가 연립방정식 $\begin{cases}x-by=5\\x^2+y^2=2\end{cases}$를 만족할 때, 상수 $a$, $b$를 구하는 풀이 과정을 쓰시오.
- 보기: 서답형; 원본 answer: $a=3,\ b=-4$
- 기존 solution 핵심 원문: [키포인트] 두 연립방정식이 같은 해를 공유하므로, 먼저 $x+y=2$와 $x^2+y^2=2$를 동시에 만족하는 점을 찾는다. / $x+y=2$에서 $y=2-x$이다. / 이를 $x^2+y^2=2$에 대입하면
- 독립 검산·판정: x+y=2, x²+y²=2 → (x−1)²=0, (x,y)=(1,1), a=3,b=−4.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q23-solution.svg; 실제 시각 QA NOT_RUN.

### q24 — KEEP
- 원문 조건: 세 직선 $l:x-ay+2=0$, $m:4x+by+2=0$, $n:x-(b-3)y-2=0$에 대하여 두 직선 $l$, $m$은 수직이고 두 직선 $l$, $n$은 평행할 때, $a^2+b^2$의 값을 구하는 풀이 과정을 쓰시오. (단, $a$, $b$는 상수이다.)
- 보기: 서답형; 원본 answer: $17$
- 기존 solution 핵심 원문: 직선 $l:x-ay+2=0$을 정리하면 $y=\dfrac1a x+\dfrac2a$이므로 기울기는 $\dfrac1a$이다. / 직선 $m:4x+by+2=0$의 기울기는 $-\dfrac4b$이다. / $\dfrac1a\cdot\left(-\dfrac4b\right)=-1$이다.
- 독립 검산·판정: 법선벡터 수직조건 4−ab=0 → ab=4; 평행조건 a=b−3, (a−1)(a+4)=0, (a,b)=(1,4),(−4,−1), 합제곱 17.
- 이미지: 문제 이미지 없음; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q24-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q25 — KEEP (원본 PNG 실물 확인)
- 원문 조건: $AB=AC$인 이등변삼각형 $ABC$의 한 꼭짓점 $A$를 삼각형 $ABC$의 무게중심 $G$와 일치하도록 접었을 때, 삼각형 $EDG$의 넓이를 $S$라 하자. 그림과 같이 $B(0,0)$, $C(9,3)$, $G(k+1,k)$일 때, $k-S$의 값을 구하는 풀이 과정을 쓰시오.
- 보기: 서답형; 원본 answer: $\dfrac{1}{2}$
- 기존 solution 핵심 원문: 직선 $BC$의 기울기는 $\dfrac{3-0}{9-0}=\dfrac13$이므로, 선분 $BC$의 수직이등분선의 기울기는 $-3$이다. / 따라서 선분 $BC$의 수직이등분선의 방정식은 / $y-\dfrac32=-3\left(x-\dfrac92\right)$,
- 독립 검산·판정: G 좌표 조건과 AB=AC에서 A=(3,6),G=(4,3),k=3. 접는 선 y=x/3+10/3, D=(2,4),E=(5,5), 넓이 5/2, k−S=1/2. 원본 PNG 미검증.
- 이미지: assets/images/23_강남여고_1학기_기말_고1_기출/q25.png; solutionImage=assets/images/23_강남여고_1학기_기말_고1_기출/q25-solution-v2.svg; 실제 시각 QA NOT_RUN.

### q21 — 완성 학생용 개선 solution

두 점 사이의 거리는
\[
AB=\sqrt{(5-(-1))^2+(3-(-9))^2}
=\sqrt{36+144}=6\sqrt5
\]
이다. 원주각 \(\angle APB=45^\circ\)에 대응하는 중심각의 작은 각은 \(90^\circ\)이므로 현 \(AB\)의 길이는 \(R\sqrt2\)이다. 따라서
\[
R=\frac{6\sqrt5}{\sqrt2}=3\sqrt{10}.
\]
현 \(AB\)의 중점은
\[
M=\left(\frac{-1+5}{2},\frac{-9+3}{2}\right)=(2,-3)
\]
이다. 중심 \(C\)는 \(AB\)의 수직이등분선 위에 있고,
\[
CM^2=R^2-\left(\frac{AB}{2}\right)^2
=90-45=45.
\]
\(AB\)의 기울기는 \(12/6=2\)이므로 수직이등분선의 기울기는 \(-1/2\)이다. \(C=(x,y)\)라고 하면
\[
y+3=-\frac12(x-2),\qquad
(x-2)^2+(y+3)^2=45.
\]
대입하여
\[
(x-2)^2+\frac14(x-2)^2=45
\]
\[
\frac54(x-2)^2=45,\quad (x-2)^2=36,
\]
\[
x=8\quad\text{또는}\quad x=-4.
\]
각각 \(y=-6\), \(y=0\)이므로 가능한 중심은 \((8,-6)\), \((-4,0)\)이다. 원점에서의 거리는
\[
\sqrt{8^2+(-6)^2}=10,\qquad
\sqrt{(-4)^2+0^2}=4.
\]
따라서 최댓값은 **10 (④)**이다.

독립 검산: 두 중심 모두 \(A,B\)에서 거리 \(3\sqrt{10}\)이고, 각 원에서 현 AB가 만드는 원주각 \(45^\circ\)를 만족하는 호 위의 점 P가 존재한다. 기존 해설의 결과는 맞지만 정답 선언 뒤에 핵심 반지름·중점 계산이 이어지는 문단 순서를 교정했다.

## 재개 상태
- 25/25 문제·보기·정답·기존 풀이 판독 완료, q21 개선 풀이 완성.
- q17, q20, q25 원본 PNG 실물 검증 완료. 기존 solution SVG 시각 검증은 NOT_RUN. 다음 재개는 후속 시험지 또는 별도 시각 QA.
- EXAM_AUDIT_COMPLETE=YES (문항별 감사), EXAM_DRAFT_COMPLETE=YES. 출고/시각 QA는 별도 NOT_RUN.
- 학생 화면 실제 렌더·Golden/Negative 출고 QA NOT_RUN. SVG/JS/main 변경 없음.


## 2026-11-21 후속 원본 PNG 시각 검증 및 HOLD 해소

- 원본 PNG는 `archive/assets/images/23_강남여고_1학기_기말_고1_기출/`의 GitHub main 파일을 base64로 fetch하고 실제 렌더된 픽셀 이미지를 직접 판독했다. 원본 JS sourceBlobSha `89d4bacd0ccb07cd4dc0627b07ac2b03d651aee6` 유지. 이미지 경로의 이전 `assets/images` 표기는 실제 저장소에서 `archive/assets/images`임을 확인했다.
- **q17 KEEP**: q17.png Git blob `a487dbd1188bb477b020cbe7f14eb06648517551`. 그림은 A 좌상, B 좌하, C 우하, D 우상이며 세로 AB=10, 가로 AD=6이다. AD 중점 S에서 AB→BC를 경유해 CD의 C쪽 1:4 내분점 T로 가는 도식과 좌표 S=(3,10),T=(6,2)가 일치한다. 두 번 반사한 최단거리 15와 원본 정답 ⑤ 유지.
- **q20 KEEP**: q20.png Git blob `a7245588dbdc5199ad0f207bf9e118243fa2b15c`. 그림은 A 좌상, B 좌하, C 우하, D 우상, M은 AD 중점이다. MB 내분점과 BC 내분점, D가 이루는 삼각형이 원문과 일치한다. P=(a/5,2a/5), Q=(2a/3,0), D=(a,a)의 행렬식으로 S/T=3/10, 정답 ② 유지.
- **q25 KEEP**: q25.png Git blob `0c2e8d2b84bca2fc3339bee7098399694c1542ed`. B(0,0) 좌하, C(9,3) 우측, A 위쪽, D는 AB, E는 AC에 있으며 G(k+1,k)는 접힌 꼭짓점 위치로 그려져 있다. 기존 독립 계산 A=(3,6),G=(4,3), D=(2,4), E=(5,5), S=5/2, k−S=1/2와 일치한다.
- 문항별 감사 합계 **25/25 = KEEP 24 + UPGRADE 1(q21) + HOLD 0 + UNREAD 0**. q21의 완성 풀이 및 독립 검산은 위 본문 유지. EXAM_AUDIT_COMPLETE=YES, EXAM_DRAFT_COMPLETE=YES.
- **한계**: 원본 문제 PNG만 시각 판독했다. 기존 `solutionImage` SVG 전체의 시각 QA, 학생 exam/sol/ans 실제 렌더, Golden/Negative 독립 calibration은 NOT_RUN. 출고/시각 PASS가 아니다. SVG/JS/main 변경 없음.
