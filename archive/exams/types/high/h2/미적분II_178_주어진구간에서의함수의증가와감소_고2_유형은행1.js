window.examTitle = "미적분II_178_주어진구간에서의함수의증가와감소_고2_유형은행1";

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
    "content": "$f(x)=\\frac{5x^2+3x+a}{x^2+1}$가 $(-1,1)$에서 증가할 때, $a$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "몫의 미분법으로 도함수의 분자를 계산하면 $(10x+3)(x^2+1)-2x(5x^2+3x+a)$이다.\n전개하면 $10x^3+10x+3x^2+3-10x^3-6x^2-2ax=-3x^2+2(5-a)x+3$이다.\n분모 $(x^2+1)^2>0$이므로 $(-1,1)$에서 증가하려면 분자 $N(x)=-3x^2+2(5-a)x+3$이 음이 아니어야 한다.\n$N$은 연속이므로 구간 끝의 극한도 음이 아니어야 한다: $x\\to-1^+$에서 $N\\to2a-10\\ge0$이다.\n같은 이유로 $x\\to1^-$에서 $N\\to10-2a\\ge0$이다.\n두 조건에서 $a\\ge5$와 $a\\le5$를 동시에 얻으므로 $a=5$이다.\n$a=5$를 대입하면 $N(x)=3(1-x^2)$이므로 $(-1,1)$에서 $N(x)>0$이다.\n따라서 $f$는 실제로 증가하고, 답은 ⑤이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$f(x)=2\\ln x-ax$가 $(1,8)$에서 증가하도록 하는 실수 $a$의 최댓값은?",
    "choices": [
      "$1/8$",
      "$1/6$",
      "$1/5$",
      "$1/4$",
      "$1/3$"
    ],
    "answer": "④",
    "solution": "로그함수의 미분법으로 $f'(x)=\\frac{2}{x}-a$이다.\n$f$가 $(1,8)$에서 증가하려면 모든 $x\\in(1,8)$에서 $f'(x)\\ge0$, 즉 $a\\le\\frac{2}{x}$이어야 한다.\n$\\frac{2}{x}$는 $(1,8)$에서 감소하므로 $x\\to8^-$일 때 최솟값 $\\frac{2}{8}=\\frac{1}{4}$에 수렴한다.\n따라서 모든 $x$에서 $a\\le\\frac{2}{x}$일 필요충분조건은 $a\\le\\frac{1}{4}$이다.\n$a=\\frac{1}{4}$이면 $f'(x)=\\frac{2}{x}-\\frac{1}{4}=\\frac{8-x}{4x}>0$ ($1<x<8$)이므로 증가 조건을 만족한다.\n따라서 $a$의 최댓값은 $\\frac{1}{4}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
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
    "content": "$f(x)=e^{2x}+ae^x-6x$가 $(0,\\infty)$에서 증가하도록 하는 실수 $a$의 최솟값은?",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "①",
    "solution": "지수함수의 미분법으로 $f'(x)=2e^{2x}+ae^x-6$이다.\n$t=e^x$로 놓으면 $x>0$일 때 $t>1$이고, 조건은 모든 $t>1$에서 $g(t)=2t^2+at-6\\ge0$이다.\n필요조건으로 $t\\to1^+$일 때 $g(t)\\to2+a-6=a-4\\ge0$이므로 $a\\ge4$이다.\n$a=4$를 대입하면 $g(t)=2t^2+4t-6=2(t^2+2t-3)=2(t-1)(t+3)$이다.\n$t>1$이면 $t-1>0$, $t+3>0$이므로 $g(t)>0$이다.\n$a\\ge4$이면 $g(t)\\ge2t^2+4t-6>0$이므로 $a\\ge4$는 충분조건도 된다.\n따라서 $a$의 최솟값은 $4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
