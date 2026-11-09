# 20 매산고 고1 1학기 기말 Q15 로컬 입력 초안

## 원문 결속
원본 경로: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`. 원본 바이트는 SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, Git blob `830a02dfed7703f109a615015e658aadc3def794`이며 기준 main은 `ca13990f5ba49e16af134945e3c26bf35d7a89c5`이다. 로컬 exact input은 `preparation-20-maesan-h1-1final/source-exact.js` (50,573B, 같은 SHA-256)이다. `item.json`은 원본 경로와 ordinal `15`로 원문 행을 결속한다.

## 원문 문항 (정확 runtime 문자열)
```text
그림과 같이 한 변의 길이가 $8$인 정삼각형 $ABC$에 대하여 세 점 $D,E,F$는 세 변 $BC,CA,AB$의 중점이고 세 점 $G,H,I$는 세 선분 $BD,DE,CE$의 중점일 때, 다음은 세 직선 $AH,EG,FI$가 한 점 $O(\alpha,\beta)$에서 만나는 것을 보이는 과정이다.\n<img src="assets/images/20_매산고_1학기_기말_고1_기출/q15.png" class="question-img" alt="문제 15 정삼각형 그림">\n그림과 같이 점 $D$를 원점, 직선 $BC$를 $x$축, 직선 $AD$를 $y$축으로 하여 삼각형 $ABC$를 좌표평면 위에 나타내면 세 꼭짓점 $A,B,C$의 좌표는 $A(0,4\sqrt3), B(-4,0), C(4,0)$이다.\n이때 직선 $AH$를 나타내는 방정식은 $y=ax+b$ …… ㉠\n직선 $EG$를 나타내는 방정식은 $y=cx+d$ …… ㉡\n직선 $FI$를 나타내는 방정식은 $y=ex+f$ …… ㉢\n두 직선 ㉠, ㉡의 교점 $O(\alpha,\beta)$는 직선 ㉢도 지난다.\n따라서 세 직선 $AH,EG,FI$는 한 점 $O(\alpha,\beta)$에서 만난다.\n<img src="assets/images/20_매산고_1학기_기말_고1_기출/q15-coordinate.png" class="question-img" alt="문제 15 좌표 그림">\n위의 ㉠, ㉡, ㉢의 직선의 방정식에서 $\dfrac{ad}{e}$의 값은? [4.8점]
```

## 원문 선택지 (정확 runtime 문자열)
```text
$4\sqrt3$ / $8\sqrt3$ / $9\sqrt3$ / $12\sqrt3$ / $15\sqrt3$
```

## 원문 정답 (정확 runtime 문자열)
```text
⑤
```

## 원문 해설 (정확 runtime 문자열)
```text
점 $D$를 원점으로 두면 $A=(0,4\sqrt3),\ B=(-4,0),\ C=(4,0)$이다.
중점 좌표를 하나씩 구하면
$E=\left(\dfrac{0+4}{2},\dfrac{4\sqrt3+0}{2}\right)=(2,2\sqrt3)$ ($CA$의 중점),
$F=\left(\dfrac{0-4}{2},\dfrac{4\sqrt3+0}{2}\right)=(-2,2\sqrt3)$ ($AB$의 중점),
$G=\left(\dfrac{-4+0}{2},\dfrac{0+0}{2}\right)=(-2,0)$ ($BD$의 중점),
$H=\left(\dfrac{0+2}{2},\dfrac{0+2\sqrt3}{2}\right)=(1,\sqrt3)$ ($DE$의 중점),
$I=\left(\dfrac{4+2}{2},\dfrac{0+2\sqrt3}{2}\right)=(3,\sqrt3)$ ($CE$의 중점)이다.

$AH$의 기울기는
$a=\dfrac{\sqrt3-4\sqrt3}{1-0}=-3\sqrt3$이다.
$A$의 $x$좌표가 $0$이므로 $AH$의 $y$절편은 $b=4\sqrt3$이다.
따라서 ㉠은 $y=-3\sqrt3x+4\sqrt3$이다.

