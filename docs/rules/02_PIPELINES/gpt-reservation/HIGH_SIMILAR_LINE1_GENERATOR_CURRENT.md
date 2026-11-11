# 고등 유사문항 생성 라인 예약 프롬프트 정본 (Line 1: GENERATOR)

- **파일 위치**: `docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE1_GENERATOR_CURRENT.md`
- **역할**: `HIGH_SIMILAR_GENERATOR` — 후보 유사시험지 JS 생성과 `READY_FOR_INDEPENDENT_REVIEW` 인계 전담.
- **권한 경계**: `review-receipt.json` 작성 금지, `main` 병합 금지. 작업 브랜치 push와 **draft PR 생성**까지만 한다.
- **실행기**: Claude 예약. 루틴 화면에서 저장소를 못 붙이므로, 전달 세션이 `create_session`으로 저장소가 붙은 새 세션을 매 회차 만들어 이 프롬프트를 실행한다(저장소 없는 루틴 세션은 `GH_TOKEN` 무효·GitHub 도구 없음으로 push 불가, 2026-11-11 실측). 브랜치는 `claude/` 접두어(과거 유사 생성의 관행). 새 세션은 앞 회차 기억이 없으므로 인계는 전부 Git 브랜치/draft PR로 한다.
- **일정(사용자 지정 2026-11-11)**: 짝수 시각 17분 `17 0,2,4,6,8,10,12,14,16,18,20,22 * * *` (KST, 하루 12회, 1회차 = 시험지 1개). 모델 Sonnet, effort medium.
- **이유**: 중등 2-라인(`MIDDLE_SIMILAR_LINE1/2`)과 같은 구조로, 생성자와 검수자를 분리해 독립 블라인드 검수를 지키기 위해서다. 고등은 교육과정(2015/2022)·과목이 갈라지므로 큐와 필독 정본이 중등과 다르다.

이 문서는 **고등 유사 .js를 직접 만든다**. 구글 드라이브 일체형 md(중1용 Gemini 프롬프트) 경로와는 별개이고, md→JS 이관 단계가 없다.

---

## 1. 필독 정본 (회차 시작 시 실제 본문을 연다)

1. `docs/agents/outcome-method-review.md` (공통 판단 계약) — 같은 세션에서 읽은 판본은 재사용.
2. `docs/agents/exam-pipeline.md`, `docs/agents/metadata.md`(특히 "PT·TPL·CrossConcept·Condition·크로스워크 행 확장 원칙"과 "빈 메타 채우기"), `docs/architecture/JS_Archive_Meta_OS_CURRENT.md` — 메타·4칸 공통 계약. 유사 문항 1개의 메타 완성 = Meta OS + 4칸 계약 + 이 문서.
3. `docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md` — RPM→CrossConcept/Condition/Integration 판정, PT/TPL은 공식 Resolver 결과만.
4. `docs/rules/02_PIPELINES/gpt-reservation/CREATE_CURRENT.md` §2~§3 — 학생용 작은칠판 해설·정밀 Meta 책임. (예약 공용 README의 Library/Drive stage 변수는 이 라인에 쓰지 않는다. 입력과 인계는 Git이다.)
5. `docs/rules/02_PIPELINES/해설프로토콜.md` — 칠판 판서형 해설.
6. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md` — 그림이 있는 문항에서만 해당 부분.
7. 유사문항 생성 원칙(ALIVE 룰북 §12 STRICT_VARIANT, 5단계: 불변량·자유도 → 풀이 구조 → 답에서 거꾸로 수치 역산 → 발문 → 발문만 보고 다시 풀기)은 구글 드라이브 `AP_유사시험지_마크다운/_정본/`에 있다. 드라이브에 접근할 수 있으면 `ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`, `유사문항_생성_5단계_발췌.md`를 읽고, 못 읽으면 그 사실을 보고 맨 위에 적고 아래 §3의 요약 원칙으로 진행한다(추정으로 정본 내용을 만들어 쓰지 않는다).
8. 형식 견본: 이미 병합된 같은 학년·같은 학기의 유사 JS 1개와 그 `.meta-*.json`, `.review-receipt.json`을 열어 필드 구성을 맞춘다. 예: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사.js`.

정본이 열리지 않으면 그 사실을 보고에 적고, 해당 부분은 비워 두고 사유를 적는다(`EVIDENCE_DEBT`).

---

## 2. 작업 절차

1. **대기열 조회와 중복 방지**
   - 열린 PR과 원격 브랜치에서 `claude/similar-high-` 접두어 브랜치를 모두 조회한다. 각 브랜치의 stem을 모은다.
   - `python3 tools/route_queue_high.py --next-in-line --json --skip <stem1> --skip <stem2> ...` 를 실행해 이번 시험지 1개를 받는다. 시험지명을 하드코딩하지 않는다.
   - 받은 stem의 `similarStem`(예: `26_금당고_1학기_기말_고1_유사`)이 이미 `main`에 있거나 다른 브랜치가 점유 중이면 `--skip`에 추가해 다음 순번을 받는다. 시험지가 없으면 `NO_INPUT`으로 이 회차를 끝낸다.
