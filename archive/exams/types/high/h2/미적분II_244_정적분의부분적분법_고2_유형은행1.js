window.examTitle = "미적분II_244_정적분의부분적분법_고2_유형은행1";

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
    "content": "함수 $y=f(x)$의 그래프는 닫힌구간 $[1, 5]$에서 연속이고 미분가능하다. $f(1)=2, \\; f(5)=10$이고 $\\int_1^5 f(x)\\,dx = 20$일 때, 정적분 $\\int_1^5 x f'(x)\\,dx$의 값은? [그림: 좌표평면의 제1사분면에서 증가하는 곡선 $y=f(x)$가 두 점 $(1, 2)$, $(5, 10)$을 지나고, $x=1$부터 $x=5$까지 곡선과 $x$축 사이의 영역이 나타나 있다.]",
    "choices": [
      "$24$",
      "$26$",
      "$28$",
      "$30$",
      "$32$"
    ],
    "answer": "③",
    "solution": "부분적분법을 위해 $u(x)=x$, $v'(x)=f'(x)$로 놓으면 $u'(x)=1$, $v(x)=f(x)$이다.\n정적분의 부분적분법 공식 $\\int_a^b uv'\\,dx=[uv]_a^b-\\int_a^b u'v\\,dx$를 적용한다: $\\int_1^5 xf'(x)\\,dx=[xf(x)]_1^5-\\int_1^5 f(x)\\,dx$\n첫째 항을 계산한다: $[xf(x)]_1^5=5f(5)-1\\cdot f(1)=5\\cdot 10-1\\cdot 2=50-2=48$\n주어진 $\\int_1^5 f(x)\\,dx=20$을 대입한다: $48-20=28$\n주의: 아래끝 값 $1\\cdot f(1)=2$를 빼는 것을 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "image": "assets/images/미적분II_244_정적분의부분적분법_고2_유형은행1/q1-problem.svg",
    "imageAlt": "주어진 양 끝점과 적분 넓이 20을 만족하는 한 증가곡선의 대표 개형이며, 구간 [1,5] 아래 영역을 표시한다.",
    "imageCaption": "주어진 양 끝점과 적분 넓이 20을 만족하는 한 증가곡선의 대표 개형이며, 구간 [1,5] 아래 영역을 표시한다.",
    "imageSize": "full"
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
    "content": "모든 실수 $x$에 대하여 이계도함수가 연속인 함수 $f(x)$가 다음 조건을 만족시킨다.\n$$f(1)=2, \\quad f(3)=5, \\quad f'(1)=3, \\quad f'(3)=4$$\n이때 정적분 $\\int_1^3 x f''(x)\\,dx$의 값은?",
    "choices": [
      "$0$",
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "④",
    "solution": "부분적분법을 위해 $u(x)=x$, $v'(x)=f''(x)$로 놓으면 $u'(x)=1$, $v(x)=f'(x)$이다.\n정적분의 부분적분법 공식 $\\int_a^b uv'\\,dx=[uv]_a^b-\\int_a^b u'v\\,dx$를 적용한다: $\\int_1^3 xf''(x)\\,dx=[xf'(x)]_1^3-\\int_1^3 f'(x)\\,dx$\n첫째 항을 계산한다: $[xf'(x)]_1^3=3f'(3)-1\\cdot f'(1)=3\\cdot 4-1\\cdot 3=12-3=9$\n둘째 항은 미적분의 기본정리로 계산한다: $\\int_1^3 f'(x)\\,dx=[f(x)]_1^3=f(3)-f(1)=5-2=3$\n두 값을 빼서 최종값을 구한다: $9-3=6$\n주의: $f''$을 적분하면 $f'$, $f'$을 다시 적분하면 $f$가 되므로 두 단계를 구분한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "미분가능한 두 함수 $f(x), g(x)$가 다음 조건을 만족시킬 때, 정적분 $\\int_0^3 f(x)g(x)\\,dx$의 값은?\n\n(가) $g(x) = f'(x)$\n(나) $f(0) = 2, \\quad f(3) = 6$",
    "choices": [
      "$12$",
      "$16$",
      "$20$",
      "$24$",
      "$28$"
    ],
    "answer": "②",
    "solution": "조건 (가) $g(x)=f'(x)$를 대입한다: $\\int_0^3 f(x)g(x)\\,dx=\\int_0^3 f(x)f'(x)\\,dx$\n합성함수의 미분법에 의해 $\\left(\\{f(x)\\}^2\\right)'=2f(x)f'(x)$이므로 $f(x)f'(x)=\\frac{1}{2}\\left(\\{f(x)\\}^2\\right)'$이다.\n이를 대입하고 상수를 밖으로 뺀다: $\\int_0^3 f(x)f'(x)\\,dx=\\frac{1}{2}\\int_0^3 \\left(\\{f(x)\\}^2\\right)'dx$\n미적분의 기본정리를 적용한다: $=\\frac{1}{2}\\left[\\{f(x)\\}^2\\right]_0^3=\\frac{1}{2}\\left(\\{f(3)\\}^2-\\{f(0)\\}^2\\right)$\n조건 (나) $f(0)=2$, $f(3)=6$을 대입한다: $\\frac{1}{2}(6^2-2^2)=\\frac{1}{2}(36-4)$\n계산한다: $\\frac{1}{2}\\cdot 32=16$\n주의: 부분적분법으로 풀어도 $2\\int f f'=[f^2]$가 되어 같은 결과를 얻는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
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
    "content": "미분가능한 두 함수 $f(x), g(x)$가 닫힌구간 $[a, b]$에서\n$$f'(x) = 2g(x)$$\n를 만족할 때, 다음 중 정적분 $\\int_a^b f(x)g(x)\\,dx$와 항상 같은 것은?",
    "choices": [
      "$\\frac{1}{4}\\left(\\{f(b)\\}^2 - \\{f(a)\\}^2\\right)$",
      "$\\frac{1}{2}\\left(\\{f(b)\\}^2 - \\{f(a)\\}^2\\right)$",
      "$\\{f(b)\\}^2 - \\{f(a)\\}^2$",
      "$2\\left(\\{f(b)\\}^2 - \\{f(a)\\}^2\\right)$",
      "$4\\left(\\{f(b)\\}^2 - \\{f(a)\\}^2\\right)$"
    ],
    "answer": "①",
    "solution": "조건 $f'(x)=2g(x)$의 양변을 $2$로 나눈다: $g(x)=\\frac{1}{2}f'(x)$\n구하는 정적분에 대입하고 상수를 밖으로 뺀다: $\\int_a^b f(x)g(x)\\,dx=\\frac{1}{2}\\int_a^b f(x)f'(x)\\,dx$\n합성함수의 미분법에 의해 $\\left(\\{f(x)\\}^2\\right)'=2f(x)f'(x)$이므로 $f(x)f'(x)=\\frac{1}{2}\\left(\\{f(x)\\}^2\\right)'$이다.\n대입하고 미적분의 기본정리를 적용한다: $\\frac{1}{2}\\int_a^b f(x)f'(x)\\,dx=\\frac{1}{2}\\cdot\\frac{1}{2}\\left[\\{f(x)\\}^2\\right]_a^b$\n정리한다: $=\\frac{1}{4}\\left(\\{f(b)\\}^2-\\{f(a)\\}^2\\right)$\n주의: $g$를 치환할 때의 계수 $\\frac{1}{2}$과 적분할 때의 계수 $\\frac{1}{2}$이 곱해져 $\\frac{1}{4}$이 된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)$는 모든 실수 $x$에 대하여 $f'(x)>0, \\; f''(x)<0$을 만족하고 $f(0)=2, \\; f(6)=10$이다. 다음 <보기>에서 옳은 것만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. $\\int_0^6 \\{f(x)+xf'(x)\\}\\,dx = 60$\nㄴ. $\\int_0^6 f(x)\\,dx > \\int_0^6 xf'(x)\\,dx$\nㄷ. $\\int_0^6 f(x)\\,dx > 36$",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "ㄱ. 곱의 미분법에 의해 $\\{xf(x)\\}'=f(x)+xf'(x)$이다.\n미적분의 기본정리를 적용한다: $\\int_0^6\\{f(x)+xf'(x)\\}\\,dx=[xf(x)]_0^6=6f(6)-0\\cdot f(0)$\n$f(6)=10$을 대입하면 $6\\cdot 10=60$이므로 ㄱ은 참이다.\nㄷ. $f''(x)<0$이므로 $y=f(x)$의 그래프는 위로 볼록하다.\n위로 볼록한 그래프는 두 점 $(0,2)$, $(6,10)$을 잇는 직선보다 위쪽에 있으므로 $\\int_0^6 f(x)\\,dx$는 사다리꼴 넓이보다 크다.\n사다리꼴 넓이를 계산한다: $\\frac{f(0)+f(6)}{2}\\cdot(6-0)=\\frac{2+10}{2}\\cdot 6=36$\n따라서 $\\int_0^6 f(x)\\,dx>36$이므로 ㄷ은 참이다.\nㄴ. 부분적분법에 의해 $\\int_0^6 xf'(x)\\,dx=[xf(x)]_0^6-\\int_0^6 f(x)\\,dx=60-\\int_0^6 f(x)\\,dx$\n두 정적분의 차를 계산한다: $\\int_0^6 f(x)\\,dx-\\int_0^6 xf'(x)\\,dx=2\\int_0^6 f(x)\\,dx-60$\nㄷ에서 $\\int_0^6 f(x)\\,dx>36$이므로 $2\\int_0^6 f(x)\\,dx-60>72-60=12>0$이다.\n따라서 $\\int_0^6 f(x)\\,dx>\\int_0^6 xf'(x)\\,dx$이므로 ㄴ도 참이다.\n주의: $f''<0$은 위로 볼록을 뜻하며, 곡선이 현보다 위에 있음을 이용해 넓이를 비교한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY",
      "CC_AVERAGE_RATE_OF_CHANGE"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  }
];
