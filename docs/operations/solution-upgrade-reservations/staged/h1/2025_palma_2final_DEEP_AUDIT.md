# 2025 팔마고 고1 2학기 기말 — 문항별 해설 심층 감사 기록

- 상태: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / NOT_PRODUCTION / RELEASE_NOT_RUN**
- 원본: `archive/exams/original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js`
- **원본 Git blob**: `ce814b292be81f43fa76ff4d33d1b707af52a098` (main 재조회 일치), 표준과목 `공통수학2`, 전체 **23문항**.
- 원본 q1~q23의 `content / choices / answer / solution`을 직접 읽고 이 문서에 원문 인용·보기·정답·판정 이유를 기록했다. **KEEP 17 / UPGRADE 6 / HOLD 0 / UNREAD 0**.
- UPGRADE의 학생용 풀이는 **Q11, Q17, Q18, Q19, Q21, Q23** 전체 완성해 연결 MD에 저장하고 원본 정답에 대조했다.
- **원본 문제 이미지 실물 확인**: Q1 `q01.png@819af285418883b022ee2c9f4ca36eb613686b38`; Q2·3 동일 대응도 `q02.png/q03.png@ed1383becc8c672e67557224b8a6c1a5459ea1f6`; Q5 `q05.png@7cf6f0b4d35208e0dc97e8d2d19acb29220968ed`; Q18 `q18.png@38bb562ef870fe0a5c566f7097ef5c91fade7a7d`; Q19 `q19.png@2ae20abb53f11d928e2209493927ce94e8647b48`.
- **Golden 원본 해설 판독**: 2025 매산여고 2학기 중간 `4e2d3a30110f6f1f5af0d3fed321edc9d4188242`, 효천고 2학기 중간 `144b5b81770601f624355e333da25ebcda555610`, 순천여고 2학기 중간 `b9c6c8e5a7c6c14f23fd3771c87e6ac80ffd8c03`; 각 Q1~Q3의 원본 지문·정답·해설. Negative `archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md@f06387b8bbb5adce4244fbb576c0bd500ab282fa` 전체 열람. 소급 preflight PASS 또는 공식 gate PASS로 주장하지 않음.
- **교육과정 개선**: Q18 새 풀이 초안에 있던 고1 범위 밖 벡터 화살표 표기를 좌표의 가로·세로 이동 설명으로 고쳐 별도 MD 커밋.
- **출고 구분**: 이번 완료는 원문-해설 **심층 감사 + 학생용 개선 MD 초안**만 해당. 원본 문제 PNG 확인과 별개로 `solutionImage`의 실제 렌더·학생 화면·Golden/Negative 실행 게이트·독립 검수·JS 검사는 **NOT_RUN**. JS/SVG/main 미수정.

## 실제 문항별 근거

### Q01 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 다음 중 함수의 그래프인 것을 모두 고르시오. [3.5점]
- **정답 확인**: `①, ④`
- **원본 보기(실제 choices 판독)**: `choices=[]` — ①~⑤는 문제 그림 선택지.
- **기존 solution의 실제 문장/식**: `각 그림에 수직선을 그어 만나는 점의 개수를 확인한다.`
- **판정 이유(원본 그림 직접 대조)**: ① 수평선: 한 x에 한 y; ② 세로선: 한 x에 여러 y; ③ 오른쪽의 두 반직선: x>0에서 두 y; ④ 채운 왼끝·빈 오른끝이 이어져 경계에서도 한 값; ⑤ 같은 세로줄에 점 두 개. 기존 해설은 다섯 보기를 각각 이 기준으로 설명한다. 원본 그래프 실물 확인 완료이므로 KEEP.
- **원본 시각자산 증거**: `q01.png@819af285418883b022ee2c9f4ca36eb613686b38`; 학생용 `solutionImage` 렌더 NOT_RUN.
- **후속/새 풀이**: 기존 해설 유지(원본 그림 확인 완료)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=1`

### Q02 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 아래 그림과 같은 함수 $f$, $g$에 대하여 $(f\circ g)(2)$의 값을 구하시오. [3.5점]
- **정답 확인**: `④`
- **원본 보기(실제 choices 판독)**: ① `$1$` / ② `$2$` / ③ `$3$` / ④ `$4$` / ⑤ `$5$`.
- **기존 solution의 실제 문장/식**: `$(f\circ g)(2)=f(g(2))$`
- **판정 이유(원본 그림 직접 대조)**: 원본 대응도에서 g(2)=2(가운데 2→오른쪽 2), f(2)=4(왼쪽 2→가운데 4)를 확인. 기존 풀이에 (f∘g)(2)=f(g(2))=f(2)=4가 있으므로 KEEP.
- **원본 시각자산 증거**: `q02.png@ed1383becc8c672e67557224b8a6c1a5459ea1f6`; 학생용 `solutionImage` 렌더 NOT_RUN.
- **후속/새 풀이**: 기존 해설 유지(원본 그림 확인 완료)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=2`

