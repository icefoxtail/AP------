# ALIVE GPT LITE v0.3 — 대량 생산 작업자 실행 계약 (필독)

작성일: 2026-10-08 KST
상태: **LITE 파일럿 작업자 지침 / 정식 Generated Bank 소비·FULL 봉인은 미활성**
상위 문서: `ALIVE_GPT_LITE_MASS_EXPANSION_PRODUCTION_PLAN_v0.1.md`, `ALIVE_GPT_LITE_MASS_EXPANSION_PRODUCTION_PLAN_v0.2.md`.
본 문서의 *LITE 파일럿 실행방법*이 v0.1/v0.2의 모호한 생산 배수·작업 단위 설명보다 우선한다. FULL v0.3, original/similar/types, 현재 Meta Foundation·난이도 정본, 현재 운영 컨베이어를 변경하지 않는다.

## 0. 목적과 재발 방지: 1:1 생산은 기본값이 아니다
**HARD: 기출 1문항 → 신규 1문항으로 기계적으로 대응시키는 작업을 대량 확장이라고 보고하지 않는다.**
- **시험지 1개는 seed inventory**다. 실제 확장 의사결정은 **원본 개별 qid × 가능한 의미 Blueprint** 단위로 한다.
- 문항별 생산량은 **0, 1, 2, ... 자유**이다. 유효한 새로운 의미유형이 여럿이면 한 원본에서 여러 유형을 확장한다. **20문항 × N개** 같은 고정 배수도 금지한다.
- 요청 목적이 '대량 생산'이면 우선 source qid마다 **실제로 가능한 Blueprint 후보를 여러 개 탐색**한다. 첫 번째 신규 1문항을 만든 뒤 자동으로 다음 원본으로 넘어가지 않는다.
- **기본적으로 '원본 1개당 1개'로 끝내는 것은 품질·생산 목표 미충족**이다. 단, 진짜 확장 가능성이 0~1개인 경우는 허용하되 근거와 시도한 확장축 및 shortage를 기록해야 한다.
- **단순 숫자·부호·변수명 변형을 서로 다른 사고유형으로 보고하지 않는다.** 같은 사고구조에서 여러 문항을 생산하는 것은 허용하되 numeric instance로 별도 집계한다.
- '대량'을 위해 존재하지 않는 L4/CrossConcept/Condition을 꾸며내거나 교육과정/정답·해설 품질을 희생하지 않는다.

## 1. 작업 단위: 작은 배치 + 원본별 확장 완료
1. 시험지 inventory(원본 경로, 실제 문항수, SHA, qid)를 읽고 이전 배치의 진행 원장을 확인한다.
2. 한 번의 GPT 실행에서 **원본 1~3문항**을 잡는다. 이 숫자는 *입력 seed 수*이지 출력 신규 문항 수가 아니다.
3. 선택한 각 qid에 대해 (i) L3 중심 seed 분석 → (ii) 유효한 L4/CrossConcept/Condition/Integration·목표/조건 구조를 바꾼 Blueprint **여러 개** 탐색 → (iii) 중복과 교육과정 drift 제거 → (iv) 각 Blueprint당 필요한 숫자·문형 instance 자율 생산.
4. **출력 권장 목표는 배치당 10~30 신규 문항**이지만 이는 강제 최소치나 할당량이 아니다. 부족하면 숫자로 메우지 않고 상세 shortage와 이유를 기록한다.
5. **타임아웃 방지:** 배치가 커질 경우 원본 하나의 생성도 continuation으로 쪼갠다. 각 완료 micro-batch는 UID/원장/메타/JS를 먼저 영구 저장·readback한 후 다음 작업. 미완성 슬롯은 `planned/attempted/accepted/rejected`로 분리.
6. 완료한 원본 qid는 `EXPANDED` 또는 `SHORTAGE_JUSTIFIED`로 표시한다. 단순히 1개를 만들었다는 이유로 원본을 `DONE` 처리하지 않는다.
7. 일부 문항만 작업한 경우 전체 20/26문항의 확장 분석·완료라고 선언하지 않는다.

## 2. 출제자 원패스 계약
**작성자가 수학 spec → 발문·선지 → 정확한 answer → 학생용 완전한 solution → 분류·난이도를 한 번에 확정**한다.
- 필수: 학생 입력 `content/choices`, 정답 `answer`, 학생이 따라갈 수 있는 `solution`(핵심 접근 + 중간식 + 결론), 학교 기출인 척하지 않는 generated source identity.
- 필수 Meta: curriculum/L1/L2, RPM Primary L3/L4 **실제 canonical 값**, PT/TPL exact ACTIVE 여부, CrossConcept, Condition, Integration, category/tags, level(하·중·상), difficultyBucket(1..5).
- 난이도는 **목표 bucket**과 **실제 완성 문항 bucket**을 구별한다. 생성자가 실제 완성 학생 입력·최선의 풀이에 근거해 actual bucket을 author-lock 한다.
- 작성자 확정 메타는 정상 문항에 대하여 검수자가 전수 재작성·재분류하지 않는다. validator는 키/상위관계/구조 검사, 독립 수학검수자는 학생용 입력 blind 검산·정답 유일성·쉬운 우회풀이·명백한 L3 drift만 flag 한다. flag된 문항만 작성자가 핀포인트 재판정.
- **작성자가 검수자를 겸해 독립 검수 PASS를 기록하지 않는다.** 독립 GPT 컨텍스트를 사용하지 못하면 `INDEPENDENT_NOT_TESTED`로 남긴다.
- 기하/그림은 필요한 경우에만 생성·별도 SVG/raster 실제 렌더를 확인한다. 실제 하지 않은 렌더 PASS 불허.

