# 문제은행 프로젝트 — 현재 상태·Meta 영구저장·통합 검색 후속 작업 정본 v1.0

> **상태:** CURRENT WORK ROUTER / DOCUMENTATION-FIRST / IMPLEMENTATION NOT STARTED BY THIS DOCUMENT  
> **기록일:** 2026-10-09  
> **기준 Git main:** `b7b096050d732b14ceb6d48a6afd736eaa697c83` (이 시점의 readback 기준. 실행 시작 시 latest main 재조회)  
> **적용 프로젝트:** JS Archive 학교 기출 + Archive 2.0 검색·출제 + ALIVE Generated Bank = **문제은행 프로젝트**.  
> **역할:** 사용자와 이전 작업에서 합의한 목적·증거·종료 상태·미완료 구현 순서의 단일 인계점. 이 문서는 새 제품 코드나 출시 인증이 아니며 기존 수학 품질, RPM 정본, Archive 2.0 Runtime/권한 계약을 대체하지 않는다.

## 0. 핵심 인계 — 다음 작업자가 절대 혼동하지 말 것

1. **지금의 본류는 새로운 팔마고 QID9 문항 19개(q05~q23) 제작이 아니다.** 본 작업은 이미 생성된 문항의 물리 저장·메타데이터 영구 보존·학생용 공급·기출/Generated 통합 검색 권위를 확립하는 **문제은행 인프라 작업**이다. QID9 생성라인은 별도 캠페인.
2. **기존 팔마고 HOLD 23개 복구는 이미 운영 등록 23/23과 Chrome PASS까지 진행했다.** 과거 `HOLD23_RECOVERY_LEDGER_CURRENT.json`의 4승인/23HOLD, 감사문서의 323기준은 *기록 당시 snapshot*으로 취급한다. 다음 작업자는 해당 23개를 다시 생성하거나 수학 검수부터 재실행하지 않는다.
3. **기존 생성문항 323개는 2026-10-09 Meta retention cutover 이전의 LEGACY_NOT_RECERTIFIED다.** 323개가 승인·선택 가능하다는 사실과 세부 RPM L1~L4/CrossConcept/Condition/Integration/difficulty Meta가 온전히 보존됐다는 주장은 서로 다르다. 누락 Meta를 추정하거나 과거 PASS를 소급 수정하지 않는다.
4. **Meta 누락 검출 CI는 존재한다.** 그러나 이를 `최종 등록 adapter 자동기록 + 통합 검색 + legacy 근거기반 복원 완료`로 오해하면 안 된다. 실제 payload 보존·진짜 사용 가능한 검색·검증 연결을 구현해야 한다.
5. **기출 원본을 L2 폴더로 옮기는 프로젝트가 아니다.** 원본은 출처별로 보관하고, UID와 별도의 통합 검색 projection을 통해 같은 L2/L3/L4·난이도 필터로 조회한다.
6. 이 문서의 단계별 작업은 **앞선 실제 운영 데이터 보호를 기본값**으로 하며, 미검증 사항은 PASS가 아닌 NOT_TESTED/OPEN이다. "문서 완료"와 "제품 구현·배포 완료"를 분리한다.

## 1. 기준 상태와 역대 snapshot 구분

### 1.1 2026-10-09 main 실측(위 commit 기준)

| 범위 | 현재 근거 있는 상태 |
|---|---|
| Generated Consumer `index.json` | **346/346 승인 행**, 효천고 92 + 복성고 191 + 팔마고 63, 물리 Consumer shard **62개** |
| 기존 팔마고 27개 후보 | 구 승인 4 + 구 HOLD **23개 전부 현재 인덱스 수납(23/23)**. 별도 QID9 36개와 섞지 않는다 |
| 팔마고 63개 구성 | 기존 B01~B07 **27** + 별도 QID9 **36** |
| 명시적 남은 Generated HOLD | 효천고 `ALITE-20261008-HYC26-Q10-001`, `ALITE-20261008-HYC26-Q18-003` **2개**. 학생 자동 선택 제외 |
| 실제 Chrome | `Generated Consumer Browser Smoke` run **37885838614 = SUCCESS** / `Archive2 Runtime Guard` run **37885838581 = SUCCESS** |
| Source → Consumer/검색 | 원본·source shard와 학생용 Consumer 분리 운영. 기출/Generated **단일 공통 L2 검색 제품은 미완성** |
| 신규 Meta CI | `archive/tools/generated-meta-retention-gate.cjs`, `tests/generated-meta-retention.test.cjs`, workflow 적용. cutover 이전 323개는 별도 legacy |