### Q03 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 아래 그림과 같은 함수 $f$, $g$에 대하여 $f^{-1}(4)+g(4)$의 값을 구하시오. [3.5점]
- **정답 확인**: `②`
- **원본 보기(실제 choices 판독)**: ① `$4$` / ② `$5$` / ③ `$6$` / ④ `$7$` / ⑤ `$8$`.
- **기존 solution의 실제 문장/식**: `$f^{-1}(4)=2$이다.`
- **판정 이유(원본 그림 직접 대조)**: 원본 대응도에서 f(2)=4, g(4)=3을 확인. 기존 해설이 f^{-1}(4)=2, 2+3=5를 직접 연결해 KEEP.
- **원본 시각자산 증거**: `q03.png@ed1383becc8c672e67557224b8a6c1a5459ea1f6`; 학생용 `solutionImage` 렌더 NOT_RUN.
- **후속/새 풀이**: 기존 해설 유지(원본 그림 확인 완료)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=3`

### Q04 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 유리함수 $y=\dfrac{5}{3-x}-2$의 그래프가 지나는 사분면은? [3.7점]
- **정답 확인**: `③`
- **원본 보기(실제 choices 판독)**: ① `제1, 2, 3사분면` / ② `제1, 2, 4사분면` / ③ `제1, 3, 4사분면` / ④ `제2, 3, 4사분면` / ⑤ `제1, 2, 3, 4사분면`.
- **기존 solution의 실제 문장/식**: `$0<x<\dfrac12$에서는 제4사분면,`
- **판정 이유**: x<0, 0<x<1/2, 1/2<x<3, x>3으로 부호를 나누고 x절편 x=1/2도 계산한다. 어느 사분면에 있는지 판단할 핵심 조건이 명시되어 있어 다른 풀이가 학생에게 실질적 도움을 주지 않는다.
- **후속/새 풀이**: 교육과정·최종 정답 검수는 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=4`

### Q05 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 함수 $f(x)=\sqrt{a+bx}+c$의 그래프가 다음 그림과 같을 때, $f(-12)$의 값을 구하면? [3.7점]
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `$6$` / ② `$7$` / ③ `$8$` / ④ `$2+\sqrt5$` / ⑤ `$4+\sqrt2$`.
- **기존 solution의 실제 문장/식**: `그래프의 끝점은 $(4,2)$이고 $y$절편은 $(0,4)$이다.`
- **판정 이유(원본 그림 직접 대조)**: 원본 그래프 끝점 (4,2), y절편 (0,4)를 확인. c=2, a+4b=0, sqrt(a)+2=4 → a=4, b=-1 → f(-12)=sqrt(16)+2=6이 기존 해설에 있으므로 KEEP.
- **원본 시각자산 증거**: `q05.png@7cf6f0b4d35208e0dc97e8d2d19acb29220968ed`; 학생용 `solutionImage` 렌더 NOT_RUN.
- **후속/새 풀이**: 기존 해설 유지(원본 그림 확인 완료)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=5`

### Q06 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 함수 $f(x)=\dfrac{4x+5}{x+1}$의 그래프의 점근선이 두 직선 $x=a$, $y=b$일 때, $f^{-1}(a+b)$의 값은? [3.7점]
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `$-2$` / ② `$-1$` / ③ `$0$` / ④ `$1$` / ⑤ `$2$`.
- **기존 solution의 실제 문장/식**: `$a=-1$, $b=4$이고`
- **판정 이유**: 분모 x+1=0→수직점근선 -1, 최고차항 비→수평점근선 4, 이어 f(x)=3을 풀어 역함숫값 -2를 찾는다. 핵심 역함수 정의가 해설에 있어 논리 점프가 없다.
- **후속/새 풀이**: 추가 가시성 QA는 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=6`

