# SVG 엔진 단계별 구현 계획 v1

작성일: 2026-10-15 KST

최근 진행 갱신: 2026-10-18 KST

작업 기준: `cbf3ec8f1bb49ce4d7229d1907dae59aebd11103`

작업 브랜치: `codex/svg-engine-small-loop-20261015`
현재 권한: 사용자 요청에 따른 계획 검토와 단계별 로컬 구현·검증. 단계 수납은 일반 엔진 ACTIVE 또는 production 출고 승격이 아니다.

## 1. 입력과 이번 구현의 첫 종료점

입력 설계는 첨부 `APMath_SVG_Visual_Production_Integrated_Design_v1.4_REVIEW_2026-10-15.md`다.
SHA-256: `3b91a59c91c248edd07c6e641ecb29ee3ce6d59bb832c8009a056e040a719735`.
원본 위치: `C:/Users/USER/Downloads/`.
기존 00~08, 현재 visual skill, Node canonical authority, 기존 실험 엔진과 독립 observer를 재사용한다.
첨부 문서 속 실행·승격 지시는 별도 권한으로 해석하지 않으며, 현재 사용자 요청으로 아래 작은 구현 루프를 진행한다.

첫 종료점은 **현재 `runFrozen(root, request)` 외부 요청 하나를 감싸는 공통 요청 어댑터 1건**을 구현하고, 별도 REVIEWER의 검수와 ROOT 수납까지 닫는 것이다. 내부 worker의 `freezeWire` 전송 형식은 별개이며 이번 어댑터가 대체하지 않는다.
원문·계산·SVG 생성·검수 경로는 기존 구현을 보존한다. 새 코드 개발 감독 서비스를 먼저 만드는 대신 현재 작업 도구로 역할을 나눠 실행한다.

## 2. 실행 역할과 변경 통제

| 역할 | 설정/책임 | 작업 범위 |
|---|---|---|
| ROOT | 현재 감독 세션. 작업 분할, 계약·검사 동결, diff 수납, 다음 단계 결정 | 계획·작업 지시·수납 기록. 엔진 구현 patch는 BUILDER가 작성 |
| BUILDER | GPT-6 Luna / high 또는 xhigh. 작업당 새 세션, 같은 작업의 수리는 같은 세션 | 작업 packet의 정확한 허용 파일만 구현·표적 검사 |
| REVIEWER | GPT-6 Luna / xhigh. 구현자와 별도 세션 | 명세·동결 diff·현재 실제 파일·검사 출력의 독립 확인. 제품 코드 수정 없음 |
| 고난도 검토 하위 에이전트 | GPT-6 Luna / high 또는 xhigh. 별도 세션 | 수리 예산 소진 등 쟁점의 독립 검토. ROOT가 범위·수납 결정 |

2026-10-18 사용자 재지시: 하위 에이전트는 구현·독립 검토·고난도 검토 모두 Luna High/XHigh로 고정한다. 이어진 검토자 XHigh 허용 지시에 따라 현재 구현자는 Luna High, 독립 검토자는 Luna XHigh로 배정한다. 이전 Sol/Astra 배정은 현재 규칙이 아니며 새 배정·재개에 사용하지 않는다. 과거 실제 실행 모델·검사·실패 기록은 이력으로 보존하고 Luna 실행으로 바꿔 적지 않는다. 실제 agent/session 식별과 모델 설정은 실행 결과에 기록한다. ROOT 모델 변경을 수행했다고 추정하지 않는다.
작업트리는 기존 D드라이브의 깨끗한 checkout을 재사용한다. 주 C드라이브 checkout의 사용자 변경은 작업 입력이 아니다.
worktree·허용 경로 검사는 변경 수납 통제다. 에이전트의 OS/Git 권한을 물리적으로 제한했다고 보고하지 않는다.
BUILDER에게 push/merge/배포/production asset 변경을 맡기지 않는다. ROOT도 이번 로컬 작업을 main 출고로 확대하지 않는다.

## 3. 한 작업의 최소 packet

별도 영구 상태 DB 없이 `.tmp/archive/svg-engine-development-20261015/` 아래 현재 실행 증거를 둔다.
작업 지시에는 아래를 한 번만 고정한다.

- `taskId`, 기준 commit과 시작 working-tree diff, 설계의 해당 절.
- 해결할 동작 1개와 관측 가능한 완료 조건.
- 정확한 쓰기 허용 파일, 보호할 기존 경로, 직접 dependency.
- 정상·오류 사례 및 실행할 표적 검사. 미실행/실패/증거 누락을 구별.
- BUILDER/REVIEWER 식별, handoff ref, 최종 diff/파일 SHA.

구현자는 요약과 함께 실제 코드·diff·명령·exit code·raw log 경로를 낸다.
REVIEWER는 그 revision을 확인하고 결함별 파일/위치/재현/예상 동작을 돌려준다.
ROOT는 현재 diff와 허용 목록, raw 검사 결과, 검수 결함 해소를 수납한 뒤 다음 작업을 연다.
새 파일·삭제·이름변경·추적되지 않은 파일도 변경 범위에 포함한다. 검사 기대값·gate·지원 범위 변경은 원 작업의 통과 수단으로 몰래 추가할 수 없다.

## 4. 첫 루프의 세 작업

| ID | 정확한 대상 | 산출물·필요 확인 | 수납 후 다음 동작 |
|---|---|---|---|
| P0 | 이 계획 | 별도 REVIEWER가 v1.4 및 기존 코드 경계와 비교 | 결함 보완 후 B0 착수 |
| B0 / V0-소범위 | 기존 frozen-wire/capability/canonical/store/source binding과 해당 시험 | 실제 경로·exports·지원 한계·선정 테스트 raw 결과. 기존 전체 census 자료는 재사용하고 미확인은 UNKNOWN | ROOT가 A1의 실제 interface와 허용 파일을 고정 |
| A1 / V1-A | 기존 frozen-wire 입력을 보존하는 opt-in 요청 어댑터 1개 | 아래 계약의 정상/오류 fixture, 기존 경로 회귀, 독립 코드 검수 | 첫 작은 구현 루프를 수납하고 다음 작업을 구체화 |

B0는 제품 코드와 원본을 수정하지 않는다. 전체 기출의 교육적 필요성 census가 끝났다는 주장을 하지 않는다.
A1의 정확한 이름과 함수 signature는 B0에서 현행 exports를 확인한 뒤 작업 packet에 고정한다. 이 계획의 제안명은 현존 schema로 주장하지 않는다.

### A1의 동작 계약

1. 기존 geometry production `runFrozen` 외부 요청 하나만 대상으로 한다. existing runtime entry를 기본 경로로 교체하지 않는다.
2. 공통 envelope에 UID/surface/source·solution refs와 기존 payload를 결속한다. 경로·byte length·SHA의 역할은 기존 ref 계약을 따른다.
3. UID/source binding·지원 capability·exact typed scalar·Node canonical hash는 기존 authority/validator에 위임한다. 새 UID 또는 두 번째 canonicalizer를 만들지 않는다.
4. adapter 왕복에서 기존 payload의 의미·순서·정확값·owner·refs가 바뀌지 않아야 한다. 실제 파일 존재/bytes를 검사하지 않는 순수 adapter라면 이를 명시하고 verified/source authority PASS를 발급하지 않는다.
5. 지원 밖 형식, malformed wire, UID/ref mismatch 등은 구분되는 실제 오류로 반환한다. math FAIL을 UNSUPPORTED로 바꾸지 않는다.
6. 기본 허용량은 adapter 1파일 + 표적 test 1파일 + 사용법의 짧은 문서다. 필수 직접 dependency가 확인되면 ROOT가 이유와 정확한 파일을 packet에 먼저 추가한다.
7. browser/provider 호출, 기존 renderer 수정, AI 조건 재추출, 학생 JS/PNG/SVG/Consumer 수정, capability 승격은 A1에 포함하지 않는다.

### A1의 검사 분모

- 정상: 현행 최소 유효 wire의 왕복 보존, exact scalar와 배열 순서, 기존 authority의 hash와 일치.
- 오류: unknown envelope/backend 형식, 잘못된 UID/ref 연결, malformed typed wire, stale envelope/payload binding.
- 권한: adapter 결과만으로 independent review/qualification/publication을 부여하지 않음.
- 회귀: B0에서 확인한 기존 계약 관련 테스트만 실행. 새로운 실패·수정이 없으면 전체 검사를 반복하지 않는다.

## 5. 루프와 수리

`작업 동결 → BUILDER 구현 → 기계 검사 → revision/diff 동결 → REVIEWER → ROOT 수납 → 다음 작업`.
실패하면 같은 BUILDER에게 구체적인 결함과 영향 범위만 돌려준다. 과거 정상 증거는 정확한 dependency가 같을 때 재사용한다.
최초 검수 이후에는 changed/open/direct dependency만 재검한다.
한 작업의 코드 수리는 기본 2회까지 진행한다. 같은 원인·같은 수정이 반복되거나 예산을 소진하면 근거를 보존해 고난도 감사로 연결한다.
이는 개발 작업의 예산이며 현재 엔진의 `RepairBudget`을 변경하거나 재설정하는 규칙이 아니다.

**검증 크기 규칙(2026-10-20 사용자 지시, 모든 작업자 공통):** 테스트를 전부 돌리지 않는다. packet에는 실행할 테스트를 정확히 적고, 검증 크기는 변경 크기에 맞춘다.
- 신규·변경 테스트와 변경된 코드 경로를 직접 지나는 테스트만 실행한다. 작은 수정이라면 BUILDER는 신규 테스트와 직접 영향 테스트 1~2개만 돌린다.
- REVIEWER는 다음만 한다: diff, 경계 probe 몇 개, 독립 바이트 동일성 표본 2~3개, 신규 테스트 1회 실행. BUILDER가 이미 돌린 긴 실행(Chrome/Archive 캡처, Python 전체)은 raw 로그를 읽어 확인하고 `NOT_RUN_REVIEWER`로 표기한다.
- 무관한 묶음의 전후 기준선은 고위험 변경이거나 사용자가 요청할 때만 만든다.
- 서로 독립인 단계(예: 실제 재관측)는 검토와 병렬로 실행한다.
검수자의 단순 PASS 문구, 테스트 코드 존재, 파일 존재를 실제 검증 근거로 대신하지 않는다.
코드 검수 세션과 v1.4 §12.4의 source-only 추출/렌더-only 역관측 세션은 목적·입력 가시성이 다르므로 합치지 않는다.

## 6. 첫 루프 이후의 작업 순서

다음은 순서와 분리 원칙이다. 각 항목은 착수 직전에 위 packet으로 다시 작은 단위로 고정한다.

| 순서 | v1.4 대응 | 작업 단위 |
|---|---|---|
| A2 | V1 | sourceCondition/fact/display disposition 연결 및 기존 `PRESERVED_ARCHIVE_BANK` 호환 |
| A3 | V1·§12.4 | 기존 blind/freeze 기반을 이용한 조건 두 추출 결과 정규화·불일치 처리 |
| M1 | V2 | 기존 capability 1개에서 parameter 변경과 수학 dependency 재계산 연결 |
| L1 | V3 | 기존 실측 fragment/layout/size 정책을 한 경로로 결속 |
| R1 | V4 | 동일 final SVG·asset response·Actual Archive·독립 역관측 receipt 연결 |
| Q1 | V5 | 선언된 범위의 정상/오류·실문항·feature 검증과 별도 qualification |
| I1 | V6 | 승인된 제품의 opt-in adapter와 템플릿 파일럿 |
| E1 반복 | V7 | census 근거로 선정한 한 유형/버전의 지원 확대와 대응 observer·회귀 |

A3는 다음 작은 단위로 나눈다.

- **A3-1:** 이미 동결한 현행 조건 추출 기록 두 개의 진단용 텍스트 다중집합 비교. 조건별 원문 위치가 없는 현행 형식을 그대로 읽으며, 추출자별 id·행 순서를 대응 근거로 쓰지 않는다. NFC 이외의 수학·공백 정규화를 하지 않고 중복 개수와 양쪽 원문 증거를 보존한다. 동일한 학생 입력·image SHA·정책이라는 기록상 주장을 확인하되 실제 source/image revision·UID·격리·완전성은 인증하지 않는다. 문자열 일치여도 EVIDENCE_DEBT이며 productionAuthorized=false다.
- **A3-2:** 기존 source-only 추출·freeze와 두 독립 경로의 실제 입력·모델·context·invocation 및 source/image refs 결속. A3-1 진단 결과를 독립성/원문 완전성 증거로 자동 승격하지 않는다.
- **A3-3:** 원문 위치 기반 표적 재확인, 채택/기각 근거와 미해결 의미 차이 처리 및 의존 증거 재사용. 원 동결 결과를 보존한다.

A3-3의 첫 구현은 **A3-3-1 증거 계약**으로 한정한다. 신규 `source-inventory-resolution-v1.mjs`·대응 검사·사용법 3파일에서, 같은 동결 parent의 좌우 미대응 발생 항목을 n:m claim/unresolved 그룹으로 빠짐없이 기록하고 원문 UTF-16 인용·bound 이미지 위치 구조·즉시 이전 기록을 검증한다. 구조적으로 유효한 제안도 의미 판정이나 accepted-fact/production 권한을 발급하지 않는다. 기존 실제 10개 차이에는 의미 미검토라고 명시한 unresolved-only 기록으로 연결만 확인하며, 원문 근거의 실제 의미 판정은 다음 별도 작은 작업이다.

수학/의미 변조 시험은 변조 SVG에 맞는 운반 SHA를 사용하고 기대 수학 사실을 고정한다. SHA 거부 시험과 수학 오류 검출을 따로 센다.
정상 수용과 오류 검출을 함께 확인하며, 같은 입력을 PASS가 나올 때까지 반복해 결과를 선별하지 않는다.
코드 수납, capability qualification, engine ACTIVE, 개별 SVG publication, main/배포 완료는 각각 실제 근거와 기존 권한을 따른다.

## 7. 현재 진행

- P0: Sol High 별도 세션 검토 `PASS_FOR_B0`. 검토된 초안 SHA-256 `d16fcd4652c38f2f4a72a61917044dfe0a49abefcea91e9395cf0f1963a1dc80`.
- B0: ROOT 수납 완료. 최초 19/21 결과는 보존했다. 기존 pinned setup의 임시 의존성 복구 후 관측기 2건만 다시 실행해 2/2 PASS. 계약 19건과 관측기 2건의 기준선 확인 완료이며 engine qualification 주장은 아니다.
- A1: ROOT 수납 완료. 최초 28/28 PASS 뒤 별도 Sol High가 Proxy 입력의 결속 결함 A1-R1을 재현했고 v2를 미수납했다. 같은 BUILDER의 수리 1회차와 최종 v3 표적 재검 후 `ACCEPT_A1`; A1-R1은 해소됐다.
- A2: ROOT 수납 완료(2026-10-16). `77bc8290a122bc9a5ebc66038a625638cbd3032f`에서 구현한 네 파일을 검수했고 문서·테스트 보완 1회 후 Sol High `ACCEPT_A2`를 받았다. 최종 A2 14/14, 동일 구현의 construction 7/A1 10 재사용, 독립 probe 7/7이며 최종 test bytes로 새 통합 31건을 실행했다고 보고하지 않는다. 노드 기반 구조 검증이며 독립 source/render/본문 parity 검수나 receipt 발급으로 보고하지 않는다.
- A3-1: ROOT 수납 완료(2026-10-16). `e1c09aaf7dbff11aed86b12256efc1fa2a9228f0` 기준의 신규 진단 비교기 3파일을 수납했다. 최초 구현의 독립 probe 7/10 실패에서 SHA 배열 강제변환과 caller ref 경로 재조회 결함을 재현했다. 같은 Luna BUILDER의 수리 1회 후 신규 8 + 기존 3의 최종 표적 검사 11/11, 같은 Sol REVIEWER의 실제 파일 probe 재실행 10/10, 모두 child exit 0을 확인하고 `ACCEPT_A3_1`을 받았다. 최초 실패와 원 바이트는 보존했다. 문자열 진단 비교기이며 A3 전체·독립 추출·수학 검증·production 승격 완료가 아니다.
- A3-2: ROOT 수납 완료(2026-10-16). `8a4d9434324e4fc3f6dd9d1d3fc6ad98624119ad` 기준 신규 진입점 3파일을 두 차례의 제한 수리 후 수납했다. 최종 표적 54/54(신규 42 + 기존 12), 독립 probe 36/36, 실제 등록 문항 1개 × AppServer 호출 2회와 독립 실제 증거 readback을 모두 child exit 0으로 확인했다. 검수 세션이 마지막 메시지 중 사용량 한도에 걸렸지만 `ACCEPT_A3_2` 보고서·실행 결과는 이미 저장돼 있었고, ROOT가 실제 보고서와 현재 바이트를 다시 확인했다. 원 실패·수리·초기 import-only RED와 이후 동작 검사 순서 이력은 보존했다. 최초 TDD 순서 준수를 소급 주장하지 않는다.
- A3-3-1: ROOT 수납 완료(2026-10-16). `6af91b116d62eff4cf8d8270fbc3447de4bc9aa3` 기준 증거 계약·구조/실파일 검증·append-only 기록 3파일을 수납했다. 최초 2건 검사의 불완전 초안은 수납하지 않았고 독립 fixture/필수 검사 보완 후 정식 검수했다. 독립 검수의 R1~R6을 같은 Luna에서 1회 수리한 최종 표적 34/34(신규 26 + 비교기 8), Sol 독립 probe 21/21, 기존 store baseline 5 PASS/14 SKIP의 동일 SHA 재사용을 구분한다. 실제 unresolved-only 기록 1회와 독립 재독은 child exit 0이며, 10개 발생 항목을 각 1개씩 10그룹에 중복·누락 없이 담았다. 최초 실패/불완전 초안/검수 harness 교정/실행 전 runner 교정은 보존했다. 의미 판정·accepted facts 생성·source 재추출은 0건이다.

수납한 검사 분모는 최종 어댑터 10/10, 동일한 수리 모듈에서 재사용한 기존 계약 19/19, 별도 REVIEWER의 재현·공격 probe 6/6이다. 최종 test-only 추가 이전의 통합 29/29 로그와 이후 최종 어댑터 10/10 로그를 구별해 보존하며, 최종 test bytes로 새 통합 29건을 실행했다고 주장하지 않는다.

현재 A1 로컬 산출물:
- `archive/tools/geometry-equation/production/request-adapter-v1.mjs`
- `archive/tools/geometry-equation/tests/request-adapter-v1.test.mjs`
- `archive/tools/geometry-equation/production/request-adapter-v1.md`

