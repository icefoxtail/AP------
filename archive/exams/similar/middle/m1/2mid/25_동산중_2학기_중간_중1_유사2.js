/* 2025 동산중학교 중1 2학기 중간 유사 문서 판본 2. Drive MD 이식 후보; 기존 판본과 에셋 보존. */
window.examTitle = "25_동산중_2학기_중간_중1_유사2";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "소수와 합성수",
    "originalCategory": "소수와 합성수",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소수와 합성수",
      "소수·합성수 판별",
      "객관식"
    ],
    "wide": false,
    "content": "다음 중 소수인 것을 고르시오.",
    "choices": [
      "$7$",
      "$9$",
      "$21$",
      "$49$",
      "$91$"
    ],
    "answer": "①",
    "points": 0,
    "problemTypeKey": "PT_M1_PRIME_COMPOSITE_JUDGMENT",
    "templateKey": "TPL_M1_PRIME_COMPOSITE_JUDGMENT_DIRECT_PRIME_TEST",
    "solution": "소수의 뜻을 이용해 보기 ①~⑤의 수의 약수를 각각 구해 소수인 것을 찾는다.\n소수는 $1$보다 큰 자연수 중에서 $1$과 자기 자신만을 약수로 갖는 수이다.\n① $7$의 약수를 구하면\n$$7 = 1 \\times 7$$\n약수는 $1, 7$의 $2$개뿐이므로 소수이다.\n② $9$의 약수를 구하면\n$$9 = 3 \\times 3$$\n약수는 $1, 3, 9$의 $3$개이므로 합성수이다.\n③ $21$의 약수를 구하면\n$$21 = 3 \\times 7$$\n약수는 $1, 3, 7, 21$의 $4$개이므로 합성수이다.\n④ $49$의 약수를 구하면\n$$49 = 7 \\times 7$$\n약수는 $1, 7, 49$의 $3$개이므로 합성수이다.\n⑤ $91$의 약수를 구하면\n$$91 = 7 \\times 13$$\n약수는 $1, 7, 13, 91$의 $4$개이므로 합성수이다.\n따라서 소수는 $7$이므로 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "1",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "각 수의 약수를 구하여 1과 자기 자신만을 약수로 갖는 소수 7을 판별한다.",
      "decisiveStep": "7의 약수가 1과 7뿐임을 확인하고 나머지 수들의 합성수 분해 식별",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소수와 합성수",
        "l4": "소수·합성수 판별"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_PRIME_COMPOSITE_JUDGMENT",
        "templateKey": "TPL_M1_PRIME_COMPOSITE_JUDGMENT_DIRECT_PRIME_TEST",
        "why": "자연수 목록에서 직접 소수 판별법을 적용하는 기본 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "NONE",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "소수의 정의를 직접 적용하여 선지 중 소수를 가려내는 1단계 기본 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "소수",
          "합성수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "약수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 2,
    "level": "중",
    "category": "소수와 합성수",
    "originalCategory": "소수와 합성수",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소수와 합성수",
      "소수의 성질 활용",
      "객관식"
    ],
    "wide": false,
    "content": "소수와 합성수에 대한 설명으로 옳은 것을 고르시오.",
    "choices": [
      "가장 작은 소수는 $1$이다.",
      "모든 소수는 홀수이다.",
      "합성수의 약수의 개수는 항상 $3$개이다.",
      "$11$의 배수 중에서 소수는 $1$개뿐이다.",
      "두 소수의 합은 항상 짝수이다."
    ],
    "answer": "④",
    "points": 0,
    "problemTypeKey": "PT_M1_PRIME_COMPOSITE_JUDGMENT",
    "templateKey": "TPL_M1_PRIME_COMPOSITE_JUDGMENT_PRIME_COMPOSITE_CLAIM_AUDIT",
    "solution": "소수와 합성수의 성질을 보기 ①~⑤마다 확인해 옳은 설명을 찾는다.\n① $1$은 소수도 합성수도 아니다.\n가장 작은 소수는 $2$이므로 옳지 않다.\n② $2$는 짝수이면서 소수이다.\n모든 소수가 홀수라는 설명은 옳지 않다.\n③ $8$의 약수를 구하면\n$$8 = 2 \\times 2 \\times 2$$\n약수는 $1, 2, 4, 8$의 $4$개이므로 약수의 개수가 항상 $3$개라는 설명은 옳지 않다.\n④ $11$의 배수는 $11, 22, 33, \\cdots$이다.\n이 중 소수는 $11$뿐이고 나머지는 합성수이므로 옳다.\n⑤ $2$와 $3$은 모두 소수이다.\n두 수의 합을 구하면\n$$2 + 3 = 5$$\n$5$는 홀수이므로 두 소수의 합이 항상 짝수라는 설명은 옳지 않다.\n따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "2",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "소수와 합성수의 정의 및 11의 배수 중 소수는 11뿐이라는 배수 성질을 대조한다.",
      "decisiveStep": "11의 배수 중 11 이외의 수는 모두 합성수임을 파악하여 ④의 참 판정",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소수와 합성수",
        "l4": "소수의 성질 활용"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_PRIME_COMPOSITE_JUDGMENT",
        "templateKey": "TPL_M1_PRIME_COMPOSITE_JUDGMENT_PRIME_COMPOSITE_CLAIM_AUDIT",
        "why": "소수와 합성수에 대한 여러 일반 명제의 진위를 검토하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "소수와 합성수의 개념 및 반례(짝수 소수 2 등)를 점검하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "소수",
          "합성수",
          "배수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "약수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 3,
    "level": "하",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "자연수의 소인수분해",
      "객관식"
    ],
    "wide": false,
    "content": "$3^3$은 밑이 $a$이고 지수가 $b$이며 그 값은 $c$이다. 이때 $a+b+c$의 값을 고르시오.",
    "choices": [
      "$15$",
      "$33$",
      "$36$",
      "$57$",
      "$87$"
    ],
    "answer": "②",
    "points": 0,
    "problemTypeKey": "PT_M1_POWER_BASE_EXPONENT_EVALUATION",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "거듭제곱 $3^3$에서 밑 $a$, 지수 $b$, 값 $c$를 각각 구해 $a+b+c$를 계산한다.\n밑과 지수를 확인하면\n$$\n\\begin{aligned}\na &= 3 \\\\\nb &= 3\n\\end{aligned}\n$$\n값 $c$를 구하면\n$$\n\\begin{aligned}\nc &= 3^3 \\\\\n&= 3 \\times 3 \\times 3 \\\\\n&= 27\n\\end{aligned}\n$$\n세 값을 더하면\n$$\n\\begin{aligned}\na+b+c &= 3+3+27 \\\\\n&= 33\n\\end{aligned}\n$$\n따라서 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "3",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "거듭제곱 3^3에서 밑 a=3, 지수 b=3, 계산값 c=27을 구하여 합산한다.",
      "decisiveStep": "밑과 지수를 식별하고 3^3=27 산출 후 3+3+27=33 계산",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "자연수의 소인수분해"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_POWER_BASE_EXPONENT_EVALUATION",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "거듭제곱의 밑, 지수, 결과값을 각각 읽어 결합하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "거듭제곱의 기본 용어와 단순 곱셈 값을 합하는 1단계 계산 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "거듭제곱"
        ],
        "goal": [
          "합"
        ],
        "method": [
          "곱셈"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 4,
    "level": "하",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "자연수의 소인수분해",
      "객관식"
    ],
    "wide": false,
    "content": "$42$를 소인수분해한 것으로 옳은 것을 고르시오.",
    "choices": [
      "$6 \\times 7$",
      "$2 \\times 21$",
      "$2 \\times 3 \\times 7$",
      "$2 \\times 3^2 \\times 7$",
      "$1 \\times 2 \\times 3 \\times 7$"
    ],
    "answer": "③",
    "points": 0,
    "problemTypeKey": "PT_M1_PRIME_FACTORIZATION_JUDGMENT",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "소인수분해의 뜻을 확인하고 $42$를 작은 소수부터 나누어 소인수분해한다.\n소인수분해는 $1$보다 큰 자연수를 소수들만의 곱으로 나타내는 것이다.\n$$\n\\begin{aligned}\n42 &= 2 \\times 21 \\\\\n&= 2 \\times 3 \\times 7\n\\end{aligned}\n$$\n① $6$은 합성수이므로 소인수분해가 아니다.\n② $21$은 합성수이므로 소인수분해가 아니다.\n③ $2 \\times 3 \\times 7$은 $42$를 소수만의 곱으로 나타낸 것이므로 옳다.\n④ $3$을 두 번 곱한 $3^2$이 들어 있어 $42$와 값이 다르다.\n$$2 \\times 3^2 \\times 7 = 126$$\n⑤ $1$은 소수가 아니므로 소인수분해가 아니다.\n따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "4",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "자연수 42를 소수의 거듭제곱 곱 2*3*7로 분해하여 올바른 표현을 찾는다.",
      "decisiveStep": "합성수 인수를 배제하고 2*3*7만을 인수로 갖는 표현 식별",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "자연수의 소인수분해"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_PRIME_FACTORIZATION_JUDGMENT",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "자연수의 올바른 소인수분해 식을 확인하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "NONE",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "자연수의 소인수분해 정의를 직접 확인하는 1단계 기본 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "소인수분해"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "소수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 5,
    "level": "중",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "소인수분해를 이용한 약수의 구조",
      "객관식"
    ],
    "wide": false,
    "content": "$75$와 소인수가 모두 같은 수를 고르시오.",
    "choices": [
      "$24$",
      "$27$",
      "$40$",
      "$42$",
      "$45$"
    ],
    "answer": "⑤",
    "points": 0,
    "problemTypeKey": "PT_M1_PRIME_FACTOR_STRUCTURE",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "$75$를 소인수분해해 소인수를 구하고, 보기 ①~⑤의 수를 각각 소인수분해해 소인수의 구성이 같은 것을 찾는다.\n$$75 = 3 \\times 5^2$$\n① $24$를 소인수분해하면\n$$24 = 2^3 \\times 3$$\n소인수는 $2, 3$이다.\n② $27$을 소인수분해하면\n$$27 = 3^3$$\n소인수는 $3$이다.\n③ $40$을 소인수분해하면\n$$40 = 2^3 \\times 5$$\n소인수는 $2, 5$이다.\n④ $42$를 소인수분해하면\n$$42 = 2 \\times 3 \\times 7$$\n소인수는 $2, 3, 7$이다.\n⑤ $45$를 소인수분해하면\n$$45 = 3^2 \\times 5$$\n소인수는 $3, 5$로 $75$와 모두 같다.\n따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "5",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "75=3*5^2의 소인수 {3,5}를 구하고 선지 중 45=3^2*5의 소인수가 일치함을 판정한다.",
      "decisiveStep": "각 수의 소인수 집합을 대조하여 45의 소인수 집합 {3, 5} 선별",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "소인수분해를 이용한 약수의 구조"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_PRIME_FACTOR_STRUCTURE",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "소인수의 종류가 일치하는 수를 분류하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "자연수를 각각 소인수분해하여 소인수의 구성을 비교하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "소인수",
          "소인수분해"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "소인수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 6,
    "level": "중",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "소인수분해를 이용한 약수의 구조",
      "객관식"
    ],
    "wide": false,
    "content": "보기 중 $2 \\times 3^2 \\times 5$의 약수와 배수를 옳게 짝지은 것을 고르시오.\n\nㄱ. $3^2$ ㄴ. $2 \\times 5$ ㄷ. $3 \\times 7$ ㄹ. $2^2 \\times 3^2 \\times 5$ ㅁ. $2 \\times 3 \\times 5$",
    "choices": [
      "약수: ㄱ / 배수: ㄹ",
      "약수: ㄴ / 배수: ㄹ, ㅁ",
      "약수: ㄱ, ㄴ / 배수: ㅁ",
      "약수: ㄱ, ㄷ / 배수: ㄹ",
      "약수: ㄱ, ㄴ, ㅁ / 배수: ㄹ"
    ],
    "answer": "⑤",
    "points": 0,
    "problemTypeKey": "PT_M1_DIVISOR_MULTIPLE_EXPONENT",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "$2 \\times 3^2 \\times 5$의 소인수 $2, 3, 5$의 지수가 차례로 $1, 2, 1$임을 확인하고, ㄱ~ㅁ의 지수를 비교해 약수와 배수를 가린다.\n곱하지 않은 소인수의 지수는 $0$으로 본다.\nㄱ. $3^2$을 소인수만의 곱으로 나타내면\n$$3^2 = 2^0 \\times 3^2 \\times 5^0$$\n지수는 $0, 2, 0$이고 모두 원래 수의 지수보다 크지 않으므로 약수이다.\nㄴ. $2 \\times 5$를 소인수만의 곱으로 나타내면\n$$2 \\times 5 = 2^1 \\times 3^0 \\times 5^1$$\n지수는 $1, 0, 1$이고 모두 원래 수의 지수보다 크지 않으므로 약수이다.\nㄷ. $3 \\times 7$에서 $7$은 원래 수의 소인수가 아니므로 약수도 배수도 아니다.\nㄹ. $2^2 \\times 3^2 \\times 5$의 지수는 $2, 2, 1$이다.\n모든 지수가 원래 수의 지수보다 작지 않으므로 배수이다.\nㅁ. $2 \\times 3 \\times 5$를 소인수만의 곱으로 나타내면\n$$2 \\times 3 \\times 5 = 2^1 \\times 3^1 \\times 5^1$$\n$3$의 지수가 원래 수의 지수보다 작으므로 배수는 아니고 약수이다.\n따라서 약수는 ㄱ, ㄴ, ㅁ이고 배수는 ㄹ이므로 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "6",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "소인수분해 형태의 각 소인수 지수 대소를 비교하여 약수와 배수를 판별한다.",
      "decisiveStep": "지수 이하 조건으로 약수(ㄱ, ㄴ), 지수 이상 조건으로 배수(ㄹ) 식별",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "소인수분해를 이용한 약수의 구조"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_DIVISOR_MULTIPLE_EXPONENT",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "소인수분해 표기에서 지수 조건을 비교해 약수와 배수를 구별하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "약수와 배수의 지수 조건을 보기별로 나누어 판정하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "소인수분해",
          "약수",
          "배수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "소인수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 7,
    "level": "중",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "소인수분해를 이용한 약수의 구조",
      "객관식"
    ],
    "wide": false,
    "content": "서로 다른 세 소수를 소인수로 갖는 자연수 중에서 두 번째로 작은 수를 구하시오.",
    "choices": [
      "$30$",
      "$42$",
      "$60$",
      "$66$",
      "$70$"
    ],
    "answer": "②",
    "points": 0,
    "problemTypeKey": "PT_M1_PRIME_FACTOR_STRUCTURE",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "서로 다른 세 소수를 소인수로 갖는 자연수를 작은 것부터 차례로 만들어 두 번째로 작은 수를 찾는다.\n가장 작은 소수 세 개를 곱하면\n$$2 \\times 3 \\times 5 = 30$$\n다음으로 작은 수를 만들려면 세 소수 중 가장 큰 $5$를 그다음 소수 $7$로 바꾼다.\n이때 곱이 가장 조금 커진다.\n$$2 \\times 3 \\times 7 = 42$$\n$30$과 $42$ 사이에는 서로 다른 세 소수를 소인수로 갖는 수가 없다.\n다른 후보인 $2 \\times 3 \\times 11 = 66$, $2 \\times 5 \\times 7 = 70$은 모두 $42$보다 크다.\n따라서 두 번째로 작은 수는 $42$이므로 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "7",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "작은 소수들의 곱 2*3*5=30 다음으로 작은 조합 2*3*7=42를 차례로 구성한다.",
      "decisiveStep": "30 다음의 소수 조합 2*3*7=42를 탐색하여 두 번째 수 결정",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "소인수분해를 이용한 약수의 구조"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_PRIME_FACTOR_STRUCTURE",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "소인수 개수 조건에 맞는 수열에서 k번째 수를 찾는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "세 소수의 곱 조합을 크기순으로 나열하여 두 번째 값을 찾는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "소수",
          "소인수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "소수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 8,
    "level": "중",
    "category": "공약수와 최대공약수",
    "originalCategory": "공약수와 최대공약수",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-GCD_LCM",
    "subUnit": "최대공약수와 최소공배수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "공약수와 최대공약수",
      "공약수 조건으로 수 찾기",
      "객관식"
    ],
    "wide": false,
    "content": "두 자리 자연수 중에서 $49$와 서로소인 자연수는 모두 몇 개인지 구하시오.",
    "choices": [
      "$77$개",
      "$78$개",
      "$80$개",
      "$82$개",
      "$84$개"
    ],
    "answer": "①",
    "points": 0,
    "problemTypeKey": "PT_M1_COPRIME_TEST_AND_COUNT",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "두 자리 자연수의 개수에서 $7$의 배수의 개수를 빼서 $49$와 서로소인 수의 개수를 구한다.\n$49$를 소인수분해하면\n$$49 = 7^2$$\n소인수가 $7$뿐이므로 $49$와 서로소인 수는 $7$의 배수가 아닌 수이다.\n두 자리 자연수는 $10$부터 $99$까지이므로 그 개수는\n$$99 - 10 + 1 = 90$$\n두 자리 자연수 중 $7$의 배수는 $14, 21, 28, \\cdots, 98$이므로 그 개수는\n$$\n\\begin{aligned}\n\\dfrac{98-14}{7} + 1 &= 12 + 1 \\\\\n&= 13\n\\end{aligned}\n$$\n$49$와 서로소인 두 자리 자연수의 개수는\n$$\n\\begin{aligned}\n90 - 13 &= 77\n\\end{aligned}\n$$\n따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "8",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-GCD_LCM",
      "conceptClusterKey": "GCD_LCM",
      "primaryMethod": "두 자리 자연수 전체 90개에서 49=7^2의 소인수인 7의 배수 13개를 차감한다.",
      "decisiveStep": "전체 개수 90개 및 7의 배수 13개 산출 후 90-13=77개 도출",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "최대공약수와 최소공배수",
        "l3": "공약수와 최대공약수",
        "l4": "공약수 조건으로 수 찾기"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_COPRIME_TEST_AND_COUNT",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "주어진 범위에서 특정 소수의 거듭제곱과 서로소인 수의 개수를 구하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "서로소 개념을 배수의 여사건 차감으로 연계하는 2단계 계산 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "서로소",
          "배수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "배수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 9,
    "level": "상",
    "category": "최대공약수·최소공배수의 활용",
    "originalCategory": "최대공약수·최소공배수의 활용",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-GCD_LCM",
    "subUnit": "최대공약수와 최소공배수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "최대공약수·최소공배수의 활용",
      "나누어떨어짐 조건",
      "객관식"
    ],
    "wide": false,
    "content": "서로 다른 세 자연수 $28, 70, \\square$의 최대공약수가 $14$이고 최소공배수가 $420$이다. $\\square$가 될 수 있는 수의 개수는?",
    "choices": [
      "$2$개",
      "$3$개",
      "$4$개",
      "$5$개",
      "$6$개"
    ],
    "answer": "③",
    "points": 0,
    "problemTypeKey": "PT_M1_GCD_LCM_EXPONENT_CONSTRAINT",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "세 수의 최대공약수와 최소공배수를 소인수분해로 비교하여 $\\square$가 될 수 있는 수의 개수를 구한다.\n$$\n\\begin{aligned}\n28 &= 2^2 \\times 7 \\\\\n70 &= 2 \\times 5 \\times 7 \\\\\n14 &= 2 \\times 7 \\\\\n420 &= 2^2 \\times 3 \\times 5 \\times 7\n\\end{aligned}\n$$\n최소공배수 $420$의 소인수가 $2, 3, 5, 7$뿐이므로 $\\square$의 소인수도 이 네 수뿐이다.\n$\\square$를 $2^x \\times 3^y \\times 5^z \\times 7^w$ 꼴이라 하자.\n$3$은 $28$과 $70$에 없으므로 최소공배수의 $3^1$을 맞추려면 $y = 1$이어야 한다.\n최대공약수와 최소공배수에 $7$이 $7^1$씩 있으므로 $w = 1$이다.\n최대공약수에서 $2$의 지수는 $1$이고 최소공배수에서 $2$의 지수는 $2$이므로 $x$는 $1$ 또는 $2$이다.\n최소공배수 $420$에 $5^1$이 있으므로 $z$는 $0$ 또는 $1$이다.\n가능한 $\\square$의 개수는 $x$의 $2$가지와 $z$의 $2$가지를 곱한 $4$가지이다.\n$$x=1,\\ z=0 \\text{이면 } \\square = 2 \\times 3 \\times 7 = 42$$\n$$x=1,\\ z=1 \\text{이면 } \\square = 2 \\times 3 \\times 5 \\times 7 = 210$$\n$$x=2,\\ z=0 \\text{이면 } \\square = 2^2 \\times 3 \\times 7 = 84$$\n$$x=2,\\ z=1 \\text{이면 } \\square = 2^2 \\times 3 \\times 5 \\times 7 = 420$$\n이 네 수는 모두 $28$, $70$과 서로 다르므로 세 자연수가 서로 다르다는 조건을 만족한다.\n$\\square$가 될 수 있는 수는 $4$개이다.\n따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "9",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-GCD_LCM",
      "conceptClusterKey": "GCD_LCM",
      "primaryMethod": "gcd(14)와 lcm(420)의 소인수 지수 조건을 분석하여 미지수의 가능한 지수 조합 4개를 산출한다.",
      "decisiveStep": "3의 필수 포함(y=1) 및 x in {1,2}, z in {0,1} 조합으로 4개 수 도출",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "최대공약수와 최소공배수",
        "l3": "최대공약수·최소공배수의 활용",
        "l4": "나누어떨어짐 조건"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_GCD_LCM_EXPONENT_CONSTRAINT",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "소인수 지수의 최댓값과 최솟값 조건으로 미지수의 개수를 구하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "세 수의 소인수분해에서 최대공약수와 최소공배수 지수 제약을 연립 분석하는 3단계 심화 문항",
      "level": "상",
      "item4slot": {
        "given": [
          "최대공약수",
          "최소공배수",
          "소인수분해"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "소인수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 10,
    "level": "하",
    "category": "수 체계",
    "originalCategory": "수 체계",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "수 체계",
      "양수·음수 분류",
      "객관식"
    ],
    "wide": false,
    "content": "영상 $15^\\circ\\text{C}$를 $+15^\\circ\\text{C}$로 나타낼 때, 영하 $8^\\circ\\text{C}$를 부호를 사용하여 바르게 나타낸 것은?",
    "choices": [
      "$+8^\\circ\\text{C}$",
      "$+7^\\circ\\text{C}$",
      "$0^\\circ\\text{C}$",
      "$-7^\\circ\\text{C}$",
      "$-8^\\circ\\text{C}$"
    ],
    "answer": "⑤",
    "points": 0,
    "problemTypeKey": "PT_M1_SIGNED_CHANGE_MODEL",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "solution": "영상 $15^\\circ\\text{C}$를 $+15^\\circ\\text{C}$로 나타낸 방법을 따라 영하 $8^\\circ\\text{C}$를 부호를 사용하여 나타낸다.\n서로 반대되는 성질을 가진 양은 한쪽에 양의 부호 $+$, 다른 쪽에 음의 부호 $-$를 붙여 나타낸다.\n$$\\text{영상 } 15^\\circ\\text{C} = +15^\\circ\\text{C}$$\n$$\\text{영하 } 8^\\circ\\text{C} = -8^\\circ\\text{C}$$\n따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "10",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "영상의 양의 부호에 대응하여 영하를 음의 부호 -8도로 바르게 표기한다.",
      "decisiveStep": "영하 8도에 음의 부호 -를 적용하여 -8도 도출",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수",
        "l3": "수 체계",
        "l4": "양수·음수 분류"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_SIGNED_CHANGE_MODEL",
        "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
        "why": "반대 성질의 수량을 부호 있는 수로 나타내는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "DIRECT",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호의 정의를 실생활 수량에 직접 대응시키는 1단계 기본 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "부호",
          "양수",
          "음수"
        ],
        "goal": [
          "부호"
        ],
        "method": [
          "부호"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 11,
    "level": "하",
    "category": "수 체계",
    "originalCategory": "수 체계",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "수 체계",
      "정수와 유리수의 포함 관계",
      "객관식"
    ],
    "wide": false,
    "content": "정수와 유리수에 대한 설명으로 옳은 것을 고르시오.",
    "choices": [
      "$-\\dfrac{8}{5}$은 정수가 아닌 유리수이다.",
      "$0$은 양의 정수이다.",
      "모든 정수는 자연수이다.",
      "절댓값이 가장 작은 정수는 $1$이다.",
      "$-2$와 $+3$ 사이의 정수는 $3$개이다."
    ],
    "answer": "①",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_PROPERTY_JUDGMENT",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "solution": "정수와 유리수의 뜻과 성질을 보기마다 확인하여 옳은 설명을 고른다.\n① $-\\dfrac{8}{5}$은 분수 꼴로 나타낼 수 있지만 정수가 아니므로 정수가 아닌 유리수라는 설명은 참이다.\n② $0$은 양의 정수도 음의 정수도 아니므로 $0$이 양의 정수라는 설명은 거짓이다.\n③ $0$과 음의 정수는 자연수가 아니므로 모든 정수가 자연수라는 설명은 거짓이다.\n④ 절댓값이 가장 작은 정수는 $0$이므로 $1$이라는 설명은 거짓이다.\n⑤ $-2$와 $+3$ 사이의 정수는 $-1$, $0$, $1$, $2$의 $4$개이므로 $3$개라는 설명은 거짓이다.\n따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "11",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "유리수의 정의와 정수가 아닌 유리수의 분류 기준을 확인한다.",
      "decisiveStep": "-8/5이 정수가 아닌 유리수임을 확인하여 ②의 참 판정",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수",
        "l3": "수 체계",
        "l4": "정수와 유리수의 포함 관계"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_PROPERTY_JUDGMENT",
        "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
        "why": "정수와 유리수의 분류 체계 및 정의 진술을 검토하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "수 체계의 기본 분류(정수, 정수가 아닌 유리수)를 점검하는 1단계 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "정수",
          "유리수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "유리수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 12,
    "level": "중",
    "category": "수직선과 대소 관계",
    "originalCategory": "수직선과 대소 관계",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "수직선과 대소 관계",
      "수직선 위의 수",
      "객관식"
    ],
    "wide": false,
    "content": "수직선 위의 다섯 점 $A, B, C, D, E$에 대응하는 수로 옳지 않은 것은? (단, 점 $A$는 $-3$, 점 $B$는 $-2$와 $-1$ 사이를 3등분하여 $-2$에서 오른쪽 첫 번째 점, 점 $C$는 $-1$과 $0$의 한가운데 점, 점 $D$는 $+1$과 $+2$ 사이를 4등분하여 $+1$에서 오른쪽 셋째 점, 점 $E$는 $+3$에 대응한다.)",
    "choices": [
      "$A : -3$",
      "$B : -\\dfrac{5}{3}$",
      "$C : -\\dfrac{1}{2}$",
      "$D : +\\dfrac{5}{4}$",
      "$E : +3$"
    ],
    "answer": "④",
    "points": 0,
    "problemTypeKey": "PT_COORDINATE_POINT_READING",
    "templateKey": "TPL_COORDINATE_POINT_READING_CORE",
    "solution": "수직선에서 주어진 등분을 이용하여 각 점에 대응하는 수를 구하고 보기와 다른 것을 찾는다.\n점 $A$는 $-3$에 그대로 대응하므로 참이다.\n점 $B$는 $-2$에서 오른쪽으로 $\\dfrac{1}{3}$만큼 간 수이다.\n$$\n\\begin{aligned}\nB &= -2 + \\dfrac{1}{3} \\\\\n&= -\\dfrac{5}{3}\n\\end{aligned}\n$$\n$-\\dfrac{5}{3}$이므로 참이다.\n점 $C$는 $-1$과 $0$의 한가운데인 수이다.\n$$\n\\begin{aligned}\nC &= -1 + \\dfrac{1}{2} \\\\\n&= -\\dfrac{1}{2}\n\\end{aligned}\n$$\n$-\\dfrac{1}{2}$이므로 참이다.\n점 $D$는 $+1$에서 오른쪽으로 $\\dfrac{3}{4}$만큼 간 수이다.\n$$\n\\begin{aligned}\nD &= +1 + \\dfrac{3}{4} \\\\\n&= +\\dfrac{7}{4}\n\\end{aligned}\n$$\n$+\\dfrac{5}{4}$와 다르므로 거짓이다.\n점 $E$는 $+3$에 그대로 대응하므로 참이다.\n따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "12",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "수직선 눈금의 등분 길이를 정수 기준점에 더해 각 점의 유리수 값을 산출한다.",
      "decisiveStep": "점 D의 좌표가 1 + 3/4 = 7/4임을 계산하여 5/4와의 불일치 식별",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수",
        "l3": "수직선과 대소 관계",
        "l4": "수직선 위의 수"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_COORDINATE_POINT_READING",
        "templateKey": "TPL_COORDINATE_POINT_READING_CORE",
        "why": "수직선 위의 점에 대응하는 유리수를 읽고 대조하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "수직선 등분 눈금을 분수로 환산하여 좌표의 참·거짓을 판정하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "수직선",
          "유리수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "수직선"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 13,
    "level": "하",
    "category": "절댓값",
    "originalCategory": "절댓값",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "절댓값",
      "절댓값의 뜻",
      "객관식"
    ],
    "wide": false,
    "content": "절댓값이 같고 부호가 반대인 두 수에 대응하는 두 점 사이의 거리가 $16$일 때, 두 수를 바르게 짝지은 것은?",
    "choices": [
      "$-8, \\ 8$",
      "$-6, \\ 6$",
      "$-4, \\ 4$",
      "$-16, \\ 16$",
      "$-8, \\ 16$"
    ],
    "answer": "①",
    "points": 0,
    "problemTypeKey": "PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "solution": "절댓값이 같고 부호가 반대인 두 수의 절댓값을 구하여 두 수를 짝짓는다.\n절댓값이 같고 부호가 반대인 두 수는 원점에서 서로 반대 방향으로 같은 거리만큼 떨어져 있다.\n두 수의 절댓값을 $k$라 하면 두 수는 $-k$와 $+k$이다.\n$$\n\\begin{aligned}\n\\text{두 점 사이의 거리} &= k + k \\\\\n&= 2k\n\\end{aligned}\n$$\n이 거리가 $16$이므로\n$$2k = 16$$\n$$k = 8$$\n두 수는 $-8$과 $8$이다.\n따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "13",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "절댓값이 같은 두 점 사이의 거리 2k=16에서 절댓값 k=8을 구해 -8과 8을 도출한다.",
      "decisiveStep": "두 점 사이의 거리 2k=16에서 k=8 산출",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수",
        "l3": "절댓값",
        "l4": "절댓값의 뜻"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY",
        "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
        "why": "절댓값이 같은 두 수의 수직선상 거리 조건으로 두 수를 복원하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "DIRECT",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "절댓값의 거리 정의를 수직선상 대칭점에 적용하는 1단계 기본 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "절댓값",
          "수직선"
        ],
        "goal": [
          "유리수"
        ],
        "method": [
          "절댓값"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 14,
    "level": "하",
    "category": "수직선과 대소 관계",
    "originalCategory": "수직선과 대소 관계",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "수직선과 대소 관계",
      "유리수의 대소 비교",
      "객관식"
    ],
    "wide": false,
    "content": "다음 중 두 수의 대소 관계가 옳지 않은 것은?",
    "choices": [
      "$-5 < 0$",
      "$-\\dfrac{1}{2} < \\dfrac{1}{3}$",
      "$0 < +4$",
      "$+2 < +5$",
      "$-3 < -8$"
    ],
    "answer": "⑤",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_VALUE_COMPARISON",
    "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
    "solution": "수직선에서 오른쪽에 있는 수가 더 크다는 성질로 보기마다 대소 관계를 확인한다.\n① $-5 < 0$은 음수가 $0$보다 작으므로 참이다.\n② $-\\dfrac{1}{2} < \\dfrac{1}{3}$은 음수가 양수보다 작으므로 참이다.\n③ $0 < +4$는 $0$이 양수보다 작으므로 참이다.\n④ $+2 < +5$는 양수끼리 절댓값이 큰 수가 크므로 참이다.\n⑤ 음수끼리는 절댓값이 작은 수가 더 크므로 두 수의 절댓값을 비교한다.\n$$|-3| = 3$$\n$$|-8| = 8$$\n절댓값이 작은 $-3$이 더 크므로 $-3 < -8$은 거짓이다.\n따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "14",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "음수끼리는 절댓값이 작은 수가 더 크다는 대소 원리를 적용하여 -8 < -3임을 판별한다.",
      "decisiveStep": "-3 < -8이 잘못된 부등호임을 식별",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수",
        "l3": "수직선과 대소 관계",
        "l4": "유리수의 대소 비교"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_VALUE_COMPARISON",
        "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
        "why": "유리수의 대소 관계 명제를 비교 검토하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호가 있는 두 수의 대소 비교 규칙을 확인하는 1단계 기본 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "유리수",
          "절댓값"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "절댓값"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 15,
    "level": "중",
    "category": "덧셈과 뺄셈",
    "originalCategory": "덧셈과 뺄셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "덧셈과 뺄셈",
      "부호가 있는 수의 뺄셈",
      "객관식"
    ],
    "wide": false,
    "content": "다음 덧셈과 뺄셈의 계산 결과가 옳지 않은 것은?",
    "choices": [
      "$(-7) + (-3) = -10$",
      "$(-5) + (+9) = +4$",
      "$(+6) - (+8) = -2$",
      "$(-5) - (+4) = -1$",
      "$(-3) - (-5) = +2$"
    ],
    "answer": "④",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
    "solution": "정수의 덧셈과 뺄셈 규칙으로 보기마다 계산하여 옳지 않은 것을 찾는다.\n① $(-7) + (-3)$은 부호가 같으므로 절댓값의 합에 $-$를 붙인다.\n$$\n\\begin{aligned}\n(-7) + (-3) &= -(7 + 3) \\\\\n&= -10\n\\end{aligned}\n$$\n$-10$이므로 참이다.\n② $(-5) + (+9)$는 부호가 다르므로 절댓값의 차에 큰 수의 부호를 붙인다.\n$$\n\\begin{aligned}\n(-5) + (+9) &= +(9 - 5) \\\\\n&= +4\n\\end{aligned}\n$$\n$+4$이므로 참이다.\n③ $(+6) - (+8)$은 빼는 수의 부호를 바꾸어 더한다.\n$$\n\\begin{aligned}\n(+6) - (+8) &= (+6) + (-8) \\\\\n&= -2\n\\end{aligned}\n$$\n$-2$이므로 참이다.\n④ $(-5) - (+4)$도 빼는 수의 부호를 바꾸어 더한다.\n$$\n\\begin{aligned}\n(-5) - (+4) &= (-5) + (-4) \\\\\n&= -9\n\\end{aligned}\n$$\n$-1$과 다르므로 거짓이다.\n⑤ $(-3) - (-5)$도 빼는 수의 부호를 바꾸어 더한다.\n$$\n\\begin{aligned}\n(-3) - (-5) &= (-3) + (+5) \\\\\n&= +2\n\\end{aligned}\n$$\n$+2$이므로 참이다.\n따라서 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "15",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "뺄셈을 빼는 수의 부호를 바꾸어 더하는 규칙으로 변환하여 계산 결과를 검증한다.",
      "decisiveStep": "(-5)-(+4) = (-5)+(-4) = -9임을 확인하여 ⑤의 오류 판정",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "덧셈과 뺄셈",
        "l4": "부호가 있는 수의 뺄셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
        "why": "부호가 있는 수의 덧셈·뺄셈 계산 진술을 확인하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호가 있는 두 정수의 덧셈과 뺄셈을 단계별로 검증하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "정수",
          "연산"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "사칙계산"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 16,
    "level": "하",
    "category": "덧셈과 뺄셈",
    "originalCategory": "덧셈과 뺄셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "덧셈과 뺄셈",
      "부호가 있는 수의 뺄셈",
      "객관식"
    ],
    "wide": false,
    "content": "$7 - 25$를 계산한 값을 고르시오.",
    "choices": [
      "$-32$",
      "$-18$",
      "$-16$",
      "$18$",
      "$32$"
    ],
    "answer": "②",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
    "solution": "두 수의 뺄셈을 덧셈으로 바꾸어 $7 - 25$를 계산한다.\n$$\n\\begin{aligned}\n7 - 25 &= (+7) + (-25) \\\\\n&= -(25 - 7) \\\\\n&= -18\n\\end{aligned}\n$$\n따라서 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "16",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "7-25를 절댓값의 차 25-7=18에 음의 부호를 붙여 -18로 계산한다.",
      "decisiveStep": "부호가 다른 두 수의 덧셈 변환으로 -18 산출",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "덧셈과 뺄셈",
        "l4": "부호가 있는 수의 뺄셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
        "why": "두 정수의 단순 뺄셈 결과를 계산하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "DIRECT",
      "difficultyBucket": 1,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호가 있는 두 수의 뺄셈을 직접 수행하는 1단계 계산 문항",
      "level": "하",
      "item4slot": {
        "given": [
          "정수",
          "차"
        ],
        "goal": [
          "정수"
        ],
        "method": [
          "사칙계산"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 17,
    "level": "중",
    "category": "덧셈과 뺄셈",
    "originalCategory": "덧셈과 뺄셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "덧셈과 뺄셈",
      "덧셈·뺄셈 혼합",
      "객관식"
    ],
    "wide": false,
    "content": "$15$보다 $-4$ 큰 수를 $a$, $3$보다 $+8$ 작은 수를 $b$라 할 때, $a - b$의 값을 구하시오.",
    "choices": [
      "$16$",
      "$20$",
      "$22$",
      "$24$",
      "$30$"
    ],
    "answer": "①",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
    "solution": "15보다 $-4$ 큰 수를 $a$, 3보다 $+8$ 작은 수를 $b$라 하고 $a - b$의 값을 구한다.\n$$\n\\begin{aligned}\na &= 15 + (-4) \\\\\n&= 11\n\\end{aligned}\n$$\n$$\n\\begin{aligned}\nb &= 3 - (+8) \\\\\n&= 3 + (-8) \\\\\n&= -5\n\\end{aligned}\n$$\n두 값을 대입하여 $a$에서 $b$를 빼면\n$$\n\\begin{aligned}\na - b &= 11 - (-5) \\\\\n&= 11 + 5 \\\\\n&= 16\n\\end{aligned}\n$$\n따라서 정답은 ①이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "17",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "a=15+(-4)=11과 b=3-(+8)=-5를 구하고 a-b=11-(-5)=16을 계산한다.",
      "decisiveStep": "a=11, b=-5 산출 후 a-b=11+5=16 도출",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "덧셈과 뺄셈",
        "l4": "덧셈·뺄셈 혼합"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
        "why": "문장으로 주어진 수량 관계를 덧셈·뺄셈 식으로 나타내어 차를 구하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "수량 문장을 덧셈과 뺄셈 식으로 모델링하여 차를 구하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "정수",
          "합",
          "차"
        ],
        "goal": [
          "정수"
        ],
        "method": [
          "사칙계산"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 18,
    "level": "중",
    "category": "덧셈과 뺄셈",
    "originalCategory": "덧셈과 뺄셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "덧셈과 뺄셈",
      "부호가 있는 수의 뺄셈",
      "객관식"
    ],
    "wide": false,
    "content": "수직선 위에서 오른쪽 이동을 $+$, 왼쪽 이동을 $-$라 할 때, 다음 설명이 나타내는 수의 연산 원리로 가장 적절한 것을 고르시오.\n\n\"동쪽(양의 방향)으로 가던 자동차의 후진(반대 방향)은 서쪽(음의 방향)으로 전진하는 것과 같고, 서쪽으로 가던 자동차의 후진은 동쪽으로 전진하는 것과 같다.\"",
    "choices": [
      "부호가 같은 두 수의 곱셈은 항상 양수이다.",
      "부호가 다른 두 수의 덧셈은 절댓값의 차를 구한다.",
      "어떤 수에 0을 곱하면 항상 0이 된다.",
      "나눗셈은 나누는 수의 역수를 곱한다.",
      "두 수의 뺄셈은 빼는 수의 부호를 바꾸어 더하는 것과 같다."
    ],
    "answer": "⑤",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_OPERATION_RULE_JUDGMENT",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "solution": "전진은 $+$, 후진은 $-$로 보고 두 문장을 식으로 나타내어 어떤 뺄셈의 원리인지 찾는다.\n동쪽으로 가던 자동차가 후진하면 서쪽으로 전진하므로\n$$\n\\begin{aligned}\n-(+a) &= +(-a)\n\\end{aligned}\n$$\n이다.\n서쪽으로 가던 자동차가 후진하면 동쪽으로 전진하므로\n$$\n\\begin{aligned}\n-(-a) &= +(+a)\n\\end{aligned}\n$$\n이다.\n① 부호가 같은 두 수의 곱셈에 대한 성질이므로 해당하지 않는다.\n② 부호가 다른 두 수의 덧셈에서 절댓값의 차를 구하는 성질이므로 해당하지 않는다.\n③ 어떤 수에 0을 곱하면 0이 되는 성질이므로 해당하지 않는다.\n④ 나눗셈을 나누는 수의 역수의 곱셈으로 바꾸는 성질이므로 해당하지 않는다.\n⑤ 두 식 모두 빼는 수의 부호를 바꾸어 더한 것과 같으므로 뺄셈의 원리를 나타낸다.\n따라서 정답은 ⑤이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "18",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "방향과 전진·후진 모델을 뺄셈과 부호 반전 규칙 -(+a)=+(-a), -(-a)=+(+a)로 해석한다.",
      "decisiveStep": "후진 연산의 부호 반전 효과를 뺄셈의 정의(부호 바꾸어 더하기)로 연결",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "덧셈과 뺄셈",
        "l4": "부호가 있는 수의 뺄셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_OPERATION_RULE_JUDGMENT",
        "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
        "why": "실생활 상황 모델이 나타내는 수의 연산 원리를 판정하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "NONE",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "수학적 연산 법칙(뺄셈)의 실생활 직관적 모델을 해석하는 2단계 개념 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "부호",
          "연산"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "사칙계산"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 19,
    "level": "중",
    "category": "곱셈과 나눗셈",
    "originalCategory": "곱셈과 나눗셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "곱셈과 나눗셈",
      "부호가 있는 수의 나눗셈",
      "객관식"
    ],
    "wide": false,
    "content": "다음 곱셈과 나눗셈의 계산 결과 중 옳지 않은 것을 고르시오.",
    "choices": [
      "$(-8) \\times (-3) = +24$",
      "$(-4) \\times (+7) = -28$",
      "$(-8) \\div \\dfrac{4}{3} = -10$",
      "$(+18) \\div (-6) = -3$",
      "$(-12) \\div (-4) = +3$"
    ],
    "answer": "③",
    "points": 0,
    "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_MIXED_ORDER",
    "solution": "곱셈과 나눗셈의 부호 규칙과 역수 곱셈으로 다섯 보기를 하나씩 확인한다.\n① 부호가 같은 두 수의 곱이므로\n$$\n\\begin{aligned}\n(-8) \\times (-3) &= +(8 \\times 3) \\\\\n&= +24\n\\end{aligned}\n$$\n이므로 ①은 옳다.\n② 부호가 다른 두 수의 곱이므로\n$$\n\\begin{aligned}\n(-4) \\times (+7) &= -(4 \\times 7) \\\\\n&= -28\n\\end{aligned}\n$$\n이므로 ②는 옳다.\n③ 나누는 수의 역수를 곱하여 계산하면\n$$\n\\begin{aligned}\n(-8) \\div \\dfrac{4}{3} &= (-8) \\times \\dfrac{3}{4} \\\\\n&= -6\n\\end{aligned}\n$$\n이므로 계산 결과가 $-10$이 되어 ③은 옳지 않다.\n④ 부호가 다른 두 수의 나눗셈이므로\n$$\n\\begin{aligned}\n(+18) \\div (-6) &= -(18 \\div 6) \\\\\n&= -3\n\\end{aligned}\n$$\n이므로 ④는 옳다.\n⑤ 부호가 같은 두 수의 나눗셈이므로\n$$\n\\begin{aligned}\n(-12) \\div (-4) &= +(12 \\div 4) \\\\\n&= +3\n\\end{aligned}\n$$\n이므로 ⑤는 옳다.\n따라서 정답은 ③이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "19",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "분수 나눗셈을 역수의 곱셈으로 바꾸어 (-8)*(3/4)=-6임을 확인하고 오류를 선별한다.",
      "decisiveStep": "(-8) div (4/3) = (-8)*(3/4) = -6 산출 및 -10과의 불일치 식별",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "곱셈과 나눗셈",
        "l4": "부호가 있는 수의 나눗셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RATIONAL_ARITHMETIC",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_MIXED_ORDER",
        "why": "유리수의 곱셈과 나눗셈 계산 결과의 진위를 검증하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호 규칙과 역수를 이용한 분수 나눗셈을 단계별로 검증하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "유리수",
          "역수"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "곱셈",
          "나눗셈"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 20,
    "level": "중",
    "category": "곱셈과 나눗셈",
    "originalCategory": "곱셈과 나눗셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "곱셈과 나눗셈",
      "부호가 있는 수의 곱셈",
      "객관식"
    ],
    "wide": false,
    "content": "다음 네 유리수 중 서로 다른 두 수를 골라 곱할 때, 그 곱한 결과 중 가장 작은 수는?\n\n$$\\left\\{ +\\dfrac{3}{2}, \\quad -4, \\quad -\\dfrac{1}{3}, \\quad +6 \\right\\}$$",
    "choices": [
      "$-48$",
      "$-36$",
      "$-32$",
      "$-24$",
      "$9$"
    ],
    "answer": "④",
    "points": 0,
    "problemTypeKey": "PT_EXTREME_PRODUCT_FROM_SELECTED_RATIONALS",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_MIXED_ORDER",
    "solution": "곱이 가장 작아지려면 절댓값이 가장 큰 양수와 절댓값이 가장 큰 음수를 곱해야 한다.\n네 수 $+\\dfrac{3}{2}$, $-4$, $-\\dfrac{1}{3}$, $+6$ 중에서 양수는 $+\\dfrac{3}{2}$과 $+6$, 음수는 $-4$와 $-\\dfrac{1}{3}$이다.\n절댓값이 가장 큰 양수는 $+6$이고, 절댓값이 가장 큰 음수는 $-4$이다.\n두 수를 곱하면\n$$\n\\begin{aligned}\n(+6) \\times (-4) &= -24\n\\end{aligned}\n$$\n이다.\n나머지 경우의 곱을 확인하면\n$$\n\\begin{aligned}\n\\dfrac{3}{2} \\times (+6) &= 9 \\\\\n\\dfrac{3}{2} \\times (-4) &= -6 \\\\\n\\dfrac{3}{2} \\times \\left(-\\dfrac{1}{3}\\right) &= -\\dfrac{1}{2} \\\\\n(-4) \\times \\left(-\\dfrac{1}{3}\\right) &= \\dfrac{4}{3} \\\\\n\\left(-\\dfrac{1}{3}\\right) \\times (+6) &= -2\n\\end{aligned}\n$$\n이므로 모두 $-24$보다 크다.\n따라서 가장 작은 수는 $-24$이므로 정답은 ④이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "20",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "곱의 최솟값을 위해 절댓값이 가장 큰 양수 +6과 음수 -4를 곱해 -24를 구한다.",
      "decisiveStep": "음수 곱 조건에서 절댓값 최대 쌍 (+6)*(-4) = -24 도출",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "곱셈과 나눗셈",
        "l4": "부호가 있는 수의 곱셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_EXTREME_PRODUCT_FROM_SELECTED_RATIONALS",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_MIXED_ORDER",
        "why": "유리수 집합에서 조건을 만족하는 극값 곱을 찾는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호와 절댓값의 성질을 결합하여 곱의 최솟값을 탐색하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "유리수",
          "곱"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "절댓값",
          "곱셈"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 21,
    "level": "상",
    "category": "곱셈과 나눗셈",
    "originalCategory": "곱셈과 나눗셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "곱셈과 나눗셈",
      "부호가 있는 수의 곱셈",
      "객관식"
    ],
    "wide": false,
    "content": "세 유리수 $a, b, c$에 대하여 $a \\times b < 0, \\ b \\times c > 0, \\ a - c > 0$일 때, 다음 중 항상 옳은 것은?",
    "choices": [
      "$a + b < 0$",
      "$c - a < 0$",
      "$b + c > 0$",
      "$a \\times c > 0$",
      "$a - b < 0$"
    ],
    "answer": "②",
    "points": 0,
    "problemTypeKey": "PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS",
    "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
    "solution": "곱의 부호와 차의 부호로 세 수 $a$, $b$, $c$의 부호를 차례로 정한다.\n$b \\times c > 0$이므로 $b$와 $c$는 서로 같은 부호이다.\n$a \\times b < 0$이므로 $a$와 $b$는 서로 다른 부호이다.\n그러므로 $a$와 $c$는 서로 다른 부호이다.\n$a - c > 0$이므로\n$$\n\\begin{aligned}\na &> c\n\\end{aligned}\n$$\n이다.\n부호가 다른 두 수에서 큰 수가 양수이므로\n$$\n\\begin{aligned}\na &> 0 \\\\\nc &< 0\n\\end{aligned}\n$$\n이다.\n$b$는 $c$와 부호가 같으므로 $b < 0$이다.\n정리하면 $a > 0$, $b < 0$, $c < 0$이다.\n① $a > 0$, $b < 0$이므로 $a + b$의 부호는 절댓값에 따라 달라진다. 항상 옳지 않다.\n② $c < 0$, $a > 0$이므로 $c - a < 0$이다. 항상 옳다.\n③ $b < 0$, $c < 0$이므로 $b + c < 0$이다. 옳지 않다.\n④ $a > 0$, $c < 0$이므로 $a \\times c < 0$이다. 옳지 않다.\n⑤ $a > 0$, $b < 0$이므로 $a - b > 0$이다. 옳지 않다.\n따라서 정답은 ②이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "21",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "곱의 부호로 동부호/이부호를 판정하고 a-c>0 대소로 a>0, b<0, c<0을 유도한다.",
      "decisiveStep": "a>0, b<0, c<0 확정 후 c-a<0의 항등적 참 식별",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "곱셈과 나눗셈",
        "l4": "부호가 있는 수의 곱셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS",
        "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
        "why": "유리수의 곱과 차 부등식으로부터 부호를 논리적으로 추론하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "세 수의 곱과 차 조건에서 부호를 연립 추론하는 3단계 논리 판정 문항",
      "level": "상",
      "item4slot": {
        "given": [
          "유리수",
          "부호",
          "곱"
        ],
        "goal": [
          "판정"
        ],
        "method": [
          "부호"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 22,
    "level": "중",
    "category": "소인수분해",
    "originalCategory": "소인수분해",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-01",
    "standardUnit": "소인수분해",
    "standardUnitOrder": 1,
    "subUnitKey": "M1-01-PRIME_FACTORIZATION",
    "subUnit": "소인수분해",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "소인수분해",
      "조건을 만족하는 자연수 찾기",
      "객관식"
    ],
    "wide": false,
    "content": "[서술형 1] $28 \\times a$가 어떤 자연수 $b$의 제곱이 되도록 할 때, 자연수 $a, b$의 값 중 두 번째로 작은 값을 각각 구하는 과정을 서술하시오.",
    "choices": [],
    "answer": "$a = 28, \\ b = 28$",
    "points": 0,
    "problemTypeKey": "PT_MINIMUM_FACTOR_TO_PERFECT_SQUARE",
    "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
    "solution": "$28 \\times a$가 어떤 자연수의 제곱이 되도록 하는 $a$의 꼴을 찾고 두 번째로 작은 값을 구한다.\n자연수를 제곱한 수는 소인수분해했을 때 모든 소인수의 지수가 짝수이다.\n$28$을 소인수분해하면\n$$\n\\begin{aligned}\n28 &= 2^2 \\times 7\n\\end{aligned}\n$$\n이다.\n$28 \\times a = 2^2 \\times 7 \\times a$에서 $2$의 지수는 이미 짝수이므로, $7$의 지수를 짝수로 만들기 위해 $a$는 $7$을 홀수 번 곱한 수를 가져야 한다.\n따라서 $a$는 자연수 $k$에 대하여\n$$\n\\begin{aligned}\na &= 7 \\times k^2\n\\end{aligned}\n$$\n의 꼴이다.\n가장 작은 경우는 $k = 1$일 때이므로\n$$\n\\begin{aligned}\na &= 7 \\times 1^2 \\\\\n&= 7\n\\end{aligned}\n$$\n이고\n$$\n\\begin{aligned}\n28 \\times 7 &= 196 \\\\\n&= 14^2\n\\end{aligned}\n$$\n이므로 $b = 14$이다.\n두 번째로 작은 경우는 $k = 2$일 때이므로\n$$\n\\begin{aligned}\na &= 7 \\times 2^2 \\\\\n&= 28\n\\end{aligned}\n$$\n이고\n$$\n\\begin{aligned}\n28 \\times 28 &= 784 \\\\\n&= 28^2\n\\end{aligned}\n$$\n이므로 $b = 28$이다.\n따라서 구하는 두 번째로 작은 값은 $a = 28$, $b = 28$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "22",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-01",
      "subUnitKey": "M1-01-PRIME_FACTORIZATION",
      "conceptClusterKey": "PRIME_FACTORIZATION",
      "primaryMethod": "28=2^2*7에서 a=7*k^2 형태를 유도하고 k=2를 대입해 a=28, b=28을 산출한다.",
      "decisiveStep": "지수 짝수화 조건 a=7*k^2 유도 후 k=2 대입하여 a=28, b=28 계산",
      "rpm": {
        "majorUnit": "소인수분해",
        "midUnit": "소인수분해",
        "l3": "소인수분해",
        "l4": "조건을 만족하는 자연수 찾기"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_MINIMUM_FACTOR_TO_PERFECT_SQUARE",
        "templateKey": "TPL_M1_POWER_BASE_EXPONENT_EVALUATION_CORE",
        "why": "제곱수가 되도록 하는 자연수 인수의 k번째 값을 구하는 서술형 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_NATURAL"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "제곱수 소인수 지수 조건을 모델링하여 두 번째 해를 서술하는 2단계 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "소인수분해",
          "거듭제곱"
        ],
        "goal": [
          "소인수"
        ],
        "method": [
          "소인수"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 23,
    "level": "중",
    "category": "덧셈과 뺄셈",
    "originalCategory": "덧셈과 뺄셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
    "subUnit": "정수와 유리수의 계산",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "덧셈과 뺄셈",
      "덧셈·뺄셈 혼합",
      "객관식"
    ],
    "wide": false,
    "content": "[서술형 2] 어떤 수에 $-\\dfrac{3}{4}$을 더해야 할 것을 잘못하여 뺐더니 $\\dfrac{5}{12}$가 되었다. 어떤 수와 바르게 계산한 값을 구하는 과정을 각각 서술하시오.",
    "choices": [],
    "answer": "어떤 수: $-\\dfrac{1}{3}$, 바르게 계산한 값: $-\\dfrac{13}{12}$",
    "points": 0,
    "problemTypeKey": "PT_M1_RECOVER_VALUE_BY_INVERSE_OPERATION",
    "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
    "solution": "(1) 어떤 수를 $x$라 하고 잘못 계산한 식을 세워 어떤 수를 구한다.\n$$\n\\begin{aligned}\nx - \\left(-\\dfrac{3}{4}\\right) &= \\dfrac{5}{12} \\\\\nx + \\dfrac{3}{4} &= \\dfrac{5}{12}\n\\end{aligned}\n$$\n이므로\n$$\n\\begin{aligned}\nx &= \\dfrac{5}{12} - \\dfrac{3}{4} \\\\\n&= \\dfrac{5}{12} - \\dfrac{9}{12} \\\\\n&= -\\dfrac{4}{12} \\\\\n&= -\\dfrac{1}{3}\n\\end{aligned}\n$$\n이다.\n따라서 어떤 수는 $-\\dfrac{1}{3}$이다.\n(2) 어떤 수 $-\\dfrac{1}{3}$에 $-\\dfrac{3}{4}$을 바르게 더하여 계산한다.\n$$\n\\begin{aligned}\n-\\dfrac{1}{3} + \\left(-\\dfrac{3}{4}\\right) &= -\\dfrac{4}{12} - \\dfrac{9}{12} \\\\\n&= -\\dfrac{13}{12}\n\\end{aligned}\n$$\n따라서 바르게 계산한 값은 $-\\dfrac{13}{12}$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "23",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-RATIONAL_NUMBER_OPERATIONS",
      "conceptClusterKey": "RATIONAL_ARITHMETIC",
      "primaryMethod": "x-(-3/4)=5/12를 풀어 x=-1/3을 구하고 바른 식 x+(-3/4)=-13/12를 산출한다.",
      "decisiveStep": "역산으로 x=-1/3 도출 후 바른 덧셈으로 -13/12 계산",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "덧셈과 뺄셈",
        "l4": "덧셈·뺄셈 혼합"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_M1_RECOVER_VALUE_BY_INVERSE_OPERATION",
        "templateKey": "TPL_M1_RATIONAL_ARITHMETIC_SIGNED_SUM",
        "why": "잘못 적용된 연산에서 역산으로 원래 수를 복원하고 바르게 계산하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "유리수의 뺄셈 역산과 덧셈을 연속 전개하는 2단계 서술형 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "유리수",
          "합",
          "차"
        ],
        "goal": [
          "유리수"
        ],
        "method": [
          "사칙계산"
        ],
        "condition": []
      },
      "hold": ""
    }
  },
  {
    "id": 24,
    "level": "중",
    "category": "곱셈과 나눗셈",
    "originalCategory": "곱셈과 나눗셈",
    "standardCourse": "중1 수학",
    "standardUnitKey": "M1-02",
    "standardUnit": "정수와 유리수",
    "standardUnitOrder": 2,
    "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
    "subUnit": "정수와 유리수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "곱셈과 나눗셈",
      "부호가 있는 수의 곱셈",
      "객관식"
    ],
    "wide": false,
    "content": "[서술형 3] 세 수 $x, y, z$에 대하여 $x - y > 0$, $x \\times z > 0$, $y \\times z < 0$일 때, $x, y, z$의 부호를 각각 판단하고 그 이유를 서술하시오.",
    "choices": [],
    "answer": "$x > 0, \\ y < 0, \\ z > 0$",
    "points": 0,
    "problemTypeKey": "PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS",
    "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
    "solution": "곱의 부호로 세 수의 부호 관계를 좁힌 뒤 차의 부호로 각 수의 부호를 정한다.\n$y \\times z < 0$이므로 $y$와 $z$는 서로 다른 부호이다.\n$x \\times z > 0$이므로 $x$와 $z$는 서로 같은 부호이다.\n그러므로 $x$와 $y$는 서로 다른 부호이다.\n$x - y > 0$이므로\n$$\n\\begin{aligned}\nx &> y\n\\end{aligned}\n$$\n이다.\n부호가 다른 두 수에서 큰 쪽이 양수이므로\n$$\n\\begin{aligned}\nx &> 0 \\\\\ny &< 0\n\\end{aligned}\n$$\n이다.\n$z$는 $x$와 부호가 같으므로\n$$\n\\begin{aligned}\nz &> 0\n\\end{aligned}\n$$\n이다.\n따라서 $x > 0$, $y < 0$, $z > 0$이다.",
    "reviewStatus": "UNREVIEWED",
    "solutionStatus": "UNREVIEWED",
    "pipelineState": "READY_FOR_INDEPENDENT_REVIEW",
    "candidateMetadata": {
      "sourceQid": "24",
      "variationType": "STRICT_VARIANT",
      "standardCourse": "중1",
      "courseKey": "MID-MATH-1",
      "curriculum": "2022",
      "standardUnitKey": "M1-02",
      "subUnitKey": "M1-02-INTEGER_RATIONAL_NUMBER",
      "conceptClusterKey": "INTEGER_RATIONAL",
      "primaryMethod": "곱의 부호로 x와 z 동부호, y와 z 이부호를 밝히고 x-y>0으로 x>0, y<0, z>0을 서술한다.",
      "decisiveStep": "x와 y의 이부호성 및 x>y 대소로부터 x>0, y<0, z>0 확정",
      "rpm": {
        "majorUnit": "정수와 유리수",
        "midUnit": "정수와 유리수의 계산",
        "l3": "곱셈과 나눗셈",
        "l4": "부호가 있는 수의 곱셈"
      },
      "ptTplCandidate": {
        "problemTypeKey": "PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS",
        "templateKey": "TPL_M1_RATIONAL_VALUE_COMPARISON_SIGNED_NUMBER_ORDER",
        "why": "곱과 차의 부호 조건에서 부호를 연역적으로 서술하는 템플릿"
      },
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "difficultyReason": "부호의 곱셈 성질과 대소 관계를 논리적인 문장으로 증명 서술하는 2단계 서술형 문항",
      "level": "중",
      "item4slot": {
        "given": [
          "유리수",
          "부호",
          "곱"
        ],
        "goal": [
          "부호"
        ],
        "method": [
          "부호"
        ],
        "condition": []
      },
      "hold": ""
    }
  }
];
