window.examTitle = "미적분II_263_역함수와정적분의급수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "닫힌구간 $[0, 2]$에서 정의된 연속함수 $f(x)$가 $f(0)=0, f(2)=2$이며 열린구간 $(0, 2)$에서 이계도함수를 갖고 $f'(x)>0, f''(x)>0$일 때, $\\int_0^2 \\{f^{-1}(x)-f(x)\\}dx$의 값과 같은 것은? (단, $f^{-1}(x)$는 $f(x)$의 역함수이다.)",
    "choices": [
      "① $\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ \\frac{2k}{n} - f\\left(\\frac{2k}{n}\\right) \\right\\} \\frac{1}{2n}$",
      "② $\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ \\frac{2k}{n} - f\\left(\\frac{2k}{n}\\right) \\right\\} \\frac{1}{n}$",
      "③ $\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ \\frac{2k}{n} - f\\left(\\frac{2k}{n}\\right) \\right\\} \\frac{2}{n}$",
      "④ $\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ \\frac{2k}{n} - f\\left(\\frac{2k}{n}\\right) \\right\\} \\frac{3}{n}$",
      "⑤ $\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ \\frac{2k}{n} - f\\left(\\frac{2k}{n}\\right) \\right\\} \\frac{4}{n}$"
    ],
    "answer": "⑤",
    "solution": "[역함수의 존재] $f'(x)>0$이므로 $f$는 증가함수이고 역함수 $f^{-1}$가 존재한다.\n[역함수 정적분 공식] 증가함수 $f$에 대하여 $\\int_0^2 f(x)dx+\\int_{f(0)}^{f(2)} f^{-1}(x)dx=2f(2)-0\\cdot f(0)$이다.\n[조건 대입] $f(0)=0, f(2)=2$이므로 $\\int_0^2 f(x)dx+\\int_0^2 f^{-1}(x)dx=2\\cdot 2-0=4$이다.\n[구하는 식 정리] 따라서 $\\int_0^2 \\{f^{-1}(x)-f(x)\\}dx=\\left(4-\\int_0^2 f(x)dx\\right)-\\int_0^2 f(x)dx=4-2\\int_0^2 f(x)dx$이다.\n[다른 꼴로 변형] $\\int_0^2 x\\,dx=\\left[\\frac{x^2}{2}\\right]_0^2=2$이므로 $4-2\\int_0^2 f(x)dx=2\\left(2-\\int_0^2 f(x)dx\\right)=2\\int_0^2 \\{x-f(x)\\}dx$이다.\n[정적분과 급수의 합] $[0,2]$를 $n$등분하면 $\\Delta x=\\frac{2}{n}$, $x_k=\\frac{2k}{n}$이므로 $\\int_0^2 \\{x-f(x)\\}dx=\\lim_{n\\to\\infty}\\sum_{k=1}^n \\left\\{\\frac{2k}{n}-f\\left(\\frac{2k}{n}\\right)\\right\\}\\frac{2}{n}$이다.\n[계수 정리] 바깥의 2를 합 안으로 넣으면 $2\\cdot\\frac{2}{n}=\\frac{4}{n}$이므로 구하는 값은 $\\lim_{n\\to\\infty}\\sum_{k=1}^n \\left\\{\\frac{2k}{n}-f\\left(\\frac{2k}{n}\\right)\\right\\}\\frac{4}{n}$이다.\n주의: 적분 구간의 길이가 2이므로 $\\Delta x=\\frac{2}{n}$이고, 여기에 2배를 하여 계수가 $\\frac{4}{n}$이 된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-191",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY",
      "CC_INVERSE_FUNCTION_EXISTENCE_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f(x)$가 다음 조건을 만족시킨다.\n(가) 모든 실수 $x$에 대하여 $f'(x)>0, f''(x)>0$이다.\n(나) $f(2)=2, f(6)=6$\n\n$\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ f\\left(2+\\frac{4k}{n}\\right) + f^{-1}\\left(2+\\frac{4k}{n}\\right) \\right\\} \\frac{4}{n}$의 값은? (단, $f^{-1}(x)$는 $f(x)$의 역함수이다.)",
    "choices": [
      "① 24",
      "② 28",
      "③ 32",
      "④ 36",
      "⑤ 40"
    ],
    "answer": "③",
    "solution": "[정적분과 급수의 합] $\\lim_{n\\to\\infty}\\sum_{k=1}^n g\\left(2+\\frac{4k}{n}\\right)\\frac{4}{n}=\\int_2^6 g(x)dx$이다.\n[함수 대입] $g(x)=f(x)+f^{-1}(x)$이므로 주어진 극한은 $\\int_2^6 \\{f(x)+f^{-1}(x)\\}dx$이다.\n[적분의 분리] $=\\int_2^6 f(x)dx+\\int_2^6 f^{-1}(x)dx$이다.\n[역함수 정적분 공식] $\\int_a^b f(x)dx+\\int_{f(a)}^{f(b)} f^{-1}(x)dx=bf(b)-af(a)$이다.\n[조건 대입] $a=2, b=6$, $f(2)=2$, $f(6)=6$이므로 $\\int_2^6 f(x)dx+\\int_2^6 f^{-1}(x)dx=6\\cdot 6-2\\cdot 2$이다.\n[계산] $36-4=32$이다.\n주의: $f^{-1}$의 적분 구간은 $[f(2),f(6)]=[2,6]$이 되어 원래 구간과 같아진다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-191",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY",
      "CC_INVERSE_FUNCTION_EXISTENCE_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 다음 조건을 만족시킨다.\n(가) 모든 실수 $x$에 대하여 $f'(x)>0, f''(x)>0$이다.\n(나) $f(1)=1, f(3)=3$\n(다) $\\lim_{n\\to\\infty} \\sum_{k=1}^n f^{-1}\\left(1+\\frac{2k}{n}\\right) \\cdot \\frac{4}{n} = 10$\n\n$\\int_1^3 \\{x-f(x)\\}dx$의 값은? (단, $f^{-1}(x)$는 $f(x)$의 역함수이다.)",
    "choices": [
      "① 1",
      "② 2",
      "③ 3",
      "④ 4",
      "⑤ 5"
    ],
    "answer": "①",
    "solution": "[급수식 변형] $\\frac{4}{n}=2\\cdot\\frac{2}{n}$이므로 $\\lim_{n\\to\\infty}\\sum_{k=1}^n f^{-1}\\left(1+\\frac{2k}{n}\\right)\\frac{4}{n}=2\\lim_{n\\to\\infty}\\sum_{k=1}^n f^{-1}\\left(1+\\frac{2k}{n}\\right)\\frac{2}{n}$이다.\n[정적분과 급수의 합] $\\Delta x=\\frac{2}{n}$, $x_k=1+\\frac{2k}{n}$이므로 $\\lim_{n\\to\\infty}\\sum_{k=1}^n f^{-1}\\left(1+\\frac{2k}{n}\\right)\\frac{2}{n}=\\int_1^3 f^{-1}(x)dx$이다.\n[조건 (다) 적용] $2\\int_1^3 f^{-1}(x)dx=10$에서 $\\int_1^3 f^{-1}(x)dx=5$이다.\n[역함수 정적분 공식] $\\int_1^3 f(x)dx+\\int_{f(1)}^{f(3)} f^{-1}(x)dx=3f(3)-1\\cdot f(1)$이다.\n[조건 (나) 대입] $f(1)=1$, $f(3)=3$이므로 우변은 $3\\cdot 3-1\\cdot 1=8$이다.\n[원함수의 적분] $\\int_1^3 f(x)dx=8-5=3$이다.\n[구하는 식 분리] $\\int_1^3 \\{x-f(x)\\}dx=\\int_1^3 x\\,dx-\\int_1^3 f(x)dx$이다.\n[계산] $\\int_1^3 x\\,dx=\\left[\\frac{x^2}{2}\\right]_1^3=\\frac{9}{2}-\\frac{1}{2}=4$이므로 $4-3=1$이다.\n주의: 계수 $\\frac{4}{n}$을 $2\\cdot\\frac{2}{n}$으로 나누어 구간 길이 2와 맞춘 뒤 적분으로 바꾼다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-191",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY",
      "CC_INVERSE_FUNCTION_EXISTENCE_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
