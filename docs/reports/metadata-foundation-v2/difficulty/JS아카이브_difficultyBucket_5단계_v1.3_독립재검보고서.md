# JS아카이브 difficultyBucket 5단계 v1.3 독립재검보고서

작성일: 2026-09-16  
검수 대상: docs/proposals/metadata-foundation-v2/difficulty/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md  
candidate SHA-256: 0167011c17e3058143a160f88bc6ee83363dfc1e4836c0152a2216041fc1771d  
canonical: docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md  
canonical SHA-256: 507b5de4838abf310dec40e66ab1036e4c968408b436a8e4648db6dd2c186f63  
판정: PASS — canonical LOCK 완료

## 1. v1.3 준비

Downloads에 v1.3 원본이 존재하지 않아, 사용자의 명시 지시에 따라 저장소의 v1.2 candidate를 기준으로 v1.3 candidate를 직접 만들었다.

v1.3은 다음 범위만 수정했다.

- final_bucket ← difficultyBucket mapping 추가
- builder / generated metadata / runtime sidecar의 canonical field명을 camelCase 4개로 명시
- blind_bucket을 blind first-pass evidence 전용 report field로 명시
- canonical difficultyBucket report export를 final_bucket으로 고정
- 문서 제목·candidate 상태·수정 요약·STATUS를 v1.3으로 갱신

v1.0~v1.2의 난이도 정의, enum, 경계, blind 판정, persistence, reviewed_pass gate, taxonomy/level 관계는 재설계하지 않았다.

## 2. DF-001~DF-005 재검

- DF-001: PASS — difficultyBucket 값과 UNKNOWN/HOLD 상태 분리
- DF-002: PASS — difficultyConfidence / difficultyBoundaryFlag / legacyLevelCompatibility canonical field 통일
- DF-003: PASS — BORDERLINE_ACCEPTABLE enum·전이·순수 difficulty boundary와의 분리
- DF-004: PASS — 4개 canonical field의 canonical metadata persistence 및 generated/runtime sidecar parity
- DF-005: PASS — 4개 report mapping, camelCase 4개, blind_bucket evidence-only 의미 고정

v1.3 §24 최종 계약:

- final_bucket ← difficultyBucket
- difficulty_confidence ← difficultyConfidence
- difficulty_boundary_flag ← difficultyBoundaryFlag
- legacy_level_compatibility ← legacyLevelCompatibility

추가로 다음을 명시했다.

- builder / generated metadata / runtime sidecar canonical field명은 camelCase 4개
- blind_bucket은 blind first-pass evidence용 report field
- blind_bucket은 canonical difficultyBucket export가 아님
- canonical difficultyBucket report export는 final_bucket으로만 고정

## 3. 30개 절 전수재검 결과

| 번호 | 검수축 | 판정 |
|---:|---|---|
| 1 | 기존 level 하/중/상 보존 | PASS |
| 2 | difficultyBucket 1~5 의미 | PASS |
| 3 | 1→하 / 2,3→중 / 4,5→상 | PASS |
| 4 | 1↔2 경계 | PASS |
| 5 | 2↔3 경계 | PASS |
| 6 | 3↔4 경계 | PASS |
| 7 | 4↔5 경계 | PASS |
| 8 | 계산량만으로 난이도 상승 금지 | PASS |
| 9 | solution 길이로 판정 금지 | PASS |
| 10 | 기출 중심 난이도 | PASS |
| 11 | curriculum-relative | PASS |
| 12 | blind first-pass | PASS |
| 13 | first-pass freeze | PASS |
| 14 | legacy level compare | PASS |
| 15 | strong conflict 처리 | PASS |
| 16 | same-type outlier | PASS |
| 17 | difficultyConfidence | PASS |
| 18 | difficultyBoundaryFlag | PASS |
| 19 | independent recheck | PASS |
| 20 | 분포 강제 금지 | PASS |
| 21 | L1 작업 단위·drift 방지 | PASS |
| 22 | adaptive batch | PASS |
| 23 | metadata-only migration | PASS |
| 24 | source content fingerprint 불변 및 report parity | PASS |
| 25 | production apply | PASS |
| 26 | tagStatus / reviewStatus 관계 | PASS |
| 27 | Archive 2.0 UNKNOWN/HOLD 처리 | PASS |
| 28 | reviewed_pass 및 자동출제 gate | PASS |
| 29 | Foundation defect 처리 | PASS |
| 30 | Adoption gate | PASS |

