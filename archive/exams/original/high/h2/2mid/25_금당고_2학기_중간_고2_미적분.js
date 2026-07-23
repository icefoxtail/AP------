window.examTitle = "25_금당고_2학기_중간_고2_미적분";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "수열의 극한",
    "originalCategory": "수열의 극한",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의극한",
      "극한"
    ],
    "wide": false,
    "content": "다음 중 극한값이 옳은 것은? [3.8점]",
    "choices": [
      "$\\lim_{n\\to\\infty}\\dfrac{2n^2+3n}{n^2+2}=3$",
      "$\\lim_{n\\to\\infty}\\dfrac{2n+3}{n^2-3n+5}=0$",
      "$\\lim_{n\\to\\infty}(-2n^2+n+1)=-2$",
      "$\\lim_{n\\to\\infty}\\left(3+\\dfrac2{n^2}\\right)\\left(2-\\dfrac4n\\right)=8$",
      "$\\lim_{n\\to\\infty}\\dfrac{3^{n+1}}{3^n-2^n}=\\dfrac13$"
    ],
    "answer": "②",
    "solution": "[키포인트] 각 수열에서 최고차항 또는 지배적인 항을 확인하여 극한값을 비교한다.\n조건 정리: 다섯 보기의 극한을 각각 독립적으로 계산한다.\n풀이 방향: 유리식은 최고차항의 차수와 계수를 비교하고, 다항식과 지수식은 가장 빠르게 커지는 항을 확인한다.\n정석 풀이:\n① $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{2n^2+3n}{n^2+2}=2$이다.\n② 분자의 차수는 $1$, 분모의 차수는 $2$이므로 $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{2n+3}{n^2-3n+5}=0$이다.\n③ $-2n^2$이 지배하므로 극한은 $-\\infty$이다.\n④ 두 인수는 각각 $3$, $2$로 수렴하므로 곱의 극한은 $6$이다.\n⑤ 분자와 분모를 $3^n$으로 나누면 $\\displaystyle\\dfrac3{1-(\\dfrac23)^n}\\to3$이다.\n따라서 옳은 것은 ②뿐이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "급수",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수",
      "부분분수"
    ],
    "wide": false,
    "content": "급수 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac1{(n+1)(n+2)}$의 합을 구하면? [3.8점]",
    "choices": [
      "$\\dfrac52$",
      "$2$",
      "$\\dfrac32$",
      "$1$",
      "$\\dfrac12$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 일반항을 두 분수의 차로 분해하여 망원급수로 계산한다.\n조건 정리: $\\dfrac1{(n+1)(n+2)}=\\dfrac1{n+1}-\\dfrac1{n+2}$이다.\n풀이 방향: 제$n$부분합에서 중간 항이 소거되는 구조를 확인한다.\n정석 풀이:\n$S_N=\\displaystyle\\sum_{n=1}^{N}\\left(\\dfrac1{n+1}-\\dfrac1{n+2}\\right)\n=\\dfrac12-\\dfrac1{N+2}$이다.\n따라서\n$\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac1{(n+1)(n+2)}\n=\\lim_{N\\to\\infty}S_N=\\dfrac12$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "급수",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수",
      "등비급수"
    ],
    "wide": false,
    "content": "급수 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{4^n+3^n}{5^n}$의 합을 구하면? [3.8점]",
    "choices": [
      "$\\dfrac52$",
      "$\\dfrac72$",
      "$\\dfrac92$",
      "$\\dfrac{11}2$",
      "$\\dfrac{13}2$"
    ],
    "answer": "④",
    "solution": "[키포인트] 주어진 급수를 공비가 각각 $\\dfrac45$, $\\dfrac35$인 두 등비급수로 나눈다.\n조건 정리: 두 공비의 절댓값이 모두 $1$보다 작으므로 각각 수렴한다.\n풀이 방향: 각 등비급수의 첫째항과 공비를 구하여 합을 더한다.\n정석 풀이:\n$\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{4^n+3^n}{5^n}\n=\\sum_{n=1}^{\\infty}\\left(\\dfrac45\\right)^n\n+\\sum_{n=1}^{\\infty}\\left(\\dfrac35\\right)^n$이다.\n따라서 합은\n$\\dfrac{\\dfrac45}{1-\\dfrac45}+\\dfrac{\\dfrac35}{1-\\dfrac35}\n=4+\\dfrac32=\\dfrac{11}{2}$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "여러 가지 함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의극한",
      "지수로그",
      "삼각함수"
    ],
    "wide": false,
    "content": "다음은 극한값을 조사한 것이다. 극한값이 옳은 것은? [3.8점]",
    "choices": [
      "$\\lim_{x\\to0}(1+4x)^{1/x}=e^{1/4}$",
      "$\\lim_{x\\to\\infty}\\{\\log_3(3x+2)-\\log_3x\\}=3$",
      "$\\lim_{x\\to0}\\dfrac{\\ln(1-x)}x=-1$",
      "$\\lim_{x\\to0}\\dfrac{3x}{e^{2x}-1}=\\dfrac23$",
      "$\\lim_{x\\to\\pi/2}\\dfrac{\\cos^2x}{1-\\sin x}=1$"
    ],
    "answer": "③",
    "solution": "[키포인트] 지수·로그·삼각함수의 기본 극한을 각 보기에 적용한다.\n조건 정리: 보기마다 극한의 형태가 다르므로 하나씩 계산한다.\n풀이 방향: $(1+u)^{1/u}$, $\\dfrac{\\ln(1+u)}u$, $\\dfrac{e^u-1}u$와 삼각함수 항등식을 이용한다.\n정석 풀이:\n① $(1+4x)^{1/x}=\\{(1+4x)^{1/(4x)}\\}^4\\to e^4$이다.\n② $\\log_3(3x+2)-\\log_3x=\\log_3\\left(3+\\dfrac2x\\right)\\to1$이다.\n③ $u=-x$로 놓으면 $\\dfrac{\\ln(1-x)}x=-\\dfrac{\\ln(1+u)}u\\to-1$이다.\n④ $\\dfrac{3x}{e^{2x}-1}=\\dfrac32\\cdot\\dfrac{2x}{e^{2x}-1}\\to\\dfrac32$이다.\n⑤ $\\dfrac{\\cos^2x}{1-\\sin x}=1+\\sin x\\to2$이다.\n따라서 옳은 것은 ③이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "삼각함수",
    "originalCategory": "삼각함수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수",
      "덧셈정리"
    ],
    "wide": false,
    "content": "$\\sin\\alpha=\\dfrac{\\sqrt3}3$, $\\cos\\beta=-\\dfrac13$일 때, $\\cos(\\alpha-\\beta)$의 값을 구하면? (단, $0\\lt\\alpha\\lt\\dfrac\\pi2$, $\\dfrac\\pi2\\lt\\beta\\lt\\pi$) [4.2점]",
    "choices": [
      "$\\dfrac{\\sqrt6}9$",
      "$\\dfrac{\\sqrt6}3$",
      "$\\dfrac{\\sqrt6}2$",
      "$\\sqrt2$",
      "$\\sqrt3$"
    ],
    "answer": "①",
    "solution": "[키포인트] 각의 범위로 사인과 코사인의 부호를 정한 뒤 코사인 차 공식을 사용한다.\n조건 정리: $\\alpha$는 제1사분면, $\\beta$는 제2사분면의 각이다.\n풀이 방향: $\\cos\\alpha$와 $\\sin\\beta$를 구하고 $\\cos(\\alpha-\\beta)$에 대입한다.\n정석 풀이:\n$\\cos\\alpha=\\sqrt{1-\\sin^2\\alpha}\n=\\sqrt{1-\\dfrac13}=\\dfrac{\\sqrt6}{3}$이다.\n또 $\\beta$는 제2사분면의 각이므로 $\\sin\\beta>0$이고,\n$\\sin\\beta=\\sqrt{1-\\cos^2\\beta}\n=\\sqrt{1-\\dfrac19}=\\dfrac{2\\sqrt2}{3}$이다.\n따라서\n$\\cos(\\alpha-\\beta)\n=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta\n=-\\dfrac{\\sqrt6}{9}+\\dfrac{2\\sqrt6}{9}\n=\\dfrac{\\sqrt6}{9}$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "여러 가지 함수의 미분",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분법",
      "지수함수",
      "로그함수",
      "삼각함수"
    ],
    "wide": false,
    "content": "다음은 함수를 미분한 것이다. 미분이 틀린 것은? [4.2점]",
    "choices": [
      "$y=e^{2x}\\Rightarrow y'=2e^{2x}$",
      "$y=xe^x\\Rightarrow y'=(1+x)e^x$",
      "$y=3\\log_2x\\Rightarrow y'=\\dfrac3{x\\ln2}$",
      "$y=\\sin x\\cos x\\Rightarrow y'=\\cos^2x-\\sin^2x$",
      "$y=x\\cot x\\Rightarrow y'=\\cot^2x-x\\csc^2x$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 함수에 알맞은 미분법을 적용하여 보기의 도함수를 확인한다.\n조건 정리: ⑤는 곱 $x\\cot x$의 미분이다.\n풀이 방향: 지수함수, 곱, 로그함수, 삼각함수의 미분 공식을 보기별로 적용한다.\n정석 풀이:\n① $(e^{2x})'=2e^{2x}$이다.\n② $(xe^x)'=e^x+xe^x=(1+x)e^x$이다.\n③ $(3\\log_2x)'=\\dfrac3{x\\ln2}$이다.\n④ $(\\sin x\\cos x)'=\\cos^2x-\\sin^2x$이다.\n⑤ $(x\\cot x)'=\\cot x-x\\csc^2x$이므로 제시된 $\\cot^2x-x\\csc^2x$는 틀렸다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "급수",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수",
      "삼각함수",
      "등비급수"
    ],
    "wide": false,
    "content": "급수 $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\dfrac12\\right)^n\\cos\\dfrac{n\\pi}2$의 합을 구하면? [4.2점]",
    "choices": [
      "$-\\dfrac12$",
      "$-\\dfrac13$",
      "$-\\dfrac14$",
      "$-\\dfrac15$",
      "$-\\dfrac16$"
    ],
    "answer": "④",
    "solution": "[키포인트] $\\cos\\dfrac{n\\pi}{2}$의 주기를 이용하여 영이 아닌 항만 모은다.\n조건 정리: 홀수 $n$에서는 코사인값이 $0$이고, 짝수 $n=2k$에서는 $\\cos k\\pi=(-1)^k$이다.\n풀이 방향: 짝수 번째 항만 남겨 등비급수로 계산한다.\n정석 풀이:\n주어진 급수는\n$-\\dfrac14+\\dfrac1{16}-\\dfrac1{64}+\\cdots$이다.\n첫째항이 $-\\dfrac14$, 공비가 $-\\dfrac14$인 등비급수이므로\n합은\n$\\dfrac{-\\dfrac14}{1-(-\\dfrac14)}\n=\\dfrac{-\\dfrac14}{\\dfrac54}\n=-\\dfrac15$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "지수로그함수의 미분",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분법",
      "지수함수",
      "로그함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=e^{x+1}\\ln x^2$에 대하여 $f'(1)$의 값을 구하면? [4.2점]",
    "choices": [
      "$e$",
      "$2e$",
      "$2e^2$",
      "$2e^3$",
      "$2e^4$"
    ],
    "answer": "③",
    "solution": "[키포인트] 곱의 미분법과 $\\ln x^2$의 미분을 함께 사용한다.\n조건 정리: $x=1$ 부근에서는 $x>0$이므로 $(\\ln x^2)'=\\dfrac2x$이다.\n풀이 방향: $e^{x+1}$과 $\\ln x^2$의 곱을 미분한 뒤 $x=1$을 대입한다.\n정석 풀이:\n$f'(x)=e^{x+1}\\ln x^2+e^{x+1}\\dfrac2x\n=e^{x+1}\\left(\\ln x^2+\\dfrac2x\\right)$이다.\n따라서\n$f'(1)=e^2(0+2)=2e^2$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "삼각함수",
    "originalCategory": "삼각함수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수",
      "직선의각"
    ],
    "wide": false,
    "content": "두 직선 $3x-5y-1=0$, $3x+y=0$가 이루는 예각의 크기를 $\\theta$라 할 때, $4\\sec^2\\theta$의 값은? [4.4점]",
    "choices": [
      "81",
      "82",
      "83",
      "84",
      "85"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 직선의 기울기를 구하고 두 직선이 이루는 각의 탄젠트 공식을 사용한다.\n조건 정리: 첫째 직선의 기울기는 $\\dfrac35$, 둘째 직선의 기울기는 $-3$이다.\n풀이 방향: 예각 $\\theta$에 대하여 $\\tan\\theta$를 구한 뒤 $\\sec^2\\theta=1+\\tan^2\\theta$를 적용한다.\n정석 풀이:\n$\\tan\\theta\n=\\left|\\dfrac{-3-\\dfrac35}{1+\\dfrac35(-3)}\\right|\n=\\left|\\dfrac{-\\dfrac{18}{5}}{-\\dfrac45}\\right|\n=\\dfrac92$이다.\n따라서\n$4\\sec^2\\theta\n=4(1+\\tan^2\\theta)\n=4\\left(1+\\dfrac{81}{4}\\right)=85$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의연속",
      "로그함수",
      "매개변수"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\begin{cases}\\dfrac{\\ln(x^2+2)-\\ln a}{bx^2}&(x\\lt0)\\\\x^2-1&(x\\ge0)\\end{cases}$가 $x=0$에서 연속일 때, 상수 $a,b$에 대하여 $a+b$의 값은? [4.5점]",
    "choices": [
      "$\\dfrac32$",
      "$2$",
      "$\\dfrac52$",
      "$3$",
      "$\\dfrac72$"
    ],
    "answer": "①",
    "solution": "[키포인트] $x=0$에서 왼쪽 극한이 함수값 $-1$과 같도록 $a$, $b$를 결정한다.\n조건 정리: $f(0)=-1$이고, 왼쪽 식의 분모는 $x\\to0$에서 $0$으로 간다.\n풀이 방향: 먼저 분자가 $0$으로 가야 한다는 조건으로 $a$를 구하고, 로그의 기본 극한으로 $b$를 구한다.\n정석 풀이:\n유한한 왼쪽 극한이 존재하려면\n$\\ln2-\\ln a=0$이어야 하므로 $a=2$이다.\n그러면\n$\\dfrac{\\ln(x^2+2)-\\ln2}{bx^2}\n=\\dfrac{\\ln(1+\\dfrac{x^2}{2})}{bx^2}$이다.\n$u=\\dfrac{x^2}{2}$로 놓으면\n왼쪽 극한은\n$\\dfrac1{2b}\\displaystyle\\lim_{u\\to0+}\\dfrac{\\ln(1+u)}u\n=\\dfrac1{2b}$이다.\n연속이므로 $\\dfrac1{2b}=-1$이고, $b=-\\dfrac12$이다.\n따라서 $a+b=2-\\dfrac12=\\dfrac32$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "미분계수",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분계수",
      "삼각함수",
      "함수변형"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{-\\csc x}{1+\\cot x}$에 대하여 $\\displaystyle\\lim_{x\\to\\pi/4}\\dfrac{f(x)-f(\\pi/4)}{x-\\pi/4}$의 값은? [4.6점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "③",
    "solution": "[키포인트] 주어진 극한은 $f'(\\dfrac\\pi4)$이며, 먼저 $f(x)$를 간단한 삼각함수식으로 정리한다.\n조건 정리: $\\csc x=\\dfrac1{\\sin x}$, $\\cot x=\\dfrac{\\cos x}{\\sin x}$이다.\n풀이 방향: 분자와 분모에 $\\sin x$를 곱한 뒤 미분한다.\n정석 풀이:\n$f(x)=\\dfrac{-1/\\sin x}{1+\\cos x/\\sin x}\n=-\\dfrac1{\\sin x+\\cos x}$이다.\n따라서\n$f'(x)=\\dfrac{\\cos x-\\sin x}{(\\sin x+\\cos x)^2}$이다.\n$x=\\dfrac\\pi4$에서는 $\\sin x=\\cos x$이므로\n$f'(\\dfrac\\pi4)=0$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "여러 가지 함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의극한",
      "삼각함수",
      "합"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 $f(n)=\\displaystyle\\lim_{x\\to0}\\dfrac{1-\\cos nx}{x^2}$일 때, $\\displaystyle\\sum_{n=1}^{8}f(n)$의 값은? [4.7점]",
    "choices": [
      "101",
      "102",
      "103",
      "104",
      "105"
    ],
    "answer": "②",
    "solution": "[키포인트] $1-\\cos u$의 기본 극한을 이용하여 $f(n)$을 구한 뒤 제곱합을 계산한다.\n조건 정리: $u=nx$로 놓으면 $x=\\dfrac un$이다.\n풀이 방향: $f(n)$을 $n^2$의 식으로 나타내고 $1^2+\\cdots+8^2$ 공식을 적용한다.\n정석 풀이:\n$f(n)=\\displaystyle\\lim_{x\\to0}\\dfrac{1-\\cos nx}{x^2}\n=n^2\\displaystyle\\lim_{u\\to0}\\dfrac{1-\\cos u}{u^2}\n=\\dfrac{n^2}{2}$이다.\n따라서\n$\\displaystyle\\sum_{n=1}^{8}f(n)\n=\\dfrac12\\sum_{n=1}^{8}n^2\n=\\dfrac12\\cdot\\dfrac{8\\cdot9\\cdot17}{6}\n=102$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "level": "상",
    "category": "접선의 기울기",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "접선",
      "삼각함수",
      "미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{1+\\sec x}{\\tan x}$에 대하여 $y=f(x)$의 그래프 위의 점 $\\left(\\dfrac\\pi3,\\sqrt3\\right)$에서의 접선의 기울기는? [4.8점]",
    "choices": [
      "$-2-\\sqrt2$",
      "$-2$",
      "$-2+\\sqrt2$",
      "$2-\\sqrt2$",
      "$2+\\sqrt2$"
    ],
    "answer": "②",
    "solution": "[키포인트] 삼각함수식을 간단히 정리한 뒤 접선의 기울기인 도함숫값을 구한다.\n조건 정리: 접점의 $x$좌표는 $\\dfrac\\pi3$이므로 $f'(\\dfrac\\pi3)$을 계산한다.\n풀이 방향: $\\sec x$, $\\tan x$를 사인과 코사인으로 바꾸어 미분한다.\n정석 풀이:\n$f(x)=\\dfrac{1+\\sec x}{\\tan x}\n=\\dfrac{1+\\cos x}{\\sin x}$이다.\n이를 미분하면\n$f'(x)\n=\\dfrac{-\\sin^2x-(1+\\cos x)\\cos x}{\\sin^2x}\n=-\\dfrac{1+\\cos x}{\\sin^2x}$이다.\n따라서\n$f'(\\dfrac\\pi3)\n=-\\dfrac{1+\\dfrac12}{(\\dfrac{\\sqrt3}{2})^2}\n=-\\dfrac{\\dfrac32}{\\dfrac34}\n=-2$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "수열과 극한",
    "originalCategory": "수열의 극한",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의극한",
      "점화식",
      "계승"
    ],
    "wide": false,
    "content": "수열 $\\{a_n\\}$이 모든 자연수 $n$에 대하여 $\\displaystyle\\sum_{k=1}^{n}\\dfrac{a_k}{(k-1)!}=\\dfrac3{(n+2)!}$을 만족시킨다. $\\displaystyle\\lim_{n\\to\\infty}(a_1+n^2a_n)$의 값은? [4.9점]",
    "choices": [
      "$-\\dfrac72$",
      "$-3$",
      "$-\\dfrac52$",
      "$-2$",
      "$-\\dfrac32$"
    ],
    "answer": "③",
    "solution": "[키포인트] $n$번째 식과 $(n-1)$번째 식의 차를 이용하여 $a_n$을 구한다.\n조건 정리: $n=1$을 먼저 대입하여 $a_1$을 구하고, $n\\ge2$에서 두 부분합 식을 뺀다.\n풀이 방향: $a_n$의 일반항을 구한 뒤 $n^2a_n$의 극한을 계산한다.\n정석 풀이:\n$n=1$일 때\n$a_1=\\dfrac3{3!}=\\dfrac12$이다.\n$n\\ge2$에서\n$\\dfrac{a_n}{(n-1)!}\n=\\dfrac3{(n+2)!}-\\dfrac3{(n+1)!}\n=-\\dfrac{3(n+1)}{(n+2)!}$이다.\n따라서\n$a_n=-\\dfrac3{n(n+2)}$이다.\n그러므로\n$\\displaystyle\\lim_{n\\to\\infty}(a_1+n^2a_n)\n=\\dfrac12+\\lim_{n\\to\\infty}\\left(-\\dfrac{3n}{n+2}\\right)\n=\\dfrac12-3=-\\dfrac52$이다.\n핵심 확인: $a_1$은 일반항을 구하는 차분 과정과 별도로 $n=1$에서 구해야 한다.\n따라서 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "삼각함수의 미분",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형",
      "회전",
      "넓이",
      "미분"
    ],
    "wide": false,
    "content": "그림과 같이 좌표평면 위의 두 점 $A(1,0)$, $B(2,0)$을 이은 선분을 한 변으로 하는 정사각형 $ABCD$를 꼭짓점 $B$를 중심으로 시계방향으로 $\\theta$만큼 회전시켰다. 점 $C$가 이동한 점을 $C'$이라 하고, 점 $C'$에서 $x$축으로 내린 수선의 발을 $H$라 하자. $0\\le\\theta\\le\\dfrac\\pi2$에서 $\\triangle OHC'$의 넓이를 함수 $f(\\theta)$로 정의할 때, $f'\\left(\\dfrac\\pi3\\right)=-\\dfrac{a+b\\sqrt3}{c}$이다. $a+b+c$의 값은? (단, $a,b,c$는 서로소인 자연수이다.) [5.0점]",
    "image": "assets/images/25_금당고_2학기_중간_고2_미적분/q15.png",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "solution": "[키포인트] 회전한 점 $C'$의 좌표를 구하여 삼각형의 밑변과 높이를 나타낸다.\n조건 정리: $B(2,0)$에서 $C$로 향하는 길이 $1$의 세로 방향 선분을 시계방향으로 $\\theta$만큼 회전한다.\n풀이 방향: $C'$의 좌표에서 $OH$, $C'H$를 구하고 넓이함수를 미분한다.\n정석 풀이:\n회전 후 $\\overrightarrow{BC'}=(\\sin\\theta,\\cos\\theta)$이므로\n$C'=(2+\\sin\\theta,\\cos\\theta)$이다.\n따라서\n$OH=2+\\sin\\theta$, $C'H=\\cos\\theta$이다.\n그러므로\n$f(\\theta)=\\dfrac12(2+\\sin\\theta)\\cos\\theta$이다.\n미분하면\n$f'(\\theta)\n=-\\sin\\theta+\\dfrac12(\\cos^2\\theta-\\sin^2\\theta)\n=-\\sin\\theta+\\dfrac12\\cos2\\theta$이다.\n따라서\n$f'(\\dfrac\\pi3)\n=-\\dfrac{\\sqrt3}{2}-\\dfrac14\n=-\\dfrac{1+2\\sqrt3}{4}$이다.\n즉 $a=1$, $b=2$, $c=4$이고 서로소 조건도 만족한다.\n그러므로 $a+b+c=7$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "급수",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수",
      "순환소수",
      "등비급수"
    ],
    "wide": false,
    "content": "$\\dfrac7{37}$을 소수로 나타낼 때, 소수점 아래 $n$번째 자리의 수를 일반항 $a_n$으로 하는 수열 $\\{a_n\\}$에 대하여 급수 $\\dfrac{a_1}2+\\dfrac{a_2}{2^2}+\\dfrac{a_3}{2^3}+\\cdots$의 합은 $\\dfrac ab$이다. 이때 $a+b$의 값은? (단, $a$와 $b$는 서로소이다.) [5.1점]",
    "choices": [
      "25",
      "36",
      "49",
      "56",
      "64"
    ],
    "answer": "②",
    "solution": "[키포인트] 순환하는 세 자리 숫자를 한 묶음으로 하여 공비가 $\\dfrac18$인 등비급수로 계산한다.\n조건 정리: $\\dfrac7{37}=0.189189\\cdots$이므로 $a_n$은 $1,8,9$가 반복된다.\n풀이 방향: 처음 세 항의 합을 구하고 세 자리마다 분모가 $2^3$배가 되는 구조를 이용한다.\n정석 풀이:\n처음 세 자리에서 생기는 합은\n$\\dfrac12+\\dfrac8{2^2}+\\dfrac9{2^3}\n=\\dfrac{29}{8}$이다.\n이후 세 자리 묶음마다 값은 앞 묶음의 $\\dfrac18$배이다.\n따라서 전체 합은\n$\\dfrac{\\dfrac{29}{8}}{1-\\dfrac18}\n=\\dfrac{29}{7}$이다.\n$a=29$, $b=7$은 서로소이므로\n$a+b=36$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "급수와 그래프",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "급수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[단답형 1] 자연수 $n$에 대하여 두 함수 $y=|\\sin\\pi x|$, $y=\\dfrac{|x|}{n}$의 그래프의 교점의 개수를 $a_n$이라 할 때, 급수 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{36}{a_na_{n+1}}$의 합을 구하여라. [5점]",
    "choices": [],
    "answer": "$3$",
    "solution": "[키포인트] 양의 구간에서 교점 개수를 센 뒤 그래프의 대칭성을 이용한다.\n조건 정리: 두 그래프는 모두 $y$축에 대하여 대칭이고, $x=0$은 한 교점이다.\n풀이 방향: $x\\ge0$에서 각 구간 $(k,k+1)$의 교점 개수를 조사한다.\n정석 풀이:\n$0<x<1$에서는 $|\\sin\\pi x|$가 처음에 직선 $y=\\dfrac xn$보다 위에 있다가 $x=1$에서 아래로 내려가므로 교점이 한 개 있다.\n$k=1,2,\\ldots,n-1$에 대하여 구간 $(k,k+1)$의 양 끝에서는 사인 그래프가 $0$이고 직선은 양수이다. 한편 중점 $k+\\dfrac12$에서는 사인값이 $1$이고\n$\\dfrac{k+\\dfrac12}{n}<1$이므로 각 구간에 교점이 두 개 있다.\n$x\\ge n$에서는 $\\dfrac xn\\ge1$이고 $|\\sin\\pi x|\\le1$이므로 새로운 교점이 없다.\n따라서 양의 교점은 $1+2(n-1)=2n-1$개이다.\n음의 교점도 같은 수이고 원점까지 포함하면\n$a_n=2(2n-1)+1=4n-1$이다.\n그러므로\n$\\dfrac{36}{a_na_{n+1}}\n=\\dfrac{36}{(4n-1)(4n+3)}\n=9\\left(\\dfrac1{4n-1}-\\dfrac1{4n+3}\\right)$이다.\n망원합을 계산하면\n$\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{36}{a_na_{n+1}}\n=9\\cdot\\dfrac13=3$이다.\n핵심 확인: 원점은 대칭되는 두 교점으로 세지 않고 한 번만 센다.\n따라서 구하는 값은 $3$이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "삼각함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "도형",
      "극한",
      "삼각함수"
    ],
    "wide": false,
    "content": "[단답형 2] 그림과 같이 반지름의 길이가 $1$이고 중심각의 크기가 $\\dfrac\\pi2$인 부채꼴 $OAB$가 있다. 호 $AB$ 위의 점 $P$에서 선분 $OA$에 내린 수선의 발을 $H$, 점 $P$에서 호 $AB$에 접하는 직선과 직선 $OA$의 교점을 $Q$라 하자. 점 $Q$를 중심으로 하고 반지름의 길이가 $QA$인 원과 선분 $PQ$의 교점을 $R$라 하자. $\\angle POA=\\theta$일 때, 삼각형 $OHP$의 넓이를 $f(\\theta)$, 부채꼴 $QRA$의 넓이를 $g(\\theta)$라 하자. $\\displaystyle\\lim_{\\theta\\to0+}\\dfrac{2\\sqrt{g(\\theta)}}{\\theta\\times f(\\theta)}$의 값을 구하여라. (단, $0\\lt\\theta\\lt\\dfrac\\pi2$) [5점]",
    "image": "assets/images/25_금당고_2학기_중간_고2_미적분/q18.png",
    "choices": [],
    "answer": "$\\sqrt\\pi$",
    "solution": "[키포인트] 점 $P$의 좌표와 접선의 방정식으로 $QA$를 구하고 두 넓이를 $\\theta$로 나타낸다.\n조건 정리: 반지름이 $1$이므로 $P=(\\cos\\theta,\\sin\\theta)$이고 $H=(\\cos\\theta,0)$이다.\n풀이 방향: 삼각형 넓이 $f(\\theta)$와 부채꼴 넓이 $g(\\theta)$를 구한 뒤 기본 극한을 적용한다.\n정석 풀이:\n삼각형 $OHP$의 넓이는\n$f(\\theta)=\\dfrac12\\sin\\theta\\cos\\theta$이다.\n단위원 위의 점 $P$에서의 접선은\n$x\\cos\\theta+y\\sin\\theta=1$이다.\n이 직선과 $x$축의 교점은 $Q=(\\sec\\theta,0)$이므로\n$QA=\\sec\\theta-1=\\dfrac{1-\\cos\\theta}{\\cos\\theta}$이다.\n또 $\\angle AQR=\\dfrac\\pi2-\\theta$이므로\n$g(\\theta)\n=\\dfrac12\\left(\\dfrac{1-\\cos\\theta}{\\cos\\theta}\\right)^2\n\\left(\\dfrac\\pi2-\\theta\\right)$이다.\n따라서 주어진 식은\n$\\dfrac{4(1-\\cos\\theta)}\n{\\theta\\sin\\theta\\cos^2\\theta}\n\\sqrt{\\dfrac{\\dfrac\\pi2-\\theta}{2}}$이다.\n이를\n$4\\cdot\\dfrac{1-\\cos\\theta}{\\theta^2}\n\\cdot\\dfrac1{(\\dfrac{\\sin\\theta}{\\theta})\\cos^2\\theta}\n\\cdot\\sqrt{\\dfrac{\\dfrac\\pi2-\\theta}{2}}$\n로 나타낼 수 있다.\n$\\theta\\to0+$에서 각 인수의 극한은\n$\\dfrac12$, $1$, $\\dfrac{\\sqrt\\pi}{2}$이므로 전체 극한은\n$4\\cdot\\dfrac12\\cdot1\\cdot\\dfrac{\\sqrt\\pi}{2}\n=\\sqrt\\pi$이다.\n핵심 확인: $Q$가 원의 중심이므로 부채꼴 $QRA$의 반지름은 $QA$이다.\n따라서 구하는 값은 $\\sqrt\\pi$이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "삼각함수의 미분",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "삼각함수",
      "미분",
      "함숫값"
    ],
    "wide": false,
    "content": "[서·논술형 1] 함수 $f(x)=\\dfrac{\\sin x+\\cos x}{\\tan x+\\cot x}$에 대하여 $f\\left(\\dfrac\\pi3\\right)+f'\\left(\\dfrac\\pi3\\right)$의 값을 구하는 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$-\\dfrac14$",
    "solution": "[키포인트] 분모의 삼각함수식을 정리하여 곱의 형태로 바꾼 뒤 미분한다.\n조건 정리: $\\tan x+\\cot x=\\dfrac1{\\sin x\\cos x}$이다.\n풀이 방향: $f(x)=(\\sin x+\\cos x)\\sin x\\cos x$로 바꾸어 함숫값과 도함숫값을 계산한다.\n정석 풀이:\n$f(x)=(\\sin x+\\cos x)\\sin x\\cos x$이다.\n따라서\n$f'(x)\n=(\\cos x-\\sin x)\\sin x\\cos x\n+(\\sin x+\\cos x)(\\cos^2x-\\sin^2x)$이다.\n$x=\\dfrac\\pi3$을 대입하면\n$f(\\dfrac\\pi3)=\\dfrac{3+\\sqrt3}{8}$이고,\n$f'(\\dfrac\\pi3)=-\\dfrac{5+\\sqrt3}{8}$이다.\n그러므로\n$f(\\dfrac\\pi3)+f'(\\dfrac\\pi3)\n=\\dfrac{3+\\sqrt3-5-\\sqrt3}{8}\n=-\\dfrac14$이다.\n따라서 구하는 값은 $-\\dfrac14$이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "급수와 도형",
    "originalCategory": "급수",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "급수",
      "도형",
      "정삼각형",
      "내접원"
    ],
    "wide": false,
    "content": "[서·논술형 2] 다음 그림과 같이 반지름의 길이가 $4$인 원 $C_1$에 내접하는 정삼각형을 그리고 이 정삼각형의 내접원을 $C_2$라 하자. 또, 원 $C_2$에 내접하는 정삼각형을 그리고 이 정삼각형의 내접원을 $C_3$라 하자. 이와 같은 과정을 한 없이 반복할 때, 물음에 답하시오. (1) 원 $C_1,C_2,C_3,\\ldots$의 둘레의 길이의 합을 구하고, 그 과정을 서술하시오. [3점] (2) 원 $C_1$에 내접하는 정삼각형의 내접원이 $C_2$일 때 정삼각형과 원 $C_2$를 제외한 나머지 부분의 넓이를 $S_1$이라 하자. 마찬가지로 원 $C_2$에 내접하는 정삼각형의 내접원이 $C_3$일 때 정삼각형과 원 $C_3$를 제외한 나머지 부분의 넓이를 $S_2$라고 하자. 이와 같은 과정을 한 없이 반복했을 때, $S_1+S_2+S_3+\\cdots$의 값을 구하고, 그 과정을 서술하시오. [4점]",
    "image": "assets/images/25_금당고_2학기_중간_고2_미적분/q20.png",
    "choices": [],
    "answer": "(1) $16\\pi$, (2) $\\dfrac{48\\sqrt3-16\\pi}{3}$",
    "solution": "[키포인트] 정삼각형의 외접반지름과 내접반지름의 비가 $2:1$임을 이용하여 등비급수로 계산한다.\n조건 정리: 원 $C_n$의 반지름을 $r_n$이라 하면 $r_1=4$이고 $r_{n+1}=\\dfrac12r_n$이다.\n풀이 방향: (1)은 원의 둘레를, (2)는 각 단계에서 정삼각형 안에서 내접원을 제외한 넓이를 등비급수로 합한다.\n정석 풀이:\n(1) 반지름은 $4,2,1,\\ldots$이므로 둘레는\n$8\\pi,4\\pi,2\\pi,\\ldots$이다.\n따라서 둘레의 합은\n$\\dfrac{8\\pi}{1-\\dfrac12}=16\\pi$이다.\n\n(2) 외접반지름이 $r$인 정삼각형의 넓이는\n$\\dfrac{3\\sqrt3}{4}r^2$이고, 그 내접원의 반지름은 $\\dfrac r2$이다.\n따라서 첫 단계에서\n$S_1=\\dfrac{3\\sqrt3}{4}\\cdot4^2-\\pi\\cdot2^2\n=12\\sqrt3-4\\pi$이다.\n다음 단계의 모든 길이는 앞 단계의 $\\dfrac12$배이므로 넓이는 $\\dfrac14$배이다.\n따라서\n$S_1+S_2+\\cdots\n=\\dfrac{12\\sqrt3-4\\pi}{1-\\dfrac14}\n=\\dfrac{48\\sqrt3-16\\pi}{3}$이다.\n핵심 확인: 둘레의 공비는 $\\dfrac12$, 넓이의 공비는 그 제곱인 $\\dfrac14$이다.\n따라서 구하는 값은 (1) $16\\pi$, (2) $\\dfrac{48\\sqrt3-16\\pi}{3}$이다."
  },
  {
    "id": 21,
    "level": "상",
    "category": "여러 가지 미분법",
    "originalCategory": "미분법",
    "standardCourse": "미적분",
    "standardUnitKey": "H15-CALC-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "미분",
      "극한",
      "곱의미분"
    ],
    "wide": false,
    "content": "[서·논술형 3] 양의 실수 전체의 집합에서 미분 가능한 두 함수 $f(x)$, $g(x)$가 다음 조건을 모두 만족시킨다.<div class=\"note-box\">(가) $\\displaystyle\\lim_{x\\to1}\\dfrac{\\ln(2x-1)}{f(x)-e}=\\dfrac1e$<br>(나) $f(x)\\ln x+g(x)e^x=(x^2+1)e^x$</div>$\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)g(x)+a}{x-1}=b$를 만족시키는 실수 $a$, $b$에 대하여 $b-a$의 값을 구하는 과정을 서술하시오. [8점]",
    "choices": [],
    "answer": "$7e$",
    "solution": "[키포인트] 첫째 극한으로 $f(1)$과 $f'(1)$을 구하고, 둘째 조건을 미분하여 $g(1)$과 $g'(1)$을 구한다.\n조건 정리: 두 함수는 $x=1$에서 미분 가능하며 마지막 극한이 유한하려면 분자가 $x=1$에서 $0$이어야 한다.\n풀이 방향: 조건 (가), (나)에서 필요한 네 값을 구한 뒤 곱의 미분계수를 사용한다.\n정석 풀이:\n조건 (가)의 분자는 $x\\to1$에서 $0$으로 간다. 극한값이 유한한 영이 아닌 값이므로 $f(1)=e$이다.\n미분계수의 비를 이용하면\n$\\dfrac{2}{f'(1)}=\\dfrac1e$이므로 $f'(1)=2e$이다.\n\n조건 (나)에 $x=1$을 대입하면\n$g(1)e=2e$이므로 $g(1)=2$이다.\n조건 (나)의 양변을 미분하면\n$f'(x)\\ln x+\\dfrac{f(x)}x\n+g'(x)e^x+g(x)e^x\n=2xe^x+(x^2+1)e^x$이다.\n$x=1$을 대입하면\n$e+eg'(1)+2e=4e$이므로 $g'(1)=1$이다.\n\n마지막 극한이 유한하려면\n$f(1)g(1)+a=0$이어야 하므로 $a=-2e$이다.\n또\n$b=(fg)'(1)\n=f'(1)g(1)+f(1)g'(1)\n=2e\\cdot2+e\\cdot1=5e$이다.\n따라서\n$b-a=5e-(-2e)=7e$이다.\n핵심 확인: 마지막 극한의 분자는 먼저 $0$이 되어야 하고, 그 뒤 미분계수로 $b$가 결정된다.\n따라서 구하는 값은 $7e$이다."
  }
];
