/* 2025 순천매산여고 고1 2학기 기말 공통수학2 — SOURCE_BALANCED 유사2.
 * 문제·해설·정답: 신규 작성. SVG 제작은 별도 Codex 엔진 담당.
 * 원본 대응 23문항 / 객관식20 + 서술형3 / 100점.
 * 검증: 생성 스크립트의 구조검증을 통과. 수학 검산 결과는 별도 보고서를 참조.
 */
window.examTitle = "25_매산여고_2학기_기말_고1_유사2";
window.examDisplayTitle = "2025 순천매산여고 고1 2학기 기말 공통수학2 유사2";
window.questionBank = [
  {
    "id": 1,
    "number": 1,
    "score": 3.7,
    "points": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$m=4$일 때, “$x\\le3k-1$인 모든 실수 $x$는 $x<2m+1$을 만족한다”라는 명제가 참이 되는 정수 $k$의 최댓값을 구하시오. [3.7점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$m=4$이므로 결론은 $x<9$이다. 닫힌 반직선 $(-\\infty,3k-1]$이 열린 반직선 $(-\\infty,9)$에 포함될 조건은 $3k-1<9$이다. $k<\\frac{10}{3}$이므로 정수 최댓값은 $3$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_IMPLICATION_INTERVAL_PARAMETER",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "전체집합 $U=\\{1,2,\\ldots,9\\}$의 부분집합 $A,B$가 $(A^C\\cup B)\\cap A=\\{1,4,6\\}$, $(A\\cup B^C)^C=\\{3,8\\}$을 만족한다. $|B^C|$의 값은? [3.6점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "첫 조건은 $A\\cap B=\\{1,4,6\\}$이고 둘째 조건은 드모르간 법칙에 따라 $A^C\\cap B=\\{3,8\\}$이다. $B=\\{1,3,4,6,8\\}$이므로 $|B|=5$, $|B^C|=9-5=4$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-241",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "집합 $X=\\{2,4,6\\}$에서 $f:2\\mapsto4,4\\mapsto6,6\\mapsto2$와 $g:2\\mapsto6,4\\mapsto2,6\\mapsto4$는 전단사 함수이다. $(f\\circ g^{-1}\\circ f)(2)+(g\\circ f)^{-1}(6)$을 구하면? [3.7점]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "③",
    "solution": "$f(2)=4$, $g^{-1}(4)=6$, $f(6)=2$이므로 첫 항은 $2$이다. $g\\circ f$는 $2,4,6$ 각각을 자기 자신으로 보내므로 $(g\\circ f)^{-1}(6)=6$이다. 합은 $8$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-253",
    "problemTypeKey": "PT_INVERSE_COMPOSITION",
    "templateKey": "TPL_INVERSE_COMPOSITION_VALUE",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "sourceDiagramModel": {
      "X": [
        2,
        4,
        6
      ],
      "f": [
        [
          2,
          4
        ],
        [
          4,
          6
        ],
        [
          6,
          2
        ]
      ],
      "g": [
        [
          2,
          6
        ],
        [
          4,
          2
        ],
        [
          6,
          4
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
    "content": "$x\\ne0,2$에서 항등식 $\\frac{bx+c}{x^2+ax}-\\frac3x=\\frac4{x(x-2)}$가 성립한다. $a+b-c$를 구하면? [3.5점]",
    "choices": [
      "$-3$",
      "$-1$",
      "$1$",
      "$3$",
      "$7$"
    ],
    "answer": "④",
    "solution": "좌변은 $\\frac{3(x-2)+4}{x(x-2)}=\\frac{3x-2}{x(x-2)}$이다. 따라서 $a=-2,b=3,c=-2$이므로 $a+b-c=-2+3+2=3$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-263",
    "problemTypeKey": "PT_RATIONAL_EXPRESSION",
    "templateKey": "TPL_RATIONAL_EXPRESSION_SIMPLIFY",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "$a>0$일 때 $y=\\sqrt{ax+8}+b$의 정의역은 $[-2,\\infty)$이고 치역은 $[3,\\infty)$이다. $a+b$는? [3.6점]",
    "choices": [
      "$-1$",
      "$1$",
      "$7$",
      "$8$",
      "$11$"
    ],
    "answer": "③",
    "solution": "정의역의 시작점은 $ax+8=0$의 해 $x=-8/a$이다. $-8/a=-2$에서 $a=4$. 근호가 $0$일 때 함수값이 $b$이므로 $b=3$. 따라서 $a+b=7$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-268",
    "problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY",
    "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "분수함수 $y=\\frac{-x+2}{x-4}$를 $(p,q)$만큼 평행이동하면 $y=\\frac{2x-12}{x-5}$가 된다. $2p+q$를 구하시오. [3.8점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$9$",
      "$11$"
    ],
    "answer": "①",
    "solution": "$\\frac{-x+2}{x-4}=-1-\\frac2{x-4}$, $\\frac{2x-12}{x-5}=2-\\frac2{x-5}$이다. 점근선 비교로 수평 이동은 $p=5-4=1$, 수직 이동은 $q=2-(-1)=3$이다. 따라서 $2p+q=2+3=5$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-260",
    "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
    "templateKey": "TPL_FUNCTION_GRAPH_TRANSFORM_ASYMPTOTE_POINT",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$-2\\le x\\le0$에서 함수 $y=\\sqrt{8x+a}-1$의 최댓값이 $4$이다. 최솟값을 구하면? [3.8점]",
    "choices": [
      "$-2$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "제곱근 안의 $8x+a$는 증가하므로 최댓값은 $x=0$에서 얻는다. $\\sqrt a-1=4$에서 $a=25$. $x=-2$에서 최솟값은 $\\sqrt{25-16}-1=3-1=2$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-269",
    "problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY",
    "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_EXTREMUM",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "$x>-3$에서 $y=x+3+\\frac{16}{x+3}$의 최솟값을 $m$, 그때의 $x$값을 $t$라 하자. $m-t$의 값은? [3.9점]",
    "choices": [
      "$0$",
      "$1$",
      "$4$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "$u=x+3>0$이면 $y=u+\\frac{16}u\\ge8$이며 등호는 $u=4$, 즉 $x=1$일 때 성립한다. 따라서 $m=8,t=1$이므로 $m-t=7$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-264",
    "problemTypeKey": "PT_FUNCTION_EXTREMUM",
    "templateKey": "TPL_FUNCTION_EXTREMUM_INEQUALITY",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$f(x)=x^3-7x^2+15x-5$, $g(x)=x+3$이다. $2\\in X$인 공집합 아닌 실수의 부분집합 $X$에 대하여 모든 $x\\in X$에서 $f(x)=g(x)$가 성립한다. 가능한 집합 $X$의 개수는? [3.9점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$f(x)-g(x)=x^3-7x^2+14x-8=(x-1)(x-2)(x-4)$이다. 가능한 원소는 $\\{1,2,4\\}$이고 반드시 $2$를 포함한다. 나머지 $1,4$는 각각 포함 여부 두 가지이므로 $2^2=4$개이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-251",
    "problemTypeKey": "PT_FUNCTION_EQUALITY",
    "templateKey": "TPL_EQUAL_FUNCTION_DOMAIN_SELECTION",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "조건 $p:-8\\le x<12$, $q:(x-2a)(x-4a)>0$가 주어졌다. 명제 “$\\sim q$이면 $p$이다”가 참이 되도록 하는 정수 $a$는 몇 개인가? [4.1점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$\\sim q$는 두 실수 $2a,4a$ 사이의 닫힌 구간이다. 이것이 $[-8,12)$에 포함되려면 $\\min(2a,4a)\\ge-8$, $\\max(2a,4a)<12$가 필요충분하다. $a\\ge0$이면 $a=0,1,2$이고 $a<0$이면 $a=-2,-1$이다. 총 $5$개이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_IMPLICATION_INTERVAL_PARAMETER",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "분수함수 $y=\\frac{-x+2}{x+2}$의 그래프에 대한 설명으로 옳은 것 하나를 고르면? [4점]",
    "choices": [
      "$\\text{수직점근선은 }x=2\\text{이다.}$",
      "$\\text{수평점근선은 }y=1\\text{이다.}$",
      "$\\text{직선 }y=-x+3\\text{에 대하여 대칭이다.}$",
      "$\\text{그래프는 제3사분면을 지나지 않는다.}$",
      "$\\text{수평점근선은 }y=-1\\text{이다.}$"
    ],
    "answer": "⑤",
    "solution": "$\\frac{-x+2}{x+2}=-1+\\frac4{x+2}$이다. 수직점근선은 $x=-2$, 수평점근선은 $y=-1$이다. 중심은 $(-2,-1)$이고 대칭축은 $y=x+1$과 $y=-x-3$이다. $x<-2$에서는 $y<-1$이므로 제3사분면을 지난다. 따라서 참인 설명은 수평점근선 $y=-1$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-261",
    "problemTypeKey": "PT_RATIONAL_ASYMPTOTE",
    "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$f(x)=a|2x-5|+7x+1$이 실수 전체에서 실수 전체로의 일대일대응이 되도록 하는 정수 $a$의 개수는? [4.1점]",
    "choices": [
      "$1$",
      "$3$",
      "$4$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "꺾임점 양쪽의 기울기는 $7-2a$와 $7+2a$이다. 일대일대응이 되려면 두 기울기의 부호가 같아야 하므로 $(7-2a)(7+2a)>0$, 즉 $|a|<\\frac72$이다. 가능한 정수는 $-3,-2,-1,0,1,2,3$의 $7$개이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-257",
    "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
    "templateKey": "TPL_ABSOLUTE_VALUE_INJECTIVITY",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$y=\\sqrt{2x+4}-3$을 왼쪽으로 $1$, 아래쪽으로 $2$만큼 옮긴 뒤 $y$축 대칭이동하면 $y=\\sqrt{ax+b}+c$가 된다. $a+b+c$를 구하면? [3.9점]",
    "choices": [
      "$-13$",
      "$-1$",
      "$1$",
      "$3$",
      "$9$"
    ],
    "answer": "②",
    "solution": "왼쪽으로 $1$ 이동하면 $x$를 $x+1$로 바꾸므로 $y=\\sqrt{2x+6}-3$이다. 아래로 $2$ 이동하면 $\\sqrt{2x+6}-5$, 이어서 $y$축 대칭으로 $\\sqrt{-2x+6}-5$를 얻는다. $a=-2,b=6,c=-5$이므로 $a+b+c=-1$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-267",
    "problemTypeKey": "PT_FUNCTION_RECOVERY",
    "templateKey": "TPL_RECOVER_FUNCTION_BY_INPUT_CHANGE",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$-16\\le x\\le-9$에서 두 그래프 $y=2-\\frac{15}{x+1}$과 $y=\\sqrt{-x}+k$가 한 점에서 만나도록 하는 $k$의 최솟값은? [4.2점]",
    "choices": [
      "$-3$",
      "$-1$",
      "$0$",
      "$1$",
      "$3$"
    ],
    "answer": "②",
    "solution": "$k=h(x)=2-\\frac{15}{x+1}-\\sqrt{-x}$이다. $x<-1$에서 분수함수 $2-15/(x+1)$은 증가하고 $\\sqrt{-x}$는 감소하므로 $h$는 엄격히 증가한다. 교점은 $h([-16,-9])$ 안의 $k$마다 정확히 한 점이므로 최솟값은 $h(-16)=2-\\frac{15}{-15}-4=-1$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-272",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_GRAPH_INTERSECTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$X=\\{1,2,3,4\\}$에서 $f(1)=1,f(2)=4,f(3)=2,f(4)=4$이고 $g:X\\to X$이다. $g\\circ f$의 치역이 정확히 $3$개의 원소로 이루어지도록 하는 $g$의 개수는? [4.3점]",
    "choices": [
      "$24$",
      "$48$",
      "$72$",
      "$96$",
      "$144$"
    ],
    "answer": "④",
    "solution": "$f(X)=\\{1,2,4\\}$이므로 $g(1),g(2),g(4)$는 서로 달라야 한다. 세 가지 서로 다른 출력값을 $X$에서 택하는 $\\binom{4}{3}=4$가지와 그 값을 세 입력에 일대일 배정하는 $3!=6$가지가 있다. 사용되지 않는 입력 $3$에서의 $g(3)$은 $4$가지다. 따라서 $4\\cdot6\\cdot4=96$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-251",
    "problemTypeKey": "PT_FUNCTION_COUNTING",
    "templateKey": "TPL_CONSTRAINED_FUNCTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
          1
        ],
        [
          2,
          4
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
      "unusedGInput": 3
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
    "content": "$f(x)=\\begin{cases}\\sqrt{a(x-4)}+2&(x\\le0)\\\\4-\\frac9{x+3}&(x>0)\\end{cases}$가 일대일함수이고 치역이 $(k,\\infty)$를 이룬다. $a-k$는? [4.3점]",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$0$"
    ],
    "answer": "④",
    "solution": "$x>0$인 조각의 치역은 $(1,4)$이다. 전체가 빈틈 없는 $(k,\\infty)$가 되려면 다른 조각의 치역은 $[4,\\infty)$여야 한다. 경계 $x=0$에서 $\\sqrt{-4a}+2=4$로부터 $a=-1$. 이 값에서는 근호 조각이 $[4,\\infty)$이고 두 치역이 겹치지 않으므로 일대일이다. $k=1$이므로 $a-k=-1-1=-2$이다.",
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
        "reason": "두 조각함수의 치역 경계가 맞물리는 구간"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "rpmPrimaryRecordId": "H1-RPM-257",
    "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
    "templateKey": "TPL_PIECEWISE_RANGE_STITCH_BIJECTION",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$f(x)=\\sqrt{4x+3-k}-2$가 역함수 $f^{-1}$와 정확히 한 점에서 교차하도록 하는 정수 $k\\ge-8$은 모두 몇 개인가? [4.4점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "엄격히 증가하는 함수에서 역함수와의 교점은 $y=x$ 위에 있다. $\\sqrt{4x+3-k}=x+2$에서 $x\\ge-2$이고 $k=4x+3-(x+2)^2=-x^2-1$이다. 이 함수의 최댓값은 $x=0$에서 $-1$이고 왼쪽 끝 $x=-2$에서 $-5$이다. 따라서 $k<-5$이면 해가 한 개, $-5\\le k<-1$이면 두 개, $k=-1$이면 한 개다. $k\\ge-8$인 정수는 $-8,-7,-6,-1$ 네 개이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-256",
    "problemTypeKey": "PT_INVERSE_GRAPH",
    "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "두 제곱근 곡선 $y=\\sqrt{x+4}-2$, $y=\\sqrt{x+6}$과 직선 $y=-x+1$, $y=-x+k$($k>1$)로 둘러싸인 부분의 넓이는 $10$이다. $k$의 값은? [4.4점]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "뒤 곡선은 앞 곡선을 왼쪽 $2$, 위쪽 $2$만큼 옮긴 것으로, 이동 벡터 $(-2,2)$는 두 직선 $y=-x+c$와 평행하다. 직선 $x+y=t$를 따라 본 곡선 사이 수평 간격은 $2$이고 $t$의 구간 길이는 $k-1$이므로 넓이는 $2(k-1)$이다. $2(k-1)=10$에서 $k=6$이다.",
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
        "reason": "평행이동 벡터와 영역 넓이의 기하적 근거를 SVG로 표시"
      }
    },
    "standardUnitKey": "H22-C2-09",
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "rpmPrimaryRecordId": "H1-RPM-267",
    "problemTypeKey": "PT_FUNCTION_GRAPH_GEOMETRY",
    "templateKey": "TPL_FUNCTION_GRAPH_GEOMETRY_STRIP",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$0\\le x\\le4$에서 $f(x)=\\begin{cases}x^2-2x+3&(0\\le x\\le2)\\\\-2x+8&(2<x\\le4)\\end{cases}$이다. $f(x)+f(f(x))=5$의 서로 다른 실근은 몇 개인가? [4.3점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$t=f(x)$라 두면 $0\\le t<4$. $0\\le t\\le2$에서 $t+f(t)=t^2-t+3=5$를 풀어 $t=2$를 얻고(다른 근 $-1$ 제외), $2<t<4$에서 $8-t=5$이므로 $t=3$을 얻는다. $f(x)=2$의 해는 $x=1,3$이고, $f(x)=3$의 해는 $x=0,2,\\frac52$이다. 서로 다른 해는 다섯 개다.",
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
        "reason": "조각함수의 중간값 t와 원상 분기 구조"
      }
    },
    "standardUnitKey": "H22-C2-07",
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "rpmPrimaryRecordId": "H1-RPM-253",
    "problemTypeKey": "PT_COMPOSITION_EQUATION",
    "templateKey": "TPL_COMPOSITION_EQUATION_SOLVE",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "$k>0$일 때 조건 $p:(x-3)^2<4k^2$, $q:|x-k|<2$이다. $q$를 만족하지만 $p$를 만족하지 않는 정수 $x$가 정확히 한 개가 되도록 하는 $k$의 범위를 $\\alpha<k\\le\\beta$라 한다. $10(\\alpha+\\beta)$는? [4.5점]",
    "choices": [
      "$10$",
      "$15$",
      "$20$",
      "$25$",
      "$30$"
    ],
    "answer": "④",
    "solution": "$q$의 진리집합은 $(k-2,k+2)$, $p$의 진리집합은 $(3-2k,3+2k)$이다.\n① $0<k<1$이면 $q$를 만족하는 정수 $-1,0,1,2$ 중 $-1,0,1$이 $p$ 밖에 있다. $k=1$에서는 $q$의 정수가 $0,1,2$이고 $p=(1,5)$이므로 $0,1$ 두 개가 반례다.\n② $1<k<2$이면 $q$의 정수는 $0,1,2,3$이다. 이 중 $1,2,3$은 $p$ 안에 있고, $0$이 $p$ 밖에 있을 조건은 $0\\le3-2k$, 즉 $k\\le\\frac32$이다. $k=\\frac32$에서 $0$은 $p$의 열린 끝점이어서 여전히 반례다.\n③ $k\\ge2$이면 $p$가 $q$에 속한 모든 정수를 포함한다. 따라서 $1<k\\le\\frac32$이며 $10(\\alpha+\\beta)=25$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-248",
    "problemTypeKey": "PT_PROPOSITION_PARAMETER_CONDITION",
    "templateKey": "TPL_PROPOSITION_COUNTEREXAMPLE_COUNT_PARAMETER",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "정수 $k$에 대하여 명제 $P$: “$\\exists x\\in\\mathbb R$에 대하여 $(x-k)^2\\le k^2-9$”이다. 명제 $P$의 부정이 참이 되도록 하는 $k$를 모두 쓰고 풀이 과정을 설명하시오. [6점]",
    "choices": [],
    "answer": "-2,-1,0,1,2",
    "solution": "부정은 “모든 실수 $x$에 대하여 $(x-k)^2>k^2-9$”이다. 좌변의 최솟값은 $x=k$일 때 $0$이므로, 부정이 참인 조건은 $0>k^2-9$, 즉 $-3<k<3$이다. 따라서 정수 $k$는 $-2,-1,0,1,2$이다. $k=\\pm3$에서는 $x=k$가 등호를 이루므로 제외한다.",
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
    "rpmPrimaryRecordId": "H1-RPM-243",
    "problemTypeKey": "PT_QUANTIFIER_NEGATION",
    "templateKey": "TPL_EXISTENTIAL_NEGATION_PARAMETER",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
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
    "content": "곡선 $y=\\sqrt{8x+16}-1$과 직선 $x-y=-k$가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 범위를 모두 구하여 설명하시오. [7점]",
    "choices": [],
    "answer": "1\\le k<3",
    "solution": "$t=\\sqrt{8x+16}\\ge0$이라 두면 $x=\\frac{t^2}8-2$, $y=t-1$이고 직선 조건은 $t^2-8t+8(k-1)=0$이다. 서로 다른 두 비음수 근을 가져야 하므로 근의 곱 $8(k-1)\\ge0$에서 $k\\ge1$, 판별식 $64-32(k-1)>0$에서 $k<3$이다. 두 근의 합은 $8>0$이고 $k=1$에서 한 근이 $0$이므로 포함된다. 답은 $1\\le k<3$이다.",
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
    "rpmPrimaryRecordId": "H1-RPM-272",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_GRAPH_INTERSECTION_COUNT",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "essayAnswer": "1\\le k<3"
  },
  {
    "id": 23,
    "number": 23,
    "score": 7,
    "points": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\frac{ax+b}{x-2}$에서 $f(4)=13$이다. $|f(x)|=3$은 실근을 오직 한 개 가지며 그 실근은 음수이다. $|f(x)|=\\alpha$($\\alpha>0$)의 두 실근 $\\beta<\\gamma$가 모두 양수이고 작은 근 $\\beta$가 정수일 때, $\\alpha+\\beta+\\gamma$를 구하고 근의 부호를 검증하시오. [7점]",
    "choices": [],
    "answer": "\\frac{150}{7}",
    "solution": "$f(4)=13$이므로 $4a+b=26$이다. $|f|=3$에 실근이 한 개뿐이려면 점근선의 높이 $a$가 $\\pm3$이다. $a=3$이면 $b=14$, $f(x)=3+\\frac{20}{x-2}$이고 $f=-3$의 근은 $x=2-\\frac{20}6=-\\frac43<0$이다. 반면 $a=-3$이면 $b=38$, $f(x)=-3+\\frac{32}{x-2}$이고 $f=3$의 근 $x=2+\\frac{32}6>0$이므로 제외한다. $a=3$으로 확정한다. $|f|=\\alpha$가 두 양의 근을 가지려면 $\\alpha>3$이고 $\\beta=2-\\frac{20}{\\alpha+3}$는 $0<\\beta<2$이다. 정수이므로 $\\beta=1$, 따라서 $\\alpha=17$이다. 큰 근은 $\\gamma=2+\\frac{20}{17-3}=\\frac{24}7$이다. 따라서 $\\alpha+\\beta+\\gamma=17+1+\\frac{24}7=\\frac{150}7$이다.",
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
        "reason": "유리함수에 대한 y=±c 교점과 극점 제외 확인"
      }
    },
    "standardUnitKey": "H22-C2-08",
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "rpmPrimaryRecordId": "H1-RPM-265",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "reviewStatus": "review_required",
    "solutionStatus": "self_checked",
    "essayAnswer": "\\frac{150}{7}"
  }
];
