window.examTitle="22_순천여고_2학기_기말_고1_기출";
const U={"집합":["H15-SB-01",1],"명제":["H15-SB-02",2],"함수":["H15-SB-03",3],"유리함수":["H15-SB-04",4],"무리함수":["H15-SB-05",5],"경우의 수":["H15-SB-06",6],"순열":["H15-SB-07",7],"조합":["H15-SB-08",8],"원의 방정식":["H15-SA-11",11]};function q(id,u,t,c,ch=[],e={}){const[k,o]=U[u];return{id,level:"중",category:u,originalCategory:u,standardCourse:"수학(하)",standardUnitKey:k,standardUnit:u,standardUnitOrder:o,questionType:t,layoutTag:"grid",tags:[],wide:false,content:c,choices:ch,...e,answer:"",solution:""}}
window.questionBank=[
  {
    "id": 1,
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
      "경우의 수"
    ],
    "wide": false,
    "content": "서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 눈의 수를 각각 $x,y$라 할 때, $4\\le x+y\\le6$을 만족시키는 순서쌍 $(x,y)$의 개수는? [3.5점]",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "①",
    "solution": "[키포인트] 눈의 합을 4, 5, 6으로 나누어 순서쌍을 빠짐없이 센다.\n조건 정리: 두 주사위는 서로 다르므로 $(x,y)$와 $(y,x)$는 다른 경우이다.\n풀이 방향: 합이 일정할 때 가능한 양의 정수 순서쌍 중 $1\\le x,y\\le6$인 것만 센다.\n정석 풀이: $x+y=4$이면 $(1,3),(2,2),(3,1)$의 3개, $x+y=5$이면 4개, $x+y=6$이면 5개이다. 따라서 전체는 $3+4+5=12$개이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
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
      "유리함수"
    ],
    "wide": false,
    "content": "분모를 0으로 하지 않는 모든 실수 $x$에 대하여 등식 $\\dfrac{a}{x-1}-\\dfrac{b}{x+2}=\\dfrac{-x+4}{x^2+x-2}$이 성립할 때, 상수 $a,b$에 대하여 $a+b$의 값은? [3.6점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 분수를 통분한 뒤 항등식의 계수를 비교한다.\n조건 정리: 분모를 0으로 하지 않는 모든 $x$에서 성립하므로 분자끼리 항등적으로 같아야 한다.\n풀이 방향: 좌변의 분자를 일차식으로 정리하여 $x$의 계수와 상수항을 비교한다.\n정석 풀이: $a(x+2)-b(x-1)=(a-b)x+(2a+b)$이므로 $a-b=-1$, $2a+b=4$이다. 첫째 식에서 $b=a+1$이고 이를 둘째 식에 대입하면 $3a+1=4$이므로 $a=1$, $b=2$이다. 따라서 $a+b=3$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
    "level": "하",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열"
    ],
    "wide": false,
    "content": "남학생 2명, 여학생 3명이 일렬로 서서 사진을 찍으려 할 때, 남학생은 남학생끼리 여학생은 여학생끼리 이웃하게 서는 경우의 수는? [3.7점]",
    "choices": [
      "$12$",
      "$18$",
      "$24$",
      "$30$",
      "$36$"
    ],
    "answer": "③",
    "solution": "[키포인트] 남학생 2명과 여학생 3명을 각각 한 묶음으로 본다.\n조건 정리: 남학생끼리 모두 이웃하고 여학생끼리도 모두 이웃해야 한다.\n풀이 방향: 두 묶음의 순서와 각 묶음 내부의 순서를 따로 센 뒤 곱한다.\n정석 풀이: 남학생 묶음과 여학생 묶음을 배열하는 방법은 $2!$가지이다. 남학생 내부 배열은 $2!$가지, 여학생 내부 배열은 $3!$가지이므로 전체는 $2!\\times2!\\times3!=24$가지이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
    "level": "하",
    "category": "무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수"
    ],
    "wide": false,
    "content": "정의역이 $\\{x\\mid0\\le x\\le a\\}$인 무리함수 $y=\\sqrt{x+1}+b$의 최솟값이 3, 최댓값이 5일 때, $a+b$의 값은? (단, $a,b$는 상수) [3.7점]",
    "choices": [
      "$-10$",
      "$-6$",
      "$-2$",
      "$6$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 무리함수는 주어진 정의역에서 증가하므로 양 끝점에서 최솟값과 최댓값을 갖는다.\n조건 정리: 정의역은 $0\\le x\\le a$이고 최솟값은 3, 최댓값은 5이다.\n풀이 방향: $x=0$에서 $b$를 먼저 구한 뒤 $x=a$에서 $a$를 구한다.\n정석 풀이: $x=0$에서 $1+b=3$이므로 $b=2$이다. 또 $x=a$에서 $\\sqrt{a+1}+2=5$이므로 $\\sqrt{a+1}=3$, 따라서 $a=8$이다. 그러므로 $a+b=10$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
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
      "유리함수",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{k}{2x+a}+b$의 그래프가 오른쪽 그림과 같을 때, 상수 $a,b,k$에 대하여 $a+b+k$의 값은? [3.8점]",
    "choices": [
      "$-3$",
      "$-1$",
      "$2$",
      "$4$",
      "$6$"
    ],
    "answer": "④",
    "solution": "[키포인트] 그래프에서 수직·수평점근선과 $x$절편을 읽어 세 상수를 차례로 정한다.\n조건 정리: 그림에서 점근선은 $x=3$, $y=2$이고 그래프는 $x$축과 $(1,0)$에서 만난다.\n풀이 방향: $2x+a=0$에서 수직점근선을, $b$에서 수평점근선을 이용한 뒤 $(1,0)$을 대입한다.\n정석 풀이: 수직점근선이 $x=-\\dfrac a2=3$이므로 $a=-6$이다. 수평점근선이 $y=b=2$이므로 $b=2$이다. $(1,0)$을 대입하면 $0=\\dfrac{k}{2-6}+2=-\\dfrac k4+2$이므로 $k=8$이다. 따라서 $a+b+k=-6+2+8=4$이다.\n따라서 정답은 ④이다.",
    "image": "assets/images/22_순천여고_2학기_기말_고1_기출/q5.png",
    "imageSize": "large",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
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
      "조합"
    ],
    "wide": false,
    "content": "4명의 남학생과 3명의 여학생으로 이루어진 연극동아리가 있다. 학교 축제에서 공연할 대표로 학생 4명을 뽑을 때, 남학생을 적어도 2명 뽑는 경우의 수는? [3.8점]",
    "choices": [
      "$21$",
      "$25$",
      "$28$",
      "$31$",
      "$35$"
    ],
    "answer": "④",
    "solution": "[키포인트] 남학생을 뽑는 수가 2명, 3명, 4명인 경우로 나눈다.\n조건 정리: 대표는 4명이고 남학생이 적어도 2명이어야 한다.\n풀이 방향: 각 경우에서 남학생과 여학생을 조합으로 뽑고 서로 더한다.\n정석 풀이: 남2·여2는 $\\binom42\\binom32=18$, 남3·여1은 $\\binom43\\binom31=12$, 남4·여0은 $\\binom44=1$이다. 따라서 전체는 $18+12+1=31$가지이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
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
      "유리함수"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{-2x+k-2}{x+1}$의 그래프가 좌표평면 위의 모든 사분면을 지나도록 하는 자연수 $k$의 최솟값은? [3.9점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] $y=-2+\\dfrac{k}{x+1}$로 바꾸면 두 점근선과 각 사분면에서의 위치를 바로 판단할 수 있다.\n조건 정리: $k$는 자연수이고 수직점근선은 $x=-1$, 수평점근선은 $y=-2$이다.\n풀이 방향: 제1사분면을 지나는 조건을 먼저 구하면 나머지 세 사분면은 함께 확인할 수 있다.\n정석 풀이: $k\\gt0$이면 $x\\lt-1$에서 항상 $y\\lt-2$이므로 제3사분면을 지나고, 충분히 큰 양의 $x$에서는 $-2\\lt y\\lt0$이므로 제4사분면을 지난다. $-1\\lt x\\lt0$에서는 $y$가 매우 큰 양수가 되므로 제2사분면도 지난다. 제1사분면을 지나려면 $x\\gt0$에서 $y\\gt0$인 값이 있어야 하는데 $x=0$에서의 값이 $k-2$이므로 $k\\gt2$여야 한다. 따라서 가장 작은 자연수는 3이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
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
      "유리함수"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{x}{x-2}$의 그래프가 직선 $y=-2x+k$와 만나지 않도록 하는 정수 $k$의 최댓값은? [3.9점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 그래프의 교점에 대한 이차방정식이 실근을 갖지 않게 한다.\n조건 정리: 유리함수의 정의역에서 $x=2$는 제외되지만 교점 방정식에 $x=2$는 해가 되지 않는다.\n풀이 방향: 두 식을 같게 놓아 이차방정식을 만든 뒤 판별식을 음수로 둔다.\n정석 풀이: $\\dfrac{x}{x-2}=-2x+k$를 정리하면 $2x^2-(k+3)x+2k=0$이다. 판별식은 $D=(k+3)^2-16k=k^2-10k+9=(k-1)(k-9)$이다. 만나지 않으려면 $D\\lt0$이므로 $1\\lt k\\lt9$이다. 따라서 가능한 정수 중 최댓값은 8이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-11",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 11,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "원의 방정식"
    ],
    "wide": false,
    "content": "좌표평면에서 두 점 $(0,4)$, $(2,0)$을 지름의 양 끝점으로 하는 원과 직선 $2x-y+k=0$이 두 점에서 만나도록 하는 정수 $k$의 개수는? [4점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "④",
    "solution": "[키포인트] 원의 중심에서 직선까지의 거리가 반지름보다 작으면 직선과 원이 두 점에서 만난다.\n조건 정리: 지름의 양 끝점은 $(0,4)$, $(2,0)$이다.\n풀이 방향: 원의 중심과 반지름을 구한 뒤 점과 직선 사이의 거리 조건을 적용한다.\n정석 풀이: 중심은 두 점의 중점인 $(1,2)$이고 반지름은 $\\sqrt5$이다. 직선 $2x-y+k=0$과 중심 사이의 거리는 $\\dfrac{|2-2+k|}{\\sqrt{2^2+(-1)^2}}=\\dfrac{|k|}{\\sqrt5}$이다. 두 점에서 만나려면 $\\dfrac{|k|}{\\sqrt5}\\lt\\sqrt5$, 즉 $|k|\\lt5$여야 한다. 가능한 정수는 $-4,-3,\\ldots,4$의 9개이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SA-11-CIRCLE_EQUATION",
    "subUnit": "원의 방정식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
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
      "무리함수"
    ],
    "wide": false,
    "content": "스키드 마크란 자동차의 브레이크가 작동하여 바퀴가 구르지 않고 미끄러질 때 도로 면에 나타나는 타이어 자국을 말한다. 어느 도로에서 스키드 마크의 길이를 $S$ m, 마찰계수를 $F$, 제동 직전의 자동차의 속력을 $V$ km/h라고 하면 다음과 같은 관계식이 성립한다고 한다.<br>$V=\\sqrt{254\\times S\\times F}$<br>두 자동차 $A,B$에 대하여 자동차 $A$의 마찰계수는 자동차 $B$의 마찰계수의 2배이고, $A$의 제동 직전의 속력은 $B$의 제동 직전의 속력의 $\\dfrac13$배일 때, $B$의 스키드 마크의 길이는 $A$의 스키드 마크 길이의 $k$배이다. $k$의 값은? [4점]",
    "choices": [
      "$3$",
      "$6$",
      "$9$",
      "$12$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 주어진 식을 제곱하면 스키드 마크 길이 $S$는 $V^2/F$에 비례한다.\n조건 정리: $F_A=2F_B$, $V_A=\\dfrac13V_B$이다.\n풀이 방향: 두 자동차에 대해 $S=\\dfrac{V^2}{254F}$를 비교한다.\n정석 풀이: $\\dfrac{S_A}{S_B}=\\dfrac{V_A^2/F_A}{V_B^2/F_B}=\\dfrac{(V_B/3)^2/(2F_B)}{V_B^2/F_B}=\\dfrac1{18}$이다. 따라서 $S_B=18S_A$이므로 $k=18$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
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
      "유리함수"
    ],
    "wide": false,
    "content": "유리함수 $f(x)=\\dfrac{-1}{x+1}$에 대하여 $f^{53}(x)=\\dfrac{ax+b}{cx+d}$일 때, 상수 $a,b,c,d$에 대하여 $a+b+c+d$의 값은? (단, $f^1=f$, $f^{n+1}=f\\circ f^n$, $n$은 자연수이고 $c=1$이다.) [4점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "②",
    "solution": "[키포인트] 합성의 주기를 찾은 뒤, 추가된 조건 $c=1$을 이용해 계수를 유일하게 정한다.\n조건 정리: $f(x)=-\\dfrac1{x+1}$이고 $f^{n+1}=f\\circ f^n$, 또한 $c=1$이다.\n풀이 방향: $f^2$, $f^3$을 직접 계산하여 반복 주기를 찾고 $53$을 3으로 나눈 나머지를 이용한다.\n정석 풀이: $f^2(x)=-\\dfrac{x+1}{x}$이고 다시 합성하면 $f^3(x)=x$이므로 주기는 3이다. $53=3\\times17+2$이므로 $f^{53}(x)=f^2(x)=-\\dfrac{x+1}{x}$. 한편 $c=1$이므로 $\\dfrac{ax+b}{x+d}=-\\dfrac{x+1}{x}$이고 분모의 최고차항 계수가 같아 $d=0$, $a=-1$, $b=-1$이다. 따라서 $a+b+c+d=-1-1+1+0=-1$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
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
      "무리함수",
      "그래프"
    ],
    "wide": false,
    "content": "다음 함수 $f(x)$의 그래프가 그림과 같을 때, $(g\\circ f)(x)=x$를 만족시키는 함수 $g(x)=a\\sqrt{bx+1}+c$ $(x\\le d)$일 때, $abcd$의 값은? (단, $a,b,c,d$는 상수) [4점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "[키포인트] $(g\\circ f)(x)=x$이므로 $g=f^{-1}$이고, 역함수의 그래프는 $y=x$에 대한 대칭이다.\n조건 정리: 그림에서 $f$의 끝점은 $(-1,2)$이고 $x$축과 $(-3,0)$에서 만난다.\n풀이 방향: 두 점을 서로 뒤집어 $g$가 지나는 점을 얻고, 무리함수의 끝점 조건으로 $b,c,d$를 먼저 구한다.\n정석 풀이: $g$의 끝점은 $(2,-1)$이므로 정의역 끝값 $d=2$이고, 근호 안이 0이 되어 $2b+1=0$, 따라서 $b=-\\dfrac12$이다. 끝점의 함숫값으로 $c=-1$이다. 또 $f(-3)=0$이므로 $g(0)=-3$이고, $a\\sqrt{1}-1=-3$에서 $a=-2$이다. 따라서 $abcd=(-2)(-\\dfrac12)(-1)(2)=-2$이다.\n따라서 정답은 ①이다.",
    "image": "assets/images/22_순천여고_2학기_기말_고1_기출/q12.png",
    "imageSize": "large",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
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
      "함수"
    ],
    "wide": false,
    "content": "두 함수 $f(x)=x$, $g(x)=|x-2|-4$에 대하여 $-2\\le x\\le5$에서 함수 $f(x)\\times(f\\circ g)(x)$의 최댓값과 최솟값의 합은? [4.1점]",
    "choices": [
      "$-10$",
      "$-8$",
      "$-2$",
      "$2$",
      "$6$"
    ],
    "answer": "②",
    "solution": "[키포인트] 절댓값의 기준점 $x=2$에서 식을 나누어 각각 이차함수로 본다.\n조건 정리: $f(x)=x$이므로 $(f\\circ g)(x)=g(x)$이고 구할 함수는 $x(|x-2|-4)$이다.\n풀이 방향: $x\\le2$와 $x\\ge2$에서 식을 완전제곱꼴로 정리하여 최댓값과 최솟값을 비교한다.\n정석 풀이: $x\\le2$에서는 $x(2-x-4)=-x^2-2x=-(x+1)^2+1$이므로 구간 $[-2,2]$에서 최댓값은 1이다. $x\\ge2$에서는 $x(x-6)=x^2-6x=(x-3)^2-9$이므로 구간 $[2,5]$에서 최솟값은 $-9$이다. 전체 구간의 최댓값과 최솟값의 합은 $1+(-9)=-8$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 14,
    "level": "상",
    "category": "무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수"
    ],
    "wide": false,
    "content": "두 함수 $y=\\sqrt{ax}-3$, $y=\\sqrt{-ax+9}$ $(a\\gt0)$의 그래프와 $y$축으로 둘러싸인 도형의 넓이가 $\\dfrac92$일 때, 상수 $a$의 값은? [4.1점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "[키포인트] 위쪽과 아래쪽의 같은 높이 띠를 짝지어 가로 길이의 합을 본다.\n조건 정리: 두 그래프는 $(\\dfrac9a,0)$에서 만나고 $y$축에서는 각각 $(0,-3)$, $(0,3)$을 지난다.\n풀이 방향: $0\\le t\\le3$에서 높이 $y=t$인 위쪽 띠와 $y=-t$인 아래쪽 띠의 가로 길이를 더한다.\n정석 풀이: $y=t$에서 $y=\\sqrt{9-ax}$와 만나는 점의 $x$좌표는 $\\dfrac{9-t^2}{a}$이다. $y=-t$에서 $y=\\sqrt{ax}-3$과 만나는 점의 $x$좌표는 $\\dfrac{(3-t)^2}{a}$이다. 두 띠의 가로 길이의 합은 $\\dfrac{9-t^2+(3-t)^2}{a}=\\dfrac{18-6t}{a}$로, $t=0$에서 $\\dfrac{18}{a}$이고 $t=3$에서 0까지 일정하게 줄어든다. 따라서 두 부분을 같은 높이끼리 붙인 넓이는 밑변 3, 높이 $\\dfrac{18}{a}$인 삼각형의 넓이와 같아 $\\dfrac12\\times3\\times\\dfrac{18}{a}=\\dfrac{27}{a}$이다. 이것이 $\\dfrac92$이므로 $a=6$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "집합"
    ],
    "wide": false,
    "content": "집합 $A=\\{1,2,3,4,5,6,7\\}$의 공집합이 아닌 부분집합 $X$에 대하여 집합 $X$의 모든 원소의 합을 $S(X)$라 하자. 다음 조건을 만족시키는 집합 $X$의 개수는? [4.2점]<br>(가) $X\\cap\\{2,3\\}=\\{2\\}$<br>(나) $S(X)$의 값은 홀수이다.",
    "choices": [
      "$8$",
      "$12$",
      "$16$",
      "$24$",
      "$32$"
    ],
    "answer": "③",
    "solution": "[키포인트] 2는 반드시 포함되고 3은 반드시 제외되므로 나머지 원소들의 합의 홀짝만 판단하면 된다.\n조건 정리: $X\\cap\\{2,3\\}=\\{2\\}$이므로 2는 포함, 3은 제외이다.\n풀이 방향: 남은 $\\{1,4,5,6,7\\}$의 부분집합 중 원소의 합이 홀수인 경우를 센다.\n정석 풀이: 이미 포함된 2는 짝수이므로 남은 원소들의 합이 홀수여야 한다. 남은 집합에는 홀수 1이 있으므로 임의의 부분집합에서 1의 포함 여부를 바꾸면 합의 홀짝이 정확히 반대로 바뀐다. 따라서 전체 $2^5=32$개의 부분집합 중 절반인 16개가 홀수 합을 갖는다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-01-SET_BASIC",
    "subUnit": "집합의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수"
    ],
    "wide": false,
    "content": "두 집합 $A=\\{(x,y)\\mid y=-\\sqrt{x-2}+4\\}$, $B=\\{(x,y)\\mid kx+y+k-1=0\\}$에 대하여 $A\\cap B\\ne\\varnothing$일 때, 실수 $k$의 값의 최솟값은? [4.2점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "②",
    "solution": "[키포인트] 교점의 근호를 하나의 변수로 두면 $k$를 한 변수의 식으로 나타낼 수 있다.\n조건 정리: $A$ 위의 점에서 $x\\ge2$이고 $t=\\sqrt{x-2}\\ge0$로 둘 수 있다.\n풀이 방향: $x=t^2+2$를 직선의 식과 무리함수의 식에 대입하여 $k$를 구한 뒤 하한을 찾는다.\n정석 풀이: 교점에서는 $-t+4=-k(t^2+2)-k+1$이므로 $t-3=k(t^2+3)$, 따라서 $k=\\dfrac{t-3}{t^2+3}$이다. $k+1=\\dfrac{t-3+t^2+3}{t^2+3}=\\dfrac{t(t+1)}{t^2+3}\\ge0$이므로 $k\\ge-1$이다. $t=0$, 즉 $x=2$일 때 등호가 성립하므로 최솟값은 $-1$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
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
      "무리함수",
      "도형",
      "그래프"
    ],
    "wide": false,
    "content": "아래 그림과 같이 선분 $AB$를 지름으로 하고 중심이 $O$, $\\overline{AB}=4$인 반원이 있다. 호 $AC$ 위를 움직이는 점을 $P$, 점 $P$에서 선분 $AB$와 수직으로 만나는 점을 $D$라 하자. 점 $O$와 점 $D$ 사이의 거리를 $x$ $(0\\le x\\le2)$, 점 $A$와 점 $P$ 사이의 거리를 $f(x)$라 할 때, 함수 $y=f(x)$의 그래프의 모양으로 알맞은 것은? [4.3점]",
    "choices": [],
    "answer": "⑤",
    "solution": "[키포인트] $OD=x$를 이용해 직각삼각형 $OPD$, $APD$의 길이를 차례로 구한다.\n조건 정리: $AB=4$이므로 $OA=OP=2$이고 $0\\le x=OD\\le2$이다.\n풀이 방향: 먼저 피타고라스 정리로 $PD$를 구한 뒤 $AD=AO-DO$와 함께 $AP$를 구한다.\n정석 풀이: 직각삼각형 $OPD$에서 $PD^2=OP^2-OD^2=4-x^2$이므로 $PD=\\sqrt{4-x^2}$이다. 또 $AD=AO-DO=2-x$이다. 따라서 직각삼각형 $APD$에서 $AP^2=(2-x)^2+(4-x^2)=8-4x=4(2-x)$이므로 $f(x)=AP=2\\sqrt{2-x}$이다. 이 함수는 $0\\le x\\le2$에서 감소하고 아래로 굽으며 $x=2$에서 0이 된다. 원본 보기 중 이 모양에 해당하는 것은 ⑤이다.\n따라서 정답은 ⑤이다.",
    "image": "assets/images/22_순천여고_2학기_기말_고1_기출/q17.png",
    "imageSize": "tall",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
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
      "함수"
    ],
    "wide": false,
    "content": "집합 $X=\\{2,4,6,8,10\\}$에 대하여 $X$에서 $X$로의 함수 중 $(f\\circ f)(x)=x$를 만족시키는 함수 $f$의 개수는? [4.3점]",
    "choices": [
      "$26$",
      "$38$",
      "$46$",
      "$52$",
      "$68$"
    ],
    "answer": "①",
    "solution": "[키포인트] $(f\\circ f)(x)=x$이면 모든 원소는 고정점이거나 서로 맞바뀌는 두 원소의 쌍에 속한다.\n조건 정리: $X$의 원소는 5개이고 $f^2$는 항등함수이다.\n풀이 방향: 맞바뀌는 쌍의 개수가 0쌍, 1쌍, 2쌍인 경우로 나눈다.\n정석 풀이: 0쌍이면 모든 원소가 고정되어 1개이다. 1쌍이면 서로 바뀔 두 원소를 고르는 방법이 $\\binom52=10$개이다. 2쌍이면 고정될 한 원소를 5가지로 정하고 나머지 4개를 두 쌍으로 나누는 방법이 3가지이므로 $5\\times3=15$개이다. 따라서 전체는 $1+10+15=26$개이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 19,
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
      "함수"
    ],
    "wide": false,
    "content": "두 함수 $f(x)=\\dfrac3{x-2}-1$, $g(x)=-\\sqrt{-x+a}+2$에 대하여 $-4\\le x\\le1$일 때 $(f\\circ g)(x)$의 최댓값이 $-2$, 최솟값 $b$이다. $ab$의 값은? (단, $a\\ge1$) [4.4점]",
    "choices": [
      "$-16$",
      "$-\\dfrac{31}2$",
      "$-14$",
      "$-\\dfrac{25}2$",
      "$-7$"
    ],
    "answer": "④",
    "solution": "[키포인트] $g$는 증가하고, $g(x)\\lt2$인 범위에서 $f$는 감소하므로 합성함수는 감소한다.\n조건 정리: $-4\\le x\\le1$, $a\\ge1$이고 합성함수의 최댓값이 $-2$이다.\n풀이 방향: 최댓값은 왼쪽 끝 $x=-4$, 최솟값은 오른쪽 끝 $x=1$에서 갖는다는 점을 이용한다.\n정석 풀이: $g(-4)=2-\\sqrt{a+4}$이고 $f(g(-4))=-1-\\dfrac3{\\sqrt{a+4}}=-2$이므로 $\\sqrt{a+4}=3$, 따라서 $a=5$이다. 이때 $g(1)=2-\\sqrt4=0$이므로 최솟값 $b=f(0)=\\dfrac3{-2}-1=-\\dfrac52$이다. 따라서 $ab=5\\times(-\\dfrac52)=-\\dfrac{25}{2}$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 20,
    "level": "상",
    "category": "유리함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수"
    ],
    "wide": false,
    "content": "1보다 큰 실수 $a$에 대하여 직선 $x=a$가 두 함수 $y=\\dfrac1{x-1}$, $y=-x$의 그래프와 만나는 점을 각각 $P,Q$, 점 $P$에서 $x$축에 평행한 직선이 $y=-x$와 만나는 점을 $R$이라고 하자. 삼각형 $PQR$의 넓이의 최솟값은? [4.5점]",
    "choices": [
      "$3$",
      "$\\dfrac92$",
      "$6$",
      "$\\dfrac{15}2$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] $P,Q,R$의 좌표를 구하면 $PQ$와 $PR$의 길이가 같아져 넓이 문제가 한 변수의 최솟값 문제로 바뀐다.\n조건 정리: $a\\gt1$이므로 $a-1\\gt0$이다.\n풀이 방향: 세 점의 좌표를 구해 두 직각변의 길이를 나타내고 $t=a-1$로 치환한다.\n정석 풀이: $P=(a,\\dfrac1{a-1})$, $Q=(a,-a)$이다. $P$에서 그은 수평선 $y=\\dfrac1{a-1}$과 $y=-x$의 교점은 $R=(-\\dfrac1{a-1},\\dfrac1{a-1})$이다. 따라서 $PQ=PR=a+\\dfrac1{a-1}$. $t=a-1\\gt0$이라 두면 이 길이는 $t+1+\\dfrac1t\\ge3$이고 등호는 $t=1$일 때 성립한다. 따라서 삼각형의 최소 넓이는 $\\dfrac12\\times3\\times3=\\dfrac92$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
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
    "content": "서술형1<br>함수 $y=\\sqrt{ax+b}+c$의 그래프를 $x$축의 방향으로 2만큼, $y$축 방향으로 $-1$만큼 평행이동 한 후, $x$축에 대하여 대칭이동 하였더니 함수 $y=-\\sqrt{2x-5}+3$의 그래프와 일치하였다. 이때, 상수 $a,b,c$의 값을 각각 구하시오. [6점]",
    "choices": [],
    "answer": "$a=2,\\ b=-1,\\ c=-2$",
    "solution": "[키포인트] 평행이동은 $x$를 $x-2$로 바꾸고 함숫값에서 1을 뺀 뒤, $x$축 대칭으로 전체 부호를 바꾼다.\n조건 정리: 원래 함수는 $y=\\sqrt{ax+b}+c$이다.\n풀이 방향: 세 변환을 순서대로 식에 반영한 후 목표 함수와 근호 안, 바깥 상수를 비교한다.\n정석 풀이: 오른쪽으로 2만큼 평행이동하면 $y=\\sqrt{a(x-2)+b}+c$이고, 아래로 1만큼 옮기면 $y=\\sqrt{a(x-2)+b}+c-1$이다. 이를 $x$축에 대하여 대칭이동하면 $y=-\\sqrt{a(x-2)+b}-c+1$이다. 이것이 $-\\sqrt{2x-5}+3$과 같으므로 $a=2$, $-2a+b=-5$, $-c+1=3$이다. 따라서 $b=-1$, $c=-2$이다.\n따라서 구하는 값은 $a=2$, $b=-1$, $c=-2$이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "상",
    "category": "유리함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "유리함수"
    ],
    "wide": false,
    "content": "서술형2<br>좌표평면에서 점 $A(1,-2)$와 제2사분면 위를 움직이는 점 $P$가 있다. $P$에서 $x$축, $y$축에 내린 수선의 발을 각각 $Q,R$이라 하면 $\\overline{PA}=\\overline{PQ}+\\overline{PR}$이다. 점 $P$가 그리는 도형이 직선 $y=ax+b$에 대칭일 때, 점 $P$가 그리는 도형의 방정식과 직선 $y=ax+b$를 구하시오. (단, $a,b$는 상수) [7점]",
    "choices": [],
    "answer": "도형의 방정식: $(x+2)(y-1)=-\\dfrac92\\quad(x\\lt-2)$, 대칭축: $y=-x-1$",
    "solution": "[키포인트] 제2사분면의 좌표 부호를 이용해 거리 조건을 식으로 만들고, 완성된 쌍곡선을 평행이동한 좌표로 본다.\n조건 정리: $P=(x,y)$는 제2사분면에 있으므로 $x\\lt0$, $y\\gt0$, $PQ=y$, $PR=-x$이다.\n풀이 방향: $PA=PQ+PR$를 제곱해 도형의 방정식을 얻은 뒤, 실제 제2사분면 가지의 범위와 대칭축을 판정한다.\n정석 풀이: $A=(1,-2)$이므로 $PA=\\sqrt{(x-1)^2+(y+2)^2}$이고 조건에서 $\\sqrt{(x-1)^2+(y+2)^2}=y-x$이다. 양변을 제곱하여 정리하면 $2xy-2x+4y+5=0$, 즉 $(x+2)(y-1)=-\\dfrac92$이다. 제2사분면에서 이 식을 만족하려면 $x\\lt-2$이고 그때 $y\\gt1$이다. $X=x+2$, $Y=y-1$로 두면 해당 가지는 $XY=-\\dfrac92$의 제2사분면 가지이며 직선 $Y=-X$에 대하여 자기 자신으로 대칭이다. 원래 좌표로 돌아가면 $y-1=-(x+2)$이므로 대칭축은 $y=-x-1$이다.\n따라서 도형의 방정식은 $(x+2)(y-1)=-\\dfrac92\\quad(x\\lt-2)$이고 대칭축은 $y=-x-1$이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
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
    "content": "서술형3<br>집합 $X=\\{x\\mid x\\ge2$인 실수$\\}$에서 $X$로 정의된 함수 $f(x)=\\begin{cases}\\dfrac{4x-2}{x-3}&(x\\gt3)\\\\\\sqrt{ax+b}&(2\\le x\\le3)\\end{cases}$가 있다. $f(x)$의 역함수가 존재하도록 하는 실수 $a,b$의 값을 모두 구하시오. [7점]",
    "choices": [],
    "answer": "$(a,b)=(12,-20),\\ (-12,40)$",
    "solution": "[키포인트] 역함수가 존재하려면 전체 함수가 일대일 대응이어야 하므로 두 조각의 치역이 겹치지 않으면서 $X=[2,\\infty)$를 모두 채워야 한다.\n조건 정리: $x\\gt3$에서 첫째 조각은 $4+\\dfrac{10}{x-3}$이다.\n풀이 방향: 첫째 조각의 치역을 먼저 구하고, 둘째 조각이 정확히 남은 구간 $[2,4]$에 일대일 대응하도록 양 끝값을 배치한다.\n정석 풀이: $x\\gt3$이면 $\\dfrac{10}{x-3}\\gt0$이고 $x$가 3의 오른쪽에서 무한대로 움직일 때 첫째 조각의 치역은 $(4,\\infty)$이다. 따라서 $2\\le x\\le3$에서 $\\sqrt{ax+b}$는 $[2,4]$에 일대일 대응해야 한다. 증가하는 경우 $f(2)=2$, $f(3)=4$이므로 $2a+b=4$, $3a+b=16$에서 $(a,b)=(12,-20)$이다. 감소하는 경우 $f(2)=4$, $f(3)=2$이므로 $2a+b=16$, $3a+b=4$에서 $(a,b)=(-12,40)$이다. 두 경우 모두 근호 안이 $[4,16]$에서 움직여 정의 조건을 만족하고 전체 치역은 $[2,4]\\cup(4,\\infty)=X$가 된다.\n따라서 구하는 순서쌍은 $(a,b)=(12,-20),(-12,40)$이다.",
    "subUnitKey": "H15-SB-03-INVERSE_FUNCTION",
    "subUnit": "역함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  }
];

