# JS아카이브 PHYSICAL EVIDENCE BEFORE PASS v1

- 적용일: 2026-10-01
- 상태: **ACTIVE / CURRENT HARD GATE**
- 적용 범위: JS Archive `CREATE / REVIEW1 / REVIEW2 / REVIEW3(R3)`, 수동 GPT 작업, 예약 GPT 작업, Codex 검수 handoff
- 목적: **검수자가 적은 N/N 자기보고가 아니라 최종 artifact에 결속된 item-level physical evidence가 있어야 PASS가 성립하도록 한다.**
- 즉시 적용: 별도 파일럿·유예기간 없음. 현재 진행 중인 R1/R2/R3부터 적용한다.

---

## 0. 최상위 원칙

`PASS 선언 → 근거 작성` 순서를 금지한다.

고정 순서:

```text
실제 final bytes / source / canonical 직접 확인
→ qid별 physical evidence row 작성
→ SVG별 expected fact ↔ actual geometry 검증
→ runtime string / small-board / Meta evidence 검증
→ validator가 evidence completeness와 artifact SHA를 재계산
→ validator PASS
→ 그 결과로만 stage PASS / DONE receipt 생성
```

다음은 PASS 근거가 아니다.

- `22/22 확인`, `14/14 SVG PASS` 같은 집계 숫자만 존재
- 이전 CREATE/R1/R2 receipt의 PASS
- 이전 worker의 ledger 요약
- SVG에 필요한 숫자·라벨 문구가 적혀 있다는 사실
- Meta field가 채워져 있다는 사실
- syntax PASS / 파일 존재 / 문항수 일치만 확인
- 예약 시간 종료에 맞추기 위한 DONE 처리

**집계 N/N은 item-level row에서 기계적으로 파생된 값만 인정한다.**

---

## 1. Stage 완료를 열 수 있는 최소 물리 증거

CREATE/R1/R2/R3에서 완료 상태를 기록하려면 다음이 모두 필요하다.

- **무결함 완료:** `*_DONE / PASS / READY_FOR_* / R3_PASS`
- **문항별 미해결을 명시한 완료:** CREATE/R1/R2에 한해 `*_DONE_WITH_ITEM_HOLDS` 허용. 단 HOLD가 있는 모든 qid/axis는 아래 HOLD physical evidence를 완전하게 가져야 한다.
- **R3 release:** `itemHoldCount=0`만 허용한다. HOLD가 하나라도 있으면 R3 PASS 금지.

시간 부족·검수 미완료는 ITEM_HOLD가 아니다. 이 경우 checkpoint만 남기고 stage 완료 receipt를 만들지 않는다.

1. 최종 exam artifact path + SHA
2. denominator `questionCount=N`
3. qid별 `questionRows` 정확히 N개
4. linked `solutionImage`가 X개면 `visualRows` 정확히 X개
5. qid별 `metaRows` 정확히 N개
6. stage별 independence evidence
7. `archive/tools/review-evidence-gate.mjs` 결과 `ok=true`
8. validator가 읽은 exam SHA가 receipt가 가리키는 final artifact와 동일

worker가 `N/N`을 직접 입력했다고 해서 위 조건을 대체할 수 없다.

### 시간 부족 / 예약 종료

한 회차 안에 evidence row를 모두 채우지 못했으면 **stage DONE receipt를 만들지 않는다.**

허용:
- final candidate 또는 checkpoint를 물리 Git ref/blob에 보존
- 완료한 qid/axis와 미완료 qid/axis를 명시
- 다음 run이 같은 artifact/checkpoint에서 이어서 검수

금지:
- 시간이 끝났다는 이유로 남은 row를 PASS로 채움
- `22/22` 집계만 적고 item evidence 생략
- 예약 1회 = 시험지 1개 완료를 품질보다 우선

**예약작업에도 완화 규칙은 없다. 수동 직접 지시 작업과 동일 gate를 적용한다.**

---

## 2. qid별 question evidence

전 문항에 다음 축을 각각 독립 row로 남긴다.

- `sourceExact`
- `answerMath`
- `solutionMath`
- `smallBoard`
- `curriculum`
- `visualNecessity`
- `meta`
- `difficulty`
- `runtimeString`

각 축은 `PASS` 또는 명시적 `HOLD`다.

PASS 최소형:

```json
{
  "status": "PASS",
  "evidence": "실제로 확인한 사실·계산·authority ref"
}
```

HOLD 최소형:

