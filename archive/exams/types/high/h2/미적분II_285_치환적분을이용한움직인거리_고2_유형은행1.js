window.examTitle = "미적분II_285_치환적분을이용한움직인거리_고2_유형은행1";

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
    "content": "매개변수 $t$로 나타내어진 곡선\n$$x = \\frac{4}{3}t^3, \\quad y = 3t^2$$\n에 대하여 $t=0$에서 $t=2$까지의 곡선의 길이는?",
    "choices": [
      "$\\frac{35}{3}$",
      "$\\frac{41}{3}$",
      "$\\frac{49}{3}$",
      "$\\frac{55}{3}$",
      "$\\frac{61}{3}$"
    ],
    "answer": "③",
    "solution": "매개변수 곡선의 길이 공식 적용: $L=\\int_a^b\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$\n$x=\\frac{4}{3}t^3$을 $t$에 대하여 미분: $\\frac{dx}{dt}=4t^2$\n$y=3t^2$을 $t$에 대하여 미분: $\\frac{dy}{dt}=6t$\n제곱의 합 계산: $\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2=(4t^2)^2+(6t)^2=16t^4+36t^2=4t^2(4t^2+9)$\n$0\\le t\\le 2$에서 $t\\ge 0$이므로 근호 정리: $\\sqrt{4t^2(4t^2+9)}=2t\\sqrt{4t^2+9}$\n곡선의 길이 적분식 세우기: $L=\\int_0^2 2t\\sqrt{4t^2+9}\\,dt$\n치환적분법 적용: $u=4t^2+9$로 놓으면 $du=8t\\,dt$, 즉 $2t\\,dt=\\frac{1}{4}du$\n적분구간 변경: $t=0$일 때 $u=9$, $t=2$일 때 $u=4\\cdot 2^2+9=25$\n치환하여 계산: $L=\\frac{1}{4}\\int_9^{25}u^{\\frac{1}{2}}du=\\frac{1}{4}\\left[\\frac{2}{3}u^{\\frac{3}{2}}\\right]_9^{25}=\\frac{1}{6}\\left(25^{\\frac{3}{2}}-9^{\\frac{3}{2}}\\right)$\n거듭제곱 계산: $25^{\\frac{3}{2}}=5^3=125$, $9^{\\frac{3}{2}}=3^3=27$\n최종 계산: $L=\\frac{1}{6}(125-27)=\\frac{98}{6}=\\frac{49}{3}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm{P}(x, y)$의 시각 $t\\left(0 \\le t \\le \\frac{\\pi}{2}\\right)$에서의 위치가\n$$x = 4\\cos^3 t, \\quad y = 4\\sin^3 t$$\n일 때, 점 $\\mathrm{P}$의 속력이 최대가 될 때까지 점 $\\mathrm{P}$가 실제로 움직인 거리는?",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 속도 성분 구하기: $\\frac{dx}{dt}=4\\cdot 3\\cos^2 t\\cdot(-\\sin t)=-12\\cos^2 t\\sin t$\n$\\frac{dy}{dt}=4\\cdot 3\\sin^2 t\\cdot\\cos t=12\\sin^2 t\\cos t$\n속력 공식 적용: $v(t)=\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}=\\sqrt{144\\cos^4 t\\sin^2 t+144\\sin^4 t\\cos^2 t}$\n공통인수 묶기: 근호 안 $=144\\sin^2 t\\cos^2 t(\\cos^2 t+\\sin^2 t)$\n$\\sin^2 t+\\cos^2 t=1$ 적용: $=144\\sin^2 t\\cos^2 t$\n배각공식 $\\sin 2t=2\\sin t\\cos t$ 적용: $v(t)=12|\\sin t\\cos t|=6|\\sin 2t|$\n$0\\le t\\le\\frac{\\pi}{2}$에서 $0\\le 2t\\le\\pi$이므로 $\\sin 2t\\ge 0$: $v(t)=6\\sin 2t$\n속력이 최대가 되는 시각: $\\sin 2t=1$, 즉 $2t=\\frac{\\pi}{2}$에서 $t=\\frac{\\pi}{4}$\n움직인 거리 식: $s=\\int_0^{\\frac{\\pi}{4}}6\\sin 2t\\,dt$\n적분 계산: $s=\\left[-3\\cos 2t\\right]_0^{\\frac{\\pi}{4}}=-3\\cos\\frac{\\pi}{2}-(-3\\cos 0)=0+3=3$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_TRIGONOMETRIC_EXTREMUM"
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
    "content": "매개변수 $t$로 나타낸 곡선\n$$x = k(3\\cos t + \\cos 3t), \\quad y = k(3\\sin t + \\sin 3t)$$\n에 대하여 $t=0$에서 $t=\\pi$까지의 곡선의 길이가 $20$일 때, $t=0$에서 $t=\\frac{5}{2}\\pi$까지의 곡선의 길이는? (단, $k$는 양의 상수)",
    "choices": [
      "$50$",
      "$55$",
      "$60$",
      "$65$",
      "$70$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 속도 성분 구하기: $\\frac{dx}{dt}=k(-3\\sin t-3\\sin 3t)=-3k(\\sin t+\\sin 3t)$\n$\\frac{dy}{dt}=k(3\\cos t+3\\cos 3t)=3k(\\cos t+\\cos 3t)$\n제곱의 합 계산: $\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2=9k^2\\left[(\\sin t+\\sin 3t)^2+(\\cos t+\\cos 3t)^2\\right]$\n전개: $=9k^2\\left[(\\sin^2 t+\\cos^2 t)+(\\sin^2 3t+\\cos^2 3t)+2(\\sin t\\sin 3t+\\cos t\\cos 3t)\\right]$\n삼각함수의 성질 적용: $=9k^2\\left[2+2\\cos(3t-t)\\right]=18k^2(1+\\cos 2t)$\n반각공식 $1+\\cos 2t=2\\cos^2 t$ 적용: $=36k^2\\cos^2 t$\n속력 정리 ($k>0$): $\\sqrt{36k^2\\cos^2 t}=6k|\\cos t|$\n$0$에서 $\\pi$까지의 길이($\\cos t$의 부호로 구간 분할): $\\int_0^{\\pi}6k|\\cos t|dt=\\int_0^{\\frac{\\pi}{2}}6k\\cos t\\,dt-\\int_{\\frac{\\pi}{2}}^{\\pi}6k\\cos t\\,dt=6k+6k=12k$\n조건 $12k=20$에서 $k=\\frac{5}{3}$\n$|\\cos t|$는 주기 $\\pi$, $\\frac{\\pi}{2}$마다 적분값이 $6k$이므로 $\\left[0,\\frac{5}{2}\\pi\\right]$는 그런 구간 $5$개: $L=5\\cdot 6k=30k$\n$k=\\frac{5}{3}$ 대입: $L=30\\cdot\\frac{5}{3}=50$\n주의: 절댓값을 풀지 않고 적분하면 $\\int_0^{\\frac{5}{2}\\pi}6k\\cos t\\,dt=6k$가 되어 오답이 된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
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
