# Main 병합 후 자동 메타 등록 — CURRENT v1.2

2026-11-05 사용자 결정, 2026-11-06 등록·게시 실행 경로 간소화. 원본/메타 핀포인트 수정 작업자는 표적 검증과 main 병합으로 마감한다. 등록 JSON 작성·파생 데이터 갱신·재시도를 작업자에게 다시 요구하지 않는다.

**4slot 연결:** 이미 작성·검수되어 `archive/data/item-4slot/`에 병합된 compact는 같은 workflow의 독립 4slot 단계가 UID 결속·검증·색인·등록 영수증 저장을 수행한다. [4slot 자동 등록 CURRENT](Archive_4Slot_Auto_Registration_CURRENT.md)를 따른다. 작성 브랜치의 대량 결과물을 다시 작성하거나 승인 없이 일괄 가져오지 않는다. 기존 의미 메타 오류가 정상 4slot 처리를 취소하지 않으며 4slot-only 변경에는 무관한 의미 메타 전체 빌드를 요구하지 않는다.

## 실행과 책임

`Archive Main Auto Metadata`가 main의 단일 공유 등록 writer다. `archive-registration-writer.mjs`가 고정 main snapshot에서 기존 승인 inbox, AutoMeta, 공유 DB/UID/Catalog, Generated/QID9, 학생용 파생 index, 4slot 중 입력·직접 의존성·출력이 바뀐 단계만 실행한다. AutoMeta는 시험지 JS의 변경 ordinal/UID만 처리한다. 별도 inbox 작성 없이 소스에 **실제로 명시된** 메타와 최신 ACTIVE 정본을 확인하여 UID별 소형 요청·영수증을 자동 생성한다. 기존 공식 ACTIVE validator, runtime summary, native build, 실제 Consumer resolver, race-safe push helper를 재사용한다. 전체 시험지 재검수·무관한 UID 재분류·학생용 JS 쓰기는 하지 않는다.

등록은 `metadataRegistrationStatus=REGISTERED`, 근거는 `MAIN_MERGED_EXPLICIT_METADATA`로 기록한다. 이것은 독립 수학검수 또는 FINAL_QA/REVIEW2의 합성 승인이 아니다. 기존 의미 메타와 문제 내용이 같으면 기존 검토 출처를 보존한다. 실제 분류 또는 문제 내용이 바뀌면 이전 독립검수 상태를 새로운 값에 소급하지 않는다. 최신 source에 결속된 등록값은 기존 usable-meta Consumer 경로로 검증한다. 엄격 canonical QA 승인과 등록 성공은 별도다.

## 델타·누락·실패

- 기준은 `auto/state.json`의 마지막 처리 commit이며 이벤트 하나의 HEAD^가 아니다. 여러 병합/누락 이벤트를 누적 대조한다. UID/ordinal/문항번호/실제 fingerprint를 확인하고 재배치·불명확한 식별은 해당 UID만 후보완으로 분리한다.
- 소스에 없는 필드는 정상 sidecar를 지우지 않는다. 바뀐 필드만 새 소스 선언을 적용한다. 정확한 ACTIVE 과정/과목/단원/PT 바인딩, TPL 부모, CC/Condition 및 난이도 필드가 필요하다. 없는 키나 의미 근거를 발명하지 않는다.
- 등록 가능한 UID는 진행하고 불가능한 UID는 원인과 입력 서명을 pending에 기록한다. 같은 입력의 같은 의미 결함을 매시간 재검하지 않으며 소스·관련 메타·registry가 바뀌면 재시도한다. 신규 누락 메타의 내용 작성은 여전히 의미 검토 작업이며 빈값을 승인 처리하지 않는다.
- 동일 UID·source/메타·registry 판본은 동일 request ID다. 기존 요청 내용이 다르면 덮어쓰지 않는다. 영수증은 immutable, Consumer 검증 결과는 `last-verification.json`으로 분리한다.
- 배치 상한은 실제 시도한 UID 수에 적용한다. 첫 쓰기의 report는 선택한 UID/ordinal과 이전 source commit, 처리 후 metadata/identity, source bytes, ACTIVE registry, 설정, 대기열/cursor 및 생성한 요청·영수증을 결속한다. `--replay-report`는 그 배치만 다시 공식 planner로 판정하고 새 적용·출력·대기열 변경이 모두 0인지 검사한다. 같은 pending 입력을 건너뛰고 다음 UID를 선택하는 일반 재호출은 다음 배치이며 재실행 검증으로 사용하지 않는다. 다음 배치는 영속 pending에 남고 이후 정상 writer가 처리한다.
- 원본/비대상 메타 보존, UID별 sidecar/runtime/Consumer 값 대조, 두 번째 실행의 중복 없음이 통과한 뒤 생성물·대기열·cursor를 **한 커밋**으로 저장한다. 실패한 단계의 미검증 생성물과 cursor를 먼저 게시하지 않는다. 고급 메타·4slot 미완료는 상태를 명시하고 기존 독립 처리 정책을 유지하며, 공유 핵심 등록 실패는 publication readiness를 차단한다.
- 기존 reviewed/AutoMeta concurrency group에서 직렬 실행한다. 병행 PR이 main을 전진시키면 기존 helper로 최신 main에서 재생성·재검증 후 최대 2회(재생성 1회) 비강제 push하고, 또 지면 push 없이 끝내 다음 실행(push·시간별)에 넘긴다. 매 candidate의 정확한 parent..head에 기존 Git footprint 검사를 실행한다. 실행 증거와 단계별 실패를 남기며 시간별 catch-up이 마지막 영속 cursor부터 재시도한다.
- 봇 push에 downstream push 이벤트를 기대하지 않는다. 실제 검증한 `registered_sha`를 `registered_main_sha` 입력으로 Pages에 한 번 전달한다. helper의 나중 `main_sha`와 혼동하지 않는다. 배포 성공은 별도 결과이며 등록 성공으로 추정하지 않는다.

