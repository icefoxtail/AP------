window.examTitle = "PALMA_2025_QID9_06_B3";
window.questionBank = [
  {
    "id": 1,
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
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q06-B3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q06-B3","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.3|원의 방정식","rpmL3":"L3-1.3.2|원과 직선","rpmL4":"L4-1.3.2.1|교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER","COND_RANGE"],"integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","conditionEvidenceLabels":["정수 기울기","두 교점"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"62edf07f975116cc0c83edcab938bcbcacd9be6191a5150d34731dafdef86917","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q06-B3.json","sha256":"245bac1edeaec6c300952f212fbcfb62855108f8c7fa3ac3435421f994210e0c","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q06-B3"],"uid":"ALITE-PALMA25-2MID-Q06-B3"},"metaReviewEvidenceSha256":"245bac1edeaec6c300952f212fbcfb62855108f8c7fa3ac3435421f994210e0c","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_INTEGER","COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