const COMPLETION = {
  1: ["①", "[키포인트] 눈의 합을 4, 5, 6으로 나누어 순서쌍을 빠짐없이 센다.\n조건 정리: 두 주사위는 서로 다르므로 $(x,y)$와 $(y,x)$는 다른 경우이다.\n풀이 방향: 합이 일정할 때 가능한 양의 정수 순서쌍 중 $1\\le x,y\\le6$인 것만 센다.\n정석 풀이: $x+y=4$이면 $(1,3),(2,2),(3,1)$의 3개, $x+y=5$이면 4개, $x+y=6$이면 5개이다. 따라서 전체는 $3+4+5=12$개이다.\n따라서 정답은 ①이다."],
  2: ["⑤", "[키포인트] 두 분수를 통분한 뒤 항등식의 계수를 비교한다.\n조건 정리: 분모를 0으로 하지 않는 모든 $x$에서 성립하므로 분자끼리 항등적으로 같아야 한다.\n풀이 방향: 좌변의 분자를 일차식으로 정리하여 $x$의 계수와 상수항을 비교한다.\n정석 풀이: $a(x+2)-b(x-1)=(a-b)x+(2a+b)$이므로 $a-b=-1$, $2a+b=4$이다. 첫째 식에서 $b=a+1$이고 이를 둘째 식에 대입하면 $3a+1=4$이므로 $a=1$, $b=2$이다. 따라서 $a+b=3$이다.\n따라서 정답은 ⑤이다."],
  3: ["③", "[키포인트] 남학생 2명과 여학생 3명을 각각 한 묶음으로 본다.\n조건 정리: 남학생끼리 모두 이웃하고 여학생끼리도 모두 이웃해야 한다.\n풀이 방향: 두 묶음의 순서와 각 묶음 내부의 순서를 따로 센 뒤 곱한다.\n정석 풀이: 남학생 묶음과 여학생 묶음을 배열하는 방법은 $2!$가지이다. 남학생 내부 배열은 $2!$가지, 여학생 내부 배열은 $3!$가지이므로 전체는 $2!\\times2!\\times3!=24$가지이다.\n따라서 정답은 ③이다."],
  4: ["⑤", "[키포인트] 무리함수는 주어진 정의역에서 증가하므로 양 끝점에서 최솟값과 최댓값을 갖는다.\n조건 정리: 정의역은 $0\\le x\\le a$이고 최솟값은 3, 최댓값은 5이다.\n풀이 방향: $x=0$에서 $b$를 먼저 구한 뒤 $x=a$에서 $a$를 구한다.\n정석 풀이: $x=0$에서 $1+b=3$이므로 $b=2$이다. 또 $x=a$에서 $\\sqrt{a+1}+2=5$이므로 $\\sqrt{a+1}=3$, 따라서 $a=8$이다. 그러므로 $a+b=10$이다.\n따라서 정답은 ⑤이다."],
  5: ["④", "[키포인트] 그래프에서 수직·수평점근선과 $x$절편을 읽어 세 상수를 차례로 정한다.\n조건 정리: 그림에서 점근선은 $x=3$, $y=2$이고 그래프는 $x$축과 $(1,0)$에서 만난다.\n풀이 방향: $2x+a=0$에서 수직점근선을, $b$에서 수평점근선을 이용한 뒤 $(1,0)$을 대입한다.\n정석 풀이: 수직점근선이 $x=-\\dfrac a2=3$이므로 $a=-6$이다. 수평점근선이 $y=b=2$이므로 $b=2$이다. $(1,0)$을 대입하면 $0=\\dfrac{k}{2-6}+2=-\\dfrac k4+2$이므로 $k=8$이다. 따라서 $a+b+k=-6+2+8=4$이다.\n따라서 정답은 ④이다."],
  6: ["④", "[키포인트] 남학생을 뽑는 수가 2명, 3명, 4명인 경우로 나눈다.\n조건 정리: 대표는 4명이고 남학생이 적어도 2명이어야 한다.\n풀이 방향: 각 경우에서 남학생과 여학생을 조합으로 뽑고 서로 더한다.\n정석 풀이: 남2·여2는 $\\binom42\\binom32=18$, 남3·여1은 $\\binom43\\binom31=12$, 남4·여0은 $\\binom44=1$이다. 따라서 전체는 $18+12+1=31$가지이다.\n따라서 정답은 ④이다."],
  7: ["③", "[키포인트] $y=-2+\\dfrac{k}{x+1}$로 바꾸면 두 점근선과 각 사분면에서의 위치를 바로 판단할 수 있다.\n조건 정리: $k$는 자연수이고 수직점근선은 $x=-1$, 수평점근선은 $y=-2$이다.\n풀이 방향: 제1사분면을 지나는 조건을 먼저 구하면 나머지 세 사분면은 함께 확인할 수 있다.\n정석 풀이: $k\\gt0$이면 $x\\lt-1$에서 항상 $y\\lt-2$이므로 제3사분면을 지나고, 충분히 큰 양의 $x$에서는 $-2\\lt y\\lt0$이므로 제4사분면을 지난다. $-1\\lt x\\lt0$에서는 $y$가 매우 큰 양수가 되므로 제2사분면도 지난다. 제1사분면을 지나려면 $x\\gt0$에서 $y\\gt0$인 값이 있어야 하는데 $x=0$에서의 값이 $k-2$이므로 $k\\gt2$여야 한다. 따라서 가장 작은 자연수는 3이다.\n따라서 정답은 ③이다."],
  8: ["③", "[키포인트] 두 그래프의 교점에 대한 이차방정식이 실근을 갖지 않게 한다.\n조건 정리: 유리함수의 정의역에서 $x=2$는 제외되지만 교점 방정식에 $x=2$는 해가 되지 않는다.\n풀이 방향: 두 식을 같게 놓아 이차방정식을 만든 뒤 판별식을 음수로 둔다.\n정석 풀이: $\\dfrac{x}{x-2}=-2x+k$를 정리하면 $2x^2-(k+3)x+2k=0$이다. 판별식은 $D=(k+3)^2-16k=k^2-10k+9=(k-1)(k-9)$이다. 만나지 않으려면 $D\\lt0$이므로 $1\\lt k\\lt9$이다. 따라서 가능한 정수 중 최댓값은 8이다.\n따라서 정답은 ③이다."],
  9: ["④", "[키포인트] 원의 중심에서 직선까지의 거리가 반지름보다 작으면 직선과 원이 두 점에서 만난다.\n조건 정리: 지름의 양 끝점은 $(0,4)$, $(2,0)$이다.\n풀이 방향: 원의 중심과 반지름을 구한 뒤 점과 직선 사이의 거리 조건을 적용한다.\n정석 풀이: 중심은 두 점의 중점인 $(1,2)$이고 반지름은 $\\sqrt5$이다. 직선 $2x-y+k=0$과 중심 사이의 거리는 $\\dfrac{|2-2+k|}{\\sqrt{2^2+(-1)^2}}=\\dfrac{|k|}{\\sqrt5}$이다. 두 점에서 만나려면 $\\dfrac{|k|}{\\sqrt5}\\lt\\sqrt5$, 즉 $|k|\\lt5$여야 한다. 가능한 정수는 $-4,-3,\\ldots,4$의 9개이다.\n따라서 정답은 ④이다."],
  10: ["⑤", "[키포인트] 주어진 식을 제곱하면 스키드 마크 길이 $S$는 $V^2/F$에 비례한다.\n조건 정리: $F_A=2F_B$, $V_A=\\dfrac13V_B$이다.\n풀이 방향: 두 자동차에 대해 $S=\\dfrac{V^2}{254F}$를 비교한다.\n정석 풀이: $\\dfrac{S_A}{S_B}=\\dfrac{V_A^2/F_A}{V_B^2/F_B}=\\dfrac{(V_B/3)^2/(2F_B)}{V_B^2/F_B}=\\dfrac1{18}$이다. 따라서 $S_B=18S_A$이므로 $k=18$이다.\n따라서 정답은 ⑤이다."],
  11: ["②", "[키포인트] 합성의 주기를 찾은 뒤, 추가된 조건 $c=1$을 이용해 계수를 유일하게 정한다.\n조건 정리: $f(x)=-\\dfrac1{x+1}$이고 $f^{n+1}=f\\circ f^n$, 또한 $c=1$이다.\n풀이 방향: $f^2$, $f^3$을 직접 계산하여 반복 주기를 찾고 $53$을 3으로 나눈 나머지를 이용한다.\n정석 풀이: $f^2(x)=-\\dfrac{x+1}{x}$이고 다시 합성하면 $f^3(x)=x$이므로 주기는 3이다. $53=3\\times17+2$이므로 $f^{53}(x)=f^2(x)=-\\dfrac{x+1}{x}$. 한편 $c=1$이므로 $\\dfrac{ax+b}{x+d}=-\\dfrac{x+1}{x}$이고 분모의 최고차항 계수가 같아 $d=0$, $a=-1$, $b=-1$이다. 따라서 $a+b+c+d=-1-1+1+0=-1$이다.\n따라서 정답은 ②이다."],
  12: ["①", "[키포인트] $(g\\circ f)(x)=x$이므로 $g=f^{-1}$이고, 역함수의 그래프는 $y=x$에 대한 대칭이다.\n조건 정리: 그림에서 $f$의 끝점은 $(-1,2)$이고 $x$축과 $(-3,0)$에서 만난다.\n풀이 방향: 두 점을 서로 뒤집어 $g$가 지나는 점을 얻고, 무리함수의 끝점 조건으로 $b,c,d$를 먼저 구한다.\n정석 풀이: $g$의 끝점은 $(2,-1)$이므로 정의역 끝값 $d=2$이고, 근호 안이 0이 되어 $2b+1=0$, 따라서 $b=-\\dfrac12$이다. 끝점의 함숫값으로 $c=-1$이다. 또 $f(-3)=0$이므로 $g(0)=-3$이고, $a\\sqrt{1}-1=-3$에서 $a=-2$이다. 따라서 $abcd=(-2)(-\\dfrac12)(-1)(2)=-2$이다.\n따라서 정답은 ①이다."],
  13: ["②", "[키포인트] 절댓값의 기준점 $x=2$에서 식을 나누어 각각 이차함수로 본다.\n조건 정리: $f(x)=x$이므로 $(f\\circ g)(x)=g(x)$이고 구할 함수는 $x(|x-2|-4)$이다.\n풀이 방향: $x\\le2$와 $x\\ge2$에서 식을 완전제곱꼴로 정리하여 최댓값과 최솟값을 비교한다.\n정석 풀이: $x\\le2$에서는 $x(2-x-4)=-x^2-2x=-(x+1)^2+1$이므로 구간 $[-2,2]$에서 최댓값은 1이다. $x\\ge2$에서는 $x(x-6)=x^2-6x=(x-3)^2-9$이므로 구간 $[2,5]$에서 최솟값은 $-9$이다. 전체 구간의 최댓값과 최솟값의 합은 $1+(-9)=-8$이다.\n따라서 정답은 ②이다."],
  14: ["①", "[키포인트] 위쪽과 아래쪽의 같은 높이 띠를 짝지어 가로 길이의 합을 본다.\n조건 정리: 두 그래프는 $(\\dfrac9a,0)$에서 만나고 $y$축에서는 각각 $(0,-3)$, $(0,3)$을 지난다.\n풀이 방향: $0\\le t\\le3$에서 높이 $y=t$인 위쪽 띠와 $y=-t$인 아래쪽 띠의 가로 길이를 더한다.\n정석 풀이: $y=t$에서 $y=\\sqrt{9-ax}$와 만나는 점의 $x$좌표는 $\\dfrac{9-t^2}{a}$이다. $y=-t$에서 $y=\\sqrt{ax}-3$과 만나는 점의 $x$좌표는 $\\dfrac{(3-t)^2}{a}$이다. 두 띠의 가로 길이의 합은 $\\dfrac{9-t^2+(3-t)^2}{a}=\\dfrac{18-6t}{a}$로, $t=0$에서 $\\dfrac{18}{a}$이고 $t=3$에서 0까지 일정하게 줄어든다. 따라서 두 부분을 같은 높이끼리 붙인 넓이는 밑변 3, 높이 $\\dfrac{18}{a}$인 삼각형의 넓이와 같아 $\\dfrac12\\times3\\times\\dfrac{18}{a}=\\dfrac{27}{a}$이다. 이것이 $\\dfrac92$이므로 $a=6$이다.\n따라서 정답은 ①이다."],
  15: ["③", "[키포인트] 2는 반드시 포함되고 3은 반드시 제외되므로 나머지 원소들의 합의 홀짝만 판단하면 된다.\n조건 정리: $X\\cap\\{2,3\\}=\\{2\\}$이므로 2는 포함, 3은 제외이다.\n풀이 방향: 남은 $\\{1,4,5,6,7\\}$의 부분집합 중 원소의 합이 홀수인 경우를 센다.\n정석 풀이: 이미 포함된 2는 짝수이므로 남은 원소들의 합이 홀수여야 한다. 남은 집합에는 홀수 1이 있으므로 임의의 부분집합에서 1의 포함 여부를 바꾸면 합의 홀짝이 정확히 반대로 바뀐다. 따라서 전체 $2^5=32$개의 부분집합 중 절반인 16개가 홀수 합을 갖는다.\n따라서 정답은 ③이다."],
  16: ["②", "[키포인트] 교점의 근호를 하나의 변수로 두면 $k$를 한 변수의 식으로 나타낼 수 있다.\n조건 정리: $A$ 위의 점에서 $x\\ge2$이고 $t=\\sqrt{x-2}\\ge0$로 둘 수 있다.\n풀이 방향: $x=t^2+2$를 직선의 식과 무리함수의 식에 대입하여 $k$를 구한 뒤 하한을 찾는다.\n정석 풀이: 교점에서는 $-t+4=-k(t^2+2)-k+1$이므로 $t-3=k(t^2+3)$, 따라서 $k=\\dfrac{t-3}{t^2+3}$이다. $k+1=\\dfrac{t-3+t^2+3}{t^2+3}=\\dfrac{t(t+1)}{t^2+3}\\ge0$이므로 $k\\ge-1$이다. $t=0$, 즉 $x=2$일 때 등호가 성립하므로 최솟값은 $-1$이다.\n따라서 정답은 ②이다."],
  17: ["⑤", "[키포인트] $OD=x$를 이용해 직각삼각형 $OPD$, $APD$의 길이를 차례로 구한다.\n조건 정리: $AB=4$이므로 $OA=OP=2$이고 $0\\le x=OD\\le2$이다.\n풀이 방향: 먼저 피타고라스 정리로 $PD$를 구한 뒤 $AD=AO-DO$와 함께 $AP$를 구한다.\n정석 풀이: 직각삼각형 $OPD$에서 $PD^2=OP^2-OD^2=4-x^2$이므로 $PD=\\sqrt{4-x^2}$이다. 또 $AD=AO-DO=2-x$이다. 따라서 직각삼각형 $APD$에서 $AP^2=(2-x)^2+(4-x^2)=8-4x=4(2-x)$이므로 $f(x)=AP=2\\sqrt{2-x}$이다. 이 함수는 $0\\le x\\le2$에서 감소하고 아래로 굽으며 $x=2$에서 0이 된다. 원본 보기 중 이 모양에 해당하는 것은 ⑤이다.\n따라서 정답은 ⑤이다."],
  18: ["①", "[키포인트] $(f\\circ f)(x)=x$이면 모든 원소는 고정점이거나 서로 맞바뀌는 두 원소의 쌍에 속한다.\n조건 정리: $X$의 원소는 5개이고 $f^2$는 항등함수이다.\n풀이 방향: 맞바뀌는 쌍의 개수가 0쌍, 1쌍, 2쌍인 경우로 나눈다.\n정석 풀이: 0쌍이면 모든 원소가 고정되어 1개이다. 1쌍이면 서로 바뀔 두 원소를 고르는 방법이 $\\binom52=10$개이다. 2쌍이면 고정될 한 원소를 5가지로 정하고 나머지 4개를 두 쌍으로 나누는 방법이 3가지이므로 $5\\times3=15$개이다. 따라서 전체는 $1+10+15=26$개이다.\n따라서 정답은 ①이다."],
  19: ["④", "[키포인트] $g$는 증가하고, $g(x)\\lt2$인 범위에서 $f$는 감소하므로 합성함수는 감소한다.\n조건 정리: $-4\\le x\\le1$, $a\\ge1$이고 합성함수의 최댓값이 $-2$이다.\n풀이 방향: 최댓값은 왼쪽 끝 $x=-4$, 최솟값은 오른쪽 끝 $x=1$에서 갖는다는 점을 이용한다.\n정석 풀이: $g(-4)=2-\\sqrt{a+4}$이고 $f(g(-4))=-1-\\dfrac3{\\sqrt{a+4}}=-2$이므로 $\\sqrt{a+4}=3$, 따라서 $a=5$이다. 이때 $g(1)=2-\\sqrt4=0$이므로 최솟값 $b=f(0)=\\dfrac3{-2}-1=-\\dfrac52$이다. 따라서 $ab=5\\times(-\\dfrac52)=-\\dfrac{25}{2}$이다.\n따라서 정답은 ④이다."],
  20: ["②", "[키포인트] $P,Q,R$의 좌표를 구하면 $PQ$와 $PR$의 길이가 같아져 넓이 문제가 한 변수의 최솟값 문제로 바뀐다.\n조건 정리: $a\\gt1$이므로 $a-1\\gt0$이다.\n풀이 방향: 세 점의 좌표를 구해 두 직각변의 길이를 나타내고 $t=a-1$로 치환한다.\n정석 풀이: $P=(a,\\dfrac1{a-1})$, $Q=(a,-a)$이다. $P$에서 그은 수평선 $y=\\dfrac1{a-1}$과 $y=-x$의 교점은 $R=(-\\dfrac1{a-1},\\dfrac1{a-1})$이다. 따라서 $PQ=PR=a+\\dfrac1{a-1}$. $t=a-1\\gt0$이라 두면 이 길이는 $t+1+\\dfrac1t\\ge3$이고 등호는 $t=1$일 때 성립한다. 따라서 삼각형의 최소 넓이는 $\\dfrac12\\times3\\times3=\\dfrac92$이다.\n따라서 정답은 ②이다."],
  21: ["$a=2,\\ b=-1,\\ c=-2$", "[키포인트] 평행이동은 $x$를 $x-2$로 바꾸고 함숫값에서 1을 뺀 뒤, $x$축 대칭으로 전체 부호를 바꾼다.\n조건 정리: 원래 함수는 $y=\\sqrt{ax+b}+c$이다.\n풀이 방향: 세 변환을 순서대로 식에 반영한 후 목표 함수와 근호 안, 바깥 상수를 비교한다.\n정석 풀이: 오른쪽으로 2만큼 평행이동하면 $y=\\sqrt{a(x-2)+b}+c$이고, 아래로 1만큼 옮기면 $y=\\sqrt{a(x-2)+b}+c-1$이다. 이를 $x$축에 대하여 대칭이동하면 $y=-\\sqrt{a(x-2)+b}-c+1$이다. 이것이 $-\\sqrt{2x-5}+3$과 같으므로 $a=2$, $-2a+b=-5$, $-c+1=3$이다. 따라서 $b=-1$, $c=-2$이다.\n따라서 구하는 값은 $a=2$, $b=-1$, $c=-2$이다."],
  22: ["도형의 방정식: $(x+2)(y-1)=-\\dfrac92\\quad(x\\lt-2)$, 대칭축: $y=-x-1$", "[키포인트] 제2사분면의 좌표 부호를 이용해 거리 조건을 식으로 만들고, 완성된 쌍곡선을 평행이동한 좌표로 본다.\n조건 정리: $P=(x,y)$는 제2사분면에 있으므로 $x\\lt0$, $y\\gt0$, $PQ=y$, $PR=-x$이다.\n풀이 방향: $PA=PQ+PR$를 제곱해 도형의 방정식을 얻은 뒤, 실제 제2사분면 가지의 범위와 대칭축을 판정한다.\n정석 풀이: $A=(1,-2)$이므로 $PA=\\sqrt{(x-1)^2+(y+2)^2}$이고 조건에서 $\\sqrt{(x-1)^2+(y+2)^2}=y-x$이다. 양변을 제곱하여 정리하면 $2xy-2x+4y+5=0$, 즉 $(x+2)(y-1)=-\\dfrac92$이다. 제2사분면에서 이 식을 만족하려면 $x\\lt-2$이고 그때 $y\\gt1$이다. $X=x+2$, $Y=y-1$로 두면 해당 가지는 $XY=-\\dfrac92$의 제2사분면 가지이며 직선 $Y=-X$에 대하여 자기 자신으로 대칭이다. 원래 좌표로 돌아가면 $y-1=-(x+2)$이므로 대칭축은 $y=-x-1$이다.\n따라서 도형의 방정식은 $(x+2)(y-1)=-\\dfrac92\\quad(x\\lt-2)$이고 대칭축은 $y=-x-1$이다."],
  23: ["$(a,b)=(12,-20),\\ (-12,40)$", "[키포인트] 역함수가 존재하려면 전체 함수가 일대일 대응이어야 하므로 두 조각의 치역이 겹치지 않으면서 $X=[2,\\infty)$를 모두 채워야 한다.\n조건 정리: $x\\gt3$에서 첫째 조각은 $4+\\dfrac{10}{x-3}$이다.\n풀이 방향: 첫째 조각의 치역을 먼저 구하고, 둘째 조각이 정확히 남은 구간 $[2,4]$에 일대일 대응하도록 양 끝값을 배치한다.\n정석 풀이: $x\\gt3$이면 $\\dfrac{10}{x-3}\\gt0$이고 $x$가 3의 오른쪽에서 무한대로 움직일 때 첫째 조각의 치역은 $(4,\\infty)$이다. 따라서 $2\\le x\\le3$에서 $\\sqrt{ax+b}$는 $[2,4]$에 일대일 대응해야 한다. 증가하는 경우 $f(2)=2$, $f(3)=4$이므로 $2a+b=4$, $3a+b=16$에서 $(a,b)=(12,-20)$이다. 감소하는 경우 $f(2)=4$, $f(3)=2$이므로 $2a+b=16$, $3a+b=4$에서 $(a,b)=(-12,40)$이다. 두 경우 모두 근호 안이 $[4,16]$에서 움직여 정의 조건을 만족하고 전체 치역은 $[2,4]\\cup(4,\\infty)=X$가 된다.\n따라서 구하는 순서쌍은 $(a,b)=(12,-20),(-12,40)$이다."]
};

const LEVELS={1:"하",2:"하",3:"하",4:"하",14:"상",16:"상",18:"상",19:"상",20:"상",22:"상",23:"상"};
for (const question of window.questionBank) {
  [question.answer, question.solution] = COMPLETION[question.id];
  question.level = LEVELS[question.id] || "중";
  question.layoutTag = "grid";
  question.wide = false;
  question.tags = question.questionType === "서술형" ? ["서술형", question.standardUnit] : [question.standardUnit];
}

Object.assign(window.questionBank[4], { image: "assets/images/22_순천여고_2학기_기말_고1_기출/q5.png", tags:["유리함수","그래프"] });
Object.assign(window.questionBank[11], { image: "assets/images/22_순천여고_2학기_기말_고1_기출/q12.png", tags:["무리함수","그래프"] });
Object.assign(window.questionBank[16], { image: "assets/images/22_순천여고_2학기_기말_고1_기출/q17.png", tags:["무리함수","도형","그래프"] });