## PR 기술검사와 게시 경계

- CI가 PR의 임시 projection과 등록 기술검사를 한 번 수행하고 metadata proof artifact를 남긴다. 같은 러너의 `run-tests`가 같은 PR/base/head/checkout·입력·검사기·CI 실행/attempt에 결속된 proof만 재사용해 중복 카탈로그 빌드를 건너뛴다. 변조·실패·판본 차이는 통과시키지 않는다. 필수 direct Chrome 검사(원본 시험지 접근)는 `Problem Bank Shared Meta`가 `archive/**` PR에서 수행한다(2026-11-07: Archive Registration Sync 제거, Chrome 검사는 Problem Bank Shared Meta, 등록 데이터 검사는 CI). META_V2·검색 보완 진단은 실제 임시 projection이 있는 CI에서 기존 advisory 정책으로 실행한다. PR branch commit/push와 main repair PR 생성은 하지 않는다. 고정 event base와 실제 checkout을 검사하며 이후 무관한 main 이동은 그 결과를 무효화하지 않는다. 실제 merge 충돌과 보호 규칙은 병합 시 별도로 확인한다.
- `.archive-meta-register/auto/writer-state.json`은 기존 단계의 입력·직접 의존성·검사기·출력 digest와 미완료 상태를 저장하는 작은 실행 cursor다. 새로운 승인 기록이 아니다. 입력이 달라지면 실제 native 검사/생성을 다시 수행하고 이전 PASS에 새 digest만 붙이지 않는다. 동일 유효 입력은 commit 없이 NO_OP다.
- Pages는 정확한 등록 SHA를 checkout하고 `--check`로 해당 snapshot의 등록 상태를 읽는다. 실행 YAML도 `GITHUB_WORKFLOW_SHA`의 실제 Git blob을 등록 snapshot과 대조한다. 무관한 main 이동은 허용하지만 YAML 판본이 다르면 게시 전에 중단한다. 공유 등록 데이터를 생성하거나 Git에 commit/push하지 않는다. `build-archive2-catalog --package-only`는 등록된 manifest/index와 일치하는 미추적 패키지 shard만 만든다.
- 실제 학생 패키지 bytes와 외부 R2 이미지·Worker 입력이 게시 receipt와 같으면 NO_OP다. 검사기·비게시 입력이 달라졌으면 이전 검증 PASS를 재사용하거나 새 receipt를 발행하지 않는다. 새 등록 SHA가 이미 게시된 SHA의 과거이면 SUPERSEDED로 끝내며 새 검증 PASS로 표현하지 않는다. 유효한 게시 SHA와 판본 관계가 불명확하면 게시하지 않는다. 게시 receipt가 없거나 조회되지 않으면 checkout 때 고정한 원격 main과 정확히 같은 snapshot만 전체 기술검사 뒤 게시할 수 있다.
- 기존 package manifest/용량 상한, 필요한 Chrome 출력, Worker 준비, R2 이미지의 정확한 bytes(첫 전환에는 legacy 존재 확인을 재사용하지 않음), 실제 step outcome을 읽는 release gate를 유지한다. gate 뒤 `_archive-release.json`을 패키지에 기록해 등록 SHA와 실제 게시본을 연결한다. 실패 시 이전 정상 사이트를 유지한다.
- 시간별 등록 복구와 3시간 주기 Pages 복구는 유지한다. 고정 snapshot이 아직 등록되지 않은 scheduled release는 DEFERRED이며, 정확한 등록 SHA dispatch가 불일치하면 실패다.
- Git 공백 검사는 유지한다. 기존 QID9 SVG는 공식 import manifest의 source와 현재 normalizer로 구한 전체 bytes가 staged 출력과 같고, 지적된 줄도 source에서 그대로 상속됐을 때만 `INHERITED_SOURCE_WHITESPACE`로 구분한다. 원시 Git exit·파일·줄 수를 summary/증거에 남기며 raw `git diff --check` 성공으로 기록하지 않는다. 새 공백·다른 경로·충돌 표식·기존의 더 엄격한 Git 공백 규칙은 계속 차단한다.
- 구 Reviewed workflow의 수동 실행은 단일 writer로 전달한다. 봉인 legacy Apply의 non-main 복구는 유지하지만 main 직접 쓰기는 차단한다. main 입력은 기존 PR/inbox 경로로 전달한다.

