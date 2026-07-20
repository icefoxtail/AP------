window.examTitle = "25_효천고_2학기_중간_고1_기출";

window.questionBank = [
  {
    id: 1, level: "하", category: "두 점 사이의 거리", originalCategory: "평면좌표",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-01", standardUnit: "평면좌표", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "평면좌표", "두점사이거리"], wide: false,
    content: "좌표평면 위의 두 점 $A(-2,5)$, $B(3,0)$이 있다. 두 점 $A$, $B$ 사이의 거리는? [3.1점]",
    choices: ["$2\\sqrt5$", "$5$", "$5\\sqrt2$", "$10$", "$10\\sqrt2$"],
    answer: "③",
    solution: "두 점 사이의 거리 공식에 따라\n$\\overline{AB}=\\sqrt{(3-(-2))^2+(0-5)^2}=\\sqrt{25+25}=5\\sqrt2$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 2, level: "하", category: "두 직선의 수직 조건", originalCategory: "직선의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-02", standardUnit: "직선의 방정식", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "직선", "기울기", "수직"], wide: false,
    content: "두 직선 $x+3y+2=0$, $kx-2y-1=0$이 서로 수직일 때, 실수 $k$의 값은? [3.1점]",
    choices: ["$6$", "$8$", "$10$", "$12$", "$14$"],
    answer: "①",
    solution: "두 직선의 기울기는 각각 $-\\dfrac13$, $\\dfrac{k}{2}$이다. 서로 수직이므로 기울기의 곱이 $-1$이다.\n$-\\dfrac13\\cdot\\dfrac{k}{2}=-1$에서 $k=6$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 3, level: "하", category: "원의 중심과 반지름", originalCategory: "원의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-03", standardUnit: "원의 방정식", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원", "중심", "반지름", "완전제곱식"], wide: false,
    content: "원의 방정식 $x^2+y^2+2x-6y+6=0$의 중심 좌표와 반지름의 길이를 순서대로 올바르게 쓴 것은? [3.2점]",
    choices: ["$(-1,3),\\ 2$", "$(-1,3),\\ 4$", "$(1,-3),\\ 2$", "$(1,-3),\\ 4$", "$(1,3),\\ 4$"],
    answer: "①",
    solution: "$x^2+2x+y^2-6y+6=0$을 완전제곱식으로 정리하면\n$(x+1)^2+(y-3)^2=4$이다.\n따라서 중심은 $(-1,3)$이고 반지름의 길이는 $2$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 4, level: "중", category: "원의 접선", originalCategory: "원의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-03", standardUnit: "원의 방정식", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원", "접선", "직선", "점과직선사이거리"], wide: false,
    content: "원 $x^2+y^2=5$에 접하고 기울기가 $1$인 두 직선이 $y$축과 만나는 점을 각각 $A$, $B$라 할 때, $\\overline{AB}$의 길이는? [3.4점]",
    choices: ["$\\sqrt2$", "$\\sqrt5$", "$\\sqrt{10}$", "$2\\sqrt5$", "$2\\sqrt{10}$"],
    answer: "⑤",
    solution: "기울기가 $1$인 직선을 $y=x+b$라 두면 원점에서 이 직선까지의 거리는 $\\dfrac{|b|}{\\sqrt2}$이다. 접선이므로 이 거리가 원의 반지름 $\\sqrt5$와 같다.\n$\\dfrac{|b|}{\\sqrt2}=\\sqrt5$에서 $b=\\pm\\sqrt{10}$이다.\n두 접선의 $y$절편 차는 $2\\sqrt{10}$이므로 $\\overline{AB}=2\\sqrt{10}$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 5, level: "하", category: "집합의 뜻과 표현", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "집합의상등", "원소비교"], wide: false,
    content: "두 집합 $A=\\{3,\\ 2a,\\ b-4\\}$, $B=\\{3a,\\ 4,\\ 2\\}$에 대하여 $A=B$일 때, $a+b$의 값은? (단, $a,b$는 상수) [3.4점]",
    choices: ["$9$", "$10$", "$11$", "$12$", "$13$"],
    answer: "①",
    solution: "$4$가 집합 $A$의 원소여야 한다. $2a=4$인 경우에는 $A$에 있는 $3$을 $B$의 어느 원소와도 맞출 수 없으므로 불가능하다. 따라서 $b-4=4$, 즉 $b=8$이다.\n이때 $\\{3,2a\\}=\\{3a,2\\}$이어야 하므로 $a=1$이다.\n따라서 $a+b=1+8=9$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 6, level: "중", category: "원이 되기 위한 조건", originalCategory: "원의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-03", standardUnit: "원의 방정식", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원", "반지름", "매개변수", "범위"], wide: false,
    content: "방정식 $x^2+y^2-kx+2y+2k+1=0$이 나타내는 도형이 원이 되도록 하는 실수 $k$의 값의 범위는? [3.5점]",
    choices: ["$1<k<8$", "$0<k<4$", "$k<0$ 또는 $k>8$", "$k<1$ 또는 $k>8$", "$k<0$ 또는 $k>4$"],
    answer: "③",
    solution: "완전제곱식으로 정리하면\n$\\left(x-\\dfrac{k}{2}\\right)^2+(y+1)^2=\\dfrac{k^2}{4}-2k=\\dfrac{k(k-8)}4$이다.\n원이 되려면 반지름의 제곱이 양수여야 하므로 $k(k-8)>0$이다. 따라서 $k<0$ 또는 $k>8$이다.\n결론: 정답은 ③이다."
  },
  {
    id: 7, level: "하", category: "평행한 두 직선 사이의 거리", originalCategory: "직선의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-02", standardUnit: "직선의 방정식", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "평행선", "두직선사이거리", "매개변수"], wide: false,
    content: "평행한 두 직선 $2x-y+1=0$, $2x-y+k=0$ 사이의 거리가 $\\sqrt5$가 되도록 하는 모든 실수 $k$의 값의 곱은? [3.7점]",
    choices: ["$12$", "$24$", "$-12$", "$-24$", "$-36$"],
    answer: "④",
    solution: "평행한 두 직선 사이의 거리는 $\\dfrac{|k-1|}{\\sqrt{2^2+(-1)^2}}=\\dfrac{|k-1|}{\\sqrt5}$이다.\n$\\dfrac{|k-1|}{\\sqrt5}=\\sqrt5$이므로 $|k-1|=5$이고, $k=6$ 또는 $k=-4$이다.\n모든 $k$의 곱은 $6\\cdot(-4)=-24$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 8, level: "중", category: "점과 직선 사이의 거리", originalCategory: "직선의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-02", standardUnit: "직선의 방정식", standardUnitOrder: 2,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "직선", "점과직선사이거리", "수선의발", "빈칸추론", "도형"], wide: false,
    content: "다음 보기는 좌표평면 위의 점 $P(x_1,y_1)$과 점 $P$를 지나지 않는 직선 $l:ax+by+c=0$ ($a\\ne0$ 또는 $b\\ne0$) 사이의 거리를 구하는 과정 중 일부이다. 빈칸 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ에 들어갈 내용으로 알맞은 것을 순서대로 쓴 것은? [3.8점]<br><br>$a\\ne0$, $b\\ne0$일 때, 점 $P$에서 직선 $l$에 내린 수선의 발 $H$의 좌표를 $(x_2,y_2)$라고 하면 직선 $PH$와 직선 $l$의 기울기는 각각 $\\dfrac{y_2-y_1}{x_2-x_1}$, $-\\dfrac ab$이고, 두 직선은 서로 수직이므로 $\\dfrac{y_2-y_1}{x_2-x_1}\\times\\left(-\\dfrac ab\\right)=\\boxed{\\text{ㄱ}}$이다.<br>$\\dfrac{x_2-x_1}{a}=\\dfrac{y_2-y_1}{b}$이고, 이것을 $k$ ($k\\ne0$)로 놓으면 $x_2-x_1=ak$, $y_2-y_1=bk$이므로 $\\overline{PH}=\\sqrt{k^2(a^2+b^2)}=\\boxed{\\text{ㄴ}}\\sqrt{a^2+b^2}$이다.<br>한편 점 $H(x_2,y_2)$는 직선 $l$ 위의 점이므로 $ax_2+by_2+c=0$이고, 이 식에 $x_2=\\boxed{\\text{ㄷ}}$, $y_2=\\boxed{\\text{ㄹ}}$을 대입한다. 이로부터 $k=-\\dfrac{ax_1+by_1+c}{a^2+b^2}$이고, 이를 위 식에 대입하면 $\\overline{PH}=\\dfrac{\\boxed{\\text{ㅁ}}}{\\sqrt{a^2+b^2}}$이다.",
    image: "assets/images/25_효천고_2학기_중간_고1_기출/q08.png",
    choices: [
      "$(1,\\ |k|,\\ x_1+ak,\\ y_1+bk,\\ |ax_1+by_1+c|)$",
      "$(-1,\\ |k|,\\ x_1+ak,\\ y_1+bk,\\ |ax_1+by_1+c|)$",
      "$(-1,\\ k,\\ x_1+ak,\\ y_1+bk,\\ ax+by+c)$",
      "$(1,\\ k,\\ x+ak,\\ y+bk,\\ ax+by+c)$",
      "$(-1,\\ |k|,\\ x+ak,\\ y+bk,\\ |ax+by+c|)$"
    ],
    answer: "②",
    solution: "수직인 두 직선의 기울기의 곱은 $-1$이므로 ㄱ은 $-1$이다.\n$\\sqrt{k^2(a^2+b^2)}=|k|\\sqrt{a^2+b^2}$이므로 ㄴ은 $|k|$이다.\n$x_2-x_1=ak$, $y_2-y_1=bk$에서 $x_2=x_1+ak$, $y_2=y_1+bk$이므로 ㄷ, ㄹ은 각각 $x_1+ak$, $y_1+bk$이다.\n마지막으로 거리는 음수가 될 수 없으므로 분자는 $|ax_1+by_1+c|$이다. 따라서 ㄱ부터 ㅁ까지의 순서는 $(-1,|k|,x_1+ak,y_1+bk,|ax_1+by_1+c|)$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 9, level: "하", category: "집합과 원소의 관계", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "원소", "부분집합", "공집합", "집합의 뜻"], wide: false,
    content: "집합 $A=\\{\\varnothing,3,5,7,\\{7\\}\\}$에 대하여 다음 중 옳지 않은 것은? [3.8점]",
    choices: ["$\\varnothing\\in A$", "$\\varnothing\\subset A$", "$\\{\\varnothing\\}\\subset A$", "$\\{\\varnothing\\}\\in A$", "$\\{7\\}\\in A$"],
    answer: "④",
    solution: "$\\varnothing$은 $A$의 원소이므로 ①은 옳고, 공집합은 모든 집합의 부분집합이므로 ②도 옳다. $\\varnothing\\in A$이므로 $\\{\\varnothing\\}$은 $A$의 부분집합이어서 ③도 옳다. 또한 $\\{7\\}$은 $A$의 원소이므로 ⑤도 옳다. 그러나 $A$의 원소 목록에는 $\\{\\varnothing\\}$이 없으므로 ④는 옳지 않다. 결론: 정답은 ④이다."
  },
  {
    id: 10, level: "중", category: "집합의 연산", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "부분집합", "합집합", "교집합", "여집합", "포함관계"], wide: false,
    content: "전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $A\\cap B=B$일 때, 다음 <보기> 중 항상 옳은 것만을 있는 대로 고른 것은? [3.9점]<br><br>ㄱ. $B\\subset A$<br>ㄴ. $B^c\\subset A^c$<br>ㄷ. $A\\cup B=A$<br>ㄹ. $A\\cap B^c\\ne\\varnothing$",
    choices: ["ㄱ", "ㄴ, ㄹ", "ㄱ, ㄷ", "ㄴ, ㄷ, ㄹ", "ㄱ, ㄷ, ㄹ"],
    answer: "③",
    solution: "$A\\cap B=B$는 $B\\subset A$를 뜻하므로 ㄱ은 항상 옳다. 이때 합집합은 $A\\cup B=A$이므로 ㄷ도 항상 옳다. 여집합의 포함 관계는 $A^c\\subset B^c$이므로 ㄴ은 항상 옳지 않다. 또한 $A=B$인 경우에는 $A\\cap B^c=\\varnothing$이므로 ㄹ도 항상 옳다고 할 수 없다. 따라서 항상 옳은 것은 ㄱ, ㄷ이다. 결론: 정답은 ③이다."
  },
  {
    id: 11, level: "중", category: "원과 직선의 위치 관계", originalCategory: "원의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-03", standardUnit: "원의 방정식", standardUnitOrder: 3,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "원", "직선", "교점", "점과직선사이거리", "매개변수"], wide: false,
    content: "중심이 점 $(a,a)$이고 반지름의 길이가 $\\dfrac13$인 원이 직선 $y=-x+3$과 만나도록 하는 $a$의 최댓값과 최솟값을 각각 $M$, $m$이라 할 때, $M+m$의 값은? (단, $a$는 상수) [4점]",
    choices: ["$\\dfrac32$", "$3$", "$\\dfrac52$", "$5$", "$7$"],
    answer: "②",
    solution: "직선을 $x+y-3=0$으로 나타내면 중심 $(a,a)$에서 직선까지의 거리는 $\\dfrac{|2a-3|}{\\sqrt2}$이다. 원과 직선이 만나려면\n$\\dfrac{|2a-3|}{\\sqrt2}\\le\\dfrac13$이어야 한다.\n따라서 $|2a-3|\\le\\dfrac{\\sqrt2}{3}$이고, $a$의 범위의 양 끝값의 합은 $3$이다. 즉 $M+m=3$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 12, level: "중", category: "도형의 대칭이동과 평행이동", originalCategory: "도형의 이동",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-04", standardUnit: "도형의 이동", standardUnitOrder: 4,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "포물선", "원점대칭", "평행이동", "접선"], wide: false,
    content: "포물선 $y=x^2+6x+13$을 원점에 대하여 대칭이동한 후, $y$축의 방향으로 $a$만큼 평행이동한 포물선이 $x$축과 점 $(b,0)$에서 접할 때, $a-b$의 값은? (단, $a,b$는 상수) [4.1점]",
    choices: ["$1$", "$2$", "$3$", "$4$", "$5$"],
    answer: "①",
    solution: "원래 포물선은 $y=(x+3)^2+4$이다. 원점 대칭이동하면 $y=-(x-3)^2-4$이고, 다시 $y$축 방향으로 $a$만큼 평행이동하면\n$y=-(x-3)^2-4+a$이다.\n이 포물선이 $x$축에 접하려면 꼭짓점이 $(3,0)$이어야 하므로 $a=4$, $b=3$이다. 따라서 $a-b=1$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 13, level: "상", category: "도형의 이동", originalCategory: "도형의 이동",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-04", standardUnit: "도형의 이동", standardUnitOrder: 4,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "도형의이동", "대칭이동", "평행이동", "좌표변환", "그래프", "도형"], wide: false,
    content: "두 방정식 $f(x,y)=0$, $g(x,y)=0$이 나타내는 도형이 아래 그림과 같을 때, 다음 중 옳은 것은? [4.3점]",
    image: "assets/images/25_효천고_2학기_중간_고1_기출/q13.png",
    choices: [
      "$g(x,y)=f(x-7,-y+2)$",
      "$g(x,y)=f(x+7,-y-2)$",
      "$g(x,y)=f(-x+7,y+2)$",
      "$g(x,y)=f(-x-7,y+2)$",
      "$g(x,y)=f(x+7,-y+2)$"
    ],
    answer: "⑤",
    solution: "$f(x,y)=0$의 점 $(u,v)$가 $g(x,y)=0$의 점으로 옮겨지는 변환을 살펴본다. 그림에서 $(2,2)$는 $(-5,0)$으로, $(5,7)$은 $(-2,-5)$로 옮겨진다.\n이는 $x=u-7$, $y=2-v$인 변환이므로 $u=x+7$, $v=-y+2$이다.\n따라서 $g(x,y)=f(x+7,-y+2)$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 14, level: "중", category: "각의 이등분선과 내분점", originalCategory: "평면좌표",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-01", standardUnit: "평면좌표", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "삼각형", "내심", "각의이등분선", "내분점", "도형"], wide: false,
    content: "그림과 같이 좌표평면 위의 점 $A(-1,2)$, $B(-3,0)$, $C(2,-1)$을 세 꼭짓점으로 하는 삼각형 $ABC$가 있다. 삼각형 $ABC$의 내심을 점 $I$라 할 때, 직선 $AI$와 선분 $BC$의 교점의 좌표는? [4.4점]",
    image: "assets/images/25_효천고_2학기_중간_고1_기출/q14.png",
    choices: ["$\\left(-\\dfrac32,-\\dfrac37\\right)$", "$\\left(-1,\\dfrac25\\right)$", "$\\left(-\\dfrac67,-\\dfrac37\\right)$", "$\\left(-1,-\\dfrac25\\right)$", "$\\left(-\\dfrac43,-\\dfrac13\\right)$"],
    answer: "④",
    solution: "$\\overline{AB}=\\sqrt{(-2)^2+(-2)^2}=2\\sqrt2$, $\\overline{AC}=\\sqrt{3^2+(-3)^2}=3\\sqrt2$이다.\n각의 이등분선 정리에 의해 교점을 $D$라 하면 $BD:DC=AB:AC=2:3$이다.\n내분점 공식으로\n$D=\\dfrac{3B+2C}{5}=\\left(\\dfrac{3(-3)+2(2)}5,\\dfrac{3(0)+2(-1)}5\\right)=\\left(-1,-\\dfrac25\\right)$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 15, level: "중", category: "집합의 원소의 개수", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "합집합", "교집합", "원소의개수", "최댓값", "최솟값"], wide: false,
    content: "성선이네 반 학생 $25$명을 대상으로 두 선택 과목 $A$, $B$에 대한 선호도를 조사한 결과 과목 $A$를 선호하는 학생이 $12$명, 과목 $B$를 선호하는 학생이 $17$명이었다. 두 과목을 모두 선호하는 학생이 $x$명일 때, $x$의 최댓값을 $a$, 최솟값을 $b$라 할 때 $a-b$의 값은? [4.4점]",
    choices: ["$7$", "$8$", "$9$", "$10$", "$11$"],
    answer: "②",
    solution: "교집합의 원소 수의 최댓값은 두 집합 중 작은 쪽의 원소 수인 $12$이다.\n또 $n(A\\cup B)\\le25$이므로 $12+17-x\\le25$에서 $x\\ge4$이다. 따라서 최솟값은 $4$이다.\n$a-b=12-4=8$이다.\n결론: 정답은 ②이다."
  },
  {
    id: 16, level: "중", category: "집합의 연산", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "집합", "여집합", "교집합", "합집합", "드모르간법칙"], wide: false,
    content: "전체집합 $U=\\{x\\mid x\\text{는 }15\\text{ 이하의 자연수}\\}$의 세 부분집합 $A$, $B$, $C$에 대해 $A=\\{1,2,4,7,8\\}$, $B=\\{3,4,5,7,9\\}$, $C=\\{4,7,10,12,13\\}$일 때, $(A\\cap B^c)\\cup(A\\cap C^c)$의 모든 원소의 합은? [4.5점]",
    choices: ["$8$", "$9$", "$10$", "$11$", "$12$"],
    answer: "④",
    solution: "분배법칙과 드모르간 법칙을 이용하면\n$(A\\cap B^c)\\cup(A\\cap C^c)=A\\cap(B^c\\cup C^c)=A\\cap(B\\cap C)^c$이다.\n$B\\cap C=\\{4,7\\}$이므로 구하는 집합은 $A$에서 $4,7$을 뺀 $\\{1,2,8\\}$이다.\n모든 원소의 합은 $1+2+8=11$이다.\n결론: 정답은 ④이다."
  },
  {
    id: 17, level: "상", category: "평행이동과 넓이의 이등분", originalCategory: "도형의 이동",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-04", standardUnit: "도형의 이동", standardUnitOrder: 4,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "직선", "평행이동", "원", "중심", "넓이이등분"], wide: false,
    content: "직선 $y=k(x+3)-5$를 $x$축의 방향으로 $5$만큼, $y$축의 방향으로 $8$만큼 평행이동한 직선을 $l$이라 하자. 실수 $k$의 값에 관계없이 직선 $l$이 원 $x^2+y^2+2ax+3by=0$의 넓이를 이등분할 때, $ab$의 값은? (단, $a,b$는 상수) [4.6점]",
    choices: ["$4$", "$6$", "$8$", "$10$", "$12$"],
    answer: "①",
    solution: "직선을 $(5,8)$만큼 평행이동하면\n$y-8=k\\{(x-5)+3\\}-5$, 즉 $y=k(x-2)+3$이다. 모든 $k$에 대한 이 직선은 한 점 $(2,3)$을 지난다.\n원이 직선에 의해 넓이가 이등분되려면 직선이 원의 중심을 지나야 한다. 원의 중심은 $\\left(-a,-\\dfrac{3b}{2}\\right)$이므로\n$-a=2$, $-\\dfrac{3b}{2}=3$이다. 따라서 $a=-2$, $b=-2$이고 $ab=4$이다.\n결론: 정답은 ①이다."
  },
  {
    id: 18, level: "상", category: "대칭이동을 이용한 거리", originalCategory: "평면좌표",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-01", standardUnit: "평면좌표", standardUnitOrder: 1,
    questionType: "객관식", layoutTag: "grid", tags: ["객관식", "직사각형", "대칭이동", "최단거리", "수선의발", "도형"], wide: false,
    content: "그림과 같이 네 점 $O(0,0)$, $A(0,17)$, $B(-10,17)$, $C(-10,0)$을 꼭짓점으로 하는 직사각형 $OABC$가 있다. 직사각형 $OABC$ 내부의 두 점 $P(-2,1)$과 점 $Q$에 대하여 선분 $OA$ 위에 $\\angle PR_1O=\\angle QR_1A$가 되는 점 $R_1$을 잡고, 선분 $AB$ 위에 $\\angle PR_2A=\\angle QR_2B$가 되는 점 $R_2$를 잡는다. 또 선분 $BC$ 위에 $\\angle PR_3C=\\angle QR_3B$가 되는 점 $R_3$을 잡고, 선분 $CO$ 위에 $\\angle PR_4O=\\angle QR_4C$가 되는 점 $R_4$를 잡는다. 두 선분 $PR_i$, $R_iQ$ ($i=1,2,3,4$)의 길이의 합이 항상 일정할 때, 점 $Q$의 좌표는? [4.8점]",
    image: "assets/images/25_효천고_2학기_중간_고1_기출/q18.png",
    choices: ["$(-6,15)$", "$(-7,12)$", "$(-7,14)$", "$(-8,14)$", "$(-8,16)$"],
    answer: "⑤",
    solution: "각 변에서 입사각과 반사각이 같으므로 점 $P$를 그 변에 대하여 대칭이동한 점과 $Q$ 사이의 거리가 $PR_i+R_iQ$와 같다.\n$P(-2,1)$을 네 직선 $x=0$, $y=17$, $x=-10$, $y=0$에 대하여 대칭이동한 점은 각각\n$(2,1)$, $(-2,33)$, $(-18,1)$, $(-2,-1)$이다.\n네 거리의 값이 같으려면 $Q$는 이 네 점에서 같은 거리에 있어야 한다. $(2,1)$과 $(-18,1)$의 수직이등분선은 $x=-8$이고, $(-2,33)$과 $(-2,-1)$의 수직이등분선은 $y=16$이다.\n따라서 $Q=(-8,16)$이다.\n결론: 정답은 ⑤이다."
  },
  {
    id: 19, level: "중", category: "대칭이동", originalCategory: "도형의 이동",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-04", standardUnit: "도형의 이동", standardUnitOrder: 4,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "대칭이동", "좌표", "두점사이거리"], wide: false,
    content: "[서술형 1] 좌표평면 위의 점 $A$를 $x$축, $y$축, 원점에 대하여 대칭이동한 점을 각각 $B$, $C$, $D$라 하자. $\\overline{AB}=4$, $\\overline{AC}=6$일 때, 선분 $AD$의 길이를 구하고 그 과정을 서술하시오. [5점]",
    choices: [],
    answer: "$2\\sqrt{13}$",
    solution: "점 $A$를 $(x,y)$라 하면 $x$축 대칭점은 $B(x,-y)$, $y$축 대칭점은 $C(-x,y)$, 원점 대칭점은 $D(-x,-y)$이다.\n$\\overline{AB}=2|y|=4$이므로 $|y|=2$이고, $\\overline{AC}=2|x|=6$이므로 $|x|=3$이다.\n따라서\n$\\overline{AD}=\\sqrt{(-2x)^2+(-2y)^2}=2\\sqrt{x^2+y^2}=2\\sqrt{9+4}=2\\sqrt{13}$이다.\n결론: $\\overline{AD}=2\\sqrt{13}$이다."
  },
  {
    id: 20, level: "중", category: "집합의 원소의 개수", originalCategory: "집합",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "집합", "원소의개수", "합집합", "교집합", "여집합"], wide: false,
    content: "[서술형 2] 전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $n(U)=150$, $n(A)=62$, $n(B)=96$, $n(A^c\\cap B^c)=18$일 때, $n(A\\cap B)$를 구하고 그 과정을 서술하시오. [6점]",
    choices: [],
    answer: "$26$",
    solution: "드모르간 법칙에 의해 $A^c\\cap B^c=(A\\cup B)^c$이다. 따라서\n$n(A\\cup B)=n(U)-n(A^c\\cap B^c)=150-18=132$이다.\n포함배제 원리를 적용하면\n$132=n(A)+n(B)-n(A\\cap B)=62+96-n(A\\cap B)$이다.\n따라서 $n(A\\cap B)=26$이다.\n결론: $n(A\\cap B)=26$이다."
  },
  {
    id: 21, level: "중", category: "선분의 내분과 외분", originalCategory: "평면좌표",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-01", standardUnit: "평면좌표", standardUnitOrder: 1,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "평면좌표", "내분점", "외분점", "거리의비"], wide: false,
    content: "[서술형 3] 두 점 $A(-8,-6)$, $B(2,9)$과 선분 $AB$의 연장선 위의 점 $C$가 $2\\overline{BC}=3\\overline{AC}$를 만족시킬 때, 점 $C$의 좌표를 모두 구하고 그 과정을 서술하시오. [6점]",
    choices: [],
    answer: "$(-4,0)$, $(-28,-36)$",
    solution: "점 $C$를 $A+t(B-A)$로 나타내면 $B-A=(10,15)$이고,\n$\\overline{AC}=|t|\\overline{AB}$, $\\overline{BC}=|t-1|\\overline{AB}$이다.\n조건에서 $2|t-1|=3|t|$이고, 양변을 제곱하면\n$4(t-1)^2=9t^2$, 즉 $5t^2+8t-4=0$이다.\n이를 풀면 $t=\\dfrac25$ 또는 $t=-2$이다.\n$t=\\dfrac25$일 때 $C=(-8,-6)+\\dfrac25(10,15)=(-4,0)$이고,\n$t=-2$일 때 $C=(-8,-6)-2(10,15)=(-28,-36)$이다.\n결론: 점 $C$의 좌표는 $(-4,0)$, $(-28,-36)$이다."
  },
  {
    id: 22, level: "상", category: "좌표축에 접하는 원", originalCategory: "원의 방정식",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-03", standardUnit: "원의 방정식", standardUnitOrder: 3,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "원", "좌표축", "접선", "중심사이거리"], wide: false,
    content: "[서술형 4] 점 $(-2,3)$을 지나고 $x$축과 $y$축에 동시에 접하는 두 원의 중심 사이의 거리를 구하고 그 과정을 서술하시오. [6점]",
    choices: [],
    answer: "$4\\sqrt6$",
    solution: "두 좌표축에 동시에 접하는 원의 중심을 $(\\varepsilon r,\\delta r)$라 두자. 여기서 $r>0$이고 $\\varepsilon,\\delta$는 각각 $1$ 또는 $-1$이다.\n점 $(-2,3)$을 지나므로\n$(\\varepsilon r+2)^2+(\\delta r-3)^2=r^2$이다.\n네 부호를 조사하면 양의 반지름을 갖는 경우는 $\\varepsilon=-1$, $\\delta=1$뿐이고,\n$r^2-10r+13=0$에서 $r=5\\pm2\\sqrt3$이다.\n두 중심은 $(-(5+2\\sqrt3),5+2\\sqrt3)$, $(-(5-2\\sqrt3),5-2\\sqrt3)$이다. 두 좌표의 차가 각각 $-4\\sqrt3$, $4\\sqrt3$이므로 중심 사이의 거리는\n$\\sqrt{(4\\sqrt3)^2+(4\\sqrt3)^2}=4\\sqrt6$이다.\n결론: 두 원의 중심 사이의 거리는 $4\\sqrt6$이다."
  },
  {
    id: 23, level: "상", category: "도형의 이동과 원의 넓이 이등분", originalCategory: "도형의 이동",
    standardCourse: "공통수학2", standardUnitKey: "H22-C2-04", standardUnit: "도형의 이동", standardUnitOrder: 4,
    questionType: "서술형", layoutTag: "grid", tags: ["서술형", "절댓값함수", "평행이동", "원", "넓이이등분", "정수조건"], wide: false,
    content: "[서술형 5] $|a|\\le9$, $|b|\\le4$인 두 정수 $a$, $b$에 대하여 함수 $y=|x|$의 그래프를 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동한 함수의 그래프가 $x^2+y^2-8x-4y+18=0$의 중심을 지나고 원의 넓이를 이등분할 때, 두 수 $a$, $b$의 모든 순서쌍 $(a,b)$를 구하고 그 과정을 서술하시오. [7점]",
    choices: [],
    answer: "$(3,1)$, $(2,0)$, $(1,-1)$, $(0,-2)$, $(-1,-3)$, $(-2,-4)$, $(5,1)$, $(6,0)$, $(7,-1)$, $(8,-2)$, $(9,-3)$",
    solution: "원을 완전제곱식으로 나타내면 $(x-4)^2+(y-2)^2=2$이므로 중심은 $(4,2)$이다. 평행이동한 절댓값 함수는 $y=|x-a|+b$이다.\n그래프가 중심을 지나므로\n$2=|4-a|+b$, 즉 $b=2-|4-a|$이다.\n원의 넓이를 이등분하려면 원 안에서 그래프가 중심을 지나는 한 직선 조각으로 나타나야 하므로 꼭짓점 $(a,b)$은 원의 내부에 놓이지 않아야 한다. 위 관계와 정수 범위 $|a|\\le9$, $|b|\\le4$를 함께 조사하면\n$a\\le4$에서는 $(a,b)=(3,1),(2,0),(1,-1),(0,-2),(-1,-3),(-2,-4)$이고,\n$a\\ge4$에서는 $(a,b)=(5,1),(6,0),(7,-1),(8,-2),(9,-3)$이다.\n각 경우 원 안에서는 중심을 지나는 기울기 $1$ 또는 $-1$의 한 직선 조각만 남아 원의 넓이를 이등분한다.\n결론: 순서쌍은 $(3,1)$, $(2,0)$, $(1,-1)$, $(0,-2)$, $(-1,-3)$, $(-2,-4)$, $(5,1)$, $(6,0)$, $(7,-1)$, $(8,-2)$, $(9,-3)$이다."
  }
];
