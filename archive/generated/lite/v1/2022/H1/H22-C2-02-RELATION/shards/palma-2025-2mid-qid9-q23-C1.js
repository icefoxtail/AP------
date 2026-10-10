window.examTitle = "PALMA_2025_QID9_23_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q23-C1",
    "level": "상",
    "difficultyBucket": 4,
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
    "content": "양수 $k$에 대하여 두 직선 $x=0$, $y=kx$에서의 거리가 모두 $2$인 서로 다른 네 점을 꼭짓점으로 하는 사각형의 넓이가 $20$이다. $k$의 값을 구하시오.",
    "choices": [],
    "answer": "$k=\\dfrac34$",
    "solution": "직선 $x=0$에서 거리가 $2$인 점은 $x=\\pm2$ 위에 있다.\n직선 $y=kx$는 $kx-y=0$이므로 두 번째 거리 조건은 $\\dfrac{|kx-y|}{\\sqrt{k^2+1}}=2$이다.\n따라서 $kx-y=\\pm2\\sqrt{k^2+1}$이며 같은 $x$에서 두 점 사이의 거리는 $4\\sqrt{k^2+1}$이다.\n$x=2$와 $x=-2$ 사이의 거리가 $4$이므로 사각형의 넓이는 $16\\sqrt{k^2+1}$이다.\n$16\\sqrt{k^2+1}=20$이므로 $\\sqrt{k^2+1}=\\dfrac54$이고 $k^2=\\dfrac9{16}$이다.\n$k>0$이므로 구하는 값은 $k=\\dfrac34$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q23-C1-solution.svg",
    "solutionImageAlt": "P, Q, R, S로 표시한 평행사변형이다. PS와 PQ의 길이는 각각 5, 높이 HK는 4이며, 내부에 넓이 20이 표시되어 있다. 주어진 넓이와 높이 관계를 읽을 수 있다.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 23,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q23-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q23-C1","meta":{"rpmL1":"도형의 방정식","rpmL2":"직선의 방정식","rpmL3":"점과 직선 사이의 거리","rpmL4":"도형의 넓이·최소거리","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-216","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-RELATION"},"metaFinalSha256":"dfbde46b17079e4b281b8a7669574d7831b4ed0d4dd6396dcf7a5ea219f16124","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q23-C1.json","sha256":"8c4472cf17f74abff7038c138d5aafb876928374acf8b379780ff735e4645b99","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q23-C1"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json","approvedPackageSha256":"35bc07b4c58ec211da164f163799ade285d78fc72d2a478b8bdc40c62a5a6c22","approvedPackageGitBlobSha1":"bf8028c151f991592631e399459171363e59ec0a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q23-C1"},"metaReviewEvidenceSha256":"8c4472cf17f74abff7038c138d5aafb876928374acf8b379780ff735e4645b99","difficultyBucket":4,"level":"상","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
