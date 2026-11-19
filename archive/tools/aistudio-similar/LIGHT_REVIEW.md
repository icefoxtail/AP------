# 파일럿 경량 검수 (Sonnet) — AI Studio 가 JS 와 메타를 함께 만든 시험지

전제: 생성 JS(`D\생성\<이름>_유사.js`)는 정답 번호 지정을 따라 만들었고, 판정(`W\judgment\qNN.json`)은 Gemini 한 번(단일 모델 초안)이다. 반입 때처럼 전 문항을 다시 풀지 않는다.
읽을 것: `D\반입_마무리_체크리스트.md`(성립·정답·보기·해설 판서 기준), `docs/agents/similar-choices.md`(보기 규칙), 이 문서.
`W` = `C:\AI_WS\tmp\similar-pilot\<이름>_유사`, `T` = `D\tools\pilot`, 하네스 = `C:\AI_WS\wt\similar-pilot`.

## 0. 시작
1. `D\생성\<이름>_유사.js` 를 `D\결과\<이름>_유사.js` 로 복사한다(같은 이름이 `결과`에 이미 있어 `_유사2` 처럼 올려야 하면 파일 이름과 `W` 폴더 이름을 같이 올리고 `W\target.json` 은 복사해 쓴다. 스테이지·판정은 파일 이름(stem)에 묶여 있다). **이후 모든 수정과 도구는 `결과` 파일에 한다.** 생성 파일은 Gemini 원본으로 남긴다.
2. 하네스가 오래됐으면 갱신한다(`PILOT_DRIVER.md` 상단).

## 1. 기계 검사 두 가지를 먼저 돌린다
```
node "T\lint-similar.mjs" "<결과.js>" "W\target.json" --fix --json > "W\lint.json"
node "T\lint-similar.mjs" "<결과.js>" "W\target.json"
node "<하네스>\archive\tools\similar-import\check-judgment.mjs" "W\stage\<이름>_유사.js" "W\judgment" --no-status --json "W\check.json"
```
(결과 파일이 생성 파일과 다르면 먼저 `node "T\refresh-stage.mjs" "<결과.js>" "W"` 로 스테이지를 맞춘다.)

## 2. 직접 풀 문항만 고른다
`node "T\review-list.cjs" "W"` 가 목록과 이유를 준다. 직접 푸는 것은 이것뿐이다.
- (a) Gemini 판정 `answerMatches:false` 인 문항, check-judgment·lint 오류 문항
- (b) 서술형·단답형 전부
- (c) 판정 `difficultyBucket` 이 가장 높은 3문항
- (d) 발문이 의심스러운 문항(예: "항상", "반드시", 조건이 모호한 문장). d 목록은 후보일 뿐이고 읽고 의심될 때만 푼다.

나머지 문항은 푸는 대신 훑는다: 발문·보기가 읽히는지, 보기가 크기순이고 해설 끝 "정답은 ○이다"가 answer 와 맞는지(lint 가 이미 봄), 해설 판서형(체크리스트 6)이 크게 어긋나지 않는지만 본다.
풀지 않는 문항도 객관식 보기 꼴은 전부 눈으로 훑는다(정답만 혼자 다른 모양인지). lint 의 `FORM_LEAK` 오류(분수 보기에서 정답만 분자 1 여부·약분 여부·분모가 다름, 정답만 종류·부호가 다름)는 기계가 잡지만, 그 밖의 꼴 차이는 눈으로 본다. 이유: 파일럿에서 정답만 분자가 1이 아닌 보기 3건이 풀이 검수 밖에서 샜다.

## 3. 고치는 법 (최소 수정)
- 발문·보기·정답·해설은 **틀린 곳만** 고친다. 문체·난도·판정 칸 전체를 다시 쓰지 않는다.
- 정답이 틀렸을 때: 정답 값이 목표 번호 자리에 오도록 보기를 다시 짓는다(오답 4개는 그럴듯한 실수 값, 크기순, 정답이 생김새로 드러나지 않게; 규칙 `similar-choices.md`). 목표 번호를 지킬 수 없으면 정답 번호가 바뀌어도 되지만 lint 의 분포 검사(`ANSWER_DISTRIBUTION`)가 통과해야 하고, 해설 속 번호 언급도 같이 고친다.
- Gemini 가 틀리고 저장 정답이 맞았을 때(판정 `answerMatches:false` 가 오판): JS 는 그대로 두고 그 문항 `W\judgment\qNN.json` 의 `solveSteps`·`solvedAnswer`·`answerMatches:true`·`answerIssue:""` 만 고친다.
- 원본 문항이 성립하지 않아 유사도 성립하지 않으면(조건 모순, 답 없음) 최소로 고쳐 성립시키고 기록한다. 고칠 수 없으면 `HOLD` 로 기록하고 멈춘다.
- 그림이 필요한 문항(`[그림: …]`)은 설명이 발문·해설과 맞는지만 본다. 그림 제작은 하지 않는다.

## 4. 기록
`W\LIGHT_REVIEW_LOG.md` 에 한 줄씩 적는다(PR·보고에 그대로 옮긴다).
```
| qid | 바꾼 곳 | 전 → 후 | 이유 |
| Q07 | answer, choices | ③ → ⑤ (보기 새로 지음) | 풀이 값 12 가 ⑤ 자리여야 목표 번호와 맞고, 저장 정답 ③(10)이 틀림 |
```
직접 푼 문항 목록(번호와 푼 답)도 같은 파일 위쪽에 적는다. 이유: 검수 영수증(review 칸)은 전 문항 독립 검수일 때만 만들어지므로 이 경량 검수는 판정 파일의 `review` 칸을 채우지 않는다.

## 5. 고친 뒤 다시 맞춘다
1. JS 를 고친 문항이 있으면: 그 문항의 `W\judgment\qNN.json` 에서 `solvedAnswer`·인용(quote)·이유 문장이 바뀐 글과 맞는지 읽고 고친 뒤
   `node "T\refresh-stage.mjs" "<결과.js>" "W" --rebind <고친 문항 번호들>` (지문이 바뀐 판정은 이걸 하지 않으면 `STALE_OR_EXAMPLE` 로 막힌다. 고치지 않은 문항에는 `--rebind` 를 쓰지 않는다.)
2. `lint-similar` 와 `check-judgment` 를 다시 돌려 둘 다 통과시킨다(바뀐 문항 관련 코드만 보면 된다. 전체 재측정은 병합 직전 한 번).
3. 판정 칸(단원·유형·난이도) 자체를 판단해 바꾸는 일은 이 검수의 범위가 아니다. 고친 문항의 풀이가 달라져 유형이 달라진 경우만 그 문항의 `problemTypeKey` 등을 바꾸고 로그에 적는다.

## 6. 끝나면 (인계)
- `LIGHT_REVIEW_LOG.md` 와 마지막 lint·check-judgment 결과(오류 0)를 보고한다. HOLD 가 있으면 문항과 이유.
- 반영(`apply-judgment`)은 별도 단계다. 단일 모델 초안 표시는 판정 파일에 칸이 없고 apply 할 때 `--judge gemini-aistudio` 로 붙는다(등록 요청 reason `DRAFT_SINGLE_MODEL (gemini-aistudio)`, metaRationale.draftTier `SINGLE_MODEL_DRAFT`, 4칸 judgedBy). 명령 예: `node "<하네스>\archive\tools\similar-import\apply-judgment.mjs" "W\stage\<이름>_유사.js" "W\judgment" --judge gemini-aistudio --out-dir "W\out" --no-status` (파일럿에서 아직 한 번도 안 돌려 본 단계다. 오류는 그대로 보고한다.)
