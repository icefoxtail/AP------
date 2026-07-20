window.examTitle = "24_제일고_2학기_중간_고1_기출";
window.questionBank = [
  {
    id: 1, level: "하", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원소", "부분집합"], wide: false,
    content: "두 집합 $A=\\{1,2\\}$, $B=\\{\\{1\\},3\\}$에 대하여 다음 보기 중 옳지 않은 것은? [4.0점]", choices: ["$1\\in A$", "$\\{1\\}\\subset A$", "$\\{1\\}\\in B$", "$\\{1,3\\}\\subset B$", "$\\{1,2\\}\\subset A$"], answer: "④",
    solution: "$B$의 원소는 $\\{1\\}$과 $3$이므로 $1$은 $B$의 원소가 아니다. 따라서 $\\{1,3\\}$은 $B$의 부분집합이 아니다.\n결론: 정답은 ④이다."
  },
  {
    id: 2, level: "하", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합의 연산", "집합의 성질"], wide: false,
    content: "다음 집합에 대한 성질 중 잘못된 것은? [4.1점]", choices: ["$\\varnothing^C=U$", "$A\\cap U=A$", "$A\\cap\\varnothing=\\varnothing$", "$A\\cup A^C=U$", "$A\\cap(A\\cup B)=A\\cup B$"], answer: "⑤",
    solution: "흡수법칙에 의해 $A\\cap(A\\cup B)=A$이므로 ⑤가 잘못되었다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 3, level: "하", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "벤다이어그램", "포함관계"], wide: false,
    content: "다음 중 벤다이어그램으로 나타낼 때 다른 하나는? [4.2점]", choices: ["$A\\cup B^C=U$", "$A^C\\cup B=U$", "$B^C\\subset A^C$", "$A\\cup B=B$", "$A\\cap B=A$"], answer: "①",
    solution: "①은 $B\\subset A$를 뜻한다. ②부터 ⑤까지는 모두 $A\\subset B$를 뜻하므로 다른 하나는 ①이다.\n결론: 정답은 ①이다."
  },
  {
    id: 4, level: "하", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합의 원소의 개수", "드모르간 법칙"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $n(U)=20$, $n(A)=8$, $n(B)=9$, $n(A^C\\cup B^C)=18$일 때, $n(A\\cup B)$의 값은? [4.4점]", choices: ["$14$", "$15$", "$16$", "$17$", "$18$"], answer: "②",
    solution: "$A^C\\cup B^C=(A\\cap B)^C$이므로 $n(A\\cap B)=2$이다. 따라서 $n(A\\cup B)=8+9-2=15$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 5, level: "하", category: "여러 가지 부등식", originalCategory: "여러 가지 부등식", standardCourse: "수학(하)", standardUnitKey: "H15-SA-08", standardUnit: "여러 가지 부등식", standardUnitOrder: 8,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "연립이차부등식", "정수해의 합"], wide: false,
    content: "연립부등식 $\\begin{cases}x^2+5x+6>0\\\\x^2-4\\le0\\end{cases}$을 만족시키는 모든 정수 $x$의 값들의 합은? [4.4점]", choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "②",
    solution: "첫 부등식은 $x<-3$ 또는 $x>-2$, 둘째 부등식은 $-2\\le x\\le2$이다. 공통 정수해는 $-1,0,1,2$이고 합은 $2$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 6, level: "중", category: "여러 가지 부등식", originalCategory: "여러 가지 부등식", standardCourse: "수학(하)", standardUnitKey: "H15-SA-08", standardUnit: "여러 가지 부등식", standardUnitOrder: 8,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "절댓값부등식", "정수해"], wide: false,
    content: "부등식 $|2x-1|-|x-1|\\le2$를 만족시키는 정수 $x$의 개수는? [4.5점]", choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "⑤",
    solution: "절댓값의 기준점 $\\dfrac12$, $1$을 기준으로 나누어 풀면 해는 $-2\\le x\\le2$이다. 정수해는 $-2,-1,0,1,2$로 5개이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 7, level: "중", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "부분집합의 개수", "차집합"], wide: false,
    content: "전체집합 $U=\\{x\\mid x$는 $4$의 양의 약수$\\}$의 두 부분집합 $A$, $X$에 대하여 다음 조건을 만족하는 집합 $X$의 개수는? [4.6점]\n(가) $A=\\{x\\mid x$는 짝수$\\}$\n(나) $n(A-X)=1$", choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "④",
    solution: "$U=\\{1,2,4\\}$, $A=\\{2,4\\}$이다. $2,4$ 중 정확히 하나만 $X$에 속하고, $1$의 포함 여부는 자유이므로 $2\\times2=4$개이다.\n결론: 정답은 ④이다."
  },
  {
    id: 8, level: "중", category: "여러 가지 부등식", originalCategory: "여러 가지 부등식", standardCourse: "수학(하)", standardUnitKey: "H15-SA-08", standardUnit: "여러 가지 부등식", standardUnitOrder: 8,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "이차부등식", "해집합의 포함관계", "매개변수"], wide: false,
    content: "두 집합 $A=\\{x\\mid x^2-kx+1<0\\}$, $B=\\{x\\mid0<x<5\\}$에 대하여 $A\\subset B$를 만족하는 정수 $k$의 개수는? (단, $A\\ne\\varnothing$) [4.7점]", choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "③",
    solution: "$A$가 공집합이 아니려면 판별식이 양수이므로 $k>2$이다. 두 근이 모두 $(0,5)$의 경계 안에 있으려면 큰 근이 $5$ 이하이고, 이는 $k\\le\\dfrac{26}{5}$와 같다. 따라서 정수 $k$는 $3,4,5$로 3개이다.\n결론: 정답은 ③이다."
  },
  {
    id: 9, level: "중", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "부분집합", "집합의 원소의 합"], wide: false,
    content: "전체집합 $U=\\{1,2,3,\\cdots,10\\}$의 부분집합 $A$, $B$에 대하여 $f(A)$를 $A$에 속하는 모든 원소의 합이라고 하자. 다음 보기에서 옳은 것을 있는 대로 모두 고른 것은? [4.8점]\nㄱ. $f(A^C)=f(U)-f(A)$\nㄴ. $A\\ne B$이면 $f(A)\\ne f(B)$\nㄷ. $A\\cap B=\\varnothing$이면 $f(A\\cup B)=f(A)+f(B)$", choices: ["ㄱ", "ㄴ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄱ, ㄴ, ㄷ"], answer: "④",
    solution: "ㄱ은 여집합의 원소가 나머지 원소 전체이므로 참이다. ㄴ은 서로 다른 부분집합의 원소 합이 같을 수 있어 거짓이다. ㄷ은 서로소일 때 중복 없이 합쳐지므로 참이다.\n결론: 정답은 ④이다."
  },
  {
    id: 10, level: "하", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수의 정의", "대응"], wide: false,
    content: "두 집합 $X=\\{-2,-1,0,1,2\\}$, $Y=\\{-1,0,1,2,3\\}$에 대하여 다음 중 $X$에서 $Y$로의 함수인 것은? (단, $[x]$는 $x$보다 크지 않은 최대 정수) [4.1점]", choices: ["$f(x)=x$", "$g(x)=x^2$", "$h(x)=\\begin{cases}-x&(x\\ge0)\\\\x&(x<0)\\end{cases}$", "$k(x)=[x]+1$", "$t(x)=|x-2|$"], answer: "④",
    solution: "$k(x)=[x]+1=x+1$이고 $X$의 각 원소를 차례로 $-1,0,1,2,3$에 대응시키므로 $Y$ 안에 값이 존재한다.\n결론: 정답은 ④이다."
  },
  {
    id: 11, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "일대일함수", "함수의 개수"], wide: false,
    content: "두 집합 $X=\\{1,2,3,4,5\\}$, $Y=\\{2,3,5,7,11,13\\}$에 대하여 다음 조건을 모두 만족시키는 함수 $f:X\\to Y$의 개수는? [4.2점]\n(가) $x_1\\ne x_2$이면 $f(x_1)\\ne f(x_2)$이다.\n(나) $f(3)=5$이다.\n(다) $x<3$이면 $f(x)>f(3)$이고, $x>3$이면 $f(x)<f(3)$이다.", choices: ["$10$", "$11$", "$12$", "$13$", "$14$"], answer: "③",
    solution: "$f(1),f(2)$는 $7,11,13$ 중 서로 다르게 정하므로 ${}_3P_2=6$가지이다. $f(4),f(5)$는 $2,3$을 서로 다르게 정하므로 $2$가지이다. 따라서 $12$가지이다.\n결론: 정답은 ③이다."
  },
  {
    id: 12, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "합성함수", "함수의 반복"], wide: false,
    content: "함수 $f(x)=-x+3$에 대하여 $f^1=f$, $f^2=f\\circ f$, $\\cdots$, $f^{n+1}=f\\circ f^n$으로 정의할 때, $f(1)+f^2(1)+f^3(1)+\\cdots+f^k(1)=35$를 만족하는 $k$의 값은? [4.3점]", choices: ["$20$", "$21$", "$22$", "$23$", "$24$"], answer: "④",
    solution: "$f(1)=2$, $f^2(1)=1$이고 이후 $2,1$이 반복된다. $k=23$이면 $2$가 12번, $1$이 11번 나타나 합이 $35$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 13, level: "상", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "합성함수", "역함수", "그래프", "도형"], wide: false,
    content: "그림은 두 함수 $y=f(x)$, $y=g(x)$의 그래프와 $y=x$의 그래프를 나타낸 것이다. 두 함수의 역함수가 존재할 때, 다음 중 옳지 않은 것은? (단, 모든 점선은 $x$축 또는 $y$축에 평행) [4.4점]", image: "assets/images/24_제일고_2학기_중간_고1_기출/q13.png", choices: ["$(f\\circ f)(d)=b$", "$(f\\circ g)(c)=c$", "$(g\\circ f)(d)=c$", "$(f^{-1}\\circ g)(c)=e$", "$(g\\circ g)(c)=e$"], answer: "③",
    solution: "그래프의 점선 대응을 차례로 읽으면 ①, ②, ④, ⑤는 성립하지만 $(g\\circ f)(d)$는 $c$가 아니다.\n결론: 정답은 ③이다."
  },
  {
    id: 14, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "항등함수", "방정식", "부분집합의 개수"], wide: false,
    content: "집합 $X$를 정의역으로 하는 함수 $f(x)=x^3-2x-2$가 항등함수가 되도록 하는 집합 $X$의 개수는? (단, $X\\ne\\varnothing$) [4.5점]", choices: ["$2$", "$3$", "$4$", "$7$", "$8$"], answer: "②",
    solution: "$f(x)=x$에서 $x^3-3x-2=(x-2)(x+1)^2=0$이므로 가능한 원소는 $-1,2$이다. 이 집합의 공집합이 아닌 부분집합은 3개이다.\n결론: 정답은 ②이다."
  },
  {
    id: 15, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "합성함수", "역함수"], wide: false,
    content: "세 함수 $f$, $g$, $h$에 대하여 $(g\\circ h)(x)=2x-3$, $((f\\circ g)\\circ h)(x)=4x+1$일 때, 함수 $f$에 대하여 $f^{-1}(6)$의 값은? [4.6점]", choices: ["$-2$", "$\\dfrac13$", "$3$", "$-\\dfrac13$", "$-\\dfrac12$"], answer: "⑤",
    solution: "$f(2x-3)=4x+1$이다. $t=2x-3$으로 놓으면 $f(t)=2t+7$이므로 $f^{-1}(6)=-\\dfrac12$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 16, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "합성함수", "절댓값함수", "실근의 곱"], wide: false,
    content: "실수 전체의 집합에서 정의된 함수 $f(x)=|x-2|$에 대하여 $f(f(x))=1$의 서로 다른 실근의 곱은? [4.7점]", choices: ["$-15$", "$15$", "$-8$", "$8$", "$0$"], answer: "①",
    solution: "$||x-2|-2|=1$이므로 $|x-2|=3$ 또는 $|x-2|=1$이다. 실근은 $-1,1,3,5$이고 곱은 $-15$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 17, level: "상", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "역함수", "합성함수", "그래프의 교점"], wide: false,
    content: "함수 $f(x)=\\begin{cases}x^2&(x\\ge0)\\\\x&(x<0)\\end{cases}$에 대하여 다음 보기 중 옳은 것만을 있는 대로 고른 것은? [4.7점]\nㄱ. $f(16)=f(f(4))=f(f(f(2)))$\nㄴ. $f^{-1}(-7)=f(-7)$\nㄷ. $(f\\circ f)^{-1}(9)=\\sqrt3$\nㄹ. 함수 $y=f(x)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프의 교점은 3개 이상이다.", choices: ["ㄱ, ㄴ", "ㄱ, ㄴ, ㄷ", "ㄱ, ㄴ, ㄹ", "ㄴ, ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ, ㄹ"], answer: "⑤",
    solution: "ㄱ은 모두 $256$으로 참이다. 음수 구간에서 $f(x)=x$이므로 ㄴ은 참이다. $f(f(x))=9$의 해는 $x=\\sqrt3$이므로 ㄷ도 참이다. 음수인 모든 점에서 $f(x)=x$이므로 원함수와 역함수의 교점은 3개 이상이며 ㄹ도 참이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 18, level: "중", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "일대일대응", "부분집합", "경우의 수"], wide: false,
    content: "전체집합 $U=\\{a,b,c,d\\}$의 두 부분집합 $A$, $B$에 대하여 함수 $f:A\\to B$가 일대일대응이 되도록 하는 집합 $A$, $B$의 순서쌍 $(A,B)$의 개수는? [4.8점]", choices: ["$69$", "$68$", "$67$", "$66$", "$65$"], answer: "①",
    solution: "일대일대응이 존재하려면 $A$, $B$의 원소 수가 같아야 한다. 공집합을 제외하면 순서쌍의 수는 $\\binom41^2+\\binom42^2+\\binom43^2+\\binom44^2=16+36+16+1=69$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 19, level: "중", category: "집합", originalCategory: "집합", standardCourse: "수학(하)", standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "집합의 원소의 개수", "활용"], wide: false,
    content: "서술형 1. 어느 반 20명을 대상으로 수학과 영어 2과목에 대한 방과후수업 신청자 수를 조사하였다. 수학을 선택한 학생이 8명, 영어를 선택한 학생이 6명, 어느 과목도 선택하지 않은 학생이 9명일 때, 수학만을 선택한 학생 수를 구하는 과정을 서술하시오. [4점]", choices: [], answer: "$5$명", 
    solution: "적어도 한 과목을 선택한 학생은 $20-9=11$명이다. 두 과목 모두 선택한 학생은 $8+6-11=3$명이므로 수학만 선택한 학생은 $8-3=5$명이다."
  },
  {
    id: 20, level: "상", category: "여러 가지 부등식", originalCategory: "여러 가지 부등식", standardCourse: "수학(하)", standardUnitKey: "H15-SA-08", standardUnit: "여러 가지 부등식", standardUnitOrder: 8,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "이차부등식", "가우스기호", "구간 분할"], wide: false,
    content: "서술형 2. 이차부등식 $x^2-[x]-2\\le0$의 해를 구하는 과정을 서술하시오. (단, $[x]$는 $x$보다 크지 않은 최대 정수) [5점]", choices: [], answer: "$-1\\le x\\le\\sqrt3$ 또는 $x=2$", 
    solution: "가능한 정수부분을 나누어 조사한다. $[x]=-1$일 때 $-1\\le x<0$에서 $x^2-1\\le0$, $[x]=0$일 때 $0\\le x<1$에서 $x^2-2\\le0$, $[x]=1$일 때 $1\\le x<2$에서 $x^2-3\\le0$, $[x]=2$일 때 $2\\le x<3$에서 $x^2-4\\le0$이다. 이를 합치면 $-1\\le x\\le\\sqrt3$ 또는 $x=2$이다."
  },
  {
    id: 21, level: "상", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "합성함수", "역함수"], wide: false,
    content: "서술형 3. 함수 $f(x)=-2x+3$, $g(x)=3x+2$에 대하여 $(f\\circ(g^{-1}\\circ f)^{-1}\\circ f)^{-1}(x)$를 구하는 과정을 서술하시오. [5점]", choices: [], answer: "$-\\dfrac16x+\\dfrac{11}{6}$", 
    solution: "$(g^{-1}\\circ f)^{-1}=f^{-1}\\circ g$이므로 $f\\circ(g^{-1}\\circ f)^{-1}\\circ f=g\\circ f$이다. 따라서 구하는 함수는 $(g\\circ f)^{-1}$이다. $(g\\circ f)(x)=3(-2x+3)+2=-6x+11$이므로 역함수는 $-\\dfrac16x+\\dfrac{11}{6}$이다."
  },
  {
    id: 22, level: "상", category: "함수", originalCategory: "함수", standardCourse: "수학(하)", standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "일대일대응", "이차함수", "최댓값"], wide: false,
    content: "서술형 4. 실수 전체의 집합 $R$에서 $R$로 정의된 함수 $f(x)=\\begin{cases}-x^2+bx-2&(x\\ge-1)\\\\x^2+ax+2&(x<-1)\\end{cases}$가 일대일대응일 때, $a+b$의 최댓값을 구하는 과정을 서술하시오. [6점]", choices: [], answer: "$-2$", 
    solution: "$x\\ge-1$에서 일대일이 되려면 꼭짓점의 $x$좌표가 $-1$ 이하이므로 $b\\le-2$이다. $x<-1$에서 일대일이 되려면 꼭짓점의 $x$좌표가 $-1$ 이상이므로 $a\\le2$이다. 두 구간의 치역이 빠짐없이 이어지려면 $f(-1)=\\lim_{x\\to-1-}f(x)$이므로 $-b-3=3-a$, 즉 $b=a-6$이다. 따라서 $a+b=2a-6\\le-2$이고 $a=2$, $b=-4$일 때 최댓값 $-2$를 갖는다."
  }
];
