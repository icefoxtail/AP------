# 유사 시험지 판정 안내 (작성자용 · 검수자용)

이 안내는 `build-candidates` 가 만든 `judgment/qNN.json` 을 채우는 사람(작성자)과 그 결과를 고치는 사람(검수자)이 읽는다.
문장은 짧게 쓴다. 시키는 대로 하면 검사기(`check-judgment`)를 통과하도록 만들었다.

## 0. 전체 순서

| 단계 | 명령 | 누가 |
| --- | --- | --- |
| 1 변환 | `node archive/tools/similar-md-to-js.mjs <일체형.md> --out-dir <작업폴더>/stage` | 도구 |
| 2 후보·빈 틀 | `node archive/tools/similar-import/build-candidates.mjs <stage의 stem.js> --out <작업폴더> --md <일체형.md>` | 도구 |
| 3 판정 작성 | `<작업폴더>/judgment/qNN.json` 을 문항마다 채운다 | **작성자** |
| 4 검사 | `node archive/tools/similar-import/check-judgment.mjs <stem.js> <작업폴더>/judgment` | 도구 |
| 5 검수 묶음 | `node archive/tools/similar-import/build-review-pack.mjs <stem.js> <작업폴더>/judgment --out <작업폴더>/review` | 도구 |
| 6 검수 | `REVIEW.md` 를 읽고 `judgment/qNN.json` 의 `review` 칸을 채우고 고친다 | **검수자** |
| 7 반영 | `node archive/tools/similar-import/apply-judgment.mjs <stem.js> <작업폴더>/judgment` | 도구 |

- 작업폴더는 저장소 밖 `C:/AI_WS/tmp/similar-judgment/<stem>/` 에 둔다. 판정·후보·검수 묶음은 저장소에 넣지 않는다.
- 선택표: `build-candidates` 가 등록부에서 새로 만들어 `<작업폴더>/selection/*.md` 에 둔다 (`candidates/_exam.json` 의 `selectionFiles`, 이 시험 과목이 먼저). 단원 → 소단원·RPM 행·유형(PT→TPL)을 한글 이름과 함께 모았다. 저장소의 `archive/tools/similar-import/selection/` 은 `build-selection-tables.mjs --write` 가 만든 열람용 사본이다.
- `build-candidates` 는 이미 있는 `judgment/qNN.json` 을 덮어쓰지 않는다. **이미 채워진 판정 파일이 있으면 내용을 믿지 말고** `--force` 로 빈 틀을 다시 만들어 처음부터 쓴다. 틀의 `itemFingerprint` 가 현재 문항과 다르거나 예시 글이 그대로 남아 있으면 `STALE_OR_EXAMPLE` 로 걸린다.
- 진행 단계는 `C:/AI_WS/tmp/similar-judgment/STATUS.tsv` 에 쌓인다: `CONVERTED → JUDGED(검사 통과) → REVIEWED(검수 완료) → READY(운영 병합 가능)` 또는 `HOLD`.
- **1단계 변환이 실패하면** 저장소 도구·원천 드라이브 파일은 고치지 않는다. 작업폴더에 내려받은 마크다운 사본에서 **형식만** 기계적으로 고쳐 다시 돌린다: 코드 블록 줄 앞뒤의 여분 역슬래시, 깨진 코드 블록 경계, 정답 칸의 표기(`②,④` → `②, ④`), 문항 번호 줄(`## Q07`) 같은 것. 무엇을 고쳤는지 작업폴더 `SOURCE_FIXES.md` 에 한 줄씩 적는다. 발문·보기·정답 번호·해설의 수학 내용을 바꿔야만 통과한다면 고치지 말고 그 시험지를 건너뛰고 보고한다.
- **보기·정답 번호 규칙:** 수로 된 보기는 크기순, 정답 번호는 시험지 안에서 규칙 없이 흩어지게(되풀이·쏠림 금지)이다. 규칙·결함 기준·절차는 [docs/agents/similar-choices.md](../../../docs/agents/similar-choices.md)가 정본이다. `check-judgment` 가 어긋난 수 보기(`CHOICE_ORDER`)·같은 값 보기(`CHOICE_DUPLICATE`)·정답 번호 분포(`ANSWER_DISTRIBUTION`)를 거절하고 생김새 누설은 경고로 띄운다. 이 검사는 새 반입에만 적용된다. 이유(2026-11-19 학생 신고): 혼자 어긋난 보기와 쏠린 정답 번호로 학생이 답을 맞혔다.
- 수학 내용(발문·보기·정답·해설)은 고치지 않는다. 틀렸다고 생각하면 `answerMatches:false` 와 `answerIssue` 로 보고하고 시험지는 보류된다.

