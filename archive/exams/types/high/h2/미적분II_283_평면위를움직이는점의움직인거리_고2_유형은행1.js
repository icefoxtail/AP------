window.examTitle = "미적분II_283_평면위를움직이는점의움직인거리_고2_유형은행1";

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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$ ($t \\ge 0$)에서의 위치 $(x, y)$가\n$$x = 4t\\sqrt{t}, \\quad y = \\frac{1}{2}t^2 - 9t$$\n일 때, $t=0$에서 $t=2$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "18",
      "20",
      "22",
      "24",
      "26"
    ],
    "answer": "②",
    "solution": "속도의 $x$성분 구하기(거듭제곱의 미분법): $\\frac{dx}{dt}=4\\cdot\\frac{3}{2}t^{1/2}=6\\sqrt{t}$\n속도의 $y$성분 구하기(다항함수의 미분법): $\\frac{dy}{dt}=t-9$\n속력의 제곱 정리: $(6\\sqrt{t})^2+(t-9)^2=36t+t^2-18t+81$\n동류항 정리 후 완전제곱식 인수분해: $t^2+18t+81=(t+9)^2$\n$t\\ge 0$이므로 절댓값 정리: $\\sqrt{(t+9)^2}=|t+9|=t+9$\n움직인 거리 공식(속력의 정적분): $s=\\int_0^2 (t+9)\\,dt$\n정적분 계산: $\\left[\\frac{1}{2}t^2+9t\\right]_0^2=(2+18)-0=20$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "시각 $t$ ($t \\ge 0$)에서 좌표평면 위를 움직이는 점 $\\mathrm{P}$의 $x$좌표와 $y$좌표가\n$$x = 2t^2, \\quad y = \\frac{2}{3}t^3 - 2t$$\n일 때, 점 $\\mathrm{P}$의 속력이 $20$이 될 때까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "16",
      "20",
      "24",
      "28",
      "32"
    ],
    "answer": "③",
    "solution": "속도의 성분 구하기(다항함수의 미분법): $\\frac{dx}{dt}=4t$, $\\frac{dy}{dt}=2t^2-2$\n속력의 제곱 전개: $(4t)^2+(2t^2-2)^2=16t^2+4t^4-8t^2+4$\n동류항 정리: $4t^4+8t^2+4=4(t^4+2t^2+1)$\n완전제곱식 인수분해: $4(t^2+1)^2$\n$t^2+1>0$이므로 속력: $v(t)=\\sqrt{4(t^2+1)^2}=2(t^2+1)$\n속력이 $20$이 되는 시각 구하기: $2(t^2+1)=20 \\Rightarrow t^2+1=10 \\Rightarrow t^2=9$\n$t\\ge 0$이므로 $t=3$\n움직인 거리 공식: $s=\\int_0^3 2(t^2+1)\\,dt$\n정적분 계산: $\\left[\\frac{2}{3}t^3+2t\\right]_0^3=(18+6)-0=24$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 위치가 $(x, y)$이고,\n$$x = 4\\sin t + 3\\cos t, \\quad y = 4\\cos t - 3\\sin t$$\n일 때, $t=0$에서 $t=\\pi$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "$4\\pi$",
      "$5\\pi$",
      "$6\\pi$",
      "$7\\pi$",
      "$8\\pi$"
    ],
    "answer": "②",
    "solution": "속도의 성분 구하기(삼각함수의 미분법): $\\frac{dx}{dt}=4\\cos t-3\\sin t$, $\\frac{dy}{dt}=-4\\sin t-3\\cos t$\n속력의 제곱 세우기: $(4\\cos t-3\\sin t)^2+(-4\\sin t-3\\cos t)^2$\n각 항 전개: $(16\\cos^2t-24\\sin t\\cos t+9\\sin^2t)+(16\\sin^2t+24\\sin t\\cos t+9\\cos^2t)$\n교차항 소거: $25\\cos^2t+25\\sin^2t$\n$\\sin^2t+\\cos^2t=1$ 적용: $25(\\sin^2t+\\cos^2t)=25$\n속력: $\\sqrt{25}=5$\n움직인 거리 공식: $s=\\int_0^\\pi 5\\,dt=[5t]_0^\\pi=5\\pi$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 위치가 $(x, y)$이고,\n$$x = 2(\\cos t + t\\sin t), \\quad y = 2(\\sin t - t\\cos t)$$\n일 때, $t=0$에서 $t=\\pi$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "$\\frac{1}{2}\\pi^2$",
      "$\\pi^2$",
      "$\\frac{3}{2}\\pi^2$",
      "$2\\pi^2$",
      "$\\frac{5}{2}\\pi^2$"
    ],
    "answer": "②",
    "solution": "속도의 $x$성분(곱의 미분법): $\\frac{dx}{dt}=2(-\\sin t+\\sin t+t\\cos t)=2t\\cos t$\n속도의 $y$성분(곱의 미분법): $\\frac{dy}{dt}=2(\\cos t-\\cos t+t\\sin t)=2t\\sin t$\n속력의 제곱: $(2t\\cos t)^2+(2t\\sin t)^2=4t^2\\cos^2t+4t^2\\sin^2t$\n$\\cos^2t+\\sin^2t=1$ 적용: $4t^2(\\cos^2t+\\sin^2t)=4t^2$\n$0\\le t\\le\\pi$에서 $t\\ge 0$이므로 속력: $\\sqrt{4t^2}=2t$\n움직인 거리 공식: $s=\\int_0^\\pi 2t\\,dt$\n정적분 계산: $\\left[t^2\\right]_0^\\pi=\\pi^2-0=\\pi^2$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "좌표평면 위에서 점 $\\mathrm{P}$의 시각 $t$에서의 좌표 $(x, y)$가\n$$x = 2\\cos 2t - 1, \\quad y = 2\\sin 2t + 3$$\n일 때, 시각 $t=0$에서 $t=2\\pi$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "$8\\pi$",
      "$10\\pi$",
      "$12\\pi$",
      "$14\\pi$",
      "$16\\pi$"
    ],
    "answer": "①",
    "solution": "속도의 $x$성분(합성함수의 미분법): $\\frac{dx}{dt}=2\\cdot(-\\sin 2t)\\cdot 2=-4\\sin 2t$\n속도의 $y$성분(합성함수의 미분법): $\\frac{dy}{dt}=2\\cdot(\\cos 2t)\\cdot 2=4\\cos 2t$\n주의: 상수항 $-1$, $3$은 미분하면 $0$이므로 속도에 영향을 주지 않는다.\n속력의 제곱: $(-4\\sin 2t)^2+(4\\cos 2t)^2=16\\sin^22t+16\\cos^22t$\n$\\sin^22t+\\cos^22t=1$ 적용: $16(1)=16$\n속력: $\\sqrt{16}=4$\n움직인 거리 공식: $s=\\int_0^{2\\pi}4\\,dt$\n정적분 계산: $[4t]_0^{2\\pi}=8\\pi-0=8\\pi$\n따라서 정답은 ①이다.",
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
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 위치 $(x, y)$가\n$$x = e^t - 4t, \\quad y = 8e^{t/2}$$\n일 때, $t=0$에서 $t=1$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "$e - 1$",
      "$e$",
      "$e + 1$",
      "$e + 2$",
      "$e + 3$"
    ],
    "answer": "⑤",
    "solution": "속도의 $x$성분(지수함수의 미분법): $\\frac{dx}{dt}=e^t-4$\n속도의 $y$성분(합성함수의 미분법): $\\frac{dy}{dt}=8\\cdot\\frac{1}{2}e^{t/2}=4e^{t/2}$\n속력의 제곱 전개: $(e^t-4)^2+(4e^{t/2})^2=e^{2t}-8e^t+16+16e^t$\n동류항 정리: $e^{2t}+8e^t+16$\n완전제곱식 인수분해: $(e^t)^2+2\\cdot 4e^t+4^2=(e^t+4)^2$\n$e^t+4>0$이므로 속력: $\\sqrt{(e^t+4)^2}=e^t+4$\n움직인 거리 공식: $s=\\int_0^1(e^t+4)\\,dt$\n정적분 계산: $\\left[e^t+4t\\right]_0^1=(e+4)-(1+0)=e+3$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}(x, y)$의 시각 $t$에서의 위치가\n$$x = \\ln t, \\quad y = \\frac{1}{2}\\left(t + \\frac{1}{t}\\right)$$\n이다. 점 $\\mathrm{P}$가 시각 $t=1$에서 시각 $t=3$까지 움직인 거리는? (단, $t>0$)",
    "choices": [
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$",
      "$2$"
    ],
    "answer": "③",
    "solution": "속도의 $x$성분(로그함수의 미분법): $\\frac{dx}{dt}=\\frac{1}{t}$\n속도의 $y$성분(거듭제곱의 미분법): $\\frac{dy}{dt}=\\frac{1}{2}\\left(1-\\frac{1}{t^2}\\right)$\n속력의 제곱: $\\frac{1}{t^2}+\\frac{1}{4}\\left(1-\\frac{2}{t^2}+\\frac{1}{t^4}\\right)$\n통분하여 정리: $\\frac{1}{4}\\left(\\frac{4}{t^2}+1-\\frac{2}{t^2}+\\frac{1}{t^4}\\right)=\\frac{1}{4}\\left(1+\\frac{2}{t^2}+\\frac{1}{t^4}\\right)$\n완전제곱식 인수분해: $\\frac{1}{4}\\left(1+\\frac{1}{t^2}\\right)^2$\n$t>0$이므로 $1+\\frac{1}{t^2}>0$, 따라서 속력: $\\sqrt{\\frac{1}{4}\\left(1+\\frac{1}{t^2}\\right)^2}=\\frac{1}{2}\\left(1+\\frac{1}{t^2}\\right)$\n움직인 거리 공식: $s=\\int_1^3\\frac{1}{2}\\left(1+\\frac{1}{t^2}\\right)dt$\n정적분 계산: $\\frac{1}{2}\\left[t-\\frac{1}{t}\\right]_1^3=\\frac{1}{2}\\left\\{\\left(3-\\frac{1}{3}\\right)-(1-1)\\right\\}$\n값 계산: $\\frac{1}{2}\\cdot\\frac{8}{3}=\\frac{4}{3}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "id": 8,
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
    "content": "$1 \\le t \\le 3$일 때, 매개변수 $t$로 나타내어진 곡선\n$$x = 2\\ln t, \\quad y = t + \\frac{1}{t}$$\n의 길이는?",
    "choices": [
      "$\\frac{7}{3}$",
      "$\\frac{8}{3}$",
      "$3$",
      "$\\frac{10}{3}$",
      "$\\frac{11}{3}$"
    ],
    "answer": "②",
    "solution": "매개변수 곡선의 길이 공식: $L=\\int_1^3\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$\n도함수 구하기(로그함수·거듭제곱의 미분법): $\\frac{dx}{dt}=\\frac{2}{t}$, $\\frac{dy}{dt}=1-\\frac{1}{t^2}$\n제곱의 합 전개: $\\frac{4}{t^2}+1-\\frac{2}{t^2}+\\frac{1}{t^4}=1+\\frac{2}{t^2}+\\frac{1}{t^4}$\n완전제곱식 인수분해: $\\left(1+\\frac{1}{t^2}\\right)^2$\n$1\\le t\\le 3$에서 $1+\\frac{1}{t^2}>0$이므로 피적분함수: $\\sqrt{\\left(1+\\frac{1}{t^2}\\right)^2}=1+\\frac{1}{t^2}$\n길이 정적분: $L=\\int_1^3\\left(1+\\frac{1}{t^2}\\right)dt=\\left[t-\\frac{1}{t}\\right]_1^3$\n위끝·아래끝 대입: $\\left(3-\\frac{1}{3}\\right)-(1-1)=\\frac{8}{3}$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}(x, y)$의 시각 $t$에서의 좌표가\n$$x = 2\\cos^3 t, \\quad y = 2\\sin^3 t$$\n일 때, $t=0$에서 $t=\\frac{\\pi}{2}$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "속도의 $x$성분(합성함수의 미분법): $\\frac{dx}{dt}=2\\cdot 3\\cos^2t\\cdot(-\\sin t)=-6\\cos^2t\\sin t$\n속도의 $y$성분(합성함수의 미분법): $\\frac{dy}{dt}=2\\cdot 3\\sin^2t\\cdot\\cos t=6\\sin^2t\\cos t$\n속력의 제곱 전개: $36\\cos^4t\\sin^2t+36\\sin^4t\\cos^2t$\n공통인수 $36\\sin^2t\\cos^2t$로 묶기: $36\\sin^2t\\cos^2t(\\cos^2t+\\sin^2t)$\n$\\cos^2t+\\sin^2t=1$ 적용: $36\\sin^2t\\cos^2t$\n$0\\le t\\le\\frac{\\pi}{2}$에서 $\\sin t\\ge 0$, $\\cos t\\ge 0$이므로 속력: $\\sqrt{36\\sin^2t\\cos^2t}=6\\sin t\\cos t$\n주의: 근호를 벗길 때 $|\\sin t\\cos t|$가 아니라 $\\sin t\\cos t$인 것은 이 구간에서 두 인수가 모두 음이 아니기 때문이다.\n움직인 거리 공식: $s=\\int_0^{\\pi/2}6\\sin t\\cos t\\,dt$\n치환적분($u=\\sin t$, $du=\\cos t\\,dt$): $\\left[3\\sin^2t\\right]_0^{\\pi/2}$\n정적분 계산: $3\\cdot 1^2-3\\cdot 0^2=3$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 위치 $(x, y)$가\n$$x = t - \\sin t, \\quad y = 1 - \\cos t$$\n일 때, 점 $\\mathrm{P}$가 $t=0$에서 출발하여 속력이 처음으로 $0$이 될 때까지 움직인 거리는?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "③",
    "solution": "속도의 성분 구하기(삼각함수의 미분법): $\\frac{dx}{dt}=1-\\cos t$, $\\frac{dy}{dt}=\\sin t$\n속력의 제곱 전개: $(1-\\cos t)^2+\\sin^2t=1-2\\cos t+\\cos^2t+\\sin^2t$\n$\\cos^2t+\\sin^2t=1$ 적용: $2-2\\cos t$\n반각 공식 $1-\\cos t=2\\sin^2\\frac{t}{2}$ 적용: $2\\cdot 2\\sin^2\\frac{t}{2}=4\\sin^2\\frac{t}{2}$\n속력 정리: $v(t)=\\sqrt{4\\sin^2\\frac{t}{2}}=2\\left|\\sin\\frac{t}{2}\\right|$\n$t>0$에서 처음 $v(t)=0$이 되는 시각: $\\sin\\frac{t}{2}=0$의 최소 양근이 $\\frac{t}{2}=\\pi$이므로 $t=2\\pi$\n$0\\le t\\le 2\\pi$에서 $\\sin\\frac{t}{2}\\ge 0$이므로 속력: $2\\sin\\frac{t}{2}$\n움직인 거리 공식: $s=\\int_0^{2\\pi}2\\sin\\frac{t}{2}\\,dt$\n정적분 계산: $\\left[-4\\cos\\frac{t}{2}\\right]_0^{2\\pi}=-4\\cos\\pi-(-4\\cos 0)$\n값 계산: $-4(-1)+4(1)=8$\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
