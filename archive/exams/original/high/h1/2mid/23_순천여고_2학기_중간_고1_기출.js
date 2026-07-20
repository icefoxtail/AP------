window.examTitle = "23_순천여고_2학기_중간_고1_기출";
window.questionBank = [
  {
    id: 1, level: "하", category: "집합의 상등", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "집합의상등", "원소비교"], wide: false,
    content: "$A=\\{1,a,b+1\\}$, $B=\\{2,5,b\\}$이고 두 집합에 대하여 $A=B$일 때, $a+b$의 값은? [3.6점]",
    choices: ["$2$", "$3$", "$4$", "$5$", "$6$"], answer: "⑤",
    solution: "$1$이 $B$의 원소가 되어야 하므로 $b=1$이다. 그러면 $A=\\{1,a,2\\}$, $B=\\{1,2,5\\}$이므로 $a=5$이다. 따라서 $a+b=6$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 2, level: "하", category: "원소와 부분집합", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "원소", "부분집합", "공집합"], wide: false,
    content: "전체집합 $U=\\{\\varnothing,2,3,\\{1,2\\}\\}$일 때, 다음 중 옳지 않은 것은? [3.7점]",
    choices: ["$\\{2\\}\\subset U$", "$3\\in U$", "$\\varnothing\\in U$", "$\\{1,2\\}\\in U$", "$\\{1,2\\}\\subset U$"], answer: "⑤",
    solution: "$\\{1,2\\}$는 $U$의 원소이지만, 부분집합이 되려면 $1$과 $2$가 모두 $U$의 원소여야 한다. $1\\notin U$이므로 $\\{1,2\\}\\not\\subset U$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 3, level: "하", category: "항등함수와 상수함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "항등함수", "상수함수", "함숫값"], wide: false,
    content: "실수 전체의 집합에서 정의된 두 함수 $f,g$에 대하여 $f$는 항등함수이고 $g$는 상수함수이다. $f(3)=g(2)$일 때, $f(5)+g(5)$의 값은? [3.7점]",
    choices: ["$6$", "$8$", "$10$", "$12$", "$14$"], answer: "②",
    solution: "$f(3)=3$이므로 상수함수 $g$의 값은 항상 $3$이다. 따라서 $f(5)+g(5)=5+3=8$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 4, level: "중", category: "합성함수와 역함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "합성함수", "역함수", "대응"], wide: false,
    content: "아래 그림과 같은 함수 $f:X\\to X$에 대하여 $(f\\circ f)(1)+(f\\circ f^{-1})(2)+(f\\circ f)^{-1}(4)$의 값은? [3.8점]",
    image: "assets/images/23_순천여고_2학기_중간_고1_기출/q04.png", choices: ["$3$", "$5$", "$7$", "$9$", "$11$"], answer: "③",
    solution: "그림에서 $f(1)=3$, $f(2)=4$, $f(3)=2$, $f(4)=1$이다. 따라서 $(f\\circ f)(1)=2$, $(f\\circ f^{-1})(2)=2$이고, $f^2(3)=4$이므로 $(f\\circ f)^{-1}(4)=3$이다. 합은 $7$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 5, level: "하", category: "명제의 대우", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "대우", "참거짓", "집합"], wide: false,
    content: "다음 명제 중 그 대우가 참인 것은? (단, $x,y$는 실수, $A,B,C$는 집합이다.) [3.8점]",
    choices: ["사다리꼴은 평행사변형이다.", "$x<-1$이면 $x^2>1$이다.", "$x<0$ 또는 $y<0$이면 $xy<0$이다.", "$x+y\\sqrt2=0$이면 $x=0$, $y=0$이다.", "$(A\\cup C)\\subset(B\\cup C)$이면 $A\\subset B$이다."], answer: "②",
    solution: "명제와 대우의 참·거짓은 같다. ②는 $x<-1$이면 $|x|>1$이므로 $x^2>1$이어서 참이다. 나머지는 반례가 존재한다.\n결론: 정답은 ②이다."
  },
  {
    id: 6, level: "하", category: "역함수의 존재 조건", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "역함수", "일대일대응", "일차함수"], wide: false,
    content: "집합 $X=\\{x\\mid-1\\le x\\le2\\}$에서 $X$로의 함수 $f(x)=ax+b$가 역함수를 가지도록 하는 상수 $a,b$에 대하여 $a^2+b^2$의 값은? (단, $a<0$) [3.9점]",
    choices: ["$2$", "$4$", "$5$", "$10$", "$13$"], answer: "①",
    solution: "$a<0$이고 $f$가 $X$ 위의 일대일대응이므로 양 끝점이 서로 바뀌어야 한다. $f(-1)=2$, $f(2)=-1$을 풀면 $a=-1$, $b=1$이다. 따라서 $a^2+b^2=2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 7, level: "중", category: "진리집합", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "진리집합", "포함관계", "집합의연산"], wide: false,
    content: "전체집합 $U$에서 정의된 두 조건 $p,q$의 진리집합을 각각 $P,Q$라 하면 $(P\\cap Q)\\cup P^C=U$가 성립한다. 다음 명제 중 항상 참인 것은? [3.9점]",
    choices: ["$q\\to p$", "$q\\to\\sim p$", "$p\\to q$", "$p\\to\\sim q$", "$\\sim p\\to\\sim q$"], answer: "③",
    solution: "$(P\\cap Q)\\cup P^C=(P\\cup P^C)\\cap(Q\\cup P^C)=Q\\cup P^C=U$이므로 $P\\subset Q$이다. 따라서 $p\\to q$가 항상 참이다.\n결론: 정답은 ③이다."
  },
  {
    id: 8, level: "중", category: "진리집합의 포함", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "진리집합", "절대부등식", "정수"], wide: false,
    content: "실수 $x$에 대하여 두 조건 $p:|x-a|>2$, $q:x^2-x-20<0$일 때, 명제 $\\sim p\\to q$가 참이 되도록 하는 정수 $a$의 개수는? [4점]",
    choices: ["$2$", "$3$", "$4$", "$5$", "$6$"], answer: "③",
    solution: "$\\sim p$의 진리집합은 $[a-2,a+2]$, $q$의 진리집합은 $(-4,5)$이다. 포함되려면 $a-2>-4$, $a+2<5$이므로 $-2<a<3$이다. 정수 $a=-1,0,1,2$의 $4$개이다.\n결론: 정답은 ③이다."
  },
  {
    id: 9, level: "중", category: "대우를 이용한 증명", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "대우", "증명", "인수분해"], wide: false,
    content: "명제 '실수 $x,y$에 대하여 $xy+1\\le x+y$이면 $x\\le1$ 또는 $y\\le1$이다.'를 대우로 증명하는 과정에서 (가), (나), (다)에 알맞은 것은? [4점]\n대우는 (가)이면 $xy+1>x+y$이다. $xy+1-(x+y)=$(나)$(y-1)$이고, (가)이면 이 값은 (다)$0$이다.",
    choices: ["$x>1$이고 $y>1$, $1-x$, $<$", "$x>1$ 또는 $y>1$, $x-1$, $>$", "$x>1$이고 $y>1$, $x-1$, $>$", "$x\\ge1$ 또는 $y\\ge1$, $x-1$, $<$", "$x\\ge1$이고 $y\\ge1$, $1-x$, $>$"], answer: "③",
    solution: "결론의 부정은 $x>1$이고 $y>1$이다. $xy+1-x-y=(x-1)(y-1)$이고 두 인수가 모두 양수이므로 곱도 $0$보다 크다.\n결론: 정답은 ③이다."
  },
  {
    id: 10, level: "중", category: "집합과 이차부등식", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "이차부등식", "합집합", "교집합"], wide: false,
    content: "실수 전체의 집합 $\\mathbb R$의 두 부분집합 $A=\\{x\\mid x^2+2x-15\\le0\\}$, $B=\\{x\\mid x^2+ax+b>0\\}$가 $A\\cup B=\\mathbb R$, $A\\cap B=\\{x\\mid-1<x\\le3\\}$을 모두 만족시킬 때, $a-b$의 값은? [4점]",
    choices: ["$-2$", "$-1$", "$0$", "$1$", "$2$"], answer: "④",
    solution: "$A=[-5,3]$이다. 조건을 만족하는 $B$는 $(-\\infty,-5)\\cup(-1,\\infty)$이므로 $x^2+ax+b=(x+5)(x+1)$로 둘 수 있다. 따라서 $a=6$, $b=5$이고 $a-b=1$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 11, level: "하", category: "이차방정식의 실근 조건", originalCategory: "이차방정식", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-05", standardUnit: "이차방정식", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "이차방정식", "판별식", "정수", "최솟값"], wide: false,
    content: "$x$에 대한 이차방정식 $x^2-ax+a^2-3a-9=0$이 실근을 갖도록 하는 정수 $a$의 최솟값은? [4점]",
    choices: ["$-2$", "$-1$", "$0$", "$1$", "$2$"], answer: "①",
    solution: "판별식 $D=a^2-4(a^2-3a-9)=-3a^2+12a+36$이 $0$ 이상이어야 한다. 이는 $-2\\le a\\le6$이므로 정수 $a$의 최솟값은 $-2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 12, level: "중", category: "역함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "역함수", "함수식", "함숫값"], wide: false,
    content: "함수 $f$가 $f\\left(\\dfrac{2-x}{3}\\right)=3x-6$일 때, $(f\\circ g)(x)=x$를 만족시키는 함수 $g(x)$에 대하여 $g(-3)$의 값은? [4점]",
    choices: ["$\\dfrac13$", "$\\dfrac23$", "$1$", "$\\dfrac43$", "$\\dfrac53$"], answer: "①",
    solution: "$t=(2-x)/3$으로 두면 $x=2-3t$이고 $f(t)=3(2-3t)-6=-9t$이다. 따라서 $g=f^{-1}$이고 $g(x)=-x/9$이므로 $g(-3)=1/3$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 13, level: "중", category: "직선과 원의 위치 관계", originalCategory: "원의 방정식", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-11", standardUnit: "원의 방정식", standardUnitOrder: 11,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원의방정식", "직선", "교점", "거리", "매개변수"], wide: false,
    content: "집합 $A=\\{(x,y)\\mid y=m(x+3)-1,\\ m\\text{은 실수}\\}$이고 집합 $B=\\{(x,y)\\mid x^2+y^2=5\\}$일 때, $n(A\\cap B)=2$를 만족하는 $m$의 범위가 $a<m<b$이다. 이때 $a+b$의 값은? [4.1점]",
    choices: ["$-1$", "$-\\dfrac12$", "$1$", "$\\dfrac32$", "$2$"], answer: "④",
    solution: "직선은 $mx-y+3m-1=0$이다. 원점에서 직선까지의 거리가 반지름 $\\sqrt5$보다 작아야 하므로 $(3m-1)^2<5(m^2+1)$이다. 정리하면 $(2m+1)(m-2)<0$이므로 $-1/2<m<2$이다. 따라서 $a+b=3/2$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 14, level: "중", category: "부분집합의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "부분집합", "배수", "포함배제"], wide: false,
    content: "전체집합 $U=\\{x\\mid x\\text{는 }24\\text{ 이하의 자연수}\\}$의 부분집합 $B_n=\\{x\\mid x\\text{는 }n\\text{의 배수}\\}$에 대하여 $B_4\\cup X=B_4$, $B_3\\cap X\\ne\\varnothing$을 모두 만족시키는 $U$의 부분집합 $X$의 개수는? [4.1점]",
    choices: ["$12$", "$16$", "$32$", "$36$", "$48$"], answer: "⑤",
    solution: "$X\\subset B_4=\\{4,8,12,16,20,24\\}$이다. 이 중 $B_3$에도 속하는 원소는 $12,24$이므로 둘 중 적어도 하나를 포함해야 한다. 따라서 $2^6-2^4=48$개이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 15, level: "중", category: "필요조건과 충분조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "필요조건", "충분조건", "진리집합"], wide: false,
    content: "전체집합 $U$의 공집합이 아닌 세 부분집합 $P,Q,R$가 각각 조건 $p,q,r$의 진리집합이다. $p$는 $q$이기 위한 필요조건, $r$은 $\\sim p$이기 위한 충분조건일 때, <보기> 중 옳은 것만을 있는 대로 고른 것은? [4.1점]\nㄱ. $P\\cap Q=Q$\nㄴ. $R\\subset Q^C$\nㄷ. $P-R=\\varnothing$\nㄹ. $P\\cup Q^C=U$",
    choices: ["ㄱ, ㄴ", "ㄴ, ㄷ", "ㄷ, ㄹ", "ㄱ, ㄹ", "ㄱ, ㄴ, ㄹ"], answer: "⑤",
    solution: "$Q\\subset P$이고 $R\\subset P^C$이다. 따라서 ㄱ은 참이고, $R\\subset P^C\\subset Q^C$이므로 ㄴ도 참이다. $P-R=P$이므로 ㄷ은 거짓이며, $Q\\subset P$에서 $P\\cup Q^C=U$이므로 ㄹ은 참이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 16, level: "중", category: "선분의 곱의 최댓값", originalCategory: "평면좌표", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-09", standardUnit: "평면좌표", standardUnitOrder: 9,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "평면좌표", "선분", "산술기하평균", "최댓값"], wide: false,
    content: "좌표평면에서 직선 $2x+y=6$ 위의 제1사분면의 점을 $P$, 이 직선이 $x$축, $y$축과 만나는 점을 각각 $A,B$라 하자. 두 선분 $AP,BP$의 길이를 각각 $l_1,l_2$라 할 때, $4l_1l_2$의 최댓값은? [4.1점]",
    choices: ["$12$", "$28$", "$32$", "$45$", "$64$"], answer: "④",
    solution: "$A=(3,0)$, $B=(0,6)$이므로 $l_1+l_2=AB=3\\sqrt5$이다. $4l_1l_2\\le(l_1+l_2)^2=45$이고, $P$가 중점일 때 등호가 성립한다.\n결론: 정답은 ④이다."
  },
  {
    id: 17, level: "중", category: "삼각형의 외접원", originalCategory: "원의 방정식", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-11", standardUnit: "원의 방정식", standardUnitOrder: 11,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원의방정식", "내분점", "외접원", "넓이"], wide: false,
    content: "좌표평면 위에 세 점 $A(0,4)$, $B(4,4)$, $C(4,0)$이 있다. 세 선분 $OA,AB,BC$를 $3:1$로 내분하는 점을 각각 $P,Q,R$라 하고 세 점 $P,Q,R$를 지나는 원을 $C$라 할 때, 원 $C$의 넓이는? (단, $O$는 원점이다.) [4.2점]",
    choices: ["$\\dfrac72\\pi$", "$4\\pi$", "$\\dfrac92\\pi$", "$5\\pi$", "$\\dfrac{11}2\\pi$"], answer: "④",
    solution: "$P=(0,3)$, $Q=(3,4)$, $R=(4,1)$이다. $\\overrightarrow{QP}\\cdot\\overrightarrow{QR}=(-3,-1)\\cdot(1,-3)=0$이므로 삼각형 $PQR$은 $Q$에서 직각이다. 빗변 $PR=2\\sqrt5$이므로 외접원의 반지름은 $\\sqrt5$, 넓이는 $5\\pi$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 18, level: "상", category: "함수의 반복합성", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "일대일대응", "순열", "반복합성", "소수"], wide: false,
    content: "집합 $X=\\{1,2,3,4,5\\}$에서 일대일대응 $f:X\\to X$가 (가) 모든 $x\\in X$에 대하여 $f(x)\\ne x$, (나) $p$가 소수이면 $f(p)$도 소수라는 조건을 만족한다. $f^1(x)=f(x)$, $f^{n+1}(x)=f(f^n(x))$로 정의할 때, $f^{99}(5)+f^{99}(4)$의 값은? [4.3점]",
    choices: ["$6$", "$7$", "$8$", "$9$", "$10$"], answer: "①",
    solution: "소수 집합 $\\{2,3,5\\}$에서 고정점이 없는 일대일대응은 $3$-순환이고, 남은 $\\{1,4\\}$에서는 서로 바뀐다. $99$는 $3$의 배수이므로 $f^{99}(5)=5$, 홀수이므로 $f^{99}(4)=1$이다. 합은 $6$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 19, level: "상", category: "합성함수 방정식", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "이차함수", "합성함수", "실근의개수"], wide: false,
    content: "이차함수 $f(x)$가 $f(0)=f(4)=0$이고, 이차방정식 $f(x)-4(x-4)=0$의 실근의 개수가 $1$이다. 방정식 $(f\\circ f)(x)=k$의 서로 다른 실근의 개수가 $3$일 때, 상수 $k$의 값은? [4.3점]",
    choices: ["$24$", "$26$", "$28$", "$30$", "$32$"], answer: "⑤",
    solution: "$f(x)=ax(x-4)$로 두면 $f(x)-4(x-4)=(x-4)(ax-4)$가 중근을 가져야 하므로 $a=1$이다. 따라서 $f(x)=(x-2)^2-4$이다. $f(t)=k$의 한 근이 $t=-4$일 때 그 전상은 한 점, 다른 근의 전상은 두 점이 되어 총 $3$개이다. $f(-4)=32$이므로 $k=32$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 20, level: "상", category: "조건제시 집합", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "조건제시법", "교집합", "여집합", "자연수"], wide: false,
    content: "전체집합 $U=\\{x\\mid x\\text{는 }15\\text{ 이하의 자연수}\\}$의 부분집합 $A_k=\\{x\\mid x(y-k)=20,\\ y\\in U\\}$, $B=\\left\\{x\\mid\\dfrac{20-x}{5}\\in U\\right\\}$에 대하여 $n(A_k\\cap B^C)=2$가 되도록 하는 모든 자연수 $k$의 개수는? [4.4점]",
    choices: ["$3$", "$5$", "$7$", "$10$", "$15$"], answer: "②",
    solution: "$B=\\{5,10,15\\}$이고 $A_k$의 원소는 $20/x+k\\in U$인 $20$의 약수 $x$, 즉 $\\{2,4,5,10\\}$에서 정해진다. $k\\le5$일 때 $A_k\\cap B^C=\\{2,4\\}$이고, 그보다 크면 원소 수가 달라진다. 따라서 자연수 $k=1,2,3,4,5$의 $5$개이다.\n결론: 정답은 ②이다."
  },
  {
    id: 21, level: "중", category: "집합의 원소의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "집합", "합집합", "교집합", "최댓값", "최솟값"], wide: false,
    content: "[서술형 1] 민지네 반 학생 $30$명을 대상으로 동아리 활동을 조사하였다. 수학 동아리에 참여한 학생이 $17$명, 과학 동아리에 참여한 학생이 $22$명일 때, 두 동아리에 모두 참여한 학생의 최댓값을 $a$, 최솟값을 $b$라 하자. $a,b$를 집합 기호나 벤다이어그램을 이용하여 구하시오. [6점]",
    choices: [], answer: "$a=17$, $b=9$", solution: "두 집합을 $M,S$라 하면 $n(M\\cap S)\\le\\min(17,22)=17$이므로 최댓값은 $17$이다. 또 $n(M\\cup S)\\le30$이므로 $17+22-n(M\\cap S)\\le30$, 따라서 $n(M\\cap S)\\ge9$이다. 최솟값은 $9$이다."
  },
  {
    id: 22, level: "상", category: "명제의 부정", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "부정", "존재명제", "이차부등식", "매개변수"], wide: false,
    content: "[서술형 2] 명제 '어떤 실수 $x$에 대하여 $(a-1)x^2+2(a-1)x-2>0$이다.'에 대하여 (1) 주어진 명제의 부정을 쓰고, (2) 그 부정이 참이 되도록 하는 실수 $a$의 범위를 구하시오. [7점]",
    choices: [], answer: "(1) 모든 실수 $x$에 대하여 $(a-1)x^2+2(a-1)x-2\\le0$이다. (2) $-1\\le a\\le1$", solution: "부정은 모든 실수 $x$에서 식이 $0$ 이하라는 것이다. $a=1$이면 항상 $-2$이므로 성립한다. $a<1$일 때 아래로 열린 이차식의 최댓값은 $x=-1$에서 $-a-1$이므로 $-a-1\\le0$, 즉 $a\\ge-1$이어야 한다. 따라서 $-1\\le a\\le1$이다."
  },
  {
    id: 23, level: "상", category: "함수와 역함수의 그래프", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "함수", "역함수", "그래프", "교점", "이차방정식"], wide: false,
    content: "[서술형 3] 정의역이 $\\{x\\mid x\\ge1\\}$이고 공역이 $\\{y\\mid y\\ge k-1\\}$인 함수 $f(x)=x^2-2x+k$의 역함수를 $g(x)$라 하자. 두 함수 $y=f(x)$와 $y=g(x)$의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 범위를 구하시오. [7점]",
    choices: [], answer: "$2\\le k<\\dfrac94$", solution: "$f$는 정의역에서 증가하므로 $f$와 $f^{-1}$의 교점은 $y=x$ 위에 있다. $f(x)=x$에서 $x^2-3x+k=0$이다. 서로 다른 두 근을 가지려면 $9-4k>0$, 즉 $k<9/4$이고, 두 근이 모두 정의역 $x\\ge1$에 있으려면 작은 근 $(3-\\sqrt{9-4k})/2\\ge1$, 즉 $k\\ge2$이다. 따라서 $2\\le k<9/4$이다."
  }
];