A1 수납 증거는 `.tmp/archive/svg-engine-development-20261015/A1/review-input-v3.json`, `repair1-green.log`, `repair1-dynamic-green.log`와 `review/review-v3.md`다.
A1 최종 독립 검토 보고서 raw SHA-256: `b322b3c82ac3a35e0ccd732728d76c13f6c35645f8b8f2b67ded1c15fffb864f`.
원 v2 재현·수리 전 실패·NFC fixture 교정·임시 의존성 복구 로그는 삭제하지 않는다.
A2 로컬 산출물:
- `archive/tools/geometry-equation/production/fact-display-map-v1.mjs`: 기존 조건 검사와 opt-in map 구조 검사.
- `archive/tools/geometry-equation/production/phase2.mjs`: 기존 함수의 import/re-export와 기존 호출 연결 유지.
- `archive/tools/geometry-equation/tests/fact-display-map-v1.test.mjs`: map 정상/오류 및 기존 경로 호환성 검사.
- `archive/tools/geometry-equation/production/fact-display-map-v1.md`: POINT/LINE/CIRCLE 범위와 no-map/root-Proxy 예외, 검증 한계.

A2 수납 증거는 `.tmp/archive/svg-engine-development-20261015/A2/review-input-v2.json`, `repair1-test.log`, `review/review-v2.md`, `review/independent-probe-v2.mjs` 및 실제 stdout/exit 기록이다.
A2 최종 독립 검토 보고서 raw SHA-256: `75de2c182b2a3489c870c7a26c7ab8567954ea397401a38d25422dfc7792ea26`.
초기 RED·중간 실패·잘못된 오류 축에서 거부된 fixture 이력은 보존하며, 보완 후 scalar/unknown-node 사례가 의도한 검사 축에 도달하는지 확인했다.
A3-1 로컬 산출물:
- `archive/tools/geometry-equation/production/source-inventory-compare-v1.mjs`: 동결 기록 raw ref 확인, 동일 학생 입력/image SHA/정책 주장 비교 및 NFC-only 조건 텍스트 다중집합 진단.
- `archive/tools/geometry-equation/tests/source-inventory-compare-v1.test.mjs`: 비교·오류·권한 경계 및 두 결함 회귀 검사.
- `archive/tools/geometry-equation/production/source-inventory-compare-v1.md`: 입력·출력·정규화·원본/독립성 미검증 범위.

A3-1 수납 증거는 `.tmp/archive/svg-engine-development-20261015/A3-1/review-input-v2.json`, `repair1/commands-and-exits.md`, `repair1/final-targeted-output.txt`, `review/review-v2.md`, `review/independent-probe-v1.mjs`와 별도로 보존한 v2 실행 stdout/stderr/exit다.
최종 packet v2 SHA-256: `808cfa2ec25be59ec1e2e7894310730addb9727c756886a7867fab5d2b7f6f8f`.
A3-1 최종 독립 검토 보고서 raw SHA-256: `d94176df5e13cffa8555e3b65b002dd6f3927a9818c00a167458f2050020d046`.
모든 유효 진단 결과는 `EVIDENCE_DEBT`, `productionAuthorized:false`를 유지한다. 실제 브라우저·SVG 렌더·qualification은 이번 비연결 비교기에서 NOT_RUN이며 source/image 실바이트·UID/revision·실제 추출 격리 증거는 발급하지 않는다.

A3-2 로컬 산출물:
- `archive/tools/geometry-equation/production/source-extraction-pair-v1.mjs`: 등록 source/UID/필수 PNG·JPEG 결속, 두 source-only 분리 호출, 원응답/기록/trace 동결·재독, A3-1 비교 연결.
- `archive/tools/geometry-equation/tests/source-extraction-pair-v1.test.mjs`: 실제 해석기·저장소·비교기를 사용하는 명시적 모의 호출 검사 및 원응답/동결 ref/메타데이터/trace 오류 회귀.
- `archive/tools/geometry-equation/production/source-extraction-pair-v1.md`: API·지원 asset topology·실제/모의 호출 구분과 권한 한계.

A3-2 packet SHA-256: `d5db8835b017c7e43a3a743fe63172eeb325d21dbfab162334b428d0f21cd401`.
최종 수납 바이트는 `.tmp/archive/svg-engine-development-20261015/A3-2/review-input-v3.json`에 결속했다. 코드 검토 보고서는 `review/review-v3.md`(SHA-256 `ff8fc3d0ace787ee4edccfdf91b4913be0190537398eca95e58090f285628b2f`), 실제 호출 수납 보고서는 `review/review-smoke-v1.md`(SHA-256 `19e3db23382117352acd22859e8a06e7535d06d66b2581b8711ef6d5d5b5e593`)다.
표적 검사 raw는 `repair2/evidence/repair2-final.*`, 독립 probe raw는 `review/independent-probe-v3.*`, 실제 호출 command/stdout/stderr/exit는 `evidence/smoke-run.*`, 독립 실바이트 재독은 `review/smoke-readback-v1.*`, ROOT 추가 결속 확인은 `root-smoke-readback.json`에 보존했다.

실제 run `a3-2-smoke-20261016-01`은 `25_삼산중_2학기_기말_중2_기출|1`과 필수 PNG를 같은 packet으로 두 번 제공했다. 모델 기록은 양쪽 `gpt-6.1-sol/high`, 서로 다른 실제 context/turn, completed terminal, 관측된 도구 활동 0건, 프로세스 exit/close 관측 완료다. 기존 등록/원본/PNG/공통 코드 15파일은 변하지 않았다. 독립 재독은 stage manifest 9개와 최종 동결 ref 11개, source/image/code 결속을 확인했고, 원격 서버가 입력 SHA를 직접 확인했다는 주장이나 OS 강제 격리 주장은 하지 않는다.
양쪽 8조건 중 텍스트 대응 3개·왼쪽만 5개·오른쪽만 5개를 그대로 보존했다. 결과는 `FROZEN_AND_COMPARED`라는 기술 실행 상태와 `UNRESOLVED_INVENTORY_DIFFERENCES`, `EVIDENCE_DEBT`, `productionAuthorized:false`를 유지한다. 재추출·의미 동치 판정·원문 조건 완전성 인증·수학 검수·SVG 렌더·qualification/ACTIVE는 하지 않았다.

A3-3-1 로컬 산출물:
- `archive/tools/geometry-equation/production/source-inventory-resolution-v1.mjs`: source/packet/manifest/occurrence 결속과 n:m claim/unresolved 제안 구조·원문 UTF-16 인용·bound 이미지 ROI 검증 및 신규 불변 기록.
- `archive/tools/geometry-equation/tests/source-inventory-resolution-v1.test.mjs`: tracked 입력으로 만드는 격리된 A3-2 모의 fixture, 정상 기록·개정·원본 복사본 보존과 오류 회귀.
- `archive/tools/geometry-equation/production/source-inventory-resolution-v1.md`: 구조 VALID와 의미/승인 권한 구분, raw 문자열 보존, API와 검사 범위.

Packet/evidence `.tmp/archive/svg-engine-development-20261015/A3-3-1/`. packet v2 SHA-256은 `c246e79b4bd32cfb86102625d93c8d6ad513e8f76c20b01c1fc63f2620fd8b56`, 수납 바이트는 `review-input-v2.json`에 결속했다. 최종 module SHA-256 `e953e6baacd412b39748d587c6657ba4eb008237bf10d19b9cfeb7c0049cf231`이며, 코드 수납 보고서 `review/review-v2.md` SHA-256은 `cfd89a740afcbfb17ba2bf1d6c7f8b8d899997afcb5a579325013a25659f1ea5`다.
최종 actual 수납 보고서 `review/actual-recording-review-v1.md` SHA-256은 `1e2cdaf34cc31f9656bc4c2cb9b97eb9f4636cadad9fbea7cf4c206d3b41d155`다. 표적 raw는 `baseline/repair1-final.*`, 독립 probe는 `review/independent-probe-v2.*`, 실제 기록은 `baseline/actual-recording.*`와 `recording/`, 독립 실제 재독은 `review/actual-readback-v1.*`, ROOT 재독은 `root-actual-readback.json`이다.

기존 A3-2 workRoot에 SOURCE_INVENTORY_RESOLUTION stage `sha256:9dca61b3292cfd2d25bc7ce5621c80cbadb7f28cfac54ca781d248366f3c690f`를 1회 추가했다. proposal/validation/resolution 3출력의 원문 바이트·manifest·envelope refs를 재확인했고, 이전 accepted parent 13파일은 모두 불변이다. 5 left-only + 5 right-only를 10개 단일 발생 그룹으로 기록했으며, cross-side 의미 대응·source citation·treatment는 하지 않았다. 원 comparison/debt는 그대로다. 모든 결과가 `EVIDENCE_DEBT`, `productionAuthorized:false`, `NOT_ADJUDICATED`, `acceptedFactsProduced:false`, `acceptanceVerified:false`, `SEMANTIC_ADJUDICATION_NOT_RUN`을 유지한다. SOURCE_EXTRACTION_CONFLICT는 제출된 미해결 선언의 DECLARED_UNVERIFIED 사유로만 표시한다.

실행 전 runner의 배치 그룹을 10개 단일 그룹으로 고치고, task 명세 raw SHA와 student packet raw/object SHA의 대상 혼동을 발견해 accepted packet ref와 실제 원문 바이트로 수정했다. 이전 RUNNER_OK는 교정된 정적 검토로 대체했다. 수정 전 runner를 실행했다거나 원본 재추출을 했다고 주장하지 않는다.

Git 반영 시 `core.autocrlf=true`의 clean 변환으로 test·사용법 파일의 문장/문단 경계 CRLF 각 1개가 LF로 저장됐다. module은 raw-byte 동일하며, 다른 두 파일은 CRLF→LF 외 차이가 없음을 ROOT와 Sol이 binary readback으로 확인했다. 원 검수 raw SHA와 index/commit clean SHA를 구분해 `index-content-check.json` 및 `review/git-serialization-addendum-v1.md`(SHA-256 `774a38d20a3f0f8f951e02e8eb0f4d2fa434c27c093c0887e9108968eb890553`)에 결속했다. staged 형태의 새 테스트 실행이나 세 파일 모두 raw-byte 동일이라는 주장은 하지 않는다.

A3-3-2의 대상은 이 10개 발생 항목의 원문·필수 이미지 대조와 별도 판정 동결이다. 아래 실제 실행 결과와 전체 엔진의 완전성·SVG/qualification/ACTIVE 및 main/push/배포 상태를 구분한다.

A3-3-2는 `10a97440a91cc6fd49c278f346508dd0b8173cca`를 기준으로 실제 표적 판정 파일럿에 한정한다. Luna High가 임시 runner를 작성하고 Sol High의 정적 검토 후, 원 학생 packet과 필수 PNG를 제공한 새 native Sol High 판정 1회·독립 원문 검토 1회를 수행한다. 원 비교기의 미대응 10개 발생 항목만 분모로 삼고, 기존 대응 3개는 재검하지 않는다. 원문 근거와 n:m claim 제안·독립 SUPPORTED/REJECTED/UNRESOLVED 결과를 불변 기록과 별도 sidecar에 동결하며, 기존 v1의 NOT_ADJUDICATED/debt와 이전 unresolved 기록은 보존한다. 이번 단위에서는 새 production 모듈을 만들지 않고, 재사용 receipt 결속기는 실제 증거 수납 후 별도 단계로 결정한다. 결과에 불확실·기각이 있으면 그대로 보고하며 일치할 때까지 재호출하지 않는다.

### A3-3-2 실제 결과 — 2026-10-18

원문 판정 1회와 독립 원문 검토 1회, 총 실제 native 호출 2회를 수행했다. 양쪽 모두 `gpt-6.1-sol/high`, 서로 다른 실제 context/turn과 completed terminal이며 원 두 추출 세션과도 다르다. 첫 판정은 2026-10-16에 완료됐지만 반환 내부 JSON의 키가 local parser 계약과 달라 coordinator가 exit 1 / `PROVIDER_PAYLOAD_SCHEMA_INVALID`로 실패했다. 원응답·입력·실행 추적·실패 command/stderr/exit를 보존했으며 재추출하거나 첫 실행을 성공으로 소급하지 않았다.

기본 수리 2/2 이후 Astra Max의 두 callsite 예외와 별도 `OFFLINE_SCHEMA_RECOVERY` 감사를 적용했다. 원래 5개 variant claim의 pairing·reason·citation을 그대로 복사하고, field alias·local ID·`openQuestions:[]`의 adapter 전용 구조 기본값만 명시적으로 기록했다. mapper는 원문 의미를 판정하지 않았다. 중단 사이 CLI가 갱신돼 원 adjudicator CLI와 실제 reviewer CLI를 각각의 immutable attempt에 결속했으며 같은 실행 파일이라고 주장하지 않는다. repair1의 exact raw source가 보존되지 않은 결손은 `repair1-preservation-gap.md`에 기록했고 다른 원 실패·검수·probe 로그와 이후 동결 바이트는 보존했다.

최종 mapper SHA-256 `e3065d8553531a86afaaf9e2595f0286ff9576f078f66aee3675e292643d3718`, continuation `a6c38f7924c7496104830efb7a6f8d299240e1390723009344b3dd6a69f2bd12`를 독립 Sol engineering review로 수납했다. 격리 simulation은 map/review/finalize exit 0, 금지 모드와 중복 실행 차단, mixed CLI 결속과 변조 차단을 확인했다. 이 모의 실행은 실제 원문 검토나 실제 store 기록으로 세지 않는다. 실제 offline mapping·독립 reviewer·finalize는 각각 child exit 0/stderr 0이다.

독립 원문 reviewer는 5/5 그룹을 `SUPPORTED`로 판정했다. 보수적 분모는 5개 표현 차이 그룹 × 10개 발생 항목이며, 지원 5그룹/10발생, 기각 0, 미해결 0, correction treatment 0이다. 이 판정은 지정된 차이만 다루며 이전 텍스트 대응 3개, 전체 inventory 완전성이나 수학적 독립성의 증명이 아니다. 첫 trace는 682행·matching usable item 4개·terminal 1개, reviewer trace는 747행·item 4개·terminal 1개이며 관측된 도구 활동은 각각 0이다. 로컬 입력 구성과 실제 ref를 확인했으나 서버의 입력 SHA 확인이나 OS 강제 격리 증거를 주장하지 않는다.

기존 A3-2 workRoot에 새 `SOURCE_INVENTORY_RESOLUTION` 1개와 `TARGETED_SOURCE_REVIEW_SIDECAR` 1개를 추가했다. v1 구조 기록의 `NOT_ADJUDICATED`·`SEMANTIC_ADJUDICATION_NOT_RUN` 및 원 비교기의 debt를 유지하고, 별도 sidecar가 실제 `TARGETED_SOURCE_REVIEW_COMPLETED`를 기록한다. 두 결과의 `productionAuthorized`, `acceptedFactsProduced`, `acceptanceVerified`는 모두 false다. 원 protected 31파일, accepted parent 13파일과 이전 unresolved record는 byte-identical이다.

실제 resolution envelope SHA-256 `fdb6d0fcb1c8d0f5d19e3518ce9fec35c77b22f1c46f33bec3c3e8b5870a2d42`, sidecar `9d9cf33d96446211c7b435a0e9376772da44d797be1579c123397494d2e405ab`. 원문 제안·validation·envelope·sidecar와 두 manifest는 실제 store에서 재독했다. 상세 경로·refs·raw 로그는 `.tmp/archive/svg-engine-development-20261015/A3-3-2/`의 `root-final-technical-readback.json`, `actual/`, `offline-recovery/`, `audit/`, `review/`에 결속한다. 실제 실행 없이 PASS를 붙이거나 실패 gate를 약화하지 않았다.

최종 독립 기술 수납은 `review/ACCEPT_A3_3_2-technical-receipt-v1.json`(7,569 bytes, SHA-256 `81a812effe00309058f8a95a7507e41668bbb36b90523c5406d50d8f9ca11663`)의 `ACCEPT_A3_3_2`다. engineering review는 원문 의미를 재판정하지 않았고, 실제 원문 세션의 결과와 transport·freeze·store 결속을 수납했다.

다음 제안 단위는 **A3-3-3: provider 호출 없는 receipt 결속기**다. 수납된 실제 불변 ref와 coverage를 읽는 opt-in 모듈·표적 검사·짧은 사용법의 3파일로 한정하고, 기존 coordinator를 복제하거나 source 재추출·semantic authority 자동 승격을 하지 않는다. 착수 시 정확한 입력·종료 조건을 다시 작은 packet으로 고정한다. 이번 A3-3-2는 engine qualification/ACTIVE·SVG 렌더·학생 Consumer 연결·main/push/배포를 실행하지 않았다.

### A3-3-3 착수 — 2026-10-18

`a430d5928df166760ac2e8c5e0d998c6334a5268`에서 신규 `source-inventory-review-receipt-v1.mjs`·표적 test·짧은 사용법의 3파일을 고정했다. API는 `verifySourceInventoryReviewReceipt({root,resolutionRef,sidecarRef})`이고, 기존 native stage 및 v1 proposal/source 검증을 재사용해 읽기만 수행한다. 실제 frozen reviewer 원응답과 citation·그룹·treatment·발생 항목을 연결하고 sidecar 집계를 다시 계산한다. 기존 producer의 그룹/개별 occurrence 규칙을 구분하며 기록된 support를 새 수학 판정으로 승격하지 않는다. transport와 offline lineage는 `BOUND_NOT_REAUDITED`, `acceptanceVerified:false`를 유지한다.

Packet `.tmp/archive/svg-engine-development-20261015/A3-3-3/task.md`(11,032 bytes, SHA-256 `53c2a5ac42aae90cad129cea556c6fe66862ea8db85780731d48e2ff84c344fe`)은 별도 Sol `PACKET_OK`를 받았다. 직전 accepted run·원본·관련 코드의 200개 ref를 보호 기준선으로 동결했다. 테스트는 tracked 입력으로 생성한 격리 모의 fixture를 사용하며 과거 실제 run에 의존하거나 provider를 재호출하지 않는다. 코드 수납 뒤 실제 두 ref에 read-only 검사를 한 번 적용하고 로컬 커밋에서 종료한다. 이 착수 기록은 구현·검사 완료가 아니다.

### A3-3-3 완료 수납 — 2026-10-18

사용자 모델 지시를 바로잡아 하위 구현자는 **Luna High**, 최종 독립 검토자는 **Luna XHigh**로 진행했다. 현재 task의 역할 배치도 이에 맞췄다. 초기 Sol 배정·검사 기록을 Luna 실행으로 바꾸어 적지 않았으며, 중단 전 비-Luna 검사 로그와 원 packet은 이력으로 보존했다. 기존 세션이 유지되지 않은 재개 시에도 코드·실패 증거와 수리 회차를 이어받고 예산을 재설정하지 않았다.

