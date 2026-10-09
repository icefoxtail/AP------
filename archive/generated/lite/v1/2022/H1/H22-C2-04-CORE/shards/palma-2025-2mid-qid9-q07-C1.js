window.examTitle = "PALMA_2025_QID9_07_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q07-C1",
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
    "content": "원 $C_1:(x-1)^2+(y-2)^2=4$를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $q$만큼 평행이동한 원을 $C_2$라 하자. $C_2$가 $y$축에 접하고, 두 원의 넓이를 동시에 이등분하는 직선이 $y=2x$일 때, $q$의 값은? (단, $p>0$이다.)",
    "choices": [
      "$-2$",
      "$0$",
      "$1$",
      "$2$",
      "$4$"
    ],
    "answer": "④",
    "solution": "원 $C_1$의 중심은 $(1,2)$이고 반지름은 $2$이다. 원 $C_2$의 중심은 $(1+p,2+q)$이고 반지름은 변하지 않아 $2$이다.\n$C_2$가 $y$축에 접하므로 중심의 x좌표의 절댓값은 $2$이다. $p>0$에서 $1+p>1$이므로 $1+p=2$, 즉 $p=1$이다.\n두 원의 넓이를 동시에 이등분하는 직선 $y=2x$는 두 원의 중심을 모두 지난다.\n따라서 원 $C_2$의 중심 $(2,2+q)$를 대입하면 $2+q=2\\cdot2=4$이므로 $q=2$이다.\n따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 7,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q07-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q07-C1","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.4|도형의 이동","rpmL3":"L3-1.4.1|평행이동","rpmL4":"L4-1.4.1.2|원의 이동","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-226","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_TANGENCY"],"conditionKeys":["COND_POSITIVE"],"integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_TANGENCY","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"b67306a285284734998625dd2ea1a5af5cbe901319a599c251a5acfb07a55a34","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q07-C1.json","sha256":"6b6827f03e2c109256ff648df65d147f78d37be76ec4fd0c7b065a7769517526","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q07-C1"],"uid":"ALITE-PALMA25-2MID-Q07-C1"},"metaReviewEvidenceSha256":"6b6827f03e2c109256ff648df65d147f78d37be76ec4fd0c7b065a7769517526","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_CIRCLE_TRANSLATION","templateKey":"TT_CIRCLE_TRANSLATION_TANGENCY","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_TANGENCY"],"conditionKeys":["COND_POSITIVE"],"integrationPattern":"SEQUENTIAL"});})();
