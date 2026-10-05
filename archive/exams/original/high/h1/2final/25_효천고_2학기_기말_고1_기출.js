window.examTitle = "25_효천고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "명제와 조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제와 조건"
    ],
    "wide": false,
    "content": "다음 중 명제인 것은? [3.1점]",
    "choices": [
      "순천효천고등학교는 멋진 학교다.",
      "$12$는 $4$의 배수이다.",
      "$x\\gt 3$",
      "$7$은 행운의 숫자이다.",
      "$x$는 $3$보다 작은 수이다."
    ],
    "answer": "②",
    "solution": "명제는 참인지 거짓인지 판정할 수 있는 문장이다.\n①의 ‘멋진’과 ④의 ‘행운’은 사람마다 판단이 달라진다.\n③과 ⑤는 x의 값이 정해져야 참과 거짓을 판정할 수 있다.\n②는 $12=4\\cdot3$이므로 참으로 정해지는 문장이다.\n따라서 명제인 것은 ②이다.",
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 2,
    "level": "중",
    "category": "함수의 일치",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 일치"
    ],
    "wide": false,
    "content": "정의역이 $\\{0,2\\}$인 두 함수 $f(x)=ax+b$, $g(x)=x^2+1$에 대하여 $f=g$이다. 두 실수 $a$, $b$에 대하여 $a+b$의 값은? [3.1점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "두 함수가 같으려면 정의역의 원소 0과 2에서 함수값이 각각 같아야 한다.\n먼저 $x=0$을 대입하면\n$f(0)=b$, $g(0)=1$이므로 $b=1$이다.\n이번에는 $x=2$를 대입하면\n$f(2)=2a+b$, $g(2)=5$이다.\n따라서 $2a+1=5$이고 $a=2$이다.\n그러므로 $a+b=2+1=3$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
    "level": "하",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수"
    ],
    "wide": false,
    "content": "두 함수 $f(x)=2x-3$, $g(x)=-x+1$에 대하여 $(f\\circ g)(0)+(g\\circ f)(0)$의 값은? [3.2점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "합성함수에서는 괄호 안의 함수값을 먼저 구한다.\n$g(0)=1$이므로\n$(f\\circ g)(0)=f(1)=2\\cdot1-3=-1$이다.\n또 $f(0)=-3$이므로\n$(g\\circ f)(0)=g(-3)=-(-3)+1=4$이다.\n두 값을 더하면 $-1+4=3$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 4,
    "level": "하",
    "category": "역함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수"
    ],
    "wide": false,
    "content": "함수 $f(x)=x-2a$에 대하여 $f(1)=-1$, $f^{-1}(3)=b$일 때, $a+b$의 값은? (단, $a$, $b$는 상수이다.) [3.4점]",
    "choices": [
      "$6$",
      "$5$",
      "$4$",
      "$3$",
      "$2$"
    ],
    "answer": "①",
    "solution": "$f(1)=-1$을 식에 대입해 먼저 $a$를 구한다.\n$1-2a=-1$\n$2a=2$, 따라서 $a=1$이다.\n그러면 $f(x)=x-2$이다.\n$f^{-1}(3)=b$라는 것은 $f(b)=3$이라는 뜻이므로\n$b-2=3$, 따라서 $b=5$이다.\n그러므로 $a+b=1+5=6$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "중",
    "category": "유리식의 계산",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리식의 계산"
    ],
    "wide": false,
    "content": "다음 식의 분모를 $0$으로 만들지 않는 모든 실수 $x$에 대하여 $\\dfrac{x+1}{x^2+x}\\times\\dfrac{x^2-9}{x-2}\\times\\dfrac{1}{x+3}$을 간단히 한 식은? [3.4점]",
    "choices": [
      "$\\dfrac{x-3}{x(x-2)}$",
      "$\\dfrac{1}{x}$",
      "$\\dfrac{x+1}{(x-2)(x+3)}$",
      "$\\dfrac{x-3}{x-2}$",
      "$\\dfrac{x-3}{(x+1)(x+2)}$"
    ],
    "answer": "①",
    "solution": "원래 식의 분모가 0이 되지 않으려면 $x\\ne0,-1,2,-3$이어야 한다.\n분모와 분자를 먼저 인수분해한다.\n$x^2+x=x(x+1)$\n$x^2-9=(x-3)(x+3)$\n따라서 주어진 식은\n$\\dfrac{x+1}{x(x+1)}\\times\\dfrac{(x-3)(x+3)}{x-2}\\times\\dfrac1{x+3}$이다.\n허용된 x에서는 $x+1$과 $x+3$을 약분할 수 있으므로\n$\\dfrac{x-3}{x(x-2)}$가 된다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "중",
    "category": "명제와 진리집합",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제와 진리집합"
    ],
    "wide": false,
    "content": "전체집합 $U$에 대하여 세 조건 $p$, $q$, $r$의 진리집합을 각각 $P$, $Q$, $R$이라 하자.<br>$P\\cap R=P$, $P\\cup Q^C=Q^C$일 때, 다음 중 항상 참인 명제는? [3.5점]",
    "choices": [
      "$p\\to q$",
      "$\\sim q\\to p$",
      "$q\\to\\sim p$",
      "$r\\to p$",
      "$q\\to r$"
    ],
    "answer": "③",
    "solution": "첫째 집합식 $P\\cap R=P$는 $P$의 원소가 모두 $R$에도 속한다는 뜻이다.\n따라서 $P\\subseteq R$이다.\n둘째 집합식 $P\\cup Q^C=Q^C$에서는 $P$의 원소가 모두 $Q^C$에 속한다.\n따라서 $P\\subseteq Q^C$이고, 여집합을 생각하면 $Q\\subseteq P^C$이다.\n그러므로 q가 참인 원소는 p가 거짓인 원소이므로 $q\\to\\sim p$가 항상 참이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 7,
    "level": "중",
    "category": "필요조건과 충분조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "필요조건과 충분조건"
    ],
    "wide": false,
    "content": "두 조건 $p$, $q$에 대하여 보기에서 $p$는 $q$이기 위한 필요조건이지만 충분조건이 아닌 것만을 있는 대로 고른 것은? (단, $a$, $b$, $c$는 실수이다.) [3.7점]<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">ㄱ. $p:a\\gt3$ &nbsp;&nbsp;&nbsp; $q:a\\gt7$<br>ㄴ. $p:x^2+y^2=0$인 실수 $x$, $y$ &nbsp;&nbsp;&nbsp; $q:x=0$, $y=0$<br>ㄷ. $p:ac=bc$ &nbsp;&nbsp;&nbsp; $q:a=b$</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "p가 q의 필요조건이라는 말은 $q\\to p$가 참이라는 뜻이고, p가 q의 충분조건이라는 말은 $p\\to q$가 참이라는 뜻이다. 각 보기에서 두 방향을 따로 살핀다.\n\nㄱ. $a>7$이면 $a>3$이므로 q이면 p이다. 하지만 $a=4$이면 p는 참이고 q는 거짓이다. 필요조건이지만 충분조건은 아니다.\n\nㄴ. 실수의 제곱은 0 이상이므로 $x^2+y^2=0$이면 $x=0$, $y=0$이다. 반대로 $x=0$, $y=0$이면 제곱의 합은 0이다. 두 조건은 서로 필요충분조건이다.\n\nㄷ. $a=b$이면 양변에 c를 곱해 $ac=bc$이다. 반대로 $c=0$, $a=1$, $b=2$이면 $ac=bc$는 참이지만 $a=b$는 거짓이다. 필요조건이지만 충분조건은 아니다.\n\n따라서 해당하는 것은 ㄱ, ㄷ이고 정답은 ③이다.",
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 8,
    "level": "중",
    "category": "무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수의 그래프",
      "그래프"
    ],
    "wide": false,
    "content": "다음 중 무리함수 $y=-\\sqrt{-x+2}+4$에 대한 설명으로 옳지 않은 것은? [3.8점]",
    "choices": [
      "$x=2$일 때 최댓값 $4$를 갖는다.",
      "정의역은 $\\{x\\mid x\\le 2\\}$이다.",
      "치역은 $\\{y\\mid y\\le 4\\}$이다.",
      "그래프는 무리함수 $y=-\\sqrt{x+2}+4$의 그래프와 $y$축에 대하여 대칭이다.",
      "그래프는 모든 사분면을 지난다."
    ],
    "answer": "⑤",
    "solution": "제곱근 안이 0 이상이어야 하므로 정의역은 $x\\le2$이다.\n$x=2$에서 제곱근이 0이 되어 함수값은 4이고, 제곱근 앞의 부호가 음수이므로 이 값이 최댓값이다. 치역도 $y\\le4$이다.\n$y=-\\sqrt{x+2}+4$에서 x를 $-x$로 바꾸면 $y=-\\sqrt{-x+2}+4$가 되므로 ④도 옳다.\n실제로 $x=1$이면 $y=3$이어서 제1사분면을 지나고, $x=-1$이면 $y=4-\\sqrt3>0$이어서 제2사분면을 지난다. $x=-20$이면 $y=4-\\sqrt{22}<0$이어서 제3사분면도 지난다.\n한편 $x\\ge0$인 정의역에서는 $x\\le2$이고\n$y=4-\\sqrt{2-x}\\ge4-\\sqrt2>0$이다.\n따라서 제4사분면은 지나지 않는다. 모든 사분면을 지난다는 ⑤가 옳지 않다.\n따라서 정답은 ⑤이다.",

    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_기출/q08-solution.svg",

    "solutionImageAlt": "무리함수의 끝점·정의역·치역·사분면을 나타낸 해설 그래프",

    "solutionImageCaption": "끝점 (2,4)와 x절편 (−14,0)을 기준으로 제4사분면을 지나지 않음을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "함수의 성질",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 성질"
    ],
    "wide": false,
    "content": "임의의 두 정수 $a$, $b$에 대하여 함수 $f$가<br>$f(a+b)=f(a)+f(b)+3ab$를 만족시킬 때, $f(-4)+f(-2)+f(0)+f(2)+f(4)$의 값을 구하시오. [3.8점]",
    "choices": [
      "$48$",
      "$52$",
      "$56$",
      "$60$",
      "$64$"
    ],
    "answer": "④",
    "solution": "조건식에 $b=0$을 대입하면\n$f(a)=f(a)+f(0)$이므로 $f(0)=0$이다.\n이번에는 $b=-a$를 대입한다.\n$f(0)=f(a)+f(-a)-3a^2$\n$f(0)=0$이므로 $f(a)+f(-a)=3a^2$이다.\n$a=4$일 때 $f(4)+f(-4)=3\\cdot4^2=48$이다.\n$a=2$일 때 $f(2)+f(-2)=3\\cdot2^2=12$이다.\n따라서 구하는 합은 $48+12+0=60$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
    "category": "함수의 반복 합성",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 반복 합성"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4,5,6\\}$에 대하여 함수 $f:X\\to X$가 $f(x)=$ ($x^2$을 $7$로 나누었을 때의 나머지)일 때, $f^7(3)$의 값은? [3.9점]<br>(단, $f^1=f$, $f^2=f\\circ f$, $\\cdots$, $f^{n+1}=f\\circ f^n$, $n$은 자연수)",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$f(x)$는 $x^2$을 7로 나눈 나머지이므로, 3에서 시작해 함수값을 차례로 구한다.\n$f(3)=2$\n$f(2)=4$\n$f(4)=2$\n따라서 반복되는 값은 2와 4이고, 첫 번째 함수 적용부터 홀수 번째에는 2가 나온다.\n7은 홀수이므로 $f^7(3)=2$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
    "level": "중",
    "category": "무리함수와 역함수",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수와 역함수",
      "그래프"
    ],
    "wide": false,
    "content": "두 상수 $a$, $b$와 무리함수 $f(x)=\\sqrt{2x+a}+b$의 최솟값이 $2$이고, $y=f(x)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프의 교점의 $x$의 좌표가 $3$일 때, $f\\left(\\dfrac{9}{2}\\right)$의 값은? [4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "제곱근은 0 이상이고 가장 작은 값은 0이므로 $f$의 최솟값은 b이다.\n따라서 $b=2$이다.\n또 $f$는 증가함수이다. 증가함수와 그 역함수의 그래프가 만나는 점은 $y=x$ 위에 있다. 실제로 서로 다른 두 수 u, v가 $f(u)=v$, $f(v)=u$를 만족한다고 하면, $u<v$일 때 증가성으로 $f(u)<f(v)$, 즉 $v<u$가 되어 모순이다.\n교점의 x좌표가 3이므로 교점은 $(3,3)$이고 $f(3)=3$이다.\n$\\sqrt{6+a}+2=3$\n$\\sqrt{6+a}=1$, 따라서 $a=-5$이다.\n이제 주어진 함수에 $\\dfrac92$를 대입하면\n$f\\left(\\dfrac92\\right)=\\sqrt{9-5}+2=4$이다.\n따라서 정답은 ④이다.",

    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_기출/q11-solution.svg",

    "solutionImageAlt": "무리함수와 역함수의 그래프 및 교점 A를 나타낸 해설 그래프",

    "solutionImageCaption": "최솟값으로 b=2, 교점 A=(3,3)으로부터 a=−5를 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "상",
    "category": "유리함수의 대칭",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수의 대칭",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{3x+5}{x-a}$의 그래프가 두 직선 $y=x+5$, $y=-x+\\dfrac{1}{2}b$에 대하여 모두 대칭일 때, $ab$의 값을 구하면? (단, $a$, $b$는 상수이다.) [4.1점]",
    "choices": [
      "$4$",
      "$3$",
      "$0$",
      "$-3$",
      "$-4$"
    ],
    "answer": "⑤",
    "solution": "분자를 나누어 그래프의 중심을 확인한다.\n$y=\\dfrac{3x+5}{x-a}=3+\\dfrac{3a+5}{x-a}$\n두 점근선은 $x=a$, $y=3$이므로 중심은 $(a,3)$이다. 이 그래프의 대칭축은 중심을 지나며 기울기가 1 또는 -1인 두 직선이다.\n첫째 대칭축 $y=x+5$가 $(a,3)$을 지나므로\n$3=a+5$, 따라서 $a=-2$이다.\n둘째 대칭축 $y=-x+\\dfrac12b$도 $(a,3)$을 지난다.\n$3=-(-2)+\\dfrac12b$\n$\\dfrac12b=1$, 따라서 $b=2$이다.\n그러므로 $ab=(-2)\\cdot2=-4$이다.\n따라서 정답은 ⑤이다.",

    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_기출/q12-solution.svg",

    "solutionImageAlt": "유리함수의 중심과 두 대칭축을 나타낸 해설 그래프",

    "solutionImageCaption": "a=−2, b=2일 때 중심 C=(−2,3)과 대칭축 y=x+5, y=−x+1을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "상",
    "category": "유리함수와 무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수와 무리함수의 그래프",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{a}{x+b}+c$의 그래프가 다음 그림과 같다.<br>무리함수 $y=-\\sqrt{a(x-b)}+c$의 그래프가 제 $3$사분면을 지나지 않도록 하는 실수 $a$, $b$, $c$에 대하여 $a+b+c$의 최댓값은? [4.3점]",
    "image": "assets/images/25_효천고_2학기_기말_고1_기출/q13.png",
    "imageSize": "large",
    "choices": [
      "$1$",
      "$3$",
      "$5$",
      "$7$",
      "$9$"
    ],
    "answer": "③",
    "solution": "그림에서 유리함수의 점근선은 $x=1$, $y=2$이고 두 가지가 제1, 제3사분면 쪽에 놓여 있다.\n따라서 $-b=1$, $c=2$, $a>0$이므로 $b=-1$, $c=2$이다.\n무리함수는 이제 $y=-\\sqrt{a(x+1)}+2$이고, 정의역은 $x\\ge-1$이다.\nx절편을 구하기 위해 $y=0$을 대입한다.\n$\\sqrt{a(x+1)}=2$\n$a(x+1)=4$\n$x=\\dfrac4a-1$\n$a>0$일 때 이 x절편이 0 이상이면 음의 x에서 함수값이 음수가 될 수 없다. 반대로 x절편이 음수이면 그 절편과 0 사이에 그래프가 제3사분면에 들어간다.\n따라서 $\\dfrac4a-1\\ge0$, 즉 $0<a\\le4$이다.\n$a+b+c=a-1+2=a+1$이므로 최댓값은 $a=4$일 때 5이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "상",
    "category": "필요충분조건",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "필요충분조건"
    ],
    "wide": false,
    "content": "두 조건 $p$, $q$에 대하여 조건 $q$가<br>$q:(a-1)(b-1)(c-1)\\lt0$<br>일 때, $N(p)$를 다음과 같이 정의하자.<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">$p$가 $q$이기 위한 충분조건이지만 필요조건이 아니면 $N(p)=0$<br>$p$가 $q$이기 위한 필요조건이지만 충분조건이 아니면 $N(p)=1$<br>$p$가 $q$이기 위한 필요충분조건이면 $N(p)=3$<br>$p$가 $q$이기 위한 필요조건도 충분조건도 아니면 $N(p)=4$</div><br>세 조건 $p_1$, $p_2$, $p_3$가<br>$p_1:a,b,c$ 중 적어도 하나는 $1$보다 크다.<br>$p_2:a,b,c$ 중 적어도 하나는 $1$보다 작다.<br>$p_3:a,b,c$ 모두 $1$보다 작다.<br>일 때, $N(p_1)+N(p_2)+N(p_3)$의 값은? (단, $a$, $b$, $c$는 실수이다.) [4.4점]",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$8$",
      "$0$"
    ],
    "answer": "②",
    "solution": "세 인수 $(a-1)$, $(b-1)$, $(c-1)$의 곱이 음수이려면 음수인 인수가 1개 또는 3개여야 한다. 즉 q가 참이면 a, b, c 중 적어도 하나는 1보다 작다.\n$p_1$: 적어도 하나가 1보다 크다는 조건은 q를 보장하지 않는다. 예를 들어 모두 1보다 크면 곱은 양수이다. q가 참이어도 세 수가 모두 1보다 작을 수 있으므로 $p_1$은 q의 필요조건도 아니다. 따라서 $N(p_1)=4$이다.\n$p_2$: q가 참이면 적어도 하나가 1보다 작으므로 $q\\to p_2$이다. 하지만 $a=0$, $b=0$, $c=2$이면 $p_2$는 참이고 곱은 양수이므로 q는 거짓이다. 따라서 $N(p_2)=1$이다.\n$p_3$: 세 수가 모두 1보다 작으면 세 인수가 모두 음수이므로 그 곱은 음수이다. 따라서 $p_3\\to q$이다. q가 참일 때 세 수가 모두 1보다 작을 필요는 없으므로 $N(p_3)=0$이다.\n그러므로 $N(p_1)+N(p_2)+N(p_3)=4+1+0=5$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 15,
    "level": "상",
    "category": "일대일대응",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "일대일대응"
    ],
    "wide": false,
    "content": "정의역과 공역이 각각 실수 전체의 집합인 함수 $f$가<br>$f(x)=\\begin{cases}(5-a)x+b&(x\\lt 3)\\\\(a+2)x&(x\\ge 3)\\end{cases}$<br>일 때, 함수 $f$가 일대일대응이 되도록 하는 두 정수 $a$, $b$에 대하여 $a+b$의 최솟값은? [4.4점]",
    "choices": [
      "$26$",
      "$19$",
      "$12$",
      "$-16$",
      "$-23$"
    ],
    "answer": "④",
    "solution": "왼쪽 식의 계수 $5-a$나 오른쪽 식의 계수 $a+2$가 0이면 해당 구간에서 함수값이 일정해져 일대일이 될 수 없다.\n두 계수의 부호가 서로 다르면 두 구간의 함수값이 모두 한쪽으로 뻗어 서로 겹치고, 반대쪽의 모든 값을 만들지 못한다. 따라서 두 계수는 같은 부호여야 한다.\n둘 다 음수라면 $a>5$와 $a<-2$를 동시에 만족해야 하므로 불가능하다. 그러므로 둘 다 양수이고\n$5-a>0$, $a+2>0$\n$-2<a<5$이다.\n이때 왼쪽 구간의 함수값은 $-\\infty$부터 경계값 $15-3a+b$ 직전까지이고, 오른쪽 구간의 함수값은 경계값 $3a+6$부터 $\\infty$까지이다.\n함수값이 겹치거나 빠지는 부분 없이 실수 전체를 이루려면 두 경계값이 같아야 한다.\n$15-3a+b=3a+6$\n$b=6a-9$\n정수 a는 $-1,0,1,2,3,4$이고, $a+b=7a-9$는 a가 가장 작은 $-1$일 때 가장 작다.\n따라서 최솟값은 $7(-1)-9=-16$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "상수함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "상수함수"
    ],
    "wide": false,
    "content": "서로 다른 세 실수 $a$, $b$, $c$에 대하여 집합 $X=\\{a,b,c\\}$를 정의역, 정수 전체의 집합을 공역으로 하는 함수 $f(x)=|2x(x-4)|$가 상수함수일 때, 함수 $f(x)$의 치역은 $\\{k\\}$이다. $k$의 최댓값을 구하면? [4.5점]",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "①",
    "solution": "함수값이 k로 일정하려면 서로 다른 세 실수 x에서 $|2x(x-4)|=k$가 되어야 한다.\n먼저 $k=0$이면 $x=0$ 또는 $x=4$뿐이므로 세 실수를 고를 수 없다.\n$k>0$일 때 절댓값 안의 식은 다음 두 식 중 하나와 같아야 한다.\n$2x(x-4)=k$\n$2x(x-4)=-k$\n첫째 방정식은 $x^2-4x-\\dfrac{k}{2}=0$이고 판별식은 $16+2k>0$이므로 서로 다른 두 실근을 갖는다.\n둘째 방정식은 $x^2-4x+\\dfrac{k}{2}=0$이고 판별식은 $16-2k$이다. 따라서 $k<8$이면 두 실근, $k=8$이면 한 실근, $k>8$이면 실근이 없다.\n두 방정식은 k가 양수일 때 같은 해를 가질 수 없다. 그러므로 k가 8보다 크면 실수가 두 개뿐이고, $k=8$일 때는 첫째 식의 두 해와 둘째 식의 한 해를 합쳐 서로 다른 세 실수를 얻는다.\n따라서 k의 최댓값은 8이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "함수의 반복 합성",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 반복 합성",
      "그래프"
    ],
    "wide": false,
    "content": "집합 $X=\\{x\\mid 0\\le x\\le 4\\}$에 대하여 $X$에서 $X$로의 함수<br>$f(x)=\\begin{cases}\\dfrac{3}{2}x&(0\\le x\\lt 2)\\\\-\\dfrac{3}{2}x+6&(2\\le x\\le 4)\\end{cases}$<br>의 그래프는 아래 그림과 같다. $(f\\circ f\\circ f)(a)=\\dfrac{3}{2}$을 만족시키는 실수 $a$의 개수는? [4.6점]",
    "image": "assets/images/25_효천고_2학기_기말_고1_기출/q17.png",
    "imageSize": "large",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$8$"
    ],
    "answer": "②",
    "solution": "먼저 $f(x)=\\dfrac32$가 되는 x를 찾는다.\n왼쪽 식에서는 $\\dfrac32x=\\dfrac32$이므로 $x=1$이고, 오른쪽 식에서는 $-\\dfrac32x+6=\\dfrac32$이므로 $x=3$이다.\n따라서 $f(f(f(a)))=\\dfrac32$이려면 $f(f(a))$는 1 또는 3이어야 한다.\n$f(x)=1$의 해는 $x=\\dfrac23$, $\\dfrac{10}{3}$이고, $f(x)=3$의 해는 두 식이 만나는 $x=2$ 하나이다.\n따라서 $f(a)$는 $\\dfrac23$, $\\dfrac{10}{3}$, 2 중 하나여야 한다.\n$f(x)=\\dfrac23$의 해는 $a=\\dfrac49$, $\\dfrac{32}{9}$이다.\n$f(x)=\\dfrac{10}{3}$은 함수값의 범위 $[0,3]$보다 크므로 해가 없다.\n$f(x)=2$의 해는 $a=\\dfrac43$, $\\dfrac83$이다.\n따라서 가능한 a는 모두 네 개이고, 정답은 ②이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "유리함수와 원의 교점",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수와 원의 교점",
      "그래프"
    ],
    "wide": false,
    "content": "$a=1$일 때 함수<br>$f(x)=\\dfrac{3x-5}{x-2}$<br>의 그래프와 중심이 $(2,3)$이고 반지름의 길이가 $r$인 원이 서로 다른 두 점에서 만날 때, $r$의 값은? [4.8점]",
    "choices": [
      "$4\\sqrt{2}$",
      "$4$",
      "$2\\sqrt{2}$",
      "$2$",
      "$\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "유리함수를 중심 $(2,3)$을 기준으로 옮겨 쓴다.\n$X=x-2$, $Y=y-3$으로 놓으면\n$y=3+\\dfrac1{x-2}$이므로 $XY=1$이다.\n원도 같은 기준으로 옮기면 $X^2+Y^2=r^2$이다.\n$u=X^2$라 놓으면 $u>0$, $Y^2=\\dfrac1u$이므로\n$u+\\dfrac1u=r^2$\n이다. 양변의 차를 정리하면\n$u+\\dfrac1u-2=\\dfrac{(u-1)^2}{u}\\ge0$\n이므로 $r^2\\ge2$이어야 한다.\n$r^2=2$일 때는 $u=1$이고, 따라서 $X=1$ 또는 $X=-1$이다. $XY=1$에서 각각 $Y=1$, $Y=-1$이므로 교점은 서로 다른 두 개이다.\n$r^2>2$이면 $u^2-r^2u+1=0$이 서로 다른 두 양의 해를 가져, 각 해에서 X의 부호를 두 가지로 정할 수 있으므로 교점은 네 개이다. 따라서 서로 다른 두 점에서 만나는 경우는 $r^2=2$뿐이다.\n$r=\\sqrt2$이다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_기출/q18-solution.svg",
    "solutionImageAlt": "유리함수의 그래프와 같은 중심을 갖는 원, 두 교점을 나타낸 해설 그래프",
    "solutionImageCaption": "중심을 (2,3)으로 옮긴 뒤 유리함수와 원이 두 점에서 만나는 경계 반지름을 확인한다.",
    "solutionImageSize": "full",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "하",
    "category": "역함수와 합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "역함수와 합성함수"
    ],
    "wide": false,
    "content": "[서술형1]<br>두 함수 $f(x)=x+5$, $g(x)=-2x^2+x$에 대하여 $(f^{-1}\\circ g)(2)$의 값을 구하고 그 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$-11$",
    "solution": "$f(x)=x+5$를 거꾸로 풀면 $f^{-1}(x)=x-5$이다.\n먼저 합성함수 안쪽의 값을 구한다.\n$g(2)=-2\\cdot2^2+2=-8+2=-6$\n이제 이 값을 역함수에 넣는다.\n$(f^{-1}\\circ g)(2)=f^{-1}(-6)=-6-5=-11$\n따라서 구하는 값은 $-11$이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
    "category": "합성함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "합성함수"
    ],
    "wide": false,
    "content": "[서술형2]<br>두 함수 $f(x)=2ax+m$, $g(x)=\\dfrac{1}{2}bx+n$에 대하여 $0$이 아닌 두 실수 $m$, $n$의 값에 관계 없이 $(f\\circ g)(x)=(g\\circ f)(x)+4n$이 성립할 때, 두 상수 $a$, $b$의 값의 곱을 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$5$",
    "solution": "두 합성함수를 각각 전개한다.\n$(f\\circ g)(x)=2a\\left(\\dfrac12bx+n\\right)+m=abx+2an+m$\n$(g\\circ f)(x)+4n=\\dfrac12b(2ax+m)+n+4n=abx+\\dfrac b2m+5n$\n두 식은 0이 아닌 m, n의 값과 관계없이 같아야 한다. x항은 이미 같으므로 m항과 n항의 계수를 각각 비교한다.\n$m$의 계수에서 $1=\\dfrac b2$이므로 $b=2$이다.\n$n$의 계수에서 $2a=5$이므로 $a=\\dfrac52$이다.\n따라서 $ab=\\dfrac52\\cdot2=5$이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
    "level": "중",
    "category": "명제의 부정",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "명제의 부정"
    ],
    "wide": false,
    "content": "[서술형3]<br>명제 ‘어떤 실수 $x$에 대하여 $x^2-ax+3\\lt 0$이다.’ 부정이 참이 되도록 하는 정수 $a$의 개수를 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$7$",
    "solution": "‘어떤 실수 x에 대하여 식이 0보다 작다’의 부정은 ‘모든 실수 x에 대하여 식이 0 이상이다’이다.\n따라서 모든 실수 x에서\n$x^2-ax+3\\ge0$\n이어야 한다.\n식을 완전제곱식으로 만들면\n$x^2-ax+3=\\left(x-\\dfrac a2\\right)^2+3-\\dfrac{a^2}{4}$\n이다. 첫 항의 최솟값은 0이므로 모든 x에서 식이 0 이상이 되려면\n$3-\\dfrac{a^2}{4}\\ge0$\n$a^2\\le12$\n이어야 한다.\n따라서 $-2\\sqrt3\\le a\\le2\\sqrt3$이고, 이 범위의 정수는 $-3,-2,-1,0,1,2,3$이다.\n모두 7개이므로 구하는 개수는 7이다.",
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 22,
    "level": "중",
    "category": "유리함수의 활용",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "유리함수의 활용",
      "그래프"
    ],
    "wide": false,
    "content": "[서술형4]<br>유리함수 $y=\\dfrac{1}{x+2}-1$ $(x\\lt -2)$의 그래프 위의 점 $P$에서 $x$축, $y$축에 내린 수선의 발을 각각 $Q$, $R$라고 할 때, $\\overline{PQ}+\\overline{PR}$의 최솟값을 구하고 그 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$5$",
    "solution": "점 P의 x좌표를 x, y좌표를 y라 하면 x축과 y축까지의 거리는 각각 $|y|$, $|x|$이다.\n$x<-2$이므로 $x<0$이고\n$y=\\dfrac1{x+2}-1<0$이다.\n따라서 두 길이의 합은 $-y-x$이다.\n$t=-(x+2)$라 놓으면 $t>0$, $x=-t-2$, $y=-\\dfrac1t-1$이다.\n그러므로\n$\\overline{PQ}+\\overline{PR}=t+\\dfrac1t+3$\n이다. $t>0$에서\n$t+\\dfrac1t-2=\\dfrac{(t-1)^2}{t}\\ge0$\n이므로 길이의 합은 5 이상이다. $t=1$, 즉 $x=-3$일 때 등호가 성립한다.\n따라서 최솟값은 5이다.",

    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_기출/q22-solution.svg",

    "solutionImageAlt": "유리함수와 수선 길이를 나타낸 해설 그래프",

    "solutionImageCaption": "P=(−3,−2)에서 두 수선 길이의 합이 5가 됨을 확인한다.",

    "solutionImageSize": "full",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "level": "상",
    "category": "함수와 역함수",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수와 역함수"
    ],
    "wide": false,
    "content": "[서술형5]<br>함수 $f(x)=\\begin{cases}3x-2&(x\\ge 0)\\\\\\dfrac{1}{5}x-2&(x\\lt 0)\\end{cases}$과 그 역함수 $f^{-1}(x)$에 대하여 $\\{f(x)\\}^2=f(x)f^{-1}(x)$를 만족시키는 모든 실수 $x$의 값의 합을 구하고 그 과정을 서술하시오. [7점]",
    "choices": [],
    "answer": "$-\\dfrac{5}{6}$",
    "solution": "먼저 역함수의 식과 그 식을 쓰는 범위를 정한다.\n$f^{-1}(x)=\\dfrac{x+2}{3}$ $(x\\ge-2)$\n$f^{-1}(x)=5(x+2)$ $(x<-2)$\n주어진 식을 한쪽으로 모으면\n$f(x)\\{f(x)-f^{-1}(x)\\}=0$\n이다. 따라서 $f(x)=0$인 경우와 $f(x)=f^{-1}(x)$인 경우를 나누어 푼다.\n$f(x)=0$이면 $x\\ge0$에서 $3x-2=0$이므로 $x=\\dfrac23$이다. $x<0$에서 $\\dfrac15x-2=0$의 해는 10이어서 이 범위에 맞지 않는다.\n이제 $f(x)=f^{-1}(x)$를 푼다. f의 식이 바뀌는 곳은 0이고 역함수의 식이 바뀌는 곳은 -2이므로 세 구간을 살핀다.\n$x\\ge0$에서는 $3x-2=\\dfrac{x+2}{3}$이다.\n$9x-6=x+2$, 따라서 $x=1$이다.\n$-2\\le x<0$에서는 $\\dfrac15x-2=\\dfrac{x+2}{3}$이다.\n$3x-30=5x+10$, 따라서 $x=-20$인데 이 구간에 들어가지 않는다.\n$x<-2$에서는 $\\dfrac15x-2=5(x+2)$이다.\n$x-10=25x+50$, 따라서 $x=-\\dfrac52$이다.\n모든 해는 $\\dfrac23$, 1, $-\\dfrac52$이다.\n그 합은 $\\dfrac23+1-\\dfrac52=-\\dfrac56$이다.\n따라서 구하는 값은 $-\\dfrac56$이다.",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
