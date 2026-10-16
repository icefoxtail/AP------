window.examTitle = "22_금당고_1학기_기말_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "함수 $y=\\sin 2x$의 주기는? [4점]",
    "choices": [
      "$\\dfrac{\\pi}{4}$",
      "$\\dfrac{\\pi}{2}$",
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$"
    ],
    "answer": "③",
    "solution": "함수 $y=\\sin kx$의 주기는 $\\dfrac{2\\pi}{|k|}$이다.\n여기서는 $k=2$이므로\n$T=\\dfrac{2\\pi}{2}=\\pi$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "$\\cos x = \\dfrac{1}{2}$의 모든 근의 합은? (단, $0 \\le x < 2\\pi$) [4점]",
    "choices": [
      "$\\dfrac{2\\pi}{3}$",
      "$\\pi$",
      "$\\dfrac{4\\pi}{3}$",
      "$\\dfrac{5\\pi}{3}$",
      "$2\\pi$"
    ],
    "answer": "⑤",
    "solution": "방정식 $\\cos x=\\dfrac12$는 단위원에서 $x$좌표가 $\\dfrac12$인 점의 각을 찾는 것이다.\n$0\\le x<2\\pi$에서 해당하는 각은\n$x=\\dfrac\\pi3,\\;\\dfrac{5\\pi}3$이다.\n모든 근의 합은\n$\\dfrac\\pi3+\\dfrac{5\\pi}3=\\dfrac{6\\pi}3=2\\pi$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{ABC}$에서 $\\overline{\\mathrm{AB}}=4$, $\\overline{\\mathrm{AC}}=3$, $\\sin\\theta = \\dfrac{1}{2}$일 때, 이 삼각형의 넓이는? [4점]<br><br><img src=\"assets/images/22_금당고_1학기_기말_고2_수학I/q03.png\" class=\"question-img\">",
    "choices": [
      "3",
      "6",
      "9",
      "12",
      "15"
    ],
    "answer": "①",
    "solution": "삼각형의 넓이는 두 변의 길이와 그 끼인각의 사인값을 이용하여\n$\\dfrac12\\cdot\\overline{AB}\\cdot\\overline{AC}\\cdot\\sin\\theta$로 구한다.\n$\\overline{AB}=4$, $\\overline{AC}=3$, $\\sin\\theta=\\dfrac12$를 대입하면\n$\\text{넓이}=\\dfrac12\\cdot4\\cdot3\\cdot\\dfrac12$\n$=3$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "첫째항이 $-3$이고 공차가 2인 등차수열 $\\{a_n\\}$에 대하여 $a_7$의 값은? [4점]",
    "choices": [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    "answer": "③",
    "solution": "등차수열의 첫째항은 $a_1=-3$이고 공차는 $d=2$이다.\n등차수열의 일반항은 $a_n=a_1+(n-1)d$이므로\n$a_7=-3+(7-1)\\cdot2$\n$=-3+12$\n$=9$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "$\\sum_{k=1}^{20} a_k = 10$, $\\sum_{k=1}^{20} b_k = 5$일 때, $\\sum_{k=1}^{20} (3a_k + 2b_k)$의 값은? [4.2점]",
    "choices": [
      "25",
      "30",
      "35",
      "40",
      "45"
    ],
    "answer": "④",
    "solution": "합의 성질을 이용하면\n$\\displaystyle\\sum_{k=1}^{20}(3a_k+2b_k)=3\\sum_{k=1}^{20}a_k+2\\sum_{k=1}^{20}b_k$이다.\n주어진 합을 대입하여\n$=3\\cdot10+2\\cdot5$\n$=30+10$\n$=40$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "함수 $y=a\\sin bx + c$의 최댓값과 최솟값이 각각 5, $-1$이고 주기가 $\\pi$일 때, 상수 $a, b, c$에 대하여 $abc$의 값은? (단, $a > 0$, $b < 0$) [4.2점]",
    "choices": [
      "-12",
      "-6",
      "3",
      "6",
      "12"
    ],
    "answer": "①",
    "solution": "$a>0$이므로 $a\\sin bx$의 최댓값은 $a$, 최솟값은 $-a$이다.\n따라서 함수의 최댓값과 최솟값은 각각 $c+a=5$, $c-a=-1$이다.\n두 식을 더하면\n$2c=4$,\n$c=2$이다.\n첫째 식에서 둘째 식을 빼면\n$2a=6$,\n$a=3$이다.\n함수 $y=\\sin bx$의 주기는 $\\dfrac{2\\pi}{|b|}$이므로\n$\\dfrac{2\\pi}{|b|}=\\pi$,\n$|b|=2$이다.\n$b<0$이므로 $b=-2$이다.\n따라서\n$abc=3\\cdot(-2)\\cdot2=-12$이다.\n정답은 ①이다."
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "$0 \\le x < \\pi$에서 함수 $y=\\sin^2 x - 4\\sin x + 3$의 최댓값은? [4.2점]",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "④",
    "solution": "$t=\\sin x$라 두면 $0\\le x<\\pi$에서 $0\\le t\\le1$이다.\n구하는 식은\n$\\sin^2x-4\\sin x+3=t^2-4t+3$\n$=(t-2)^2-1$이다.\n$0\\le t\\le1$이므로 $-2\\le t-2\\le-1$이고,\n$(t-2)^2\\le4$이다.\n따라서 $(t-2)^2-1\\le3$이며, $x=0$일 때 $t=0$이므로 등호가 성립한다.\n최댓값은 $3$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{ABC}$에서 $\\angle\\mathrm{BAC}=75^\\circ$, $\\angle\\mathrm{ABC}=45^\\circ$, $\\overline{\\mathrm{AB}}=4$일 때, 이 삼각형의 외접원의 반지름의 길이는? [4.2점]<br><br><img src=\"assets/images/22_금당고_1학기_기말_고2_수학I/q08.png\" class=\"question-img\">",
    "choices": [
      "$\\dfrac{\\sqrt{3}}{3}$",
      "$\\dfrac{2\\sqrt{3}}{3}$",
      "$\\sqrt{3}$",
      "$\\dfrac{4\\sqrt{3}}{3}$",
      "$\\dfrac{5\\sqrt{3}}{3}$"
    ],
    "answer": "④",
    "solution": "삼각형의 내각의 합은 $180^\\circ$이므로\n$\\angle ACB=180^\\circ-75^\\circ-45^\\circ=60^\\circ$이다.\n외접원의 반지름을 $R$이라 하면 사인법칙에서\n$\\dfrac{\\overline{AB}}{\\sin\\angle ACB}=2R$이다.\n주어진 값을 대입하면\n$\\dfrac{4}{\\sin60^\\circ}=2R$,\n$\\dfrac{4}{\\sqrt3/2}=2R$,\n$\\dfrac{8}{\\sqrt3}=2R$,\n$R=\\dfrac{4}{\\sqrt3}=\\dfrac{4\\sqrt3}{3}$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "세 수 $a, 3, b$가 이 순서대로 등차수열이고, 세 수 $1, a, b$가 이 순서대로 등비수열일 때, $b-a$의 값은? (단, $a < 0$) [4.2점]",
    "choices": [
      "-12",
      "-6",
      "0",
      "6",
      "12"
    ],
    "answer": "⑤",
    "solution": "세 수 $a,3,b$가 이 순서대로 등차수열이므로\n$a+b=2\\cdot3=6$이다.\n세 수 $1,a,b$가 이 순서대로 등비수열이므로 가운데 항의 제곱은 양끝 항의 곱과 같다.\n$a^2=1\\cdot b$,\n$b=a^2$이다.\n$b=6-a$를 대입하면\n$a^2=6-a$,\n$a^2+a-6=0$,\n$(a+3)(a-2)=0$이다.\n$a<0$이므로 $a=-3$이고,\n$b=a^2=9$이다.\n따라서\n$b-a=9-(-3)=12$이다.\n정답은 ⑤이다."
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "$\\sum_{k=1}^8 \\dfrac{3}{9k^2-3k-2}$의 값은? [4.2점]",
    "choices": [
      "$\\dfrac{15}{16}$",
      "$\\dfrac{18}{19}$",
      "$\\dfrac{21}{22}$",
      "$\\dfrac{24}{25}$",
      "$\\dfrac{27}{28}$"
    ],
    "answer": "④",
    "solution": "분모를 인수분해하면\n$9k^2-3k-2=(3k-2)(3k+1)$이다.\n두 인수의 차가 $3$이므로\n$\\dfrac{3}{(3k-2)(3k+1)}=\\dfrac{1}{3k-2}-\\dfrac{1}{3k+1}$이다.\n따라서 주어진 합은\n$\\displaystyle\\sum_{k=1}^{8}\\left(\\dfrac{1}{3k-2}-\\dfrac{1}{3k+1}\\right)$\n$=(1-\\dfrac14)+(\\dfrac14-\\dfrac17)+\\cdots+(\\dfrac1{22}-\\dfrac1{25})$이다.\n중간 항들이 차례로 소거되어\n$=1-\\dfrac1{25}$\n$=\\dfrac{24}{25}$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "$x$에 대한 이차방정식 $$(\\cos B - \\cos C)x^2 - 2x\\sin A + (\\cos B + \\cos C)=0$$이 중근을 가질 때, 삼각형 $\\mathrm{ABC}$는 어떤 삼각형인가? [4.8점]",
    "choices": [
      "정삼각형",
      "$a=b$인 이등변삼각형",
      "$c=a$인 이등변삼각형",
      "$\\angle\\mathrm{B}=90^\\circ$인 직각삼각형",
      "$\\angle\\mathrm{C}=90^\\circ$인 직각삼각형"
    ],
    "answer": "⑤",
    "solution": "주어진 이차방정식의 판별식이 $0$이어야 중근을 갖는다.\n판별식을 $D$라 하면\n$\\dfrac D4=\\sin^2 A-(\\cos B-\\cos C)(\\cos B+\\cos C)$\n$=\\sin^2 A-(\\cos^2B-\\cos^2C)=0$이다.\n$\\sin^2A=\\cos^2B-\\cos^2C$이다.\n$\\cos^2B=1-\\sin^2B$, $\\cos^2C=1-\\sin^2C$를 대입하면\n$\\sin^2A=\\sin^2C-\\sin^2B$,\n$\\sin^2A+\\sin^2B=\\sin^2C$이다.\n각 $A,B,C$의 대변을 각각 $a,b,c$, 외접원의 반지름을 $R$이라 하자.\n사인법칙에 의해 $\\sin A=\\dfrac a{2R}$, $\\sin B=\\dfrac b{2R}$, $\\sin C=\\dfrac c{2R}$이다.\n이를 대입하면\n$\\dfrac{a^2}{4R^2}+\\dfrac{b^2}{4R^2}=\\dfrac{c^2}{4R^2}$,\n$a^2+b^2=c^2$이다.\n피타고라스 정리의 역에 의해 $c$의 맞은편 각 $C$는 $90^\\circ$이다.\n이때 $B<90^\\circ$이므로 $\\cos B-\\cos C=\\cos B\\ne0$이고, 실제 이차항도 남는다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$이 첫째항이 2이고 공비가 4인 등비수열일 때, $\\sum_{k=1}^n \\log_8 a_k = 27$을 만족시키는 자연수 $n$의 값은? [4.8점]",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "②",
    "solution": "첫째항이 $2$, 공비가 $4$이므로\n$a_k=2\\cdot4^{k-1}=2^{2k-1}$이다.\n따라서\n$\\log_8 a_k=\\log_{2^3}2^{2k-1}=\\dfrac{2k-1}{3}$이다.\n주어진 합은\n$\\displaystyle\\sum_{k=1}^{n}\\log_8a_k=\\dfrac13\\sum_{k=1}^{n}(2k-1)$\n$=\\dfrac13\\{2\\cdot\\dfrac{n(n+1)}2-n\\}$\n$=\\dfrac{n^2}{3}$이다.\n이 값이 $27$이므로\n$\\dfrac{n^2}{3}=27$,\n$n^2=81$이다.\n$n$은 자연수이므로 $n=9$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "다음 그림은 두 함수 $y=\\tan x$와 $y=a\\sin bx$의 그래프이다. 두 함수의 그래프가 점 $\\left(\\dfrac{\\pi}{3}, c\\right)$에서 만날 때, 세 상수 $a, b, c$에 대하여 $a+b+c^2$의 값은? (단, $a > 0, b > 0$) [4.8점]<br><br><img src=\"assets/images/22_금당고_1학기_기말_고2_수학I/q13.png\" class=\"question-img\">",
    "choices": [
      "4",
      "7",
      "10",
      "13",
      "16"
    ],
    "answer": "②",
    "solution": "그림에서 $x=\\dfrac\\pi3$일 때 두 그래프가 만난다.\n$y=\\tan x$의 함수값은\n$c=\\tan\\dfrac\\pi3=\\sqrt3$이다.\n그림에서 $y=a\\sin bx$는 $x=0$과 $x=\\dfrac\\pi2$에서 연속하여 $x$축과 만나므로 두 영점 사이의 거리는 $\\dfrac\\pi2$이다.\n$\\sin bx$의 연속한 영점 사이의 거리는 $\\dfrac\\pi b$이고 $b>0$이므로\n$\\dfrac\\pi b=\\dfrac\\pi2$,\n$b=2$이다.\n교점에서 $a\\sin bx=c$이므로\n$a\\sin\\dfrac{2\\pi}{3}=\\sqrt3$이다.\n$\\sin\\dfrac{2\\pi}{3}=\\dfrac{\\sqrt3}{2}$를 대입하면\n$a\\cdot\\dfrac{\\sqrt3}{2}=\\sqrt3$,\n$a=2$이다.\n따라서\n$a+b+c^2=2+2+(\\sqrt3)^2=7$이다.\n정답은 ②이다."
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "그림과 같이 길이가 4인 선분 $\\mathrm{AB}$를 지름으로 하는 반원 위에 한 점 $\\mathrm{C}$가 있다. $\\angle\\mathrm{CAB}=\\alpha$, $\\angle\\mathrm{CBA}=\\beta$에 대하여 $\\sin(\\alpha-\\beta)=-\\dfrac{1}{8}$일 때, $\\cos(\\alpha+2\\beta)$의 값은? [4.8점]<br><br><img src=\"assets/images/22_금당고_1학기_기말_고2_수학I/q14.png\" class=\"question-img\">",
    "choices": [
      "$-\\dfrac{1}{2}$",
      "$-\\dfrac{\\sqrt{5}}{4}$",
      "$-\\dfrac{\\sqrt{6}}{4}$",
      "$-\\dfrac{\\sqrt{7}}{4}$",
      "$-\\dfrac{3}{4}$"
    ],
    "answer": "⑤",
    "solution": "선분 $AB$가 반원의 지름이므로 $\\angle ACB=90^\\circ$이다.\n따라서\n$\\alpha+\\beta=90^\\circ$이다.\n구하려는 식은\n$\\cos(\\alpha+2\\beta)=\\cos(90^\\circ+\\beta)=-\\sin\\beta$이다.\n또\n$\\sin(\\alpha-\\beta)=\\sin(90^\\circ-2\\beta)=\\cos2\\beta=-\\dfrac18$이다.\n선분 $AB$의 중점을 $O$라 하면 $O$는 반원의 중심이므로\n$OA=OB=OC=2$이다.\n삼각형 $OBC$는 $OB=OC$인 이등변삼각형이고 $\\angle OBC=\\beta$이므로\n$\\angle BOC=180^\\circ-2\\beta$이다.\n점 $A,O,B$가 일직선 위에 있으므로\n$\\angle AOC=180^\\circ-\\angle BOC=2\\beta$이다.\n삼각형 $AOC$에 코사인법칙을 적용하면\n$AC^2=OA^2+OC^2-2\\cdot OA\\cdot OC\\cos2\\beta$\n$=2^2+2^2-2\\cdot2\\cdot2\\left(-\\dfrac18\\right)$\n$=8+1=9$이다.\n길이는 양수이므로 $AC=3$이다.\n직각삼각형 $ABC$에서\n$\\sin\\beta=\\dfrac{AC}{AB}=\\dfrac34$이다.\n따라서\n$\\cos(\\alpha+2\\beta)=-\\dfrac34$이고 정답은 ⑤이다."
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "자연수 $n$에 대하여 $0 \\le x < 2^{n+1}$일 때, 부등식 $$\\cos\\left(\\dfrac{\\pi}{2^n}x\\right) \\le -\\dfrac{1}{2}$$을 만족시키는 서로 다른 모든 자연수 $x$의 개수를 $a_n$이라 하자. $\\sum_{n=1}^8 a_n$의 값은? [4.8점]",
    "choices": [
      "340",
      "350",
      "360",
      "370",
      "380"
    ],
    "answer": "①",
    "solution": "$t=\\dfrac{\\pi}{2^n}x$라 두면 $0\\le x<2^{n+1}$에서 $0\\le t<2\\pi$이다.\n이 범위에서 $\\cos t\\le-\\dfrac12$인 구간은\n$\\dfrac{2\\pi}{3}\\le t\\le\\dfrac{4\\pi}{3}$이다.\n$t=\\dfrac{\\pi}{2^n}x$를 대입하면\n$\\dfrac{2\\pi}{3}\\le\\dfrac{\\pi x}{2^n}\\le\\dfrac{4\\pi}{3}$,\n$\\dfrac{2^{n+1}}3\\le x\\le\\dfrac{2^{n+2}}3$이다.\n각 $n$에 대하여 위 구간에 들어가는 자연수를 센다.\n$n=1$: $\\dfrac43\\le x\\le\\dfrac83$에서 $x=2$, 따라서 $a_1=1$.\n$n=2$: $\\dfrac83\\le x\\le\\dfrac{16}3$에서 $x=3,4,5$, 따라서 $a_2=3$.\n$n=3$: $x=6,\\ldots,10$이므로 $a_3=10-6+1=5$.\n$n=4$: $x=11,\\ldots,21$이므로 $a_4=21-11+1=11$.\n$n=5$: $x=22,\\ldots,42$이므로 $a_5=42-22+1=21$.\n$n=6$: $x=43,\\ldots,85$이므로 $a_6=85-43+1=43$.\n$n=7$: $x=86,\\ldots,170$이므로 $a_7=170-86+1=85$.\n$n=8$: $x=171,\\ldots,341$이므로 $a_8=341-171+1=171$.\n그러므로\n$\\displaystyle\\sum_{n=1}^{8}a_n=1+3+5+11+21+43+85+171=340$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "공차가 3인 등차수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합 $S_n$에 대하여 다음이 성립한다.<br><br><div class=\"exam-box\">(가) $S_l = S_m \\, (l < m)$을 만족시키는 두 자연수 $l, m$의 모든 순서쌍 $(l, m)$의 개수는 6이다.<br>(나) $S_n = 0$일 때, $n$은 짝수이다.</div><br>$S_{20}$의 값은? [4.8점]",
    "choices": [
      "120",
      "150",
      "180",
      "210",
      "240"
    ],
    "answer": "③",
    "solution": "공차가 $3$이고 첫째항이 $a_1$인 등차수열의 합은\n$S_n=\\dfrac n2\\{2a_1+3(n-1)\\}$이다.\n$l<m$일 때 $S_l=S_m$이므로 두 식의 차를 계산하면\n$0=S_m-S_l=\\dfrac{m-l}{2}\\{2a_1+3(l+m-1)\\}$이다.\n$m-l>0$이므로\n$l+m=1-\\dfrac{2a_1}{3}$이다.\n이 값을 $K$라 두면 $l,m$은 양의 정수이고 $l<m$, $l+m=K$이다.\n조건 (가)의 여섯 쌍은 $K=13$일 때 $(1,12)$부터 $(6,7)$까지이고, $K=14$일 때 $(1,13)$부터 $(6,8)$까지이다.\n따라서 $K=13$ 또는 $14$이다.\n한편\n$S_n=\\dfrac n2\\{2a_1+3(n-1)\\}$이므로 자연수 $n$에서 $S_n=0$인 값은 $n=K$이다.\n조건 (나)에 의해 이 $n$은 짝수이므로 $K=14$이다.\n따라서\n$14=1-\\dfrac{2a_1}{3}$,\n$\\dfrac{2a_1}{3}=-13$,\n$a_1=-\\dfrac{39}{2}$이다.\n그러므로\n$S_{20}=\\dfrac{20}{2}\\left\\{2\\left(-\\dfrac{39}{2}\\right)+3(20-1)\\right\\}$\n$=10(-39+57)$\n$=180$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 17,
    "questionType": "서술형",
    "content": "[단답형 1] $-n\\pi < x \\le n\\pi$에서 정의된 두 함수 $f(x)=\\tan x$, $g(x)=\\sin x$에 대하여 방정식 $f(x)=g(x)$의 서로 다른 실근의 개수를 $a_n$이라 할 때, $\\sum_{k=1}^{15} a_k$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "240",
    "solution": "$f(x)=g(x)$에서 $\\tan x=\\sin x$이다.\n$\\tan x$가 정의되려면 $\\cos x\\ne0$이어야 한다.\n$\\tan x=\\dfrac{\\sin x}{\\cos x}$이므로 양변에 $\\cos x$를 곱하면\n$\\sin x=\\sin x\\cos x$,\n$\\sin x(1-\\cos x)=0$이다.\n따라서 $\\sin x=0$ 또는 $\\cos x=1$이다.\n$\\cos x=1$인 각도 $x=2k\\pi$는 이미 $\\sin x=0$에 포함된다.\n그러므로 서로 다른 실근은 $x=k\\pi$ ($k$는 정수)이다.\n주어진 범위를 대입하면\n$-n\\pi<k\\pi\\le n\\pi$,\n$-n<k\\le n$이다.\n가능한 정수 $k$는 $-n+1,-n+2,\\ldots,n$으로 모두 $2n$개이다.\n따라서 $a_n=2n$이고,\n$\\displaystyle\\sum_{k=1}^{15}a_k=2(1+2+\\cdots+15)$\n$=2\\cdot\\dfrac{15\\cdot16}{2}$\n$=240$이다."
  },
  {
    "id": 18,
    "questionType": "서술형",
    "content": "[단답형 2] 다음 조건을 만족시키는 모든 수열 $\\{a_n\\}$에 대하여 $a_1 + 4\\sum_{k=5}^{25} a_k$의 최솟값을 구하시오. [5점]<br><br><div class=\"exam-box\">(가) $a_5 = 4$<br>(나) 모든 자연수 $n$에 대하여<br>$$a_{n+1}=\\begin{cases} \\dfrac{3}{a_n} & (a_n\\text{의 값이 정수인 경우}) \\\\ 2a_n+1 & (a_n\\text{의 값이 정수가 아닌 경우}) \\end{cases}$$</div>",
    "choices": [],
    "answer": "199",
    "solution": "조건 (가)의 $a_5=4$에서 거꾸로 가능한 항을 찾는다.\n$a_4$가 정수라면 $\\dfrac3{a_4}=4$이므로 $a_4=\\dfrac34$가 되어 정수가 아니다.\n따라서 $a_4$는 정수가 아니고\n$2a_4+1=4$,\n$a_4=\\dfrac32$이다.\n$a_4=\\dfrac32$를 만드는 $a_3$은 정수인 경우\n$\\dfrac3{a_3}=\\dfrac32$에서 $a_3=2$이고,\n정수가 아닌 경우\n$2a_3+1=\\dfrac32$에서 $a_3=\\dfrac14$이다.\n이제 $a_3=2$이면 정수인 $a_2$에 대해 $\\dfrac3{a_2}=2$가 되어 $a_2=\\dfrac32$라는 모순이 생긴다.\n따라서 이 경우에는 $2a_2+1=2$이고 $a_2=\\dfrac12$이다.\n$a_3=\\dfrac14$이면 정수인 $a_2$에서 $\\dfrac3{a_2}=\\dfrac14$이므로 $a_2=12$이고,\n정수가 아닌 $a_2$에서 $2a_2+1=\\dfrac14$이므로 $a_2=-\\dfrac38$이다.\n각 $a_2$에서 한 번 더 거꾸로 계산한다.\n$a_2=\\dfrac12$이면 $a_1=6$ 또는 $a_1=-\\dfrac14$이다.\n$a_2=12$일 때 $a_1$이 정수라고 가정하면 $\\dfrac3{a_1}=12$에서 $a_1=\\dfrac14$가 되어 정수가 아니므로 이 경우는 불가능하다.\n따라서 $a_1$은 정수가 아니고 $2a_1+1=12$이므로 $a_1=\\dfrac{11}{2}$이다.\n$a_2=-\\dfrac38$이면 $a_1=-8$ 또는 $a_1=-\\dfrac{11}{16}$이다.\n따라서 가능한 $a_1$은\n$-8,-\\dfrac{11}{16},-\\dfrac14,\\dfrac{11}{2},6$이고 최솟값은 $-8$이다.\n$a_5=4$부터 점화식을 적용하면\n$a_5=4,\\;a_6=\\dfrac34,\\;a_7=\\dfrac52,\\;a_8=6,\\;a_9=\\dfrac12,\\;a_{10}=2,\\;a_{11}=\\dfrac32,\\;a_{12}=4$이다.\n이후 같은 일곱 항이 반복되며 한 묶음의 합은\n$4+\\dfrac34+\\dfrac52+6+\\dfrac12+2+\\dfrac32=\\dfrac{69}{4}$이다.\n$a_5$부터 $a_{25}$까지는 일곱 항씩 세 묶음이므로\n$\\displaystyle\\sum_{k=5}^{25}a_k=3\\cdot\\dfrac{69}{4}=\\dfrac{207}{4}$이다.\n따라서 구하는 식의 최솟값은\n$-8+4\\cdot\\dfrac{207}{4}=199$이다."
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "[서술형 1] 자연수 $n$에 대하여 $0 < x < n\\pi$일 때, 방정식 $\\sin x = \\dfrac{3}{n}$의 모든 실근의 개수를 $a_n$이라 하자. $\\sum_{n=1}^9 a_n$의 값을 구하시오. [10점]",
    "choices": [],
    "answer": "44",
    "solution": "$\\sin x$의 값은 $-1\\le\\sin x\\le1$이므로 $\\dfrac3n\\le1$이어야 한다.\n따라서 $n=1,2$에서는 실근이 없고 $a_1=a_2=0$이다.\n$n=3$이면 $\\sin x=1$이고 $0<x<3\\pi$에서 $x=\\dfrac\\pi2,\\dfrac{5\\pi}2$이므로 $a_3=2$이다.\n$n\\ge4$이면 $0<\\dfrac3n<1$이다.\n양의 사인값은 구간 $(2j\\pi,(2j+1)\\pi)$에서 나온다. 여기서 $j$는 $0$ 이상의 정수이다.\n$n$이 짝수이면 $(0,n\\pi)$ 안에 이러한 구간이 $\\dfrac n2$개 있고,\n$n$이 홀수이면 $\\dfrac{n+1}{2}$개 있다.\n각 구간에서 높이 $\\dfrac3n$인 직선은 사인그래프와 두 점에서 만나므로\n$n\\ge4$일 때 $a_n$은 $n$이 짝수이면 $n$, 홀수이면 $n+1$이다.\n따라서 $a_4,a_5,a_6,a_7,a_8,a_9=4,6,6,8,8,10$이다.\n그러므로\n$\\displaystyle\\sum_{n=1}^{9}a_n=0+0+2+4+6+6+8+8+10=44$이다."
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형 2] 수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 하자. 모든 자연수 $n$에 대하여 $a_n > 0$이고 $$a_1 = 1, \\quad \\sqrt{S_{n-1}} + \\sqrt{S_n} = a_n \\, (n \\ge 2)$$가 성립할 때, $a_{30}$의 값을 구하시오. [10점]",
    "choices": [],
    "answer": "59",
    "solution": "$a_1=1$이므로 $S_1=1$이다.\n$n\\ge2$에서 $a_n=S_n-S_{n-1}$이고, 모든 $a_n>0$이므로 $S_n>S_{n-1}>0$이다.\n$u=\\sqrt{S_{n-1}}$, $v=\\sqrt{S_n}$이라 두면 조건은\n$u+v=a_n=S_n-S_{n-1}=v^2-u^2=(v-u)(v+u)$이다.\n$u+v>0$이므로 양변을 $u+v$로 나누어\n$v-u=1$을 얻는다.\n따라서\n$\\sqrt{S_n}=\\sqrt{S_{n-1}}+1$이다.\n$\\sqrt{S_1}=1$이므로 차례로 $\\sqrt{S_n}=n$, 즉 $S_n=n^2$이다.\n그러므로\n$a_{30}=S_{30}-S_{29}=30^2-29^2$\n$=(30-29)(30+29)$\n$=59$이다."
  }
];
