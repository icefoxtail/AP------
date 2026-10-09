# 문제은행 프로젝트 — 생성문항 Meta 저장 누락 실측 감사 및 보강 계약

> 감사일 2026-10-09. 실측 범위: main Generated Consumer `archive/data/generated-lite-consumer/v1/index.json` 323개 UID, 54개 shard 전수. 본 문서는 **운영 상태 진단**과 **신규 등록 수정 계약**이며, 기존 승인/수학 품질을 소급 PASS 처리하지 않는다.

## 1. 실제 누락

| 저장 위치·필드 | 존재/323 | 분류 |
| --- | ---: | --- |
| Consumer question.standardUnitKey | 323 | 교육과정 표준단원, RPM L1 아님 |
| Consumer question.subUnitKey | 323 | 세부단원, 기존 shard의 l2 bucket |
| Consumer question.level | 323 | legacy 하·중·상 |
| Consumer question.difficultyBucket | **316** | 1~5 숫자. 7개 미기재 |
| Consumer question.L1/L2/L3/L4 | **각 0** | 현재 question에 명시적 RPM 계층 없음 |
| Consumer question.crossConceptKeys | **0** | 설계→등록 전달 누락 |
| Consumer question.conditionKeys / integrationPattern | **각 0** | 설계→등록 전달 누락 |
| Consumer question.problemTypeKey | **183** | 유형 확장 필드 일부만 전달 |
| Consumer question.templateKey | **177** | 템플릿 확장 필드 일부만 전달 |
| Consumer record.rpmPrimary | **317** | 별도 record의 부분적 RPM 분류. question L1~L4 저장과 동일하지 않음 |
| Consumer record.l2(bucket) | **323** | physical shard bucket 식별자, canonical RPM L2와 이름 충돌 주의 |

누락된 difficultyBucket은 **효천고 q18 3 UID**, **효천고 q20 4 UID**이다: `ALITE-20261008-HYC26-Q18-001/002/004`, `ALITE-20261008-HYC26-Q20-001/002/003/004`. 미검증 1~5값을 `level`에서 환산·조작하지 않는다.

팔마고 QID9 DESIGN JSON(Q02/Q03/Q04)에는 `crossConcepts` 및 일부 `conditionKeys`·`integrationPattern`이 존재한다. 반면 QID9 Consumer shard의 question에는 위 명시 필드가 없다. 이는 제작 내용이 반드시 없다는 뜻이 아니라 **출시 projection으로 전달되지 않은 증거**다.

## 2. 팔마고 기존 27 후보: main에 존재하지만 23 미승격

- `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/candidates/B01_... ~ B07_.../`: 27 후보 실제 main 저장.
- `archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/manifest.json`: **4 승인/23 HOLD**. 이 23은 단순히 미병합된 브랜치가 아니라, **main에 후보 상태로 저장**되었으며 Consumer에 **미등록**.
- 과거 content review **26 PASS/1 SVG HOLD**는 당시 내용 검토 결과. 23 모두가 수학 FAIL이라는 뜻이 아니다. 학생용 정확한 RPM/PT/TPL/Generated 확장 유형 projection 미결과 관련 수리·최신 품질확인·필수 SVG 렌더가 남아 있다.
- 별개 신규 QID9 36개(q01~q04)는 뒤에 승인 Consumer 등록돼 현재 팔마고 40개(기존 B07 4+신규 36). 기존 HOLD 23과 절대 합산하지 않는다.
- 다음 기존 23건 처리: source 후보·SHA 유지 → 기존 검수 PASS 영향/변경 여부만 구분 → 실제 필요한 L3/L4/Generated EXT-L4, CrossConcept, difficulty·PT/TPL 및 1개 SVG/quality finding 최소 보정 → 승인 UID와 HOLD 분리 → 승인분 Consumer DB/Chrome/main. 단순 field string 복사로 품질 PASS·promotion 조작 금지.

## 3. 신규 Generated CREATE→REVIEW→MAIN 저장 완결 HARD 계약

