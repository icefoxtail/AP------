window.examTitle = "22_제일고_1학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "상",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}x^2+y^2-5xy=-5\\\\ xy-(x+y)=-1\\end{cases}$을 만족시키는 $x,y$에 대하여 $x+2y$의 최솟값은? [4.4점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "[키포인트] $x+y$와 $xy$를 이용해 두 수 $x,y$의 가능한 값을 먼저 찾은 뒤, $x+2y$를 비교한다.\\n\\n$x+y=s$, $xy=p$라 두면 두 번째 식에서\\n$p-s=-1$이므로 $p=s-1$이다.\\n또한 $x^2+y^2=s^2-2p$이므로 첫 번째 식은\\n$s^2-2p-5p=-5$, 즉 $s^2-7p=-5$가 된다.\\n$p=s-1$을 대입하면\\n$s^2-7(s-1)=-5$\\n$s^2-7s+12=0$\\n$(s-3)(s-4)=0$이다.\\n\\n따라서 $x+y=3$ 또는 $x+y=4$이다.\\n$x+y=3$, $xy=2$이면 두 수는 $1,2$이다. 이때 $x+2y$의 가능한 값은 $1+2\\cdot2=5$, $2+2\\cdot1=4$이다.\\n$x+y=4$, $xy=3$이면 두 수는 $1,3$이다. 이때 $x+2y$의 가능한 값은 $1+2\\cdot3=7$, $3+2\\cdot1=5$이다.\\n\\n가능한 값 중 최솟값은 $4$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 2,
    "level": "중",
    "category": "부등식의 활용",
    "originalCategory": "부등식의 활용",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "부등식의 활용",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "$6\\%$의 소금물 $800\\text{g}$의 물을 증발시켜 $8\\%$ 이상 $12\\%$ 이하의 소금물을 만들고 한다. 증발시켜야 하는 물의 양이 $a\\text{g}$ 이상 $b\\text{g}$ 이하라 할 때, $a+b$의 값을 구하면? [4.6점]",
    "choices": [
      "$400$",
      "$450$",
      "$500$",
      "$550$",
      "$600$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 증발하는 것은 물뿐이므로 소금의 양은 변하지 않는다.\\n\\n처음 소금물 $800\\text{g}$에 들어 있는 소금의 양은\\n$800\\times0.06=48\\text{g}$이다.\\n물을 $x\\text{g}$ 증발시키면 전체 소금물의 양은 $800-x\\text{g}$이고, 소금의 양은 그대로 $48\\text{g}$이다.\\n\\n농도가 $8\\%$ 이상 $12\\%$ 이하가 되어야 하므로\\n$0.08\\le \\dfrac{48}{800-x}\\le0.12$이다.\\n\\n왼쪽 부등식에서\\n$0.08\\le \\dfrac{48}{800-x}$\\n$0.08(800-x)\\le48$\\n$64-0.08x\\le48$\\n$x\\ge200$이다.\\n오른쪽 부등식에서\\n$\\dfrac{48}{800-x}\\le0.12$\\n$48\\le0.12(800-x)$\\n$48\\le96-0.12x$\\n$x\\le400$이다.\\n\\n따라서 $200\\le x\\le400$이므로 $a=200$, $b=400$이다.\\n$a+b=600$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "level": "중",
    "category": "연립부등식",
    "originalCategory": "연립부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립부등식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "연립부등식 $\\begin{cases}x^2-10x+24\\le0\\\\ -2x^2+7x+9<0\\end{cases}$을 만족시키는 정수 $x$가 될 수 있는 모든 값의 합을 구하면? [3.7점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$11$",
      "$17$"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 부등식의 해를 각각 구한 뒤 공통으로 만족하는 정수만 고른다.\\n\\n첫 번째 부등식은\\n$x^2-10x+24\\le0$\\n$(x-4)(x-6)\\le0$이므로\\n$4\\le x\\le6$이다.\\n\\n두 번째 부등식은\\n$-2x^2+7x+9<0$이다. 양변에 $-1$을 곱하면 부등호 방향이 바뀌어\\n$2x^2-7x-9>0$이다.\\n이를 인수분해하면\\n$(2x-9)(x+1)>0$이므로\\n$x<-1$ 또는 $x>\\dfrac92$이다.\\n\\n두 범위의 공통부분은\\n$\\dfrac92<x\\le6$이다.\\n이를 만족하는 정수는 $5,6$이고 합은 $11$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 4,
    "level": "상",
    "category": "이차부등식",
    "originalCategory": "이차부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차부등식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "모든 실수 $x$에 대하여 이차부등식 $ax^2+2(a-3)x+2a-14\\le0$이 성립할 때, 실수 $a$의 값의 범위를 구하면? [4.4점]",
    "choices": [
      "$a\\le-1$",
      "$a<-1$",
      "$a\\ge9$",
      "$a>9$",
      "$a\\ge9$ 또는 $a\\le-1$"
    ],
    "answer": "①",
    "solution": "[키포인트] 이차식이 모든 실수 $x$에 대해 $0$ 이하가 되려면 그래프가 아래로 열리고, $x$축 위로 올라가는 부분이 없어야 한다.\\n\\n주어진 식을 $f(x)=ax^2+2(a-3)x+2a-14$라 하자.\\n모든 실수 $x$에 대하여 $f(x)\\le0$이 되려면 먼저 그래프가 아래로 열려야 하므로 $a<0$이어야 한다.\\n또 $x$축보다 위로 올라가는 부분이 없어야 하므로 이차방정식 $f(x)=0$의 판별식은 $0$ 이하이어야 한다.\\n\\n판별식의 $\\dfrac{D}{4}$를 계산하면\\n$\\dfrac{D}{4}=(a-3)^2-a(2a-14)$\\n$=a^2-6a+9-2a^2+14a$\\n$=-a^2+8a+9$이다.\\n따라서\\n$-a^2+8a+9\\le0$\\n$a^2-8a-9\\ge0$\\n$(a-9)(a+1)\\ge0$이다.\\n그러므로 $a\\le-1$ 또는 $a\\ge9$이다.\\n여기에 $a<0$을 함께 만족해야 하므로\\n$a\\le-1$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "좌표평면 위에 세 점 $O(0,0)$, $A(a,-5)$, $B(b,a)$를 꼭짓점으로 하는 삼각형 $OAB$에서 $\\angle AOB=90^\\circ$인 직각삼각형이 되도록 하는 $b$의 값은? (단, $a\\ne0$) [3.9점]",
    "choices": [
      "$0$",
      "$1$",
      "$\\dfrac32$",
      "$\\dfrac52$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 선분 $OA$, $OB$가 서로 수직이면 두 기울기의 곱이 $-1$이다.\\n\\n점 $O(0,0)$과 $A(a,-5)$를 지나는 직선 $OA$의 기울기는\\n$\\dfrac{-5}{a}$이다.\\n점 $O(0,0)$과 $B(b,a)$를 지나는 직선 $OB$의 기울기는\\n$\\dfrac{a}{b}$이다.\\n두 직선이 서로 수직이므로\\n$\\dfrac{-5}{a}\\cdot\\dfrac{a}{b}=-1$이다.\\n$a\\ne0$이므로 약분하면\\n$-\\dfrac5b=-1$이다.\\n따라서 $b=5$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 6,
    "level": "상",
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "두 점 $A(0,4)$, $B(3,1)$을 잇는 직선 $AB$ 위의 점 $C(a,b)$에 대하여 삼각형 $OBC$의 넓이가 삼각형 $OAC$의 넓이의 $3$배일 때, $a+b$의 값은? (단, $a<0$) [4.9점]",
    "choices": [
      "$+16$",
      "$+12$",
      "$+8$",
      "$+4$",
      "$0$"
    ],
    "answer": "④",
    "solution": "[키포인트] 점 $C$가 직선 $AB$ 위에 있다는 조건과 두 삼각형의 넓이 조건을 함께 사용한다.\\n\\n직선 $AB$의 기울기는\\n$\\dfrac{1-4}{3-0}=-1$이므로 직선 $AB$의 방정식은\\n$y=-x+4$이다.\\n따라서 $C(a,b)$는 이 직선 위에 있으므로\\n$b=-a+4$이다.\\n\\n삼각형 $OAC$에서 $OA$는 $y$축 위의 길이 $4$인 선분이다. 점 $C(a,b)$에서 $y$축까지의 거리는 $|a|$이므로\\n$\\triangle OAC=\\dfrac12\\cdot4\\cdot|a|=2|a|$이다.\\n문제에서 $a<0$이므로 $|a|=-a$이고, 따라서 $\\triangle OAC=-2a$이다.\\n\\n삼각형 $OBC$의 넓이는 좌표를 이용하여\\n$\\dfrac12|3b-a|$이다. $b=-a+4$를 대입하면\\n$\\dfrac12|3(-a+4)-a|=\\dfrac12|-4a+12|$이다.\\n$a<0$이면 $-4a+12>0$이므로\\n$\\triangle OBC=-2a+6$이다.\\n\\n$\\triangle OBC=3\\triangle OAC$이므로\\n$-2a+6=3(-2a)$\\n$-2a+6=-6a$\\n$4a=-6$\\n$a=-\\dfrac32$이다.\\n$b=-a+4=\\dfrac32+4=\\dfrac{11}{2}$이므로\\n$a+b=-\\dfrac32+\\dfrac{11}{2}=4$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "두 점 $A$, $B$에 대하여 선분 $\\overline{AB}=12$이고 $\\overline{AB}$를 $1:3$으로 내분하는 점을 $P$와 $1:3$으로 외분하는 점을 $Q$라 할 때, $\\overline{PQ}$의 길이는? [3.7점]",
    "choices": [
      "$3$",
      "$6$",
      "$9$",
      "$12$",
      "$15$"
    ],
    "answer": "③",
    "solution": "[키포인트] 선분 위에 좌표를 간단히 잡아 내분점과 외분점의 위치를 구한다.\\n\\n계산을 쉽게 하기 위해 수직선 위에서 $A=0$, $B=12$라고 두자.\\n$P$는 $\\overline{AB}$를 $1:3$으로 내분하므로\\n$AP:PB=1:3$이다. 전체 길이가 $12$이므로\\n$AP=3$이고, 따라서 $P$의 위치는 $3$이다.\\n\\n$Q$는 $\\overline{AB}$를 $1:3$으로 외분하는 점이다. $A$의 바깥쪽에 위치하며, 외분점 공식 또는 길이 관계를 이용하면 $Q=-6$이다.\\n따라서\\n$PQ=|3-(-6)|=9$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
    "level": "상",
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "세 점 $A(a,3)$, $B(-2,6)$, $C(6,b)$에 대하여 선분 $AB$, $BC$, $AC$를 $3:1$로 외분하는 점을 각각 $D,E,F$이고 $DEF$의 무게중심 $G$의 좌표가 $(2,6)$일 때, $a+b$는? [5.2점]",
    "choices": [
      "$15$",
      "$16$",
      "$17$",
      "$18$",
      "$19$"
    ],
    "answer": "①",
    "solution": "[키포인트] 외분점 좌표를 각각 구한 뒤, 세 점 $D,E,F$의 무게중심 좌표를 이용한다.\\n\\n$D$는 $AB$를 $3:1$로 외분하는 점이므로\\n$D\\left(\\dfrac{3(-2)-a}{2},\\dfrac{3\\cdot6-3}{2}\\right)=\\left(\\dfrac{-6-a}{2},\\dfrac{15}{2}\\right)$이다.\\n$E$는 $BC$를 $3:1$로 외분하는 점이므로\\n$E\\left(\\dfrac{3\\cdot6-(-2)}{2},\\dfrac{3b-6}{2}\\right)=\\left(10,\\dfrac{3b-6}{2}\\right)$이다.\\n$F$는 $AC$를 $3:1$로 외분하는 점이므로\\n$F\\left(\\dfrac{3\\cdot6-a}{2},\\dfrac{3b-3}{2}\\right)=\\left(\\dfrac{18-a}{2},\\dfrac{3b-3}{2}\\right)$이다.\\n\\n무게중심은 세 꼭짓점의 좌표 평균이므로, $x$좌표에서\\n$\\dfrac{\\frac{-6-a}{2}+10+\\frac{18-a}{2}}{3}=2$이다.\\n분자를 정리하면 $16-a$이므로\\n$\\dfrac{16-a}{3}=2$\\n$a=10$이다.\\n\\n$y$좌표에서\\n$\\dfrac{\\frac{15}{2}+\\frac{3b-6}{2}+\\frac{3b-3}{2}}{3}=6$이다.\\n분자를 정리하면 $3+3b$이므로\\n$\\dfrac{3+3b}{3}=6$\\n$b+1=6$\\n$b=5$이다.\\n따라서 $a+b=10+5=15$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 9,
    "level": "상",
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "세 점 $A(2,3)$, $B(8,-5)$, $C(-2,0)$을 꼭짓점으로 하는 삼각형 $ABC$에서 $\\angle A$의 이등분선이 변 $BC$와 만나는 점 $D$의 좌표를 $D(a,b)$라 할 때, $a+b$의 값은? [5.2점]",
    "choices": [
      "$-\\dfrac13$",
      "$-\\dfrac12$",
      "$-1$",
      "$-\\dfrac43$",
      "$-\\dfrac32$"
    ],
    "answer": "①",
    "solution": "[키포인트] 각의 이등분선은 마주 보는 변을 양쪽 변의 길이의 비로 나눈다.\\n\\n먼저 $AB$, $AC$의 길이를 구한다.\\n$AB=\\sqrt{(8-2)^2+(-5-3)^2}=\\sqrt{36+64}=10$이고,\\n$AC=\\sqrt{(-2-2)^2+(0-3)^2}=\\sqrt{16+9}=5$이다.\\n\\n$AD$가 $\\angle A$의 이등분선이므로 점 $D$는 변 $BC$를\\n$BD:DC=AB:AC=10:5=2:1$로 나눈다.\\n따라서 $D$는 $B(8,-5)$와 $C(-2,0)$를 $2:1$로 내분하는 점이다.\\n\\n내분점 좌표를 구하면\\n$D\\left(\\dfrac{1\\cdot8+2\\cdot(-2)}{3},\\dfrac{1\\cdot(-5)+2\\cdot0}{3}\\right)=\\left(\\dfrac43,-\\dfrac53\\right)$이다.\\n따라서 $a=\\dfrac43$, $b=-\\dfrac53$이므로\\n$a+b=-\\dfrac13$이다.\\n따라서 정답은 ①이다.",
    "image": "assets/images/22_제일고_1학기_기말_고1_기출/q9.png"
  },
  {
    "id": 10,
    "level": "하",
    "category": "직선의 방정식",
    "originalCategory": "직선의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-02",
    "standardUnit": "직선의 방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "직선의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "$(-2,1)$, $(4,4)$를 지나는 직선의 방정식이 $y=mx+n$이라고 할 때, $mn$의 값으로 알맞은 것은? [4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 점을 지나는 직선의 기울기를 구하고, 한 점을 대입해 절편을 찾는다.\\n\\n기울기 $m$은\\n$m=\\dfrac{4-1}{4-(-2)}=\\dfrac{3}{6}=\\dfrac12$이다.\\n따라서 직선은 $y=\\dfrac12x+n$이다.\\n점 $(-2,1)$을 대입하면\\n$1=\\dfrac12(-2)+n$\\n$1=-1+n$\\n$n=2$이다.\\n따라서\\n$mn=\\dfrac12\\cdot2=1$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
    "level": "상",
    "category": "직선의 방정식",
    "originalCategory": "직선의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-02",
    "standardUnit": "직선의 방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "직선의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "두 직선 $2x-y=0$, $3x+2y+7=0$의 교점을 지나는 직선 중에서 원점 $O$로부터의 거리가 최대가 되는 직선의 방정식을 $y=f(x)$라고 할 때, 이 직선의 $y$절편의 값으로 알맞은 것은? [4.4점]",
    "choices": [
      "$-\\dfrac12$",
      "$-1$",
      "$-\\dfrac32$",
      "$-2$",
      "$-\\dfrac52$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 한 점을 지나는 여러 직선 중 원점까지의 거리가 가장 크게 되려면, 원점에서 그 직선에 내린 수선의 발이 바로 그 점이 되어야 한다.\\n\\n먼저 두 직선의 교점을 구한다.\\n$2x-y=0$에서 $y=2x$이다. 이를 $3x+2y+7=0$에 대입하면\\n$3x+4x+7=0$\\n$7x=-7$\\n$x=-1$이다.\\n따라서 $y=2(-1)=-2$이므로 교점은 $P(-1,-2)$이다.\\n\\n교점 $P$를 지나는 직선과 원점 사이의 거리는 항상 $OP$보다 클 수 없다. 가장 클 때는 $OP$가 그 직선과 수직일 때이다.\\n직선 $OP$의 기울기는\\n$\\dfrac{-2-0}{-1-0}=2$이다.\\n따라서 구하는 직선의 기울기는 $-\\dfrac12$이다.\\n\\n점 $P(-1,-2)$를 지나고 기울기가 $-\\dfrac12$인 직선은\\n$y+2=-\\dfrac12(x+1)$이다.\\n정리하면\\n$y=-\\dfrac12x-\\dfrac52$이다.\\n따라서 $y$절편은 $-\\dfrac52$이다.\\n따라서 정답은 ⑤이다.\\n\\n[검수 메모] 해설지 표기 답과 달리, 거리 최대 조건을 직접 계산하면 ⑤가 맞다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "직선의 방정식",
    "originalCategory": "직선의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-02",
    "standardUnit": "직선의 방정식",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "직선의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "점 $(1,a)$와 두 직선 $x+2y=1$, $2x+y=1$ 사이의 거리가 같도록 하는 모든 실수 $a$의 값의 합은? [4.1점]",
    "choices": [
      "$-\\dfrac23$",
      "$-\\dfrac13$",
      "$0$",
      "$\\dfrac13$",
      "$\\dfrac23$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 점과 직선 사이의 거리 공식을 이용해 두 거리를 같게 둔다.\\n\\n점 $(1,a)$에서 직선 $x+2y=1$까지의 거리는\\n$\\dfrac{|1+2a-1|}{\\sqrt{1^2+2^2}}=\\dfrac{|2a|}{\\sqrt5}$이다.\\n점 $(1,a)$에서 직선 $2x+y=1$까지의 거리는\\n$\\dfrac{|2+a-1|}{\\sqrt{2^2+1^2}}=\\dfrac{|a+1|}{\\sqrt5}$이다.\\n두 거리가 같으므로\\n$|2a|=|a+1|$이다.\\n양변을 제곱하면\\n$4a^2=(a+1)^2$\\n$4a^2=a^2+2a+1$\\n$3a^2-2a-1=0$\\n$(3a+1)(a-1)=0$이다.\\n따라서 $a=-\\dfrac13$ 또는 $a=1$이다.\\n모든 값의 합은\\n$-\\dfrac13+1=\\dfrac23$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 13,
    "level": "하",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "원 $x^2+y^2-8x+6y-24=0$의 중심을 $(a,b)$, 반지름을 $r$이라고 할 때, $a+b+r$의 값으로 알맞은 것은? [4.2점]",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "②",
    "solution": "[키포인트] 완전제곱식으로 바꾸어 원의 중심과 반지름을 찾는다.\\n\\n$x^2+y^2-8x+6y-24=0$에서 $x$, $y$끼리 모아 정리하면\\n$x^2-8x+y^2+6y=24$이다.\\n완전제곱식을 만들면\\n$(x-4)^2-16+(y+3)^2-9=24$\\n$(x-4)^2+(y+3)^2=49$이다.\\n따라서 중심은 $(4,-3)$, 반지름은 $7$이다.\\n$a=4$, $b=-3$, $r=7$이므로\\n$a+b+r=4-3+7=8$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "점 $(2,4)$를 지나고 $x$축과 $y$축에 동시에 접하는 두 원의 둘레의 합은? [4.5점]",
    "choices": [
      "$4\\pi$",
      "$8\\pi$",
      "$16\\pi$",
      "$24\\pi$",
      "$32\\pi$"
    ],
    "answer": "④",
    "solution": "[키포인트] 원이 두 좌표축에 동시에 접하면 중심에서 두 축까지의 거리가 모두 반지름과 같다.\\n\\n두 축에 동시에 접하는 원의 중심을 $(a,a)$, 반지름을 $|a|$라고 둘 수 있다.\\n이 원이 점 $(2,4)$를 지나므로\\n$(2-a)^2+(4-a)^2=a^2$이다.\\n전개하면\\n$a^2-4a+4+a^2-8a+16=a^2$\\n$a^2-12a+20=0$\\n$(a-2)(a-10)=0$이다.\\n따라서 $a=2$ 또는 $a=10$이다.\\n반지름은 각각 $2$, $10$이므로 두 원의 둘레의 합은\\n$2\\pi\\cdot2+2\\pi\\cdot10=4\\pi+20\\pi=24\\pi$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "직선 $y=-\\dfrac12x+3$에 수직이고 원 $x^2+y^2=10$에 접하는 두 직선의 $x$절편의 차는? [4.2점]",
    "choices": [
      "$3\\sqrt2$",
      "$4\\sqrt2$",
      "$5\\sqrt2$",
      "$6\\sqrt2$",
      "$7\\sqrt2$"
    ],
    "answer": "③",
    "solution": "[키포인트] 접선은 원의 중심에서 직선까지의 거리가 반지름과 같다.\\n\\n주어진 직선 $y=-\\dfrac12x+3$의 기울기는 $-\\dfrac12$이다.\\n이 직선에 수직인 직선의 기울기는 $2$이므로, 구하는 두 접선을\\n$y=2x+b$라고 두자.\\n이를 정리하면 $2x-y+b=0$이다.\\n\\n원 $x^2+y^2=10$의 중심은 $(0,0)$, 반지름은 $\\sqrt{10}$이다.\\n접선이 되려면 중심 $(0,0)$에서 직선 $2x-y+b=0$까지의 거리가 $\\sqrt{10}$이어야 한다.\\n따라서\\n$\\dfrac{|b|}{\\sqrt{2^2+(-1)^2}}=\\sqrt{10}$\\n$\\dfrac{|b|}{\\sqrt5}=\\sqrt{10}$\\n$|b|=\\sqrt{50}=5\\sqrt2$이다.\\n\\n즉 두 직선은 $y=2x+5\\sqrt2$, $y=2x-5\\sqrt2$이다.\\n$x$절편은 각각 $-\\dfrac{5\\sqrt2}{2}$, $\\dfrac{5\\sqrt2}{2}$이므로 차는\\n$\\dfrac{5\\sqrt2}{2}-\\left(-\\dfrac{5\\sqrt2}{2}\\right)=5\\sqrt2$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "직선 $y=x+k$가 다음 조건을 만족시킬 때, 정수 $k$의 개수는? (단, $k\\ne0$) [5.1점]<div style='display:block; margin:6px 0 0 0; padding:8px 10px; border:1px solid #000; line-height:1.7;'>(가) 원 $x^2+y^2=25$와 서로 다른 두 점에서 만난다.<br>(나) 원 $x^2+(y-5)^2=k^2$과 만나지 않는다.</div>",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "[키포인트] 직선과 원의 위치 관계는 원의 중심에서 직선까지의 거리와 반지름을 비교하여 판단한다.\\n\\n직선 $y=x+k$를 정리하면 $x-y+k=0$이다.\\n\\n(가) 원 $x^2+y^2=25$의 중심은 $(0,0)$, 반지름은 $5$이다.\\n직선과 원이 서로 다른 두 점에서 만나려면 중심에서 직선까지의 거리가 반지름보다 작아야 한다.\\n따라서\\n$\\dfrac{|k|}{\\sqrt2}<5$\\n$|k|<5\\sqrt2$이다.\\n\\n(나) 원 $x^2+(y-5)^2=k^2$의 중심은 $(0,5)$, 반지름은 $|k|$이다.\\n직선과 만나지 않으려면 중심에서 직선까지의 거리가 반지름보다 커야 한다.\\n따라서\\n$\\dfrac{|0-5+k|}{\\sqrt2}>|k|$\\n$|k-5|>\\sqrt2|k|$이다.\\n양변을 제곱하면\\n$(k-5)^2>2k^2$\\n$k^2+10k-25<0$이다.\\n이 부등식의 해는\\n$-5-5\\sqrt2<k<-5+5\\sqrt2$이다.\\n\\n(가), (나)를 함께 만족해야 하므로\\n$|k|<5\\sqrt2$와 $-5-5\\sqrt2<k<-5+5\\sqrt2$를 동시에 만족한다.\\n정수 $k$를 세면\\n$k=-7,-6,-5,-4,-3,-2,-1,1,2$이다.\\n단, $k\\ne0$이므로 총 $9$개이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "점 $P(4,5)$에서 원 $x^2+y^2=9$에 그은 접선이 원과 만나는 점을 $Q$라고 할 때, 선분 $PQ$의 길이를 구한 것으로 알맞은 것은? [4.6점]",
    "choices": [
      "$2\\sqrt6$",
      "$\\sqrt{26}$",
      "$\\sqrt{28}$",
      "$\\sqrt{30}$",
      "$4\\sqrt2$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 원의 중심과 접점을 잇는 반지름은 접선과 수직이다.\\n\\n원 $x^2+y^2=9$의 중심은 $O(0,0)$, 반지름은 $3$이다.\\n점 $P(4,5)$에서 원에 그은 접선의 접점을 $Q$라 하면 $OQ\\perp PQ$이다.\\n따라서 삼각형 $OPQ$는 직각삼각형이다.\\n\\n$OP=\\sqrt{4^2+5^2}=\\sqrt{41}$이고, $OQ=3$이다.\\n피타고라스 정리에 의해\\n$PQ^2=OP^2-OQ^2=41-9=32$이다.\\n따라서\\n$PQ=\\sqrt{32}=4\\sqrt2$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "그림과 같이 원 $x^2+y^2=16$과 직선 $f(x)=mx+n$이 제$2$사분면에 있는 원 위의 점 $P$에서 접할 때, $f(-4)\\times f(4)$의 값을 구한 것은? [4.9점]",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$16$",
      "$20$"
    ],
    "answer": "④",
    "solution": "[키포인트] 원의 중심에서 접선까지의 거리는 반지름과 같다.\\n\\n원 $x^2+y^2=16$의 중심은 $(0,0)$이고 반지름은 $4$이다.\\n직선 $f(x)=mx+n$은 $y=mx+n$이므로 정리하면 $mx-y+n=0$이다.\\n이 직선이 원에 접하므로 중심 $(0,0)$에서 직선까지의 거리는 $4$이다.\\n따라서\\n$\\dfrac{|n|}{\\sqrt{m^2+1}}=4$이고, 양변을 제곱하면\\n$n^2=16(m^2+1)$이다.\\n\\n이제\\n$f(-4)=-4m+n$, $f(4)=4m+n$이므로\\n$f(-4)f(4)=(-4m+n)(4m+n)$이다.\\n이는 합차공식에 의해\\n$n^2-16m^2$이다.\\n위에서 $n^2=16(m^2+1)$이므로\\n$n^2-16m^2=16(m^2+1)-16m^2=16$이다.\\n따라서 정답은 ④이다.",
    "image": "assets/images/22_제일고_1학기_기말_고1_기출/q18.png"
  },
  {
    "id": 19,
    "level": "중",
    "category": "절댓값 부등식",
    "originalCategory": "절댓값 부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "절댓값 부등식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "부등식 $|x+1|+|x-1|\\le3$을 푸시오. [4점]",
    "choices": [],
    "answer": "$-\\dfrac32\\le x\\le\\dfrac32$",
    "solution": "[키포인트] 절댓값 기호 안이 $0$이 되는 $x=-1$, $x=1$을 기준으로 범위를 나눈다.\\n\\n1) $x<-1$일 때\\n$|x+1|=-(x+1)$, $|x-1|=-(x-1)$이므로\\n$-(x+1)-(x-1)\\le3$\\n$-2x\\le3$\\n$x\\ge-\\dfrac32$이다.\\n이 범위에서는 $x<-1$도 만족해야 하므로\\n$-\\dfrac32\\le x<-1$이다.\\n\\n2) $-1\\le x<1$일 때\\n$|x+1|=x+1$, $|x-1|=-(x-1)$이므로\\n$(x+1)-(x-1)\\le3$\\n$2\\le3$이다.\\n따라서 이 구간의 모든 $x$가 가능하므로\\n$-1\\le x<1$이다.\\n\\n3) $x\\ge1$일 때\\n$|x+1|=x+1$, $|x-1|=x-1$이므로\\n$(x+1)+(x-1)\\le3$\\n$2x\\le3$\\n$x\\le\\dfrac32$이다.\\n이 범위에서는 $x\\ge1$도 만족해야 하므로\\n$1\\le x\\le\\dfrac32$이다.\\n\\n세 범위를 합하면\\n$-\\dfrac32\\le x\\le\\dfrac32$이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "다음 문장이 왜 옳지 않은지 서술하시오.<br>ㄱ. 도형 $x^2+y^2+Ax+By+C=0$은 원이다. [3점]<br>ㄴ. $a\\ne b$일 때, 원 $(x-a)^2+(y-b)^2=a^2$은 $x$축에는 접하지 않고 $y$축에만 접한다. [3점]",
    "choices": [],
    "answer": "ㄱ, ㄴ 모두 옳지 않다.",
    "solution": "[키포인트] 원의 방정식이 되기 위한 조건과 접선 조건을 각각 확인한다.\\n\\nㄱ. 식 $x^2+y^2+Ax+By+C=0$이 항상 원이 되는 것은 아니다.\\n완전제곱식으로 바꾸면\\n$\\left(x+\\dfrac A2\\right)^2+\\left(y+\\dfrac B2\\right)^2=\\dfrac{A^2+B^2}{4}-C$이다.\\n오른쪽 값이 양수일 때만 원이 된다.\\n오른쪽 값이 $0$이면 한 점이고, 음수이면 나타나는 도형이 없다.\\n따라서 ㄱ은 옳지 않다.\\n\\nㄴ. 원 $(x-a)^2+(y-b)^2=a^2$의 중심은 $(a,b)$이고 반지름은 $|a|$이다.\\n$x$축에 접하려면 중심에서 $x$축까지의 거리 $|b|$가 반지름 $|a|$와 같아야 한다.\\n$y$축에 접하려면 중심에서 $y$축까지의 거리 $|a|$가 반지름 $|a|$와 같아야 하므로 $y$축에는 항상 접한다.\\n하지만 $a\\ne b$라고 해서 $|a|\\ne |b|$가 되는 것은 아니다. 예를 들어 $a=1$, $b=-1$이면 $a\\ne b$이지만 $|a|=|b|$이므로 $x$축에도 접한다.\\n따라서 ㄴ도 옳지 않다."
  },
  {
    "id": 21,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "$A(-2,0)$와 원 $x^2+y^2-2x=0$ 위의 점 $P$에 대하여 선분 $AP$를 $3:2$로 외분하는 점 $Q$가 나타내는 도형의 방정식이 $(x-a)^2+(y-b)^2=r^2$이라고 할 때, $a+b+r$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "$10$",
    "solution": "[키포인트] 점 $P$가 원 위를 움직일 때, 외분점 $Q$와 $P$의 좌표 관계를 세워 $Q$의 자취를 구한다.\\n\\n점 $P$의 좌표를 $(u,v)$, 점 $Q$의 좌표를 $(x,y)$라고 하자.\\n점 $Q$는 선분 $AP$를 $3:2$로 외분하는 점이고 $A(-2,0)$이다.\\n외분점 좌표를 이용하면\\n$x=\\dfrac{3u-2(-2)}{3-2}=3u+4$,\\n$y=\\dfrac{3v-2\\cdot0}{3-2}=3v$이다.\\n따라서\\n$u=\\dfrac{x-4}{3}$, $v=\\dfrac y3$이다.\\n\\n점 $P(u,v)$는 원 $x^2+y^2-2x=0$ 위의 점이므로\\n$u^2+v^2-2u=0$을 만족한다.\\n여기에 $u=\\dfrac{x-4}{3}$, $v=\\dfrac y3$을 대입하면\\n$\\left(\\dfrac{x-4}{3}\\right)^2+\\left(\\dfrac y3\\right)^2-2\\left(\\dfrac{x-4}{3}\\right)=0$이다.\\n양변에 $9$를 곱하면\\n$(x-4)^2+y^2-6(x-4)=0$이다.\\n전개하여 정리하면\\n$x^2-8x+16+y^2-6x+24=0$\\n$x^2+y^2-14x+40=0$이다.\\n완전제곱식으로 바꾸면\\n$(x-7)^2+y^2=9$이다.\\n따라서 $a=7$, $b=0$, $r=3$이다.\\n그러므로 $a+b+r=7+0+3=10$이다."
  },
  {
    "id": 22,
    "level": "상",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "원의 방정식",
      "고1",
      "기말"
    ],
    "wide": false,
    "content": "세 직선 $y=4$, $x=-4$, $3x-4y+4=0$에 둘러싸인 삼각형에 대한 내접원의 방정식을 $x^2+y^2+Ax+By+C=0$이라고 할 때, $A+B+C$ 값을 구하시오. [5점]",
    "choices": [],
    "answer": "$4$",
    "solution": "[키포인트] 세 직선이 만드는 삼각형은 직각삼각형이므로, 내접원의 반지름을 먼저 구하고 중심을 잡는다.\\n\\n세 직선의 교점을 구한다.\\n$y=4$와 $x=-4$의 교점은 $(-4,4)$이다.\\n$y=4$와 $3x-4y+4=0$의 교점은\\n$3x-16+4=0$\\n$3x=12$\\n$x=4$이므로 $(4,4)$이다.\\n$x=-4$와 $3x-4y+4=0$의 교점은\\n$-12-4y+4=0$\\n$-4y=8$\\n$y=-2$이므로 $(-4,-2)$이다.\\n\\n따라서 삼각형은 $(-4,4)$에서 직각인 직각삼각형이고, 두 직각변의 길이는 각각 $8$, $6$이다. 빗변의 길이는\\n$\\sqrt{8^2+6^2}=10$이다.\\n직각삼각형의 내접원의 반지름은\\n$\\dfrac{8+6-10}{2}=2$이다.\\n\\n내접원은 직선 $x=-4$와 직선 $y=4$에 모두 접하므로, 중심은 두 직선에서 각각 거리 $2$만큼 안쪽에 있는 점이다.\\n따라서 중심은 $(-4+2,4-2)=(-2,2)$이고 반지름은 $2$이다.\\n내접원의 방정식은\\n$(x+2)^2+(y-2)^2=4$이다.\\n전개하면\\n$x^2+4x+4+y^2-4y+4=4$\\n$x^2+y^2+4x-4y+4=0$이다.\\n따라서 $A=4$, $B=-4$, $C=4$이므로\\n$A+B+C=4$이다."
  }
];
