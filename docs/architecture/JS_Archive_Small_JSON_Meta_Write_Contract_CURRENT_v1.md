# JS Archive — 공용 메타 조회 / 시험지별 소형 JSON 수정 계약 (CURRENT v1.1)

> 2026-10-21 사용자 결정. 적용: JS Archive / APMS의 원본·유사·교재·Generated 문항, CREATE/R1/R2/R3, FINAL QA, 감독/출고, Codex·GPT·Gemini를 포함한 모든 메타 수정 작업. 사용자의 현재 명시 지시·수학/정본/품질 계약은 유지한다.
>
> [Notion 02-06 메타 업무 라우트](https://app.notion.com/p/4010e68bd69f81588ea0cc325bbe51cb)는 각 작업의 첫 정본 선택을 관리한다. 이 Git 파일만이 공용 조회·소형 JSON 쓰기 원칙의 정본이다.

## 한 줄 원칙

**READ SHARED, WRITE SMALL, MATERIALIZE SERVER-SIDE, VERIFY CONSUMER.**

- **READ**: `archive/data/question_metadata.json`은 전 UID의 기존 등록 상태·검색·조회용 공용 집계(projection)다. 대상 `examUid`/`sourceArchiveFile`/`sourceOrdinal`/`questionUid`로 필요한 N행만 추출해 대조한다. 필요한 경우 원본 JS, ACTIVE registry/taxonomy/bindings, RPM/crosswalk/runtime와 소비자 검색 데이터를 함께 읽는다. 공용 집계가 의미 정본의 권위를 대체하지 않는다.
- **WRITE**: 모든 사람·에이전트의 메타 변경 입력은 해당 **시험지 1건의 소형 JSON** 또는 기존 승인된 stage-local 패킷에만 기록한다. UID별 KEEP/CORRECT/REGISTER/NOT_APPLICABLE/HOLD, old/new, 근거, 대상 source/blob SHA와 owner를 포함한다. 문항 JS의 본문/해설/시각 수정은 별도 파일 책임으로 유지한다.
- **MATERIALIZE**: 허가된 단일 GitHub Actions/등록기만 소형 승인 입력을 읽고 공용 `question_metadata.json`, 직접 영향 runtime/DB/index/catalog/Consumer projection을 재생성·커밋한다. 파생 대형 파일은 작업자가 직접 업로드하는 변경 입력이 아니다.
- **VERIFY (담당 분리)**: 메타 의미 검수·Git `MAIN_DONE`·서버 측 자동 등록/Consumer 검증·Pages 배포는 서로 다른 단계와 증거다. **등록기/Actions 담당**은 승인된 **변경 UID 및 직접 영향 범위**의 source SHA·공용 projection·실제 Consumer/Search 값·main commit을 검증한다. **GPT 사후 FINAL QA 담당**은 필요한 소형 JSON 포함 여부와 원격 main/대상 blob 확인까지 책임지며, 후속 소비자 전수 수동 검증을 `MAIN_DONE` 조건으로 만들지 않는다. 단순 Actions 시작, JS 필드 존재나 미실행 검사로 등록 `PASS` 금지.

## 금지 / 책임

1. 사람·GPT·Gemini·Codex가 `archive/data/question_metadata.json` 전체를 편집·직접 PUT/contents API 업로드·통째 교체·수동 staged commit하는 작업 **금지**. 대형 파일 작업 실패를 이유로 다시 대형 업로드·분할 업로드로 우회하지 않는다.
2. 무관한 UID의 기존 승인·원본 fingerprint·정답·해설·visual·canonical RPM을 손대지 않는다. 신규 분류/ACTIVE binding이 없으면 의미 근거로 정확한 대상만 처리한다. 빈값이나 임의 PT/TPL로 승인하지 않는다.
3. `CREATE/R1/R2/R3` 단계의 기존 Library/Drive stage-local META 산출물은 소형 승인 패킷으로 보존하고 인계한다. 예약 워커에 Git 직접 쓰기 권한을 새로 주는 정책이 아니다. 인가된 마지막 Git writer만 자동 등록 요청을 제출한다.
4. `FINAL QA`는 수학·해설·메타 기존 검수 증거를 재사용하고 열린 UID만 최소 수정하며, 메타 수정은 소형 패킷으로 인계한다. 검색 자료를 편집 산출물로 취급하지 않는다.
5. GitHub 자동 생성 커밋의 결과물로서 공용 대형 JSON이 변경되는 것은 허용한다. 단 **사용자/에이전트가 직접 편집한 대형 JSON 커밋**과 구별하여 provenance/생성기 실행 증거를 기록한다. 같은 UID는 중복 요청·동시 writer·stale-before가 있으면 fail-closed.
6. 값 변경은 `sourceArchiveFile + ordinal + questionUid`, 이전값 `before`, 목표값 `after`, 최신 blob SHA, schema/owner/stage, proof, 대조 분모를 결속한다. 요청은 idempotent해야 하며 각 UID 변경 근거를 기록한다.
7. 자동 등록 실패 시 `REGISTER_PENDING`/`TOOLING_GAP`/`BLOCKED`와 firstMissingStep를 기록하고 담당자는 그 메타 경로를 수리/인계한다. 공용 JSON 직접 편집으로 우회하거나 완료로 포장하지 않는다.

## 등록·검증은 해당 담당 단계에서만 (역할별 계약)

- **인가된 Git writer**가 소형 승인 요청 JSON을 `.archive-meta-register/inbox/*.json` 경로로 제출할 때, 실제 등록기 코드의 지원 과목·승인 schema·source SHA·before 값의 조건을 확인합니다. 미지원은 `TOOLING_GAP` 또는 `REGISTER_PENDING`이며 다른 과목/REVIEW2 승인을 위장해 우회하지 않습니다.
- **GitHub Actions/등록기 기술 소유자**는 실제 변경 UID의 source→공용 projection→Consumer/Search 및 원격 commit을 검증하고 `PIPELINE_PASS`/실패 증거를 남깁니다. 단순 workflow 시작만으로 검증 성공을 주장하지 않습니다.
- **GPT 사후 FINAL QA/사용자 지정 단순 출고**는 [FINAL QA v2.0](../operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md) 및 지정 출고 계약을 따릅니다. 필요한 소형 JSON을 main 병합 입력에 포함하고 대상 원격 SHA/blob 확인 후 `MAIN_DONE`으로 종료하며, **병합 후 UID 전수 검색·Consumer parity 및 CI·Pages 반복 확인을 수동 종료조건으로 붙이지 않습니다.** 사후 FINAL QA에서는 PT/TPL 신규 검수·수리를 사용자 지시에 따라 제외합니다.
- **신규 CREATE/R1/R2/R3·ALIVE**의 의미 메타 검수와 R1 blind 등 최초 품질 의무는 각 역할 정본 그대로입니다. stage Library/Drive worker는 소형 META 패킷을 인계하지만 Git writer 권한은 얻지 않습니다. R1~R3의 품질 PASS는 Actions 성공으로 소급하지 않습니다.

**구현 이력·당시 미지원 과목·PR #679 및 후속 작업안은 [Notion 02-06-A 등록기 구현 이력](https://app.notion.com/p/4010e68bd69f81cc9203ccf1f9165a24)에서만 보관합니다.** 현재 코드 동작은 [workflow](https://github.com/icefoxtail/AP------/blob/main/.github/workflows/archive-reviewed-exam-meta-register.yml)와 실제 등록기 및 Actions 실행 결과가 우선입니다.

## 보고 상태 — 실제 수행한 책임만

- **메타 입력 작성자:** `examUid / sourceBlob / UID 대상 / smallJsonRef+SHA / before→after 근거 / OPEN·firstMissingStep`를 기록합니다. 인가된 등록기 미실행이면 `REGISTER_PENDING` 또는 `NOT_RUN`입니다.
- **Git/main 병합 담당:** 실제 commit/대상 blob 원격 확인과 `MAIN_DONE` 여부를 기록합니다. 아직 실행되지 않은 Consumer/Search parity를 PASS라 적지 않습니다.
- **Actions/기술 담당:** 실제 `registrationActionRun / changedUIDs / sharedProjectionReadback / ConsumerSearchParity / mainSHA / PASS·FAIL`을 기록합니다. 실패한 UID만 해당 후속 등록·수리 이슈로 분리합니다.
- **역할별 QA:** CREATE/R1/R2/R3/ALIVE의 최초 해설·Blind·Golden·메타 품질 분모는 그대로이며, 사후 FINAL QA의 핀포인트 분모와 main 병합 종료 경계는 [해당 v2.0 정본](../operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)이 우선합니다.