최종 Chrome PASS는 그 실행에 포함된 검색·선택·출력 경로에 한정된다. 전체 기출+생성 통합 L2 검색, 모든 로그인 역할과 서버 권한, 기존 323개 상세 Meta 복원, 전체 CI 성공의 증거가 아니다.

### 1.2 과거 수치(삭제·소급수정 금지)

- 2026-10-09 과거 baseline: 287 승인 / 효천고 92 검색 누락 → **323 승인/323 선택 가능**로 복구, 원본·해설 수정 없음. 당시 명시 HOLD 25 = 팔마고 23 + 효천고 2.
- 당시 323개 Meta 실측: `difficultyBucket` **316/323**, Consumer `question` 내부 명시적 L1/L2/L3/L4 및 CrossConcept·Condition·Integration 각 **0/323**; `problemTypeKey` 183/323, `templateKey` 177/323; Consumer record `rpmPrimary` 317/323. 이 수치는 *2026-10-09 컷오버 감사 결과*이지 346개 현재 데이터의 재측정 수치가 아니다.
- 당시 323개 중 난이도 근거 미확정 **7 UID**: `HYC26 Q18 001/002/004`, `HYC26 Q20 001/002/003/004`. 기존 `level`만으로 1~5 bucket을 자동 환산하지 않는다.
- `archive/question-index-report.md`의 현 Git 산출물은 기출/유형 등 보고서 인덱싱 범위 **554파일 / 13,194문항**, 비공식 표준단원키 94건, `level` 누락 474건(중복 qKey 0). 이전 대화의 **553 / 13,174**는 과거 snapshot. 이 수를 Generated Consumer의 346과 더해 전체 유일 UID라고 주장하지 않는다. 산출물 scope·시점을 따로 관리한다.
- 과거 `HOLD23_RECOVERY_LEDGER_CURRENT.json` 상단 `holdCount:23/currentStudentRelease:0`은 *복구 시작 전 ledger*. 실제 main 출시는 그 이후 여러 commit으로 진행되었으며 23/23 UID 인덱스 존재를 재확인했다. ledger의 과거 개별 verdict 자체는 지우지 않는다.

## 2. 물리 저장(정본)과 논리 검색(파생 projection)을 분리

| 데이터 | 물리 authority | 이용 방식 |
|---|---|---|
| 기출 시험지 | `archive/exams/original/**/*.js`와 원본 이미지·SVG | `archive/db.js`, `archive/data/archive2-catalog.json` → `archive/archive2-core.js`의 조건 필터 → `archive/archive2-source.js`가 원본 위치·순번/지문 fingerprint 확인 후 복원 |
| 기출의 분류·Meta | `archive/data/meta-foundation/canonical/`, `compiled/`, `runtime/` 및 공식 표준단원키 master | L1~L4·유형·교육과정·태그·난이도의 검색 근거 |
| ALIVE 생성 원본 | `archive/generated/lite/v1/2022/H1/{storageBucket}/shards/*.js`, `metadata/` | 생성 UID·sourceQid·source 검수·Meta·승인 근거 보존 |
| 생성 학생용 Consumer | `archive/data/generated-lite-consumer/v1/index.json`와 `shards/{storageBucket}/*.json` | `archive/generated-bank.html`에서 승인/비HOLD 필터 → `generatedUid + localOrdinal` 유일 복원 → 검색·선택·인쇄 |
| 미승인/HOLD | 생성후보 MD, review ledger, 원래 manifest, 출처근거 | 검색/출제 eligible로 섞지 않음 |
| Saved Paper/Assignment | Archive 2.0 기존 서버 저장·권한·frozen snapshot | 기존 생명주기/권한을 유지하고 임의로 브라우저 저장소 전체복사로 우회하지 않음 |

**불변 원칙:** 원본 중복 저장 금지, 기존 UID 재발급 금지, 원본 시험지 인쇄/해설/정답은 Archive 1 `engine.html?data=exams/<file>&mode=exam|sol|ans` 직접 경로 보호. Generated Consumer의 복사본은 학생 공급용 파생물이며 수학적 정본을 대신하지 않는다. 기존 B05/B06 팔마고 승인 6개처럼 역사적으로 `ALITE-` 접두사가 아닌 UID도 존재하므로 자동 rename 금지. 현재 런타임은 이 6개 승인 UID만 근거 있는 호환 예외로 처리한다.

### 2.1 'L2' 이름 충돌 금지

