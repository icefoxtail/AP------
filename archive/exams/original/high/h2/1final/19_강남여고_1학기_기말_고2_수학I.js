window.examTitle = "19_강남여고_1학기_기말_고2_수학I";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "$2^2 \\times 8^{\\frac{1}{3}}$의 값을 $a$, $\\log_{15}3 + \\log_{15}5$ 값을 $b$라 할 때, $a+b$의 값은? [2점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "④",
    "solution": "먼저 $a$를 계산한다.\n$8=2^3$이므로\n$8^{\\frac13}=2$이다.\n따라서\n$a=2^2\\times 8^{\\frac13}=4\\times2=8$이다.\n로그의 덧셈 공식 $\\log_m x+\\log_m y=\\log_m(xy)$를 쓰면\n$b=\\log_{15}3+\\log_{15}5=\\log_{15}(3\\times5)=\\log_{15}15=1$이다.\n그러므로\n$a+b=8+1=9$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "지수함수 $y=5^{2x}$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동시켰더니 함수 $y=25 \\times 5^{2x}+2$의 그래프가 되었다. $m-n$의 값은? [2점]",
    "choices": [
      "3",
      "1",
      "0",
      "-1",
      "-3"
    ],
    "answer": "⑤",
    "solution": "$y=f(x)$를 $x$축 방향으로 $m$, $y$축 방향으로 $n$만큼 평행이동하면 $y=f(x-m)+n$이 된다.\n여기서는 $f(x)=5^{2x}$이므로 이동한 그래프는\n$y=5^{2(x-m)}+n$\n$=5^{-2m}\\cdot5^{2x}+n$이다.\n이를 $y=25\\times5^{2x}+2$와 비교하면 상수항에서 $n=2$이다.\n또 $5^{-2m}=25=5^2$이므로\n$-2m=2$,\n$m=-1$이다.\n따라서\n$m-n=-1-2=-3$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "$\\dfrac{\\pi}{2} < \\theta < \\pi$이고 $\\sin\\theta = \\dfrac{2}{3}$일 때, $\\cos\\theta$의 값은? [2점]",
    "choices": [
      "\\dfrac{\\sqrt{5}}{3}",
      "-\\dfrac{\\sqrt{5}}{3}",
      "-\\dfrac{1}{3}",
      "-\\dfrac{2}{3}",
      "\\dfrac{2}{3}"
    ],
    "answer": "②",
    "solution": "항등식 $\\sin^2\\theta+\\cos^2\\theta=1$에 주어진 값을 대입한다.\n$\\cos^2\\theta=1-\\left(\\dfrac23\\right)^2$\n$=1-\\dfrac49=\\dfrac59$이다.\n따라서 $\\cos\\theta=\\pm\\dfrac{\\sqrt5}{3}$이다.\n$\\dfrac\\pi2<\\theta<\\pi$이므로 $\\theta$는 제2사분면의 각이고, 제2사분면에서 코사인값은 음수이다.\n그러므로\n$\\cos\\theta=-\\dfrac{\\sqrt5}{3}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "등차수열 $\\{a_n\\}$이 $a_2 = 3$, $a_5 = 24$일 때, $a_7$의 값은? [2.5점]",
    "choices": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "answer": "③",
    "solution": "등차수열에서 $a_5-a_2$는 공차가 세 번 더해진 값이다.\n$3d=a_5-a_2=24-3=21$이므로\n$d=7$이다.\n$a_7$은 $a_5$에서 두 칸 뒤의 항이므로\n$a_7=a_5+2d$\n$=24+2\\times7=38$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "공비가 $2$인 등비수열 $\\{a_n\\}$에 대하여 $a_3 = 12$일 때, $a_5$의 값은? [2.5점]",
    "choices": [
      "24",
      "36",
      "48",
      "60",
      "72"
    ],
    "answer": "③",
    "solution": "공비가 $2$이므로 한 항에서 두 칸 뒤의 항은 공비를 두 번 곱한 값이다.\n따라서\n$a_5=a_3\\times2^2$\n$=12\\times4=48$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에 대하여 $\\sum_{k=1}^{10} a_k = 15$, $\\sum_{k=1}^{10} b_k = 25$일 때, $\\sum_{k=1}^{10} (2a_k - b_k)$의 값은? [2.5점]",
    "choices": [
      "-5",
      "-10",
      "0",
      "5",
      "10"
    ],
    "answer": "④",
    "solution": "합의 성질에 따라 각 항의 합을 따로 계산한다.\n$\\displaystyle\\sum_{k=1}^{10}(2a_k-b_k)=2\\sum_{k=1}^{10}a_k-\\sum_{k=1}^{10}b_k$이다.\n주어진 두 합을 대입하면\n$=2\\times15-25$\n$=30-25=5$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$은 $a_1 = 1$이고, 모든 자연수 $n$에 대하여 $$a_{n+1} = a_n + (-1)^n$$을 만족시킨다. $a_{10}$의 값은? [2.5점]",
    "choices": [
      "-10",
      "-1",
      "0",
      "1",
      "10"
    ],
    "answer": "③",
    "solution": "점화식에 $n=1$을 대입하면\n$a_2=a_1+(-1)^1=1-1=0$이다.\n$n=2$를 대입하면\n$a_3=a_2+(-1)^2=0+1=1$이다.\n이처럼 홀수 번째 항에서 다음 항으로 갈 때 $1$을 빼고, 짝수 번째 항에서 다음 항으로 갈 때 $1$을 더한다.\n두 번의 변화가 $-1+1=0$이므로 항은 $1,0,1,0,\\ldots$로 반복된다.\n따라서 짝수 번째 항인 $a_{10}=0$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "서로 다른 두 양수 $a, b$가 다음 조건을 만족시킬 때, $a+b$의 값은? [3점]<br><br>&lt;조건&gt;<br>(가) 세 수 $-7, a, b$는 순서대로 등차수열을 이룬다.<br>(나) 세 수 $a, -3, b$는 순서대로 등비수열을 이룬다.",
    "choices": [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    "answer": "①",
    "solution": "(가)에서 $-7,a,b$가 순서대로 등차수열이므로 가운데 항은 양 끝 항의 평균이다.\n$2a=-7+b$,\n$b=2a+7$이다.\n(나)에서 $a,-3,b$가 순서대로 등비수열이므로 가운데 항의 제곱은 양 끝 항의 곱이다.\n$(-3)^2=ab$,\n$ab=9$이다.\n$b=2a+7$을 대입하면\n$a(2a+7)=9$,\n$2a^2+7a-9=0$,\n$(2a+9)(a-1)=0$이다.\n따라서 $a=-\\dfrac92$ 또는 $a=1$이다.\n$a,b$가 양수이므로 $a=1$이고, 이때 $b=2\\times1+7=9$이다. 두 수도 서로 다르다.\n그러므로 $a+b=1+9=10$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "$\\sum_{k=1}^n (4k-3) = 190$을 만족하는 자연수 $n$의 값은? [3점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "합의 식을 정리한다.\n$\\displaystyle\\sum_{k=1}^{n}(4k-3)=4\\sum_{k=1}^{n}k-3n$\n$=4\\cdot\\dfrac{n(n+1)}2-3n$\n$=2n(n+1)-3n=2n^2-n$이다.\n주어진 합이 $190$이므로\n$2n^2-n=190$,\n$2n^2-n-190=0$이다.\n인수분해하면\n$(2n-20)(n+\\dfrac{19}{2})=0$이므로 근은 $n=10$ 또는 $n=-\\dfrac{19}{2}$이다.\n$n$은 자연수이므로 $n=10$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "등비수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$에 대하여 $\\dfrac{S_4}{S_2} = 6$일 때, $\\dfrac{a_4}{a_2}$의 값은? [3점]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "②",
    "solution": "등비수열의 첫째항을 $a_1$, 공비를 $r$이라 하자.\n$S_2=a_1(1+r)$이고,\n$S_4=a_1(1+r+r^2+r^3)=a_1(1+r)(1+r^2)$이다.\n주어진 비 $S_4/S_2$가 정의되므로 $S_2\\ne0$이고, 두 식을 나누면\n$\\dfrac{S_4}{S_2}=1+r^2$이다.\n따라서\n$1+r^2=6$,\n$r^2=5$이다.\n또 $a_2=a_1r$, $a_4=a_1r^3$이므로\n$\\dfrac{a_4}{a_2}=r^2=5$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "$\\sum_{k=2}^{40} \\dfrac{1}{(k-1)k} = \\dfrac{q}{p}$일 때, $p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [3점]",
    "choices": [
      "79",
      "80",
      "81",
      "82",
      "83"
    ],
    "answer": "①",
    "solution": "분수를 부분분수로 나누어 쓴다.\n$\\dfrac1{(k-1)k}=\\dfrac1{k-1}-\\dfrac1k$이다.\n따라서 합은\n$\\displaystyle\\sum_{k=2}^{40}\\left(\\dfrac1{k-1}-\\dfrac1k\\right)$\n$=(1-\\dfrac12)+(\\dfrac12-\\dfrac13)+\\cdots+(\\dfrac1{39}-\\dfrac1{40})$\n$=1-\\dfrac1{40}=\\dfrac{39}{40}$이다.\n$q/p$가 서로소인 자연수의 비이므로 $q=39$, $p=40$이다.\n그러므로 $p+q=40+39=79$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "<p>아래 풀이는 반지름의 길이가 $1$인 두 원 $\\mathrm{O, O'}$이 그림과 같이 만날 때, 어두운 부분의 둘레의 길이를 구하는 과정이다. (단, 두 원의 중심은 각각 $\\mathrm{O, O'}$이다.)</p><p><img src=\"assets/images/19_강남여고_1학기_기말_고2_수학I/q12.png\" class=\"question-img\" alt=\"문제 12 그림 1\"></p><div class=\"box-content\">&lt;풀이&gt;<br>오른쪽 그림에서 삼각형 $\\mathrm{POO'}$은<br>(가) $\\overline{\\mathrm{PO}} = \\overline{\\mathrm{OO'}} = \\overline{\\mathrm{O'P}} = 1$인 정삼각형이므로<br>(나) $\\angle\\mathrm{POO'} = 60^\\circ$이고<br>(다) $\\wideparen{\\mathrm{PO}} = \\wideparen{\\mathrm{PO'}} = r\\theta$이므로 계산하면<br>(라) $1 \\times 60 = 60$이다. 따라서 구하는 둘레의 길이는<br>(마) $60 \\times 2 = 120$이다.<p><img src=\"assets/images/19_강남여고_1학기_기말_고2_수학I/q12_1.png\" class=\"question-img\" alt=\"문제 12 그림 2\"></p></div><br>위의 풀이 중 처음으로 틀린 부분을 찾으면? [3점]",
    "image": "assets/images/19_강남여고_1학기_기말_고2_수학I/q12.png",
    "choices": [
      "(가)",
      "(나)",
      "(다)",
      "(라)",
      "(마)"
    ],
    "answer": "④",
    "solution": "(가)에서 $PO=OO'=O'P=1$이므로 삼각형 $POO'$은 정삼각형이고, (나)의 $\\angle POO'=60^\\circ$도 맞다.\n호의 길이는 중심각 $\\theta$를 라디안으로 나타내어 $r\\theta$로 계산한다.\n$60^\\circ=\\dfrac\\pi3$이므로 반지름이 $1$인 해당 호의 길이는\n$1\\times\\dfrac\\pi3=\\dfrac\\pi3$이다.\n그런데 (라)에서는 $60^\\circ$를 라디안 수처럼 바로 $1\\times60$으로 계산했다.\n따라서 제시된 풀이에서 처음으로 틀린 부분은 (라)이다.\n정답은 ④이다.",
    "images": [
      "assets/images/19_강남여고_1학기_기말_고2_수학I/q12.png",
      "assets/images/19_강남여고_1학기_기말_고2_수학I/q12_1.png"
    ]
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "소리의 세기가 $I(\\mathrm{W/m^2})$인 음원으로부터 $r(\\mathrm{m})$만큼 떨어진 지점에서 측정된 소리의 상대적 세기 $P$(데시벨)는 $$P = 10\\left(12 + \\log\\dfrac{I}{r^2}\\right)$$이다. 어떤 음원으로부터 $1\\mathrm{m}$만큼 떨어진 지점에서 측정된 소리의 상대적 세기가 $80$(데시벨)일 때, 같은 음원으로부터 $10\\mathrm{m}$만큼 떨어진 지점에서 측정된 소리의 상대적 세기가 $a$(데시벨)이다. $a$의 값은? [3점]",
    "choices": [
      "50",
      "55",
      "60",
      "65",
      "70"
    ],
    "answer": "③",
    "solution": "같은 음원에서 거리만 바뀔 때 소리의 상대적 세기가 얼마나 달라지는지 식으로 비교한다.\n거리 $1$ m일 때와 $10$ m일 때의 차는\n$10\\{\\log(I/10^2)-\\log(I/1^2)\\}$\n$=10\\{\\log I-2-\\log I\\}$\n$=-20\\log10=-20$ (데시벨)이다.\n따라서 $10$ m에서의 상대적 세기는\n$a=80-20=60$ (데시벨)이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "연이율 $3\\%$이고 $1$년마다 복리로 매년 말에 $15$만 원씩 $10$년 동안 적립할 때, $10$년 말까지 적립금의 원리합계는? (단, $1.03^{10} = 1.4$로 계산한다.) [3점]",
    "choices": [
      "200(만 원)",
      "204(만 원)",
      "208(만 원)",
      "212(만 원)",
      "216(만 원)"
    ],
    "answer": "①",
    "solution": "10년 말의 적립금은 매년 말 납입한 15만 원에 각 납입 뒤 남은 기간의 이자를 붙인 값의 합이다.\n$15(1+1.03+1.03^2+\\cdots+1.03^9)$만 원이다.\n공비가 $1.03$인 등비수열의 합을 이용하면\n$1+1.03+\\cdots+1.03^9=\\dfrac{1.03^{10}-1}{1.03-1}$이다.\n$1.03^{10}=1.4$를 대입하여\n$15\\times\\dfrac{1.4-1}{0.03}$\n$=15\\times\\dfrac{0.4}{0.03}$\n$=15\\times\\dfrac{40}{3}=200$ (만 원)이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$일 때, 방정식 $\\sin x = -\\dfrac{1}{3}$의 두 근을 $\\alpha, \\beta$라고 하자. $\\sin\\left(\\alpha + \\beta + \\dfrac{\\pi}{3}\\right)$의 값은? [3점]",
    "choices": [
      "-1",
      "-\\dfrac{\\sqrt{3}}{2}",
      "-\\dfrac{1}{2}",
      "\\dfrac{1}{2}",
      "\\dfrac{\\sqrt{3}}{2}"
    ],
    "answer": "②",
    "solution": "$\\sin x=-\\dfrac13$의 두 해는 각각 제3사분면과 제4사분면에 있다.\n$0<t<\\dfrac\\pi2$이고 $\\sin t=\\dfrac13$인 각을 $t$라 하자. 두 해는\n$\\alpha=\\pi+t$, $\\beta=2\\pi-t$로 나타낼 수 있다.\n따라서\n$\\alpha+\\beta=3\\pi$이고,\n$\\alpha+\\beta+\\dfrac\\pi3=\\dfrac{10\\pi}{3}$이다.\n주기 $2\\pi$를 빼면\n$\\sin\\dfrac{10\\pi}{3}=\\sin\\dfrac{4\\pi}{3}=-\\dfrac{\\sqrt3}{2}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "모든 실수 $x$에 대하여 이차부등식 $x^2 - 4x\\sin\\theta + 1 > 0$이 성립하도록 하는 $\\theta$의 값의 범위가 $0 \\le \\theta < a$ 또는 $b < \\theta \\le \\pi$일 때, $a+b$의 값은? (단, $0 \\le \\theta \\le \\pi$) [3점]",
    "choices": [
      "\\dfrac{\\pi}{2}",
      "\\pi",
      "\\dfrac{3}{2}\\pi",
      "2\\pi",
      "\\dfrac{2}{3}\\pi"
    ],
    "answer": "②",
    "solution": "이차식 $x^2-4x\\sin\\theta+1$의 최고차항 계수는 양수이다.\n이 식이 모든 실수 $x$에서 항상 양수이려면 실근이 없어야 하므로 판별식이 $0$보다 작아야 한다. 판별식이 $0$이면 식이 어떤 실수에서 $0$이 되어 주어진 엄격한 부등식을 만족하지 않는다.\n$D=(-4\\sin\\theta)^2-4\\times1\\times1$\n$=16\\sin^2\\theta-4<0$,\n$\\sin^2\\theta<\\dfrac14$이다.\n$0\\le\\theta\\le\\pi$에서는 $\\sin\\theta\\ge0$이므로 $\\sin\\theta<\\dfrac12$이다.\n따라서\n$0\\le\\theta<\\dfrac\\pi6$ 또는 $\\dfrac{5\\pi}{6}<\\theta\\le\\pi$이다.\n$a=\\dfrac\\pi6$, $b=\\dfrac{5\\pi}{6}$이므로\n$a+b=\\pi$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에서 $a_n = 3 + (-1)^n$일 때, 좌표평면 위의 점 $\\mathrm{P}_n$을 $\\mathrm{P}_n\\left(a_n\\cos\\dfrac{2n\\pi}{3}, a_n\\sin\\dfrac{2n\\pi}{3}\\right)$라 하자. 점 $\\mathrm{P}_{2019}$와 같은 점은? [3.5점]",
    "choices": [
      "\\mathrm{P}_1",
      "\\mathrm{P}_2",
      "\\mathrm{P}_3",
      "\\mathrm{P}_4",
      "\\mathrm{P}_5"
    ],
    "answer": "③",
    "solution": "$a_n=3+(-1)^n$이므로 $n$이 홀수이면 $a_n=2$, 짝수이면 $a_n=4$이다.\n$2019$는 홀수이고 $2019=3\\times673$이므로\n$P_{2019}=\\left(2\\cos(2\\times673\\pi),\\;2\\sin(2\\times673\\pi)\\right)=(2,0)$이다.\n보기의 점도 반지름과 각도를 확인한다. $P_3$에서는 $a_3=2$이고 각도는 $2\\times3\\pi/3=2\\pi$이므로\n$P_3=(2\\cos2\\pi,2\\sin2\\pi)=(2,0)$이다.\n따라서 $P_{2019}$와 같은 점은 $P_3$이다.\n정답은 ③이다."
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "두 등차수열 $\\{a_n\\}, \\{b_n\\}$에서 $a_1 + b_1 = 3$, $\\sum_{k=1}^{10} a_k + \\sum_{k=1}^{10} b_k = 65$일 때, $a_{10} + b_{10}$의 값은? [3.5점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "등차수열의 첫째항부터 열째항까지의 합은 첫째항과 열째항의 평균에 항의 수 $10$을 곱한 값이다.\n따라서\n$\\displaystyle\\sum_{k=1}^{10}a_k=5(a_1+a_{10})$,\n$\\displaystyle\\sum_{k=1}^{10}b_k=5(b_1+b_{10})$이다.\n두 식을 더하면\n$5\\{(a_1+b_1)+(a_{10}+b_{10})\\}=65$,\n$(a_1+b_1)+(a_{10}+b_{10})=13$이다.\n$a_1+b_1=3$을 대입하면\n$a_{10}+b_{10}=13-3=10$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "객관식",
    "content": "자연수 $n$에 대하여 $n(n-4)$의 세제곱근 중 실수인 것의 개수를 $f(n)$이라 하고, $n(n-4)$의 네제곱근 중 실수인 것의 개수를 $g(n)$이라 하자. $f(n) > g(n)$을 만족시키는 모든 $n$의 값의 합은? [3.5점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "④",
    "solution": "실수의 세제곱근은 밑의 수가 양수이든 음수이든 항상 하나이므로 $f(n)=1$이다.\n실수의 네제곱근은 밑의 수가 양수이면 두 개, $0$이면 한 개, 음수이면 없다.\n따라서 $f(n)>g(n)$이려면 $n(n-4)<0$이어야 한다. 이 곱이 음수가 되는 자연수는\n$0<n<4$인 $n=1,2,3$이다.\n합은\n$1+2+3=6$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "객관식",
    "content": "<p>사각형 $\\mathrm{ABCD}$에서 세 꼭짓점 $\\mathrm{A, B, D}$를 지나는 원의 반지름의 길이와 세 꼭짓점 $\\mathrm{B, C, D}$를 지나는 원의 반지름의 길이의 비가 $1:2$일 때, $\\log_2\\sin\\mathrm{A} - \\log_2\\sin\\mathrm{C}$의 값은? [3.5점]</p><p><img src=\"assets/images/19_강남여고_1학기_기말_고2_수학I/q20.png\" class=\"question-img\" alt=\"문제 20 그림\"></p>",
    "image": "assets/images/19_강남여고_1학기_기말_고2_수학I/q20.png",
    "choices": [
      "-1",
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "③",
    "solution": "두 원에 공통인 현은 $BD$이다.\n삼각형 $ABD$의 외접원의 반지름을 $R_1$이라 하면 사인법칙에 따라\n$BD=2R_1\\sin A$이다.\n삼각형 $BCD$의 외접원의 반지름을 $R_2$라 하면\n$BD=2R_2\\sin C$이다.\n두 식이 같은 $BD$를 나타내므로\n$2R_1\\sin A=2R_2\\sin C$,\n$\\dfrac{\\sin A}{\\sin C}=\\dfrac{R_2}{R_1}=2$이다.\n따라서\n$\\log_2\\sin A-\\log_2\\sin C=\\log_2\\dfrac{\\sin A}{\\sin C}=\\log_2 2=1$이다.\n따라서 정답은 ③이다.",
    "images": [
      "assets/images/19_강남여고_1학기_기말_고2_수학I/q20.png"
    ]
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "객관식",
    "content": "명제 ‘$0 \\le a \\le 2\\pi$인 실수 $a$에 대하여 $x$에 대한 방정식 $x = \\sin(x+a)$를 만족시키는 실수 $x$는 $1$개 존재한다.’는 참이라고 한다. 방정식 $x = \\sin(x+a)$를 만족시키는 실수 $x$를 $f(a)$라 할 때, 함수 $f(a)$가 최댓값을 갖는 $a$의 값을 $\\alpha$, $f(a)$가 최솟값을 갖는 $a$의 값을 $\\beta$라 하자. $\\dfrac{10(\\alpha+\\beta)}{\\pi}$의 값은? [3.5점]",
    "choices": [
      "30",
      "25",
      "10",
      "15",
      "20"
    ],
    "answer": "⑤",
    "solution": "방정식의 해 $f(a)$는 항상 사인값이므로 $-1\\le f(a)\\le1$이다.\n$f(a)=1$이 되려면 $1=\\sin(1+a)$이어야 한다.\n$0\\le a\\le2\\pi$에서 가능한 값은 $1+a=\\dfrac\\pi2$이므로\n$\\alpha=\\dfrac\\pi2-1$이다.\n또 $f(a)=-1$이 되려면 $-1=\\sin(-1+a)$이어야 한다.\n$0\\le a\\le2\\pi$에서 가능한 값은 $a-1=\\dfrac{3\\pi}{2}$이므로\n$\\beta=\\dfrac{3\\pi}{2}+1$이다.\n두 값은 각각 범위 $[0,2\\pi]$ 안에 있으므로 $f(a)$의 최댓값과 최솟값은 실제로 $1,-1$에서 얻어진다.\n$\\alpha+\\beta=\\left(\\dfrac\\pi2-1\\right)+\\left(\\dfrac{3\\pi}{2}+1\\right)=2\\pi$이다.\n따라서\n$\\dfrac{10(\\alpha+\\beta)}\\pi=\\dfrac{10\\times2\\pi}{\\pi}=20$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 22,
    "questionNumber": 22,
    "questionType": "객관식",
    "content": "다음은 모든 자연수 $n$에 대하여 $$\\dfrac{4}{3} + \\dfrac{8}{3^2} + \\dfrac{12}{3^3} + \\cdots + \\dfrac{4n}{3^n} = 3 - \\dfrac{2n+3}{3^n} \\quad \\cdots\\cdots (*)$$이 성립함을 수학적 귀납법으로 증명한 것이다.<div class=\"box-content\">(1) $n=1$일 때, $($좌변$) = \\dfrac{4}{3}$, $($우변$) = 3 - \\dfrac{5}{3} = \\dfrac{4}{3}$이므로 $(*)$이 성립한다.<br>(2) $n=k$일 때, $(*)$이 성립한다고 가정하면<br>$\\dfrac{4}{3} + \\dfrac{8}{3^2} + \\dfrac{12}{3^3} + \\cdots + \\dfrac{4k}{3^k} = 3 - \\dfrac{2k+3}{3^k}$이다.<br>위 등식의 양변에 $\\dfrac{4(k+1)}{3^{k+1}}$을 더하여 정리하면<br>$\\dfrac{4}{3} + \\dfrac{8}{3^2} + \\dfrac{12}{3^3} + \\cdots + \\dfrac{4k}{3^k} + \\dfrac{4(k+1)}{3^{k+1}}$<br>$= 3 - \\dfrac{1}{3^k} \\{(2k+3) - \\fbox{ (가) }\\}$<br>$= 3 - \\dfrac{\\fbox{ (나) }}{3^{k+1}}$<br>따라서 $n=k+1$일 때도 $(*)$이 성립한다.<br>(1), (2)에 의하여 모든 자연수 $n$에 대하여 $(*)$이 성립한다.</div><br>위의 (가), (나)에 알맞은 식을 각각 $f(k), g(k)$이라 할 때, $f(1) \\times g(2)$의 값은? [3.5점]",
    "choices": [
      "24",
      "36",
      "48",
      "60",
      "72"
    ],
    "answer": "①",
    "solution": "$n=k$일 때의 등식에 다음 항 $\\dfrac{4(k+1)}{3^{k+1}}$을 더한다.\n우변은\n$3-\\dfrac{2k+3}{3^k}+\\dfrac{4(k+1)}{3^{k+1}}$\n$=3-\\dfrac{1}{3^k}\\left\\{(2k+3)-\\dfrac{4(k+1)}3\\right\\}$이다.\n따라서 (가)는\n$f(k)=\\dfrac{4(k+1)}3$이다.\n이를 공통분모로 정리하면\n$3-\\dfrac{1}{3^k}\\left\\{(2k+3)-\\dfrac{4(k+1)}3\\right\\}$\n$=3-\\dfrac{3(2k+3)-4(k+1)}{3^{k+1}}$\n$=3-\\dfrac{6k+9-4k-4}{3^{k+1}}$\n$=3-\\dfrac{2k+5}{3^{k+1}}$이다.\n그러므로 (나)는 $g(k)=2k+5$이다.\n$f(1)=\\dfrac83$, $g(2)=9$이므로\n$f(1)\\times g(2)=\\dfrac83\\times9=24$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 23,
    "questionNumber": 23,
    "questionType": "객관식",
    "content": "자연수 $n$에 대하여 좌표평면 위의 두 점 $\\mathrm{A}_n(n, 2\\sqrt{n})$, $\\mathrm{B}_n(2n, \\sqrt{n})$과 원점 $\\mathrm{O}$를 꼭짓점으로 하는 삼각형 $\\mathrm{A}_n\\mathrm{OB}_n$의 무게중심을 $\\mathrm{G}_n$, 선분 $\\mathrm{OG}_n$의 길이를 $a_n$이라 하자. $m \\le a_n < m+1$을 만족시키는 정수 $m$에 대하여 수열 $\\{b_n\\}$의 일반항을 $b_n = a_n - m$이라 하자. $\\sum_{k=1}^{120} \\dfrac{b_k}{\\sqrt{k}}$의 값은? [4점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "삼각형의 무게중심은 세 꼭짓점 좌표의 평균이다.\n$G_n=\\left(\\dfrac{n+0+2n}{3},\\dfrac{2\\sqrt n+0+\\sqrt n}{3}\\right)=(n,\\sqrt n)$이다.\n따라서\n$a_n=OG_n=\\sqrt{n^2+n}$이다.\n$n^2<n^2+n<(n+\\dfrac12)^2$이므로\n$n<a_n<n+\\dfrac12<n+1$이다.\n따라서 $m=n$이고\n$b_n=\\sqrt{n^2+n}-n$이다.\n각 항을 $\\sqrt n$으로 나누면\n$\\dfrac{b_n}{\\sqrt n}=\\dfrac{\\sqrt{n^2+n}-n}{\\sqrt n}=\\sqrt{n+1}-\\sqrt n$이다.\n그러므로 합은 망원합으로 정리되어\n$\\displaystyle\\sum_{k=1}^{120}\\dfrac{b_k}{\\sqrt k}=\\sum_{k=1}^{120}(\\sqrt{k+1}-\\sqrt k)$\n$=\\sqrt{121}-\\sqrt1=11-1=10$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 24,
    "questionNumber": 24,
    "questionType": "객관식",
    "content": "임의의 두 자연수 $m, n$에 대하여 함수 $f(x)$가 다음 조건을 만족시킨다. [4점]<div class=\"box-content\">&lt;보기&gt;<br>(가) $f(2) = 1$<br>(나) $f(m) - f(n) = f\\left(\\dfrac{m}{n}\\right)$</div><br>$\\sum_{k=2}^{15} \\dfrac{f\\left(\\dfrac{k}{k+1}\\right)}{f(k)f(k+1)}$의 값은? [4점]",
    "choices": [
      "-1",
      "-\\dfrac{3}{4}",
      "-\\dfrac{1}{2}",
      "-\\dfrac{1}{4}",
      "0"
    ],
    "answer": "②",
    "solution": "각 분모가 0이 아니어서 주어진 합이 정의되는 경우를 계산한다.\n조건 (나)에서 $m=k$, $n=k+1$로 두면\n$f(k)-f(k+1)=f\\left(\\dfrac{k}{k+1}\\right)$이다.\n따라서 각 항은\n$\\dfrac{f\\left(\\frac{k}{k+1}\\right)}{f(k)f(k+1)}$\n$=\\dfrac{f(k)-f(k+1)}{f(k)f(k+1)}$\n$=\\dfrac1{f(k+1)}-\\dfrac1{f(k)}$이다.\n이제 조건을 이용해 $f(16)$을 구한다.\n$m=4,n=2$를 대입하면 $f(4)-f(2)=f(2)=1$이므로 $f(4)=2$이다.\n$m=8,n=2$를 대입하면 $f(8)-f(2)=f(4)=2$이므로 $f(8)=3$이다.\n$m=16,n=2$를 대입하면 $f(16)-f(2)=f(8)=3$이므로 $f(16)=4$이다.\n따라서 주어진 합은\n$\\left(\\dfrac1{f(3)}-\\dfrac1{f(2)}\\right)+\\cdots+\\left(\\dfrac1{f(16)}-\\dfrac1{f(15)}\\right)$\n$=\\dfrac1{f(16)}-\\dfrac1{f(2)}=\\dfrac14-1=-\\dfrac34$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 25,
    "questionNumber": 25,
    "questionType": "객관식",
    "images": [
      "assets/images/19_강남여고_1학기_기말_고2_수학I/q25.png"
    ],
    "content": "<p>그림과 같이 중심이 $\\mathrm{O}_1$이고 반지름의 길이가 $1$인 원 $C_1$이 중심이 $\\mathrm{O}_2$이고 반지름의 길이가 $3$인 원 $C_2$에 내접하고 있다. 중심이 $\\mathrm{O}_3$인 원 $C_3$이 원 $C_1$과 외접하고 원 $C_2$에 내접할 때, $\\angle\\mathrm{O}_1\\mathrm{O}_3\\mathrm{O}_2$의 이등분선이 선분 $\\mathrm{O}_1\\mathrm{O}_2$와 만나는 점을 $\\mathrm{A}$라 하자. $\\overline{\\mathrm{O}_1\\mathrm{A}} = 2 \\times \\overline{\\mathrm{O}_2\\mathrm{A}}$일 때, 선분 $\\mathrm{O}_3\\mathrm{A}$의 길이는? [4점]</p><p><img src=\"assets/images/19_강남여고_1학기_기말_고2_수학I/q25.png\" class=\"question-img\" alt=\"문제 25 그림\"></p>",
    "image": "assets/images/19_강남여고_1학기_기말_고2_수학I/q25.png",
    "choices": [
      "\\dfrac{3\\sqrt{6}}{4}",
      "\\dfrac{\\sqrt{6}}{2}",
      "\\sqrt{6}",
      "\\dfrac{2\\sqrt{6}}{3}",
      "\\dfrac{\\sqrt{6}}{3}"
    ],
    "answer": "④",
    "solution": "$O_1O_2=3-1=2$이므로 $O_1A=2O_2A$와 함께\n$O_1A+O_2A=2$이다.\n따라서\n$O_2A=\\dfrac23$, $O_1A=\\dfrac43$이다.\n$O_3A$는 삼각형 $O_1O_3O_2$에서 $O_3$의 각의 이등분선이므로 각의 이등분선 정리에 따라\n$\\dfrac{O_1O_3}{O_2O_3}=\\dfrac{O_1A}{O_2A}=2$이다.\n$C_3$의 반지름을 $r$이라 하면 두 원의 접하는 조건에서\n$O_1O_3=1+r$, $O_2O_3=3-r$이다.\n따라서\n$O_1O_3+O_2O_3=4$이고, 두 길이의 비가 $2:1$이므로\n$O_1O_3=\\dfrac83$, $O_2O_3=\\dfrac43$이다.\n좌표를 두어 길이를 구한다.\n$O_1=(0,0)$, $O_2=(2,0)$이라 하면 $A=(\\dfrac43,0)$이다.\n$O_3=(x,y)$라 놓으면\n$x^2+y^2=\\left(\\dfrac83\\right)^2=\\dfrac{64}{9}$,\n$(x-2)^2+y^2=\\left(\\dfrac43\\right)^2=\\dfrac{16}{9}$이다.\n첫째 식에서 둘째 식을 빼면\n$x^2-(x-2)^2=\\dfrac{64}{9}-\\dfrac{16}{9}$,\n$4x-4=\\dfrac{16}{3}$,\n$x=\\dfrac73$이다.\n따라서\n$y^2=\\dfrac{64}{9}-\\left(\\dfrac73\\right)^2=\\dfrac{15}{9}=\\dfrac53$이다.\n그러므로\n$O_3A^2=\\left(\\dfrac73-\\dfrac43\\right)^2+\\dfrac53=1+\\dfrac53=\\dfrac83$,\n$O_3A=\\sqrt{\\dfrac83}=\\dfrac{2\\sqrt6}{3}$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 26,
    "questionNumber": 26,
    "questionType": "객관식",
    "content": "자연수 $k$에 대하여 집합 $A_k$를 $$A_k = \\left\\{(a, b) \\mid \\log_a b = \\dfrac{k}{3}, \\text{ $a$와 $b$는 $2$ 이상 $100$ 이하의 자연수}\\right\\}$$라 할 때, $n(A_k) = 1$인 모든 자연수 $k$의 값의 합은? [4점]",
    "choices": [
      "37",
      "38",
      "39",
      "35",
      "36"
    ],
    "answer": "②",
    "solution": "$\\log_a b=\\dfrac{k}{3}$은 $a^k=b^3$과 같다.\n먼저 $3$이 $k$를 나누지 않는 경우를 본다. $k$와 $3$이 서로소이므로 소인수분해에서 지수의 배수를 비교하면 어떤 자연수 $c\\ge2$에 대하여 $a=c^3$, $b=c^k$로 쓸 수 있다.\n$a\\le100$에서 $c^3\\le100$이므로 $c=2,3,4$이다.\n각 $c$에 대해 $b=c^k\\le100$이 되려면\n$c=2$일 때 $k\\le6$,\n$c=3$일 때 $k\\le4$,\n$c=4$일 때 $k\\le3$이다.\n단, 이 경우 $3\\nmid k$이므로 가능한 쌍의 수가 하나인 값은 $k=5$뿐이다. 이때 $(a,b)=(8,32)$이다.\n다음으로 $k=3t$인 경우에는 $a^{3t}=b^3$에서 양의 정수이므로 $b=a^t$이다.\n$a^t\\le100$을 만족하는 $a=2,3,\\ldots$의 개수는 $t=1,2,3,4,5,6$일 때 각각 $99,9,3,2,1,1$이고, $t\\ge7$일 때는 $0$이다.\n따라서 이 경우 $n(A_k)=1$인 값은 $t=5,6$, 즉 $k=15,18$이다.\n그러므로 구하는 합은\n$5+15+18=38$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 27,
    "questionNumber": 27,
    "questionType": "서술형",
    "content": "다음 물음에 답하시오. [총 5점]<br>(1) $\\cos 60^\\circ \\times \\sin 30^\\circ$ [2점]<br>(2) $a > 0$일 때, $\\sqrt{\\dfrac{a^5 + a^7 + a^9 + a^{11}}{a^{-9} + a^{-11} + a^{-13} + a^{-15}}}$은 간단히 하면? [3점]",
    "choices": [],
    "answer": "(1) $\\dfrac14$, (2) $a^{10}$",
    "solution": "(1) 특수각의 삼각비를 대입한다.\n$\\cos60^\\circ\\times\\sin30^\\circ=\\dfrac12\\times\\dfrac12=\\dfrac14$이다.\n\n(2) 분자와 분모에서 공통인 다항식을 찾아 묶는다.\n$\\dfrac{a^5+a^7+a^9+a^{11}}{a^{-9}+a^{-11}+a^{-13}+a^{-15}}$\n$=\\dfrac{a^5(1+a^2+a^4+a^6)}{a^{-15}(a^6+a^4+a^2+1)}$\n$=\\dfrac{a^5(1+a^2+a^4+a^6)}{a^{-15}(1+a^2+a^4+a^6)}$\n$=a^{20}$이다.\n$a>0$이므로 제곱근은 양수인 근을 취해\n$\\sqrt{a^{20}}=a^{10}$이다.\n따라서 답은 (1) $\\dfrac14$, (2) $a^{10}$이다."
  },
  {
    "id": 28,
    "questionNumber": 28,
    "questionType": "서술형",
    "content": "함수 $f(x) = a\\tan(bx+c)+d$가 다음 조건을 만족시킬 때, 상수 $a, b, c, d$에 대하여 $abcd$의 값을 구하시오. (단, $b>0$) [5점]<div class=\"box-content\">&lt;조건&gt;<br>(가) 주기가 $\\dfrac{\\pi}{2}$인 주기함수이다.<br>(나) $f(x)$의 그래프는 $y=a\\tan bx$의 그래프를 $x$축의 방향으로 $\\dfrac{\\pi}{4}$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 것이다.<br>(다) $f\\left(\\dfrac{1}{3}\\pi\\right) = \\sqrt{3}-1$</div>",
    "choices": [],
    "answer": "$abcd$는 조건만으로 하나로 정해지지 않는다. 예를 들어 $3\\pi$, $-3\\pi$가 모두 가능하다.",
    "solution": "$y=a\\tan bx$의 그래프를 $x$축 방향으로 $\\dfrac\\pi4$만큼 평행이동하면\n$y=a\\tan\\left(b\\left(x-\\dfrac\\pi4\\right)\\right)$이므로,\n조건 (나)에서\n$f(x)=a\\tan\\left(bx-\\dfrac{b\\pi}{4}\\right)-1$이다.\n따라서 $d=-1$이다.\n탄젠트 함수는 각에 $\\pi$의 정수배를 더해도 값이 같으므로,\n$c=-\\dfrac{b\\pi}{4}+j\\pi$ ($j$는 정수)로 두어도 같은 그래프를 나타낸다.\n조건 (가)에 맞는 한 예로 $b=2$를 택하면 주기는 $\\dfrac\\pi2$이다.\n이때 $c=-\\dfrac\\pi2$와 $c=\\dfrac\\pi2$는 $\\pi$만큼 차이가 나므로 같은 탄젠트 함수를 만든다.\n$c=-\\dfrac\\pi2$일 때,\n$f\\left(\\dfrac\\pi3\\right)=a\\tan\\left(\\dfrac{2\\pi}{3}-\\dfrac\\pi2\\right)-1\n=a\\tan\\dfrac\\pi6-1\n=\\dfrac{a}{\\sqrt3}-1$이다.\n이 값이 $\\sqrt3-1$이므로 $\\dfrac a{\\sqrt3}=\\sqrt3$,\n$a=3$이다.\n$c=\\dfrac\\pi2$일 때도,\n$f\\left(\\dfrac\\pi3\\right)=a\\tan\\left(\\dfrac{2\\pi}{3}+\\dfrac\\pi2\\right)-1\n=a\\tan\\dfrac{7\\pi}{6}-1\n=\\dfrac{a}{\\sqrt3}-1=\\sqrt3-1$이다.\n따라서 이 경우에도 $a=3$이다.\n그러므로 주어진 조건을 만족하는 두 상수의 조합은\n$(a,b,c,d)=\\left(3,2,-\\dfrac\\pi2,-1\\right)$,\n$(a,b,c,d)=\\left(3,2,\\dfrac\\pi2,-1\\right)$이다.\n첫 번째 조합에서는 $abcd=3\\pi$이고,\n두 번째 조합에서는 $abcd=-3\\pi$이다.\n일반적으로 $c=-\\dfrac\\pi2+j\\pi$ ($j$는 정수)도 같은 탄젠트 함수를 나타낸다.\n이때\n$abcd=3\\times2\\times\\left(-\\dfrac\\pi2+j\\pi\\right)\\times(-1)\n=3\\pi-6j\\pi$이다.\n따라서 $abcd$의 값은 하나로 정해지지 않는다."
  },
  {
    "id": 29,
    "questionNumber": 29,
    "questionType": "서술형",
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n = 2n^2 - n + 3$일 때, 일반항 $a_n$과 $a_5 - a_1$의 값을 구하시오. (단, $a_n$과 $S_n$ 사이의 관계를 이용하여 풀이과정을 작성 할 것) [5점]",
    "choices": [],
    "answer": "$a_1=4$, $a_n=4n-3$ $(n\\ge2)$, $a_5-a_1=13$",
    "solution": "수열의 합과 일반항의 관계를 이용한다.\n첫째항은\n$a_1=S_1=2\\times1^2-1+3=4$이다.\n$n\\ge2$일 때\n$a_n=S_n-S_{n-1}$이다.\n$S_{n-1}=2(n-1)^2-(n-1)+3$\n$=2n^2-5n+6$이므로\n$a_n=(2n^2-n+3)-(2n^2-5n+6)$\n$=4n-3$이다.\n따라서 $a_5=4\\times5-3=17$이고,\n$a_5-a_1=17-4=13$이다.\n답은 $a_1=4$, $a_n=4n-3$ $(n\\ge2)$, $a_5-a_1=13$이다."
  },
  {
    "id": 30,
    "questionNumber": 30,
    "questionType": "서술형",
    "content": "등차수열 $\\{a_n\\}$이 다음 조건을 모두 만족시킨다.<div class=\"box-content\">&lt;조건&gt;<br>(가) $a_{10} = 0$<br>(나) 모든 자연수 $n$에 대하여 $a_{n+1} > a_n$이다.<br>(다) $a_5 a_{15} = -225$</div><br>수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $S_n$의 최솟값을 구하시오. [5점]",
    "choices": [],
    "answer": "$-135$",
    "solution": "등차수열의 공차를 $d$라 하자.\n$a_{n+1}>a_n$이므로 $d>0$이다.\n$a_{10}=0$에서\n$a_n=a_{10}+(n-10)d=(n-10)d$이다.\n따라서\n$a_5=-5d$, $a_{15}=5d$이고,\n$a_5a_{15}=-25d^2=-225$이다.\n$d^2=9$이고 $d>0$이므로 $d=3$이다.\n따라서 $a_n=3(n-10)$이고\n$S_n=\\displaystyle\\sum_{k=1}^{n}3(k-10)$\n$=3\\left(\\dfrac{n(n+1)}2-10n\\right)$\n$=\\dfrac32n(n-19)$이다.\n또한 $S_n-S_{n-1}=a_n=3(n-10)$이므로 $n=1,\\ldots,9$에서는 합이 감소하고, $n=10$에서는 변화가 없으며, $n\\ge11$에서는 증가한다.\n따라서 최솟값은 $n=9$와 $n=10$에서 얻는다.\n$S_9=\\dfrac32\\times9\\times(-10)=-135$,\n$S_{10}=\\dfrac32\\times10\\times(-9)=-135$이다.\n그러므로 $S_n$의 최솟값은 $-135$이다."
  }
];
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    exam: { title: window.examTitle },
    questions: window.questionBank
  };
}
