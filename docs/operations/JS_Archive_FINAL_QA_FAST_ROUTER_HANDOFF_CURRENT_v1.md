# JS Archive FINAL QA — FAST ROUTER & EXACT HANDOFF (CURRENT v1.1)

> 2026-10-21. v1.1 보완: 강남여고 확통 Final QA의 대용량 메타 조회/Consumer 연결/4파일 보정 사례를 반영. 목적: 이미 `main`에 출고된 **지정 시험지 1건**의 사후 Final QA & Repair에서 쓸모없는 검색·중복 검증·공통 파일 충돌을 줄인다. **품질 의무를 줄이는 문서가 아니라 조회·실행 경로를 고정하는 보조 런북**이다.
>
> 최상위 권위: 사용자의 현재 직접 지시 → Notion [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd) / [Archive 2.0 시작](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398) / [전체 작업 생명주기](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e) / [FINAL QA & REPAIR CURRENT v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98) → 최신 Git `main`의 `AGENTS.md`, `archive/AGENTS.md`, 실제 정본·소스. 충돌 시 상위 규칙 우선. CREATE/R1/R2/R3/예약라인에는 적용하지 않는다.

## 0. 시작 계약: 첫 1회만 확정·저장

- 입력: `examUid`, 정확한 요청 범위, Notion 대상 시험지 행, 요청한 출력/병합 범위, `owner`, 신규 `taskId`(정확한 predecessor가 있으면 그 ID). 사용자에게 이미 받은 값은 다시 질문하지 않는다.
- Git `main` HEAD SHA와 대상 시험지 **정확한 path + blob SHA**, 현재 적용 교육과정, 실제 표시 QID `N/N`을 확정한다. 구 보고/이전 PASS/다른 task checkpoint로 현재 값을 대체하지 않는다.
- 같은 `main`·exam blob·정본 blob에 묶인 기존 유효 evidence는 재사용한다. SHA 또는 해당 필드가 달라졌으면 **변경분과 직접 의존만** 다시 확인한다.
- 첫 조회에서 `ROUTE_RECEIPT`를 만든다: source path@blob, meta storage path@blob, registry@blob, relevant pack/binding/crosswalk@blob, consumer/index path@blob 또는 생성 입력 및 실행 근거, Notion row URL. 이 포인터를 다음 작업자에게 그대로 넘긴다.

## 0-A. 실전 STOP-SEARCH: 정확한 세 갈래와 도구 실패 처리 (v1.1 추가)

**핵심:** 존재 여부, 등록 여부, 실제 소비 여부를 절대 혼동하지 않는다. 이전 `ROUTE_RECEIPT`의 exact path/sha가 최신 해당 파일과 같으면 유효한 증거를 다시 찾지 않는다. 단, 다른 main 커밋이 나왔다는 사실만으로 모든 불변 blob 증거를 폐기하지도 않는다.

| 분기 | 정확한 확인/대안 | 멈출 조건·해석 |
|---|---|---|
| A. 시험지 source/UID | 지정 `archive/exams/original/<stage>/<grade>/<term>/<examUid>.js` **실존 path부터** 확인; `questionUid`가 JS에 없으면 정본의 `sourceArchiveFile + sourceOrdinal` 결합으로 연결. 실제 `id`↔sourceOrdinal과 문항수 N 일치 검사 | N/N 고유 UID가 확보되면 학교명 전역 검색 금지 |
| B. 메타 등록/정본 | `archive/data/question_metadata.json`의 기존 approved sidecar → `archive/data/meta-foundation/canonical/registry_index.json` ACTIVE pack → 해당 `runtime/<pack>.json`, `canonical/packs/<pack>/taxonomy.json`·`bindings.json`, `evidence/<pack>/.../item_metadata_assignments_*.json` 및 정본 RPM. 파일명 `*_704.json` 등은 **현재 pack `generatedFrom` 포인터로 확인**하고 고정 | QID별 L1~L4/PT/TPL/CC/Condition/Integration/level/bucket이 실제 정본 및 binding과 일치하면 KEEP; `JS에는 없음` ≠ `정본에 없음` |
| C. Consumer 실제 적용 | 대상 제품 **진입 HTML/로더의 script 로딩 → `question-meta.js` 등 사이드카 fetch → 필요시 `meta-foundation-runtime.js`의 overlay 설치·ready promise → 실제 `mergeArchiveQuestionMetadata` 및 검색/선택 projection**을 각각 코드/실데이터로 확인 | `ACTIVE registry`, `runtime.records N/N`, `taxonomy binding`만으로는 `CONSUMER_PARITY_PASS` 불가. `REGISTERED`와 `EFFECTIVE_CONSUMER`를 분리 기록 |

