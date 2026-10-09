window.examTitle = "ALIVE_LITE_PALMA25_H1_2MID_QID9_Q16_H22-C2-05-CORE";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q16-A1",
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
    "content": "전체집합 $U$의 부분집합 $A,B$에 대하여 $B\\subseteq U-(A^c\\cup B^c)$이다. 다음 보기에서 항상 옳은 것만을 있는 대로 고른 것은?<br><br>〈보기〉<br>ㄱ. $(A\\cap B)^c=B^c$<br>ㄴ. $A\\cap(A-B)^c=A$<br>ㄷ. $(A^c\\cup B)^c=\\varnothing$<br>ㄹ. $(B-A)\\cup(A^c-B^c)=\\varnothing$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ",
      "ㄴ, ㄹ"
    ],
    "answer": "③",
    "solution": "드모르간의 법칙에 의해 $U-(A^c\\cup B^c)=A\\cap B$이므로 주어진 조건은 $B\\subseteq A$와 같다.\nㄱ. $A\\cap B=B$이므로 참이다.\nㄴ. $A\\cap(A-B)^c=A\\cap(A^c\\cup B)=B$이므로 항상 $A$인 것은 아니다.\nㄷ. $(A^c\\cup B)^c=A-B$이므로 반드시 공집합인 것은 아니다.\nㄹ. $B-A=\\varnothing$이고 $A^c-B^c=A^c\\cap B=B-A=\\varnothing$이므로 참이다.\n따라서 옳은 것은 ㄱ, ㄹ이므로 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "A1",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-A1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "B⊆A가 집합 연산식의 모든 참/거짓을 결정"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2MID-Q16-A2",
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
    "content": "전체집합 $U$의 부분집합 $A,B$가 $A\\subseteq U-(B^c\\cup A^c)$를 만족한다. 다음 보기에서 항상 옳은 것만을 있는 대로 고른 것은?<br><br>〈보기〉<br>ㄱ. $A\\cup B=B$<br>ㄴ. $(A\\cup B)^c=A^c$<br>ㄷ. $A-B=\\varnothing$<br>ㄹ. $B\\cap A^c=\\varnothing$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄹ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$U-(B^c\\cup A^c)=A\\cap B$이므로 조건은 $A\\subseteq B$이다.\nㄱ. $A\\cup B=B$이므로 참이다.\nㄴ. $(A\\cup B)^c=B^c$이며, $A^c$와는 항상 같지 않다.\nㄷ. $A\\subseteq B$이므로 $A-B=\\varnothing$이다.\nㄹ. $B\\cap A^c=B-A$이므로 반드시 공집합은 아니다.\n따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "A2",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-A2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "A⊆B가 집합 연산식의 모든 참/거짓을 결정"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2MID-Q16-A3",
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
    "content": "전체집합 $U$의 부분집합 $P,Q$가 $Q\\subseteq U-(P^c\\cup Q^c)$를 만족한다. 다음 보기에서 항상 옳은 것만을 있는 대로 고른 것은?<br><br>〈보기〉<br>ㄱ. $(P-Q)^c=Q$<br>ㄴ. $(P\\cap Q)^c=Q^c$<br>ㄷ. $Q-P=\\varnothing$<br>ㄹ. $P\\cup Q=Q$",
    "choices": [
      "ㄴ, ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄹ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ"
    ],
    "answer": "①",
    "solution": "$U-(P^c\\cup Q^c)=P\\cap Q$이므로 조건은 $Q\\subseteq P$이다.\nㄱ. $(P-Q)^c$는 일반적으로 $Q$와 같지 않다.\nㄴ. $P\\cap Q=Q$이므로 참이다.\nㄷ. $Q\\subseteq P$이므로 $Q-P=\\varnothing$이다.\nㄹ. $P\\cup Q=P$이므로 항상 $Q$인 것은 아니다.\n따라서 옳은 것은 ㄴ, ㄷ이므로 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "A3",
    "purposeGroup": "A",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-A3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "SEQUENTIAL",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "Q⊆P가 집합 연산식의 모든 참/거짓을 결정"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2MID-Q16-B1",
    "level": "중",
    "difficultyBucket": 3,
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
    "content": "전체집합 $U$의 두 부분집합 $A,B$가 $B\\subseteq A$를 만족할 때, 반드시 성립하는 집합의 등식은?",
    "choices": [
      "$(A-B)\\cap B=B$",
      "$(A^c\\cup B)^c=A",
      "$(A\\cap B)^c=A^c",
      "$(A-B)\\cup B=A",
      "$A\\cap B=A$"
    ],
    "answer": "④",
    "solution": "$B\\subseteq A$이므로 $A$에서 $B$를 뺀 집합과 $B$는 공통 원소가 없고, 둘을 합치면 정확히 $A$가 된다. 즉 $(A-B)\\cup B=A$이다.\n다른 보기들이 항상 참인 것은 아니다. 예를 들어 $U=\\{1,2,3\\},A=\\{1,2\\},B=\\{1\\}$이면 ① 좌변 $\\varnothing$, ② 좌변 $\\{2\\}$, ③ 좌변 $\\{2,3\\}$, ⑤ 좌변 $\\{1\\}$이므로 각 우변과 다르다.\n따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "B1",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-B1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
      "difficultyBucket": 3,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "B⊆A에 따라 차집합을 합쳐 전체 A를 복원"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2MID-Q16-B2",
    "level": "중",
    "difficultyBucket": 3,
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
    "content": "전체집합 $U=\\{1,2,\\ldots,10\\}$에 대하여 $A=\\{1,2,3,4,5,6,7\\}$, $B=\\{2,4,6,8,10\\}$이다. 집합 $(A^c\\cup B)^c$의 원소의 개수는?",
    "choices": [
      "$3$",
      "$4$",
      "$2$",
      "$5$",
      "$9$"
    ],
    "answer": "②",
    "solution": "드모르간의 법칙을 적용하면 $(A^c\\cup B)^c=A\\cap B^c=A-B$이다. $A$의 원소 중 $B$에 없는 것은 $1,3,5,7$이므로 $A-B=\\{1,3,5,7\\}$이다.\n따라서 원소의 개수는 $4$개이므로 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "B2",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-B2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-241",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "드모르간 법칙",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
      "difficultyBucket": 3,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "U={1,...,10}의 범위 안에서 여집합의 원소수를 확정"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "드모르간 법칙",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2MID-Q16-B3",
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
    "content": "전체집합 $U=\\{1,2,\\ldots,12\\}$의 부분집합 $A=\\{2,3,5,7,11\\}$과 $B\\subseteq A$가 $U-(A^c\\cup B^c)=\\{2,7,11\\}$을 만족한다. 집합 $B$의 원소의 개수는?",
    "choices": [
      "$3$",
      "$5$",
      "$2$",
      "$7$",
      "$9$"
    ],
    "answer": "①",
    "solution": "$U-(A^c\\cup B^c)=A\\cap B$이다. 그런데 $B\\subseteq A$이므로 $A\\cap B=B$이다. 따라서 $B=\\{2,7,11\\}$이고 $|B|=3$이다.\n따라서 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "B3",
    "purposeGroup": "B",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-B3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-241",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "드모르간 법칙",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE",
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "U={1,...,12}, B⊆A를 결합하여 복합식을 역산"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "드모르간 법칙",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE",
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2MID-Q16-C1",
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
    "content": "전체집합 $U$의 부분집합 $A,B$가 $A\\cap(A-B)^c=A$를 만족한다. 이 조건만으로 반드시 참인 것은?",
    "choices": [
      "$(A^c\\cup B)^c=A",
      "$B-A=\\varnothing$",
      "$(A\\cap B)^c=B^c$",
      "$A\\cup B=A$",
      "$A\\cap B=A$"
    ],
    "answer": "⑤",
    "solution": "$A\\cap(A-B)^c=A\\cap(A^c\\cup B)=(A\\cap A^c)\\cup(A\\cap B)=A\\cap B$이다. 따라서 조건은 $A\\cap B=A$, 즉 $A\\subseteq B$이다. 이때 반드시 참인 것은 ⑤이다.\n실제로 $U=\\{1,2\\},A=\\{1\\},B=\\{1,2\\}$로 두면 조건은 성립하지만 ① 좌변 $\\varnothing$, ② 좌변 $\\{2\\}$, ③ 좌변 $\\{2\\}$, ④ 좌변 $\\{1,2\\}$여서 각 보기의 등식이 성립하지 않는다.\n따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "C1",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-C1",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-SUBSET-INCLUSION"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "복합 집합식의 항등관계가 A⊆B와 동치임을 역으로 도출"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-SUBSET-INCLUSION"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2MID-Q16-C2",
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
    "content": "전체집합 $U$의 부분집합 $A,B$에 대하여 $A\\cup B=U$, $|U|=12$, $|A|=8$, $|B|=7$이다. $C=A\\cap B$라 할 때, 집합 $(A-C)\\cup(B-C)$의 원소의 개수는?",
    "choices": [
      "$12$",
      "$9$",
      "$3$",
      "$6$",
      "$15$"
    ],
    "answer": "②",
    "solution": "$A\\cup B=U$이므로 $|A\\cap B|=|A|+|B|-|U|=8+7-12=3$이다. $C=A\\cap B$이고, $(A-C)\\cup(B-C)=(A\\cup B)-C=U-C$이다.\n따라서 구하는 원소의 개수는 $12-3=9$개이므로 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "C2",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-C2",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-242",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "복합 연산",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": [
        "EXT-COND-H1-Q16-UNION-COVER"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "A∪B=U라는 전제와 크기 12·8·7에서 교집합·서로소영역을 계산"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "복합 연산",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "EXT-COND-H1-Q16-UNION-COVER"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2MID-Q16-C3",
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
    "content": "전체집합 $U=\\{1,2,\\ldots,20\\}$에서 $A$는 $2$의 배수 전체, $B$는 $3$의 배수 전체로 이루어진 집합이다. $C=(A\\cup B)^c\\cup(A\\cap B)$일 때, 집합 $C$의 원소의 개수는?",
    "choices": [
      "$13$",
      "$3$",
      "$7$",
      "$10$",
      "$16$"
    ],
    "answer": "④",
    "solution": "$|A|=10$, $|B|=6$, $|A\\cap B|=3$이다. 따라서 $|A\\cup B|=10+6-3=13$이고, $|(A\\cup B)^c|=20-13=7$이다.\n$(A\\cup B)^c$와 $A\\cap B$는 서로소이므로 $|C|=7+3=10$이다.\n따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "C3",
    "purposeGroup": "C",
    "meta": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q16-C3",
      "status": "SOURCE_META_PRESERVED",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-05",
      "subUnitKey": "H22-C2-05-CORE",
      "rpmPrimaryRecordId": "H1-RPM-241",
      "rpmL1": "집합과 명제",
      "rpmL2": "집합의 연산",
      "rpmL3": "집합의 연산법칙",
      "rpmL4": "드모르간 법칙",
      "rpmL4Namespace": "RPM_PRIMARY",
      "problemTypeKey": "PT_SET_OPERATION_LAW",
      "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [
        "EXT-CC-H1-Q16-DIVISIBILITY-MULTIPLES"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CONDITION_COMPOSITE",
      "generatedL4RegistryRef": null,
      "crossConceptRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionRegistryRef": "archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json",
      "conditionEvidenceLabels": [
        "U={1,...,20}의 범위와 배수의 공배수(최소공배수 6) 계산을 결합"
      ],
      "evidenceDebt": [],
      "approval": "GPT_OPEN_BOOK_REVIEW_PASS",
      "reviewStatus": "GPT_OPEN_BOOK_REVIEW_PASS",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "524748ee2600734ee9b50426f5b8ad4a7f3f75bb",
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
    "rpmPrimaryL3": "집합의 연산법칙",
    "generatedL4": "드모르간 법칙",
    "problemTypeKey": "PT_SET_OPERATION_LAW",
    "templateKey": "TPL_OPERATION_LAW_COMPOSITE",
    "crossConceptKeys": [
      "EXT-CC-H1-Q16-DIVISIBILITY-MULTIPLES"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CONDITION_COMPOSITE"
  }
];
