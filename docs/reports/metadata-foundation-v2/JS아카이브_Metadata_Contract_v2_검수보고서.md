# JS아카이브 Metadata Contract v2 검수보고서

검수일: 2026-09-16  
대상: `docs/rules/01_CANONICAL/JS아카이브_Metadata_Contract_v2.md`  
결과: **PASS — LOCKED**

## 1. 실제 읽은 코드와 데이터

| 자료 | 확인 내용 |
|---|---|
| `archive/unit-past-exams-core.js` | profile unit hierarchy, direct/raw key map, source identity, legacy difficulty, subUnit parent-scope validation |
| `archive/tools/intelligence/build-approved-question-metadata-v1.mjs` | source join, fingerprint, classification/review inputs, field별 precedence, conflict/cardinality gates, JSON/runtime write |
| `archive/data/master_tables/js_archive_tag_master.json` | current compiled legacy subUnit/concept master; RPM taxonomy v1.0과 동일시하지 않음 |
| `archive/data/question_metadata.json` | 11,034 generated records, current v1 status and explicit holds |
| `archive/question-meta.js` | runtime lookup/merge/conflict behavior |
| `archive/data/question_identity_map.json` | canonical UID/source tuple input, 11,034 records |
| `archive/_generated/.../archive-complete-subunit-classification-v1.json` | 11,026 classified records, `productionWriteAllowed=false` |
| `archive/engine.html`, `archive/mixer.html` | source JS load 후 runtime sidecar await 및 merge 위치 |

## 2. Precedence 판정

실제 builder의 field별 precedence를 코드에서 재구성했다.

- standard course/unit: source 우선, classification은 빈 값 보완
- subUnit: source → reviewed pass → classification
- concept cluster: source → reviewed → unchanged-source carry-forward → classification
- problem type: reviewed → source `problemTypeKey` → source `typeKey` → carry-forward
- template: reviewed → source → carry-forward
- current v1 difficulty field: source `difficultyBucket` → source `difficulty` → source `level` → reviewed → carry-forward
- runtime merge: source question의 non-empty 값 우선, sidecar는 빈 값 보완;
  source/sidecar disagreement는 `_archiveMetadataConflicts`와
  `SOURCE_CONFLICT_HOLD`

특히 subUnit 관련 source 우선 precedence는 실제 builder lines 175–199와
runtime `question-meta.js` lines 25–42에서 확인했다.

## 3. Contract 판정

| 검수축 | 결과 |
|---|---|
| identity minimum (`questionUid`, source file/ordinal/fingerprint) | PASS |
| curriculum/course 및 L1~L4 canonical fields | PASS |
| secondary concepts/applicability/default selection | PASS |
| difficulty 4-field storage contract | PASS |
| legacy level preservation | PASS |
| taxonomy bridge | PASS |
| authority/precedence table | PASS |
| runtime read location | PASS |
| conflict blocking conditions | PASS |
| metadata-only scope | PASS |

## 4. Legacy implementation gaps recorded, not silently promoted

현재 v1 sidecar가 완성된 v2 data set이라는 주장은 하지 않는다.

- source H1 identity map에는 source JS가 없는 `test-fixtures/render-authority-golden.js` 8 records가 남아 있다.
- current H1 source scan은 113 files / 2,498 questions지만 identity map에는 112 files / 2,478 records가 있다. 누락 file은 `original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js` 20 questions다.
- current classification 11,026건은 identity 11,034건과 8건 차이가 있다.
- current source JS에는 `level`은 있으나 numeric v2 difficulty 4-field가 전수 존재하지 않는다.

이 항목들은 contract ambiguity가 아니라 data-branch adoption 전의 명시적
reconciliation gate로 기록했다. 따라서 contract authority를 오염시키지
않으며, 실제 migration 전에 반드시 해소한다.

## 5. P0/P1와 LOCK

- P0: 0
- P1: 0
- contract lock: PASS
- production metadata write: 이번 단계에서는 수행하지 않음

canonical lock path:

`docs/rules/01_CANONICAL/JS아카이브_Metadata_Contract_v2.md`
