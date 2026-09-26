# JS아카이브 규칙 통합 인덱스

이 문서는 `docs/rules/`의 단일 진입점이다. 규칙 원문을 무리하게 한 파일에 복사하지 않고, 기준 원본·작업 프로토콜·검수 프로토콜·특수 규정·역사 문서를 역할별로 분리한다.

## 0. GPT 저장소 작업 선행 규칙

GPT가 이 저장소에서 분석·생성·수정·전수검수·Meta Foundation·runtime 연결 작업을 수행할 때는
**다른 작업 규칙을 읽기 전에**
`02_PIPELINES/GPT_격리작업공간_실행규칙_v1.md`를 먼저 적용한다.

기본 실행 방식은 `최신 main 고정 → repo 밖 격리 작업공간에서 완결 → 최신 main 재확인 → 최종본만 1회 Git 반영`이다.
GPT는 별도 지시 없이 작업 브랜치를 먼저 만들거나, 중간 candidate를 main/GitHub production 파일에 누적 반영하면 안 된다.
branch/PR은 사용자의 명시 지시 또는 해당 규칙의 예외 조건이 있을 때만 사용한다.


### Codex Meta Foundation 작업 선행 규칙

Codex가 Meta Foundation 단원 정리를 수행할 때는 GPT 격리 작업 규칙의 기본 실행형을 그대로 적용하지 않고
`02_PIPELINES/CODEX_Meta_Foundation_단원정리_실행프로토콜_v1.md`를 Codex 실행 정본으로 함께 적용한다.

Codex Meta Foundation 작업은 `최신 main → 전용 branch → GOAL 완주 → checkpoint/evidence 보존 → branch 종료 → GPT 독립검수 → 사용자 승인 후 main`이 기본 흐름이다.
checkpoint는 사용자 승인 대기 지점이 아니며, 실제 HARD BLOCKER가 아니면 프로토콜의 DONE 조건까지 계속 진행한다.
완료 branch는 main merge 전에 GPT가 전체 diff·ledger/evidence·canonical/compiled/runtime/Archive2 parity를 독립검수한다.

### 전 학년 BASIC 출제 계약 (2026-09-26)

중1~고3·전 과목은 Foundation 운영규칙 §24의 Inclusive Basic Eligibility를 적용한다. L1/L2 + source/solution/identity/semantic quality + DEFAULT_SCOPE가 BASIC이며, difficulty/L3/L4/RPM/relational metadata는 요청 시에만 쓰는 optional capability다. 실제 source/solution HARD defect와 explicit semantic HOLD/ROUTE_OUT은 계속 차단한다.

## 1. 현재 읽기 순서

### 신규 JS 추출·변환

모든 신규·변환 작업의 독립검수·봉인·실렌더 공통 기준은
`02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`를 함께 적용한다.

여러 실행기의 공통 schema·생성 witness·최종 집계 연결은
`02_PIPELINES/공통파이프라인_실행계약_v1.md`와 `archive/tools/pipeline-core/`를 적용한다.
추출/초안 완료와 실제 문항 품질 PASS는 서로 다른 상태다.

### JS아카이브 공통 권위 구조

JS아카이브 전체 작업 OS의 권위는 다음처럼 분리한다.

- 품질·독립검수·동일 final artifact SHA·실렌더·release/seal은
  `02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`가 정본이다.
- GPT의 기본 작업공간·branch 기본값·최종 Git 적용 방식은
  `02_PIPELINES/GPT_격리작업공간_실행규칙_v1.md`가 공통 실행 정본이다.
- pipeline schema·evidence·closure 연결은
  `02_PIPELINES/공통파이프라인_실행계약_v1.md`와 `archive/tools/pipeline-core/`가 담당한다.
- agent/provider 실행 수·동시성·phase isolation·freeze·launch/recheck·retry/fallback 및
  provider 실행은 [`AGENT_BUDGET.md`](../../archive/tools/pipeline-core/AGENT_BUDGET.md)가
  유일한 실행 정본이다.