- `standardUnitKey` = 교육과정 공식 표준단원, `subUnitKey` = 그 자식 세부단원(master parent·label).
- RPM/Meta Foundation의 `L1~L4` = 대단원/중단원/핵심개념/문제유형의 **논리 분류**. 실제 source evidence와 namespace를 검증한다.
- 기존 Generated Consumer `l2` = 대부분 `subUnitKey`와 같은 **physical storage bucket**. 이것을 RPM L2와 같다고 표기·검색하지 않는다.
- 새 조회/등록 layer는 명시적 `storageBucketKey`(기존 `l2` 호환), `rpmL2`(RPM semantic parent)를 구별하여 projection한다. 불명확한 parent를 자동 추론하지 않는다.
- `rpmL4Namespace`는 `RPM_LOCKED`, `RPM_EXISTING_DRAFT`, `GENERATED_EXT_L4`의 출처·권한을 구분한다. Draft를 LOCKED라고 표시하지 않고, Generated EXT를 RPM 정본에 무단 승격하지 않는다.
- `level` = 하·중·상, `difficultyBucket` = 1~5 숫자. 서로 별도 기준이며 묵시적 전환 금지.
- `problemTypeKey`/`templateKey`는 실제 유형·풀이 패턴 레코드로 연결하고, 부재 시 명시된 `metaDebt` 및 자동 검색/출제 제한 정책을 기록한다.

## 3. 신규 생성문항 Meta 영구보존 계약(목표; 일부 CI만 기구현)

각 UID의 실제 제작·승인 결과가 최소 다음을 관통해야 한다.

`최종 설계/검수 Meta → generated source JS/metadata → Consumer shard의 record/question → Consumer index 검색 projection → 학생 실제 조회/선택/출력`

필수 데이터군:
1. provenance: `uid`, `sourceQid`, source/shard 상대경로·원본/후보 SHA, review approval/evidence ref, status 및 localOrdinal.
2. 교육과정: `standardCourse`, `standardUnitKey`, `subUnitKey`, 공식 parent·label.
3. RPM: `rpmL1`, `rpmL2`, `rpmL3`, `rpmL4`, `rpmL4Namespace` 및 namespace별 정확한 authority/record/registry ref. 실제 사용한 L3·L4 근거.
4. 수학 연결: `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern`; 미적용이면 `[]` 또는 `NONE`을 명시. **누락은 NONE이 아니다.**
5. 교육적 분류: `difficultyBucket` 정수 1..5, `level` 하/중/상, `problemTypeKey`/`templateKey`의 실제 키 또는 근거 있는 mapping debt.
6. 무결성: design/approved Meta와 모든 파생 산출물의 UID·필드·digest 1:1 동등성. 검수 evidence **문자열 존재만으로 검수 수행·수학 PASS를 선언하지 않는다.**

**신규 미완전 UID는 `META_PERSISTENCE_HOLD` / 학생 공급 제외**로 처리하되, 나머지 승인 UID는 계속 출시 가능해야 한다. 기존 생성문항 학생용 payload를 무차별 재직렬화·재작성하지 않는다. 질문 본문·정답·해설·SVG를 Meta 수리로 변경하지 않는다.

**현재 구현 경계:** Meta validator가 신규 UID를 정적 검출하며 RPM DRAFT source SHA와 Generated EXT 증거 등 일부를 검사한다. 하지만 제작/등록 adapter의 **확정 Meta 자동 작성·전달**, 통합 query index의 실제 L1~L4 검색, legacy 323 backfill, reference된 심사 문서의 실제 bytes 수준 승인 evidence 결속은 완료 증거가 없다. 별도 구현과 회귀가 필요하다.

## 4. 기존 323 UID 근거 기반 backfill 계약

- 기준 UID는 `archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json`의 정확한 323 목록. 이후 생성된 23개의 현재 CI 대상과 구분하며 단순 인덱스 순번으로 구분하지 않는다.
- **메타데이터 전용 backfill ledger**를 생성한다. `uid / missingField / currentValue / evidenceFile+SHA / proposedValue / authorityStatus / disposition / changedPaths / parityResult`를 문항 단위로 보존.
- 우선 source shard/metadata, 승인 review ledger, RPM crosswalk·Generated EXT registry를 직접 읽고 **확정 근거가 있는 필드만** 채운다. 이미 검수 완료된 수학 문제를 일괄 재풀이하거나 재생성하지 않는다.
- 불확실한 난이도 7 UID, 근거 없는 CrossConcept·Condition·Integration 및 L4는 `UNRESOLVED_EVIDENCE_REQUIRED`로 분리. 자동 0/None 대입하거나 없는 L4를 만들어 PASS하지 않는다.
- 최종 수리 시 student payload 오염/변경 0을 검사하고 source–Consumer–index parity만 필요한 범위에서 재검사한다. 기존 승인 323개를 Meta 누락만으로 일괄 품질 FAIL 또는 신규 승인으로 재인증하지 않는다.

