window.examTitle = "PALMA_2025_QID9_22_B3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q22-B3",
    "level": "상",
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
    "content": "세 직선 $l:y=x$, $m:y=-x+4$, $n:y=5$가 이루는 삼각형의 외접원의 방정식을 구하고, 이 원과 $y$축의 교점의 좌표를 모두 구하시오.",
    "choices": [],
    "answer": "$(x-2)^2+(y-5)^2=9$, 교점 $(0,5+\\sqrt5)$와 $(0,5-\\sqrt5)$",
    "solution": "$l,m$의 교점은 $O=(2,2)$이고 두 직선의 기울기 $1,-1$의 곱은 $-1$이므로 직각을 이룬다.\n$l,n$의 교점은 $A=(5,5)$, $m,n$의 교점은 $B=(-1,5)$이다. 빗변 $AB$의 중점은 $M=(2,5)$이고, $MA=3$이므로 외접원은 $(x-2)^2+(y-5)^2=9$이다.\n$y$축과의 교점에서는 $x=0$이므로 $4+(y-5)^2=9$, 즉 $(y-5)^2=5$이다. 따라서 $y=5\\pm\\sqrt5$이다. 두 교점을 각각 $D(0,5+\\sqrt5)$, $E(0,5-\\sqrt5)$라 하자.\n그러므로 원의 방정식은 $(x-2)^2+(y-5)^2=9$이고, 교점은 $(0,5+\\sqrt5)$와 $(0,5-\\sqrt5)$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q22-B3-solution.svg",
    "solutionImageAlt": "직각삼각형 OAB의 외접원과 중심 M, y축 및 교점 D,E",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 22,
    "slot": "B3",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q22-B3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q22-B3","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 방정식","rpmL4":"중심과 반지름","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-217","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"상","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-CIRCLE_EQUATION"},"metaFinalSha256":"b6387bac2f844a689aeefa748732bce5f02733fe1500264c5ff67ea4b1f1a05c","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q22-B3.json","sha256":"4be40f171a36ed5fe5438eb44451211565cd1b4483146a61215efff0beb3adb6","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q22-B3"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q22_PACKAGE.json","approvedPackageSha256":"c5b99409d85f79fc4e433fa8247493b39919190173c9edc765208722b98be41b","approvedPackageGitBlobSha1":"9a26e0a6787f0d1db494c0dd91c921d801d6b2a7","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q22-B3"},"metaReviewEvidenceSha256":"4be40f171a36ed5fe5438eb44451211565cd1b4483146a61215efff0beb3adb6","difficultyBucket":3,"level":"상","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
