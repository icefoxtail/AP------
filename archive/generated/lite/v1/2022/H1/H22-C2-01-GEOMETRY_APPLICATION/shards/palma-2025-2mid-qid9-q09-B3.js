window.examTitle = "PALMA_2025_QID9_09_B3";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q09-B3",
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
    "content": "삼각형 $OAB$의 꼭짓점이 $O(0,0)$, $A(9,0)$, $B(0,9)$일 때, 점 $C$, $D$를 각각 선분 $OA$, $AB$의 중점으로 잡는다. 선분 $BO$ 위의 점 $E$에 대하여 삼각형 $CDE$의 무게중심이 $\\left(3,\\dfrac52\\right)$이다. $BE:EO$의 값은?",
    "choices": [
      "$13:5$",
      "$2:1$",
      "$1:2$",
      "$3:1$",
      "$1:1$"
    ],
    "answer": "②",
    "solution": "$C$와 $D$는 중점이므로 $C=(\\dfrac92,0)$, $D=(\\dfrac92,\\dfrac92)$이다. $E$는 선분 $BO$ 위에 있으므로 $E=(0,t)$ ($0<t<9$)로 놓는다.\n삼각형 $CDE$의 무게중심의 y좌표는 $\\dfrac{0+\\frac92+t}{3}=\\dfrac52$이므로 $\\dfrac92+t=\\dfrac{15}{2}$에서 $t=3$이다. 따라서 $BE=9-3=6$, $EO=3$이므로 $BE:EO=6:3=2:1$이다. 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 9,
    "slot": "B3",
    "purposeGroup": "B"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q09-B3");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q09-B3","meta":{"rpmL1":"도형의 방정식","rpmL2":"평면좌표","rpmL3":"삼각형의 무게중심","rpmL4":"좌표 도형 활용","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-209","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_REVERSE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-01","subUnitKey":"H22-C2-01-GEOMETRY_APPLICATION"},"metaFinalSha256":"230a758ebc1411821a57533d280ee2250a270b12eb0350b66142ed2b7770ab6b","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q09-B3.json","sha256":"07c7b77a2537a79eb17f4f1c3c71a7fa00147e1550403592d6bac7a38ab09451","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q09-B3"],"uid":"ALITE-PALMA25-2MID-Q09-B3"},"metaReviewEvidenceSha256":"07c7b77a2537a79eb17f4f1c3c71a7fa00147e1550403592d6bac7a38ab09451","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_REVERSE","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
