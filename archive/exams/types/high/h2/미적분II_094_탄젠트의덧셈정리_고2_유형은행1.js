window.examTitle = "미적분II_094_탄젠트의덧셈정리_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\tan(x+\\pi/4)=4$일 때, $\\tan x$는?",
    "choices": [
      "$\\frac{2}{5}$",
      "$\\frac{3}{5}$",
      "$\\frac{4}{5}$",
      "$1$",
      "$\\frac{6}{5}$"
    ],
    "answer": "②",
    "solution": "탄젠트의 덧셈정리에서 $\\tan(x+\\pi/4)=\\frac{\\tan x+1}{1-\\tan x}=4$이다.\n분모를 곱하여 정리하면 $\\tan x+1=4-4\\tan x$이다.\n$5\\tan x=3$이므로 $\\tan x=\\frac35$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\pi/2<x<\\pi$이고 $\\cos x=-2/\\sqrt{13}$일 때, $\\tan(x+\\pi/4)$는?",
    "choices": [
      "$-\\frac{4}{5}$",
      "$-\\frac{3}{5}$",
      "$-\\frac{2}{5}$",
      "$-\\frac{1}{5}$",
      "$\\frac{1}{5}$"
    ],
    "answer": "④",
    "solution": "$x$가 제2사분면이므로 $\\sin x>0$이고, $\\sin x=\\sqrt{1-\\cos^2x}=\\sqrt{1-\\frac4{13}}=\\frac3{\\sqrt{13}}$이다.\n따라서 $\\tan x=\\frac{\\sin x}{\\cos x}=\\frac{3/\\sqrt{13}}{-2/\\sqrt{13}}=-\\frac32$이다.\n탄젠트의 덧셈정리에서 $\\tan(x+\\pi/4)=\\frac{\\tan x+1}{1-\\tan x}$이다.\n대입하면 $\\frac{-3/2+1}{1+3/2}=\\frac{-1/2}{5/2}=-\\frac15$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\tan x=1/2$, $\\tan(x+y)=1$일 때, $\\tan(x-y)$는?",
    "choices": [
      "$0$",
      "$\\frac{1}{7}$",
      "$\\frac{2}{7}$",
      "$\\frac{3}{7}$",
      "$\\frac{4}{7}$"
    ],
    "answer": "②",
    "solution": "$\\tan(x+y)=1$에 탄젠트의 덧셈정리를 쓰면 $\\frac{\\tan x+\\tan y}{1-\\tan x\\tan y}=1$이다.\n$\\tan x=\\frac12$을 대입하면 $\\frac{1/2+\\tan y}{1-\\frac12\\tan y}=1$이다.\n분모를 곱하여 정리하면 $\\frac12+\\tan y=1-\\frac12\\tan y$이다.\n$\\frac32\\tan y=\\frac12$이므로 $\\tan y=\\frac13$이다.\n탄젠트의 차 공식에서 $\\tan(x-y)=\\frac{1/2-1/3}{1+(1/2)(1/3)}=\\frac{1/6}{7/6}=\\frac17$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "직선 $2x+3y-6=0$의 방향각을 $0<\\theta<\\pi$인 $\\theta$라 할 때, $\\tan(\\pi/4+\\theta)$는?",
    "choices": [
      "$0$",
      "$\\frac{1}{5}$",
      "$\\frac{2}{5}$",
      "$\\frac{3}{5}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "②",
    "solution": "직선 $2x+3y-6=0$을 $y$에 대해 풀면 $y=-\\frac23x+2$이므로 기울기는 $\\tan\\theta=-\\frac23$이다.\n탄젠트의 덧셈정리에서 $\\tan(\\pi/4+\\theta)=\\frac{1+\\tan\\theta}{1-\\tan\\theta}$이다.\n대입하면 $\\frac{1-2/3}{1+2/3}=\\frac{1/3}{5/3}=\\frac15$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$3t^2-8t-2=0$의 두 근이 $\\tan a,\\tan b$일 때, $\\tan(a+b)$는?",
    "choices": [
      "$1$",
      "$\\frac{6}{5}$",
      "$\\frac{7}{5}$",
      "$\\frac{8}{5}$",
      "$\\frac{9}{5}$"
    ],
    "answer": "④",
    "solution": "이차방정식의 근과 계수의 관계에서 $\\tan a+\\tan b=\\frac83$, $\\tan a\\tan b=-\\frac23$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b}$이다.\n분모는 $1-\\left(-\\frac23\\right)=\\frac53$이다.\n따라서 $\\tan(a+b)=\\frac{8/3}{5/3}=\\frac85$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$2t^2-5t-6=0$의 두 근이 $\\tan a,\\tan b$일 때, $\\sec^2(a+b)-1$은?",
    "choices": [
      "$\\frac{5}{16}$",
      "$\\frac{25}{64}$",
      "$\\frac{15}{32}$",
      "$\\frac{35}{64}$",
      "$\\frac{5}{8}$"
    ],
    "answer": "②",
    "solution": "이차방정식의 근과 계수의 관계에서 $\\tan a+\\tan b=\\frac52$, $\\tan a\\tan b=-3$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{5/2}{1-(-3)}=\\frac{5/2}{4}=\\frac58$이다.\n$\\sec^2(a+b)-1=\\tan^2(a+b)$이다.\n따라서 $\\left(\\frac58\\right)^2=\\frac{25}{64}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$t^2-8t-1=0$의 양의 근이 예각 $a$의 탄젠트, 음의 근이 둔각 $b$의 탄젠트이다. $\\cos a\\cos b-\\sin a\\sin b$는?",
    "choices": [
      "$-4/\\sqrt{17}$",
      "$-3/\\sqrt{17}$",
      "$-2/\\sqrt{17}$",
      "$-1/\\sqrt{17}$",
      "$1/\\sqrt{17}$"
    ],
    "answer": "④",
    "solution": "이차방정식의 근과 계수의 관계에서 $\\tan a+\\tan b=8$, $\\tan a\\tan b=-1$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{8}{1-(-1)}=\\frac82=4$이다.\n$a$는 예각, $b$는 둔각이므로 $a+b$는 $\\frac{\\pi}{2}$보다 크고 $\\frac{3\\pi}{2}$보다 작다.\n이 범위에서 $\\tan(a+b)>0$인 각은 제3사분면의 각뿐이므로 $a+b$는 제3사분면에 있다.\n따라서 $\\cos(a+b)<0$이고 $\\sec^2(a+b)=1+\\tan^2(a+b)=17$이다.\n$\\cos(a+b)=-\\frac1{\\sqrt{17}}$이다.\n코사인의 덧셈정리에서 $\\cos a\\cos b-\\sin a\\sin b=\\cos(a+b)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$AB=AC$인 삼각형의 각 $A,B$가 각각 $a,b$이고 $\\tan(a+b)=-2$일 때, $\\tan a$는?",
    "choices": [
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$",
      "$2$",
      "$\\frac{7}{3}$",
      "$\\frac{8}{3}$"
    ],
    "answer": "①",
    "solution": "$AB=AC$이므로 $\\angle B=\\angle C=b$이다.\n삼각형의 내각의 합에서 $a+2b=\\pi$, 즉 $a+b=\\pi-b$이다.\n$\\tan(a+b)=\\tan(\\pi-b)=-\\tan b$이므로 $-\\tan b=-2$, 즉 $\\tan b=2$이다.\n$a=\\pi-2b$이므로 $\\tan a=\\tan(\\pi-2b)=-\\tan 2b$이다.\n탄젠트의 배각 공식에서 $\\tan 2b=\\frac{2\\tan b}{1-\\tan^2b}=\\frac4{1-4}=-\\frac43$이다.\n따라서 $\\tan a=-\\left(-\\frac43\\right)=\\frac43$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$t^2-7t+10=0$의 두 근이 $\\tan a>\\tan b$일 때, $\\tan(a-b)$는?",
    "choices": [
      "$-\\frac{1}{11}$",
      "$0$",
      "$\\frac{1}{11}$",
      "$\\frac{2}{11}$",
      "$\\frac{3}{11}$"
    ],
    "answer": "⑤",
    "solution": "이차방정식을 인수분해하면 $(t-5)(t-2)=0$이므로 두 근은 $5,2$이다.\n$\\tan a>\\tan b$이므로 $\\tan a=5$, $\\tan b=2$이다.\n탄젠트의 차 공식에서 $\\tan(a-b)=\\frac{\\tan a-\\tan b}{1+\\tan a\\tan b}$이다.\n대입하면 $\\frac{5-2}{1+5\\cdot2}=\\frac3{11}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_MONOTONIC_ORDER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\pi/2<\\theta<\\pi$이고 $t^2-t\\sin\\theta+\\cos\\theta=0$의 두 근이 $\\tan a,\\tan b$이다. $\\tan(a+b)=1/2$이면 $\\sec\\theta$는?",
    "choices": [
      "$-2$",
      "$-\\frac{5}{3}$",
      "$-\\frac{4}{3}$",
      "$-1$",
      "$-\\frac{2}{3}$"
    ],
    "answer": "②",
    "solution": "이차방정식의 근과 계수의 관계에서 $\\tan a+\\tan b=\\sin\\theta$, $\\tan a\\tan b=\\cos\\theta$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{\\sin\\theta}{1-\\cos\\theta}=\\frac12$이다.\n양변에 $2(1-\\cos\\theta)$를 곱하면 $2\\sin\\theta=1-\\cos\\theta$이다.\n양변을 제곱하고 $\\sin^2\\theta=1-\\cos^2\\theta$를 쓰면 $4(1-\\cos^2\\theta)=(1-\\cos\\theta)^2$이다.\n$\\theta$가 제2사분면이므로 $1-\\cos\\theta\\ne0$이고, 양변을 $1-\\cos\\theta$로 나누면 $4(1+\\cos\\theta)=1-\\cos\\theta$이다.\n$5\\cos\\theta=-3$이므로 $\\cos\\theta=-\\frac35$이다.\n$\\sec\\theta=\\frac1{\\cos\\theta}=-\\frac53$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "두 예각 $x,y$에 대해 $(\\tan x+2)(\\tan y-2)=-5$일 때, $\\cos(x-y)$는?",
    "choices": [
      "$2\\sqrt5/5$",
      "$\\sqrt{21}/5$",
      "$\\sqrt{22}/5$",
      "$\\sqrt{23}/5$",
      "$\\sqrt{24}/5$"
    ],
    "answer": "①",
    "solution": "$u=\\tan x$, $v=\\tan y$라 하면 $x,y$가 예각이므로 $u>0$, $v>0$이다.\n주어진 식을 전개하면 $uv-2u+2v-4=-5$이다.\n정리하면 $uv+1=2(u-v)$이고 $uv+1>0$이므로 $u-v\\ne0$이다.\n탄젠트의 차 공식에서 $\\tan(x-y)=\\frac{u-v}{1+uv}$이다.\n$1+uv=2(u-v)$를 대입하면 $\\tan(x-y)=\\frac{u-v}{2(u-v)}=\\frac12$이다.\n주의: $\\tan(x-y)>0$이고 $x-y\\in\\left(-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right)$이므로 $\\cos(x-y)>0$이다.\n$\\cos(x-y)=\\frac1{\\sqrt{1+\\tan^2(x-y)}}=\\frac1{\\sqrt{1+1/4}}=\\frac2{\\sqrt5}=\\frac{2\\sqrt5}{5}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 12,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "제1사분면의 각 $a$와 제4사분면의 각 $b$에 대하여 $\\sin a=4/5$, $\\sin b=-3/5$일 때, $\\tan(a+b)$는?",
    "choices": [
      "$\\frac{5}{24}$",
      "$\\frac{1}{4}$",
      "$\\frac{7}{24}$",
      "$\\frac{1}{3}$",
      "$\\frac{3}{8}$"
    ],
    "answer": "③",
    "solution": "$a$는 제1사분면이므로 $\\cos a=\\sqrt{1-\\left(\\frac45\\right)^2}=\\frac35$, $\\tan a=\\frac43$이다.\n$b$는 제4사분면이므로 $\\cos b=\\sqrt{1-\\left(-\\frac35\\right)^2}=\\frac45$, $\\tan b=-\\frac34$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b}$이다.\n대입하면 $\\frac{\\frac43-\\frac34}{1-\\frac43\\left(-\\frac34\\right)}=\\frac{\\frac7{12}}{1+1}=\\frac7{24}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "제2사분면의 각 $a$와 제4사분면의 각 $b$에 대하여 $\\sin a=3/5$, $\\sin b=-5/13$일 때, $\\tan(a+b)$는?",
    "choices": [
      "$-\\frac{20}{11}$",
      "$-\\frac{59}{33}$",
      "$-\\frac{58}{33}$",
      "$-\\frac{19}{11}$",
      "$-\\frac{56}{33}$"
    ],
    "answer": "⑤",
    "solution": "$a$는 제2사분면이므로 $\\cos a=-\\frac45$, $\\tan a=-\\frac34$이다.\n$b$는 제4사분면이므로 $\\cos b=\\frac{12}{13}$, $\\tan b=-\\frac5{12}$이다.\n탄젠트의 덧셈정리에서 $\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b}$이다.\n분자를 계산하면 $-\\frac34-\\frac5{12}=-\\frac9{12}-\\frac5{12}=-\\frac{14}{12}=-\\frac76$이다.\n분모를 계산하면 $1-\\left(-\\frac34\\right)\\left(-\\frac5{12}\\right)=1-\\frac{15}{48}=\\frac{33}{48}=\\frac{11}{16}$이다.\n따라서 $\\tan(a+b)=\\frac{-7/6}{11/16}=-\\frac{112}{66}=-\\frac{56}{33}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "등대에서 수평으로 8 m 떨어진 곳에 눈높이 2 m인 사람이 있다. 등대 밑을 내려다보는 각보다 꼭대기를 올려다보는 각이 $\\pi/4$만큼 클 때, 등대의 높이는? [그림: 등대 밑 $(0,0)$, 꼭대기 $(0,h)$, 눈 $(-8,2)$를 두고 두 시선과 눈높이 수평선 표시]",
    "choices": [
      "$\\frac{40}{3}\\, \\mathrm{m}$",
      "$\\frac{43}{3}\\, \\mathrm{m}$",
      "$\\frac{46}{3}\\, \\mathrm{m}$",
      "$\\frac{49}{3}\\, \\mathrm{m}$",
      "$\\frac{52}{3}\\, \\mathrm{m}$"
    ],
    "answer": "③",
    "solution": "눈높이 수평선에서 등대 밑을 내려다보는 각을 $\\alpha$, 꼭대기를 올려다보는 각을 $\\beta$라 하자.\n수평거리가 $8$ m이고 눈과 등대 밑의 높이 차가 $2$ m이므로 $\\tan\\alpha=\\frac28=\\frac14$이다.\n꼭대기까지의 높이 차는 $h-2$이므로 $\\tan\\beta=\\frac{h-2}{8}$이다.\n$\\beta-\\alpha=\\frac{\\pi}{4}$이므로 탄젠트의 차 공식에서 $\\tan(\\beta-\\alpha)=\\frac{\\tan\\beta-\\tan\\alpha}{1+\\tan\\beta\\tan\\alpha}=1$이다.\n$t=\\tan\\beta$로 두면 $\\frac{t-1/4}{1+t/4}=1$이다.\n분모를 곱하여 정리하면 $t-\\frac14=1+\\frac t4$, 즉 $\\frac34t=\\frac54$이므로 $t=\\frac53$이다.\n$\\frac{h-2}{8}=\\frac53$에서 $h-2=\\frac{40}{3}$, 따라서 $h=\\frac{46}{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-157",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_ELEVATION_DEPRESSION_ANGLE",
      "CC_TANGENT_APPLICATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_094_탄젠트의덧셈정리_고2_유형은행1/q14-problem.svg",
    "imageAlt": "등대 밑 B, 꼭대기 T, 눈 E와 눈높이 수평선 EH 및 각 α,β.",
    "imageCaption": "등대 밑 B, 꼭대기 T, 눈 E와 눈높이 수평선 EH 및 각 α,β.",
    "imageSize": "full"
  }
];