## 1. 작성자용

문항마다 `candidates/qNN.json` 을 읽고 `judgment/qNN.json` 을 채운다. 읽는 순서는 이렇다.

1. `problem` 의 발문·보기만 읽고 **직접 푼다.** 풀어서 답을 확인한 뒤에 `reference`(저장 정답·해설)를 본다.
2. **단원·RPM·유형(PT/TPL)은 `reference` 해설에 적힌 결정적 풀이 단계를 기준으로 고른다.** 내 풀이가 해설과 다르면 해설 기준으로 고르고, 다르다는 사실은 `how` 에 적는다.
3. `units` 에서 단원을 고른다. 단원 안의 `subUnits`, `rpm`, `problemTypes` 가 후보이고 유형은 모든 단원에서 등록된 ACTIVE 전부다. 유형은 선택표에서도 개념 단어(한글 이름)로 찾는다. 선택표의 키는 후보 파일에 없어도 쓸 수 있다(맨 끝 "아래 학년 유형" 포함). 후보와 선택표에 맞는 유형이 없으면 `NONE` 으로 두고 `how` 에 적는다. 원본 기출의 같은 번호 문항이 쓴 유형은 `sourceExamHint` 에 따로 있다(참고만 한다. 해설의 결정적 단계가 다르면 따르지 않는다).
4. `source` 는 원천 마크다운이 적어 온 값이다. 틀릴 수 있다. 그대로 베끼지 말고 문항을 읽고 정한다. (원천의 `primaryMethod`·`decisiveStep` 은 풀기 전에 보지 않도록 `reference` 쪽에 있다.)
5. CrossConcept·Condition 키·결합 패턴(`integrationPattern`)과 출처(`provenance` 의 `generator`·`variationNote`)는 판정 대상이 아니다. 원천 마크다운 값을 그대로 옮기고 재판정하지 않으며, 원천에 없는 `generator`·`variationNote` 는 쓰지 않는다.

### 칸의 뜻과 채우는 법

| 칸 | 뜻 | 채우는 법 |
| --- | --- | --- |
| `solveSteps` | 직접 푼 과정 | 2~6줄. 이 문항의 숫자와 식을 쓴다. |
| `solvedAnswer` | 내가 푼 답 | 객관식은 `②` 또는 값(`12`). 복수 정답은 `②, ④`(순서·`2, 4` 표기 상관없음). 서답형은 값만(`$`는 있어도 없어도 된다). 소문항이면 `(1) 144, (2) 216`. |
| `answerMatches` | 저장 정답과 같은가 | `true` / `false`. 검사기가 직접 비교해 거짓말을 잡는다. |
| `answerIssue` | 다르면 무엇이 다른가 | `false` 일 때만 쓴다. 비우면 실패. |
| `figureNeed` | 그림 필요 여부 | `NONE` 그림 언급 없음 · `SELF_CONTAINED` 그림 언급은 있으나 글만으로 풀림 · `NEEDS_FIGURE` 그림의 값·모양을 읽어야 풀림 |
| `figureEvidence` | 근거 | `NONE` 이 아니면 발문에서 **그대로** 옮긴 문장 |
| `solutionFigureNeed` `solutionFigureEvidence` | 해설 그림 필요 여부 | `NONE` 해설을 글만으로 따라갈 수 있다 · `NEEDS_FIGURE` 해설을 따라가려면 그림이 필요하다. **해설을 글만으로 따라갈 수 있으면 NONE.** NEEDS_FIGURE 이면 해설에서 **그대로** 옮긴 구절을 `solutionFigureEvidence` 에 쓴다(NONE 이면 비워도 된다). NEEDS_FIGURE 여도 시험지는 보류되지 않는다(해설 그림은 나중에 그림 줄에서 만든다). |
| `standardUnitKey` `subUnitKey` | 단원·소단원 | 후보 안의 키. 소단원은 고른 단원의 것. |
| `unitEvidence` | 근거 | 발문·해설에서 **그대로** 옮긴 구절 |
| `rpmRecordId` | RPM 행 | 고른 단원의 `rpm` 후보 id. 맞는 것이 없으면 `NONE` |
| `rpmReason` | 이유 | 이 문항의 어떤 단계가 그 행인지. 숫자·식을 넣는다. |
| `problemTypeKey` `templateKey` | 유형 | 후보 안의 키. **선택표에서 개념 단어로 찾아 보고도 맞는 유형이 없을 때만** `NONE`(+ `newKeyProposal`). `NONE` 을 쓰기 전에 꼭 선택표를 찾아본다. TPL 은 고른 PT 의 것만. |
| `typeReason` | 이유 | 결정적 풀이 단계 한 문장. 숫자·식을 넣는다. |
| `newKeyProposal` | 새 키 제안 | PT 가 `NONE` 이면 필수: `{key,label,why}`. 선택표에 같은 개념이 없을 때만 낸다. 이름은 개념 단어 하나(예: 평행사변형의 성질). 조건·절차를 이름에 넣지 않는다. 같은 시험지·다른 시험지에서 같은 개념이면 같은 key 를 쓴다. |
| `difficultyBucket` `difficultyConfidence` `difficultyBoundaryFlag` | 난이도 | 1~5 정수만(하/중/상은 쓰지 않는다), high/medium/low, 경계 `NONE`·`B12`·`B23`·`B34`·`B45`·`UNKNOWN`. **정의·공식을 바로 쓰면 1이다. 풀이 줄 수·서술형·배점·계산량은 올리는 이유가 아니다. 애매하면 낮게 잡고 경계 플래그(두 단계 사이면 `B12` 처럼 낮은 쪽이 앞)로 표시한다.** 경계 플래그의 두 단계에 `difficultyBucket` 이 들어 있어야 한다. |
| `difficultyReason` | 이유 | 풀이 단계 수와 어려운 지점을 이 문항의 숫자로 |
| `itemFingerprint` | (도구가 채움) | 건드리지 않는다. 문항이 바뀌었는지 검사기가 본다. |
| `slots` | 4칸 | given/goal/method/condition. 항목마다 `term`(사전 용어), `src`(stem·choices·solution), `quote`(그대로 옮긴 4자 이상). method 는 `evidenceType`(NAMED 또는 IMPLIED, IMPLIED 면 `justification`). goal 과 method 는 비울 수 없다. |
| `slotReasons` | 칸 이유 | 선택. `{ "method": "…" }` |
| `format` | 4칸 형식 | 비워 두면 객관식 `단일 정답`, 단답형 `단답`, 서술형 `서술` |
| `how` | 어떻게 판정했나 | 한두 문장. 읽은 순서, 막힌 점, 왜 그 후보를 골랐나. |

