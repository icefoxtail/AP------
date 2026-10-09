window.examTitle = "PALMA_2025_QID9_09_A1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q09-A1",
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
    "content": "좌표평면 위의 세 점 $O(0,0)$, $A(9,0)$, $B(3,9)$에 대하여 세 선분 $OA$, $AB$, $BO$를 각각 $2:1$로 내분하는 점을 $C$, $D$, $E$라 하자. 삼각형 $CDE$의 무게중심이 $(a,b)$일 때, $a+b$의 값은?",
    "choices": [
      "$12$",
      "$7$",
      "$9$",
      "$21$",
      "$\\dfrac{21}{2}$"
    ],
    "answer": "②",
    "solution": "$OC:CA=2:1$이므로 $C=(6,0)$이다. $AD:DB=2:1$이므로 $D=\\left(\\dfrac{9+2\\cdot3}{3},\\dfrac{0+2\\cdot9}{3}\\right)=(5,6)$이다. $BE:EO=2:1$이므로 $E=\\left(\\dfrac{3}{3},\\dfrac{9}{3}\\right)=(1,3)$이다.\n따라서 삼각형 $CDE$의 무게중심은 $\\left(\\dfrac{6+5+1}{3},\\dfrac{0+6+3}{3}\\right)=(4,3)$이다. 그러므로 $a+b=7$이므로 정답은 ②이다.",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 9,
    "slot": "A1",
    "purposeGroup": "A",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q09-A1-solution.svg",
    "solutionImageSize": "large",
    "solutionImageAlt": "삼각형과 점 O, A, B, C, D, E, G 및 세 길이비.",
    "solutionImageCaption": "각 선분의 소유 점과 길이비 관계를 확인한다."
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q09-A1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q09-A1","meta":{"rpmL1":"도형의 방정식","rpmL2":"평면좌표","rpmL3":"삼각형의 무게중심","rpmL4":"좌표로 무게중심","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-208","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"crossConceptRegistryRef":null,"conditionRegistryRef":null,"sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","standardCourse":"공통수학2","standardUnitKey":"H22-C2-01","subUnitKey":"H22-C2-01-GEOMETRY_APPLICATION"},"metaFinalSha256":"089a7adab90ead86cdaa1faeb38b4f9650141d6c73c6c9efe8eac31c1c38ab70","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q09-A1.json","sha256":"3c2114e73fe81875118ce278ff295711c418094fdfb6e298d814d6fbd5e846cd","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q09_Q12_36","scopeUids":["ALITE-PALMA25-2MID-Q09-A1"],"uid":"ALITE-PALMA25-2MID-Q09-A1"},"metaReviewEvidenceSha256":"3c2114e73fe81875118ce278ff295711c418094fdfb6e298d814d6fbd5e846cd","difficultyBucket":3,"level":"중","problemTypeKey":"PT_COORD_CENTROID","templateKey":"TPL_CENTROID_APPLICATION","secondaryConceptKeys":[],"crossConceptKeys":["CC_INTERNAL_DIVISION"],"conditionKeys":[],"integrationPattern":"SEQUENTIAL"});})();
