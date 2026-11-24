window.examTitle = "미적분II_016_∞∞꼴의수열의극한의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "포물선 $y=2x^2$ 위에서 $x$좌표가 $n,n+2$인 두 점 사이 거리를 $d_n$이라 하자. $\\lim_{n\\to\\infty}(d_n/n)$은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "③",
    "solution": "1) 두 점의 좌표는 $P_n=(n,2n^2)$, $Q_n=(n+2,2(n+2)^2)$이다.\n2) 가로 방향 차이는 $(n+2)-n=2$이다.\n3) 세로 방향 차이는 $2(n+2)^2-2n^2=2(4n+4)=8n+8$이다.\n4) 거리 공식으로 $d_n=\\sqrt{2^2+(8n+8)^2}$이다.\n5) $n$으로 나누면 $\\frac{d_n}{n}=\\sqrt{\\left(\\frac2n\\right)^2+\\left(8+\\frac8n\\right)^2}$이다.\n6) $n\\to\\infty$일 때 $\\frac1n\\to0$이므로 $\\lim_{n\\to\\infty}\\frac{d_n}{n}=\\sqrt{0+8^2}=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$f(x)=-2x^2+3x$ 위의 $P=(n,f(n)),Q=(n+2,f(n+2))$를 잇는 직선의 기울기를 $m_n$이라 하자. $\\lim_{n\\to\\infty}(m_n/n)$은? [그림: $y=f(x)$ 위에 두 점 $P,Q$를 찍고 직선 $PQ$를 그린다.]",
    "choices": [
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$",
      "$0$"
    ],
    "answer": "③",
    "solution": "1) 두 점을 잇는 직선의 기울기는 평균변화율 $m_n=\\frac{f(n+2)-f(n)}{(n+2)-n}$이다.\n2) $f(n+2)=-2(n+2)^2+3(n+2)=-2n^2-5n-2$이다.\n3) $f(n)=-2n^2+3n$이다.\n4) 따라서 $f(n+2)-f(n)=(-2n^2-5n-2)-(-2n^2+3n)=-8n-2$이다.\n5) 분모가 2이므로 $m_n=\\frac{-8n-2}{2}=-4n-1$이다.\n6) $\\frac{m_n}{n}=-4-\\frac1n$이고 $\\frac1n\\to0$이므로 극한은 $-4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$n\\ge2$일 때 $y=3/x$와 $y=-2x+4n$의 두 교점 사이 거리를 $d_n$이라 하자. $\\lim_{n\\to\\infty}(d_n/n)$은?",
    "choices": [
      "$\\sqrt5$",
      "$\\sqrt{10}$",
      "$\\sqrt{15}$",
      "$\\sqrt{20}$",
      "$\\sqrt{25}$"
    ],
    "answer": "④",
    "solution": "1) 교점의 $x$좌표는 $\\frac3x=-2x+4n$을 풀어 구한다.\n2) 양변에 $x$를 곱하면 $3=-2x^2+4nx$이다.\n3) 정리하면 $2x^2-4nx+3=0$이다.\n4) 근과 계수의 관계 및 근의 공식으로 두 근의 차는 $|x_1-x_2|=\\frac{\\sqrt{(-4n)^2-4\\cdot2\\cdot3}}{2}=\\frac{\\sqrt{16n^2-24}}2=\\sqrt{4n^2-6}$이다.\n5) 직선의 기울기가 $-2$이므로 세로 방향 차이는 $2|x_1-x_2|$이다.\n6) 거리 공식으로 $d_n=\\sqrt{1+(-2)^2}\\,|x_1-x_2|=\\sqrt5\\sqrt{4n^2-6}$이다.\n7) $\\frac{d_n}{n}=\\sqrt5\\sqrt{4-\\frac6{n^2}}\\to\\sqrt5\\cdot2=2\\sqrt5=\\sqrt{20}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$y=2x^2$에 접하고 기울기가 $4n$인 직선의 두 축과의 교점 사이 거리를 $d_n$이라 하자. $\\lim_{n\\to\\infty}(d_n/(4n^2))$은? [그림: 포물선과 $(n,2n^2)$에서의 접선을 그리고 접선의 두 절편을 표시한다.]",
    "choices": [
      "$1/4$",
      "$1/2$",
      "$3/4$",
      "$1$",
      "$5/4$"
    ],
    "answer": "②",
    "solution": "1) $y=2x^2$의 도함수는 $y'=4x$이므로 $x=n$에서의 접선의 기울기는 $4n$이다.\n2) 접점은 $(n,2n^2)$이므로 접선은 $y-2n^2=4n(x-n)$이다.\n3) 정리하면 $y=4nx-2n^2$이다.\n4) $x$절편은 $0=4nx-2n^2$에서 $x=\\frac n2$이다.\n5) $y$절편은 $x=0$에서 $y=-2n^2$이다.\n6) 두 절편 사이 거리는 $d_n=\\sqrt{\\left(\\frac n2\\right)^2+(2n^2)^2}=n^2\\sqrt{\\frac1{4n^2}+4}$이다.\n7) $\\frac{d_n}{4n^2}=\\frac14\\sqrt{4+\\frac1{4n^2}}\\to\\frac14\\cdot2=\\frac12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "직선 $y=3nx$ 위의 $P=(2n,6n^2)$를 지나며 이 직선에 수직인 직선이 $x$축과 만나는 점을 $Q$라 하자. $\\lim_{n\\to\\infty}(OQ/n^3)$은? [그림: 원점 $O$, $P$, $Q$와 두 수직인 직선을 표시한다.]",
    "choices": [
      "$6$",
      "$9$",
      "$12$",
      "$15$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "1) 직선 $y=3nx$의 기울기는 $3n$이다.\n2) 수직인 직선의 기울기는 $\\frac{-1}{3n}$이다.\n3) 점 $P=(2n,6n^2)$을 지나므로 수직선은 $y-6n^2=-\\frac1{3n}(x-2n)$이다.\n4) $x$축과의 교점에서는 $y=0$이므로 $-6n^2=-\\frac1{3n}(x-2n)$이다.\n5) 양변에 $-3n$을 곱하면 $18n^3=x-2n$이다.\n6) 따라서 $x=2n+18n^3$이고 $Q=(2n+18n^3,0)$이다.\n7) $OQ=2n+18n^3$이므로 $\\frac{OQ}{n^3}=18+\\frac2{n^2}\\to18$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$x+y=4$와 $y=3nx/(n+1)$의 교점을 $P_n$, 첫 직선의 $x$절편을 $A$라 하자. 삼각형 $OAP_n$의 넓이의 극한은? [그림: 두 직선 및 꼭짓점 $O,(4,0),P_n$을 그리고 삼각형을 표시한다.]",
    "choices": [
      "$2$",
      "$4$",
      "$5$",
      "$11/2$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "1) 교점 $P_n$은 $y=4-x$를 $y=\\frac{3n}{n+1}x$에 대입하여 구한다.\n2) $4-x=\\frac{3n}{n+1}x$이다.\n3) 양변에 $n+1$을 곱하면 $4(n+1)-(n+1)x=3nx$이다.\n4) 정리하면 $4(n+1)=(4n+1)x$이므로 $x=\\frac{4(n+1)}{4n+1}$이다.\n5) $y=4-x=\\frac{4(4n+1)-4(n+1)}{4n+1}=\\frac{12n}{4n+1}$이다.\n6) $\\frac{12n}{4n+1}=\\frac{12}{4+\\frac1n}\\to3$이다.\n7) 삼각형 $OAP_n$의 밑변 $OA=4$, 높이는 $y$이므로 넓이는 $S_n=\\frac12\\cdot4\\cdot y=2y$이다.\n8) 따라서 $\\lim_{n\\to\\infty}S_n=2\\cdot3=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=25n^2$의 점 $(3n,4n)$에서 그은 접선의 두 축과의 교점을 $A,B$라 하자. $S_n$이 삼각형 $OAB$의 넓이일 때 $\\lim_{n\\to\\infty}(S_n/\\sqrt{25n^4+1})$은? [그림: 원과 제1사분면의 접점, 접선, 두 양의 절편 및 삼각형 $OAB$를 표시한다.]",
    "choices": [
      "$75/24$",
      "$100/24$",
      "$125/24$",
      "$150/24$",
      "$175/24$"
    ],
    "answer": "③",
    "solution": "1) 점 $(3n,4n)$은 $(3n)^2+(4n)^2=25n^2$을 만족하므로 원 $x^2+y^2=(5n)^2$ 위의 점이다.\n2) 원 위의 점 $(x_1,y_1)$에서의 접선 공식 $x_1x+y_1y=r^2$를 쓰면 $3nx+4ny=25n^2$이다.\n3) $n>0$이므로 양변을 $n$으로 나누면 $3x+4y=25n$이다.\n4) $x$절편 $A$는 $y=0$에서 $x=\\frac{25n}{3}$이다.\n5) $y$절편 $B$는 $x=0$에서 $y=\\frac{25n}{4}$이다.\n6) 직각삼각형 $OAB$의 넓이는 $S_n=\\frac12\\cdot\\frac{25n}{3}\\cdot\\frac{25n}{4}=\\frac{625n^2}{24}$이다.\n7) $\\sqrt{25n^4+1}=n^2\\sqrt{25+\\frac1{n^4}}$이다.\n8) 따라서 $\\frac{S_n}{\\sqrt{25n^4+1}}=\\frac{625}{24}\\cdot\\frac1{\\sqrt{25+\\frac1{n^4}}}$이다.\n9) $n\\to\\infty$일 때 $\\frac1{n^4}\\to0$이므로 극한은 $\\frac{625}{24}\\cdot\\frac15=\\frac{125}{24}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "기울기가 $2n$이고 $y$절편이 양수인 직선이 원 $x^2+y^2=9n^2$에 접한다. 두 절편 사이 거리를 $d_n$이라 할 때 $\\lim_{n\\to\\infty}(d_n/n^2)$은? [그림: 원점 중심, 반지름 $3n$인 원과 제2사분면에서 접하는 직선 및 두 절편을 표시한다.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "1) 기울기가 $2n$이고 $y$절편이 $b>0$인 직선은 $y=2nx+b$이다.\n2) 일반형으로 쓰면 $2nx-y+b=0$이다.\n3) 점과 직선 사이 거리 공식에서 원점과 접선 사이 거리가 반지름 $3n$이므로 $\\frac{|b|}{\\sqrt{(2n)^2+(-1)^2}}=3n$이다.\n4) $b>0$이므로 $b=3n\\sqrt{4n^2+1}$이다.\n5) $x$절편은 $0=2nx+b$에서 $x=-\\frac b{2n}$이다.\n6) 두 절편 $(0,b)$, $\\left(-\\frac b{2n},0\\right)$ 사이 거리는 $d_n=\\sqrt{b^2+\\left(\\frac b{2n}\\right)^2}=b\\sqrt{1+\\frac1{4n^2}}$이다.\n7) $\\sqrt{1+\\frac1{4n^2}}=\\frac{\\sqrt{4n^2+1}}{2n}$이므로 $d_n=3n\\sqrt{4n^2+1}\\cdot\\frac{\\sqrt{4n^2+1}}{2n}=\\frac32(4n^2+1)$이다.\n8) 따라서 $\\frac{d_n}{n^2}=\\frac32\\left(4+\\frac1{n^2}\\right)\\to6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "중심 $(n,2n^2)$이고 $y$축에 접하는 원에 원점을 지나는 접선을 긋는다. $y$축 이외 접선의 기울기를 $m_n$이라 할 때 $\\lim_{n\\to\\infty}(m_n/n)$은? [그림: 중심 $(n,2n^2)$, 반지름 $n$의 원과 원점에서 그은 두 접선을 표시한다.]",
    "choices": [
      "$1/2$",
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$"
    ],
    "answer": "②",
    "solution": "1) 원의 중심은 $C=(n,2n^2)$이고 $y$축에 접하므로 반지름은 $n$이다.\n2) 원점을 지나고 $y$축이 아닌 접선을 $y=mx$, 즉 $mx-y=0$으로 둔다.\n3) 점과 직선 사이 거리 공식에서 중심 $C$와 접선 사이 거리가 반지름 $n$이므로 $\\frac{|mn-2n^2|}{\\sqrt{m^2+1}}=n$이다.\n4) 양변을 제곱하고 $n^2$으로 나누면 $(m-2n)^2=m^2+1$이다.\n5) 전개하면 $m^2-4nm+4n^2=m^2+1$이다.\n6) 정리하면 $4n(n-m)=1$이므로 $m=n-\\frac1{4n}$이다.\n7) 따라서 $\\frac{m}{n}=1-\\frac1{4n^2}$이다.\n8) $n\\to\\infty$일 때 $\\frac1{4n^2}\\to0$이므로 극한은 $1$이다.\n주의: $x=0$은 $y$축 자체인 접선이므로 기울기 $m_n$을 갖는 접선에서 제외한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
