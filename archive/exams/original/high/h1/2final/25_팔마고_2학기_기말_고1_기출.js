window.examTitle = "25_팔마고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복수정답",
      "그래프"
    ],
    "wide": false,
    "content": "다음 중 함수의 그래프인 것을 모두 고르시오. [3.5점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q01.png",
    "choices": [],
    "answer": "①, ④",
    "solution": "[키포인트] 함수의 그래프는 하나의 $x$값에 두 개 이상의 $y$값이 대응하지 않아야 한다.\n조건 정리: 각 그림에 수직선을 그었을 때 그래프와 만나는 점의 개수를 확인한다.\n풀이 방향: 수직선 판정법으로 ①~⑤를 각각 판단한다.\n정석 풀이: ①은 각 $x$값에 하나의 $y$값만 대응하므로 함수의 그래프이다. ②는 한 수직선과 여러 점에서 만나므로 함수의 그래프가 아니다. ③도 $x\\gt 0$인 곳에서 하나의 $x$값에 두 개의 $y$값이 대응하므로 함수의 그래프가 아니다. ④는 열린 점과 닫힌 점이 구분되어 각 $x$값에 정확히 하나의 $y$값만 대응하므로 함수의 그래프이다. ⑤는 같은 $x$좌표를 갖는 두 점이 있으므로 함수의 그래프가 아니다.\n따라서 정답은 ①, ④이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "대응도",
      "도형"
    ],
    "wide": false,
    "content": "아래 그림과 같은 함수 $f$, $g$에 대하여 $(f\\circ g)(2)$의 값을 구하시오. [3.5점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q02.png",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "[키포인트] 합성함수 $(f\\circ g)(2)$는 먼저 $g$를 적용한 뒤 $f$를 적용한다.\n조건 정리: 대응도에서 $g(2)=2$이고, $f(2)=4$이다.\n풀이 방향: $2\\xrightarrow{g}2\\xrightarrow{f}4$의 순서로 값을 읽는다.\n정석 풀이: $(f\\circ g)(2)=f(g(2))=f(2)=4$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "역함수와 함수값",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "함수값",
      "대응도",
      "도형"
    ],
    "wide": false,
    "content": "아래 그림과 같은 함수 $f$, $g$에 대하여 $f^{-1}(4)+g(4)$의 값을 구하시오. [3.5점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q03.png",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "[키포인트] $f^{-1}(4)$는 $f$에 의하여 $4$로 대응되는 원소를 찾는 것이다.\n조건 정리: 대응도에서 $f(2)=4$이고, $g(4)=3$이다.\n풀이 방향: 역함수의 값과 함수값을 각각 구한 뒤 더한다.\n정석 풀이: $f(2)=4$이므로 $f^{-1}(4)=2$이다. 또 $g(4)=3$이므로 $f^{-1}(4)+g(4)=2+3=5$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "유리함수의 그래프",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "그래프",
      "사분면"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{5}{3-x}-2$의 그래프가 지나는 사분면은? [3.7점]",
    "choices": [
      "제1, 2, 3사분면",
      "제1, 2, 4사분면",
      "제1, 3, 4사분면",
      "제2, 3, 4사분면",
      "제1, 2, 3, 4사분면"
    ],
    "answer": "③",
    "solution": "[키포인트] 식을 평행이동형으로 바꾸고 $x$의 구간에 따라 $y$의 부호를 판단한다.\n조건 정리: $y=-\\dfrac{5}{x-3}-2$이고 점근선은 $x=3$, $y=-2$이다.\n풀이 방향: $x\\lt 0$, $0\\lt x\\lt 3$, $x\\gt 3$에서 그래프의 위치를 확인한다.\n정석 풀이: $x\\lt 0$이면 $3-x\\gt 3$이므로 $0\\lt \\dfrac{5}{3-x}\\lt \\dfrac53$이고 $y\\lt 0$이어서 제3사분면을 지난다. $0\\lt x\\lt 3$에서는 $x=\\dfrac12$일 때 $y=0$이며, $0\\lt x\\lt \\dfrac12$에서는 $y\\lt 0$이므로 제4사분면, $\\dfrac12\\lt x\\lt 3$에서는 $y\\gt 0$이므로 제1사분면을 지난다. $x\\gt 3$에서는 $\\dfrac{5}{3-x}\\lt 0$이므로 $y\\lt -2$여서 제4사분면을 지난다. 제2사분면은 지나지 않는다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "평행이동"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\sqrt{a+bx}+c$의 그래프가 다음 그림과 같을 때, $f(-12)$의 값을 구하면? [3.7점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q05.png",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$2+\\sqrt5$",
      "$4+\\sqrt2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 무리함수 그래프의 끝점과 $y$절편을 이용하면 $a$, $b$, $c$를 결정할 수 있다.\n조건 정리: 그래프의 끝점은 $(4,2)$이고 $y$절편은 $(0,4)$이다.\n풀이 방향: 끝점 조건으로 $c$와 $a+4b$를 구하고, $y$절편 조건으로 $a$를 구한다.\n정석 풀이: 끝점에서 루트 안의 값이 $0$이므로 $a+4b=0$이고, 끝점의 $y$좌표가 $2$이므로 $c=2$이다. 또 $f(0)=\\sqrt a+2=4$이므로 $a=4$이다. 따라서 $b=-1$이고 $f(x)=\\sqrt{4-x}+2$이다. 그러므로 $f(-12)=\\sqrt{16}+2=6$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "유리함수와 역함수",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "점근선",
      "역함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{4x+5}{x+1}$의 그래프의 점근선이 두 직선 $x=a$, $y=b$일 때, $f^{-1}(a+b)$의 값은? [3.7점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 유리함수의 수직점근선과 수평점근선을 먼저 구한 뒤 역함수의 값을 방정식으로 구한다.\n조건 정리: 분모가 $0$이 되는 값은 $x=-1$이고, 최고차항의 계수비는 $4$이다.\n풀이 방향: $a+b$를 구한 뒤 $f(x)=a+b$를 푼다.\n정석 풀이: 점근선은 $x=-1$, $y=4$이므로 $a+b=3$이다. $f^{-1}(3)$은 $f(x)=3$을 만족시키는 $x$이므로 $\\dfrac{4x+5}{x+1}=3$을 푼다. $4x+5=3x+3$에서 $x=-2$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "유리함수의 최댓값",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "최댓값",
      "정의역"
    ],
    "wide": false,
    "content": "정의역이 $\\{x\\mid 0\\le x\\le4\\}$인 유리함수 $y=\\dfrac{4x+k}{x+1}$의 최댓값이 $3$일 때, 실수 $k$의 값은? [4점]",
    "choices": [
      "$-5$",
      "$-3$",
      "$-1$",
      "$1$",
      "$3$"
    ],
    "answer": "③",
    "solution": "[키포인트] 식을 $4+\\dfrac{k-4}{x+1}$로 바꾸면 정의역에서의 증감 방향을 쉽게 판단할 수 있다.\n조건 정리: 최댓값이 $3\\lt 4$이므로 $k-4\\lt 0$이어야 한다.\n풀이 방향: $k\\lt 4$일 때 함수가 증가함을 확인하고 오른쪽 끝점의 함수값을 $3$으로 둔다.\n정석 풀이: $y=4+\\dfrac{k-4}{x+1}$이다. $k\\lt 4$이면 $k-4\\lt 0$이고, $x$가 증가할수록 $x+1$이 커져 음수인 분수의 절댓값이 작아지므로 함수값은 증가한다. 따라서 최댓값은 $x=4$에서이고 $\\dfrac{16+k}{5}=3$이다. 그러므로 $k=-1$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
    "level": "하",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=x+2$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$로 정의할 때, $f^{10}(2)$의 값을 구하시오. (단, $n$은 자연수이다.) [4점]",
    "choices": [
      "$10$",
      "$12$",
      "$20$",
      "$22$",
      "$30$"
    ],
    "answer": "④",
    "solution": "[키포인트] 한 번 합성할 때마다 입력값에 $2$가 더해진다.\n조건 정리: $f(x)=x+2$이므로 $f^n(x)=x+2n$이다.\n풀이 방향: 반복합성의 규칙을 찾은 뒤 $n=10$, $x=2$를 대입한다.\n정석 풀이: $f^2(x)=x+4$, $f^3(x)=x+6$이므로 일반적으로 $f^n(x)=x+2n$이다. 따라서 $f^{10}(2)=2+20=22$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "함수의 성질",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "함수방정식"
    ],
    "wide": false,
    "content": "임의의 실수 $x$, $y$에 대하여 함수 $f$가 $f(x+y)=f(x)+f(y)$를 만족시키고 $f(2)=4$일 때, $f(5)$의 값을 구하시오. [4점]",
    "choices": [
      "$10$",
      "$20$",
      "$30$",
      "$40$",
      "$50$"
    ],
    "answer": "①",
    "solution": "[키포인트] 주어진 식에서 자연수 입력에 대한 함수값은 덧셈으로 반복해서 구할 수 있다.\n조건 정리: $f(2)=f(1+1)=2f(1)=4$이다.\n풀이 방향: 먼저 $f(1)$을 구한 뒤 $f(5)$를 계산한다.\n정석 풀이: $2f(1)=4$이므로 $f(1)=2$이다. 따라서 $f(5)=f(1+1+1+1+1)=5f(1)=10$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "항등식"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역으로 하는 두 함수 $f(x)=x+k$, $g(x)=kx+1$에 대하여 $g\\circ f=f\\circ g$가 성립하도록 하는 상수 $k$의 값을 구하시오. (단, $k\\ne0$) [4.3점]",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 합성함수를 각각 계산하여 상수항을 비교한다.\n조건 정리: $(g\\circ f)(x)=k(x+k)+1$, $(f\\circ g)(x)=kx+1+k$이다.\n풀이 방향: 두 식이 모든 실수 $x$에서 같도록 상수항을 비교한다.\n정석 풀이: $kx+k^2+1=kx+k+1$이므로 $k^2=k$이다. 따라서 $k(k-1)=0$이고, $k\\ne0$이므로 $k=1$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 11,
    "level": "상",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점",
      "이차방정식"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^2-6x+a\\ (x\\ge3)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프가 접하도록 하는 실수 $a$의 값을 구하시오. [4.3점]",
    "choices": [
      "$\\dfrac52$",
      "$\\dfrac72$",
      "$9$",
      "$\\dfrac{25}{4}$",
      "$\\dfrac{49}{4}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 함수와 역함수의 그래프는 직선 $y=x$에 대하여 대칭이므로 접점은 $y=x$ 위에 있다.\n조건 정리: 접점의 $x$좌표는 방정식 $f(x)=x$의 중근이다.\n풀이 방향: $f(x)=x$를 이차방정식으로 만들고 판별식을 $0$으로 둔다.\n정석 풀이: $x^2-6x+a=x$이므로 $x^2-7x+a=0$이다. 두 그래프가 접하려면 이 방정식이 중근을 가져야 하므로 판별식이 $49-4a=0$이다. 따라서 $a=\\dfrac{49}{4}$이다. 중근은 $x=\\dfrac72\\ge3$이므로 정의역 조건도 만족한다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "무리식의 부등식 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명",
      "무리식"
    ],
    "wide": false,
    "content": "다음은 $a\\gt b\\gt 0$일 때, 부등식 $\\sqrt{a-b}\\gt \\sqrt a-\\sqrt b$가 성립함을 증명하는 과정이다. [4.3점]<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">$\\sqrt{a-b}\\gt 0$, $\\sqrt a-\\sqrt b\\gt 0$이므로<br>$(\\sqrt{a-b})^2-(\\sqrt a-\\sqrt b)^2=$ (가) $-2b=2\\sqrt b\\,$(나)$\\gt 0$<br>따라서 $(\\sqrt{a-b})^2\\gt (\\sqrt a-\\sqrt b)^2$이므로<br>$\\sqrt{a-b}\\gt \\sqrt a-\\sqrt b$가 성립한다.</div><br>위의 과정에서 (가), (나)에 알맞은 것을 차례로 나열한 것은?",
    "choices": [
      "$\\sqrt{ab},\\ \\sqrt a+\\sqrt b$",
      "$\\sqrt{ab},\\ \\sqrt a-\\sqrt b$",
      "$2\\sqrt{ab},\\ \\sqrt a-\\sqrt b$",
      "$2\\sqrt{ab},\\ a-b$",
      "$2\\sqrt{ab},\\ \\sqrt a+\\sqrt b$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 양수의 크기는 제곱의 차를 계산하여 비교할 수 있다.\n조건 정리: $a\\gt b\\gt 0$이므로 비교하는 두 식은 모두 양수이다.\n풀이 방향: 두 식의 제곱의 차를 전개하여 양수의 곱으로 나타낸다.\n정석 풀이: $(\\sqrt{a-b})^2-(\\sqrt a-\\sqrt b)^2=(a-b)-(a+b-2\\sqrt{ab})=2\\sqrt{ab}-2b=2\\sqrt b(\\sqrt a-\\sqrt b)$이다. 따라서 (가)는 $2\\sqrt{ab}$이고, (나)는 $\\sqrt a-\\sqrt b$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "산술평균과 기하평균",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "부등식",
      "산술평균",
      "기하평균",
      "최솟값"
    ],
    "wide": false,
    "content": "$x\\gt 0$, $y\\gt 0$일 때, $(x+y)\\left(\\dfrac4x+\\dfrac9y\\right)$의 최솟값을 구하시오. [4.5점]",
    "choices": [
      "$21$",
      "$22$",
      "$23$",
      "$24$",
      "$25$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 식을 전개한 뒤 양수인 두 항에 산술평균과 기하평균의 관계를 적용한다.\n조건 정리: $(x+y)\\left(\\dfrac4x+\\dfrac9y\\right)=13+\\dfrac{4y}{x}+\\dfrac{9x}{y}$이다.\n풀이 방향: $\\dfrac{4y}{x}$와 $\\dfrac{9x}{y}$의 합의 최솟값을 구한다.\n정석 풀이: $x,y\\gt 0$이므로 $\\dfrac{4y}{x}+\\dfrac{9x}{y}\\ge2\\sqrt{\\dfrac{4y}{x}\\cdot\\dfrac{9x}{y}}=12$이다. 등호는 $\\dfrac{4y}{x}=\\dfrac{9x}{y}$, 즉 $2y=3x$일 때 성립한다. 따라서 전체 식의 최솟값은 $13+12=25$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "보기"
    ],
    "wide": false,
    "content": "정의역이 $\\{x\\mid x\\ne0\\}$인 실수의 집합이고, 공역이 $\\{y\\mid y\\ne0\\}$인 실수의 집합인 함수 $f(x)=\\dfrac1x$에 대한 설명 중 <보기>에서 옳은 것만을 있는 대로 고른 것은? [4.5점]<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">ㄱ. 함수 $f(x)$의 역함수는 존재한다.<br>ㄴ. 그래프 $y=f(x)$는 제1사분면과 제2사분면을 지난다.<br>ㄷ. 두 그래프 $y=f(x)$, $y=f^{-1}(x)$의 교점의 개수는 방정식 $f(x)=x$의 서로 다른 실근의 개수와 같다.</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "[키포인트] $f(x)=\\dfrac1x$는 자기 자신이 역함수이지만, 두 그래프가 일치한다는 점을 주의한다.\n조건 정리: $f(f(x))=x$이고 그래프는 제1사분면과 제3사분면을 지난다.\n풀이 방향: ㄱ~ㄷ을 각각 판단한다.\n정석 풀이: $f$는 일대일대응이고 $f^{-1}(x)=\\dfrac1x$이므로 ㄱ은 참이다. 그래프는 제1사분면과 제3사분면을 지나므로 ㄴ은 거짓이다. $f=f^{-1}$이므로 두 그래프는 완전히 일치하여 교점이 무수히 많지만, $f(x)=x$는 $\\dfrac1x=x$, 즉 $x=\\pm1$의 두 실근만 가지므로 ㄷ은 거짓이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "역함수와 합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "합성함수",
      "항등함수",
      "유리함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{3x+1}{x+a}$가 $(f\\circ f)(x)=x$를 만족시킬 때, $f^{-1}(13)$의 값을 구하면? [4.5점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "[키포인트] $(f\\circ f)(x)=x$이면 $f$는 자기 자신의 역함수이다.\n조건 정리: 합성함수를 직접 계산하여 모든 $x$에서 항등함수가 되도록 $a$를 정한다.\n풀이 방향: 분자와 분모를 정리한 뒤 항등식의 계수를 비교한다.\n정석 풀이: $f(f(x))=\\dfrac{10x+a+3}{(a+3)x+a^2+1}$이다. 이것이 모든 $x$에서 $x$와 같으므로 $10x+a+3=(a+3)x^2+(a^2+1)x$이다. 따라서 $a+3=0$이고 $a=-3$이다. 이때 $a^2+1=10$도 만족한다. $f^{-1}=f$이므로 $f^{-1}(13)=f(13)=\\dfrac{40}{10}=4$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "일대일대응의 개수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "경우의수",
      "조건"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4,5\\}$에 대하여 다음 <조건>을 만족시키는 함수 $f:X\\to X$의 개수를 구하시오. [4.8점]<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">ㄱ. $x_1\\in X$, $x_2\\in X$인 임의의 $x_1$, $x_2$에 대하여 $3\\le x_1\\lt x_2\\le5$이면 $f(x_1)\\gt f(x_2)$이다.<br>ㄴ. 함수 $f$의 역함수가 존재한다.</div>",
    "choices": [
      "$10$",
      "$20$",
      "$40$",
      "$120$",
      "$240$"
    ],
    "answer": "②",
    "solution": "[키포인트] 역함수가 존재하려면 $f$는 집합 $X$에서 자기 자신으로의 일대일대응이어야 한다.\n조건 정리: $f(3)\\gt f(4)\\gt f(5)$이므로 세 함수값은 서로 다른 세 원소를 내림차순으로 가져야 한다.\n풀이 방향: $f(3),f(4),f(5)$에 사용할 세 값을 고른 뒤 남은 두 값을 $f(1),f(2)$에 배치한다.\n정석 풀이: $X$의 다섯 원소 중 세 원소를 고르면 그 세 값의 내림차순 배치는 하나로 정해지므로 경우의 수는 $\\binom53=10$이다. 남은 두 값은 $f(1)$, $f(2)$에 서로 다르게 배치해야 하므로 $2!=2$가지이다. 따라서 전체 함수의 개수는 $10\\times2=20$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "역함수가 존재하는 조각함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조각함수",
      "역함수",
      "일대일대응",
      "최솟값"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+c&(x\\lt b)\\\\ ax^2-2ax-3&(x\\ge b)\\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 하자. $b=t$일 때, $a+c$의 값을 구하시오. (단, $a,b,c,t$는 모두 실수이다.) [4.8점]",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "[키포인트] 전체 함수가 일대일대응이 되려면 두 조각의 치역이 겹치지 않고 실수 전체를 정확히 나누어야 한다.\n조건 정리: 첫째 조각의 치역은 $(-\\infty,b+c)$이다. 둘째 조각은 $[b,\\infty)$에서 증가하며 치역이 $[b+c,\\infty)$가 되어야 한다.\n풀이 방향: 이차함수의 증가 조건으로 $b$의 최솟값을 구하고 경계 함수값을 맞춘다.\n정석 풀이: 둘째 조각 $ax^2-2ax-3=a(x-1)^2-a-3$이 $[b,\\infty)$에서 증가하면서 위로 무한히 커져야 하므로 $a\\gt 0$이고 $b\\ge1$이어야 한다. 따라서 $b$의 최솟값은 $t=1$이다. $b=1$일 때 두 치역이 빈틈없이 이어지려면 둘째 조각의 시작값이 $1+c$와 같아야 한다. 즉 $a-2a-3=1+c$이므로 $-a-3=1+c$이고 $a+c=-4$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "무리함수 그래프와 도형의 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 무리함수 $f(x)=\\sqrt x+2$, $g(x)=\\sqrt{x-3}$의 그래프와 직선 $2x+3y-20=0$이 각각 점 $A(4,4)$와 $B(7,2)$에서 만난다. 그림과 같이 함수 $f(x)$, $g(x)$의 그래프와 직선 $2x+3y-20=0$, $x$축, $y$축으로 둘러싸인 부분의 넓이는? [5.2점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q18.png",
    "choices": [
      "$15$",
      "$16$",
      "$17$",
      "$18$",
      "$19$"
    ],
    "answer": "③",
    "solution": "[키포인트] $g$의 그래프는 $f$의 그래프를 오른쪽으로 $3$, 아래로 $2$만큼 평행이동한 그래프이다.\n조건 정리: $P=(0,2)$를 $Q=(3,0)$으로, $A=(4,4)$를 $B=(7,2)$로 옮기는 평행이동 벡터는 $(3,-2)$이다.\n풀이 방향: 두 평행한 곡선 사이의 곡선 띠 영역을 같은 두 벡터로 만든 평행사변형의 넓이로 보고, 좌표축으로 생기는 삼각형 넓이를 더한다.\n정석 풀이: 곡선 $PA$와 그 평행이동인 곡선 $QB$ 사이에서 선분 $AB$, $PQ$로 둘러싸인 부분은 평행이동에 따른 잘라 붙이기로 변 $\\overrightarrow{PA}=(4,2)$, $\\overrightarrow{PQ}=(3,-2)$인 평행사변형과 같은 넓이를 갖는다. 그 넓이는 $|4\\cdot(-2)-2\\cdot3|=14$이다. 실제 그림의 아래쪽 경계는 선분 $PQ$가 아니라 $P\\to O\\to Q$이므로 직각삼각형 $POQ$의 넓이 $\\dfrac12\\cdot2\\cdot3=3$을 더해야 한다. 따라서 전체 넓이는 $14+3=17$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "합성함수와 이차함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "이차함수",
      "그래프"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같은 이차함수 $y=f(x)$에 대하여 방정식 $(f\\circ f)(x)=0$의 서로 다른 모든 실근의 합을 구하시오. [5.2점]",
    "image": "assets/images/25_팔마고_2학기_기말_고1_기출/q19.png",
    "choices": [
      "$-2$",
      "$-\\dfrac32$",
      "$-1$",
      "$-\\dfrac12$",
      "$1$"
    ],
    "answer": "①",
    "solution": "[키포인트] 그래프에서 이차함수의 두 근과 $y$절편을 읽어 식을 정한 뒤 $f(x)$가 각 근이 되는 경우를 나눈다.\n조건 정리: 그래프의 근은 $-2$, $1$이고 $f(0)=-2$이므로 $f(x)=(x+2)(x-1)=x^2+x-2$이다.\n풀이 방향: $f(f(x))=0$이므로 $f(x)=-2$ 또는 $f(x)=1$을 각각 푼다.\n정석 풀이: $f(x)=-2$이면 $x^2+x-2=-2$이므로 $x(x+1)=0$에서 $x=0,-1$이다. $f(x)=1$이면 $x^2+x-3=0$이고 이 두 근의 합은 $-1$이다. 네 근은 서로 다르므로 전체 합은 $0+(-1)+(-1)=-2$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "일대일대응",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수",
      "일대일대응",
      "이차함수"
    ],
    "wide": false,
    "content": "[서술형 1] 집합 $X=\\{x\\mid x\\le k\\}$에 대하여 $X$에서 $X$로의 함수 $f(x)=-x^2+4x$가 일대일대응이 되도록 하는 실수 $k$의 값을 풀이 과정과 함께 서술하시오. [4점]",
    "choices": [],
    "answer": "$0$",
    "solution": "[키포인트] 이차함수를 제한된 정의역에서 일대일로 만들고, 그 치역이 다시 $X$와 같아야 한다.\n조건 정리: $f(x)=-(x-2)^2+4$는 $x\\le2$에서 증가한다.\n풀이 방향: 일대일 조건과 치역 조건을 차례로 적용한다.\n정석 풀이: 정의역 $(-\\infty,k]$에서 함수가 일대일이 되려면 꼭짓점의 왼쪽만 사용해야 하므로 $k\\le2$이다. 이때 함수는 증가하고 $x\\to-\\infty$이면 $f(x)\\to-\\infty$이므로 치역은 $(-\\infty,f(k)]$이다. 공역 $X=(-\\infty,k]$와 같으려면 $f(k)=k$이어야 한다. 따라서 $-k^2+4k=k$, 즉 $k(k-3)=0$이므로 $k=0$ 또는 $3$이다. 이 중 $k\\le2$를 만족하는 값은 $k=0$이다.\n따라서 구하는 값은 $0$이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "유리함수의 활용",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "유리함수",
      "평균속력",
      "최댓값",
      "최솟값"
    ],
    "wide": false,
    "content": "[서술형 2] 자동차가 $A$에서 지점 $B$까지 평균 $100\\text{ km/h}$의 속력으로 $12$분 동안 달리고, 지점 $B$에서 $C$까지 $x$시간 동안 평균 $70\\text{ km/h}$의 속력으로 달렸다고 한다. 지점 $A$에서 $C$까지의 평균 속력을 $y\\text{ km/h}$라고 할 때, 다음 물음을 풀이 과정과 함께 서술하시오. (단, $x\\gt 0$) [총 5점]<br><br>(1) $x$와 $y$ 사이의 관계식을 구하시오. [3점]<br>(2) $0.8\\le x\\le5.8$일 때, 평균 속력 $y$의 최댓값과 최솟값을 구하시오. [2점]",
    "choices": [],
    "answer": "(1) $y=\\dfrac{70x+20}{x+\\dfrac15}$ (2) 최댓값 $76$, 최솟값 $71$",
    "solution": "[키포인트] 평균 속력은 전체 이동 거리를 전체 이동 시간으로 나눈 값이다.\n조건 정리: 첫 구간의 시간은 $12$분 $=\\dfrac15$시간이고 이동 거리는 $100\\times\\dfrac15=20$ km이다. 둘째 구간의 이동 거리는 $70x$ km이다.\n풀이 방향: 전체 거리와 전체 시간을 이용해 관계식을 만들고, 유리함수의 증감을 이용해 구간의 양 끝값을 비교한다.\n정석 풀이: (1) 전체 거리는 $20+70x$, 전체 시간은 $x+\\dfrac15$이므로 $y=\\dfrac{70x+20}{x+\\dfrac15}$이다. 이를 $y=70+\\dfrac{6}{x+\\dfrac15}$로 나타낼 수 있다. (2) $x\\gt 0$에서 $x$가 증가하면 분모 $x+\\dfrac15$이 증가하므로 $\\dfrac{6}{x+\\dfrac15}$은 감소한다. 따라서 $0.8\\le x\\le5.8$에서 최댓값은 $x=0.8$일 때 $70+\\dfrac61=76$, 최솟값은 $x=5.8$일 때 $70+\\dfrac66=71$이다.\n따라서 관계식은 $y=\\dfrac{70x+20}{x+\\dfrac15}$이고, 최댓값은 $76$, 최솟값은 $71$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "역함수와 합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "역함수",
      "합성함수",
      "일차함수"
    ],
    "wide": false,
    "content": "[서술형 3] 두 함수 $f(x)=\\dfrac12x-\\dfrac12$, $g(x)=4x+7$에 대하여 다음 물음에 답하시오. [총 5점]<br><br>(1) $f(x)$의 역함수 $f^{-1}(x)$를 구하시오. [2점]<br>(2) $f^{-1}\\circ h=g$를 만족하는 $x$에 대한 일차함수 $h(x)$를 풀이 과정과 함께 서술하시오. [3점]",
    "choices": [],
    "answer": "(1) $f^{-1}(x)=2x+1$ (2) $h(x)=2x+3$",
    "solution": "[키포인트] 역함수를 먼저 구한 뒤 합성식에 미지의 일차함수를 대입한다.\n조건 정리: $y=\\dfrac12x-\\dfrac12$에서 $x$와 $y$를 바꾸어 역함수를 구할 수 있다.\n풀이 방향: (1) 역함수를 구하고, (2) $h(x)=ax+b$로 두어 계수를 비교한다.\n정석 풀이: (1) $y=\\dfrac12x-\\dfrac12$에서 $2y=x-1$이므로 $x=2y+1$이다. 따라서 $f^{-1}(x)=2x+1$이다. (2) $h(x)=ax+b$라 두면 $(f^{-1}\\circ h)(x)=2(ax+b)+1=2ax+2b+1$이다. 이것이 $g(x)=4x+7$과 같으므로 $2a=4$, $2b+1=7$이다. 따라서 $a=2$, $b=3$이고 $h(x)=2x+3$이다.\n따라서 $f^{-1}(x)=2x+1$, $h(x)=2x+3$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "직선",
      "교점",
      "범위"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{2-3x}$의 그래프와 직선 $y=-\\dfrac12x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 값의 범위를 풀이 과정과 함께 서술하시오. [6점]",
    "choices": [],
    "answer": "$\\dfrac13\\le k\\lt \\dfrac{11}{6}$",
    "solution": "[키포인트] 교점의 $y$좌표를 미지수로 두면 제곱 과정에서 생기는 부호 조건을 자연스럽게 처리할 수 있다.\n조건 정리: 무리함수의 그래프 위에서는 $y\\ge0$이고 $x=\\dfrac{2-y^2}{3}$이다.\n풀이 방향: 이 값을 직선의 식에 대입하여 $y$에 대한 이차방정식을 만들고, 서로 다른 두 비음수 근을 갖는 조건을 구한다.\n정석 풀이: $y=-\\dfrac12\\cdot\\dfrac{2-y^2}{3}+k$이므로 $6y=y^2-2+6k$, 즉 $y^2-6y+6k-2=0$이다. 서로 다른 두 근을 가지려면 판별식이 양수여야 하므로 $36-4(6k-2)\\gt 0$, 따라서 $k\\lt \\dfrac{11}{6}$이다. 두 교점이 모두 무리함수의 그래프 위에 있으려면 두 근이 모두 $0$ 이상이어야 한다. 두 근의 합은 $6\\gt 0$이고 곱은 $6k-2$이므로 $6k-2\\ge0$, 즉 $k\\ge\\dfrac13$이다. $k=\\dfrac13$일 때 두 근은 $0$, $6$으로 서로 다르므로 포함된다.\n따라서 구하는 범위는 $\\dfrac13\\le k\\lt \\dfrac{11}{6}$이다."
  }
];