**대용량 Git read 실패의 단 하나의 우회 순서:** 이미 알고 있는 정확한 Git path에 `fetch_file` 요청 → **내용이 빈 문자열·truncate·size 오류라도 "0개 등록"으로 판단하지 않음** → 응답의 **blob SHA**를 `fetch_blob(repository, blob_sha)`로 읽음 → 그 뒤 `sourceArchiveFile + sourceOrdinal` 또는 UID로 *메모리 안에서만* N개 필터 → 필요하면 검증된 raw download/로컬 범위 조회. 같은 blob에 대한 전역 코드 검색·반복 fetch 시도 금지. blob SHA조차 얻지 못한 진짜 접근 실패만 exact 경로·에러와 함께 기록한다. **Git blob SHA는 Git 개체 해시이며 AWCR raw SHA-256과 혼동하지 않는다.**

**Consumer 함정의 실제 예시:** 2026-10-21 조사 시 `archive/engine.html`은 `question-meta.js`와 그 `__ARCHIVE_METADATA_READY__`를 기다리는 호출을 갖지만, 해당 HTML의 정적 script 목록에는 `meta-foundation-runtime.js`가 직접 없다. 다른 로더를 통한 주입 여부는 별도 확인해야 한다. 그러므로 `Meta Foundation ACTIVE 24/24`는 **등록 증거**, `학생 엔진이 해당 overlay 메타를 실제 소비`한다는 증거는 아니다. 제품마다 진입점이 다르면 해당 제품만 별도로 조사하고 결과가 없는 경우 `CONSUMER_UNVERIFIED`로 기록한다. **학생 브라우저·Chrome/Pages 확인은 GPT 사후 Final QA의 필수 종료 게이트가 아니다**. 가능하면 현재 코드 경로와 실제 검색/index 산출물의 값/UID parity로 검증하고, 그것마저 없는 부분을 거짓 PASS로 적지 않는다. 공통 Consumer 엔진 수리까지 단일 시험지 작업을 무단 확장하지 않는다.

## 0-B. QA 빠른 의사결정 및 검증 근거 재사용 (v1.1 추가)

