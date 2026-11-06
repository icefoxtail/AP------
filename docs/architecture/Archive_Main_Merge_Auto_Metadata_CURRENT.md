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
- 원본/비대상 메타 보존, UID별 sidecar/runtime/Consumer 값 대조, 두 번째 실행의 중복 없음이 통과한 뒤 생성물·대기열·cursor를 **한 커밋**으로 저장한다. 실패한 단계의 미검증 생성물과 cursor를 먼저 게시하지 않는다. 고급 메타·4slot 미완료는 상태를 명시하고 기존 독립 처리 정책을 유지하며, 공유 핵심 등록 실패는 publication readiness를 차단한다.
- 기존 reviewed/AutoMeta concurrency group에서 직렬 실행한다. 병행 PR이 main을 전진시키면 기존 helper로 최신 main에서 재생성·재검증 후 최대 3회 비강제 push한다. 매 candidate의 정확한 parent..head에 기존 Git footprint 검사를 실행한다. 실행 증거와 단계별 실패를 남기며 시간별 catch-up이 마지막 영속 cursor부터 재시도한다.
- 봇 push에 downstream push 이벤트를 기대하지 않는다. 실제 검증한 `registered_sha`를 `registered_main_sha` 입력으로 Pages에 한 번 전달한다. helper의 나중 `main_sha`와 혼동하지 않는다. 배포 성공은 별도 결과이며 등록 성공으로 추정하지 않는다.

## PR 기술검사와 게시 경계

- PR의 `Archive Registration Sync`는 읽기 권한으로 격리된 임시 projection을 검사하고 summary/artifact를 남긴다. PR branch commit/push와 main repair PR 생성은 하지 않는다. 고정 event base와 실제 checkout을 검사하며 이후 무관한 main 이동은 그 결과를 무효화하지 않는다. 실제 merge 충돌과 보호 규칙은 병합 시 별도로 확인한다.
- `.archive-meta-register/auto/writer-state.json`은 기존 단계의 입력·직접 의존성·검사기·출력 digest와 미완료 상태를 저장하는 작은 실행 cursor다. 새로운 승인 기록이 아니다. 입력이 달라지면 실제 native 검사/생성을 다시 수행하고 이전 PASS에 새 digest만 붙이지 않는다. 동일 유효 입력은 commit 없이 NO_OP다.
- Pages는 정확한 등록 SHA를 checkout하고 `--check`로 해당 snapshot의 등록 상태를 읽는다. 공유 등록 데이터를 생성하거나 Git에 commit/push하지 않는다. `build-archive2-catalog --package-only`는 등록된 manifest/index와 일치하는 미추적 패키지 shard만 만든다.
- 실제 학생 패키지 bytes와 외부 R2 이미지·Worker 입력이 게시 receipt와 같으면 NO_OP다. 검사기·비게시 입력이 달라졌으면 이전 검증 PASS를 재사용하거나 새 receipt를 발행하지 않는다. 새 등록 SHA가 이미 게시된 SHA의 과거이면 SUPERSEDED로 끝내며 새 검증 PASS로 표현하지 않는다. 유효한 게시 SHA와 판본 관계가 불명확하면 게시하지 않는다. 게시 receipt가 없거나 조회되지 않으면 checkout 때 고정한 원격 main과 정확히 같은 snapshot만 전체 기술검사 뒤 게시할 수 있다.
- 기존 package manifest/용량 상한, 필요한 Chrome 출력, Worker 준비, R2 이미지의 정확한 bytes(첫 전환에는 legacy 존재 확인을 재사용하지 않음), 실제 step outcome을 읽는 release gate를 유지한다. gate 뒤 `_archive-release.json`을 패키지에 기록해 등록 SHA와 실제 게시본을 연결한다. 실패 시 이전 정상 사이트를 유지한다.
- 시간별 등록 복구와 3시간 주기 Pages 복구는 유지한다. 고정 snapshot이 아직 등록되지 않은 scheduled release는 DEFERRED이며, 정확한 등록 SHA dispatch가 불일치하면 실패다.
- Git 공백 검사는 유지한다. 기존 QID9 SVG는 공식 import manifest의 source와 현재 normalizer로 구한 전체 bytes가 staged 출력과 같고, 지적된 줄도 source에서 그대로 상속됐을 때만 `INHERITED_SOURCE_WHITESPACE`로 구분한다. 원시 Git exit·파일·줄 수를 summary/증거에 남기며 raw `git diff --check` 성공으로 기록하지 않는다. 새 공백·다른 경로·충돌 표식·기존의 더 엄격한 Git 공백 규칙은 계속 차단한다.
- 구 Reviewed workflow의 수동 실행은 단일 writer로 전달한다. 봉인 legacy Apply의 non-main 복구는 유지하지만 main 직접 쓰기는 차단한다. main 입력은 기존 PR/inbox 경로로 전달한다.

## 시범 및 운영 경계

초기 기준 main은 config에 고정하고 이미 병합된 동산중 2022 중3 q01 한 문항만 pilot target으로 지정한다. 같은 시험지 나머지 24문항과 장부 73건 전체를 소급 처리하지 않는다. 새 source 변경은 이후 정상 자동 처리한다. 실제 pilot 성공 증거는 Actions 로그·remote main·자동 영수증·Consumer 확인으로 남긴다.

메타 의미 판단 정본, 기존 canonical 정의, REVIEW2/FINAL_QA 독립 품질 게이트는 유지한다. 기존 수동 inbox와 META_V2 payload 경로도 유지하며 이 경로의 생성물은 해당 자동 writer 책임이다. 이 문서가 자동 등록 동작의 정본이고 다른 문서에는 포인터만 둔다.

## 롤백

`auto/config.json`의 `enabled`를 false로 바꾸면 의미 메타 자동 적용을 멈춘다. 4slot 단계는 `fourSlotEnabled:false`로 별도 중단한다. 이미 등록한 원본 및 기존 검토 증거는 지우지 않는다. 오등록 수리는 해당 UID의 before/after 소형 요청으로 수행하고 공용 JSON 전체를 과거 판본으로 되돌리지 않는다. PR job은 읽기 권한만 갖는다. writer `--check`는 정본을 수정하지 않으며 `prepare`는 격리 runner에서만 stage한다. 전환 롤백은 이번 workflow/code PR 단위로 수행하고, 구·신 writer를 동시에 활성화하거나 원본·과거 영수증을 덮어쓰지 않는다.
