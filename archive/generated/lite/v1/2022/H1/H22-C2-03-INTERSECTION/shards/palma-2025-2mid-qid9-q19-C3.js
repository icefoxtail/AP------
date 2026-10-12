window.examTitle = "PALMA_2025_QID9_19_C3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q19-C3",
    "level": "상",
    "difficultyBucket": 5,
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
    "content": "큰 원 $C:x^2+y^2=16$, 아래쪽 반원호 $S_1:(x+2)^2+y^2=4\\ (y\\le0)$, 위쪽 반원호 $S_2:(x-3)^2+y^2=1\\ (y\\ge0)$이 있다. $1\\le n\\le40$인 자연수 $n$에 대하여 직선 $y=\\dfrac{x+2}{\\sqrt n}$이 세 곡선의 합집합과 서로 다른 다섯 점에서 만나도록 하는 $n$의 개수는?",
    "choices": [
      "$15$",
      "$16$",
      "$17$",
      "$24$",
      "$40$"
    ],
    "answer": "②",
    "solution": "직선의 기울기 $m=1/\\sqrt n$은 양수이고, 직선은 큰 원 내부점 $(-2,0)$과 아래쪽 반원호의 중심을 지난다. 따라서 큰 원과 두 점, 아래쪽 반원호와 한 점에서 만난다. 위쪽 중심 $(3,0)$까지의 거리 $d=\\dfrac{5m}{\\sqrt{1+m^2}}$가 반지름 1보다 작을 때만 위 반원호에 두 교점이 생긴다. $25m^2<1+m^2$에서 $24m^2<1$이고 $m^2=1/n$을 대입하면 $n>24$이다. $n=24$는 접점 하나여서 전체 네 점만 생기므로 제외한다. $1\\le n\\le40$과 결합하면 $n=25,26,\\ldots,40$의 $16$개이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q19-C3-solution.svg",
    "solutionImageAlt": "큰 원과 두 반원호, 직선 n=32, m=1/√32: 5개, 반지름: C 4, S₁ 2, S₂ 1; 접선과 끝점 중복 경계를 구분한 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 19,
    "slot": "C3",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q19-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q19-C3","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원과 직선","rpmL4":"교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","COND_NATURAL_NUMBER"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":5,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"c05f7103745160b8885a77f58ac75ec75cbd6d0e0f8c6333eff3cfe823ab9603","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q19-C3.json","sha256":"427d764d56e12f1422bb2d6d991d72e5d87bc4ee81d879482e89fc762bdf7523","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q19-C3"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q19_PACKAGE.json","approvedPackageSha256":"4fe6a3e4a884682c5b8e02258d426fa22b5cbf786778cf7ae4591840c6ef501f","approvedPackageGitBlobSha1":"4a4636fe6f7412520b9752b82ebef14ea2f4fd3a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q19-C3"},"metaReviewEvidenceSha256":"427d764d56e12f1422bb2d6d991d72e5d87bc4ee81d879482e89fc762bdf7523","difficultyBucket":5,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","COND_NATURAL_NUMBER"],"integrationPattern":"SEQUENTIAL"});})();
