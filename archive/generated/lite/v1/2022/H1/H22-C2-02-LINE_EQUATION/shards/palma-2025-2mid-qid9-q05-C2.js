window.examTitle = "PALMA_2025_QID9_05_C2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q05-C2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "직선의 방정식",
    "originalCategory": "직선의 방정식",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-02",
    "standardUnit": "직선의 방정식",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-C2-02-LINE_EQUATION",
    "subUnit": "직선의 방정식",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "직선의 방정식"
    ],
    "wide": false,
    "content": "세 점 $A(3,5)$, $B(4,2)$, $C(0,4)$를 꼭짓점으로 하는 삼각형의 외심의 좌표는?",
    "choices": [
      "$\\left(\\dfrac72,\\dfrac72\\right)$",
      "$\\left(\\dfrac73,\\dfrac{11}3\\right)$",
      "$(2,3)$",
      "$\\left(\\dfrac32,\\dfrac92\\right)$",
      "$(3,2)$"
    ],
    "answer": "③",
    "solution": "외심은 삼각형의 변의 수직이등분선 두 개가 만나는 점이다. $AB$의 중점은 $(\\frac72,\\frac72)$이고 $B-A=(1,-3)$이므로 그 수직이등분선은 $(x-\\frac72)-3(y-\\frac72)=0$, 즉 $x-3y+7=0$이다. $AC$의 중점은 $(\\frac32,\\frac92)$이고 $C-A=(-3,-1)$이므로 그 수직이등분선은 $3x+y-9=0$이다. 연립하면 $x=3y-7$, $3(3y-7)+y=9$이므로 $y=3$, $x=2$이다. 실제로 세 꼭짓점까지의 거리 제곱은 모두 $5$이므로 외심은 $(2,3)$이다. 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 5,
    "slot": "C2",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q05-C2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q05-C2","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.2|직선의 방정식","rpmL3":"L3-1.2.1|직선의 방정식","rpmL4":"EXT-H1-C2-02-Q05-PERP-BISECTOR-APPLICATION|수직이등분선을 이용한 점·넓이·외심 문제","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-210","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-02-LINE_EQUATION/extension-l4/registry.json","generatedL4RegistrySha256":"4563c60b4f64ea69e8f501fa0a367b07b6ed3514b4a0ff402102599d38378658","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCUMCIRCLE"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_LINE_EQUATION","templateKey":"TPL_LINE_PERP_BISECTOR","crossConceptEvidenceLabels":["삼각형의 외심"],"standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-LINE_EQUATION"},"metaFinalSha256":"b4e8e251ce1439b6a16d02451e30a953f65e5784faf40f04421e801b29455e00","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q05-C2.json","sha256":"00948ead839be0fc11554495efccfe8f4cdcbe70b27cd131ada942017f2827ce","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q05-C2"],"uid":"ALITE-PALMA25-2MID-Q05-C2"},"metaReviewEvidenceSha256":"00948ead839be0fc11554495efccfe8f4cdcbe70b27cd131ada942017f2827ce","difficultyBucket":4,"level":"상","problemTypeKey":"PT_LINE_EQUATION","templateKey":"TPL_LINE_PERP_BISECTOR","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCUMCIRCLE"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
