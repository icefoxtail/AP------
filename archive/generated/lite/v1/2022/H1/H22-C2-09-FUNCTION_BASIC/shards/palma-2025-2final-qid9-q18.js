window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q18-A1",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 무리함수 $f(x)=\\sqrt{x}+1$, $g(x)=\\sqrt{x-4}$의 그래프와 직선 $x+4y=16$이 각각 점 $A(4,3)$, $B(8,2)$에서 만난다. 그림의 음영처럼 두 그래프의 일부, 선분 $AB$, $x$축, $y$축으로 둘러싸인 부분의 넓이는?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A1-problem.svg",
    "imageSize": "full",
    "choices": [
      "$12$",
      "$10$",
      "$16$",
      "$20$",
      "$14$"
    ],
    "answer": "⑤",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$b=1$, $h=4$, $u=2$이므로 $S=1\\cdot4+4\\cdot2+\\dfrac{1\\cdot4}2=14$이다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A1-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "SHAPE_AREA",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "별도 매개변수 조건 없음",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 평행이동으로 곡선부분 상쇄",
        "assessmentBucket": "정확한 2차원 영역을 재배열하는 핵심 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q18-A2",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 무리함수 $f(x)=\\sqrt{x}+3$, $g(x)=\\sqrt{x-2}$의 그래프와 직선 $3x+2y=22$이 각각 점 $A(4,5)$, $B(6,2)$에서 만난다. 그림의 음영처럼 두 그래프의 일부, 선분 $AB$, $x$축, $y$축으로 둘러싸인 부분의 넓이는?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A2-problem.svg",
    "imageSize": "full",
    "choices": [
      "$16$",
      "$13$",
      "$22$",
      "$19$",
      "$17$"
    ],
    "answer": "④",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$b=3$, $h=2$, $u=2$이므로 $S=3\\cdot4+2\\cdot2+\\dfrac{3\\cdot2}2=19$이다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A2-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "SHAPE_AREA",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "별도 매개변수 조건 없음",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 평행이동으로 곡선부분 상쇄",
        "assessmentBucket": "정확한 2차원 영역을 재배열하는 핵심 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q18-A3",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 무리함수 $f(x)=\\sqrt{x}+2$, $g(x)=\\sqrt{x-5}$의 그래프와 직선 $2x+5y=43$이 각각 점 $A(9,5)$, $B(14,3)$에서 만난다. 그림의 음영처럼 두 그래프의 일부, 선분 $AB$, $x$축, $y$축으로 둘러싸인 부분의 넓이는?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A3-problem.svg",
    "imageSize": "full",
    "choices": [
      "$33$",
      "$38$",
      "$28$",
      "$43$",
      "$56$"
    ],
    "answer": "②",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$b=2$, $h=5$, $u=3$이므로 $S=2\\cdot9+5\\cdot3+\\dfrac{2\\cdot5}2=38$이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-A3-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "SHAPE_AREA",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "별도 매개변수 조건 없음",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 평행이동으로 곡선부분 상쇄",
        "assessmentBucket": "정확한 2차원 영역을 재배열하는 핵심 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q18-B1",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "양수 $h$에 대하여 두 무리함수 $f(x)=\\sqrt{x}+2$, $g(x)=\\sqrt{x-h}$의 그래프 위에 각각 점 $A(4,4)$, $B(4+h,2)$가 있다. 두 그래프의 일부, 선분 $AB$, $x$축, $y$축으로 둘러싸인 그림의 음영 부분의 넓이가 $23$일 때, $h$의 값은?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B1-problem.svg",
    "imageSize": "full",
    "choices": [
      "$\\dfrac{15}{2}$",
      "$5$",
      "$\\dfrac{15}{4}$",
      "$\\dfrac{7}{3}$",
      "$15$"
    ],
    "answer": "②",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$b=2$, $u=2$를 대입하면 $S=8+2h+h=8+3h$이다.\n$S=23$이므로 $8+3h=23$, $3h=15$에서 $h=5>0$이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B1-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "POSITIVE_PARAMETER",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "매개변수 양수에 따른 유효해 제한",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 넓이와 추가 질문의 역산·비교",
        "assessmentBucket": "주어진 면적 역산이나 삼각형의 비율 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q18-B2",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "양수 $b$에 대하여 두 무리함수 $f(x)=\\sqrt{x}+b$, $g(x)=\\sqrt{x-2}$의 그래프 위에 각각 점 $A(4,b+2)$, $B(6,2)$가 있다. 두 그래프의 일부, 선분 $AB$, $x$축, $y$축으로 둘러싸인 그림의 음영 부분의 넓이가 $24$일 때, $b$의 값은?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B2-problem.svg",
    "imageSize": "full",
    "choices": [
      "$5$",
      "$\\dfrac{10}{3}$",
      "$20$",
      "$4$",
      "$\\dfrac{20}{3}$"
    ],
    "answer": "④",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$h=2$, $u=2$를 대입하면 $S=4b+4+b=5b+4$이다.\n$S=24$이므로 $5b+4=24$, $b=4>0$이다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B2-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "POSITIVE_PARAMETER",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "매개변수 양수에 따른 유효해 제한",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 넓이와 추가 질문의 역산·비교",
        "assessmentBucket": "주어진 면적 역산이나 삼각형의 비율 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q18-B3",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 무리함수 $f(x)=\\sqrt{x}+2$, $g(x)=\\sqrt{x-4}$의 그래프 위에 각각 점 $A(9,5)$, $B(13,3)$을 잡는다. 그림의 음영 부분의 넓이를 $S$라 하자. $O(0,0)$, $P(0,2)$, $Q(4,0)$일 때, $\\dfrac{S}{[\\triangle OPQ]}$의 값은? (단, $[\\triangle OPQ]$는 삼각형 $OPQ$의 넓이이다.)",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B3-problem.svg",
    "imageSize": "full",
    "choices": [
      "$\\dfrac{15}{2}$",
      "$\\dfrac{19}{2}$",
      "$\\dfrac{17}{2}$",
      "$\\dfrac{23}{2}$",
      "$\\dfrac{17}{4}$"
    ],
    "answer": "③",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n$b=2$, $h=4$, $u=3$이므로 $S=18+12+4=34$이다.\n한편 $[\\triangle OPQ]=\\dfrac12\\cdot2\\cdot4=4$이다. 따라서 비는 $\\dfrac{34}{4}=\\dfrac{17}{2}$이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-B3-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "SHAPE_AREA",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "별도 매개변수 조건 없음",
        "integration": "SEQUENTIAL",
        "learningLevel": "곡선 넓이를 도형 넓이로 바꾸는 핵심 변형을 익힌다. 넓이와 추가 질문의 역산·비교",
        "assessmentBucket": "주어진 면적 역산이나 삼각형의 비율 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q18-C1",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "양수 $h$에 대하여 $f(x)=\\sqrt{x}+2$, $g(x)=\\sqrt{x-h}$라 한다. 그림 (가)는 두 그래프 위의 점 $A(1,3)$, $B(1+h,1)$을 잇는 선분과 두 그래프, 양의 두 좌표축으로 둘러싸인 영역이고, 그림 (나)는 점 $A(4,4)$, $B(4+h,2)$를 사용한 같은 방식의 영역이다. (나)의 넓이가 (가)의 넓이의 $2$배일 때, $h$의 값은?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C1-problem.svg",
    "imageSize": "full",
    "choices": [
      "$2$",
      "$8$",
      "$\\dfrac{2}{3}$",
      "$6$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n(가)에서는 $u=1$이므로 $S_1=2+2h$이다. (나)에서는 $u=2$이므로 $S_2=8+3h$이다.\n$S_2=2S_1$에서 $8+3h=2(2+2h)$이므로 $h=4>0$이다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C1-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다."
      },
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "COMPARATIVE",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "POSITIVE_PARAMETER",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "매개변수 양수에 따른 유효해 제한",
        "integration": "COMPARATIVE",
        "learningLevel": "두 이상의 수학 조건·예외를 연결한다. 두 그림의 넓이 비교",
        "assessmentBucket": "이차근 필터/둘 이상의 영역비/절편과 넓이를 연결하는 추가 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q18-C2",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "두 양수 $b$, $h$에 대하여 $f(x)=\\sqrt{x}+b$, $g(x)=\\sqrt{x-h}$의 그래프 위에 각각 점 $A(4,b+2)$, $B(4+h,2)$가 있다. 직선 $AB$의 기울기가 $-\\dfrac12$이고, 두 그래프의 일부, 선분 $AB$, 양의 두 좌표축으로 둘러싸인 그림의 음영 부분의 넓이가 $20$일 때, $b+h$의 값은?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C2-problem.svg",
    "imageSize": "full",
    "choices": [
      "$6$",
      "$-30$",
      "$\\dfrac{15}{2}$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n점 $A$에서 $B$로 이동할 때 $x$좌표는 $h$ 증가하고 $y$좌표는 $b$ 감소하므로 기울기는 $-\\dfrac bh$이다.\n$-\\dfrac bh=-\\dfrac12$에서 $h=2b$이다. $u=2$를 넓이식에 대입하면 $S=4b+2h+\\dfrac12bh=8b+b^2$이다.\n$b^2+8b=20$이므로 $(b-2)(b+10)=0$이다. 양수 조건에 따라 $b=2$이고, $h=4$이므로 $b+h=6$이다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C2-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA",
        "CC_LINE_EQUATION",
        "CC_QUADRATIC_EQUATION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다.",
        "CC_LINE_EQUATION": "점 A,B의 기울기·절편에서 그래프 이동량을 결정한다.",
        "CC_QUADRATIC_EQUATION": "넓이 방정식에서 두 근을 판정하여 양수 조건을 적용한다."
      },
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "POSITIVE_PARAMETER",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "매개변수 양수에 따른 유효해 제한",
        "integration": "INTERDEPENDENT",
        "learningLevel": "두 이상의 수학 조건·예외를 연결한다. 기울기→이차방정식→양수근",
        "assessmentBucket": "이차근 필터/둘 이상의 영역비/절편과 넓이를 연결하는 추가 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q18-C3",
    "sourceQid": 18,
    "sourceUid": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "무리함수 그래프의 평행이동과 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "무리함수",
      "그래프",
      "도형",
      "넓이"
    ],
    "wide": false,
    "content": "양수 $h$에 대하여 두 무리함수 $f(x)=\\sqrt{x}+2$, $g(x)=\\sqrt{x-h}$의 그래프 위에 각각 점 $A(4,4)$, $B(4+h,2)$가 있다. 직선 $AB$의 $y$절편이 $6$일 때, 두 그래프의 일부, 선분 $AB$, 양의 두 좌표축으로 둘러싸인 그림의 음영 부분의 넓이는?",
    "image": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C3-problem.svg",
    "imageSize": "full",
    "choices": [
      "$20$",
      "$14$",
      "$16$",
      "$24$",
      "$32$"
    ],
    "answer": "①",
    "solution": "두 그래프는 $(x,y)$를 $(x+h,y-b)$로 평행이동하면 겹친다. 곡선으로 생기는 대응 부분의 넓이가 서로 같으므로, 음영 부분의 넓이 $S$는 평행사변형 $PABQ$와 삼각형 $OPQ$의 넓이를 더해 구할 수 있다.\n$P(0,b)$, $Q(h,0)$, $A(u^2,b+u)$, $B(u^2+h,u)$라 놓는다. 가로 $u^2+h$, 세로 $b+u$인 직사각형에서 양쪽의 높이 $u$인 삼각형 둘과 높이 $b$인 삼각형 둘을 빼면,\n$[PABQ]=(u^2+h)(b+u)-u^3-bh=bu^2+hu$이다. $[OPQ]=\\dfrac12bh$이므로 $S=bu^2+hu+\\dfrac12bh$이다.\n직선 $AB$의 기울기는 $\\dfrac{2-4}{(4+h)-4}=-\\dfrac2h$이다. 점 $A(4,4)$를 지나므로 $y-4=-\\dfrac2h(x-4)$이다.\n$y$절편이 $6$이라는 조건에서 $6=4+\\dfrac8h$이므로 $h=4$이다.\n$b=2$, $u=2$이므로 $S=8+2h+h=8+12=20$이다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q18-C3-solution.svg",
    "solutionImageAlt": "곡선 대응 부분을 상쇄하고 두 직선 도형의 넓이를 계산하는 평행이동 해설 그림",
    "solutionImageCaption": "평행이동한 두 곡선의 대응 넓이를 상쇄하고 평행사변형·좌표축 삼각형을 더한다.",
    "solutionImageSize": "large",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-267",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 그래프",
      "rpmL4": "평행이동",
      "rpmMappingStatus": "DIRECT_BINDING_GAP",
      "problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM",
      "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION",
      "ptTplBindingStatus": "DIRECT_BINDING_GAP",
      "crossConceptKeys": [
        "CC_AREA",
        "CC_LINE_EQUATION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_AREA": "대응하는 곡선 부분을 상쇄하고 삼각형·평행사변형 넓이를 계산한다.",
        "CC_LINE_EQUATION": "점 A,B의 기울기·절편에서 그래프 이동량을 결정한다."
      },
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "POSITIVE_PARAMETER",
      "metadataDebt": [
        "RPM_PT_TPL_DIRECT_BINDING_GAP",
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "두 무리함수 그래프가 (h,-b)의 평행이동으로 대응함을 찾아야 비적분 기하 넓이 계산이 가능하다.",
        "l4": "2022 공통수학2 H1-RPM-267 L4 평행이동 재사용",
        "cross": "실제 CC_AREA가 모든 문항에 필수, C2/C3의 직선과 C2의 이차근 판정 추가",
        "condition": "매개변수 양수에 따른 유효해 제한",
        "integration": "INTERDEPENDENT",
        "learningLevel": "두 이상의 수학 조건·예외를 연결한다. 절편→이동량→넓이",
        "assessmentBucket": "이차근 필터/둘 이상의 영역비/절편과 넓이를 연결하는 추가 판단",
        "problemVisual": "REQUIRED — 곡선·직선·축 경계 음영 영역",
        "solutionVisual": "REQUIRED — 대응 곡선·평행사변형·삼각형 구분",
        "curriculum": "2022 공통수학2 그래프/직선, 중학교 평면도형 넓이, 고1 이차방정식만 사용; 미적분·벡터 배제",
        "sourceOrigin": "qid_v1_195eb212435eac707348337369896e14b4542b58f3745834d7bdf68c391945e9"
      }
    }
  }
];
