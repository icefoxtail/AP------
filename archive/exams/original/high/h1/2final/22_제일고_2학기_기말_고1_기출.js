window.examTitle="22_제일고_2학기_기말_고1_기출";
const U={"집합":["H15-SB-01",1,"수학(하)"],"명제":["H15-SB-02",2,"수학(하)"],"함수":["H15-SB-03",3,"수학(하)"],"유리함수":["H15-SB-04",4,"수학(하)"],"무리함수":["H15-SB-05",5,"수학(하)"],"경우의 수":["H15-SB-06",6,"수학(하)"],"순열":["H15-SB-07",7,"수학(하)"],"조합":["H15-SB-08",8,"수학(하)"],"인수분해":["H15-SA-03",3,"수학(상)"],"복소수":["H15-SA-04",4,"수학(상)"]};function q(id,u,t,c,ch=[],e={}){const[k,o,course]=U[u];return{id,level:"중",category:u,originalCategory:u,standardCourse:course,standardUnitKey:k,standardUnit:u,standardUnitOrder:o,questionType:t,layoutTag:"grid",tags:[t,u],wide:false,content:c,choices:ch,...e,answer:"",solution:""}}
window.questionBank=[
  {
    "id": 1,
    "level": "하",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "도형"
    ],
    "wide": false,
    "content": "그림은 두 함수 $f:X\\to Y$, $g:Y\\to X$를 나타낸 것이다. $(f\\circ g)(4)+(f\\circ g)^{-1}(7)$의 값은? [3.7점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q1.png",
    "answer": "②",
    "solution": "[키포인트] 합성함수의 대응을 먼저 만든 뒤 그 합성함수의 역함수를 읽는다.\n조건 정리: 그림에서 $f(3)=1$, $f(6)=7$, $f(9)=4$이고 $g(1)=6$, $g(4)=3$, $g(7)=9$이다.\n풀이 방향: $f\\circ g$의 대응을 직접 계산한다.\n정석 풀이: $(f\\circ g)(4)=f(g(4))=f(3)=1$이다. 또 $(f\\circ g)(1)=f(g(1))=f(6)=7$이므로 $(f\\circ g)^{-1}(7)=1$이다. 따라서 구하는 값은 $1+1=2$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 2,
    "level": "하",
    "category": "유리함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{3x-1}{x-2}$의 그래프에 대한 다음 설명 중 옳은 것은? [3.7점]",
    "choices": [
      "$y=-\\dfrac7x$의 그래프를 평행이동한 것이다.",
      "정의역은 $\\{x\\mid x\\ne-2\\}$인 실수이다.",
      "$(-2,3)$에 대하여 대칭이다.",
      "$x$축과 점 $(\\dfrac13,0)$에서 만난다.",
      "제4사분면을 지나지 않는다."
    ],
    "answer": "④",
    "solution": "[키포인트] 유리함수를 $y=q+\\dfrac{r}{x-p}$ 꼴로 바꾸면 점근선과 대칭의 중심을 바로 확인할 수 있다.\n조건 정리: $\\dfrac{3x-1}{x-2}=3+\\dfrac5{x-2}$이다.\n풀이 방향: 각 보기의 정의역, 중심, 절편, 사분면 통과 여부를 차례로 확인한다.\n정석 풀이: 점근선은 $x=2$, $y=3$이므로 정의역은 $x\\ne2$이고 대칭의 중심은 $(2,3)$이다. $x$절편은 $3x-1=0$에서 $x=\\dfrac13$이므로 그래프는 $(\\dfrac13,0)$에서 $x$축과 만난다. 또한 $x=1$이면 $y=-2$이므로 제4사분면도 지난다. 따라서 옳은 것은 ④뿐이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
    "level": "중",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "그래프"
    ],
    "wide": false,
    "content": "다음 그림은 직선 $y=x$와 $x\\ge0$에서 정의된 두 함수 $y=f(x)$, $y=g(x)$의 그래프를 나타낸 것이다. 두 함수 $f,g$의 역함수가 존재할 때, $f(g^{-1}(e))$의 값으로 알맞은 것은? (단, 모든 점선은 $x$축 또는 $y$축에 평행하다.) [3.9점]",
    "choices": [
      "$a$",
      "$b$",
      "$c$",
      "$d$",
      "$e$"
    ],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q3.png",
    "imageSize": "large",
    "answer": "③",
    "solution": "[키포인트] $g^{-1}$은 출력값에서 입력값으로 거슬러 올라가고, 그 입력값을 다시 $f$에 넣는다.\n조건 정리: 그림의 점선에서 $g(d)=e$이고 $f(d)=c$임을 읽을 수 있다.\n풀이 방향: 먼저 $g^{-1}(e)$를 찾은 뒤 그 값을 $f$에 대입한다.\n정석 풀이: $g(d)=e$이므로 $g^{-1}(e)=d$이다. 이어서 그림에서 $x=d$일 때 $f(d)=c$이다. 따라서 $f(g^{-1}(e))=f(d)=c$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-03-INVERSE_FUNCTION",
    "subUnit": "역함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 4,
    "level": "하",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조합"
    ],
    "wide": false,
    "content": "1부터 10까지의 자연수 중에서 서로 다른 3가지 수를 선택할 때, 선택한 3가지 수의 곱이 짝수가 되는 경우의 수를 구하면? [3.9점]",
    "choices": [
      "$70$",
      "$80$",
      "$90$",
      "$100$",
      "$110$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 곱이 짝수가 아닌 경우는 선택한 세 수가 모두 홀수일 때뿐이다.\n조건 정리: $1$부터 $10$까지에서 서로 다른 $3$개를 고르는 전체 경우를 센다.\n풀이 방향: 전체 조합에서 홀수 $5$개 중 $3$개만 고르는 경우를 뺀다.\n정석 풀이: 전체 선택은 ${}_{10}C_3=120$가지이다. 곱이 홀수가 되려면 $1,3,5,7,9$ 중에서 $3$개를 골라야 하므로 ${}_5C_3=10$가지이다. 따라서 곱이 짝수인 경우는 $120-10=110$가지이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조합"
    ],
    "wide": false,
    "content": "다음은 정수 $r$에 대하여 조합식의 성립을 증명하는 과정이다. 옳지 않은 것은? [3.8점]<br>${}_{10}C_r={}_9C_r+{}_9C_{r-1}$임을 보이자.<br>(단, $0\\lt r\\le10$인 자연수) … ㉠<br>${}_{10}C_r=\\dfrac{{}_{10}P_r}{r!}=\\dfrac{10!}{(10-r)!r!}$ … ㉡<br>${}_9C_r+{}_9C_{r-1}$<br>$=\\dfrac{9!}{(9-r)!r!}+\\dfrac{9!}{(10-r)!(r-1)!}$ … ㉢<br>$=\\dfrac{(10-r)\\times9!+r\\times9!}{(10-r)!r!}$ … ㉣<br>$=\\dfrac{10!}{(10-r)!r!}$ … ㉤<br>이므로 ${}_{10}C_r={}_9C_r+{}_9C_{r-1}$ 성립한다.",
    "choices": [
      "㉠",
      "㉡",
      "㉢",
      "㉣",
      "㉤"
    ],
    "answer": "①",
    "solution": "[키포인트] 조합 항등식의 계산뿐 아니라 식이 정의되는 범위까지 확인한다.\n조건 정리: ㉠에서는 $0\\lt r\\le10$인 자연수 전체를 허용하고 있다.\n풀이 방향: 표시된 각 단계가 그 범위의 모든 $r$에서 정의되는지 확인한다.\n정석 풀이: $r=10$이면 ㉠의 오른쪽에 ${}_9C_{10}$이 나타나는데, 고등학교 조합의 정의에서는 $n\\ge r$일 때 ${}_nC_r$를 사용하므로 ${}_9C_{10}$은 정의되지 않는다. 따라서 제시된 증명 과정이 성립하려면 이 단계에서 $r$의 범위를 그대로 $0\\lt r\\le10$으로 둘 수 없다. 나머지 ㉡~㉤의 계산 전개는 정의되는 범위에서는 옳다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "경우의 수",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림과 같이 $A,B,C,D,E$ 5개의 영역에 서로 다른 다섯가지 색을 칠하려고 한다. 같은 색을 중복하여 사용해도 좋으나 인접한 영역은 서로 다른 색으로 칠하려고 할 때, 칠하는 방법의 수는? [3.9점]",
    "choices": [
      "$240$",
      "$300$",
      "$360$",
      "$420$",
      "$480$"
    ],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q6.png",
    "answer": "④",
    "solution": "[키포인트] $A$와 $E$의 색이 같은지 다른지에 따라 가운데 $B,C,D$에 사용할 수 있는 색의 수가 달라진다.\n조건 정리: $A,E$는 서로 인접하지 않고, $B-C-D$는 차례로 인접하며 $B,C,D$는 모두 $A,E$와 인접한다.\n풀이 방향: $A,E$가 같은 색인 경우와 다른 색인 경우로 나누어 센다.\n정석 풀이: $A,E$가 같은 색이면 그 색은 $5$가지이고, $B,C,D$는 그 색을 제외한 $4$색으로 길이 $3$인 경로를 칠하므로 $4\\times3\\times3=36$가지이다. 따라서 $5\\times36=180$가지이다. $A,E$가 다른 색이면 두 색을 정하는 방법이 $5\\times4=20$가지이고, $B,C,D$는 두 색을 제외한 $3$색으로 칠하므로 $3\\times2\\times2=12$가지이다. 따라서 $20\\times12=240$가지이다. 전체는 $180+240=420$가지이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "상",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=\\begin{cases}\\dfrac{x-7}{x-3}&(x\\gt4)\\\\-\\sqrt{4-x}+a&(x\\le4)\\end{cases}$가 다음 조건을 모두 만족시킨다.<br>(가) 치역은 $\\{y\\mid y\\lt1\\}$이다.<br>(나) 임의의 두 실수 $x_1,x_2$에 대하여 $f(x_1)=f(x_2)$이면 $x_1=x_2$이다.<br>$f(3)f(k)=4$일 때 상수 $k$의 값으로 알맞은 것은? [4.9점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 조각의 치역이 정확히 이어지면서 서로 겹치지 않아야 전체 함수가 일대일이고 치역도 $y\\lt1$이 된다.\n조건 정리: $x\\gt4$에서 $\\dfrac{x-7}{x-3}=1-\\dfrac4{x-3}$의 치역은 $(-3,1)$이다. $x\\le4$에서 $-\\sqrt{4-x}+a$의 치역은 $(-\\infty,a]$이다.\n풀이 방향: 두 치역의 합집합이 $(-\\infty,1)$이면서 서로 겹치지 않는 조건으로 $a$를 정한다.\n정석 풀이: 두 치역이 빈틈없이 이어지고 겹치지 않으려면 $a=-3$이어야 한다. 따라서 $f(3)=-\\sqrt1-3=-4$이다. $f(3)f(k)=4$이므로 $f(k)=-1$이다. $x\\le4$인 조각은 항상 $-3$ 이하이므로 $f(k)=-1$은 $x\\gt4$인 조각에서 생긴다. $\\dfrac{k-7}{k-3}=-1$에서 $k-7=-k+3$, 따라서 $2k=10$이고 $k=5$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 8,
    "level": "중",
    "category": "유리함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수"
    ],
    "wide": false,
    "content": "정의역이 $\\{x\\mid0\\le x\\le3\\}$인 유리함수 $y=\\dfrac{3x+k}{x+1}$의 최솟값이 4일 때, 상수 $k$의 값으로 알맞은 것은? [4.4점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "[키포인트] $k-3$의 부호에 따라 유리함수의 증가·감소가 달라진다.\n조건 정리: $y=\\dfrac{3x+k}{x+1}=3+\\dfrac{k-3}{x+1}$이고 $0\\le x\\le3$이다.\n풀이 방향: 증가하는 경우와 감소하는 경우를 확인하여 최솟값이 $4$가 되는 $k$를 찾는다.\n정석 풀이: $k\\lt3$이면 함수는 증가하므로 최솟값은 $x=0$에서 $k$인데 $4$가 될 수 없다. $k=3$이면 함수값이 항상 $3$이다. 따라서 $k\\gt3$이고 이때 함수는 감소하므로 최솟값은 $x=3$에서 갖는다. $\\dfrac{9+k}{4}=4$이므로 $k=7$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "복수정답"
    ],
    "wide": false,
    "content": "함수 $y=\\sqrt{-x+2}$의 그래프와 직선 $y=-x+k$가 서로 다른 두 점에서 만날 때, 실수 $k$의 값으로 알맞은 것을 모두 고른 것은? [4.4점]",
    "choices": [
      "$\\dfrac{15}8$",
      "$2$",
      "$\\dfrac{17}8$",
      "$\\dfrac94$",
      "$\\dfrac{19}8$"
    ],
    "answer": "②, ③",
    "solution": "[키포인트] 교점의 $y$좌표를 미지수로 두면 두 교점 조건이 이차방정식의 서로 다른 두 음이 아닌 근 조건으로 바뀐다.\n조건 정리: 곡선 위에서 $y=\\sqrt{2-x}\\ge0$이므로 $x=2-y^2$이다.\n풀이 방향: 직선식에 대입하여 $y$에 대한 이차방정식의 근 조건을 조사한다.\n정석 풀이: $y=-x+k$에 $x=2-y^2$을 대입하면 $y^2-y+k-2=0$이다. 서로 다른 두 실근을 가지려면 판별식 $1-4(k-2)=9-4k\\gt0$이므로 $k\\lt\\dfrac94$이다. 두 근의 합은 $1$이고 곱은 $k-2$이므로 두 근이 모두 음이 아니려면 $k\\ge2$이다. 따라서 $2\\le k\\lt\\dfrac94$이고, 보기에서 해당하는 값은 $2$, $\\dfrac{17}{8}$이다.\n따라서 정답은 ②, ③이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "상",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=-\\sqrt{x+1}$와 $g(x)$, $h(x)$에 대하여 다음 중 옳은 것을 모두 고른 것은? [4.6점]<br>ㄱ. $f(x)$와 그 역함수 $f^{-1}(x)$의 교점은 $y=x$ 위에만 존재한다.<br>ㄴ. $f\\circ f^{-1}=f^{-1}\\circ f$<br>ㄷ. $x\\ge-1$에서 $h(x)$의 역함수가 존재할 때, $(h\\circ g\\circ f)(x)=h(x)$를 만족시키면 $g(-3)=8$이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "[키포인트] 함수와 역함수의 정의역·치역을 구분하고, 합성식에서는 일대일함수 $h$를 소거한다.\n조건 정리: $f(x)=-\\sqrt{x+1}$의 정의역은 $x\\ge-1$, 치역은 $y\\le0$이고 $f^{-1}(x)=x^2-1$의 정의역은 $x\\le0$이다.\n풀이 방향: ㄱ, ㄴ, ㄷ을 각각 직접 확인한다.\n정석 풀이: ㄱ에서 $(0,-1)$은 $f(0)=-1$이므로 $y=f(x)$ 위에 있고, $f^{-1}(0)=-1$이므로 $y=f^{-1}(x)$ 위에도 있다. 그러나 $-1\\ne0$이므로 이 교점은 $y=x$ 위에 있지 않아 ㄱ은 거짓이다. ㄴ에서 $f\\circ f^{-1}$의 정의역은 $x\\le0$, $f^{-1}\\circ f$의 정의역은 $x\\ge-1$이므로 두 함수는 같지 않아 거짓이다. ㄷ에서 $h$의 역함수가 존재하므로 $h$는 일대일이다. $(h\\circ g\\circ f)(x)=h(x)$에서 $g(f(x))=x$이므로 $g=f^{-1}$이고, $g(-3)=f^{-1}(-3)=(-3)^2-1=8$이다. 따라서 ㄷ만 옳다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 11,
    "level": "중",
    "category": "복소수",
    "originalCategory": "복소수",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복소수",
      "경우의 수"
    ],
    "wide": false,
    "content": "6 이하의 두 자연수 $m,n$에 대하여 복소수 $z$를 $z=(m-n-1)+(m+n-7)i$라 하자. $z^2$이 실수가 되도록 하는 $m,n$의 모든 순서쌍 $(m,n)$의 개수는? [4.5점]",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "②",
    "solution": "[키포인트] 복소수의 제곱이 실수이려면 실수부와 허수부의 곱이 $0$이어야 한다.\n조건 정리: $z=A+Bi$로 두면 $A=m-n-1$, $B=m+n-7$이고 $z^2=(A^2-B^2)+2ABi$이다.\n풀이 방향: $A=0$인 경우와 $B=0$인 경우를 각각 세고 중복을 뺀다.\n정석 풀이: $A=0$이면 $m=n+1$이므로 $1\\le m,n\\le6$에서 $(m,n)=(2,1),(3,2),(4,3),(5,4),(6,5)$의 $5$쌍이다. $B=0$이면 $m+n=7$이므로 $6$쌍이다. 두 조건을 동시에 만족하는 순서쌍은 $(4,3)$ 한 쌍이므로 전체는 $5+6-1=10$쌍이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SA-04-COMPLEX_BASIC",
    "subUnit": "복소수의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "경우의 수",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림과 같이 지점 $A,B,C,D$ 4개를 연결하는 도로가 있다. 지점 $A$에서 지점 $C$로 가는 모든 경우의 수를 구하면? (단, $C$지점에 도달하면 끝이 나고, 한번 지나간 지점은 다시 지날 수 없다.) [4.5점]",
    "choices": [
      "$21$",
      "$22$",
      "$23$",
      "$24$",
      "$25$"
    ],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q12.png",
    "answer": "⑤",
    "solution": "[키포인트] 한 번 지난 지점을 다시 지날 수 없으므로 $A$에서 $C$까지 가능한 지점 방문 순서를 먼저 전부 나눈다.\n조건 정리: 그림에서 $AB,AC,AD,BC,BD,CD$ 사이의 도로 수는 각각 $3,2,2,1,2,2$이다.\n풀이 방향: 가능한 단순 경로 $AC$, $ABC$, $ADC$, $ABDC$, $ADBC$의 도로 선택 수를 각각 곱한다.\n정석 풀이: $AC$는 $2$가지, $ABC$는 $3\\times1=3$가지, $ADC$는 $2\\times2=4$가지이다. $ABDC$는 $3\\times2\\times2=12$가지이고, $ADBC$는 $2\\times2\\times1=4$가지이다. 따라서 전체는 $2+3+4+12+4=25$가지이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "중",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열"
    ],
    "wide": false,
    "content": "5개의 문자 $h,o,s,t,u$를 모두 한 번씩 사용하여 사전식으로 배열할 때, $shout$와 $south$ 사이에 배열된 단어의 개수를 구하면? [4.5점]",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "①",
    "solution": "[키포인트] 사전식 순서는 앞자리에서 더 작은 문자가 오는 순열의 개수를 팩토리얼 단위로 누적한다.\n조건 정리: 알파벳 순서는 $h\\lt o\\lt s\\lt t\\lt u$이다.\n풀이 방향: $shout$와 $south$의 사전식 순번을 각각 구해 사이의 개수를 계산한다.\n정석 풀이: $shout$보다 앞에서 첫 글자가 $h,o$인 단어는 $2\\times4!=48$개이고, $s$로 시작한 뒤 $hout$보다 앞서는 배열은 $1$개이므로 $shout$는 $50$번째이다. $south$는 첫 글자에서 $48$개, 둘째 글자 $o$보다 작은 $h$로 시작하는 경우 $3!=6$개, 셋째 글자 $u$보다 작은 $h,t$가 오는 경우 $2\\times2!=4$개, 넷째 글자 $t$보다 작은 $h$가 오는 경우 $1$개가 앞서므로 $60$번째이다. 따라서 두 단어 사이의 단어 수는 $60-50-1=9$개이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "하",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "경우의 수"
    ],
    "wide": false,
    "content": "5개의 숫자 $1,3,5,7,9$에서 서로 다른 2개를 사용하여 두 자리 자연수를 만들 때, 두 자리 자연수의 총합을 구하면? [4.5점]",
    "choices": [
      "$1000$",
      "$1050$",
      "$1100$",
      "$1150$",
      "$1200$"
    ],
    "answer": "③",
    "solution": "[키포인트] 각 숫자가 십의 자리와 일의 자리에 나타나는 횟수를 이용하면 모든 수를 직접 만들 필요가 없다.\n조건 정리: $1,3,5,7,9$ 중 서로 다른 두 숫자로 두 자리 수를 만든다.\n풀이 방향: 각 숫자의 자리별 출현 횟수를 세어 자릿값을 곱한다.\n정석 풀이: 한 숫자를 십의 자리에 고정하면 일의 자리에는 나머지 $4$개가 올 수 있으므로 각 숫자는 십의 자리에 $4$번씩 나타난다. 일의 자리도 마찬가지로 $4$번씩 나타난다. 따라서 총합은 $4\\times(10+1)\\times(1+3+5+7+9)=44\\times25=1100$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "유리함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수"
    ],
    "wide": false,
    "content": "좌표평면에서 곡선 $y=\\dfrac{k}{x-2}+1$ $(k\\lt0)$이 $x$축, $y$축과 만나는 점을 각각 $A,B$라 하고, 이 곡선의 두 점근선의 교점을 $C$라 하자. 세 점 $A,B,C$가 한 직선 위에 있도록 하는 상수 $k$의 값은? [5.2점]",
    "choices": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$-4$",
      "$-5$"
    ],
    "answer": "②",
    "solution": "[키포인트] 절편 두 점과 점근선의 교점을 좌표로 나타내어 세 점의 기울기를 비교한다.\n조건 정리: $y=\\dfrac{k}{x-2}+1$의 점근선은 $x=2$, $y=1$이므로 $C=(2,1)$이다.\n풀이 방향: $A,B$의 좌표를 구한 뒤 $AC$와 $AB$의 기울기가 같다는 조건을 사용한다.\n정석 풀이: $y=0$에서 $\\dfrac{k}{x-2}=-1$이므로 $A=(2-k,0)$이다. $x=0$에서 $B=(0,1-\\dfrac{k}{2})$이다. $AC$의 기울기는 $\\dfrac{1}{k}$이고, $AB$의 기울기는 $\\dfrac{1-k/2}{k-2}=-\\dfrac12$이다. 세 점이 한 직선 위에 있으므로 $\\dfrac1k=-\\dfrac12$, 따라서 $k=-2$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수"
    ],
    "wide": false,
    "content": "두 실수 $a,b$와 두 함수 $f(x)=-x^2-2x+1$, $g(x)=x^2-2x-1$에 대하여 함수 $h(x)$를 $h(x)=\\begin{cases}f(x)&(x\\lt a)\\\\g(x+b)&(x\\ge a)\\end{cases}$라 하자. 함수 $h(x)$가 역함수가 존재하도록 하는 $a,b$의 모든 순서쌍 $(a,b)$만을 원소로 하는 집합을 $A$라고 할 때, 다음 보기에서 옳은 것만을 있는 대로 고른 것은? [5.2점]<br>ㄱ. $n\\gt1$일 때, $(n,k)\\in A$를 만족시키는 실수 $k$는 존재하지 않는다.<br>ㄴ. $(-3,-4)\\in A$<br>ㄷ. 집합 $\\{m+l\\mid(m,l)\\in A$이고 $m,l$은 정수$\\}$의 모든 원소의 합은 4이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "[키포인트] 역함수가 존재하려면 두 조각이 각각 일대일이고, 두 조각의 치역이 겹치지 않으면서 실수 전체를 정확히 덮어야 한다.\n조건 정리: $f(x)=-(x+1)^2+2$, $g(x+b)=(x+b-1)^2-2$이다.\n풀이 방향: 각 조각의 단조 조건과 치역의 경계가 맞닿는 조건을 구한 뒤 보기를 판정한다.\n정석 풀이: $x\\lt a$에서 $f$가 일대일이려면 꼭짓점 $x=-1$의 왼쪽만 사용해야 하므로 $a\\le-1$이다. 이 조각의 치역은 $(-\\infty,\\,2-(a+1)^2)$이다. $x\\ge a$에서 $g(x+b)$가 일대일이려면 꼭짓점 $x=1-b$의 오른쪽만 사용해야 하므로 $a+b\\ge1$이고, 치역은 $[(a+b-1)^2-2,\\infty)$이다. $h$가 실수 전체에서 일대일대응이 되려면 두 치역의 경계가 같아야 하므로 $(a+1)^2+(a+b-1)^2=4$이다. ㄱ은 $a=n\\gt1$이면 $a\\le-1$에 어긋나므로 참이다. ㄴ의 $(-3,-4)$는 $a+b=-7\\lt1$이므로 거짓이다. ㄷ에서 $a,b$가 정수라면 $p=-a-1$, $q=a+b-1$은 음이 아닌 정수이고 $p^2+q^2=4$이므로 $(p,q)=(0,2),(2,0)$뿐이다. 이에 대응하는 $(a,b)$는 $(-1,4),(-3,4)$이고 $a+b$의 값은 $3,1$이므로 그 합은 $4$이다. 따라서 ㄱ, ㄷ이 옳다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-03-INVERSE_FUNCTION",
    "subUnit": "역함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 17,
    "level": "중",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수"
    ],
    "wide": false,
    "content": "함수 $f:X\\to Y$에 대하여 $X=\\{a,b,c,d,e,f\\}$, $Y=\\{1,2,3\\}$일 때, 공역과 치역이 일치하는 함수의 개수를 구하면? [5.2점]",
    "choices": [
      "$300$",
      "$360$",
      "$420$",
      "$480$",
      "$540$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 공역과 치역이 일치한다는 것은 $Y$의 세 원소가 모두 한 번 이상 함수값으로 나타나는 전사함수라는 뜻이다.\n조건 정리: 정의역 원소는 $6$개, 공역 원소는 $3$개이다.\n풀이 방향: 전체 함수에서 공역 원소가 하나 이상 빠지는 경우를 포함배제로 뺀다.\n정석 풀이: 전체 함수는 $3^6=729$개이다. 특정 한 값이 치역에서 빠지는 함수는 $2^6$개이고 빠지는 값을 고르는 방법이 $3$가지이므로 $3\\times2^6=192$개를 뺀다. 두 값이 동시에 빠져 한 값만 사용하는 함수는 $1^6$개이고 그런 한 값을 고르는 방법이 $3$가지이므로 $3$을 다시 더한다. 따라서 $729-192+3=540$개이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 18,
    "level": "상",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "경우의 수",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림에서 꼭지점 $A$를 출발하여 꼭지점 $B$까지 모서리를 따라 최단거리로 이동하는 방법의 수를 구하면? [5.2점]",
    "choices": [
      "$84$",
      "$86$",
      "$88$",
      "$90$",
      "$92$"
    ],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q18.png",
    "answer": "①",
    "solution": "[키포인트] 완전한 $2\\times2\\times2$ 격자에서의 최단 경로 수를 먼저 구한 뒤, 계단 모양 때문에 실제로 존재하지 않는 경로만 제외한다.\n조건 정리: $A$에서 $B$까지 최단거리로 가려면 서로 수직인 세 방향으로 각각 $2$번씩, 모두 $6$번 이동한다.\n풀이 방향: 완전한 격자의 최단 경로를 세고, 그림에서 위쪽으로 두 번 연속 먼저 올라가야만 지날 수 있는 빠진 부분의 경로를 뺀다.\n정석 풀이: 완전한 $2\\times2\\times2$ 격자라면 세 방향의 이동 $2$번씩을 배열하므로 최단 경로는 $\\dfrac{6!}{2!2!2!}=90$가지이다. 그러나 실제 그림은 계단 모양이므로 $A$에서 위쪽으로 두 번 연속 이동한 뒤 나머지 두 수평 방향으로 각각 $2$번 이동하는 경로는 존재하지 않는다. 이때 남은 네 번의 이동을 두 방향에 $2$번씩 배치하는 방법은 $\\dfrac{4!}{2!2!}=6$가지이다. 따라서 실제 최단 경로의 수는 $90-6=84$가지이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "중",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수"
    ],
    "wide": false,
    "content": "서술형 1<br>집합 $X=\\{1,2,3,4\\}$, $Y=\\{1,2,3,4,5,6,7\\}$에 대하여 함수 $f:X\\to Y$가 다음 조건을 만족할 때 각 물음에 답하여라.<br>(1) 집합 $X$의 임의의 두 원소 $x_1,x_2$에 대하여 $x_1\\lt x_2$이면 $f(x_1)\\lt f(x_2)$를 만족시키는 함수 $f$의 개수를 구하시오. [2점]<br>(2) 집합 $X$의 임의의 두 원소 $x_1,x_2$에 대하여 $x_1\\ne x_2$이면 $f(x_1)\\ne f(x_2)$를 만족시키는 함수 $f$의 개수를 구하시오. [2점]",
    "choices": [],
    "answer": "(1) $35$　(2) $840$",
    "solution": "[키포인트] (1)은 증가 순서가 자동으로 정해지고, (2)는 서로 다른 함수값을 순서 있게 배정한다.\n조건 정리: $X$에는 $4$개, $Y$에는 $7$개의 원소가 있다.\n풀이 방향: 두 조건을 각각 조합과 순열로 해석한다.\n정석 풀이: (1) $f(1)\\lt f(2)\\lt f(3)\\lt f(4)$이므로 $Y$에서 서로 다른 $4$개의 값을 고르면 작은 값부터 차례로 $f(1),f(2),f(3),f(4)$에 배정되는 순서는 하나뿐이다. 따라서 ${}_7C_4=35$개이다. (2) 서로 다른 네 함수값을 $f(1),f(2),f(3),f(4)$에 순서 있게 배정하므로 ${}_7P_4=7\\times6\\times5\\times4=840$개이다.\n따라서 구하는 값은 (1) $35$, (2) $840$이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 20,
    "level": "상",
    "category": "함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수"
    ],
    "wide": false,
    "content": "서술형 2<br>집합 $X=\\{1,2,3,4\\}$와 함수 $f:X\\to X$에 대하여 함수 $f$의 치역을 $A$, 합성함수 $f\\circ f$의 치역을 $B$라고 할 때, 다음 조건을 만족시키는 함수 $f$의 개수를 구하시오. [6점]<br>(가) $n(A)=n(B)$<br>(나) 집합 $X$의 모든 원소 $x$에 대하여 $f(x)\\ne x$이다.",
    "choices": [],
    "answer": "$57$",
    "solution": "[키포인트] $A=\\operatorname{Im}f$에 대한 $f$의 제한을 보면 $n(A)=n(B)$ 조건이 $A$ 위의 순열 조건으로 바뀐다.\n조건 정리: $B=\\operatorname{Im}(f\\circ f)=f(A)$이고 항상 $B\\subseteq A$이다.\n풀이 방향: $n(A)=n(B)$에서 $B=A$를 얻고, $|A|=2,3,4$로 나누어 고정점이 없는 함수를 센다.\n정석 풀이: $B\\subseteq A$이고 원소 수가 같으므로 $B=A$이다. 따라서 $f|_A:A\\to A$는 전사함수이고 유한집합에서는 일대일함수이기도 하다. 조건 (나)에 의해 $A$의 어떤 원소도 자기 자신으로 가지 않는다. $|A|=1$은 불가능하다. $|A|=2$이면 $A$ 선택이 ${}_4C_2=6$가지이고 두 원소는 서로 맞바뀌어야 한다. $X\\setminus A$의 두 원소는 각각 $A$의 두 값 중 하나로 갈 수 있으므로 $6\\times2^2=24$개이다. $|A|=3$이면 $A$ 선택은 ${}_4C_3=4$가지이다. 세 원소가 모두 자기 자신으로 가지 않게 대응시키는 방법은 한 원소의 상을 정하면 나머지가 정해지는 $2$가지이고, 밖의 한 원소의 함수값은 $A$의 $3$개 중 하나이므로 $4\\times2\\times3=24$개이다. $|A|=4$이면 모든 원소가 서로 다르게 대응되어야 한다. 두 쌍으로 나누어 각 쌍끼리 서로 바꾸는 방법은 $3$가지이고, 네 원소가 한 번에 이어지게 대응되는 방법은 한 원소의 상을 정하는 $3$가지와 그 다음 상을 정하는 $2$가지를 곱한 $6$가지이므로 모두 $3+6=9$가지이다. 따라서 전체는 $24+24+9=57$개이다.\n따라서 구하는 값은 $57$이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 21,
    "level": "상",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "인수분해",
      "도형"
    ],
    "wide": false,
    "content": "서술형 3<br>그림과 같이 모든 모서리의 길이가 $a$인 정사각뿔 $O-ABCD$가 있다. 네 선분 $OA,OB,OC,OD$ 위의 네 점 $E,F,G,H$를 $OE=OF=OG=OH=b$가 되도록 잡는다. 두 정사각뿔 $O-ABCD$, $O-EFGH$의 두 부피의 합이 8이고 선분 $AF$의 길이가 $2\\sqrt2$일 때, $a+b$의 값을 구하시오. [5점]",
    "choices": [],
    "image": "assets/images/22_제일고_2학기_기말_고1_기출/q21.png",
    "answer": "$3\\sqrt2$",
    "solution": "[키포인트] 두 정사각뿔의 부피를 $a^3,b^3$에 연결하고, 정삼각형 $AOB$에서 피타고라스 정리를 이용해 $AF^2=a^2-ab+b^2$를 만든다.\n조건 정리: 밑면 $ABCD$는 한 변이 $a$인 정사각형이고 $OA=OB=a$이므로 삼각형 $AOB$는 정삼각형이다. 또 $F$는 $OB$ 위에서 $OF=b$를 만족한다.\n풀이 방향: 먼저 두 정사각뿔의 부피의 합으로 $a^3+b^3$을 구하고, 삼각형 $AOB$에 수선을 그어 $AF$의 길이 조건을 식으로 바꾼다.\n정석 풀이: 정사각형 $ABCD$의 중심을 $S$라 하면 $SA=\\dfrac{a}{\\sqrt2}$이므로 큰 정사각뿔의 높이는 $OS=\\sqrt{a^2-\\left(\\dfrac{a}{\\sqrt2}\\right)^2}=\\dfrac{a}{\\sqrt2}$이다. 따라서 큰 정사각뿔의 부피는 $\\dfrac13a^2\\cdot\\dfrac{a}{\\sqrt2}=\\dfrac{a^3}{3\\sqrt2}$이고, 닮음인 작은 정사각뿔의 부피는 $\\dfrac{b^3}{3\\sqrt2}$이다. 두 부피의 합이 $8$이므로 $a^3+b^3=24\\sqrt2$이다. 이제 정삼각형 $AOB$에서 $A$에서 $OB$에 내린 수선의 발을 $M$이라 하자. 그러면 $OM=\\dfrac a2$, $AM=\\dfrac{\\sqrt3}{2}a$이다. $F$가 $OB$ 위에 있으므로 $MF=\\left|b-\\dfrac a2\\right|$이고, 직각삼각형 $AMF$에서 $AF^2=AM^2+MF^2=\\dfrac{3a^2}{4}+\\left(b-\\dfrac a2\\right)^2=a^2-ab+b^2$이다. $AF=2\\sqrt2$이므로 $a^2-ab+b^2=8$이다. 따라서 $a^3+b^3=(a+b)(a^2-ab+b^2)=8(a+b)=24\\sqrt2$이므로 $a+b=3\\sqrt2$이다.\n따라서 구하는 값은 $3\\sqrt2$이다.",
    "subUnitKey": "H15-SA-03-FACTORIZATION",
    "subUnit": "인수분해",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "중",
    "category": "무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수"
    ],
    "wide": false,
    "content": "서술형 4<br>다음 그림과 같이 좌표평면 위의 두 곡선 $y=-\\sqrt{x}$과 $y=-\\sqrt{x+2}$이 $y$축에 평행한 직선 $x=k$ $(k=1,2,3,4,\\cdots)$와 만나는 점을 각각 $P_k,Q_k$라 할 때, $\\overline{P_1Q_1}+\\overline{P_2Q_2}+\\cdots+\\overline{P_{47}Q_{47}}=a+b\\sqrt2+c\\sqrt3$을 만족하는 $a+b+c$의 값을 구하시오. (단, $a,b,c$는 유리수) [5점]",
    "choices": [],
    "answer": "$9$",
    "solution": "[키포인트] 같은 $x=k$에서 두 곡선의 세로 거리는 두 제곱근의 차이고, 이를 모두 더하면 중간 항이 소거된다.\n조건 정리: $P_k=(k,-\\sqrt{k})$, $Q_k=(k,-\\sqrt{k+2})$이다.\n풀이 방향: $\\overline{P_kQ_k}$를 구한 뒤 $k=1$부터 $47$까지 망원합을 만든다.\n정석 풀이: $Q_k$가 $P_k$보다 아래에 있으므로 $\\overline{P_kQ_k}=\\sqrt{k+2}-\\sqrt{k}$이다. 따라서 합은 $(\\sqrt3-1)+(\\sqrt4-\\sqrt2)+(\\sqrt5-\\sqrt3)+\\cdots+(\\sqrt{49}-\\sqrt{47})$이고 중간 항이 소거되어 $\\sqrt{48}+\\sqrt{49}-1-\\sqrt2$만 남는다. 이는 $4\\sqrt3+7-1-\\sqrt2=6-\\sqrt2+4\\sqrt3$이다. 따라서 $a=6$, $b=-1$, $c=4$이므로 $a+b+c=9$이다.\n따라서 구하는 값은 $9$이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];

