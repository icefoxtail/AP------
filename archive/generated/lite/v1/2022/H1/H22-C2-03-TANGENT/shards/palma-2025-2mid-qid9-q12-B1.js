window.examTitle = "PALMA_2025_QID9_12_B1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q12-B1",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-TANGENT",
    "subUnit": "원과 접선",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=r^2$ $(0<r<10)$ 밖의 점 $A(6,8)$에서 이 원에 그은 두 접선의 접점을 각각 $P,Q$라 하자. 원점에서 직선 $PQ$까지의 거리가 $4$일 때, $r^2$의 값은?",
    "choices": [
      "$10$",
      "$16$",
      "$24$",
      "$32$",
      "$40$"
    ],
    "answer": "⑤",
    "solution": "원의 반지름을 $r$라 하면 외부점 $A(6,8)$에서 그은 두 접선의 접점을 잇는 직선은 $6x+8y=r^2$이다.\n원점에서 이 직선까지의 거리가 $4$이므로 $\\dfrac{r^2}{\\sqrt{6^2+8^2}}=4$이다. 즉 $\\dfrac{r^2}{10}=4$에서 $r^2=40$이다.\n$r^2=40<100=OA^2$이므로 점 $A$는 실제로 원 밖에 있고 두 접선이 존재한다.\n따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 12,
    "slot": "B1",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q12-B1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q12-B1","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 접선","rpmL4":"EXT-H1-C2-03-Q12-CONTACT-CHORD|외부점의 두 접점과 접점의 현","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-221","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-03-TANGENT/extension-l4/registry.json","generatedL4RegistrySha256":"14605d85adb58dfb34e741b81ac39c015e45b0b801986c124d5f8008c73d6299","secondaryConceptKeys":[],"crossConceptKeys":["CC_POINT_LINE_DISTANCE"],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json","conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_TANGENT","templateKey":"TM_TANGENT_CONTACT_CHORD_LINE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-TANGENT"},"metaFinalSha256":"29a02cd08a5ddca350e93b013719e73379b55de57a6e4baea805ad6fdb508573","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q12-B1.json","sha256":"f0185dc94935085ba43d24f4f671dcce0f59dec3522856831c63e493c252a0b0","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q12-B1"],"uid":"ALITE-PALMA25-2MID-Q12-B1"},"metaReviewEvidenceSha256":"f0185dc94935085ba43d24f4f671dcce0f59dec3522856831c63e493c252a0b0","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_TANGENT","templateKey":"TM_TANGENT_CONTACT_CHORD_LINE","secondaryConceptKeys":[],"crossConceptKeys":["CC_POINT_LINE_DISTANCE"],"conditionKeys":["COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
