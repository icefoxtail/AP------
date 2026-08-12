window.examTitle = "25_효천고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "명제와 조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제와 조건"
    ],
    "wide": false,
    "content": "다음 중 명제인 것은? [3.1점]",
    "choices": [
      "순천효천고등학교는 멋진 학교다.",
      "$12$는 $4$의 배수이다.",
      "$x\\gt 3$",
      "$7$은 행운의 숫자이다.",
      "$x$는 $3$보다 작은 수이다."
    ],
    "answer": "②",
    "solution": "[키포인트] 명제는 참과 거짓을 분명하게 판정할 수 있는 문장이다.\n조건 정리: 의견이나 주관이 들어간 문장과 변수의 값에 따라 참·거짓이 달라지는 조건은 명제가 아니다.\n풀이 방향: 각 문장이 하나의 확정된 진릿값을 갖는지 확인한다.\n정석 풀이: ①과 ④는 판단하는 사람에 따라 달라질 수 있는 주관적 문장이다. ③과 ⑤는 $x$의 값에 따라 참과 거짓이 달라지는 조건이다. ②의 '$12$는 $4$의 배수이다.'는 참으로 확정되는 문장이므로 명제이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 2,
    "level": "중",
    "category": "함수의 일치",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 일치"
    ],
    "wide": false,
    "content": "정의역이 $\\{0,2\\}$인 두 함수 $f(x)=ax+b$, $g(x)=x^2+1$에 대하여 $f=g$이다. 두 실수 $a$, $b$에 대하여 $a+b$의 값은? [3.1점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 함수가 같다는 것은 정의역의 모든 원소에서 함수값이 같다는 뜻이다.\n조건 정리: 정의역은 $\\{0,2\\}$이므로 $f(0)=g(0)$, $f(2)=g(2)$를 이용한다.\n풀이 방향: 두 입력값에서 얻은 연립방정식으로 $a$, $b$를 구한다.\n정석 풀이: $f(0)=b$, $g(0)=1$이므로 $b=1$이다. 또 $f(2)=2a+b$, $g(2)=5$이므로 $2a+1=5$에서 $a=2$이다. 따라서 $a+b=2+1=3$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 3,
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
      "합성함수"
    ],
    "wide": false,
    "content": "두 함수 $f(x)=2x-3$, $g(x)=-x+1$에 대하여 $(f\\circ g)(0)+(g\\circ f)(0)$의 값은? [3.2점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 합성함수는 안쪽 함수부터 계산한다.\n조건 정리: $(f\\circ g)(0)=f(g(0))$, $(g\\circ f)(0)=g(f(0))$이다.\n풀이 방향: 두 합성함수의 값을 각각 구한 뒤 더한다.\n정석 풀이: $g(0)=1$이므로 $(f\\circ g)(0)=f(1)=2-3=-1$이다. 또 $f(0)=-3$이므로 $(g\\circ f)(0)=g(-3)=3+1=4$이다. 따라서 합은 $-1+4=3$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "역함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=x-2a$에 대하여 $f(1)=-1$, $f^{-1}(3)=b$일 때, $a+b$의 값은? (단, $a$, $b$는 상수이다.) [3.4점]",
    "choices": [
      "$6$",
      "$5$",
      "$4$",
      "$3$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 먼저 $f(1)$로 $a$를 구하고, 역함수의 뜻을 이용해 $b$를 구한다.\n조건 정리: $f(x)=x-2a$이고 $f^{-1}(3)=b$는 $f(b)=3$과 같다.\n풀이 방향: 주어진 두 조건을 차례로 식으로 나타낸다.\n정석 풀이: $f(1)=1-2a=-1$이므로 $a=1$이다. 따라서 $f(x)=x-2$이고 $f^{-1}(x)=x+2$이다. 그러므로 $b=f^{-1}(3)=5$이고 $a+b=1+5=6$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "유리식의 계산",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리식의 계산"
    ],
    "wide": false,
    "content": "다음 식의 분모를 $0$으로 만들지 않는 모든 실수 $x$에 대하여 $\\dfrac{x+1}{x^2+x}\\times\\dfrac{x^2-9}{x-2}\\times\\dfrac{1}{x+3}$을 간단히 한 식은? [3.4점]",
    "choices": [
      "$\\dfrac{x-3}{x(x-2)}$",
      "$\\dfrac{1}{x}$",
      "$\\dfrac{x+1}{(x-2)(x+3)}$",
      "$\\dfrac{x-3}{x-2}$",
      "$\\dfrac{x-3}{(x+1)(x+2)}$"
    ],
    "answer": "①",
    "solution": "[키포인트] 각 다항식을 인수분해한 뒤 공통인수를 약분한다.\n조건 정리: $x^2+x=x(x+1)$, $x^2-9=(x-3)(x+3)$이다.\n풀이 방향: 인수분해한 식을 한 분수로 정리한다.\n정석 풀이: 주어진 식은 $\\dfrac{x+1}{x(x+1)}\\times\\dfrac{(x-3)(x+3)}{x-2}\\times\\dfrac1{x+3}$이다. 분모를 $0$으로 만들지 않는 범위에서 $x+1$, $x+3$을 약분하면 $\\dfrac{x-3}{x(x-2)}$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "명제와 진리집합",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제와 진리집합"
    ],
    "wide": false,
    "content": "전체집합 $U$에 대하여 세 조건 $p$, $q$, $r$의 진리집합을 각각 $P$, $Q$, $R$이라 하자.<br>$P\\cap R=P$, $P\\cup Q^C=Q^C$일 때, 다음 중 항상 참인 명제는? [3.5점]",
    "choices": [
      "$p\\to q$",
      "$\\sim q\\to p$",
      "$q\\to\\sim p$",
      "$r\\to p$",
      "$q\\to r$"
    ],
    "answer": "③",
    "solution": "[키포인트] 진리집합의 포함 관계를 명제의 포함 관계로 바꾼다.\n조건 정리: $P\\cap R=P$에서 $P\\subseteq R$이고, $P\\cup Q^C=Q^C$에서 $P\\subseteq Q^C$이다.\n풀이 방향: 항상 성립하는 포함 관계와 각 선택지를 비교한다.\n정석 풀이: $P\\subseteq Q^C$이므로 양변의 여집합 관계에서 $Q\\subseteq P^C$이다. 이는 $q$가 참이면 $p$가 거짓이라는 뜻이므로 $q\\to\\sim p$가 항상 참이다. 나머지 선택지는 주어진 포함 관계만으로 보장되지 않는다.\n따라서 정답은 ③이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "필요조건과 충분조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "필요조건과 충분조건"
    ],
    "wide": false,
    "content": "두 조건 $p$, $q$에 대하여 보기에서 $p$는 $q$이기 위한 필요조건이지만 충분조건이 아닌 것만을 있는 대로 고른 것은? (단, $a$, $b$, $c$는 실수이다.) [3.7점]<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">ㄱ. $p:a\\gt3$ &nbsp;&nbsp;&nbsp; $q:a\\gt7$<br>ㄴ. $p:x^2+y^2=0$인 실수 $x$, $y$ &nbsp;&nbsp;&nbsp; $q:x=0$, $y=0$<br>ㄷ. $p:ac=bc$ &nbsp;&nbsp;&nbsp; $q:a=b$</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "[키포인트] $p$가 $q$의 필요조건이면 $q\\to p$가 참이고, 충분조건이 아니면 $p\\to q$가 거짓인 경우가 있어야 한다.\n조건 정리: ㄱ~ㄷ에서 $q$가 성립할 때 $p$가 반드시 성립하는지와 그 역을 각각 확인한다.\n풀이 방향: 두 방향의 명제를 따로 판정한다.\n정석 풀이: ㄱ에서 $a\\gt7$이면 $a\\gt3$이지만, $a\\gt3$이라고 해서 항상 $a\\gt7$인 것은 아니므로 조건에 맞는다. ㄴ에서 실수 $x,y$에 대해 $x^2+y^2=0$과 $x=0,y=0$은 서로 동치이므로 필요충분조건이다. ㄷ에서 $a=b$이면 항상 $ac=bc$이지만, $c=0$이면 $ac=bc$이면서 $a\\ne b$일 수 있으므로 $p$는 필요조건이지만 충분조건이 아니다. 따라서 ㄱ, ㄷ이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
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
      "무리함수의 그래프"
    ],
    "wide": false,
    "content": "다음 중 무리함수 $y=-\\sqrt{-x+2}+4$에 대한 설명으로 옳지 않은 것은? [3.8점]",
    "choices": [
      "$x=2$일 때 최댓값 $4$를 갖는다.",
      "정의역은 $\\{x\\mid x\\le 2\\}$이다.",
      "치역은 $\\{y\\mid y\\le 4\\}$이다.",
      "그래프는 무리함수 $y=-\\sqrt{x+2}+4$의 그래프와 $y$축에 대하여 대칭이다.",
      "그래프는 모든 사분면을 지난다."
    ],
    "answer": "⑤",
    "solution": "[키포인트] 무리함수의 시작점, 정의역, 치역과 사분면을 확인한다.\n조건 정리: $y=-\\sqrt{-x+2}+4$의 시작점은 $(2,4)$이고 정의역은 $x\\le2$이다.\n풀이 방향: 각 설명을 그래프의 성질과 대조한다.\n정석 풀이: 시작점 $(2,4)$에서 최댓값 $4$를 가지므로 ①은 옳다. 정의역은 $x\\le2$, 치역은 $y\\le4$이므로 ②, ③도 옳다. $y=-\\sqrt{x+2}+4$의 그래프를 $y$축에 대하여 대칭이동하면 주어진 그래프가 되므로 ④도 옳다. 주어진 그래프는 제1, 제2, 제3사분면은 지나지만 제4사분면은 지나지 않으므로 ⑤가 옳지 않다.\n따라서 정답은 ⑤이다."
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
      "함수의 성질"
    ],
    "wide": false,
    "content": "임의의 두 정수 $a$, $b$에 대하여 함수 $f$가<br>$f(a+b)=f(a)+f(b)+3ab$를 만족시킬 때, $f(-4)+f(-2)+f(0)+f(2)+f(4)$의 값을 구하시오. [3.8점]",
    "choices": [
      "$48$",
      "$52$",
      "$56$",
      "$60$",
      "$64$"
    ],
    "answer": "④",
    "solution": "[키포인트] $a$와 $-a$를 함께 대입하면 함수값의 대칭합을 바로 구할 수 있다.\n조건 정리: $b=0$을 대입하면 $f(0)=0$이고, $b=-a$를 대입하면 $f(a)+f(-a)=3a^2$이다.\n풀이 방향: $a=4$, $a=2$에서 대칭합을 각각 구한다.\n정석 풀이: $f(0)=f(0)+f(0)$이므로 $f(0)=0$이다. 또 $0=f(a)+f(-a)-3a^2$이므로 $f(a)+f(-a)=3a^2$이다. 따라서 $f(4)+f(-4)=3\\cdot16=48$, $f(2)+f(-2)=3\\cdot4=12$이다. 구하는 합은 $48+12+0=60$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "함수의 반복 합성",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 반복 합성"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4,5,6\\}$에 대하여 함수 $f:X\\to X$가 $f(x)=$ ($x^2$을 $7$로 나누었을 때의 나머지)일 때, $f^7(3)$의 값은? [3.9점]<br>(단, $f^1=f$, $f^2=f\\circ f$, $\\cdots$, $f^{n+1}=f\\circ f^n$, $n$은 자연수)",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "[키포인트] 함수값을 차례로 계산하여 반복되는 순환을 찾는다.\n조건 정리: $f(x)$는 $x^2$을 $7$로 나눈 나머지이다.\n풀이 방향: $3$에서 시작하여 함수값을 반복해서 구한다.\n정석 풀이: $f(3)=9$를 $7$로 나눈 나머지이므로 $2$이다. $f(2)=4$이고, $f(4)=16$을 $7$로 나눈 나머지이므로 다시 $2$이다. 따라서 $2\\to4\\to2$의 주기 $2$인 순환이 생긴다. $f^1(3)=2$이고 홀수 번째 반복값은 $2$이므로 $f^7(3)=2$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "무리함수와 역함수",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수와 역함수"
    ],
    "wide": false,
    "content": "두 상수 $a$, $b$와 무리함수 $f(x)=\\sqrt{2x+a}+b$의 최솟값이 $2$이고, $y=f(x)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프의 교점의 $x$의 좌표가 $3$일 때, $f\\left(\\dfrac{9}{2}\\right)$의 값은? [4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "[키포인트] 무리함수의 최솟값으로 수직이동량을 정하고, 역함수와의 교점은 $y=x$ 위에서 찾는다.\n조건 정리: $f(x)=\\sqrt{2x+a}+b$의 최솟값은 $b$이므로 $b=2$이다.\n풀이 방향: 교점의 $x$좌표가 $3$이라는 조건에서 $f(3)=3$을 이용한다.\n정석 풀이: 함수 $f$는 증가함수이므로 그 그래프와 역함수의 그래프가 만나는 점은 직선 $y=x$ 위에 있다. 따라서 $f(3)=3$이고 $\\sqrt{6+a}+2=3$이다. 그러므로 $a=-5$이다. 따라서 $f\\left(\\dfrac92\\right)=\\sqrt{9-5}+2=4$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 12,
    "level": "상",
    "category": "유리함수의 대칭",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수의 대칭"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{3x+5}{x-a}$의 그래프가 두 직선 $y=x+5$, $y=-x+\\dfrac{1}{2}b$에 대하여 모두 대칭일 때, $ab$의 값을 구하면? (단, $a$, $b$는 상수이다.) [4.1점]",
    "choices": [
      "$4$",
      "$3$",
      "$0$",
      "$-3$",
      "$-4$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 유리함수를 평행이동형으로 나타내면 그래프의 중심과 두 대칭축을 알 수 있다.\n조건 정리: $y=\\dfrac{3x+5}{x-a}=3+\\dfrac{3a+5}{x-a}$이므로 그래프의 중심은 $(a,3)$이다.\n풀이 방향: 중심을 지나는 기울기 $1$, $-1$인 대칭축을 주어진 두 직선과 비교한다.\n정석 풀이: 두 대칭축은 $y-3=x-a$, $y-3=-(x-a)$이다. 첫째 식은 $y=x+(3-a)$이므로 $3-a=5$에서 $a=-2$이다. 둘째 식은 $y=-x+(a+3)$이므로 $a+3=1$이고, 주어진 식 $y=-x+\\dfrac12b$와 비교하면 $\\dfrac12b=1$, 즉 $b=2$이다. 따라서 $ab=-2\\cdot2=-4$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 13,
    "level": "상",
    "category": "유리함수와 무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수와 무리함수의 그래프",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{a}{x+b}+c$의 그래프가 다음 그림과 같다.<br>무리함수 $y=-\\sqrt{a(x-b)}+c$의 그래프가 제 $3$사분면을 지나지 않도록 하는 실수 $a$, $b$, $c$에 대하여 $a+b+c$의 최댓값은? [4.3점]",
    "image": "assets/images/25_효천고_2학기_기말_고1_기출/q13.png",
    "choices": [
      "$1$",
      "$3$",
      "$5$",
      "$7$",
      "$9$"
    ],
    "answer": "③",
    "solution": "[키포인트] 유리함수 그래프의 점근선으로 $b$, $c$를 구하고, 무리함수가 제3사분면에 들어가지 않는 조건을 찾는다.\n조건 정리: 유리함수의 중심이 $(1,2)$이므로 $-b=1$, $c=2$이고, 그림의 가지 방향에서 $a\\gt0$이다.\n풀이 방향: 무리함수의 $x$절편이 음수가 되지 않도록 $a$의 범위를 정한다.\n정석 풀이: $b=-1$, $c=2$이므로 무리함수는 $y=-\\sqrt{a(x+1)}+2$이다. $y=0$일 때 $a(x+1)=4$이므로 $x=\\dfrac4a-1$이다. 이 $x$절편이 음수이면 음의 $x$에서 $y\\lt0$인 부분이 생겨 제3사분면을 지난다. 따라서 $\\dfrac4a-1\\ge0$, 즉 $0\\lt a\\le4$이다. 그러므로 $a+b+c=a-1+2=a+1$의 최댓값은 $5$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "필요충분조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "필요충분조건"
    ],
    "wide": false,
    "content": "두 조건 $p$, $q$에 대하여 조건 $q$가<br>$q:(a-1)(b-1)(c-1)\\lt0$<br>일 때, $N(p)$를 다음과 같이 정의하자.<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">$p$가 $q$이기 위한 충분조건이지만 필요조건이 아니면 $N(p)=0$<br>$p$가 $q$이기 위한 필요조건이지만 충분조건이 아니면 $N(p)=1$<br>$p$가 $q$이기 위한 필요충분조건이면 $N(p)=3$<br>$p$가 $q$이기 위한 필요조건도 충분조건도 아니면 $N(p)=4$</div><br>세 조건 $p_1$, $p_2$, $p_3$가<br>$p_1:a,b,c$ 중 적어도 하나는 $1$보다 크다.<br>$p_2:a,b,c$ 중 적어도 하나는 $1$보다 작다.<br>$p_3:a,b,c$ 모두 $1$보다 작다.<br>일 때, $N(p_1)+N(p_2)+N(p_3)$의 값은? (단, $a$, $b$, $c$는 실수이다.) [4.4점]",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$8$",
      "$0$"
    ],
    "answer": "②",
    "solution": "[키포인트] 곱이 음수라는 조건을 각 $p_i$와 비교하여 충분성·필요성을 판정한다.\n조건 정리: $q$가 참이면 세 인수 중 음수인 인수의 개수는 홀수이므로, $1$보다 작은 수가 정확히 하나이거나 세 개이다.\n풀이 방향: 각 $p_i\\to q$와 $q\\to p_i$의 참·거짓을 확인한다.\n정석 풀이: $p_1$은 적어도 하나가 $1$보다 크다는 조건이다. 이는 $q$를 보장하지 않고, 세 수가 모두 $1$보다 작아도 $q$가 참이므로 필요조건도 아니다. 따라서 $N(p_1)=4$이다. $q$가 참이면 적어도 하나는 $1$보다 작으므로 $p_2$는 필요조건이지만, $p_2$만으로 $q$가 보장되지는 않아 $N(p_2)=1$이다. 세 수가 모두 $1$보다 작으면 세 인수의 곱은 음수이므로 $p_3$는 충분조건이지만 필요조건은 아니어서 $N(p_3)=0$이다. 합은 $4+1+0=5$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "일대일대응",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "일대일대응"
    ],
    "wide": false,
    "content": "정의역과 공역이 각각 실수 전체의 집합인 함수 $f$가<br>$f(x)=\\begin{cases}(5-a)x+b&(x\\lt 3)\\\\(a+2)x&(x\\ge 3)\\end{cases}$<br>일 때, 함수 $f$가 일대일대응이 되도록 하는 두 정수 $a$, $b$에 대하여 $a+b$의 최솟값은? [4.4점]",
    "choices": [
      "$26$",
      "$19$",
      "$12$",
      "$-16$",
      "$-23$"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 일차함수 조각의 치역이 겹치지 않고 빈틈없이 실수 전체를 이루어야 한다.\n조건 정리: 왼쪽 조각의 기울기는 $5-a$, 오른쪽 조각의 기울기는 $a+2$이다. 어느 한 기울기가 $0$이면 한 구간에서 함수값이 일정하므로 일대일함수가 될 수 없다.\n풀이 방향: 두 기울기의 부호에 따른 경우를 모두 판정한 뒤, 가능한 경우에 두 조각의 경계 치역을 일치시킨다.\n정석 풀이: 두 기울기의 부호가 서로 다르면 두 조각의 치역이 모두 위쪽 반직선 또는 모두 아래쪽 반직선이 되어 서로 겹치고 실수 전체를 덮지 못하므로 일대일대응이 될 수 없다. 두 조각이 모두 감소하려면 $5-a\\lt0$과 $a+2\\lt0$, 즉 $a\\gt5$와 $a\\lt-2$를 동시에 만족해야 하므로 불가능하다. 따라서 두 조각이 모두 증가해야 하며 $5-a\\gt0$, $a+2\\gt0$에서 $-2\\lt a\\lt5$이다. 이때 왼쪽 조각의 치역은 $(-\\infty,15-3a+b)$이고 오른쪽 조각의 치역은 $[3a+6,\\infty)$이다. 두 치역이 겹치지 않고 빈틈없이 실수 전체를 이루려면 $15-3a+b=3a+6$이어야 하므로 $b=6a-9$이다. 정수 $a$는 $-1,0,1,2,3,4$이고 $a+b=7a-9$이므로 최솟값은 $a=-1$일 때 $-16$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "상수함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "상수함수"
    ],
    "wide": false,
    "content": "서로 다른 세 실수 $a$, $b$, $c$에 대하여 집합 $X=\\{a,b,c\\}$를 정의역, 정수 전체의 집합을 공역으로 하는 함수 $f(x)=|2x(x-4)|$가 상수함수일 때, 함수 $f(x)$의 치역은 $\\{k\\}$이다. $k$의 최댓값을 구하면? [4.5점]",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "①",
    "solution": "[키포인트] 같은 함수값 $k$를 갖는 서로 다른 실수 해가 적어도 세 개 존재할 수 있는 $k$의 최대를 구한다.\n조건 정리: $|2x(x-4)|=k$는 $2x(x-4)=k$ 또는 $2x(x-4)=-k$로 나뉜다.\n풀이 방향: 두 이차방정식의 실근 개수를 판별식으로 조사한다.\n정석 풀이: $k=0$이면 해가 $x=0,4$뿐이므로 서로 다른 세 원소를 고를 수 없다. $k\\gt0$일 때 $2x(x-4)=k$는 항상 서로 다른 두 실근을 갖는다. 또 $2x(x-4)=-k$는 $x^2-4x+\\dfrac{k}{2}=0$이고 판별식이 $16-2k$이므로 실근을 가지려면 $k\\le8$이어야 한다. $k=8$일 때 이 방정식은 중근 $x=2$를 가지며 앞의 두 실근과 함께 정확히 세 개의 서로 다른 실수를 얻을 수 있다. 따라서 가능한 $k$의 최댓값은 $8$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "함수의 반복 합성",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 반복 합성",
      "그래프"
    ],
    "wide": false,
    "content": "집합 $X=\\{x\\mid 0\\le x\\le 4\\}$에 대하여 $X$에서 $X$로의 함수<br>$f(x)=\\begin{cases}\\dfrac{3}{2}x&(0\\le x\\lt 2)\\\\-\\dfrac{3}{2}x+6&(2\\le x\\le 4)\\end{cases}$<br>의 그래프는 아래 그림과 같다. $(f\\circ f\\circ f)(a)=\\dfrac{3}{2}$을 만족시키는 실수 $a$의 개수는? [4.6점]",
    "image": "assets/images/25_효천고_2학기_기말_고1_기출/q17.png",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$8$"
    ],
    "answer": "②",
    "solution": "[키포인트] 합성함수의 방정식은 목표값에서 시작하여 역으로 원상을 단계별로 찾는다.\n조건 정리: 함수의 치역은 $[0,3]$이고, $f(x)=t$의 해를 두 선분에서 각각 찾는다.\n풀이 방향: $f^3(a)=\\dfrac32$에서 세 번 역추적한다.\n정석 풀이: 먼저 $f(x)=\\dfrac32$의 해는 $x=1,3$이다. 다음으로 $f(x)=1$의 해는 $x=\\dfrac23,\\dfrac{10}{3}$이고, $f(x)=3$의 해는 $x=2$이다. 마지막으로 $f(x)=\\dfrac23$의 해는 $x=\\dfrac49,\\dfrac{32}{9}$이고, $f(x)=\\dfrac{10}{3}$은 치역을 벗어나 해가 없다. $f(x)=2$의 해는 $x=\\dfrac43,\\dfrac83$이다. 따라서 가능한 $a$는 네 개이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "유리함수와 원의 교점",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수와 원의 교점"
    ],
    "wide": false,
    "content": "모든 실수 $a$에 대하여 함수<br>$f(x)=\\dfrac{(2a+1)x-4a^2-2a+1}{x-2a}$<br>의 그래프와 중심이 $(2a,3a^2)$이고 반지름의 길이가 $r$인 원이 서로 다른 두 점에서 만날 때, $r$의 값은? [4.8점]",
    "choices": [
      "$4\\sqrt{2}$",
      "$4$",
      "$2\\sqrt{2}$",
      "$2$",
      "$\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] '모든 실수 $a$'에서 성립하므로 계산이 가장 간단한 $a$를 선택한다.\n조건 정리: 주어진 유리함수는 $f(x)=2a+1+\\dfrac1{x-2a}$이고 중심은 $(2a,2a+1)$이다.\n풀이 방향: 원의 중심과 유리함수의 중심이 일치하는 $a=1$을 대입한다.\n정석 풀이: $a=1$이면 유리함수는 $y=3+\\dfrac1{x-2}$이고 원의 중심도 $(2,3)$이다. $X=x-2$, $Y=y-3$으로 놓으면 유리함수는 $XY=1$, 원은 $X^2+Y^2=r^2$이다. $XY=1$에서 $X^2+Y^2\\ge2XY=2$이고, 등호는 $(X,Y)=(1,1),(-1,-1)$에서 성립하여 서로 다른 두 교점이 생긴다. $r^2\\lt2$이면 교점이 없고 $r^2\\gt2$이면 네 교점이 생기므로 두 점에서 만나려면 $r^2=2$이다. 따라서 $r=\\sqrt2$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "level": "하",
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
      "역함수와 합성함수"
    ],
    "wide": false,
    "content": "[서술형1]<br>두 함수 $f(x)=x+5$, $g(x)=-2x^2+x$에 대하여 $(f^{-1}\\circ g)(2)$의 값을 구하고 그 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$-11$",
    "solution": "[키포인트] 역함수를 구한 뒤 합성함수의 안쪽 함수부터 계산한다.\n조건 정리: $f(x)=x+5$이므로 $f^{-1}(x)=x-5$이다.\n풀이 방향: 먼저 $g(2)$를 구하고 그 값을 $f^{-1}$에 대입한다.\n정석 풀이: $g(2)=-2\\cdot2^2+2=-8+2=-6$이다. 따라서 $(f^{-1}\\circ g)(2)=f^{-1}(-6)=-6-5=-11$이다.\n따라서 구하는 값은 $-11$이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "합성함수"
    ],
    "wide": false,
    "content": "[서술형2]<br>두 함수 $f(x)=2ax+m$, $g(x)=\\dfrac{1}{2}bx+n$에 대하여 $0$이 아닌 두 실수 $m$, $n$의 값에 관계 없이 $(f\\circ g)(x)=(g\\circ f)(x)+4n$이 성립할 때, 두 상수 $a$, $b$의 값의 곱을 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$5$",
    "solution": "[키포인트] 두 합성함수의 상수항을 정리하고, 임의의 $m$, $n$에 대한 항등식의 계수를 비교한다.\n조건 정리: $m$, $n$은 서로 독립인 $0$이 아닌 실수이므로 $m$과 $n$의 계수가 각각 같아야 한다.\n풀이 방향: $(f\\circ g)(x)$와 $(g\\circ f)(x)+4n$을 전개한다.\n정석 풀이: $(f\\circ g)(x)=2a\\left(\\dfrac12bx+n\\right)+m=abx+2an+m$이다. 또 $(g\\circ f)(x)+4n=\\dfrac12b(2ax+m)+n+4n=abx+\\dfrac b2m+5n$이다. 따라서 $m$의 계수에서 $1=\\dfrac b2$이므로 $b=2$이고, $n$의 계수에서 $2a=5$이므로 $a=\\dfrac52$이다. 그러므로 $ab=\\dfrac52\\cdot2=5$이다.\n따라서 구하는 값은 $5$이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "명제의 부정",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "명제의 부정"
    ],
    "wide": false,
    "content": "[서술형3]<br>명제 ‘어떤 실수 $x$에 대하여 $x^2-ax+3\\lt 0$이다.’ 부정이 참이 되도록 하는 정수 $a$의 개수를 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$7$",
    "solution": "[키포인트] 존재명제의 부정은 모든 실수에 대한 부등식으로 바뀐다.\n조건 정리: 주어진 명제의 부정은 '모든 실수 $x$에 대하여 $x^2-ax+3\\ge0$이다.'이다.\n풀이 방향: 이차식이 모든 실수에서 음이 아닌 조건을 판별식으로 구한다.\n정석 풀이: 이차식의 최고차항 계수가 양수이므로 모든 실수 $x$에서 $x^2-ax+3\\ge0$이려면 판별식이 $0$ 이하이어야 한다. 따라서 $a^2-12\\le0$, 즉 $-2\\sqrt3\\le a\\le2\\sqrt3$이다. 이 범위의 정수는 $-3,-2,-1,0,1,2,3$으로 모두 $7$개이다.\n따라서 구하는 값은 $7$이다."
  },
  {
    "id": 22,
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
      "유리함수의 활용"
    ],
    "wide": false,
    "content": "[서술형4]<br>유리함수 $y=\\dfrac{1}{x+2}-1$ $(x\\lt -2)$의 그래프 위의 점 $P$에서 $x$축, $y$축에 내린 수선의 발을 각각 $Q$, $R$라고 할 때, $\\overline{PQ}+\\overline{PR}$의 최솟값을 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$5$",
    "solution": "[키포인트] 두 수선의 길이는 점 $P$의 좌표의 절댓값이며, 양수 치환 후 산술평균과 기하평균을 적용한다.\n조건 정리: $x\\lt-2$이므로 $x\\lt0$, $y=\\dfrac1{x+2}-1\\lt0$이다.\n풀이 방향: $t=-(x+2)\\gt0$으로 놓아 길이의 합을 $t+\\dfrac1t$ 꼴로 만든다.\n정석 풀이: $\\overline{PQ}=|y|=-y$, $\\overline{PR}=|x|=-x$이다. $t=-(x+2)$로 놓으면 $x=-t-2$, $y=-\\dfrac1t-1$이다. 따라서 $\\overline{PQ}+\\overline{PR}=t+\\dfrac1t+3$이다. $t\\gt0$에서 $t+\\dfrac1t\\ge2$이므로 최솟값은 $2+3=5$이고, 등호는 $t=1$, 즉 $x=-3$일 때 성립한다.\n따라서 구하는 값은 $5$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "함수와 역함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수와 역함수"
    ],
    "wide": false,
    "content": "[서술형5]<br>함수 $f(x)=\\begin{cases}3x-2&(x\\ge 0)\\\\\\dfrac{1}{5}x-2&(x\\lt 0)\\end{cases}$과 그 역함수 $f^{-1}(x)$에 대하여 $\\{f(x)\\}^2=f(x)f^{-1}(x)$를 만족시키는 모든 실수 $x$의 값의 합을 구하고 그 과정을 서술하시오. [7점]",
    "choices": [],
    "answer": "$-\\dfrac{5}{6}$",
    "solution": "[키포인트] 곱이 $0$인 식으로 바꾸고, 역함수의 구간을 정확히 나누어 푼다.\n조건 정리: 주어진 식은 $f(x)\\{f(x)-f^{-1}(x)\\}=0$이므로 $f(x)=0$ 또는 $f(x)=f^{-1}(x)$이다.\n풀이 방향: $x$의 구간 $x\\ge0$, $-2\\le x\\lt0$, $x\\lt-2$에 따라 $f$와 $f^{-1}$의 식을 적용한다.\n정석 풀이: 함수의 역함수는 $f^{-1}(x)=\\dfrac{x+2}{3}$ $(x\\ge-2)$, $f^{-1}(x)=5(x+2)$ $(x\\lt-2)$이다. 먼저 $f(x)=0$에서 $x=\\dfrac23$을 얻는다. $x\\ge0$에서 $3x-2=\\dfrac{x+2}{3}$이므로 $x=1$이다. $-2\\le x\\lt0$에서는 $\\dfrac15x-2=\\dfrac{x+2}{3}$의 해가 $x=-20$으로 구간에 맞지 않는다. $x\\lt-2$에서는 $\\dfrac15x-2=5(x+2)$이므로 $x=-\\dfrac52$이다. 따라서 모든 해의 합은 $\\dfrac23+1-\\dfrac52=-\\dfrac56$이다.\n따라서 구하는 값은 $-\\dfrac56$이다."
  }
];
