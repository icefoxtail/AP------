window.examTitle = "미적분II_155_역함수에서의미분계수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$의 역함수 $g$가 미분가능하고 $f(2)=5,\\ f'(2)=\\frac34$이다. $\\lim_{h\\to0}\\frac{g(5+2h)-g(5)}{h}$의 값은?",
    "choices": [
      "$\\frac23$",
      "$\\frac43$",
      "$2$",
      "$\\frac83$",
      "$\\frac{10}{3}$"
    ],
    "answer": "④",
    "solution": "분모를 $2h$로 맞추어 미분계수의 정의를 쓸 준비를 한다. $$\\lim_{h\\to0}\\frac{g(5+2h)-g(5)}{h}=2\\lim_{h\\to0}\\frac{g(5+2h)-g(5)}{2h}$$\n$u=2h$로 치환하면 $h\\to0$일 때 $u\\to0$이므로 미분계수의 정의에 따라 $$2\\lim_{u\\to0}\\frac{g(5+u)-g(5)}{u}=2g'(5)$$\n$f(2)=5$이므로 역함수의 정의에 따라 $g(5)=2$이다.\n역함수의 미분법을 쓰면 $g'(5)=\\frac{1}{f'(g(5))}=\\frac{1}{f'(2)}=\\frac{1}{\\,3/4\\,}=\\frac{4}{3}$이다.\n따라서 구하는 값은 $2\\cdot\\frac{4}{3}=\\frac{8}{3}$이다.\n주의: 분모가 $h$이므로 $g'(5)$가 아니라 $2g'(5)$임을 놓치지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "그래프와 같은 미분가능한 증가함수 $f$의 역함수를 $g$라 하자. 미분계수가 $f'(2)>1$, $0<f'(5)<f'(4)<f'(2)$를 만족할 때 $g'(4)$와 같은 것은? [그림: 좌표평면에 직선 $y=x$와 오른쪽 위로 증가하며 접선의 기울기가 오른쪽으로 갈수록 작아지는 곡선 $y=f(x)$를 그린다. 곡선 위에 $(1,2),(2,4),(4,5)$를 표시하고 $(2,4)$에서 두 좌표축에 점선을 내린다.]",
    "choices": [
      "$\\frac1{f'(2)}$",
      "$\\frac1{f'(4)}$",
      "$\\frac1{f'(5)}$",
      "$f'(2)$",
      "$f'(2)+f'(4)$"
    ],
    "answer": "①",
    "solution": "그래프에서 곡선이 점 $(2,4)$를 지나므로 $f(2)=4$이다.\n역함수는 입력과 출력을 바꾸므로 역함수의 정의에 따라 $g(4)=2$이다.\n역함수의 미분법 $g'(x)=\\frac{1}{f'(g(x))}$에 $x=4$를 대입하면 $g'(4)=\\frac{1}{f'(g(4))}$이다.\n$g(4)=2$를 대입하면 $g'(4)=\\frac{1}{f'(2)}$이다.\n주의: $f'(2)>1$이므로 $0<g'(4)<1$이고, $f'(4),f'(5)$는 $g'(4)$와 무관하다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [
      "COND_STRICT_MONOTONE_VALUES",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_155_역함수에서의미분계수_고2_유형은행1/q2-problem.svg",
    "imageAlt": "주어진 세 점을 지나는 미분가능한 증가·완만한 곡선의 대표 개형과 y=x 및 점선 투영을 표시한다.",
    "imageCaption": "주어진 세 점을 지나는 미분가능한 증가·완만한 곡선의 대표 개형과 y=x 및 점선 투영을 표시한다.",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "그림과 같은 미분가능한 증가함수 $f$의 역함수를 $g$라 하자. 방정식 $t^2-5t+4=0$의 두 근이 $g'(2),g'(3)$일 때, $f'(5)g'(2)+f'(3)g'(3)$의 값은? [그림: 직선 $y=x$ 아래에 증가하며 위로 굽은 곡선 $y=f(x)$를 그리고 곡선 위 $(3,2),(5,3)$을 표시한다. 두 점에서 좌표축까지 수평선과 수직선을 점선으로 긋는다.]",
    "choices": [
      "$\\frac54$",
      "$\\frac94$",
      "$\\frac{13}4$",
      "$\\frac{17}4$",
      "$\\frac{21}4$"
    ],
    "answer": "④",
    "solution": "그래프에서 곡선이 $(3,2)$, $(5,3)$을 지나므로 $f(3)=2,\\ f(5)=3$이다.\n역함수의 정의에 따라 $g(2)=3,\\ g(3)=5$이다.\n방정식을 인수분해하면 $t^2-5t+4=(t-1)(t-4)=0$이므로 두 근은 $t=1,\\ 4$이다.\n$g'(2),\\ g'(3)$이 이 두 근이므로 근과 계수의 관계에서 $g'(2)+g'(3)=5,\\ g'(2)g'(3)=4$이다.\n역함수의 미분법으로 $f'(3)=\\frac{1}{g'(2)},\\ f'(5)=\\frac{1}{g'(3)}$이다.\n구하는 식에 대입하면 $f'(5)g'(2)+f'(3)g'(3)=\\frac{g'(2)}{g'(3)}+\\frac{g'(3)}{g'(2)}$이다.\n통분하면 $=\\frac{\\{g'(2)\\}^2+\\{g'(3)\\}^2}{g'(2)g'(3)}$이다.\n분자를 완전제곱식으로 바꾸면 $=\\frac{\\{g'(2)+g'(3)\\}^2-2g'(2)g'(3)}{g'(2)g'(3)}$이다.\n근의 합과 곱을 대입하면 $=\\frac{5^2-2\\cdot4}{4}=\\frac{25-8}{4}=\\frac{17}{4}$이다.\n주의: $f'(3)$은 $g'(3)$이 아니라 $g'(2)$의 역수이고, $f'(5)$는 $g'(3)$의 역수이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [
      "COND_STRICT_MONOTONE_VALUES"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_155_역함수에서의미분계수_고2_유형은행1/q3-problem.svg",
    "imageAlt": "증가하고 위로 굽는 대표 곡선 f가 (3,2),(5,3)을 지나며 각 점을 좌표축에 점선 투영한다.",
    "imageCaption": "증가하고 위로 굽는 대표 곡선 f가 (3,2),(5,3)을 지나며 각 점을 좌표축에 점선 투영한다.",
    "imageSize": "full"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "그림과 같은 미분가능한 증가함수 $f$의 역함수를 $g$라 하자. $f'(2)>f'(3)>f'(5)>0$일 때 $[g(x)]^3$의 $x=5$에서의 미분계수는? [그림: 직선 $y=x$와 그 위쪽의 증가 곡선 $y=f(x)$를 그린다. 곡선 위에 $(2,3),(3,5),(5,7)$을 표시하고 $(3,5)$의 좌표를 점선으로 두 축에 나타낸다.]",
    "choices": [
      "$\\frac{12}{f'(2)}$",
      "$\\frac{12}{f'(3)}$",
      "$\\frac{27}{f'(2)}$",
      "$\\frac{27}{f'(3)}$",
      "$\\frac{75}{f'(5)}$"
    ],
    "answer": "④",
    "solution": "그래프에서 곡선이 점 $(3,5)$를 지나므로 $f(3)=5$이고, 역함수의 정의에 따라 $g(5)=3$이다.\n역함수의 미분법을 쓰면 $g'(5)=\\frac{1}{f'(g(5))}=\\frac{1}{f'(3)}$이다.\n합성함수의 미분법으로 $\\frac{d}{dx}[g(x)]^3=3\\{g(x)\\}^2g'(x)$이다.\n$x=5$를 대입하면 $3\\{g(5)\\}^2g'(5)=3\\cdot3^2\\cdot\\frac{1}{f'(3)}$이다.\n계산하면 $3\\cdot9\\cdot\\frac{1}{f'(3)}=\\frac{27}{f'(3)}$이다.\n주의: 그래프의 $(5,7)$은 $g(7)=5$를 뜻할 뿐이고, 여기서 필요한 값은 $g(5)=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_155_역함수에서의미분계수_고2_유형은행1/q4-problem.svg",
    "imageAlt": "감소하는 양의 기울기를 가진 증가 곡선 f 위 (2,3),(3,5),(5,7), 대칭축 y=x와 (3,5) 투영선을 표시한다.",
    "imageCaption": "감소하는 양의 기울기를 가진 증가 곡선 f 위 (2,3),(3,5),(5,7), 대칭축 y=x와 (3,5) 투영선을 표시한다.",
    "imageSize": "full"
  }
];
