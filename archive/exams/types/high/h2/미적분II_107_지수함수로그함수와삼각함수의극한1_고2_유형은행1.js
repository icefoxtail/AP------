window.examTitle = "미적분II_107_지수함수로그함수와삼각함수의극한1_고2_유형은행1";

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
    "content": "$\\lim_{x\\to0}\\tan(kx)/(e^{3x}-1)=2$일 때 $k$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "기본 극한 $\\lim_{x\\to0}\\frac{\\tan kx}{kx}=1$이므로 $\\tan kx \\sim kx$이다.\n지수함수의 기본 극한 $\\lim_{x\\to0}\\frac{e^{3x}-1}{3x}=1$이므로 $e^{3x}-1 \\sim 3x$이다.\n따라서 주어진 극한은 $\\lim_{x\\to0}\\frac{kx}{3x}=\\frac{k}{3}$이다.\n조건에서 $\\frac{k}{3}=2$이므로 $k=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
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
    "content": "$\\lim_{x\\to0}(a^x-1)/(a\\sin 2x)=1/a$를 만족하는 양수 $a$는?",
    "choices": [
      "$e^2$",
      "$e^3$",
      "$e^4$",
      "$e^5$",
      "$e^6$"
    ],
    "answer": "①",
    "solution": "$a^x=e^{x\\ln a}$이므로 지수함수의 기본 극한에서 $\\lim_{x\\to0}\\frac{a^x-1}{x}=\\ln a$이다.\n삼각함수의 기본 극한에서 $\\lim_{x\\to0}\\frac{\\sin2x}{2x}=1$, 즉 $\\sin2x\\sim2x$이다.\n분자와 분모를 각각 근사하면 $\\frac{a^x-1}{a\\sin2x}\\sim\\frac{x\\ln a}{a\\cdot2x}=\\frac{\\ln a}{2a}$이다.\n조건에서 $\\frac{\\ln a}{2a}=\\frac1a$이고 $a>0$이므로 양변에 $a$를 곱해 $\\frac{\\ln a}{2}=1$이다.\n따라서 $\\ln a=2$이므로 $a=e^2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$\\lim_{x\\to0}\\frac{1-\\cos6x}{x\\ln(1+3x)}$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "반각 공식 $1-\\cos6x=2\\sin^2 3x$로 변형한다.\n삼각함수의 기본 극한에서 $\\sin3x\\sim3x$이므로 분자는 $1-\\cos6x\\sim2(3x)^2=18x^2$이다.\n로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+3x)}{3x}=1$에서 $\\ln(1+3x)\\sim3x$이다.\n따라서 분모는 $x\\ln(1+3x)\\sim x\\cdot3x=3x^2$이다.\n극한은 $\\lim_{x\\to0}\\frac{18x^2}{3x^2}=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\lim_{x\\to0}x\\ln(1+ax)/(1-\\cos4x)=1/2$일 때 $a$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+ax)}{ax}=1$에서 $\\ln(1+ax)\\sim ax$이다.\n따라서 분자는 $x\\ln(1+ax)\\sim x\\cdot ax=ax^2$이다.\n반각 공식과 기본 극한에서 $1-\\cos4x=2\\sin^2 2x\\sim2(2x)^2=8x^2$이다.\n극한은 $\\lim_{x\\to0}\\frac{ax^2}{8x^2}=\\frac a8$이다.\n조건에서 $\\frac a8=\\frac12$이므로 $a=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$x>0$에서 $f(x)=ax/(e^{4x}-1)$, $x<0$에서 $f(x)=3\\tan x/(5x+\\sin x)$이다. $x\\to0$의 극한이 존재하도록 하는 $a$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "$x\\to0^+$일 때 지수함수의 기본 극한에서 $e^{4x}-1\\sim4x$이므로 우극한은 $\\lim_{x\\to0^+}\\frac{ax}{e^{4x}-1}=\\frac a4$이다.\n$x\\to0^-$일 때 $\\tan x\\sim x$, $\\sin x\\sim x$이므로 좌극한은 $\\lim_{x\\to0^-}\\frac{3\\tan x}{5x+\\sin x}=\\frac{3x}{5x+x}=\\frac12$이다.\n극한이 존재하려면 좌극한과 우극한이 같아야 한다.\n따라서 $\\frac a4=\\frac12$이므로 $a=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_PIECEWISE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$\\lim_{x\\to0}(e^{\\sin2x}-1)/\\tan x+\\lim_{x\\to\\infty}(1+\\sin x/x)^{2x/\\sin x}$의 값은? (둘째 극한은 $\\sin x\\ne0$에서 취한다.)",
    "choices": [
      "$1+e^2$",
      "$2+e^2$",
      "$3+e^2$",
      "$4+e^2$",
      "$5+e^2$"
    ],
    "answer": "②",
    "solution": "첫째 극한에서 $\\sin2x\\sim2x$, $e^u-1\\sim u$, $\\tan x\\sim x$를 쓴다.\n$\\lim_{x\\to0}\\frac{e^{\\sin2x}-1}{\\tan x}=\\lim_{x\\to0}\\frac{\\sin2x}{x}=\\lim_{x\\to0}\\frac{2x}{x}=2$이다.\n둘째 극한에서 $u=\\frac{\\sin x}{x}$로 놓으면 $x\\to\\infty$일 때 $u\\to0$이다.\n이때 $\\frac{2x}{\\sin x}=\\frac2u$이므로 $(1+u)^{2/u}=\\left((1+u)^{1/u}\\right)^2$이다.\n자연로그의 정의 $\\lim_{u\\to0}(1+u)^{1/u}=e$에서 둘째 극한은 $e^2$이다.\n따라서 전체 값은 $2+e^2$이다.\n주의: 둘째 극한은 $\\sin x\\ne0$인 $x$에서 취해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
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
    "content": "$\\lim_{x\\to0}\\frac{e^{2+3(\\tan x-\\sin x)}-e^2}{\\tan x-\\sin x}$의 값은?",
    "choices": [
      "$2e^2$",
      "$3e^2$",
      "$4e^2$",
      "$5e^2$",
      "$6e^2$"
    ],
    "answer": "②",
    "solution": "$u=\\tan x-\\sin x$로 놓으면 $x\\to0$일 때 $u\\to0$이다.\n식을 $u$로 나타내면 $\\frac{e^{2+3u}-e^2}{u}=\\frac{e^2(e^{3u}-1)}{u}$이다.\n지수함수의 기본 극한 $\\lim_{u\\to0}\\frac{e^{3u}-1}{3u}=1$에서 $\\frac{e^{3u}-1}{u}\\to3$이다.\n따라서 극한은 $e^2\\cdot3=3e^2$이다.\n주의: $u=\\tan x-\\sin x$ 자체의 극한값 $0$으로 나누는 것이 아니라, $u$에 대한 기본 극한으로 계산해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
