window.examTitle = "미적분II_093_삼각함수의덧셈정리2_고2_유형은행1";

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
    "content": "제1사분면의 각 $a$와 제4사분면의 각 $b$가 $\\sin a=5/13$, $\\cos b=3/5$를 만족할 때, $\\cos(a+b)$는?",
    "choices": [
      "$\\frac{44}{65}$",
      "$\\frac{47}{65}$",
      "$\\frac{10}{13}$",
      "$\\frac{53}{65}$",
      "$\\frac{56}{65}$"
    ],
    "answer": "⑤",
    "solution": "제1사분면에서 $\\sin a=5/13$이므로 $\\cos a=\\sqrt{1-(5/13)^2}=12/13$이다. (삼각함수 사이의 관계)\n제4사분면에서 $\\cos b=3/5$이므로 $\\sin b=-\\sqrt{1-(3/5)^2}=-4/5$이다.\n삼각함수의 덧셈정리로 $\\cos(a+b)=\\cos a\\cos b-\\sin a\\sin b$이다.\n대입하면 $\\cos(a+b)=\\frac{12}{13}\\cdot\\frac35-\\frac5{13}\\cdot\\left(-\\frac45\\right)=\\frac{36}{65}+\\frac{20}{65}=\\frac{56}{65}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "제1사분면의 각 $a$와 제2사분면의 각 $b$가 $\\cos a=5/13$, $\\tan b=-4/3$을 만족할 때, $\\sin(a+b)$는?",
    "choices": [
      "$-\\frac{16}{65}$",
      "$-\\frac{12}{65}$",
      "$-\\frac{8}{65}$",
      "$-\\frac{4}{65}$",
      "$0$"
    ],
    "answer": "①",
    "solution": "제1사분면에서 $\\cos a=5/13$이므로 $\\sin a=12/13$이다.\n제2사분면에서 $\\tan b=-4/3$이고 $\\sin b>0,\\cos b<0$이므로 $\\sin b=4/5,\\cos b=-3/5$이다. (삼각함수 사이의 관계)\n삼각함수의 덧셈정리로 $\\sin(a+b)=\\sin a\\cos b+\\cos a\\sin b$이다.\n대입하면 $\\sin(a+b)=\\frac{12}{13}\\cdot\\left(-\\frac35\\right)+\\frac5{13}\\cdot\\frac45=\\frac{-36+20}{65}=-\\frac{16}{65}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIG_RATIO"
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
    "content": "제2사분면의 각 $a$와 제4사분면의 각 $b$에 대하여 $\\sin a=4/5$, $\\sin b=-5/13$이다. $\\sin(a+b)+\\cos(a-b)$는?",
    "choices": [
      "$\\frac{4}{65}$",
      "$\\frac{7}{65}$",
      "$\\frac{2}{13}$",
      "$\\frac{1}{5}$",
      "$\\frac{16}{65}$"
    ],
    "answer": "②",
    "solution": "제2사분면에서 $\\sin a=4/5$이므로 $\\cos a=-3/5$이다.\n제4사분면에서 $\\sin b=-5/13$이므로 $\\cos b=12/13$이다.\n덧셈정리로 $\\sin(a+b)=\\sin a\\cos b+\\cos a\\sin b$이므로 $\\sin(a+b)=\\frac45\\cdot\\frac{12}{13}+\\left(-\\frac35\\right)\\left(-\\frac5{13}\\right)=\\frac{48+15}{65}=\\frac{63}{65}$이다.\n또 $\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b$이므로 $\\cos(a-b)=\\left(-\\frac35\\right)\\frac{12}{13}+\\frac45\\cdot\\left(-\\frac5{13}\\right)=\\frac{-36-20}{65}=-\\frac{56}{65}$이다.\n두 값을 더하면 $\\frac{63}{65}-\\frac{56}{65}=\\frac7{65}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$0<a<b<2\\pi$에서 $\\cos a=\\cos b=5/13$일 때, $\\sin(b-a)$는?",
    "choices": [
      "$-\\frac{132}{169}$",
      "$-\\frac{120}{169}$",
      "$-\\frac{108}{169}$",
      "$-\\frac{96}{169}$",
      "$-\\frac{84}{169}$"
    ],
    "answer": "②",
    "solution": "$\\cos a=\\cos b=5/13$이고 $0<a<b<2\\pi$이므로 $a$는 제1사분면, $b$는 제4사분면의 각이다.\n따라서 $\\sin a=12/13$, $\\sin b=-12/13$이다.\n덧셈정리로 $\\sin(b-a)=\\sin b\\cos a-\\cos b\\sin a$이다.\n대입하면 $\\sin(b-a)=\\left(-\\frac{12}{13}\\right)\\frac5{13}-\\frac5{13}\\cdot\\frac{12}{13}=\\frac{-60-60}{169}=-\\frac{120}{169}$이다.\n주의: $a,b$의 순서를 바꾸면 부호가 달라지므로 $a<b$ 조건으로 $a$가 예각임을 먼저 정한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_SYMMETRIC_RAY",
      "CC_QUADRANT_CONDITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$\\sin a+\\cos b=1/2$, $\\cos a+\\sin b=3/2$일 때, $\\sin(a+b)$는?",
    "choices": [
      "$-\\frac{3}{4}$",
      "$-\\frac{1}{2}$",
      "$-\\frac{1}{4}$",
      "$0$",
      "$\\frac{1}{4}$"
    ],
    "answer": "⑤",
    "solution": "주어진 두 식을 각각 제곱하면 $\\sin^2 a+2\\sin a\\cos b+\\cos^2 b=1/4$이고 $\\cos^2 a+2\\cos a\\sin b+\\sin^2 b=9/4$이다.\n두 식을 변끼리 더하면 $(\\sin^2 a+\\cos^2 a)+(\\cos^2 b+\\sin^2 b)+2(\\sin a\\cos b+\\cos a\\sin b)=\\frac14+\\frac94=\\frac52$이다.\n$\\sin^2 a+\\cos^2 a=1$, $\\cos^2 b+\\sin^2 b=1$이고 덧셈정리로 $\\sin a\\cos b+\\cos a\\sin b=\\sin(a+b)$이다.\n따라서 $2+2\\sin(a+b)=\\frac52$에서 $2\\sin(a+b)=\\frac12$, 즉 $\\sin(a+b)=\\frac14$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "$\\sin a+\\sin b=1/2$, $\\cos a+\\cos b=1$일 때, $\\cos(a-b)$는?",
    "choices": [
      "$-\\frac{3}{8}$",
      "$-\\frac{1}{4}$",
      "$-\\frac{1}{8}$",
      "$0$",
      "$\\frac{1}{8}$"
    ],
    "answer": "①",
    "solution": "두 식을 각각 제곱하면 $\\sin^2 a+2\\sin a\\sin b+\\sin^2 b=1/4$이고 $\\cos^2 a+2\\cos a\\cos b+\\cos^2 b=1$이다.\n변끼리 더하면 $(\\sin^2 a+\\cos^2 a)+(\\sin^2 b+\\cos^2 b)+2(\\sin a\\sin b+\\cos a\\cos b)=\\frac14+1=\\frac54$이다.\n$\\sin^2 a+\\cos^2 a=1$, $\\sin^2 b+\\cos^2 b=1$이고 덧셈정리로 $\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b$이다.\n따라서 $2+2\\cos(a-b)=\\frac54$에서 $2\\cos(a-b)=-\\frac34$, 즉 $\\cos(a-b)=-\\frac38$이다.\n따라서 정답은 ①이다.",
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
    "id": 7,
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
    "content": "예각삼각형 $ABC$에서 $\\sin A=3/5$, $\\cos B=5/13$일 때, $\\sin C$는?",
    "choices": [
      "$\\frac{12}{13}$",
      "$\\frac{61}{65}$",
      "$\\frac{62}{65}$",
      "$\\frac{63}{65}$",
      "$\\frac{64}{65}$"
    ],
    "answer": "④",
    "solution": "예각삼각형이므로 $A,B$는 모두 예각이고 $\\cos A>0$, $\\sin B>0$이다.\n$\\sin A=3/5$에서 $\\cos A=4/5$이고, $\\cos B=5/13$에서 $\\sin B=12/13$이다.\n$C=\\pi-(A+B)$이므로 $\\sin C=\\sin(A+B)$이다. (삼각함수의 보각 성질)\n덧셈정리로 $\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$이다.\n대입하면 $\\sin C=\\frac35\\cdot\\frac5{13}+\\frac45\\cdot\\frac{12}{13}=\\frac{15+48}{65}=\\frac{63}{65}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "예각삼각형 $ABC$에서 $\\sin B=\\sqrt3/2$, $\\cos C=4/5$이다. $\\sin A=(p\\sqrt3+q)/10$을 만족하는 유리수 $p,q$의 합은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "②",
    "solution": "예각삼각형이므로 $B,C$는 예각이고 $\\cos B>0$, $\\sin C>0$이다.\n$\\sin B=\\frac{\\sqrt3}{2}$에서 $\\cos B=\\frac12$이고, $\\cos C=\\frac45$에서 $\\sin C=\\frac35$이다.\n$A=\\pi-(B+C)$이므로 $\\sin A=\\sin(B+C)$이다. (삼각함수의 보각 성질)\n덧셈정리로 $\\sin(B+C)=\\sin B\\cos C+\\cos B\\sin C$이다.\n대입하면 $\\sin A=\\frac{\\sqrt3}{2}\\cdot\\frac45+\\frac12\\cdot\\frac35=\\frac{4\\sqrt3+3}{10}$이다.\n따라서 $p=4$, $q=3$이고 $p+q=7$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "$0<b<a<\\pi$일 때, $P(\\cos a,\\sin a),Q(\\cos b,\\sin b)$ 사이의 거리가 $\\sqrt3$이면 $a-b$는?",
    "choices": [
      "$\\pi/6$",
      "$\\pi/4$",
      "$\\pi/3$",
      "$\\pi/2$",
      "$2\\pi/3$"
    ],
    "answer": "⑤",
    "solution": "$P,Q$ 사이의 거리의 제곱은 $(\\cos a-\\cos b)^2+(\\sin a-\\sin b)^2$이다.\n전개하면 $\\cos^2 a-2\\cos a\\cos b+\\cos^2 b+\\sin^2 a-2\\sin a\\sin b+\\sin^2 b$이다.\n$\\sin^2\\theta+\\cos^2\\theta=1$을 쓰면 $2-2(\\cos a\\cos b+\\sin a\\sin b)$이다.\n덧셈정리로 $\\cos a\\cos b+\\sin a\\sin b=\\cos(a-b)$이므로 거리의 제곱은 $2-2\\cos(a-b)$이다.\n거리가 $\\sqrt3$이므로 $2-2\\cos(a-b)=3$에서 $\\cos(a-b)=-\\frac12$이다.\n$0<b<a<\\pi$이므로 $0<a-b<\\pi$이고, 이 범위에서 $\\cos\\theta=-\\frac12$인 $\\theta$는 $\\frac{2\\pi}{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_UNIT_CIRCLE",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 10,
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
    "content": "제4사분면의 각 $a$에 대해 $\\tan a=-3/4$이다. $0\\le x<\\pi/2$에서 $\\cos x\\le \\sin(x+a)\\le 3\\cos x$일 때, $\\tan x$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$\\frac{9}{2}$",
      "$5$",
      "$\\frac{11}{2}$",
      "$6$",
      "$\\frac{13}{2}$"
    ],
    "answer": "⑤",
    "solution": "$a$는 제4사분면의 각이고 $\\tan a=-\\frac34$이므로 $\\sin a=-\\frac35$, $\\cos a=\\frac45$이다. (삼각함수 사이의 관계)\n$0\\le x<\\frac{\\pi}{2}$에서 $\\cos x>0$이다.\n덧셈정리로 $\\sin(x+a)=\\sin x\\cos a+\\cos x\\sin a=\\frac45\\sin x-\\frac35\\cos x$이다.\n이를 부등식에 대입하면 $\\cos x\\le \\frac45\\sin x-\\frac35\\cos x\\le 3\\cos x$이다.\n각 변을 양수 $\\cos x$로 나누면 $1\\le \\frac45\\tan x-\\frac35\\le 3$이다.\n각 변에 $\\frac54$를 곱하면 $\\frac54\\le \\tan x-\\frac34\\le \\frac{15}{4}$이다.\n각 변에 $\\frac34$를 더하면 $2\\le \\tan x\\le \\frac92$이다.\n따라서 최솟값은 $2$, 최댓값은 $\\frac92$이고 그 합은 $2+\\frac92=\\frac{13}{2}$이다.\n주의: $\\cos x>0$이므로 부등식의 방향이 바뀌지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_INEQUALITY",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "단위원이 $y=x/3$의 제1사분면 부분 및 $y=-3x$의 제2사분면 부분과 각각 $P,Q$에서 만난다. 두 동경 $OP,OQ$의 각이 $a,b$일 때, $\\sin(a+b)$는? [그림: 원점 중심의 단위원과 두 반직선, 교점 $P,Q$, 양의 $x$축에서 각 동경까지의 각 $a,b$ 표시]",
    "choices": [
      "$\\frac{4}{5}$",
      "$1$",
      "$\\frac{6}{5}$",
      "$\\frac{7}{5}$",
      "$\\frac{8}{5}$"
    ],
    "answer": "①",
    "solution": "단위원 위의 점 $P$는 $y=\\frac{x}{3}$와 제1사분면에서 만나므로 $P=\\left(\\frac{3}{\\sqrt{10}},\\frac{1}{\\sqrt{10}}\\right)$이다.\n점 $Q$는 $y=-3x$와 제2사분면에서 만나므로 $Q=\\left(-\\frac{1}{\\sqrt{10}},\\frac{3}{\\sqrt{10}}\\right)$이다.\n동경 $OP$가 $x$축 양의 방향과 이루는 각이 $a$이므로 $\\cos a=\\frac{3}{\\sqrt{10}}$, $\\sin a=\\frac{1}{\\sqrt{10}}$이다.\n동경 $OQ$의 각이 $b$이므로 $\\cos b=-\\frac{1}{\\sqrt{10}}$, $\\sin b=\\frac{3}{\\sqrt{10}}$이다.\n덧셈정리로 $\\sin(a+b)=\\sin a\\cos b+\\cos a\\sin b$이다.\n대입하면 $\\sin(a+b)=\\frac{1}{\\sqrt{10}}\\cdot\\left(-\\frac{1}{\\sqrt{10}}\\right)+\\frac{3}{\\sqrt{10}}\\cdot\\frac{3}{\\sqrt{10}}=\\frac{-1+9}{10}=\\frac45$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT",
      "CC_UNIT_CIRCLE"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q11-problem.svg",
    "imageAlt": "단위원의 P(제1사분면),Q(제2사분면)와 양의 x축에 대한 동경각 a,b.",
    "imageCaption": "단위원의 P(제1사분면),Q(제2사분면)와 양의 x축에 대한 동경각 a,b.",
    "imageSize": "full"
  },
  {
    "id": 12,
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
    "content": "반지름 13인 위쪽 반원 위의 제1사분면 점 $P,Q$의 $x$좌표가 각각 5, 12이다. 원점 $O$에 대해 $\\cos\\angle POQ$는? [그림: 지름을 $x$축 위에 두고 $P(5,12),Q(12,5)$와 각 점에서 $x$축에 내린 수선을 표시]",
    "choices": [
      "$\\frac{110}{169}$",
      "$\\frac{115}{169}$",
      "$\\frac{120}{169}$",
      "$\\frac{125}{169}$",
      "$\\frac{10}{13}$"
    ],
    "answer": "③",
    "solution": "반원의 중심을 원점 $O$라 하면 반지름이 $13$이므로 원의 방정식은 $x^2+y^2=169$이다.\n$P,Q$의 $x$좌표가 각각 $5,12$이고 제1사분면에 있으므로 $P=(5,12)$, $Q=(12,5)$이다.\n$OP$가 양의 $x$축과 이루는 각을 $a$, $OQ$가 이루는 각을 $b$라 하면 $\\cos a=\\frac5{13}$, $\\sin a=\\frac{12}{13}$, $\\cos b=\\frac{12}{13}$, $\\sin b=\\frac5{13}$이다.\n$\\angle POQ=|a-b|$이고 $\\cos\\angle POQ=\\cos(a-b)$이다.\n덧셈정리로 $\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b$이다.\n대입하면 $\\cos\\angle POQ=\\frac5{13}\\cdot\\frac{12}{13}+\\frac{12}{13}\\cdot\\frac5{13}=\\frac{60+60}{169}=\\frac{120}{169}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_UNIT_CIRCLE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION",
    "image": "assets/images/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q12-problem.svg",
    "imageAlt": "반지름13 위쪽 반원 P(5,12),Q(12,5)와 각각 x축에 내린 수선.",
    "imageCaption": "반지름13 위쪽 반원 P(5,12),Q(12,5)와 각각 x축에 내린 수선.",
    "imageSize": "full"
  },
  {
    "id": 13,
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
    "content": "높이가 1인 직사각형 $ABCD$를 가로로 정사각형 네 개로 나눈다. $B$에서 오른쪽으로 3만큼 떨어진 위쪽 분할점을 $G$라 한다. $a=\\angle GBC$, $b=\\angle DBC$일 때, $\\sin(a+b)$는? [그림: $B(0,0),C(4,0),D(4,1),A(0,1)$을 잇고 $x=1,2,3$으로 분할하며 $G(3,1)$과 $BG,BD$ 표시]",
    "choices": [
      "$4/\\sqrt{170}$",
      "$5/\\sqrt{170}$",
      "$6/\\sqrt{170}$",
      "$7/\\sqrt{170}$",
      "$8/\\sqrt{170}$"
    ],
    "answer": "④",
    "solution": "네 정사각형의 한 변의 길이는 $1$이므로 직사각형의 가로 길이는 $4$이다.\n$B(0,0)$, $C(4,0)$, $D(4,1)$, $A(0,1)$로 두면 $G(3,1)$이다.\n$\\angle GBC=a$이므로 $BG$의 방향으로 $\\cos a=\\frac{3}{\\sqrt{3^2+1^2}}=\\frac{3}{\\sqrt{10}}$, $\\sin a=\\frac{1}{\\sqrt{10}}$이다.\n$\\angle DBC=b$이므로 $BD$의 방향으로 $\\cos b=\\frac{4}{\\sqrt{4^2+1^2}}=\\frac{4}{\\sqrt{17}}$, $\\sin b=\\frac{1}{\\sqrt{17}}$이다.\n덧셈정리로 $\\sin(a+b)=\\sin a\\cos b+\\cos a\\sin b$이다.\n대입하면 $\\sin(a+b)=\\frac{1}{\\sqrt{10}}\\cdot\\frac{4}{\\sqrt{17}}+\\frac{3}{\\sqrt{10}}\\cdot\\frac{1}{\\sqrt{17}}$이다.\n분자를 계산하면 $\\frac{4+3}{\\sqrt{170}}=\\frac{7}{\\sqrt{170}}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
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
    "content": "삼각형 $ABC$에서 $A$를 지나 $BC$에 내린 수선의 발 $D$는 선분 $BC$ 내부에 있다. $AB=10$, $AC=\\sqrt{89}$이고 $AD$의 중점 $E$에 대해 $EC=\\sqrt{41}$이다. $a=\\angle ABD$, $b=\\angle DCE$일 때, $\\cos(a-b)$는? [그림: $D$를 사이에 둔 수평선 $BC$, 위쪽의 $A$, $AD$의 중점 $E$를 표시하고 $AB,AC,EC$를 연결]",
    "choices": [
      "$145/(25\\sqrt{41})$",
      "$155/(25\\sqrt{41})$",
      "$157/(25\\sqrt{41})$",
      "$159/(25\\sqrt{41})$",
      "$160/(25\\sqrt{41})$"
    ],
    "answer": "②",
    "solution": "$AD=h$, $BD=x$, $DC=y$라 하고, $E$가 $AD$의 중점이므로 $ED=h/2$이다.\n직각삼각형 $ABD$에서 $h^2+x^2=10^2=100$이다. (피타고라스 정리)\n직각삼각형 $ACD$에서 $h^2+y^2=(\\sqrt{89})^2=89$이다.\n직각삼각형 $ECD$에서 $(h/2)^2+y^2=(\\sqrt{41})^2=41$이다.\n위 두 식을 빼면 $(h^2+y^2)-(h^2/4+y^2)=89-41$에서 $\\frac34h^2=48$, $h^2=64$, $h=8$이다.\n$h=8$을 $h^2+y^2=89$에 대입하면 $64+y^2=89$에서 $y^2=25$, $y=5$이다.\n$h=8$을 $h^2+x^2=100$에 대입하면 $64+x^2=100$에서 $x^2=36$, $x=6$이다.\n직각삼각형 $ABD$에서 $\\sin a=\\frac{AD}{AB}=\\frac8{10}=\\frac45$, $\\cos a=\\frac{BD}{AB}=\\frac6{10}=\\frac35$이다.\n직각삼각형 $ECD$에서 $\\sin b=\\frac{ED}{EC}=\\frac4{\\sqrt{41}}$, $\\cos b=\\frac{DC}{EC}=\\frac5{\\sqrt{41}}$이다.\n삼각함수의 덧셈정리로 $\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b$이다.\n대입하면 $\\cos(a-b)=\\frac35\\cdot\\frac5{\\sqrt{41}}+\\frac45\\cdot\\frac4{\\sqrt{41}}=\\frac{15+16}{5\\sqrt{41}}=\\frac{31}{5\\sqrt{41}}$이다.\n$\\frac{31}{5\\sqrt{41}}=\\frac{155}{25\\sqrt{41}}$이므로 보기의 ②와 같다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-156",
    "problemTypeKey": "PT_CALCULUS_TRIG_ADDITION",
    "templateKey": "TPL_CALCULUS_TRIG_ADDITION_VALUE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_SHARED_HEIGHT"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE",
    "image": "assets/images/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q14-problem.svg",
    "imageAlt": "B−D−C 수평선에 A와 AD 중점 E, AB=10, AC=√89, EC=√41.",
    "imageCaption": "B−D−C 수평선에 A와 AD 중점 E, AB=10, AC=√89, EC=√41.",
    "imageSize": "full"
  }
];
