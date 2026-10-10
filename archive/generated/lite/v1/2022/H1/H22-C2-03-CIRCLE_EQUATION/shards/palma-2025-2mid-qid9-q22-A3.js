window.examTitle = "PALMA_2025_QID9_22_A3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q22-A3",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-CIRCLE_EQUATION",
    "subUnit": "원의 방정식",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "원의 방정식"
    ],
    "wide": false,
    "content": "세 직선 $l:y=x$, $m:x+y=2$, $n:x-3y+10=0$으로 이루어진 삼각형의 외접원의 방정식을 풀이 과정과 함께 구하시오.",
    "choices": [],
    "answer": "$(x-2)^2+(y-4)^2=10",
    "solution": "$l$과 $m$을 연립하면 $O=(1,1)$이다. 두 직선의 기울기는 $1$과 $-1$로 곱이 $-1$이므로 서로 수직이다.\n$l$과 $n$을 연립하면 $x=y$, $x-3x+10=0$이므로 $A=(5,5)$이다. $m$과 $n$을 연립하면 $x+y=2$, $x-3y+10=0$이므로 $B=(-1,3)$이다.\n직각삼각형 $OAB$의 외접원은 빗변 $AB$를 지름으로 한다. 중심은 $M=\\left(\\dfrac{5-1}{2},\\dfrac{5+3}{2}\\right)=(2,4)$이다. $MO^2=(2-1)^2+(4-1)^2=10$이다.\n따라서 외접원의 방정식은 $(x-2)^2+(y-4)^2=10$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q22-A3-solution.svg",
    "solutionImageAlt": "직각삼각형 OAB와 빗변 AB의 중점을 중심으로 하는 외접원",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 22,
    "slot": "A3",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q22-A3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q22-A3","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 방정식","rpmL4":"중심과 반지름","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-217","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-CIRCLE_EQUATION"},"metaFinalSha256":"07e68eeebea1135410bf4c4a662382cd9d6965bf0aa31c0ba775ba7d264f22e0","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q22-A3.json","sha256":"63b8c17171377568a4c77b86335cda6006a6fb73ba283427d1ad239c21ca33c4","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q22-A3"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q22_PACKAGE.json","approvedPackageSha256":"c5b99409d85f79fc4e433fa8247493b39919190173c9edc765208722b98be41b","approvedPackageGitBlobSha1":"9a26e0a6787f0d1db494c0dd91c921d801d6b2a7","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q22-A3"},"metaReviewEvidenceSha256":"63b8c17171377568a4c77b86335cda6006a6fb73ba283427d1ad239c21ca33c4","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
