window.examTitle = "미적분II_096_배각의공식_고2_유형은행1";

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
    "content": "$\\sin x=4/5$일 때, $\\cos2x$는?",
    "choices": [
      "$-\\frac{7}{25}$",
      "$-\\frac{1}{5}$",
      "$-\\frac{3}{25}$",
      "$-\\frac{1}{25}$",
      "$\\frac{1}{25}$"
    ],
    "answer": "①",
    "solution": "코사인 배각 공식 $\\cos2x=1-2\\sin^2x$를 적용한다.\n$\\sin x=\\frac45$를 대입하면 $\\cos2x=1-2\\left(\\frac45\\right)^2$이다.\n제곱을 계산하면 $\\cos2x=1-2\\cdot\\frac{16}{25}=1-\\frac{32}{25}$이다.\n통분하면 $\\cos2x=\\frac{25-32}{25}=-\\frac{7}{25}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [],
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
    "content": "$0<x<\\pi/4$, $\\tan2x=3/4$일 때, $45\\tan x$는?",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "⑤",
    "solution": "$t=\\tan x$로 놓으면 탄젠트 배각 공식에서 $\\tan2x=\\frac{2t}{1-t^2}$이다.\n$\\tan2x=\\frac34$를 대입하면 $\\frac{2t}{1-t^2}=\\frac34$이다.\n분모를 곱해 정리하면 $8t=3(1-t^2)$, 즉 $3t^2+8t-3=0$이다.\n인수분해하면 $(3t-1)(t+3)=0$이므로 $t=\\frac13$ 또는 $t=-3$이다.\n$0<x<\\frac{\\pi}{4}$이므로 $0<t<1$이고, 따라서 $t=\\frac13$이다.\n$45\\tan x=45t=45\\cdot\\frac13=15$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION"
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
    "content": "$\\tan x=2/9$일 때, $\\sin2x$는?",
    "choices": [
      "$\\frac{33}{85}$",
      "$\\frac{36}{85}$",
      "$\\frac{39}{85}$",
      "$\\frac{42}{85}$",
      "$\\frac{9}{17}$"
    ],
    "answer": "②",
    "solution": "탄젠트로 나타낸 사인 배각 공식 $\\sin2x=\\frac{2\\tan x}{1+\\tan^2x}$를 적용한다.\n$\\tan x=\\frac29$를 대입하면 $\\sin2x=\\frac{2\\cdot\\frac29}{1+\\left(\\frac29\\right)^2}$이다.\n분자와 분모를 각각 계산하면 $\\sin2x=\\frac{\\frac49}{1+\\frac4{81}}=\\frac{\\frac49}{\\frac{85}{81}}$이다.\n분수의 나눗셈을 계산하면 $\\sin2x=\\frac49\\cdot\\frac{81}{85}=\\frac{36}{85}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
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
    "content": "지름 $AB$가 10인 원 위의 두 점 $P,Q$가 직선 $AB$의 서로 반대쪽에 있다. $AP=8$, $\\angle QAB=2\\angle PAB$일 때, $AQ$는? [그림: 수평 지름 $A(-5,0),B(5,0)$, 아래쪽 호에 $P$, 위쪽 호에 $Q$를 두고 $AP,AQ,BP,BQ$를 연결]",
    "choices": [
      "$2$",
      "$\\frac{12}{5}$",
      "$\\frac{14}{5}$",
      "$\\frac{16}{5}$",
      "$\\frac{18}{5}$"
    ],
    "answer": "③",
    "solution": "$a=\\angle PAB$로 놓는다. $AB$가 지름이므로 원주각의 성질에서 $\\angle APB=90^\\circ$이다.\n직각삼각형 $APB$에서 코사인 정의를 쓰면 $\\cos a=\\frac{AP}{AB}=\\frac{8}{10}=\\frac45$이다.\n$AB$가 지름이므로 $\\angle AQB=90^\\circ$이고, $\\angle QAB=2a$이다.\n직각삼각형 $AQB$에서 $AQ=AB\\cos\\angle QAB=10\\cos2a$이다.\n코사인 배각 공식 $\\cos2a=2\\cos^2a-1$을 적용하면 $\\cos2a=2\\left(\\frac45\\right)^2-1$이다.\n계산하면 $\\cos2a=2\\cdot\\frac{16}{25}-1=\\frac{32}{25}-\\frac{25}{25}=\\frac7{25}$이다.\n따라서 $AQ=10\\cdot\\frac7{25}=\\frac{70}{25}=\\frac{14}{5}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
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
    "content": "반지름 5인 원 $O$의 지름 $AB$에서 $A$는 제1사분면에 있고 $\\cos\\angle AOC=3/5$이다. $C=(5,0)$이고 $D$가 $A$에서 $OC$에 내린 수선의 발일 때, $x=\\angle ABD$에 대해 $\\sin2x$는? [그림: $O(0,0),C(5,0),A(3,4),B(-3,-4),D(3,0)$을 놓고 지름 $AB$, 반지름 $OC$, 수선 $AD$, 선분 $BD$를 표시]",
    "choices": [
      "$\\frac{36}{65}$",
      "$\\frac{188}{325}$",
      "$\\frac{196}{325}$",
      "$\\frac{204}{325}$",
      "$\\frac{212}{325}$"
    ],
    "answer": "④",
    "solution": "$C=(5,0)$이고 $OC$는 양의 $x$축이므로, $\\cos\\angle AOC=\\frac35$와 $A$가 제1사분면에 있는 조건에서 $\\sin\\angle AOC=\\frac45$이다.\n따라서 $A=(5\\cos\\angle AOC,\\,5\\sin\\angle AOC)=(3,4)$이다.\n$AB$가 지름이므로 $B$는 $A$의 중심 $O$에 대한 대칭점이고 $B=(-3,-4)$이다.\n$D$는 $A$에서 $OC$(즉 $x$축)에 내린 수선의 발이므로 $D=(3,0)$이다.\n직선 $BA$의 기울기는 $\\frac{4-(-4)}{3-(-3)}=\\frac86=\\frac43$이다.\n직선 $BD$의 기울기는 $\\frac{0-(-4)}{3-(-3)}=\\frac46=\\frac23$이다.\n두 직선이 양의 $x$축과 이루는 각을 각각 $\\alpha,\\beta$라 하면 $\\tan\\alpha=\\frac43$, $\\tan\\beta=\\frac23$이다.\n$x=\\angle ABD=\\alpha-\\beta$이므로 탄젠트의 차 공식 $\\tan x=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$를 적용한다.\n대입하면 $\\tan x=\\frac{\\frac43-\\frac23}{1+\\frac43\\cdot\\frac23}=\\frac{\\frac23}{1+\\frac89}=\\frac{\\frac23}{\\frac{17}{9}}=\\frac{6}{17}$이다.\n사인 배각 공식 $\\sin2x=\\frac{2\\tan x}{1+\\tan^2x}$에 $\\tan x=\\frac{6}{17}$을 대입한다.\n$\\sin2x=\\frac{2\\cdot\\frac{6}{17}}{1+\\left(\\frac{6}{17}\\right)^2}=\\frac{\\frac{12}{17}}{1+\\frac{36}{289}}=\\frac{\\frac{12}{17}}{\\frac{325}{289}}$이다.\n분수의 나눗셈을 계산하면 $\\sin2x=\\frac{12}{17}\\cdot\\frac{289}{325}=\\frac{204}{325}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT",
      "CC_COORDINATE_TRIG",
      "CC_QUADRANT_CONDITION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$t^2+(3/2)t+a=0$의 두 근이 $4\\sin x,\\cos2x$일 때, $a$는?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "⑤",
    "solution": "$s=\\sin x$로 놓으면 코사인 배각 공식에서 $\\cos2x=1-2\\sin^2x=1-2s^2$이다.\n이차방정식의 근과 계수의 관계에서 두 근의 합은 $-\\frac32$이므로 $4s+(1-2s^2)=-\\frac32$이다.\n양변에 2를 곱하여 정리하면 $8s+2-4s^2=-3$, 즉 $4s^2-8s-5=0$이다.\n인수분해하면 $(2s+1)(2s-5)=0$이므로 $s=-\\frac12$ 또는 $s=\\frac52$이다.\n$-1\\le s=\\sin x\\le1$이므로 $s=-\\frac12$만 가능하다.\n이때 두 근은 $4s=4\\left(-\\frac12\\right)=-2$와 $1-2s^2=1-2\\cdot\\frac14=\\frac12$이다.\n근과 계수의 관계에서 두 근의 곱은 $a$이므로 $a=(-2)\\cdot\\frac12=-1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
