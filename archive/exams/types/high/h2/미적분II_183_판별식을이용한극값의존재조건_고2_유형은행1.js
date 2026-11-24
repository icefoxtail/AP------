window.examTitle = "미적분II_183_판별식을이용한극값의존재조건_고2_유형은행1";

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
    "content": "$f(x)=e^x(x^2+4x+a)$가 극값을 갖지 않도록 하는 실수 $a$의 최솟값은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $f'(x)=e^x(x^2+4x+a)+e^x(2x+4)$를 계산한다.\n같은 항을 묶으면 $f'(x)=e^x(x^2+6x+a+4)$이다.\n$e^x>0$이므로 극값이 없으려면 이차식 $x^2+6x+a+4$의 부호가 바뀌지 않아야 한다.\n따라서 판별식 $D=6^2-4(a+4)=20-4a$가 $D\\le0$이어야 한다.\n$20-4a\\le0$을 풀면 $a\\ge5$이다.\n$a=5$이면 $f'(x)=e^x(x+3)^2\\ge0$이어서 $x=-3$에서 부호가 바뀌지 않는다.\n주의: $D=0$인 경우에도 접점에서 부호가 유지되므로 극값이 생기지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_ALWAYS_POSITIVE_QUADRATIC_DERIVATIVE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=3x^2-ax+\\ln x$가 극값을 갖도록 하는 정수 $a$의 최솟값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "로그함수의 미분법으로 $f'(x)=6x-a+\\frac1x$를 구한다.\n통분하면 $f'(x)=\\frac{6x^2-ax+1}{x}$이고 정의역은 $x>0$이다.\n분모 $x$가 양수이므로 극값은 분자 $6x^2-ax+1$이 부호를 바꿀 때 생긴다.\n분자가 서로 다른 두 양의 근을 가지려면 판별식과 근의 부호를 함께 확인한다.\n판별식 조건은 $D=a^2-4\\cdot6\\cdot1=a^2-24>0$이다.\n근과 계수의 관계에서 두 근의 곱은 $\\frac16>0$, 합은 $\\frac a6$이므로 두 근이 양수이려면 $a>0$이다.\n$D>0$과 $a>0$을 합하면 $a>\\sqrt{24}=2\\sqrt6$이고 $2\\sqrt6\\approx4.90$이다.\n$a$가 정수이므로 최솟값은 $5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=2\\ln x+a/x-x$가 극댓값과 극솟값을 모두 가지도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a<0$",
      "$0<a<1/2$",
      "$0<a<1$",
      "$a>1$",
      "$1<a<2$"
    ],
    "answer": "③",
    "solution": "로그함수와 $x^{-1}$의 미분법으로 $f'(x)=\\frac2x-\\frac{a}{x^2}-1$을 구한다.\n통분하면 $f'(x)=\\frac{2x-a-x^2}{x^2}=\\frac{-(x^2-2x+a)}{x^2}$이다.\n정의역 $x>0$에서 분모 $x^2>0$이므로 $x^2-2x+a=0$의 근에서만 부호가 바뀔 수 있다.\n극댓값과 극솟값을 모두 가지려면 이 방정식이 서로 다른 두 양의 근을 가져야 한다.\n판별식 조건은 $D=(-2)^2-4\\cdot1\\cdot a=4-4a>0$이므로 $a<1$이다.\n근과 계수의 관계에서 두 근의 합은 $2>0$, 곱은 $a$이므로 두 근이 양수이려면 $a>0$이다.\n따라서 $0<a<1$이다.\n이때 분자의 이차식이 두 근 사이에서 양수, 바깥에서 음수이므로 도함수의 부호가 두 번 바뀐다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$k>0$일 때 $f(x)=kx-\\ln(x^2+4)$가 극값을 갖지 않도록 하는 $k$의 최솟값은?",
    "choices": [
      "$1/6$",
      "$1/5$",
      "$1/4$",
      "$1/3$",
      "$1/2$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 $f'(x)=k-\\frac{2x}{x^2+4}$를 구한다.\n통분하면 $f'(x)=\\frac{k(x^2+4)-2x}{x^2+4}=\\frac{kx^2-2x+4k}{x^2+4}$이다.\n분모가 항상 양수이고 $k>0$이므로 분자의 부호 변화만 확인하면 된다.\n이차식 $kx^2-2x+4k$가 부호를 바꾸지 않으려면 판별식이 $0$ 이하여야 한다.\n판별식은 $D=(-2)^2-4\\cdot k\\cdot4k=4-16k^2$이다.\n$4-16k^2\\le0$에서 $k^2\\ge\\frac14$이고 $k>0$이므로 $k\\ge\\frac12$이다.\n$k=\\frac12$이면 $f'(x)=\\frac{\\frac12(x-2)^2}{x^2+4}\\ge0$이므로 부호가 바뀌지 않는다.\n주의: $D=0$이면 도함수가 한 점에서 $0$이지만 극값은 아니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_ALWAYS_POSITIVE_QUADRATIC_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
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
    "content": "$a>0$일 때 $f(x)=ax+2\\ln(x^2+25)$가 극값을 갖지 않도록 하는 $a$의 최솟값은?",
    "choices": [
      "$2/5$",
      "$1/2$",
      "$3/5$",
      "$7/10$",
      "$4/5$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 $f'(x)=a+\\frac{4x}{x^2+25}$를 구한다.\n통분하면 $f'(x)=\\frac{a(x^2+25)+4x}{x^2+25}=\\frac{ax^2+4x+25a}{x^2+25}$이다.\n분모가 항상 양수이고 $a>0$이므로 분자가 부호를 바꾸지 않아야 극값이 없다.\n이차식 $ax^2+4x+25a$의 판별식은 $D=4^2-4\\cdot a\\cdot25a=16-100a^2$이다.\n$D\\le0$에서 $16-100a^2\\le0$, 즉 $a^2\\ge\\frac{4}{25}$이다.\n$a>0$이므로 $a\\ge\\frac25$이다.\n$a=\\frac25$이면 분자는 $\\frac25(x+5)^2$이므로 도함수가 음수가 되지 않는다.\n주의: $a=\\frac25$에서는 $x=-5$ 한 점에서만 도함수가 $0$이고 부호는 유지된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_ALWAYS_POSITIVE_QUADRATIC_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 6,
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
    "content": "$f(x)=x/4-\\ln(3x^2+n)$이 극값을 갖지 않도록 하는 자연수 $n$의 최솟값은?",
    "choices": [
      "47",
      "48",
      "49",
      "50",
      "51"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법으로 $f'(x)=\\frac14-\\frac{6x}{3x^2+n}$을 구한다.\n통분하면 $f'(x)=\\frac{(3x^2+n)-24x}{4(3x^2+n)}=\\frac{3x^2-24x+n}{4(3x^2+n)}$이다.\n$n$이 자연수이므로 $3x^2+n>0$이고 분모는 항상 양수이다.\n따라서 분자 $3x^2-24x+n$이 부호를 바꾸지 않아야 극값이 없다.\n판별식은 $D=(-24)^2-4\\cdot3\\cdot n=576-12n$이다.\n$D\\le0$에서 $576-12n\\le0$, 즉 $n\\ge48$이다.\n$n=48$이면 분자는 $3x^2-24x+48=3(x-4)^2$이므로 도함수의 부호가 유지된다.\n주의: $n=48$은 판별식이 $0$인 경계이지만 $x=4$에서 부호가 바뀌지 않아 극값이 없다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_ALWAYS_POSITIVE_QUADRATIC_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "NONE"
  }
];