### Q07 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 정의역이 $\{x\mid 0\le x\le4\}$인 유리함수 $y=\dfrac{4x+k}{x+1}$의 최댓값이 $3$일 때, 실수 $k$의 값은? [4점]
- **정답 확인**: `③`
- **원본 보기(실제 choices 판독)**: ① `$-5$` / ② `$-3$` / ③ `$-1$` / ④ `$1$` / ⑤ `$3$`.
- **기존 solution의 실제 문장/식**: `$y=4+\dfrac{k-4}{x+1}$`
- **판정 이유**: 주어진 식을 4+(k−4)/(x+1)로 바꾸고 최댓값 3<4로 k<4를 얻는다. x 증가에 따른 분수의 증가 및 x=4 대입도 연결되어 있어 결정식이 충분히 제시된다.
- **후속/새 풀이**: 구간 끝점과 결과 수학 2차 확인은 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=7`

### Q08 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 함수 $f(x)=x+2$에 대하여 $f^1=f$, $f^{n+1}=f\circ f^n$로 정의할 때, $f^{10}(2)$의 값을 구하시오. (단, $n$은 자연수이다.) [4점]
- **정답 확인**: `④`
- **원본 보기(실제 choices 판독)**: ① `$10$` / ② `$12$` / ③ `$20$` / ④ `$22$` / ⑤ `$30$`.
- **기존 solution의 실제 문장/식**: `$f^n(x)=x+2n$이다.`
- **판정 이유**: f²(x)=x+4, f³(x)=x+6을 먼저 보인 후 같은 규칙으로 f^n(x)=x+2n을 정당화했다. 지수가 합성 횟수라는 의미를 밝히고 x=2, n=10을 대입했다.
- **후속/새 풀이**: 귀납적 일반화가 학년 수준에 적합한지 최종 검수
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=8`

### Q09 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 임의의 실수 $x$, $y$에 대하여 함수 $f$가 $f(x+y)=f(x)+f(y)$를 만족시키고 $f(2)=4$일 때, $f(5)$의 값을 구하시오. [4점]
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `$10$` / ② `$20$` / ③ `$30$` / ④ `$40$` / ⑤ `$50$`.
- **기존 solution의 실제 문장/식**: `$f(2)=f(1+1)=2f(1)$이다.`
- **판정 이유**: 임의 실수 가법성을 x=y=1에 대입하여 f(1)=2를 구한 뒤 f(5)=5f(1)로 계산한다. 중간 원인이 드러나 있어 보강 필요성이 낮다.
- **후속/새 풀이**: 정답 검수는 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=9`

### Q10 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 실수 전체의 집합을 정의역으로 하는 두 함수 $f(x)=x+k$, $g(x)=kx+1$에 대하여 $g\circ f=f\circ g$가 성립하도록 하는 상수 $k$의 값을 구하시오. (단, $k\ne0$) [4.3점]
- **정답 확인**: `④`
- **원본 보기(실제 choices 판독)**: ① `$-3$` / ② `$-2$` / ③ `$-1$` / ④ `$1$` / ⑤ `$2$`.
- **기존 solution의 실제 문장/식**: `$k(k-1)=0$이다.`
- **판정 이유**: g∘f=kx+k²+1, f∘g=kx+k+1을 각각 전개한 다음 k(k−1)=0과 k≠0을 사용한다. 식 전개·제외 조건 모두 명시돼 있다.
- **후속/새 풀이**: 전개식 독립 재확인은 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=10`

