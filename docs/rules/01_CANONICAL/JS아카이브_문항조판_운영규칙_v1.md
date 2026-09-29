# JS Archive 문항 조판 운영규칙 v1 — QUESTION MICRO_LAYOUT / SOURCE_TEXT_EXACT_PARITY

status: ACTIVE
effective: 2026-09-28
scope: JS Archive 학생 노출 문제의 content / choices / problem image / layout을 생성·수정·검수·승격하는 모든 작업
authority: QUESTION MICRO_LAYOUT canonical
pilot lineage: 25 풍덕중 중1 2학기 중간 / 25 제일고 고1 2학기 중간

---

## 0. 최상위 HARD RULE

**QUESTION MICRO_LAYOUT은 원문 편집 작업이 아니다.** 발문·조건·수치·기호·보기 문구의 축약·요약·의역·재작성은 금지한다.
조판은 원문 text atom을 보존한 채 읽기 구조와 표시 배치만 바꾼다.

`SOURCE_TEXT_EXACT_PARITY=PASS`, `CHOICES_EXACT_PARITY=PASS`가 필수다.
뜻이 같아도 원문 문자가 달라졌으면 PASS가 아니며 `semantic parity`만으로 통과시키지 않는다.

## 1. 즉시 적용 범위

신규 기출 JS 추출·변환, CREATE/CREATE_SELF_CHECK, R1, R2E/Codex final, 기존 JS repair/upgrade,
예약 GPT/Codex, `.codex/skills/apmath-archive-exams`, Past Exam V3, production publish/promotion에 즉시 적용한다.
METADATA_ONLY는 재조판하지 않고 protected question field drift 0을 요구한다.
일반 작업에서는 규칙 도입만으로 이미 닫힌 production 시험지를 자동 일괄 backfill하지 않는다. **단, `MIDDLE_RECERT_2026-09-29_V1` 재인증 scope(M3 69 + M1 31 + M2 1학기 34)는 형님이 명시적으로 전체 backfill을 지시한 예외**이므로 과거 layout PASS/CREATE/R1/main 이력과 무관하게 CURRENT CREATE에서 전 문항 SOURCE_TEXT_EXACT_PARITY + QUESTION MICRO_LAYOUT을 fresh 재판정한다. 같은 generation의 durable receipt가 없는 과거 PASS는 current 면제 근거가 아니다.

## 2. 작업 순서

신규: `PDF/full-page SOURCE TRUTH → exact transcription → SOURCE_TEXT_FREEZE → QUESTION_LAYOUT_BUILD → SOURCE_TEXT_EXACT_PARITY → QUESTION_LAYOUT_FREEZE → answer/solution/Meta/visual`

기존: `authorized content/choices → SOURCE_TEXT_FREEZE → layout-only delta → SOURCE_TEXT_EXACT_PARITY → QUESTION_LAYOUT_FREEZE`

원문 자체 오류는 layout에서 고치지 않는다. SOURCE_FIDELITY/수정프로토콜로 correction을 먼저 닫고 새 freeze부터 다시 조판한다.

## 3. SOURCE_TEXT_EXACT_PARITY

비교 단위는 source text atom stream이다.
layout-only 변화는 JS `\n`/실제 newline/HTML `<br>`, 문단 경계 공백·들여쓰기,
텍스트를 추가하지 않는 approved layout-only wrapper, 승인된 question layout field뿐이다.

그 외 학생에게 보이는 원문 문자—한글·영문·숫자·조사·어미·구두점·괄호·콜론·쉼표·수식/LaTeX·부등호·집합·좌표·단위·원문 marker·배점·“단,” 조건·문장/조건 순서—는 exact 보존한다.

금지: 축약/요약/의역, 동의어·동치표현 교체, 조사·어미 다듬기, 조건 삭제, 동치식 재작성, 배점·단위·기호 정리, 문장 순서 변경, 원문에 없는 설명 추가.
`choices`는 문자열과 배열 순서를 exact equality로 검증한다.

