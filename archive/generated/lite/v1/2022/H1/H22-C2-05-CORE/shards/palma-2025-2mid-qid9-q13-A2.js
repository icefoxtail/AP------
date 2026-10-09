window.examTitle = "PALMA_2025_QID9_13_A2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q13-A2",
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
    "content": "$16$의 정수 약수 전체로 이루어진 집합을 $D$라 하자. $D$의 공집합이 아닌 부분집합 $A$ 중 모든 원소의 곱이 양수인 집합 $A$의 개수는?",
    "choices": [
      "$31$",
      "$496$",
      "$1023$",
      "$512$",
      "$511$"
    ],
    "answer": "⑤",
    "solution": "$16$의 양의 약수는 $1,2,4,8,16$으로 $5$개이며, 음의 약수도 $5$개이다.\n음수 원소의 선택 개수가 짝수여야 하므로 음수 선택은 $\\binom50+\\binom52+\\binom54=1+10+5=16$가지이다.\n양수 선택은 $2^5=32$가지이고, 공집합을 제외해야 한다.\n따라서 구하는 집합의 개수는 $16\\times32-1=511$이므로 정답은 ⑤이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "A2",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q13-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q13-A2","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 뜻과 포함 관계","rpmL3":"부분집합","rpmL4":"EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-234","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json","generatedL4RegistrySha256":"06968c7dd781aca7ca25b99adca3a5706bb29b6f72ac21ece46cd6d117b3b18b","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION","EXT-CC-H1-Q13-COMBINATION-COUNTING"],"conditionKeys":["COND_INTEGER","COND_POSITIVE"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SUBSET_COUNT","templateKey":"TPL_SUBSET_COUNT_SET_CONDITION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"73bc717c7960e4b494bc663cf0c39b65b91cda00f56695ac48510fc3778d52bf","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q13-A2.json","sha256":"c1c37c5fa916f832ff19e1e2a844c8674948d1f7b31e49c2e6fc016f6432a349","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q13-A2"},"metaReviewEvidenceSha256":"c1c37c5fa916f832ff19e1e2a844c8674948d1f7b31e49c2e6fc016f6432a349","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SUBSET_COUNT","templateKey":"TPL_SUBSET_COUNT_SET_CONDITION","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION","EXT-CC-H1-Q13-COMBINATION-COUNTING"],"conditionKeys":["COND_INTEGER","COND_POSITIVE"],"integrationPattern":"SEQUENTIAL"});})();
