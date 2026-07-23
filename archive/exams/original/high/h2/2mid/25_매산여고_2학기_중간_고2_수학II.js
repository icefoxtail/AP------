window.examTitle = "25_매산여고_2학기_중간_고2_수학II";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "인수분해"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to-1}\\dfrac{x^2+4x+3}{x+1}$의 값은? [3.5점]",
    "choices": [
      "5",
      "4",
      "3",
      "2",
      "1"
    ],
    "answer": "④",
    "solution": "[키포인트] 분자를 인수분해하여 약분한 뒤 극한값을 구한다.\n\n$x^2+4x+3=(x+1)(x+3)$이므로 $x\\ne-1$일 때\n$\\dfrac{x^2+4x+3}{x+1}=x+3$이다.\n\n따라서\n$\\displaystyle\\lim_{x\\to-1}\\dfrac{x^2+4x+3}{x+1}\n=\\lim_{x\\to-1}(x+3)=2$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
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
      "그래프"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프가 그림과 같을 때, $\\displaystyle\\lim_{x\\to0-}f(x)+\\displaystyle\\lim_{x\\to1+}f(x)$의 값은? [3.5점]",
    "choices": [
      "2",
      "1",
      "0",
      "$-1$",
      "$-2$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 좌극한과 우극한은 해당 방향에서 그래프가 가까워지는 $y$값을 읽는다.\n\n그래프에서 $x\\to0-$일 때 함수값은 $-1$에 가까워지므로\n$\\displaystyle\\lim_{x\\to0-}f(x)=-1$이다.\n\n또 $x\\to1+$일 때 오른쪽 직선의 함수값은 $-1$에 가까워지므로\n$\\displaystyle\\lim_{x\\to1+}f(x)=-1$이다.\n\n따라서 구하는 값은 $-1+(-1)=-2$이다.\n\n따라서 정답은 ⑤이다.",
    "image": "assets/images/25_매산여고_2학기_중간_고2_수학II/q2.png"
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
      "구간별함수"
    ],
    "wide": false,
    "content": "$f(x)=\\begin{cases}x^2+2x&(x\\le1)\\\\a&(x>1)\\end{cases}$가 $x=1$에서 연속일 때, $a$의 값은? [3.6점]",
    "choices": [
      "3",
      "5",
      "7",
      "9",
      "11"
    ],
    "answer": "①",
    "solution": "[키포인트] 식이 바뀌는 점 $x=1$에서 왼쪽 함수값과 오른쪽 극한값을 같게 한다.\n\n$f(1)=1^2+2\\cdot1=3$이다.\n$x\\to1+$일 때 $f(x)=a$이므로 오른쪽 극한값은 $a$이다.\n\n함수가 $x=1$에서 연속이므로 $a=3$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "곱함수의 연속",
    "originalCategory": "곱함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "곱함수",
      "구간별함수"
    ],
    "wide": false,
    "content": "$f(x)=\\begin{cases}3x-2&(x\\ge1)\\\\-x+7&(x<1)\\end{cases}$, $g(x)=2^x+k$에 대하여 $f(x)g(x)$가 $x=1$에서 연속일 때, $k$의 값은? [3.6점]",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "④",
    "solution": "[키포인트] $f(x)$는 $x=1$에서 불연속이므로 곱함수가 연속이 되려면 $g(1)=0$이어야 한다.\n\n$x\\to1-$일 때 $f(x)\\to-1+7=6$이고,\n$x=1$에서 $f(1)=3-2=1$이다.\n\n한편 $g(1)=2+k$이다.\n곱함수의 왼쪽 극한과 함수값이 같아야 하므로\n$6(2+k)=1(2+k)$이다.\n\n따라서 $5(2+k)=0$이므로 $k=-2$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 5,
    "level": "하",
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
      "도함수"
    ],
    "wide": false,
    "content": "$f(x)=4x^2-5x+2$의 $x=1$에서 미분계수는? [3.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "[키포인트] 다항함수의 도함수를 구한 뒤 $x=1$을 대입한다.\n\n$f(x)=4x^2-5x+2$이므로\n$f'(x)=8x-5$이다.\n\n따라서 $f'(1)=8-5=3$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 6,
    "level": "하",
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
      "극한"
    ],
    "wide": false,
    "content": "$f(x)=x^2-6x+3$에 대하여 $\\lim_{h\\to0}\\dfrac{f(4+h)-f(4)}{2h}$의 값은? [3.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "[키포인트] 주어진 극한을 미분계수의 정의와 비교한다.\n\n$\\displaystyle\\lim_{h\\to0}\\dfrac{f(4+h)-f(4)}{h}=f'(4)$이므로\n주어진 극한은 $\\dfrac12f'(4)$이다.\n\n$f'(x)=2x-6$이므로 $f'(4)=2$이다.\n따라서 구하는 값은 $\\dfrac12\\cdot2=1$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 7,
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
    "content": "$x$가 $1$에서 $2$까지 변할 때 $f$의 평균변화율은 $2$, $2$에서 $5$까지는 $6$이다. $1$에서 $5$까지의 평균변화율은? [3.8점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 구간의 평균변화율에 구간 길이를 곱하여 함수값의 전체 변화량을 구한다.\n\n$x=1$에서 $2$까지 함수값의 변화량은\n$2\\cdot(2-1)=2$이다.\n\n$x=2$에서 $5$까지 함수값의 변화량은\n$6\\cdot(5-2)=18$이다.\n\n따라서 $x=1$에서 $5$까지의 함수값의 변화량은 $20$이고,\n평균변화율은\n$\\dfrac{20}{5-1}=5$이다.\n\n따라서 정답은 ⑤이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "곱의 미분",
    "originalCategory": "곱의 미분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수",
      "곱의미분"
    ],
    "wide": false,
    "content": "$f(x)=(3x+4)g(x)$이고 곡선 $y=g(x)$ 위의 점 $(2,-3)$에서 접선의 기울기가 $2$일 때, $f'(2)$의 값은? [3.8점]",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "④",
    "solution": "[키포인트] 곱의 미분법을 적용하고 점 $(2,-3)$에서의 함숫값과 접선 기울기를 이용한다.\n\n$f(x)=(3x+4)g(x)$이므로\n$f'(x)=3g(x)+(3x+4)g'(x)$이다.\n\n곡선 $y=g(x)$가 점 $(2,-3)$을 지나므로 $g(2)=-3$이고,\n그 점에서 접선의 기울기가 $2$이므로 $g'(2)=2$이다.\n\n따라서\n$f'(2)=3(-3)+10\\cdot2=-9+20=11$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 9,
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
      "구간별함수"
    ],
    "wide": false,
    "content": "$f(x)=\\begin{cases}x^3+ax&(x<1)\\\\bx^2-x-1&(x\\ge1)\\end{cases}$이 $x=1$에서 미분가능할 때, $a+b$의 값은? [3.9점]",
    "choices": [
      "$-2$",
      "$-1$",
      "0",
      "1",
      "2"
    ],
    "answer": "②",
    "solution": "[키포인트] $x=1$에서 연속 조건과 좌우 미분계수 일치 조건을 함께 사용한다.\n\n연속 조건에서\n$1+a=b-2$이다.\n\n왼쪽 식의 도함수는 $3x^2+a$이고,\n오른쪽 식의 도함수는 $2bx-1$이므로 미분가능 조건에서\n$3+a=2b-1$이다.\n\n첫째 식에서 $b=a+3$이다.\n이를 둘째 식에 대입하면\n$3+a=2a+5$이므로 $a=-2$, $b=1$이다.\n\n따라서 $a+b=-1$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "좌우극한",
    "originalCategory": "좌우극한",
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
      "절댓값"
    ],
    "wide": false,
    "content": "$f(x)=\\dfrac{|x^3-1|}{x-1}$에서 $\\lim_{x\\to1+}f(x)=a$, $\\lim_{x\\to1-}f(x)=b$일 때, $a+b$는? [3.9점]",
    "choices": [
      "$-\\sqrt3$",
      "$-3$",
      "0",
      "$\\sqrt3$",
      "3"
    ],
    "answer": "③",
    "solution": "[키포인트] $x=1$의 오른쪽과 왼쪽에서 $x^3-1$의 부호가 다름을 이용한다.\n\n$x\\to1+$일 때 $x^3-1>0$이므로\n$f(x)=\\dfrac{x^3-1}{x-1}=x^2+x+1$이다.\n따라서 $a=3$이다.\n\n$x\\to1-$일 때 $x^3-1<0$이므로\n$f(x)=-\\dfrac{x^3-1}{x-1}=-(x^2+x+1)$이다.\n따라서 $b=-3$이다.\n\n그러므로 $a+b=0$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "극한의 성질",
    "originalCategory": "극한의 성질",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "극한의성질",
      "보기"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)$, $g(x)$에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은? [3.9점]<div class=\"note-box\">ㄱ. $\\displaystyle\\lim_{x\\to\\infty}xf(x)$의 값이 존재하면 $\\displaystyle\\lim_{x\\to\\infty}f(x)$의 값도 존재한다.<br>ㄴ. $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{1}{f(x)}$의 값이 존재하면 $\\displaystyle\\lim_{x\\to\\infty}f(x)$의 값도 존재한다.<br>ㄷ. $\\displaystyle\\lim_{x\\to a}f(x)$, $\\displaystyle\\lim_{x\\to a}g(x)$의 값이 존재하면 $\\displaystyle\\lim_{x\\to a}g(f(x))$의 값도 존재한다.<br>ㄹ. $\\displaystyle\\lim_{x\\to0}f(x)=\\infty$, $\\displaystyle\\lim_{x\\to0}g(x)=0$이면 $\\displaystyle\\lim_{x\\to0}f(x)g(x)=0$이다.</div>",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄹ",
      "ㄹ"
    ],
    "answer": "①",
    "solution": "[키포인트] 극한의 성질이 항상 성립하는지 판단하고, 성립하지 않는 명제는 반례 가능성을 확인한다.\n\nㄱ. $\\displaystyle\\lim_{x\\to\\infty}xf(x)=L$이 존재하면\n$f(x)=\\dfrac{xf(x)}{x}$이므로\n$\\displaystyle\\lim_{x\\to\\infty}f(x)=0$이다. 따라서 참이다.\n\nㄴ. $\\dfrac1{f(x)}\\to0$이어도 $f(x)$가 한 값으로 수렴한다고 할 수 없으므로 거짓이다.\n\nㄷ. $g(f(x))$의 극한이 존재하려면 $g$가 $\\lim f(x)$에서 적절한 극한을 가져야 한다. 주어진 조건만으로는 이를 보장할 수 없으므로 거짓이다.\n\nㄹ. 예를 들어 $f(x)=\\dfrac1{x^2}$, $g(x)=x^2$이면 각각 $\\infty$, $0$으로 가지만 곱은 $1$이다. 따라서 거짓이다.\n\n따라서 옳은 것은 ㄱ뿐이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "미분계수와 극한",
    "originalCategory": "미분계수와 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "미분계수",
      "극한"
    ],
    "wide": false,
    "content": "다항함수 $f$가 $\\lim_{x\\to1}\\dfrac{f(x)}{x-1}=1$, $\\lim_{x\\to3}\\dfrac{f(x-1)}x=2$를 만족시킬 때, $\\lim_{x\\to2}\\dfrac{f(x-1)f(x)}{x-2}$의 값은? [4.0점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "④",
    "solution": "[키포인트] 첫 번째 극한으로 $f(1)$과 $f'(1)$을, 두 번째 극한으로 $f(2)$를 구한다.\n\n$\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)}{x-1}=1$이 유한하게 존재하므로\n$f(1)=0$이고 $f'(1)=1$이다.\n\n또\n$\\displaystyle\\lim_{x\\to3}\\dfrac{f(x-1)}{x}=2$에서 분모는 $3$으로 수렴하므로\n$\\dfrac{f(2)}3=2$이다.\n따라서 $f(2)=6$이다.\n\n구하는 극한을\n$\\displaystyle\n\\lim_{x\\to2}\n\\dfrac{f(x-1)}{(x-1)-1}\\,f(x)$\n로 나타내면\n$f'(1)f(2)=1\\cdot6=6$이다.\n\n따라서 정답은 ④이다."
  },
  {
    "id": 13,
    "level": "상",
    "category": "도형의 극한",
    "originalCategory": "도형의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "도형의극한",
      "그래프"
    ],
    "wide": false,
    "content": "곡선 $y=\\dfrac{\\sqrt{2}x}{x-1}\\;(x>1)$과 두 직선 $y=t\\;(t>2)$, $y=2$의 교점을 각각 $A$, $B$라 하고, 점 $A$에서 직선 $y=2$에 내린 수선의 발을 $H$라 할 때, $\\displaystyle\\lim_{t\\to2+}\\dfrac{AH}{BH}=a+b\\sqrt2$($a$, $b$는 상수)이다. $a+b$의 값은? [4.0점]",
    "choices": [
      "$-4$",
      "$-\\dfrac23$",
      "$-\\dfrac12$",
      "$-\\dfrac14$",
      "$-1$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 높이가 $s$인 수평선과 곡선의 교점의 $x$좌표를 구하여 두 선분의 길이를 식으로 나타낸다.\n\n곡선 위에서 $y=s$라 하면\n$s=\\dfrac{\\sqrt2x}{x-1}$이므로\n$x=\\dfrac{s}{s-\\sqrt2}$이다.\n\n따라서\n$x_A=\\dfrac{t}{t-\\sqrt2}$,\n$x_B=\\dfrac{2}{2-\\sqrt2}$이다.\n\n$AH=t-2$이고,\n$BH=x_B-x_A$이므로\n$BH=\n\\dfrac{2}{2-\\sqrt2}\n-\\dfrac{t}{t-\\sqrt2}\n=\n\\dfrac{\\sqrt2(t-2)}\n{(2-\\sqrt2)(t-\\sqrt2)}$이다.\n\n따라서\n$\\dfrac{AH}{BH}\n=\n\\dfrac{(2-\\sqrt2)(t-\\sqrt2)}{\\sqrt2}$이다.\n\n$t\\to2+$일 때\n$\\displaystyle\\lim_{t\\to2+}\\dfrac{AH}{BH}\n=\\dfrac{(2-\\sqrt2)^2}{\\sqrt2}\n=3\\sqrt2-4$이다.\n\n따라서 $a=-4$, $b=3$이므로 $a+b=-1$이다.\n\n따라서 정답은 ⑤이다.",
    "image": "assets/images/25_매산여고_2학기_중간_고2_수학II/q13.png"
  },
  {
    "id": 14,
    "level": "중",
    "category": "무한대에서의 극한",
    "originalCategory": "무한대에서의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 극한",
      "무한대극한",
      "유리화"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}(\\sqrt{1+x^2}-ax)=b$를 만족시키는 상수 $a,b$의 합은? [4.1점]",
    "choices": [
      "$-1$",
      "0",
      "1",
      "3",
      "10"
    ],
    "answer": "③",
    "solution": "[키포인트] 유한한 극한값이 존재하도록 최고차항을 소거한 뒤 유리화한다.\n\n$x\\to\\infty$일 때\n$\\sqrt{1+x^2}\\sim x$이므로 유한한 극한값이 존재하려면 $a=1$이어야 한다.\n\n이때\n$\\sqrt{1+x^2}-x\n=\n\\dfrac{1}{\\sqrt{1+x^2}+x}$이다.\n\n따라서 극한값은 $0$이므로 $b=0$이다.\n그러므로 $a+b=1$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "불연속점 제거",
    "originalCategory": "불연속점 제거",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 연속",
      "교점의개수",
      "불연속점"
    ],
    "wide": false,
    "content": "직선 $y=t$와 $y=\\dfrac{3x+1}{x+1}$의 교점 개수를 $f(t)$라 하자. $g(x)=-2x+a$에 대하여 $f(x)g(x)$가 실수 전체에서 연속일 때 $a$는? [4.2점]",
    "choices": [
      "4",
      "5",
      "6",
      "$\\dfrac{25}4$",
      "$\\dfrac{27}4$"
    ],
    "answer": "③",
    "solution": "[키포인트] 유리함수의 치역에서 빠지는 값에서 교점 개수 함수가 불연속이 됨을 이용한다.\n\n$y=\\dfrac{3x+1}{x+1}$을\n$y=3-\\dfrac2{x+1}$로 나타낼 수 있다.\n\n따라서 직선 $y=t$는 $t\\ne3$일 때 그래프와 한 점에서 만나고,\n$t=3$일 때는 만나지 않는다.\n\n즉 $f(t)=1$($t\\ne3$), $f(3)=0$이다.\n함수 $f(x)g(x)$가 $x=3$에서 연속이려면\n$g(3)=0$이어야 한다.\n\n$g(x)=-2x+a$이므로\n$-6+a=0$에서 $a=6$이다.\n\n따라서 정답은 ③이다."
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
      "교점의개수",
      "매개변수"
    ],
    "wide": false,
    "content": "직선 $y=mx$와 $f(x)=3x+2+|x-1|$의 교점 개수를 $g(m)$이라 하자. 최고차항 계수가 $1$인 이차함수 $h$에 대하여 $g(x)h(x)$가 실수 전체에서 연속일 때 $h(7)$은? [4.4점]",
    "choices": [
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "answer": "②",
    "solution": "[키포인트] 절댓값함수를 두 구간으로 나누어 각 직선과의 교점 존재 조건을 조사한다.\n\n$x<1$일 때\n$f(x)=2x+3$이다.\n$mx=2x+3$의 해는 $x=\\dfrac3{m-2}$이고,\n$x<1$ 조건을 만족하는 범위는 $m<2$ 또는 $m>5$이다.\n\n$x\\ge1$일 때\n$f(x)=4x+1$이다.\n$mx=4x+1$의 해는 $x=\\dfrac1{m-4}$이고,\n$x\\ge1$ 조건을 만족하는 범위는 $4<m\\le5$이다.\n\n따라서 교점 개수 $g(m)$은\n$m<2$ 또는 $m>4$일 때 $1$,\n$2\\le m\\le4$일 때 $0$이다.\n\n$g(x)h(x)$가 실수 전체에서 연속이려면\n$h(2)=h(4)=0$이어야 한다.\n최고차항의 계수가 $1$이므로\n$h(x)=(x-2)(x-4)$이다.\n\n따라서 $h(7)=5\\cdot3=15$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "연속성",
    "originalCategory": "연속성",
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
      "이차함수"
    ],
    "wide": false,
    "content": "$0<x<2$에서 $f(x)=\\begin{cases}1/x-1&(0<x\\le1)\\\\1/(x-1)-1&(1<x<2)\\end{cases}$일 때, 최고차항 계수가 $2$인 이차함수 $g$에 대하여 $f(x)g(x)$가 $x=1$에서 연속이면 $g(4)$는? [4.4점]",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "③",
    "solution": "[키포인트] 오른쪽에서 $f(x)$가 무한히 커지므로 $g(x)$가 $x=1$에서 이중근을 가져야 한다.\n\n$x\\to1-$일 때\n$f(x)=\\dfrac1x-1\\to0$이고,\n$f(1)=0$이다.\n\n$x\\to1+$일 때\n$f(x)=\\dfrac1{x-1}-1\n=\\dfrac{2-x}{x-1}$이다.\n\n곱 $f(x)g(x)$의 오른쪽 극한이 $0$이 되려면\n$\\dfrac{g(x)}{x-1}\\to0$이어야 하므로\n$g(x)$는 $x=1$을 이중근으로 가져야 한다.\n\n최고차항의 계수가 $2$인 이차함수이므로\n$g(x)=2(x-1)^2$이다.\n\n따라서 $g(4)=2\\cdot3^2=18$이다.\n\n따라서 정답은 ③이다."
  },
  {
    "id": 18,
    "level": "상",
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
      "삼차함수"
    ],
    "wide": false,
    "content": "최고차항 계수가 $2$인 삼차함수 $f(x)$와 $g(x)=\\begin{cases}\\dfrac{1}{x-3}&(x\\ne3)\\\\4&(x=3)\\end{cases}$에 대하여 $h(x)=f(x)g(x)$라 할 때, 함수 $h(x)$는 실수 전체의 집합에서 미분가능하고, $h'(3)=8$이다. $f(2)$의 값은? [4.6점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "①",
    "solution": "[키포인트] $h(x)=\\dfrac{f(x)}{x-3}$이 $x=3$에서 미분가능하려면 $f(x)$가 $(x-3)^2$을 인수로 가져야 한다.\n\n$x\\ne3$일 때\n$h(x)=\\dfrac{f(x)}{x-3}$이고,\n$h(3)=4f(3)$이다.\n\n연속이려면 $f(3)=0$이고,\n$\\displaystyle\\lim_{x\\to3}\\dfrac{f(x)}{x-3}=0$이어야 하므로\n$f'(3)=0$이다.\n\n따라서 최고차항의 계수가 $2$인 삼차함수 $f$는\n$f(x)=2(x-3)^2(x-r)$로 둘 수 있다.\n\n$x\\ne3$일 때\n$h(x)=2(x-3)(x-r)$이므로\n$h'(3)=2(3-r)=8$이다.\n따라서 $r=-1$이다.\n\n그러므로\n$f(2)=2(2-3)^2(2+1)=6$이다.\n\n따라서 정답은 ①이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "도함수의 대칭성",
    "originalCategory": "도함수의 대칭성",
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
      "대칭성"
    ],
    "wide": false,
    "content": "최고차항 계수가 $1$인 삼차함수 $f$가 모든 실수 $x$에 대하여 $f'(3+x)=f'(3-x)$를 만족시키고 $f(-1)=f'(-1)=0$일 때, $f(1)$은? [4.7점]",
    "choices": [
      "$-35$",
      "$-40$",
      "$-45$",
      "$-50$",
      "$-55$"
    ],
    "answer": "②",
    "solution": "[키포인트] 도함수의 그래프가 $x=3$에 대하여 대칭인 이차함수임을 이용한다.\n\n$f$는 최고차항의 계수가 $1$인 삼차함수이므로\n$f'(x)$는 최고차항의 계수가 $3$인 이차함수이다.\n\n$f'(3+x)=f'(3-x)$이므로 $f'(x)$의 대칭축은 $x=3$이다.\n따라서\n$f'(x)=3(x-3)^2+k$로 둘 수 있다.\n\n$f'(-1)=0$이므로\n$3\\cdot16+k=0$에서 $k=-48$이다.\n\n따라서\n$f'(x)=3x^2-18x-21$이고,\n$f(x)=x^3-9x^2-21x+C$이다.\n\n$f(-1)=0$에서 $C=-11$이다.\n그러므로\n$f(1)=1-9-21-11=-40$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 20,
    "level": "상",
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
      "평균변화율",
      "구간별함수"
    ],
    "wide": false,
    "content": "$f(x)=\\begin{cases}(x-1)(x-a)&(x<1)\\\\0&(1\\le x<2)\\\\1&(x\\ge2)\\end{cases}$이고, $0$에서 $t$까지의 평균변화율을 $g(t)$라 하자. $g(k)=g(k+1)=g(k+2)$인 $0<k<2$가 존재할 때 $f(-1)$은? [4.7점]",
    "choices": [
      "2",
      "$-1$",
      "1",
      "$-\\dfrac32$",
      "$-\\dfrac12$"
    ],
    "answer": "②",
    "solution": "[키포인트] 평균변화율 $g(t)$를 $t$의 범위에 따라 나타낸 뒤 $k$의 범위를 나누어 세 값이 같은 조건을 푼다.\n\n$f(0)=a$이다.\n\n$0<t<1$일 때\n$f(t)=(t-1)(t-a)$이므로\n$g(t)=\\dfrac{f(t)-f(0)}{t}=t-a-1$이다.\n\n$1\\le t<2$일 때\n$g(t)=-\\dfrac{a}{t}$이고,\n$t\\ge2$일 때\n$g(t)=\\dfrac{1-a}{t}$이다.\n\n먼저 $0<k<1$인 경우,\n$g(k)=k-a-1$,\n$g(k+1)=-\\dfrac{a}{k+1}$,\n$g(k+2)=\\dfrac{1-a}{k+2}$이다.\n\n$g(k+1)=g(k+2)$에서\n$-\\dfrac{a}{k+1}=\\dfrac{1-a}{k+2}$이므로\n$a=-k-1$이다.\n\n이를 $g(k)=g(k+1)$에 대입하면\n$k-(-k-1)-1=\\dfrac{k+1}{k+1}$이므로\n$2k=1$이다.\n\n따라서\n$k=\\dfrac12$,\n$a=-\\dfrac32$이다.\n\n다음으로 $1\\le k<2$인 경우,\n$g(k)=-\\dfrac{a}{k}$,\n$g(k+1)=\\dfrac{1-a}{k+1}$,\n$g(k+2)=\\dfrac{1-a}{k+2}$이다.\n\n$g(k+1)=g(k+2)$이고 $k+1\\ne k+2$이므로\n$1-a=0$, 즉 $a=1$이어야 한다.\n그러나 이때\n$g(k)=-\\dfrac1k\\ne0=g(k+1)$이므로 세 값이 같을 수 없다.\n\n따라서 가능한 값은\n$k=\\dfrac12$, $a=-\\dfrac32$뿐이다.\n\n그러므로\n$f(-1)=(-2)\\left(-1+\\dfrac32\\right)=-1$이다.\n\n따라서 정답은 ②이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "다항함수의 결정",
    "originalCategory": "다항함수의 결정",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수의 극한",
      "다항함수",
      "함수결정"
    ],
    "wide": false,
    "content": "[주관식 1(서술형)] 다항함수 $f$가 $\\lim_{x\\to\\infty}\\dfrac{f(x)-x^3}{x^2+2x}=-2$, $\\lim_{x\\to3}\\dfrac{f(x)}{x^2-2x-3}=1$을 만족시킬 때 $f(x)$를 구하시오. [6점]",
    "choices": [],
    "answer": "$f(x)=x^3-2x^2-11x+24$",
    "solution": "[키포인트] 무한대에서의 극한으로 최고차항과 이차항의 계수를 정하고, $x=3$에서의 극한으로 인수와 미분계수를 이용한다.\n\n첫째 극한에서\n$f(x)=x^3-2x^2+bx+c$로 둘 수 있다.\n\n둘째 극한의 분모는\n$x^2-2x-3=(x-3)(x+1)$이다.\n극한값이 유한하게 존재하므로 $f(3)=0$이고,\n극한값이 $1$이므로\n$\\dfrac{f'(3)}4=1$이다.\n따라서 $f'(3)=4$이다.\n\n$f'(x)=3x^2-4x+b$이므로\n$15+b=4$에서 $b=-11$이다.\n\n$f(3)=9+3b+c=0$에 $b=-11$을 대입하면\n$c=24$이다.\n\n따라서\n$f(x)=x^3-2x^2-11x+24$이다."
  },
  {
    "id": 22,
    "level": "상",
    "category": "다항함수의 결정",
    "originalCategory": "다항함수의 결정",
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
      "함수결정"
    ],
    "wide": false,
    "content": "[주관식 2 (서술형)]<br>다항함수 $f(x)$에 대하여 $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{f(x)-x^4}{x^3}=5$, $\\displaystyle\\lim_{x\\to1}\\dfrac{f(x)-2}{x-1}=-3$, $f'(-1)=21$일 때, $f'(0)+f(-1)$의 값을 풀이과정과 함께 구하시오. [7점]",
    "choices": [],
    "answer": "$-2$",
    "solution": "[키포인트] 세 조건을 이용하여 사차함수의 계수를 차례로 결정한다.\n\n첫째 극한에서\n$f(x)=x^4+5x^3+ax^2+bx+c$로 둘 수 있다.\n\n둘째 극한이 $-3$이므로\n$f(1)=2$, $f'(1)=-3$이다.\n또 $f'(-1)=21$이다.\n\n$f'(x)=4x^3+15x^2+2ax+b$이므로\n$f'(1)=-3$에서\n$2a+b=-22$이다.\n\n$f'(-1)=21$에서\n$-2a+b=10$이다.\n\n두 식을 풀면\n$a=-8$, $b=-6$이다.\n\n$f(1)=2$에서\n$1+5-8-6+c=2$이므로 $c=10$이다.\n\n따라서\n$f'(0)=b=-6$이고,\n$f(-1)=1-5-8+6+10=4$이다.\n\n그러므로\n$f'(0)+f(-1)=-6+4=-2$이다.\n\n따라서 구하는 값은 $-2$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "역함수",
    "originalCategory": "역함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수의 연속",
      "역함수",
      "일대일함수",
      "구간별함수"
    ],
    "wide": false,
    "content": "[주관식 3(서술형)] $f(x)=\\begin{cases}ax+b&(x<2)\\\\cx^2+3x&(x\\ge2)\\end{cases}$가 실수 전체에서 연속이고 역함수를 갖는다. 방정식 $f(x)=f^{-1}(x)$의 해가 $0,2,3$일 때, $a+b+c$를 구하시오. [7점]",
    "choices": [],
    "answer": "$\\dfrac32$",
    "solution": "[키포인트] 연속이고 역함수를 갖는 함수는 일대일 단조함수이며, 방정식의 세 해가 함수에 의해 어떻게 대응되는지 순서를 이용한다.\n\n함수 $f$는 실수 전체에서 연속이고 역함수를 가지므로 일대일인 단조함수이다.\n\n$f$가 증가함수라면\n$f(x)=f^{-1}(x)$는 $f(x)=x$와 같으므로\n해 $0$, $2$, $3$이 모두 고정점이어야 한다.\n그러나 오른쪽 구간의 식 $cx^2+3x$가 $x=2$, $3$을 모두 고정점으로 갖도록 할 수 없으므로 증가함수는 아니다.\n\n따라서 $f$는 감소함수이다.\n\n방정식 $f(x)=f^{-1}(x)$의 해 집합은\n$f$에 의해 서로 대응된다.\n또 $0<2<3$이고 $f$가 감소함수이므로\n$f(0)>f(2)>f(3)$이어야 한다.\n\n해 집합이 $\\{0,2,3\\}$이므로 이 순서를 만족하는 대응은\n$f(0)=3$, $f(2)=2$, $f(3)=0$\n하나뿐이다.\n\n따라서\n$f(0)=b=3$이다.\n\n$f(3)=9c+9=0$이므로\n$c=-1$이다.\n\n또 $f(2)=2$이고 연속이므로\n$2a+b=4c+6=2$이다.\n\n$b=3$을 대입하면\n$2a+3=2$이므로\n$a=-\\dfrac12$이다.\n\n따라서\n$a+b+c=-\\dfrac12+3-1=\\dfrac32$이다.\n\n따라서 구하는 값은 $\\dfrac32$이다."
  }
];
