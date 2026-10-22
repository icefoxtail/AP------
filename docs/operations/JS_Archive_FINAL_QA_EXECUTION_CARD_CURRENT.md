# JS Archive FINAL QA — SINGLE ENTRY EXECUTION CARD (CURRENT v1.6)

## CURRENT HARD — BOUNDED ROUTE / TIMEOUT-STOP / EFFECTIVE CONSUMER (2026-10-22)

**이번 개정은 검수 품질을 축소하지 않고 조회·검색·반복만 제한한다. 위의 VERIFIED-SKIP / DELTA-ONLY가 계속 우선한다.**

1. **기존 시험지 이어받기:** 사용자 지정 `examUid`, Notion 체크리스트의 마지막 `firstMissingStep`, Git 정확한 JS path/blob, 이전 결함 대상만 고정한다. 이미 main 병합·검증된 source나 QID를 다시 재검하지 않는다. 같은 blob/증거는 재사용한다.
2. **입력 탐색 예산:** 사후 FINAL QA 선열람은 Notion 라우터 상단 + 이 카드 2곳뿐. 단계 시작 전 전역 파일명 검색·무관한 장문·과거 이력 반복 조회 금지. 정본 정확한 path가 없을 때만 **한 차례** 제한 검색하고 찾으면 즉시 중단한다.
3. **대형 JSON 금지:** `question_metadata.json`(대형 공용 sidecar), `archive2-catalog.json`(대형 packed 원시 카탈로그), `question_identity_map.json` 전체 fetch/수동 갱신 금지. 해당 시험지 작은 등록 요청·승인 영수증·정확한 source-verification shard·runtime pack의 해당 UID만 조회한다. 클라이언트 호출에서 과대 응답/빈 본문을 만나면 동일 파일 무한 재조회하지 않는다. 실제 수리가 필요하면 소형 JSON→인가된 단일 writer로 처리한다.
4. **중요: 검색 판정은 실제 소비 경로 기준:** packed raw `archive2-catalog.json`의 `L3/L4`가 빈 것은 검색 최종 값의 증거가 아니다. `archive/problem-bank-search.html` → `Archive2Canonical.resolveCatalog()` → `ProblemBankMeta.buildIndex()`의 **등록 receipt + byte-bound runtime overlay 적용 결과**를 확인한다. 승인되지 않은 값을 단순 복사해 채우지 않는다. `source verification shard`와 runtime의 값 일치만으로 검색 실행 PASS를 주장하지 않는다.
5. **조회 횟수 상한은 탐색에만 적용:** 결함 위치를 찾기 전 원격 조회는 main+JS+소형 증거+직접 소비 코드 순서로 **최대 8개**를 기본 상한으로 한다. 추가 호출은 정확한 `path / UID / why-needed`가 있는 직접 의존성만 허용한다. 같은 SHA 같은 문서·파일의 재조회 금지(원격 최종 readback은 예외). 탐색/진단에서 첫 정확한 결함을 찾으면 더 찾지 말고 바로 수리한다.
6. **타임아웃 직전의 종료는 중단이 아니라 정확한 인계:** 대형 응답 또는 도구 실패 시 새 문서·새 검색으로 회피하지 않는다. `OPEN / TOOLING_GAP / INFRA_RETRY`로 해당 필드·증거·마지막 성공 SHA와 **구체적인 단 하나의 firstMissingStep**을 Notion/HANDOFF에 남긴다. `FINAL_QA_DONE`이나 신규 PASS 금지. 다음 수행 회차는 그 한 단계에서 재개한다.
7. **우선순위:** `source/UID exact → OPEN 필드 실물/승인 receipt → effective Consumer/Search → 변경 영향 재검 → main/Notion readback`. PT/TPL, 원본 PDF, Chrome/Pages, 타 시험지, 전수 재풀이, 새 공통 CI 수리는 기존 사용자 제외 범위를 유지한다.


**최상위 CURRENT USER OVERRIDE — VERIFIED-SKIP / DELTA-ONLY (2026-10-21, Notion 라우터와 동기화):** 이미 검증된 QID/UID의 수학·해설·메타·자산·Consumer/검색은 **검증 당시 source blob 또는 문항 fingerprint, 적용 메타·asset·Consumer/projection 판본 및 직접 의존 범위가 현재와 일치하고 실제 검증 근거가 있으면** `REUSE_VERIFIED`로 통째로 SKIP한다. **main 전체 SHA가 바뀌었다는 이유만으로 재검하지 않는다.** 과거 PASS 문구만 있고 scope·판본·물리 증거가 결속되지 않았으면 재사용하지 않고 **해당 미검증 지점만** 조사한다.

