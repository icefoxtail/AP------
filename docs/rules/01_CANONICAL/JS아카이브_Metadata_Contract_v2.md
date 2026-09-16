# JS아카이브 Metadata Contract v2

상태: **LOCKED**  
authority: `METADATA_CONTRACT_V2 = LOCKED`  
작성일: 2026-09-16  
적용 범위: Metadata Foundation v2 이후의 canonical metadata 저장·검증·runtime bridge

이 문서는 실제 현재 HEAD의 source JS, classification output, generated
sidecar, runtime loader를 field-by-field로 대조한 저장 계약이다. 이 문서는
새 taxonomy나 새 difficulty 이론을 만들지 않는다. taxonomy authority는
`docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/`을, difficulty authority는
`docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`를
참조한다.

## 1. Scope와 상태

`questionUid + sourceArchiveFile + sourceOrdinal`을 하나의 collision-safe
source identity로 사용한다. canonical identity는 한글 label 하나가 아니라
`curriculumKey + courseKey + L1 + L2 + L3 + L4` 전체 경로다.

이 계약은 source exam JS의 content/choices/answer/solution/image를 수정하지
않는다. metadata-only migration에서 변경 가능한 것은 아래 계약 field와
그에 종속된 classification/review evidence뿐이다. source content fingerprint가
바뀌면 해당 L1의 적용을 닫지 않고 `FOUNDATION_DEFECT_CANDIDATE` 또는 source
재검으로 보낸다.

현재 v1 구현의 사실:

- `archive/data/question_identity_map.json`: 11,034 identity records
- `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json`: 11,026 classification records, `productionWriteAllowed=false`
- `archive/data/question_metadata.json`: 11,034 records,
  `APPROVED_PARTIAL_WITH_EXPLICIT_HOLDS`
- `archive/question-meta.js`: `question_metadata.json`을 fetch하여 UID와
  source-file/ordinal로 runtime lookup
- 현재 source JS에는 새 `curriculumKey`, `courseKey`, `L1`~`L4`,
  difficulty 4-field가 전수 저장되어 있지 않다. 이 문서의 LOCK은 schema와
  authority를 봉인하는 것이며, production adoption은 L1 단위 migration gate를
  통과한 뒤 수행한다.

## 2. Canonical record

아래 field는 v2 canonical metadata record의 저장 계약이다.

| Field | Required | 저장 의미 | 현재 HEAD 근거/상태 |
|---|---:|---|---|
| `questionUid` | 필수 | identity map의 canonical UID | identity map; runtime UID index |
| `sourceArchiveFile` | 필수 | `archive/exams/` 기준 normalized source path | identity map 및 builder `normalizeFile()` |
| `sourceOrdinal` | 필수 | source JS question array의 1-based ordinal | identity map 및 builder source join |
| `sourceFingerprint` | 필수 | source question bundle fingerprint | builder `content/choices/answer/solution/image` SHA-256 |
| `curriculumKey` | 필수 | `2015` 또는 `2022` | v2 migration field; 현재는 source course에서 derive |
| `courseKey` | 필수 | course-scoped canonical key | v2 migration field; current `standardCourse`와 동일시 금지 |
| `L1` | 필수 | canonical primary major unit | v1.0 taxonomy path |
| `L2` | 필수 | canonical primary mid unit | v1.0 taxonomy path |
| `L3` | 필수 | canonical primary concept | v1.0 taxonomy path |
| `L4` | 필수 | canonical primary problem type | v1.0 taxonomy path |
| `secondaryConceptKeys` | 필수 | primary 외 보조 concept key 목록 | v2 migration field; primary 중복 금지 |
| `curriculumApplicability` | 필수 | `DEFAULT_SCOPE`, `RPM_EXTENDED`, `RPM_EXTENDED_CANDIDATE` | taxonomy node policy에서 상속 |
| `defaultSelectable` | 필수 | 기본 출력 허용 여부 | applicability와 함께 저장 |
| `difficultyBucket` | 필수 | `1`~`5` 또는 `UNKNOWN` | difficulty v1.3 authority 참조 |
| `difficultyConfidence` | 필수 | `high`, `medium`, `low`, `UNKNOWN` | difficulty v1.3 authority 참조 |
| `difficultyBoundaryFlag` | 필수 | `NONE`, `B12`, `B23`, `B34`, `B45`, `UNKNOWN` | difficulty v1.3 authority 참조 |
| `legacyLevelCompatibility` | 필수 | `NORMAL`, `BORDERLINE_REVIEW`, `BORDERLINE_ACCEPTABLE`, `STRONG_CONFLICT`, `UNKNOWN` | difficulty v1.3 authority 참조 |
| `tagConfidence` | 필수 | metadata tag 확신도; 미판정은 `UNKNOWN` | v1 free-form 값은 migration 시 정규화 |
| `tagStatus` | 필수 | tag의 source/classification/review 상태 | 기존 status vocabulary를 보존하고 v2 상태와 혼동 금지 |
| `reviewStatus` | 필수 | `HOLD`, `reviewed_pass`, `reviewed_fail` 등 review 상태 | tagStatus와 분리 |
| `metadataRevision` | 필수 | record를 생성한 contract revision | builder/runtime parity 확인 |

