# JS아카이브 세부단원 운영규칙 v1

> 상태: `ACTIVE`
>
> 적용일: 2026-08-22
>
> 목적: 표준단원 아래의 세부단원 메타데이터를 신규 아카이브 JS에 일관되게 적용하고, 기존 문항과의 호환·회귀·롤백 기준을 고정한다.

## 1. 기준 원본

세부단원 운영의 기준 원본은 다음 순서로 해석한다.

1. `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
2. `archive/data/master_tables/js_archive_tag_master.json`
3. 이 문서
4. `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md` 및 관련 검수 프로토콜

마스터 Markdown은 사람이 검토하는 원본이고, production JSON은 도구가 읽는 컴파일 산출물이다. 두 파일의 키·부모·라벨이 다르면 자동 적용을 중단하고 마스터를 먼저 재생성한다.

구 파일명 `# JS아카이브 표준단원키 마스터 테이블.md`는 legacy 문서다. 신규 작업은 underscore 파일명만 사용한다.

## 2. 신규 JS 문항 필수 스키마

신규 candidate 및 production 문항은 기존 기본 필드와 세부단원 필드를 모두 가진다.

```js
{
  id,
  level,
  category,
  originalCategory,
  standardCourse,
  standardUnitKey,
  standardUnit,
  standardUnitOrder,
  questionType,
  layoutTag,
  tags,
  wide,
  content,
  choices,
  answer,
  solution,
  subUnitKey,
  subUnit,
  subUnitConfidence,
  subUnitClassificationDepth
}
```

기본값은 다음과 같다.

- `questionType: ""`
- `layoutTag: "grid"`
- `tags: []`
- `wide: false`
- 판단이 보류된 세부단원은 빈 값을 임의로 채우지 말고 candidate report와 review 상태로 남긴다.

`conceptClusterKey`, `problemTypeKey`, `templateKey`, `difficultyBucket` 및 provenance·review 상태 필드는 별도 승인된 확장 필드다. 신규 JS에 넣을 때는 master 등록 여부와 사용 목적을 함께 확인한다.

## 3. 세부단원 필드 의미와 허용값

| 필드 | 의미 | 허용값/검사 |
|---|---|---|
| `subUnitKey` | 표준단원 내부의 공식 세부단원 키 | production master에 존재해야 함 |
| `subUnit` | 세부단원 표시명 | master 라벨과 일치해야 함 |
| `subUnitConfidence` | 분류 근거 수준 | `existing_preserved`, `candidate_evidence`, `category_or_cue_inferred`, `rule_inferred` |
| `subUnitClassificationDepth` | 분류가 도달한 계층 | `complete_candidate`, `complete_category`, `complete_documented`, `complete_rule` |

`subUnitKey`는 반드시 `standardUnitKey`의 자식이어야 한다. `standardUnitKey`는 canonical standard-unit table의 키이거나, taxonomy 확장표와 compiled master에 함께 문서화된 extension parent 키일 수 있다. 하나의 세부단원을 여러 표준단원에서 재사용하려면 별도 master 레코드를 만들고 parent 관계를 명시한다.

## 4. 예외와 legacy 정책

- 기존 JS는 일괄 재작성하지 않는다.
- 기존 문항의 `content`, `choices`, `answer`, `solution`, `image`, `layoutTag`, `wide`는 세부단원 작업으로 수정하지 않는다.
- 이미 분류된 legacy 파일은 현재 필드가 없더라도 `legacy_exception`으로 보고할 수 있다.
- `RAW-*`, `RRAW-*`, `UNMAPPED-*`는 정식 master 키가 아니다. 명확한 대응 키가 없을 때만 예외로 유지하고 자동 추천·자동 시험지 구성에서 제외한다.
- extension parent 키는 compiled master의 `subUnitKey.standardUnitKey`로 직접 확인되는 경우에만 허용한다. canonical 키는 master의 `standardUnit`·`standardUnitOrder`를 그대로 검사하고, extension parent는 parent 관계·세부단원 라벨을 우선 검사한다.
- 표준단원키 자체가 비어 있거나 비표준인 문항은 세부단원 값을 부여하더라도 `standardUnit_review` 예외로 남긴다.
- 예외는 파일·문항 번호·사유·재검토 조건을 report에 기록한다.

## 5. 작업 흐름

```text
source/candidate 생성
→ 원문·정답·해설 검수
→ standardUnit master 검증
→ subUnit master 검증
→ confidence/depth 부여
→ candidate QA
→ 사용자 승인 또는 review_pass
→ production JS 반영
→ db.js 확인
→ question-index 재생성
→ exam/sol/ans 렌더링 QA
```

candidate와 production 파일이 모두 존재하면 최종적으로 byte-equal이어야 한다. 내용이 다른 candidate는 자동 병합하지 말고 production을 기준으로 차이를 report에 기록한다.

## 6. sidecar와 파일 크기 원칙

