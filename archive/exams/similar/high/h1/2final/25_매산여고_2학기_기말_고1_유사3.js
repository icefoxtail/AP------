/* 2025 순천매산여고 고1 2학기 기말 공통수학2 — SOURCE_BALANCED 유사3.
 * 문제·해설·정답: 신규 작성. SVG 제작은 별도 Codex 엔진 담당.
 * 원본 대응 23문항 / 객관식20 + 서술형3 / 100점.
 * 검증: 생성 스크립트의 구조검증을 통과. 수학 검산 결과는 별도 보고서를 참조.
 */
window.examTitle = "25_매산여고_2학기_기말_고1_유사3";
window.examDisplayTitle = "2025 순천매산여고 고1 2학기 기말 공통수학2 유사3";
window.questionBank = [
  {
    "id": 1,
    "number": 1,
    "score": 3.7,
    "points": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "명제 “$x\\le3k+1$이면 $3x<30$이다”가 모든 실수 $x$에 대하여 참이 되도록 하는 정수 $k$의 최댓값은? [3.7점]",
    "choices": [
      "$0$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "결론은 $x<10$이다. 전제 구간 $(-\\infty,3k+1]$은 오른쪽 끝점을 포함하므로 결론의 열린 구간 $(-\\infty,10)$에 포함되려면 반드시 $3k+1<10$이어야 한다. 즉 $k<3$이어서 정수 최댓값은 $2$이다. 경계 $k=3$에서 $x=10$은 전제를 만족하지만 결론을 만족하지 않으므로 제외된다.",
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
    "content": "전체집합 $U=\\{1,2,\\ldots,8\\}$의 두 부분집합 $A,B$에 대하여 $A\\cap(A^C\\cup B)$의 원소의 개수는 $3$이고, $(A\\cup B^C)^C=\\{1,4\\}$이다. 집합 $B$의 원소의 개수는? [3.6점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "분배법칙으로 $A\\cap(A^C\\cup B)=(A\\cap A^C)\\cup(A\\cap B)=A\\cap B$이므로 $|A\\cap B|=3$이다. 드모르간 법칙으로 $(A\\cup B^C)^C=A^C\\cap B=\\{1,4\\}$이므로 $|A^C\\cap B|=2$이다. 특히 $1,4$는 $B$의 원소이지만 $A$의 원소는 아니다. $A\\cap B$와 $A^C\\cap B$는 서로소이며 그 합집합이 $B$이므로 $|B|=3+2=5$이다.",
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
    "content": "집합 $X=\\{1,3,5\\}$에서 $f:1\\mapsto5,3\\mapsto1,5\\mapsto3$, $g:1\\mapsto3,3\\mapsto5,5\\mapsto1$이다. $(g^{-1}\\circ f)(3)+(f\\circ g^{-1})(5)$의 값은? [3.7점]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "$f(3)=1$이고 $g^{-1}(1)=5$이므로 첫 항은 $5$이다. $g^{-1}(5)=3$, $f(3)=1$이므로 둘째 항은 $1$이다. 따라서 합은 $6$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 3,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q3",
    "image": "",
    "solutionImage": "",
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
        3,
        5
      ],
      "f": [
        [
          1,
          5
        ],
        [
          3,
          1
        ],
        [
          5,
          3
        ]
      ],
      "g": [
        [
          1,
          3
        ],
        [
          3,
          5
        ],
        [
          5,
          1
        ]
      ]
    }
  },
  {
    "id": 4,
    "number": 4,
    "score": 3.5,
    "points": 3.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$x\\ne0,-4$일 때 $A(x)=\\frac{bx+c}{x^2+ax}$이며 $A(x)+\\frac2x=\\frac7{x(x+4)}$이다. $a-b-c$의 값은? [3.5점]",
    "choices": [
      "$-7$",
      "$-1$",
      "$3$",
      "$7$",
      "$9$"
    ],
    "answer": "④",
    "solution": "분모를 $x(x+4)$로 통일하면 분자는 $-2(x+4)+7=-2x-1$이다. 따라서 $a=4,b=-2,c=-1$이고 $a-b-c=4+2+1=7$이다.",
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
    "content": "증가하는 무리함수 $y=\\sqrt{2x+6}+4$의 정의역이 $[a,\\infty)$, 치역이 $[b,\\infty)$이다. 그래프에서 두 끝점에 해당하는 점 $(a,b)$를 포함할 때 $2a+b$는? [3.6점]",
    "choices": [
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$"
    ],
    "answer": "⑤",
    "solution": "$2x+6\\ge0$에서 $x\\ge-3$이므로 정의역의 포함된 왼쪽 끝점은 $a=-3$이다. $x=-3$에서 근호가 $0$이 되고 그때 $y=4$로 치역의 포함된 아랫끝점 $b=4$를 얻는다. 근호 밖의 $+4$는 정의역 경계에 영향을 주지 않고, 근호 안의 $+6$은 치역의 수직이동량이 아니다. 따라서 $2a+b=-6+4=-2$이다.",
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
    "content": "$y=\\frac{4x+1}{x+1}$의 그래프를 $x$축의 양의 방향을 기준으로 부호 있는 이동량 $p$, $y$축의 양의 방향을 기준으로 부호 있는 이동량 $q$만큼 평행이동하니 $y=\\frac{x-5}{x-2}$가 되었다. $p-q$는? [3.8점]",
    "choices": [
      "$3$",
      "$6$",
      "$7$",
      "$9$",
      "$12$"
    ],
    "answer": "②",
    "solution": "처음 함수는 $y=4-\\frac3{x+1}$, 나중 함수는 $y=1-\\frac3{x-2}$이다. 수직점근선이 $x=-1$에서 $x=2$로 이동했으므로 $p=3$, 수평점근선이 $y=4$에서 $y=1$로 이동했으므로 $q=-3$이다. $q$가 음수라는 것은 위가 아니라 아래로 $3$만큼 이동했다는 뜻이다. 따라서 $p-q=3-(-3)=6$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 6,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q6",
    "image": "",
    "solutionImage": "",
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 7,
    "number": 7,
    "score": 3.8,
    "points": 3.8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$1\\le x\\le3$에서 함수 $y=\\sqrt{-12x+a}+2$의 최솟값이 $3$이다. 이 함수의 최댓값은? [3.8점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "근호 안이 감소하므로 $x=3$에서 최솟값이 된다. $\\sqrt{a-36}+2=3$에서 $a=37$이다. $x=1$에서 $\\sqrt{37-12}+2=5+2=7$이므로 최댓값은 $7$이다.",
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
    "content": "$x>1$에서 $y=x+1+\\frac{25}{x-1}$가 최소가 되는 $x$를 $t$, 최솟값을 $m$이라 할 때 $m+t$는? [3.9점]",
    "choices": [
      "$18$",
      "$20$",
      "$21$",
      "$22$",
      "$24$"
    ],
    "answer": "①",
    "solution": "$u=x-1>0$으로 두면 $y=u+\\frac{25}{u}+2\\ge10+2=12$이고 등호는 $u=5$에서 성립한다. 따라서 $t=6$, $m=12$이므로 $m+t=18$이다.",
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
    "content": "두 함수 $f(x)=x+1+(x-1)^2(x+2)(x-3)$, $g(x)=x+1$에 대하여, 원소가 두 개 이상인 실수의 부분집합 $X$의 모든 원소에서 $f(x)=g(x)$가 성립한다. 가능한 집합 $X$는 몇 개인가? [3.9점]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "$f(x)-g(x)=(x-1)^2(x+2)(x-3)$이므로 방정식의 서로 다른 실근은 $-2,1,3$의 세 개다. $x=1$은 중근이지만 집합의 원소로는 한 번만 센다. 가능한 $X$는 이 세 원소 가운데 두 개를 택하는 $\\binom32=3$개와 세 개를 모두 택하는 $1$개이므로 총 $4$개다.",
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
      "COND_NONEMPTY_SELECTION",
      "COND_EXACTLY_N_INPUTS_SATISFY_FUNCTION_RELATION"
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
    "content": "조건 $p:-4<x\\le12$, $q:(x-a)(x-2a)>0$이다. 모든 실수에 대하여 $\\sim q\\Rightarrow p$가 참인 정수 $a$의 개수는? [4.1점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "④",
    "solution": "$\\sim q$의 진리집합 $[\\min(a,2a),\\max(a,2a)]$이 $(-4,12]$에 들어가야 한다. $a\\ge0$이면 $2a\\le12$에서 $a=0,1,\\ldots,6$의 $7$개이고, $a<0$이면 $2a>-4$에서 $a=-1$ 한 개이다. 끝점 $-4$는 허용되지 않고 $12$는 허용되므로 총 $8$개이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 10,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q10",
    "image": "",
    "solutionImage": "",
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 11,
    "number": 11,
    "score": 4,
    "points": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "분수함수 $y=\\frac{3x-14}{x-4}$의 그래프에 관하여 옳은 설명은? [4점]",
    "choices": [
      "$\\text{수직점근선은 }x=3\\text{이다.}$",
      "$\\text{수평점근선은 }y=4\\text{이다.}$",
      "$\\text{직선 }y=x+1\\text{에 대하여 대칭이다.}$",
      "$\\text{그래프는 제1사분면을 지나지 않는다.}$",
      "$\\text{직선 }y=-x+7\\text{에 대하여 대칭이다.}$"
    ],
    "answer": "⑤",
    "solution": "$\\frac{3x-14}{x-4}=3-\\frac2{x-4}$이고 중심은 $(4,3)$이다. 두 대칭축은 $y-3=x-4$, $y-3=-(x-4)$이므로 $y=x-1$, $y=-x+7$이다. 점근선은 $x=4,y=3$이고 $x>4$의 충분히 큰 값에서 $y>0$이므로 제1사분면도 지난다. 따라서 옳은 진술은 $y=-x+7$에 관한 대칭이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 11,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q11",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "점근선·대칭축·사분면 진술의 그래프 위치 관계"
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 12,
    "number": 12,
    "score": 4.1,
    "points": 4.1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=a|4x-8|+8x-2$가 실수 전체에서 실수 전체로의 일대일대응이 **아니게** 하는 정수 $a$ 중 $|a|$의 최솟값은? [4.1점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "꺾임점 전후 기울기는 $8-4a$와 $8+4a$이다. 일대일대응이 되는 조건은 두 기울기가 모두 양수인 $-2<a<2$이다. $a=\\pm2$에서는 한쪽 기울기가 $0$이 되어 일대일함수가 아니고, $|a|>2$에서도 기울기 부호가 서로 달라 일대일대응이 아니다. 따라서 일대일대응이 **아닌** 정수의 $|a|$ 최솟값은 $2$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 12,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q12",
    "image": "",
    "solutionImage": "",
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
      "COND_INTEGER",
      "COND_FUNCTION_BIJECTION"
    ],
    "integrationPattern": "CASE_BRANCH",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked"
  },
  {
    "id": 13,
    "number": 13,
    "score": 3.9,
    "points": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "함수 $y=-\\sqrt{-4x+8}+1$을 먼저 $y$축 대칭이동하고, 그다음 오른쪽으로 $3$, 아래쪽으로 $2$만큼 평행이동했다. 결과가 $y=-\\sqrt{ax+b}+c$일 때 $a+b+c$는? [3.9점]",
    "choices": [
      "$-9$",
      "$-7$",
      "$-1$",
      "$7$",
      "$9$"
    ],
    "answer": "③",
    "solution": "먼저 $x\\mapsto-x$를 적용하면 $y=-\\sqrt{4x+8}+1$이다. 이어 $x\\mapsto x-3$, $y\\mapsto y-2$를 적용하여 $y=-\\sqrt{4(x-3)+8}-1=-\\sqrt{4x-4}-1$을 얻는다. 따라서 $a=4,b=-4,c=-1$이고 합은 $-1$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 13,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q13",
    "image": "",
    "solutionImage": "",
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 14,
    "number": 14,
    "score": 4.2,
    "points": 4.2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$-9\\le x\\le-1$에서 두 그래프 $y=F(x)$, $y=\\sqrt{-x}+k$를 생각하자. $F(x)=\\begin{cases}2-\\frac6{x-2}&(-9\\le x\\le-4)\\\\-\\frac6{x-2}&(-4<x\\le-1)\\end{cases}$이다. 두 그래프가 서로 다른 두 점에서 만나게 하는 $k$의 최댓값은? [4.2점]",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "⑤",
    "solution": "교점은 $k=H(x)=F(x)-\\sqrt{-x}$를 만족한다. 함수 $-\\frac6{x-2}$는 $x<2$에서 엄격히 증가하고 $-\\sqrt{-x}$도 주어진 구간에서 엄격히 증가하므로 각 조각의 $H$도 엄격히 증가한다. $-9\\le x\\le-4$에서 $H(-9)=-\\frac5{11}$, $H(-4)=1$이므로 치역은 $[-\\frac5{11},1]$이다. $-4<x\\le-1$에서는 $H(-4+)= -1$이지만 $x=-4$는 제외되고 $H(-1)=1$이므로 치역은 $(-1,1]$이다. 한 조각에서 교점은 최대 한 개씩이므로 정확히 두 교점이 존재하는 범위는 두 치역의 교집합 $[-\\frac5{11},1]$이다. 따라서 최댓값은 $k=1$이다. 실제로 $x=-4,-1$에서 각각 교점을 얻으므로 끝점 $1$도 포함한다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 14,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q14",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "BENEFICIAL",
        "reason": "F(x)의 좌측 닫힌 조각·우측 열린 조각과 제곱근 곡선의 교점 0/1/2개 비교; 문제는 식만으로 완결"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "좌측 [-9,-4]·우측 (-4,-1]의 k 치역 중첩과 두 교점의 끝점 판정"
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 15,
    "number": 15,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$X=\\{1,2,3,4\\}$에서 $f(1)=f(3)=2$, $f(2)=3$, $f(4)=4$이다. 함수 $g:X\\to X$ 중 $g\\circ f$의 치역에 원소 $1$이 포함되고 그 치역의 원소 수가 정확히 $2$인 것의 개수는? [4.3점]",
    "choices": [
      "$72$",
      "$96$",
      "$108$",
      "$144$",
      "$192$"
    ],
    "answer": "①",
    "solution": "$f(X)=\\{2,3,4\\}$이므로 $g(2),g(3),g(4)$가 만드는 치역은 $\\{1,c\\}$($c\\in\\{2,3,4\\}$)이어야 한다. $c$는 $3$가지, 두 값을 모두 쓰도록 세 위치에 배정하는 방법은 $2^3-2=6$가지다. 쓰이지 않는 입력 $1$의 $g(1)$은 $4$가지이므로 $3\\cdot6\\cdot4=72$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 15,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q15",
    "image": "",
    "solutionImage": "",
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
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          2
        ],
        [
          4,
          4
        ]
      ],
      "unusedGInput": 1
    }
  },
  {
    "id": 16,
    "number": 16,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\begin{cases}\\sqrt{a(x-5)}+1&(x<1)\\\\1+\\frac{12}{x+2}&(x\\ge1)\\end{cases}$가 실수 전체에서 정의된 일대일함수이며 치역이 $(k,\\infty)$이다. $a+k$는? [4.3점]",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "오른쪽 조각은 $x\\ge1$에서 엄격히 감소하며 치역이 $(1,5]$이다. 특히 경계값 $5$는 오른쪽 조각의 $x=1$에서 **포함된다**. 왼쪽 조각의 근호가 모든 $x<1$에서 실수이고 일대일이려면 $a<0$이며, 그 치역은 $(1+\\sqrt{-4a},\\infty)$처럼 경계값이 **포함되지 않는** 열린 구간이다. 두 조각이 중복 없이 만나 $(k,\\infty)$가 되려면 왼쪽 조각의 아래쪽 한계가 정확히 $5$여야 한다. 즉 $1+\\sqrt{-4a}=5$에서 $a=-4$. 이때 두 치역은 각각 $(5,\\infty)$와 $(1,5]$이므로 전체는 $(1,\\infty)$이고, 두 조각이 엄격히 단조하며 치역도 겹치지 않아 일대일이다. $k=1$이므로 $a+k=-3$이다. 만약 열린/닫힌 경계를 반대로 읽으면 $5$의 소속 조각이 뒤바뀌므로 치역 연결의 경계 논증이 틀린다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 16,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q16",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "x=1이 오른쪽에만 속하고 y=5가 오른쪽에서 닫힌 점이라는 접합 판단"
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 17,
    "number": 17,
    "score": 4.4,
    "points": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "증가함수 $f(x)=\\sqrt{6x-k}-1$과 역함수 $f^{-1}$의 그래프가 한 점에서만 만날 때, $k\\ge-9$인 모든 정수 $k$의 합은? [4.4점]",
    "choices": [
      "$-30$",
      "$-24$",
      "$-21$",
      "$-18$",
      "$-15$"
    ],
    "answer": "③",
    "solution": "$f(x)=x$를 풀면 $x\\ge-1$이고 $6x-k=(x+1)^2$, 즉 $k=-x^2+4x-1=3-(x-2)^2$이다. $x\\ge-1$에서 최댓값은 $3$, 왼쪽 끝값은 $3-9=-6$이다. 수평선과 교점이 정확히 하나인 경우는 $k<-6$ 또는 $k=3$이다. $k\\ge-9$인 정수는 $-9,-8,-7,3$이고 합은 $-21$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 17,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q17",
    "image": "",
    "solutionImage": "",
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 18,
    "number": 18,
    "score": 4.4,
    "points": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "곡선 $C:y=\\sqrt{x-1}-1$을 왼쪽으로 $d$, 위쪽으로 $d$만큼($d>0$) 옮긴 곡선과 $C$, 두 직선 $y=-x$, $y=-x+3$으로 둘러싸인 부분의 넓이는 $18$이다. $d$의 값은? [4.4점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$6$",
      "$9$"
    ],
    "answer": "④",
    "solution": "이동된 곡선은 $y=\\sqrt{x-1+d}-1+d$이다. 이동 방향 $(-d,d)$는 두 직선의 방향과 같고, $x+y=t$가 일정할 때 두 곡선의 $x$좌표 간격은 항상 $d$다. 두 직선의 절편 차가 $3$이므로 넓이는 $3d$. 따라서 $3d=18$에서 $d=6$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 18,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q18",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "REQUIRED",
        "reason": "기울기 −1인 두 직선의 절편 차와 곡선의 (−d,+d) 이동이 만드는 폭×높이 넓이 (세트 3)"
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 19,
    "number": 19,
    "score": 4.3,
    "points": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$0\\le x\\le3$에서 $f(x)=\\begin{cases}2(x-1)^2+1&(0\\le x\\le2)\\\\-3x+9&(2<x\\le3)\\end{cases}$이다. 방정식 $f(x)+f(f(x))=3$의 서로 다른 실근의 합은? [4.3점]",
    "choices": [
      "$7$",
      "$\\frac{17}{2}$",
      "$9$",
      "$\\frac{19}{2}$",
      "$10$"
    ],
    "answer": "④",
    "solution": "$f$의 치역은 $[0,3]$이므로 $t=f(x)$라 두면 $0\\le t\\le3$이다. $0\\le t\\le2$에서는 $t+f(t)=2t^2-3t+3=3$으로부터 $t=0,\\frac32$를 얻는다. $2<t\\le3$에서는 $t+f(t)=9-2t=3$이어서 $t=3$이다. 이제 $f(x)=0$은 $x=3$ 한 개, $f(x)=\\frac32$은 $x=\\frac12,\\frac32,\\frac52$ 세 개, $f(x)=3$은 첫 조각에서 $x=0,2$ 두 개다. 둘째 조각의 식 $-3x+9=3$도 형식상 $x=2$를 주지만 이 조각은 $x>2$이므로 이 값을 **추가로 세지 않는다**. 서로 다른 여섯 근의 합은 $3+\\frac12+\\frac32+\\frac52+0+2=\\frac{19}2$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 19,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q19",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "f(x)=3에서 x=2가 두 식의 형식적 후보이지만 오른쪽 조각에서 제외됨을 표시"
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 20,
    "number": 20,
    "score": 4.5,
    "points": 4.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$k>0$에서 $p:(x-2)^2<9k^2$, $q:|x-k-2|<2$이다. $q\\land\\sim p$를 만족하는 정수 $x$가 정확히 한 개인 $k$의 범위가 $\\alpha<k\\le\\beta$일 때 $10(\\alpha+\\beta)$를 구하면? [4.5점]",
    "choices": [
      "$5$",
      "$10$",
      "$15$",
      "$20$",
      "$25$"
    ],
    "answer": "②",
    "solution": "$q$는 $k<x<k+4$, $p$는 $2-3k<x<2+3k$이다. $q\\land\\sim p$는 앞 구간에 속하지만 뒤 구간에 속하지 않는 정수 조건이다.\n① $0<k<1$에서 $q$를 만족하는 정수는 $1,2,3,4$다. $k\\le\\frac13$이면 $p$의 왼쪽 끝이 $1$ 이상, 오른쪽 끝이 $3$ 이하이므로 $1,3,4$가 모두 반례다. $\\frac13<k\\le\\frac23$이면 $p$는 $1,2,3$을 포함하지만 오른쪽 끝이 $4$ 이하이므로 $4$만 반례다. $\\frac23<k<1$이면 $4$까지 모두 포함되어 반례가 없다.\n② $k=1$이면 $q$의 정수는 $2,3,4$이고 $p=(-1,5)$이므로 반례가 없다. $k>1$이면 $p$의 양 끝이 $q$의 양 끝보다 넓어져 반례가 없다.\n따라서 범위는 $\\frac13<k\\le\\frac23$, $10(\\alpha+\\beta)=10$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 20,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q20",
    "image": "",
    "solutionImage": "",
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
    "solutionStatus": "self_checked"
  },
  {
    "id": 21,
    "number": 21,
    "score": 6,
    "points": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "정수 $k$에 대한 명제 “어떤 실수 $x$에 대하여 $x^2-4kx+36\\le0$이다”의 부정이 참이다. 이 조건을 만족하는 정수 $k$를 모두 구하고 경곗값의 포함 여부를 설명하시오. [6점]",
    "choices": [],
    "answer": "-2,-1,0,1,2",
    "solution": "주어진 명제의 부정은 모든 $x\\in\\mathbb R$에 대하여 $x^2-4kx+36>0$이다. $(x-2k)^2+36-4k^2>0$이 모든 $x$에서 성립하려면 $36-4k^2>0$, 즉 $k^2<9$여야 한다. 따라서 $k=-2,-1,0,1,2$이다. $k=\\pm3$이면 최소값이 $0$이 되므로 포함되지 않는다.",
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
    "essayAnswer": "-2,-1,0,1,2"
  },
  {
    "id": 22,
    "number": 22,
    "score": 7,
    "points": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "곡선 $y=\\sqrt{12x-36}+2$와 직선 $y=x+k$가 서로 다른 두 점에서 교차하도록 하는 실수 $k$의 범위를 구하시오. 교점이 정의역 끝점에 있는 경우도 고려하여 설명하시오. [7점]",
    "choices": [],
    "answer": "-1\\le k<2",
    "solution": "$t=\\sqrt{12x-36}\\ge0$으로 바꾸면 $x=\\frac{t^2}{12}+3$, $y=t+2$이다. 교점 방정식은 $t^2-12t+12(k+1)=0$이다. 근의 합이 $12>0$이므로 두 실근이 비음수일 조건은 곱 $12(k+1)\\ge0$ 및 판별식 $144-48(k+1)>0$이다. 이로부터 $k\\ge-1$과 $k<2$를 얻는다. $k=-1$에서 $t=0$인 교점이 있으므로 포함된다. 답은 $-1\\le k<2$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 22,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q22",
    "image": "",
    "solutionImage": "",
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
    "essayAnswer": "-1\\le k<2"
  },
  {
    "id": 23,
    "number": 23,
    "score": 7,
    "points": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\frac{(x-5)(ax+b)}{(x-5)(x-2)}$($x\\ne2,5$), $a<4$, $f(0)=-6$이다. 방정식 $|f(x)|=4$는 실근을 오직 하나 가지며 그 근은 음수이다. $|f(x)|=\\alpha$($\\alpha>0$)의 서로 다른 두 실근 $\\beta<\\gamma$가 모두 양수이고 $\\beta$가 정수일 때 $\\alpha+2\\beta+\\gamma$를 구하시오. 분모가 $0$인 후보는 반드시 제외하고 이유를 설명하시오. [7점]",
    "choices": [],
    "answer": "17",
    "solution": "$f(0)=-6$에서 $b=12$이다. 분모의 인수에 따라 $x=2,5$는 반드시 제외한다. 허용된 $x$에서는 $f(x)=\\frac{ax+12}{x-2}$이고 $f(x)=4$의 형식상 해는 $x=\\frac{20}{4-a}$, $f(x)=-4$의 형식상 해는 $x=-\\frac4{a+4}$이다(각 분모가 $0$인 매개변수는 별도로 판정한다). $a<4$에서 첫 해는 양수이므로 이를 제거해야 음의 실근 하나만 남는다. $x=5$가 제외값이므로 $\\frac{20}{4-a}=5$, 즉 $a=0$이다. 이때 $f(x)=4$의 형식적 해 $x=5$는 실제 정의역 밖이어서 제거되며 $f(x)=-4$는 $x=-1$만 남는다. $a=-4$에서는 음의 근이 없고 $a< -4$에서는 두 후보가 양수이므로 다른 가능성은 없다. 이제 $f(x)=\\frac{12}{x-2}$($x\\ne2,5$)이므로 $|f(x)|=\\alpha$의 두 근은 $2-\\frac{12}{\\alpha},2+\\frac{12}{\\alpha}$이다. 두 근이 양수이려면 $\\alpha>6$, 따라서 작은 양의 근 $\\beta$는 $0<\\beta<2$인 정수이므로 $1$이다. $\\beta=1$에서 $\\alpha=12$, $\\gamma=3$이고 모두 정의역에 속한다. 최종값은 $12+2\\cdot1+3=17$이다.",
    "curriculum": "2022",
    "standardCourse": "공통수학2",
    "sourceQid": 23,
    "variationType": "EXAM_FOLLOWUP",
    "followupKind": "CONFIRMATION",
    "provenance": "SIMILAR_OF:archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js#q23",
    "image": "",
    "solutionImage": "",
    "tags": [],
    "visualDisposition": {
      "problemVisual": {
        "requirement": "EXEMPT",
        "reason": "수식·문장으로 완결되며 문제 그림은 필요하지 않음"
      },
      "solutionVisual": {
        "requirement": "BENEFICIAL",
        "reason": "x=2 극점과 x=5 제거 가능한 구멍, y=±4의 실제/형식적 교점 구분"
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
    "essayAnswer": "17"
  }
];