- CI의 Pages/Reviewed 종료 `workflow_run`에 따른 이동 main 전체 재검은 퇴역했다. 원래의 plan/test 체크 이름, 고정 PR/push/manual snapshot 검사와 writer의 매 candidate Git footprint 검사는 유지한다. 메타·출력·등록 도구는 직접 Consumer 검사만 선택하고, 미분류 또는 공통 의존 변경은 기존 전체 기술검사를 유지한다. 제외는 NOT_APPLICABLE이며 PASS로 합산하지 않는다.

## 실행 요약에서 볼 수 있는 숫자 (계측, 동작 변화 없음)

writer가 실행마다 남기는 `report.json`(커밋되지 않는 증거)과 `GITHUB_STEP_SUMMARY`에 다음 숫자가 나온다. 어느 레인이 도는지, 무엇을 등록·거절하는지, 커밋되는 파일은 이 숫자에 영향받지 않는다.

- **시간:** 레인별 시간과 semantic 레인 안의 단계별 시간(compile, materialize, build_db 1·2회차, auto-register, verify, 테스트, replay). `archive-main-auto-meta-pass.sh`가 단계마다 `stage-times.jsonl` 한 줄을 쓰고 writer가 모은다.
- **이번 실행의 자동 등록:** 대상·시도·등록(UID·요청·영수증 파일 수)·이미 등록됨·거절·변경 없음으로 건너뜀·배치 상한 때문에 못 본 건수, 시험지 파일별 상위 20개.
- **밀린 것:** pending 총수, 서명 없는 미시도 수, 시도 후 거절 수, 사유별 건수(한 항목이 여러 사유를 가질 수 있어 합이 항목 수보다 크다), 가장 오래된 baseCommit과 그 건수.
- **이번 병합 대 밀린 것:** `lastProcessedCommit..HEAD`의 시험지 diff에서 온 문항 수와 대기열에서 온 문항 수, 그리고 배치 상한 때문에 이번에 못 본 "이번 병합 유래" 문항 수.
- **원본이 바뀌어 건너뛴 검수 payload:** `materialize-meta-v2-payloads`가 payload에 적힌 시험지 blob과 현재 원본이 달라 조용히 적용하지 않은 payload 수·문항 수·파일(상위 20). 도구가 자기 출력 JSON에 이미 내는 `stalePayloads`를 올린 것이며 판정은 바꾸지 않는다. auto-register의 native 영수증 재사용 검사(`nativeReviewReceipt`)가 영수증과 원본이 안 맞아 재사용하지 않는 경우는 건수를 따로 내지 않고 거절 사유(예: `NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED`) 건수로만 보인다.

`report.instrumentation`은 `replayBatch` 밖에 있어 replay 비교·`state.json`·`writer-state.json`에 들어가지 않는다.

## 병합 실행과 소화 실행 (2026-11-18)

