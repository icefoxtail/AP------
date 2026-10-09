window.examTitle = "PALMA_2025_QID9_06_B1";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q06-B1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q06-B1","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.3|원의 방정식","rpmL3":"L3-1.3.2|원과 직선","rpmL4":"L4-1.3.2.1|교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER","COND_POSITIVE"],"integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","conditionEvidenceLabels":["양의 짝수","두 교점"],"conditionRuleModifiers":["EVEN_INTEGER"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"c828a976c42c507e3015bd1f61af84f474404007aec11b898a97adad050383ec","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q06-B1.json","sha256":"61b7721220004722c9a68e0955499b3ab377994ce4a2c138ff21e12481edafae","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q06-B1"],"uid":"ALITE-PALMA25-2MID-Q06-B1"},"metaReviewEvidenceSha256":"61b7721220004722c9a68e0955499b3ab377994ce4a2c138ff21e12481edafae","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER","COND_POSITIVE"],"integrationPattern":"SEQUENTIAL"});})();
