window.examTitle = "PALMA_2025_QID9_16_B3";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q16-B3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q16-B3","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"집합의 연산법칙","rpmL4":"드모르간 법칙","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-241","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","EXT-COND-H1-Q16-SUBSET-INCLUSION"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"INTERDEPENDENT","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_COMPOSITE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"7ffce145e7695f6ddb006d736f3d7c5df0cce4014e3b28687d0a0c5d5d2acea7","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q16-B3.json","sha256":"2020b715ad99575215fd77099a883c066bab84c64601c961a663925b49b62f1b","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q16-B3"},"metaReviewEvidenceSha256":"2020b715ad99575215fd77099a883c066bab84c64601c961a663925b49b62f1b","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_COMPOSITE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","EXT-COND-H1-Q16-SUBSET-INCLUSION"],"integrationPattern":"INTERDEPENDENT"});})();