### Q11 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: 함수 $f(x)=x^2-6x+a\ (x\ge3)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프가 접하도록 하는 실수 $a$의 값을 구하시오. [4.3점]
- **정답 확인**: `⑤`
- **원본 보기(실제 choices 판독)**: ① `$\dfrac52$` / ② `$\dfrac72$` / ③ `$9$` / ④ `$\dfrac{25}{4}$` / ⑤ `$\dfrac{49}{4}$`.
- **기존 solution의 실제 문장/식**: `두 그래프가 한 점에서 접하려면 이 방정식이 중근을 가져야 한다.`
- **판정 이유**: 증가함수와 역함수의 교점이 y=x 위인 이유, 접하는 조건이 왜 f(x)=x의 중근과 연결되는지를 곧바로 선언한다. 원인→수식 연결을 보강한 전체 새 풀이를 저장했다.
- **후속/새 풀이**: [11번 완성 수정 해설](2025_palma_2final_q11.md)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=11`

### Q12 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 다음은 $a\gt b\gt 0$일 때, 부등식 $\sqrt{a-b}\gt \sqrt a-\sqrt b$가 성립함을 증명하는 과정이다. [4.3점] $\sqrt{a-b}\gt 0$, $\sqrt a-\sqrt b\gt 0$이므로 $(\sqrt{a-b})^2-(\sqrt a-\sqrt b)^2=$ (가) $-2b=2\sqrt b\,$(나)$\gt 0$ 따라서 $(\sqrt{a-b})^2\gt (\sqrt a-\sqrt b)^2$이므로 $\sqrt{a-b}\gt \s…
- **정답 확인**: `③`
- **원본 보기(실제 choices 판독)**: ① `$\sqrt{ab},\ \sqrt a+\sqrt b$` / ② `$\sqrt{ab},\ \sqrt a-\sqrt b$` / ③ `$2\sqrt{ab},\ \sqrt a-\sqrt b$` / ④ `$2\sqrt{ab},\ a-b$` / ⑤ `$2\sqrt{ab},\ \sqrt a+\sqrt b$`.
- **기존 solution의 실제 문장/식**: `$=2\sqrt{ab}-2b$`
- **판정 이유**: (a−b)−(a+b−2√ab)=2√ab−2b=2√b(√a−√b)를 실제 전개한다. a>b>0 양수 조건과 제곱 크기 비교의 논리가 모두 들어 있다.
- **후속/새 풀이**: 세부 답 일치 검증은 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=12`

### Q13 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: $x\gt 0$, $y\gt 0$일 때, $(x+y)\left(\dfrac4x+\dfrac9y\right)$의 최솟값을 구하시오. [4.5점]
- **정답 확인**: `⑤`
- **원본 보기(실제 choices 판독)**: ① `$21$` / ② `$22$` / ③ `$23$` / ④ `$24$` / ⑤ `$25$`.
- **기존 solution의 실제 문장/식**: `$\dfrac{4y}{x}+\dfrac{9x}{y}$` → `$\ge2\sqrt{\dfrac{4y}{x}\cdot\dfrac{9x}{y}}$` → `$=12$`, 등호조건 원문 `$2y=3x$`
- **판정 이유**: 13+4y/x+9x/y로 먼저 전개하고 두 양수항의 산술기하평균, 등호조건 2y=3x를 제시한다. 극솟값의 성립 가능성을 빠뜨리지 않아 추가 장문이 필요하지 않다.
- **후속/새 풀이**: 교육과정 범위 최종 확인은 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=13`

### Q14 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 정의역이 $\{x\mid x\ne0\}$인 실수의 집합이고, 공역이 $\{y\mid y\ne0\}$인 실수의 집합인 함수 $f(x)=\dfrac1x$에 대한 설명 중 보기에서 옳은 것만을 있는 대로 고른 것은? [4.5점] ㄱ. 함수 $f(x)$의 역함수는 존재한다. ㄴ. 그래프 $y=f(x)$는 제1사분면과 제2사분면을 지난다. ㄷ. 두 그래프 $y=f(x)$, $y=f^{-1}(x)$의 교점의 개수는 방정식 $f(x)=x$의 서로 다른 실근의 개수와 같다.
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `ㄱ` / ② `ㄴ` / ③ `ㄱ, ㄷ` / ④ `ㄴ, ㄷ` / ⑤ `ㄱ, ㄴ, ㄷ`.
- **기존 solution의 실제 문장/식**: `ㄷ. $f=f^{-1}$이므로 두 그래프는 완전히 일치한다.`
- **판정 이유**: f(1/x)=x에서 자기 역함수임을 보이고 두 그래프는 완전히 일치해 교점 무한, 반면 f(x)=x의 근은 ±1 두 개로 구분한다. 흔한 개념 혼동을 이미 해결한다.
- **후속/새 풀이**: 정의역 0 제외 확인 포함, 최종 QA는 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=14`

