window.examTitle = "PALMA_2025_QID9_20_C1";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2MID-Q20-C1",
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
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "집합"
    ],
    "wide": false,
    "content": "학생 60명 중 독서 동아리 회원이 34명, 과학 동아리 회원이 41명이다. 두 동아리 중 정확히 한 곳에만 속한 학생이 25명 이상일 때 모두 속한 학생 수의 최솟값과 최댓값을 구하고 서술하시오.",
    "choices": [],
    "answer": "최솟값 $15$명, 최댓값 $25$명",
    "solution": "두 모임에 모두 속한 학생을 $x$명이라 하자.\n합집합 크기는 $34+41-x=75-x$이고, 전체가 $60$명이므로 $75-x\\le60$이다.\n또한 $0\\le x\\le\\min(34,41)=34$이다.\n정확히 한 곳에 속한 학생이 25명 이상이어서 $75-2x\\ge25$이다.\n위의 모든 조건을 풀어 교집합의 가능한 범위 $15\\le x\\le25$를 얻는다.\n$x=15$일 때 네 영역(두 모임 모두/첫째 모임에만/둘째 모임에만/어느 모임에도 속하지 않음)의 인원은 15/19/26/0명, $x=25$일 때는 25/9/16/10명이다. 네 영역 모두 음수가 아닌 정수이고 추가 조건까지 만족하므로 두 끝값은 실제로 가능하다.\n따라서 교집합 인원수의 최솟값은 $15$명, 최댓값은 $25$명이다.",
    "solutionImage": "assets/generated-lite/palma-speed-pilot/ALITE-PALMA25-2MID-Q20-C1-solution.svg",
    "solutionImageAlt": "독서 동아리와 집합 B의 네 소속 영역, 합집합, 전체 인원을 정확히 비교한 표(구역 / 교집합 최소 사례 / 교집합 최대 사례).",
    "solutionImageSize": "medium",
    "sourceType": "generated",
    "sourceKind": "generated",
    "sourceQid": 20,
    "slot": "C1",
    "purposeGroup": "C"
  }
];

;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>q.uid === "ALITE-PALMA25-2MID-Q20-C1");if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],{"uid":"ALITE-PALMA25-2MID-Q20-C1","meta":{"rpmL1":"집합과 명제","rpmL2":"집합의 연산","rpmL3":"교집합과 합집합","rpmL4":"원소 개수","rpmL4Namespace":"RPM_EXISTING_DRAFT","rpmPrimaryRecordId":"H1-RPM-238","rpmDraftAuthorityRef":"archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json","rpmDraftAuthoritySha256":"f653f72b6dcb890e0e8b8fa4e75c1f344ee05601a2199379cbf013ac37a1abbf","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","EXT-COND-H1-Q20-EXACTLY-ONE-BOUND"],"crossConceptRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json","conditionRegistryRef":"archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json","sourceKind":"generated","integrationPattern":"CASE_BRANCH","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_OPERATION_CARDINALITY_COMPOSITE","standardCourse":"공통수학2","standardUnitKey":"H22-C2-05","subUnitKey":"H22-C2-05-CORE"},"metaFinalSha256":"3d091766c1f313f817066a2cec2a44085955478e0aa4dcc2ad00f77074d1e473","metaReviewEvidence":{"path":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/AUTO_REGISTER_EVIDENCE/palma-2025-2mid-qid9-q20-C1.json","sha256":"cf40e49afdfffa18cc83d4d58a876a645a9131c0d418e67df02ac138181ca132","reviewStatus":"USER_DIRECTED_QUALITY_APPROVED","approvalBasis":"USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63","scopeUids":["ALITE-PALMA25-2MID-Q20-C1"],"approvalReceiptPath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json","approvalReceiptSha256":"38befc817fb0fc07659ba35f13709c54f07c12715d7680975a3955dae39c2b2d","approvalReceiptGitBlobSha1":"5813555d09e63d3afeb5c3c4e0d941bc2383b0d2","approvedPackagePath":"alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q20_PACKAGE.json","approvedPackageSha256":"4763022a03626ed815a3a043263f9192117b8d00b12dde9b5b6712d626a6dbdf","approvedPackageGitBlobSha1":"64005c59f8c425588396f4c28dde6e39245ccc2b","approvedSourceSnapshot":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76"},"currentSource":{"path":"archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js","gitBlobSha1":"e7ead9fb1404f0fdb01dbfeafdee268f617b992e"},"uid":"ALITE-PALMA25-2MID-Q20-C1"},"metaReviewEvidenceSha256":"cf40e49afdfffa18cc83d4d58a876a645a9131c0d418e67df02ac138181ca132","difficultyBucket":4,"level":"상","problemTypeKey":"PT_SET_CARDINALITY","templateKey":"TPL_OPERATION_CARDINALITY_COMPOSITE","secondaryConceptKeys":[],"crossConceptKeys":[],"conditionKeys":["COND_RANGE","EXT-COND-H1-Q20-EXACTLY-ONE-BOUND"],"integrationPattern":"CASE_BRANCH"});})();
