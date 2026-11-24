window.examTitle = "미적분II_239_그래프로주어진정적분의치환적분법_고2_유형은행1";

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
    "content": "오른쪽 그림은 닫힌구간 $[0, 6]$에서 정의된 함수 $y=f(x)$의 그래프이다. 이때 정적분\n$$\\int_0^2 f(2x+1)\\,dx$$\n의 값은?\n[그림: 좌표평면 위의 제1사분면에 닫힌구간 $[0, 6]$에서 정의된 함수 $y=f(x)$의 그래프가 그려져 있다. 점 $(0, 2)$, $(2, 4)$, $(4, 4)$, $(5, 1)$, $(6, 0)$이 차례로 선분으로 연결되어 있다. $x$축 위의 점 $2, 4, 5, 6$과 $y$축 위의 점 $1, 2, 4$에서 각각 점선이 뻗어 나와 그래프 위의 점 $(2,4), (4,4), (5,1), (0,2)$의 좌표가 표시되어 있다.]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "solution": "[치환적분법] $t=2x+1$로 놓으면 $\\frac{dt}{dx}=2$이므로 $dx=\\frac{1}{2}dt$이다.\n[적분구간] $x=0$일 때 $t=1$, $x=2$일 때 $t=5$이므로 $\\int_0^2 f(2x+1)\\,dx=\\frac{1}{2}\\int_1^5 f(t)\\,dt$이다.\n[직선의 식] 두 점 $(0,2),(2,4)$를 지나는 직선은 기울기 $\\frac{4-2}{2-0}=1$이고 $f(x)=x+2$이므로 $f(1)=1+2=3$, $f(2)=4$이다.\n[구간 $[1,2]$] 사다리꼴 넓이 공식: $\\int_1^2 f(t)\\,dt=\\frac{3+4}{2}\\times(2-1)=\\frac{7}{2}$.\n[구간 $[2,4]$] $f(t)=4$이므로 직사각형 넓이: $\\int_2^4 f(t)\\,dt=4\\times(4-2)=8$.\n[구간 $[4,5]$] 두 점 $(4,4),(5,1)$을 잇는 선분: $\\int_4^5 f(t)\\,dt=\\frac{4+1}{2}\\times(5-4)=\\frac{5}{2}$.\n[합] $\\int_1^5 f(t)\\,dt=\\frac{7}{2}+8+\\frac{5}{2}=6+8=14$.\n[최종] $\\frac{1}{2}\\times14=7$.\n주의: 치환 후 $dx=\\frac{1}{2}dt$의 계수 $\\frac{1}{2}$을 빠뜨리면 $14$가 되어 오답이 된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "오른쪽 그림과 같이 연속함수 $y=f(x)$의 그래프가 $x$축과 만나는 세 점의 $x$좌표는 각각 $-1, 2, 5$이다. 곡선 $y=f(x)$와 $x$축으로 둘러싸인 두 부분 $A, B$의 넓이가 각각 $11, 2$일 때, 정적분\n$$\\int_0^2 f(3x-1)\\,dx$$\n의 값은?\n[그림: 좌표평면 위에 연속함수 $y=f(x)$의 그래프가 그려져 있다. 곡선은 $x$축과 세 점 $(-1, 0)$, $(2, 0)$, $(5, 0)$에서 만난다. 구간 $[-1, 2]$에서는 곡선이 $x$축 위쪽에 위치하며 둘러싸인 부분 $A$의 넓이가 $11$로 표시되어 있고, 구간 $[2, 5]$에서는 곡선이 $x$축 아래쪽에 위치하며 둘러싸인 부분 $B$의 넓이가 $2$로 표시되어 있다.]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "[치환적분법] $t=3x-1$로 놓으면 $\\frac{dt}{dx}=3$이므로 $dx=\\frac{1}{3}dt$이다.\n[적분구간] $x=0$일 때 $t=-1$, $x=2$일 때 $t=5$이므로 $\\int_0^2 f(3x-1)\\,dx=\\frac{1}{3}\\int_{-1}^5 f(t)\\,dt$이다.\n[구간 분할] 정적분의 성질: $\\int_{-1}^5 f(t)\\,dt=\\int_{-1}^2 f(t)\\,dt+\\int_2^5 f(t)\\,dt$.\n[구간 $[-1,2]$] 그래프가 $t$축 위쪽이므로 값은 넓이 $A$와 같다: $\\int_{-1}^2 f(t)\\,dt=11$.\n[구간 $[2,5]$] 그래프가 $t$축 아래쪽이므로 값은 넓이에 음의 부호: $\\int_2^5 f(t)\\,dt=-B=-2$.\n[합] $\\int_{-1}^5 f(t)\\,dt=11-2=9$.\n[최종] $\\frac{1}{3}\\times9=3$.\n주의: $x$축 아래쪽 영역은 넓이가 아니라 음의 부호를 붙인 정적분 값임을 구별해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
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
    "content": "오른쪽 그림은 닫힌구간 $[0, 4]$에서 정의된 연속함수 $y=f(x)$의 그래프를 나타낸 것이다. 이때 정적분\n$$\\int_1^4 \\frac{f(\\sqrt{x}+1)}{\\sqrt{x}}\\,dx$$\n의 값은?\n[그림: 좌표평면 위의 제1사분면에 닫힌구간 $[0, 4]$에서 정의된 함수 $y=f(x)$의 그래프가 그려져 있다. 점 $(0, 1)$에서 $(1, 1)$까지 수평 선분으로 이어지고, 점 $(1, 1)$에서 $(3, 3)$까지 선분으로 이어지며, 점 $(3, 3)$에서 $(4, 0)$까지 선분으로 이어진다. $x$축 위의 점 $1, 3, 4$와 $y$축 위의 점 $1, 3$에서 점선으로 그래프 위의 점들이 연결되어 좌표가 표시되어 있다.]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "②",
    "solution": "[치환적분법] $t=\\sqrt{x}+1$로 놓으면 $\\frac{dt}{dx}=\\frac{1}{2\\sqrt{x}}$이므로 $\\frac{1}{\\sqrt{x}}dx=2dt$이다.\n[적분구간] $x=1$일 때 $t=2$, $x=4$일 때 $t=3$이므로 $\\int_1^4\\frac{f(\\sqrt{x}+1)}{\\sqrt{x}}\\,dx=2\\int_2^3 f(t)\\,dt$이다.\n[직선의 식] 구간 $[1,3]$에서 그래프는 두 점 $(1,1),(3,3)$을 지나므로 기울기 $\\frac{3-1}{3-1}=1$, $f(t)=t$이다.\n[함숫값] $f(2)=2$, $f(3)=3$이고 $f(t)\\ge0$이다.\n[적분 계산] $\\int_2^3 f(t)\\,dt=\\int_2^3 t\\,dt=\\left[\\frac{t^2}{2}\\right]_2^3=\\frac{9}{2}-\\frac{4}{2}=\\frac{5}{2}$.\n[최종] $2\\times\\frac{5}{2}=5$.\n주의: $\\frac{dt}{dx}=\\frac{1}{2\\sqrt{x}}$에서 상수 $2$가 곱해지므로 마지막에 $2$를 곱해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