## 5. 통합 L2 중심 문항 검색/출제 — 목표 제품

**형님 목표:** `교육과정/학년/과목 → 대단원 L1 → 중단원 L2 → 핵심개념 L3 → 문제유형 L4 → 1~5 난이도 → 문항 선택/수량 → 시험지 출력`. 학교·연도·원본/Generated 공급구분·검수승인 상태는 보조 필터로 운영한다.

- 기출과 Generated를 **같은 논리 검색 결과**에 나타내되, 둘의 source authority와 UID 복원 경로는 유지한다.
- 검색 record에는 `sourceKind`, `uid`, L1~L4 (namespace·authority 포함), curriculum, difficulty, selection eligibility, exact source locator/fingerprint/asset ref가 있어야 한다.
- 기출은 기존 `archive2-catalog.json`의 검색·`archive2-source.js`의 source restore 경로 유지. Generated는 승인 Consumer index를 기준으로 exact UID+ordinal+shard 로드. 외부에서 반환되는 필드는 교사/학생 권한·정답 비공개 규칙을 따라 projection한다.
- 분류 미확정, HOLD·미승인, stale source, 깨진 image/SVG, UID 중복/누락은 자동 출제에서 fail-closed. 질의에 UNKNOWN 또는 NO_META 대상이 있으면 0건이라고 속이지 않고 보류·미분류로 명확히 표시한다.
- 기존 Archive 2.0 검색과 인쇄, 원본 23/26문항 직접 선택/출력, Frozen Saved Paper/Assignment 권한/저장소·응답성에 회귀를 만들지 않는다.
- 향후 승인된 A/B/C 후보 선택, 원본 한 자리를 승인된 UID 한 개로 치환, 미사용 후보 우선 순환, 3~5회차 동시 제작은 **후속 제품 설계**다. 현재 구현 완료/승인이라 주장하지 않는다.

## 6. 실행 순서 — 문서 뒤 실제 구현 시 한 단계씩

| 우선 | 작업/소유 범위 | 완료 증거 | 현재 |
|---|---|---|---|
| P0 | **운영 상태 정리:** 팔마고 구 HOLD23 ledger/`07_RELEASE_STATUS.md`와 현재 23/23 출시 결과의 별도 closeout 기록; 기존 historical state 보존 | 이전 23 UID ↔ 현재 index/Consumer 23 매칭, Chrome 성공 링크, 남은 효천고 HOLD 2 표시, 누락 0 | **NOT_DONE** (현재 문서에서는 읽기 전용 대조만) |
| P1 | **신규 생성 Meta 영구 저장:** source CREATE schema + 등록 adapter의 Meta authority/reference·SHA 보존, Consumer record/question/index 동일 투영, 정확한 review bytes binding | 신규 대표 UID로 생성→승인→등록→검색 projection·Meta parity PASS, missing/false-LOCKED/empty-vs-NONE negative fixtures FAIL | **PARTIAL: 정적 CI 검출 구현 / adapter 자동 저장 미완** |
| P2 | **레거시 323 backfill:** 검증된 근거만 빈 필드 보정, 7개 난이도 등 불명확한 것은 격리 | UID별 source authority + patch diff + parity ledger, unresolved 분리 | **NOT_DONE** |
| P3 | **기출+Generated L2 통합 인덱스·조회 API:** semantic L2 vs bucket alias 분리, sourceKind별 UID 복원·검색·권한·HOLD 필터 | 같은 단원에서 기출·Generated 조회, exact source reopen, wrong-parent/unauthorized/hold/missing negative fixtures | **NOT_DONE** |
| P4 | **등록 자동화·인덱싱:** 승인 publication 시 원본·Catalog·Generated Consumer·검색 projection 정합성, 증분 등록, CAS/rollback | 단일 UID new/change/revoke 테스트, source sha drift / 중복·missing asset 차단, main readback, 실 Chrome 검색/선택/인쇄 | **PARTIAL 기존 수동·개별 자동화; 통합 계약 미완** |
| P5 | **상품화:** 단원·유형·난도 카드와 수량 선택, 승인 후보로 다회차 출력, Common Assessment Factory와 연결 | 실제 교사 출제 흐름/원본 direct-open/저장·권한/성능 테스트 | **별도 후속 프로젝트, 지금 구현 시작 금지** |