2. **원본 읽기와 교육과정 확정**
   - 원본 `archive/exams/original/high/<g>/<term>/<stem>.js`의 문항 수, 형식(객관식·서답형), 배점, 그림 유무를 읽는다.
   - 교육과정(2015/2022)과 과목(공통수학1·2, 대수, 미적분Ⅰ, 확률과 통계, 기하, 수학Ⅰ·Ⅱ 등)은 **원본 JS의 `curriculum`·`courseKey`·`standardCourse` 값을 그대로 쓴다.** 학년이 옮겨 간 내용이면 메타 `hold`에 적는다.
3. **유사문항 작성 (STRICT_VARIANT)** — §3 원칙. 원본 1문항당 유사 1문항, 문항 번호·배점 동일. 배점 합 100.0.
4. **그림이 필요한 문항**: `AUTHOR_GUIDE.md` 계약대로 plan을 쓰고 공식 렌더러 `render-plan.mjs`로 실제 렌더한다. 임의 SVG 수작업 금지. 그림이 필요 없으면 plan에 `EXEMPT` + 한 문장 사유.
5. **저장 파일** (`archive/exams/similar/high/<g>/<term>/`)
   - `<stem>_유사.js`: `window.examTitle`, `window.examDisplayTitle`, `window.questionBank`. 문항 필드는 형식 견본과 같게 한다(`id, level, category, standardCourse, curriculum, curriculumKey, courseKey, standardUnitKey, subUnitKey, conceptClusterKey, questionType, content, choices, answer, solution` 등).
   - `<stem>_유사.meta-qNN-qMM.json`: `approval.reviewStatus = "review_required"`. 문항마다 `sourceQid, variationType, primaryMethod, decisiveStep, rpm(L1~L4), ptTplCandidate, crossConceptKeys, conditionKeys, integrationPattern, difficultyBucket, difficultyConfidence, difficultyBoundaryFlag, difficultyReason, level, item4slot, hold`.
   - `<stem>_유사_plans/qNN-problem.plan.json`, `qNN-solution.plan.json` (문항 수 × 2).
6. **자체 점검** (§4) 후 `--phase=draft` 진단: `node tools/harness/verify_similar_exam.mjs <similarStem> --phase=draft`. 초안 PASS는 출고 승인이 아니다.
7. **인계**
   - 브랜치 `claude/similar-high-<similarStem>`(고정 접두어)에 커밋하고 push.
   - draft PR을 만든다. 제목 `[HIGH-유사 생성완료] <similarStem>`. 본문에 원본 경로, 문항 수, 배점 합, 정답 분포, draft 진단 결과, 열지 못한 정본, `hold` 요약. `pipelineState = READY_FOR_INDEPENDENT_REVIEW`를 적는다.
   - 생성자는 영수증을 만들지 않고, PR을 ready로 바꾸거나 병합하지 않는다.

---

## 3. 유사문항 생성 원칙 요약 (드라이브 정본이 우선)