const COMPLETION = {
  1: ["②", "[키포인트] 합성함수의 대응을 먼저 만든 뒤 그 합성함수의 역함수를 읽는다.\n조건 정리: 그림에서 $f(3)=1$, $f(6)=7$, $f(9)=4$이고 $g(1)=6$, $g(4)=3$, $g(7)=9$이다.\n풀이 방향: $f\\circ g$의 대응을 직접 계산한다.\n정석 풀이: $(f\\circ g)(4)=f(g(4))=f(3)=1$이다. 또 $(f\\circ g)(1)=f(g(1))=f(6)=7$이므로 $(f\\circ g)^{-1}(7)=1$이다. 따라서 구하는 값은 $1+1=2$이다.\n따라서 정답은 ②이다."],
  2: ["④", "[키포인트] 유리함수를 $y=q+\\dfrac{r}{x-p}$ 꼴로 바꾸면 점근선과 대칭의 중심을 바로 확인할 수 있다.\n조건 정리: $\\dfrac{3x-1}{x-2}=3+\\dfrac5{x-2}$이다.\n풀이 방향: 각 보기의 정의역, 중심, 절편, 사분면 통과 여부를 차례로 확인한다.\n정석 풀이: 점근선은 $x=2$, $y=3$이므로 정의역은 $x\\ne2$이고 대칭의 중심은 $(2,3)$이다. $x$절편은 $3x-1=0$에서 $x=\\dfrac13$이므로 그래프는 $(\\dfrac13,0)$에서 $x$축과 만난다. 또한 $x=1$이면 $y=-2$이므로 제4사분면도 지난다. 따라서 옳은 것은 ④뿐이다.\n따라서 정답은 ④이다."],
  3: ["③", "[키포인트] $g^{-1}$은 출력값에서 입력값으로 거슬러 올라가고, 그 입력값을 다시 $f$에 넣는다.\n조건 정리: 그림의 점선에서 $g(d)=e$이고 $f(d)=c$임을 읽을 수 있다.\n풀이 방향: 먼저 $g^{-1}(e)$를 찾은 뒤 그 값을 $f$에 대입한다.\n정석 풀이: $g(d)=e$이므로 $g^{-1}(e)=d$이다. 이어서 그림에서 $x=d$일 때 $f(d)=c$이다. 따라서 $f(g^{-1}(e))=f(d)=c$이다.\n따라서 정답은 ③이다."],
  4: ["⑤", "[키포인트] 곱이 짝수가 아닌 경우는 선택한 세 수가 모두 홀수일 때뿐이다.\n조건 정리: $1$부터 $10$까지에서 서로 다른 $3$개를 고르는 전체 경우를 센다.\n풀이 방향: 전체 조합에서 홀수 $5$개 중 $3$개만 고르는 경우를 뺀다.\n정석 풀이: 전체 선택은 ${}_{10}C_3=120$가지이다. 곱이 홀수가 되려면 $1,3,5,7,9$ 중에서 $3$개를 골라야 하므로 ${}_5C_3=10$가지이다. 따라서 곱이 짝수인 경우는 $120-10=110$가지이다.\n따라서 정답은 ⑤이다."],
  5: ["①", "[키포인트] 조합 항등식의 계산뿐 아니라 식이 정의되는 범위까지 확인한다.\n조건 정리: ㉠에서는 $0\\lt r\\le10$인 자연수 전체를 허용하고 있다.\n풀이 방향: 표시된 각 단계가 그 범위의 모든 $r$에서 정의되는지 확인한다.\n정석 풀이: $r=10$이면 ㉠의 오른쪽에 ${}_9C_{10}$이 나타나는데, 고등학교 조합의 정의에서는 $n\\ge r$일 때 ${}_nC_r$를 사용하므로 ${}_9C_{10}$은 정의되지 않는다. 따라서 제시된 증명 과정이 성립하려면 이 단계에서 $r$의 범위를 그대로 $0\\lt r\\le10$으로 둘 수 없다. 나머지 ㉡~㉤의 계산 전개는 정의되는 범위에서는 옳다.\n따라서 정답은 ①이다."],
  6: ["④", "[키포인트] $A$와 $E$의 색이 같은지 다른지에 따라 가운데 $B,C,D$에 사용할 수 있는 색의 수가 달라진다.\n조건 정리: $A,E$는 서로 인접하지 않고, $B-C-D$는 차례로 인접하며 $B,C,D$는 모두 $A,E$와 인접한다.\n풀이 방향: $A,E$가 같은 색인 경우와 다른 색인 경우로 나누어 센다.\n정석 풀이: $A,E$가 같은 색이면 그 색은 $5$가지이고, $B,C,D$는 그 색을 제외한 $4$색으로 길이 $3$인 경로를 칠하므로 $4\\times3\\times3=36$가지이다. 따라서 $5\\times36=180$가지이다. $A,E$가 다른 색이면 두 색을 정하는 방법이 $5\\times4=20$가지이고, $B,C,D$는 두 색을 제외한 $3$색으로 칠하므로 $3\\times2\\times2=12$가지이다. 따라서 $20\\times12=240$가지이다. 전체는 $180+240=420$가지이다.\n따라서 정답은 ④이다."],
  7: ["⑤", "[키포인트] 두 조각의 치역이 정확히 이어지면서 서로 겹치지 않아야 전체 함수가 일대일이고 치역도 $y\\lt1$이 된다.\n조건 정리: $x\\gt4$에서 $\\dfrac{x-7}{x-3}=1-\\dfrac4{x-3}$의 치역은 $(-3,1)$이다. $x\\le4$에서 $-\\sqrt{4-x}+a$의 치역은 $(-\\infty,a]$이다.\n풀이 방향: 두 치역의 합집합이 $(-\\infty,1)$이면서 서로 겹치지 않는 조건으로 $a$를 정한다.\n정석 풀이: 두 치역이 빈틈없이 이어지고 겹치지 않으려면 $a=-3$이어야 한다. 따라서 $f(3)=-\\sqrt1-3=-4$이다. $f(3)f(k)=4$이므로 $f(k)=-1$이다. $x\\le4$인 조각은 항상 $-3$ 이하이므로 $f(k)=-1$은 $x\\gt4$인 조각에서 생긴다. $\\dfrac{k-7}{k-3}=-1$에서 $k-7=-k+3$, 따라서 $2k=10$이고 $k=5$이다.\n따라서 정답은 ⑤이다."],
  8: ["①", "[키포인트] $k-3$의 부호에 따라 유리함수의 증가·감소가 달라진다.\n조건 정리: $y=\\dfrac{3x+k}{x+1}=3+\\dfrac{k-3}{x+1}$이고 $0\\le x\\le3$이다.\n풀이 방향: 증가하는 경우와 감소하는 경우를 확인하여 최솟값이 $4$가 되는 $k$를 찾는다.\n정석 풀이: $k\\lt3$이면 함수는 증가하므로 최솟값은 $x=0$에서 $k$인데 $4$가 될 수 없다. $k=3$이면 함수값이 항상 $3$이다. 따라서 $k\\gt3$이고 이때 함수는 감소하므로 최솟값은 $x=3$에서 갖는다. $\\dfrac{9+k}{4}=4$이므로 $k=7$이다.\n따라서 정답은 ①이다."],
  9: ["②, ③", "[키포인트] 교점의 $y$좌표를 미지수로 두면 두 교점 조건이 이차방정식의 서로 다른 두 음이 아닌 근 조건으로 바뀐다.\n조건 정리: 곡선 위에서 $y=\\sqrt{2-x}\\ge0$이므로 $x=2-y^2$이다.\n풀이 방향: 직선식에 대입하여 $y$에 대한 이차방정식의 근 조건을 조사한다.\n정석 풀이: $y=-x+k$에 $x=2-y^2$을 대입하면 $y^2-y+k-2=0$이다. 서로 다른 두 실근을 가지려면 판별식 $1-4(k-2)=9-4k\\gt0$이므로 $k\\lt\\dfrac94$이다. 두 근의 합은 $1$이고 곱은 $k-2$이므로 두 근이 모두 음이 아니려면 $k\\ge2$이다. 따라서 $2\\le k\\lt\\dfrac94$이고, 보기에서 해당하는 값은 $2$, $\\dfrac{17}{8}$이다.\n따라서 정답은 ②, ③이다."],
  10: ["②", "[키포인트] 함수와 역함수의 정의역·치역을 구분하고, 합성식에서는 일대일함수 $h$를 소거한다.\n조건 정리: $f(x)=-\\sqrt{x+1}$의 정의역은 $x\\ge-1$, 치역은 $y\\le0$이고 $f^{-1}(x)=x^2-1$의 정의역은 $x\\le0$이다.\n풀이 방향: ㄱ, ㄴ, ㄷ을 각각 직접 확인한다.\n정석 풀이: ㄱ에서 $(0,-1)$은 $f(0)=-1$이므로 $y=f(x)$ 위에 있고, $f^{-1}(0)=-1$이므로 $y=f^{-1}(x)$ 위에도 있다. 그러나 $-1\\ne0$이므로 이 교점은 $y=x$ 위에 있지 않아 ㄱ은 거짓이다. ㄴ에서 $f\\circ f^{-1}$의 정의역은 $x\\le0$, $f^{-1}\\circ f$의 정의역은 $x\\ge-1$이므로 두 함수는 같지 않아 거짓이다. ㄷ에서 $h$의 역함수가 존재하므로 $h$는 일대일이다. $(h\\circ g\\circ f)(x)=h(x)$에서 $g(f(x))=x$이므로 $g=f^{-1}$이고, $g(-3)=f^{-1}(-3)=(-3)^2-1=8$이다. 따라서 ㄷ만 옳다.\n따라서 정답은 ②이다."],
  11: ["②", "[키포인트] 복소수의 제곱이 실수이려면 실수부와 허수부의 곱이 $0$이어야 한다.\n조건 정리: $z=A+Bi$로 두면 $A=m-n-1$, $B=m+n-7$이고 $z^2=(A^2-B^2)+2ABi$이다.\n풀이 방향: $A=0$인 경우와 $B=0$인 경우를 각각 세고 중복을 뺀다.\n정석 풀이: $A=0$이면 $m=n+1$이므로 $1\\le m,n\\le6$에서 $(m,n)=(2,1),(3,2),(4,3),(5,4),(6,5)$의 $5$쌍이다. $B=0$이면 $m+n=7$이므로 $6$쌍이다. 두 조건을 동시에 만족하는 순서쌍은 $(4,3)$ 한 쌍이므로 전체는 $5+6-1=10$쌍이다.\n따라서 정답은 ②이다."],
  12: ["⑤", "[키포인트] 한 번 지난 지점을 다시 지날 수 없으므로 $A$에서 $C$까지 가능한 지점 방문 순서를 먼저 전부 나눈다.\n조건 정리: 그림에서 $AB,AC,AD,BC,BD,CD$ 사이의 도로 수는 각각 $3,2,2,1,2,2$이다.\n풀이 방향: 가능한 단순 경로 $AC$, $ABC$, $ADC$, $ABDC$, $ADBC$의 도로 선택 수를 각각 곱한다.\n정석 풀이: $AC$는 $2$가지, $ABC$는 $3\\times1=3$가지, $ADC$는 $2\\times2=4$가지이다. $ABDC$는 $3\\times2\\times2=12$가지이고, $ADBC$는 $2\\times2\\times1=4$가지이다. 따라서 전체는 $2+3+4+12+4=25$가지이다.\n따라서 정답은 ⑤이다."],
  13: ["①", "[키포인트] 사전식 순서는 앞자리에서 더 작은 문자가 오는 순열의 개수를 팩토리얼 단위로 누적한다.\n조건 정리: 알파벳 순서는 $h\\lt o\\lt s\\lt t\\lt u$이다.\n풀이 방향: $shout$와 $south$의 사전식 순번을 각각 구해 사이의 개수를 계산한다.\n정석 풀이: $shout$보다 앞에서 첫 글자가 $h,o$인 단어는 $2\\times4!=48$개이고, $s$로 시작한 뒤 $hout$보다 앞서는 배열은 $1$개이므로 $shout$는 $50$번째이다. $south$는 첫 글자에서 $48$개, 둘째 글자 $o$보다 작은 $h$로 시작하는 경우 $3!=6$개, 셋째 글자 $u$보다 작은 $h,t$가 오는 경우 $2\\times2!=4$개, 넷째 글자 $t$보다 작은 $h$가 오는 경우 $1$개가 앞서므로 $60$번째이다. 따라서 두 단어 사이의 단어 수는 $60-50-1=9$개이다.\n따라서 정답은 ①이다."],
  14: ["③", "[키포인트] 각 숫자가 십의 자리와 일의 자리에 나타나는 횟수를 이용하면 모든 수를 직접 만들 필요가 없다.\n조건 정리: $1,3,5,7,9$ 중 서로 다른 두 숫자로 두 자리 수를 만든다.\n풀이 방향: 각 숫자의 자리별 출현 횟수를 세어 자릿값을 곱한다.\n정석 풀이: 한 숫자를 십의 자리에 고정하면 일의 자리에는 나머지 $4$개가 올 수 있으므로 각 숫자는 십의 자리에 $4$번씩 나타난다. 일의 자리도 마찬가지로 $4$번씩 나타난다. 따라서 총합은 $4\\times(10+1)\\times(1+3+5+7+9)=44\\times25=1100$이다.\n따라서 정답은 ③이다."],
  15: ["②", "[키포인트] 절편 두 점과 점근선의 교점을 좌표로 나타내어 세 점의 기울기를 비교한다.\n조건 정리: $y=\\dfrac{k}{x-2}+1$의 점근선은 $x=2$, $y=1$이므로 $C=(2,1)$이다.\n풀이 방향: $A,B$의 좌표를 구한 뒤 $AC$와 $AB$의 기울기가 같다는 조건을 사용한다.\n정석 풀이: $y=0$에서 $\\dfrac{k}{x-2}=-1$이므로 $A=(2-k,0)$이다. $x=0$에서 $B=(0,1-\\dfrac{k}{2})$이다. $AC$의 기울기는 $\\dfrac{1}{k}$이고, $AB$의 기울기는 $\\dfrac{1-k/2}{k-2}=-\\dfrac12$이다. 세 점이 한 직선 위에 있으므로 $\\dfrac1k=-\\dfrac12$, 따라서 $k=-2$이다.\n따라서 정답은 ②이다."],
  16: ["④", "[키포인트] 역함수가 존재하려면 두 조각이 각각 일대일이고, 두 조각의 치역이 겹치지 않으면서 실수 전체를 정확히 덮어야 한다.\n조건 정리: $f(x)=-(x+1)^2+2$, $g(x+b)=(x+b-1)^2-2$이다.\n풀이 방향: 각 조각의 단조 조건과 치역의 경계가 맞닿는 조건을 구한 뒤 보기를 판정한다.\n정석 풀이: $x\\lt a$에서 $f$가 일대일이려면 꼭짓점 $x=-1$의 왼쪽만 사용해야 하므로 $a\\le-1$이다. 이 조각의 치역은 $(-\\infty,\\,2-(a+1)^2)$이다. $x\\ge a$에서 $g(x+b)$가 일대일이려면 꼭짓점 $x=1-b$의 오른쪽만 사용해야 하므로 $a+b\\ge1$이고, 치역은 $[(a+b-1)^2-2,\\infty)$이다. $h$가 실수 전체에서 일대일대응이 되려면 두 치역의 경계가 같아야 하므로 $(a+1)^2+(a+b-1)^2=4$이다. ㄱ은 $a=n\\gt1$이면 $a\\le-1$에 어긋나므로 참이다. ㄴ의 $(-3,-4)$는 $a+b=-7\\lt1$이므로 거짓이다. ㄷ에서 $a,b$가 정수라면 $p=-a-1$, $q=a+b-1$은 음이 아닌 정수이고 $p^2+q^2=4$이므로 $(p,q)=(0,2),(2,0)$뿐이다. 이에 대응하는 $(a,b)$는 $(-1,4),(-3,4)$이고 $a+b$의 값은 $3,1$이므로 그 합은 $4$이다. 따라서 ㄱ, ㄷ이 옳다.\n따라서 정답은 ④이다."],
  17: ["⑤", "[키포인트] 공역과 치역이 일치한다는 것은 $Y$의 세 원소가 모두 한 번 이상 함수값으로 나타나는 전사함수라는 뜻이다.\n조건 정리: 정의역 원소는 $6$개, 공역 원소는 $3$개이다.\n풀이 방향: 전체 함수에서 공역 원소가 하나 이상 빠지는 경우를 포함배제로 뺀다.\n정석 풀이: 전체 함수는 $3^6=729$개이다. 특정 한 값이 치역에서 빠지는 함수는 $2^6$개이고 빠지는 값을 고르는 방법이 $3$가지이므로 $3\\times2^6=192$개를 뺀다. 두 값이 동시에 빠져 한 값만 사용하는 함수는 $1^6$개이고 그런 한 값을 고르는 방법이 $3$가지이므로 $3$을 다시 더한다. 따라서 $729-192+3=540$개이다.\n따라서 정답은 ⑤이다."],
  18: ["①", "[키포인트] 완전한 $2\\times2\\times2$ 격자에서의 최단 경로 수를 먼저 구한 뒤, 계단 모양 때문에 실제로 존재하지 않는 경로만 제외한다.\n조건 정리: $A$에서 $B$까지 최단거리로 가려면 서로 수직인 세 방향으로 각각 $2$번씩, 모두 $6$번 이동한다.\n풀이 방향: 완전한 격자의 최단 경로를 세고, 그림에서 위쪽으로 두 번 연속 먼저 올라가야만 지날 수 있는 빠진 부분의 경로를 뺀다.\n정석 풀이: 완전한 $2\\times2\\times2$ 격자라면 세 방향의 이동 $2$번씩을 배열하므로 최단 경로는 $\\dfrac{6!}{2!2!2!}=90$가지이다. 그러나 실제 그림은 계단 모양이므로 $A$에서 위쪽으로 두 번 연속 이동한 뒤 나머지 두 수평 방향으로 각각 $2$번 이동하는 경로는 존재하지 않는다. 이때 남은 네 번의 이동을 두 방향에 $2$번씩 배치하는 방법은 $\\dfrac{4!}{2!2!}=6$가지이다. 따라서 실제 최단 경로의 수는 $90-6=84$가지이다.\n따라서 정답은 ①이다."],
  19: ["(1) $35$　(2) $840$", "[키포인트] (1)은 증가 순서가 자동으로 정해지고, (2)는 서로 다른 함수값을 순서 있게 배정한다.\n조건 정리: $X$에는 $4$개, $Y$에는 $7$개의 원소가 있다.\n풀이 방향: 두 조건을 각각 조합과 순열로 해석한다.\n정석 풀이: (1) $f(1)\\lt f(2)\\lt f(3)\\lt f(4)$이므로 $Y$에서 서로 다른 $4$개의 값을 고르면 작은 값부터 차례로 $f(1),f(2),f(3),f(4)$에 배정되는 순서는 하나뿐이다. 따라서 ${}_7C_4=35$개이다. (2) 서로 다른 네 함수값을 $f(1),f(2),f(3),f(4)$에 순서 있게 배정하므로 ${}_7P_4=7\\times6\\times5\\times4=840$개이다.\n따라서 구하는 값은 (1) $35$, (2) $840$이다."],
  20: ["$57$", "[키포인트] $A=\\operatorname{Im}f$에 대한 $f$의 제한을 보면 $n(A)=n(B)$ 조건이 $A$ 위의 순열 조건으로 바뀐다.\n조건 정리: $B=\\operatorname{Im}(f\\circ f)=f(A)$이고 항상 $B\\subseteq A$이다.\n풀이 방향: $n(A)=n(B)$에서 $B=A$를 얻고, $|A|=2,3,4$로 나누어 고정점이 없는 함수를 센다.\n정석 풀이: $B\\subseteq A$이고 원소 수가 같으므로 $B=A$이다. 따라서 $f|_A:A\\to A$는 전사함수이고 유한집합에서는 일대일함수이기도 하다. 조건 (나)에 의해 $A$의 어떤 원소도 자기 자신으로 가지 않는다. $|A|=1$은 불가능하다. $|A|=2$이면 $A$ 선택이 ${}_4C_2=6$가지이고 두 원소는 서로 맞바뀌어야 한다. $X\\setminus A$의 두 원소는 각각 $A$의 두 값 중 하나로 갈 수 있으므로 $6\\times2^2=24$개이다. $|A|=3$이면 $A$ 선택은 ${}_4C_3=4$가지이다. 세 원소가 모두 자기 자신으로 가지 않게 대응시키는 방법은 한 원소의 상을 정하면 나머지가 정해지는 $2$가지이고, 밖의 한 원소의 함수값은 $A$의 $3$개 중 하나이므로 $4\\times2\\times3=24$개이다. $|A|=4$이면 모든 원소가 서로 다르게 대응되어야 한다. 두 쌍으로 나누어 각 쌍끼리 서로 바꾸는 방법은 $3$가지이고, 네 원소가 한 번에 이어지게 대응되는 방법은 한 원소의 상을 정하는 $3$가지와 그 다음 상을 정하는 $2$가지를 곱한 $6$가지이므로 모두 $3+6=9$가지이다. 따라서 전체는 $24+24+9=57$개이다.\n따라서 구하는 값은 $57$이다."],
  21: ["$3\\sqrt2$", "[키포인트] 두 정사각뿔의 부피를 $a^3,b^3$에 연결하고, 정삼각형 $AOB$에서 피타고라스 정리를 이용해 $AF^2=a^2-ab+b^2$를 만든다.\n조건 정리: 밑면 $ABCD$는 한 변이 $a$인 정사각형이고 $OA=OB=a$이므로 삼각형 $AOB$는 정삼각형이다. 또 $F$는 $OB$ 위에서 $OF=b$를 만족한다.\n풀이 방향: 먼저 두 정사각뿔의 부피의 합으로 $a^3+b^3$을 구하고, 삼각형 $AOB$에 수선을 그어 $AF$의 길이 조건을 식으로 바꾼다.\n정석 풀이: 정사각형 $ABCD$의 중심을 $S$라 하면 $SA=\\dfrac{a}{\\sqrt2}$이므로 큰 정사각뿔의 높이는 $OS=\\sqrt{a^2-\\left(\\dfrac{a}{\\sqrt2}\\right)^2}=\\dfrac{a}{\\sqrt2}$이다. 따라서 큰 정사각뿔의 부피는 $\\dfrac13a^2\\cdot\\dfrac{a}{\\sqrt2}=\\dfrac{a^3}{3\\sqrt2}$이고, 닮음인 작은 정사각뿔의 부피는 $\\dfrac{b^3}{3\\sqrt2}$이다. 두 부피의 합이 $8$이므로 $a^3+b^3=24\\sqrt2$이다. 이제 정삼각형 $AOB$에서 $A$에서 $OB$에 내린 수선의 발을 $M$이라 하자. 그러면 $OM=\\dfrac a2$, $AM=\\dfrac{\\sqrt3}{2}a$이다. $F$가 $OB$ 위에 있으므로 $MF=\\left|b-\\dfrac a2\\right|$이고, 직각삼각형 $AMF$에서 $AF^2=AM^2+MF^2=\\dfrac{3a^2}{4}+\\left(b-\\dfrac a2\\right)^2=a^2-ab+b^2$이다. $AF=2\\sqrt2$이므로 $a^2-ab+b^2=8$이다. 따라서 $a^3+b^3=(a+b)(a^2-ab+b^2)=8(a+b)=24\\sqrt2$이므로 $a+b=3\\sqrt2$이다.\n따라서 구하는 값은 $3\\sqrt2$이다."],
  22: ["$9$", "[키포인트] 같은 $x=k$에서 두 곡선의 세로 거리는 두 제곱근의 차이고, 이를 모두 더하면 중간 항이 소거된다.\n조건 정리: $P_k=(k,-\\sqrt{k})$, $Q_k=(k,-\\sqrt{k+2})$이다.\n풀이 방향: $\\overline{P_kQ_k}$를 구한 뒤 $k=1$부터 $47$까지 망원합을 만든다.\n정석 풀이: $Q_k$가 $P_k$보다 아래에 있으므로 $\\overline{P_kQ_k}=\\sqrt{k+2}-\\sqrt{k}$이다. 따라서 합은 $(\\sqrt3-1)+(\\sqrt4-\\sqrt2)+(\\sqrt5-\\sqrt3)+\\cdots+(\\sqrt{49}-\\sqrt{47})$이고 중간 항이 소거되어 $\\sqrt{48}+\\sqrt{49}-1-\\sqrt2$만 남는다. 이는 $4\\sqrt3+7-1-\\sqrt2=6-\\sqrt2+4\\sqrt3$이다. 따라서 $a=6$, $b=-1$, $c=4$이므로 $a+b+c=9$이다.\n따라서 구하는 값은 $9$이다."]
};
const LEVELS = {"1":"하","2":"하","3":"중","4":"하","5":"중","6":"중","7":"상","8":"중","9":"중","10":"상","11":"중","12":"중","13":"중","14":"하","15":"중","16":"상","17":"중","18":"상","19":"중","20":"상","21":"상","22":"중"};
const EXTRA_TAGS = {1:["도형"],3:["그래프"],6:["도형"],9:["복수정답"],11:["경우의 수"],12:["도형"],18:["도형"],21:["도형"]};
for (const question of window.questionBank) {
  [question.answer, question.solution] = COMPLETION[question.id];
  question.level = LEVELS[question.id];
  question.layoutTag = "grid";
  question.wide = false;
  question.tags = [question.questionType, question.standardUnit, ...(EXTRA_TAGS[question.id] || [])];
}
