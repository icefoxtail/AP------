window.examTitle = "24_매산여고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "일대일대응",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=\\begin{cases}x+3&(x\\ge0)\\\\(2-a)x+3&(x\\lt 0)\\end{cases}$이 일대일대응일 때, 상수 $a$의 값의 범위를 구하면? [3.6점]",
    "choices": [
      "$a\\lt 1$",
      "$a\\le1$",
      "$a\\lt 2$",
      "$a\\le2$",
      "$a\\lt 3$"
    ],
    "answer": "③",
    "solution":"일대일대응이 되려면 서로 다른 두 구간의 함수값이 겹치지 않고, 전체 치역이 실수 전체여야 한다.\n$x\\ge0$에서\n$f(x)=x+3$\n$\\Rightarrow f(x)\\ge3$이므로 치역은 $[3,\\infty)$이다.\n\n$x\\lt0$에서 $f(x)=(2-a)x+3$이다.\n① $2-a\\gt0$이면\n$x\\lt0\\Rightarrow(2-a)x\\lt0$\n$\\Rightarrow f(x)\\lt3$\n치역은 $(-\\infty,3)$이므로 두 치역이 겹치지 않고 합하면 실수 전체이다.\n② $2-a=0$이면\n$f(x)=3$으로 일정하여 일대일함수가 아니다.\n③ $2-a\\lt0$이면\n$x\\lt0\\Rightarrow f(x)\\gt3$\n$x\\ge0$의 치역과 겹치고 $3$보다 작은 함수값이 없다.\n\n따라서 $2-a\\gt0$, 즉 $a\\lt2$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 2,
    "level": "하",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 함수 $f(x)=2x+3$, $g(x)=3x+k$가 $f\\circ g=g\\circ f$를 만족시킬 때, $g(1)$을 구하면? (단, $k$는 상수) [3.9점]",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "합성함수의 순서를 바꾸어도 같은 함수라는 조건을 사용한다.\n$f(g(x))=f(3x+k)$\n$=2(3x+k)+3$\n$=6x+2k+3$\n\n$g(f(x))=g(2x+3)$\n$=3(2x+3)+k$\n$=6x+9+k$\n\n모든 $x$에 대하여 두 식이 같으므로 상수항을 비교하면\n$2k+3=9+k$\n$\\Rightarrow k=6$이다.\n\n따라서\n$g(1)=3\\cdot1+6=9$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION",
    "subUnit": "합성함수",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 3,
    "level": "하",
    "category": "유리함수의 평행이동",
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
    "content": "유리함수 $y=\\dfrac{2x+5}{x-1}$의 그래프는 $y=\\dfrac ax$의 그래프를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $c$만큼 평행이동한 것이다. 이때 상수 $a+b+c$의 값을 구하면? [3.7점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "④",
    "solution": "평행이동량을 알아보려면 분모가 $x-b$인 꼴로 고친다.\n$2x+5=2(x-1)+7$이므로\n$y=\\dfrac{2x+5}{x-1}$\n$=\\dfrac{2(x-1)+7}{x-1}$\n$=\\dfrac7{x-1}+2\\quad(x\\ne1)$\n\n$y=\\dfrac7x$를 오른쪽으로 $1$, 위로 $2$만큼 평행이동한 그래프이다.\n점근선도 $x=0$, $y=0$에서 $x=1$, $y=2$로 이동한다.\n\n$a=7,\\quad b=1,\\quad c=2$\n$a+b+c=7+1+2=10$\n\n따라서 정답은 ④이다.",

    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q03-solution.svg",

    "solutionImageAlt": "평행이동된 유리함수의 점근선과 그래프를 나타낸 해설 그래프",

    "solutionImageCaption": "y=2+7/(x−1)로 고쳐 y=7/x에서 (1,2)만큼 이동했음을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
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
    "image": "assets/images/24_매산여고_2학기_기말_고1_기출/q4.png",
    "content": "무리함수 $y=-\\sqrt{2ax+b}+c$의 그래프가 오른쪽 그림과 같을 때, 상수 $a+b+c$의 값을 구하면? [3.8점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "무리함수의 그래프에서는 근호 안이 $0$이 되는 점이 그래프의 끝점이다.\n주어진 그림의 끝점 $(1,1)$을\n$y=-\\sqrt{2ax+b}+c$에 적용한다.\n$2a\\cdot1+b=0$\n$c=1$\n\n또 그래프는 $(0,-1)$을 지나므로\n$-1=-\\sqrt{b}+1$\n$\\Rightarrow\\sqrt b=2$\n$\\Rightarrow b=4$\n\n끝점 조건으로 돌아가면\n$2a+4=0$\n$\\Rightarrow a=-2$이다.\n\n따라서\n$a+b+c=-2+4+1=3$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
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
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{2-3x}{x+1}$의 그래프에 대한 다음 설명 중 옳지 않은 것을 구하면? [3.9점]",
    "choices": [
      "점 $(1,-\\dfrac12)$을 지난다.",
      "점근선은 두 직선 $x=-1$, $y=-3$이다.",
      "$y=x-2$에 대하여 대칭이다.",
      "평행이동하였을 때, 유리함수 $y=\\dfrac{2x+3}{x-1}$의 그래프와 겹쳐진다.",
      "그래프는 제1사분면을 지나지 않는다."
    ],
    "answer": "⑤",
    "solution": "분자를 분모에 맞추어 나누면\n$y=\\dfrac{2-3x}{x+1}$\n$=\\dfrac{5-3(x+1)}{x+1}$\n$=\\dfrac5{x+1}-3\\quad(x\\ne-1)$\n\n각 보기를 차례대로 판정한다.\n① $x=1$을 대입하면\n$y=\\dfrac5{1+1}-3=-\\dfrac12$이므로 옳다.\n② 두 점근선은 $x=-1$, $y=-3$이므로 옳다.\n③ 그래프의 중심은 $(-1,-3)$이고, 대칭축 중 하나는\n$y+3=x+1$\n$\\Rightarrow y=x-2$이므로 옳다.\n④ 비교할 함수는\n$\\dfrac{2x+3}{x-1}=\\dfrac5{x-1}+2$이다.\n분자의 평행이동형 계수가 모두 $5$로 같으므로 그래프를 오른쪽으로 $2$, 위로 $5$만큼 옮기면 겹친다. 따라서 옳다.\n⑤ $0\\lt x\\lt\\dfrac23$이면\n$2-3x\\gt0,\\quad x+1\\gt0$\n$\\Rightarrow x\\gt0,\\ y\\gt0$이다.\n따라서 그래프는 제1사분면도 지나므로 ⑤가 옳지 않다.\n\n따라서 정답은 ⑤이다.",

    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q05-solution.svg",

    "solutionImageAlt": "유리함수 y=−3+5/(x+1)의 그래프와 점근선 x=−1, y=−3, 대칭의 중심 (−1,−3), 그래프 위의 점 P를 표시한 좌표평면이다. 곡선이 제1사분면을 지나는 모습을 보여 준다.",

    "solutionImageCaption": "y=−3+5/(x+1)에서 점근선 x=−1, y=−3과 중심을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "유리함수와 무리함수의 교점",
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
    "content": "정의역이 $\\{x\\mid5\\le x\\le8\\}$인 두 함수 $y=\\dfrac{-2x+7}{x-2}$, $y=\\sqrt{2x}+k$의 그래프가 한 점에서 만날 때, 상수 $k$의 최솟값을 구하면? [4.0점]",
    "choices": [
      "$-\\dfrac{11}{2}$",
      "$-6$",
      "$-\\dfrac{13}{2}$",
      "$-7$",
      "$-\\dfrac{15}{2}$"
    ],
    "answer": "①",
    "solution": "두 그래프가 만나는 점의 $x$좌표를 $t$라 두자. 정의역 때문에 $5\\le t\\le8$이다.\n교점에서 두 함수값이 같으므로\n$\\dfrac{-2t+7}{t-2}=\\sqrt{2t}+k$\n$\\Rightarrow k=\\dfrac{-2t+7}{t-2}-\\sqrt{2t}$\n$=-2+\\dfrac3{t-2}-\\sqrt{2t}$\n\n$5\\le t\\le8$에서 $t$가 커질수록\n$\\dfrac3{t-2}$는 작아지고\n$\\sqrt{2t}$는 커진다.\n따라서 오른쪽 식 전체는 계속 감소하므로 같은 $k$값을 만드는 $t$는 많아야 하나이다.\n가장 작은 $k$는 $t=8$일 때 생긴다.\n$k_{\\min}=-2+\\dfrac3{8-2}-\\sqrt{16}$\n$=-2+\\dfrac12-4$\n$=-\\dfrac{11}{2}$\n\n이때 $t=8$에서 실제로 교점이 하나 생긴다.\n따라서 정답은 ①이다.",

    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q06-solution.svg",

    "solutionImageAlt": "유리함수와 무리함수의 끝점 교점을 나타낸 해설 그래프",

    "solutionImageCaption": "구간 [5,8]에서 한 교점과 k의 최솟값 −11/2를 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "중",
    "category": "절댓값과 유리함수",
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
    "content": "함수 $y=\\left|\\dfrac{2x+1}{-x+3}\\right|$의 그래프와 직선 $y=k$ ($k$는 상수)의 교점의 개수를 $N(k)$라 하자. $N(1)+N(2)+N(3)$의 값을 구하면? [4.4점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "$y=k$와의 교점은\n$\\left|\\dfrac{2x+1}{3-x}\\right|=k\\quad(x\\ne3)$\n를 만족하는 서로 다른 실수 $x$의 개수이다.\n$k=1,2,3$은 모두 양수이므로 다음 두 경우를 나눈다.\n\n① $\\dfrac{2x+1}{3-x}=k$\n$2x+1=3k-kx$\n$(k+2)x=3k-1$\n$\\Rightarrow x=\\dfrac{3k-1}{k+2}$\n$k=1,2,3$에서 각각 해가 하나이고 $x=3$이 되지 않는다.\n\n② $\\dfrac{2x+1}{3-x}=-k$\n$2x+1=-3k+kx$\n$(2-k)x=-3k-1$\n$k=1,3$에서는 각각 해가 하나이다.\n$k=2$이면 $0\\cdot x=-7$로 해가 없다.\n\n$k\\gt0$이므로 ①과 ②의 해는 겹칠 수 없다.\n$N(1)=2,\\quad N(2)=1,\\quad N(3)=2$\n$N(1)+N(2)+N(3)=2+1+2=5$\n\n따라서 정답은 ②이다.",

    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q07-solution.svg",

    "solutionImageAlt": "절댓값 유리함수와 수평선의 교점 개수를 나타낸 해설 그래프",

    "solutionImageCaption": "k=1,2,3 수평선과의 교점 수를 비교하여 N(1),N(2),N(3)을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "하",
    "category": "서로소",
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
    "content": "1에서 100까지의 자연수 중에서 10과 서로소인 것의 개수를 구하면? [3.7점]",
    "choices": [
      "$40$",
      "$36$",
      "$24$",
      "$20$",
      "$16$"
    ],
    "answer": "①",
    "solution": "$10=2\\cdot5$이므로 $10$과 서로소인 자연수는 $2$의 배수도, $5$의 배수도 아니다.\n$1$부터 $100$까지\n$2$의 배수: $100\\div2=50$개\n$5$의 배수: $100\\div5=20$개\n두 종류에 함께 들어가는 $10$의 배수: $100\\div10=10$개\n\n$2$와 $5$의 배수를 그대로 빼면 $10$의 배수가 두 번 빠지므로 한 번 돌려놓는다.\n$100-(50+20-10)$\n$=100-60$\n$=40$\n\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "교환 채점",
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
    "content": "A, B, C, D, E 5명의 학생이 수학 시험을 보고 서로 답안지를 바꿔서 채점하기로 하였다. 채점할 수 있는 모든 경우의 수를 구하면? [3.9점]",
    "choices": [
      "$40$",
      "$42$",
      "$43$",
      "$44$",
      "$46$"
    ],
    "answer": "④",
    "solution": "각 학생은 답안지 하나만 맡고, 자기 답안지는 맡지 않는다.\n서로 바꿔 채점하는 학생들을 묶으면 한 묶음에 $1$명만 있을 수 없으므로, $5$명은 다음 두 경우뿐이다.\n\n① $2$명이 서로의 답안지를 바꾸고 나머지 $3$명이 돌려 맡는 경우\n서로 바꾸는 $2$명을 고르면\n$ {}_5C_2=\\dfrac{5\\cdot4}{2}=10$가지이다.\n남은 $3$명은 자기 것을 피하여 돌려 맡는 방법이 두 방향으로 $2$가지이다.\n$10\\cdot2=20$가지\n\n② $5$명이 한 묶음으로 답안지를 돌려 맡는 경우\n$A$의 답안지를 받을 사람부터 차례로 연결한다고 생각하자.\n$A$를 기준으로 나머지 $4$명의 연결 순서를 정하면\n$4\\cdot3\\cdot2\\cdot1=4!=24$가지이다.\n이는 아무도 자기 답안지를 맡지 않고, ①과도 겹치지 않는다.\n\n전체 경우의 수는\n$20+24=44$가지이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "하",
    "category": "순열과 조합",
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
    "content": "${}_6P_2+{}_5C_0$의 값을 구하면? [3.5점]",
    "choices": [
      "$27$",
      "$28$",
      "$29$",
      "$30$",
      "$31$"
    ],
    "answer": "⑤",
    "solution": "순열은 서로 다른 대상을 순서 있게 뽑는 경우의 수이므로\n$ {}_6P_2=6\\cdot5=30$이다.\n\n조합에서 아무것도 뽑지 않는 방법은 한 가지이므로\n$ {}_5C_0=1$이다.\n\n따라서\n$ {}_6P_2+{}_5C_0$\n$=30+1$\n$=31$이다.\n\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
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
      "객관식"
    ],
    "wide": false,
    "content": "5개의 문자 $a,b,c,d,e$를 일렬로 배열하여 사전식으로 $abcde$부터 $edcba$까지 나열하였을 때, $bdcea$는 몇 번째인지 구하면? [3.9점]",
    "choices": [
      "$36$",
      "$38$",
      "$40$",
      "$42$",
      "$44$"
    ],
    "answer": "③",
    "solution": "사전식 순서에서는 앞자리부터 비교한다. $bdcea$보다 앞에 놓이는 배열을 차례로 센다.\n\n① 첫 글자가 $a$인 배열\n남은 네 글자의 순서는 자유로우므로\n$4!=24$개\n\n② 첫 글자는 $b$이고 둘째 글자가 $d$보다 앞서는 배열\n가능한 둘째 글자는 $a,c$ 두 개이다.\n$2\\cdot3!=2\\cdot6=12$개\n\n③ 처음 두 글자가 $bd$이고 셋째 글자가 $c$보다 앞서는 배열\n가능한 셋째 글자는 $a$뿐이다.\n$2!=2$개\n\n④ 처음 세 글자가 $bdc$이고 넷째 글자가 $e$보다 앞서는 배열\n넷째 글자가 $a$인 $bdcae$ 한 개이다.\n\n$bdcea$보다 앞서는 배열은\n$24+12+2+1=39$개이므로\n$bdcea$는 $39+1=40$번째이다.\n\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "순열식",
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
    "content": "두 자연수 $m$, $n$에 대하여 $m\\times{}_nP_5=600\\times{}_nP_3$, ${}_nP_6=m\\times{}_nP_4$가 성립할 때, $m+n$의 값을 구하면? [4.0점]",
    "choices": [
      "$26$",
      "$27$",
      "$28$",
      "$29$",
      "$30$"
    ],
    "answer": "④",
    "solution": "순열의 앞부분이 서로 같으므로 공통인수를 약분한다. 두 식에 $ {}_nP_6$이 있으므로 $n\\ge6$이다.\n\n첫째 조건\n$m\\cdot{}_nP_5=600\\cdot{}_nP_3$\n$ {}_nP_5={}_nP_3(n-3)(n-4)$\n$\\Rightarrow m(n-3)(n-4)=600\\quad\\cdots$ ①\n\n둘째 조건\n$ {}_nP_6=m\\cdot{}_nP_4$\n$ {}_nP_6={}_nP_4(n-4)(n-5)$\n$\\Rightarrow m=(n-4)(n-5)\\quad\\cdots$ ②\n\n②를 ①에 대입하면\n$(n-5)(n-4)^2(n-3)=600$이다.\n$t=n-4$라 두면 $t\\ge2$이고\n$(t-1)t^2(t+1)=600$\n$t^2(t^2-1)=600$이다.\n\n$t=4$이면 $16\\cdot15=240$,\n$t=5$이면 $25\\cdot24=600$이다.\n$t\\ge2$에서 왼쪽은 $t$가 증가하면 커지므로 $t=5$만 가능하다.\n$n=9,\\quad m=5\\cdot4=20$\n$m+n=20+9=29$\n\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "중",
    "category": "순서쌍의 개수",
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
    "content": "각 면에 1부터 6까지의 정수가 각각 적힌 정육면체의 주사위를 세 번 던져서 나온 수를 차례로 $x,y,z$라고 할 때, $x+2y+3z=15$를 만족하는 순서쌍 $(x,y,z)$의 개수를 구하면? [4.0점]",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "주사위를 세 번 던지므로 $x,y,z$는 모두 $1$부터 $6$까지의 정수이다.\n$x+2y+3z=15$\n$\\Rightarrow x+2y=15-3z$\n\n$x+2y\\ge1+2=3$이므로 $z\\le4$이다. $z=1,2,3,4$로 나누어 센다.\n\n① $z=1$이면 $x+2y=12$\n$(x,y)=(6,3),(4,4),(2,5)$\n$\\Rightarrow 3$개\n\n② $z=2$이면 $x+2y=9$\n$(x,y)=(5,2),(3,3),(1,4)$\n$\\Rightarrow 3$개\n\n③ $z=3$이면 $x+2y=6$\n$(x,y)=(4,1),(2,2)$\n$\\Rightarrow 2$개\n\n④ $z=4$이면 $x+2y=3$\n$(x,y)=(1,1)$\n$\\Rightarrow 1$개\n\n각 경우는 $z$값이 달라 겹치지 않는다.\n$3+3+2+1=9$개\n\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수의 기본 원리",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "하",
    "category": "악수의 수",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "어떤 모임에 부부 8쌍이 참석하였다. 부부끼리는 서로 악수하지 않고, 다른 사람과는 빠짐없이 서로 한 번씩 악수할 때, 전체 악수의 수를 구하면? [3.8점]",
    "choices": [
      "$104$",
      "$106$",
      "$108$",
      "$110$",
      "$112$"
    ],
    "answer": "⑤",
    "solution": "참석자는 부부 $8$쌍이므로 모두 $8\\cdot2=16$명이다.\n악수 한 번은 서로 다른 두 사람을 한 쌍으로 고르는 일이므로 순서를 구별하지 않는 조합을 쓴다.\n\n부부 조건을 무시한 두 사람의 쌍은\n$ {}_{16}C_2=\\dfrac{16\\cdot15}{2}$\n$=120$쌍이다.\n\n이 중 부부끼리의 쌍은 부부마다 정확히 한 쌍씩\n$8$쌍이므로 제외한다.\n$120-8=112$\n\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-08-COMBINATION_BASIC",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
    "category": "유리함수와 직사각형",
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
    "image": "assets/images/24_매산여고_2학기_기말_고1_기출/q15.png",
    "imageSize": "large",
    "content": "그림과 같이 함수 $y=\\dfrac3{x-1}+3$의 그래프 위의 한 점 P에서 이 함수의 그래프의 두 점근선에 내린 수선의 발을 각각 M, N이라 하고, 두 점근선의 교점을 Q라 하자. 사각형 PNQM의 둘레의 길이의 최솟값을 구하면? (단, P는 제1사분면 위의 점이다.) [4.2점]",
    "choices": [
      "$4\\sqrt2$",
      "$4\\sqrt3$",
      "$2\\sqrt2$",
      "$2\\sqrt3$",
      "$2\\sqrt5$"
    ],
    "answer": "②",
    "solution": "두 점근선은 $x=1,\\ y=3$이므로 교점은 $Q(1,3)$이다.\n함수 $y=\\dfrac3{x-1}+3$에서 $P$가 제1사분면에 있으려면 $x_P\\gt1$이어야 한다. 실제로 $0\\lt x_P\\lt1$이면 $y_P\\lt0$이다.\n\n$u=x_P-1\\gt0$이라 두면\n$P=\\left(1+u,\\,3+\\dfrac3u\\right)$이다.\n\n점근선에 내린 두 수선과 점근선이 이루는 사각형 $PNQM$은 직사각형이다.\n가로 길이 $=u$\n세로 길이 $=\\dfrac3u$\n이므로 둘레 $L$은\n$L=2\\left(u+\\dfrac3u\\right)$이다.\n\n양수 $u,\\dfrac3u$에 대해\n$u+\\dfrac3u\\ge2\\sqrt{u\\cdot\\dfrac3u}$\n$=2\\sqrt3$이다.\n등호는 $u=\\dfrac3u$, 즉 $u=\\sqrt3$일 때 성립한다.\n이때 $P=(1+\\sqrt3,3+\\sqrt3)$은 실제로 제1사분면에 있다.\n\n따라서 둘레의 최솟값은\n$L_{\\min}=2\\cdot2\\sqrt3=4\\sqrt3$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "방정식의 실근 개수",
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
    "content": "정수 $k$에 대하여 $x$에 대한 방정식 $\\sqrt{-x+k}=\\dfrac{x-3}{x-2}$ $(x\\le k,x\\ne2)$의 서로 다른 실근의 개수를 $f(k)$라고 할 때, $f(k)=2$를 만족시키는 $k$의 최솟값을 구하면? [4.1점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "왼쪽은 제곱근이므로 항상 $0$ 이상이다. 따라서 오른쪽도 $0$ 이상이어야 한다.\n$\\dfrac{x-3}{x-2}\\ge0\\quad(x\\ne2)$\n$\\Rightarrow x\\lt2$ 또는 $x\\ge3$이다.\n또한 $x\\le k$를 만족해야 한다.\n\n① $x\\lt2$에서의 해\n$y=\\sqrt{k-x}$는 $x$가 커질수록 감소한다.\n$y=\\dfrac{x-3}{x-2}=1-\\dfrac1{x-2}$는 $x$가 커질수록 증가한다.\n따라서 교점은 많아야 하나이다.\n$x\\to-\\infty$에서는 제곱근 값이 크게 증가하고, 분수식의 값은 $1$에 가까워진다.\n$k\\lt2$이면 $x=k$에서 왼쪽은 $0$, 오른쪽은 양수이다.\n$k\\ge2$이면 $x$가 $2$의 왼쪽에서 가까워질 때 오른쪽은 크게 증가한다.\n어느 경우든 대소가 한 번 바뀌므로 해는 정확히 $1$개이다.\n\n② $x\\ge3$에서의 해\n정의역 $x\\le k$를 함께 만족하려면 $k\\ge3$이어야 한다.\n$k=3$이면 $x=3$에서 양변이 $0$이므로 해가 하나이다.\n$k\\gt3$이면\n$x=3$에서 $\\sqrt{k-3}\\gt0= \\dfrac{3-3}{3-2}$이고,\n$x=k$에서 $0\\lt\\dfrac{k-3}{k-2}$이다.\n왼쪽은 감소, 오른쪽은 증가하므로 이 구간에서도 해는 정확히 하나이다.\n\n따라서\n$k\\le2\\Rightarrow f(k)=1$\n$k\\ge3\\Rightarrow f(k)=2$이다.\n구하는 정수 $k$의 최솟값은 $3$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "무리함수의 치역",
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
    "content": "정의역이 집합 $\\{x\\mid x\\ge0\\}$의 부분집합인 함수 $y=\\sqrt{px+q}+r$ $(p\\gt 0)$의 치역이 $\\{y\\mid y\\ge3\\}$가 되도록 하는 상수 $p,q,r$에 대하여 $q-4r^2$의 최댓값을 구하면? [4.3점]",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "④",
    "solution": "$p\\gt0$이므로 함수 $y=\\sqrt{px+q}+r$는 정의역에서 $x$가 커질수록 증가한다.\n치역이 $[3,\\infty)$이므로 함수값이 처음 $3$이 되는 정의역의 왼쪽 끝을 $x=\\alpha$라 두면 $\\alpha\\ge0$이다.\n\n$\\sqrt{p\\alpha+q}+r=3$\n$\\Rightarrow\\sqrt{p\\alpha+q}=3-r$\n따라서 $r\\le3$이고\n$p\\alpha+q=(3-r)^2$이다.\n$\\Rightarrow q=(3-r)^2-p\\alpha$\n\n$p\\gt0$, $\\alpha\\ge0$이므로 $p\\alpha\\ge0$이다.\n따라서\n$q\\le(3-r)^2$이고\n$q-4r^2\\le(3-r)^2-4r^2$\n$=9-6r-3r^2$\n$=12-3(r+1)^2$\n$\\le12$이다.\n\n등호는 $\\alpha=0,\\ r=-1$일 때 가능하다.\n이때 $q=(3+1)^2=16$이고, 임의의 $p\\gt0$에 대하여\n$y=\\sqrt{px+16}-1\\quad(x\\ge0)$\n의 치역은 실제로 $[3,\\infty)$이다.\n\n따라서 구하는 최댓값은 $12$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "무리함수와 직선",
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
    "content": "무리함수 $y=\\sqrt{|x-1|-4}$의 그래프와 직선 $y=-x+k$가 만나지 않도록 하는 상수 $k$의 범위가 $a\\lt k\\lt b$일 때, $a+b$의 값을 구하면? (단, $a,b$는 상수) [4.4점]",
    "choices": [
      "$\\dfrac32$",
      "$\\dfrac74$",
      "$\\dfrac94$",
      "$\\dfrac52$",
      "$\\dfrac72$"
    ],
    "answer": "③",
    "solution": "두 그래프의 교점에서는\n$\\sqrt{|x-1|-4}=-x+k$\n이므로\n$k=x+\\sqrt{|x-1|-4}$이다.\n근호 조건은 $|x-1|\\ge4$이므로\n$x\\le-3$ 또는 $x\\ge5$이다.\n\n① $x\\le-3$\n$t=\\sqrt{-x-3}\\ge0$이라 두면\n$x=-t^2-3$이다.\n$k=-t^2-3+t$\n$=-(t-\\dfrac12)^2-\\dfrac{11}{4}$\n$\\le-\\dfrac{11}{4}$이다.\n등호는 $t=\\dfrac12$일 때 성립한다.\n\n② $x\\ge5$\n$t=\\sqrt{x-5}\\ge0$이라 두면\n$x=t^2+5$이다.\n$k=t^2+t+5$\n$\\ge5$이다.\n등호는 $t=0$일 때 성립한다.\n\n두 구간에서 가능한 $k$의 범위는\n$k\\le-\\dfrac{11}{4}$ 또는 $k\\ge5$이다.\n따라서 만나지 않는 범위는\n$-\\dfrac{11}{4}\\lt k\\lt5$이다.\n\n$a=-\\dfrac{11}{4},\\quad b=5$\n$a+b=-\\dfrac{11}{4}+\\dfrac{20}{4}=\\dfrac94$\n\n따라서 정답은 ③이다.",
    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q18-solution.svg",
    "solutionImageAlt": "두 그래프가 만날 수 있는 k의 범위는 −11/4 이하와 5 이상이며, 사이 구간은 교점이 없음을 나타낸 수직선",
    "solutionImageCaption": "k≤−11/4 또는 k≥5에서는 교점이 있고, −11/4<k<5에서는 교점이 없다.",
    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC",
    "subUnit": "무리함수의 뜻과 계산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "상",
    "category": "조건부 배치",
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
    "content": "학생 4명과 교사 3명이 다음 조건을 만족하도록 7명의 자리를 배치하는 경우의 수를 구하면 $A\\times4!$이다. 상수 $A$의 값을 구하면? [4.5점]<br>조건1) 앞줄에 3명, 뒷줄에 4명을 배치한다.<br>조건2) 각 줄에는 적어도 한 명 이상의 교사가 배치되고, 교사끼리는 같은 줄에서 이웃하지 않도록 배치한다.",
    "choices": [
      "$70$",
      "$72$",
      "$74$",
      "$76$",
      "$78$"
    ],
    "answer": "⑤",
    "solution": "교사 $3$명은 모두 서로 다르고, 학생 $4$명도 모두 서로 다르다.\n먼저 교사가 앉는 자리만 정한 다음 교사와 학생을 배열한다.\n각 줄에 교사가 적어도 한 명 있어야 하므로 교사 수의 분배는 두 경우이다.\n\n① 앞줄 $1$명, 뒷줄 $2$명\n앞줄의 교사 자리는 $3$자리 중 한 곳이므로 $3$가지이다.\n뒷줄 $4$자리 중 서로 이웃하지 않는 두 자리는\n$(1,3),(1,4),(2,4)$로 $3$가지이다.\n$\\Rightarrow3\\cdot3=9$가지\n\n② 앞줄 $2$명, 뒷줄 $1$명\n앞줄 $3$자리에서 교사는 양 끝자리에만 앉을 수 있으므로 $1$가지이다.\n뒷줄의 교사 자리는 $4$가지이다.\n$\\Rightarrow1\\cdot4=4$가지\n\n교사 자리 선택은 $9+4=13$가지이다.\n그 자리에 서로 다른 교사 $3$명을 놓는 방법은 $3!$가지,\n남은 자리에 서로 다른 학생 $4$명을 놓는 방법은 $4!$가지이다.\n전체 경우의 수는\n$13\\cdot3!\\cdot4!$\n$=78\\cdot4!$이다.\n\n따라서 $A=78$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "중",
    "category": "비밀번호의 수",
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
    "content": "지수는 인터넷 카페에 가입하면서 $1,2,3,4,5,6,7$의 7개의 숫자 중에서 서로 다른 5개의 숫자를 사용하여 다섯 자리의 비밀번호를 만들려고 한다. 각 자리에 짝수와 홀수 또는 홀수와 짝수를 교대로 사용하여 비밀번호를 만드는 방법의 수를 구하면? [4.4점]",
    "choices": [
      "$216$",
      "$217$",
      "$218$",
      "$219$",
      "$220$"
    ],
    "answer": "①",
    "solution": "사용 가능한 홀수는 $1,3,5,7$의 $4$개이고 짝수는 $2,4,6$의 $3$개이다.\n서로 다른 $5$개를 사용하고 홀짝을 번갈아 놓으므로 시작 숫자의 종류에 따라 두 경우로 나눈다.\n\n① 홀수로 시작: 홀-짝-홀-짝-홀\n홀수 $3$자리는 서로 다른 $4$개 중 순서 있게 선택하므로\n$ {}_4P_3=4\\cdot3\\cdot2=24$가지이다.\n짝수 $2$자리는 서로 다른 $3$개 중 순서 있게 선택하므로\n$ {}_3P_2=3\\cdot2=6$가지이다.\n$\\Rightarrow24\\cdot6=144$가지\n\n② 짝수로 시작: 짝-홀-짝-홀-짝\n짝수 $3$자리는\n$ {}_3P_3=3\\cdot2\\cdot1=6$가지,\n홀수 $2$자리는\n$ {}_4P_2=4\\cdot3=12$가지이다.\n$\\Rightarrow6\\cdot12=72$가지\n\n두 경우는 첫 자리의 홀짝이 달라 서로 겹치지 않는다.\n$144+72=216$가지이다.\n\n따라서 정답은 ①이다.",
    "subUnitKey": "H15-SB-07-PERMUTATION_BASIC",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
    "level": "중",
    "category": "감소함수의 개수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 1] 두 집합 $X=\\{1,2,3,4,5\\}$, $Y=\\{2,3,4,5,6,7,8,9\\}$에 대하여 다음 조건을 모두 만족시키는 함수 $f:X\\to Y$의 개수를 구하시오. [6점] (부분 점수 있음)<br>(가) $x_1\\lt x_2$이면 $f(x_1)\\gt f(x_2)$<br>(나) $f(3)=6$",
    "choices": [],
    "answer": "$18$",
    "solution": "조건 (가)는 $x$가 커질수록 함수값이 엄격히 작아진다는 뜻이다.\n따라서\n$f(1)\\gt f(2)\\gt f(3)=6\\gt f(4)\\gt f(5)$이다.\n\n먼저 $f(1),f(2)$를 정한다.\n$6$보다 큰 $Y$의 원소는 $7,8,9$로 $3$개이다.\n서로 다른 두 값을 고르면 더 큰 값이 $f(1)$, 작은 값이 $f(2)$로 자동 결정된다.\n$ {}_3C_2=\\dfrac{3\\cdot2}{2}=3$가지\n\n다음으로 $f(4),f(5)$를 정한다.\n$6$보다 작은 $Y$의 원소는 $2,3,4,5$로 $4$개이다.\n이 중 두 값을 고르면 큰 값이 $f(4)$, 작은 값이 $f(5)$로 자동 결정된다.\n$ {}_4C_2=\\dfrac{4\\cdot3}{2}=6$가지\n\n큰 값 두 개의 선택과 작은 값 두 개의 선택은 독립이고, 각 선택마다 조건을 만족하는 함수가 정확히 하나씩 정해진다.\n$3\\cdot6=18$개\n\n따라서 구하는 함수의 개수는 $18$개이다.",
    "subUnitKey": "H15-SB-03-FUNCTION_RELATION",
    "subUnit": "함수의 뜻과 대응",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 22,
    "level": "상",
    "category": "유리함수와 사분면",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "content": "[서술형 2] 함수 $y=\\dfrac{k}{x+2}-2$의 그래프가 모든 사분면을 지나고, 함수 $y=\\dfrac{k}{x-3}+3$의 그래프가 제3사분면을 지나지 않도록 하는 정수 $k$를 모두 구하시오. [7점] (부분 점수 있음)",
    "choices": [],
    "answer": "$k=5,6,7,8,9$",
    "solution": "첫 그래프는 모든 사분면을 지나야 하고, 둘째 그래프는 제3사분면을 지나면 안 된다. 각각의 조건을 구한 뒤 공통 범위를 찾는다.\n\n① $y=\\dfrac{k}{x+2}-2$\n이 그래프가 제1사분면을 지나려면 어떤 $x\\gt0$에서 $y\\gt0$이어야 한다.\n$\\dfrac{k}{x+2}-2\\gt0$\n$\\Rightarrow k\\gt2(x+2)=2x+4$\n$x\\gt0$인 수가 존재할 조건은 $k\\gt4$이다.\n이때 $x\\to-2$의 양쪽과 충분히 큰 양의 $x$를 살펴보면 제2, 제3, 제4사분면도 각각 지나므로, 첫째 조건은 $k\\gt4$이다.\n\n② $y=\\dfrac{k}{x-3}+3$\n첫째 조건에 따라 $k\\gt4\\gt0$만 생각하면 된다.\n제3사분면은 $x\\lt0,\\ y\\lt0$인 부분이다.\n$x\\lt0$에서\n$\\dfrac{k}{x-3}+3\\lt0$\n$\\Leftrightarrow k\\gt3(3-x)=9-3x$이다.\n$x\\lt0$인 수 중 이를 만족하는 것이 존재하려면 $k\\gt9$이어야 한다.\n그러므로 제3사분면을 지나지 않을 조건은 $k\\le9$이다.\n\n두 조건을 합치면\n$4\\lt k\\le9$이다.\n정수 $k$는 $5,6,7,8,9$이다.\n\n따라서 구하는 값은 $k=5,6,7,8,9$이다.",

    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q22-solution.svg",

    "solutionImageAlt": "두 유리함수의 사분면 조건을 나타낸 해설 그래프",

    "solutionImageCaption": "k=7 대표 그래프와 허용 정수 5,6,7,8,9를 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-04-RATIONAL_GRAPH",
    "subUnit": "유리함수의 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "level": "상",
    "category": "무리함수와 역함수",
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
    "content": "[서술형 3] 함수 $f(x)=\\sqrt{3x+4}$의 그래프와 그 역함수 $f^{-1}(x)$의 그래프와 만나는 점을 A라 하자. 함수 $y=f(x)$ 위의 점 $B(\\dfrac53,3)$을 지나고 기울기가 $-1$인 직선 $l$이 $y=f^{-1}(x)$와 만나는 점을 C라 하자. 다음에 답하시오. [7점] (부분 점수 있음)<br>1) $f(x)$의 역함수를 구하시오. (2점)<br>2) 삼각형 ABC의 넓이를 구하시오. (5점)",
    "choices": [],
    "answer": "(1) $f^{-1}(x)=\\dfrac{x^2-4}{3}\\;(x\\ge0)$, (2) $\\dfrac{20}{9}$",
    "solution": "(1) 역함수의 식과 정의역\n$f(x)=\\sqrt{3x+4}$의 정의역은 $x\\ge-\\dfrac43$, 치역은 $y\\ge0$이다.\n$y=\\sqrt{3x+4}$\n$\\Rightarrow y^2=3x+4$\n$\\Rightarrow x=\\dfrac{y^2-4}{3}$\n여기서 $x$와 $y$를 서로 바꾸면\n$f^{-1}(x)=\\dfrac{x^2-4}{3}\\quad(x\\ge0)$이다.\n역함수의 정의역은 원래 함수의 치역이므로 $x\\ge0$임에 유의한다.\n\n(2) 삼각형 $ABC$의 넓이\n$f$는 증가함수이므로 $f$와 $f^{-1}$의 교점 $A$는 대칭축 $y=x$ 위에서 찾는다.\n$\\sqrt{3x+4}=x\\quad(x\\ge0)$\n$\\Rightarrow 3x+4=x^2$\n$\\Rightarrow(x-4)(x+1)=0$\n$x\\ge0$이므로 $x=4$이다.\n$\\Rightarrow A=(4,4)$\n\n점 $B(\\dfrac53,3)$을 지나고 기울기가 $-1$인 직선 $l$은\n$y-3=-\\left(x-\\dfrac53\\right)$\n$\\Rightarrow y=-x+\\dfrac{14}{3}$\n$\\Rightarrow x+y-\\dfrac{14}{3}=0$이다.\n\n$l$과 $f^{-1}$의 교점 $C$에서는\n$\\dfrac{x^2-4}{3}=-x+\\dfrac{14}{3}$\n$\\Rightarrow x^2+3x-18=0$\n$\\Rightarrow(x-3)(x+6)=0$\n역함수의 정의역 $x\\ge0$에 따라 $x=3$이다.\n$\\Rightarrow C=(3,\\dfrac53)$\n\n$B$와 $C$는 모두 직선 $l$ 위에 있으므로 선분 $BC$를 밑변으로 잡는다.\n$BC=\\sqrt{\\left(3-\\dfrac53\\right)^2+\\left(\\dfrac53-3\\right)^2}$\n$=\\sqrt{\\dfrac{16}{9}+\\dfrac{16}{9}}$\n$=\\dfrac{4\\sqrt2}{3}$\n\n높이는 점 $A(4,4)$에서 직선 $x+y-\\dfrac{14}{3}=0$까지의 거리이다.\n$h=\\dfrac{|4+4-\\dfrac{14}{3}|}{\\sqrt{1^2+1^2}}$\n$=\\dfrac{10}{3\\sqrt2}$\n$=\\dfrac{5\\sqrt2}{3}$\n\n따라서 삼각형의 넓이는\n$\\dfrac12\\cdot BC\\cdot h$\n$=\\dfrac12\\cdot\\dfrac{4\\sqrt2}{3}\\cdot\\dfrac{5\\sqrt2}{3}$\n$=\\dfrac{20}{9}$이다.\n\n따라서 (1) $f^{-1}(x)=\\dfrac{x^2-4}{3}\\ (x\\ge0)$, (2) 삼각형 $ABC$의 넓이는 $\\dfrac{20}{9}$이다.",
    "solutionImage": "assets/images/24_매산여고_2학기_기말_고1_기출/q23-solution.svg",
    "solutionImageAlt": "함수와 역함수, y=x, 삼각형 ABC를 나타낸 해설 그래프",
    "solutionImageCaption": "역함수의 정의역과 y=x 위의 교점 A, 직선 l 위의 B·C를 표시하여 넓이를 확인한다.",
    "solutionImageSize": "full",
    "subUnitKey": "H15-SB-05-IRRATIONAL_INVERSE",
    "subUnit": "무리함수와 역함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
