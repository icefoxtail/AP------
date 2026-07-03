window.examTitle = "26_왕운중_1학기_기말_중2_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "일차방정식",
      "조건"
    ],
    "wide": false,
    "content": "식 $ax-3y+7=-5x+by-4$가 미지수가 2개인 일차방정식이 되기 위한 조건을 구하면? (단, $a$, $b$는 상수) [3점]",
    "choices": [
      "$a\ne-5$, $b=-3$",
      "$a\ne-5$, $b\ne-3$",
      "$a=-5$, $b\ne-3$",
      "$a\ne5$, $b\ne3$",
      "$a\ne5$, $b=3$"
    ],
    "answer": "②",
    "solution": "[키포인트] 미지수가 2개인 일차방정식이 되려면 $x$의 계수와 $y$의 계수가 모두 0이 아니어야 한다.\n정석 풀이:\n주어진 식을 한쪽으로 정리하면\n$ax-3y+7=-5x+by-4$\n$\\Rightarrow (a+5)x+(-3-b)y+11=0$이다.\n따라서 $x$의 계수 $a+5$가 0이 아니고, $y$의 계수 $-3-b$도 0이 아니어야 한다.\n즉\n$a\ne-5$, $b\ne-3$이다.\n결론: 정답은 ②이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "일차방정식",
      "자연수해"
    ],
    "wide": false,
    "content": "일차방정식 $x+2y=9$를 만족시키는 자연수 $x$, $y$에 대하여 $x-y$의 값이 될 수 없는 것을 고르면? [3점]",
    "choices": [
      "$6$",
      "$3$",
      "$0$",
      "$-3$",
      "$-6$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 자연수 조건을 만족하는 해를 모두 찾아 $x-y$ 값을 조사한다.\n정석 풀이:\n$x=9-2y$이므로 $x$가 자연수가 되게 하는 자연수 $y$를 찾으면 된다.\n$y=1,2,3,4$일 때 각각 $(x,y)=(7,1),(5,2),(3,3),(1,4)$이다.\n이때 $x-y$의 값은 각각 $6,3,0,-3$이다.\n따라서 될 수 없는 값은 $-6$이다.\n결론: 정답은 ⑤이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "일차방정식",
      "해대입"
    ],
    "wide": false,
    "content": "일차방정식 $5x-2(ay-4)=7$의 한 해가 $(3,-1)$일 때, 상수 $a$의 값을 구하면? [3점]",
    "choices": [
      "$-8$",
      "$-4$",
      "$2$",
      "$4$",
      "$8$"
    ],
    "answer": "①",
    "solution": "[키포인트] 주어진 해를 식에 그대로 대입한다.\n정석 풀이:\n$(x,y)=(3,-1)$을 대입하면\n$5\\cdot3-2\\{a(-1)-4\\}=7$이다.\n즉\n$15-2(-a-4)=7$\n$15+2a+8=7$\n$2a=-16$\n$a=-8$이다.\n결론: 정답은 ①이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립방정식",
      "대입"
    ],
    "wide": false,
    "content": "연립방정식 $\begin{cases}2x+y=5\\3x-2y=11\\end{cases}$의 해가 $x=m$, $y=n$일 때, 연립방정식 $\begin{cases}mx+ny=8\\nx-my=4\\end{cases}$의 해를 구하면? [4점]",
    "choices": [
      "$x=1,\\ y=-2$",
      "$x=2,\\ y=2$",
      "$x=2,\\ y=-2$",
      "$x=3,\\ y=-2$",
      "$x=3,\\ y=2$"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 $m$, $n$을 구한 뒤 두 번째 연립방정식에 대입한다.\n정석 풀이:\n$2x+y=5$에서 $y=5-2x$이다.\n이를 $3x-2y=11$에 대입하면\n$3x-2(5-2x)=11$\n$3x-10+4x=11$\n$7x=21$\n$x=3$이다.\n따라서 $y=5-2\\cdot3=-1$이므로 $m=3$, $n=-1$이다.\n이제\n$\begin{cases}3x-y=8\\-x-3y=4\\end{cases}$를 푼다.\n첫째 식에서 $y=3x-8$이다.\n이를 둘째 식에 대입하면\n$-x-3(3x-8)=4$\n$-x-9x+24=4$\n$-10x=-20$\n$x=2$이다.\n따라서 $y=3\\cdot2-8=-2$이다.\n결론: 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립방정식",
      "순환소수"
    ],
    "wide": false,
    "content": "연립방정식 $\begin{cases}0.\\dot{6}x+1.\\dot{3}y=2\\\\dfrac{1}{6}x-\\dfrac{2}{3}y=2\\end{cases}$를 만족시키는 $x$, $y$에 대하여 $xy$의 값을 구하면? [5점]",
    "choices": [
      "$9$",
      "$6$",
      "$3$",
      "$-9$",
      "$-6$"
    ],
    "answer": "④",
    "solution": "[키포인트] 순환소수를 분수로 바꾸어 연립방정식을 푼다.\n정석 풀이:\n$0.\\dot{6}=\\dfrac{2}{3}$, $1.\\dot{3}=\\dfrac{4}{3}$이므로\n$\begin{cases}\\dfrac{2}{3}x+\\dfrac{4}{3}y=2\\\\dfrac{1}{6}x-\\dfrac{2}{3}y=2\\end{cases}$이다.\n첫째 식에 3을 곱하면\n$x+2y=3$이고, 둘째 식에 6을 곱하면\n$x-4y=12$이다.\n두 식을 빼면\n$6y=-9$이므로 $y=-\\dfrac{3}{2}$이다.\n이를 $x+2y=3$에 대입하면\n$x+2\\left(-\\dfrac{3}{2}\right)=3$\n$x-3=3$\n$x=6$이다.\n따라서\n$xy=6\times\\left(-\\dfrac{3}{2}\right)=-9$이다.\n결론: 정답은 ④이다."
  },
  {
    "id": 6,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립방정식"
    ],
    "wide": false,
    "content": "연립방정식 $\begin{cases}2x-3y=-14\\y=x+4\\end{cases}$의 해를 구하면? [4점]",
    "choices": [
      "$x=2,\\ y=6$",
      "$x=3,\\ y=7$",
      "$x=4,\\ y=8$",
      "$x=-2,\\ y=2$",
      "$x=-3,\\ y=1$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 번째 식을 첫 번째 식에 대입한다.\n정석 풀이:\n$y=x+4$를 $2x-3y=-14$에 대입하면\n$2x-3(x+4)=-14$\n$2x-3x-12=-14$\n$-x=-2$\n$x=2$이다.\n따라서 $y=x+4=6$이다.\n결론: 정답은 ①이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립방정식",
      "해의개수"
    ],
    "wide": false,
    "content": "연립방정식 $\begin{cases}ax+by+c=0\\a'x+b'y+c'=0\\end{cases}$ ($a$, $b$, $c$, $a'$, $b'$, $c'$는 상수)에 대한 설명으로 옳은 것은? [5점]",
    "choices": [
      "$a\ne a'$, $b\ne b'$이면 해가 없다.",
      "$a=a'$, $b=b'$, $c=c'$일 때, 해가 없다.",
      "$a=a'$, $b=b'$, $c\ne c'$일 때, 해가 무수히 많다.",
      "$a=0$, $b\ne0$이고 $c\ne0$, $b'=0$이면 해가 하나뿐이다.",
      "$a=1$, $b=1$, $c=2$이고 $a'=1$, $b'=2$, $c'=4$일 때, 해는 $x=0$, $y=2$이다."
    ],
    "answer": "④",
    "solution": "[키포인트] 두 직선의 위치 관계를 생각한다.\n정석 풀이:\n① $a\ne a'$, $b\ne b'$라고 해서 반드시 해가 없는 것은 아니다. 한 점에서 만날 수도 있다.\n② $a=a'$, $b=b'$, $c=c'$이면 두 식이 완전히 같으므로 해가 무수히 많다.\n③ $a=a'$, $b=b'$, $c\ne c'$이면 서로 평행한 다른 두 직선이므로 해가 없다.\n④ $a=0$, $b\ne0$, $c\ne0$이면 첫째 식은 $y$값이 일정한 수평선이다. 또 $b'=0$이면 둘째 식은 $x$값이 일정한 수직선이므로 두 직선은 한 점에서 만난다. 따라서 해가 하나뿐이다.\n⑤ $x+y+2=0$, $x+2y+4=0$을 풀면 $x=0$, $y=-2$이므로 옳지 않다.\n결론: 정답은 ④이다."
  },
  {
    "id": 8,
    "level": "상",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "아래 그림의 조건을 보고 타일 한 장의 넓이를 구하면? [5점]",
    "choices": [
      "$80\text{cm}^2$",
      "$120\text{cm}^2$",
      "$160\text{cm}^2$",
      "$200\text{cm}^2$",
      "$240\text{cm}^2$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 타일의 가로와 세로를 문자로 놓고 큰 직사각형의 가로와 세로를 표현한다.\n정석 풀이:\n타일의 긴 변의 길이를 $x$cm, 짧은 변의 길이를 $y$cm라 하자.\n그림에서 큰 직사각형의 가로는 위쪽에 가로로 놓인 타일 3장의 길이와 같고, 가운데 줄에 세로로 놓인 타일 5장의 길이와 같으므로\n$3x=5y$이다.\n또 큰 직사각형의 세로는 위 한 줄의 $y$, 가운데 줄의 $x$, 아래 한 줄의 $y$를 합친 것이므로 $x+2y$이다.\n둘레가 208cm이므로\n$2\\{3x+(x+2y)\\}=208$\n$4x+2y=104$\n$2x+y=52$이다.\n$3x=5y$에서 $y=\\dfrac{3x}{5}$이므로\n$2x+\\dfrac{3x}{5}=52$\n$\\dfrac{13x}{5}=52$\n$13x=260$\n$x=20$이다.\n따라서 $y=12$이다.\n타일 한 장의 넓이는\n$xy=20\times12=240\text{cm}^2$이다.\n결론: 정답은 ⑤이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q8.png",
    "imageSize": "medium"
  },
  {
    "id": 9,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의뜻"
    ],
    "wide": false,
    "content": "다음 중 $y$가 $x$의 함수가 아닌 것은? [4점]",
    "choices": [
      "자연수 $x$보다 작은 홀수의 개수 $y$",
      "자연수 $x$를 $3$으로 나눈 나머지 $y$",
      "한 변의 길이가 $x$cm인 정사각형의 둘레의 길이 $y$cm",
      "한 개에 $1500$원인 아이스크림 $x$개의 가격 $y$원",
      "자연수 $x$의 소인수 $y$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 함수는 $x$의 값이 하나 정해질 때 $y$의 값도 오직 하나만 정해져야 한다.\n정석 풀이:\n①, ②, ③, ④는 $x$가 정해지면 $y$가 하나로 정해진다.\n하지만 ⑤ 자연수 $x$의 소인수는 하나가 아닐 수도 있다.\n예를 들어 $x=12$이면 소인수는 $2$, $3$으로 여러 개이다.\n따라서 $y$가 $x$의 함수가 아니다.\n결론: 정답은 ⑤이다."
  },
  {
    "id": 10,
    "level": "하",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수값"
    ],
    "wide": false,
    "content": "함수 $f(x)=2x-a$에서 $f(3)=3$, $f(b)=5$일 때, $ab$의 값을 구하면? (단, $a$는 상수) [3점]",
    "choices": [
      "$-15$",
      "$-12$",
      "$4$",
      "$12$",
      "$15$"
    ],
    "answer": "④",
    "solution": "[키포인트] 먼저 $a$를 구하고, 그다음 $b$를 구한다.\n정석 풀이:\n$f(3)=3$이므로\n$2\\cdot3-a=3$\n$6-a=3$\n$a=3$이다.\n또 $f(b)=5$이므로\n$2b-a=5$\n$2b-3=5$\n$2b=8$\n$b=4$이다.\n따라서\n$ab=3\times4=12$이다.\n결론: 정답은 ④이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평행이동",
      "x절편"
    ],
    "wide": false,
    "content": "일차함수 $y=-4x+a$의 그래프를 $y$축의 방향으로 $-3$만큼 평행이동한 그래프의 $x$절편이 $-2$일 때, 상수 $a$의 값을 구하면? [4점]",
    "choices": [
      "$-11$",
      "$-5$",
      "$3$",
      "$5$",
      "$11$"
    ],
    "answer": "②",
    "solution": "[키포인트] $y$축의 방향으로 $-3$만큼 평행이동하면 식에서 상수항이 3만큼 줄어든다.\n정석 풀이:\n평행이동한 그래프의 식은\n$y=-4x+a-3$이다.\n이 그래프의 $x$절편이 $-2$이므로 점 $(-2,0)$을 지난다.\n따라서\n$0=-4(-2)+a-3$\n$0=8+a-3$\n$a=-5$이다.\n결론: 정답은 ②이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "기울기",
      "평행",
      "절편"
    ],
    "wide": false,
    "content": "다음 보기의 일차함수들에 대한 설명으로 옳은 것은? [4점]",
    "choices": [
      "일차함수의 그래프가 오른쪽 아래로 향하는 것은 2개다.",
      "$x$절편과 $y$절편이 같은 일차함수는 0개다.",
      "$x$절편이 음수인 일차함수는 3개다.",
      "서로 평행한 두 그래프는 2쌍이다.",
      "$x$의 값이 증가할 때 $y$의 값이 증가하는 그래프는 1개다."
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 함수의 기울기와 절편을 차례로 살핀다.\n정석 풀이:\n보기의 함수는\nㄱ. $y=-2x+1$\nㄴ. $y=1-3x$\nㄷ. $y=\\dfrac12x-9$\nㄹ. $y=-5x$\nㅁ. $y=-2x-18$이다.\n기울기가 양수인 것은 ㄷ 하나뿐이므로 $x$가 증가할 때 $y$도 증가하는 그래프는 1개이다.\n따라서 ⑤가 옳다.\n다른 선택지를 확인하면, 오른쪽 아래로 향하는 그래프는 ㄱ, ㄴ, ㄹ, ㅁ의 4개이고, 서로 평행한 것은 ㄱ과 ㅁ 한 쌍뿐이다.\n결론: 정답은 ⑤이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q12.png",
    "imageSize": "medium"
  },
  {
    "id": 13,
    "level": "하",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "기울기"
    ],
    "wide": false,
    "content": "다음 일차함수의 그래프 중 $x$의 값이 2만큼 증가할 때 $y$의 값이 8만큼 감소하는 것은? [3점]",
    "choices": [
      "$y=-4x$",
      "$y=4x-9$",
      "$y=-8x+2$",
      "$y=-\\dfrac14x-4$",
      "$y=\\dfrac14x+3$"
    ],
    "answer": "①",
    "solution": "[키포인트] $x$가 2만큼 증가할 때 $y$가 8만큼 감소하므로 기울기는 $\\dfrac{-8}{2}=-4$이다.\n정석 풀이:\n기울기가 $-4$인 일차함수를 찾으면 된다.\n① $y=-4x$의 기울기는 $-4$이다.\n따라서 조건을 만족한다.\n결론: 정답은 ①이다."
  },
  {
    "id": 14,
    "level": "하",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "두점사이기울기"
    ],
    "wide": false,
    "content": "두 점 $(-1,2)$, $(4,12)$를 지나는 직선의 그래프의 기울기가 $a$이고, 점 $(b,6)$을 지날 때, $a+b$의 값을 구하면? [4점]",
    "choices": [
      "$5$",
      "$4$",
      "$3$",
      "$2$",
      "$1$"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 기울기를 구하고, 직선의 식을 세운 뒤 $b$를 구한다.\n정석 풀이:\n기울기 $a$는\n$a=\\dfrac{12-2}{4-(-1)}=\\dfrac{10}{5}=2$이다.\n따라서 직선의 식은 기울기가 2이고 점 $(-1,2)$를 지나므로\n$y-2=2(x+1)$\n$y=2x+4$이다.\n점 $(b,6)$이 이 직선 위에 있으므로\n$6=2b+4$\n$2b=2$\n$b=1$이다.\n따라서\n$a+b=2+1=3$이다.\n결론: 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "사분면",
      "그래프"
    ],
    "wide": false,
    "content": "아래 그림의 조건에서 일차함수 $y=abx+(a+b)$의 그래프가 지나가지 않는 사분면을 구하면? [5점]",
    "choices": [
      "제1사분면",
      "제2사분면",
      "제3사분면",
      "제4사분면",
      "제1, 2사분면"
    ],
    "answer": "②",
    "solution": "[키포인트] 먼저 그림으로부터 $a$와 $b$의 부호를 판단한다.\n정석 풀이:\n원래 그래프는 $y=bx-a$이고, 오른쪽으로 갈수록 내려가므로 $b<0$이다.\n또 $y$절편이 양수이므로 $-a>0$, 따라서 $a<0$이다.\n그러므로\n$ab>0$, $a+b<0$이다.\n따라서 일차함수 $y=abx+(a+b)$의 그래프는 기울기가 양수이고 $y$절편은 음수이다.\n이와 같은 직선은 제1사분면, 제3사분면, 제4사분면은 지나지만 제2사분면은 지나지 않는다.\n결론: 정답은 ②이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q15.png",
    "imageSize": "medium"
  },
  {
    "id": 16,
    "level": "하",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "비례",
      "시간"
    ],
    "wide": false,
    "content": "어떤 스마트폰 배터리가 4분마다 5%씩 감소한다고 하자. 현재 이 스마트폰의 배터리가 100%라고 할 때, 배터리가 완전히 방전되는 것은 몇 시간 몇 분 후인가? (단, 동영상 시청 이외의 다른 상황은 생각하지 않는다.) [4점]",
    "choices": [
      "1시간",
      "1시간 10분",
      "1시간 20분",
      "1시간 30분",
      "1시간 40분"
    ],
    "answer": "③",
    "solution": "[키포인트] 100%가 모두 사라질 때까지 몇 번의 5% 감소가 필요한지 구한다.\n정석 풀이:\n배터리 100%가 5%씩 감소하므로 감소 횟수는\n$100\\div5=20$번이다.\n4분마다 1번 감소하므로 전체 시간은\n$20\times4=80$분이다.\n$80$분은 1시간 20분이다.\n결론: 정답은 ③이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프해석",
      "정답2개"
    ],
    "wide": false,
    "content": "다음 중 일차방정식 $-5x+2y+1=0$의 그래프에 대한 설명으로 옳은 것을 모두 고르면? (정답 2개) [4점]",
    "choices": [
      "$x$절편은 $\\dfrac15$, $y$절편은 $\\dfrac12$이다.",
      "$x$의 값이 증가할 때 $y$의 값은 증가한다.",
      "$-10x+4y+3=0$과 한 점에서 만난다.",
      "제2사분면을 지나지 않는다.",
      "점 $(1,-2)$를 지난다."
    ],
    "answer": "②, ④",
    "solution": "[키포인트] 식을 $y=ax+b$ 꼴로 바꾸어 기울기와 절편을 확인한다.\n정석 풀이:\n$-5x+2y+1=0$을 정리하면\n$2y=5x-1$\n$y=\\dfrac52x-\\dfrac12$이다.\n따라서 기울기는 $\\dfrac52>0$이므로 ②는 옳다.\n$x$절편은 $0=\\dfrac52x-\\dfrac12$에서 $x=\\dfrac15$이고, $y$절편은 $-\\dfrac12$이므로 ①은 틀리다.\n또 $-10x+4y+3=0$은 $2$로 나누면 $-5x+2y+\\dfrac32=0$이므로 주어진 직선과 평행하여 만나지 않는다. 따라서 ③은 틀리다.\n$x<0$이면 $y=\\dfrac52x-\\dfrac12<0$이므로 제2사분면을 지나지 않는다. 따라서 ④는 옳다.\n마지막으로 $(1,-2)$를 대입하면 $-5+2(-2)+1=-8\ne0$이므로 ⑤는 틀리다.\n결론: 정답은 ②, ④이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형",
      "넓이",
      "직선의식"
    ],
    "wide": false,
    "content": "아래 그림과 같은 조건에서 $a+b+k$의 값을 구하면? [5점]",
    "choices": [
      "$-2$",
      "$0$",
      "$2$",
      "$4$",
      "$6$"
    ],
    "answer": "①",
    "solution": "[키포인트] 삼각형의 넓이로 점 $A$의 높이를 구한 뒤, 점 $A$, $B$를 이용해 직선의 식을 찾는다.\n정석 풀이:\n점 $B$는 $y$축 위에 있고 $y=3$ 위의 점이므로 $B=(0,3)$이다.\n직선 $y=-2x+9$와 $y=3$의 교점은\n$3=-2x+9$에서 $x=3$이므로 $C=(3,3)$이다.\n따라서 밑변 $BC$의 길이는 $3$이다.\n삼각형의 넓이가 3이므로\n$\\dfrac12\times3\times(\text{점 }A\text{의 }y\text{좌표}-3)=3$이다.\n여기서 점 $A$의 $y$좌표를 $h$라 하면\n$\\dfrac32(h-3)=3$\n$h-3=2$\n$h=5$이다.\n점 $A$는 직선 $y=-2x+9$ 위에 있으므로\n$5=-2x+9$\n$x=2$이다.\n따라서 $k=2$, 즉 $A=(2,5)$이다.\n직선 $ax+y+b=0$은 점 $A(2,5)$와 $B(0,3)$을 지난다.\n기울기는 $\\dfrac{5-3}{2-0}=1$이므로 식은\n$y=x+3$이다.\n이를 $ax+y+b=0$ 꼴로 쓰면\n$-x+y-3=0$이 아니고, 좌변을 모두 한쪽으로 넘기면 $x-y+3=0$이지만 문제의 꼴은 $ax+y+b=0$이므로\n$-x+y-3=0$을 $(-1)$배하여 $x-y+3=0$? 라고 쓰는 대신, $y=x+3$을 $-x+y-3=0$으로 정리하면 $a=-1$, $b=-3$이다.\n따라서\n$a+b+k=-1+(-3)+2=-2$이다.\n결론: 정답은 ①이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q18.png",
    "imageSize": "medium"
  },
  {
    "id": 19,
    "level": "하",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평행조건"
    ],
    "wide": false,
    "content": "두 점 $(2a,\\ a+4)$, $(-a+9,\\ 5)$을 지나는 직선이 $y$축에 평행할 때, $a$의 값은? [4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] $y$축에 평행한 직선에서는 두 점의 $x$좌표가 같다.\n정석 풀이:\n$y$축에 평행하려면 두 점의 $x$좌표가 같아야 하므로\n$2a=-a+9$이다.\n따라서\n$3a=9$\n$a=3$이다.\n결론: 정답은 ③이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "직선의일치",
      "평행"
    ],
    "wide": false,
    "content": "일차방정식 $-x+3y=5$의 그래프는 $ax-6y=-10$의 그래프와는 일치하고, $-2x+6y=2b$의 그래프와는 만나지 않는다고 할 때, $a+b$의 값이 될 수 없는 것은? (단, $a$, $b$는 상수) [4점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "[키포인트] 첫 번째 조건으로 $a$를 구하고, 두 번째 조건으로 $b$의 조건을 찾는다.\n정석 풀이:\n$-x+3y=5$를 $-2$배하면\n$2x-6y=-10$이다.\n따라서 $ax-6y=-10$과 일치하려면 $a=2$이다.\n또 $-x+3y=5$를 $2$배하면\n$-2x+6y=10$이다.\n그래프 $-2x+6y=2b$가 주어진 직선과 만나지 않으려면 서로 평행하지만 일치하지 않아야 하므로\n$2b\ne10$, 즉 $b\ne5$이다.\n따라서\n$a+b=2+b$이므로 $a+b$는 $7$이 될 수 없다.\n결론: 정답은 ④이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "essay",
    "tags": [
      "서술형",
      "연립방정식"
    ],
    "wide": false,
    "content": "연립방정식 $\begin{cases}x+2y=-6\\4x-3y=2k-3\\end{cases}$를 만족시키는 $x$의 값이 $y$의 값보다 3만큼 작을 때, 상수 $k$의 값을 구하시오. [4점]",
    "answer": "k = -5",
    "solution": "[키포인트] “$x$의 값이 $y$의 값보다 3만큼 작다”는 $x=y-3$을 뜻한다.\n정석 풀이:\n조건에 따라\n$x=y-3$이다.\n이를 $x+2y=-6$에 대입하면\n$(y-3)+2y=-6$\n$3y-3=-6$\n$3y=-3$\n$y=-1$이다.\n따라서\n$x=y-3=-4$이다.\n이제 $4x-3y=2k-3$에 대입하면\n$4(-4)-3(-1)=2k-3$\n$-16+3=2k-3$\n$-13=2k-3$\n$2k=-10$\n$k=-5$이다.\n결론: $k=-5$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "일차방정식",
    "originalCategory": "일차방정식",
    "standardCourse": "중2",
    "standardUnitKey": "M2-02",
    "standardUnit": "일차방정식",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "essay",
    "tags": [
      "서술형",
      "일차방정식"
    ],
    "wide": false,
    "content": "서원이와 서호가 계단에서 가위바위보를 하여 이기면 3계단을 올라가고, 지면 2계단을 내려가는 게임을 하고 있다. 처음보다 서원이는 10계단, 서호는 20계단을 더 올라가 있을 때, 서호가 진 횟수를 구하시오. (단, 비기는 경우는 없다.) [5점]",
    "answer": "14회",
    "solution": "[키포인트] 서원이 이긴 횟수와 진 횟수를 문자로 두어 식을 세운다.\n정석 풀이:\n서원이가 이긴 횟수를 $x$회, 진 횟수를 $y$회라 하자.\n한 번 이기면 3계단 올라가고, 한 번 지면 2계단 내려가므로 서원이의 변화량은\n$3x-2y=10$이다.\n서호는 서원이가 이기면 지고, 서원이가 지면 이기므로 변화량은\n$3y-2x=20$이다.\n따라서 연립방정식\n$\begin{cases}3x-2y=10\\-2x+3y=20\\end{cases}$를 푼다.\n첫째 식에 3을 곱하면 $9x-6y=30$, 둘째 식에 2를 곱하면 $-4x+6y=40$이다.\n두 식을 더하면\n$5x=70$\n$x=14$이다.\n$x$는 서원이가 이긴 횟수이므로, 이는 곧 서호가 진 횟수와 같다.\n결론: 서호가 진 횟수는 14회이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "essay",
    "tags": [
      "서술형",
      "일차함수",
      "그래프"
    ],
    "wide": false,
    "content": "원이와 미남이가 어떤 일차함수의 식을 보고 그래프를 그리는데 아래 보기와 같이 각각 잘못 그렸다. 처음 일차함수의 그래프가 점 $(4,k)$를 지난다고 할 때, 처음 일차함수의 식과 수 $k$의 값을 구하시오. [5점]",
    "answer": "y = \\dfrac{3}{4}x + 9,\\ k = 12",
    "solution": "[키포인트] 원이는 기울기만 잘못 보았으므로 $y$절편은 같고, 미남은 $y$절편만 잘못 보았으므로 기울기는 같다.\n정석 풀이:\n원이의 잘못 그린 그래프는 두 점 $(5,-1)$, $(2,5)$를 지난다.\n이 직선의 기울기는\n$\\dfrac{-1-5}{5-2}=\\dfrac{-6}{3}=-2$이고,\n식은 $y=-2x+9$이다.\n원이는 기울기만 잘못 보았으므로 처음 일차함수의 $y$절편은 $9$이다.\n미남의 잘못 그린 그래프는 $x$절편이 $4$, $y$절편이 $-3$인 그래프이므로 점 $(4,0)$과 $(0,-3)$을 지난다.\n이 직선의 기울기는\n$\\dfrac{0-(-3)}{4-0}=\\dfrac34$이다.\n미남은 $y$절편만 잘못 보았으므로 처음 일차함수의 기울기는 $\\dfrac34$이다.\n따라서 처음 일차함수의 식은\n$y=\\dfrac34x+9$이다.\n이 그래프가 점 $(4,k)$를 지나므로\n$k=\\dfrac34\\cdot4+9=3+9=12$이다.\n결론: 처음 일차함수의 식은 $y=\\dfrac34x+9$, $k=12$이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q23.png",
    "imageSize": "medium"
  },
  {
    "id": 24,
    "level": "상",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2",
    "standardUnitKey": "M2-03",
    "standardUnit": "일차함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "essay",
    "tags": [
      "서술형",
      "삼각형",
      "직선"
    ],
    "wide": false,
    "content": "두 일차방정식 $-x+y-4=0$, $3x+y+4=0$의 그래프가 아래 그림과 같을 때, $ax-y+3=0$의 그래프가 삼각형을 이루지 않도록 하는 수 $a$의 값을 모두 구하시오. [6점]",
    "answer": "a = -3,\\ \\dfrac{1}{2},\\ 1",
    "solution": "[키포인트] 세 직선이 삼각형을 이루지 않으려면, 두 직선과 평행하거나 세 직선이 한 점에서 만나야 한다.\n정석 풀이:\n주어진 두 직선을 $y=ax+b$ 꼴로 바꾸면\n$-x+y-4=0 \\Rightarrow y=x+4$\n$3x+y+4=0 \\Rightarrow y=-3x-4$이다.\n또 $ax-y+3=0$은\n$y=ax+3$이다.\n삼각형을 이루지 않으려면 다음 세 경우를 생각하면 된다.\n(1) $y=ax+3$이 $y=x+4$와 평행한 경우\n기울기가 같아야 하므로 $a=1$\n(2) $y=ax+3$이 $y=-3x-4$와 평행한 경우\n기울기가 같아야 하므로 $a=-3$\n(3) 세 직선이 한 점에서 만나는 경우\n먼저 $y=x+4$와 $y=-3x-4$의 교점을 구하면\n$x+4=-3x-4$\n$4x=-8$\n$x=-2$이고, $y=2$이다.\n따라서 교점은 $(-2,2)$이다.\n이 점이 $y=ax+3$ 위에도 있어야 하므로\n$2=a(-2)+3$\n$-2a=-1$\n$a=\\dfrac12$이다.\n따라서 구하는 값은\n$a=-3,\\ \\dfrac12,\\ 1$이다.\n결론: $a=-3,\\ \\dfrac12,\\ 1$이다.",
    "image": "assets/images/26_왕운중_1학기_기말_중2_기출/q24.png",
    "imageSize": "medium"
  }
];
