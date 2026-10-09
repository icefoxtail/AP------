window.examTitle = "PALMA_2025_QID9_10_B3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q10-B3",
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
    "content": "전체집합 $U$의 부분집합 $A,B,C$에 대하여, $A$의 원소 가운데 $B$와 $C$에 동시에 속하는 원소만 제외하여 집합 $T$를 만들었다. $T$와 항상 같은 집합은?",
    "choices": [
      "$(A\\cap B)-C$",
      "$(A-B)\\cup (A-C)$",
      "$A-(B\\cup C)$",
      "$A\\cap (B\\cup C)$",
      "$A^{c}\\cup (B\\cap C)^{c}$"
    ],
    "answer": "②",
    "solution": "$T=A-(B\\cap C)$이다. $A$에 속하면서 $B\\cap C$에 속하지 않는다는 것은 $B$에 속하지 않거나 $C$에 속하지 않는다는 뜻이다.\n따라서 $(A-B)$ 또는 $(A-C)$에 속하는 원소를 모으면 되므로 $T=(A-B)\\cup(A-C)$이다. 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 10,
    "slot": "B3",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q10-B3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q10-B3","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"여집합과 차집합","rpmL4":"차집합","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-240","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"ad7204027dfcfe25897a91862141c65fd74a32a04c56dea945141b2731a71d91","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q10-B3.json","sha256":"1d513d3e03ca5bd93711fae6e1184e5a5767cbe6df1ac78b4ef2fff3cdd1c63f","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q10-B3"],"uid":"ALITE-PALMA25-2MID-Q10-B3"},"metaReviewEvidenceSha256":"1d513d3e03ca5bd93711fae6e1184e5a5767cbe6df1ac78b4ef2fff3cdd1c63f","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_REGION_EQUIVALENCE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
