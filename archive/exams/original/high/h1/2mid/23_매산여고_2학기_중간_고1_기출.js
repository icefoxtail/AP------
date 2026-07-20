window.examTitle = "23_매산여고_2학기_중간_고1_기출";
window.questionBank = [
  {
    id: 1, level: "하", category: "집합의 뜻과 표현", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "공집합", "원소의개수", "포함관계"], wide: false,
    content: "다음 <보기>에서 옳은 설명을 한 학생을 모두 고르면? [3.7점]\n희준: $A=\\{\\varnothing\\}$일 때, $n(A)=0$이야.\n범수: $A=\\{\\varnothing,a,\\{b\\},b\\}$일 때, $\\varnothing\\subset A$야.\n영나: $n(\\varnothing)=0$이야.",
    choices: ["범수", "영나", "희준, 영나", "범수, 영나", "희준, 범수, 영나"], answer: "④",
    solution: "$A=\\{\\varnothing\\}$은 공집합을 한 원소로 가지므로 $n(A)=1$이다. 공집합은 모든 집합의 부분집합이고 $n(\\varnothing)=0$이므로 범수와 영나의 설명이 옳다.\n결론: 정답은 ④이다."
  },
  {
    id: 2, level: "하", category: "집합의 뜻", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "집합의뜻", "공집합", "조건의명확성"], wide: false,
    content: "다음 <보기>에서 집합인 것을 모두 고르면? [3.7점]\nㄱ. 맛있는 음식의 모임\nㄴ. $x^2=-2$를 만족시키는 실수의 모임\nㄷ. $25$의 양의 약수의 모임\nㄹ. $10$ 이하의 자연수의 모임",
    choices: ["ㄷ, ㄹ", "ㄴ, ㄹ", "ㄱ, ㄷ", "ㄴ, ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ"], answer: "④",
    solution: "ㄱ은 '맛있다'의 기준이 명확하지 않아 집합이 아니다. ㄴ은 원소가 없는 공집합이며 집합이고, ㄷ과 ㄹ도 포함 여부가 명확한 집합이다.\n결론: 정답은 ④이다."
  },
  {
    id: 3, level: "하", category: "부분집합의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "부분집합", "소수", "경우의수"], wide: false,
    content: "집합 $X=\\{x\\mid x\\text{는 }100\\text{ 이하의 자연수}\\}$의 부분집합 중에서 $20$ 이하의 소수를 포함하는 부분집합의 개수는? [3.8점]",
    choices: ["$2^{90}$", "$2^{91}$", "$2^{92}$", "$2^{93}$", "$2^{94}$"], answer: "③",
    solution: "$20$ 이하의 소수는 $2,3,5,7,11,13,17,19$의 $8$개이고 이들은 반드시 포함된다. 나머지 $92$개 원소는 자유롭게 선택하므로 부분집합의 개수는 $2^{92}$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 4, level: "하", category: "집합의 연산", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "벤다이어그램", "합집합", "차집합"], wide: false,
    content: "다음 벤다이어그램 중 $(A\\cup B)-(A-C)$를 바르게 색칠한 부분을 나타낸 것을 고르면? [3.7점]",
    image: "assets/images/23_매산여고_2학기_중간_고1_기출/q04.png", choices: ["①", "②", "③", "④", "⑤"], answer: "⑤",
    solution: "$(A\\cup B)-(A-C)=(A\\cup B)\\cap(A^C\\cup C)$이다. $A\\cup B$에서 $A$에만 속하고 $C$에는 속하지 않는 부분을 제외하면 ⑤의 영역이 남는다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 5, level: "하", category: "집합의 원소의 개수", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "여집합", "합집합", "원소의개수"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A,B$가 $n(U)=100$, $n(A)=69$, $n(B)=43$, $n(A\\cap B^C)=38$을 만족시킬 때, $n(A^C\\cap B^C)$의 값은? [3.8점]",
    choices: ["$18$", "$19$", "$20$", "$21$", "$22$"], answer: "②",
    solution: "$n(A\\cap B)=69-38=31$이므로 $n(A\\cup B)=69+43-31=81$이다. 따라서 $n(A^C\\cap B^C)=n((A\\cup B)^C)=100-81=19$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 6, level: "하", category: "명제의 뜻", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "참거짓", "조건"], wide: false,
    content: "다음 중 명제가 아닌 것은? [3.7점]",
    choices: ["$x=7$이면 $x+2=9$이다.", "삼각형은 다각형이다.", "소수는 모두 홀수이다.", "$25$의 배수는 적다.", "$|x|=1$이면 $x=1$ 또는 $x=-1$이다."], answer: "④",
    solution: "'$25$의 배수는 적다'는 '적다'의 기준이 명확하지 않아 참과 거짓을 판별할 수 없으므로 명제가 아니다.\n결론: 정답은 ④이다."
  },
  {
    id: 7, level: "중", category: "필요조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "필요조건", "방정식", "근"], wide: false,
    content: "두 조건 $p:2x^2-3x+1=0$, $q:x-2a=0$에 대하여 $p$가 $q$이기 위한 필요조건이 되도록 하는 모든 상수 $a$의 값의 합은? [3.8점]",
    choices: ["$\\dfrac14$", "$\\dfrac12$", "$\\dfrac23$", "$\\dfrac34$", "$1$"], answer: "④",
    solution: "$p$가 $q$의 필요조건이면 $q\\Rightarrow p$이다. $p$의 근은 $x=1/2,1$이므로 $2a=1/2$ 또는 $2a=1$이다. 따라서 $a=1/4,1/2$이고 합은 $3/4$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 8, level: "중", category: "명제의 대우", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "대우", "부정", "연립부등식"], wide: false,
    content: "명제 '실수 $x,y$에 대하여 $x+y\\ge2$이면 $x\\ge1$ 또는 $y\\ge1$이다.'의 대우로 알맞은 것은? [3.8점]",
    choices: ["$x\\le1$이고 $y\\le1$이면 $x+y<2$이다.", "$x<1$이고 $y<1$이면 $x+y<2$이다.", "$x\\ge1$이거나 $y\\ge1$이면 $x+y\\le2$이다.", "$x<1$이거나 $y<1$이면 $x+y\\le2$이다.", "$x\\le1$이거나 $y\\le1$이면 $x+y<2$이다."], answer: "②",
    solution: "결론 '$x\\ge1$ 또는 $y\\ge1$'의 부정은 '$x<1$이고 $y<1$'이고, 가정 '$x+y\\ge2$'의 부정은 '$x+y<2$'이다.\n결론: 정답은 ②이다."
  },
  {
    id: 9, level: "중", category: "진리집합과 조건", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "진리집합", "필요조건", "충분조건"], wide: false,
    content: "전체집합 $U$에 대하여 세 조건 $p,q,r$의 진리집합을 $P,Q,R$라 하자. $Q\\cap R=R$이고, $\\sim q$가 $p$이기 위한 필요조건이지만 충분조건은 아닐 때, 다음 중 항상 옳은 것은? [3.9점]",
    choices: ["$p$는 $q$이기 위한 필요조건", "$p$는 $\\sim q$이기 위한 필요조건", "$r$은 $q$이기 위한 충분조건", "$q$는 $r$이기 위한 충분조건", "$q$는 $\\sim p$이기 위한 필요조건"], answer: "③",
    solution: "$Q\\cap R=R$에서 $R\\subset Q$이므로 $r\\Rightarrow q$이다. 따라서 $r$은 $q$이기 위한 충분조건이다.\n결론: 정답은 ③이다."
  },
  {
    id: 10, level: "중", category: "절대부등식의 증명", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "절대부등식", "증명", "등호조건"], wide: false,
    content: "실수 $a,b$에 대하여 $|a+b|\\ge|a|-|b|$를 증명한 과정의 빈칸 (가), (나), (다)에 알맞은 것은? [4.2점]\n$|a|<|b|$이면 좌변은 양수이고 우변은 음수이므로 $|a+b|$(가)$|a|-|b|$이다. $|a|\\ge|b|$이면 $|a+b|^2-(|a|-|b|)^2=2($(나)$)\\ge0$이고, 등호는 (다)일 때 성립한다.",
    choices: ["$>$, $ab+|ab|$, $ab\\le0$", "$>$, $ab-|ab|$, $ab>0$", "$<$, $ab+|ab|$, $ab\\le0$", "$\\ge$, $ab-|ab|$, $ab<0$", "$\\ge$, $ab+|ab|$, $ab\\ge0$"], answer: "①",
    solution: "$|a|<|b|$이면 $|a|-|b|<0\\le|a+b|$이므로 부호는 $>$이다. 또한 차는 $2(ab+|ab|)\\ge0$이고, $ab\\le0$일 때 $ab+|ab|=0$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 11, level: "하", category: "평행이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "평행이동", "점"], wide: false,
    content: "점 $(-3,4)$를 $x$축의 방향으로 $5$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표는? [3.7점]",
    choices: ["$(-5,3)$", "$(2,1)$", "$(-3,4)$", "$(4,-3)$", "$(-8,7)$"], answer: "②",
    solution: "좌표에 이동량을 더하면 $(-3+5,4-3)=(2,1)$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 12, level: "중", category: "직선과 포물선의 위치 관계", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "평행이동", "포물선", "판별식"], wide: false,
    content: "직선 $y=2x+2$를 $x$축의 방향으로 $a$만큼 평행이동한 직선을 $l_1$, $y$축의 방향으로 $a$만큼 평행이동한 직선을 $l_2$라 하자. 곡선 $y=x^2+x+1$과 $l_1$이 만나기 위한 $a$의 최댓값을 $m$, 곡선과 $l_2$가 만나기 위한 $a$의 최솟값을 $n$이라 할 때, $m+n$의 값은? [4점]",
    choices: ["$-\\dfrac58$", "$-\\dfrac38$", "$-\\dfrac74$", "$\\dfrac{15}8$", "$\\dfrac78$"], answer: "①",
    solution: "$l_1:y=2x-2a+2$와 포물선의 교점 조건은 $x^2-x+2a-1=0$의 판별식이 음이 아닌 것이므로 $a\\le5/8$, 따라서 $m=5/8$이다. $l_2:y=2x+2+a$에서는 $x^2-x-a-1=0$이므로 $a\\ge-5/4$, 따라서 $n=-5/4$이다. 합은 $-5/8$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 13, level: "하", category: "일대일대응", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "일대일대응", "치역", "구간"], wide: false,
    content: "두 집합 $X=\\{x\\mid1\\le x\\le3\\}$, $Y=\\{y\\mid5\\le y\\le a\\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=2x+b$가 일대일대응일 때, $a+b$의 값은? [3.9점]",
    choices: ["$9$", "$10$", "$11$", "$12$", "$13$"], answer: "④",
    solution: "$f$는 증가함수이므로 치역은 $[f(1),f(3)]=[2+b,6+b]$이다. 이것이 $[5,a]$와 같아야 하므로 $b=3$, $a=9$이고 합은 $12$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 14, level: "중", category: "일대일대응", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "일대일대응", "구간별함수"], wide: false,
    content: "실수 전체의 집합에서 정의된 다음 함수 중 일대일대응인 것은? [3.9점]",
    choices: ["$f(x)=x^2+1$", "$f(x)=\\dfrac12$", "$f(x)=|x|+1$", "$f(x)=\\begin{cases}x&(x<0)\\\\2x&(x\\ge0)\\end{cases}$", "$f(x)=\\begin{cases}1&(x<0)\\\\x+1&(x\\ge0)\\end{cases}$"], answer: "④",
    solution: "④는 음수 구간을 음수 전체에, $0$ 이상 구간을 $0$ 이상 전체에 각각 일대일로 대응시키므로 실수 전체에서 실수 전체로의 일대일대응이다.\n결론: 정답은 ④이다."
  },
  {
    id: 15, level: "상", category: "도형의 이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "회전", "평행이동", "음함수그래프"], wide: false,
    content: "두 방정식 $f(x,y)=0$, $g(x,y)=0$이 나타내는 도형이 각각 아래 그림과 같을 때, 다음 중 옳은 것은? [4.2점]",
    image: "assets/images/23_매산여고_2학기_중간_고1_기출/q15.png",
    choices: ["$g(x,y)=f(-y+3,-x+1)$", "$g(x,y)=f(x+3,-y+1)$", "$g(x,y)=f(-y-3,x-1)$", "$g(x,y)=f(x-3,-y+1)$", "$g(x,y)=f(y+3,-x-1)$"], answer: "⑤",
    solution: "$f$의 삼각형을 시계 방향으로 $90^\\circ$ 회전한 뒤 왼쪽으로 $3$, 아래로 $1$만큼 이동하면 $g$의 삼각형이 된다. 좌표 치환으로 나타내면 $g(x,y)=f(y+3,-x-1)$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 16, level: "중", category: "대칭이동과 최단거리", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "대칭이동", "최단거리", "좌표"], wide: false,
    content: "좌표평면 위에 세 점 $A(0,2)$, $B(0,4)$, $C(0,8)$과 직선 $y=x$ 위의 두 점 $P,Q$가 있다. $AP+PB+BQ+QC$의 값이 최소가 되도록 하는 두 점 $P,Q$에 대하여 선분 $PQ$의 길이는? [4.3점]",
    image: "assets/images/23_매산여고_2학기_중간_고1_기출/q16.png",
    choices: ["$\\dfrac{2\\sqrt2}{3}$", "$\\dfrac{4\\sqrt2}{3}$", "$\\dfrac{\\sqrt2}{2}$", "$\\sqrt2$", "$\\dfrac{7\\sqrt2}{6}$"], answer: "②",
    solution: "$A$를 $y=x$에 대칭이동한 $A'=(2,0)$과 $B$를 이은 직선이 $y=x$와 만나는 점은 $P=(4/3,4/3)$이다. 같은 방법으로 $C'=(8,0)$과 $B$를 이으면 $Q=(8/3,8/3)$이다. 따라서 $PQ=\\sqrt{2(4/3)^2}=4\\sqrt2/3$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 17, level: "상", category: "명제의 역과 대우", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "명제", "역", "대우", "조건", "함숫값"], wide: false,
    content: "두 조건 $p,q$에 대하여 $F(p,q)$를 다음과 같이 정의하자.\n$F(p,q)=-3$: 명제 $p\\to q$의 대우와 역 중 하나만 참\n$F(p,q)=1$: 대우와 역이 모두 거짓\n$F(p,q)=3$: 대우와 역이 모두 참\n세 조건 $a,b,c$에 대하여 $F(a,b)F(b,c)=-9$일 때, $F(a,a)+\\{F(a,b)\\}^2-\\{F(b,c)\\}^2+F(c,a)$의 값은? [4.4점]",
    choices: ["$-6$", "$-3$", "$0$", "$3$", "$6$"], answer: "③",
    solution: "곱이 $-9$이므로 $F(a,b),F(b,c)$는 $3,-3$의 순서쌍이다. $F(a,a)=3$이고, 두 값의 제곱은 모두 $9$이다. 조건의 포함관계를 추적하면 $F(c,a)=-3$이므로 전체 값은 $3+9-9-3=0$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 18, level: "상", category: "일대일대응", originalCategory: "함수", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-03", standardUnit: "함수", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "함수", "일대일대응", "대응", "최댓값함수"], wide: false,
    content: "집합 $X=\\{1,2,3,4\\}$에 대하여 $X$에서 $X$로의 세 함수 $f,g,h$가 있다. $g(1)=2$, $g(2)=1$, $g(3)=g(4)=3$, $f(4)=2$이고 $h(x)=\\begin{cases}f(x)&(f(x)\\ge g(x))\\\\g(x)&(f(x)<g(x))\\end{cases}$이다. 함수 $h$가 일대일대응일 때, $f(2)+h(2)$의 값은? [4.5점]",
    choices: ["$2$", "$3$", "$4$", "$5$", "$6$"], answer: "①",
    solution: "$h(4)=3$이고 $h(3)\\ge3$이므로 일대일대응을 위해 $h(3)=4$이다. 남은 값 $1,2$를 $h(1),h(2)$가 가져야 하고 $h(1)\\ge2$이므로 $h(1)=2$, $h(2)=1$이다. $h(2)=\\max(f(2),1)=1$에서 $f(2)=1$이므로 합은 $2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 19, level: "중", category: "절대부등식", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "단답형", layoutTag: "grid", tags: ["단답형", "명제", "절대부등식", "산술기하평균", "최댓값"], wide: false,
    content: "[단답형 1] $a>0$, $b>0$일 때, $(a+b)\\left(\\dfrac2a+\\dfrac8b\\right)\\ge k$가 항상 성립하도록 하는 상수 $k$의 최댓값을 구하시오. [4점]",
    choices: [], answer: "$18$", solution: "식을 전개하면 $10+\\dfrac{2b}{a}+\\dfrac{8a}{b}$이다. 산술평균과 기하평균의 관계에 의해 $\\dfrac{2b}{a}+\\dfrac{8a}{b}\\ge2\\sqrt{16}=8$이므로 전체는 $18$ 이상이다. 등호가 가능하므로 $k$의 최댓값은 $18$이다."
  },
  {
    id: 20, level: "중", category: "집합의 조건", originalCategory: "집합", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-01", standardUnit: "집합", standardUnitOrder: 1,
    questionType: "단답형", layoutTag: "grid", tags: ["단답형", "집합", "교집합", "차집합", "원소의합"], wide: false,
    content: "[단답형 2] 두 집합 $A=\\{1,2,3,4\\}$, $B=\\{1,2,3,4,5,6,7\\}$에 대하여 집합 $P$가 $n(P\\cap A)=2$, $P-B=\\varnothing$이고 집합 $P$의 모든 원소의 합이 $20$일 때, 집합 $P$를 구하시오. [4점]",
    choices: [], answer: "$\\{3,4,6,7\\}$", solution: "$P\\subset B$이고 $1,2,3,4$ 중 정확히 두 원소를 포함해야 한다. 합이 $20$이 되는 경우를 확인하면 $3+4+6+7=20$뿐이므로 $P=\\{3,4,6,7\\}$이다."
  },
  {
    id: 21, level: "중", category: "원의 평행이동과 대칭이동", originalCategory: "도형의 이동", standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-12", standardUnit: "도형의 이동", standardUnitOrder: 12,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "도형의이동", "원", "평행이동", "대칭이동", "이등분"], wide: false,
    content: "[서술형 1] 원 $(x-4)^2+(y+3)^2=4$를 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $3$만큼 평행이동한 후 다시 직선 $y=x$에 대하여 대칭이동한 원의 넓이가 직선 $y=2x+k$에 의하여 이등분될 때, 실수 $k$의 값을 구하고 그 과정을 서술하시오. [7점]",
    choices: [], answer: "$2$", solution: "원래 원의 중심은 $(4,-3)$이다. 평행이동하면 $(2,0)$, 이를 $y=x$에 대칭이동하면 중심은 $(0,2)$이다. 원의 넓이를 직선이 이등분하려면 직선이 중심을 지나야 하므로 $2=2\\cdot0+k$에서 $k=2$이다."
  },
  {
    id: 22, level: "상", category: "명제의 부정", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "부정", "존재명제", "이차부등식", "판별식"], wide: false,
    content: "[서술형 2] 명제 '어떤 실수 $x$에 대하여 $x^2-6x+a<0$이다.'의 부정이 참일 때, (1) 주어진 명제의 부정을 쓰고, (2) 상수 $a$의 범위를 구하시오. [7점]",
    choices: [], answer: "(1) 모든 실수 $x$에 대하여 $x^2-6x+a\\ge0$이다. (2) $a\\ge9$", solution: "존재명제의 부정은 '모든 실수 $x$에 대하여 $x^2-6x+a\\ge0$이다'이다. $x^2-6x+a=(x-3)^2+a-9$이 모든 실수에서 음이 아니려면 최솟값 $a-9$가 $0$ 이상이어야 하므로 $a\\ge9$이다."
  },
  {
    id: 23, level: "상", category: "귀류법", originalCategory: "명제", standardCourse: "수학(하)",
    standardUnitKey: "H15-SB-02", standardUnit: "명제", standardUnitOrder: 2,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "명제", "귀류법", "무리수", "증명"], wide: false,
    content: "[서술형 3] 다음 명제가 참임을 귀류법을 이용하여 증명하시오. '$n\\ge2$인 자연수 $n$에 대하여 $\\sqrt{n^2-1}$은 무리수이다.' [7점]",
    choices: [], answer: "증명", solution: "$\\sqrt{n^2-1}$이 유리수라고 가정하고 이를 서로소인 자연수 $p,q$에 대해 $p/q$라 하자. $p^2=q^2(n^2-1)$이므로 서로소 조건에서 $q=1$이고 $\\sqrt{n^2-1}=p$는 정수이다. 그러면 $(n-p)(n+p)=1$이다. 두 인수는 양의 정수이므로 모두 $1$이어야 하고, 이로부터 $p=0$, $n=1$을 얻어 $n\\ge2$와 모순이다. 따라서 $\\sqrt{n^2-1}$은 무리수이다."
  }
];
