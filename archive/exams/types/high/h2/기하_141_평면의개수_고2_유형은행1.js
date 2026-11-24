window.examTitle = "기하_141_평면의개수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "공간에서 한 평면 $\\alpha$ 위에 한 직선 위에 있지 않은 세 점 $A, B, C$가 있고, 평면 $\\alpha$ 밖에 한 점 $D$가 있다. 선분 $AD$ 위의 한 점 $P$($P \\neq A, P \\neq D$)에 대하여 다섯 개의 점 $A, B, C, D, P$ 중 세 점으로 결정되는 서로 다른 평면의 개수는? [그림: 평면 $\\alpha$ 위에 삼각형 $ABC$가 놓여 있고, 평면 $\\alpha$ 위쪽 공간에 점 $D$가 있다. 선분 $AD$ 위에 점 $P$가 위치해 있다.]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "①",
    "solution": "다섯 개의 점 $A, B, C, D, P$의 위치 관계를 파악합니다.\n- 세 점 $A, P, D$는 선분 $AD$ 위에 있으므로 한 직선 위에 있습니다.\n- 세 점 $A, B, C$는 평면 $\\alpha$ 위에 있습니다.\n- 점 $D$와 점 $P$는 평면 $\\alpha$ 밖에 있습니다.\n\n다섯 점 중 세 점을 택하여 평면을 만드는 경우를 나누어 세어 봅니다.\n1. 평면 $\\alpha$ 위의 세 점 $A, B, C$를 택하는 경우:\n평면 $\\alpha$ 단 1개만 결정됩니다.\n\n2. 한 직선 위의 세 점 $A, P, D$를 택하는 경우:\n세 점이 일직선 위에 있으므로 평면을 결정하지 않습니다.\n\n3. 직선 $AD$ 위의 두 점과 직선 밖의 점을 택하는 경우:\n직선 $AD$ 위의 점($A, P, D$) 중 두 점을 택하면 모두 직선 $AD$를 결정합니다.\n- 직선 $AD$와 점 $B$를 택하면 평면 $ABD$ (1개)\n- 직선 $AD$와 점 $C$를 택하면 평면 $ACD$ (1개)\n\n4. 직선 $AD$ 위의 한 점과 밑면의 두 점 $B, C$를 택하는 경우:\n- 점 $A$와 점 $B, C$: 세 점 $A, B, C$는 평면 $\\alpha$로 이미 1에서 센 평면과 일치합니다.\n- 점 $P$와 점 $B, C$: 평면 $PBC$ (1개)\n- 점 $D$와 점 $B, C$: 평면 $DBC$ (1개)\n점 $P$는 선분 $AD$의 내분이므로 점 $D$와 높이가 달라 평면 $PBC$와 평면 $DBC$는 서로 다른 평면입니다.\n\n따라서 서로 다른 평면의 개수는\n$1(\\text{평면 } \\alpha) + 1(\\text{평면 } ABD) + 1(\\text{평면 } ACD) + 1(\\text{평면 } PBC) + 1(\\text{평면 } DBC) = 5$개이다.\n\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-053",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PLANES",
    "crossConceptKeys": [
      "CC_SPATIAL_POSITION_RELATION"
    ],
    "conditionKeys": [
      "COND_PAIRWISE_DISTINCT_POINTS"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 2,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "공간에서 한 평면 위에 있는 서로 다른 다섯 개의 점과 이 평면 밖에 있는 한 점으로 만들 수 있는 서로 다른 평면의 개수는? (단, 평면 위에 있는 다섯 개의 점 중 어느 세 점도 한 직선 위에 있지 않다.)",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "⑤",
    "solution": "평면을 $\\alpha$, 평면 $\\alpha$ 위에 있는 다섯 개의 점을 $A, B, C, D, E$, 평면 $\\alpha$ 밖에 있는 한 점을 $P$라 합시다.\n\n1. 평면 $\\alpha$ 위의 점들만으로 결정되는 평면:\n다섯 점 $A, B, C, D, E$는 모두 평면 $\\alpha$ 위에 있으므로, 이 중 세 점을 어떻게 택하더라도 오직 평면 $\\alpha$ 하나만 결정됩니다. (1개)\n\n2. 평면 밖의 점 $P$와 평면 $\\alpha$ 위의 점들로 결정되는 평면:\n평면 밖의 점 $P$와 평면 $\\alpha$ 위의 서로 다른 두 점을 택하면 평면이 결정됩니다.\n평면 $\\alpha$ 위의 다섯 점 중 어느 세 점도 한 직선 위에 있지 않으므로, 임의의 두 점을 택하여 만든 직선은 모두 서로 다릅니다.\n따라서 평면 $\\alpha$ 위의 두 점을 택하는 경우의 수는\n$\\binom{5}{2} = \\frac{5 \\times 4}{2} = 10$개입니다.\n점 $P$와 이 10개의 직선이 만드는 평면은 모두 서로 다르며, 점 $P$를 포함하므로 평면 $\\alpha$와도 일치하지 않습니다. (10개)\n\n따라서 만들 수 있는 서로 다른 평면의 개수는\n$1 + 10 = 11$개이다.\n\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-053",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PLANES",
    "crossConceptKeys": [
      "CC_SPATIAL_POSITION_RELATION"
    ],
    "conditionKeys": [
      "COND_NO_THREE_COLLINEAR_POINTS"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 3,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "다음 [보기] 중 옳은 것만을 있는 대로 고른 것은? [그림: 밑면이 정사각형인 사각뿔, 삼각기둥, 정팔면체가 차례로 그려져 있고 각 입체도형의 꼭짓점들이 표시되어 있다.]\n\n[보기]\nㄱ. 정사각뿔의 5개의 꼭짓점으로 결정되는 서로 다른 평면의 개수는 8이다.\nㄴ. 삼각기둥의 6개의 꼭짓점으로 결정되는 서로 다른 평면의 개수는 11이다.\nㄷ. 정팔면체의 6개의 꼭짓점으로 결정되는 서로 다른 평면의 개수는 11이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "[보기]의 각 명제를 차례대로 검증합니다.\n\nㄱ. 정사각뿔의 5개의 꼭짓점으로 결정되는 평면:\n정사각뿔의 꼭짓점의 수는 5개이므로 세 점을 택하는 총 경우의 수는 $\\binom{5}{3} = 10$입니다.\n이 중 밑면의 네 꼭짓점은 한 평면 위에 있으므로, 이 네 점 중 세 점을 택하는 $\\binom{4}{3} = 4$가지 경우는 모두 같은 밑면 평면 1개를 결정합니다.\n따라서 서로 다른 평면의 개수는\n$10 - 4 + 1 = 7$개입니다. (밑면 1개, 옆면 4개, 대각선 단면 2개)\n따라서 ㄱ은 옳지 않습니다. (거짓)\n\nㄴ. 삼각기둥의 6개의 꼭짓점으로 결정되는 평면:\n삼각기둥의 꼭짓점 6개 중 세 점을 택하는 경우의 수는 $\\binom{6}{3} = 20$입니다.\n삼각기둥의 3개의 옆면은 각각 네 꼭짓점이 한 평면 위에 있으므로, 각 옆면마다 $\\binom{4}{3} = 4$개의 조합이 1개의 평면을 이룹니다. 즉, 옆면마다 $4 - 1 = 3$개씩 중복됩니다.\n따라서 결정되는 서로 다른 평면의 개수는\n$20 - 3 \\times (4 - 1) = 20 - 9 = 11$개입니다. (밑면 2개, 옆면 3개, 교차 단면 6개)\n따라서 ㄴ은 옳습니다. (참)\n\nㄷ. 정팔면체의 6개의 꼭짓점으로 결정되는 평면:\n정팔면체의 꼭짓점 6개 중 세 점을 택하는 경우의 수는 $\\binom{6}{3} = 20$입니다.\n정팔면체에는 마주 보는 꼭짓점 쌍을 제외한 4개의 꼭짓점이 정사각형을 이루는 단면(대칭면)이 3개 있습니다.\n각 정사각형 단면 위의 네 꼭짓점에서 세 점을 택하는 $\\binom{4}{3} = 4$개의 조합이 1개의 평면을 이루므로, 각 대칭면마다 $4 - 1 = 3$개씩 중복됩니다.\n따라서 결정되는 서로 다른 평면의 개수는\n$20 - 3 \\times (4 - 1) = 20 - 9 = 11$개입니다. (면 8개, 정사각형 단면 3개)\n따라서 ㄷ은 옳습니다. (참)\n\n이상에서 옳은 것은 ㄴ, ㄷ이다.\n\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-053",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PLANES",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
