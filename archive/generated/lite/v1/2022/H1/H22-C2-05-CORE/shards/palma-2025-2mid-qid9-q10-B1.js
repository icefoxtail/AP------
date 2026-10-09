window.examTitle = "PALMA_2025_QID9_10_B1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q10-B1",
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
    "content": "전체집합 $U$의 부분집합 $A,B,C$에 대하여, $A$에 속하는 원소 중 $B$에는 속하고 $C$에는 속하지 않는 원소만 제외하여 집합 $S$를 만들었다. $S$와 항상 같은 집합은?",
    "choices": [
      "$A-(B\\cup C)$",
      "$(A-B)\\cap C$",
      "$A\\cap (B-C)$",
      "$(A-B)\\cup (A\\cap C)$",
      "$(A\\cup C)-B$"
    ],
    "answer": "④",
    "solution": "$S$의 원소는 우선 $A$에 속한다. 제외해야 할 원소는 $B$에 속하면서 $C$에는 속하지 않는 원소이다. 따라서 $A$의 원소 중 $B$에 속하지 않는 것 또는 $C$에도 속하는 것은 남는다.\n남는 두 부분은 $A-B$와 $A\\cap C$이므로 $S=(A-B)\\cup(A\\cap C)$이다. 따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 10,
    "slot": "B1",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q10-B1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q10-B1","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"여집합과 차집합","rpmL4":"차집합","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-240","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"ad7204027dfcfe25897a91862141c65fd74a32a04c56dea945141b2731a71d91","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q10-B1.json","sha256":"d71e2a97cbf58a34491ae0974e595061b482fc10854e7e63605c6ee8c21fa6fe","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q10-B1"],"uid":"ALITE-PALMA25-2MID-Q10-B1"},"metaReviewEvidenceSha256":"d71e2a97cbf58a34491ae0974e595061b482fc10854e7e63605c6ee8c21fa6fe","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