`level = 하|중|상`은 폐기하지 않는다. 이는 historical legacy field로
source JS와 별도 compare에 보존한다. `level`은 v2 `difficultyBucket`의
저장값이 아니며, `1→하`, `2·3→중`, `4·5→상` compare의 입력이다.

`difficultyBucket=UNKNOWN`은 미판정 sentinel이고 `reviewStatus=HOLD`는
검수 중단 상태다. `HOLD`를 bucket 값으로 저장하지 않는다. difficulty의
의미·경계·recheck 규칙은 이 문서에 복제하지 않고 v1.3 authority를 참조한다.

## 3. Existing field와 canonical bridge

현재 repo의 `standardUnitKey`/`subUnitKey`는 교육과정·학년별로 계층 깊이가
일정하지 않다. 따라서 다음 기계적 치환은 금지한다.

```text
standardUnitKey == L1
subUnitKey == L2
```

v2 record는 legacy 값을 잃지 않고 다음 bridge를 함께 보존한다.

| Legacy/source field | v2 bridge | 규칙 |
|---|---|---|
| `standardCourse` / `course` | `courseKey` 후보 | source 값을 보존하되 curriculum/course mapping을 확인 |
| `standardUnitKey` | `legacyStandardUnitKey` | 기존 parent key 원문 보존 |
| `standardUnit` | `legacyStandardUnit` | 기존 표시명 보존 |
| `subUnitKey` | `legacySubUnitKey` | 기존 child key 원문 보존 |
| `subUnit` | `legacySubUnit` | 기존 표시명 보존 |
| `conceptClusterKey` | `secondaryConceptKeys` 또는 evidence | source 의미 확인 후에만 배치 |
| `problemTypeKey` / `typeKey` | `L4` 후보 evidence | 자동 동일시 금지 |
| `templateKey` | template evidence | canonical L4와 별도 축 |
| `level` | legacy compare input | `difficultyBucket`으로 자동 변환 금지 |

현재 `unit-past-exams-core.js`의 profile unit key와 direct map은 runtime
collection용 legacy compatibility layer다. 고1 예시로 `H15-SA-09`는
`H22-C2-01`로 map되지만, 이는 canonical taxonomy의 L1/L2 path를 의미하지
않는다. v2 migration map은 최소한
`curriculumKey, courseKey, legacyStandardUnitKey, legacySubUnitKey,
L1, L2, L3, L4, disposition, reason`을 가진다.

## 4. Authority와 precedence

### 4.1 계층별 authority 표

