# JS Archive — 공용 메타 조회 / 시험지별 소형 JSON 수정 계약 (CURRENT v1.0)

> 2026-10-21 사용자 결정. 적용: JS Archive / APMS의 원본·유사·교재·Generated 문항, CREATE/R1/R2/R3, FINAL QA, 감독/출고, Codex·GPT·Gemini를 포함한 모든 메타 수정 작업. 사용자의 현재 명시 지시·수학/정본/품질 계약은 유지한다.

## 한 줄 원칙

**READ SHARED, WRITE SMALL, MATERIALIZE SERVER-SIDE, VERIFY CONSUMER.**

- **READ**: `archive/data/question_metadata.json`은 전 UID의 기존 등록 상태·검색·조회용 공용 집계(projection)다. 대상 `examUid`/`sourceArchiveFile`/`sourceOrdinal`/`questionUid`로 필요한 N행만 추출해 대조한다. 필요한 경우 원본 JS, ACTIVE registry/taxonomy/bindings, RPM/crosswalk/runtime와 소비자 검색 데이터를 함께 읽는다. 공용 집계가 의미 정본의 권위를 대체하지 않는다.
- **WRITE**: 모든 사람·에이전트의 메타 변경 입력은 해당 **시험지 1건의 소형 JSON** 또는 기존 승인된 stage-local 패킷에만 기록한다. UID별 KEEP/CORRECT/REGISTER/NOT_APPLICABLE/HOLD, old/new, 근거, 대상 source/blob SHA와 owner를 포함한다. 문항 JS의 본문/해설/시각 수정은 별도 파일 책임으로 유지한다.
- **MATERIALIZE**: 허가된 단일 GitHub Actions/등록기만 소형 승인 입력을 읽고 공용 `question_metadata.json`, 직접 영향 runtime/DB/index/catalog/Consumer projection을 재생성·커밋한다. 파생 대형 파일은 작업자가 직접 업로드하는 변경 입력이 아니다.
- **VERIFY**: 성공은 정확한 시험지 N/N UID·ACTIVE PT/TPL/binding·source SHA·공용 sidecar·실제 검색/Consumer 유효값·원격 main SHA의 일치를 확인한 뒤만 선언한다. 단순 Actions 시작 또는 JS에 PT/TPL 존재만으로 PASS 금지.

## 금지 / 책임

1. 사람·GPT·Gemini·Codex가 `archive/data/question_metadata.json` 전체를 편집·직접 PUT/contents API 업로드·통째 교체·수동 staged commit하는 작업 **금지**. 대형 파일 작업 실패를 이유로 다시 대형 업로드·분할 업로드로 우회하지 않는다.
2. 무관한 UID의 기존 승인·원본 fingerprint·정답·해설·visual·canonical RPM을 손대지 않는다. 신규 분류/ACTIVE binding이 없으면 의미 근거로 정확한 대상만 처리한다. 빈값이나 임의 PT/TPL로 승인하지 않는다.
3. `CREATE/R1/R2/R3` 단계의 기존 Library/Drive stage-local META 산출물은 소형 승인 패킷으로 보존하고 인계한다. 예약 워커에 Git 직접 쓰기 권한을 새로 주는 정책이 아니다. 인가된 마지막 Git writer만 자동 등록 요청을 제출한다.
4. `FINAL QA`는 수학·해설·메타 기존 검수 증거를 재사용하고 열린 UID만 최소 수정하며, 메타 수정은 소형 패킷으로 인계한다. 검색 자료를 편집 산출물로 취급하지 않는다.
5. GitHub 자동 생성 커밋의 결과물로서 공용 대형 JSON이 변경되는 것은 허용한다. 단 **사용자/에이전트가 직접 편집한 대형 JSON 커밋**과 구별하여 provenance/생성기 실행 증거를 기록한다. 같은 UID는 중복 요청·동시 writer·stale-before가 있으면 fail-closed.
6. 값 변경은 `sourceArchiveFile + ordinal + questionUid`, 이전값 `before`, 목표값 `after`, 최신 blob SHA, schema/owner/stage, proof, 대조 분모를 결속한다. 요청은 idempotent해야 하며 각 UID 변경 근거를 기록한다.
7. 자동 등록 실패 시 `REGISTER_PENDING`/`TOOLING_GAP`/`BLOCKED`와 firstMissingStep를 기록하고 담당자는 그 메타 경로를 수리/인계한다. 공용 JSON 직접 편집으로 우회하거나 완료로 포장하지 않는다.

## 저장 계층과 실제 도구 상태 (2026-10-21)

