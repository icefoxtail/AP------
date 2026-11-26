window.examTitle = "미적분II_061_등비급수의합의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "첫째항이 $4$, 공비가 $1/9$인 등비수열 $\\{a_n\\}$이 있다. 넓이가 $a_n$인 정사각형의 대각선 길이를 $l_n$이라 할 때 $\\sum_{n=1}^{\\infty} l_n$의 합은?\n[그림: 좌표평면에 꼭짓점이 $(0,0),(\\sqrt{a_n},0),(\\sqrt{a_n},\\sqrt{a_n}),(0,\\sqrt{a_n})$인 정사각형을 그리고 원점에서 맞은편 꼭짓점까지의 대각선에 $l_n$을 표시한다.]",
    "choices": [
      "$2\\sqrt2$",
      "$3\\sqrt2$",
      "$4\\sqrt2$",
      "$5\\sqrt2$",
      "$6\\sqrt2$"
    ],
    "answer": "②",
    "solution": "등비수열의 일반항: $a_n=4\\left(\\frac19\\right)^{n-1}$.\n정사각형의 넓이가 $a_n$이므로 한 변의 길이는 $\\sqrt{a_n}$이다.\n피타고라스 정리: $l_n=\\sqrt{(\\sqrt{a_n})^2+(\\sqrt{a_n})^2}=\\sqrt{2a_n}$.\n대입: $l_n=\\sqrt{2\\cdot4\\left(\\frac19\\right)^{n-1}}=2\\sqrt2\\left(\\frac13\\right)^{n-1}$.\n즉 첫째항 $l_1=2\\sqrt2$, 공비 $\\frac13$인 등비수열이다.\n등비수열의 극한(등비급수): $\\sum_{n=1}^{\\infty}l_n=\\frac{2\\sqrt2}{1-\\frac13}=\\frac{2\\sqrt2}{\\frac23}=3\\sqrt2$.\n주의: 구하는 것은 변의 길이가 아니라 대각선의 길이 $\\sqrt2$배이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_061_등비급수의합의활용_고2_유형은행1/q1-problem.svg",
    "imageAlt": "n=1 대표: 넓이가 4인 정사각형의 대각선 l₁을 나타낸다.",
    "imageCaption": "n=1 대표: 넓이가 4인 정사각형의 대각선 l₁을 나타낸다.",
    "imageSize": "full"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "곡선 $y=\\sqrt{x}$ 위의 점 $A_n=(4^n,2^n)$을 꼭짓점으로 하고 밑변 $B_nC_n$이 $x$축에 있는 정삼각형의 넓이를 $S_n$이라 할 때 $\\sum_{n=1}^{\\infty} \\frac1{S_n}$의 합은?\n[그림: 곡선 $y=\\sqrt{x}$와 직선 $x=4^n$의 교점에 $A_n$을 표시한다. $x$축 위에 $B_n=(4^n-2^n/\\sqrt3,0)$, $C_n=(4^n+2^n/\\sqrt3,0)$를 표시하고 세 점을 이은 뒤 높이를 점선으로 표시한다.]",
    "choices": [
      "$\\sqrt3/6$",
      "$\\sqrt3/5$",
      "$\\sqrt3/4$",
      "$\\sqrt3/3$",
      "$\\sqrt3/2$"
    ],
    "answer": "④",
    "solution": "점 $A_n=(4^n,2^n)$은 $\\sqrt{4^n}=2^n$이므로 곡선 $y=\\sqrt x$ 위에 있다.\n밑변 $B_nC_n$이 $x$축 위에 있으므로 정삼각형의 높이는 $h_n=2^n$이다.\n정삼각형의 높이와 한 변의 관계: 한 변 $s_n=\\frac{2h_n}{\\sqrt3}$ (30°-60°-90° 삼각형).\n넓이: $S_n=\\frac12 s_n h_n=\\frac12\\cdot\\frac{2h_n}{\\sqrt3}\\cdot h_n=\\frac{h_n^2}{\\sqrt3}$.\n대입: $S_n=\\frac{(2^n)^2}{\\sqrt3}=\\frac{4^n}{\\sqrt3}$.\n역수: $\\frac1{S_n}=\\frac{\\sqrt3}{4^n}=\\sqrt3\\left(\\frac14\\right)^n$.\n첫째항은 $\\frac{\\sqrt3}{4}$, 공비는 $\\frac14$인 등비급수이다.\n등비급수의 합: $\\sum_{n=1}^{\\infty}\\frac1{S_n}=\\frac{\\frac{\\sqrt3}{4}}{1-\\frac14}=\\frac{\\frac{\\sqrt3}{4}}{\\frac34}=\\frac{\\sqrt3}{3}$.\n주의: $n=1$부터이므로 첫째항은 $n=1$의 값 $\\frac{\\sqrt3}{4}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_061_등비급수의합의활용_고2_유형은행1/q2-problem.svg",
    "imageAlt": "n=1 대표: y=√x 위의 A₁(4,2)을 꼭짓점으로 하고 밑변이 x축 위인 정삼각형.",
    "imageCaption": "n=1 대표: y=√x 위의 A₁(4,2)을 꼭짓점으로 하고 밑변이 x축 위인 정삼각형.",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=(\\frac19)^n$에 접하는 기울기 $-2$인 두 직선 중 제1사분면을 지나는 직선의 $x$절편을 $a_n$이라 할 때 $\\sum_{n=1}^{\\infty} a_n$의 합은?",
    "choices": [
      "$\\sqrt5/8$",
      "$\\sqrt5/6$",
      "$\\sqrt5/4$",
      "$\\sqrt5/3$",
      "$\\sqrt5/2$"
    ],
    "answer": "③",
    "solution": "기울기가 $-2$인 직선을 $y=-2x+c$, 즉 $2x+y-c=0$으로 놓는다.\n원 $x^2+y^2=\\left(\\frac19\\right)^n$의 반지름은 $r_n=\\sqrt{\\left(\\frac19\\right)^n}=\\left(\\frac13\\right)^n$.\n점과 직선 사이의 거리: $\\frac{|c|}{\\sqrt{2^2+1^2}}=\\frac{|c|}{\\sqrt5}=r_n$.\n따라서 $|c|=\\sqrt5\\left(\\frac13\\right)^n$.\n제1사분면을 지나려면 $x$절편과 $y$절편이 모두 양수이므로 $c>0$이다. 즉 $c=\\sqrt5\\left(\\frac13\\right)^n$.\n$x$절편: $a_n=\\frac{c}{2}=\\frac{\\sqrt5}{2}\\left(\\frac13\\right)^n$.\n첫째항은 $\\frac{\\sqrt5}{6}$, 공비는 $\\frac13$인 등비급수이다.\n등비급수의 합: $\\sum_{n=1}^{\\infty}a_n=\\frac{\\frac{\\sqrt5}{6}}{1-\\frac13}=\\frac{\\frac{\\sqrt5}{6}}{\\frac23}=\\frac{\\sqrt5}{4}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$y=4^x$를 $x$축 방향으로 평행이동하여 점 $(k,3)$을 지나게 한 곡선의 $y$절편을 $a_k$라 한다. $\\sum_{k=1}^\\infty a_k$의 합은?\n[그림: 좌표축에 $y=4^x$와 $y=3\\cdot4^{x-k}$를 그린다. 이동한 곡선에 점 $(k,3)$과 $(0,a_k)$를 표시한다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "$y=4^x$를 $x$축 방향으로 $d$만큼 평행이동하면 $y=4^{x-d}$이다.\n이를 $y=C\\cdot4^x$ 꼴로 쓰면 $C=4^{-d}$이다(같은 그래프).\n점 $(k,3)$을 지나므로 $C\\cdot4^k=3$.\n따라서 $C=\\frac{3}{4^k}$.\n$y$절편은 $x=0$일 때의 값이므로 $a_k=C=\\frac{3}{4^k}$.\n수열 $\\{a_k\\}$는 첫째항 $\\frac34$, 공비 $\\frac14$인 등비수열이다.\n등비급수의 합: $\\sum_{k=1}^{\\infty}a_k=\\frac{\\frac34}{1-\\frac14}=\\frac{\\frac34}{\\frac34}=1$.\n주의: $x$축 방향 평행이동만으로도 $y=C\\cdot4^x$ 꼴 전체가 나온다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_PARALLEL_TRANSLATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_061_등비급수의합의활용_고2_유형은행1/q4-problem.svg",
    "imageAlt": "k=1 대표: y=4^x와 점 (1,3)을 지나는 y=3·4^{x−1}, 그 y절편.",
    "imageCaption": "k=1 대표: y=4^x와 점 (1,3)을 지나는 y=3·4^{x−1}, 그 y절편.",
    "imageSize": "full"
  },
  {
    "id": 5,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "직선 $y=(\\frac13)^{n-1}(x-2)$와 포물선 $y=2x(x-2)$의 두 교점을 $A=(2,0),P_n$이라 한다. $P_n$에서 $x$축에 내린 수선의 발을 $H_n$이라 할 때 $\\sum_{n=1}^{\\infty} \\overline{P_nH_n}$의 합은?\n[그림: 좌표축에 꼭짓점이 $(1,-2)$인 포물선 $y=2x(x-2)$와 $A=(2,0)$을 지나는 기울기 $(1/3)^{n-1}$인 직선을 그린다. $A$ 외의 교점을 $P_n$, 그 교점에서 $x$축으로 내린 수선의 발을 $H_n$으로 표시한다.]",
    "choices": [
      "$\\frac{9}{4}$",
      "$\\frac{39}{16}$",
      "$\\frac{5}{2}$",
      "$\\frac{21}{8}$",
      "$\\frac{11}{4}$"
    ],
    "answer": "②",
    "solution": "$t=\\left(\\frac13\\right)^{n-1}$로 놓으면 직선은 $y=t(x-2)$이다.\n교점의 방정식: $2x(x-2)=t(x-2)$.\n이항·인수분해: $(x-2)(2x-t)=0$.\n$x=2$는 점 $A$이고, 다른 교점은 $x=\\frac t2$이다.\n$P_n$의 $y$좌표: $y=t\\left(\\frac t2-2\\right)=\\frac{t^2}{2}-2t$.\n$0<t\\le1$이므로 $y<0$이고, 높이는 $\\overline{P_nH_n}=|y|=2t-\\frac{t^2}{2}$.\n두 등비급수로 분리: $\\sum_{n=1}^{\\infty}\\overline{P_nH_n}=\\sum 2t-\\sum\\frac{t^2}{2}$.\n$t$는 첫째항 $1$, 공비 $\\frac13$이므로 $\\sum t=\\frac{1}{1-\\frac13}=\\frac32$, 따라서 $\\sum 2t=3$.\n$t^2$은 첫째항 $1$, 공비 $\\frac19$이므로 $\\sum t^2=\\frac{1}{1-\\frac19}=\\frac98$, 따라서 $\\sum\\frac{t^2}{2}=\\frac{9}{16}$.\n합: $3-\\frac{9}{16}=\\frac{48-9}{16}=\\frac{39}{16}$.\n주의: $P_n$이 $x$축 아래에 있으므로 길이는 절댓값 $2t-\\frac{t^2}{2}$로 계산한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_LINE_PARABOLA_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
