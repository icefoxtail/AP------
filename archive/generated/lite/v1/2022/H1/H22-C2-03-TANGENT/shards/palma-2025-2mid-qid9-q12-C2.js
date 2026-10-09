window.examTitle = "PALMA_2025_QID9_12_C2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q12-C2",
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
    "content": "원 $x^2+y^2=16$ 밖의 점 $A(t,6)$에서 이 원에 그은 두 접선의 접점을 각각 $P,Q$라 하자. 직선 $PQ$가 점 $B(1,2)$를 지날 때, 선분 $AP$의 길이는? (단, $t$는 실수이다.)",
    "choices": [
      "$4$",
      "$2\\sqrt{13}$",
      "$6$",
      "$2\\sqrt{17}$",
      "$4\\sqrt3$"
    ],
    "answer": "③",
    "solution": "점 $A(t,6)$에서 그은 접선의 두 접점을 잇는 직선은 $tx+6y=16$이다.\n이 직선이 $B(1,2)$를 지나므로 $t+6\\cdot2=16$, 즉 $t=4$이다.\n따라서 $A=(4,6)$이고, $OA^2=4^2+6^2=52$이다. 원의 반지름이 $4$이며 접점에서 반지름과 접선은 수직이므로\n$AP^2=OA^2-OP^2=52-16=36$이다. 선분의 길이는 양수이므로 $AP=6$이다.\n따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 12,
    "slot": "C2",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q12-C2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q12-C2","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 접선","rpmL4":"EXT-H1-C2-03-Q12-CONTACT-REVERSE|접점 현과 접선 길이 역조건","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-221","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-03-TANGENT/extension-l4/registry.json","generatedL4RegistrySha256":"14605d85adb58dfb34e741b81ac39c015e45b0b801986c124d5f8008c73d6299","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":[],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json","conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_TANGENT","templateKey":"TM_TANGENT_FROM_EXTERNAL_POINT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-TANGENT"},"metaFinalSha256":"df6054baac7e6a89aa3f00e1f6431c7e0800d9ff9807a5fd5e37abef195d62f0","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q12-C2.json","sha256":"94f77caae3731a18b8f727a6f0cb8cdd6e45f6d9b6a17c6bf07ebc558623b276","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q12-C2"],"uid":"ALITE-PALMA25-2MID-Q12-C2"},"metaReviewEvidenceSha256":"94f77caae3731a18b8f727a6f0cb8cdd6e45f6d9b6a17c6bf07ebc558623b276","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_TANGENT","templateKey":"TM_TANGENT_FROM_EXTERNAL_POINT","secondaryConceptKeys":[],"crossConceptKeys":["CC_PYTHAGOREAN"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
