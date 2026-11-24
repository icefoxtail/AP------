window.examTitle = "미적분II_175_곡선밖의점에서접선의개수_고2_유형은행1";

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
    "content": "점 $(a,0)$에서 곡선 $y=xe^{2x-1}$에 서로 다른 두 접선을 그을 수 있는 실수 $a$의 범위는?",
    "choices": [
      "$a<-2$",
      "$-2<a<0$",
      "$a<-2\\ \\text{또는}\\ a>0$",
      "$a>0$",
      "$a>-2$"
    ],
    "answer": "③",
    "solution": "접점을 $x=t$라 하면 $f(t)=te^{2t-1}$이고, 곱의 미분법으로 $f'(t)=(1+2t)e^{2t-1}$이다.\n접선의 방정식은 $y-te^{2t-1}=(1+2t)e^{2t-1}(x-t)$이다.\n점 $(a,0)$을 대입하고 $e^{2t-1}(>0)$로 나누면 $-t=(1+2t)(a-t)$이다.\n전개하면 $-t=a-t+2at-2t^2$이므로 $t^2-at-\\frac a2=0$이다.\n서로 다른 두 접점이 생길 조건은 판별식 $D=a^2+2a=a(a+2)>0$이다.\n(i) $a<0$이고 $a+2<0$이면 $a<-2$이다.\n(ii) $a>0$이고 $a+2>0$이면 $a>0$이다.\n주의: 두 접점이 같은 접선을 주는 경우는 없다. 그런 경우 $g(x)=f(x)-(mx+n)$이 두 점에서 중근을 가지므로 롤의 정리로 $g''=f''$가 두 번 이상 $0$이어야 하는데, $f''(t)=4(1+t)e^{2t-1}$의 영점은 $t=-1$ 하나뿐이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
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
    "content": "$a\\ne0$일 때 점 $(a,0)$에서 $y=xe^{-x/2}$에 오직 한 개의 접선을 그을 수 있다. $a$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "①",
    "solution": "접점을 $x=t$라 하면 $f(t)=te^{-t/2}$이고, 곱의 미분법으로 $f'(t)=\\left(1-\\frac t2\\right)e^{-t/2}$이다.\n접선 $y-te^{-t/2}=\\left(1-\\frac t2\\right)e^{-t/2}(x-t)$에 $(a,0)$을 대입한다.\n$e^{-t/2}(>0)$로 나누면 $-t=\\left(1-\\frac t2\\right)(a-t)$이다.\n전개하면 $-t=a-t-\\frac{at}{2}+\\frac{t^2}{2}$이므로 양변에 $2$를 곱해 $t^2-at+2a=0$을 얻는다.\n서로 다른 두 접점이 같은 접선을 주려면 $f''(t)=\\left(\\frac t4-1\\right)e^{-t/2}$가 두 번 이상 $0$이어야 하는데, 그 영점은 $t=4$ 하나뿐이므로 불가능하다.\n따라서 오직 한 접선을 그으려면 접점이 하나, 즉 위 이차방정식이 중근을 가져야 한다.\n판별식 $D=a^2-8a=a(a-8)=0$에서 $a=0$ 또는 $a=8$이다.\n$a\\ne0$이므로 $a=8$이고, 이때 접점은 $t=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "점 $(a,0)$에서 곡선 $y=xe^{x/2}$에 접선을 하나도 그을 수 없도록 하는 정수 $a$의 개수는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "접점을 $x=t$라 하면 $f(t)=te^{t/2}$, $f'(t)=\\left(1+\\frac t2\\right)e^{t/2}$이다.\n접선 $y-te^{t/2}=\\left(1+\\frac t2\\right)e^{t/2}(x-t)$에 $(a,0)$을 대입한다.\n$e^{t/2}(>0)$로 나누면 $-t=\\left(1+\\frac t2\\right)(a-t)$이다.\n전개하면 $-t=a-t+\\frac{at}{2}-\\frac{t^2}{2}$이므로 $\\frac{t^2}{2}-\\frac{at}{2}-a=0$이다.\n양변에 $2$를 곱하면 $t^2-at-2a=0$이다.\n접선을 하나도 그을 수 없으려면 이 방정식이 실근을 갖지 않아야 한다.\n판별식 $D=a^2+8a=a(a+8)<0$에서 $-8<a<0$이다.\n이 범위의 정수는 $-7,-6,-5,-4,-3,-2,-1$의 $7$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
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
    "content": "점 $(a,0)$에서 곡선 $y=e^{-2x^2}$에 서로 다른 두 접선을 그을 수 있는 범위가 $a<\\alpha$ 또는 $a>\\beta$이다. $\\alpha^2+\\beta^2$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "접점을 $x=t$라 하면 $f(t)=e^{-2t^2}$이고, 합성함수의 미분법으로 $f'(t)=-4te^{-2t^2}$이다.\n접선은 $y-e^{-2t^2}=-4te^{-2t^2}(x-t)$이다.\n$(a,0)$을 대입하고 $e^{-2t^2}(>0)$로 나누면 $-1=-4t(a-t)$이다.\n정리하면 $4t^2-4at+1=0$이다.\n서로 다른 두 접점이 생길 조건은 판별식 $D=16a^2-16=16(a-1)(a+1)>0$이다.\n(i) $a<-1$이면 $a-1<0$, $a+1<0$이므로 성립한다.\n(ii) $a>1$이면 $a-1>0$, $a+1>0$이므로 성립한다.\n두 접점이 같은 접선을 준다면 롤의 정리로 $f''$가 두 번 이상 $0$이어야 한다.\n$f''(t)=(16t^2-4)e^{-2t^2}=4(2t-1)(2t+1)e^{-2t^2}$의 영점은 $t=\\pm\\frac12$뿐이고, 두 근의 곱이 $\\frac14>0$이라 두 접점은 같은 부호이다.\n같은 부호의 두 점 사이에는 $\\pm\\frac12$ 중 많아야 하나만 있으므로 $f''$가 두 번 $0$일 수 없다.\n따라서 두 접선은 서로 다르고, $\\alpha=-1$, $\\beta=1$이다.\n$\\alpha^2+\\beta^2=(-1)^2+1^2=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "원점에서 곡선 $y=(x-a)e^{-2x}$ $(a\\ne0)$에 오직 한 개의 접선을 그을 수 있다. $a$의 값은?",
    "choices": [
      "$-4$",
      "$-2$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "접점을 $x=t$라 하면 $f(t)=(t-a)e^{-2t}$이다.\n곱의 미분법으로 $f'(t)=e^{-2t}-2(t-a)e^{-2t}=\\{1-2(t-a)\\}e^{-2t}$이다.\n접선 $y-f(t)=f'(t)(x-t)$가 원점 $(0,0)$을 지나므로 $-f(t)=-tf'(t)$, 즉 $f(t)=tf'(t)$이다.\n$e^{-2t}(>0)$로 나누면 $t-a=t\\{1-2(t-a)\\}$이다.\n전개하면 $t-a=t-2t^2+2at$이므로 $2t^2-2at-a=0$이다.\n서로 다른 두 접점이 같은 접선을 주려면 $f''(t)=4(t-a-1)e^{-2t}$가 두 번 이상 $0$이어야 하는데, 그 영점은 $t=a+1$ 하나뿐이므로 불가능하다.\n따라서 오직 한 접선을 그으려면 위 이차방정식이 중근을 가져야 한다.\n판별식 $D=4a^2+8a=4a(a+2)=0$에서 $a=0$ 또는 $a=-2$이다.\n$a\\ne0$이므로 $a=-2$이고, 이때 중근은 $t=-1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "점 $(k,0)$에서 곡선 $y=(x-1)e^{(x-1)/2}$에 서로 다른 두 접선을 그을 수 없도록 하는 정수 $k$의 개수는?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "④",
    "solution": "평행이동 $u=x-1$을 하면 곡선은 $y=ue^{u/2}$이고, 점 $(k,0)$은 $(b,0)$으로 옮겨지며 $b=k-1$이다.\n접점을 $u=t$라 하면 $f(t)=te^{t/2}$, $f'(t)=\\left(1+\\frac t2\\right)e^{t/2}$이다.\n접선 $y-te^{t/2}=\\left(1+\\frac t2\\right)e^{t/2}(u-t)$에 $(b,0)$을 대입한다.\n$e^{t/2}(>0)$로 나누면 $-t=\\left(1+\\frac t2\\right)(b-t)$이다.\n전개하면 $-t=b-t+\\frac{bt}{2}-\\frac{t^2}{2}$이므로 $t^2-bt-2b=0$이다.\n서로 다른 두 접점이 같은 접선을 주는 경우는 없다. 왜냐하면 $f''(t)=\\left(1+\\frac t4\\right)e^{t/2}$의 영점이 $t=-4$ 하나뿐이기 때문이다.\n따라서 서로 다른 두 접선을 그을 수 없으려면 실근이 많아야 하나, 즉 판별식 $D=b^2+8b=b(b+8)\\le0$이다.\n$-8\\le b\\le0$이고 $b=k-1$이므로 $-7\\le k\\le1$이다.\n이 범위의 정수는 $-7,-6,-5,-4,-3,-2,-1,0,1$의 $9$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