문항 JS에는 검색·렌더링·분류에 필요한 최종값만 둔다. `matchedCues`, 점수, runner-up, margin, 모델별 원문, 전체 provenance와 같은 상세 근거는 다음 sidecar/report에 둔다.

- `archive/_generated/intelligence/phase3/complete-subunit-classification/`
- `archive/data/master_tables/`

문항별 상세 근거를 JS에 반복 저장하거나, 메타데이터 추가를 위해 questionBank 전체를 무관하게 재직렬화하지 않는다.

## 7. 완료 게이트

신규 파일은 다음을 모두 통과해야 한다.

- JS syntax 및 Node VM 로드 통과
- 문항 수·id·순서 정합
- 기본 필수 필드 존재
- 세부단원 4개 필드 존재 및 타입 정합
- `subUnitKey`가 production master에 존재
- `subUnit`이 master 라벨과 일치
- `standardUnitKey`와 세부단원 parent 일치
- content/choices/answer/solution/image 보호 필드 diff 없음
- candidate/production parity 통과
- db.js의 파일·학교·학년·과목·문항 수 정합
- question-index 문항 수 정합
- exam/sol/ans 렌더링 및 이미지 경로 QA 통과

## 8. 이전 기준점 (최종 예외 종료 전)

2026-08-22 현재 운영 JS를 기준으로 inventory는 433개 파일·10,576문항이며, source exclusion 정책을 적용한 세부단원 스냅샷은 431개 파일·10,522문항이다. 실제 문항 검토 반영 후 스냅샷 digest는 `9d6f9b13ac88be1063735ab374bf41aede2d6e9e0e45a646c5a50bb50f11c3c6`다.

최종 예외 종료 전에는 다음 항목을 정식 master 승격 대상이 아니라 별도 예외로 유지했다.

- low-margin 또는 uncertainty 분류 문항
- 비표준 표준단원키 문항
- `RRAW-숫자의나눗셈-CORE` 1개 세부단원 키(정식 대응 보류)
- candidate는 있으나 production 매핑이 없는 9개 파일
- 분류 대상 범위 밖의 기존 JS

기존 `함수-FUNCTION_BASIC` 1건은 `H22-A-02-FUNCTION_BASIC`으로 canonicalize해 더 이상 예외가 아니다. 최신 잔여 gap의 문항 위치·재검토 조건은 `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-master-gap-v1.json`을 기준으로 한다.

이 예외를 해결하기 전에도 신규 파일은 본 운영규칙을 통과해야 하며, legacy 예외를 신규 파일의 기본값으로 복사하지 않는다.

## 2026-08-22 실제 문항 검토 후 기준 갱신 (이력: 최종 예외 종료 전)

예외 196건을 실제 문항 본문·정답·해설로 대조해 195건을 운영 JS에 반영했다. 반영 시 `standardUnitKey`, `standardUnit`, `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth`만 갱신했으며 content·choices·answer·solution·image 보호 필드는 변경하지 않았다.

- 운영 적용: 31개 JS / 195문항
- 잔여 예외: `RRAW-숫자의나눗셈-CORE` 1문항(정식 단원 대응이 불명확해 보류)
- 현재 세부단원 스냅샷: 10,522문항, 공란 0, taxonomy gap 0
- 운영 QA: 모든 핵심 게이트 통과(`rawAndUnmappedExplicitlyIsolated` 포함)
- 기준 보고서: `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json`

## 2026-08-22 최종 예외 종료

보류했던 유형 파일 25번(`$2024^{10}$을 $2023$으로 나눈 나머지`)을 나머지정리의 수치 적용으로 확인해 `H15-SA-02-REMAINDER_FACTOR`로 승격했다. 운영 JS의 세부단원 정식화가 완료되어 현재 잔여 raw/unmapped 예외는 0건이다.

- 최종 스냅샷: 10,522문항, 공란 0, taxonomy gap 0, digest `adc418d0dfe41ac2c775d245643499bf51ff39a445740df0022c54b72c16e9cd`
- 누적 적용: 196문항, 보호 필드 변경 0건, candidate/production parity 통과
- question-index: 10,576건 재생성 및 세부단원 필드 정합성 통과. 중복 ID 4개 파일을 원본 문항 순번 기준으로 정규화해 legacy qKey 충돌 0건으로 정리했다.
- question identity map/runtime: 10,576건 고유, identity digest `e30d41608477e39761fb1fcc919819605387014beb9a2b2e6e8f8dbbddbe88b7`
- master gap: 정식 추가 0건, raw/unmapped 0건
- ID 정규화 보고서: `archive/_generated/intelligence/phase3/archive-question-id-normalization-v1.json` (중복 ID 그룹 0건, legacy qKey 충돌 0건)
- QA: 모든 운영 게이트 통과, commit/push 없음

## 2026-08-24 현재 운영 기준 재생성 및 잔여 164문항 완료

