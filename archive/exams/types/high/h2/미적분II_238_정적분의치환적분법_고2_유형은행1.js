window.examTitle = "미적분II_238_정적분의치환적분법_고2_유형은행1";

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
    "content": "실수 전체의 집합에서 연속인 함수 $f(x)$가\n$$\\int_1^{13} f(x)\\,dx = 36$$\n을 만족시킬 때, $\\displaystyle\\int_{-1}^3 f(3x+4)\\,dx$의 값은?",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "④",
    "solution": "[치환 준비]: $t=3x+4$로 놓으면 $\\dfrac{dt}{dx}=3$이므로 $dx=\\dfrac{1}{3}\\,dt$이다.\n[적분구간 변환]: $x=-1$일 때 $t=3(-1)+4=1$이고, $x=3$일 때 $t=3(3)+4=13$이다.\n[치환적분법 적용]: $\\displaystyle\\int_{-1}^{3} f(3x+4)\\,dx=\\int_{1}^{13} f(t)\\cdot\\dfrac{1}{3}\\,dt=\\dfrac{1}{3}\\int_{1}^{13} f(t)\\,dt$이다.\n[조건 대입]: $\\displaystyle\\int_{1}^{13} f(x)\\,dx=36$이므로 $\\dfrac{1}{3}\\times 36=12$이다.\n주의: $dx=\\dfrac{1}{3}\\,dt$의 상수 $\\dfrac{1}{3}$을 빠뜨리면 $36$이 되어 오답이 된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
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
    "content": "연속함수 $f(x)$에 대하여 다음 중 정적분\n$$\\int_0^a x \\{f(x) + f(a-x)\\}\\,dx$$\n의 값과 항상 같은 것은? (단, $a>0$인 상수이다.)",
    "choices": [
      "\\(\\dfrac{a}{2} \\displaystyle\\int_0^a f(x)\\,dx\\)",
      "\\(a \\displaystyle\\int_0^a f(x)\\,dx\\)",
      "\\(\\dfrac{3a}{2} \\displaystyle\\int_0^a f(x)\\,dx\\)",
      "\\(2a \\displaystyle\\int_0^a f(x)\\,dx\\)",
      "\\(\\dfrac{5a}{2} \\displaystyle\\int_0^a f(x)\\,dx\\)"
    ],
    "answer": "②",
    "solution": "[식 분리]: $\\displaystyle\\int_0^a x\\{f(x)+f(a-x)\\}\\,dx=\\int_0^a xf(x)\\,dx+\\int_0^a xf(a-x)\\,dx$이다.\n[치환 준비]: 둘째 적분에서 $t=a-x$로 놓으면 $dt=-dx$이다.\n[적분구간 변환]: $x=0$일 때 $t=a$이고, $x=a$일 때 $t=0$이다.\n[치환적분법 적용]: $\\displaystyle\\int_0^a xf(a-x)\\,dx=\\int_a^0 (a-t)f(t)(-dt)=\\int_0^a (a-t)f(t)\\,dt$이다.\n[전개]: $\\displaystyle\\int_0^a (a-t)f(t)\\,dt=a\\int_0^a f(t)\\,dt-\\int_0^a tf(t)\\,dt$이다.\n[적분변수 통일]: 적분변수의 이름은 무관하므로 $\\displaystyle\\int_0^a tf(t)\\,dt=\\int_0^a xf(x)\\,dx$이다.\n[합 계산]: $\\displaystyle\\int_0^a xf(x)\\,dx+\\left(a\\int_0^a f(x)\\,dx-\\int_0^a xf(x)\\,dx\\right)=a\\int_0^a f(x)\\,dx$이다.\n주의: 둘째 적분의 치환에서 $dt=-dx$의 음부호와 구간 $[a,0]$의 뒤집힘이 함께 상쇄됨을 확인한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "함수 $f(x) = \\dfrac{1}{\\sqrt{x+1}}$에 대하여 정적분\n$$\\int_0^3 \\{f(x) + f(3-x)\\}\\,dx$$\n의 값은?",
    "choices": [
      "\\(\\dfrac{5}{2}\\)",
      "3",
      "\\(\\dfrac{7}{2}\\)",
      "4",
      "\\(\\dfrac{9}{2}\\)"
    ],
    "answer": "④",
    "solution": "[정적분의 분리]: $\\displaystyle\\int_0^3 \\{f(x)+f(3-x)\\}\\,dx=\\int_0^3 f(x)\\,dx+\\int_0^3 f(3-x)\\,dx$이다.\n[둘째 적분 치환]: $t=3-x$로 놓으면 $dt=-dx$이다.\n[적분구간 변환]: $x=0$일 때 $t=3$이고, $x=3$일 때 $t=0$이다.\n[치환적분법 적용]: $\\displaystyle\\int_0^3 f(3-x)\\,dx=\\int_3^0 f(t)(-dt)=\\int_0^3 f(t)\\,dt$이다.\n[준식 정리]: 구하는 값은 $\\displaystyle 2\\int_0^3 f(x)\\,dx=2\\int_0^3 (x+1)^{-\\frac{1}{2}}\\,dx$이다.\n[부정적분 계산]: $\\displaystyle\\int (x+1)^{-\\frac{1}{2}}\\,dx=2(x+1)^{\\frac{1}{2}}+C=2\\sqrt{x+1}+C$이다.\n[정적분 계산]: $\\displaystyle\\int_0^3 (x+1)^{-\\frac{1}{2}}\\,dx=\\left[2\\sqrt{x+1}\\right]_0^3=2\\sqrt{4}-2\\sqrt{1}=4-2=2$이다.\n[최종값]: 따라서 $2\\times 2=4$이다.\n주의: $f(3-x)$의 적분이 $f(x)$의 적분과 같아져 2배가 되는 대칭성을 이용하면 계산이 간단해진다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
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
    "content": "연속함수 $f(x)$가 다음 조건을 만족시킬 때, 정적분\n$$\\int_0^a \\{3f(2x) + f(2a-x)\\}\\,dx$$\n의 값은? (단, $a$는 양의 상수이다.)\n\n(가) 모든 실수 $x$에 대하여 $f(a-x) = f(a+x)$이다.\n(나) $\\displaystyle\\int_0^a f(x)\\,dx = 5$",
    "choices": [
      "16",
      "20",
      "24",
      "28",
      "32"
    ],
    "answer": "②",
    "solution": "[대칭성 확인]: 조건 (가) $f(a-x)=f(a+x)$는 그래프가 직선 $x=a$에 대하여 대칭임을 뜻한다.\n[대칭 구간 적분]: 따라서 $\\displaystyle\\int_a^{2a} f(x)\\,dx=\\int_0^a f(x)\\,dx=5$이므로 $\\displaystyle\\int_0^{2a} f(x)\\,dx=5+5=10$이다.\n[첫째 항 치환]: $t=2x$로 놓으면 $dt=2\\,dx$, $dx=\\dfrac{1}{2}\\,dt$이고 $x=0\\to t=0$, $x=a\\to t=2a$이다.\n[첫째 항 계산]: $\\displaystyle\\int_0^a 3f(2x)\\,dx=3\\cdot\\dfrac{1}{2}\\int_0^{2a} f(t)\\,dt=\\dfrac{3}{2}\\times 10=15$이다.\n[둘째 항 치환]: $u=2a-x$로 놓으면 $du=-dx$이고 $x=0\\to u=2a$, $x=a\\to u=a$이다.\n[둘째 항 계산]: $\\displaystyle\\int_0^a f(2a-x)\\,dx=\\int_{2a}^{a} f(u)(-du)=\\int_a^{2a} f(u)\\,du=5$이다.\n[합산]: 따라서 구하는 값은 $15+5=20$이다.\n주의: 첫째 항은 적분구간이 $[0,2a]$로 넓어지므로 $x=a$ 대칭으로 얻은 $\\int_0^{2a} f=10$을 먼저 구해 두어야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "연속함수 $f(x)$가 다음 조건을 만족시킨다.\n\n(가) 모든 실수 $x$에 대하여 $f(2-x) = f(2+x)$이다.\n(나) $\\displaystyle\\int_0^2 f(x)\\,dx = 6$\n\n이때 정적분 $\\displaystyle\\int_0^2 \\{2f(2x) + 3f(4-x)\\}\\,dx$의 값은?",
    "choices": [
      "22",
      "26",
      "30",
      "34",
      "38"
    ],
    "answer": "③",
    "solution": "[대칭성 확인]: 조건 (가)에서 그래프는 직선 $x=2$에 대하여 대칭이므로 $\\displaystyle\\int_2^4 f(x)\\,dx=\\int_0^2 f(x)\\,dx=6$이다.\n[전체 구간 적분]: $\\displaystyle\\int_0^4 f(x)\\,dx=6+6=12$이다.\n[첫째 항 치환]: $t=2x$로 놓으면 $dx=\\dfrac{1}{2}\\,dt$이고 $x=0\\to t=0$, $x=2\\to t=4$이다.\n[첫째 항 계산]: $\\displaystyle\\int_0^2 2f(2x)\\,dx=2\\cdot\\dfrac{1}{2}\\int_0^4 f(t)\\,dt=12$이다.\n[둘째 항 치환]: $u=4-x$로 놓으면 $dx=-du$이고 $x=0\\to u=4$, $x=2\\to u=2$이다.\n[둘째 항 계산]: $\\displaystyle\\int_0^2 3f(4-x)\\,dx=3\\int_4^2 f(u)(-du)=3\\int_2^4 f(u)\\,du=3\\times 6=18$이다.\n[합산]: 따라서 구하는 값은 $12+18=30$이다.\n주의: $u=4-x$ 치환에서 구간이 뒤집히며 생기는 음부호가 $-du$와 함께 정리되는 과정을 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "연속함수 $y=f(x)$는 다음 두 조건을 만족한다.\n\n(가) $f(x) = \\begin{cases} 3x^2+2 & (0 \\le x \\le 1) \\\\ -3x+8 & (1 < x \\le 2) \\end{cases}$\n(나) 모든 실수 $x$에 대하여 $f(x+2) = f(x)$이다.\n\n이때 정적분 $\\displaystyle\\int_1^2 f(3x-1)\\,dx$의 값은?",
    "choices": [
      "\\(\\dfrac{13}{6}\\)",
      "\\(\\dfrac{8}{3}\\)",
      "\\(\\dfrac{17}{6}\\)",
      "\\(\\dfrac{19}{6}\\)",
      "\\(\\dfrac{7}{2}\\)"
    ],
    "answer": "④",
    "solution": "[치환]: $t=3x-1$로 놓으면 $dt=3\\,dx$, $dx=\\dfrac{1}{3}\\,dt$이다.\n[적분구간 변환]: $x=1\\to t=2$, $x=2\\to t=5$이므로 $\\displaystyle\\int_1^2 f(3x-1)\\,dx=\\dfrac{1}{3}\\int_2^5 f(t)\\,dt$이다.\n[주기성 적용]: 조건 (나)에서 주기가 $2$이므로 $\\displaystyle\\int_2^4 f(t)\\,dt=\\int_0^2 f(t)\\,dt$이고 $\\displaystyle\\int_4^5 f(t)\\,dt=\\int_0^1 f(t)\\,dt$이다.\n[구간 분할]: $\\displaystyle\\int_2^5 f(t)\\,dt=\\int_0^2 f(t)\\,dt+\\int_0^1 f(t)\\,dt$이다.\n[구간 $[0,1]$ 계산]: $\\displaystyle\\int_0^1 (3t^2+2)\\,dt=\\left[t^3+2t\\right]_0^1=1+2=3$이다.\n[구간 $[1,2]$ 계산]: $\\displaystyle\\int_1^2 (-3t+8)\\,dt=\\left[-\\dfrac{3}{2}t^2+8t\\right]_1^2=10-\\dfrac{13}{2}=\\dfrac{7}{2}$이다.\n[한 주기 계산]: $\\displaystyle\\int_0^2 f(t)\\,dt=3+\\dfrac{7}{2}=\\dfrac{13}{2}$이다.\n[합 계산]: $\\displaystyle\\int_2^5 f(t)\\,dt=\\dfrac{13}{2}+3=\\dfrac{19}{2}$이다.\n[최종값]: 따라서 $\\dfrac{1}{3}\\times\\dfrac{19}{2}=\\dfrac{19}{6}$이다.\n주의: 구간 $[2,5]$는 한 주기 $[2,4]$와 남은 $[4,5]$로 나누고, $[4,5]$는 주기성으로 $[0,1]$과 같아진다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION",
      "CC_PIECEWISE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION",
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "연속함수 $f(x)$가 다음 조건을 만족시킨다.\n\n(가) 모든 실수 $x$에 대하여 $f(x) = f(x+2)$이다.\n(나) $\\displaystyle\\int_0^{\\frac{3}{2}} f(2x)\\,dx = 7$, $\\displaystyle\\int_1^{\\frac{4}{3}} f(3x)\\,dx = 2$\n\n이때 정적분 $\\displaystyle\\int_{2023}^{2042} f(x)\\,dx$의 값은?",
    "choices": [
      "80",
      "84",
      "88",
      "92",
      "96"
    ],
    "answer": "⑤",
    "solution": "[첫 조건 치환]: $t=2x$로 놓으면 $dx=\\dfrac{1}{2}\\,dt$이므로 $\\dfrac{1}{2}\\displaystyle\\int_0^3 f(t)\\,dt=7$에서 $\\displaystyle\\int_0^3 f(t)\\,dt=14$이다.\n[둘째 조건 치환]: $u=3x$로 놓으면 $dx=\\dfrac{1}{3}\\,du$이므로 $\\dfrac{1}{3}\\displaystyle\\int_3^4 f(u)\\,du=2$에서 $\\displaystyle\\int_3^4 f(u)\\,du=6$이다.\n[미지수 설정]: 주기가 $2$이므로 $A=\\displaystyle\\int_0^1 f(x)\\,dx$, $B=\\int_1^2 f(x)\\,dx$라 하면 $\\displaystyle\\int_2^3 f(x)\\,dx=A$이다.\n[$B$ 결정]: $\\displaystyle\\int_3^4 f(x)\\,dx=\\int_1^2 f(x)\\,dx=B=6$이다.\n[$A$ 결정]: $\\displaystyle\\int_0^3 f(x)\\,dx=A+B+A=2A+6=14$에서 $A=4$이다.\n[한 주기 계산]: $\\displaystyle\\int_0^2 f(x)\\,dx=A+B=4+6=10$이다.\n[구간 분해]: $2042-2023=19=2\\times 9+1$이므로 $[2023,2042]=[2023,2041]\\cup[2041,2042]$이다.\n[주기 부분]: $[2023,2041]$은 길이 $18$인 $9$주기이므로 적분값은 $9\\times 10=90$이다.\n[잔여 부분]: $2041$은 홀수이므로 $\\displaystyle\\int_{2041}^{2042} f(x)\\,dx=\\int_1^2 f(x)\\,dx=B=6$이다.\n[최종값]: 따라서 $90+6=96$이다.\n주의: 시작점 $2023$이 홀수이므로 남은 구간은 $[0,1]$이 아니라 $[1,2]$에 대응한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION",
      "CC_DEFINITE_INTEGRAL_INTERVAL_ADDITIVITY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
