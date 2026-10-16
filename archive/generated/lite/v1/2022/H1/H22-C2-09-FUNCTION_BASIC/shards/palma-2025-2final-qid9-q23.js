window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q23-A1",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "mode": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{4-2x}$의 그래프와 직선 $y=-x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [6점]",
    "choices": [],
    "answer": "$2\\le k\\lt \\dfrac52$",
    "solution": "$t=\\sqrt{4-2x}$라 놓으면 $t\\ge0$, $x=\\dfrac{4-t^2}{2}$이다.\n이를 $t=-x+k$에 대입하면 $t^2-2t+2k-4=0$이다.\n이 방정식이 서로 다른 두 실근을 가지려면 판별식 $D=4-4(2k-4)=20-8k>0$이므로 $k<\\dfrac52$이다.\n또 두 근의 합은 $2>0$, 곱은 $2k-4$이므로 두 근이 모두 $0$ 이상일 조건은 $2k-4\\ge0$, 즉 $k\\ge2$이다.\n$k=2$에서 두 근 $0$, $2$는 서로 달라 두 교점이 있고, $k=\\dfrac52$에서는 중근 $1$로 교점이 한 개이다.\n따라서 구하는 범위는 $2\\le k\\lt \\dfrac52$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-A1-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 6,
      "criteria": [
        {
          "points": 2,
          "criterion": "t≥0, x와 t의 대응 및 교점방정식을 정확히 설정; 치환 1점·식 1점"
        },
        {
          "points": 1,
          "criterion": "판별식>0으로 서로 다른 두 실근 상한"
        },
        {
          "points": 1,
          "criterion": "두 근이 모두 음이 아님을 근의 합·곱으로 판정"
        },
        {
          "points": 1,
          "criterion": "끝점 포함, 중근 접점 제외를 실제 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 등호를 정확히 표기"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOTS_COEFFICIENTS"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "learningLevelReason": "원본의 끝점·접점 두 경계를 판별식과 비음수 근 조건으로 구별",
      "assessmentBucketReason": "치환·두 실근·부호·경계의 네 단계, 추가 위치 제한은 없음"
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q23-A2",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "mode": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{1+4x}$의 그래프와 직선 $y=x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [6점]",
    "choices": [],
    "answer": "$\\dfrac14\\le k\\lt \\dfrac54$",
    "solution": "$t=\\sqrt{1+4x}$라 놓으면 $t\\ge0$, $x=\\dfrac{t^2-1}{4}$이다.\n$t=x+k$에 대입하여 $t^2-4t+4k-1=0$을 얻는다.\n서로 다른 두 실근 조건은 $D=16-4(4k-1)=20-16k>0$이므로 $k<\\dfrac54$이다.\n두 근의 합은 $4>0$, 곱은 $4k-1$이므로 모두 $0$ 이상이려면 $4k-1\\ge0$, 즉 $k\\ge\\dfrac14$이어야 한다.\n$k=\\dfrac14$이면 $t=0,4$로 서로 다른 두 교점이 있고, $k=\\dfrac54$이면 $t=2$의 중근으로 한 점에서만 만난다.\n따라서 구하는 범위는 $\\dfrac14\\le k\\lt \\dfrac54$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-A2-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 6,
      "criteria": [
        {
          "points": 2,
          "criterion": "t≥0, x와 t의 대응 및 교점방정식을 정확히 설정; 치환 1점·식 1점"
        },
        {
          "points": 1,
          "criterion": "판별식>0으로 서로 다른 두 실근 상한"
        },
        {
          "points": 1,
          "criterion": "두 근이 모두 음이 아님을 근의 합·곱으로 판정"
        },
        {
          "points": 1,
          "criterion": "끝점 포함, 중근 접점 제외를 실제 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 등호를 정확히 표기"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOTS_COEFFICIENTS"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "learningLevelReason": "우상향 무리함수와 양의 기울기 직선으로 원본 방향을 반전",
      "assessmentBucketReason": "방향 반전으로 부호 실수 위험 증가, 경계 논리는 원본과 동일"
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q23-A3",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "mode": "STRICT_VARIANT",
    "level": "중",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{3-2x}$의 그래프와 직선 $y=-\\dfrac12x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [6점]",
    "choices": [],
    "answer": "$\\dfrac34\\le k\\lt \\dfrac74$",
    "solution": "$t=\\sqrt{3-2x}$로 놓으면 $t\\ge0$, $x=\\dfrac{3-t^2}{2}$이다.\n직선에 대입하면 $t=-\\dfrac{3-t^2}{4}+k$이므로 $t^2-4t+4k-3=0$이다.\n판별식 $D=16-4(4k-3)=28-16k>0$에서 $k<\\dfrac74$이다.\n두 근의 합 $4>0$, 곱 $4k-3\\ge0$을 함께 적용하면 $k\\ge\\dfrac34$이다.\n$k=\\dfrac34$일 때 근 $0$, $4$는 두 교점이고, $k=\\dfrac74$에서는 중근 $2$이므로 두 교점이 아니다.\n따라서 구하는 범위는 $\\dfrac34\\le k\\lt \\dfrac74$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-A3-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 6,
      "criteria": [
        {
          "points": 2,
          "criterion": "t≥0, x와 t의 대응 및 교점방정식을 정확히 설정; 치환 1점·식 1점"
        },
        {
          "points": 1,
          "criterion": "판별식>0으로 서로 다른 두 실근 상한"
        },
        {
          "points": 1,
          "criterion": "두 근이 모두 음이 아님을 근의 합·곱으로 판정"
        },
        {
          "points": 1,
          "criterion": "끝점 포함, 중근 접점 제외를 실제 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 등호를 정확히 표기"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOTS_COEFFICIENTS"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "learningLevelReason": "원본과 같은 구조에서 근호 내부·기울기·경계 이동을 재계산",
      "assessmentBucketReason": "치환과 판별식·근의 곱·양쪽 경계 독립 검사"
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q23-B1",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "중",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{1+4x}$의 그래프와 직선 $y=x+k$가 서로 다른 두 점에서 만나고, 두 교점의 $y$좌표가 모두 $1$ 이상이 되도록 하는 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [7점]",
    "choices": [],
    "answer": "$1\\le k\\lt \\dfrac54$",
    "solution": "$t=\\sqrt{1+4x}\\ge0$으로 놓으면 $x=\\dfrac{t^2-1}{4}$이므로 두 교점의 $t$값은 $t^2-4t+4k-1=0$의 서로 다른 음이 아닌 두 근이다.\n두 교점만을 갖는 범위는 $\\dfrac14\\le k\\lt\\dfrac54$이다.\n두 근은 $t_1=2-\\sqrt{5-4k}$, $t_2=2+\\sqrt{5-4k}$이고 $t_1<t_2$이다.\n두 교점의 $y$좌표가 모두 $1$ 이상이려면 작은 근이 $1$ 이상이어야 하므로\n$2-\\sqrt{5-4k}\\ge1$, 즉 $\\sqrt{5-4k}\\le1$에서 $k\\ge1$이다.\n$k=1$이면 $t=1,3$으로 조건에 맞는 두 교점이 있고, $k=\\dfrac54$에서는 중근으로 한 점만 만난다.\n따라서 구하는 범위는 $1\\le k\\lt\\dfrac54$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-B1-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 7,
      "criteria": [
        {
          "points": 1,
          "criterion": "치환 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "서로 다른 두 실제 교점 기본 범위: 판별식 1점, t≥0 1점"
        },
        {
          "points": 2,
          "criterion": "추가 y 또는 x 위치 조건을 작은/큰 근에 정확히 적용: 변환 1점, 부등식 1점"
        },
        {
          "points": 1,
          "criterion": "위치 경계·접점의 포함/제외 확인"
        },
        {
          "points": 1,
          "criterion": "최종 범위"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_QUADRATIC_EQUATION"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "CONDITION_FILTER",
      "difficultyBucket": 4,
      "learningLevelReason": "두 교점의 존재에 더해 두 y좌표 모두 1 이상인지 검사",
      "assessmentBucketReason": "작은 근 하한을 추가로 판정하고 해당 등호 직접 검토"
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q23-B2",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{2-3x}$의 그래프와 직선 $y=-\\dfrac12x+k$가 서로 다른 두 점에서 만나고, 두 교점 중 한 점은 $y$축 위 또는 그 오른쪽에, 다른 한 점은 $y$축 왼쪽에 있도록 하는 모든 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [7점]",
    "choices": [],
    "answer": "$\\dfrac13\\le k\\le\\sqrt2$",
    "solution": "$t=\\sqrt{2-3x}\\ge0$으로 놓으면 $x=\\dfrac{2-t^2}{3}$이며 교점 조건은 $t^2-6t+6k-2=0$이다.\n서로 다른 두 음이 아닌 근을 갖는 범위는 $\\dfrac13\\le k\\lt\\dfrac{11}{6}$이다.\n두 근을 $t_1=3-\\sqrt{11-6k}$, $t_2=3+\\sqrt{11-6k}$라 하면 $0\\le t_1<t_2$이다.\n$x=\\dfrac{2-t^2}{3}$이므로 $x\\ge0$일 조건은 $t\\le\\sqrt2$이고 $x<0$일 조건은 $t>\\sqrt2$이다.\n$t_2>3>\\sqrt2$는 항상 성립하므로 $t_1\\le\\sqrt2$만 검사한다.\n$3-\\sqrt{11-6k}\\le\\sqrt2$에서 $\\sqrt{11-6k}\\ge3-\\sqrt2$이다.\n양변이 음이 아니므로 제곱하면 $11-6k\\ge(3-\\sqrt2)^2=11-6\\sqrt2$, 즉 $k\\le\\sqrt2$이다.\n$k=\\sqrt2$에서는 작은 근이 $\\sqrt2$로 $y$축 위의 교점을 포함하고 두 근은 여전히 서로 다르다.\n따라서 구하는 범위는 $\\dfrac13\\le k\\le\\sqrt2$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-B2-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 7,
      "criteria": [
        {
          "points": 1,
          "criterion": "치환 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "서로 다른 두 실제 교점 기본 범위: 판별식 1점, t≥0 1점"
        },
        {
          "points": 2,
          "criterion": "추가 y 또는 x 위치 조건을 작은/큰 근에 정확히 적용: 변환 1점, 부등식 1점"
        },
        {
          "points": 1,
          "criterion": "위치 경계·접점의 포함/제외 확인"
        },
        {
          "points": 1,
          "criterion": "최종 범위"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_QUADRATIC_EQUATION",
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "learningLevelReason": "근의 크기를 x 부호 조건으로 재해석하고 y축 위 경계를 판정",
      "assessmentBucketReason": "두 교점 수 + x 부호 + 경계 포함을 통합"
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q23-B3",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{1-4x}$의 그래프와 직선 $y=-x+k$가 서로 다른 두 점에서 만나며, 두 교점의 $x$좌표가 모두 음수가 되도록 하는 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [7점]",
    "choices": [],
    "answer": "$1\\lt k\\lt \\dfrac54$",
    "solution": "$t=\\sqrt{1-4x}$로 놓으면 $t\\ge0$, $x=\\dfrac{1-t^2}{4}$이다.\n직선에 대입한 방정식은 $t^2-4t+4k-1=0$이고, 서로 다른 두 음이 아닌 근을 갖는 범위는 $\\dfrac14\\le k\\lt\\dfrac54$이다.\n두 근은 $t_1=2-\\sqrt{5-4k}$와 $t_2=2+\\sqrt{5-4k}$이다.\n$x<0$일 필요충분조건은 $t>1$이므로 두 교점 모두 $x<0$이려면 작은 근에 대해\n$2-\\sqrt{5-4k}>1$, 즉 $\\sqrt{5-4k}<1$이어야 한다.\n이에 따라 $5-4k<1$, 즉 $k>1$이다.\n$k=1$이면 작은 근 $t_1=1$에서 $x=0$이 되어 제외되고, $k=\\dfrac54$에서는 두 근이 같아 제외된다.\n따라서 구하는 범위는 $1\\lt k\\lt\\dfrac54$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-B3-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 7,
      "criteria": [
        {
          "points": 1,
          "criterion": "치환 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "서로 다른 두 실제 교점 기본 범위: 판별식 1점, t≥0 1점"
        },
        {
          "points": 2,
          "criterion": "추가 y 또는 x 위치 조건을 작은/큰 근에 정확히 적용: 변환 1점, 부등식 1점"
        },
        {
          "points": 1,
          "criterion": "위치 경계·접점의 포함/제외 확인"
        },
        {
          "points": 1,
          "criterion": "최종 범위"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_QUADRATIC_EQUATION",
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_NEGATIVE"
      ],
      "integrationPattern": "CONDITION_FILTER",
      "difficultyBucket": 4,
      "learningLevelReason": "끝점 x=0은 허용하지 않는 엄격한 위치 조건과 접점 배제",
      "assessmentBucketReason": "두 y근의 하한을 x<0으로 바꾸는 부등식 분기"
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q23-C1",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] 함수 $y=\\sqrt{2-3x}$의 그래프와 직선 $y=-\\dfrac12x+k$가 서로 다른 두 점에서 만난다. 두 교점 중 한 점은 $y$축 위 또는 오른쪽에 있고 다른 점은 $y$축 왼쪽에 있으며, 두 교점의 $y$좌표 중 큰 값은 $5$ 이하이다. 이 모든 조건을 만족시키는 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [8점]",
    "choices": [],
    "answer": "$\\dfrac76\\le k\\le\\sqrt2$",
    "solution": "$t=\\sqrt{2-3x}\\ge0$을 놓으면 $x=\\dfrac{2-t^2}{3}$이고 $t^2-6t+6k-2=0$이 성립한다.\n두 교점의 조건은 $\\dfrac13\\le k\\lt\\dfrac{11}{6}$이다.\n두 근은 $t_1=3-\\sqrt{11-6k}$, $t_2=3+\\sqrt{11-6k}$로 $0\\le t_1<t_2$이다.\n$y$축 위 또는 오른쪽에 교점이 있으려면 작은 근 $t_1\\le\\sqrt2$이어야 하므로 $k\\le\\sqrt2$이다. 큰 근에 해당하는 점은 $t_2>3>\\sqrt2$이므로 $x<0$이다.\n또 큰 $y$값은 $t_2$이므로 $t_2\\le5$를 적용한다.\n$3+\\sqrt{11-6k}\\le5$에서 $\\sqrt{11-6k}\\le2$, 즉 $k\\ge\\dfrac76$이다.\n따라서 $\\dfrac76\\le k\\le\\sqrt2$가 되고 이는 두 교점 기본 범위 안에 있다.\n$k=\\dfrac76$에서 $t_2=5$이고, $k=\\sqrt2$에서 $t_1=\\sqrt2$이므로 두 경계는 모두 포함된다.\n따라서 구하는 범위는 $\\dfrac76\\le k\\le\\sqrt2$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-C1-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 8,
      "criteria": [
        {
          "points": 1,
          "criterion": "매개변수와 치환변수의 범위 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "실근 구분 1점, 두 실제 교점(허용 근의 부호) 1점"
        },
        {
          "points": 2,
          "criterion": "추가된 복합·전칭 조건을 정확한 부등식으로 환원 및 구간 결합"
        },
        {
          "points": 2,
          "criterion": "양쪽 경계에서 교점 수·위치 또는 최악 매개변수 정확 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 부등호"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_QUADRATIC_EQUATION",
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "learningLevelReason": "양쪽 교점 위치와 큰 y값 제한이 서로 다른 경계 k를 결정",
      "assessmentBucketReason": "두 위치조건·두 근의 순서·경계 동시 검증"
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q23-C2",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] $1\\le a\\le3$인 모든 실수 $a$에 대하여 함수 $y=\\sqrt{a-3x}$의 그래프와 직선 $y=-\\dfrac12x+k$가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [8점]",
    "choices": [],
    "answer": "$\\dfrac12\\le k\\lt \\dfrac53$",
    "solution": "$a$를 $1\\le a\\le3$인 임의의 실수로 고정한다.\n$t=\\sqrt{a-3x}\\ge0$으로 놓으면 $x=\\dfrac{a-t^2}{3}$이므로 $t^2-6t+6k-a=0$이다.\n이차방정식이 서로 다른 두 음이 아닌 근을 가지려면 판별식 $36-4(6k-a)>0$ 및 두 근의 곱 $6k-a\\ge0$이 필요하다. 두 근의 합 $6>0$이므로 이 두 조건은 충분하기도 하다.\n따라서 각 $a$에 대해 $\\dfrac a6\\le k\\lt\\dfrac a6+\\dfrac32$이다.\n이 조건이 $1\\le a\\le3$의 모든 $a$에서 성립하려면 왼쪽 경계의 최댓값인 $\\dfrac36=\\dfrac12$ 이상이고, 오른쪽 경계의 최솟값인 $\\dfrac16+\\dfrac32=\\dfrac53$보다 작아야 한다.\n$k=\\dfrac12$일 때 $a=3$에서 두 근 $0,6$으로 두 점이므로 포함된다.\n$k=\\dfrac53$일 때 $a=1$에서 중근 $3$으로 한 점뿐이므로 제외된다.\n따라서 구하는 범위는 $\\dfrac12\\le k\\lt\\dfrac53$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-C2-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 8,
      "criteria": [
        {
          "points": 1,
          "criterion": "매개변수와 치환변수의 범위 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "실근 구분 1점, 두 실제 교점(허용 근의 부호) 1점"
        },
        {
          "points": 2,
          "criterion": "추가된 복합·전칭 조건을 정확한 부등식으로 환원 및 구간 결합"
        },
        {
          "points": 2,
          "criterion": "양쪽 경계에서 교점 수·위치 또는 최악 매개변수 정확 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 부등호"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOTS_COEFFICIENTS"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE",
        "COND_UNIVERSAL_INPUTS"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "learningLevelReason": "모든 a에 대해 교점 둘이라는 전칭 조건을 각 경계 함수의 최댓값·최솟값으로 환원",
      "assessmentBucketReason": "두 실근의 부호 + 전칭 매개변수의 서로 다른 최악 경계"
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q23-C3",
    "sourceQid": 23,
    "sourceUid": "qid_v1_1bc7273944cc5f9767fc39ca7e0bea31015f0cd03198b58ca5cf1c951b07f981",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "mode": "FOLLOWUP",
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-09",
    "standardUnit": "무리함수",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C2-09-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "그래프",
      "교점"
    ],
    "wide": false,
    "content": "[서술형 4] $\\dfrac12\\le m\\le1$인 모든 실수 $m$에 대하여 함수 $y=\\sqrt{2-3x}$의 그래프와 직선 $y=-mx+k$가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 범위를 풀이 과정과 함께 구하시오. [8점]",
    "choices": [],
    "answer": "$\\dfrac23\\le k\\lt \\dfrac{17}{12}$",
    "solution": "$m$은 $\\dfrac12\\le m\\le1$인 양수이다.\n$t=\\sqrt{2-3x}\\ge0$으로 놓으면 $x=\\dfrac{2-t^2}{3}$이고 $t=-\\dfrac m3(2-t^2)+k$이다.\n따라서 $t^2-\\dfrac3m t+\\dfrac{3k}{m}-2=0$이다.\n두 근의 합 $\\dfrac3m>0$, 곱 $\\dfrac{3k}{m}-2\\ge0$에서 $k\\ge\\dfrac{2m}{3}$이고,\n판별식이 양수이려면 $\\dfrac9{m^2}-4(\\dfrac{3k}{m}-2)>0$에서 $k<\\dfrac{2m}{3}+\\dfrac3{4m}$이다.\n이 부등식이 모든 $m\\in[\\dfrac12,1]$에 대해 성립해야 한다.\n왼쪽 경계 $\\dfrac{2m}{3}$의 최댓값은 $m=1$일 때 $\\dfrac23$이다.\n또 $F(m)=\\dfrac{2m}{3}+\\dfrac3{4m}$이라 놓으면\n$F(m)-\\dfrac{17}{12}=\\dfrac{(1-m)(9-8m)}{12m}\\ge0$이다.\n따라서 오른쪽 경계의 최솟값은 $m=1$에서 $\\dfrac{17}{12}$이다.\n$k=\\dfrac23$, $m=1$에서는 두 근 $0,3$으로 두 교점이 있고, $k=\\dfrac{17}{12}$, $m=1$에서는 중근 $\\dfrac32$이므로 제외된다.\n따라서 구하는 범위는 $\\dfrac23\\le k\\lt\\dfrac{17}{12}$이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q23-C3-solution.svg",
    "solutionImageSize": "full",
    "scoring": {
      "totalPoints": 8,
      "criteria": [
        {
          "points": 1,
          "criterion": "매개변수와 치환변수의 범위 및 교점 이차방정식"
        },
        {
          "points": 2,
          "criterion": "실근 구분 1점, 두 실제 교점(허용 근의 부호) 1점"
        },
        {
          "points": 2,
          "criterion": "추가된 복합·전칭 조건을 정확한 부등식으로 환원 및 구간 결합"
        },
        {
          "points": 2,
          "criterion": "양쪽 경계에서 교점 수·위치 또는 최악 매개변수 정확 대입"
        },
        {
          "points": 1,
          "criterion": "최종 범위와 부등호"
        }
      ],
      "partialCreditRule": "정답만 제시하면 중간 변환·부호·경계 점수를 인정하지 않음. 독립적으로 옳은 각 풀이 단계만 개별 인정"
    },
    "meta": {
      "primaryRpmL3Id": "H1-RPM-272",
      "rpmL1": "함수",
      "rpmL2": "무리함수",
      "rpmL3": "무리함수의 활용",
      "rpmL4": "무리함수의 교점",
      "rpmMappingStatus": "RPM_PRIMARY_CURRENT_DIRECT_ACTIVE",
      "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
      "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
      "ptTplBindingStatus": "DIRECT_ACTIVE_H1_RPM_272",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOTS_COEFFICIENTS"
      ],
      "conditionKeys": [
        "COND_EXACT_INTERSECTION_COUNT",
        "COND_RANGE",
        "COND_UNIVERSAL_INPUTS"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "learningLevelReason": "직선 기울기 매개변수 전체에서 두 경계 함수의 극값을 미분 없이 비교",
      "assessmentBucketReason": "전칭 m + 근의 부호·판별식 + 유리식 부등식 인수분해"
    }
  }
];
