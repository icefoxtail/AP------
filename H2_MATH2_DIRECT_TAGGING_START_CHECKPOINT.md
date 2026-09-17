# 고2 수학II Metadata Foundation 시작 checkpoint

## 작업 경계

- `TARGET_GRADE`: 고2
- `CURRICULUM_SCOPE`: 수학II
- `CURRICULUM_KEY`: 2015
- `TARGET_BRANCH`: `codex/metadata-foundation-h2-math2-main`
- `START_SHA`: `2bfd552a9f839b17dafc56bbbdb8fadd9f2b3256`
- `origin/main`과 `START_SHA` 일치: `true`
- `SOURCE_ROOT`: `archive/exams/original/high/h2`
- `ASSET_ROOT`: `archive/assets/images`

## 실제 분모 재확정

파일명으로 분모를 추정하지 않고 `SOURCE_ROOT` 아래 모든 원본 JS를 로드한 뒤,
source의 `standardCourse === "수학II"`인 문항만 포함했다.

- 원본 JS 스캔: 86개
- 수학II 원본 시험지: 28개
- 실제 문항 분모: 631문항
- 고유 source identity: 631개
- source load/parse 오류: 0건
- 중복 stable UID: 0건
- 중복 source key: 0건

기존 `docs/reports/math2-metadata-inventory-20260907.md`의 475문항은 이전
`origin/main` 기준 evidence이므로 이번 작업의 분모 authority로 사용하지 않는다.
최신 main에 추가된 수학II 원본 7개 시험지와 156문항을 포함한 현재 스캔 결과가
이번 작업의 denominator다.

## Authority freeze

- canonical authority:
  `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`
- canonical SHA-256:
  `0409c489f167211f961cc14811c204f2056511f4c029091feddfdc8384c367bf`
- canonical status/version: `LOCKED / RPM_PRIMARY_TAXONOMY_v1.0`
- compiled master:
  `archive/data/master_tables/js_archive_tag_master.json`
- compiled master SHA-256:
  `68459ea08b79b0935271afdb079e72fc7e28aa3faff6a200e0e565dff850fd8a`
- rule manifest:
  `docs/rules/MANIFEST.md`
- rule manifest SHA-256:
  `5fd369663ba4d055c4a9b290618ebe4c78895797a2715c1c8b925a174d46e449`

## 생성된 시작 artifact

- source-only manifest:
  `archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/source_manifest.json`
- manifest SHA-256:
  `0ef72c3659cd0ec0d1acb81070dcadc403e8322bfa9f757e197c9684cef8938e`
- worklist summary:
  `archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/worklist_summary.json`
- batch 구성: 20문항 × 31개 + 마지막 11문항 = 32개 batch
- 첫 작업 목록:
  `archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/worklists/batch-001.json`

manifest에는 문제·보기·정답·해설·필요 image/SVG/table 참조와 source/file
fingerprint만 보존한다. 기존 L1/L2/L3/L4, primaryConcept, difficulty,
classifier/staging/review 결과는 A/B direct tagging의 semantic 입력에서 제외했다.

## 현재 진행 상태

```text
SOURCE_IDENTITY_FREEZE = COMPLETE
A_DIRECT_TAGGING       = NOT_STARTED
B_DIRECT_TAGGING       = NOT_STARTED
FULL_DIFF               = NOT_STARTED
MOTHER_CLOSURE          = NOT_STARTED
PRODUCTION_PROMOTION    = NOT_RUN
```

`productionWriteAllowed=false`를 유지한다. Metadata Foundation 단계에서는
source JS, answer/solution, image/SVG/table, DB, question-index를 수정하지 않는다.
정상 문항의 최종 후보는 L1/L2/L3, primaryConcept, difficultyBucket(1~5)를
필수로 하고, exact L4가 없을 때만 근거 있는 L4 gap을 허용한다.
