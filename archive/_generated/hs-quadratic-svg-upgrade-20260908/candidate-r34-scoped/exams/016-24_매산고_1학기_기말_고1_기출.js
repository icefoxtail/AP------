window.examTitle = "24_매산고_1학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "여러 가지 부등식",
    "originalCategory": "여러 가지 부등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-08",
    "standardUnit": "여러 가지 부등식",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "부등식",
      "정수조건",
      "개수세기"
    ],
    "wide": false,
    "content": "연립부등식 $\\begin{cases} x+6 \\le 3x \\\\ 12-x \\gt x+2 \\end{cases}$ 를 만족시키는 모든 정수 $x$의 개수는? [3.6점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "[키포인트]\n두 부등식을 각각 풀어 공통으로 만족하는 정수만 센다.\n\n조건 정리\n첫 번째 부등식은 $x+6\\le3x$, 두 번째 부등식은 $12-x\\gt x+2$이다. 두 조건을 동시에 만족해야 한다.\n\n풀이 과정\n먼저 첫 번째 부등식을 풀면\n$x+6\\le3x$\n$6\\le2x$\n따라서 $x\\ge3$이다.\n\n두 번째 부등식을 풀면\n$12-x\\gt x+2$\n$10\\gt2x$\n따라서 $x\\lt5$이다.\n\n두 조건을 함께 쓰면\n$3\\le x\\lt5$이다.\n이 범위에 있는 정수는 $3, 4$로 모두 $2$개이다.\n\n결론\n따라서 정답은 ②이다.",
    "subUnitKey": "H15-SA-08-INEQUALITY_BASIC",
    "subUnit": "부등식의 풀이",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category",
    "solutionImage": "archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r14/assets/hs-r14-001.svg",
    "solutionImageAlt": "이차함수·이차부등식의 핵심 조건과 해집합을 확인하는 후보 해설 시각자료",
    "solutionImageCaption": "후보 SVG: 독립 계산으로 확정한 구간·끝점·꼭짓점·핵심 값을 그림에서 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 2,
    "level": "하",
    "category": "여러 가지 부등식",
    "originalCategory": "여러 가지 부등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-08",
    "standardUnit": "여러 가지 부등식",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차부등식",
      "계수비교"
    ],
    "wide": false,
    "content": "이차부등식 $x^2+ax+b\\lt0$의 해가 $-2\\lt x\\lt3$일 때, 상수 $a, b$에 대하여 $a+b$의 값은? [3.7점]",
    "choices": [
      "$-1$",
      "$-3$",
      "$-5$",
      "$-7$",
      "$-9$"
    ],
    "answer": "④",
    "solution": "[키포인트]\n이차부등식의 해 구간 양 끝값은 이차식의 두 근이다.\n\n조건 정리\n$x^2+ax+b\\lt0$의 해가 $-2\\lt x\\lt3$이다. 최고차항의 계수가 양수이므로 이차식은 두 근 사이에서 음수가 된다.\n\n풀이 과정\n해 구간의 양 끝값이 $-2$, $3$이므로\n$x^2+ax+b=(x+2)(x-3)$이다.\n전개하면\n$(x+2)(x-3)=x^2-x-6$이다.\n\n따라서 계수를 비교하면\n$a=-1$, $b=-6$이다.\n그러므로\n$a+b=-1+(-6)=-7$이다.\n\n결론\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY",
    "subUnit": "이차부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category",
    "solutionImage": "archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r14/assets/hs-r14-003.svg",
    "solutionImageAlt": "이차함수·이차부등식의 핵심 조건과 해집합을 확인하는 후보 해설 시각자료",
    "solutionImageCaption": "후보 SVG: 독립 계산으로 확정한 구간·끝점·꼭짓점·핵심 값을 그림에서 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 13,
    "level": "중",
    "category": "여러 가지 부등식",
    "originalCategory": "여러 가지 부등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-08",
    "standardUnit": "여러 가지 부등식",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "절댓값",
      "부등식"
    ],
    "wide": false,
    "content": "$x$에 대한 부등식 $|x-4|\\lt|x-2|\\lt|x-6|$의 해가 $a\\lt x\\lt b$일 때, 상수 $a,b$에 대하여 $ab$의 값은? [4.8점]",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "④",
    "solution": "[키포인트]\n절댓값은 두 점 사이의 거리로 해석하여 각각의 부등식을 나누어 푼다.\n\n조건 정리\n$|x-4|\\lt|x-2|$는 수직선에서 $x$가 $4$에 더 가깝다는 뜻이고, $|x-2|\\lt|x-6|$는 $x$가 $2$에 더 가깝다는 뜻이다.\n\n풀이 과정\n먼저 $|x-4|\\lt|x-2|$를 풀자.\n양변은 모두 $0$ 이상이므로 제곱해도 부등호 방향이 바뀌지 않는다.\n$(x-4)^2\\lt(x-2)^2$\n$x^2-8x+16\\lt x^2-4x+4$\n$-8x+16\\lt-4x+4$\n$12\\lt4x$\n$x\\gt3$이다.\n\n다음으로 $|x-2|\\lt|x-6|$를 풀면\n$(x-2)^2\\lt(x-6)^2$\n$x^2-4x+4\\lt x^2-12x+36$\n$8x\\lt32$\n$x\\lt4$이다.\n\n두 조건을 동시에 만족해야 하므로\n$3\\lt x\\lt4$이다.\n따라서 $a=3$, $b=4$이고\n$ab=3\\times4=12$이다.\n\n결론\n따라서 정답은 ④이다.",
    "subUnitKey": "H15-SA-08-ABSOLUTE_INEQUALITY",
    "subUnit": "절댓값 부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category",
    "solutionImage": "archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r14/assets/hs-r14-002.svg",
    "solutionImageAlt": "이차함수·이차부등식의 핵심 조건과 해집합을 확인하는 후보 해설 시각자료",
    "solutionImageCaption": "후보 SVG: 독립 계산으로 확정한 구간·끝점·꼭짓점·핵심 값을 그림에서 확인한다.",
    "solutionImageSize": "full"
  }
];