- **Meta/L3/L4 작업은 RPM Primary v1.0을 선조회한다.** `01_CANONICAL/taxonomy/rpm-primary-v1.0/`은 `LOCKED` semantic path reference authority이며, 신규 L3/L4·HOLD를 판정하기 전에 `README.md` → `00_POLICY/CANONICAL_MASTER.json` → 대상 curriculum/scope view를 확인한다.
- L1/L2의 표준단원·세부단원 authority는 기존 `표준단원키 마스터`와 `세부단원 운영규칙`이 유지한다.
- L3/L4/CrossConcept/Condition/alias/curriculum binding의 **production machine-key 정의·승격·검증 authority**는 `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md` + `archive/data/meta-foundation/canonical/`이다.
- 강제 조회 순서는 **source+verified solution → RPM Primary semantic path → 학년/과목별 RPM→ACTIVE crosswalk → current ACTIVE PT/TPL + curriculum binding validation → reuse/migration 판단 → 둘 다 없을 때만 신규 taxonomy gap**이다. RPM path는 있는데 ACTIVE key/binding만 빠진 경우는 `RPM_PRIMARY_MIGRATION_GAP`이며 새 수학 유형 부재로 보지 않는다.
- **RPM→ACTIVE CROSSWALK FIRST LOOKUP HARD:** RPM path를 확정한 직후 `../../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/`에서 정확한 학년/과목 JSON을 먼저 조회한다. `DIRECT_ACTIVE`는 mapped PT/TPL을 우선 사용하고, `FAMILY_ACTIVE`는 파일에 기록된 template 후보 안에서만 decisive step으로 선택한다. `DIRECT_BINDING_GAP` / `FAMILY_BINDING_GAP` / `RPM_ONLY`는 반복 전역검색이나 임의 신규 key 생성 없이 `RPM_PRIMARY_MIGRATION_GAP`으로 처리한다. crosswalk 이후에는 **current ACTIVE의 관련 row/binding만 targeted validation**하며, 관련 canonical/binding drift가 없으면 이미 계산된 mapping을 다시 전역 조사하지 않는다.
- 학생에게 노출되는 `solution`의 내용·표현·계산 전개·줄바꿈·기존 production 업그레이드 판정은
  `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`가 정본이다. 하위 해설/수정/review 문서의 과거 예시가 충돌하면 이 정본을 우선한다.
- L3/L4/CrossConcept semantic assignment의 FINAL authority는 **decision-isolated input bundle + item-level semantic evidence + deterministic validator**의 결합으로만 생성한다.
- 같은 stage의 기존 candidate/templateKey/CrossConcept suggestion/heuristic hint를 semantic decision 입력으로 사용한 결과는 구조 검사가 PASS여도 semantic authority가 아니다.
- `sourceReadStatus` 같은 모델 자기보고만으로 FINAL을 허용하지 않으며, validator 미구현·미실행 상태에서는 semantic FINAL/PASS/promotion을 금지한다.
- Middle Geometry `96e4605d` / `93bc935f` L4·CrossConcept 산출물은 `SUPERSEDED_INVALID_SEMANTIC_PROVENANCE` negative regression fixture이며 현재 authority로 사용하지 않는다.

이 실행 권위는 신규 기출 JS 추출·변환, 기존 JS 정리·업그레이드, 해설 생성·업그레이드,
visual triage, SVG 생성·검수, 독립검수, 유사문항 작업, 최종 출시·봉인에 공통 적용한다.
유사문항은 별도 manifest와 별도 seal 프로젝트라는 Common Protocol의 경계를 유지한다.
각 작업 문서는 domain-specific 품질 규칙을 계속 담당하지만, 품질 단계나 batch 이름만으로
agent launch를 추가·분할·재시도할 권한을 만들 수 없다.

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 문항에만 적용)
3. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
4. `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
5. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
6. **`01_CANONICAL/taxonomy/rpm-primary-v1.0/README.md`**
7. **`01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json` + 대상 curriculum/scope view**
8. **`../../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/`의 정확한 학년/과목 crosswalk JSON**
9. `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
10. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
11. `02_PIPELINES/문제해설추출.md`
12. 필요 시 `02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md` 또는 `02_PIPELINES/JS_변환_프롬프트.md`
13. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
14. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
15. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`

### 기존 JS 해설 업그레이드

기존 production 업그레이드도 `02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`의
독립검수·source conflict·실렌더·봉인 조건을 공통으로 적용한다.

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
3. 해당 단원이 도형·그래프 대상이면 `04_VISUAL/도형추출.md` v3.0
4. 기하 문항이면 `04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md` (visual necessity·교육용 시각화·독립 semantic review)
5. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
6. L3/L4/CrossConcept/Condition 메타를 생성·수정·검수하는 작업이면 `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
7. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
8. `02_PIPELINES/해설프로토콜.md`
9. `02_PIPELINES/JS_문항품질_업그레이드.md`
10. 도형의방정식 대상이면 `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` (v1.2 최소 SVG 좌표 parity 보강 부록 포함)
11. `03_REVIEW/무결성검수.md`

### 수정·최종 출시

