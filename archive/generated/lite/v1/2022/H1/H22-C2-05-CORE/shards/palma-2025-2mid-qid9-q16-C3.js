window.examTitle = "PALMA_2025_QID9_16_C3";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q16-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q16-C3","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"집합의 연산법칙","rpmL4":"드모르간 법칙","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-241","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q16-DIVISIBILITY-MULTIPLES"],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"INTERDEPENDENT","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_COMPOSITE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"f12fd99a2b7e0bb53f42c3b15ad572e1efa508e23f87218a591bedc3dd96da0d","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q16-C3.json","sha256":"74c3e3e8d330ccee75c0216c3b1994243428ed447fa00a0889c3d922a6c44ea0","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q16-C3"},"metaReviewEvidenceSha256":"74c3e3e8d330ccee75c0216c3b1994243428ed447fa00a0889c3d922a6c44ea0","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_COMPOSITE","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q16-DIVISIBILITY-MULTIPLES"],"conditionKeys":["COND_RANGE"],"integrationPattern":"INTERDEPENDENT"});})();
