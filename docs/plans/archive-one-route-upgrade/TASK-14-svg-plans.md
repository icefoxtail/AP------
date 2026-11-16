# 작업 14 — 해설 그림 사양(plan) 대량 작성 (유형 판정 작업 10~12가 끝나면 이어서, 서브 에이전트 전부 투입)

## 왜
그림 엔진은 완성됐는데 그림 작업이 한 번에 많은 양을 처리하지 못한다. 조사해 보니 시간의 절반 이상이 "문항을 읽고 무엇을 어떻게 그릴지 정해 엔진 입력(plan)을 쓰는 일"과 그 재작업에 든다. plan만 미리 써 두면 이쪽(관제 PC)에서는 렌더·검수·게시만 하면 된다. 그래서 **아직 새 엔진으로 작업하지 않았거나 덜 된 시험지의 plan을 먼저 전부 써 두는 것**이 이 작업이다. 그림을 보는 사람은 학생이다. 기준은 "해설을 읽는 학생이 그림을 보고 풀이를 따라갈 수 있는가"다.

## 먼저 읽을 것 (전부 `main`에 있다)
- `archive/tools/geometry-equation/AUTHOR_GUIDE.md` — plan 형식과 엔진 기능(capability)별 쓰는 법. **이것이 형식의 정본이다.**
- `archive/tools/geometry-equation/ops/claude-batch/prompts/svg-common-rules.md`, `sonnet-exam-create.md`, `deepseek-addendum.md` — 실제로 반려된 결함 점검표.
- `archive/tools/geometry-equation/HANDOFF_SVG_CLAUDE_BATCH.md`, `docs/agents/visual-svg.md` — 판정 종류와 게시 규칙.
- `archive/tools/geometry-equation/ops/claude-batch/ENGINE_GAPS_HIGH.md`, `ENGINE_GAPS_MIDDLE.md`, `ENGINE_GAPS.md` — 엔진이 아직 못 그리는 것.
- 본보기: `archive/tools/geometry-equation/production/plans/` 의 기존 plan(약 1,000개, 중등 2학기 기말). 같은 종류의 문항은 기존 plan을 본보기로 삼는다.
- 장부: `archive/tools/geometry-equation/production/exam-figure-ledger.json` (시험지·문항별 상태. 읽기만 한다).

## 범위와 순서
1. 장부에서 OPEN인 문항(약 318건). 그중 고2 2학기 기말(수학II·확률과통계) 약 212건이 가장 많고 대부분 미착수다.
2. 장부에 아직 없는 원본 기출 시험지 약 394개(고2 161, 중3 135, 중2 87, 중1 8 등: 1학기와 고2 1학기·2학기 중간이 대부분). 시험지 목록은 `archive/exams/original/**` 와 장부의 `src`를 대조해 직접 뽑는다.
3. 장부에서 PUBLISHED지만 옛 방식(엔진을 거치지 않은 손 SVG)인 그림은 이번 범위가 아니다. 눈에 띄면 보고서 목록에만 적는다.
- 이미 PUBLISHED·EXEMPT인 문항, CLOSED 시험지는 건드리지 않는다.
- 시험지 단위로 소유를 나눠 서브 에이전트에 배정한다(한 시험지를 두 에이전트가 같이 잡지 않는다).

## 문항마다 할 일
1. **판정:** 해설 그림이 필요한가. `FIGURE`(새로 그림) / `EXEMPT`(그림이 필요 없는 문항: 이유 한 줄) / `UNSUPPORTED`(엔진이 못 그림: 무엇이 없어서인지, ENGINE_GAPS의 어느 항목인지) / `CONTENT`(문항·해설 자체에 오류가 있어 그릴 수 없음: 이유).
   - 그림이 풀이 이해에 도움이 되면 `FIGURE`다. 쪽수가 늘거나 스캔이 흐리다는 이유로 빼지 않는다.
   - 지시선·라벨 옵션으로 해결되는 것을 `UNSUPPORTED`로 넘기지 않는다. `UNSUPPORTED`에는 시도한 옵션을 적는다.
