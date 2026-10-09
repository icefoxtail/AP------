# 문제은행 프로젝트 — 문항 저장·분류·조회 운영 정본 v1.0

> 2026-10-09 / 기준: Git main의 코드와 승인 Consumer 인덱스. 기존 Archive2/ALIVE/Meta Foundation 실행 정본을 대체하지 않고, **물리 저장과 논리 검색의 구분**을 고정한다. 최신 main 증분은 재검증한다.

## I. 물리 정본과 조회 경로

| 종류 | 물리 저장·권위 | 검색·런타임 |
| --- | --- | --- |
| 학교 기출 | `archive/exams/original/**/*.js` 의 `window.questionBank`, 연동 원문 그림·SVG | `archive/db.js` 카드; `archive/data/archive2-catalog.json` → `archive/archive2-core.js` 필터 → `archive/archive2-source.js` 원문 로드·fingerprint 검사 |
| 기출 메타 | `archive/data/meta-foundation/canonical/` → `compiled/`, `runtime/`; 표준단원 master `archive/data/master_tables/js_archive_tag_master.json` | canonical projection·L1~L4·유형·조건·난이도 조회 |
| ALIVE 생성 원본 | `archive/generated/lite/v1/2022/H1/{storageBucket}/shards/*.js`, `metadata/`, `manifest*.json` | ALITE-UID와 sourceQid·source SHA·승인 ledger 보존 |
| 승인 생성문항 | `archive/data/generated-lite-consumer/v1/index.json` + `shards/{storageBucket}/*.json` | `archive/generated-bank.html`의 승인 필터 → shard `generatedUid+localOrdinal` 동등 조회 → 문항 선택·출력 |
| 후보·보류 | `archive/data/generated-lite/`, `alive/06_EXECUTION/`의 candidate, review, receipt | 검수/운영 evidence. 승인 없이 학생용 Consumer 자동 노출 금지 |

**원본 보존:** 기출은 학교별 원본 JS로 단일 관리, 생성은 source shard에서 단일 관리한다. 인덱스는 파생된 조회/학생용 projection이다. 원본을 L2 폴더에 복사·이동하거나 UID를 재발급하지 않는다. 원본 기출 UID `qid_v1_...`와 Generated `ALITE-...` namespace를 구별한다.

## II. L2 분류 혼동 방지

| 이름 | 정확한 뜻 |
| --- | --- |
| `standardUnitKey` / `subUnitKey` | 교육과정의 표준단원 / 그 하위 세부단원, master parent·label 따름 |
| Archive2 `L1/L2/L3/L4` | RPM·Meta Foundation 교육 분류: 대단원·중단원·핵심 개념·유형 |
| Generated Consumer `l2` | 기존 파일에서 쓰인 **물리 shard bucket 식별자**. 예: `H22-C-03-FACTORIZATION`, 실제 `question.subUnitKey` 계열. RPM L2와 무조건 동일시하면 안 됨 |
| `rpmPrimary.recordId/l3/l4`, `rpmL3/rpmL4` | Generated의 RPM 분류 provenance. canonical crosswalk 및 Generated EXT namespace와 별개 |
| `problemTypeKey/templateKey` | 문제 유형과 풀이 template; 폴더 분류가 아님 |
| `level` / `difficultyBucket` | 하·중·상 legacy와 1~5 난이도: 서로 독립 필드 |

현행 경로/스키마를 일괄 변경하지 않는다. 차기 unified API에서는 `storageBucketKey`와 `rpmL2` 필드명을 명시하고, 기존 `l2`는 호환 alias로 읽는다. L3/L4 RPM LOCKED를 Generated 편의상 수정하거나 검증 없는 alias를 만들어내지 않는다.

## III. UID 기준 꺼내기

**기출:** catalog의 L1~L4/학교/학년/연도/난도 필터 → `sourceFile+sourceOrdinal` → 원본 JS 로드 → fingerprint·`qid_v1_` 검증 → 문항과 이미지 복원.

