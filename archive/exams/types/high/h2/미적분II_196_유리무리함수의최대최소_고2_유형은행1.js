window.examTitle = "미적분II_196_유리무리함수의최대최소_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=3(x-2)/(x^2+5)$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$-8/5$",
      "$-7/5$",
      "$-6/5$",
      "$-5/5$",
      "$-4/5$"
    ],
    "answer": "③",
    "solution": "정의역은 실수 전체이고 $f$는 모든 실수에서 미분가능하다.\n몫의 미분법으로 $$f'(x)=\\frac{3\\{(x^2+5)-(x-2)\\cdot 2x\\}}{(x^2+5)^2}$$이다.\n분자를 정리하면 $3(x^2+5-2x^2+4x)=3(-x^2+4x+5)$이다.\n인수분해하면 $-3(x^2-4x-5)=-3(x-5)(x+1)$이므로 $f'=0$인 점은 $x=-1,\\,5$이다.\n$f'$의 부호는 $x<-1$에서 $-$, $-1<x<5$에서 $+$, $x>5$에서 $-$이다.\n$\\lim_{x\\to\\pm\\infty}f(x)=0$이므로 양 끝의 값 $0$과 비교하면 최댓값은 $f(5)$, 최솟값은 $f(-1)$이다.\n대입하면 $f(-1)=\\frac{3(-3)}{1+5}=-\\frac{9}{6}=-\\frac{3}{2}$이고 $f(5)=\\frac{3\\cdot 3}{25+5}=\\frac{9}{30}=\\frac{3}{10}$이다.\n합은 $-\\frac{3}{2}+\\frac{3}{10}=\\frac{-15+3}{10}=-\\frac{12}{10}=-\\frac{6}{5}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$[-3,3]$에서 $f(x)=x/(x^2-2x+4)$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$0$",
      "$1/6$",
      "$1/4$",
      "$1/3$",
      "$1/2$"
    ],
    "answer": "④",
    "solution": "$f$는 $[-3,3]$에서 미분가능하므로 닫힌구간에서의 최대·최소 정리를 쓸 수 있다.\n몫의 미분법으로 $$f'(x)=\\frac{(x^2-2x+4)-x(2x-2)}{(x^2-2x+4)^2}$$이다.\n분자를 정리하면 $x^2-2x+4-2x^2+2x=-x^2+4$이다.\n$f'=0$인 내부의 점은 $-x^2+4=0$에서 $x=-2,\\,2$이다.\n각 점의 값은 $f(-2)=\\frac{-2}{4+4+4}=-\\frac{2}{12}=-\\frac{1}{6}$, $f(2)=\\frac{2}{4-4+4}=\\frac{2}{4}=\\frac{1}{2}$이다.\n끝점의 값은 $f(-3)=\\frac{-3}{9+6+4}=-\\frac{3}{19}$, $f(3)=\\frac{3}{9-6+4}=\\frac{3}{7}$이다.\n$-\\frac{1}{6}< -\\frac{3}{19}$이므로 최솟값은 $f(-2)$이고, $\\frac{3}{7}<\\frac{1}{2}$이므로 최댓값은 $f(2)$이다.\n그 합은 $-\\frac{1}{6}+\\frac{1}{2}=-\\frac{1}{6}+\\frac{3}{6}=\\frac{2}{6}=\\frac{1}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_RESTRICTED_DOMAIN_EXTREMA",
      "CC_INTERVAL_BOUNDS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=x\\sqrt{4-x^2}$의 최댓값과 최솟값의 차는?",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "⑤",
    "solution": "근호 안이 $0$ 이상이어야 하므로 $4-x^2\\ge 0$, 즉 정의역은 $[-2,2]$이다.\n$f$는 이 구간에서 연속이므로 최대·최소 정리에 의해 최댓값과 최솟값이 존재한다.\n곱의 미분법과 합성함수의 미분법으로 $$f'(x)=1\\cdot\\sqrt{4-x^2}+x\\cdot\\frac{-2x}{2\\sqrt{4-x^2}}$$이다.\n정리하면 $f'(x)=\\sqrt{4-x^2}-\\frac{x^2}{\\sqrt{4-x^2}}=\\frac{(4-x^2)-x^2}{\\sqrt{4-x^2}}=\\frac{4-2x^2}{\\sqrt{4-x^2}}$이다.\n$f'=0$인 점은 $4-2x^2=0$에서 $x=\\pm\\sqrt{2}$이다.\n값을 계산하면 $f(\\sqrt{2})=\\sqrt{2}\\sqrt{4-2}=\\sqrt{2}\\cdot\\sqrt{2}=2$, $f(-\\sqrt{2})=-\\sqrt{2}\\cdot\\sqrt{2}=-2$이다.\n끝점에서는 $f(-2)=f(2)=0$이다.\n따라서 최댓값은 $2$, 최솟값은 $-2$이고 그 차는 $2-(-2)=4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "상품 1톤의 가격을 $x$만 원으로 정하면 $\\sqrt{29-x}$톤이 팔린다. 생산 비용이 톤당 2만 원이고 $0<x<29$일 때 최대 이익은?",
    "choices": [
      "48만 원",
      "50만 원",
      "52만 원",
      "54만 원",
      "56만 원"
    ],
    "answer": "④",
    "solution": "1톤을 $x$만 원에 정하면 $\\sqrt{29-x}$톤이 팔리므로 총매출은 $x\\sqrt{29-x}$만 원이다.\n톤당 생산비가 $2$만 원이므로 총이익은 $$P(x)=(x-2)\\sqrt{29-x}\\quad(0<x<29)$$이다.\n곱의 미분법과 합성함수의 미분법으로 $$P'(x)=1\\cdot\\sqrt{29-x}+(x-2)\\cdot\\frac{-1}{2\\sqrt{29-x}}$$이다.\n통분하면 $P'(x)=\\frac{2(29-x)-(x-2)}{2\\sqrt{29-x}}=\\frac{58-2x-x+2}{2\\sqrt{29-x}}=\\frac{60-3x}{2\\sqrt{29-x}}$이다.\n분모가 항상 양수이므로 $P'$의 부호는 분자 $60-3x$의 부호와 같다.\n$0<x<20$에서 $P'>0$, $20<x<29$에서 $P'<0$이므로 $x=20$에서 $P$가 최대이다.\n대입하면 $P(20)=(20-2)\\sqrt{29-20}=18\\sqrt{9}=18\\cdot 3=54$이다.\n따라서 최대 이익은 $54$만 원이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$a>0$에 대하여 $[0,a]$에서 $f(x)=2(x+a)\\sqrt{a^2-x^2}$의 최댓값을 $M(a)$라 하자. $\\lim_{a\\to\\infty}M(a)/\\sqrt{12a^4+1}$은?",
    "choices": [
      "$3/4$",
      "$1$",
      "$5/4$",
      "$3/2$",
      "$7/4$"
    ],
    "answer": "①",
    "solution": "$M(a)$를 구하기 위해 $0<x<a$에서 $f$를 미분한다.\n곱의 미분법과 합성함수의 미분법으로 $$f'(x)=2\\left\\{\\sqrt{a^2-x^2}+(x+a)\\cdot\\frac{-x}{\\sqrt{a^2-x^2}}\\right\\}$$이다.\n통분하면 $f'(x)=\\frac{2\\{(a^2-x^2)-x(x+a)\\}}{\\sqrt{a^2-x^2}}=\\frac{2(a^2-ax-2x^2)}{\\sqrt{a^2-x^2}}$이다.\n분자를 인수분해하면 $a^2-ax-2x^2=(a-2x)(a+x)$이므로 $$f'(x)=\\frac{2(a-2x)(a+x)}{\\sqrt{a^2-x^2}}$$이다.\n$0<x<a$에서 분모와 $a+x$는 양수이므로 $f'$의 부호는 $a-2x$의 부호와 같다.\n$0<x<\\frac{a}{2}$에서 $f'>0$, $\\frac{a}{2}<x<a$에서 $f'<0$이므로 $x=\\frac{a}{2}$에서 최대이다.\n따라서 $$M(a)=f\\left(\\frac{a}{2}\\right)=2\\left(\\frac{a}{2}+a\\right)\\sqrt{a^2-\\frac{a^2}{4}}=3a\\cdot\\frac{\\sqrt{3}\\,a}{2}=\\frac{3\\sqrt{3}}{2}a^2$$이다.\n구하는 극한은 $$\\lim_{a\\to\\infty}\\frac{\\frac{3\\sqrt{3}}{2}a^2}{\\sqrt{12a^4+1}}$$이다.\n분모를 $a^2$로 나누면 $\\sqrt{12a^4+1}=a^2\\sqrt{12+\\frac{1}{a^4}}$이므로 비는 $\\frac{\\frac{3\\sqrt{3}}{2}}{\\sqrt{12+\\frac{1}{a^4}}}$이다.\n$a\\to\\infty$일 때 $\\frac{1}{a^4}\\to 0$이므로 극한의 연산 법칙으로 극한값은 $\\frac{\\frac{3\\sqrt{3}}{2}}{\\sqrt{12}}=\\frac{\\frac{3\\sqrt{3}}{2}}{2\\sqrt{3}}=\\frac{3}{4}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_FUNCTION_LIMIT",
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
