window.examTitle = "미적분II_242_삼각함수의정적분의치환적분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} (3\\sin^2 x + 2\\sin x + 1)\\cos x \\, dx$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "1단계(치환): $\\sin x = t$로 놓는다.\n2단계(미분): $\\frac{dt}{dx} = \\cos x$이므로 $\\cos x\\,dx = dt$이다.\n3단계(구간 변경): $x = 0$일 때 $t = 0$, $x = \\frac{\\pi}{2}$일 때 $t = 1$이다.\n4단계(식 변환): 주어진 정적분은 $\\int_{0}^{1} (3t^2 + 2t + 1)\\,dt$이다.\n5단계(적분): 다항함수의 적분법에 의해 $\\left[t^3 + t^2 + t\\right]_{0}^{1}$이다.\n6단계(계산): $1^3 + 1^2 + 1 - 0 = 1 + 1 + 1 = 3$이다.\n주의: 치환하면 적분구간도 $t$의 값으로 반드시 바꾸어야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} (1 - \\cos x)\\cos^2 x \\sin x \\, dx$의 값은?",
    "choices": [
      "$\\frac{1}{12}$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "①",
    "solution": "1단계(치환): $\\cos x = t$로 놓는다.\n2단계(미분): $\\frac{dt}{dx} = -\\sin x$이므로 $\\sin x\\,dx = -dt$이다.\n3단계(구간 변경): $x = 0$일 때 $t = 1$, $x = \\frac{\\pi}{2}$일 때 $t = 0$이다.\n4단계(식 변환): $\\int_{1}^{0} (1 - t)t^2(-dt)$이다.\n5단계(구간 정리): $\\int_{b}^{a} f = -\\int_{a}^{b} f$이므로 $\\int_{0}^{1} (t^2 - t^3)\\,dt$이다.\n6단계(적분): $\\left[\\frac{1}{3}t^3 - \\frac{1}{4}t^4\\right]_{0}^{1}$이다.\n7단계(계산): $\\frac{1}{3} - \\frac{1}{4} = \\frac{4 - 3}{12} = \\frac{1}{12}$이다.\n주의: $\\sin x\\,dx = -dt$의 음의 부호와 구간의 위아래가 바뀌는 것을 함께 처리해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} \\sin 2x (1 + \\sin x) \\, dx$의 값은?",
    "choices": [
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "1단계(배각 공식): $\\sin 2x = 2\\sin x\\cos x$이므로 피적분함수는 $2\\sin x(1 + \\sin x)\\cos x$이다.\n2단계(치환): $\\sin x = t$로 놓는다.\n3단계(미분): $\\frac{dt}{dx} = \\cos x$이므로 $\\cos x\\,dx = dt$이다.\n4단계(구간 변경): $x = 0$일 때 $t = 0$, $x = \\frac{\\pi}{2}$일 때 $t = 1$이다.\n5단계(식 변환): $\\int_{0}^{1} 2t(1 + t)\\,dt = \\int_{0}^{1} (2t + 2t^2)\\,dt$이다.\n6단계(적분): $\\left[t^2 + \\frac{2}{3}t^3\\right]_{0}^{1}$이다.\n7단계(계산): $1 + \\frac{2}{3} = \\frac{5}{3}$이다.\n주의: $\\sin 2x$는 먼저 배각 공식으로 $\\sin x\\cos x$ 꼴로 바꾼 뒤 치환해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} \\cos 2x \\cos x \\, dx$의 값은?",
    "choices": [
      "$-\\frac{2}{3}$",
      "$-\\frac{1}{3}$",
      "$0$",
      "$\\frac{1}{3}$",
      "$\\frac{2}{3}$"
    ],
    "answer": "④",
    "solution": "1단계(배각 공식): $\\cos 2x = 1 - 2\\sin^2 x$로 변형하면 피적분함수는 $(1 - 2\\sin^2 x)\\cos x$이다.\n2단계(치환): $\\sin x = t$로 놓는다.\n3단계(미분): $\\frac{dt}{dx} = \\cos x$이므로 $\\cos x\\,dx = dt$이다.\n4단계(구간 변경): $x = 0$일 때 $t = 0$, $x = \\frac{\\pi}{2}$일 때 $t = 1$이다.\n5단계(식 변환): $\\int_{0}^{1} (1 - 2t^2)\\,dt$이다.\n6단계(적분): $\\left[t - \\frac{2}{3}t^3\\right]_{0}^{1}$이다.\n7단계(계산): $1 - \\frac{2}{3} = \\frac{1}{3}$이다.\n주의: $\\cos 2x = 2\\cos^2 x - 1$을 쓰면 $\\cos x$만 남아 치환이 어려우므로 $1 - 2\\sin^2 x$를 택한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{1}^{e} \\frac{a - 2\\ln x}{x} \\, dx = \\int_{0}^{\\frac{\\pi}{2}} (2 - 3\\sin^2 x)\\cos x \\, dx$가 성립할 때, 상수 $a$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "1단계(좌변 치환): $\\ln x = t$로 놓으면 $\\frac{1}{x}\\,dx = dt$이다.\n2단계(좌변 구간): $x = 1$일 때 $t = 0$, $x = e$일 때 $t = 1$이다.\n3단계(좌변 계산): $\\int_{0}^{1} (a - 2t)\\,dt = \\left[at - t^2\\right]_{0}^{1} = a - 1$이다.\n4단계(우변 치환): $\\sin x = u$로 놓으면 $\\cos x\\,dx = du$이다.\n5단계(우변 구간): $x = 0$일 때 $u = 0$, $x = \\frac{\\pi}{2}$일 때 $u = 1$이다.\n6단계(우변 계산): $\\int_{0}^{1} (2 - 3u^2)\\,du = \\left[2u - u^3\\right]_{0}^{1} = 2 - 1 = 1$이다.\n7단계(방정식): 좌변과 우변이 같으므로 $a - 1 = 1$이다.\n8단계(계산): 따라서 $a = 2$이다.\n주의: 로그 치환은 $\\frac{1}{x}dx$, 삼각 치환은 $\\cos x\\,dx$가 각각 $dt$, $du$가 됨을 구분해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\pi} \\sin^3 x \\, dx$의 값은?",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{4}{3}$"
    ],
    "answer": "⑤",
    "solution": "1단계(공식 적용): $\\sin^2 x = 1 - \\cos^2 x$이므로 $\\sin^3 x = (1 - \\cos^2 x)\\sin x$이다.\n2단계(치환): $\\cos x = t$로 놓는다.\n3단계(미분): $\\frac{dt}{dx} = -\\sin x$이므로 $\\sin x\\,dx = -dt$이다.\n4단계(구간 변경): $x = 0$일 때 $t = 1$, $x = \\pi$일 때 $t = -1$이다.\n5단계(식 변환): $\\int_{1}^{-1} (1 - t^2)(-dt) = \\int_{-1}^{1} (1 - t^2)\\,dt$이다.\n6단계(우함수 성질): $1 - t^2$은 우함수이므로 $2\\int_{0}^{1} (1 - t^2)\\,dt$이다.\n7단계(적분): $2\\left[t - \\frac{1}{3}t^3\\right]_{0}^{1}$이다.\n8단계(계산): $2\\left(1 - \\frac{1}{3}\\right) = 2 \\cdot \\frac{2}{3} = \\frac{4}{3}$이다.\n주의: 위끝 $x = \\pi$에 대응하는 $t = \\cos\\pi = -1$을 정확히 대입해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "다음 조건을 만족하는 두 상수 $a, b$에 대하여 $ab$의 값은?\n\n(가) $\\int_{0}^{\\frac{\\pi}{2}} \\sin^3 x \\, dx = a$\n(나) $\\int_{0}^{\\frac{\\pi}{2}} \\cos^3 x \\sin x \\, dx = b$",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$"
    ],
    "answer": "②",
    "solution": "1단계((가) 변형): $\\sin^2 x = 1 - \\cos^2 x$이므로 $\\sin^3 x = (1 - \\cos^2 x)\\sin x$이다.\n2단계((가) 치환): $\\cos x = t$로 놓으면 $\\sin x\\,dx = -dt$이고 $t$는 $1$에서 $0$까지 변한다.\n3단계($a$ 계산): $a = \\int_{1}^{0} (1 - t^2)(-dt) = \\int_{0}^{1} (1 - t^2)\\,dt = \\left[t - \\frac{1}{3}t^3\\right]_{0}^{1} = \\frac{2}{3}$이다.\n4단계((나) 치환): $\\cos x = u$로 놓으면 $\\sin x\\,dx = -du$이고 $u$는 $1$에서 $0$까지 변한다.\n5단계($b$ 계산): $b = \\int_{1}^{0} u^3(-du) = \\int_{0}^{1} u^3\\,du = \\left[\\frac{1}{4}u^4\\right]_{0}^{1} = \\frac{1}{4}$이다.\n6단계(곱 계산): $ab = \\frac{2}{3} \\cdot \\frac{1}{4} = \\frac{2}{12} = \\frac{1}{6}$이다.\n주의: 두 적분 모두 $\\sin x\\,dx = -dt$의 음의 부호로 구간의 위아래가 뒤집힌다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} \\sin^5 x \\, dx$의 값은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{4}{15}$",
      "$\\frac{2}{5}$",
      "$\\frac{7}{15}$",
      "$\\frac{8}{15}$"
    ],
    "answer": "⑤",
    "solution": "1단계(식 변형): $\\sin^2 x = 1 - \\cos^2 x$이므로 $\\sin^5 x = (1 - \\cos^2 x)^2\\sin x$이다.\n2단계(치환): $\\cos x = t$로 놓는다.\n3단계(미분): $\\frac{dt}{dx} = -\\sin x$이므로 $\\sin x\\,dx = -dt$이다.\n4단계(구간 변경): $x = 0$일 때 $t = 1$, $x = \\frac{\\pi}{2}$일 때 $t = 0$이다.\n5단계(식 변환): $\\int_{1}^{0} (1 - t^2)^2(-dt) = \\int_{0}^{1} (1 - t^2)^2\\,dt$이다.\n6단계(전개): $(1 - t^2)^2 = 1 - 2t^2 + t^4$이므로 $\\int_{0}^{1} (1 - 2t^2 + t^4)\\,dt$이다.\n7단계(적분): $\\left[t - \\frac{2}{3}t^3 + \\frac{1}{5}t^5\\right]_{0}^{1}$이다.\n8단계(통분): $1 - \\frac{2}{3} + \\frac{1}{5} = \\frac{15 - 10 + 3}{15} = \\frac{8}{15}$이다.\n주의: 홀수 제곱은 $\\sin x$ 하나를 남기고 나머지를 $(1 - \\cos^2 x)$의 거듭제곱으로 바꾸어야 치환된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{2}} (2\\sin x + 3\\sin^3 x) \\, dx$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "1단계(식 변형): $\\sin^3 x = (1 - \\cos^2 x)\\sin x$이므로 $2\\sin x + 3\\sin^3 x = (5 - 3\\cos^2 x)\\sin x$이다.\n2단계(치환): $\\cos x = t$로 놓는다.\n3단계(미분): $\\frac{dt}{dx} = -\\sin x$이므로 $\\sin x\\,dx = -dt$이다.\n4단계(구간 변경): $x = 0$일 때 $t = 1$, $x = \\frac{\\pi}{2}$일 때 $t = 0$이다.\n5단계(식 변환): $\\int_{1}^{0} (5 - 3t^2)(-dt) = \\int_{0}^{1} (5 - 3t^2)\\,dt$이다.\n6단계(적분): $\\left[5t - t^3\\right]_{0}^{1}$이다.\n7단계(계산): $5 - 1 = 4$이다.\n주의: $\\sin^3 x$를 변형한 뒤 $\\sin x$를 공통인수로 묶어야 치환적분이 바로 된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분 $\\int_{0}^{\\frac{\\pi}{4}} (2 - \\tan^2 x)\\sec^2 x \\, dx$의 값은?",
    "choices": [
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "1단계(치환): $\\frac{d}{dx}(\\tan x) = \\sec^2 x$이므로 $\\tan x = t$로 놓는다.\n2단계(미분): $\\frac{dt}{dx} = \\sec^2 x$이므로 $\\sec^2 x\\,dx = dt$이다.\n3단계(구간 변경): $x = 0$일 때 $t = 0$, $x = \\frac{\\pi}{4}$일 때 $t = 1$이다.\n4단계(식 변환): $\\int_{0}^{1} (2 - t^2)\\,dt$이다.\n5단계(적분): $\\left[2t - \\frac{1}{3}t^3\\right]_{0}^{1}$이다.\n6단계(계산): $2 - \\frac{1}{3} = \\frac{5}{3}$이다.\n주의: $x = \\frac{\\pi}{4}$에 대응하는 $t = \\tan\\frac{\\pi}{4} = 1$을 정확히 대입해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
