window.examTitle = "20_매산여고_1학기_기말_고2_수학I";
window.questionBank = [  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$의 일반항이 $a_n=n^2+1$일 때, $a_2+a_7$의 값을 구하면? [3.5점]",
    "choices": [
      "$55$",
      "$56$",
      "$57$",
      "$58$",
      "$59$"
    ],
    "images": [],
    "answer": "①",
    "solution": "일반항에 $n=2$, $n=7$을 각각 대입하면\n$a_2=2^2+1=5$이고\n$a_7=7^2+1=50$이다.\n따라서\n$a_2+a_7=5+50=55$이다.\n\n그러므로 정답은 ①이다."
  },  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "다음 식\n$\\sum_{k=1}^{19}\\frac{3k}{k+6}+\\sum_{k=1}^{19}\\frac{18}{k+6}$\n의 값을 구하면? [3.6점]",
    "choices": [
      "$55$",
      "$56$",
      "$57$",
      "$58$",
      "$59$"
    ],
    "images": [],
    "answer": "③",
    "solution": "두 합의 범위가 같으므로 같은 $k$에 대한 항끼리 더하면\n$\\frac{3k}{k+6}+\\frac{18}{k+6}=\\frac{3k+18}{k+6}=3$이다.\n따라서 주어진 값은\n$\\sum_{k=1}^{19}\\left(\\frac{3k}{k+6}+\\frac{18}{k+6}\\right)$\n$=\\sum_{k=1}^{19}3$\n$=3\\cdot19=57$이다.\n\n그러므로 정답은 ③이다."
  },  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "첫째항이 $-3$이고, $a_7=9$인 등차수열 $\\{a_n\\}$에서 $a_{10}$의 값을 구하면? [3.7점]",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "공차를 $d$라 하면\n$a_7=a_1+6d$이므로\n$9=-3+6d$\n$6d=12$\n$d=2$이다.\n따라서\n$a_{10}=a_7+3d=9+3\\cdot2=15$이다.\n\n그러므로 정답은 ⑤이다."
  },  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$은 첫째항이 $-3$, 공비가 $2$인 등비수열이다. 이 등비수열의 제6항인 $a_6$의 값을 구하면? [3.9점]",
    "choices": [
      "$-96$",
      "$-98$",
      "$-100$",
      "$-102$",
      "$-104$"
    ],
    "images": [],
    "answer": "①",
    "solution": "첫째항이 $a_1=-3$, 공비가 $r=2$인 등비수열이므로\n$a_n=a_1r^{n-1}$이다.\n따라서\n$a_6=-3\\cdot2^5=-3\\cdot32=-96$이다.\n\n그러므로 정답은 ①이다."
  },  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "첫째항이 $97$, 공차가 $-3$인 등차수열 $\\{a_n\\}$에서 처음으로 $2$보다 작게 되는 항은 몇 번째 항인지 구하면? [3.9점]",
    "choices": [
      "$32$",
      "$33$",
      "$34$",
      "$35$",
      "$36$"
    ],
    "images": [],
    "answer": "②",
    "solution": "일반항은\n$a_n=97+(n-1)(-3)=100-3n$이다.\n처음으로 $2$보다 작아지는 항의 번호 $n$은\n$100-3n<2$\n$-3n<-98$\n$n>\\frac{98}{3}$을 만족한다.\n따라서 이를 만족하는 가장 작은 자연수는 $n=33$이다. 실제로\n$a_{32}=4>2$, $a_{33}=1<2$이다.\n\n그러므로 정답은 ②이다."
  },  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "함수 $f(x)$가 다음 조건을 만족시킬 때, $f\\left(\\frac{44}{3}\\right)$의 값을 구하면? [3.8점]\n\n<div class=\"exam-box\">\n<p class=\"exam-box-title\">&lt;조건&gt;</p>\n가. 모든 실수 $x$에 대하여 $f(x+2)=f(x)$이다.<br>\n나. $0\\le x<2$일 때, $f(x)=\\cos\\frac{\\pi}{2}x$\n</div>",
    "choices": [
      "$-\\frac{\\sqrt3}{2}$",
      "$-\\frac12$",
      "$0$",
      "$\\frac12$",
      "$\\frac{\\sqrt3}{2}$"
    ],
    "images": [],
    "answer": "④",
    "solution": "첫 번째 조건에 따라 함수 $f(x)$는 주기가 $2$이다.\n$\\frac{44}{3}=14+\\frac23=7\\cdot2+\\frac23$이므로\n$f\\left(\\frac{44}{3}\\right)=f\\left(\\frac23\\right)$이다.\n두 번째 조건에서 $0\\le\\frac23<2$이므로\n$f\\left(\\frac23\\right)=\\cos\\left(\\frac{\\pi}{2}\\cdot\\frac23\\right)$\n$=\\cos\\frac{\\pi}{3}=\\frac12$이다.\n\n따라서 정답은 ④이다."
  },  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "7개의 수 $\\sqrt3, a, b, c, d, e, 5$가 이 순서대로 등차수열을 이룰 때, $a+2b+4c+2d+e$의 값을 구하면? [4.0점]",
    "choices": [
      "$20+3\\sqrt3$",
      "$20+5\\sqrt3$",
      "$25+3\\sqrt3$",
      "$25+5\\sqrt3$",
      "$25+7\\sqrt3$"
    ],
    "images": [],
    "answer": "④",
    "solution": "공차를 $r$라 하면 첫째항과 일곱째항의 차이는 $6r$이므로\n$6r=5-\\sqrt3$, 즉 $r=\\frac{5-\\sqrt3}{6}$이다.\n따라서\n$a=\\sqrt3+r$, $b=\\sqrt3+2r$, $c=\\sqrt3+3r$,\n$d=\\sqrt3+4r$, $e=\\sqrt3+5r$이다.\n그러므로\n$a+2b+4c+2d+e$\n$=10\\sqrt3+(1+4+12+8+5)r$\n$=10\\sqrt3+30\\cdot\\frac{5-\\sqrt3}{6}$\n$=10\\sqrt3+5(5-\\sqrt3)$\n$=25+5\\sqrt3$이다.\n\n따라서 정답은 ④이다."
  },  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "삼각형 $ABC$에서 다음 등식이 성립할 때, 삼각형 $ABC$는 어떤 삼각형인가? [3.8점]\n\n<div class=\"exam-box\">\n$\\sin^2B+\\sin^2C=2\\sin B\\sin(A+B)$\n</div>",
    "choices": [
      "정삼각형",
      "$A=90^\\circ$인 직각삼각형",
      "$B=90^\\circ$인 직각삼각형",
      "$a=b$인 이등변삼각형",
      "$b=c$인 이등변삼각형"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "삼각형의 내각의 합에서 $A+B=180^\\circ-C$이므로\n$\\sin(A+B)=\\sin(180^\\circ-C)=\\sin C$이다.\n주어진 등식은\n$\\sin^2B+\\sin^2C=2\\sin B\\sin C$\n이 되고, 이를 정리하면\n$(\\sin B-\\sin C)^2=0$이다.\n따라서 $\\sin B=\\sin C$이다.\n삼각형의 각 $B,C$에 대해 이 등식은 $B=C$를 뜻한다.\n(다른 경우인 $B+C=180^\\circ$이면 $A=0^\\circ$가 되어 삼각형이 될 수 없다.)\n따라서 사인 법칙에 의해 $b=c$이고, 삼각형 $ABC$는 $b=c$인 이등변삼각형이다.\n\n그러므로 정답은 ⑤이다."
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "등비수열 $\\{a_n\\}$에서\n$a_1 + a_2 + a_3 + \\cdots + a_8 = 16$, $a_9 + a_{10} + a_{11} + \\cdots + a_{16} = 24$\n일 때, $a_1 + a_2 + a_3 + \\cdots + a_{24}$의 값을 구하면? [4.0점]",
    "choices": [
      "$75$",
      "$76$",
      "$77$",
      "$78$",
      "$79$"
    ],
    "images": [],
    "answer": "②",
    "solution": "첫 여덟 항의 합은 $16$이고, 다음 여덟 항은 각 항이 앞의 여덟 항에 공비를 여덟 번 곱한 것과 같으므로\n$a_9+\\cdots+a_{16}=r^8(a_1+\\cdots+a_8)$이다.\n따라서\n$24=16r^8$\n$r^8=\\frac32$이다.\n세 번째 여덟 항의 합은\n$a_{17}+\\cdots+a_{24}=r^{16}(a_1+\\cdots+a_8)$\n$=16(r^8)^2$\n$=16\\left(\\frac32\\right)^2$\n$=36$이다.\n그러므로 첫 24항의 합은\n$16+24+36=76$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "아래 그림과 같은 삼각형 $ABC$에서 $\\overline{AB}=8$, $\\overline{AC}=4$이고 $A=120^\\circ$이다. $\\angle A$의 이등분선이 $\\overline{BC}$와 만나는 점을 $D$라 할 때, $\\overline{AD}$의 길이를 구하면? [3.9점]<br><br><img src=\"assets/images/20_매산여고_1학기_기말_고2_수학I/q10.png\" class=\"exam-img\">",
    "choices": [
      "$\\frac{8}{3}$",
      "$3$",
      "$\\frac{10}{3}$",
      "$\\frac{11}{3}$",
      "$4$"
    ],
    "images": [
      "assets/images/20_매산여고_1학기_기말_고2_수학I/q10.png"
    ],
    "answer": "①",
    "solution": "각의 이등분선 정리에 따라\n$BD:DC=AB:AC=8:4=2:1$이다.\n$DC=t$라 하면 $BD=2t$이다.\n$AD=x$라 두면 $\\angle BAD=\\angle CAD=60^\\circ$이다.\n삼각형 $ABD$에서 코사인 법칙을 쓰면\n$(2t)^2=x^2+8^2-2\\cdot x\\cdot8\\cos60^\\circ$\n$4t^2=x^2+64-8x$이다.\n삼각형 $ACD$에서도\n$t^2=x^2+4^2-2\\cdot x\\cdot4\\cos60^\\circ$\n$t^2=x^2+16-4x$이다.\n두 번째 식의 양변에 $4$를 곱해 첫 번째 식의 왼쪽과 맞추면\n$4t^2=4x^2+64-16x$이다.\n따라서\n$x^2+64-8x=4x^2+64-16x$\n$3x^2-8x=0$\n$x(3x-8)=0$이다.\n$AD=x>0$이므로\n$x=\\frac83$이다.\n\n그러므로 정답은 ①이다."
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "부등식 $\\cos^2 x - 3\\cos x - a + 8 \\ge 0$이 모든 $x$에 대하여 항상 성립하도록 하는 실수 $a$의 최댓값을 구하면? [4.0점]",
    "choices": [
      "$\\frac{23}{8}$",
      "$\\frac{23}{4}$",
      "$5$",
      "$6$",
      "$\\frac{23}{2}$"
    ],
    "images": [],
    "answer": "④",
    "solution": "$t=\\cos x$라 두면 $-1\\le t\\le1$이다.\n주어진 식의 왼쪽은\n$t^2-3t+8-a$\n$=\\left(t-\\frac32\\right)^2+\\frac{23}{4}-a$이다.\n$-1\\le t\\le1$에서 $t$는 $\\frac32$보다 작으므로\n$\\left(t-\\frac32\\right)^2$의 최솟값은 $t=1$일 때의 $\\frac14$이다.\n따라서 전체 식의 최솟값은\n$\\frac14+\\frac{23}{4}-a=6-a$이다.\n모든 $x$에서 부등식이 성립하려면\n$6-a\\ge0$이어야 한다.\n따라서 $a\\le6$이고, 최댓값은 $6$이다.\n\n그러므로 정답은 ④이다."
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "그림과 같이 지면에 수직으로 서 있는 나무의 높이 $\\overline{PQ}$를 구하기 위하여 $30\\mathrm{m}$만큼 떨어진 두 지점 $A, B$에서 각의 크기를 측정하였더니 $\\angle PAQ = 30^\\circ$, $\\angle QAB = 75^\\circ$, $\\angle QBA = 60^\\circ$이었다. 이때 나무의 높이 $\\overline{PQ}$를 구하면? [4.1점]<br><br><img src=\"assets/images/20_매산여고_1학기_기말_고2_수학I/q12.png\" class=\"exam-img\">",
    "choices": [
      "$15\\mathrm{m}$",
      "$16\\mathrm{m}$",
      "$15\\sqrt{2}\\mathrm{m}$",
      "$15\\sqrt{3}\\mathrm{m}$",
      "$15\\sqrt{6}\\mathrm{m}$"
    ],
    "images": [
      "assets/images/20_매산여고_1학기_기말_고2_수학I/q12.png"
    ],
    "answer": "③",
    "solution": "나무가 지면에 수직이므로 $\\angle PQB=90^\\circ$이다.\n삼각형 $AQB$에서\n$\\angle QAB=75^\\circ$, $\\angle QBA=60^\\circ$이므로\n$\\angle AQB=45^\\circ$이다.\n사인 법칙으로\n$\\frac{AQ}{\\sin60^\\circ}=\\frac{AB}{\\sin45^\\circ}$이다.\n$AB=30$을 대입하면\n$AQ=30\\cdot\\frac{\\sqrt3/2}{\\sqrt2/2}=15\\sqrt6$이다.\n직각삼각형 $AQP$에서 $\\angle PAQ=30^\\circ$이므로\n$\\tan30^\\circ=\\frac{PQ}{AQ}$이다.\n따라서\n$PQ=AQ\\tan30^\\circ$\n$=15\\sqrt6\\cdot\\frac1{\\sqrt3}$\n$=15\\sqrt2\\text{ m}$이다.\n\n그러므로 정답은 ③이다."
  },  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "이차방정식 $x^2 - 3x - 2 = 0$이 두 근을 $\\alpha$, $\\beta$라 할 때, $\\frac{1}{8}\\sum_{k=1}^{15} k(k+\\alpha)(k+\\beta)$의 값을 구하면? [4.1점]",
    "choices": [
      "$2235$",
      "$2240$",
      "$2245$",
      "$2250$",
      "$2255$"
    ],
    "images": [],
    "answer": "①",
    "solution": "이차방정식의 근과 계수의 관계에 따라\n$\\alpha+\\beta=3$, $\\alpha\\beta=-2$이다.\n따라서\n$(k+\\alpha)(k+\\beta)$\n$=k^2+(\\alpha+\\beta)k+\\alpha\\beta$\n$=k^2+3k-2$이다.\n그러므로\n$k(k+\\alpha)(k+\\beta)=k^3+3k^2-2k$이다.\n합의 공식에 $n=15$를 대입하면\n$\\sum_{k=1}^{15}k=\\frac{15\\cdot16}{2}=120$,\n$\\sum_{k=1}^{15}k^2=\\frac{15\\cdot16\\cdot31}{6}=1240$,\n$\\sum_{k=1}^{15}k^3=\\left(\\frac{15\\cdot16}{2}\\right)^2=120^2=14400$이다.\n주어진 값은\n$\\frac18(14400+3\\cdot1240-2\\cdot120)$\n$=\\frac{17880}{8}$\n$=2235$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "모든 항이 양수인 수열 $a_1, a_2, a_3, \\cdots, a_{14}$이 다음 조건을 만족시킨다.\n\n<div class=\"exam-box\">\n<p class=\"exam-box-title\">&lt;조건&gt;</p>\n가. $\\frac{a_2}{a_1}=\\frac{a_4}{a_3}=\\frac{a_6}{a_5}=\\frac{a_8}{a_7}=\\frac{a_{10}}{a_9}=\\frac{a_{12}}{a_{11}}=\\frac{a_{14}}{a_{13}}=3$<br>\n나. $a_{2n-1}=4n-3$ ($n=1, 2, 3, 4, 5, 6, 7$)\n</div>\n\n첫째항부터 제 $n$항까지 합 $S_n$에 대하여 $S_{14}$의 값을 구하면? [4.0점]",
    "choices": [
      "$336$",
      "$343$",
      "$357$",
      "$364$",
      "$392$"
    ],
    "images": [],
    "answer": "④",
    "solution": "조건 나에 따라 홀수 번째 항은\n$a_{2n-1}=4n-3$이다.\n조건 가에 따라 각 홀수 번째 항의 바로 다음 짝수 번째 항은 그 세 배이다.\n따라서\n$a_{2n}=3a_{2n-1}=3(4n-3)$이다.\n$n$번째 홀수 항과 다음 짝수 항의 합은\n$a_{2n-1}+a_{2n}=4(4n-3)$이다.\n그러므로\n$S_{14}=\\sum_{n=1}^{7}4(4n-3)$\n$=4\\left(4\\sum_{n=1}^{7}n-3\\cdot7\\right)$\n$=4(4\\cdot28-21)$\n$=4\\cdot91$\n$=364$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "$0 \\le x < \\pi$일 때, 방정식 $\\sin\\left\\{\\pi\\sin\\left(\\frac{\\pi}{2}+x\\right)\\right\\}=0$의 모든 근의 합을 구하면? [4.1점]",
    "choices": [
      "$0$",
      "$\\frac{\\pi}{2}$",
      "$\\frac{3\\pi}{4}$",
      "$\\pi$",
      "$\\frac{3\\pi}{2}$"
    ],
    "images": [],
    "answer": "②",
    "solution": "$\\sin\\left(\\frac\\pi2+x\\right)=\\cos x$이므로 방정식은\n$\\sin(\\pi\\cos x)=0$이 된다.\n$\\sin y=0$일 필요충분조건은 $y=k\\pi$ ($k$는 정수)이므로\n$\\pi\\cos x=k\\pi$,\n$\\cos x=k$이다.\n$0\\le x<\\pi$에서 $\\cos x$의 값은 $1$부터 $-1$에 가까워지며 $-1$은 되지 않는다.\n이 구간에서 정수인 코사인 값은 $1$과 $0$이다.\n$\\cos x=1$이면 $x=0$이고,\n$\\cos x=0$이면 $x=\\frac\\pi2$이다.\n따라서 모든 근의 합은\n$0+\\frac\\pi2=\\frac\\pi2$이다.\n\n그러므로 정답은 ②이다."
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "$-\\frac{\\pi}{2} \\le x \\le \\frac{\\pi}{2}$일 때, 함수 $f(x)=[2\\cos x]$에 대하여 옳은 것만을 &lt;보기&gt;에서 있는 대로 고른 것은? [4.1점]\n(단, $[x]$는 $x$보다 크지 않은 최대의 정수이다.)\n\n<div class=\"exam-box\">\n<p class=\"exam-box-title\">&lt;보기&gt;</p>\nㄱ. 치역은 $\\{0, 1, 2\\}$이다.<br>\nㄴ. 함수 $y=f(x)$의 그래프는 직선 $x=0$에 대하여 대칭이다.<br>\nㄷ. $1 \\le f(x) < 2$를 만족시키는 $x$의 값의 범위는 $-\\frac{\\pi}{3} \\le x \\le \\frac{\\pi}{3}$이다.\n</div>",
    "choices": [
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "images": [],
    "answer": "③",
    "solution": "ㄱ. $-\\frac\\pi2\\le x\\le\\frac\\pi2$에서 $0\\le\\cos x\\le1$이므로\n$0\\le2\\cos x\\le2$이다.\n따라서 $[2\\cos x]$의 값은 $0,1,2$이고 치역은 $\\{0,1,2\\}$이다.\nㄱ은 참이다.\n\nㄴ. $\\cos(-x)=\\cos x$이므로\n$f(-x)=[2\\cos(-x)]=[2\\cos x]=f(x)$이다.\n따라서 그래프는 직선 $x=0$에 대하여 대칭이다.\nㄴ은 참이다.\n\nㄷ. $1\\le[2\\cos x]<2$이려면\n$1\\le2\\cos x<2$이어야 한다.\n왼쪽 부등식은 $-\\frac\\pi3\\le x\\le\\frac\\pi3$을 뜻하고,\n오른쪽 부등식은 $x\\ne0$을 뜻한다. 실제 범위는\n$-\\frac\\pi3\\le x<0$ 또는 $0<x\\le\\frac\\pi3$이다.\n따라서 보기의 닫힌 구간과 같지 않아 ㄷ은 거짓이다.\n\n옳은 것은 ㄱ, ㄴ이므로 정답은 ③이다."
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에 대하여 옳은 것만을 &lt;보기&gt;에서 있는 대로 고른 것은? [4.2점]\n\n<div class=\"exam-box\">\n<p class=\"exam-box-title\">&lt;보기&gt;</p>\nㄱ. 수열 $\\{a_n\\}$이 등차수열이면 수열 $\\{a_{2n}\\}$도 등차수열이다.<br>\nㄴ. 수열 $\\{a_n\\}$이 등비수열이면 수열 $\\{a_{n^2}\\}$도 등비수열이다.<br>\nㄷ. $a_{2n-1}=2n-1$이면 $a_{2n}=2n$이다.<br>\nㄹ. $a_{n+1}=4n+1$이면 $a_n=4n-3$ ($n \\ge 2$)이다.\n</div>",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄱ, ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄹ"
    ],
    "images": [],
    "answer": "③",
    "solution": "ㄱ. 등차수열의 일반항을 $a_n=a_1+(n-1)d$라 하면\n$a_{2n}=a_1+(2n-1)d$이다.\n연속한 두 항의 차는\n$a_{2(n+1)}-a_{2n}=2d$로 일정하다.\n따라서 $\\{a_{2n}\\}$도 등차수열이므로 ㄱ은 참이다.\n\nㄴ. 등비수열 $a_n=2^{n-1}$을 생각하면\n$a_{n^2}=2^{n^2-1}$이고, 연속한 항의 비는\n$\\frac{a_{(n+1)^2}}{a_{n^2}}=2^{2n+1}$이다.\n이 비가 일정하지 않으므로 $\\{a_{n^2}\\}$은 등비수열이 아니다.\n따라서 ㄴ은 거짓이다.\n\nㄷ. 조건은 홀수 번째 항만 정하고 짝수 번째 항은 정하지 않는다.\n예를 들어 $a_{2n-1}=2n-1$, $a_{2n}=0$ ($n=1,2,3,\\ldots$)으로 두면\n주어진 조건은 만족하지만 $a_{2n}=2n$은 성립하지 않는다.\n따라서 ㄷ은 거짓이다.\n\nㄹ. $m=n+1$이라 두면 $m\\ge2$이고\n$a_m=4(m-1)+1=4m-3$이다.\n따라서 ㄹ은 참이다.\n\n옳은 것은 ㄱ, ㄹ이므로 정답은 ③이다."
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에 대하여\n$a_{4n-3}=\\frac{1}{3^n}$, $a_{4n-2}=9^n$, $a_{4n-1}=81^n$, $a_{4n}=27$ ($n=1, 2, 3, \\cdots$)\n일 때, 다음 식\n$$\\sum_{k=1}^{16}\\log_3 a_{2k-1} + \\sum_{k=1}^{16}\\log_3 a_{2k}$$\n의 값을 구하면? [4.3점]",
    "choices": [
      "$188$",
      "$192$",
      "$196$",
      "$200$",
      "$204$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "첫째 합에는 홀수 번째 항이 들어간다.\n$n=1,2,\\ldots,8$에 대하여 홀수 번째 인덱스는 $4n-3$, $4n-1$이다.\n따라서\n$\\log_3a_{4n-3}=-n$,\n$\\log_3a_{4n-1}=4n$이고\n$\\sum_{k=1}^{16}\\log_3a_{2k-1}$\n$=\\sum_{n=1}^{8}(-n+4n)$\n$=3\\sum_{n=1}^{8}n$\n$=3\\cdot36=108$이다.\n\n둘째 합에는 짝수 번째 항이 들어간다.\n$\\log_3a_{4n-2}=2n$,\n$\\log_3a_{4n}=3$이므로\n$\\sum_{k=1}^{16}\\log_3a_{2k}$\n$=\\sum_{n=1}^{8}(2n+3)$\n$=2\\cdot36+3\\cdot8$\n$=96$이다.\n따라서 전체 합은\n$108+96=204$이다.\n\n그러므로 정답은 ⑤이다."
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "단답형",
    "content": "다음 두 학생 중 어느 학생의 적립금의 원리합계가 얼마나 더 많은지 구하여라. (단, $1.007^{36}=1.28$, $1.006^{18}=1.12$로 계산한다.) [4점]\n\n<div class=\"exam-box\">\n진아 : 월이율이 $0.7\\%$이고, $1$개월마다 복리로 매월 초에 $20$만원씩 $36$개월 동안 적립할 때, $36$개월 말까지 적립금의 원리합계<br>\n윤민 : 월이율이 $0.6\\%$이고, $1$개월마다 복리로 매월 초에 $40$만원씩 $18$개월 동안 적립할 때, $18$개월 말까지 적립금의 원리합계\n</div>\n\n($\\qquad$)의 적립금의 원리합계가 ($\\qquad$)원 더 많다.",
    "choices": [],
    "images": [],
    "answer": "진아, 8000",
    "solution": "매월 초에 납입하므로 각 납입금은 그 달 말까지 한 달분의 이자가 붙는다.\n매월 말 기준으로 모은 금액은\n$P(1+i)+P(1+i)^2+\\cdots+P(1+i)^n$이다.\n이를 등비수열의 합으로 쓰면\n$P(1+i)\\frac{(1+i)^n-1}{i}$이다.\n\n진아의 적립금은 만 원 단위로\n$20\\cdot1.007\\cdot\\frac{1.007^{36}-1}{0.007}$\n$=20\\cdot1.007\\cdot\\frac{1.28-1}{0.007}$\n$=20\\cdot1.007\\cdot40$\n$=805.6$만 원이다.\n\n윤민의 적립금은 만 원 단위로\n$40\\cdot1.006\\cdot\\frac{1.006^{18}-1}{0.006}$\n$=40\\cdot1.006\\cdot\\frac{1.12-1}{0.006}$\n$=40\\cdot1.006\\cdot20$\n$=804.8$만 원이다.\n차이는\n$805.6-804.8=0.8$만 원\n$=8000$원이다.\n\n따라서 진아의 적립금 원리합계가 8000원 더 많다."
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "단답형",
    "content": "첫째항이 $3$, 공차가 $4$인 등차수열의 첫째항부터 제$9$항까지의 합을 구하여라. [4점]",
    "choices": [],
    "images": [],
    "answer": "171",
    "solution": "첫째항이 $3$, 공차가 $4$인 등차수열의 제9항은\n$a_9=3+(9-1)\\cdot4$\n$=3+32$\n$=35$이다.\n첫째항부터 제9항까지의 합은\n$S_9=\\frac92(a_1+a_9)$\n$=\\frac92(3+35)$\n$=\\frac92\\cdot38$\n$=171$이다.\n\n따라서 구하는 합은 $171$이다."
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "삼각형 $ABC$에서 $a=7$, $b=9$, $c=6$일 때, 다음 물음에 답하라. [7점] (부분점수 있음.)\n\n1) $\\cos B$의 값을 구하여라. [3점]\n\n2) 삼각형 $ABC$의 넓이를 구하여라. [4점]",
    "choices": [],
    "images": [],
    "answer": "1) $\\cos B=\\frac1{21}$, 2) $2\\sqrt{110}$",
    "solution": "1) 코사인 법칙을 이용하면\n$b^2=a^2+c^2-2ac\\cos B$이다.\n주어진 $a=7$, $b=9$, $c=6$을 대입하면\n$9^2=7^2+6^2-2\\cdot7\\cdot6\\cos B$\n$81=85-84\\cos B$\n$84\\cos B=4$\n$\\cos B=\\frac1{21}$이다.\n\n2) 삼각형의 넓이는 두 변과 그 끼인각으로\n$\\frac12ac\\sin B$이다.\n$\\cos B=\\frac1{21}$이고 $B$는 삼각형의 내각이므로\n$\\sin B=\\sqrt{1-\\cos^2B}$\n$=\\sqrt{1-\\frac1{441}}$\n$=\\frac{2\\sqrt{110}}{21}$이다.\n따라서 넓이는\n$\\frac12\\cdot7\\cdot6\\cdot\\frac{2\\sqrt{110}}{21}$\n$=2\\sqrt{110}$이다."
  },
  {
    "id": 22,
    "questionNumber": 22,
    "questionType": "서술형",
    "content": "수열 $a_n$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하면 $S_n = 2n^2 + 1$이다. 이때 $10 \\le a_n \\le 40$을 만족하는 모든 항의 합을 구하시오. [7점] (부분점수 있음.)\n\n1) 일반항 $a_n$을 구하여라. [3점]\n\n2) $10 \\le a_n \\le 40$을 만족시키는 자연수 $n$의 개수를 구하여라. [2점]\n\n3) $10 \\le a_n \\le 40$을 만족하는 모든 항의 합을 구하여라. [2점]",
    "choices": [],
    "images": [],
    "answer": "1) $a_1=3$, $a_n=4n-2$ ($n\\ge2$); 2) 8개; 3) 192",
    "solution": "1) 첫째항은 부분합과 같으므로\n$a_1=S_1=2\\cdot1^2+1=3$이다.\n$n\\ge2$일 때\n$a_n=S_n-S_{n-1}$이므로\n$a_n=(2n^2+1)-\\{2(n-1)^2+1\\}$\n$=2n^2-2(n^2-2n+1)$\n$=4n-2$이다.\n따라서 $a_1=3$, $a_n=4n-2\\ (n\\ge2)$이다.\n\n2) $n\\ge2$에서 주어진 범위를 풀면\n$10\\le4n-2\\le40$\n$12\\le4n\\le42$\n$3\\le n\\le10.5$이다.\n$n$은 자연수이므로 $n=3,4,\\ldots,10$이다.\n따라서 해당하는 항은 $8$개이다.\n\n3) 이 항들은 $10,14,18,\\ldots,38$인 등차수열이다.\n그 합은\n$\\frac82(10+38)$\n$=4\\cdot48$\n$=192$이다."
  },  {
    "id": 23,
    "questionNumber": 23,
    "questionType": "서술형",
    "content": "다음 물음에 답하시오. [7점] (부분점수 있음.)\n\n1) 수열 $\\{a_n\\}$에 대하여\n$$a_n = \\frac{1}{\\sqrt{2n-1}+\\sqrt{2n+1}}$$\n일 때, $\\sum_{k=1}^n a_k = 7$이다. 자연수 $n$의 값을 $p$라 할 때, $p$의 값을 구하여라. [3점]\n\n2) 1)에 나온 상수 $p$를 이용하여 수열 $\\{a_n\\}$에 대하여 $\\sum_{k=1}^n a_k = n^2 + 5n$일 때, $\\sum_{k=1}^p \\frac{1}{a_k a_{k+1}}$을 구하여라. [4점]",
    "choices": [],
    "images": [],
    "answer": "1) $p=112$, 2) $\\frac{28}{345}$",
    "solution": "1) 각 항을 유리화하면\n$a_k=\\frac1{\\sqrt{2k-1}+\\sqrt{2k+1}}$\n$=\\frac{\\sqrt{2k+1}-\\sqrt{2k-1}}{(2k+1)-(2k-1)}$\n$=\\frac{\\sqrt{2k+1}-\\sqrt{2k-1}}2$이다.\n따라서 합은 망원합으로\n$\\sum_{k=1}^{n}a_k=\\frac12(\\sqrt3-1+\\sqrt5-\\sqrt3+\\cdots+\\sqrt{2n+1}-\\sqrt{2n-1})$\n$=\\frac{\\sqrt{2n+1}-1}{2}$이다.\n이 값이 $7$이므로\n$\\frac{\\sqrt{2n+1}-1}{2}=7$\n$\\sqrt{2n+1}=15$\n$2n+1=225$\n$n=112$이다.\n따라서 $p=112$이다.\n\n2) 두 번째 수열의 부분합을 $T_n=n^2+5n$이라 하면\n$n\\ge2$일 때 $a_n=T_n-T_{n-1}$이다.\n따라서 $n\\ge2$에서\n$a_n=(n^2+5n)-\\{(n-1)^2+5(n-1)\\}$\n$=2n+4$이다.\n또한\n$a_1=T_1=1^2+5\\cdot1=6=2\\cdot1+4$이다.\n따라서 모든 자연수 $n$에서 $a_n=2n+4$이다.\n그러므로\n$a_ka_{k+1}=(2k+4)(2k+6)=4(k+2)(k+3)$이다.\n주어진 합의 한 항을 부분분수로 나타내면\n$\\frac1{a_ka_{k+1}}=\\frac1{4(k+2)(k+3)}$\n$=\\frac14\\left(\\frac1{k+2}-\\frac1{k+3}\\right)$이다.\n따라서\n$\\sum_{k=1}^{p}\\frac1{a_ka_{k+1}}$\n$=\\frac14\\left(\\frac13-\\frac1{115}\\right)$\n$=\\frac14\\cdot\\frac{112}{345}$\n$=\\frac{28}{345}$이다."
  }];