**생성:** Consumer index의 `sourceKind=generated`, `consumerSelectable=true`, 명시된 `approval+reviewStatus`, HOLD 목록 제외 → shard JSON 로드 → `generatedUid + localOrdinal` 유일 매칭 → 형식 검사 → 학생용 검색·선택·출력. **localOrdinal은 생성 당시 원래 값이므로 Consumer JSON의 현재 배열 순번과 다를 수 있다.** 누락된 HOLD 때문에 건너뛰는 ordinal은 정상이며 위치 기준 재번호 금지.

**별도 상태:** CREATE 후보 ≠ GPT REVIEW PASS ≠ Consumer DB 등록 ≠ 실제 학생 조회 Chrome PASS ≠ MAIN_DONE. Current main 등록 수를 곧바로 실제 브라우저 검수 완료 수로 표현하지 않는다. 원본/Generated는 현재 서로 다른 검색 경로로 동작하며 Common Assessment Factory의 완전 통합은 후속 구현 과제다.

## IV. 2026-10-09 Consumer 진단 및 정리

- 기준 index: 승인 **323 UID** = 효천고 **92**, 복성고 **191**, 팔마고 **40** (기존 B07 4 + QID9 신규 36). 물리 Consumer **54 shard / 23 bucket**. 별도 `excludedHoldUids` **25**, 승인 UID와 중복 0.
- 등록 index ↔ 54개 shard의 모든 323 UID를 검토: `generatedUid`, `localOrdinal`, `question.subUnitKey`와 bucket 1:1 정합성 결함 0. 기존 인덱스 UID 중복 0.
- **복구 전 실제 UI에서 231/323건 선택 가능:** 효천고 92개는 과거 승인 인덱스에 `consumerSelectable`·`reviewStatus` 두 projection 필드가 없어서 `isSelectable`에서 탈락. 효천고 근거는 기존 독립 검수 94건 = PASS 91 + REPAIRED_PASS 1 + HOLD 2, 승인 92, 학생용 등록 receipt와 이전 B03 Chrome 기존 효천고 조회 PASS. 이번 정리는 **기존 승인 상태를 충실히 index에 반영**하는 일이며 새 수학 PASS 발급이 아님.
- 이번 수정 목표: 92개 행에만 `consumerSelectable:true`, `reviewStatus:"REVIEW_PASS"` 보강하고 UID·문항 본문·정답·해설·원본/소비자 shard·Hold·출처 SHA를 불변으로 둔다. 정적 selectable 목표 **323/323**.
- 팔마고 신규 36 UID와 기존 B07 4의 실제 Chrome 미실시/PENDING evidence는 그대로 역사 보존한다. 이전 283/287 스냅샷과 과거 receipt도 소급 수정하지 않는다.
- 변경 뒤 영향을 받는 UI Chrome smoke와 323 동적 집계가 통과해야 학생 조회 완료를 주장한다. 테스트 실행 전 표기는 `NOT_TESTED`다.

## V. 앞으로 생성문항 증분 등록 HARD

1. 원본별 candidate/shard·meta·manifest 작성 → GPT 품질검수(현행 QID9은 발문 우선 공개답 검수; 기출 R1/R2 별도) → 승인 UID와 HOLD UID 확정.
2. 승인 UID만 Consumer shard/index 수납, `sourceKind/uid/l2/shard/localOrdinal`과 실제 source/consumer SHA를 1:1 검증. Generated EXT-L4는 별도 namespace 유지.
3. `approvedCount===records.length===records.filter(isSelectable).length`, UID 중복 0, HOLD 충돌 0을 반드시 확인. 현행 화면과 동등한 `isSelectable` 술어를 검사할 것.
4. 최소 브라우저 검증: 승인 검색/선택·문항/보기/이미지 실로드, HOLD 차단, 원본 시험지 direct-open 회귀. 실제 Chrome 실행하지 않으면 미확인.
5. 이미 PASS한 문항 재검수·원본 위치 이동·일괄 재직렬화 금지. 바뀐 행과 직접 의존성만 검사. main 충돌 시 최신 파일을 재읽고 CAS로 변경분만 결합한다.