```json
{
  "status": "HOLD",
  "holdEvidence": {
    "reason": "실제 reason code",
    "observedEvidence": "직접 확인한 source/math/asset 사실",
    "unresolvedPoint": "현재 유일하게 닫히지 않은 점",
    "nextRequiredEvidenceOrCapability": "무엇이 추가되면 닫히는지",
    "repairAttempted": "실제로 시도한 deterministic repair",
    "authorityLookupAttempted": "실제로 조회한 source/canonical/binding",
    "whyDeterministicClosureImpossible": "왜 추측 없이 닫을 수 없는지"
  }
}
```

`status=PASS`인데 evidence가 비어 있으면 PASS가 아니고, `status=HOLD`인데 위 holdEvidence가 불완전하면 유효한 HOLD가 아니다.

한 축의 PASS로 다른 축의 결함을 덮지 않는다.

---

## 2.1 SOURCE VISUAL SUFFICIENCY / HOLD ADMISSION — HARD

problem image가 연결된 qid는 “파일이 있음/없음” 또는 “crop이 완전/불완전”만 기록하지 않고 **수학적 source-truth sufficiency**를 분리해 남긴다.

권장 evidence:

```json
{
  "assetRefExists": true,
  "assetSha": "git-blob-or-sha256",
  "cropCompleteness": "COMPLETE | PARTIAL",
  "decisiveFactsRequired": ["..."],
  "decisiveFactsVisibleOrRecovered": ["..."],
  "decisiveMissingFacts": [],
  "alternateEvidenceChecked": ["content", "choices", "answer", "visible-geometry"],
  "sourceTruthSufficiency": "SUFFICIENT | REPAIRABLE | BLOCKED",
  "holdAdmission": "NO_HOLD | ASSET_REPAIR_REQUIRED | ITEM_HOLD"
}
```

판정 원칙:

- `cropCompleteness=PARTIAL`이어도 `sourceTruthSufficiency=SUFFICIENT`이면 HOLD 금지.
- current runtime에서 full-page source를 못 연 사실만으로 `BLOCKED` 금지.
- `ITEM_HOLD`는 `decisiveMissingFacts[]`가 실제로 있고 다른 source 축으로 유일복구가 안 되는 경우만 허용.
- `SOURCE_ASSET_MISSING`은 실제 referenced asset file 부재에만 사용.
- R1/R2와 ITEM_RECOVERY는 upstream hold count를 authority로 사용하지 않고 qid별 sufficiency를 새로 판정한다.

2026-10-01 `24_금당중_2학기_중간_중3_수학.js`의 11개 crop HOLD는 이 구분이 없어서 발생한 false-positive regression 사례다.

---
## 3. Runtime string HARD GATE

JS source code에 보이는 문자열과 실제 브라우저/engine이 소비하는 **runtime 문자열을 구분**한다.

반드시 JS를 실행 가능한 sandbox에서 평가한 뒤 다음 필드를 검사한다.

- `content`
- `choices[]`
- `answer`
- `solution`

특히 다음 계열의 runtime double slash는 FAIL이다.

- `\\dfrac`, `\\frac`, `\\sqrt`
- `\\in`, `\\notin`, `\\subset`
- `\\cap`, `\\cup`, `\\mid`
- `\\ell`, `\\ne`, `\\qquad` 등

source exact parity도 가능하면 **최종 runtime content/choices vs frozen source truth**로 확인한다.

파일 텍스트끼리만 눈으로 비교하고 PASS하지 않는다.

---

## 4. 작은칠판 PHYSICAL STRUCTURE GATE

`smallBoardAuditCount=N/N`만으로 PASS 금지.

원문이 다음 구조이면 solution도 대응 구조가 실제 문자열 block으로 분리되어야 한다.

- ㄱ / ㄴ / ㄷ / ㄹ
- (1) / (2) / (3)
- 경우 1 / 경우 2
- (가) / (나) 조건별 판정이 풀이 핵심인 경우

최소 확인:

1. 각 판단/소문항이 독립 줄 또는 문단으로 분리
2. 설명 뒤 결정 계산은 별도 줄
3. 핵심 등식·부등식 전개가 중간식 없이 점프하지 않음
4. 조건 적용·탈락 이유가 계산 근처에 있음
5. 최종 결론이 긴 계산 끝에 붙어 있지 않음
6. MathJax 내부 가짜 개행 없음

정적 linter가 잡을 수 있는 구조 결함은 사람이 PASS로 덮을 수 없다.

---

## 5. SVG / solutionImage — EXPECTED FACT ↔ ACTUAL GEOMETRY

### 5.1 텍스트 라벨만 보고 PASS 금지

`solutionImage`가 연결된 모든 SVG는 다음 evidence를 남긴다.

- `assetPath`
- `assetSha256`
- `expectedFacts[]`
- `observedFacts[]`
- `checks[]`
- `result`

