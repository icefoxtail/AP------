window.examTitle = "ALIVE_LITE_PALMA25_H1_2MID_QID9_Q06_H22-C2-03-INTERSECTION";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q06-A1",
    "level": "중",
    "difficultyBucket": 2,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=13$과 직선 $2x-3y+k=0$이 만나도록 하는 정수 $k$의 개수는?",
    "choices": [
      "$27$",
      "$25$",
      "$26$",
      "$14$",
      "$28$"
    ],
    "answer": "①",
    "solution": "원의 중심은 $(0,0)$, 반지름은 $\\sqrt{13}$이다.\n중심에서 직선 $2x-3y+k=0$까지의 거리는 $d=\\dfrac{|k|}{\\sqrt{2^2+(-3)^2}}=\\dfrac{|k|}{\\sqrt{13}}$이다.\n접하는 경우까지 포함하여 만나려면 $d\\le\\sqrt{13}$이어야 하므로 $|k|\\le13$이다.\n따라서 가능한 정수는 $-13,-12,\\ldots,12,13$의 $27$개이다. 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "A1",
    "purposeGroup": "A",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-A1",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 2,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "정수 매개변수",
        "접함 포함"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "정수 매개변수",
            "접함 포함"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2MID-Q06-A2",
    "level": "중",
    "difficultyBucket": 2,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $(x-1)^2+(y+2)^2=9$와 직선 $3x+4y+k=0$이 만나도록 하는 정수 $k$의 개수는?",
    "choices": [
      "$29$",
      "$30$",
      "$16$",
      "$31$",
      "$32$"
    ],
    "answer": "④",
    "solution": "원의 중심은 $(1,-2)$, 반지름은 $3$이다.\n중심에서 직선까지의 거리는 $d=\\dfrac{|3\\cdot1+4(-2)+k|}{\\sqrt{3^2+4^2}}=\\dfrac{|k-5|}{5}$이다.\n원과 직선이 만나려면 $d\\le3$, 즉 $|k-5|\\le15$이므로 $-10\\le k\\le20$이다.\n가능한 정수의 개수는 $20-(-10)+1=31$개이다. 따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "A2",
    "purposeGroup": "A",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-A2",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 2,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "정수 매개변수",
        "이동한 원 중심"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "정수 매개변수",
            "이동한 원 중심"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2MID-Q06-A3",
    "level": "중",
    "difficultyBucket": 2,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=10$과 직선 $x-3y+t=0$이 서로 다른 두 점에서 만나도록 하는 정수 $t$의 개수는?",
    "choices": [
      "$21$",
      "$19$",
      "$18$",
      "$10$",
      "$20$"
    ],
    "answer": "②",
    "solution": "원 $x^2+y^2=10$의 중심은 원점이고 반지름은 $\\sqrt{10}$이다.\n중심에서 직선까지의 거리는 $d=\\dfrac{|t|}{\\sqrt{1^2+(-3)^2}}=\\dfrac{|t|}{\\sqrt{10}}$이다.\n서로 다른 두 점에서 만나려면 접하면 안 되므로 $d<\\sqrt{10}$이다.\n따라서 $|t|<10$이고, 정수 $t=-9,-8,\\ldots,8,9$의 $19$개이다. 따라서 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "A3",
    "purposeGroup": "A",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-A3",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 2,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "정수 매개변수",
        "서로 다른 두 교점"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "정수 매개변수",
            "서로 다른 두 교점"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2MID-Q06-B1",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $(x-1)^2+y^2=25$와 직선 $3x+4y=n$이 서로 다른 두 점에서 만나도록 하는 양의 짝수 $n$의 개수는?",
    "choices": [
      "$12$",
      "$14$",
      "$27$",
      "$15$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "원의 중심은 $(1,0)$이고 반지름은 $5$이다.\n중심에서 직선 $3x+4y-n=0$까지의 거리는 $d=\\dfrac{|3-n|}{5}$이다.\n두 교점이 있으려면 $d<5$이므로 $|n-3|<25$, 즉 $-22<n<28$이다.\n이 범위의 양의 짝수는 $2,4,6,\\ldots,26$이고, 개수는 $\\dfrac{26-2}{2}+1=13$개이다.\n따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "B1",
    "purposeGroup": "B",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-B1",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 3,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "양의 짝수",
        "두 교점"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "양의 짝수",
            "두 교점"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2MID-Q06-B2",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $(x-2)^2+(y+1)^2=5$와 직선 $x-2y+k=0$이 만나지 않도록 하는 음의 정수 $k$의 최댓값은?",
    "choices": [
      "$-9$",
      "$-11$",
      "$-10$",
      "$-7$",
      "$-6$"
    ],
    "answer": "③",
    "solution": "원의 중심은 $(2,-1)$, 반지름은 $\\sqrt5$이다.\n중심에서 직선까지의 거리는 $d=\\dfrac{|2-2(-1)+k|}{\\sqrt{1^2+(-2)^2}}=\\dfrac{|k+4|}{\\sqrt5}$이다.\n원과 직선이 만나지 않으려면 $d>\\sqrt5$이므로 $|k+4|>5$이다.\n따라서 $k<-9$ 또는 $k>1$이고, 이 중 음의 정수는 $k\\le-10$이다.\n그러므로 음의 정수 $k$의 최댓값은 $-10$이다. 따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "B2",
    "purposeGroup": "B",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-B2",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 3,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "음의 정수",
        "교점 없음"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "음의 정수",
            "교점 없음"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2MID-Q06-B3",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=5$와 직선 $y=mx+5$가 서로 다른 두 점에서 만나도록 하는 정수 $m$의 개수는? (단, $-4\\le m\\le4$이다.)",
    "choices": [
      "$4$",
      "$6$",
      "$2$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "원의 중심은 원점이고 반지름은 $\\sqrt5$이다.\n직선 $y=mx+5$를 $mx-y+5=0$으로 나타내면 원점에서 직선까지의 거리는 $d=\\dfrac5{\\sqrt{m^2+1}}$이다.\n서로 다른 두 교점이 존재하려면 $d<\\sqrt5$이므로 $\\dfrac{25}{m^2+1}<5$이다.\n따라서 $m^2>4$, 즉 $m<-2$ 또는 $m>2$이다.\n$-4\\le m\\le4$인 정수 중 조건을 만족하는 값은 $-4,-3,3,4$의 $4$개이다. 따라서 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "B3",
    "purposeGroup": "B",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-B3",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 3,
      "level": "중",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "정수 기울기",
        "두 교점"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "정수 기울기",
            "두 교점"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2MID-Q06-C1",
    "level": "상",
    "difficultyBucket": 4,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=25$와 직선 $3x+4y=k$가 만드는 현의 길이가 $8$ 이상이 되도록 하는 정수 $k$의 개수는?",
    "choices": [
      "$29$",
      "$30$",
      "$16$",
      "$31$",
      "$32$"
    ],
    "answer": "④",
    "solution": "원의 중심은 $(0,0)$이고 반지름은 $5$이다. 중심에서 직선까지의 거리는 $d=\\dfrac{|k|}{5}$이다.\n중심에서 현에 내린 수선은 현을 이등분한다. 현의 길이를 $L$이라 하면 피타고라스 정리에 의해 $\\left(\\dfrac L2\\right)^2+d^2=25$이다.\n따라서 $L=2\\sqrt{25-\\dfrac{k^2}{25}}$이다.\n$L\\ge8$이면 $25-\\dfrac{k^2}{25}\\ge16$, 즉 $k^2\\le225$이므로 $|k|\\le15$이다.\n이 범위에서는 현이 존재하며, 가능한 정수는 $-15,-14,\\ldots,14,15$의 $31$개이다.\n따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "C1",
    "purposeGroup": "C",
    "rpmPrimaryRecordId": "H1-RPM-220",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.2|현의 길이",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-C1",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-220",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.2|현의 길이",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_CHORD_LENGTH",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "현 길이 이상 조건",
        "정수 매개변수"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "현 길이 이상 조건",
            "정수 매개변수"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2MID-Q06-C2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "두 원 $C_1:x^2+y^2=25$, $C_2:(x-2)^2+(y+1)^2=9$에 대하여 직선 $3x+4y=t$가 두 원 각각과 서로 다른 두 점에서 만나도록 하는 정수 $t$의 개수는?",
    "choices": [
      "$31$",
      "$29$",
      "$30$",
      "$49$",
      "$28$"
    ],
    "answer": "②",
    "solution": "원 $C_1$의 중심은 $(0,0)$이고 반지름은 $5$이다. 직선까지의 거리는 $\\dfrac{|t|}{5}$이므로 두 교점 조건은 $|t|<25$이다.\n원 $C_2$의 중심은 $(2,-1)$이고 반지름은 $3$이다. 이 중심에서 직선까지의 거리는 $\\dfrac{|3\\cdot2+4(-1)-t|}{5}=\\dfrac{|t-2|}{5}$이다.\n두 교점 조건은 $|t-2|<15$이므로 $-13<t<17$이다. 이 구간의 모든 값은 $-25<t<25$도 만족한다.\n따라서 가능한 정수는 $-12,-11,\\ldots,15,16$이며, 개수는 $16-(-12)+1=29$개이다. 따라서 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "C2",
    "purposeGroup": "C",
    "rpmPrimaryRecordId": "H1-RPM-219",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.1|교점 개수",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-C2",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-219",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.1|교점 개수",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_INTERSECTION_COUNT",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "두 원 각각 두 교점",
        "정수 매개변수"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "두 원 각각 두 교점",
            "정수 매개변수"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2MID-Q06-C3",
    "level": "상",
    "difficultyBucket": 4,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=25$와 직선 $3x+4y=k$가 서로 다른 두 점 $A,B$에서 만난다. 선분 $AB$의 중점 $M$이 직선 $y=x+\\dfrac35$ 위에 있을 때, 선분 $AB$의 길이는? (단, $k$는 실수이다.)",
    "choices": [
      "$10$",
      "$5$",
      "$16$",
      "$6$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "원의 중심 $O(0,0)$에서 현 $AB$에 내린 수선의 발은 현의 중점 $M$이다.\n직선 $3x+4y=k$의 기울기는 $-\\dfrac34$이므로 $OM$의 기울기는 $\\dfrac43$이다. 따라서 $M$은 직선 $4x-3y=0$ 위에도 있다.\n$M=(u,v)$라 하면 $3u+4v=k$, $4u-3v=0$을 만족한다. 이를 연립하면 $u=\\dfrac{3k}{25}$, $v=\\dfrac{4k}{25}$이다.\n$M$이 $y=x+\\dfrac35$ 위에 있으므로 $v-u=\\dfrac{k}{25}=\\dfrac35$이고, $k=15$이다.\n원점에서 직선 $3x+4y=15$까지의 거리는 $d=\\dfrac{15}{5}=3$이다.\n반지름이 $5$이므로 $AM=BM=\\sqrt{5^2-3^2}=4$이고, $AB=8$이다. 따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "C3",
    "purposeGroup": "C",
    "rpmPrimaryRecordId": "H1-RPM-220",
    "rpmL1": "L1-1|도형의 방정식",
    "rpmL2": "L2-1.3|원의 방정식",
    "rpmL3": "L3-1.3.2|원과 직선",
    "rpmL4": "L4-1.3.2.2|현의 길이",
    "rpmL4Namespace": "RPM_EXISTING_DRAFT",
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "crossConceptKeys": [],
    "conditionKeys": null,
    "integrationPattern": "SEQUENTIAL",
    "metaProjection": {
      "schemaVersion": "PROBLEM_BANK_META_PROJECTION_V1",
      "uid": "ALITE-PALMA25-2MID-Q06-C3",
      "status": "SOURCE_META_PRESERVED_WITH_EVIDENCE_DEBT",
      "standardCourse": "공통수학2",
      "standardUnitKey": "H22-C2-03",
      "subUnitKey": "H22-C2-03-INTERSECTION",
      "rpmPrimaryRecordId": "H1-RPM-220",
      "rpmL1": "L1-1|도형의 방정식",
      "rpmL2": "L2-1.3|원의 방정식",
      "rpmL3": "L3-1.3.2|원과 직선",
      "rpmL4": "L4-1.3.2.2|현의 길이",
      "rpmL4Namespace": "RPM_EXISTING_DRAFT",
      "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
      "templateKey": "TM_CIRCLE_CHORD_LENGTH",
      "difficultyBucket": 4,
      "level": "상",
      "crossConceptKeys": [],
      "conditionKeys": null,
      "integrationPattern": "SEQUENTIAL",
      "conditionEvidenceLabels": [
        "현의 중점",
        "두 교점"
      ],
      "crossConceptUnmappedLabels": [],
      "evidenceDebt": [
        {
          "field": "conditionKeys",
          "reason": "WORKING_LABEL_NOT_CANONICALIZED",
          "workingLabels": [
            "현의 중점",
            "두 교점"
          ]
        }
      ],
      "rpmDraftAuthorityRef": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
      "rpmDraftAuthoritySha256": null,
      "approval": "USER_DIRECTED_OPERATING_APPROVED",
      "reviewStatus": "USER_DIRECTED_CONTENT_REVIEWED",
      "consumerSelectable": true,
      "sourceCandidatePackageGitBlobSha": "f0db0118e0c0afcfd1d85012faa4bf4fa6d6cace",
      "reviewLedgerRef": "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q05_Q08_OPENBOOK_REVIEW_REPAIR_20261009.md",
      "physicalStorageBucketKey": "H22-C2-03-INTERSECTION",
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
          "status": "EVIDENCE_DEBT",
          "evidenceKey": "conditionKeys"
        },
        "integrationPattern": {
          "status": "SOURCE_OR_CROSSWALK_GROUNDED",
          "evidenceKey": "integrationPattern"
        }
      }
    }
  }
];
