window.examTitle = "PALMA_2025_QID9_15_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q15-C1",
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
    "content": "원 $C:(x-2)^2+(y+3)^2=13$을 $x$축의 양의 방향으로 $3$, $y$축의 음의 방향으로 $1$만큼 평행이동한 다음 직선 $y=x$에 대하여 대칭이동하였다. 최종 원의 방정식으로 옳은 것은?",
    "choices": [
      "$(x-5)^2+(y+4)^2=13",
      "$x^2+(y-1)^2=13",
      "$(x-5)^2+(y-4)^2=13",
      "$(x+5)^2+(y+4)^2=13",
      "$(x+4)^2+(y-5)^2=13"
    ],
    "answer": "⑤",
    "solution": "처음 원의 중심은 $(2,-3)$이고 반지름의 제곱은 $13$이다.\n먼저 평행이동하면 중심은 $(2+3,-3-1)=(5,-4)$가 된다.\n직선 $y=x$에 대한 대칭이동에서는 좌표 $(u,v)$가 $(v,u)$로 바뀌므로 최종 중심은 $(-4,5)$이다.\n이동과 대칭이동은 반지름을 보존하므로 최종 원의 방정식은 $(x+4)^2+(y-5)^2=13$이다.\n따라서 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 15,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q15-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q15-C1","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.4|도형의 이동","rpmL3":"L3-1.4.3|이동의 합성","rpmL4":"L4-1.4.3.1|연속 이동","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-229","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_CENTER_RADIUS"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_COMPOSITE","templateKey":"TT_COMPOSITE_CIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"35182ba874b25383243e2c4a84e8bfa654665d5d907a037a9cdc088bad08cef4","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q15-C1.json","sha256":"12d463ad66c6d36071f19968db93e19cb2e3e7862761b7b3670966ad34016b10","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q15-C1"},"metaReviewEvidenceSha256":"12d463ad66c6d36071f19968db93e19cb2e3e7862761b7b3670966ad34016b10","difficultyBucket":4,"level":"상","problemTypeKey":"PT_MOVE_COMPOSITE","templateKey":"TT_COMPOSITE_CIRCLE","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_CENTER_RADIUS"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