### Q15 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 함수 $f(x)=\dfrac{3x+1}{x+a}$가 $(f\circ f)(x)=x$를 만족시킬 때, $f^{-1}(13)$의 값을 구하면? [4.5점]
- **정답 확인**: `③`
- **원본 보기(실제 choices 판독)**: ① `$2$` / ② `$3$` / ③ `$4$` / ④ `$5$` / ⑤ `$6$`.
- **기존 solution의 실제 문장/식**: `$=\dfrac{10x+a+3}{(a+3)x+a^2+1}$이다.`
- **판정 이유**: f(f(x))를 한 번에 생략하지 않고 분모·분자에 x+a를 곱해 유리식을 전개한 후 이차항 계수 a+3=0을 비교한다. 결정적인 식 변형이 현재 해설에 존재한다.
- **후속/새 풀이**: 유리함수 원래 정의역 점검은 최종 QA에서 재확인
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=15`

### Q16 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: 집합 $X=\{1,2,3,4,5\}$에 대하여 다음 을 만족시키는 함수 $f:X\to X$의 개수를 구하시오. [4.8점] ㄱ. $x_1\in X$, $x_2\in X$인 임의의 $x_1$, $x_2$에 대하여 $3\le x_1\lt x_2\le5$이면 $f(x_1)\gt f(x_2)$이다. ㄴ. 함수 $f$의 역함수가 존재한다.
- **정답 확인**: `②`
- **원본 보기(실제 choices 판독)**: ① `$10$` / ② `$20$` / ③ `$40$` / ④ `$120$` / ⑤ `$240$`.
- **기존 solution의 실제 문장/식**: `${}_{5}C_{3}=\dfrac{5\times4\times3}{3\times2\times1}=10$`, `$10\cdot2=20$`
- **판정 이유**: 역함수 존재→일대일대응, f(3)>f(4)>f(5)의 세 값 선택 5C3=10, 내림차순 배치 1, 남은 두 값 2!=2의 이유가 모두 제시된다.
- **후속/새 풀이**: 조합 표현의 교육과정 적합성은 최종 검수
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=16`

