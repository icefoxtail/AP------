# 파일럿 운전 지시서: AI Studio 가 메타(판정)까지 만든다 (2026-11-19)

`tools\DRIVER_BRIEF.md` 의 방식(Chrome 운전, 무료 한도까지만, 폴링 금지, 금지 목록, 멈춤 조건)을 그대로 따른다. 이 문서는 파일럿 시험지에만 더해지는 단계다.
파일럿 시험지: `26_제일고_2학기_중간_고2_확률과통계`, `26_팔마고_2학기_중간_고2_미적분I` (`진행상태.json` status `"pilot"`).

## 경로·준비
- D = `G:\내 드라이브\AP_유사시험지_마크다운\AI_Studio`, 도구 `T` = `D\tools\pilot`
- 작업폴더 `W` = `C:\AI_WS\tmp\similar-pilot\<원본이름>_유사` (도구가 만든다. 저장소에 넣지 않는다)
- 하네스(저장소 도구)는 `C:\AI_WS\wt\similar-pilot` (origin/main 의 읽기 전용 체크아웃). 갱신: `git -C C:/AI_WS/wt/similar-pilot fetch origin main` 다음 `git -C C:/AI_WS/wt/similar-pilot checkout --detach origin/main`
- 명령은 Bash(`G:/내 드라이브/...` 따옴표) 또는 PowerShell 어느 쪽이든 된다. 저장소 폴더에서 돌릴 필요 없다(어디서든 됨).
- 한 시험지의 판정 채팅·생성 채팅은 새 AI Studio 채팅이다. 한 채팅에 둘을 섞지 않는다.

## A. 생성 (기존 DRIVER_BRIEF 1~4 + 정답 번호 지정)
1. 기존 준비(`prep-exam.sh`) 그대로.
2. **정답 번호 줄 만들기:** `node "T\plan-answers.mjs" <src>` (src = 진행상태.json 의 경로, 예 `archive/exams/original/high/h2/2mid/26_제일고_2학기_중간_고2_확률과통계.js`)
   - 출력의 `[전반 …]` 줄, `[후반 …]` 줄, `[공통 지시]` 문단을 쓴다. 같은 시험지는 항상 같은 배열이다(seed = 유사 파일 이름). 직접 번호를 고르지 않는다.
   - `W\target.json` 이 저장된다(나중에 lint 가 대조).
3. 나눠 뽑기는 2번(전반·후반). 각 요청 끝에 해당 줄과 공통 지시를 **한 줄로 이어** 붙인다.
   - 전반: `올린 시험지(<이름>, N문항)의 유사문항을 나눠 뽑는다. 이번에는 1~k번만. <전반 줄> <공통 지시>`
   - 후반: `이어서 k+1~N번만. <후반 줄> <공통 지시>`
4. 합치기: 기존대로 `merge-prompt.cjs` → `D\생성\<원본이름>_유사.js`.
5. **lint:** `node "T\lint-similar.mjs" "D\생성\<원본이름>_유사.js" "W\target.json" --fix --json > "W\lint.json"; node "T\lint-similar.mjs" "D\생성\<원본이름>_유사.js" "W\target.json"` (첫 줄은 --fix 로 `\frac`→`\dfrac` 를 고치고 결과 json 저장, 둘째 줄은 사람이 읽는 출력)
   - 종료 코드 0(오류 없음)이면 B 로. 오류가 있으면 오류 문항마다 **같은 생성 채팅**에 `Q05: <메시지> 고쳐서 그 문항만 다시` 를 보내고(문항 여럿이면 한 메시지에 줄바꿈으로), 다시 merge → lint. 최대 2번.
   - 2번 뒤에도 남은 오류는 고치지 말고 `진행상태.json` 항목에 `lintLeft:"Q06 TARGET_MISMATCH,…"` 로 적어 경량 검수자에게 넘긴다(경고는 적지 않아도 된다).

## B. 판정(메타) — 새 채팅
1. **묶음 만들기:** `node "T\pack-judgment.mjs" "D\생성\<원본이름>_유사.js" "W"`
   - 출력의 `kb`(약 150KB), `packPath`, `W\pack\REQUEST_TEMPLATE.txt` 가 만들어진다. `ERROR:` 가 나오면 멈추고 보고한다.
   - 과목 선택표만 올린다(기본). 미적분I 처럼 수학II 내용이 섞이는 시험은 `--lower` 를 붙이면 아래 학년 표까지 올라가 커진다(400KB 넘으면 자동으로 줄임).