- **신규 검수 분모:** `OPEN`, `CHANGED`, `DIRECT_DEPENDENCY`, 판본 충돌/검증 증거 누락이 있는 QID·UID·필드만. 전체 표시 문항수 N은 식별하되 무변경/기검증 문항의 수학·해설·메타·SVG·검색·Consumer N/N 재실행은 금지한다. 새로운 검수 결과와 `REUSE_VERIFIED`를 구분하고 미실행 범위를 신규 PASS로 주장하지 않는다.
- **등록/소비 검증 분모:** 변경·신규 등록 UID와 직접 영향받는 실제 Consumer/Search 경로만. 동일 판본의 과거 검증 결과는 재사용하며 등록 실패·미반영·projection 불일치는 대상 UID에 대해 끝까지 `OPEN`이다.
- **무변경 마감:** 대상 시험지와 모든 필수 직접 의존성에 유효한 기존 증거가 충분하고 열린 결함이 없으면 신규 검수 0/수정 0으로 `VERIFIED_UNCHANGED` 가능. 증거가 없는데 `VERIFIED_UNCHANGED`라고 하지 않는다.
- **우선순위/적용 범위:** 이 조항이 아래의 옛 `전수 N/N 재검`·`항상 전체 Consumer parity` 문구보다 우선한다. `NO_SOURCE_PDF_COMPARE`, PT/TPL 제외, 시험지별 소형 JSON·인가된 등록기, 미해결 0, Git main·Notion 원격 확인은 유지한다. CREATE/R1/R2/R3 최초 검수 계약은 변경하지 않는다.

**CURRENT USER OVERRIDE — PINPOINT_ONLY / NO_SOURCE_PDF_COMPARE (2026-10-21):** 사후 FINAL QA의 기본 검수는 **원본 PDF 대조 없이 결함 의심 문항·실제 메타 이상만 핀포인트 확인·최소수리·변경 영향 재검**한다. 정상 문항의 전수 재풀이/해설 재검은 반복하지 않는다. 원본 대조는 사용자 별도 지시가 있을 때만 수행한다. 기존 검수 증거를 재사용하되 이번에 직접 확인한 범위만 새 PASS로 주장한다. PT/TPL은 아래 기존 명시 제외를 그대로 따른다. 이 조항이 아래의 종전 전수 검수·원본 조회 문구보다 우선한다.

**최우선 사용자 OVERRIDE — PT/TPL 제외 (2026-10-21):** 사후 FINAL QA에서는 `problemTypeKey`·`templateKey`, PT/TPL ACTIVE pack/binding/registry/crosswalk 탐색·매핑·신규 등록·오류 보정 및 **PT/TPL Consumer/Search parity를 수행하지 않는다. PT/TPL 미검증·미등록은 완료 차단 사유가 아니다.** 기존 PT/TPL 데이터는 삭제·덮어쓰기 없이 보존한다. 결과는 `PT_TPL_NOT_IN_SCOPE (USER_EXCLUDED)`로 표시하고 PASS/NOT_APPLICABLE로 위장하지 않는다. 기존 CREATE/R1/R2/R3 및 예약 라인에는 적용하지 않는다. **수학/정답/해설·시각 및 L1~L4/RPM·CrossConcept·Condition·Integration·두 난이도·UID/기타 실제 메타 등록/검색 정합성 N/N은 유지한다.** 이 조항이 아래의 모든 PT/TPL 필수 표현과 과거 라우터·상세 문서보다 우선한다.

**CURRENT 메타 쓰기 경계(2026-10-21 사용자 지시):** 공용 `archive/data/question_metadata.json`은 정확한 UID N행의 **조회·대조·검색용**이며, FINAL QA 수정 결과는 **시험지별 소형 메타 JSON**으로만 작성한다. 공용 대형 파일 직접 수정·업로드/PUT 금지. 인가된 Actions가 공용 메타·Consumer/index를 갱신하고 대상 UID N/N 원격 parity를 확인해야 완료다. 인가된 등록기의 과목·요청 스키마별 지원은 현행 코드와 해당 Action의 실제 성공/실패로 확인한다. 미지원은 `TOOLING_GAP`, 실행 실패는 `REGISTRATION_FAILED`/미완료로 기록하고 대형 파일 직접 업로드로 우회하지 않는다. [단일 정책](docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md); 상세 문서 추가 선열람 요구는 아니다.