읽기 전용 `verifySourceInventoryReviewReceipt({root,resolutionRef,sidecarRef})`의 3파일을 구현했다. 기존 v1 validator와 native store를 재사용해 현재 source/registry/image/code 및 원문 제안·동결 reviewer 원응답·citation·그룹/treatment/occurrence를 연결하고 sidecar 집계를 재계산한다. 실제 producer에서 원입력·동결 복사본·저장 stage의 경로가 다르고 validation JSON의 저장 방식/역할이 달라지는 경우를 구별한다. 바이트 동일성이 필요한 복사본과 동일한 native output ref여야 하는 위치를 나눠 검사한다. 모든 읽은 의존 ref를 마지막에 다시 확인하며, 실제 native 실행 과정이나 원문 의미를 재심사하지 않는다.

최초 12/12 구현자 검사 후 별도 검사 14건에서 5 PASS/9 FAIL을 확인했고, 이를 보존한 채 Luna 검토자가 첫 수리를 확정했다. 첫 수리의 구현자 12/12와 Luna XHigh 독립 14건 중 12 PASS/2 FAIL을 구분한다. 남은 실제 proposal/validation 경로 처리와 late physical-source drift, 직접 관련 envelope/own-key 결속을 두 번째 수리에서 닫았다. 최종 구현자 표적 검사 **14/14**, Luna XHigh의 producer 형식 독립 검사 **16/16**, 각각 실제 child exit 0이다. 테스트의 변경 주입 hook 교정은 검토용 fixture 수정으로 별도 기록했고, 원 실패 run을 PASS로 바꾸지 않았다.

최종 raw SHA-256:
- module `47ae813667569b95b77209391fb438da7d6d5baeaec92f7108b7ab451d4646c7`
- test `73738bf4d7e90e1bab10d0e7556de5af51256b278507e88264869b08dd552ce1`
- usage doc `e25ebc1566df8be1ec5a3c5b2225147b0edae1e31c8d028bad948953e173aee5`

최종 코드 검토 `review/luna-xhigh/FINAL-review-v1.md` SHA-256은 `c36f3f70d111bde4c794c70da6ea91ef69f9462b451372d9dffc04eac3159fbf`다. 원본/검사 출처와 frozen bundle, raw command/stdout/stderr/numeric exit는 A3-3-3의 `repair1/`, `repair2/`, `review/`에 보존한다. 구현 전에 genuine behavioral RED를 실행하지 않은 절차상 결손은 유지하며 test-first 준수를 소급 주장하지 않는다.

코드 수납 후 ROOT가 기존 A3-3-2 resolution/sidecar에 결속기를 **1회** 적용했다. 실제 child exit 0/stderr 0이며 `actual-report.json`(26,625 bytes, SHA-256 `f2424b417ad201166b1ea9da461e56958243f6289372197d370018a5b9cbc5a5`)은 `bindingStatus:VALID`, 5그룹/10발생 SUPPORTED·기각 0·미해결 0·treatment 0을 반환했다. 보고된 bound refs는 89개이며 보호 기준선 200개, 기존 parent 13개와 prior resolution은 그대로다. 이 실행에서는 provider/native 모델 재호출과 새 stage 기록을 하지 않았다. ROOT가 실제 report·code·입력 refs·종료 로그·보호 파일을 다시 읽었다.

Luna XHigh 최종 수납은 `review/luna-xhigh/ACCEPT_A3_3_3-technical-receipt-v1.json`(SHA-256 `55bbc36a51e71983fc02b6c710ee53d425715ea787a6b05ac3b8fbbe9c0fdbc2`)에 결속했다. 검토자가 verifier를 다시 실행하지 않고 저장된 실제 결과·실행 로그·ref를 재독했으며 보호 기준선 200/200 일치를 확인했다. 새 3파일의 working bytes와 Git index bytes도 위 수납 SHA에 각각 정확히 일치한다. `git diff --cached --check`는 모듈 EOF 빈줄 1건으로 exit 1이며, 이를 검사 PASS로 기록하지 않는다.

보고서의 `semanticStatus:NOT_ADJUDICATED`, 원래 v1 debt, `EVIDENCE_DEBT`, `BOUND_NOT_REAUDITED`, `DECLARED_REVIEW_CLAIMS_NOT_REJUDGED`와 production/accepted-facts/acceptance 플래그 false를 유지한다. 결속기의 VALID는 저장된 검토 기록의 일관성이며 semantic authority나 source completeness, 수학적 독립성, 서버 입력 SHA 확인, OS 격리의 증명이 아니다. Archive 학생 runtime·Chrome·SVG 렌더·qualification/ACTIVE·push/main/배포는 이번 단계에서 NOT_RUN이다.

다음 소단계는 원 계획의 **M1: 기존 지원 capability 1개에서 parameter 변경과 수학 dependency 재계산 연결**이다. 착수할 때 정확한 capability·허용 파일·정상/오류 분모·종료 조건을 다시 고정하며, 이 결속 결과만으로 production 입력의 권한을 승격하지 않는다.

이번 로컬 수납을 push·main 병합·배포 완료로 보고하지 않는다.

### 이력 재작성 후 새 clone 이전 — 2026-10-19

ROOT를 Claude Code(Opus 5.5)로 이어받았다. 최신 AGENTS.md·`tools/git-history-rewrite-policy.v1.json`·`docs/operations/Git_Footprint_and_Evidence_Retention_v1.md`에 따라 rewritten `main` `100839e4370e205df061d3d4aed91131068b6eb5`에서 새 clone(`core.autocrlf=false`)과 branch `claude/svg-engine-m1-20261019`을 만들었다. 정책 baseline `82eb90fb…`는 조상이고 거부된 옛 frontier `24a178c0…`는 조상이 아니다. 기존 D/C checkout은 변경하지 않았다.

A1~A3-3-3 수납 commit 7개는 옛 graph 객체를 fetch하지 않고 `git format-patch` → `git am --keep-cr`로만 회수했다(R0). 변경 20개 경로의 blob이 옛 `693033602`과 20/20 일치하고 변경 경로 집합도 같다. 완료 단계의 테스트와 A3 실제 실행은 다시 돌리지 않았다. 이전 `.tmp` 증거는 D에 그대로 있다.

사용자 지시(2026-10-19)로 하위 에이전트는 Luna/codex CLI가 아니라 Claude Code 내부 하위 에이전트 Sonnet으로 바꿨다. 구현자와 독립 검토자는 서로 다른 세션이다. 이전 Luna/Sol 실행 기록은 이력으로 보존하며 바꿔 적지 않는다. pinned 런타임은 기존 `setup-spikes.mjs`로 새로 설치했고(exit 0), 기존 construction 회귀 기준선은 7/7이었다.

### M1 완료 수납 — 2026-10-19

대상은 `construction-spike-v1` 1개다. 동결 packet v2는 `.tmp/archive/svg-engine-development-20261015/M1/task.md`(15,098 bytes, SHA-256 `2444f370a8651816c9e9a92930c03a9da969285eb1b77884a1d0c454399ca7e1`)이며, v1(`9ada23f5…`)과는 모델 배정만 다르다.

신규 3파일 `construction-parameters-v1.{mjs,md}`·`tests/construction-parameters-v1.test.mjs`를 구현했다. API는 다음 둘이다.
- `applyConstructionParameters({baseGraph,parameterSpec,values})`: 동기 순수 함수
- `recomputeConstructionParameters({...})`: async

동작:
- 선언한 리터럴 slot만 치환한다. 허용 대상은 `SOURCE_POINT` 좌표, `NORMALIZATION_AXIS.length`, `CIRCLE_CENTER_RADIUS.radius`, `DISTANCE_EQUALS`/`MIDPOINT_RATIO`의 expected다.
- 기존 SymPy worker로 base와 derived를 전체 재실행하고 기존 Cindy 관측기를 적용한다.
- 영향 폐포는 엔진 transcript의 `dependencies`로 계산하고, 영향받지 않은 노드 출력의 불변을 확인한다.
- 엔진 ERROR는 `MATH_INVALID`, Cindy 범위 밖은 `UNSUPPORTED_NUMERIC_SCOPE`, worker 실패는 `WORKER_ERROR`로 분리한다.
- 관측값을 expected에 되쓰지 않는다. 결과는 항상 `productionAuthorized:false`, `qualification:'NOT_RUN'`이다.
- 기존 엔진 파일은 바뀌지 않았다.

검사 결과:
- 구현자(Sonnet): genuine RED exit 1(모듈 부재)을 구현 전에 기록했다. 이후 신규 22/22 exit 0, 회귀 `construction-v1-operations` 7/7 exit 0.
- 별도 Sonnet 검토자: 직접 재실행 22/22·7/7 exit 0, 독립 probe 약 120건. 결과는 `ACCEPT_M1`(`review/review-v1.md` SHA-256 `1a859c60…`).
- N1(P.x 5→6)의 영향 노드 7개는 ROOT 수계산과 일치했다(새 접점 x=2/3).

명세 이탈 1건: E3의 "P→O → `MATH_INVALID`"는 기존 엔진 결함 때문에 그대로 충족할 수 없었다. `construction.py` MIDPOINT의 퇴화 `Segment.midpoint`가 bound method가 되어 worker가 `AttributeError`로 죽기 때문이다. 모듈은 이를 `WORKER_ERROR`로 분리했고 MATH_INVALID나 PASS로 재해석하지 않았다. 퇴화 축은 A→O(`DEGENERATE_CIRCLE_RADIUS`)로 확인했다. 엔진 수정은 사용자 지시로 별도 단계 M1-E에서 한다.

문서 수리 1회: Cindy envelope 설명의 사실 오류를 고쳤다(.md만 변경, 코드·test 바이트 불변). 같은 검토자가 `ACCEPT_M1` 유지로 판정했다(`review/review-v2-doc.md` SHA-256 `3b481a43…`). 남은 비차단 표현 1건(상쇄 규칙)은 같은 파일을 다시 고치는 M1-E에 포함한다.

최종 raw SHA-256:
- module `e6b13e971a5c3718dc501fea80b1e836a156a9ab38df0fc242306bcbd4d6297e`
- test `19b22814e54609fdcaaa7f0353d613bd6dbef84682ae0f939bf1ada575f712ee`
- usage doc `bbc6085422f3fd5192d5333033c5f4e6226be08937af4ff99d343ef6c91d060e`

레이아웃·SVG·렌더·Archive·Chrome·qualification·ACTIVE·TWIN 템플릿·전체 테스트 스위트·push/main/배포는 NOT_RUN 또는 범위 밖이다.

### M1-E 엔진 MIDPOINT 결함 수정 — 2026-10-19

사용자 지시로 M1 커밋 뒤 별도 단계로 진행했다. packet은 `.tmp/archive/svg-engine-development-20261015/M1-E/task.md`(SHA-256 `b76004b075209d30b26a8671d80702bebfe037e309051ed333ba58df2b6858e0`), 기준 commit은 `d6b8fc27c`다.

결함: `construction.py` MIDPOINT의 `S.Segment(*a).midpoint`는 두 점이 일치하면 SymPy가 Point를 돌려주어 bound method가 된다. 증상은 셋이었다.
- status `OK`인데 `mid`가 출력에서 조용히 누락됨
- SymPy TypeError 원문이 오류 코드로 나감
- 잡히지 않은 `AttributeError`로 worker가 죽음

수정은 두 줄이다.
- MIDPOINT를 `a[0].midpoint(a[1])`로 바꿨다. pinned SymPy 1.14.0의 `Segment.midpoint`가 이 호출을 그대로 쓰므로, 서로 다른 두 점에서는 exact 출력이 같다.
- 출력 루프 끝에 `UNEMITTED_NODE_OUTPUT:<nodeId>` fail-closed guard를 넣었다.

`worker.py`는 넓히지 않았다. 함께 바꾼 파일은 다음과 같다.
- `construction-v1-operations.test.mjs`: D1~D4 회귀 사례 추가(+45/−0)
- M1 test: E3를 P→O = `MATH_INVALID`+`DEGENERATE_CIRCLE_RADIUS`로 복원
- usage doc: MIDPOINT 문장과 Cindy 상쇄 규칙 정확화

검사 결과:
- 구현자(Sonnet, 새 세션): 수정 전 기준선은 회귀 5파일 모두 exit 0(7/7·7/7·22/22·10/10·14/14). 수정 전 엔진의 RED는 operations 3건·parameters 1건 실패(exit 1). 이후 GREEN, 수정 후 회귀 5파일 exit 0. D4(무리수 중점)는 수정 전후 바이트 동일.
- 별도 Sonnet 검토자: 서로 다른 두 점 5,100쌍에서 두 midpoint가 불일치 0건. 실제 테스트가 보낸 construction 요청 101개를 수정 전 엔진 사본과 대조해 97개가 바이트 동일했고, 달라진 4개는 의도한 D1·D2·D3·E3뿐이었다. guard는 정상 요청에서 발동 0건, 비정상 값 주입 시 동작. 동결본 기준 RED를 독립 재현했고, 직접 실행 11/11·22/22·7/7 exit 0. 결과는 `ACCEPT_M1E`(`review/review-v1.md` SHA-256 `8642d567…`).

영향 기록: `construction.py` 바이트 변경으로 다음 지문이 바뀐다.
- `fingerprint.mjs`의 capability 지문과 `mathFingerprint`(`run.mjs`·`phase2.mjs`의 MATH stage key)
- `qualification.mjs`의 `PHASE5_CODE_PATHS` 지문(바뀐 `construction-v1-operations.test.mjs`도 포함)
- `source-policy.mjs`의 `sourcePolicyFingerprint`

이전에 동결한 construction 결과의 replay·qualification 증거는 설계대로 새 계산·blind/compare를 요구받으며, 이를 우회하지 않았다. A3-3-3 결속기를 기존 실제 기록에 다시 적용할 때의 drift 여부는 A3-2 workRoot를 검색하지 않아 `EVIDENCE_DEBT`다. A3 재실행은 하지 않았다.

guard에 도달하는 실제 입력은 수정 후 엔진에서 만들 수 없어 저장소 회귀 테스트가 없다. 증거용 fault injection으로만 확인했다. 브라우저·provider 테스트, Python `test_*.py`, 전체 `node --test`, `--resume` replay는 NOT_RUN이다.

### L1 construction 실측 출판 단일 경로 — 2026-10-19~20

packet은 `.tmp/archive/svg-engine-development-20261015/L1/task.md`다.
- v2: SHA-256 `daf4cfe82ef2562b4676dfd2c017fb9f2ede5e1fdf100b0f0cd0c90220696887`
- v1: `7bccf2f1…`. v1의 API가 identity를 받지 않은 ROOT 설계 결함(D1)을 v2에서 바로잡았다.
- 기준 commit: `d0bd40de6`

신규 3파일 `construction-candidate-svg-v1.{mjs,md}`·`tests/construction-candidate-svg-v1.test.mjs`를 구현했다. API는 `composeConstructionCandidate({plan, model, identity, typographyPolicy, worker, browser})`다.

입력은 `construction-spike-v1` plan과 그 SymPy snapshot이다. 기존 부품만 다음 순서로 한 경로에 엮는다.
1. `specFor` → worker `prepare`
2. `typesetter` fragment
3. Chrome fragment 실측
4. worker `build`
5. 정적 primitive observer
6. 정책 표시 크기 렌더 layout 분석

동작 계약:
- identity는 `assetIdentity()` 객체 전체를 재계산해 대조한다. fragment namespace는 runPhase2와 같은 규칙이다.
- 정적 감사와 렌더 분석은 같은 SVG 바이트에 적용한다. observer는 항상 실제 `pythonWorker`로 실행한다.
- 다음은 조용히 수용하지 않는다: model-plan 불일치, layout unresolved/suppressed, 결속되지 않은 layout repair, 정적·렌더 실패.
- typography 정책은 상류에서 받는다(`CALLER_SUPPLIED_UNVERIFIED`). size 선택·실제 Archive·독립 visual review는 NOT_RUN이다. `phase2.mjs`와 기존 파일은 바뀌지 않았다.

검사 결과:
- 구현자(Sonnet, 새 세션):
  - 회귀 5파일 기준선은 모두 exit 0이었다.
  - 모듈 초안을 테스트보다 먼저 썼다. RED는 초안을 치운 상태에서 돌렸고(exit 1), test-first 작성 순서는 아니었다.
  - v1은 20/20, 수리 1회차 RED 25건 실패(exit 1) 뒤 27/27이었다. 회귀 5파일은 exit 0, 변이 27종은 모두 검출됐다.
- 별도 Sonnet 검토자:
  - v1 판정은 `REPAIR_REQUIRED`(D1)였다. 검토 중 API 사용량 한도로 끊겼고 같은 세션으로 재개했다.
  - v2 판정은 `ACCEPT_L1`(`review/review-v2.md` SHA-256 `6dfeabc9…`)이다. runPhase2 규칙 재현과 SVG·fragment 14개·witness·정적·렌더 hash가 바이트 동일하다.
  - 변이 19종 중 18종을 검출했다. 남은 1종은 도달 불가가 된 방어 코드다. 직접 실행 27/27·11/11, exit 0.
- M1 연결(C2): 파라미터를 바꾼 derived snapshot의 `objectSha`가 M1 lineage와 같았다. 다시 그린 SVG와 바뀐 좌표 label fragment는 base와 다르다. 같은 입력 2회의 SVG 바이트는 동일하다.

남은 비차단 사항:
- E6 실제 입력 사례는 Chrome 1/64px 레이아웃 snap에 의존한다(환경 의존). 결정적 증명은 주입 사례가 맡는다.
- v2 packet의 Cindy 접두 규칙이 좁아 `DUPLICATE_NODE` 등 일부 도메인 코드가 예외로 전파된다(N1). SymPy가 받아들인 model로는 도달하지 못한다.
- 접근자 기반 identity 객체에 대한 스냅샷 복사가 없다(N2).
- `displayScale` 상한이 없다.

최종 raw SHA-256:
- module `cdda2fafe7b7131a105c0eef42b40d485fa49ec0d822a84aa4db1899a185312e`
- test `8a6607d49eff751e6cc0ff03b2b2de4d52e307fece7b2370a08112c12a104f89`
- usage doc `5f20e5fc5c7365aa8e4cba5cb32af284fd207c975f3da35e3fa9244688bd8843`

실제 Archive preflight·size class 선택·layout repair 결속·`mode=sol` 캡처·독립 visual review·qualification·push/main/배포는 NOT_RUN 또는 범위 밖이다.

### R1-a 실제 Archive 실측·캡처 같은 바이트 결속 — 2026-10-20

원 계획 R1을 두 단위로 나눴다.
- R1-a: 실제 Archive 쪽
- R1-b: 독립 AI 역관측. 관측 세션 설계가 따로 필요하다.

packet은 `.tmp/archive/svg-engine-development-20261015/R1-a/task.md`다.
- v2: SHA-256 `428c208f1911c0b29775ce05a3be3106f0d3c6def2ef67c33a81133aa28ac231`
- v1: `10c80289…`
- 기준 commit: `291529293`

