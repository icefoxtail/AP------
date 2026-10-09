window.examTitle = "PALMA_2025_QID9_07_C3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q07-C3",
    "level": "상",
    "difficultyBucket": 4,
    "category": "도형의 이동",
    "originalCategory": "도형의 이동",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-04",
    "standardUnit": "도형의 이동",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-C2-04-CORE",
    "subUnit": "도형의 이동 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 이동"
    ],
    "wide": false,
    "content": "원 $C_1:x^2+y^2=1$을 $x$축의 양의 방향으로 $a$만큼, $y$축의 양의 방향으로 $b$만큼 평행이동한 원을 $C_2$라 하고, 원 $C_3:(x-5)^2+y^2=1$이라 하자. $C_1,C_2$의 넓이를 동시에 이등분하는 직선이 점 $(2,1)$을 지나고, $C_2,C_3$의 넓이를 동시에 이등분하는 직선과 수직일 때, 원 $C_2$의 중심은? (단, $a,b$는 양수이다.)",
    "choices": [
      "$(2,1)$",
      "$(4,-2)$",
      "$(5,0)$",
      "$(1,2)$",
      "$(4,2)$"
    ],
    "answer": "⑤",
    "solution": "원 $C_1$의 중심은 $O(0,0)$, 평행이동한 원 $C_2$의 중심은 $B(a,b)$, 원 $C_3$의 중심은 $C(5,0)$이다.\n$C_1,C_2$의 넓이를 동시에 이등분하는 직선은 $O$, $B$를 지나고 점 $(2,1)$도 지난다. 따라서 그 기울기는 $\\dfrac12$이고, $\\dfrac ba=\\dfrac12$, 즉 $b=\\dfrac a2$이다.\n이와 수직인 $BC$ 직선의 기울기는 $-2$이다. 한편 $BC$의 기울기는 $\\dfrac{0-b}{5-a}=-\\dfrac b{5-a}$이므로 $b=2(5-a)$이다.\n두 식을 연립하면 $\\dfrac a2=10-2a$에서 $5a=20$, 즉 $a=4$이다. 따라서 $b=2$이다.\n그러므로 평행이동한 원 $C_2$의 중심은 $(4,2)$이며 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 7,
    "slot": "C3",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q07-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q07-C3","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.4|도형의 이동","rpmL3":"L3-1.4.1|평행이동","rpmL4":"L4-1.4.1.2|원의 이동","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-226","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_PERPENDICULAR"],"conditionKeys":["COND_POSITIVE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_CENTER","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"05ef9f2a45208fc608bdaa32534f1c9ca4dc80817d53b19fdd50d47d98417640","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q07-C3.json","sha256":"fe506c69fe6da64264a450352b45776e2d91c28372beee70d7fea969ad77a6ad","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q07-C3"],"uid":"ALITE-PALMA25-2MID-Q07-C3"},"metaReviewEvidenceSha256":"fe506c69fe6da64264a450352b45776e2d91c28372beee70d7fea969ad77a6ad","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_CENTER","secondaryConceptKeys":[],"crossConceptKeys":["CC_PERPENDICULAR"],"conditionKeys":["COND_POSITIVE"],"integrationPattern":"SEQUENTIAL"});})();
