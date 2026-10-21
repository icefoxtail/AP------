# JS Archive FINAL QA — FAST ROUTER & EXACT HANDOFF (CURRENT v1.0)

> 2026-10-21. 목적: 이미 `main`에 출고된 **지정 시험지 1건**의 사후 Final QA & Repair에서 쓸모없는 검색·중복 검증·공통 파일 충돌을 줄인다. **품질 의무를 줄이는 문서가 아니라 조회·실행 경로를 고정하는 보조 런북**이다.
>
> 최상위 권위: 사용자의 현재 직접 지시 → Notion [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd) / [Archive 2.0 시작](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398) / [전체 작업 생명주기](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e) / [FINAL QA & REPAIR CURRENT v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98) → 최신 Git `main`의 `AGENTS.md`, `archive/AGENTS.md`, 실제 정본·소스. 충돌 시 상위 규칙 우선. CREATE/R1/R2/R3/예약라인에는 적용하지 않는다.

## 0. 시작 계약: 첫 1회만 확정·저장

- 입력: `examUid`, 정확한 요청 범위, Notion 대상 시험지 행, 요청한 출력/병합 범위, `owner`, 신규 `taskId`(정확한 predecessor가 있으면 그 ID). 사용자에게 이미 받은 값은 다시 질문하지 않는다.
- Git `main` HEAD SHA와 대상 시험지 **정확한 path + blob SHA**, 현재 적용 교육과정, 실제 표시 QID `N/N`을 확정한다. 구 보고/이전 PASS/다른 task checkpoint로 현재 값을 대체하지 않는다.
- 같은 `main`·exam blob·정본 blob에 묶인 기존 유효 evidence는 재사용한다. SHA 또는 해당 필드가 달라졌으면 **변경분과 직접 의존만** 다시 확인한다.
- 첫 조회에서 `ROUTE_RECEIPT`를 만든다: source path@blob, meta storage path@blob, registry@blob, relevant pack/binding/crosswalk@blob, consumer/index path@blob 또는 생성 입력 및 실행 근거, Notion row URL. 이 포인터를 다음 작업자에게 그대로 넘긴다.

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