신규 3파일 `construction-archive-capture-v1.{mjs,md}`·`tests/construction-archive-capture-v1.test.mjs`에 두 함수를 뒀다.
- `measureArchiveTypographyPolicy`: 기존 `measureArchiveDisplayEnvelope`(LOCAL_ONLY)로 실제 `mode=sol` 크기를 재고, 기존 `requestedProfileTypographyPolicy`로 정책을 만든다. 출처는 `ARCHIVE_MEASURED`다.
- `captureArchiveCandidate`:
  1. L1 `COMPOSED` 결과의 SVG로 후보 bank를 만든다. 보호 parity는 `solutionImage` 3필드만 바뀌는 것이다.
  2. 기존 `recordArchiveEvidence`(LOCAL_ONLY)로 실제 캡처한다.
  3. 다음이 같은 revision인지 결속한다.
     - Archive가 받은 asset 응답 SHA = L1 svgSha256
     - Archive가 받은 bank 응답 SHA = 후보 bank SHA
     - 렌더된 크기 class
     - 실제 이미지 배율 = 정책 배율(1 CSS px)
     - 정책 sha = L1 lineage

결과 플래그: L1의 `CALLER_SUPPLIED_UNVERIFIED` 정책이 실제 실측으로 닫힌다. `uidAuthority:'STRUCTURAL_ONLY'`이고, 역관측·qualification·publication은 NOT_RUN이다. 기존 도구·exam·asset은 바뀌지 않았다.

검사 결과:
- 구현자(Sonnet, 새 세션):
  - 회귀 4파일 기준선 exit 0.
  - 모듈 초안 없이 genuine RED(14 실패, exit 1) → GREEN 14/14.
  - mutation 중 모듈 결함 1건(parity 경로)을 발견해 고쳤다.
- 별도 Sonnet 검토자 v1: `REPAIR_REQUIRED`(B1)였다. 캡처 중 bank 교체가 `ARCHIVE_BOUND`로 통과하는 위조 경로였다.
- 수리 1회차:
  - 수정한 내용: bank 응답 결속, caller hook 결과 표시(`evidenceIntegrity`), SVG 외부 참조·script 사전 거부, 1px 경계 부동소수 여유, 문서 정정.
  - 결과: RED 16 실패(exit 1, 환경 timeout으로 끝난 첫 시도는 보존) → GREEN 17/17. 회귀 4파일 exit 0, mutation 23종.
  - 같은 검토자 v2: `ACCEPT_R1A`(`review/review-v2.md` SHA-256 `b03af1bb…`). B1 재현이 거부되고, 외부 참조 우회 24건이 차단되며, 정상 오거부 0건이다. 직접 실행 17/17 exit 0.
- 수리 2회차: 검토자가 요청한 `.md` 사실 보정 2건(SMIL 미검사 명시, 테스트가 모듈 사본을 변이한다는 거짓 문장 교체)이다. 코드·test 바이트는 v2와 동일하다. 이 문서 diff는 ROOT가 검토자 요청과 대조해 확인했고, 검토자의 재검은 받지 않았다.

실측 결과:
- medium 정책은 174×145, 배율 0.453125, `baseFontPx` 24.9이고, C1의 실제 배율이 정확히 같다.
- medium으로 합성하고 large로 캡처하면 배율 차이 42 CSS px로 거부된다.
- M1 연결(C2): 점 하나를 바꾼 derived도 `ARCHIVE_BOUND`이며 asset 응답 SHA가 다르다.

남은 한계:
- 같은 프로세스의 악의적 호출자·hook에 의한 row 위조는 막지 못한다. 방어선은 R1-b다.
- SVG 필터는 정적이다. `url()`·`@import`·`foreignObject`·`on*`·SMIL은 검사하지 않는다.
- 일부 사유 코드는 mutation으로만 도달했거나 도달하지 않았다.
- 기술 fixture는 실제 기출 25_효천고 1번 원 문항에 수학적으로 무관한 SVG를 붙였고, 의미 일치는 주장하지 않는다.

최종 raw SHA-256:
- module `c3535fd1d1bb2b9978000a95ba7059d7dd751bdedd22e6121d9a7d67dd8c5651`
- test `d9a50191052903efccb07be28af4ed15044fe9e10b0b67115064c2ba92be5809`
- usage doc `ad7d13e7b7c641a37f10783e9ad70edaefc6afc740de377afef2c48a3cf577ff`

다음은 R1-b(동일 캡처에 대한 독립 역관측 receipt)다. push·main·배포는 하지 않았다.

### R1-b 도구 중립 독립 역관측 — 2026-10-20

사용자 원칙: 역관측자는 Codex·Claude Code·Antigravity 누구나 맡을 수 있는 역할이고, 지금은 Claude Code가 맡는다.

packet은 `.tmp/archive/svg-engine-development-20261015/R1-b/task.md`(SHA-256 `ab085a71c6ea5077fe036fc355b407ba1e39559fe300fdd21a8b39fd7226dc25`)이고, 기준 commit은 `e28249e44`다.

신규 3파일 `archive-inverse-observation-v1.{mjs,md}`·`tests/archive-inverse-observation-v1.test.mjs`에 세 함수를 뒀다.
- `prepareInverseObservationPacket`:
  - R1-a `ARCHIVE_BOUND` 결과(hook 없음)로 일반 파일 packet을 만든다.
  - packet 구성: 캡처 PNG 2장, 모듈 상수 중립 지시문, schema, 해시만 담은 manifest. plan·기대값·판정·SVG 소스는 넣지 않는다.
- `freezeInverseObservation`: 관측 기록 원바이트를 배타 생성으로 동결한다.
- `bindInverseObservation`:
  - packet 무결성과 동결을 확인한다.
  - 관측 기록 schema와 `inputsRead`를 확인한다.
  - plan·model·identity·spec·L1 SVG 해시를 결속한다.
  - 같은 revision의 `specFor`/`prepare` 표시 기대값과 출현 횟수 기준으로 정확히 비교한다. 정규화는 NFC·공백·마이너스만 한다.

결과 판정과 플래그:
- 판정은 `OBSERVED_CONSISTENT` 또는 `OBSERVED_DISCREPANCY`다.
- 관측자 정체는 기록 안의 메타데이터다. 판정은 agentKind에 의존하지 않는다.
- 수치 정확성은 primitive observer 몫(`OUT_OF_SCOPE_PRIMITIVE_OBSERVER`)이다.
- 격리는 `INSTRUCTED_NOT_ENFORCED`로 기록한다.

검사 결과:
- 구현자(Sonnet, 새 세션):
  - 회귀 2파일 기준선 exit 0.
  - 모듈 초안 없이 genuine RED(19·20건 실패, exit 1) → GREEN 20/20. 중간 실패 1회는 보존했다.
  - 회귀 2파일 exit 0, mutation 33종 검출.
- 별도 Sonnet 검토자: `ACCEPT_R1B`(`review/review-v1.md` SHA-256 `e42bd889…`).
  - 지시문·schema는 서로 다른 capture에서도 바이트 동일하다. 수식 표기 규약은 정당한 전사 규약이며 기대값 누출이 아니다.
  - 동결본에서 BUILDER mutation 33종을 재실행해 33/33 검출했다. 추가 11종 중 2종은 테스트 공백(코드는 정상)이다.
  - 직접 실행 20/20, exit 0.
- 비차단 사항: manifest까지 재해시한 packet 재작성은 packet 밖에 보관한 `packetSha256`과 대조해야 잡힌다. 실제 실행에서 ROOT가 이 대조를 했다.

실제 역관측 1회(ROOT 실행, 결과 그대로):
- 준비:
  - 실제 measure → L1 → Archive 캡처를 1건 만들었다. 결과는 `ARCHIVE_BOUND`, asset 응답 SHA = L1 SVG SHA `112601c5…`, 배율 0.453125였다.
  - packet은 저장소 밖 scratchpad 격리 디렉터리에 만들었다(`packetSha256` `e4a69609…`, ROOT가 packet 밖에 보관).
- 관측: 새 Sonnet 관측자 세션(`claude-sonnet-5-5`, agent `a1861de7d09d6cb9a`)에는 packet 경로만 줬다.
  - `inputsRead`는 packet 5파일이다.
  - ROOT가 즉시 동결했다(freeze SHA `f13dc287…`). receipt의 packet·freeze SHA는 ROOT 보관값과 모두 일치했다.
- 판정은 **`OBSERVED_DISCREPANCY`**다(receipt SHA-256 `03fcbad8…`).
  - label 14개는 모두 일치했다.
  - 선분 AB·AC가 missing이다. A=(0,0), B=(6,0), C=(0,3)이라 두 선분이 좌표축과 정확히 겹쳐 그려지고, 관측자는 축과 구분해 선분으로 읽지 못했다.
  - 읽기 문제로 작은 글자, C·A label의 붐빔, 점 표식 미식별을 보고했다.
  - ROOT가 동결 후 캡처를 직접 열어 이 보고가 정확함을 확인했다. 재관측해서 일치를 선별하지 않았다.
- 의미: 축 위에 놓인 표시 선분은 학생 화면에서 선분으로 전달되지 않는다. 손으로 만든 테스트 fixture가 놓친 실제 시각 의미 결함을 역관측이 잡았다. 수정(선분 스타일·plan 지침)은 후속 범위다.

최종 raw SHA-256:
- module `31f91f36f316e3a43a136c242abec0ede9bbf8f9ffff6e131a38a3092dd7cdac`
- test `0f3c8138d40c5f1b40f43c7bf6fd6e4aa671bcbbbb20fcfd506819034366403b`
- usage doc `6e186b7f734d307b97514686ce69da7054188326375530c422a4bd8573e1ca3a`

이로써 R1(동일 final SVG·asset response·Actual Archive·독립 역관측 receipt 연결)은 이 기술 fixture 범위에서 연결됐다. qualification·publication·다수 문항·push/main/배포는 NOT_RUN이다.

### AX1 좌표축과 겹친 표시 선분의 시각 구분 — 2026-10-20

R1-b 실제 역관측이 찾은 결함을 사용자 지시로 고쳤다. packet은 `.tmp/archive/svg-engine-development-20261015/AX1/task.md`다.
- v2: SHA-256 `da49129087b386870ad9f98cec722108d8be780041aa44ba43f98308b77df8aa`
- v1: `2e2cdabf…`
- 기준 commit: `4e49c0dc5`

원인: 좌표축(`axis` 1.2)과 표시 선분(`secondaryShape` 1.6)이 같은 색·같은 layer 30으로 그려졌다. 실제 medium 배율 0.453125에서는 각각 0.54·0.72 CSS px라 겹치면 구분되지 않았다.

수정은 표적 규칙이다.
- `engine.py`: SEGMENT 분기 1줄 → 6줄. 표시된 축과 두 끝점이 화면 0.5 px 이내로 겹치는 SEGMENT만 새 토큰 `axisOverlapShape`(3.2), layer 35로 그리고, prepare primitive에 `axisOverlap:'x'|'y'`를 남긴다.
- `style_tokens.json`: 키 1개 추가.
- 테스트·문서: 신규 `tests/axis-overlap-segment.test.mjs`, `PUBLICATION_PROFILE.md` 1단락.
- 하지 않은 것: 축 색이나 전체 선분 굵기는 바꾸지 않았다. composer의 고정 whitelist가 `data-axis-overlap`을 내보내지 못해, ROOT 결정(§8)으로 composer를 고치지 않고 prepare 키로 대신했다.

검사 결과:
- 구현자(Sonnet, 새 세션):
  - 수정 전 엔진에서 genuine RED(7 실패, exit 1) → GREEN 10/10.
  - 실제 medium 렌더: 겹친 선분 1.45 CSS px, 축 0.54 CSS px. 정적·렌더 감사 PASS.
  - 수정 전 트리와 13개 입력을 비교했다. 비겹침 11개는 전 필드 해시가 동일하고, 겹침 그림은 해당 선분 그룹만 바뀌었다.
  - 기존 JS 회귀 5파일은 전후 동일하고, Python 221/221.
- 별도 Sonnet 검토자: `ACCEPT_AX1`(`review/review-v1.md` SHA-256 `9305b30d…`).
  - 경계 probe 81건에서 오탐·누락 0. 원점이 viewport 밖일 때도 판정 기준이 실제 축 위치와 같다.
  - 테스트의 수정 전 해시 상수 117개가 수정 전 엔진 실행값과 일치한다.
  - 신규 test 10/10, exit 0.
  - 검토 범위는 사용자 지시로 도중에 줄였다. 일부 긴 회귀는 `NOT_RUN_REVIEWER`(BUILDER raw로 대신)다.
  - 검토자가 축소 지시 전에 시작했다가 중단한 무관한 node test 부분 실행(145 ok/87 not ok, exit 없음, 기준선 미대조)은 AX1과의 관련을 판단하지 않은 채 기록만 한다.

실제 재관측 1회(같은 그림, 새 capture, 새 Sonnet 관측자 `a1346a1e39a5da47b`, 검토와 병렬로 진행, 결과 그대로):
- capture는 `ARCHIVE_BOUND`다(L1 SVG SHA `2b43b0a6…`). packet `acd16719…`과 freeze `6ba15508…`은 ROOT 보관값과 모두 일치했다.
- 판정은 여전히 **`OBSERVED_DISCREPANCY`**다(receipt SHA-256 `93fd0202…`). missing은 AB·AC이고, 이전 receipt `03fcbad8…`은 보존한다.
- 차이점: 관측자가 "가로축의 굵은 부분"을 보았다고 기록했다. **선분 가시화 자체는 성공**했다.
- 남은 이유: 원점 A의 점 표식이 medium에서 보이지 않고(점 반지름 약 0.9 CSS px), label A가 원점이 아닌 삼각형 안쪽에 있다. 그래서 굵은 선분의 끝점을 A로 확정하지 못했다.
- ROOT가 동결 후 캡처를 열어 확인했다. 남은 원인은 범위 밖으로 둔 **점 표식 가시성**이며, 다음 작은 단계 후보다.

영향:
- `engine.py`·`style_tokens.json`은 `fingerprint.mjs` `shared` 목록에 있어 모든 capability 지문이 바뀐다.
- 기존 자산은 재생성하지 않았다.
- `ENGINE_VERSION` 문자열은 그대로다(검토자 비차단 관찰).

최종 raw SHA-256:
- engine.py `97e831f1bd0fa3be4bd4c255d6676278bc6155a7ea638e1a508c242910bf3047`
- style_tokens.json `ded7c927b04ad513d2a503791753ecbfae0a0305a46c7d0e7fa4660d9787d8ef`
- test `04132804b0c59149de492a0c87e2f734f3e62a155ed74608170cf26edf5101e4`
- PUBLICATION_PROFILE.md `f0fc65ee28f6ac08889d858c66ff8738163261c458b756ea52a3c6b0b8c12ed7`

### AX2 점 표식 크기 — 2026-10-20 (경량 절차, ROOT 직접)

검증 크기 규칙에 따라 하위 구현·검토 세션 없이 ROOT가 직접 수정하고 diff를 확인했다.

- **수정:** `style_tokens.json`의 `point` 2.0→3.2, `criticalPoint` 2.2→3.5만 바꿨다. 이 토큰을 쓰는 곳은 `engine.py` 222행 한 곳뿐이다.
- **원인:** medium 배율 0.453125에서 점 반지름이 약 0.9 CSS px라 보이지 않았다. label A의 배치는 빈 사분면을 고른 정상 결과로 보고 label_layout은 바꾸지 않았다.
- **실행한 검사(직접 영향만):**
  - Python 엔진 테스트 221/221
  - `tests/axis-overlap-segment.test.mjs` 10/10
  - AX1 테스트의 고정 해시는 테스트 머리말 규칙대로 새 기준에서 다시 유도했다. 새 기준은 AX1 이전 engine.py(커밋 `4e49c0dc5`)에 AX2 토큰을 더한 것이고, 그 기준 엔진을 실제로 실행해 값을 얻었다.
- **실제 재관측 1회(결과 그대로):**
  - medium 실측 정책으로 L1을 합성해 `COMPOSED`를 얻었다. 큰 점 때문에 layout이 깨지지 않았다.
  - Archive capture는 `ARCHIVE_BOUND`이고, 새 Sonnet 관측자는 `afcaa35be5a143ef0`이다.
  - 판정은 **`OBSERVED_CONSISTENT`**(receipt SHA-256 `35c318e9…`, missing·unexpected 0)다. packet·freeze SHA는 ROOT 보관값과 일치했다.
  - 관측자는 읽기 문제로 여전히 "점 표식이 이 해상도에서 뚜렷하지 않음", "글자가 작고 붐빔"을 남겼다. 판정을 막지는 않았지만 가독성 과제로 남는다.
- **영향:** `style_tokens.json`은 `fingerprint.mjs` `shared` 목록에 있어 모든 capability 지문이 바뀐다. 모든 그림의 점 표식 바이트가 바뀌고, 기존 자산은 재생성하지 않았다.

### Q1-G construction 기하 6문항 실제 체인 평가 — 2026-10-20 (경량 절차)

사용자 지시로 Q1을 다음과 같이 좁혔다.
- 대상: construction 기하 6문항
- 경로: provider 없는 체인(Claude plan 작성 → L1 → 실제 Archive → 역관측)
- 그래프 4문항은 뒤로 미뤘다.
- 기존 `qualifyVisualEngine`(provider 기반 `runPhase2` 결과 10건 요구)은 쓰지 않았다.

이 평가는 qualification 판정이 아니다.

**roster:** 실제 고1 2학기 중간 기출에서 좌표가 명시되고 그림·기존 해설 이미지가 없는 기하 문항 6개를 골랐다. 저장된 정답·해설을 확인했다.
- 22_강남여고 #1(AC=BC, a=5)
- 25_순천여고 #3(∠A=90° 직각이등변)
- 25_제일고 #10(BC=CA 이등변)
- 25_팔마고 #5(수직이등분선)
- 25_효천고 #1(두 점 거리)
- 20_금당고 #8(세 점 한 직선, a=−1)

plan은 ROOT(Claude)가 원문과 검증 해설로 작성했다.

**크기 규칙:** `runPhase2` 615행과 같다. 원문 좌표 기하이므로 `full`을 쓴다. 1차 실행은 runner가 medium부터 시도해 이 규칙과 어긋났고, 그 결과는 보존한 채 규칙대로 다시 실행했다.

**결과(실행 증거 `.tmp/archive/svg-engine-development-20261015/Q1/`):**

| 문항 | L1 합성 | 실제 Archive | 역관측 |
|---|---|---|---|
| 25_순천여고 #3 | COMPOSED | ARCHIVE_BOUND | **OBSERVED_CONSISTENT** |
| 20_금당고 #8 | COMPOSED | ARCHIVE_BOUND | **OBSERVED_CONSISTENT** |
| 25_효천고 #1 | COMPOSED | ARCHIVE_BOUND | **OBSERVED_CONSISTENT** |
| 22_강남여고 #1 | LAYOUT_INVENTORY_INCOMPLETE(`tick-x-2-label`) | — | — |
| 25_제일고 #10 | LAYOUT_INVENTORY_INCOMPLETE(`tick-x-1-label`) | — | — |
| 25_팔마고 #5 | LAYOUT_INVENTORY_INCOMPLETE | — | — |