## 3. '의미유형'과 '문항 수'의 분리
- `semanticBlueprintFingerprint`: 실제 RPM L3/L4, decisiveStepGraph, 필수 CrossConcept/Condition/Integration, 목표 역할의 조합. 같은 L4라도 실제 풀이 그래프가 다르면 다를 수 있지만 **증거 필수**.
- `parameterFingerprint`: 숫자값/계수/범위 변경.
- `surfaceFingerprint`: 문장·형식·보기 재배열.
- 원본 1문항에서 Blueprint 4개를 만들고 각 3문항을 만들면 `semanticBlueprintCount=4`, `newQuestionCount=12`; 12개의 사고유형이라고 주장하지 않는다.
- 기존 원본, 이전 generated 문항, 동일 배치끼리 exact/near-duplicate를 확인할 수 있는 범위에서 확인. 글로벌 조회를 수행하지 않았다면 `GLOBAL_DUPLICATE_NOT_TESTED`.

## 4. 저장 루트 (v0.2 정합)
```text
archive/generated/lite/v1/<curriculum>/<grade>/<L2-key>/
  manifest.json
  shards/batch-<batchId>.js
  metadata/batch-<batchId>.json or .jsonl
  evidence/batch-<batchId>.json
archive/data/generated-lite/pilot-index-v1.json   # 파일럿 별도 인덱스; 실제 Archive2 catalog가 아님
```
- **L2는 논리적 collection**이며 실제 물리 파일은 불변 batch shard. 문항 1개=UID 1개. 여러 L2면 적절한 루트로 분리하고 출처 qid/seed SHA는 sidecar에 보존.
- 동일 L2 다음 batch는 기존 shard 불변·새 shard 추가·manifest/index append/revision pointer 갱신. 동시 작업 시 main fetch→충돌 확인→핀포인트 commit→push→readback, 중간 작업 Git push 금지.
- 원본 `archive/exams/original/**`은 수정 금지. existing `types/**`, `similar/**`, archive2-catalog/question_metadata를 단순 저장 성공만으로 수정하지 않는다.
- **Git 저장 및 pilot-index 반영 ≠ 제품 DB 반영**. Archive2 actual catalog와 runtime/Finder 조회 adapter·UID JOIN·검색·권한·엔진 출력 결과가 증명되어야 `DB_SEARCH_INTEGRATED`; 그 전에는 `NOT_INTEGRATED`.
- 등록/공급은 수학 독립검수·Meta 정합성·실제 exam/sol/ans 렌더 등 선택 제품의 허용 gate를 통과한 UID만 가능. pilot candidate를 `LITE_QUALITY_ACCEPTED`나 `FULL_QUALIFIED`로 표시하지 않는다.

## 5. 문항별 생산 원장 (필수)
각 원본 qid마다 다음을 보존한다.
```json
{
  "sourceQid": 5,
  "sourceArtifactSha": "<actual source blob SHA>",
  "exploredBlueprints": [],
  "rejectedBlueprints": [{"fingerprint":"...","reason":"duplicate|L3_DRIFT|curriculum|invalid|unsupported"}],
  "semanticBlueprintCount": 0,
  "numericInstanceCount": 0,
  "generatedQuestionCount": 0,
  "generatedUids": [],
  "status": "PLANNED|IN_PROGRESS|EXPANDED|SHORTAGE_JUSTIFIED",
  "shortageReason": null,
  "savedBatchIds": [],
  "lastReadback": "NOT_TESTED"
}
```
실제 수치를 채워야 하며 위 0·목록은 예시 스키마다. `semanticBlueprintCount`의 기준은 유효한 **서로 다른** 풀이구조 수. 문항 수와 혼동 금지.

## 6. 배치 완료/인계 기준 (작업자 체크)
- [ ] seed inventory와 이전 진행원장 읽기
- [ ] 선택 source qid 각각 **복수 확장 탐색** 또는 근거 있는 shortage
- [ ] 신규 전 문항 발문/5지 보기/정답/완전한 해설/작성자 확정 Meta
- [ ] Blueprint/parameter/surface counts, source별 생성량·중복/탈락 원인 기록
- [ ] L2 shard/manifest/metadata/index + 실제 Git readback
- [ ] 독립검수·실제 렌더·actual DB join·등록 상태는 **실행한 것만** PASS
- [ ] `sourceProcessed / sourceRemaining / semanticBlueprintCount / generatedCandidates / independentVerified / registered` 분리 보고

## 7. 2026-10-08 파일럿 사후 교정 (회귀 사례)
- 실패 사례: 2026 효천고 1학기 중간 26문항 중 q5·q23만 선택해 각각 1문항씩 만들고 `pilot/alive-lite-hyocheon-batch-20261008`에 저장. 저장 루트·UID 인덱스 실험은 되었으나 **의미유형 확장 실험으로는 부족**함.
- 보존: `cd19ba094180c33b1ca94b71a23644150f0db4c9` (pilot branch only). 기존 2개를 생성 목표 충족 evidence로 사용 금지; 파일·원본 손대지 말고 다음 batch에서 q5·q23 추가 탐색 및 반복없는 신규 문항을 생성.
- 다음 배치부터는 **원본 qid의 확장 후보가 여럿인데 하나만 생성한 채 다음 원본으로 건너뛰는 사례**를 검사한다.
- 목표 10~30은 출력 예시이며 신규유형이 충분치 않으면 검증된 shortage를 우선한다. 중단/실패 시에도 정상 완료된 shard만 저장하고 회수 가능한 continuation을 남긴다.
