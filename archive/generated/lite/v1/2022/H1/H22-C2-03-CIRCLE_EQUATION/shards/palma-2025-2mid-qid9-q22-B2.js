window.examTitle = "PALMA_2025_QID9_22_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q22-B2",
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
    "content": "세 직선 $l:y=2$, $m:x=1$, $n:2x+3y=14$가 이루는 삼각형의 외접원의 방정식을 $x^2+y^2+ax+by+c=0$ 꼴로 구하고 과정을 서술하시오.",
    "choices": [],
    "answer": "$x^2+y^2-5x-6y+12=0$",
    "solution": "$l,m$의 교점은 $O=(1,2)$이다. $l,n$을 연립하면 $2x+6=14$이므로 $A=(4,2)$이고, $m,n$을 연립하면 $2+3y=14$이므로 $B=(1,4)$이다.\n$l$과 $m$은 수직이므로 $OAB$는 직각삼각형이다. 외접원의 중심은 $AB$의 중점 $M=\\left(\\dfrac{4+1}{2},\\dfrac{2+4}{2}\\right)=\\left(\\dfrac52,3\\right)$이다.\n$MO^2=\\left(\\dfrac52-1\\right)^2+(3-2)^2=\\dfrac{13}{4}$이므로 원은 $\\left(x-\\dfrac52\\right)^2+(y-3)^2=\\dfrac{13}{4}$이다.\n이를 전개하여 $x^2+y^2-5x-6y+12=0$을 얻는다. 따라서 구하는 방정식은 $x^2+y^2-5x-6y+12=0$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q22-B2-solution.svg",
    "solutionImageAlt": "직각삼각형 OAB와 빗변 AB의 중점을 중심으로 하는 외접원",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 22,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q22-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q22-B2","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 방정식","rpmL4":"일반형에서 원 찾기","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-218","rpmDeclaredRecordIds":["H1-RPM-217","H1-RPM-218"],"rpmRecordResolution":{"path":"archive/analysis/palma-mock-builder-20261010/Q22_B2_RPM_RECORD_RESOLUTION.json","sha256":"6711754d129739bb48a02967dcc15c4170afe58804c2e5b27416fc3da36aac31","gitBlobSha1":"ffd9eea8209a532310e9b72db5e7c416a30591f8","declaredRecordIds":["H1-RPM-217","H1-RPM-218"],"selectedRecordId":"H1-RPM-218","selectionBasis":"EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4"},"rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-CIRCLE_EQUATION"},"metaFinalSha256":"78d98a2d59de62c29ee502078cf2f56a8a6b14330a675a34bc14340bc7434b73","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q22-B2.json","sha256":"d938cec0f1faa69c6cf0452b73d06f33aa7eab7f13a98c11f935c17c7a6cf5cf","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q22-B2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q22_PACKAGE.json","approvedPackageSha256":"c5b99409d85f79fc4e433fa8247493b39919190173c9edc765208722b98be41b","approvedPackageGitBlobSha1":"9a26e0a6787f0d1db494c0dd91c921d801d6b2a7","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q22-B2"},"metaReviewEvidenceSha256":"d938cec0f1faa69c6cf0452b73d06f33aa7eab7f13a98c11f935c17c7a6cf5cf","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
