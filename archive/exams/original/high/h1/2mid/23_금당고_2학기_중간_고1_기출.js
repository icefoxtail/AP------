window.examTitle = "23_금당고_2학기_중간_고1_기출";
window.questionBank = [
  {
    id: 1, level: "하", category: "대칭이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "대칭이동", "x축"], wide: false,
    content: "다음 중 $(3,4)$를 $x$축에 대하여 대칭이동한 점의 좌표는? [3.8점]",
    choices: ["$(-3,-4)$", "$(-3,4)$", "$(3,-4)$", "$(3,4)$", "$(4,3)$"], answer: "③",
    solution: "$x$축에 대한 대칭이동은 $(x,y)\\mapsto(x,-y)$이므로 $(3,4)$는 $(3,-4)$로 이동한다.\n결론: 정답은 ③이다."
  },
  {
    id: 2, level: "하", category: "평행이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "평행이동", "직선"], wide: false,
    content: "직선 $y=ax+2$를 $x$축의 방향으로 $3$만큼, $y$축의 방향으로 $1$만큼 평행이동한 직선의 방정식이 $y=-2x+9$일 때, 상수 $a$의 값은? [3.8점]",
    choices: ["$-2$", "$-1$", "$0$", "$1$", "$2$"], answer: "①",
    solution: "평행이동한 식은 $y-1=a(x-3)+2$, 즉 $y=ax-3a+3$이다. 이를 $y=-2x+9$와 비교하면 $a=-2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 3, level: "하", category: "집합의 뜻", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "집합의뜻", "조건의명확성"], wide: false,
    content: "다음 중 집합이 아닌 것은? [3.8점]",
    choices: ["$1$보다 작은 자연수의 모임", "$12$의 양의 약수의 모임", "제곱하여 $4$가 되는 유리수의 모임", "$0$에 가까운 실수의 모임", "$2$의 양의 배수의 모임"], answer: "④",
    solution: "집합은 대상의 포함 여부가 명확해야 한다. '$0$에 가까운 실수'는 '가깝다'의 기준이 명확하지 않으므로 집합이 아니다.\n결론: 정답은 ④이다."
  },
  {
    id: 4, level: "하", category: "차집합", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "차집합", "소수", "원소의개수"], wide: false,
    content: "두 집합 $A=\\{1,2,3,4,5,6,7\\}$, $B=\\{x\\mid x\\text{는 }10\\text{ 이하의 소수}\\}$일 때, 집합 $A-B$의 원소의 개수는? [3.8점]",
    choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "③",
    solution: "$B=\\{2,3,5,7\\}$이므로 $A-B=\\{1,4,6\\}$이다. 원소의 개수는 $3$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 5, level: "하", category: "명제의 뜻", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "참거짓", "조건"], wide: false,
    content: "다음 중 명제인 것은? [4.0점]",
    choices: ["$\\dfrac1{10}$은 작은 수이다.", "동천은 넓은 강이다.", "$x^2>1$", "$x$는 $8$의 양의 약수이다.", "소수는 홀수이다."], answer: "⑤",
    solution: "명제는 참과 거짓을 분명히 판별할 수 있는 문장이다. ⑤는 $2$라는 반례 때문에 거짓이지만 참·거짓이 분명하므로 명제이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 6, level: "하", category: "명제의 대우", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "대우", "부정"], wide: false,
    content: "실수 $x$에 대한 명제 '$x=2$이면 $x^2=4$이다.'의 대우는? [4.0점]",
    choices: ["$x^2=4$이면 $x=2$이다.", "$x^2\\ne4$이면 $x\\ne2$이다.", "$x\\ne2$이면 $x^2=4$이다.", "$x=2$이면 $x^2\\ne4$이다.", "$x^2\\ne4$이면 $x=2$이다."], answer: "②",
    solution: "$p\\to q$의 대우는 $\\sim q\\to\\sim p$이다. 따라서 '$x^2\\ne4$이면 $x\\ne2$이다.'가 대우이다.\n결론: 정답은 ②이다."
  },
  {
    id: 7, level: "하", category: "포물선의 평행이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "평행이동", "포물선", "꼭짓점"], wide: false,
    content: "포물선 $y=2x^2+4x+5$를 $x$축 방향으로 $2$만큼, $y$축 방향으로 $k$만큼 평행이동한 포물선의 꼭짓점이 직선 $y=x$ 위에 있을 때, 상수 $k$의 값은? [4.0점]",
    choices: ["$-2$", "$-1$", "$0$", "$1$", "$2$"], answer: "①",
    solution: "$y=2(x+1)^2+3$의 꼭짓점은 $(-1,3)$이다. 평행이동 후 꼭짓점은 $(1,3+k)$이고 $y=x$ 위에 있으므로 $3+k=1$, 즉 $k=-2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 8, level: "중", category: "부분집합의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "부분집합", "여사건", "약수"], wide: false,
    content: "집합 $A=\\{x\\mid x\\text{는 }18\\text{의 양의 약수}\\}$의 부분집합 중 적어도 한 개의 짝수를 원소로 갖는 집합의 개수는? [4.2점]",
    choices: ["$40$", "$48$", "$56$", "$64$", "$72$"], answer: "③",
    solution: "$A=\\{1,2,3,6,9,18\\}$이고 짝수 원소는 $2,6,18$이다. 전체 부분집합은 $2^6=64$개, 짝수를 하나도 갖지 않는 부분집합은 홀수 원소 세 개로 만든 $2^3=8$개이므로 $64-8=56$개이다.\n결론: 정답은 ③이다."
  },
  {
    id: 9, level: "중", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "교집합", "차집합", "배수"], wide: false,
    content: "전체집합 $U=\\{x\\mid x\\text{는 자연수}\\}$의 원소의 개수가 $4$인 부분집합 $A$와 $1$이 아닌 자연수 $k$에 대하여 집합 $B=\\{ka\\mid a\\in A\\}$이다. $A\\cap B=\\{2,6\\}$일 때, $B-A$의 원소의 합은? [4.2점]",
    choices: ["$4$", "$8$", "$12$", "$16$", "$20$"], answer: "④",
    solution: "$2\\in B$이고 $k>1$이므로 $k=2$, $1\\in A$이다. 또한 $6\\in B$에서 $3\\in A$이고, 교집합 조건에 따라 $A=\\{1,2,3,6\\}$이다. $B=\\{2,4,6,12\\}$이므로 $B-A=\\{4,12\\}$이고 합은 $16$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 10, level: "중", category: "필요조건과 충분조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "충분조건", "필요조건", "동치"], wide: false,
    content: "두 실수 $a,b$에 대하여 다음 중 조건 $p$가 조건 $q$이기 위한 충분조건이지만 필요조건이 아닌 것은? [4.2점]",
    choices: ["$p:a-b=0$, $q:a^2-b^2=0$", "$p:|a+b|=|a-b|$, $q:|a|+|b|=0$", "$p:ab=0$, $q:a^2-2ab+b^2=0$", "$p:|ab|=ab$, $q:a>0$ 그리고 $b>0$", "$p:a^2+b^2=0$, $q:a=b=0$"], answer: "①",
    solution: "$a-b=0$이면 $a=b$이므로 $a^2-b^2=0$이다. 그러나 $a^2-b^2=0$은 $a=-b$인 경우에도 성립하므로 $p$는 $q$의 필요조건이 아니다.\n결론: 정답은 ①이다."
  },
  {
    id: 11, level: "중", category: "귀류법", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "귀류법", "배수", "증명"], wide: false,
    content: "자연수 $n$에 대하여 명제 '$n^2$이 $3$의 배수이면 $n$도 $3$의 배수이다.'가 참임을 증명하는 과정에서 (가), (나), (다)에 들어갈 말로 옳은 것은? [4.2점]\n$n$이 $3$의 배수가 아니라고 가정하면 $n=3k-1$ 또는 $n=$(나)이다. $n=3k-1$일 때 $n^2=3(3k^2-2k)+1$, $n=$(나)일 때 $n^2=3($(다)$)+1$이 되어 모순을 얻는다.",
    choices: ["대우법, $3k-1$, $3k^2-4k+1$", "대우법, $3k-2$, $3k^2-4k+4$", "귀류법, $3k-2$, $3k^2-4k+1$", "귀류법, $3k-1$, $3k^2-4k$", "귀류법, $3k-2$, $3k^2-4k-1$"], answer: "③",
    solution: "결론의 부정인 '$n$이 $3$의 배수가 아니다'를 가정해 모순을 보이므로 귀류법이다. 이때 $n=3k-1$ 또는 $3k-2$이고, $(3k-2)^2=3(3k^2-4k+1)+1$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 12, level: "중", category: "점대칭이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "점대칭", "직선", "완전제곱"], wide: false,
    content: "$a^2+b^2=2a+4b-5$를 만족시키는 실수 $a,b$에 대하여 직선 $y=-3x+2$를 점 $(a,b)$에 대하여 대칭이동한 직선의 방정식은? [4.4점]",
    choices: ["$x+3y=0$", "$3x+y=0$", "$x+3y-2=0$", "$3x+y-8=0$", "$3x+y+12=0$"], answer: "④",
    solution: "주어진 식은 $(a-1)^2+(b-2)^2=0$이므로 $(a,b)=(1,2)$이다. 점대칭에서 $(x,y)$의 원래 점은 $(2-x,4-y)$이므로 $4-y=-3(2-x)+2$이다. 정리하면 $3x+y-8=0$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 13, level: "중", category: "집합의 원소의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "합집합", "교집합", "대칭차"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A,B$에 대하여 $n(A)=4$, $n((A\\cup B)-(A\\cap B))=2$일 때, 모든 $n(B)$의 값의 합은? [4.4점]",
    choices: ["$12$", "$14$", "$16$", "$18$", "$20$"], answer: "①",
    solution: "$A-B$, $A\\cap B$, $B-A$의 원소 수를 각각 $x,y,z$라 하면 $x+y=4$, $x+z=2$이다. $x=0,1,2$가 가능하고 이에 따른 $n(B)=y+z$는 $6,4,2$이다. 합은 $12$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 14, level: "중", category: "진리집합", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "진리집합", "포함관계", "차집합"], wide: false,
    content: "전체집합 $U$의 공집합이 아닌 부분집합 $P,Q,R$가 각각 세 조건 $p,q,r$의 진리집합이라 하자. $P^C\\cup Q=U$, $Q-R=Q$가 성립할 때, <보기> 중 옳은 것의 개수는? [4.4점]\nㄱ. 명제 $p\\to q$는 참이다.\nㄴ. 명제 $r\\to\\sim q$는 참이다.\nㄷ. 명제 $q\\to p$가 거짓임을 보이려면 $P\\cap Q^C$의 원소가 존재함을 보이면 된다.\nㄹ. $P\\cap R=\\varnothing$\nㅁ. 명제 $r\\to\\sim p$는 참이다.",
    choices: ["$1$", "$2$", "$3$", "$4$", "$5$"], answer: "④",
    solution: "$P^C\\cup Q=U$에서 $P\\subset Q$, $Q-R=Q$에서 $Q\\cap R=\\varnothing$이다. 따라서 ㄱ, ㄴ, ㄹ, ㅁ은 참이다. $q\\to p$의 반례는 $Q\\cap P^C$에 있어야 하므로 ㄷ은 거짓이다.\n결론: 옳은 것은 $4$개이므로 정답은 ④이다."
  },
  {
    id: 15, level: "상", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "멱집합", "합집합", "교집합", "닫힘"], wide: false,
    content: "집합 $A=\\{a,b,c\\}$에 대하여 $P(A)=\\{X\\mid X\\subset A\\}$라 하자. 집합 $P(A)$의 부분집합 중 다음 조건을 만족시키는 집합 $T$의 개수는? [4.4점]\n(가) 집합 $T$의 원소의 개수는 $4$이다.\n(나) 집합 $T$의 임의의 두 원소 $X,Y$에 대하여 $X\\cup Y\\in T$, $X\\cap Y\\in T$이다.",
    choices: ["$11$", "$12$", "$13$", "$14$", "$15$"], answer: "⑤",
    solution: "$P(A)$의 원소를 $\\varnothing,a,b,c,ab,ac,bc,abc$로 줄여 쓰자. 조건을 만족하는 네 원소 집합은 $\\{\\varnothing,a,b,ab\\}$형이 $3$개, $\\{\\varnothing,a,ab,abc\\}$형이 $9$개, $\\{a,ab,ac,abc\\}$형이 $3$개이다. 따라서 모두 $3+9+3=15$개이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 16, level: "상", category: "대칭이동과 교점", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "대칭이동", "포물선", "직선", "최솟값"], wide: false,
    content: "포물선 $y=(x+a)^2-a^2$을 $y$축에 대하여 대칭이동한 포물선을 $y=f(x)$라 하고, 직선 $y=-\\dfrac4a x$를 $x$축에 대하여 대칭이동한 직선을 $y=g(x)$라 하자. 두 그래프가 두 점 $A,B$에서 만날 때 선분 $AB$의 중점을 $M$, 점 $M$에서 $y$축에 내린 수선의 발을 $H$라 하자. $MH$의 길이가 최소가 되도록 하는 양수 $a$의 값은? [4.6점]",
    choices: ["$\\sqrt2$", "$\\sqrt3$", "$2$", "$\\sqrt5$", "$\\sqrt6$"], answer: "①",
    solution: "$f(x)=x^2-2ax$, $g(x)=\\dfrac4a x$이다. 교점의 $x$좌표는 $0$, $2a+4/a$이므로 중점의 $x$좌표는 $a+2/a$이다. 따라서 $MH=a+2/a\\ge2\\sqrt2$이고 등호는 $a=2/a$, 즉 $a=\\sqrt2$일 때 성립한다.\n결론: 정답은 ①이다."
  },
  {
    id: 17, level: "상", category: "이차함수와 원의 이동", originalCategory: "이차함수", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13", standardUnit: "이차함수", standardUnitOrder: 13,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "이차함수", "원", "평행이동", "접선", "연립방정식"], wide: false,
    content: "이차함수 $y=f(x)$가 있다. 중심이 함수 $y=f(x)$의 그래프 위에 있고 반지름의 길이가 $1$인 원 중에서, 원을 $x$축과 $y$축의 방향으로 각각 $m$만큼 평행이동한 원이 $x$축과 $y$축에 동시에 접하도록 하는 실수 $m$이 한 개 이상 존재하는 원의 중심은 서로 다른 세 개이다. 이 중심들의 $x$좌표를 $x_1<x_2<x_3$라 할 때 $x_1=0$, $x_1+x_2+x_3=4$이고, $x_1\\le x\\le x_3$에서 $f(x)$의 최솟값이 $0$보다 클 때, $8f(1)$의 값은? [4.8점]",
    choices: ["$-18$", "$-9$", "$0$", "$9$", "$18$"], answer: "④",
    solution: "접점의 네 부호 경우를 정리하면 원의 중심은 그래프 $y=f(x)$와 $y=x$, $y=-x$, $y=x+2$, $y=x-2$의 교점 중 조건을 만족하는 점이다. 세 중심과 양의 최솟값 조건을 적용하면 $f(x)=ax^2+bx+c$에서 $c=2$, $b=-2$, $a=9/8$을 얻는다. 따라서 $f(1)=9/8$이고 $8f(1)=9$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 18, level: "중", category: "대칭이동과 최단거리", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "단답형", layoutTag: "grid", tags: ["단답형", "도형의이동", "대칭이동", "최단거리", "직선"], wide: false,
    content: "[단답형 1] 아래 그림과 같이 좌표평면 위에 세 점 $A(-1,1)$, $B(0,2)$, $C(4,6)$과 직선 $y=x$ 위의 두 점 $P,Q$가 있다. $AP+PB+BQ+QC$의 최솟값을 구하시오. [4점]",
    image: "assets/images/23_금당고_2학기_중간_고1_기출/q18.png", choices: [], answer: "$3\\sqrt{10}$",
    solution: "$A$를 $y=x$에 대칭이동한 점을 $A'=(1,-1)$이라 하면 $AP+PB$의 최솟값은 $A'B=\\sqrt{10}$이다. $C$를 대칭이동한 점을 $C'=(6,4)$라 하면 $BQ+QC$의 최솟값은 $BC'=2\\sqrt{10}$이다. 따라서 전체 최솟값은 $3\\sqrt{10}$이다."
  },
  {
    id: 19, level: "중", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "단답형", layoutTag: "grid", tags: ["단답형", "집합", "교집합", "차집합", "최솟값"], wide: false,
    content: "[단답형 2] 전체집합 $U=\\{x\\mid x\\text{는 자연수}\\}$의 세 부분집합 $A,B,C$가 $n(A)=3$, $B=\\{x\\mid x\\text{는 }k\\text{ 이하의 자연수}\\}$, $C=\\{2,3,5,7\\}$이고 $A\\cap C\\ne\\varnothing$, $(A-B)-C=\\varnothing$을 만족시킨다. 집합 $A$의 원소의 합이 $22$가 되도록 하는 자연수 $k$의 최솟값을 구하시오. [5점]",
    choices: [], answer: "$9$", solution: "$A$는 $C$의 원소를 적어도 하나 포함하고, $B$에 속하지 않는 $A$의 원소는 모두 $C$에 속해야 한다. 합이 $22$인 세 자연수를 구성하며 $k$를 최소화하면 $A=\\{7,6,9\\}$로 둘 수 있고 $k=9$가 필요하다. $k\\le8$이면 $9$ 이상의 원소가 $C$에 속해야 하는데 불가능하므로 최솟값은 $9$이다."
  },
  {
    id: 20, level: "중", category: "필요조건과 충분조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "필요조건", "충분조건", "진리집합", "이차부등식"], wide: false,
    content: "[서술형 1] 실수 $x$에 대하여 세 조건 $p,q,r$가 $p:x^2+2x-k^2-2k>0$, $q:|x|<2$, $r:x\\le-7$이다. $q$는 $\\sim p$이기 위한 충분조건이고, $p$는 $r$이기 위한 필요조건이 되도록 하는 모든 자연수 $k$의 값의 합을 구하는 과정을 서술하시오. [10점]",
    choices: [], answer: "$9$", solution: "$p$는 $(x-k)(x+k+2)>0$, 즉 $x<-k-2$ 또는 $x>k$이다. $q$의 진리집합 $(-2,2)$가 $\\sim p$의 진리집합 $[-k-2,k]$에 포함되려면 $k\\ge2$이다. 또한 $r$의 진리집합이 $p$에 포함되려면 $-7<-k-2$, 즉 $k<5$이다. 따라서 $k=2,3,4$이고 합은 $9$이다."
  },
  {
    id: 21, level: "상", category: "원과 직선의 위치 관계", originalCategory: "원의 방정식", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-11", standardUnit: "원의 방정식", standardUnitOrder: 11,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "원의방정식", "반원", "직선", "교점", "함수"], wide: false,
    content: "[서술형 2] 그림과 같이 중심이 원점 $O$이고 반지름의 길이가 $4$인 원에 중심의 좌표가 $(2,0)$이고 반지름의 길이가 $2$인 반원이 접해 있는 도형을 $C_1$이라 하자. 도형 $C_1$을 원점에 대하여 대칭이동한 도형을 $C_2$라 하자. $A=\\{(x,y)\\mid(x,y)\\text{는 도형 }C_1\\text{ 위의 점}\\}$, $B=\\{(x,y)\\mid(x,y)\\text{는 도형 }C_2\\text{ 위의 점}\\}$, $C=\\{(x,y)\\mid y=a(x+2)\\}$에 대하여 $f(a)=n((A\\cup B)\\cap C)$라 할 때, 함수 $f(a)$를 구하는 과정을 서술하시오. (단, $a$는 실수이다.) [10점]",
    image: "assets/images/23_금당고_2학기_중간_고1_기출/q21.png", choices: [],
    answer: "$f(a)=\\begin{cases}1&(a<0)\\\\3&(0\\le a<\\frac{\\sqrt3}{3})\\\\2&(a=\\frac{\\sqrt3}{3})\\\\1&(a>\\frac{\\sqrt3}{3})\\end{cases}$",
    solution: "직선 $y=a(x+2)$와 오른쪽 반원의 원 $(x-2)^2+y^2=4$의 교점 수를 판별하고, 원점 대칭인 왼쪽 반원과의 교점 및 공통 끝점을 합쳐 센다. 접할 때는 중심 $(2,0)$에서 직선 $ax-y+2a=0$까지의 거리가 $2$이므로 $|4a|/\\sqrt{a^2+1}=2$, 양수 경계값은 $a=\\sqrt3/3$이다. 따라서 $a<0$ 또는 $a>\\sqrt3/3$에서는 $1$개, $0\\le a<\\sqrt3/3$에서는 $3$개, $a=\\sqrt3/3$에서는 $2$개이다."
  }
];
