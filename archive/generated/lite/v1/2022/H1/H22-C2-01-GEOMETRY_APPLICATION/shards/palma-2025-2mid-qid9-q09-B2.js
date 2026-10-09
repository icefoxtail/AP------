window.examTitle = "PALMA_2025_QID9_09_B2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q09-B2",
    "level": "중",
    "difficultyBucket": 3,
    "category": "평면좌표",
    "originalCategory": "평면좌표",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-01",
    "standardUnit": "평면좌표",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
    "subUnit": "도형의 방정식 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평면좌표"
    ],
    "wide": false,
    "content": "삼각형 $OAB$의 꼭짓점은 $O(0,0)$, $A(12,0)$, $B(0,12)$이다. 점 $C$, $D$는 각각 선분 $OA$, $AB$의 중점이고, 점 $E$는 선분 $BO$를 $BE:EO=1:3$으로 내분한다. 삼각형 $CDE$의 무게중심을 $(a,b)$라 할 때, $a+b$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$4$",
      "$27$"
    ],
    "answer": "③",
    "solution": "$C$는 $OA$의 중점이므로 $C=(6,0)$이고, $D$는 $AB$의 중점이므로 $D=(6,6)$이다. $BE:EO=1:3$이므로 $E$는 $B$에서 $O$를 향해 선분 길이의 $\\dfrac14$만큼 이동한 점이다. 따라서 $E=(0,9)$이다.\n이 세 점의 무게중심은 $(a,b)=\\left(\\dfrac{6+6+0}{3},\\dfrac{0+6+9}{3}\\right)=(4,5)$이다. 그러므로 $a+b=9$이므로 정답은 ③이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 9,
    "slot": "B2",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q09-B2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q09-B2","meta":{"rpmL1":"도형의 방정식","rpmL2":"평면좌표","rpmL3":"삼각형의 무게중심","rpmL4":"좌표 도형 활용","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-209","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-01","subUnitKey":"H22-C2-01-GEOMETRY_APPLICATION"},"metaFinalSha256":"9a51c2a75381e5aeb68209d9ac599422ad951585f2c1215c989391816d9a2137","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q09-B2.json","sha256":"a168f711c41ed3a5b14b19aa5b3ab5ca2aa8d2373e6c65a040d806826fe2947d","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q09-B2"],"uid":"ALITE-PALMA25-2MID-Q09-B2"},"metaReviewEvidenceSha256":"a168f711c41ed3a5b14b19aa5b3ab5ca2aa8d2373e6c65a040d806826fe2947d","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