### 지켜야 할 것 (검사기가 본다)

- **인용은 한 글자도 바꾸지 않는다.** 복사해서 붙인다. 실제로 `꼭짓각` 을 `꼭지각` 으로 적어 걸린 일이 있다. 공백 차이는 봐 주지만 글자와 LaTeX 는 그대로여야 한다.
- 후보·선택표 밖 키는 쓸 수 없다. 맞는 것이 없으면 `NONE` 과 이유를 쓴다. 가까운 키에 억지로 붙이지 않는다.
- 이유 문장(`how`, `typeReason`, `rpmReason`, `difficultyReason`, `solveSteps`)에는 **이 문항의 숫자나 식**이 들어가야 한다. 다른 문항의 문장을 복사하면 `REASON_DUPLICATE` 이다.
- 사전에 없는 용어는 가까운 말로 바꾸지 않는다. `candidate:true`, `parent`(사전 용어), `note` 를 붙여 후보로 선언한다.
- 같은 칸에 같은 용어를 두 번 쓰지 않는다. method 에 `사칙연산` 을 쓰지 않는다. goal 에는 대입·계산 같은 방법어를 쓰지 않는다.
- JSON 안의 LaTeX 역슬래시는 `\\` 로 쓴다 (`\\overline`). `\f` `\t` `\b` `\n` 으로 읽히면 `CTRL_CHAR` 이다.
- 풀이가 저장 정답과 다르면 `answerMatches:false` 와 `answerIssue` 로 정직하게 쓴다. 맞는 척하지 않는다.

### 막히기 쉬운 곳

- **소단원이 중복처럼 보인다.** 같은 이름의 소단원이 둘일 수 있다. 가장 내용이 가까운 키 하나를 고르고 `how` 에 적는다.
- **RPM 행이 `RPM_ONLY` 이거나 PT 후보가 없다.** 단원 후보와 선택표에 맞는 PT 가 하나도 없으면 `NONE` + `newKeyProposal` 을 쓴다. 선택표에 맞는 개념이 있는데 `NONE` 으로 내지 않는다.
- **그림 낱말(그림·표·아래의)이 있는데 글만으로 풀린다.** `SELF_CONTAINED` 와 그 구절 인용. 그림이 없으면 못 푸는 문항만 `NEEDS_FIGURE` 이고, 그림 파일이 없으면 시험지가 보류된다.
- **4칸 인용이 길다.** 5~40자의 짧은 구절을 골라 그대로 옮긴다. `$`가 들어간 구간은 닫는 `$` 까지 옮기면 안전하다.

