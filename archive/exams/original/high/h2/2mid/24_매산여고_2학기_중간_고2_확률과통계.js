(()=>{
const unit={3:["확률의 뜻과 활용",3],4:["조건부확률",4],5:["확률분포",5]};
const q=(id,level,category,key,content,choices,answer,solution,extra={})=>({
  id,level,category,originalCategory:category,standardCourse:"확률과 통계",
  standardUnitKey:`H15-PS-0${key}`,standardUnit:unit[key][0],standardUnitOrder:unit[key][1],
  questionType:choices.length?"객관식":"서술형",layoutTag:"grid",
  tags:[choices.length?"객관식":"서술형",category],wide:false,content,choices,answer,solution,...extra
});
window.examTitle="24_매산여고_2학기_중간_고2_확률과통계";
window.questionBank=[
  {
    "id": 1,
    "level": "하",
    "category": "확률의 계산",
    "originalCategory": "확률의 계산",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "확률의 계산"
    ],
    "wide": false,
    "content": "흰 공 $4$개, 검은 공 $3$개가 들어 있는 주머니에서 임의로 $4$개의 공을 동시에 꺼낼 때, 흰 공이 나올 확률을 구하면? [3.5점]",
    "choices": [
      "0",
      "$\\dfrac17$",
      "$\\dfrac15$",
      "$\\dfrac13$",
      "1"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 검은 공의 개수보다 많이 꺼내면 흰 공이 반드시 섞이므로 여사건이 공집합이다.\n조건 정리: 흰 공 $4$개, 검은 공 $3$개에서 $4$개를 동시에 꺼낸다.\n풀이 방향: 흰 공이 하나도 나오지 않는 경우가 가능한지 따져 여사건의 확률을 구한다.\n정석 풀이: 흰 공이 하나도 나오지 않으려면 꺼낸 $4$개가 모두 검은 공이어야 하는데, 검은 공은 $3$개뿐이므로 그런 경우는 존재하지 않는다. 즉 여사건의 확률이 $0$이므로 구하는 확률은 $1-0=1$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-PS-03-PROBABILITY_BASIC",
    "subUnit": "확률의 뜻과 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 2,
    "level": "하",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조건부확률",
      "표"
    ],
    "wide": false,
    "content": "아래 표는 어느 학교의 $A,B$ 두 학급 학생들에 대하여 통학 수단을 조사하여 나타낸 것이다. 두 학급 전체 $50$명의 학생 중에서 임의로 뽑은 한 명이 버스로 통학하는 학생이었을 때, 그 학생이 $A$학급 학생일 확률을 구하면? [3.5점]",
    "choices": [
      "$\\dfrac13$",
      "$\\dfrac23$",
      "$\\dfrac25$",
      "$\\dfrac35$",
      "$\\dfrac14$"
    ],
    "answer": "③",
    "solution": "[키포인트] 버스로 통학한다는 조건에서 $A$학급 학생일 조건부확률을 구한다.\n조건 정리: 버스로 통학하는 사건을 $C$라 하면 표에서 $C$에 해당하는 학생은 모두 $30$명이고, 그중 $A$학급 학생은 $12$명이다.\n풀이 방향: 조건이 주어진 사건 $C$를 새로운 전체집합으로 보고 비율을 구한다.\n정석 풀이: 구하는 확률은 $P(A\\mid C)=\\dfrac{P(A\\cap C)}{P(C)}$이고, 표의 도수를 그대로 쓰면 $\\dfrac{12}{30}=\\dfrac25$이다.\n따라서 정답은 ③이다.",
    "image": "assets/images/24_매산여고_2학기_중간_고2_확률과통계/q2.png",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 3,
    "level": "하",
    "category": "독립사건",
    "originalCategory": "독립사건",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "독립사건"
    ],
    "wide": false,
    "content": "두 사건 $A,B$가 서로 독립이고 $P(A)+P(B)=1$, $P(A\\cap B^c)=\\dfrac19$일 때, $P(B)$의 값은? (단, $B^c$은 $B$의 여사건이다.) [3.6점]",
    "choices": [
      "$\\dfrac23$",
      "$\\dfrac12$",
      "$\\dfrac13$",
      "$\\dfrac14$",
      "$\\dfrac16$"
    ],
    "answer": "①",
    "solution": "[키포인트] $A$와 $B$가 독립이면 $A$와 $B^c$도 독립이므로 $P(A\\cap B^c)=P(A)P(B^c)$이다.\n조건 정리: $P(A)+P(B)=1$이므로 $P(B^c)=1-P(B)=P(A)$이다.\n풀이 방향: $P(A)=p$로 놓으면 주어진 확률이 $p^2$ 꼴이 된다.\n정석 풀이: $P(A)=p$라 하면 $P(B)=1-p$이고 $P(B^c)=p$이다. 독립이므로\n$P(A\\cap B^c)=P(A)P(B^c)=p\\times p=p^2=\\dfrac19$이고 $p\\gt 0$이므로 $p=\\dfrac13$이다. 따라서 $P(B)=1-\\dfrac13=\\dfrac23$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
    "level": "하",
    "category": "이항분포",
    "originalCategory": "이항분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이항분포"
    ],
    "wide": false,
    "content": "한 개의 동전을 $50$번 던질 때, 앞면이 나오는 횟수를 확률변수 $X$라 하자. $X$의 분산 $V(X)$의 값을 구하면? [3.6점]",
    "choices": [
      "25",
      "4",
      "1",
      "$\\dfrac{25}{2}$",
      "$\\dfrac{25}{4}$"
    ],
    "answer": "④",
    "solution": "[키포인트] 독립시행의 횟수는 이항분포를 따르고 분산은 $npq$이다.\n조건 정리: 동전을 $50$번 던지므로 $X\\sim\\mathrm B\\left(50,\\dfrac12\\right)$이다.\n풀이 방향: 이항분포의 분산 공식에 대입한다.\n정석 풀이: $V(X)=npq=50\\times\\dfrac12\\times\\dfrac12=\\dfrac{50}4=\\dfrac{25}2$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-PS-05-BINOMIAL_NORMAL",
    "subUnit": "이항분포와 정규분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "하",
    "category": "확률질량함수",
    "originalCategory": "확률질량함수",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "확률질량함수"
    ],
    "wide": false,
    "content": "확률변수 $X$의 확률질량함수가 $P(X=x)=\\dfrac{2a-x}{30}$ $(x=1,2,3,4)$일 때, 상수 $a$의 값을 구하면? [3.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 확률질량함수의 모든 값의 합은 $1$이다.\n조건 정리: $P(X=x)=\\dfrac{2a-x}{30}$ $(x=1,2,3,4)$이다.\n풀이 방향: 네 확률을 모두 더해 $1$과 같게 놓는다.\n정석 풀이: $\\displaystyle\\sum_{x=1}^{4}\\dfrac{2a-x}{30}=\\dfrac{8a-(1+2+3+4)}{30}=\\dfrac{8a-10}{30}=1$이므로 $8a-10=30$, 즉 $a=5$이다.\n(이때 각 확률은 $\\dfrac9{30},\\dfrac8{30},\\dfrac7{30},\\dfrac6{30}$으로 모두 양수이므로 조건에 맞다.)\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-PS-05-PROBABILITY_DISTRIBUTION",
    "subUnit": "확률분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "이산확률변수",
    "originalCategory": "이산확률변수",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이산확률변수"
    ],
    "wide": false,
    "content": "어느 고등학교에 남학생 $4$명과 여학생 $5$명으로 구성된 교육 봉사 동아리가 있다. 이 동아리에서 $3$명을 임의로 뽑으려고 한다. 뽑힌 학생 중에서 남학생 수를 확률변수 $X$라고 할 때, 남학생이 $2$명 이상 뽑힐 확률은 $\\dfrac{b}{a}$이다. $a+b$의 값을 구하면? (단, $a,b$는 서로소인 정수) [3.7점]",
    "choices": [
      "56",
      "57",
      "58",
      "59",
      "60"
    ],
    "answer": "④",
    "solution": "[키포인트] 비복원으로 동시에 뽑으므로 각 확률을 조합으로 계산한다.\n조건 정리: 남학생 $4$명, 여학생 $5$명에서 $3$명을 뽑으므로 전체 경우는 $\\binom93=84$가지이고, 남학생이 $2$명 이상인 경우는 $X=2$ 또는 $X=3$이다.\n풀이 방향: 두 경우의 수를 더해 확률을 기약분수로 만든 뒤 분모와 분자를 더한다.\n정석 풀이: $X=2$인 경우는 $\\binom42\\binom51=6\\times5=30$가지, $X=3$인 경우는 $\\binom43\\binom50=4$가지이므로\n$P(X\\ge2)=\\dfrac{30+4}{84}=\\dfrac{34}{84}=\\dfrac{17}{42}$이다.\n따라서 $\\dfrac ba=\\dfrac{17}{42}$에서 $a=42$, $b=17$이므로 $a+b=59$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-PS-05-RANDOM_VARIABLE",
    "subUnit": "확률변수와 기댓값",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "중",
    "category": "확률분포의 평균",
    "originalCategory": "확률분포의 평균",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "확률분포의 평균",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$의 확률분포를 표로 나타내면 다음과 같다. $E(X)$를 구하면? [3.8점]",
    "choices": [
      "$\\dfrac{47}{9}$",
      "$\\dfrac{44}{9}$",
      "$\\dfrac{34}{9}$",
      "$\\dfrac{25}{9}$",
      "$\\dfrac29$"
    ],
    "answer": "②",
    "solution": "[키포인트] 확률의 총합이 $1$임을 이용해 미지수 $a$를 먼저 정한다.\n조건 정리: 표에서 $X$의 값은 $2,4,6,8$이고 대응하는 확률은 차례로 $a$, $\\dfrac19$, $a$, $\\dfrac29$이다.\n풀이 방향: 확률의 합에서 $a$를 구한 뒤 $E(X)=\\sum xP(X=x)$를 계산한다.\n정석 풀이: $a+\\dfrac19+a+\\dfrac29=1$에서 $2a=1-\\dfrac13=\\dfrac23$이므로 $a=\\dfrac13$이다. 따라서\n$E(X)=2\\times\\dfrac13+4\\times\\dfrac19+6\\times\\dfrac13+8\\times\\dfrac29=\\dfrac69+\\dfrac49+\\dfrac{18}9+\\dfrac{16}9=\\dfrac{44}9$이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/24_매산여고_2학기_중간_고2_확률과통계/q7.png",
    "subUnitKey": "H15-PS-05-PROBABILITY_DISTRIBUTION",
    "subUnit": "확률분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조건부확률"
    ],
    "wide": false,
    "content": "두 사건 $A,B$에 대하여 $P(A)=\\dfrac14$, $P(B)=\\dfrac23$, $P(B\\mid A)=\\dfrac13$일 때, $P(B^c\\mid A^c)$의 값을 구하면? (단, $A^c$은 $A$의 여사건) [3.8점]",
    "choices": [
      "$\\dfrac13$",
      "$\\dfrac23$",
      "$\\dfrac59$",
      "$\\dfrac29$",
      "$\\dfrac16$"
    ],
    "answer": "④",
    "solution": "[키포인트] $P(A^c\\cap B^c)=1-P(A\\cup B)$(드모르간)를 이용하면 분자를 쉽게 구할 수 있다.\n조건 정리: $P(A)=\\dfrac14$, $P(B)=\\dfrac23$, $P(B\\mid A)=\\dfrac13$이다.\n풀이 방향: 곱셈정리로 $P(A\\cap B)$를 구해 $P(A\\cup B)$를 얻은 뒤 조건부확률의 정의에 넣는다.\n정석 풀이: $P(A\\cap B)=P(A)P(B\\mid A)=\\dfrac14\\times\\dfrac13=\\dfrac1{12}$이므로\n$P(A\\cup B)=\\dfrac14+\\dfrac23-\\dfrac1{12}=\\dfrac{3+8-1}{12}=\\dfrac{10}{12}=\\dfrac56$이다.\n따라서 $P(A^c\\cap B^c)=1-\\dfrac56=\\dfrac16$이고 $P(A^c)=1-\\dfrac14=\\dfrac34$이므로\n$P(B^c\\mid A^c)=\\dfrac{1/6}{3/4}=\\dfrac16\\times\\dfrac43=\\dfrac29$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 9,
    "level": "중",
    "category": "여사건과 배반사건",
    "originalCategory": "여사건과 배반사건",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여사건과 배반사건"
    ],
    "wide": false,
    "content": "두 사건 $A,B$에 대하여 $A$와 $B^c$는 서로 배반사건이고 $P(A)=\\dfrac13$, $P(A^c\\cap B)=\\dfrac16$일 때, $P(B^c)$의 값을 구하면? (단, $A^c$은 $A$의 여사건, $B^c$은 $B$의 여사건이다.) [3.9점]",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac7{12}$",
      "$\\dfrac23$",
      "$\\dfrac34$",
      "$\\dfrac56$"
    ],
    "answer": "①",
    "solution": "[키포인트] $A$와 $B^c$가 배반이면 $A\\cap B^c=\\varnothing$이므로 $A\\subset B$이다.\n조건 정리: $P(A)=\\dfrac13$, $P(A^c\\cap B)=\\dfrac16$이다.\n풀이 방향: $B$를 서로 배반인 두 부분으로 쪼개어 $P(B)$를 구한다.\n정석 풀이: $A\\subset B$이므로 $B=A\\cup(A^c\\cap B)$이고 두 사건은 서로 배반이다. 따라서\n$P(B)=P(A)+P(A^c\\cap B)=\\dfrac13+\\dfrac16=\\dfrac12$이므로 $P(B^c)=1-\\dfrac12=\\dfrac12$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-PS-03-PROBABILITY_BASIC",
    "subUnit": "확률의 뜻과 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
    "category": "확률과 정수 조건",
    "originalCategory": "확률과 정수 조건",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "확률과 정수 조건"
    ],
    "wide": false,
    "content": "$n$이 $20$ 이하의 자연수일 때, $x$에 대한 이차방정식 $6x^2-5nx+n^2=0$의 정수해가 존재할 확률을 구하면? [4.0점]",
    "choices": [
      "$\\dfrac3{20}$",
      "$\\dfrac{13}{20}$",
      "$\\dfrac3{10}$",
      "$\\dfrac25$",
      "$\\dfrac12$"
    ],
    "answer": "②",
    "solution": "[키포인트] 이차방정식을 인수분해하면 두 근이 $n$의 간단한 식으로 나온다.\n조건 정리: $6x^2-5nx+n^2=(2x-n)(3x-n)$이므로 두 근은 $\\dfrac n2$와 $\\dfrac n3$이다.\n풀이 방향: 정수해가 존재할 조건을 $n$의 배수 조건으로 바꾸고, $20$ 이하의 개수를 포함배제로 센다.\n정석 풀이: 정수해가 존재하려면 $\\dfrac n2$ 또는 $\\dfrac n3$이 정수여야 하므로 $n$이 $2$의 배수이거나 $3$의 배수이면 된다. $20$ 이하의 자연수 중 $2$의 배수는 $10$개, $3$의 배수는 $6$개, $6$의 배수는 $3$개이므로 포함배제에 의해 $10+6-3=13$개이다. 따라서 구하는 확률은 $\\dfrac{13}{20}$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-PS-03-PROBABILITY_BASIC",
    "subUnit": "확률의 뜻과 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
    "level": "중",
    "category": "베이즈 정리",
    "originalCategory": "베이즈 정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "베이즈 정리"
    ],
    "wide": false,
    "content": "주머니 $A$에는 흰 공 $3$개와 검은 공 $2$개가 들어 있고, 주머니 $B$에는 흰 공 $2$개와 검은 공 $3$개가 들어 있다. 한 개의 주사위를 한 번 던져서 나오는 눈의 수가 $6$이면 주머니 $A$에서 임의로 한 개의 공을 꺼내고, 나오는 눈의 수가 $6$이 아니면 주머니 $B$에서 임의로 한 개의 공을 꺼낸다. 이 시행에서 꺼낸 공이 흰 공일 때, 이 공이 주머니 $A$에서 꺼낸 공일 확률을 $\\dfrac{n}{m}$이라 하자. 이때 두 상수의 합 $m+n$의 값을 구하면? (단, $m$과 $n$은 서로소인 자연수) [4.0점]",
    "choices": [
      "12",
      "13",
      "14",
      "15",
      "16"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 원인이 여러 개인 결과가 주어졌을 때의 확률이므로 조건부확률(베이즈 정리)로 계산한다.\n조건 정리: 주사위 눈이 $6$일 확률은 $\\dfrac16$이고 이때 주머니 $A$에서, 나머지 확률 $\\dfrac56$으로 주머니 $B$에서 공을 꺼낸다. $A$의 흰 공 비율은 $\\dfrac35$, $B$의 흰 공 비율은 $\\dfrac25$이다.\n풀이 방향: $P(A\\cap W)$와 $P(W)$를 각각 구해 나눈다.\n정석 풀이: $P(A\\cap W)=\\dfrac16\\times\\dfrac35=\\dfrac1{10}$이고 $P(B\\cap W)=\\dfrac56\\times\\dfrac25=\\dfrac13$이므로\n$P(W)=\\dfrac1{10}+\\dfrac13=\\dfrac{3+10}{30}=\\dfrac{13}{30}$이다. 따라서\n$P(A\\mid W)=\\dfrac{1/10}{13/30}=\\dfrac{3/30}{13/30}=\\dfrac3{13}$이다. 원문에서 이 확률을 $\\dfrac{n}{m}$이라 하였으므로 $n=3$, $m=13$이고 $m+n=16$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "독립사건",
    "originalCategory": "독립사건",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "독립사건"
    ],
    "wide": false,
    "content": "어느 고등학교 $1$, $2$학년 학생들을 대상으로 스터디 카페 이용 경험에 대하여 조사하였더니, $1$학년 학생 중에서 이용 경험이 없는 학생은 $75$명이고, $2$학년 학생 중에서 이용 경험이 있는 학생은 $40$명, 없는 학생은 $50$명이었다. 조사한 학생 중에서 임의로 택한 $1$명의 학생이 $1$학년 학생인 사건과 스터디 카페 이용 경험이 있는 학생인 사건이 서로 독립일 때, 스터디 카페 이용 경험이 있는 $1$학년 학생 수를 구하면? [4.1점]",
    "choices": [
      "30",
      "45",
      "60",
      "75",
      "90"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 사건이 독립이면 교집합의 확률은 두 사건의 확률의 곱과 같다.\n조건 정리: $1$학년인 사건을 $A$, 스터디 카페 이용 경험이 있는 사건을 $B$라 하고, 이용 경험이 있는 $1$학년 학생 수를 $x$라 하자. 전체 학생 수는 $x+75+40+50=x+165$, $1$학년 학생 수는 $x+75$, 이용 경험이 있는 학생 수는 $x+40$이다.\n풀이 방향: 독립 조건 $P(A\\cap B)=P(A)P(B)$를 도수로 나타내어 $x$를 구한다.\n정석 풀이: $\\dfrac{x}{x+165}=\\dfrac{x+75}{x+165}\\times\\dfrac{x+40}{x+165}$이므로 $x(x+165)=(x+75)(x+40)$이다. 전개하면 $x^2+165x=x^2+115x+3000$이므로 $50x=3000$, 따라서 $x=60$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "상",
    "category": "독립사건의 구성",
    "originalCategory": "독립사건의 구성",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "독립사건의 구성"
    ],
    "wide": false,
    "content": "한 개의 주사위를 던지는 시행에서 눈의 수가 $5$의 약수인 사건을 $A$라 하자. 이 시행의 사건 $B$에 대하여 다음 &lt;조건&gt;을 만족시키는 모든 사건 $B$의 개수를 구하면? [4.2점]<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">&lt;조건&gt;<br>(가) $P(A\\cup B)=\\dfrac{2}{3}$<br>(나) 두 사건 $A$와 $B$는 서로 독립이다.</div>",
    "choices": [
      "4",
      "6",
      "8",
      "9",
      "12"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 독립 조건과 합사건의 확률에서 $P(B)$와 $P(A\\cap B)$가 모두 정해지므로 $B$의 원소 개수가 결정된다.\n조건 정리: $5$의 약수인 눈은 $1$과 $5$이므로 $A=\\{1,5\\}$이고 $P(A)=\\dfrac26=\\dfrac13$이다.\n풀이 방향: 독립을 이용해 $P(A\\cup B)$를 $P(B)$로 나타내 $P(B)$를 구하고, $|A\\cap B|$를 정한 뒤 경우의 수를 센다.\n정석 풀이: 독립이므로 $P(A\\cap B)=P(A)P(B)$이고\n$P(A\\cup B)=P(A)+P(B)-P(A)P(B)=\\dfrac13+\\dfrac23P(B)=\\dfrac23$\n에서 $P(B)=\\dfrac12$이다. 즉 $B$의 원소는 $6\\times\\dfrac12=3$개이다. 또 $P(A\\cap B)=\\dfrac13\\times\\dfrac12=\\dfrac16$이므로 $A\\cap B$의 원소는 $1$개이다. 즉 $B$는 $A=\\{1,5\\}$에서 정확히 $1$개, 나머지 $\\{2,3,4,6\\}$에서 $2$개를 택해 만들어야 하므로 그 개수는\n$\\binom21\\binom42=2\\times6=12$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "중",
    "category": "기댓값의 성질",
    "originalCategory": "기댓값의 성질",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "기댓값의 성질"
    ],
    "wide": false,
    "content": "흰 공 $3$개, 검은 공 $1$개, 파란 공 $2$개가 들어 있는 주머니에서 임의로 $3$개의 공을 동시에 꺼낼 때, 나오는 흰 공의 개수를 확률변수 $X$라 하자. 이때 $E\\left(\\dfrac32X+3\\right)$은? [4.2점]",
    "choices": [
      "$\\dfrac{13}{4}$",
      "$\\dfrac{21}{4}$",
      "$\\dfrac{35}{4}$",
      "$\\dfrac{41}{4}$",
      "6"
    ],
    "answer": "②",
    "solution": "[키포인트] $E(aX+b)=aE(X)+b$이므로 $E(X)$만 구하면 된다.\n조건 정리: 흰 공 $3$개를 포함한 $6$개에서 $3$개를 꺼낼 때 흰 공의 개수가 $X$이다.\n풀이 방향: 각 공이 뽑힐 확률이 같음을 이용해 평균을 간단히 구한다.\n정석 풀이: 흰 공 하나하나가 뽑힐 확률은 모두 $\\dfrac36=\\dfrac12$이므로, 기댓값의 성질에 의해 $E(X)=3\\times\\dfrac12=\\dfrac32$이다. 따라서\n$E\\left(\\dfrac32X+3\\right)=\\dfrac32E(X)+3=\\dfrac32\\times\\dfrac32+3=\\dfrac94+3=\\dfrac{21}4$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-PS-05-RANDOM_VARIABLE",
    "subUnit": "확률변수와 기댓값",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "이항분포",
    "originalCategory": "이항분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이항분포"
    ],
    "wide": false,
    "content": "한 개의 주사위를 $9$번 던질 때 홀수의 눈이 $6$번 이상 나올 확률을 구하면? [4.3점]",
    "choices": [
      "$\\dfrac{23}{256}$",
      "$\\dfrac{17}{64}$",
      "$\\dfrac{39}{256}$",
      "$\\dfrac{65}{256}$",
      "$\\dfrac12$"
    ],
    "answer": "④",
    "solution": "[키포인트] 주사위에서 홀수의 눈이 나올 확률은 $\\dfrac12$이므로 횟수는 $\\mathrm B\\left(9,\\dfrac12\\right)$을 따른다.\n조건 정리: $6$번 이상이므로 $X=6,7,8,9$인 경우를 모두 더한다.\n풀이 방향: 확률이 모두 $\\left(\\dfrac12\\right)^9$로 같으므로 조합의 합만 계산하면 된다.\n정석 풀이: $P(X=k)=\\binom9k\\left(\\dfrac12\\right)^9$이므로\n$P(X\\ge6)=\\dfrac{\\binom96+\\binom97+\\binom98+\\binom99}{2^9}=\\dfrac{84+36+9+1}{512}=\\dfrac{130}{512}=\\dfrac{65}{256}$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-PS-05-BINOMIAL_NORMAL",
    "subUnit": "이항분포와 정규분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "분산의 성질",
    "originalCategory": "분산의 성질",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "분산의 성질"
    ],
    "wide": false,
    "content": "이산확률변수 $X$의 확률질량함수가 $P(X=x)=\\begin{cases}a&(x=0)\\\\\\dfrac1x+b&(x=1,2)\\end{cases}$이고, $3P(X=0)=P(X=1)+P(X=2)$가 성립할 때, 확률변수 $X$에 대하여 $-2V(2X-3)$의 값을 구하면? [4.3점]",
    "choices": [
      "$-\\dfrac{13}{2}$",
      "$-\\dfrac{13}{4}$",
      "$-\\dfrac{23}{8}$",
      "$-\\dfrac{29}{8}$",
      "$-\\dfrac{23}{16}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 확률의 총합이 $1$이라는 조건과 주어진 관계식을 연립해 $a$, $b$를 정한다.\n조건 정리: $P(X=0)=a$, $P(X=1)=1+b$, $P(X=2)=\\dfrac12+b$이다.\n풀이 방향: 두 조건에서 $a$, $b$를 구해 확률분포를 완성한 뒤 분산을 계산하고 $V(aX+b)=a^2V(X)$를 쓴다.\n정석 풀이: 확률의 합에서 $a+(1+b)+\\left(\\dfrac12+b\\right)=1$이므로 $a+2b=-\\dfrac12$이다. 또 $3P(X=0)=P(X=1)+P(X=2)$에서 $3a=\\dfrac32+2b$이므로 $3a-2b=\\dfrac32$이다. 두 식을 더하면 $4a=1$이므로 $a=\\dfrac14$이고 $b=-\\dfrac38$이다. 즉\n$P(X=0)=\\dfrac14$, $P(X=1)=\\dfrac58$, $P(X=2)=\\dfrac18$이다(합은 $1$).\n$E(X)=0\\times\\dfrac14+1\\times\\dfrac58+2\\times\\dfrac18=\\dfrac78$, $E(X^2)=1\\times\\dfrac58+4\\times\\dfrac18=\\dfrac98$이므로\n$V(X)=\\dfrac98-\\left(\\dfrac78\\right)^2=\\dfrac{72-49}{64}=\\dfrac{23}{64}$이다.\n따라서 $V(2X-3)=2^2V(X)=\\dfrac{23}{16}$이고 $-2V(2X-3)=-\\dfrac{23}8$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-PS-05-PROBABILITY_DISTRIBUTION",
    "subUnit": "확률분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "확률질량함수",
    "originalCategory": "확률질량함수",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "확률질량함수"
    ],
    "wide": false,
    "content": "확률변수 $X$의 확률질량함수가 $P(X=x)=\\dfrac{a}{x(x+1)}$ $(x=5,6,7,\\ldots,39)$일 때, $P(X=20)+P(X=21)+P(X=22)+\\cdots+P(X=29)$의 값을 구하면? (단, $a$는 상수) [4.3점]",
    "choices": [
      "$\\dfrac1{21}$",
      "$\\dfrac2{21}$",
      "$\\dfrac17$",
      "$\\dfrac4{21}$",
      "$\\dfrac5{21}$"
    ],
    "answer": "②",
    "solution": "[키포인트] $\\dfrac1{x(x+1)}=\\dfrac1x-\\dfrac1{x+1}$로 분해하면 합이 양 끝만 남는다.\n조건 정리: $P(X=x)=\\dfrac a{x(x+1)}$ $(x=5,6,\\ldots,39)$이고 확률의 총합은 $1$이다.\n풀이 방향: 부분분수로 $a$를 정한 뒤 같은 방법으로 구간의 확률을 구한다.\n정석 풀이: $\\displaystyle\\sum_{x=5}^{39}\\left(\\dfrac1x-\\dfrac1{x+1}\\right)=\\dfrac15-\\dfrac1{40}=\\dfrac{8-1}{40}=\\dfrac7{40}$이므로 $\\dfrac{7a}{40}=1$에서 $a=\\dfrac{40}7$이다. 같은 방법으로\n$P(X=20)+P(X=21)+\\cdots+P(X=29)=a\\sum_{x=20}^{29}\\left(\\dfrac1x-\\dfrac1{x+1}\\right)=a\\left(\\dfrac1{20}-\\dfrac1{30}\\right)=\\dfrac{40}7\\times\\dfrac1{60}=\\dfrac2{21}$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-PS-05-PROBABILITY_DISTRIBUTION",
    "subUnit": "확률분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "이차식의 양수 조건",
    "originalCategory": "이차식의 양수 조건",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차식의 양수 조건"
    ],
    "wide": false,
    "content": "한 개의 주사위를 두 번 던져서 나오는 눈의 수를 차례로 $a,b$라 할 때, 두 함수 $f(x),g(x)$는 $f(x)=ax^2+4bx+a$, $g(x)=bx^2+2ax$이다. 이때 모든 실수 $x$에 대하여 $f(x)\\gt g(x)$일 확률을 구하면? [4.4점]",
    "choices": [
      "$\\dfrac13$",
      "$\\dfrac{11}{36}$",
      "$\\dfrac{13}{36}$",
      "$\\dfrac7{18}$",
      "$\\dfrac5{12}$"
    ],
    "answer": "①",
    "solution": "[키포인트] 이차함수가 항상 양수일 조건은 최고차항의 계수가 양수이고 판별식이 음수인 것이다.\n조건 정리: $f(x)-g(x)=(a-b)x^2+(4b-2a)x+a$이고 $a$, $b$는 $1$부터 $6$까지의 자연수이다.\n풀이 방향: 두 조건을 정리해 $a$와 $b$의 부등식으로 바꾼 뒤 순서쌍의 개수를 센다.\n정석 풀이: 모든 실수 $x$에서 $f(x)\\gt g(x)$이려면 $a-b\\gt 0$이고 판별식이 음수여야 한다.\n$D=(4b-2a)^2-4(a-b)a=4\\{(2b-a)^2-a(a-b)\\}=4(4b^2-4ab+a^2-a^2+ab)=4b(4b-3a)$\n이고 $b\\gt 0$이므로 $D\\lt 0$은 $4b-3a\\lt 0$, 즉 $3a\\gt 4b$와 같다. 이때 $a\\gt\\dfrac{4b}3\\gt b$이므로 $a\\gt b$는 자동으로 성립한다.\n$b=1$이면 $a\\ge2$로 $5$개, $b=2$이면 $a\\ge3$으로 $4$개, $b=3$이면 $a\\ge5$로 $2$개, $b=4$이면 $a=6$으로 $1$개이고 $b\\ge5$이면 없다. 따라서 순서쌍은 $5+4+2+1=12$개이고 확률은 $\\dfrac{12}{36}=\\dfrac13$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-PS-03-PROBABILITY_APPLICATION",
    "subUnit": "확률의 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "상",
    "category": "조건부확률과 경우의 수",
    "originalCategory": "조건부확률과 경우의 수",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조건부확률과 경우의 수"
    ],
    "wide": false,
    "content": "$2$ 이상 $52$ 이하의 모든 짝수인 $26$개의 자연수 중에서 임의로 서로 다른 두 개의 수를 선택한다. 선택한 두 개의 수의 곱이 $100$의 배수일 때, 두 수의 합이 $60$ 이상일 확률을 $\\dfrac{n}{m}$이라 하자. 이때, 두 상수의 합 $m+n$의 값을 구하면? (단, $m$과 $n$은 서로소인 자연수) [4.5점]",
    "choices": [
      "54",
      "55",
      "56",
      "57",
      "58"
    ],
    "answer": "①",
    "solution": "[키포인트] 조건이 주어진 사건(곱이 $100$의 배수)을 새로운 전체집합으로 삼는 조건부확률이다.\n조건 정리: $2$부터 $52$까지의 짝수는 $26$개이고, 두 짝수의 곱이 $100=2^2\\times5^2$의 배수가 되려면 두 수의 소인수 $5$가 모두 합쳐 $2$개 이상이어야 한다($2$의 지수는 두 수가 짝수이므로 이미 충분하다).\n풀이 방향: 곱이 $100$의 배수인 쌍을 모두 찾은 뒤, 그중 합이 $60$ 미만인 쌍만 세어 여사건으로 처리한다.\n정석 풀이: 짝수 중 $5$의 배수는 $10,20,30,40,50$이고 그중 $50$만 $5^2$을 갖는다. 따라서 곱이 $100$의 배수인 쌍은 (i) $50$과 나머지 짝수 하나인 $25$쌍, (ii) $\\{10,20,30,40\\}$에서 두 개를 택한 $\\binom42=6$쌍으로 모두 $25+6=31$쌍이다.\n이 중 합이 $60$ 미만인 것은 $(2,50)$, $(4,50)$, $(6,50)$, $(8,50)$, $(10,20)$, $(10,30)$, $(10,40)$, $(20,30)$의 $8$쌍이므로, 합이 $60$ 이상인 쌍은 $31-8=23$쌍이다. 따라서 구하는 확률은 $\\dfrac{23}{31}$이고 $n=23$, $m=31$이므로 $m+n=54$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-PS-04-CONDITIONAL_PROBABILITY",
    "subUnit": "conditional probability",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
    "category": "이항분포",
    "originalCategory": "이항분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이항분포"
    ],
    "wide": false,
    "content": "한 개의 주사위를 사용하여 다음 규칙에 따라 점수를 얻는 시행을 한다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">(가) 주사위를 한 번 던져서 나온 눈의 수가 $3$의 배수이면 $A$는 $2$점을 얻고, $B$는 $2$점을 잃는다.<br>(나) 주사위를 한 번 던져서 나온 눈의 수가 $3$의 배수가 아니면 $A$는 $1$점을 얻고, $B$는 $4$점을 얻는다.</div>이 시행을 $5$번 반복할 때, $B$가 얻은 점수의 합이 $A$가 얻은 점수의 합보다 클 확률을 구하면? [4.6점]",
    "choices": [
      "$\\dfrac{112}{243}$",
      "$\\dfrac{160}{243}$",
      "$\\dfrac{64}{81}$",
      "$\\dfrac{66}{81}$",
      "$\\dfrac{232}{243}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 사람의 점수를 성공 횟수 $X$의 일차식으로 나타내면 부등식이 $X$에 대한 조건이 된다.\n조건 정리: $3$의 배수의 눈은 $3,6$이므로 한 번의 성공확률은 $\\dfrac26=\\dfrac13$이고 $X\\sim\\mathrm B\\left(5,\\dfrac13\\right)$이다.\n풀이 방향: $A$와 $B$의 총점을 $X$로 나타내고 $B\\gt A$를 $X$에 대한 부등식으로 바꾼다.\n정석 풀이: $5$번 중 $3$의 배수가 $X$번 나왔다고 하면\n$A$의 총점은 $2X+1\\times(5-X)=X+5$이고, $B$의 총점은 $-2X+4\\times(5-X)=20-6X$이다.\n$B\\gt A$에서 $20-6X\\gt X+5$, 즉 $7X\\lt 15$이므로 $X\\le2$이다. 따라서\n$P(X\\le2)=\\sum_{k=0}^{2}\\binom5k\\left(\\dfrac13\\right)^k\\left(\\dfrac23\\right)^{5-k}=\\dfrac{32+5\\times16+10\\times8}{243}=\\dfrac{192}{243}=\\dfrac{64}{81}$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-PS-05-BINOMIAL_NORMAL",
    "subUnit": "이항분포와 정규분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
    "level": "중",
    "category": "초기하분포",
    "originalCategory": "초기하분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "초기하분포",
      "표"
    ],
    "wide": false,
    "content": "[서술형 1] [6점](부분점수 있음)<br>불량품 $2$개가 포함된 $8$개의 제품 중에서 임의로 $2$개의 제품을 택할 때, 나오는 불량품의 개수를 확률변수 $X$라 하자. 다음을 구하는 풀이과정과 답을 서술하시오.<br>(1) $X$의 확률질량함수를 구하시오. [2점]<br>(2) $X$의 확률분포를 표로 나타내는 풀이과정과 답을 서술하시오. [2점]<br>(3) $X$의 평균을 구하시오. [2점]",
    "choices": [],
    "answer": "$P(0)=\\dfrac{15}{28}$, $P(1)=\\dfrac37$, $P(2)=\\dfrac1{28}$, $E(X)=\\dfrac12$",
    "solution": "[키포인트] 비복원으로 동시에 뽑으므로 각 확률은 조합으로 계산한다(초기하분포).\n조건 정리: 불량품 $2$개와 정상품 $6$개, 모두 $8$개에서 $2$개를 택하므로 전체 경우는 $\\binom82=28$가지이고 $X=0,1,2$이다.\n풀이 방향: 확률질량함수를 조합으로 세운 뒤 각 값을 계산해 표로 정리하고 평균을 구한다.\n정석 풀이: 확률질량함수는 $P(X=x)=\\dfrac{\\binom2x\\binom6{2-x}}{\\binom82}$ $(x=0,1,2)$이고, 각 값은\n$P(X=0)=\\dfrac{\\binom20\\binom62}{28}=\\dfrac{15}{28}$, $P(X=1)=\\dfrac{\\binom21\\binom61}{28}=\\dfrac{12}{28}=\\dfrac37$, $P(X=2)=\\dfrac{\\binom22\\binom60}{28}=\\dfrac1{28}$\n이다(합은 $\\dfrac{15+12+1}{28}=1$).\n확률분포를 표로 나타내면 다음과 같다.\n<table class=\"question-table\"><thead><tr><th>$X$</th><th>$0$</th><th>$1$</th><th>$2$</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$\\dfrac{15}{28}$</td><td>$\\dfrac{3}{7}$</td><td>$\\dfrac{1}{28}$</td><td>$1$</td></tr></tbody></table>\n따라서 $E(X)=0\\times\\dfrac{15}{28}+1\\times\\dfrac{12}{28}+2\\times\\dfrac1{28}=\\dfrac{14}{28}=\\dfrac12$이다.\n따라서 구하는 값은 $E(X)=\\dfrac12$이다.",
    "subUnitKey": "H15-PS-05-PROBABILITY_DISTRIBUTION",
    "subUnit": "확률분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "중",
    "category": "평균과 분산",
    "originalCategory": "평균과 분산",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "평균과 분산"
    ],
    "wide": false,
    "content": "[서술형 2] [7점](부분점수 있음)<br>이산확률변수 $X$에 대하여 $P(X=2)=1-P(X=0)$, $0\\lt P(X=0)\\lt 1$, $\\{E(X)\\}^2=3V(X)$을 만족시킨다. 다음을 구하는 풀이과정과 답을 서술하시오.<br>(1) 확률변수 $X$가 가질 수 있는 변수를 구하시오. [2점]<br>(2) 확률 $P(X=2)$의 값을 구하고 풀이과정과 답을 서술하시오. [5점]",
    "choices": [],
    "answer": "$X=0,2$, $P(X=2)=\\dfrac34$",
    "solution": "[키포인트] 두 확률의 합이 $1$이므로 $X$가 가질 수 있는 값은 $0$과 $2$뿐이다.\n조건 정리: $P(X=2)=1-P(X=0)$이고 $0\\lt P(X=0)\\lt 1$이므로 두 값 모두 확률이 양수이다.\n풀이 방향: $p=P(X=2)$로 놓고 평균과 분산을 $p$로 나타낸 뒤 주어진 관계식을 푼다.\n정석 풀이: $P(X=0)+P(X=2)=1$이므로 $X$가 가질 수 있는 값은 $0$과 $2$이다. $p=P(X=2)$라 하면\n$E(X)=0\\times(1-p)+2\\times p=2p$, $E(X^2)=4p$이므로 $V(X)=4p-(2p)^2=4p(1-p)$이다.\n$\\{E(X)\\}^2=3V(X)$에서 $4p^2=12p(1-p)$이고, $0\\lt p\\lt 1$이므로 양변을 $4p$로 나누면 $p=3(1-p)$, 즉 $4p=3$에서 $p=\\dfrac34$이다.\n따라서 구하는 값은 $X$가 가질 수 있는 값이 $0$과 $2$이고 $P(X=2)=\\dfrac34$이다.",
    "subUnitKey": "H15-PS-05-BINOMIAL_NORMAL",
    "subUnit": "이항분포와 정규분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "level": "상",
    "category": "이항분포의 평균과 분산",
    "originalCategory": "이항분포의 평균과 분산",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "이항분포의 평균과 분산"
    ],
    "wide": false,
    "content": "[서술형 3] [7점](부분점수 있음)<br>수직선의 원점에 점 $P$가 있다. 한 개의 주사위를 $2$번 던지는 시행에서 나오는 눈의 수의 차가 $4$의 약수이면 점 $P$를 양의 방향으로 $2$만큼 이동시키고, $4$의 약수가 아니면 점 $P$를 음의 방향으로 $4$만큼 이동시킨다. 이 시행을 $40$회 반복한 후 점 $P$의 좌표를 확률변수 $X$라 할 때, $E(X^2)$의 값을 구하고 그 과정을 자세히 서술하시오.",
    "choices": [],
    "answer": "$520$",
    "solution": "[키포인트] 이동 횟수가 이항분포를 따르므로 좌표를 성공 횟수의 일차식으로 나타낸 뒤 $E(X^2)=V(X)+\\{E(X)\\}^2$을 쓴다.\n조건 정리: $4$의 약수는 $1,2,4$이므로 두 눈의 차가 $1$, $2$, $4$인 경우를 세면 각각 $10$가지, $8$가지, $4$가지로 모두 $22$가지이고, 한 시행의 성공확률은 $\\dfrac{22}{36}=\\dfrac{11}{18}$이다.\n풀이 방향: 성공 횟수 $Y$로 좌표 $X$를 나타내고 $Y$의 평균과 분산에서 $X$의 평균과 분산을 구한다.\n정석 풀이: 성공 횟수를 $Y$라 하면 $Y\\sim\\mathrm B\\left(40,\\dfrac{11}{18}\\right)$이고\n$X=2Y-4(40-Y)=6Y-160$이다.\n$E(Y)=40\\times\\dfrac{11}{18}=\\dfrac{220}9$이므로 $E(X)=6\\times\\dfrac{220}9-160=\\dfrac{440}3-160=-\\dfrac{40}3$이다.\n$V(Y)=40\\times\\dfrac{11}{18}\\times\\dfrac7{18}=\\dfrac{770}{81}$이므로 $V(X)=6^2V(Y)=36\\times\\dfrac{770}{81}=\\dfrac{3080}9$이다.\n따라서 $E(X^2)=V(X)+\\{E(X)\\}^2=\\dfrac{3080}9+\\dfrac{1600}9=\\dfrac{4680}9=520$이다.\n따라서 구하는 값은 $520$이다.",
    "subUnitKey": "H15-PS-05-BINOMIAL_NORMAL",
    "subUnit": "이항분포와 정규분포",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
})();