> 2026-10-21 사용자 직접 지시에 따른 사후 QA 필독 축소. **이미 main에 존재하는 지정 시험지 1건**에만 적용. 기술·품질 의무는 기존 FINAL QA v2.1 그대로이며, **문서 선열람만 축소**한다. 본 카드가 선행 절차이며 기존 긴 [FAST ROUTER v1.1](JS_Archive_FINAL_QA_FAST_ROUTER_HANDOFF_CURRENT_v1.md), [Notion FINAL QA v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98), Archive 시작/생명주기, AGENTS.md는 **정본 예외가 생겼을 때만 해당 절을 열람하는 상세 참고자료**다. 기존 규정/프로젝트를 삭제하거나 수정하지 않는다. 최신 사용자 지시 우선.

## 1. 딱 두 곳만 선열람

1. Notion [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)의 맨 위 **VERIFIED-SKIP / DELTA-ONLY 최상위 절 및 사후 FINAL QA 단일 진입 절**.
2. **이 카드**(전체 약 1쪽 실행 계약). 그 외 포괄 문서는 시험지 시작 전에 순서대로 열람하지 않는다.

작업에 필요한 **실물 코드·정본 데이터의 정확한 조회는 생략하지 않는다**. 단순 단계 통과 문구나 예전 PASS를 현행 SHA 증거로 대체할 수 없다. 새 작업은 새 taskId/owner로 시작, 실제 동일 taskId와 predecessor 증거가 있을 때만 연속 인수한다. [AWCR bootstrap](https://drive.google.com/file/d/1DDf_QrWCI26EZFdnjQd_E4oQk4nBHdvM/view) 확인 후 안전한 최소 메타 checkpoint만 append-only로 남기고 저장/readback 실패 시 SYNC_PENDING으로 구분한다.

## 2. 검색 없는 exact 경로 — 이 순서로 바로 작업

- **고정:** 사용자 지정 `examUid`, Git 원본 JS exact path, Notion 동일 시험지 행. Git `main` 최신 SHA, 그 JS blob SHA를 한번 가져오고, 필터/숨김/중복을 반영한 **실제 표시 QID N**을 고정한다. 문항명 전역 검색/과거 보고서 조사보다 source 먼저.
- **UID/기존 메타:** JS에 `questionUid`가 없으면 `sourceArchiveFile + sourceOrdinal`과 출력 순번을 결합한다. `archive/data/question_metadata.json`의 일치 행을 먼저 조회한다. PT/TPL 키는 검수하지 않으며 다른 메타 필드의 실제 등록 여부만 확인한다.
- **현재 의미 정본(PT/TPL 제외):** 해당 교육과정의 L1~L4/RPM·CrossConcept·Condition·Integration·두 난이도 정본 및 시험지별 UID 메타만 필요한 exact 경로로 대조한다. **PT/TPL 전용 ACTIVE ownerPack·taxonomy·binding·registry·runtime, PT/TPL crosswalk의 신규 검색·수정은 하지 않는다.** 공통 RPM LOCKED 정본 무단 수정 금지.
- **실제 소비/검색(PT/TPL 제외):** 해당 시험지 source → UID → 기존 sidecar/기타 메타 → **대상 학생 제품의 실제 metadata loader/fetch/overlay 및 index/search projection의 실사용 값**을 확인한다. PT/TPL 관련 Consumer/Search 필드는 분모에서 제외한다. **남은 필수 메타**의 실사용값이 미확인이라면 `UNVERIFIED`이며 마감 불가. 다른 시험지/공통 엔진 수리 자동 확대 금지.
- **원본·시각:** 핀포인트 대상의 기존 JS·그림/SVG/표·현재 asset 경로만 정적으로 점검한다. **원본 PDF/스캔/HWP는 기본 대조·조회하지 않는다.** 사용자가 해당 시험지에 별도 요청한 경우에만 원본 대조한다. 정상 자산 재제작 금지.

**STOP-SEARCH:** 동일 source/정본 blob과 동일 유효 증거를 확보하면 즉시 다음 단계로 이동한다. 대형 JSON `fetch_file`의 빈 본문/size 오류는 0건이라는 뜻이 아니다. 정확한 반환 blob SHA로 `fetch_blob`→그 안에서 해당 UID N개 필터→가능한 verified raw/부분조회 순으로 한번만 우회한다. 출처를 특정한 후 광역 검색이나 동일 SHA 재조회 금지. 차단은 해당 파일·UID·실제 오류·`firstMissingStep` 기록.

## 3. 기본 PINPOINT 최종 QA — 검증 범위는 정확히 기록

- 실제 표시 총 문항수 **N은 식별**하되 **기존 정상 QID의 전수 재풀이·전수 해설 재검을 하지 않는다.** 기존 유효 검수·메타 증거를 재사용하고, 결함 의심 QID와 확인된 누락·충돌 메타 UID만 수학 핵심 계산·정답/보기·학생 해설·L1~L4/RPM/CrossConcept/Condition/Integration/level/difficultyBucket·필요 시각을 **핀포인트 실검수**한다. PT/TPL은 최종 QA 범위에서 제외한다. 신규 실검수 분모와 이전 증거 재사용 분모는 구분한다.
- 유효한 동일 source/blob의 기존 검수 이력을 재사용한다. **이번에 확인한 핀포인트 QID/UID만** `KEEP`, `CORRECT/REGISTER`, `OPEN` 및 근거를 남기고, 확인하지 않은 정상 문항을 신규 PASS로 표현하지 않는다. PT/TPL은 `PT_TPL_NOT_IN_SCOPE`로 기록한다.
- 확정 결함/실제 메타 누락은 **담당자가 그 문항만 직접 최소 수정**하고 해당 QID와 직접 의존성만 재검한다. 정상 문항·자산 보존. source→semantic authority→필수 runtime/Consumer 파생 파일만 최신 main 기준 최소 변경; 공통 generated 대량 재생성 금지.
- **금지:** 다른 시험지 자동 진행, CREATE/R1/R2/R3 재실행, 신규 validator/Actions/Chrome/Pages 테스트, 공통 CI/엔진 수리, 무관한 taxonomy 전면 rebuild. 사후 QA에서 Chrome/Pages 방문은 완료 조건이 아니다. 필요한 대상 JS node 정적 검사·수식/에셋·UID 검색 parity 검사는 유지.

## 4. 완료·중단 계약

- **완료:** PINPOINT 대상 QID/UID 실검수·확정 결함 수정·변경 영향 재검 + 필요한 기타 메타의 해당 UID Consumer/search parity + 대상 범위 OPEN=0 + Git 최신 main/대상 blob 원격 readback(수정 0이면 검증된 `NO_CHANGE`) + 해당 시험지 Notion에 **PINPOINT_ONLY/NO_SOURCE_PDF_COMPARE 및 검증 범위** 명시·readback. 기존에 미검증인 나머지 문항을 본 작업에서 새로 검수 완료했다고 표시하지 않는다. 수정 시 대상 파일 whitelist만 PR/운영병합; CI/Pages는 별도.
- **미완료:** 핀포인트 대상의 미확인 QID/필드·미반영 메타·실제 대상 Consumer 미확인은 PASS/DONE 금지. 접근/권한·기술 장애는 `BLOCKED/IN_PROGRESS`와 `firstMissingStep`으로 정확히 표시한다. 원본 미대조만으로 핀포인트 작업을 차단하지 않는다.
- **HANDOFF:** 같은 `taskId`·owner·snapshot main SHA/JS blob, routeReceipt(`SOURCE, META_CANONICAL_OTHER, CONSUMER_EFFECTIVE_OTHER` 각각 exact path/blob/status/proof; PT/TPL 검사 없음), QID별 coverage 증거 ref, 고친 범위, 미해결, 마지막 원격 성공 ref와 `firstMissingStep = 하나의 구체적 파일+QID+다음 검증/수정`를 저장한다. AWCR 공유 packet에는 raw 문제/답/해설/프롬프트·secret 금지. 실제 Drive 업로드·raw SHA256·revision 재조회 성공 전 완료 저장 주장 금지.
- **최종 보고:** 전체 표시 N, 이번 핀포인트 실검수 QID/UID 수, 기존 증거 재사용 범위, 수정 QID, 원본 대조 제외·PT/TPL 제외, 기타 메타 등록/미확인, 미해결 수, main SHA를 간결하게.

**원칙:** *필독 2곳, 실물 정본 exact path, 한번 확인한 SHA 재사용, 발견 결함 바로 수정, 원격 증거로 완료*. 품질 타협이 아니라 문서·검색 낭비 제거.
