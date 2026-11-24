window.examTitle = "미적분II_017_∞-∞꼴의수열의극한의활용_고2_유형은행1";

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
    "content": "원 $x^2+y^2=4n^2$와 곡선 $y=\\sqrt{2(x+2n)}$의 두 교점 사이 거리를 $d_n$이라고 하자. $\\lim_{n\\to\\infty}(4n-d_n)$은? [그림: 반지름 $2n$의 원과 $(-2n,0)$에서 시작하는 근호 곡선을 그리고 두 교점을 잇는다.]",
    "choices": [
      "$1/4$",
      "$1/2$",
      "$3/4$",
      "$1$",
      "$5/4$"
    ],
    "answer": "④",
    "solution": "1. 원과 곡선을 연립하기 위해 $y^2=2(x+2n)$을 원의 방정식에 대입한다.\n2. $x^2+2(x+2n)=4n^2$에서 $x^2+2x+4n-4n^2=0$이다.\n3. 인수분해하면 $(x+2n)(x-2n+2)=0$이다.\n4. 따라서 교점의 $x$좌표는 $x=-2n$ 또는 $x=2n-2$이고, 충분히 큰 $n$에서 두 교점은 $P(-2n,0)$, $Q(2n-2,\\sqrt{8n-4})$이다.\n5. 두 점 사이 거리의 제곱은 $d_n^2=(4n-2)^2+(8n-4)$이다.\n6. 전개하면 $d_n^2=16n^2-16n+4+8n-4=16n^2-8n$이다.\n7. 유리화하면 $4n-d_n=\\frac{16n^2-d_n^2}{4n+d_n}=\\frac{8n}{4n+d_n}$이다.\n8. 분모를 $n$으로 나누면 $4n-d_n=\\frac{8}{4+d_n/n}$이고, $d_n/n=\\sqrt{16-8/n}\\to4$이다.\n9. 따라서 극한은 $\\frac{8}{4+4}=1$이다.\n10. 주의: $x=2n-2$가 실제 교점이 되려면 $n>\\frac12$이어야 하므로 충분히 큰 $n$에서 생각한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION",
      "CC_IRRATIONAL_FUNCTION_GRAPH"
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
    "content": "원 $x^2+y^2=9n^2$과 $y=\\sqrt{5n}$의 제1사분면 교점의 $x$좌표를 $a_n$이라 하자. $\\lim_{n\\to\\infty}(3n-a_n)$은?",
    "choices": [
      "$1/6$",
      "$1/3$",
      "$1/2$",
      "$2/3$",
      "$5/6$"
    ],
    "answer": "⑤",
    "solution": "1. 교점은 $y=\\sqrt{5n}$을 원 $x^2+y^2=9n^2$에 대입하여 구한다.\n2. $x^2+5n=9n^2$이므로 $x^2=9n^2-5n$이다.\n3. 제1사분면이므로 $a_n=\\sqrt{9n^2-5n}$이다.\n4. 유리화하면 $3n-a_n=\\frac{9n^2-a_n^2}{3n+a_n}$이다.\n5. $a_n^2=9n^2-5n$을 대입하면 $3n-a_n=\\frac{5n}{3n+a_n}$이다.\n6. 분모와 분자를 $n$으로 나누면 $3n-a_n=\\frac{5}{3+a_n/n}$이다.\n7. $a_n/n=\\sqrt{9-5/n}$이고, $n\\to\\infty$일 때 $\\sqrt{9-5/n}\\to3$이다.\n8. 따라서 $3n-a_n\\to\\frac{5}{3+3}=\\frac56$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION"
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
    "content": "$y=3n/x$와 $y=4-x/n$의 두 교점 사이 거리를 $d_n$이라 하자. $\\lim_{n\\to\\infty}(d_{n+1}-d_n)$은? [그림: 제1사분면에서 두 곡선을 그리고 $x=n,3n$인 교점을 연결한다.]",
    "choices": [
      "$2$",
      "$5/2$",
      "$3$",
      "$7/2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "1. 두 곡선의 교점은 $\\frac{3n}{x}=4-\\frac{x}{n}$을 만족한다.\n2. 양변에 $nx$를 곱하면 $3n^2=4nx-x^2$이다.\n3. 정리하면 $x^2-4nx+3n^2=0$이다.\n4. 인수분해하면 $(x-n)(x-3n)=0$이므로 $x=n$ 또는 $x=3n$이다.\n5. $x=n$일 때 $y=3$이므로 교점은 $A(n,3)$이다.\n6. $x=3n$일 때 $y=1$이므로 교점은 $B(3n,1)$이다.\n7. 두 점 사이 거리는 $d_n=\\sqrt{(3n-n)^2+(1-3)^2}=2\\sqrt{n^2+1}$이다.\n8. 따라서 $d_{n+1}-d_n=2\\left(\\sqrt{(n+1)^2+1}-\\sqrt{n^2+1}\\right)$이다.\n9. 유리화하면 $d_{n+1}-d_n=2\\cdot\\frac{(n+1)^2+1-(n^2+1)}{\\sqrt{(n+1)^2+1}+\\sqrt{n^2+1}}$이다.\n10. 분자를 계산하면 $2\\cdot\\frac{2n+1}{\\sqrt{n^2+2n+2}+\\sqrt{n^2+1}}$이다.\n11. 분모와 분자를 $n$으로 나누면 $2\\cdot\\frac{2+1/n}{\\sqrt{1+2/n+2/n^2}+\\sqrt{1+1/n^2}}$이다.\n12. $n\\to\\infty$일 때 분자는 $4$, 분모는 $1+1=2$로 가므로 극한은 $\\frac42=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION",
      "CC_RATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
