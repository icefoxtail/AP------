window.examTitle = "미적분II_064_등비급수의활용-점의좌표_고2_유형은행1";

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
    "content": "원점에서 출발하여 오른쪽, 위, 왼쪽, 아래 순서로 반복해서 움직인다. 첫 이동 거리는 $2$이고 이후 이동 거리는 직전의 절반이다. 극한점의 좌표가 $(a,b)$일 때 $a-b$는?\\n[그림: 원점에서 $(2,0)$, $(2,1)$, $(3/2,1)$, $(3/2,3/4)$를 차례로 연결한다.]",
    "choices": [
      "$\\frac25$",
      "$\\frac35$",
      "$\\frac45$",
      "$\\frac95$",
      "$\\frac{11}{5}$"
    ],
    "answer": "③",
    "solution": "이동 거리 수열은 $2,1,\\frac12,\\frac14,\\frac18,\\frac1{16},\\cdots$이므로 공비가 $\\frac12$인 등비수열이다.\n수평 이동은 오른쪽 이동 $2,\\frac18,\\frac1{128},\\cdots$과 왼쪽 이동 $\\frac12,\\frac1{32},\\cdots$으로 나뉜다.\n오른쪽 이동의 합은 등비급수의 합 $\\frac{a}{1-r}$ ($|r|<1$)에 의해 $\\frac{2}{1-\\frac1{16}}=\\frac{32}{15}$이다.\n왼쪽 이동의 합은 $\\frac{\\frac12}{1-\\frac1{16}}=\\frac{8}{15}$이다.\n따라서 $a=\\frac{32}{15}-\\frac{8}{15}=\\frac{24}{15}=\\frac85$이다.\n수직 이동의 위쪽 합은 $\\frac{1}{1-\\frac1{16}}=\\frac{16}{15}$이고 아래쪽 합은 $\\frac{\\frac14}{1-\\frac1{16}}=\\frac{4}{15}$이다.\n그러므로 $b=\\frac{16}{15}-\\frac{4}{15}=\\frac{12}{15}=\\frac45$이다.\n$\\therefore a-b=\\frac85-\\frac45=\\frac45$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_064_등비급수의활용-점의좌표_고2_유형은행1/q1-problem.svg",
    "imageAlt": "처음 네 번: 오른쪽 2, 위 1, 왼쪽 1/2, 아래 1/4만큼 이동.",
    "imageCaption": "처음 네 번: 오른쪽 2, 위 1, 왼쪽 1/2, 아래 1/4만큼 이동.",
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
    "content": "점 $(1,2)$에서 오른쪽, 위, 왼쪽, 아래 순서로 반복해 이동한다. 첫 이동 거리는 $3$이고 이후에는 매번 직전의 $1/3$만큼 이동한다. 극한점의 좌표의 합은?\\n[그림: $(1,2)$, $(4,2)$, $(4,3)$, $(11/3,3)$, $(11/3,26/9)$를 차례로 연결한다.]",
    "choices": [
      "$\\frac{27}{5}$",
      "$\\frac{29}{5}$",
      "$\\frac{30}{5}$",
      "$\\frac{32}{5}$",
      "$\\frac{33}{5}$"
    ],
    "answer": "⑤",
    "solution": "이동 거리 수열은 $3,1,\\frac13,\\frac19,\\frac1{27},\\cdots$이므로 공비가 $\\frac13$인 등비수열이다.\n수평 이동은 오른쪽 $3,\\frac1{27},\\cdots$과 왼쪽 $\\frac13,\\frac1{243},\\cdots$으로 나뉜다.\n오른쪽 이동의 합은 등비급수의 합 $\\frac{a}{1-r}$ ($|r|<1$)에 의해 $\\frac{3}{1-\\frac1{81}}=\\frac{3\\cdot81}{80}=\\frac{243}{80}$이다.\n왼쪽 이동의 합은 $\\frac{\\frac13}{1-\\frac1{81}}=\\frac13\\cdot\\frac{81}{80}=\\frac{27}{80}$이다.\n따라서 $x$좌표의 극한은 $1+\\frac{243}{80}-\\frac{27}{80}=1+\\frac{216}{80}=1+\\frac{27}{10}=\\frac{37}{10}$이다.\n수직 이동의 위쪽 합은 $\\frac{1}{1-\\frac1{81}}=\\frac{81}{80}$이고 아래쪽 합은 $\\frac{\\frac19}{1-\\frac1{81}}=\\frac19\\cdot\\frac{81}{80}=\\frac{9}{80}$이다.\n따라서 $y$좌표의 극한은 $2+\\frac{81}{80}-\\frac{9}{80}=2+\\frac{72}{80}=2+\\frac{9}{10}=\\frac{29}{10}$이다.\n구하는 좌표의 합은 $\\frac{37}{10}+\\frac{29}{10}=\\frac{66}{10}=\\frac{33}{5}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
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
    "content": "$A_0=(1,0)$이고 $A_n$은 직선 $y=2n$ 위에 있다. $A_0A_1$의 기울기가 $2$이고 $A_nA_{n+1}$의 기울기는 매번 직전 선분의 기울기의 $4/3$배이다. $A_n$의 $x$좌표의 극한은?\\n[그림: 좌표평면에 $A_0=(1,0)$, $A_1=(2,2)$, $A_2=(11/4,4)$를 표시하고 순서대로 선분으로 잇는다.]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "$A_0=(1,0)$이고 $A_1$의 $y$좌표는 $2$이므로 기울기 조건에서 $\\frac{2-0}{x_1-1}=2$이다.\n이를 풀면 $x_1-1=1$, 즉 $x_1=2$이고 첫 수평 증가량은 $1$이다.\n일반적으로 $A_n$과 $A_{n+1}$의 $y$좌표 차는 $2(n+1)-2n=2$이다.\n$A_nA_{n+1}$의 기울기를 $m_n$이라 하면 $m_0=2$이고, 기울기가 매번 $\\frac43$배이므로 $m_n=2\\left(\\frac43\\right)^n$이다.\n높이 차가 $2$이므로 수평 증가량은 $\\frac{2}{m_n}=\\frac{2}{2(\\frac43)^n}=\\left(\\frac34\\right)^n$이다.\n따라서 $A_N$의 $x$좌표는 $x_N=1+\\sum_{n=0}^{N-1}\\left(\\frac34\\right)^n$이다.\n등비급수의 합 공식 $\\frac{a}{1-r}$ ($|r|<1$)에 의해 $\\lim_{N\\to\\infty}x_N=1+\\frac{1}{1-\\frac34}=1+4=5$이다.\n주의: 높이 차가 매번 $2$로 일정하므로 수평 증가량은 기울기에 반비례한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_064_등비급수의활용-점의좌표_고2_유형은행1/q3-problem.svg",
    "imageAlt": "첫 두 단계: A₀(1,0), A₁(2,2), A₂(11/4,4)를 순서대로 잇는다.",
    "imageCaption": "첫 두 단계: A₀(1,0), A₁(2,2), A₂(11/4,4)를 순서대로 잇는다.",
    "imageSize": "full"
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
    "content": "원점에서 길이 $2$만큼 양의 $x$축과 $30^\\circ$를 이루는 방향으로 이동한다. 이후 진행 방향은 $150^\\circ$와 $30^\\circ$가 번갈아 나타나고 각 이동 거리는 직전의 $1/3$이다. 극한점 좌표의 곱은?\\n[그림: 원점에서 길이 $2$인 첫 선분을 오른쪽 위로 $30^\\circ$ 기울여 그린다. 끝점에서 길이 $2/3$인 선분을 왼쪽 위로 $150^\\circ$ 방향에, 이어 길이 $2/9$인 선분을 오른쪽 위로 $30^\\circ$ 방향에 그린다.]",
    "choices": [
      "$\\frac{5\\sqrt3}{8}$",
      "$\\frac{6\\sqrt3}{8}$",
      "$\\frac{7\\sqrt3}{8}$",
      "$\\frac{9\\sqrt3}{8}$",
      "$\\frac{11\\sqrt3}{8}$"
    ],
    "answer": "④",
    "solution": "첫 이동은 길이 $2$, 방향 $30^\\circ$이므로 $\\vec v_0=(2\\cos30^\\circ,2\\sin30^\\circ)=(\\sqrt3,1)$이다.\n다음 이동은 길이 $\\frac23$, 방향 $150^\\circ$이므로 $\\vec v_1=(\\frac23\\cos150^\\circ,\\frac23\\sin150^\\circ)=(-\\frac{\\sqrt3}{3},\\frac13)$이다.\n그 다음 이동은 길이 $\\frac29$, 방향 $30^\\circ$이므로 $\\vec v_2=(\\frac29\\cos30^\\circ,\\frac29\\sin30^\\circ)=(\\frac{\\sqrt3}{9},\\frac19)$이다.\n$x$좌표의 변위는 $\\sqrt3\\left(1-\\frac13+\\frac19-\\cdots\\right)$이고 공비가 $-\\frac13$인 등비급수이다.\n등비급수의 합 공식 $\\frac{a}{1-r}$ ($|r|<1$)에 의해 극한점의 $x$좌표는 $\\sqrt3\\cdot\\frac{1}{1-(-\\frac13)}=\\sqrt3\\cdot\\frac34=\\frac{3\\sqrt3}{4}$이다.\n$y$좌표의 변위는 $1+\\frac13+\\frac19+\\cdots$이고 공비가 $\\frac13$인 등비급수이다.\n따라서 극한점의 $y$좌표는 $\\frac{1}{1-\\frac13}=\\frac32$이다.\n구하는 곱은 $\\frac{3\\sqrt3}{4}\\cdot\\frac32=\\frac{9\\sqrt3}{8}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_064_등비급수의활용-점의좌표_고2_유형은행1/q4-problem.svg",
    "imageAlt": "0° 기준으로 30°, 150°, 30° 방향에 길이 2, 2/3, 2/9인 세 이동.",
    "imageCaption": "0° 기준으로 30°, 150°, 30° 방향에 길이 2, 2/3, 2/9인 세 이동.",
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
    "content": "원점에서 양의 $x$축 방향으로 길이 $3$만큼 이동한다. 이후 매번 진행 방향을 반시계 방향으로 $120^\\circ$ 돌리고 직전 거리의 절반만큼 이동한다. 극한점의 $x$좌표는?\\n[그림: 원점에서 길이 $3$, $3/2$, $3/4$인 선분을 각각 양의 $x$축과 $0^\\circ$, $120^\\circ$, $240^\\circ$를 이루는 방향으로 차례대로 이어 그린다.]",
    "choices": [
      "$\\frac{15}{7}$",
      "$\\frac{16}{7}$",
      "$\\frac{17}{7}$",
      "$\\frac{18}{7}$",
      "$\\frac{19}{7}$"
    ],
    "answer": "①",
    "solution": "첫 이동은 $x$축 양의 방향으로 길이 $3$이므로 수평 변위는 $3$이다.\n이후 방향은 $120^\\circ$씩 반시계로 돌아가고 거리는 절반이 되므로 세 이동을 한 묶음으로 본다.\n첫 묶음의 길이는 $3,\\frac32,\\frac34$이고 수평 변위의 합은 $3+\\frac32\\cos120^\\circ+\\frac34\\cos240^\\circ$이다.\n$\\cos120^\\circ=-\\frac12$, $\\cos240^\\circ=-\\frac12$이므로 $3-\\frac34-\\frac38=\\frac{24}{8}-\\frac68-\\frac38=\\frac{15}{8}$이다.\n다음 묶음은 길이가 각각 $\\frac18$배이므로 수평 변위의 합도 $\\frac18$배가 된다.\n따라서 수평 변위 전체는 첫째항 $\\frac{15}{8}$, 공비 $\\frac18$인 등비급수이다.\n등비급수의 합 공식 $\\frac{a}{1-r}$ ($|r|<1$)에 의해 그 합은 $\\frac{\\frac{15}{8}}{1-\\frac18}=\\frac{15}{8}\\cdot\\frac87=\\frac{15}{7}$이다.\n주의: 네 번째 이동부터 다시 $x$축 양의 방향이 되지만, 세 이동씩 묶으면 같은 패턴이 유지된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_064_등비급수의활용-점의좌표_고2_유형은행1/q5-problem.svg",
    "imageAlt": "양의 x축에서 0°, 120°, 240° 방향에 길이 3, 3/2, 3/4인 세 이동.",
    "imageCaption": "양의 x축에서 0°, 120°, 240° 방향에 길이 3, 3/2, 3/4인 세 이동.",
    "imageSize": "full"
  }
];
