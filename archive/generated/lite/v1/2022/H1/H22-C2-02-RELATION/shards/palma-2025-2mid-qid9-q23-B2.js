window.examTitle = "PALMA_2025_QID9_23_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q23-B2",
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
    "content": "두 직선 $x=0$과 $y=\\dfrac34x$로부터의 거리가 각각 $3$, 양수 $t$인 점은 서로 다른 네 개이다. 이 네 점을 꼭짓점으로 하는 사각형의 넓이가 $60$일 때, $t$의 값을 풀이 과정과 함께 구하시오.",
    "choices": [],
    "answer": "$t=4$",
    "solution": "직선 $x=0$에서 거리가 $3$이므로 네 점은 $x=3$ 또는 $x=-3$ 위에 있다.\n다른 직선은 $3x-4y=0$이고 그 거리 조건은 $\\dfrac{|3x-4y|}{5}=t$, 즉 $3x-4y=\\pm5t$이다.\n같은 $x$ 위의 두 점 사이의 거리는 $\\dfrac{10t}{4}=\\dfrac{5t}{2}$이다.\n두 수직선 사이의 거리는 $6$이므로 평행사변형의 넓이는 $6\\times\\dfrac{5t}{2}=15t$이다.\n따라서 $15t=60$에서 $t=4$이다. 양수 조건을 만족하므로 구하는 값은 $4$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q23-B2-solution.svg",
    "solutionImageAlt": "P, Q, R, S로 표시한 평행사변형이다. PS=10, 높이 HK=6이며, 내부의 60은 조건으로 주어진 넓이이다.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 23,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q23-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q23-B2","meta":{"rpmL1":"도형의 방정식","rpmL2":"직선의 방정식","rpmL3":"점과 직선 사이의 거리","rpmL4":"도형의 넓이·최소거리","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-216","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-RELATION"},"metaFinalSha256":"dfbde46b17079e4b281b8a7669574d7831b4ed0d4dd6396dcf7a5ea219f16124","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q23-B2.json","sha256":"47d511fbc133609aef5b68bc9aef3a79b4604f5ee925da52c5cdef3fbbe42acc","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q23-B2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json","approvedPackageSha256":"35bc07b4c58ec211da164f163799ade285d78fc72d2a478b8bdc40c62a5a6c22","approvedPackageGitBlobSha1":"bf8028c151f991592631e399459171363e59ec0a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q23-B2"},"metaReviewEvidenceSha256":"47d511fbc133609aef5b68bc9aef3a79b4604f5ee925da52c5cdef3fbbe42acc","difficultyBucket":4,"level":"상","problemTypeKey":"PT_POINT_LINE_DISTANCE","templateKey":"TPL_DISTANCE_AREA_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
