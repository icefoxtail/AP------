window.examTitle = "PALMA_2025_QID9_23_A1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q23-A1",
    "level": "중",
    "difficultyBucket": 3,
    "category": "직선의 방정식",
    "originalCategory": "직선의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-02",
    "standardUnit": "직선의 방정식",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-C2-02-RELATION",
    "subUnit": "두 직선의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "직선의 방정식"
    ],
    "wide": false,
    "content": "두 직선 $x=0$과 $y=\\dfrac{3}{4}x$로부터의 거리가 각각 $3$, $2$인 점은 서로 다른 네 개이다. 이 네 점을 꼭짓점으로 하는 사각형의 넓이를 구하고, 풀이 과정을 서술하시오.",
    "choices": [],
    "answer": "$30$",
    "solution": "직선 $x=0$에서의 거리가 $3$이므로 네 점의 $x$좌표는 $3$ 또는 $-3$이다.\n직선 $y=\\dfrac{3}{4}x$를 $3x-4y=0$으로 나타내면 점 $(x,y)$에서 이 직선까지의 거리는 $\\dfrac{|3x-4y|}{5}$이다.\n따라서 $3x-4y=\\pm10$이고, 같은 $x$에서 두 교점의 $y$좌표 차는 $\\dfrac{2\\times10}{4}=5$이다.\n두 수직선 사이의 거리는 $6$이고 네 교점이 만드는 사각형은 평행사변형이다.\n따라서 넓이는 $6\\times\\dfrac{20}{4}=30$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q23-A1-solution.svg",
    "solutionImageAlt": "P, Q, R, S로 표시한 평행사변형이다. PS=5, 높이 HK=6이며, 내부에 넓이 30가 표시되어 있다.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 23,
    "slot": "A1",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q23-A1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q23-A1","meta":{"rpmL1":"도형의 방정식","rpmL2":"직선의 방정식","rpmL3":"점과 직선 사이의 거리","rpmL4":"도형의 넓이·최소거리","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-216","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-RELATION"},"metaFinalSha256":"4776bcb92c1d46b19386b812f1284c5dd29293e385dcaae8a500f4e6ba89110b","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q23-A1.json","sha256":"cd6b7019d72ec3a330f1223f77e2d083d27fed177226b908b1ccea473018137f","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q23-A1"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json","approvedPackageSha256":"35bc07b4c58ec211da164f163799ade285d78fc72d2a478b8bdc40c62a5a6c22","approvedPackageGitBlobSha1":"bf8028c151f991592631e399459171363e59ec0a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q23-A1"},"metaReviewEvidenceSha256":"cd6b7019d72ec3a330f1223f77e2d083d27fed177226b908b1ccea473018137f","difficultyBucket":3,"level":"중","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
