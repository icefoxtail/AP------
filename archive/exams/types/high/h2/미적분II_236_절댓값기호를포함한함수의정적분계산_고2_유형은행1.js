window.examTitle = "미적분II_236_절댓값기호를포함한함수의정적분계산_고2_유형은행1";

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
    "content": "정적분 $\\int_0^{\\frac{5}{4}\\pi} |\\sin 2x|\\,dx$의 값은?",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "④",
    "solution": "절댓값 안이 $0$이 되는 $x$를 찾아 적분 구간을 나눈다.\n$\\sin 2x = 0$에서 $2x = 0, \\pi, 2\\pi, \\dots$이므로 구간 $\\left[0, \\frac{5}{4}\\pi\\right]$의 경계는 $x = 0, \\frac{\\pi}{2}, \\pi$이다.\n(i) $\\left[0, \\frac{\\pi}{2}\\right]$에서 $\\sin 2x \\ge 0$이므로 $|\\sin 2x| = \\sin 2x$이고, $\\int_0^{\\frac{\\pi}{2}} \\sin 2x\\,dx = \\left[-\\frac{1}{2}\\cos 2x\\right]_0^{\\frac{\\pi}{2}} = -\\frac{1}{2}(\\cos\\pi - \\cos 0) = -\\frac{1}{2}(-1-1) = 1$이다.\n(ii) $\\left[\\frac{\\pi}{2}, \\pi\\right]$에서 $\\sin 2x \\le 0$이므로 $|\\sin 2x| = -\\sin 2x$이고, $\\int_{\\frac{\\pi}{2}}^{\\pi} (-\\sin 2x)\\,dx = \\left[\\frac{1}{2}\\cos 2x\\right]_{\\frac{\\pi}{2}}^{\\pi} = \\frac{1}{2}(\\cos 2\\pi - \\cos \\pi) = \\frac{1}{2}(1-(-1)) = 1$이다.\n(iii) $\\left[\\pi, \\frac{5}{4}\\pi\\right]$에서 $\\sin 2x \\ge 0$이므로 $|\\sin 2x| = \\sin 2x$이고, $\\int_{\\pi}^{\\frac{5}{4}\\pi} \\sin 2x\\,dx = \\left[-\\frac{1}{2}\\cos 2x\\right]_{\\pi}^{\\frac{5}{4}\\pi} = -\\frac{1}{2}\\left(\\cos\\frac{5}{2}\\pi - \\cos 2\\pi\\right) = -\\frac{1}{2}(0-1) = \\frac{1}{2}$이다.\n각 구간의 값을 더하면 $\\int_0^{\\frac{5}{4}\\pi} |\\sin 2x|\\,dx = 1 + 1 + \\frac{1}{2} = \\frac{5}{2}$이다.\n주의: $|\\sin 2x|$의 주기는 $\\frac{\\pi}{2}$이므로 $\\frac{5}{4}\\pi$가 주기 $\\frac{5}{2}$개임을 이용해 $\\frac{5}{2}\\times 1 = \\frac{5}{2}$로 검산할 수 있다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "자연수 $n$에 대하여\n$$a_n = \\int_0^{n\\pi} |\\cos x|\\,dx$$\n일 때, $\\sum_{n=1}^{10} (a_n)^2$의 값은?",
    "choices": [
      "$1320$",
      "$1430$",
      "$1540$",
      "$1650$",
      "$1760$"
    ],
    "answer": "③",
    "solution": "$|\\cos x|$의 주기성을 확인한다.\n$|\\cos(x+\\pi)| = |-\\cos x| = |\\cos x|$이므로 $|\\cos x|$는 주기가 $\\pi$인 주기함수이다.\n한 주기 $[0, \\pi]$에서의 적분값을 계산한다.\n$\\int_0^{\\pi} |\\cos x|\\,dx = \\int_0^{\\frac{\\pi}{2}} \\cos x\\,dx + \\int_{\\frac{\\pi}{2}}^{\\pi} (-\\cos x)\\,dx = [\\sin x]_0^{\\frac{\\pi}{2}} + [-\\sin x]_{\\frac{\\pi}{2}}^{\\pi} = (1-0) + (0-(-1)) = 2$.\n주기함수의 정적분 성질에 의해 $a_n = \\int_0^{n\\pi} |\\cos x|\\,dx = n\\int_0^{\\pi} |\\cos x|\\,dx = 2n$이다.\n구하는 합은 $\\sum_{n=1}^{10} (a_n)^2 = \\sum_{n=1}^{10} (2n)^2 = 4\\sum_{n=1}^{10} n^2$이다.\n자연수의 거듭제곱의 합 $\\sum_{k=1}^{m} k^2 = \\frac{m(m+1)(2m+1)}{6}$을 적용하면 $4\\cdot\\frac{10\\cdot 11\\cdot 21}{6} = 4\\cdot 385 = 1540$이다.\n주의: $(a_n)^2 = 4n^2$이므로 $n^2$의 계수 $4$를 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
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
    "content": "정적분 $\\int_0^\\pi |\\sin x - \\cos x|\\,dx$의 값은?",
    "choices": [
      "$2\\sqrt{2} - 2$",
      "$\\sqrt{2}$",
      "$2\\sqrt{2} - 1$",
      "$\\sqrt{2} + 1$",
      "$2\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "절댓값 안이 $0$이 되는 $x$를 찾아 적분 구간을 나눈다.\n$\\sin x = \\cos x$에서 $\\tan x = 1$이므로 $[0, \\pi]$에서 해는 $x = \\frac{\\pi}{4}$이다.\n(i) $\\left[0, \\frac{\\pi}{4}\\right]$에서 $\\cos x \\ge \\sin x$이므로 $\\int_0^{\\frac{\\pi}{4}} (\\cos x - \\sin x)\\,dx = [\\sin x + \\cos x]_0^{\\frac{\\pi}{4}} = \\left(\\frac{\\sqrt{2}}{2}+\\frac{\\sqrt{2}}{2}\\right) - (0+1) = \\sqrt{2} - 1$이다.\n(ii) $\\left[\\frac{\\pi}{4}, \\pi\\right]$에서 $\\sin x \\ge \\cos x$이므로 $\\int_{\\frac{\\pi}{4}}^{\\pi} (\\sin x - \\cos x)\\,dx = [-\\cos x - \\sin x]_{\\frac{\\pi}{4}}^{\\pi} = (1-0) - \\left(-\\frac{\\sqrt{2}}{2}-\\frac{\\sqrt{2}}{2}\\right) = 1+\\sqrt{2}$이다.\n두 값을 더하면 $\\int_0^{\\pi} |\\sin x - \\cos x|\\,dx = (\\sqrt{2}-1) + (1+\\sqrt{2}) = 2\\sqrt{2}$이다.\n주의: $\\left[\\frac{\\pi}{4}, \\pi\\right]$ 전체에서 $\\sin x - \\cos x \\ge 0$이 유지되므로 구간을 더 나눌 필요가 없다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "정적분 $\\int_{-1}^2 |e^x - 1|\\,dx$의 값은?",
    "choices": [
      "$e^2 - \\frac{1}{e} - 5$",
      "$e^2 + \\frac{1}{e} - 5$",
      "$e^2 - \\frac{1}{e} - 4$",
      "$e^2 + \\frac{1}{e} - 4$",
      "$e^2 + \\frac{1}{e} - 3$"
    ],
    "answer": "⑤",
    "solution": "절댓값 안이 $0$이 되는 $x$를 찾는다.\n$e^x - 1 = 0 \\iff x = 0$이므로 적분 구간을 $[-1, 0]$과 $[0, 2]$로 나눈다.\n(i) $[-1, 0]$에서 $e^x \\le 1$이므로 $|e^x - 1| = 1 - e^x$이고, $\\int_{-1}^0 (1-e^x)\\,dx = [x - e^x]_{-1}^0 = (0-1) - (-1-e^{-1}) = -1+1+\\frac{1}{e} = \\frac{1}{e}$이다.\n(ii) $[0, 2]$에서 $e^x \\ge 1$이므로 $|e^x - 1| = e^x - 1$이고, $\\int_0^2 (e^x-1)\\,dx = [e^x - x]_0^2 = (e^2-2) - (e^0-0) = e^2 - 3$이다.\n두 값을 더하면 $\\int_{-1}^2 |e^x - 1|\\,dx = \\frac{1}{e} + e^2 - 3 = e^2 + \\frac{1}{e} - 3$이다.\n주의: $x = 0$을 대입할 때 $e^0 = 1$이므로 위끝 값은 $0 - 1 = -1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "정적분 $\\int_e^{e^3} |\\ln x - 2|\\,dx$의 값은?",
    "choices": [
      "$e^2 - e$",
      "$2e^2 - 3e$",
      "$2e^2 - 2e$",
      "$2e^2 - e$",
      "$3e^2 - 3e$"
    ],
    "answer": "③",
    "solution": "절댓값 안이 $0$이 되는 $x$를 찾는다.\n$\\ln x = 2 \\iff x = e^2$이므로 적분 구간을 $[e, e^2]$과 $[e^2, e^3]$으로 나눈다.\n부분적분법에 의한 로그함수의 부정적분 $\\int \\ln x\\,dx = x\\ln x - x + C$를 이용한다.\n(i) $[e, e^2]$에서 $\\ln x \\le 2$이므로 $|\\ln x - 2| = 2 - \\ln x$이고, $\\int (2-\\ln x)\\,dx = 2x - (x\\ln x - x) = 3x - x\\ln x$이다.\n$\\int_e^{e^2} (2-\\ln x)\\,dx = [3x - x\\ln x]_e^{e^2} = (3e^2 - e^2\\ln e^2) - (3e - e\\ln e) = (3e^2 - 2e^2) - (3e - e) = e^2 - 2e$이다.\n(ii) $[e^2, e^3]$에서 $\\ln x \\ge 2$이므로 $|\\ln x - 2| = \\ln x - 2$이고, $\\int (\\ln x - 2)\\,dx = (x\\ln x - x) - 2x = x\\ln x - 3x$이다.\n$\\int_{e^2}^{e^3} (\\ln x - 2)\\,dx = [x\\ln x - 3x]_{e^2}^{e^3} = (e^3\\ln e^3 - 3e^3) - (e^2\\ln e^2 - 3e^2) = (3e^3 - 3e^3) - (2e^2 - 3e^2) = 0 - (-e^2) = e^2$이다.\n두 값을 더하면 $\\int_e^{e^3} |\\ln x - 2|\\,dx = (e^2 - 2e) + e^2 = 2e^2 - 2e$이다.\n주의: $\\ln(e^2) = 2$, $\\ln(e^3) = 3$을 대입하여 $x\\ln x$의 값을 정확히 계산한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$0 \\le a \\le \\frac{1}{2}$인 실수 $a$에 대하여 정적분\n$$\\int_0^{\\frac{1}{2}} |e^x - e^a|\\,dx$$\n의 값을 $f(a)$라고 하자. $f(a)$가 최소가 되도록 하는 $a$의 값은?",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{3}{8}$",
      "$\\frac{1}{2}$"
    ],
    "answer": "②",
    "solution": "$e^x$는 증가함수이므로 $x = a$를 기준으로 절댓값 기호를 없앤다.\n(i) $0 \\le x \\le a$에서 $e^x \\le e^a$이므로 $|e^x - e^a| = e^a - e^x$이다.\n(ii) $a \\le x \\le \\frac{1}{2}$에서 $e^x \\ge e^a$이므로 $|e^x - e^a| = e^x - e^a$이다.\n따라서 $f(a) = \\int_0^a (e^a - e^x)\\,dx + \\int_a^{\\frac{1}{2}} (e^x - e^a)\\,dx$이다.\n첫째 적분은 $[e^a x - e^x]_0^a = (a e^a - e^a) - (0-1) = a e^a - e^a + 1$이다.\n둘째 적분은 $[e^x - e^a x]_a^{\\frac{1}{2}} = \\left(\\sqrt{e} - \\frac{1}{2}e^a\\right) - (e^a - a e^a) = \\sqrt{e} + a e^a - \\frac{3}{2}e^a$이다.\n두 결과를 더하면 $f(a) = 2a e^a - \\frac{5}{2}e^a + \\sqrt{e} + 1$이다.\n곱의 미분법으로 미분하면 $f'(a) = (2e^a + 2a e^a) - \\frac{5}{2}e^a = \\left(2a - \\frac{1}{2}\\right)e^a$이다.\n$e^a > 0$이므로 $f'(a) = 0 \\iff 2a - \\frac{1}{2} = 0 \\iff a = \\frac{1}{4}$이다.\n$0 \\le a < \\frac{1}{4}$에서 $f'(a) < 0$이고 $\\frac{1}{4} < a \\le \\frac{1}{2}$에서 $f'(a) > 0$이므로 $f(a)$는 $a = \\frac{1}{4}$에서 최소이다.\n주의: 적분 변수는 $x$이므로 $e^a$는 상수로 적분하고, $a$에 대해서는 곱의 미분법을 적용한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
