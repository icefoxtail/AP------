window.examTitle = "PALMA_2025_QID9_20_A2";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q20-A2",
    "level": "중",
    "difficultyBucket": 2,
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
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "집합"
    ],
    "wide": false,
    "content": "1학년 학생 40명 중 한국사 학습반에 참여한 학생이 24명, 영어 학습반에 참여한 학생이 31명이다. 두 학습반 모두에 참여한 학생 수의 최솟값과 최댓값을 구하고 서술하시오.",
    "choices": [],
    "answer": "최솟값 $15$명, 최댓값 $24$명",
    "solution": "두 모임에 모두 속한 학생을 $x$명이라 하자.\n합집합 크기는 $24+31-x=55-x$이고, 전체가 $40$명이므로 $55-x\\le40$이다.\n또한 $0\\le x\\le\\min(24,31)=24$이다.\n위의 모든 조건을 풀어 교집합의 가능한 범위 $15\\le x\\le24$를 얻는다.\n$x=15$일 때 네 영역(두 모임 모두/첫째 모임에만/둘째 모임에만/어느 모임에도 속하지 않음)의 인원은 15/9/16/0명, $x=24$일 때는 24/0/7/9명이다. 네 영역 모두 음수가 아닌 정수이고 추가 조건까지 만족하므로 두 끝값은 실제로 가능하다.\n따라서 교집합 인원수의 최솟값은 $15$명, 최댓값은 $24$명이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q20-A2-solution.svg",
    "solutionImageAlt": "한국사 학습반와 집합 B의 네 소속 영역, 합집합, 전체 인원을 정확히 비교한 표(구역 / 교집합 최소 사례 / 교집합 최대 사례).",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 20,
    "slot": "A2",
    "purposeGroup": "A"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q20-A2");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q20-A2","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"교집합과 합집합","rpmL4":"원소 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-238","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"SEQUENTIAL","difficultyBucket":2,"level":"중","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_OPERATION_CARDINALITY_COMPOSITE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"f34a4587b98aaf19c163c2a1897bd90d30d29bb97439d8077d361a6522000b88","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q20-A2.json","sha256":"392ce982c02858b2ed769a13e498f3e8e22e26c62341cdac6a878e0ec85ce232","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q20-A2"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q20_PACKAGE.json","approvedPackageSha256":"4763022a03626ed815a3a043263f9192117b8d00b12dde9b5b6712d626a6dbdf","approvedPackageGitBlobSha1":"64005c59f8c425588396f4c28dde6e39245ccc2b","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q20-A2"},"metaReviewEvidenceSha256":"392ce982c02858b2ed769a13e498f3e8e22e26c62341cdac6a878e0ec85ce232","difficultyBucket":2,"level":"중","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_OPERATION_CARDINALITY_COMPOSITE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE"],"integrationPattern":"SEQUENTIAL"});})();