- **잠그는 것**: 형식, 개념, 유형, 풀이 구조, 발문 논리 순서, 출제 의도, 난도 역할, 그림 구조, 교육과정. **바꾸는 것**: 수치, 상수, 변수명과 그에 따른 보기·정답.
- 목표 답과 풀이 구조를 먼저 정하고 거기서 수치를 역산한다. 발문을 쓴 뒤에는 발문과 보기만 보고 다시 풀어 유일한 정답을 확인한다. 오류가 나오면 정답·보기를 끼워 맞추지 않고 수치 설계부터 다시 한다.
- 객관식 정답 번호 ①~⑤는 균등 분배(max−min ≤ 1)하고 같은 번호가 3문항 연속되지 않게 한다. 맞추는 방법은 보기 순서 재배열뿐이다. 오답 4개는 서로 다른 실제 오류 경로에서 만든다.
- 해설은 칠판 판서형으로 쓴다: 조건과 목표 → 공식 선택 이유 → 등호 중심의 단계별 수식 전개 → 부호·구간·경계·보기 판정 → 정답. 그림에서 읽은 값은 해설에 다시 적는다. 줄글 사설 금지.
- 수식은 전부 `$…$` 또는 `$$…$$`(KaTeX). `\(…\)` 금지.
- **메타는 비우지 않고 전부 채운다 (사용자 결정 2026-11-11).** 유사문항 자체를 풀고 문항마다 모든 필드를 판정한다. 원본 메타·4칸을 복사해 끝내지 않는다(원본 4칸은 참고만).
  - **맞는 기존 키가 없으면 비우지 않고 새로 만든다.** 가장 가까운 키에 억지로 붙이지도 않는다. [확장 원칙](../../../agents/metadata.md)(2026-11-02 사용자 결정 (a)~(e))대로 정식 `registryChanges`로 새 PT/TPL/CrossConcept/Condition 키를 만들고, 같은 형태 문항은 그 키를 재사용한다. 새 키의 이름·정의는 특정 시험의 숫자·식 없이 풀이 구조로 일반화해 쓴다.
  - **크로스워크 행이 없으면(`DIRECT_BINDING_GAP`·`RPM_ONLY`) 행을 덧붙인다.** 문항·해설을 보고 마스터에 있는 RPM 리프를 정해 `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/<파일>.json`에 `DIRECT_ACTIVE` 행을 추가하고 `summary` 개수를 갱신한다(`docs/agents/metadata.md` "크로스워크 행 확장"). 마스터에 맞는 리프가 없으면 새 리프를 `newKeyProposal`로 제안해 채운다. 이름이 비슷하다고 고르지 않는다.
  - 근사 키로 때우지 않는다. 가장 가까운 리프로 "근사"한 문항은 허용되지 않는다. 해설이 두 리프 중 하나로 정해지지 않으면 `rpmPrimaryRecordId`로 지목한다.
  - 메타 작성 도구·절차: `docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md`, `node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage CREATE --input <stage-local decision.json> --out <stage-local evidence.json>`, 방향 원칙은 `docs/architecture/JS_Archive_Meta_OS_CURRENT.md` 0장(새 값은 받아 두고 나중에 묶는다 / 값이 있으면 쓴다 / 추정으로 만들지 않는다).
  - PT/TPL 최종 값은 공식 Resolver 결과다. 후보(`ptTplCandidate`)에는 실제 키(기존 또는 `registryChanges`로 만든 새 키)를 적는다. null로 두지 않는다.
  - 4칸(`item4slot`)은 문항마다 발문·해설을 읽고 판정하며, 용어는 `term-dictionary-v1.5.json`에 있는 것만 쓴다. 사전에 없는 용어는 후보로 선언한다(`JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md`).
  - 난이도는 보수적으로(애매하면 낮은 단계 + 경계 플래그), `primaryMethod`·`decisiveStep`·`difficultyReason`은 문항마다 직접 쓴다.
  - 빈 칸 0이 목표다. 도구·권한 때문에 정말 만들 수 없는 칸만 `hold`에 구체적인 이유와 시도한 것을 적고 PR 본문 첫머리에 별도로 올린다. "맞는 키가 없다"는 이유로 비우는 것은 허용되지 않는다.

---

## 4. 저장 전 자체 점검

- 문항 수·배점 합이 원본과 같은가. 정답 번호 max−min ≤ 1, 3연속 없음.
- 문항마다 발문·보기만 보고 다시 풀어 답이 같은가.
- `.js`가 문법 오류 없이 로드되는가(`node -e` 로 `window` 스텁 후 `require`). 메타·plan이 JSON으로 읽히는가.
- plan이 문항 수 × 2개 있는가. 메타의 `rpm`이 현행 표(또는 새로 낸 `newKeyProposal`)의 한 줄인가. 빈 칸이 0인가(`hold`는 만들 수 없던 칸만, 구체 사유와 함께).
- 같은 문장이 반복된 `primaryMethod`·`difficultyReason`이 없는가. 한 시험지의 전 문항이 같은 L3·난이도가 아닌가.

---

## 5. 독립 창 등록용 실제 프롬프트 전문

```text
[HIGH_SIMILAR_GENERATOR - 고등 유사시험지 1단계 생성 라인]
저장소: icefoxtail/AP------ (세션에 없으면 add_repo로 추가). 브랜치는 main 기준으로 새로 판다.
먼저 AGENTS.md와 docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE1_GENERATOR_CURRENT.md 를 실제로 열어 끝까지 읽고 그대로 따른다.
요약: (1) 열린 PR/원격 브랜치의 claude/similar-high-* 를 모아 'python3 tools/route_queue_high.py --next-in-line --json --skip ...' 로 이번 시험지 1개를 받는다. (2) 원본을 읽고 STRICT_VARIANT로 유사 JS·메타 JSON·plans를 archive/exams/similar/high/<g>/<term>/ 에 만든다. (3) 자체 점검과 verify_similar_exam.mjs --phase=draft 후, 브랜치 claude/similar-high-<similarStem> 에 push하고 제목 '[HIGH-유사 생성완료] <similarStem>' draft PR을 만든다. 영수증 작성, PR ready 전환, main 병합 금지. 시험지가 없으면 NO_INPUT으로 끝낸다. 이 회차에 시험지는 1개만 처리한다.
마지막 보고: 시험지명, 문항 수, PR 링크, 읽은 정본/열지 못한 정본, 메타 필드별 채움 수/문항 수, 새로 만든 키 수, hold 수와 사유, 난이도 분포(1~5).
```