1. `01_CANONICAL/프로젝트_컨텍스트.md`
2. `02_PIPELINES/수정프로토콜.md`
3. `02_PIPELINES/작업방식_적응형배치루프_v1.md` (현재 배치 크기·UID 중복·revision·canonical 판정 기준)
4. `02_PIPELINES/작업방식_5문항배치루프_필수.md` (legacy compatibility reference; 고위험 문항의 3~5문항 축소 루프에만 참조)
5. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
6. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
7. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`
8. `03_REVIEW/무결성검수.md`
9. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 제작·수치·style·publication)
10. 기하 문항이면 `04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md` (visual necessity·pedagogy·semantic independent review)
11. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
12. `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` (v1.2 최소 SVG 좌표 parity 보강 부록 포함, 해당 시)

## 2. 디렉터리별 역할

| 디렉터리 | 의미 | 현재 기준 |
|---|---|---|
| `01_CANONICAL/` | 모든 작업이 공유하는 기준 원본 | 운영 기준 |
| `02_PIPELINES/` | 추출·변환·해설·수정 실행 규칙 | 작업 종류별 적용 |
| `03_REVIEW/` | 구조·수학·메타데이터·최종 무결성 검수 | 검수 단계별 적용 |
| `04_VISUAL/` | 표·도형·그래프·SVG 제작과 검수 | 해당 문항에만 적용 |
| `05_DESIGN/` | 향후 엔진·시스템 구현 설계 | 구현 승인 전 참고 |
| `90_ARCHIVE/` | 레거시·DRAFT·대체된 이전 버전 | 현재 기준 아님 |

`02_PIPELINES/코드검사실_…통합운영프로토콜…`은 시험지 작업 전체를 조율하는 상위 운영 기준이다. 개별 추출·해설·수정 문서는 이 통합 기준의 세부 실행 모듈로 본다.

Meta Foundation은 RPM semantic taxonomy reference와 production machine-key canonical data를 분리한다.

- **선조회 semantic taxonomy:** `01_CANONICAL/taxonomy/rpm-primary-v1.0/` — `LOCKED` RPM Primary L1~L4 reference. 신규 L3/L4 또는 HOLD 판정 전에 반드시 해당 curriculum/scope를 먼저 확인한다.
- **RPM 전체 master:** `01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`
- **RPM→ACTIVE deterministic crosswalk:** `../../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/` — RPM path 확정 직후 exact 학년/과목 파일을 조회하는 재탐색 방지 reference. production authority 자체는 아니며 current ACTIVE 관련 row/binding으로 targeted validation한다.
- 운영규칙 정본: `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
- 실제 Meta Foundation production machine-key 정본: `../../archive/data/meta-foundation/canonical/`
- RPM path가 있는데 ACTIVE `problemTypeKey/templateKey` 또는 binding이 없는 상태는 **migration gap**이다. 기존 RPM 의미를 무시하고 임의 신규 key를 만들거나 `META_PACK_GAP_HOLD`로 닫지 않는다.
- 대단원별 L3/L4 정본: `../../archive/data/meta-foundation/canonical/packs/`
- 공용 CrossConcept 정본: `../../archive/data/meta-foundation/canonical/concepts/`
- 전역 compiled 결과: `../../archive/data/meta-foundation/compiled/` — 기계 생성 파생본이며 직접 수정 금지
- runtime 통계·usage·audit: `../../archive/data/meta-foundation/runtime/`

Meta Foundation의 `Pack / Shard / Compiled / Ownership` 세부 계약은 Foundation 운영규칙 v1만 authoritative source로 사용한다.

좌표·점·직선·교점 등 수학적 SVG의 제작자는 `04_VISUAL/도형추출.md`의 EXPECTED FACT·좌표 모델
준비를, 독립검수자는 `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`의 v1.2 최소
coordinate parity 부록을 함께 적용한다. render/asset PASS는 SVG geometry 수학 PASS를 대체하지 않는다.

## 3-1. 실렌더 게이트

최종 PASS·ZIP 봉인은 코드 구조나 엔진 capability 확인만으로 선언하지 않는다. 통합 프로토콜의 `REAL RENDER GATE` 순서에 따라 기준본 잠금 후 `exam / solution / answer`를 실제 브라우저에서 확인하고, 수정 후 최종 ZIP 추출본에서 세 화면을 다시 모두 확인한다.

- 필수 화면 상태: `PASS / WARN / FAIL / NOT_TESTED`
- 최종 PASS 조건: 세 필수 화면 모두 PASS + 후반 문항·마지막 페이지·MathJax·이미지 decode 확인
- `NOT_TESTED`: 1차 구조 단계에서는 기록 가능하지만 최종 PASS·봉인 불가
- `internal-review-live.html`: 사용 가능한 경우 별도 확인, 없으면 `NOT_APPLICABLE` 또는 `NOT_TESTED` 사유 기록
- 실제 증거: `reports/browser_render_check.md` 또는 동등한 캡처·출력물·렌더 로그

## 3. 기준 원본

현재 신규 작업의 기준은 다음 canonical 문서와 canonical data의 조합이다.

