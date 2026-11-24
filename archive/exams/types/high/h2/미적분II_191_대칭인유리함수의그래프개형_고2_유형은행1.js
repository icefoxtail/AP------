window.examTitle = "미적분II_191_대칭인유리함수의그래프개형_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=8x/(x^2+4)$에 관해 옳은 것을 모두 고르시오.\nㄱ. $y$축에 대하여 대칭이다.\nㄴ. 변곡점은 두 개이다.\nㄷ. 최댓값은 $2$, 최솟값은 $-2$이다.\nㄹ. $(0,2)$에서 아래로 볼록하다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ, ㄷ",
      "ㄱ, ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "②",
    "solution": "$f(-x)=\\dfrac{8(-x)}{(-x)^2+4}=\\dfrac{-8x}{x^2+4}=-f(x)$이므로 $f$는 홀함수이다. (홀함수의 정의)\n따라서 그래프는 원점에 대하여 대칭이고 $y$축 대칭이 아니므로 ㄱ은 거짓이다.\n몫의 미분법으로 $f'(x)=\\dfrac{8(x^2+4)-8x\\cdot 2x}{(x^2+4)^2}=\\dfrac{8(4-x^2)}{(x^2+4)^2}$이다.\n$f'(x)=0$인 점은 $x=\\pm 2$이고 부호는 $x<-2$에서 $-$, $-2<x<2$에서 $+$, $x>2$에서 $-$로 바뀐다.\n$x\\to\\pm\\infty$일 때 $f(x)\\to 0$이므로 $x=-2$에서 최솟값 $f(-2)=\\dfrac{-16}{8}=-2$, $x=2$에서 최댓값 $f(2)=\\dfrac{16}{8}=2$이다. 따라서 ㄷ은 참이다.\n한 번 더 몫의 미분법을 쓰면 $f''(x)=\\dfrac{16x(x^2-12)}{(x^2+4)^3}$이다.\n$f''(x)=0$인 점은 $x=-2\\sqrt3,\\,0,\\,2\\sqrt3$이고 각 점의 좌우에서 부호가 바뀌므로 변곡점은 $3$개이다. 따라서 ㄴ은 거짓이다.\n$0<x<2$이면 $x>0$, $x^2-12<0$이므로 $f''(x)<0$이다.\n$f''(x)<0$인 구간에서는 위로 볼록이므로 $(0,2)$에서 아래로 볼록하다는 ㄹ은 거짓이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION_SYMMETRY",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $10x/(x^2+4)=k$가 적어도 하나의 실근을 갖는 정수 $k$의 개수는?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "$f(x)=\\dfrac{10x}{x^2+4}$로 놓으면 주어진 방정식은 $f(x)=k$이다.\n몫의 미분법으로 $f'(x)=\\dfrac{10(x^2+4)-10x\\cdot2x}{(x^2+4)^2}=\\dfrac{10(4-x^2)}{(x^2+4)^2}$이다.\n$f'$의 부호는 $x<-2$에서 $-$, $-2<x<2$에서 $+$, $x>2$에서 $-$이고 $x\\to\\pm\\infty$에서 $f(x)\\to0$이다.\n따라서 $x=-2$에서 최솟값 $f(-2)=\\dfrac{-20}{8}=-\\dfrac52$, $x=2$에서 최댓값 $f(2)=\\dfrac{20}{8}=\\dfrac52$이다.\n$f$는 연속이고 중간값 정리에 의해 치역은 $\\left[-\\dfrac52,\\dfrac52\\right]$이다.\n이 구간에 속하는 정수는 $-2,-1,0,1,2$의 $5$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "양수 $a$에 대하여 $[-a-1,a]$에서 $f(x)=6x/(x^2+9)$의 최댓값과 최솟값의 합이 $0$인 $a$의 최솟값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "$f(x)=\\dfrac{6x}{x^2+9}$은 $f(-x)=-f(x)$인 홀함수이다. (홀함수의 정의)\n몫의 미분법으로 $f'(x)=\\dfrac{6(x^2+9)-6x\\cdot2x}{(x^2+9)^2}=\\dfrac{6(9-x^2)}{(x^2+9)^2}$이다.\n$f'$의 부호는 $|x|<3$에서 $+$, $|x|>3$에서 $-$이므로 $x=3$에서 최댓값 $f(3)=\\dfrac{18}{18}=1$, $x=-3$에서 최솟값 $f(-3)=-1$이다.\n구간 $[-a-1,a]$의 최댓값을 $M$, 최솟값을 $m$이라 하고 경우를 나눈다.\n(i) $0<a\\le2$이면 $a<a+1\\le3$이고 $f$는 $(0,3)$에서 증가하므로 $M=f(a)$, $m=f(-a-1)=-f(a+1)$이다.\n이때 $f(a)<f(a+1)$이므로 $M+m=f(a)-f(a+1)<0$이다.\n(ii) $2<a<3$이면 $-3$은 구간에 포함되고 $3$은 포함되지 않으므로 $m=-1$, $M=f(a)<1$이다.\n따라서 $M+m=f(a)-1<0$이다.\n(iii) $a\\ge3$이면 $-3$과 $3$이 모두 구간에 포함되므로 $M=1$, $m=-1$이고 $M+m=0$이다.\n그러므로 합이 $0$이 되는 최소의 $a$는 $3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_EXTREMA",
      "CC_INTERVAL_BOUNDS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=x^2/(x-2)$에 관해 옳은 것을 모두 고르시오.\nㄱ. $x=0$에서 극대이고 $x=4$에서 극소이다.\nㄴ. 변곡점은 두 개이다.\nㄷ. 점근선은 $x=2$와 $y=x+2$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "$f(x)=\\dfrac{x^2}{x-2}$을 나누면 $f(x)=x+2+\\dfrac{4}{x-2}$이다. (다항식의 나눗셈)\n거듭제곱의 미분법으로 $f'(x)=1-\\dfrac{4}{(x-2)^2}=\\dfrac{(x-2)^2-4}{(x-2)^2}=\\dfrac{x(x-4)}{(x-2)^2}$이다.\n$f'$의 부호는 $x<0$에서 $+$, $0<x<2$에서 $-$, $2<x<4$에서 $-$, $x>4$에서 $+$이다.\n따라서 $x=0$에서 극대, $x=4$에서 극소이므로 ㄱ은 참이다.\n$f''(x)=\\dfrac{8}{(x-2)^3}$이고 $x\\neq2$인 모든 $x$에서 $f''(x)\\neq0$이다.\n$f''$의 부호는 $x=2$의 좌우에서 바뀌지만 $x=2$는 정의역에 속하지 않으므로 변곡점은 없다. 따라서 ㄴ은 거짓이다.\n$x\\to2^{\\pm}$일 때 $\\dfrac{4}{x-2}\\to\\pm\\infty$이므로 $x=2$는 수직점근선이다.\n$x\\to\\pm\\infty$일 때 $\\dfrac{4}{x-2}\\to0$이므로 $y=x+2$는 점근선이다. 따라서 ㄷ은 참이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION_ASYMPTOTE",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=2x/(x^2+4)$에 관해 옳은 것을 모두 고르시오.\nㄱ. $f'(0)=1/2$이다.\nㄴ. 모든 실수 $x$에서 $f(x)\\ge-1/4$이다.\nㄷ. $0<a<b<2$에서 할선의 기울기는 $1/2$보다 크다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "$f(x)=\\dfrac{2x}{x^2+4}$에서 몫의 미분법으로 $f'(x)=\\dfrac{2(x^2+4)-2x\\cdot2x}{(x^2+4)^2}=\\dfrac{2(4-x^2)}{(x^2+4)^2}$이다.\n$x=0$을 대입하면 $f'(0)=\\dfrac{2\\cdot4}{4^2}=\\dfrac{8}{16}=\\dfrac12$이므로 ㄱ은 참이다.\n$f'(x)=0$인 점은 $x=\\pm2$이고 $x=-2$에서 최솟값 $f(-2)=\\dfrac{-4}{8}=-\\dfrac12$이다.\n$-\\dfrac12<-\\dfrac14$이므로 모든 실수 $x$에서 $f(x)\\ge-\\dfrac14$라는 ㄴ은 거짓이다.\n$0<a<b<2$에서 평균값 정리에 의해 $\\dfrac{f(b)-f(a)}{b-a}=f'(c)$인 $c$가 $(a,b)$에 존재한다.\n한 번 더 미분하면 $f''(x)=\\dfrac{4x(x^2-12)}{(x^2+4)^3}$이고 $0<x<2$에서 $f''(x)<0$이다.\n따라서 $f'$은 $(0,2)$에서 감소하고 $f'(c)<f'(0)=\\dfrac12$이다.\n그러므로 할선의 기울기는 $\\dfrac12$보다 작아 ㄷ은 거짓이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_FUNCTION_VALUE_SIGN_INEQUALITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
