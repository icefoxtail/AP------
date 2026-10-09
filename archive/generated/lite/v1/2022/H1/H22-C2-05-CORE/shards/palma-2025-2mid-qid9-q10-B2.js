window.examTitle = "PALMA_2025_QID9_10_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q10-B2",
    "level": "중",
    "difficultyBucket": 3,
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
    "content": "다음은 전체집합 $U$의 부분집합 $A,B,C$를 나타낸 벤다이어그램이다. 색칠한 두 부분의 합집합과 같은 집합은?",
    "choices": [
      "$A\\cap (B\\cup C)$",
      "$A\\cap B\\cap C$",
      "$(A\\cap (B-C))\\cup (A\\cap (C-B))$",
      "$A-(B\\cup C)$",
      "$(A-B)\\cup (A-C)$"
    ],
    "answer": "③",
    "solution": "색칠한 영역은 두 부분이다. 첫째는 $A,B$에 속하지만 $C$에는 속하지 않는 $A\\cap(B-C)$이고, 둘째는 $A,C$에 속하지만 $B$에는 속하지 않는 $A\\cap(C-B)$이다.\n두 부분을 모두 모으면 $\\big(A\\cap(B-C)\\big)\\cup\\big(A\\cap(C-B)\\big)$이다. 따라서 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 10,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q10-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q10-B2","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"여집합과 차집합","rpmL4":"차집합","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-240","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_VENN_TO_EXPRESSION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"0e422dbf85a3e47b883f55052dfe268251517c1bf5a3fa484e22d35bb888cec5","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q10-B2.json","sha256":"a4737f5484d451a540a251968c4c82d0013fd70b637ca1ea701a47b42e96b979","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q10-B2"],"uid":"ALITE-PALMA25-2MID-Q10-B2"},"metaReviewEvidenceSha256":"a4737f5484d451a540a251968c4c82d0013fd70b637ca1ea701a47b42e96b979","difficultyBucket":3,"level":"중","problemTypeKey":"PT_SET_REGION_EXPRESSION","templateKey":"TPL_VENN_TO_EXPRESSION","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
