var examData = window.examData = {
  "exam": {
    "title": "2021학년도 순천금당고등학교 2학년 1학기 기말고사 수학 I",
    "school": "순천금당고등학교",
    "grade": 2,
    "term": "1학기 기말",
    "subject": "수학 I",
    "year": 2021
  },
  "questions": [
    {
      "id": 1,
      "questionNumber": 1,
      "questionType": "객관식",
      "content": "방정식 $\\sin x + \\frac{1}{2} = 0$의 실근의 개수를 구하면? (단, $0 \\le x < 2\\pi$) [3.8점]",
      "choices": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ],
      "answer": "③",
      "solution": "주어진 방정식을 정리하면\n$\\sin x=-\\dfrac12$이다.\n$0\\le x<2\\pi$에서 사인값이 $-\\dfrac12$인 각은 제3사분면과 제4사분면에 있다.\n기준각은 $\\dfrac\\pi6$이므로\n$x=\\pi+\\dfrac\\pi6=\\dfrac{7\\pi}{6}$,\n$x=2\\pi-\\dfrac\\pi6=\\dfrac{11\\pi}{6}$이다.\n구간에서 실근은 두 개이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 2,
      "questionNumber": 2,
      "questionType": "객관식",
      "content": "$0 \\le x \\le 4$일 때, 부등식 $\\tan\\frac{\\pi}{2}x \\ge 100$을 만족하는 정수 $x$의 개수를 구하면? [3.8점]",
      "choices": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ],
      "answer": "①",
      "solution": "정수 $x$는 $0,1,2,3,4$이다.\n$x=1,3$이면 $\\dfrac\\pi2x$가 각각 $\\dfrac\\pi2,\\dfrac{3\\pi}{2}$이므로 탄젠트값이 정의되지 않는다.\n나머지 정수에 대해서는\n$x=0,2,4$일 때 $\\tan\\dfrac\\pi2x=0$이다.\n따라서 이 세 값은 모두 $0\\ge100$을 만족하지 않는다.\n조건을 만족하는 정수는 없다.\n그러므로 구하는 개수는 0이고, 정답은 ①이다."
    },
    {
      "id": 3,
      "questionNumber": 3,
      "questionType": "객관식",
      "content": "$\\sin(\\pi+\\frac{\\pi}{4}) + \\cos(\\frac{\\pi}{2}-\\frac{\\pi}{3})$의 값을 구하면? [3.8점]",
      "choices": [
        "\\frac{\\sqrt{3}-1}{2}",
        "\\frac{\\sqrt{2}-1}{2}",
        "\\frac{\\sqrt{3}-\\sqrt{2}}{2}",
        "\\frac{\\sqrt{2}-\\sqrt{3}}{2}",
        "\\frac{1-\\sqrt{2}}{2}"
      ],
      "answer": "③",
      "solution": "삼각함수의 각을 정리한다.\n$\\sin\\left(\\pi+\\dfrac\\pi4\\right)=-\\sin\\dfrac\\pi4=-\\dfrac{\\sqrt2}{2}$이다.\n또\n$\\cos\\left(\\dfrac\\pi2-\\dfrac\\pi3\\right)=\\cos\\dfrac\\pi6=\\dfrac{\\sqrt3}{2}$이다.\n따라서 주어진 값은\n$-\\dfrac{\\sqrt2}{2}+\\dfrac{\\sqrt3}{2}$\n$=\\dfrac{\\sqrt3-\\sqrt2}{2}$이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 4,
      "questionNumber": 4,
      "questionType": "객관식",
      "content": "$b=6, c=4, \\sin A = \\frac{\\sqrt{3}}{2}$인 $\\triangle\\mathrm{ABC}$의 넓이를 구하면? [3.8점]",
      "choices": [
        "2\\sqrt{3}",
        "3\\sqrt{3}",
        "4\\sqrt{3}",
        "5\\sqrt{3}",
        "6\\sqrt{3}"
      ],
      "answer": "⑤",
      "solution": "두 변 $b,c$와 그 끼인각 $A$가 주어졌으므로 삼각형의 넓이는\n$\\dfrac12bc\\sin A$이다.\n주어진 값을 대입하면\n$\\dfrac12\\times6\\times4\\times\\dfrac{\\sqrt3}{2}$\n$=12\\times\\dfrac{\\sqrt3}{2}$\n$=6\\sqrt3$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 5,
      "questionNumber": 5,
      "questionType": "객관식",
      "content": "등차수열 $\\{a_n\\}$에 대하여 $a_2=8, a_6=16$일 때, $a_4$의 값을 구하면? [4.0점]",
      "choices": [
        "9",
        "10",
        "11",
        "12",
        "13"
      ],
      "answer": "④",
      "solution": "등차수열에서 $a_6$은 $a_2$보다 네 칸 뒤의 항이다.\n따라서\n$a_6-a_2=4d$\n$16-8=4d$\n$8=4d$이므로 $d=2$이다.\n$a_4$는 $a_2$보다 두 칸 뒤의 항이므로\n$a_4=a_2+2d$\n$=8+2\\times2=12$이다.\n따라서 정답은 ④이다."
    },
    {
      "id": 6,
      "questionNumber": 6,
      "questionType": "객관식",
      "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n = 3^{n+1}-2$일 때, $a_1+a_3$의 값은? [4.0점]",
      "choices": [
        "59",
        "60",
        "61",
        "62",
        "63"
      ],
      "answer": "③",
      "solution": "부분합의 정의에 따라\n$a_1=S_1=3^{1+1}-2=9-2=7$이다.\n또\n$a_3=S_3-S_2$이다.\n주어진 식에서\n$S_3=3^4-2=81-2=79$,\n$S_2=3^3-2=27-2=25$이므로\n$a_3=79-25=54$이다.\n따라서\n$a_1+a_3=7+54=61$이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 7,
      "questionNumber": 7,
      "questionType": "객관식",
      "content": "두 수 3과 243 사이에 3개의 수 $x_1, x_2, x_3$을 넣어 만든 수열 $3, x_1, x_2, x_3, 243$이 이 순서대로 등비수열을 이룰 때, $x_1+x_2+x_3$의 최솟값을 구하면? [4.0점]",
      "choices": [
        "-123",
        "-63",
        "-3",
        "57",
        "117"
      ],
      "answer": "②",
      "solution": "등비수열의 공비를 $r$이라 하면 다섯 항은\n$3,\\ 3r,\\ 3r^2,\\ 3r^3,\\ 3r^4$이다.\n마지막 항이 243이므로\n$3r^4=243$,\n$r^4=81$이다.\n실수 $r$은 $r=3$ 또는 $r=-3$이다.\n중간 세 수의 합은\n$x_1+x_2+x_3=3r+3r^2+3r^3=3(r+r^2+r^3)$이다.\n$r=3$이면\n$x_1+x_2+x_3=3(3+9+27)=117$이다.\n$r=-3$이면\n$x_1+x_2+x_3=3(-3+9-27)=-63$이다.\n두 값 중 작은 값은 $-63$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 8,
      "questionNumber": 8,
      "questionType": "객관식",
      "content": "첫째항이 6인 등차수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $S_3=S_7$이다. 이때, $S_n$이 최대가 되는 $n$의 값은? [4.0점]",
      "choices": [
        "3",
        "4",
        "5",
        "6",
        "7"
      ],
      "answer": "③",
      "solution": "등차수열의 합 조건에서\n$S_7-S_3=a_4+a_5+a_6+a_7=0$이다.\n네 항이 연속된 등차수열이므로 $a_4+a_7=a_5+a_6$이다.\n따라서\n$a_4+a_5+a_6+a_7=2(a_4+a_7)=0$,\n$a_4+a_7=0$이다.\n공차를 $d$라 하면\n$a_4=6+3d$, $a_7=6+6d$이므로\n$(6+3d)+(6+6d)=0$,\n$12+9d=0$,\n$d=-\\dfrac43$이다.\n이에 따라\n$a_5=6+4\\left(-\\dfrac43\\right)=\\dfrac23$,\n$a_6=6+5\\left(-\\dfrac43\\right)=-\\dfrac23$이다.\n첫째항부터 제5항까지는 모두 양수이므로 $S_n$은 $n=1$부터 $n=5$까지 증가한다.\n제6항부터는 항이 음수이고 공차도 음수이므로 이후의 부분합은 계속 감소한다.\n따라서 $S_n$이 최대가 되는 $n$은 5이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 9,
      "questionNumber": 9,
      "questionType": "객관식",
      "content": "$\\sum_{k=1}^{7} \\frac{1}{(k+1)(k+2)}$의 값을 구하면? [4.0점]",
      "choices": [
        "\\frac{1}{6}",
        "\\frac{2}{9}",
        "\\frac{5}{18}",
        "\\frac{1}{3}",
        "\\frac{7}{18}"
      ],
      "answer": "⑤",
      "solution": "분수의 분모를 인수분해하여 부분분수로 나타낸다.\n$\\dfrac{1}{(k+1)(k+2)}=\\dfrac{1}{k+1}-\\dfrac{1}{k+2}$이다.\n따라서 합은\n$\\displaystyle\\sum_{k=1}^{7}\\left(\\dfrac{1}{k+1}-\\dfrac{1}{k+2}\\right)$\n$=\\left(\\dfrac12-\\dfrac13\\right)+\\left(\\dfrac13-\\dfrac14\\right)+\\cdots+\\left(\\dfrac18-\\dfrac19\\right)$\n$=\\dfrac12-\\dfrac19$\n$=\\dfrac{9-2}{18}=\\dfrac7{18}$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 10,
      "questionNumber": 10,
      "questionType": "객관식",
      "content": "$\\triangle\\mathrm{ABC}$에 대하여 $x$에 대한 이차방정식 $$ax^2-2\\sqrt{b}x\\sin B + \\sin^2 A = 0$$이 중근을 가질 때, $\\triangle\\mathrm{ABC}$는 어떤 삼각형인가? [4.0점]",
      "choices": [
        "정삼각형",
        "$A=90^\\circ$인 직각삼각형",
        "$B=90^\\circ$인 직각삼각형",
        "$a=b$인 이등변삼각형",
        "$b=c$인 이등변삼각형"
      ],
      "answer": "④",
      "solution": "이차방정식이 중근을 가지므로 판별식이 0이다.\n$(-2\\sqrt b\\sin B)^2-4a\\sin^2 A=0$\n$4b\\sin^2B-4a\\sin^2A=0$\n따라서\n$b\\sin^2B=a\\sin^2A$이다.\n삼각형의 외접원의 반지름을 $R$이라 하면 사인법칙에서\n$\\sin A=\\dfrac{a}{2R}$, $\\sin B=\\dfrac{b}{2R}$이다.\n이를 대입하면\n$b\\left(\\dfrac{b}{2R}\\right)^2=a\\left(\\dfrac{a}{2R}\\right)^2$,\n$\\dfrac{b^3}{4R^2}=\\dfrac{a^3}{4R^2}$,\n$b^3=a^3$이다.\n$a,b$는 삼각형의 변의 길이이므로 양수이다.\n따라서 $a=b$이고, 삼각형은 $a=b$인 이등변삼각형이다.\n따라서 정답은 ④이다."
    },
    {
      "id": 11,
      "questionNumber": 11,
      "questionType": "객관식",
      "content": "등차수열 $\\{a_n\\}$에 대하여 $a_1+a_2=3, a_3+a_4=5$일 때, $a_{19}+a_{20}$의 값은? [4.0점]",
      "choices": [
        "21",
        "22",
        "23",
        "24",
        "25"
      ],
      "answer": "①",
      "solution": "첫 번째 조건과 두 번째 조건을 식으로 나타낸다.\n$a_1+a_2=2a_1+d=3$,\n$a_3+a_4=2a_1+5d=5$이다.\n두 번째 식에서 첫 번째 식을 빼면\n$4d=2$,\n$d=\\dfrac12$이다.\n각 항에서 18칸 뒤의 항을 비교하면\n$a_{19}-a_1=18d$, $a_{20}-a_2=18d$이다.\n따라서 두 합의 차는\n$(a_{19}+a_{20})-(a_1+a_2)\n=(a_{19}-a_1)+(a_{20}-a_2)=36d$이다.\n그러므로\n$a_{19}+a_{20}=3+36\\times\\dfrac12=3+18=21$이다.\n따라서 정답은 ①이다."
    },
    {
      "id": 12,
      "questionNumber": 12,
      "questionType": "객관식",
      "content": "진구는 방학 기간을 이용하여 30일 동안 여행하는 계획을 세웠다. 첫째 날에는 $10\\,\\mathrm{km}$를 이동하고 둘째 날부터는 이동 거리를 전날의 $10\\%$씩 줄여서 여행할 때, 30일 동안 진구가 이동할 거리를 구하면? (단, $0.9^{30}=0.04$로 계산한다.) [4.0점]",
      "choices": [
        "96",
        "94",
        "92",
        "90",
        "88"
      ],
      "answer": "①",
      "solution": "하루 이동 거리는 첫째항이 10, 공비가 0.9인 등비수열을 이룬다.\n30일 동안의 이동 거리의 합은\n$S_{30}=10\\dfrac{1-0.9^{30}}{1-0.9}$이다.\n문제에서 $0.9^{30}=0.04$로 계산하므로\n$S_{30}=10\\times\\dfrac{1-0.04}{0.1}$\n$=10\\times\\dfrac{0.96}{0.1}$\n$=10\\times9.6=96$이다.\n따라서 정답은 ①이다."
    },
    {
      "id": 13,
      "questionNumber": 13,
      "questionType": "객관식",
      "content": "원에 내접하는 사각형 $\\mathrm{ABCD}$에서 $\\overline{\\mathrm{AB}}=1, \\overline{\\mathrm{BC}}=2, \\overline{\\mathrm{CD}}=3, \\overline{\\mathrm{DA}}=4$일 때, 사각형 $\\mathrm{ABCD}$의 넓이를 구하면? [4.0점]",
      "choices": [
        "2\\sqrt{3}",
        "3\\sqrt{3}",
        "2\\sqrt{6}",
        "4\\sqrt{6}",
        "8\\sqrt{3}"
      ],
      "answer": "③",
      "solution": "$\\angle ABC=\\theta$라 하자.\n사각형이 원에 내접하므로 마주 보는 각의 합은 $\\pi$이다.\n따라서 $\\angle ADC=\\pi-\\theta$이다.\n대각선 $AC$에 코사인법칙을 각각 적용한다.\n삼각형 $ABC$에서\n$AC^2=1^2+2^2-2\\cdot1\\cdot2\\cos\\theta$\n$=5-4\\cos\\theta$이다.\n삼각형 $ADC$에서\n$AC^2=4^2+3^2-2\\cdot4\\cdot3\\cos(\\pi-\\theta)$\n$=25+24\\cos\\theta$이다.\n두 식은 같은 $AC^2$이므로\n$5-4\\cos\\theta=25+24\\cos\\theta$,\n$-20=28\\cos\\theta$,\n$\\cos\\theta=-\\dfrac57$이다.\n따라서\n$\\sin\\theta=\\sqrt{1-\\cos^2\\theta}$\n$=\\sqrt{1-\\dfrac{25}{49}}=\\dfrac{2\\sqrt6}{7}$이다.\n사각형의 넓이는 두 삼각형의 넓이의 합이다.\n$\\dfrac12\\cdot1\\cdot2\\sin\\theta+\\dfrac12\\cdot4\\cdot3\\sin(\\pi-\\theta)$\n$=\\sin\\theta+6\\sin\\theta=7\\sin\\theta$\n$=7\\cdot\\dfrac{2\\sqrt6}{7}=2\\sqrt6$이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 14,
      "questionNumber": 14,
      "questionType": "객관식",
      "content": "넓이가 9이고 $B=30^\\circ$인 $\\triangle\\mathrm{ABC}$에서 $\\overline{\\mathrm{AC}}$의 길이가 최소가 되도록 하는 $\\overline{\\mathrm{AB}}+\\overline{\\mathrm{BC}}$의 값을 구하면? [4.0점]",
      "choices": [
        "8",
        "10",
        "12",
        "14",
        "16"
      ],
      "answer": "③",
      "solution": "$\\overline{AB}=x$, $\\overline{BC}=y$라 하자.\n넓이가 9이고 끼인각 $B=30^\\circ$이므로\n$\\dfrac12xy\\sin30^\\circ=9$,\n$\\dfrac{xy}{4}=9$,\n$xy=36$이다.\n코사인법칙으로\n$\\overline{AC}^{2}=x^2+y^2-2xy\\cos30^\\circ$\n$=x^2+y^2-36\\sqrt3$이다.\n한편\n$x^2+y^2-2xy=(x-y)^2\\ge0$이므로\n$x^2+y^2\\ge2xy=72$이다.\n따라서 $\\overline{AC}^{2}\\ge72-36\\sqrt3$이고, 등호는 $x=y$일 때 성립한다.\n$xy=36$과 $x=y$로부터 $x=y=6$이다.\n이때 $\\overline{AC}$가 최소가 되며\n$\\overline{AB}+\\overline{BC}=x+y=6+6=12$이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 15,
      "questionNumber": 15,
      "questionType": "객관식",
      "content": "$n$개의 항으로 이루어진 등차수열 $a_1, a_2, a_3, \\cdots, a_n$이 다음 조건을 만족한다.<div class=\"exam-box\"><b>&lt;조건&gt;</b><br>(가) 처음 4개 항의 합은 26이다.<br>(나) 마지막 4개 항의 합은 134이다.<br>(다) $a_1+a_2+a_3+\\cdots+a_n = 260$</div>이때, $n$의 값을 구하면? [4.0점]",
      "choices": [
        "9",
        "10",
        "11",
        "12",
        "13"
      ],
      "answer": "⑤",
      "solution": "첫 네 항의 합과 마지막 네 항의 합을 등차수열의 합으로 나타낸다.\n처음 네 항의 합은\n$4a_1+6d=26$,\n$2a_1+3d=13$이다.\n마지막 네 항은 $a_{n-3},a_{n-2},a_{n-1},a_n$이므로 그 합은\n$4a_1+\\{(n-4)+(n-3)+(n-2)+(n-1)\\}d=134$,\n$4a_1+(4n-10)d=134$이다.\n마지막 네 항의 합에서 처음 네 항의 합을 빼면\n$4(n-4)d=134-26=108$,\n$(n-4)d=27$이다.\n이제 전체 합을\n$S_n=\\dfrac n2\\{2a_1+(n-1)d\\}$로 나타낸다.\n괄호 안은\n$2a_1+(n-1)d=(2a_1+3d)+(n-4)d=13+27=40$이다.\n따라서\n$260=S_n=\\dfrac n2\\cdot40=20n$,\n$n=13$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 16,
      "questionNumber": 16,
      "questionType": "객관식",
      "content": "함수 $y=2\\sin\\frac{1}{4}(x-\\pi)$ ($0 \\le x \\le 10\\pi$)의 그래프와 직선 $y=1$이 만나는 점들 중 서로 다른 두 점 $A, B$와 이 곡선 위의 점 $P$에 대하여 $\\triangle\\mathrm{PAB}$의 넓이의 최댓값을 구하면? (단, 점 $P$는 직선 $y=1$ 위의 점이 아니다.) [4.0점]",
      "choices": [
        "10\\pi",
        "12\\pi",
        "14\\pi",
        "16\\pi",
        "18\\pi"
      ],
      "answer": "②",
      "solution": "$u=\\dfrac{x-\\pi}{4}$라 놓으면 $y=2\\sin u$이고\n$0\\le x\\le10\\pi$에서 $-\\dfrac\\pi4\\le u\\le\\dfrac{9\\pi}{4}$이다.\n직선 $y=1$과 만나는 곳에서는\n$2\\sin u=1$, 즉 $\\sin u=\\dfrac12$이다.\n이 구간에서 가능한 값은\n$u=\\dfrac\\pi6,\\ \\dfrac{5\\pi}{6},\\ \\dfrac{13\\pi}{6}$이다.\n$x=4u+\\pi$를 이용하면 교점의 $x$좌표는\n$\\dfrac{5\\pi}{3},\\ \\dfrac{13\\pi}{3},\\ \\dfrac{29\\pi}{3}$이다.\n따라서 두 교점 사이의 가장 긴 밑변은\n$\\dfrac{29\\pi}{3}-\\dfrac{5\\pi}{3}=8\\pi$이다.\n삼각형의 넓이를 최대로 하려면 점 $P$의 직선 $y=1$까지의 거리가 최대여야 한다.\n곡선의 최솟값은 $-2$이고, 이는 $u=\\dfrac{3\\pi}{2}$일 때 실제로 나타난다.\n따라서 직선 $y=1$과의 최대 거리는 $1-(-2)=3$이다.\n그러므로 삼각형의 넓이의 최댓값은\n$\\dfrac12\\cdot8\\pi\\cdot3=12\\pi$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 17,
      "questionNumber": 17,
      "questionType": "객관식",
      "content": "그림과 같이 점 $\\mathrm{A}(-1, 0)$과 원 $x^2+y^2=1$ 위의 제1사분면에 있는 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{PA}}=\\overline{\\mathrm{PQ}}$가 되도록 하는 원 위의 점 $\\mathrm{Q}$를 잡는다. 다음은 $\\angle\\mathrm{APQ}=\\theta$라 할 때, 삼각형 $\\mathrm{AQP}$의 넓이 $S(\\theta)$를 구하는 과정이다.<div class=\"exam-box\">점 $\\mathrm{P}$가 제1사분면의 점이므로 $0 < \\theta < \\frac{\\pi}{2}$<br>원점 $\\mathrm{O}$에 대하여 $\\angle\\mathrm{AOP} =$ <span class=\"blank-box\">(가)</span> 이므로 삼각형 $\\mathrm{AOP}$에서 코사인법칙에 의하여<br>$\\overline{\\mathrm{PA}}^2 =$ <span class=\"blank-box\">(나)</span><br>따라서 삼각형 $\\mathrm{AQP}$의 넓이 $S(\\theta) = \\frac{1}{2} \\times$ <span class=\"blank-box\">(나)</span> $\\times \\sin\\theta$<br><br><img src=\"assets/images/21_금당고_1학기_기말_고2_수학I/q17.png\" class=\"exam-img\"></div>위의 (가), (나)에 알맞은 식을 각각 $f(\\theta), g(\\theta)$라 할 때, $f\\left(\\frac{\\pi}{3}\\right) \\times g\\left(\\frac{\\pi}{3}\\right)$의 값은? [4.2점]",
      "choices": [
        "\\frac{\\pi}{2}",
        "\\pi",
        "\\frac{2\\pi}{3}",
        "\\frac{3\\pi}{2}",
        "2\\pi"
      ],
      "answer": "⑤",
      "solution": "$AP=PQ$이고 $OA=OP=OQ$이므로 점 $O$와 점 $P$는 선분 $AQ$의 수직이등분선 위에 있다.\n따라서 $OP$는 이등변삼각형 $APQ$의 꼭짓각 $\\angle APQ=\\theta$를 이등분하여\n$\\angle APO=\\dfrac\\theta2$이다.\n삼각형 $AOP$에서 $OA=OP$이므로 밑각도 같아\n$\\angle OAP=\\dfrac\\theta2$이다.\n삼각형의 내각의 합으로부터\n$\\angle AOP=\\pi-\\dfrac\\theta2-\\dfrac\\theta2=\\pi-\\theta$이다.\n그러므로\n$f(\\theta)=\\pi-\\theta$이다.\n코사인법칙을 삼각형 $AOP$에 적용하면\n$PA^2=OA^2+OP^2-2\\cdot OA\\cdot OP\\cos(\\pi-\\theta)$\n$=1^2+1^2-2\\cos(\\pi-\\theta)$\n$=2+2\\cos\\theta$이다.\n따라서 $g(\\theta)=2+2\\cos\\theta$이고,\n$f\\left(\\dfrac\\pi3\\right)=\\dfrac{2\\pi}{3}$,\n$g\\left(\\dfrac\\pi3\\right)=2+2\\cdot\\dfrac12=3$이다.\n따라서\n$f\\left(\\dfrac\\pi3\\right)g\\left(\\dfrac\\pi3\\right)=\\dfrac{2\\pi}{3}\\cdot3=2\\pi$이다.\n따라서 정답은 ⑤이다.",
      "images": [
        "assets/images/21_금당고_1학기_기말_고2_수학I/q17.png"
      ]
    },
    {
      "id": 18,
      "questionNumber": 18,
      "questionType": "객관식",
      "content": "어느 기업에서 이달 초에 퇴직하는 퇴직사원의 퇴직금 100만원을 퇴직 시 해당사원의 희망에 따라 이달 말부터 일정한 금액씩 24개월에 걸쳐 지불하기로 했다. 월이율 $0.8\\%$, 1개월마다 복리로 계산할 때, 매달 지불해야 하는 금액을 구하면? (단, $1.008^{24}=1.2$로 계산한다.) [4.2점]",
      "choices": [
        "42000원",
        "44000원",
        "46000원",
        "48000원",
        "50000원"
      ],
      "answer": "④",
      "solution": "매달 말에 받을 금액을 $R$원이라 하자.\n24개월 뒤의 시점에서 퇴직금 1,000,000원은\n$1,000,000\\times1.008^{24}=1,200,000$원이 된다.\n같은 시점으로 계산하면, 첫 번째 지급액은 23개월 동안 이자가 붙고 마지막 지급액은 이자가 붙지 않는다.\n따라서 24회 지급액의 미래가치는\n$R(1+1.008+1.008^2+\\cdots+1.008^{23})$이다.\n등비수열의 합을 이용하면\n$1+1.008+\\cdots+1.008^{23}=\\dfrac{1.008^{24}-1}{1.008-1}$\n$=\\dfrac{1.2-1}{0.008}=25$이다.\n퇴직금의 미래가치와 24회 지급액의 미래가치는 같으므로\n$25R=1,200,000$,\n$R=48,000$이다.\n따라서 정답은 ④이다."
    },
    {
      "id": 19,
      "questionNumber": 19,
      "questionType": "객관식",
      "content": "닫힌 구간 $[0, \\pi]$에서 $x$에 대한 방정식 $1-2\\sin^2 x + \\sin x - k = 0$의 서로 다른 실근의 개수가 4가 되도록 하는 실수 $k$의 값의 범위가 $a \\le k < b$일 때, $a+8b$의 값은? [4.2점]",
      "choices": [
        "2",
        "4",
        "6",
        "8",
        "10"
      ],
      "answer": "⑤",
      "solution": "$t=\\sin x$라 놓으면 $0\\le x\\le\\pi$에서 $0\\le t\\le1$이다.\n주어진 방정식은\n$1-2t^2+t-k=0$,\n$k=1+t-2t^2$\n$=\\dfrac98-2\\left(t-\\dfrac14\\right)^2$이다.\n$t=0$일 때 식의 값은 1이고, $t=\\dfrac14$일 때 최댓값은 $\\dfrac98$이며, $t=1$일 때 값은 0이다.\n따라서 $1\\le k<\\dfrac98$이면 방정식 $k=1+t-2t^2$의 서로 다른 해 $t$가 두 개이고, 두 값 모두 $0<t<1$이거나 $k=1$일 때 $t=0,\\dfrac12$이다.\n$0<t<1$인 각 값에 대해 $\\sin x=t$는 $0<x<\\pi$에서 두 해를 갖는다.\n특히 $k=1$일 때 $t=0$은 구간의 양 끝 $x=0,\\pi$에서 두 해를 만들고, $t=\\dfrac12$도 두 해를 만든다.\n그러므로 $1\\le k<\\dfrac98$일 때 실근은 네 개이다.\n$0<k<1$이면 $t$가 하나만 가능하여 $x$는 두 개이고, $k=0$이면 $t=1$에서 한 개, $k<0$이면 해가 없다.\n또 $k=\\dfrac98$이면 $t=\\dfrac14$ 하나에서 두 해만 생기며 $k>\\dfrac98$이면 해가 없다.\n따라서 $a=1$, $b=\\dfrac98$이고\n$a+8b=1+8\\cdot\\dfrac98=10$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 20,
      "questionNumber": 20,
      "questionType": "객관식",
      "content": "그림과 같이 두 선분 $AB, BC$의 길이가 각각 5, 7이고, 넓이가 28인 평행사변형 $ABCD$가 있다. $\\angle A, \\angle B$의 이등분선의 교점을 $P$, $\\angle A, \\angle D$의 이등분선의 교점을 $Q$, $\\angle C, \\angle D$의 이등분선의 교점을 $R$, $\\angle B, \\angle C$의 이등분선의 교점을 $S$라 할 때, 사각형 $PQRS$의 넓이는 $\\frac{q}{p}$이다. $p+q$의 값을 구하면? (단, $p$와 $q$는 서로소인 자연수이다.) [4.2점]<br><br><img src=\"assets/images/21_금당고_1학기_기말_고2_수학I/q20.png\" class=\"exam-img\">",
      "choices": [
        "9",
        "10",
        "11",
        "12",
        "13"
      ],
      "answer": "⑤",
      "solution": "평행사변형에서 이웃한 각은 서로 보각이므로 이웃한 각의 이등분선은 수직이고, 마주 보는 각은 같으므로 마주 보는 각의 이등분선은 평행하다. 따라서 $PQRS$는 직사각형이다.\n\n먼저 직각삼각형 $ABP$와 $ADQ$를 비교한다. 두 삼각형은 $\\angle APB=\\angle AQD=90^\\circ$이고 $\\angle BAP=\\angle DAQ$이므로 닮음이다. 대응하는 빗변의 길이가 $AB=5$, $AD=BC=7$이므로\n$\\dfrac{AQ}{AP}=\\dfrac{AD}{AB}=\\dfrac75$이다.\n점 $P,Q$는 $A$에서 시작하는 같은 각이등분선 위에 있으므로\n$PQ=AQ-AP=\\left(\\dfrac75-1\\right)AP=\\dfrac25AP$이다.\n\n다음으로 직각삼각형 $ABP$와 $BCS$를 비교한다. 두 삼각형은 $\\angle APB=\\angle BSC=90^\\circ$이고 $\\angle ABP=\\angle CBS$이므로 닮음이다. 빗변은 각각 $AB=5$, $BC=7$이므로\n$\\dfrac{BS}{BP}=\\dfrac{BC}{AB}=\\dfrac75$이다.\n점 $P,S$는 $B$에서 시작하는 같은 각이등분선 위에 있으므로\n$PS=BS-BP=\\left(\\dfrac75-1\\right)BP=\\dfrac25BP$이다.\n\n이제 $AP\\cdot BP$를 구한다. $E$를 $A$의 각이등분선과 $BC$의 교점이라 하자. $AD\\parallel BE$이고 $AE$는 $\\angle DAB$의 이등분선이므로\n$\\angle BAE=\\angle EAD=\\angle AEB$이다.\n따라서 $\\triangle ABE$에서 $BE=AB=5$이다. 평행사변형의 높이는\n$\\dfrac{28}{BC}=\\dfrac{28}{7}=4$이므로\n$[ABE]=\\dfrac12\\cdot BE\\cdot4=10$이다.\n또 $BP$는 $\\angle ABE$의 이등분선이므로 각의 이등분선 정리에 의해\n$\\dfrac{AP}{PE}=\\dfrac{AB}{BE}=1$이다. 따라서 $P$는 $AE$의 중점이고, $[ABP]=\\dfrac12[ABE]=5$이다.\n각 $A,B$의 이등분선은 서로 수직이므로 $AP\\perp BP$이다. 그러므로\n$\\dfrac12 AP\\cdot BP=5$, 즉 $AP\\cdot BP=10$이다.\n\n따라서 직사각형 $PQRS$의 넓이는\n$[PQRS]=PQ\\cdot PS=\\left(\\dfrac25AP\\right)\\left(\\dfrac25BP\\right)\n=\\dfrac4{25}(AP\\cdot BP)=\\dfrac{40}{25}=\\dfrac85$이다.\n그러므로 $q=8$, $p=5$이고\n$p+q=5+8=13$이다.\n따라서 정답은 ⑤이다.",
      "images": [
        "assets/images/21_금당고_1학기_기말_고2_수학I/q20.png"
      ]
    },
    {
      "id": 21,
      "questionNumber": 21,
      "questionType": "서술형",
      "content": "첫째항이 1이고 공차가 2인 등차수열 $\\{a_n\\}$에 대하여 $$\\sum_{n=1}^{10} \\frac{1}{a_{n+1}a_{n+2}}$$의 값을 구하는 과정을 서술하고 답을 구하시오. [10점]",
      "choices": [],
      "answer": "10/69",
      "solution": "첫째항이 1이고 공차가 2이므로\n$a_n=1+2(n-1)=2n-1$이다.\n따라서\n$a_{n+1}=2n+1$, $a_{n+2}=2n+3$이다.\n각 항을 부분분수로 나타내면\n$\\dfrac1{a_{n+1}a_{n+2}}=\\dfrac1{(2n+1)(2n+3)}$\n$=\\dfrac12\\left(\\dfrac1{2n+1}-\\dfrac1{2n+3}\\right)$이다.\n그러므로\n$\\displaystyle\\sum_{n=1}^{10}\\dfrac1{a_{n+1}a_{n+2}}$\n$=\\dfrac12\\left\\{\\left(\\dfrac13-\\dfrac15\\right)+\\left(\\dfrac15-\\dfrac17\\right)+\\cdots+\\left(\\dfrac1{21}-\\dfrac1{23}\\right)\\right\\}$\n$=\\dfrac12\\left(\\dfrac13-\\dfrac1{23}\\right)$\n$=\\dfrac12\\cdot\\dfrac{20}{69}=\\dfrac{10}{69}$이다.\n따라서 구하는 값은 $\\dfrac{10}{69}$이다."
    },
    {
      "id": 22,
      "questionNumber": 22,
      "questionType": "서술형",
      "content": "좌표평면에서 함수 $$f(x)=\\begin{cases} x^2 & (x < 0) \\\\ \\sqrt{x} & (x \\ge 0) \\end{cases}$$와 자연수 $n$에 대하여 세 점 $P_n(n, 0), Q_n(0, n), R_n(-n, 0)$을 꼭짓점으로 하는 삼각형 $P_n Q_n R_n$이 있다. 삼각형 $P_n Q_n R_n$의 둘레 및 내부에 있는 $x$좌표와 $y$좌표가 모두 정수인 점 중에서 $y \\ge f(x)$를 만족시키는 점의 개수를 $A_n$이라 할 때, $\\sum_{n=1}^{10} A_n$의 값을 구하는 과정을 서술하고 답을 구하시오. [10점]",
      "choices": [],
      "answer": "244",
      "solution": "삼각형에서 각 정수 $x$에 대하여 가능한 정수 $y$는\n$0\\le y\\le n-|x|$이다. 이 조건에 $y\\ge f(x)$를 함께 적용해 $x<0$, $x=0$, $x>0$인 점을 나누어 센다.\n\n먼저 $x=-k<0$라 하면 $f(-k)=k^2$이다. 따라서 $y$는 $k^2\\le y\\le n-k$를 만족해야 하며, 개수는 $n-k-k^2+1$이다. 단, 윗끝 $n-k$가 아랫끝 $k^2$보다 작으면 점이 없으므로 개수를 0으로 센다. $n\\le10$에서는 $k=1,2$만 가능하고, 각각의 개수는 $\\max(n-1,0)$, $\\max(n-5,0)$이다. 그러므로\n$N_-=\\max(n-1,0)+\\max(n-5,0)$이다.\n\n$x=0$에서는 $f(0)=0$이므로 $y=0,1,\\ldots,n$이 모두 가능하다. 따라서 $N_0=n+1$이다.\n\n이제 $x=k>0$이라 하자. 정수 $y$의 최소값은 $k=1$일 때 1, $k=2,3,4$일 때 2, $k=5,6,7,8,9$일 때 3, $k=10$일 때 4이다. (각 구간에서 $y$는 $\\sqrt{k}$ 이상인 최소 정수부터 시작한다.) $k=10$이면 $y\\le n-10\\le0$이어서 가능한 점이 없고, 나머지 경우에는 윗끝 $n-k$가 위 최소값 이상일 때 그 차에 1을 더한 개수만큼 점이 있다. 따라서\n$N_+=(n-1)+\\displaystyle\\sum_{k=2}^{4}\\max(n-k-1,0)+\\displaystyle\\sum_{k=5}^{9}\\max(n-k-2,0)$이다.\n\n이제 $n=1,2,\\ldots,10$에 대해 세 경우의 개수를 더한다.\n$n=1$: $(N_-,N_0,N_+)=(0,2,0)$, $A_1=2$.\n$n=2$: $(1,3,1)$, $A_2=5$.\n$n=3$: $(2,4,2)$, $A_3=8$.\n$n=4$: $(3,5,4)$, $A_4=12$.\n$n=5$: $(4,6,7)$, $A_5=17$.\n$n=6$: $(6,7,11)$, $A_6=24$.\n$n=7$: $(8,8,15)$, $A_7=31$.\n$n=8$: $(10,9,20)$, $A_8=39$.\n$n=9$: $(12,10,26)$, $A_9=48$.\n$n=10$: $(14,11,33)$, $A_{10}=58$.\n\n예를 들어 $n=10$일 때 $x>0$인 점의 수는 $k=1$에서 9개, $k=2,3,4$에서 각각 7,6,5개, $k=5,6,7$에서 각각 3,2,1개이며 $k=8,9,10$에서는 0개이다. 따라서 $N_+=9+7+6+5+3+2+1=33$이다.\n그러므로\n$\\displaystyle\\sum_{n=1}^{10}A_n=2+5+8+12+17+24+31+39+48+58=244$이다.\n따라서 구하는 값은 244이다."
    }
  ]
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = examData;
}
if (typeof window !== 'undefined') {
  window.examTitle = examData.exam.title;
  window.questionBank = window.examData.questions;
}
