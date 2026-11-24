window.examTitle = "미적분II_189_변곡점이존재하기위한조건_고2_유형은행1";

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
    "content": "$y=ax^2+2e^x+8e^{-x}$가 변곡점을 가지도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a<-4$",
      "$a\\le-4$",
      "$-4<a<0$",
      "$a>4$",
      "$a\\ge4$"
    ],
    "answer": "①",
    "solution": "지수함수의 미분법으로 $y'=2ax+2e^x-8e^{-x}$이다.\n다시 미분하면 $y''=2a+2e^x+8e^{-x}$이다.\n$t=e^x>0$이라 하면 $y''=2a+2t+\\dfrac{8}{t}$이다.\n산술평균과 기하평균의 관계에서 $2t+\\dfrac{8}{t}\\ge2\\sqrt{2t\\cdot\\dfrac{8}{t}}=8$이고, 등호는 $2t=\\dfrac{8}{t}$, 즉 $t=2$일 때 성립한다.\n따라서 $y''$의 최솟값은 $x=\\ln2$에서 $2a+8$이고, $x\\to\\pm\\infty$이면 $y''\\to\\infty$이다.\n(i) $2a+8<0$ 즉 $a<-4$이면 최솟값이 음수이고 양쪽 끝에서 양수이므로 $y''$의 부호가 두 번 바뀌어 변곡점이 생긴다.\n(ii) $2a+8\\ge0$ 즉 $a\\ge-4$이면 $y''\\ge0$이므로 부호가 바뀌지 않아 변곡점이 없다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$f(x)=ax^2+8\\cos x+x$의 그래프가 변곡점을 가지도록 하는 $a$의 범위는?",
    "choices": [
      "$a<-4$",
      "$-8<a<8$",
      "$-4<a<4$",
      "$0<a<4$",
      "$a>4$"
    ],
    "answer": "③",
    "solution": "코사인함수의 미분법으로 $f'(x)=2ax-8\\sin x+1$이다.\n다시 미분하면 $f''(x)=2a-8\\cos x$이다.\n$-1\\le\\cos x\\le1$이므로 $2a-8\\le f''(x)\\le2a+8$이다.\n(i) $-4<a<4$이면 $f''(0)=2a-8<0$이고 $f''(\\pi)=2a+8>0$이므로, 연속함수의 중간값 정리에 의해 $f''$가 음에서 양으로 변하는 점이 있어 변곡점이 생긴다.\n(ii) $a\\ge4$이면 $f''(x)\\ge0$, $a\\le-4$이면 $f''(x)\\le0$이므로 부호가 바뀌지 않는다. 특히 $a=\\pm4$에서는 $f''$가 $0$이 되는 점이 있어도 부호는 유지된다.\n따라서 변곡점을 가지려면 $-4<a<4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "$y=ax^2-\\sin(4x)$가 변곡점을 가질 때, 가능한 정수 $a$의 개수는?",
    "choices": [
      "12",
      "13",
      "14",
      "15",
      "16"
    ],
    "answer": "④",
    "solution": "합성함수의 미분법으로 $y'=2ax-4\\cos(4x)$이다.\n다시 미분하면 $y''=2a+16\\sin(4x)$이다.\n$-1\\le\\sin(4x)\\le1$이므로 $2a-16\\le y''\\le2a+16$이다.\n(i) $-8<a<8$이면 $y''$가 음수인 값과 양수인 값을 모두 가지므로 중간값 정리에 의해 부호가 바뀌는 점이 생긴다.\n(ii) $a\\ge8$이면 $y''\\ge0$, $a\\le-8$이면 $y''\\le0$이므로 부호가 바뀌지 않는다.\n따라서 $-8<a<8$이고, 이를 만족하는 정수는 $-7,-6,\\cdots,7$이다.\n그 개수는 $7-(-7)+1=15$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$0<x<2\\pi$에서 $y=ax^2+x+6\\cos x$가 변곡점을 갖도록 하는 정수 $a$의 개수는?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "코사인함수의 미분법으로 $y'=2ax+1-6\\sin x$이다.\n다시 미분하면 $y''=2a-6\\cos x$이다.\n$0<x<2\\pi$에서 $-1\\le\\cos x<1$이므로 $2a-6<y''\\le2a+6$이다.\n(i) $-3<a<3$이면 $2a-6<0<2a+6$이다. $x=\\pi$에서 $y''=2a+6>0$이고, $x\\to0^+$ 또는 $x\\to2\\pi^-$일 때 $y''\\to2a-6<0$이므로 부호가 바뀌는 점이 생긴다.\n(ii) $a\\ge3$이면 $y''>0$이고, $a\\le-3$이면 $y''\\le0$이므로 부호가 바뀌지 않는다.\n따라서 $-3<a<3$이고 가능한 정수는 $-2,-1,0,1,2$의 $5$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$k>0$일 때 $f(x)=2\\sin(kx)+9x^3$의 그래프가 변곡점을 정확히 하나 갖도록 하는 $k$의 최댓값은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법으로 $f'(x)=2k\\cos(kx)+27x^2$이다.\n다시 미분하면 $f''(x)=54x-2k^2\\sin(kx)$이다.\n$f''$는 홀함수이므로 $x=0$ 근처의 부호만 살펴도 된다.\n사인의 기본 극한 $\\lim_{x\\to0}\\dfrac{\\sin(kx)}{x}=k$를 쓰면 $\\lim_{x\\to0}\\dfrac{f''(x)}{x}=54-2k^3$이다.\n(i) $0<k<3$이면 $x>0$에서 $\\sin(kx)\\le kx$이므로 $f''(x)\\ge(54-2k^3)x>0$이고, 홀함수 성질로 $x<0$에서는 $f''(x)<0$이다. 따라서 $x=0$에서만 부호가 바뀐다.\n(ii) $k=3$이면 $f''(x)=18(3x-\\sin3x)$이고, $x>0$에서 $3x>\\sin3x$, $x<0$에서 $3x<\\sin3x$이므로 역시 $x=0$에서만 부호가 바뀐다.\n(iii) $k>3$이면 $\\lim_{x\\to0^+}\\dfrac{f''(x)}{x}=54-2k^3<0$이므로 $0<x<\\delta$에서 $f''(x)<0$이다.\n한편 $f''\\left(\\dfrac{\\pi}{k}\\right)=54\\cdot\\dfrac{\\pi}{k}-2k^2\\sin\\pi=\\dfrac{54\\pi}{k}>0$이다.\n중간값 정리에 의해 $0<x<\\dfrac{\\pi}{k}$에 $f''(x)=0$인 점이 있고 이 점에서 부호가 음에서 양으로 바뀐다.\n$f''$가 홀함수이므로 $x=0$, 양수인 영점 $c$, 그 대칭점 $-c$에서 부호가 바뀌어 변곡점이 적어도 $3$개이다.\n따라서 정확히 하나의 변곡점을 갖도록 하는 $k$의 최댓값은 $3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 6,
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
    "content": "$y=3x^2+a\\cos x$의 그래프가 변곡점을 갖지 않도록 하는 $0$이 아닌 정수 $a$의 개수는?",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "②",
    "solution": "코사인함수의 미분법으로 $y'=6x-a\\sin x$이다.\n다시 미분하면 $y''=6-a\\cos x$이다.\n$-1\\le\\cos x\\le1$이므로 $y''$의 치역은 $[6-|a|,6+|a|]$이다.\n$a\\ne0$이므로 $6+|a|>0$이다.\n(i) $|a|\\le6$이면 $6-|a|\\ge0$이므로 $y''\\ge0$이 되어 부호가 바뀌지 않는다. 특히 $|a|=6$일 때는 $y''$가 $0$이 되는 점이 있어도 부호는 유지된다.\n(ii) $|a|>6$이면 $6-|a|<0<6+|a|$이므로 $y''$가 음수인 값과 양수인 값을 모두 가져 부호가 바뀌는 점이 생긴다.\n따라서 변곡점을 갖지 않으려면 $0\\ne|a|\\le6$, 즉 $a=\\pm1,\\pm2,\\cdots,\\pm6$이다.\n그 개수는 $6+6=12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-180",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