writer가 `ARCHIVE_REGISTRATION_MODE`를 한 번 정해 모든 하위 명령에 넘긴다. `push`(main 병합)이면 `merge`, 정시(`schedule`)·수동(`workflow_dispatch`)·로컬·테스트는 `digest`다. 환경 변수에 두 값 중 하나가 이미 있으면 그 값을 따르고 다른 값은 오류다. 이유: main에 병합될 때마다 밀린 pending 전체를 다시 시도하느라 병합 한 건이 12~17분 걸렸고, 방금 병합한 시험지가 밀린 것과 같은 100건 예산을 다퉜다.

- **merge(병합 실행):** 처리 대상은 `lastProcessedCommit..HEAD`의 시험지 diff 문항과 pilot뿐이다. pending은 대상에도 시드에도 넣지 않고 한 글자도 바꾸지 않는다. 기준은 직전 병합이 아니라 영속 cursor라서 중간 push 실행이 동시성 그룹에서 사라져도 문항이 빠지지 않는다. 대상이 0이면 `archive-main-auto-meta-pass.sh`가 compile·materialize 뒤 `--plan`(쓰기 없음)으로 확인하고 build_db 없이 `NO_TARGETS`를 한 줄 낸 뒤 끝낸다. `state.json`은 바이트 그대로다. 대상이 1건 이상이면 이전과 같은 전체 단계(build_db 2회, verify, 테스트, replay)를 모두 돈다.
- **digest(소화 실행):** 이전 동작 그대로 pending 전체를 대상으로 하되, 병합 실행이 상한을 넘겨 못 본 "이번 병합분"을 먼저 시도한다. 시도해 결과(등록이든 거절이든)가 나오면 표식을 지운다. 한 번 처리량(`maxQuestionsPerRun`)은 현재 300이다(아래 "한 번 처리량" 절).
- **미처리 병합분 표식:** 병합 실행이 상한(`maxQuestionsPerRun`, 현재 300)을 넘겨 못 본 문항은 pending에 `origin:"merge"`, `mergeHead:<그 실행의 HEAD>`로 저장된다. cursor 전진과 같은 `state.json` 한 번의 쓰기라 병합분이 사라지지 않는다. 필드가 없는 기존 항목은 일반 backlog다(옛 판본도 새 필드를 버리지 않고 그대로 두며 오류가 나지 않는다). report와 실행 요약에 `mergeNotReached`(이번 병합분 미처리), `mergeBacklog`(표식이 남은 수), `backlogRemaining`(pending 총수)을 따로 보인다.
- **"남은 일"과 "지금 돌 필요"는 다르다.** 병합 실행은 입력이 바뀐 때만 semantic 레인을 돌린다(`assess`가 병합 모드에서는 `needsContinuation`만으로 이 레인을 필요로 보지 않는다). 돌지 않거나 `NO_TARGETS`로 끝난 레인도 writer-state의 `needsContinuation`을 기존 값으로 이어받고(또는 pending이 남았는지로 계산해) pending이 남았으면 `true`를 유지한다. 그래서 병합 실행 요약은 `NO_OP_WITH_BACKLOG`/`PREPARED_WITH_BACKLOG`, `--check`는 `REGISTERED_WITH_BACKLOG`로 "이번엔 필요 없지만 남은 일이 있음"을 표시하고 "완료"로 쓰지 않는다. `publishable`·`registrationReady`·`safeToPersist`는 필수 레인만 보며 이 값을 읽지 않는다. `needsContinuation`을 `false`로 되돌리는 것은 소화 실행이 pending 전체를 훑은 뒤뿐이다.
- **소화 방법:** 정시 실행(매시 43분)이 `maxQuestionsPerRun`건(현재 300)씩 소화한다. 즉시 더 돌리려면 `Archive Main Auto Metadata`를 `workflow_dispatch`(입력 없음)로 실행한다. 병합이 더는 backlog를 줄이지 않으므로 소화 속도는 정시·수동 실행 횟수로 정해진다.
- **fourSlot 단계 시간:** `archive-four-slot-pass.sh`도 semantic 패스와 같은 단계 기록(`build-write`, `check-full-rebuild`, `replay-reuse-cache`, `receipt-proof`, `git-diff-guards`, `path-allowlist`)을 남기고 writer가 요약에 싣는다. 명령 줄은 바꾸지 않았다.
- **롤백:** 이 변경을 되돌려도 `origin`·`mergeHead`가 든 state는 그대로 읽힌다(옛 코드는 필드를 보존하고 새 의미를 쓰지 않는다).

## 한 번 처리량 (2026-11-18)

