# JS Archive FINAL QA — SINGLE ENTRY EXECUTION CARD (CURRENT v1.3)

**최우선 사용자 OVERRIDE — PT/TPL 제외 (2026-10-21):** 사후 FINAL QA에서는 `problemTypeKey`·`templateKey`, PT/TPL ACTIVE pack/binding/registry/crosswalk 탐색·매핑·신규 등록·오류 보정 및 **PT/TPL Consumer/Search parity를 수행하지 않는다. PT/TPL 미검증·미등록은 완료 차단 사유가 아니다.** 기존 PT/TPL 데이터는 삭제·덮어쓰기 없이 보존한다. 결과는 `PT_TPL_NOT_IN_SCOPE (USER_EXCLUDED)`로 표시하고 PASS/NOT_APPLICABLE로 위장하지 않는다. 기존 CREATE/R1/R2/R3 및 예약 라인에는 적용하지 않는다. **수학/정답/해설·시각 및 L1~L4/RPM·CrossConcept·Condition·Integration·두 난이도·UID/기타 실제 메타 등록/검색 정합성 N/N은 유지한다.** 이 조항이 아래의 모든 PT/TPL 필수 표현과 과거 라우터·상세 문서보다 우선한다.

**CURRENT 메타 쓰기 경계(2026-10-21 사용자 지시):** 공용 `archive/data/question_metadata.json`은 정확한 UID N행의 **조회·대조·검색용**이며, FINAL QA 수정 결과는 **시험지별 소형 메타 JSON**으로만 작성한다. 공용 대형 파일 직접 수정·업로드/PUT 금지. 인가된 Actions가 공용 메타·Consumer/index를 갱신하고 대상 UID N/N 원격 parity를 확인해야 완료다. 현재 자동 등록기는 공통수학2/REVIEW2 제약이 있으므로 대수 등 미지원 요청은 `TOOLING_GAP`으로 처리한다(대형 파일 직접 업로드 우회 금지). [단일 정책](docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md); 상세 문서 추가 선열람 요구는 아니다.


> 2026-10-21 사용자 직접 지시에 따른 사후 QA 필독 축소. **이미 main에 존재하는 지정 시험지 1건**에만 적용. 기술·품질 의무는 기존 FINAL QA v2.1 그대로이며, **문서 선열람만 축소**한다. 본 카드가 선행 절차이며 기존 긴 [FAST ROUTER v1.1](JS_Archive_FINAL_QA_FAST_ROUTER_HANDOFF_CURRENT_v1.md), [Notion FINAL QA v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98), Archive 시작/생명주기, AGENTS.md는 **정본 예외가 생겼을 때만 해당 절을 열람하는 상세 참고자료**다. 기존 규정/프로젝트를 삭제하거나 수정하지 않는다. 최신 사용자 지시 우선.

## 1. 딱 두 곳만 선열람

1. Notion [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)의 맨 위 **사후 FINAL QA 단일 진입 v1.2 절**.
2. **이 카드**(전체 약 1쪽 실행 계약). 그 외 포괄 문서는 시험지 시작 전에 순서대로 열람하지 않는다.

