window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q08-A1",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=x+3$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{8}(1)$의 값은?",
    "choices": [
      "$19$",
      "$22$",
      "$24$",
      "$25$",
      "$28$"
    ],
    "answer": "④",
    "solution": "$f(x)=x+3$이므로 합성할 때마다 $3$씩 증가한다.\n$f^2(x)=f(x+3)=x+6$, $f^3(x)=x+9$이므로 $f^n(x)=x+3n$이다.\n따라서 $f^8(1)=1+3\\cdot8=25$이다.\n따라서 정답은 ④이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_RULE",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_RULE이 한 번 합성 +3 → 8회 +24 → 처음 1 더하기에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 한 번 합성 +3 → 8회 +24 → 처음 1 더하기 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 한 번 합성 +3 → 8회 +24 → 처음 1 더하기",
        "learningLevel": "반복합성의 일정한 증가량을 발견한 뒤 한 번의 대입으로 해결한다.",
        "assessmentBucket": "첫 입력 누락·반복 횟수 오인 위험이 있지만 경우 분기는 없다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q08-A2",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=x-4$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{6}(29)$의 값은?",
    "choices": [
      "$5$",
      "$1$",
      "$9$",
      "$25$",
      "$33$"
    ],
    "answer": "①",
    "solution": "$f(x)=x-4$이므로 합성할 때마다 $4$씩 감소한다.\n$f^2(x)=x-8$, $f^3(x)=x-12$이고 일반적으로 $f^n(x)=x-4n$이다.\n$f^6(29)=29-4\\cdot6=29-24=5$이다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_RULE",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_RULE이 한 번 -4 → 6번 -24 → 29-24에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 한 번 -4 → 6번 -24 → 29-24 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 한 번 -4 → 6번 -24 → 29-24",
        "learningLevel": "반복되는 감소량을 계산하는 직접형으로 추가 분기가 없다.",
        "assessmentBucket": "음수 부호와 횟수 한 회 착오 가능성이 있지만 직접 계산이다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q08-A3",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=2x$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{5}(3)$의 값은?",
    "choices": [
      "$30$",
      "$32$",
      "$48$",
      "$96$",
      "$192$"
    ],
    "answer": "④",
    "solution": "한 번 합성할 때마다 값이 두 배가 된다.\n$f^2(x)=f(2x)=4x$, $f^3(x)=8x$이므로 일반적으로 $f^n(x)=2^nx$이다.\n$f^5(3)=2^5\\cdot3=32\\cdot3=96$이다.\n따라서 정답은 ④이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_RULE",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_RULE이 반복할 때마다 2배 → 다섯 번 2^5배에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 반복할 때마다 2배 → 다섯 번 2^5배 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 반복할 때마다 2배 → 다섯 번 2^5배",
        "learningLevel": "가산 반복과 배수 반복을 구분하고 합성 횟수를 지수로 표현해야 한다.",
        "assessmentBucket": "지수와 최초 입력이 각각 다른 역할임을 구분해야 하지만 경우는 하나다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q08-B1",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=x+k$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의한다. $f^{6}(2)=26$일 때, 실수 $k$의 값은?",
    "choices": [
      "$4$",
      "$3$",
      "$-4$",
      "$\\dfrac{13}{3}$",
      "$6$"
    ],
    "answer": "①",
    "solution": "한 번 합성할 때마다 $k$씩 증가하므로 $f^2(x)=x+2k$, 일반적으로 $f^n(x)=x+nk$이다.\n$f^6(2)=26$에서 $2+6k=26$이다.\n$6k=24$이므로 $k=4$이며 $2+6\\cdot4=26$으로 확인된다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_RULE",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT",
        "COND_FUNCTION_VALUE_CONSTRAINT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_RULE이 2+6k=26을 수립하여 k=4에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT, COND_FUNCTION_VALUE_CONSTRAINT를 2+6k=26을 수립하여 k=4 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 2+6k=26을 수립하여 k=4",
        "learningLevel": "반복합성의 규칙을 먼저 만든 다음 결과로부터 매개변수를 역산한다.",
        "assessmentBucket": "초깃값·횟수·매개변수의 역할 구분과 나눗셈 실수 위험이 있다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q08-B2",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "하",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=3-x$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{2025}(7)$의 값은?",
    "choices": [
      "$-7$",
      "$-4$",
      "$-3$",
      "$4$",
      "$7$"
    ],
    "answer": "②",
    "solution": "$f^2(x)=f(3-x)=3-(3-x)=x$이므로 두 번 합성하면 처음 값으로 돌아간다.\n따라서 $f^{2m}(x)=x$, $f^{2m+1}(x)=f(x)$이다.\n$2025$는 홀수이므로 $f^{2025}(7)=f(7)=3-7=-4$이다.\n따라서 정답은 ②이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_IDENTITY_ORDER",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_IDENTITY_ORDER이 f²(x)=x; 홀수 횟수면 f(7)=-4에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 f²(x)=x; 홀수 횟수면 f(7)=-4 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: f²(x)=x; 홀수 횟수면 f(7)=-4",
        "learningLevel": "f²가 항등이라는 한 번의 관찰과 홀짝 판정만 필요하다.",
        "assessmentBucket": "큰 지수라도 거듭제곱 계산을 요구하지 않으며 결정적 2주기 확인이 짧다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q08-B3",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "함수 $f(x)=6-x$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{2024}(2)+f^{2025}(2)$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "$f^2(x)=6-(6-x)=x$이므로 두 번 합성할 때마다 처음 값으로 돌아간다.\n$2024$는 짝수이므로 $f^{2024}(2)=2$이다.\n$2025$는 홀수이므로 $f^{2025}(2)=f(2)=6-2=4$이다.\n따라서 구하는 합은 $2+4=6$이다.\n따라서 정답은 ③이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_IDENTITY_ORDER",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_IDENTITY_ORDER이 짝수 반복 2와 홀수 반복 4를 각각 구해 합산에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 짝수 반복 2와 홀수 반복 4를 각각 구해 합산 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 짝수 반복 2와 홀수 반복 4를 각각 구해 합산",
        "learningLevel": "인접한 짝수·홀수 지수를 별도로 판단하고 두 결과를 결합한다.",
        "assessmentBucket": "같은 반복값으로 잘못 통일하거나 한 항을 누락하는 오류 위험이 있다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q08-C1",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "중",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성",
      "표"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4,5\\}$에서 함수 $f:X\\to X$가 다음 표와 같다. <div class=\"question-table-wrap\"><table class=\"question-table\" style=\"font-size:8.6pt;border-collapse:collapse;max-width:280px;margin:4px 0\"><tbody><tr><th style=\"border:1px solid #555;padding:3px\">x</th><td style=\"border:1px solid #555;padding:3px\">1</td><td style=\"border:1px solid #555;padding:3px\">2</td><td style=\"border:1px solid #555;padding:3px\">3</td><td style=\"border:1px solid #555;padding:3px\">4</td><td style=\"border:1px solid #555;padding:3px\">5</td></tr><tr><th style=\"border:1px solid #555;padding:3px\">f(x)</th><td style=\"border:1px solid #555;padding:3px\">2</td><td style=\"border:1px solid #555;padding:3px\">3</td><td style=\"border:1px solid #555;padding:3px\">1</td><td style=\"border:1px solid #555;padding:3px\">5</td><td style=\"border:1px solid #555;padding:3px\">4</td></tr></tbody></table></div>$f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의할 때, $f^{2026}(1)+f^{2026}(4)$의 값은?",
    "choices": [
      "$3$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "표에서 $1\\to2\\to3\\to1$의 3회 순환과 $4\\to5\\to4$의 2회 순환을 읽는다.\n$2026=3\\cdot675+1$이므로 $f^{2026}(1)=f(1)=2$이다.\n또 $2026=2\\cdot1013$이므로 $f^{2026}(4)=4$이다.\n합은 $2+4=6$이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q08-C1-solution.svg",
    "solutionImageAlt": "1·2·3의 3회 순환과 4·5의 2회 순환을 보여주는 화살표 그림",
    "solutionImageCaption": "화살표를 한 번 따라가면 함수를 한 번 합성한 것이다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_PERIOD",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_PERIOD이 1은 3주기, 4는 2주기; 2026의 나머지 1과 0에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT를 1은 3주기, 4는 2주기; 2026의 나머지 1과 0 풀이 단계에서 실제로 적용.",
        "integration": "SEQUENTIAL: 1은 3주기, 4는 2주기; 2026의 나머지 1과 0",
        "learningLevel": "서로 다른 두 순환 길이를 확인하고 동일 지수를 각각 다른 주기로 줄여 합산한다.",
        "assessmentBucket": "두 가지 나머지 계산과 대응표 해석이 필요하여 오류 위험이 상대적으로 높다.",
        "problemVisual": "문제용 HTML 대응표 실재. 별도 SVG가 필요하지 않으며 주기 정답을 누설하지 않음.",
        "solutionVisual": "학생용 대응표는 필수 정보이며 해설용 SVG는 3주기·2주기의 서로 다른 닫힌 화살표를 보여 주는 신규 정보.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q08-C2",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "상",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성"
    ],
    "wide": false,
    "content": "실수 전체에서 정의된 함수 $f(x)=ax+b$에 대하여 $f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의한다. 모든 실수 $x$에 대해 $f^2(x)=x$가 성립하고 $a\\ne1$이다. $f^{2025}(3)=9$일 때, 실수 $b$의 값은? (단, $a,b$는 실수이다.)",
    "choices": [
      "$-12$",
      "$-6$",
      "$6$",
      "$9$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$f^2(x)=f(ax+b)=a^2x+b(a+1)$이다.\n이 식이 모든 실수 $x$에서 $x$와 같으므로 $a^2=1$, $b(a+1)=0$이다.\n$a\\ne1$에 의해 $a=-1$이고, 이때 $b(a+1)=0$은 자동으로 성립한다.\n따라서 $f(x)=-x+b$이고 $f^2(x)=x$이다.\n$2025$는 홀수이므로 $f^{2025}(3)=f(3)=-3+b=9$이다.\n따라서 $b=12$이다.\n따라서 정답은 ⑤이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_IDENTITY_ORDER",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_ITERATION_COUNT",
        "COND_UNIVERSAL_INPUTS",
        "COND_FUNCTION_VALUE_CONSTRAINT"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 4,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_IDENTITY_ORDER이 f² 항등 → a=-1 → 홀수 반복은 f → b=12에 실제로 사용됨.",
        "cross": "기본 대수·반복합성은 주개념 내부이므로 별도 CrossConcept 가짜 확장 없음.",
        "condition": "COND_ITERATION_COUNT, COND_UNIVERSAL_INPUTS, COND_FUNCTION_VALUE_CONSTRAINT를 f² 항등 → a=-1 → 홀수 반복은 f → b=12 풀이 단계에서 실제로 적용.",
        "integration": "CASE_BRANCH: f² 항등 → a=-1 → 홀수 반복은 f → b=12",
        "learningLevel": "모든 실수에 대한 항등조건을 계수 비교로 전환하고 가능한 a를 분기한 뒤 홀수 반복 결과와 결합해야 한다.",
        "assessmentBucket": "계수 비교·a=±1 분기·짝홀 적용은 독립된 판단이나 매개변수 열거는 없다.",
        "problemVisual": "학생용 함수식이 완전하여 문제 SVG 불필요.",
        "solutionVisual": "수식에 결정적 관계가 모두 드러나며 추가 SVG는 중복이므로 제외.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q08-C3",
    "sourceQid": 8,
    "sourceUid": "qid_v1_c9d5ebc705de0fd149b686c859a8c9f0078f853425ac590bc2902e6ad588253e",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "상",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
    "subUnit": "합성함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합성함수",
      "반복합성",
      "표"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4,5,6,7\\}$에서 함수 $f:X\\to X$가 다음 표와 같다. <div class=\"question-table-wrap\"><table class=\"question-table\" style=\"font-size:8.6pt;border-collapse:collapse;max-width:280px;margin:4px 0\"><tbody><tr><th style=\"border:1px solid #555;padding:3px\">x</th><td style=\"border:1px solid #555;padding:3px\">1</td><td style=\"border:1px solid #555;padding:3px\">2</td><td style=\"border:1px solid #555;padding:3px\">3</td><td style=\"border:1px solid #555;padding:3px\">4</td><td style=\"border:1px solid #555;padding:3px\">5</td><td style=\"border:1px solid #555;padding:3px\">6</td><td style=\"border:1px solid #555;padding:3px\">7</td></tr><tr><th style=\"border:1px solid #555;padding:3px\">f(x)</th><td style=\"border:1px solid #555;padding:3px\">2</td><td style=\"border:1px solid #555;padding:3px\">3</td><td style=\"border:1px solid #555;padding:3px\">1</td><td style=\"border:1px solid #555;padding:3px\">5</td><td style=\"border:1px solid #555;padding:3px\">6</td><td style=\"border:1px solid #555;padding:3px\">7</td><td style=\"border:1px solid #555;padding:3px\">4</td></tr></tbody></table></div>$f^1=f$, $f^{n+1}=f\\circ f^n$ ($n$은 자연수)로 정의한다. $1\\le n\\le100$인 자연수 $n$ 중 $f^n(1)=3$이고 $f^n(4)=6$을 동시에 만족하는 $n$의 개수는?",
    "choices": [
      "$8$",
      "$9$",
      "$17$",
      "$25$",
      "$33$"
    ],
    "answer": "②",
    "solution": "표의 대응에서 $1\\to2\\to3\\to1$은 3회 주기, $4\\to5\\to6\\to7\\to4$는 4회 주기이다.\n$f^n(1)=3$이려면 $n$을 3으로 나눈 나머지가 2이고, $f^n(4)=6$이려면 4로 나눈 나머지도 2여야 한다.\n두 조건을 동시에 만족하는 자연수는 $n=2+12k$ ($k=0,1,2,\\ldots$)이다. $12$는 3과 4의 최소공배수이다.\n$1\\le2+12k\\le100$에서 $0\\le k\\le\\dfrac{98}{12}=8+\\dfrac16$이므로 $k=0,1,\\ldots,8$이다.\n가능한 값은 $n=2,14,\\ldots,98$의 아홉 개이며 다음 값 $110$은 범위 밖이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q08-C3-solution.svg",
    "solutionImageAlt": "1·2·3의 3회 순환과 4·5·6·7의 4회 순환을 보여주는 화살표 그림",
    "solutionImageCaption": "화살표를 한 번 따라가면 함수를 한 번 합성한 것이다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-253",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "합성함수",
      "rpmL4": "합성함수 계산",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "RPM H1-RPM-253 DIRECT_ACTIVE는 PT_COMPOSITION_EVALUATION/TPL_COMPOSITION_VALUE_DIRECT에 대한 기본 직접 매핑임. 본 문항의 반복합성 결정 사고에 따라 별도 ACTIVE PT_ITERATED_COMPOSITION + 선택 TPL을 사용하며 이를 직접 crosswalk mapping으로 오기하지 않는다.",
      "problemTypeKey": "PT_ITERATED_COMPOSITION",
      "templateKey": "TPL_ITERATION_PERIOD",
      "crossConceptKeys": [
        "CC_NUMBER_DIVISOR_MULTIPLE"
      ],
      "conditionKeys": [
        "COND_ITERATION_COUNT",
        "COND_NATURAL_NUMBER",
        "COND_RANGE",
        "COND_DIVISIBILITY"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q08 반복합성 함수의 n회 합성값을 결정하는 L3를 고정.",
        "l4": "반복 적용해 합성함숫값을 구하는 RPM L4; 주기·항등함수는 별도 ACTIVE TPL이 실제 풀이에 필요.",
        "pt": "실제 핵심이 f^n의 반복합성이므로 FUNCTIONS_GRAPHS ACTIVE PT_ITERATED_COMPOSITION (H22-C2-07 binding).",
        "tpl": "TPL_ITERATION_PERIOD이 3주기·4주기 → 두 잔여 모두2 → 12간격 → 9개에 실제로 사용됨.",
        "cross": "CC_NUMBER_DIVISOR_MULTIPLE ACTIVE: 3과 4의 최소공배수 12가 두 반복 주기를 결합하는 간격을 결정.",
        "condition": "COND_ITERATION_COUNT, COND_NATURAL_NUMBER, COND_RANGE, COND_DIVISIBILITY를 3주기·4주기 → 두 잔여 모두2 → 12간격 → 9개 풀이 단계에서 실제로 적용.",
        "integration": "INTERDEPENDENT: 3주기·4주기 → 두 잔여 모두2 → 12간격 → 9개",
        "learningLevel": "3주기와 4주기를 독립 판정하고 두 잔여 조건을 최소공배수 12로 결합해 범위에서 개수를 세야 한다.",
        "assessmentBucket": "동시 조건·첫 경계 n=2·끝 n=98·최소공배수 오판 등 여러 오류 지점이 있다.",
        "problemVisual": "문제용 HTML 대응표 실재. 별도 SVG가 필요하지 않으며 주기 정답을 누설하지 않음.",
        "solutionVisual": "두 순환 3회·4회가 학생이 동시에 충족해야 할 필수 관계임을 해설 화살표로 확인; 문제에서는 원래 함수값 표만 공개.",
        "curriculum": "2022 개정 공통수학2의 함수·합성함수의 정의 및 반복 적용, 중등 일차식·거듭제곱·최소공배수만 사용. 미분·벡터·상위 수열 공식을 학생용 풀이에서 사용하지 않음."
      }
    }
  }
];
