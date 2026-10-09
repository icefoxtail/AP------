window.examTitle = "PALMA_2025_QID9_09_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q09-C1",
    "level": "상",
    "difficultyBucket": 4,
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
    "content": "삼각형 $OAB$의 꼭짓점은 $O(0,0)$, $A(12,0)$, $B(0,12)$이다. 선분 $OA$, $AB$, $BO$ 위의 점 $C$, $D$, $E$는 각각 $OC:CA=1:2$, $AD:DB=1:2$, $BE:EO=2:1$을 만족한다. 삼각형 $OAB$, $CDE$의 무게중심을 각각 $H$, $G$라 할 때, 선분 $GH$의 길이는?",
    "choices": [
      "$0$",
      "$\\dfrac{8}{3}$",
      "$4$",
      "$\\dfrac{4}{3}$",
      "$\\dfrac{4\\sqrt{2}}{3}$"
    ],
    "answer": "④",
    "solution": "내분점 공식으로 $C=(4,0)$, $D=(8,4)$, $E=(0,4)$를 구한다. 따라서 삼각형 $CDE$의 무게중심은 $G=\\left(\\dfrac{4+8+0}{3},\\dfrac{0+4+4}{3}\\right)=\\left(4,\\dfrac83\\right)$이다.\n원래 삼각형 $OAB$의 무게중심은 $H=\\left(\\dfrac{0+12+0}{3},\\dfrac{0+0+12}{3}\\right)=(4,4)$이다. 두 점의 x좌표가 같으므로 $GH=4-\\dfrac83=\\dfrac43$이다. 따라서 정답은 ④이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 9,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q09-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q09-C1","meta":{"rpmL1":"도형의 방정식","rpmL2":"평면좌표","rpmL3":"삼각형의 무게중심","rpmL4":"좌표 도형 활용","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-209","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION","CC_DISTANCE_TWO_POINTS"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":4,"level":"상","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_DISTANCE_RELATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-01","subUnitKey":"H22-C2-01-GEOMETRY_APPLICATION"},"metaFinalSha256":"088a11839f262915e20921303cc3a51558302eacb4787808f316d524616b8005","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q09-C1.json","sha256":"ed01dd36d05bf3d17a69db5fd424bc12667fe51bc2b42679fb610c3cd2e92a38","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q09-C1"],"uid":"ALITE-PALMA25-2MID-Q09-C1"},"metaReviewEvidenceSha256":"ed01dd36d05bf3d17a69db5fd424bc12667fe51bc2b42679fb610c3cd2e92a38","difficultyBucket":4,"level":"상","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_DISTANCE_RELATION","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION","CC_DISTANCE_TWO_POINTS"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
