window.examTitle = "미적분II_186_변곡점_고2_유형은행1";

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
    "content": "곡선 $y=xe^{2x}$의 변곡점이 $(a,b)$일 때, $b/a$는?",
    "choices": [
      "$e^{-2}$",
      "$e^{-1}$",
      "$1$",
      "$e$",
      "$e^2$"
    ],
    "answer": "①",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $y'=e^{2x}+x\\cdot 2e^{2x}=e^{2x}(1+2x)$이다.\n한 번 더 미분하면 $y''=2e^{2x}(1+2x)+e^{2x}\\cdot 2=4e^{2x}(1+x)$이다.\n$y''=0$이면 $x=-1$이고, $e^{2x}>0$이므로 $y''$의 부호는 $x=-1$의 왼쪽에서 음, 오른쪽에서 양으로 바뀐다.\n$x=-1$을 원래 식에 대입하면 $b=(-1)e^{-2}=-e^{-2}$이다.\n따라서 $b/a=(-e^{-2})/(-1)=e^{-2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
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
    "content": "곡선 $y=x^2+\\ln x$의 변곡점에서 접선의 기울기는?",
    "choices": [
      "$\\sqrt2$",
      "$2$",
      "$2\\sqrt2$",
      "$3$",
      "$3\\sqrt2$"
    ],
    "answer": "③",
    "solution": "정의역은 $x>0$이고, 합성함수와 로그함수의 미분법으로 $y'=2x+\\frac{1}{x}$이다.\n몫의 미분법으로 다시 미분하면 $y''=2-\\frac{1}{x^2}=\\frac{2x^2-1}{x^2}$이다.\n$x>0$에서 $y''=0$인 점은 $x=\\frac{1}{\\sqrt2}$이고, 그 좌우에서 $y''$의 부호가 음에서 양으로 바뀐다.\n따라서 변곡점에서 접선의 기울기는 $y'\\left(\\frac{1}{\\sqrt2}\\right)=2\\cdot\\frac{1}{\\sqrt2}+\\sqrt2$이다.\n$\\frac{2}{\\sqrt2}=\\sqrt2$이므로 기울기는 $\\sqrt2+\\sqrt2=2\\sqrt2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=8\\sin x+2x^2$ ($0<x<\\pi$)의 두 변곡점에서의 접선 기울기의 합은?",
    "choices": [
      "$2\\pi$",
      "$4\\pi$",
      "$6\\pi$",
      "$8\\pi$",
      "$10\\pi$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법으로 $y'=8\\cos x+4x$이고, 다시 미분하면 $y''=-8\\sin x+4$이다.\n$y''=0$에서 $\\sin x=\\frac{1}{2}$이므로 $0<x<\\pi$에서 $x=\\frac{\\pi}{6},\\frac{5\\pi}{6}$이다.\n$y''$의 부호는 $0$에서 $\\frac{\\pi}{6}$까지 양, $\\frac{\\pi}{6}$에서 $\\frac{5\\pi}{6}$까지 음, 그 뒤는 양이므로 두 점 모두 변곡점이다.\n$x=\\frac{\\pi}{6}$에서의 접선의 기울기는 $8\\cdot\\frac{\\sqrt3}{2}+4\\cdot\\frac{\\pi}{6}=4\\sqrt3+\\frac{2\\pi}{3}$이다.\n$x=\\frac{5\\pi}{6}$에서의 접선의 기울기는 $8\\cdot\\left(-\\frac{\\sqrt3}{2}\\right)+4\\cdot\\frac{5\\pi}{6}=-4\\sqrt3+\\frac{10\\pi}{3}$이다.\n두 기울기의 합은 $4\\sqrt3-4\\sqrt3+\\frac{2\\pi}{3}+\\frac{10\\pi}{3}=\\frac{12\\pi}{3}=4\\pi$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$(0,\\pi)$에서 $y=3\\sin(2x)+4x$의 변곡점을 $(a,b)$라 할 때, $b/a$는?",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 $y'=6\\cos(2x)+4$이고, 다시 미분하면 $y''=-12\\sin(2x)$이다.\n$0<x<\\pi$이므로 $0<2x<2\\pi$이고, $y''=0$인 점은 $2x=\\pi$, 즉 $x=\\frac{\\pi}{2}$이다.\n$y''$의 부호가 $x=\\frac{\\pi}{2}$의 왼쪽에서 음, 오른쪽에서 양으로 바뀌므로 변곡점은 $(a,b)=\\left(\\frac{\\pi}{2},b\\right)$이다.\n원래 식에 $x=\\frac{\\pi}{2}$를 대입하면 $b=3\\sin\\pi+4\\cdot\\frac{\\pi}{2}=2\\pi$이다.\n따라서 $b/a=\\frac{2\\pi}{\\pi/2}=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "$a>0$일 때 곡선 $y=(\\ln(1/(ax)))^2$의 변곡점이 $y=3x$ 위에 있다. $a$는?",
    "choices": [
      "$e/2$",
      "$e$",
      "$3e/2$",
      "$2e$",
      "$3e$"
    ],
    "answer": "⑤",
    "solution": "로그의 성질로 $\\ln\\frac{1}{ax}=-\\ln(ax)$이므로 $y=(-\\ln(ax))^2=(\\ln(ax))^2$이다.\n합성함수의 미분법으로 $y'=2\\ln(ax)\\cdot\\frac{1}{x}=\\frac{2\\ln(ax)}{x}$이다.\n몫의 미분법으로 $y''=\\frac{2\\cdot\\frac{1}{x}\\cdot x-2\\ln(ax)}{x^2}=\\frac{2(1-\\ln(ax))}{x^2}$이다.\n$y''=0$이면 $\\ln(ax)=1$이고, 그 좌우에서 $y''$의 부호가 양에서 음으로 바뀌므로 변곡점의 $x$좌표는 $x=\\frac{e}{a}$이다.\n이때 $y=(\\ln e)^2=1$이므로 변곡점은 $\\left(\\frac{e}{a},1\\right)$이다.\n변곡점이 $y=3x$ 위에 있으므로 $1=3\\cdot\\frac{e}{a}$에서 $a=3e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$a>0$일 때 곡선 $y=(\\ln(ax))^2$의 변곡점이 $y=4x-1$ 위에 있다. $a$는?",
    "choices": [
      "$e/2$",
      "$e$",
      "$3e/2$",
      "$2e$",
      "$5e/2$"
    ],
    "answer": "④",
    "solution": "합성함수의 미분법으로 $y'=2\\ln(ax)\\cdot\\frac{1}{x}=\\frac{2\\ln(ax)}{x}$이다.\n몫의 미분법으로 다시 미분하면 $y''=\\frac{2(1-\\ln(ax))}{x^2}$이다.\n$y''=0$에서 $\\ln(ax)=1$, 즉 $x=\\frac{e}{a}$이고 이 점에서 $y''$의 부호가 양에서 음으로 바뀌므로 변곡점이다.\n변곡점의 $y$좌표는 $(\\ln e)^2=1$이다.\n변곡점 $\\left(\\frac{e}{a},1\\right)$이 $y=4x-1$ 위에 있으므로 $1=4\\cdot\\frac{e}{a}-1$이다.\n이를 정리하면 $\\frac{4e}{a}=2$, 즉 $a=2e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "자연수 $n\\ge2$에 대하여 곡선 $y=(\\cos x)^{2n}$ ($0<x<\\pi/2$)의 변곡점의 $y$좌표를 $a_n$이라 할 때, $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$e^{-2}$",
      "$e^{-1/2}$",
      "$e^{-1/3}$",
      "$1$",
      "$e$"
    ],
    "answer": "②",
    "solution": "합성함수와 곱의 미분법으로 $y'=2n(\\cos x)^{2n-1}\\cdot(-\\sin x)=-2n\\cos^{2n-1}x\\sin x$이다.\n다시 미분하면 $y''=-2n\\left[-(2n-1)\\cos^{2n-2}x\\sin^2x+\\cos^{2n}x\\right]$이다.\n이를 묶으면 $y''=2n\\cos^{2n-2}x\\left[(2n-1)\\sin^2x-\\cos^2x\\right]$이다.\n$\\cos^2x=1-\\sin^2x$를 대입하면 $y''=2n\\cos^{2n-2}x(2n\\sin^2x-1)$이다.\n$0<x<\\frac{\\pi}{2}$에서 $\\cos x>0$이므로 $y''$의 부호는 $\\sin^2x=\\frac{1}{2n}$인 점에서 바뀌고, 그 점이 변곡점이다.\n변곡점에서 $\\cos^2x=1-\\frac{1}{2n}$이므로 $a_n=\\left(1-\\frac{1}{2n}\\right)^n$이다.\n$\\left(1-\\frac{1}{2n}\\right)^n=\\left[\\left(1-\\frac{1}{2n}\\right)^{2n}\\right]^{1/2}$이고, 지수함수의 극한 성질로 괄호 안은 $e^{-1}$에 수렴한다.\n따라서 $\\lim_{n\\to\\infty}a_n=(e^{-1})^{1/2}=e^{-1/2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$f(x)=2\\ln(1+x^2)$에 대하여 옳은 것을 모두 고르시오.\nㄱ. $f'$는 짝함수이다.\nㄴ. $(-1,1)$에서 곡선은 아래로 볼록하다.\nㄷ. 두 변곡점에서의 접선은 서로 수직이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법으로 $f'(x)=2\\cdot\\frac{2x}{1+x^2}=\\frac{4x}{1+x^2}$이다.\n$f'(-x)=\\frac{-4x}{1+x^2}=-f'(x)$이므로 $f'$는 홀함수이고, ㄱ은 옳지 않다.\n몫의 미분법으로 $f''(x)=\\frac{4(1+x^2)-4x\\cdot 2x}{(1+x^2)^2}=\\frac{4(1-x^2)}{(1+x^2)^2}$이다.\n$|x|<1$일 때 $1-x^2>0$이므로 $f''(x)>0$이고, 곡선은 아래로 볼록하다. 따라서 ㄴ은 옳다.\n$f''$의 부호가 바뀌는 점은 $x=\\pm1$이고, 두 변곡점에서의 접선의 기울기는 각각 $f'(-1)=-2$, $f'(1)=2$이다.\n두 기울기의 곱은 $(-2)\\cdot2=-4\\ne-1$이므로 두 접선은 수직이 아니다. 따라서 ㄷ은 옳지 않다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "곡선 $y=x(\\ln(2x))^2$의 극소점을 A라 하자. 변곡점에서의 접선이 $x$축, $y$축과 만나는 점을 각각 B, C라 할 때, 삼각형 ABC의 넓이는?",
    "choices": [
      "$\\frac{e-2}{20e^2}$",
      "$\\frac{e-2}{16e^2}$",
      "$\\frac{e-2}{12e^2}$",
      "$\\frac{e-2}{8e^2}$",
      "$\\frac{e-2}{4e^2}$"
    ],
    "answer": "⑤",
    "solution": "$L=\\ln(2x)$로 놓으면 $L'=\\frac{1}{x}$이고, 곱의 미분법으로 $y'=L^2+x\\cdot 2L\\cdot\\frac{1}{x}=L^2+2L=L(L+2)$이다.\n$y'=0$인 점은 $L=0$ 또는 $L=-2$이다.\n$y'$의 부호는 $L<-2$에서 양, $-2<L<0$에서 음, $L>0$에서 양이므로 $L=0$일 때 극소이고 $A=\\left(\\frac{1}{2},0\\right)$이다.\n$y''=\\frac{d}{dx}(L^2+2L)=(2L+2)\\cdot\\frac{1}{x}=\\frac{2(L+1)}{x}$이다.\n$y''=0$이면 $L=-1$이고 그 좌우에서 $y''$의 부호가 바뀌므로 변곡점의 $x$좌표는 $x=\\frac{1}{2e}$이다.\n이 점의 $y$좌표는 $y=\\frac{1}{2e}\\cdot(-1)^2=\\frac{1}{2e}$이다.\n변곡점에서 접선의 기울기는 $y'=(-1)(-1+2)=-1$이다.\n접선의 방정식은 $y-\\frac{1}{2e}=-1\\left(x-\\frac{1}{2e}\\right)$이므로 $y=-x+\\frac{1}{e}$이다.\n$y=0$일 때 $x=\\frac{1}{e}$, $x=0$일 때 $y=\\frac{1}{e}$이므로 B$\\left(\\frac{1}{e},0\\right)$, C$\\left(0,\\frac{1}{e}\\right)$이다.\n삼각형 ABC의 밑변 AB의 길이는 $\\frac{1}{2}-\\frac{1}{e}=\\frac{e-2}{2e}$이고 높이는 $\\frac{1}{e}$이다.\n넓이는 $\\frac{1}{2}\\cdot\\frac{e-2}{2e}\\cdot\\frac{1}{e}=\\frac{e-2}{4e^2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
