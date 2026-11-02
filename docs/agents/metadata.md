# 문항 메타데이터

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT TOP — 단일 메타 Resolver 연결 (2026-10-30)

- 신규 기출 CREATE/R1/R2/R3에서 Primary RPM L1~L4 + CrossConcept/Condition/Integration을 교육과정 내 실제 풀이로 판정하고, PT/TPL은 [단일 진입·Resolver CURRENT](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md)의 공식 명령/ACTIVE 바인딩으로만 투영한다. 작업자가 PT/TPL을 자유 추정하거나 CrossConcept으로 Primary를 대체하지 않는다. 모델 공통 규칙이며 사후 FINAL QA의 기존 PT/TPL 재검 제외·예약 Git writer 금지/현재 캠페인 설정은 유지한다.

## CURRENT — 기본범위 승인 재결속 `archive-basic-scope-rebind-request-v1` (2026-11-02, 사용자 결정)

- 기본범위 승인(question_metadata의 standardUnit/subUnit 승인 행 + `basic-scope-source-links.json` 부모 연결)된 문항의 그림만 바뀌어 fingerprint가 어긋나 strict 검색에서 사라졌을 때, 메타 값은 그대로 두고 원본 해시만 다시 묶는 등록 요청이다. 구현: `archive/tools/meta-foundation/register-basic-scope-rebind.mjs`, 테스트: `tests/archive-basic-scope-rebind.test.mjs`. 이유: 기존 등록기(v2)는 시험지 전체 재등록만 받아 그림 하나 때문에 전체 재검수를 해야 했고, Registration Sync는 본문 fingerprint가 달라진 부모 연결을 조용히 버린다.
- 거부 조건: 요청이 메타 값을 바꾸려 함(before/after는 두 fingerprint만), 승인 행이 아님·검토 초기화 대기, 요청 시험지에 없는 qid, 소스 blob/이전 blob/저장된 fingerprint/after 해시 불일치, 이전 blob이 승인 fingerprint를 재현하지 못함, 정답·선택지·풀이·분류 필드 변경, 본문 변경(맨 앞 `[도형필요]`/`[그래프필요]` 줄 제거와 숫자·`$`·`\` 없는 8자 이하 선언 문구 수정만 허용), 그림 파일 없음, 그림·본문이 실제로 안 바뀜, `basicParent`가 승인 소단원의 유일한 정본 부모가 아님, 기존 연결의 부모 변경. 거부 시 어떤 파일도 쓰지 않는다.
- 이 경로는 검수를 대신하지 않는다. 그림 변경이 문항 의미를 바꾸지 않았다는 확인(문항·해설·정답·그림 직접 확인)을 `evidenceRefs`의 검토 파일에 남긴 요청만 쓴다.

## CURRENT — Generated 확장 키(EXT-*) 등록 (2026-11-02, 사용자 결정)

- 소형 메타가 `EXT-CROSS-*`/`EXT-COND-*`를 쓰면 등록기(`reviewed-exam-registration-v2.mjs`)가 색인·원본 registry·정본 부모·교육과정/과목 범위를 확인하고 받는다. 정본 승격은 일어나지 않는다(정본 registry, compiled, RPM LOCKED, 색인은 바뀌지 않음). 미등록·부모 없음·승격 주장·`GENERATED_ACTIVE` 아님은 계속 거부한다. 이유: 확장 키 하나 때문에 시험지 전체 등록이 막혔다. 상세: [등록 v2](../architecture/Reviewed_Exam_Meta_Registration_v2.md).
- 요청 JSON은 확장 키를 `crossConceptKeys`/`conditionKeys`에 그대로 적는다(`registryChanges`에 확장 정의를 넣지 않는다). 확장 L4(`rpmGeneratedL4Key`)는 등록기 필드가 아니라 원본 JS·확장 registry에 둔다.

## CURRENT TOP — 메타 계약은 정확한 업무 정본으로 이동 (2026-10-22)

- [Notion 02-06 메타데이터 라우트](https://app.notion.com/p/4010e68bd69f81588ea0cc325bbe51cb)에서 **의미 판정**과 **공용 조회/소형 JSON 쓰기** 및 **Git 자동 등록 기술 담당**을 구분한다. 실질적 규칙은 [의미 메타 정본](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md), [소형 JSON 쓰기 정본](../../docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md)에 한 번만 둔다. 기존 역할별 검수·Golden·Blind 의무는 유지한다.
- 공용 대형 메타는 조회용이며 작업자는 시험지 소형 JSON/stage-local 패킷만 수정한다. 병합 후 등록·Consumer/Search parity는 Git 자동화/기술 소유 범위다. GPT 사후 FINAL QA의 종료는 [v2.0 카드](../../docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)대로 Git main/대상 blob 확인까지이며, PT/TPL 신규 검사 제외·후속 CI/Pages 수동 폴링 제외를 지킨다. 자동화 검증을 수행하지 않았으면 `PIPELINE_PASS`라고 주장하지 않는다.

## CURRENT HARD — JS 신규·수정·검수 Meta 필수 확인 (2026-10-10)
- 모든 기출·유사·Generated·교재/평가용 JS의 신규 제작·기존 수정·문항 검수에서 [JS Metadata 필수 계약](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)을 적용한다. 해당 작업 UID의 standardUnit/subUnit·RPM L1~L4·CrossConcept/Condition/Integration/PT/TPL·level/1~5 난이도·UID/sourceQid/provenance·Consumer/index 정합을 확인한다. 미확정 근거는 정확한 EVIDENCE_DEBT로 기록하고 가짜 키/추정값/가짜 NONE으로 채우지 않는다. 핀포인트 작업의 범위를 무관한 문항 전수 재검으로 확대하지 않는다. 메타 변경은 필수 직접 dependency와 운영 검색 projection에 결속한다.
