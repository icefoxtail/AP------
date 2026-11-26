window.examTitle = "미적분II_069_등비급수의활용-개수가변하는합_고2_유형은행1";

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
    "content": "두 직각변의 길이가 $3$인 직각이등변삼각형에 한 변이 빗변 위에 놓이고 나머지 두 꼭짓점이 각각 두 직각변 위에 놓이는 정사각형을 내접시킨다. 빗변의 양 끝에 남는 두 직각이등변삼각형에서 이 과정을 반복한다. 처음 내접시킨 정사각형을 제외하고 이후에 그린 정사각형의 넓이의 합은?\\n[그림: 꼭짓점 $(0,0),(3,0),(0,3)$인 삼각형에 $(1,0),(2,1),(1,2),(0,1)$을 잇는다. $(3,0)$과 $(0,3)$에 접한 두 삼각형에서 다음 정사각형을 그린다.]",
    "choices": [
      "$\\frac45$",
      "$1$",
      "$\\frac65$",
      "$\\frac75$",
      "$\\frac85$"
    ],
    "answer": "⑤",
    "solution": "그림의 좌표에서 처음 정사각형의 꼭짓점은 $(1,0),(2,1),(1,2),(0,1)$이므로 한 변의 길이는 $\\sqrt{(2-1)^2+(1-0)^2}=\\sqrt2$이고 넓이는 $2$이다.\n빗변 끝에 남는 작은 직각이등변삼각형은 정사각형의 한 변을 한 직각변으로 가지므로 그 직각변의 길이는 $\\sqrt2$이다.\n처음 삼각형의 직각변은 $3$이므로 작은 삼각형과 처음 삼각형의 닮음비는 $\\frac{\\sqrt2}{3}$이다.\n닮음비가 $k$이면 넓이비는 $k^2$이므로 한 작은 삼각형에 내접하는 다음 정사각형의 넓이는 이전 정사각형 넓이의 $\\left(\\frac{\\sqrt2}{3}\\right)^2=\\frac29$배이다.\n작은 삼각형은 두 개씩 생기므로 다음 세대 정사각형 넓이의 합의 공비는 $2\\cdot\\frac29=\\frac49$이다.\n처음 정사각형을 제외한 넓이의 합은 등비급수 $2\\cdot\\frac49+2\\left(\\frac49\\right)^2+\\cdots$이다.\n공비 $\\frac49$에 대하여 $\\left|\\frac49\\right|<1$이므로 그 합은 $\\frac{2\\cdot\\frac49}{1-\\frac49}=\\frac{\\frac89}{\\frac59}=\\frac85$이다.\n주의: 세대마다 정사각형이 두 개씩 생기는 것을 공비에 반영해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_SIMILAR_FIGURES_AREA_VOLUME"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_069_등비급수의활용-개수가변하는합_고2_유형은행1/q1-problem.svg",
    "imageAlt": "직각이등변삼각형 OBC에 내접한 중앙 정사각형과 양쪽 작은 삼각형의 다음 두 정사각형.",
    "imageCaption": "직각이등변삼각형 OBC에 내접한 중앙 정사각형과 양쪽 작은 삼각형의 다음 두 정사각형.",
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
    "content": "한 변이 $10$인 정사각형의 왼쪽 아래에서 오른쪽 위로 가는 대각선을 다섯 등분한다. 홀수 번째 구간을 대각선으로 하는 정사각형과 짝수 번째 구간을 지름으로 하는 원을 색칠한다. 가운데에 색칠한 정사각형과 왼쪽 위 및 오른쪽 아래 꼭짓점을 각각 공유하는 축평행 정사각형 두 개를 잡되, 새 정사각형의 맞은편 꼭짓점은 큰 정사각형의 해당 꼭짓점이다. 두 새 정사각형에서 같은 색칠 과정을 반복할 때 색칠된 넓이의 합은?\\n[그림: $[0,10]^2$에서 대각선 등분점을 $(2k,2k)$로 표시한다. 세 정사각형과 두 원을 칠하고 $[0,4]\\times[6,10]$, $[6,10]\\times[0,4]$를 다음 작도에 사용한다.]",
    "choices": [
      "$\\frac{80}{17}(\\pi+3)$",
      "$\\frac{85}{17}(\\pi+3)$",
      "$\\frac{90}{17}(\\pi+3)$",
      "$\\frac{95}{17}(\\pi+3)$",
      "$\\frac{100}{17}(\\pi+3)$"
    ],
    "answer": "⑤",
    "solution": "큰 정사각형의 대각선을 $5$등분하면 한 구간의 길이는 $\\frac{10\\sqrt2}{5}=2\\sqrt2$이다.\n홀수 번째 구간을 대각선으로 하는 정사각형은 넓이가 $\\frac{(2\\sqrt2)^2}{2}=4$이고 $3$개이므로 그 합은 $12$이다.\n짝수 번째 구간을 지름으로 하는 원은 반지름이 $\\sqrt2$이므로 넓이가 $\\pi(\\sqrt2)^2=2\\pi$이고 $2$개이므로 그 합은 $4\\pi$이다.\n따라서 첫 세대에서 색칠된 넓이는 $A_1=12+4\\pi$이다.\n가운데 정사각형은 $[4,6]\\times[4,6]$이므로 새 정사각형은 $[0,4]\\times[6,10]$과 $[6,10]\\times[0,4]$이고 한 변의 길이는 $4$이다.\n큰 정사각형의 한 변 $10$에 대한 새 정사각형의 한 변 $4$의 비는 $\\frac25$이므로 같은 작도에서 색칠 넓이는 $\\left(\\frac25\\right)^2=\\frac4{25}$배가 된다.\n새 정사각형은 두 개이므로 다음 세대 전체 색칠 넓이는 이전 세대의 $2\\cdot\\frac4{25}=\\frac8{25}$배이다.\n공비 $\\frac8{25}$에 대하여 $\\left|\\frac8{25}\\right|<1$이므로 전체 색칠 넓이는 등비급수 $A_1\\left(1+\\frac8{25}+\\left(\\frac8{25}\\right)^2+\\cdots\\right)=\\frac{12+4\\pi}{1-\\frac8{25}}$이다.\n분모를 계산하면 $1-\\frac8{25}=\\frac{17}{25}$이므로 $\\frac{(12+4\\pi)\\cdot25}{17}=\\frac{100(3+\\pi)}{17}$이다.\n주의: 길이의 비 $\\frac25$를 넓이의 비로 그대로 쓰지 말고 제곱해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_SIMILAR_FIGURES_AREA_VOLUME"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_069_등비급수의활용-개수가변하는합_고2_유형은행1/q2-problem.svg",
    "imageAlt": "10×10 정사각형의 다섯 대각선 구간을 교대로 정사각형·원으로 색칠하고 맞은편 두 4×4 정사각형에서 반복.",
    "imageCaption": "10×10 정사각형의 다섯 대각선 구간을 교대로 정사각형·원으로 색칠하고 맞은편 두 4×4 정사각형에서 반복.",
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
    "content": "제1사분면의 반지름 $4$인 사분원에서 $G=(2,2)$라 한다. $x=2$, $y=2$와 호의 교점을 각각 $E,F$라 하고, $OE$와 $y=2$의 교점을 $H$, $OF$와 $x=2$의 교점을 $I$라 한다. 사각형 $OIGH$를 색칠한다. 이후 중심이 각각 $(2,0),(0,2)$이고 반지름이 각각 $(2,0)$에서 $I$, $(0,2)$에서 $H$까지의 거리인 사분원 두 개를 오른쪽 위 방향으로 그려 같은 작도를 반복한다. 색칠한 넓이의 총합은?\\n[그림: 원점 중심인 사분원 위에 $E=(2,2\\sqrt3),F=(2\\sqrt3,2)$를 찍어 $OE,OF$를 긋고 $OIGH$를 칠한다. 두 중점에서 출발하는 반지름 $2/\\sqrt3$의 사분원을 각각 그린다.]",
    "choices": [
      "$\\frac85(3-\\sqrt3)$",
      "$\\frac95(3-\\sqrt3)$",
      "$2(3-\\sqrt3)$",
      "$\\frac{11}{5}(3-\\sqrt3)$",
      "$\\frac{12}{5}(3-\\sqrt3)$"
    ],
    "answer": "①",
    "solution": "사분원 $x^2+y^2=16$ ($x\\ge0,\\ y\\ge0$)에서 $x=2$일 때 $y=\\sqrt{16-4}=2\\sqrt3$이므로 $E=(2,2\\sqrt3)$이고, $y=2$일 때 $x=2\\sqrt3$이므로 $F=(2\\sqrt3,2)$이다.\n직선 $OE$는 $y=\\sqrt3 x$이므로 $y=2$와 만나는 점은 $2=\\sqrt3 x$에서 $x=\\frac2{\\sqrt3}$, 즉 $H=\\left(\\frac2{\\sqrt3},2\\right)$이다.\n직선 $OF$는 $y=\\frac{x}{\\sqrt3}$이므로 $x=2$와 만나는 점은 $y=\\frac2{\\sqrt3}$, 즉 $I=\\left(2,\\frac2{\\sqrt3}\\right)$이다.\n대각선 $OG$로 사각형 $OIGH$를 두 삼각형 $OIG$와 $OGH$로 나눈다.\n$\\triangle OIG$는 밑변 $IG=2-\\frac2{\\sqrt3}$, 높이가 $2$이므로 넓이는 $\\frac12\\left(2-\\frac2{\\sqrt3}\\right)\\cdot2=2-\\frac2{\\sqrt3}$이다.\n$\\triangle OGH$는 밑변 $GH=2-\\frac2{\\sqrt3}$, 높이가 $2$이므로 넓이도 $2-\\frac2{\\sqrt3}$이다.\n따라서 처음 색칠한 넓이는 $A_1=2\\left(2-\\frac2{\\sqrt3}\\right)=4\\left(1-\\frac1{\\sqrt3}\\right)$이다.\n새 사분원의 중심 $(2,0)$에서 $I$까지의 거리는 $r=\\sqrt{(2-2)^2+\\left(\\frac2{\\sqrt3}-0\\right)^2}=\\frac2{\\sqrt3}$이고, 중심 $(0,2)$에서 $H$까지의 거리도 $\\sqrt{\\left(\\frac2{\\sqrt3}-0\\right)^2+(2-2)^2}=\\frac2{\\sqrt3}$로 같다.\n처음 사분원의 반지름은 $4$이므로 새 사분원은 닮음비 $\\frac{r}{4}=\\frac{2/\\sqrt3}{4}=\\frac1{2\\sqrt3}$인 같은 작도이다.\n닮음비 $k$이면 넓이비는 $k^2$이므로 한 새 사분원에서 색칠되는 넓이는 $A_1\\left(\\frac1{2\\sqrt3}\\right)^2=A_1\\cdot\\frac1{12}$이다.\n새 사분원은 두 개씩 생기므로 다음 세대 전체 색칠 넓이는 이전 세대의 $2\\cdot\\frac1{12}=\\frac16$배이다.\n공비 $\\frac16$에 대하여 $\\left|\\frac16\\right|<1$이므로 전체 색칠 넓이는 등비급수 $A_1\\left(1+\\frac16+\\left(\\frac16\\right)^2+\\cdots\\right)=\\frac{A_1}{1-\\frac16}$이다.\n계산하면 $\\frac{4\\left(1-\\frac1{\\sqrt3}\\right)}{5/6}=\\frac{24}{5}\\left(1-\\frac1{\\sqrt3}\\right)=\\frac85(3-\\sqrt3)$이다.\n주의: 반지름의 비 $\\frac1{2\\sqrt3}$를 넓이의 비로 그대로 쓰지 말고 제곱해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION",
      "CC_SIMILAR_FIGURES_AREA_VOLUME"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_069_등비급수의활용-개수가변하는합_고2_유형은행1/q3-problem.svg",
    "imageAlt": "제1사분면의 반지름4 사분원, E·F에서 그은 두 반직선, 색칠한 OIGH와 두 작은 사분원.",
    "imageCaption": "제1사분면의 반지름4 사분원, E·F에서 그은 두 반직선, 색칠한 OIGH와 두 작은 사분원.",
    "imageSize": "full"
  }
];