- **판정:** 끝까지 통과한 문항은 3/6이며 slice 판정은 `NOT_QUALIFIED`다. 통과한 3건 모두 packet·freeze SHA가 ROOT 보관값과 일치했다.
- **ROOT 오류:** plan 작성 실수 2건은 기록하고 고쳤다.
  - 팔마고: 표시하지 않는 작도점을 직각 표시에 썼다.
  - 효천고: 축 기준점을 원문 점처럼 넣어 표시 의무 오류가 났다. 단순 그림(A, B, 선분 AB)으로 바꿨다.
- **남은 차단 원인:** 남은 3건은 모두 엔진 label layout의 한계다. 점·선분 옆의 눈금 숫자 label이 둘 곳이 없다. AX2 이전 토큰으로 같은 항목을 합성해도 같은 실패가 나서, AX2가 원인이 아님을 확인했다(토큰은 원복 후 diff 0). 다음 작은 수정 후보다.
- **역관측 방식:** Sonnet 관측자 1세션(`adc204fe4528a821c`)이 독립 packet 3개를 차례로 관측했다(116k 토큰). 같은 세션이 3건을 본 사실을 기록한다.

새 모듈과 코드 변경은 없다. qualification·ACTIVE·publication·push/main/배포는 NOT_RUN이다.

### AX3 construction plan의 눈금 지정 + Q1-G 재실행 — 2026-10-20 (경량 절차, ROOT 직접)

원인: 실패 3문항 중 2건(강남여고·제일고)은 **자동 눈금**이 문제였다. 엔진이 범위/5의 nice step으로 고른 눈금 숫자(예: x=4)가 선분이 지나는 자리에 놓여, owner 규칙(눈금 바로 위·아래 16 px 이내) 안에 둘 곳이 없었다. `specFor`는 graph plan에만 `axisTickValues` 지정을 허용하고 construction plan은 무시했다.

수정: `production/phase2.mjs` construction spec의 `displayFacts`에 `...axisTickDisplayFacts(plan)`를 1줄 추가했다. graph와 같은 opt-in 필드이며, 필드가 없는 기존 plan은 spec 바이트가 동일하다. AX1 테스트에 고정된 spec 입력 해시가 그대로임을 확인했다.

실행한 검사(직접 영향만): `construction-v1-operations` 11/11, `axis-overlap-segment` 10/10.

plan 작성(ROOT):
- 실패 3문항은 모든 점에 좌표 label이 있으므로 `axisTickValues:{x:[],y:[]}`로 중복 눈금을 뺐다.
- 팔마고는 눈금을 뺀 뒤에도 M 좌표 label `(1, 1/2)`이 선분 AB와 수직이등분선이 만나는 자리에 갇혔다. 문항은 직선의 방정식을 묻고 M의 좌표는 묻지 않으므로, M은 이름만 표시하도록 plan을 바꿨다.

재실행 결과(실패 3문항만, 같은 크기 규칙 `full`):
- 세 문항 모두 `COMPOSED`·`ARCHIVE_BOUND`·**`OBSERVED_CONSISTENT`**다.
- 관측은 Sonnet 관측자 1세션(`a80f68d36a3df4afc`)이 3 packet을 차례로 했고, packet·freeze SHA는 ROOT 보관값과 일치했다.

**Q1-G 합계: 6/6 문항이 끝까지 통과**했다(L1 합성 → 실제 Archive 결속 → 독립 역관측 일치). 단, 이것은 provider 없는 construction slice의 실측 결과다. 다음은 하지 않았다.
- 기존 `qualifyVisualEngine` 판정(provider `runPhase2` 10건)
- 그래프 4문항, ACTIVE, publication

영향: `phase2.mjs`는 `fingerprint.mjs` `shared` 목록에 있어 모든 capability 지문이 바뀐다. 기존 자산은 재생성하지 않았다.

### Q1 그래프 4문항 확장 — 2026-10-20 (경량 절차, ROOT 직접)

최소 범위는 `polynomial-spike-v1` 이차함수 1개 family다. `HEADER_BAND` 수식 배치만 다루고 runPhase2 633~670행의 수식 패널 합성은 재현하지 않는다.

코드(ROOT 직접 작성·diff 검토):
- `construction-candidate-svg-v1.mjs`(L1)에 그래프 분기를 추가했다. 방식은 runPhase2 604~605·713~716과 같다.
  - model-plan 결속: Cindy 대신 독립 graph observer(`graph-observer-worker.py`)가 model 곡선을 검사한다.
  - 최종 SVG 검사: 정적 primitive 감사와 graph 감사를 모두 거쳐야 한다(`STATIC_GRAPH_AUDIT_FAIL` 신설).
  - `HEADER_BAND`가 아니면 `UNSUPPORTED_CAPABILITY`다.
- `archive-inverse-observation-v1.mjs`(R1-b)는 `FUNCTION_GRAPH`를 관측 범주가 아닌 객체로 처리한다(축과 같은 취급). 곡선의 수식·핵심점 좌표 label은 label 목록으로 비교하고, 곡선의 수치 정확성은 graph observer 몫이다.
- 그래프 plan을 지원하게 되면서 테스트 2건의 대상을 바꿨다.
  - L1 E3: "그래프 plan → 미지원"을 미지원 capability(`rational-spike-v1`)로 바꿨다.
  - R1-b E9: 위조 lineage의 polynomial spec이 이제 매핑되므로 "거짓 일치가 나오지 않음(`OBSERVED_DISCREPANCY`)"을 확인하게 했다. 이 사례를 통한 `UNSUPPORTED_SPEC_OBJECT` 분기 검사는 빠졌다.
- 실행한 검사(직접 영향만, 순차 실행): L1 테스트 27/27, R1-b 테스트 20/20. 두 파일을 병렬로 돌렸을 때 나온 5건의 실패는 python worker 10초 timeout·Archive preflight 등 부하 문제였고, 순차 실행에서 재현되지 않았다.

roster(실제 기출, 단일 곡선, 정의역 실수 전체, 정답 대조 완료):
- 24_제일고 기말 #1: y=x²+4x+4, k=4
- 25_강남여고 기말c #5: y=x²−2x+10, 최솟값 9
- 26_효천고 기말 #4: y=x²−3x−10, 두 x절편 −2·5
- 21_복성고 중간 #7: y=−x²+4x+5, 최댓값 9

graph plan은 ROOT가 작성했다. `frame_graph`로 framing한 plan을 그대로 L1·R1-a·R1-b에 넘겼고, 크기 규칙은 runPhase2와 같다(`HEADER_BAND`이면 `full`).

진행 경과:
1. 1차 실행에서는 4건 모두 **자동 눈금** 문제로 멈췄다(눈금 label 둘 곳 없음 2건, 렌더 거리 위반 2건).
2. 핵심점이 모두 좌표 label을 가지므로 `axisTickValues:{x:[],y:[]}`로 다시 실행했다.
3. 그 결과 3건이 `COMPOSED`·`ARCHIVE_BOUND`·**`OBSERVED_CONSISTENT`**가 됐다. 관측은 Sonnet 관측자 1세션(`ad3e41c01be474bd9`)이 3 packet을 맡았고, packet·freeze SHA는 ROOT 보관값과 일치했다.

**그래프 그룹 결과: 3/4.** 25_강남여고 #5는 graph observer가 `UNCLIPPED_CURVE`로 거부했다.
- `frame_graph`는 입력 정의역·뷰포트와 관계없이 정의역 [−2.857, 4.857]·뷰포트 위쪽 21.94를 출력한다.
- 그런데 x=4.857에서 곡선값은 약 23.9라, framing된 곡선이 자기 뷰포트를 넘는다.
- 원인은 꼭짓점이 x축에서 멀리 떨어진 포물선에서 생기는 **엔진 framing 결함**이다. plan으로는 우회되지 않았고, 다음 작은 수정 후보다.

**Q1 전체(construction 6 + graph 4): 9/10이 끝까지 통과했다.** provider 없는 slice의 실측 결과이며, 기존 `qualifyVisualEngine` 판정·ACTIVE·publication·push/main/배포는 NOT_RUN이다.

### AX4 이차함수 framing 높이 결함 — 2026-10-20 (경량 절차, ROOT 직접)

**원인:** `production/graph_framing.py`의 `fit_overview`(이차함수)는 정의역을 `h ± 1.15·radius`로 그리면서 세로 높이 `rise`는 `radius`만으로 계산했다. 그래서 그려진 양 끝의 곡선값 `|a|·(1.15·radius)²`이 `ymax`를 넘을 수 있었다. 꼭짓점이 x축에서 멀리 떨어진 25_강남여고 #5에서는 곡선값이 약 23.9, `ymax`가 21.94였고, graph observer가 `UNCLIPPED_CURVE`로 거부했다.

**수정:** `rise`를 실제로 그리는 반폭 `max(h−lo, hi−h)`로 계산하도록 1줄을 바꾸고 주석 1줄을 더했다. 이 규칙은 실수 전체 분기와 검토된 정의역 분기에 모두 적용된다. 영향 범위는 이차함수 overview framing뿐이고, 다른 family는 각자의 함수를 쓰므로 바뀌지 않았다.

**실행한 검사(직접 영향만):**
- `test_graph_overview.py` 7/7
- Q1 이차함수 4문항 모두 frame → model → graph observer PASS(Chrome 없이)

**재실행:** 25_강남여고 #5만 다시 돌렸다.
- framing된 뷰포트 위쪽은 26.11이다.
- 결과는 `COMPOSED`·`ARCHIVE_BOUND`·**`OBSERVED_CONSISTENT`**다(새 관측자 `a070ee78edc6b2c59`). packet·freeze SHA는 ROOT 보관값과 일치했다.

**영향:** 모든 이차함수 overview의 세로 범위가 넓어진다(곡선이 잘리지 않음). `graph_framing.py`는 polynomial 등 graph capability 지문에 들어가므로 해당 지문이 바뀐다. 기존 자산은 재생성하지 않았다.

### PA1 plan 작성 자동화 테스트 — 2026-10-20 (경량 절차)

사용자 지시: Q1 10문항을 정답지로 쓰고, 작성자 세션 하나가 JS 문항만 보고 plan을 쓴다.

**설계(도구 중립 packet):**
- 작성자 packet에는 문항별 JS 필드(본문·보기·정답·해설)와 `phase2.mjs`에서 그대로 추출한 production plan 계약 문구를 넣었다. 이 문구는 runPhase2가 provider에 주는 `compilerContract` + `extendedContract`와 같다.
- 출처 경로·정답 plan은 packet 밖에 두었다.
- 작성 plan은 고치지 않았다. 정답지와 구조 비교(원문 점 좌표·표시 선분/그래프 계수·핵심점)를 한 뒤 실제 체인에 그대로 넣었다.
- 작성자는 라운드마다 새 Sonnet 세션 1개로 10문항을 처리했다.

| 라운드 | 계약 | 구조 일치 | COMPOSED | 주요 실패 |
|---|---|---|---|---|
| 1 | production 문구 + 시험용 addendum | 그래프 4/4, 기하 0/6(모델 단계 실패) | 2 | audit에 `id` 필수, `NORMALIZATION_*`의 `inputs:[]` 미기재 |
| 2 | 위 2개 + 눈금 지침을 production 문구에 보강 | 6/10 | 2 | `SELECT_POINT` branch를 args 안에 둠, 그래프 필드를 최상위에 둠 |
| 3 | 위 2개 보강 | 8/9(item04는 작성자의 `MIDPOINT_RATIO` 오류를 엔진 정확 검산이 잡음) | 3 | 남은 실패는 layout뿐: 명시 눈금 충돌(그래프 4), 소유 label 재배치 repair를 L1이 결속하지 않음(기하 2) |

**3라운드 COMPOSED 3건 역관측(관측자 1세션 `a1ccef355a13a38ae`):**
- item06은 **`OBSERVED_CONSISTENT`**다.
- item03·item05는 `OBSERVED_DISCREPANCY`였다. 원인은 표기뿐이다. 작성자가 넣은 길이 label `2√2`·`5√2` 등을 관측자가 지침의 `√(2)` 형식이 아닌 `√2`로 적었고, R1-b 정규화(NFC·공백·마이너스만)가 이를 거부했다.

**production 계약 문구 수정(`phase2.mjs`, provider에 그대로 가는 문구):** 5곳을 보강했다.
- audit 형식 `{id,kind,refs,sourceConditionId}`
- `SOURCE_POINT`/`NORMALIZATION_*`의 `inputs:[]`
- `SELECT_POINT` branch는 노드 필드
- 그래프의 `sourceDomain`·`requiredPoints`·`axisTickValues`는 `graphPlan` 안
- `axisTickValues` 사용 지침

문구만 바뀌었고 이 문구를 고정하는 테스트는 없다.

**결론:** 계약 문구 보강 후 작성자의 plan 수학 구조는 정답지와 대부분 일치했다(8/9, 나머지 1건은 엔진이 수학 오류로 거부). 끝까지 통과를 막는 것은 다음 세 가지다.
1. 명시 눈금 label 배치: 그래프는 사실상 `{x:[],y:[]}`가 안전하다.
2. L1이 소유 label 재배치 repair를 결속하지 않는 점: R1-a의 Archive 정책 refs로 결속을 추가할 후보다.
3. 관측자의 근호 표기 일관성: `√(a)`≡`√a`를 명시 정규화로 추가할지 결정해야 한다.

토큰은 작성 3라운드에 약 46만, 관측에 약 12만 들었다. 실제 문항 plan의 자동 작성은 가능성을 확인했고, 위 세 가지가 다음 작은 수정 후보다.

### 비용 통제 방침과 다음 순서 — 2026-10-21 (사용자 지시)

사용자 목표는 중고교 전 범위다. 그러나 지금 방식을 그대로 전 문항에 적용하면 비용이 지나치다. 그래서 이후 확장은 아래 방침을 따른다.

1. **census를 먼저 한다.** 아카이브 전체에서 해설 그림이 실제로 도움 되는 문항을 유형·단원·학년별로 세고, 기존 원본·해설 이미지 보유 여부도 함께 센다. 스크립트 위주로 한다. 유형 확장은 census 전까지 멈춘다.
2. **멈출 선을 정한다.** 그림이 필요한 문항의 약 70~80%를 덮는 상위 유형까지만 확장한다. 드물고 비싼 유형은 기존 이미지나 수동으로 처리한다. 선은 census 숫자를 보고 사용자가 정한다.
3. **필요성부터 선별한다.** 실익 있는 문항만 그리고, 충분한 기존 이미지는 다시 만들지 않는다.
4. **검증 모드:** 기본 관문은 결정론적 검사(수학 audit, primitive·graph observer, 렌더 layout, Archive 같은 바이트 결속)다. AI 역관측은 새 유형, 엔진 변경 직후, 운영 중 약 10% 표본에만 쓰고, 여러 packet을 묶어서 한다.
5. **plan 작성 계층**
   - 좌표가 명시된 단순 문항은 정규식·템플릿으로 만든다(토큰 약 0).
   - 쉬운 유형은 Haiku로 묶어 작성하고, 엔진 검산과 오류 피드백으로 최대 2회 재작성한다.
   - 어려운 문항만 Sonnet을 쓴다.
6. **예산 선계산:** census 대상 수 × 모드별 문항당 토큰을 계산하고, 20~30문항 파일럿으로 실측한다. 목표는 문항당 0~2만 토큰이다(측정 전까지 추정). 금액은 요금 방식에 따라 달라 추정하지 않는다.

다음 순서:
1. census와 멈출 선 결정
2. PA1 남은 장애 3건(그래프 눈금 기본값, L1의 소유 label repair 결속, 역관측 근호 표기) 수정 → 작성자 4라운드 → 딸깍 드라이버 20~30문항 파일럿
3. 멈출 선 안에서 유형 확장
4. I1

### 해설 그림 census — 2026-10-21 (경량 절차, 스크립트만)

대상은 `origin/main` `a7fab59fa`의 `archive/exams` 스냅샷이다(이 branch 기준 `100839e43`보다 67커밋 앞). 중복 지문 156건과 test-fixtures는 뺐다. 스크립트와 결과는 `.tmp/archive/svg-engine-development-20261015/CENSUS/`에 있다.

- **분류:** `standardUnit` → subUnit·category → tags → 지문 순서로 단원 regex를 맞춰 유형(family)을 정한다. 필요도는 유형별 단서(원본 문제 그림, 지문·해설의 그래프·도형 단어)로 HIGH/MED/LOW/NONE을 매긴다. 문항별 교육적 판정이 아니라 휴리스틱이다.
- **그림 보유:** `image`·`images`·`problemImage`·`visualAsset`·`svg` 필드와 본문 인라인 `<img>`·`<svg>`를 모두 센다. 해설 그림은 `solutionImage`와 해설 본문 인라인 그림이다.
- **보정 근거:** 이미 해설 그림이 있는 2,695문항 중 92.5%가 HIGH/MED로 분류된다. 필요도가 기록된 283문항과의 일치는 약하다(기록 NEED 64건 중 HIGH/MED 36건). 그래서 절대 수치는 오차가 크고 유형 순위가 더 믿을 만하다.

전체 21,831문항 중 대상(HIGH+MED)은 10,141건이고, 해설 그림이 아직 없는 미해결분은 7,649건이다. 원본 문제 그림이 있고 해설이 보조선 등을 더하지 않는 문항을 "원본 재사용"으로 빼면 **순수 제작 대상은 4,657건**이다.

| 멈출 선 | 포함 유형 (순수 제작 건수) | 누적 | 비율 |
|---|---|---|---|
| A 현재 ACTIVE | 이차함수 732, 좌표기하 328 | 1,060 | 22.8% |
| B + 2D 함수 그래프 | 일차함수 343, 미적분(다항) 424, 대수 문항의 그래프·수직선 192, 삼각함수 201, 지수·로그 194, 함수 일반 173, 유리·무리 79 | 2,666 | 57.2% |
| C + 평면기하 | 좌표 없는 평면도형 749, 사인·코사인법칙 79 | 3,494 | 75.0% |
| D + 통계 | 그래프·정규분포 573 | 4,067 | 87.3% |
| 선 밖 | 경우의 수 268, 집합 190, 입체 71, 이차곡선 42, 벡터 18, 영역 1 | 590 | 12.7% |

- C의 학년 분포는 중학 1,564, 고교 1,930이다. 좌표나 함수식이 명시되어 템플릿 계층 후보인 문항은 약 13%(450)로 적다.
- 예산은 토큰 기준이다. 지금 방식(작성 Sonnet 약 1.5만/문항/라운드 × 2 + 역관측 전수 약 4만)이면 문항당 약 7만, C 전체 약 2.4억이다. §4.5 목표(문항당 1~2만, 미측정)면 3,500만~7,000만이다. 원본 재사용을 빼지 않으면 각각 약 1.7배다. 엔진 확장 개발 토큰은 별도다.
- 지문이 그림을 가리키는데 문제 그림이 결속되지 않은 문항이 45건 있다. 범위 밖이라 보고만 한다.

