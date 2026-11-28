/* 2025 순천매산여고 고1 2학기 기말 공통수학2 — SOURCE_BALANCED 유사1.
 * 문제·해설·정답: 신규 작성. SVG 제작은 별도 Codex 엔진 담당.
 * 원본 대응 23문항 / 객관식20 + 서술형3 / 100점.
 * 검증: 생성 스크립트의 구조검증을 통과. 수학 검산 결과는 별도 보고서를 참조.
 */
window.examTitle = "25_매산여고_2학기_기말_고1_유사";
window.examDisplayTitle = "2025 순천매산여고 고1 2학기 기말 공통수학2 유사1";
window.questionBank = [
  {
    "id": 1,
    "number": 1,
    "score": 3.7,
    "points": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "실수 $x$에 대한 명제 “$x\\le 2k+1$이면 $4x-3<21$이다”가 참이 되도록 하는 정수 $k$의 최댓값을 구하시오. [3.7점]",
    "choices": [
      "$0$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "$4x-3<21$은 $x<6$과 동치이다. 전제 $x\\le2k+1$에 속한 모든 실수가 $x<6$을 만족해야 하므로 $2k+1<6$이다. 따라서 $k<\\frac52$이고 정수 $k$의 최댓값은 $2$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 1,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q1",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-06",
    "subUnitKey": "H22-C2-06-CORE",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnit": "명제 핵심 개념",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_IMPLICATION_INTERVAL_PARAMETER",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_TRUTH_SET_INCLUSION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 2,
    "number": 2,
    "score": 3.6,
    "points": 3.6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "전체집합 $U=\\{1,2,\\ldots,8\\}$의 부분집합 $A,B$가 $A-(A-B)=\\{2,6\\}$, $(A\\cup B^C)^C=\\{1,3,8\\}$를 만족한다. $B$의 원소의 개수는? [3.6점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "집합의 차와 분배법칙에서 $A-(A-B)=A\\cap(A-B)^C=A\\cap(A^C\\cup B)=A\\cap B$이므로 $A\\cap B=\\{2,6\\}$이다. 드모르간 법칙에 의해 $(A\\cup B^C)^C=A^C\\cap B=\\{1,3,8\\}$이다. 두 집합은 서로소이고 합집합이 $B$이므로 $B=\\{1,2,3,6,8\\}$, $|B|=5$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 2,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q2",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-05",
    "subUnitKey": "H22-C2-05-CORE",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnit": "집합 핵심 개념",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-241",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_SET_DIFFERENCE_COMPLEMENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 3,
    "number": 3,
    "score": 3.7,
    "points": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "집합 $X=\\{1,2,4\\}$의 두 전단사 함수가 $f(1)=2,f(2)=4,f(4)=1$, $g(1)=4,g(2)=1,g(4)=2$로 주어진다. $(g\\circ f^{-1})(4)+(g\\circ f)^{-1}(2)$의 값은? [3.7점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$f^{-1}(4)=2$이므로 $g(f^{-1}(4))=g(2)=1$이다. 또 $(g\\circ f)(2)=g(4)=2$이므로 $(g\\circ f)^{-1}(2)=2$이다. 두 값을 더하면 $1+2=3$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 3,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q3",
    "image": "assets/images/25_매산여고_2학기_기말_고1_유사/q3-problem.svg",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q3-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "BENEFICIAL",
        "reason": "대응표는 글로 완결되지만 화살표도가 합성·치역 구조 이해에 유익함"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "합성 및 역함수 대응 화살표 추적을 단계별 강조"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "합성함수",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-253",
    "problemTypeKey": "PT_INVERSE_COMPOSITION",
    "templateKey": "TPL_INVERSE_COMPOSITION_VALUE",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_BIJECTION"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "sourceDiagramModel": {
      "X": [
        1,
        2,
        4
      ],
      "f": [
        [
          1,
          2
        ],
        [
          2,
          4
        ],
        [
          4,
          1
        ]
      ],
      "g": [
        [
          1,
          4
        ],
        [
          2,
          1
        ],
        [
          4,
          2
        ]
      ]
    },
    "imageAlt": "발문에 주어진 두 전단사 함수 f와 g의 원소별 대응을 표시한다.",
    "imageCaption": "발문에 주어진 두 전단사 함수 f와 g의 원소별 대응을 표시한다.",
    "imageSize": "full",
    "solutionImageAlt": "함수 f와 g의 화살표를 정방향·역방향으로 따라 합성함수와 역함수의 값을 결정한다.",
    "solutionImageCaption": "함수 f와 g의 화살표를 정방향·역방향으로 따라 합성함수와 역함수의 값을 결정한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 4,
    "number": 4,
    "score": 3.5,
    "points": 3.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "모든 허용된 실수 $x$에 대하여 $\\frac2x-\\frac5{x(x+3)}=\\frac{bx+c}{x^2+ax}$가 성립한다. $a+b+c$의 값은? [3.5점]",
    "choices": [
      "$0$",
      "$3$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "좌변을 통분하면 $\\frac{2(x+3)-5}{x(x+3)}=\\frac{2x+1}{x(x+3)}$이다. 항등식이므로 $a=3,b=2,c=1$이고 $a+b+c=6$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 4,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q4",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-263",
    "problemTypeKey": "PT_RATIONAL_EXPRESSION",
    "templateKey": "TPL_RATIONAL_EXPRESSION_SIMPLIFY",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 5,
    "number": 5,
    "score": 3.6,
    "points": 3.6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "함수 $y=\\sqrt{3x-6}+2$의 정의역이 $[a,\\infty)$, 치역이 $[b,\\infty)$일 때 $a+b$를 구하면? [3.6점]",
    "choices": [
      "$-2$",
      "$0$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "근호 안은 $3x-6\\ge0$이어야 하므로 $x\\ge2$, 즉 $a=2$이다. 제곱근은 항상 $0$ 이상이고 $x=2$일 때 $0$이므로 $b=2$이다. 따라서 $a+b=4$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 5,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q5",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-268",
    "problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY",
    "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION_DOMAIN_RANGE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 6,
    "number": 6,
    "score": 3.8,
    "points": 3.8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$y=\\frac{3x+10}{x+3}$을 $x$축 방향으로 $p$, $y$축 방향으로 $q$만큼 평행이동했더니 $y=\\frac{5x-9}{x-2}$가 되었다. $p+q$는? [3.8점]",
    "choices": [
      "$-2$",
      "$3$",
      "$5$",
      "$7$",
      "$10$"
    ],
    "answer": "④",
    "solution": "두 식은 각각 $y=3+\\frac1{x+3}$과 $y=5+\\frac1{x-2}$이다. 수직점근선 $x=-3$이 $x=2$로 움직여 $p=5$, 수평점근선 $y=3$이 $y=5$로 움직여 $q=2$이다. 따라서 $p+q=7$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 6,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q6",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q6-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "점근선의 수평·수직 이동을 시각적으로 대조"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-260",
    "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
    "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION_ASYMPTOTE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "원래 점근선 (-3,3)에서 이동 후 (2,5)로 옮겨진다.",
    "solutionImageCaption": "원래 점근선 (-3,3)에서 이동 후 (2,5)로 옮겨진다.",
    "solutionImageSize": "full"
  },
  {
    "id": 7,
    "number": 7,
    "score": 3.8,
    "points": 3.8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$0\\le x\\le1$에서 무리함수 $y=\\sqrt{-5x+a}+1$의 최댓값이 $4$이다. 이 함수의 최솟값은? [3.8점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$-5x+a$는 $x$가 증가할 때 감소하므로 최댓값은 왼쪽 끝 $x=0$에서 얻는다. $\\sqrt a+1=4$에서 $a=9$이다. 따라서 오른쪽 끝 $x=1$에서 최솟값 $\\sqrt{9-5}+1=3$을 얻는다. 먼저 최대 조건을 해석한 뒤 반대쪽 끝에서 최소를 구해야 한다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 7,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q7",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-269",
    "problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY",
    "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_EXTREMUM",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 8,
    "number": 8,
    "score": 3.9,
    "points": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$x>2$에서 함수 $y=x+\\frac4{x-2}$가 최솟값 $m$을 갖는 지점을 $x=t$라 할 때 $m+t$를 구하면? [3.9점]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "$u=x-2>0$으로 놓으면 $y=u+\\frac4u+2\\ge2\\sqrt4+2=6$이다. 등호는 $u=2$, 즉 $x=4$에서 성립한다. $m=6,t=4$이므로 $m+t=10$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 8,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q8",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-264",
    "problemTypeKey": "PT_FUNCTION_EXTREMUM",
    "templateKey": "TPL_FUNCTION_EXTREMUM_INEQUALITY",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_AM_GM"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 9,
    "number": 9,
    "score": 3.9,
    "points": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "두 함수 $f(x)=x^3-6x^2+13x-7$, $g(x)=2x-1$에 대하여, 공집합이 아닌 실수의 부분집합 $X$의 모든 원소에서 $f(x)=g(x)$가 성립하도록 하는 집합 $X$의 개수는? [3.9점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$15$",
      "$16$"
    ],
    "answer": "①",
    "solution": "$f(x)-g(x)=x^3-6x^2+11x-6=(x-1)(x-2)(x-3)$이다. 두 함수가 일치하는 실수는 $1,2,3$의 세 개다. $X$는 이 세 원소로 이루어진 집합의 공집합이 아닌 부분집합이므로 개수는 $2^3-1=7$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 9,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q9",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-251",
    "problemTypeKey": "PT_FUNCTION_EQUALITY",
    "templateKey": "TPL_EQUAL_FUNCTION_DOMAIN_SELECTION",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_SUBSET_COUNTING"
    ],
    "conditionKeys": [
      "COND_NONEMPTY_SELECTION"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 10,
    "number": 10,
    "score": 4.1,
    "points": 4.1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "두 조건 $p:-6<x\\le15$, $q:(x-a)(x-3a)>0$에 대해 $\\sim q$가 $p$이기 위한 충분조건이 되게 하는 정수 $a$의 개수는? [4.1점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "$\\sim q$의 진리집합은 두 근 $a,3a$ 사이의 닫힌 구간 $[\\min(a,3a),\\max(a,3a)]$이다. 이 구간이 $(-6,15]$에 포함되어야 한다. $a\\ge0$일 때 $3a\\le15$이므로 $a=0,1,2,3,4,5$이고, $a<0$일 때 $3a>-6$이므로 $a=-1$뿐이다. 총 $6+1=7$개이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 10,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q10",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q10-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "부정 진리집합과 반열린 구간의 경계 포함관계"
      }
    },
    "standardUnitKey": "H22-C2-06",
    "subUnitKey": "H22-C2-06-CORE",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnit": "명제 핵심 개념",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_IMPLICATION_INTERVAL_PARAMETER",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_TRUTH_SET_INCLUSION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "a=5를 예로 들면 ¬q의 닫힌구간이 p에 포함되어야 하며 p의 열린·닫힌 끝점을 구분한다.",
    "solutionImageCaption": "a=5를 예로 들면 ¬q의 닫힌구간이 p에 포함되어야 하며 p의 열린·닫힌 끝점을 구분한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 11,
    "number": 11,
    "score": 4,
    "points": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "분수함수 $y=2+\\frac3{x-1}$의 그래프에 대하여 <보기>의 진술 중 옳은 것만을 있는 대로 고른 것은?\n<br><보기><br>ㄱ. 점근선은 $x=1$, $y=2$이다.<br>ㄴ. 그래프는 제3사분면을 지나지 않는다.<br>ㄷ. 직선 $y=x+1$에 대하여 대칭이다. [4점]",
    "choices": [
      "$\\text{ㄱ}$",
      "$\\text{ㄴ}$",
      "$\\text{ㄱ, ㄴ}$",
      "$\\text{ㄱ, ㄷ}$",
      "$\\text{ㄱ, ㄴ, ㄷ}$"
    ],
    "answer": "④",
    "solution": "함수는 $y=2+\\frac3{x-1}$이므로 수직점근선 $x=1$과 수평점근선 $y=2$를 갖는다. 따라서 ㄱ은 참이다. $x=-\\frac14$이면 $y=2+\\frac3{-5/4}=-\\frac25<0$이므로 제3사분면을 지나 ㄴ은 거짓이다. 중심 $(1,2)$에서 기울기 $1$인 대칭축은 $y-2=x-1$, 즉 $y=x+1$이므로 ㄷ은 참이다. 정답은 ㄱ, ㄷ이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 11,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q11",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q11-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "세 그래프 진술 ㄱ·ㄴ·ㄷ 중 제3사분면 반례와 대칭축을 한 그림에서 비교"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-261",
    "problemTypeKey": "PT_RATIONAL_ASYMPTOTE",
    "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_QUADRANT_PASSAGE",
      "CC_RATIONAL_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "점근선 x=1, y=2와 대칭축 y=x+1, 제3사분면을 지나는 가지를 확인한다.",
    "solutionImageCaption": "점근선 x=1, y=2와 대칭축 y=x+1, 제3사분면을 지나는 가지를 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 12,
    "number": 12,
    "score": 4.1,
    "points": 4.1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "실수 전체에서 정의된 함수 $f(x)=a|2x-1|+6x-3$이 실수 전체로의 일대일대응이 되도록 하는 실수 $a$의 범위는? [4.1점]",
    "choices": [
      "$-3<a<3$",
      "$-3\\le a\\le3$",
      "$a<-3\\text{ 또는 }a>3$",
      "$-6<a<6$",
      "$a<3$"
    ],
    "answer": "①",
    "solution": "절댓값 안이 음수인 구간에서는 기울기가 $6-2a$, 양수인 구간에서는 $6+2a$이다. 연속인 두 반직선의 함수가 실수 전체로 일대일대응이 되려면 두 기울기가 모두 양수이거나 모두 음수여야 한다. 합이 $12>0$이므로 둘 다 양수여야 하며 $6-2a>0$, $6+2a>0$에서 $-3<a<3$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 12,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q12",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q12-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "절댓값 그래프 꺾임점의 양쪽 기울기 및 경계"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-257",
    "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
    "templateKey": "TPL_ABSOLUTE_VALUE_INJECTIVITY",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_FUNCTION_BIJECTION"
    ],
    "integrationPattern": "CASE_BRANCH",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "a=2인 대표 그래프는 두 기울기가 양수여서 끊어짐 없이 증가한다. 절댓값 꺾임점은 (1/2,0)이다.",
    "solutionImageCaption": "a=2인 대표 그래프는 두 기울기가 양수여서 끊어짐 없이 증가한다. 절댓값 꺾임점은 (1/2,0)이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 13,
    "number": 13,
    "score": 3.9,
    "points": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "함수 $y=-\\sqrt{-3x+6}-1$을 먼저 $y$축에 대하여 대칭이동한 다음 왼쪽으로 $1$, 위쪽으로 $3$만큼 평행이동하였다. 결과의 식이 $y=-\\sqrt{ax+b}+c$일 때 $a+b-c$의 값은? [3.9점]",
    "choices": [
      "$-14$",
      "$-10$",
      "$-4$",
      "$8$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "먼저 $x$를 $-x$로 바꾸면 $y=-\\sqrt{3x+6}-1$이다. 이어 왼쪽으로 $1$ 평행이동하면 $y=-\\sqrt{3(x+1)+6}-1=-\\sqrt{3x+9}-1$이고 위쪽으로 $3$ 옮기면 $y=-\\sqrt{3x+9}+2$이다. 따라서 $a=3,b=9,c=2$이고 $a+b-c=3+9-2=10$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 13,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q13",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q13-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "평행이동 뒤 y축 반사 순서의 그래프 좌표 추적"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-267",
    "problemTypeKey": "PT_FUNCTION_RECOVERY",
    "templateKey": "TPL_RECOVER_FUNCTION_BY_INPUT_CHANGE",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "원함수와 이동·대칭 후 최종 무리함수의 방향 및 시작점이 서로 달라짐을 비교한다.",
    "solutionImageCaption": "원함수와 이동·대칭 후 최종 무리함수의 방향 및 시작점이 서로 달라짐을 비교한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 14,
    "number": 14,
    "score": 4.2,
    "points": 4.2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$-9\\le x\\le-4$에서 $y=2-\\frac6{x-2}$와 $y=\\sqrt{-x}+k$의 그래프가 오직 한 점에서 만나게 하는 실수 $k$의 최댓값은? [4.2점]",
    "choices": [
      "$-2$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "②",
    "solution": "교점은 $k=h(x)=2-\\frac6{x-2}-\\sqrt{-x}$를 만족하는 $x$이다. 주어진 구간에서 첫 항의 분수함수는 엄격히 증가하고 $\\sqrt{-x}$는 엄격히 감소하므로 $h$는 엄격히 증가한다. 따라서 정확히 한 교점은 $h(-9)\\le k\\le h(-4)$와 동치이고 최댓값은 $h(-4)=2-\\frac6{-6}-2=1$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 14,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q14",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q14-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "제한구간에서 차 함수의 단조성과 교점 한 개"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-272",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_GRAPH_INTERSECTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION_COUNT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "닫힌 구간 오른쪽 끝 x=-4에서 교점이 생기고 그때 k=1이다.",
    "solutionImageCaption": "닫힌 구간 오른쪽 끝 x=-4에서 교점이 생기고 그때 k=1이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 15,
    "number": 15,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$X=\\{1,2,3,4\\}$에서 $f(1)=3,f(2)=4,f(3)=3,f(4)=1$이다. 함수 $g:X\\to X$에 대하여 합성함수 $g\\circ f$의 치역에 속하는 원소가 정확히 $2$개가 되게 하는 $g$의 개수는? [4.3점]",
    "choices": [
      "$36$",
      "$72$",
      "$96$",
      "$144$",
      "$192$"
    ],
    "answer": "④",
    "solution": "$f(X)=\\{1,3,4\\}$이므로 $g\\circ f$의 치역은 $\\{g(1),g(3),g(4)\\}$이다. 이 세 값이 정확히 두 종류가 되도록 할 방법은 출력값 두 개를 고르는 $\\binom{4}{2}=6$가지, 두 값을 모두 쓰도록 세 입력에 배정하는 $2^3-2=6$가지다. $g(2)$는 치역에 영향을 주지 않아 $4$가지 자유롭게 정한다. 답은 $6\\cdot6\\cdot4=144$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 15,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q15",
    "image": "assets/images/25_매산여고_2학기_기말_고1_유사/q15-problem.svg",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q15-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "BENEFICIAL",
        "reason": "대응표는 글로 완결되지만 화살표도가 합성·치역 구조 이해에 유익함"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "실제로 사용되는 f의 치역과 g의 자유 입력 강조"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-251",
    "problemTypeKey": "PT_FUNCTION_COUNTING",
    "templateKey": "TPL_CONSTRAINED_FUNCTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_FUNCTION_COUNTING"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "sourceDiagramModel": {
      "X": [
        1,
        2,
        3,
        4
      ],
      "f": [
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          3
        ],
        [
          4,
          1
        ]
      ],
      "unusedGInput": 2
    },
    "imageAlt": "발문에 주어진 함수 f의 대응을 원소별 화살표로 표시한다.",
    "imageCaption": "발문에 주어진 함수 f의 대응을 원소별 화살표로 표시한다.",
    "imageSize": "full",
    "solutionImageAlt": "f의 치역에 해당하는 세 입력만 g∘f의 치역 결정에 사용되며 나머지 한 입력은 자유롭다.",
    "solutionImageCaption": "f의 치역에 해당하는 세 입력만 g∘f의 치역 결정에 사용되며 나머지 한 입력은 자유롭다.",
    "solutionImageSize": "full"
  },
  {
    "id": 16,
    "number": 16,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\begin{cases}\\sqrt{a(x-2)}+1&(x\\le-1)\\\\3-\\frac8{x+3}&(x>-1)\\end{cases}$가 일대일함수이고 치역이 $(k,\\infty)$이다. $ak$의 값은? [4.3점]",
    "choices": [
      "$-\\frac{4}{3}$",
      "$-1$",
      "$\\frac{4}{3}$",
      "$2$",
      "$4$"
    ],
    "answer": "③",
    "solution": "$x>-1$에서 $3-8/(x+3)$은 엄격히 증가하고 치역은 $(-1,3)$이다. 전체 치역이 하나의 열린 반직선이 되려면 왼쪽 근호 조각이 $[3,\\infty)$를 만들며 오른쪽 조각과 겹치면 안 된다. 따라서 접합점 $x=-1$에서 $\\sqrt{-3a}+1=3$, 즉 $-3a=4$이고 $a=-\\frac43$이다. 이때 왼쪽 조각은 $[3,\\infty)$, 전체 치역은 $(-1,\\infty)$이므로 $k=-1$이며 $ak=\\frac43$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 16,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q16",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q16-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "두 조각함수의 치역 경계가 맞물리는 구간"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-257",
    "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
    "templateKey": "TPL_PIECEWISE_RANGE_STITCH_BIJECTION",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_PIECEWISE_BIJECTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION",
      "COND_FUNCTION_INJECTIVE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "접합 높이 3에서 왼쪽 치역 [3,∞)와 오른쪽 치역 (-1,3)이 빈틈없이 만난다.",
    "solutionImageCaption": "접합 높이 3에서 왼쪽 치역 [3,∞)와 오른쪽 치역 (-1,3)이 빈틈없이 만난다.",
    "solutionImageSize": "full"
  },
  {
    "id": 17,
    "number": 17,
    "score": 4.4,
    "points": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "함수 $f(x)=\\sqrt{2x+1-k}-1$의 그래프와 역함수 $y=f^{-1}(x)$의 그래프가 정확히 한 점에서 만나게 하는 정수 $k$ 중 $k\\ge-5$인 것을 모두 더한 값은? [4.4점]",
    "choices": [
      "$-20$",
      "$-15$",
      "$-14$",
      "$-10$",
      "$-6$"
    ],
    "answer": "③",
    "solution": "$f$가 엄격히 증가하므로 $f$와 역함수의 교점은 $f(x)=x$를 만족하는 점에만 있다. $\\sqrt{2x+1-k}=x+1$이므로 $x\\ge-1$이고 $k=2x+1-(x+1)^2=-x^2$이다. $x\\ge-1$에서 $-x^2$는 $x=0$에서 최댓값 $0$이며 $x=-1$에서 $-1$이다. 따라서 해가 정확히 하나인 것은 $k<-1$ 또는 $k=0$이다. $k\\ge-5$인 정수는 $-5,-4,-3,-2,0$이고 합은 $-14$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 17,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q17",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q17-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "함수·역함수의 대칭과 y=x 위 교점 수 판정"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "역함수",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-256",
    "problemTypeKey": "PT_INVERSE_GRAPH",
    "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "k=0인 경우 f와 역함수가 y=x의 고정점 (0,0)에서 만나는 모습을 확인한다.",
    "solutionImageCaption": "k=0인 경우 f와 역함수가 y=x의 고정점 (0,0)에서 만나는 모습을 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 18,
    "number": 18,
    "score": 4.4,
    "points": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "두 곡선 $y=\\sqrt{x-2}-2$, $y=\\sqrt{x+1}+1$과 두 직선 $y=-x$, $y=-x+k$($k>0$)로 둘러싸인 영역의 넓이가 $18$일 때 $k$의 값은? [4.4점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "두 번째 곡선은 첫 번째 곡선을 왼쪽으로 $3$, 위쪽으로 $3$ 평행이동한 것이다. 이 이동은 기울기 $-1$인 직선 방향과 평행하다. 각 직선 $x+y=t$ 위에서 두 곡선의 점 사이 $x$좌표 차이가 항상 $3$이므로, 두 직선 사이의 절편 차 $k$에 대하여 둘러싸인 넓이는 $3k$이다. $3k=18$이므로 $k=6$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 18,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q18",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q18-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "REQUIRED",
        "reason": "기울기 −1인 두 직선의 절편 차와 곡선의 (−d,+d) 이동이 만드는 폭×높이 넓이 (세트 1)"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-267",
    "problemTypeKey": "PT_FUNCTION_GRAPH_GEOMETRY",
    "templateKey": "TPL_FUNCTION_GRAPH_GEOMETRY_STRIP",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_CURVE_TRANSLATION_CONGRUENCE",
      "CC_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "두 곡선의 대응점은 (-3,3) 방향으로 옮겨지고 넓이 3·6=18이다.",
    "solutionImageCaption": "두 곡선의 대응점은 (-3,3) 방향으로 옮겨지고 넓이 3·6=18이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 19,
    "number": 19,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$0\\le x\\le4$에서 $f(x)=\\begin{cases}-x^2+2x+2&(0\\le x\\le2)\\\\-2x+8&(2<x\\le4)\\end{cases}$이다. 방정식 $f(x)+f(f(x))=4$의 서로 다른 실근의 합은? [4.3점]",
    "choices": [
      "$\\frac{17}{2}$",
      "$9$",
      "$\\frac{19}{2}$",
      "$10$",
      "$\\frac{21}{2}$"
    ],
    "answer": "①",
    "solution": "$t=f(x)$라 놓으면 $0\\le t<4$이다. $0\\le t\\le2$일 때 $t+f(t)=-t^2+3t+2=4$이므로 $t=1,2$. $2<t\\le4$일 때 $t+f(t)=8-t=4$이므로 $t=4$이나 $4$는 $f$의 치역에 없으므로 제외한다. $f(x)=1$은 두 번째 조각의 $x=\\frac72$ 하나, $f(x)=2$는 첫 조각의 $x=0,2$와 두 번째 조각의 $x=3$이다. 서로 다른 실근의 합은 $0+2+3+\\frac72=\\frac{17}2$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 19,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q19",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q19-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "조각함수의 중간값 t와 원상 분기 구조"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnit": "합성함수",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-253",
    "problemTypeKey": "PT_COMPOSITION_EQUATION",
    "templateKey": "TPL_COMPOSITION_EQUATION_SOLVE",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_PIECEWISE_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "t=f(x)로 놓으면 가로선 y=4와 t+f(t)의 그래프가 만나는 후보는 t=1,2이며 t=4는 f의 치역에서 제외이다. 조각별 정의역·치역 제한을 적용한다.",
    "solutionImageCaption": "t=f(x)로 놓으면 가로선 y=4와 t+f(t)의 그래프가 만나는 후보는 t=1,2이며 t=4는 f의 치역에서 제외이다. 조각별 정의역·치역 제한을 적용한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 20,
    "number": 20,
    "score": 4.5,
    "points": 4.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$k>0$에 대하여 $p:(x-1)^2<9k^2$, $q:|x-k-2|<2$이다. 명제 $q\\Rightarrow p$가 거짓이 되는 정수 $x$가 정확히 한 개일 때 $k$의 범위가 $\\alpha<k\\le\\beta$이다. $10(\\alpha+\\beta)$의 값은? [4.5점]",
    "choices": [
      "$20$",
      "$25$",
      "$30$",
      "$35$",
      "$40$"
    ],
    "answer": "①",
    "solution": "$q$는 $k<x<k+4$, $p$는 $1-3k<x<1+3k$이다. 정수 반례는 $q$에는 있지만 $p$에는 없는 정수다.\n① $0<k<1$이면 $q$의 정수는 $1,2,3,4$이다. $k\\le\\frac23$이면 $p$의 오른쪽 끝이 $3$ 이하라 $3,4$가 모두 반례다. $\\frac23<k<1$이면 $1,2,3$은 $p$에 있고 $4$만 없다.\n② $k=1$이면 $q$의 정수는 $2,3,4$이고 $p=(-2,4)$이므로 $4$만 반례다.\n③ $1<k<2$이면 $q$의 정수는 $2,3,4,5$이다. $p$의 오른쪽 끝이 $1+3k$이므로 $1<k\\le\\frac43$이면 $5$만 반례, $k>\\frac43$이면 반례가 없다.\n④ $k\\ge2$이면 $p$가 $q$에 속한 모든 정수를 포함한다. 따라서 정확히 하나인 범위는 $\\frac23<k\\le\\frac43$이고 $10(\\alpha+\\beta)=10(\\frac23+\\frac43)=20$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 20,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q20",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q20-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "q 구간과 p 구간의 정수 반례·양 끝 포함관계"
      }
    },
    "standardUnitKey": "H22-C2-06",
    "subUnitKey": "H22-C2-06-CORE",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnit": "명제 핵심 개념",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_PROPOSITION_COUNTEREXAMPLE_COUNT_PARAMETER",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_COUNTEREXAMPLE"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "solutionImageAlt": "k=1를 예로 들면 q 구간의 정수 중 p에 들어가지 않는 반례는 x=4 하나이다.",
    "solutionImageCaption": "k=1를 예로 들면 q 구간의 정수 중 p에 들어가지 않는 반례는 x=4 하나이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 21,
    "number": 21,
    "score": 6,
    "points": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "정수 $k$에 대한 명제 $P$: “어떤 실수 $x$에 대하여 $x^2-2(k-1)x+4k+8\\le0$이다”를 생각하자. $P$의 부정을 쓰고, 부정이 참이 되도록 하는 모든 정수 $k$를 구하시오. [6점]",
    "choices": [],
    "answer": "0,1,2,3,4,5,6",
    "solution": "명제 $P$의 부정은 “모든 실수 $x$에 대하여 $x^2-2(k-1)x+4k+8>0$이다”이다. 좌변을 완전제곱하면 $(x-k+1)^2-(k-7)(k+1)$이다. 이 식의 모든 실수 $x$에 대한 최솟값은 $-(k-7)(k+1)$이므로 부정이 참일 필요충분조건은 $(k-7)(k+1)<0$이다. 즉 $-1<k<7$이고 정수 $k$는 $0,1,2,3,4,5,6$이다. 경계 $k=-1,7$에서는 최솟값이 $0$이어서 전칭명제의 엄격한 $>0$ 조건을 만족하지 않는다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 21,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q21",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "EXEMPT",
        "reason": "계산·논리 서술만으로 해설 완결"
      }
    },
    "standardUnitKey": "H22-C2-06",
    "subUnitKey": "H22-C2-06-CORE",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnit": "명제 핵심 개념",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-243",
    "problemTypeKey": "PT_QUANTIFIER_NEGATION",
    "templateKey": "TPL_EXISTENTIAL_NEGATION_PARAMETER",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_QUANTIFIER_NEGATION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "essayAnswer": "0,1,2,3,4,5,6"
  },
  {
    "id": 22,
    "number": 22,
    "score": 7,
    "points": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "곡선 $y=\\sqrt{4x-4}+1$과 직선 $y=x+k$가 서로 다른 두 점에서 만나게 하는 모든 실수 $k$의 범위를 구하고 풀이를 서술하시오. [7점]",
    "choices": [],
    "answer": "0\\le k<1",
    "solution": "$t=\\sqrt{4x-4}\\ge0$으로 놓으면 $x=\\frac{t^2}4+1$, $y=t+1$이다. 두 식을 직선에 대입하면 $t^2-4t+4k=0$이다. 서로 다른 두 비음수 실근이 있을 조건을 구한다. 두 근의 합은 $4>0$, 곱은 $4k$이므로 $k\\ge0$이어야 하며, 판별식 $16-16k>0$에서 $k<1$이어야 한다. $k=0$에서는 $t=0,4$가 모두 허용되므로 결론은 $0\\le k<1$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 22,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q22",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q22-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "제곱근 곡선과 직선의 두 교점·정의역 끝점"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-272",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_GRAPH_INTERSECTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_RADICAL_LINE_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "essayAnswer": "0\\le k<1",
    "solutionImageAlt": "k=0일 때 제곱근 시작점 x=1을 포함하여 직선과 두 점에서 만난다.",
    "solutionImageCaption": "k=0일 때 제곱근 시작점 x=1을 포함하여 직선과 두 점에서 만난다.",
    "solutionImageSize": "full"
  },
  {
    "id": 23,
    "number": 23,
    "score": 7,
    "points": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\frac{ax+b}{x-2}$에서 $f(0)=-6$이다. 방정식 $|f(x)|=2$는 실근을 오직 한 개 가지며 그 실근은 음수이다. 또한 $|f(x)|=\\alpha$($\\alpha>0$)의 서로 다른 두 실근 $\\beta<\\gamma$가 모두 양수이고 $\\beta$는 정수이다. $\\alpha+\\beta+\\gamma$의 값을 구하고 모든 조건을 검증하시오. [7점]",
    "choices": [],
    "answer": "\\frac{55}{3}",
    "solution": "$f(0)=-6$에서 $b=12$이다. $|f|=2$의 해가 한 개뿐이려면 한 부호 방정식의 계수 $a$가 $2$ 또는 $-2$여야 한다(그렇지 않으면 두 부호 방정식이 각각 해를 갖는다). $a=2$이면 $f(x)=2+\\frac{16}{x-2}$이며 $f=-2$의 유일한 해는 $x=-2<0$이다. $a=-2$이면 $f(x)=-2+\\frac8{x-2}$이고 $f=2$의 해가 $x=4>0$이므로 제외한다. 따라서 $a=2$이다. $|f|=\\alpha$가 두 양의 근을 가지려면 $\\alpha>2$이고, 작은 근은 $\\beta=2-\\frac{16}{\\alpha+2}$로 $0<\\beta<2$이다. 양의 정수는 $\\beta=1$뿐이므로 $\\alpha+2=16$, $\\alpha=14$이다. 큰 근은 $\\gamma=2+\\frac{16}{14-2}=\\frac{10}3$이다. 따라서 $\\alpha+\\beta+\\gamma=14+1+\\frac{10}3=\\frac{55}3$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 23,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q23",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_유사/q23-solution.svg",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "유리함수에 대한 y=±c 교점과 극점 제외 확인"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnit": "함수의 뜻과 그래프",
    "subUnitClassificationDepth": "complete_documented",
    "rpmPrimaryRecordId": "H1-RPM-265",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_EQUATION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "COND_NEGATIVE",
      "COND_NONZERO"
    ],
    "integrationPattern": "CASE_BRANCH",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "essayAnswer": "\\frac{55}{3}",
    "solutionImageAlt": "극점 x=2 양쪽의 양의 해 x=1, 10/3은 각각 y=-14, y=14를 만족한다.",
    "solutionImageCaption": "극점 x=2 양쪽의 양의 해 x=1, 10/3은 각각 y=-14, y=14를 만족한다.",
    "solutionImageSize": "full"
  }
];