작업에 필요한 **실물 코드·정본 데이터의 정확한 조회는 생략하지 않는다**. 단순 단계 통과 문구나 예전 PASS를 현행 SHA 증거로 대체할 수 없다. 새 작업은 새 taskId/owner로 시작, 실제 동일 taskId와 predecessor 증거가 있을 때만 연속 인수한다. [AWCR bootstrap](https://drive.google.com/file/d/1DDf_QrWCI26EZFdnjQd_E4oQk4nBHdvM/view) 확인 후 안전한 최소 메타 checkpoint만 append-only로 남기고 저장/readback 실패 시 SYNC_PENDING으로 구분한다.

## 2. 검색 없는 exact 경로 — 이 순서로 바로 작업

- **고정:** 사용자 지정 `examUid`, Git 원본 JS exact path, Notion 동일 시험지 행. Git `main` 최신 SHA, 그 JS blob SHA를 한번 가져오고, 필터/숨김/중복을 반영한 **실제 표시 QID N**을 고정한다. 문항명 전역 검색/과거 보고서 조사보다 source 먼저.
- **UID/기존 메타:** JS에 `questionUid`가 없으면 `sourceArchiveFile + sourceOrdinal`과 출력 순번을 결합한다. `archive/data/question_metadata.json`의 일치 행을 먼저 조회한다. PT/TPL 키는 검수하지 않으며 다른 메타 필드의 실제 등록 여부만 확인한다.
- **현재 의미 정본(PT/TPL 제외):** 해당 교육과정의 L1~L4/RPM·CrossConcept·Condition·Integration·두 난이도 정본 및 시험지별 UID 메타만 필요한 exact 경로로 대조한다. **PT/TPL 전용 ACTIVE ownerPack·taxonomy·binding·registry·runtime, PT/TPL crosswalk의 신규 검색·수정은 하지 않는다.** 공통 RPM LOCKED 정본 무단 수정 금지.
- **실제 소비/검색(PT/TPL 제외):** 해당 시험지 source → UID → 기존 sidecar/기타 메타 → **대상 학생 제품의 실제 metadata loader/fetch/overlay 및 index/search projection의 실사용 값**을 확인한다. PT/TPL 관련 Consumer/Search 필드는 분모에서 제외한다. **남은 필수 메타**의 실사용값이 미확인이라면 `UNVERIFIED`이며 마감 불가. 다른 시험지/공통 엔진 수리 자동 확대 금지.
- **원본·시각:** JS 내 필수 이미지/SVG/표 참조와 `archive/assets/images/`, `assets/images/`·resolver의 경로를 확인한다. 원문 충돌·실자산 결손이 의심되는 **해당 QID만** Drive Evidence Vault에서 원본 PDF를 가져온다. 정상 SVG/이미지 재제작 금지.

**STOP-SEARCH:** 동일 source/정본 blob과 동일 유효 증거를 확보하면 즉시 다음 단계로 이동한다. 대형 JSON `fetch_file`의 빈 본문/size 오류는 0건이라는 뜻이 아니다. 정확한 반환 blob SHA로 `fetch_blob`→그 안에서 해당 UID N개 필터→가능한 verified raw/부분조회 순으로 한번만 우회한다. 출처를 특정한 후 광역 검색이나 동일 SHA 재조회 금지. 차단은 해당 파일·UID·실제 오류·`firstMissingStep` 기록.

## 3. 필수 최종 QA — 판정 기준은 축소하지 않음

- **실제 표시 N/N 전 QID**의 수학 핵심 계산·답/객관식 5선지/복수답, 학생 해설과 교육과정/작은칠판 흐름, L1~L4/RPM/CrossConcept/Condition/Integration/level(하·중·상)/difficultyBucket(1~5) [PT/TPL 제외], 필요한 그림·표·SVG와 수식/자산 정적 일치를 **모두** 확인한다.
- 유효한 같은 blob의 R1~R3 독립답/품질 근거는 재사용하되 모든 QID의 현재 학생용 네 축 판정은 남긴다. 실제 의심 QID만 정밀 재풀이. QID별 `KEEP`, `CORRECT/REGISTER`, 근거 있는 `NOT_APPLICABLE`, `OPEN` 및 UID·값·증거를 기록한다. PT/TPL은 이 판정의 분모가 아니라 `PT_TPL_NOT_IN_SCOPE`로만 기록한다.
- 확정 결함/실제 메타 누락은 **담당자가 그 문항만 직접 최소 수정**하고 해당 QID와 직접 의존성만 재검한다. 정상 문항·자산 보존. source→semantic authority→필수 runtime/Consumer 파생 파일만 최신 main 기준 최소 변경; 공통 generated 대량 재생성 금지.
- **금지:** 다른 시험지 자동 진행, CREATE/R1/R2/R3 재실행, 신규 validator/Actions/Chrome/Pages 테스트, 공통 CI/엔진 수리, 무관한 taxonomy 전면 rebuild. 사후 QA에서 Chrome/Pages 방문은 완료 조건이 아니다. 필요한 대상 JS node 정적 검사·수식/에셋·UID 검색 parity 검사는 유지.

## 4. 완료·중단 계약

- **완료:** N/N 실검수 + UID별 PT/TPL 외 필수 메타 의미 정합성과 실제 Consumer/search parity + 수리/표적 재검 완료 + 필수 정적 검증 + OPEN=0 + Git 최신 main/대상 blob 원격 readback(수정 0이면 검증된 `NO_CHANGE`) + **그 시험지 Notion 행 문항별 체크/진행=완료 및 readback**. 수정 시 대상 파일 whitelist만 PR/운영병합; CI/Pages와 병합/품질은 구별.
- **미완료:** 미확인 QID/필드·미실행 필수 QA·실제 Consumer 미확인은 절대 PASS/NO_CHANGE/DONE 금지. 복구 가능한 것은 바로 수리하고, 권한/원본/기술 장애가 실제로 남으면 `BLOCKED/IN_PROGRESS`로 유지.
- **HANDOFF:** 같은 `taskId`·owner·snapshot main SHA/JS blob, routeReceipt(`SOURCE, META_CANONICAL_OTHER, CONSUMER_EFFECTIVE_OTHER` 각각 exact path/blob/status/proof; PT/TPL 검사 없음), QID별 coverage 증거 ref, 고친 범위, 미해결, 마지막 원격 성공 ref와 `firstMissingStep = 하나의 구체적 파일+QID+다음 검증/수정`를 저장한다. AWCR 공유 packet에는 raw 문제/답/해설/프롬프트·secret 금지. 실제 Drive 업로드·raw SHA256·revision 재조회 성공 전 완료 저장 주장 금지.
- **최종 보고:** N/N, 수정 QID, PT/TPL 제외 표시, 기타 메타 KEEP/REGISTER/비적용/미확인, 미해결 수, 최종 main SHA만 간결하게.

**원칙:** *필독 2곳, 실물 정본 exact path, 한번 확인한 SHA 재사용, 발견 결함 바로 수정, 원격 증거로 완료*. 품질 타협이 아니라 문서·검색 낭비 제거.