2. **새 채팅** (`navigate` https://aistudio.google.com/prompts/new_chat, 5초 대기)
   - **시스템 지시문은 쓰지 않는다**("출제자2" 등 저장된 지시문을 고르지 않는다. 패널이 비어 있어야 한다. 다른 지시문이 붙어 있으면 비운다).
   - Thinking Level **Medium**.
   - 파일 업로드: `find "hidden file input"` → `file_upload` 로 `packPath` 의 `.txt` 하나. 5초 기다린다.
3. **2번에 나눠 요청**: `REQUEST_TEMPLATE.txt` 의 `## 전반`, 완료 뒤 `## 후반` 문장을 그대로 보낸다. 입력창 클릭 → 입력 → Run 클릭. 대기 규칙은 기존과 같다(보낸 뒤 약 10분 한 번, 이후 5분씩).
4. **꺼내기:** 탭 제목 = Drive 파일 이름. 15초 뒤
   `node "T\unpack-judgment.cjs" "G:\내 드라이브\Google AI Studio\<탭 제목>" "W"`
   - 출력의 `written` 이 1..N 전부인지, `missingQids`·`parseFailures`·`skipped` 가 비었는지 본다. 빠졌으면 같은 채팅에 `qNN: 판정 JSON 이 없다. 그 문항만 다시` 를 보내고 다시 꺼낸다(다시 꺼내면 나중 답이 이긴다).
5. **검사:** `node "C:\AI_WS\wt\similar-pilot\archive\tools\similar-import\check-judgment.mjs" "W\stage\<원본이름>_유사.js" "W\judgment" --no-status --json "W\check.json"` (**반드시 `--no-status`**. 안 쓰면 공용 STATUS.tsv 에 기록이 섞인다.)
   - 종료 코드 0 이면 완료(C 로).
6. **오류 되돌리기(최대 2번):** `node "T\errors-for-gemini.cjs" "W\check.json"` 출력을 **같은 채팅**에 그대로 붙여 보낸다(`qNN: <오류> 고쳐서 그 문항만 다시`). 문항이 8개를 넘으면 8개씩 나눠 보낸다. 완료 후 4(꺼내기) → 5(검사) 반복.
   - `CTRL_CHAR` 오류(LaTeX 역슬래시가 제어문자로 깨짐)가 많으면 Gemini 에 되돌리기 전에 `unpack-judgment.cjs … --repair-latex` 로 다시 꺼내 본다(\frac \times 등만 원래 글자로 복원).
   - 2번 뒤에도 남은 오류 코드는 `진행상태.json` 항목 `judgmentLeft:"Q03 QUOTE_NOT_SUBSTRING,…"` 로 적고 경량 검수자에게 넘긴다.
7. **상태 기록:** `진행상태.json` 항목을 `status:"pilot-judged"`, `prompt`(생성 채팅 제목), `judgmentPrompt`(판정 채팅 제목), `count:N` 으로 고친다.

## 하지 않는 것
- 판정 JSON·유사 JS 의 내용을 직접 고치지 않는다(경량 검수자가 한다). 도구가 막는 오류만 Gemini 에 되돌린다.
- `build-candidates --force` 를 쓰지 않는다(판정이 지워진다). JS 가 바뀐 뒤 스테이지를 새로 만들 때는 `refresh-stage.mjs`.
- 저장소 커밋·푸시·PR 은 하지 않는다.

## 명령 한눈에 보기 (T = D\tools\pilot)
| 단계 | 명령 |
| --- | --- |
| 정답 번호 | `node T\plan-answers.mjs <원본 저장소 경로>` |
| 기계 검사 | `node T\lint-similar.mjs <유사.js> W\target.json [--fix] [--json]` |
| 판정 묶음 | `node T\pack-judgment.mjs <유사.js> W [--lower]` |
| 판정 꺼내기 | `node T\unpack-judgment.cjs "<Drive 대화 파일>" W [--repair-latex] [--dry]` |
| 판정 검사 | `node C:\AI_WS\wt\similar-pilot\archive\tools\similar-import\check-judgment.mjs W\stage\<이름>.js W\judgment --no-status --json W\check.json` |
| 되돌림 문장 | `node T\errors-for-gemini.cjs W\check.json` |
| JS 고친 뒤 | `node T\refresh-stage.mjs <유사.js> W [--rebind 3,7]` |
| 경량 검수 목록 | `node T\review-list.cjs W` |
