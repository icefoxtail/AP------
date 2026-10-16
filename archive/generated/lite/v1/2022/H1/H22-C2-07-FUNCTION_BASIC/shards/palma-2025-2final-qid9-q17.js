window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q17-A1",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+c&(x\\lt b)\\\\2(x-2)^2-1&(x\\ge b)\\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 한다. $b=t$일 때 $c$의 값은?",
    "choices": [
      "$7$",
      "$-3$",
      "$0$",
      "$-2$",
      "$-1$"
    ],
    "answer": "②",
    "solution": "$x\\lt b$에서 $x+c$의 치역은 $(-\\infty,b+c)$이다.\n둘째 조각 $2(x-2)^2-1$은 $x=2$를 기준으로 감소하다 증가한다. $x\\ge b$에서 일대일이 되려면 $b\\ge2$이다.\n실수 전체로 일대일대응하려면 두 치역이 겹치지 않으면서 빈틈도 없어야 하므로 오른쪽 조각의 시작값과 왼쪽 치역의 끝값이 같아야 한다.\n$b=2$일 때 이 조건은 $2+c=2(2-2)^2-1=-1$이므로 $c=-3$이다.\n이때 치역은 각각 $(-\\infty,-1)$, $[-1,\\infty)$로 이어져 실제로 역함수가 존재한다. 따라서 $t=2$이다.\n따라서 정답은 ②이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다."
      },
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_BOUNDARY",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "꼭짓점 x=2 확인 → b의 최소 2 → 두 치역 접합 → c 결정",
        "learningLevel": "포물선 꼭짓점의 오른쪽에서만 일대일인 사실과 두 치역의 접합을 판단한다.",
        "assessmentBucket": "경계 한 번과 등식 하나로 끝나지만 분기 포함 여부를 확인해야 한다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "EXEMPT: 단일 경계 등식으로 충분히 재현 가능하여 추가 그림은 계산 이해를 개선하지 않는다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q17-A2",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}2x+c&(x\\lt b)\\\\3(x-3)^2-4&(x\\ge b)\\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 한다. $b=t$일 때 $c$의 값은?",
    "choices": [
      "$-5$",
      "$-7$",
      "$-9$",
      "$23$",
      "$-10$"
    ],
    "answer": "⑤",
    "solution": "$x\\lt b$에서 $2x+c$의 치역은 $(-\\infty,2b+c)$이다.\n둘째 조각의 꼭짓점은 $(3,-4)$이고 $x\\ge3$에서 증가한다. 역함수의 존재를 위해 $b\\ge3$이어야 하며 최솟값 후보는 $3$이다.\n$b=3$에서 오른쪽 조각의 시작값은 $-4$이다. 두 치역이 실수 전체를 빈틈없이 나누려면 $2\\cdot3+c=-4$이다.\n따라서 $c=-10$이고, 실제 두 치역은 $(-\\infty,-4)$와 $[-4,\\infty)$여서 역함수가 존재한다. 그러므로 $t=3$이다.\n따라서 정답은 ⑤이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다."
      },
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_BOUNDARY",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "꼭짓점 x=3 → 최솟값 b=3 → 왼쪽 2b+c와 오른쪽 -4 일치",
        "learningLevel": "기울기가 2인 왼쪽 조각의 상한과 오른쪽 이차식의 꼭짓점 값을 정확히 연결한다.",
        "assessmentBucket": "배율 2를 접합식에 넣어야 하지만 경우 분기는 없다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "EXEMPT: 단일 경계 등식으로 충분히 재현 가능하여 추가 그림은 계산 이해를 개선하지 않는다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q17-A3",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}-2x+c&(x\\lt b)\\\\-3(x+1)^2+2&(x\\ge b)\\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 한다. $b=t$일 때 $c$의 값은?",
    "choices": [
      "$0$",
      "$-1$",
      "$2$",
      "$4$",
      "$-8$"
    ],
    "answer": "①",
    "solution": "$x\\lt b$에서 $-2x+c$는 감소하며 치역은 $(-2b+c,\\infty)$이다.\n둘째 조각 $-3(x+1)^2+2$도 $x\\ge b$에서 감소해야 일대일이므로 꼭짓점의 오른쪽인 $b\\ge-1$이어야 한다.\n두 조각은 감소하는 방향으로 실수 전체를 채우므로 오른쪽 조각의 최댓값과 왼쪽 조각의 하한이 같아야 한다.\n$b=-1$일 때 왼쪽 경계값은 $-2(-1)+c=2+c$이고 오른쪽 시작값은 $-3(0)^2+2=2$이다.\n$2+c=2$에서 $c=0$이다. 이때 두 치역이 $(-\\infty,2]$, $(2,\\infty)$를 이루므로 역함수가 실제로 존재한다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다."
      },
      "conditionKeys": [
        "COND_RANGE",
        "COND_NEGATIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_BOUNDARY",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "오른쪽 아래로 열린 포물선의 꼭짓점 -1 → 두 감소 치역 접합 → c=0",
        "learningLevel": "두 조각이 모두 감소하는 경우에도 치역을 위·아래로 정확히 접합해야 함을 사용한다.",
        "assessmentBucket": "양의 계수 포물선과 달리 열린 하한·닫힌 상한을 뒤집어 해석해야 한다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "EXEMPT: 단일 경계 등식으로 충분히 재현 가능하여 추가 그림은 계산 이해를 개선하지 않는다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q17-B1",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+c&(x\\lt 3)\\\\(x-1)^2+p&(x\\ge 3)\\end{cases}$의 역함수가 존재하고 $f(4)=10$이다. 상수 $c$의 값은? (단, $c,p$는 실수이다.)",
    "choices": [
      "$6$",
      "$-2$",
      "$2$",
      "$5$",
      "$7$"
    ],
    "answer": "③",
    "solution": "$x\\lt3$에서 왼쪽 치역은 $(-\\infty,3+c)$이다. 오른쪽 조각 $(x-1)^2+p$는 $x\\ge3$에서 증가하므로 치역은 $[4+p,\\infty)$이다.\n$4\\ge3$이므로 $f(4)=(4-1)^2+p=9+p=10$에서 $p=1$이다.\n역함수가 존재하려면 두 치역이 겹치거나 비어 있지 않도록 $3+c=4+p$이어야 한다.\n$3+c=5$이므로 $c=2$이다. 두 치역은 $(-\\infty,5)$와 $[5,\\infty)$로 정확히 이어진다.\n따라서 정답은 ③이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다."
      },
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_BOUNDARY",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "x=4 가지 판정 → p 계산 → 경계 x=3에서 치역 접합 → c",
        "learningLevel": "조건 f(4)=10이 오른쪽 가지에 속함을 판정하고 접합식에 연결한다.",
        "assessmentBucket": "값 조건으로 p를 먼저 정한 다음 별도 치역 경계 등식을 적용한다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "EXEMPT: 단일 경계 등식으로 충분히 재현 가능하여 추가 그림은 계산 이해를 개선하지 않는다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q17-B2",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수",
      "그래프"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+c&(x\\lt b)\\\\3(x-1)^2-2&(x\\ge b)\\end{cases}$의 역함수가 존재하도록 하는 $b$의 최솟값을 $t$라 한다. $b=t$일 때 $f^{-1}(10)$의 값은?",
    "choices": [
      "$3$",
      "$-1$",
      "$1$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "오른쪽 조각 $3(x-1)^2-2$가 일대일이려면 $b\\ge1$이다. 왼쪽은 증가하는 직선이므로 두 치역을 맞추면 $b=1$을 실현할 수 있다.\n$b=t=1$에서 왼쪽 경계값 $1+c$와 오른쪽 시작값 $-2$가 같아 $c=-3$이다.\n따라서 왼쪽 조각의 치역은 $(-\\infty,-2)$, 오른쪽 치역은 $[-2,\\infty)$이다.\n$f^{-1}(10)$은 $f(x)=10$의 유일한 해이다. $10\\ge-2$이므로 오른쪽 식을 이용한다.\n$3(x-1)^2-2=10$, $(x-1)^2=4$이므로 $x=3$ 또는 $x=-1$이다.\n오른쪽 조각의 정의역 $x\\ge1$을 만족하는 해는 $x=3$뿐이다. 따라서 $f^{-1}(10)=3$이다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q17-B2-solution.svg",
    "solutionImageAlt": "B2 왼쪽 직선과 오른쪽 이차함수의 구간별 연결 및 유일한 대응 그래프",
    "solutionImageCaption": "f^{-1}(10) 계산 때 오른쪽 정의역 제한을 끝까지 적용한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION",
        "CC_QUADRATIC_EQUATION",
        "CC_INVERSE_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "CC_QUADRATIC_EQUATION": "치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다.",
        "CC_INVERSE_FUNCTION": "원래 함수의 목표 함숫값을 주는 원상을 각 조각에서 풀고 정의역에 맞는 유일한 역함숫값만 선택한다."
      },
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "CASE_BOUNDARY_CHECK",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다. | CC_QUADRATIC_EQUATION: 치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다. | CC_INVERSE_FUNCTION: 원래 함수의 목표 함숫값을 주는 원상을 각 조각에서 풀고 정의역에 맞는 유일한 역함숫값만 선택한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "최소 경계 t=1 → c=-3 → f(x)=10의 두 해 → x≥1 선별",
        "learningLevel": "치역 접합 후 역함수의 입력을 원래 함수 방정식으로 되돌려 구간별 근을 선별한다.",
        "assessmentBucket": "제곱방정식의 두 근 가운데 오른쪽 정의역에 속하는 근을 걸러야 한다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "BENEFICIAL: f^{-1}(10) 계산 때 오른쪽 정의역 제한을 끝까지 적용한다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q17-B3",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수",
      "그래프"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}-x+c&(x\\lt 4)\\\\-a(x-2)^2+2&(x\\ge 4)\\end{cases}$의 역함수가 존재하고 $f(5)=-7$이다. $a+c$의 값은? (단, $a\\gt0$)",
    "choices": [
      "$-3$",
      "$-1$",
      "$-5$",
      "$7$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "$x\\lt4$에서 $-x+c$는 감소하며 치역은 $(-4+c,\\infty)$이다.\n$x\\ge4$에서 $-a(x-2)^2+2$는 $a>0$이므로 감소하며 치역은 $(-\\infty,-4a+2]$이다.\n$x=5$는 오른쪽 가지에 있으므로 $f(5)=-a(5-2)^2+2=-9a+2=-7$이다. 따라서 $a=1$이다.\n두 치역이 실수 전체를 빈틈없이 나누려면 $-4+c=-4a+2=-2$이어야 한다.\n따라서 $c=2$이고 $a+c=1+2=3$이다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q17-B3-solution.svg",
    "solutionImageAlt": "B3 왼쪽 직선과 오른쪽 이차함수의 구간별 연결 및 유일한 대응 그래프",
    "solutionImageCaption": "감소형 치역 경계와 f(5) 수치 조건을 함께 연쇄 적용한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다."
      },
      "conditionKeys": [
        "COND_RANGE",
        "COND_NEGATIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_BOUNDARY",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "오른쪽 함수값 f(5)→a → 감소형 치역 경계 등식 → c → a+c",
        "learningLevel": "감소형 조각의 치역을 역순으로 붙이고 오른쪽 함수값 제약으로 a를 먼저 결정한다.",
        "assessmentBucket": "부호가 바뀐 두 치역의 열린·닫힌 경계와 함수값 제약을 연쇄 적용한다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "BENEFICIAL: 감소형 치역 경계와 f(5) 수치 조건을 함께 연쇄 적용한다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q17-C1",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수",
      "그래프"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+1&(x\\lt b)\\\\(x-2)^2-3&(x\\ge b)\\end{cases}$의 역함수가 존재할 때, 실수 $b$의 값은?",
    "choices": [
      "$0$",
      "$2$",
      "$5$",
      "$3$",
      "$-5$"
    ],
    "answer": "③",
    "solution": "첫째 조각 $x+1$은 증가하고, 둘째 조각 $(x-2)^2-3$은 $x=2$에서 방향이 바뀐다.\n오른쪽 조각에서 일대일이 되려면 $b\\ge2$이다. 이때 두 치역은 $(-\\infty,b+1)$과 $[(b-2)^2-3,\\infty)$이다.\n실수 전체로의 일대일대응 조건은 두 치역의 경계가 같다는 것이므로 $b+1=(b-2)^2-3$이다.\n$b+4=b^2-4b+4$에서 $b^2-5b=0$, $b(b-5)=0$이다.\n따라서 $b=0$ 또는 $b=5$이나, 단조 조건 $b\\ge2$를 만족하는 것은 $b=5$뿐이다.\n실제로 $b=5$일 때 양쪽 치역은 $(-\\infty,6)$과 $[6,\\infty)$여서 역함수가 존재한다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q17-C1-solution.svg",
    "solutionImageAlt": "C1 왼쪽 직선과 오른쪽 이차함수의 구간별 연결 및 유일한 대응 그래프",
    "solutionImageCaption": "접합 방정식의 대수적 두 해 가운데 단조성을 만족하는 하나를 고른다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION",
        "CC_QUADRATIC_EQUATION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "CC_QUADRATIC_EQUATION": "치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다."
      },
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "CASE_BOUNDARY_CHECK",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다. | CC_QUADRATIC_EQUATION: 치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "b≥2 → 치역 접합 방정식 → b=0/5 → 정의역 필터",
        "learningLevel": "치역 접합식의 두 근을 구한 뒤 포물선 단조 정의역 조건으로 한 근을 제거한다.",
        "assessmentBucket": "대수적으로 가능한 경계 둘 중 하나가 함수 전체의 일대일성을 깨는 함정이다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "REQUIRED: 접합 방정식의 대수적 두 해 가운데 단조성을 만족하는 하나를 고른다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q17-C2",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수",
      "그래프"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}x+c&(x\\lt b)\\\\a(x-2)^2-2a-1&(x\\ge b)\\end{cases}$의 역함수가 존재하고 $f(0)=-6$, $f(4)=3$이다. 실수 $b$의 값은? (단, $a\\gt0$)",
    "choices": [
      "$\\dfrac{3}{2}$",
      "$2$",
      "$4$",
      "$3$",
      "$1$"
    ],
    "answer": "④",
    "solution": "오른쪽은 $a>0$인 포물선이고 꼭짓점의 $x$좌표는 $2$이다. 따라서 오른쪽 조각이 일대일이려면 $b\\ge2$이다.\n$0<b$이므로 $f(0)$은 왼쪽 식의 값 $c$이고 $c=-6$이다.\n만약 $b>4$이면 $f(4)=4+c=-2$가 되어 조건 $3$에 어긋난다. 따라서 $2\\le b\\le4$이다.\n그러므로 $f(4)=a(4-2)^2-2a-1=2a-1=3$이고 $a=2$이다.\n두 치역이 빈틈없이 이어지려면 $b+c=a(b-2)^2-2a-1$이다. $a=2$, $c=-6$을 넣으면 $b-6=2(b-2)^2-5$이다.\n$b-1=2b^2-8b+8$이므로 $2b^2-9b+9=0$, $(2b-3)(b-3)=0$이다.\n$b=\\dfrac32$ 또는 $b=3$인데, $b\\ge2$를 만족하는 값은 $3$뿐이다.\n이때 왼쪽 치역 $(-\\infty,-3)$, 오른쪽 치역 $[-3,\\infty)$가 실수 전체를 이룬다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q17-C2-solution.svg",
    "solutionImageAlt": "C2 왼쪽 직선과 오른쪽 이차함수의 구간별 연결 및 유일한 대응 그래프",
    "solutionImageCaption": "함숫값의 구간 소속 판정과 경계방정식의 두 근 필터를 결합한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION",
        "CC_QUADRATIC_EQUATION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "CC_QUADRATIC_EQUATION": "치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다."
      },
      "conditionKeys": [
        "COND_RANGE",
        "COND_POSITIVE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "CASE_BOUNDARY_CHECK",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다. | CC_QUADRATIC_EQUATION: 치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "b≥2 → f0에서 c → f4의 가지 검증→a → 경계 이차식 → b 해 필터",
        "learningLevel": "f(0), f(4)의 서로 다른 가지 소속을 먼저 판단하여 계수 a,c를 정하고 경계방정식의 허용 해를 판정한다.",
        "assessmentBucket": "입력 4의 조각 소속 자체를 경우로 검사해야 하며 두 근의 도메인 필터가 필수다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "REQUIRED: 함숫값의 구간 소속 판정과 경계방정식의 두 근 필터를 결합한다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q17-C3",
    "sourceQid": 17,
    "sourceUid": "qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "조각함수의 일대일대응과 역함수 존재 조건",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수",
      "일대일대응",
      "조각함수",
      "그래프"
    ],
    "wide": false,
    "content": "실수 전체의 집합을 정의역과 공역으로 하는 함수 $f(x)=\\begin{cases}-x+1&(x\\lt b)\\\\-2(x-1)^2+p&(x\\ge b)\\end{cases}$의 역함수가 존재하고 $f(3)=-7$일 때, $f^{-1}(-17)$의 값은? (단, $b,p$는 실수이다.)",
    "choices": [
      "$-2$",
      "$4$",
      "$18$",
      "$10$",
      "$1+\\dfrac{\\sqrt{34}}{2}$"
    ],
    "answer": "②",
    "solution": "왼쪽 조각 $-x+1$은 감소하므로 오른쪽 조각도 감소하며 두 치역이 위아래로 이어져야 역함수가 존재한다.\n오른쪽 조각 $-2(x-1)^2+p$가 $x\\ge b$에서 감소하려면 $b\\ge1$이다.\n만약 $b>3$이라면 $f(3)=-3+1=-2$가 되어 주어진 $-7$과 다르다. 따라서 $1\\le b\\le3$이다.\n이제 $f(3)=-2(3-1)^2+p=-8+p=-7$이므로 $p=1$이다.\n치역 접합 조건은 $-b+1=-2(b-1)^2+1$이다. 따라서 $b=2(b-1)^2$이고 $2b^2-5b+2=(2b-1)(b-2)=0$이다.\n$b=\\dfrac12$ 또는 $2$인데 $b\\ge1$에서 $b=2$만 가능하다.\n$f^{-1}(-17)$을 구하려면 $f(x)=-17$을 푼다. 왼쪽 식은 $-x+1=-17$에서 $x=18$이지만 $x\\lt2$가 아니므로 제외한다.\n오른쪽 식은 $-2(x-1)^2+1=-17$이므로 $(x-1)^2=9$, $x=-2$ 또는 $x=4$이다.\n$x\\ge2$인 해는 $x=4$뿐이므로 $f^{-1}(-17)=4$이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q17-C3-solution.svg",
    "solutionImageAlt": "C3 왼쪽 직선과 오른쪽 이차함수의 구간별 연결 및 유일한 대응 그래프",
    "solutionImageCaption": "f(3) 가지·경계 b·f^{-1}(-17) 가지를 단계마다 각각 판별한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-257",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "함수의 성질",
      "rpmL4": "일대일함수",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 high1.json H1-RPM-257 -> H22-C2-07-FUNCTION_BASIC; PT_ONE_TO_ONE_BIJECTION / TPL_BIJECTION_JUDGMENT_CONDITION ACTIVE; compared 255/256 inverse L3 and 257 bijection L3",
      "problemTypeKey": "PT_ONE_TO_ONE_BIJECTION",
      "templateKey": "TPL_BIJECTION_JUDGMENT_CONDITION",
      "crossConceptKeys": [
        "CC_QUADRATIC_FUNCTION",
        "CC_QUADRATIC_EQUATION",
        "CC_INVERSE_FUNCTION"
      ],
      "crossConceptDecisiveSteps": {
        "CC_QUADRATIC_FUNCTION": "오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다.",
        "CC_QUADRATIC_EQUATION": "치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다.",
        "CC_INVERSE_FUNCTION": "원래 함수의 목표 함숫값을 주는 원상을 각 조각에서 풀고 정의역에 맞는 유일한 역함숫값만 선택한다."
      },
      "conditionKeys": [
        "COND_RANGE",
        "COND_NEGATIVE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "CASE_BOUNDARY_CHECK",
      "metadataDebt": [
        "INDEPENDENT_QUALITY_NOT_RUN",
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "함수 역함수 존재의 필요충분조건은 조각별 일대일성과 실수 전체 공역을 겹침·누락 없이 채우는 것이다. RPM 함수의 성질/일대일함수 결정적 사고에 해당하며 역함수 식 계산(255)이나 그래프 대칭(256)이 Primary가 아니다.",
        "l4": "H1-RPM-257 기존 일대일함수 L4 재사용; 금당고 Q06 Generated param L4는 후보/branch-only이며 이 문제의 RPM L4로 충분.",
        "cross": "CC_QUADRATIC_FUNCTION: 오른쪽 이차식의 꼭짓점과 단조 구간을 찾아 왼쪽 직선과 일대일대응 가능한 접합 경계를 결정한다. | CC_QUADRATIC_EQUATION: 치역 경계 접합으로 나온 이차방정식의 모든 근을 구하고, 반드시 b의 허용 구간으로 걸러낸다. | CC_INVERSE_FUNCTION: 원래 함수의 목표 함숫값을 주는 원상을 각 조각에서 풀고 정의역에 맞는 유일한 역함숫값만 선택한다.",
        "condition": "COND_RANGE: x<b와 x>=b의 정의역·경계 구분; 추가 양·음수 부호 제약이 실제 존재하는 경우에만 별도 표기.",
        "integration": "감소·꼭짓점 → f3로 p → 경계 b 두 근 → 허용 b=2 → f(x)=-17 두 조각 검증",
        "learningLevel": "주어진 f(3)으로 조각 소속을 확정한 뒤 경계이차식의 잘못된 근을 버리고 역함숫값의 양쪽 조각 해를 재검사한다.",
        "assessmentBucket": "구간 소속 2회 판정, 역함수 존재, 경계방정식과 이차방정식 근 필터가 연동된다.",
        "problemVisual": "EXEMPT: 계산과 정의역 구간이 발문 안의 식으로 명확하게 주어져 학생용 문제 그림이 없어도 풀이가 결정된다.",
        "solutionVisual": "REQUIRED: f(3) 가지·경계 b·f^{-1}(-17) 가지를 단계마다 각각 판별한다.",
        "curriculum": "2022 개정 공통수학2 일대일대응, 역함수, 정의역·치역 및 공통수학1 이차식/이차방정식만 사용. 미분·벡터·극한 제외.",
        "sourceOrigin": "2025 팔마고 2학기 기말 q17 / qid_v1_11c5032f8271bb046040f8c07d6592b45deb004c68e7bea49976813b991e2698 / 원본 Git blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e"
      }
    }
  }
];
