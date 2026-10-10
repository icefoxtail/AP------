window.examTitle = "PALMA_2025_QID9_19_A3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q19-A3",
    "level": "상",
    "difficultyBucket": 4,
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
    "content": "큰 원 $C:(x-\\dfrac12)^2+y^2=\\dfrac{49}{4}$, 아래쪽 반원호 $S_1:(x-2)^2+y^2=4\\ (y\\le0)$, 위쪽 반원호 $S_2:(x+2)^2+y^2=1\\ (y\\ge0)$이 있다. 직선 $y=m(x-2)$가 세 곡선의 합집합과 서로 다른 다섯 점에서 만나게 하는 $m$의 범위는?",
    "choices": [
      "$-\\dfrac14<m<0$",
      "$-\\dfrac1{\\sqrt{15}}\\le m<0$",
      "$-\\dfrac1{\\sqrt{15}}<m\\le0$",
      "$-\\dfrac1{\\sqrt{15}}<m<0$",
      "$0<m<\\dfrac1{\\sqrt{15}}$"
    ],
    "answer": "④",
    "solution": "직선은 큰 원의 내부점 $(2,0)$을 지나므로 큰 원과 두 점에서 만난다. 오른쪽 아래 반원호와 한 점, 왼쪽 위 반원호와 두 점에서 만나려면 기울기가 음수여야 한다. 위 반원호의 중심 $(-2,0)$과 직선까지의 거리는 $d=\\dfrac{4|m|}{\\sqrt{1+m^2}}$이므로 $d<1$에서 $15m^2<1$이다. $m=0$이면 두 반원호의 끝점이 큰 원과 겹쳐 네 점이고 $m=-1/\\sqrt{15}$에서는 접하여 네 점이다. 따라서 $-\\dfrac1{\\sqrt{15}}<m<0$으로 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q19-A3-solution.svg",
    "solutionImageAlt": "큰 원과 두 반원호, 직선 m=−3/20: 5개, 반지름: C 3.5, S₁ 2, S₂ 1; 접선과 끝점 중복 경계를 구분한 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 19,
    "slot": "A3",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q19-A3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q19-A3","meta":{"rpmL1":"도형의 방정식","rpmL2":"원의 방정식","rpmL3":"원과 직선","rpmL4":"교점 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-219","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"CASE_BRANCH","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-03","subUnitKey":"H22-C2-03-INTERSECTION"},"metaFinalSha256":"cf885f6b70e7cfe7adc9b130bc97bada3c50ffa0bfa67d377466f42dece0b59b","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q19-A3.json","sha256":"4909a9391ed21ab9708730be42a890e14e7a1ec11ca205f1b0a0a9a4f053231d","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q19-A3"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q19_PACKAGE.json","approvedPackageSha256":"4fe6a3e4a884682c5b8e02258d426fa22b5cbf786778cf7ae4591840c6ef501f","approvedPackageGitBlobSha1":"4a4636fe6f7412520b9752b82ebef14ea2f4fd3a","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q19-A3"},"metaReviewEvidenceSha256":"4909a9391ed21ab9708730be42a890e14e7a1ec11ca205f1b0a0a9a4f053231d","difficultyBucket":4,"level":"상","problemTypeKey":"PT_CIRCLE_LINE_RELATION","templateKey":"TM_CIRCLE_INTERSECTION_COUNT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"CASE_BRANCH"});})();
