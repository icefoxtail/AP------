window.examTitle = "미적분II_104_lim1-coskx꼴의극한_고2_유형은행1";

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
    "content": "$\\lim_{x\\to 0}\\frac{1-\\cos 6x}{x^2}$의 값은?",
    "choices": [
      "$18$",
      "$19$",
      "$20$",
      "$21$",
      "$22$"
    ],
    "answer": "①",
    "solution": "반각공식 $1-\\cos 6x=2\\sin^2 3x$를 쓴다.\n주어진 극한은 $\\lim_{x\\to0}\\frac{2\\sin^2 3x}{x^2}$이다.\n$\\frac{\\sin 3x}{x}=3\\cdot\\frac{\\sin 3x}{3x}$이고 기본 삼각극한 $\\lim_{x\\to0}\\frac{\\sin 3x}{3x}=1$이다.\n따라서 $\\lim_{x\\to0}\\frac{2\\sin^2 3x}{x^2}=2\\cdot3^2\\cdot1^2=18$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
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
    "content": "$\\lim_{x\\to 0}\\frac{1-\\cos 4x}{x\\sin 2x}$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "반각공식 $1-\\cos4x=2\\sin^2 2x$를 적용한다.\n$\\frac{1-\\cos4x}{x\\sin2x}=\\frac{2\\sin^2 2x}{x\\sin2x}$이다.\n$\\sin2x\\neq0$인 $x$에서 약분하면 $\\frac{2\\sin2x}{x}$이다.\n$\\frac{\\sin2x}{x}=2\\cdot\\frac{\\sin2x}{2x}\\to2$이므로 극한은 $2\\cdot2=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
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
    "content": "$\\lim_{x\\to 0}\\frac{1-\\cos4x}{x\\sin 2x}$, $\\lim_{x\\to 0}\\frac{1-\\cos 3x}{x\\tan 3x}$의 값을 각각 $a,b$라 할 때, $ab$는?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "첫째 극한 $a$에 반각공식 $1-\\cos4x=2\\sin^2 2x$를 쓴다.\n$a=\\lim_{x\\to0}\\frac{2\\sin^2 2x}{x\\sin2x}=\\lim_{x\\to0}\\frac{2\\sin2x}{x}$이다.\n$\\frac{\\sin2x}{x}\\to2$이므로 $a=2\\cdot2=4$이다.\n둘째 극한 $b$에서 $1-\\cos3x=2\\sin^2\\frac{3x}{2}$이고 $\\tan3x=\\frac{\\sin3x}{\\cos3x}$이다.\n$b=\\lim_{x\\to0}\\frac{2\\sin^2\\frac{3x}{2}\\cos3x}{x\\sin3x}$로 쓴다.\n$\\frac{\\sin\\frac{3x}{2}}{x}\\to\\frac32$, $\\frac{\\sin3x}{x}\\to3$, $\\cos3x\\to1$이다.\n따라서 $b=\\frac{2\\left(\\frac32\\right)^2\\cdot1}{3}=\\frac{\\frac92}{3}=\\frac32$이다.\n$ab=4\\cdot\\frac32=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
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
    "content": "$f(x)=3x$, $g(x)=1-\\cos 4x$일 때, $\\lim_{x\\to 0}f(g(x))/g(f(x))$의 값은?",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{2}{7}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "⑤",
    "solution": "$f(g(x))=3(1-\\cos4x)$이고 $g(f(x))=1-\\cos(4\\cdot3x)=1-\\cos12x$이다.\n반각공식으로 분자는 $3(1-\\cos4x)=6\\sin^2 2x$이다.\n분모는 $1-\\cos12x=2\\sin^2 6x$이다.\n따라서 $\\frac{f(g(x))}{g(f(x))}=\\frac{6\\sin^2 2x}{2\\sin^2 6x}=3\\left(\\frac{\\sin2x}{\\sin6x}\\right)^2$이다.\n$\\frac{\\sin2x}{\\sin6x}=\\frac{\\frac{\\sin2x}{2x}}{\\frac{\\sin6x}{6x}}\\cdot\\frac{2x}{6x}\\to1\\cdot1\\cdot\\frac13=\\frac13$이다.\n그러므로 극한은 $3\\left(\\frac13\\right)^2=3\\cdot\\frac19=\\frac13$이다.\n주의: $f(g(x))$와 $g(f(x))$의 합성 순서를 바꾸어 계산하지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
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
    "content": "$f(n)=$$\\lim_{x\\to 0}(1-\\cos 2nx)/x^2$일 때 $\\sum_{n=1}^6 f(n)$의 값은?",
    "choices": [
      "$178$",
      "$179$",
      "$180$",
      "$181$",
      "$182$"
    ],
    "answer": "⑤",
    "solution": "$f(n)$에 반각공식 $1-\\cos2nx=2\\sin^2 nx$를 적용한다.\n$f(n)=\\lim_{x\\to0}\\frac{2\\sin^2 nx}{x^2}=\\lim_{x\\to0}2n^2\\left(\\frac{\\sin nx}{nx}\\right)^2$이다.\n$\\frac{\\sin nx}{nx}\\to1$이므로 $f(n)=2n^2$이다.\n자연수 거듭제곱의 합으로 $\\sum_{n=1}^6f(n)=2\\sum_{n=1}^6n^2=2\\cdot\\frac{6\\cdot7\\cdot13}{6}$이다.\n$=2\\cdot91=182$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
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
    "content": "$f(n)=$$\\lim_{x\\to 0}(1-\\sec(2nx))/x^2$일 때 $\\sum_{n=1}^{5}f(n)$의 값은?",
    "choices": [
      "$-111$",
      "$-110$",
      "$-109$",
      "$-108$",
      "$-107$"
    ],
    "answer": "②",
    "solution": "$\\sec(2nx)=\\frac1{\\cos2nx}$이므로 $1-\\sec2nx=\\frac{\\cos2nx-1}{\\cos2nx}=-\\frac{1-\\cos2nx}{\\cos2nx}$이다.\n따라서 $f(n)=-\\lim_{x\\to0}\\frac{1-\\cos2nx}{x^2}\\cdot\\frac1{\\cos2nx}$이다.\n반각공식과 기본 삼각극한으로 $\\lim_{x\\to0}\\frac{1-\\cos2nx}{x^2}=2n^2$이다.\n$\\cos2nx\\to1$이므로 $f(n)=-2n^2$이다.\n$\\sum_{n=1}^5f(n)=-2\\sum_{n=1}^5n^2=-2\\cdot\\frac{5\\cdot6\\cdot11}{6}$이다.\n$=-2\\cdot55=-110$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
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
    "content": "$\\lim_{x\\to 0}\\frac{\\cos 2x-\\cos 4x}{x^2}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$\\cos2x-\\cos4x=(1-\\cos4x)-(1-\\cos2x)$로 묶는다.\n반각공식으로 $1-\\cos4x=2\\sin^2 2x$, $1-\\cos2x=2\\sin^2 x$이다.\n따라서 극한은 $\\lim_{x\\to0}\\left(\\frac{2\\sin^2 2x}{x^2}-\\frac{2\\sin^2 x}{x^2}\\right)$이다.\n$\\frac{\\sin2x}{x}\\to2$, $\\frac{\\sin x}{x}\\to1$이므로 각 항은 $2\\cdot2^2=8$, $2\\cdot1^2=2$로 수렴한다.\n극한값은 $8-2=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\lim_{x\\to0}\\frac{\\sin 2x-\\tan 2x}{x^3}$의 값은?",
    "choices": [
      "$-8$",
      "$-4$",
      "$-2$",
      "$2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "$\\sin2x-\\tan2x=\\sin2x-\\frac{\\sin2x}{\\cos2x}=\\sin2x\\left(1-\\frac1{\\cos2x}\\right)$로 인수분해한다.\n$=\\sin2x\\cdot\\frac{\\cos2x-1}{\\cos2x}=-\\frac{\\sin2x(1-\\cos2x)}{\\cos2x}$이다.\n기본 삼각극한으로 $\\frac{\\sin2x}{x}=2\\cdot\\frac{\\sin2x}{2x}\\to2$이다.\n반각공식의 극한으로 $\\frac{1-\\cos2x}{x^2}=2\\left(\\frac{\\sin x}{x}\\right)^2\\to2$이다.\n$\\cos2x\\to1$이므로 $\\frac{\\sin2x}{x}\\cdot\\frac{1-\\cos2x}{x^2}\\cdot\\frac1{\\cos2x}\\to2\\cdot2\\cdot1=4$이다.\n부호를 포함하면 극한은 $-4$이다.\n주의: 분자의 부호가 음수임을 놓치지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
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
    "content": "$\\lim_{x\\to0}\\frac{\\tan 2x-\\sin2x}{x^n}$의 값이 유한하게 존재하도록 하는 모든 자연수 $n$의 합은?",
    "choices": [
      "$1$",
      "$3$",
      "$6$",
      "$10$",
      "$15$"
    ],
    "answer": "③",
    "solution": "$\\tan2x-\\sin2x=\\frac{\\sin2x}{\\cos2x}-\\sin2x=\\sin2x\\left(\\frac1{\\cos2x}-1\\right)$로 인수분해한다.\n$=\\sin2x\\cdot\\frac{1-\\cos2x}{\\cos2x}$이다.\n$\\frac{\\sin2x}{x}\\to2$, $\\frac{1-\\cos2x}{x^2}\\to2$, $\\frac1{\\cos2x}\\to1$이므로 $\\frac{\\tan2x-\\sin2x}{x^3}\\to4$이다.\n(i) $n=1,2$이면 $\\frac{\\tan2x-\\sin2x}{x^n}=x^{3-n}\\cdot\\frac{\\tan2x-\\sin2x}{x^3}\\to0$으로 유한하다.\n(ii) $n=3$이면 극한은 $4$로 유한하다.\n(iii) $n\\ge4$이면 $\\frac{\\tan2x-\\sin2x}{x^n}\\sim\\frac{4x^3}{x^n}=\\frac4{x^{n-3}}$이므로 $x\\to0$에서 발산하여 유한하지 않다.\n따라서 유한한 극한을 갖는 자연수는 $1,2,3$이다.\n그 합은 $1+2+3=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "$\\lim_{x\\to 0}\\frac{\\sec 5x-1}{\\sec 2x-1}$의 값은?",
    "choices": [
      "$5.5$",
      "$5.75$",
      "$6$",
      "$6.25$",
      "$6.5$"
    ],
    "answer": "④",
    "solution": "$\\sec kx-1=\\frac1{\\cos kx}-1=\\frac{1-\\cos kx}{\\cos kx}$로 통일한다.\n주어진 식은 $\\frac{\\frac{1-\\cos5x}{\\cos5x}}{\\frac{1-\\cos2x}{\\cos2x}}=\\frac{1-\\cos5x}{1-\\cos2x}\\cdot\\frac{\\cos2x}{\\cos5x}$이다.\n기본 극한 $\\frac{1-\\cos kx}{x^2}\\to\\frac{k^2}{2}$를 쓴다.\n$\\frac{1-\\cos5x}{x^2}\\to\\frac{25}{2}$이고 $\\frac{1-\\cos2x}{x^2}\\to\\frac42=2$이다.\n따라서 $\\frac{1-\\cos5x}{1-\\cos2x}\\to\\frac{\\frac{25}{2}}{2}=\\frac{25}{4}$이다.\n$\\cos2x\\to1$, $\\cos5x\\to1$이므로 전체 극한은 $\\frac{25}{4}\\cdot1=6.25$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "$0<x<\\pi/4$에서 $f(x)=\\sum_{n=1}^{\\infty}(\\cos 2x)^n$이다. $\\lim_{x\\to0^+}x^2f(x)$의 값은?",
    "choices": [
      "$0$",
      "$1/4$",
      "$1/2$",
      "$1$",
      "$2$"
    ],
    "answer": "③",
    "solution": "$0<x<\\frac\\pi4$이면 $0<2x<\\frac\\pi2$이므로 $0<\\cos2x<1$이다.\n등비급수의 합 공식 $\\sum_{n=1}^\\infty r^n=\\frac r{1-r}$ ($|r|<1$)을 쓴다.\n$f(x)=\\frac{\\cos2x}{1-\\cos2x}$이다.\n구하는 극한은 $\\lim_{x\\to0^+}\\frac{x^2\\cos2x}{1-\\cos2x}$이다.\n반각공식으로 $\\frac{1-\\cos2x}{x^2}=2\\left(\\frac{\\sin x}{x}\\right)^2\\to2$이다.\n따라서 $\\frac{x^2}{1-\\cos2x}\\to\\frac12$이고 $\\cos2x\\to1$이다.\n그러므로 극한은 $\\frac12\\cdot1=\\frac12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-164",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
