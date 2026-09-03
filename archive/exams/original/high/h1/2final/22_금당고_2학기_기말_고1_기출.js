window.examTitle = "22_금당고_2학기_기말_고1_기출";

const UNIT = {
  "집합": ["H15-SB-01", 1],
  "명제": ["H15-SB-02", 2],
  "함수": ["H15-SB-03", 3],
  "유리함수": ["H15-SB-04", 4],
  "무리함수": ["H15-SB-05", 5],
  "경우의 수": ["H15-SB-06", 6],
  "순열": ["H15-SB-07", 7],
  "조합": ["H15-SB-08", 8]
};

function q(id, unit, questionType, content, choices = [], extra = {}) {
  const [standardUnitKey, standardUnitOrder] = UNIT[unit];
  const {
    level = "중",
    category = unit,
    tags = [unit],
    answer,
    solution,
    ...rest
  } = extra;
  return {
    id,
    level,
    category,
    originalCategory: unit,
    standardCourse: "수학(하)",
    standardUnitKey,
    standardUnit: unit,
    standardUnitOrder,
    questionType,
    layoutTag: "grid",
    tags: questionType === "서술형" ? ["서술형", ...tags] : tags,
    wide: false,
    content,
    choices,
    ...rest,
    answer,
    solution
  };
}

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "유리함수의 점근선",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "점근선"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{2}{x-2}-1$의 그래프의 점근선의 방정식이 $x=p$, $y=q$일 때, $p+q$의 값은? [3.8점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "④",
    "solution": "[키포인트] 유리함수의 표준형에서 수직·수평 점근선을 바로 읽는다.\n조건 정리: $y=\\dfrac{2}{x-2}-1$은 $y=\\dfrac{a}{x-p}+q$ 꼴이다.\n풀이 방향: 분모를 0으로 만드는 $x$값과 상수항을 각각 점근선으로 본다.\n정석 풀이: 수직점근선은 $x=2$이므로 $p=2$이고, 수평점근선은 $y=-1$이므로 $q=-1$이다. 따라서 $p+q=2+(-1)=1$이다.\n따라서 정답은 ④이다.",

    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q01-solution.svg",

    "solutionImageAlt": "유리함수의 두 점근선을 나타낸 해설 그래프",

    "solutionImageCaption": "y=2/(x−2)−1에서 수직점근선 x=2와 수평점근선 y=−1을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 2,
    "level": "하",
    "category": "무리함수의 함숫값",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "함숫값"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\sqrt{x+a}+1$가 $f(-1)=2$를 만족시킬 때, 상수 $a$의 값은? [3.8점]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "[키포인트] 주어진 함숫값을 대입하여 근호 안의 식을 결정한다.\n조건 정리: $f(-1)=2$이므로 $\\sqrt{-1+a}+1=2$이다.\n풀이 방향: 근호를 한쪽에 남긴 뒤 양변을 제곱한다.\n정석 풀이: $\\sqrt{a-1}=1$이므로 $a-1=1$이고 $a=2$이다. 이때 $a-1=1\\ge0$이므로 정의 조건도 만족한다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
    "level": "하",
    "category": "곱의 법칙",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "곱의법칙",
      "짝수"
    ],
    "wide": false,
    "content": "숫자 $1,2,3,4$가 각각 적힌 카드 4장이 있다. 이 중에서 2장을 뽑아 두 자리의 자연수를 만들 때, 짝수의 개수는? [4점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 자리 수가 짝수이려면 일의 자리만 짝수이면 된다.\n조건 정리: 일의 자리에는 $2,4$ 중 하나를 놓고, 같은 카드는 다시 쓸 수 없다.\n풀이 방향: 일의 자리를 먼저 정한 뒤 십의 자리를 고른다.\n정석 풀이: 일의 자리는 2가지이고, 일의 자리를 정한 뒤 십의 자리는 남은 3장 중 하나이므로 3가지이다. 따라서 짝수는 $2\\times3=6$개이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
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
      "순열",
      "선택과배열"
    ],
    "wide": false,
    "content": "이어달리기 선수 6명 중에서 4명을 뽑아 달리기 순서를 정하는 모든 경우의 수는? [4점]",
    "choices": [
      "$120$",
      "$180$",
      "$240$",
      "$300$",
      "$360$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 6명 중 4명을 뽑아 순서까지 정하므로 순열을 사용한다.\n조건 정리: 같은 네 명을 뽑더라도 달리는 순서가 다르면 다른 경우이다.\n풀이 방향: ${}_6P_4$를 계산한다.\n정석 풀이: ${}_6P_4=6\\times5\\times4\\times3=360$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
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
      "파스칼의삼각형"
    ],
    "wide": false,
    "content": "두 자연수 $a,b$에 대하여 ${}_{10}C_a={}_9C_4+{}_9C_5$, ${}_8C_5={}_bC_5+{}_7C_4$가 성립할 때, $a+b$의 값은? [4점]",
    "choices": [
      "$12$",
      "$13$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 식 모두 조합의 성질과 조합값 비교로 해결한다.\n조건 정리: ${}_9C_4+{}_9C_5={}_{10}C_5$이고 ${}_8C_5=56$, ${}_7C_4=35$이다.\n풀이 방향: 첫 식에서 $a$, 둘째 식에서 $b$를 각각 결정한다.\n정석 풀이: ${}_{10}C_a={}_{10}C_5$에서 가운데 항은 하나뿐이므로 $a=5$이다. 또 ${}_bC_5=56-35=21={}_7C_5$이므로 $b=7$이다. 따라서 $a+b=12$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "유리함수의 역함수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "역함수"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{3x-1}{x-2}$의 역함수가 $y=\\dfrac{ax+b}{x+c}$일 때, $a+b+c$의 값은? (단, $a,b,c$는 상수이다.) [4점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 역함수는 $x$와 $y$를 바꾼 뒤 다시 $y$에 대하여 푼다.\n조건 정리: $x=\\dfrac{3y-1}{y-2}$이다.\n풀이 방향: 분모를 없애고 $y$가 포함된 항을 한쪽으로 모은다.\n정석 풀이: $x(y-2)=3y-1$이므로 $xy-2x=3y-1$이고, $y(x-3)=2x-1$이다. 따라서 $f^{-1}(x)=\\dfrac{2x-1}{x-3}$이므로 $a=2$, $b=-1$, $c=-3$이다. 따라서 $a+b+c=-2$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "중",
    "category": "부분분수의 합",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리식",
      "부분분수",
      "망원합"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^2+5x+6$에 대하여 $\\dfrac1{f(1)}+\\dfrac1{f(2)}+\\dfrac1{f(3)}+\\cdots+\\dfrac1{f(18)}$의 값은? [4점]",
    "choices": [
      "$\\dfrac2{21}$",
      "$\\dfrac27$",
      "$\\dfrac4{21}$",
      "$\\dfrac5{21}$",
      "$\\dfrac37$"
    ],
    "answer": "②",
    "solution": "[키포인트] 분모를 연속한 두 인수로 만든 뒤 부분분수로 분해하면 합이 연쇄적으로 소거된다.\n조건 정리: $f(k)=k^2+5k+6=(k+2)(k+3)$이다.\n풀이 방향: $\\dfrac1{(k+2)(k+3)}$를 두 분수의 차로 바꾸어 $k=1$부터 18까지 더한다.\n정석 풀이: $\\dfrac1{(k+2)(k+3)}=\\dfrac1{k+2}-\\dfrac1{k+3}$이다. 따라서 전체 합은 $(\\dfrac13-\\dfrac14)+(\\dfrac14-\\dfrac15)+\\cdots+(\\dfrac1{20}-\\dfrac1{21})=\\dfrac13-\\dfrac1{21}=\\dfrac27$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 8,
    "level": "중",
    "category": "역함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "역함수",
      "교점"
    ],
    "wide": false,
    "content": "함수 $y=\\sqrt{x-1}+1$과 그 역함수의 그래프는 서로 다른 두 점에서 만난다. 이때, 두 교점 사이의 거리를 $d$, 두 교점을 지나는 직선의 기울기를 $m$이라고 할 때, $d+m$의 값은? [4.2점]",
    "choices": [
      "$\\sqrt2+1$",
      "$\\sqrt3+1$",
      "$3$",
      "$\\sqrt5+1$",
      "$\\sqrt6+1$"
    ],
    "answer": "①",
    "solution": "[키포인트] 함수와 역함수의 공통점은 직선 $y=x$ 위에서 찾을 수 있다.\n조건 정리: 교점에서는 $x=\\sqrt{x-1}+1$이고 $x\\ge1$이다.\n풀이 방향: $t=x-1$로 치환하여 두 교점을 구한 뒤 거리와 기울기를 계산한다.\n정석 풀이: $t=\\sqrt t$이고 $t\\ge0$이므로 $t^2=t$, 즉 $t=0,1$이다. 따라서 교점은 $(1,1)$, $(2,2)$이다. 두 점 사이의 거리는 $d=\\sqrt{1^2+1^2}=\\sqrt2$, 기울기는 $m=1$이다. 그러므로 $d+m=\\sqrt2+1$이다.\n따라서 정답은 ①이다.",

    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q08-solution.svg",

    "solutionImageAlt": "무리함수와 역함수의 교점을 나타낸 해설 그래프",

    "solutionImageCaption": "교점 P=(1,1), Q=(2,2), 거리 √2와 직선 기울기 1을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_INVERSE",
    "subUnit": "무리함수와 역함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "상",
    "category": "유리함수의 식",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "항등식",
      "그래프의점"
    ],
    "wide": false,
    "content": "$x\\ne-a$인 모든 실수 $x$에 대해 다항함수가 아닌 유리함수 $f(x)=\\dfrac{bx+c}{x+a}$가 $f(2-x)+f(2+x)=6$을 만족시키고 점 $(3,5)$를 지날 때, $|a|+|b|+|c|$의 값은? (단, $a,b,c$는 상수이다.) [4.2점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "③",
    "solution": "[키포인트] 유리함수를 상수항과 분수항으로 나누면 대칭 조건이 간단해진다.\n조건 정리: $f(x)=b+\\dfrac{c-ab}{x+a}$이고, 다항함수가 아니므로 $c-ab\\ne0$이다.\n풀이 방향: $f(2-x)+f(2+x)$의 분수항이 모든 $x$에서 사라지도록 $a$를 정하고, 상수값과 지나는 점으로 $b,c$를 구한다.\n정석 풀이: $d=c-ab$라 하면 $f(2-x)+f(2+x)=2b+\\dfrac{2d(a+2)}{(a+2)^2-x^2}$이다. 이 값이 항상 6이고 $d\\ne0$이므로 $a=-2$이고 $2b=6$에서 $b=3$이다. 또 $f(3)=\\dfrac{9+c}{1}=5$이므로 $c=-4$이다. 따라서 $|a|+|b|+|c|=2+3+4=9$이다.\n따라서 정답은 ③이다.",

    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q09-solution.svg",

    "solutionImageAlt": "유리함수의 대칭 중심을 나타낸 해설 그래프",

    "solutionImageCaption": "f=3+2/(x−2)와 점 (3,5), 대칭 조건을 이용해 중심 (2,3)을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_BASIC",
    "subUnit": "유리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
    "category": "함수의 개수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "포함배제",
      "상자에넣기"
    ],
    "wide": false,
    "content": "서로 다른 공 5개를 서로 다른 5개의 상자에 넣을 때, 공이 한 개도 없는 상자가 2개가 되도록 넣는 방법의 수는? [4.2점]",
    "choices": [
      "$500$",
      "$1000$",
      "$1500$",
      "$2000$",
      "$2500$"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 사용할 상자 3개를 고른 뒤, 그 세 상자가 모두 비지 않도록 공을 배치한다.\n조건 정리: 공은 서로 다르고 상자도 서로 다르며, 정확히 2개의 상자가 비어 있어야 한다.\n풀이 방향: 3개의 사용 상자를 고른 후 포함배제로 전사 배치의 수를 센다.\n정석 풀이: 사용할 상자를 고르는 방법은 ${}_5C_3=10$가지이다. 고른 세 상자에 5개의 공을 넣되 모두 사용하도록 하는 방법은 $3^5-{}_3C_1\\,2^5+{}_3C_2\\,1^5=243-96+3=150$가지이다. 따라서 전체는 $10\\times150=1500$가지이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
    "level": "상",
    "category": "조건이 있는 순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "양끝배열",
      "이웃하여나열하기"
    ],
    "wide": false,
    "content": "남학생 5명과 여학생 $n$명이 단체 사진을 찍으려고 한다. 여학생이 양 끝에 오도록 한 줄로 서는 경우의 수가 남학생 5명이 서로 이웃하도록 한 줄로 서는 경우의 수의 18배일 때, $n$의 값은? [4.2점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 조건의 배열 수를 각각 세어 그 비가 18이라는 식을 세운다.\n조건 정리: 여학생이 양 끝에 서는 경우와 남학생 5명이 하나의 묶음으로 서는 경우를 비교한다.\n풀이 방향: 각각의 경우의 수를 $n$에 대한 식으로 만든다.\n정석 풀이: 여학생이 양 끝에 서는 방법은 ${}_nP_2(n+3)!$이다. 남학생 5명이 서로 이웃하는 방법은 남학생 5명을 한 묶음으로 보아 $(n+1)!5!$이다. 따라서 $\\dfrac{n(n-1)(n+3)!}{(n+1)!5!}=18$이므로 $n(n-1)(n+2)(n+3)=2160$이다. 보기 중 $n=6$일 때 $6\\times5\\times8\\times9=2160$이 성립한다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "상",
    "category": "조건이 있는 배열",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "순열",
      "연속조건"
    ],
    "wide": false,
    "content": "주머니 속에 서로 다른 사탕 4개와 서로 같은 초콜릿 2개가 있다. 이 주머니에서 다음 조건을 만족시키면서 5개의 간식을 꺼내는 방법의 수는? [4.4점]<br>(가) 초콜릿은 연속하여 꺼내지 않는다.<br>(나) 사탕은 2개까지 연속하여 꺼낼 수 있다.",
    "choices": [
      "$48$",
      "$108$",
      "$120$",
      "$132$",
      "$144$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 꺼낸 초콜릿의 개수가 1개인지 2개인지에 따라 가능한 간식 배열을 나눈다.\n조건 정리: 초콜릿은 서로 같고, 사탕 4개는 서로 다르다. 초콜릿끼리는 붙을 수 없고 사탕은 3개 이상 연속할 수 없다.\n풀이 방향: C를 사탕, H를 초콜릿으로 두고 가능한 위치 패턴을 센 뒤 서로 다른 사탕의 배열을 곱한다.\n정석 풀이: 초콜릿을 1개 꺼내면 사탕 4개를 모두 써야 하므로 사탕이 3개 이상 연속하지 않게 하려면 H가 정확히 가운데에 와야 한다. 따라서 $4!=24$가지이다. 초콜릿을 2개 꺼내면 H 두 위치가 이웃하지 않는 패턴은 6개인데, 양 끝이 H인 $HCCCH$는 사탕 3개가 연속되므로 제외하여 5개이다. 사용할 사탕 3개를 고르고 배열하는 방법은 ${}_4P_3=24$가지이므로 $5\\times24=120$가지이다. 전체는 $24+120=144$가지이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q13-solution.svg",
    "solutionImageAlt": "집합 A의 그래프와 원점을 지나는 직선의 교점 및 경계 기울기 그래프",
    "solutionImageCaption": "경계 기울기에서 접하고, 교점이 없는 범위는 -1≤m<-3+2√2",
    "solutionImageSize": "full",
    "level": "상",
    "category": "두 그래프의 교점",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "집합",
      "절댓값함수",
      "기울기",
      "교점"
    ],
    "wide": false,
    "content": "두 집합 $A=\\{(x,y)\\mid y=\\dfrac{|x|-1}{|x-1|},\\;$ 단 $x\\ne1\\}$, $B=\\{(x,y)\\mid y=mx\\}$에 대하여 $A\\cap B=\\varnothing$일 때, 실수 $m$의 값의 범위는? [4.4점]",
    "choices": [
      "$-1\\le m\\lt-3+2\\sqrt2$",
      "$-1\\lt m\\le-3+2\\sqrt2$",
      "$-2\\le m\\lt-3+2\\sqrt2$",
      "$-2\\lt m\\le-3+2\\sqrt2$",
      "$-2\\le m\\le-3+2\\sqrt2$"
    ],
    "answer": "①",
    "solution":"[키포인트] 원점을 지나는 직선 $y=mx$가 집합 $A$의 그래프와 만날 때 가능한 기울기의 전체 범위를 구한 뒤 그 여집합을 찾는다.\n조건 정리: $0\\le x\\lt1$에서는 $y=-1$, $x\\gt1$에서는 $y=1$이다. $x\\lt0$에서는 $u=-x\\gt0$으로 놓으면 $m=\\dfrac{y}{x}=-\\dfrac{u-1}{u(u+1)}$이다.\n풀이 방향: 세 x-범위에서 교점이 생기는 $m$의 범위를 각각 구해 합친다.\n정석 풀이: $0\\le x\\lt1$에서 $x=0$이면 집합 $A$의 점은 $(0,-1)$이어서 원점을 지나는 직선 $y=mx$와 만나지 않는다. 따라서 $x=0$은 교점이 아니고, $x\\gt0$인 부분에서는 $m=-1/x$이므로 $m\\lt-1$이다. $x\\gt1$에서는 $m=1/x$이므로 $0\\lt m\\lt1$이다. $x\\lt0$에서 $0\\lt u\\lt1$이면 $m=\\dfrac{1-u}{u(u+1)}\\gt0$이고, $u$가 0에서 1까지 변할 때 이 값은 모든 양의 값을 갖는다. $u\\ge1$이면 $m\\le0$이고, $\\dfrac{u-1}{u(u+1)}\\le3-2\\sqrt2$이다. 실제로 $(3-2\\sqrt2)-\\dfrac{u-1}{u(u+1)}=\\dfrac{(3-2\\sqrt2)(u-1-\\sqrt2)^2}{u(u+1)}\\ge0$이므로 $-3+2\\sqrt2\\le m\\le0$이다. 따라서 교점이 생기는 기울기는 $m\\lt-1$ 또는 $m\\ge-3+2\\sqrt2$이고, 교점이 없는 범위는 $-1\\le m\\lt-3+2\\sqrt2$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-01-SET_BASIC",
    "subUnit": "집합의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "상",
    "category": "색칠하는 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "색칠하기",
      "도형"
    ],
    "wide": false,
    "content": "수지는 교내 연날리기 대회에서 가오리연을 만들어 날리려고 한다. 다음 그림과 같이 6개의 영역으로 나누어진 가오리연을 4가지 색의 일부 또는 전부를 사용하여 색칠하는 경우의 수는? (단, 인접한 영역은 서로 다른 색을 칠한다.) [4.4점]",
    "choices": [
      "$252$",
      "$336$",
      "$420$",
      "$504$",
      "$588$"
    ],
    "image": "assets/images/22_금당고_2학기_기말_고1_기출/q14.png",
    "answer": "④",
    "solution": "[키포인트] 그림의 인접 관계를 위쪽 3영역과 아래쪽 3영역으로 나누어 센다.\n조건 정리: 위쪽의 바깥 영역과 원 안의 두 영역은 서로 모두 인접한다. 아래쪽은 위쪽 바깥 영역과 함께 4개의 영역이 순환형 인접 관계를 이룬다.\n풀이 방향: 위쪽 세 영역을 먼저 칠하고, 그때 정해진 위쪽 바깥색을 기준으로 아래쪽 세 영역의 색칠 수를 센다.\n정석 풀이: 위쪽 바깥 영역은 4가지, 원 안의 첫 영역은 3가지, 나머지 원 영역은 앞의 두 색과 달라야 하므로 2가지여서 $4\\times3\\times2$가지이다. 위쪽 바깥색을 고정하면 아래의 좌우 영역은 각각 3가지이다. 좌우 색이 같으면 3가지 선택마다 맨 아래 영역은 3가지, 좌우 색이 다르면 6가지 선택마다 맨 아래 영역은 2가지이므로 아래쪽은 $3\\times3+6\\times2=21$가지이다. 따라서 전체는 $4\\times3\\times2\\times21=504$가지이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "상",
    "category": "부등식의 성립 조건",
    "originalCategory": "명제",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-02",
    "standardUnit": "명제",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "부등식",
      "최댓값",
      "최솟값"
    ],
    "wide": false,
    "content": "$3\\le x\\le4$인 임의의 실수 $x$에 대하여 부등식 $ax^2-4ax+4a+1\\le\\dfrac{x+2}{x-2}\\le bx^2-4bx+4b+1$이 항상 성립할 때, $a$의 최댓값을 $M$, $b$의 최솟값을 $m$이라고 하자. $M+m$의 값은? (단, $a\\ne0,b\\ne0$) [4.4점]",
    "choices": [
      "$\\dfrac92$",
      "$\\dfrac{11}2$",
      "$\\dfrac{13}2$",
      "$\\dfrac{15}2$",
      "$\\dfrac{17}2$"
    ],
    "answer": "①",
    "solution": "[키포인트] $t=x-2$로 치환하면 양쪽 이차식과 가운데 유리식의 비교가 한 항의 부등식으로 바뀐다.\n조건 정리: $3\\le x\\le4$이므로 $1\\le t\\le2$이고, 가운데 식은 $1+\\dfrac4t$, 양쪽 식은 각각 $at^2+1$, $bt^2+1$이다.\n풀이 방향: 모든 $t\\in[1,2]$에서 성립하도록 $a$의 상한과 $b$의 하한을 찾는다.\n정석 풀이: $at^2+1\\le1+\\dfrac4t$에서 $a\\le\\dfrac4{t^3}$이고, $1+\\dfrac4t\\le bt^2+1$에서 $b\\ge\\dfrac4{t^3}$이다. $\\dfrac4{t^3}$은 $[1,2]$에서 감소하므로 $M=\\dfrac4{2^3}=\\dfrac12$, $m=\\dfrac4{1^3}=4$이다. 따라서 $M+m=\\dfrac12+4=\\dfrac92$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-02-PROPOSITION_BASIC",
    "subUnit": "명제와 진리집합",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 16,
    "level": "상",
    "category": "좌석 배치",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "좌석배치",
      "이웃조건",
      "도형"
    ],
    "wide": false,
    "content": "남학생 2명과 여학생 3명이 함께 독서실을 등록하려고 한다. 그림과 같이 남은 7개의 좌석에 자리를 배정할 때, 남학생끼리는 이웃하고 여학생끼리는 서로 이웃하지 않는 모든 방법의 수는? [4.5점]",
    "choices": [
      "$92$",
      "$126$",
      "$160$",
      "$194$",
      "$228$"
    ],
    "image": "assets/images/22_금당고_2학기_기말_고1_기출/q16.png",
    "answer": "⑤",
    "solution": "[키포인트] 그림에서 실제로 서로 붙어 있는 사용 가능 좌석쌍을 먼저 확인한다.\n조건 정리: 사용 가능한 좌석은 $2,4,5,6,7,8,11$이고, 남학생이 서로 이웃해 앉을 수 있는 쌍은 $(4,5)$, $(5,6)$, $(7,8)$이다.\n풀이 방향: 남학생 좌석쌍을 하나 고정한 뒤 남은 좌석에서 서로 이웃하지 않는 여학생 좌석 3개를 고른다.\n정석 풀이: 남학생이 $(4,5)$에 앉으면 남은 좌석 $2,6,7,8,11$에서 여학생이 서로 이웃하지 않도록 고르는 방법은 7가지이다. $(5,6)$인 경우도 같은 이유로 7가지이다. $(7,8)$이면 남은 $2,4,5,6,11$에서 가능한 세 좌석 선택은 5가지이다. 따라서 좌석 선택은 $7+7+5=19$가지이고, 남학생 2명과 여학생 3명을 각 좌석에 배치하는 방법은 $2!\\times3!$가지이므로 전체는 $19\\times2!\\times3!=228$가지이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "두 그래프의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "무리함수",
      "교점의개수",
      "매개변수"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{2x}{x-1}$의 그래프와 함수 $y=\\sqrt{x-2t}-t$의 그래프가 서로 다른 두 점에서 만날 때, 실수 $t$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M-2m$의 값은? [4.5점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 교점의 $y$좌표와 $w=\\sqrt{x-2t}$를 이용해 근호의 정의 조건을 보존한 채, 두 번째 교점이 생기는 $t$의 범위를 정확히 구한다.\n조건 정리: 유리함수에서 $x=\\dfrac{y}{y-2}$이고, 무리함수에서 $w=y+t\\ge0$, $x=w^2+2t$이다. 따라서 $t=w-y$이다.\n풀이 방향: $R(y)=\\dfrac{2(y^2-y-1)}{y-2}$로 놓아 $(w+1)^2=R(y)$를 얻고, $w\\ge0$에서 허용되는 $y$의 구간과 그때의 $t$값을 조사한다.\n정석 풀이: 대입하면 $(w+1)^2=R(y)$이다. $w\\ge0$이므로 $R(y)\\ge1$이어야 하고, $R(y)-1=\\dfrac{y(2y-3)}{y-2}$이므로 허용되는 $y$는 $0\\le y\\le\\dfrac32$ 또는 $y\\gt2$이다. 이때 $T(y)=\\sqrt{R(y)}-1-y=t$이다. 각 허용 구간에서 $y_2\\gt y_1$이면 $R(y_2)-R(y_1)\\lt2(y_2-y_1)$이고 $\\sqrt{R(y_2)}+\\sqrt{R(y_1)}\\ge2$이므로 $T(y_2)\\lt T(y_1)$, 즉 $T$는 감소한다. $y\\gt2$에서는 $y$가 $2$의 오른쪽에 가까워질 때 $T(y)$가 한없이 커지고 $y$가 커질수록 한없이 작아지므로 모든 실수 $t$에 대해 교점이 정확히 하나 생긴다. 따라서 서로 다른 두 교점이 되려면 $0\\le y\\le\\dfrac32$에서 교점이 하나 더 생겨야 한다. 이 구간에서는 $(y+1)^2-R(y)=\\dfrac{y(y^2-2y-1)}{y-2}\\ge0$이므로 $0\\le w\\le y$, 따라서 $-\\dfrac32\\le t=w-y\\le0$이다. $y=0$에서 $t=0$, $y=\\dfrac32$에서 $t=-\\dfrac32$이고 $T$가 감소하므로 이 구간의 $t$값은 정확히 $[-\\dfrac32,0]$이다. 따라서 $M=0$, $m=-\\dfrac32$이고 $M-2m=3$이다.\n따라서 정답은 ⑤이다.",

    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q17-solution.svg",

    "solutionImageAlt": "유리함수와 무리함수의 두 교점을 나타낸 해설 그래프",

    "solutionImageCaption": "대표값 t=0에서 두 교점과 −3/2≤t≤0 범위를 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q18-solution.svg",
    "solutionImageAlt": "원문 조건의 문제점을 점검하고 양의 정수 조건을 추가한 경우 n=9에서 두 그래프가 접하는 좌표 그래프",
    "solutionImageCaption": "원문 ‘정수 n’은 값이 하나로 정해지지 않으며, 출제 의도대로 양의 정수 조건을 추가하면 n=9",
    "solutionImageSize": "full",
    "level": "상",
    "category": "두 그래프의 교점",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "집합",
      "교점의개수"
    ],
    "wide": false,
    "content": "단답형 1. 두 집합 $A=\\{(x,y)\\mid y=\\dfrac{x^2+n}{6},\\;x\\ge0\\}$, $B=\\{(x,y)\\mid y=\\sqrt{6x-n}\\}$에 대하여 $n(A\\cap B)=1$이 되도록 하는 정수 $n$의 값은? [4점]",
    "choices": [],
    "answer": "정답 없음(원문 조건 기준; 출제 의도는 $9$)",
    "solution": "[키포인트] 두 그래프의 교점 조건을 서로 대칭인 두 식으로 바꾼 뒤, 원문에 적힌 정수 조건이 답을 하나로 정하는지 먼저 확인한다.\n조건 정리: 교점에서는 $x^2+n=6y$, $y^2+n=6x$이고 $x,y\\ge0$이다.\n풀이 방향: 두 식의 차를 이용해 $x=y$를 얻고 하나의 이차방정식의 음이 아닌 근의 개수를 조사한다.\n정석 풀이: 두 식을 빼면 $(x-y)(x+y+6)=0$이다. $x,y\\ge0$이므로 $x=y$이고 $x^2-6x+n=0$이다. $n<0$인 정수에서는 양의 근 $3+\\sqrt{9-n}$ 하나만 가능하므로 교점이 하나이다. $1\\le n<9$이면 서로 다른 두 양의 근을 가지고, $n=0$이면 근이 $0,6$이어서 교점이 두 개이다. $n=9$이면 $(x-3)^2=0$이 되어 교점이 하나이고, $n>9$이면 실근이 없다. 따라서 원문 ‘정수 $n$’ 조건에서는 $n<0$ 또는 $n=9$가 모두 가능하여 답이 하나로 정해지지 않는다. 원문에 ‘양의 정수’가 누락된 출제 의도로 해석할 때에는 $1\\le n<9$에서 두 교점, $n=9$에서 한 교점, $n>9$에서 0교점이므로 $n=9$이다.\n따라서 원문 기준 정답은 없고, 출제 의도(양의 정수 조건 추가)에 따른 값은 $9$이다.",
    "subUnitKey": "H15-SB-01-SET_BASIC",
    "subUnit": "집합의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "중",
    "category": "도형의 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "조합",
      "직선",
      "삼각형"
    ],
    "wide": false,
    "content": "단답형 2. 평면 위에 13개의 직선이 있다. 다음 조건을 만족하면서 13개의 직선으로 만들어지는 삼각형의 개수는? [5점]<br>(가) 어느 세 직선도 한 점에서 만나지 않는다.<br>(나) 세 직선만 평행하다.",
    "choices": [],
    "answer": "$255$",
    "solution": "[키포인트] 세 직선을 고른 전체 경우에서 평행선 때문에 삼각형이 생기지 않는 경우를 제외한다.\n조건 정리: 정확히 3개의 직선이 서로 평행하고 어느 세 직선도 한 점에서 만나지 않는다.\n풀이 방향: 평행한 세 직선 중 2개 이상을 포함하는 선택을 뺀다.\n정석 풀이: 세 직선을 고르는 전체 방법은 ${}_{13}C_3=286$가지이다. 평행선 중 정확히 2개와 나머지 10개 중 1개를 고르는 방법은 ${}_3C_2\\times10=30$가지이고, 평행한 세 직선을 모두 고르는 경우가 1가지이다. 따라서 삼각형의 개수는 $286-30-1=255$개이다.\n따라서 구하는 삼각형의 개수는 $255$개이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
    "category": "집합의 연산과 경우의 수",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "집합",
      "대칭차집합",
      "경우의수"
    ],
    "wide": false,
    "content": "서술형 1. 전체집합 $U=\\{x\\mid x$는 10 이하의 자연수$\\}$의 두 부분집합 $A,B$가 다음 조건을 만족시킨다.<br>(가) 집합 $A^C\\cap B^C$의 모든 원소의 합은 집합 $(A-B)\\cup(B-A)$의 원소의 합의 4배이다.<br>(나) $n(A\\cap B)=1$<br>$3\\le n(A\\cup B)\\le4$일 때, 두 집합 $A,B$의 순서쌍 $(A,B)$의 개수를 구하고 그 과정을 서술하시오. [10점]",
    "choices": [],
    "answer": "$72$",
    "solution": "[키포인트] 공통 원소 하나와 대칭차집합의 원소들을 분리해 합 조건을 하나의 정수식으로 바꾼 뒤 가능한 경우를 빠짐없이 나열한다.\n조건 정리: $A\\cap B=\\{c\\}$, $S=(A-B)\\cup(B-A)$라 하면 $|S|=2$ 또는 3이고 $A\\cup B=\\{c\\}\\cup S$이다.\n풀이 방향: 전체집합 원소의 합 $55$를 이용해 $c+5\\sum S=55$를 얻고, $|S|=2,3$을 각각 조사한 뒤 $S$의 원소를 $A-B$와 $B-A$에 배분한다.\n정석 풀이: $A^C\\cap B^C$의 원소 합은 $55-c-\\sum S$이므로 조건 (가)에서 $55-c-\\sum S=4\\sum S$, 즉 $c+5\\sum S=55$이다. 따라서 $c$는 5의 배수여야 하므로 $c=5$ 또는 $10$이다. $|S|=2$일 때 가능한 경우는 $(5,\\{1,9\\})$, $(5,\\{2,8\\})$, $(5,\\{3,7\\})$, $(5,\\{4,6\\})$, $(10,\\{1,8\\})$, $(10,\\{2,7\\})$, $(10,\\{3,6\\})$, $(10,\\{4,5\\})$의 8개이다. 각 $S$의 두 원소는 각각 $A-B$ 또는 $B-A$에 들어가므로 한 경우마다 $2^2=4$가지, 모두 $8\\times4=32$가지이다. $|S|=3$일 때 가능한 경우는 $(5,\\{1,2,7\\})$, $(5,\\{1,3,6\\})$, $(10,\\{1,2,6\\})$, $(10,\\{1,3,5\\})$, $(10,\\{2,3,4\\})$의 5개이다. 한 경우마다 배분 방법은 $2^3=8$가지이므로 $5\\times8=40$가지이다. 따라서 전체 순서쌍은 $32+40=72$개이다.\n따라서 구하는 순서쌍의 개수는 $72$개이다.",
    "solutionImage": "assets/images/22_금당고_2학기_기말_고1_기출/q20-solution.svg",
    "solutionImageAlt": "공통 영역·대칭차집합·바깥 영역으로 나눈 네 영역 배치표",
    "solutionImageCaption": "공통 원소와 대칭차집합을 분리해 전체 원소 합 조건을 세우는 네 영역 구조",
    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-01-SET_BASIC",
    "subUnit": "집합의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
    "level": "상",
    "category": "유리함수와 원의 접선",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "유리함수",
      "대칭",
      "원",
      "접선"
    ],
    "wide": false,
    "content": "서술형 2. 함수 $f(x)=\\dfrac{ax+1}{bx+c}$는 두 직선 $y=x+\\dfrac12$, $y=-x+\\dfrac32$에 대하여 대칭이고 점 $(1,3)$을 지난다. 함수 $f(x)$와 접점의 $x$좌표가 양수인 서로 다른 두 점에서 접하는 원이 있다. $2\\sqrt2$보다 큰 양수 $k$에 대하여 점 $(\\dfrac12,1)$과 중심 사이의 거리가 $k$인 두 원의 넓이 중 큰 것부터 $g(k)$, $h(k)$라 할 때, $g(3)-h(3)$의 값을 구하고 그 과정을 서술하시오. (단, $a,b,c$는 상수이다.) [10점]",
    "choices": [],
    "answer": "$4\\pi$",
    "solution": "[키포인트] 유리함수를 중심 $(\\dfrac12,1)$로 평행이동해 $XY=1$로 만든 뒤, 원과 쌍곡선의 교점 방정식이 두 중근을 갖는 조건으로 두 접원의 반지름을 구한다.\n조건 정리: 두 대칭축의 교점은 $(\\dfrac12,1)$이다. 유리함수의 중심이 이 점이므로 $-c/b=\\dfrac12$, $a/b=1$이고, 점 $(1,3)$을 대입하면 $a=b=2$, $c=-1$이다. 따라서 $X=x-\\dfrac12$, $Y=y-1$로 놓으면 그래프는 $XY=1$이다.\n풀이 방향: 평행이동한 좌표에서 원의 중심을 $(p,q)$, 반지름을 $r$라 두고 $Y=1/X$를 원의 방정식에 대입한다. 서로 다른 두 점에서 접하므로 얻어지는 사차식은 서로 다른 두 중근을 가져야 한다.\n정석 풀이: 원의 방정식 $(X-p)^2+(Y-q)^2=r^2$에 $Y=1/X$를 대입하고 $X^2$을 곱하면 $X^4-2pX^3+(p^2+q^2-r^2)X^2-2qX+1=0$이다. 두 접점의 $X$좌표를 $\\alpha,\\beta$라 하면 이 식은 $(X-\\alpha)^2(X-\\beta)^2$이고, 상수항 비교에서 $(\\alpha\\beta)^2=1$이다. $\\alpha\\beta=1$이면 계수 비교로 $q=p$이고 $p=\\alpha+\\beta$이다. 이때 $p^2+q^2-r^2=\\alpha^2+4\\alpha\\beta+\\beta^2=p^2+2$이므로 $r^2=p^2-2$이다. $\\alpha\\beta=-1$이면 $q=-p$이고 같은 방법으로 $r^2=p^2+2$이다. 중심은 각각 대칭축 $Y=X$, $Y=-X$ 위에 놓인다. 중심과 원점 사이 거리가 $k$이므로 $2p^2=k^2$이다. 접점의 원래 $x$좌표가 모두 양수여야 하므로 $p$는 양수이고 $p=\\dfrac{k}{\\sqrt2}\\gt2$이다. $\\alpha\\beta=1$일 때 두 근은 모두 양수이고, $\\alpha\\beta=-1$일 때 양의 근을 $\\alpha$라 하면 $\\alpha\\gt2$, 음의 근은 $\\beta=-1/\\alpha\\gt-1/2$이므로 이 경우에도 원래 좌표 $x=X+1/2$는 두 접점에서 모두 양수이다. 따라서 두 반지름 제곱은 $\\dfrac{k^2}{2}-2$, $\\dfrac{k^2}{2}+2$이다. 그러므로 큰 원과 작은 원의 넓이 차는 $\\pi\\{(\\dfrac{k^2}{2}+2)-(\\dfrac{k^2}{2}-2)\\}=4\\pi$이다. 특히 $k=3$에서 $g(3)-h(3)=4\\pi$이다.\n따라서 구하는 값은 $4\\pi$이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
