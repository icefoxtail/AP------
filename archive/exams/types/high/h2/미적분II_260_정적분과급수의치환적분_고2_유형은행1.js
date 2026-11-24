window.examTitle = "미적분II_260_정적분과급수의치환적분_고2_유형은행1";

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
    "content": "$\\lim_{n\\to\\infty} \\left( \\frac{1}{4n+1} + \\frac{1}{4n+2} + \\frac{1}{4n+3} + \\cdots + \\frac{1}{6n} \\right)$의 값은?",
    "choices": [
      "\\ln\\frac{3}{2}",
      "\\ln\\frac{5}{3}",
      "\\ln 2",
      "\\ln\\frac{5}{2}",
      "\\ln 3"
    ],
    "answer": "①",
    "solution": "[합의 기호로 정리] 일반항의 분모가 $4n+k$이고 항이 $k=1$부터 $k=2n$까지이므로 주어진 식은 $$\\sum_{k=1}^{2n}\\frac{1}{4n+k}$$로 나타낸다.\n[분모와 분자를 $n$으로 나누기] 분모를 $n$으로 묶으면 $$\\sum_{k=1}^{2n}\\frac{1}{4n+k}=\\sum_{k=1}^{2n}\\frac{1}{4+\\frac{k}{n}}\\cdot\\frac{1}{n}$$이다.\n[정적분과 급수의 관계] $x_k=4+\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$으로 두면 $k=1$일 때 $x\\to4$, $k=2n$일 때 $x\\to6$이므로 극한은 $$\\lim_{n\\to\\infty}\\sum_{k=1}^{2n}\\frac{1}{4+\\frac{k}{n}}\\cdot\\frac{1}{n}=\\int_4^6\\frac{1}{x}\\,dx$$이다.\n[부정적분 공식] $\\int\\frac{1}{x}\\,dx=\\ln|x|+C$를 이용한다.\n[정적분 계산] $$\\int_4^6\\frac{1}{x}\\,dx=\\left[\\ln|x|\\right]_4^6=\\ln6-\\ln4$$이다.\n[로그의 성질] $\\ln6-\\ln4=\\ln\\frac{6}{4}=\\ln\\frac{3}{2}$이다.\n주의: 마지막 항이 $\\frac{1}{6n}$이므로 더하는 항의 개수는 $n$개가 아니라 $2n$개이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\lim_{n\\to\\infty} \\left( \\frac{1}{n^2+1^2} + \\frac{2}{n^2+2^2} + \\frac{3}{n^2+3^2} + \\cdots + \\frac{2n}{n^2+(2n)^2} \\right)$의 값은?",
    "choices": [
      "\\frac{1}{2}\\ln 2",
      "\\frac{1}{2}\\ln 3",
      "\\frac{1}{2}\\ln 5",
      "\\frac{1}{2}\\ln 7",
      "\\frac{1}{2}\\ln 10"
    ],
    "answer": "③",
    "solution": "[합의 기호로 정리] 분자가 $k$, 분모가 $n^2+k^2$이고 항이 $2n$개이므로 주어진 식은 $$\\sum_{k=1}^{2n}\\frac{k}{n^2+k^2}$$로 쓴다.\n[분모와 분자를 $n^2$으로 나누기] $$\\sum_{k=1}^{2n}\\frac{k}{n^2+k^2}=\\sum_{k=1}^{2n}\\frac{\\frac{k}{n}}{1+\\left(\\frac{k}{n}\\right)^2}\\cdot\\frac{1}{n}$$이다.\n[정적분과 급수의 관계] $x=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$으로 두면 적분 구간은 $k=1$일 때 $0$, $k=2n$일 때 $2$이므로 $$\\lim_{n\\to\\infty}\\sum_{k=1}^{2n}\\frac{\\frac{k}{n}}{1+\\left(\\frac{k}{n}\\right)^2}\\cdot\\frac{1}{n}=\\int_0^2\\frac{x}{1+x^2}\\,dx$$이다.\n[치환적분법] $t=1+x^2$으로 놓으면 $\\frac{dt}{dx}=2x$이므로 $x\\,dx=\\frac{1}{2}dt$이다.\n[적분 구간의 변환] $x=0$일 때 $t=1$, $x=2$일 때 $t=5$이다.\n[치환 후 계산] $$\\int_0^2\\frac{x}{1+x^2}\\,dx=\\int_1^5\\frac{1}{t}\\cdot\\frac{1}{2}\\,dt=\\frac{1}{2}\\left[\\ln|t|\\right]_1^5$$이다.\n[함숫값 대입] $$\\frac{1}{2}(\\ln5-\\ln1)=\\frac{1}{2}\\ln5$$이다.\n주의: 항의 끝이 $k=2n$이므로 적분의 윗끝은 $1$이 아니라 $2$이고, 치환 후 윗끝은 $5$가 된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x) = \\frac{6x}{x^2+2}$에 대하여\n$$\\lim_{n\\to\\infty} \\sum_{k=1}^n \\left\\{ f\\left(1+\\frac{3k}{n}\\right) + f\\left(1-\\frac{3k}{n}\\right) \\right\\} \\frac{1}{n}$$\n의 값은?",
    "choices": [
      "\\frac{1}{4}\\ln 3",
      "\\frac{1}{3}\\ln 3",
      "\\frac{1}{2}\\ln 3",
      "\\ln 3",
      "2\\ln 3"
    ],
    "answer": "④",
    "solution": "[두 극한으로 분리] 극한의 성질에 의해 $$L=\\lim_{n\\to\\infty}\\sum_{k=1}^n\\left\\{f\\left(1+\\frac{3k}{n}\\right)+f\\left(1-\\frac{3k}{n}\\right)\\right\\}\\frac{1}{n}$$을 두 극한의 합으로 나눈다.\n[첫째 항의 정적분] $x=1+\\frac{3k}{n}$으로 놓으면 $dx=\\frac{3}{n}$에서 $\\frac{1}{n}=\\frac{1}{3}dx$이고, $x$는 $1$에서 $4$까지 변하므로 첫째 극한은 $\\frac{1}{3}\\int_1^4f(x)\\,dx$이다.\n[둘째 항의 정적분] $x=1-\\frac{3k}{n}$으로 놓으면 $dx=-\\frac{3}{n}$에서 $\\frac{1}{n}=-\\frac{1}{3}dx$이고, $x$는 $1$에서 $-2$까지 변하므로 둘째 극한은 $\\int_1^{-2}f(x)\\left(-\\frac{1}{3}dx\\right)=\\frac{1}{3}\\int_{-2}^1f(x)\\,dx$이다.\n[적분 구간 합치기] $$L=\\frac{1}{3}\\int_{-2}^1f(x)\\,dx+\\frac{1}{3}\\int_1^4f(x)\\,dx=\\frac{1}{3}\\int_{-2}^4f(x)\\,dx$$이다.\n[기함수 확인] $f(-x)=\\frac{6(-x)}{(-x)^2+2}=-\\frac{6x}{x^2+2}=-f(x)$이므로 $f(x)$는 기함수이다.\n[대칭 구간의 정적분] 기함수의 성질에 의해 $\\int_{-2}^2f(x)\\,dx=0$이므로 $$\\int_{-2}^4f(x)\\,dx=\\int_{-2}^2f(x)\\,dx+\\int_2^4f(x)\\,dx=\\int_2^4f(x)\\,dx$$이다.\n[치환적분법] $t=x^2+2$로 놓으면 $\\frac{dt}{dx}=2x$이므로 $6x\\,dx=3\\,dt$이다.\n[적분 구간의 변환] $x=2$일 때 $t=6$, $x=4$일 때 $t=18$이다.\n[치환 후 계산] $$\\frac{1}{3}\\int_2^4\\frac{6x}{x^2+2}\\,dx=\\frac{1}{3}\\int_6^{18}\\frac{3}{t}\\,dt=\\frac{1}{3}\\left[3\\ln|t|\\right]_6^{18}$$이다.\n[함숫값 대입] $$\\frac{1}{3}\\cdot3(\\ln18-\\ln6)=\\ln\\frac{18}{6}=\\ln3$$이다.\n주의: 둘째 적분은 $x$가 감소하는 방향이므로 $dx=-\\frac{3}{n}$의 부호를 반영하여 적분 구간을 뒤집어야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_ODD_EVEN_FUNCTION_INTEGRATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "$\\lim_{n\\to\\infty} \\frac{1}{n^3} \\left\\{ \\sqrt{n^2+3\\cdot 1^2} + 2\\sqrt{n^2+3\\cdot 2^2} + 3\\sqrt{n^2+3\\cdot 3^2} + \\cdots + n\\sqrt{n^2+3n^2} \\right\\}$의 값은?",
    "choices": [
      "\\frac{1}{9}",
      "\\frac{1}{3}",
      "\\frac{5}{9}",
      "\\frac{7}{9}",
      "1"
    ],
    "answer": "④",
    "solution": "[합의 기호로 정리] 주어진 식은 $$\\frac{1}{n^3}\\sum_{k=1}^n k\\sqrt{n^2+3k^2}$$이다.\n[근호 안에서 $n^2$ 묶기] $\\sqrt{n^2+3k^2}=\\sqrt{n^2\\left(1+3\\left(\\frac{k}{n}\\right)^2\\right)}=n\\sqrt{1+3\\left(\\frac{k}{n}\\right)^2}$이다.\n[약분하여 정리] $$\\frac{1}{n^3}\\sum_{k=1}^n k\\cdot n\\sqrt{1+3\\left(\\frac{k}{n}\\right)^2}=\\frac{1}{n}\\sum_{k=1}^n\\frac{k}{n}\\sqrt{1+3\\left(\\frac{k}{n}\\right)^2}$$이다.\n[정적분과 급수의 관계] $x=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$으로 두면 적분 구간은 $[0,1]$이므로 극한은 $$\\int_0^1x\\sqrt{1+3x^2}\\,dx$$이다.\n[치환적분법] $t=1+3x^2$으로 놓으면 $\\frac{dt}{dx}=6x$이므로 $x\\,dx=\\frac{1}{6}dt$이다.\n[적분 구간의 변환] $x=0$일 때 $t=1$, $x=1$일 때 $t=4$이다.\n[치환 후 계산] $$\\int_0^1x\\sqrt{1+3x^2}\\,dx=\\frac{1}{6}\\int_1^4\\sqrt{t}\\,dt=\\frac{1}{6}\\left[\\frac{2}{3}t^{3/2}\\right]_1^4$$이다.\n[함숫값 대입] $$\\frac{1}{6}\\cdot\\frac{2}{3}(4^{3/2}-1^{3/2})=\\frac{1}{9}(8-1)=\\frac{7}{9}$$이다.\n주의: $n^3=n\\cdot n^2$으로 나누어 근호 밖으로 나온 $n$을 약분하고, 남은 $\\frac{1}{n}$을 $\\Delta x$로 사용한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