2. **plan 작성(`FIGURE`만):** AUTHOR_GUIDE 형식 그대로. 한 문항에 그림이 여럿 필요하면 여러 개.
3. **자기 점검(plan마다, 결과를 판정표에 적는다):**
   - 정답 값이 라벨·alt·caption·title에 드러나지 않는다(문제 풀이의 최종 답을 그림이 말해 주면 안 된다).
   - 해설에 나오는 중간값(풀이에 쓰는 길이·좌표·각)은 지우지 않고 넣는다.
   - 좌표·끝점·교점은 문제의 식에 직접 대입해 맞는지 계산해 본다(엔진은 틀린 값도 그대로 그린다).
   - caption·alt가 가리키는 이름(점 C, 직선 l)이 실제로 그림 라벨에 있다.
   - 분수는 세로 분수만(빗금 금지). 이차함수 등 그래프는 가로·세로 같은 배율이 기본이고, 직선 y=x·기울기 ±1·원은 반드시 같은 배율. 닮은 도형을 떼어 그릴 때는 실제 닮음비대로 크기를 다르게. 각 표시는 연한 색 부채꼴과 호. 서로 다른 선·영역은 색으로 구분. 좌표가 빽빽하면 그림 위 좌표 띠(A(x, y))를 쓴다. 라벨은 가리키는 대상 곁에.
   - 교육과정 밖 그래프로 돌려 그리지 않는다. 해설에 없는 보조선을 함수 그래프와 같은 실선으로 그리지 않는다. 합동·닮음 해설에는 대응 관계가 보이는 패널을 넣는다.
4. **렌더 시험(가능하면):** 작업 환경에서 `node archive/tools/geometry-equation/production/render.mjs`(사용법은 AUTHOR_GUIDE)가 돌아가면 plan을 렌더해 오류 없이 나오는지와 엔진 관측기 결과를 본다. 통과하면 `render: "PASS"`, 오류면 고쳐서 다시, 환경에서 못 돌리면 `render: "NOT_RUN"`. **렌더가 안 돼도 plan 작성은 계속한다.** 렌더 결과물(SVG·PNG)은 커밋하지 않는다.

## 쓰는 곳 (plan만 저장)
- 새 브랜치 `data/svg-plans-20261117`(최신 `main`에서). `main`에 병합하지 않는다(운반용).
- plan: `docs/plans/archive-one-route-upgrade/svg-plans/<시험지 파일 이름>/q<문항 순번>-solution[-<n>].json`
- 판정표: 같은 폴더의 `<시험지 파일 이름>/_decisions.jsonl` — 문항당 한 줄: `{"exam": "<시험지 경로>", "no": <순번>, "decision": "FIGURE|EXEMPT|UNSUPPORTED|CONTENT", "plans": ["q7-solution.json"], "capability": "<엔진 기능 이름>", "why": "<이 그림이 학생에게 보여 주는 것 한 문장 / 면제·미지원 이유>", "selfcheck": {"answerHidden": true, "midValuesKept": true, "coordsVerified": true, "captionNamesPresent": true}, "render": "PASS|NOT_RUN|<오류 요약>", "note": ""}`
- 저장소의 기존 plan 폴더, 장부, 시험지 JS, 그림 파일, 엔진 코드는 고치지 않는다. PR 생성·`main` 병합 금지.
- 시험지 20~30개마다 커밋한다(끊겨도 남게). 보고는 계획 브랜치 `TASK-14-REPORT.md`(같은 주기로 갱신).

## 보고
시험지·문항 수, 판정 분포, capability별 plan 수, 렌더 PASS/NOT_RUN 수, `UNSUPPORTED`를 엔진 공백 항목별로 묶은 목록(문항 수와 대표 3개), `CONTENT` 목록, 작성하면서 반복해 쓴 틀(값만 바꿔 쓸 수 있는 종류와 건수: 나중에 템플릿으로 만들 후보), AUTHOR_GUIDE에서 헷갈렸거나 빠져 있던 것, 남은 범위.