- `01_CANONICAL/JS아카이브룰북_v2.6.md`
- `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
- `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
- `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
- `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
- `04_VISUAL/도형추출.md` v3.0 (그래프·도형·hybrid 세부 수치와 출판 gate의 canonical source)
- `archive/data/master_tables/js_archive_tag_master.json`
- `archive/data/meta-foundation/canonical/`의 ACTIVE Pack / Concept Shard / Condition Registry

L1/L2의 실제 key와 parent는 기존 master가 정본이고, L3/L4/CrossConcept/Condition/alias/curriculum binding은 Meta Foundation canonical data가 정본이다.
`archive/data/meta-foundation/compiled/`는 ACTIVE canonical source를 합친 read-only 파생본이므로 사람이 직접 수정하지 않는다.
마스터 테이블과 Meta Foundation data는 데이터 계약이고, 룰북·운영규칙은 그 데이터를 사용하는 정책 계약이므로 하나의 거대 문서로 합치지 않는다.

## 4. 중복 규칙을 읽는 방법

추출, 해설, 품질개선 문서에는 공통적으로 수식·solution·SVG·기존 production 보호 규칙이 나타날 수 있다. 범위·보호 필드와 데이터 계약은 canonical 룰북, 독립 검수·동일 SHA·coverage·release/seal HARD gate는 Common Protocol, pipeline schema·evidence·closure 연결은 `공통파이프라인_실행계약_v1.md`와 pipeline-core, agent/provider 실행 토폴로지는 [`AGENT_BUDGET.md`](../../archive/tools/pipeline-core/AGENT_BUDGET.md)를 기준으로 한다. 작업별 pipeline과 review는 이 권위 관계를 약화할 수 없다. 배치 크기와 revision의 현재 세부 기준은 적응형 배치 문서다. 그래프 style token·sampling·출판 수치와 geometry stroke·indicator·hatching·3D·hybrid 규칙은 `04_VISUAL/도형추출.md` v3.0만 authoritative source로 사용한다.
L3/L4/CrossConcept/Condition/alias/curriculum binding 및 Pack/Shard/Compiled/Ownership 충돌은 `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`를 우선한다.

### 4-1. 충돌 방지 고정 규칙

- 신규 `choices`에는 ①~⑤ 등 보기 번호를 넣지 않는다. 배열에는 보기 내용만 저장하고 번호 표시는 엔진이 담당한다.
- 3차 메타데이터 검수에서 문서 내부 간이 단원표·기억·과거 예시는 사용하지 않는다. `JS아카이브_표준단원키_마스터테이블.md`와 compiled master를 직접 대조하고, 둘이 불일치하면 `SOURCE_PACK_DRIFT`로 FAIL 처리한다.

## 5. 역사 문서 처리

`90_ARCHIVE/`의 문서는 삭제하지 않고 당시의 설계·판정 근거로 보존한다. 현재 작업의 규칙으로 자동 적용하지 않는다. 특히 `DRAFT`, `LEGACY snapshot`, `v1.0` 문서는 새 작업 기준이 아니다.

- `90_ARCHIVE/JS아카이브_Metadata_Contract_v2_SUPERSEDED_20260919.md`는 2026-09-16 시점의 저장계약 기록이다. 2026-09-19 Meta Foundation v1 채택으로 L3/L4·CrossConcept·Condition·alias·curriculum binding authority가 대체되었으므로 현재 운영 판정에 사용하지 않는다.

## 6. 무결성 관리

`MANIFEST.md`는 이 디렉터리의 현재 운영 문서 목록과 SHA-256을 기록한다. 문서 이동·통합 후에는 누락 파일, 오래된 경로, 해시 불일치를 확인하고 manifest를 다시 생성한다.

## 7. archive 인접 문서의 경계

다음 문서는 규칙팩에 복사하지 않고 구현 코드 옆에 유지한다.

- `../../archive/tools/README.md`: 실제 검사 도구와 실행 명령의 안내
- `../../archive/tools/past-exam-pipeline/README.md`: PDF→candidate 파이프라인 실행 안내
- `../../archive/tools/past-exam-pipeline/docs/PAST_EXAM_PIPELINE_V2_POLICY.md`: 해당 도구의 구현 정책
- `../../archive/tools/js-bank-cleanup/README.md`, `../../archive/tools/tag-enrichment/README.md`: 각 도구의 실행·출력 계약

다음 영역은 현재 규칙으로 승격하지 않는다.

- `../../archive/_generated/`: 자동 생성된 inventory·audit·review 결과
- `../../archive/textbook/`: 교재 전용 파이프라인과 결과
- `../../archive/archive/docs/`: historical rulebook·구현계획·이전 설계
- `../../archive/analysis/`: 특정 작업의 분석·계획 메모
