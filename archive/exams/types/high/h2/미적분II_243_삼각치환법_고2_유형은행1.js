window.examTitle = "미적분II_243_삼각치환법_고2_유형은행1";

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
    "content": "정적분 $\\int_0^{2\\sqrt{3}} \\frac{1}{\\sqrt{16-x^2}}\\,dx$의 값을 $\\alpha$라고 할 때, $\\cos\\alpha$의 값은?",
    "choices": [
      "$0$",
      "$\\frac{1}{2}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$\\frac{\\sqrt{3}}{2}$",
      "$1$"
    ],
    "answer": "②",
    "solution": "삼각치환법: $\\sqrt{16-x^2}$ 꼴이므로 $x=4\\sin\\theta$ $\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 놓는다.\n미분: $x=4\\sin\\theta$의 양변을 $\\theta$로 미분하면 $dx=4\\cos\\theta\\,d\\theta$이다.\n구간 변환: $x=0$이면 $\\sin\\theta=0$에서 $\\theta=0$이고, $x=2\\sqrt{3}$이면 $\\sin\\theta=\\frac{2\\sqrt{3}}{4}=\\frac{\\sqrt{3}}{2}$에서 $\\theta=\\frac{\\pi}{3}$이다.\n근호 정리: $0\\le\\theta\\le\\frac{\\pi}{3}$에서 $\\cos\\theta>0$이므로 $\\sqrt{16-x^2}=\\sqrt{16\\cos^2\\theta}=4\\cos\\theta$이다.\n치환적분: $\\alpha=\\int_0^{\\frac{\\pi}{3}}\\frac{1}{4\\cos\\theta}\\cdot 4\\cos\\theta\\,d\\theta=\\int_0^{\\frac{\\pi}{3}}1\\,d\\theta$로 약분된다.\n정적분 계산: $\\alpha=[\\theta]_0^{\\frac{\\pi}{3}}=\\frac{\\pi}{3}-0=\\frac{\\pi}{3}$이다.\n삼각함수 값: $\\cos\\alpha=\\cos\\frac{\\pi}{3}=\\frac{1}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "정적분 $\\int_0^2 \\frac{4}{x^2+4}\\,dx$의 값을 $a$라 할 때, $\\cos a$의 값은?",
    "choices": [
      "$0$",
      "$\\frac{1}{2}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$\\frac{\\sqrt{3}}{2}$",
      "$1$"
    ],
    "answer": "①",
    "solution": "삼각치환법: 분모가 $x^2+2^2$ 꼴이므로 $x=2\\tan\\theta$ $\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 놓는다.\n미분: 양변을 $\\theta$로 미분하면 $dx=2\\sec^2\\theta\\,d\\theta$이다.\n구간 변환: $x=0$이면 $\\tan\\theta=0$에서 $\\theta=0$이고, $x=2$이면 $\\tan\\theta=1$에서 $\\theta=\\frac{\\pi}{4}$이다.\n분모 정리: $1+\\tan^2\\theta=\\sec^2\\theta$이므로 $x^2+4=4\\tan^2\\theta+4=4\\sec^2\\theta$이다.\n치환적분: $a=\\int_0^{\\frac{\\pi}{4}}\\frac{4}{4\\sec^2\\theta}\\cdot 2\\sec^2\\theta\\,d\\theta=\\int_0^{\\frac{\\pi}{4}}2\\,d\\theta$로 약분된다.\n정적분 계산: $a=[2\\theta]_0^{\\frac{\\pi}{4}}=2\\cdot\\frac{\\pi}{4}-0=\\frac{\\pi}{2}$이다.\n삼각함수 값: $\\cos a=\\cos\\frac{\\pi}{2}=0$이다.\n주의: $dx=2\\sec^2\\theta\\,d\\theta$의 계수 $2$를 빠뜨리면 값이 달라진다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "양수 $a$에 대하여 정적분 $\\int_0^{\\sqrt{3}a} \\frac{1}{a^2+x^2}\\,dx = \\frac{\\pi}{12}$가 성립할 때, $a$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "삼각치환법: $a>0$이고 분모가 $a^2+x^2$ 꼴이므로 $x=a\\tan\\theta$ $\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 놓는다.\n미분: 양변을 $\\theta$로 미분하면 $dx=a\\sec^2\\theta\\,d\\theta$이다.\n구간 변환: $x=0$이면 $\\tan\\theta=0$에서 $\\theta=0$이고, $x=\\sqrt{3}a$이면 $\\tan\\theta=\\sqrt{3}$에서 $\\theta=\\frac{\\pi}{3}$이다.\n분모 정리: $a^2+x^2=a^2(1+\\tan^2\\theta)=a^2\\sec^2\\theta$이다.\n치환적분: $\\int_0^{\\sqrt{3}a}\\frac{1}{a^2+x^2}dx=\\int_0^{\\frac{\\pi}{3}}\\frac{a\\sec^2\\theta}{a^2\\sec^2\\theta}d\\theta=\\int_0^{\\frac{\\pi}{3}}\\frac{1}{a}\\,d\\theta$로 약분된다.\n정적분 계산: $\\left[\\frac{1}{a}\\theta\\right]_0^{\\frac{\\pi}{3}}=\\frac{1}{a}\\cdot\\frac{\\pi}{3}=\\frac{\\pi}{3a}$이다.\n방정식 풀이: $\\frac{\\pi}{3a}=\\frac{\\pi}{12}$에서 $3a=12$이므로 $a=4$이다.\n주의: $\\tan\\theta=\\sqrt{3}$인 예각은 $\\frac{\\pi}{3}$이며 $\\frac{\\pi}{6}$이 아니다.\n따라서 정답은 ③이다.",
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
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "다음 조건을 만족시키는 두 정적분의 값을 각각 $a, b$라 할 때, $\\frac{a}{b}$의 값은?\n(가) $\\int_0^2 \\sqrt{4-x^2}\\,dx = a$\n(나) $\\int_0^3 \\frac{1}{x^2+9}\\,dx = b$",
    "choices": [
      "$3$",
      "$4$",
      "$6$",
      "$8$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "(가) 삼각치환법: $\\sqrt{4-x^2}$이므로 $x=2\\sin\\theta$ $\\left(0\\le\\theta\\le\\frac{\\pi}{2}\\right)$로 놓으면 $dx=2\\cos\\theta\\,d\\theta$이다.\n(가) 구간·근호: $x=0$이면 $\\theta=0$, $x=2$이면 $\\sin\\theta=1$에서 $\\theta=\\frac{\\pi}{2}$이고 $\\sqrt{4-x^2}=2\\cos\\theta$이다.\n(가) 대입: $a=\\int_0^{\\frac{\\pi}{2}}2\\cos\\theta\\cdot 2\\cos\\theta\\,d\\theta=4\\int_0^{\\frac{\\pi}{2}}\\cos^2\\theta\\,d\\theta$이다.\n(가) 반각공식: $\\cos^2\\theta=\\frac{1+\\cos 2\\theta}{2}$이므로 $a=4\\int_0^{\\frac{\\pi}{2}}\\frac{1+\\cos 2\\theta}{2}d\\theta=2\\left[\\theta+\\frac{\\sin 2\\theta}{2}\\right]_0^{\\frac{\\pi}{2}}$이다.\n(가) 계산: $a=2\\left(\\frac{\\pi}{2}+\\frac{\\sin\\pi}{2}\\right)-2(0+0)=2\\cdot\\frac{\\pi}{2}=\\pi$이다.\n(나) 삼각치환법: $x=3\\tan\\theta$로 놓으면 $dx=3\\sec^2\\theta\\,d\\theta$이고 $x^2+9=9\\sec^2\\theta$이다.\n(나) 구간: $x=0$이면 $\\theta=0$, $x=3$이면 $\\tan\\theta=1$에서 $\\theta=\\frac{\\pi}{4}$이다.\n(나) 계산: $b=\\int_0^{\\frac{\\pi}{4}}\\frac{3\\sec^2\\theta}{9\\sec^2\\theta}d\\theta=\\frac{1}{3}\\int_0^{\\frac{\\pi}{4}}1\\,d\\theta=\\frac{1}{3}\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{12}$이다.\n비 계산: $\\frac{a}{b}=\\frac{\\pi}{\\pi/12}=\\pi\\cdot\\frac{12}{\\pi}=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
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
    "content": "정적분 $\\int_1^{\\sqrt{3}} \\frac{1}{x^2\\sqrt{4-x^2}}\\,dx$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{3}}{12}$",
      "$\\frac{\\sqrt{3}}{6}$",
      "$\\frac{\\sqrt{3}}{4}$",
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{\\sqrt{3}}{2}$"
    ],
    "answer": "②",
    "solution": "삼각치환법: $\\sqrt{4-x^2}$이므로 $x=2\\sin\\theta$ $\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 놓으면 $dx=2\\cos\\theta\\,d\\theta$이다.\n구간 변환: $x=1$이면 $\\sin\\theta=\\frac{1}{2}$에서 $\\theta=\\frac{\\pi}{6}$, $x=\\sqrt{3}$이면 $\\sin\\theta=\\frac{\\sqrt{3}}{2}$에서 $\\theta=\\frac{\\pi}{3}$이다.\n피적분함수 정리: $\\sqrt{4-x^2}=2\\cos\\theta$이므로 $\\frac{1}{x^2\\sqrt{4-x^2}}dx=\\frac{1}{4\\sin^2\\theta\\cdot 2\\cos\\theta}\\cdot 2\\cos\\theta\\,d\\theta$이다.\n약분: $2\\cos\\theta$가 소거되어 $\\frac{1}{4\\sin^2\\theta}d\\theta=\\frac{1}{4}\\csc^2\\theta\\,d\\theta$이다.\n적분 공식: $(\\cot\\theta)'=-\\csc^2\\theta$이므로 $\\int\\csc^2\\theta\\,d\\theta=-\\cot\\theta+C$이다.\n정적분 계산: $\\int_1^{\\sqrt{3}}\\frac{1}{x^2\\sqrt{4-x^2}}dx=\\left[-\\frac{1}{4}\\cot\\theta\\right]_{\\frac{\\pi}{6}}^{\\frac{\\pi}{3}}=-\\frac{1}{4}\\left(\\cot\\frac{\\pi}{3}-\\cot\\frac{\\pi}{6}\\right)$이다.\n값 정리: $\\cot\\frac{\\pi}{3}=\\frac{\\sqrt{3}}{3}$, $\\cot\\frac{\\pi}{6}=\\sqrt{3}$이므로 $-\\frac{1}{4}\\left(\\frac{\\sqrt{3}}{3}-\\sqrt{3}\\right)=-\\frac{1}{4}\\left(-\\frac{2\\sqrt{3}}{3}\\right)=\\frac{\\sqrt{3}}{6}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
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
    "content": "다음 정적분의 값이 옳지 않은 것은?",
    "choices": [
      "$\\int_1^4 \\frac{(\\sqrt{x}-1)^2}{x}\\,dx = 2\\ln 2 - 1$",
      "$\\int_0^1 \\frac{4^x-1}{2^x+1}\\,dx = \\frac{1}{\\ln 2} - 1$",
      "$\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{4}} \\frac{1}{\\cos^2 x - 1}\\,dx = 1 - \\sqrt{3}$",
      "$\\int_0^{\\frac{\\pi}{6}} \\cos^3 x\\,dx = \\frac{1}{6}$",
      "$\\int_0^{2\\sqrt{3}} \\frac{1}{\\sqrt{16-x^2}}\\,dx = \\frac{\\pi}{3}$"
    ],
    "answer": "④",
    "solution": "보기별로 정적분을 실제로 계산하여 참·거짓을 판정한다.\n(i) ①: $(\\sqrt{x}-1)^2=x-2\\sqrt{x}+1$이므로 $\\frac{(\\sqrt{x}-1)^2}{x}=1-2x^{-\\frac{1}{2}}+\\frac{1}{x}$이다.\n(i) 적분: $\\left[x-4\\sqrt{x}+\\ln x\\right]_1^4=(4-8+\\ln 4)-(1-4+0)=-4+2\\ln 2+3=2\\ln 2-1$이므로 옳다.\n(ii) ②: $4^x-1=(2^x)^2-1=(2^x-1)(2^x+1)$이므로 피적분함수는 $\\frac{(2^x-1)(2^x+1)}{2^x+1}=2^x-1$이다.\n(ii) 적분: $\\left[\\frac{2^x}{\\ln 2}-x\\right]_0^1=\\left(\\frac{2}{\\ln 2}-1\\right)-\\left(\\frac{1}{\\ln 2}-0\\right)=\\frac{1}{\\ln 2}-1$이므로 옳다.\n(iii) ③: $\\cos^2x-1=-\\sin^2x$이므로 $\\frac{1}{\\cos^2x-1}=-\\csc^2x$이다.\n(iii) 적분: $\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{4}}-\\csc^2x\\,dx=\\left[\\cot x\\right]_{\\frac{\\pi}{6}}^{\\frac{\\pi}{4}}=\\cot\\frac{\\pi}{4}-\\cot\\frac{\\pi}{6}=1-\\sqrt{3}$이므로 옳다.\n(iv) ④: $\\cos^3x=(1-\\sin^2x)\\cos x$에서 $t=\\sin x$로 치환하면 $dt=\\cos x\\,dx$이고 $x=0\\to t=0$, $x=\\frac{\\pi}{6}\\to t=\\frac{1}{2}$이다.\n(iv) 계산: $\\int_0^{\\frac{1}{2}}(1-t^2)\\,dt=\\left[t-\\frac{t^3}{3}\\right]_0^{\\frac{1}{2}}=\\frac{1}{2}-\\frac{1}{24}=\\frac{12}{24}-\\frac{1}{24}=\\frac{11}{24}$이다.\n(iv) 판정: $\\frac{11}{24}\\neq\\frac{1}{6}$이므로 ④의 값은 옳지 않다.\n(v) ⑤: $x=4\\sin\\theta$로 치환하면 $dx=4\\cos\\theta\\,d\\theta$이고 $x=0\\to\\theta=0$, $x=2\\sqrt{3}\\to\\theta=\\frac{\\pi}{3}$이며 $\\sqrt{16-x^2}=4\\cos\\theta$이다.\n(v) 계산: $\\int_0^{\\frac{\\pi}{3}}\\frac{4\\cos\\theta}{4\\cos\\theta}d\\theta=[\\theta]_0^{\\frac{\\pi}{3}}=\\frac{\\pi}{3}$이므로 옳다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
