window.examTitle = "23_강남여고_2학기_중간_고1_기출";
window.questionBank = [
  {
    id: 1, level: "하", category: "집합의 포함 관계", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "원소", "부분집합"], wide: false,
    content: "집합 $A=\\{1,2,3\\}$에 대하여, 다음 중 옳은 것은? [2.9점]",
    choices: ["$2\\subset A$", "$\\{2\\}\\subset A$", "$\\{2\\}\\in A$", "$3\\notin A$", "$\\{4\\}\\subset A$"], answer: "②",
    solution: "$2$는 $A$의 원소이므로 한 원소 집합 $\\{2\\}$는 $A$의 부분집합이다. 반면 $2$ 자체는 집합이 아니고, $\\{2\\}$는 $A$의 원소가 아니다.\n결론: 정답은 ②이다."
  },
  {
    id: 2, level: "하", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "합집합", "여집합", "원소의개수"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $n(U)=40$, $n(A)=18$, $n(A\\cap B)=9$, $n(A^C\\cap B^C)=12$일 때, $n(B)$의 값은? [3점]",
    choices: ["$15$", "$16$", "$17$", "$18$", "$19$"], answer: "⑤",
    solution: "$n(A^C\\cap B^C)=n((A\\cup B)^C)=12$이므로 $n(A\\cup B)=40-12=28$이다.\n$28=18+n(B)-9$에서 $n(B)=19$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 3, level: "중", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "차집합", "집합의상등"], wide: false,
    content: "두 집합 $A=\\{3,a,a+2\\}$, $B=\\{5,3a-2,a^2-2a+3\\}$에 대하여 $A-B=\\{2\\}$일 때, 집합 $A$의 모든 원소의 합은? (단, $a$는 상수) [3.1점]",
    choices: ["$6$", "$7$", "$9$", "$11$", "$15$"], answer: "③",
    solution: "$2\\in A$이므로 $a=2$ 또는 $a=0$이다. $a=2$이면 $A=\\{2,3,4\\}$, $B=\\{3,4,5\\}$로 $A-B=\\{2\\}$를 만족한다. $a=0$이면 조건을 만족하지 않는다. 따라서 합은 $2+3+4=9$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 4, level: "하", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "벤다이어그램", "원소의개수"], wide: false,
    content: "벤 다이어그램에서 $n(U)=40$, $n(A)=23$, $n(B)=19$, $n(A\\cup B)=35$일 때, 색칠한 부분을 나타내는 집합의 원소의 개수는? [3.2점]",
    image: "assets/images/23_강남여고_2학기_중간_고1_기출/q04.png", choices: ["$12$", "$13$", "$15$", "$27$", "$29$"], answer: "①",
    solution: "색칠한 부분은 $(A\\cap B)\\cup(A\\cup B)^C$이다. $n(A\\cap B)=23+19-35=7$이고 $n((A\\cup B)^C)=40-35=5$이므로 원소의 개수는 $7+5=12$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 5, level: "하", category: "명제", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "전칭명제", "존재명제", "판별식"], wide: false,
    content: "<보기>에서 참인 명제만을 있는 대로 고른 것은? [3.4점]\nㄱ. 모든 자연수 $x$에 대하여 $2x-1>0$이다.\nㄴ. 어떤 자연수 $x$에 대하여 $x^2-2x=0$이다.\nㄷ. 어떤 실수 $x$에 대하여 $x^2+x+3=0$이다.",
    choices: ["ㄱ", "ㄷ", "ㄱ, ㄴ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"], answer: "③",
    solution: "자연수 $x$에 대해 $2x-1>0$이므로 ㄱ은 참이다. ㄴ은 $x=2$일 때 성립한다. ㄷ의 이차방정식은 판별식이 $1-12=-11<0$이므로 실근이 없다.\n결론: 정답은 ③이다."
  },
  {
    id: 6, level: "하", category: "필요조건과 충분조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "충분조건", "조건"], wide: false,
    content: "조건 '$p:x=1$'이 조건 $q$이기 위한 충분조건일 때, 다음 중 $q$가 될 수 있는 것은? [3.5점]",
    choices: ["$x=2$", "$x<2$", "$x>2$", "$2x+1=5$", "$x^2=x+1$"], answer: "②",
    solution: "$p$가 $q$의 충분조건이면 $x=1$일 때 $q$가 참이어야 한다. 보기 중 $x=1$을 대입하여 참인 것은 $x<2$뿐이다.\n결론: 정답은 ②이다."
  },
  {
    id: 7, level: "하", category: "함수의 뜻", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "정의역", "공역", "치역", "대응"], wide: false,
    content: "다음 그림과 같이 정의된 함수 $f:X\\to Y$에 대한 설명으로 옳지 않은 것은? [3.7점]",
    image: "assets/images/23_강남여고_2학기_중간_고1_기출/q07.png",
    choices: ["정의역은 $\\{1,2,3\\}$이다.", "공역은 $\\{a,b,c\\}$이다.", "치역은 $\\{b,c\\}$이다.", "$f(1)=b$", "$Y$의 원소 $a$에 대응하는 $X$의 원소가 없으므로 함수가 아니다."], answer: "⑤",
    solution: "$X$의 각 원소 $1,2,3$이 $Y$의 원소 하나에 각각 대응하므로 함수이다. 공역의 원소 $a$가 치역에 포함되지 않아도 함수의 정의에 어긋나지 않는다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 8, level: "하", category: "항등함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "항등함수", "함숫값"], wide: false,
    content: "집합 $X=\\{-1,0,1\\}$에 대하여 다음 중 $X$에서 $X$로의 항등함수인 것은? [3.8점]",
    choices: ["$f(x)=-2x$", "$g(x)=x^2$", "$h(x)=x^3$", "$i(x)=\\sqrt{x^3}$", "$j(x)=\\begin{cases}-1&(x\\ge0)\\\\|x-1|&(x<0)\\end{cases}$"], answer: "③",
    solution: "$x=-1,0,1$에서 모두 $x^3=x$이므로 $h(x)=x^3$은 $X$의 각 원소를 자기 자신에 대응시킨다.\n결론: 정답은 ③이다."
  },
  {
    id: 9, level: "중", category: "합성함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "합성함수", "대응"], wide: false,
    content: "두 집합 $X=\\{1,2,3,4\\}$, $Y=\\{3,4,5,6\\}$에 대하여 두 함수 $f:X\\to Y$, $g:Y\\to X$가 다음 그림과 같이 정의될 때, $(g\\circ f)(1)+(f\\circ g)(5)$의 값은? [3.9점]",
    image: "assets/images/23_강남여고_2학기_중간_고1_기출/q09.png", choices: ["$1$", "$3$", "$5$", "$7$", "$9$"], answer: "④",
    solution: "그림에서 $f(1)=5$, $g(5)=4$, $f(4)=3$이다. 따라서 $(g\\circ f)(1)=g(5)=4$, $(f\\circ g)(5)=f(4)=3$이므로 합은 $7$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 10, level: "하", category: "역함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "역함수", "일차함수"], wide: false,
    content: "함수 $f(x)=ax+3$과 그 역함수 $f^{-1}(x)$가 서로 같을 때, 상수 $a$의 값은? [4점]",
    choices: ["$-1$", "$0$", "$1$", "$2$", "$3$"], answer: "①",
    solution: "$y=ax+3$에서 $x=\\dfrac{y-3}{a}$이므로 $f^{-1}(x)=\\dfrac1a x-\\dfrac3a$이다. 두 함수의 계수와 상수항을 비교하면 $a=\\dfrac1a$, $3=-\\dfrac3a$이고, 이를 만족하는 값은 $a=-1$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 11, level: "중", category: "명제의 역과 대우", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "역", "대우", "동치"], wide: false,
    content: "실수 $x,y$에 대하여 다음 중 역과 대우가 모두 참인 명제는? [4.1점]",
    choices: ["$x=2$이고 $y=3$이면 $xy=6$이다.", "$xy>0$이면 $x>0$이고 $y>0$이다.", "두 삼각형이 서로 합동이면 그 넓이가 서로 같다.", "$x^2+y^2=0$이면 $|x|+|y|=0$이다.", "$x>y$이면 $x^2>y^2$이다."], answer: "④",
    solution: "$x^2+y^2=0$은 $x=y=0$과 동치이고, 이는 $|x|+|y|=0$과도 동치이다. 따라서 주어진 명제와 그 역이 모두 참이며, 명제의 대우도 참이다.\n결론: 정답은 ④이다."
  },
  {
    id: 12, level: "중", category: "명제의 역", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "역", "진리집합", "매개변수"], wide: false,
    content: "실수 $x$에 대하여 명제 '$x<2a-3$ 또는 $x>a^2+a-2$이면 $a-1<x<a+2$이다.'의 역이 거짓이 되도록 하는 양의 정수 $a$의 개수는? [4.2점]",
    choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "③",
    solution: "역이 거짓이려면 $a-1<x<a+2$이면서 $2a-3\\le x\\le a^2+a-2$인 실수 $x$가 존재해야 한다. 양의 정수 $a$에 대해 구간이 겹치는 조건은 $a<5$이고 $a>1$이므로 $a=2,3,4$의 세 개이다.\n결론: 정답은 ③이다."
  },
  {
    id: 13, level: "중", category: "절대부등식", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "절대부등식", "코시슈바르츠", "최댓값"], wide: false,
    content: "실수 $x,y$에 대하여 $x^2+y^2=40$일 때, $(x+3y)^2$의 최댓값과 양수 $x$의 값은? [4.3점]",
    choices: ["$125,2$", "$400,2$", "$225,3$", "$400,4$", "$450,3$"], answer: "②",
    solution: "코시-슈바르츠 부등식에 의해 $(x+3y)^2\\le(1^2+3^2)(x^2+y^2)=400$이다. 등호는 $x:y=1:3$일 때 성립하므로 양수 $x$에 대해 $(x,y)=(2,6)$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 14, level: "중", category: "함수의 합성", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "합성함수", "반복합성", "대응"], wide: false,
    content: "집합 $X=\\{1,2,3,4\\}$에서 $X$로의 함수 $f$가 다음 그림과 같을 때, $f^{2023}(2)-f^{2023}(3)$의 값은? (단, $f^1=f$, $f^2=f\\circ f$, $f^{n+1}=f\\circ f^n$, $n$은 자연수) [4.4점]",
    image: "assets/images/23_강남여고_2학기_중간_고1_기출/q14.png", choices: ["$-2$", "$-1$", "$0$", "$1$", "$2$"], answer: "⑤",
    solution: "그림에서 $1\\to3\\to2\\to4\\to1$의 주기를 가지므로 $f^4$는 항등함수이다. $2023=4\\cdot505+3$이므로 $f^{2023}=f^3$이다. 따라서 $f^{2023}(2)=3$, $f^{2023}(3)=1$이고 차는 $2$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 15, level: "중", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "여집합", "드모르간법칙", "새로운연산"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $A*B$를 $A*B=(U-A)\\cup(U-B)$로 정의할 때, <보기> 중 옳은 것을 모두 고른 것은? [4.5점]\nㄱ. $A*A^C=\\varnothing$\nㄴ. $A*\\varnothing=U$\nㄷ. $A*U=A^C$",
    choices: ["ㄱ", "ㄴ", "ㄱ, ㄴ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"], answer: "④",
    solution: "$A*B=A^C\\cup B^C=(A\\cap B)^C$이다. 따라서 $A*A^C=U$로 ㄱ은 거짓, $A*\\varnothing=U$로 ㄴ은 참, $A*U=A^C$로 ㄷ은 참이다.\n결론: 정답은 ④이다."
  },
  {
    id: 16, level: "중", category: "부분집합의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "부분집합", "원소의합", "경우의수"], wide: false,
    content: "자연수 전체의 집합의 두 부분집합 $A=\\{1,2,3,4,5,6\\}$, $B=\\{4,5,6,7,8\\}$에 대하여 $X\\cap A^C=\\varnothing$, $(A-B)\\cup X=X$를 만족시키는 집합 $X$를 $X_1,X_2,\\ldots,X_n$이라 하자. 집합 $X_i$의 모든 원소의 합을 $S_i$라 할 때, $S_1+S_2+\\cdots+S_n$의 값은? [4.6점]",
    choices: ["$105$", "$108$", "$110$", "$112$", "$115$"], answer: "②",
    solution: "조건에서 $A-B=\\{1,2,3\\}\\subset X\\subset A$이다. 따라서 $4,5,6$의 포함 여부를 자유롭게 정해 $2^3=8$개이다. $1,2,3$은 각각 8번, $4,5,6$은 각각 4번 더해지므로 합은 $8(1+2+3)+4(4+5+6)=108$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 17, level: "상", category: "귀류법", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "귀류법", "무리수", "증명"], wide: false,
    content: "다음은 $n$이 자연수일 때 $\\sqrt{n(n+1)}$은 유리수가 아님을 증명한 것이다. 빈칸 (가), (나), (다)에 알맞은 것은? [4.7점]\n$\\sqrt{n(n+1)}=\\dfrac ab$ ($a,b$는 서로소인 자연수)라 두고 제곱하면 $n(n+1)=\\dfrac{a^2}{b^2}$이다. 따라서 $b^2=$(가). 이를 변형하면 $(2n+1)^2-4a^2=$(나), 즉 $(2n+1+2a)(2n+1-2a)=$(나)이다. 따라서 두 인수는 (다).",
    choices: ["(가) $2$, (나) $4$, (다) 모두 $2$이거나 모두 $-2$", "(가) $2$, (나) $4$, (다) 모두 $1$이거나 모두 $-1$", "(가) $1$, (나) $2$, (다) 모두 $1$이거나 모두 $-1$", "(가) $1$, (나) $1$, (다) 모두 $2$이거나 모두 $-2$", "(가) $1$, (나) $1$, (다) 모두 $1$이거나 모두 $-1$"], answer: "⑤",
    solution: "$a,b$가 서로소이고 $a^2/b^2$이 자연수이므로 $b^2=1$이다. 이에 따라 $4n^2+4n=4a^2$이고 $(2n+1)^2-4a^2=1$이다. 두 정수의 곱이 $1$이므로 두 인수는 모두 $1$이거나 모두 $-1$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 18, level: "상", category: "역함수와 합성함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "일대일대응", "합성함수", "역함수"], wide: false,
    content: "집합 $X=\\{1,2,3,4\\}$에 대하여 $X$에서 $X$로의 일대일대응인 $f,g$가 $f(1)=3$, $g(2)=4$, $(g\\circ f)(1)=3$, $(g\\circ f)(2)=4$, $(g\\circ f)(3)=(f\\circ g)(3)$을 만족할 때, $f^{-1}(1)+g^{-1}(2)$의 값은? [4.8점]",
    choices: ["$4$", "$5$", "$6$", "$7$", "$8$"], answer: "④",
    solution: "$g(f(1))=g(3)=3$이고 $g(f(2))=4=g(2)$이므로 일대일성에서 $f(2)=2$이다. 마지막 조건은 $g(f(3))=f(3)$이므로 가능한 대응을 정리하면 $f(3)=1$, $f(4)=4$, $g(1)=1$, $g(4)=2$이다. 따라서 $f^{-1}(1)=3$, $g^{-1}(2)=4$로 합은 $7$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 19, level: "중", category: "합성함수", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "합성함수", "구간별함수"], wide: false,
    content: "두 함수 $f(x)=\\begin{cases}-x^2+1&(x<0)\\\\3x+1&(x\\ge0)\\end{cases}$, $g(x)=x+2$에 대하여 함수 $h(x)$가 $(h\\circ g)(x)=f(x)$를 만족시킬 때, $h(-1)+h(3)$의 값은? [4.9점]",
    choices: ["$-4$", "$-2$", "$0$", "$2$", "$4$"], answer: "①",
    solution: "$h(x+2)=f(x)$이므로 $h(t)=f(t-2)$이다. 따라서 $h(-1)=f(-3)=-8$, $h(3)=f(1)=4$이고 합은 $-4$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 20, level: "상", category: "함수와 역함수의 그래프", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "역함수", "구간별함수", "그래프", "넓이"], wide: false,
    content: "함수 $f(x)=\\begin{cases}-\\dfrac12x+1&(x<2)\\\\-4x+8&(x\\ge2)\\end{cases}$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프로 둘러싸인 부분의 넓이는 $\\dfrac ab$이다. $a+b$의 값은? (단, $a,b$는 서로소이다.) [5점]",
    image: "assets/images/23_강남여고_2학기_중간_고1_기출/q20.png", choices: ["$13$", "$15$", "$17$", "$21$", "$23$"], answer: "③",
    solution: "역함수의 그래프는 $y=x$에 대한 대칭이다. 두 그래프의 교점은 $(-4,3)$, $(2/3,2/3)$, $(3,-4)$이고, 꺾이는 점은 $(2,0)$과 $(0,2)$이다. $y=x$ 한쪽의 두 삼각형 넓이가 각각 $1/3$, $2$이므로 전체 넓이는 $2(1/3+2)=14/3$이다. 따라서 $a+b=14+3=17$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 21, level: "중", category: "충분조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "충분조건", "진리집합", "정수"], wide: false,
    content: "[서술형 1] 두 조건 $p:k\\le x\\le4k$, $q:2\\le x\\le20$에 대하여 '$p$이면 $q$이다.'가 참이 되도록 하는 모든 정수 $k$의 값의 합을 구하시오. [5점]",
    choices: [], answer: "$14$", solution: "$p$의 진리집합 $[k,4k]$가 $q$의 진리집합 $[2,20]$에 포함되어야 하므로 $k\\ge2$, $4k\\le20$이다. 따라서 $2\\le k\\le5$이고 합은 $2+3+4+5=14$이다.\n결론: $14$이다."
  },
  {
    id: 22, level: "하", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "집합", "교집합", "차집합", "부분집합"], wide: false,
    content: "[서술형 2] 두 집합 $A=\\{1,2,3,4\\}$, $B=\\{3,4,5,6\\}$에 대하여 $A\\cap X=X$, $(A-B)\\cup X=X$를 만족시키는 집합 $X$를 모두 구하고 그 과정을 서술하시오. [5점]",
    choices: [], answer: "$\\{1,2\\},\\ \\{1,2,3\\},\\ \\{1,2,4\\},\\ \\{1,2,3,4\\}$", solution: "$A\\cap X=X$에서 $X\\subset A$이고, $(A-B)\\cup X=X$에서 $A-B=\\{1,2\\}\\subset X$이다. 따라서 $3,4$의 포함 여부를 각각 정할 수 있으므로 $X=\\{1,2\\},\\{1,2,3\\},\\{1,2,4\\},\\{1,2,3,4\\}$이다."
  },
  {
    id: 23, level: "중", category: "함수의 성질", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "함수", "함수방정식", "합성법칙", "함숫값"], wide: false,
    content: "[서술형 3] 임의의 실수 $x,y$에 대하여 함수 $f$가 $f(x+y)=f(x)f(y)$, $f(x)>0$을 만족하고 $f(1)=4$이다. $f(0)-f\\left(\\dfrac12\\right)+f(2)$의 값을 구하시오. [5점]",
    choices: [], answer: "$15$", solution: "$f(0)=f(0)^2$이고 $f(0)>0$이므로 $f(0)=1$이다. $f(1)=f(1/2)^2=4$와 양수 조건에서 $f(1/2)=2$이다. 또한 $f(2)=f(1)^2=16$이다. 따라서 $1-2+16=15$이다."
  },
  {
    id: 24, level: "상", category: "절대부등식", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "절대부등식", "산술기하평균", "최솟값"], wide: false,
    content: "[서술형 4] 실수 $x$에 대하여 $x^2+\\dfrac{25}{9x^2+3}$의 최솟값과 그때의 $x^2$의 값을 구하시오. [5점]",
    choices: [], answer: "최솟값 $3$, $x^2=\\dfrac43$", solution: "$t=x^2+1/3>0$이라 두면 식은 $t+\\dfrac{25}{9t}-\\dfrac13$이다. 산술평균과 기하평균의 관계에 의해 $t+\\dfrac{25}{9t}\\ge\\dfrac{10}{3}$이므로 최솟값은 $3$이다. 등호는 $t=5/3$일 때 성립하므로 $x^2=4/3$이다."
  }
];
