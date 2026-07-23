window.examTitle = "22_금당고_2학기_중간_고1_기출";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "함수의 뜻",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "대응",
    "함수의뜻",
    "도형"
  ],
    wide: false,
    content: "다음 대응 중 $X$에서 $Y$로의 함수인 것은? [3.8점]",
    choices: [],
    answer: "③",
    solution: "[키포인트] 함수에서는 정의역의 각 원소가 공역의 원소 단 하나에 대응해야 한다.\n조건 정리: 그림마다 집합 $X$의 모든 원소에서 출발하는 화살표의 개수를 확인한다.\n풀이 방향: 화살표가 없는 원소가 있거나 한 원소에서 두 화살표가 나가면 함수가 아니다.\n정석 풀이: ①은 $2$에서 두 원소로 대응하고, ②는 $5$에서 대응이 없으며, ④는 $1$에서 두 원소로 대응한다. ⑤도 $2,4$에서 대응이 없다. ③은 $X$의 원소 $-1,0,1$이 각각 $Y$의 원소 하나에만 대응하므로 함수이다.\n따라서 정답은 ③이다.",
    image: "assets/images/22_금당고_2학기_중간_고1_기출/q01.png",
    imageSize: "tall"
  },
  {
    id: 2,
    level: "하",
    category: "서로 같은 집합",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "서로같은집합",
    "미지수"
  ],
    wide: false,
    content: "두 집합 $A=\\{-1,a\\}$, $B=\\{b,2\\}$에 대하여 $A=B$일 때, $a+b$의 값은? (단, $a,b$는 상수) [3.8점]",
    choices: [
    "$1$",
    "$2$",
    "$3$",
    "$4$",
    "$5$"
  ],
    answer: "①",
    solution: "[키포인트] 두 집합이 같으면 어느 한쪽의 모든 원소가 다른 쪽에도 들어 있다.\n조건 정리: $A$와 $B$는 각각 원소가 두 개인 서로 같은 집합이다.\n풀이 방향: $A$의 원소 $-1$과 $B$의 원소 $2$에 대응하는 나머지 원소를 찾는다.\n정석 풀이: $A=B$이므로 $2$가 $A$에 들어 있어야 하여 $a=2$이고, $-1$이 $B$에 들어 있어야 하여 $b=-1$이다. 따라서 $a+b=2+(-1)=1$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 3,
    level: "하",
    category: "부분집합의 개수",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "부분집합",
    "원소개수"
  ],
    wide: false,
    content: "집합 $A=\\{1,2,3,4\\}$의 부분집합의 개수는? [3.8점]",
    choices: [
    "$4$",
    "$7$",
    "$8$",
    "$15$",
    "$16$"
  ],
    answer: "⑤",
    solution: "[키포인트] 각 원소마다 부분집합에 포함시키거나 포함시키지 않는 두 가지 선택이 있다.\n조건 정리: 집합 $A$의 원소는 $1,2,3,4$의 $4$개이다.\n풀이 방향: 네 원소에 대한 독립적인 두 가지 선택의 수를 곱한다.\n정석 풀이: 각 원소를 포함하는 경우와 포함하지 않는 경우가 각각 있으므로 부분집합의 개수는 $2\\times2\\times2\\times2=2^4=16$이다. 이 개수에는 공집합과 $A$ 자신도 포함된다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 4,
    level: "하",
    category: "명제의 대우",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "대우",
    "함의"
  ],
    wide: false,
    content: "두 조건 $p,q$에 대하여 명제 $p\\to\\sim q$가 참일 때, 항상 참인 명제는? [4점]",
    choices: [
    "$q\\to p$",
    "$p\\to q$",
    "$\\sim p\\to q$",
    "$\\sim q\\to\\sim p$",
    "$q\\to\\sim p$"
  ],
    answer: "⑤",
    solution: "[키포인트] 한 명제와 그 대우는 항상 진리값이 같다.\n조건 정리: 주어진 참인 명제는 $p\\to\\sim q$이다.\n풀이 방향: 가정과 결론을 서로 바꾸고 각각 부정하여 대우를 만든다.\n정석 풀이: $p\\to\\sim q$의 대우는 $\\sim(\\sim q)\\to\\sim p$이다. 이중 부정을 정리하면 $q\\to\\sim p$이고, 주어진 명제가 참이므로 이 대우도 항상 참이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 5,
    level: "하",
    category: "명제의 참",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "대입",
    "상수"
  ],
    wide: false,
    content: "명제 '$x=2$이면 $x^5-k=0$이다.'가 참일 때, 상수 $k$의 값은? [4점]",
    choices: [
    "$8$",
    "$16$",
    "$24$",
    "$32$",
    "$40$"
  ],
    answer: "④",
    solution: "[키포인트] 조건을 만족하는 값을 결론의 식에 대입한다.\n조건 정리: $x=2$일 때 $x^5-k=0$이어야 한다.\n풀이 방향: 결론의 $x$를 $2$로 바꾸어 $k$에 대한 방정식을 푼다.\n정석 풀이: $2^5-k=0$이므로 $32-k=0$이다. 따라서 $k=32$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 6,
    level: "하",
    category: "역함수",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "역함수",
    "일차함수"
  ],
    wide: false,
    content: "함수 $f(x)=2x+a$에 대하여 $f^{-1}(0)=1$일 때, 상수 $a$의 값은? [4점]",
    choices: [
    "$-2$",
    "$-1$",
    "$0$",
    "$1$",
    "$2$"
  ],
    answer: "①",
    solution: "[키포인트] $f^{-1}(y)=x$와 $f(x)=y$는 같은 대응을 나타낸다.\n조건 정리: $f^{-1}(0)=1$이므로 $f(1)=0$이다.\n풀이 방향: $x=1$을 $f(x)=2x+a$에 대입하여 $a$를 구한다.\n정석 풀이: $f(1)=2+a=0$이므로 $a=-2$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 7,
    level: "중",
    category: "서로소인 집합",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "합집합",
    "교집합",
    "원소개수"
  ],
    wide: false,
    content: "전체집합 $U$의 두 부분집합 $A,B$에 대하여 $n(A\\cup B)=n(A)+n(B)$일 때, 다음 중 항상 성립한다고 할 수 없는 것은? [4점]",
    choices: [
    "$A\\cap B=\\varnothing$",
    "$A-B=A$",
    "$A\\cup B=B$",
    "$A\\subset B^c$",
    "$n(A\\cap B)=0$"
  ],
    answer: "③",
    solution: "[키포인트] 합집합의 원소 수 공식으로 교집합이 공집합임을 판단한다.\n조건 정리: $n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$이고, 문제에서는 $n(A\\cup B)=n(A)+n(B)$이다.\n풀이 방향: 두 식을 비교한 뒤 각 보기가 서로소인 두 집합에서 항상 성립하는지 확인한다.\n정석 풀이: 두 식을 비교하면 $n(A\\cap B)=0$이므로 $A\\cap B=\\varnothing$이다. 따라서 $A-B=A$, $A\\subset B^c$, $n(A\\cap B)=0$도 항상 성립한다. 그러나 $A\\cup B=B$가 성립하려면 $A\\subset B$여야 하며, 주어진 조건만으로는 이를 보장할 수 없다.\n따라서 정답은 ③이다."
  },
  {
    id: 8,
    level: "중",
    category: "절대부등식",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "절대부등식"
  ],
    wide: false,
    content: "다음 중 모든 실수 $x,y$에 대하여 항상 옳은 것은? [4.2점]",
    choices: [
    "$x^2-2\\ge0$",
    "$(x-y)^2\\gt0$",
    "$|y|\\gt y$",
    "$\\dfrac{x+y}{2}\\ge\\sqrt{xy}$",
    "$2(x^2+y^2)\\ge(x+y)^2$"
  ],
    answer: "⑤",
    solution: "[키포인트] 모든 실수에서 참인지 확인하려면 등호가 되는 경우와 식의 정의 여부까지 살펴야 한다.\n조건 정리: $x,y$에는 별도의 범위 조건이 없으므로 임의의 실수를 대입할 수 있다.\n풀이 방향: 각 보기의 반례를 찾고, 항상 성립하는 식은 완전제곱식으로 증명한다.\n정석 풀이: ①은 $x=0$, ②는 $x=y$, ③은 $y=0$에서 거짓이다. ④는 $xy\\lt0$이면 실수 범위에서 $\\sqrt{xy}$가 정의되지 않는다. 한편 $2(x^2+y^2)-(x+y)^2=(x-y)^2\\ge0$이므로 ⑤는 모든 실수 $x,y$에 대하여 성립한다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 9,
    level: "하",
    category: "합성함수",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "합성함수",
    "일차함수"
  ],
    wide: false,
    content: "두 함수 $f(x)=2x+4$, $g(x)=x+1$에 대하여 $(f\\circ g)(a)=-4$가 성립할 때, 상수 $a$의 값은? [4.2점]",
    choices: [
    "$-1$",
    "$-2$",
    "$-3$",
    "$-4$",
    "$-5$"
  ],
    answer: "⑤",
    solution: "[키포인트] 합성함수 $(f\\circ g)(a)$는 $g(a)$를 먼저 구한 뒤 그 값을 $f$에 대입한다.\n조건 정리: $g(a)=a+1$이고 $f(x)=2x+4$이다.\n풀이 방향: $f(g(a))=-4$를 $a$에 대한 일차방정식으로 나타낸다.\n정석 풀이: $f(g(a))=f(a+1)=2(a+1)+4=2a+6$이다. 따라서 $2a+6=-4$이므로 $2a=-10$, $a=-5$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 10,
    level: "중",
    category: "전칭명제와 이차식",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "전칭명제",
    "이차식",
    "매개변수"
  ],
    wide: false,
    content: "실수 $x$에 대한 명제 '모든 실수 $x$에 대하여 $x^2+6kx+8k^2\\ge k-6$이다.'가 참이 되도록 하는 실수 $k$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은? [4.2점]",
    choices: [
    "$4$",
    "$5$",
    "$6$",
    "$7$",
    "$8$"
  ],
    answer: "②",
    solution: "[키포인트] 모든 실수 $x$에서 부등식이 성립하려면 왼쪽 이차식의 최솟값도 오른쪽보다 크거나 같아야 한다.\n조건 정리: $x^2+6kx+8k^2=(x+3k)^2-k^2$이다.\n풀이 방향: 완전제곱식으로 최솟값을 구한 뒤 $k$의 범위를 정한다.\n정석 풀이: $(x+3k)^2\\ge0$이므로 왼쪽 식의 최솟값은 $x=-3k$일 때 $-k^2$이다. 따라서 $-k^2\\ge k-6$, 즉 $k^2+k-6\\le0$이어야 한다. $(k+3)(k-2)\\le0$에서 $-3\\le k\\le2$이므로 $M=2$, $m=-3$이다. 따라서 $M-m=2-(-3)=5$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 11,
    level: "중",
    category: "합성함수 방정식",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "합성함수",
    "절댓값",
    "방정식"
  ],
    wide: false,
    content: "두 함수 $f(x)=x^2-6x$, $g(x)=|x-3|$에 대하여 방정식 $f(g(x))=g(x)$의 모든 실근의 합은? [4.2점]",
    choices: [
    "$7$",
    "$9$",
    "$11$",
    "$13$",
    "$15$"
  ],
    answer: "②",
    solution: "[키포인트] 반복해서 나타나는 $|x-3|$를 하나의 문자로 놓고 방정식을 푼다.\n조건 정리: $t=|x-3|$라 두면 $t\\ge0$이고 $f(g(x))=t^2-6t$이다.\n풀이 방향: 먼저 $t$의 값을 구한 뒤 각각을 절댓값 방정식으로 되돌린다.\n정석 풀이: $t^2-6t=t$에서 $t^2-7t=t(t-7)=0$이므로 $t=0$ 또는 $t=7$이다. $|x-3|=0$이면 $x=3$이고, $|x-3|=7$이면 $x=10$ 또는 $x=-4$이다. 모든 실근의 합은 $3+10-4=9$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 12,
    level: "중",
    category: "완전가법 함수",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "소인수분해",
    "함수방정식"
  ],
    wide: false,
    content: "정의역이 자연수 전체의 집합이고 공역이 실수 전체의 집합인 함수 $f$가 다음 조건을 만족시킨다.\n(가) $p$가 소수이면 $f(p)=3p$\n(나) 임의의 자연수 $m,n$에 대하여 $f(mn)=f(m)+f(n)$\n이때 $f(432)$의 값을 구하면? [4.4점]",
    choices: [
    "$47$",
    "$49$",
    "$51$",
    "$53$",
    "$55$"
  ],
    answer: "③",
    solution: "[키포인트] 자연수를 소인수분해하고 곱에 대한 조건을 반복해서 적용한다.\n조건 정리: $432=2^4\\cdot3^3$이고, 소수에 대하여 $f(2)=6$, $f(3)=9$이다.\n풀이 방향: $f(mn)=f(m)+f(n)$을 이용해 소인수의 함수값을 지수만큼 더한다.\n정석 풀이: $f(2^4)=4f(2)=24$이고 $f(3^3)=3f(3)=27$이다. 따라서 $f(432)=f(2^4\\cdot3^3)=f(2^4)+f(3^3)=24+27=51$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 13,
    level: "상",
    category: "집합의 연산",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "여집합",
    "대칭차집합",
    "원소합"
  ],
    wide: false,
    content: "전체집합 $U=\\{x\\mid x\\le9\\}$ (단, $x$는 자연수)의 두 부분집합 $A,B$에 대하여 $A\\cup B^c=\\{2,3,4,6,7,9\\}$, $(A\\cap B^c)^c=\\{1,2,5,7,8,9\\}$일 때, 집합 $(A\\cup B)\\cap(A\\cap B)^c$의 모든 원소의 합은? [4.4점]",
    choices: [
    "$20$",
    "$27$",
    "$29$",
    "$36$",
    "$45$"
  ],
    answer: "②",
    solution: "[키포인트] 구하는 집합은 두 집합 중 정확히 한 곳에만 속하는 원소들의 집합이다.\n조건 정리: $U=\\{1,2,3,4,5,6,7,8,9\\}$이고, $(A\\cap B^c)^c$의 여집합은 $A\\cap B^c=A-B$이다.\n풀이 방향: 두 조건의 여집합을 구해 $A-B$와 $B-A$를 각각 찾는다.\n정석 풀이: $(A\\cap B^c)^c=\\{1,2,5,7,8,9\\}$이므로 $A-B=\\{3,4,6\\}$이다. 또한 $(A\\cup B^c)^c=A^c\\cap B=B-A=\\{1,5,8\\}$이다. 한편 $(A\\cup B)\\cap(A\\cap B)^c=(A-B)\\cup(B-A)$이므로 구하는 원소는 $1,3,4,5,6,8$이고 그 합은 $27$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 14,
    level: "상",
    category: "귀류법",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "귀류법",
    "산술기하평균",
    "제곱근"
  ],
    wide: false,
    content: "다음은 양의 실수 $x,y,z$에 대하여 $x+y+z=2$일 때, $\\sqrt{x+2}+\\sqrt{y+2}+\\sqrt{z+2}\\le2\\sqrt6$이 성립함을 귀류법을 이용하여 증명한 것이다.\n\n결론을 부정하여 $\\sqrt{x+2}+\\sqrt{y+2}+\\sqrt{z+2}\\gt2\\sqrt6$이라 가정하자. 양변을 제곱하면\n$(\\sqrt{x+2}+\\sqrt{y+2}+\\sqrt{z+2})^2\\gt(2\\sqrt6)^2$\n$(가)+2\\sqrt{(x+2)(y+2)}+2\\sqrt{(y+2)(z+2)}+2\\sqrt{(z+2)(x+2)}\\gt24$\n$\\therefore \\sqrt{(x+2)(y+2)}+\\sqrt{(y+2)(z+2)}+\\sqrt{(z+2)(x+2)}\\gt8$ …… ①\n한편 산술평균과 기하평균의 관계에 의하여\n$x+y+(나)\\ge2\\sqrt{(x+2)(y+2)}$,\n$y+z+(나)\\ge2\\sqrt{(y+2)(z+2)}$,\n$z+x+(나)\\ge2\\sqrt{(z+2)(x+2)}$\n이므로\n$2\\sqrt{(x+2)(y+2)}+2\\sqrt{(y+2)(z+2)}+2\\sqrt{(z+2)(x+2)}\\le(다)$\n그러나 이는 ①에 모순이다. 따라서 $\\sqrt{x+2}+\\sqrt{y+2}+\\sqrt{z+2}\\le2\\sqrt6$이다.\n\n위의 (가), (나), (다)에 알맞은 값을 각각 $p,q,r$이라 할 때, $p+q+r$의 값은? [4.4점]",
    choices: [
    "$25$",
    "$26$",
    "$27$",
    "$28$",
    "$29$"
  ],
    answer: "④",
    solution: "[키포인트] 제곱식의 전개와 산술평균·기하평균의 관계를 원문의 증명 순서대로 비교한다.\n조건 정리: $x+y+z=2$이고 $x,y,z$는 양의 실수이다.\n풀이 방향: 제곱식의 상수 부분에서 (가)를, 두 항씩 묶은 산술평균에서 (나)를, 세 부등식의 합에서 (다)를 구한다.\n정석 풀이: 제곱식의 제곱항 합은 $(x+2)+(y+2)+(z+2)=x+y+z+6=8$이므로 $p=8$이다. 또 $(x+2)+(y+2)=x+y+4$이므로 산술평균과 기하평균의 관계에서 $q=4$이다. 세 부등식의 왼쪽을 더하면 $2(x+y+z)+12=2\\cdot2+12=16$이므로 $r=16$이다. 따라서 $p+q+r=8+4+16=28$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 15,
    level: "상",
    category: "곱의 최댓값",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "명제",
    "최댓값",
    "산술기하평균"
  ],
    wide: false,
    content: "$a\\gt0$, $b\\gt0$이고 $3a+b+ab=9$일 때, $ab$의 최댓값은? [4.4점]",
    choices: [
    "$3$",
    "$4$",
    "$5$",
    "$6$",
    "$7$"
  ],
    answer: "①",
    solution: "[키포인트] 양수 $3a,b$에 산술평균과 기하평균의 관계를 적용해 $ab$의 범위를 구한다.\n조건 정리: $3a+b=9-ab$이고 $a,b\\gt0$이다.\n풀이 방향: $3a+b\\ge2\\sqrt{3ab}$를 조건식과 결합하고 등호 성립 여부를 확인한다.\n정석 풀이: $3a+b\\ge2\\sqrt{3ab}$이므로 $ab+2\\sqrt{3ab}\\le9$이다. $t=\\sqrt{3ab}\\gt0$이라 두면 $ab=\\dfrac{t^2}{3}$이므로 $t^2+6t\\le27$, 즉 $(t-3)(t+9)\\le0$이다. 따라서 $t\\le3$이고 $ab=\\dfrac{t^2}{3}\\le3$이다. 등호는 $3a=b$이고 $ab=3$일 때 성립하며, $a=1$, $b=3$은 원래 조건을 만족한다.\n따라서 정답은 ①이다."
  },
  {
    id: 16,
    level: "상",
    category: "부분집합의 합",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "여집합",
    "부분집합",
    "경우의수"
  ],
    wide: false,
    content: "전체집합 $U=\\{2^n\\mid n\\lt7\\}\\cup\\{3\\}$ (단, $n$은 자연수)의 부분집합 $A$에 대하여 집합 $A$의 모든 원소의 합을 $S(A)$라 하자. 전체집합 $U$의 두 부분집합 $X,Y$에 대하여 다음 조건을 만족시키는 집합 $X$의 개수는?\n(가) $X^c\\cup Y^c=U$\n(나) $U-X=X^c-(X\\cup Y^c)$\n(다) $S(X)-S(Y)\\gt0$\n(라) $n(X)$의 값은 홀수\n[4.6점]",
    choices: [
    "$30$",
    "$31$",
    "$32$",
    "$33$",
    "$34$"
  ],
    answer: "②",
    solution: "[키포인트] 먼저 집합 조건으로 $Y$를 $X$의 여집합으로 정한 뒤, 원소 $64$의 포함 여부로 경우를 나눈다.\n조건 정리: $U=\\{2,3,4,8,16,32,64\\}$이고 $S(U)=129$이다.\n풀이 방향: (가), (나)에서 $Y=X^c$를 얻고 $S(X)\\gtS(X^c)$ 및 $n(X)$가 홀수인 부분집합을 센다.\n정석 풀이: (가)에서 $X\\cap Y=\\varnothing$이고, (나)의 오른쪽은 $X^c\\cap Y$이므로 $X^c=X^c\\cap Y$, 즉 $X^c\\subset Y$이다. 따라서 $Y=X^c$이다. 이제 $S(X)\\gtS(Y)$는 $S(X)\\gt\\dfrac{129}{2}=64.5$와 같다. $64\\in X$이면 나머지 여섯 원소 중 짝수 개를 골라야 $n(X)$가 홀수이다. 짝수 개를 고르는 방법은 $2^5=32$가지이지만 아무것도 고르지 않으면 합이 $64$이므로 제외하여 $31$가지이다. $64\\notin X$이면 나머지 원소의 총합이 $65$인데, 합이 $64.5$보다 크려면 여섯 원소를 모두 골라야 하고 이때 원소 수가 짝수이므로 조건에 맞지 않는다. 따라서 집합 $X$는 $31$개이다.\n따라서 정답은 ②이다."
  },
  {
    id: 17,
    level: "상",
    category: "일대일대응",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "일대일대응",
    "이차함수",
    "조각함수"
  ],
    wide: false,
    content: "$f(0)=1$인 이차함수 $f(x)$에 대하여 실수 전체의 집합에서 정의된 함수 $g(x)$를 $g(x)=\\begin{cases}f(x)&(x\\le1)\\\\|f(x)-6|&(x\\gt1)\\end{cases}$라 하자. 함수 $g(x)$가 일대일대응일 때, $g(1)+g(2)$의 값은? [4.6점]",
    choices: [
    "$7$",
    "$8$",
    "$9$",
    "$10$",
    "$11$"
  ],
    answer: "②",
    solution: "[키포인트] 일대일대응이 되려면 두 구간의 치역이 겹치지 않고 합쳐서 실수 전체가 되어야 한다.\n조건 정리: $x\\gt1$에서 $g(x)=|f(x)-6|\\ge0$이므로 음의 함수값은 모두 $x\\le1$인 구간에서 나와야 한다.\n풀이 방향: 이차함수의 꼭짓점이 경계 $x=1$에 놓여야 하는 이유를 먼저 밝히고 두 구간 치역의 경곗값을 맞춘다.\n정석 풀이: $x\\le1$에서 음의 값을 제한 없이 가지려면 $f$는 아래로 열린 이차함수이다. 그 축을 $x=h$라 하자. $h\\lt1$이면 구간 $x\\le1$ 안에 축의 양쪽 점이 들어가 같은 함숫값을 가지므로 $g$가 일대일이 아니다. 반대로 $h\\gt1$이면 구간 $x\\gt1$ 안에 축의 양쪽 점이 들어가 $f$의 같은 값, 따라서 $|f-6|$의 같은 값을 가지므로 역시 일대일이 아니다. 그러므로 $h=1$이다. $v=f(1)$이라 하면 첫째 구간의 치역은 $(-\\infty,v]$이다. $x\\gt1$에서는 $f(x)\\ltv$이고, 일대일대응을 이루려면 $v\\lt6$이며 $g(x)=6-f(x)$의 치역은 $(6-v,\\infty)$이다. 두 치역이 겹치거나 빠지는 값 없이 실수 전체를 이루려면 $v=6-v$, 즉 $v=3$이다. 이차함수의 축이 $x=1$이고 $f(0)=1$이므로 $f(2)=1$이다. 따라서 $g(1)=f(1)=3$, $g(2)=|f(2)-6|=5$이므로 합은 $8$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 18,
    level: "상",
    category: "필요충분조건",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "단답형",
    layoutTag: "grid",
    tags: [
    "단답형",
    "명제",
    "필요조건",
    "충분조건",
    "약수"
  ],
    wide: false,
    content: "[단답형 1] 자연수 $k$의 양의 약수의 집합을 $A_k$라 하자. 세 조건 $p,q,r$가 다음과 같다.\n$p:x\\in A_{48}$, $q:x\\in A_m$, $r:x\\in A_n$\n조건 $p$가 $q$이기 위한 필요조건이지만 충분조건이 아니고, $r$이기 위한 충분조건이지만 필요조건이 아닐 때, $m$의 최댓값과 $n$의 최솟값의 합을 구하시오. [4점]",
    choices: [],
    answer: "$120$",
    solution: "[키포인트] 약수 집합 사이의 포함 관계를 필요조건과 충분조건의 방향에 맞게 해석한다.\n조건 정리: $p$가 $q$의 필요조건이므로 $q\\to p$이고, $p$가 $r$의 충분조건이므로 $p\\to r$이다. 두 관계 모두 역은 성립하지 않는다.\n풀이 방향: 조건의 포함 관계를 $A_m\\subsetneq A_{48}\\subsetneq A_n$으로 바꾸어 $m,n$을 정한다.\n정석 풀이: $q\\to p$이고 $p\\not\\to q$이므로 $A_m\\subsetneq A_{48}$이다. 따라서 $m$은 $48$의 진약수이고 최댓값은 $24$이다. 또 $p\\to r$이고 $r\\not\\to p$이므로 $A_{48}\\subsetneq A_n$이다. 이는 $n$이 $48$의 배수이되 $48$은 아닌 경우이므로 최솟값은 $96$이다. 따라서 구하는 합은 $24+96=120$이다.\n따라서 구하는 값은 $120$이다."
  },
  {
    id: 19,
    level: "상",
    category: "산술기하평균",
    originalCategory: "명제",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02",
    standardUnit: "명제",
    standardUnitOrder: 2,
    questionType: "단답형",
    layoutTag: "grid",
    tags: [
    "단답형",
    "도형",
    "정삼각형",
    "최댓값",
    "산술기하평균"
  ],
    wide: false,
    content: "[단답형 2] 다음 그림과 같이 정삼각형 $ABC$에 내접하는 두 정삼각형 $T_1,T_2$에 대하여 색칠한 부분의 넓이의 최댓값이 $\\sqrt3$일 때, 정삼각형 $ABC$의 둘레의 길이를 구하시오. [5점]",
    choices: [],
    answer: "$6\\sqrt2$",
    solution: "[키포인트] 큰 정삼각형의 넓이에서 두 작은 정삼각형의 넓이를 빼고, 산술평균과 기하평균의 관계로 곱의 최댓값을 구한다.\n조건 정리: $T_1,T_2$의 한 변의 길이를 각각 $x,y$라 하면 그림에서 $BC=x+y$이다.\n풀이 방향: 색칠한 넓이를 $xy$에 대한 식으로 나타내고 $x+y$가 일정할 때의 최댓값을 이용한다.\n정석 풀이: 색칠한 부분의 넓이는 $\\dfrac{\\sqrt3}{4}\\{(x+y)^2-x^2-y^2\\}=\\dfrac{\\sqrt3}{2}xy$이다. $x+y\\ge2\\sqrt{xy}$이므로 $xy\\le\\dfrac{(x+y)^2}{4}$이고, $x=y$일 때 등호가 성립한다. 따라서 색칠한 넓이의 최댓값은 $\\dfrac{\\sqrt3}{8}(x+y)^2$이다. 이것이 $\\sqrt3$이므로 $(x+y)^2=8$, $BC=x+y=2\\sqrt2$이다.\n따라서 구하는 둘레의 길이는 $3BC=6\\sqrt2$이다.",
    image: "assets/images/22_금당고_2학기_중간_고1_기출/q19.png"
  },
  {
    id: 20,
    level: "상",
    category: "함수와 역함수의 그래프",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "함수",
    "역함수",
    "그래프",
    "최솟값"
  ],
    wide: false,
    content: "[서술형 1] 함수 $f(x)=x^2+\\dfrac74$ $(x\\ge0)$에 대하여 $y=f(x)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프가 직선 $y=-x+k$와 만나는 두 점을 각각 $A,B$라 하자. 선분 $AB$의 길이가 최소가 될 때, 삼각형 $OAB$의 넓이를 구하는 과정을 서술하시오. (단, $k$는 $\\dfrac74$ 이상인 상수이고, $O$는 원점이다.) [10점]",
    choices: [],
    answer: "$\\dfrac{15}{8}$",
    solution: "[키포인트] 함수와 역함수의 그래프는 직선 $y=x$에 대하여 대칭이므로 두 교점의 좌표도 서로 뒤바뀐다.\n조건 정리: $A=(t,f(t))$라 두면 $t\\ge0$이고 $B=(f(t),t)$이다. 두 점 모두 $y=-x+k$ 위에 있으며 $k=t+f(t)\\ge\\dfrac74$이다.\n풀이 방향: $AB$를 $t$의 식으로 나타내어 최솟값을 구한 뒤 좌표로 삼각형의 넓이를 계산한다.\n정석 풀이: $AB=\\sqrt{(f(t)-t)^2+(t-f(t))^2}=\\sqrt2|f(t)-t|$이다. 그런데 $f(t)-t=t^2-t+\\dfrac74=(t-\\dfrac12)^2+\\dfrac32\\gt0$이므로 $t=\\dfrac12$일 때 $AB$가 최소이다. 이때 $f(\\dfrac12)=\\dfrac14+\\dfrac74=2$이므로 $A=(\\dfrac12,2)$, $B=(2,\\dfrac12)$이다. 따라서 삼각형 $OAB$의 넓이는 $\\dfrac12|\\dfrac12\\cdot\\dfrac12-2\\cdot2|=\\dfrac12\\cdot\\dfrac{15}{4}=\\dfrac{15}{8}$이다.\n따라서 구하는 넓이는 $\\dfrac{15}{8}$이다."
  },
  {
    id: 21,
    level: "상",
    category: "직선과 도형의 교점",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "함수",
    "교점",
    "절댓값",
    "집합"
  ],
    wide: false,
    content: "[서술형 2] $a\\gt0$인 실수와 자연수 $b$에 대하여 세 집합 $A=\\{(x,y)\\mid y=x, y=x^2-x-3\\}$, $B=\\{(x,y)\\mid y=x, (x-2a)^2+(y-a)^2=a^2\\}$, $C=\\{(x,y)\\mid y=x, y=|bx+3-3b|\\}$가 있다. $n(A\\cup B\\cup C)=3$일 때, $a+b$의 값을 구하는 과정을 서술하시오. [10점]",
    choices: [],
    answer: "$\\dfrac92$",
    solution: "[키포인트] 세 집합은 모두 직선 $y=x$ 위의 교점 집합이므로 각 교점의 $x$좌표를 구해 합집합의 원소 수를 맞춘다.\n조건 정리: $a\\gt0$이고 $b$는 자연수이며, 합집합에는 서로 다른 점이 정확히 $3$개 있다.\n풀이 방향: $A,B,C$의 $x$좌표 집합을 각각 구하고 새 좌표가 생기지 않도록 $a,b$를 정한다.\n정석 풀이: $A$에서는 $x=x^2-x-3$이므로 $(x-3)(x+1)=0$에서 $x=-1,3$이다. $B$에서는 $y=x$를 원의 방정식에 대입하면 $(x-2a)^2+(x-a)^2=a^2$, 즉 $2(x-a)(x-2a)=0$이므로 $x=a,2a$이다. $C$에서는 $x=|bx+3-3b|$이다. $b=1$이면 해가 무수히 많아 조건에 맞지 않으므로 $b\\gt1$이고, 두 해는 $x=3$과 $x=\\dfrac{3(b-1)}{b+1}$이다. 이미 $A$에서 $-1,3$이 나오므로 나머지 양의 좌표들이 한 점으로 일치해야 한다. $a$와 $2a$ 중 하나가 $3$이어야 하는데, $a=3$이면 다른 좌표 $6$과 $0\\lt\\dfrac{3(b-1)}{b+1}\\lt3$이 서로 달라 원소가 늘어난다. 따라서 $2a=3$이고 $a=\\dfrac32$이다. 이어서 $\\dfrac{3(b-1)}{b+1}=\\dfrac32$에서 $2b-2=b+1$, $b=3$이다. 따라서 $a+b=\\dfrac32+3=\\dfrac92$이다.\n따라서 구하는 값은 $\\dfrac92$이다."
  }
];