1. 제작 전/후 실제 설계 판단을 기계적으로 보존한다: (a) 교육과정·`standardUnitKey/subUnitKey`, (b) **canonical RPM `L1/L2/L3/L4` 또는 증거로 결속된 Generated EXT-L4**, (c) `difficultyBucket` 정수 1..5 및 legacy `level`, (d) `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern`, (e) 가능한 `problemTypeKey/templateKey` 또는 검증된 명시적 대응 보류.
2. `crossConceptKeys`와 `conditionKeys`가 필요 없다면 `[]`, 통합 패턴이 없으면 `NONE`처럼 **명시적 적용 없음**으로 저장한다. 누락과 NONE은 구별한다. 메타를 설계에 사용했으면 source shard/metadata와 Student Consumer projection에서 같은 UID로 추적 가능해야 한다.
3. 기존 Consumer `l2`는 **subUnitKey 기반 storage bucket 호환값**으로 남기고, 새로운 `L2`는 실제 RPM semantic parent로 별도로 저장한다. 두 값을 같은 키라고 위조하지 않는다.
4. 등록 시 `design/meta final → generated source shard → Consumer record.question & retrieval index` 항목별 동등성, uid·source SHA·review SHA와 근거를 확인한다. 인덱스가 L1~L4로 검색하려면 실제 검색 projection에도 해당 키를 배포한다. 외부 sidecar에만 메타를 남긴 상태를 COMPLETE로 쓰지 않는다.
5. 신규 UID에 required Meta가 없으면 `META_PERSISTENCE_HOLD`로 해당 UID 학생용 등록을 보류한다. 다른 승인 UID와 생성 lane은 중단하지 않는다. 생성 GPT에 입력이 없는 키를 추측해서 만들지 않는다.
6. 이전의 승인 323건은 이 규칙만으로 전체 품질 PASS를 취소하거나 source를 재작성하지 않는다. 323개 **metadata backfill ledger**를 운영 품질 ledger와 분리하고 exact evidence가 있는 필드부터 점진적으로 보정한다. 미검증 5단계 난이도 7건과 누락된 CrossConcept를 임의 채우지 않는다.

## 4. 현재 기술적 상태

- **2026-10-09 증분 구현:** `archive/tools/generated-meta-retention-gate.cjs`가 신규(outside 323 legacy cutover) UID의 source JS + approved Meta + Consumer record/question + index 동일 UID, 상세 Meta값 및 SHA projection, 1~5 난이도, 명시 NONE/[]와 누락 차이, Generated EXT-L4 원장 및 실재 RPM DRAFT authority 파일/bytes SHA를 검사한다. `tests/generated-meta-retention.test.cjs`와 `.github/workflows/generated-consumer-browser-smoke.yml`에 CI 검증을 연결했다. 코드 커밋: `87d8dd1`, RPM DRAFT 거짓 LOCKED 방지 보완 `1ed8ad9`.
- **구현 완료 범위 정확화:** 이 단계는 신규 UID 배포 전 정적 CI **검출 게이트**다. 승인 Meta source 등록 adapter의 자동 작성, 실제 검색용 L1~L4 쿼리/검색 projection, 기존 승인 323 UID 누락값 backfill, 팔마고 HOLD 23 승격을 완성했다는 뜻은 아니다. review evidence SHA는 현재 값 존재·형식만 확인하므로 실제 review artifact bytes 결속은 후속 강화 대상이다. 기존 323개는 `meta-retention-cutover-20261009.json`을 따라 명시적으로 **LEGACY_NOT_RECERTIFIED**다.
- 다음 작업은 Generated CREATE payload schema 및 register adapter에서 확정 Meta 직접 보존, source/Consumer/index 신규 항목 실배포, 검색 index에서 상세 Meta 조회, 레거시 근거 기반 UID별 백필에 국한한다. UID Meta parity validator는 신규 정적 CI 기초 구현 상태이며 source review bytes·활성 정본 키 대조는 후속 보강한다. 원본 기출·RPM LOCKED·기존 승인 source 본문은 보호한다.
- 관련 정본: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`, `alive/06_EXECUTION/ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md`, `docs/architecture/Problem_Bank_Storage_And_Retrieval_Current_v1.md`.