### Q17 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: 실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\begin{cases}x+c&(x\lt b)\\ ax^2-2ax-3&(x\ge b)\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 하자. $b=t$일 때, $a+c$의 값을 구하시오. (단, $a,b,c,t$는 모두 실수이다.) [4.8점]
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `$-4$` / ② `$-3$` / ③ `$-2$` / ④ `$0$` / ⑤ `$1$`.
- **기존 solution의 실제 문장/식**: `$a>0$이고`
- **판정 이유**: 치역이 실수 전체여야 하는 이유와 이차식의 꼭짓점 양옆에서 중복 함숫값이 생기는 이유가 한 문장에 압축됐다. b≥1을 왜 강제하는지 두 입력 1±h의 같은 함숫값으로 보강했다.
- **후속/새 풀이**: [17번 완성 수정 해설](2025_palma_2final_q17_q18_q19_q23.md)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=17`

### Q18 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: 두 무리함수 $f(x)=\sqrt x+2$, $g(x)=\sqrt{x-3}$의 그래프와 직선 $2x+3y-20=0$이 각각 점 $A(4,4)$와 $B(7,2)$에서 만난다. 그림과 같이 함수 $f(x)$, $g(x)$의 그래프와 직선 $2x+3y-20=0$, $x$축, $y$축으로 둘러싸인 부분의 넓이는? [5.2점]
- **정답 확인**: `③`
- **원본 보기(실제 choices 판독)**: ① `$15$` / ② `$16$` / ③ `$17$` / ④ `$18$` / ⑤ `$19$`.
- **기존 solution의 실제 문장/식**: `곡선 사이의 띠를 같은 넓이가 되도록 잘라 붙이면 평행사변형 $PABQ$와 같은 넓이가 된다.`
- **판정 이유**: 곡선의 휘어진 부분이 평행이동으로 왜 같은 넓이이고 어느 쪽을 더하고 빼는지가 빠져 있다. 곡선-현 사이 영역 상쇄와 도형의 사각형 빼기를 수식으로 보강했다. 원본 문제의 P(0,2), A(4,4), B(7,2), Q(3,0)와 음영 영역은 실제 그림에서 확인. 해설 SVG 실제 렌더는 NOT_RUN.
- **후속/새 풀이**: [18번 완성 수정 해설](2025_palma_2final_q17_q18_q19_q23.md). 원본 `q18.png@38bb562ef870fe0a5c566f7097ef5c91fade7a7d` 실물 확인; 해설 SVG 렌더 NOT_RUN
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=18`

### Q19 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: 오른쪽 그림과 같은 이차함수 $y=f(x)$에 대하여 방정식 $(f\circ f)(x)=0$의 서로 다른 모든 실근의 합을 구하시오. [5.2점]
- **정답 확인**: `①`
- **원본 보기(실제 choices 판독)**: ① `$-2$` / ② `$-\dfrac32$` / ③ `$-1$` / ④ `$-\dfrac12$` / ⑤ `$1$`.
- **기존 solution의 실제 문장/식**: `네 근은 서로 다르므로 전체 실근의 합은`
- **판정 이유**: f(x)=-2에서 두 근을 구하지만 f(x)=1은 근과 계수 관계로 합만 적은 뒤 네 근이 서로 다르다고 단정한다. 근의 공식과 겹침 확인식을 넣었다. 원본 문제 그래프 x절편 -2, 1 및 y절편 -2를 실제 그림에서 재확인. 해설 SVG 실제 렌더는 NOT_RUN.
- **후속/새 풀이**: [19번 완성 수정 해설](2025_palma_2final_q17_q18_q19_q23.md). 원본 `q19.png@2ae20abb53f11d928e2209493927ce94e8647b48` 실물 확인; 해설 SVG 렌더 NOT_RUN
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=19`

### Q20 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: [서술형 1] 집합 $X=\{x\mid x\le k\}$에 대하여 $X$에서 $X$로의 함수 $f(x)=-x^2+4x$가 일대일대응이 되도록 하는 실수 $k$의 값을 풀이 과정과 함께 서술하시오. [4점]
- **정답 확인**: `$0$`
- **원본 보기(실제 choices 판독)**: `choices=[]` — 서술형.
- **기존 solution의 실제 문장/식**: `$f(k)=k$`, `$-k^2+4k=k$`, `$k(k-3)=0$` 및 `$k\le2$`
- **판정 이유**: 포물선의 정의역 x≤k가 꼭짓점 2를 넘으면 중복되어 k≤2, 치역 상한 f(k)와 공역 상한 k의 일치를 f(k)=k로 세워 k=0/3 중 0을 고른다. 두 제약 모두 기재되어 있다.
- **후속/새 풀이**: 범위와 끝점 포함 검수는 후속
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=20`

