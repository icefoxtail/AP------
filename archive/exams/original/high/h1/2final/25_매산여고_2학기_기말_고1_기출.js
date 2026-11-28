/*
 * CODEX HANDOFF — WIP ONLY, DO NOT MERGE OR PUBLISH AS-IS.
 * 대상: 2025 순천매산여고 고1 2학기 기말 공통수학2 원본 기출 23문항.
 * PDF 원본 SHA-256: 15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd
 * 현재: CREATE 1차 발문·보기·정답·학생용 해설 입력, 자체 검산. JS 문법 및 23문항·100점 구조 검사 PASS.
 * 미완료: 독립 R1 blind·R2 학생 관점·R3 구조/화면, 공식 메타/4칸, 문제·해설 46축 SVG 판정,
 *         공식 plan JSON·엔진 렌더·모바일/A4 검수, 최종 등록 검증 및 main 반영.
 * 원문 주의: q07의 +1, q14의 +k, q16의 +1은 근호 밖. q17의 -k는 근호 안·-2는 밖.
 * 2026-11-28 재대조: q16 원문 근호 밖 +1 복원, 답 ⑤→②, 해설 수정. 독립 R1은 아직 NOT_RUN.
 * q03 대응 f:{1→3,3→5,5→1}, g:{1→5,3→3,5→1}.
 * q15 대응 f:{1→2,2→1,3→2,4→4}; sourceDiagramModel에 데이터가 있음.
 * q23 원문: '오직 한 개의 음의 실근만 갖는다.'(양의 실근 존재를 명시적으로 배제하지 않음).
 *      실제 원문 조건만으로는 a=0, alpha=8, beta=1, gamma=3인 다른 답 12도 가능함.
 *      학생용 문항은 '실근을 오직 한 개 가지며, 그 실근은 음수'로 최소 명확화(원문 의미 교정).
 *      의도된 해 63/4는 유지. 독립 R1에서 수정된 발문 기준으로 재검할 것.
 * SVG 정책: PDF 그림 PNG 잘라넣기 금지. 신규 그림은 공식 엔진 plan JSON만 사용.
 * 다음 작업자는 AGENTS.md, archive/AGENTS.md, question-js-flow.md, exam-pipeline.md,
 * visual-svg.md 및 AUTHOR_GUIDE.md를 읽고 현재 단계부터 이어간다.
 */