## 4. 허용 조판 / AUTO-FIRST

설명→조건→질문 전환 개행, 긴 상황과 최종 질문 분리, nested marker 시각 분리, 참고문/조건박스 구획,
problem image 표시 크기·배치, 선택지 block/column, 실제 가독성에 필요한 layout field를 허용한다.

**AUTO-FIRST:** 자동 choice/image/layout이 적정하면 `choiceColumns`, `imageSize`, `layoutTag`, `wide`를 불필요하게 추가·변경하지 않는다.
수동 override는 actual render evidence 또는 deterministic 표시 결함이 있을 때만 사용한다. render 미실행 GPT는 추측 override보다 `NOT_RUN_CODEX_HANDOFF`를 우선한다.

## 5. FORMULA / NESTED STRUCTURE

- `$...$` 내부 조판 newline 금지
- 등식·정의·좌표쌍·조건식 의미 중간 분할 금지
- 식 일부만 다음 줄에 매달리는 배치 금지
- 완결된 수식 단위 전/후를 break point로 사용
- (가)/(나), ㄱ/ㄴ/ㄷ, (1)/(2), ①/②, 경우, 별도 정의/참고문/조건 계층 표시
- 이미 note-box/view-box/table로 정상 구조화됐으면 중복 wrapper 금지

## 6. problem asset / choices / page flow

problem image는 발문과 가깝고 라벨/숫자/선 잘림 0, 원본 비율 보존이어야 한다.
asset 자체 결함은 layout에서 임의 재크롭/재그리기하지 않고 `ASSET_DEFECT`/visual/source repair로 분리한다.
choices는 engine 번호 authority를 유지하고 장문·수식이 부자연스럽게 분할되지 않아야 한다.
page/column 내부 분리, asset 때문에 질문/보기가 떨어짐, 과도한 auto-fit 축소는 FAIL 후보다.
정적 PASS와 render PASS를 분리하며 미실행 render는 `NOT_RUN_CODEX_HANDOFF`.

### SUBJECTIVE_LAYOUT_DEFAULT_GRID — 서술형 외부 공간 과승격 방지 HARD RULE

학생이 실제로 풀이·답안을 쓰는 문항도 **외부 layout의 기본값은 `grid`**다.
문항 성격과 필요한 외부 공간은 별도 축으로 판정한다.

#### 6-1. 자동 승격 금지

다음 사실은 **단독으로 `grid → subjective-2up` 승격 근거가 될 수 없다.**

- `questionType`이 `서술형`, `단답형`, `서논술형`인 경우
- `choices: []`인 경우
- tags에 `서술형`/주관식 계열 표지가 있는 경우
- 발문에 `구하시오`, `과정을 서술하시오`, `설명하시오` 등이 있는 경우
- 배점이 높거나 시험지 후반의 서술형 영역인 경우
- `(1)(2)(3)`, ①/② 등의 소문항이 존재하는 경우
- 발문이 길거나 problem image/표/도형이 존재하는 경우

**애매하면 `grid`를 유지한다.** questionType/choices/tag/source marker 기반 일괄 `subjective-2up` 승격은 `OVERESCALATED_SUBJECTIVE_LAYOUT` 결함이다.

#### 6-2. subjective-2up 허용 조건

`layoutTag: "subjective-2up"`은 다음 중 하나가 있을 때만 허용한다.

1. **STATIC_CAPACITY_EVIDENCE** — 코드/정적 구조상 현재 grid 한 칸의 공간에서 발문 길이·줄수, problem image/표/도형의 점유, 소문항 수와 각 발문 구조를 함께 보았을 때 학생이 실제 답안을 쓸 세로 공간이 명백히 부족하다고 판정되는 경우
2. **actual exam render evidence**에서 현재 grid가 발문·asset·소문항을 배치한 뒤 학생 답안 작성 공간을 명백히 확보하지 못함이 확인된 경우
3. 사용자가 해당 문항/범위에 대해 `subjective-2up`을 명시적으로 지시한 경우

