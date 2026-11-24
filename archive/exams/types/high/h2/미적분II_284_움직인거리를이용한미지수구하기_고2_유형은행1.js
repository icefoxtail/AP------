window.examTitle = "미적분II_284_움직인거리를이용한미지수구하기_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}(x, y)$의 시각 $t$에서의 위치가\n$$x = 2\\cos(3t),\\quad y = 2\\sin(3t) + 1$$\n로 주어질 때, $t=0$부터 $t=a$까지 점 $\\mathrm{P}$가 움직인 거리가 $3\\pi$가 되도록 하는 양수 $a$의 값은?",
    "choices": [
      "$\\frac{\\pi}{6}$",
      "$\\frac{\\pi}{4}$",
      "$\\frac{\\pi}{2}$",
      "$\\frac{3}{4}\\pi$",
      "$\\pi$"
    ],
    "answer": "③",
    "solution": "[위치 미분] $x=2\\cos 3t$, $y=2\\sin 3t+1$을 각각 $t$에 대하여 미분하면 $\\frac{dx}{dt}=-6\\sin 3t$, $\\frac{dy}{dt}=6\\cos 3t$이다.\n[속력 공식] 속력은 $v(t)=\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}=\\sqrt{36\\sin^2 3t+36\\cos^2 3t}$이다.\n[삼각함수 기본 공식] $\\sin^2 3t+\\cos^2 3t=1$이므로 $v(t)=\\sqrt{36(1)}=6$이다.\n[움직인 거리] 속력이 일정하므로 $s=\\int_0^a 6\\,dt=[6t]_0^a=6a$이다.\n[방정식] $6a=3\\pi$에서 $a=\\frac{3\\pi}{6}=\\frac{\\pi}{2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "시각 $t$에서 좌표평면 위를 움직이는 점 $\\mathrm{P}$의 $x$좌표와 $y$좌표가\n$$x = \\frac{1}{2}t^2 - t,\\quad y = \\frac{4}{3}t\\sqrt{t}$$\n일 때, 시각 $t=0$에서 $t=a$까지 점 $\\mathrm{P}$가 움직인 거리가 $12$가 되도록 하는 양수 $a$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "[위치 미분] $x=\\frac{1}{2}t^2-t$에서 $\\frac{dx}{dt}=t-1$이고, $y=\\frac{4}{3}t^{3/2}$에서 $\\frac{dy}{dt}=\\frac{4}{3}\\cdot\\frac{3}{2}t^{1/2}=2\\sqrt{t}$이다.\n[속력 공식] $v(t)=\\sqrt{(t-1)^2+(2\\sqrt{t})^2}=\\sqrt{t^2-2t+1+4t}=\\sqrt{t^2+2t+1}$이다.\n[인수분해] $t^2+2t+1=(t+1)^2$이고 $t\\ge 0$이므로 $v(t)=|t+1|=t+1$이다.\n[움직인 거리] $s=\\int_0^a (t+1)\\,dt=\\left[\\frac{1}{2}t^2+t\\right]_0^a=\\frac{1}{2}a^2+a$이다.\n[방정식] $\\frac{1}{2}a^2+a=12$에서 $a^2+2a-24=0$, 즉 $(a+6)(a-4)=0$이다.\n[해 선택] $a>0$이므로 $a=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t(t \\ge 0)$에서의 위치가 $(x, y)$이고,\n$$\\frac{dx}{dt} = \\frac{\\cos t}{t^2 + 3t + 2},\\quad \\frac{dy}{dt} = \\frac{\\sin t}{t^2 + 3t + 2}$$\n이다. 시각 $t=0$에서 $t=2$까지 점 $\\mathrm{P}$가 움직인 거리가 $\\ln a$일 때, 양수 $a$의 값은?",
    "choices": [
      "$\\frac{6}{5}$",
      "$\\frac{5}{4}$",
      "$\\frac{4}{3}$",
      "$\\frac{7}{5}$",
      "$\\frac{3}{2}$"
    ],
    "answer": "⑤",
    "solution": "[속력 공식] $v(t)=\\sqrt{\\frac{\\cos^2 t}{(t^2+3t+2)^2}+\\frac{\\sin^2 t}{(t^2+3t+2)^2}}=\\sqrt{\\frac{\\cos^2 t+\\sin^2 t}{(t^2+3t+2)^2}}$이다.\n[삼각함수 기본 공식] $\\cos^2 t+\\sin^2 t=1$이고 분모가 양수이므로 $v(t)=\\frac{1}{t^2+3t+2}$이다.\n[인수분해] $t^2+3t+2=(t+1)(t+2)$이다.\n[부분분수 분해] $\\frac{1}{(t+1)(t+2)}=\\frac{1}{t+1}-\\frac{1}{t+2}$이다.\n[정적분] $s=\\int_0^2\\left(\\frac{1}{t+1}-\\frac{1}{t+2}\\right)dt=\\left[\\ln(t+1)-\\ln(t+2)\\right]_0^2$이다.\n[로그 계산] $s=(\\ln 3-\\ln 4)-(\\ln 1-\\ln 2)=\\ln\\frac{3}{4}+\\ln 2=\\ln\\frac{3}{2}$이다.\n[비교] $\\ln a=\\ln\\frac{3}{2}$에서 $a=\\frac{3}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t(t>0)$에서의 위치 $(x, y)$가\n$$x = 2(\\sin t - t\\cos t),\\quad y = 2(\\cos t + t\\sin t)$$\n일 때, 시각 $t=k$에서의 점 $\\mathrm{P}$의 속력이 $6$이다. 시각 $t=1$에서 $t=k$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "④",
    "solution": "[곱의 미분법] $x=2(\\sin t-t\\cos t)$에서 $\\frac{dx}{dt}=2(\\cos t-\\cos t+t\\sin t)=2t\\sin t$이다.\n[곱의 미분법] $y=2(\\cos t+t\\sin t)$에서 $\\frac{dy}{dt}=2(-\\sin t+\\sin t+t\\cos t)=2t\\cos t$이다.\n[속력] $v(t)=\\sqrt{(2t\\sin t)^2+(2t\\cos t)^2}=\\sqrt{4t^2(\\sin^2 t+\\cos^2 t)}=\\sqrt{4t^2}=2t$ ($t>0$)이다.\n[조건] $v(k)=2k=6$에서 $k=3$이다.\n[거리] $s=\\int_1^3 2t\\,dt=[t^2]_1^3=9-1=8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}(x, y)$의 시각 $t$에서의 위치가\n$$x = a\\cos^3 t,\\quad y = a\\sin^3 t$$\n이다. 점 $\\mathrm{P}$가 시각 $t=0$에서 시각 $t=\\pi$까지 움직인 거리가 $18$일 때, 양수 $a$의 값은?",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "①",
    "solution": "[합성함수의 미분법] $x=a\\cos^3 t$에서 $\\frac{dx}{dt}=3a\\cos^2 t\\cdot(-\\sin t)=-3a\\cos^2 t\\sin t$이다.\n[합성함수의 미분법] $y=a\\sin^3 t$에서 $\\frac{dy}{dt}=3a\\sin^2 t\\cdot\\cos t=3a\\sin^2 t\\cos t$이다.\n[속력] $v(t)=\\sqrt{9a^2\\cos^4 t\\sin^2 t+9a^2\\sin^4 t\\cos^2 t}$이다.\n[인수분해] $v(t)=\\sqrt{9a^2\\sin^2 t\\cos^2 t(\\cos^2 t+\\sin^2 t)}=\\sqrt{9a^2\\sin^2 t\\cos^2 t}$이다.\n[정리] $a>0$이므로 $v(t)=3a|\\sin t\\cos t|=\\frac{3a}{2}|\\sin 2t|$이다.\n주의: $0\\le t\\le\\pi$에서 $\\sin t\\ge 0$이지만 $\\cos t$는 $t=\\frac{\\pi}{2}$에서 부호가 바뀌므로 구간을 나눈다.\n(i) $0\\le t\\le\\frac{\\pi}{2}$: $\\cos t\\ge 0$이므로 $s_1=\\int_0^{\\pi/2}3a\\sin t\\cos t\\,dt=\\frac{3a}{2}\\left[\\sin^2 t\\right]_0^{\\pi/2}=\\frac{3a}{2}$이다.\n(ii) $\\frac{\\pi}{2}\\le t\\le\\pi$: $\\cos t\\le 0$이므로 $s_2=\\int_{\\pi/2}^{\\pi}(-3a\\sin t\\cos t)\\,dt=-\\frac{3a}{2}\\left[\\sin^2 t\\right]_{\\pi/2}^{\\pi}=\\frac{3a}{2}$이다.\n[총거리] $s=s_1+s_2=\\frac{3a}{2}+\\frac{3a}{2}=3a$이다.\n[방정식] $3a=18$에서 $a=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
