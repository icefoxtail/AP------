window.examTitle = "22_매산고_2학기_중간_고1_기출";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "집합의 기호",
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
    "원소",
    "부분집합"
  ],
    wide: false,
    content: "집합 $A=\\{\\varnothing,1,2,\\{1\\},\\{1,2\\}\\}$일 때, 다음 중 옳지 않은 것은? [3.4점]",
    choices: [
    "$\\varnothing\\subset A$",
    "$\\{\\varnothing\\}\\subset A$",
    "$\\{1,\\{1\\}\\}\\subset A$",
    "$\\{1,2\\}\\in A$",
    "$\\{\\varnothing,1,2\\}\\in A$"
  ],
    answer: "⑤",
    solution: "[키포인트] 집합의 원소를 나타내는 $\\in$과 부분집합을 나타내는 $\\subset$을 구별한다.\n조건 정리: $A$의 원소는 $\\varnothing,1,2,\\{1\\},\\{1,2\\}$의 다섯 개이다.\n풀이 방향: 각 보기의 왼쪽 대상이 $A$의 원소인지, 또는 그 원소들이 모두 $A$에 속하는지 확인한다.\n정석 풀이: 공집합은 모든 집합의 부분집합이므로 ①은 옳다. $\\varnothing,1,\\{1\\}$은 모두 $A$의 원소이므로 ②와 ③도 옳고, $\\{1,2\\}$ 자체가 $A$의 원소이므로 ④도 옳다. 그러나 $\\{\\varnothing,1,2\\}$는 $A$의 부분집합일 뿐 $A$의 원소는 아니다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 2,
    level: "하",
    category: "함수의 상등",
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
    "함수의상등",
    "정의역"
  ],
    wide: false,
    content: "집합 $X=\\{-1,0,1\\}$을 정의역으로 하는 두 함수 $f(x)=x^3+ax$, $g(x)=2x+b$에 대하여 $f=g$이다. 이때 상수 $a,b$에 대하여 $a^2-b^2$의 값은? [3.5점]",
    choices: [
    "$1$",
    "$2$",
    "$3$",
    "$4$",
    "$5$"
  ],
    answer: "①",
    solution: "[키포인트] 두 함수가 같으면 정의역의 모든 원소에서 함수값이 같다.\n조건 정리: 정의역은 $X=\\{-1,0,1\\}$이고 $f(x)=g(x)$이다.\n풀이 방향: 계산이 간단한 $x=0,1$을 차례로 대입해 $a,b$를 정한다.\n정석 풀이: $x=0$에서 $f(0)=0$, $g(0)=b$이므로 $b=0$이다. $x=1$에서 $1+a=2+b=2$이므로 $a=1$이다. 이 값들은 $x=-1$에서도 두 함수값을 같게 한다. 따라서 $a^2-b^2=1^2-0^2=1$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 3,
    level: "중",
    category: "산술기하평균",
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
    "산술기하평균",
    "최솟값"
  ],
    wide: false,
    content: "$a\\gt0,b\\gt0$일 때, $(2a+b)(\\frac1a+\\frac2b)$의 최솟값을 구하면? [3.7점]",
    choices: [
    "$4$",
    "$6$",
    "$8$",
    "$10$",
    "$10$"
  ],
    answer: "③",
    solution: "[키포인트] 식을 전개한 뒤 서로 곱이 일정한 두 양수에 산술평균과 기하평균의 관계를 적용한다.\n조건 정리: $a,b$가 양수이므로 $\\frac{4a}{b}$와 $\\frac{b}{a}$도 양수이다.\n풀이 방향: 상수항과 비율항을 분리하여 비율항의 합의 최솟값을 구한다.\n정석 풀이: $(2a+b)(\\frac1a+\\frac2b)=4+\\frac{4a}{b}+\\frac{b}{a}$이다. 산술평균과 기하평균의 관계에 따라 $\\frac{4a}{b}+\\frac{b}{a}\\ge2\\sqrt{4}=4$이므로 전체 식은 $8$ 이상이다. 등호는 $\\frac{4a}{b}=\\frac{b}{a}$, 즉 $b=2a$일 때 성립한다.\n원본에서 ④와 ⑤가 모두 $10$으로 중복되어 있으나, 계산된 최솟값은 $8$이므로 정답은 유일하게 ③이다.\n따라서 정답은 ③이다."
  },
  {
    id: 4,
    level: "하",
    category: "명제의 참과 거짓",
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
    "참거짓",
    "반례"
  ],
    wide: false,
    content: "다음 중 참인 명제는? (단, $x,y$는 실수이다.) [3.8점]",
    choices: [
    "$3$의 배수는 $6$의 배수이다.",
    "$x^2+3x-4=0$이면 $x=1$이다.",
    "모든 실수 $x$에 대하여 $x^2\\ge0$이다.",
    "$x\\ge1$ 또는 $y\\ge1$이면 $x+y\\ge2$이다.",
    "어떤 정수 $x$에 대하여 $x^2\\lt x$이다."
  ],
    answer: "③",
    solution: "[키포인트] 거짓인 명제는 반례 하나로 판정하고, 참인 명제는 모든 경우에 성립함을 확인한다.\n조건 정리: $x,y$는 실수이고 ⑤의 $x$는 정수이다.\n풀이 방향: 각 명제에 간단한 반례를 대입한다.\n정석 풀이: ①은 $3$, ②는 방정식의 다른 근 $-4$, ④는 $x=1,y=0$이 반례이다. 정수에서는 $x^2-x=x(x-1)\\ge0$이므로 ⑤도 거짓이다. 모든 실수의 제곱은 항상 $0$ 이상이므로 ③만 참이다.\n따라서 정답은 ③이다."
  },
  {
    id: 5,
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
    content: "두 함수 $f(x)=x+2$, $g(x)=-3x+2$에 대하여 $(f\\circ g)(2)+(g\\circ f)(-2)$의 값을 구하면? [3.9점]",
    choices: [
    "$4$",
    "$3$",
    "$2$",
    "$1$",
    "$0$"
  ],
    answer: "⑤",
    solution: "[키포인트] 합성함수는 안쪽 함수의 값을 먼저 구한다.\n조건 정리: $(f\\circ g)(2)=f(g(2))$이고 $(g\\circ f)(-2)=g(f(-2))$이다.\n풀이 방향: 두 합성함수 값을 각각 계산한 뒤 더한다.\n정석 풀이: $g(2)=-6+2=-4$이므로 $f(g(2))=f(-4)=-2$이다. 또 $f(-2)=0$이므로 $g(f(-2))=g(0)=2$이다. 따라서 두 값의 합은 $-2+2=0$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 6,
    level: "중",
    category: "집합 조건",
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
    "차집합",
    "부분집합개수"
  ],
    wide: false,
    content: "전체집합 $U=\\{x\\mid x\\le10\\}$ (단, $x$는 자연수)의 두 부분집합 $A=\\{2,4,6\\}$, $B=\\{1,3,5,7,9\\}$에 대하여 $X\\cup A=X-B$를 만족시키는 전체집합 $U$의 부분집합 $X$의 개수는? [4.2점]",
    choices: [
    "$4$",
    "$8$",
    "$16$",
    "$32$",
    "$64$"
  ],
    answer: "①",
    solution: "[키포인트] 합집합은 원소를 반드시 포함하게 하고, 차집합은 특정 원소를 제외하게 한다.\n조건 정리: $U=\\{1,2,3,4,5,6,7,8,9,10\\}$이고 $A$와 $B$는 서로소이다.\n풀이 방향: 등식의 양변에서 $A,B$의 원소가 $X$에 들어갈 수 있는지를 판단한다.\n정석 풀이: 왼쪽 $X\\cup A$에는 $A$의 모든 원소가 있으므로 오른쪽 $X-B$에도 이들이 있어야 하여 $A\\subset X$이다. 오른쪽에는 $B$의 원소가 없으므로 왼쪽에도 없어야 하여 $X\\cap B=\\varnothing$이다. 남은 원소 $8,10$은 각각 자유롭게 포함하거나 제외할 수 있으므로 $X$의 개수는 $2^2=4$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 7,
    level: "중",
    category: "필요충분조건",
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
    "필요조건",
    "충분조건",
    "추론"
  ],
    wide: false,
    content: "세 조건 $p,q,r$에 대하여 $p$는 $q$이기 위한 충분조건이고, $\\sim q$는 $r$이기 위한 필요조건이다. 보기에서 옳은 것을 모두 고른 것은? [4.3점]\nㄱ. $r\\to p$　ㄴ. $q\\to\\sim r$　ㄷ. $r\\to\\sim p$ \n",
    choices: [
    "ㄱ, ㄴ",
    "ㄴ",
    "ㄷ",
    "ㄴ, ㄷ",
    "ㄱ, ㄴ, ㄷ"
  ],
    answer: "④",
    solution: "[키포인트] 충분조건과 필요조건을 명제의 방향으로 바꾸고 대우를 이용한다.\n조건 정리: $p$가 $q$의 충분조건이므로 $p\\to q$이고, $\\sim q$가 $r$의 필요조건이므로 $r\\to\\sim q$이다.\n풀이 방향: 두 명제와 그 대우를 연결하여 보기의 참·거짓을 판단한다.\n정석 풀이: $r\\to\\sim q$의 대우는 $q\\to\\sim r$이므로 ㄴ은 참이다. 또한 $p\\to q\\to\\sim r$이므로 그 대우인 $r\\to\\sim p$도 참이어서 ㄷ이 성립한다. 그러나 $r\\to p$는 주어진 조건에서 얻을 수 없다.\n따라서 정답은 ④이다."
  },
  {
    id: 8,
    level: "중",
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
    "조각함수",
    "범위"
  ],
    wide: false,
    content: "실수 전체의 집합에서 정의된 함수 $f(x)=\\begin{cases}x^2-2&(x\\ge0)\\\\(a+3)x+b&(x\\lt0)\\end{cases}$가 일대일대응이 되도록 하는 $a-b$의 범위는? [4.4점]",
    choices: [
    "$a-b\\lt-1$",
    "$a-b\\le-1$",
    "$a-b\\lt1$",
    "$a-b\\gt-1$",
    "$a-b\\ge-1$"
  ],
    answer: "④",
    solution: "[키포인트] 두 조각의 치역이 겹치지 않으면서 합쳐서 실수 전체가 되어야 한다.\n조건 정리: $x\\ge0$에서 $x^2-2$의 치역은 $[-2,\\infty)$이다.\n풀이 방향: $x\\lt0$인 일차함수의 치역이 정확히 $(-\\infty,-2)$가 되게 한다.\n정석 풀이: $(a+3)x+b$가 $x\\lt0$에서 $(-\\infty,b)$를 치역으로 가지려면 기울기 $a+3$이 양수여야 한다. 두 치역이 겹치거나 빠지지 않으려면 $b=-2$이고 $a+3\\gt0$이어야 한다. 따라서 $a\\gt-3$이고 $a-b=a+2\\gt-1$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 9,
    level: "중",
    category: "함수의 반복",
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
    "반복함수",
    "그래프",
    "주기"
  ],
    wide: false,
    content: "$0\\le x\\le3$에서 정의된 함수 $y=f(x)$의 그래프가 오른쪽 그림과 같고, $f^1=f$, $f^{n+1}=f\\circ f^n$으로 정의할 때, $f^{104}(1)+f^{203}(1)+f^{301}(1)$의 값을 구하면? [4.6점]",
    choices: [
    "$4$",
    "$5$",
    "$6$",
    "$7$",
    "$8$"
  ],
    answer: "⑤",
    solution: "[키포인트] 그래프에서 $1$의 반복함수값이 이루는 주기를 찾는다.\n조건 정리: 그래프에서 $f(1)=2$, $f(2)=3$, $f(3)=1$이다.\n풀이 방향: $1\\to2\\to3\\to1$의 길이 $3$인 주기를 이용해 지수를 $3$으로 나눈다.\n정석 풀이: $104\\equiv2$, $203\\equiv2$, $301\\equiv1\\pmod3$이다. 따라서 $f^{104}(1)=3$, $f^{203}(1)=3$, $f^{301}(1)=2$이다. 이들의 합은 $3+3+2=8$이다.\n따라서 정답은 ⑤이다.",
    image: "assets/images/22_매산고_2학기_중간_고1_기출/q09.png"
  },
  {
    id: 10,
    level: "상",
    category: "역함수의 존재",
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
    "절댓값",
    "기울기"
  ],
    wide: false,
    content: "실수 전체의 집합 $R$에서 $R$로 정의된 함수 $f(x)=-4ax-5+|x-3|$의 역함수가 존재할 때, 실수 $a$의 값이 될 수 없는 것을 고르면? [4.7점]",
    choices: [
    "$-\\frac12$",
    "$-\\frac13$",
    "$\\frac12$",
    "$\\frac13$",
    "$\\frac15$"
  ],
    answer: "⑤",
    solution: "[키포인트] 연속인 조각일차함수가 일대일이려면 꺾이는 점 양쪽의 기울기 부호가 같아야 한다.\n조건 정리: $x\\ge3$에서 기울기는 $1-4a$, $x\\lt3$에서 기울기는 $-1-4a$이다.\n풀이 방향: 두 기울기가 모두 양수이거나 모두 음수가 되는 $a$의 범위를 구한다.\n정석 풀이: 두 기울기가 모두 양수이면 $a\\lt-\\frac14$이고, 모두 음수이면 $a\\gt\\frac14$이다. 기울기가 $0$이면 한 구간에서 함수가 일정하여 역함수가 존재하지 않는다. 보기 중 $-\\frac12,-\\frac13,\\frac12,\\frac13$은 허용 범위에 있지만 $\\frac15$는 $-\\frac14\\lt\\frac15\\lt\\frac14$이므로 허용되지 않는다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 11,
    level: "중",
    category: "일의 자리",
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
    "일의자리",
    "집합",
    "원소합"
  ],
    wide: false,
    content: "자연수 $n$에 대하여 $n^3$의 일의 자리를 $f(n)$이라 하자. 집합 $A=\\{x\\mid x=f(k)\\}$ (단, $k$는 자연수)의 원소의 합을 $\\alpha$라 할 때, $\\alpha+n(A)$의 값은? [4.8점]",
    choices: [
    "$52$",
    "$53$",
    "$54$",
    "$55$",
    "$56$"
  ],
    answer: "④",
    solution: "[키포인트] 세제곱의 일의 자리는 밑의 일의 자리에만 의존한다.\n조건 정리: 자연수의 일의 자리는 $0$부터 $9$까지 반복된다.\n풀이 방향: $0^3,1^3,\\ldots,9^3$의 일의 자리를 모두 조사한다.\n정석 풀이: 일의 자리 $0,1,2,3,4,5,6,7,8,9$를 세제곱하면 각각 $0,1,8,7,4,5,6,3,2,9$가 되어 $0$부터 $9$까지가 모두 한 번씩 나온다. 따라서 $A=\\{0,1,2,3,4,5,6,7,8,9\\}$, $\\alpha=45$, $n(A)=10$이다. 그러므로 $\\alpha+n(A)=55$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 12,
    level: "상",
    category: "명제의 거짓",
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
    "진리집합",
    "부등식",
    "정수개수"
  ],
    wide: false,
    content: "실수 $x$에 대한 두 조건 $p:x^2-2kx+(k-2)(k+2)\\lt0$, $q:\\left|\\frac{x-2}{2}\\right|\\lt k$에 대하여 명제 $p\\to q$가 거짓임을 보일 수 있는 정수인 원소의 개수가 $2$가 되도록 하는 양수 $k$의 범위는? [4.9점]",
    choices: [
    "$1\\lt k\\lt2$",
    "$1\\le k\\lt2$",
    "$\\frac12\\lt k\\lt1$",
    "$\\frac12\\le k\\lt1$",
    "$0\\lt k\\le1$"
  ],
    answer: "③",
    solution: "[키포인트] 명제 $p\\to q$가 거짓이 되는 경우는 $p$가 참이고 $q$가 거짓일 때이다.\n조건 정리: $p$의 진리집합은 $(k-2,k+2)$이고 $q$의 진리집합은 $(2-2k,2+2k)$이다.\n풀이 방향: $p$의 진리집합에서 $q$의 진리집합을 뺀 부분에 들어가는 정수를 센다.\n정석 풀이: $\\frac12\\lt k\\lt1$이면 $k-2$는 $-\\frac32$과 $-1$ 사이, $2-2k$는 $0$과 $1$ 사이이다. 따라서 $p$이면서 $q$가 아닌 정수는 $-1,0$의 두 개이다. $k=\\frac12$에서는 $1$도 포함되어 세 개가 되고, $k=1$에서는 $0$만 남아 한 개가 된다. 다른 보기의 구간에서도 개수가 두 개로 일정하지 않으므로 범위는 $\\frac12\\lt k\\lt1$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 13,
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
    "산술기하평균",
    "절대부등식"
  ],
    wide: false,
    content: "$x\\gt0,y\\gt0$이고 $\\frac1x+\\frac1y=\\frac12$일 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [4.9점]\nㄱ. $\\frac1{x^2}+\\frac1{y^2}\\ge\\frac18$　ㄴ. $x+y\\ge4$　ㄷ. $x^2+y^2\\ge16$",
    choices: [
    "ㄱ",
    "ㄱ, ㄴ",
    "ㄱ, ㄷ",
    "ㄴ, ㄷ",
    "ㄱ, ㄴ, ㄷ"
  ],
    answer: "⑤",
    solution: "[키포인트] 두 양수의 합과 제곱의 합에 관한 기본 부등식을 조건에 적용한다.\n조건 정리: $\\frac1x+\\frac1y=\\frac12$에서 $xy=2(x+y)$이다.\n풀이 방향: 역수의 제곱합, $x+y$, $x^2+y^2$의 하한을 차례로 구한다.\n정석 풀이: $(\\frac1x+\\frac1y)^2\\le2(\\frac1{x^2}+\\frac1{y^2})$이므로 ㄱ은 참이다. 또 $xy=2(x+y)$이고 $x+y\\ge2\\sqrt{xy}$이므로 $x+y\\ge2\\sqrt{2(x+y)}$, 따라서 $x+y\\ge8$이어서 ㄴ은 참이다. 마지막으로 $x^2+y^2\\ge\\frac{(x+y)^2}{2}\\ge32$이므로 ㄷ도 참이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 14,
    level: "상",
    category: "함수방정식",
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
    "함수방정식",
    "대칭",
    "거듭제곱"
  ],
    wide: false,
    content: "정의역이 실수 전체의 집합인 함수 $f(x)$가 임의의 두 실수 $a,b$에 대하여 등식 $f(a+b)+f(a-b)=2f(a)+2f(b)$를 만족시킨다. 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $f(x)$는 상수함수가 아니다.) [4.9점]\nㄱ. $f(0)=0$　\nㄴ. $f(x)$의 그래프는 $y$축 대칭이다.　\nㄷ. $f(1)=4$이면 $f(2^{10})=2^{20}$이다.",
    choices: [
    "ㄴ",
    "ㄱ, ㄴ",
    "ㄱ, ㄷ",
    "ㄴ, ㄷ",
    "ㄱ, ㄴ, ㄷ"
  ],
    answer: "②",
    solution: "[키포인트] 함수방정식에 $0$, 서로 같은 수, 부호가 반대인 수를 대입한다.\n조건 정리: 등식은 모든 실수 $a,b$에 대하여 성립한다.\n풀이 방향: ㄱ, ㄴ을 직접 유도하고 $f(2x)$의 관계로 ㄷ을 검토한다.\n정석 풀이: $a=b=0$을 대입하면 $2f(0)=4f(0)$이므로 $f(0)=0$이다. $a=0$을 대입하면 $f(b)+f(-b)=2f(b)$이므로 $f(-b)=f(b)$여서 그래프는 $y$축 대칭이다. $a=b=x$를 대입하면 $f(2x)=4f(x)$이다. 따라서 $f(1)=4$이면 $f(2^{10})=4^{10}f(1)=4^{11}=2^{22}$이므로 ㄷ은 거짓이다.\n따라서 정답은 ②이다."
  },
  {
    id: 15,
    level: "상",
    category: "합성함수의 그래프",
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
    "조각함수",
    "접점",
    "그래프"
  ],
    wide: false,
    content: "함수 $f(x)=\\begin{cases}x&(x\\lt2)\\\\-\\frac14x+\\frac52&(x\\ge2)\\end{cases}$에 대하여 합성함수 $y=(f\\circ f)(x)$의 그래프가 이차함수 $y=-2x^2+8x+a$의 그래프와 오직 한 점에서 만날 때, 상수 $a$의 값을 구하면? [5점]",
    choices: [
    "$-\\frac{26}{5}$",
    "$-\\frac{49}{8}$",
    "$-\\frac{37}{6}$",
    "$-\\frac{51}{7}$",
    "$-\\frac{77}{9}$"
  ],
    answer: "②",
    solution: "[키포인트] 먼저 합성함수를 구한 뒤 각 구간의 직선과 포물선의 교점 수를 확인한다.\n조건 정리: $x\\lt2$이면 $f(f(x))=x$이고, $x\\ge2$이면 $f(f(x))=-\\frac14x+\\frac52$이므로 $f\\circ f=f$이다.\n풀이 방향: $x\\lt2$인 직선과 포물선이 접하고 다른 구간에서는 만나지 않게 하는 $a$를 찾는다.\n정석 풀이: $x=-2x^2+8x+a$를 정리하면 $2x^2-7x-a=0$이다. 한 점에서 접하려면 판별식 $49+8a=0$이므로 $a=-\\frac{49}{8}$이고 접점의 $x$좌표는 $\\frac74\\lt2$이다. 이 값을 $x\\ge2$의 교점 방정식 $8x^2-33x+10-4a=0$에 넣으면 판별식이 $-15$여서 교점이 없다. 따라서 전체 그래프의 교점은 접점 하나뿐이다.\n따라서 정답은 ②이다."
  },
  {
    id: 16,
    level: "하",
    category: "역함수의 변환",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "단답형",
    layoutTag: "grid",
    tags: [
    "단답형",
    "함수",
    "역함수",
    "그래프변환"
  ],
    wide: false,
    content: "[단답형 1] 일차함수 $f(x)$의 역함수를 $g(x)$라 할 때, $y=f(3x-4)$의 역함수를 $g(x)$에 대한 식으로 나타내면 $y=ag(x)+b$이다. 상수 $a,b$에 대하여 $ab$의 값을 구하시오. [4점]",
    choices: [],
    answer: "$\\frac49$",
    solution: "[키포인트] 원래 함수식에서 $x$와 $y$의 관계를 역함수 $g$로 바꾼다.\n조건 정리: $g$는 $f$의 역함수이므로 $y=f(3x-4)$이면 $g(y)=3x-4$이다.\n풀이 방향: 이 식을 $x$에 대하여 풀고 입력 변수의 이름을 바꾼다.\n정석 풀이: $g(y)=3x-4$에서 $3x=g(y)+4$이므로 $x=\\frac13g(y)+\\frac43$이다. 따라서 주어진 함수의 역함수는 $y=\\frac13g(x)+\\frac43$이고 $a=\\frac13$, $b=\\frac43$이다.\n따라서 구하는 값은 $ab=\\frac49$이다."
  },
  {
    id: 17,
    level: "상",
    category: "집합의 원소 개수",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "단답형",
    layoutTag: "grid",
    tags: [
    "단답형",
    "집합",
    "이차함수",
    "최솟값",
    "원소개수"
  ],
    wide: false,
    content: "[단답형 2] 집합 $A=\\{x\\mid x\\le20\\}$ (단, $x$는 자연수)와 자연수 $n$에 대하여 집합 $B_n$을 $B_n=\\{a(n-a)\\mid a\\in A\\}$로 정의하자. $B_n$의 원소의 개수가 최소가 되도록 하는 $n$의 값을 $k$라 하고, $B_k$의 가장 작은 원소를 $\\alpha$라 할 때, $k+\\alpha$의 값을 구하시오. [5점]",
    choices: [],
    answer: "$41$",
    solution: "[키포인트] $a(n-a)$의 값이 같은 두 자연수는 합이 $n$인 한 쌍을 이룬다.\n조건 정리: $a,b\\in A$에 대하여 $a(n-a)=b(n-b)$이면 $(a-b)(n-a-b)=0$이다.\n풀이 방향: $1$부터 $20$까지를 합이 $n$인 서로 다른 쌍으로 가장 많이 묶는다.\n정석 풀이: 서로 다른 $a,b$가 같은 값을 만들려면 $a+b=n$이어야 한다. $n=21$이면 $(1,20),(2,19),\\ldots,(10,11)$의 $10$쌍이 생겨 $20$개의 입력이 $10$개의 값만 만들며, 이보다 더 많은 쌍은 만들 수 없다. 따라서 $k=21$이다. $B_{21}$에서 $a(21-a)$의 최솟값은 양 끝 $a=1,20$에서 $20$이므로 $\\alpha=20$이다.\n따라서 구하는 값은 $k+\\alpha=21+20=41$이다."
  },
  {
    id: 18,
    level: "중",
    category: "곱셈 함수의 역함수",
    originalCategory: "함수",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03",
    standardUnit: "함수",
    standardUnitOrder: 3,
    questionType: "단답형",
    layoutTag: "grid",
    tags: [
    "단답형",
    "함수",
    "역함수",
    "함수방정식"
  ],
    wide: false,
    content: "[단답형 3] 모든 실수 $a,b$에 대하여 함수 $f(x)$가 $f(a)f(b)=f(a+b)$를 만족시킬 때, $y=f(x)$의 역함수 $y=g(x)$의 성질로 옳은 것만을 있는 대로 고르시오. (단, $f(x)\\gt0,p\\gt0,q\\gt0$)[6점]\nㄱ. $g(1)=0$　\nㄴ. $g(p)+g(q)=g(pq)$　\nㄷ. $g(p^2)=2g(p)$ ",
    choices: [],
    answer: "ㄱ, ㄴ, ㄷ",
    solution: "[키포인트] 주어진 곱셈 관계에 역함수를 적용하면 곱이 합으로 바뀐다.\n조건 정리: $f$는 역함수를 가지며 모든 함수값이 양수이다.\n풀이 방향: 먼저 $f(0)$을 구하고, $p=f(a)$, $q=f(b)$로 놓아 $g$의 관계를 얻는다.\n정석 풀이: $a=b=0$을 대입하면 $f(0)^2=f(0)$이고 $f(0)\\gt0$이므로 $f(0)=1$, 따라서 $g(1)=0$이다. $p=f(a)$, $q=f(b)$라 하면 $pq=f(a)f(b)=f(a+b)$이므로 $g(pq)=a+b=g(p)+g(q)$이다. 여기에 $q=p$를 대입하면 $g(p^2)=2g(p)$이다.\n따라서 ㄱ, ㄴ, ㄷ이 모두 옳다."
  },
  {
    id: 19,
    level: "상",
    category: "집합의 최대최소",
    originalCategory: "집합",
    standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01",
    standardUnit: "집합",
    standardUnitOrder: 1,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "집합",
    "포함배제",
    "최댓값",
    "최솟값"
  ],
    wide: false,
    content: "[서술형 1] 매산고등학교 학생 $200$명을 대상으로 두 체험 활동 장소로 제주도와 서울을 신청한 학생 수를 조사하였더니 제주도를 선택한 학생이 서울을 신청한 학생보다 $30$명이 많았고, 어느 장소도 신청하지 않은 학생은 하나 이상의 장소를 신청한 학생보다 $80$명이 적었다. 체험 활동 장소로 제주도만 신청한 학생 수의 최댓값과 최솟값의 합을 구하는 과정을 서술하시오. [10점]",
    choices: [],
    answer: "$115$",
    solution: "[키포인트] 전체 학생을 합집합과 그 여집합으로 나누고, 교집합의 범위로 제주도만 신청한 수의 범위를 구한다.\n조건 정리: 제주도 신청 집합을 $A$, 서울 신청 집합을 $B$, $n(A\\cap B)=t$라 둔다.\n풀이 방향: 먼저 $n(A\\cup B)$를 구한 뒤 $n(A)-n(B)=30$과 포함배제 원리를 함께 사용한다.\n정석 풀이: $200-n(A\\cup B)=n(A\\cup B)-80$이므로 $n(A\\cup B)=140$이다. $n(A)=n(B)+30$이고 $140=n(A)+n(B)-t$이므로 $n(A)=85+\\frac t2$, $n(B)=55+\\frac t2$이다. 제주도만 신청한 수는 $n(A)-t=85-\\frac t2$이다. $0\\le t\\le n(B)$에서 $0\\le t\\le110$이고 실제 학생 수가 정수이므로 $t$는 짝수이다. 따라서 최댓값은 $t=0$일 때 $85$, 최솟값은 $t=110$일 때 $30$이다.\n따라서 구하는 합은 $85+30=115$이다."
  },
  {
    id: 20,
    level: "상",
    category: "정육각형과 합성함수",
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
    "합성함수",
    "도형",
    "정육각형",
    "넓이"
  ],
    wide: false,
    content: "[서술형 2] 그림과 같이 한 변의 길이가 $1$인 정육각형 $ABCDEF$가 있다. 점 $P$는 점 $A$에서 출발하여 점 $F$까지 화살표 방향으로 정육각형 $ABCDEF$의 변을 따라 움직인다. 점 $P$가 점 $A$로부터 움직인 거리가 $x$ ($0\\lt x\\lt5$)일 때, 삼각형 $PFA$의 넓이를 $f(x)$라 하자. 함수 $f(x)$에 대하여 $(f\\circ f)(a)=\\frac7{32}$인 모든 실수 $a$의 값의 합을 구하는 과정을 서술하시오. [10점]\n",
    choices: [],
    answer: "$5$",
    solution: "[키포인트] 밑변 $FA$를 고정하면 삼각형의 넓이는 점 $P$에서 직선 $FA$까지의 높이에 따라 정해진다.\n조건 정리: 정육각형의 높이를 이용하면 $f(x)=\\frac{\\sqrt3}{4}x$ ($0\\lt x\\le2$), $f(x)=\\frac{\\sqrt3}{2}$ ($2\\le x\\le3$), $f(x)=\\frac{\\sqrt3}{4}(5-x)$ ($3\\le x\\lt5$)이다.\n풀이 방향: $f(a)$의 범위가 $2$보다 작다는 점으로 바깥쪽 $f$를 단순화한 뒤 $f(a)$의 값을 구한다.\n정석 풀이: $0\\lt f(a)\\le\\frac{\\sqrt3}{2}\\lt2$이므로 $f(f(a))=\\frac{\\sqrt3}{4}f(a)$이다. 따라서 $\\frac{\\sqrt3}{4}f(a)=\\frac7{32}$에서 $f(a)=\\frac{7\\sqrt3}{24}$이다. 첫째 구간에서는 $\\frac{\\sqrt3}{4}a=\\frac{7\\sqrt3}{24}$이므로 $a=\\frac76$이고, 셋째 구간에서는 $\\frac{\\sqrt3}{4}(5-a)=\\frac{7\\sqrt3}{24}$이므로 $a=\\frac{23}{6}$이다. 가운데 구간의 함수값은 더 크므로 해가 없다.\n따라서 모든 실수 $a$의 합은 $\\frac76+\\frac{23}{6}=5$이다.",
    image: "assets/images/22_매산고_2학기_중간_고1_기출/q20.png"
  }
];
