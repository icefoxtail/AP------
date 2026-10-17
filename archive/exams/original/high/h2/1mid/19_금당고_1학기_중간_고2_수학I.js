window.examTitle = "19_금당고_1학기_중간_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "$\\log_{\\sqrt{3}} \\sqrt{27} + 10^{\\log 3}$을 간단히 한 값은? [4.0점]",
    "choices": [
      "2",
      "3",
      "6",
      "8",
      "10"
    ],
    "answer": "③",
    "solution": "로그의 밑과 진수를 모두 $3$의 거듭제곱으로 나타낸다.\n$\\sqrt{3}=3^{1/2}$, $\\sqrt{27}=3^{3/2}$이므로\n$\\log_{\\sqrt{3}}\\sqrt{27}=\\log_{3^{1/2}}3^{3/2}=\\dfrac{3/2}{1/2}=3$이다.\n또한 상용로그의 정의에 따라 $10^{\\log 3}=3$이다.\n따라서 구하는 값은 $3+3=6$이고 정답은 ③이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "방정식 $5^{2x+4} = 125^{x+1}$의 해는? [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "양변의 밑을 $5$로 통일하면 지수를 비교할 수 있다.\n$125=5^3$이므로 $125^{x+1}=(5^3)^{x+1}=5^{3x+3}$이다.\n$5^{2x+4}=5^{3x+3}$에서 밑 $5$는 $1$이 아니므로\n$2x+4=3x+3$, 따라서 $x=1$이다. 정답은 ①이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "호의 길이가 $6\\pi$이고 넓이가 $18\\pi$인 부채꼴의 반지름의 길이는? [4.0점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "⑤",
    "solution": "부채꼴의 호의 길이를 $l$, 반지름을 $r$, 넓이를 $S$라 하면 $S=\\dfrac12rl$이다. 이는 $l=r\\theta$, $S=\\dfrac12r^2\\theta$에서 중심각 $\\theta$를 없앤 식이다.\n주어진 값을 대입하면\n$18\\pi=\\dfrac12\\times r\\times6\\pi=3\\pi r$이다.\n$3\\pi r=18\\pi$이므로 $r=6$이다. 정답은 ⑤이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "$\\log_{(a-2)} (-a^2+3a+10)$이 정의되기 위한 정수 $a$의 값은? [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "실수 범위에서 로그 $\\log_b M$이 정의되려면 밑은 $b>0$, $b\\ne1$이고 진수는 $M>0$이어야 한다.\n밑 조건 $a-2>0$, $a-2\\ne1$에서 $a>2$, $a\\ne3$이다.\n진수 조건은 $-a^2+3a+10>0$이다.\n$-(a-5)(a+2)>0\\iff(a-5)(a+2)<0\\iff-2<a<5$이다.\n두 조건을 합하면 $2<a<5$, $a\\ne3$이므로 가능한 정수는 $a=4$뿐이다. 정답은 ④이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "이차방정식 $x^2-4x+2=0$의 두 근이 $\\log a$, $\\log b$일 때, $\\log_a b + \\log_b a$의 값은? [4.0점]",
    "choices": [
      "-6",
      "-3",
      "0",
      "3",
      "6"
    ],
    "answer": "⑤",
    "solution": "$u=\\log a$, $v=\\log b$라 놓으면 근과 계수의 관계에서\n$u+v=4$, $uv=2$이다. $uv\\ne0$이므로 밑 $a,b$는 $1$이 아니어서 밑변환을 쓸 수 있다.\n$\\log_a b+\\log_b a=\\dfrac{\\log b}{\\log a}+\\dfrac{\\log a}{\\log b}=\\dfrac{v}{u}+\\dfrac{u}{v}$\n$=\\dfrac{u^2+v^2}{uv}=\\dfrac{(u+v)^2-2uv}{uv}$\n$=\\dfrac{4^2-2\\times2}{2}=\\dfrac{12}{2}=6$이다. 정답은 ⑤이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "$\\pi < \\theta < \\dfrac{3}{2}\\pi$이고, $\\tan\\theta + \\dfrac{1}{\\tan\\theta}=2$일 때, $\\sin\\theta + \\cos\\theta$의 값은? [4.0점]",
    "choices": [
      "-\\sqrt{3}",
      "-\\sqrt{2}",
      "-1",
      "-\\dfrac{\\sqrt{3}}{2}",
      "-\\dfrac{\\sqrt{2}}{2}"
    ],
    "answer": "②",
    "solution": "$t=\\tan\\theta$라 놓으면 $t\\ne0$이고 $t+\\dfrac1t=2$이다.\n양변에 $t$를 곱해 $t^2-2t+1=0$, 즉 $(t-1)^2=0$이므로 $\\tan\\theta=1$이다.\n$\\pi<\\theta<\\dfrac{3\\pi}{2}$이므로 $\\theta$는 제3사분면의 각이다. 이 사분면에서는 사인과 코사인이 모두 음수다.\n$\\tan\\theta=1$에서 기준각은 $\\dfrac\\pi4$이므로\n$\\sin\\theta=-\\dfrac{\\sqrt2}{2}$, $\\cos\\theta=-\\dfrac{\\sqrt2}{2}$이다.\n따라서 $\\sin\\theta+\\cos\\theta=-\\sqrt2$이므로 정답은 ②이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "$(\\sqrt{\\sqrt[3]{4}\\sqrt[4]{8}})^n$이 자연수가 되도록 하는 자연수 $n$의 최솟값은? [4.0점]",
    "choices": [
      "12",
      "18",
      "24",
      "30",
      "36"
    ],
    "answer": "③",
    "solution": "먼저 여러 겹의 근호를 같은 밑의 거듭제곱으로 바꾼다.\n$\\sqrt[3]{4}=\\sqrt[3]{2^2}=2^{2/3}$이고 $\\sqrt[4]{8}=\\sqrt[4]{2^3}=2^{3/4}$이다.\n두 수를 곱할 때에는 지수를 더하므로\n$\\sqrt[3]{4}\\sqrt[4]{8}=2^{2/3}\\cdot2^{3/4}$\n$=2^{8/12+9/12}=2^{17/12}$이다.\n이 곱 전체에 제곱근을 씌우면 지수가 다시 $\\dfrac12$배가 된다.\n$\\sqrt{\\sqrt[3]{4}\\sqrt[4]{8}}=(2^{17/12})^{1/2}=2^{17/24}$이다.\n따라서 문제의 식은\n$(2^{17/24})^n=2^{17n/24}$이다.\n밑이 소수 $2$인 이 거듭제곱이 자연수가 되려면 유리수 지수 $\\dfrac{17n}{24}$가 음이 아닌 정수여야 한다. 지수가 기약분수로 남으면 자연수의 거듭제곱으로 $2$의 정수 지수를 만들 수 없기 때문이다.\n즉 $24$가 $17n$을 나누어야 한다. $17$과 $24$는 서로소이므로 $n$은 $24$의 배수여야 한다.\n가장 작은 자연수 $n=24$를 대입하면 $2^{17\\times24/24}=2^{17}$로 실제 자연수가 된다.\n따라서 구하는 최솟값은 $\\boxed{24}$이고 정답은 ③이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "$-2 \\le x \\le 0$에서 함수 $y=4^{-x}-3\\times 2^{1-x}+a$의 최솟값이 4일 때, 최댓값은? [4.2점]",
    "choices": [
      "4",
      "8",
      "12",
      "16",
      "20"
    ],
    "answer": "②",
    "solution": "먼저 지수식에 공통으로 나타나는 $2^{-x}$를 한 문자로 치환한다.\n$4^{-x}=(2^{-x})^2$, $3\\times2^{1-x}=6\\times2^{-x}$이므로 $t=2^{-x}$로 놓으면\n$y=t^2-6t+a=(t-3)^2+a-9$이다.\n$x$가 $-2$에서 $0$까지 움직일 때 $2^{-x}$는 $4$에서 $1$까지 움직이므로 $1\\le t\\le4$이다.\n\n최솟값으로 $a$를 정한다.\n$(t-3)^2\\ge0$이고 $t=3$이 주어진 구간에 있으므로\n$y_{\\min}=a-9=4$에서 $a=13$이다.\n따라서 $y=(t-3)^2+4$이다.\n\n최댓값은 꼭짓점에서 가장 먼 끝점에서 나온다.\n$t=3$에서 멀어질수록 $(t-3)^2$이 커진다. 구간 끝점 $1,4$는 꼭짓점 $3$으로부터 각각 $2,1$만큼 떨어져 있다.\n$t=1$에서 $y=(1-3)^2+4=4+4=8$,\n$t=4$에서 $y=(4-3)^2+4=1+4=5$이다.\n따라서 최댓값은 $8$이고 정답은 ②이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "밑면의 반지름의 길이가 2인 원뿔이 있다. 이 원뿔의 옆면의 전개도인 부채꼴의 중심각의 크기가 $\\dfrac{\\pi}{5}$일 때, 원뿔의 모선의 길이는? [4.2점]<br><br><img src=\"assets/images/19_금당고_1학기_중간_고2_수학I/q09.png\" class=\"question-img\">",
    "choices": [
      "5",
      "10",
      "15",
      "20",
      "25"
    ],
    "answer": "④",
    "solution": "원뿔의 옆면을 펼친 부채꼴의 반지름은 원뿔의 모선 길이 $l$과 같다.\n부채꼴의 호의 길이는 원뿔 밑면의 둘레와 같으므로\n$2\\pi\\times2=4\\pi$이다.\n한편 중심각이 $\\dfrac\\pi5$인 부채꼴의 호의 길이는 $l\\times\\dfrac\\pi5$이다.\n따라서 $l\\times\\dfrac\\pi5=4\\pi$이고\n$l=4\\pi\\times\\dfrac5\\pi=20$이다. 정답은 ④이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "$\\log\\left(1-\\dfrac{1}{2}\\right)^2 + \\log\\left(1-\\dfrac{1}{3}\\right)^2 + \\log\\left(1-\\dfrac{1}{4}\\right)^2 + \\cdots + \\log\\left(1-\\dfrac{1}{100}\\right)^2$의 값은? [4.2점]",
    "choices": [
      "-6",
      "-4",
      "-2",
      "2",
      "4"
    ],
    "answer": "②",
    "solution": "로그의 합을 계산할 때에는 각 로그의 진수를 먼저 확인한다.\n$2\\le k\\le100$이면 $1-\\dfrac1k=\\dfrac{k-1}{k}>0$이므로\n$\\log\\left[\\left(1-\\dfrac1k\\right)^2\\right]=2\\log\\left(1-\\dfrac1k\\right)$이다.\n문제의 식을 $S$라 하면\n$S=2\\log\\dfrac12+2\\log\\dfrac23+2\\log\\dfrac34+\\cdots+2\\log\\dfrac{99}{100}$이다.\n로그의 합을 곱의 로그로 묶으면\n$S=2\\log\\left(\\dfrac12\\times\\dfrac23\\times\\dfrac34\\times\\cdots\\times\\dfrac{99}{100}\\right)$이다.\n곱에서 첫 분수의 분모 $2$는 다음 분수의 분자 $2$와, 분모 $3$은 다음 분자 $3$과 약분된다. 이 과정을 마지막까지 이어 가면\n$\\dfrac12\\times\\dfrac23\\times\\dfrac34\\times\\cdots\\times\\dfrac{99}{100}=\\dfrac1{100}$이다.\n따라서\n$S=2\\log\\dfrac1{100}=2\\log10^{-2}=2\\times(-2)=-4$이다.\n여기서 제곱은 로그값의 제곱이 아니라 각 진수의 제곱에 적용된다는 점에 주의한다.\n따라서 정답은 ②이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "그림과 같이 두 점 $P(a, b)$, $Q(-1, b)$는 각각 두 함수 $y=\\log_{\\frac{1}{3}} x$와 그 역함수 $y=f(x)$의 그래프 위의 점일 때, $\\dfrac{a}{b}$의 값은? (단, 점선은 $x$축 또는 $y$축에 평행하다.) [4.2점]<br><br><img src=\"assets/images/19_금당고_1학기_중간_고2_수학I/q11.png\" class=\"question-img\">",
    "choices": [
      "81",
      "9",
      "\\dfrac{1}{3}",
      "\\dfrac{1}{9}",
      "\\dfrac{1}{81}"
    ],
    "answer": "⑤",
    "solution": "$y=\\log_{1/3}x$의 역함수는 $y=(\\dfrac13)^x$이다.\n점 $Q(-1,b)$가 역함수 위에 있으므로\n$b=(\\dfrac13)^{-1}=3$이다.\n점 $P(a,b)$는 로그함수 위에 있으므로 $\\log_{1/3}a=b=3$이다.\n로그를 지수식으로 바꾸면 $a=(\\dfrac13)^3=\\dfrac1{27}$이다.\n따라서 $\\dfrac ab=\\dfrac{1/27}{3}=\\dfrac1{81}$이므로 정답은 ⑤이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "원점 $O$와 점 $P(-8, 15)$에 대하여 동경 $OP$가 나타내는 각의 크기를 $\\theta$라 할 때, $\\dfrac{17\\sin\\theta + 16\\tan\\theta}{17\\cos\\theta + 5}$의 값은? [4.8점]",
    "choices": [
      "5",
      "3",
      "1",
      "-1",
      "-3"
    ],
    "answer": "①",
    "solution": "점 $P(-8,15)$는 제2사분면에 있다. 원점에서의 거리는\n$r=\\sqrt{(-8)^2+15^2}=\\sqrt{64+225}=17$이다.\n따라서 $\\sin\\theta=\\dfrac{15}{17}$, $\\cos\\theta=-\\dfrac8{17}$이고\n$\\tan\\theta=\\dfrac{15}{-8}=-\\dfrac{15}{8}$이다.\n분자 $17\\sin\\theta+16\\tan\\theta=17\\times\\dfrac{15}{17}+16\\times\\left(-\\dfrac{15}{8}\\right)=15-30=-15$이다.\n분모 $17\\cos\\theta+5=17\\times\\left(-\\dfrac8{17}\\right)+5=-8+5=-3$이다.\n따라서 전체 값은 $\\dfrac{-15}{-3}=5$이므로 정답은 ①이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "0이 아닌 두 실수 $x$, $y$에 대하여 $2^x+2^y = 2-p$, $x+y=0$일 때, $(1+p\\times 2^x + 2^{2x})(1+p\\times 2^y + 2^{2y})$의 값은? (단, $p$는 상수이다.) [4.8점]",
    "choices": [
      "1",
      "2",
      "4",
      "8",
      "16"
    ],
    "answer": "③",
    "solution": "$A=2^x$, $B=2^y$로 놓는다. 지수법칙과 주어진 조건에서\n$AB=2^{x+y}=2^0=1$, $A+B=2-p$이다.\n따라서 $p=2-A-B$로 바꿀 수 있다.\n첫 번째 괄호는\n$1+pA+A^2=1+(2-A-B)A+A^2$\n$=1+2A-A^2-AB+A^2=1+2A-1=2A$이다.\n같은 방법으로 두 번째 괄호는\n$1+pB+B^2=1+(2-A-B)B+B^2$\n$=1+2B-AB-B^2+B^2=2B$이다.\n따라서 곱은 $(2A)(2B)=4AB=4$이므로 정답은 ③이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "$\\cos 0 + \\cos\\dfrac{\\pi}{12} + \\cos\\dfrac{2\\pi}{12} + \\cdots + \\cos\\dfrac{23\\pi}{12} + 1$의 값은? [4.8점]",
    "choices": [
      "-1",
      "-\\dfrac{1}{2}",
      "0",
      "\\dfrac{1}{2}",
      "1"
    ],
    "answer": "⑤",
    "solution": "코사인의 성질 $\\cos(\\alpha+\\pi)=-\\cos\\alpha$를 이용해 합의 앞뒤 항을 짝짓는다.\n$k=0,1,\\ldots,11$에 대하여\n$\\cos\\dfrac{(k+12)\\pi}{12}=\\cos\\left(\\dfrac{k\\pi}{12}+\\pi\\right)=-\\cos\\dfrac{k\\pi}{12}$이다.\n그러므로 $k=0$부터 $23$까지의 24개 코사인 항은 앞의 12개와 뒤의 12개가 서로 상쇄되어 합이 $0$이다.\n마지막에 따로 더한 $1$이 남으므로 구하는 값은 $0+1=1$이다. 정답은 ⑤이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "$1 \\le \\log x < 2$일 때, $\\log x$의 소수부분과 $\\log\\dfrac{1}{x^2}$의 소수부분이 같도록 하는 모든 $x$값의 곱은? [4.8점]",
    "choices": [
      "10",
      "10^2",
      "10^3",
      "10^4",
      "10^5"
    ],
    "answer": "④",
    "solution": "상용로그의 소수부분은 그 수에서 정수부분을 뺀 값이므로 항상 $0$ 이상 $1$ 미만이다. 음수의 소수부분도 이 정의를 그대로 쓴다.\n$u=\\log x$라 두면 $1\\le u<2$이므로 $u=1+t$ ($0\\le t<1$)로 나타낼 수 있다. 따라서 $\\log x$의 소수부분은 $t$이다.\n다른 로그는\n$\\log\\dfrac1{x^2}=\\log x^{-2}=-2\\log x=-2-2t$이다.\n정수 $-2$를 더하거나 빼도 소수부분은 변하지 않으므로 $-2t$의 소수부분이 $t$와 같아야 한다.\n\n① $t=0$이면 $-2t=0$이고 두 소수부분은 모두 $0$이다. 따라서 $u=1$이다.\n② $0<t<\\dfrac12$이면 $-1<-2t<0$이다. 이 구간에서는 정수부분이 $-1$이므로 소수부분은 $-2t-(-1)=1-2t$이다.\n$t=1-2t\\iff3t=1\\iff t=\\dfrac13$, 따라서 $u=1+\\dfrac13=\\dfrac43$이다.\n③ $t=\\dfrac12$이면 $-2t=-1$은 정수이므로 소수부분이 $0$이다. 이는 $t=\\dfrac12$와 다르므로 제외한다.\n④ $\\dfrac12<t<1$이면 $-2<-2t<-1$이다. 정수부분이 $-2$이므로 소수부분은 $-2t-(-2)=2-2t$이다.\n$t=2-2t\\iff3t=2\\iff t=\\dfrac23$, 따라서 $u=1+\\dfrac23=\\dfrac53$이다.\n\n가능한 $\\log x$는 $1,\\dfrac43,\\dfrac53$의 세 값이다. 각각 $x=10,10^{4/3},10^{5/3}$이므로\n$10\\times10^{4/3}\\times10^{5/3}=10^{1+4/3+5/3}=10^4$이다.\n따라서 정답은 ④이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "10이하의 자연수 $n$에 대하여 $n-6$의 제곱근 중 실수인 것의 개수를 $f(n)$, $n-6$의 다섯제곱근 중 실수인 것의 개수를 $g(n)$이라 하자. $f(n)+g(n)=3$을 만족시키는 10이하의 자연수 $n$의 개수는? [5.0점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "②",
    "solution": "문제는 $n-6$의 실수인 제곱근 개수와 실수인 다섯제곱근 개수를 더한 값이 $3$이 되는 경우를 찾는 것이다.\n먼저 $c=n-6$이라 놓자.\n제곱근은 $z^2=c$를 만족하는 실수 $z$이고, 다섯제곱근은 $z^5=c$를 만족하는 실수 $z$이다.\n$c<0$이면 제곱한 실수는 음수가 될 수 없으므로 제곱근은 $0$개다.\n$c=0$이면 제곱근은 $z=0$ 하나뿐이므로 $1$개다.\n$c>0$이면 제곱근은 $z=\\sqrt c$와 $z=-\\sqrt c$의 두 개다.\n반면 다섯제곱은 홀수제곱이므로 $c$가 음수·$0$·양수인 모든 경우에 실수 다섯제곱근은 정확히 하나다. 즉 항상 $g(n)=1$이다.\n\n따라서 경우를 나누면\n$n<6$일 때 $f(n)+g(n)=0+1=1$,\n$n=6$일 때 $f(n)+g(n)=1+1=2$,\n$n>6$일 때 $f(n)+g(n)=2+1=3$이다.\n원하는 합이 $3$이 되려면 $n>6$이어야 한다.\n문제에서 $n$은 $10$ 이하의 자연수이므로 $n=7,8,9,10$의 네 개다.\n따라서 정답은 ②이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수",
    "sourceMode": "AUDITED_REPAIR",
    "provenance": {
        "originalSource": "2019_금당고2_수1_1중간.pdf p3 q16",
        "originalDriveFileId": "1v530J2bvA9Ctyc1Nvxh26uPzxIMM1Ojj",
        "originalSourceSha256": "973a54c5fbdd7f7d07287a9cce3e1273cb2445f86e3e28ade881cc28e4088b35",
        "sourceModeReason": "PRINTED_SOURCE_CONTRADICTION_MINIMAL_EDITORIAL_REPAIR",
        "printedOriginal": "상한 100이하 (발문에 2회), f(n)+g(n)=3; 보기 ①3 ②4 ③5 ④6 ⑤7",
        "auditedStudentVersion": "상한 10이하 (발문에 2회), 정답 ②4",
        "reason": "원본 100이하이면 n=7..100으로 94개라 5지 어느 것도 성립하지 않음. 100→10의 각 1자리 삭제 2곳만으로 원문 의도·보기·기존 풀이/정답 보존. 원문 그대로가 아님.",
        "affectedFields": [
            "content"
        ],
        "contentModifiedInThisMasterRun": false,
        "provenanceRecordedBy": "NEW14_MASTER_20261017",
        "originalEditStage": "PRIOR_STAGE_NOT_CONFIRMED",
        "sourceComparison": "DRIVE_FULL_BYTES_SHA256_MATCH_LIBRARY_PACKET_AND_RENDERED_P3_Q16",
        "blindPassClaimed": false
    }
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "$x$에 대한 부등식 $3^{2x}-(2a+10)3^x + 20a \\le 0$을 만족시키는 정수 $x$의 개수가 3이 되도록 하는 1보다 작은 양수 $a$의 최댓값은? [5.0점]",
    "choices": [
      "\\dfrac{1}{6}",
      "\\dfrac{1}{3}",
      "\\dfrac{1}{2}",
      "\\dfrac{2}{3}",
      "\\dfrac{5}{6}"
    ],
    "answer": "③",
    "solution": "$3^{2x}=(3^x)^2$이므로 $t=3^x>0$으로 치환한다.\n$t^2-(2a+10)t+20a=(t-2a)(t-10)$이다.\n$0<a<1$에서 $0<2a<2<10$이므로\n$(t-2a)(t-10)\\le0\\iff2a\\le t\\le10$이다.\n따라서 구할 정수해는 $2a\\le3^x\\le10$을 만족하는 정수 $x$다.\n\n상한 $10$으로 먼저 정수 후보를 좁힌다.\n$3^2=9\\le10$, $3^3=27>10$이므로 $x\\ge3$은 불가능하다.\n또 $0<2a<2$이므로 $3^1=3$, $3^2=9$는 항상 범위 안에 들어간다. 따라서 $x=1,2$ 두 개는 이미 확보되어 있다.\n\n정확히 세 개가 되려면 $x=0$은 넣고 $x=-1$은 빼야 한다.\n$3^0=1$이 포함되려면 $2a\\le1$, 즉 $a\\le\\dfrac12$이다.\n$3^{-1}=\\dfrac13$이 포함되지 않으려면 $\\dfrac13<2a$, 즉 $a>\\dfrac16$이다.\n$3^x$는 $x$가 커질수록 증가하므로 $x=-1$이 제외되면 그보다 작은 모든 정수 $x\\le-2$도 자동으로 제외된다.\n따라서 정수해가 정확히 $x=0,1,2$가 되는 범위는\n$\\boxed{\\dfrac16<a\\le\\dfrac12}$이다.\n\n끝점 주의: $a=\\dfrac16$이면 $x=-1$까지 포함되어 네 개이므로 제외한다. 반면 $a=\\dfrac12$이면 $x=0$은 포함되고 $x=-1$은 제외되어 정확히 세 개다.\n따라서 $a$의 최댓값은 $\\dfrac12$이며 정답은 ③이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "$x$에 관한 이차방정식 $5x^2 - \\sqrt{5}x - k = 0$의 두 근을 $\\sin\\theta$, $\\cos\\theta$라 할 때, $\\sin\\theta$, $|\\cos\\theta|$를 두 근으로 하는 이차방정식은 $5x^2 - 3\\sqrt{5}x + k = 0$이다. 상수 $k$에 대하여 $k(2\\sin\\theta + \\cos\\theta) = \\dfrac{a\\sqrt{5}}{5}$일 때, 상수 $a$의 값은? [6.0점]",
    "choices": [
      "6",
      "4",
      "2",
      "-2",
      "-4"
    ],
    "answer": "①",
    "solution": "$s=\\sin\\theta$, $c=\\cos\\theta$라 놓는다. 두 이차방정식의 근과 계수의 관계를 각각 적용하면\n$s+c=\\dfrac{\\sqrt5}{5}$, $sc=-\\dfrac{k}{5}$,\n$s+|c|=\\dfrac{3\\sqrt5}{5}$, $s|c|=\\dfrac{k}{5}$이다.\n두 근의 합을 빼면\n$|c|-c=\\dfrac{2\\sqrt5}{5}>0$이다. 따라서 $c<0$이고 $|c|=-c$이다.\n$-c-c=\\dfrac{2\\sqrt5}{5}$에서 $c=-\\dfrac{\\sqrt5}{5}$이다.\n$s+c=\\dfrac{\\sqrt5}{5}$에 대입하면\n$s=\\dfrac{\\sqrt5}{5}-\\left(-\\dfrac{\\sqrt5}{5}\\right)=\\dfrac{2\\sqrt5}{5}$이다.\n$sc=-\\dfrac{k}{5}$에 대입하면\n$\\dfrac{2\\sqrt5}{5}\\times\\left(-\\dfrac{\\sqrt5}{5}\\right)=-\\dfrac25=-\\dfrac{k}{5}$이므로 $k=2$다.\n따라서 $k(2s+c)=2\\left(\\dfrac{4\\sqrt5}{5}-\\dfrac{\\sqrt5}{5}\\right)=\\dfrac{6\\sqrt5}{5}$이다.\n$\\dfrac{a\\sqrt5}{5}=\\dfrac{6\\sqrt5}{5}$이므로 $a=6$이고 정답은 ①이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "[서술형1] 각 $\\theta$가 제3사분면의 각일 때, 다음 식을 간단히 하시오. [5점]<br><br>$$|1-2\\cos\\theta| - \\sqrt{\\cos^2\\theta} - \\sqrt{(\\sin\\theta+\\cos\\theta)^2}$$",
    "choices": [],
    "answer": "$1+\\sin\\theta$",
    "solution": "제3사분면에서는 $\\sin\\theta<0$, $\\cos\\theta<0$이므로 $\\sin\\theta+\\cos\\theta<0$이다.\n따라서 $1-2\\cos\\theta>0$이고\n$|1-2\\cos\\theta|=1-2\\cos\\theta$이다.\n또한 $\\sqrt{\\cos^2\\theta}=|\\cos\\theta|=-\\cos\\theta$,\n$\\sqrt{(\\sin\\theta+\\cos\\theta)^2}=|\\sin\\theta+\\cos\\theta|=-(\\sin\\theta+\\cos\\theta)$이다.\n이제 원래 식에 대입하면\n$(1-2\\cos\\theta)-(-\\cos\\theta)-[-(\\sin\\theta+\\cos\\theta)]$\n$=1-2\\cos\\theta+\\cos\\theta+\\sin\\theta+\\cos\\theta$\n$=1+\\sin\\theta$이다.\n따라서 답은 $\\boxed{1+\\sin\\theta}$이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "삼각함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "삼각함수",
    "originalCategory": "삼각함수"
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형2] 모든 실수 $x$에 대하여 부등식 $a \\cdot 2^{2x} + a \\cdot 2^{x+1} - a^2+2a+3 > 0$이 항상 성립하도록 하는 모든 정수 $a$의 개수를 구하시오. [7점]",
    "choices": [],
    "answer": "4",
    "solution": "모든 실수 $x$에 대해 성립해야 하므로 $t=2^x$로 바꿔 생각한다.\n$2^x$는 모든 양수 값을 가질 수 있고 $0$은 될 수 없으므로 범위는 정확히 $t>0$이다.\n$2^{2x}=t^2$, $2^{x+1}=2t$를 대입하면\n$a t^2+2at-a^2+2a+3>0$,\n즉 $at(t+2)+(-a^2+2a+3)>0$이다.\n\n① $a<0$인 경우\n$t$가 매우 커지면 $at(t+2)$는 음의 방향으로 끝없이 작아진다. 따라서 모든 $t>0$에서 양수일 수 없으므로 제외한다.\n\n② $a=0$인 경우\n좌변은 $3>0$으로 항상 성립한다. 따라서 $a=0$은 반드시 포함한다.\n\n③ $a>0$인 경우\n$t>0$이므로 $at(t+2)>0$이고, $t$가 $0$에 가까워질수록 이 항은 $0$에 가까워진다.\n따라서 모든 $t>0$에서 양수가 되기 위한 필요충분조건은 상수항이 음수가 아닌 것,\n$-a^2+2a+3\\ge0$이다.\n상수항이 음수이면 충분히 작은 양수 $t$에서 좌변이 음수가 되기 때문이다.\n$-a^2+2a+3=-(a-3)(a+1)$이므로\n$-(a-3)(a+1)\\ge0\\iff-1\\le a\\le3$이다.\n이 중 $a>0$인 정수는 $1,2,3$이다.\n\n경계 $a=3$도 포함한다. 이때 상수항은 $0$이지만 좌변은 $3t(t+2)>0$이다. $t=0$은 $2^x$의 값이 될 수 없으므로 부등식의 엄격한 부등호 $>$와 모순되지 않는다.\n따라서 $a=0,1,2,3$의 네 개이고 답은 $\\boxed{4}$이다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "[서술형3] 그림과 같이 두 함수 $f(x)=2^x-1$, $g(x)=-\\left(\\dfrac{1}{2}\\right)^x+3$의 그래프가 만나는 두 점을 $\\mathrm{A}$, $\\mathrm{B}$라 하고 함수 $y=g(x)$의 그래프가 $y$축과 만나는 점을 $\\mathrm{C}$라 하자. 점 $\\mathrm{A}$의 $x$좌표를 $a$라 할 때, 사각형 $\\mathrm{OACB}$의 넓이를 $a$로 나타내시오. (단, $\\mathrm{O}$는 원점이다.) [8점]<br><br><img src=\"assets/images/19_금당고_1학기_중간_고2_수학I/q21.png\" class=\"question-img\">",
    "choices": [],
    "answer": "$2a$",
    "solution": "① 두 교점의 $x$좌표를 구한다.\n$f(x)=g(x)$이므로\n$2^x-1=-2^{-x}+3$,\n$2^x+2^{-x}=4$이다.\n$t=2^x>0$으로 놓고 양변에 $t$를 곱하면\n$t^2+1=4t$,\n$t^2-4t+1=0$,\n$t=\\dfrac{4\\pm\\sqrt{16-4}}2=2\\pm\\sqrt3$이다.\n$(2+\\sqrt3)(2-\\sqrt3)=1$이므로 두 해는 서로 역수다.\n오른쪽 교점 $\\mathrm A$의 $x$좌표가 $a>0$이므로 $2^a=2+\\sqrt3$,\n따라서 $a=\\log_2(2+\\sqrt3)$이다.\n다른 교점 $\\mathrm B$에서는 $2^x=2-\\sqrt3=2^{-a}$이므로 $x=-a$이다.\n\n② 사각형을 나눌 기준 선분을 정한다.\n$\\mathrm C$는 $g$의 $y$절편이므로\n$\\mathrm C=(0,g(0))=(0,-1+3)=(0,2)$이다.\n원점 $\\mathrm O=(0,0)$이므로 세로 선분 $\\mathrm{OC}$의 길이는 $2$다.\n사각형 $\\mathrm{OACB}$를 $\\mathrm{OC}$로 나누면 삼각형 $\\mathrm{OAC}$와 $\\mathrm{OCB}$ 두 개가 된다.\n\n③ 각 삼각형의 넓이를 구한다.\n밑변을 세로 선분 $\\mathrm{OC}$로 잡았으므로 높이는 점의 $y$좌표가 아니라 $y$축까지의 가로 거리다.\n$\\mathrm A$의 $x$좌표가 $a$이므로 높이는 $a$,\n$\\mathrm B$의 $x$좌표가 $-a$이므로 높이는 $|-a|=a$다.\n따라서\n$[\\triangle\\mathrm{OAC}]=\\dfrac12\\times2\\times a=a$,\n$[\\triangle\\mathrm{OCB}]=\\dfrac12\\times2\\times a=a$이다.\n\n④ 두 넓이를 더한다.\n$[\\mathrm{OACB}]=a+a=\\boxed{2a}$이다.\n$a=\\log_2(2+\\sqrt3)$를 대입하면 $2\\log_2(2+\\sqrt3)$로도 나타낼 수 있다.",
    "standardCourse": "수학Ⅰ",
    "standardUnit": "지수함수와 로그함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "지수함수와 로그함수",
    "originalCategory": "지수함수와 로그함수"
  }
];
