window.examTitle = "PALMA_2025_QID9_16_A2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q16-A2",
    "level": "상",
    "difficultyBucket": 4,
    "category": "집합",
    "originalCategory": "집합",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-05",
    "standardUnit": "집합",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-C2-05-CORE",
    "subUnit": "집합 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "집합"
    ],
    "wide": false,
    "content": "전체집합 $U$의 부분집합 $A,B$가 $A\\subseteq U-(B^c\\cup A^c)$를 만족한다. 다음 보기에서 항상 옳은 것만을 있는 대로 고른 것은?<br><br>〈보기〉<br>ㄱ. $A\\cup B=B$<br>ㄴ. $(A\\cup B)^c=A^c$<br>ㄷ. $A-B=\\varnothing$<br>ㄹ. $B\\cap A^c=\\varnothing$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄹ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$U-(B^c\\cup A^c)=A\\cap B$이므로 조건은 $A\\subseteq B$이다.\nㄱ. $A\\cup B=B$이므로 참이다.\nㄴ. $(A\\cup B)^c=B^c$이며, $A^c$와는 항상 같지 않다.\nㄷ. $A\\subseteq B$이므로 $A-B=\\varnothing$이다.\nㄹ. $B\\cap A^c=B-A$이므로 반드시 공집합은 아니다.\n따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 16,
    "slot": "A2",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q16-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q16-A2","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"집합의 연산법칙","rpmL4":"복합 연산","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-242","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["EXT-COND-H1-Q16-SUBSET-INCLUSION"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_JUDGMENT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"48c44008f3bcc6f3d0f0ea94e0ce1991287665f81042bd40fb51699f8e3e36b3","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q16-A2.json","sha256":"64f5812f64225f91d5e23e87e73ebff7bce9ea9d3cba1b90fecdc33dd6705030","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q16-A2"},"metaReviewEvidenceSha256":"64f5812f64225f91d5e23e87e73ebff7bce9ea9d3cba1b90fecdc33dd6705030","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_OPERATION_LAW","templateKey":"TPL_OPERATION_LAW_JUDGMENT","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["EXT-COND-H1-Q16-SUBSET-INCLUSION"],"integrationPattern":"SEQUENTIAL"});})();
