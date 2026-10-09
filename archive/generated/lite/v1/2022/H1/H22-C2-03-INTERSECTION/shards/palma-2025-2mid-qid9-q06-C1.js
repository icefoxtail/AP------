window.examTitle = "PALMA_2025_QID9_06_C1";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q06-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q06-C1","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.3|원의 방정식","rpmL3":"L3-1.3.2|원과 직선","rpmL4":"L4-1.3.2.2|현의 길이","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-220","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":["COND_INTEGER"],"integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_CHORD_LENGTH","conditionEvidenceLabels":["현 길이 이상 조건","정수 매개변수"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"5b98aee3b0171bc573e42ba4066fe8e377f1d050dc8199deff58b7d09fdc381b","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q06-C1.json","sha256":"08c33bda985f7ea7ff58d521b72e391dc2cd8c3dac10893e42a4e483fde28bb9","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q06-C1"],"uid":"ALITE-PALMA25-2MID-Q06-C1"},"metaReviewEvidenceSha256":"08c33bda985f7ea7ff58d521b72e391dc2cd8c3dac10893e42a4e483fde28bb9","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_CHORD_LENGTH","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":["COND_INTEGER"],"integrationPattern":"SEQUENTIAL"});})();