- **첫 비교는 가벼운 N/N 인벤토리:** 각 QID에 대해 `UID 정확 매칭 / source 해설·원본 근거 / 정밀 메타 실존 / ACTIVE parent / 실제 난이도 분리 / 필요한 자산 참조`만 확인한다. 기존 frozen 정답·승인 증거와 source/blob가 일치하는 정상 문항은 `KEEP`; **새 수학·해설·메타 판단을 해야 하는 QID 또는 바뀐 직접 의존분만** 정밀 재풀이/심사한다. 이를 전수 확인 생략으로 사용하지 않는다.
- **메타 변경 집합은 두 층:** ① `semantic authority` = QID별 실제 source assignment·ACTIVE canonical key/binding, ② `generated/derived` = runtime/compiled/지원 UID 목록·index/검색 projection. **semantic 변경이 생겼을 때만 필요한 후자를 한 번 동기화**한다. 기존 문제 이미지·해설 SVG 정상인 경우 손대지 않는다.
- **작은 수정이 여러 큰 파일에 퍼지는 이유를 기록:** 예를 들어 강남여고 24Q는 이미 ACTIVE 24/24였으며, 핵심 수정은 q10·q17의 PT/TPL·L3/L4, q14·q17·q19·q20·q24의 과거 `currentLevel` 불일치였다. source assignments→runtime overlay→taxonomy `supportingQuestionUids`→bindings `supportingQuestionUids`는 **동일 QID의 직접 파생 의존**일 때만 같이 갱신한다. 파생 파일을 임의 원본으로 취급하지 않는다.
- **쓰기 비용/충돌 제어:** 파일 변경 분모를 고정하고 가능하면 동일 branch의 **단일 원자적 commit**(지원되는 Git tree/commit 활용)로 묶는다. 이 기능을 쓸 수 없는 환경에서 안전한 순차 수정이 필요하면 매 수정 후 blob readback, PR 전체 변경파일 whitelist와 **최신 main 차이** 확인. 진행 중 다른 writer가 동일 파일을 바꾸면 stale 기반 overwrite 금지.
- **상태를 구별:** `ROUTED`(경로 확인), `REGISTERED`(정본 반영), `RUNTIME_MATERIALIZED`(파생 runtime 반영), `CONSUMER_PARITY_VERIFIED`(실제 제품 경로 적용 값 확인), `FINAL_QA_DONE`(별도 문항 품질과 Notion까지 마감)은 서로 다른 상태다. 앞 단계의 증거로 뒤 단계를 자동 PASS시키지 않는다.

## 1. 검색 라우팅 — 정확한 첫 경로, 없을 때만 다음 단계

