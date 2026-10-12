window.examTitle = "PALMA_2025_QID9_17_A1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q17-A1",
    "level": "중",
    "difficultyBucket": 3,
    "category": "도형의 이동",
    "originalCategory": "도형의 이동",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-04",
    "standardUnit": "도형의 이동",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-C2-04-CORE",
    "subUnit": "도형의 이동 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 이동"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=9$ 위의 점 $A(3,0)$, $B(\\dfrac{3\\sqrt2}{2},\\dfrac{3\\sqrt2}{2})$를 잡는다. 작은 호 $AB$ 위의 점 $P$, 선분 $OB$ 위의 점 $Q$, 선분 $OA$ 위의 점 $R$이 움직일 때, 삼각형 $PQR$의 둘레의 길이의 최솟값은? (단, $O$는 원점이다.)",
    "choices": [
      "$3$",
      "$3\\sqrt2$",
      "$3\\sqrt3$",
      "$6$",
      "$6\\sqrt2$"
    ],
    "answer": "②",
    "solution": "점 $P$를 직선 $OB$에 대칭이동한 점을 $P_1$, 직선 $OA$에 대칭이동한 점을 $P_2$라 하자. $Q$는 $OB$ 위, $R$은 $OA$ 위이므로 $PQ=P_1Q$, $PR=P_2R$이다. 따라서 $PQ+QR+RP=P_1Q+QR+RP_2\\ge P_1P_2$이다. 반사 전후의 거리가 같고 $\\angle P_1OP_2=2\\angle AOB$이므로, $OP=r$일 때 $P_1P_2=2r\\sin\\angle AOB$이다. $0^\\circ<\\angle AOB<90^\\circ$인 이 문항에서는 $P$를 호 $AB$의 중점에 잡으면 직선 $P_1P_2$가 선분 $OB$, $OA$를 차례로 지나므로 $Q,R$을 두 교점으로 택하여 등호를 실현한다.\n$r=3$, $\\angle AOB=45^\\circ$이므로 $P_1P_2=2\\cdot3\\cdot\\dfrac{\\sqrt2}{2}=3\\sqrt2$이다. 따라서 최솟값은 $3\\sqrt2$이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q17-A1-solution.svg",
    "solutionImageAlt": "반사로 펼친 경로의 점 P₁, Q, R, P₂의 순서와 최솟값이 되는 선분을 나타낸 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 17,
    "slot": "A1",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q17-A1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q17-A1","meta":{"rpmL1":"도형의 방정식","rpmL2":"도형의 이동","rpmL3":"대칭이동","rpmL4":"직선에 대한 대칭","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-228","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"REINTERPRETATION","difficultyBucket":3,"level":"중","problemTypeKey":"PT_MOVE_REFLECTION_SHORTEST","templateKey":"TT_SHORTEST_MULTI_LINE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"a47f94b2eef739eed88b8044a745989debefd029e9463a37dea363c18ec806ec","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q17-A1.json","sha256":"e9e38ff26c86e4428a1dac1e4b4148f9a4e7b9df19ba073817e0c3cb822253d0","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q17-A1"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_PACKAGE.json","approvedPackageSha256":"38a8c50a999b48bae2f7c75df1116e87430606b21b1d89d2278ae20136169ba9","approvedPackageGitBlobSha1":"e06bd2f8373874aef7765f2cfe9da4dd496e3354","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q17-A1"},"metaReviewEvidenceSha256":"e9e38ff26c86e4428a1dac1e4b4148f9a4e7b9df19ba073817e0c3cb822253d0","difficultyBucket":3,"level":"중","problemTypeKey":"PT_MOVE_REFLECTION_SHORTEST","templateKey":"TT_SHORTEST_MULTI_LINE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"REINTERPRETATION"});})();
