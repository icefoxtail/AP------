window.examTitle = "19_순천여고_2학기_중간_고2_수학II";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "함수 $f(x)$가 모든 양수 $x$에 대하여\n$$3x+1 < f(x) < 3x+2$$\n일 때, $\\lim_{x \\to \\infty} \\frac{f(x)}{x}$의 값을 구하면? [4.0점]",
    "choices": [
      "$0$",
      "$1$",
      "$3$",
      "$9$",
      "$27$"
    ],
    "images": [],
    "answer": "③",
    "solution": "주어진 부등식을 $x>0$으로 나누면 부등호 방향이 그대로 유지된다.\n$$3+\\frac1x<\\frac{f(x)}x<3+\\frac2x.$$\n$x\\to\\infty$일 때 양쪽 끝은 모두 $3$에 수렴한다. 따라서 샌드위치 정리로 가운데 극한도 $3$이다.\n선택지 $0,1,9,27$은 양쪽 극한이 $3$이라는 사실과 맞지 않는다. **정답은 ③ $3$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "level": "하",
    "difficultyBucket": 2,
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "primaryMethod": "대소관계와 극한",
    "decisiveStep": "양끝의 극한이 3이 되는 샌드위치 정리",
    "metaStatus": "R2_RPM_SEMANTIC_PINPOINT_CORRECTED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "열린구간 $(0, 4)$에서 정의된 함수 $y=f(x)$의 그래프가 오른쪽 그림과 같다. 함수 $f(x)$의 극한값이 존재하지 않는 점의 개수를 $a$, 불연속인 점의 개수를 $b$라 할 때, $a+b$의 값을 구하면? [4.0점]\n<img src=\"assets/images/19_순천여고_2학기_중간_고2_수학II/q02.png\" alt=\"19_순천여고_2학기_중간_고2_수학II Q02\" />",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "images": [
      "assets/images/19_순천여고_2학기_중간_고2_수학II/q02.png"
    ],
    "answer": "②",
    "solution": "그래프에서 좌극한과 우극한을 각각 읽는다. $x=1$에서는 왼쪽에서 $1$, 오른쪽에서 $2$에 가까워져 서로 다르다. $x=2$에서도 왼쪽 극한은 $2$, 오른쪽 극한은 $1$이므로 극한이 없다. 따라서 $a=2$이다.\n$x=3$에서는 좌우에서 모두 $0$에 가까워지므로 극한은 $0$으로 존재하지만, 채워진 점이 $(3,1)$이어서 $f(3)=1$이다. 따라서 $1,2,3$에서 불연속이므로 $b=3$이다. 구간 $(0,4)$의 끝점 $0,4$는 세지 않는다.\n$$a+b=2+3=5.$$\n선택지 $4,6,7,8$은 극한 불존재와 함수값 불일치를 혼동하거나 구간 끝점을 잘못 센 값이다. **정답은 ② $5$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_CONTINUITY_POINT_JUDGMENT",
    "primaryMethod": "그래프에서 연속성 판정",
    "decisiveStep": "x=1,2의 좌우극한 불일치와 x=3 함수값 차이",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "함수 $f(x)=x^3-x^2+x$에 대하여 $f'(-1)$의 값을 구하면? [4.1점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "images": [],
    "answer": "①",
    "solution": "다항함수는 항별로 미분한다.\n$$f'(x)=3x^2-2x+1.$$\n$x=-1$을 대입하면\n$$f'(-1)=3(-1)^2-2(-1)+1=3+2+1=6.$$\n선택지 $7,8,9,10$은 부호 또는 대입 계산이 잘못된 값이다. **정답은 ① $6$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "하",
    "difficultyBucket": 1,
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "primaryMethod": "다항함수 도함수 계산",
    "decisiveStep": "3x²-2x+1에 -1 대입",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "연속함수 $f(x)$에 대하여\n$$f(x)=f(-x), f(-1)f(-2)<0, f(-3)f(-4)<0$$\n이 성립할 때 $f(x)=0$의 실근은 적어도 몇 개인지를 구하면? [4.1점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "images": [],
    "answer": "④",
    "solution": "$f(-1)f(-2)<0$은 두 함수값의 부호가 서로 다르다는 뜻이다. $f$가 연속이므로 **사잇값 정리**에 따라 $(-2,-1)$ 안에 적어도 한 근이 있다. 마찬가지로 $f(-3)f(-4)<0$이므로 $(-4,-3)$ 안에도 적어도 한 근이 있다.\n\n여기서 $f(x)=f(-x)$는 $y$축 대칭을 뜻한다. 따라서 $f(c)=0$이면 $f(-c)=0$도 성립한다. 앞의 두 음수 구간에 대응하는 양수 구간 $(1,2)$와 $(3,4)$에도 각각 적어도 한 근이 있다.\n\n$$(-4,-3),\\quad(-2,-1),\\quad(1,2),\\quad(3,4)$$\n\n이 네 구간은 서로 겹치지 않으므로 **서로 다른 실근이 적어도 4개**다. 더 많은 근이 생길 수는 있지만, 조건만으로 다섯 번째 근이 반드시 있다고 할 수 없다. 실제로 $f(x)=(x^2-\\frac94)(x^2-\\frac{49}4)$는 주어진 부호 조건을 만족하고 근이 $\\pm\\frac32,\\pm\\frac72$의 네 개뿐이다. 그러므로 보장되는 최소 개수는 $4$이다. **정답은 ④**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_MINIMUM_ROOT_COUNT",
    "primaryMethod": "사잇값 정리와 짝함수",
    "decisiveStep": "음수 두 구간의 근을 양수 대칭으로 복제",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "두 함수 $f(x), g(x)$가 다음 조건\n<조건>\n(가) $\\lim_{x \\to \\infty} f(x) = \\infty$\n(나) $\\lim_{x \\to \\infty} \\{2f(x)-g(x)\\} = 5$\n를 모두 만족할 때, $\\lim_{x \\to \\infty} \\frac{3f(x)+g(x)}{9f(x)-4g(x)}$을 구하면? [4.3점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "조건 (나)에서 $2f(x)-g(x)\\to5$이므로 $u(x)=2f(x)-g(x)$라 두면 $u(x)\\to5$, $g(x)=2f(x)-u(x)$이다.\n$$\\frac{3f+g}{9f-4g}=\\frac{5f-u}{f+4u}=\\frac{5-u/f}{1+4u/f}.$$\n조건 (가)에 의해 $f(x)\\to\\infty$, $u(x)\\to5$이므로 $u/f\\to0$. 따라서 극한은 $5$이다.\n선택지 $1,2,3,4$는 최고차 발산항의 계수비를 잘못 비교한 값이다. **정답은 ⑤ $5$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_ASYMPTOTIC_RELATION",
    "primaryMethod": "무한대에서 발산항 계수 비교",
    "decisiveStep": "g=2f-u, u→5로 정리",
    "metaStatus": "R2_RPM_SEMANTIC_PINPOINT_CORRECTED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "연속함수 $f(x)=(x-a)(x-b)(x-c)$ 위의 점 $(3, 6)$에서의 접선의 기울기가 2일 때, $\\frac{1}{3-a}+\\frac{1}{3-b}+\\frac{1}{3-c}$의 값을 구하면? (단, $a, b, c$는 상수) [4.4점]",
    "choices": [
      "$1$",
      "$\\frac{1}{2}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{5}$"
    ],
    "images": [],
    "answer": "③",
    "solution": "곱의 미분법을 적용하면\n$$f'(x)=(x-b)(x-c)+(x-a)(x-c)+(x-a)(x-b).$$\n$f(3)=(3-a)(3-b)(3-c)=6\\ne0$이므로 양변을 $f(3)$으로 나눌 수 있다.\n$$\\frac{f'(3)}{f(3)}=\\frac1{3-a}+\\frac1{3-b}+\\frac1{3-c}.$$\n접선 기울기가 $2$이므로 $f'(3)=2$이다. 구하는 값은 $2/6=1/3$이다.\n선택지 $1,1/2,1/4,1/5$는 $f'(3)$ 또는 $f(3)$을 빠뜨린 계산이다. **정답은 ③ $1/3$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "primaryMethod": "곱의 미분법",
    "decisiveStep": "f′(3)/f(3)=역수의 합",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "두 함수 $f(x)=x^2+x+1, g(x)=x^3+2$에 대하여 $\\lim_{h \\to 0} \\frac{f(1+h)-g(1-h)}{h}$의 값은? [4.2점]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "images": [],
    "answer": "③",
    "solution": "먼저 $f(1)=1+1+1=3$, $g(1)=1+2=3$으로 분자의 상수항이 $0$임을 확인한다.\n$$f(1+h)-g(1-h)=[f(1+h)-f(1)]+[g(1)-g(1-h)].$$\n따라서 분자를 $h$로 나눈 극한은 $f'(1)+g'(1)$이다. $f'(x)=2x+1$이므로 $f'(1)=3$, $g'(x)=3x^2$이므로 $g'(1)=3$이다.\n$$\\lim_{h\\to0}\\frac{f(1+h)-g(1-h)}h=3+3=6.$$\n선택지 $2,4,8,10$은 $g(1-h)$의 부호나 도함수 대입을 잘못 처리한 값이다. **정답은 ③ $6$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "하",
    "difficultyBucket": 2,
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "primaryMethod": "미분계수 정의로 차분극한 환원",
    "decisiveStep": "f′(1)+g′(1)로 변환",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "두 함수 $f(x), g(x)$에 대하여 <보기>에서 옳은 것을 보기에서 있는 대로 고른 것은? [4.2점]\n<보기>\nㄱ. $\\lim_{x \\to \\infty} f(x)$와 $\\lim_{x \\to \\infty} \\{f(x)+g(x)\\}$의 값이 모두 존재하면 $\\lim_{x \\to \\infty} g(x)$의 값도 존재한다.\nㄴ. $\\lim_{x \\to \\infty} f(x)$와 $\\lim_{x \\to \\infty} f(x)g(x)$의 값이 모두 존재하면 $\\lim_{x \\to \\infty} g(x)$의 값도 존재한다.\nㄷ. $\\lim_{x \\to \\infty} f(x)$와 $\\lim_{x \\to \\infty} \\frac{g(x)}{f(x)}$의 값이 모두 존재하면 $\\lim_{x \\to \\infty} g(x)$의 값도 존재한다. (단, $f(x) \\ne 0$)",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "images": [],
    "answer": "④",
    "solution": "극한의 연산법칙을 사용할 때는 **각 극한이 유한하게 존재하는지**와 나눗셈의 분모가 $0$으로 가는지 등을 구분해야 한다.\n\n**ㄱ. 참.** $g(x)=\\{f(x)+g(x)\\}-f(x)$로 쓸 수 있다. 오른쪽 두 함수의 극한이 모두 존재하므로 차의 극한도 존재한다.\n\n**ㄴ. 거짓.** $f(x)=0$, $g(x)=\\sin x$로 놓아 보자. $f(x)$와 $f(x)g(x)$는 항상 $0$이어서 극한이 존재하지만, $\\sin x$는 $x\\to\\infty$에서 일정한 값으로 수렴하지 않는다. 곱의 극한이 존재한다고 각 인자의 극한이 반드시 존재하는 것은 아니다.\n\n**ㄷ. 참.** 조건에서 $f(x)\\ne0$이므로 $g(x)=f(x)\\cdot\\frac{g(x)}{f(x)}$이다. 오른쪽 두 인자의 극한이 존재하므로 곱의 극한도 존재한다. 여기서는 $f(x)$의 극한이 $0$이어도 문제없다. $g/f$가 이미 정의되어 있고 그 극한이 존재하기 때문이다.\n\n따라서 참인 것은 **ㄱ과 ㄷ**이다. ㄴ을 포함한 ②·③·⑤는 반례 때문에 틀리고, ㄷ을 빠뜨린 ①도 틀리다. **정답은 ④**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_LIMIT_STATEMENT_LOGIC",
    "templateKey": "TPL_LIMIT_STATEMENT_COUNTEREXAMPLE",
    "primaryMethod": "극한의 연산 법칙과 반례",
    "decisiveStep": "ㄴ에 f=0,g=sin x 반례 구성",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "미분가능한 함수 $f(x)$와 $g(x)$에 대하여\n$$\\lim_{x \\to 1} \\frac{f(x)-2}{x-1} = 5, \\lim_{x \\to 1} \\frac{g(x)-3}{x-1} = 3$$\n일 때, 함수 $y=f(x)g(x)$의 $x=1$에서의 미분계수는? [4.4점]",
    "choices": [
      "$13$",
      "$15$",
      "$17$",
      "$19$",
      "$21$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "첫 극한이 유한하게 존재하고 $f$가 미분가능하므로 $f(1)=2$, $f'(1)=5$이다. 마찬가지로 $g(1)=3$, $g'(1)=3$이다.\n곱의 미분법으로\n$$\\{f(x)g(x)\\}'\\big|_{x=1}=f'(1)g(1)+f(1)g'(1)$$\n$$=5\\cdot3+2\\cdot3=15+6=21.$$\n선택지 $13,15,17,19$는 두 곱 중 하나를 빠뜨리거나 합산을 잘못한 값이다. **정답은 ⑤ $21$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "하",
    "difficultyBucket": 2,
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_INFORMATION_SYSTEM",
    "primaryMethod": "차분극한에서 미분정보 추출",
    "decisiveStep": "f(1),g(1),f′(1),g′(1)로 곱미분",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "실수 전체에서 미분가능한 함수 $f(x)$가 모든 실수 $x, y$에 대하여 $f(x+y)=f(x)+f(y)+xy$를 만족시키고 $f'(1)=2$일 때 $f'(3)$의 값을 구하면? [4.4점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "images": [],
    "answer": "④",
    "solution": "주어진 식 $f(x+y)=f(x)+f(y)+xy$를 $x$에 대하여 미분한다. $y$를 상수로 보면\n$$f'(x+y)=f'(x)+y.$$\n$x=1$, $y=2$를 대입하면 $f'(3)=f'(1)+2=2+2=4$이다. 이 계산은 $f$의 구체적인 식을 구하지 않아도 된다.\n선택지 $1,2,3,5$는 $+y$ 항을 빠뜨리거나 잘못 대입한 값이다. **정답은 ④ $4$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION",
    "templateKey": "TPL_DERIVATIVE_RELATION_FUNCTION_DETERMINE",
    "primaryMethod": "함수 관계식 미분",
    "decisiveStep": "f′(x+y)=f′(x)+y 도출",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "함수 $f(x)=x^3+ax^2+1$이 닫힌구간 $[0, 2]$에서 롤의 정리를 만족시킬 때, 함수 $f(x)$에 대하여 닫힌구간 $[-2, 2]$에서 평균값 정리를 만족시키는 모든 상수 $c$의 값의 합을 구하면? (단, $a$는 상수) [4.6점]",
    "choices": [
      "$-\\frac{2}{3}$",
      "$0$",
      "$\\frac{2}{3}$",
      "$\\frac{4}{3}$",
      "$2$"
    ],
    "images": [],
    "answer": "①",
    "solution": "**1. 롤의 정리로 $a$를 결정한다.** 다항함수는 연속이고 미분가능하므로, $[0,2]$에서 롤의 정리를 만족한다는 조건의 핵심은 $f(0)=f(2)$이다.\n$$f(0)=1,\\qquad f(2)=8+4a+1=9+4a.$$\n따라서 $1=9+4a$에서 $a=-2$이고,\n$$f(x)=x^3-2x^2+1,\\qquad f'(x)=3x^2-4x.$$\n\n**2. $[-2,2]$의 평균변화율을 구한다.**\n$$f(-2)=-8-8+1=-15,\\qquad f(2)=8-8+1=1,$$\n$$\\frac{f(2)-f(-2)}{2-(-2)}=\\frac{1-(-15)}4=4.$$\n\n**3. 평균값 정리의 $c$를 구한다.** 평균값 정리는 $c$가 **열린구간 $(-2,2)$**에 있어야 한다고 말한다.\n$$f'(c)=4\\iff3c^2-4c=4\\iff3c^2-4c-4=0$$\n$$\\iff(3c+2)(c-2)=0\\iff c=-\\frac23\\ \\text{또는}\\ c=2.$$\n$c=2$는 닫힌구간의 끝점이므로 제외한다. 조건에 맞는 $c$는 $-\\frac23$ 하나이고, 모든 $c$의 합도 $-\\frac23$이다. 끝점을 포함해 $\\frac43$이라고 계산하면 틀린다. **정답은 ①**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION",
    "level": "상",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "primaryMethod": "롤의 정리와 평균값 정리",
    "decisiveStep": "a=-2 확정 후 c의 열린구간 경계 제외",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "직선 $x+y-2=0$에 평행하고 곡선 $y=-x^3+3x^2-4x$에 접하는 직선의 $y$절편은? [4.5점]",
    "choices": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$-4$",
      "$-5$"
    ],
    "images": [],
    "answer": "①",
    "solution": "평행한 직선의 기울기는 $-1$이다. 곡선의 도함수는\n$$y'=-3x^2+6x-4.$$\n접점의 $x$좌표를 $t$라 하면 $-3t^2+6t-4=-1$이므로\n$$-3(t-1)^2=0,\\quad t=1.$$\n곡선 위 접점은 $(1,-2)$이다. 기울기 $-1$인 접선은\n$$y+2=-(x-1),\\quad y=-x-1.$$\n따라서 $y$절편은 $-1$이다. 다른 선택지 $-2,-3,-4,-5$는 접점의 $y$좌표와 절편을 혼동한 값이다. **정답은 ① $-1$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-05",
    "subUnitKey": "H15-M2-05-TANGENT",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "primaryMethod": "접선 기울기 조건",
    "decisiveStep": "도함수 -1인 접점 t=1과 절편 구분",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "실수 전체의 집합에서 연속인 함수\n$$f(x)=\\begin{cases} \\frac{x^2+ax-6}{x-3} & (x \\ne 3) \\\\ b & (x=3) \\end{cases}$$\n에 대하여 <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $a, b$는 상수이다.) [4.7점]\n<보기>\nㄱ. $f(-1)+f(3)=7$\nㄴ. 함수 $(x+1)f(x)$는 닫힌구간 $[-2, 2]$에서 반드시 최댓값과 최솟값을 갖는다.\nㄷ. 방정식 $x^2+3x-f(x)=0$은 열린구간 $(-2, 2)$에서 적어도 하나의 실근을 갖는다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "**1. 연속 조건으로 $a,b$를 구한다.** $x=3$에서 분모가 $0$이므로 극한이 유한하려면 분자도 $0$이어야 한다.\n$$3^2+3a-6=0\\Rightarrow a=-1.$$\n그러면 $x\\ne3$에서\n$$f(x)=\\frac{(x-3)(x+2)}{x-3}=x+2.$$\n$x=3$에서도 연속이려면 $b=\\lim_{x\\to3}(x+2)=5$다. 따라서 **모든 실수 $x$에서 $f(x)=x+2$**로 생각할 수 있다.\n\n**ㄱ. 거짓.** $f(-1)+f(3)=1+5=6$이므로 제시된 $7$과 다르다.\n\n**ㄴ. 참.** $(x+1)f(x)=(x+1)(x+2)$는 다항함수여서 $[-2,2]$에서 연속이다. 닫힌구간에서 연속인 함수는 최대·최소 정리에 따라 최댓값과 최솟값을 모두 갖는다.\n\n**ㄷ. 참.**\n$$x^2+3x-f(x)=x^2+2x-2.$$\n$x=-2$를 대입하면 $4-4-2=-2<0$이고, $x=2$에서는 $4+4-2=6>0$이다. 이 식은 연속이므로 사잇값 정리에 의해 **열린구간 $(-2,2)$ 안에 적어도 한 근**이 있다. 직접 풀어도 $x=-1\\pm\\sqrt3$ 중 $-1+\\sqrt3$이 그 구간에 들어간다.\n\n따라서 옳은 것은 **ㄴ, ㄷ**뿐이다. **정답은 ⑤**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "상",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_FACTOR_CONDITION",
    "primaryMethod": "연속 조건과 사잇값 정리",
    "decisiveStep": "a=-1,b=5 확정 후 세 진술 독립 판정",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_QUADRATIC_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "아래 그림과 같이 점 $A(t, 0)(t>0)$과 점 $B(0, 3)$에 대하여 삼각형 $OAB$에 내접하는 원 $C$가 있다. 원 $C$의 반지름의 길이를 $r$라 할 때, $\\lim_{t \\to 0^+} \\frac{r}{t}$의 값은? (단, $O$는 원점이다.) [4.8점]\n<img src=\"assets/images/19_순천여고_2학기_중간_고2_수학II/q14.png\" alt=\"19_순천여고_2학기_중간_고2_수학II Q14\" />",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$"
    ],
    "images": [
      "assets/images/19_순천여고_2학기_중간_고2_수학II/q14.png"
    ],
    "answer": "②",
    "solution": "삼각형 $OAB$는 $OA=t$, $OB=3$인 **직각삼각형**이다. 내접원은 세 변에 접하므로, 세 변을 밑변으로 하는 작은 삼각형 세 개의 높이가 모두 반지름 $r$이다. 따라서 전체 넓이는 **반둘레 $s$에 $r$을 곱한 값**, 즉 $\\Delta=rs$이다.\n\n피타고라스 정리로 빗변 $AB=\\sqrt{t^2+9}$이므로\n$$\\Delta=\\frac{3t}{2},\\qquad s=\\frac{t+3+\\sqrt{t^2+9}}2.$$\n이를 $\\Delta=rs$에 대입하면\n$$\\frac{3t}{2}=r\\cdot\\frac{t+3+\\sqrt{t^2+9}}2.$$\n$t>0$이므로 양변을 $t$로 나눌 수 있다.\n$$\\frac rt=\\frac3{t+3+\\sqrt{t^2+9}}.$$\n이제 $t\\to0^+$이면 분모가 $0+3+3=6$으로 가므로\n$$\\lim_{t\\to0^+}\\frac rt=\\frac36=\\frac12.$$\n그림의 원 크기를 눈대중으로 비교하지 않고 **넓이와 반둘레**로 식을 만든 것이 핵심이다. **정답은 ②**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "level": "중",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_GEOMETRY_PARAMETERIZATION",
    "primaryMethod": "도형의 넓이와 극한",
    "decisiveStep": "r=3t/(t+3+sqrt(t²+9))로 표현",
    "metaStatus": "R2_RPM_SEMANTIC_PINPOINT_CORRECTED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_RIGHT_TRIANGLE",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "함수 $f(x)$가 다음 조건을 만족시킨다.\n<조건>\n(가) $f(x)=\\begin{cases} x+a & (-2 \\le x \\le 1) \\\\ b(x-1)^2+2 & (1 < x \\le 2) \\end{cases}$\n(나) 모든 실수 $x$에 대하여 $f(x)=f(x+4)$이다.\n함수 $f(x)$가 실수 전체의 집합에서 연속일 때, $a-b$의 값은? (단, $a, b$는 상수이다.) [4.7점]",
    "choices": [
      "$3$",
      "$\\frac{7}{2}$",
      "$4$",
      "$\\frac{9}{2}$",
      "$5$"
    ],
    "images": [],
    "answer": "③",
    "solution": "연속인 주기함수에서는 **구간 내부의 연결점**과 **한 주기의 양 끝이 이어지는 점**을 모두 확인해야 한다.\n\n**1. $x=1$에서 연결한다.** 왼쪽 식의 함수값은 $1+a$, 오른쪽 식의 극한은 $b(1-1)^2+2=2$이다. 따라서\n$$1+a=2\\Rightarrow a=1.$$\n\n**2. 주기 $4$의 경계를 연결한다.** $f(x)=f(x+4)$이므로 $x=-2$와 $x=2$는 한 주기를 사이에 둔 같은 위치다. $f$가 연속하려면 양 끝의 값도 같아야 한다.\n$$f(-2)=-2+a=-1,\\qquad f(2)=b(2-1)^2+2=b+2.$$\n$$-1=b+2\\Rightarrow b=-3.$$\n\n두 구간의 식은 각각 다항식이므로 다른 내부 점에서는 연속이다. $x=1$과 주기 경계만 맞추면 모든 실수에서 연속이 된다. 그러므로\n$$a-b=1-(-3)=4.$$\n**정답은 ③**이다. $x=1$만 검사하면 주기 경계 조건을 놓치게 된다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "중",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "primaryMethod": "주기함수 경계 연속",
    "decisiveStep": "x=1 내부 경계와 -2/2 주기 접합 모두 사용",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "함수 $f(x)=\\begin{cases} x+1 & (x \\le 3) \\\\ x-9 & (x > 3) \\end{cases}$에 대하여 함수 $g(x)$를 $g(x)=|f(x-a)+a|$라 하자. 함수 $g(x)$가 실수 전체의 집합에서 연속일 때, $g(a)$의 값을 구하시오. (단, $a$는 상수이다.) [4.7점]\n<img src=\"assets/images/19_순천여고_2학기_중간_고2_수학II/q16.png\" alt=\"19_순천여고_2학기_중간_고2_수학II Q16\" />",
    "choices": [
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$"
    ],
    "images": [
      "assets/images/19_순천여고_2학기_중간_고2_수학II/q16.png"
    ],
    "answer": "④",
    "solution": "$x-a\\le3$이면 $f(x-a)+a=(x-a)+1+a=x+1$이고, $x-a>3$이면 $f(x-a)+a=(x-a)-9+a=x-9$이다. 따라서\n$$g(x)=\\begin{cases}|x+1|&(x\\le a+3),\\\\|x-9|&(x>a+3).\\end{cases}$$\n연속이 되려면 경계 $x=a+3$에서 두 식의 값이 같아야 한다.\n$$|a+4|=|a-6|\\Rightarrow (a+4)^2=(a-6)^2\\Rightarrow20a=20\\Rightarrow a=1.$$\n이제 $x=a=1$은 첫 번째 구간에 속하므로 $g(a)=|1+1|=2$이다. 다른 선택지는 경계의 절댓값을 잘못 다루거나 $x=a$의 구간을 착각한 값이다. **정답은 ④ $2$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "중",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "primaryMethod": "절댓값 구간별 함수 연속",
    "decisiveStep": "|a+4|=|a-6|로 경계 맞춤",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "실수 $t$에 대하여 함수\n$$f(x)=\\begin{cases} -x^2+2x & (x < 3) \\\\ x^2-4x & (x \\ge 3) \\end{cases}$$\n의 그래프와 직선 $y=t$가 만나는 점의 개수를 $g(t)$라 할 때, 다음 <보기>의 $a, b$에 대하여 $a+b$의 값은? (단, $a, b$는 상수이다.) [4.9점]\n<보기>\nㄱ. $\\lim_{t \\to -3^+} g(t) + \\lim_{t \\to 1^+} g(t) = a$\nㄴ. 함수 $g(t)$의 불연속점의 개수는 $b$이다.",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "images": [],
    "answer": "②",
    "solution": "수평선 $y=t$와 그래프의 **교점 수**를 $g(t)$라 하므로, 왼쪽 가지와 오른쪽 가지에서 각각 몇 개씩 만나는지 따로 센다.\n\n**1. $x<3$인 왼쪽 가지:**\n$$f(x)=-x^2+2x=1-(x-1)^2.$$\n꼭짓점은 $(1,1)$이다. $t<1$이면 $x=1\\pm\\sqrt{1-t}$가 후보인데, 오른쪽 해가 $x<3$을 만족하려면 $\\sqrt{1-t}<2$, 즉 $t>-3$이어야 한다. 따라서 왼쪽 가지의 교점 수는 $t\\le-3$에서 $1$개, $-3<t<1$에서 $2$개, $t=1$에서 $1$개, $t>1$에서 $0$개다. 특히 $t=-3$일 때 $x=3$은 **왼쪽 가지에서 제외**된다.\n\n**2. $x\\ge3$인 오른쪽 가지:**\n$$f(x)=x^2-4x=(x-2)^2-4.$$\n$x\\ge3$에서는 증가하고 시작점 $(3,-3)$을 포함하므로 $t<-3$에서 $0$개, $t\\ge-3$에서 $1$개다.\n\n**3. 두 가지의 교점 수를 합한다.**\n$$g(t)=\\begin{cases}\n1 &(t<-3),\\\\\n2 &(t=-3),\\\\\n3 &(-3<t<1),\\\\\n2 &(t=1),\\\\\n1 &(t>1).\n\\end{cases}$$\n\n**ㄱ.** $-3$의 오른쪽에서는 교점이 $3$개, $1$의 오른쪽에서는 $1$개이므로 $a=3+1=4$이다. **ㄴ.** $t=-3$과 $t=1$에서 좌우극한이 서로 달라 불연속이므로 $b=2$이다. 다른 $t$에서는 교점 수가 일정하다.\n\n따라서 $a+b=4+2=6$이다. $x=3$의 열린·닫힌 경계와 꼭짓점의 중복 교점을 한 번만 세는 것이 핵심이다. **정답은 ②**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "level": "상",
    "difficultyBucket": 5,
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_COUNT_FUNCTION_DISCONTINUITY_FIND",
    "primaryMethod": "수평선 교점 개수 함수의 연속",
    "decisiveStep": "t=-3,1에서 g(t)의 좌우 값 비교",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "함수 $f(x)=2x^3-6x+2$에 대하여 함수 $h(x)$를\n$$h(x)=\\begin{cases} f(x) & (x < a) \\\\ m-2f(x) & (a \\le x < b) \\\\ n+f(x) & (x \\ge b) \\end{cases}$$\n라고 정의하자. 함수 $h(x)$가 모든 실수 $x$에 대하여 미분가능 할 때, 상수 $m, n$에 대하여 $m-n$의 값은? (단, $a < 0, b > 0$) [5.0점]",
    "choices": [
      "$-10$",
      "$-6$",
      "$-2$",
      "$2$",
      "$6$"
    ],
    "images": [],
    "answer": "②",
    "solution": "접합점 $a$에서 함수값과 도함수가 같아야 한다.\n$$f(a)=m-2f(a)\\Rightarrow m=3f(a),\\qquad f'(a)=-2f'(a)\\Rightarrow f'(a)=0.$$\n마찬가지로 $b$에서 $m-2f(b)=n+f(b)$이므로 $n=m-3f(b)$이고, 도함수 일치에서 $f'(b)=0$이다.\n$$f'(x)=6x^2-6=6(x-1)(x+1).$$\n$a<0,b>0$이므로 $a=-1,b=1$이다. 따라서\n$$m-n=3f(b)=3f(1)=3(2-6+2)=-6.$$\n선택지 $-10,-2,2,6$은 접합점의 함수값·미분계수 조건 중 일부를 누락한 값이다. **정답은 ② $-6$이다.**",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "상",
    "difficultyBucket": 5,
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "primaryMethod": "구간별 함수의 미분가능 조건",
    "decisiveStep": "a=-1,b=1에서 함수값·도함수 동시 일치",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_NEGATIVE",
      "COND_POSITIVE",
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "서술형",
    "content": "[서술형 1] 함수 $f(x)=(x^2+1)(2x+1)$ 위의 점 $(1, f(1))$에서 접하는 직선의 기울기를 구하시오. [4.0점]",
    "choices": [],
    "images": [],
    "answer": "10",
    "solution": "접선의 기울기는 접점에서의 도함수 값이다. 곱의 미분법으로\n$$f'(x)=2x(2x+1)+2(x^2+1).$$\n따라서\n$$f'(1)=2\\cdot1\\cdot3+2(1+1)=6+4=10.$$\n**답: $10$**.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "하",
    "difficultyBucket": 1,
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "primaryMethod": "곱의 미분법과 접선 기울기",
    "decisiveStep": "f′(1)=10 계산",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "[서술형 2] 다항함수 $f(x)$가\n$$\\lim_{x \\to \\infty} \\frac{f(x)-x^3}{x^2} = 2, \\lim_{x \\to 1} \\frac{f(x)}{x-1} = 5$$\n를 만족시킬 때, $f(2)$의 값을 구하는 풀이 과정과 답을 구하시오. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "11",
    "solution": "**1. 첫 극한에서 다항식의 형태를 결정한다.**\n$$\\lim_{x\\to\\infty}\\frac{f(x)-x^3}{x^2}=2.$$\n$f(x)-x^3$를 $x^2$로 나눈 극한이 유한한 $2$이므로, $f(x)$의 $x^3$항 계수는 $1$이고 $x^3$보다 높은 차수의 항은 없다. 또한 $x^2$항의 계수는 $2$다. 따라서\n$$f(x)=x^3+2x^2+ax+b.$$\n\n**2. 두 번째 극한에서 $f(1)$과 $f'(1)$을 결정한다.**\n$$\\lim_{x\\to1}\\frac{f(x)}{x-1}=5.$$\n분모가 $0$으로 가는데 극한이 유한하므로 다항함수의 연속성에 의해 **$f(1)=0$**이어야 한다. 이제 분자는 $f(x)-f(1)$로 쓸 수 있어 이 극한은 미분계수 $f'(1)=5$와 같다.\n$$f'(x)=3x^2+4x+a,\\qquad f'(1)=7+a=5\\Rightarrow a=-2.$$\n$$f(1)=1+2-2+b=0\\Rightarrow b=-1.$$\n\n**3. 구하는 값을 계산한다.**\n$$f(2)=2^3+2\\cdot2^2-2\\cdot2-1=8+8-4-1=11.$$\n**답은 $11$**이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "level": "상",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_POLYNOMIAL_RECONSTRUCTION",
    "primaryMethod": "극한 조건으로 다항함수 결정",
    "decisiveStep": "최고차·이차항 확정 후 f(1)=0,f′(1)=5",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "[서술형 3] 다항식 $x^6+x^4-2x^2+5$를 $(x-1)^2$으로 나누었을 때의 나머지를 구하는 풀이 과정과 답을 구하시오. [5.0점]\n(1) 몫과 나머지를 이용하여 식을 나타내시오. [1.0점]\n(2) (1)에서 구한 식을 이용하여 나머지를 구하시오. [4.0점]",
    "choices": [],
    "images": [],
    "answer": "6x-1",
    "solution": "**(1) 몫과 나머지로 식을 나타낸다.**\n나누는 식이 $(x-1)^2$로 2차식이므로 나머지는 1차 이하이다. $P(x)=x^6+x^4-2x^2+5$라 놓으면\n$$P(x)=(x-1)^2Q(x)+ax+b$$\n로 쓸 수 있다. 여기서 $Q(x)$는 몫이고 $ax+b$가 나머지다.\n\n**(2) $a,b$를 결정한다.** $x=1$을 대입하면 $(x-1)^2Q(x)$ 부분이 $0$이므로\n$$P(1)=a+b=1+1-2+5=5.$$\n한편 위 등식을 미분하면\n$$P'(x)=2(x-1)Q(x)+(x-1)^2Q'(x)+a.$$\n$x=1$에서는 앞의 두 항에 모두 $(x-1)$이 들어 있어 $0$이 된다. 따라서 **$P'(1)=a$**이다.\n$$P'(x)=6x^5+4x^3-4x,\\qquad a=P'(1)=6+4-4=6.$$\n$$a+b=5\\Rightarrow b=-1.$$\n따라서 **나머지는 $6x-1$**이다. $P(1)$만 사용하면 $a+b$ 한 식밖에 없으므로, 미분하여 두 번째 조건을 만드는 것이 핵심이다.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE",
    "level": "중",
    "difficultyBucket": 3,
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "primaryMethod": "중근 나눗셈의 나머지와 미분",
    "decisiveStep": "R(1)=P(1),R′(1)=P′(1)",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DIVISION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 22,
    "questionNumber": 22,
    "questionType": "서술형",
    "content": "[서술형 4] 점 $A(1, 2)$에서 곡선 $y=-x^2-1$에 그은 두 접선의 접점을 각각 $P, Q$라 할 때, 삼각형 $APQ$의 넓이를 구하시오. [6.0점]",
    "choices": [],
    "images": [],
    "answer": "16",
    "solution": "접선의 접점을 먼저 구하고, 삼각형의 넓이는 중학교에서 배운 밑변과 높이로 계산한다.\n접점의 $x$좌표를 $t$라 두면 접점은 $(t,-t^2-1)$이고, 도함수는 $y'= -2x$이므로 접선의 기울기는 $-2t$이다.\n접선의 식을 접점으로 나타내면\n$$y=-2t(x-t)-t^2-1=-2tx+t^2-1.$$\n이 직선이 $A(1,2)$를 지나므로\n$$2=-2t+t^2-1,\\qquad t^2-2t-3=(t-3)(t+1)=0.$$\n따라서 두 접점은 $P(3,-10)$, $Q(-1,-2)$이다.\n선분 $PQ$의 중점 $M$은\n$$M=\\left(\\frac{3+(-1)}2,\\frac{-10+(-2)}2\\right)=(1,-6).$$\n$A(1,2)$와 $M(1,-6)$은 $x$좌표가 같으므로 $AM$은 수직선 위에 있고 길이는 $2-(-6)=8$이다.\n삼각형 $APQ$를 $\\triangle APM$과 $\\triangle AQM$으로 나누자. 두 삼각형 모두 밑변을 $AM$으로 잡으면, 점 $P$와 $Q$에서 직선 $x=1$까지의 수평거리는 각각 $|3-1|=2$, $|-1-1|=2$이다.\n따라서\n$$[APQ]=[APM]+[AQM]=\\frac12\\cdot8\\cdot2+\\frac12\\cdot8\\cdot2=8+8=16.$$\n**답: $16$**.",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-05",
    "subUnitKey": "H15-M2-05-TANGENT",
    "level": "상",
    "difficultyBucket": 4,
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "primaryMethod": "접점 매개변수와 삼각형 넓이",
    "decisiveStep": "t²-2t-3=0 후 좌표 행렬식",
    "metaStatus": "R2_RPM_REVIEWED_ACTIVE_EXACT; UID_PENDING",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "solutionImage": "assets/images/19_순천여고_2학기_중간_고2_수학II/q22-solution.svg",
    "solutionImageAlt": "두 접점 P(3,-10), Q(-1,-2), 점 A(1,2), 중점 M(1,-6), 공통 밑변 AM과 삼각형 넓이",
    "solutionImageCaption": "접점 P, Q에서 AM까지의 수평거리 2씩, AM=8이므로 삼각형 넓이는 16",
    "solutionImageSize": "full"
  }
];
