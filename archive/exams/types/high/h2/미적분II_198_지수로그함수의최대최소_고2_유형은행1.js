window.examTitle = "미적분II_198_지수로그함수의최대최소_고2_유형은행1";

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
    "content": "$[-1/2,1]$에서 $f(x)=e^{2x}-2x$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$e^2-2$",
      "$e^2-1$",
      "$e^2$",
      "$e^2+1$",
      "$e^2+2$"
    ],
    "answer": "②",
    "solution": "닫힌구간에서 연속인 함수이므로 최댓값과 최솟값은 임계점과 끝점에서 생긴다.\n합성함수의 미분법으로 $f'(x)=2e^{2x}-2=2(e^{2x}-1)$이다.\n$e^{2x}-1=0$에서 $x=0$이고, $x<0$이면 $f'(x)<0$, $x>0$이면 $f'(x)>0$이다.\n따라서 $x=0$에서 최솟값 $f(0)=e^0-0=1$을 갖는다.\n끝점 $x=-\\frac12$에서 $f\\left(-\\frac12\\right)=e^{-1}-2\\left(-\\frac12\\right)=e^{-1}+1$이다.\n끝점 $x=1$에서 $f(1)=e^2-2$이다.\n$e>2$이므로 $e^{-1}+1<2<e^2-2$이고, 최댓값은 $e^2-2$이다.\n최댓값과 최솟값의 합은 $(e^2-2)+1=e^2-1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$[-2,2]$에서 $f(x)=(x+2)e^{-x}$의 최댓값은?",
    "choices": [
      "$e^{-1}$",
      "$1$",
      "$3/2$",
      "$2$",
      "$e$"
    ],
    "answer": "⑤",
    "solution": "닫힌구간에서 연속인 함수이므로 최댓값과 최솟값은 임계점과 끝점에서 생긴다.\n곱의 미분법으로 $f'(x)=e^{-x}+(x+2)(-e^{-x})=-(x+1)e^{-x}$이다.\n$e^{-x}>0$이므로 $f'(x)$의 부호는 $-(x+1)$의 부호와 같다.\n$-2<x<-1$에서 $f'(x)>0$이고, $-1<x<2$에서 $f'(x)<0$이다.\n따라서 $x=-1$에서 최댓값을 갖는다.\n$f(-1)=(-1+2)e^{-(-1)}=e$이다.\n끝점의 값은 $f(-2)=0$, $f(2)=4e^{-2}$이고 $4e^{-2}<e$이다.\n그러므로 최댓값은 $e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_DECAY",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$[0,5]$에서 $f(x)=(x^2-8)e^{-x}$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$e^{-4}-8$",
      "$2e^{-4}-8$",
      "$4e^{-4}-8$",
      "$6e^{-4}-8$",
      "$8e^{-4}-8$"
    ],
    "answer": "⑤",
    "solution": "닫힌구간에서 연속인 함수이므로 최댓값과 최솟값은 임계점과 끝점에서 생긴다.\n곱의 미분법으로 $f'(x)=2xe^{-x}+(x^2-8)(-e^{-x})$이다.\n이를 정리하면 $f'(x)=(-x^2+2x+8)e^{-x}=-(x-4)(x+2)e^{-x}$이다.\n구간 $[0,5]$에서 $x+2>0$, $e^{-x}>0$이므로 $f'(x)$의 부호는 $-(x-4)$의 부호와 같다.\n$0<x<4$에서 $f'(x)>0$이고, $4<x<5$에서 $f'(x)<0$이다.\n따라서 $x=4$에서 최댓값 $f(4)=(16-8)e^{-4}=8e^{-4}$를 갖는다.\n끝점의 값은 $f(0)=(0-8)e^0=-8$이다.\n또 $f(5)=(25-8)e^{-5}=17e^{-5}>0$이다.\n두 끝점의 값을 비교하면 최솟값은 $f(0)=-8$이다.\n최댓값과 최솟값의 합은 $8e^{-4}+(-8)=8e^{-4}-8$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