### 예시: 1문항 (가상의 이등변삼각형 문항, 객관식 — 어느 실제 시험의 문항도 아니다)

```json
{
  "qid": 3,
  "itemFingerprint": "(도구가 채운 값 그대로 둔다)",
  "solveSteps": [
    "AB=AC 이므로 ∠C=∠B=64° 이다 (이등변삼각형의 밑각).",
    "삼각형의 내각의 합이 180° 이므로 ∠A=180°-64°-64°=52° 이다."
  ],
  "solvedAnswer": "③",
  "answerMatches": true,
  "answerIssue": "",
  "figureNeed": "NONE",
  "figureEvidence": "",
  "solutionFigureNeed": "NONE",
  "solutionFigureEvidence": "",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "unitEvidence": "$\\overline{AB}=\\overline{AC}$인 이등변삼각형 $ABC$에서",
  "rpmRecordId": "M2-RPM-178",
  "rpmReason": "∠B=64° 에서 ∠C=64° 를 얻는 밑각 성질을 쓰는 단계라 밑각과 꼭짓각 행이다.",
  "problemTypeKey": "PT_ISOSCELES_TRIANGLE",
  "templateKey": "TPL_ISOSCELES_BASE_ANGLES",
  "typeReason": "∠B=64° 로 밑각 ∠C=64° 를 정하고 내각의 합에서 꼭지각 ∠A=52° 를 구하는 단계가 밑각 템플릿의 정의와 같다.",
  "newKeyProposal": null,
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑각 성질 ∠C=64° 와 내각의 합 180° 를 바로 쓰는 두 줄 풀이라 1단계로 본다.",
  "format": "",
  "slots": {
    "given": [{ "term": "이등변삼각형", "src": "stem", "quote": "인 이등변삼각형 $ABC$에서" }],
    "goal": [{ "term": "크기", "src": "stem", "quote": "$\\angle A$의 크기는?" }],
    "method": [
      { "term": "밑각", "src": "solution", "quote": "밑각의 크기가 같으므로", "evidenceType": "NAMED" },
      { "term": "내각의합", "src": "solution", "quote": "내각의 합이 $180^\\circ$이므로", "evidenceType": "NAMED" }
    ],
    "condition": []
  },
  "how": "밑각 ∠C=64° 와 내각의 합에서 ∠A=52° 를 얻어 보기 ③과 대조했다. 해설도 같은 두 단계라 밑각 템플릿을 골랐다.",
  "review": { "reviewerSolvedAnswer": "", "verdict": "", "fixes": [], "note": "" }
}
```

`review` 칸은 작성자가 건드리지 않는다.

## 2. 검수자용

목표: 작성자의 판정이 **문항을 읽고 한 것인지** 확인하고, 틀린 칸을 고치고, 근거를 남긴다. 검수자는 작성자가 아니다.

### 무엇부터 본다

1. `REVIEW.md` 맨 위 **먼저 볼 문항** 목록부터 본다. 자동으로 뽑힌 이유가 적혀 있다:
   정답 불일치·`answerIssue` · NEEDS_FIGURE · 원천 값과 다른 칸 2개 이상 · 이유 20자 미만 · 새 키 제안 · 난이도 경계 · 수식 안 `\\` 경고 · 풀이에 정답 값이 안 나옴.
2. 그다음 나머지 문항도 **모두 직접 푼다.** 목록에 없어도 건너뛰지 않는다.

### 문항마다 하는 일

1. `REVIEW.md` 의 발문·보기까지만 읽고 **먼저 풀어** `review.reviewerSolvedAnswer` 에 적는다. (저장 정답을 보고 베끼면 영수증이 거짓이 된다.)
2. 저장 정답과 비교한다. 다르면 `verdict:"HOLD"` 로 두고 `note` 에 무엇이 다른지 쓴다. (정답이 다른데 PASS/FIXED 로 두면 `REVIEW_ANSWER_MISMATCH` 이다.)
3. 작성자의 풀이·그림 판단·단원·RPM·유형·난이도·4칸을 읽는다. 인용이 발문·해설에 있는지는 도구가 이미 봤다. 검수자가 볼 것은 **뜻**이다: 그 단원이 맞나, 그 행이 이 문항의 결정적 단계인가, 그림 없이 정말 풀리나, 난이도가 학생 체감과 맞나, 4칸 method 가 해설의 결정적 단계를 모두 덮나.
4. 원천이 적은 값과 판정이 다르면(`원천→판정` 표시) 어느 쪽이 맞는지 직접 정한다. 원천을 믿지도, 판정을 믿지도 않는다.

