window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q12-A1",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "$a\\gt b\\gt0$일 때 $\\sqrt{a-b}\\gt\\sqrt a-\\sqrt b$임을 증명하는 과정이다. (가), (나)에 들어갈 식을 차례로 나열한 것은?<div class=\"question-note-box\" style=\"border:1px solid #444;padding:8px 10px;margin-top:8px;line-height:1.7\">$(\\sqrt{a-b})^2-(\\sqrt a-\\sqrt b)^2=$ (가) $-2b=2\\sqrt b\\cdot$ (나) $\\gt0$</div>",
    "choices": [
      "$(\\sqrt{ab},\\ \\sqrt a-\\sqrt b)$",
      "$(2\\sqrt{ab},\\ \\sqrt a+\\sqrt b)$",
      "$(2ab,\\ \\sqrt a-\\sqrt b)$",
      "$(2\\sqrt{ab},\\ a-b)$",
      "$(2\\sqrt{ab},\\ \\sqrt a-\\sqrt b)$"
    ],
    "answer": "⑤",
    "solution": "$a>b>0$이므로 $\\sqrt{a-b}$와 $\\sqrt a-\\sqrt b$는 모두 양수이다. 따라서 제곱의 차를 계산한다.\n$(\\sqrt{a-b})^2-(\\sqrt a-\\sqrt b)^2=(a-b)-(a+b-2\\sqrt{ab})$\n$=2\\sqrt{ab}-2b=2\\sqrt b(\\sqrt a-\\sqrt b)>0$이다.\n따라서 (가)는 $2\\sqrt{ab}$, (나)는 $\\sqrt a-\\sqrt b$이다. 두 수가 양수이므로 제곱이 큰 쪽이 원래도 더 크다.\n따라서 정답은 ⑤이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_POSITIVE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "SEQUENTIAL: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "양수 확인→근호의 제곱 전개→양의 인수분해가 필요하다.",
        "assessmentBucket": "교차항 계수·인수의 부호·근호 곱셈이 함정이다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q12-A2",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "$a\\gt3b\\gt0$일 때 $\\sqrt{a-3b}\\gt\\sqrt a-\\sqrt{3b}$임을 증명하려고 한다. 다음 (가), (나)에 들어갈 식은?<div class=\"question-note-box\" style=\"border:1px solid #444;padding:8px 10px;margin-top:8px;line-height:1.7\">$(\\sqrt{a-3b})^2-(\\sqrt a-\\sqrt{3b})^2=$ (가) $-6b=2\\sqrt{3b}\\cdot$ (나) $\\gt0$</div>",
    "choices": [
      "$(2\\sqrt{3ab},\\ \\sqrt a+\\sqrt{3b})$",
      "$(\\sqrt{3ab},\\ \\sqrt a-\\sqrt{3b})$",
      "$(6\\sqrt{ab},\\ \\sqrt a-\\sqrt{3b})$",
      "$(2\\sqrt{ab},\\ \\sqrt a-\\sqrt{3b})$",
      "$(2\\sqrt{3ab},\\ \\sqrt a-\\sqrt{3b})$"
    ],
    "answer": "⑤",
    "solution": "$a>3b>0$이므로 $\\sqrt{a-3b}$와 $\\sqrt a-\\sqrt{3b}$는 양수이다.\n제곱의 차는 $(a-3b)-(a+3b-2\\sqrt{3ab})$\n$=2\\sqrt{3ab}-6b=2\\sqrt{3b}(\\sqrt a-\\sqrt{3b})>0$이다.\n따라서 (가)는 $2\\sqrt{3ab}$, (나)는 $\\sqrt a-\\sqrt{3b}$이다. 제곱의 차가 양수이므로 원래의 두 양수 사이에도 주어진 부등식이 성립한다.\n따라서 정답은 ⑤이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_POSITIVE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "SEQUENTIAL: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "원본 제곱 비교를 3b로 확장하여 교차항과 인수분해의 계수를 조정한다.",
        "assessmentBucket": "근호 속 3과 밖의 2를 혼동할 위험이 있다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q12-A3",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "$a\\gt b\\gt0$일 때 $\\sqrt{a^2-b^2}\\gt a-b$를 증명한다. 다음 (가), (나)에 들어갈 식은?<div class=\"question-note-box\" style=\"border:1px solid #444;padding:8px 10px;margin-top:8px;line-height:1.7\">$(\\sqrt{a^2-b^2})^2-(a-b)^2=$ (가) $-2b^2=2b\\cdot$ (나) $\\gt0$</div>",
    "choices": [
      "$(2ab,\\ a-b)$",
      "$(2ab,\\ a+b)$",
      "$(ab,\\ a-b)$",
      "$(2a^2b,\\ a-b)$",
      "$(2ab,\\ a-2b)$"
    ],
    "answer": "①",
    "solution": "$a>b>0$이므로 $\\sqrt{a^2-b^2}$와 $a-b$는 모두 양수이다.\n제곱의 차를 전개하면 $(a^2-b^2)-(a-b)^2$\n$=a^2-b^2-(a^2-2ab+b^2)$\n$=2ab-2b^2=2b(a-b)>0$이다.\n따라서 (가)는 $2ab$, (나)는 $a-b$이다. 두 양수의 제곱의 차가 양수이므로 원래 부등식도 성립한다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_POLYNOMIAL_FACTORIZATION"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_POLYNOMIAL_FACTORIZATION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_POSITIVE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "SEQUENTIAL: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "다항식의 제곱 전개와 근호 대소 증명을 연결한다.",
        "assessmentBucket": "제곱과 인수분해 중 부호·계수 오류 가능성이 있다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q12-B1",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "중",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "실수 $a\\ge b\\ge0$에서 $\\sqrt{a-b}\\ge\\sqrt a-\\sqrt b$이다. 등호가 성립하는 경우를 빠짐없이 나타낸 것은?",
    "choices": [
      "$a=b$ 또는 $b=0$",
      "$a=b>0$인 경우만",
      "$a>b>0$인 모든 경우",
      "$a=0$ 또는 $b=0$",
      "$a=2b>0$인 경우"
    ],
    "answer": "①",
    "solution": "$a\\ge b\\ge0$이면 두 비교 대상 $\\sqrt{a-b}$와 $\\sqrt a-\\sqrt b$는 모두 음이 아니다.\n제곱의 차는 $(a-b)-(\\sqrt a-\\sqrt b)^2$\n$=2\\sqrt b(\\sqrt a-\\sqrt b)\\ge0$이다.\n등호는 이 곱이 $0$일 때 성립하므로 $\\sqrt b=0$ 또는 $\\sqrt a-\\sqrt b=0$이어야 한다.\n따라서 $b=0$ 또는 $a=b$이다. 어느 경우도 원래 두 수가 음이 아니므로 실제로 등호가 성립한다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "RANGE_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "CASE_BRANCH: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "제곱 차가 0이 되는 두 인수를 나누어 판단한다.",
        "assessmentBucket": "등호에 a=b와 b=0이 모두 포함되어야 하는 경계 함정이 있다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q12-B2",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "하",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "양수 $a,b$에 대하여 $P=\\sqrt{a+b}$, $Q=\\sqrt a+\\sqrt b$라 하자. $P,Q$의 대소 관계와 $Q^2-P^2$의 값을 올바르게 짝 지은 것은?",
    "choices": [
      "$P\\gt Q,\\ Q^2-P^2=2\\sqrt{ab}$",
      "$P\\lt Q,\\ Q^2-P^2=\\sqrt{ab}$",
      "$P\\lt Q,\\ Q^2-P^2=2\\sqrt{ab}$",
      "$P=Q,\\ Q^2-P^2=0$",
      "$P\\lt Q,\\ Q^2-P^2=2ab$"
    ],
    "answer": "③",
    "solution": "$a,b>0$이므로 $P=\\sqrt{a+b}$와 $Q=\\sqrt a+\\sqrt b$는 양수이다.\n$Q^2=a+b+2\\sqrt{ab}$, $P^2=a+b$이다.\n따라서 $Q^2-P^2=2\\sqrt{ab}>0$이므로 $Q^2>P^2$이다.\n양수끼리의 대소이므로 $Q>P$, 즉 $P<Q$이다.\n따라서 정답은 ③이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_POSITIVE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "SEQUENTIAL: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "양의 두 제곱식 차이 한 번의 전개로 대소를 판단한다.",
        "assessmentBucket": "교차항 오류 외에 별도의 범위 분기가 없다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q12-B3",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "중",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명"
    ],
    "wide": false,
    "content": "$a\\gt b\\gt0$일 때 $\\sqrt{a-b}+\\sqrt b\\gt\\sqrt a$를 제곱의 차로 증명한다. 다음 빈칸에 들어갈 식은?<div class=\"question-note-box\" style=\"border:1px solid #444;padding:8px 10px;margin-top:8px;line-height:1.7\">$(\\sqrt{a-b}+\\sqrt b)^2-(\\sqrt a)^2=$ (가) $\\gt0$</div>",
    "choices": [
      "$\\sqrt{b(a-b)}$",
      "$2\\sqrt{b(a-b)}$",
      "$2b$",
      "$2\\sqrt{ab}$",
      "$2b(a-b)$"
    ],
    "answer": "②",
    "solution": "$a>b>0$이므로 $\\sqrt{a-b}+\\sqrt b$와 $\\sqrt a$는 양수이다.\n$(\\sqrt{a-b}+\\sqrt b)^2-(\\sqrt a)^2$\n$=(a-b)+2\\sqrt{b(a-b)}+b-a$\n$=2\\sqrt{b(a-b)}>0$이다.\n따라서 빈칸 (가)는 $2\\sqrt{b(a-b)}$이고, 양수 두 수의 제곱 비교이므로 원래 부등식도 성립한다.\n따라서 정답은 ②이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_POSITIVE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "SEQUENTIAL: 양수성→제곱의 차 계산→증명 결론을 연결.",
        "learningLevel": "원래 부등식을 동치 덧셈형으로 바꾸어 제곱의 차를 설명한다.",
        "assessmentBucket": "합의 제곱의 교차항 및 두 근호 곱셈의 검산이 필요하다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "EXEMPT: 제곱 전개와 인수분해 수식이 완결되어 SVG가 불필요하게 중복된다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q12-C1",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명",
      "수직선"
    ],
    "wide": false,
    "content": "자연수 $m,n$이 $m>n$, $m+n=10$을 만족한다. 제곱 비교를 이용하여 부등식 $\\sqrt{m^2-n^2}>2(m-n)$이 성립하도록 하는 $m$의 값을 구하면?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "$m>n>0$이므로 $\\sqrt{m^2-n^2}$와 $2(m-n)$은 양수이고 제곱하여 대소를 비교할 수 있다.\n$d=m-n>0$이라 두면 $m^2-n^2=(m-n)(m+n)=10d$이다.\n주어진 부등식은 $10d>4d^2$이고 $d>0$이므로 $10>4d$, 즉 $0<d<\\dfrac52$이다.\n$m+n=10$이 짝수이므로 자연수 $m,n$의 차 $d$도 양의 짝수이다. 따라서 $d=2$뿐이다.\n$m=(10+2)/2=6$, $n=4$이다. 실제로 $\\sqrt{36-16}=\\sqrt{20}>4$이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q12-C1-solution.svg",
    "solutionImageAlt": "제곱 비교로 확정한 차 d의 열린 범위와 가능한 짝수를 표시한 수직선",
    "solutionImageCaption": "0<d<5/2에서 d=2",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_POLYNOMIAL_FACTORIZATION",
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_NATURAL_NUMBER",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "RANGE_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_POLYNOMIAL_FACTORIZATION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용; CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_NATURAL_NUMBER: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "INTERDEPENDENT: 양수성→제곱의 차 계산→짝수 차와 범위 교집합을 연결.",
        "learningLevel": "증명을 제곱 비교로 변환한 뒤 차의 짝수성과 자연수 조건을 적용한다.",
        "assessmentBucket": "계수 제곱·엄격 경계·짝수 조건이 결합된다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "BENEFICIAL: 제곱의 차로 결정한 열린 경계와 양의 짝수 차를 수직선 위에 확인한다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q12-C2",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명",
      "수직선"
    ],
    "wide": false,
    "content": "자연수 $m,n$이 $m>n$, $m+n=20$을 만족한다. 제곱 비교로 부등식 $\\sqrt{m^2-n^2}>2(m-n)$이 성립함을 확인할 때, 순서쌍 $(m,n)$의 개수는?",
    "choices": [
      "$1$",
      "$4$",
      "$3$",
      "$2$",
      "$9$"
    ],
    "answer": "④",
    "solution": "$m>n>0$이므로 두 수는 양수이고, 차 $d=m-n>0$을 두면 $m^2-n^2=20d$이다.\n$\\sqrt{20d}>2d$를 제곱하면 $20d>4d^2$이다.\n$d>0$으로 양변을 나누어 $0<d<5$를 얻는다.\n$m+n=20$이 짝수이고 두 수가 자연수이므로 차 $d$는 양의 짝수이다.\n따라서 $d=2$ 또는 $d=4$이다.\n$d=2$이면 $(m,n)=(11,9)$, $d=4$이면 $(12,8)$이고 둘 다 실제 부등식을 만족한다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q12-C2-solution.svg",
    "solutionImageAlt": "제곱 비교로 확정한 차 d의 열린 범위와 가능한 짝수를 표시한 수직선",
    "solutionImageCaption": "0<d<5에서 d=2,4",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_POLYNOMIAL_FACTORIZATION",
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_NATURAL_NUMBER",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "RANGE_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_POLYNOMIAL_FACTORIZATION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용; CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_NATURAL_NUMBER: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "INTERDEPENDENT: 양수성→제곱의 차 계산→짝수 차와 범위 교집합을 연결.",
        "learningLevel": "부등식 증명과 정수 차의 후보 열거를 연결한다.",
        "assessmentBucket": "경계 5 제외와 d 짝수 제한을 동시에 지켜야 한다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "BENEFICIAL: 제곱의 차로 결정한 열린 경계와 양의 짝수 차를 수직선 위에 확인한다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q12-C3",
    "sourceQid": 12,
    "sourceUid": "qid_v1_1f7b74b8ce522acdcdbc445734375ae07c851c5ba8a9e913e25f2562f2ba7894",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "부등식의 증명",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제",
      "부등식",
      "증명",
      "수직선"
    ],
    "wide": false,
    "content": "자연수 $m,n$이 $m>n$, $m+n=20$을 만족한다. 제곱의 차를 이용하여 $2(m-n)<\\sqrt{m^2-n^2}<3(m-n)$이 성립하도록 하는 $m$의 값은?",
    "choices": [
      "$10$",
      "$11$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "answer": "③",
    "solution": "$m>n>0$이고 $d=m-n>0$이라 하면 $m^2-n^2=20d$이다.\n양수 사이의 부등식 $2d<\\sqrt{20d}<3d$를 제곱해 $4d^2<20d<9d^2$를 얻는다.\n$d>0$으로 나누면 $4d<20<9d$이므로 $\\dfrac{20}{9}<d<5$이다.\n$m+n=20$이 짝수이므로 자연수 $m,n$의 차 $d$도 양의 짝수이고, 이 범위에서는 $d=4$뿐이다.\n따라서 $m=(20+4)/2=12$, $n=8$이다.\n검산하면 $2d=8<\\sqrt{80}<12=3d$이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q12-C3-solution.svg",
    "solutionImageAlt": "제곱 비교로 확정한 차 d의 열린 범위와 가능한 짝수를 표시한 수직선",
    "solutionImageCaption": "20/9<d<5에서 d=4",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-250",
      "rpmL1": "집합과 명제",
      "rpmL2": "명제",
      "rpmL3": "증명",
      "rpmL4": "절대부등식 증명",
      "rpmMappingStatus": "FAMILY_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H22-C2-06-CORE, PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE, TPL_SQUARE_COMPARISON_PROOF ACTIVE, high1 crosswalk H1-RPM-250 FAMILY_ACTIVE.",
      "problemTypeKey": "PT_ABSOLUTE_INEQUALITY_PROOF",
      "templateKey": "TPL_SQUARE_COMPARISON_PROOF",
      "crossConceptKeys": [
        "CC_POLYNOMIAL_FACTORIZATION",
        "CC_RADICAL_EXPRESSION"
      ],
      "conditionKeys": [
        "COND_NATURAL_NUMBER",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "RANGE_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q12의 부등식 증명: 비교 대상의 양수성 확인 → 제곱의 차 → 인수분해·등호/경계 판정. H1-RPM-250 Primary L3 증명을 유지한다.",
        "l4": "절대부등식 증명 RPM L4에서 제곱 비교를 사용한다.",
        "pt": "PT_ABSOLUTE_INEQUALITY_PROOF ACTIVE; 최종 발문은 제곱 비교 증명·오류 식·등호·증명을 이용한 정수 조건을 묻는다.",
        "tpl": "TPL_SQUARE_COMPARISON_PROOF ACTIVE, 해당 PT의 구체적 제곱 비교 골격을 사용.",
        "cross": "CC_POLYNOMIAL_FACTORIZATION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용; CC_RADICAL_EXPRESSION: 근호식 변형 또는 제곱 차의 인수분해에서 실제 사용",
        "condition": "COND_NATURAL_NUMBER: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용; COND_RANGE: 양수·범위·자연수 조건을 증명 전제와 후보 제거에 사용",
        "integration": "INTERDEPENDENT: 양수성→제곱의 차 계산→짝수 차와 범위 교집합을 연결.",
        "learningLevel": "두 방향의 제곱 비교를 각각 풀고 교집합에 정수 짝수 조건을 적용한다.",
        "assessmentBucket": "이중 엄격 경계 및 조건 누락 가능성이 높다.",
        "problemVisual": "EXEMPT: 문자·식 및 증명 박스만으로 충분. 문제 그림을 넣으면 새 정보 없이 답을 암시한다.",
        "solutionVisual": "BENEFICIAL: 제곱의 차로 결정한 열린 경계와 양의 짝수 차를 수직선 위에 확인한다.",
        "curriculum": "2022 공통수학2 명제: 부등식의 증명, 근호 계산, 인수분해, 자연수와 부호 범위만 사용. 미분·벡터·극한은 사용하지 않음."
      }
    }
  }
];
