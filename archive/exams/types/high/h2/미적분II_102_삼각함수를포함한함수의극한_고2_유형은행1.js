window.examTitle = "미적분II_102_삼각함수를포함한함수의극한_고2_유형은행1";

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
    "content": "$\\lim_{x\\to 0}\\frac{\\sin 3x\\,\\tan 4x}{x^2}$의 값은?",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "answer": "②",
    "solution": "사인·탄젠트의 기본 극한을 쓰기 위해 분자를 $3x\\cdot4x$로 묶으면 $$\\frac{\\sin3x\\,\\tan4x}{x^2}=\\frac{\\sin3x}{3x}\\cdot\\frac{\\tan4x}{4x}\\cdot12$$이다.\n사인·탄젠트의 기본 극한에서 $\\lim_{x\\to0}\\frac{\\sin3x}{3x}=1$, $\\lim_{x\\to0}\\frac{\\tan4x}{4x}=1$이다.\n따라서 극한값은 $1\\cdot1\\cdot12=12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\lim_{x\\to 0}\\frac{\\sin 6x}{\\tan 4x}$의 값은?",
    "choices": [
      "$1.5$",
      "$1.75$",
      "$2$",
      "$2.25$",
      "$2.5$"
    ],
    "answer": "①",
    "solution": "분모의 $\\tan4x$를 기본 극한 꼴로 만들기 위해 분자·분모를 각각 $6x$, $4x$로 맞추면 $$\\frac{\\sin6x}{\\tan4x}=\\frac{\\sin6x}{6x}\\cdot\\frac{4x}{\\tan4x}\\cdot\\frac64$$이다.\n사인·탄젠트의 기본 극한에서 두 분수는 모두 1로 수렴한다.\n따라서 극한값은 $\\frac64=\\frac32=1.5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
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
    "content": "$\\lim_{x\\to 0}f(\\tan 3x)/x$의 값은? (단, $f(t)=2t^2+4t$이다.)",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "④",
    "solution": "함숫값을 대입하면 $f(\\tan3x)=2\\tan^2 3x+4\\tan3x$이다.\n$\\tan3x$로 묶고 $x$로 나누면 $$\\frac{f(\\tan3x)}x=(2\\tan3x+4)\\frac{\\tan3x}{x}$$이다.\n$\\tan3x\\to0$이므로 $2\\tan3x+4\\to4$이다.\n탄젠트의 기본 극한 $\\lim_{x\\to0}\\frac{\\tan3x}{3x}=1$에서 $\\frac{\\tan3x}{x}\\to3$이다.\n따라서 극한값은 $4\\cdot3=12$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_QUADRATIC_FUNCTION"
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
    "content": "$a,b,c$가 차례로 $\\lim_{x\\to 0}\\frac{\\sin2x\\tan3x}{x\\sin4x}$, $\\lim_{x\\to 0}\\frac{\\sin(\\sin 4x)}{\\sin2x}$, $\\lim_{x\\to \\infty}x\\tan(5/x)$일 때, $2a+b-c$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "①",
    "solution": "먼저 $a$의 분자를 기본 극한 꼴로 맞추면 $$a=\\lim_{x\\to0}\\frac{\\sin2x\\tan3x}{x\\sin4x}=\\lim_{x\\to0}\\frac{\\sin2x}{2x}\\cdot\\frac{\\tan3x}{3x}\\cdot\\frac{4x}{\\sin4x}\\cdot\\frac{2\\cdot3}{4}$$이다.\n사인·탄젠트의 기본 극한에서 세 분수는 모두 1이므로 $a=\\frac64=\\frac32$이다.\n다음 $b$에서 $t=\\sin4x$로 보면 $\\sin(\\sin4x)=\\sin t$이고 $t\\to0$이다.\n$$b=\\lim_{x\\to0}\\frac{\\sin(\\sin4x)}{\\sin4x}\\cdot\\frac{\\sin4x}{4x}\\cdot\\frac{2x}{\\sin2x}\\cdot\\frac42$$이므로 기본 극한에서 $b=1\\cdot1\\cdot1\\cdot2=2$이다.\n마지막 $c$에서 $t=\\frac1x$로 치환하면 $x\\to\\infty$일 때 $t\\to0^+$이다.\n$c=\\lim_{t\\to0^+}\\frac{\\tan5t}{t}=\\lim_{t\\to0^+}\\frac{\\tan5t}{5t}\\cdot5=5$이다.\n$2a+b-c=2\\cdot\\frac32+2-5=3+2-5=0$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_FUNCTION_LIMIT"
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
    "content": "$\\lim_{x\\to 0}\\frac{(\\sin2x+\\sin 4x)^2}{\\sec^2(3x)-1}$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "피타고라스 항등식에서 분모는 $\\sec^2(3x)-1=\\tan^2(3x)$이다.\n분자와 분모를 각각 $x^2$로 나누면 $$\\frac{(\\sin2x+\\sin4x)^2}{\\sec^2(3x)-1}=\\frac{\\left(\\frac{\\sin2x}{x}+\\frac{\\sin4x}{x}\\right)^2}{\\left(\\frac{\\tan3x}{x}\\right)^2}$$이다.\n사인·탄젠트의 기본 극한에서 $\\frac{\\sin2x}{x}\\to2$, $\\frac{\\sin4x}{x}\\to4$, $\\frac{\\tan3x}{x}\\to3$이다.\n따라서 분자의 극한은 $(2+4)^2=36$, 분모의 극한은 $3^2=9$이다.\n그러므로 극한값은 $\\frac{36}{9}=4$이다.\n주의: 분모를 $\\tan^2(3x)$로 바꾼 뒤 $x^2$으로 나누어야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
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
    "content": "$\\lim_{x\\to 0}(\\cos 3x)^{2/\\sin^2x}$의 값은?",
    "choices": [
      "$e^{-13}$",
      "$e^{-12}$",
      "$e^{-11}$",
      "$e^{-10}$",
      "$e^{-9}$"
    ],
    "answer": "⑤",
    "solution": "$L=\\lim_{x\\to0}(\\cos3x)^{2/\\sin^2x}$로 놓고 $1^\\infty$ 꼴을 피하기 위해 자연로그를 취하면 $\\ln L=\\lim_{x\\to0}\\frac{2\\ln(\\cos3x)}{\\sin^2x}$이다.\n반각 공식에서 $\\cos3x-1=-2\\sin^2\\frac{3x}{2}$이다.\n$u=\\cos3x-1\\to0$이므로 로그의 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}u=1$을 쓸 수 있다.\n$\\ln L=\\lim_{x\\to0}\\left[\\frac{2(\\cos3x-1)}{\\sin^2x}\\cdot\\frac{\\ln(1+u)}u\\right]$로 분해한다.\n앞의 비율은 $\\frac{2(\\cos3x-1)}{\\sin^2x}=-4\\left(\\frac{\\sin(3x/2)}{\\sin x}\\right)^2$이다.\n기본 극한에서 $\\frac{\\sin(3x/2)}{\\sin x}=\\frac{\\sin(3x/2)}{3x/2}\\cdot\\frac{x}{\\sin x}\\cdot\\frac32\\to\\frac32$이다.\n따라서 앞의 비율의 극한은 $-4\\left(\\frac32\\right)^2=-9$이고, 뒤의 로그 비율은 1로 수렴한다.\n그러므로 $\\ln L=-9$, 즉 $L=e^{-9}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$\\lim_{x\\to 0^+}\\log_2(\\sin 4x)-\\log_2(\\sin x)$, $\\lim_{x\\to 0}\\sin(\\tan 6x)/\\sin 2x$를 각각 $a,b$라 하자. $b-a$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "④",
    "solution": "로그의 차를 로그의 몫으로 합치면 $a=\\lim_{x\\to0^+}\\log_2\\frac{\\sin4x}{\\sin x}$이다.\n$\\frac{\\sin4x}{\\sin x}=\\frac{\\sin4x}{4x}\\cdot\\frac{x}{\\sin x}\\cdot4\\to4$이다.\n로그함수가 연속이므로 $a=\\log_2 4=2$이다.\n$b$의 분자·분모를 기본 극한 꼴로 분해하면 $$b=\\lim_{x\\to0}\\frac{\\sin(\\tan6x)}{\\tan6x}\\cdot\\frac{\\tan6x}{6x}\\cdot\\frac{2x}{\\sin2x}\\cdot\\frac62$$이다.\n합성함수에서 $\\tan6x\\to0$이므로 $\\frac{\\sin(\\tan6x)}{\\tan6x}\\to1$이다.\n나머지 기본 극한도 모두 1이므로 $b=1\\cdot1\\cdot1\\cdot3=3$이다.\n$b-a=3-2=1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
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
    "content": "$\\lim_{x\\to 0}\\frac{4x+\\tan 2x}{\\sin 3x}$, $\\lim_{x\\to 0}\\frac{\\tan 6x}{3x+\\sin 3x}$를 각각 $a,b$라 하자. $a+b$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$a$의 분자·분모를 $x$로 나누면 $a=\\lim_{x\\to0}\\frac{4+\\frac{\\tan2x}{x}}{\\frac{\\sin3x}{x}}$이다.\n$\\frac{\\tan2x}{x}\\to2$, $\\frac{\\sin3x}{x}\\to3$이므로 $a=\\frac{4+2}{3}=2$이다.\n$b$도 분자·분모를 $x$로 나누면 $b=\\lim_{x\\to0}\\frac{\\frac{\\tan6x}{x}}{3+\\frac{\\sin3x}{x}}$이다.\n$\\frac{\\tan6x}{x}\\to6$, $\\frac{\\sin3x}{x}\\to3$이므로 $b=\\frac6{3+3}=1$이다.\n$a+b=2+1=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "$\\lim_{x\\to 0}\\frac{x}{\\sin x+\\sin 2x+\\cdots+\\sin nx}$$=\\frac1{36}$일 때, 자연수 $n$은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "①",
    "solution": "각 항을 기본 극한으로 만들면 $\\frac{\\sin(kx)}x=k\\frac{\\sin(kx)}{kx}\\to k$이다.\n분모 전체를 $x$로 나눈 극한은 $\\sum_{k=1}^n k=\\frac{n(n+1)}2$이다.\n따라서 주어진 극한은 $\\frac{1}{\\frac{n(n+1)}2}=\\frac{2}{n(n+1)}=\\frac1{36}$이다.\n$\\frac{2}{n(n+1)}=\\frac1{36}$에서 $n(n+1)=72$이다.\n$n^2+n-72=0$을 인수분해하면 $(n+9)(n-8)=0$이다.\n$n$은 자연수이므로 $n=8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "자연수 $n$에 대해 $f(n)=$$\\lim_{x\\to 0}\\frac{\\sin 2x+\\sin 4x+\\cdots+\\sin(2nx)}{x}$이다. $\\sum_{n=1}^{4}1/f(n)$의 값은?",
    "choices": [
      "$0.3$",
      "$0.55$",
      "$0.8$",
      "$1.05$",
      "$1.3$"
    ],
    "answer": "③",
    "solution": "각 항은 기본 극한에서 $\\lim_{x\\to0}\\frac{\\sin(2kx)}x=2k$이다.\n유한한 $n$개 항의 합이므로 $f(n)=\\sum_{k=1}^n 2k=2\\cdot\\frac{n(n+1)}2=n(n+1)$이다.\n$\\frac1{f(n)}=\\frac1{n(n+1)}$을 부분분수로 분해하면 $\\frac1n-\\frac1{n+1}$이다.\n$\\sum_{n=1}^4\\frac1{f(n)}=\\sum_{n=1}^4\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n텔레스코핑으로 $=\\left(1-\\frac12\\right)+\\left(\\frac12-\\frac13\\right)+\\left(\\frac13-\\frac14\\right)+\\left(\\frac14-\\frac15\\right)$이다.\n$=1-\\frac15=\\frac45=0.8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
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
    "content": "자연수 $n$에 대해 $f(n)=\\lim_{x\\to0}\\frac{x}{\\tan(2x)+\\tan(4x)+\\cdots+\\tan(2nx)}$이다. $\\sum_{n=1}^{9}f(n)$의 값은?",
    "choices": [
      "$4/5$",
      "$9/10$",
      "$1$",
      "$11/10$",
      "$6/5$"
    ],
    "answer": "②",
    "solution": "각 항은 $\\frac{\\tan(2kx)}x=2k\\cdot\\frac{\\tan(2kx)}{2kx}\\to2k$이다.\n분모 전체의 극한은 $\\sum_{k=1}^n 2k=n(n+1)$이다.\n따라서 $f(n)=\\frac1{n(n+1)}$이다.\n부분분수 분해로 $f(n)=\\frac1n-\\frac1{n+1}$이다.\n$\\sum_{n=1}^9 f(n)=\\sum_{n=1}^9\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n텔레스코핑으로 $=1-\\frac1{10}=\\frac9{10}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$\\lim_{x\\to 0}\\frac{\\sum_{k=1}^{12}\\sin(kx)\\tan(kx)}{x^2}$의 값은?",
    "choices": [
      "$646$",
      "$647$",
      "$648$",
      "$649$",
      "$650$"
    ],
    "answer": "⑤",
    "solution": "각 항을 기본 극한 꼴로 만들면 $\\frac{\\sin(kx)\\tan(kx)}{x^2}=k^2\\cdot\\frac{\\sin(kx)}{kx}\\cdot\\frac{\\tan(kx)}{kx}$이다.\n사인·탄젠트의 기본 극한에서 두 분수는 1로 수렴하므로 각 항의 극한은 $k^2$이다.\n유한합의 극한은 각 항 극한의 합이므로 주어진 극한은 $\\sum_{k=1}^{12}k^2$이다.\n제곱의 합 공식 $\\sum_{k=1}^n k^2=\\frac{n(n+1)(2n+1)}6$에 $n=12$를 대입한다.\n$\\sum_{k=1}^{12}k^2=\\frac{12\\cdot13\\cdot25}{6}$이다.\n$=2\\cdot13\\cdot25=650$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