actual render는 필수 전제조건이 아니다. GPT/예약/Codex가 렌더를 실행하지 않더라도 **문항별 STATIC_CAPACITY_EVIDENCE가 명확하면** `subjective-2up`으로 승격할 수 있다.
단, `서술형이라서`, `choices가 없어서`, `소문항이 있어서` 같은 유형 근거만으로는 STATIC_CAPACITY_EVIDENCE가 성립하지 않는다. 정적 공간 부족이 애매하면 **`grid` 유지 + `NOT_RUN_CODEX_HANDOFF`**로 넘긴다.
승격 시 ledger의 `reason`에는 최소한 `grid slot + prompt/asset/subquestion occupancy → writing-space insufficient`의 구체적 근거를 남긴다.

`subjective-2up`으로도 실제 render에서 부족한 특수 문항은 자동 `subjective-4up`/fullwidth로 확대하지 않고 HOLD/후속 엔진 개선 대상으로 분리한다.

#### 6-3. 내부 소문항 구조와 외부 layout 분리

`(1)(2)(3)` 같은 내부 소문항의 줄바꿈·읽기 구조·답안 공간 배분은 중요하지만,
**소문항 존재 자체가 `subjective-2up` 승격 사유는 아니다.**

- grid 공간이 충분하면 grid 안에서 소문항 구조를 살린다.
- grid 공간이 **정적 코드/구조 판정 또는 actual render**에서 실제로 부족하다고 확인될 때 subjective-2up을 검토한다.
- 내부 소문항 균등 공간 배분은 별도 renderer/layout 계약으로 다루며 외부 layoutTag 자동 승격과 결합하지 않는다.

#### 6-4. 기존 2up 재판정

기존 `subjective-2up`은 과거 판정을 자동 상속하지 않는다.
STATIC_CAPACITY_EVIDENCE, actual render evidence, 사용자 명시 지시 중 어느 근거도 확인되지 않으면 `SUBJECTIVE_2UP_WITHOUT_EVIDENCE` 후보로 기록하고,
새 기준에서 grid로 충분한지 targeted recheck한다.

2026-09-28 negative regression fixture:
`codex/archive-source-intake@64207516e85f79da822cefc930e9e416ea68615c`의 고1 기말 5시험지 backfill에서
서술형 14문항이 일괄 `grid → subjective-2up`으로 승격된 결과는 **선례/authority가 아니다.**
해당 14건은 새 규칙 기준 **일괄 승격 authority가 아니며 문항별 STATIC_CAPACITY_EVIDENCE로 재검**한다. 정적으로 공간 부족이 명백한 문항은 2up을 유지할 수 있고, 유형만으로 승격된 문항은 grid로 되돌린다. 다른 시험지에 일괄 선례로 확대 적용하지 않는다.

원문에 이미 `단답형`, `서술형`, `서논술형` 표지가 있으면 renderer-only bold/간격/괄호·배지 스타일로 시각 계층을 강화할 수 있다.
원문에 없는 유형 라벨을 새로 쓰거나 기존 문구를 바꾸지 않는다.
유형 표시 styling은 SOURCE_TEXT_EXACT_PARITY의 text atom을 바꾸지 않는 presentation layer여야 한다.

결함 코드:
- `SUBQUESTION_WRITING_SPACE_TIGHT`
- `SUBJECTIVE_GRID_TOO_TIGHT`
- `SUBJECTIVE_TYPE_HIERARCHY_WEAK`
- `SUBJECTIVE_2UP_WITHOUT_EVIDENCE`
- `OVERESCALATED_SUBJECTIVE_LAYOUT`

## 7. disposition / defect code

disposition: `LAYOUT_KEEP | LAYOUT_POLISH | LAYOUT_REFORMAT | LAYOUT_HOLD`

