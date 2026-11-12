/* 2023 연향중 중1 2학기 기말 Drive 유사판 후보. Figures pending. */
window.examTitle = "23_연향중_2학기_기말_중1_유사";
window.archiveStatus = "candidate";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "평면도형",
    "originalCategory": "평면도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "한 원 $\\mathrm{O}$에서 중심각이 각각 $35^\\circ$, $70^\\circ$인 두 부채꼴이 있다. 중심각이 $35^\\circ$인 부채꼴의 호의 길이가 $8\\,\\mathrm{cm}$이고, 중심각이 $70^\\circ$인 부채꼴의 호의 길이를 $x$라 할 때, $x$의 값은? [3점]",
    "choices": [
      "$16\\,\\mathrm{cm}$",
      "$18\\,\\mathrm{cm}$",
      "$20\\,\\mathrm{cm}$",
      "$22\\,\\mathrm{cm}$",
      "$24\\,\\mathrm{cm}$"
    ],
    "answer": "①",
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "solution": "같은 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. $$8:x=35:70,\\quad x=8\\times\\dfrac{70}{35}=16$$ 따라서 $x=16\\,\\mathrm{cm}$이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 3,
    "sourceQid": "1",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-06-PLANE_FIGURE_MEASURE",
    "primaryMethod": "부채꼴의 호의 길이가 중심각의 크기에 정비례함을 이용하여 8:x=35:70에서 x=16을 구한다.",
    "decisiveStep": "중심각이 2배(35°→70°)이므로 호의 길이도 2배인 16cm가 됨을 적용한다.",
    "rpm": {
      "majorUnit": "평면도형",
      "midUnit": "원과 부채꼴",
      "l3": "원과 부채꼴의 기본",
      "l4": "중심각·호·현"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
      "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
      "why": "같은 원에서 중심각의 비로 부채꼴 호의 길이를 구함"
    },
    "difficultyReason": "부채꼴 호의 길이와 중심각의 정비례 관계를 바로 적용하는 1단계 기본 문항이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "원",
            "src": "stem",
            "quote": "원 $\\mathrm{O}$에서"
          },
          {
            "term": "중심각",
            "src": "stem",
            "quote": "중심각의 크기가 각각 $35^\\circ$, $70^\\circ$"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "$x$의 값을 구하면?"
          }
        ],
        "method": [
          {
            "term": "호",
            "src": "solution",
            "quote": "부채꼴의 호의 길이는",
            "evidenceType": "NAMED"
          },
          {
            "term": "비례",
            "src": "solution",
            "quote": "중심각의 크기에 정비례한다.",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 2,
    "level": "중",
    "category": "평면도형",
    "originalCategory": "평면도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "반지름의 길이가 $8\\,\\mathrm{cm}$이고 중심각의 크기가 $135^\\circ$인 부채꼴의 호의 길이를 $x$, 넓이를 $y$라고 할 때, $x+y$의 값을 구하면? [4점]",
    "choices": [
      "$24\\pi$",
      "$26\\pi$",
      "$28\\pi$",
      "$30\\pi$",
      "$32\\pi$"
    ],
    "answer": "④",
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "solution": "반지름 $r=8\\,\\mathrm{cm}$, 중심각 $\\theta=135^\\circ$이다. 호의 길이는 $x=2\\pi\\times 8\\times\\dfrac{135}{360}=6\\pi$ 넓이는 $y=\\pi\\times 8^2\\times\\dfrac{135}{360}=24\\pi$ 따라서 $x+y=6\\pi+24\\pi=30\\pi$이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "2",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-06-PLANE_FIGURE_MEASURE",
    "primaryMethod": "반지름 8, 중심각 135°인 부채꼴의 호의 길이 6π와 넓이 24π를 각각 구하여 합산한다.",
    "decisiveStep": "호의 길이 공식과 넓이 공식을 각각 계산한 뒤 6π+24π=30π를 도출한다.",
    "rpm": {
      "majorUnit": "평면도형",
      "midUnit": "원과 부채꼴",
      "l3": "부채꼴의 넓이",
      "l4": "중심각을 이용한 넓이"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
      "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
      "why": "부채꼴의 호의 길이와 넓이를 동시에 구해 합산하는 유형"
    },
    "difficultyReason": "호의 길이와 넓이 두 공식을 계산한 뒤 합을 구하는 2단계 절차이므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "부채꼴",
            "src": "stem",
            "quote": "부채꼴의 호의 길이를"
          },
          {
            "term": "반지름",
            "src": "stem",
            "quote": "반지름의 길이가 $8\\,\\mathrm{cm}$"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "$x+y$의 값을 구하면?"
          }
        ],
        "method": [
          {
            "term": "호",
            "src": "solution",
            "quote": "호의 길이는 $x=2\\pi\\times 8\\times\\dfrac{135}{360}=6\\pi$",
            "evidenceType": "NAMED"
          },
          {
            "term": "넓이",
            "src": "solution",
            "quote": "넓이는 $y=\\pi\\times 8^2\\times\\dfrac{135}{360}=24\\pi$",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 3,
    "level": "하",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "정다면체에 대한 설명으로 옳은 것을 고르면? [4점]",
    "choices": [
      "정다면체의 종류는 모두 6가지이다.",
      "정팔면체의 모서리의 개수는 12이다.",
      "정사면체의 한 꼭짓점에 모인 면의 개수는 4이다.",
      "각 꼭짓점에 모인 면의 개수만 같으면 정다면체이다.",
      "면의 모양이 정오각형인 정다면체는 정이십면체이다."
    ],
    "answer": "②",
    "subUnitKey": "M1-07-SOLID_FIGURE",
    "subUnit": "입체도형",
    "solution": "① 정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 5가지뿐이다. (거짓) ② 정팔면체의 모서리의 개수는 12이다. (참) ③ 정사면체의 한 꼭짓점에 모인 면의 개수는 3이다. (거짓) ④ 모든 면이 합동인 정다각형이고 각 꼭짓점에 모인 면의 개수가 같아야 정다면체이다. (거짓) ⑤ 면의 모양이 정오각형인 정다면체는 정십이면체이다. (거짓) 따라서 옳은 것은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "3",
    "variationType": "CONTEXT",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE",
    "primaryMethod": "정다면체의 5가지 종류와 모서리 수, 꼭짓점 모임 수, 면의 모양 정의를 진술별로 확인한다.",
    "decisiveStep": "정팔면체의 모서리 개수가 12개임을 정확히 판정한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "다면체와 회전체",
      "l3": "정다면체",
      "l4": "정다면체의 종류"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
      "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT",
      "why": "정다면체의 정의 및 모서리·면·꼭짓점 성질 감사"
    },
    "difficultyReason": "정다면체의 5개 진술 각각에 대해 모서리 수, 면의 수, 정의 충족 여부를 대조하므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "정다면체",
            "src": "stem",
            "quote": "정다면체에 대한 설명으로"
          }
        ],
        "goal": [
          {
            "term": "판정",
            "src": "stem",
            "quote": "옳은 것을 고르면?"
          }
        ],
        "method": [
          {
            "term": "정다면체",
            "src": "solution",
            "quote": "정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 5가지뿐이다.",
            "evidenceType": "NAMED"
          },
          {
            "term": "개수",
            "src": "solution",
            "quote": "정팔면체의 모서리의 개수는 12이다.",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 4,
    "level": "중",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "원기둥 위에 반구가 붙어 있는 회전체에서 원기둥의 밑면의 지름이 $10\\,\\mathrm{cm}$, 높이가 $8\\,\\mathrm{cm}$이고 반구의 지름이 $10\\,\\mathrm{cm}$일 때, 이 회전체를 회전축을 포함하는 평면으로 자른 단면의 넓이를 구하면? [4점]",
    "choices": [
      "$\\dfrac{25}{2}\\pi+40\\,\\mathrm{cm}^2$",
      "$25\\pi+80\\,\\mathrm{cm}^2$",
      "$\\dfrac{25}{2}\\pi+80\\,\\mathrm{cm}^2$",
      "$25\\pi+40\\,\\mathrm{cm}^2$",
      "$\\dfrac{25}{2}\\pi+100\\,\\mathrm{cm}^2$"
    ],
    "answer": "③",
    "subUnitKey": "M1-07-SOLID_FIGURE",
    "subUnit": "입체도형",
    "solution": "회전축을 포함하는 평면으로 자르면 단면은 가로 $10\\,\\mathrm{cm}$, 세로 $8\\,\\mathrm{cm}$인 직사각형과 반지름 $5\\,\\mathrm{cm}$인 반원으로 이루어진다. $$10\\times8=80\\,\\mathrm{cm}^2,\\qquad \\dfrac12\\pi\\times5^2=\\dfrac{25}{2}\\pi\\,\\mathrm{cm}^2$$ 따라서 단면의 넓이는 $\\dfrac{25}{2}\\pi+80\\,\\mathrm{cm}^2$이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_ROTATION_SOLID_PROPERTIES",
    "templateKey": "TPL_M1_ROTATION_SOLID_AXIS_SECTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "4",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE",
    "primaryMethod": "축단면이 가로 10·세로 8인 직사각형과 반지름 5인 반원으로 분할됨을 이용해 넓이를 합산한다.",
    "decisiveStep": "원기둥의 축단면은 가로가 지름(10cm)인 직사각형이고 위쪽은 반지름 5cm인 반원임을 파악한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "다면체와 회전체",
      "l3": "회전체",
      "l4": "회전체의 단면"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_ROTATION_SOLID_PROPERTIES",
      "templateKey": "TPL_M1_ROTATION_SOLID_AXIS_SECTION",
      "why": "결합 회전체의 회전축 포함 평면 단면 넓이 분할 계산"
    },
    "difficultyReason": "축단면을 직사각형과 반원으로 분할하여 각각의 넓이를 구하고 더하므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "회전체",
            "src": "stem",
            "quote": "붙어 있는 회전체에서"
          },
          {
            "term": "원기둥",
            "src": "stem",
            "quote": "원기둥의 밑면의 지름이 $10\\,\\mathrm{cm}$"
          }
        ],
        "goal": [
          {
            "term": "넓이",
            "src": "stem",
            "quote": "단면의 넓이를 구하면?"
          }
        ],
        "method": [
          {
            "term": "단면",
            "src": "solution",
            "quote": "회전축을 포함하는 평면으로 자르면 단면은",
            "evidenceType": "NAMED"
          },
          {
            "term": "직사각형",
            "src": "solution",
            "quote": "직사각형의 넓이는 $10\\times 8=80",
            "evidenceType": "NAMED"
          },
          {
            "term": "반원",
            "src": "solution",
            "quote": "반원의 넓이는 $\\dfrac{1}{2}\\pi\\times 5^2=\\dfrac{25}{2}\\pi",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 5,
    "level": "상",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "회전축 $l$에서 $2\\,\\mathrm{cm}$ 떨어져 있는 가로 $3\\,\\mathrm{cm}$, 세로 $6\\,\\mathrm{cm}$인 직사각형을 직선 $l$을 축으로 $1$회전 시킬 때 생기는 입체도형의 겉넓이를 구하면? [4점]",
    "choices": [
      "$78\\pi\\,\\mathrm{cm}^2$",
      "$90\\pi\\,\\mathrm{cm}^2$",
      "$102\\pi\\,\\mathrm{cm}^2$",
      "$114\\pi\\,\\mathrm{cm}^2$",
      "$126\\pi\\,\\mathrm{cm}^2$"
    ],
    "answer": "⑤",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "회전하여 생기는 속이 빈 원기둥의 안쪽 반지름은 $2\\,\\mathrm{cm}$, 바깥쪽 반지름은 $2+3=5\\,\\mathrm{cm}$, 높이는 $6\\,\\mathrm{cm}$이다. 바깥 옆넓이는 $2\\pi\\times5\\times6=60\\pi\\,\\mathrm{cm}^2$, 안쪽 옆넓이는 $2\\pi\\times2\\times6=24\\pi\\,\\mathrm{cm}^2$이다. 위아래 도넛 모양 면의 넓이는 $2\\pi(5^2-2^2)=42\\pi\\,\\mathrm{cm}^2$이다. 따라서 겉넓이는 $60\\pi+24\\pi+42\\pi=126\\pi\\,\\mathrm{cm}^2$이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "5",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "속 빈 원기둥의 바깥 옆넓이 60π, 안쪽 옆넓이 24π, 위아래 환형 밑넓이 합 42π를 모두 더한다.",
    "decisiveStep": "안쪽 원기둥 옆면(안쪽 옆넓이)과 위아래 환형 밑면을 빠뜨리지 않고 겉넓이에 포함한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "복합입체도형",
      "l4": "잘라낸 입체"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE",
      "why": "축에서 떨어진 직사각형 회전체의 겉넓이(속 빈 원기둥) 계산"
    },
    "difficultyReason": "바깥 옆넓이, 안쪽 옆넓이, 위아래 환형 밑면 3개 영역을 모두 구분하여 계산하므로 3단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "직사각형",
            "src": "stem",
            "quote": "세로 $6\\,\\mathrm{cm}$인 직사각형을"
          },
          {
            "term": "직선",
            "src": "stem",
            "quote": "직선 $l$을 축으로 $1$회전"
          }
        ],
        "goal": [
          {
            "term": "겉넓이",
            "src": "stem",
            "quote": "입체도형의 겉넓이를 구하면?"
          }
        ],
        "method": [
          {
            "term": "옆넓이",
            "src": "solution",
            "quote": "바깥쪽 옆넓이: $2\\pi\\times 5\\times 6=60\\pi",
            "evidenceType": "NAMED"
          },
          {
            "term": "원기둥",
            "src": "solution",
            "quote": "안쪽 옆넓이: $2\\pi\\times 2\\times 6=24\\pi",
            "evidenceType": "NAMED"
          },
          {
            "term": "밑넓이",
            "src": "solution",
            "quote": "위아래 도넛 모양 밑면 2개의 넓이 합:",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 6,
    "level": "중",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "밑면이 윗변 $3\\,\\mathrm{cm}$, 아랫변 $6\\,\\mathrm{cm}$, 높이 $4\\,\\mathrm{cm}$인 사다리꼴이고 기둥의 높이가 $8\\,\\mathrm{cm}$인 사각기둥의 부피를 구하면? [4점]",
    "choices": [
      "$144\\,\\mathrm{cm}^3$",
      "$150\\,\\mathrm{cm}^3$",
      "$156\\,\\mathrm{cm}^3$",
      "$162\\,\\mathrm{cm}^3$",
      "$168\\,\\mathrm{cm}^3$"
    ],
    "answer": "①",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "사다리꼴 밑면의 넓이는 $$\\dfrac{(3+6)\\times4}{2}=18\\,\\mathrm{cm}^2$$이다. 기둥의 높이가 $8\\,\\mathrm{cm}$이므로 부피는 $18\\times8=144\\,\\mathrm{cm}^3$이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "6",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "사다리꼴 밑넓이 18cm²를 구한 뒤 기둥 높이 8cm를 곱해 부피 144cm³를 계산한다.",
    "decisiveStep": "기둥의 부피=밑넓이×높이 공식에 사다리꼴 넓이를 대입한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "기둥의 겉넓이와 부피",
      "l4": "각기둥"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
      "why": "사다리꼴 밑면 사각기둥의 부피 계산"
    },
    "difficultyReason": "사다리꼴 넓이를 구한 뒤 기둥 높이를 곱하는 2단계 계산이므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "사다리꼴",
            "src": "stem",
            "quote": "사다리꼴이고 기둥의 높이가"
          },
          {
            "term": "각기둥",
            "src": "stem",
            "quote": "사각기둥의 부피를 구하면?"
          }
        ],
        "goal": [
          {
            "term": "부피",
            "src": "stem",
            "quote": "부피를 구하면?"
          }
        ],
        "method": [
          {
            "term": "밑넓이",
            "src": "solution",
            "quote": "사다리꼴의 넓이는",
            "evidenceType": "NAMED"
          },
          {
            "term": "부피",
            "src": "solution",
            "quote": "기둥의 높이가 $8\\,\\mathrm{cm}$이므로 부피는",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 7,
    "level": "중",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "밑면은 한 변의 길이가 $8\\,\\mathrm{cm}$인 정사각형이고 옆면은 밑변이 $8\\,\\mathrm{cm}$, 높이가 $7\\,\\mathrm{cm}$인 이등변삼각형 $4$개로 이루어진 정사각뿔의 겉넓이를 구하면? [4점]",
    "choices": [
      "$144\\,\\mathrm{cm}^2$",
      "$156\\,\\mathrm{cm}^2$",
      "$160\\,\\mathrm{cm}^2$",
      "$168\\,\\mathrm{cm}^2$",
      "$176\\,\\mathrm{cm}^2$"
    ],
    "answer": "⑤",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "정사각형 밑면의 넓이는 $8^2=64\\,\\mathrm{cm}^2$이다. 삼각형 옆면 한 개의 넓이는 $\\dfrac12\\times8\\times7=28\\,\\mathrm{cm}^2$이고, 옆면이 네 개이므로 옆넓이는 $28\\times4=112\\,\\mathrm{cm}^2$이다. 따라서 겉넓이는 $64+112=176\\,\\mathrm{cm}^2$이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "7",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "정사각형 밑넓이 64cm²와 삼각형 옆넓이 4개 합 112cm²를 더하여 겉넓이 176cm²를 구한다.",
    "decisiveStep": "밑넓이 64와 4개의 옆넓이 112를 합산한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "뿔의 겉넓이와 부피",
      "l4": "각뿔"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
      "why": "정사각뿔의 밑넓이와 옆넓이 4개 합산"
    },
    "difficultyReason": "밑넓이와 옆넓이 4개를 각각 구해 합산하는 2단계 계산이므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "각뿔",
            "src": "stem",
            "quote": "이루어진 정사각뿔의 겉넓이를"
          },
          {
            "term": "정사각형",
            "src": "stem",
            "quote": "한 변의 길이가 $8\\,\\mathrm{cm}$인 정사각형"
          }
        ],
        "goal": [
          {
            "term": "겉넓이",
            "src": "stem",
            "quote": "겉넓이를 구하면?"
          }
        ],
        "method": [
          {
            "term": "밑넓이",
            "src": "solution",
            "quote": "밑면인 정사각형의 넓이는 $8^2=64",
            "evidenceType": "NAMED"
          },
          {
            "term": "옆넓이",
            "src": "solution",
            "quote": "옆넓이는 $28\\times 4=112",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 8,
    "level": "상",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "지름의 길이가 $8\\,\\mathrm{cm}$인 구의 내부에 정팔면체를 꼭 맞게 집어넣을 때, 이 정팔면체의 부피를 구하면? [4점]",
    "choices": [
      "$\\dfrac{128}{3}\\,\\mathrm{cm}^3$",
      "$\\dfrac{216}{3}\\,\\mathrm{cm}^3$",
      "$\\dfrac{256}{3}\\,\\mathrm{cm}^3$",
      "$128\\,\\mathrm{cm}^3$",
      "$256\\,\\mathrm{cm}^3$"
    ],
    "answer": "③",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "정팔면체의 가운데 정사각형을 공통 밑면으로 하여 합동인 두 사각뿔로 나눌 수 있다. 구의 지름이 $8\\,\\mathrm{cm}$이므로 정사각형의 두 대각선은 각각 $8\\,\\mathrm{cm}$이고 서로 수직이등분한다. 가운데 정사각형의 넓이는 $\\dfrac12\\times8\\times8=32\\,\\mathrm{cm}^2$이다. 사각뿔 한 개의 높이는 구의 반지름인 $4\\,\\mathrm{cm}$이므로 부피는 $\\dfrac13\\times32\\times4=\\dfrac{128}{3}\\,\\mathrm{cm}^3$이다. 두 사각뿔의 부피의 합은 $\\dfrac{128}{3}\\times2=\\dfrac{256}{3}\\,\\mathrm{cm}^3$이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "8",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "정팔면체를 대각선이 지름 8인 정사각형을 밑면으로 하고 높이가 반지름 4인 사각뿔 2개로 분할해 부피를 구한다.",
    "decisiveStep": "내접 정팔면체의 가운데 정사각형 대각선이 구의 지름 8cm임을 이용해 밑넓이 32cm²를 도출한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "뿔의 겉넓이와 부피",
      "l4": "각뿔"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
      "why": "구에 내접하는 정팔면체를 대칭 사각뿔 2개로 분할하여 부피 계산"
    },
    "difficultyReason": "구의 지름과 정팔면체 중앙 정사각형 대각선의 관계를 찾고 2개의 사각뿔 부피로 나누어 계산하므로 3단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "구",
            "src": "stem",
            "quote": "구의 내부에 정팔면체를"
          },
          {
            "term": "정다면체",
            "src": "solution",
            "quote": "정팔면체는"
          }
        ],
        "goal": [
          {
            "term": "부피",
            "src": "stem",
            "quote": "정팔면체의 부피를 구하면?"
          }
        ],
        "method": [
          {
            "term": "대각선",
            "src": "solution",
            "quote": "정사각형의 두 대각선의 길이는 각각 $8\\,\\mathrm{cm}$",
            "evidenceType": "NAMED"
          },
          {
            "term": "각뿔",
            "src": "solution",
            "quote": "사각뿔 한 개의 높이는 구의 반지름인 $4\\,\\mathrm{cm}",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 9,
    "level": "상",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "반지름의 길이가 $4\\,\\mathrm{cm}$인 구의 중심을 지나는 서로 수직인 두 평면으로 $\\dfrac{1}{4}$을 잘라 내고 남은 입체도형의 겉넓이를 $x$, 부피를 $y$라고 할 때, $x+y$의 값을 구하면? [4점]",
    "choices": [
      "$120\\pi$",
      "$128\\pi$",
      "$132\\pi$",
      "$140\\pi$",
      "$144\\pi$"
    ],
    "answer": "②",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "남은 입체의 곡면 넓이는 구 전체 겉넓이 $4\\pi\\times4^2=64\\pi\\,\\mathrm{cm}^2$의 $\\dfrac34$인 $48\\pi\\,\\mathrm{cm}^2$이다. 두 절단면은 각각 반지름 $4\\,\\mathrm{cm}$인 반원이므로 넓이의 합은 $\\pi\\times4^2=16\\pi\\,\\mathrm{cm}^2$이다. 따라서 겉넓이 $x=64\\pi\\,\\mathrm{cm}^2$이다. 남은 부피는 전체 부피 $\\dfrac43\\pi\\times4^3=\\dfrac{256}{3}\\pi\\,\\mathrm{cm}^3$의 $\\dfrac34$이므로 $y=64\\pi\\,\\mathrm{cm}^3$이다. 따라서 수치의 합은 $x+y=128\\pi$이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "9",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "구의 3/4 곡면과 2개 반원 절단면을 합쳐 겉넓이 64π를 구하고, 부피 64π를 더해 128π를 계산한다.",
    "decisiveStep": "1/4을 잘라낸 입체의 겉넓이에 두 수직 반원 절단면 넓이(16π)를 빠뜨리지 않고 더한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "복합입체도형",
      "l4": "잘라낸 입체"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_COMPOSITE_SURFACE",
      "why": "1/4이 잘린 구의 겉넓이와 부피 합산"
    },
    "difficultyReason": "구의 3/4 곡면, 절단면(반원 2개), 3/4 부피를 각각 유도하여 합하므로 3단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "구",
            "src": "stem",
            "quote": "반지름의 길이가 $4\\,\\mathrm{cm}$인 구에서"
          },
          {
            "term": "반지름",
            "src": "stem",
            "quote": "반지름의 길이가 $4\\,\\mathrm{cm}$"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "$x+y$의 값을 구하면?"
          }
        ],
        "method": [
          {
            "term": "겉넓이",
            "src": "solution",
            "quote": "따라서 겉넓이는 $x=48\\pi+16\\pi=64\\pi$",
            "evidenceType": "NAMED"
          },
          {
            "term": "부피",
            "src": "solution",
            "quote": "남은 부피는 $y=\\dfrac{256}{3}\\pi\\times\\dfrac{3}{4}=64\\pi",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 10,
    "level": "상",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $9\\,\\mathrm{cm}$인 원기둥 모양의 물통에 물을 채운 후 지름의 길이가 $6\\,\\mathrm{cm}$인 쇠구슬 $6$개를 넣었다가 모두 꺼내면 물의 높이는 몇 $\\mathrm{cm}$ 줄어드는지 구하면? [5점]",
    "choices": [
      "$\\dfrac{8}{3}\\,\\mathrm{cm}$",
      "$3\\,\\mathrm{cm}$",
      "$\\dfrac{10}{3}\\,\\mathrm{cm}$",
      "$4\\,\\mathrm{cm}$",
      "$\\dfrac{14}{3}\\,\\mathrm{cm}$"
    ],
    "answer": "①",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "쇠구슬 한 개의 반지름은 $3\\,\\mathrm{cm}$이고 부피는 $\\dfrac43\\pi\\times3^3=36\\pi\\,\\mathrm{cm}^3$이다. 여섯 개의 부피의 합은 $216\\pi\\,\\mathrm{cm}^3$이다. 물통의 밑넓이는 $\\pi\\times9^2=81\\pi\\,\\mathrm{cm}^2$이다. 물 높이 감소를 $h\\,\\mathrm{cm}$라 하면 $81\\pi h=216\\pi$이므로 $h=\\dfrac{216}{81}=\\dfrac83\\,\\mathrm{cm}$이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "10",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "구 6개의 부피 합 216π와 원기둥의 줄어든 물의 부피 81πh가 같음을 이용해 h=8/3을 구한다.",
    "decisiveStep": "쇠구슬 6개의 부피 합 216π를 물통의 밑넓이 81π로 나누어 줄어든 높이를 계산한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "구",
      "l4": "구의 부피"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION",
      "why": "원기둥 물통에서 쇠구슬 배출 시 수위 변화 계산"
    },
    "difficultyReason": "구의 부피 공식 6개 합산과 원기둥 밑넓이를 연립하여 높이 방정식을 세워 풀므로 3단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "원기둥",
            "src": "stem",
            "quote": "원기둥 모양의 물통에"
          },
          {
            "term": "지름",
            "src": "stem",
            "quote": "지름의 길이가 $6\\,\\mathrm{cm}$인 쇠구슬"
          }
        ],
        "goal": [
          {
            "term": "높이",
            "src": "stem",
            "quote": "물의 높이는 몇 $\\mathrm{cm}$ 줄어드는지 구하면?"
          }
        ],
        "method": [
          {
            "term": "부피",
            "src": "solution",
            "quote": "쇠구슬 $6$개의 전체 부피는 $36\\pi\\times 6=216\\pi",
            "evidenceType": "NAMED"
          },
          {
            "term": "밑넓이",
            "src": "solution",
            "quote": "물통의 밑넓이는 $\\pi\\times 9^2=81\\pi",
            "evidenceType": "NAMED"
          },
          {
            "term": "일차방정식",
            "src": "solution",
            "quote": "$81\\pi\\times h=216\\pi",
            "evidenceType": "IMPLIED",
            "justification": "원기둥 수위 감소 방정식을 풀어 높이 도출"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 11,
    "level": "하",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표",
      "공통자료"
    ],
    "wide": false,
    "content": "다음은 어느 문화센터 강좌 수강생 $25$명의 나이를 조사한 줄기와 잎 그림이다. 각 줄기에 속한 잎의 개수가 순서대로 $3,5,7,6,4$개일 때, 전체 수강생의 수는? <div class=\"question-table-wrap\"><table><thead><tr><th>줄기</th><th>잎</th></tr></thead><tbody><tr><td>2</td><td>1 3 7</td></tr><tr><td>3</td><td>0 2 4 6 8</td></tr><tr><td>4</td><td>1 2 3 5 6 7 9</td></tr><tr><td>5</td><td>1 2 4 5 7 8</td></tr><tr><td>6</td><td>2 3 5 8</td></tr></tbody></table></div> [3점]",
    "choices": [
      "$21$명",
      "$22$명",
      "$23$명",
      "$24$명",
      "$25$명"
    ],
    "answer": "⑤",
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "solution": "줄기와 잎 그림에서 잎 하나는 수강생 한 명을 나타낸다. 각 줄기의 잎 개수를 더하면 $3+5+7+6+4=25$이므로 전체 수강생은 $25$명이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
    "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 3,
    "sourceQid": "11",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_INTERPRETATION",
    "primaryMethod": "줄기와 잎 그림에서 각 줄기의 잎의 개수를 합산하여 전체 자료의 수를 구한다.",
    "decisiveStep": "각 줄기의 잎의 개수 3+5+7+6+4=25를 더한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "자료 해석",
      "l4": "자료에서 정보 추론"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
      "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
      "why": "줄기와 잎 그림에서 잎의 총 개수로 전체 도수 계산"
    },
    "difficultyReason": "잎의 개수의 총합을 구하는 단순 집계 문항이므로 1단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "solution",
            "quote": "자료의 개수"
          },
          {
            "term": "개수",
            "src": "stem",
            "quote": "잎의 개수가 순서대로"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "전체 수강생의 수는?"
          }
        ],
        "method": [
          {
            "term": "개수",
            "src": "solution",
            "quote": "$3+5+7+6+4=25",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 12,
    "level": "하",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표",
      "공통자료"
    ],
    "wide": false,
    "content": "위의 줄기와 잎 그림에서 수강생이 가장 많은 연령대는? <div class=\"question-table-wrap\"><table><thead><tr><th>줄기</th><th>잎</th></tr></thead><tbody><tr><td>2</td><td>1 3 7</td></tr><tr><td>3</td><td>0 2 4 6 8</td></tr><tr><td>4</td><td>1 2 3 5 6 7 9</td></tr><tr><td>5</td><td>1 2 4 5 7 8</td></tr><tr><td>6</td><td>2 3 5 8</td></tr></tbody></table></div> [3점]",
    "choices": [
      "20대",
      "40대",
      "30대",
      "50대",
      "60대"
    ],
    "answer": "②",
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "solution": "각 연령대의 수강생 수는 해당 줄기의 잎의 개수와 같다. 20대는 3명, 30대는 5명, 40대는 7명, 50대는 6명, 60대는 4명이다. 잎의 개수가 7개로 가장 많은 연령대는 40대이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
    "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 3,
    "sourceQid": "12",
    "variationType": "CONTEXT",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_INTERPRETATION",
    "primaryMethod": "각 연령대 줄기의 잎 개수(3, 5, 7, 6, 4)를 비교하여 최빈 연령대인 40대를 선택한다.",
    "decisiveStep": "잎이 7개로 가장 많은 줄기 4(40대)를 판정한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "자료 해석",
      "l4": "자료에서 정보 추론"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
      "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
      "why": "줄기와 잎 그림에서 잎의 개수가 최대인 줄기 식별"
    },
    "difficultyReason": "줄기별 잎의 개수를 단순 비교하여 최댓값을 찾는 1단계 문항이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "solution",
            "quote": "수강생 수는 해당 줄기의 잎의 개수"
          }
        ],
        "goal": [
          {
            "term": "판정",
            "src": "stem",
            "quote": "가장 많은 연령대는?"
          }
        ],
        "method": [
          {
            "term": "최댓값",
            "src": "solution",
            "quote": "가장 많은 연령대는 40대이다.",
            "evidenceType": "IMPLIED",
            "justification": "각 줄기의 잎 수 중 최댓값 7을 갖는 줄기 선택"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 13,
    "level": "하",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "도수분포표에 대한 설명으로 옳은 것은? [4점]",
    "choices": [
      "계급의 개수가 많을수록 전체적인 분포 상태 파악이 항상 유용하다.",
      "계급의 크기는 계급의 양 끝값의 합이다.",
      "각 계급에 속하는 자료의 값을 계급값이라 한다.",
      "변량을 일정한 간격으로 나눈 구간의 너비를 계급의 크기라 한다.",
      "모든 계급의 도수의 합은 변량의 평균과 같다."
    ],
    "answer": "④",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "① 계급의 개수가 너무 많으면 자료의 특징이 한눈에 들어오지 않으므로 옳지 않다. ② 계급의 크기는 계급의 양 끝값의 차(구간의 너비)이다. ③ 계급값은 계급의 양 끝값의 중앙값(평균)이다. ④ 변량을 일정한 간격으로 나눈 구간의 너비를 계급의 크기라 한다. (참) ⑤ 모든 계급의 도수의 합은 전체 자료의 개수(총 도수)와 같다. 따라서 옳은 것은 ④이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "13",
    "variationType": "CONTEXT",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "계급의 크기, 계급값, 도수의 합 등 도수분포표의 기본 용어 정의를 진술별로 점검한다.",
    "decisiveStep": "계급의 크기가 구간의 너비(양 끝값의 차)라는 정의를 정확히 판별한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "도수분포표"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
      "why": "도수분포표의 기본 정의(계급, 계급의 크기, 도수의 합) 진술 판정"
    },
    "difficultyReason": "도수분포표의 핵심 용어 정의를 단순 점검하는 1단계 문항이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "도수분포다각형",
            "src": "stem",
            "quote": "도수분포표에 대한 설명으로"
          }
        ],
        "goal": [
          {
            "term": "판정",
            "src": "stem",
            "quote": "옳은 것은?"
          }
        ],
        "method": [
          {
            "term": "계급",
            "src": "solution",
            "quote": "나눈 구간의 너비를 계급의 크기라 한다.",
            "evidenceType": "NAMED"
          },
          {
            "term": "계급값",
            "src": "solution",
            "quote": "계급값은 계급의 양 끝값의 중앙값",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 14,
    "level": "하",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "어느 학교 학생 $50$명의 일주일 독서 시간을 조사한 도수분포표에서 알려진 도수들의 합이 $32$명이고, 비어 있는 두 계급의 도수가 각각 $A, B$일 때, $A+B$의 값을 구하면? [4점]",
    "choices": [
      "$14$",
      "$16$",
      "$18$",
      "$20$",
      "$22$"
    ],
    "answer": "③",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "도수분포표의 모든 계급의 도수의 합은 전체 학생 수이다. 따라서 $A+B=50-32=18$이고, 정답은 ③이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "14",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "전체 도수 50에서 이미 알려진 도수의 합 32를 빼서 A+B=18을 구한다.",
    "decisiveStep": "전체 도수와 부분 도수의 합의 차를 취해 미지수 도수의 합을 계산한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "도수분포표"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
      "why": "도수분포표에서 총 도수를 이용해 빈 계급들의 도수 합 계산"
    },
    "difficultyReason": "전체 도수에서 주어진 도수의 합을 1회 감산하는 기본 문항이므로 1단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "학생 $50$명의"
          },
          {
            "term": "개수",
            "src": "stem",
            "quote": "알려진 도수들의 합이 $32$명"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "$A+B$의 값을 구하면?"
          }
        ],
        "method": [
          {
            "term": "개수",
            "src": "solution",
            "quote": "도수의 합은 전체 학생 수와 같다.",
            "evidenceType": "NAMED"
          },
          {
            "term": "일차방정식",
            "src": "solution",
            "quote": "$A+B=50-32=18",
            "evidenceType": "IMPLIED",
            "justification": "전체 합에서 부분 합을 차감"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 15,
    "level": "상",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "다음은 어느 마을 가구의 월 전기 사용량 히스토그램에서 일부가 가려진 자료이다. 계급은 $150$kWh 이상부터 $400$kWh 미만까지 $50$kWh 간격이고, 보이는 세 계급의 도수는 각각 $150$–$200$kWh에서 $8$, $250$–$300$kWh에서 $12$, $350$–$400$kWh에서 $8$가구이다. $200$–$250$kWh 구간의 가구 수는 $300$–$350$kWh 구간의 $3$배이고 전체는 $60$가구일 때, $300$–$350$kWh 구간의 가구 수는? <div class=\"question-table-wrap\"><table><thead><tr><th>월 전기 사용량 (kWh)</th><th>가구 수</th></tr></thead><tbody><tr><td>$150$–$200$</td><td>8</td></tr><tr><td>$200$–$250$</td><td>?</td></tr><tr><td>$250$–$300$</td><td>12</td></tr><tr><td>$300$–$350$</td><td>?</td></tr><tr><td>$350$–$400$</td><td>8</td></tr></tbody></table></div> [4점]",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$24$"
    ],
    "answer": "②",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "두 미지 도수 중 $300$–$350$kWh 구간의 도수를 $x$라 하면, $200$–$250$kWh 구간의 도수는 $3x$이다. 보이는 세 계급의 도수 합은 $8+12+8=28$이다. $$28+3x+x=60,\\quad 4x=32,\\quad x=8$$ 따라서 $300$–$350$kWh 구간의 가구 수는 $8$가구이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "15",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "미지의 두 계급 도수를 3x, x로 두고 28+4x=60 방정식을 세워 x=8을 구한다.",
    "decisiveStep": "찢어진 두 계급의 3배 조건을 3x와 x로 설정하고 일차방정식을 풀어 x=8을 얻는다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "히스토그램·도수분포다각형"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
      "why": "히스토그램의 찢어진 부분에 배수 조건이 주어졌을 때 일차방정식으로 도수 복원"
    },
    "difficultyReason": "배수 관계를 미지수 3x, x로 설정하고 총 도수 방정식으로 도수를 복원하므로 3단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "전체 가구 수가 $60$가구일 때"
          },
          {
            "term": "개수",
            "src": "stem",
            "quote": "가구 수의 $3$배이고"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "미만인 가구 수를 구하면?"
          }
        ],
        "method": [
          {
            "term": "일차방정식",
            "src": "solution",
            "quote": "$28+3x+x=60",
            "evidenceType": "NAMED"
          },
          {
            "term": "모델링",
            "src": "solution",
            "quote": "도수를 $x$라 하면",
            "evidenceType": "IMPLIED",
            "justification": "배수 조건을 x, 3x로 모델링"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 16,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "어느 반 학생들의 턱걸이 횟수를 조사하였다. 계급을 횟수가 작은 순서로 $0$회 이상 $2$회 미만, $2$회 이상 $4$회 미만, $4$회 이상 $6$회 미만, $6$회 이상 $8$회 미만, $8$회 이상 $10$회 미만으로 나누었을 때, 도수분포다각형의 각 계급 도수가 차례로 $2,8,14,10,4$명이다. 다음 설명 중 옳지 않은 것은? [4점]",
    "choices": [
      "반 전체 학생 수는 38명이다.",
      "계급의 개수는 5개이다.",
      "도수가 가장 큰 계급의 도수는 14명이다.",
      "턱걸이를 가장 많이 한 학생의 횟수는 정확히 15회이다.",
      "턱걸이 횟수가 많은 쪽에서 10번째인 학생은 네 번째 계급에 속한다."
    ],
    "answer": "④",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "① 전체 학생 수는 $2+8+14+10+4=38$명이다. (참) ② 계급은 $5$개이다. (참) ③ 도수가 가장 큰 계급의 도수는 $14$명이다. (참) ④ 가장 높은 계급은 $8$회 이상 $10$회 미만이므로 턱걸이를 가장 많이 한 학생의 횟수는 정확히 $15$회일 수 없다. (거짓) ⑤ 높은 횟수부터 세면 가장 높은 계급의 $4$명 다음으로 네 번째 계급의 $10$명이므로 10번째 학생은 네 번째 계급에 속한다. (참) 따라서 옳지 않은 것은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "16",
    "variationType": "CONTEXT",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "도수분포다각형의 총합, 계급 수, 최빈 계급, 순위 소속 계급 및 개별 변량 확인 불가능성을 점검한다.",
    "decisiveStep": "도수분포표·다각형에서는 계급의 구간만 알 수 있고 특정 학생의 정확한 변량값은 알 수 없음을 짚어낸다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "히스토그램·도수분포다각형"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
      "why": "도수분포다각형에서 개별 변량 값 판정 불가 및 계급 통계 점검"
    },
    "difficultyReason": "도수분포다각형의 기본 속성과 개별 변량 미확인 원리를 복합 검토하므로 2단계이다.",
    "item4slot": {
      "format": "옳지 않은 것 고르기",
      "slots": {
        "given": [
          {
            "term": "도수분포다각형",
            "src": "stem",
            "quote": "도수분포다각형에서 계급이 5개이고"
          }
        ],
        "goal": [
          {
            "term": "판정",
            "src": "stem",
            "quote": "옳지 않은 것은?"
          }
        ],
        "method": [
          {
            "term": "개수",
            "src": "solution",
            "quote": "전체 학생 수는 $2+8+14+10+4=38",
            "evidenceType": "NAMED"
          },
          {
            "term": "판정",
            "src": "solution",
            "quote": "알 수 없으므로 옳지 않다.",
            "evidenceType": "IMPLIED",
            "justification": "도수분포표에서 원자료 개별값 식별 불가 판정"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 17,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "어느 동아리 학생 $40$명의 윗몸일으키기 기록을 조사한 도수분포다각형에서 계급이 $10$회 이상 $20$회 미만부터 $50$회 이상 $60$회 미만까지 5개 계급으로 이루어져 있다. 기록이 높은 쪽부터 계급별 도수가 차례로 $4$명, $6$명, $14$명, $10$명, $6$명일 때, 상위 $25%$ 이내에 속하기 위한 최소 기록은? [4점]",
    "choices": [
      "40회",
      "30회",
      "50회",
      "20회",
      "10회"
    ],
    "answer": "①",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "전체 학생 수가 $40$명이므로 상위 $25%$는 $40\\times 0.25=10$명이다. 가장 높은 계급인 $50$회 이상 $60$회 미만이 $4$명이고, 그 다음 계급인 $40$회 이상 $50$회 미만이 $6$명이므로 $4+6=10$명이 되어 상위 10명이 채워진다. 따라서 상위 $25%$ 이내에 들기 위한 최소 기록은 $40$회이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "17",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "전체 40명의 25%인 10명을 높은 쪽부터 도수 4+6=10으로 누적하여 경계값 40회를 구한다.",
    "decisiveStep": "상위 25% 커트라인 인원 10명을 높은 쪽 계급의 도수 누적으로 찾아 계급의 하한값 40회와 연결한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "히스토그램·도수분포다각형"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF",
      "why": "도수분포에서 상위 백분율 기준선에 해당하는 최소 변량값 도출"
    },
    "difficultyReason": "백분율로 상위 인원을 계산하고 높은 쪽부터 누적 도수를 세어 경계값을 구하므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "학생 $40$명의 윗몸일으키기 기록"
          },
          {
            "term": "도수분포다각형",
            "src": "stem",
            "quote": "조사한 도수분포다각형에서"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "최소 기록은?"
          }
        ],
        "method": [
          {
            "term": "개수",
            "src": "solution",
            "quote": "상위 $25\\%$는 $40\\times 0.25=10$명",
            "evidenceType": "NAMED"
          },
          {
            "term": "누적도수",
            "src": "solution",
            "quote": "$4+6=10$명이 되어 상위 10명이 채워진다.",
            "evidenceType": "IMPLIED",
            "justification": "높은 쪽부터 도수를 누적하여 경계값 40회 특정"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 18,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "어느 중학교 학생 $250$명을 대상으로 하루 동안의 스마트폰 사용 시간을 조사하여 상대도수분포를 나타낸 그래프에서, $2$시간 이상 $3$시간 미만인 계급의 상대도수가 $0.28$, $3$시간 이상 $4$시간 미만인 계급의 상대도수가 $0.16$, $4$시간 이상인 계급의 상대도수가 $0.08$일 때, 하루에 $2$시간 이상 스마트폰을 사용하는 학생은 모두 몇 명인가? [4점]",
    "choices": [
      "$110$명",
      "$115$명",
      "$120$명",
      "$125$명",
      "$130$명"
    ],
    "answer": "⑤",
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "solution": "$2$시간 이상인 계급의 상대도수의 합은 $0.28+0.16+0.08=0.52$이다. 전체 학생 수가 $250$명이므로 구하는 학생 수는 $250\\times0.52=130$명이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 4,
    "sourceQid": "18",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_INTERPRETATION",
    "primaryMethod": "2시간 이상인 세 계급의 상대도수 합 0.52에 전체 인원 250명을 곱하여 130명을 계산한다.",
    "decisiveStep": "상대도수의 합 0.28+0.16+0.08=0.52를 전체 도수 250에 곱해 실제 인원을 환산한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "상대도수",
      "l4": "상대도수 계산"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
      "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
      "why": "상대도수 합과 전체 도수로 특정 구간의 실제 도수 계산"
    },
    "difficultyReason": "해당 구간의 상대도수를 합산하고 총 도수를 곱해 인원을 산출하므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "학생 $250$명을 대상으로"
          },
          {
            "term": "상대도수",
            "src": "stem",
            "quote": "상대도수가 $0.28$"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "학생은 모두 몇 명인가?"
          }
        ],
        "method": [
          {
            "term": "상대도수",
            "src": "solution",
            "quote": "$0.28+0.16+0.08=0.52",
            "evidenceType": "NAMED"
          },
          {
            "term": "개수",
            "src": "solution",
            "quote": "$250\\times 0.52=130$명",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 19,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "어느 문화센터의 요가 회원 $60$명과 필라테스 회원 $40$명의 연령별 상대도수분포다각형을 비교하였다. 두 집단은 같은 $10$년 간격의 연령 계급을 사용한다. 다음 설명 중 옳지 않은 것은? [5점]",
    "choices": [
      "상대도수의 총합은 요가와 필라테스 모두 1이다.",
      "각 계급의 크기는 두 집단이 서로 같다.",
      "30대의 상대도수가 같더라도 실제 30대 회원 수는 두 집단이 서로 같다.",
      "전체 회원 수는 요가가 필라테스보다 많다.",
      "상대도수분포다각형과 가로축으로 둘러싸인 부분의 넓이는 두 집단이 서로 같다."
    ],
    "answer": "③",
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "solution": "① 모든 집단에서 상대도수의 총합은 항상 1로 같다. (참) ② 계급의 크기는 자료를 나눈 구간의 너비이므로 두 집단에서 같다. (참) ③ 요가 회원은 60명, 필라테스 회원은 40명이므로 전체 회원 수가 다르다. 따라서 상대도수가 같더라도 실제 회원 수는 $60\\times r \\neq 40\\times r$이므로 서로 다르다. (거짓) ④ 요가 회원은 60명, 필라테스는 40명이므로 요가가 더 많다. (참) ⑤ 상대도수분포다각형과 가로축으로 둘러싸인 넓이는 (계급의 크기)×(상대도수의 총합)=(계급의 크기)×1이므로 두 집단이 서로 같다. (참) 따라서 옳지 않은 것은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_GROUP_COUNT_COMPARISON",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "19",
    "variationType": "CONTEXT",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_INTERPRETATION",
    "primaryMethod": "전체 인원이 다른 두 집단(60명, 40명)에서 상대도수 동일 시 실제 인원의 차이 및 둘러싸인 넓이 성질을 검토한다.",
    "decisiveStep": "전체 도수가 다르면 상대도수가 같아도 실제 도수가 다름을 명확히 판별한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "자료 해석",
      "l4": "그래프 비교"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
      "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_GROUP_COUNT_COMPARISON",
      "why": "도수의 총합이 다른 두 집단의 상대도수 비교 및 실제 도수 판정"
    },
    "difficultyReason": "전체 도수가 다른 두 집단의 상대도수 개념과 그래프 넓이의 불변성을 비교 점검하므로 2단계이다.",
    "item4slot": {
      "format": "옳지 않은 것 고르기",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "요가 회원 $60$명과 필라테스 회원 $40$명"
          },
          {
            "term": "상대도수",
            "src": "stem",
            "quote": "상대도수분포다각형을 비교한"
          }
        ],
        "goal": [
          {
            "term": "판정",
            "src": "stem",
            "quote": "설명으로 옳지 않은 것은?"
          }
        ],
        "method": [
          {
            "term": "상대도수",
            "src": "solution",
            "quote": "상대도수의 총합은 항상 1",
            "evidenceType": "NAMED"
          },
          {
            "term": "개수",
            "src": "solution",
            "quote": "실제 회원 수는 $60\\times r \\neq 40\\times r$",
            "evidenceType": "IMPLIED",
            "justification": "전체 도수가 다른 집단에서 상대도수가 같을 때 도수 차이 판정"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 20,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "어느 중학교 학생 $150$명의 멀리뛰기 기록에 대한 상대도수분포에서 일부가 찢어져 보이지 않는다. 보이는 계급들의 상대도수의 합이 $0.68$일 때, 찢어진 계급에 속하는 학생 수는 모두 몇 명인가? [5점]",
    "choices": [
      "$40$명",
      "$44$명",
      "$46$명",
      "$48$명",
      "$52$명"
    ],
    "answer": "④",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "상대도수의 총합은 항상 1이다. 찢어진 계급의 상대도수는 $1-0.68=0.32$ 전체 학생 수가 $150$명이므로 찢어진 계급의 학생 수는 $150\\times 0.32=48$명이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "20",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "상대도수 총합 1에서 0.68을 빼서 찢어진 계급의 상대도수 0.32를 구한 뒤 150명을 곱한다.",
    "decisiveStep": "1-0.68=0.32의 상대도수를 전체 인원 150명에 곱해 48명을 도출한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "상대도수",
      "l4": "상대도수 계산"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
      "why": "상대도수 총합 1을 이용해 찢어진 계급의 도수 복원"
    },
    "difficultyReason": "상대도수 총합 1에서 미지 상대도수를 구하고 전체 도수를 곱하는 2단계 계산이므로 2단계이다.",
    "item4slot": {
      "format": "단일 정답",
      "slots": {
        "given": [
          {
            "term": "자료",
            "src": "stem",
            "quote": "학생 $150$명의"
          },
          {
            "term": "상대도수",
            "src": "stem",
            "quote": "상대도수의 합이 $0.68$일 때"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "학생 수는 모두 몇 명인가?"
          }
        ],
        "method": [
          {
            "term": "상대도수",
            "src": "solution",
            "quote": "상대도수의 총합은 항상 1",
            "evidenceType": "NAMED"
          },
          {
            "term": "개수",
            "src": "solution",
            "quote": "$150\\times 0.32=48$명",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 21,
    "level": "상",
    "category": "평면도형",
    "originalCategory": "평면도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-06",
    "standardUnit": "평면도형의 성질",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형"
    ],
    "wide": false,
    "content": "한 변의 길이가 $16\\,\\mathrm{cm}$인 정사각형 안에, 한 꼭짓점을 중심으로 반지름 $16\\,\\mathrm{cm}$인 사분원과 정사각형의 서로 이웃한 두 변을 각각 지름으로 하는 반지름 $8\\,\\mathrm{cm}$인 반원 두 개가 있다. 색칠한 부분은 두 반원의 공통 부분과 사분원 안에서 두 반원의 합집합 바깥 부분이다. 색칠한 두 부분의 둘레의 합을 $x$, 넓이의 합을 $y$라 할 때, $x+y$를 구하고 풀이 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$88\\pi-128$",
    "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
    "subUnit": "평면도형의 측정",
    "solution": "사분원 반지름은 $16\\,\\mathrm{cm}$이고 반원 반지름은 $8\\,\\mathrm{cm}$이다. 두 색칠 영역의 바깥 둘레에는 사분원의 호 1개와 반원의 사분원 호 4개가 포함된다. 사분원의 호 길이는 $2\\pi\\times16\\times\\dfrac14=8\\pi$, 각 반원의 사분원 호는 $2\\pi\\times8\\times\\dfrac14=4\\pi$이므로 $$x=8\\pi+4\\times4\\pi=24\\pi\\,\\mathrm{cm}.$$ 아래쪽 렌즈 부분은 반지름 $8$인 $90^\\circ$ 부채꼴 두 개에서 직각이등변삼각형 두 개를 뺀 넓이이므로 $2(16\\pi-32)=32\\pi-64$이다. 위쪽 영역은 큰 사분원에서 두 반원의 합집합을 뺀 부분이며 넓이는 아래쪽 렌즈와 같으므로 전체 색칠 넓이는 $$y=2(32\\pi-64)=64\\pi-128\\,\\mathrm{cm}^2.$$ 따라서 수치식으로 $x+y=88\\pi-128$이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "21",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-06-PLANE_FIGURE_MEASURE",
    "primaryMethod": "사분원과 두 반원 호의 둘레 x=24π를 구하고, 활꼴 결합 렌즈 넓이 대칭성으로 y=64π-128을 구해 x+y를 계산한다.",
    "decisiveStep": "사분원에서 두 반원의 합집합을 뺀 위쪽 영역의 넓이가 아래쪽 렌즈 넓이와 같음을 파악한다.",
    "rpm": {
      "majorUnit": "평면도형",
      "midUnit": "원과 부채꼴",
      "l3": "복합도형",
      "l4": "부채꼴을 포함한 넓이"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
      "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
      "why": "사분원과 두 반원의 중첩으로 생기는 복합 영역의 둘레와 넓이 동시 계산"
    },
    "difficultyReason": "사분원과 반원의 호 길이 합산(둘레)과 부채꼴-삼각형 감산 및 영역 등적 변형(넓이)을 모두 수행하므로 4단계이다.",
    "item4slot": {
      "format": "서술",
      "slots": {
        "given": [
          {
            "term": "정사각형",
            "src": "stem",
            "quote": "정사각형 내부에서"
          },
          {
            "term": "사분원",
            "src": "stem",
            "quote": "사분원의 호와"
          }
        ],
        "goal": [
          {
            "term": "값",
            "src": "stem",
            "quote": "$x+y$의 값을 구하고"
          }
        ],
        "method": [
          {
            "term": "호",
            "src": "solution",
            "quote": "큰 사분원의 반지름은 $16\\,\\mathrm{cm}$",
            "evidenceType": "NAMED"
          },
          {
            "term": "넓이",
            "src": "solution",
            "quote": "아래쪽 렌즈 모양의 넓이는",
            "evidenceType": "NAMED"
          },
          {
            "term": "부채꼴",
            "src": "solution",
            "quote": "부채꼴 2개에서 직각이등변삼각형을 뺀 넓이이므로",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 22,
    "level": "중",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "중1",
    "standardUnitKey": "M1-07",
    "standardUnit": "입체도형의 성질",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형"
    ],
    "wide": false,
    "content": "두 밑면이 서로 평행한 정사각형인 정사각뿔대가 있다. 밑면과 윗면의 한 변의 길이는 각각 $8\\,\\mathrm{cm}$, $4\\,\\mathrm{cm}$이고, 네 옆면은 밑변이 각각 $8\\,\\mathrm{cm}$와 $4\\,\\mathrm{cm}$이며 높이가 $5\\,\\mathrm{cm}$인 사다리꼴이다. 이 정사각뿔대의 겉넓이를 구하고 풀이 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "$200\\,\\mathrm{cm}^2$",
    "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
    "subUnit": "입체도형의 측정",
    "solution": "정사각뿔대의 겉넓이는 두 밑면과 네 옆면의 넓이의 합이다. 두 밑면의 넓이의 합은 $8^2+4^2=80\\,\\mathrm{cm}^2$이다. 사다리꼴 옆면 하나의 넓이는 $\\dfrac{(8+4)\\times5}{2}=30\\,\\mathrm{cm}^2$이고, 네 옆면의 넓이는 $30\\times4=120\\,\\mathrm{cm}^2$이다. 따라서 겉넓이는 $80+120=200\\,\\mathrm{cm}^2$이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_NET_MEASURE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "22",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-07-SOLID_FIGURE_MEASURE",
    "primaryMethod": "두 정사각형 밑넓이 합 80cm²와 4개의 사다리꼴 옆넓이 합 120cm²를 더하여 겉넓이 200cm²를 계산한다.",
    "decisiveStep": "사다리꼴 4개의 넓이 120에 두 밑면 64와 16을 모두 더한다.",
    "rpm": {
      "majorUnit": "입체도형",
      "midUnit": "입체도형의 겉넓이와 부피",
      "l3": "뿔의 겉넓이와 부피",
      "l4": "각뿔"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
      "templateKey": "TPL_M1_SOLID_FIGURE_NET_MEASURE",
      "why": "사각뿔대 전개도 기반 밑넓이 2개와 옆넓이 4개 합산"
    },
    "difficultyReason": "두 정사각형 밑면과 사다리꼴 4개의 넓이를 각각 계산하여 합산하므로 2단계이다.",
    "item4slot": {
      "format": "서술",
      "slots": {
        "given": [
          {
            "term": "각뿔대",
            "src": "stem",
            "quote": "사각뿔대의 겉넓이를"
          },
          {
            "term": "정사각형",
            "src": "stem",
            "quote": "정사각형이고"
          }
        ],
        "goal": [
          {
            "term": "겉넓이",
            "src": "stem",
            "quote": "겉넓이를 구하고"
          }
        ],
        "method": [
          {
            "term": "밑넓이",
            "src": "solution",
            "quote": "두 밑면의 넓이의 합은 $8^2+4^2=64+16=80",
            "evidenceType": "NAMED"
          },
          {
            "term": "사다리꼴",
            "src": "solution",
            "quote": "옆면인 사다리꼴 한 개의 넓이는",
            "evidenceType": "NAMED"
          },
          {
            "term": "옆넓이",
            "src": "solution",
            "quote": "옆넓이는 $30\\times 4=120",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 23,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "표"
    ],
    "wide": false,
    "content": "어느 학급 학생 $20$명의 일주일 운동 시간을 조사하여 도수분포표를 만들었더니 $2$시간 이상 $6$시간 미만인 계급의 크기만 $4$시간으로 다른 계급(크기 $2$시간)과 달랐다. 도수분포표의 올바른 구성을 위한 문제점을 지적하고, 이 계급을 크기가 $2$시간인 두 계급으로 나누어 원자료($2, 3, 3, 4, 5, 5$)를 바르게 배치한 두 계급의 도수를 각각 구하시오. [5점]",
    "choices": [],
    "answer": "계급의 크기가 일정하지 않음; 2시간 이상 4시간 미만: 3명, 4시간 이상 6시간 미만: 3명",
    "subUnitKey": "M1-08-DATA_ORGANIZATION",
    "subUnit": "자료의 정리",
    "solution": "도수분포표에서 모든 계급의 크기는 일정해야 한다. 문제점: $2$시간 이상 $6$시간 미만 계급의 크기만 $4$시간으로 일정하지 않다. 원자료 $2, 3, 3, 4, 5, 5$를 크기 $2$시간인 두 계급으로 나누면 $2$시간 이상 $4$시간 미만: $2, 3, 3$의 $3$명 $4$시간 이상 $6$시간 미만: $4, 5, 5$의 $3$명이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "23",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_ORGANIZATION",
    "primaryMethod": "계급의 크기가 일정해야 함을 지적하고 2~4시간(3명), 4~6시간(3명)으로 원자료를 분류한다.",
    "decisiveStep": "도수분포표의 규칙(계급의 크기 일정)을 서술하고 원자료 6개를 경계값 4 기준으로 정확히 양분한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "도수분포",
      "l4": "도수분포표"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
      "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
      "why": "도수분포표 계급의 크기 불일치 오류 교정 및 도수 재분류"
    },
    "difficultyReason": "도수분포표의 작성 원칙 서술과 원자료의 재분류를 수행하므로 2단계이다.",
    "item4slot": {
      "format": "서술",
      "slots": {
        "given": [
          {
            "term": "도수분포다각형",
            "src": "stem",
            "quote": "도수분포표를 만들었더니"
          },
          {
            "term": "계급",
            "src": "stem",
            "quote": "계급의 크기만 $4$시간으로"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "두 계급의 도수를 각각 구하시오."
          }
        ],
        "method": [
          {
            "term": "계급",
            "src": "solution",
            "quote": "모든 계급의 크기는 일정해야 한다.",
            "evidenceType": "NAMED"
          },
          {
            "term": "개수",
            "src": "solution",
            "quote": "$2$시간 이상 $4$시간 미만: $2, 3, 3$의 $3$명",
            "evidenceType": "NAMED"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  },
  {
    "id": 24,
    "level": "중",
    "category": "통계",
    "originalCategory": "통계",
    "standardCourse": "중1",
    "standardUnitKey": "M1-08",
    "standardUnit": "자료의 정리와 해석",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "표"
    ],
    "wide": false,
    "content": "어느 학교 학생들의 하루 독서 시간에 대한 상대도수의 분포표에서 일부가 찢어져 보이지 않는다. $0$분 이상 $30$분 미만인 학생 $6$명의 상대도수가 $0.06$이고, 독서 시간이 $60$분 이상인 학생이 전체의 $60%$일 때, 독서 시간이 $30$분 이상 $60$분 미만인 학생 수를 구하고 풀이 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "34명",
    "subUnitKey": "M1-08-DATA_INTERPRETATION",
    "subUnit": "자료의 해석",
    "solution": "$0$분 이상 $30$분 미만인 학생 $6$명의 상대도수가 $0.06$이므로 전체 학생 수는 $6\\div 0.06=100$명이다. 독서 시간이 $60$분 이상인 학생이 전체의 $60%$이므로 $60$분 미만인 학생은 전체의 $40%$이다. $100\\times 0.40=40$명 이 $40$명 중에서 $0$분 이상 $30$분 미만인 $6$명을 제외하면 $40-6=34$명이다. 따라서 $30$분 이상 $60$분 미만인 학생 수는 $34$명이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "points": 5,
    "sourceQid": "24",
    "variationType": "NUMERIC",
    "courseKey": "M1",
    "curriculum": "2015",
    "conceptClusterKey": "M1-08-DATA_INTERPRETATION",
    "primaryMethod": "도수 6명과 상대도수 0.06으로 전체 100명을 구하고, 60분 미만 40명에서 6명을 빼서 34명을 구한다.",
    "decisiveStep": "도수÷상대도수로 총인원 100명을 복원한 뒤 60분 미만 40%에서 첫 계급 6명을 차감한다.",
    "rpm": {
      "majorUnit": "통계",
      "midUnit": "자료의 정리와 해석",
      "l3": "상대도수",
      "l4": "상대도수 계산"
    },
    "ptTplCandidate": {
      "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
      "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
      "why": "특정 계급의 도수와 상대도수로 전체 인원을 복원한 뒤 비율 차감"
    },
    "difficultyReason": "총 도수 역산, 백분율 환산, 부분 도수 감산의 3단계 복합 연산이므로 3단계이다.",
    "item4slot": {
      "format": "서술",
      "slots": {
        "given": [
          {
            "term": "상대도수",
            "src": "stem",
            "quote": "상대도수가 $0.06$이고"
          },
          {
            "term": "자료",
            "src": "stem",
            "quote": "학생 $6$명의"
          }
        ],
        "goal": [
          {
            "term": "개수",
            "src": "stem",
            "quote": "미만인 학생 수를 구하고"
          }
        ],
        "method": [
          {
            "term": "개수",
            "src": "solution",
            "quote": "$6\\div 0.06=100$명이다.",
            "evidenceType": "NAMED"
          },
          {
            "term": "상대도수",
            "src": "solution",
            "quote": "$100\\times 0.40=40$명",
            "evidenceType": "NAMED"
          },
          {
            "term": "일차방정식",
            "src": "solution",
            "quote": "$40-6=34$명이다.",
            "evidenceType": "IMPLIED",
            "justification": "부분 도수 차감 계산"
          }
        ],
        "condition": []
      },
      "reasons": {},
      "steps": [],
      "scenarioNote": ""
    },
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW"
  }
];
