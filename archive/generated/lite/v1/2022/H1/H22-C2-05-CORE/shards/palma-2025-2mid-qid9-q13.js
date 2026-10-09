window.examTitle = "ALIVE_LITE_PALMA25_H1_2MID_QID9_Q13_H22-C2-05-CORE";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q13-A1",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$10$의 정수 약수 전체로 이루어진 집합을 $D$라 하자. $D$의 공집합이 아닌 부분집합 $A$ 중 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$15$",
      "$120$",
      "$127$",
      "$128$",
      "$255$"
    ],
    "answer": "③",
    "solution": "$10$의 양의 약수는 $1,2,5,10$이므로 $D$에는 양수 $4$개와 음수 $4$개가 있다.\n모든 원소의 곱이 양수이려면 선택한 음수의 개수가 짝수여야 한다. 음수를 고르는 방법은 $\\binom40+\\binom42+\\binom44=1+6+1=8$가지이다.\n양수 $4$개는 각각 선택하거나 선택하지 않을 수 있으므로 $2^4=16$가지이다.\n곱이 양수인 선택은 $8\\times16=128$가지인데, 이 안에는 원소를 하나도 선택하지 않은 공집합이 한 개 포함된다.\n따라서 구하는 집합은 $128-1=127$개이므로 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "A1",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-A1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "정수 약수의 양·음수 분류, 음수의 짝수 선택, 공집합 제외"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2MID-Q13-A2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$16$의 정수 약수 전체로 이루어진 집합을 $D$라 하자. $D$의 공집합이 아닌 부분집합 $A$ 중 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$31$",
      "$496$",
      "$1023$",
      "$512$",
      "$511$"
    ],
    "answer": "⑤",
    "solution": "$16$의 양의 약수는 $1,2,4,8,16$으로 $5$개이며, 음의 약수도 $5$개이다.\n음수 원소의 선택 개수가 짝수여야 하므로 음수 선택은 $\\binom50+\\binom52+\\binom54=1+10+5=16$가지이다.\n양수 선택은 $2^5=32$가지이고, 공집합을 제외해야 한다.\n따라서 구하는 집합의 개수는 $16\\times32-1=511$이므로 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "A2",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-A2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "양의 약수 다섯 개에서 확장한 부호별 선택의 곱셈 원리"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2MID-Q13-A3",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$12$의 정수 약수 전체로 이루어진 집합을 $D$라 하자. $D$의 공집합이 아닌 부분집합 $A$ 중 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$2047$",
      "$2048$",
      "$2016$",
      "$63$",
      "$4095$"
    ],
    "answer": "①",
    "solution": "$12$의 양의 약수는 $1,2,3,4,6,12$로 $6$개이고 음의 약수도 $6$개이다.\n음수 원소의 개수가 짝수인 선택은 $\\binom60+\\binom62+\\binom64+\\binom66=1+15+15+1=32$가지이다.\n양의 약수는 $2^6=64$가지로 고를 수 있으므로 전체 $32\\times64=2048$가지이다.\n단, 공집합은 제외하므로 $2048-1=2047$이다. 따라서 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "A3",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-A3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "약수 쌍 6개에서 공집합·양의 곱 조건 정확히 분리"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2MID-Q13-B1",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$12$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$ 중 $-1\\in A$이고 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$64$",
      "$320$",
      "$1008$",
      "$1024$",
      "$2048$"
    ],
    "answer": "④",
    "solution": "음의 약수는 $-1,-2,-3,-4,-6,-12$로 모두 $6$개이다. $-1$을 반드시 택하므로 나머지 음수 $5$개에서는 홀수 개를 택해야 음수의 총 개수가 짝수가 된다.\n나머지 음수의 선택은 $\\binom51+\\binom53+\\binom55=5+10+1=16$가지이다.\n양수 약수 $6$개는 자유롭게 선택하므로 $2^6=64$가지이다.\n$-1$을 반드시 포함하므로 공집합이 나올 수 없다. 따라서 $16\\times64=1024$개이므로 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "B1",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-B1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-REQUIRED-ELEMENT"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "필수 음수 1개의 고정으로 나머지 음수 선택의 홀짝이 반전"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-REQUIRED-ELEMENT"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2MID-Q13-B2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$18$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$ 중 $2\\in A$, $-3\\notin A$이고 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$32$",
      "$512$",
      "$1024$",
      "$496$",
      "$320$"
    ],
    "answer": "②",
    "solution": "$18$의 양의 약수는 $1,2,3,6,9,18$로 $6$개이다. $-3$을 제외하므로 선택 가능한 음수는 $5$개이고, 그중 짝수 개를 택하는 방법은 $\\binom50+\\binom52+\\binom54=16$가지이다.\n양수 $2$는 반드시 포함해야 하므로 나머지 양수 $5$개의 선택은 $2^5=32$가지이다.\n$2$가 이미 포함되어 있으므로 공집합은 없다. 따라서 $16\\times32=512$개이므로 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "B2",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-B2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_REQUIRED_FORBIDDEN",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-REQUIRED-FORBIDDEN"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "필수 양수·금지 음수 제약과 부호 조건 동시 적용"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_REQUIRED_FORBIDDEN",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-REQUIRED-FORBIDDEN"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2MID-Q13-B3",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "집합 $D=\\{-6,-3,-2,-1,1,2,3,6\\}$의 부분집합 $A$ 중 원소가 $4$개이고 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$70$",
      "$32$",
      "$36$",
      "$38$",
      "$1$"
    ],
    "answer": "④",
    "solution": "$D$에는 양수 $4$개와 음수 $4$개가 있다. 원소를 정확히 $4$개 택하면서 곱이 양수가 되려면 음수를 $0,2,4$개 택해야 한다.\n음수 $0$개·양수 $4$개: $\\binom40\\binom44=1$가지이다.\n음수 $2$개·양수 $2$개: $\\binom42\\binom42=6\\times6=36$가지이다.\n음수 $4$개·양수 $0$개: $\\binom44\\binom40=1$가지이다.\n따라서 $1+36+1=38$개이므로 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "B3",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-B3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-EXACT-CARDINALITY"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "원소 수 제약으로 음수·양수 선택 수를 동시에 결합"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-EXACT-CARDINALITY"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2MID-Q13-C1",
    "level": "상",
    "difficultyBucket": 5,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$6$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$가 다음 두 조건을 만족한다.<br>㈎ $6$의 양의 약수 $d$마다 $d$와 $-d$ 중 적어도 하나가 $A$에 속한다.<br>㈏ $A$의 모든 원소의 곱은 양수이다.<br>이러한 집합 $A$의 개수는?",
    "choices": [
      "$41$",
      "$81$",
      "$80$",
      "$40$",
      "$8$"
    ],
    "answer": "①",
    "solution": "$6$의 양의 약수는 $1,2,3,6$이다. 각 $d$에 대해 $\\{d,-d\\}$에서 선택하는 방법은 $d$만 택하기, $-d$만 택하기, 둘 다 택하기의 $3$가지이다.\n이 중 음수 원소를 포함하지 않는 선택은 $1$가지이고, 음수 원소를 한 개 포함하는 선택은 $2$가지이다.\n네 개의 양·음수 쌍 중 음수를 포함하는 쌍이 $0,2,4$개여야 전체 곱이 양수이다.\n따라서 경우의 수는 $\\binom40\\cdot2^0+\\binom42\\cdot2^2+\\binom44\\cdot2^4=1+24+16=41$이다.\n각 쌍에서 하나 이상을 택하므로 공집합은 처음부터 제외된다. 따라서 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "C1",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-C1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-PAIR-COVER|양·음수 약수쌍의 원소 포함 조건과 곱의 부호",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 5,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-PAIR-COVER"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "양·음수 쌍별 최소 한 개 포함이라는 3상태 선택, 음수 개수 패리티와 결합"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-PAIR-COVER|양·음수 약수쌍의 원소 포함 조건과 곱의 부호",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-PAIR-COVER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2MID-Q13-C2",
    "level": "상",
    "difficultyBucket": 5,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$10$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$ 중 $-1\\in A$이고 원소의 개수가 짝수이며 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$64$",
      "$32$",
      "$24$",
      "$28$",
      "$8$"
    ],
    "answer": "②",
    "solution": "$10$의 양의 약수와 음의 약수는 각각 $4$개이다. $-1$을 반드시 포함하므로 나머지 음수 $3$개 중 홀수 개를 골라야 선택된 음수의 전체 개수가 짝수이다.\n음수 원소의 선택은 $\\binom31+\\binom33=3+1=4$가지이다.\n음수 원소의 개수가 짝수이므로 전체 원소의 개수까지 짝수가 되려면 양수 원소의 개수도 짝수여야 한다.\n양수 원소 선택은 $\\binom40+\\binom42+\\binom44=1+6+1=8$가지이다.\n따라서 전체 $4\\times8=32$가지이고, $-1$을 포함하므로 공집합은 없다. 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "C2",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-C2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 5,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-REQUIRED-ELEMENT",
        "EXT-COND-H1-Q13-EVEN-CARDINALITY"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "곱의 부호(음수 짝수)와 원소 수(전체 짝수)를 동시에 맞추는 두 홀짝 제약"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-REQUIRED-ELEMENT",
      "EXT-COND-H1-Q13-EVEN-CARDINALITY"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2MID-Q13-C3",
    "level": "상",
    "difficultyBucket": 5,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "$12$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$가 다음 조건을 모두 만족한다.<br>㈎ $A$의 원소는 정확히 $4$개이다.<br>㈏ $1,-1$ 중 정확히 하나만 $A$에 속한다.<br>㈐ $A$의 모든 원소의 곱은 양수이다.<br>이러한 집합 $A$의 개수는?",
    "choices": [
      "$60$",
      "$145$",
      "$120$",
      "$240$",
      "$255$"
    ],
    "answer": "③",
    "solution": "$12$의 양의 약수와 음의 약수는 각각 $6$개이다. $1,-1$ 중 하나만 포함하는 조건에 따라 두 경우로 나눈다.\n첫째, $1\\in A$이고 $-1\\notin A$이면 남은 양수 $5$개와 음수 $5$개에서 $3$개를 골라야 한다. 음수를 $0$개 또는 $2$개 고를 때 곱이 양수이므로 $\\binom50\\binom53+\\binom52\\binom51=10+50=60$가지이다.\n둘째, $-1\\in A$이고 $1\\notin A$이면 남은 $3$개 중 음수를 $1$개 또는 $3$개 골라야 전체 음수 개수가 짝수이다. 따라서 $\\binom51\\binom52+\\binom53\\binom50=50+10=60$가지이다.\n두 경우가 겹치지 않으므로 모두 $60+60=120$가지이다. 따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "C3",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q13-C3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-234",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 뜻과 포함 관계",
      "rpmL3": "부분집합",
      "rpmL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
      "rpmL4Namespace": "GENERATED_EXT_L4",
      "problemTypeKey": "PT_SUBSET_COUNT",
      "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
      "difficultyBucket": 5,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
        "EXT-CC-H1-Q13-COMBINATION-COUNTING"
      ],
      "conditionKeys": [
        "COND_INTEGER",
        "COND_POSITIVE",
        "EXT-COND-H1-Q13-EXACT-CARDINALITY",
        "EXT-COND-H1-Q13-ONE-OF-PAIR"
      ],
      "integrationPattern": "CASE_BRANCH",
      "generatedL4RegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json",
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "정수 약수 범위",
        "곱은 양수",
        "원소수·상호배타적 필수원소·음수 패리티를 결합하여 겹치지 않는 경우를 분해"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "ffde53720c92ae45e295532b2264b8cf3eb1ca31",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q13_Q16_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-05-CORE",
      "sourceKind": "generated",
      "evidenceByField": {
        "standardCourse": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardCourse"
        },
        "standardUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "standardUnitKey"
        },
        "subUnitKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "subUnitKey"
        },
        "rpmPrimaryRecordId": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmPrimaryRecordId"
        },
        "rpmL1": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL1"
        },
        "rpmL2": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL2"
        },
        "rpmL3": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL3"
        },
        "rpmL4": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4"
        },
        "rpmL4Namespace": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "rpmL4Namespace"
        },
        "problemTypeKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "problemTypeKey"
        },
        "templateKey": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "templateKey"
        },
        "difficultyBucket": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "difficultyBucket"
        },
        "level": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "level"
        },
        "crossConceptKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "crossConceptKeys"
        },
        "conditionKeys": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    },
    "rpmPrimaryL3": "부분집합",
    "generatedL4": "EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수",
    "problemTypeKey": "PT_SUBSET_COUNT",
    "templateKey": "TPL_SUBSET_COUNT_SET_CONDITION",
    "crossConceptKeys": [
      "EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION",
      "EXT-CC-H1-Q13-COMBINATION-COUNTING"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_POSITIVE",
      "EXT-COND-H1-Q13-EXACT-CARDINALITY",
      "EXT-COND-H1-Q13-ONE-OF-PAIR"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
