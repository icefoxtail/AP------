window.examTitle = "21_제일고_1학기_중간_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "$\\log_3 \\frac{9}{2} + 2\\log_3 \\sqrt{18}$의 값은? [3.1점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "로그의 성질 $2\\log_3\\sqrt{18}=\\log_3(\\sqrt{18})^2=\\log_3 18$을 이용합니다.<br>$\\log_3\\frac92+\\log_3 18=\\log_3\\left(\\frac92\\times18\\right)=\\log_3 81=\\log_3 3^4=4$.<br>따라서 정답은 ④입니다."
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "지수부등식 $5^{x+4} \\ge \\left(\\frac{1}{5}\\right)^{1-2x}$을 만족시키는 자연수 $x$의 개수는? [3.2점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "①",
    "solution": "$\\left(\\frac15\\right)^{1-2x}=5^{-(1-2x)}=5^{2x-1}$입니다.<br>밑 $5>1$이므로 지수를 비교하면 $x+4\\ge 2x-1$, 즉 $x\\le5$입니다.<br>자연수 $x=1,2,3,4,5$의 5개이므로 정답은 ①입니다."
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "$\\theta$가 제2사분면의 각이고 $\\tan\\theta = -\\frac{2}{3}$일 때, $\\sin\\theta$의 값은? [3.3점]",
    "choices": [
      "$-\\frac{2}{13}\\sqrt{13}$",
      "$-\\frac{3}{13}\\sqrt{13}$",
      "$\\frac{2}{13}\\sqrt{13}$",
      "$\\frac{3}{13}\\sqrt{13}$",
      "$\\frac{2}{5}$"
    ],
    "answer": "③",
    "solution": "제2사분면에서는 $\\sin\\theta>0$, $\\cos\\theta<0$이므로 $\\tan\\theta<0$입니다.<br>원문의 $\\tan\\theta=-\\frac23$에 맞추어 직각삼각형의 높이 $2$, 밑변 $-3$, 빗변 $\\sqrt{(-3)^2+2^2}=\\sqrt{13}$으로 생각합니다.<br>$\\sin\\theta=\\frac2{\\sqrt{13}}=\\frac{2\\sqrt{13}}{13}$이므로 정답은 ③입니다."
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "$\\sin\\theta\\cos\\theta < 0$, $\\sin\\theta\\tan\\theta < 0$을 만족시키는 각 $\\theta$가 존재하는 사분면은? [3.4점]",
    "choices": [
      "제1사분면",
      "제2사분면",
      "제3사분면",
      "제4사분면",
      "제2사분면, 제3사분면"
    ],
    "answer": "②",
    "solution": "$\\sin\\theta\\tan\\theta=\\frac{\\sin^2\\theta}{\\cos\\theta}<0$이므로 $\\cos\\theta<0$입니다.<br>또 $\\sin\\theta\\cos\\theta<0$이고 $\\cos\\theta<0$이므로 $\\sin\\theta>0$이어야 합니다.<br>사인 양수, 코사인 음수인 곳은 제2사분면뿐이므로 정답은 ②입니다."
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$에서 방정식 $\\sin x = \\sqrt{3}\\cos x$의 두 실근을 $\\alpha$, $\\beta$라 할 때, $\\alpha+\\beta$의 값은? [3.5점]",
    "choices": [
      "$\\pi$",
      "$\\frac{4}{3}\\pi$",
      "$\\frac{5}{3}\\pi$",
      "$2\\pi$",
      "$\\frac{7}{3}\\pi$"
    ],
    "answer": "③",
    "solution": "$\\sin x=\\sqrt3\\cos x$에서 $\\cos x=0$이면 성립하지 않으므로 양변을 $\\cos x$로 나눌 수 있습니다.<br>$\\tan x=\\sqrt3$이므로 $0\\le x<2\\pi$의 두 해는 $\\alpha=\\frac\\pi3$, $\\beta=\\frac{4\\pi}3$입니다.<br>$\\alpha+\\beta=\\frac\\pi3+\\frac{4\\pi}3=\\frac{5\\pi}3$이므로 정답은 ③입니다."
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "방정식 $(\\log_2 8x)(\\log_2 4x) = 12$의 두 근을 $a, b$라 할 때, $\\frac{b}{a}$의 값은? (단, $a < b$) [3.6점]",
    "choices": [
      "816",
      "32",
      "64",
      "128",
      "256"
    ],
    "answer": "④",
    "solution": "로그의 진수 조건은 $x>0$입니다. $t=\\log_2 x$라 놓으면 $\\log_2(8x)=t+3$, $\\log_2(4x)=t+2$입니다.<br>$(t+3)(t+2)=12\\Rightarrow t^2+5t-6=0\\Rightarrow(t+6)(t-1)=0$.<br>$t=-6,1$이므로 $x=2^{-6}=\\frac1{64}$ 또는 $x=2$입니다.<br>$a=\\frac1{64}<b=2$이므로 $\\frac ba=2\\div\\frac1{64}=128$, 정답은 ④입니다."
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "그림과 같이 지수함수 $y=10^x$의 그래프가 두 점 $(a, 3)$, $(b, 27)$를 지난다. 두 양수 $a, b$에 대하여 $b-a$의 값은?<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q07.png\" class=\"exam-img\"> [3.7점]",
    "choices": [
      "$\\log\\frac{2}{3}$",
      "$\\log 2$",
      "$\\log 3$",
      "$\\log 6$",
      "$2\\log 3$"
    ],
    "answer": "⑤",
    "solution": "점 $(a,3)$이 $y=10^x$ 위에 있으므로 $10^a=3$, 즉 $a=\\log 3$입니다.<br>점 $(b,27)$도 그래프 위에 있으므로 $10^b=27$, 즉 $b=\\log27=3\\log3$입니다.<br>$b-a=3\\log3-\\log3=2\\log3$이므로 정답은 ⑤입니다."
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "그림과 같이 함수 $y=\\log_2 x$의 그래프 위의 점 $A$에 대하여 사각형 $ABCD$는 한 변의 길이가 3인 정사각형이다. 이때, 점 $D(a, b)$라고 할 때, $a+b$의 값은? (단, 두 점 $B, C$는 $x$축 위의 점이다.)<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q08.png\" class=\"exam-img\"> [3.8점]",
    "choices": [
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "answer": "①",
    "solution": "정사각형의 한 변이 $3$이고 $B,C$가 $x$축 위에 있으므로 $A$와 $D$의 높이는 $3$입니다.<br>$A$가 $y=\\log_2 x$ 위에 있으므로 $3=\\log_2 x_A\\Rightarrow x_A=2^3=8$입니다.<br>$D$는 $A$에서 오른쪽으로 $3$만큼 떨어져 있으므로 $D=(8+3,3)=(11,3)$입니다.<br>$a+b=11+3=14$이므로 정답은 ①입니다."
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "함수 $y=a^x + 1$ ($a>0, a \\ne 1$)의 그래프를 $x$축의 방향으로 $-3$만큼 평행이동한 후, $y$축에 대하여 대칭이동한 그래프는 $a$의 값에 관계없이 항상 점 $(m, n)$을 지난다. $mn$의 값은? [3.9점]",
    "choices": [
      "2",
      "3",
      "4",
      "6",
      "8"
    ],
    "answer": "④",
    "solution": "원래 함수는 $y=a^x+1$입니다. $x$축 방향으로 $-3$만큼 이동하면 $y=a^{x+3}+1$입니다.<br>이를 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 대입하여 $y=a^{3-x}+1$입니다.<br>밑 $a$와 관계없이 지수가 $0$인 $x=3$에서 $y=a^0+1=2$이므로 항상 $(m,n)=(3,2)$를 지납니다.<br>$mn=3\\times2=6$이므로 정답은 ④입니다."
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "$\\sin\\theta + \\cos\\theta = \\frac{1}{2}$일 때, $\\tan\\theta + \\frac{1}{\\tan\\theta}$의 값은? [4.0점]",
    "choices": [
      "$\\frac{8}{3}$",
      "2",
      "-2",
      "$-\\frac{10}{3}$",
      "$-\\frac{8}{3}$"
    ],
    "answer": "⑤",
    "solution": "주어진 조건은 $\\sin\\theta+\\cos\\theta=\\frac12$입니다. 구하려는 식에 $\\tan\\theta$와 그 역수가 있으므로, 먼저 $\\sin\\theta\\cos\\theta$를 구하면 계산이 간단해집니다.<br>\n양변을 제곱하면<br>$(\\sin\\theta+\\cos\\theta)^2=\\sin^2\\theta+2\\sin\\theta\\cos\\theta+\\cos^2\\theta$<br>$\\Rightarrow\\frac14=1+2\\sin\\theta\\cos\\theta$<br>$\\Rightarrow2\\sin\\theta\\cos\\theta=-\\frac34$<br>$\\Rightarrow\\sin\\theta\\cos\\theta=-\\frac38$입니다.<br>\n곱이 $0$이 아니므로 $\\sin\\theta$, $\\cos\\theta$는 모두 $0$이 아니고, $\\tan\\theta$와 $\\frac1{\\tan\\theta}$가 정의됩니다.<br>\n$\\tan\\theta+\\frac1{\\tan\\theta}=\\frac{\\sin\\theta}{\\cos\\theta}+\\frac{\\cos\\theta}{\\sin\\theta}$<br>$=\\frac{\\sin^2\\theta+\\cos^2\\theta}{\\sin\\theta\\cos\\theta}=\\frac1{-3/8}=-\\frac83$입니다.<br>\n따라서 정답은 ⑤입니다."
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "함수 $y=\\log_a x + m$의 그래프와 그 역함수의 그래프가 두 점에서 만난다. 두 교점의 $x$좌표가 각각 $1, 4$일 때, $a^3 + m^3$의 값은? (단, $a>0, a \\ne 1, m$은 상수이다.) [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "함수 $f(x)=\\log_a x+m$과 역함수의 교점은 직선 $y=x$에 대해 대칭입니다. 먼저 밑 $a$에 따라 함수가 증가하는지 감소하는지 나누어 생각합니다.<br>\n<strong>① $a>1$인 경우</strong><br>$f$는 증가함수입니다. 교점 $(u,v)$가 직선 $y=x$ 밖에 있다면 $(v,u)$도 교점인데, $u<v$라고 놓으면 $f(u)=v>u=f(v)$가 되어 증가함수라는 사실과 모순됩니다. 따라서 이 경우 모든 교점은 $y=x$ 위에 있습니다.<br>\n교점의 $x$좌표가 $1,4$이므로 $f(1)=1$, $f(4)=4$입니다.<br>$f(1)=\\log_a1+m=0+m=1\\Rightarrow m=1$.<br>$f(4)=\\log_a4+1=4\\Rightarrow\\log_a4=3\\Rightarrow a^3=4$.<br>따라서 $a^3+m^3=4+1=5$입니다.<br>\n<strong>② $0<a<1$인 경우는 왜 제외할까요?</strong><br>$f$는 감소함수입니다. 감소함수는 서로 다른 두 고정점 $f(x)=x$를 가질 수 없습니다. 따라서 교점이 두 개이고 그 $x$좌표가 $1,4$라면, 두 교점은 대칭인 $(1,4)$와 $(4,1)$이어야 합니다.<br>그런데 $f(1)=4>1$, $f(4)=1<4$이므로 연속함수 $f(x)-x$는 $1$과 $4$ 사이에서 $0$이 됩니다. 즉 직선 $y=x$ 위에도 교점이 하나 더 생겨 '두 점에서 만난다'는 조건에 어긋납니다.<br>\n그러므로 가능한 경우는 ①뿐이며 정답은 ⑤입니다."
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "함수 $f(x) = \\log_9(18-x) + \\log_3\\sqrt{x}$의 최댓값은? [4.1점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "진수 조건은 $0<x<18$입니다. $\\log_9(18-x)=\\frac12\\log_3(18-x)$, $\\log_3\\sqrt x=\\frac12\\log_3x$입니다.<br>$f(x)=\\frac12\\log_3\\{x(18-x)\\}$이고 밑 $3>1$이므로 $x(18-x)$가 최대일 때 $f(x)$도 최대입니다.<br>$x(18-x)=81-(x-9)^2\\le81$이고 $x=9$에서 등호가 성립합니다.<br>$\\max f(x)=\\frac12\\log_3 81=\\frac12\\times4=2$이므로 정답은 ②입니다."
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "모든 실수 $x$에 대하여 이차부등식 $x^2 - 4\\cos\\theta x + 1 \\ge 0$이 성립하도록 하는 $\\theta$의 값의 범위가 $\\alpha \\le \\theta \\le \\beta$일 때, $\\beta-\\alpha$의 값은?(단, $0 \\le \\theta \\le \\pi$) [4.2점]",
    "choices": [
      "$\\frac{5\\pi}{3}$",
      "$\\frac{4\\pi}{3}$",
      "$\\pi$",
      "$\\frac{2\\pi}{3}$",
      "$\\frac{\\pi}{3}$"
    ],
    "answer": "⑤",
    "solution": "이차식 $x^2-4\\cos\\theta\\,x+1$은 최고차항의 계수가 양수입니다. 모든 실수 $x$에서 $0$ 이상이려면 판별식이 $0$ 이하이어야 합니다.<br>$D=(-4\\cos\\theta)^2-4=16\\cos^2\\theta-4\\le0$이므로 $|\\cos\\theta|\\le\\frac12$입니다.<br>$0\\le\\theta\\le\\pi$에서 $-\\frac12\\le\\cos\\theta\\le\\frac12$인 범위는 $\\frac\\pi3\\le\\theta\\le\\frac{2\\pi}3$입니다.<br>$\\beta-\\alpha=\\frac{2\\pi}3-\\frac\\pi3=\\frac\\pi3$이므로 정답은 ⑤입니다."
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "호의 길이가 반지름의 2배인 서로 다른 두 부채꼴 $A_1$, $A_2$가 있다. 두 부채꼴 $A_1$, $A_2$의 호의 길이의 합이 8이고 두 부채꼴의 넓이의 합이 10일 때, 두 부채꼴 $A_1$, $A_2$의 반지름의 길이의 곱은? [4.3점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "두 부채꼴의 반지름을 $r_1,r_2$라 하면 호의 길이가 각각 반지름의 두 배이므로 중심각은 $\\frac{2r_i}{r_i}=2$라디안입니다.<br>각 부채꼴의 넓이는 $\\frac12r_i\\cdot2r_i=r_i^2$입니다.<br>호의 길이의 합 $2r_1+2r_2=8$에서 $r_1+r_2=4$이고, 넓이의 합에서 $r_1^2+r_2^2=10$입니다.<br>$(r_1+r_2)^2=r_1^2+r_2^2+2r_1r_2$이므로 $16=10+2r_1r_2$, $r_1r_2=3$입니다. 정답은 ①입니다."
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "이차함수 $y=f(x)$의 그래프와 직선 $y=x-1$이 그림과 같을 때, 부등식 $$\\log_5 f(x) \\le \\log_5(x-1)$$ 을 만족시키는 모든 자연수 $x$의 개수는? (단, $f(0)=f(7)=0$, $f(4)=3$)<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q15.png\" class=\"exam-img\"> [4.4점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "로그부등식에서는 <strong>진수 조건을 먼저</strong> 확인해야 합니다. 이를 위해 그림과 주어진 세 함수값으로 $f(x)$의 식을 구합니다.<br>\n$f(0)=f(7)=0$이므로 이차함수의 두 근은 $0,7$이고 $f(x)=k\\,x(7-x)$로 놓을 수 있습니다.<br>$f(4)=3$을 대입하면 $3=k\\cdot4\\cdot(7-4)=12k$이므로 $k=\\frac14$입니다.<br>따라서 $f(x)=\\frac{x(7-x)}4$입니다.<br>\n<strong>① 진수 조건</strong><br>$\\log_5 f(x)$가 정의되려면 $f(x)>0$, $\\log_5(x-1)$이 정의되려면 $x-1>0$이어야 합니다.<br>$\\frac{x(7-x)}4>0\\Rightarrow0<x<7$, 그리고 $x>1$이므로 두 조건을 합치면 $1<x<7$입니다.<br>\n<strong>② 부등식 풀이</strong><br>밑 $5>1$이므로 로그함수는 증가합니다. 따라서<br>$\\log_5f(x)\\le\\log_5(x-1)\\iff f(x)\\le x-1$입니다.<br>$\\frac{x(7-x)}4\\le x-1$<br>$\\iff 7x-x^2\\le4x-4$<br>$\\iff x^2-3x-4\\ge0$<br>$\\iff(x-4)(x+1)\\ge0$<br>$\\iff x\\le-1\\ \\text{또는}\\ x\\ge4$입니다.<br>\n<strong>③ 조건의 교집합</strong><br>앞서 구한 $1<x<7$과 교집합을 취하면 $4\\le x<7$입니다. $x=4$는 등호를 만족하여 포함되고, $x=7$은 진수가 $0$이므로 제외됩니다.<br>자연수는 $4,5,6$의 $3$개이므로 정답은 ③입니다."
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "세 실수 $x, y, z$에 대하여 $xyz=72$이고 $2^x = 5^4$, $5^y = 7^3$일 때, $7^z$의 값은? [4.5점]",
    "choices": [
      "32",
      "64",
      "128",
      "256",
      "512"
    ],
    "answer": "②",
    "solution": "$2^x=5^4$에서 $x\\log2=4\\log5$, $5^y=7^3$에서 $y\\log5=3\\log7$입니다.<br>두 식을 곱하면 $xy\\log2\\log5=12\\log5\\log7$이므로 $xy=\\frac{12\\log7}{\\log2}$입니다.<br>$xyz=72$이므로 $z=\\frac{72}{xy}=\\frac{6\\log2}{\\log7}=\\log_7 2^6$입니다.<br>따라서 $7^z=2^6=64$, 정답은 ②입니다."
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "그림과 같이 함수 $y=\\sin\\frac{\\pi}{3}x$ ($0 \\le x \\le 3$)의 그래프 위의 두 점 $A, D$와 $x$축 위의 두 점 $B, C$를 꼭짓점으로 하는 직사각형 $ABCD$가 있다. $\\overline{BC}=2$일 때, 직사각형 $ABCD$의 넓이는?<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q17.png\" class=\"exam-img\"> [4.6점]",
    "choices": [
      "1",
      "$\\frac{4}{3}$",
      "$\\sqrt{2}$",
      "$\\frac{3}{2}$",
      "$\\sqrt{3}$"
    ],
    "answer": "①",
    "solution": "직사각형의 넓이는 <strong>밑변 $BC$의 길이 × 높이 $AB$</strong>입니다. 밑변은 $2$로 주어졌으므로 그래프에서 윗변의 높이를 구합니다.<br>\n$y=\\sin\\frac\\pi3x$는 $0\\le x\\le3$에서<br>$\\sin\\frac\\pi3(3-x)=\\sin\\left(\\pi-\\frac\\pi3x\\right)=\\sin\\frac\\pi3x$이므로 $x=\\frac32$를 기준으로 좌우대칭입니다.<br>직사각형의 두 윗꼭짓점 $A,D$는 높이가 같으므로 그 $x$좌표도 $\\frac32$를 기준으로 대칭입니다. 두 좌표의 차이는 $BC=2$이므로 각각 중심에서 $1$만큼 떨어져 있습니다.<br>$x_A=\\frac32-1=\\frac12$, $x_D=\\frac32+1=\\frac52$입니다.<br>\n높이는 $AB=y_A=\\sin\\left(\\frac\\pi3\\cdot\\frac12\\right)=\\sin\\frac\\pi6=\\frac12$입니다. 실제로 $D$에서도 $\\sin\\frac{5\\pi}6=\\frac12$로 높이가 같습니다.<br>\n따라서 넓이는 $BC\\times AB=2\\times\\frac12=1$이고 정답은 ①입니다.",
    "solutionImage": "assets/images/21_제일고_1학기_중간_고2_수학I/q17-solution.svg",
    "solutionImageAlt": "사인함수의 대칭축 x=3/2와 직사각형 ABCD의 밑변 2, 높이 1/2를 표시한 해설 그래프",
    "solutionImageCaption": "두 윗꼭짓점의 x좌표는 1/2, 5/2이므로 높이는 sin(π/6)=1/2입니다.",
    "solutionImageSize": "full"
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "$0 < x < \\pi$일 때, 함수 $f(x) = \\frac{16\\sin^2(\\pi+x)+9}{4\\cos\\left(\\frac{\\pi}{2}-x\\right)}$는 $x=\\alpha$일 때 최솟값 $\\beta$를 갖는다. $\\beta \\times \\sin\\alpha$의 값은? [4.7점]",
    "choices": [
      "$\\frac{9}{2}$",
      "4",
      "$\\frac{7}{2}$",
      "3",
      "$\\frac{5}{2}$"
    ],
    "answer": "①",
    "solution": "먼저 삼각함수의 각을 정리합니다.<br>$\\sin(\\pi+x)=-\\sin x$, $\\cos\\left(\\frac\\pi2-x\\right)=\\sin x$이므로<br>$f(x)=\\frac{16\\sin^2x+9}{4\\sin x}=4\\sin x+\\frac9{4\\sin x}$입니다.<br>\n$0<x<\\pi$에서 $0<\\sin x\\le1$이므로 $s=\\sin x$로 놓으면 $0<s\\le1$입니다. 따라서 양수 $4s$, $\\frac9{4s}$에 산술평균·기하평균 부등식을 적용할 수 있습니다.<br>$4s+\\frac9{4s}\\ge2\\sqrt{4s\\cdot\\frac9{4s}}=2\\sqrt9=6$입니다.<br>\n등호가 성립하려면 두 양수가 같아야 하므로<br>$4s=\\frac9{4s}\\iff16s^2=9\\iff s=\\frac34$입니다. $\\frac34$는 $0<s\\le1$ 안에 있으므로 실제로 가능한 값이며, 최솟값은 $\\beta=6$입니다.<br>\n$\\sin\\alpha=\\frac34$를 만족하는 $\\alpha$가 $0<x<\\pi$ 안에 두 개 있어도, 문제에서 구하는 것은 $\\alpha$ 자체가 아니라 $\\sin\\alpha$이므로 값은 같습니다.<br>$\\beta\\sin\\alpha=6\\times\\frac34=\\frac{18}4=\\frac92$이므로 정답은 ①입니다."
  },
  {
    "id": 19,
    "questionType": "객관식",
    "content": "실수 $a$와 2 이상의 자연수 $n$에 대하여 $a$의 $n$제곱근 중 실수인 것의 개수를 $f(a, n)$이라 하자. $$f(9, 2) + f(8, 3) + f(7, 4) + \\dots + f(11-m, m) = 17$$ 이 되도록 하는 자연수 $m$의 최댓값은? [4.8점]",
    "choices": [
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "answer": "③",
    "solution": "실수인 $n$제곱근의 개수는 <strong>지수 $n$의 홀짝과 밑수 $a$의 부호</strong>에 따라 달라집니다.<br>① $n$이 홀수이면 $a$가 양수·$0$·음수 어느 경우든 실근이 $1$개입니다.<br>② $n$이 짝수이면 $a>0$일 때 $2$개, $a=0$일 때 $1$개, $a<0$일 때 $0$개입니다.<br>\n주어진 합의 각 항은 $n=2,3,\\ldots,m$에 대해 $f(11-n,n)$입니다. 즉 $a=11-n$으로 바뀌므로 $n=10,11,12$에서 부호가 바뀌는 점이 중요합니다.<br>\n<strong>① $2\\le n\\le10$</strong><br>이때 $11-n>0$입니다. 짝수 $n=2,4,6,8,10$은 각 $2$개이므로 $5\\times2=10$개, 홀수 $n=3,5,7,9$는 각 $1$개이므로 $4\\times1=4$개입니다. 누계는 $10+4=14$개입니다.<br>\n<strong>② $n=11$</strong><br>$11-11=0$이므로 $f(0,11)=1$입니다. 누계는 $14+1=15$개입니다.<br>\n<strong>③ $n\\ge12$</strong><br>$11-n<0$이므로 짝수 지수의 항은 $0$, 홀수 지수의 항은 $1$씩 더합니다.<br>$n=12:\\ 15+0=15$<br>$n=13:\\ 15+1=16$<br>$n=14:\\ 16+0=16$<br>$n=15:\\ 16+1=17$<br>$n=16:\\ 17+0=17$<br>$n=17:\\ 17+1=18$입니다.<br>\n합은 항을 더할수록 감소하지 않으므로, $17$이 되는 마지막 값은 $m=16$입니다. 따라서 정답은 ③입니다."
  },
  {
    "id": 20,
    "questionType": "객관식",
    "content": "아래 그림과 같이 두 함수 $y=\\left(\\frac{1}{2}\\right)^x$, $y=\\log_{\\frac{1}{2}}x$의 그래프의 교점을 $A(x_1, y_1)$라 하고, 그림에서 $y=\\log_{\\frac12}x$와 $y=\\log_2(x-1)$의 교점을 $B(x_2,y_2)$, $y=\\left(\\frac12\\right)^x$와 $y=\\log_2(x-1)$의 교점을 $C(x_3,y_3)$라 하자. <보기>에서 옳은 것만을 있는 대로 고른 것은?<br><br><보기><br>ㄱ. $x_1 y_3 > (x_3 - 1)y_1$<br>ㄴ. $\\frac{3}{2} < x_2 < 2$<br>ㄷ. $x_3 - y_3 < 2$<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q20.png\" class=\"exam-img\"> [4.9점]",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "먼저 그림의 교점이 어떤 두 그래프의 교점인지 구분합니다. $B$는 두 로그함수의 교점이고, $C$는 지수함수와 $y=\\log_2(x-1)$의 교점입니다.<br><br>ㄱ. $A$는 $y=2^{-x}$와 $y=\\log_{1/2}x$의 교점입니다. $A$에서는 $y_1=2^{-x_1}=\\log_{1/2}x_1$입니다. 로그의 진수 조건으로 $x_1>0$이고 $2^{-x_1}>0$이므로 $\\log_{1/2}x_1>0$, 즉 $x_1<1$입니다. 따라서 $0<x_1<1$이고 $\\frac12<y_1=2^{-x_1}<1$입니다.<br>$C$에서 $2^{-x}=\\log_2(x-1)$입니다. $x=2$에서는 $2^{-2}=\\frac14>0=\\log_2(2-1)$이고, 왼쪽은 감소·오른쪽은 증가하므로 교점의 $x$좌표는 $x_3>2$입니다. 따라서 $x_3-1>1$이고, $y_3=2^{-x_3}<2^{-2}=\\frac14$입니다.<br>따라서 $x_1y_3<1\\cdot\\frac14=\\frac14$이지만 $(x_3-1)y_1>1\\cdot\\frac12=\\frac12$입니다. ㄱ은 거짓입니다.<br><br>ㄴ. $B$에서는 $\\log_{1/2}x_2=\\log_2(x_2-1)$입니다. $\\log_{1/2}x=-\\log_2x$이므로<br>$-\\log_2x_2=\\log_2(x_2-1)$<br>$\\Rightarrow \\log_2\\{x_2(x_2-1)\\}=0$<br>$\\Rightarrow x_2^2-x_2-1=0$<br>$\\Rightarrow x_2=\\frac{1+\\sqrt5}{2}$. ($x_2>1$이므로 음의 근은 제외합니다.)<br>$2<\\sqrt5<3$이므로 $\\frac32<x_2<2$입니다. ㄴ은 참입니다.<br><br>ㄷ. $C$에서는 $2^{-x_3}=\\log_2(x_3-1)=y_3$입니다. $x=2$에서 지수함수 값 $\\frac14$가 로그함수 값 $0$보다 큽니다.<br>$x=\\frac{11}{5}$에서는 $2^{-11/5}<\\frac14<\\log_2\\frac65$입니다. 뒤의 부등식은 $(\\frac65)^4>2$에서 확인됩니다.<br>지수함수는 감소하고 로그함수는 증가하므로 $2<x_3<\\frac{11}{5}$입니다.<br>또 $2^{11}<5^5$이므로 $2^{-11/5}>\\frac15$입니다. 따라서<br>$x_3-2<\\frac15<2^{-11/5}<2^{-x_3}=y_3$<br>$\\Rightarrow x_3-y_3<2$. ㄷ은 참입니다.<br><br>그러므로 옳은 것은 ㄴ, ㄷ이고 정답은 ④입니다."
,
    "sourceMode": "AUDITED_REPAIR",
    "provenance": {
        "originalSource": "2021_제일고2_수1_1중간.pdf p5 q20",
        "originalSourceSha256": "0a1a8d34795fcfb2493fa1e98b2e082941b16d0ce70e965d2b21fbd33e78bc50",
        "originalTextIssue": "원문은 두 함수와 세 번째 함수의 교점을 각각 B,C라 쓰지만, 실제 그림에서 B는 두 로그함수의 교점, C는 지수함수와 증가 로그함수의 교점으로 표시됨.",
        "before": "원문은 각각 B,C의 교점 쌍을 함수명으로 명시하지 않음",
        "after": "B=log_(1/2)(x)∩log_2(x−1); C=(1/2)^x∩log_2(x−1)로 기존 R1 학생용 발문에서 명시",
        "repairReason": "원본 그림의 교점 위치와 실제 함수 관계를 보존하면서 학생의 B/C 혼동을 없앤 편집상 명료화",
        "changedFieldsAtOriginalRepair": [
            "content",
            "solution"
        ],
        "originalRepairStage": "R1",
        "masterAction": "2026-10-17 sourceMode 및 변경 전후 출처 이력 명시만 추가",
        "masterChangedFields": [
            "sourceMode",
            "provenance"
        ],
        "sourceFidelity": "AUDITED_EDITORIAL_CLARIFICATION_NOT_VERBATIM",
        "originalPNG": "q20.png preserved"
    }
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "[서술형 1] 방정식 $9^x - 2 \\times 3^{x+1} + a + 5 = 0$이 서로 다른 두 실근을 갖도록 하는 정수 $a$의 개수를 구하시오. [4.0점]",
    "choices": [],
    "answer": "8개",
    "solution": "지수방정식의 서로 다른 두 실근 $x$를 세기 위해 $t=3^x$로 치환합니다. $3^x$는 모든 실수 $x$에서 양수이고, 서로 다른 $x$는 서로 다른 양수 $t$에 대응합니다. 따라서 <strong>$t$에 대한 서로 다른 두 양의 근</strong>을 구하면 됩니다.<br>\n$9^x=(3^x)^2=t^2$, $2\\cdot3^{x+1}=2\\cdot3\\cdot3^x=6t$이므로<br>$9^x-2\\cdot3^{x+1}+a+5=0$<br>$\\iff t^2-6t+(a+5)=0$입니다.<br>\n이 이차방정식이 서로 다른 두 양의 실근 $t_1,t_2$를 가지려면 다음 조건을 모두 만족해야 합니다.<br>\n① 서로 다른 실근: $D=(-6)^2-4(a+5)=16-4a>0\\iff a<4$.<br>② 두 근이 양수: 근과 계수의 관계에서 $t_1+t_2=6>0$, $t_1t_2=a+5>0\\iff a>-5$입니다. 두 실근의 합과 곱이 모두 양수이면 두 근은 모두 양수입니다.<br>\n따라서 $-5<a<4$이고, 정수 $a$는 $-4,-3,-2,-1,0,1,2,3$입니다.<br>각 값에서 서로 다른 양의 $t$가 두 개이므로 서로 다른 실수 $x$도 두 개씩 존재합니다. 구하는 정수 $a$의 개수는 $8$개입니다."
  },
  {
    "id": 22,
    "questionType": "서술형",
    "content": "[서술형 2] $\\sin\\left(-\\frac{\\pi}{3}\\right)\\cos\\left(-\\frac{5}{4}\\pi\\right)\\tan\\left(-\\frac{\\pi}{6}\\right)$의 값을 구하시오. [4.0점]",
    "choices": [],
    "answer": "$-\\frac{\\sqrt2}{4}$",
    "solution": "$\\sin\\left(-\\frac\\pi3\\right)=-\\frac{\\sqrt3}2$, $\\cos\\left(-\\frac{5\\pi}4\\right)=\\cos\\frac{5\\pi}4=-\\frac{\\sqrt2}2$, $\\tan\\left(-\\frac\\pi6\\right)=-\\frac1{\\sqrt3}$입니다.<br>따라서 곱은 $\\left(-\\frac{\\sqrt3}2\\right)\\left(-\\frac{\\sqrt2}2\\right)\\left(-\\frac1{\\sqrt3}\\right)=-\\frac{\\sqrt2}4$입니다."
  },
  {
    "id": 23,
    "questionType": "서술형",
    "content": "[서술형 3] 함수 $y=a\\cos b(x-c)+d$의 그래프가 그림과 같을 때, 상수 $a, b, c, d$에 대하여 $abcd$의 값을 구하는 풀이 과정과 답을 쓰시오. (단, $a>0, b>0, 0<c<\\pi$)<br><br><img src=\"assets/images/21_제일고_1학기_중간_고2_수학I/q23.png\" class=\"exam-img\"> [6.0점]",
    "choices": [],
    "answer": "$\\pi$",
    "solution": "그래프에서 먼저 <strong>세로 방향 정보</strong>로 $a,d$를 구하고, 다음으로 <strong>가로 방향 정보</strong>로 $b,c$를 구합니다.<br>\n① 최댓값이 $3$, 최솟값이 $-1$이므로 중심선은 두 값의 평균입니다.<br>$d=\\frac{3+(-1)}2=1$입니다.<br>진폭은 두 값의 차의 절반이므로 $|a|=\\frac{3-(-1)}2=2$입니다. 조건 $a>0$에서 $a=2$입니다.<br>\n② 그래프의 이웃한 두 최댓값 위치는 $x=\\frac{5\\pi}8$, $x=\\frac{25\\pi}8$입니다. 같은 모양이 반복되는 가로 간격이 주기이므로<br>$T=\\frac{25\\pi}8-\\frac{5\\pi}8=\\frac{20\\pi}8=\\frac{5\\pi}2$입니다.<br>코사인함수 $\\cos b(x-c)$의 주기는 $\\frac{2\\pi}b$ ($b>0$)이므로<br>$\\frac{2\\pi}b=\\frac{5\\pi}2\\Rightarrow b=\\frac{2\\pi}{5\\pi/2}=\\frac45$입니다.<br>\n③ $a>0$일 때 $x=c$에서는 $\\cos0=1$이 되어 최댓값을 갖습니다. 그래프의 최댓값 위치 중 $0<c<\\pi$에 들어가는 것은 $\\frac{5\\pi}8$이므로 $c=\\frac{5\\pi}8$입니다.<br>\n마지막으로 $abcd=2\\times\\frac45\\times\\frac{5\\pi}8\\times1=\\frac{8}{5}\\times\\frac{5\\pi}8=\\pi$입니다."
  },
  {
    "id": 24,
    "questionType": "서술형",
    "content": "[서술형 4] 어떤 방사성 원소는 50년마다 그 양이 반으로 줄어든다고 한다. 이 방사성 원소의 처음 양이 $M_0$일 때, $t$년 후에 남아 있는 양을 $M$이라 하면 다음과 같은 관계식이 성립한다.<br>$$M = M_0 \\times a^{\\frac{t}{2}} \\text{ (단, $a$는 양의 상수)}$$<br>이 때, 다음 물음에 답하시오.<br> 상수 $a$의 값을 구하시오.<br> 이 방사성 원소의 양이 처음의 양의 $\\frac{1}{32}$ 이하가 되는 것은 몇 년 후부터인지 구하시오. [6.0점]",
    "choices": [],
    "answer": "(1) $2^{-1/25}$, (2) 250년 후부터",
    "solution": "<strong>(1) 상수 $a$ 구하기</strong><br>50년마다 양이 반으로 줄어드므로 $t=50$일 때 $M=\\frac{M_0}2$입니다. 문제의 지수는 $\\frac t2$이므로 $50$을 대입하면 $25$가 됩니다.<br>$\\frac{M_0}2=M_0\\,a^{50/2}=M_0a^{25}$입니다.<br>처음 양 $M_0>0$을 양변에서 약분하면 $a^{25}=\\frac12$입니다.<br>$a>0$이므로 $a=\\left(\\frac12\\right)^{1/25}=2^{-1/25}$입니다.<br>\n<strong>(2) 처음 양의 $\\frac1{32}$ 이하가 되는 시각</strong><br>먼저 $\\frac1{32}=\\left(\\frac12\\right)^5=2^{-5}$이므로 50년마다 반으로 줄어드는 과정이 5번 반복되면 된다는 것을 예상할 수 있습니다.<br>이를 식으로 확인합니다. $M\\le\\frac{M_0}{32}$는<br>$M_0\\,a^{t/2}\\le\\frac{M_0}{32}\\iff a^{t/2}\\le2^{-5}$입니다.<br>구한 $a=2^{-1/25}$를 대입하면<br>$\\left(2^{-1/25}\\right)^{t/2}\\le2^{-5}$<br>$\\iff2^{-t/50}\\le2^{-5}$입니다.<br>밑 $2>1$이므로 지수끼리 비교하여 $-\\frac t{50}\\le-5$이고, 양변에 음수 $-50$을 곱할 때 부등호 방향이 바뀌므로 $t\\ge250$입니다.<br>즉 $50\\times5=250$년 후부터 처음 양의 $\\frac1{32}$ 이하가 됩니다."
  }
];
