# META_PIPELINE: 학생 이용 우선, 선승인·후보완

2026-11-05 사용자 지시. 메타의 완성도가 시험지 이용과 출고를 막지 않는다.

- 기존 등록기가 메타 계약을 만족하면 종전대로 정본/Runtime에 반영한다.
- META_PIPELINE_AUDIT 요청이 메타 계약에서 거부되면 원본 요청을 `.archive-meta-register/pending-supplement/`에 보존한다. 영수증은 `USER_APPROVED_PENDING_SUPPLEMENT`, `NOT_VERIFIED`, `canonicalProjectionStatus: NOT_APPLIED`를 명시한다. 이는 사용자 선승인이며 검수 PASS가 아니다.
- 해당 시험지 JS 로드, 문항 수, 발문/보기, 해설 내용 또는 해설 이미지, 로컬 그림 자산 존재를 검사한다. 이용 장애가 있으면 `STUDENT_ACCESS_REPAIR_REQUIRED`로 기록하고 출고 검사를 실패시킨다. 브라우저 렌더 및 수학 검수는 이 검사만으로 PASS가 되지 않는다.
- 메타의 소비자 승인/검색 값 검사는 보고서로 남긴다. 메타 불완전만으로 Pages 후속 출고를 중단하지 않는다. META_PIPELINE 이외 등록 유형의 기존 게이트는 유지한다.
- 변환기는 현재 production JS와 난이도를 쓰지 않는다. 감사본 SHA, 현재 SHA, UID별 payload 차이는 그대로 기록한다. 최신 해설이 달라도 원본을 되돌리지 않고 후보완 요청으로 접수한다. L1/L2 미확정도 후보완으로 기록한다.
- 원본 감사 파일 자체의 SHA 불일치, UID 중복/식별 불능은 별도 BLOCKED 입력 기록으로 남긴다. 그런 상태를 특정 문항의 검증 완료로 꾸미지 않는다.
- 보완 완료 후 새 requestId로 정상 등록기에 재제출한다. 이전 후보완 영수증은 이력으로 보존한다.

학생 이용 검사는 정적 파일 계약 검사다. 실제 UI에 대한 별도 검증은 기존 Archive2 runtime/Chrome CI가 담당한다.

## Archive 2.0 CI 출고 기준

Pages release의 `selection_tests`는 학생용 원본 자산·Consumer 동기화·시험지 선택 테스트를 계속 필수로 검사한다. 메타 등록·보존·분류 완성도 테스트는 별도 `metadata_integrity_tests`로 실행하고 실패 결과를 release gate의 advisory 진단에 남긴다. `Problem Bank Shared Meta`도 메타 진단을 실행해 보완 경고를 남기며, 실제 Chrome 검색·저장 흐름은 필수로 검사한다. 파생 데이터 생성 실패, 원본 자산 누락, 브라우저 이용 장애는 여전히 배포 실패다.