총계:

- 30/30 PASS
- 추가 P0: 0건
- 추가 P1: 0건

## 4. 기존 authority와의 정합성

직접적인 의미 충돌은 확인되지 않았다.

- 기존 level 하/중/상을 유지한다.
- difficultyBucket은 level 대체 필드가 아니다.
- LEVEL BORDERLINE STABILITY LOCK을 유지한다.
- BORDERLINE_ACCEPTABLE은 기존 level과 신규 bucket의 인접 mismatch를 재검 후 허용한 경우에만 사용한다.
- 순수 difficulty boundary B12/B23/B34/B45와 legacy compatibility 상태를 분리한다.
- UNKNOWN은 미분류 sentinel이고 HOLD는 reviewStatus 상태다.
- metadata-only migration을 유지한다.
- source content fingerprint 불변 원칙을 유지한다.
- canonical metadata 4개 field의 persistence와 generated/runtime sidecar parity를 고정한다.
- reviewed_pass는 UNKNOWN, BORDERLINE_REVIEW 상태에서 금지한다.
- STRONG_CONFLICT는 independent recheck/adjudication 후에만 reviewed_pass가 가능하다.
- taxonomy v0.3 및 L1~L4 hierarchy를 수정하지 않는다.

대조한 기존 문서:

- docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md
- docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md
- docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md
- docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md
- docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md
- docs/plans/metadata-foundation-v2/JS아카이브_Metadata_Foundation_v2_통합실행계획서_v1.0.md

## 5. canonical LOCK 결과

canonical copy:

docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md

canonical 문서 상태:

LOCKED

proposal v1.3은 candidate/evidence로 보존했다.

## 6. 최소 참조 문서 갱신

상세 1~5 규칙을 복사하지 않고, 다음 문서에 v1.3 단일 authority 참조만 추가했다.

- docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md
- docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md
- docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md
- docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md
- docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md

추가로 canonical 문서가 직접 관리되는 인덱스와 manifest를 갱신했다.

- docs/rules/00_RULES_INDEX.md
- docs/rules/MANIFEST.md

MANIFEST에는 다음을 반영했다.

- 변경된 참조 문서의 현재 크기·SHA-256
- 신규 canonical v1.3의 크기·SHA-256

## 7. 무수정 범위

- taxonomy v0.3: 수정 없음
- archive/exams: 수정 없음
- production exam JS: 수정 없음
- production metadata: 수정 없음
- question_metadata.json: 수정 없음
- question-meta.js: 수정 없음
- js_archive_tag_master.json: 수정 없음
- Archive 2.0 code/runtime: 수정 없음
- UI: 수정 없음
- 기존 level 값: 수정 없음
- Metadata Contract v2: 작성하지 않음
- v1.0/v1.1/v1.2 candidate 및 기존 FAIL 보고서: 보존

작업 시작 시 이미 존재하던 archive SVG, report JSON, 테스트 파일 등의 tracked 변경은 건드리지 않았다.

## 8. 종료 상태

Taxonomy:
RPM Primary v0.3 기존 상태 유지

Difficulty:
v1.3 = LOCKED

Review:
30/30 PASS
P0 = 0
P1 = 0

Production migration:
NOT_STARTED

Next:
Metadata Contract v2

이번 작업은 difficulty authority 봉인까지만 수행했으며, 다음 작업인 Metadata Contract v2 작성은 시작하지 않았다.
