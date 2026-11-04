export default {
  "schema": "NOV04_M2_DEFINITIONS_V1",
  "generatedAt": "2026-11-04",
  "examSlug": "22_풍덕중_1학기_기말_중2_수학",
  "examTitle": "2022학년도 순천풍덕중 2학년 1학기 기말고사 수학",
  "sourceFile": "nov04-4-source.js",
  "auditFile": "nov04-4-audit.json",
  "reviewFile": "nov04-drift.mjs",
  "reviewer": {
    "agent": "OpenCode",
    "model": "deepseek-v4.1-flash",
    "provider": "opencode-go"
  },
  "authorization": {
    "basis": "USER_AND_ROOT_AUTHORIZED_CORRECTIVE_METADATA_WITH_CURRENT_SOURCE_REVIEW",
    "scope": "Metadata definitions and canonical unit/subunit/PT/TPL/CC assignment only.",
    "studentContentPolicy": "Preserved. No statement, choice, answer, solution, score, level or visual is edited by this file.",
    "mathPolicy": "No re-solving. Definitions are semantic readings of the already-solved current source solutions.",
    "auditPolicy": "Original audit fields are preserved per row. The original audit is not asserted correct where its answer/parameters/trace conflict with the current source."
  },
  "auditVersusSource": {
    "auditDeclaredSha256": "d7b32b4a064acb0214f5b16cfa2fb55e473ad64b0cb0150fdceacb619e64c080",
    "declaredShaStatus": "HISTORICAL_AUDIT_VALUE_PRESERVED_UNMODIFIED",
    "currentSourceSha256": null,
    "currentSourceShaStatus": "NOT_COMPUTED_NO_EXECUTION",
    "note": "The original audit/manifest SHA is historical and is not overwritten or claimed current. Current-source answers below are read from the solved source and are not a math re-solve. The original audit is not asserted correct where these differ.",
    "answerOrParameterConflicts": [
      {
        "ordinal": 1,
        "auditAnswer": "⑤",
        "currentAnswer": "②",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 2,
        "auditAnswer": "②",
        "currentAnswer": "④",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 3,
        "auditAnswer": "①",
        "currentAnswer": "③",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 5,
        "auditAnswer": "②",
        "currentAnswer": "⑤",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 7,
        "auditAnswer": "⑤",
        "currentAnswer": "④",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 8,
        "auditAnswer": "③",
        "currentAnswer": "②",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 9,
        "auditAnswer": "①",
        "currentAnswer": "①",
        "driftClass": "TRACE_ONLY_DRIFT",
        "note": "Audit trace uses (a+17)/4 and a≤-13; current solution uses denominator 10 and a≤-7."
      },
      {
        "ordinal": 10,
        "auditAnswer": "③",
        "currentAnswer": "⑤",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 11,
        "auditAnswer": "①",
        "currentAnswer": "②",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 12,
        "auditAnswer": "②",
        "currentAnswer": "③",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 14,
        "auditAnswer": "①",
        "currentAnswer": "①",
        "driftClass": "PARAMETER_AND_TRACE_DRIFT",
        "note": "Audit trace 35/2−14=7/2; current source 34−24=10."
      },
      {
        "ordinal": 16,
        "auditAnswer": "③, ④",
        "currentAnswer": "①, ⑤",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 17,
        "auditAnswer": "④",
        "currentAnswer": "④",
        "driftClass": "PARAMETER_AND_TRACE_DRIFT",
        "note": "Audit trace 85°; current source 90°."
      },
      {
        "ordinal": 18,
        "auditAnswer": "③",
        "currentAnswer": "⑤",
        "driftClass": "CONTENT_DRIFT",
        "note": "Audit stops at rhombus; current solution concludes square."
      },
      {
        "ordinal": 23,
        "auditAnswer": "33 L 이상",
        "currentAnswer": "15 L 이상",
        "driftClass": "CONTENT_DRIFT"
      },
      {
        "ordinal": 25,
        "auditAnswer": "audit ①~⑤ sequence",
        "currentAnswer": "current ① 다른 한 쌍의 대변도 평행하다; ② 이웃하는 두 변의 길이가 같다; ③ 한 내각의 크기가 직각이다; ④ 한 내각의 크기가 직각이다; ⑤ 이웃하는 두 변의 길이가 같다",
        "driftClass": "CONTENT_DRIFT"
      }
    ]
  },
  "pack": {
    "packId": "MIDDLE2",
    "canonicalStatus": "EXISTING_ADD_ONLY_CANDIDATE",
    "candidatePath": "archive/data/meta-foundation/canonical/packs/middle2",
    "packAbsenceAcknowledged": false,
    "curriculum": "2015",
    "standardCourses": [
      "중2",
      "M2-1",
      "중2-1",
      "중2 수학",
      "M2-2",
      "중2-2"
    ],
    "ownedStandardUnitDomainsCurrent": [
      "M2-03",
      "M2-04"
    ],
    "requestedDomainExpansions": [
      "M2-01",
      "M2-02"
    ],
    "geometryOwnerPack": "MIDDLE_GEOMETRY",
    "geometryOwnedDomains": [
      "M2-05",
      "M2-06"
    ],
    "parentRpmPath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
    "note": "MIDDLE2 is the current candidate pack for 중2 algebra. It currently owns M2-03/M2-04 from nov04-6; this exam additively requests M2-01/M2-02. Geometry rows bind the already-active MIDDLE_GEOMETRY pack, which owns M2-05/M2-06.",
    "ownedStandardUnitDomains": [
      "M2-03",
      "M2-04",
      "M2-01",
      "M2-02"
    ]
  },
  "canonicalInspections": [
    {
      "kind": "standardUnitMapping",
      "canonicalSource": "archive/data/master_tables/js_archive_tag_master.json",
      "verifiedRows": [
        {
          "key": "M2-01",
          "labelKo": "수와 식",
          "subUnits": [
            "M2-01-REPEATING_DECIMAL",
            "M2-01-EXPONENT_LAW",
            "M2-01-POLYNOMIAL_OPERATIONS"
          ]
        },
        {
          "key": "M2-02",
          "labelKo": "일차부등식",
          "subUnits": [
            "M2-02-LINEAR_INEQUALITY",
            "M2-02-LINEAR_INEQUALITY_WORD"
          ]
        },
        {
          "key": "M2-05",
          "labelKo": "사각형의 성질",
          "subUnits": [
            "M2-05-QUADRILATERAL_PROPERTIES",
            "M2-05-TRIANGLE_PROPERTIES"
          ]
        }
      ],
      "verdict": "CONTENT_MAPPING_REQUIRED",
      "rationale": "The current source labels 식의 계산 as M2-02, 일차부등식 as M2-03, and 사각형의 성질 as M2-06. Canonical content says M2-02 is 일차부등식, M2-03 is 연립일차방정식, and M2-06 is 도형의 닮음. The source labels are therefore an old namespace and are not adopted. Actual content is mapped to M2-01/M2-02/M2-05."
    },
    {
      "kind": "parentRpmRows",
      "canonicalSource": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "exactRowsUsed": [
        {
          "curriculum": "2015",
          "scope": "M2-1",
          "majorUnit": "식의 계산",
          "midUnit": "단항식의 계산"
        },
        {
          "curriculum": "2015",
          "scope": "M2-1",
          "majorUnit": "식의 계산",
          "midUnit": "다항식의 계산"
        },
        {
          "curriculum": "2015",
          "scope": "M2-1",
          "majorUnit": "일차부등식과 연립일차방정식",
          "midUnit": "일차부등식"
        },
        {
          "curriculum": "2015",
          "scope": "M2-1",
          "majorUnit": "일차부등식과 연립일차방정식",
          "midUnit": "일차부등식의 활용"
        },
        {
          "curriculum": "2015",
          "scope": "M2-2",
          "majorUnit": "사각형의 성질",
          "midUnit": "평행사변형"
        },
        {
          "curriculum": "2015",
          "scope": "M2-2",
          "majorUnit": "사각형의 성질",
          "midUnit": "여러 가지 사각형"
        }
      ],
      "verdict": "EXACT_ROWS_IDENTIFIED",
      "rationale": "Each row below names one exact curriculum/scope/majorUnit/midUnit tuple. No fallback parent is used."
    },
    {
      "kind": "packBinding",
      "canonicalSource": "archive/data/meta-foundation/canonical/packs/middle2/pack.json; archive/data/meta-foundation/canonical/packs/middle-geometry/pack.json",
      "middle2CurrentDomains": [
        "M2-03",
        "M2-04"
      ],
      "middle2RequestedDomains": [
        "M2-01",
        "M2-02"
      ],
      "middleGeometryCurrentDomains": [
        "M2-05",
        "M2-06"
      ],
      "verdict": "COMPATIBLE_PACK_SELECTED_PER_ROW",
      "rationale": "Algebra rows bind MIDDLE2 because it is the current 중2 algebra candidate; M2-01/M2-02 are additive domain expansions. Geometry rows bind MIDDLE_GEOMETRY because M2-05 is already an ACTIVE owned domain there. No row is re-homed into a pack that does not own its canonical unit."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_EXPONENT_RULES",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "지수법칙",
      "canonicalDefinition": "지수의 덧셈, 뺄셈, 곱셈 기본 성질",
      "verdict": "EXACT_REUSE",
      "rationale": "Q1 and Q22 use the basic exponent laws directly. Canonical key, label, definition and ALGEBRA shard are reused unchanged."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_TRIANGLE_AREA",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
      "canonicalLabelKo": "삼각형의 넓이",
      "canonicalDefinition": "밑변과 높이 또는 좌표를 이용하여 삼각형의 넓이를 구하는 개념.",
      "verdict": "EXACT_REUSE",
      "rationale": "Q2, Q14, Q20 and Q21 compute or compare triangle areas from base and height. Canonical definition is exact."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_DECIMAL_COEFFICIENTS",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "소수 계수",
      "canonicalDefinition": "미지수나 상수에 붙은 계수가 소수로 주어진 상태.",
      "verdict": "EXACT_REUSE",
      "rationale": "Q7 contains decimal coefficients that must be cleared. Canonical definition is exact."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_APPLIED_WORD_PROBLEMS",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "문장제 모델링",
      "canonicalDefinition": "실생활 상황의 문장 조건을 미지수 사이의 방정식이나 함수 관계로 옮기는 것.",
      "verdict": "EXACT_REUSE",
      "rationale": "Q10 and Q23 translate real-life conditions into inequalities. Canonical definition is exact."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_TRIANGLE_CONGRUENCE",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
      "canonicalLabelKo": "삼각형의 합동과 대응 요소",
      "canonicalDefinition": "합동인 두 삼각형에서 대응변의 길이와 대응각의 크기가 각각 같다는 성질 및 합동 조건(SSS, SAS, ASA)",
      "verdict": "EXACT_REUSE",
      "rationale": "Q3 uses the congruence of the two folded triangles ADE and AFE. Canonical definition is exact."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_PERPENDICULAR_BISECTOR",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
      "canonicalLabelKo": "선분의 수직이등분선",
      "canonicalDefinition": "두 점에서 같은 거리에 있는 점의 자취로서 수직이등분선을 사용하는 개념.",
      "verdict": "EXACT_REUSE_WITH_CONTEXT_NOTE",
      "rationale": "Q17 uses the fact that the diagonals of a rhombus are perpendicular bisectors of each other. The canonical key and definition are retained; the item applies the perpendicular-bisector property inside a rhombus, not as a locus construction."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_POLYNOMIAL_DIVISION",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
      "canonicalLabelKo": "다항식의 나눗셈",
      "canonicalDefinition": "다항식의 나눗셈 항등식, 몫과 나머지, 제곱인수 나눗셈의 함수값·도함수 관계를 사용하는 개념.",
      "verdict": "KEY_EXISTS_ACTUAL_CONCEPT_DIFFERS_NEW_KEY",
      "rationale": "Q2 divides a polynomial area by a monomial base to find a height. It does not use the polynomial-division identity, remainder/quotient theorem, or derivative relation in the canonical definition. Canonical definition is not edited; this exam uses CC_POLYNOMIAL_DIVISION_BY_MONOMIAL additively."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_PARALLEL_LINES",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/coordinate-geometry.json",
      "canonicalLabelKo": "평행",
      "canonicalDefinition": "두 직선의 평행 조건을 이용해 기울기나 좌표 관계를 정한다.",
      "verdict": "KEY_EXISTS_ACTUAL_CONCEPT_DIFFERS_NEW_KEY",
      "rationale": "Q21 uses parallel lines in a plane-geometry equal-area transformation, not coordinate slope. Canonical definition is not edited; this exam uses CC_PARALLEL_LINES_EQUAL_AREA additively."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_ANGLE_BISECTOR",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
      "canonicalLabelKo": "각의 이등분선",
      "canonicalDefinition": "각의 이등분선이(가) Primary L1~L4 밖에서 정답에 도달하는 결정적 풀이 경로에 실제로 필요한 경우에만 기록한다.",
      "verdict": "KEY_EXISTS_DEFINITION_IS_META_NOT_CONCEPT_NEW_KEY",
      "rationale": "The canonical definition is an evidence-recording rule, not the geometric property used in Q12 and Q15. It is not edited; this exam uses CC_ANGLE_BISECTOR_PROPERTY additively for the actual equal-angle division property."
    },
    {
      "kind": "canonicalCrossConcept",
      "key": "CC_CLASSIFICATION",
      "canonicalFile": "archive/data/meta-foundation/canonical/concepts/functions.json",
      "canonicalLabelKo": "분류",
      "canonicalDefinition": "관계식의 최고차항 차수에 따라 일차함수·이차함수·삼차함수로 분류한다.",
      "verdict": "KEY_EXISTS_ACTUAL_CONCEPT_DIFFERS_NEW_KEY",
      "rationale": "Q19 classifies quadrilaterals by diagonal properties, not functions by degree. Canonical definition is not edited; this exam uses CC_QUADRILATERAL_CLASSIFICATION additively."
    },
    {
      "kind": "problemTypeAndTemplate",
      "verdict": "NO_CANONICAL_M2_PT_TPL_IDENTIFIERS",
      "rationale": "No PT_M2_/TPL_M2_/PT_MG_/TPL_MG_ identifier exists in the inspected canonical packs. All PT/TPL definitions below are additive under their audited keys. The single audited Q18 PT/TPL that stops at rhombus is not reused for a square-classification item; a distinct additive PT/TPL pair is used and the original audit keys are preserved on the row."
    }
  ],
  "rows": [
    {
      "ordinal": 1,
      "sourceQuestionId": 1,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-01",
      "standardUnit": "수와 식",
      "subUnitKey": "M2-01-EXPONENT_LAW",
      "subUnit": "지수법칙",
      "L1": "식의 계산",
      "L2": "단항식의 계산",
      "primaryTaxonomy": "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION",
      "templatePattern": "TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS",
      "crossConcepts": [
        "CC_EXPONENT_RULES",
        "CC_MONOMIAL_DIVISION",
        "CC_ALGEBRAIC_SIMPLIFICATION"
      ],
      "originalCrossConcepts": [
        "CC_EXPONENT_RULES",
        "CC_MONOMIAL_DIVISION",
        "CC_ALGEBRAIC_SIMPLIFICATION"
      ],
      "auditUnitKeyOriginal": "M2-02",
      "auditSubUnitKeyOriginal": "M2-02-01",
      "sourceUnitKeyOriginal": "M2-02",
      "sourceSubUnitKeyOriginal": "M2-02-EXPONENT_LAWS",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Audit M2-02/M2-02-01 and source M2-02/M2-02-EXPONENT_LAWS both place 식의 계산 under M2-02, but canonical M2-02 is 일차부등식. Actual content is M2-01 수와 식 / M2-01-EXPONENT_LAW. Audit and source originals preserved; no answer or trace is asserted correct.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION",
      "auditTemplatePatternOriginal": "TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS"
    },
    {
      "ordinal": 2,
      "sourceQuestionId": 2,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-01",
      "standardUnit": "수와 식",
      "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
      "subUnit": "다항식의 계산",
      "L1": "식의 계산",
      "L2": "다항식의 계산",
      "primaryTaxonomy": "PT_M2_POLYNOMIAL_DIVISION_GEOMETRIC_AREA",
      "templatePattern": "TPL_M2_FIND_TRIANGLE_HEIGHT_FROM_POLYNOMIAL_AREA",
      "crossConcepts": [
        "CC_TRIANGLE_AREA",
        "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL",
        "CC_ALGEBRAIC_MODELING"
      ],
      "originalCrossConcepts": [
        "CC_TRIANGLE_AREA",
        "CC_POLYNOMIAL_DIVISION",
        "CC_ALGEBRAIC_MODELING"
      ],
      "auditUnitKeyOriginal": "M2-02",
      "auditSubUnitKeyOriginal": "M2-02-02",
      "sourceUnitKeyOriginal": "M2-02",
      "sourceSubUnitKeyOriginal": "M2-02-POLYNOMIAL_ARITHMETIC",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Canonical M2-02 is 일차부등식, so the audited/source M2-02 placement of 다항식의 계산 is rejected. Actual content is M2-01 수와 식 / M2-01-POLYNOMIAL_OPERATIONS. CC_POLYNOMIAL_DIVISION is not reused because its canonical definition is a different polynomial-division concept; a distinct additive key is used.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_POLYNOMIAL_DIVISION_GEOMETRIC_AREA",
      "auditTemplatePatternOriginal": "TPL_M2_FIND_TRIANGLE_HEIGHT_FROM_POLYNOMIAL_AREA"
    },
    {
      "ordinal": 3,
      "sourceQuestionId": 3,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-01",
      "standardUnit": "수와 식",
      "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
      "subUnit": "다항식의 계산",
      "L1": "식의 계산",
      "L2": "다항식의 계산",
      "primaryTaxonomy": "PT_M2_POLYNOMIAL_GEOMETRIC_FOLDING_AREA",
      "templatePattern": "TPL_M2_CALCULATE_FOLDED_TRIANGLE_AREA_WITH_VARIABLES",
      "crossConcepts": [
        "CC_RECTANGLE_AREA",
        "CC_POLYNOMIAL_MULTIPLICATION",
        "CC_GEOMETRIC_FOLDING",
        "CC_TRIANGLE_CONGRUENCE"
      ],
      "originalCrossConcepts": [
        "CC_RECTANGLE_AREA",
        "CC_POLYNOMIAL_MULTIPLICATION",
        "CC_GEOMETRIC_FOLDING"
      ],
      "auditUnitKeyOriginal": "M2-02",
      "auditSubUnitKeyOriginal": "M2-02-02",
      "sourceUnitKeyOriginal": "M2-02",
      "sourceSubUnitKeyOriginal": "M2-02-POLYNOMIAL_ARITHMETIC",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual folded-area content is M2-01-POLYNOMIAL_OPERATIONS, not canonical M2-02. CC_TRIANGLE_CONGRUENCE is added because the current solution explicitly uses the congruence of triangles ADE and AFE. ROOT must visually inspect q03.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_POLYNOMIAL_GEOMETRIC_FOLDING_AREA",
      "auditTemplatePatternOriginal": "TPL_M2_CALCULATE_FOLDED_TRIANGLE_AREA_WITH_VARIABLES"
    },
    {
      "ordinal": 4,
      "sourceQuestionId": 4,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-01",
      "standardUnit": "수와 식",
      "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
      "subUnit": "다항식의 계산",
      "L1": "식의 계산",
      "L2": "다항식의 계산",
      "primaryTaxonomy": "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION",
      "templatePattern": "TPL_M2_RESTORE_CORRECT_POLYNOMIAL_CALCULATION",
      "crossConcepts": [
        "CC_POLYNOMIAL_ADDITION",
        "CC_POLYNOMIAL_SUBTRACTION",
        "CC_ERROR_CORRECTION"
      ],
      "originalCrossConcepts": [
        "CC_POLYNOMIAL_ADDITION",
        "CC_POLYNOMIAL_SUBTRACTION",
        "CC_ERROR_CORRECTION"
      ],
      "auditUnitKeyOriginal": "M2-02",
      "auditSubUnitKeyOriginal": "M2-02-02",
      "sourceUnitKeyOriginal": "M2-02",
      "sourceSubUnitKeyOriginal": "M2-02-POLYNOMIAL_ARITHMETIC",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Actual polynomial addition/subtraction correction is M2-01-POLYNOMIAL_OPERATIONS, not canonical M2-02. Audit answer matches the current source but the audit unit namespace is corrected.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION",
      "auditTemplatePatternOriginal": "TPL_M2_RESTORE_CORRECT_POLYNOMIAL_CALCULATION"
    },
    {
      "ordinal": 5,
      "sourceQuestionId": 5,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY",
      "subUnit": "일차부등식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION",
      "templatePattern": "TPL_M2_SELECT_VALID_LINEAR_INEQUALITIES",
      "crossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_POLYNOMIAL_DEGREE",
        "CC_INEQUALITY_IDENTIFICATION"
      ],
      "originalCrossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_POLYNOMIAL_DEGREE",
        "CC_INEQUALITY_IDENTIFICATION"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-INEQUALITY_PROPERTIES",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Audit/source M2-03 is 연립일차방정식 in canonical master; actual 일차부등식 identification belongs to M2-02-LINEAR_INEQUALITY. The audit answer ② and its ㄱ,ㅁ trace conflict with the current source, whose solution selects ㄱ,ㄷ,ㅁ (⑤); the original audit key and trace are not asserted correct.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION",
      "auditTemplatePatternOriginal": "TPL_M2_SELECT_VALID_LINEAR_INEQUALITIES"
    },
    {
      "ordinal": 6,
      "sourceQuestionId": 6,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY",
      "subUnit": "일차부등식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식",
      "primaryTaxonomy": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
      "templatePattern": "TPL_M2_EVALUATE_INEQUALITY_TRANSFORMATION_PROPERTIES",
      "crossConcepts": [
        "CC_INEQUALITY_PROPERTIES",
        "CC_NEGATIVE_MULTIPLICATION",
        "CC_DIRECTION_OF_INEQUALITY"
      ],
      "originalCrossConcepts": [
        "CC_INEQUALITY_PROPERTIES",
        "CC_NEGATIVE_MULTIPLICATION",
        "CC_DIRECTION_OF_INEQUALITY"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-01",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-INEQUALITY_PROPERTIES",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Actual inequality-property true/false content belongs to M2-02-LINEAR_INEQUALITY, not canonical M2-03. Answer ③ agrees with the current source; the unit namespace is corrected.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
      "auditTemplatePatternOriginal": "TPL_M2_EVALUATE_INEQUALITY_TRANSFORMATION_PROPERTIES"
    },
    {
      "ordinal": 7,
      "sourceQuestionId": 7,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY",
      "subUnit": "일차부등식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_SOLVING",
      "templatePattern": "TPL_M2_SOLVE_FRACTIONAL_DECIMAL_INEQUALITY_CHECK",
      "crossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_FRACTION_COEFFICIENTS",
        "CC_DECIMAL_COEFFICIENTS"
      ],
      "originalCrossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_FRACTION_COEFFICIENTS",
        "CC_DECIMAL_COEFFICIENTS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-SOLVE_INEQUALITY",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Actual fractional/decimal inequality solving belongs to M2-02-LINEAR_INEQUALITY. The audit answer ⑤ conflicts with the current source, which selects ④; the original audit trace is not reused.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_SOLVING",
      "auditTemplatePatternOriginal": "TPL_M2_SOLVE_FRACTIONAL_DECIMAL_INEQUALITY_CHECK"
    },
    {
      "ordinal": 8,
      "sourceQuestionId": 8,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY",
      "subUnit": "일차부등식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM",
      "templatePattern": "TPL_M2_CALCULATE_SUM_OF_NATURAL_SOLUTIONS_TO_INEQUALITY",
      "crossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_FRACTION_COEFFICIENTS",
        "CC_NATURAL_NUMBER_SUM"
      ],
      "originalCrossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_FRACTION_COEFFICIENTS",
        "CC_NATURAL_NUMBER_SUM"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-SOLVE_INEQUALITY",
      "level": "중",
      "difficultyRank": 2,
      "correctionReason": "Actual natural-solution-sum content belongs to M2-02-LINEAR_INEQUALITY. Audit answer ③/trace x<6 and sum 15 conflict with the current source x<22/7 and sum 6 (②); the original audit trace is not asserted correct.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM",
      "auditTemplatePatternOriginal": "TPL_M2_CALCULATE_SUM_OF_NATURAL_SOLUTIONS_TO_INEQUALITY"
    },
    {
      "ordinal": 9,
      "sourceQuestionId": 9,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY",
      "subUnit": "일차부등식",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_NO_NATURAL_ROOTS",
      "templatePattern": "TPL_M2_FIND_PARAMETER_RANGE_FOR_NO_NATURAL_SOLUTIONS",
      "crossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_NUMBER_LINE",
        "CC_BOUNDARY_VALUE_ANALYSIS"
      ],
      "originalCrossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_NUMBER_LINE",
        "CC_BOUNDARY_VALUE_ANALYSIS"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-02",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-SOLVE_INEQUALITY",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual no-natural-solution boundary analysis belongs to M2-02-LINEAR_INEQUALITY. Audit answer ① survives, but its (a+17)/4 trace and a≤-13 conclusion conflict with the current source denominator 10 and a≤-7; the audit trace is not reused.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_NO_NATURAL_ROOTS",
      "auditTemplatePatternOriginal": "TPL_M2_FIND_PARAMETER_RANGE_FOR_NO_NATURAL_SOLUTIONS"
    },
    {
      "ordinal": 10,
      "sourceQuestionId": 10,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
      "subUnit": "일차부등식의 활용",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식의 활용",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED",
      "templatePattern": "TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY",
      "crossConcepts": [
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_SPEED_DISTANCE_TIME",
        "CC_LINEAR_INEQUALITIES"
      ],
      "originalCrossConcepts": [
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_SPEED_DISTANCE_TIME",
        "CC_LINEAR_INEQUALITIES"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-03",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-INEQUALITY_APPLICATION",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual round-trip time-limit word problem belongs to M2-02-LINEAR_INEQUALITY_WORD. Audit answer ③ (7/3 km) conflicts with the current source x≤8/3 km (⑤); the original audit trace is not asserted correct.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED",
      "auditTemplatePatternOriginal": "TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY"
    },
    {
      "ordinal": 11,
      "sourceQuestionId": 11,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "평행사변형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER",
      "templatePattern": "TPL_MG_CALCULATE_PARALLELOGRAM_SIDE_FROM_RATIO_AND_PERIMETER",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RATIO_AND_PROPORTION",
        "CC_PERIMETER"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RATIO_AND_PROPORTION",
        "CC_PERIMETER"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-01",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLELOGRAM_PROPERTIES",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Audit MG-02 is not a canonical middle2 geometry unit; source M2-06 is canonical 도형의 닮음. Actual parallelogram side/ratio content belongs to canonical M2-05 사각형의 성질 / M2-05-QUADRILATERAL_PROPERTIES, owned by MIDDLE_GEOMETRY. Audit answer ① and 45/8 trace conflict with current source AB=9 cm (②).",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER",
      "auditTemplatePatternOriginal": "TPL_MG_CALCULATE_PARALLELOGRAM_SIDE_FROM_RATIO_AND_PERIMETER"
    },
    {
      "ordinal": 12,
      "sourceQuestionId": 12,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "평행사변형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT",
      "templatePattern": "TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_ANGLE_BISECTOR_PROPERTY",
        "CC_ISOSCELES_TRIANGLES"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_ANGLE_BISECTOR",
        "CC_ISOSCELES_TRIANGLES"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-01",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLELOGRAM_PROPERTIES",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual two-angle-bisector segment content belongs to M2-05-QUADRILATERAL_PROPERTIES. Canonical CC_ANGLE_BISECTOR has a meta recording definition, so the distinct CC_ANGLE_BISECTOR_PROPERTY is used. Audit answer ② conflicts with current source EF=3 cm (③). ROOT must inspect q12.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT",
      "auditTemplatePatternOriginal": "TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS"
    },
    {
      "ordinal": 13,
      "sourceQuestionId": 13,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "평행사변형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION",
      "templatePattern": "TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_COUNTEREXAMPLE_CONDITION",
        "CC_ALTERNATE_INTERIOR_ANGLES"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_TRIANGLE_CONGRUENCE"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-01",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLELOGRAM_CONDITIONS",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Actual condition-discrimination content belongs to M2-05-QUADRILATERAL_PROPERTIES. The current solution uses alternate interior angles and an insufficiency/counterexample reading; it does not use triangle congruence. CC_TRIANGLE_CONGRUENCE is preserved only in originalCrossConcepts and replaced by precise actual concepts.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION",
      "auditTemplatePatternOriginal": "TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION"
    },
    {
      "ordinal": 14,
      "sourceQuestionId": 14,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "평행사변형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_INTERNAL_POINT_AREA",
      "templatePattern": "TPL_MG_CALCULATE_OPPOSITE_TRIANGLE_AREA_FROM_INTERNAL_POINT",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_TRIANGLE_AREA",
        "CC_INTERNAL_POINT_PROPERTIES"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_TRIANGLE_AREA",
        "CC_INTERNAL_POINT_PROPERTIES"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-01",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLELOGRAM_PROPERTIES",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual internal-point opposite-triangle area belongs to M2-05-QUADRILATERAL_PROPERTIES. Audit answer ① survives, but its 35/2−14 trace conflicts with the current source total area 68 and ABP=24 giving 34−24=10; the audit trace is not reused.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_INTERNAL_POINT_AREA",
      "auditTemplatePatternOriginal": "TPL_MG_CALCULATE_OPPOSITE_TRIANGLE_AREA_FROM_INTERNAL_POINT"
    },
    {
      "ordinal": 15,
      "sourceQuestionId": 15,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE",
      "templatePattern": "TPL_MG_EVALUATE_RECTANGLE_FORMED_BY_PARALLELOGRAM_BISECTORS",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RECTANGLES",
        "CC_ANGLE_BISECTOR_PROPERTY"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RECTANGLES",
        "CC_ANGLE_BISECTOR"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-RECTANGLE_PROPERTIES",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual rectangle-from-four-bisectors content belongs to M2-05-QUADRILATERAL_PROPERTIES under 여러 가지 사각형. Canonical CC_ANGLE_BISECTOR is meta-defined, so CC_ANGLE_BISECTOR_PROPERTY is used. Answer ⑤ agrees with the current source.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE",
      "auditTemplatePatternOriginal": "TPL_MG_EVALUATE_RECTANGLE_FORMED_BY_PARALLELOGRAM_BISECTORS"
    },
    {
      "ordinal": 16,
      "sourceQuestionId": 16,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS",
      "templatePattern": "TPL_MG_SELECT_NON_RECTANGLE_CONDITIONS_FOR_PARALLELOGRAM",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RECTANGLES",
        "CC_RHOMBUS"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RECTANGLES",
        "CC_RHOMBUS"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-RECTANGLE_PROPERTIES",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual rectangle-condition selection belongs to M2-05-QUADRILATERAL_PROPERTIES under 여러 가지 사각형. Audit answer ③,④ conflicts with current source choices, whose non-rectangle conditions are ①,⑤.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS",
      "auditTemplatePatternOriginal": "TPL_MG_SELECT_NON_RECTANGLE_CONDITIONS_FOR_PARALLELOGRAM"
    },
    {
      "ordinal": 17,
      "sourceQuestionId": 17,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES",
      "templatePattern": "TPL_MG_CALCULATE_SUM_OF_ANGLES_IN_RHOMBUS",
      "crossConcepts": [
        "CC_RHOMBUS",
        "CC_PERPENDICULAR_BISECTOR",
        "CC_ANGLE_RELATIONS"
      ],
      "originalCrossConcepts": [
        "CC_RHOMBUS",
        "CC_PERPENDICULAR_BISECTOR",
        "CC_ANGLE_RELATIONS"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-RHOMBUS_PROPERTIES",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Actual rhombus diagonal-angle content belongs to M2-05-QUADRILATERAL_PROPERTIES under 여러 가지 사각형. Audit answer ④ survives, but its 85° trace conflicts with the current source 90°; the audit trace is not reused. ROOT must inspect q17.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES",
      "auditTemplatePatternOriginal": "TPL_MG_CALCULATE_SUM_OF_ANGLES_IN_RHOMBUS"
    },
    {
      "ordinal": 18,
      "sourceQuestionId": 18,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_TO_SQUARE_CLASSIFICATION",
      "templatePattern": "TPL_MG_CLASSIFY_SQUARE_FROM_PARALLELOGRAM_ANGLE_EQUALITIES",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RHOMBUS",
        "CC_ISOSCELES_TRIANGLES",
        "CC_SQUARE_CLASSIFICATION"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_RHOMBUS",
        "CC_ISOSCELES_TRIANGLES"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-RHOMBUS_PROPERTIES",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_TO_RHOMBUS_CONDITIONS",
      "auditTemplatePatternOriginal": "TPL_MG_IDENTIFY_RHOMBUS_FROM_PARALLELOGRAM_ANGLES",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "The current solution does not stop at rhombus: it derives rhombus, then rectangle, then square (⑤). The audited rhombus PT/TPL is only an intermediate and is not reused as the final task type. A distinct additive square-classification PT/TPL pair and CC_SQUARE_CLASSIFICATION are used; audit keys remain recorded. ROOT must inspect q18.png; no visual inspection is claimed."
    },
    {
      "ordinal": 19,
      "sourceQuestionId": 19,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH",
      "templatePattern": "TPL_MG_COUNT_QUADRILATERALS_WITH_EQUAL_DIAGONALS",
      "crossConcepts": [
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_DIAGONALS",
        "CC_QUADRILATERAL_CLASSIFICATION"
      ],
      "originalCrossConcepts": [
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_DIAGONALS",
        "CC_CLASSIFICATION"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-VARIOUS_QUADRILATERALS",
      "level": "하",
      "difficultyRank": 1,
      "correctionReason": "Actual equal-diagonal quadrilateral counting belongs to M2-05-QUADRILATERAL_PROPERTIES. Canonical CC_CLASSIFICATION defines function classification by degree, so the distinct CC_QUADRILATERAL_CLASSIFICATION is used. Answer ③ agrees with the current source.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH",
      "auditTemplatePatternOriginal": "TPL_MG_COUNT_QUADRILATERALS_WITH_EQUAL_DIAGONALS"
    },
    {
      "ordinal": 20,
      "sourceQuestionId": 20,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_TRAPEZOID_TRIANGLES_AREA_RATIO",
      "templatePattern": "TPL_MG_CALCULATE_SIDE_TRIANGLE_AREA_IN_TRAPEZOID",
      "crossConcepts": [
        "CC_TRAPEZOID",
        "CC_TRIANGLE_AREA",
        "CC_AREA_RATIO"
      ],
      "originalCrossConcepts": [
        "CC_TRAPEZOID",
        "CC_TRIANGLE_AREA",
        "CC_AREA_RATIO"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLEL_AND_AREA",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual trapezoid side-triangle area ratio belongs to M2-05-QUADRILATERAL_PROPERTIES. Audit MG-02-03 is not a canonical subUnit. Answer ② (14 cm²) agrees with the current source.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_TRAPEZOID_TRIANGLES_AREA_RATIO",
      "auditTemplatePatternOriginal": "TPL_MG_CALCULATE_SIDE_TRIANGLE_AREA_IN_TRAPEZOID"
    },
    {
      "ordinal": 21,
      "sourceQuestionId": 21,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION",
      "templatePattern": "TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL",
      "crossConcepts": [
        "CC_PARALLEL_LINES_EQUAL_AREA",
        "CC_EQUAL_AREA_TRANSFORMATION",
        "CC_TRIANGLE_AREA"
      ],
      "originalCrossConcepts": [
        "CC_PARALLEL_LINES",
        "CC_EQUAL_AREA_TRANSFORMATION",
        "CC_TRIANGLE_AREA"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-03",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLEL_AND_AREA",
      "level": "하",
      "difficultyRank": 2,
      "correctionReason": "Actual equal-area transformation under a parallel condition belongs to M2-05-QUADRILATERAL_PROPERTIES. Canonical CC_PARALLEL_LINES is coordinate-slope defined, so CC_PARALLEL_LINES_EQUAL_AREA is used. Answer ① agrees. ROOT must inspect q21.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION",
      "auditTemplatePatternOriginal": "TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL"
    },
    {
      "ordinal": 22,
      "sourceQuestionId": 22,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-01",
      "standardUnit": "수와 식",
      "subUnitKey": "M2-01-EXPONENT_LAW",
      "subUnit": "지수법칙",
      "L1": "식의 계산",
      "L2": "단항식의 계산",
      "primaryTaxonomy": "PT_M2_POLYNOMIAL_CYLINDER_VOLUME_RATIO",
      "templatePattern": "TPL_M2_CALCULATE_VOLUME_RATIO_OF_TWO_REVOLVED_CYLINDERS_DESCRIPTIVE",
      "crossConcepts": [
        "CC_EXPONENT_RULES",
        "CC_POLYNOMIAL_MULTIPLICATION",
        "CC_CYLINDER_VOLUME",
        "CC_VOLUME_RATIO"
      ],
      "originalCrossConcepts": [
        "CC_POLYNOMIAL_MULTIPLICATION",
        "CC_CYLINDER_VOLUME",
        "CC_VOLUME_RATIO"
      ],
      "auditUnitKeyOriginal": "M2-02",
      "auditSubUnitKeyOriginal": "M2-02-01",
      "sourceUnitKeyOriginal": "M2-02",
      "sourceSubUnitKeyOriginal": "M2-02-MONOMIAL_GEOMETRY",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual cylinder-volume ratio from monomial side lengths belongs to M2-01 수와 식 / M2-01-EXPONENT_LAW, not canonical M2-02. CC_EXPONENT_RULES is added because the volume simplification uses exponent laws. Answer 3b/4a agrees. ROOT must inspect q22.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_POLYNOMIAL_CYLINDER_VOLUME_RATIO",
      "auditTemplatePatternOriginal": "TPL_M2_CALCULATE_VOLUME_RATIO_OF_TWO_REVOLVED_CYLINDERS_DESCRIPTIVE"
    },
    {
      "ordinal": 23,
      "sourceQuestionId": 23,
      "pack": "MIDDLE2",
      "packRequiresExpansion": true,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-1",
      "parentRpmScope": "M2-1",
      "standardUnitKey": "M2-02",
      "standardUnit": "일차부등식",
      "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
      "subUnit": "일차부등식의 활용",
      "L1": "일차부등식과 연립일차방정식",
      "L2": "일차부등식의 활용",
      "primaryTaxonomy": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_WATER_TANK",
      "templatePattern": "TPL_M2_SOLVE_WATER_TANK_CAPACITY_INEQUALITY_DESCRIPTIVE",
      "crossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_FRACTION_ARITHMETIC"
      ],
      "originalCrossConcepts": [
        "CC_LINEAR_INEQUALITIES",
        "CC_APPLIED_WORD_PROBLEMS",
        "CC_FRACTION_ARITHMETIC"
      ],
      "auditUnitKeyOriginal": "M2-03",
      "auditSubUnitKeyOriginal": "M2-03-03",
      "sourceUnitKeyOriginal": "M2-03",
      "sourceSubUnitKeyOriginal": "M2-03-INEQUALITY_APPLICATION",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual water-tank capacity inequality belongs to M2-02-LINEAR_INEQUALITY_WORD. Audit answer 33 L and its one-third-remaining inequality conflict with the current statement/solution, which uses two-thirds remaining and x≥15 L.",
      "auditPrimaryTaxonomyOriginal": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_WATER_TANK",
      "auditTemplatePatternOriginal": "TPL_M2_SOLVE_WATER_TANK_CAPACITY_INEQUALITY_DESCRIPTIVE"
    },
    {
      "ordinal": 24,
      "sourceQuestionId": 24,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "평행사변형",
      "primaryTaxonomy": "PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC",
      "templatePattern": "TPL_MG_WRITE_FIVE_PARALLELOGRAM_CONDITIONS_IN_SYMBOLS_DESCRIPTIVE",
      "crossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_MATHEMATICAL_SYMBOLS",
        "CC_GEOMETRIC_CONDITIONS"
      ],
      "originalCrossConcepts": [
        "CC_PARALLELOGRAMS",
        "CC_MATHEMATICAL_SYMBOLS",
        "CC_GEOMETRIC_CONDITIONS"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-01",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-PARALLELOGRAM_CONDITIONS",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual five parallelogram conditions in symbols belongs to M2-05-QUADRILATERAL_PROPERTIES under 평행사변형. Answer content agrees; only notation differs. ROOT must inspect q24.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC",
      "auditTemplatePatternOriginal": "TPL_MG_WRITE_FIVE_PARALLELOGRAM_CONDITIONS_IN_SYMBOLS_DESCRIPTIVE"
    },
    {
      "ordinal": 25,
      "sourceQuestionId": 25,
      "pack": "MIDDLE_GEOMETRY",
      "packRequiresExpansion": false,
      "curriculum": "2015",
      "standardCourse": "중2 수학",
      "sourceStandardCourse": "중2-2",
      "parentRpmScope": "M2-2",
      "standardUnitKey": "M2-05",
      "standardUnit": "사각형의 성질",
      "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
      "subUnit": "사각형의 성질",
      "L1": "사각형의 성질",
      "L2": "여러 가지 사각형",
      "primaryTaxonomy": "PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS",
      "templatePattern": "TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE",
      "crossConcepts": [
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_QUADRILATERAL_HIERARCHY",
        "CC_SUFFICIENT_CONDITIONS"
      ],
      "originalCrossConcepts": [
        "CC_QUADRILATERAL_PROPERTIES",
        "CC_QUADRILATERAL_HIERARCHY",
        "CC_SUFFICIENT_CONDITIONS"
      ],
      "auditUnitKeyOriginal": "MG-02",
      "auditSubUnitKeyOriginal": "MG-02-02",
      "sourceUnitKeyOriginal": "M2-06",
      "sourceSubUnitKeyOriginal": "M2-06-VARIOUS_QUADRILATERALS",
      "level": "중",
      "difficultyRank": 3,
      "correctionReason": "Actual quadrilateral-hierarchy condition completion belongs to M2-05-QUADRILATERAL_PROPERTIES under 여러 가지 사각형. Audit blank ordering conflicts with the current source's ①~⑤ mapping; the audit sequence is preserved only as provenance. ROOT must inspect q25.png; no visual inspection is claimed.",
      "auditPrimaryTaxonomyOriginal": "PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS",
      "auditTemplatePatternOriginal": "TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE"
    }
  ],
  "definitions": {
    "units": {
      "M2-01": {
        "labelKo": "수와 식",
        "definition": "유리수와 순환소수, 지수법칙, 다항식의 사칙계산을 묶어 문자를 포함한 식을 다루는 중2-1 단원.",
        "supportingOrdinals": [
          1,
          2,
          3,
          4,
          22
        ],
        "L1": "수와 식",
        "parentRpmScope": "M2-1",
        "owner": "MIDDLE2"
      },
      "M2-02": {
        "labelKo": "일차부등식",
        "definition": "부등식의 성질을 이용해 일차부등식을 풀고, 그 해를 실생활 문제에 적용하는 중2-1 단원.",
        "supportingOrdinals": [
          5,
          6,
          7,
          8,
          9,
          10,
          23
        ],
        "L1": "일차부등식과 연립일차방정식",
        "parentRpmScope": "M2-1",
        "owner": "MIDDLE2"
      },
      "M2-05": {
        "labelKo": "사각형의 성질",
        "definition": "평행사변형·직사각형·마름모·정사각형·등변사다리꼴의 변·각·대각선 성질과 포함 관계를 다루는 중2-2 단원.",
        "supportingOrdinals": [
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
          21,
          24,
          25
        ],
        "L1": "사각형의 성질",
        "parentRpmScope": "M2-2",
        "owner": "MIDDLE_GEOMETRY"
      }
    },
    "subUnits": {
      "M2-01-EXPONENT_LAW": {
        "labelKo": "지수법칙",
        "definition": "거듭제곱의 곱셈·나눗셈과 거듭제곱의 거듭제곱에서 지수를 계산하는 규칙.",
        "supportingOrdinals": [
          1,
          22
        ],
        "standardUnitKey": "M2-01",
        "L1": "식의 계산",
        "L2": "단항식의 계산",
        "owner": "MIDDLE2"
      },
      "M2-01-POLYNOMIAL_OPERATIONS": {
        "labelKo": "다항식의 계산",
        "definition": "다항식의 덧셈·뺄셈·곱셈·나눗셈을 분배법칙과 동류항 정리로 수행하는 개념.",
        "supportingOrdinals": [
          2,
          3,
          4
        ],
        "standardUnitKey": "M2-01",
        "L1": "식의 계산",
        "L2": "다항식의 계산",
        "owner": "MIDDLE2"
      },
      "M2-02-LINEAR_INEQUALITY": {
        "labelKo": "일차부등식",
        "definition": "부등식의 성질로 일차부등식을 풀고 해의 범위를 구하는 개념.",
        "supportingOrdinals": [
          5,
          6,
          7,
          8,
          9
        ],
        "standardUnitKey": "M2-02",
        "L1": "일차부등식과 연립일차방정식",
        "L2": "일차부등식",
        "owner": "MIDDLE2"
      },
      "M2-02-LINEAR_INEQUALITY_WORD": {
        "labelKo": "일차부등식의 활용",
        "definition": "실생활 조건을 일차부등식으로 세워 미지수의 범위를 구하는 개념.",
        "supportingOrdinals": [
          10,
          23
        ],
        "standardUnitKey": "M2-02",
        "L1": "일차부등식과 연립일차방정식",
        "L2": "일차부등식의 활용",
        "owner": "MIDDLE2"
      },
      "M2-05-QUADRILATERAL_PROPERTIES": {
        "labelKo": "사각형의 성질",
        "definition": "평행사변형과 여러 가지 사각형의 변·각·대각선 성질 및 판정 조건을 이용하는 개념.",
        "supportingOrdinals": [
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
          21,
          24,
          25
        ],
        "standardUnitKey": "M2-05",
        "L1": "사각형의 성질",
        "L2": "여러 가지 사각형",
        "owner": "MIDDLE_GEOMETRY"
      }
    },
    "problemTypes": {
      "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION": {
        "labelKo": "단항식 곱셈·나눗셈의 옳고 그름 판별",
        "definition": "여러 단항식 곱셈·나눗셈 계산식 중에서 지수법칙과 계수 계산을 적용한 결과가 옳지 않은 하나를 고르는 과제.",
        "supportingOrdinals": [
          1
        ],
        "subUnitKey": "M2-01-EXPONENT_LAW",
        "owner": "MIDDLE2"
      },
      "PT_M2_POLYNOMIAL_DIVISION_GEOMETRIC_AREA": {
        "labelKo": "다항식 넓이에서 삼각형 높이 계산",
        "definition": "삼각형의 넓이를 다항식으로 주고 밑변의 길이로 나누어 높이를 구하는 과제.",
        "supportingOrdinals": [
          2
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "owner": "MIDDLE2"
      },
      "PT_M2_POLYNOMIAL_GEOMETRIC_FOLDING_AREA": {
        "labelKo": "접힌 삼각형의 넓이 계산",
        "definition": "직사각형에서 한 변을 접어 만든 삼각형의 넓이를 문자를 포함한 식으로 구하는 과제.",
        "supportingOrdinals": [
          3
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "owner": "MIDDLE2"
      },
      "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION": {
        "labelKo": "잘못 더한 다항식의 바른 계산 복원",
        "definition": "어떤 식에서 빼야 할 식을 잘못 더한 결과가 주어졌을 때, 원래 식을 거꾸로 구해 바르게 계산하는 과제.",
        "supportingOrdinals": [
          4
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION": {
        "labelKo": "일차부등식 판별",
        "definition": "여러 부등식을 정리했을 때 미지수의 일차식만 남는지 판별하여 일차부등식을 모두 고르는 과제.",
        "supportingOrdinals": [
          5
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "owner": "MIDDLE2"
      },
      "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE": {
        "labelKo": "부등식 성질 적용의 옳고 그름 판별",
        "definition": "부등식의 양변에 수를 더하거나 곱하고 나눌 때 성질을 옳게 적용한 보기를 찾는 과제.",
        "supportingOrdinals": [
          6
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_SOLVING": {
        "labelKo": "일차부등식 풀이 결과 검증",
        "definition": "여러 일차부등식의 풀이 결과 중 옳지 않은 것을 찾는 과제.",
        "supportingOrdinals": [
          7
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM": {
        "labelKo": "부등식의 자연수 해 합 계산",
        "definition": "일차부등식을 만족시키는 자연수를 모두 구해 그 합을 계산하는 과제.",
        "supportingOrdinals": [
          8
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_NO_NATURAL_ROOTS": {
        "labelKo": "자연수 해가 없을 조건의 매개변수 범위",
        "definition": "일차부등식이 자연수 해를 갖지 않도록 하는 문자의 값의 범위를 구하는 과제.",
        "supportingOrdinals": [
          9
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED": {
        "labelKo": "왕복 이동 시간 제한 활용",
        "definition": "갈 때와 올 때의 속력과 구매 시간이 주어진 상황에서 시간의 합이 제한 이하가 되는 거리 범위를 구하는 과제.",
        "supportingOrdinals": [
          10
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
        "owner": "MIDDLE2"
      },
      "PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER": {
        "labelKo": "평행사변형 둘레와 변의 비로 한 변 계산",
        "definition": "평행사변형의 둘레와 이웃하는 두 변의 비가 주어졌을 때 특정 변의 길이를 구하는 과제.",
        "supportingOrdinals": [
          11
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT": {
        "labelKo": "평행사변형의 각 이등분선이 만드는 선분 계산",
        "definition": "평행사변형에서 두 내각의 이등분선이 만드는 겹치는 선분의 길이를 구하는 과제.",
        "supportingOrdinals": [
          12
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION": {
        "labelKo": "평행사변형이 되지 않는 조건 판별",
        "definition": "제시된 사각형의 조건 중 평행사변형임을 보장하지 않는 것을 찾는 과제.",
        "supportingOrdinals": [
          13
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_INTERNAL_POINT_AREA": {
        "labelKo": "평행사변형 내부 점과 반대 삼각형 넓이",
        "definition": "평행사변형 내부의 한 점과 두 대변으로 만든 삼각형의 넓이 관계를 이용해 다른 삼각형의 넓이를 구하는 과제.",
        "supportingOrdinals": [
          14
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE": {
        "labelKo": "평행사변형 내각 이등분선이 만드는 사각형의 성질 판정",
        "definition": "평행사변형의 네 내각 이등분선의 교점으로 만든 사각형이 어떤 성질을 갖는지 판정하는 과제.",
        "supportingOrdinals": [
          15
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS": {
        "labelKo": "평행사변형이 직사각형이 되는 조건 선별",
        "definition": "평행사변형이 직사각형이 되기 위한 조건이 아닌 보기를 두 개 고르는 과제.",
        "supportingOrdinals": [
          16
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES": {
        "labelKo": "마름모 대각선과 두 각의 합 계산",
        "definition": "마름모의 두 대각선이 만나는 점을 이용해 주어진 두 각의 합을 구하는 과제.",
        "supportingOrdinals": [
          17
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLELOGRAM_TO_SQUARE_CLASSIFICATION": {
        "labelKo": "평행사변형에서 정사각형 판별",
        "definition": "평행사변형의 각과 변에 주어진 조건을 이용해 최종적으로 정사각형임을 판별하는 과제.",
        "supportingOrdinals": [
          18
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY",
        "supersedesAuditKey": "PT_MG_PARALLELOGRAM_TO_RHOMBUS_CONDITIONS"
      },
      "PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH": {
        "labelKo": "대각선의 길이가 같은 사각형 개수 세기",
        "definition": "여러 사각형 중 두 대각선의 길이가 같은 사각형의 개수를 세는 과제.",
        "supportingOrdinals": [
          19
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_TRAPEZOID_TRIANGLES_AREA_RATIO": {
        "labelKo": "사다리꼴 대각선 비로 삼각형 넓이 계산",
        "definition": "사다리꼴에서 한 삼각형의 넓이와 대각선의 분할 비가 주어졌을 때 다른 삼각형의 넓이를 구하는 과제.",
        "supportingOrdinals": [
          20
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION": {
        "labelKo": "평행선 조건으로 넓이가 같은 삼각형 찾기",
        "definition": "주어진 사각형과 삼각형의 넓이가 같아지도록 하는 평행 조건을 찾는 과제.",
        "supportingOrdinals": [
          21
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_M2_POLYNOMIAL_CYLINDER_VOLUME_RATIO": {
        "labelKo": "직사각형 회전체 두 부피의 비",
        "definition": "직사각형을 서로 다른 두 변을 축으로 회전시켜 생기는 두 원기둥의 부피 비를 문자식으로 구하는 과제.",
        "supportingOrdinals": [
          22
        ],
        "subUnitKey": "M2-01-EXPONENT_LAW",
        "owner": "MIDDLE2"
      },
      "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_WATER_TANK": {
        "labelKo": "물탱크 용량 부등식 활용",
        "definition": "물을 채운 뒤 일부를 사용하고 남는 양의 하한이 주어졌을 때 처음 물의 양의 범위를 구하는 과제.",
        "supportingOrdinals": [
          23
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
        "owner": "MIDDLE2"
      },
      "PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC": {
        "labelKo": "평행사변형이 되는 다섯 조건의 기호 표현",
        "definition": "사각형이 평행사변형이 되는 다섯 가지 조건을 수학 기호로 각각 나타내는 과제.",
        "supportingOrdinals": [
          24
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS": {
        "labelKo": "사각형 계통도에서 단계별 추가 조건 완성",
        "definition": "일반 사각형에서 평행사변형·마름모·직사각형·정사각형으로 발전하는 계통도의 빈칸에 필요한 조건을 쓰는 과제.",
        "supportingOrdinals": [
          25
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "owner": "MIDDLE_GEOMETRY"
      }
    },
    "templatePatterns": {
      "TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS": {
        "labelKo": "지수법칙 적용 단항식 계산 검증 절차",
        "definition": "각 보기의 계수와 문자 부분을 분리해 거듭제곱의 곱·나눗셈 규칙으로 간단히 한 뒤, 제시된 결과와 비교해 옳지 않은 보기를 찾는다.",
        "supportingOrdinals": [
          1
        ],
        "subUnitKey": "M2-01-EXPONENT_LAW",
        "parent": "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION",
        "owner": "MIDDLE2"
      },
      "TPL_M2_FIND_TRIANGLE_HEIGHT_FROM_POLYNOMIAL_AREA": {
        "labelKo": "다항식 나눗셈으로 높이 결정 절차",
        "definition": "삼각형 넓이 공식을 높이에 대해 정리하고, 넓이의 2배를 밑변의 길이로 나누어 다항식 나눗셈을 수행한다.",
        "supportingOrdinals": [
          2
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "parent": "PT_M2_POLYNOMIAL_DIVISION_GEOMETRIC_AREA",
        "owner": "MIDDLE2"
      },
      "TPL_M2_CALCULATE_FOLDED_TRIANGLE_AREA_WITH_VARIABLES": {
        "labelKo": "접기 합동을 이용한 삼각형 넓이 절차",
        "definition": "접어서 겹치는 두 삼각형이 합동임을 이용해 넓이가 같은 삼각형을 찾고, 그 밑변과 높이를 문자식으로 세워 넓이를 계산한다.",
        "supportingOrdinals": [
          3
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "parent": "PT_M2_POLYNOMIAL_GEOMETRIC_FOLDING_AREA",
        "owner": "MIDDLE2"
      },
      "TPL_M2_RESTORE_CORRECT_POLYNOMIAL_CALCULATION": {
        "labelKo": "오연산 되돌림 다항식 복원 절차",
        "definition": "잘못 더한 결과에서 더해 버린 식을 두 번 빼거나, 먼저 원래 식을 구한 뒤 빼야 할 식을 빼서 바른 결과를 구한다.",
        "supportingOrdinals": [
          4
        ],
        "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
        "parent": "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION",
        "owner": "MIDDLE2"
      },
      "TPL_M2_SELECT_VALID_LINEAR_INEQUALITIES": {
        "labelKo": "일차부등식 여부 선별 절차",
        "definition": "각 부등식의 양변을 정리해 미지수의 최고차항이 소거되는지 확인하고, 일차식만 남는 보기를 모두 선택한다.",
        "supportingOrdinals": [
          5
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "parent": "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION",
        "owner": "MIDDLE2"
      },
      "TPL_M2_EVALUATE_INEQUALITY_TRANSFORMATION_PROPERTIES": {
        "labelKo": "부등식 변형 성질 검증 절차",
        "definition": "각 보기에서 양변에 같은 수를 더하거나 곱하는 단계를 추적하고, 음수를 곱하거나 나눌 때 부등호 방향이 바뀌는지 확인한다.",
        "supportingOrdinals": [
          6
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "parent": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
        "owner": "MIDDLE2"
      },
      "TPL_M2_SOLVE_FRACTIONAL_DECIMAL_INEQUALITY_CHECK": {
        "labelKo": "분수·소수 계수 일차부등식 검증 절차",
        "definition": "분수나 소수 계수를 정수로 고친 뒤 이항과 나눗셈을 수행하고, 제시된 해와 비교해 옳지 않은 보기를 찾는다.",
        "supportingOrdinals": [
          7
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "parent": "PT_M2_LINEAR_INEQUALITY_SOLVING",
        "owner": "MIDDLE2"
      },
      "TPL_M2_CALCULATE_SUM_OF_NATURAL_SOLUTIONS_TO_INEQUALITY": {
        "labelKo": "자연수 해 나열 후 합산 절차",
        "definition": "부등식을 풀어 해의 범위를 구한 뒤, 그 범위에 속하는 자연수를 나열하고 모두 더한다.",
        "supportingOrdinals": [
          8
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "parent": "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM",
        "owner": "MIDDLE2"
      },
      "TPL_M2_FIND_PARAMETER_RANGE_FOR_NO_NATURAL_SOLUTIONS": {
        "labelKo": "경계값 비교로 자연수 해 없음 판정 절차",
        "definition": "부등식을 정리해 해의 상한을 문자로 나타내고, 가장 작은 자연수도 해가 되지 않도록 하는 경계 부등식을 세워 문자의 범위를 구한다.",
        "supportingOrdinals": [
          9
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY",
        "parent": "PT_M2_LINEAR_INEQUALITY_NO_NATURAL_ROOTS",
        "owner": "MIDDLE2"
      },
      "TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY": {
        "labelKo": "왕복 시간 합 부등식 모델링 절차",
        "definition": "편도 거리를 미지수로 두고 갈 때·올 때의 시간과 머무는 시간을 더한 식을 세워 제한 시간 이하라는 부등식을 풀고 거리 범위를 구한다.",
        "supportingOrdinals": [
          10
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
        "parent": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED",
        "owner": "MIDDLE2"
      },
      "TPL_MG_CALCULATE_PARALLELOGRAM_SIDE_FROM_RATIO_AND_PERIMETER": {
        "labelKo": "둘레 절반을 비례배분하는 변 계산 절차",
        "definition": "평행사변형의 둘레를 2로 나누어 이웃하는 두 변의 합을 구하고, 주어진 비에 따라 그 합을 비례배분해 각 변의 길이를 구한다.",
        "supportingOrdinals": [
          11
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS": {
        "labelKo": "각 이등분선과 이등변삼각형을 이용한 선분 계산 절차",
        "definition": "평행선의 엇각과 각의 이등분선으로 생기는 이등변삼각형을 찾아 같은 길이의 변을 표시하고, 전체 변의 길이에서 겹치는 부분을 빼거나 더해 원하는 선분을 구한다.",
        "supportingOrdinals": [
          12
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION": {
        "labelKo": "평행사변형 판정 조건의 반례 검토 절차",
        "definition": "평행사변형이 되는 다섯 가지 조건과 비교해 각 보기가 충분조건인지 확인하고, 조건을 만족해도 평행사변형이 아닌 반례가 가능한 보기를 찾는다.",
        "supportingOrdinals": [
          13
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_CALCULATE_OPPOSITE_TRIANGLE_AREA_FROM_INTERNAL_POINT": {
        "labelKo": "내부 점 삼각형 넓이 합 반분 절차",
        "definition": "평행사변형 내부의 점에서 마주 보는 두 변에 만든 삼각형의 넓이 합이 전체 넓이의 절반임을 이용해, 주어진 삼각형 넓이를 전체 넓이의 절반에서 빼 원하는 넓이를 구한다.",
        "supportingOrdinals": [
          14
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_INTERNAL_POINT_AREA",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_EVALUATE_RECTANGLE_FORMED_BY_PARALLELOGRAM_BISECTORS": {
        "labelKo": "이등분선 교각으로 직사각형 성질 검증 절차",
        "definition": "이웃하는 두 내각의 합이 180도임을 이용해 이등분선이 만나는 각이 직각임을 보이고, 만들어진 사각형이 직사각형임을 확인한 뒤 각 성질의 참·거짓을 판정한다.",
        "supportingOrdinals": [
          15
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_SELECT_NON_RECTANGLE_CONDITIONS_FOR_PARALLELOGRAM": {
        "labelKo": "직사각형 조건과 마름모 조건 구별 절차",
        "definition": "한 내각이 직각이거나 두 대각선의 길이가 같다는 직사각형 조건과, 이웃변의 길이가 같거나 두 대각선이 수직이라는 마름모 조건을 구별해 직사각형을 보장하지 않는 보기를 선택한다.",
        "supportingOrdinals": [
          16
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_CALCULATE_SUM_OF_ANGLES_IN_RHOMBUS": {
        "labelKo": "마름모 대각선의 수직 성질로 각 합 계산 절차",
        "definition": "마름모의 두 대각선이 서로 수직이등분함을 이용해 직각삼각형을 찾고, 그 직각삼각형의 두 예각의 합이 직각임을 이용해 두 각의 합을 구한다.",
        "supportingOrdinals": [
          17
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_CLASSIFY_SQUARE_FROM_PARALLELOGRAM_ANGLE_EQUALITIES": {
        "labelKo": "마름모와 직사각형 조건을 결합한 정사각형 판별 절차",
        "definition": "이등변삼각형의 두 밑각이 같아 이웃변의 길이가 같아지면 마름모임을 보이고, 이어서 이웃한 두 꼭짓각이 같아져 직각이 되면 정사각형임을 결론짓는다.",
        "supportingOrdinals": [
          18
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_TO_SQUARE_CLASSIFICATION",
        "owner": "MIDDLE_GEOMETRY",
        "supersedesAuditKey": "TPL_MG_IDENTIFY_RHOMBUS_FROM_PARALLELOGRAM_ANGLES"
      },
      "TPL_MG_COUNT_QUADRILATERALS_WITH_EQUAL_DIAGONALS": {
        "labelKo": "사각형별 대각선 성질 분류 후 개수 합산 절차",
        "definition": "각 사각형의 대각선 성질을 확인해 길이가 항상 같은 것과 그렇지 않은 것을 분류하고, 해당하는 사각형의 개수를 센다.",
        "supportingOrdinals": [
          19
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_CALCULATE_SIDE_TRIANGLE_AREA_IN_TRAPEZOID": {
        "labelKo": "사다리꼴 평행선 비와 삼각형 넓이비 절차",
        "definition": "평행한 두 밑변에 의해 대각선이 나뉘는 비를 이용해 삼각형들의 넓이비를 정하고, 주어진 넓이에 그 비를 차례로 적용해 원하는 삼각형의 넓이를 구한다.",
        "supportingOrdinals": [
          20
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_TRAPEZOID_TRIANGLES_AREA_RATIO",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL": {
        "labelKo": "공통 밑변 삼각형의 등적변형 조건 절차",
        "definition": "두 도형에서 공통인 삼각형을 제외하고 남은 두 삼각형의 넓이가 같아야 함을 이용해, 공통 밑변에 대한 높이가 같아지는 평행 조건을 찾는다.",
        "supportingOrdinals": [
          21
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_M2_CALCULATE_VOLUME_RATIO_OF_TWO_REVOLVED_CYLINDERS_DESCRIPTIVE": {
        "labelKo": "회전축에 따른 원기둥 부피비 계산 절차",
        "definition": "각 회전축에 수직인 변을 반지름, 회전축 방향의 변을 높이로 보아 두 원기둥의 부피를 각각 구하고, 공통 인수를 약분해 부피의 비를 간단히 한다.",
        "supportingOrdinals": [
          22
        ],
        "subUnitKey": "M2-01-EXPONENT_LAW",
        "parent": "PT_M2_POLYNOMIAL_CYLINDER_VOLUME_RATIO",
        "owner": "MIDDLE2"
      },
      "TPL_M2_SOLVE_WATER_TANK_CAPACITY_INEQUALITY_DESCRIPTIVE": {
        "labelKo": "사용 후 잔량 부등식 모델링 절차",
        "definition": "처음 물의 양을 미지수로 두고 채운 양을 더한 뒤 사용한 비율을 반영한 잔량식을 세워, 잔량이 기준 이상이라는 부등식을 풀어 처음 양의 범위를 구한다.",
        "supportingOrdinals": [
          23
        ],
        "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
        "parent": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_WATER_TANK",
        "owner": "MIDDLE2"
      },
      "TPL_MG_WRITE_FIVE_PARALLELOGRAM_CONDITIONS_IN_SYMBOLS_DESCRIPTIVE": {
        "labelKo": "평행사변형 판정 조건 기호화 절차",
        "definition": "대변의 평행, 대변의 길이, 대각의 크기, 대각선의 이등분, 한 쌍의 대변의 평행과 길이 같음을 각각 기호를 사용한 조건식으로 표현한다.",
        "supportingOrdinals": [
          24
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC",
        "owner": "MIDDLE_GEOMETRY"
      },
      "TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE": {
        "labelKo": "사각형 포함 관계 계통도 조건 완성 절차",
        "definition": "직전 사각형에 어떤 성질을 추가하면 다음 사각형이 되는지 판단해, 각 단계의 포함 관계를 만족시키는 충분조건을 차례로 서술한다.",
        "supportingOrdinals": [
          25
        ],
        "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
        "parent": "PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS",
        "owner": "MIDDLE_GEOMETRY"
      }
    },
    "crossConcepts": {
      "CC_EXPONENT_RULES": {
        "labelKo": "지수법칙",
        "definition": "지수의 덧셈, 뺄셈, 곱셈 기본 성질",
        "supportingOrdinals": [
          1,
          22
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "EXACT_REUSE"
      },
      "CC_MONOMIAL_DIVISION": {
        "labelKo": "단항식의 나눗셈",
        "definition": "단항식을 단항식으로 나눌 때 계수끼리 나누고, 같은 문자끼리 지수를 빼며, 분모로 내려간 문자는 음의 지수로 처리하는 계산.",
        "supportingOrdinals": [
          1
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_ALGEBRAIC_SIMPLIFICATION": {
        "labelKo": "식의 간단히 하기",
        "definition": "곱셈·나눗셈과 거듭제곱을 차례로 계산해 하나의 단항식 또는 다항식으로 정리하는 것.",
        "supportingOrdinals": [
          1
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_TRIANGLE_AREA": {
        "labelKo": "삼각형의 넓이",
        "definition": "밑변과 높이 또는 좌표를 이용하여 삼각형의 넓이를 구하는 개념.",
        "supportingOrdinals": [
          2,
          14,
          20,
          21
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "EXACT_REUSE"
      },
      "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL": {
        "labelKo": "다항식을 단항식으로 나누기",
        "definition": "다항식의 각 항을 같은 단항식으로 나누어 몫을 구하는 계산.",
        "supportingOrdinals": [
          2
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL",
        "rationale": "Distinct from canonical CC_POLYNOMIAL_DIVISION, whose definition is the polynomial-division identity/remainder/derivative concept."
      },
      "CC_ALGEBRAIC_MODELING": {
        "labelKo": "문자식을 이용한 도형 관계 모델링",
        "definition": "도형의 넓이·높이 같은 양을 문자를 포함한 식으로 나타내고, 주어진 공식에 대입해 관계를 세우는 것.",
        "supportingOrdinals": [
          2
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_RECTANGLE_AREA": {
        "labelKo": "직사각형의 넓이",
        "definition": "직사각형의 가로와 세로의 길이를 곱하여 넓이를 구하는 것.",
        "supportingOrdinals": [
          3
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_POLYNOMIAL_MULTIPLICATION": {
        "labelKo": "다항식의 곱셈",
        "definition": "분배법칙을 이용해 다항식의 각 항을 서로 곱하고 동류항을 정리하는 계산.",
        "supportingOrdinals": [
          3,
          22
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_GEOMETRIC_FOLDING": {
        "labelKo": "도형의 접기",
        "definition": "종이를 한 선분을 따라 접었을 때 겹치는 부분이 합동이 되는 성질을 이용하는 기하 조작.",
        "supportingOrdinals": [
          3
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_TRIANGLE_CONGRUENCE": {
        "labelKo": "삼각형의 합동과 대응 요소",
        "definition": "합동인 두 삼각형에서 대응변의 길이와 대응각의 크기가 각각 같다는 성질 및 합동 조건(SSS, SAS, ASA)",
        "supportingOrdinals": [
          3
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "EXACT_REUSE"
      },
      "CC_POLYNOMIAL_ADDITION": {
        "labelKo": "다항식의 덧셈",
        "definition": "동류항끼리 계수를 더해 다항식을 간단히 하는 계산.",
        "supportingOrdinals": [
          4
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_POLYNOMIAL_SUBTRACTION": {
        "labelKo": "다항식의 뺄셈",
        "definition": "빼는 다항식의 각 항의 부호를 바꾼 뒤 동류항끼리 계수를 더하는 계산.",
        "supportingOrdinals": [
          4
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_ERROR_CORRECTION": {
        "labelKo": "오연산의 역보정",
        "definition": "잘못 적용한 연산을 되돌려 원래의 식이나 값을 복원하는 것.",
        "supportingOrdinals": [
          4
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_LINEAR_INEQUALITIES": {
        "labelKo": "일차부등식",
        "definition": "미지수의 일차식으로 이루어져 부등호로 연결된 식.",
        "supportingOrdinals": [
          5,
          7,
          8,
          9,
          10,
          23
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_POLYNOMIAL_DEGREE": {
        "labelKo": "다항식의 차수",
        "definition": "다항식에서 문자가 곱해진 횟수가 가장 큰 항의 차수.",
        "supportingOrdinals": [
          5
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_INEQUALITY_IDENTIFICATION": {
        "labelKo": "부등식의 일차성 판별",
        "definition": "부등식을 정리한 뒤 남는 미지수 항이 일차인지 확인하여 일차부등식인지 판단하는 것.",
        "supportingOrdinals": [
          5
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_INEQUALITY_PROPERTIES": {
        "labelKo": "부등식의 성질",
        "definition": "부등식의 양변에 같은 수를 더하거나 곱하고 나누어도 성립하는 관계.",
        "supportingOrdinals": [
          6
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_NEGATIVE_MULTIPLICATION": {
        "labelKo": "음수 곱셈",
        "definition": "부등식의 양변에 음수를 곱하는 연산.",
        "supportingOrdinals": [
          6
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_DIRECTION_OF_INEQUALITY": {
        "labelKo": "부등호의 방향",
        "definition": "부등식이 나타내는 두 값의 대소 관계가 향하는 방향.",
        "supportingOrdinals": [
          6
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_FRACTION_COEFFICIENTS": {
        "labelKo": "분수 계수",
        "definition": "미지수나 상수에 붙은 계수가 분수로 주어진 상태.",
        "supportingOrdinals": [
          7,
          8
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_DECIMAL_COEFFICIENTS": {
        "labelKo": "소수 계수",
        "definition": "미지수나 상수에 붙은 계수가 소수로 주어진 상태.",
        "supportingOrdinals": [
          7
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "EXACT_REUSE"
      },
      "CC_NATURAL_NUMBER_SUM": {
        "labelKo": "자연수 해의 합",
        "definition": "조건을 만족하는 자연수들을 모두 더한 값.",
        "supportingOrdinals": [
          8
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_NUMBER_LINE": {
        "labelKo": "수직선",
        "definition": "수의 대소와 범위를 위치로 나타내는 직선.",
        "supportingOrdinals": [
          9
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_BOUNDARY_VALUE_ANALYSIS": {
        "labelKo": "경계값 분석",
        "definition": "부등식의 해가 특정 값을 포함하는지 판단하기 위해 경계가 되는 값을 비교하는 것.",
        "supportingOrdinals": [
          9
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_APPLIED_WORD_PROBLEMS": {
        "labelKo": "문장제 모델링",
        "definition": "실생활 상황의 문장 조건을 미지수 사이의 방정식이나 함수 관계로 옮기는 것.",
        "supportingOrdinals": [
          10,
          23
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "EXACT_REUSE"
      },
      "CC_SPEED_DISTANCE_TIME": {
        "labelKo": "속력·거리·시간 관계",
        "definition": "속력과 시간의 곱으로 거리를 구하는 관계.",
        "supportingOrdinals": [
          10
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_PARALLELOGRAMS": {
        "labelKo": "평행사변형",
        "definition": "두 쌍의 대변이 각각 평행한 사각형.",
        "supportingOrdinals": [
          11,
          12,
          13,
          14,
          15,
          16,
          18,
          24
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_RATIO_AND_PROPORTION": {
        "labelKo": "비와 비례배분",
        "definition": "주어진 비에 따라 전체 양을 나누어 각 부분의 크기를 정하는 것.",
        "supportingOrdinals": [
          11
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_PERIMETER": {
        "labelKo": "둘레",
        "definition": "도형의 가장자리를 따라 한 바퀴 돈 길이.",
        "supportingOrdinals": [
          11
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_ANGLE_BISECTOR_PROPERTY": {
        "labelKo": "각의 이등분선의 성질",
        "definition": "한 각을 크기가 같은 두 각으로 나누는 직선이 만드는 변과 각의 관계.",
        "supportingOrdinals": [
          12,
          15
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "rationale": "Canonical CC_ANGLE_BISECTOR has an evidence-recording meta definition, not the geometric property used here."
      },
      "CC_ISOSCELES_TRIANGLES": {
        "labelKo": "이등변삼각형",
        "definition": "두 변의 길이가 같은 삼각형.",
        "supportingOrdinals": [
          12,
          18
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_QUADRILATERAL_PROPERTIES": {
        "labelKo": "사각형의 성질",
        "definition": "사각형의 변·각·대각선이 갖는 일반적인 관계.",
        "supportingOrdinals": [
          13,
          19,
          25
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_COUNTEREXAMPLE_CONDITION": {
        "labelKo": "반례에 의한 조건 불충분",
        "definition": "주어진 조건을 만족하면서도 결론이 성립하지 않는 예가 존재해 그 조건이 충분하지 않음을 보이는 것.",
        "supportingOrdinals": [
          13
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_ALTERNATE_INTERIOR_ANGLES": {
        "labelKo": "엇각",
        "definition": "두 평행선과 한 직선이 만날 때 생기는, 서로 엇갈린 위치의 같은 크기 각.",
        "supportingOrdinals": [
          13
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_INTERNAL_POINT_PROPERTIES": {
        "labelKo": "내부점과 삼각형 넓이",
        "definition": "도형 내부의 한 점과 변들로 만든 삼각형들의 넓이 관계.",
        "supportingOrdinals": [
          14
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_RECTANGLES": {
        "labelKo": "직사각형",
        "definition": "네 내각이 모두 직각인 사각형.",
        "supportingOrdinals": [
          15,
          16
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_RHOMBUS": {
        "labelKo": "마름모",
        "definition": "네 변의 길이가 모두 같은 사각형.",
        "supportingOrdinals": [
          16,
          17,
          18
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_PERPENDICULAR_BISECTOR": {
        "labelKo": "선분의 수직이등분선",
        "definition": "두 점에서 같은 거리에 있는 점의 자취로서 수직이등분선을 사용하는 개념.",
        "supportingOrdinals": [
          17
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "EXACT_REUSE"
      },
      "CC_ANGLE_RELATIONS": {
        "labelKo": "각의 대소 관계",
        "definition": "삼각형이나 사각형에서 여러 각 사이의 합·차·대소 관계.",
        "supportingOrdinals": [
          17
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_SQUARE_CLASSIFICATION": {
        "labelKo": "정사각형 판별",
        "definition": "사각형이 마름모이면서 직사각형이라는 두 조건을 함께 만족해 정사각형임을 판별하는 것.",
        "supportingOrdinals": [
          18
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_DIAGONALS": {
        "labelKo": "대각선",
        "definition": "다각형에서 이웃하지 않는 두 꼭짓점을 잇는 선분.",
        "supportingOrdinals": [
          19
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_QUADRILATERAL_CLASSIFICATION": {
        "labelKo": "사각형의 분류",
        "definition": "변·각·대각선의 성질에 따라 사각형을 평행사변형·직사각형·마름모·정사각형·등변사다리꼴 등으로 나누는 것.",
        "supportingOrdinals": [
          19
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "rationale": "Canonical CC_CLASSIFICATION defines function classification by degree, so this distinct key carries the quadrilateral classification concept."
      },
      "CC_TRAPEZOID": {
        "labelKo": "사다리꼴",
        "definition": "한 쌍의 대변이 평행한 사각형.",
        "supportingOrdinals": [
          20
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_AREA_RATIO": {
        "labelKo": "넓이의 비",
        "definition": "두 도형의 넓이 사이의 비율 관계.",
        "supportingOrdinals": [
          20
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_PARALLEL_LINES_EQUAL_AREA": {
        "labelKo": "평행선과 등적변형",
        "definition": "두 삼각형이 같은 밑변을 공유할 때 밑변에 평행한 선을 이용해 높이가 같아지도록 만드는 조건.",
        "supportingOrdinals": [
          21
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL",
        "rationale": "Canonical CC_PARALLEL_LINES is coordinate-slope defined, not the plane equal-area construction used here."
      },
      "CC_EQUAL_AREA_TRANSFORMATION": {
        "labelKo": "등적변형",
        "definition": "도형의 넓이를 바꾸지 않고 모양이나 위치를 옮기는 변형.",
        "supportingOrdinals": [
          21
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_CYLINDER_VOLUME": {
        "labelKo": "원기둥의 부피",
        "definition": "밑면의 반지름과 높이를 이용해 원기둥의 부피를 구하는 공식.",
        "supportingOrdinals": [
          22
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_VOLUME_RATIO": {
        "labelKo": "부피의 비",
        "definition": "두 입체도형의 부피 사이의 비율.",
        "supportingOrdinals": [
          22
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_FRACTION_ARITHMETIC": {
        "labelKo": "분수의 사칙계산",
        "definition": "분수의 분자와 분모를 이용해 더하기·빼기·곱하기·나누기를 계산하는 것.",
        "supportingOrdinals": [
          23
        ],
        "conceptShard": "ALGEBRA",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/algebra.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_MATHEMATICAL_SYMBOLS": {
        "labelKo": "수학 기호",
        "definition": "평행·합동·각·선분 같은 수학적 관계를 나타내는 기호.",
        "supportingOrdinals": [
          24
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_GEOMETRIC_CONDITIONS": {
        "labelKo": "도형의 조건",
        "definition": "도형이 특정 종류가 되기 위해 만족해야 하는 변·각·대각선에 관한 조건.",
        "supportingOrdinals": [
          24
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_QUADRILATERAL_HIERARCHY": {
        "labelKo": "사각형의 포함 관계",
        "definition": "일반 사각형에서 평행사변형·마름모·직사각형·정사각형으로 갈수록 조건이 추가되는 포함 관계.",
        "supportingOrdinals": [
          25
        ],
        "conceptShard": "PLANE_GEOMETRY",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/plane-geometry.json",
        "status": "ADD_ONLY_PROPOSAL"
      },
      "CC_SUFFICIENT_CONDITIONS": {
        "labelKo": "충분조건",
        "definition": "어떤 명제가 성립하기에 충분한 조건.",
        "supportingOrdinals": [
          25
        ],
        "conceptShard": "LOGIC_SET",
        "ownerFile": "archive/data/meta-foundation/canonical/concepts/logic-set.json",
        "status": "ADD_ONLY_PROPOSAL"
      }
    }
  },
  "visualEvidenceDebt": {
    "inspected": false,
    "reviewerVisualChecked": false,
    "note": "No source image was opened, decoded, or described as if seen. Every row with an image is marked unchecked. Ordinals with an image that is decisive for semantic reasoning are marked requiredForAssignment=true and must be inspected separately by ROOT.",
    "rows": {
      "2": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q02.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Area and base are stated in text; figure is illustrative."
      },
      "3": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q03.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Folded lengths are read from the figure; unchecked."
      },
      "11": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q11.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Ratio and perimeter are stated; figure is illustrative."
      },
      "12": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q12.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Segment lengths are read from the figure; unchecked."
      },
      "13": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q13.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "All five conditions are written in the choices."
      },
      "14": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q14.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Areas are stated in text."
      },
      "15": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q15.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Construction is described in text."
      },
      "16": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q16.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Conditions are written in the choices."
      },
      "17": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q17.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Angle labels x and y exist only in the figure; unchecked."
      },
      "18": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q18.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "The configuration is drawn; unchecked."
      },
      "20": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q20.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "Area and ratio are stated in text."
      },
      "21": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q21.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Point E and the triangle configuration are only in the figure; unchecked."
      },
      "22": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q22.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Side lengths are read from the figure; unchecked."
      },
      "24": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q24.png",
        "inspected": false,
        "requiredForAssignment": false,
        "note": "The task is text-only; image is illustrative."
      },
      "25": {
        "asset": "assets/images/22_풍덕중_1학기_기말_중2_수학/q25.png",
        "inspected": false,
        "requiredForAssignment": true,
        "note": "Five numbered blanks exist only in the flowchart; unchecked."
      }
    }
  },
  "counts": {
    "rows": 25,
    "uniqueProblemTypes": 25,
    "uniqueTemplatePatterns": 25,
    "uniqueCrossConcepts": 53,
    "units": 3,
    "subUnits": 5,
    "rowsBoundToMiddle2": 12,
    "rowsBoundToMiddleGeometry": 13,
    "canonicalCcExactReuse": 6,
    "canonicalCcConflictNewKey": 4,
    "visualRowsUnchecked": [
      2,
      3,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      20,
      21,
      22,
      24,
      25
    ],
    "visualRowsRequiredForAssignmentUnchecked": [
      3,
      12,
      17,
      18,
      21,
      22,
      25
    ]
  },
  "integrity": {
    "originalAuditFieldsPreservedPerRow": true,
    "sourceFieldsPreservedPerRow": true,
    "auditedKeysPreservedVerbatim": true,
    "spellingDuplicatesNormalized": false,
    "sourceUnitNamespaceAdopted": false,
    "canonicalUnitMappingVerifiedAgainstContent": true,
    "existingCanonicalDefinitionsEdited": false,
    "conflictingCanonicalKeysRedefined": false,
    "distinctAdditiveKeysUsedForConflicts": true,
    "studentContentModified": false,
    "registrarWritten": false,
    "executed": false,
    "mathReSolved": false,
    "visualInspectionClaimed": false
  },
  "blockers": []
};