`expectedFacts`는 source + 독립 풀이 + final solution에서 먼저 동결한다.

`observedFacts`는 SVG의 실제 primitive 좌표·위상·원본 픽셀에서 계산한다.

### 5.2 geometry PASS에 필요한 실제 계산 예

문항에 해당되는 항목을 직접 계산한다.

- 직선: 실제 두 점의 `dx/dy`, 기울기, 표시된 점이 실제 선 위인지
- 수직: 기울기 곱 또는 방향벡터 내적
- 평행: 방향벡터/기울기 비교
- 점: 실제 좌표와 라벨 좌표 일치
- 내분/외분: 실제 점 좌표가 비율식 만족
- 중점: 좌표 평균
- 원: 중심·반지름·점의 원 위 여부
- 접선: 접점이 원 위 + 반지름과 접선 수직
- 대칭: 대칭축에 대한 실제 좌표 대응
- 교점: 두 식/두 primitive 관계 동시 만족
- angle/owner: 각도 라벨의 vertex·ray owner가 실제 위상과 일치
- 원본 그림: source pixel과 의미요소·라벨 owner·crop parity

### 5.3 PASS evidence method

최소 하나 이상의 check가 다음 실제 검증 method를 사용해야 한다.

- `COORDINATE_COMPUTE`
- `TOPOLOGY_COMPUTE`
- `SOURCE_PIXEL`
- 필요 시 `TARGETED_RENDER`

`TEXT_LABEL_ONLY`는 PASS 근거로 금지한다.

### 5.4 SHA 결속

visual evidence의 `assetSha256`는 **검수한 실제 final SVG bytes**와 일치해야 한다.

SVG 수정 후 예전 evidence를 재사용하지 않는다.

---

## 6. Meta — NULL-BUT-RESOLVABLE 금지

각 qid는 기존 metadata를 정답으로 보기 전에 다음을 fresh evidence로 남긴다.

1. `primaryMethod`
2. `decisiveStep`
3. RPM Primary L3/L4 판정
4. 학년/과목 crosswalk 조회
5. GLOBAL ACTIVE taxonomy/templates 조회
6. exact curriculum binding 조회
7. CrossConcept / Condition / IntegrationPattern 판단
8. difficulty blind evidence

### 6.1 null field

`problemTypeKey` 또는 `templateKey`가 null이면 반드시 `nullReason`과 lookup evidence가 있어야 한다.

다음은 즉시 FAIL이다.

```text
final JS field = null
AND lookup result = unique EXACT_ACTIVE reusable mapping
```

즉 `META_NULL_BUT_RESOLVABLE`.

반대로 RPM semantic은 결정됐지만 projection이 실제로 없는 `RPM_ONLY / BINDING_GAP`은 기존 CURRENT 규칙대로 비차단 Meta debt가 될 수 있다. 이때도 lookup evidence는 생략하지 않는다.

---

## 7. 독립검수 evidence

### CREATE

CREATE self-check도 physical evidence를 남긴다. 단 CREATE PASS는 REVIEW PASS의 authority가 아니다.

### R1

- CREATE receipt의 N/N을 정답으로 사용하지 않는다.
- source/current artifact를 직접 열어 qid row를 새로 만든다.
- CREATE ledger는 fresh 판정 이후 regression compare에만 사용한다.

### R2

R2는 특히 다음을 강제한다.

```text
latest R1 artifact bytes 직접 읽기
→ R1 ledger/repair detail 보기 전
→ R2 qid evidence + visual expected facts + Meta semantic decision freeze
→ blindFreezeSha256 물리 저장
→ 그 뒤 R1 ledger / 이전 R3 packet과 compare
```

`blindDecisionFrozenBeforeR1Compare=true`와 `blindFreezeSha256`가 없으면 R2 DONE 금지.

### R3 INITIAL vs R3_RETRY

**initial R3**는 시험지 전체를 보는 마지막 전수 release audit다.
- 전 문항 questionRows / visualRows / metaRows를 fresh 생성하고 `review-evidence-gate.mjs --stage R3` full validator PASS를 요구한다.

**R3_RETRY**는 initial R3 FAIL 이후 targeted regression이다.
- `R3_BASELINE`의 PASS scope를 잠근다.
- `openQids/openFiles/openFields/openAxes/directDependencies`와 실제 changed locus만 재검한다.
- LOCKED scope는 semantic row를 다시 만들지 않고 baseline blob/hash와 불변인지 확인한다.
- 필수 retry evidence: `r3BaselineArtifactSha`, `openScope`, `changedScope`, `reviewedOpenScope`, `lockedScopeMutationCount=0`, `closedFailureCodes`, `outputArtifactSha`.
- full `questionRows=N`을 다시 만들어 4차·5차 전수검수로 반복하는 것은 금지한다.

