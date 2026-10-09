window.examTitle = "PALMA_2025_QID9_13_C3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q13-C3",
    "level": "상",
    "difficultyBucket": 5,
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
    "content": "$12$의 정수 약수 전체의 집합을 $D$라 하자. $D$의 부분집합 $A$가 다음 조건을 모두 만족한다.<br>㈎ $A$의 원소는 정확히 $4$개이다.<br>㈏ $1,-1$ 중 정확히 하나만 $A$에 속한다.<br>㈐ $A$의 모든 원소의 곱은 양수이다.<br>이러한 집합 $A$의 개수는?",
    "choices": [
      "$60$",
      "$145$",
      "$120$",
      "$240$",
      "$255$"
    ],
    "answer": "③",
    "solution": "$12$의 양의 약수와 음의 약수는 각각 $6$개이다. $1,-1$ 중 하나만 포함하는 조건에 따라 두 경우로 나눈다.\n첫째, $1\\in A$이고 $-1\\notin A$이면 남은 양수 $5$개와 음수 $5$개에서 $3$개를 골라야 한다. 음수를 $0$개 또는 $2$개 고를 때 곱이 양수이므로 $\\binom50\\binom53+\\binom52\\binom51=10+50=60$가지이다.\n둘째, $-1\\in A$이고 $1\\notin A$이면 남은 $3$개 중 음수를 $1$개 또는 $3$개 골라야 전체 음수 개수가 짝수이다. 따라서 $\\binom51\\binom52+\\binom53\\binom50=50+10=60$가지이다.\n두 경우가 겹치지 않으므로 모두 $60+60=120$가지이다. 따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 13,
    "slot": "C3",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q13-C3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q13-C3","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 뜻과 포함 관계","rpmL3":"부분집합","rpmL4":"EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY|원소 수 조건과 곱의 부호를 결합한 부분집합 계수","rpmL4Namespace":"GENERATED_EXT_L4","rpmPrimaryRecordId":"H1-RPM-234","rpmAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","generatedL4RegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/palma-q13-registry.json","generatedL4RegistrySha256":"06968c7dd781aca7ca25b99adca3a5706bb29b6f72ac21ece46cd6d117b3b18b","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION","EXT-CC-H1-Q13-COMBINATION-COUNTING"],"conditionKeys":["COND_INTEGER","COND_POSITIVE","EXT-COND-H1-Q13-EXACT-CARDINALITY","EXT-COND-H1-Q13-ONE-OF-PAIR"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q13-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"CASE_BRANCH","difficultyBucket":5,"level":"상","problemTypeKey":"PT_SUBSET_COUNT","templateKey":"TPL_SUBSET_COUNT_SET_CONDITION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"b939046e43991f01ed1801884cbb1462c31891b7072ac7cf640dec4ead72862a","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q13-C3.json","sha256":"4305a7b807f82974a43e87b9810487e40efdd26ad73c32f55d4549b9ce3252ba","reviewStatus":"REVIEW_PASS","uid":"ALITE-PALMA25-2MID-Q13-C3"},"metaReviewEvidenceSha256":"4305a7b807f82974a43e87b9810487e40efdd26ad73c32f55d4549b9ce3252ba","difficultyBucket":5,"level":"상","problemTypeKey":"PT_SUBSET_COUNT","templateKey":"TPL_SUBSET_COUNT_SET_CONDITION","secondaryConceptKeys":[],"crossConceptKeys":["EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION","EXT-CC-H1-Q13-COMBINATION-COUNTING"],"conditionKeys":["COND_INTEGER","COND_POSITIVE","EXT-COND-H1-Q13-EXACT-CARDINALITY","EXT-COND-H1-Q13-ONE-OF-PAIR"],"integrationPattern":"CASE_BRANCH"});})();
