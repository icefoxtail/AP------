window.examTitle = "PALMA_2025_QID9_19_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q19-B2",
    "level": "중",
    "difficultyBucket": 3,
    "category": "원의 방정식",
    "originalCategory": "원의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-03",
    "standardUnit": "원의 방정식",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-C2-03-INTERSECTION",
    "subUnit": "원과 직선·원의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "원의 방정식"
    ],
    "wide": false,
    "content": "큰 원 $C:x^2+y^2=16$, 아래쪽 반원호 $S_1:(x+2)^2+y^2=4\\ (y\\le0)$, 위쪽 반원호 $S_2:(x-2)^2+y^2=4\\ (y\\ge0)$이 있다. 직선 $y=\\dfrac14(x+2)$가 세 곡선의 합집합과 만나는 서로 다른 점의 개수는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$6$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "직선은 큰 원의 내부점 $(-2,0)$을 지나므로 큰 원과 두 점에서 만난다. 양의 기울기이므로 아래쪽 반원호와는 왼쪽 한 점에서 만난다. 위쪽 반원호 중심 $(2,0)$과의 거리는 $d=\\dfrac{4\\cdot(1/4)}{\\sqrt{1+1/16}}=\\dfrac4{\\sqrt{17}}<2$이므로 그 반원호와 두 점에서 만난다. $m\\ne0$일 때 큰 원과 작은 반원호의 끝점은 서로 겹치지 않는다. 따라서 서로 다른 교점은 $2+1+2=5$개이고 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q19-B2-solution.svg",
    "solutionImageAlt": "큰 원과 두 반원호, 직선 m=1/4: 5개, 반지름: C 4, S₁ 2, S₂ 2; 접선과 끝점 중복 경계를 구분한 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 19,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q19-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q19-B2","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원과 직선","rpmL4":"교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"CASE_BRANCH","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"3e67b86d15bebf66e8ba9d624a1310f9ec82f2a0c97f9886abcfbf60cb44067d","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q19-B2.json","sha256":"e7b4a5e76d1bd973d39642298ebdaba6f04edf2eb3f1bd94bc29f47b862a3246","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q19-B2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q19_PACKAGE.json","approvedPackageSha256":"4fe6a3e4a884682c5b8e02258d426fa22b5cbf786778cf7ae4591840c6ef501f","approvedPackageGitBlobSha1":"4a4636fe6f7412520b9752b82ebef14ea2f4fd3a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q19-B2"},"metaReviewEvidenceSha256":"e7b4a5e76d1bd973d39642298ebdaba6f04edf2eb3f1bd94bc29f47b862a3246","difficultyBucket":3,"level":"중","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"CASE_BRANCH"});})();
