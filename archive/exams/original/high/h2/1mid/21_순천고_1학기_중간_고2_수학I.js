window.examTitle = "21_순천고_1학기_중간_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "다음 중 옳은 것은? [3.4점]",
    "choices": [
      "$-\\sqrt[4]{81}=\\pm 3$",
      "$\\sqrt[5]{-32}=-2$",
      "$-\\sqrt[3]{-27}=-3$",
      "$\\sqrt[6]{64}=\\pm 2$",
      "$\\sqrt{-16}=-4$"
    ],
    "answer": "②",
    "solution": "짝수 제곱근은 양의 실수인 주값을 뜻하고, 홀수 제곱근은 음수도 가질 수 있습니다.\n① $\\sqrt[4]{81}=3$이므로 $-\\sqrt[4]{81}=-3$입니다. $\\pm3$이 아닙니다.\n② $(-2)^5=-32$이므로 $\\sqrt[5]{-32}=-2$입니다.\n③ $\\sqrt[3]{-27}=-3$이므로 $-\\sqrt[3]{-27}=3$입니다.\n④ $\\sqrt[6]{64}=2$로 한 값이며 $\\pm2$가 아닙니다.\n⑤ $\\sqrt{-16}$은 실수 범위에서 정의되지 않습니다.\n따라서 옳은 것은 ②입니다."
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "다음 중 옳지 않은 것은? [3.6점]",
    "choices": [
      "$\\sqrt{-2}\\times \\sqrt{-3}=-\\sqrt{6}$",
      "$\\sqrt[3]{\\sqrt{5^6}}=5$",
      "$\\sqrt[3]{-4}\\times \\sqrt[3]{-2}=2$",
      "$\\sqrt{(-3)^{3\\times 2}}=\\{\\sqrt{(-3)^3}\\}^2$",
      "$\\sqrt[3]{8}\\times \\sqrt[3]{9}-\\sqrt{\\sqrt[3]{81}}=3^{\\frac{2}{3}}$"
    ],
    "answer": "④",
    "solution": "① $\\sqrt{-2}\\sqrt{-3}=(i\\sqrt2)(i\\sqrt3)=-\\sqrt6$입니다(복소수 범위).\n② $\\sqrt{5^6}=5^3=125$, $\\sqrt[3]{125}=5$입니다.\n③ $\\sqrt[3]{-4}\\sqrt[3]{-2}=\\sqrt[3]{8}=2$입니다.\n④ 좌변은 $\\sqrt{(-3)^6}=\\sqrt{729}=27$입니다. 반면 우변은 $\\bigl(\\sqrt{(-3)^3}\\bigr)^2=-27$로 복소수 범위에서도 다릅니다. 실수 범위라면 우변 자체가 정의되지 않습니다.\n⑤ $\\sqrt[3]{8}\\sqrt[3]{9}-\\sqrt{\\sqrt[3]{81}}=2\\cdot3^{2/3}-3^{2/3}=3^{2/3}$입니다.\n따라서 옳지 않은 것은 ④입니다."
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "다음 중 옳지 않은 것은? [3.5점]",
    "choices": [
      "$\\log_5 125=3$",
      "$\\log_{\\frac{1}{2}} 16=-4$",
      "$\\log_2 \\frac{1}{64}=-6$",
      "$\\log_4 2\\times \\log_4 32=3$",
      "$\\log_6 3+\\log_6 2=1$"
    ],
    "answer": "④",
    "solution": "① $5^3=125$이므로 $\\log_5 125=3$입니다.\n② $(\\tfrac12)^{-4}=16$이므로 $\\log_{1/2}16=-4$입니다.\n③ $2^{-6}=\\tfrac1{64}$이므로 $\\log_2\\tfrac1{64}=-6$입니다.\n④ $\\log_4 2=\\tfrac12$, $\\log_4 32=\\tfrac52$이므로 곱은 $\\tfrac12\\cdot\\tfrac52=\\tfrac54\\ne3$입니다.\n⑤ $\\log_6 3+\\log_6 2=\\log_6(3\\cdot2)=\\log_6 6=1$입니다.\n따라서 ④가 옳지 않습니다."
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "다음 중 옳은 설명만을 <보기>에서 있는 대로 고른 것은?\n\n<보기>\nㄱ. 정의역이 $\\{x|-2\\le x\\le -1\\}$인 함수 $y=\\left(\\frac{1}{4}\\right)^{x+1}+1$의 최댓값은 2이다.\nㄴ. 함수 $y=\\log_a (x-2)+2\\,(a>0, a\\ne 1)$은 $a$의 값에 상관없이 항상 $(3, 2)$를 지난다.\nㄷ. 정의역이 $\\{x|-9\\le x\\le 90\\}$인 함수 $y=\\log(x+10)-4$의 최솟값은 $-4$이다.\nㄹ. 함수 $y=\\log x^2$의 그래프와 함수 $y=2\\log x$의 그래프는 서로 같다. [4.4점]",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "②",
    "solution": "ㄱ. 밑 $\\tfrac14$는 $0$과 $1$ 사이이므로 지수함수는 감소합니다. $-2\\le x\\le-1$에서 $x=-2$일 때 $y=(\\tfrac14)^{-1}+1=5$로 최대입니다. 따라서 '최댓값 2'는 거짓입니다.\nㄴ. $x=3$이면 $x-2=1$이므로 $y=\\log_a1+2=0+2=2$입니다. 밑의 조건을 만족하는 모든 $a$에 대해 참입니다.\nㄷ. $x+10$은 $1$부터 $100$까지이므로 $\\log(x+10)$은 $0$ 이상입니다. $x=-9$에서 $y=\\log1-4=-4$로 최소입니다.\nㄹ. $\\log x^2$는 $x\\ne0$에서 정의되지만 $2\\log x$는 $x>0$에서만 정의됩니다. 정의역이 달라 두 그래프는 같지 않습니다.\n참인 것은 ㄴ, ㄷ이므로 ②입니다."
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "함수 $f$가 $f(x)=\\log_2 x$일 때, 다음 중 항상 참인 것은? [4.3점]",
    "choices": [
      "$f(1)=1$",
      "$f(x+y)=f(x)\\times f(y)$",
      "$f(xy)=f(x)+f(y)$",
      "$f\\left(\\frac{1}{x}\\right)=\\frac{1}{f(x)}$ (단, $f(x)\\ne 0$)",
      "$f(x^n)=\\{f(x)\\}^n$"
    ],
    "answer": "③",
    "solution": "$f(x)=\\log_2x$의 정의역은 $x>0$입니다.\n① $f(1)=\\log_2 1=0$이므로 거짓입니다.\n② 로그에는 덧셈을 곱으로 바꾸는 법칙이 없습니다. 예를 들어 $x=y=2$이면 $f(4)=2$이지만 $f(2)f(2)=1$입니다.\n③ $x,y>0$일 때 $f(xy)=\\log_2(xy)=\\log_2x+\\log_2y=f(x)+f(y)$로 항상 참입니다.\n④ $f(1/x)=-f(x)$이지 $1/f(x)$가 아닙니다.\n⑤ $f(x^n)=n f(x)$이지 $f(x)^n$이 아닙니다(정의되는 범위).\n따라서 ③입니다."
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "물질의 산성 또는 염기성의 정도를 나타내는 $\\mathrm{pH}$는 수소 이온 농도를 $[\\mathrm{H}^+]$라고 할 때, $\\mathrm{pH}=-\\log[\\mathrm{H}^+]$로 정의한다. 올해 한 도시의 빗물의 평균 $\\mathrm{pH}$가 $4.7$이라고 하자. $10$년 후 이 도시의 빗물의 평균 수소 이온 농도가 올해 빗물의 평균 수소 이온 농도의 절반이라면 이때의 $\\mathrm{pH}$는? (단, $\\log 2=0.3$으로 계산한다.) [4.2점]",
    "choices": [
      "5.0",
      "5.2",
      "5.4",
      "5.6",
      "5.8"
    ],
    "answer": "①",
    "solution": "올해의 수소 이온 농도를 $H$라 하면 $4.7=-\\log H$입니다.\n10년 뒤 농도는 $H/2$이므로\n$\\mathrm{pH}_{10}=-\\log(H/2)=-\\log H+\\log2$입니다.\n$=4.7+0.3=5.0$입니다.\n농도가 절반으로 감소하면 pH는 $0.3$만큼 증가하므로 ①입니다."
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "다음 각이 나타내는 동경의 위치가 다른 것은? [3.5점]",
    "choices": [
      "$-690^\\circ$",
      "$750^\\circ$",
      "$330^\\circ$",
      "$\\frac{13}{6}\\pi$",
      "$-\\frac{11}{6}\\pi$"
    ],
    "answer": "③",
    "solution": "동경의 위치는 $360^\\circ$의 정수배를 더하거나 빼도 같습니다.\n① $-690^\\circ+720^\\circ=30^\\circ$입니다.\n② $750^\\circ-720^\\circ=30^\\circ$입니다.\n③ $330^\\circ$는 그대로 $330^\\circ$입니다.\n④ $\\frac{13\\pi}{6}=390^\\circ$, $390^\\circ-360^\\circ=30^\\circ$입니다.\n⑤ $-\\frac{11\\pi}{6}=-330^\\circ$, $-330^\\circ+360^\\circ=30^\\circ$입니다.\n다른 위치는 ③입니다."
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "$\\sin\\theta+\\cos\\theta=\\frac{1}{2}$일 때, $\\sin^3\\theta-\\cos^3\\theta$의 값이 $\\frac{a\\sqrt{b}}{16}$이다. 정수 $a, b$에 대하여 $a+b$의 값은? (단, $\\frac{3}{2}\\pi < \\theta < 2\\pi$) [4.5점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "①",
    "solution": "$s=\\sin\\theta$, $c=\\cos\\theta$라 두면 $s+c=\\tfrac12$입니다.\n$(s+c)^2=s^2+c^2+2sc$에서 $\\tfrac14=1+2sc$, 따라서 $sc=-\\tfrac38$입니다.\n$(s-c)^2=s^2+c^2-2sc=1+\\tfrac34=\\tfrac74$입니다.\n$\\frac{3\\pi}{2}<\\theta<2\\pi$이므로 $s<0<c$이고 $s-c=-\\tfrac{\\sqrt7}{2}$입니다.\n$s^3-c^3=(s-c)(s^2+sc+c^2)=(s-c)(1+sc)$\n$=-\\tfrac{\\sqrt7}{2}(1-\\tfrac38)=-\\tfrac{5\\sqrt7}{16}$입니다.\n따라서 $a=-5$, $b=7$, $a+b=2$이므로 ①입니다."
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "식 $\\sin(\\pi-\\theta)\\cos\\left(\\frac{3}{2}\\pi-\\theta\\right)+\\cos(\\pi+\\theta)\\sin\\left(\\frac{1}{2}\\pi-\\theta\\right)$를 간단히 한 것은? [4.2점]",
    "choices": [
      "2",
      "1",
      "0",
      "-1",
      "-2"
    ],
    "answer": "④",
    "solution": "삼각함수의 각 변환을 하나씩 적용합니다.\n$\\sin(\\pi-\\theta)=\\sin\\theta$,\n$\\cos(\\tfrac{3\\pi}{2}-\\theta)=-\\sin\\theta$,\n$\\cos(\\pi+\\theta)=-\\cos\\theta$,\n$\\sin(\\tfrac\\pi2-\\theta)=\\cos\\theta$입니다.\n따라서 원래 식은\n$\\sin\\theta(-\\sin\\theta)+(-\\cos\\theta)\\cos\\theta$\n$=-\\sin^2\\theta-\\cos^2\\theta=-1$입니다.\n정답은 ④입니다."
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "$0\\le x < 2\\pi$일 때, 방정식 $\\sin 2x = \\frac{3}{4}$의 모든 실근의 합은? [4.3점]",
    "choices": [
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$",
      "$4\\pi$",
      "$5\\pi$"
    ],
    "answer": "③",
    "solution": "$t=2x$라 두면 $0\\le t<4\\pi$이고 $\\sin t=\\tfrac34$입니다.\n$0<\\alpha<\\tfrac\\pi2$, $\\sin\\alpha=\\tfrac34$라 하면 한 주기의 해는 $t=\\alpha,\\pi-\\alpha$입니다.\n두 주기에 걸친 네 해는 $\\alpha,\\pi-\\alpha,2\\pi+\\alpha,3\\pi-\\alpha$입니다.\n$t$의 합은 $6\\pi$이므로 $x$의 합은 $\\tfrac{6\\pi}{2}=3\\pi$입니다.\n정답은 ③입니다."
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "$x>a$일 때, $\\sqrt[n]{x^m}=x^{\\frac{m}{n}}$이 성립한다. 실수 $a$의 값으로 적절하지 않은 것은? (단, $m$은 정수, $n$은 $n\\ge 2$인 정수) [4.1점]",
    "choices": [
      "-1",
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "①",
    "solution": "$\\sqrt[n]{x^m}=x^{m/n}$을 모든 정수 $m$과 $n\\ge2$에 대해 실수로 정의하려면 $x>0$이어야 합니다.\n$x>0$에서는 실수 지수의 성질에 따라 두 식이 같습니다.\n$a=0$이면 $x>a$가 바로 $x>0$이므로 성립하고, $a=1,2,3$도 성립합니다.\n그러나 $a=-1$이면 $x=-\\tfrac12$도 $x>a$를 만족합니다. 이때 $m=1,n=2$를 택하면 $\\sqrt{x}$는 실수가 아닙니다.\n따라서 적절하지 않은 것은 ①입니다."
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "로그방정식 $\\log_4(2x^2-8)=\\log_2(x+a)$가 오직 하나의 실근을 갖기 위한 실수 $a$의 값의 범위는? [4.9점]",
    "choices": [
      "$a < -2$",
      "$a > 2$",
      "$-2 \\le a < 2$",
      "$-2 < a < 2$",
      "$-2 < a \\le 2$"
    ],
    "answer": "⑤",
    "solution": "로그의 진수 조건은 $2x^2-8>0$, $x+a>0$입니다.\n$\\log_4(2x^2-8)=\\log_2(x+a)$에서\n$\\tfrac12\\log_2(2x^2-8)=\\log_2(x+a)$이므로\n$\\sqrt{2x^2-8}=x+a$입니다.\n양변을 제곱하면 $2x^2-8=(x+a)^2$, 즉 $x^2-2ax-a^2-8=0$입니다.\n따라서 후보는 $x=a\\pm\\sqrt{2a^2+8}$입니다.\n$+$ 후보의 $x+a=2a+\\sqrt{2a^2+8}>0$ 조건은 $a>-2$일 때 성립합니다.\n$-$ 후보의 $x+a=2a-\\sqrt{2a^2+8}>0$ 조건은 $a>2$일 때만 성립합니다.\n$a=-2$ 또는 $a=2$의 경계에서 해당 후보는 $x+a=0$이므로 제외합니다.\n따라서 실근이 정확히 하나인 범위는 $-2<a\\le2$이고, 정답은 ⑤입니다."
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "$a$는 $12$의 거듭제곱이고, $b$는 $36$의 거듭제곱근 중 양의 실수이다. $ab^2=64c$를 만족시키는 자연수 $c$가 $3$의 $n$제곱일 때, 자연수 $n$의 값은? [4.7점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "③",
    "solution": "거듭제곱의 지수를 자연수 $r$이라 두어 $a=12^r$로 나타냅니다. $b$는 $36$의 양의 거듭제곱근이므로 어떤 자연수 $s\\ge2$에 대하여 $b=\\sqrt[s]{36}=36^{1/s}$입니다. 또한 $c=3^n$입니다.\n$12=2^2\\cdot3$, $36=2^2\\cdot3^2$, $64=2^6$이므로\n$ab^2=(12^r)(36^{1/s})^2=2^{2r}3^r\\cdot2^{4/s}3^{4/s}=2^{2r+4/s}3^{r+4/s}=2^6\\cdot3^n$입니다.\n양변을 알맞게 거듭제곱하여 소인수분해를 비교하면 $2r+\\frac4s=6$, $r+\\frac4s=n$을 얻습니다.\n첫째 식에서 $2rs+4=6s$, 즉 $(3-r)s=2$입니다. $r$은 자연수이고 $s\\ge2$이므로 $3-r=1$, $s=2$, $r=2$입니다.\n따라서 $n=r+\\frac4s=2+\\frac42=4$이므로 정답은 ③입니다."
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "좌표평면 위의 곡선 $y=2^x-3$과 함수 $y=-\\log(x-3)+1$의 점근선 그리고 $x$축으로 둘러싸인 영역(경계포함)에 속하는 점 중 $x$좌표와 $y$좌표가 모두 정수인 점의 개수는? [4.6점]",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "②",
    "solution": "$y=2^x-3$은 $x=\\log_2 3$에서 $x$축과 만납니다.\n$y=-\\log(x-3)+1$의 수직점근선은 $x=3$입니다. 이 점근선과 $x$축, 곡선 $y=2^x-3$이 만드는 닫힌 영역을 셉니다.\n$\\log_2 3\\approx1.585$이므로 정수 $x$는 $2$ 또는 $3$입니다.\n$x=2$일 때 $0\\le y\\le2^2-3=1$이므로 정수 $y=0,1$의 2개입니다.\n$x=3$일 때 $0\\le y\\le2^3-3=5$이므로 정수 $y=0,1,2,3,4,5$의 6개입니다.\n합하면 $2+6=8$개이므로 ②입니다."
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "방정식 $9^x-2\\times 3^{x+1}+k+10=0$이 서로 다른 두 실근을 갖도록 하는 정수 $k$의 개수는? [4.7점]",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "①",
    "solution": "$t=3^x$로 놓으면 실수 $x$에 대해 $t>0$이고, $9^x=t^2$, $2\\times3^{x+1}=6t$입니다.\n$t^2-6t+k+10=0$, 즉 $(t-3)^2=-k-1$이므로\n$t=3\\pm\\sqrt{-k-1}$입니다.\n서로 다른 두 실근 $x$가 있으려면 서로 다른 두 양의 $t$가 있어야 합니다.\n따라서 $0<\\sqrt{-k-1}<3$이고, 이를 제곱하면 $0<-k-1<9$입니다.\n즉 $-10<k<-1$이므로 정수 $k$는 $-9,-8,-7,-6,-5,-4,-3,-2$의 8개입니다. 정답은 ①입니다."
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "둘레의 길이가 $10$인 부채꼴 중에서 그 넓이가 최대인 것의 중심각의 크기는? [3.4점]",
    "choices": [
      "$\\frac{1}{2}$",
      "1",
      "$\\frac{3}{2}$",
      "2",
      "$\\frac{5}{2}$"
    ],
    "answer": "④",
    "solution": "부채꼴의 반지름을 $r>0$, 중심각을 $\\theta$라디안이라 하면 호의 길이는 $r\\theta$입니다.\n둘레가 $10$이므로 $2r+r\\theta=10$, 따라서 $\\theta=\\tfrac{10}{r}-2$입니다.\n넓이 $S=\\tfrac12r^2\\theta=\\tfrac12r^2(\\tfrac{10}{r}-2)=5r-r^2$입니다.\n완전제곱식을 만들면 $S=-(r-\\tfrac52)^2+\\tfrac{25}{4}$이므로 $r=\\tfrac52$일 때 최대입니다.\n이때 $\\theta=\\tfrac{10}{5/2}-2=4-2=2$라디안입니다.\n정답은 ④입니다."
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "다음 그림은 함수 $f(x)=a\\cos bx+c$의 그래프이다. $a>0$일 때, $ac+b$의 최솟값은?\n\n<div class=\"exam-img-box\"><img src=\"assets/images/21_순천고_1학기_중간_고2_수학I/q17.png\" class=\"exam-img\"></div> [4.3점]",
    "choices": [
      "$\\frac{22}{3}$",
      "$\\frac{23}{3}$",
      "8",
      "$\\frac{25}{3}$",
      "$\\frac{26}{3}$"
    ],
    "answer": "②",
    "solution": "원본 그래프에서 최댓값은 $6$, 최솟값은 $2$입니다.\n$a>0$이므로 진폭 $a=\\tfrac{6-2}{2}=2$, 중심선 $c=\\tfrac{6+2}{2}=4$입니다.\n최대점 $x=0$에서 다음 최대점 $x=6\\pi$까지가 한 주기이므로 $T=6\\pi$입니다.\n$T=\\tfrac{2\\pi}{|b|}$에서 $|b|=\\tfrac13$이고 $b=\\pm\\tfrac13$입니다.\n$ac+b=2\\cdot4+b=8+b$이므로 작은 값을 주는 $b=-\\tfrac13$을 택합니다.\n최솟값은 $8-\\tfrac13=\\tfrac{23}{3}$이므로 ②입니다."
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "좌표평면 위에 중심이 원점 $\\mathrm{O}$이고 반지름의 길이가 $2$인 원이 있다. 각 $\\theta$가 나타내는 동경과 원이 만나는 점의 좌표를 $\\mathrm{A}(a, b)$라 하자.\n$$\\tan\\left(\\frac{3}{2}\\pi+\\theta\\right)=\\frac{3}{4},\\ \\cos(-\\theta)>0$$\n일 때, $a-b$의 값은? [4.6점]",
    "choices": [
      "$-\\frac{2}{5}$",
      "$\\frac{2}{5}$",
      "$\\frac{6}{5}$",
      "2",
      "$\\frac{14}{5}$"
    ],
    "answer": "⑤",
    "solution": "$\\tan(\\tfrac{3\\pi}{2}+\\theta)=\\tan(\\tfrac\\pi2+\\theta)=-\\cot\\theta=\\tfrac34$입니다.\n따라서 $\\tan\\theta=-\\tfrac43$입니다.\n$\\cos(-\\theta)=\\cos\\theta>0$이고 탄젠트가 음수이므로 $\\theta$의 동경은 제4사분면입니다.\n$3:4:5$ 직각삼각형 비로 $\\cos\\theta=\\tfrac35$, $\\sin\\theta=-\\tfrac45$입니다.\n반지름이 $2$이므로 $a=2\\cos\\theta=\\tfrac65$, $b=2\\sin\\theta=-\\tfrac85$입니다.\n$a-b=\\tfrac65-(-\\tfrac85)=\\tfrac{14}{5}$이므로 ⑤입니다."
  },
  {
    "id": 19,
    "questionType": "객관식",
    "content": "<보기>에서 임의의 실수 $x$에 대하여\n$$f(x)=f(-x),\\ f(2+x)=f(2-x)$$\n를 만족시키는 함수만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. $f(x)=-\\cos\\left(\\frac{\\pi}{2}x-\\frac{\\pi}{2}\\right)$\nㄴ. $f(x)=2\\sin\\left(\\pi x+\\frac{3\\pi}{2}\\right)$\nㄷ. $f(x)=\\left|3\\tan\\left(\\pi x-\\frac{1}{2}\\pi\\right)\\right|$ [4.8점]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "조건은 임의의 실수 $x$에 대하여 두 등식이 성립해야 한다는 뜻이다. 먼저 $f(x)=f(-x)$는 짝함수 조건이고, $f(2+x)=f(2-x)$는 직선 $x=2$에 대한 대칭 조건이다.\n\nㄱ. $f(x)=-\\cos\\left(\\frac{\\pi}{2}x-\\frac{\\pi}{2}\\right)=-\\sin\\frac{\\pi x}{2}$이다.\n$f(-x)=\\sin\\frac{\\pi x}{2}$이므로 일반적으로 $f(-x)\\ne f(x)$이다. 따라서 ㄱ은 아니다.\n\nㄴ. $f(x)=2\\sin\\left(\\pi x+\\frac{3\\pi}{2}\\right)=-2\\cos\\pi x$이다.\n$f(-x)=-2\\cos(-\\pi x)=-2\\cos\\pi x=f(x)$이다.\n또한 $f(2+x)=-2\\cos(2\\pi+\\pi x)=-2\\cos\\pi x$,\n$f(2-x)=-2\\cos(2\\pi-\\pi x)=-2\\cos\\pi x$이므로 두 조건을 모두 만족한다.\n\nㄷ. $f(x)=\\left|3\\tan\\left(\\pi x-\\frac{\\pi}{2}\\right)\\right|$는 $x$가 정수이면 탄젠트가 정의되지 않는다. 따라서 임의의 실수 $x$ 전체에 대해 값을 갖는 함수로서 주어진 조건을 만족한다고 할 수 없다.\n\n그러므로 ㄴ만 옳아 정답은 ②이다."
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "<서술형 1>\n함수 $y=2\\cos\\left(\\frac{1}{2}x-\\pi\\right)+1$에 대한 다음 물음에 답하시오. 주기를 계산하시오. 주어진 함수의 평행이동을 설명하시오. 치역을 조건제시법으로 나타내시오. 주어진 함수의 그래프를 그리시오. [10.0점]",
    "choices": [],
    "answer": "주기 $4\\pi$, 오른쪽 $2\\pi$ 평행이동·위로 $1$ 평행이동, 치역 $\\{y\\mid-1\\le y\\le3\\}$",
    "solution": "주어진 함수는 $y=2\\cos(\\tfrac12x-\\pi)+1=2\\cos\\bigl(\\tfrac12(x-2\\pi)\\bigr)+1$입니다.\n(1) 코사인 함수 $y=\\cos t$의 주기는 $2\\pi$이고, $x$의 계수가 $\\tfrac12$이므로 주기는 $T=\\tfrac{2\\pi}{1/2}=4\\pi$입니다.\n(2) $y=2\\cos(\\tfrac12x)$의 그래프를 $x$축 방향으로 $2\\pi$만큼 오른쪽으로, $y$축 방향으로 $1$만큼 위로 평행이동한 그래프입니다.\n(3) $-1\\le\\cos t\\le1$이므로 $-2\\le2\\cos t\\le2$, 양변에 $1$을 더해 $-1\\le y\\le3$입니다. 따라서 치역은 $\\{y\\mid-1\\le y\\le3\\}$입니다.\n(4) $y=-2\\cos(\\tfrac x2)+1$로도 쓸 수 있으므로 $x=0,\\pi,2\\pi,3\\pi,4\\pi$에서 $y=-1,1,3,1,-1$입니다. 이 다섯 점을 매끄러운 코사인 곡선으로 잇고 $4\\pi$마다 반복합니다.",
    "solutionImage": "assets/images/21_순천고_1학기_중간_고2_수학I/q20-solution.svg",
    "level": "중",
    "category": "삼각함수의 그래프",
    "originalCategory": "삼각함수의 그래프",
    "standardCourse": "수학Ⅰ",
    "standardUnitKey": "H15-M1-06",
    "standardUnit": "삼각함수의 그래프",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "subUnit": "삼각함수의 그래프",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "solutionImageAlt": "함수 y=2cos(x/2-π)+1의 실제 x축(y=0), 최댓값 3, 최솟값 -1과 주기 4π를 나타낸 그래프",
    "solutionImageCaption": "x축은 y=0이며 x=0,π,2π,3π,4π에서의 함숫값은 차례로 -1,1,3,1,-1이다."
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "<서술형 2> 로그의 정의와 지수법칙을 이용하여 다음 (1)~(4)를 보이시오. (단, $a>0$, $a\\ne1$, $M>0$, $N>0$)\n(1) $\\log_a1=0$임을 보이시오.\n(2) $\\log_a a=1$임을 보이시오.\n(3) $\\log_a\\frac{M}{N}=\\log_aM-\\log_aN$임을 보이시오.\n(4) 로그의 밑의 변환을 이용하여 $\\log_{a^m}b^n=\\frac{n}{m}\\log_ab$임을 보이시오. (단, $a>0$, $a\\ne1$, $b>0$, $b\\ne1$, $m\\ne0$이고 $m,n$은 실수) [10.0점]",
    "choices": [],
    "answer": "① $0$, ② $1$, ③ $\\log_a(M/N)=\\log_aM-\\log_aN$, ④ $\\log_{a^m}b^n=\\frac nm\\log_ab$ ($m\\ne0$)",
    "solution": "(1) 로그의 정의에서 $a^t=1$인 지수 $t$를 찾습니다. $a^0=1$이므로 $\\log_a1=0$입니다.\n(2) $a^1=a$이므로 로그의 정의에 따라 $\\log_a a=1$입니다.\n(3) $u=\\log_aM$, $v=\\log_aN$이라 두면 $M=a^u$, $N=a^v$입니다.\n$\\frac{M}{N}=\\frac{a^u}{a^v}=a^{u-v}$이므로 $\\log_a\\frac{M}{N}=u-v=\\log_aM-\\log_aN$입니다.\n(4) $m\\ne0$이므로 $a^m>0$이고 $a^m\\ne1$이어서 밑 $a^m$의 로그가 정의됩니다.\n밑의 변환 공식을 적용하면\n$\\log_{a^m}b^n=\\frac{\\log_a b^n}{\\log_a a^m}=\\frac{n\\log_a b}{m}=\\frac nm\\log_a b$입니다.\n따라서 (1)~(4)의 등식이 주어진 조건에서 모두 성립합니다.",
    "level": "중",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그의 뜻과 성질",
    "standardCourse": "수학Ⅰ",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false
  }
];
