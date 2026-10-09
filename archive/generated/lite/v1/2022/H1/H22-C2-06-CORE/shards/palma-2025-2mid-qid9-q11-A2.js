window.examTitle = "PALMA_2025_QID9_11_A2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q11-A2",
    "level": "하",
    "difficultyBucket": 2,
    "category": "명제",
    "originalCategory": "명제",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-06",
    "standardUnit": "명제",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-C2-06-CORE",
    "subUnit": "명제 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "명제"
    ],
    "wide": false,
    "content": "자연수 $n$에 관한 두 조건 $p$, $q$가 다음과 같을 때, $p$가 $q$이기 위한 필요조건이지만 충분조건은 아닌 것은?",
    "choices": [
      "p: $n$은 $12$의 배수\nq: $n$은 $6$의 배수",
      "p: $n$은 $6$의 배수\nq: $n$은 $6$의 배수",
      "p: $n$은 짝수\nq: $n$은 홀수",
      "p: $n$은 $3$의 배수\nq: $n$은 $12$의 배수",
      "p: $n$은 $10$의 배수\nq: $n$은 $5$의 배수"
    ],
    "answer": "④",
    "solution": "필요조건만 성립하려면 $q\\Rightarrow p$는 참이고 $p\\Rightarrow q$는 거짓이어야 한다.\n④에서 $12$의 배수는 모두 $3$의 배수이므로 $q\\Rightarrow p$이다. 그러나 $n=3$은 $3$의 배수이지만 $12$의 배수가 아니므로 $p\\Rightarrow q$는 거짓이다.\n①과 ⑤는 $p$가 충분조건일 뿐이고, ②는 필요충분조건이다. ③은 어느 쪽도 상대 조건을 함의하지 않는다.\n따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 11,
    "slot": "A2",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q11-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q11-A2","meta":{"rpmL1":"집합과 명제","rpmL2":"명제","rpmL3":"필요조건·충분조건","rpmL4":"조건 관계","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-247","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_NUMBER_DIVISOR_MULTIPLE"],"conditionKeys":["COND_NATURAL_NUMBER"],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":2,"level":"하","problemTypeKey":"PT_NEC_SUFF_RELATION","templateKey":"TPL_NEC_SUFF_DIRECT_JUDGMENT","standardCourse":"공통수학2","standardUnitKey":"H22-C2-06","subUnitKey":"H22-C2-06-CORE"},"metaFinalSha256":"480c0b12d142f8b0cc9ca45eed24e43d65d86c2d17c1d6509c3c77fba4d44fc0","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q11-A2.json","sha256":"6555971b1037d3ccee32816a838194bb3a87f2af0afc85933e66bf21274dbb60","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q11-A2"],"uid":"ALITE-PALMA25-2MID-Q11-A2"},"metaReviewEvidenceSha256":"6555971b1037d3ccee32816a838194bb3a87f2af0afc85933e66bf21274dbb60","difficultyBucket":2,"level":"하","problemTypeKey":"PT_NEC_SUFF_RELATION","templateKey":"TPL_NEC_SUFF_DIRECT_JUDGMENT","secondaryConceptKeys":[],"crossConceptKeys":["CC_NUMBER_DIVISOR_MULTIPLE"],"conditionKeys":["COND_NATURAL_NUMBER"],"integrationPattern":"SEQUENTIAL"});})();
