window.examTitle = "21_제일고_2학기_기말_고1_기출";

const U = {"집합":["H15-SB-01",1,"수학(하)"],"함수":["H15-SB-03",3,"수학(하)"],"유리함수":["H15-SB-04",4,"수학(하)"],"무리함수":["H15-SB-05",5,"수학(하)"],"경우의 수":["H15-SB-06",6,"수학(하)"],"순열":["H15-SB-07",7,"수학(하)"],"조합":["H15-SB-08",8,"수학(하)"],"평면좌표":["H15-SA-09",9,"수학(상)"],"도형의 이동":["H15-SA-12",12,"수학(상)"]};
function q(id,u,t,c,ch=[],e={}){
  const [k,o,course]=U[u];
  const {level="중",category=u,tags=[u],answer="",solution="",...rest}=e;
  const normalizedTags=t==="서술형" ? ["서술형",...tags.filter(v=>v!=="서술형")] : tags;
  return {id,level,category,originalCategory:u,standardCourse:course,standardUnitKey:k,standardUnit:u,standardUnitOrder:o,questionType:t,layoutTag:"grid",tags:normalizedTags,wide:false,content:c,choices:ch,...rest,answer,solution};
}

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "역함수와 합성함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "함수",
      "역함수",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^3+2$에 대하여 $(f^{-1}\\circ f\\circ f^{-1})(k)=2$를 만족시키는 실수 $k$의 값은? [3.7점]",
    "choices": [
      "$0$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 합성 순서를 오른쪽부터 적용하면 식이 간단해진다.\n조건 정리: $f$는 실수 전체에서 일대일대응이므로 $f^{-1}$가 존재한다.\n풀이 방향: $f^{-1}\\circ f$를 먼저 정리한다.\n정석 풀이: $(f^{-1}\\circ f\\circ f^{-1})(k)=f^{-1}(f(f^{-1}(k)))=f^{-1}(k)$이다. 따라서 $f^{-1}(k)=2$이고, 양변에 $f$를 적용하면 $k=f(2)=2^3+2=10$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 2,
    "level": "중",
    "category": "역함수의 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "함수",
      "역함수",
      "일대일함수",
      "절댓값함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=|2x-3|+kx-1$의 역함수가 존재하도록 하는 자연수 $k$의 최솟값은? [3.9점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "[키포인트] 역함수가 존재하려면 함수가 실수 전체에서 일대일함수여야 한다.\n조건 정리: 절댓값의 경계는 $2x-3=0$, 즉 $x=\\dfrac32$이다.\n풀이 방향: 두 구간에서의 기울기가 같은 부호가 되도록 한다.\n정석 풀이: $x\\lt\\dfrac32$에서는 $f(x)=(k-2)x+2$이고, $x\\ge\\dfrac32$에서는 $f(x)=(k+2)x-4$이다. 함수는 경계에서 연속이므로 전체에서 일대일이 되려면 두 기울기가 모두 양수이거나 모두 음수여야 한다. $k$가 자연수이므로 $k+2\\gt0$이고, 따라서 $k-2\\gt0$이어야 한다. 즉 $k\\gt2$이므로 자연수 $k$의 최솟값은 $3$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-03-INVERSE_FUNCTION",
    "subUnit": "역함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 3,
    "level": "하",
    "category": "선분의 내분점",
    "originalCategory": "평면좌표",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-09",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "평면좌표",
      "내분점"
    ],
    "wide": false,
    "content": "좌표평면 위의 두 점 $A(-2,4)$, $B(a,0)$에 대하여 선분 $AB$를 $1:3$으로 내분하는 점이 $y$축 위에 있을 때, 상수 $a$의 값은? [3.8점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "[키포인트] $1:3$ 내분점의 좌표에서 $x$좌표가 $0$임을 이용한다.\n조건 정리: $A(-2,4)$, $B(a,0)$이고 내분비는 $1:3$이다.\n풀이 방향: 내분점의 $x$좌표를 구해 $y$축 위의 조건을 적용한다.\n정석 풀이: 선분 $AB$를 $1:3$으로 내분하는 점의 $x$좌표는 $\\dfrac{3(-2)+1\\cdot a}{1+3}=\\dfrac{a-6}{4}$이다. 이 점이 $y$축 위에 있으므로 $\\dfrac{a-6}{4}=0$이다. 따라서 $a=6$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SA-09-COORDINATE_METRIC",
    "subUnit": "좌표와 거리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
    "level": "중",
    "category": "유리함수의 그래프",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "그래프",
      "복수정답"
    ],
    "wide": false,
    "content": "유리함수 $f(x)=\\dfrac{2x+1}{x+3}$의 그래프에 대하여 옳은 것을 모두 고르면? [4.3점]",
    "choices": [
      "점 $\\left(\\dfrac13,0\\right)$을 지난다.",
      "점근선의 방정식은 $x=3$, $y=2$이다.",
      "제$4$사분면을 지나지 않는다.",
      "직선 $y=-x-1$에 대칭이다.",
      "$y=\\dfrac{x-6}{x-1}$의 그래프를 평행이동하면 $y=f(x)$의 그래프와 겹쳐진다."
    ],
    "answer": "③, ④, ⑤",
    "solution": "[키포인트] 유리함수를 $y=\\dfrac{a}{x-p}+q$ 꼴로 바꾸면 점근선과 대칭축을 확인하기 쉽다.\n조건 정리: $f(x)=2-\\dfrac5{x+3}$이므로 중심은 $(-3,2)$이다.\n풀이 방향: 각 보기를 그래프의 절편, 점근선, 사분면, 대칭축, 평행이동 관점에서 확인한다.\n정석 풀이: ① $x$절편은 $2x+1=0$에서 $x=-\\dfrac12$이므로 거짓이다. ② 점근선은 $x=-3$, $y=2$이므로 거짓이다. ③ $x\\gt0$이면 분자와 분모가 모두 양수여서 $f(x)\\gt0$이므로 제4사분면을 지나지 않아 참이다. ④ 중심 $(-3,2)$을 지나는 기울기 $-1$인 직선은 $y-2=-(x+3)$, 즉 $y=-x-1$이므로 대칭축이 되어 참이다. ⑤ $y=\\dfrac{x-6}{x-1}=1-\\dfrac5{x-1}$도 계수가 $-\\dfrac5{x-p}$인 같은 모양의 그래프이므로 평행이동하여 겹칠 수 있어 참이다.\n따라서 정답은 ③, ④, ⑤이다.",

    "solutionImage": "assets/images/21_제일고_2학기_기말_고1_기출/q04-solution.svg",

    "solutionImageAlt": "유리함수의 점근선과 중심을 나타낸 해설 그래프",

    "solutionImageCaption": "y=2−5/(x+3)에서 점근선 x=−3, y=2와 중심을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "중",
    "category": "무리함수의 그래프와 역함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "그래프",
      "역함수",
      "복수정답"
    ],
    "wide": false,
    "content": "무리함수 $y=-\\sqrt{4-4x}+3$의 그래프에서 옳은 것을 모두 고르면? [4.4점]",
    "choices": [
      "정의역은 $\\{x\\mid x\\ge1\\}$이고, 치역은 $\\{y\\mid y\\le3\\}$이다.",
      "점 $\\left(-\\dfrac54,0\\right)$을 지난다.",
      "제$3,4$분면을 지난다.",
      "역함수는 $y=-\\dfrac14(x-3)^2+1\\ (x\\le3)$이다.",
      "$-6\\le x\\le0$에서 함수 $y=f(x)$의 최댓값은 $1$이다."
    ],
    "answer": "②, ④, ⑤",
    "solution": "[키포인트] 정의역·치역, 특정 점, 역함수, 구간 최댓값을 각각 직접 확인한다.\n조건 정리: $y=-2\\sqrt{1-x}+3$이므로 $x\\le1$이고 $y\\le3$이다.\n풀이 방향: 각 보기를 원래 함수의 식에 대입하거나 역함수를 직접 구해 판정한다.\n정석 풀이: ① 정의역은 $x\\le1$이므로 거짓이다. ② $x=-\\dfrac54$이면 $4-4x=9$이므로 $y=-3+3=0$이라서 참이다. ③ $y\\lt0$이 되려면 $x\\lt-\\dfrac54$이므로 이때 $x\\lt0$이고 제3사분면만 해당하여 거짓이다. ④ $y=-2\\sqrt{1-x}+3$에서 $x=1-\\dfrac14(y-3)^2$이고 원래 치역이 $y\\le3$이므로 역함수는 $y=-\\dfrac14(x-3)^2+1\\ (x\\le3)$이어서 참이다. ⑤ 이 함수는 정의역에서 증가하므로 $-6\\le x\\le0$에서 최댓값은 $f(0)=-2+3=1$로 참이다.\n따라서 정답은 ②, ④, ⑤이다.",

    "solutionImage": "assets/images/21_제일고_2학기_기말_고1_기출/q05-solution.svg",

    "solutionImageAlt": "무리함수의 끝점과 x절편을 나타낸 해설 그래프",

    "solutionImageCaption": "끝점 (1,3)과 x절편 (−5/4,0)을 이용해 정의역·치역·구간 최댓값을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "유리함수의 반복합성",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "합성함수",
      "귀납적규칙"
    ],
    "wide": false,
    "content": "유리함수 $f(x)=\\dfrac{x}{1-x}$에 대하여 $f^1(x)=f(x)$, $f^{n+1}(x)=(f\\circ f^n)(x)$ ($n$은 자연수)로 정의한다. $f^{2021}(x)=\\dfrac{ax+b}{cx+1}$일 때, 실수 $a,b,c$에 대하여 $a+b+c$의 값은? [4.5점]",
    "choices": [
      "$-2021$",
      "$-2020$",
      "$-2019$",
      "$2019$",
      "$2021$"
    ],
    "answer": "②",
    "solution": "[키포인트] 몇 번 합성한 식의 분모 계수가 한 번씩 증가하는 규칙을 찾는다.\n조건 정리: $f(x)=\\dfrac{x}{1-x}$이고 $f^{n+1}=f\\circ f^n$이다.\n풀이 방향: $f^n(x)=\\dfrac{x}{1-nx}$임을 확인한다.\n정석 풀이: $f^1(x)=\\dfrac{x}{1-x}$이다. $f^n(x)=\\dfrac{x}{1-nx}$라 하면 $f^{n+1}(x)=\\dfrac{\\frac{x}{1-nx}}{1-\\frac{x}{1-nx}}=\\dfrac{x}{1-(n+1)x}$이므로 이 식은 모든 자연수 $n$에 대하여 성립한다. 따라서 $f^{2021}(x)=\\dfrac{x}{1-2021x}=\\dfrac{1\\cdot x+0}{-2021x+1}$이다. 즉 $a=1$, $b=0$, $c=-2021$이므로 $a+b+c=-2020$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "상",
    "category": "유리함수 그래프를 이용한 무리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "유리함수",
      "그래프"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{ax+1}{bx+c}$의 그래프가 오른쪽 그림과 같을 때, 함수 $y=a\\sqrt{bx+a+c}$의 그래프가 반드시 지나는 사분면은? [4.5점]",
    "choices": [
      "제$4$사분면",
      "제$1$사분면, 제$2$사분면",
      "제$2$사분면, 제$3$사분면",
      "제$1$사분면, 제$2$사분면, 제$3$사분면",
      "제$3$사분면"
    ],
    "image": "assets/images/21_제일고_2학기_기말_고1_기출/q7.png",
    "answer": "⑤",
    "solution": "[키포인트] 유리함수 그래프의 점근선과 절편의 위치에서 $a,b,c$의 부호를 먼저 결정한다.\n조건 정리: 수직점근선 $x=-\\dfrac cb$와 수평점근선 $y=\\dfrac ab$가 모두 양의 영역에 있고, $y$절편 $\\dfrac1c$도 양수이다.\n풀이 방향: $a,b,c$의 부호를 이용하여 $y=a\\sqrt{bx+a+c}$의 정의역과 함수값의 부호를 확인한다.\n정석 풀이: $\\dfrac1c\\gt0$이므로 $c\\gt0$이다. 또 $-\\dfrac cb\\gt0$이므로 $b\\lt0$이고, $\\dfrac ab\\gt0$이므로 $a\\lt0$이다. 대상 함수의 정의역은 $bx+a+c\\ge0$이므로 $b\\lt0$에서 $x\\le-\\dfrac{a+c}{b}$이다. 따라서 정의역은 왼쪽으로 무한히 뻗어 충분히 작은 음의 $x$를 항상 포함한다. 그때 근호 안은 양수이고 $a\\lt0$이므로 $y\\lt0$이다. 즉 그래프는 계수의 구체적인 값과 관계없이 제$3$사분면을 반드시 지난다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "상",
    "category": "일대일함수와 치역",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "함수",
      "일대일함수",
      "치역",
      "구간함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=\\begin{cases}\\dfrac{2x-4}{x-4}&(x\\gt5)\\\\\\sqrt{5-x}+a&(x\\le5)\\end{cases}$가 다음 조건을 모두 만족시킨다.<div class='note-box'>(가) 치역은 $\\{y\\mid y\\gt2\\}$이다.<br>(나) 임의의 두 실수 $x_1,x_2$에 대하여 $x_1\\ne x_2$이면 $f(x_1)\\ne f(x_2)$이다.</div>$f(4)f(k)=28$일 때, 상수 $k$의 값은? (단, $a$는 상수) [4.7점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 조각의 치역이 겹치지 않으면서 합쳐서 $(2,\\infty)$가 되어야 한다.\n조건 정리: $x\\gt5$에서 $\\dfrac{2x-4}{x-4}=2+\\dfrac4{x-4}$이므로 치역은 $(2,6)$이다. $x\\le5$에서 $\\sqrt{5-x}+a$의 치역은 $[a,\\infty)$이다.\n풀이 방향: 전체 치역과 일대일 조건으로 두 조각의 치역을 정확히 이어 붙인다.\n정석 풀이: 첫 번째 조각의 치역이 $(2,6)$이므로 전체 치역이 $(2,\\infty)$이고 서로 다른 두 입력의 함수값이 같지 않으려면 두 번째 조각의 치역은 $[6,\\infty)$이어야 한다. 따라서 $a=6$이다. 그러면 $f(4)=\\sqrt{1}+6=7$이므로 $f(k)=4$이다. 값 $4$는 첫 번째 조각에서만 가능하므로 $2+\\dfrac4{k-4}=4$이다. 따라서 $\\dfrac4{k-4}=2$, $k=6$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-03-INVERSE_FUNCTION",
    "subUnit": "역함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 9,
    "level": "상",
    "category": "유리함수의 최댓값과 최솟값",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "부등식",
      "최댓값최솟값"
    ],
    "wide": false,
    "content": "$2\\le x\\le5$에서 $ax+3\\le\\dfrac{3x-1}{x-1}\\le bx+3$일 때, $b-a$의 최솟값은? [5점]",
    "choices": [
      "$1$",
      "$2$",
      "$\\dfrac3{10}$",
      "$\\dfrac12$",
      "$\\dfrac9{10}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 주어진 부등식을 $a$와 $b$에 대한 범위로 바꾼다.\n조건 정리: $\\dfrac{3x-1}{x-1}=3+\\dfrac2{x-1}$이고 $2\\le x\\le5$에서는 $x\\gt0$이다.\n풀이 방향: $ax\\le\\dfrac2{x-1}\\le bx$에서 $a\\le\\dfrac2{x(x-1)}\\le b$를 얻어 이 함수의 최솟값과 최댓값을 구한다.\n정석 풀이: $h(x)=\\dfrac2{x(x-1)}$라 하면 $x\\ge2$에서 분모 $x(x-1)$이 증가하므로 $h(x)$는 감소한다. 따라서 $2\\le x\\le5$에서 $\\max h(x)=h(2)=1$, $\\min h(x)=h(5)=\\dfrac1{10}$이다. 모든 $x$에서 부등식이 성립하려면 $a\\le\\dfrac1{10}$, $b\\ge1$이어야 한다. 그러므로 $b-a$의 최솟값은 $1-\\dfrac1{10}=\\dfrac9{10}$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION",
    "subUnit": "유리함수의 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
    "category": "경우의 수의 합의 법칙과 곱의 법칙",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의 수",
      "도형",
      "경로"
    ],
    "wide": false,
    "content": "다음 그림과 같이 지점 $A,B,C,D$ $4$개를 연결하는 도로망이 있다. 지점 $A$에서 출발하여 지점 $B$에 도착하는 모든 방법의 수는? (단, 한번 지난 지점은 다시 지나지 않는다.) [3.8점]",
    "choices": [
      "$19$",
      "$21$",
      "$27$",
      "$29$",
      "$34$"
    ],
    "image": "assets/images/21_제일고_2학기_기말_고1_기출/q10.png",
    "answer": "③",
    "solution": "[키포인트] 지점의 방문 순서별로 경우를 나누고, 같은 두 지점을 잇는 여러 도로는 곱의 법칙으로 센다.\n조건 정리: 그림에서 $A-B$는 $2$개, $A-C$는 $3$개, $C-B$는 $3$개, $A-D$는 $2$개, $D-B$는 $2$개, $C-D$는 $1$개의 도로가 있다.\n풀이 방향: 한 지점을 다시 지나지 않으므로 가능한 방문 순서는 $A\\to B$, $A\\to C\\to B$, $A\\to D\\to B$, $A\\to C\\to D\\to B$, $A\\to D\\to C\\to B$뿐이다.\n정석 풀이: 각 경우의 수는 차례로 $2$, $3\\times3=9$, $2\\times2=4$, $3\\times1\\times2=6$, $2\\times1\\times3=6$이다. 따라서 전체 경우의 수는 $2+9+4+6+6=27$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 11,
    "level": "중",
    "category": "사전식 배열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "사전식배열"
    ],
    "wide": false,
    "content": "$6$개의 문자 $e,i,j,l,o,g$를 모두 한 번씩 사용하여 사전식으로 $eijlog$부터 $goljie$까지 배열할 때, $jeilgo$는 몇 번째에 나타나는지 구하시오. [3.8점]",
    "choices": [
      "$120$",
      "$132$",
      "$223$",
      "$242$",
      "$256$"
    ],
    "answer": "④",
    "solution": "[키포인트] 문제에서 제시된 사전식 순서는 $e\\lt i\\lt j\\lt l\\lt o\\lt g$이다.\n조건 정리: 목표 문자열은 $jeilgo$이다.\n풀이 방향: 앞자리부터 목표 문자보다 먼저 올 수 있는 문자를 세어 앞에 놓이는 배열의 수를 계산한다.\n정석 풀이: 첫 글자가 $j$보다 앞선 $e$ 또는 $i$인 배열은 $2\\times5!=240$개이다. 첫 글자가 $j$로 같으면 둘째 $e$, 셋째 $i$, 넷째 $l$은 각각 남은 문자 중 가장 앞이므로 추가되는 배열이 없다. 다섯째 글자가 $g$인데 남은 두 문자 $o,g$ 중 $o$가 $g$보다 앞서므로 $jeilog$ 한 개가 먼저 나온다. 따라서 $jeilgo$의 순서는 $240+1+1=242$번째이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "상",
    "category": "중복되는 금액의 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의 수",
      "지불방법"
    ],
    "wide": false,
    "content": "$50000$원짜리 지폐 $3$장, $5000$원짜리 지폐 $5$장, $1000$원짜리 지폐 $6$장의 일부 또는 전부를 사용하여 지불할 수 있는 방법의 수를 $a$, 지불할 수 있는 금액의 수를 $b$라고 할 때, $a-b$의 값을 구하면? (단, $0$원을 지불하는 경우는 제외한다.) [4.5점]",
    "choices": [
      "$40$",
      "$44$",
      "$53$",
      "$124$",
      "$167$"
    ],
    "answer": "①",
    "solution": "[키포인트] 지불 방법의 수와 서로 다른 금액의 수는 따로 계산해야 한다.\n조건 정리: 각 지폐 사용 장수는 $50000$원권 $0$~$3$장, $5000$원권 $0$~$5$장, $1000$원권 $0$~$6$장이다.\n풀이 방향: 방법의 수 $a$는 사용 장수의 순서쌍을 세고, 금액의 수 $b$는 $1000$원 단위의 연속 구간을 이용한다.\n정석 풀이: $0$원을 포함한 사용 방법은 $4\\times6\\times7=168$가지이므로 $a=167$이다. $50000$원권을 제외한 금액을 $1000$원 단위로 쓰면 $5j+k$이고 $0\\le j\\le5$, $0\\le k\\le6$이다. 각 $j$에서 가능한 구간 $[5j,5j+6]$이 서로 이어져 $0$부터 $31$까지 모두 만들 수 있으므로 $32$가지이다. $50000$원권을 $i=0,1,2,3$장 쓰면 이 $32$개 구간이 각각 $50i$만큼 이동하며 서로 겹치지 않는다. 따라서 $0$원을 포함한 서로 다른 금액은 $4\\times32=128$개이고 $b=127$이다. 그러므로 $a-b=167-127=40$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "중",
    "category": "순열의 계산",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "순열의계산"
    ],
    "wide": false,
    "content": "다음 중 ${}_nP_{r+1}+(r+1){}_nP_r$와 같은 것은? [4.5점]",
    "choices": [
      "${}_{n+1}P_r$",
      "${}_{n+1}P_{r+1}$",
      "${}_{n+2}P_r$",
      "${}_{n+2}P_{r+1}$",
      "${}_{n+2}P_{r+2}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 항에서 공통인 ${}_nP_r$를 묶는다.\n조건 정리: ${}_nP_{r+1}={}_nP_r(n-r)$이다.\n풀이 방향: 공통인수를 묶은 뒤 순열의 정의와 비교한다.\n정석 풀이: ${}_nP_{r+1}+(r+1){}_nP_r={}_nP_r\\{(n-r)+(r+1)\\}=(n+1){}_nP_r$이다. 한편 ${}_{n+1}P_{r+1}=(n+1)n(n-1)\\cdots(n-r+1)=(n+1){}_nP_r$이므로 두 식은 같다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "중",
    "category": "조합으로 삼각형의 개수 세기",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "조합",
      "도형",
      "삼각형"
    ],
    "wide": false,
    "content": "다음 그림과 같이 직사각형 위에 같은 간격으로 놓인 $16$개의 점을 이어서 만들 수 있는 서로 다른 삼각형의 개수는? [4.6점]",
    "choices": [
      "$322$",
      "$468$",
      "$512$",
      "$560$",
      "$608$"
    ],
    "image": "assets/images/21_제일고_2학기_기말_고1_기출/q14.png",
    "answer": "③",
    "solution": "[키포인트] 세 점을 고르는 전체 경우에서 한 직선 위의 세 점을 고르는 경우를 뺀다.\n조건 정리: 위쪽과 아래쪽 변에는 각각 $6$개, 왼쪽과 오른쪽 변에는 각각 $4$개의 점이 놓여 있다.\n풀이 방향: ${}_{16}C_3$에서 같은 변 위의 세 점을 고르는 퇴화 경우를 제외한다.\n정석 풀이: $16$개 점 중 세 점을 고르는 방법은 ${}_{16}C_3=560$가지이다. 위·아래 변에서 세 점이 한 직선 위에 놓이는 경우는 $2\\times{}_6C_3=40$가지이고, 왼쪽·오른쪽 변에서는 $2\\times{}_4C_3=8$가지이다. 따라서 삼각형이 되는 경우는 $560-40-8=512$가지이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "조합의 성질",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "조합",
      "파스칼항등식"
    ],
    "wide": false,
    "content": "다음 식 ${}_{n+1}C_{n-2}+{}_{n+1}C_{n-1}=15n$을 만족하는 양의 정수 $n$의 값을 구하면? [5.2점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] ${}_{n+1}C_{n-2}={}_{n+1}C_3$, ${}_{n+1}C_{n-1}={}_{n+1}C_2$로 바꾼다.\n조건 정리: 조합의 대칭성과 파스칼의 성질을 사용할 수 있다.\n풀이 방향: 두 조합의 합을 하나의 조합으로 정리한다.\n정석 풀이: ${}_{n+1}C_3+{}_{n+1}C_2={}_{n+2}C_3$이므로 $\\dfrac{n(n+1)(n+2)}6=15n$이다. $n$은 양의 정수이므로 $n$으로 나누면 $(n+1)(n+2)=90$이다. 따라서 $n^2+3n-88=0$, 즉 $(n-8)(n+11)=0$이고 양의 정수 조건에서 $n=8$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "중",
    "category": "합집합의 원소의 개수",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "집합",
      "원소의개수",
      "포함배제"
    ],
    "wide": false,
    "content": "세 집합 $A,B,C$가 각각 $84,150,275$의 약수의 집합이라 할 때, $n(A\\cup B\\cup C)$를 구하면? [5.2점]",
    "choices": [
      "$6$",
      "$12$",
      "$18$",
      "$23$",
      "$27$"
    ],
    "answer": "④",
    "solution": "[키포인트] 각 약수 집합의 크기와 교집합은 최대공약수의 약수 개수로 구한다.\n조건 정리: $84=2^2\\cdot3\\cdot7$, $150=2\\cdot3\\cdot5^2$, $275=5^2\\cdot11$이다.\n풀이 방향: 포함배제 원리를 적용한다.\n정석 풀이: $n(A)=12$, $n(B)=12$, $n(C)=6$이다. $A\\cap B$는 $\\gcd(84,150)=6$의 약수 집합이므로 $4$개, $A\\cap C$는 $\\gcd(84,275)=1$의 약수 집합이므로 $1$개, $B\\cap C$는 $\\gcd(150,275)=25$의 약수 집합이므로 $3$개이다. 세 집합의 공통 원소는 $1$ 하나이다. 따라서 $n(A\\cup B\\cup C)=12+12+6-4-1-3+1=23$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-01-SET_COUNT",
    "subUnit": "집합의 원소의 개수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 17,
    "level": "중",
    "category": "계단 오르기 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의 수",
      "도형",
      "점화적계산"
    ],
    "wide": false,
    "content": "다음 그림과 같이 $8$단짜리 계단이 있다. 수지가 한 걸음에 한 단 또는 두 단을 올라갈 때, $8$단을 오르는 모든 경우의 수를 구하면? [4.6점]",
    "choices": [
      "$34$",
      "$35$",
      "$36$",
      "$37$",
      "$38$"
    ],
    "image": "assets/images/21_제일고_2학기_기말_고1_기출/q17.png",
    "answer": "①",
    "solution": "[키포인트] 마지막 걸음이 한 단인지 두 단인지로 나누면 점화식이 만들어진다.\n조건 정리: $n$단을 오르는 경우의 수를 $a_n$이라 하자.\n풀이 방향: 마지막에 한 단을 오르면 $a_{n-1}$, 두 단을 오르면 $a_{n-2}$의 경우가 앞에 온다.\n정석 풀이: $a_n=a_{n-1}+a_{n-2}$이고 $a_1=1$, $a_2=2$이다. 따라서 $a_3=3$, $a_4=5$, $a_5=8$, $a_6=13$, $a_7=21$, $a_8=34$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "함수의 최댓값과 최솟값",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "함수",
      "이차함수",
      "최댓값최솟값"
    ],
    "wide": false,
    "content": "이차함수 $f(x)$가 다음 조건을 만족시킨다.<div class='note-box'>(가) $f(-6)=0$<br>(나) 모든 실수 $x$에 대하여 $f(x)\\le f(-3)$이다.</div>실수 $p$에 대하여 $p\\le x\\le p+2$에서 함수 $f(x)$의 최솟값을 $g(p)$라 하자. 함수 $g(p)$의 최댓값이 $2$일 때, $f(2)$의 값은? [5점]",
    "choices": [
      "$-4$",
      "$-3$",
      "$-1$",
      "$-\\dfrac12$",
      "$-\\dfrac23$"
    ],
    "answer": "①",
    "solution": "[키포인트] 꼭짓점이 $x=-3$인 아래로 열린 이차함수에서 길이 $2$인 구간의 최솟값을 가장 크게 하려면 구간을 꼭짓점에 대칭으로 둔다.\n조건 정리: 모든 실수 $x$에 대해 $f(x)\\le f(-3)$이므로 축은 $x=-3$이고 아래로 열린다. $f(-6)=0$이므로 대칭인 다른 근은 $0$이다.\n풀이 방향: $f(x)=A x(x+6)$로 놓고 $g(p)$의 최댓값이 되는 구간을 찾는다.\n정석 풀이: $A\\lt0$이고 $f(x)=Ax(x+6)$이다. 길이 $2$인 구간에서 최솟값을 가장 크게 하려면 두 끝점이 축 $x=-3$에서 같은 거리에 있도록 $[-4,-2]$로 잡아야 한다. 이때 최솟값은 $f(-4)=f(-2)$이고 이것이 $g(p)$의 최댓값 $2$이다. 따라서 $f(-4)=A(-4)(2)=-8A=2$이므로 $A=-\\dfrac14$이다. 그러면 $f(2)=-\\dfrac14\\cdot2\\cdot8=-4$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 19,
    "level": "중",
    "category": "원의 평행이동과 좌표축 접선",
    "originalCategory": "도형의 이동",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-12",
    "standardUnit": "도형의 이동",
    "standardUnitOrder": 12,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형의이동",
      "원의방정식"
    ],
    "wide": false,
    "content": "서술형 1<br>좌표평면에서 두 양수 $a,b$에 대하여 원 $(x-a)^2+(y-b)^2=a^2$을 $x$축의 방향으로 $-10$만큼, $y$축의 방향으로 $3$만큼 평행이동한 원을 $C$라 하자. 원 $C$가 $x$축과 $y$축에 동시에 접할 때, $a,b$를 각각 구하시오. [4점]",
    "choices": [],
    "answer": "$a=5,\\ b=2$",
    "solution": "[키포인트] 평행이동한 원의 중심과 반지름을 먼저 구한 뒤 좌표축과의 접선 조건을 거리로 나타낸다.\n조건 정리: 원래 원의 중심은 $(a,b)$이고 반지름은 $a$이다. 평행이동 후 중심은 $(a-10,b+3)$이고 반지름은 그대로 $a$이다.\n풀이 방향: $x$축과 $y$축에 동시에 접하므로 중심에서 각 축까지의 거리가 모두 반지름 $a$와 같다.\n정석 풀이: $y$축까지의 거리는 $|a-10|$이므로 $|a-10|=a$이다. $a\\gt0$이므로 $10-a=a$가 되어 $a=5$이다. 또 $x$축까지의 거리는 $|b+3|$이고 $b\\gt0$이므로 $b+3\\gt0$이다. 따라서 $b+3=a=5$이므로 $b=2$이다.\n따라서 구하는 값은 $a=5$, $b=2$이다.",
    "solutionImage": "assets/images/21_제일고_2학기_기말_고1_기출/q19-solution.svg",
    "solutionImageAlt": "도형의 이동 문항 19의 핵심 관계를 표시한 해설 도형",
    "solutionImageCaption": "풀이에 필요한 점·도형·관계를 좌표평면에 표시한 해설 자료",
    "solutionImageSize": "full",
    "subUnitKey": "H15-SA-12-TRANSLATION",
    "subUnit": "평행이동",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 20,
    "level": "중",
    "category": "합성함수의 역함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수",
      "합성함수",
      "역함수"
    ],
    "wide": false,
    "content": "서술형 2<br>정의역이 $\\{x\\mid x\\ge1\\}$인 두 함수 $f(x)=\\dfrac1{x+3}$, $g(x)=\\sqrt{2(x-1)}$에 대하여 $(f\\circ g)^{-1}\\left(\\dfrac17\\right)$의 값을 구하시오. [6점]",
    "choices": [],
    "answer": "$9$",
    "solution": "[키포인트] 역함수의 함숫값은 원래 합성함수에서 대응하는 입력값을 찾는 문제로 바꾼다.\n조건 정리: $(f\\circ g)^{-1}\\left(\\dfrac17\\right)=x$라면 $(f\\circ g)(x)=\\dfrac17$이다.\n풀이 방향: 먼저 $f(g(x))=\\dfrac17$에서 $g(x)$를 구한 뒤 $x$를 구한다.\n정석 풀이: $\\dfrac1{g(x)+3}=\\dfrac17$이므로 $g(x)+3=7$, 즉 $g(x)=4$이다. 따라서 $\\sqrt{2(x-1)}=4$이고 양변을 제곱하면 $2(x-1)=16$이다. 그러므로 $x=9$이다. $9\\ge1$이고 $g(9)=4\\ge1$이므로 합성함수의 정의 조건도 만족한다.\n따라서 구하는 값은 $9$이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 21,
    "level": "중",
    "category": "배수 조건의 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "경우의수",
      "배수",
      "조합"
    ],
    "wide": false,
    "content": "서술형 3<br>$0$부터 $9$까지 숫자가 있다. 다음 물음에 답하여라. [총 5점]<br>(1) 중복을 허용하지 않고 $0$부터 $9$까지 숫자를 뽑아 두 자리 자연수를 만들고자 한다. $3$의 배수가 되는 경우의 수를 구하시오. [3점]<br>(2) 중복을 허용하지 않고 $0$부터 $9$까지 숫자 중 $3$개의 숫자를 뽑아 곱하였을 때, 짝수가 되는 경우의 수를 구하시오. (단, $0$은 짝수로 생각한다.) [2점]",
    "choices": [],
    "answer": "$(1)\\ 27,\\ (2)\\ 110$",
    "solution": "[키포인트] (1)은 $3$으로 나눈 나머지에 따라 두 자리 수의 두 숫자를 분류하고, (2)는 전체에서 곱이 홀수인 경우를 빼면 된다.\n조건 정리: 나머지가 $0$인 숫자는 $\\{0,3,6,9\\}$, 나머지가 $1$인 숫자는 $\\{1,4,7\\}$, 나머지가 $2$인 숫자는 $\\{2,5,8\\}$이다.\n풀이 방향: (1) 십의 자리와 일의 자리의 나머지 합이 $0$이 되는 경우를 센다. (2) 세 수의 곱이 홀수인 경우는 세 수가 모두 홀수일 때뿐이다.\n정석 풀이: (1) 십의 자리가 나머지 $0$인 경우에는 $0$을 쓸 수 없으므로 $3$가지이고, 일의 자리는 같은 나머지 $0$인 숫자 중 다른 숫자 $3$가지이므로 $3\\times3=9$가지이다. 십의 자리의 나머지가 $1$이면 일의 자리 나머지는 $2$여야 하므로 $3\\times3=9$가지이고, 반대로 $2$와 $1$인 경우도 $9$가지이다. 따라서 $9+9+9=27$가지이다. (2) 서로 다른 숫자 $3$개를 고르는 전체 경우는 ${}_{10}C_3=120$가지이다. 곱이 홀수이려면 $\\{1,3,5,7,9\\}$의 $5$개 홀수 중 $3$개를 골라야 하므로 ${}_5C_3=10$가지이다. 따라서 곱이 짝수인 경우는 $120-10=110$가지이다.\n따라서 (1)의 경우의 수는 $27$이고, (2)의 경우의 수는 $110$이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "상",
    "category": "구간함수의 합성함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수",
      "합성함수",
      "구간함수"
    ],
    "wide": false,
    "content": "서술형 4<br>실수 전체의 집합에서 정의된 함수 $f(x)=\\begin{cases}-x&(x\\lt0)\\\\-x^2+4x&(x\\ge0)\\end{cases}$에 대하여 $(f\\circ f)(a)=f(a)$를 만족시키는 모든 실수 $a$의 값의 합을 구하시오. [5점]",
    "choices": [],
    "answer": "$5$",
    "solution": "[키포인트] $f(f(a))=f(a)$는 $f(a)$가 함수 $f$의 고정점이라는 뜻이다.\n조건 정리: 먼저 $f(t)=t$를 만족하는 실수 $t$를 구한 뒤 $f(a)=t$의 원상을 찾는다.\n풀이 방향: 고정점과 그 고정점의 원상을 구간별로 나눈다.\n정석 풀이: $t\\lt0$에서는 $f(t)=-t$이므로 $-t=t$에서 $t=0$이 나오지만 $t\\lt0$을 만족하지 않는다. $t\\ge0$에서는 $-t^2+4t=t$이므로 $t(-t+3)=0$, 따라서 고정점은 $t=0,3$이다. 이제 $f(a)=0$ 또는 $f(a)=3$을 푼다. $a\\lt0$에서는 $f(a)=-a$이므로 $f(a)=3$에서 $a=-3$만 얻는다. $a\\ge0$에서는 $-a^2+4a=0$에서 $a=0,4$, $-a^2+4a=3$에서 $a=1,3$을 얻는다. 따라서 모든 $a$는 $-3,0,1,3,4$이고 그 합은 $-3+0+1+3+4=5$이다.\n따라서 구하는 값은 $5$이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  }
];
