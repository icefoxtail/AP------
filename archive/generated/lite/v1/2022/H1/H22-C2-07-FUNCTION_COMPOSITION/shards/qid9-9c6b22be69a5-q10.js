window.examTitle = "QID9_25_순천고_2학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-A1",
    "sourceQid": 10,
    "slot": "A1",
    "purpose": "A",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=c$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-A1-problem.svg",
    "imageSize": "large",
    "choices": [
      "$d$",
      "$b$",
      "$c$",
      "$a$",
      "$e$"
    ],
    "answer": "④",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=a$에서 $a$ → $b$ → $c$로 이동하므로 2번 적용한 최종 함숫값은 $c$이다. 또한 $f$가 실수 전체에서 증가하므로 합성함수 $f\\circ f$도 증가한다. 따라서 다른 입력의 합성값은 목표값과 같을 수 없다. 따라서 $k=a$이고 정답은 ④이다.",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 1,
      "difficultyReason": "두 단계의 증가 함수 연쇄 추적",
      "crossConceptKeys": [
        "CC_FUNCTION_MONOTONICITY"
      ],
      "crossConceptReasons": [
        "전 구간 증가함수의 합성은 증가함수이므로 보기에 제시되지 않은 중간 입력에서도 정답이 유일함"
      ],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "두 단계의 증가 함수 연쇄 추적"
    },
    "review": {
      "reverseStemDisposition": "REVISED",
      "reverseStemFinding": "전 구간의 증가 조건을 발문에 명시하여 그림 밖 함숫값으로 인한 답 유일성 문제를 제거함",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=c$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-A1-v2",
      "distractors": [
        {
          "choice": "②",
          "choiceValue": "$b$",
          "derivation": "$k=b$는 올바른 입력 $a$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$는 올바른 입력 $a$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "①",
          "choiceValue": "$d$",
          "derivation": "$k=d$는 올바른 입력 $a$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$는 올바른 입력 $a$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v2",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-A1-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "EXEMPT",
        "reason": "원본 그래프의 점선만으로 합성 2단계 충분히 읽음"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 2,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-A2",
    "sourceQid": 10,
    "slot": "A2",
    "purpose": "A",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=a$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-A2-problem.svg",
    "imageSize": "large",
    "choices": [
      "$c$",
      "$b$",
      "$a$",
      "$d$",
      "$e$"
    ],
    "answer": "①",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=c$에서 $c$ → $b$ → $a$로 이동하므로 2번 적용한 최종 함숫값은 $a$이다. 또한 $f$가 실수 전체에서 증가하므로 합성함수 $f\\circ f$도 증가한다. 따라서 다른 입력의 합성값은 목표값과 같을 수 없다. 따라서 $k=c$이고 정답은 ①이다.",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 2,
      "difficultyReason": "직선 y=x 아래의 증가 그래프에서 두 단계 합성값 역추적",
      "crossConceptKeys": [
        "CC_FUNCTION_MONOTONICITY"
      ],
      "crossConceptReasons": [
        "전 구간 증가함수의 합성은 증가함수이므로 보기에 제시되지 않은 중간 입력에서도 정답이 유일함"
      ],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "증가함수의 합성 2회 추적이며 기존 '감소 함수' 서술은 잘못됨"
    },
    "review": {
      "reverseStemDisposition": "REVISED",
      "reverseStemFinding": "전 구간의 증가 조건을 발문에 명시하여 그림 밖 함숫값으로 인한 답 유일성 문제를 제거함",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=a$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-A2-v2",
      "distractors": [
        {
          "choice": "③",
          "choiceValue": "$a$",
          "derivation": "$k=a$는 올바른 입력 $c$보다 작은 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 작다."
        },
        {
          "choice": "②",
          "choiceValue": "$b$",
          "derivation": "$k=b$는 올바른 입력 $c$보다 작은 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 작다."
        },
        {
          "choice": "④",
          "choiceValue": "$d$",
          "derivation": "$k=d$는 올바른 입력 $c$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$는 올바른 입력 $c$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v2",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-A2-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "EXEMPT",
        "reason": "원본 그래프의 점선만으로 합성 2단계 충분히 읽음"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 3,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-A3",
    "sourceQid": 10,
    "slot": "A3",
    "purpose": "A",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-A3-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$e$",
      "$c$",
      "$d$",
      "$b$"
    ],
    "answer": "⑤",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=b$에서 $b$ → $c$ → $d$로 이동하므로 2번 적용한 최종 함숫값은 $d$이다. 또한 $f$가 실수 전체에서 증가하므로 합성함수 $f\\circ f$도 증가한다. 따라서 다른 입력의 합성값은 목표값과 같을 수 없다. 따라서 $k=b$이고 정답은 ⑤이다.",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 2,
      "difficultyReason": "목표 출력이 달라진 합성함수 그래프",
      "crossConceptKeys": [
        "CC_FUNCTION_MONOTONICITY"
      ],
      "crossConceptReasons": [
        "전 구간 증가함수의 합성은 증가함수이므로 보기에 제시되지 않은 중간 입력에서도 정답이 유일함"
      ],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "목표 출력이 달라진 합성함수 그래프"
    },
    "review": {
      "reverseStemDisposition": "REVISED",
      "reverseStemFinding": "전 구간의 증가 조건을 발문에 명시하여 그림 밖 함숫값으로 인한 답 유일성 문제를 제거함",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "실수 전체에서 증가하는 함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-A3-v2",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$는 올바른 입력 $b$보다 작은 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 작다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$는 올바른 입력 $b$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "④",
          "choiceValue": "$d$",
          "derivation": "$k=d$는 올바른 입력 $b$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        },
        {
          "choice": "②",
          "choiceValue": "$e$",
          "derivation": "$k=e$는 올바른 입력 $b$보다 큰 값이다. $f$가 전 구간에서 증가하므로 $f\\circ f$ 역시 증가하여 이 선지의 합성값은 목표값보다 크다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v2",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-A3-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "EXEMPT",
        "reason": "원본 그래프의 점선만으로 합성 2단계 충분히 읽음"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 4,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-B1",
    "sourceQid": 10,
    "slot": "B1",
    "purpose": "B",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B1-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$d$",
      "$c$",
      "$b$",
      "$e$"
    ],
    "answer": "②",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=d$에서 $d$ → $b$ → $d$로 이동하므로 2번 적용한 최종 함숫값은 $d$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=d$이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B1-solution.svg",
    "solutionImageAlt": "B1 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "감소함수를 두 번 적용하는 합성 구조",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "감소함수를 두 번 적용하는 합성 구조"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-B1-v1",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$일 때 $a$ → $e$ → $a$로 2번 함수를 적용한다. 마지막 값 $a$는 목표 $d$와 다르다."
        },
        {
          "choice": "④",
          "choiceValue": "$b$",
          "derivation": "$k=b$일 때 $b$ → $d$ → $b$로 2번 함수를 적용한다. 마지막 값 $b$는 목표 $d$와 다르다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$일 때 $c$ → $c$ → $c$로 2번 함수를 적용한다. 마지막 값 $c$는 목표 $d$와 다르다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$일 때 $e$ → $a$ → $e$로 2번 함수를 적용한다. 마지막 값 $e$는 목표 $d$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B1-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B1-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 5,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-B2",
    "sourceQid": 10,
    "slot": "B2",
    "purpose": "B",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=b$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B2-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$b$",
      "$e$",
      "$d$",
      "$c$"
    ],
    "answer": "③",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=e$에서 $e$ → $d$ → $b$로 이동하므로 2번 적용한 최종 함숫값은 $b$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=e$이고 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B2-solution.svg",
    "solutionImageAlt": "B2 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "비단조함수의 이차 합성",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "비단조함수의 이차 합성"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=b$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-B2-v1",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$일 때 $a$ → $c$ → $e$로 2번 함수를 적용한다. 마지막 값 $e$는 목표 $b$와 다르다."
        },
        {
          "choice": "②",
          "choiceValue": "$b$",
          "derivation": "$k=b$일 때 $b$ → $a$ → $c$로 2번 함수를 적용한다. 마지막 값 $c$는 목표 $b$와 다르다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$c$",
          "derivation": "$k=c$일 때 $c$ → $e$ → $d$로 2번 함수를 적용한다. 마지막 값 $d$는 목표 $b$와 다르다."
        },
        {
          "choice": "④",
          "choiceValue": "$d$",
          "derivation": "$k=d$일 때 $d$ → $b$ → $a$로 2번 함수를 적용한다. 마지막 값 $a$는 목표 $b$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B2-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B2-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 6,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-B3",
    "sourceQid": 10,
    "slot": "B3",
    "purpose": "B",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=b$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B3-problem.svg",
    "imageSize": "large",
    "choices": [
      "$d$",
      "$b$",
      "$c$",
      "$a$",
      "$e$"
    ],
    "answer": "④",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=a$에서 $a$ → $c$ → $e$ → $b$로 이동하므로 3번 적용한 최종 함숫값은 $b$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=a$이고 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-B3-solution.svg",
    "solutionImageAlt": "B3 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "비단조함수의 삼차 합성",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "비단조함수의 삼차 합성"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=b$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-B3-v1",
      "distractors": [
        {
          "choice": "②",
          "choiceValue": "$b$",
          "derivation": "$k=b$일 때 $b$ → $d$ → $a$ → $c$로 3번 함수를 적용한다. 마지막 값 $c$는 목표 $b$와 다르다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$일 때 $c$ → $e$ → $b$ → $d$로 3번 함수를 적용한다. 마지막 값 $d$는 목표 $b$와 다르다."
        },
        {
          "choice": "①",
          "choiceValue": "$d$",
          "derivation": "$k=d$일 때 $d$ → $a$ → $c$ → $e$로 3번 함수를 적용한다. 마지막 값 $e$는 목표 $b$와 다르다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$일 때 $e$ → $b$ → $d$ → $a$로 3번 함수를 적용한다. 마지막 값 $a$는 목표 $b$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B3-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-B3-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "independentLearningLevelBasis": "기계적 A/B/C 등급보다 실제 풀이의 개념결합·분기·검산 단계로 재판정",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 7,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-C1",
    "sourceQid": 10,
    "slot": "C1",
    "purpose": "C",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C1-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$b$",
      "$c$",
      "$d$",
      "$e$"
    ],
    "answer": "③",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=c$에서 $c$ → $a$ → $b$ → $d$로 이동하므로 3번 적용한 최종 함숫값은 $d$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=c$이고 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C1-solution.svg",
    "solutionImageAlt": "C1 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "삼단계 합성의 역추적",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "삼단계 합성의 역추적"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=d$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-C1-v1",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$일 때 $a$ → $b$ → $d$ → $e$로 3번 함수를 적용한다. 마지막 값 $e$는 목표 $d$와 다르다."
        },
        {
          "choice": "②",
          "choiceValue": "$b$",
          "derivation": "$k=b$일 때 $b$ → $d$ → $e$ → $c$로 3번 함수를 적용한다. 마지막 값 $c$는 목표 $d$와 다르다."
        },
        {
          "choice": "④",
          "choiceValue": "$d$",
          "derivation": "$k=d$일 때 $d$ → $e$ → $c$ → $a$로 3번 함수를 적용한다. 마지막 값 $a$는 목표 $d$와 다르다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$일 때 $e$ → $c$ → $a$ → $b$로 3번 함수를 적용한다. 마지막 값 $b$는 목표 $d$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C1-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C1-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "independentLearningLevelBasis": "기계적 A/B/C 등급보다 실제 풀이의 개념결합·분기·검산 단계로 재판정",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 8,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-C2",
    "sourceQid": 10,
    "slot": "C2",
    "purpose": "C",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=f(e)$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C2-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$d$",
      "$c$",
      "$b$",
      "$e$"
    ],
    "answer": "②",
    "solution": "먼저 그래프에서 $f(e)=a$를 확인한다. 함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=d$에서 $d$ → $e$ → $a$로 이동하므로 2번 적용한 최종 함숫값은 $a$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=d$이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C2-solution.svg",
    "solutionImageAlt": "C2 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "먼저 목표 f(e)를 계산하는 합성",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "INTERDEPENDENT",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "먼저 목표 f(e)를 계산하는 합성"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f)(k)=f(e)$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-C2-v1",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$일 때 $a$ → $b$ → $c$로 2번 함수를 적용한다. 마지막 값 $c$는 목표 $a$와 다르다."
        },
        {
          "choice": "④",
          "choiceValue": "$b$",
          "derivation": "$k=b$일 때 $b$ → $c$ → $d$로 2번 함수를 적용한다. 마지막 값 $d$는 목표 $a$와 다르다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$일 때 $c$ → $d$ → $e$로 2번 함수를 적용한다. 마지막 값 $e$는 목표 $a$와 다르다."
        },
        {
          "choice": "⑤",
          "choiceValue": "$e$",
          "derivation": "$k=e$일 때 $e$ → $a$ → $b$로 2번 함수를 적용한다. 마지막 값 $b$는 목표 $a$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C2-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C2-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "independentLearningLevelBasis": "기계적 A/B/C 등급보다 실제 풀이의 개념결합·분기·검산 단계로 재판정",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  },
  {
    "id": 9,
    "uid": "ALITE-SUNCHEON25-2FINAL-Q10-C3",
    "sourceQid": 10,
    "slot": "C3",
    "purpose": "C",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "함수",
    "originalCategory": "합성함수의 그래프 해석",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "subUnitConfidence": "content_verified",
    "subUnitClassificationDepth": "complete_category",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프",
      "합성함수"
    ],
    "wide": false,
    "content": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=c$를 만족하는 $k$를 고르면?",
    "image": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C3-problem.svg",
    "imageSize": "large",
    "choices": [
      "$a$",
      "$e$",
      "$c$",
      "$d$",
      "$b$"
    ],
    "answer": "⑤",
    "solution": "함수의 그래프에서 점선을 따라 입력과 출력을 읽는다. $k=b$에서 $b$ → $a$ → $d$ → $c$로 이동하므로 3번 적용한 최종 함숫값은 $c$이다. 나머지 네 선지의 실제 합성 결과는 목표값과 다르다. 따라서 $k=b$이고 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-SUNCHEON25-2FINAL-Q10-C3-solution.svg",
    "solutionImageAlt": "C3 합성함수 반복 적용의 입력·출력 경로",
    "solutionImageCaption": "함수값을 순서대로 따라가며 계산한 결과",
    "solutionImageSize": "medium",
    "meta": {
      "rpmL1": "함수",
      "rpmL2": "함수",
      "primaryRPM_L3": "합성함수",
      "primaryRPM_L3SemanticPath": "2022/high/공통수학2/함수/함수/합성함수",
      "primaryRPM_L3Lock": "FROZEN",
      "primaryRPM_L3NumericID": "H1-RPM-253",
      "rpmL4SemanticLabel": "합성함수 계산",
      "rpmRecordId": "H1-RPM-253",
      "rpmRecordIdSemantics": "RPM_L3_L4_PATH_RECORD_ID",
      "rpmRecordMappingStatus": "DIRECT_ACTIVE",
      "rpmRecordCrosswalkBlobSha": "904b3768b69b300607e52217cad05bf71e34f221",
      "problemTypeKey": "PT_COMPOSITION_EVALUATION",
      "templateKey": "TPL_COMPOSITION_VALUE_DIRECT",
      "PTTPLBinding": "ACTIVE_CURRENT",
      "difficultyBucket": 3,
      "difficultyReason": "삼단계 합성의 단계 누락 방지",
      "crossConceptKeys": [],
      "crossConceptReasons": [],
      "conditionKeys": [],
      "conditionSemantics": [],
      "conditionKeyStatus": "RESOLVED_CANONICAL_OR_NOT_APPLICABLE",
      "conditionKeyBinding": "ACTIVE_CONDITION_CORE",
      "integrationPattern": "SEQUENTIAL",
      "integrationPatternStatus": "SEMANTIC_DESCRIPTION_ONLY",
      "integrationPatternReason": "삼단계 합성의 단계 누락 방지"
    },
    "review": {
      "reverseStemDisposition": "KEEP",
      "reverseStemFinding": "두 번 이상 함숫값을 적용해야 정답 결정",
      "studentMentalPath": "그래프에서 점선·중간 함숫값·최종값 순서로 추적",
      "primaryL3Necessity": "한 번의 함수값 계산으로는 정답을 구할 수 없고 합성 단계가 필요함",
      "finalStudentStem": "함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때, $(f\\circ f\\circ f)(k)=c$를 만족하는 $k$를 고르면?",
      "finalCandidateSnapshot": "SUN-Q10-C3-v1",
      "distractors": [
        {
          "choice": "①",
          "choiceValue": "$a$",
          "derivation": "$k=a$일 때 $a$ → $d$ → $c$ → $e$로 3번 함수를 적용한다. 마지막 값 $e$는 목표 $c$와 다르다."
        },
        {
          "choice": "③",
          "choiceValue": "$c$",
          "derivation": "$k=c$일 때 $c$ → $e$ → $b$ → $a$로 3번 함수를 적용한다. 마지막 값 $a$는 목표 $c$와 다르다."
        },
        {
          "choice": "④",
          "choiceValue": "$d$",
          "derivation": "$k=d$일 때 $d$ → $c$ → $e$ → $b$로 3번 함수를 적용한다. 마지막 값 $b$는 목표 $c$와 다르다."
        },
        {
          "choice": "②",
          "choiceValue": "$e$",
          "derivation": "$k=e$일 때 $e$ → $b$ → $a$ → $d$로 3번 함수를 적용한다. 마지막 값 $d$는 목표 $c$와 다르다."
        }
      ],
      "wrongRouteCoverage": "4/4_FULL_FIVE_CHOICE_EVALUATION",
      "answerUniqueness": "UNIQUE_VERIFIED_5_OF_5",
      "evidenceFreshness": "CURRENT_CANDIDATE_v1",
      "problemVisual": {
        "decision": "SVG_PROBLEM_REQUIRED",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C3-problem.svg",
        "reason": "그래프의 대응이 문제 조건이므로 그림 없이는 답을 알 수 없음",
        "sourcePNGProtected": true
      },
      "solutionVisual": {
        "decision": "ADD_NEW_VISUAL",
        "assetPath": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_순천고_2학기_기말_고1/assets/q10-C3-solution.svg",
        "reason": "그래프에 없는 합성값 추적 순서를 새 화살표 흐름으로 표시"
      },
      "authorMathCheck": "AUTHOR_FIVE_CHOICES_RECOMPUTED",
      "independentQualityReview": "NOT_RUN",
      "browserRender": "NOT_RUN",
      "remainingRisk": "FORMAL_OPEN_BOOK_REVIEW_PENDING",
      "independentLearningLevelBasis": "기계적 A/B/C 등급보다 실제 풀이의 개념결합·분기·검산 단계로 재판정",
      "gptOpenBookContentReview": "STEM_OPTIONS_ANSWER_SOLUTION_TRACED",
      "gptOpenBookMathResult": "NO_CONFIRMED_MATH_ANSWER_CONFLICT",
      "releaseBrowserVerification": "NOT_TESTED"
    },
    "sourceExamPath": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
    "sourceExamBlobSha": "6159f478e8e3edf7074d3967ba1cb7456f7762a3",
    "sourceArchiveFile": "archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js"
  }
];
