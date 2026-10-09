window.examTitle = "PALMA_2025_QID9_06_C3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q06-C3",
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
    "content": "원 $x^2+y^2=25$와 직선 $3x+4y=k$가 서로 다른 두 점 $A,B$에서 만난다. 선분 $AB$의 중점 $M$이 직선 $y=x+\\dfrac35$ 위에 있을 때, 선분 $AB$의 길이는? (단, $k$는 실수이다.)",
    "choices": [
      "$10$",
      "$5$",
      "$16$",
      "$6$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "원의 중심 $O(0,0)$에서 현 $AB$에 내린 수선의 발은 현의 중점 $M$이다.\n직선 $3x+4y=k$의 기울기는 $-\\dfrac34$이므로 $OM$의 기울기는 $\\dfrac43$이다. 따라서 $M$은 직선 $4x-3y=0$ 위에도 있다.\n$M=(u,v)$라 하면 $3u+4v=k$, $4u-3v=0$을 만족한다. 이를 연립하면 $u=\\dfrac{3k}{25}$, $v=\\dfrac{4k}{25}$이다.\n$M$이 $y=x+\\dfrac35$ 위에 있으므로 $v-u=\\dfrac{k}{25}=\\dfrac35$이고, $k=15$이다.\n원점에서 직선 $3x+4y=15$까지의 거리는 $d=\\dfrac{15}{5}=3$이다.\n반지름이 $5$이므로 $AM=BM=\\sqrt{5^2-3^2}=4$이고, $AB=8$이다. 따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 6,
    "slot": "C3",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q06-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q06-C3","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.3|원의 방정식","rpmL3":"L3-1.3.2|원과 직선","rpmL4":"L4-1.3.2.2|현의 길이","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-220","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_CHORD_LENGTH","conditionEvidenceLabels":["현의 중점","두 교점"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"085731b9821bb1883b99cf09cc9f10ba52bc0ecc242d5877e18dfd2a7369ecb5","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q06-C3.json","sha256":"e7c8ea0e52c02db3dae73e80706b4374f9d484a239d7a5e69d5d4a7e52840e6c","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q06-C3"],"uid":"ALITE-PALMA25-2MID-Q06-C3"},"metaReviewEvidenceSha256":"e7c8ea0e52c02db3dae73e80706b4374f9d484a239d7a5e69d5d4a7e52840e6c","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_CHORD_LENGTH","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