| 필요한 사실 | 1순위 위치 (현재 main) | 다음 단계 / 중지 조건 |
|---|---|---|
| 현재 exam 실물·문항 | 이미 확인된 `archive/exams/...` **정확한 JS path@blob** | 불명확할 때만 `archive/data/archive2-catalog.json` 및 source-verification index에서 **examUid 정확 일치**로 sourceFile 확인 → 그 파일 조회. 파일명 문자열 전역 검색부터 하지 않는다. |
| 실제 QID 수·내용 | 현재 시험지 JS·실제 출력 필터·문항 순서 | 파일명/레거시 보고 수로 확정 금지. N을 확정하면 동일 판본에서 재조사 금지. |
| UID/기존 메타 | 시험지 `questionUid` 또는 `sourceArchiveFile + sourceOrdinal` → `archive/data/question_metadata.json`, 해당 sidecar/registry | JS에 키가 없다고 미등록 판정 금지. 실제 저장 위치를 확인하고 일치 행/필드만 읽는다. |
| 현행 PT/TPL·L1~L4 | `archive/data/meta-foundation/canonical/registry_index.json` → 해당 **ACTIVE ownerPack의 pack/taxonomy/bindings/aliases** → 과목·교육과정 맞는 `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/`의 정확한 파일 및 RPM Primary 정본 | 연도·과목 경로를 추측하지 않는다. LOCKED RPM을 임의 변경하지 않는다. 2022 대수 예: `high2-math1-algebra.json` + `canonical/packs/algebra-2022/`. |
| 서비스 적용·검색 parity | 해당 시험지 source→UID→canonical/sidecar→`archive/data/meta-foundation/runtime/` 및 실제 사용 중인 Consumer/index/search projection의 **코드와 출력** | `archive/data/meta-foundation/compiled/`은 파생물이며 의미 정본이 아니다. 확인된 consumer 경로는 ROUTE_RECEIPT에 고정; 다른 시험지까지 전수 재생성 금지. |
| 원본 PDF·그림 | JS가 참조한 정확한 PNG/SVG·런타임 resolver: `archive/assets/images/`, `assets/images/` 등 | 원본과 모순/결손 QID에만 [Drive Evidence Vault](https://drive.google.com/drive/folders/1rCUfGWKyTTVktV7HzEyYhF0p4lZmo9E4)에서 같은 examUid·qid의 원본을 조회. 무관한 Drive 전체 탐색 금지. |
| 작업 상태·승계 | 지정된 Notion 시험지 행 + 같은 `taskId`의 원격 checkpoint/실물 receipt | [AWCR bootstrap](https://drive.google.com/file/d/1DDf_QrWCI26EZFdnjQd_E4oQk4nBHdvM/view). 제목이 비슷한 다른 task에 합류 금지. 패킷 존재만으로 검수 PASS 금지. |

**검색 순서**: (a) 이전 handoff가 제공한 exact ref/sha readback → (b) 위 정본의 exact path / 키 일치 조회 → (c) 그 정본의 인덱스/상위 포인터 조회 → (d) 그래도 못 찾을 때만 examUid+누락 필드의 범위 제한 검색. **근거가 발견되면 즉시 검색 종료**. 같은 SHA를 다른 도구로 반복 읽지 않는다. 웹 검색은 사유가 없는 내부 정본 탐색 대체재가 아니다.

**실제 누락 시**: 사용 가능한 부분 조회/정본 연결/Drive 원본의 구체 경로를 따라 직접 복구한다. 단순 검색 실패로 `UNKNOWN` 선언 금지. 합당한 경로를 실제 시도해도 물리적 차단되면 exact `file / qid / field / attempted path / error / firstMissingStep`와 소유자를 남겨 `BLOCKED`; PASS 금지. 검색 횟수 제한은 품질 근거를 누락할 이유가 아니다.

## 2. 품질은 전수, 재계산·재검증은 표적

1. `N/N` 모든 QID의 **수학 핵심·학생용 해설·정밀 메타·필수 시각**을 실물 판단한다. 수학 의심/복수정답/교육과정 충돌 QID만 독립 정밀 재풀이. 유효한 R1~R3 blind/freeze 반복 실행 금지.
2. QID별 `KEEP | CORRECT/REGISTER | NOT_APPLICABLE(근거) | OPEN`를 확정한다. 메타는 L1~L4/RPM, PT/TPL/ACTIVE binding, CrossConcept/Condition/Integration, `level`과 `difficultyBucket`, source→Consumer parity를 실제 확인한다.
3. `OPEN`은 진단 목록이 아니라 **같은 작업자가 직접 해결할 목록**이다. 필요한 source/PDF/registry를 확인하고 해당 QID/필드만 고친다. 종료 시 `OPEN=0`이 아니면 Final QA 미완료. 정상 콘텐츠/정본/이미지/SVG 보존.
4. 결함 확정 → 변경 영향표 작성 → 변경 QID와 직접 의존만 재검. `node --check`, 필수 자산 참조, 해당 TeX/SVG/표, 메타 binding·Consumer parity 등 **관련된 검사만** 실행한다.
5. GPT 사후 Final QA에는 별도 Chrome/DOM/Pages 사이트 검사를 새 종료 게이트로 추가하지 않는다. 기존 CREATE/R1/R2/R3의 별도 검증 계약은 그대로 둔다.

| 변경 종류 | 표적 재검 분모 | 자동 확대 금지 |
|---|---|---|
| 발문·정답·선지·해설 | 변경 QID의 계산·정답·해설·교육과정·연결 그림 | 다른 정상 QID 전체 블라인드 재풀이 |
| 단원·난이도·PT/TPL·UID | 변경 QID의 canonical parent, ACTIVE binding, metadata 저장 및 관련 Consumer/search parity | 이미 ACTIVE인 과목 전체 taxonomy 재구축 |
| PNG/SVG·TeX·표 | 참조한 자산/수식/렌더 정적 구조 및 직접 영향 QID | 전체 학생 브라우저·Pages 회귀검사 |
| 공통 canonical의 실제 직접 결손 | 지정 QID에 필요한 키/바인딩과 이에 따른 직접 projection | 다른 66경로 등 과목 전체 추가 구축(별도 사용자 승인 없는 경우) |

## 3. 비용 폭증 방지·Git 충돌 처리

- **일회성 시험지 전용 검사기·GitHub Actions 워크플로·wrapper 생성 금지 기본값**. 기존 검사/대상 파일 직접 검증으로 충분하면 재사용한다. 필요한 검사 기능이 정말 없으면 필요성·영향 범위를 먼저 증명하고 승인된 개발 작업으로 분리한다.
- 의미 정본과 `compiled/`·catalog·report·runtime receipt 같은 **파생 생성 파일을 구분**한다. source/canonical 수정을 먼저 확정하고 파생물을 **마지막 1회** 필요 범위에서만 갱신한다. 변경된 공용 생성 파일은 다른 writer의 새 `main` 변경을 덮어쓰지 않는다.
- 생성 파일 충돌: `main` 최신 HEAD 확인 → 실제 의미 source diff 보존 → **현재 main 기준 대상 직접 projection만** 다시 만들고 정합성 확인. stale 생성물 2개를 수동으로 합치거나 무작정 모든 registry 재생성하지 않는다.
- 파일 whitelist와 영향 이유 없이 범위를 추가하지 않는다. 다른 시험지, 공통 엔진, 예약설정, 무관 CI/Pages 실패 수리 금지. 사용자 승인에 따라 별도 범위가 확대되면 `scopeRevision` 및 새 영향표를 남긴다(기존 작업의 이유 없이 폭발한 파일을 합리화하지 않는다).
- 사용자 지정 `main` 운영병합은 [MAIN_FIRST / CI_DEFERRED](https://github.com/icefoxtail/AP------/blob/main/docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md)를 따르되, `GIT_MAIN_MERGED`를 품질·배포 PASS로 둔갑시키지 않는다. 시험지 단위의 미해결 필수 QA가 있으면 `FINAL_QA_DONE`은 금지.
- 원격 병합 후 대상 blob/main SHA와 Notion 같은 시험지 행 readback. 무수정일 때도 검증된 `NO_CHANGE`만 허용. 검증기 PASS 단독으로 품질 승인 금지.

## 4. 정확한 인계 — 다음 작업자는 재검색이 아니라 `firstMissingStep`에서 시작

**인계 형식**: 아래는 작업별 `HANDOFF.json`의 개념 스키마. 실제 숫자/파일/SHA는 실행자가 검증한 실값만 기입. `taskId`는 AWCR에서 확인된 정확한 동일 작업만 승계; 새 작업은 신규 ID. AWCR Drive *공유* checkpoint에는 bootstrap의 safe metadata whitelist만 동기화하고 raw 문제·풀이·원문·비공개 자산·credentials는 절대 넣지 않는다. 상세 qid 판정은 해당 작업의 승인된 안전 보관 위치/Notion 행에 따로 둔다.

```json
{
  "schemaVersion": "FINALQA_FAST_HANDOFF_v1",
  "taskId": "<exact-task-id>",
  "owner": "<current-owner>",
  "examUid": "<exact-examUid>",
  "scopeRevision": 1,
  "state": "IN_PROGRESS",
  "input": {
    "mainSha": "<verified-main-sha>",
    "examPath": "<exact-production-path>",
    "examBlobSha": "<verified-blob-sha>",
    "notionRowUrl": "<actual-row>"
  },
  "routeReceipt": [
    {"role": "META", "path": "<exact-file-or-url>", "sha": "<verified-sha>"},
    {"role": "CANONICAL", "path": "<exact-file-or-url>", "sha": "<verified-sha>"},
    {"role": "CONSUMER", "path": "<exact-file-or-url>", "sha": "<verified-sha>"}
  ],
  "coverage": {"displayed": 0, "reviewed": 0, "metaVerified": 0, "keep": [], "fixed": [], "notApplicable": [], "open": []},
  "changes": [{"qid": "q01", "field": "<field>", "sourceRef": "<path@sha>", "status": "VERIFIED"}],
  "tests": [{"target": "<exact-affected-scope>", "command": "<actual-command>", "status": "PASS|FAIL|NOT_RUN", "inputSha": "<sha>"}],
  "git": {"pr": null, "mergedMainSha": null, "examReadbackBlobSha": null},
  "notion": {"updated": false, "readback": false},
  "firstMissingStep": "<one concrete next action, exact qid/file/command>",
  "handoff": {"from": "<owner>", "to": "<intended owner>", "status": "OFFERED"},
  "nextAction": "<single directly executable action>"
}
```

### v1.1 HANDOFF 필수 수납 가드 (기존 JSON v1 하위 호환)

- 아래 JSON의 `routeReceipt` 각 항목에 **`role`(SOURCE/META_CANONICAL/RUNTIME/CONSUMER_EFFECTIVE), `path`, `sha`, `status`(FOUND/READ/VERIFIED/MISSING/BLOCKED), `proofRef`**를 기록한다. `CONSUMER_EFFECTIVE`는 로더/검색 index·실제 join 근거가 없으면 `UNVERIFIED`로 둔다. 경로만 안다고 PASS가 아니다.
- `input.mainSha`는 작업이 시작된 snapshot이고, 인수 시 현재 main HEAD를 **1회** 재확인한다. 변경된 HEAD가 **해당 시험지·메타 의존파일**을 바꾸지 않았다면 기존 동일 blob 증거를 KEEP하고 무관한 시험지 재검수 금지. 해당 path/blob가 달라졌을 때만 diff 범위 재판정.
- `coverage`에는 QID별 실판정이 저장된 **권한 있는 증거 위치와 해당 source/blob SHA**를 명시하며, `reviewed=24`라는 숫자만으로 승인하지 않는다. `firstMissingStep`은 `qid + field + exact path/sha + 구체적 단일 검증/수정` 하나로 쓰고, 재개 후 처리한 뒤 다음 step으로 교체한다.
- 이전 checkpoint는 **동일 taskId + revision + predecessor raw SHA-256 + owner + scopeRevision**가 정확하게 맞을 때만 수납한다. `HANDOFF.json`은 내부 작업 영수증이며 AWCR shared whitelist를 우회하여 원문·문항·해설·secret을 Drive 공유 packet에 실어 나르지 않는다. 사후 Final QA를 새로운 task로 착각해 과거 작업에 이름만으로 합류하지 않는다.
- **타임아웃 회복:** 결속된 `ROUTE_RECEIPT`, 완료된 QID/필드, 마지막 성공 원격 artifact SHA, 실패 call과 첫 재개 행동부터 기록하고 멈춘다. 재접속한 담당자는 전체 라우터 재검색이 아니라 `firstMissingStep`에서 시작한다. checkpoint 저장 실패는 `SYNC_PENDING`; 완료 아님.

**수납 검증**: 다음 작업자는 (1) exact `taskId + predecessor revision/SHA + owner` 확인, (2) Git main/대상 blob 최신성 대조, (3) 유효한 `routeReceipt` 재사용, (4) `firstMissingStep` 실행. SHA가 바뀐 경로만 차이 재확인. `OFFERED ≠ ACCEPTED ≠ DONE`. 다른 writer와 충돌 시 덮어쓰지 않는다. 전 문항 근거를 넘길 때 정답/해설을 R1 blind 작업자에게 전파하지 않는다.

**시간제한·도구 실패**: 현재 회차가 끊기면 이미 확보한 유효 정보와 미해결 목록, 실패한 exact call/도구 응답, 재시도 가능 위치를 먼저 불변 checkpoint로 기록. 타임아웃은 결과 없음이지 실패/품질 PASS가 아니다. 근거 없는 새 검색이나 시작 단계 재실행 금지. 실제 저장/readback 미완이면 `SYNC_PENDING`으로 명시한다.

## 5. 최종 수납 기준 (CURRENT v2.1을 축소하지 않음)

- 실제 학생 표시 `N/N` 모두 수학·해설·메타·시각 판정, 해당 UID `N/N`의 현재 적용 meta 정확성/등록 및 Consumer parity 확인.
- 수정 대상 전부 직접 해결, 수정 QID+직접 영향 재검 PASS, 필수 정적 수식/그림/파일 참조 근거 확보, `open = 0`.
- 해당 시험지 `main`·blob/또는 정확한 `NO_CHANGE` 원격 readback + Notion 같은 시험지 행 업데이트 및 readback.
- `CI/Pages/Student Chrome`은 실행 여부를 사실대로 별도 표기. 사후 Final QA에서 새 Chrome 검증은 필수 아님.
- 위 조건의 미충족은 `IN_PROGRESS` 또는 실제 차단 `BLOCKED`, 결코 `FINAL_QA_DONE` 아님. 인계는 동일 작업의 수행 연속성만 의미하며 완료·다음 시험지 진행 승인이 아니다.

## 6. 신규 작업자 시작 프롬프트

> 지정 `examUid` 하나의 **사후 Final QA & Repair**를 수행한다. 먼저 현재 사용자 지시, Notion 라우터/시작/생명주기/FINAL QA CURRENT v2.1 및 이 FAST ROUTER를 읽는다. handoff의 exact taskId·main/exam blob·routeReceipt를 최신 원격과 대조하고, 기존 유효 증거는 재사용한다. 학생 표시 N/N 전 문항의 수학·해설·정밀 메타·시각을 확인하고 문제 QID만 직접 최소수정한다. 메타 canonical/UID/Consumer parity는 반드시 마감한다. 본 문서의 정확한 파일 경로부터 조회하고 성공한 검색 반복·R1~R3 재실행·공통 정본 무단 확대·새 검사기 제작·Chrome/Pages 추가 검증은 하지 않는다. 수정분과 직접 영향만 검증하고 Git main/blob 및 해당 Notion 행을 원격 마감한다. 끊기면 동일 task의 handoff `firstMissingStep`으로 재개한다. 미해결 0건이 아니면 DONE이라고 하지 않는다.

## 7. 재발 관찰 지표

작업별 `externalReads`, `duplicateReadsSameSha`, `unscopedSearchCount`, `newWorkflowCount`, `changedFiles`, `generatedChurnLines`, `validationReruns`, `mergeConflicts`, `resumeFromExactStep`, `N/N coverage`를 기록하되 **측정 자체 때문에 새 검사·새 파이프라인을 만들지 않는다**. 목표는 동일 SHA 중복조회 0, 사유 없는 전역검색 0, 일회성 검사기 0, 무관한 QID 재검 0; 실제 근거 부족은 절대 무시하지 않는다.

### 근거 사례

[2026 금당고 고2 대수 PR #656](https://github.com/icefoxtail/AP------/pull/656): 21문항의 정밀 메타 누락을 보완하면서 66경로 전체 taxonomy/binding 등록, 공통 compiled 파일 대규모 변경, 30파일·21커밋, 개별 CI/Chrome 워크플로 추가가 합쳐졌다. **당시 66경로 확대는 사용자 별도 승인 아래 수행한 정당한 추가 범위**였지만, 다음 단일 시험지의 기본 Final QA로 이를 자동 반복해서는 안 된다.

### v1.1 변경 요약 · 강남여고 확통의 실제 장애에서 추출

- 대형 파일 `fetch_file` 빈 본문/도구 제한 → exact blob SHA 기반 `fetch_blob` fallback; 빈 본문을 메타 0건으로 오판 금지.
- 기존 ACTIVE 등록 ↔ 실제 소비자 엔트리포인트 적용 증거 별도 확인; 본문 script/fetch와 resolved metadata 값을 함께 대조.
- 수십만~백만 바이트 JSON 4개가 변하는 최소 수정은 QID semantic authority→직접 supporting map/runtime 파생만 갱신, 검사도 해당 UID 중심으로 고정.
- `main SHA`만 전진한 경우 동일 blob 증거 재사용, `exam/meta blob`이 바뀐 경우만 해당 부분 재검. 운영병합 성공만으로 QA DONE이 되지는 않는다.
- 본 문서는 **문서/운영 런북**이고 실제 자동 패킷 검증기·Consumer 배포/수정·예약 프롬프트 변경을 수행했다고 주장하지 않는다.