window.examTitle = "25_매산여고_2학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "number": 1,
    "score": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "다음 명제가 참이 되도록 하는 정수 $k$의 최댓값을 구하면? [3.7점]<br>$x\\le 3k$이면 $2x+7>5x-20$이다.",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "명제의 결론 $2x+7>5x-20$을 정리하면 $3x<27$, 즉 $x<9$이다.\n주어진 명제는 '$x\\le3k$이면 $x<9$이다'와 같으므로, $x=3k$도 반드시 $9$보다 작아야 한다.\n따라서 $3k<9$, 즉 $k<3$이다. 이 조건을 만족하는 정수 $k$의 최댓값은 $2$이다.\n정답은 ③이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "1",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 2,
    "number": 2,
    "score": 3.6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "전체집합 $U=\\{1,2,3,4,5,6,7\\}$의 두 부분집합 $A$, $B$에 대하여 $(A^{C}\\cup B)\\cap A=\\{3,7\\}$, $(B^{C}\\cup A)^{C}=\\{4,5\\}$일 때, 집합 $B$의 원소의 개수를 구하면? [3.6점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "집합의 분배법칙을 이용하면 $(A^{C}\\cup B)\\cap A=(A^{C}\\cap A)\\cup(B\\cap A)=A\\cap B$이다. 따라서 $A\\cap B=\\{3,7\\}$이다.\n드모르간 법칙으로 $(B^{C}\\cup A)^{C}=B\\cap A^{C}=\\{4,5\\}$이다.\n집합 $B$는 $A$에 속하는 부분과 $A$에 속하지 않는 부분으로 나뉘므로 $B=(A\\cap B)\\cup(A^{C}\\cap B)=\\{3,4,5,7\\}$이다.\n원소의 개수는 $4$개이므로 정답은 ④이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "2",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 3,
    "number": 3,
    "score": 3.7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "다음 그림과 같은 두 함수 $f$, $g$에 대하여 $(f\\circ g^{-1}\\circ f^{-1})(1)+(g\\circ f)^{-1}(3)$의 값을 구하면? [3.7점]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "그림에서 $f(1)=3$, $f(3)=5$, $f(5)=1$이고, $g(1)=5$, $g(3)=3$, $g(5)=1$이다.\n먼저 역함수는 대응의 화살표를 거꾸로 따라간다. $f^{-1}(1)=5$, $g^{-1}(5)=1$이므로 $(f\\circ g^{-1}\\circ f^{-1})(1)=f(g^{-1}(5))=f(1)=3$이다.\n또 $(g\\circ f)(1)=g(f(1))=g(3)=3$이므로 $(g\\circ f)^{-1}(3)=1$이다.\n따라서 구하는 값은 $3+1=4$이고 정답은 ①이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "3",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "assets/images/25_매산여고_2학기_기말_고1_기출/q3-problem.svg",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q3-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "REQUIRED",
        "reason": "PDF 원문에 대응도가 있어 공식 SVG 플랜 필요"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "sourceDiagramModel": {
      "sets": [
        [
          1,
          3,
          5
        ],
        [
          1,
          3,
          5
        ],
        [
          1,
          3,
          5
        ]
      ],
      "f": [
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
      ],
      "g": [
        [
          1,
          5
        ],
        [
          3,
          3
        ],
        [
          5,
          1
        ]
      ],
      "readFrom": "원본 1쪽 대응도 300dpi 확대 확인"
    },
    "tags": [],
    "imageAlt": "세 집합 X 사이의 함수 f와 g의 대응도",
    "imageCaption": "세 집합 X 사이의 함수 f와 g의 대응도",
    "imageSize": "full",
    "solutionImageAlt": "함수 f와 g의 화살표를 정방향·역방향으로 따라 합성함수와 역함수의 값을 결정한다.",
    "solutionImageCaption": "함수 f와 g의 화살표를 정방향·역방향으로 따라 합성함수와 역함수의 값을 결정한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 4,
    "number": 4,
    "score": 3.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$\\dfrac1x-\\dfrac3{x(x+2)}=\\dfrac{bx+c}{x^2+ax}$일 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값을 구하면? [3.5점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "왼쪽을 통분하면 $\\dfrac1x-\\dfrac3{x(x+2)}=\\dfrac{x+2-3}{x(x+2)}=\\dfrac{x-1}{x^2+2x}$이다.\n따라서 오른쪽의 계수를 비교하면 $a=2$, $b=1$, $c=-1$이다.\n그러므로 $a+b+c=2+1-1=2$이며 정답은 ②이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "4",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 5,
    "number": 5,
    "score": 3.6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "무리함수 $y=\\sqrt{4x+8}-3$의 그래프의 정의역은 $\\{x\\mid x\\ge a\\}$이고 치역은 $\\{y\\mid y\\ge b\\}$일 때, 상수 $a,b$에 대하여 $a+b$의 값을 구하면? [3.6점]",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "①",
    "solution": "근호 안의 값이 음수가 아니어야 하므로 $4x+8\\ge0$에서 $x\\ge-2$이다. 즉 $a=-2$이다.\n$\\sqrt{4x+8}\\ge0$이므로 $y=\\sqrt{4x+8}-3\\ge-3$이고, $x=-2$에서 $y=-3$이므로 $b=-3$이다.\n따라서 $a+b=-2-3=-5$이고 정답은 ①이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "5",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 6,
    "number": 6,
    "score": 3.8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "유리함수 $y=\\dfrac{3x+8}{x+2}$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $q$만큼 평행이동 하면 유리함수 $y=\\dfrac{-x+7}{x-5}$의 그래프와 일치할 때, 실수 $p,q$에 대하여 $p+q$의 값을 구하면? [3.8점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "원래 함수를 정리하면 $y=\\dfrac{3x+8}{x+2}=3+\\dfrac2{x+2}$이다. 점근선은 $x=-2$, $y=3$이다.\n이동한 함수는 $y=\\dfrac{-x+7}{x-5}=-1+\\dfrac2{x-5}$이고 점근선은 $x=5$, $y=-1$이다.\n따라서 오른쪽으로 $7$만큼, 아래로 $4$만큼 이동했으므로 $p=7$, $q=-4$이다.\n$p+q=3$이므로 정답은 ③이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "6",
    "sourcePageNo": 1,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q6-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "원래 점근선 (-2,3)에서 이동 후 (5,-1)로 옮겨져 이동량 (7,-4)이 된다.",
    "solutionImageCaption": "원래 점근선 (-2,3)에서 이동 후 (5,-1)로 옮겨져 이동량 (7,-4)이 된다.",
    "solutionImageSize": "full"
  },
  {
    "id": 7,
    "number": 7,
    "score": 3.8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "정의역이 $\\{x\\mid -3\\le x\\le0\\}$인 무리함수 $y=\\sqrt{-4x+a}+1$의 최솟값이 $3$일 때, 최댓값을 구하면? (단, $a$는 실수) [3.8점]",
    "choices": [
      "$8$",
      "$7$",
      "$6$",
      "$5$",
      "$4$"
    ],
    "answer": "④",
    "solution": "함수는 $y=\\sqrt{-4x+a}+1$이고 정의역은 $-3\\le x\\le0$이다. 근호 안의 일차식 $-4x+a$는 $x$가 증가하면 감소하므로 함수도 감소한다.\n따라서 최솟값은 $x=0$에서 생겨 $\\sqrt a+1=3$이다. $\\sqrt a=2$이므로 $a=4$이다.\n최댓값은 $x=-3$에서 $\\sqrt{12+4}+1=4+1=5$이다.\n정답은 ④이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "7",
    "sourcePageNo": 2,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 8,
    "number": 8,
    "score": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$x>-1$일 때, $x+\\dfrac9{x+1}$은 $x=a$일 때, 최솟값 $b$를 갖는다. $a+b$의 값을 구하면? [3.9점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "$t=x+1$로 두면 $x>-1$에서 $t>0$이고 $x+\\dfrac9{x+1}=t+\\dfrac9t-1$이다.\n양수 $t$에 대해 산술평균과 기하평균의 관계로 $t+\\dfrac9t\\ge2\\sqrt{t\\cdot9/t}=6$이다. 등호는 $t=9/t$, 즉 $t=3$에서 성립한다.\n따라서 $x=t-1=2$에서 최솟값 $b=5$를 갖는다. $a=2$이므로 $a+b=7$이고 정답은 ⑤이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "8",
    "sourcePageNo": 2,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 9,
    "number": 9,
    "score": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "공집합이 아닌 집합 $X$를 정의역으로 하는 두 함수 $f(x)=x^3-5x+4$, $g(x)=2x-2$에 대하여 $f=g$를 만족시키는 집합 $X$의 개수를 구하면? [3.9점]",
    "choices": [
      "$1$",
      "$3$",
      "$4$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "두 함수가 정의역 $X$에서 같으려면 $X$의 모든 원소가 $f(x)=g(x)$를 만족해야 한다.\n$x^3-5x+4=2x-2$에서 $x^3-7x+6=0$이고, 인수분해하면 $(x+3)(x-1)(x-2)=0$이다.\n따라서 $X$는 $\\{-3,1,2\\}$의 공집합이 아닌 부분집합이다. 원소가 $3$개인 집합의 부분집합은 $2^3=8$개이며 공집합을 제외하면 $7$개이다.\n정답은 ④이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "9",
    "sourcePageNo": 2,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 10,
    "number": 10,
    "score": 4.1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "전체집합 $U=\\{x\\mid x\\text{는 실수}\\}$에 대하여 두 조건 $p,q$가 $p:-9<x\\le18$, $q:x^2-4ax+3a^2>0$이다. $\\sim q$가 $p$이기 위한 충분조건이 되도록 하는 정수 $a$의 개수를 구하면? [4.1점]",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$15$"
    ],
    "answer": "②",
    "solution": "$q:x^2-4ax+3a^2>0$은 $(x-a)(x-3a)>0$과 같다. 따라서 $\\sim q$의 진리집합은 두 수 $a$, $3a$ 사이의 닫힌구간이다.\n이 집합이 $p:-9<x\\le18$의 진리집합에 포함되어야 한다.\n$a<0$이면 왼쪽 끝은 $3a$이므로 $3a>-9$, 즉 $a>-3$이다. 가능한 음의 정수는 $-2,-1$이다.\n$a\\ge0$이면 오른쪽 끝은 $3a$이므로 $3a\\le18$, 즉 $0\\le a\\le6$이다. 가능한 정수는 $0,1,2,3,4,5,6$이다.\n모두 $2+7=9$개이므로 정답은 ②이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "10",
    "sourcePageNo": 2,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q10-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "a=6를 예로 들면 ¬q의 닫힌구간이 p에 포함되어야 하며 p의 열린·닫힌 끝점을 구분한다.",
    "solutionImageCaption": "a=6를 예로 들면 ¬q의 닫힌구간이 p에 포함되어야 하며 p의 열린·닫힌 끝점을 구분한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 11,
    "number": 11,
    "score": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "유리함수 $y=\\dfrac{2x-3}{x-1}$의 그래프에 대한 &lt;보기&gt;의 설명 중 옳은 것만을 있는 대로 고른 것은? [4.0점]<br><br>&lt;보 기&gt;<br>ㄱ. 점근선의 방정식은 $x=1$, $y=2$이다.<br>ㄴ. 제3사분면을 지나지 않는다.<br>ㄷ. 직선 $y=x+1$에 대하여 대칭이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$y=\\dfrac{2x-3}{x-1}=2-\\dfrac1{x-1}$로 정리한다.\nㄱ. 분모가 $0$이 되는 $x=1$과 상수항 $y=2$가 점근선이므로 참이다.\nㄴ. $x<0$에서는 $x-1<0$이므로 $-1/(x-1)>0$이고 $y>2>0$이다. 따라서 $x<0,y<0$인 제3사분면을 지나지 않으므로 참이다.\nㄷ. $(x-1)(y-2)=-1$은 중심 $(1,2)$를 지나고 기울기가 $1$인 직선 $y-2=x-1$, 즉 $y=x+1$에 대하여 대칭이므로 참이다.\n세 설명이 모두 옳으므로 정답은 ⑤이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "11",
    "sourcePageNo": 3,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q11-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "점근선 x=1, y=2와 대칭축 y=x+1을 확인한다.",
    "solutionImageCaption": "점근선 x=1, y=2와 대칭축 y=x+1을 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 12,
    "number": 12,
    "score": 4.1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=a|-3x+1|+x+5$가 일대일대응이 되도록 하는 모든 실수 $a$의 값의 범위를 구하면? [4.1점]",
    "choices": [
      "$a<-1$ 또는 $a>1$",
      "$-1<a<1$",
      "$-\\dfrac23<a<\\dfrac23$",
      "$a<-\\dfrac13$ 또는 $a>\\dfrac13$",
      "$-\\dfrac13<a<\\dfrac13$"
    ],
    "answer": "⑤",
    "solution": "$|-3x+1|$의 꺾이는 점은 $x=1/3$이다.\n$x<1/3$에서는 $f(x)=a(1-3x)+x+5=(1-3a)x+a+5$로 기울기가 $1-3a$이다.\n$x\\ge1/3$에서는 $f(x)=a(3x-1)+x+5=(1+3a)x+5-a$로 기울기가 $1+3a$이다.\n실수 전체에서 일대일대응이 되려면 그래프가 끊어짐 없이 한 방향으로 엄격히 증가 또는 감소하고 치역이 실수 전체여야 한다. 두 기울기가 모두 양수여야 하므로 $1-3a>0$, $1+3a>0$이다.\n따라서 $-1/3<a<1/3$이고 정답은 ⑤이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "12",
    "sourcePageNo": 3,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 13,
    "number": 13,
    "score": 3.9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "무리함수 $y=-\\sqrt{-4x+3}$의 그래프를 $x$축의 방향으로 $1$만큼, $y$축의 방향으로 $-2$만큼 평행이동 한 후, $y$축에 대하여 대칭이동 하면 무리함수 $y=-\\sqrt{ax+b}+c$의 그래프와 일치한다고 할 때, 실수 $a,b,c$에 대하여 $a+b+c$의 값을 구하면? [3.9점]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "③",
    "solution": "처음 함수는 $y=-\\sqrt{-4x+3}$이다. $x$축 방향으로 $1$만큼 평행이동하면 $x$를 $x-1$로 바꾸므로 $y=-\\sqrt{-4(x-1)+3}=-\\sqrt{-4x+7}$이다.\n이어 $y$축 방향으로 $-2$만큼 이동하면 $y=-\\sqrt{-4x+7}-2$이다.\n마지막으로 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 대입하여 $y=-\\sqrt{4x+7}-2$를 얻는다.\n$a=4$, $b=7$, $c=-2$이므로 합은 $9$, 정답은 ③이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "13",
    "sourcePageNo": 3,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q13-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "원함수와 이동·대칭 후 최종 무리함수의 방향 및 시작점이 서로 달라짐을 비교한다.",
    "solutionImageCaption": "원함수와 이동·대칭 후 최종 무리함수의 방향 및 시작점이 서로 달라짐을 비교한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 14,
    "number": 14,
    "score": 4.2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$-5\\le x\\le-3$에서 정의된 두 함수 $y=\\dfrac{-2x-4}{x+1}$와 $y=\\sqrt{-3x}+k$의 그래프가 한 점에서 만나도록 하는 실수 $k$의 최댓값을 구하면? [4.2점]",
    "choices": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$-4$",
      "$-5$"
    ],
    "answer": "④",
    "solution": "원문에서 두 함수는 $y=\\dfrac{-2x-4}{x+1}$와 $y=\\sqrt{-3x}+k$이다. 두 그래프가 만나는 점의 $x$좌표는 $-5\\le x\\le-3$을 만족해야 한다.\n교점 조건을 $k$에 대하여 정리하면 $k=h(x)=\\dfrac{-2x-4}{x+1}-\\sqrt{-3x}$이다.\n첫 항을 $-2-\\dfrac2{x+1}$로 고치자. $-5\\le x\\le-3$에서 $x$가 증가하면 $x+1$은 음수인 채로 $0$에 가까워지므로 $-2/(x+1)$은 증가한다. 또 $-3x$는 감소하므로 $-\\sqrt{-3x}$는 증가한다. 따라서 두 항의 합인 $h(x)$는 이 구간에서 엄격히 증가한다.\n그러므로 하나의 $k$에 대응하는 교점은 많아야 하나이며, 가능한 $k$의 최댓값은 오른쪽 끝 $x=-3$에서의 값 $h(-3)=\\dfrac{6-4}{-2}-\\sqrt9=-1-3=-4$이다.\n정답은 ④이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "14",
    "sourcePageNo": 3,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q14-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "닫힌 구간 오른쪽 끝 x=-3에서 두 그래프가 만날 때 k의 최댓값을 얻는다.",
    "solutionImageCaption": "닫힌 구간 오른쪽 끝 x=-3에서 두 그래프가 만날 때 k의 최댓값을 얻는다.",
    "solutionImageSize": "full"
  },
  {
    "id": 15,
    "number": 15,
    "score": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4\\}$에 대하여 $X$에서 $X$로의 함수 $f$가 다음 그림과 같다. 함수 $g:X\\to X$에 대하여 함수 $g\\circ f:X\\to X$의 치역의 원소의 개수가 $2$가 되도록 하는 함수 $g$의 개수를 구하면? [4.3점]",
    "choices": [
      "$144$",
      "$108$",
      "$96$",
      "$48$",
      "$36$"
    ],
    "answer": "①",
    "solution": "그림에서 $f(1)=2$, $f(2)=1$, $f(3)=2$, $f(4)=4$이다. 따라서 함수 $f$의 치역은 $\\{1,2,4\\}$로 원소가 $3$개이다.\n합성함수 $g\\circ f$의 치역 원소가 $2$개가 되려면 $g(1),g(2),g(4)$ 중 서로 다른 함수값이 정확히 $2$개여야 한다.\n먼저 나올 서로 다른 값 두 개를 집합 $X$에서 선택하는 방법은 ${}_4C_2=6$가지이다. 세 입력에 이 두 값을 배정하되 둘 다 실제로 나타나게 하는 방법은 $2^3-2=6$가지이다.\n$g(3)$은 합성함수의 치역에 영향을 주지 않으므로 $4$개 값을 자유롭게 선택한다.\n따라서 함수 $g$는 $6\\times6\\times4=144$개이고 정답은 ①이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "15",
    "sourcePageNo": 4,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "assets/images/25_매산여고_2학기_기말_고1_기출/q15-problem.svg",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "REQUIRED",
        "reason": "PDF 원문에 대응도가 있어 공식 SVG 플랜 필요"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "sourceDiagramModel": {
      "sets": [
        [
          1,
          2,
          3,
          4
        ],
        [
          1,
          2,
          3,
          4
        ]
      ],
      "f": [
        [
          1,
          2
        ],
        [
          2,
          1
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
      "readFrom": "원본 4쪽 대응도 300dpi 확대 확인"
    },
    "tags": [],
    "imageAlt": "집합 X에서 X로 가는 함수 f의 대응도",
    "imageCaption": "집합 X에서 X로 가는 함수 f의 대응도",
    "imageSize": "full"
  },
  {
    "id": 16,
    "number": 16,
    "score": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "상수 $a$에 대하여 실수 전체 집합에서 정의된 함수 $f(x)=\\begin{cases}\\sqrt{ax-2a}+1&(x\\le-1)\\\\\\dfrac{2x}{x+2}&(x>-1)\\end{cases}$이 다음 조건을 만족시킬 때, $a\\times k$의 값을 구하면? [4.3점]<br>(가) 임의의 두 실수 $x_1,x_2$에 대하여 $f(x_1)=f(x_2)$이면 $x_1=x_2$이다.<br>(나) 함수 $f(x)$의 치역은 $\\{y\\mid y>k\\}$이다.",
    "choices": [
      "$-\\dfrac23$",
      "$\\dfrac23$",
      "$1$",
      "$\\dfrac43$",
      "$2$"
    ],
    "answer": "②",
    "solution": "$x>-1$에서는 $x+2>1$이므로 $0<\\dfrac4{x+2}<4$이다. 따라서 $f(x)=\\dfrac{2x}{x+2}=2-\\dfrac4{x+2}$의 치역은 $(-2,2)$이고, 이 함수는 엄격히 증가한다.\n$x\\le-1$에서 $f(x)=\\sqrt{ax-2a}+1$이 모든 $x$에 정의되고 일대일이려면 $a<0$이어야 한다. 이때 $x$가 커지면 함수값이 감소하므로, $x=-1$에서 최솟값 $\\sqrt{-3a}+1$을 갖는다. 따라서 이 가지의 치역은 $[\\sqrt{-3a}+1,\\infty)$이다.\n전체 함수가 일대일대응이 되려면 두 가지의 치역이 겹치지 않아야 한다. 또한 전체 치역이 하나의 열린구간 $(k,\\infty)$가 되려면 $(-2,2)$ 바로 뒤의 값 $2$부터 왼쪽 가지가 채워야 한다. 따라서 $\\sqrt{-3a}+1=2$이다.\n$\\sqrt{-3a}=1$이므로 $-3a=1$, 즉 $a=-\\dfrac13$이다. 이때 전체 치역은 $(-2,2)\\cup[2,\\infty)=(-2,\\infty)$이므로 $k=-2$이다.\n따라서 $a\\times k=\\left(-\\dfrac13\\right)(-2)=\\dfrac23$이므로 정답은 ②이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "16",
    "sourcePageNo": 4,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q16-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "왼쪽 무리함수 치역은 [2,∞), 오른쪽 유리함수 치역은 (-2,2)이다.",
    "solutionImageCaption": "왼쪽 무리함수 치역은 [2,∞), 오른쪽 유리함수 치역은 (-2,2)이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 17,
    "number": 17,
    "score": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "무리함수 $f(x)=\\sqrt{2x-4-k}-2$의 그래프와 그 역함수의 그래프가 한 점에서 만날 때, 정수 $k$의 값의 합을 구하면? (단, $k\\ge-10$) [4.4점]",
    "choices": [
      "$-40$",
      "$-34$",
      "$-26$",
      "$-19$",
      "$-7$"
    ],
    "answer": "③",
    "solution": "함수는 $f(x)=\\sqrt{2x-4-k}-2$이고 정의역에서 엄격히 증가한다. 증가함수와 그 역함수의 그래프가 만나는 점은 직선 $y=x$ 위에 있으므로 $f(x)=x$를 푼다.\n$\\sqrt{2x-4-k}=x+2$이므로 $x\\ge-2$가 필요하다. 양변을 제곱하면 $2x-4-k=(x+2)^2$, 즉 $(x+1)^2=-7-k$이다.\n실근이 존재하려면 $k\\le-7$이고, 주어진 $k\\ge-10$과 합치면 후보 정수는 $-10,-9,-8,-7$이다.\n$k=-10,-9$에서는 두 형식적인 근 중 작은 근이 $-2$보다 작아 제외되어 교점이 하나다. $k=-8$에서는 $x=-2,0$으로 교점이 두 개다. $k=-7$에서는 $x=-1$ 하나다.\n따라서 조건을 만족하는 $k$는 $-10,-9,-7$이고 합은 $-26$이다. 정답은 ③이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "17",
    "sourcePageNo": 4,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q17-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "k=-7인 경우 f와 역함수가 y=x의 고정점 (-1,-1)에서 만나는 모습을 확인한다.",
    "solutionImageCaption": "k=-7인 경우 f와 역함수가 y=x의 고정점 (-1,-1)에서 만나는 모습을 확인한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 18,
    "number": 18,
    "score": 4.4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "두 곡선 $y=\\sqrt{x-1}-1$, $y=\\sqrt{x+1}+1$과 두 직선 $y=-x$, $y=-x+k$로 둘러싸인 도형의 넓이가 $10$일 때, 양수 $k$의 값을 구하면? [4.4점]",
    "choices": [
      "$5$",
      "$5\\sqrt2$",
      "$10$",
      "$10\\sqrt2$",
      "$20$"
    ],
    "answer": "①",
    "solution": "두 직선 $y=-x$, $y=-x+k$는 기울기가 $-1$인 평행한 직선이다.\n첫 곡선 $y=\\sqrt{x-1}-1$의 그래프를 왼쪽으로 $2$, 위로 $2$만큼 평행이동하면 $y=\\sqrt{x+1}+1$이 된다. 이 평행이동 방향은 두 직선과 나란하다.\n평행이동한 거리는 피타고라스 정리로 $\\sqrt{2^2+2^2}=2\\sqrt2$이다. 또 두 직선 $x+y=0$, $x+y=k$ 사이의 거리는 $k/\\sqrt2$이다.\n두 곡선은 평행이동으로 정확히 겹치므로 곡선 사이의 휜 부분을 옮겨 맞추면 넓이는 같은 밑변과 높이를 가진 평행사변형의 넓이와 같다.\n따라서 도형의 넓이는 $(2\\sqrt2)(k/\\sqrt2)=2k$이다. $2k=10$이므로 $k=5$, 정답은 ①이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "18",
    "sourcePageNo": 4,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q18-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "첫째 곡선을 (-2,2)만큼 평행이동하면 둘째 곡선이고 두 직선 절편 차 5에 대한 넓이는 2·5=10이다.",
    "solutionImageCaption": "첫째 곡선을 (-2,2)만큼 평행이동하면 둘째 곡선이고 두 직선 절편 차 5에 대한 넓이는 2·5=10이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 19,
    "number": 19,
    "score": 4.3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "$0\\le x\\le4$에서 정의된 함수 $f(x)=\\begin{cases}2x^2-4x+4&(0\\le x\\le2)\\\\-2x+8&(2<x\\le4)\\end{cases}$에 대하여 방정식 $f(x)+(f\\circ f)(x)=4$의 서로 다른 모든 실근의 합을 구하면? [4.3점]",
    "choices": [
      "$2$",
      "$\\dfrac{13}4$",
      "$6$",
      "$\\dfrac{33}4$",
      "$\\dfrac{37}4$"
    ],
    "answer": "⑤",
    "solution": "$0\\le x\\le2$에서는 $f(x)=2(x-1)^2+2$이고, $2<x\\le4$에서는 $f(x)=8-2x$이다. 먼저 $t=f(x)$로 놓으면 $0\\le t\\le4$이다.\n방정식은 $t+f(t)=4$이다.\n$0\\le t\\le2$에서는 $t+2t^2-4t+4=4$이므로 $2t^2-3t=0$이다. 따라서 $t=0$ 또는 $t=3/2$이다.\n$2<t\\le4$에서는 $t+8-2t=4$이므로 $t=4$이다.\n이제 $f(x)=0$은 $x=4$, $f(x)=3/2$는 $x=13/4$, $f(x)=4$는 $x=0,2$를 준다.\n서로 다른 모든 실근은 $0,2,13/4,4$이고 합은 $37/4$이므로 정답은 ⑤이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "19",
    "sourcePageNo": 5,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q19-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "t=f(x)로 놓으면 가로선 y=4와 t+f(t)의 그래프가 만나는 후보는 t=0,3/2,4이다. 조각별 정의역·치역 제한을 적용한다.",
    "solutionImageCaption": "t=f(x)로 놓으면 가로선 y=4와 t+f(t)의 그래프가 만나는 후보는 t=0,3/2,4이다. 조각별 정의역·치역 제한을 적용한다.",
    "solutionImageSize": "full"
  },
  {
    "id": 20,
    "number": 20,
    "score": 4.5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "wide": false,
    "content": "실수 $x$에 대한 두 조건 $p:x^2-4x+(2-2k)(2+2k)<0$, $q:|x-k-1|<2$에 대하여 명제 $q\\to p$가 거짓임을 보일 수 있는 정수인 원소의 개수가 $1$이 되도록 하는 양수 $k$의 값의 범위는 $\\alpha<k<\\beta$이다. $10(\\alpha+\\beta)$의 값을 구하면? [4.5점]",
    "choices": [
      "$5$",
      "$6$",
      "$10$",
      "$15$",
      "$30$"
    ],
    "answer": "④",
    "solution": "$p:x^2-4x+(2-2k)(2+2k)<0$을 정리하면 $(x-2)^2<(2k)^2$이다. $k>0$이므로 $p$의 진리집합은 $2-2k<x<2+2k$이다.\n$q:|x-k-1|<2$의 진리집합은 $k-1<x<k+3$이다.\n$k\\ge1$이면 $q$의 구간이 $p$의 구간에 포함되어 명제의 반례가 없으므로 $0<k<1$만 살피면 된다. 이때 $q$를 만족하는 정수는 항상 $0,1,2,3$이다.\n이 중 $x=0$은 $p$를 만족하지 않고 $x=2$는 항상 $p$를 만족한다. 정수 $1,3$이 모두 $p$를 만족하려면 $2-2k<1$ 및 $3<2+2k$, 즉 $k>1/2$이어야 한다.\n따라서 반례가 정수 하나($0$)뿐인 범위는 $1/2<k<1$이다. $\\alpha=1/2$, $\\beta=1$이므로 $10(\\alpha+\\beta)=15$이다. 정답은 ④이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "20",
    "sourcePageNo": 5,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q20-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "k=3/4를 예로 들면 q 구간의 정수 중 p에 들어가지 않는 반례는 x=0 하나이다.",
    "solutionImageCaption": "k=3/4를 예로 들면 q 구간의 정수 중 p에 들어가지 않는 반례는 x=0 하나이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 21,
    "number": 21,
    "score": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "실수 전체의 집합에서 명제 '어떤 실수 $x$에 대하여 $x^2+2kx+8\\le0$이다.'의 부정을 쓰고, 부정이 참이 되도록 하는 정수 $k$를 모두 구하시오. (풀이과정과 함께 서술하시오.) [6점]",
    "choices": [],
    "answer": "$\\forall x\\in\\mathbb R,\\;x^2+2kx+8>0$; $k=-2,-1,0,1,2$",
    "solution": "주어진 명제는 '어떤 실수 $x$에 대하여 $x^2+2kx+8\\le0$이다'이다. '어떤'의 부정은 '모든'이고, '$\\le0$'의 부정은 '$>0$'이므로 부정은 '모든 실수 $x$에 대하여 $x^2+2kx+8>0$이다'이다.\n이 부정이 참이려면 이차식이 모든 실수에서 양수여야 한다. 완전제곱식으로 $x^2+2kx+8=(x+k)^2+8-k^2$이다. $(x+k)^2$의 최솟값은 $0$이므로 $8-k^2>0$이어야 한다.\n따라서 $k^2<8$, 즉 $-2\\sqrt2<k<2\\sqrt2$이다. 정수 $k$를 모두 나열하면 $-2,-1,0,1,2$이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "서술형 1",
    "sourcePageNo": 5,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  },
  {
    "id": 22,
    "number": 22,
    "score": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "곡선 $y=\\sqrt{2x+4}$와 직선 $y=x+k$가 서로 다른 두 점에서 만나도록 하는 실수 $k$값의 범위를 구하시오. (풀이과정과 함께 서술하시오.) [7점]",
    "choices": [],
    "answer": "$2\\le k<\\dfrac52$",
    "solution": "교점에서 $y=\\sqrt{2x+4}\\ge0$이고 직선 $y=x+k$도 만족한다. $y=t\\ge0$으로 놓으면 $t^2=2x+4$이므로 $x=(t^2-4)/2$이다.\n이를 $t=x+k$에 대입하면 $t=(t^2-4)/2+k$이고, 정리하면 $t^2-2t+2k-4=0$, 즉 $(t-1)^2=5-2k$이다.\n서로 다른 두 교점이 되려면 서로 다른 두 $t$값이 모두 $0$ 이상이어야 한다. 따라서 $5-2k>0$이고 작은 근 $1-\\sqrt{5-2k}\\ge0$이어야 한다.\n이를 풀면 $k<5/2$와 $k\\ge2$를 동시에 만족해야 하므로 $2\\le k<5/2$이다. $k=2$에서는 $t=0,2$로 두 교점이 실제 존재하므로 왼쪽 끝은 포함된다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "서술형 2",
    "sourcePageNo": 5,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "assets/images/25_매산여고_2학기_기말_고1_기출/q22-solution.svg",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": [],
    "solutionImageAlt": "k=2일 때 정의역 시작점 t=0과 다른 교점 t=2가 모두 포함된다.",
    "solutionImageCaption": "k=2일 때 정의역 시작점 t=0과 다른 교점 t=2가 모두 포함된다.",
    "solutionImageSize": "full"
  },
  {
    "id": 23,
    "number": 23,
    "score": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "wide": false,
    "content": "$f(x)=\\dfrac{ax+b}{x-2}$가 다음 조건을 만족시킨다.<br>(가) $f(0)=-4$<br>(나) 방정식 $|f(x)|=3$은 실근을 오직 한 개 가지며, 그 실근은 음수이다.<br>방정식 $|f(x)|=\\alpha$가 서로 다른 두 양의 실근 $\\beta,\\gamma$를 가질 때, $\\alpha+\\beta+\\gamma$의 값을 구하시오. (단, $\\beta<\\gamma$, $\\beta$는 정수) (풀이과정과 함께 서술하시오.) [7점]",
    "choices": [],
    "answer": "$\\dfrac{63}{4}$",
    "solution": "(가)에서 $f(0)=\\dfrac{b}{-2}=-4$이므로 $b=8$이다. 따라서 $f(x)=\\dfrac{ax+8}{x-2}$이다.\n$|f(x)|=3$은 $f(x)=3$ 또는 $f(x)=-3$이고, 각각 $(a-3)x=-14$, $(a+3)x=-2$로 바뀐다.\n(나)에 의해 두 방정식에서 생기는 실근은 모두 합쳐 정확히 하나이고, 그 값은 음수이다. 첫째 방정식에 해가 없으려면 $a=3$, 둘째 방정식에 해가 없으려면 $a=-3$이다. $a=3$에서는 유일한 실근이 $x=-\\dfrac13<0$이고, $a=-3$에서는 유일한 실근이 $x=\\dfrac73>0$이므로 $a=3$이다. 따라서 $f(x)=3+\\dfrac{14}{x-2}$이다.\n$0<x<2$에서는 $f(x)=3-\\dfrac{14}{2-x}<-4<0$, $x>2$에서는 $f(x)>3>0$이다. $|f(x)|=\\alpha$의 서로 다른 두 양의 실근을 $\\beta<\\gamma$라 하면 작은 근은 $0<\\beta<2$에 있어야 하므로 정수인 $\\beta=1$이다.\n$f(1)=3-14=-11$에서 $\\alpha=11$이다. 큰 근은 $f(x)=11$을 풀어 $3+\\dfrac{14}{x-2}=11$, 즉 $\\dfrac{14}{x-2}=8$이므로 $\\gamma=2+\\dfrac74=\\dfrac{15}{4}$이다.\n따라서 $\\alpha+\\beta+\\gamma=11+1+\\dfrac{15}{4}=\\dfrac{63}{4}$이다.",
    "sourceDocumentSha256": "sha256:15aa86fe6188223ddcffdb18c10b6e4b553924e784b5aed1f62428a518d2e9cd",
    "sourceQuestionNo": "서술형 3",
    "sourcePageNo": 6,
    "sourceType": "past_exam",
    "standardCourse": "공통수학2",
    "curriculum": "2022 개정 교육과정",
    "metadataStatus": "PENDING_STAGE3",
    "reviewStatus": "STAGE2_SELF_CHECKED_R1_PENDING",
    "image": "",
    "solutionImage": "",
    "visualDisposition": {
      "problemVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 문제용 그림 판정"
      },
      "solutionVisual": {
        "requirement": "NOT_ASSESSED",
        "reason": "4단계에서 해설용 그림 판정"
      }
    },
    "tags": []
  }
];
