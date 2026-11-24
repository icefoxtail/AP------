window.examTitle = "미적분II_065_등비급수의활용-선분의길이의합_고2_유형은행1";

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
    "content": "각이 $60^\\circ$인 두 반직선 $OX,OY$ 위에서 $OP_0=4$인 $P_0\\in OX$를 잡는다. $P_0$에서 $OY$에 내린 수선의 발을 $P_1$이라 하고 이후 두 반직선에 번갈아 수선을 내려 $P_2,P_3,\\ldots$을 정한다. 수선 길이의 총합은?\\n[그림: $OY$를 오른쪽 수평으로, $OX$를 그 위로 $60^\\circ$ 기울여 그리고 $P_0,P_1,P_2$를 수직 표시와 함께 잇는다.]",
    "choices": [
      "$2\\sqrt3$",
      "$3\\sqrt3$",
      "$4\\sqrt3$",
      "$5\\sqrt3$",
      "$6\\sqrt3$"
    ],
    "answer": "③",
    "solution": "$OP_1$은 직각삼각형 $OP_0P_1$에서 $OP_0\\cos60^\\circ$이므로 $OP_1=4\\cdot\\frac12=2$이다.\n첫 수선 $P_0P_1=OP_0\\sin60^\\circ=4\\cdot\\frac{\\sqrt3}{2}=2\\sqrt3$이다.\n다음 수선 $P_1P_2=OP_1\\sin60^\\circ=2\\cdot\\frac{\\sqrt3}{2}=\\sqrt3$이다.\n같은 방식으로 $OP_2=OP_1\\cos60^\\circ=1$이고 $P_2P_3=1\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt3}{2}$이다.\n즉 수선의 길이는 $2\\sqrt3,\\sqrt3,\\frac{\\sqrt3}{2},\\ldots$로 공비 $\\frac12$인 등비수열이다.\n등비수열의 극한(무한등비급수)으로 총합은 $\\frac{2\\sqrt3}{1-\\frac12}=4\\sqrt3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_AUXILIARY_ALTITUDE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "한 변이 $2$인 정삼각형 $ABC$에서 $B_0=B,C_0=C$라 한다. 매번 $AB_n,AC_n$의 중점을 각각 $B_{n+1},C_{n+1}$로 잡는다. $C_0B_1+B_1C_1+C_1B_2+B_2C_2+\\cdots$의 값은?\\n[그림: 꼭짓점 $A$를 위로 둔 정삼각형에서 두 빗변에 중점을 차례로 찍고 $C_0,B_1,C_1,B_2,C_2$를 잇는다.]",
    "choices": [
      "$2+\\sqrt3$",
      "$1+2\\sqrt3$",
      "$2+2\\sqrt3$",
      "$3+2\\sqrt3$",
      "$4+2\\sqrt3$"
    ],
    "answer": "③",
    "solution": "$A(0,\\sqrt3),B(-1,0),C(1,0)$으로 두면 세 변의 길이가 $2$인 정삼각형이다.\n$B_1$은 $AB$의 중점이므로 $B_1=(-\\frac12,\\frac{\\sqrt3}{2})$이고, $C_1$은 $AC$의 중점이므로 $C_1=(\\frac12,\\frac{\\sqrt3}{2})$이다.\n$C_0=C$이므로 $C_0B_1=CB_1=\\sqrt{(\\frac32)^2+(\\frac{\\sqrt3}{2})^2}=\\sqrt{\\frac94+\\frac34}=\\sqrt3$이다.\n중점연결정리에 의해 $B_1C_1=\\frac12BC=1$이다.\n$B_2$는 $AB_1$의 중점이므로 $B_2=(-\\frac14,\\frac{3\\sqrt3}{4})$이고, $C_2$는 $AC_1$의 중점이므로 $C_2=(\\frac14,\\frac{3\\sqrt3}{4})$이다.\n$C_1B_2=\\sqrt{(\\frac34)^2+(\\frac{\\sqrt3}{4})^2}=\\sqrt{\\frac9{16}+\\frac3{16}}=\\frac{\\sqrt3}{2}$이고 $B_2C_2=\\frac12$이다.\n따라서 두 항을 묶으면 $C_0B_1+B_1C_1=\\sqrt3+1$, $C_1B_2+B_2C_2=\\frac{\\sqrt3}{2}+\\frac12=\\frac12(\\sqrt3+1)$이다.\n묶음마다 공비 $\\frac12$인 등비수열이므로 총합은 $(\\sqrt3+1)(1+\\frac12+\\frac14+\\cdots)=2(\\sqrt3+1)=2+2\\sqrt3$이다.\n따라서 정답은 ③이다.",
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
    "content": "길이 $3$인 줄기의 끝에서 가지 두 개가 나온다. 이후 새 가지의 끝에서 다시 두 가지가 나오며 각 새 가지는 직전 가지 길이의 $1/3$이다. 줄기를 제외한 가지 길이의 총합은?\\n[그림: 수직인 길이 $3$의 줄기 끝에서 왼쪽과 오른쪽으로 각각 $45^\\circ$ 기울어진 길이 $1$의 가지를 그린다. 각 끝에서 그 가지 방향에 대해 좌우 $45^\\circ$로 길이 $1/3$인 선분을 잇는다.]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "줄기 길이가 $3$이고 새 가지는 직전 가지의 $\\frac13$이므로 첫 세대 가지의 길이는 $3\\cdot\\frac13=1$이다.\n첫 세대는 가지가 $2$개이므로 길이의 합은 $1+1=2$이다.\n둘째 세대는 가지가 $2\\cdot2=4$개이고 각 길이가 $1\\cdot\\frac13=\\frac13$이므로 합은 $4\\cdot\\frac13=\\frac43$이다.\n셋째 세대는 가지가 $8$개이고 각 길이가 $\\frac19$이므로 합은 $8\\cdot\\frac19=\\frac89$이다.\n세대별 길이의 합은 $2,\\frac43,\\frac89,\\ldots$로 공비가 $\\frac{4/3}{2}=\\frac23$인 등비수열이다.\n$\\left|\\frac23\\right|<1$이므로 무한등비급수의 합은 $\\frac{2}{1-\\frac23}=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "한 변이 $2$인 정사각형 $Q_0$에서 각 변의 중점을 이어 $Q_1$을 만든다. 같은 방식으로 $Q_2,Q_3,\\ldots$를 만들 때 $Q_2$부터의 둘레의 총합은?\\n[그림: 꼭짓점 $(0,0),(2,0),(2,2),(0,2)$를 이은 뒤 변의 중점을 이어 $Q_1,Q_2,Q_3$을 차례로 그린다.]",
    "choices": [
      "$6+4\\sqrt2$",
      "$7+4\\sqrt2$",
      "$8+4\\sqrt2$",
      "$9+4\\sqrt2$",
      "$10+4\\sqrt2$"
    ],
    "answer": "③",
    "solution": "$Q_0$의 한 변의 길이는 $2$이다.\n$Q_1$의 한 변은 $Q_0$의 이웃한 두 변의 중점을 이은 길이이므로 $\\sqrt{1^2+1^2}=\\sqrt2$이고 둘레는 $4\\sqrt2$이다.\n$Q_2$의 한 변은 $Q_1$의 대각선의 절반이므로 $\\frac{\\sqrt2\\cdot\\sqrt2}{2}=1$이고 둘레는 $4$이다.\n$Q_3$의 한 변은 $\\frac1{\\sqrt2}$이고 둘레는 $\\frac4{\\sqrt2}=2\\sqrt2$이다.\n따라서 $Q_2,Q_3,\\ldots$의 둘레는 $4,2\\sqrt2,2,\\ldots$로 공비가 $\\frac1{\\sqrt2}$인 등비수열이다.\n그 총합은 $\\frac4{1-\\frac1{\\sqrt2}}$이다.\n분모를 유리화하면 $\\frac{4\\sqrt2}{\\sqrt2-1}=\\frac{4\\sqrt2(\\sqrt2+1)}{(\\sqrt2-1)(\\sqrt2+1)}=4\\sqrt2(\\sqrt2+1)=8+4\\sqrt2$이다.\n주의: 첫 번째 중점사각형 $Q_1$의 둘레 $4\\sqrt2$는 더하지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN_THEOREM"
    ],
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
    "content": "한 변이 $4$인 정삼각형에서 세 변의 중점을 이어 중점삼각형을 그린다. 오른쪽 아래 꼭짓점에 남는 정삼각형에서 이 과정을 반복한다. 두 번째로 그린 중점삼각형부터 둘레를 모두 더한 값은?\\n[그림: 밑변이 $(0,0)$에서 $(4,0)$인 정삼각형에서 세 중점을 잇고, $(4,0)$을 공통 꼭짓점으로 하는 절반 크기의 삼각형 안에 다시 세 중점을 잇는다.]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "첫 번째 중점삼각형은 원래 정삼각형의 세 변의 중점을 이은 것이므로 한 변이 $2$, 둘레가 $6$이다.\n오른쪽 아래 꼭짓점에 남는 정삼각형도 한 변이 $2$이다.\n그 남는 삼각형에서 두 번째 중점삼각형을 그리면 한 변은 $1$, 둘레는 $3$이다.\n그 다음 오른쪽 아래에 남는 정삼각형의 한 변은 $1$이고, 그 안의 세 번째 중점삼각형의 한 변은 $\\frac12$, 둘레는 $\\frac32$이다.\n이후 같은 방식으로 둘레는 $3,\\frac32,\\frac34,\\ldots$로 공비가 $\\frac12$인 등비수열이다.\n그 합은 $\\frac3{1-\\frac12}=6$이다.\n주의: 첫 번째 중점삼각형의 둘레 $6$은 문제에서 제외되므로 더하지 않는다.\n따라서 정답은 ④이다.",
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
    "content": "원점을 지나는 방향각 $0^\\circ,60^\\circ,120^\\circ$인 세 직선이 있다. $(2,0)$에서 $60^\\circ$ 직선에 수선을 내린 뒤 $120^\\circ,0^\\circ,60^\\circ,\\ldots$ 직선에 차례로 수선을 내린다. 수선 길이의 합은?\\n[그림: 세 직선을 그리고 $(2,0)$, $(1/2,\\sqrt3/2)$, $(-1/4,\\sqrt3/4)$, $(-1/4,0)$을 차례로 연결한다.]",
    "choices": [
      "$\\sqrt3$",
      "$\\frac{3\\sqrt3}{2}$",
      "$2\\sqrt3$",
      "$\\frac{5\\sqrt3}{2}$",
      "$3\\sqrt3$"
    ],
    "answer": "③",
    "solution": "방향이 $0^\\circ,60^\\circ,120^\\circ$인 세 직선에서 이웃한 두 직선이 이루는 예각은 모두 $60^\\circ$이다.\n$OP_0=2$이고 $P_0$에서 $60^\\circ$ 직선에 내린 수선의 길이는 $2\\sin60^\\circ=2\\cdot\\frac{\\sqrt3}{2}=\\sqrt3$이다.\n그 수선의 발을 $P_1$이라 하면 $OP_1=2\\cos60^\\circ=1$이다.\n$P_1$에서 $120^\\circ$ 직선에 내린 수선의 길이는 $1\\cdot\\sin60^\\circ=\\frac{\\sqrt3}{2}$이고, $OP_2=1\\cdot\\cos60^\\circ=\\frac12$이다.\n$P_2$에서 $0^\\circ$ 직선에 내린 수선의 길이는 $\\frac12\\cdot\\sin60^\\circ=\\frac{\\sqrt3}{4}$이다.\n따라서 수선의 길이는 $\\sqrt3,\\frac{\\sqrt3}{2},\\frac{\\sqrt3}{4},\\ldots$로 공비가 $\\frac12$인 등비수열이다.\n그 합은 $\\frac{\\sqrt3}{1-\\frac12}=2\\sqrt3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_AUXILIARY_ALTITUDE"
    ],
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
    "content": "길이 $24$인 선분을 등분하여 가운데 절반을 남긴다. 남은 선분에서 같은 과정을 반복할 때, 처음 선분을 포함하여 남긴 선분의 길이를 모두 더한 값은?\\n[그림: 수직선에 첫 선분 $[0,24]$와 그 가운데 선분 $[6,18]$, $[9,15]$를 표시한다.]",
    "choices": [
      "$36$",
      "$40$",
      "$44$",
      "$48$",
      "$52$"
    ],
    "answer": "④",
    "solution": "현재 선분의 가운데 절반을 남기므로 남는 선분의 길이는 매 단계마다 $\\frac12$배가 된다.\n처음 선분의 길이는 $24$이고, 다음은 $12$, 그 다음은 $6$이다.\n따라서 남긴 선분의 길이는 $24,12,6,\\ldots$로 첫째항이 $24$, 공비가 $\\frac12$인 등비수열이다.\n그 총합은 $\\frac{24}{1-\\frac12}=48$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
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
    "content": "수직선 위에서 $A_1=0,A_2=12$이다. $A_{n+2}$는 선분 $A_nA_{n+1}$을 $1:2$로 내분한다. 선분 $A_nA_{n+1}$을 지름으로 하는 반원의 호 길이의 총합은?\\n[그림: 수평선에 $0,12,4,28/3$을 각각 $A_1,A_2,A_3,A_4$로 표시하고 연속한 두 점을 지름 끝으로 하는 반원을 위, 아래, 위 순서로 그린다.]",
    "choices": [
      "$12\\pi$",
      "$15\\pi$",
      "$18\\pi$",
      "$21\\pi$",
      "$24\\pi$"
    ],
    "answer": "③",
    "solution": "$A_{n+2}$가 $A_nA_{n+1}$을 $1:2$로 내분하므로 $A_{n+2}=\\frac{2A_n+A_{n+1}}{3}$이다.\n이때 $A_{n+2}-A_{n+1}=\\frac{2A_n+A_{n+1}-3A_{n+1}}{3}=\\frac{2(A_n-A_{n+1})}{3}$이다.\n따라서 $d_n=|A_{n+1}-A_n|$이라 하면 $d_{n+1}=\\frac23d_n$이다.\n$d_1=|A_2-A_1|=12$이므로 $d_n=12\\left(\\frac23\\right)^{n-1}$이다.\n선분 $A_nA_{n+1}$을 지름으로 하는 반원의 호의 길이는 $\\frac12\\pi d_n=\\frac{\\pi}{2}d_n$이다.\n첫 호의 길이는 $\\frac{\\pi}{2}\\cdot12=6\\pi$이고, 호의 길이도 공비 $\\frac23$인 등비수열을 이룬다.\n그 총합은 $6\\pi\\left(1+\\frac23+\\left(\\frac23\\right)^2+\\cdots\\right)=\\frac{6\\pi}{1-\\frac23}=18\\pi$이다.\n따라서 정답은 ③이다.",
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
    "id": 9,
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
    "content": "반지름 $3$인 원 $C_1$에 정사각형을 내접시키고, 이 정사각형의 내접원을 $C_2$라 한다. 같은 방법으로 만든 원 $C_1,C_2,\\ldots$의 둘레의 합은?\\n[그림: 반지름 $3$인 원, 꼭짓점이 원의 상하좌우에 있는 정사각형, 네 변에 접하는 동심원을 차례로 그린다.]",
    "choices": [
      "$(9+6\\sqrt2)\\pi$",
      "$(10+6\\sqrt2)\\pi$",
      "$(11+6\\sqrt2)\\pi$",
      "$(12+6\\sqrt2)\\pi$",
      "$(13+6\\sqrt2)\\pi$"
    ],
    "answer": "④",
    "solution": "반지름 $R$인 원에 내접한 정사각형의 중심에서 꼭짓점까지 거리는 $R$이고, 중심에서 한 변까지 거리는 $R\\cos45^\\circ=\\frac{R}{\\sqrt2}$이다.\n따라서 다음 원의 반지름은 직전 원의 반지름의 $\\frac1{\\sqrt2}$배이다.\n$C_1$의 반지름은 $3$이므로 $C_1,C_2,\\ldots$의 반지름은 $3,\\frac3{\\sqrt2},\\frac32,\\ldots$이다.\n$C_1$의 둘레는 $2\\pi\\cdot3=6\\pi$이다.\n둘레도 공비 $\\frac1{\\sqrt2}$인 등비수열을 이루므로 총합은 $\\frac{6\\pi}{1-\\frac1{\\sqrt2}}$이다.\n분모를 유리화하면 $\\frac{6\\pi\\sqrt2}{\\sqrt2-1}=\\frac{6\\pi\\sqrt2(\\sqrt2+1)}{(\\sqrt2-1)(\\sqrt2+1)}=6\\pi\\sqrt2(\\sqrt2+1)=(12+6\\sqrt2)\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "중심각이 $60^\\circ$, 반지름이 $9$인 부채꼴 $OA_0B_0$이 있다. $A_n$에서 $OB_0$에 내린 수선의 발을 $B_{n+1}$이라 하고 $OA_{n+1}=OB_{n+1}$이 되도록 $OA_0$ 위에 $A_{n+1}$을 잡는다. $n=1$부터 부채꼴 $OA_nB_n$의 호 길이를 모두 더하면?\\n[그림: 길이 $9$인 두 반지름 사이를 $60^\\circ$로 그리고 $A_0B_1$과 $A_1B_2$에 직각 표시를 넣는다. 반지름 $9/2$, $9/4$인 내부 호를 표시한다.]",
    "choices": [
      "$\\pi$",
      "$\\frac{3\\pi}{2}$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$",
      "$3\\pi$"
    ],
    "answer": "⑤",
    "solution": "직각삼각형 $OA_nB_{n+1}$에서 $\\angle A_nOB_{n+1}=60^\\circ$이고 빗변은 $OA_n$이다.\n코사인 값으로 $OB_{n+1}=OA_n\\cos60^\\circ=OA_n\\cdot\\frac12=\\frac{OA_n}{2}$이다.\n$OA_{n+1}=OB_{n+1}$로 잡으므로 $OA_{n+1}=\\frac{OA_n}{2}$이다.\n$OA_0=9$이므로 $OA_n=9\\left(\\frac12\\right)^n=\\frac9{2^n}$이다.\n중심각이 $60^\\circ=\\frac\\pi3$인 부채꼴의 호의 길이는 $r\\cdot\\frac\\pi3$이다.\n$n=1$일 때 반지름은 $\\frac92$이므로 첫 호의 길이는 $\\frac92\\cdot\\frac\\pi3=\\frac{3\\pi}{2}$이다.\n$n=2$일 때 반지름은 $\\frac94$이므로 호의 길이는 $\\frac94\\cdot\\frac\\pi3=\\frac{3\\pi}{4}$이다.\n따라서 호의 길이는 $\\frac{3\\pi}{2},\\frac{3\\pi}{4},\\frac{3\\pi}{8},\\ldots$로 공비가 $\\frac12$인 등비수열이다.\n그 합은 $\\frac{\\frac{3\\pi}{2}}{1-\\frac12}=3\\pi$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_AUXILIARY_ALTITUDE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
