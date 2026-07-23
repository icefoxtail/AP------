window.examTitle = "25_제일고_2학기_중간_고2_수학II";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "샌드위치 정리",
    "originalCategory": "샌드위치 정리",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "샌드위치 정리"
    ],
    "wide": false,
    "content": "양의 실수 전체의 집합에서 정의된 함수 $f(x)$가 $2x^2-x\\lt f(x)\\lt2x^2+3x+4$를 만족시킬 때, $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{f(x)}{3x^2}$의 값은? [4점]",
    "choices": [
      "$\\dfrac13$",
      "$\\dfrac12$",
      "$\\dfrac23$",
      "$\\dfrac32$",
      "$2$"
    ],
    "answer": "③",
    "solution": "[키포인트] 부등식의 세 항을 같은 양수로 나눈 뒤 샌드위치 정리를 적용한다.\n\n$x$는 양의 실수이므로 $3x^2\\gt0$이다. 주어진 부등식의 각 변을 $3x^2$으로 나누면\n$\\dfrac{2x^2-x}{3x^2}\\lt\\dfrac{f(x)}{3x^2}\\lt\\dfrac{2x^2+3x+4}{3x^2}$이다.\n\n양쪽 함수의 극한은 각각\n$\\displaystyle\\lim_{x\\to\\infty}\\left(\\dfrac23-\\dfrac{1}{3x}\\right)=\\dfrac23$,\n$\\displaystyle\\lim_{x\\to\\infty}\\left(\\dfrac23+\\dfrac1x+\\dfrac{4}{3x^2}\\right)=\\dfrac23$이다.\n\n따라서 샌드위치 정리에 의해\n$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{f(x)}{3x^2}=\\dfrac23$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "극한의 연산",
    "originalCategory": "극한의 연산",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "극한의 연산"
    ],
    "wide": false,
    "content": "두 함수 $f(x)$, $g(x)$에 대하여 $\\displaystyle\\lim_{x\\to1}f(x)=2$, $\\displaystyle\\lim_{x\\to1}\\{f(x)-2g(x)\\}=4$일 때, $\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)+g(x)}{2f(x)}$의 값은? [4점]",
    "choices": [
      "$\\dfrac14$",
      "$\\dfrac12$",
      "$\\dfrac34$",
      "$1$",
      "$\\dfrac54$"
    ],
    "answer": "①",
    "solution": "[키포인트] 먼저 $g(x)$의 극한값을 구한 뒤 극한의 연산법칙을 적용한다.\n\n$\\displaystyle\\lim_{x\\to1}g(x)=L$이라 하면\n$2-2L=4$이므로 $L=-1$이다.\n\n따라서\n$\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)+g(x)}{2f(x)}\n=\\dfrac{2+(-1)}{2\\cdot2}\n=\\dfrac14$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "구간별 함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\begin{cases}x^2+ax+1&(x\\gt-1)\\\\x+5&(x\\le-1)\\end{cases}$가 모든 실수 $x$에서 연속이 되도록 하는 상수 $a$의 값은? [4점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 식이 바뀌는 점 $x=-1$에서 함수값과 우극한을 같게 한다.\n\n$f(-1)=-1+5=4$이다.\n한편\n$\\displaystyle\\lim_{x\\to-1+}f(x)=(-1)^2+a(-1)+1=2-a$이다.\n\n연속이므로 $2-a=4$이고, 따라서 $a=-2$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "평균변화율",
    "originalCategory": "평균변화율",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분계수",
      "평균변화율"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^2+3x$에서 $x$의 값이 $1$부터 $4$까지 변할 때의 평균변화율은? [3.8점]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "③",
    "solution": "[키포인트] 평균변화율은 함수값의 변화량을 $x$의 변화량으로 나눈 값이다.\n\n$f(1)=1+3=4$, $f(4)=16+12=28$이다.\n\n따라서 평균변화율은\n$\\dfrac{f(4)-f(1)}{4-1}\n=\\dfrac{28-4}{3}\n=8$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "하",
    "category": "법선의 방정식",
    "originalCategory": "법선의 방정식",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-05",
    "standardUnit": "접선의 방정식",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "접선의 방정식",
      "법선"
    ],
    "wide": false,
    "content": "곡선 $y=2x^2-2x+2$ 위의 점 $(1,2)$를 지나고 이 점에서의 접선에 수직인 직선의 방정식은? [3.8점]",
    "choices": [
      "$y=2x$",
      "$y=2x+\\dfrac52$",
      "$y=-\\dfrac12x+\\dfrac12$",
      "$y=-\\dfrac12x$",
      "$y=-\\dfrac12x+\\dfrac52$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 접선의 기울기를 구하고 수직인 직선의 기울기를 음의 역수로 정한다.\n\n$y'=4x-2$이므로 $x=1$에서 접선의 기울기는 $2$이다.\n따라서 수직인 직선의 기울기는 $-\\dfrac12$이다.\n\n점 $(1,2)$를 지나므로\n$y-2=-\\dfrac12(x-1)$이다.\n정리하면\n$y=-\\dfrac12x+\\dfrac52$이다.\n\n따라서 정답은 ⑤이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "다항함수와 극한",
    "originalCategory": "다항함수와 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "이차함수",
      "최솟값"
    ],
    "wide": false,
    "content": "이차항의 계수가 $1$인 이차함수 $f(x)$에 대하여 $\\displaystyle\\lim_{x\\to3}\\dfrac{x-3}{f(x)}=\\dfrac12$가 성립할 때, 닫힌구간 $[1,4]$에서 함수 $f(x)$의 최솟값은? [4.2점]",
    "choices": [
      "$-\\dfrac32$",
      "$-1$",
      "$-\\dfrac12$",
      "$\\dfrac12$",
      "$1$"
    ],
    "answer": "②",
    "solution": "[키포인트] 극한값이 유한한 0이 아닌 값이므로 $f(3)=0$이고 $f'(3)$을 구할 수 있다.\n\n$f(3)=0$이고\n$\\displaystyle\\lim_{x\\to3}\\dfrac{x-3}{f(x)}\n=\\dfrac{1}{f'(3)}\n=\\dfrac12$이므로 $f'(3)=2$이다.\n\n$f(x)=x^2+bx+c$라 하면 $f'(x)=2x+b$이다.\n$f'(3)=2$에서 $6+b=2$이므로 $b=-4$이다.\n또 $f(3)=0$에서 $9-12+c=0$이므로 $c=3$이다.\n\n따라서\n$f(x)=x^2-4x+3=(x-2)^2-1$이다.\n닫힌구간 $[1,4]$에서 꼭짓점 $x=2$가 포함되므로 최솟값은 $-1$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "무리식의 극한",
    "originalCategory": "무리식의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "유리화"
    ],
    "wide": false,
    "content": "$\\displaystyle\\lim_{x\\to0}\\dfrac{1-x^3-\\sqrt{1-x^2}}{x^2}$의 값은? [4.7점]",
    "choices": [
      "$-1$",
      "$-\\dfrac12$",
      "$0$",
      "$\\dfrac12$",
      "$1$"
    ],
    "answer": "④",
    "solution": "[키포인트] 식을 두 부분으로 나누고 무리식은 유리화한다.\n\n주어진 식을\n$\\dfrac{1-\\sqrt{1-x^2}}{x^2}-x$로 나타낸다.\n\n첫째 항을 유리화하면\n$\\dfrac{1-\\sqrt{1-x^2}}{x^2}\n=\\dfrac{1}{1+\\sqrt{1-x^2}}$이다.\n\n따라서\n$\\displaystyle\\lim_{x\\to0}\\left(\n\\dfrac{1}{1+\\sqrt{1-x^2}}-x\n\\right)\n=\\dfrac12$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "계단함수의 극한",
    "originalCategory": "계단함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "좌극한",
      "우극한",
      "활용"
    ],
    "wide": false,
    "content": "어느 도시의 지하철 요금은 이용 거리에 따라 다르다고 한다. 이용 거리가 $10$km 이하이면 $1{,}000$원이고, $10$km 초과 $30$km 이하이면 $5$km마다 $100$원씩 요금이 추가되고, $30$km 초과이면 $8$km마다 $100$원씩 요금이 추가된다. 이용 거리가 $x$km일 때의 요금을 $f(x)$원이라 할 때, $\\displaystyle\\lim_{x\\to20-}f(x)+\\lim_{x\\to54+}f(x)$의 값은? [4.2점]",
    "choices": [
      "$1000$",
      "$2000$",
      "$3000$",
      "$4000$",
      "$5000$"
    ],
    "answer": "③",
    "solution": "[키포인트] 경계값의 어느 쪽에서 접근하는지에 따라 해당 요금 구간을 확인한다.\n\n$10$km를 초과한 뒤 $5$km마다 $100$원씩 추가되므로\n$15$km 초과 $20$km 이하의 요금은 $1200$원이다.\n따라서\n$\\displaystyle\\lim_{x\\to20-}f(x)=1200$이다.\n\n$30$km까지의 요금은 $1400$원이다.\n그 뒤에는 $8$km마다 $100$원씩 추가되므로\n$30\\lt x\\le38$에서 첫 번째,\n$38\\lt x\\le46$에서 두 번째,\n$46\\lt x\\le54$에서 세 번째,\n$54\\lt x\\le62$에서 네 번째 추가 요금이 적용된다.\n따라서\n$\\displaystyle\\lim_{x\\to54+}f(x)=1800$이다.\n\n그러므로 구하는 값은\n$1200+1800=3000$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "그래프",
      "보기"
    ],
    "wide": false,
    "content": "두 함수 $f(x)$, $g(x)$의 그래프가 다음 그림과 같을 때, 옳은 것을 보기에서 모두 고른 것은? [4.5점]<br><img src=\"assets/images/25_제일고_2학기_중간_고2_수학II/q9.png\" style=\"display:block;max-width:100%;height:auto;margin:8px auto;\"><div class=\"note-box\">ㄱ. 함수 $f(x)+g(x)$는 $x=-1$에서 연속이다.<br>ㄴ. 함수 $f(x)g(x)$는 $x=1$에서 연속이다.<br>ㄷ. $\\displaystyle\\lim_{x\\to0}f(x-1)g(x)=1$</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "[키포인트] 불연속점에서는 함수값과 좌극한, 우극한을 각각 확인한다.\n\nㄱ. $x\\to-1-$일 때 $f(x)\\to1$, $g(x)\\to-1$이므로 합은 $0$이다.\n$x\\to-1+$일 때 $f(x)\\to-1$, $g(x)\\to-1$이므로 합은 $-2$이다.\n좌극한과 우극한이 다르므로 거짓이다.\n\nㄴ. $x\\to1-$일 때 $f(x)\\to1$, $g(x)\\to-1$이므로 곱은 $-1$이다.\n$x\\to1+$일 때 $f(x)\\to-1$, $g(x)\\to1$이므로 곱은 $-1$이다.\n또 $f(1)g(1)=(-1)\\cdot1=-1$이므로 참이다.\n\nㄷ. $x\\to0-$일 때 $f(x-1)\\to1$, $g(x)\\to1$이므로 곱은 $1$이다.\n$x\\to0+$일 때 $f(x-1)\\to-1$, $g(x)\\to1$이므로 곱은 $-1$이다.\n좌극한과 우극한이 다르므로 거짓이다.\n\n따라서 옳은 것은 ㄴ뿐이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "중간값 정리",
    "originalCategory": "중간값 정리",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "중간값 정리",
      "홀함수"
    ],
    "wide": false,
    "content": "연속함수 $f(x)$에 대하여 $f(-x)=-f(x)$, $f(1)f(2)\\lt0$, $f(3)f(4)\\lt0$이 성립할 때, 방정식 $f(x)=0$의 실근은 적어도 몇 개인가? [4.7점]",
    "choices": [
      "$1$개",
      "$2$개",
      "$3$개",
      "$4$개",
      "$5$개"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 중간값 정리와 홀함수의 대칭성을 함께 이용한다.\n\n$f(1)f(2)\\lt0$이므로 중간값 정리에 의해 열린구간 $(1,2)$에 적어도 하나의 근이 있다.\n또 $f(3)f(4)\\lt0$이므로 열린구간 $(3,4)$에도 적어도 하나의 근이 있다.\n\n$f(-x)=-f(x)$이므로 양의 근에 대응하는 음의 근도 각각 존재한다.\n또 $f(0)=-f(0)$이므로 $f(0)=0$이다.\n\n따라서 양의 근 두 개, 음의 근 두 개, $0$을 합하여 실근은 적어도 $5$개이다.\n\n따라서 정답은 ⑤이다."
  },
  {
    "id": 11,
    "level": "상",
    "category": "다항함수와 극한",
    "originalCategory": "다항함수와 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "다항함수",
      "중근"
    ],
    "wide": false,
    "content": "다항함수 $f(x)$가 다음 조건을 만족시킨다.<div class=\"note-box\">(가) $\\displaystyle\\lim_{x\\to1}f(x)=0$<br>(나) $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{f(x)-x^3}{2x^2}=3$</div>$\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)}{(x-1)^2}$의 극한값이 존재할 때, 그 값은? [4.5점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "④",
    "solution": "[키포인트] 무한대에서의 조건으로 최고차항과 이차항의 계수를 정하고, 유한한 극한 조건으로 중근을 이용한다.\n\n조건 (나)에서 $f(x)$는 최고차항의 계수가 $1$인 삼차함수이고 이차항의 계수는 $6$이다.\n\n조건 (가)에서 $f(1)=0$이다.\n또 $\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)}{(x-1)^2}$가 유한하게 존재하므로 $x=1$은 $f(x)$의 적어도 이중근이다.\n\n따라서 $f(x)=(x-1)^2(x+a)$로 둘 수 있다.\n전개하면\n$f(x)=x^3+(a-2)x^2+(1-2a)x+a$이다.\n이차항의 계수가 $6$이므로 $a-2=6$에서 $a=8$이다.\n\n따라서\n$\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)}{(x-1)^2}\n=\\lim_{x\\to1}(x+8)=9$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 12,
    "level": "상",
    "category": "미분계수",
    "originalCategory": "미분계수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분계수",
      "홀함수",
      "극한"
    ],
    "wide": false,
    "content": "모든 실수 $x$에 대하여 $f(-x)=-f(x)$인 다항함수 $f(x)$가 $f(-1)=2$, $\\displaystyle\\lim_{x\\to-1}\\dfrac{f(1)-f(-x)}{x^2-1}=3$을 만족할 때, $\\displaystyle\\lim_{x\\to-1}\\dfrac{\\{f(x)\\}^2-4}{x+1}$의 값은? [4.5점]",
    "choices": [
      "$-24$",
      "$-12$",
      "$0$",
      "$12$",
      "$24$"
    ],
    "answer": "①",
    "solution": "[키포인트] 첫 번째 극한에서 $f'(1)$을 구하고, 홀다항함수의 도함수는 짝함수임을 이용한다.\n\n$f$는 홀함수이고 $f(-1)=2$이므로\n$f(1)=-2$이다.\n\n$t=-x$로 놓으면 $x\\to-1$일 때 $t\\to1$이고,\n$x^2-1=t^2-1=(t-1)(t+1)$이다.\n따라서\n$\\displaystyle\n\\lim_{x\\to-1}\\dfrac{f(1)-f(-x)}{x^2-1}\n=\n\\lim_{t\\to1}\\dfrac{f(1)-f(t)}{(t-1)(t+1)}\n=\n-\\dfrac{f'(1)}{2}\n=3$이다.\n그러므로 $f'(1)=-6$이다.\n\n홀다항함수는 홀수차항만으로 이루어져 있다.\n이를 항별로 미분하면 도함수는 짝수차항만으로 이루어진 짝함수가 되므로\n$f'(-1)=f'(1)=-6$이다.\n\n구하는 극한은\n$\\displaystyle\n\\lim_{x\\to-1}\n\\dfrac{f(x)-2}{x+1}\\{f(x)+2\\}\n=\nf'(-1)\\cdot4\n=-24$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "미분가능성",
    "originalCategory": "미분가능성",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분계수",
      "미분가능성",
      "구간별 함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\begin{cases}2x-3&(x\\lt a)\\\\x^2-2x+b&(x\\ge a)\\end{cases}$가 실수 전체의 집합에서 미분 가능할 때, $f(a+b)$의 값은? [4.2점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "[키포인트] 식이 바뀌는 점 $x=a$에서 연속이고 좌우 미분계수가 같아야 한다.\n\n왼쪽 식의 미분계수는 $2$이고 오른쪽 식의 미분계수는 $2x-2$이다.\n$x=a$에서 두 값이 같아야 하므로\n$2=2a-2$에서 $a=2$이다.\n\n연속 조건에서\n$2a-3=a^2-2a+b$이다.\n$a=2$를 대입하면 $1=b$이므로 $b=1$이다.\n\n$a+b=3$이고 $3\\ge a$이므로\n$f(3)=3^2-2\\cdot3+1=4$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "접선의 방정식",
    "originalCategory": "접선의 방정식",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-05",
    "standardUnit": "접선의 방정식",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "접선의 방정식",
      "삼차함수",
      "접점"
    ],
    "wide": false,
    "content": "직선 $y=kx$가 곡선 $y=-x^3-2x^2+8$에 접할 때, 상수 $k$의 값은? [4.5점]",
    "choices": [
      "$-4$",
      "$-2$",
      "$1$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "[키포인트] 접점의 좌표와 접선의 기울기를 같은 문자로 나타내어 접점 조건을 세운다.\n\n접점의 $x$좌표를 $t$라 하자.\n곡선의 도함수는\n$y'=-3x^2-4x$이므로 접선의 기울기는\n$k=-3t^2-4t$이다.\n\n접점 $(t,-t^3-2t^2+8)$이 직선 $y=kx$ 위에 있으므로\n$-t^3-2t^2+8=kt$이다.\n$k=-3t^2-4t$를 대입하면\n$t^3+t^2+4=0$이다.\n\n$(t+2)(t^2-t+2)=0$이고 $t^2-t+2$는 실근을 갖지 않으므로 $t=-2$이다.\n따라서\n$k=-3(-2)^2-4(-2)=-4$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "주기함수의 연속",
    "originalCategory": "주기함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "주기함수",
      "구간별 함수"
    ],
    "wide": false,
    "content": "닫힌구간 $[0,5]$에서 $f(x)=\\begin{cases}\\dfrac32x+2&(0\\le x\\le2)\\\\ax^2+6x+b&(2\\lt x\\le5)\\end{cases}$로 정의되고, 모든 실수 $x$에 대하여 $f(x)=f(x+5)$를 만족시키는 함수 $f(x)$가 실수 전체의 집합에서 연속일 때, $f(18)$의 값은? (단, $a$, $b$는 상수) [5점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] $x=2$에서의 연속 조건과 주기함수의 양 끝점 조건을 이용한다.\n\n$x=2$에서\n$f(2)=\\dfrac32\\cdot2+2=5$이다.\n따라서\n$4a+12+b=5$,\n즉 $4a+b=-7$이다.\n\n주기가 $5$이고 연속이므로 $f(0)=f(5)$이다.\n$f(0)=2$이고\n$f(5)=25a+30+b$이므로\n$25a+b=-28$이다.\n\n두 식을 빼면 $21a=-21$이므로 $a=-1$이고,\n$4a+b=-7$에서 $b=-3$이다.\n\n$18=3+3\\cdot5$이므로 $f(18)=f(3)$이다.\n따라서\n$f(18)=-3^2+6\\cdot3-3=6$이다.\n\n따라서 정답은 ⑤이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "교점 개수와 연속",
    "originalCategory": "교점 개수와 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "교점의 개수",
      "매개변수"
    ],
    "wide": false,
    "content": "실수 $t$에 대하여 두 함수 $f(x)=tx$, $g(x)=\\sqrt{4x-1}$의 그래프가 만나는 서로 다른 점의 개수를 $h(t)$라 하자. 함수 $h(t)(t^2+at+b)$가 실수 전체에서 연속일 때, $a+b$의 값은? (단, $a$, $b$는 상수) [5점]",
    "choices": [
      "$-4$",
      "$-2$",
      "$1$",
      "$2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "[키포인트] 제곱근의 정의역을 먼저 확인한 뒤 교점의 개수가 변하는 $t$의 값을 찾는다.\n\n교점은\n$tx=\\sqrt{4x-1}$을 만족한다.\n제곱근이 정의되려면\n$4x-1\\ge0$이므로\n$x\\ge\\dfrac14\\gt0$이다.\n\n따라서 $t\\lt0$이면 $tx\\lt0$이고\n$\\sqrt{4x-1}\\ge0$이므로 교점이 없다.\n\n$t=0$이면\n$\\sqrt{4x-1}=0$에서 $x=\\dfrac14$이므로 교점은 한 개이다.\n\n$t\\gt0$일 때는 양변이 모두 $0$ 이상이므로 제곱하여\n$t^2x^2-4x+1=0$을 얻는다.\n이 이차방정식의 판별식은\n$16-4t^2$이다.\n\n따라서\n$0\\lt t\\lt2$이면 교점이 두 개,\n$t=2$이면 한 개,\n$t\\gt2$이면 교점이 없다.\n\n즉 $h(t)$는 $t=0$, $t=2$에서 값이 변한다.\n함수 $h(t)(t^2+at+b)$가 실수 전체에서 연속이려면\n$t^2+at+b$가 $t=0$, $t=2$에서 모두 $0$이어야 한다.\n\n따라서\n$t^2+at+b=t(t-2)=t^2-2t$이므로\n$a=-2$, $b=0$이다.\n\n그러므로 $a+b=-2$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "연속함수의 선택",
    "originalCategory": "연속함수의 선택",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "미분가능성",
      "구간별 함수",
      "최솟값"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 연속이고 다음 조건을 만족시키는 모든 함수 $f(x)$에 대하여 $f(0)+f(2)+f(4)$의 최솟값을 구하면? [5.2점]<div class=\"note-box\">(가) 모든 실수 $x$에 대하여 $(f(x)-x-1)(f(x)-x^2+3x-4)=0$이다.<br>(나) 미분 불가능한 점은 단 $1$개이다.</div>",
    "choices": [
      "$8$",
      "$10$",
      "$11$",
      "$12$",
      "$15$"
    ],
    "answer": "③",
    "solution": "[키포인트] 함수는 두 식 중 하나를 택하고, 연속적으로 식을 바꿀 수 있는 점은 두 식의 교점뿐이다.\n\n두 식을\n$p(x)=x+1$,\n$q(x)=x^2-3x+4$라 하자.\n\n$p(x)=q(x)$에서\n$x+1=x^2-3x+4$,\n즉\n$(x-1)(x-3)=0$이므로\n두 그래프의 교점의 $x$좌표는 $1$, $3$이다.\n\n연속함수가 $p$, $q$ 사이에서 식을 바꾸려면 두 함수값이 같아야 하므로\n식이 바뀔 수 있는 점은 $x=1$, $x=3$뿐이다.\n\n또\n$p'(x)=1$,\n$q'(x)=2x-3$이다.\n$x=1$에서 두 기울기는 $1$, $-1$이고,\n$x=3$에서 두 기울기는 $1$, $3$이므로\n어느 점에서 식을 바꾸더라도 그 점에서 미분 불가능하다.\n\n미분 불가능한 점이 단 한 개이므로\n$x=1$ 또는 $x=3$ 중 한 점에서만 식을 바꾸어야 한다.\n\n각 점에서\n$p(0)=1$, $p(2)=3$, $p(4)=5$이고,\n$q(0)=4$, $q(2)=2$, $q(4)=8$이다.\n\n가능한 네 경우는 다음과 같다.\n\n(i) $x=1$에서 $p\\to q$로 바꾸면\n$f(0)+f(2)+f(4)=p(0)+q(2)+q(4)=1+2+8=11$이다.\n\n(ii) $x=1$에서 $q\\to p$로 바꾸면\n$f(0)+f(2)+f(4)=q(0)+p(2)+p(4)=4+3+5=12$이다.\n\n(iii) $x=3$에서 $p\\to q$로 바꾸면\n$f(0)+f(2)+f(4)=p(0)+p(2)+q(4)=1+3+8=12$이다.\n\n(iv) $x=3$에서 $q\\to p$로 바꾸면\n$f(0)+f(2)+f(4)=q(0)+q(2)+p(4)=4+2+5=11$이다.\n\n따라서 최솟값은 $11$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "삼차함수의 결정",
    "originalCategory": "삼차함수의 결정",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수",
      "삼차함수",
      "접선",
      "함수의 결정"
    ],
    "wide": false,
    "content": "최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 곡선 $y=f(x)$ 위의 점 $(1,f(1))$에서 접선의 방정식이 $y=x$이다. 두 함수 $g(x)$, $h(x)$를 각각 $g(x)=f(x)-x$, $h(x)=(x-1)(f'(x)-f'(1))$이라 할 때, $3g(2)=h(2)$를 만족한다. $f(2)$의 값은? [5.2점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 접선 조건을 함수 $g(x)=f(x)-x$의 중근 조건으로 바꾼다.\n\n접선이 $y=x$이므로\n$f(1)=1$, $f'(1)=1$이다.\n따라서\n$g(1)=0$, $g'(1)=0$이다.\n\n$g(x)$는 최고차항의 계수가 $1$인 삼차함수이므로\n$g(x)=(x-1)^2(x-a)$로 둘 수 있다.\n\n$g(2)=2-a$이다.\n또 $f'(x)-f'(1)=g'(x)$이므로\n$h(2)=g'(2)$이다.\n$g'(2)=2(2-a)+1=5-2a$이다.\n\n조건 $3g(2)=h(2)$에서\n$3(2-a)=5-2a$이므로 $a=1$이다.\n따라서\n$g(x)=(x-1)^3$이고\n$f(x)=(x-1)^3+x$이다.\n\n그러므로 $f(2)=1+2=3$이다.\n\n따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "level": "중",
    "category": "무리함수의 연속",
    "originalCategory": "무리함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수의 연속",
      "무리함수",
      "판별식"
    ],
    "wide": false,
    "content": "서술형 1<br>두 함수 $f(x)=x+1$, $g(x)=\\sqrt{x^2+kx+6}$에 대하여 함수 $\\dfrac{f(x)}{g(x)}$가 실수 전체에서 연속이 되도록 하는 $k$의 범위를 구하는 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$-2\\sqrt6\\lt k\\lt2\\sqrt6$",
    "solution": "[키포인트] 분모의 제곱근 안의 식이 모든 실수에서 양수가 되도록 한다.\n\n함수\n$\\dfrac{x+1}{\\sqrt{x^2+kx+6}}$가 실수 전체에서 연속이려면\n분모가 모든 실수 $x$에서 정의되고 $0$이 아니어야 한다.\n\n따라서 이차식\n$x^2+kx+6$이 모든 실수 $x$에서 양수이어야 한다.\n최고차항의 계수가 양수이므로 판별식이 음수이어야 한다.\n\n$k^2-24\\lt0$에서\n$-2\\sqrt6\\lt k\\lt2\\sqrt6$이다.\n\n따라서 구하는 범위는\n$-2\\sqrt6\\lt k\\lt2\\sqrt6$이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "원과 극한",
    "originalCategory": "원과 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수의 극한",
      "원",
      "거리",
      "도형"
    ],
    "wide": false,
    "content": "서술형 2<br>아래 그림과 같이 직선 $y=x$에 접하고 중심의 좌표가 $\\left(a,a-\\dfrac1a\\right)$인 원 $C$가 있다. 원점 $O$와 원 $C$ 사이의 거리의 최댓값을 $d$라 할 때, $\\displaystyle\\lim_{a\\to\\infty}\\dfrac{d}{a}$의 값을 구하는 과정을 서술하시오. (단, $a\\gt1$) [5점]",
    "image": "assets/images/25_제일고_2학기_중간_고2_수학II/q20.png",
    "choices": [],
    "answer": "$\\sqrt2$",
    "solution": "[키포인트] 원점에서 원까지의 가장 먼 거리는 원점과 중심 사이의 거리와 반지름의 합이다.\n\n원의 중심을\n$C\\left(a,a-\\dfrac1a\\right)$라 하자.\n\n원은 직선 $y=x$에 접하므로 반지름 $r$은 중심과 직선 $x-y=0$ 사이의 거리이다.\n따라서\n$r=\\dfrac{\\left|a-\\left(a-\\dfrac1a\\right)\\right|}{\\sqrt2}\n=\\dfrac{1}{a\\sqrt2}$이다.\n\n또\n$OC=\\sqrt{a^2+\\left(a-\\dfrac1a\\right)^2}$이다.\n원점과 원 사이 거리의 최댓값은\n$d=OC+r$이므로\n$\\dfrac da\n=\\sqrt{1+\\left(1-\\dfrac1{a^2}\\right)^2}\n+\\dfrac{1}{a^2\\sqrt2}$이다.\n\n따라서\n$\\displaystyle\\lim_{a\\to\\infty}\\dfrac da\n=\\sqrt{1+1}\n=\\sqrt2$이다.\n\n따라서 구하는 값은 $\\sqrt2$이다."
  },
  {
    "id": 21,
    "level": "상",
    "category": "다항함수와 도함수",
    "originalCategory": "다항함수와 도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도함수",
      "다항함수",
      "계수비교"
    ],
    "wide": false,
    "content": "서술형 3<br>다항함수 $f(x)$가 실수 $x$에 대하여 $f(x)=2xf'(x)-3x^2-x+1$을 만족시킬 때, $f(1)$의 값을 구하는 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$3$",
    "solution": "[키포인트] 최고차항을 비교하여 함수의 차수를 제한한 뒤 계수를 비교한다.\n\n$f(x)$의 차수가 $n$이고 최고차항이 $cx^n$이라 하자.\n$n\\ge3$이면 오른쪽의 $2xf'(x)$의 최고차항은 $2ncx^n$이므로\n$c=2nc$가 되어 모순이다.\n따라서 $f(x)$의 차수는 $2$ 이하이다.\n\n$f(x)=ax^2+bx+c$라 두면\n$f'(x)=2ax+b$이다.\n\n주어진 식의 오른쪽은\n$2x(2ax+b)-3x^2-x+1\n=(4a-3)x^2+(2b-1)x+1$이다.\n\n계수를 비교하면\n$a=4a-3$, $b=2b-1$, $c=1$이다.\n따라서 $a=1$, $b=1$, $c=1$이다.\n\n그러므로\n$f(x)=x^2+x+1$이고\n$f(1)=3$이다.\n\n따라서 구하는 값은 $3$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "접선 기울기의 최솟값",
    "originalCategory": "접선 기울기의 최솟값",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도함수의 활용",
      "접선",
      "최솟값"
    ],
    "wide": false,
    "content": "서술형 4<br>곡선 $y=x^3-3x^2+2$의 접선 중에서 기울기가 최소인 접선의 방정식을 구하는 과정을 서술하시오. [4점]",
    "choices": [],
    "answer": "$y=-3x+3$",
    "solution": "[키포인트] 접선의 기울기는 도함숫값이므로 도함수의 최솟값을 구한다.\n\n$f(x)=x^3-3x^2+2$라 하면\n$f'(x)=3x^2-6x\n=3(x-1)^2-3$이다.\n\n따라서 접선의 기울기의 최솟값은 $-3$이고, 이때 접점의 $x$좌표는 $1$이다.\n\n$f(1)=1-3+2=0$이므로 접점은 $(1,0)$이다.\n기울기가 $-3$이고 점 $(1,0)$을 지나는 접선은\n$y=-3(x-1)$이다.\n\n따라서 구하는 접선의 방정식은\n$y=-3x+3$이다."
  }
];
