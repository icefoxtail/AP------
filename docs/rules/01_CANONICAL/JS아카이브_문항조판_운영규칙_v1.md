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
규칙 도입만으로 이미 닫힌 production 시험지를 일괄 backfill하지 않지만 이후 실제 JS 작업 범위에 들어오면 즉시 적용한다.

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

### SUBJECTIVE_WRITING_SPACE_FIRST — 서술형/단답형/서논술형 답안 공간 HARD RULE

학생이 실제로 풀이·답안을 써야 하는 문항은 **내용 수용보다 작성 공간을 우선**한다.

- 기본 layout은 기존 `grid`를 유지한다.
- 단답형·서술형·서논술형 또는 choices가 없는 주관식에서, 현재 grid가 학생 답안 작성에 좁다고 판단되면 **`layoutTag: "subjective-2up"`으로 승격**한다.
- `(1) (2)`, `(1)~(5)`, ①/②처럼 문제 안에 소문항이 여러 개 있으면 각 소문항의 경계를 명확히 줄바꿈하고, 학생이 각 항목에 답을 적을 수 있는 충분한 세로 간격을 확보한다.
- 답안 공간 부족을 해결하기 위해 font/image를 먼저 과도하게 축소하지 않는다. **`grid → subjective-2up` 공간 확보가 압축보다 우선**이다.
- 기본 escalation은 여기까지다. `subjective-4up`·`fullwidth`로 자동 확대하는 별도 단계는 두지 않는다. `subjective-2up`으로도 실제 render에서 부족한 특수 문항만 별도 HOLD/후속 엔진 개선 대상으로 남긴다.
- 원문에 이미 `단답형`, `서술형`, `서논술형` 표지가 있으면 renderer-only bold/간격/괄호·배지 스타일로 시각 계층을 강화할 수 있다. **원문에 없는 유형 라벨을 새로 쓰거나 기존 문구를 바꾸지 않는다.**
- 유형 표시 styling은 SOURCE_TEXT_EXACT_PARITY의 text atom을 바꾸지 않는 presentation layer여야 한다.
- CREATE/R1은 정적 구조를 판정하고, 실제 답안 공간 충분성은 Codex exam render에서 다시 확인한다.

결함 코드:
- `SUBQUESTION_WRITING_SPACE_TIGHT`
- `SUBJECTIVE_GRID_TOO_TIGHT`
- `SUBJECTIVE_TYPE_HIERARCHY_WEAK`

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
