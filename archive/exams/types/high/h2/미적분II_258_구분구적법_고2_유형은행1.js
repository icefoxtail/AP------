window.examTitle = "미적분II_258_구분구적법_고2_유형은행1";

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
    "content": "다음은 곡선 $y=3x^2$과 $x$축 및 직선 $x=1$로 둘러싸인 도형의 넓이 $S$를 급수의 합을 이용하여 구하는 과정이다.\n\n그림과 같이 닫힌구간 $[0, 1]$을 $n$등분하면 양 끝점과 각 등분점의 $x$좌표는 차례로\n$0, \\frac{1}{n}, \\frac{2}{n}, \\cdots, \\frac{n}{n}(=1)$\n이고 이에 대응하는 곡선의 $y$좌표는 각각\n$0, 3\\left(\\frac{1}{n}\\right)^2, 3\\left(\\frac{2}{n}\\right)^2, \\cdots, 3\\left(\\frac{n}{n}\\right)^2$\n이다. 그림에서 색칠한 직사각형의 넓이의 합을 $S_n$이라 하면\n$S_n = \\frac{1}{n} \\cdot 3\\left(\\frac{1}{n}\\right)^2 + \\frac{1}{n} \\cdot 3\\left(\\frac{2}{n}\\right)^2 + \\cdots + \\frac{1}{n} \\cdot 3\\left(\\frac{n}{n}\\right)^2$\n$= \\frac{3}{[\\text{가}]} (1^2 + 2^2 + \\cdots + n^2) = \\frac{1}{2}\\left(1+\\frac{1}{n}\\right)([\\text{나}])$\n따라서 구하는 넓이 $S$는\n$S = \\lim_{n\\to\\infty} S_n = [\\text{다}]$\n\n위의 (가), (나)에 알맞은 식을 각각 $f(n), g(n)$이라 하고, (다)에 알맞은 수를 $a$라 할 때, $f(2a)+g(a)$의 값은?\n\n[그림: 좌표평면에서 곡선 $y=3x^2$이 원점 $(0, 0)$을 지나 제1사분면으로 증가한다. 닫힌구간 $[0, 1]$을 $n$등분하여 분할한 점들을 밑변으로 하고 곡선 위의 점을 오른쪽 위 꼭짓점으로 하는 $n$개의 직사각형들이 곡선 아래와 위쪽에 걸쳐 배열되어 색칠되어 있다. $x$축 위의 등분점 $0, \\frac{1}{n}, \\frac{2}{n}, \\cdots, \\frac{n-1}{n}, 1$이 표시되어 있고 직선 $x=1$이 점선으로 그려져 있다.]",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "③",
    "solution": "[구간의 분할] 닫힌구간 $[0,1]$을 $n$등분하면 각 소구간의 길이는 $\\Delta x=\\frac{1}{n}$이고 $x_k=\\frac{k}{n}$이다.\n[직사각형 넓이의 합] 오른쪽 끝점의 함숫값을 높이로 잡으면 $S_n=\\sum_{k=1}^{n}3\\left(\\frac{k}{n}\\right)^2\\cdot\\frac{1}{n}$이다.\n[시그마 기호로 정리] $S_n=\\frac{3}{n^3}\\sum_{k=1}^{n}k^2$이므로 $\\frac{3}{[\\text{가}]}=\\frac{3}{n^3}$에서 (가)$=n^3$, 즉 $f(n)=n^3$이다.\n[자연수 거듭제곱의 합 공식] $\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$을 대입하면 $S_n=\\frac{3}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6}=\\frac{(n+1)(2n+1)}{2n^2}$이다.\n[분자·분모를 $n^2$으로 나누기] $\\frac{(n+1)(2n+1)}{2n^2}=\\frac{1}{2}\\cdot\\frac{n+1}{n}\\cdot\\frac{2n+1}{n}=\\frac{1}{2}\\left(1+\\frac{1}{n}\\right)\\left(2+\\frac{1}{n}\\right)$이므로 (나)$=2+\\frac{1}{n}$, $g(n)=2+\\frac{1}{n}$이다.\n[수열의 극한] $n\\to\\infty$일 때 $\\frac{1}{n}\\to0$이므로 $S=\\frac{1}{2}\\cdot(1+0)\\cdot(2+0)=1$이고 $a=1$이다.\n[함숫값 대입] $2a=2$이므로 $f(2a)=f(2)=2^3=8$이고 $g(a)=g(1)=2+\\frac{1}{1}=3$이다.\n[합 계산] $f(2a)+g(a)=8+3=11$이다.\n주의: $S_n$을 정리할 때 상수 $\\frac{3}{6}=\\frac{1}{2}$을 먼저 약분해야 (나)를 정확히 읽을 수 있다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-188",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_AREA_PARTITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "급수의 합을 이용하여 정적분 $\\int_0^3 x^2 dx$의 값을 구하는 과정이다.\n\n$f(x)=x^2$이라 하면 함수 $f(x)$는 닫힌구간 $[0, 3]$에서 연속이다.\n이때 $a=0, b=3$이므로\n$\\Delta x = \\frac{b-a}{n} = \\frac{3}{n}$, $x_k = a+k\\Delta x = [\\text{가}]$\n$f(x_k) = x_k^2 = ([\\text{가}])^2$\n따라서 정적분과 급수의 합 사이의 관계에 의하여\n$\\int_0^3 x^2 dx = \\lim_{n\\to\\infty} \\sum_{k=1}^n f(x_k)\\Delta x$\n$= \\lim_{n\\to\\infty} \\sum_{k=1}^n \\left( ([\\text{가}])^2 \\times \\frac{3}{n} \\right)$\n$= \\lim_{n\\to\\infty} \\frac{27}{n^3} \\sum_{k=1}^n [\\text{나}]$\n$= \\frac{9}{2} \\lim_{n\\to\\infty} \\left(1+\\frac{1}{n}\\right)([\\text{다}])$\n$= [\\text{라}]$\n\n위의 과정에서 (가), (나), (다), (라)에 들어갈 것으로 알맞은 것은?\n\n[그림: 좌표평면에서 곡선 $y=x^2$이 원점 $(0, 0)$을 지나 점 $(3, 9)$까지 제1사분면에서 증가한다. 닫힌구간 $[0, 3]$이 $n$등분되어 $x_1, x_2, \\cdots, x_k, \\cdots, x_n=3$으로 나뉘어 있고, 각 소구간의 오른쪽 끝점에서의 함숫값을 높이로 하는 $n$개의 직사각형들이 곡선과 함께 그려져 있다.]",
    "choices": [
      "(가): $\\frac{k}{n}$, (나): $k^2$, (다): $1+\\frac{3}{n}$, (라): $\\frac{9}{2}$",
      "(가): $\\frac{3k}{n}$, (나): $k^2$, (다): $2+\\frac{1}{n}$, (라): $9$",
      "(가): $\\frac{3k}{n}$, (나): $k$, (다): $1+\\frac{3}{n}$, (라): $9$",
      "(가): $\\frac{3k}{n}$, (나): $k^2$, (다): $1+\\frac{1}{n}$, (라): $\\frac{9}{2}$",
      "(가): $\\frac{k}{3n}$, (나): $k^2$, (다): $2+\\frac{1}{n}$, (라): $9$"
    ],
    "answer": "②",
    "solution": "[분할점의 좌표] $a=0$, $b=3$이므로 $\\Delta x=\\frac{3-0}{n}=\\frac{3}{n}$이고 $x_k=0+k\\cdot\\frac{3}{n}=\\frac{3k}{n}$이다. 따라서 (가)$=\\frac{3k}{n}$.\n[함숫값] $f(x_k)=x_k^2=\\left(\\frac{3k}{n}\\right)^2=\\frac{9k^2}{n^2}$이다.\n[직사각형 넓이의 합] $\\sum_{k=1}^{n}f(x_k)\\Delta x=\\sum_{k=1}^{n}\\frac{9k^2}{n^2}\\cdot\\frac{3}{n}=\\sum_{k=1}^{n}\\frac{27k^2}{n^3}=\\frac{27}{n^3}\\sum_{k=1}^{n}k^2$이므로 (나)$=k^2$이다.\n[자연수 거듭제곱의 합 공식] $\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$을 대입하면 $\\frac{27}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6}=\\frac{9}{2}\\cdot\\frac{(n+1)(2n+1)}{n^2}$이다.\n[인수분해] $\\frac{(n+1)(2n+1)}{n^2}=\\left(1+\\frac{1}{n}\\right)\\left(2+\\frac{1}{n}\\right)$이므로 (다)$=2+\\frac{1}{n}$이다.\n[극한값] $\\frac{1}{n}\\to0$이므로 $\\frac{9}{2}\\cdot1\\cdot2=9$이고 (라)$=9$이다.\n[정적분으로 검산] $\\int_0^3x^2dx=\\left[\\frac{x^3}{3}\\right]_0^3=9-0=9$로 일치한다.\n주의: $x_k$를 제곱하면 $\\frac{9k^2}{n^2}$이므로 $\\Delta x=\\frac{3}{n}$과 곱해 $\\frac{27}{n^3}$이 되고, $\\frac{27}{6}=\\frac{9}{2}$로 약분된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-188",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_AREA_PARTITION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "다음은 정적분을 이용하여 극한값 $\\lim_{n\\to\\infty} \\frac{1}{n^5}\\left(1^4+2^4+3^4+\\cdots+n^4\right)$의 값을 구하는 과정이다.\n\n$\\lim_{n\\to\\infty} \\frac{1}{n^5}\\left(1^4+2^4+3^4+\\cdots+n^4\right) = \\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{k=1}^n [\\text{가}]$\n이때 $f(x)=x^4, a=0, b=1$이라 하고\n$\\Delta x = \\frac{b-a}{n} = \\frac{1}{n}, x_k = a+k\\Delta x = [\\text{나}]$라 하면\n정적분과 급수의 합 사이의 관계에 의하여\n$\\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{k=1}^n [\\text{가}] = \\lim_{n\\to\\infty}\\sum_{k=1}^n f(x_k)\\Delta x = \\int_0^1 f(x)dx = [\\text{다}]$\n\n위의 과정에서 (가), (나), (다)에 들어갈 것으로 알맞은 것은?",
    "choices": [
      "(가): $k^4$, (나): $\\frac{k}{n}$, (다): $\\frac{1}{5}$",
      "(가): $\\left(\\frac{k}{n}\\right)^4$, (나): $\\frac{k}{n}$, (다): $\\frac{1}{5}$",
      "(가): $\\left(\\frac{k}{n}\\right)^4$, (나): $1+\\frac{k}{n}$, (다): $\\frac{1}{5}$",
      "(가): $k^4$, (나): $1+\\frac{k}{n}$, (다): $\\frac{1}{4}$",
      "(가): $\\left(\\frac{k}{n}\\right)^4$, (나): $\\frac{k}{n}$, (다): $\\frac{1}{4}$"
    ],
    "answer": "②",
    "solution": "[시그마로 나타내기] $\\frac{1}{n^5}\\sum_{k=1}^{n}k^4=\\frac{1}{n}\\sum_{k=1}^{n}\\frac{k^4}{n^4}$이다.\n[급수항 정리] $\\frac{k^4}{n^4}=\\left(\\frac{k}{n}\\right)^4$이므로 $\\frac{1}{n}\\sum_{k=1}^{n}\\left(\\frac{k}{n}\\right)^4$이고 (가)$=\\left(\\frac{k}{n}\\right)^4$이다.\n[분할점] $a=0$, $b=1$에서 $\\Delta x=\\frac{1}{n}$, $x_k=0+k\\cdot\\frac{1}{n}=\\frac{k}{n}$이므로 (나)$=\\frac{k}{n}$이다.\n[정적분과 급수의 관계] $f(x)=x^4$이면 $f(x_k)=\\left(\\frac{k}{n}\\right)^4$이고 $\\lim_{n\\to\\infty}\\sum_{k=1}^{n}f(x_k)\\Delta x=\\int_0^1x^4dx$이다.\n[다항함수의 적분] $\\int_0^1x^4dx=\\left[\\frac{x^5}{5}\\right]_0^1=\\frac{1}{5}-0=\\frac{1}{5}$이므로 (다)$=\\frac{1}{5}$이다.\n[거듭제곱 적분 공식으로 검산] $\\int_0^1x^mdx=\\frac{1}{m+1}$에서 $m=4$이면 $\\frac{1}{5}$로 같다.\n주의: 시그마 밖 $\\frac{1}{n}$은 $dx$ 역할이므로 $\\frac{1}{n^5}$을 $\\frac{1}{n}\\cdot\\frac{1}{n^4}$로 나누어 $\\left(\\frac{k}{n}\\right)^4$ 전체를 안에 넣어야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-188",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_AREA_PARTITION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_SERIES_SUM"
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
    "content": "정적분을 이용하여 극한값\n$\\lim_{n\\to\\infty}\\left(\\frac{1}{2n+1}+\\frac{1}{2n+2}+\\frac{1}{2n+3}+\\cdots+\\frac{1}{2n+n}\\right)$\n의 값을 구하는 과정이다.\n\n$\\lim_{n\\to\\infty}\\left(\\frac{1}{2n+1}+\\frac{1}{2n+2}+\\frac{1}{2n+3}+\\cdots+\\frac{1}{2n+n}\\right)$\n$= \\lim_{n\\to\\infty}\\frac{1}{n}\\left(\\frac{1}{2+\\frac{1}{n}}+\\frac{1}{2+\\frac{2}{n}}+\\frac{1}{2+\\frac{3}{n}}+\\cdots+\\frac{1}{2+\\frac{n}{n}}\\right)$\n$= \\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^n [\\text{가}]$\n이때 $f(x)=\\frac{1}{[\\text{나}]}, \\Delta x = \\frac{1}{n}, x_k = \\frac{k}{n}$라 하면\n$\\lim_{n\\to\\infty}\\sum_{k=1}^n f(x_k)\\Delta x = \\int_0^{[\\text{다}]} f(x)dx = \\int_0^{[\\text{다}]} \\frac{1}{[\\text{나}]} dx = [\\text{라}]$\n\n위의 과정에서 (가), (나), (다), (라)에 들어갈 것으로 알맞은 것은?",
    "choices": [
      "(가): $\\frac{1}{2+\\frac{k}{n}}$, (나): $2+x$, (다): $1$, (라): $\\ln\\frac{3}{2}$",
      "(가): $\\frac{1}{2+\\frac{k}{n}}$, (나): $x$, (다): $1$, (라): $\\ln\\frac{3}{2}$",
      "(가): $\\frac{1}{2+\\frac{k}{n}}$, (나): $2+x$, (다): $2$, (라): $\\ln 2$",
      "(가): $\\frac{1}{1+\\frac{2k}{n}}$, (나): $1+2x$, (다): $1$, (라): $\\frac{1}{2}\\ln 3$",
      "(가): $\\frac{k}{2+\\frac{k}{n}}$, (나): $2+x$, (다): $3$, (라): $\\ln 3$"
    ],
    "answer": "①",
    "solution": "[일반항의 변형] $\\frac{1}{2n+k}=\\frac{1}{n\\left(2+\\frac{k}{n}\\right)}=\\frac{1}{n}\\cdot\\frac{1}{2+\\frac{k}{n}}$이다.\n[시그마로 정리] 따라서 주어진 극한은 $\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\frac{1}{2+\\frac{k}{n}}$이고 (가)$=\\frac{1}{2+\\frac{k}{n}}$이다.\n[함수 정하기] $x_k=\\frac{k}{n}$이므로 $f(x_k)=\\frac{1}{2+x_k}$이고 $f(x)=\\frac{1}{2+x}$이다. 즉 (나)$=2+x$.\n[적분 구간] $x_1=\\frac{1}{n}\\to0$, $x_n=\\frac{n}{n}=1$이므로 적분구간은 $[0,1]$이고 (다)$=1$이다.\n[정적분과 급수의 관계] $\\lim_{n\\to\\infty}\\sum_{k=1}^{n}f(x_k)\\Delta x=\\int_0^1\\frac{1}{2+x}dx$이다.\n[유리함수의 적분] $\\int\\frac{1}{x+a}dx=\\ln|x+a|+C$이므로 $\\int_0^1\\frac{1}{2+x}dx=\\left[\\ln(2+x)\\right]_0^1=\\ln3-\\ln2=\\ln\\frac{3}{2}$이고 (라)$=\\ln\\frac{3}{2}$이다.\n[로그의 성질로 검산] $\\ln3-\\ln2=\\ln\\frac{3}{2}$로 계산이 일치한다.\n주의: $x_k=\\frac{k}{n}$으로 고정되어 있으므로 치환하여 $f(x)=\\frac{1}{x}$로 잡지 말고 $f(x)=\\frac{1}{2+x}$로 두어야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-188",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_AREA_PARTITION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
