window.examTitle = "미적분II_092_삼각함수의덧셈정리1_고2_유형은행1";

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
    "content": "$a=\\sin80^\\circ\\cos10^\\circ+\\cos80^\\circ\\sin10^\\circ$, $b=\\cos85^\\circ\\cos25^\\circ+\\sin85^\\circ\\sin25^\\circ$, $c=(\\tan60^\\circ-\\tan15^\\circ)/(1+\\tan60^\\circ\\tan15^\\circ)$일 때, $a+b-c$는?",
    "choices": [
      "$0$",
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$"
    ],
    "answer": "②",
    "solution": "$a$에 사인 덧셈정리 $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$를 적용: $$a=\\sin(80^\\circ+10^\\circ)=\\sin90^\\circ=1$$\n$b$에 코사인 차의 정리 $\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$를 적용: $$b=\\cos(85^\\circ-25^\\circ)=\\cos60^\\circ=\\frac12$$\n$c$에 탄젠트 차의 정리 $\\tan(\\alpha-\\beta)=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$를 적용: $$c=\\tan(60^\\circ-15^\\circ)=\\tan45^\\circ=1$$\n세 값을 대입: $$a+b-c=1+\\frac12-1=\\frac12$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
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
    "content": "$(\\cos105^\\circ\\cos15^\\circ+\\sin105^\\circ\\sin15^\\circ)/(\\sin80^\\circ\\cos20^\\circ-\\cos80^\\circ\\sin20^\\circ)$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "④",
    "solution": "분자에 코사인 차의 정리를 적용: $$\\cos105^\\circ\\cos15^\\circ+\\sin105^\\circ\\sin15^\\circ=\\cos(105^\\circ-15^\\circ)=\\cos90^\\circ=0$$\n분모에 사인 차의 정리를 적용: $$\\sin80^\\circ\\cos20^\\circ-\\cos80^\\circ\\sin20^\\circ=\\sin(80^\\circ-20^\\circ)=\\sin60^\\circ=\\frac{\\sqrt3}{2}$$\n주의: 분모가 $\\frac{\\sqrt3}{2}\\neq0$이므로 나눗셈이 가능하다.\n나눗셈 계산: $$\\frac{0}{\\sqrt3/2}=0$$\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\cot40^\\circ+\\tan20^\\circ$와 값이 같은 것은?",
    "choices": [
      "$\\sin40^\\circ$",
      "$\\sec40^\\circ$",
      "$\\csc40^\\circ$",
      "$\\csc20^\\circ$",
      "$\\cot20^\\circ$"
    ],
    "answer": "③",
    "solution": "$\\cot40^\\circ=\\frac{\\cos40^\\circ}{\\sin40^\\circ}$로 바꾸고, 반각 공식 $\\tan\\frac{\\theta}{2}=\\frac{1-\\cos\\theta}{\\sin\\theta}$에서 $\\tan20^\\circ=\\frac{1-\\cos40^\\circ}{\\sin40^\\circ}$.\n두 식을 대입: $$\\cot40^\\circ+\\tan20^\\circ=\\frac{\\cos40^\\circ}{\\sin40^\\circ}+\\frac{1-\\cos40^\\circ}{\\sin40^\\circ}$$\n분자를 계산: $$\\frac{\\cos40^\\circ+1-\\cos40^\\circ}{\\sin40^\\circ}=\\frac{1}{\\sin40^\\circ}$$\n$\\frac{1}{\\sin\\theta}=\\csc\\theta$이므로 값은 $\\csc40^\\circ$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
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
    "content": "$at^2-3\\sqrt2t+b=0$의 두 근이 $\\sin75^\\circ,\\cos75^\\circ$일 때, $a-b$는?",
    "choices": [
      "$-\\sqrt3/2$",
      "$0$",
      "$\\sqrt3/2$",
      "$\\sqrt3$",
      "$3\\sqrt3/2$"
    ],
    "answer": "⑤",
    "solution": "근과 계수의 관계로 두 근의 합과 곱을 구한다.\n두 근의 합: $$\\sin75^\\circ+\\cos75^\\circ=\\sqrt2\\sin(75^\\circ+45^\\circ)=\\sqrt2\\sin120^\\circ=\\sqrt2\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt6}{2}$$\n근과 계수의 관계에서 합은 $\\frac{3\\sqrt2}{a}$이므로: $$a=\\frac{3\\sqrt2}{\\sqrt6/2}=\\frac{6\\sqrt2}{\\sqrt6}=\\frac{6}{\\sqrt3}=2\\sqrt3$$\n두 근의 곱: $$\\sin75^\\circ\\cos75^\\circ=\\frac12\\sin150^\\circ=\\frac12\\cdot\\frac12=\\frac14$$\n근과 계수의 관계에서 곱은 $\\frac{b}{a}$이므로: $$b=\\frac{a}{4}=\\frac{2\\sqrt3}{4}=\\frac{\\sqrt3}{2}$$\n차를 계산: $$a-b=2\\sqrt3-\\frac{\\sqrt3}{2}=\\frac{3\\sqrt3}{2}$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "삼각형 $ABC$에서 $AB=10$, $BC=4$, $\\angle ABC=75^\\circ$일 때, 넓이는?",
    "choices": [
      "$4(\\sqrt6+\\sqrt2)$",
      "$5(\\sqrt6+\\sqrt2)$",
      "$6(\\sqrt6+\\sqrt2)$",
      "$7(\\sqrt6+\\sqrt2)$",
      "$8(\\sqrt6+\\sqrt2)$"
    ],
    "answer": "②",
    "solution": "삼각형의 넓이 공식 $S=\\frac12\\cdot AB\\cdot BC\\cdot\\sin(\\angle ABC)$를 사용.\n$75^\\circ=45^\\circ+30^\\circ$로 놓고 사인 덧셈정리를 적용: $$\\sin75^\\circ=\\sin45^\\circ\\cos30^\\circ+\\cos45^\\circ\\sin30^\\circ=\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2}+\\frac{\\sqrt2}{2}\\cdot\\frac12=\\frac{\\sqrt6+\\sqrt2}{4}$$\n주어진 길이를 대입: $$S=\\frac12\\cdot10\\cdot4\\cdot\\sin75^\\circ=20\\sin75^\\circ$$\n계산: $$S=20\\cdot\\frac{\\sqrt6+\\sqrt2}{4}=5(\\sqrt6+\\sqrt2)$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA_TRIG",
      "CC_SPECIAL_ANGLES"
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
    "content": "두 예각 $u,v$가 $\\sin u=3/5$, $\\cos v=3/5$를 만족할 때, $\\sin(\\pi/6+v)-\\cos(\\pi/3+u)$는?",
    "choices": [
      "$(5\\sqrt3-1)/10$",
      "$(6\\sqrt3-1)/10$",
      "$(7\\sqrt3-1)/10$",
      "$(8\\sqrt3-1)/10$",
      "$(9\\sqrt3-1)/10$"
    ],
    "answer": "③",
    "solution": "$\\sin u=\\frac35$, $\\cos v=\\frac35$이고 $u,v$가 예각이므로 $\\cos u=\\frac45$, $\\sin v=\\frac45$.\n사인 덧셈정리 적용: $$\\sin\\left(\\frac{\\pi}{6}+v\\right)=\\sin\\frac{\\pi}{6}\\cos v+\\cos\\frac{\\pi}{6}\\sin v=\\frac12\\cdot\\frac35+\\frac{\\sqrt3}{2}\\cdot\\frac45=\\frac{3+4\\sqrt3}{10}$$\n코사인 덧셈정리 적용: $$\\cos\\left(\\frac{\\pi}{3}+u\\right)=\\cos\\frac{\\pi}{3}\\cos u-\\sin\\frac{\\pi}{3}\\sin u=\\frac12\\cdot\\frac45-\\frac{\\sqrt3}{2}\\cdot\\frac35=\\frac{4-3\\sqrt3}{10}$$\n두 값을 빼서 정리: $$\\frac{3+4\\sqrt3}{10}-\\frac{4-3\\sqrt3}{10}=\\frac{-1+7\\sqrt3}{10}=\\frac{7\\sqrt3-1}{10}$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_COMPLEMENTARY_ANGLE_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