defect: `PROMPT_WALL_OF_TEXT`, `FORMULA_BREAK_RISK`, `NESTED_STRUCTURE_FLAT`, `QUESTION_ASK_BURIED`,
`ASSET_TOO_SMALL`, `ASSET_TOO_LARGE`, `ASSET_PROMPT_DISTANCE`, `ASSET_DEFECT`,
`CHOICE_WRAP_BAD`, `QUESTION_INTERNAL_SPLIT`, `AUTO_FIT_OVERCOMPRESSION`,
`UNNECESSARY_LAYOUT_OVERRIDE`, `SOURCE_TEXT_EXACT_PARITY_FAIL`, `CHOICES_EXACT_PARITY_FAIL`.

## 8. CREATE HARD GATE

전 문항 판정 후 known POLISH/REFORMAT은 직접 수정하고 exact parity를 다시 검사한다.

```text
QUESTION_LAYOUT_COVERAGE = denominator / denominator
questionLayoutStatus = PASS
sourceTextExactParityStatus = PASS
choicesExactParityStatus = PASS
knownQuestionLayoutRepairPending = 0
questionLayoutHoldCount = 0
questionLayoutEvidenceRef = <physical ledger>
questionLayoutRenderStatus = PASS | NOT_RUN_CODEX_HANDOFF
```

CREATE_SELF_CHECK에도 QUESTION MICRO_LAYOUT을 포함한다. READY_FOR_REVIEW 전 정적 gate PASS 필수.

## 9. R1 HARD GATE

CREATE PASS 자기보고를 자동 신뢰하지 않는다. 전 문항 fresh layout/source exact/choices exact와 formula/nested/problem asset/choices/page-flow를 독립 감사한다.
안전한 결함은 최소 수정 후 exact parity를 재검한다.
READY_FOR_R2E 전 question layout/exact/choices PASS, `knownQuestionLayoutRepairPending=0`, `questionLayoutHoldCount=0`.

## 10. R2E / Codex FINAL

정상 R1 PASS 문항을 이유 없이 재조판하지 않는다.
evidence denominator, R1 이후 content/layout drift, exact parity, final exam render의 split/asset/choice/overcompression을 integrity scan한다.
새 defect/drift만 targeted repair하며 source text correction은 SOURCE_FIDELITY repair로 분리한다.

## 11. Past Exam / 신규 source pipeline

S1~S3: `FULL_PAGE_EXACT_EXTRACTION → SOURCE_TEXT_FREEZE → QUESTION_LAYOUT_BUILD → SOURCE_TEXT_EXACT_PARITY → QUESTION_LAYOUT_FREEZE → SOURCE_FIDELITY_FREEZE`.
S4 이후 QUESTION_LAYOUT_FREEZE를 보호하고 promotion 전 actual exam render에서 QUESTION MICRO_LAYOUT을 검수한다.

## 12. machine-readable evidence

item 최소: `examPath, sourceFingerprint, qid, beforeDisposition, finalDisposition, issueCodes[], changedFields[], sourceTextExactParity, choicesExactParity, assetStatus, renderStatus, reason`

aggregate 최소: `denominator, KEEP/POLISH/REFORMAT/HOLD, modifiedQuestionIds[], questionLayoutChangedCount, sourceTextExactParityPassCount, choicesExactParityPassCount, knownQuestionLayoutRepairPending, questionLayoutRenderStatus`

`semantic parity PASS`만 기록하고 exact parity를 생략하는 것을 금지한다.

## 13. regression fixtures / future extension

초기 qualification:
- 중1 25 풍덕중 2학기 중간: q12, q13, q21, q23/q24/q25
- 고1 25 제일고 2학기 중간: q15~q18, q19~q22

향후 실제 defect는 fixture·세부 예시로 추가한다.
**원문 exact 보존 / AUTO-FIRST / CREATE self-check / R1 독립검수 / final render core contract는 유지한다.**
