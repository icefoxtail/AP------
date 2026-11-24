window.examTitle = "미적분II_067_등비급수의활용-도형의넓이의합2_고2_유형은행1";

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
    "content": "$O=(0,0),A=(0,a),B=(b,0)$인 직각삼각형에서 $O$를 꼭짓점으로 하는 축평행 정사각형을 내접시킨다. 정사각형 위에 남은 직각삼각형에서 같은 작도를 반복할 때 모든 정사각형의 넓이의 합은?\\n[그림: 두 직각변을 각각 세로 $a$, 가로 $b$로 표시한다. 빗변에 오른쪽 위 꼭짓점이 닿는 정사각형들을 왼쪽 직각변을 따라 아래에서 위로 이어 그린다.]",
    "choices": [
      "$\\frac{a^2b}{2a+5b}$",
      "$\\frac{a^2b}{2a+4b}$",
      "$\\frac{a^2b}{2a+3b}$",
      "$\\frac{a^2b}{2a+2b}$",
      "$\\frac{a^2b}{2a+b}$"
    ],
    "answer": "⑤",
    "solution": "빗변 $AB$는 두 절편이 $a,b$이므로 절편형으로 $\\frac{x}{b}+\\frac{y}{a}=1$이다.\n정사각형의 한 변을 $x$라 하면 맞은편 꼭짓점이 $(x,x)$이고 이것이 빗변 위에 있으므로 $\\frac{x}{b}+\\frac{x}{a}=1$이다.\n통분하면 $\\frac{x(a+b)}{ab}=1$이므로 $x=\\frac{ab}{a+b}$이다.\n위쪽에 남은 삼각형은 두 직각변의 길이가 각각 $a-x,\\ x$이고 원래 삼각형과 닮음이다.\n닮음비는 세로변끼리 비교하면 $\\frac{a-x}{a}$이고, $a-x=a-\\frac{ab}{a+b}=\\frac{a^2}{a+b}$이므로 $\\frac{a-x}{a}=\\frac{a}{a+b}$이다.\n가로변끼리 비교해도 $\\frac{x}{b}=\\frac{a}{a+b}$로 같다.\n따라서 한 변은 매 단계 $\\frac{a}{a+b}$배, 넓이는 $\\left(\\frac{a}{a+b}\\right)^2$배가 된다.\n등비급수의 합 공식으로 넓이의 총합은 $\\frac{x^2}{1-\\left(\\frac{a}{a+b}\\right)^2}$이다.\n분모를 인수분해하면 $1-\\left(\\frac{a}{a+b}\\right)^2=\\frac{(a+b)^2-a^2}{(a+b)^2}=\\frac{2ab+b^2}{(a+b)^2}=\\frac{b(2a+b)}{(a+b)^2}$이다.\n$x^2=\\frac{a^2b^2}{(a+b)^2}$이므로 총합은 $\\frac{a^2b^2}{(a+b)^2}\\cdot\\frac{(a+b)^2}{b(2a+b)}=\\frac{a^2b}{2a+b}$이다.\n주의: 남은 삼각형은 위쪽 삼각형이므로 닮음비가 $\\frac{b}{a+b}$가 아니라 $\\frac{a}{a+b}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "밑변 $12$, 높이 $8$인 직각삼각형이 있다. 각 단계에서 직각 꼭짓점을 공유하고 맞은편 꼭짓점은 빗변 위에 놓이는 정사각형을 그린 후, 오른쪽에 남은 직각삼각형에서 반복한다. 두 번째 정사각형부터 넓이를 모두 더하면?\n[그림: 밑변이 양의 $x$축, 높이가 양의 $y$축 위에 놓인 직각삼각형을 그리고, 빗변에 오른쪽 위 꼭짓점이 닿는 정사각형을 밑변을 따라 왼쪽부터 이어 그린다.]",
    "choices": [
      "$\\frac{264}{25}$",
      "$\\frac{294}{25}$",
      "$\\frac{324}{25}$",
      "$\\frac{354}{25}$",
      "$\\frac{384}{25}$"
    ],
    "answer": "③",
    "solution": "첫 정사각형의 한 변을 $s$라 하면 빗변 위의 맞은편 꼭짓점 조건에서 $\\frac{s}{12}+\\frac{s}{8}=1$이다.\n통분하면 $\\frac{s(8+12)}{96}=1$이므로 $s=\\frac{96}{20}=\\frac{24}{5}$이다.\n첫 정사각형의 넓이는 $\\left(\\frac{24}{5}\\right)^2=\\frac{576}{25}$이다.\n오른쪽에 남은 삼각형은 원래 삼각형과 닮음이고, 밑변의 비가 $\\frac{12-\\frac{24}{5}}{12}=\\frac{\\frac{36}{5}}{12}=\\frac{3}{5}$이다.\n따라서 한 변은 매 단계 $\\frac{3}{5}$배, 넓이는 $\\left(\\frac{3}{5}\\right)^2=\\frac{9}{25}$배가 된다.\n두 번째 정사각형부터의 넓이는 첫째 항이 $\\frac{576}{25}\\cdot\\frac{9}{25}=\\frac{5184}{625}$이고 공비가 $\\frac{9}{25}$인 등비급수이다.\n그 합은 $\\frac{5184}{625}\\div\\left(1-\\frac{9}{25}\\right)=\\frac{5184}{625}\\cdot\\frac{25}{16}=\\frac{5184}{400}=\\frac{324}{25}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 직각변의 길이가 모두 $12$인 직각삼각형이 있다. 각 단계에서 직각 꼭짓점을 공유하고 맞은편 꼭짓점은 빗변 위에 놓이는 정사각형을 그린 후, 오른쪽에 남은 직각삼각형에서 반복한다. 정사각형들의 넓이의 총합은?\n[그림: 밑변이 양의 $x$축, 높이가 양의 $y$축 위에 놓인 직각삼각형을 그리고, 빗변에 오른쪽 위 꼭짓점이 닿는 정사각형을 밑변을 따라 왼쪽부터 이어 그린다.]",
    "choices": [
      "$44$",
      "$48$",
      "$52$",
      "$56$",
      "$60$"
    ],
    "answer": "②",
    "solution": "첫 정사각형의 한 변은 $\\frac{12\\cdot12}{12+12}=6$이므로 넓이는 $36$이다.\n오른쪽 남은 삼각형의 닮음비는 $\\frac{12-6}{12}=\\frac{1}{2}$이다.\n따라서 한 변은 매 단계 $\\frac{1}{2}$배, 넓이는 $\\left(\\frac{1}{2}\\right)^2=\\frac{1}{4}$배가 된다.\n등비급수의 합 공식으로 총합은 $\\frac{36}{1-\\frac{1}{4}}=36\\cdot\\frac{4}{3}=48$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
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
    "content": "두 직각변의 길이가 모두 $9$인 직각삼각형이 있다. 각 단계에서 직각 꼭짓점을 공유하고 맞은편 꼭짓점은 빗변 위에 놓이는 정사각형을 그린 후, 오른쪽에 남은 직각삼각형에서 반복한다. 모든 정사각형을 잘라낸 뒤 남는 부분의 넓이는?\n[그림: 밑변이 양의 $x$축, 높이가 양의 $y$축 위에 놓인 직각삼각형을 그리고, 빗변에 오른쪽 위 꼭짓점이 닿는 정사각형을 밑변을 따라 왼쪽부터 이어 그린다.]",
    "choices": [
      "$\\frac{23}{2}$",
      "$\\frac{27}{2}$",
      "$\\frac{31}{2}$",
      "$\\frac{35}{2}$",
      "$\\frac{39}{2}$"
    ],
    "answer": "②",
    "solution": "전체 직각삼각형의 넓이는 $\\frac{1}{2}\\cdot9\\cdot9=\\frac{81}{2}$이다.\n첫 정사각형의 한 변은 $\\frac{9\\cdot9}{9+9}=\\frac{9}{2}$이므로 넓이는 $\\frac{81}{4}$이다.\n닮음비가 $\\frac{1}{2}$이므로 넓이는 매 단계 $\\left(\\frac{1}{2}\\right)^2=\\frac{1}{4}$배가 된다.\n잘라낸 정사각형 넓이의 합은 $\\frac{\\frac{81}{4}}{1-\\frac{1}{4}}=\\frac{81}{4}\\cdot\\frac{4}{3}=27$이다.\n남는 부분의 넓이는 $\\frac{81}{2}-27=\\frac{81}{2}-\\frac{54}{2}=\\frac{27}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "한 변이 $6$인 정삼각형에 내접원을 그리고, 그 원에 다시 정삼각형을 내접시킨다. 이를 무한히 반복할 때 각 정삼각형에서 그 내접원 밖에 있는 부분의 넓이의 총합을 $a\\sqrt3-b\\pi$라 하자. 유리수 $a,b$에 대해 $a+b$는?\\n[그림: 정삼각형과 세 변에 접하는 원을 그리고 그 원에 거꾸로 된 정삼각형을 내접시킨다. 각 삼각형의 꼭짓점 주변에서 내접원 바깥인 곳을 색칠한다.]",
    "choices": [
      "$10$",
      "$12$",
      "$14$",
      "$16$",
      "$18$"
    ],
    "answer": "④",
    "solution": "한 변이 $6$인 정삼각형의 넓이는 $\\frac{\\sqrt3}{4}\\cdot6^2=9\\sqrt3$이다.\n내접원의 반지름은 $\\frac{\\sqrt3}{6}\\cdot6=\\sqrt3$이므로 내접원의 넓이는 $\\pi(\\sqrt3)^2=3\\pi$이다.\n첫 정삼각형에서 내접원 밖의 넓이는 $9\\sqrt3-3\\pi$이다.\n원에 내접하는 다음 정삼각형의 외접원 반지름은 $\\sqrt3$이고, 원래 정삼각형의 외접원 반지름은 $\\frac{6}{\\sqrt3}=2\\sqrt3$이다.\n닮음비는 $\\frac{\\sqrt3}{2\\sqrt3}=\\frac{1}{2}$이므로 넓이는 매 단계 $\\frac{1}{4}$배가 된다.\n따라서 삼각형 넓이와 내접원 넓이도 모두 $\\frac{1}{4}$배가 되어 각 항의 넓이 차는 공비 $\\frac{1}{4}$인 등비수열이 된다.\n등비급수의 합 공식으로 총합은 $\\frac{9\\sqrt3-3\\pi}{1-\\frac{1}{4}}=\\left(9\\sqrt3-3\\pi\\right)\\cdot\\frac{4}{3}=12\\sqrt3-4\\pi$이다.\n$a=12,\\ b=4$이므로 $a+b=16$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RATIONAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "꼭짓점 $O$에서 만나는 두 반직선에 동시에 접하는 반지름 $3$인 원이 있다. 원의 한 접점에서 $O$까지의 거리는 $4$이다. 두 반직선에 모두 접하고 직전 원과 외접하는 원을 $O$ 쪽에 반복하여 만들 때, 처음 원을 포함한 모든 원의 넓이의 합은?\\n[그림: 원점에서 오른쪽으로 수평 반직선을 그리고 그 위로 각의 이등분선이 기울기 $3/4$가 되도록 두 번째 반직선을 그린다. 중심 $(4,3)$과 $(1,3/4)$인 두 원을 그린다.]",
    "choices": [
      "$\\frac{48\\pi}{5}$",
      "$\\frac{49\\pi}{5}$",
      "$\\frac{51\\pi}{5}$",
      "$\\frac{52\\pi}{5}$",
      "$\\frac{54\\pi}{5}$"
    ],
    "answer": "①",
    "solution": "원의 중심에서 접점까지의 거리가 $3$, $O$에서 접점까지의 거리가 $4$이므로 중심까지의 거리는 $\\sqrt{3^2+4^2}=5$이다.\n두 반직선에 접하는 원의 중심은 각의 이등분선 위에 있으므로 반지름 $r$인 원의 중심까지의 거리는 닮음에 의해 $\\frac{5}{3}r$이다.\n다음 원의 반지름을 $3t$라 하면 중심까지의 거리는 $\\frac{5}{3}\\cdot3t=5t$이다.\n두 원이 외접하므로 중심 사이의 거리는 두 반지름의 합과 같다: $5-5t=3+3t$.\n이를 풀면 $2=8t$이므로 $t=\\frac{1}{4}$이다.\n따라서 반지름은 매 단계 $\\frac{1}{4}$배, 넓이는 $\\left(\\frac{1}{4}\\right)^2=\\frac{1}{16}$배가 된다.\n처음 원의 넓이는 $\\pi\\cdot3^2=9\\pi$이므로 총합은 $\\frac{9\\pi}{1-\\frac{1}{16}}=9\\pi\\cdot\\frac{16}{15}=\\frac{48\\pi}{5}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
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
    "id": 7,
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
    "content": "두 반직선 $OA,OB$가 이루는 예각을 $\\theta$라 하고 $\\sin\\theta=1/3$이라 하자. $OB$ 위에 지름을 두고 $OA$에 접하는 반지름 $3$인 반원을 그린다. 같은 두 반직선 사이에서 직전 반원과 지름의 끝점 하나를 공유하는 반원을 $O$ 쪽으로 반복해서 그릴 때 넓이의 합은?\\n[그림: $OB$를 오른쪽 수평으로 그리고 $OA$를 위로 $\\theta$만큼 기울인다. $OB$ 위 거리 $9,9/2$인 점에 각각 중심을 두고 반지름 $3,3/2$인 위쪽 반원을 그린다.]",
    "choices": [
      "$3\\pi$",
      "$4\\pi$",
      "$5\\pi$",
      "$6\\pi$",
      "$7\\pi$"
    ],
    "answer": "④",
    "solution": "중심이 $OB$ 위에 있고 반지름이 $r$인 반원이 $OA$에 접하므로, 중심에서 $OA$까지의 거리는 $r$이다.\n$OA$와 $OB$가 이루는 각이 $\\theta$이고 $\\sin\\theta=\\frac{1}{3}$이므로 중심까지의 거리는 $\\frac{r}{\\sin\\theta}=3r$이다.\n다음 반원의 반지름을 $R$이라 하면 지름의 끝점 하나를 공유하므로 중심까지의 거리는 $3r-r-R=2r-R$이다.\n이 반원도 $OA$에 접하므로 $2r-R=3R$이다.\n이를 풀면 $2r=4R$이므로 $R=\\frac{r}{2}$이다.\n따라서 반지름은 매 단계 $\\frac{1}{2}$배, 넓이는 $\\left(\\frac{1}{2}\\right)^2=\\frac{1}{4}$배가 된다.\n처음 반원의 넓이는 $\\frac{1}{2}\\pi\\cdot3^2=\\frac{9\\pi}{2}$이므로 총합은 $\\frac{\\frac{9\\pi}{2}}{1-\\frac{1}{4}}=\\frac{9\\pi}{2}\\cdot\\frac{4}{3}=6\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
