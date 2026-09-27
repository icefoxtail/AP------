# 원문 판독에서 태그를 채우고 해설에서 다시 조정하기

발문을 정확히 옮기는 작업자는 이미 문제·선지·수식·그림을 읽는다. 같은 읽기에서
근거가 있는 태그를 최대한 작성하고 해설 단계에서 다시 판단한다. 키워드만 보고
단원을 자동 추정하는 별도 분류기가 아니다. 판독 작업자가 아래 구조를 채우면
추출기가 canonical key·parent·course·교육과정·ACTIVE binding·enum을 검증하고
실제 JS에 저장한다.

## 첫 판독의 입력

각 page extraction JSON 문항에 `initialMetadata`를 넣는다.

```json
{
  "displayNo": "1",
  "content": "다항식 $P(x)=x^2+2x+1$에서 $x$의 계수는?",
  "choices": ["0", "1", "2", "3", "4"],
  "initialMetadata": {
    "confidence": "high",
    "reason": "다항식의 계수를 직접 묻는 발문을 읽고 다항식의 연산으로 분류했다.",
    "sourceExcerpts": ["다항식", "계수"],
    "values": {
      "standardUnitKey": "H22-C-01",
      "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC",
      "tags": ["기출", "계수"],
      "difficultyBucket": 1,
      "difficultyConfidence": "medium",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "NORMAL",
      "level": "하"
    },
    "unresolvedFields": [
      { "field": "problemTypeKey", "reason": "ACTIVE 유형의 정의와 실제 풀이를 비교해 재검토한다." },
      { "field": "templateKey", "reason": "풀이 골격을 확인한 뒤 대응 템플릿을 결정한다." }
    ]
  }
}
```

`initialMetadata` 외 필수 판독/그림 bbox 필드는 기존 extraction schema를 따른다.
과목/교육과정, L1/L2, conceptClusterKey, ACTIVE L3/L4, CrossConcept/Condition,
integrationPattern, category/originalCategory/tags, 난이도 예상과 layout을 넣을 수 있다.
L1 표시명/순서와 L2 표시명은 master에서 채운다. 파일 제목의 과목이 manifest에
없으면 제목과 원본 경로에서 과목/학년/연도를 보조 판독한다. 원문 표지와 다른 경우
manifest를 실제 원문 기준으로 먼저 정정한다. 해설·정답은 이 단계에 저장하지 않는다.

명확한 유형과 템플릿이 이미 ACTIVE에 있으면 L3/L4도 작성한다. 키가 없거나
의미/parent/binding이 맞지 않으면 임의 key를 만들지 않고 사유를 기록한다.
난이도 예상은 level에서 역산하지 않는다. 판단이 안 된 필드와 단순 기본값은
`fieldStatus`에 `DEFERRED_TO_SOLUTION`로 남는다. 기존 입력에 initialMetadata가
없어도 추출은 가능하지만 `FIRST_PASS_UNCLASSIFIED`를 명시하며 1차 분류 완료라고
보고하지 않는다. 예약 작업은 모든 문항에 초기 판단 또는 미결 사유를 공급한다.

실제 canonical catalog를 좁혀 조회한다.

```powershell
node archive/tools/past-exam-pipeline/source-metadata.mjs catalog --course 공통수학1 --curriculum 2022 --unit H22-C-01 --out <조회.json>
```

## 저장되는 상태

JS에는 원래 metadata 필드를 채우면서 아래 상태를 함께 저장한다.

```js
metadataStatus: "SOURCE_FIRST_PASS",
metadataReviewRequired: true,
tagStatus: "manual_review",
sourceMetadataFirstPassSha: "sha256:..."
```

`reports/source_metadata_first_pass.json`은 전 문항의 원문 fingerprint,
1차 projection, confidence, 발문 인용, 근거, 미결 필드와 상태를 보존한다.
초기 난이도·유형 예상은 최종 canonical 판단으로 취급하지 않는다.
보고서는 JS·문항 에셋과 함께 전용 intake branch에 경량 기록으로 커밋한다.

## 해설 작성 후 재조정

실제 풀이·해설에서 새 primaryMethod/decisiveStep와 난이도를 먼저 판단한다.
초기 태그를 정답으로 보고 풀이를 맞추지 않는다. 새 판단을 고정한 뒤 이전 snapshot과
비교하고 유지/수정 이유를 기록한다. 기존 RPM→ACTIVE resolver와 independent blind
difficulty의 최종 evidence는 그대로 필요하다.

`build-completion-evidence.mjs`는 source-first marker가 있는 문항에 대해
`source_metadata_solution_recheck_draft.json`도 만든다. 이 draft에는 이전 태그 값을
노출하지 않는다. 단독 생성과 반영은 다음 명령을 사용한다.

```powershell
node archive/tools/past-exam-pipeline/source-metadata.mjs recheck-draft --working-exam <실제이름.js> --out <새판단draft.json>
node archive/tools/past-exam-pipeline/source-metadata.mjs reconcile --working-exam <실제이름.js> --manifest <작업manifest.json> --decision <새판단.json>
```

새 판단은 모든 metadata 필드의 projection, 해설의 실제 인용과 이유를 채운다.
이전의 값을 기본값으로 자동 복사하지 않는다. `priorTagsVisibleDuringFreshDecision`
값은 false이고 source/solution SHA가 현재 입력과 같아야 한다.
source layout은 이 명령으로 변경하지 않는다.

반영 후 `metadataStatus=SOLUTION_RECONCILED`, `metadataReviewRequired=false`가 되고
`reports/solution_metadata_reconciliation.json`에 이전/현재 값과 변경 필드가 기록된다.
이 상태도 독립검수 PASS 또는 production 승인이 아니다.

공용 prepare는 두 보고서를 byte-bound dependency로 묶는다. 첫 snapshot을 지우거나,
해설/태그를 재검 뒤 수정하거나, 재조정 기록 없이 finalization을 시도하면 거부한다.
해설이나 태그를 다시 수정하는 경우 새 판단과 `--revision 2`처럼 다음 revision을
지정한다. 각 revision은 `reports/metadata-reconciliation/revision-001.json` 등에
불변 이력으로 남기고 현재 보고서는 최신 revision을 가리킨다. 기존 freeze/invalidation/
recheck 절차에 따라 바뀐 입력의 검수 증거를 다시 수집한다.