| 계층 | 작성자/생성자 | 입력 authority | override 가능 여부 | production runtime의 실제 읽기 위치 | conflict 차단 |
|---|---|---|---|---|---|
| source exam JS | archive source/promotion writer | 원본 시험 JS와 source identity | semantic metadata만 승인된 migration에서 변경; content/choices/answer/solution/image는 보호 | `archive/engine.html`이 DB file path의 JS를 먼저 load | source identity 또는 source content fingerprint 불일치 시 HOLD |
| reviewed metadata | 독립 review ledger | 문제·보기·visual·shared material·검수 solution을 읽은 `reviewed_pass` evidence | 승인된 semantic field에만 가능; source non-empty 값은 silent overwrite 금지 | builder 입력; runtime은 generated sidecar를 통해 간접 반영 | source/review disagreement는 conflict evidence와 reviewStatus 필요 |
| classified metadata | classification builder | source question + taxonomy master/rule output | candidate 상태로는 production override 불가 | `archive/_generated/.../complete-subunit-classification/...json`; builder 입력 | missing UID, invalid path, `productionWriteAllowed=false`이면 차단 |
| canonical generated metadata | `build-approved-question-metadata-v1.mjs` | identity map + source JS + classification + reviewed pass + prior carry-forward | source가 빈 field를 채우는 범위에서만 sidecar 생성; source 값 overwrite 금지 | `archive/data/question_metadata.json` | record cardinality/UID/source join/fingerprint/conflict 실패 시 builder 차단 |
| runtime sidecar | builder가 생성한 `archive/question-meta.js` | generated JSON | runtime이 source object의 non-empty 값을 바꾸지 않음; 빈 값만 merge | `archive/engine.html`/`mixer.html`이 script load 후 `__ARCHIVE_METADATA_READY__` 대기 | source와 sidecar가 모두 다르면 `_archiveMetadataConflicts`와 `SOURCE_CONFLICT_HOLD` |

### 4.2 실제 field별 precedence

현재 builder는 모든 field에 같은 순서를 적용하지 않는다. 아래 순서를
v2 migration과 validator의 기준으로 기록한다.

| Field group | 실제 builder precedence (높음 → 낮음) | runtime merge |
|---|---|---|
| `standardCourse` | source `standardCourse` → source `course` → classified | source non-empty 우선 |
| `standardUnitKey`, `standardUnit` | source → classified | source non-empty 우선 |
| `subUnitKey`, `subUnit` | source → reviewed pass → classified | source non-empty 우선; 다른 sidecar 값은 conflict hold |
| `conceptClusterKey` | source → reviewed → unchanged-source carry-forward → classified | source non-empty 우선 |
| `problemTypeKey` | reviewed → source `problemTypeKey` → source `typeKey` → unchanged-source carry-forward | source non-empty 우선; v2 review conflict 기록 필요 |
| `templateKey` | reviewed → source → unchanged-source carry-forward | source non-empty 우선 |
| current v1 `difficultyBucket` | source `difficultyBucket` → source `difficulty` → source `level` → reviewed → carry-forward | source non-empty 우선 |
| v2 difficulty 4-field | blind/rechecked canonical evidence → generated sidecar → runtime | legacy `level` 자동 fallback 금지 |
| `metadataRevision` | builder revision | generated/runtime 동일 값 |

현재 v1 builder의 `difficultyBucket` fallback이 `level=하|중|상`을 저장할 수
있다는 사실은 legacy implementation evidence다. v2 migration에서는 이
fallback을 numeric contract로 승격하지 않고, 기존 `level`을 별도 legacy
field로 보존한 뒤 `difficultyBucket` 4-field를 blind 판정 결과로 채운다.

## 5. Source identity와 fingerprint

1. `questionUid`는 identity map의 UID를 그대로 사용한다.
2. `sourceArchiveFile`은 slash/NFC-normalized archive-relative path다.
3. `sourceOrdinal`은 source question array 기준 1부터 시작한다.
4. source join은 파일과 ordinal로 source question을 다시 읽어 확인한다.
5. `sourceFingerprint`는 현재 builder에서 `content`, `choices`, `answer`,
   `solution`, `image`를 JSON serialize한 SHA-256이다.
6. `contentFingerprint`는 현재 generated sidecar의 audit companion으로
   `content`, `choices`, `image`를 fingerprint한다. v2 validator는 source
   content mutation 검출에 이를 함께 사용한다.
7. UID unique, source tuple unique, identity fingerprint parity가 모두 PASS가
   아니면 해당 batch는 닫지 않는다.

## 6. Taxonomy와 applicability 저장

primary path는 하나만 저장한다.

```text
curriculumKey + courseKey + L1 + L2 + L3 + L4
```

