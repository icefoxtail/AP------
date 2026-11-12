window.examTitle = "24_향림중_2학기_기말_중1_유사";
window.archiveStatus = "candidate";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "평면도형의 성질",
    "originalCategory": "평면도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "subUnitKey": "M1-06-POLYGON_CIRCLE",
    "subUnit": "다각형과 원",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "평면도형의 성질"
    ],
    "wide": false,
    "content": "다음 원과 관련된 설명 중 옳지 않은 것은? [3점]",
    "choices": [
      "현은 원 위의 두 점을 지나는 직선이다.",
      "원의 지름은 한 원에서 가장 긴 현이다.",
      "부채꼴은 두 반지름과 호로 이루어진 도형이다.",
      "활꼴은 현과 호로 이루어진 도형이다.",
      "반원은 활꼴이면서 동시에 부채꼴이다."
    ],
    "answer": "①",
    "points": 3,
    "solution": "원의 기본 용어에 대한 정의를 확인한다. $$\\begin{aligned} \\text{① } & \\text{원 위의 두 점을 이은 선분은 현이고, 두 점을 지나는 직선은 할선이다.} \\ & \\text{따라서 현을 '직선'이라고 한 설명은 옳지 않다. (거짓)} \\ \\text{② } & \\text{원의 중심을 지나는 현이 지름이므로, 지름은 한 원에서 가장 긴 현이다. (참)} \\ \\text{③ } & \\text{부채꼴은 원의 두 반지름과 한 호로 둘러싸인 도형이다. (참)} \\ \\text{④ } & \\text{활꼴은 한 현과 그 현에 대한 호로 이루어진 도형이다. (참)} \\ \\text{⑤ } & \\text{반원은 중심각의 크기가 } 180^\\circ\\text{인 부채꼴이면서, 지름(현)과 반원 호로 이루어진 활꼴이다. (참)} \\end{aligned}$$ 따라서 옳지 않은 것은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "1",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "POLYGON_CIRCLE",
      "primaryMethod": "현은 선분이고 할선은 직선이라는 정의 구분을 적용하여 1번의 오류를 판별한다.",
      "decisiveStep": "현(선분)과 할선(직선)의 정의 차이 식별",
      "rpm": {
        "majorUnit": "평면도형",
        "midUnit": "원과 부채꼴",
        "l3": "원과 부채꼴의 기본",
        "l4": "중심각·호·현"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
        "templateKey": "TPL_CIRCLE_ANGLE_DEFINITION_CLAIM_AUDIT",
        "why": "원의 기본 구성요소(현, 할선, 부채꼴, 활꼴) 정의 진술을 감사하는 템플릿"
      },
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "원 관련 기본 용어의 정의를 직접 대조하는 1단계 개념 판정",
      "integrationPattern": "CASE_BRANCH",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 2,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE",
    "subUnit": "입체도형",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질"
    ],
    "wide": false,
    "content": "다음 <조건>을 모두 만족시키는 다면체는? [3점]\n\n\n• (가) 팔면체이다. • (나) 옆면의 모양이 사다리꼴이다.",
    "choices": [
      "육각기둥",
      "육각뿔대",
      "육각뿔",
      "칠각뿔",
      "팔각뿔대"
    ],
    "answer": "②",
    "points": 3,
    "solution": "조건 (나)에서 옆면의 모양이 사다리꼴인 다면체는 각뿔대이다. $n$각뿔대의 면의 개수는 밑면 $2$개와 옆면 $n$개를 합하여 $(n+2)$개이다. 조건 (가)에서 팔면체이므로 $$\\begin{aligned} n + 2 &= 8 \\ n &= 6 \\end{aligned}$$ 따라서 구하는 다면체는 육각뿔대이다. 따라서 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "2",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "옆면이 사다리꼴인 성질로 각뿔대를 특정하고 면의 수 n+2=8로부터 n=6인 육각뿔대를 도출한다.",
      "decisiveStep": "옆면 사다리꼴 조건(각뿔대)과 n+2=8 연립",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "다면체와 회전체",
        "l3": "다면체",
        "l4": "면·모서리·꼭짓점"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_POLYHEDRON_COMPONENT_COUNT",
        "templateKey": "TPL_M1_POLYHEDRON_COMPONENT_COUNT_CORE",
        "why": "다면체의 면의 개수와 옆면의 기하적 형태 조건으로 다면체를 결정하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "옆면 모양으로 각뿔대를 분류하고 면의 수 공식으로 밑면 다각형을 결정하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 3,
    "level": "하",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE",
    "subUnit": "입체도형",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "원뿔대를 회전축을 포함하는 평면으로 자르면 생기는 단면의 모양은? [3점]",
    "choices": [
      "직사각형",
      "이등변삼각형",
      "사다리꼴",
      "부채꼴",
      "원"
    ],
    "answer": "③",
    "points": 3,
    "solution": "원뿔대는 직각사다리꼴(또는 등변사다리꼴)의 회전축을 중심으로 회전시켜 만든 회전체이다. 이 원뿔대를 회전축을 포함하는 평면으로 자르면 윗면의 지름과 아랫면의 지름이 서로 평행하고 두 모선의 길이가 같은 등변사다리꼴 모양의 단면이 나타난다. 따라서 단면의 모양은 사다리꼴이다. 따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "3",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "원뿔대를 회전축을 포함하는 평면으로 자른 단면이 사다리꼴(등변사다리꼴)임을 회전체의 성질로 판정한다.",
      "decisiveStep": "원뿔대의 축 포함 단면 형상 식별",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "다면체와 회전체",
        "l3": "회전체",
        "l4": "회전체의 단면"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_ROTATION_SOLID_PROPERTIES",
        "templateKey": "TPL_M1_ROTATION_SOLID_AXIS_SECTION",
        "why": "회전체를 축을 포함하는 평면으로 자른 단면의 형태를 구하는 템플릿"
      },
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "원뿔대 축단면의 기본 기하 형태를 직접 연상하는 1단계 문항",
      "integrationPattern": "CASE_BRANCH",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 4,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "밑면의 세 변의 길이가 각각 $3\\text{ cm}, 4\\text{ cm}, 5\\text{ cm}$인 직각삼각형이고 높이가 $12\\text{ cm}$인 삼각기둥의 겉넓이는? [3점]",
    "choices": [
      "$132\\text{ cm}^2$",
      "$140\\text{ cm}^2$",
      "$148\\text{ cm}^2$",
      "$156\\text{ cm}^2$",
      "$164\\text{ cm}^2$"
    ],
    "answer": "④",
    "points": 3,
    "solution": "밑면은 직각을 낀 두 변의 길이가 $3\\text{ cm}, 4\\text{ cm}$인 직각삼각형이므로 한 밑면의 넓이는 $$\\begin{aligned} \\dfrac{1}{2} \\times 3 \\times 4 &= 6\\text{ cm}^2 \\end{aligned}$$ 밑면이 $2$개이므로 두 밑면의 넓이의 합은 $$\\begin{aligned} 6 \\times 2 &= 12\\text{ cm}^2 \\end{aligned}$$ 옆넓이는 밑면의 둘레의 길이에 기둥의 높이를 곱한 값이므로 $$\\begin{aligned} \\text{옆넓이} &= (3 + 4 + 5) \\times 12 \\ &= 12 \\times 12 \\ &= 144\\text{ cm}^2 \\end{aligned}$$ 따라서 삼각기둥의 겉넓이는 $$\\begin{aligned} \\text{겉넓이} &= 12 + 144 \\ &= 156\\text{ cm}^2 \\end{aligned}$$ 따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "4",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "직각삼각형 밑넓이 6cm²의 2배인 12cm²와 옆넓이 12*12=144cm²를 합산하여 겉넓이 156cm²를 도출한다.",
      "decisiveStep": "두 밑면 12cm²와 옆넓이 144cm² 합산",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "기둥의 겉넓이와 부피",
        "l4": "각기둥"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
        "why": "직각삼각형 밑면 각기둥의 전개도 겉넓이 공식 대입 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "각기둥의 밑넓이와 옆넓이 공식을 적용하여 합산하는 기본 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 5,
    "level": "하",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석"
    ],
    "wide": false,
    "content": "다음 자료의 정리와 해석과 관련된 설명 중 옳지 않은 것은? [3점]",
    "choices": [
      "자료를 수량으로 나타낸 것을 변량이라고 한다.",
      "변량을 일정한 간격으로 나눈 구간을 계급이라고 한다.",
      "자료를 정리하여 계급과 도수로 나타낸 표를 도수분포표라고 한다.",
      "각 계급에 속하는 자료의 개수를 그 계급의 도수라고 한다.",
      "상대도수의 분포표에서 상대도수의 총합은 전체 도수에 따라 달라진다."
    ],
    "answer": "⑤",
    "points": 3,
    "solution": "통계 용어의 정의와 성질을 확인한다. $$\\begin{aligned} \\text{① } & \\text{자료를 수량으로 나타낸 값을 변량이라고 한다. (참)} \\ \\text{② } & \\text{변량을 일정한 간격으로 나눈 구간을 계급이라고 한다. (참)} \\ \\text{③ } & \\text{각 계급과 그 계급에 속하는 도수를 나타낸 표를 도수분포표라고 한다. (참)} \\ \\text{④ } & \\text{각 계급에 속하는 자료의 개수를 도수라고 한다. (참)} \\ \\text{⑤ } & \\text{상대도수의 총합은 전체 도수의 크기와 상관없이 항상 } 1\\text{이다.} \\ & \\text{따라서 '전체 도수에 따라 달라진다'는 설명은 옳지 않다. (거짓)} \\end{aligned}$$ 따라서 옳지 않은 것은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "5",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "상대도수의 총합이 항상 1이라는 불변성을 적용하여 5번의 오류를 식별한다.",
      "decisiveStep": "상대도수의 총합이 전체 도수와 무관하게 항상 1임을 확인",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "상대도수",
        "l4": "상대도수 계산"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
        "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_DISTRIBUTION_GRAPH_COMPARISON",
        "why": "자료의 정리와 상대도수의 기본 정의 및 총합 성질을 감사하는 템플릿"
      },
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "통계 기본 용어 및 상대도수 총합 성질을 직접 점검하는 1단계 문항",
      "integrationPattern": "CASE_BRANCH",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 6,
    "level": "하",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석",
      "표"
    ],
    "wide": false,
    "content": "다음 표는 어느 지역의 $5$월 한 달($31$일) 동안의 일교차를 조사하여 나타낸 도수분포표이다. 일교차가 $10^\\circ\\mathrm{C}$ 이상인 날수는? [3점]\n\n\n| 일교차 ($^\\circ\\mathrm{C}$) | 일수 (일) |\n| --- | --- |\n| $4$ 이상 ~ $6$ 미만 | $3$ |\n| $6$ ~ $8$ | $6$ |\n| $8$ ~ $10$ | $8$ |\n| $10$ ~ $12$ | $9$ |\n| $12$ ~ $14$ | $5$ |\n| 합계 | $31$ |",
    "choices": [
      "$14$일",
      "$15$일",
      "$16$일",
      "$17$일",
      "$18$일"
    ],
    "answer": "①",
    "points": 3,
    "solution": "일교차가 $10^\\circ\\mathrm{C}$ 이상인 계급은 $10^\\circ\\mathrm{C}$ 이상 $12^\\circ\\mathrm{C}$ 미만과 $12^\\circ\\mathrm{C}$ 이상 $14^\\circ\\mathrm{C}$ 미만의 두 계급이다. 해당 계급의 도수는 각각 $9$일, $5$일이므로 구하는 날수는 $$\\begin{aligned} 9 + 5 &= 14\\text{ (일)} \\end{aligned}$$ 따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "6",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "10도 이상인 두 계급(10~12도 9일, 12~14도 5일)의 도수를 합산하여 14일을 구한다.",
      "decisiveStep": "10도 이상 계급 도수 9와 5의 합산",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "도수분포",
        "l4": "도수분포표"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
        "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
        "why": "도수분포표에서 특정 기준 이상인 계급들의 도수를 합산하는 템플릿"
      },
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "도수분포표에서 주어진 조건의 계급을 찾아 도수를 단순 덧셈하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 7,
    "level": "중",
    "category": "평면도형의 성질",
    "originalCategory": "평면도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "평면도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림의 원 $O$에서 중심각 $45^\\circ$에 대한 호의 길이가 $6\\text{ cm}$, 중심각 $x^\\circ$에 대한 호의 길이가 $12\\text{ cm}$, 중심각 $60^\\circ$에 대한 호의 길이가 $y\\text{ cm}$일 때, $x + y$의 값은? [4점]",
    "choices": [
      "$96$",
      "$98$",
      "$100$",
      "$102$",
      "$104$"
    ],
    "answer": "②",
    "points": 4,
    "solution": "한 원에서 호의 길이는 중심각의 크기에 정비례한다. 중심각 $45^\\circ$에 대한 호의 길이가 $6\\text{ cm}$이므로 비례식을 세우면 $$\\begin{aligned} 45 : x &= 6 : 12 \\ 6x &= 45 \\times 12 \\ x &= 90 \\end{aligned}$$ 또한 중심각 $60^\\circ$에 대한 호의 길이 $y$에 대해 비례식을 세우면 $$\\begin{aligned} 45 : 60 &= 6 : y \\ 3 : 4 &= 6 : y \\ 3y &= 24 \\ y &= 8 \\end{aligned}$$ 따라서 $x + y$의 값은 $$\\begin{aligned} x + y &= 90 + 8 \\ &= 98 \\end{aligned}$$ 따라서 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "7",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "POLYGON_CIRCLE",
      "primaryMethod": "호의 길이와 중심각의 정비례 관계로부터 x=90도와 y=8cm를 각각 구하고 합 98을 도출한다.",
      "decisiveStep": "정비례식으로 x=90, y=8 산출 후 합산",
      "rpm": {
        "majorUnit": "평면도형",
        "midUnit": "원과 부채꼴",
        "l3": "원과 부채꼴의 기본",
        "l4": "중심각·호·현"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
        "templateKey": "TPL_CIRCLE_ANGLE_CENTER_ARC",
        "why": "같은 원에서 중심각의 크기와 호의 길이의 정비례 관계를 적용하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "호의 길이와 중심각의 비례식을 두 번 풀어 미지수들의 합을 구하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 8,
    "level": "중",
    "category": "평면도형의 성질",
    "originalCategory": "평면도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "평면도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림의 원 $O$에서 두 부채꼴 $AOB$와 $COD$의 넓이의 합이 $25\\text{ cm}^2$이고, $\\angle AOB = 20^\\circ, \\angle COD = 2\\angle AOB$일 때, 원 $O$의 넓이는? [4점]",
    "choices": [
      "$120\\text{ cm}^2$",
      "$135\\text{ cm}^2$",
      "$150\\text{ cm}^2$",
      "$165\\text{ cm}^2$",
      "$180\\text{ cm}^2$"
    ],
    "answer": "③",
    "points": 4,
    "solution": "부채꼴 $COD$의 중심각의 크기는 $$\\begin{aligned} \\angle COD &= 2 \\times 20^\\circ \\ &= 40^\\circ \\end{aligned}$$ 두 부채꼴 $AOB$와 $COD$의 중심각의 크기의 합은 $$\\begin{aligned} 20^\\circ + 40^\\circ &= 60^\\circ \\end{aligned}$$ 부채꼴의 넓이는 중심각의 크기에 정비례하므로, 두 부채꼴의 넓이의 합은 원 전체 넓이의 $\\dfrac{60^\\circ}{360^\\circ} = \\dfrac{1}{6}$이다. 원 $O$의 넓이를 $S$라 하면 $$\\begin{aligned} \\dfrac{1}{6}S &= 25 \\ S &= 25 \\times 6 \\ &= 150\\text{ cm}^2 \\end{aligned}$$ 따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "8",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "POLYGON_CIRCLE",
      "primaryMethod": "두 부채꼴 중심각 합 60도가 원의 1/6임을 이용해 원 전체 넓이 25*6=150cm²를 역산한다.",
      "decisiveStep": "중심각의 합 60도로부터 원 전체 넓이의 1/6 비율 산출",
      "rpm": {
        "majorUnit": "평면도형",
        "midUnit": "원과 부채꼴",
        "l3": "부채꼴의 넓이",
        "l4": "중심각을 이용한 넓이"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
        "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
        "why": "부채꼴 넓이와 중심각의 정비례를 이용해 원 전체 넓이를 역산하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부채꼴 중심각의 합산과 원 전체에 대한 비례 역산을 적용하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 9,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE",
    "subUnit": "입체도형",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "다음 입체도형들은 각 면이 모두 서로 합동인 정다각형으로 이루어져 있다. 이 중 정다면체가 아닌 것은? [4점]",
    "choices": [
      "$\\text{모든 면이 합동인 정삼각형 4개이고 각 꼭짓점에 3개씩 모인다.}$",
      "$\\text{모든 면이 합동인 정사각형 6개이고 각 꼭짓점에 3개씩 모인다.}$",
      "$\\text{모든 면이 합동인 정삼각형 8개이고 각 꼭짓점에 4개씩 모인다.}$",
      "$\\text{모든 면이 합동인 정삼각형 6개로 이루어져 있고 어떤 꼭짓점에는 3개, 다른 꼭짓점에는 4개씩 모인다.}$",
      "$\\text{모든 면이 합동인 정이십면체로서 각 꼭짓점에 정삼각형이 5개씩 모인다.}$"
    ],
    "answer": "④",
    "points": 4,
    "solution": "정다면체가 되기 위해서는 다음 두 조건을 모두 만족해야 한다.\n\n\n1. 모든 면이 서로 합동인 정다각형이어야 한다.\n2. 각 꼭짓점에 모인 면의 개수가 모두 같아야 한다.\n\n\n④의 입체도형은 면이 모두 합동인 정삼각형이지만, 꼭짓점에 따라 모인 면의 개수가 $3$개 또는 $4$개로 서로 다르므로 정다면체가 아니다. ①, ②, ③, ⑤는 각각 정사면체, 정육면체, 정팔면체, 정이십면체로 모두 정다면체이다. 따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "9",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "정다면체의 정의에서 꼭짓점에 모인 면의 수가 일정해야 함을 적용하여 4번의 불일치를 판별한다.",
      "decisiveStep": "꼭짓점마다 모인 면의 수가 다른 다면체 식별",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "다면체와 회전체",
        "l3": "정다면체",
        "l4": "정다면체의 종류"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
        "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT",
        "why": "면이 합동인 정다각형이라도 꼭짓점 조건에 따라 정다면체가 아님을 판별하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "정다면체 정의의 두 가지 필요조건을 엄밀히 구별하는 문항",
      "integrationPattern": "CASE_BRANCH",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 10,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "한 모서리의 길이가 $8\\text{ cm}$인 정육면체를 평면으로 잘라 남긴 입체도형이다. 절단하는 평면은 정육면체의 깊이 방향과 평행하고, 앞면과 뒷면의 단면은 합동이다. 앞면의 단면은 높이가 $8\\text{ cm}$이고 평행한 두 변의 길이가 각각 $4\\text{ cm}, 8\\text{ cm}$인 사다리꼴이다. 남은 입체도형의 부피는? [4점]",
    "choices": [
      "$320\\text{ cm}^3$",
      "$336\\text{ cm}^3$",
      "$352\\text{ cm}^3$",
      "$368\\text{ cm}^3$",
      "$384\\text{ cm}^3$"
    ],
    "answer": "⑤",
    "points": 4,
    "solution": "앞면과 뒷면의 단면이 합동이고 절단면이 깊이 방향으로 이어지므로, 남은 입체도형은 앞면 사다리꼴을 밑면으로 하고 깊이가 $8\\text{ cm}$인 사각기둥이다. 사다리꼴의 넓이는\n$$\\begin{aligned}\nS &= \\dfrac{4+8}{2} \\times 8 \\\\\n&= 48\\text{ cm}^2\\end{aligned}$$\n따라서 부피는\n$$\\begin{aligned}\nV &= 48 \\times 8 \\\\\n&= 384\\text{ cm}^3\\end{aligned}$$\n이므로 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "10",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "앞면과 뒷면이 합동인 사다리꼴 단면의 넓이 48cm²에 깊이 8cm를 곱한다.",
      "decisiveStep": "절단면이 깊이 방향으로 일정하게 이어지는 사각기둥임을 확인하고 부피 384cm³를 계산",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "기둥의 겉넓이와 부피",
        "l4": "각기둥"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
        "why": "사다리꼴을 밑면으로 하는 기둥의 부피를 계산하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "절단된 정육면체를 사다리꼴 밑면 기둥으로 입체적으로 재해석하여 부피를 구하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 11,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $3\\text{ cm}$이고 모선의 길이가 $7\\text{ cm}$인 원뿔의 겉넓이는? [4점]",
    "choices": [
      "$30\\pi\\text{ cm}^2$",
      "$32\\pi\\text{ cm}^2$",
      "$34\\pi\\text{ cm}^2$",
      "$36\\pi\\text{ cm}^2$",
      "$40\\pi\\text{ cm}^2$"
    ],
    "answer": "①",
    "points": 4,
    "solution": "원뿔의 밑면의 반지름이 $r = 3\\text{ cm}$, 모선의 길이가 $l = 7\\text{ cm}$이다. 밑면의 넓이는 $$\\begin{aligned} \\text{밑넓이} &= \\pi r^2 \\ &= \\pi \\times 3^2 \\ &= 9\\pi\\text{ cm}^2 \\end{aligned}$$ 옆면인 부채꼴의 넓이는 $$\\begin{aligned} \\text{옆넓이} &= \\pi r l \\ &= \\pi \\times 3 \\times 7 \\ &= 21\\pi\\text{ cm}^2 \\end{aligned}$$ 따라서 원뿔의 겉넓이는 $$\\begin{aligned} \\text{겉넓이} &= 9\\pi + 21\\pi \\ &= 30\\pi\\text{ cm}^2 \\end{aligned}$$ 따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "11",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "밑넓이 9pi와 옆넓이 pi*r*l=21pi를 합산하여 원뿔 겉넓이 30pi를 도출한다.",
      "decisiveStep": "원뿔 겉넓이 공식(밑넓이+옆넓이=30pi) 산출",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "뿔의 겉넓이와 부피",
        "l4": "원뿔"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
        "why": "원뿔 겉넓이 공식에 반지름과 모선을 대입하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "원뿔 겉넓이 공식을 정확히 적용하는 기본 계산 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 12,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "가로의 길이가 $6\\text{ cm}$, 세로의 길이가 $10\\text{ cm}$, 높이가 $4\\text{ cm}$인 직육면체 모양의 그릇에 물을 가득 채운 후 기울였다. 남은 물은 그릇의 한 꼭짓점에서 만나는 서로 수직인 세 모서리의 길이가 각각 $6\\text{ cm}, 10\\text{ cm}, 4\\text{ cm}$인 삼각뿔 모양이다. 흘려보낸 물의 양은? [4점]",
    "choices": [
      "$180\\text{ cm}^3$",
      "$200\\text{ cm}^3$",
      "$210\\text{ cm}^3$",
      "$220\\text{ cm}^3$",
      "$230\\text{ cm}^3$"
    ],
    "answer": "②",
    "points": 4,
    "solution": "가득 채운 물의 부피는 직육면체의 부피와 같으므로\n$$\\begin{aligned}\nV_{\\text{전체}} &= 6 \\times 10 \\times 4 \\\\\n&= 240\\text{ cm}^3\\end{aligned}$$\n남은 물은 서로 수직인 세 모서리의 길이가 $6\\text{ cm},10\\text{ cm},4\\text{ cm}$인 삼각뿔이다. 밑면을 밑변의 길이가 $6\\text{ cm},10\\text{ cm}$인 직각삼각형으로 보면 밑넓이는 $\\dfrac12 \\times 6 \\times 10=30\\text{ cm}^2$이고 높이는 $4\\text{ cm}$이다. 따라서 남은 물의 부피는\n$$\\begin{aligned}\nV_{\\text{남은 물}} &= \\dfrac13 \\times 30 \\times 4 \\\\\n&= 40\\text{ cm}^3\\end{aligned}$$\n흘려보낸 물의 양은 $240-40=200\\text{ cm}^3$이므로 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "12",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "직육면체 부피 240cm³에서 서로 수직인 세 모서리 6,10,4를 갖는 삼각뿔 부피 40cm³를 뺀다.",
      "decisiveStep": "세 수직 모서리로 남은 물의 삼각뿔이 유일하게 정해짐을 명시하고 부피 차 200cm³를 계산",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "뿔의 겉넓이와 부피",
        "l4": "각뿔"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_VOLUME_DIFFERENCE",
        "why": "직육면체 전체 부피와 삼각뿔 부피의 차를 이용하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "남은 물의 형태가 삼각뿔임을 기하적으로 파악하고 부피 차이를 계산하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 13,
    "level": "중",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석",
      "그래프"
    ],
    "wide": false,
    "content": "어느 반 학생들의 하루 컴퓨터 사용 시간을 조사하여 나타낸 히스토그램에서 각 계급의 도수가 $0\\text{시간 이상 }2\\text{시간 미만}$ $2$명, $2\\sim4$시간 $5$명, $4\\sim6$시간 $15$명, $6\\sim8$시간 $10$명, $8\\sim10$시간 $8$명이다. 컴퓨터 사용 시간이 $6\\text{시간}$ 이상인 학생은 전체의 몇 $%$인가? [4점]",
    "choices": [
      "$35%$",
      "$40%$",
      "$45%$",
      "$50%$",
      "$55%$"
    ],
    "answer": "③",
    "points": 4,
    "solution": "전체 학생 수는 각 계급의 도수의 합이므로 $$\\begin{aligned} \\text{전체 도수} &= 2 + 5 + 15 + 10 + 8 \\ &= 40\\text{ (명)} \\end{aligned}$$ 컴퓨터 사용 시간이 $6\\text{시간}$ 이상인 학생 수는 $6\\sim8$시간과 $8\\sim10$시간의 두 계급의 도수의 합이므로 $$\\begin{aligned} 10 + 8 &= 18\\text{ (명)} \\end{aligned}$$ 따라서 구하는 백분율은 $$\\begin{aligned} \\dfrac{18}{40} \\times 100 &= 45% \\end{aligned}$$ 따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "13",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "전체 인원 40명과 6시간 이상 인원 18명으로부터 백분율 (18/40)*100=45%를 계산한다.",
      "decisiveStep": "6시간 이상 도수 18명 산출 및 백분율 환산",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "자료 해석",
        "l4": "자료에서 정보 추론"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
        "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_CLASS_GROUP_SUM",
        "why": "구간의 도수 합을 전체 도수 대비 백분율로 환산하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "전체 도수와 특정 구간 도수의 합을 구해 백분율을 산출하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [
        "CC_PERCENTAGE_CALCULATION"
      ],
      "conditionKeys": []
    }
  },
  {
    "id": 14,
    "level": "중",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석",
      "표"
    ],
    "wide": false,
    "content": "다음 표는 어느 학교 $1$학년 학생 $200$명이 받은 상점을 조사하여 나타낸 도수분포표이다. 상점이 $15$점 이상인 학생 수가 $15$점 미만인 학생 수의 $3$배일 때, 상점이 $10$점 이상 $15$점 미만인 학생 수는? [4점]\n\n\n| 상점 (점) | 학생 수 (명) |\n| --- | --- |\n| $0$ 이상 ~ $5$ 미만 | $15$ |\n| $5$ ~ $10$ | $15$ |\n| $10$ ~ $15$ | $x$ |\n| $15$ ~ $20$ | $y$ |\n| $20$ ~ $25$ | $40$ |\n| 합계 | $200$ |",
    "choices": [
      "$14$명",
      "$16$명",
      "$18$명",
      "$20$명",
      "$22$명"
    ],
    "answer": "④",
    "points": 4,
    "solution": "상점이 $15$점 미만인 학생 수는 $$\\begin{aligned} 15 + 15 + x &= 30 + x\\text{ (명)} \\end{aligned}$$ 상점이 $15$점 이상인 학생 수는 $$\\begin{aligned} y + 40\\text{ (명)} \\end{aligned}$$ 전체 학생 수가 $200$명이므로 $$\\begin{aligned} (30 + x) + (y + 40) &= 200 \\ x + y + 70 &= 200 \\ x + y &= 130 \\end{aligned}$$ 또한 $15$점 이상인 학생 수가 $15$점 미만인 학생 수의 $3$배이므로 $$\\begin{aligned} y + 40 &= 3(30 + x) \\ y + 40 &= 90 + 3x \\ y &= 3x + 50 \\end{aligned}$$ $y = 3x + 50$을 $x + y = 130$에 대입하면 $$\\begin{aligned} x + (3x + 50) &= 130 \\ 4x + 50 &= 130 \\ 4x &= 80 \\ x &= 20 \\end{aligned}$$ 따라서 상점이 $10$점 이상 $15$점 미만인 학생 수는 $20$명이다. 따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "14",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "전체 합 200과 배수 조건 y+40=3(30+x)으로 연립방정식을 세워 x=20을 구한다.",
      "decisiveStep": "연립일차방정식 x+y=130, y-3x=50 해결로 x=20 도출",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "자료 해석",
        "l4": "자료에서 정보 추론"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
        "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
        "why": "도수분포표에서 구간별 배수 조건을 이용하여 결측 도수를 연립방정식으로 구하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "자료의 구간별 도수 관계를 일차방정식으로 모델링하여 푸는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 15,
    "level": "중",
    "category": "평면도형의 성질",
    "originalCategory": "평면도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "평면도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림과 같이 중심각의 크기가 $90^\\circ$이고 반지름의 길이가 $6\\text{ cm}$인 부채꼴 $AOB$를 직선 $l$ 위에서 미끄러지지 않게 한 바퀴 굴렸다. 이때 꼭짓점 $O$가 움직인 거리는? [5점]",
    "choices": [
      "$6\\pi\\text{ cm}$",
      "$7\\pi\\text{ cm}$",
      "$7.5\\pi\\text{ cm}$",
      "$8\\pi\\text{ cm}$",
      "$9\\pi\\text{ cm}$"
    ],
    "answer": "⑤",
    "points": 5,
    "solution": "부채꼴의 호 $AB$의 길이는 $$\\begin{aligned} 2\\pi \\times 6 \\times \\dfrac{90^\\circ}{360^\\circ} &= 12\\pi \\times \\dfrac{1}{4} \\ &= 3\\pi\\text{ cm} \\end{aligned}$$ 부채꼴이 직선 $l$ 위를 한 바퀴 구르는 동안 점 $O$의 이동 경로는 다음과 같이 세 단계로 나뉜다. 1단계: 점 $B$를 중심으로 부채꼴이 $90^\\circ$ 회전할 때, 점 $O$는 반지름 $6\\text{ cm}$, 중심각 $90^\\circ$인 사분원의 호를 따라 움직이므로 이동 거리는 $$\\begin{aligned} 2\\pi \\times 6 \\times \\dfrac{1}{4} &= 3\\pi\\text{ cm} \\end{aligned}$$ 2단계: 호 $AB$가 직선 $l$ 위를 굴러가는 동안, 점 $O$는 직선 $l$과 평행하게 호 $AB$의 길이만큼 수평 이동하므로 이동 거리는 $$\\begin{aligned} 3\\pi\\text{ cm} \\end{aligned}$$ 3단계: 점 $A$가 직선에 닿은 후 점 $A$를 중심으로 다시 $90^\\circ$ 회전할 때, 점 $O$는 반지름 $6\\text{ cm}$, 중심각 $90^\\circ$인 사분원의 호를 따라 움직이므로 이동 거리는 $$\\begin{aligned} 3\\pi\\text{ cm} \\end{aligned}$$ 따라서 점 $O$가 움직인 전체 거리는 $$\\begin{aligned} 3\\pi + 3\\pi + 3\\pi &= 9\\pi\\text{ cm} \\end{aligned}$$ 따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "15",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "POLYGON_CIRCLE",
      "primaryMethod": "점 O의 궤적을 3단계(사분원 호 3pi, 수평 이동 3pi, 사분원 호 3pi)로 나누어 합 9pi를 도출한다.",
      "decisiveStep": "점 O의 3구간 이동 거리(각각 3pi)를 분할 추적하여 합산",
      "rpm": {
        "majorUnit": "평면도형",
        "midUnit": "원과 부채꼴",
        "l3": "원과 부채꼴의 기본",
        "l4": "부채꼴의 호의 길이"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
        "templateKey": "TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER",
        "why": "회전하는 부채꼴 꼭짓점의 궤적 길이를 호와 선분으로 나누어 구하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부채꼴의 굴림 운동에서 중심점의 궤적을 구간별로 분할 분석해야 하는 심화 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 16,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "가로의 길이가 $8\\pi\\text{ cm}$이고 세로의 길이가 $10\\text{ cm}$인 직사각형은 높이가 $10\\text{ cm}$인 원기둥의 옆면을 펼친 것이다. 이 원기둥의 겉넓이는? [5점]",
    "choices": [
      "$112\\pi\\text{ cm}^2$",
      "$116\\pi\\text{ cm}^2$",
      "$120\\pi\\text{ cm}^2$",
      "$124\\pi\\text{ cm}^2$",
      "$128\\pi\\text{ cm}^2$"
    ],
    "answer": "①",
    "points": 5,
    "solution": "원기둥의 옆면 직사각형의 가로의 길이는 밑면인 원의 둘레와 같다. 밑면의 반지름을 $r\\text{ cm}$라 하면 $$\\begin{aligned} 2\\pi r &= 8\\pi \\ r &= 4\\text{ cm} \\end{aligned}$$ 원기둥의 두 밑면의 넓이의 합은 $$\\begin{aligned} 2 \\times (\\pi \\times 4^2) &= 2 \\times 16\\pi \\ &= 32\\pi\\text{ cm}^2 \\end{aligned}$$ 옆면의 넓이는 직사각형의 넓이이므로 $$\\begin{aligned} 8\\pi \\times 10 &= 80\\pi\\text{ cm}^2 \\end{aligned}$$ 따라서 원기둥의 겉넓이는 $$\\begin{aligned} \\text{겉넓이} &= 32\\pi + 80\\pi \\ &= 112\\pi\\text{ cm}^2 \\end{aligned}$$ 따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "16",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "옆면 가로 8pi로부터 밑면 반지름 r=4를 역산하고 두 밑면 32pi와 옆면 80pi를 더해 겉넓이 112pi를 구한다.",
      "decisiveStep": "밑면 둘레 8pi로부터 반지름 r=4cm 산출 및 총 겉넓이 계산",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "기둥의 겉넓이와 부피",
        "l4": "원기둥"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_NET_MEASURE",
        "why": "원기둥의 옆면 전개도 치수로부터 밑면 반지름을 역산하여 겉넓이를 완성하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "옆면 전개도 가로로부터 반지름을 구하고 두 밑면과 옆면을 합산하는 2단계 계산",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 17,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "반지름의 길이가 $4\\text{ cm}$인 반구를 평평한 원형 면이 위를 향하도록 놓았다. 그 원형 면 위에 반지름의 길이가 $2\\text{ cm}$인 반구를 평평한 면이 아래를 향하도록 올려놓았으며, 두 원형 면의 중심은 일치한다. 서로 맞닿아 가려진 면을 제외한 입체도형의 겉넓이는? [5점]",
    "choices": [
      "$48\\pi\\text{ cm}^2$",
      "$52\\pi\\text{ cm}^2$",
      "$56\\pi\\text{ cm}^2$",
      "$60\\pi\\text{ cm}^2$",
      "$64\\pi\\text{ cm}^2$"
    ],
    "answer": "②",
    "points": 5,
    "solution": "겉넓이는 큰 반구의 곡면, 작은 반구의 곡면, 큰 원형 면에서 작은 원형 면을 뺀 고리 모양 평면의 합이다. 큰 반구의 곡면 넓이는 $2\\pi \\times 4^2=32\\pi\\text{ cm}^2$이고, 작은 반구의 곡면 넓이는 $2\\pi \\times 2^2=8\\pi\\text{ cm}^2$이다. 드러난 고리 모양 평면의 넓이는 $\\pi \\times 4^2-\\pi \\times 2^2=12\\pi\\text{ cm}^2$이다. 따라서 겉넓이는\n$$\\begin{aligned}\n32\\pi+8\\pi+12\\pi &= 52\\pi\\text{ cm}^2\\end{aligned}$$\n이므로 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "17",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "큰 반구 곡면, 작은 반구 곡면, 노출된 동심 고리 면을 각각 구해 합산한다.",
      "decisiveStep": "두 밑면이 같은 평면에 놓인 배치를 명시하고 노출된 고리 넓이 12π를 포함해 총 52π를 계산",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "구",
        "l4": "구의 겉넓이"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE",
        "why": "포개어진 복합 반구의 노출 곡면과 고리 단면을 합산하는 겉넓이 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "두 반구 곡면과 노출된 고리 평면을 누락 없이 구분하여 계산해야 하는 복합 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 18,
    "level": "하",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "반지름의 길이가 $6\\text{ cm}$인 구의 $\\dfrac{1}{8}$을 구의 중심을 지나도록 잘라내고 남은 부분의 부피는? [5점]",
    "choices": [
      "$216\\pi\\text{ cm}^3$",
      "$234\\pi\\text{ cm}^3$",
      "$252\\pi\\text{ cm}^3$",
      "$270\\pi\\text{ cm}^3$",
      "$288\\pi\\text{ cm}^3$"
    ],
    "answer": "③",
    "points": 5,
    "solution": "반지름의 길이가 $r = 6\\text{ cm}$인 구의 전체 부피는 $$\\begin{aligned} V_{\\text{구}} &= \\dfrac{4}{3}\\pi r^3 \\ &= \\dfrac{4}{3}\\pi \\times 6^3 \\ &= \\dfrac{4}{3}\\pi \\times 216 \\ &= 288\\pi\\text{ cm}^3 \\end{aligned}$$ 구의 $\\dfrac{1}{8}$을 잘라내었으므로 남은 부분은 구 전체 부피의 $1 - \\dfrac{1}{8} = \\dfrac{7}{8}$이다. 따라서 남은 부분의 부피는 $$\\begin{aligned} V &= 288\\pi \\times \\dfrac{7}{8} \\ &= 36\\pi \\times 7 \\ &= 252\\pi\\text{ cm}^3 \\end{aligned}$$ 따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "18",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "구의 부피 288pi를 구하고 1/8 절단 후 남은 7/8을 곱해 252pi를 산출한다.",
      "decisiveStep": "구 부피 288pi와 7/8 비율의 곱셈",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "구",
        "l4": "구의 부피"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
        "why": "구의 부피 공식에 잔여 비율을 곱하여 절단 입체의 부피를 구하는 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "구의 부피 공식 대입 후 분수 비율을 곱하는 기본 계산",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 19,
    "level": "상",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석",
      "그래프"
    ],
    "wide": false,
    "content": "다음 그림은 어느 오케스트라 단원 $40$명의 나이를 조사하여 나타낸 도수분포다각형인데 $30$세 이상 $40$세 미만인 계급이 찢어져 보이지 않는다. $20$세 이상 $30$세 미만인 단원 수가 전체의 $30%$일 때, $30$세 이상 $40$세 미만인 단원 수는? [5점] (단, 보이는 계급의 도수는 $10\\text{세 이상 }20\\text{세 미만}$ $2$명, $40\\sim50$세 $6$명, $50\\sim60$세 $3$명, $60\\sim70$세 $1$명이다.)",
    "choices": [
      "$13$명",
      "$14$명",
      "$15$명",
      "$16$명",
      "$17$명"
    ],
    "answer": "④",
    "points": 5,
    "solution": "$20$세 이상 $30$세 미만인 단원 수는 전체 $40$명의 $30%$이므로 $$\\begin{aligned} 40 \\times 0.3 &= 12\\text{ (명)} \\end{aligned}$$ 보이는 다른 계급들의 도수는 다음과 같다. $$\\begin{aligned} 10\\sim20\\text{세} &: 2\\text{명} \\ 40\\sim50\\text{세} &: 6\\text{명} \\ 50\\sim60\\text{세} &: 3\\text{명} \\ 60\\sim70\\text{세} &: 1\\text{명} \\end{aligned}$$ $30$세 이상 $40$세 미만인 단원 수를 $x$명이라 하면, 전체 인원의 합이 $40$명이므로 $$\\begin{aligned} 2 + 12 + x + 6 + 3 + 1 &= 40 \\ x + 24 &= 40 \\ x &= 16 \\end{aligned}$$ 따라서 $30$세 이상 $40$세 미만인 단원 수는 $16$명이다. 따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "19",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "백분율 30%로부터 20대 인원 12명을 구하고 전체 합 40에서 나머지 도수합 24를 빼 30대 인원 16명을 계산한다.",
      "decisiveStep": "백분율로 20대 도수 12명 산출 및 찢어진 계급 도수 x=16명 역산",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "자료 해석",
        "l4": "자료에서 정보 추론"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
        "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
        "why": "백분율 조건과 전체 도수를 결합하여 찢어진 계급의 도수를 복원하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "백분율로부터 한 계급의 도수를 먼저 구한 뒤 도수 총합으로 찢어진 계급을 복원하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [
        "CC_PERCENTAGE_CALCULATION"
      ],
      "conditionKeys": []
    }
  },
  {
    "id": 20,
    "level": "중",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "자료의 정리와 해석"
    ],
    "wide": false,
    "content": "다음은 어느 반 학생 세 명이 체육 수행평가 줄넘기 기록에 대해 나눈 대화이다.\n\n\n• 민서: 우리 반에는 줄넘기 기록이 $50$회 미만인 학생이 $8$명 있어. • 하준: $50$회 이상 $100$회 미만인 계급의 상대도수는 $0.75$야. • 도윤: $100$회 이상인 학생은 전체의 $5%$래.\n\n\n이 반의 학생 중 줄넘기 기록이 $100$회 이상인 학생 수는? [5점]",
    "choices": [
      "$1$명",
      "$3$명",
      "$4$명",
      "$5$명",
      "$2$명"
    ],
    "answer": "⑤",
    "points": 5,
    "solution": "상대도수의 총합은 항상 $1$이다. $100$회 이상인 학생의 비율이 $5%$이므로 이 계급의 상대도수는 $$\\begin{aligned} \\dfrac{5}{100} &= 0.05 \\end{aligned}$$ 따라서 $50$회 미만인 학생들의 상대도수는 $$\\begin{aligned} 1 - 0.75 - 0.05 &= 0.20 \\end{aligned}$$ $50$회 미만인 학생 수가 $8$명이므로 전체 학생 수 $N$은 $$\\begin{aligned} 0.20 \\times N &= 8 \\ N &= \\dfrac{8}{0.20} \\ &= 40\\text{ (명)} \\end{aligned}$$ 따라서 $100$회 이상인 학생 수는 전체의 $5%$이므로 $$\\begin{aligned} 40 \\times 0.05 &= 2\\text{ (명)} \\end{aligned}$$ 따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "20",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_INTERPRETATION",
      "primaryMethod": "상대도수 합 1에서 50회 미만 상대도수 0.20을 구하고 N=40명을 도출한 뒤 5%에 해당하는 2명을 계산한다.",
      "decisiveStep": "50회 미만 상대도수 0.20 도출 및 전체 40명으로부터 2명 산출",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "자료 해석",
        "l4": "자료에서 정보 추론"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
        "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
        "why": "상대도수의 합 조건으로 전체 도수를 복원하고 목표 구간 인원을 구하는 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "상대도수의 합 공식과 실제 도수로부터 전체 인원을 역산한 뒤 백분율을 곱하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [
        "CC_PERCENTAGE_CALCULATION"
      ],
      "conditionKeys": [],
      "authoringCorrection": "Q20 choice placeholders were replaced with unique integer distractors; answer ⑤=2 is source-keyed and independently verified. Distractors are reconstructed, not recovered from source."
    }
  },
  {
    "id": 21,
    "level": "상",
    "category": "평면도형의 성질",
    "originalCategory": "평면도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "평면도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "[서·논술형 1] 다음 그림과 같이 한 변의 길이가 $9\\text{ m}$인 정육각형 모양의 화단의 꼭짓점 $P$에 끈의 길이가 $15\\text{ m}$가 되도록 염소를 묶어 놓았다. 염소와 끈은 화단 안으로 들어갈 수 없을 때, 이 염소가 움직일 수 있는 영역의 최대 넓이를 구하고 그 과정을 자세히 서술하시오. (단, 끈의 매듭의 길이와 염소의 크기는 생각하지 않으며, 답에 단위를 반드시 쓰시오.) [5점]",
    "choices": [],
    "answer": "$162\\pi\\text{ m}^2$",
    "points": 5,
    "solution": "정육각형의 한 내각의 크기는 $$\\begin{aligned} \\dfrac{(6-2) \\times 180^\\circ}{6} &= 120^\\circ \\end{aligned}$$ 꼭짓점 $P$에서 화단 외부의 중심각의 크기는 $$\\begin{aligned} 360^\\circ - 120^\\circ &= 240^\\circ \\end{aligned}$$ 따라서 먼저 반지름의 길이가 $15\\text{ m}$이고 중심각의 크기가 $240^\\circ$인 큰 부채꼴 모양으로 움직일 수 있다. $$\\begin{aligned} S_1 &= \\pi \\times 15^2 \\times \\dfrac{240^\\circ}{360^\\circ} \\ &= 225\\pi \\times \\dfrac{2}{3} \\ &= 150\\pi\\text{ m}^2 \\end{aligned}$$ 끈이 $P$의 양쪽 이웃한 꼭짓점까지 화단의 변을 따라 감기면 남은 끈의 길이는 $$\\begin{aligned} 15 - 9 &= 6\\text{ m} \\end{aligned}$$ 정육각형의 한 외각의 크기는 $180^\\circ - 120^\\circ = 60^\\circ$이므로, 양쪽 두 꼭짓점에서 새로 생기는 영역은 반지름이 $6\\text{ m}$이고 중심각이 $60^\\circ$인 부채꼴 $2$개이다. $$\\begin{aligned} S_2 &= 2 \\times \\left(\\pi \\times 6^2 \\times \\dfrac{60^\\circ}{360^\\circ}\\right) \\ &= 2 \\times \\left(36\\pi \\times \\dfrac{1}{6}\\right) \\ &= 12\\pi\\text{ m}^2 \\end{aligned}$$ 따라서 염소가 움직일 수 있는 영역의 최대 넓이는 $$\\begin{aligned} S &= S_1 + S_2 \\ &= 150\\pi + 12\\pi \\ &= 162\\pi\\text{ m}^2 \\end{aligned}$$ 따라서 정답은 $162\\pi\\text{ m}^2$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "21",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "POLYGON_CIRCLE",
      "primaryMethod": "큰 부채꼴(중심각 240도, 반지름 15m) 넓이 150pi와 코너 부채꼴 2개(중심각 60도, 반지름 6m) 넓이 12pi를 합산하여 162pi를 서술한다.",
      "decisiveStep": "정육각형 외각 60도 및 잔여 끈 6m 부채꼴 2개 영역 식별 후 합산",
      "rpm": {
        "majorUnit": "평면도형",
        "midUnit": "원과 부채꼴",
        "l3": "부채꼴의 넓이",
        "l4": "중심각을 이용한 넓이"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
        "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
        "why": "다각형 외부를 도는 끈의 회전 궤적을 여러 부채꼴의 넓이로 분할 합산하는 서술형 템플릿"
      },
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "정다각형의 외각과 잔여 끈 길이를 고려하여 부채꼴들을 분할 계산하는 고난도 서술형",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 22,
    "level": "중",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "[서·논술형 2] 밑면이 한 변의 길이가 $6\\text{ cm}$인 정사각형이고 옆면이 모두 합동인 이등변삼각형인 사각뿔이 있다. 이 사각뿔의 밑넓이를 구하고, 옆면인 각 이등변삼각형의 높이가 $x\\text{ cm}$일 때 옆넓이를 $x$에 관한 식으로 나타내시오. 그리고 이 사각뿔의 겉넓이가 $120\\text{ cm}^2$일 때, $x$의 값을 구하는 과정을 자세히 서술하시오. [5점]",
    "choices": [],
    "answer": "밑넓이: $36\\text{ cm}^2$, 옆넓이: $12x\\text{ cm}^2$, $x = 7$",
    "points": 5,
    "solution": "밑면은 한 변의 길이가 $6\\text{ cm}$인 정사각형이므로 밑넓이는 $$\\begin{aligned} \\text{밑넓이} &= 6^2 \\ &= 36\\text{ cm}^2 \\end{aligned}$$ 옆면은 밑변이 $6\\text{ cm}$이고 높이가 $x\\text{ cm}$인 이등변삼각형 $4$개로 이루어져 있으므로 옆넓이는 $$\\begin{aligned} \\text{옆넓이} &= 4 \\times \\left(\\dfrac{1}{2} \\times 6 \\times x\\right) \\ &= 12x\\text{ cm}^2 \\end{aligned}$$ 사각뿔의 겉넓이는 밑넓이와 옆넓이의 합이므로 $$\\begin{aligned} 36 + 12x &= 120 \\ 12x &= 120 - 36 \\ 12x &= 84 \\ x &= 7 \\end{aligned}$$ 따라서 구하는 답은 밑넓이 $36\\text{ cm}^2$, 옆넓이 $12x\\text{ cm}^2$, $x = 7$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "22",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "밑넓이 36cm²와 옆넓이 12x cm²를 구하고 겉넓이 방정식 36+12x=120을 풀어 x=7을 서술한다.",
      "decisiveStep": "겉넓이 방정식 12x = 84 해결 및 x=7 산출",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "뿔의 겉넓이와 부피",
        "l4": "각뿔"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
        "why": "사각뿔의 밑넓이와 옆넓이를 대수식으로 표현하고 겉넓이 방정식으로 높이를 구하는 서술형 템플릿"
      },
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "각뿔의 겉넓이 구성요소를 문자로 나타내고 일차방정식을 해결하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 23,
    "level": "상",
    "category": "입체도형의 성질",
    "originalCategory": "입체도형의 성질",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "입체도형의 성질",
      "도형"
    ],
    "wide": false,
    "content": "[서·논술형 3] 오른쪽 그림의 색칠한 부분을 직선 $l$을 회전축으로 하여 $1$회전 시킬 때 생기는 회전체의 부피를 구하려고 한다. 아래 빈칸에 들어갈 두 입체도형의 이름을 차례대로 쓰고, 회전체의 부피를 구하는 과정을 자세히 서술하시오. (단, 부피는 단위를 포함하여 쓰시오.) [5점]\n\n\n[위 회전체의 부피] = [  ]의 부피 - [  ]의 부피\n\n\n(단, 색칠한 부분은 밑변이 $6\\text{ cm}$, 높이가 $9\\text{ cm}$인 직각삼각형에서 가로가 $3\\text{ cm}$, 세로가 $4\\text{ cm}$인 직사각형을 제외한 부분이다.)",
    "choices": [],
    "answer": "원뿔, 원기둥, $72\\pi\\text{ cm}^3$",
    "points": 5,
    "solution": "직선 $l$을 회전축으로 하여 $1$회전 시킬 때 생기는 회전체는 큰 직각삼각형이 회전하여 생기는 원뿔에서 직사각형이 회전하여 생기는 원기둥을 파낸 모양이다. 따라서 빈칸에 들어갈 두 입체도형의 이름은 순서대로 원뿔, 원기둥이다.\n\n\n큰 원뿔은 밑면의 반지름이 $6\\text{ cm}$, 높이가 $9\\text{ cm}$이므로 부피는 $$\\begin{aligned} V_{\\text{원뿔}} &= \\dfrac{1}{3}\\pi \\times 6^2 \\times 9 \\ &= \\dfrac{1}{3}\\pi \\times 36 \\times 9 \\ &= 108\\pi\\text{ cm}^3 \\end{aligned}$$ 안쪽의 원기둥은 밑면의 반지름이 $3\\text{ cm}$, 높이가 $4\\text{ cm}$이므로 부피는 $$\\begin{aligned} V_{\\text{원기둥}} &= \\pi \\times 3^2 \\times 4 \\ &= 36\\pi\\text{ cm}^3 \\end{aligned}$$ 따라서 구하는 회전체의 부피는 $$\\begin{aligned} V &= 108\\pi - 36\\pi \\ &= 72\\pi\\text{ cm}^3 \\end{aligned}$$ 따라서 구하는 답은 원뿔, 원기둥, $72\\pi\\text{ cm}^3$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "23",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "SOLID_FIGURE",
      "primaryMethod": "큰 원뿔 부피 108pi에서 원기둥 부피 36pi를 빼 회전체의 부피 72pi를 서술하고 빈칸에 원뿔, 원기둥을 적는다.",
      "decisiveStep": "회전체 분할(원뿔-원기둥) 식별 및 부피 차 72pi 산출",
      "rpm": {
        "majorUnit": "입체도형",
        "midUnit": "입체도형의 겉넓이와 부피",
        "l3": "복합입체도형",
        "l4": "잘라낸 입체"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
        "templateKey": "TPL_M1_SOLID_FIGURE_VOLUME_DIFFERENCE",
        "why": "회전체의 차로 합성 회전체의 부피를 구하는 서술형 템플릿"
      },
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "평면도형의 회전을 원뿔과 원기둥의 차로 공간 분할 추론하는 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [],
      "conditionKeys": []
    }
  },
  {
    "id": 24,
    "level": "하",
    "category": "자료의 정리와 해석",
    "originalCategory": "자료의 정리와 해석",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "자료의 정리와 해석",
      "표"
    ],
    "wide": false,
    "content": "[서·논술형 4] 다음은 어느 동아리 학생 $20$명의 하루 독서 시간(분)을 조사하여 나타낸 자료이다. 십의 자리의 수를 줄기로 하고, 일의 자리의 수를 잎으로 하는 줄기와 잎 그림을 완성하시오. [5점]\n\n\n[ 독서 시간 자료 (단위: 분) ] 32,  45,  28,  34,  52,  41,  60,  30,  46,  25, 55,  37,  48,  27,  62,  34,  50,  42,  65,  53",
    "choices": [],
    "answer": "2 | 5  7  8 3 | 0  2  4  4  7 4 | 1  2  5  6  8 5 | 0  2  3  5 6 | 0  2  5",
    "points": 5,
    "solution": "주어진 $20$개의 독서 시간 자료를 작은 수부터 차례대로 정렬하면 다음과 같다. $$25, 27, 28, 30, 32, 34, 34, 37, 41, 42, 45, 46, 48, 50, 52, 53, 55, 60, 62, 65$$ 십의 자리의 수를 줄기로 하고, 일의 자리의 수를 잎으로 하여 각 줄기별로 잎을 크기순으로 나열하면 다음과 같다. $$\\begin{array}{c|l} \\text{줄기} & \\text{잎} \\ \\hline 2 & 5 \\quad 7 \\quad 8 \\ 3 & 0 \\quad 2 \\quad 4 \\quad 4 \\quad 7 \\ 4 & 1 \\quad 2 \\quad 5 \\quad 6 \\quad 8 \\ 5 & 0 \\quad 2 \\quad 3 \\quad 5 \\ 6 & 0 \\quad 2 \\quad 5 \\end{array}$$ (단, $2|5$는 $25$분이다.) 따라서 구하는 줄기와 잎 그림은 위와 같다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "sourceQid": "24",
    "candidateMetadata": {
      "curriculum": "2015",
      "conceptClusterKey": "DATA_ORGANIZATION",
      "primaryMethod": "20개 변량을 크기순으로 정렬한 뒤 십의 자리를 줄기, 일의 자리를 잎으로 작성한다.",
      "decisiveStep": "변량 정렬 및 줄기 2~6에 일의 자리 잎을 순서대로 나열",
      "rpm": {
        "majorUnit": "통계",
        "midUnit": "자료의 정리와 해석",
        "l3": "도수분포",
        "l4": "도수분포표"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
        "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_STEM_LEAF_AUDIT",
        "why": "주어진 변량 자료로부터 줄기와 잎 그림을 작성하는 서술형 템플릿"
      },
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "변량을 정렬하고 줄기와 잎으로 분류 나열하는 기본 작성 문항",
      "integrationPattern": "SEQUENTIAL",
      "crossConceptKeys": [
        "CC_STEM_AND_LEAF_PLOT"
      ],
      "conditionKeys": []
    }
  }
];
