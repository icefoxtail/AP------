window.examTitle = "PALMA_2025_QID9_06_A2";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q06-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q06-A2","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.3|원의 방정식","rpmL3":"L3-1.3.2|원과 직선","rpmL4":"L4-1.3.2.1|교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER"],"integrationPattern":"SEQUENTIAL","difficultyBucket":2,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","conditionEvidenceLabels":["정수 매개변수","이동한 원 중심"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"22222f752d6ea8f752dfd1971af89fcdb2e93195a598eb691574ddf52cd10c37","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q06-A2.json","sha256":"3507d4759cdf0d65eb1a549a74ced21e36b4032597506e27914c61a70d4f87d7","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q06-A2"],"uid":"ALITE-PALMA25-2MID-Q06-A2"},"metaReviewEvidenceSha256":"3507d4759cdf0d65eb1a549a74ced21e36b4032597506e27914c61a70d4f87d7","difficultyBucket":2,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER"],"integrationPattern":"SEQUENTIAL"});})();