복합 문항의 추가 개념은 `secondaryConceptKeys`에 저장하고 primary를
복제하지 않는다. taxonomy package의 `RPM_EXTENDED`와
`RPM_EXTENDED_CANDIDATE`는 taxonomy에 보존될 수 있으며, 두 경우 모두
`defaultSelectable=false`다. 현행 기본 output은 `DEFAULT_SCOPE`만 사용한다.

문항의 historical source curriculum은 현행 교육과정 filter 때문에 삭제하지
않는다. `curriculumApplicability`는 taxonomy node와 문항 evidence를 함께
대조해 저장하며, 근거가 부족하면 `reviewStatus=HOLD`로 남긴다.

## 7. Write/read contract

### 7.1 Build

builder는 다음을 입력으로 삼는다.

```text
identity map
  + source exam JS
  + classified metadata
  + reviewed_pass metadata
  + unchanged-source carry-forward (fingerprint unchanged only)
  -> canonical generated metadata JSON
  -> runtime question-meta.js
```

현재 builder는 identity record마다 classification record와 source question이
있어야 한다. `question_identity_map.json` 11,034건과 current classification
11,026건처럼 집합이 다르면 v2 production builder는 PASS할 수 없다.
이는 data branch에서 별도 source identity reconciliation을 먼저 요구한다.

### 7.2 Runtime

`engine.html`은 시험 JS를 load한 다음 `window.__ARCHIVE_METADATA_READY__`를
기다리고, 각 question에 `mergeArchiveQuestionMetadata(question, ref)`를
적용한다. lookup 순서는 UID 우선, 그 다음 normalized source file + ordinal이다.
runtime은 generated sidecar를 source JS의 silent overwrite authority로
사용하지 않는다.

### 7.3 Conflict

- source fingerprint mismatch: batch HOLD
- source/classification subUnit conflict: builder block 또는 explicit HOLD
- source/review conflict: reviewStatus HOLD와 evidence 필요
- duplicate UID/source tuple: validator FAIL
- unknown difficulty bucket, invalid boundary, 또는 `difficultyBucket=HOLD`:
  validator FAIL
- `RPM_EXTENDED_CANDIDATE`의 defaultSelectable=true: validator FAIL

## 8. v2 migration adoption gate

이 문서가 LOCKED라는 사실만으로 현재 전체 archive가 v2 compliant라는 뜻은
아니다. 각 L1 closeout에서 다음을 확인한다.

- canonical L1→L4 path가 taxonomy v1.0에 존재
- legacy bridge가 기록되고 source key를 잃지 않음
- blind ledger가 first-pass freeze 전에 legacy values를 노출하지 않음
- difficulty 4-field가 v1.3 authority의 enum을 사용
- legacy level compare와 conflict/boundary adjudication이 freeze 후 수행됨
- generated JSON과 runtime sidecar가 UID/source tuple 및 field parity를 가짐
- source content fingerprint mutation = 0
- content/choices/answer/solution/image/SVG/layoutTag/wide 무수정
- validator와 JS syntax/JSON parse가 PASS

## 9. Code evidence index

필드·precedence 대조에 사용한 실제 HEAD 파일:

- `archive/unit-past-exams-core.js:17-35, 125-174, 214-244, 247-342, 480-520`
- `archive/tools/intelligence/build-approved-question-metadata-v1.mjs:17-23, 29-84, 87-107, 130-287`
- `archive/question-meta.js:1-56`
- `archive/engine.html:30-38, 1628-1643`
- `archive/mixer.html:778-785, 1933-1981, 2362-2370`
- `archive/data/master_tables/js_archive_tag_master.json`
- `archive/data/question_identity_map.json`
- `archive/data/question_metadata.json`
- `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json`

## 10. Lock decision

| Gate | 결과 |
|---|---|
| authority/precedence table complete | PASS |
| canonical field list complete | PASS |
| difficulty v1.3 referenced without rule duplication | PASS |
| legacy `level` retained and separated | PASS |
| taxonomy bridge defined without key-depth substitution | PASS |
| runtime read location confirmed from code | PASS |
| P0 | 0 |
| P1 | 0 |

`METADATA_CONTRACT_V2 = LOCKED`. Production/data adoption remains gated by the
L1 workflow and does not authorize a direct main-branch metadata rewrite.
