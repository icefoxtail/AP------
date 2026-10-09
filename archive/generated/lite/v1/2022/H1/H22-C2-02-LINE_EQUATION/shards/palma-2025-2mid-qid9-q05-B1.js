window.examTitle = "PALMA_2025_QID9_05_B1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q05-B1",
    "level": "중",
    "difficultyBucket": 3,
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
    "content": "두 점 $A(0,0)$, $B(t,1)$에 대하여 $t>2$이다. 선분 $AB$의 수직이등분선이 점 $P(2,3)$을 지날 때, 이 수직이등분선의 방정식은?",
    "choices": [
      "$-x+y-1=0$",
      "$x-5y=0$",
      "$5x+y-13=0$",
      "$5x+y=0$",
      "$5x+y-26=0$"
    ],
    "answer": "③",
    "solution": "수직이등분선 위의 점은 두 끝점까지의 거리가 같으므로 $PA^2=PB^2$이다. $PA^2=2^2+3^2=13$, $PB^2=(t-2)^2+(1-3)^2=(t-2)^2+4$이므로 $(t-2)^2=9$이다. 따라서 $t=5$ 또는 $t=-1$인데 $t>2$이므로 $t=5$이다. 이제 $A(0,0)$과 $B(5,1)$의 중점은 $(\\frac52,\\frac12)$, $AB$의 기울기는 $\\frac15$이다. 수직이등분선은 기울기가 $-5$이고 중점을 지나므로 $y-\\frac12=-5(x-\\frac52)$, 즉 $5x+y-13=0$이다. 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 5,
    "slot": "B1",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q05-B1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q05-B1","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.2|직선의 방정식","rpmL3":"L3-1.2.1|직선의 방정식","rpmL4":"EXT-H1-C2-02-Q05-PERP-BISECTOR-INVERSE|등거리 역조건으로 수직이등분선 복원","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-210","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-02-LINE_EQUATION/extension-l4/registry.json","generatedL4RegistrySha256":"4563c60b4f64ea69e8f501fa0a367b07b6ed3514b4a0ff402102599d38378658","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_LINE_EQUATION","templateKey":"TPL_LINE_PERP_BISECTOR","standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-LINE_EQUATION"},"metaFinalSha256":"43362c33eccd64e0f31b84a4de3615f3419dab0f8cd738ecafc997a7b6bc05c4","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q05-B1.json","sha256":"9360e9bd2c618b8bb8a39d0af1a808376cebbe99f2053adf72bfdee4d00140b8","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36","scopeUids":["ALITE-PALMA25-2MID-Q05-B1"],"uid":"ALITE-PALMA25-2MID-Q05-B1"},"metaReviewEvidenceSha256":"9360e9bd2c618b8bb8a39d0af1a808376cebbe99f2053adf72bfdee4d00140b8","difficultyBucket":3,"level":"중","problemTypeKey":"PT_LINE_EQUATION","templateKey":"TPL_LINE_PERP_BISECTOR","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
