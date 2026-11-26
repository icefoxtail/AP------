window.examTitle = "미적분II_203_최대최소의활용부피_고2_유형은행1";

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
    "content": "부피가 $54\\pi\\,\\mathrm{cm}^3$인 닫힌 원기둥에서 겉넓이가 최소일 때, 밑면 반지름과 높이의 곱은?",
    "choices": [
      "9",
      "12",
      "15",
      "18",
      "21"
    ],
    "answer": "④",
    "solution": "닫힌 원기둥의 밑면 반지름을 $r>0$, 높이를 $h$라 하면 부피 조건은 $\\pi r^2h=54\\pi$이다.\n양변을 $\\pi r^2$으로 나누면 $h=\\dfrac{54}{r^2}$이다.\n겉넓이는 밑면 2개와 옆면을 더한 것이므로 $S=2\\pi r^2+2\\pi rh=2\\pi r^2+2\\pi r\\cdot\\dfrac{54}{r^2}=2\\pi r^2+\\dfrac{108\\pi}{r}$이다.\n거듭제곱의 미분 공식으로 $S'=4\\pi r-\\dfrac{108\\pi}{r^2}$이고, 통분하면 $S'=\\dfrac{4\\pi(r^3-27)}{r^2}$이다.\n$S'=0$에서 $r^3=27$, 즉 $r=3$이고 $0<r<3$이면 $S'<0$, $r>3$이면 $S'>0$이므로 $r=3$에서 $S$가 최소이다.\n이때 $h=\\dfrac{54}{3^2}=6$이므로 구하는 곱은 $rh=3\\cdot6=18$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "부피가 $108\\,\\mathrm{cm}^3$이고 밑면이 정사각형인 뚜껑 없는 상자를 만든다. 재료의 넓이가 최소일 때 밑면 한 변의 길이는? [그림: 열린 윗면을 가진 직육면체를 그리고 밑면의 두 모서리에 $x$, 세로 모서리에 $h$를 표시한다.]",
    "choices": [
      "4 cm",
      "5 cm",
      "6 cm",
      "7 cm",
      "8 cm"
    ],
    "answer": "③",
    "solution": "뚜껑이 없는 상자이므로 밑면은 정사각형 한 개, 옆면은 직사각형 네 개이다.\n밑면 한 변을 $x>0$, 높이를 $h$라 하면 부피는 $x^2h=108$이므로 $h=\\dfrac{108}{x^2}$이다.\n재료의 넓이는 밑면과 옆면을 더해 $S=x^2+4xh=x^2+4x\\cdot\\dfrac{108}{x^2}=x^2+\\dfrac{432}{x}$이다.\n거듭제곱의 미분 공식으로 $S'=2x-\\dfrac{432}{x^2}$이고, 통분하면 $S'=\\dfrac{2(x^3-216)}{x^2}$이다.\n$S'=0$에서 $x^3=216$, 즉 $x=6$이고 $0<x<6$이면 $S'<0$, $x>6$이면 $S'>0$이므로 $x=6$에서 넓이가 최소이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "반지름 $6$인 원에서 떼어 낸 부채꼴의 두 반지름을 맞붙여 원뿔의 옆면을 만든다. 원뿔의 부피가 최대일 때 밑면 반지름은? [그림: 반지름 6인 부채꼴의 중심각을 $\\theta$로 표시하고, 완성된 원뿔의 모선 6과 밑면 반지름 $r$을 표시한다.]",
    "choices": [
      "$\\sqrt6$",
      "$3$",
      "$3\\sqrt2$",
      "$2\\sqrt5$",
      "$2\\sqrt6$"
    ],
    "answer": "⑤",
    "solution": "완성된 원뿔의 모선은 부채꼴의 반지름과 같아 $6$이고, 밑면 반지름을 $r$이라 하면 $0<r<6$이다.\n부채꼴의 호의 길이는 원뿔 밑면의 둘레와 같으므로 $6\\theta=2\\pi r$이다.\n모선 $6$, 높이 $\\sqrt{36-r^2}$, 밑면 반지름 $r$인 직각삼각형에 피타고라스 정리를 쓰면 높이는 $\\sqrt{36-r^2}$이다.\n원뿔의 부피 공식 $V=\\dfrac13\\pi r^2h$에 대입하면 $V=\\dfrac{\\pi}{3}r^2\\sqrt{36-r^2}$이다.\n$g(r)=r^2\\sqrt{36-r^2}$로 놓고 곱과 합성함수의 미분법을 쓰면 $g'=2r\\sqrt{36-r^2}+r^2\\cdot\\dfrac{-r}{\\sqrt{36-r^2}}$이다.\n통분하면 $g'=\\dfrac{2r(36-r^2)-r^3}{\\sqrt{36-r^2}}=\\dfrac{72r-3r^3}{\\sqrt{36-r^2}}=\\dfrac{3r(24-r^2)}{\\sqrt{36-r^2}}$이다.\n따라서 $V'=\\dfrac{\\pi r(24-r^2)}{\\sqrt{36-r^2}}$이고 $V'=0$에서 $r^2=24$, 즉 $r=2\\sqrt6$이다.\n$0<r<2\\sqrt6$이면 $V'>0$, $2\\sqrt6<r<6$이면 $V'<0$이므로 $r=2\\sqrt6$에서 부피가 최대이다.\n$2\\sqrt6\\approx4.9<6$이므로 실제로 부채꼴을 만들 수 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_VOLUME_MODELING_POLYNOMIAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_203_최대최소의활용부피_고2_유형은행1/q3-problem.svg",
    "imageAlt": "반지름 6의 부채꼴을 말아 만든 원뿔의 대표 모양. 펼친 부채꼴은 후속 그림.",
    "imageCaption": "반지름 6의 부채꼴을 말아 만든 원뿔의 대표 모양. 펼친 부채꼴은 후속 그림.",
    "imageSize": "full"
  },
  {
    "id": 4,
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
    "content": "반지름이 $2$인 구에 외접하는 직각원뿔의 최소 부피는? [그림: 축을 포함하는 단면에 밑변 $2r$, 높이 $h$인 이등변삼각형과 그 내접원인 반지름 2의 원을 표시한다.]",
    "choices": [
      "$64\\pi/3$",
      "$24\\pi$",
      "$80\\pi/3$",
      "$28\\pi$",
      "$32\\pi$"
    ],
    "answer": "①",
    "solution": "축을 포함하는 단면은 밑변 $2r$, 높이 $h$, 등변의 길이 $\\ell$인 이등변삼각형이고 그 내접원의 반지름이 $2$이다.\n삼각형의 넓이를 밑변과 높이로 구하면 $\\dfrac12\\cdot2r\\cdot h=rh$이다.\n내접원의 반지름 $2$와 반둘레 $r+\\ell$로 구하면 넓이는 $2(r+\\ell)$이므로 $rh=2(r+\\ell)$이다.\n이를 정리하면 $\\ell=\\dfrac{r(h-2)}{2}$이다.\n피타고라스 정리 $\\ell^2=r^2+h^2$에 대입하고 양변에 $4$를 곱하면 $r^2(h-2)^2=4r^2+4h^2$이다.\n전개하면 $r^2h^2-4r^2h+4r^2=4r^2+4h^2$이고 $4r^2$을 소거하면 $r^2h^2-4r^2h=4h^2$이다.\n$r^2h(h-4)=4h^2$에서 $h>4$이므로 $r^2=\\dfrac{4h}{h-4}$이다.\n부피 $V=\\dfrac13\\pi r^2h$에 대입하면 $V=\\dfrac{4\\pi h^2}{3(h-4)}$이다.\n몫의 미분법으로 $V'=\\dfrac{4\\pi}{3}\\cdot\\dfrac{2h(h-4)-h^2}{(h-4)^2}=\\dfrac{4\\pi h(h-8)}{3(h-4)^2}$이다.\n$4<h<8$이면 $V'<0$, $h>8$이면 $V'>0$이므로 $h=8$에서 부피가 최소이다.\n$V(8)=\\dfrac{4\\pi\\cdot64}{3\\cdot4}=\\dfrac{64\\pi}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_VOLUME_MODELING_POLYNOMIAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_203_최대최소의활용부피_고2_유형은행1/q4-problem.svg",
    "imageAlt": "축 단면의 이등변삼각형과 반지름 2인 내접원을 표시한다.",
    "imageCaption": "축 단면의 이등변삼각형과 반지름 2인 내접원을 표시한다.",
    "imageSize": "full"
  },
  {
    "id": 5,
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
    "content": "$t>1$에서 곡선 $y=2\\ln x$ 위의 P$(t,2\\ln t)$에서 그은 접선의 $x$절편을 Q, P에서 $x$축에 내린 수선의 발을 R이라 한다. $\\lim_{t\\to\\infty}t^2(\\overline{PQ}/\\overline{QR}-1)$은? [그림: Q$(t-t\\ln t,0)$, R$(t,0)$, P$(t,2\\ln t)$를 이어 직각삼각형을 표시한다.]",
    "choices": [
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$"
    ],
    "answer": "③",
    "solution": "$y=2\\ln x$의 도함수는 $y'=\\dfrac2x$이므로 $x=t$에서 접선의 기울기는 $\\dfrac2t$이다.\n점 $(t,2\\ln t)$를 지나므로 접선은 $y-2\\ln t=\\dfrac2t(x-t)$이다.\n$y=0$을 대입하면 $-2\\ln t=\\dfrac2t(x-t)$, 즉 $x-t=-t\\ln t$이므로 Q의 $x$좌표는 $t-t\\ln t$이다.\n$t>1$에서 $\\ln t>0$이므로 $\\overline{QR}=t-(t-t\\ln t)=t\\ln t$이고 $\\overline{PR}=2\\ln t$이다.\n피타고라스 정리로 $\\overline{PQ}=\\sqrt{(t\\ln t)^2+(2\\ln t)^2}=\\ln t\\sqrt{t^2+4}$이다.\n따라서 $\\dfrac{\\overline{PQ}}{\\overline{QR}}=\\dfrac{\\ln t\\sqrt{t^2+4}}{t\\ln t}=\\dfrac{\\sqrt{t^2+4}}{t}=\\sqrt{1+\\dfrac{4}{t^2}}$이다.\n켤레식을 곱해 유리화하면 $t^2\\left(\\sqrt{1+\\dfrac{4}{t^2}}-1\\right)=t^2\\cdot\\dfrac{4/t^2}{\\sqrt{1+4/t^2}+1}=\\dfrac{4}{\\sqrt{1+4/t^2}+1}$이다.\n$t\\to\\infty$이면 $\\dfrac{4}{t^2}\\to0$이므로 극한값은 $\\dfrac{4}{1+1}=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_203_최대최소의활용부피_고2_유형은행1/q5-problem.svg",
    "imageAlt": "P, Q, R이 이루는 직각삼각형의 길이 비를 보여준다.",
    "imageCaption": "P, Q, R이 이루는 직각삼각형의 길이 비를 보여준다.",
    "imageSize": "full"
  },
  {
    "id": 6,
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
    "content": "$f(x)=x\\ln(x/2)$와 $g(x)=2\\ln(x/2)$의 그래프가 만나는 점에서의 공통접선은?",
    "choices": [
      "$y=x-2$",
      "$y=x-1$",
      "$y=x$",
      "$y=x+1$",
      "$y=x+2$"
    ],
    "answer": "①",
    "solution": "교점에서는 $x\\ln\\dfrac x2=2\\ln\\dfrac x2$이므로 $(x-2)\\ln\\dfrac x2=0$이다.\n$\\ln\\dfrac x2=0$이면 $x=2$이고 $x-2=0$도 $x=2$이므로 교점은 $(2,0)$ 하나뿐이다.\n곱의 미분법으로 $f'(x)=1\\cdot\\ln\\dfrac x2+x\\cdot\\dfrac1x=\\ln\\dfrac x2+1$이다.\n$x=2$에서 $f'(2)=\\ln1+1=1$이다.\n로그함수의 미분 공식으로 $g'(x)=\\dfrac2x$이므로 $g'(2)=\\dfrac22=1$이다.\n두 기울기가 같으므로 공통접선은 점 $(2,0)$을 지나고 기울기가 $1$인 직선 $y=x-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "곡선 $y=e^{3x}+2$ 위의 점과 직선 $y=3ex-1$ 사이의 최소 거리는? [그림: 두 그래프와 $x=1/3$인 곡선 위의 점에서 직선으로 내린 수선을 표시한다.]",
    "choices": [
      "$1/\\sqrt{9e^2+1}$",
      "$2/\\sqrt{9e^2+1}$",
      "$3/\\sqrt{9e^2+1}$",
      "$4/\\sqrt{9e^2+1}$",
      "$5/\\sqrt{9e^2+1}$"
    ],
    "answer": "③",
    "solution": "곡선 위의 점을 $(x,e^{3x}+2)$라 하면 직선 $3ex-y-1=0$까지의 거리는 점과 직선 사이의 거리 공식으로 $d(x)=\\dfrac{|3ex-(e^{3x}+2)-1|}{\\sqrt{(3e)^2+(-1)^2}}=\\dfrac{|e^{3x}-3ex+3|}{\\sqrt{9e^2+1}}$이다.\n분자 안의 식을 $g(x)=e^{3x}-3ex+3$이라 하면 합성함수의 미분법으로 $g'(x)=3e^{3x}-3e$이다.\n$g'(x)=0$이면 $e^{3x}=e$, 즉 $3x=1$에서 $x=\\dfrac13$이다.\n$x<\\dfrac13$이면 $g'(x)<0$, $x>\\dfrac13$이면 $g'(x)>0$이므로 $g$는 $x=\\dfrac13$에서 최소이다.\n$g\\left(\\dfrac13\\right)=e-3e\\cdot\\dfrac13+3=e-e+3=3>0$이므로 $|g(x)|$의 최솟값도 $3$이다.\n따라서 최소 거리는 $\\dfrac{3}{\\sqrt{9e^2+1}}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "원점에서 $y=2e^x$와 $y=2\\ln x$에 각각 그은 두 접선이 이루는 예각을 $\\theta$라 한다. $\\tan\\theta$는? [그림: 두 곡선과 원점을 지나며 각각 $(1,2e)$, $(e,2)$에서 접하는 직선을 표시한다.]",
    "choices": [
      "$2(e-e^{-1})/9$",
      "$2(e-e^{-1})/8$",
      "$2(e-e^{-1})/7$",
      "$2(e-e^{-1})/5$",
      "$2(e-e^{-1})/4$"
    ],
    "answer": "④",
    "solution": "$y=2e^x$의 도함수는 $y'=2e^x$이므로 $x=u$에서 접선은 $y-2e^u=2e^u(x-u)$, 즉 $y=2e^u(1+x-u)$이다.\n이 직선이 원점을 지나므로 $0=2e^u(1-u)$이고 $e^u>0$이므로 $u=1$이다.\n따라서 이 접선의 기울기는 $m_1=2e^1=2e$이다.\n$y=2\\ln x$의 도함수는 $y'=\\dfrac2x$이므로 $x=v$에서 접선은 $y-2\\ln v=\\dfrac2v(x-v)$이다.\n원점을 지나므로 $0=2\\ln v-2$, 즉 $\\ln v=1$에서 $v=e$이다.\n따라서 이 접선의 기울기는 $m_2=\\dfrac2e$이다.\n탄젠트의 차 공식 $\\tan\\theta=\\left|\\dfrac{m_1-m_2}{1+m_1m_2}\\right|$에 대입하면 $\\tan\\theta=\\dfrac{2e-\\frac2e}{1+2e\\cdot\\frac2e}$이다.\n분모는 $1+4=5$이고 분자는 $2e-\\dfrac2e=2\\left(e-\\dfrac1e\\right)$이므로 $\\tan\\theta=\\dfrac{2(e-e^{-1})}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "점 $(a,0)$에서 곡선 $y=(x-3)e^x$에 서로 다른 두 접선을 그을 수 없게 하는 정수 $a$의 개수는?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "③",
    "solution": "$f(x)=(x-3)e^x$라 하면 곱의 미분법으로 $f'(x)=e^x+(x-3)e^x=(x-2)e^x$이다.\n접점의 $x$좌표를 $t$라 하면 접선은 $y-(t-3)e^t=(t-2)e^t(x-t)$이다.\n$(a,0)$을 대입하면 $-(t-3)e^t=(t-2)e^t(a-t)$이고 $e^t>0$이므로 약분하면 $-(t-3)=(t-2)(a-t)$이다.\n$u=t-2$로 놓으면 $t=u+2$이므로 $-(u-1)=u(a-u-2)$, 즉 $-u+1=au-u^2-2u$이다.\n이를 정리하면 $u^2-(a-1)u+1=0$이다.\n서로 다른 두 접점이 생기려면 판별식 $D=(a-1)^2-4>0$이어야 한다.\n주의: 두 해가 같은 직선을 주는지도 확인해야 한다. 같은 직선이 서로 다른 두 점에서 접하면 그 사이에서 롤의 정리에 의해 $f'(c)$가 그 기울기와 같아야 한다.\n그런데 $f'(x)=(x-2)e^x$이고 $f''(x)=(x-1)e^x$이므로 $f'$는 $x=1$에서 감소에서 증가로 한 번만 바뀌어 같은 값을 세 번 가질 수 없다.\n따라서 두 접선을 그을 수 없는 경우는 $D\\le0$, 즉 $(a-1)^2\\le4$에서 $-1\\le a\\le3$이다.\n이 범위의 정수는 $-1,0,1,2,3$의 $5$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_SEPARATED_PARAMETER_CUBIC_ROOTS"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "점 $(k,0)$에서 곡선 $y=(x-4)e^x$에 서로 다른 두 접선을 그을 수 있는 실수 $k$의 범위는?",
    "choices": [
      "$k<0$ 또는 $k>4$",
      "$k<1$ 또는 $k>5$",
      "$k\\le0$ 또는 $k\\ge4$",
      "$0<k<4$",
      "$1<k<5$"
    ],
    "answer": "①",
    "solution": "$f(x)=(x-4)e^x$라 하면 곱의 미분법으로 $f'(x)=e^x+(x-4)e^x=(x-3)e^x$이다.\n접점의 $x$좌표를 $t$라 하면 접선은 $y-(t-4)e^t=(t-3)e^t(x-t)$이다.\n$(k,0)$을 대입하고 $e^t>0$으로 약분하면 $-(t-4)=(t-3)(k-t)$이다.\n$u=t-3$으로 놓으면 $t=u+3$이므로 $-(u-1)=u(k-u-3)$, 즉 $-u+1=ku-u^2-3u$이다.\n이를 정리하면 $u^2-(k-2)u+1=0$이다.\n서로 다른 두 접선이 생기려면 판별식 $D=(k-2)^2-4>0$이어야 한다.\n주의: $f'(x)=(x-3)e^x$는 $f''(x)=(x-2)e^x$의 부호가 $x=2$에서 한 번만 바뀌므로 같은 기울기를 세 번 갖지 않아, 두 해가 항상 서로 다른 두 접선을 준다.\n$(k-2)^2>4$에서 $k-2<-2$ 또는 $k-2>2$이므로 $k<0$ 또는 $k>4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_SEPARATED_PARAMETER_CUBIC_ROOTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "$x>0$에서 평균값 정리를 이용해 $\\lim_{x\\to\\infty} x[\\ln(x+3)-\\ln x]$를 구하면?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "$f(t)=\\ln t$는 닫힌구간 $[x,x+3]$에서 연속이고 열린구간 $(x,x+3)$에서 미분 가능하다.\n평균값 정리에 의해 $\\dfrac{\\ln(x+3)-\\ln x}{(x+3)-x}=f'(c)=\\dfrac1c$인 $c\\in(x,x+3)$이 존재한다.\n즉 $\\ln(x+3)-\\ln x=\\dfrac3c$이므로 $x[\\ln(x+3)-\\ln x]=\\dfrac{3x}{c}$이다.\n$x<c<x+3$에서 역수를 취하면 $\\dfrac{1}{x+3}<\\dfrac1c<\\dfrac1x$이고 $x>0$이므로 $x$를 곱하면 $\\dfrac{3x}{x+3}<\\dfrac{3x}{c}<3$이다.\n$\\lim_{x\\to\\infty}\\dfrac{3x}{x+3}=\\lim_{x\\to\\infty}\\dfrac{3}{1+\\frac3x}=3$이다.\n조임 정리에 의해 구하는 극한값은 $3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_MEAN_VALUE_THEOREM_FORMULA",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "$k>0$일 때 함수 $f(x)=2e^{kx}$의 그래프와 그 역함수의 그래프가 서로 접한다. 접점의 $x$좌표는? [그림: $y=2e^{kx}$와 $y=\\ln(x/2)/k$를 $y=x$에 대칭으로 그려 공통 접점을 표시한다.]",
    "choices": [
      "$e/2$",
      "$e$",
      "$3e/2$",
      "$2e$",
      "$5e/2$"
    ],
    "answer": "④",
    "solution": "$f(x)=2e^{kx}$는 $k>0$일 때 증가하므로 그 역함수 $f^{-1}(x)=\\dfrac1k\\ln\\dfrac x2$도 증가한다.\n공통접점을 $(a,b)$라 하면 $b=f(a)$이고 $a=f^{-1}(b)=f(b)$이다.\n$f$가 증가하므로 $a<b$이면 $f(a)<f(b)$에서 $b<a$가 되어 모순이고, $a>b$이면 $f(a)>f(b)$에서 $b>a$가 되어 모순이다.\n따라서 $a=b$이고 접점은 직선 $y=x$ 위에 있다.\n역함수의 미분법으로 $(f^{-1})'(a)=\\dfrac{1}{f'(a)}$이다.\n접점에서 두 접선이 일치하므로 $f'(a)=\\dfrac{1}{f'(a)}$이고 $f'(a)>0$이므로 $f'(a)=1$이다.\n$f'(x)=2ke^{kx}$이므로 $2ke^{ka}=1$이다.\n한편 $f(a)=a$에서 $2e^{ka}=a$이므로 $2ke^{ka}=k\\cdot a=1$, 즉 $ka=1$이다.\n이를 $2e^{ka}=a$에 대입하면 $a=2e^1=2e$이다.\n접점은 $(2e,2e)$이고 이때 $k=\\dfrac{1}{2e}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
