window.examTitle = "미적분II_201_최대최소의활용길이_고2_유형은행1";

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
    "content": "수직선 $x=t$가 곡선 $y=2e^x$와 직선 $y=2x-1$을 각각 P, Q에서 만날 때, $\\overline{PQ}$의 최솟값은? [그림: 두 그래프를 그리고 수직선 $x=t$의 교점을 P$(t,2e^t)$, Q$(t,2t-1)$로 표시한다.]",
    "choices": [
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "두 점 $P$, $Q$의 $x$좌표가 $t$로 같으므로 $\\overline{PQ}$는 $y$좌표 차의 절댓값이다.\n$\\overline{PQ}=|2e^t-(2t-1)|=|2e^t-2t+1|$이다.\n$g(t)=2e^t-2t+1$로 놓으면 지수함수의 미분법과 다항함수의 미분법으로 $g'(t)=2e^t-2=2(e^t-1)$이다.\n$t<0$이면 $e^t<1$이므로 $g'(t)<0$이고, $t>0$이면 $e^t>1$이므로 $g'(t)>0$이다.\n따라서 $g$는 $t=0$에서 최솟값 $g(0)=2e^0-2\\cdot0+1=3$을 갖는다.\n$g(t)\\ge3>0$이므로 $\\overline{PQ}=g(t)$이고 최솟값은 $3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [],
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
    "content": "A에서 도로에 내린 수선의 발을 P라 하자. $\\overline{AP}=45$ m, 도로 위의 B까지 $\\overline{PB}=70$ m이다. A에서 선분 PB 위의 Q까지 초속 3 m로 직선으로 이동하고, Q에서 B까지 도로를 따라 초속 6 m로 이동한다. 총 시간이 최소일 때 $\\overline{PQ}$는? [그림: P$(0,0)$, A$(0,45)$, B$(70,0)$, Q$(t,0)$를 표시하고 AP, AQ, PB를 잇는다.]",
    "choices": [
      "$5\\sqrt3$ m",
      "$10\\sqrt3$ m",
      "$15\\sqrt3$ m",
      "$20\\sqrt3$ m",
      "$25\\sqrt3$ m"
    ],
    "answer": "③",
    "solution": "$\\overline{PQ}=t$로 놓으면 Q가 P와 B 사이에 있으므로 $0\\le t\\le70$이고 $\\overline{QB}=70-t$이다.\n피타고라스 정리로 $\\overline{AQ}=\\sqrt{45^2+t^2}=\\sqrt{2025+t^2}$이다.\n각 구간을 속력으로 나눈 시간의 합은 $T(t)=\\frac{\\sqrt{2025+t^2}}{3}+\\frac{70-t}{6}$이다.\n합성함수의 미분법으로 $T'(t)=\\frac{t}{3\\sqrt{2025+t^2}}-\\frac16$이다.\n$T'(t)=0$이면 $\\frac{t}{3\\sqrt{2025+t^2}}=\\frac16$에서 $2t=\\sqrt{2025+t^2}$이다.\n양변을 제곱하면 $4t^2=2025+t^2$이므로 $3t^2=2025$, $t^2=675$이다.\n$t\\ge0$이므로 $t=15\\sqrt3$이고, 이 값은 $0\\le t\\le70$에 들어간다.\n$T'(t)$의 부호는 $2t-\\sqrt{2025+t^2}$의 부호와 같고, 이 식은 증가하며 $t=15\\sqrt3$을 지나며 음에서 양으로 바뀐다.\n따라서 총 시간은 $t=15\\sqrt3$에서 최소이며 $\\overline{PQ}=15\\sqrt3$ m이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "중심 A$(3,0)$, 반지름 $3$인 원에서 원점 O를 떠나 양의 $x$축과 각 $\\theta$를 이루는 반직선이 원과 다시 만나는 점을 Q라 한다. 선분 OQ 위에 $\\overline{PQ}=2$인 P를 잡는다. $0<\\theta<\\arccos(1/3)$에서 P의 $y$좌표가 최대일 때 $\\cos\\theta$는? [그림: $(x-3)^2+y^2=9$와 반직선 $(r\\cos\\theta,r\\sin\\theta)$를 그린다. Q에 $r=6\\cos\\theta$, P에 $r=6\\cos\\theta-2$를 표시한다.]",
    "choices": [
      "$(1+\\sqrt{61})/12$",
      "$(1+\\sqrt{73})/12$",
      "$(1+\\sqrt{85})/12$",
      "$(1+\\sqrt{97})/12$",
      "$(1+\\sqrt{109})/12$"
    ],
    "answer": "②",
    "solution": "반직선 위의 점을 $(r\\cos\\theta,r\\sin\\theta)$로 놓고 원 $(x-3)^2+y^2=9$에 대입한다.\n$(r\\cos\\theta-3)^2+(r\\sin\\theta)^2=9$에서 $r^2-6r\\cos\\theta=0$이다.\n$r=0$은 점 O이고, 다시 만나는 점 Q에서는 $r>0$이므로 $\\overline{OQ}=r=6\\cos\\theta$이다.\n$\\overline{PQ}=2$이고 P가 OQ 위에 있으므로 $\\overline{OP}=6\\cos\\theta-2$이다.\n따라서 P의 $y$좌표는 $h(\\theta)=(6\\cos\\theta-2)\\sin\\theta$이다.\n곱의 미분법과 합성함수의 미분법으로 $h'(\\theta)=-6\\sin^2\\theta+(6\\cos\\theta-2)\\cos\\theta$이다.\n$\\sin^2\\theta=1-\\cos^2\\theta$를 대입하고 $c=\\cos\\theta$로 놓으면 $h'=-6(1-c^2)+(6c-2)c=12c^2-2c-6$이다.\n$h'=0$에서 $6c^2-c-3=0$이고 근의 공식으로 $c=\\frac{1\\pm\\sqrt{73}}{12}$이다.\n$0<\\theta<\\arccos\\frac13$에서 $\\frac13<c<1$이므로 이 범위에 있는 근은 $c=\\frac{1+\\sqrt{73}}{12}$뿐이다.\n$h'$는 $c=1$에서 $4>0$, $c=\\frac13$에서 $-\\frac{16}{3}<0$이므로 $c=\\frac{1+\\sqrt{73}}{12}$을 지나며 양에서 음으로 바뀐다.\n경계에서는 $h=0$이고 내부에서 $h>0$이므로 이 점에서 $h$가 최대이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
