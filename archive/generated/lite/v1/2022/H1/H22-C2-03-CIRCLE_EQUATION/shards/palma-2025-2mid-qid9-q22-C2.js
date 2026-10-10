window.examTitle = "PALMA_2025_QID9_22_C2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q22-C2",
    "level": "상",
    "difficultyBucket": 4,
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
    "content": "양수 $k$에 대하여 세 직선 $l:x-2y=0$, $m:2x+y=0$, $n:x+3y=k$가 삼각형을 이룬다. 이 삼각형의 외접원 중심의 $x$좌표가 $2$일 때, $k$의 값과 외접원의 방정식을 구하시오.",
    "choices": [],
    "answer": "$k=20$, $(x-2)^2+(y-6)^2=40$",
    "solution": "$l,m$은 기울기 $\\dfrac12,-2$인 수직인 직선이고 교점은 $O=(0,0)$이다.\n$l$에서 $x=2y$이므로 $n$과의 교점은 $A=\\left(\\dfrac{2k}{5},\\dfrac{k}{5}\\right)$이다. $m$에서 $y=-2x$이므로 $n$과의 교점은 $B=\\left(-\\dfrac{k}{5},\\dfrac{2k}{5}\\right)$이다.\n외접원 중심은 $AB$의 중점이므로 $M=\\left(\\dfrac{k}{10},\\dfrac{3k}{10}\\right)$이다. 중심의 $x$좌표가 $2$이므로 $\\dfrac{k}{10}=2$, 즉 $k=20$이다.\n따라서 $M=(2,6)$, $r^2=MO^2=2^2+6^2=40$이므로 외접원의 방정식은 $(x-2)^2+(y-6)^2=40$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q22-C2-solution.svg",
    "solutionImageAlt": "직각삼각형 OAB와 빗변 AB의 중점을 중심으로 하는 외접원",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 22,
    "slot": "C2",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q22-C2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q22-C2","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 방정식","rpmL4":"중심과 반지름","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-217","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-CIRCLE_EQUATION"},"metaFinalSha256":"5334e5655c4ea58937b0147d45f10ecb783f9bbc9caba22353d5eccc35222ce7","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q22-C2.json","sha256":"eea05e5aa15df4fabfdc5e8992ec7726750bca81528bb35a1c11c1b405455b33","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q22-C2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q22_PACKAGE.json","approvedPackageSha256":"c5b99409d85f79fc4e433fa8247493b39919190173c9edc765208722b98be41b","approvedPackageGitBlobSha1":"9a26e0a6787f0d1db494c0dd91c921d801d6b2a7","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q22-C2"},"metaReviewEvidenceSha256":"eea05e5aa15df4fabfdc5e8992ec7726750bca81528bb35a1c11c1b405455b33","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