### Q21 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: [서술형 2] 자동차가 $A$에서 지점 $B$까지 평균 $100\text{ km/h}$의 속력으로 $12$분 동안 달리고, 지점 $B$에서 $C$까지 $x$시간 동안 평균 $70\text{ km/h}$의 속력으로 달렸다고 한다. 지점 $A$에서 $C$까지의 평균 속력을 $y\text{ km/h}$라고 할 때, 다음 물음을 풀이 과정과 함께 서술하시오. (단, $x\gt 0$) [총 5점] (1) $x$와 $y$ 사이의 관계식을 구하시오. [3점] (2) $0.8…
- **정답 확인**: `(1) $y=\dfrac{70x+20}{x+\dfrac15}$ (2) 최댓값 $76$, 최솟값 $71$`
- **원본 보기(실제 choices 판독)**: `choices=[]` — 서술형.
- **기존 solution의 실제 문장/식**: `이를 정리하면`
- **판정 이유**: 평균 속력 분자 70x+20을 분모의 70배와 나머지 6으로 나누는 핵심 변형을 '정리하면'으로 뛰어넘는다. 70x+20=70(x+1/5)+6을 실제 등호로 추가했다.
- **후속/새 풀이**: [21번 완성 수정 해설](BATCH_2025_2final_20261121_01.md)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=21`

### Q22 — KEEP_AUDITED

- **실제 문제 조건(원본 일부)**: [서술형 3] 두 함수 $f(x)=\dfrac12x-\dfrac12$, $g(x)=4x+7$에 대하여 다음 물음에 답하시오. [총 5점] (1) $f(x)$의 역함수 $f^{-1}(x)$를 구하시오. [2점] (2) $f^{-1}\circ h=g$를 만족하는 $x$에 대한 일차함수 $h(x)$를 풀이 과정과 함께 서술하시오. [3점]
- **정답 확인**: `(1) $f^{-1}(x)=2x+1$ (2) $h(x)=2x+3$`
- **원본 보기(실제 choices 판독)**: `choices=[]` — 서술형.
- **기존 solution의 실제 문장/식**: `$2(ax+b)+1=2ax+2b+1$`, `$2a=4$`, `$2b+1=7$`
- **판정 이유**: 역함수 구하기에서 2y=x−1→x=2y+1, 합성에서 2(ax+b)+1=2ax+2b+1, 계수 비교 2a=4와 2b+1=7이 모두 제시된다. 학생의 중간 연립 과정이 재현 가능하다.
- **후속/새 풀이**: 최종 교육과정·정답 검수 후 출고
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=22`

### Q23 — UPGRADE_DRAFT_STAGED

- **실제 문제 조건(원본 일부)**: [서술형 4] 함수 $y=\sqrt{2-3x}$의 그래프와 직선 $y=-\dfrac12x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 값의 범위를 풀이 과정과 함께 서술하시오. [6점]
- **정답 확인**: `$\dfrac13\le k\lt \dfrac{11}{6}$`
- **원본 보기(실제 choices 판독)**: `choices=[]` — 서술형.
- **기존 solution의 실제 문장/식**: `두 근의 합은 $6>0$이고 곱은 $6k-2$이므로`
- **판정 이유**: 판별식과 근의 합·곱을 따로 판단해 두 교점의 0 이상 조건이 직관적이지 않다. y=3±√(11−6k)를 도출해 두 점·y≥0 조건을 직접 비교하는 대체 풀이를 작성했다.
- **후속/새 풀이**: [23번 완성 수정 해설](2025_palma_2final_q17_q18_q19_q23.md)
- **식별자**: `sourceIdentityKey=NOT_PRESENT; originalBlob=ce814b292be81f43fa76ff4d33d1b707af52a098; ordinal=23`

## EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE (MD 단계)

