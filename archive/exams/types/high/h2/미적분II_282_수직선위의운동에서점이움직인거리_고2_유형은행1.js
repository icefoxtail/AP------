window.examTitle = "미적분II_282_수직선위의운동에서점이움직인거리_고2_유형은행1";

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
    "content": "그림은 원점을 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 속도 $v(t) = \\pi \\cos\\left(\\frac{\\pi}{2}t\\right)$의 그래프이다. [보기]에서 옳은 것만을 있는 대로 고른 것은? (단, $0 \\le t \\le 8$)\n\n<보기>\nㄱ. $0 < t < 7$에서 점 $\\mathrm{P}$는 원점을 $3$번 지난다.\nㄴ. 점 $\\mathrm{P}$가 $t=1$에서 $t=3$까지 움직인 거리와 $t=2$에서 $t=5$까지 움직인 거리는 같다.\nㄷ. $0 < t < 6$에서 점 $\\mathrm{P}$는 운동 방향을 $4$번 바꾼다.\nㄹ. $t=3$일 때, 점 $\\mathrm{P}$의 위치는 $2$이다.\n\n[그림: 가로축은 $t$축, 세로축은 $v(t)$축이다. $t=0$부터 $t=8$까지 함수 $v(t)=\\pi\\cos\\left(\\frac{\\pi}{2}t\\right)$의 그래프가 그려져 있다. 점 $(0, \\pi)$에서 시작하여 $(1, 0)$을 지나고 $(2, -\\pi)$에서 극솟값을 가지며, $(3, 0)$을 지나 $(4, \\pi)$에서 극댓값을 갖는다. 이어 $(5, 0)$, $(6, -\\pi)$, $(7, 0)$, $(8, \\pi)$를 순서대로 매끄럽게 잇는 코사인 곡선이다.]",
    "choices": [
      "① ㄱ",
      "② ㄱ, ㄴ",
      "③ ㄱ, ㄷ",
      "④ ㄴ, ㄹ",
      "⑤ ㄱ, ㄷ, ㄹ"
    ],
    "answer": "①",
    "solution": "속도와 위치의 관계 $x(t)=x(0)+\\int_0^t v(s)\\,ds$와 $x(0)=0$을 이용한다.\n$x(t)=\\int_0^t \\pi\\cos\\left(\\frac{\\pi}{2}s\\right)ds=\\left[2\\sin\\left(\\frac{\\pi}{2}s\\right)\\right]_0^t=2\\sin\\left(\\frac{\\pi}{2}t\\right)$\nㄱ. $x(t)=0$인 $0<t<7$의 시각은 $\\frac{\\pi}{2}t=\\pi,2\\pi,3\\pi$에서 $t=2,4,6$이므로 원점을 $3$번 지난다. (참)\nㄴ. (i) $1\\le t\\le3$에서는 $v(t)\\le0$이므로 움직인 거리는 $\\left|x(1)-x(3)\\right|=\\left|2-(-2)\\right|=4$이다.\n(ii) $2\\le t\\le5$에서는 $t=2\\to3$과 $t=3\\to5$로 나누어 거리를 구하면 $|x(2)-x(3)|+|x(3)-x(5)|=|0-(-2)|+|-2-2|=2+4=6$이다.\n두 거리가 $4$와 $6$으로 다르므로 거짓이다.\nㄷ. $0<t<6$에서 $v(t)=0$이고 부호가 바뀌는 시각은 $t=1,3,5$의 $3$번이므로 거짓이다.\nㄹ. $x(3)=2\\sin\\left(\\frac{3\\pi}{2}\\right)=-2$이므로 거짓이다.\n주의: ㄴ의 거리는 위치의 변화량이 아니라 구간별 이동 거리의 합으로 구해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_DIRECTION_CHANGE_ZERO_VELOCITY",
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "원점을 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 속도 $v(t)$가\n$$v(t) = 2\\sin\\left(t - \\frac{\\pi}{6}\\right) + 1 \\quad (0 \\le t \\le 2\\pi)$$\n일 때, [보기]에서 옳은 것만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. 점 $\\mathrm{P}$는 운동 방향을 $2$번 바꾼다.\nㄴ. 점 $\\mathrm{P}$는 $t = \\frac{4}{3}\\pi$일 때, 원점에서 가장 멀리 떨어져 있다.\nㄷ. 점 $\\mathrm{P}$가 원점에서 가장 멀리 떨어져 있을 때의 위치는 $\\frac{4}{3}\\pi + 2\\sqrt{3}$이다.\nㄹ. $t = 2\\pi$일 때, 점 $\\mathrm{P}$의 위치는 $2\\pi + \\sqrt{3}$이다.",
    "choices": [
      "① ㄱ",
      "② ㄱ, ㄴ",
      "③ ㄴ, ㄷ",
      "④ ㄷ, ㄹ",
      "⑤ ㄴ, ㄷ, ㄹ"
    ],
    "answer": "③",
    "solution": "$v(t)=0$이 되는 시각을 삼각방정식으로 구한다.\n$2\\sin\\left(t-\\frac{\\pi}{6}\\right)+1=0$에서 $\\sin\\left(t-\\frac{\\pi}{6}\\right)=-\\frac12$이다.\n$0\\le t\\le2\\pi$이면 $-\\frac{\\pi}{6}\\le t-\\frac{\\pi}{6}\\le\\frac{11\\pi}{6}$이므로 $t-\\frac{\\pi}{6}=-\\frac{\\pi}{6},\\frac{7\\pi}{6},\\frac{11\\pi}{6}$, 즉 $t=0,\\frac{4\\pi}{3},2\\pi$이다.\nㄱ. 열린구간 $(0,2\\pi)$에서 부호가 바뀌는 시각은 $t=\\frac{4\\pi}{3}$ 하나뿐이므로 운동 방향은 $1$번만 바뀐다. (거짓)\n위치를 적분으로 구하면 $x(t)=\\int_0^t\\left(2\\sin\\left(s-\\frac{\\pi}{6}\\right)+1\\right)ds=\\left[-2\\cos\\left(s-\\frac{\\pi}{6}\\right)+s\\right]_0^t$\n$=-2\\cos\\left(t-\\frac{\\pi}{6}\\right)+t+2\\cos\\left(-\\frac{\\pi}{6}\\right)=-2\\cos\\left(t-\\frac{\\pi}{6}\\right)+t+\\sqrt3$이다.\nㄴ. $0\\le t\\le\\frac{4\\pi}{3}$에서 $x(t)$는 증가하고 $\\frac{4\\pi}{3}\\le t\\le2\\pi$에서 감소한다.\n$x(0)=0$, $x(2\\pi)=2\\pi$, $x\\left(\\frac{4\\pi}{3}\\right)=\\frac{4\\pi}{3}+2\\sqrt3$이므로 구간 전체에서 $x(t)\\ge0$이고, 원점에서 가장 멀리 떨어진 시각은 $t=\\frac{4\\pi}{3}$이다. (참)\nㄷ. $x\\left(\\frac{4\\pi}{3}\\right)=-2\\cos\\left(\\frac{7\\pi}{6}\\right)+\\frac{4\\pi}{3}+\\sqrt3=-2\\left(-\\frac{\\sqrt3}{2}\\right)+\\frac{4\\pi}{3}+\\sqrt3=\\frac{4\\pi}{3}+2\\sqrt3$이다. (참)\nㄹ. $x(2\\pi)=2\\pi\\ne2\\pi+\\sqrt3$이므로 거짓이다.\n주의: $t=0,2\\pi$에서 $v(t)=0$이지만 구간 내부에서 부호가 바뀌는 것은 아니므로 방향 전환 횟수에 포함하지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_DIRECTION_CHANGE_ZERO_VELOCITY",
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "원점에서 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 속도 $v(t)$가\n$$v(t) = (t - 2)e^t$$\n일 때, 시각 $t=0$에서 $t=4$까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "① $e^2 + 3$",
      "② $e^4 - 2e^2 + 3$",
      "③ $e^4 + 2e^2 - 3$",
      "④ $e^4 + 2e^2 + 1$",
      "⑤ $e^4 + 3e^2 + 1$"
    ],
    "answer": "③",
    "solution": "$v(t)=(t-2)e^t$에서 $e^t>0$이므로 $v(t)$의 부호는 $t-2$의 부호와 같다.\n(i) $0\\le t<2$이면 $v(t)<0$이고, (ii) $2<t\\le4$이면 $v(t)>0$이다.\n부분적분법 $\\int fg'=fg-\\int f'g$에서 $f(t)=t-2$, $g'(t)=e^t$로 놓으면 $f'(t)=1$, $g(t)=e^t$이므로\n$\\int(t-2)e^t\\,dt=(t-2)e^t-\\int e^t\\,dt=(t-3)e^t+C$이다.\n$0\\le t\\le2$에서 움직인 거리는 $\\int_0^2-(t-2)e^t\\,dt=-\\left[(t-3)e^t\\right]_0^2$\n$=-\\left((2-3)e^2-(0-3)e^0\\right)=-(-e^2+3)=e^2-3$이다.\n$2\\le t\\le4$에서 움직인 거리는 $\\int_2^4(t-2)e^t\\,dt=\\left[(t-3)e^t\\right]_2^4$\n$=(4-3)e^4-(2-3)e^2=e^4+e^2$이다.\n따라서 전체 움직인 거리는 $(e^2-3)+(e^4+e^2)=e^4+2e^2-3$이다.\n주의: $\\int_0^4v(t)\\,dt$는 위치의 변화량이므로 이동 거리와 다르다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_DIRECTION_CHANGE_ZERO_VELOCITY",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "수직선 위를 움직이는 점 $\\mathrm{P}$의 시각 $t$에서의 속도 $v(t)$가\n$$v(t) = \\cos\\left(\\frac{\\pi}{2}t\\right)$$\n일 때, 출발한 후 세 번째로 운동 방향을 바꿀 때까지 점 $\\mathrm{P}$가 움직인 거리는?",
    "choices": [
      "① $\\frac{2}{\\pi}$",
      "② $\\frac{4}{\\pi}$",
      "③ $\\frac{6}{\\pi}$",
      "④ $\\frac{8}{\\pi}$",
      "⑤ $\\frac{10}{\\pi}$"
    ],
    "answer": "⑤",
    "solution": "운동 방향을 바꾸는 시각은 $v(t)=0$이고 그 좌우에서 $v(t)$의 부호가 바뀌는 시각이다.\n$\\cos\\left(\\frac{\\pi}{2}t\\right)=0$에서 $\\frac{\\pi}{2}t=\\frac{\\pi}{2}+k\\pi$, 즉 $t=1+2k$ ($k=0,1,2,\\dots$)이다.\n부호 변화를 순서대로 보면 $t=1$에서 $+\\to-$, $t=3$에서 $-\\to+$, $t=5$에서 $+\\to-$이므로 세 번째 방향 전환은 $t=5$이다.\n$v(t)$의 한 부정적분은 $\\int\\cos\\left(\\frac{\\pi}{2}t\\right)dt=\\frac{2}{\\pi}\\sin\\left(\\frac{\\pi}{2}t\\right)$이다.\n(i) $0\\le t\\le1$에서 $v(t)\\ge0$이므로 거리는 $\\left[\\frac{2}{\\pi}\\sin\\left(\\frac{\\pi}{2}t\\right)\\right]_0^1=\\frac{2}{\\pi}$이다.\n(ii) $1\\le t\\le3$에서 $v(t)\\le0$이므로 거리는 $-\\left[\\frac{2}{\\pi}\\sin\\left(\\frac{\\pi}{2}t\\right)\\right]_1^3=-\\frac{2}{\\pi}(-1-1)=\\frac{4}{\\pi}$이다.\n(iii) $3\\le t\\le5$에서 $v(t)\\ge0$이므로 거리는 $\\left[\\frac{2}{\\pi}\\sin\\left(\\frac{\\pi}{2}t\\right)\\right]_3^5=\\frac{2}{\\pi}(1-(-1))=\\frac{4}{\\pi}$이다.\n따라서 $t=0$부터 $t=5$까지 움직인 거리는 $\\frac{2}{\\pi}+\\frac{4}{\\pi}+\\frac{4}{\\pi}=\\frac{10}{\\pi}$이다.\n주의: 세 번째로 방향을 바꾸는 시각이 $t=5$이므로 $t=1,3,5$까지의 세 구간을 모두 더해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-103",
    "problemTypeKey": "PT_MOTION_BY_INTEGRAL",
    "templateKey": "TPL_VELOCITY_TO_POSITION_DISTANCE",
    "crossConceptKeys": [
      "CC_DIRECTION_CHANGE_ZERO_VELOCITY",
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
