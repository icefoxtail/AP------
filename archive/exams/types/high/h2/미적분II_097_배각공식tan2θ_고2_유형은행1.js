window.examTitle = "미적분II_097_배각공식tan2θ_고2_유형은행1";

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
    "content": "직선 $y=(3/4)x$의 제1사분면 쪽 반직선과 양의 $x$축이 이루는 각을 이등분하는 직선이 $y=mx$일 때, $m$은? [그림: 원점에서 $y=(3/4)x$, $y=mx$, 양의 $x$축의 세 반직선을 그리고 인접한 두 각의 크기가 같음을 표시]",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$"
    ],
    "answer": "①",
    "solution": "구하는 직선의 기울기를 $m=\\tan(\\alpha/2)$라 하자. (단, $\\alpha$는 $y=\\frac34x$가 양의 $x$축과 이루는 각)\n$\\tan\\alpha=\\frac34$이고 배각 공식 $\\tan\\alpha=\\frac{2m}{1-m^2}$를 적용하면 $\\frac{2m}{1-m^2}=\\frac34$.\n양변에 $4(1-m^2)$을 곱하면 $8m=3(1-m^2)$, 즉 $3m^2+8m-3=0$.\n인수분해하면 $(3m-1)(m+3)=0$이므로 $m=\\frac13$ 또는 $m=-3$.\n제1사분면 쪽 각의 이등분선은 $0<m<1$이므로 $m=-3$은 버린다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
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
    "content": "두 직선 $y=x/2+3$, $y=x-2$가 이루는 예각을 $\\theta$라 할 때, $\\tan2\\theta$는?",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{3}{2}$"
    ],
    "answer": "②",
    "solution": "두 직선의 기울기가 $m_1=\\frac12$, $m_2=1$이므로 예각 $\\theta$에 대해 $\\tan\\theta=\\left|\\frac{m_2-m_1}{1+m_1m_2}\\right|$.\n대입하면 $\\tan\\theta=\\frac{1-\\frac12}{1+\\frac12}=\\frac{\\frac12}{\\frac32}=\\frac13$.\n배각 공식 $\\tan2\\theta=\\frac{2\\tan\\theta}{1-\\tan^2\\theta}$에 $\\tan\\theta=\\frac13$을 대입한다.\n$\\tan2\\theta=\\frac{2\\cdot\\frac13}{1-\\left(\\frac13\\right)^2}=\\frac{\\frac23}{1-\\frac19}$.\n분모를 계산하면 $1-\\frac19=\\frac89$이므로 $\\tan2\\theta=\\frac{\\frac23}{\\frac89}=\\frac23\\cdot\\frac98=\\frac34$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "원 $x^2+y^2=25$ 위의 세 점 $A(5,0),B(3,4),P$에 대해 $\\theta=\\angle APB$가 예각일 때, $\\tan2\\theta$는? [그림: 원점 중심의 원에 $A,B$를 표시하고 큰 호 $AB$ 위에 $P$를 잡아 $PA,PB,OA,OB$를 긋는다]",
    "choices": [
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$",
      "$2$"
    ],
    "answer": "③",
    "solution": "$\\theta=\\angle APB$는 원주각이므로 중심각 $\\angle AOB$와의 관계를 원주각과 중심각의 성질로 정리한다.\n그림에서 $P$는 큰 호 $AB$ 위에 있으므로 $\\angle APB$가 마주 보는 호는 작은 호 $AB$이다.\n따라서 원주각과 중심각의 성질에 의해 $2\\theta=\\angle AOB$이다.\n$A(5,0)$이므로 $OA$는 양의 $x$축과 일치하고, $B(3,4)$에 대해 $OB$의 기울기는 $\\frac{4-0}{3-0}=\\frac43$이다.\n$\\angle AOB$는 예각이고 $\\tan(\\angle AOB)=\\frac43$이므로 $\\tan2\\theta=\\frac43$.\n주의: $P$를 작은 호 위에 잡으면 $\\angle APB$가 둔각이 되어 예각 조건과 달라지므로, 큰 호 위의 $P$를 택한 것이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-159",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_DOUBLE_ANGLE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