`.archive-meta-register/auto/config.json`의 `maxQuestionsPerRun`은 300이다(이전 100, 코드 상한 500, 넘으면 `BATCH_LIMIT_INVALID`). 이유: 병합 실행이 밀린 대기열을 줄이지 않게 된 뒤 소화 속도는 소화 실행 횟수 x 한 번 처리량으로만 정해지는데, 100건이면 한 번도 시도 안 된 약 9,100건을 한 번 훑는 데 약 42일이 걸려 선생님이 병합한 시험지 메타가 등록 대기에서 늦게 나온다. 300으로 올리고 한두 번 관찰한 뒤 500을 검토한다.

- **상한은 "시도한 건수"다.** 이미 같은 입력으로 거절돼 `변경 없음으로 건너뛴` 항목은 예산을 쓰지 않는다. 그래서 상한만큼은 항상 아직 판정 안 된 항목에 쓰인다.
- **replay 결속:** 배치 결속(`replayBatch`)의 해시에는 config 전체가 들어가므로(`configSha256`) 값이 바뀌면 그 값으로 만든 배치와 다른 값으로 다시 검증할 수 없다. 그러나 replay는 같은 실행 안의 보고서(`head`가 현재 HEAD와 같아야 함)만 받으므로 config를 바꾸는 커밋 앞뒤의 배치는 서로 replay되지 않고, `--verify`와 `last-verification.json`은 config를 읽지 않는다. 값을 바꾼 첫 실행은 새 값으로 배치를 새로 만들고 그 안에서 replay한다.
- **소화 속도(추정):** 시도 가능한 미시도 약 9,100건 / (300건 x 하루 평균 2.2회 성공) = 약 14일(100건이면 약 41일, 500건이면 약 8일). 정시 실행이 매시 도는데도 하루 2.2회만 성공한다는 실측이 병목이므로, 성공 횟수가 늘면 같은 비율로 짧아진다. 등록되는 건(APPLY)이 늘면 `question_metadata.json`·런타임 팩·영수증 쓰기와 뒤 레인(shared·fourSlot)이 돌아 한 번이 길어진다(아래).
- **실행 시간(추정, CI 실측 기반):** 소화 실행의 거의 전부는 건수와 무관한 고정 비용(build_db 2회 약 5~7분)이고 건당 비용은 auto-register 약 0.12초 + replay 약 0.05초(거절 위주)다. 100건일 때 semantic 레인 약 5.5~7분 → 300건 약 +35초, 500건 약 +70초. 등록이 있는 배치는 뒤 레인까지 돌아 14~17분(기존 실측)이며 300건 모두 등록돼도 semantic 명령 하나가 writer의 명령 제한(25분) 안에 들 것으로 본다.
- **병합 실행에도 같은 상한이 적용된다.** 한 병합이 300문항을 넘게 바꾸면 넘친 문항은 `origin:"merge"` 표식으로 소화 실행이 먼저 시도한다.

## 시범 및 운영 경계

초기 기준 main은 config에 고정하고 이미 병합된 동산중 2022 중3 q01 한 문항만 pilot target으로 지정한다. 같은 시험지 나머지 24문항과 장부 73건 전체를 소급 처리하지 않는다. 새 source 변경은 이후 정상 자동 처리한다. 실제 pilot 성공 증거는 Actions 로그·remote main·자동 영수증·Consumer 확인으로 남긴다.

메타 의미 판단 정본, 기존 canonical 정의, REVIEW2/FINAL_QA 독립 품질 게이트는 유지한다. 기존 수동 inbox와 META_V2 payload 경로도 유지하며 이 경로의 생성물은 해당 자동 writer 책임이다. 이 문서가 자동 등록 동작의 정본이고 다른 문서에는 포인터만 둔다.

## 롤백

`auto/config.json`의 `enabled`를 false로 바꾸면 의미 메타 자동 적용을 멈춘다. 4slot 단계는 `fourSlotEnabled:false`로 별도 중단한다. 이미 등록한 원본 및 기존 검토 증거는 지우지 않는다. 오등록 수리는 해당 UID의 before/after 소형 요청으로 수행하고 공용 JSON 전체를 과거 판본으로 되돌리지 않는다. PR job은 읽기 권한만 갖는다. writer `--check`는 정본을 수정하지 않으며 `prepare`는 격리 runner에서만 stage한다. 전환 롤백은 이번 workflow/code PR 단위로 수행하고, 구·신 writer를 동시에 활성화하거나 원본·과거 영수증을 덮어쓰지 않는다.
