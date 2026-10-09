window.examTitle = "PALMA_2025_QID9_10_C2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q10-C2",
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
    "content": "집합 $A,B,C$에 대하여 $S=(A\\cup B)-\\big(C-(A\\cap B)\\big)$일 때 $S$와 항상 같은 것은?",
    "choices": [
      "$((A\\cup B)-C)\\cup (A\\cap B)$",
      "$(A\\cup B)-C$",
      "$(A\\cap B)-C$",
      "$(A\\cup B)\\cap C$",
      "$A\\cup B\\cup C$"
    ],
    "answer": "①",
    "solution": "$A\\cap B$의 원소는 $C-(A\\cap B)$에 속하지 않아 모두 남는다. 그 밖에 $A\\cup B$에 속하는 원소는 $C$ 밖일 때 남는다.\n따라서 $S=\\big((A\\cup B)-C\\big)\\cup(A\\cap B)$이므로 정답은 ①이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 10,
    "slot": "C2",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q10-C2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q10-C2","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"여집합과 차집합","rpmL4":"차집합","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-240","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"df57bc3eceec57866735b19ee82a924bf4289739a15b00ad09059b18cef9f6a8","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q10-C2.json","sha256":"b6d8ef51f27f98280dcda5a9cc97e6729e69fa43eec73e434a86021d5b512324","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q10-C2"],"uid":"ALITE-PALMA25-2MID-Q10-C2"},"metaReviewEvidenceSha256":"b6d8ef51f27f98280dcda5a9cc97e6729e69fa43eec73e434a86021d5b512324","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