멈출 선은 사용자가 정한다. 결정 전까지 유형 확장은 멈춘다.

**사용자 결정 (2026-10-21):** 멈출 선은 C다. 원본 문제 그림이 있으면 재사용을 기본으로 하되, 해설에 그림이 도움 되면 만든다. 이는 `도형추출.md` §C(marginal-benefit ADD: 원본 대비 새 보조선·접점·분할·같은 각 묶음·계산값의 기하적 의미가 있으면 ADD)와 `Problem_Bank_Per_Item_..._CURRENT_v1.md` §0-5(의미 있게 개선하면 OPTIONAL이라도 ADD 후보)와 같다. 범위는 전체가 아니라 기출(`original`)로 좁힌다.

이 기준(원본 그림 문항은 해설에 새 정보 단서가 있을 때만 포함)으로 C를 기출만 다시 세면 다음과 같다(`CENSUS/census-scope.txt`).

| 범위 | 미해결 | 새 정보 기준 | 보조선만 기준 |
|---|---|---|---|
| 기출 전체 | 5,252 | 4,151 | 2,998 |
| 고1+고2 | 2,012 | 1,770 | 1,532 |
| 중학 | 3,235 | 2,378 | 1,465 |

- 중학은 도형이 2학기(중1·중2·중3 2학기 합 1,497), 함수가 1학기 기말(중2 일차함수 276, 중3 이차함수 409)에 몰려 있다.
- 필요성은 규정상 문항을 읽고 판정해야 한다(태그·그림 유무로 결정 금지). 그래서 census 수치는 대상 규모 추정이고, 실제 판정은 plan 작성 단계에서 문항마다 한다.

**범위 확정 (2026-10-21):** 첫 범위는 고1·고2 기출이다. C 대상 3,356건 중 해설 그림 없음 2,012건(원본 재사용 기준 적용 후 신규 1,770건), 해설 그림 있음 1,344건이다. 기존 그림은 업그레이드 필요 여부를 판정하고, 없는 문항은 생성한다.

**기존 해설 그림 정적 검사** (`CENSUS/audit-existing.mjs`, C 유형 1,414건, 실제 렌더는 NOT_RUN):
- 표시 크기는 R1-a 실측 envelope(해설 영역 폭 298.16 CSS px, 384×320 SVG의 medium 표시 폭 174px)와 `engine.html` 크기 class CSS로 환산했다. 이 모형은 실측 174px를 그대로 재현한다.
- 기존 SVG는 대부분 560~840 폭 canvas에 10~16px 글자로 그려져 있어, 298px 영역에서 최소 라벨이 중앙값 약 5.6px로 보인다. `도형추출.md` §B의 11px 하한을 넘는 것은 소수다. full-width 배치로 바꿔도 해결되는 것은 6건뿐이다.
- 분류: 가독성 미달 재합성 1,286, 손 bezier 곡선·SVG 내 LaTeX 37, 파일 없음 21, raster 29, 크기 필드만 수정 6, 그대로 유지 후보 35.
- 가독성 미달 그림은 기하가 맞을 수 있으므로 `KEEP_SEMANTIC` 후 엔진으로 다시 합성하는 대상으로 본다. 의미 정확성은 정적 검사로 판정하지 않았다.

**업그레이드 방침 (사용자 결정 (나), 2026-10-21):** 신규 1,770건과 확실한 결함 58건(손 곡선·LaTeX·깨진 참조)을 먼저 하고, 글자 작은 1,286건은 그다음에 한다. 파일럿에 재합성 5건을 섞어 비용을 잰다.

### PA2 남은 장애 3건 수정 + 4라운드 — 2026-10-21 (경량 절차)

코드(`009ff668f`):
- **L1 repair 결속:** 선택 입력 `repairContext`(R1-a 실측 정책 결과 + 원본 fileRef)를 받으면 owner label 재배치를 runPhase2의 binder와 Chrome 감사로 결속한다. R1-a는 같은 실측 정책·식별자·plan·후보 바이트로 각 결속을 다시 대조한다. context가 없으면 지금처럼 거부한다.
- **측정값 정합:** Chrome은 fragment 크기를 1/64px 단위로 맞추고 binder는 typesetter 크기와의 완전 일치를 요구한다. 그래서 1 layout unit 안에서 일치하면 typesetter 크기를 측정값으로 쓴다. construction model에는 기준 SVG가 없어 model 정규 해시로 대신한다.
- **R1-b:** 한 토큰 근호를 정규화한다(`√(2)`≡`√2`, 뒤에 문자·숫자·`(`가 오면 그대로).
- **계약 문구:** 그래프 눈금은 항상 `{x:[],y:[]}`, 교점 입력 순서, 표시 목록은 최상위 필드이며 원본 기하를 포함, 길이 label 접두어 형식.
- **검사:** L1 28/28(E4c 음성 테스트 추가), R1-a 17/17, R1-b 20/20. 별도 Sonnet 검토자가 diff를 보고 6건을 지적해 5건을 반영했다(나머지 1건, "construction model에 svg가 있다"는 판단은 실제 실행에서 틀린 것으로 드러남).

결과(정답지 10문항):
- 3라운드 관측을 새 정규화로 재결속하자 item03·05가 `OBSERVED_CONSISTENT`가 됐다(새 관측 없음).
- 그래프 4문항은 새 계약으로 다시 작성해 4/4가 `ARCHIVE_BOUND`다(작성 Sonnet 약 9.7만).
- 기하 2문항은 3라운드 plan 그대로 repair 1건씩 결속·감사 PASS → `ARCHIVE_BOUND` → 역관측 `OBSERVED_CONSISTENT`.
- 정답지 기준 9/10이 끝까지 통과한다(item04는 작성자 수학 오류).

범위 밖 발견(보고만): runPhase2의 repair 경로는 construction model에서 `model.svg`가 없어 TypeError가 나고, binder의 완전 일치 조건 때문에 실제 글꼴에서는 결속되지 않을 가능성이 크다. `22_순천고_2학기_기말_고2_수학II`의 Archive 해설 화면은 60초 안에 렌더 완료에 이르지 못한다(2회 재현).

### 파일럿 27문항 — 2026-10-21 (고1·2 기출, `PILOT/`)

방식: 작성자가 문항을 읽고 필요성 판정(EXEMPT/UNSUPPORTED)과 plan 작성을 한 번에 한다. 1차 Haiku 3세션(9문항씩) → 엔진 오류 코드별 고정 설명문을 붙인 재작성 Haiku 1회 → 남은 것 일부 Sonnet 1회. 관문은 결정론적 검사(L1 + Archive 결속)이고, AI 역관측은 통과분 12건 중 2건(17%)만 했다(2건 모두 일치).

| 묶음 | 결과 |
|---|---|
| 이차함수 신규 8 | 그림 6(전부 Haiku 1차), EXEMPT 2 |
| 좌표기하 신규 8 | 그림 1, EXEMPT 2, UNSUPPORTED 1, 실패 4 |
| 원본 그림 있는 신규 3 | 그림 2, UNSUPPORTED 1 |
| 엔진 범위 밖 3 | EXEMPT 1, UNSUPPORTED 1, Archive 화면 시간 초과 1 |
| 재합성(글자 작음) 5 | 그림 3(Sonnet), 실패 2 |
| 합계 27 | 그림 12, EXEMPT 5, UNSUPPORTED 3, 실패 6, 환경 1 |

- 남은 실패 6건 중 5건은 label 둘 곳이 없는 배치 실패다(좌표 label 1~5개). 298px 해설 칸에서 11px 글자를 지키면 좌표 label을 많이 둘 수 없다. `도형추출.md` 6-7-1이 허용하는 "그림에는 점 이름, 정확한 좌표는 수치 패널" 방식이 다음 엔진 수정 후보다. 나머지 1건은 접점 검산 실패다.
- 토큰(subagent 누적): 1차 Haiku 61.6만(27문항), 재작성 Haiku 26.7만(14), Sonnet 23.1만(6), 관측 11.9만(4 packet). 작성 합계 111.4만이며 문항당 4.1만, 그림 1장당 9.3만이다.
- 이차함수는 Haiku 1차만으로 그림 1장당 약 2.6만이다. 좌표기하는 재작성이 거듭되어 훨씬 비싸다.
- 세션당 도구 호출이 23~68회라 누적 문맥 비용이 크다. 문항 전체를 파일 하나로 주고 결과도 파일 하나로 받으면 줄일 수 있다(미측정).
- 만든 SVG는 후보이며 시험지 JS·자산에 반영하지 않았다. publication·main은 NOT_RUN이다.

### 다음 후보 3건 실행 — 2026-10-21 (사용자 지시 "순서대로", 경량 절차)

**1. 좌표 수치 띠** (`fdda7ca49`, `phase2.mjs` spec 생성 + `semantic_model.py` 필드 1개):
- construction plan에 `coordinatePlacement:'PANEL'`(전부) 또는 `coordinatePanel:[점 ID]`(일부)를 주면, 점 이름은 점 옆에 두고 좌표는 그림 위 띠에 점마다 `A(x,y)` label 하나로 놓는다. 좌표값은 기존 좌표 label과 같은 독립 exact model에서 온다. 캔버스는 띠 높이만큼 키운다. 이미 있는 고정 중심 배치(`equationLabelCenters` + `topInset`)를 재사용했다.
- `labelDirections:{점 ID:'SE'}`는 점 옆에 남는 좌표 label의 첫 시도 방향이다. 엔진은 검증된 `preferred`를 점 이름·좌표 label에만 받는다.
- runner는 배치 실패 시 자리를 못 찾은 좌표만 띠로 옮기고, 그래도 실패하면 전부 옮긴다(AI 토큰 0).
- 결과: 배치 실패 5건 중 p10이 통과했다. 나머지 4건은 좌표가 아니라 점 이름·눈금·길이 label이 자리를 못 찾는다. 298px 칸에서 가까운 점의 이름끼리 부딪히는 문제는 남는다.
- 사용자 요청 확인: p10에 `coordinatePanel:['B']`, `labelDirections:{C:'SE'}`를 주자 C 좌표가 점 C 오른쪽 아래(4사분면)에 놓이고 B 좌표만 띠로 갔다(캡처 확인).
- p10 역관측(띠 전부 배치판)은 `OBSERVED_DISCREPANCY`였다. 띠 label은 모두 일치했다. 불일치는 y축과 겹친 표시 직선을 관측자가 축으로 본 점과, 점 F의 이름이 재배치로 멀리 밀려 "이름 없는 점"으로 읽힌 점이다. 둘 다 띠와 무관한 기존 한계이며 다음 수정 후보다.
- 검사: L1 28/28, `test_semantic_model` 8/8.

**2. 단일 파일 묶음 packet** (batch A 9문항, Haiku, 같은 계약):
- 도구 호출은 23회에서 4회로 줄었지만 토큰은 15.6만에서 17.1만으로 늘었다. 그림 수도 6에서 4로 줄었다(정의역 선택 흔들림).
- 비용은 파일 다시 읽기가 아니라 모델 추론·출력에서 나온다. 가설을 기각하고 문항별 packet을 유지한다.

**3. 좌표기하 Sonnet 우선** (p09~p16, 최신 계약):

| 경로 | 토큰 | 그림 | 그 외 |
|---|---|---|---|
| Haiku 1차 + Haiku 재작성 + 일부 Sonnet + 띠 | 약 37만 | 2 (p10, p15) | EXEMPT 2, 미지원 1, 실패 3 |
| Sonnet 1차만 | 약 17.3만 | 2 (p12, p13) | EXEMPT 2, 실패 4 |

- 좌표기하 그림 1장당 Sonnet 우선이 약 8.6만으로, Haiku 경로(약 18.7만)의 절반 정도다. 이차함수는 Haiku 1차로 충분하다(약 2.6만/장). 따라서 배정은 이차함수 → Haiku, 좌표기하 → Sonnet이다.
- Sonnet 실패 4건 중 3건은 작성자의 조건 검산 기록 오류다(`MIDPOINT_RATIO` 2, 접점 1). `MIDPOINT_RATIO`는 정답지 item04에서도 났다. 계약 문구의 audit 정의 보강이 다음 작은 후보다.

**남은 후보:**
- 점 이름 재배치 거리 제한 또는 지시선
- 좌표축과 겹친 표시 직선 구분
- audit 문구 보강
- 측정된 배정으로 다음 배치(고1·2 신규) 실행

### 남은 후보 4건 실행 + 배치 1 — 2026-10-21 (사용자 지시 "진행해", 경량 절차)

코드 `0de6d5d85`:
- **audit 문구:** 계약에 검산 항목별 의미를 적었다. `MIDPOINT_RATIO`는 두 부분의 비다(중점 1, 꼭짓점에서 시작하는 중선 위 무게중심 2). 작성자 오류는 모두 "전체에 대한 부분의 비"(1/2, 2/3)였다.
- **재배치 지시선:** owner-safe 재배치는 이제 점에서 label 상자까지 보이는 지시선이 있어야 한다. 지시선은 다른 선·label·표식을 비켜 가야 하고, 점을 지나는 선과 15° 이내로 겹치면 안 된다(축 밑에 숨는 지시선 방지). 없으면 label을 멀리 띄우지 않고 미해결로 보고한다. composer가 `OWNER_LABEL_LEADER_v1`을 다시 계산해 그린다. 결과적으로 정답지 item01·02는 해당 좌표를 띠로 옮겨 계속 통과했다. p10·p13은 이름을 점에서 멀리 띄우던 그림이 실패로 바뀌었다(이전 그림에서 `O`·`F`가 원점·점과 떨어져 떠 있었다).
- **축과 겹친 직선:** 축이 그려진 좌표 그림에서 x=0·y=0인 표시 직선은 축 자체이므로, 표시 목록이 모든 소비자(spec·L1 감사·관측 대조)에서 빼고 `axisCoincidentLines`로 기록한다.
- **띠 괄호:** 좌표 문자열을 감싼 괄호 한 겹을 벗긴다(`(4/3)`→`4/3`).
- **runner:** plan에 배치 지정(띠 점·방향·PANEL)이 명시돼 있으면 자동 재시도가 그 지정을 덮어쓰지 않는다. 사용자 지정 p10은 C를 띠로 옮기지 않고, F 이름 자리가 없다고 정직하게 실패한다.
- **검사:** test_label_layout + test_engine 28/28, test_semantic_model 8/8, L1 28/28.

**packet 생성기 결함(PA1부터):** 작성자 packet의 계약 문구에 runPhase2 문구의 앞 두 조각만 들어가 있었다. 그래서 좌표 평면 recipe(`SOURCE_COORDINATE_AXES_v1`)와 캔버스 확장 문구가 빠졌다. 이제 `PILOT/contract-text.mjs`가 compilerContract와 문자열로 붙는 모든 조각을 순서대로 넣는다. 이름으로 붙는 family 계약(삼·사차, 유리, 무리, 절댓값, 구간, 지수, 로그, 삼각)은 L1이 아직 합성하지 않아 뺀다. 배치 1 좌표기하 1차 실패 중 6건이 이 누락(`REALIZATION_RECIPE_REQUIRED`) 때문이었고, 재작성 1회로 6건 중 5건이 통과했다.

**배치 1** (고1·2 신규, 그림 없는 문항, 파일럿 제외, 시드 20261022, `BATCH1/`):

| 묶음 | 작성 | 토큰 | 그림 | EXEMPT | 미지원 | 실패 |
|---|---|---|---|---|---|---|
| 이차함수 15 | Haiku 1회 | 14.5만 | 4 | 2 | 6 | 3(그래프 핵심점 label 자리) |
| 좌표기하 15 | Sonnet 1회 + 재작성 1회 | 37.8만 | 7 | 5 | 1 | 2(label 자리) |
| 합계 30 | | 52.2만 | 11 | 7 | 7 | 5 |

- 문항당 약 1.7만, 그림 1장당 약 4.7만(이차함수 3.6만, 좌표기하 5.4만)이다. 파일럿(그림 1장당 9.3만)의 절반이다.
- 역관측 표본 2건(18%): p09 이차함수 일치. p20 좌표기하는 표시 선분 D–T가 표시 직선(접선) 위에 겹쳐 따로 보이지 않아 불일치였다.
- 이차함수 미지원 6건은 대부분 직선과 포물선(또는 두 포물선)을 함께 그려야 하는 문항이다. 이차함수 단원의 가장 큰 기능 공백이다.

**정답지 회귀(고정 절차로 채택):** 끝까지 통과했던 정답지 plan 9개(item04 제외)를 `0de6d5d85` 엔진으로 다시 돌렸다(`REGRESS/`). 9/9가 `ARCHIVE_BOUND`다. 7건은 그대로 통과했고, item01·02는 좌표 하나가 띠로 옮겨진 모양이다. 앞으로 엔진 변경 묶음마다 이 회귀를 돌린다(토큰 0, 약 20~30분). runPhase2(provider) 경로의 테스트는 이번에 돌리지 않았다.

### 후보 5건 실행 — 2026-10-21 (사용자 지시, 경량 절차)

코드 `8ba4cabee`(1~4), `42edc675e`(5):
1. **직선 위 선분:** 두 끝점이 표시 직선 위(0.5px 이내)에 있는 선분을 굵게(3.2) 직선 위 layer에 그린다. p20 역관측이 불일치에서 일치로 바뀌었다.
2. **빗금 분수 → 되돌림(사용자 결정):** 점 좌표 label과 띠 좌표를 `a/b`로 조판했으나, 사용자가 "빗금은 안 되고 세로 분수로, 작아도 양보 불가"로 결정했다. 빗금 변환과 `inlineFractions` 필드를 모두 제거했다. 엔진의 모든 분수는 세로 분수다(`도형추출.md` 7-2-1의 빗금 우선보다 사용자 결정이 우선). 남긴 것은 꼭짓점 형태 공식에서 덧셈·뺄셈 뒤 분수의 괄호를 뺀 수정뿐이다(`x-(3/2)`→`x-3/2`, 세로 분수로 조판). 그래프 샘플링 테스트가 같은 곡선임을 확인한다.
3. **그래프 핵심점 띠:** 이차함수에서 `coordinatePanel`/`PANEL`이면, 정수 좌표 핵심점의 id(대문자 한 글자 + 숫자·프라임 하나까지)를 점 이름으로 붙이고 공식 아래 띠에 `P(x,y)`를 놓는다. runner 자동 재시도가 그래프에도 적용된다.
   - **결함 발견·수정:** 정수 좌표가 아닌 핵심점은 엔진이 내부 id `required-point-N`을 학생용 이름으로 찍고 있었다(파일럿 p05 캡처). 관측자도 같은 글자를 적어 R1-b는 일치로 판정했다. 즉 R1-b는 내부 id 노출을 잡지 못한다. 이제 이름 없는 점으로 그린다.
