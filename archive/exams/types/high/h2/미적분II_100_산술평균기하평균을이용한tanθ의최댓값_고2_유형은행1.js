window.examTitle = "미적분II_100_산술평균기하평균을이용한tanθ의최댓값_고2_유형은행1";

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
    "content": "$m>0$일 때 두 직선 $25x-my=0$, $4x-my=0$이 이루는 예각을 $\\theta$라 한다. $\\tan\\theta$의 최댓값은?",
    "choices": [
      "$\\frac{17}{20}$",
      "$\\frac{19}{20}$",
      "$\\frac{21}{20}$",
      "$\\frac{23}{20}$",
      "$\\frac{5}{4}$"
    ],
    "answer": "③",
    "solution": "두 직선의 기울기를 구한다: $25x-my=0$에서 $y=\\frac{25}{m}x$, $4x-my=0$에서 $y=\\frac{4}{m}x$.\n두 직선이 이루는 예각 $\\theta$에 대하여 탄젠트 공식을 적용한다: $\\tan\\theta=\\left|\\frac{25/m-4/m}{1+(25/m)(4/m)}\\right|$.\n분자를 계산하면 $\\frac{21}{m}$, 분모는 $1+\\frac{100}{m^2}=\\frac{m^2+100}{m^2}$이다.\n따라서 $\\tan\\theta=\\frac{21/m}{(m^2+100)/m^2}=\\frac{21m}{m^2+100}=\\frac{21}{m+100/m}$.\n산술평균과 기하평균의 관계에서 $m+\\frac{100}{m}\\ge 2\\sqrt{m\\cdot\\frac{100}{m}}=20$이다.\n등호는 $m=\\frac{100}{m}$, 즉 $m=10$일 때 성립한다.\n그러므로 분모의 최솟값은 $20$이고 $\\tan\\theta$의 최댓값은 $\\frac{21}{20}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$A(0,2),B(0,8),C(t,0)$에 대하여 $t>0$이다. $\\angle ACB$가 최대가 되는 $t$는? [그림: 양의 $y$축 위의 $A,B$, 양의 $x$축 위의 $C$, 두 선분 $CA,CB$와 그 사이의 각 표시]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "두 직선 $CA$, $CB$의 기울기를 구한다: $m_{CA}=\\frac{2-0}{0-t}=-\\frac{2}{t}$, $m_{CB}=\\frac{8-0}{0-t}=-\\frac{8}{t}$.\n두 직선이 이루는 각 $\\angle ACB$에 대하여 탄젠트 공식을 적용한다: $\\tan\\angle ACB=\\left|\\frac{-2/t-(-8/t)}{1+(-2/t)(-8/t)}\\right|$.\n분자는 $\\frac{6}{t}$, 분모는 $1+\\frac{16}{t^2}=\\frac{t^2+16}{t^2}$이다.\n따라서 $\\tan\\angle ACB=\\frac{6/t}{(t^2+16)/t^2}=\\frac{6t}{t^2+16}=\\frac{6}{t+16/t}$.\n$t>0$이고 각이 예각이므로 탄젠트가 클수록 각도 크다.\n산술평균과 기하평균의 관계에서 $t+\\frac{16}{t}\\ge 2\\sqrt{t\\cdot\\frac{16}{t}}=8$이다.\n등호는 $t=\\frac{16}{t}$, 즉 $t=4$일 때 성립한다.\n그러므로 $\\tan\\angle ACB$가 최대가 되어 $\\angle ACB$도 최대가 되는 값은 $t=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$A(9,0),B(25,0),P(0,y)$에서 $y>0$이다. $\\tan\\angle APB$가 최대가 되는 $y$는? [그림: 양의 $x$축 위의 $A,B$, 양의 $y$축 위의 $P$ 및 두 선분 $PA,PB$ 표시]",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "⑤",
    "solution": "두 직선 $PA$, $PB$의 기울기를 구한다: $m_{PA}=\\frac{0-y}{9-0}=-\\frac{y}{9}$, $m_{PB}=\\frac{0-y}{25-0}=-\\frac{y}{25}$.\n탄젠트 공식을 적용한다: $\\tan\\angle APB=\\left|\\frac{-y/9-(-y/25)}{1+(-y/9)(-y/25)}\\right|$.\n분자는 $y\\left(\\frac{1}{9}-\\frac{1}{25}\\right)=\\frac{16y}{225}$, 분모는 $1+\\frac{y^2}{225}=\\frac{225+y^2}{225}$이다.\n따라서 $\\tan\\angle APB=\\frac{16y/225}{(225+y^2)/225}=\\frac{16y}{y^2+225}=\\frac{16}{y+225/y}$.\n$y>0$이고 $\\angle APB$는 예각이므로 탄젠트가 최대일 때 각이 최대이다.\n산술평균과 기하평균의 관계에서 $y+\\frac{225}{y}\\ge 2\\sqrt{y\\cdot\\frac{225}{y}}=30$이다.\n등호는 $y=\\frac{225}{y}$, 즉 $y=15$일 때 성립한다.\n그러므로 분모가 최소이고 $\\tan\\angle APB$가 최대가 되는 값은 $y=15$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "수직 받침대의 밑은 $C$, 위는 $B$이고 그 위에 세운 조형물의 꼭대기는 $A$이다. $BC=4$ m, $AB=12$ m이다. 지면의 점 $P$에서 $PC=x$ m이고 $\\theta=\\angle APB$가 최대일 때, $x\\tan\\theta$는? [그림: 수평 지면에 $P,C$를 놓고 $C$ 위로 $B(높이 4),A(높이 16)$를 세워 $PA,PB$를 연결]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "받침대와 조형물의 높이로부터 $B$의 높이는 $4$, $A$의 높이는 $4+12=16$이다.\n$P(x,0)$에서 두 점 $A$, $B$를 보는 직선의 기울기를 구한다: $m_{PA}=-\\frac{16}{x}$, $m_{PB}=-\\frac{4}{x}$.\n탄젠트 공식을 적용한다: $\\tan\\theta=\\left|\\frac{-16/x-(-4/x)}{1+(-16/x)(-4/x)}\\right|$.\n분자는 $\\frac{12}{x}$, 분모는 $1+\\frac{64}{x^2}=\\frac{x^2+64}{x^2}$이다.\n따라서 $\\tan\\theta=\\frac{12/x}{(x^2+64)/x^2}=\\frac{12x}{x^2+64}=\\frac{12}{x+64/x}$.\n산술평균과 기하평균의 관계에서 $x+\\frac{64}{x}\\ge 2\\sqrt{x\\cdot\\frac{64}{x}}=16$이고 등호는 $x=8$에서 성립한다.\n$\\theta$가 최대일 때 $x=8$이고 $\\tan\\theta=\\frac{12}{16}=\\frac{3}{4}$이다.\n따라서 $x\\tan\\theta=8\\cdot\\frac{3}{4}=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_MEASUREMENT",
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
    "content": "높이 5 m의 수직 받침대 위에 높이 15 m의 조형물이 있다. 지면에서 조형물의 양 끝을 보는 두 시선의 사이각이 최대가 되려면 받침대 밑에서 수평으로 몇 m 떨어져야 하는가? [그림: 지면 위 $P,C$, $C$의 수직 위 높이 5 m의 $B$와 높이 20 m의 $A$, 두 시선 $PA,PB$ 표시]",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "③",
    "solution": "받침대 위 조형물의 높이를 더하면 $B$의 높이는 $5$, $A$의 높이는 $5+15=20$이다.\n$P$에서 받침대 밑 $C$까지의 거리를 $PC=x$라 하면 $P(x,0)$에서 두 점을 보는 직선의 기울기는 $m_{PA}=-\\frac{20}{x}$, $m_{PB}=-\\frac{5}{x}$이다.\n탄젠트 공식을 적용한다: $\\tan\\theta=\\left|\\frac{-20/x-(-5/x)}{1+(-20/x)(-5/x)}\\right|$.\n분자는 $\\frac{15}{x}$, 분모는 $1+\\frac{100}{x^2}=\\frac{x^2+100}{x^2}$이다.\n따라서 $\\tan\\theta=\\frac{15/x}{(x^2+100)/x^2}=\\frac{15x}{x^2+100}=\\frac{15}{x+100/x}$.\n산술평균과 기하평균의 관계에서 $x+\\frac{100}{x}\\ge 2\\sqrt{x\\cdot\\frac{100}{x}}=20$이다.\n등호는 $x=\\frac{100}{x}$, 즉 $x=10$일 때 성립한다.\n그러므로 시야각 $\\theta$가 최대가 되는 수평거리는 $10$ m이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_ELEVATION_ANGLE",
      "CC_TRIG_RATIO"
    ],
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
    "content": "수평 지면의 점 $P$에서 건물을 볼 때, 건물 벽의 높이 9 m 지점 $A$부터 높이 25 m 지점 $B$까지의 시야각을 $\\theta$라 한다. 눈높이를 무시할 때 $\\tan\\theta$의 최댓값은? [그림: 수평 지면 위 $P$와 건물 밑 $C$, $C$ 위의 $A,B$ 및 시선 $PA,PB$와 그 사이의 각 표시]",
    "choices": [
      "$\\frac{8}{15}$",
      "$\\frac{3}{5}$",
      "$\\frac{2}{3}$",
      "$\\frac{11}{15}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "①",
    "solution": "건물 벽의 두 지점까지의 높이로부터 $A$의 높이는 $9$, $B$의 높이는 $25$이다.\n$PC=x$라 하고 $P(x,0)$에서 두 점을 보는 직선의 기울기를 구한다: $m_{PA}=-\\frac{9}{x}$, $m_{PB}=-\\frac{25}{x}$.\n탄젠트 공식을 적용한다: $\\tan\\theta=\\left|\\frac{-9/x-(-25/x)}{1+(-9/x)(-25/x)}\\right|$.\n분자는 $\\frac{16}{x}$, 분모는 $1+\\frac{225}{x^2}=\\frac{x^2+225}{x^2}$이다.\n따라서 $\\tan\\theta=\\frac{16/x}{(x^2+225)/x^2}=\\frac{16x}{x^2+225}=\\frac{16}{x+225/x}$.\n산술평균과 기하평균의 관계에서 $x+\\frac{225}{x}\\ge 2\\sqrt{x\\cdot\\frac{225}{x}}=30$이다.\n등호는 $x=\\frac{225}{x}$, 즉 $x=15$일 때 성립한다.\n그러므로 분모의 최솟값은 $30$이고 $\\tan\\theta$의 최댓값은 $\\frac{16}{30}=\\frac{8}{15}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-161",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_MEASUREMENT",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
