window.examTitle = "PALMA_2025_QID9_08_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q08-C1",
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
    "content": "$1$ 이상 $180$ 이하의 자연수 중 $4$, $6$, $9$ 가운데 적어도 하나의 배수인 수의 개수는?",
    "choices": [
      "$95$",
      "$65$",
      "$80$",
      "$70$",
      "$75$"
    ],
    "answer": "④",
    "solution": "$4$, $6$, $9$의 배수는 각각 $45$, $30$, $20$개이다. 두 집합씩의 교집합은 $12$, $36$, $18$의 배수로 각각 $15$, $5$, $10$개이고, 세 집합의 교집합은 $36$의 배수로 $5$개이다.\n세 집합 합집합의 원소 수는 각 집합을 합한 뒤 두 집합씩의 공통 원소를 빼고 세 집합 공통 원소를 다시 더하므로\n$45+30+20-(15+5+10)+5=70$개이다. 따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 8,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q08-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q08-C1","meta":{"rpmL1":"L1-2|집합과 명제","rpmL2":"L2-2.2|집합의 연산","rpmL3":"L3-2.2.1|교집합과 합집합","rpmL4":"L4-2.2.1.2|원소 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-238","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_NATURAL_NUMBER"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_THREE_SET_INCLUSION_EXCLUSION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"ebec64774b18b3dfc4a4ee1f3e7664c965b410e116d8497f865878341e1d3a0c","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q08-C1.json","sha256":"bd6a54d6c7c4794aa286b160a77b11e8c57ce2e5a8547376f914f904e615f56a","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q08-C1"],"uid":"ALITE-PALMA25-2MID-Q08-C1"},"metaReviewEvidenceSha256":"bd6a54d6c7c4794aa286b160a77b11e8c57ce2e5a8547376f914f904e615f56a","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_THREE_SET_INCLUSION_EXCLUSION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_NATURAL_NUMBER"],"integrationPattern":"SEQUENTIAL"});})();
