var examData = window.examData = {
  "exam": {
    "title": "2021학년도 순천강남여자고등학교 2학년 1학기 기말고사 수학 I",
    "school": "순천강남여자고등학교",
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
      "content": "$3^0 \\times 8^{\\frac{2}{3}}$의 값은? [2.5점]",
      "choices": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "answer": "④",
      "solution": "먼저 거듭제곱의 지수를 계산한다.\n$3^0=1$이고,\n$8^{\\frac23}=(\\sqrt[3]{8})^2=2^2=4$이다.\n따라서\n$3^0\\times8^{\\frac23}=1\\times4=4$이므로 정답은 ④이다."
    },
    {
      "id": 2,
      "questionNumber": 2,
      "questionType": "객관식",
      "content": "$\\log_5 40 + \\log_5 \\frac{5}{8}$의 값은? [2.5점]",
      "choices": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "answer": "②",
      "solution": "같은 밑 로그의 합에 대한 성질 $\\log_a M+\\log_a N=\\log_a(MN)$을 사용한다.\n$\\log_5 40+\\log_5\\frac58$\n$=\\log_5\\left(40\\times\\frac58\\right)$\n$=\\log_5 25$\n$=\\log_5 5^2=2$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 3,
      "questionNumber": 3,
      "questionType": "객관식",
      "content": "방정식 $\\log_3(x+2)=3$을 만족시키는 실수 $x$의 값은? [2.5점]",
      "choices": [
        "23",
        "24",
        "25",
        "26",
        "27"
      ],
      "answer": "③",
      "solution": "로그의 정의에 따라 진수는 밑을 로그값만큼 거듭제곱한 값이다.\n$\\log_3(x+2)=3$에서\n$x+2=3^3=27$이다.\n양변에서 2를 빼면\n$x=25$이다.\n진수 조건 $x+2>0$도 만족하므로 정답은 ③이다."
    },
    {
      "id": 4,
      "questionNumber": 4,
      "questionType": "객관식",
      "content": "부등식 $\\left(\\frac{1}{2}\\right)^{x-5} \\ge 4$를 만족시키는 모든 자연수 $x$의 값의 합은? [2.5점]",
      "choices": [
        "2",
        "3",
        "4",
        "5",
        "6"
      ],
      "answer": "⑤",
      "solution": "오른쪽을 밑이 $\\frac12$인 거듭제곱으로 나타낸다.\n$4=\\left(\\frac12\\right)^{-2}$이므로\n$\\left(\\frac12\\right)^{x-5}\\ge\\left(\\frac12\\right)^{-2}$이다.\n밑 $\\frac12$은 1보다 작으므로 지수가 작을수록 거듭제곱값은 크다. 따라서\n$x-5\\le-2$\n$x\\le3$이다.\n자연수 $x$는 1, 2, 3이고 그 합은\n$1+2+3=6$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 5,
      "questionNumber": 5,
      "questionType": "객관식",
      "content": "부등식 $\\log_3(x-2)<2$의 해의 범위를 $\\alpha < x < \\beta$라 할 때, $\\alpha+\\beta$의 값은? [2.5점]",
      "choices": [
        "13",
        "14",
        "15",
        "16",
        "17"
      ],
      "answer": "①",
      "solution": "먼저 로그의 진수가 양수여야 하므로\n$x-2>0$, 즉 $x>2$이다.\n밑 3은 1보다 크므로 로그함수는 증가한다. 따라서\n$\\log_3(x-2)<2$에서\n$x-2<3^2=9$\n$x<11$이다.\n두 조건을 합치면 해의 범위는 $2<x<11$이다.\n그러므로 $\\alpha=2$, $\\beta=11$이고\n$\\alpha+\\beta=2+11=13$이다.\n따라서 정답은 ①이다."
    },
    {
      "id": 6,
      "questionNumber": 6,
      "questionType": "객관식",
      "content": "두 수열 $\\{a_n\\}, \\{b_n\\}$에 대하여 $\\sum_{k=1}^{20} a_k = 2$, $\\sum_{k=1}^{20} b_k = 3$일 때, $\\sum_{k=1}^{20} (a_k - 3b_k + 2)$의 값은? [2.5점]",
      "choices": [
        "31",
        "32",
        "33",
        "34",
        "35"
      ],
      "answer": "③",
      "solution": "합의 성질을 이용해 항별 합을 나누어 계산한다.\n$\\displaystyle\\sum_{k=1}^{20}(a_k-3b_k+2)$\n$=\\displaystyle\\sum_{k=1}^{20}a_k-3\\displaystyle\\sum_{k=1}^{20}b_k+\\displaystyle\\sum_{k=1}^{20}2$이다.\n주어진 합을 대입하면\n$=2-3\\cdot3+20\\cdot2$\n$=2-9+40$\n$=33$이다.\n따라서 정답은 ③이다."
    },
    {
      "id": 7,
      "questionNumber": 7,
      "questionType": "객관식",
      "content": "세 수 $\\frac{9}{4}, a, 4$가 이 순서대로 등비수열을 이룰 때, 양수 $a$의 값은? [2.5점]",
      "choices": [
        "\\frac{8}{3}",
        "3",
        "\\frac{10}{3}",
        "\\frac{11}{3}",
        "4"
      ],
      "answer": "②",
      "solution": "세 수가 차례로 등비수열이므로 가운데 항의 제곱은 양 끝 항의 곱과 같다.\n$a^2=\\frac94\\times4=9$이다.\n문제에서 $a>0$이므로\n$a=3$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 8,
      "questionNumber": 8,
      "questionType": "객관식",
      "content": "그림과 같이 $a=2\\sqrt{2}$, $b=3$, $C=45^\\circ$인 삼각형 $ABC$에서 $c^2$의 값은? [2.5점]<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q08.png\" class=\"exam-img\">",
      "choices": [
        "5",
        "6",
        "7",
        "8",
        "9"
      ],
      "answer": "①",
      "solution": "삼각형에서 $a=BC$, $b=CA$, $c=AB$이므로 두 변 $a,b$와 그 끼인각 $C$가 주어졌다. 코사인 법칙을 사용하면\n$c^2=a^2+b^2-2ab\\cos C$이다.\n주어진 값을 대입하면\n$c^2=(2\\sqrt2)^2+3^2-2\\cdot2\\sqrt2\\cdot3\\cos45^\\circ$\n$=8+9-12\\sqrt2\\cdot\\frac{\\sqrt2}{2}$\n$=17-12$\n$=5$이다.\n따라서 정답은 ①이다.",
      "images": [
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q08.png"
      ]
    },
    {
      "id": 9,
      "questionNumber": 9,
      "questionType": "객관식",
      "content": "제5항이 16, 제8항이 25인 등차수열 $\\{a_n\\}$의 제13항의 값은? [3점]",
      "choices": [
        "34",
        "36",
        "38",
        "40",
        "42"
      ],
      "answer": "④",
      "solution": "등차수열에서 제5항부터 제8항까지는 공차를 세 번 더한 차이다.\n$ a_8-a_5=3d$이므로\n$25-16=3d$\n$9=3d$\n$d=3$이다.\n제13항은 제8항에서 공차를 다섯 번 더한 값이므로\n$a_{13}=a_8+5d$\n$=25+5\\cdot3$\n$=40$이다.\n따라서 정답은 ④이다."
    },
    {
      "id": 10,
      "questionNumber": 10,
      "questionType": "객관식",
      "content": "수열 $\\{a_n\\}$은 $a_1=1$이고 모든 자연수 $n$에 대하여 $a_{n+1}+3a_n=(-1)^n \\times n$을 만족시킨다. $a_4$의 값은? [3점]",
      "choices": [
        "-45",
        "-14",
        "-4",
        "14",
        "45"
      ],
      "answer": "①",
      "solution": "점화식에 $n=1,2,3$을 차례로 대입한다.\n$n=1$일 때\n$a_2+3a_1=(-1)^1\\cdot1=-1$이다.\n$a_1=1$을 대입하면\n$a_2+3=-1$\n$a_2=-4$이다.\n$n=2$일 때\n$a_3+3a_2=(-1)^2\\cdot2=2$이므로\n$a_3+3(-4)=2$\n$a_3-12=2$\n$a_3=14$이다.\n$n=3$일 때\n$a_4+3a_3=(-1)^3\\cdot3=-3$이므로\n$a_4+3\\cdot14=-3$\n$a_4+42=-3$\n$a_4=-45$이다.\n따라서 정답은 ①이다."
    },
    {
      "id": 11,
      "questionNumber": 11,
      "questionType": "객관식",
      "content": "$\\sum_{k=1}^{7} \\frac{1}{(k+1)(k+2)}$의 값은? [3점]",
      "choices": [
        "\\frac{2}{9}",
        "\\frac{4}{9}",
        "\\frac{5}{18}",
        "\\frac{1}{3}",
        "\\frac{7}{18}"
      ],
      "answer": "⑤",
      "solution": "각 항을 부분분수로 나누면\n$\\displaystyle\\frac1{(k+1)(k+2)}=\\frac1{k+1}-\\frac1{k+2}$이다.\n따라서 합은\n$\\displaystyle\\sum_{k=1}^{7}\\left(\\frac1{k+1}-\\frac1{k+2}\\right)$\n$=\\left(\\frac12-\\frac13\\right)+\\left(\\frac13-\\frac14\\right)+\\cdots+\\left(\\frac18-\\frac19\\right)$이다.\n중간 항이 서로 없어져\n$=\\frac12-\\frac19$\n$=\\frac9{18}-\\frac2{18}$\n$=\\frac7{18}$이다.\n따라서 정답은 ⑤이다."
    },
    {
      "id": 12,
      "questionNumber": 12,
      "questionType": "객관식",
      "content": "첫째항부터 제3항까지의 합이 14, 첫째항부터 제6항까지의 합이 126인 등비수열의 첫째항과 공비를 각각 $a, r$이라 할 때, $a+r$의 값은? [3점]",
      "choices": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "answer": "④",
      "solution": "첫째항부터 제6항까지의 합은 첫째항부터 제3항까지의 합에 다음 세 항의 합을 더한 것이다. 등비수열이므로 뒤의 세 항의 합은 앞의 세 항의 합에 $r^3$을 곱한 값이다. 따라서\n$S_6=S_3+r^3S_3=S_3(1+r^3)$이다.\n주어진 합을 대입하면\n$126=14(1+r^3)$\n$9=1+r^3$\n$r^3=8$\n$r=2$이다.\n또\n$S_3=a(1+r+r^2)=14$이므로\n$a(1+2+4)=14$\n$7a=14$\n$a=2$이다.\n따라서\n$a+r=2+2=4$이고 정답은 ④이다."
    },
    {
      "id": 13,
      "questionNumber": 13,
      "questionType": "객관식",
      "content": "수열 $\\{a_n\\}$이 $a_n = \\sqrt{n+1}-\\sqrt{n}$ $(n=1, 2, 3, \\cdots)$일 때, $\\sum_{k=1}^{8} (a_k+1)^2 - \\sum_{k=1}^{8} (a_k-1)^2$의 값은? [3점]",
      "choices": [
        "2",
        "4",
        "6",
        "8",
        "10"
      ],
      "answer": "④",
      "solution": "제곱식의 차를 먼저 정리한다.\n$(a_k+1)^2-(a_k-1)^2$\n$=(a_k^2+2a_k+1)-(a_k^2-2a_k+1)$\n$=4a_k$이다.\n따라서 구하는 값은\n$4\\displaystyle\\sum_{k=1}^{8}a_k$이다.\n$a_k=\\sqrt{k+1}-\\sqrt{k}$이므로 합은 망원합으로 계산된다.\n$\\displaystyle\\sum_{k=1}^{8}a_k=(\\sqrt2-1)+(\\sqrt3-\\sqrt2)+\\cdots+(\\sqrt9-\\sqrt8)$\n$=\\sqrt9-\\sqrt1=3-1=2$이다.\n그러므로 구하는 값은\n$4\\cdot2=8$이고 정답은 ④이다."
    },
    {
      "id": 14,
      "questionNumber": 14,
      "questionType": "객관식",
      "content": "세 실수 $a, b, c$가 이 순서대로 등차수열을 이루고 다음 조건을 만족시킬 때, $abc$의 값은? [3점]<div class=\"exam-box\"><b>&lt;조건&gt;</b><br>(가) $\\frac{2^a \\times 2^c}{2^b} = 32$<br>(나) $a+c+ac=26$</div>",
      "choices": [
        "60",
        "80",
        "100",
        "75",
        "90"
      ],
      "answer": "②",
      "solution": "$a,b,c$가 이 순서대로 등차수열이므로\n$a+c=2b$이다.\n조건 (가)의 왼쪽을 거듭제곱의 법칙으로 합치면\n$\\frac{2^a\\cdot2^c}{2^b}=2^{a+c-b}=32=2^5$이다.\n밑이 같은 거듭제곱의 지수를 비교하여\n$a+c-b=5$이다.\n$a+c=2b$를 대입하면\n$2b-b=5$\n$b=5$이다.\n조건 (나)에 대입하면\n$a+c+ac=26$\n$2b+ac=26$\n$10+ac=26$\n$ac=16$이다.\n따라서\n$abc=(ac)b=16\\cdot5=80$이고 정답은 ②이다."
    },
    {
      "id": 15,
      "questionNumber": 15,
      "questionType": "객관식",
      "content": "반지름의 길이가 4이고 넓이가 $\\frac{4}{3}\\pi$인 부채꼴의 중심각의 크기와 호의 길이를 각각 $\\theta$와 $l$이라 할 때, $\\frac{\\pi^2}{\\theta \\times l}$의 값은? [3점]",
      "choices": [
        "8",
        "9",
        "10",
        "\\frac{1}{8}",
        "\\frac{1}{9}"
      ],
      "answer": "②",
      "solution": "라디안으로 나타낸 중심각을 $\\theta$라 두고 부채꼴의 넓이 공식을 적용한다.\n$\\frac12r^2\\theta=\\frac12\\cdot4^2\\cdot\\theta=\\frac43\\pi$이므로\n$8\\theta=\\frac43\\pi$\n$\\theta=\\frac{\\pi}{6}$이다.\n호의 길이는 $l=r\\theta$이므로\n$l=4\\cdot\\frac{\\pi}{6}=\\frac{2\\pi}{3}$이다.\n따라서\n$\\theta l=\\frac{\\pi}{6}\\cdot\\frac{2\\pi}{3}=\\frac{\\pi^2}{9}$이고\n$\\frac{\\pi^2}{\\theta l}=\\frac{\\pi^2}{\\pi^2/9}=9$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 16,
      "questionNumber": 16,
      "questionType": "객관식",
      "content": "$0 \\le x < \\frac{5}{2}\\pi$에서 방정식 $3\\sin x = 1$을 만족시키는 $x$의 값을 작은 것부터 차례로 $a, b, c$라 할 때, $\\sin\\left(a+\\frac{b-c}{2}\\right)$의 값은? [3점]",
      "choices": [
        "-1",
        "-\\frac{1}{2}",
        "0",
        "\\frac{1}{2}",
        "1"
      ],
      "answer": "①",
      "solution": "$0<\\alpha<\\frac\\pi2$이고 $\\sin\\alpha=\\frac13$인 각 $\\alpha$를 둔다. 주어진 범위에서 $\\sin x=\\frac13$의 해는\n$a=\\alpha,\\quad b=\\pi-\\alpha,\\quad c=2\\pi+\\alpha$이다.\n따라서\n$a+\\frac{b-c}{2}$\n$=\\alpha+\\frac{(\\pi-\\alpha)-(2\\pi+\\alpha)}2$\n$=\\alpha+\\frac{-\\pi-2\\alpha}2$\n$=\\alpha-\\frac\\pi2-\\alpha$\n$=-\\frac\\pi2$이다.\n그러므로\n$\\sin\\left(a+\\frac{b-c}{2}\\right)=\\sin\\left(-\\frac\\pi2\\right)=-1$이고 정답은 ①이다."
    },
    {
      "id": 17,
      "questionNumber": 17,
      "questionType": "객관식",
      "content": "$\\tan\\theta = 2$일 때, $\\frac{\\left\\{\\cos(3\\pi+\\theta)+\\sin\\left(\\frac{3}{2}\\pi-\\theta\\right)\\right\\}^2}{\\tan(\\pi-\\theta)}$의 값은? [3점]",
      "choices": [
        "-\\frac{4}{5}",
        "-\\frac{2}{5}",
        "0",
        "\\frac{2}{5}",
        "\\frac{4}{5}"
      ],
      "answer": "②",
      "solution": "삼각함수의 주기와 변환 공식을 사용한다.\n$\\cos(3\\pi+\\theta)=-\\cos\\theta$이고\n$\\sin\\left(\\frac32\\pi-\\theta\\right)=-\\cos\\theta$이다.\n따라서 분자의 괄호 안은\n$-\\cos\\theta-\\cos\\theta=-2\\cos\\theta$이고, 그 제곱은 $4\\cos^2\\theta$이다.\n또\n$\\tan(\\pi-\\theta)=-\\tan\\theta=-2$이다.\n$1+\\tan^2\\theta=\\frac1{\\cos^2\\theta}$에서\n$\\cos^2\\theta=\\frac1{1+2^2}=\\frac15$이다.\n그러므로 주어진 식은\n$\\frac{4\\cos^2\\theta}{\\tan(\\pi-\\theta)}=\\frac{4\\cdot\\frac15}{-2}=-\\frac25$이다.\n따라서 정답은 ②이다."
    },
    {
      "id": 18,
      "questionNumber": 18,
      "questionType": "객관식",
      "content": "등차수열 $\\{a_n\\}$과 등비수열 $\\{b_n\\}$은 다음 조건을 만족시킨다.<div class=\"exam-box\"><b>&lt;조건&gt;</b><br>(가) $a_1=2, b_1=2$<br>(나) $a_2=b_2, a_4=b_4$</div>$a_5+b_5$의 값은? (단, 수열 $\\{b_n\\}$의 공비는 1이 아니다.) [3점]",
      "choices": [
        "10",
        "13",
        "16",
        "19",
        "22"
      ],
      "answer": "①",
      "solution": "등차수열 $\\{a_n\\}$의 공차를 $d$, 등비수열 $\\{b_n\\}$의 공비를 $r$이라 놓는다.\n첫째항이 각각 2이므로\n$a_2=2+d,\\quad b_2=2r$\n$a_4=2+3d,\\quad b_4=2r^3$이다.\n$a_2=b_2$에서\n$2+d=2r$\n$d=2r-2$이다.\n$a_4=b_4$에 대입하면\n$2+3(2r-2)=2r^3$\n$6r-4=2r^3$\n$r^3-3r+2=0$\n$(r-1)^2(r+2)=0$이다.\n공비가 1이 아니므로 $r=-2$이고\n$d=2(-2)-2=-6$이다.\n따라서\n$a_5=2+4(-6)=-22$\n$b_5=2(-2)^4=32$\n$a_5+b_5=-22+32=10$이다.\n따라서 정답은 ①이다."
    },
    {
      "id": 19,
      "questionNumber": 19,
      "questionType": "객관식",
      "content": "등차수열을 이루는 네 수가 다음 조건을 모두 만족할 때, 이 네 수 중 가장 큰 수는? [3.5점]<div class=\"exam-box\"><b>&lt;조건&gt;</b><br>(가) 네 수의 합이 36이다.<br>(나) 처음 수와 마지막 수의 곱은 가운데 두 수의 곱보다 32가 작다.</div>",
      "choices": [
        "11",
        "12",
        "13",
        "14",
        "15"
      ],
      "answer": "⑤",
      "solution": "네 수의 공차를 $d$, 가운데 두 수의 평균을 $u$라 놓으면 네 수는\n$u-\\frac32d,\\quad u-\\frac12d,\\quad u+\\frac12d,\\quad u+\\frac32d$이다.\n네 수의 합이 36이므로\n$4u=36$\n$u=9$이다.\n처음 수와 마지막 수의 곱은 가운데 두 수의 곱보다 32만큼 작으므로\n$(u-\\frac32d)(u+\\frac32d)=(u-\\frac12d)(u+\\frac12d)-32$이다.\n차의 곱 공식을 적용하면\n$u^2-\\frac94d^2=u^2-\\frac14d^2-32$\n$-2d^2=-32$\n$d^2=16$\n$|d|=4$이다.\n따라서 네 수는 $9-6,9-2,9+2,9+6$, 즉 $3,7,11,15$이거나 그 역순이다.\n가장 큰 수는 15이므로 정답은 ⑤이다."
    },
    {
      "id": 20,
      "questionNumber": 20,
      "questionType": "객관식",
      "content": "스웨덴의 수학자 코흐는 정삼각형을 이용하여 눈송이 모양을 만드는 방법을 소개하였다. 다음은 눈송이 모양을 만드는 데 사용되는 원리이다.<div class=\"exam-box\"><b>&lt;원리&gt;</b><br>그림과 같이 한 선분을 삼등분 한 후 그 가운데 선분을 한 변으로 하는 정삼각형을 그리고 가운데 선분은 지운다.<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q20_1.png\" class=\"exam-img\"></div>그림과 같이 정삼각형의 각 변에 위의 과정을 반복하면 눈송이 모양의 도형을 얻을 수 있는데, 이것을 코흐의 눈송이라 한다.<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q20_2.png\" class=\"exam-img\"><br><br>처음 정삼각형의 한 변의 길이를 1이라 할 때, 4번째 만들어지는 도형의 둘레의 길이는? [3.5점]",
      "choices": [
        "4",
        "\\frac{49}{9}",
        "\\frac{64}{9}",
        "9",
        "\\frac{83}{9}"
      ],
      "answer": "③",
      "solution": "한 번의 과정에서 선분 하나는 길이가 각각 원래의 $\\frac13$인 선분 네 개로 바뀐다. 따라서 둘레는 한 과정마다 $\\frac43$배가 된다.\n처음 정삼각형은 첫 번째 도형이고, 그 둘레는\n$3\\cdot1=3$이다.\n두 번째 도형의 둘레는\n$3\\cdot\\frac43=4$\n세 번째 도형의 둘레는\n$4\\cdot\\frac43=\\frac{16}{3}$\n네 번째 도형의 둘레는\n$\\frac{16}{3}\\cdot\\frac43=\\frac{64}{9}$이다.\n따라서 정답은 ③이다.",
      "images": [
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q20_1.png",
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q20_2.png"
      ]
    },
    {
      "id": 21,
      "questionNumber": 21,
      "questionType": "객관식",
      "content": "그림과 같이 반지름의 길이가 2인 원에 내접하는 $\\triangle\\mathrm{ABC}$와 $\\triangle\\mathrm{DEF}$가 정삼각형이라 할 때, 색칠된 부분의 넓이는 $a\\pi+b\\sqrt{3}$일 때, $a^2+b^2$의 값은? (단, $\\overline{\\mathrm{EF}} // \\overline{\\mathrm{BC}}$) [3.5점]<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q21.png\" class=\"exam-img\">",
      "choices": [
        "24",
        "26",
        "28",
        "30",
        "32"
      ],
      "answer": "⑤",
      "solution": "원의 반지름이 2이므로 원의 넓이는\n$\\pi\\cdot2^2=4\\pi$이다.\n내접 정삼각형의 한 변은 반지름 2인 원의 중심각 $120^\\circ$에 대응하는 현이므로\n$2\\cdot2\\sin60^\\circ=2\\sqrt3$이다.\n정삼각형 한 개의 넓이는\n$\\frac{\\sqrt3}{4}(2\\sqrt3)^2=3\\sqrt3$이다.\n두 삼각형이 겹치는 가운데 정육각형의 한 변을 구한다. 좌표평면의 원점을 중심 $O$에 두고, 그림처럼 $BC$를 수평으로 잡으면 $BC$는 $y=-1$에 놓을 수 있다. (중심에서 현 $BC$까지의 거리는 $2\\cos60^\\circ=1$이다.) 따라서\n$B=(-\\sqrt3,-1),\\quad C=(\\sqrt3,-1),\\quad A=(0,2)$이다.\n$EF\\parallel BC$이고 반대 방향의 정삼각형이므로\n$E=(-\\sqrt3,1),\\quad F=(\\sqrt3,1)$이다.\n직선 $AB$의 기울기는 $\\frac{-1-2}{-\\sqrt3-0}=\\sqrt3$이므로\n$AB: y=\\sqrt3 x+2$이다.\n$AB$와 $EF$의 교점에서는 $y=1$이므로\n$1=\\sqrt3 x+2$\n$x=-\\frac1{\\sqrt3}$이다. 대칭인 반대쪽 교점의 $x$좌표는 $\\frac1{\\sqrt3}$이므로 가운데 정육각형의 한 변은\n$\\frac1{\\sqrt3}-(-\\frac1{\\sqrt3})=\\frac2{\\sqrt3}$이다.\n정육각형의 넓이는\n$6\\cdot\\frac{\\sqrt3}{4}(\\frac2{\\sqrt3})^2=2\\sqrt3$이다.\n색칠되지 않은 두 정삼각형의 합집합 넓이는 두 삼각형의 넓이 합에서 겹친 정육각형을 한 번 빼어\n$3\\sqrt3+3\\sqrt3-2\\sqrt3=4\\sqrt3$이다.\n따라서 색칠된 부분의 넓이는\n$4\\pi-4\\sqrt3$이다.\n$a=4, b=-4$이므로\n$a^2+b^2=4^2+(-4)^2=32$이다.\n따라서 정답은 ⑤이다.",
      "images": [
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q21.png"
      ]
    },
    {
      "id": 22,
      "questionNumber": 22,
      "questionType": "객관식",
      "content": "실수 $a$에 대하여 $0 < x < 2$일 때, $x$에 대한 방정식 $$3\\cos\\left(2\\pi x - \\frac{\\pi}{3}\\right)=a$$의 실근의 개수를 $f(a)$라 하자. 집합 $\\{f(a) \\mid a\\text{는 실수}\\}$의 원소의 개수를 $m$, 모든 원소의 합을 $n$이라 할 때, $m+n$의 값은? [3.5점]",
      "choices": [
        "10",
        "11",
        "12",
        "13",
        "14"
      ],
      "answer": "④",
      "solution": "$t=2\\pi x-\\frac\\pi3$이라 놓으면 $0<x<2$에서\n$-\\frac\\pi3<t<\\frac{11\\pi}3$이다.\n방정식은 $3\\cos t=a$가 된다. 코사인의 값의 범위는 $-1\\le\\cos t\\le1$이므로 $-3\\le a\\le3$일 때만 해가 있다.\n끝점 $t=-\\frac\\pi3,\\frac{11\\pi}3$에서 코사인값은 모두 $\\frac12$이다. 따라서 $-3<a<3$이고 $a\\ne\\frac32$이면 수평선 $y=\\frac a3$은 이 길이 $4\\pi$인 열린 구간 안에서 코사인 그래프와 네 번 만나므로 해는 4개이다.\n$a=\\frac32$이면 끝점 두 곳도 근이지만 $t$의 구간은 열린 구간이므로 두 근은 제외된다. 구간 안의 근은 $t=\\frac\\pi3,\\frac{5\\pi}3,\\frac{7\\pi}3$의 세 개이다.\n$a=3$ 또는 $a=-3$이면 각각 코사인의 최댓값 또는 최솟값을 두 주기 안에서 두 번 만나므로 해는 2개이다. $a<-3$ 또는 $a>3$이면 해가 없다.\n따라서 가능한 $f(a)$의 값은\n$0,2,3,4$이다.\n그러므로 $m=4$, $n=0+2+3+4=9$이고\n$m+n=4+9=13$이다.\n따라서 정답은 ④이다."
    },
    {
      "id": 23,
      "questionNumber": 23,
      "questionType": "객관식",
      "content": "그림과 같이 $\\overline{\\mathrm{AB}}=\\overline{\\mathrm{BC}}=2$, $\\angle\\mathrm{ABC}=\\frac{2}{3}\\pi$인 삼각형 $\\mathrm{ABC}$의 외접원을 $C$라 하자. 점 $\\mathrm{B}$를 포함하지 않는 호 $\\mathrm{AC}$ 위의 점 $\\mathrm{P}$에 대하여 $2\\overline{\\mathrm{AP}}=3\\overline{\\mathrm{CP}}$이다. 삼각형 $\\mathrm{APC}$의 넓이를 $S$, 원 $C$의 반지름의 길이를 $R$이라 할 때, $\\frac{7S}{R}$의 값은? [4점]<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q23.png\" class=\"exam-img\">",
      "choices": [
        "8\\sqrt{3}",
        "9\\sqrt{3}",
        "10\\sqrt{3}",
        "11\\sqrt{3}",
        "12\\sqrt{3}"
      ],
      "answer": "②",
      "solution": "먼저 코사인 법칙으로 $AC$를 구한다.\n$AC^2=AB^2+BC^2-2\\cdot AB\\cdot BC\\cos\\angle ABC$\n$=2^2+2^2-2\\cdot2\\cdot2\\cos120^\\circ$\n$=4+4-8(-\\frac12)=12$이므로\n$AC=2\\sqrt3$이다.\n외접원의 반지름은 현 $AC$와 그 현이 보는 원주각 $\\angle ABC=120^\\circ$를 이용해\n$AC=2R\\sin120^\\circ$\n$2\\sqrt3=2R\\cdot\\frac{\\sqrt3}{2}$\n$R=2$이다.\n점 $P$는 $B$를 포함하지 않는 호 $AC$ 위에 있으므로 $\\angle APC$는 $B$를 포함하는 호 $AC$를 본다. 그 호의 중심각은 $120^\\circ$이므로\n$\\angle APC=60^\\circ$이다.\n$2AP=3CP$에서 $AP:CP=3:2$이므로\n$AP=3t,\\quad CP=2t$라 놓는다. 코사인 법칙을 삼각형 $APC$에 적용하면\n$AC^2=(3t)^2+(2t)^2-2\\cdot3t\\cdot2t\\cos60^\\circ$\n$12=9t^2+4t^2-6t^2$\n$12=7t^2$\n$t^2=\\frac{12}{7}$이다.\n따라서 삼각형 $APC$의 넓이는\n$S=\\frac12\\cdot3t\\cdot2t\\sin60^\\circ$\n$=3t^2\\cdot\\frac{\\sqrt3}{2}$\n$=\\frac{18\\sqrt3}{7}$이다.\n그러므로\n$\\frac{7S}{R}=\\frac{7\\cdot\\frac{18\\sqrt3}{7}}2=9\\sqrt3$이다.\n따라서 정답은 ②이다.",
      "images": [
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q23.png"
      ]
    },
    {
      "id": 24,
      "questionNumber": 24,
      "questionType": "객관식",
      "content": "함수 $f(x)=\\frac{1}{2}x^2$이 있다. 자연수 $n$에 대하여 곡선 $y=f(x)$ 위의 점 $P(n, f(n))$에서 $y$축에 내린 수선의 발을 $Q$라 할 때, 다음 조건을 만족시키는 모든 점 $R$의 $y$좌표의 합을 $a_n$이라 하자.<div class=\"exam-box\"><b>&lt;조건&gt;</b><br>점 $R$는 $y$좌표가 자연수인 $y$축 위의 점이고, 점 $Q$와 점 $R$ 사이의 거리는 1이하이다.</div>예를 들어, $a_2=1+2+3=6, a_3=4+5=9$이다. $\\sum_{n=1}^{10} a_n$의 값은? [4점]",
      "choices": [
        "475",
        "480",
        "485",
        "490",
        "495"
      ],
      "answer": "⑤",
      "solution": "점 $Q$는 $P(n,\\frac12n^2)$에서 $y$축에 내린 수선의 발이므로\n$Q=(0,\\frac12n^2)$이다. $R=(0,k)$라 하면 $k$는 자연수이고\n$QR\\le1$은 $|k-\\frac12n^2|\\le1$과 같다.\n$n=1$이면 $Q$의 $y$좌표는 $\\frac12$이고 가능한 자연수 $k$는 1뿐이므로 $a_1=1$이다.\n$n$이 홀수이고 $n\\ge3$이면 $\\frac12n^2$의 양옆 자연수 좌표는 $\\frac{n^2-1}{2}$와 $\\frac{n^2+1}{2}$이다. 두 수의 합은 $n^2$이므로 $a_n=n^2$이다. (예를 들어 $n=3$이면 $4+5=9$이다.)\n$n$이 짝수이면 $\\frac12n^2$는 자연수이고, 그 값의 1 아래와 1 위의 자연수 좌표도 포함된다. 따라서\n$a_n=3\\cdot\\frac12n^2=\\frac32n^2$이다.\n홀수 $n=1,3,5,7,9$에 대하여\n$\\sum n^2=1+9+25+49+81=165$이다.\n짝수 $n=2,4,6,8,10$에 대하여\n$\\sum\\frac32n^2=\\frac32(4+16+36+64+100)=\\frac32\\cdot220=330$이다.\n따라서\n$\\displaystyle\\sum_{n=1}^{10}a_n=165+330=495$이고 정답은 ⑤이다."
    },
    {
      "id": 25,
      "questionNumber": 25,
      "questionType": "객관식",
      "content": "자연수 $n$에 대하여 두 수열 $\\{a_n\\}, \\{b_n\\}$을 다음과 같이 정의하자.<div class=\"exam-box\"><b>&lt;정의&gt;</b><br>(가) $a_1=14, a_3=10, 2a_{n+1}=a_n+a_{n+2}$<br>(나) $b_1=b, b_{n+1}=r b_n$</div>$a_m=b_k$를 만족시키는 2 이상의 두 자연수 $m$과 $k$가 존재하도록 하는 두 자연수 $b, r$의 순서쌍 $(b, r)$의 개수는? [4점]",
      "choices": [
        "21",
        "22",
        "23",
        "24",
        "25"
      ],
      "answer": "③",
      "solution": "점화식 $2a_{n+1}=a_n+a_{n+2}$를 정리하면\n$a_{n+2}-a_{n+1}=a_{n+1}-a_n$이다.\n따라서 $\\{a_n\\}$은 등차수열이다. $a_1=14$, $a_3=10$이므로 공차는\n$d=\\frac{10-14}{2}=-2$이다.\n따라서\n$a_m=14-2(m-1)=16-2m$이다. $m\\ge2$일 때 자연수 $a_m$이 될 수 있는 값은\n$12,10,8,6,4,2$뿐이다.\n이제 $b_k=br^{k-1}$이고 $k\\ge2$이므로 $p=k-1\\ge1$이라 두면 조건은\n$b r^p\\in T,\\quad T=\\{2,4,6,8,10,12\\}$이다. 가능한 자연수 $b$의 개수를 $r$마다 센다.\n$r=1$: $b\\in T$이므로 6쌍이다.\n$r=2$: $p=1$만으로 $b=1,2,3,4,5,6$이 모두 가능하며, 더 큰 $p$는 이미 이 범위에 포함된 값만 주므로 6쌍이다.\n$r=3$: $p=1$에서 $b=2,4$이고, $p=2$이면 $3^p=9$이나 $9b$는 $T$에 없으며, $p\\ge3$이면 $3^p>12$이므로 2쌍이다.\n$r=4$: $b=1,2,3$으로 3쌍이다.\n$r=5$: $b=2$로 1쌍이다.\n$r=6$: $b=1,2$로 2쌍이다.\n$r=7,9,11$은 $T$의 원소를 나누지 못하므로 0쌍이다.\n$r=8,10,12$는 각각 $b=1$만 가능하여 각각 1쌍이다.\n$r>12$는 $r^p>12$이므로 불가능하다.\n따라서 전체 순서쌍의 개수는\n$6+6+2+3+1+2+0+1+0+1+0+1=23$이다.\n그러므로 정답은 ③이다."
    },
    {
      "id": 26,
      "questionNumber": 26,
      "questionType": "객관식",
      "content": "2 이상의 자연수 $n$에 대하여 $0 \\le x \\le 2\\pi$에서 두 방정식 $\\sin x = \\sin nx$, $\\sin x = \\cos nx$의 서로 다른 실근의 개수를 각각 $a_n, b_n$이라 하자. $\\sum_{k=2}^{m} (a_k - b_k) = 361$을 만족시키는 자연수 $m$의 값은? [4점]",
      "choices": [
        "360",
        "361",
        "362",
        "363",
        "364"
      ],
      "answer": "①",
      "solution": "두 방정식의 해는 단위원에서 사인값이 같은 각의 관계로 구한다. 단위원에서 사인값은 점의 $y$좌표이므로, 같은 사인값을 갖는 두 각은 한 바퀴의 정수배만큼 차이나거나 단위원에서 $y$축 대칭인 위치를 나타낸다. 따라서 $\\sin A=\\sin B$이면\n$A=B+2k\\pi$ 또는 $A=\\pi-B+2k\\pi$ ($k$는 정수)이다.\n먼저 $\\sin x=\\sin nx$에서\n$nx=x+2k\\pi$ 또는 $nx=\\pi-x+2\\ell\\pi$이다.\n첫째 식에서\n$(n-1)x=2k\\pi$\n$x=\\frac{2k\\pi}{n-1}$이다. $0\\le x\\le2\\pi$이므로 $k=0,1,\\ldots,n-1$이고 해는 $n$개이다.\n둘째 식에서\n$(n+1)x=(2\\ell+1)\\pi$\n$x=\\frac{(2\\ell+1)\\pi}{n+1}$이다. $0\\le x\\le2\\pi$이므로 $\\ell=0,1,\\ldots,n$이고 해는 $n+1$개이다.\n두 해의 무리가 겹친다면 $nx=x+2k\\pi=\\pi-x+2\\ell\\pi$이므로\n$2x=(1+2(\\ell-k))\\pi$이다. 따라서 $0\\le x\\le2\\pi$에서 공통해의 후보는 $x=\\frac\\pi2,\\frac{3\\pi}2$뿐이다.\n$x=\\frac\\pi2$가 실제 공통해가 되려면 $\\sin(n\\pi/2)=1$이어야 하고, $x=\\frac{3\\pi}2$가 공통해가 되려면 $\\sin(3n\\pi/2)=-1$이어야 한다. 사인값의 주기가 $2\\pi$이므로 두 조건은 모두 $n$을 4로 나눈 나머지가 1일 때 성립하며, 그때 공통해는 두 개이다. 그 밖에는 공통해가 없다. 따라서 $n$을 4로 나눈 나머지가 1이면 $a_n=2n-1$이고, 그 밖에는 $a_n=2n+1$이다.\n\n이제 $\\sin x=\\cos nx$를 센다. $\\cos nx=\\sin(\\frac\\pi2-nx)$이므로 같은 사인값의 관계를 적용하면\n$x=\\frac\\pi2-nx+2k\\pi$ 또는 $x=\\pi-(\\frac\\pi2-nx)+2\\ell\\pi$이다.\n첫째 식에서\n$(n+1)x=\\frac\\pi2+2k\\pi$\n$x=\\frac{(4k+1)\\pi}{2(n+1)}$이고, 구간 안의 정수는 $k=0,1,\\ldots,n$이므로 해는 $n+1$개이다.\n둘째 식은 $x=\\frac\\pi2+nx+2\\ell\\pi$이므로\n$(n-1)x=-\\frac\\pi2-2\\ell\\pi$이다. $x\\ge0$이 되도록 $j=-\\ell-1$이라 두면\n$x=\\frac{(4j+3)\\pi}{2(n-1)}$이다. $0\\le x\\le2\\pi$에서 $j=0,1,\\ldots,n-2$이므로 해는 $n-1$개이다.\n두 무리가 겹친다면 위 두 식을 더하여\n$2x=\\pi+2(k+\\ell)\\pi$를 얻는다. 따라서 구간 안의 공통해 후보는 $\\frac\\pi2,\\frac{3\\pi}2$뿐이다.\n$x=\\frac\\pi2$는 $\\cos(n\\pi/2)=1$일 때, 즉 $n$을 4로 나눈 나머지가 0일 때 공통해이다. $x=\\frac{3\\pi}2$는 $\\cos(3n\\pi/2)=-1$일 때, 즉 나머지가 2일 때 공통해이다. 따라서 $n$이 짝수이면 공통해가 정확히 하나, 홀수이면 공통해가 없다. 그러므로 $n$이 짝수이면 $b_n=2n-1$, 홀수이면 $b_n=2n$이다.\n\n두 결과를 비교하면 $k$를 4로 나눈 나머지가 0, 1, 2, 3일 때 $a_k-b_k$는 각각 $2,-1,2,1$이다. 따라서 $k=2,3,4,5$에서 증가량은 $2,1,2,-1$이고, 이 네 수의 합은 4이다. 같은 네 수가 이후에도 반복된다.\n$m$을 4로 나눈 나머지에 따라 부분합을 쓰면\n$\\displaystyle\\sum_{k=2}^{m}(a_k-b_k)=\\begin{cases}4q+1&(m=4q),\\\\4q&(m=4q+1),\\\\4q+2&(m=4q+2),\\\\4q+3&(m=4q+3)\\end{cases}$이다.\n합이 361이 되려면 첫째 경우에서 $4q+1=361$이어야 하므로 $q=90$이다. 나머지 세 경우는 각각 $4q$, $4q+2$, $4q+3$ 꼴이므로 361이 될 수 없다.\n따라서 $m=4q=360$이고 정답은 ①이다.",
      "solutionImage": "assets/images/21_강남여고_1학기_기말_고2_수학I/q26-solution.svg",
      "solutionImageAlt": "단위원 위에서 사인값은 점의 y좌표이다. 예를 들어 θ=π/6인 점 P와 y축에 대칭인 점 Q(각 π-θ)는 y좌표가 같으므로 sin A=sin B이면 B=A+2kπ 또는 B=π-A+2kπ이다.",
      "solutionImageCaption": "단위원 위에서 사인값은 점의 y좌표이다. 예를 들어 θ=π/6인 점 P와 y축에 대칭인 점 Q(각 π-θ)는 y좌표가 같으므로 sin A=sin B이면 B=A+2kπ 또는 B=π-A+2kπ이다.",
      "solutionImageSize": "full"
    },
    {
      "id": 27,
      "questionNumber": 27,
      "questionType": "서술형",
      "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라고 하자. $S_n=3n^2+n-1$일 때, 다음을 각각 구하시오. [총 5점]<br>(1) 일반항 $a_n$을 구하시오. [3점]<br>(2) $a_1+a_4+a_6$의 값을 구하시오. [2점]",
      "choices": [],
      "answer": "(1) $a_1=3$, $a_n=6n-2$ $(n\\ge2)$; (2) 59",
      "solution": "(1) $a_1$은 첫째항부터 제1항까지의 합이므로\n$a_1=S_1=3\\cdot1^2+1-1=3$이다.\n$n\\ge2$이면 $a_n=S_n-S_{n-1}$이다.\n$S_{n-1}=3(n-1)^2+(n-1)-1$\n$=3n^2-5n+1$이므로\n$a_n=(3n^2+n-1)-(3n^2-5n+1)$\n$=6n-2$이다.\n(2) $a_4=6\\cdot4-2=22$, $a_6=6\\cdot6-2=34$이므로\n$a_1+a_4+a_6=3+22+34=59$이다."
    },
    {
      "id": 28,
      "questionNumber": 28,
      "questionType": "서술형",
      "content": "그림과 같이 중심이 $\\mathrm{O}$인 원 위에 삼각형 $\\mathrm{ABC}$의 세 꼭짓점이 놓여 있고, 점 $\\mathrm{O}$와 변 $\\mathrm{AB}$ 사이의 거리와 점 $\\mathrm{O}$와 변 $\\mathrm{AC}$ 사이의 거리의 비는 $1:2$이다. $\\overline{\\mathrm{AB}}=8\\sqrt{2}$, $\\sin C = \\frac{2\\sqrt{2}}{3}$일 때 다음을 각각 구하시오. (단, 점 $\\mathrm{O}$는 삼각형 $\\mathrm{ABC}$의 내부에 존재한다.) [총 5점]<br>(1) 삼각형 $\\mathrm{ABC}$의 외접원의 반지름을 구하시오. [2점]<br>(2) $\\sin B$의 값을 구하시오. [3점]<br><br><img src=\"assets/images/21_강남여고_1학기_기말_고2_수학I/q28.png\" class=\"exam-img\">",
      "choices": [],
      "answer": "(1) $R=6$; (2) $\\sin B=\\frac{\\sqrt5}{3}$",
      "solution": "(1) 현 $AB$는 원주각 $C$가 보는 현이므로 사인 법칙에 따라\n$AB=2R\\sin C$이다.\n$8\\sqrt2=2R\\cdot\\frac{2\\sqrt2}{3}$\n$8\\sqrt2=\\frac{4\\sqrt2}{3}R$\n$R=6$이다.\n\n(2) 점 $O$가 삼각형 내부에 있으므로 삼각형은 예각삼각형이고 $\\cos B,\\cos C>0$이다. 중심에서 현까지 내린 수선은 현을 이등분한다. 직각삼각형에서 반지름 $R$을 빗변으로 보면\n$ d(O,AB)=R\\cos C,\\quad d(O,AC)=R\\cos B$이다.\n두 거리의 비가 $1:2$이므로\n$\\cos C:\\cos B=1:2$\n$\\cos B=2\\cos C$이다.\n$C$가 예각이고 $\\sin C=\\frac{2\\sqrt2}{3}$이므로\n$\\cos C=\\sqrt{1-\\frac89}=\\frac13$이다.\n따라서\n$\\cos B=\\frac23$\n$\\sin B=\\sqrt{1-\\frac49}=\\frac{\\sqrt5}{3}$이다.",
      "images": [
        "assets/images/21_강남여고_1학기_기말_고2_수학I/q28.png"
      ]
    },
    {
      "id": 29,
      "questionNumber": 29,
      "questionType": "서술형",
      "content": "이차방정식 $x^2-10x+24=0$의 두 근을 $m, n$이라고 할 때, $\\sum_{k=1}^{n}\\left\\{\\sum_{i=1}^{m}(k+i)\\right\\}$의 값을 구하시오. [5점]",
      "choices": [],
      "answer": "144",
      "solution": "이차방정식을 인수분해하면\n$x^2-10x+24=(x-4)(x-6)=0$이므로 두 근은 4와 6이다. 식은 $m,n$에 대해 대칭이어서 $m=4,n=6$으로 놓아 계산할 수 있다.\n먼저 안쪽 합을 구한다.\n$\\displaystyle\\sum_{i=1}^{4}(k+i)=4k+(1+2+3+4)$\n$=4k+10$이다.\n그러므로\n$\\displaystyle\\sum_{k=1}^{6}(4k+10)$\n$=4(1+2+3+4+5+6)+10\\cdot6$\n$=4\\cdot21+60$\n$=144$이다.\n근을 반대로 정해도 같은 식의 값이므로 답은 144이다."
    },
    {
      "id": 30,
      "questionNumber": 30,
      "questionType": "서술형",
      "content": "모든 자연수 $n$에 대하여 등식 $$1^3+2^3+3^3+\\cdots+n^3=\\left\\{\\frac{n(n+1)}{2}\\right\\}^2$$이 성립함을 수학적 귀납법을 이용하여 증명하시오. [5점]",
      "choices": [],
      "answer": "수학적 귀납법으로 성립함",
      "solution": "명제 $P(n):1^3+2^3+\\cdots+n^3=\\left\\{\\frac{n(n+1)}2\\right\\}^2$가 모든 자연수 $n$에 대해 성립함을 귀납법으로 보인다.\n\n먼저 $n=1$일 때\n$1^3=1=\\left(\\frac{1\\cdot2}{2}\\right)^2$이므로 $P(1)$은 참이다.\n\n이제 어떤 자연수 $n$에서 $P(n)$이 참이라고 가정한다. 즉\n$1^3+2^3+\\cdots+n^3=\\left\\{\\frac{n(n+1)}2\\right\\}^2$이다.\n양변에 $(n+1)^3$을 더하면\n$1^3+2^3+\\cdots+n^3+(n+1)^3$\n$=\\left\\{\\frac{n(n+1)}2\\right\\}^2+(n+1)^3$\n$=(n+1)^2\\left(\\frac{n^2}{4}+n+1\\right)$\n$=(n+1)^2\\frac{n^2+4n+4}{4}$\n$=(n+1)^2\\frac{(n+2)^2}{4}$\n$=\\left\\{\\frac{(n+1)(n+2)}2\\right\\}^2$이다.\n이는 $P(n+1)$이 참임을 뜻한다.\n\n따라서 수학적 귀납법에 의해 주어진 등식은 모든 자연수 $n$에 대하여 성립한다."
    }
  ]
};
window.examTitle = examData.exam.title;
window.questionBank = window.examData.questions;