### R3 — INITIAL FULL AUDIT DETAILS

R3는 release gate다.

- R1/R2의 `22/22`, `14/14` 숫자를 evidence로 사용 금지
- latest artifact bytes에서 fresh audit
- source/runtime/small-board/SVG actual geometry/Meta null-resolvable을 다시 확인
- 이전 receipt는 provenance와 regression target으로만 사용
- `freshFromArtifactBytes=true`
- `priorStageCountsUsedAsEvidence=false`

---

## 8. 예약 작업 강화 규칙

예약 GPT는 수동 GPT보다 검수 범위를 줄이지 않는다.

예약 run 시작 시:
1. 최신 Notion CURRENT
2. latest Git main
3. current target artifact
4. 이 문서
5. 관련 Golden + Negative regression
을 직접 확인한다.

예약 run 종료 시:
- physical evidence rows가 완결되면 validator 실행 → PASS/DONE
- 미완이면 checkpoint만 보존 → 다음 예약이 이어서 완료
- 자동으로 `PASS`, `22/22`, `14/14`를 채우지 않는다.

**속도 최적화는 중복 읽기와 불필요한 ceremony를 줄이는 데만 사용한다. evidence 축 자체를 생략해서는 안 된다.**

---

## 9. validator

공용 gate:

```bash
node archive/tools/review-evidence-gate.mjs \
  --exam <final-exam-js> \
  --evidence <physical-evidence-json> \
  --stage CREATE|R1|R2|R3
```

validator는 최소 다음을 기계적으로 확인한다.

- final exam SHA binding
- question row denominator
- 각 qid 필수 axis evidence 존재
- runtime double-slash TeX
- ㄱ/ㄴ/ㄷ 등 작은칠판 구조
- linked solutionImage inventory ↔ visualRows
- visual SHA binding
- visual physical method 존재
- Meta row denominator
- `META_NULL_BUT_RESOLVABLE`
- R2 blind freeze / R3 fresh-byte flags
- summary count가 item rows에서 파생된 값과 일치

validator `ok=false`이면 stage PASS/DONE 금지.

---

## 10. 2026-10-01 복성고1 Negative Regression — 필수 회귀 fixture

대상:
`26_복성고_2학기_중간_고1_기출`

R2가 다음처럼 자기보고 PASS를 남겼지만 direct R3에서 false PASS가 확인됐다.

- `solutionSvgAuditCount=14/14` → 실제 geometry FAIL q1/q3/q7/q8/q20
- `smallBoardAuditCount=22/22` → 실제 구조 FAIL q2/q17
- `metadataFullAuditCount=22/22` → exact ACTIVE projection 누락 q4/q11/q21
- `sourceContentChoicesAuditCount=22/22` → q2 runtime/source exact escape 결함
- q3/q8/q20은 decimal label만 고쳤고 실제 선 geometry는 재검하지 않은 회귀

frozen 실패 SVG:
`archive/fixtures/review-negative-regressions/2026-10-01-bokseong/`

이 fixture와 동형의 결함을 CREATE/R1/R2/R3에서 PASS시키면 검수 규칙 위반이다.

---

## 11. Stage receipt 최소 필드

stage DONE receipt는 최소 다음을 가리킨다.

```json
{
  "physicalEvidenceSchema": "JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1",
  "physicalEvidencePath": "...",
  "physicalEvidenceSha256": "sha256:...",
  "evidenceGateStatus": "PASS",
  "validatorReceiptPath": "...",
  "validatorReceiptSha256": "sha256:...",
  "finalArtifactSha": "...",
  "questionCount": 0
}
```

`evidenceGateStatus=PASS`는 worker가 임의로 쓰는 값이 아니다. validator `ok=true` 결과에 결속한다.

CREATE/R1/R2에서 명시적 item hold가 있는 경우 validator는 `disposition=PASS_WITH_ITEM_HOLDS`를 낼 수 있다. 이는 **stage evidence가 완전하다는 뜻이지 held qid가 PASS라는 뜻이 아니다.** R3는 `PASS_WITH_ITEM_HOLDS`를 허용하지 않는다.

---

## 12. 최종 원칙

**검수 횟수가 많다는 사실은 품질 증거가 아니다.**

CREATE → R1 → R2 → R3를 여러 번 거쳤더라도 실제 final bytes를 보고 만든 item-level evidence가 없으면 PASS가 아니다.

학생에게 도움이 되는 해설 품질을 위해 다음을 고정한다.

> **PASS는 주장하는 상태가 아니라, 실제 artifact를 보고 계산·대조한 physical evidence로부터 파생되는 상태다.**
