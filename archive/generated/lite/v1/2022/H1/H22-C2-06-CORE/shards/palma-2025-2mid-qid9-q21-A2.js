window.examTitle = "PALMA_2025_QID9_21_A2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q21-A2",
    "level": "중",
    "difficultyBucket": 2,
    "category": "명제",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "명제"
    ],
    "wide": false,
    "content": "실수 $x$에 대한 조건 $p:x^2-2x-15\\le0$, $q:|x+5|<2$가 있다. 조건 $r$에 대하여 $r\\Rightarrow\\sim p$와 $\\sim p\\Rightarrow r$가 모두 참이다.<br>(1) $p,q$의 진리집합을 각각 구하시오.<br>(2) $r$이 $q$이기 위한 필요조건인지 충분조건인지 판단하고 근거를 쓰시오.",
    "choices": [],
    "answer": "(1) $P=[-3,5],\\ Q=(-7,-3)$; (2) 필요조건(충분조건 아님)",
    "solution": "$x^2-2x-15=(x+3)(x-5)$이므로 $P=[-3,5]$이다. $-2<x+5<2$에서 $Q=(-7,-3)$이다.\n$r$은 $\\sim p$와 동치이므로 $R=(-\\infty,-3)\\cup(5,\\infty)$이다. $Q\\subset R$이므로 $q\\Rightarrow r$은 참이다.\n그러나 $x=6$에서는 $r$은 참이고 $q$는 거짓이므로 $r\\Rightarrow q$는 거짓이다. 특히 $x=-3$은 $p$가 참인 끝점이므로 $r$에 포함되지 않는다.\n따라서 (1) $P=[-3,5]$, $Q=(-7,-3)$이고, (2) $r$은 $q$의 필요조건이지만 충분조건은 아니다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 21,
    "slot": "A2",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q21-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q21-A2","meta":{"rpmL1":"집합과 명제","rpmL2":"명제","rpmL3":"필요조건·충분조건","rpmL4":"조건 관계","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-247","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":2,"level":"중","problemTypeKey":"PT_NEC_SUFF_RELATION","templateKey":"TPL_NEC_SUFF_SET_RELATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-06","subUnitKey":"H22-C2-06-CORE"},"metaFinalSha256":"6d91ba1bc127f68760f43001b326640f1f7e090865d2eebf27709cec03e083ab","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q21-A2.json","sha256":"47fc526b50a0fa21a23909574dbebb554dc0c59fdc0ea26e8ea99e7d526251a1","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q21-A2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q21_PACKAGE.json","approvedPackageSha256":"33de32e2fde2e574f1f841c312911204f306be57273d47b7fc4cbfbb2abca8ae","approvedPackageGitBlobSha1":"125fa58ecf7c1ca5e7944f51963fc659882e2812","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q21-A2"},"metaReviewEvidenceSha256":"47fc526b50a0fa21a23909574dbebb554dc0c59fdc0ea26e8ea99e7d526251a1","difficultyBucket":2,"level":"중","problemTypeKey":"PT_NEC_SUFF_RELATION","templateKey":"TPL_NEC_SUFF_SET_RELATION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
