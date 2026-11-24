window.examTitle = "미적분II_246_다항함수×삼각함수정적분의부분적분법_고2_유형은행1";

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
    "content": "정적분 $\\displaystyle \\int_0^{\\frac{\\pi}{2}} x \\sin 2x \\,dx$의 값은?",
    "choices": [
      "$\\frac{\\pi}{6}$",
      "$\\frac{\\pi}{4}$",
      "$\\frac{\\pi}{3}$",
      "$\\frac{\\pi}{2}$",
      "$\\frac{2}{3}\\pi$"
    ],
    "answer": "②",
    "solution": "부분적분법 $\\int f(x)g'(x)\\,dx=f(x)g(x)-\\int f'(x)g(x)\\,dx$을 쓰기 위해 $f(x)=x$, $g'(x)=\\sin 2x$로 둔다.\n$f'(x)=1$, $g(x)=-\\frac{1}{2}\\cos 2x$이므로 주어진 정적분은 $$\\int_0^{\\frac{\\pi}{2}}x\\sin 2x\\,dx=\\left[-\\frac{x}{2}\\cos 2x\\right]_0^{\\frac{\\pi}{2}}+\\frac{1}{2}\\int_0^{\\frac{\\pi}{2}}\\cos 2x\\,dx$$이다.\n첫째 항은 $$\\left[-\\frac{x}{2}\\cos 2x\\right]_0^{\\frac{\\pi}{2}}=-\\frac{\\pi}{4}\\cos\\pi+0=\\frac{\\pi}{4}$$이다.\n둘째 항은 $$\\frac{1}{2}\\int_0^{\\frac{\\pi}{2}}\\cos 2x\\,dx=\\frac{1}{4}\\left[\\sin 2x\\right]_0^{\\frac{\\pi}{2}}=\\frac{1}{4}(0-0)=0$$이다.\n두 값을 더하면 $\\frac{\\pi}{4}+0=\\frac{\\pi}{4}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
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
    "content": "정적분 $\\displaystyle \\int_0^{\\frac{\\pi}{2}} (2x+1)\\cos x \\,dx$의 값은?",
    "choices": [
      "$\\pi - 2$",
      "$\\pi - 1$",
      "$\\pi$",
      "$\\pi + 1$",
      "$\\pi + 2$"
    ],
    "answer": "②",
    "solution": "부분적분법을 적용하기 위해 $f(x)=2x+1$, $g'(x)=\\cos x$로 둔다.\n$f'(x)=2$, $g(x)=\\sin x$이므로 $$\\int_0^{\\frac{\\pi}{2}}(2x+1)\\cos x\\,dx=\\left[(2x+1)\\sin x\\right]_0^{\\frac{\\pi}{2}}-\\int_0^{\\frac{\\pi}{2}}2\\sin x\\,dx$$이다.\n첫째 항은 $$\\left[(2x+1)\\sin x\\right]_0^{\\frac{\\pi}{2}}=(\\pi+1)\\cdot1-1\\cdot0=\\pi+1$$이다.\n둘째 항은 $$\\int_0^{\\frac{\\pi}{2}}2\\sin x\\,dx=\\left[-2\\cos x\\right]_0^{\\frac{\\pi}{2}}=0-(-2)=2$$이다.\n따라서 정적분의 값은 $(\\pi+1)-2=\\pi-1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
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
    "content": "$\\displaystyle \\int_0^{\\frac{\\pi}{2k}} x \\sin kx \\,dx = \\frac{1}{25}$을 만족시키는 양수 $k$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "$f(x)=x$, $g'(x)=\\sin kx$로 두고 부분적분법을 적용한다.\n$f'(x)=1$, $g(x)=-\\frac{1}{k}\\cos kx$이므로 $$\\int_0^{\\frac{\\pi}{2k}}x\\sin kx\\,dx=\\left[-\\frac{x}{k}\\cos kx\\right]_0^{\\frac{\\pi}{2k}}+\\frac{1}{k}\\int_0^{\\frac{\\pi}{2k}}\\cos kx\\,dx$$이다.\n첫째 항은 $\\cos\\frac{\\pi}{2}=0$이므로 $$\\left[-\\frac{x}{k}\\cos kx\\right]_0^{\\frac{\\pi}{2k}}=-\\frac{\\pi}{2k^2}\\cdot0-0=0$$이다.\n둘째 항은 $$\\frac{1}{k}\\int_0^{\\frac{\\pi}{2k}}\\cos kx\\,dx=\\frac{1}{k^2}\\left[\\sin kx\\right]_0^{\\frac{\\pi}{2k}}=\\frac{1}{k^2}(1-0)=\\frac{1}{k^2}$$이다.\n따라서 주어진 정적분의 값은 $\\frac{1}{k^2}$이다.\n조건에서 $\\frac{1}{k^2}=\\frac{1}{25}$이므로 $k^2=25$이다.\n주의: $k^2=25$에서 $k=\\pm5$이지만 $k>0$이므로 $k=5$만 택한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
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
    "content": "정적분 $\\displaystyle \\int_0^{\\pi} x^2 \\sin x \\,dx$의 값은?",
    "choices": [
      "$\\pi^2 - 8$",
      "$\\pi^2 - 6$",
      "$\\pi^2 - 5$",
      "$\\pi^2 - 4$",
      "$\\pi^2 - 2$"
    ],
    "answer": "④",
    "solution": "$f(x)=x^2$, $g'(x)=\\sin x$로 두고 부분적분법을 적용한다.\n$f'(x)=2x$, $g(x)=-\\cos x$이므로 $$I=\\int_0^{\\pi}x^2\\sin x\\,dx=\\left[-x^2\\cos x\\right]_0^{\\pi}+2\\int_0^{\\pi}x\\cos x\\,dx$$이다.\n첫째 항은 $$\\left[-x^2\\cos x\\right]_0^{\\pi}=-\\pi^2\\cos\\pi-0=\\pi^2$$이다.\n남은 적분 $J=\\int_0^{\\pi}x\\cos x\\,dx$에 다시 부분적분법을 적용한다.\n$u=x$, $v'=\\cos x$로 두면 $u'=1$, $v=\\sin x$이므로 $$J=\\left[x\\sin x\\right]_0^{\\pi}-\\int_0^{\\pi}\\sin x\\,dx$$이다.\n경계값은 $\\left[x\\sin x\\right]_0^{\\pi}=\\pi\\sin\\pi-0=0$이다.\n한편 $\\int_0^{\\pi}\\sin x\\,dx=\\left[-\\cos x\\right]_0^{\\pi}=-\\cos\\pi+\\cos0=1+1=2$이다.\n따라서 $J=0-2=-2$이다.\n$I$에 $J$의 값을 대입하면 $I=\\pi^2+2(-2)=\\pi^2-4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\displaystyle \\int_0^{\\pi} \\frac{3x^3}{x+\\cos x} \\,dx - \\int_0^{\\pi} \\frac{3x\\cos^2 x}{x+\\cos x} \\,dx$의 값은?",
    "choices": [
      "$\\pi^3 + 6$",
      "$\\pi^3 + 8$",
      "$\\pi^3 + 10$",
      "$\\pi^3 + 12$",
      "$\\pi^3 + 14$"
    ],
    "answer": "①",
    "solution": "두 정적분의 적분 구간이 $[0,\\pi]$로 같으므로 정적분의 성질에 의해 하나로 합친다. $$\\int_0^{\\pi}\\frac{3x^3-3x\\cos^2x}{x+\\cos x}\\,dx$$\n분자를 $3x$로 묶고 인수분해 $a^2-b^2=(a-b)(a+b)$를 적용하면 $$3x^3-3x\\cos^2x=3x(x^2-\\cos^2x)=3x(x-\\cos x)(x+\\cos x)$$이다.\n$0\\le x\\le\\pi$에서 $x+\\cos x>0$이므로 분모와 분자의 $x+\\cos x$를 약분할 수 있다. $$\\frac{3x(x-\\cos x)(x+\\cos x)}{x+\\cos x}=3x(x-\\cos x)=3x^2-3x\\cos x$$\n따라서 주어진 식은 $\\int_0^{\\pi}(3x^2-3x\\cos x)\\,dx$이다.\n$\\int_0^{\\pi}3x^2\\,dx=\\left[x^3\\right]_0^{\\pi}=\\pi^3$이다.\n$\\int_0^{\\pi}x\\cos x\\,dx$에는 부분적분법을 적용한다.\n$f(x)=x$, $g'(x)=\\cos x$로 두면 $f'(x)=1$, $g(x)=\\sin x$이므로 $$\\int_0^{\\pi}x\\cos x\\,dx=\\left[x\\sin x\\right]_0^{\\pi}-\\int_0^{\\pi}\\sin x\\,dx$$이다.\n$\\left[x\\sin x\\right]_0^{\\pi}=\\pi\\sin\\pi-0=0$이고 $\\int_0^{\\pi}\\sin x\\,dx=\\left[-\\cos x\\right]_0^{\\pi}=1+1=2$이다.\n따라서 $\\int_0^{\\pi}x\\cos x\\,dx=0-2=-2$이다.\n구한 값을 대입하면 $$\\int_0^{\\pi}(3x^2-3x\\cos x)\\,dx=\\pi^3-3(-2)=\\pi^3+6$$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
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
    "content": "정적분 $\\displaystyle \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} x \\csc^2 x \\,dx$의 값은?",
    "choices": [
      "$\\frac{\\pi}{4} - \\ln 2$",
      "$\\frac{\\pi}{4} - \\frac{1}{2}\\ln 2$",
      "$\\frac{\\pi}{4}$",
      "$\\frac{\\pi}{4} + \\frac{1}{2}\\ln 2$",
      "$\\frac{\\pi}{4} + \\ln 2$"
    ],
    "answer": "④",
    "solution": "$\\csc^2x$의 부정적분이 $-\\cot x$임을 이용하여 부분적분법을 적용한다.\n$f(x)=x$, $g'(x)=\\csc^2x$로 두면 $f'(x)=1$, $g(x)=-\\cot x$이므로 $$\\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}x\\csc^2x\\,dx=\\left[-x\\cot x\\right]_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}+\\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}\\cot x\\,dx$$이다.\n첫째 항은 $\\cot\\frac{\\pi}{2}=0$, $\\cot\\frac{\\pi}{4}=1$이므로 $$\\left[-x\\cot x\\right]_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}=-\\frac{\\pi}{2}\\cdot0-\\left(-\\frac{\\pi}{4}\\cdot1\\right)=\\frac{\\pi}{4}$$이다.\n둘째 항은 $\\cot x=\\frac{\\cos x}{\\sin x}$로 바꾸고 치환적분법을 적용하면 $$\\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}\\cot x\\,dx=\\left[\\ln|\\sin x|\\right]_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}$$이다.\n위끝과 아래끝을 대입하면 $$\\left[\\ln|\\sin x|\\right]_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}=\\ln1-\\ln\\frac{\\sqrt2}{2}=0-\\left(-\\frac{1}{2}\\ln2\\right)=\\frac{1}{2}\\ln2$$이다.\n두 값을 더하면 $$\\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}}x\\csc^2x\\,dx=\\frac{\\pi}{4}+\\frac{1}{2}\\ln2$$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
