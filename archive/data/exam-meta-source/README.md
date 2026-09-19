# Exam Meta Source

시험지 JS 제작과 동시에 작성하는 문항 메타 원본이다.

## 위치

시험지 JS와 같은 상대 경로를 `sourceArchiveFile`에 기록하고, 메타 파일 자체는 이 디렉터리 아래 어디에 두어도 된다.
운영 시에는 시험지 경로를 그대로 미러링하는 것을 권장한다.

예:

- JS: `archive/exams/original/high/h1/2final/26_매산고_2학기_기말_고1_기출.js`
- META: `archive/data/exam-meta-source/original/high/h1/2final/26_매산고_2학기_기말_고1_기출.meta.json`

## 원칙

- JS production schema에는 Meta Foundation 필드를 추가하지 않는다.
- 한 메타 파일은 해당 시험지의 전체 문항을 1:1로 포함한다.
- `sourceOrdinal`은 JS 배열의 1-based 순번이다.
- `APPROVED` 문항은 `sourceFingerprint`가 현재 JS와 정확히 일치해야 한다.
- 기존 canonical L3/L4/CrossConcept/Condition만 `APPROVED`할 수 있다.
- 신규 key 또는 애매한 판정은 `CANDIDATE_REQUIRED` / `REVIEW_REQUIRED`로 둔다.
- Candidate는 자동 canonical 승격하지 않는다.

## 최소 예시

```json
{
  "schemaVersion": "archive-exam-meta-source-v1",
  "sourceArchiveFile": "original/high/h1/2final/26_매산고_2학기_기말_고1_기출.js",
  "reviewStatus": "APPROVED",
  "questions": [
    {
      "sourceOrdinal": 1,
      "sourceQuestionNo": "1",
      "sourceFingerprint": "<sha256>",
      "standardUnitKey": "H22-C2-07",
      "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
      "problemTypeKey": "PT_FUNCTION_VALUE",
      "templateKey": "TPL_FUNCTION_VALUE_DIRECT",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "NORMAL",
      "crossConceptKeys": [],
      "conditionKeys": [],
      "integrationPattern": "DIRECT",
      "reviewStatus": "APPROVED"
    }
  ]
}
```

`python archive/build_db.py` 원클릭 파이프라인이 DB → UID → 이 메타 ingest → approved metadata → question-index → Archive2 catalog → Meta Foundation 검증 순서로 처리한다.

## 신규 시험 강제 규칙

이 기능 도입 이전부터 존재했지만 아직 canonical identity에 들어오지 않은 파일만
`legacy-unmanaged-source-files.json`에 고정 기준선으로 남긴다.

기준선에 없는 새 시험 JS는 대응하는 `.meta.json`이 없으면
`sync-question-identity-map-v1.mjs` 단계에서 fail-closed 한다.
즉 앞으로는 새 JS만 추가하고 메타를 빼먹은 상태로 원클릭 빌드를 PASS할 수 없다.
이 legacy 기준선은 빌드가 자동으로 늘리지 않는다.
