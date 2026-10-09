window.examTitle = "PALMA_2025_QID9_15_C3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q15-C3",
    "level": "상",
    "difficultyBucket": 5,
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
    "content": "원 $C:(x-2)^2+(y+1)^2=4$를 직선 $y=x$에 대하여 대칭이동한 뒤, $x$축의 양의 방향으로 $t$, $y$축의 음의 방향으로 $2t$만큼 평행이동한다. 마지막으로 $y$축에 대하여 대칭이동한 원을 $C'$라 하자.\n$C'$가 $x$축에 접하고 $t>0$일 때, $C'$의 방정식은?",
    "choices": [
      "$(x-1)^2+(y-2)^2=4",
      "$(x-1)^2+(y+2)^2=4",
      "$\\left(x-\\dfrac32\\right)^2+(y+2)^2=4",
      "$(x+1)^2+(y+2)^2=4",
      "$(x-3)^2+(y+2)^2=4"
    ],
    "answer": "④",
    "solution": "원 $C$의 중심은 $(2,-1)$이고 반지름은 $2$이다.\n직선 $y=x$에 대하여 대칭이동하면 중심이 $(-1,2)$가 되고, 이어서 $(t,-2t)$만큼 평행이동하면 $(t-1,2-2t)$가 된다.\n마지막으로 $y$축에 대하여 대칭이동하므로 $C'$의 중심은 $(1-t,2-2t)$이다.\n원 $C'$가 $x$축에 접하려면 중심과 $x$축 사이 거리가 반지름 $2$와 같아야 하므로 $|2-2t|=2$이다.\n따라서 $t=0$ 또는 $t=2$인데 $t>0$이므로 $t=2$이다. 최종 중심은 $(-1,-2)$이다.\n반지름이 그대로 $2$이므로 $C':(x+1)^2+(y+2)^2=4$이고 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 15,
    "slot": "C3",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q15-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q15-C3","meta":{"rpmL1":"L1-1|도형의 방정식","rpmL2":"L2-1.4|도형의 이동","rpmL3":"L3-1.4.3|이동의 합성","rpmL4":"L4-1.4.3.1|연속 이동","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-229","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_CENTER_RADIUS","CC_CIRCLE_TANGENCY"],"conditionKeys":["COND_POSITIVE"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":5,"level":"상","problemTypeKey":"PT_MOVE_COMPOSITE","templateKey":"TT_COMPOSITE_CIRCLE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-04","subUnitKey":"H22-C2-04-CORE"},"metaFinalSha256":"e14139bd5d80b2a2f6e9047b53c85ca6ca2a123abe0821b98c6078e41c41d2ae","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q15-C3.json","sha256":"29fd8b3819706fcd32705edad58ec4d438ba08316c0c772250a82955118f1b01","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q15-C3"},"metaReviewEvidenceSha256":"29fd8b3819706fcd32705edad58ec4d438ba08316c0c772250a82955118f1b01","difficultyBucket":5,"level":"상","problemTypeKey":"PT_MOVE_COMPOSITE","templateKey":"TT_COMPOSITE_CIRCLE","secondaryConceptKeys":[],"crossConceptKeys":["CC_CIRCLE_CENTER_RADIUS","CC_CIRCLE_TANGENCY"],"conditionKeys":["COND_POSITIVE"],"integrationPattern":"SEQUENTIAL"});})();