4. **보조점 이름 숨김:** `hiddenPointNames`는 DERIVED_INTERMEDIATE 보조점을 이름 없이 그린다. R1-b는 일부러 이름을 비운 점(name null)이 끝점인 선분과 직각만 기대값에서 뺀다.
5. **직선+포물선:** `graphPlan.lines`(정확한 유리수 y=mx+q, through, tangentAt)와 `linePoints`를 추가했다.
   - 통과점과 접점 조건(접점에서 높이와 기울기 일치)을 정확히 검사한다.
   - framing이 직선 위 점을 담고, L1이 최종 SVG의 직선을 plan과 대조한다.
   - 배치 1의 "두 곡선" 미지원 6건을 새 계약으로 다시 작성했다. 1건(접선 문제)이 통과했다. 나머지 5건은 무리수 기울기 2, 매개변수 포물선 족 1, 경우별 다른 포물선 1, 두 번째 곡선 1이라 계속 미지원이다.

검사: test_engine·test_label_layout·test_semantic_model·test_graph_overview·polynomial-notation, R1-b 20/20, L1 28/28, 정답지 회귀 9/9(1~4 후, 5 후 두 번).

대상 재실행:
- p20, 이차함수 p02·p04·p08, 파일럿 p05가 통과로 바뀌었다. 배치 1 이차함수는 그림 4 → 8(p03 포함)이다.
- 좌표기하 p25·p30은 길이 label·점 이름 충돌로 여전히 실패한다.

역관측 3건(직선+포물선 p01, 겹친 선분 p20, 그래프 띠 p02)은 모두 `OBSERVED_CONSISTENT`다. 가독성 지적으로는 공식 속 세로 분수(`17/4`)가 작다는 점, 축 글자 `y`와 띠 label이 붙는다는 점, 직각 표시가 작다는 점, 가까운 점끼리 붙는다는 점이 나왔다.

**다음 후보:**
- 핵심점 좌표를 정확한 분수 문자열로 받기(지금은 정수가 아니면 좌표 없이 점만 찍힌다. 예: 접점 T(−3/2, 9/2))
- 띠와 축 글자 `y`의 간격
- 직각 표시 크기
- 무리수 기울기 직선(√ 계수)
- 매개변수 족이나 경우별 그림(여러 패널, 큼)

### 후보 4건 실행 — 2026-10-21 (사용자 지시, 경량 절차)

코드 `8d6c7a9dd`, R1-b 보정은 이 기록과 같은 커밋:
1. **정확한 핵심점 좌표:** `graphPlan.exactCoordinates {점 id:[x, y]}`(정확값 문자열)를 받는다. 값은 `exactValue()`가 계산한다(정수, 분수, sqrt, + − × ÷, 괄호만 허용, eval 미사용). spec이 x,y와 대조하고, 엔진이 좌표 label을 그릴 때 다시 대조한다. 세로 분수로 조판한다.
   - 접점 T(−3/2, 9/2), 꼭짓점 (3/2, 0)에 좌표가 붙었다. p01 역관측은 `OBSERVED_CONSISTENT`다.
2. **띠·직각:** 띠 아래에 14px 여백을 두어 축 글자 `y`와 떨어뜨렸다. 직각 표시를 7.5에서 10단위로 키웠다(해설 칸에서 약 6~8 CSS px). 정답지 회귀는 9/9다.
3. **무리수 기울기 직선:** `graphPlan.lines`의 기울기·절편에 √식을 쓸 수 있다. L1 감사도 같은 계산기로 대조한다. 직선 방정식은 띠의 한 줄을 통째로 쓰고, 긴 좌표는 한 줄에 하나씩 놓는다. 그래프 `labelDirections`도 지원한다.
   - 두 접선 문제(기울기 4±2√3)는 직선·접점 검산을 통과한다. 하지만 꼭짓점 근처 점 이름 하나가 자리를 못 찾아 실패한다.
4. **여러 패널(`composite-panels-v1`, 새 모듈 `composite-candidate-svg-v1`):**
   - 이차함수 패널 2~3개를 쌓은 전체 크기로 Archive 정책을 한 번 잰다. 각 패널을 L1로 합성한 뒤, **감사받은 바이트 그대로** `data:` URI 이미지로 넣고 캡션을 붙여 세로로 쌓는다.
   - R1-a는 넣은 패널 바이트를 풀어 다시 해시하고, 패널 안의 repair 결속을 패널별로 대조한다. R1-b는 패널별 spec을 다시 만들어 패널 기대값과 캡션 label을 합친다.
   - 첫 초안은 패널 id에 접두어를 붙이는 방식이었다. diff 한정 검토자가 8건을 지적했고(`data-*` 참조 누락, 패널 바이트와 결속 없음 등), 이를 받아 data URI 방식으로 바꿨다.
   - 결과: k=−2/−14 두 경우 문제가 두 패널로 Archive 결속까지 통과하고 역관측도 일치했다.
   - 3패널 포물선 족은 화면 높이 908px라 Archive 쪽 페이지 배치가 끝나지 않았다(2회 시간 초과). 이제 640px를 넘으면 `COMPOSITE_TOO_TALL`로 거부한다.
   - 구간 정의역 문제는 framing 단계에서 계속 미지원이다.
5. **R1-b 보정:** 이름 없이 좌표 label만 있는 점(그래프 핵심점)은 그 좌표 글자를 점의 label로 쓴다. 관측 지침("label이 붙은 점의 label")과 맞춘 것이다. p03 접선의 통과점이 이 규칙으로 일치하게 됐다. R1-b 20/20이다.

**다음 후보:**
- 48px 이내 기본 재배치에도 지시선 적용(관측자 지적: 좌표 label이 점에서 떨어져 있고 지시선 없음)
- 그래프 핵심점이 가까이 붙을 때의 이름 배치
- 구간 정의역 그래프
- 3패널 대신 패널 높이 축소

**이전 다음 후보(완료):**
- 표시 직선 위에 겹친 선분을 굵게 그리기(AX1과 같은 방식)
- 띠·좌표 label의 분수를 세로 분수 대신 빗금 분수로(세로 분수 숫자가 작아 읽기 어렵다는 관측. `도형추출.md` 7-2-1은 단순 label에 빗금을 우선)
- 그래프 핵심점 좌표에도 띠 적용(이차함수 배치 실패 3건)
- 보조점 이름 숨김 옵션(이름끼리 부딪히는 실패)
- 직선+포물선 조합 그래프(엔진 확장, 큼)

### 후보 4건 순서대로 — 2026-10-21 (핸드오프 §5, 사용자 지시, 경량 절차)

1. **가까운 재배치에도 지시선(`7696eb933`):**
   - 측정된 점 이름·좌표 label이 기본 탐색에서 gap 20px 이상 떨어져 놓이면, 64px 이상 재배치와 같은 지시선 검사를 통과해야 한다. 검사 내용은 다른 선·label·표식과 떨어질 것, 점을 지나는 선을 15° 이내로 따라가지 않을 것이다. 통과하지 못하면 다음 후보로 넘어간다.
   - 공용 검사는 `owner_incident_ids`·`visible_owner_leader`로 묶었다. composer는 `COORDINATE_RELOCATION_*` 배치의 `OWNER_LABEL_LEADER_v1`도 그린다.
   - 직접 테스트 40/40, 정답지 회귀 9/9 `ARCHIVE_BOUND`. item01의 C 좌표에 20px 지시선이 생겼고 Archive 렌더 검사를 통과했다. item03의 A 좌표는 지시선 자리가 없어 띠로 갔다.
   - EXACT p01: V·T 좌표가 띠로 가고 이름은 점 바로 옆(gap 12)에 놓여 결속된다. 점에서 떨어져 축 아래에 뜬 좌표가 없어졌다.
   - 역관측 1건(지시선이 실제로 그려진 item01): `OBSERVED_CONSISTENT`. 관측자는 지시선을 "C에서 (5, 1)로 가는 짧은 회색 지시선"으로 기록했다. 관측 토큰은 약 9.7만이다.
2. **붙어 있는 핵심점의 이름(`e64415f6c`):**
   - 실측 크기로 재현(p02 build payload 기록 → 오프라인 재생): T1과 V가 약 10px 떨어져 있다. T1 이름 상자(24px)는 y축 여백 때문에 x≥225.8에서 시작해야 하는데, V보다 T1에 가까우려면 x≤249.8에서 끝나야 한다. 0.1px가 모자라 어느 자리도 통과하지 못했다.
   - **미끄럼 후보:** 기본 자리가 모두 실패하면 N/S/E/W 쪽 상자를 그 변을 따라 1/8씩 옮겨 본다. 가까운 gap만 쓰므로 지시선은 없다. item02가 이걸로 띠 없이 결속됐다. p02는 해결되지 않았다.
   - **지시선 소유 후보:** 미끄럼까지 실패하면, 그다음 64px 이상 repair보다 먼저 이 후보를 쓴다(`OWNER_LEADER_<방향>`). 상자의 유일한 결함이 '모서리가 다른 점에 더 가깝다'이고 gap이 20px 이상이며, 제 점에서 오는 지시선이 깨끗하면 받는다. 지시선이 주인을 밝힌다. 64px 이상 repair는 R1-a가 다시 감사하는 Voronoi 규칙을 그대로 지킨다.
   - 직접 테스트 42/42, 정답지 회귀 9/9. item01의 A 좌표가 띠 대신 A 아래 48px 지시선 자리로 갔다. p02는 T1 이름이 20px 위, 20px 지시선으로 결속된다.
   - 역관측 1건(p02): `OBSERVED_DISCREPANCY`다. 원인은 이름이 아니다. 관측자는 (−1, 3)·T1을 지나는 직선과 T1 옆 짧은 세로 획을 바르게 적었다. 불일치는 띠 첫 줄 `y=(4−2√3)x+…`의 `=`가 화면에서 사라져 `y`와 식이 따로 읽힌 것이다.
   - `=` 소실 원인: 같은 바이트·같은 위치인데 캡처에서만 사라진다. MathJax `=`의 두 막대는 40 font unit으로, 해설 칸 11.65px에서 약 0.47 CSS px다. 1배율 캡처에서는 소수 픽셀 위치에 따라 안티앨리어싱으로 지워진다. p01도 띠가 커진 뒤 첫 줄 `=`가 같은 이유로 사라졌다(이전 캡처에서는 보였다). §5 범위 밖이므로 보고만 한다.
3. **구간 정의역 이차함수(`a289bedff`):**
   - `graphPlan.sourceDomain {kind:'INTERVAL', range:[lo,hi], states:[시작,끝]}`을 받는다. 끝값은 정확값이고, 상태는 ≤면 `CLOSED`, <면 `OPEN`이다(생략하면 둘 다 CLOSED).
   - framing은 곡선을 [lo,hi]에만 그린다. 틀에는 구간, 그 위 함숫값, 핵심점, 축이 들어간다. 핵심점은 구간 안에 있어야 하고 열린 끝에 놓일 수 없다.
   - model과 최종 SVG에 끝점 점을 그린다. 닫힌 끝은 채운 점, 열린 끝은 빈 점이다.
   - graph observer는 구간·끝 상태·끝 함숫값을 계수에서 독립적으로 다시 계산한다. 그다음 확인한다: inventory와 그리는 정의역, 곡선이 끝점에서 시작·끝나고 그 밖으로 나가지 않는지, 끝점 점 2개의 위치와 채움, 핵심점이 구간 안에 있는지.
   - 직접 테스트 50/50, 정답지 회귀 9/9. PANELS p02(a=0, a=2 두 패널, −1≤x≤3)가 결속된다. 역관측 `OBSERVED_CONSISTENT`였고, 관측자는 각 곡선을 "왼쪽 채운 점 (−1, 3)에서 … 오른쪽 채운 점 (3, −5)까지의 호"로 적었다.
4. **3패널 높이 — 사용자 선택: 공식은 캡션 줄로, 같은 띠 줄은 맨 위에 한 번:**
   - 3패널일 때만 `compositePanels`가 각 패널에 `compositeHeader {formula:'CAPTION', sharedLines}`를 붙인다. sharedLines는 세 패널 모두에서 id·기울기·절편이 같은 직선이다. 작성자는 이 필드를 쓰지 않는다. 2패널에 이 필드가 있으면 거부하고, 단독 그림이면 L1과 R1-b가 거부한다.
   - 패널 spec은 512×286 캔버스로 공식 머리가 없다. 공식 label과 공유 직선 label을 빼고, 띠 줄을 80 위로 올린다. 그림 높이는 222로, 이전 256보다 13% 작다.
   - composite는 각 패널을 표준 방식(공식 머리 포함)으로 그린 spec에서 엔진 prepare가 내는 label로 텍스트를 얻는다. 패널 공식은 캡션 줄 뒤에 16 간격을 두고 조판하고, 공유 직선 식은 첫 캡션 위 줄에 조판한다. R1-b 기대값도 같은 helper로 공식·공유 줄을 더한다.
   - 3패널 대상 p01: 908 → 630 CSS px. 2패널은 바뀌지 않는다.
   - 직접 테스트: composite 2/2, python 19/19. 정답지 9/9, 2패널·3패널 모두 결속.
   - 역관측 1건(3패널): `OBSERVED_CONSISTENT`. 관측자는 공유 줄 `y = 3 · x − 13/4`를 읽었고, 캡션 "a = −1 일 때"와 공식 `y = (x+1)^(2) − 4`를 각각 따로 읽었다.
   - diff 한정 검토(Sonnet, 약 23만 토큰): 그림·스택 높이·R1-b 기대값을 틀리게 만드는 결함은 없었고, 방어·오류 처리 6건을 지적했다. 1~5건을 반영했다. 단독 그림의 compositeHeader 거부, worker 예외를 Stop으로 감싸기, 검증 뒤에 sharedLines 계산, 3패널 호환성(이차·overviewCanvasHeight 없음) 확인, 2패널 키 거부다. 6건째(관측자가 캡션과 공식을 한 덩어리로 읽을 위험)는 실제 관측에서 따로 읽혀 기록만 남긴다.
   - 함정: Bash 도구의 python 텍스트 쓰기가 LF 파일을 CRLF로 바꿔 diff가 파일 전체로 커졌다(phase2.mjs 1800여 줄). 바이트로 되돌렸고, 이후 수정은 바이트 쓰기로 한다.
   - 이전 검토 메모(보류 시점):
   - 실측: 대상 p01 패널은 각각 512×460이다(공식 머리 80 + 직선 띠 1줄 60 + 그림). 3패널을 쌓으면 1560 → 908 CSS px다. 상한 640px(해설 이미지 max-height)은 내부 1099에 해당하고, 캡션·여백 180을 빼면 패널당 약 306까지 쓸 수 있다.
   - 패널용 낮은 캔버스만 쓰는 경우: viewport가 위아래 여백 32를 꼭 두므로, 띠 1줄이 있으면 그림 높이가 약 134(해설 칸 약 78 CSS px)로 준다. 세로 분수 좌표 label이 들어가기 어렵다. 시험 구현 후 되돌렸다.
   - 띠 공유만 하는 경우(세 패널에 같은 직선 줄을 맨 위에 한 번만 두고 공식은 패널에 남김): 그림 높이 약 171~203.
   - 공식을 캡션 줄로 옮기고 같은 띠 줄을 공유하는 경우("a=−1일 때 y=…"): 그림 높이 약 251로 지금(256)과 거의 같다. 대신 공식·직선 label이 L1 감사 패널 바이트 밖으로 나오므로 composite·R1-a·R1-b를 모두 고쳐야 한다(새 모듈 고위험 변경).

### 다음 후보 — 2026-10-22 (사용자 지시 "진행해", 경량 절차)

1. **띠 첫 줄 `=` 소실(`a1333e5c4`):**
   - 캡처 픽셀로 확인했다. 이전 캡처의 `=` 자리는 회색 191·128(25%·50% 덮임)이었는데, 소실된 캡처는 완전한 흰색 255였다. 흐려진 것이 아니라 샘플 사이로 통째로 빠진 것이다.
   - 수식 조각(MathJax)의 글리프 외곽선에 30 단위 획을 준다(`MATH_GLYPH_STROKE_UNITS`). `=`·`−`·`+` 막대와 분수선이 40에서 70 단위(약 0.82 CSS px)가 된다. 한글 글자 조각은 그대로다.
   - 정답지 9/9. EXACT p01·p02 첫 줄 `=`가 캡처에 보인다. p02 역관측에서 label 불일치는 사라졌다. 남은 불일치는 꼭짓점 V가 접선 L1에서 0.07(약 0.9 CSS px) 떨어진 거의-통과 상황이며, 엔진 결함이 아니라 화면에서 구분할 수 없는 한계다.
2. **배치 1 실패 재실행(작성 토큰 0, `BATCH1/packets-r3`):** 이차함수 p02·p04·p08이 결속됐다. 좌표기하 p25(값 label `qBC` 자리 없음)·p30은 여전히 실패다. p30은 20px 이상 이름에 지시선을 요구하면서 미해결 이름이 2개에서 4개로 늘었다.
3. **배치 2(새 고1·2 기출 30문항, 고정 seed 20261023, `BATCH2/`):** 파일럿·배치 1 명단은 제외했다. 남은 후보는 이차함수 216, 좌표기하 202건이다. 작성 지침은 composite 안내가 있는 PANELS 템플릿을 썼다.
   - 이차함수(Haiku): plan 10, 그림 불필요 3, 미지원 2(두 곡선). plan 10건이 첫 시도에 모두 결속됐다. 새 문법도 쓰였다: 직선 7, composite 2, 구간 1. 작성 토큰은 약 16.9만이다.
   - 좌표기하(Sonnet): plan 7, 그림 불필요 3, 미지원 5. 미지원 5건 중 4건은 "식으로만 주어진 직선 여러 개"다(다음 확장 후보). plan 7건 중 5건이 결속됐고, 2건은 점 이름 자리 부족(p16 P, p30 G)으로 실패했다. 작성 토큰은 약 21.3만이다.
