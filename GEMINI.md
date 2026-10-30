# Gemini / JS Archive 공통 메타 진입

- 이 저장소의 JS Archive 신규 학교 기출 CREATE/R1/R2/R3 메타 작업 시 [단일 메타 Resolver CURRENT](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md)를 먼저 읽는다.
- 교육과정 내 실제 학생 풀이 → 표준단원/세부단원 → Primary RPM L1~L4 → CrossConcept/Condition/Integration은 의미 판정, PT/TPL은 기존 ACTIVE 정본을 조회하는 공식 Resolver 결과만 사용한다. PT/TPL 임의 추정/중복 생성, 인수분해 보조 개념에 의한 Primary 변경, 범위 밖 미분 풀이 금지.
- 공통 CLI: node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage CREATE|R1|R2|R3 --input <decision.json> --out <archive/_generated/.../evidence.json>. 실행 불가하면 해당 stage evidence에 NOT_RUN/owner를 기록하고 실행 가능한 Git executor에게 인계한다. 메타 결과와 R1~R3/배포 PASS 혼동 금지.
- **범위 제외:** 기존 Gemini 6단계 자동화·예약·스케줄·Google Drive 승인 원본·캠페인 설정은 본 메타 연결만으로 변경하지 않는다. 기존 운영·품질·권한 규칙이 우선한다.
