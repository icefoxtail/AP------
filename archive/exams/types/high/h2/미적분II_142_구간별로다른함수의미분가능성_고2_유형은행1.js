window.examTitle = "미적분II_142_구간별로다른함수의미분가능성_고2_유형은행1";

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
    "content": "$f(x)=\\begin{cases}ae^{2x}&(x\\ge0)\\\\\\sin(3x)+b&(x<0)\\end{cases}$가 $x=0$에서 미분가능할 때 $a+b$는?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "미분가능하면 연속이므로 $x=0$에서 연속 조건을 확인한다.\n좌극한은 $\\lim_{x\\to0^-}(\\sin 3x+b)=b$, 함숫값은 $f(0)=a$이므로 $a=b$이다.\n좌미분계수는 $\\lim_{x\\to0^-}\\frac{\\sin 3x+b-b}{x}=\\lim_{x\\to0^-}\\frac{\\sin 3x}{x}=3$이다.\n우미분계수는 $(ae^{2x})'=2ae^{2x}$에서 $x=0$을 대입해 $2a$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $2a=3$, 즉 $a=\\frac32$이다.\n$a=b$이므로 $b=\\frac32$이고 $a+b=\\frac32+\\frac32=3$이다.\n주의: 연속 조건 $a=b$와 미분계수 조건 $2a=3$을 모두 사용해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-173",
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$f(x)=\\begin{cases}ax+b&(x\\le0)\\\\2+\\sin(x/3)&(x>0)\\end{cases}$가 $x=0$에서 미분가능할 때 $ab$는?",
    "choices": [
      "$0$",
      "$1/3$",
      "$2/3$",
      "$1$",
      "$4/3$"
    ],
    "answer": "③",
    "solution": "미분가능하면 연속이므로 $x=0$에서 연속 조건을 확인한다.\n좌극한은 $\\lim_{x\\to0^-}(ax+b)=b$, 우극한은 $\\lim_{x\\to0^+}(2+\\sin\\frac{x}{3})=2$이므로 $b=2$이다.\n좌미분계수는 $(ax+b)'=a$에서 $a$이다.\n우미분계수는 $(2+\\sin\\frac{x}{3})'=\\frac13\\cos\\frac{x}{3}$에서 $x=0$을 대입해 $\\frac13$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $a=\\frac13$이다.\n따라서 $ab=\\frac13\\cdot2=\\frac23$이다.\n주의: $\\sin\\frac{x}{3}$의 미분에서 $\\frac13$을 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-173",
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$f(x)=\\begin{cases}ax^2+5x+4&(x>-1)\\\\\\ln(x+2)+b&(-2<x\\le-1)\\end{cases}$가 $x=-1$에서 미분가능할 때 $a+b$는?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "미분가능하면 연속이므로 $x=-1$에서 연속 조건을 확인한다.\n우극한은 $\\lim_{x\\to-1^+}(ax^2+5x+4)=a-5+4=a-1$이다.\n좌극한은 $\\lim_{x\\to-1^-}(\\ln(x+2)+b)=\\ln1+b=b$이므로 $b=a-1$이다.\n우미분계수는 $(ax^2+5x+4)'=2ax+5$에서 $x=-1$을 대입해 $-2a+5$이다.\n좌미분계수는 $(\\ln(x+2)+b)'=\\frac1{x+2}$에서 $x=-1$을 대입해 $1$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $-2a+5=1$이고 $a=2$이다.\n연속 조건 $b=a-1$에서 $b=2-1=1$이다.\n따라서 $a+b=2+1=3$이다.\n주의: 연속 조건과 미분계수 조건을 혼동하지 않고 각각 적용한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-173",
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
