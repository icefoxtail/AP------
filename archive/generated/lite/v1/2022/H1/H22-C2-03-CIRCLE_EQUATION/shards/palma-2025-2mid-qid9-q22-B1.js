window.examTitle = "PALMA_2025_QID9_22_B1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q22-B1",
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
    "content": "세 직선 $l:x-2y-4=0$, $m:2x+y-3=0$, $n:x+3y-9=0$이 이루는 삼각형의 외접원의 중심과 반지름을 구한 뒤, 외접원의 방정식을 서술하시오.",
    "choices": [],
    "answer": "중심 $(3,2)$, 반지름 $\\sqrt{10}$, 방정식 $(x-3)^2+(y-2)^2=10$",
    "solution": "두 직선 $l,m$을 연립하면 $x=2y+4$, $2(2y+4)+y-3=0$에서 $y=-1$, $x=2$이므로 $O=(2,-1)$이다. 두 직선의 기울기는 $\\dfrac12$와 $-2$로 서로 수직이다.\n$l,n$의 교점은 $A=(6,1)$이고 $m,n$의 교점은 $B=(0,3)$이다. 따라서 $OAB$는 $O$가 직각인 삼각형이다.\n외접원의 중심은 빗변 $AB$의 중점 $M=\\left(\\dfrac{6+0}{2},\\dfrac{1+3}{2}\\right)=(3,2)$이다. $MO^2=(3-2)^2+(2+1)^2=10$이므로 반지름은 $\\sqrt{10}$이다.\n따라서 중심은 $(3,2)$, 반지름은 $\\sqrt{10}$이고 외접원의 방정식은 $(x-3)^2+(y-2)^2=10$이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q22-B1-solution.svg",
    "solutionImageAlt": "직각삼각형 OAB와 빗변 AB의 중점을 중심으로 하는 외접원",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 22,
    "slot": "B1",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q22-B1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q22-B1","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원의 방정식","rpmL4":"중심과 반지름","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-217","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-CIRCLE_EQUATION"},"metaFinalSha256":"07e68eeebea1135410bf4c4a662382cd9d6965bf0aa31c0ba775ba7d264f22e0","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q22-B1.json","sha256":"03cbed04660d6646bbddbceee1ac359f0e77b5b3f91c7a91e9d167fd77661169","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q22-B1"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q22_PACKAGE.json","approvedPackageSha256":"c5b99409d85f79fc4e433fa8247493b39919190173c9edc765208722b98be41b","approvedPackageGitBlobSha1":"9a26e0a6787f0d1db494c0dd91c921d801d6b2a7","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q22-B1"},"metaReviewEvidenceSha256":"03cbed04660d6646bbddbceee1ac359f0e77b5b3f91c7a91e9d167fd77661169","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_EQUATION","templateKey":"TM_CIRCLE_CIRCUMCIRCLE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