P1과 P2의 데이터 근거/패치 범위가 충돌할 경우 현재 active production을 임의 덮어쓰지 않고 state refresh→증분 재계산한다. P3/P4는 P1에서 schema·검색 projection 계약이 고정된 뒤 착수한다. 기존 구현이 이미 있는 부분은 다시 만들지 말고 영향 범위만 보완한다.

## 7. 필수 안전·테스트 경계

- **품질 검수 ≠ 구조 검사 ≠ Chrome 사용성 검사 ≠ main 반영**; 증거별 범위·시간·artifact SHA를 구분한다.
- 등록자 자체 수정과 독립 품질 판정은 별도. ALIVE 생성은 공개답 발문 우선 검수를 사용하고 기출 R1/R2의 blind 계약은 변경하지 않는다.
- 새 시스템이 기존 323 LEGACY_NOT_RECERTIFIED를 부당하게 FAIL/상태손실로 만들면 롤아웃 차단. 레거시 exemption은 새 Meta까지 PASS했다는 의미가 아니다.
- `Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`의 원본 직접 열기, 클릭 응답성, 대규모 데이터, 저장소 실패 안전, 서버 권한, 정답 숨김 hard gate 유지.
- 특정 구현 변경 시 필요한 최소 테스트 + `node tools/check-archive2-runtime.cjs` + 변경 화면의 실제 Chrome. 전체 타 캠페인 재검수나 기존 PASS 시험지 1문항부터 재제작하지 않는다.
- Git은 한 작업 1 commit을 원칙으로 대상 파일만 stage. 최신 main 비교 후 PR/운영병합, 원격 SHA readback. 문서 수정만 했으면 `DOCUMENTATION_ONLY`이며 런타임 PASS를 새로 주장하지 않는다.

## 8. 다음 채팅/Codex 재진입 순서

1. Notion `GPT 작업 전 필독 라우터` → `Archive 2.0 / JS Archive 시작 페이지` → `Archive 전체 작업 생명주기`를 읽고, **이 CURRENT 인계문서**와 아래 관련 정본/감사를 참조한다.
2. `origin/main` fetch 후 `AGENTS.md`, nested instructions, current test/API 코드를 확인한다. 최초 확인으로 실제 346보다 증감했으면 **새 분모·UID 목록으로 리베이스**, 과거 보고 숫자를 조건문에 하드코딩하지 않는다.
3. 우선 **P0 운영 closeout** 또는 형님이 명시한 다음 P 단계만 수행한다. 새 팔마고 QID9 제작·무관 시험지 수정은 이번 계약의 목적이 아니다.
4. 한 단계 완료 후 `실제 변경 파일 / 테스트 실행·결과 / main SHA / 첫 미완료 단계`를 별도 handoff에 남긴다. 문서만 보고 모든 P 단계가 끝났다고 선언하지 않는다.

## 9. 관련 정본·증거(추가 확인용)

- 구조 정본: `docs/architecture/Problem_Bank_Storage_And_Retrieval_Current_v1.md`
- Meta 감사·cutover: `docs/architecture/Problem_Bank_Generated_Meta_Retention_Audit_20261009.md`, `archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json`
- 신규 Meta Gate: `archive/tools/generated-meta-retention-gate.cjs`, `tests/generated-meta-retention.test.cjs`
- 팔마고 구 ledger(역사): `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/review/HOLD23_RECOVERY_LEDGER_CURRENT.json`, `07_RELEASE_STATUS.md`
- 최신 학생 공급 index: `archive/data/generated-lite-consumer/v1/index.json`
- 검색·복원 경로: `archive/archive2-core.js`, `archive/archive2-source.js`, `archive/generated-bank.html`
- 시험지 index 보고서: `archive/question-index-report.md`, `archive/question-index-audit.md`
- 실제 Chrome 성공: https://github.com/icefoxtail/AP------/actions/runs/37885838614
- 실제 Runtime Guard 성공: https://github.com/icefoxtail/AP------/actions/runs/37885838581
- Notion 라우터: https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd

## 10. 완료판정

이 문서의 작성·Git 저장 = **문서화 작업 완료**. P0~P5 중 실제 제품 코드·데이터/Meta 백필·통합 검색 API·자동 인덱싱의 구현 완료는 **아직 주장하지 않는다**. 후속 Codex 실행은 이 문서의 한 단계·한 범위씩 분리해 수행한다.