$EG$의 기울기는
$c=\dfrac{2\sqrt3-0}{2-(-2)}=\dfrac{\sqrt3}{2}$이다.
$G=(-2,0)$을 ㉡에 대입하면
$0=-2c+d$이다.
따라서
$d=2c$
$=2\cdot\dfrac{\sqrt3}{2}$
$=\sqrt3$이다.
따라서 ㉡은 $y=\dfrac{\sqrt3}{2}x+\sqrt3$이다.

$FI$의 기울기는
$e=\dfrac{\sqrt3-2\sqrt3}{3-(-2)}=-\dfrac{\sqrt3}{5}$이다.
$I=(3,\sqrt3)$을 ㉢에 대입하면 $\sqrt3=3e+f$이다.
따라서
$f=\sqrt3-3e$
$=\sqrt3-3\left(-\dfrac{\sqrt3}{5}\right)$
$=\sqrt3+\dfrac{3\sqrt3}{5}$
$=\dfrac{5\sqrt3}{5}+\dfrac{3\sqrt3}{5}$
$=\dfrac{8\sqrt3}{5}$이다.
따라서 ㉢은 $y=-\dfrac{\sqrt3}{5}x+\dfrac{8\sqrt3}{5}$이다.

㉠과 ㉡을 연립하면
$-3\sqrt3x+4\sqrt3=\dfrac{\sqrt3}{2}x+\sqrt3$이다.
양변을 $\sqrt3$으로 나누면 $-3x+4=\dfrac{x}{2}+1$이다.
양변에 $2$를 곱하면 $-6x+8=x+2$이다.
따라서 $7x=6$, 즉 $x=\dfrac67$이다.
이를 ㉠에 대입하면
$y=-3\sqrt3\cdot\dfrac67+4\sqrt3$
$=-\dfrac{18\sqrt3}{7}+\dfrac{28\sqrt3}{7}$
$=\dfrac{10\sqrt3}{7}$이다.
따라서 $O=\left(\dfrac67,\dfrac{10\sqrt3}{7}\right)$이다.

이 점을 ㉢에 대입하면
$-\dfrac{\sqrt3}{5}\cdot\dfrac67+\dfrac{8\sqrt3}{5}$
$=-\dfrac{6\sqrt3}{35}+\dfrac{56\sqrt3}{35}$
$=\dfrac{10\sqrt3}{7}$이다.
따라서 $O$도 직선 $FI$ 위에 있다.

마지막으로
$\dfrac{ad}{e}$
$=\dfrac{(-3\sqrt3)(\sqrt3)}{-\sqrt3/5}$
$=\dfrac{-9}{-\sqrt3/5}$
$=\dfrac{45}{\sqrt3}$
$=\dfrac{45\sqrt3}{3}$
$=15\sqrt3$이다.
정답은 ⑤이다.
```

## 대체 그림의 범위와 이해 도움
중점 위치를 연산으로 구성하고 세 직선을 같은 점 O에 모아 원문의 동시 교점 과정을 보여준다. 정답에 필요한 계수식은 캡션 끝에 둔다.

## 점 이름·좌표 라벨 및 공간 계획
A, B, C, D, E, F, G, H, I, O 이름만 표시하고 좌표 수치 패널은 쓰지 않는다. 640×480 source-coordinate canvas를 사용해 점과 직선 이름 공간을 확보한다.

## 상태
LOCAL_ONLY / DRAFT_ONLY / NOT_READY. JSON parse 및 현행 `construction.validate/execute` 로컬 실행 PASS. 통합 입력 checker, `phase2.specFor`, semantic/viewport, render, independent full-math review, visual review, CI, publication, handoff 모두 NOT_RUN. 원격 쓰기 0회.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `0962d016434c06c8c94be7d8b2b2a027d933d62615b3677dfb181004c5f2a39d`, `4f10ff4a70ddb3e9e064969d34adcceabd2e50a7954f058cc270ddfa39ea29fd`, `a1998b2898ad1209aafb91bb549b966bdb6548d5091ff2cb30925c217ed62349`로 동결된 `geometry-second` / `2026-11-09T01-27-49-548Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
