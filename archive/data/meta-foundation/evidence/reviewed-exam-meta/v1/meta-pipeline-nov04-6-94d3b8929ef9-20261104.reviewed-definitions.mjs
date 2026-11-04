export default {
  "schema": "NOV04_M2_DEFINITIONS_V1",
  "generatedAt": "2026-11-04",
  "examSlug": "21_팔마중_1학기_기말_중2_수학",
  "examTitle": "2021학년도 순천팔마중 2학년 1학기 기말고사 수학",
  "sourceFile": "nov04-6-source.js",
  "auditFile": "nov04-6-audit.json",
  "reviewFile": "nov04-drift.mjs",
  "reviewer": {
    "agent": "OpenCode",
    "model": "deepseek-v4.1-flash",
    "provider": "opencode-go"
  },
  "authorization": {
    "basis": "USER_AND_ROOT_AUTHORIZED_CORRECTIVE_METADATA_WITH_NEW_ADDITIVE_MIDDLE2_PACK",
    "scope": "Metadata definitions and canonical unit/subunit assignment only.",
    "studentContentPolicy": "Preserved. No statement, choice, answer, solution, score, level or visual is edited by this file.",
    "mathPolicy": "No re-solving. All evidence snippets below are copied from the already-solved current source."
  },
  "pack": {
    "packId": "MIDDLE2",
    "canonicalStatus": "ADD_ONLY_NEW_PACK_AUTHORIZED",
    "packAbsenceAcknowledged": true,
    "curriculum": "2015",
    "standardCourses": [
      "중2",
      "M2-1",
      "중2-1",
      "중2 수학"
    ],
    "ownedStandardUnitDomains": [
      "M2-03",
      "M2-04"
    ],
    "parentRpmScope": "M2-1",
    "note": "ROOT explicitly authorized this additive pack; absence of a prior MIDDLE2 pack is not a blocker and requires no new user approval."
  },
  "canonicalInspections": [
    {
      "key": "CC_SYSTEM_OF_LINEAR_EQUATIONS",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "미지수가 2개인 연립일차방정식",
      "canonicalDefinition": "주어진 두 함숫값 조건을 일차방정식으로 세워 가감법·대입법으로 계수를 결정하는 연산",
      "verdict": "KEY_REUSED_DEFINITION_CONFLICT",
      "rationale": "The canonical key and label fit, but the canonical definition is written for a 함수값 조건 item and is narrower than this exam's ordinary two-variable linear systems (Q1-Q6, Q19-Q22). Key and label are reused; the exam-level definition below restores the general meaning. Canonical file is not edited."
    },
    {
      "key": "CC_PARALLEL_LINES",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
      "canonicalLabelKo": "평행",
      "canonicalDefinition": "두 직선의 평행 조건을 이용해 기울기나 좌표 관계를 정한다.",
      "verdict": "EXACT_REUSE",
      "rationale": "Same meaning is decisive in Q2 (no-solution coefficient ratio implies parallel lines) and Q14 (equal slopes). Canonical label, definition and COORDINATE_GEOMETRY shard reused unchanged."
    },
    {
      "key": "CC_GRAPH_INTERSECTION",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
      "canonicalLabelKo": "그래프의 교점",
      "canonicalDefinition": "함수 그래프의 위치 관계와 교점 사이의 영역",
      "verdict": "KEY_REUSED_DEFINITION_CONFLICT",
      "rationale": "Key and label are exact. The canonical wording describes a region between graphs rather than the intersection point used in Q19, Q20 and Q24. Key and label reused; a precise point-intersection definition is supplied below without editing canonical."
    },
    {
      "key": "CC_FUNCTION_DEFINITION",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
      "canonicalLabelKo": "함수의 정의",
      "canonicalDefinition": "정의역의 각 원소마다 공역의 원소가 정확히 하나씩 대응하는 관계이다.",
      "verdict": "EXACT_REUSE",
      "rationale": "Q8 decides function status exactly by the one-output-per-input rule. Canonical label, definition and FUNCTIONS shard reused unchanged."
    },
    {
      "key": "CC_ALGEBRAIC_SUBSTITUTION",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "대입을 통한 함수값 결정",
      "canonicalDefinition": "이미 주어진 입력·함수값을 관계식에 대입하여 필요한 값을 계산한다.",
      "verdict": "KEY_REUSED_DEFINITION_CONFLICT",
      "rationale": "Q21 substitutes a given solution pair into a system to recover coefficients, not a function value. The canonical key is preserved but its label/definition are function-specific. A context-precise label/definition is proposed below; canonical is not edited."
    },
    {
      "key": "CC_PRIME_NUMBERS",
      "nearCanonicalKey": "CC_NUMBER_PRIME_COPRIME",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/number-theory.json",
      "verdict": "NO_EXACT_COLLISION_NEW_KEY",
      "rationale": "The audited key CC_PRIME_NUMBERS is absent from canonical. CC_NUMBER_PRIME_COPRIME is a different key covering primes and coprime numbers, so the audit key is preserved and defined additively rather than renamed."
    },
    {
      "key": "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
      "nearCanonicalKey": "CC_LINEAR_EQUATIONS",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "verdict": "NO_EXACT_COLLISION_NEW_KEY",
      "rationale": "Different key and narrower meaning (two-variable linear equation graph). Preserved as audited and defined additively."
    },
    {
      "key": "CC_SLOPE_SIGN",
      "nearCanonicalKey": "CC_SLOPE",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
      "verdict": "NO_EXACT_COLLISION_NEW_KEY",
      "rationale": "CC_SLOPE_SIGN is the sign criterion, narrower than the generic CC_SLOPE. Distinct key, preserved and defined additively."
    },
    {
      "key": "CC_APPLIED_WORD_PROBLEMS",
      "verdict": "KEY_PRESERVED_LABEL_NARROWED",
      "rationale": "The audited key is a broad bucket. Per the preserve-keys rule it is not renamed, but the label/definition are narrowed to the actual atomic operation (문장제 모델링) instead of a generic category caption. It remains a supporting cross-concept, never the primary task label."
    },
    {
      "key": "PT_M2_* / TPL_M2_*",
      "verdict": "NO_CANONICAL_IDENTIFIERS",
      "rationale": "No PT_M2_/TPL_M2_ string exists in the inspected canonical packs. All 24 PT and 24 TPL definitions are add-only under the ROOT-authorized MIDDLE2 pack."
    }
  ],
  "rows": [
    {
      "ordinal": 1,
      "sourceQuestionId": 1,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
      "subUnit": "연립일차방정식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD",
      "templatePattern": "TPL_M2_SELECT_REQUIRED_OPERATION_FOR_VARIABLE_ELIMINATION",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_VARIABLE_ELIMINATION",
        "CC_LEAST_COMMON_MULTIPLE"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SOLVE_SYSTEM",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric audit subUnit M2-03-01 is replaced by canonical M2-03-SIMULTANEOUS_LINEAR_EQUATION. Source M2-04 system namespace is rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_VARIABLE_ELIMINATION",
        "CC_LEAST_COMMON_MULTIPLE"
      ]
    },
    {
      "ordinal": 2,
      "sourceQuestionId": 2,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
      "subUnit": "연립일차방정식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_NO_SOLUTION",
      "templatePattern": "TPL_M2_FIND_PARAMETER_FOR_NO_SOLUTION_SYSTEM",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_PARALLEL_LINES",
        "CC_COEFFICIENT_RATIOS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SPECIAL_CASES",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_PARALLEL_LINES",
        "CC_COEFFICIENT_RATIOS"
      ]
    },
    {
      "ordinal": 3,
      "sourceQuestionId": 3,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
      "subUnit": "연립일차방정식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS",
      "templatePattern": "TPL_M2_SOLVE_DECIMAL_SYSTEM_AND_LINEAR_COMBINATION",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_DECIMAL_COEFFICIENTS",
        "CC_LINEAR_COMBINATION"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SOLVE_SYSTEM",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_DECIMAL_COEFFICIENTS",
        "CC_LINEAR_COMBINATION"
      ]
    },
    {
      "ordinal": 4,
      "sourceQuestionId": 4,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
      "subUnit": "연립일차방정식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION",
      "templatePattern": "TPL_M2_FIND_PARAMETERS_FROM_TWO_SYSTEMS_WITH_SAME_SOLUTION",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_COMMON_SOLUTION",
        "CC_COEFFICIENT_DETERMINATION"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SOLVE_SYSTEM",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_COMMON_SOLUTION",
        "CC_COEFFICIENT_DETERMINATION"
      ]
    },
    {
      "ordinal": 5,
      "sourceQuestionId": 5,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
      "subUnit": "연립일차방정식의 활용",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식의 활용",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_GAME",
      "templatePattern": "TPL_M2_SOLVE_ROCK_PAPER_SCISSORS_STAIR_PROBLEM",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_INVERSE_WIN_LOSS_RELATIONS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SYSTEM_APPLICATION",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit M2-03-02 is replaced by canonical M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_INVERSE_WIN_LOSS_RELATIONS"
      ]
    },
    {
      "ordinal": 6,
      "sourceQuestionId": 6,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
      "subUnit": "연립일차방정식의 활용",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식의 활용",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_DIGITS",
      "templatePattern": "TPL_M2_FIND_THREE_DIGIT_NUMBER_FROM_DIGIT_RELATIONS",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_PLACE_VALUE",
        "CC_APPLIED_WORD_PROBLEMS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SYSTEM_APPLICATION",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_PLACE_VALUE",
        "CC_APPLIED_WORD_PROBLEMS"
      ]
    },
    {
      "ordinal": 7,
      "sourceQuestionId": 7,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_FUNCTION_VALUE_PRIME_COUNT",
      "templatePattern": "TPL_M2_CALCULATE_FUNCTION_VALUE_FOR_PRIME_COUNTING_RULE",
      "crossConcepts": [
        "CC_FUNCTION_VALUE",
        "CC_PRIME_NUMBERS",
        "CC_NUMBER_OF_ELEMENTS"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-01",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-FUNCTION_CONCEPT",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical 일차함수와 그래프. Numeric subUnit M2-04-01 is replaced by M2-04-LINEAR_FUNCTION_BASIC. Source M2-05 is rejected because canonical M2-05 is a geometry domain.",
      "originalCrossConcepts": [
        "CC_FUNCTION_VALUE",
        "CC_PRIME_NUMBERS",
        "CC_NUMBER_OF_ELEMENTS"
      ]
    },
    {
      "ordinal": 8,
      "sourceQuestionId": 8,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION",
      "templatePattern": "TPL_M2_COUNT_VALID_FUNCTIONS_AND_LINEAR_FUNCTIONS",
      "crossConcepts": [
        "CC_FUNCTION_DEFINITION",
        "CC_LINEAR_FUNCTIONS",
        "CC_CLASSIFICATION"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-01",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-FUNCTION_CONCEPT",
      "level": "중",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected (canonical geometry collision).",
      "originalCrossConcepts": [
        "CC_FUNCTION_DEFINITION",
        "CC_LINEAR_FUNCTIONS",
        "CC_CLASSIFICATION"
      ]
    },
    {
      "ordinal": 9,
      "sourceQuestionId": 9,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION",
      "templatePattern": "TPL_M2_FIND_VERTICAL_SHIFT_PASSING_THROUGH_POINT",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_PARALLEL_TRANSLATION",
        "CC_POINT_SUBSTITUTION"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_PARALLEL_TRANSLATION",
        "CC_POINT_SUBSTITUTION"
      ]
    },
    {
      "ordinal": 10,
      "sourceQuestionId": 10,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTION_CONDITIONS_MATCHING",
      "templatePattern": "TPL_M2_SELECT_FUNCTION_MATCHING_SLOPE_AND_INTERCEPT_CONDITIONS",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_SLOPE_SIGN",
        "CC_X_INTERCEPT"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "중",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_SLOPE_SIGN",
        "CC_X_INTERCEPT"
      ]
    },
    {
      "ordinal": 11,
      "sourceQuestionId": 11,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTION_SOLID_OF_REVOLUTION",
      "templatePattern": "TPL_M2_CALCULATE_CONE_VOLUME_FROM_INTERCEPT_TRIANGLE",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_INTERCEPTS",
        "CC_CONE_VOLUME",
        "CC_SOLID_OF_REVOLUTION"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_INTERCEPTS",
        "CC_CONE_VOLUME",
        "CC_SOLID_OF_REVOLUTION"
      ]
    },
    {
      "ordinal": 12,
      "sourceQuestionId": 12,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA",
      "templatePattern": "TPL_M2_CALCULATE_AREA_BOUNDED_BY_TWO_LINES_AND_AXES",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_INTERCEPTS",
        "CC_POLYGON_AREA"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_INTERCEPTS",
        "CC_POLYGON_AREA"
      ]
    },
    {
      "ordinal": 13,
      "sourceQuestionId": 13,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION",
      "templatePattern": "TPL_M2_FIND_PARAMETER_RANGE_AVOIDING_FIRST_QUADRANT",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_SLOPE_SIGN",
        "CC_Y_INTERCEPT",
        "CC_QUADRANTS"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_SLOPE_SIGN",
        "CC_Y_INTERCEPT",
        "CC_QUADRANTS"
      ]
    },
    {
      "ordinal": 14,
      "sourceQuestionId": 14,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION",
      "templatePattern": "TPL_M2_FIND_UNKNOWN_COORDINATE_FROM_PARALLEL_SLOPE",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_PARALLEL_LINES",
        "CC_SLOPE_FORMULA"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-02",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_GRAPH",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_PARALLEL_LINES",
        "CC_SLOPE_FORMULA"
      ]
    },
    {
      "ordinal": 15,
      "sourceQuestionId": 15,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_LINEAR_EQUATION_TO_LINEAR_FUNCTION_STANDARD_FORM",
      "templatePattern": "TPL_M2_MATCH_LINEAR_EQUATION_GRAPH_FROM_INTERCEPTS",
      "crossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_INTERCEPTS",
        "CC_GRAPH_MATCHING"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-EQUATION_AND_FUNCTION",
      "level": "중",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-04 matches verified canonical 일차함수와 그래프, whose second subunit is M2-04-LINEAR_FUNCTION_EQUATION. Numeric M2-04-03 is replaced. Source M2-06 is rejected because canonical M2-06 is 도형의 닮음.",
      "originalCrossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_INTERCEPTS",
        "CC_GRAPH_MATCHING"
      ]
    },
    {
      "ordinal": 16,
      "sourceQuestionId": 16,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES",
      "templatePattern": "TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH",
      "crossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_SLOPE_AND_INTERCEPT",
        "CC_QUADRANTS"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-EQUATION_AND_FUNCTION",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Numeric audit subUnit replaced by M2-04-LINEAR_FUNCTION_EQUATION; source M2-06 rejected (canonical geometry collision).",
      "originalCrossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_SLOPE_AND_INTERCEPT",
        "CC_QUADRANTS"
      ]
    },
    {
      "ordinal": 17,
      "sourceQuestionId": 17,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_LINEAR_EQUATION_POINT_SUBSTITUTION",
      "templatePattern": "TPL_M2_FIND_UNKNOWN_COEFFICIENT_AND_COORDINATE_FROM_LINE",
      "crossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_POINT_SUBSTITUTION",
        "CC_ALGEBRAIC_SUM"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-EQUATION_AND_FUNCTION",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Numeric audit subUnit replaced by M2-04-LINEAR_FUNCTION_EQUATION; source M2-06 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_POINT_SUBSTITUTION",
        "CC_ALGEBRAIC_SUM"
      ]
    },
    {
      "ordinal": 18,
      "sourceQuestionId": 18,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS",
      "templatePattern": "TPL_M2_FIND_VERTICAL_LINE_EQUATION_FROM_POINT",
      "crossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_EQUATIONS_PARALLEL_TO_AXES"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-EQUATION_AND_FUNCTION",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Numeric audit subUnit replaced by M2-04-LINEAR_FUNCTION_EQUATION; source M2-06 rejected.",
      "originalCrossConcepts": [
        "CC_LINEAR_EQUATIONS_TWO_VARIABLES",
        "CC_EQUATIONS_PARALLEL_TO_AXES"
      ]
    },
    {
      "ordinal": 19,
      "sourceQuestionId": 19,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION",
      "templatePattern": "TPL_M2_FIND_INTERSECTION_COORDINATE_SUM_FROM_SYSTEM",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_INTERSECTION_OF_TWO_GRAPHS",
        "CC_ALGEBRAIC_SUM"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-SYSTEM_AND_GRAPH",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Graph-intersection/equation relation belongs to canonical M2-04-LINEAR_FUNCTION_EQUATION. Numeric audit subUnit replaced; source M2-06 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed. ROOT adds CC_INTERSECTION_OF_TWO_GRAPHS because existing CC_GRAPH_INTERSECTION has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_GRAPH_INTERSECTION",
        "CC_ALGEBRAIC_SUM"
      ]
    },
    {
      "ordinal": 20,
      "sourceQuestionId": 20,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_INTERSECTION_QUADRANT",
      "templatePattern": "TPL_M2_FIND_PARAMETER_RANGE_FOR_INTERSECTION_IN_QUADRANT",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_INTERSECTION_OF_TWO_GRAPHS",
        "CC_QUADRANTS"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-SYSTEM_AND_GRAPH",
      "level": "상",
      "difficultyRank": 4,
      "correctionReason": "Intersection-quadrant condition belongs to M2-04-LINEAR_FUNCTION_EQUATION. Numeric audit subUnit replaced; source M2-06 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed. ROOT adds CC_INTERSECTION_OF_TWO_GRAPHS because existing CC_GRAPH_INTERSECTION has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_GRAPH_INTERSECTION",
        "CC_QUADRANTS"
      ]
    },
    {
      "ordinal": 21,
      "sourceQuestionId": 21,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
      "subUnit": "연립일차방정식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP",
      "templatePattern": "TPL_M2_SOLVE_ORIGINAL_SYSTEM_AFTER_COEFFICIENT_SWAP_DESCRIPTIVE",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_COEFFICIENT_SWAP",
        "CC_SUBSTITUTION_IN_EQUATIONS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SOLVE_SYSTEM",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed. ROOT adds CC_SUBSTITUTION_IN_EQUATIONS because existing CC_ALGEBRAIC_SUBSTITUTION has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_COEFFICIENT_SWAP",
        "CC_ALGEBRAIC_SUBSTITUTION"
      ]
    },
    {
      "ordinal": 22,
      "sourceQuestionId": 22,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-03",
      "standardUnit": "연립일차방정식",
      "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
      "subUnit": "연립일차방정식의 활용",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "연립일차방정식의 활용",
      "primaryTaxonomy": "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_COST",
      "templatePattern": "TPL_M2_SOLVE_UNIT_PRICE_SYSTEM_WORD_PROBLEM_DESCRIPTIVE",
      "crossConcepts": [
        "CC_SIMULTANEOUS_LINEAR_EQUATIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_UNIT_PRICE"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-04",
      "sourceSubUnitKeyOriginal": "M2-04-SYSTEM_APPLICATION",
      "level": "중",
      "difficultyRank": 2,
      "correctionReason": "Audit top-level M2-03 matches verified canonical. Numeric subUnit replaced by M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD; source M2-04 rejected. ROOT adds CC_SIMULTANEOUS_LINEAR_EQUATIONS because existing CC_SYSTEM_OF_LINEAR_EQUATIONS has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_SYSTEM_OF_LINEAR_EQUATIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_UNIT_PRICE"
      ]
    },
    {
      "ordinal": 23,
      "sourceQuestionId": 23,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
      "subUnit": "일차함수와 그 그래프",
      "L1": "일차함수",
      "L2": "일차함수와 그 그래프",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE",
      "templatePattern": "TPL_M2_SOLVE_TEMPERATURE_ALTITUDE_WORD_PROBLEM_DESCRIPTIVE",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_RATE_OF_CHANGE"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-04",
      "sourceUnitKeyOriginal": "M2-05",
      "sourceSubUnitKeyOriginal": "M2-05-LINEAR_FUNCTION_APPLICATION",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Audit top-level M2-04 matches verified canonical. Numeric subUnit replaced by M2-04-LINEAR_FUNCTION_BASIC; source M2-05 rejected. ROOT corrected the transcribed original audit subunit from the exact raw audit; canonical target unchanged.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_RATE_OF_CHANGE"
      ]
    },
    {
      "ordinal": 24,
      "sourceQuestionId": 24,
      "pack": "MIDDLE2",
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-04",
      "standardUnit": "일차함수와 그래프",
      "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
      "subUnit": "일차함수와 일차방정식의 관계",
      "L1": "일차함수",
      "L2": "일차함수와 일차방정식의 관계",
      "primaryTaxonomy": "PT_M2_LINEAR_FUNCTIONS_GRAPH_INTERSECTION_APPLICATION",
      "templatePattern": "TPL_M2_SOLVE_MOTION_GRAPH_INTERSECTION_WORD_PROBLEM_DESCRIPTIVE",
      "crossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_INTERSECTION_OF_TWO_GRAPHS",
        "CC_APPLIED_WORD_PROBLEMS"
      ],
      "auditUnitKeyOriginal": "M2-04",
      "auditSubUnitKeyOriginal": "M2-04-04",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-SYSTEM_AND_GRAPH",
      "level": "상",
      "difficultyRank": 4,
      "correctionReason": "Two motion graphs meeting is an intersection of linear-function graphs, i.e. M2-04-LINEAR_FUNCTION_EQUATION. Numeric audit subUnit replaced; source M2-06 rejected. ROOT corrected the transcribed original audit subunit from the exact raw audit; canonical target unchanged. ROOT adds CC_INTERSECTION_OF_TWO_GRAPHS because existing CC_GRAPH_INTERSECTION has a narrower canonical meaning; no canonical definition is changed.",
      "originalCrossConcepts": [
        "CC_LINEAR_FUNCTIONS",
        "CC_GRAPH_INTERSECTION",
        "CC_APPLIED_WORD_PROBLEMS"
      ]
    }
  ],
  "definitions": {
    "units": {
      "M2-03": {
        "labelKo": "연립일차방정식",
        "definition": "미지수가 2개인 두 일차방정식을 함께 만족시키는 해를 구하고, 그 해를 실생활 문제에 적용하는 단원.",
        "supportingOrdinals": [
          1,
          2,
          3,
          4,
          5,
          6,
          21,
          22
        ],
        "L1": "일차부등식과 연립일차방정식",
        "parentRpmScope": "M2-1",
        "owner": "MIDDLE2"
      },
      "M2-04": {
        "labelKo": "일차함수와 그래프",
        "definition": "함수의 뜻과 함숫값, 일차함수의 그래프와 성질, 일차방정식의 그래프 및 두 그래프의 교점을 다루는 단원.",
        "supportingOrdinals": [
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          23,
          24
        ],
        "L1": "일차함수",
        "parentRpmScope": "M2-1",
        "owner": "MIDDLE2"
      }
    },
    "subUnits": {
      "M2-03-SIMULTANEOUS_LINEAR_EQUATION": {
        "labelKo": "연립일차방정식",
        "definition": "두 일차방정식을 동시에 만족시키는 해를 가감법·대입법 등으로 구하고, 해의 존재 조건과 미정계수를 판별하는 개념.",
        "supportingOrdinals": [
          1,
          2,
          3,
          4,
          21
        ],
        "standardUnitKey": "M2-03",
        "L1": "일차부등식과 연립일차방정식",
        "L2": "연립일차방정식",
        "owner": "MIDDLE2"
      },
      "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD": {
        "labelKo": "연립일차방정식의 활용",
        "definition": "수량·가격·승패·자릿수 같은 실생활 조건을 미지수 2개의 연립일차방정식으로 세워 해를 구하는 개념.",
        "supportingOrdinals": [
          5,
          6,
          22
        ],
        "standardUnitKey": "M2-03",
        "L1": "일차부등식과 연립일차방정식",
        "L2": "연립일차방정식의 활용",
        "owner": "MIDDLE2"
      },
      "M2-04-LINEAR_FUNCTION_BASIC": {
        "labelKo": "일차함수와 그 그래프",
        "definition": "함수의 뜻과 함숫값, 일차함수의 정의·그래프·평행이동·절편·기울기 성질을 다루는 개념.",
        "supportingOrdinals": [
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          23
        ],
        "standardUnitKey": "M2-04",
        "L1": "일차함수",
        "L2": "일차함수와 그 그래프",
        "owner": "MIDDLE2"
      },
      "M2-04-LINEAR_FUNCTION_EQUATION": {
        "labelKo": "일차함수와 일차방정식의 관계",
        "definition": "미지수가 2개인 일차방정식의 그래프를 일차함수로 해석하고, 두 직선의 교점을 연립방정식의 해와 연결하는 개념.",
        "supportingOrdinals": [
          15,
          16,
          17,
          18,
          19,
          20,
          24
        ],
        "standardUnitKey": "M2-04",
        "L1": "일차함수",
        "L2": "일차함수와 일차방정식의 관계",
        "owner": "MIDDLE2"
      }
    },
    "problemTypes": {
      "PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD": {
        "labelKo": "가감법 소거식 선택",
        "definition": "연립일차방정식을 가감법으로 풀 때 특정 미지수를 소거하기 위해 각 식에 곱할 수와 더하거나 뺄 연산을 선택하는 과제.",
        "supportingOrdinals": [
          1
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 1,
          "snippet": "한 미지수를 소거하려면 그 미지수의 계수의 절댓값을 최소공배수로 같게 맞춘 뒤 부호에 따라 더하거나 뺀다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_NO_SOLUTION": {
        "labelKo": "해가 없을 조건으로 계수 결정",
        "definition": "연립일차방정식이 해를 갖지 않도록 하는 미지수의 계수 값을 계수비와 상수항비의 관계로 결정하는 과제.",
        "supportingOrdinals": [
          2
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 2,
          "snippet": "해가 없으려면 $y$의 계수의 비가 $x$의 계수의 비와 같아야 한다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS": {
        "labelKo": "소수 계수 연립방정식 풀이",
        "definition": "소수 계수를 가진 연립일차방정식을 정수 계수로 고쳐 해를 구한 뒤, 그 해로 일차결합의 값을 계산하는 과제.",
        "supportingOrdinals": [
          3
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 3,
          "snippet": "계수가 소수인 연립방정식은 각 식의 양변에 $10$의 거듭제곱을 곱하여 정수 계수로 고친 뒤 푼다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION": {
        "labelKo": "공통해를 이용한 미정계수 결정",
        "definition": "해가 같은 두 연립일차방정식에서 공통해를 먼저 구하고, 그 해를 다른 식에 대입하여 미정계수를 결정하는 과제.",
        "supportingOrdinals": [
          4
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 4,
          "snippet": "두 연립방정식의 해가 같으므로 상수가 모두 주어진 두 식을 연립하여 공통인 해를 먼저 구한다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_GAME": {
        "labelKo": "가위바위보 계단 문제",
        "definition": "이긴 사람과 진 사람의 계단 이동량이 서로 반대가 되는 게임 상황을 연립일차방정식으로 모델링하는 과제.",
        "supportingOrdinals": [
          5
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 5,
          "snippet": "비기는 경우가 없으므로 광수가 이긴 횟수는 하하가 진 횟수이고, 하하가 이긴 횟수는 광수가 진 횟수이다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_DIGITS": {
        "labelKo": "자릿수 관계로 세 자리 수 복원",
        "definition": "세 자리 자연수의 각 자리 숫자를 미지수로 놓고 자릿값과 자리 교환 조건을 연립일차방정식으로 세워 원래 수를 복원하는 과제.",
        "supportingOrdinals": [
          6
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 6,
          "snippet": "백의 자리 숫자를 $x$, 십의 자리 숫자를 $y$로 놓고 자릿값의 합으로 수를 나타낸다."
        }
      },
      "PT_M2_FUNCTION_VALUE_PRIME_COUNT": {
        "labelKo": "소수 개수 함숫값 계산",
        "definition": "주어진 수 이하의 소수의 개수로 정의된 함수의 함숫값을 소수를 직접 나열하여 구하는 과제.",
        "supportingOrdinals": [
          7
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 7,
          "snippet": "$f(15)$는 $15$ 이하의 자연수 중 소수의 개수를 의미한다."
        }
      },
      "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION": {
        "labelKo": "함수와 일차함수 판별",
        "definition": "여러 관계식이 함수인지, 또 일차함수인지를 각각 판별하고 그 개수를 세는 과제.",
        "supportingOrdinals": [
          8
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 8,
          "snippet": "$x$의 각 값에 $y$의 값이 오직 하나씩 대응할 때 함수이며"
        }
      },
      "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION": {
        "labelKo": "평행이동한 일차함수 결정",
        "definition": "일차함수 그래프를 y축 방향으로 평행이동한 식을 세우고, 그래프가 지나는 점의 좌표를 대입하여 이동량을 결정하는 과제.",
        "supportingOrdinals": [
          9
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 9,
          "snippet": "일차함수 $y=ax+b$의 그래프를 $y$축의 방향으로 $k$만큼 평행이동한 식은 $y = ax+b+k$이다."
        }
      },
      "PT_M2_LINEAR_FUNCTION_CONDITIONS_MATCHING": {
        "labelKo": "기울기·절편 조건에 맞는 일차함수 선택",
        "definition": "기울기의 부호와 x절편의 부호 같은 여러 조건을 동시에 만족하는 일차함수를 보기에서 선택하는 과제.",
        "supportingOrdinals": [
          10
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 10,
          "snippet": "오른쪽 아래를 향하는 직선은 기울기가 음수($a<0$)이고, $x$절편은 $y=0$일 때의 $x$값이다."
        }
      },
      "PT_M2_LINEAR_FUNCTION_SOLID_OF_REVOLUTION": {
        "labelKo": "절편 삼각형을 회전한 원뿔 부피",
        "definition": "일차함수 그래프와 두 좌표축으로 둘러싸인 삼각형을 한 축 둘레로 회전시켜 생기는 원뿔의 부피를 구하는 과제.",
        "supportingOrdinals": [
          11
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 11,
          "snippet": "직각삼각형을 한 직각변을 축으로 1회전 시키면 원뿔이 만들어지며 부피는"
        }
      },
      "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA": {
        "labelKo": "두 일차함수와 좌표축이 둘러싼 넓이",
        "definition": "두 일차함수 그래프와 두 좌표축으로 둘러싸인 영역의 넓이를 절편과 삼각형 넓이의 차로 구하는 과제.",
        "supportingOrdinals": [
          12
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 12,
          "snippet": "제1사분면에서 큰 직각삼각형의 넓이에서 작은 직각삼각형의 넓이를 빼서 둘러싸인 사각형의 넓이를 구한다."
        }
      },
      "PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION": {
        "labelKo": "제1사분면을 지나지 않을 매개변수 범위",
        "definition": "일차함수 그래프가 특정 사분면을 지나지 않도록 하는 매개변수의 범위를 기울기와 y절편의 부등식으로 구하는 과제.",
        "supportingOrdinals": [
          13
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 13,
          "snippet": "일차함수의 그래프가 제1사분면을 지나지 않으려면 기울기는 음수이고, $y$절편은 $0$ 이하이어야 한다."
        }
      },
      "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION": {
        "labelKo": "평행 조건으로 미지의 좌표 결정",
        "definition": "두 점을 지나는 직선의 기울기와 주어진 직선의 기울기가 같다는 평행 조건으로 미지의 좌표를 결정하는 과제.",
        "supportingOrdinals": [
          14
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 14,
          "snippet": "두 일차함수의 그래프가 서로 평행하면 기울기가 같다."
        }
      },
      "PT_M2_LINEAR_EQUATION_TO_LINEAR_FUNCTION_STANDARD_FORM": {
        "labelKo": "일차방정식의 그래프 찾기",
        "definition": "미지수가 2개인 일차방정식을 일차함수 꼴로 변형해 절편을 구하고, 그 절편을 지나는 그래프를 선택하는 과제.",
        "supportingOrdinals": [
          15
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 15,
          "snippet": "일차방정식을 $y=ax+b$ 꼴로 변형하거나 $x$절편과 $y$절편을 구하여 그래프를 찾는다."
        }
      },
      "PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES": {
        "labelKo": "일차방정식 그래프 설명 판정",
        "definition": "일차방정식의 그래프에 대한 여러 설명의 참·거짓을 기울기·절편·사분면·점의 통과 여부로 판정하는 과제.",
        "supportingOrdinals": [
          16
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 16,
          "snippet": "일차방정식을 일차함수 $y=ax+b$ 꼴로 고쳐서 기울기, $y$절편, 지나는 사분면을 파악한다."
        }
      },
      "PT_M2_LINEAR_EQUATION_POINT_SUBSTITUTION": {
        "labelKo": "그래프 위의 점을 이용한 미지수 결정",
        "definition": "일차방정식의 그래프 위에 있는 두 점의 좌표를 각각 대입하여 미지의 계수와 좌표를 구하는 과제.",
        "supportingOrdinals": [
          17
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 17,
          "snippet": "그래프 위의 점의 좌표를 방정식에 대입하면 등식이 성립한다."
        }
      },
      "PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS": {
        "labelKo": "y축에 평행한 직선의 방정식",
        "definition": "한 점을 지나고 y축에 평행한 직선은 그 점의 x좌표가 일정하다는 성질로 직선의 방정식을 구하는 과제.",
        "supportingOrdinals": [
          18
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 18,
          "snippet": "점 $(p, q)$를 지나고 $y$축에 평행한(즉, $x$축에 수직인) 직선의 방정식은 $x = p$이다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION": {
        "labelKo": "연립방정식의 해와 그래프 교점",
        "definition": "두 일차방정식의 그래프의 교점을 두 방정식을 연립한 해로 보고, 그 좌표를 이용해 요구된 값을 계산하는 과제.",
        "supportingOrdinals": [
          19
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 19,
          "snippet": "두 일차방정식의 그래프의 교점의 좌표는 두 일차방정식을 연립하여 푼 해와 같다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_INTERSECTION_QUADRANT": {
        "labelKo": "교점의 사분면 조건으로 매개변수 범위",
        "definition": "두 직선의 교점 좌표를 매개변수로 나타내고, 그 점이 특정 사분면에 있기 위한 부호 조건으로 매개변수의 범위를 구하는 과제.",
        "supportingOrdinals": [
          20
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 20,
          "snippet": "제2사분면 위의 점 $(x, y)$는 $x < 0, y > 0$을 만족한다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP": {
        "labelKo": "계수를 바꾼 연립방정식의 해 복원",
        "definition": "두 미지수의 계수를 잘못 바꾸어 세운 연립방정식과 그 해에서 원래 계수를 복원하고, 처음 연립방정식의 해를 구하는 과제.",
        "supportingOrdinals": [
          21
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 21,
          "snippet": "바꾼 연립방정식에 주어진 해 $x=-1, y=3$을 대입하여 $a, b$를 구한 뒤, 원래의 식에 대입하여 처음 해를 구한다."
        }
      },
      "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_COST": {
        "labelKo": "물건 수량과 총액으로 단가 결정",
        "definition": "두 종류 물건의 수량과 총액에 대한 연립일차방정식을 세워 각 물건의 단가를 결정하는 과제.",
        "supportingOrdinals": [
          22
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 22,
          "snippet": "수량 $\\times$ 단가의 합이 총 금액임을 이용하여 연립방정식을 세우고 가감법으로 푼다."
        }
      },
      "PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE": {
        "labelKo": "고도에 따른 기온 변화 일차함수",
        "definition": "고도가 높아질수록 기온이 일정하게 내려가는 상황을 일차함수 관계식으로 세우고, 주어진 기온에 대응하는 고도를 구하는 과제.",
        "supportingOrdinals": [
          23
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 23,
          "snippet": "고도 단위가 $\\text{km}$이므로 $100\\text{ m}$당 기온 변화를 $1\\text{ km}$당 기온 변화로 환산하여 식을 세운다."
        }
      },
      "PT_M2_LINEAR_FUNCTIONS_GRAPH_INTERSECTION_APPLICATION": {
        "labelKo": "두 운동 그래프의 교점으로 만나는 시각",
        "definition": "두 물체의 시간에 따른 위치를 각각 일차함수로 나타내고, 두 그래프의 교점에서 만나는 시각을 구하는 과제.",
        "supportingOrdinals": [
          24
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 24,
          "snippet": "각 물체의 시간에 따른 위치 그래프에서 두 점을 찾아 일차함수의 식을 구하고, 두 식이 같아지는 $x$값을 구한다."
        }
      }
    },
    "templatePatterns": {
      "TPL_M2_SELECT_REQUIRED_OPERATION_FOR_VARIABLE_ELIMINATION": {
        "labelKo": "미지수 소거용 식 선택 절차",
        "definition": "소거할 미지수의 두 계수를 최소공배수로 같게 만드는 배수를 각 식에 정하고, 계수의 부호가 같으면 빼고 다르면 더하는 식을 구성한다.",
        "supportingOrdinals": [
          1
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 1,
          "snippet": "두 식의 $x$ 계수의 부호가 같으므로 변끼리 빼면 $x$가 소거된다."
        }
      },
      "TPL_M2_FIND_PARAMETER_FOR_NO_SOLUTION_SYSTEM": {
        "labelKo": "해 없음 조건으로 계수 찾기 절차",
        "definition": "두 식의 같은 미지수 계수비와 상수항비를 비교하고, 계수비는 같으나 상수항비는 다르다는 조건을 세워 미지의 계수를 결정한다.",
        "supportingOrdinals": [
          2
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 2,
          "snippet": "$x$의 계수의 비는 $\\dfrac{6}{6} = 1$이고, 상수항의 비는 $\\dfrac{7}{5}$로 서로 다르다."
        }
      },
      "TPL_M2_SOLVE_DECIMAL_SYSTEM_AND_LINEAR_COMBINATION": {
        "labelKo": "소수 계수 정수화 후 일차결합 계산 절차",
        "definition": "각 식의 양변에 10의 거듭제곱을 곱해 소수 계수를 정수로 고치고 연립방정식을 푼 뒤, 구한 해를 요구된 일차결합에 대입해 값을 계산한다.",
        "supportingOrdinals": [
          3
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 3,
          "snippet": "4a + b = 4(5) + (-20) = 20 - 20 = 0"
        }
      },
      "TPL_M2_FIND_PARAMETERS_FROM_TWO_SYSTEMS_WITH_SAME_SOLUTION": {
        "labelKo": "공통해 선계산 후 미정계수 결정 절차",
        "definition": "상수가 모두 주어진 두 식을 먼저 연립해 공통해를 구하고, 그 해를 미정계수가 포함된 나머지 식들에 차례로 대입해 계수를 결정한 뒤 요구된 식의 값을 계산한다.",
        "supportingOrdinals": [
          4
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 4,
          "snippet": "공통인 해는 $x = -3, y = 2$이다."
        }
      },
      "TPL_M2_SOLVE_ROCK_PAPER_SCISSORS_STAIR_PROBLEM": {
        "labelKo": "승패 역관계 연립방정식 절차",
        "definition": "한 사람의 이긴 횟수와 진 횟수를 다른 사람의 진 횟수와 이긴 횟수로 뒤집어, 각 사람의 계단 이동량에 대한 두 방정식을 세우고 두 식의 합과 차로 두 변수의 합을 구한다.",
        "supportingOrdinals": [
          5
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 5,
          "snippet": "광수가 이긴 횟수는 $10$회, 진 횟수는 $8$회이고, 하하가 이긴 횟수는 $8$회, 진 횟수는 $10$회이다."
        }
      },
      "TPL_M2_FIND_THREE_DIGIT_NUMBER_FROM_DIGIT_RELATIONS": {
        "labelKo": "자릿값 연립방정식으로 세 자리 수 복원 절차",
        "definition": "각 자리 숫자를 미지수로 놓고 수를 자릿값의 합으로 표현한 뒤, 자리 숫자 사이의 합 조건과 자리를 바꾼 수의 차 조건으로 연립방정식을 세워 각 자리 숫자를 결정한다.",
        "supportingOrdinals": [
          6
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 6,
          "snippet": "처음 수는 $100x + 10y + 5$이고"
        }
      },
      "TPL_M2_CALCULATE_FUNCTION_VALUE_FOR_PRIME_COUNTING_RULE": {
        "labelKo": "소수 나열 후 함숫값 계산 절차",
        "definition": "함수의 정의에 따라 주어진 수 이하의 소수를 모두 나열하고 그 개수를 세어 함숫값을 결정한다.",
        "supportingOrdinals": [
          7
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 7,
          "snippet": "$15$보다 작거나 같은 소수를 찾으면"
        }
      },
      "TPL_M2_COUNT_VALID_FUNCTIONS_AND_LINEAR_FUNCTIONS": {
        "labelKo": "함수·일차함수 개수 합산 절차",
        "definition": "각 관계식에 대해 입력값마다 함숫값이 하나로 정해지는지 판별해 함수의 개수를 세고, 그중 일차식 꼴로 나타나는 관계의 개수를 세어 두 개수를 더한다.",
        "supportingOrdinals": [
          8
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 8,
          "snippet": "일차함수인 것은 ㄱ, ㄹ로 $b = 2$이다."
        }
      },
      "TPL_M2_FIND_VERTICAL_SHIFT_PASSING_THROUGH_POINT": {
        "labelKo": "y축 평행이동량 결정 절차",
        "definition": "일차함수 식의 상수항에 이동량을 더한 평행이동 식을 세우고, 그래프가 지나는 점의 좌표를 대입해 이동량을 구한다.",
        "supportingOrdinals": [
          9
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 9,
          "snippet": "평행이동한 일차함수의 식을 세운다."
        }
      },
      "TPL_M2_SELECT_FUNCTION_MATCHING_SLOPE_AND_INTERCEPT_CONDITIONS": {
        "labelKo": "기울기 부호·x절편 부호 조건 선별 절차",
        "definition": "각 보기의 기울기 부호를 먼저 확인해 조건을 만족하는 후보를 줄이고, 남은 후보의 x절편을 계산해 두 번째 부호 조건까지 만족하는 식을 선택한다.",
        "supportingOrdinals": [
          10
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 10,
          "snippet": "$x$절편은 $y=0$일 때의 $x$값이다."
        }
      },
      "TPL_M2_CALCULATE_CONE_VOLUME_FROM_INTERCEPT_TRIANGLE": {
        "labelKo": "절편 삼각형 회전 원뿔 부피 절차",
        "definition": "일차함수의 x절편과 y절편을 구해 좌표축과 이루는 직각삼각형의 두 변을 정하고, 회전축과 수직인 변을 밑면 반지름, 회전축 방향 변을 높이로 보아 원뿔의 부피를 계산한다.",
        "supportingOrdinals": [
          11
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 11,
          "snippet": "밑면의 반지름이 $r = 3$이고 높이가 $h = 6$인 원뿔이 된다."
        }
      },
      "TPL_M2_CALCULATE_AREA_BOUNDED_BY_TWO_LINES_AND_AXES": {
        "labelKo": "두 직선·좌표축 둘러싼 넓이 차감 절차",
        "definition": "두 일차함수의 절편으로 큰 직각삼각형과 작은 직각삼각형의 넓이를 각각 구하고, 구하는 영역을 두 넓이의 차로 계산한다.",
        "supportingOrdinals": [
          12
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 12,
          "snippet": "구하는 도형의 넓이는 큰 삼각형에서 작은 삼각형을 뺀 넓이이다."
        }
      },
      "TPL_M2_FIND_PARAMETER_RANGE_AVOIDING_FIRST_QUADRANT": {
        "labelKo": "사분면 회피 매개변수 범위 절차",
        "definition": "그래프가 특정 사분면을 지나지 않기 위한 기울기 부호 조건과 y절편 부호 조건을 각각 부등식으로 세우고, 두 부등식의 공통 범위를 구해 경계값의 합을 계산한다.",
        "supportingOrdinals": [
          13
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 13,
          "snippet": "$y$절편 $-(3+k)$가 $0$ 이하이어야 한다."
        }
      },
      "TPL_M2_FIND_UNKNOWN_COORDINATE_FROM_PARALLEL_SLOPE": {
        "labelKo": "평행 기울기로 좌표 결정 절차",
        "definition": "두 점을 지나는 직선의 기울기를 좌표의 차로 나타내고, 주어진 직선과 평행하므로 두 기울기가 같다는 방정식을 세워 미지의 좌표를 구한다.",
        "supportingOrdinals": [
          14
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 14,
          "snippet": "두 점 $(-1, 3)$과 $(2, k)$를 지나는 직선의 기울기는"
        }
      },
      "TPL_M2_MATCH_LINEAR_EQUATION_GRAPH_FROM_INTERCEPTS": {
        "labelKo": "일차방정식 절편으로 그래프 선택 절차",
        "definition": "일차방정식을 일차함수 꼴로 변형해 x절편과 y절편을 구하고, 두 절편을 지나는 직선과 일치하는 그래프를 보기에서 찾는다.",
        "supportingOrdinals": [
          15
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 15,
          "snippet": "점 $(-2, 0)$과 $(0, 3)$을 지나는 직선을 찾으면 ①번 그림이다."
        }
      },
      "TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH": {
        "labelKo": "일차방정식 그래프 설명 검증 절차",
        "definition": "일차방정식을 일차함수 꼴로 고친 뒤 기울기, y절편, 지나는 사분면, 특정 점의 통과 여부를 각각 계산해 보기의 참·거짓을 판정한다.",
        "supportingOrdinals": [
          16
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 16,
          "snippet": "$y$절편이 $2>0$이므로"
        }
      },
      "TPL_M2_FIND_UNKNOWN_COEFFICIENT_AND_COORDINATE_FROM_LINE": {
        "labelKo": "두 점 대입으로 계수·좌표 결정 절차",
        "definition": "한 점의 좌표를 일차방정식에 대입해 미지의 계수를 먼저 구하고, 완성된 방정식에 다른 점의 좌표를 대입해 미지의 좌표를 구한 뒤 두 값을 더한다.",
        "supportingOrdinals": [
          17
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 17,
          "snippet": "점 $(-3, 1)$을 $3x + by = -12$에 대입한다."
        }
      },
      "TPL_M2_FIND_VERTICAL_LINE_EQUATION_FROM_POINT": {
        "labelKo": "y축 평행 직선의 방정식 구성 절차",
        "definition": "y축에 평행한 직선 위의 모든 점은 x좌표가 같다는 성질을 이용해, 지나는 점의 x좌표를 그대로 상수로 둔 방정식을 세운다.",
        "supportingOrdinals": [
          18
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 18,
          "snippet": "$y$축에 평행한 직선 위의 모든 점은 $x$좌표가 일정하다."
        }
      },
      "TPL_M2_FIND_INTERSECTION_COORDINATE_SUM_FROM_SYSTEM": {
        "labelKo": "연립 풀이로 교점 좌표 합 계산 절차",
        "definition": "두 일차방정식을 연립해 교점의 두 좌표를 구하고, 두 좌표를 더해 요구된 값을 계산한다.",
        "supportingOrdinals": [
          19
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 19,
          "snippet": "교점의 좌표는 $(1, 1)$이므로"
        }
      },
      "TPL_M2_FIND_PARAMETER_RANGE_FOR_INTERSECTION_IN_QUADRANT": {
        "labelKo": "교점 사분면 조건 매개변수 범위 절차",
        "definition": "두 직선의 방정식을 연립해 교점의 두 좌표를 매개변수로 나타내고, 해당 사분면의 두 좌표 부호 조건을 부등식으로 세워 매개변수의 공통 범위를 구한다.",
        "supportingOrdinals": [
          20
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 20,
          "snippet": "교점이 제2사분면 위에 있으려면 $x < 0$이고 $y > 0$이어야 한다."
        }
      },
      "TPL_M2_SOLVE_ORIGINAL_SYSTEM_AFTER_COEFFICIENT_SWAP_DESCRIPTIVE": {
        "labelKo": "계수 교환 연립방정식 복원 서술 절차",
        "definition": "계수를 바꾼 연립방정식에 주어진 해를 대입해 원래의 두 계수를 구하고, 그 계수를 처음 연립방정식에 적용해 다시 풀어 본래의 해를 서술한다.",
        "supportingOrdinals": [
          21
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 21,
          "snippet": "여기에 $x=-1, y=3$을 대입하면"
        }
      },
      "TPL_M2_SOLVE_UNIT_PRICE_SYSTEM_WORD_PROBLEM_DESCRIPTIVE": {
        "labelKo": "수량·총액 연립방정식 단가 서술 절차",
        "definition": "두 물건의 단가를 미지수로 놓고 수량과 총액 조건으로 두 방정식을 세운 뒤, 한 변수를 소거해 각 단가를 구하는 과정을 서술한다.",
        "supportingOrdinals": [
          22
        ],
        "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 22,
          "snippet": "응원 막대 $1$개의 가격을 $x$원, 나팔 $1$개의 가격을 $y$원이라 할 때"
        }
      },
      "TPL_M2_SOLVE_TEMPERATURE_ALTITUDE_WORD_PROBLEM_DESCRIPTIVE": {
        "labelKo": "기온·고도 일차함수 서술 절차",
        "definition": "고도 단위를 환산해 고도 증가에 따른 기온 변화율을 구하고, 이를 일차함수 관계식으로 나타낸 뒤 주어진 기온을 대입해 대응하는 고도를 계산하는 과정을 서술한다.",
        "supportingOrdinals": [
          23
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 23,
          "snippet": "고도가 $x\\text{ km}$ 높아질 때 기온은 $6x^\\circ\\text{C}$ 내려가므로 관계식은"
        }
      },
      "TPL_M2_SOLVE_MOTION_GRAPH_INTERSECTION_WORD_PROBLEM_DESCRIPTIVE": {
        "labelKo": "운동 그래프 교점 서술 절차",
        "definition": "각 물체의 그래프에서 두 점을 읽어 기울기와 y절편으로 일차함수 식을 세우고, 두 식을 같다고 놓아 만나는 시각을 구하는 과정을 서술한다.",
        "supportingOrdinals": [
          24
        ],
        "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
        "owner": "MIDDLE2",
        "evidence": {
          "ordinal": 24,
          "snippet": "두 식이 같아지는 $x$값을 구한다."
        }
      }
    },
    "crossConcepts": {
      "CC_VARIABLE_ELIMINATION": {
        "labelKo": "미지수 소거",
        "definition": "연립방정식의 두 식을 더하거나 빼서 한 미지수를 없애는 조작.",
        "supportingOrdinals": [
          1
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 1,
          "snippet": "두 식의 $x$ 계수의 부호가 같으므로 변끼리 빼면 $x$가 소거된다."
        }
      },
      "CC_LEAST_COMMON_MULTIPLE": {
        "labelKo": "최소공배수",
        "definition": "두 개 이상의 자연수의 공배수 가운데 가장 작은 수.",
        "supportingOrdinals": [
          1
        ],
        "conceptShard": "NUMBER_THEORY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/number-theory.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 1,
          "snippet": "소거하려는 미지수 $x$의 계수는 각각 $3$과 $4$이므로 최소공배수는 $12$이다."
        }
      },
      "CC_PARALLEL_LINES": {
        "labelKo": "평행",
        "definition": "두 직선의 평행 조건을 이용해 기울기나 좌표 관계를 정한다.",
        "supportingOrdinals": [
          2,
          14
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "EXACT_REUSE",
        "evidence": {
          "ordinal": 14,
          "snippet": "두 일차함수의 그래프가 서로 평행하면 기울기가 같다."
        }
      },
      "CC_COEFFICIENT_RATIOS": {
        "labelKo": "계수의 비",
        "definition": "두 일차방정식에서 같은 미지수의 계수끼리 만든 비.",
        "supportingOrdinals": [
          2
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 2,
          "snippet": "$x$의 계수의 비는 $\\dfrac{6}{6} = 1$이고, 상수항의 비는 $\\dfrac{7}{5}$로 서로 다르다."
        }
      },
      "CC_DECIMAL_COEFFICIENTS": {
        "labelKo": "소수 계수",
        "definition": "미지수나 상수에 붙은 계수가 소수로 주어진 상태.",
        "supportingOrdinals": [
          3
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 3,
          "snippet": "계수가 소수인 연립방정식은 각 식의 양변에 $10$의 거듭제곱을 곱하여 정수 계수로 고친 뒤 푼다."
        }
      },
      "CC_LINEAR_COMBINATION": {
        "labelKo": "일차결합",
        "definition": "구한 해를 정해진 상수배만큼 곱하여 더한 식의 값을 계산하는 것.",
        "supportingOrdinals": [
          3
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 3,
          "snippet": "4a + b = 4(5) + (-20) = 20 - 20 = 0"
        }
      },
      "CC_COMMON_SOLUTION": {
        "labelKo": "공통해",
        "definition": "두 개 이상의 방정식을 동시에 만족시키는 같은 해.",
        "supportingOrdinals": [
          4
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 4,
          "snippet": "공통인 해는 $x = -3, y = 2$이다."
        }
      },
      "CC_COEFFICIENT_DETERMINATION": {
        "labelKo": "미정계수 결정",
        "definition": "주어진 해나 조건을 식에 대입하여 아직 정해지지 않은 계수의 값을 구하는 것.",
        "supportingOrdinals": [
          4
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 4,
          "snippet": "해 $(-3, 2)$를 $ax + 2y = -5$에 대입한다."
        }
      },
      "CC_APPLIED_WORD_PROBLEMS": {
        "labelKo": "문장제 모델링",
        "definition": "실생활 상황의 문장 조건을 미지수 사이의 방정식이나 함수 관계로 옮기는 것.",
        "supportingOrdinals": [
          5,
          6,
          22,
          23,
          24
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL_LABEL_NARROWED",
        "preservedGenericKey": true,
        "evidence": {
          "ordinal": 22,
          "snippet": "문제의 조건에 따른 연립방정식은"
        }
      },
      "CC_INVERSE_WIN_LOSS_RELATIONS": {
        "labelKo": "승패의 상호 관계",
        "definition": "비기는 경우가 없을 때 한 사람이 이긴 횟수가 상대가 진 횟수와 같아지는 관계.",
        "supportingOrdinals": [
          5
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 5,
          "snippet": "광수가 이긴 횟수는 $10$회, 진 횟수는 $8$회이고, 하하가 이긴 횟수는 $8$회, 진 횟수는 $10$회이다."
        }
      },
      "CC_PLACE_VALUE": {
        "labelKo": "자릿값",
        "definition": "각 자리의 숫자에 그 자리의 단위를 곱하여 수 전체의 값을 이루는 값.",
        "supportingOrdinals": [
          6
        ],
        "conceptShard": "NUMBER_THEORY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/number-theory.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 6,
          "snippet": "처음 수는 $100x + 10y + 5$이고"
        }
      },
      "CC_FUNCTION_VALUE": {
        "labelKo": "함숫값",
        "definition": "함수에 정의역의 한 값을 대입했을 때 대응하는 값.",
        "supportingOrdinals": [
          7
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 7,
          "snippet": "따라서 $f(15) = 6$이다."
        }
      },
      "CC_PRIME_NUMBERS": {
        "labelKo": "소수",
        "definition": "1보다 큰 자연수 가운데 1과 자기 자신만을 약수로 갖는 수.",
        "supportingOrdinals": [
          7
        ],
        "conceptShard": "NUMBER_THEORY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/number-theory.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 7,
          "snippet": "$15$보다 작거나 같은 소수를 찾으면"
        }
      },
      "CC_NUMBER_OF_ELEMENTS": {
        "labelKo": "원소의 개수",
        "definition": "주어진 조건을 만족하는 대상의 수를 세어 얻은 값.",
        "supportingOrdinals": [
          7
        ],
        "conceptShard": "NUMBER_THEORY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/number-theory.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 7,
          "snippet": "총 $6$개이다."
        }
      },
      "CC_FUNCTION_DEFINITION": {
        "labelKo": "함수의 정의",
        "definition": "정의역의 각 원소마다 공역의 원소가 정확히 하나씩 대응하는 관계이다.",
        "supportingOrdinals": [
          8
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "EXACT_REUSE",
        "evidence": {
          "ordinal": 8,
          "snippet": "오직 하나씩 대응하지 않으므로 함수가 아니다"
        }
      },
      "CC_LINEAR_FUNCTIONS": {
        "labelKo": "일차함수",
        "definition": "y가 x의 일차식으로 나타나고 x의 계수가 0이 아닌 함수.",
        "supportingOrdinals": [
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          23,
          24
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 8,
          "snippet": "일차함수인 것은 ㄱ, ㄹ로 $b = 2$이다."
        }
      },
      "CC_CLASSIFICATION": {
        "labelKo": "분류",
        "definition": "주어진 관계나 식을 정해진 기준에 따라 서로 다른 종류로 나누는 것.",
        "supportingOrdinals": [
          8
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 8,
          "snippet": "함수인 것은 ㄱ, ㄴ, ㄹ로 $a = 3$이다."
        }
      },
      "CC_PARALLEL_TRANSLATION": {
        "labelKo": "평행이동",
        "definition": "도형이나 그래프를 모양과 크기를 바꾸지 않고 일정한 방향으로 같은 거리만큼 옮기는 것.",
        "supportingOrdinals": [
          9
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 9,
          "snippet": "평행이동한 일차함수의 식을 세운다."
        }
      },
      "CC_POINT_SUBSTITUTION": {
        "labelKo": "점의 좌표 대입",
        "definition": "그래프 위의 점이 갖는 x좌표와 y좌표를 식에 넣어 등식을 성립시키는 것.",
        "supportingOrdinals": [
          9,
          17
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 17,
          "snippet": "점 $(-3, 1)$을 $3x + by = -12$에 대입한다."
        }
      },
      "CC_SLOPE_SIGN": {
        "labelKo": "기울기의 부호",
        "definition": "직선이 오른쪽 위로 향하면 양수, 오른쪽 아래로 향하면 음수가 되는 기울기의 성질.",
        "supportingOrdinals": [
          10,
          13
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 10,
          "snippet": "오른쪽 아래를 향하는 직선은 기울기가 음수"
        }
      },
      "CC_X_INTERCEPT": {
        "labelKo": "x절편",
        "definition": "그래프가 x축과 만나는 점의 x좌표.",
        "supportingOrdinals": [
          10
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 10,
          "snippet": "$x$절편은 $y=0$일 때의 $x$값이다."
        }
      },
      "CC_INTERCEPTS": {
        "labelKo": "절편",
        "definition": "그래프가 좌표축과 만나는 점의 좌표.",
        "supportingOrdinals": [
          11,
          12,
          15
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 11,
          "snippet": "$x$절편: $0 = -2x+6 \\implies x = 3$"
        }
      },
      "CC_CONE_VOLUME": {
        "labelKo": "원뿔의 부피",
        "definition": "밑넓이와 높이의 곱의 3분의 1로 구하는 원뿔의 부피.",
        "supportingOrdinals": [
          11
        ],
        "conceptShard": "MIDDLE1",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/middle1.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 11,
          "snippet": "밑면의 반지름이 $r = 3$이고 높이가 $h = 6$인 원뿔이 된다."
        }
      },
      "CC_SOLID_OF_REVOLUTION": {
        "labelKo": "회전체",
        "definition": "평면도형을 한 직선을 축으로 하여 1회전시킬 때 생기는 입체도형.",
        "supportingOrdinals": [
          11
        ],
        "conceptShard": "MIDDLE1",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/middle1.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 11,
          "snippet": "이 도형을 $y$축을 회전축으로 1회전 시키면"
        }
      },
      "CC_POLYGON_AREA": {
        "labelKo": "다각형의 넓이",
        "definition": "다각형을 삼각형 등으로 나누거나 큰 도형에서 작은 도형을 빼서 구하는 평면도형의 넓이.",
        "supportingOrdinals": [
          12
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 12,
          "snippet": "구하는 도형의 넓이는 큰 삼각형에서 작은 삼각형을 뺀 넓이이다."
        }
      },
      "CC_Y_INTERCEPT": {
        "labelKo": "y절편",
        "definition": "그래프가 y축과 만나는 점의 y좌표.",
        "supportingOrdinals": [
          13
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 13,
          "snippet": "$y$절편 $-(3+k)$가 $0$ 이하이어야 한다."
        }
      },
      "CC_QUADRANTS": {
        "labelKo": "사분면",
        "definition": "좌표평면을 두 좌표축이 나누는 네 영역.",
        "supportingOrdinals": [
          13,
          16,
          20
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 20,
          "snippet": "교점이 제2사분면 위에 있으려면 $x < 0$이고 $y > 0$이어야 한다."
        }
      },
      "CC_SLOPE_FORMULA": {
        "labelKo": "기울기 공식",
        "definition": "서로 다른 두 점의 좌표의 차를 이용해 직선의 기울기를 구하는 식.",
        "supportingOrdinals": [
          14
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 14,
          "snippet": "두 점 $(-1, 3)$과 $(2, k)$를 지나는 직선의 기울기는"
        }
      },
      "CC_LINEAR_EQUATIONS_TWO_VARIABLES": {
        "labelKo": "미지수가 2개인 일차방정식",
        "definition": "두 미지수의 일차식으로 이루어진 방정식.",
        "supportingOrdinals": [
          15,
          16,
          17,
          18
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 15,
          "snippet": "일차방정식 $3x - 2y + 6 = 0$을 $y$에 대하여 푼다."
        }
      },
      "CC_GRAPH_MATCHING": {
        "labelKo": "그래프 판별",
        "definition": "주어진 방정식이나 함수의 절편·기울기 성질을 이용해 대응하는 그래프를 찾는 것.",
        "supportingOrdinals": [
          15
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 15,
          "snippet": "점 $(-2, 0)$과 $(0, 3)$을 지나는 직선을 찾으면 ①번 그림이다."
        }
      },
      "CC_SLOPE_AND_INTERCEPT": {
        "labelKo": "기울기와 절편",
        "definition": "직선의 방향을 정하는 기울기와 좌표축과 만나는 위치를 정하는 절편.",
        "supportingOrdinals": [
          16
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 16,
          "snippet": "$y$절편이 $2>0$이므로"
        }
      },
      "CC_ALGEBRAIC_SUM": {
        "labelKo": "두 미지수의 합",
        "definition": "구한 두 미지수의 값을 더하여 요구된 하나의 수를 만드는 계산.",
        "supportingOrdinals": [
          17,
          19
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 17,
          "snippet": "$a + b = 4 + (-3) = 1$"
        }
      },
      "CC_EQUATIONS_PARALLEL_TO_AXES": {
        "labelKo": "좌표축에 평행한 직선의 방정식",
        "definition": "x축에 평행하면 y값이, y축에 평행하면 x값이 일정한 직선의 방정식.",
        "supportingOrdinals": [
          18
        ],
        "conceptShard": "COORDINATE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 18,
          "snippet": "$y$축에 평행한 직선 위의 모든 점은 $x$좌표가 일정하다."
        }
      },
      "CC_COEFFICIENT_SWAP": {
        "labelKo": "계수 교환",
        "definition": "연립방정식에서 두 미지수의 계수 역할을 서로 바꾸어 놓는 것.",
        "supportingOrdinals": [
          21
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 21,
          "snippet": "$a$와 $b$를 바꾼 연립방정식은"
        }
      },
      "CC_UNIT_PRICE": {
        "labelKo": "단가",
        "definition": "물건 한 개의 가격.",
        "supportingOrdinals": [
          22
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 22,
          "snippet": "응원 막대 $1$개의 가격을 $x$원, 나팔 $1$개의 가격을 $y$원이라 할 때"
        }
      },
      "CC_RATE_OF_CHANGE": {
        "labelKo": "변화율",
        "definition": "한 양이 다른 양의 변화에 따라 일정하게 변하는 비율.",
        "supportingOrdinals": [
          23
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY_PROPOSAL",
        "evidence": {
          "ordinal": 23,
          "snippet": "고도가 $x\\text{ km}$ 높아질 때 기온은 $6x^\\circ\\text{C}$ 내려가므로 관계식은"
        }
      },
      "CC_SIMULTANEOUS_LINEAR_EQUATIONS": {
        "labelKo": "연립일차방정식",
        "definition": "둘 이상의 일차방정식을 동시에 만족하는 미지수의 값을 다루는 개념.",
        "supportingOrdinals": [
          1,
          2,
          3,
          4,
          5,
          6,
          19,
          20,
          21,
          22
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY",
        "canonicalDefinition": null,
        "evidence": {
          "ordinal": 4,
          "snippet": "두 연립방정식의 해가 같으므로"
        },
        "canonicalLabelKo": null,
        "rootCorrection": "Existing audit key has narrower canonical meaning; preserve it and add this distinct concept."
      },
      "CC_INTERSECTION_OF_TWO_GRAPHS": {
        "labelKo": "두 그래프의 교점",
        "definition": "두 그래프의 식을 동시에 만족하는 점과 그 좌표.",
        "supportingOrdinals": [
          19,
          20,
          24
        ],
        "conceptShard": "FUNCTIONS",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
        "status": "ADD_ONLY",
        "canonicalDefinition": null,
        "evidence": {
          "ordinal": 19,
          "snippet": "교점의 좌표는 $(1, 1)$이므로"
        },
        "canonicalLabelKo": null,
        "rootCorrection": "Existing audit key has narrower canonical meaning; preserve it and add this distinct concept."
      },
      "CC_SUBSTITUTION_IN_EQUATIONS": {
        "labelKo": "방정식에 대입",
        "definition": "주어진 값을 방정식의 미지수에 넣어 식의 성립 또는 다른 값을 확인하는 방법.",
        "supportingOrdinals": [
          21
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY",
        "canonicalLabelKo": null,
        "canonicalDefinition": null,
        "evidence": {
          "ordinal": 21,
          "snippet": "여기에 $x=-1, y=3$을 대입하면"
        },
        "rootCorrection": "Existing audit key has narrower canonical meaning; preserve it and add this distinct concept."
      }
    }
  },
  "counts": {
    "rows": 24,
    "uniqueProblemTypes": 24,
    "uniqueTemplatePatterns": 24,
    "uniqueCrossConcepts": 39,
    "crossConceptsExactReuse": 2,
    "crossConceptsReuseKeyWithDefinitionConflict": 3,
    "crossConceptsAddOnly": 34,
    "units": 2,
    "subUnits": 4
  },
  "integrity": {
    "auditedKeysPreservedVerbatim": true,
    "spellingDuplicatesNormalized": false,
    "sourceUnitNamespaceAdopted": false,
    "canonicalUnitMappingVerifiedByRoot": true,
    "numericAuditSubUnitKeysReplaced": true,
    "studentContentModified": false,
    "registrarWritten": false,
    "executed": false,
    "mathReSolved": false
  },
  "blockers": []
};
