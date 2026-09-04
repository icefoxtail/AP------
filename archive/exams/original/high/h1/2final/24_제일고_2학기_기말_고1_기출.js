window.examTitle = "24_제일고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "약수의 개수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$120$의 양의 약수의 개수는? [4.0점]",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "③",
    "solution": "[키포인트] 자연수의 약수의 개수는 소인수분해한 각 소인수의 지수에 $1$을 더하여 곱한다.\n$120=2^3\\times3^1\\times5^1$이다.\n따라서 양의 약수의 개수는 $(3+1)(1+1)(1+1)=16$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 2,
    "level": "하",
    "category": "명제와 집합",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 조건 $p$, $q$의 진리집합을 각각 $P$, $Q$라고 하자. $p\\Rightarrow\\sim q$일 때, 다음 중 항상 옳은 것은? [4.1점]",
    "choices": [
      "$P\\cap Q=\\varnothing$",
      "$P\\cup Q=Q$",
      "$P^C\\subset Q$",
      "$Q-P=\\varnothing$",
      "$P-Q=\\varnothing$"
    ],
    "answer": "①",
    "solution": "[키포인트] 명제 $p\\Rightarrow\\sim q$를 진리집합의 포함 관계로 바꾼다.\n$p$가 참이면 $q$가 거짓이므로 $P\\subset Q^C$이다.\n따라서 $P$와 $Q$에는 공통 원소가 없어서 $P\\cap Q=\\varnothing$이다. 다른 포함 관계는 주어진 조건만으로 항상 성립하지 않는다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 3,
    "level": "중",
    "category": "명제의 추론",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "네 조건 $p,q,r,s$에 대하여 $p\\Rightarrow q$, $r\\Rightarrow\\sim q$, $s\\Rightarrow r$이라고 할 때, 보기 중 옳지 않은 것은? [4.2점]",
    "choices": [
      "$p\\Rightarrow\\sim r$",
      "$r\\Rightarrow\\sim p$",
      "$p\\Rightarrow\\sim s$",
      "$s\\Rightarrow\\sim q$",
      "$q\\Rightarrow s$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 서로 모순되는 결론을 이용하고, 주어진 명제를 연쇄적으로 연결한다.\n$p\\Rightarrow q$이고 $r\\Rightarrow\\sim q$이므로 $p$와 $r$은 동시에 참일 수 없다. 따라서 $p\\Rightarrow\\sim r$, $r\\Rightarrow\\sim p$가 성립한다.\n또한 $s\\Rightarrow r$이므로 $p\\Rightarrow\\sim s$이고, $s\\Rightarrow r\\Rightarrow\\sim q$이다. 그러나 $q$가 참이라고 해서 $s$가 참이라는 결론은 얻을 수 없다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 4,
    "level": "중",
    "category": "부등식과 명제",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "명제 '어떤 실수 $x$에 대하여 $x^2-2x+k-1\\lt0$이다.'의 부정이 참일 때 실수 $k$의 최솟값은? [4.4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "[키포인트] 존재 명제의 부정은 모든 실수에 대한 명제로 바뀐다.\n주어진 명제의 부정은 모든 실수 $x$에 대하여 $x^2-2x+k-1\\ge0$이라는 뜻이다.\n$x^2-2x+k-1=(x-1)^2+k-2$이므로 모든 실수 $x$에서 음이 아닌 조건은 $k-2\\ge0$이다. 따라서 $k\\ge2$이고 최솟값은 $2$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 5,
    "level": "중",
    "category": "이웃하여 세우는 순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "파란모자를 쓴 학생 3명과 빨간모자를 쓴 학생 2명을 포함하여 7명의 학생이 일렬로 줄을 설 때, 같은 색의 모자를 쓴 학생끼리 이웃하여 서는 경우의 수는? [4.4점]",
    "choices": [
      "$7!$",
      "$5!\\times2!$",
      "$3!\\times2!\\times2!$",
      "$4!\\times3!\\times2!$",
      "$3!\\times3!\\times2!\\times2!$"
    ],
    "answer": "④",
    "solution": "[키포인트] 같은 색 모자를 쓴 학생들을 각각 하나의 묶음으로 본다.\n파란모자 학생 3명의 묶음, 빨간모자 학생 2명의 묶음, 나머지 학생 2명을 합하면 모두 $4$개의 대상을 배열한다. 따라서 묶음의 배열은 $4!$가지이다.\n파란모자 묶음 안의 순서는 $3!$가지, 빨간모자 묶음 안의 순서는 $2!$가지이므로 전체 경우의 수는 $4!\\times3!\\times2!$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "필요조건",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 조건 $p:x^2-2x-8\\lt0$, $q:x^2\\le a$에 대하여 $p$는 $q$이기 위한 필요조건일 때 정수 $a$의 최댓값은? [4.5점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] 필요조건은 명제의 방향을 뒤집어 진리집합의 포함관계로 확인한다.\n조건 정리: $p:x^2-2x-8\\lt0$의 진리집합은 $P=(-2,4)$이다. $q:x^2\\le a$의 진리집합을 $Q$라 하자.\n정석 풀이: $p$가 $q$이기 위한 필요조건이므로 $q\\to p$, 즉 $Q\\subset P$여야 한다. 먼저 $a\\lt0$이면 $x^2\\le a$를 만족하는 실수가 없으므로 $Q=\\varnothing$이고, 이 경우에는 포함관계가 공허하게 성립한다. 그러나 음의 정수들은 최댓값을 결정하지 않는다.\n$a\\ge0$이면 $Q=[-\\sqrt a,\\sqrt a]$이다. 이 구간이 $(-2,4)$에 포함되려면 양 끝점이 각각 $-2$보다 크고 $4$보다 작아야 하며, 대칭이므로 $\\sqrt a\\lt2$이면 충분하다. 따라서 $a\\lt4$이고, 정수 $a$의 최댓값은 $3$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-02-NECESSARY_SUFFICIENT",
    "subUnit": "필요조건과 충분조건",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 7,
    "level": "중",
    "category": "색칠하는 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "image": "assets/images/24_제일고_2학기_기말_고1_기출/q7.png",
    "content": "오른쪽 그림과 같은 5개의 영역에 서로 다른 4가지 색 중 전부 혹은 일부를 사용하여 인접한 영역을 서로 다른 색으로 칠하는 방법의 수를 구하면? [4.6점]",
    "choices": [
      "$72$",
      "$76$",
      "$80$",
      "$84$",
      "$88$"
    ],
    "answer": "①",
    "solution": "[키포인트] 바깥 영역까지 포함하여 인접 관계를 확인한 뒤 순서대로 색을 정한다.\n바깥 영역의 색은 $4$가지이고, 이를 정한 뒤 안쪽에서는 그 색을 제외한 $3$가지 색을 사용한다. 안쪽의 $A,B,C,D$는 차례로 한 바퀴를 이루는 인접 구조이다.\n$A$는 $3$가지, $B$는 $2$가지이다. $C=A$이면 $D$는 $2$가지이고, $C$가 $A,B$와 다른 나머지 색이면 $D$는 $1$가지이다. 따라서 안쪽 색칠은 $3\\times2\\times(2+1)=18$가지이다.\n전체 경우의 수는 $4\\times18=72$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_APPLICATION",
    "subUnit": "경우의 수의 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "중",
    "category": "부분집합의 개수",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "전체집합이 $U=\\{1,2,3,4,5\\}$의 공집합이 아닌 부분집합 $P$에 대하여 명제 '집합 $P$의 어떤 원소는 소수이다.'가 참이 되도록 하는 집합 $P$의 개수는? [4.7점]",
    "choices": [
      "$20$",
      "$22$",
      "$24$",
      "$26$",
      "$28$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 전체 부분집합에서 소수를 하나도 포함하지 않는 부분집합을 뺀다.\n$U$의 소수는 $2,3,5$이고 소수가 아닌 원소는 $1,4$이다. 공집합이 아닌 부분집합은 $2^5-1=31$개이다.\n소수를 하나도 포함하지 않는 공집합이 아닌 부분집합은 $\\{1\\}$, $\\{4\\}$, $\\{1,4\\}$의 $3$개이다. 따라서 구하는 개수는 $31-3=28$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-01-SET_BASIC",
    "subUnit": "집합의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "코시-슈바르츠 부등식",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$x,y$가 양수이고 $x+2y=3$일 때, $\\dfrac1x+\\dfrac2y$의 최솟값은? [4.8점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] 코시-슈바르츠 부등식으로 주어진 합과 구하려는 식을 연결한다.\n$\\dfrac1x+\\dfrac2y=\\dfrac{1^2}{x}+\\dfrac{2^2}{2y}$이므로\n$\\left(\\dfrac1x+\\dfrac2y\\right)(x+2y)\\ge(1+2)^2=9$이다.\n$x+2y=3$이므로 $\\dfrac1x+\\dfrac2y\\ge3$이고, 등호는 $x=y=1$일 때 성립한다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 10,
    "level": "하",
    "category": "유리식의 항등식",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "분모가 0이 되지 않도록 하는 모든 실수 $x$에 대하여 등식 $\\dfrac2{x-1}-\\dfrac3{x+2}-\\dfrac4{x^2+x-2}=\\dfrac{ax+b}{x^2+x-2}$가 성립할 때, $a+b$의 값은? [4.1점]",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "④",
    "solution": "[키포인트] 공통분모 $x^2+x-2=(x-1)(x+2)$로 통분하여 분자를 비교한다.\n좌변의 분자는 $2(x+2)-3(x-1)-4$이다.\n$2(x+2)-3(x-1)-4=2x+4-3x+3-4=-x+3$이므로 $a=-1$, $b=3$이다.\n따라서 $a+b=2$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
    "level": "중",
    "category": "유리함수의 대칭과 역함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{bx+c}{x+a}$의 그래프가 두 직선 $y=x+1$과 $y=-x+5$에 대하여 각각 대칭이고, 그 역함수의 그래프는 점 $(10,3)$을 지난다. 이때, 상수 $a,b,c$의 곱 $abc$의 값은? [4.2점]",
    "choices": [
      "$-6$",
      "$-4$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "①",
    "solution": "[키포인트] 유리함수의 중심과 두 대칭축을 이용해 $a,b$를 정한 뒤 역함수의 점을 원함수의 점으로 바꾼다.\n$y=\\dfrac{bx+c}{x+a}=b+\\dfrac{c-ab}{x+a}$이므로 그래프의 중심은 $(-a,b)$이고 대칭축은 $y-b=\\pm(x+a)$이다.\n따라서 $a+b=1$, $b-a=5$이므로 $a=-2$, $b=3$이다. 역함수의 그래프가 $(10,3)$을 지나므로 원함수의 그래프는 $(3,10)$을 지난다.\n$10=\\dfrac{3b+c}{3+a}=9+c$이므로 $c=1$이다. 따라서 $abc=(-2)\\times3\\times1=-6$이다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/images/24_제일고_2학기_기말_고1_기출/q11-solution.svg",
    "solutionImageAlt": "유리함수와 역함수 대칭축을 나타낸 해설 그래프",
    "solutionImageCaption": "중심 (2,3), 두 대칭축, 역함수 대응점 (10,3)을 확인한다.",
    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "함수 $f(x)=-\\sqrt{2x+4}+1$의 그래프에 대한 설명으로 옳지 않은 것은? [4.3점]",
    "choices": [
      "정의역은 $\\{x\\mid x\\ge-2\\}$이다.",
      "치역은 $\\{y\\mid y\\le1\\}$이다.",
      "함수 $y=-\\sqrt{2x}$의 그래프를 $x$축의 방향으로 2만큼, $y$축의 방향으로 1만큼 평행이동한 것이다.",
      "제1사분면을 지나지 않는다.",
      "$f^{-1}(x)=\\dfrac12(x-1)^2-2$ $(x\\le1)$이다."
    ],
    "answer": "③",
    "solution": "[키포인트] 식을 $f(x)=-\\sqrt{2(x+2)}+1$로 고쳐 그래프의 이동과 정의역을 확인한다.\n정의역은 $x\\ge-2$, 치역은 $y\\le1$이다. $y=-\\sqrt{2x}$의 그래프를 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $1$만큼 이동한 그래프이므로 ③의 설명이 틀렸다.\n또한 $x\\gt0$이면 $f(x)\\lt0$이므로 제1사분면을 지나지 않는다. $y=-\\sqrt{2x+4}+1$을 $x$에 대하여 풀면 $x=\\dfrac12(y-1)^2-2$이고 역함수의 정의역은 $x\\le1$이다.\n따라서 정답은 ③이다.",

    "solutionImage": "assets/images/24_제일고_2학기_기말_고1_기출/q12-solution.svg",

    "solutionImageAlt": "무리함수의 끝점·절편·정의역을 나타낸 해설 그래프",

    "solutionImageCaption": "끝점 (−2,1), x절편 (−3/2,0), 정의역과 치역을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "중",
    "category": "유리함수와 사분면",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{4x-2k+15}{x+3}$의 그래프가 제4사분면을 지나지 않도록 하는 모든 자연수 $k$의 개수는? [4.4점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "[키포인트] 제4사분면에서는 $x\\gt0$, $y\\lt0$이므로 $x\\gt0$에서 함수값이 음수가 되지 않을 조건을 구한다.\n$x\\gt0$이면 $x+3\\gt0$이므로 함수값의 부호는 분자 $4x-2k+15$의 부호와 같다.\n$x\\gt0$에서 항상 $4x-2k+15\\ge0$이려면 $x$가 $0$에 가까워질 때도 음수가 아니어야 하므로 $15-2k\\ge0$이어야 한다. 따라서 자연수 $k$는 $1,2,\\ldots,7$이다.\n그 개수는 $7$이다.\n따라서 정답은 ④이다.",

    "solutionImage": "assets/images/24_제일고_2학기_기말_고1_기출/q13-solution.svg",

    "solutionImageAlt": "유리함수의 점근선과 사분면 조건을 나타낸 해설 그래프",

    "solutionImageCaption": "k=4 대표 그래프와 자연수 k=1,…,7 조건을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "상",
    "category": "무리함수의 부등식",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$1\\le x\\le6$에서 $ax+1\\le-\\sqrt{x+3}+5\\le bx+1$이 항상 성립할 때, 상수 $a,b$에 대하여 $a-b$의 최댓값은? [4.5점]",
    "choices": [
      "$\\dfrac{11}{6}$",
      "$-\\dfrac{11}{6}$",
      "$0$",
      "$\\dfrac{13}{6}$",
      "$-\\dfrac{13}{6}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 부등식을 각각 $a$, $b$에 관한 조건으로 바꾸고 구간에서의 최솟값과 최댓값을 찾는다.\n$x\\gt0$이므로 $ax+1\\le5-\\sqrt{x+3}$은 $a\\le\\dfrac{4-\\sqrt{x+3}}{x}$이고, $5-\\sqrt{x+3}\\le bx+1$은 $b\\ge\\dfrac{4-\\sqrt{x+3}}{x}$이다. $R(x)=\\dfrac{4-\\sqrt{x+3}}{x}$라 하자.\n$1\\le x\\le6$에서 $R(x)\\le2$이다. 실제로 $\\sqrt{x+3}\\ge2$이므로 $4-\\sqrt{x+3}\\le2\\le2x$이고, $x=1$에서 등호가 성립한다. 따라서 $R$의 최댓값은 $2$이다.\n또한 $R(x)\\ge\\dfrac16$이다. 이는 $24-x\\ge6\\sqrt{x+3}$과 동치이고, 양변을 제곱하면 $(24-x)^2-36(x+3)=(x-6)(x-78)\\ge0$이 된다. $x=6$에서 등호가 성립하므로 $R$의 최솟값은 $\\dfrac16$이다.\n따라서 가능한 가장 큰 $a$는 $\\dfrac16$, 가장 작은 $b$는 $2$이므로 $a-b$의 최댓값은 $\\dfrac16-2=-\\dfrac{11}{6}$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "무리함수의 변환",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $y=\\sqrt{2x+4}$의 그래프를 $x$축의 방향으로 3만큼, $y$축의 방향으로 $-1$만큼 평행이동한 후, $y$축에 대하여 대칭이동한 함수의 그래프는 점 $(k,3)$을 지난다. 이때 상수 $k$의 값은? [4.6점]",
    "choices": [
      "$9$",
      "$7$",
      "$-3$",
      "$-7$",
      "$-9$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 평행이동과 $y$축 대칭을 식에 차례로 반영한다.\n먼저 $x$축의 방향으로 $3$, $y$축의 방향으로 $-1$만큼 이동하면 $y=\\sqrt{2(x-3)+4}-1=\\sqrt{2x-2}-1$이다.\n이를 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 넣어 $y=\\sqrt{-2x-2}-1$이 된다. 점 $(k,3)$을 지나므로 $3=\\sqrt{-2k-2}-1$이다.\n$\\sqrt{-2k-2}=4$에서 $-2k-2=16$이므로 $k=-9$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "중",
    "category": "유리함수의 평행이동",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{ax+b}{x+c}$의 그래프의 점근선의 방정식이 $x=3$, $y=-2$이고, 평행이동에 의하여 함수 $y=-\\dfrac3x$의 그래프와 겹쳐질 수 있을 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값은? [4.7점]",
    "choices": [
      "$-8$",
      "$8$",
      "$6$",
      "$4$",
      "$-2$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 점근선으로 $a,c$를 정하고, 표준형의 분자 상수를 비교한다.\n수직점근선이 $x=-c=3$이므로 $c=-3$이고, 수평점근선이 $y=a=-2$이므로 $a=-2$이다.\n따라서 $y=\\dfrac{-2x+b}{x-3}=-2+\\dfrac{b-6}{x-3}$이다. 이 그래프가 평행이동으로 $y=-\\dfrac3x$와 겹치려면 분수 부분의 상수가 $-3$이어야 하므로 $b-6=-3$, 즉 $b=3$이다.\n$a+b+c=-2+3-3=-2$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "유리함수와 대칭 직선",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{3x+5}{x-1}$의 그래프가 직선 $y=ax+b$ $(a\\gt0)$에 대하여 대칭이고, $f(x)$의 그래프와 이 직선의 교점을 A, B라 할 때, 두 점 A, B 사이의 거리를 구하면? [4.7점]",
    "choices": [
      "$3\\sqrt7$",
      "$8$",
      "$5\\sqrt3$",
      "$4\\sqrt5$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] 유리함수를 표준형으로 바꾸어 양의 기울기를 갖는 대칭축을 찾고 교점을 계산한다.\n$f(x)=3+\\dfrac8{x-1}$이므로 중심은 $(1,3)$이고 대칭축은 $y-3=\\pm(x-1)$이다. $a\\gt0$이므로 구하는 직선은 $y=x+2$이다.\n교점의 $x$좌표는 $\\dfrac{3x+5}{x-1}=x+2$에서 구한다. 정리하면 $x^2-2x-7=0$이므로 $x=1\\pm2\\sqrt2$이다.\n직선 위에서 두 교점은 $(1-2\\sqrt2,3-2\\sqrt2)$, $(1+2\\sqrt2,3+2\\sqrt2)$이다. 따라서 두 점 사이의 거리는 $\\sqrt{(4\\sqrt2)^2+(4\\sqrt2)^2}=8$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "무리함수와 거리",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "image": "assets/images/24_제일고_2학기_기말_고1_기출/q18.png",
    "content": "다음 그림과 같이 세 곡선 $y=\\sqrt{x}+3$, $y=\\sqrt{x}$, $y=\\sqrt{x-3}$이 직선 $y=-x+k$와 만나는 점을 각각 A, B, C라 하고 $\\overline{AB}=2\\overline{BC}$일 때 상수 $k$의 값은? [4.8점]",
    "choices": [
      "$\\dfrac{13}{4}$",
      "$\\dfrac72$",
      "$\\dfrac{15}{4}$",
      "$4$",
      "$\\dfrac{17}{4}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 세 교점이 기울기 $-1$인 한 직선 위에 있으므로 선분 길이의 비는 $x$좌표 차의 비와 같다.\n점 A에서 $t=\\sqrt{x_A}$라 하면 $k=t^2+t+3$이다. 점 C에서 $u=\\sqrt{x_C-3}$라 하면 $k=u^2+u+3$이므로 $t=u$이고 $x_C=x_A+3$이다.\n$\\overline{AB}=2\\overline{BC}$이므로 $x_B-x_A=2(x_C-x_B)$이다. $x_C=x_A+3$을 대입하면 $x_B=x_A+2=t^2+2$이다. $s=\\sqrt{x_B}$라 하면 $s^2=t^2+2$이고, 점 B의 조건에서 $k=s^2+s$이다.\n$t^2+t+3=s^2+s$와 $s^2=t^2+2$를 함께 쓰면 $s=t+1$이다. 따라서 $(t+1)^2=t^2+2$이므로 $t=\\dfrac12$이다.\n$k=t^2+t+3=\\dfrac14+\\dfrac12+3=\\dfrac{15}{4}$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH",
    "subUnit": "무리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "중",
    "category": "최댓값과 최솟값",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "$x,y$가 실수이고 $x^2+y^2=5$일 때, $x+2y$의 최댓값과 최솟값이 되는 조건을 구하는 과정을 서술하시오. [4점]",
    "choices": [],
    "answer": "최댓값 $5$는 $(x,y)=(1,2)$일 때, 최솟값 $-5$는 $(x,y)=(-1,-2)$일 때",
    "solution": "[키포인트] 코시-슈바르츠 부등식의 등호 조건까지 확인한다.\n$(x+2y)^2\\le(x^2+y^2)(1^2+2^2)=5\\times5=25$이므로 $-5\\le x+2y\\le5$이다.\n최댓값의 등호는 $(x,y)$가 $(1,2)$와 같은 방향이고 $x^2+y^2=5$를 만족할 때 성립하므로 $(x,y)=(1,2)$이다. 최솟값의 등호는 반대 방향일 때 성립하므로 $(x,y)=(-1,-2)$이다.\n따라서 최댓값은 $5$이고 $(x,y)=(1,2)$일 때, 최솟값은 $-5$이고 $(x,y)=(-1,-2)$일 때이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 20,
    "level": "중",
    "category": "귀류법",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "명제 '$m,n$이 자연수일 때, $m^2+n^2$이 홀수이면 $mn$은 짝수이다'가 참임을 귀류법을 이용하여 증명하시오. [5점]",
    "choices": [],
    "answer": "참",
    "solution": "[키포인트] 결론의 부정을 가정하여 주어진 조건과 모순됨을 보인다.\n$m^2+n^2$이 홀수인데 $mn$이 홀수라고 가정하자. 곱 $mn$이 홀수이면 $m,n$은 모두 홀수이다.\n홀수의 제곱은 홀수이므로 $m^2$과 $n^2$은 모두 홀수이고, 두 홀수의 합 $m^2+n^2$은 짝수이다. 이는 $m^2+n^2$이 홀수라는 가정과 모순이다.\n따라서 $mn$이 홀수라는 가정은 거짓이므로 $mn$은 짝수이다. 따라서 주어진 명제는 참이다.",
    "subUnitKey": "H15-SB-02-PROOF",
    "subUnit": "증명과 절대부등식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 21,
    "level": "중",
    "category": "역함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac{2x+3}{4x-5}$의 역함수 구하는 과정을 서술하고 역함수의 정의역과 치역을 구하시오. [5점]",
    "choices": [],
    "answer": "$f^{-1}(x)=\\dfrac{5x+3}{4x-2}$, 정의역 $\\mathbb{R}\\setminus\\left\\{\\dfrac12\\right\\}$, 치역 $\\mathbb{R}\\setminus\\left\\{\\dfrac54\\right\\}$",
    "solution": "[키포인트] $y=f(x)$에서 $x$와 $y$의 관계를 풀어 $x$를 $y$의 식으로 나타낸다.\n$y=\\dfrac{2x+3}{4x-5}$에서 $4xy-5y=2x+3$이므로 $(4y-2)x=5y+3$이다. 따라서 $x=\\dfrac{5y+3}{4y-2}$이다.\n$x$와 $y$를 바꾸면 $f^{-1}(x)=\\dfrac{5x+3}{4x-2}$이다. 원함수의 치역은 $y\\ne\\dfrac12$이므로 역함수의 정의역은 $\\mathbb{R}\\setminus\\left\\{\\dfrac12\\right\\}$이다. 원함수의 정의역은 $x\\ne\\dfrac54$이므로 역함수의 치역은 $\\mathbb{R}\\setminus\\left\\{\\dfrac54\\right\\}$이다.\n따라서 $f^{-1}(x)=\\dfrac{5x+3}{4x-2}$이고, 정의역은 $\\mathbb{R}\\setminus\\left\\{\\dfrac12\\right\\}$, 치역은 $\\mathbb{R}\\setminus\\left\\{\\dfrac54\\right\\}$이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "상",
    "category": "무리함수와 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "solutionImage": "assets/images/24_제일고_2학기_기말_고1_기출/q22-solution.svg",
    "solutionImageAlt": "n=3일 때 두 무리함수와 x=3, x=9가 만드는 점 A, C, D, B의 사다리꼴",
    "solutionImageCaption": "n=3일 때 사각형 ACDB의 두 평행한 변 AB와 CD",
    "solutionImageSize": "medium",
    "content": "두 함수 $f(x)=\\sqrt{3x}$, $g(x)=\\sqrt{x}$의 그래프와 직선 $x=n$이 만나는 점을 각각 A, B라 하고, 직선 $x=n+6$이 만나는 점을 각각 C, D라 할 때, 사각형 ACDB의 넓이가 $6\\sqrt3$일 때, $n$의 값을 구하는 과정을 서술하시오. (단, $n$은 자연수) [6점]",
    "choices": [],
    "answer": "$3$",
    "solution": "[키포인트] 점의 둘레 순서를 A-C-D-B로 잡으면 AB와 CD가 평행한 사다리꼴이 된다.\n$x=n$에서 위쪽 점 A와 아래쪽 점 B 사이의 길이는 $AB=\\sqrt{3n}-\\sqrt n=(\\sqrt3-1)\\sqrt n$이다. $x=n+6$에서 위쪽 점 C와 아래쪽 점 D 사이의 길이는 $CD=(\\sqrt3-1)\\sqrt{n+6}$이다. 두 평행선 $x=n$, $x=n+6$ 사이의 거리는 $6$이다.\n따라서 사각형 ACDB의 넓이는 $\\dfrac12\\times6\\times(AB+CD)=3(\\sqrt3-1)(\\sqrt n+\\sqrt{n+6})$이다. 이 값이 $6\\sqrt3$이므로 $\\sqrt n+\\sqrt{n+6}=3+\\sqrt3$이다.\n양변에서 $\\sqrt n$을 뺀 뒤 제곱하면 $n+6=(3+\\sqrt3)^2+n-2(3+\\sqrt3)\\sqrt n$이다. 정리하면 $2(3+\\sqrt3)\\sqrt n=6(1+\\sqrt3)$이고, $\\sqrt n=\\sqrt3$이므로 $n=3$이다.\n따라서 구하는 값은 $3$이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH",
    "subUnit": "무리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
