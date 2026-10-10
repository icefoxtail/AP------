window.examTitle = "PALMA_2025_QID9_18_C2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q18-C2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
    "subUnit": "도형의 방정식 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표"
    ],
    "wide": false,
    "content": "실수 $b>0$에 대해 $A(0,0)$, $B(b,0)$, $C(0,6)$을 꼭짓점으로 하는 삼각형의 내심은 $I$이다. 직선 $AI$와 $BC$의 교점을 $H$, 무게중심을 $G$라 할 때 $[GHC]=2$를 만족하는 $b$는?",
    "choices": [
      "$3$",
      "$2$",
      "$4$",
      "$6$",
      "$12$"
    ],
    "answer": "①",
    "solution": "$AB=b,\\ AC=c$일 때 $AI$는 각의 이등분선이므로 $BH:HC=b:c$이고 $\\dfrac{HC}{BC}=\\dfrac{c}{b+c}$이다. 무게중심 $G$의 직선 $BC$에 대한 높이는 꼭짓점 $A$의 높이의 $\\dfrac13$이므로 $[GHC]=[ABC]\\dfrac{c}{3(b+c)}$이다.\n$AB=b$, $AC=6$, $[ABC]=3b$이고 $HC/BC=6/(b+6)$이다. 따라서 $[GHC]=3b\\cdot\\dfrac{6}{b+6}\\cdot\\dfrac13=\\dfrac{6b}{b+6}$. 이 값이 $2$이므로 $6b=2b+12$, $b=3>0$이다. 따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q18-C2-solution.svg",
    "solutionImageAlt": "삼각형 ABC에서 BC 위의 H와 중선 위의 G, I 및 두 삼각형의 넓이비를 나타낸 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 18,
    "slot": "C2",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q18-C2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q18-C2","meta":{"rpmL1":"도형의 방정식","rpmL2":"평면좌표","rpmL3":"삼각형의 무게중심","rpmL4":"EXT-L4-H1-Q18-CENTROID-PARAMETER","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-209","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-01-GEOMETRY_APPLICATION/extension-l4/palma-q18-registry.json","generatedL4RegistrySha256":"5708396e025e01c3f6e501e6292cdbd4c4afc623b89bc5c2478ecd277a4d2c7a","generatedL4RegistryGitBlobSha1":"53817440e3221ee525cf48a7b24fc22b805c6d1f","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q18-ANGLE-BISECTOR"],"conditionKeys":["EXT-COND-H1-Q18-PARAMETER-RANGE"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-01-GEOMETRY_APPLICATION/extension-meta/palma-q18-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-01-GEOMETRY_APPLICATION/extension-meta/palma-q18-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-01","subUnitKey":"H22-C2-01-GEOMETRY_APPLICATION"},"metaFinalSha256":"e6484910ab6d613360e8b3265f85ab1bc9b6374b42c6f087ea3f69f8197a5c9d","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q18-C2.json","sha256":"214bc39836fe27b7f07a93142ce3bed849041d25dbd41c2b0c3dfc90cfd4e01e","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q18-C2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q18_PACKAGE.json","approvedPackageSha256":"b22ff7c9cd28c16acf761a1a89c788bfcc1d58205fd894bded55901ea4e5d021","approvedPackageGitBlobSha1":"90617d697f2e49369ec6edf583d0cacb83b739b3","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q18-C2"},"metaReviewEvidenceSha256":"214bc39836fe27b7f07a93142ce3bed849041d25dbd41c2b0c3dfc90cfd4e01e","difficultyBucket":4,"level":"상","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q18-ANGLE-BISECTOR"],"conditionKeys":["EXT-COND-H1-Q18-PARAMETER-RANGE"],"integrationPattern":"SEQUENTIAL"});})();