4. **이차함수 그래프 같은 배율(사용자 지적 "좌표가 기하학적으로 옳은 위치가 아니잖아", 결정 "항상 같은 배율"):**
   - 원인: 함수 그래프는 `UNEQUAL_UNIT_DECLARED`로 축마다 따로 캔버스를 채웠다. 지금까지의 이차함수 23장 모두 가로 배율이 세로의 1.9~9.2배였다(p08 패널: 가로 73px, 세로 18.75px). 눈금이 없으니 학생은 배율을 알 수 없다.
   - framing(`equal_unit_frame`): 보여야 할 점(원점, 꼭짓점, 자연 폭의 두 점, 핵심점, 직선 위 점, 구간 끝점)을 가로 448px에 같은 배율로 넣는다(가장자리 40px 여백). 그림 높이는 160~640이고, composite는 2패널 300·3패널 222에서 남는 띠 줄만큼 뺀다. 넘치면 x 범위를 넓힌다. 전체 실수에서는 곡선이 위(아래) 가장자리 바로 안까지 그려진다. 그려지는 곡선 폭이 48px 미만이거나 꼭짓점 주변 자연 폭이 24px 미만이면 `EQUAL_UNIT_PARABOLA_TOO_NARROW`로 정직하게 실패한다.
   - plan에 `equalUnits`·`plotCanvas`를 싣는다. phase2는 캔버스를 plot+여백(+공식 머리)로 만들고, 같은 배율 캔버스 상한을 1099(640 CSS px)로 둔다. 엔진 viewport와 model도 같은 배율로 그린다(model은 같은 plot 크기).
   - graph observer는 최종 그림의 가로·세로 px/단위가 같은지(`EQUAL_UNIT_SCALE_MISMATCH`), 꼭짓점·자연 폭 팔·핵심점, 곡선 폭을 독립 확인한다. 구간 그래프도 같은 배율을 확인한다.
   - runner: composite 패널 좌표가 자리를 못 찾으면 그 패널 좌표만 띠로 옮겨 한 번 더 시도한다(재시도의 측정 run id 충돌도 고쳤다).
   - 결과: 정답지 9/9. 배치 2 이차함수 10/10(p11 y=x²−8x−1/3은 높이 640에서 1단위 11.4px인 좁은 U자로 결속). 배치 1 이차함수 3/3, EXACT p01, PANELS p02 결속. EXACT p02(두 접선)는 V가 T1과 11px, L1과 약 3px 떨어져 V 이름의 지시선이 L1을 가로질러야 하므로 정직한 실패로 둔다(작성자 재작성 대상, V는 필수 점이 아님).
   - 역관측(같은 배율 EXACT p01): `OBSERVED_CONSISTENT`.
   - composite: 패널 그림 높이 상한에서, 패널에 남는 띠 줄(공유되지 않은 직선, 띠로 간 좌표, 한 줄에 하나로 계산)만큼 뺀다. 배치 2 p08·p12와 PANELS p02(2패널)는 결속된다.
   - PANELS p01(3패널, a=−1·0·1): 같은 배율과 640px 한도에서 패널 그림이 1단위 약 24px로 작아진다. 셋째 패널은 좌표를 띠로 옮겨도 V 이름 자리가 없어 정직한 실패로 둔다(이전 배율에서는 결속되던 문항).
5. **같은 배율 우선 + 실패 시에만 세로 최대 2배 압축(`9a1d652cf`, 사용자 선택):**
   - 사용자가 "형태 고정(부드러운 U자)"과 "실패가 없는 것"을 함께 원했다. 검토 결과 22장 중 19장이 a=±1이었다. 이 경우 표준 U자와 같은 배율은 꼭짓점 근처에서 같은 모양이고, 차이는 멀리 있는 핵심점이 틀을 키우는 데서 생긴다.
   - framing: 같은 배율로 너무 좁으면 같은 단계에서 y/x 비율 0.5~1로 다시 잡는다(내용이 가로를 채우며 높이 한도에 맞는 비율). runner가 배치 실패 뒤 `axisSqueeze`를 붙이면 바로 그 비율로 잡는다. 쓴 비율은 `axisRatio`로 남는다.
   - observer는 sy = axisRatio × sx와 0.5 ≤ axisRatio ≤ 1을 확인한다. 엔진·model은 비율이 1일 때만 같은 배율 모드로 그린다.
   - runner: 단일 그림은 좌표 띠 재시도 뒤 세로 압축 재시도를 한다. composite는 실패한 패널만 압축한다.
   - 결과: EXACT p02(비율 0.63)와 PANELS p01(셋째 패널만 압축)이 실패에서 결속으로 바뀌었다. 정답지 9/9.
6. **지시선 판정 회귀 수정(`bc4eab48e`):**
   - R1-b 테스트가 1/20으로 떨어져 있었다. 원인은 §5-1 근거리 지시선 요구(`7696eb933`) 뒤 fixture P·Q가 합성되지 않은 것이다. 당시에는 직접 걸리는 테스트를 label layout·composer·engine으로만 잡아 이 suite를 돌리지 않았다.
   - 원인 두 가지를 고쳤다. (1) "점을 지나는 선을 15° 이내로 따라가면 숨는다" 판정이 방향을 보지 않아, A에서 끝나는 선분 AB가 반대쪽(서쪽) 지시선까지 막았다. 이제 선이 그 점에서 실제로 뻗는 방향만 본다(`leader_hides_along`). (2) 같은 점의 이름 지시선과 좌표 지시선이 출발점에서 만나는 것을 충돌로 보았다. 이제 같은 점을 지나는 다른 지시선도 incident로 다룬다.
   - fixture Q는 M 좌표 label을 뺐다. M이 x축 눈금 2 위에 있어 지시선이 눈금과 눈금 글자를 지나야 하므로 새 규칙이 거부하는 것이 맞다. R은 M 좌표를 명시해 유지했다.
   - R1-b: 3패널 캡션과 공식은 한 줄에 있다. 관측자가 한 구로 읽으면 그 구를 두 label로 본다(리뷰 6번 지적이 실제로 일어났다: 한 관측자는 따로, 다른 관측자는 붙여 읽었다).
   - 결과: R1-b 20/20, 정답지 9/9. 배치 2 좌표기하 p16이 새로 결속됐다(6/7, p30만 G 이름 실패). 압축된 3패널의 재관측은 `OBSERVED_CONSISTENT`(첫 관측은 설명 길이 초과로 기록 무효).
7. **분수를 본문 글자 크기로(`cce417e0a`, 사용자 지시 "11이 아니라 더 키워도, 그림은 커져도 무관"):**
   - 원인: 본문 속 `\frac`은 분자·분모를 약 70%로 줄인다. 해설 칸 11.65px label 안의 분수 숫자가 약 8px였다. 역관측 때마다 가장 자주 나온 지적이었다.
   - TeX를 `{\displaystyle\frac{a}{b}}`로 쓴다(`\dfrac`은 이 MathJax 설정의 기본 패키지에 없다). 분수 label 높이가 24에서 41~48이 된다.
   - 띠 줄 간격: 분수가 든 줄은 56(label 약 48 + 배치 여백 6), 없는 줄은 34. 이차함수 머리 띠와 좌표기하 좌표 띠에 모두 적용했다. composite 공유 줄은 56이고, 3패널 그림 높이를 220으로, 패널 띠 줄 추정도 56으로 맞췄다.
   - 결과: 정답지 9/9, 배치 2 이차함수 10/10, EXACT p01·p02, PANELS p01·p02 결속. 역관측은 NOT_RUN(Archive 렌더 검사와 ROOT 그림 확인만 했다).
   - 남은 표기: `−3/2`가 분자 안 마이너스로 쌓인다(교과서는 분수 앞에 마이너스). 길이 `(2·√5)`, 직선 `3·x`. 다음 표기 다듬기 후보.

**Q1 전체(construction 6 + graph 4): 10/10 문항이 끝까지 통과했다.** 각 문항은 L1 합성 → 실제 Archive 같은 바이트 결속 → 독립 역관측 일치를 거쳤다. 이것은 provider 없는 slice의 실측 결과이며 다음은 NOT_RUN이다: 기존 `qualifyVisualEngine` 판정(provider `runPhase2` 결과·registry·roster·migration 증거 요구), 정상/오류 검증기 suite의 별도 자격 판정, ACTIVE, publication, push/main/배포.

세부 raw log와 수납 근거는 위 임시 실행 경로를 참조한다. 이 표에는 실제 끝난 단계만 완료로 갱신한다.

### 표기 세 가지 (2026-10-22, 커밋 faa56a979)

- 음수 분수는 tex에서 `-\frac{3}{2}`로 분수 앞에 마이너스를 둔다(plain은 `−3/2` 그대로).
- 숫자·괄호 묶음(tex는 분수도) 뒤에 문자·sqrt·괄호가 오면 곱셈점을 생략한다(`3x`, `2√5`, `3(x+1)`). 숫자×숫자와 문자×문자는 점 유지.
- 길이·값 label은 `unwrapParentheses`를 거쳐 `(2·√13)` 대신 `2√13`.
- 검증: python 230 OK, R1-b 20/20, 정답지 9/9 ARCHIVE_BOUND, 배치2 좌표기하 6/7 결속(p30만 기존 G 이름 실패). 관측자 역관측은 NOT_RUN.

### 좌표기하 실패 3건 작성자 재작성 (2026-10-22)

- 배치 1 p25: 결속(BC²는 작성자가 빼고 캡션에 기재).
- 배치 1 p30: 3회 재작성 후에도 `LAYOUT_INVENTORY_INCOMPLETE`(O·A·B 이름 자리 없음, 세 원이 촘촘함). 배치 2 p30: 3회 재작성 후에도 `COORDINATE_PANEL_TOO_TALL`(spec 단계). 엔진 한계로 남김, 더 돌리지 않음.
- `prep-feedback-packets.mjs`에 힌트 2개 추가(`INVALID_LABEL_DIRECTIONS`, `COORDINATE_PANEL_TOO_TALL`; 개발 도구, git 무시).
- 교훈: 재작성 packet은 마지막 라운드 plan(`packets-r3/retry` 등)에서 만들어야 한다. 원 packet(`packets/batchB`)에서 만들면 이미 고친 오류로 되돌아간다.

### 식으로만 주어진 직선 `SOURCE_LINE` (2026-10-22)

- 새 노드 `SOURCE_LINE`(args a,b,c = ax+by+c=0, inputs [], LINE, GIVEN). Python이 식 위의 두 정확한 점으로 Line을 만들고, cindy-observer는 보조 자유점 두 개를 Join으로 잇는다. 좌표 프레임의 '출처 점 필요' 검사는 SOURCE_POINT 또는 SOURCE_LINE이면 통과.
- 배치 2: p20·p24 결속(평행선 3개+수직 거리). p23은 `OB-value` 자리 없음, p29는 `F0-name`·`X-name` 자리 없음.
- 그림에서 확인된 후속 과제: 직선 옆에 식 label이 없음, 작성자가 만든 점 이름(F0~F2)이 해설에 없음, 단위 보조점 X가 보임.
- 검증: python 230 OK, R1-b+construction-spike 27/27, 정답지 9/9.

### SOURCE_LINE 후속 (2026-10-22)

- 배치 2 p23 결속(직선 3개, OA 길이 label; OB 길이는 작성자가 뺌). p29는 단위 보조점 `X-name` 자리 없음으로 실패.
- 직선 식 label(`lineLabels`)은 작업 트리에만 있고 커밋하지 않음: 평행선처럼 가까운 직선에서는 라벨이 다른 직선 옆에 앉아 오독 위험. `label_layout.py`의 지시선은 점 소유 라벨 전용이라 직선용 확장이 필요(OWNER_LABEL_LEADER_v1, svg_composer 렌더, 감사 규칙).
- 후속 표기: `OA=(8/5)√10`의 불필요한 괄호, 단위 보조점 X가 그림에 보임.

### 직선 식 label과 지시선 `lineLabels` (2026-10-22)

- plan 필드 `lineLabels:[{nodeId,form:'SLOPE_INTERCEPT'|'GENERAL'}]`: SOURCE_LINE의 정확한 계수로 식을 만들어 직선 옆에 쓴다. 엔진이 `lineOwned`·`alternateAt`(직선 위 앵커 후보: 끝 근처·안쪽·반대쪽 끝)을 넣는다.
- 배치기: 가까운 상자(간격 <20)는 자기 직선이 10px 이내이고 다른 직선보다 24px 더 가까울 때만 지시선 없이 허용, 아니면 앵커에서 보이는 지시선(`OWNER_LEADER_<방향>`, 자기 직선과는 앵커에서만 접촉)으로 묶는다. 첫 앵커에 자리가 없으면 다음 앵커를 시도한다.
- 배치 2 p20·p24: 직선 3개 모두 식 label+지시선으로 결속. 검증: python 231 OK, node 41/41(R1-b·spike·publication-layout·repair-binder), 정답지 9/9.

### 작은 정리 묶음 (2026-10-22)

- 단위 보조점(NORMALIZATION_AXIS)은 기본으로 그리지 않고, displayPoints 필수 목록에서도 뺐다(작성자가 명시하면 그릴 수 있음).
- `(8/5)√10`은 tex에서 `\frac{8\sqrt{10}}{5}`, plain에서 `(8√(10))/5`.
- 역관측: p20 `OBSERVED_CONSISTENT`(라벨·선분·직선 전부 일치). p23은 첫 관측이 표기 변경 직전 기대값과 어긋나 plain 표기를 관측자 서술(`(8√10)/5`)에 맞춤. 정규화 비교는 직접 확인했고 재관측은 하지 않음.
- 평행선 plan: p20·p23 결속. p24(`L0-equation`·`O-name`)·p29(`L2-equation`)는 라벨 자리 부족으로 실패 상태.
- 검증: python 232 OK, node 41/41, 정답지 9/9.

### 평행선 마무리 (2026-10-22)

- 개발 runner(`PILOT/pilot-run.mjs`, git 무시)에 폴백 4 추가: 좌표기하(SOURCE_COORDINATES) construction이 `LAYOUT_INVENTORY_INCOMPLETE`이면 `coordinateCanvas`를 480x400, 600x500 순으로 키워 다시 합성(프레임만 바뀜, 한도 720x600).
- 배치 2 p24·p29: 원래 plan 그대로 폴백으로 결속, 식 label 3개 전부 지시선과 함께 표시. AI 역관측 둘 다 `OBSERVED_CONSISTENT`(누락·초과 없음).
- 배치 2 좌표기하 현황: 결속 p16·p18·p20·p21·p22·p23·p24·p25·p27·p29, 그림 불필요 p17·p26·p28, 미지원 p19(수직선), 실패 p30(spec 높이 한도).

### 배치 3 (2026-10-22, seed 20261024, 이차함수 15 + 좌표기하 15)

- 이차함수: 결속 4(p03·p08·p11·p14), 그림 불필요 5, 미지원 2(p10 구간별 두 곡선, p12 합성), 실패 4(p02·p13 Archive 60초 시간 초과, p07 `EQUAL_UNIT_PARABOLA_TOO_NARROW`, p15 `COMPOSITE_PLAN_INVALID`).
- 좌표기하: 첫 시도 9건이 모두 `OUTPUT_TYPE_MISMATCH`(계약이 NORMALIZATION_AXIS 출력형을 안 적음) → 계약 보강 후 재작성. 두 번째 재작성에서 이름 문제(`O0`·`Pp`·`C1`이 점 이름으로 찍힘) 확인 → 계약에 "표시되는 점은 노드 id로 쓰이니 해설이 쓰는 이름을 id로" 규칙 추가, 원점·단위 노드는 displayPoints 필수에서 제외.
- 최종: 결속 7(p19·p21·p24·p25·p27·p29·p30), 그림 불필요 4, 미지원 2(무게중심 점 연산 없음 p20·p22), 실패 2(p17 작은 원 중심 이름 자리 없음, p16 `LINE_LABEL_LINE_NOT_IN_VIEW`).
- 코드: 음수 분수×루트(`(-5/2)√3` → `-\frac{5\sqrt{3}}{2}`), 원점 노드 필수 표시 해제. 검증: python 232 OK, node 41/41, 정답지 9/9. 이 배치는 AI 역관측 NOT_RUN.

### 자동 실행기 `AUTO/auto.mjs` (2026-10-22, 개발 도구, git 무시: `.tmp/archive/svg-engine-development-20261015/AUTO/`)

- `init <캠페인> <packetDir>...` → `drive <캠페인>`: 작성자 → plan 사전 검사 → 엔진 → 결과 분류(결속·그림 불필요·미지원·작성자 수정·엔진 한계·일시적) → 힌트 붙은 재작성 → 재실행 반복, 같은 오류 3건 이상 반복은 계약·엔진 빈틈으로 중단, 끝나면 10% 표본 AI 관측과 보고서(`report/index.html`, 성공·실패 초안 포함).
- 작성자·관측자 백엔드: `claude.exe -p`(구독 로그인 필요, 패키지 앱 경로 `AppData/Local/Packages/Claude_*/LocalCache/Roaming/Claude/claude-code/`) 또는 대기열(`WAIT.json`을 에이전트가 처리 후 `drive` 재실행). 로그인은 아직 안 됨.
- 시험(배치 3 첫 작성본 30건): 4바퀴 만에 전부 종결. 결속 12, 그림 불필요 9, 미지원 4, 엔진 한계 3(p02·p13 시간 초과, p07 포물선 너무 좁음), 포기 2(p15 3패널 plan, p17 좌표 패널 높이). 표본 관측 p03 일치, p21 불일치(M과 P가 거의 겹쳐 선분·직선 판독이 갈림).
- 사전 검사(lint): 한 글자 대문자가 아닌 표시 점 이름이 해설에 없으면 엔진 전에 재작성(이미 결속된 항목도 재검사해 다시 엶).
- 엔진 쪽: `APMS_DRAFT_DIR`/`APMS_DRAFT_TAG` 환경변수를 주면 `LAYOUT_INVENTORY_INCOMPLETE` 직전 초안 SVG를 파일로 남김(게이트가 읽지 않는 진단용).


### 구간별 이차함수 + 수평선 `piecewise-polynomial-spike-v1` (2026-10-23)

- 새 capability: 연속인 y=g(x) 한 개(조각 1~3개, 각 2차 이하, 유리 계수) + 수평선 y=c 최대 3개와 교점. plan: `graphPlan{family:'piecewise-polynomial',pieces:[{coefficients}],breakpoints:[{x,y}],sourceDomain(ALL_REALS|INTERVAL),formula?,referenceLines:[{id,y,intersectionX,labelIntersections?}],requiredPoints,exactCoordinates,axisTickValues}`.
- framing(`fit_piecewise_polynomial`)이 주장을 정확히 다시 계산해 어긋나면 거부: 연속·경계값, 꺾인 점·조각 안 꼭짓점의 requiredPoints 포함, 각 직선 교점(SymPy 이차 무리수, 접점은 한 번, 열린 끝 제외), formula 일치. 같은 배율 틀, 실패 시에만 압축. 교점이 표시점과 겹치면 한 번만 그림(`keyPoint`).
- 독립 observer가 같은 사실을 따로 계산하고 SVG의 조각·점·직선·교점 점·구간 끝 점을 확인. 엔진: 조각 곡선 모두 main 획, `abs`는 `|..|`, 괄호 분자 세로분수에서 괄호 제거.
- 검증: python 238 OK, node 필수 41 + 신규 5 통과, 정답지 gold30 9/9. 자동 실행기 camp7(q22): 작성자 1회 만에 결속(C 좌표만 띠로), 역관측 `OBSERVED_CONSISTENT`. 그림 `AUTO/q22-solution.svg/png`.
- 기존 실패(범위 밖): `tests/composite-header.test.mjs` 1건은 이전 표기 커밋(3·x→3x)의 오래된 기대값.