### 어떻게 고치고 무엇을 기록하나

- 맞으면 `verdict:"PASS"`.
- 고쳤으면 `judgment/qNN.json` 의 **그 칸을 직접 고치고** `verdict:"FIXED"`, `fixes` 에 `{ "field": "rpmRecordId", "from": "M2-RPM-194", "to": "M2-RPM-195", "why": "…" }` 를 적는다. `to` 가 판정 기록의 현재 값과 다르면 `REVIEW_FIX_NOT_APPLIED` 이다. 고친 뒤 `check-judgment` 를 다시 돌려 통과시킨다.
- 수학 내용이 틀렸거나, 그림이 있어야 하는데 없거나, 판단이 안 서면 `verdict:"HOLD"` 와 `note`. HOLD 가 하나라도 있으면 영수증도, `reviewStatus` 상승도 없다.
- `note` 는 한 문장이라도 쓴다.

### 영수증이 만들어지는 조건 (apply-judgment)

모든 문항에 `review.verdict` 가 있고, HOLD 가 0이고, `reviewerSolvedAnswer` 가 비어 있는 문항이 없고, 검사 코드가 0일 때만 `.review-receipt.json` 이 만들어지고 `approval.reviewStatus` 가 `independent_review_passed` 가 된다. 하나라도 빠지면 영수증은 없고 `review_required` 그대로다. 일부 문항만 반영(`--only`)하면 영수증은 `--partial-receipt` 에서만, 그것도 출고 근거가 아닌 `PARTIAL` 표시로 나온다.

## 3. 검사 코드 요약

| 코드 | 뜻 |
| --- | --- |
| `ANSWER_MISMATCH` | 풀이 답과 저장 정답이 다름. `answerMatches` 가 거짓말이면 실패, 정직하게 `false`+`answerIssue` 면 시험지 보류 |
| `QUOTE_NOT_SUBSTRING` | 인용이 원문에 그대로 없음 / 4자 미만 |
| `REASON_NO_ITEM_TOKEN` | 이유 문장에 이 문항의 숫자·식 토큰이 하나도 없음. 문항에 두 글자 이상 토큰(`12`, `0.5`, `x2`, `AB` 등)이 있으면 한 자리 숫자·한 글자 문자는 세지 않는다. 오류 메시지가 쓸 수 있는 토큰을 보여 주니 그중 하나를 이유 문장에 그대로 넣는다. 검사기 코드를 읽을 필요 없다. |
| `REASON_DUPLICATE` | 다른 문항과 같은 문장 |
| `KEY_NOT_IN_CANDIDATES` | 후보와 선택표 밖 키 |
| `FIELD_EMPTY` | 빈 칸이거나 형식이 틀림 |
| `TERM_NOT_IN_DICT` / `TERM_DUPLICATE_IN_SLOT` | 사전에 없는 용어 / 같은 칸에 같은 용어 |
| `FIGURE_MISSING` | `NEEDS_FIGURE` 인데 그림 파일 없음 → 시험지 보류 |
| `SOLVE_TOO_SHORT` | 풀이 과정 2줄 미만 |
| `ALL_SAME` | 한 시험지 전 문항이 같은 RPM 과 난이도 |
| `CTRL_CHAR` | 탭·폼피드 등 깨진 글자 |
| `REVIEW_ANSWER_MISMATCH` / `REVIEW_FIX_NOT_APPLIED` | 검수 기록이 서로 맞지 않음 |
| `CHOICE_ORDER` / `CHOICE_DUPLICATE` | 수 보기가 크기순이 아님(혼자 어긋난 보기가 정답이거나 순서 어긋남) / 같은 값의 보기. 정본: docs/agents/similar-choices.md |
| `ANSWER_DISTRIBUTION` (시험지) | 정답 번호가 쏠리거나 되풀이됨(객관식 10문항 이상). 정본: docs/agents/similar-choices.md |
| `CANDIDATES_STALE` | 후보를 만든 뒤 시험지 JS가 바뀜 |
| `STALE_OR_EXAMPLE` | 판정 틀이 이 문항의 것이 아니거나(문항 지문 불일치) 가이드 예시 글이 그대로 남음 |