- 기존 시도 경로: `.archive-meta-register/inbox/*.json` → `.github/workflows/archive-reviewed-exam-meta-register.yml` → `archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs` → GitHub runner의 파생 데이터 생성.
- **중요 제약:** 위 등록기 현재 구현은 `공통수학2`/`H22-C2` 중심으로 하드코딩되어 있고 REVIEW2 승인을 요구한다. **전 과목 FINAL QA 자동 등록은 아직 구현·검증된 상태가 아니다.** 승인 근거 없이 `reviewPassCount=2`로 위장하지 않는다.
- `.github/workflows/archive-reviewed-apply.yml`은 별도의 봉인된 legacy R2 recovery route다. 임의 FINAL QA 패킷을 그 경로로 위장하지 않는다.
- 현재 `archive/build_db.py` 아래 pending 동기화기는 신규 UID/경로 변경 등록이 중심이며, 이미 존재하는 UID의 승인 PT/TPL 보정은 JS 수정만으로 자동 덮어쓰지 않는다.
- 따라서 **정책은 즉시 적용하되, 해당 과목·stage용 안전한 등록기가 아직 없으면 TOOLING_GAP**이다. 단순 문서 변경만으로 차단 규칙/자동 등록/예약 프롬프트/Consumer 반영이 실행됐다고 주장하지 않는다.
- **등록 이후 자동화 (2026-10-22, PR #679 구현):**
  - **단일 writer:** Pages는 트리거 push가 등록 입력 경로(`tools/ci/archive-meta-register-trigger-paths.txt`)를 건드렸으면 등록 workflow가 끝날 때까지 보류한다.
  - **race-safe push:** 등록과 Pages 모두 `tools/ci/git-push-derived-with-retry.mjs`로 main에 push한다.
    - force push는 쓰지 않는다. 원격에 동일 tree가 이미 있으면 `ALREADY_REFLECTED`로 끝낸다.
    - 그렇지 않으면 최신 main에서 재생성·재검증한 뒤 최대 3회까지 다시 push한다.
    - 실패하면 원인·SHA·다음 조치를 Actions Summary에 남긴다.
  - **변경 UID 검증:** push 뒤 소형 JSON의 변경 UID만 실제 consumer(`resolveCatalog`→`ProblemBankMeta.buildIndex`/`query`)로 검사한다(`archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs`).
    - 결과는 `POST_MERGE_VERIFIED` 또는 `REGISTERED_CONSUMER_APPROVAL_FAIL`(시험지·QID·UID·사유·main SHA 표)로 Actions Summary에 남는다.
    - L1~L4·과정·단원 등 배정 필드를 바꾼 UID는 canonical 배정 승인까지 요구한다.
    - 이 검사는 등록 이후 검증이다. FAIL이 나도 이미 main에 들어간 등록은 되돌리지 않고, 열거된 UID를 새 소형 JSON으로 수리한다.

## 구현 담당 후속 작업 (기존 파일 재사용, 별도 코드 변경으로 검증)

1. 등록 요청 스키마에 `examUid`, course/curriculum ownerPack registry 기반 조회, 명시적 `FINAL_QA` provenance 및 `before/after` 처리 추가. 기존 REVIEW2의 의미 계약은 보존.
2. 고2 대수 포함 실제 기존 ACTIVE 단원·PT/TPL/bindings로 동작하도록 하드코딩 해소. 기존 2015/H22 코드 지원은 정본 데이터에 따라 판단. 필요 이상 신규 분류 체계 생성 금지.
3. PR/등록 경로에 **작업자 authored 공용 대형 메타 파일 직접 변경 차단**을 넣고, 승인 Actions-generated projection만 허용하는 검증/권한 설계. 생성자명 단독 신뢰 금지.
4. runner는 정확한 대상 source SHA·UID·before 값 일치 및 ACTIVE 재검증, 대상 영향 최소 재생성, no-op 재실행, 단일 writer, 원격 readback을 수행한다. Pages/일반 CI 장애 처리와 분리.
5. 최초 실증: `26_순천고_1학기_기말_고2_대수` 24문항. q18 의미 분류 확정 후 작은 JSON → 서버 측 24 UID 반영 → Consumer/Search 24/24 parity → main/Notion readback. 실패는 미완료로 남긴다.

## 보고 한 줄 포맷

`examUid | N/N | smallJsonRef+SHA | sourceBlob | targetUIDs | registrationActionRun | sharedProjectionReadback | ConsumerSearchParity | mainSHA | OPEN | nextAction`

기존 전체 FINAL QA·Blind·학생 해설·Meta 검수 의무를 완화하거나 다른 시험지로 범위를 확대하지 않는다.
