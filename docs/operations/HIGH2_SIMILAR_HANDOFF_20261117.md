# 고2 유사시험지 생성 캠페인 인계 (2026-11-17)

사용량 한도로 중단하며 남기는 인계 문서다. 다음 세션은 이 문서와 아래 "먼저 읽을 문서"만 열면 이어 갈 수 있다. 이 문서는 진행 현황이라 캠페인이 끝나면 지운다.

## 목표 (사용자 지시)

2026년 고2 기출 중 유사시험지(`_유사.js`)가 없는 것을 과목별로 만든다. 1학기 중간부터 시작한다. 완료한 것은 병합한다.

## 현황

| 구분 | 시험지 | 상태 |
| --- | --- | --- |
| 고2 1학기 중간 (8개) | 강남여고 대수, 금당고 대수, 매산고 기하, 순천고 대수, 제일고 기하·대수, 효천고 대수·확률과통계 | 이미 유사 있음. 할 일 없음 |
| 고2 1학기 기말 | `26_강남여고_1학기_2차_고2_대수` | **병합 완료** (PR #2383, main `a576399cb`). 독립 검수 PASS, 하네스 exit 0 |
| 고2 1학기 기말 | 금당고, 순천고, 제일고, 팔마고, 효천고 (각 `26_<학교>_1학기_기말_고2_대수`) | **미작업** (5개) |
| 고2 2학기 중간 | 미적분Ⅰ 7개(강남여고·금당고·매산고·순천여고·제일고·팔마고·효천고), 기하 1개(금당고), 확률과통계 2개(순천고·제일고) | **미작업** (10개) |
| 고2 2학기 기말 | 2026년 원본이 아직 없음 | 대상 없음 |

- 금당고·순천고 기말 대수는 생성 에이전트가 한도에 걸려 중간에 끊겼고, 작업물이 한 줄도 남지 않았다(브랜치·PR·파일 없음). 처음부터 다시 한다.
- 대기열 확인: `python3 tools/route_queue_high.py --step 2 --json` (고2 1학기 기말). 다른 학년 큐가 앞서므로 고2만 하려면 시험지명을 직접 지정한다. 원본이 있는 시험지는 `archive/exams/original/high/h2/<term>/` 에서 `26_*` 파일을 보고, 유사가 있는지는 `archive/exams/similar/high/h2/<term>/<이름>_유사.js` 존재로 판정한다.
- 진행 중인 PR·브랜치는 없다. 시작 전에 `claude/similar-high-26_*` 원격 브랜치와 열린 PR을 한 번 조회해 겹치지 않게 한다.

## 사용자 결정 (이 캠페인에 적용)

1. **SVG는 문항 그림만 만든다.** 해설 SVG는 따로 작업할 예정이다(2026-11-17 사용자 지시). 이유: 해설 그림은 별도 라인에서 한 번에 만들 예정이라 지금 만들면 중복된다. 해설 plan은 `EXEMPT` + "해설 그림 별도 작업 예정" 한 문장으로 두고, 해설 본문은 그림 없이도 따라가게 쓰며 그림에서 읽는 값은 글에 적는다. 해설에 `assets/images` 참조를 넣지 않고 PR 본문에 "해설 SVG 별도 작업" 한 줄을 적는다.
2. **병합은 CI를 기다리지 않는다.** 검수 PASS와 하네스 exit 0이면 병합한다(`docs/agents/exam-release.md` 상단, 2026-11-17 규칙). CI·Pages 결과는 병합과 따로 기록한다.
3. 메타는 비우지 않는다. 맞는 키가 없으면 정식 `registryChanges`로 새 키를 만든다(`docs/agents/metadata.md`, 2026-11-16·17 갱신).

## 작업 방식 (이번 캠페인에서 쓴 흐름)

한 시험지당 생성 → 독립 검수 → 메인 확인 → 병합 순서다. `CLAUDE.md`의 메인 오케스트레이터 규칙을 따른다.

1. **생성:** Sonnet 서브에이전트(`model: "sonnet"`, `effort: "high"`, `isolation: "worktree"`). 지시서에 원본 경로, `similarStem`, 브랜치 `claude/similar-high-<similarStem>`, 위 사용자 결정, 완료 기준, 금지 사항(영수증 작성·ready 전환·병합·검사 완화·공유 도구 수정)을 적는다. 필독 정본은 `docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE1_GENERATOR_CURRENT.md`. 형식 견본은 병합된 `archive/exams/similar/high/h2/1final/26_강남여고_1학기_2차_고2_대수_유사.*` 와 `_plans`. 완료는 draft PR(제목 `[HIGH-유사 생성완료] <similarStem>`)까지다. 파일럿 소요 약 40분.
2. **독립 검수:** 생성자와 다른 Sonnet 인스턴스. `HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md`를 따라 정답·해설을 열기 전에 전 문항을 풀어 동결 후 비교한다. 수리와 `review-receipt.json` 발급까지 같은 브랜치에 push하고 병합은 하지 않는다. 파일럿 소요 약 7분.
3. **메인 확인:** 브랜치를 받아 `node tools/harness/verify_similar_exam.mjs <similarStem>`을 1회 실행해 exit 0을 확인하고, 문항 그림 PNG와 계산이 많은 문항 몇 개의 정답을 직접 확인한다. 도구는 `playwright`(설치됨)로 SVG를 PNG로 렌더해 본다.
4. **병합:** draft를 ready로 바꾸고 `merge`(머지 커밋) 방식으로 병합한다. `expectedHeadSha`에 검수 커밋 SHA를 넣는다. 병합 후 그 작업 워크트리를 지운다(`AGENTS.md` 워크트리 정리).
5. 무거운 작업은 동시에 2개까지만 돌렸다(생성 1 + 검수 1 또는 생성 2). 사용량 한도(5시간)에 걸린 것은 동시 생성 2개를 돌렸을 때다. 한도가 낮으면 생성 1개씩 돌린다.

## 먼저 읽을 문서

- `AGENTS.md`, `CLAUDE.md`, `docs/agents/outcome-method-review.md`
- `docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE1_GENERATOR_CURRENT.md`, `HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md`
- `docs/agents/metadata.md`, `docs/agents/visual-svg.md`, `docs/agents/exam-release.md`
- `docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md`

## 알려진 한계·주의

- 생성 라인 문서가 요구하는 구글 드라이브 정본(`ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`, `유사문항_생성_5단계_발췌.md`)은 이 환경에서 열리지 않았다. 문서의 요약 원칙으로 진행했고 PR 본문에 `EVIDENCE_DEBT`로 적었다.
- 파일럿(#2383)은 로컬 서버가 막혀 `engine.html` 전체 화면 캡처를 하지 못했다(문항 SVG 렌더만 확인, `NOT_RUN`). 병합 후 CI·Pages 결과는 확인하지 않았다.
- 파일럿의 Q20은 원본에 있던 a₁~a₅ 첨자 라벨이 엔진 제약으로 빠졌다. 발문이 순서를 정의해서 풀이에는 지장이 없다고 판단했다.
- 저장소 루트 폴더는 main 전용이다. 작업은 자기 워크트리에서 한다.
- 루틴(`trig_01ATGgH6wSST1FChrJwXdf88` 생성, `trig_01NU8CtKzNHgszSwWdZbcn3X` 검수·병합)은 일시정지 상태다. 켜지 않았다.
- 별도로 고1 등 다른 학년의 유사는 이전 예약 라인으로 9개가 병합되어 있다(이 캠페인과 무관).

## 다음에 할 일 (제안 순서)

1. 고2 1학기 기말 대수 5개: 금당고 → 순천고 → 제일고 → 팔마고 → 효천고.
2. 고2 2학기 중간 10개: 미적분Ⅰ 7개 → 기하 1개 → 확률과통계 2개.
3. 끝나면 해설 SVG 작업을 별도 라인으로 진행하고, 이 문서를 지운다.