2026-08-24 중간 점검에서 확인한 7개 파일·164문항의 누락 세부단원 필드를 문항별로 확정했다. original 4개 파일 98문항은 문항의 표준단원·category·본문 단서를 기준으로, similar 3개 파일 66문항은 파일 내 category와 현행 master rule을 기준으로 매핑했다. 원본이 없는 similar 문항에 새로운 출처 메타데이터를 만들지는 않았다.

- 운영 JS 변경 범위: `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth`만 변경
- 보호 필드: `content`, `choices`, `answer`, `solution`, `image` diff 0건
- 현재 complete classification: 438개 파일·10,686문항, 세부단원 공란 0건, taxonomy gap 0건
- 운영 QA: `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json`의 모든 게이트 통과
- question-index: 10,686건; identity map/runtime: 438개 파일·10,686 UID, UID 충돌 0건
- candidate parity: 매핑 후보 98개 파일·2,219문항 byte-equal, 비운영 후보 9개는 기존 보류 정책 유지
- 문항별 결정 ledger: `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-current-subunit-manual-rebaseline-v1.json`
- 현재 기준 source classification: `archive/_generated/intelligence/phase2/archive-classification/archive-hierarchical-classification-v1.json`; 기존 frozen snapshot은 `archive-hierarchical-classification-frozen-20260822.json`으로 보존

DB의 `emptySchool` 28건·필수 메타 gap 60건은 출처 근거가 확보될 때까지 별도 `sourceDependentOnly` deferred 목록으로 유지한다. fallback 차단 28건은 다음 수동 adjudication 절차로 처리한다.

## 2026-08-24 fallback 차단 28건 수동 adjudication 완료

이전 fallback-safety baseline에서 자동 승격을 막았던 28건을 실제 문항 본문·보기·정답·해설로 전수 검토했다. baseline은 보존하고, 운영 JS에는 세부단원 메타데이터 4개 필드만 최소 반영했다.

- 대상: `M2-04` 5건, `M2-08` 9건, `M3-03` 14건 / 총 28건
- 실제 키 교정: 4건 (`M2-04` 1건, `M2-08` 3건)
- 키 교정의 핵심: y축과 평행한 직선은 두 직선의 교점·연립방정식 관계가 아니므로 `M2-04-LINEAR_FUNCTION_BASIC`으로 분류한다. 경기 종료 순서·주사위 순서쌍을 나누어 세는 확률 문항은 `M2-08-PROBABILITY_COUNTING`으로 분류한다.
- 근거 등급: 28건 모두 `category_or_cue_inferred` / `complete_category`
- 보호 필드: `content`, `choices`, `answer`, `solution`, `image` diff 0건
- 문항별 ledger: `archive/_generated/intelligence/phase3/fallback-adjudication/archive-subunit-fallback-manual-adjudication-v1.json`
- effective safety: `archive/_generated/intelligence/phase3/fallback-adjudication/archive-subunit-fallback-safety-effective-v1.json`
- QA: complete classification 438개 파일·10,686문항, 공란 0·taxonomy gap 0, candidate parity 98개 파일·2,219문항, question-index/identity runtime 10,686건, 대상 25개 파일 exam/sol/ans audit 통과

이 단계에서도 master table·DB·commit·push는 변경하지 않았다. 기존 `archive-subunit-fallback-safety-audit-v1.json`은 자동 fallback이 차단되었던 baseline으로 보존하고, 현재 운영 판정은 effective safety 보고서를 기준으로 한다.

## 2026-08-25 10,690문항 기준선 재고정

삼산중 q21~q24 추가 이후 10,686건으로 남아 있던 complete-subunit classification/operational QA 산출물을 현재 운영 JS 기준 10,690건으로 재생성했다. inventory, question-index, identity map/runtime, current classification, fallback overlay, complete classification, operational QA가 모두 438개 파일·10,690문항 기준으로 맞는다.

- inventory digest: `bc133cc9dc6d1b3850b0cde21825600c64254e0e0b55f58ce61424df053a4ff6`
- identity digest: `560011d68cb89ce20b71d584d390b7caae29bbfa4fc84ce0bc3673fb5f7a8225`
- complete classification digest: `b046927362492a02fe95f877e13856de7da9068a346173584599e272304d1d9b`
- operational QA digest: `dcc3b4c8205ebce27a4cc08264c692ebe0cdf6e919377ca5bdf1abfe7e390c11`
- 결과: 세부단원 공란 0, taxonomy gap 0, production/index field mismatch 0, identity join 실패 0
- 분류기 보정: 기존 운영 JS의 승인된 `subUnit` 표시명을 taxonomy label로 덮어쓰지 않고 보존
- source JS·DB·master·commit/push/deploy는 변경하지 않았으며, source-dependent `emptySchool` 28건·필수 gap 60건은 기존 보류 정책을 유지한다.
