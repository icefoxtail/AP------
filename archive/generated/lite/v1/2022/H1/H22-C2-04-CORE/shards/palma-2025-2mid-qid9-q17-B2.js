window.examTitle = "PALMA_2025_QID9_17_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q17-B2",
    "level": "상",
    "difficultyBucket": 4,
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
    "content": "원 $x^2+y^2=3$ 위의 세 점 $A(\\sqrt3,0)$, $B(\\dfrac{\\sqrt3}{2},\\dfrac32)$, $P(\\dfrac32,\\dfrac{\\sqrt3}{2})$가 있다. 점 $Q$는 선분 $OB$ 위, 점 $R$은 선분 $OA$ 위를 움직인다. 삼각형 $PQR$의 둘레의 길이가 최소가 될 때, 선분 $QR$의 길이는? (단, $O$는 원점이다.)",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac{\\sqrt3}{2}$",
      "$\\sqrt3$",
      "$3$",
      "$1$"
    ],
    "answer": "⑤",
    "solution": "$\\angle AOB=60^\\circ$이고 $P$는 그 사이의 $30^\\circ$ 방향에 있다. $P$를 $OB$에 대칭이동한 점은 $P_1=(0,\\sqrt3)$, $OA$에 대칭이동한 점은 $P_2=(\\dfrac32,-\\dfrac{\\sqrt3}{2})$이다. 둘레가 최소일 때 $P_1,Q,R,P_2$는 이 순서로 일직선상에 있다. 선분 $P_1P_2$와 $OB$의 교점은 $Q=(\\dfrac12,\\dfrac{\\sqrt3}{2})$, $OA$의 교점은 $R=(1,0)$이다. 따라서 $QR=\\sqrt{(1-\\dfrac12)^2+(0-\\dfrac{\\sqrt3}{2})^2}=1$이고 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q17-B2-solution.svg",
    "solutionImageAlt": "반사로 펼친 경로의 점 P₁, Q, R, P₂의 순서와 최솟값이 되는 선분을 나타낸 도형.",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 17,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q17-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q17-B2","meta":{"rpmL1":"도형의 방정식","rpmL2":"도형의 이동","rpmL3":"대칭이동","rpmL4":"직선에 대한 대칭","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-228","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"REINTERPRETATION","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_REFLECTION_SHORTEST","templateKey":"TT_SHORTEST_WITH_POSITION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"9d3d231c41b5afef9a563c16f54b68280a3ac79a1424a147aef6de28145d476e","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q17-B2.json","sha256":"50928aa1383e56aaa11c1f06df9e807337ecd5206a2187d1c1a49ac9b4e11fa0","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q17-B2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_PACKAGE.json","approvedPackageSha256":"38a8c50a999b48bae2f7c75df1116e87430606b21b1d89d2278ae20136169ba9","approvedPackageGitBlobSha1":"e06bd2f8373874aef7765f2cfe9da4dd496e3354","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q17-B2"},"metaReviewEvidenceSha256":"50928aa1383e56aaa11c1f06df9e807337ecd5206a2187d1c1a49ac9b4e11fa0","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_REFLECTION_SHORTEST","templateKey":"TT_SHORTEST_WITH_POSITION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"REINTERPRETATION"});})();
