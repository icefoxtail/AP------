window.examTitle = "PALMA_2025_QID9_07_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q07-B2",
    "level": "중",
    "difficultyBucket": 3,
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
    "content": "원 $C_1:(x-1)^2+(y-4)^2=4$를 $x$축의 양의 방향으로 $t$만큼, $y$축의 음의 방향으로 $6$만큼 평행이동한 원을 $C_2$라 하자. 두 원의 넓이를 동시에 이등분하는 직선이 점 $(3,3)$을 지날 때, $t$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$12$",
      "$-12$",
      "$3$"
    ],
    "answer": "③",
    "solution": "원 $C_1$의 중심은 $(1,4)$이고, 원 $C_2$의 중심은 $(1+t,-2)$이다.\n두 원의 넓이를 동시에 이등분하는 직선은 두 중심을 지난다. 이 직선이 $(3,3)$도 지나므로 기울기는 $\\dfrac{3-4}{3-1}=-\\dfrac12$이다.\n한편 두 중심의 y좌표 차는 $-2-4=-6$이고 x좌표 차는 $t$이므로 기울기는 $\\dfrac{-6}{t}$이다.\n따라서 $\\dfrac{-6}{t}=-\\dfrac12$에서 $t=12$이다. 따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 7,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q07-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q07-B2","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.4|도형의 이동","rpmL3":"L3-1.4.1|평행이동","rpmL4":"L4-1.4.1.2|원의 이동","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-226","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_CENTER","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"d63f42ec973d6331c226fce351ac0748999288e3cc9201bf07252afdd909e2b4","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q07-B2.json","sha256":"2d665e9a8ef5a60d5fba7025ee2ec08d823fc5ba19d0949356085e61574a84f9","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q07-B2"],"uid":"ALITE-PALMA25-2MID-Q07-B2"},"metaReviewEvidenceSha256":"2d665e9a8ef5a60d5fba7025ee2ec08d823fc5ba19d0949356085e61574a84f9","difficultyBucket":3,"level":"중","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_CENTER","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
