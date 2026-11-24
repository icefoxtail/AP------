window.examTitle = "미적분II_184_판별식을이용하지않는극값을가질조건_고2_유형은행1";

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
    "content": "$f(x)=\\sin(2x)+(a-1)x$가 극값을 가질 때, 실수 $a$의 범위는?",
    "choices": [
      "$-2<a<2$",
      "$-3<a<1$",
      "$-1<a<2$",
      "$0<a<3$",
      "$-1<a<3$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 $f'(x)=2\\cos(2x)+(a-1)$이다.\n$\\cos(2x)$의 치역이 $[-1,1]$이므로 $f'(x)$의 최솟값은 $a-3$, 최댓값은 $a+1$이다.\n$f'$은 연속이고, 극값이 생기려면 $f'$의 부호가 바뀌어야 하므로 $a-3<0<a+1$이 필요하다.\n즉 $a<3$이고 $a>-1$이므로 $-1<a<3$이다.\n이때 $f'$이 음수와 양수 값을 모두 가지므로 중간값 정리에 의해 부호가 바뀌는 점이 존재한다.\n주의: $a=-1$이면 $f'(x)=2\\cos(2x)-2\\le0$, $a=3$이면 $f'(x)=2\\cos(2x)+2\\ge0$이어서 부호가 바뀌지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_COSINE_FUNCTION_RANGE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=ax+3\\cos x$가 극값을 갖지 않도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$|a|\\ge3$",
      "$|a|>3$",
      "$|a|\\le3$",
      "$|a|<3$",
      "$|a|\\ge1$"
    ],
    "answer": "①",
    "solution": "코사인 함수의 미분 공식으로 $f'(x)=a-3\\sin x$이다.\n$\\sin x$의 치역이 $[-1,1]$이므로 $f'(x)$의 치역은 $[a-3,a+3]$이다.\n극값이 없으려면 연속인 $f'$의 부호가 바뀌지 않아야 한다.\n(i) 모든 $x$에서 $f'(x)\\ge0$인 경우: 최솟값 $a-3\\ge0$이므로 $a\\ge3$이다.\n이때 $f$는 단조증가하므로 극값이 없다.\n(ii) 모든 $x$에서 $f'(x)\\le0$인 경우: 최댓값 $a+3\\le0$이므로 $a\\le-3$이다.\n이때 $f$는 단조감소하므로 극값이 없다.\n반대로 $-3<a<3$이면 최솟값 $a-3<0$이고 최댓값 $a+3>0$이므로 $f'$이 음수와 양수 값을 모두 가진다.\n따라서 $f'$의 부호가 바뀌어 극값이 생긴다.\n(i), (ii)를 합치면 $a\\le-3$ 또는 $a\\ge3$, 즉 $|a|\\ge3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=4x+k\\cos(2x)$가 극값을 갖도록 하는 실수 $k$의 범위는?",
    "choices": [
      "$|k|<1$",
      "$|k|\\le2$",
      "$|k|\\ge2$",
      "$|k|>4$",
      "$|k|>2$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 $f'(x)=4-2k\\sin(2x)$이다.\n$\\sin(2x)$의 치역이 $[-1,1]$이므로 $f'(x)$의 치역은 $[4-2|k|,4+2|k|]$이다.\n최댓값 $4+2|k|$는 항상 양수이므로, 극값이 생기려면 최솟값이 음수여야 한다.\n즉 $4-2|k|<0$에서 $2|k|>4$, $|k|>2$이다.\n이때 $f'$이 음수와 양수 값을 모두 가지므로 중간값 정리에 의해 부호가 바뀌는 점이 존재한다.\n주의: $|k|=2$이면 최솟값이 $0$이 되어 $f'(x)\\ge0$이므로 부호가 바뀌지 않는다.\n따라서 $|k|>2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
