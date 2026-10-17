window.examTitle = "19_매산고_1학기_중간_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "다음 식을 간단히 한 것은? [3.9점]<br><br>$$4^{\\sqrt{5}+1} \\div 4^{\\sqrt{5}}$$",
    "choices": [
      "1",
      "\\sqrt{2}",
      "2",
      "3",
      "4"
    ],
    "answer": "⑤",
    "solution": "같은 양의 밑을 가진 거듭제곱끼리 나눌 때에는 지수끼리 뺀다.\n$$\\frac{4^{\\sqrt5+1}}{4^{\\sqrt5}}=4^{(\\sqrt5+1)-\\sqrt5}=4^1=4.$$\n지수에 있는 $\\sqrt5$가 서로 없어지고 $1$만 남으므로 ⑤이다."
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "$\\log 2=a$, $\\log 3=b$일 때, 다음을 $a, b$에 대한 식으로 바르게 나타낸 것은? [3.9점]<br><br>$$\\log 12 \\times \\log\\dfrac{4}{3}$$",
    "choices": [
      "a^2-b^2",
      "2a^2-b^2",
      "4a^2-b^2",
      "a^2-2b^2",
      "a^2-4b^2"
    ],
    "answer": "③",
    "solution": "상용로그의 곱셈·나눗셈 성질로 각각 $a,b$에 관한 식으로 바꾼다.\n$$\\log12=\\log(4\\cdot3)=\\log 2^2+\\log3=2a+b,$$\n$$\\log\\frac43=\\log4-\\log3=2\\log2-\\log3=2a-b.$$\n두 식을 곱하면 합차 공식이 적용된다.\n$$(2a+b)(2a-b)=(2a)^2-b^2=4a^2-b^2.$$\n따라서 ③이다."
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "함수 $y=3\\cdot 2^{x+1}-2$의 그래프의 점근선의 방정식으로 옳은 것은? [3.9점]",
    "choices": [
      "y=-2",
      "x=-2",
      "y=0",
      "x=2",
      "y=2"
    ],
    "answer": "①",
    "solution": "$2^{x+1}>0$이므로 $3\\cdot2^{x+1}$도 항상 양수이다. $x$가 매우 작아질수록 $2^{x+1}$은 $0$에 가까워진다.\n$$y=3\\cdot2^{x+1}-2\\longrightarrow -2\\qquad(x\\to-\\infty).$$\n즉 그래프가 가까워지는 수평선은 $y=-2$이다. $x=-2$와 같은 수직선이 아니므로 ①이다."
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "다음 세 수의 대소관계로 옳은 것은? [3.9점]<br><br>$$a=\\log_3 19,\\; b=3\\log_3(2\\sqrt[3]{2}),\\; c=2\\log_3(3\\sqrt{3})$$",
    "choices": [
      "a<b<c",
      "b<a<c",
      "b<c<a",
      "c<a<b",
      "c<b<a"
    ],
    "answer": "②",
    "solution": "밑 $3>1$인 로그함수는 진수가 클수록 값이 크다. 따라서 세 수를 같은 밑의 로그 하나로 나타내어 진수를 비교한다.\n$$a=\\log_3 19,$$\n$$b=3\\log_3(2\\sqrt[3]{2})=3\\log_3(2^{4/3})=\\log_3 2^4=\\log_3 16,$$\n$$c=2\\log_3(3\\sqrt3)=2\\log_3(3^{3/2})=\\log_3 3^3=\\log_3 27.$$\n$16<19<27$이므로 $b<a<c$이다. 따라서 ②이다."
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$일 때, 방정식 $3\\tan x - \\sqrt{3}=0$의 모든 해의 합을 구하면? [4.2점]",
    "choices": [
      "\\dfrac{\\pi}{6}",
      "\\dfrac{2}{3}\\pi",
      "\\pi",
      "\\dfrac{7}{6}\\pi",
      "\\dfrac{4}{3}\\pi"
    ],
    "answer": "⑤",
    "solution": "주어진 방정식을 정리하면\n$$3\\tan x-\\sqrt3=0\\quad\\Longrightarrow\\quad\\tan x=\\frac{\\sqrt3}{3}=\\tan\\frac\\pi6.$$\n탄젠트의 주기는 $\\pi$이므로 모든 해는 $x=\\frac\\pi6+k\\pi$($k$는 정수)이다.\n$0\\le x<2\\pi$에 들어가는 해는 $\\frac\\pi6$, $\\frac{7\\pi}6$ 두 개이다.\n$$\\frac\\pi6+\\frac{7\\pi}6=\\frac{8\\pi}6=\\frac{4\\pi}3.$$\n따라서 ⑤이다."
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "다음 중 옳지 않은 것은? [4.2점]",
    "choices": [
      "$0$의 제곱근은 있다.",
      "세제곱근 $-64$는 $-4$이다.",
      "$a<0$일 때, $(\\sqrt[3]{-a})^3 = -a$이다.",
      "$-8$의 세제곱근 중에서 실수인 것은 1개이다.",
      "$n$이 짝수일 때, $-1$의 $n$제곱근 중에서 실수인 것은 2개이다."
    ],
    "answer": "⑤",
    "solution": "각 선택지가 실수 범위에서 성립하는지 살핀다. $0$의 제곱근은 $0$이고, $(-4)^3=-64$이므로 $-64$의 실수 세제곱근은 $-4$이다. 또한 $a<0$이어도 $\\bigl(\\sqrt[3]{-a}\\bigr)^3=-a$이다.\n$-8$의 실수 세제곱근은 $-2$ 하나뿐이므로 ④도 옳다.\n하지만 $n$이 짝수이면 모든 실수 $t$에 대하여 $t^n\\ge0$이다. 따라서 $t^n=-1$을 만족하는 실수는 없다. '실수인 것이 2개'라는 ⑤가 옳지 않다."
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "임의의 실수 $x$에 대하여 $\\log_{30}(x^2-kx-4k)$가 정의되도록 하는 모든 정수 $k$값들의 합을 구하면? [4.2점]",
    "choices": [
      "-120",
      "-110",
      "-100",
      "-90",
      "-80"
    ],
    "answer": "①",
    "solution": "로그의 진수는 반드시 양수이다. 밑 $30$은 $30>0$, $30\\ne1$이므로 밑에 대한 조건은 이미 만족한다. 따라서 문제는 이차식 $x^2-kx-4k$가 **모든 실수 $x$에서** $0$보다 크게 되는 정수 $k$를 찾는 것이다.\n$$x^2-kx-4k>0\\qquad(\\text{모든 실수 }x).$$\n최고차항의 계수가 $1>0$이므로 그래프는 위로 열린 포물선이다. 이 포물선이 $x$축에 닿거나 지나면 진수가 $0$ 이하인 $x$가 생긴다. 따라서 판별식이 반드시 음수여야 한다.\n$$D=(-k)^2-4\\cdot1\\cdot(-4k)=k^2+16k=k(k+16).$$\n$$D<0\\iff k(k+16)<0\\iff -16<k<0.$$\n끝점 $k=-16,0$에서는 판별식이 $0$이어서 진수가 $0$이 되는 $x$가 있으므로 포함하지 않는다. 가능한 정수는 $-15,-14,\\ldots,-1$로 $15$개이다.\n$$(-15)+(-14)+\\cdots+(-1)=-\\frac{15(15+1)}2=-120.$$\n따라서 정답은 ①이다."
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "$\\log M = 3.4928$, $\\log N = 2.5366$이라고 할 때, 다음 상용로그표를 이용하여 $M+N$의 값을 구하면? [4.3점]<br><br><img src=\"assets/images/19_매산고_1학기_중간_고2_수학I/q08.png\" class=\"question-img\">",
    "choices": [
      "3010",
      "3121",
      "3232",
      "3343",
      "3454"
    ],
    "answer": "⑤",
    "solution": "상용로그를 $\\log M=3.4928$처럼 나타냈을 때 정수 부분 $3$은 $M$이 $10^3$ 이상 $10^4$ 미만임을 알려 주고, 소수 부분 $0.4928$은 앞자리 숫자를 찾는 데 사용한다.\n$$\\log M=3+0.4928\\quad\\Longrightarrow\\quad M=10^3\\times10^{0.4928}.$$\n표에서 $0.4928$에 해당하는 유효숫자는 $3.11$이므로 $10^{0.4928}\\approx3.11$이다. 따라서\n$$M\\approx3.11\\times10^3=3110.$$\n같은 방법으로\n$$\\log N=2+0.5366\\quad\\Longrightarrow\\quad N=10^2\\times10^{0.5366}.$$\n표에서 $0.5366$에 해당하는 유효숫자는 $3.44$이므로\n$$N\\approx3.44\\times10^2=344.$$\n따라서 표의 근삿값으로 계산한 합은\n$$M+N\\approx3110+344=3454.$$\n문제에서 표를 이용해 구하라고 했으므로 보기 ⑤를 고른다."
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "$\\left(\\dfrac{1}{1024}\\right)^{\\frac{1}{n}}$이 자연수가 되도록 하는 모든 정수 $n$의 합을 구하면? [4.3점]",
    "choices": [
      "-20",
      "-18",
      "-16",
      "-14",
      "-12"
    ],
    "answer": "②",
    "solution": "먼저 $1024=2^{10}$으로 바꾸어 밑을 하나로 통일한다.\n$$\\left(\\frac1{1024}\\right)^{1/n}=(2^{-10})^{1/n}=2^{-10/n}\\qquad(n\\ne0).$$\n밑 $2$의 거듭제곱이 자연수가 되려면 지수 $-10/n$은 $0$ 이상의 정수여야 한다. 여기서는 분자가 $-10$이므로 지수가 $0$이 될 수 없다. 또한 $2$의 소인수는 $2$뿐이어서 $2$의 유리수 거듭제곱이 정수이면 그 지수는 정수여야 한다.\n따라서 $-10/n$은 **양의 정수**이고, $n$은 음수이며 $10$의 약수의 부호를 바꾼 값이다.\n$$n=-1,-2,-5,-10.$$\n각각의 지수는 $10,5,2,1$이므로 원래 수는 $1024,32,4,2$로 모두 자연수이다.\n$$(-1)+(-2)+(-5)+(-10)=-(1+2+5+10)=-18.$$\n따라서 ②이다."
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "함수 $f(x)=a\\cos(bx-c\\pi)+d$의 그래프가 아래쪽 그림과 같을 때, 상수 $a, b, c, d$의 합을 구하면? (단, $a>0$, $b>0$, $0<c<1$) [4.5점]<br><br><img src=\"assets/images/19_매산고_1학기_중간_고2_수학I/q10.png\" class=\"question-img\">",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "그래프에서 가장 높은 점의 $y$좌표는 $4$, 가장 낮은 점은 $-4$이다. 코사인 앞의 계수 $a$는 양수이므로 진폭과 중심선을 이용하면\n$$a=\\frac{4-(-4)}2=4,\\qquad d=\\frac{4+(-4)}2=0.$$\n$x=\\pi$와 $x=9\\pi$는 **모두 아래에서 위로** $x$축을 지나는 연속된 같은 위상의 점이다. 그러므로 한 주기는\n$$T=9\\pi-\\pi=8\\pi,\\qquad \\frac{2\\pi}{b}=8\\pi,\\qquad b=\\frac14.$$\n이제 $x=\\pi$에서 함수값이 $0$이라는 사실과 그래프가 상승한다는 방향을 함께 사용한다. 코사인값이 $0$이면서 증가하는 각은 $-\\frac\\pi2+2k\\pi$($k$는 정수)이다.\n$$4\\cos\\left(\\frac\\pi4-c\\pi\\right)=0,$$\n$$\\frac\\pi4-c\\pi=-\\frac\\pi2+2k\\pi,$$\n$$\\frac14-c=-\\frac12+2k,\\qquad c=\\frac34-2k.$$\n문제에서 $0<c<1$이라고 했으므로 $k=0$만 가능하고 $c=\\frac34$이다.\n따라서\n$$a+b+c+d=4+\\frac14+\\frac34+0=5.$$\n정답은 ④이다."
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "$\\dfrac{\\pi}{2} < \\theta < \\pi$일 때, 다음 중 그 값이 항상 양수인 것의 개수는? [4.5점]<br><br>$$\\dfrac{1}{\\cos\\theta},\\; \\dfrac{1}{\\tan\\theta},\\; \\sin\\theta - \\cos\\theta,\\; \\sin(\\pi+\\theta),\\; \\cos\\left(\\dfrac{3}{2}\\pi+\\theta\\right)$$",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "$\\dfrac\\pi2<\\theta<\\pi$이므로 동경은 제2사분면에 있다. 이 사분면에서는\n$$\\sin\\theta>0,\\qquad\\cos\\theta<0,\\qquad\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}<0.$$\n다섯 식의 부호를 하나씩 판단한다.\n\n① $\\cos\\theta<0$이고 $0$이 아니므로 $\\dfrac1{\\cos\\theta}<0$이다. **양수가 아니다.**\n\n② $\\tan\\theta<0$이고 $0$이 아니므로 $\\dfrac1{\\tan\\theta}<0$이다. **양수가 아니다.**\n\n③ $\\sin\\theta-\\cos\\theta=(\\text{양수})-(\\text{음수})>0$이다. **항상 양수이다.**\n\n④ $\\sin(\\pi+\\theta)=-\\sin\\theta<0$이다. **양수가 아니다.**\n\n⑤ 덧셈정리를 쓰면\n$$\\cos\\left(\\frac{3\\pi}2+\\theta\\right)=\\cos\\frac{3\\pi}2\\cos\\theta-\\sin\\frac{3\\pi}2\\sin\\theta$$\n$$=0\\cdot\\cos\\theta-(-1)\\sin\\theta=\\sin\\theta>0.$$\n따라서 **항상 양수**인 것은 ③과 ⑤의 두 식이고, 개수를 묻는 문제이므로 정답은 ②이다."
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "SS전자에서는 매년 '우주 S 시리즈' 스마트폰을 출시하고 있다. 올해는 10번째 작품으로 '우주 S10'을 출시하였다. 신형 스마트폰 '우주 S10'의 출고가는 100만원이고 이는 전작인 '우주 S9'에 비해 가격이 4% 증가한 것이다. 매년 이와 같이 출고가를 4%씩 올린다고 할 때, 처음으로 출고가 200만원 이상이 되는 제품명은 무엇인가? (단, $\\log 2=0.301$, $\\log 1.04=0.017$로 계산한다.) [4.6점]",
    "choices": [
      "우주 S25",
      "우주 S26",
      "우주 S27",
      "우주 S28",
      "우주 S29"
    ],
    "answer": "④",
    "solution": "우주 S10의 출고가는 $100$만 원이다. 다음 제품부터 매번 $4\\%$씩 오르므로, S10 이후 $n$번 가격을 올린 제품의 가격은\n$$100(1.04)^n\\ \\text{만 원}$$\n이다. 처음 $200$만 원 이상이 되는 조건을 세우면\n$$100(1.04)^n\\ge200,$$\n$$(1.04)^n\\ge2.$$\n$1.04>1$이므로 양변에 상용로그를 취해도 부등호의 방향은 바뀌지 않는다.\n$$n\\log1.04\\ge\\log2,$$\n$$0.017n\\ge0.301,\\qquad n\\ge\\frac{301}{17}.$$\n최소 정수 $n$을 정할 때 소수 근삿값만 보지 않고 양쪽을 비교하면\n$$17\\times0.017=0.289<0.301,$$\n$$18\\times0.017=0.306\\ge0.301.$$\n따라서 $n=17$번 인상으로는 부족하고 **18번** 인상해야 처음 조건을 만족한다. S10에서 18번 뒤는 S28이므로 정답은 ④이다."
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "다음은 지수법칙을 적용할 때 밑과 지수에 붙이는 조건이다. 밑줄 친 조건이 잘못된 것을 고르시오. [4.8점]<br><br><img src=\"assets/images/19_매산고_1학기_중간_고2_수학I/q13.png\" class=\"question-img\" alt=\"지수법칙 선택지 ①~⑤의 조건과 공식\"><br><br><small>※ ①의 5)에서 분모 $b$는 $0$이 아니다.</small>",
    "choices": [],
    "answer": "③",
    "solution": "이 문제는 밑줄 친 조건이 각 지수법칙을 모두 성립시키는지 살피는 문제이다.\n① 자연수 지수에서는 곱셈법칙이 성립한다. 나눗셈 $a^m\\div a^n$에는 $a\\ne0$이 필요하고, 분수 꼴 $\\left(\\frac ab\\right)^n$에는 $b\\ne0$이 필요하다. ①의 5)에서 $b\\ne0$이라는 조건을 함께 적용하므로 ①은 성립한다.\n② 정수 지수에서는 음의 지수가 가능하므로 밑이 $0$이 아니어야 한다. $a\\ne0,\\ b\\ne0$이면 나열된 법칙이 성립한다.\n③ 유리수 지수에는 $\\frac12$처럼 짝수 제곱근을 요구하는 지수가 있다. 밑을 단순히 $a\\ne0,\\ b\\ne0$으로만 제한하면 $a=-1$, 지수 $\\frac12$도 허용되지만 $(-1)^{1/2}$은 실수에서 정의되지 않는다. 따라서 ③의 조건만으로는 지수법칙을 항상 적용할 수 없다.\n④ 무리수 지수와 ⑤ 실수 지수에서는 밑을 $a>0,\\ b>0$으로 두었으므로 각 법칙을 실수 범위에서 적용할 수 있다.\n따라서 밑줄 친 조건이 잘못된 것은 ③이다.",
    "sourceMode": "AUDITED_REPAIR",
    "sourceProvenance": {
        "originalPDF": "2019_매산고2_수1_1중간.pdf",
        "originalPDFSHA256": "ac17142f13940d1d669a97434cfafe08ce3d62a4d13434f8db813d4926c44a3d",
        "originalPDFPage": 3,
        "originalSourceNote": "① 5)의 (단, b≠0)은 인쇄된 텍스트가 아니라 원본 스캔에 보이는 손글씨 보충조건",
        "repairReason": "손글씨 조건의 채택 여부에 따라 ①도 정의역 오류가 되어 단일 정답성이 흐려짐; 수기 보충조건을 명시적으로 학생에게 안내",
        "changedFields": [
            "content",
            "solution",
            "sourceMode",
            "sourceProvenance"
        ],
        "repairStage": "MASTER_TARGETED_AFTER_R1_BEFORE_R2",
        "sourceFidelity": "AUDITED_EDITORIAL_CLARIFICATION_NOT_VERBATIM_PRINT"
    }
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "함수 $f(x)=\\log_{\\frac{1}{3}}(x^2+4x+7)$에 대하여 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4.9점]<br><br><b><보기></b><br>ㄱ. 정의역은 실수 전체이다.<br>ㄴ. 함수 $f(x)$는 감소함수이다.<br>ㄷ. $f(x)$의 최댓값은 $-1$이다.",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "<보기>의 각 명제가 함수 전체에서 성립하는지 하나씩 확인한다.\n\n**ㄱ. 정의역**\n로그는 진수가 양수일 때만 정의된다. 완전제곱식으로 바꾸면\n$$x^2+4x+7=(x+2)^2+3\\ge3>0.$$\n모든 실수 $x$에서 진수가 양수이므로 정의역은 실수 전체이다. **ㄱ은 참이다.**\n\n**ㄴ. 감소함수 여부**\n진수 $(x+2)^2+3$은 $x=-2$까지 감소하고 $x=-2$ 이후 증가한다. 밑이 $\\frac13$인 로그는 진수가 커질수록 값이 작아진다. 따라서 $f(x)$는 $x=-2$까지는 증가하고, 그 뒤에는 감소한다. 실제로\n$$f(-3)=\\log_{1/3}4<-1=\\log_{1/3}3=f(-2)$$\n이므로 $-3<-2$인데도 함수값은 증가한다. 실수 전체에서 감소함수가 아니므로 **ㄴ은 거짓이다.**\n\n**ㄷ. 최댓값**\n밑이 $0<\\frac13<1$인 로그는 진수가 작을수록 함수값이 크다. 진수의 최솟값은 $x=-2$에서 $3$이므로\n$$f(x)\\le\\log_{1/3}3=-1\\qquad\\bigl((\\tfrac13)^{-1}=3\\bigr).$$\n$x=-2$에서 실제로 $-1$이 되므로 최댓값은 $-1$이다. **ㄷ은 참이다.**\n따라서 ㄱ, ㄷ만 옳고 정답은 ③이다."
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "$\\sin\\theta + \\cos\\theta = \\dfrac{1}{2}$일 때, $\\sin^4\\theta + \\cos^4\\theta$의 값은? [4.9점]",
    "choices": [
      "\\dfrac{21}{32}",
      "\\dfrac{23}{32}",
      "\\dfrac{25}{32}",
      "\\dfrac{27}{32}",
      "\\dfrac{29}{32}"
    ],
    "answer": "②",
    "solution": "$\\sin\\theta$와 $\\cos\\theta$의 **합**이 주어졌으므로, 합을 제곱하여 두 수의 곱 $\\sin\\theta\\cos\\theta$를 먼저 구한다.\n$$\\left(\\sin\\theta+\\cos\\theta\\right)^2=\\left(\\frac12\\right)^2=\\frac14.$$\n왼쪽을 전개하고 $\\sin^2\\theta+\\cos^2\\theta=1$을 이용하면\n$$\\sin^2\\theta+2\\sin\\theta\\cos\\theta+\\cos^2\\theta=\\frac14,$$\n$$1+2\\sin\\theta\\cos\\theta=\\frac14,$$\n$$2\\sin\\theta\\cos\\theta=-\\frac34,$$\n$$\\sin\\theta\\cos\\theta=-\\frac38.$$\n구하는 네제곱의 합은 제곱의 합과 곱을 이용해 바꿀 수 있다.\n$$\\sin^4\\theta+\\cos^4\\theta=(\\sin^2\\theta+\\cos^2\\theta)^2-2\\sin^2\\theta\\cos^2\\theta.$$\n여기에 위에서 구한 곱을 대입하면\n$$=1^2-2\\left(-\\frac38\\right)^2=1-2\\cdot\\frac9{64}$$\n$$=\\frac{64}{64}-\\frac{18}{64}=\\frac{46}{64}=\\frac{23}{32}.$$\n따라서 정답은 ②이다."
  },
  {
    "id": 16,
    "questionType": "주관식",
    "content": "[단답형1] $\\cos^2 0^\\circ + \\cos^2 1^\\circ + \\cdots + \\cos^2 89^\\circ + \\cos^2 90^\\circ$의 값을 구하시오. [4점]",
    "choices": [],
    "answer": "91/2",
    "solution": "$0^\\circ$부터 $90^\\circ$까지는 양 끝을 포함하여 $91$개의 항이 있다. 여각의 코사인 관계\n$$\\cos(90^\\circ-t)=\\sin t$$\n와 $\\sin^2t+\\cos^2t=1$을 이용하면, 두 각의 합이 $90^\\circ$인 항끼리 묶을 수 있다.\n$$\\cos^2 0^\\circ+\\cos^2 90^\\circ=1^2+0^2=1,$$\n$$\\cos^2 1^\\circ+\\cos^2 89^\\circ=\\cos^2 1^\\circ+\\sin^2 1^\\circ=1,$$\n$$\\cdots$$\n$$\\cos^2 44^\\circ+\\cos^2 46^\\circ=1.$$\n$0^\\circ$와 $90^\\circ$부터 $44^\\circ$와 $46^\\circ$까지는 총 $45$쌍, 즉 $90$개 항이다. 가운데 $45^\\circ$는 자기 자신과 짝이므로 **한 번만** 더해야 한다.\n$$\\cos^2 45^\\circ=\\left(\\frac{\\sqrt2}2\\right)^2=\\frac12.$$\n따라서 전체 합은\n$$45\\times1+\\frac12=\\frac{90}2+\\frac12=\\frac{91}2.$$\n답은 $\\dfrac{91}{2}$이다."
  },
  {
    "id": 17,
    "questionType": "주관식",
    "content": "[단답형2] 함수 $y=2^x$의 그래프와 기울기가 1인 직선이 두 점에서 만날 때, 만나는 두 점을 각각 $\\mathrm{A}(\\alpha, 2^\\alpha)$, $\\mathrm{B}(\\beta, 2^\\beta)$라 하자. $\\overline{\\mathrm{AB}}=3\\sqrt{2}$일 때, $\\alpha+\\beta$의 값을 구하시오. (단, $\\log 2=0.30$, $\\log 3=0.48$, $\\log 7=0.85$로 계산한다.) [5점]<br><br><img src=\"assets/images/19_매산고_1학기_중간_고2_수학I/q17.png\" class=\"question-img\">",
    "choices": [],
    "answer": "8/15",
    "solution": "두 교점이 기울기 $1$인 같은 직선 위에 있으므로, $x$좌표가 작은 점을 $\\mathrm A$, 큰 점을 $\\mathrm B$로 잡아 $\\beta>\\alpha$라고 놓아도 된다. 직선의 기울기 공식에서\n$$\\frac{2^\\beta-2^\\alpha}{\\beta-\\alpha}=1,$$\n$$2^\\beta-2^\\alpha=\\beta-\\alpha.$$\n이 식은 두 점의 $y$좌표 차와 $x$좌표 차가 같다는 뜻이다. 거리 조건에 그대로 대입하면\n$$\\overline{\\mathrm{AB}}=\\sqrt{(\\beta-\\alpha)^2+(2^\\beta-2^\\alpha)^2}$$\n$$=\\sqrt{(\\beta-\\alpha)^2+(\\beta-\\alpha)^2}=\\sqrt2(\\beta-\\alpha)=3\\sqrt2.$$\n$\\beta>\\alpha$이므로 $\\beta-\\alpha=3$, 즉 $\\beta=\\alpha+3$이다.\n$$2^\\beta-2^\\alpha=3\\quad\\Longrightarrow\\quad2^{\\alpha+3}-2^\\alpha=3,$$\n$$2^\\alpha(2^3-1)=3\\quad\\Longrightarrow\\quad7\\cdot2^\\alpha=3,$$\n$$2^\\alpha=\\frac37.$$\n양변에 상용로그를 취하면\n$$\\alpha\\log2=\\log3-\\log7,$$\n$$\\alpha=\\frac{0.48-0.85}{0.30}=\\frac{-0.37}{0.30}=-\\frac{37}{30}.$$\n$$\\beta=\\alpha+3=-\\frac{37}{30}+\\frac{90}{30}=\\frac{53}{30}.$$\n따라서\n$$\\alpha+\\beta=-\\frac{37}{30}+\\frac{53}{30}=\\frac{16}{30}=\\frac8{15}.$$\n답은 $\\dfrac8{15}$이다."
  },
  {
    "id": 18,
    "questionType": "주관식",
    "content": "[단답형3] 두 함수 $y=|2\\sin(\\pi x)+1|$과 $y=[\\log_2 x]$의 교점의 개수를 구하시오. [6점]",
    "choices": [],
    "answer": "13",
    "solution": "$[\\log_2x]$는 $\\log_2x$ 이하의 최대 정수이므로 $x>0$에서 정수값만 갖는다. 한편\n$$-1\\le\\sin\\pi x\\le1\\quad\\Longrightarrow\\quad-1\\le2\\sin\\pi x+1\\le3,$$\n$$0\\le|2\\sin\\pi x+1|\\le3.$$\n따라서 교점에서는 $[\\log_2x]$가 $0,1,2,3$ 중 하나여야 한다. $[\\log_2x]=k$의 범위는\n$$k\\le\\log_2x<k+1\\quad\\Longleftrightarrow\\quad2^k\\le x<2^{k+1}.$$\n**오른쪽 끝점은 포함하지 않는다**는 점에 주의하여 네 경우를 나눈다.\n\n**① $[\\log_2x]=0$:** $1\\le x<2$이고 $|2\\sin\\pi x+1|=0$이다.\n$$2\\sin\\pi x+1=0\\iff\\sin\\pi x=-\\frac12.$$\n$\\pi x$가 $\\pi$ 이상 $2\\pi$ 미만인 범위에서\n$$\\pi x=\\frac{7\\pi}6,\\frac{11\\pi}6\\quad\\Longrightarrow\\quad x=\\frac76,\\frac{11}6.$$\n따라서 **2개**이다.\n\n**② $[\\log_2x]=1$:** $2\\le x<4$이고 $|2\\sin\\pi x+1|=1$이다.\n$$2\\sin\\pi x+1=1\\quad\\text{또는}\\quad2\\sin\\pi x+1=-1,$$\n$$\\sin\\pi x=0\\quad\\text{또는}\\quad\\sin\\pi x=-1.$$\n$[2,4)$에서 $\\sin\\pi x=0$인 정수는 $x=2,3$이고, $\\sin\\pi x=-1$인 해는 $x=\\frac72$이다. $x=4$는 오른쪽 끝점이므로 제외한다. 따라서 **3개**이다.\n\n**③ $[\\log_2x]=2$:** $4\\le x<8$이고 $|2\\sin\\pi x+1|=2$이다.\n$$\\sin\\pi x=\\frac12\\quad\\text{또는}\\quad\\sin\\pi x=-\\frac32.$$\n사인값은 $-1$보다 작을 수 없으므로 뒤의 식은 불가능하다. 앞의 식의 해는 각 주기 $2$마다 두 개씩 나오므로\n$$x=\\frac{25}6,\\frac{29}6,\\frac{37}6,\\frac{41}6$$\n의 **4개**이다.\n\n**④ $[\\log_2x]=3$:** $8\\le x<16$이고 $|2\\sin\\pi x+1|=3$이다.\n$$\\sin\\pi x=1\\quad\\text{또는}\\quad\\sin\\pi x=-2.$$\n뒤의 식은 불가능하다. $\\sin\\pi x=1$은 $x=\\frac12+2n$($n$은 정수)에서 성립하므로 주어진 범위의 해는\n$$x=\\frac{17}2,\\frac{21}2,\\frac{25}2,\\frac{29}2$$\n의 **4개**이다.\n\n네 구간은 겹치지 않으므로 교점은\n$$2+3+4+4=13$$\n개이다. 답은 $13$이다.",
    "solutionImage": "assets/images/19_매산고_1학기_중간_고2_수학I/q18-solution.svg",
    "solutionImageAlt": "절댓값 사인함수와 밑이 2인 로그의 정수 부분 계단함수의 13개 교점 그래프",
    "solutionImageCaption": "구간 [1,2), [2,4), [4,8), [8,16)에서 각각 2, 3, 4, 4개의 교점을 확인합니다.",
    "solutionImageSize": "full"
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "[서술형1] 함수 $f(x)=2^{x-2}-2$와 그 역함수 $g(x)=f^{-1}(x)$에 대하여 $\\left(\\dfrac{1}{2}\\right)^{f(x)} > 2^{-g(x)}$를 만족하는 정수 $x$의 개수를 구하는 과정을 서술하시오. [10점]",
    "choices": [],
    "answer": "6",
    "solution": "먼저 두 함수가 **같은 $x$에서 정의되는 범위**를 확인한다. $f(x)=2^{x-2}-2$는 모든 실수에서 정의되고, $f(x)>-2$이므로 역함수의 정의역은 $x>-2$이다.\n$$g(x)=f^{-1}(x)=\\log_2(x+2)+2\\qquad(x>-2).$$\n$\\left(\\frac12\\right)^{f(x)}=2^{-f(x)}$이고 밑 $2>1$이므로 원래 부등식은\n$$2^{-f(x)}>2^{-g(x)}\\iff-f(x)>-g(x)\\iff f(x)<g(x).$$\n정수 $x$는 $-1,0,1,\\ldots$만 가능하다.\n\n**① $-1\\le x\\le4$인 정수:** $f$와 $g$는 모두 증가함수이다. 따라서\n$$f(x)\\le f(4)=2^{4-2}-2=4-2=2,$$\n$$g(x)\\ge g(-1)=\\log_2 1+2=2.$$\n$f(x)=2$가 되려면 $x=4$, $g(x)=2$가 되려면 $x=-1$이어야 하므로 **같은 $x$에서 두 등호가 동시에 성립하지 않는다**. 따라서 이 범위에서는 항상 $f(x)<g(x)$이고, 정수는 $-1,0,1,2,3,4$의 **6개**이다.\n\n**② $x\\ge5$인 정수:** 먼저 $x=5$를 확인한다.\n$$f(5)=2^3-2=6,\\qquad g(5)=2+\\log_2 7<2+3=5.$$\n따라서 $f(5)>g(5)$이다. 이제 정수 $x\\ge5$가 $1$씩 커질 때 두 함수가 얼마나 증가하는지 비교한다.\n$$f(x+1)-f(x)=2^{x-1}-2^{x-2}=2^{x-2}\\ge8,$$\n$$g(x+1)-g(x)=\\log_2(x+3)-\\log_2(x+2)=\\log_2\\left(1+\\frac1{x+2}\\right)<1.$$\n즉 한 칸 증가할 때마다 $f$는 $8$ 이상 증가하지만 $g$는 $1$보다 작게 증가한다. 이미 $x=5$에서 $f>g$이므로 그 뒤에도 $f(x)>g(x)$가 유지된다. 이 범위에는 해가 없다.\n\n따라서 조건을 만족하는 정수는 $-1,0,1,2,3,4$이고, 구하는 개수는 **6개**이다."
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형2] 그림과 같이 원점 $\\mathrm{O}$를 중심으로 하고 반지름의 길이가 1인 원 위의 점 $\\mathrm{P}$가 제2사분면에 있을 때 동경 $\\mathrm{OP}$가 나타내는 각의 크기를 $\\theta$라고 하자. 점 $\\mathrm{A}(-1, 0)$을 지나는 직선 $x=-1$과 동경 $\\mathrm{OP}$가 만나는 점을 $\\mathrm{B}$, 점 $\\mathrm{A}$에서 동경 $\\mathrm{OP}$에 수직으로 내린 수선의 발을 $\\mathrm{C}$, 점 $\\mathrm{C}$에서 $x$축에 수직으로 내린 수선의 발을 $\\mathrm{D}$라 하자. 삼각형 $\\mathrm{OCD}$의 넓이를 $S_1$, 삼각형 $\\mathrm{ABC}$의 넓이를 $S_2$라고 할 때, $\\theta$에 대한 삼각함수로 표현하여 $\\dfrac{S_1}{S_2}$의 값을 구하는 과정을 서술하시오. [10점]<br><br><img src=\"assets/images/19_매산고_1학기_중간_고2_수학I/q20.png\" class=\"question-img\">",
    "choices": [],
    "answer": "\\dfrac{\\cos^4\\theta}{\\sin^2\\theta}",
    "solution": "그림의 점 $\\mathrm P$가 제2사분면에 있으므로 $\\frac\\pi2<\\theta<\\pi$이다. $\\alpha=\\pi-\\theta$라고 두면 $0<\\alpha<\\frac\\pi2$이고, 왼쪽 방향의 $x$축과 동경 $\\mathrm{OP}$가 이루는 예각이 $\\alpha$이다. 따라서\n$$\\sin\\alpha=\\sin\\theta,\\qquad\\cos\\alpha=-\\cos\\theta.$$\n점 $\\mathrm C$는 $\\mathrm A$에서 $\\mathrm{OP}$에 내린 수선의 발이므로 $\\angle\\mathrm{OCA}=90^\\circ$이다. 직각삼각형 $\\mathrm{OAC}$에서 $\\mathrm{OA}=1$을 빗변으로 보면\n$$\\mathrm{OC}=\\mathrm{OA}\\cos\\alpha=\\cos\\alpha,$$\n$$\\mathrm{AC}=\\mathrm{OA}\\sin\\alpha=\\sin\\alpha.$$\n$\\mathrm C$에서 $x$축에 내린 발이 $\\mathrm D$이므로 $\\triangle\\mathrm{OCD}$도 직각삼각형이다. $\\angle\\mathrm{COD}=\\alpha$에서\n$$\\mathrm{OD}=\\mathrm{OC}\\cos\\alpha=\\cos^2\\alpha,$$\n$$\\mathrm{CD}=\\mathrm{OC}\\sin\\alpha=\\sin\\alpha\\cos\\alpha.$$\n따라서 $\\triangle\\mathrm{OCD}$의 밑변을 $\\mathrm{OD}$, 높이를 $\\mathrm{CD}$로 잡으면\n$$S_1=\\frac12\\mathrm{OD}\\cdot\\mathrm{CD}=\\frac12\\cos^2\\alpha\\cdot\\sin\\alpha\\cos\\alpha=\\frac12\\sin\\alpha\\cos^3\\alpha.$$\n이제 $\\triangle\\mathrm{ABC}$의 넓이를 구한다. $\\mathrm{AB}$는 $x=-1$ 위의 수직선분이고, $\\mathrm{OA}=1$이다. 직각삼각형 $\\mathrm{OAB}$에서\n$$\\tan\\alpha=\\frac{\\mathrm{AB}}{\\mathrm{OA}}=\\mathrm{AB},\\qquad\\mathrm{AB}=\\tan\\alpha.$$\n$\\mathrm{AB}$를 밑변으로 잡을 때 높이는 $\\mathrm C$에서 수직선 $x=-1$까지의 **수평 거리**이다. 점 $\\mathrm D$의 $x$좌표는 $-\\mathrm{OD}=-\\cos^2\\alpha$이므로 이 거리는\n$$\\mathrm{AD}=1-\\mathrm{OD}=1-\\cos^2\\alpha=\\sin^2\\alpha.$$\n따라서\n$$S_2=\\frac12\\mathrm{AB}\\cdot\\mathrm{AD}=\\frac12\\tan\\alpha\\cdot\\sin^2\\alpha$$\n$$=\\frac12\\frac{\\sin\\alpha}{\\cos\\alpha}\\sin^2\\alpha=\\frac{\\sin^3\\alpha}{2\\cos\\alpha}.$$\n두 넓이는 양수이고 $0<\\alpha<\\frac\\pi2$이므로 분모가 $0$이 되지 않는다. 이제 비를 구하면\n$$\\frac{S_1}{S_2}=\\frac{\\frac12\\sin\\alpha\\cos^3\\alpha}{\\frac{\\sin^3\\alpha}{2\\cos\\alpha}}$$\n$$=\\frac{\\sin\\alpha\\cos^3\\alpha}{1}\\cdot\\frac{\\cos\\alpha}{\\sin^3\\alpha}=\\frac{\\cos^4\\alpha}{\\sin^2\\alpha}.$$\n마지막으로 $\\cos^4\\alpha=(-\\cos\\theta)^4=\\cos^4\\theta$, $\\sin^2\\alpha=\\sin^2\\theta$이므로\n$$\\boxed{\\frac{S_1}{S_2}=\\frac{\\cos^4\\theta}{\\sin^2\\theta}}.$$\n따라서 답은 $\\dfrac{\\cos^4\\theta}{\\sin^2\\theta}$이다."
  }
];