- q1~q23 **23/23**, KEEP **17**, UPGRADE **6**, HOLD **0**, UNREAD **0**. 각 문항의 실제 원본 조건·보기·정답·기존 solution 핵심 인용·판정 이유는 바로 위에 있다.
- 학생용 완성 새 풀이 Q11(49/4), Q17(-4), Q18(17), Q19(-2), Q21(관계식·76·71), Q23(1/3 이상 11/6 미만) 각각 연결 MD에 존재한다. Q18 초안의 고1 교육과정 범위 밖 벡터 표현은 제거했다.
- 원본 문제 PNG 확인: Q1,2,3,5,18,19. Q18 곡선 두 쌍은 가로 3·세로 -2 평행이동으로 넓이가 상쇄되며, 직사각형 7×4 - 네 삼각형 14 + POQ 삼각형 3 = 17. Q19 서로 다른 네 근의 합 -2. Q23 y≥0 조건을 사용해 경계값을 검증했다.
- **NOT_RUN**: 학생용 `solutionImage` 실제 렌더·시각 정합성 최종 QA, 공식 Golden/Negative 실행 게이트, JS 보호 필드·문법, 학생 `exam/sol/ans` 화면, 최종 independent release. 이 감사·초안 완료는 출고 PASS가 아니며 원본 JS/SVG/main 미변경.

## 이번 실행 DOC_READ_RECEIPT (2026-11-21 KST)

- 권위: 원격 `work/solution-upgrade-reservation-harness-20261121`의 문서 **실제 본문** 열람. 본문 전부 읽었으며 아래는 식별 기록이다. 학생용 해설 정본의 핵심: 중간 등호·조건·경우 누락 금지, 잘된 해설 KEEP. 교과서 과정 밖 벡터 표기를 Q18 개선안에서 제거했다.
- `main`의 원본 팔마고 JS 23문항 및 Golden 3파일 각각 3문항, Negative README, 원본 문제 PNG 6개(유일 blob 5개)는 별도 위 본문 증거에 있다.
- 아래 SHA는 Git **blob SHA-1**이다. SHA-256 영수증·공식 preflight validator·학생 렌더 게이트는 이 실행에서 만들거나 통과했다고 주장하지 않는다.

| 실제 열람한 파일 | Git blob SHA-1 |
| --- | --- |
| `docs/operations/solution-upgrade-reservations/docs-manifest.json` | `649d90226c8dc8a936f1d41a07e4c51e09acc4e5` |
| `docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md` | `fa258f6ab998c7fd0e2b398956309a43ce967e82` |
| `docs/operations/solution-upgrade-reservations/GLOBAL_QUEUE_CURRENT.md` | `259bf732ac9932f832077a506c587cb1401a4f7f` |
| `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md` | `eb02a8ed22515b70b0d897949945e40b013eaab6` |
| `AGENTS.md` | `61f2bd5223bd6e23dfc358425cf9c28e18f47dd8` |
| `docs/rules/RULEBOOK_CURRENT.md` | `e2c5dd43a16469d25f155a23f723071fd8988a3e` |
| `docs/agents/outcome-method-review.md` | `909dfdc6a30abcc9625a2450e55765796f65ec82` |
| `docs/agents/gpt-reservation.md` | `308bd8c59bbda4b1bb6fc6c2fd600b4cd8abac9a` |
| `docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md` | `0e6309c3893e50b98607c9d44c08a8a3dc73e9bb` |
| `docs/agents/common.md` | `ef299aeecf718aeb3db03c4f3e19efaca47cc260` |
| `archive/AGENTS.md` | `ea550cf69dde6fb60817ca1895341b80734908d2` |
| `docs/agents/exam-pipeline.md` | `a3307a463626c2b21ba0c82b7d17410829f14ae3` |
| `docs/agents/metadata.md` | `caf99a38f087d5e97ef0dc16b8638353ad32494c` |
| `docs/agents/git-evidence.md` | `98165110adf82ddd16adec92f29951691484af21` |
| `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md` | `bf5b8a1b6d7488d30b4b1ced5fbe6853001c9d75` |
| `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md` | `0ea5c57cdf71f8ded248b9ebd4dde0cf7b90e84c` |
| `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` | `693c7ed76dbd643dedd204bbcec9f707bbc2e2f2` |
| `docs/operations/solution-upgrade-reservations/BOARD_SOLUTION_SAMPLES_CURRENT.md` | `f703929fa816fc4183f28235a355ecd3a1d6ace7` |
