# 고1 1학기 중간 유사 6종 — SVG 엔진 24칸 정식 수리 플랜 (Codex 인계)

> **상태: PLAN_JSON_DRAFTS_COMMITTED / ENGINE_LINT_BLOCKED / ENGINE_NOT_RUN / JS_AND_SVG_NOT_CHANGED**  
> 작성 2026-11-22 KST · 검수 소유 GPT · 엔진 실행 소유 별도 Codex SVG 작업자

## 실제 SVG 엔진 입력 JSON 초안 — 이번 재작업의 우선 정본

- [24개 `plan.json` · `item.json` · `publish.json` 실제 파일 목록](H1_1MID_20261122_PLAN_JSON_DRAFTS/README.md), [기계형 인덱스](H1_1MID_20261122_PLAN_JSON_DRAFTS/manifest.json). 24폴더 × 3개 JSON = 72개 입력 초안. 각각은 정확한 `capability`·수치·`sourceConditions`·`newVisualInformation`·`sourceQuote`를 갖는다.
- 원본 EXEMPT/UNSUPPORTED 24개 파일은 역사 증거로 그대로 두고 **새 JSON을 직접 엔진 입력**으로 전달한다. 처음부터 새 plan을 작성하는 지시가 아니다. 실제 엔진이 거절한 필드·라벨만 수정하고 재렌더한다.
- 이 검수 환경의 공식 린터는 `ModuleNotFoundError: No module named 'visual_engine'`로 막혔다. JSON 파싱·원문 인용·문항 경로·핵심 수학 수치만 별도로 확인했다. **24개 모두 `ENGINE_LINT_NOT_RUN`/`RENDER_NOT_RUN`**, 그중 F-12/15/21은 `ENGINE_SUPPORT_CHECK`이다. 이것은 `ARCHIVE_BOUND` 증거가 아니다.

## 0. 목표·경계와 출처

- 목표: 2026년 고1 1학기 중간 유사 **6종·133문항** 수학/연결이미지 검수에서 원본 기출 이미지 1:1 계승 규칙과 충돌한 **누락 문제 이미지 6 + 해설 이미지 18 = 24칸**을 공식 SVG 엔진에서 다시 생성·연결하고, 학생 화면과 독립 검수까지 마감한다. 기존 연결 **SVG 46개는 실물 렌더 QA 통과**했고 새 결함을 발견하지 않았으므로 수정 대상에서 제외한다.
- [동일 판본의 전수 감사 보고서](H1_1MID_SIMILAR_BATCH6_VISUAL_QA_20261122.md) 및 6개 `26_*_DEEP_AUDIT.md`가 이번 계획의 검수 인계다. 기존 고1 2학기 기말 유사 23종의 6개 SVG 결함은 **이 작업 범위 밖**, 앞선 [별도 계획](H1_2FINAL_SIMILAR_SVG_ENGINE_REPAIR_EXECUTION_PLAN_20261122.md)에서 계속 OPEN이다.
- 감사 전용 브랜치: `work/solution-upgrade-h1-similar-1mid-20261122`. 소스 기준 커밋 `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`. 이 브랜치에는 **검수 MD·실행 지시서와 별도 JSON 패킷 24세트(72개)만 작성**했고 JS/SVG/엔진/원본 기출을 수정하지 않았다.
- 실제 수정자는 최신 `origin/main` 기준 **별도 worktree + 새 수리 브랜치**(예: `work/h1-1mid-similar-svg-repair-20261122`)를 만들고, 시작 시 아래 Git blob SHA와 실제 JS 참조가 현재 main에서 달라졌는지 확인한다. 달라졌으면 해당 qid만 재검수하고 계획의 차이를 기록한다.
- 새/교체 SVG는 `archive/tools/geometry-equation/`의 **공식 SVG 엔진만 사용**한다. 수작업 SVG, 스크립트로 직접 만든 SVG, XML 편집 대체, 다른 렌더러 산출 SVG 게시 금지. 스캔 원본 PNG는 정보 참고용이며 새로운 수정 PNG를 만드는 작업이 아니다.

## 1. 착수 때 실제로 읽을 정본

1. `AGENTS.md`, 하위 `archive/AGENTS.md`가 있으면 그것도, `docs/agents/outcome-method-review.md`, `common.md`, `exam-pipeline.md`, `visual-svg.md`, `git-evidence.md`, `similar-choices.md` (각 문서는 `docs/agents/` 아래).
2. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `HANDOFF_SVG_CODEX.md`, `HANDOFF_SVG_ENGINE.md`, `ops/svg-m1/briefs/plan-current.md`·`review1.md`·`review.md`, `ops/svg-m1/guide/`의 관련 프리미티브 안내와 원본 그림 교체용 독립 QA 규칙.
3. 아래 6개 JS의 **현재** qid: 발문·보기·정답·해설·원본/유사 이미지·alt/caption/size·`problemPlanRef`/`solutionPlanRef`, 대응 원본 기출 qid/실물 PNG/SVG.
4. 감사 [보고서](H1_1MID_SIMILAR_BATCH6_VISUAL_QA_20261122.md)의 `IMAGE_PARITY_HOLD_24` 및 qid별 수학 근거. 지금의 24개 legacy plan 중 **21개가 `EXEMPT`, 3개가 `UNSUPPORTED`**라는 사실을 `PASS`나 `READY_TO_RENDER`로 오독하지 않는다.

## 2. 기준 JS blob SHA / 작업 분모

| 시험지 JS | 기준 Blob SHA | 문항 | 유지 이미지 | 누락 역할 |
| --- | --- | ---: | ---: | ---: |
| `archive/exams/similar/high/h1/1mid/26_강남여고_1학기_중간_고1_유사.js` | `52509c154df8ec5b8814c423045b900570835e1b` | 24 | 7 | 3 |
| `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사.js` | `8c1d451fd928897258f60bb10633816ce5a00a9a` | 20 | 7 | 4 |
| `archive/exams/similar/high/h1/1mid/26_매산고_1학기_중간_고1_유사.js` | `5a0d5129e3e1cefe130ce6ac01c5998176d4762f` | 20 | 8 | 1 |
| `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사.js` | `8d56519578c10b3c1ef16eeb28908469eec776e4` | 23 | 5 | 4 |
| `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사.js` | `946b94c01accfd7623747189f9d5d661d34ec8a5` | 24 | 8 | 10 |
| `archive/exams/similar/high/h1/1mid/26_팔마고_1학기_중간_고1_유사.js` | `01458908c622f56d5bffb70251dd92fb3fa457db` | 22 | 11 | 2 |
| **합계** | — | **133** | **46** | **24** |

모든 133개 문항에서 `problemPlanRef`와 `solutionPlanRef` 파일이 존재함은 확인했다(266/266). 단, 이는 **엔진용 완료 plan이 266개라는 뜻이 아님**; 미연결 24개는 `EXEMPT/UNSUPPORTED` 등 기록 JSON이다.

## 3. 수정 슬롯·원본 자산·판본 결속

원본 경로는 `archive/assets/images/` 아래다. 표의 원본 상대 경로는 해당 접두사를 생략했으며 SHA는 40자 Git blob이다. 새로운 SVG의 대상 폴더는 항상 `archive/assets/images/26_<학교>_1학기_중간_고1_유사/`로, JS의 `assets/images/...` 참조는 `archive/` 기준이다.

| ID | 시험지/qid | JS 필드 | 우선 | 기존 plan | 원본 기출 이미지 상대 경로 | 원본 SHA |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 강남여고 7번 | `image` | **P2** | `EXEMPT` | `26_강남여고_1학기_중간_고1_기출/q07.png` | `31eaca742697097759f16986724e24a911b85359` |
| F-02 | 강남여고 14번 | `solutionImage` | **P2** | `EXEMPT` | `26_강남여고_1학기_중간_고1_기출/q14-solution.svg` | `70f7afee6f48889a730b5c45118a61a9ec9025a4` |
| F-03 | 강남여고 24번 | `solutionImage` | **P2** | `EXEMPT` | `26_강남여고_1학기_중간_고1_기출/q24-solution.svg` | `fa3b9e872292e6586a6549d561dd7116b3fd9e6f` |
| F-04 | 금당고 4번 | `solutionImage` | **P2** | `EXEMPT` | `26_금당고_1학기_중간_고1_기출_c/q4-solution.svg` | `47bd28ccc93c0521f89ccce5e04d116b256845e2` |
| F-05 | 금당고 13번 | `solutionImage` | **P2** | `EXEMPT` | `26_금당고_1학기_중간_고1_기출_c/q13-solution.svg` | `372f61923a4482ea2c2e210444bbb8c4d5441ab8` |
| F-06 | 금당고 16번 | `solutionImage` | **P2** | `EXEMPT` | `26_금당고_1학기_중간_고1_기출_c/q16-solution-v2.svg` | `e07bc56e905b1189cef11979417dacd9aa6daf0b` |
| F-07 | 금당고 19번 | `image` | **P2** | `EXEMPT` | `26_금당고_1학기_중간_고1_기출/q19.png` | `0f749bc33fd057c3114e55517d400f18450f6d58` |
| F-08 | 매산고 9번 | `solutionImage` | **P2** | `EXEMPT` | `26_매산고_1학기_중간_고1_기출c/q9-solution.svg` | `3825614b1483048b4d47a06bc91e8b97d1995829` |
| F-09 | 매산여고 6번 | `solutionImage` | **P2** | `EXEMPT` | `26_매산여고_1학기_중간_고1_기출_c/q6-solution-v2.svg` | `7e3e2a4471f3a88101908501c4821243be277652` |
| F-10 | 매산여고 11번 | `solutionImage` | **P2** | `EXEMPT` | `26_매산여고_1학기_중간_고1_기출_c/q11-solution.svg` | `67a6d4741d30cd61a965e1201355cdf93c16b80b` |
| F-11 | 매산여고 13번 | `solutionImage` | **P2** | `EXEMPT` | `26_매산여고_1학기_중간_고1_기출_c/q13-solution-v2.svg` | `1f69cfabb8a69494d508a8638eb604c7a5dc888d` |
| F-12 | 매산여고 19번 | `solutionImage` | **P1** | `UNSUPPORTED` | `26_매산여고_1학기_중간_고1_기출_c/q19-solution-v2.svg` | `a5c477a75d09d5e6f0d6d046e43ba23472ecab63` |
| F-13 | 복성고 1번 | `solutionImage` | **P2** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q1-solution-v2.svg` | `8218997ce44a41ea3417376df98e661a0d363fbb` |
| F-14 | 복성고 5번 | `image` | **P1** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q05.png` | `4933b5c065a49607288f58d25bf81013cf4d9a43` |
| F-15 | 복성고 5번 | `solutionImage` | **P1** | `UNSUPPORTED` | `26_복성고_1학기_중간_고1_기출/q5-solution.svg` | `fc6bcc88c637f1bd83efead6cac6de0a1c08f838` |
| F-16 | 복성고 7번 | `solutionImage` | **P2** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q7-solution-v2.svg` | `dacce6c84fe16d159c78e39eb0e23014e95e50d2` |
| F-17 | 복성고 11번 | `solutionImage` | **P2** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q11-solution.svg` | `e469c085304ddb629bd5ce90141c6bf461063dd0` |
| F-18 | 복성고 14번 | `image` | **P2** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q14.png` | `2d2bc8254264244a966cc29b2f95f69504685a67` |
| F-19 | 복성고 18번 | `image` | **P1** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q18.png` | `0474917028b5efdd51c85b41d61446eebf1dd86f` |
| F-20 | 복성고 19번 | `image` | **P1** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q19.png` | `70093d30d071c942c57f2892b249768409043630` |
| F-21 | 복성고 19번 | `solutionImage` | **P1** | `UNSUPPORTED` | `26_복성고_1학기_중간_고1_기출/q19-solution.svg` | `c21739c103c10a5ad16845cf49465cc49c10cce6` |
| F-22 | 복성고 20번 | `solutionImage` | **P2** | `EXEMPT` | `26_복성고_1학기_중간_고1_기출/q20-solution.svg` | `8e0df74a7a79e151cb710c2f61f00fe104a7d963` |
| F-23 | 팔마고 9번 | `solutionImage` | **P2** | `EXEMPT` | `26_팔마고_1학기_중간_고1_기출_c/q9-solution.svg` | `aba434958422c4376b648435baf543d78f7b5d1d` |
| F-24 | 팔마고 18번 | `solutionImage` | **P2** | `EXEMPT` | `26_팔마고_1학기_중간_고1_기출_c/q18-solution.svg` | `4f20652370e408bb2bfc15bffdccc0577ce42c8a` |

**우선 처리:** P1은 F-12(매산여고 19 해설), F-14·15(복성고 5 문제·해설), F-19(복성고 18 문제), F-20·21(복성고 19 문제·해설) **6칸**이다. 다음 P2 18칸을 완료한다. 학생 이해를 막는 실제 새 수학/이미지 모순을 발견하면 P0로 승격해 본문·정답 이슈를 먼저 처리한다. 이미지가 없더라도 기존 수학 해설은 현재 검수된 상태이므로 함부로 본문을 다시 쓰지 않는다.

## 4. 슬롯별 독립 기대 도식과 새 파일 위치

원본 기출 이미지가 있던 역할은 그대로 계승하되, 유사문항의 숫자·점·조건으로 재설계한다. 특히 **문제용 이미지에 정답·개선풀이 수치를 미리 노출하지 않는다**. 해설용 이미지는 수치와 판정 조건을 정확히 드러낸다. 작업자가 `item.json`의 expected를 먼저 작성하고, 아래 수학 조건을 **현재 JS와 독립 대조**한 다음 그 사실을 엔진 plan으로 옮긴다.

### F-01 · 강남여고 7번 · 문제 슬롯 · P2

- **기하/수학 기대값:** 문제용 y=x²와 미지의 직선 y=ax+b를 P,Q 두 교점으로 표시. P의 x좌표 1−√7만 주고 a=2,b=6 또는 직선 y=2x+6을 발문 이미지에 미리 노출하지 않는다.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_강남여고_1학기_중간_고1_유사_plans/q07-problem.plan.json` (blob `cc898dd76f1642c15187014e3e18816734a76138`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q07.png` (blob `31eaca742697097759f16986724e24a911b85359`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_강남여고_1학기_중간_고1_유사/q07-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q7의 `image` 필드에만 결속.

### F-02 · 강남여고 14번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 근 b=1/4, a=2 → 새로운 두 근 4,1 및 f(x)=(x−4)(x−1) 관계를 단계별 표시. 기존 원본 해설 그림과 같은 역할만 유지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_강남여고_1학기_중간_고1_유사_plans/q14-solution.plan.json` (blob `5da97f3030c559cdb4de264dab5f652f2b01f24a`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q14-solution.svg` (blob `70f7afee6f48889a730b5c45118a61a9ec9025a4`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_강남여고_1학기_중간_고1_유사/q14-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q14의 `solutionImage` 필드에만 결속.

### F-03 · 강남여고 24번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 직각삼각형 C=90°, 두 직각변 a,b, 빗변 c=17/2; a−b=7/2, ab=30, 넓이 15 관계를 도형에 정확히 배치.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_강남여고_1학기_중간_고1_유사_plans/q24-solution.plan.json` (blob `b44b4fd9810709157482a17dd8be3e4dda955a63`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q24-solution.svg` (blob `fa3b9e872292e6586a6549d561dd7116b3fd9e6f`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_강남여고_1학기_중간_고1_유사/q24-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q24의 `solutionImage` 필드에만 결속.

### F-04 · 금당고 4번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 보기 ①~⑤의 판별식 부호(+5,0,+16,−23,0) 비교 시각표 또는 포물선 교점 모식도. ④만 서로 다른 허근이라는 사실 유지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사_plans/q04-solution.plan.json` (blob `253997975e146a2d2a52d62c5c4b5024e3e800a0`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q4-solution.svg` (blob `47bd28ccc93c0521f89ccce5e04d116b256845e2`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_금당고_1학기_중간_고1_유사/q04-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q4의 `solutionImage` 필드에만 결속.

### F-05 · 금당고 13번 · 해설 슬롯 · P2

- **기하/수학 기대값:** a=−4,b=1이면 f_k(x)−(−4x+1)=k(x−1)². 모든 k≠0에서 T(1,−3) 한 점 접촉; k 양수·음수 2개 예시 곡선과 공통 접선의 역할 구별.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사_plans/q13-solution.plan.json` (blob `0dffc499584d1587696983727852a668f6f468ae`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q13-solution.svg` (blob `372f61923a4482ea2c2e210444bbb8c4d5441ab8`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_금당고_1학기_중간_고1_유사/q13-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q13의 `solutionImage` 필드에만 결속.

### F-06 · 금당고 16번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 최적 α=2/3, β=2, k=7/3; 직선 y=2x+7/3과 f(x)=x²−(2/3)x+11/3의 교점 (2/3,11/3),(2,19/3) 및 α:β=1:3을 표시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사_plans/q16-solution.plan.json` (blob `03a12e3060db69c0d8e047e30ca5202215d8eb1d`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q16-solution-v2.svg` (blob `e07bc56e905b1189cef11979417dacd9aa6daf0b`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_금당고_1학기_중간_고1_유사/q16-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q16의 `solutionImage` 필드에만 결속.

### F-07 · 금당고 19번 · 문제 슬롯 · P2

- **기하/수학 기대값:** 외접하는 두 구의 단면 모식도: 반지름 3,4, 중심간 거리 7. 구 모양이라는 점과 평면 단면 개념을 혼동하지 않게 표기, 학생 발문 조건 외 정답 유도 표기 금지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사_plans/q19-problem.plan.json` (blob `782a0b99942871fa44fb19b7c4647df687044aca`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_금당고_1학기_중간_고1_기출/q19.png` (blob `0f749bc33fd057c3114e55517d400f18450f6d58`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_금당고_1학기_중간_고1_유사/q19-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q19의 `image` 필드에만 결속.

### F-08 · 매산고 9번 · 해설 슬롯 · P2

- **기하/수학 기대값:** √a√b=−√(ab)에서 a<0,b<0. 네 판별식 Dㄱ=a²−4b>0, Dㄴ=4−4ab, Dㄷ=1−4ab, Dㄹ=25+4ab>0의 부호판정 표. ㄱ·ㄹ만 항상 실근.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_매산고_1학기_중간_고1_유사_plans/q09-solution.plan.json` (blob `1271116e8cf2958372adf98f1cb0317d3c27baa7`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_매산고_1학기_중간_고1_기출c/q9-solution.svg` (blob `3825614b1483048b4d47a06bc91e8b97d1995829`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_매산고_1학기_중간_고1_유사/q09-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q9의 `solutionImage` 필드에만 결속.

### F-09 · 매산여고 6번 · 해설 슬롯 · P2

- **기하/수학 기대값:** k=−1일 때 y=(x+1)²와 k=4일 때 y=(x−4)²를 분리해 그려 각각 (−1,0),(4,0)에서 접함을 표시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사_plans/q06-solution.plan.json` (blob `6cea7c7b4d1b004991dc64b0ed3378d72984910d`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q6-solution-v2.svg` (blob `7e3e2a4471f3a88101908501c4821243be277652`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_매산여고_1학기_중간_고1_유사/q06-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q6의 `solutionImage` 필드에만 결속.

### F-10 · 매산여고 11번 · 해설 슬롯 · P2

- **기하/수학 기대값:** D=8k−43<0, 자연수 k=1,2,3,4,5만 허근. 판별식 부호·정수범위 수직선/표시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사_plans/q11-solution.plan.json` (blob `1e194859228ece24d36c201d89b1faa415488c8a`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q11-solution.svg` (blob `67a6d4741d30cd61a965e1201355cdf93c16b80b`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_매산여고_1학기_중간_고1_유사/q11-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q11의 `solutionImage` 필드에만 결속.

### F-11 · 매산여고 13번 · 해설 슬롯 · P2

- **기하/수학 기대값:** k=8의 두 교점과 경계 k=9의 접점 x=−1,y=10을 비교; 일반 교점 판별식 D/4=18−2k, k<9.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사_plans/q13-solution.plan.json` (blob `ad86154f4df2a58b6cd2286f71c60d4cd003e5a3`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q13-solution-v2.svg` (blob `1f69cfabb8a69494d508a8638eb604c7a5dc888d`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_매산여고_1학기_중간_고1_유사/q13-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q13의 `solutionImage` 필드에만 결속.

### F-12 · 매산여고 19번 · 해설 슬롯 · P1 · 엔진 지원 확인 필수

- **기하/수학 기대값:** UNSUPPORTED 재평가: f(x)=(x−2)²−3, g(x)=−(x−3)²+10; 꼭짓점 (2,−3),(3,10), 공통점 (0,1),(5,6); 수평선 t=−3,1,6,10. 두 곡선 선종·색·직접 라벨 구별, 좌표가 곡선에서 떨어지지 않게; 엔진 미지원이면 미충족 유지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사_plans/q19-solution.plan.json` (blob `ad718aa5f2a194069c88b1900ae74808fd3faad8`, 현재 `UNSUPPORTED` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q19-solution-v2.svg` (blob `a5c477a75d09d5e6f0d6d046e43ba23472ecab63`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_매산여고_1학기_중간_고1_유사/q19-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q19의 `solutionImage` 필드에만 결속.

### F-13 · 복성고 1번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 포물선 f=−x²+2x+3에 대해 x축(교점 −1,3), 직선 y=x+5(D<0), y=3x−1(D=17>0)을 서로 다른 선종/범례로 표시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q01-solution.plan.json` (blob `01a62ab675211cc92fbe10de306206e4d34cfb1c`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q1-solution-v2.svg` (blob `8218997ce44a41ea3417376df98e661a0d363fbb`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q01-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q1의 `solutionImage` 필드에만 결속.

### F-14 · 복성고 5번 · 문제 슬롯 · P1

- **기하/수학 기대값:** 직육면체 ABCD-EFGH의 수직 모서리 AE,BF,CG,DH와 세 면 대각선 AF,FC,AC를 명확히, 삼각형 AFC 강조. 기존 기출 q05.png 시각구조를 따르되 새 SVG는 엔진으로만.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q05-problem.plan.json` (blob `217c6a14558fe46bbe03c9cb92b11d2d9258c547`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q05.png` (blob `4933b5c065a49607288f58d25bf81013cf4d9a43`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q05-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q5의 `image` 필드에만 결속.

### F-15 · 복성고 5번 · 해설 슬롯 · P1 · 엔진 지원 확인 필수

- **기하/수학 기대값:** UNSUPPORTED 재평가: 동일 직육면체에서 AF²=a²+c², FC²=b²+c², AC²=a²+b²의 세 얼굴 대각선을 시각적으로 구분. solid-figure-v1 검증계약 지원 확인, 없으면 HOLD.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q05-solution.plan.json` (blob `9cbde5851f1fe714fb593624172ab780646e642d`, 현재 `UNSUPPORTED` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q5-solution.svg` (blob `fc6bcc88c637f1bd83efead6cac6de0a1c08f838`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q05-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q5의 `solutionImage` 필드에만 결속.

### F-16 · 복성고 7번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 두 포물선과 y=−x+k의 비접촉 조건 −3<k<15/4, 정수 k=−2,−1,0,1,2,3; 경계 접선과 허용범위를 분명히.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q07-solution.plan.json` (blob `31b2c605325e7d33a28d7f18f13f048883e66152`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q7-solution-v2.svg` (blob `dacce6c84fe16d159c78e39eb0e23014e95e50d2`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q07-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q7의 `solutionImage` 필드에만 결속.

### F-17 · 복성고 11번 · 해설 슬롯 · P2

- **기하/수학 기대값:** D/4=(12a−60)k+4a²−b가 모든 실수 k에서 음수 아님 → a=5, b≤100. 기울기 0이 필요한 이유를 선형함수/부호표로 명시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q11-solution.plan.json` (blob `d802818ccb18a53d2fb07cb6c2119f5555c70c40`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q11-solution.svg` (blob `e469c085304ddb629bd5ce90141c6bf461063dd0`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q11-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q11의 `solutionImage` 필드에만 결속.

### F-18 · 복성고 14번 · 문제 슬롯 · P2

- **기하/수학 기대값:** −3,−2,−1,0,1,2,3 7장의 카드 이미지를 원본과 같은 배열로 생성. 뽑은 a,b,c는 중복 없이 순서 구분, 특정 정답 조합 암시 금지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q14-problem.plan.json` (blob `f0fb6e799af294bc59c77e8b0fcb40b26f1d9fdd`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q14.png` (blob `2d2bc8254264244a966cc29b2f95f69504685a67`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q14-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q14의 `image` 필드에만 결속.

### F-19 · 복성고 18번 · 문제 슬롯 · P1

- **기하/수학 기대값:** 이차함수 f=(x+3)(x−a), 직선 y=−3x+3a; B(−3,0),O(0,0),A(a,0),D(0,3a),C(−6,18+3a)와 S1=△AOD, S2=사각형 BODC를 구분해 음영. 문제용 그림엔 a=6을 미리 노출하지 않는다.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q18-problem.plan.json` (blob `396f717de2db8bf1976da9c6276627b6afec9dab`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q18.png` (blob `0474917028b5efdd51c85b41d61446eebf1dd86f`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q18-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q18의 `image` 필드에만 결속.

### F-20 · 복성고 19번 · 문제 슬롯 · P1

- **기하/수학 기대값:** 한 변 6의 ABCD 정사각형에 원 O가 AB,AD 접하고 BC,CD와 각각 두 점 교차. BC의 P,Q(BP=2,BP<BQ), O 중심을 정확히 표시. 문제 이미지에서 반지름 x의 정답은 표시 금지.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q19-problem.plan.json` (blob `ec2e1d60413c26c3c93a3477ad5d2c42c520014a`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q19.png` (blob `70093d30d071c942c57f2892b249768409043630`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q19-problem-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q19의 `image` 필드에만 결속.

### F-21 · 복성고 19번 · 해설 슬롯 · P1 · 엔진 지원 확인 필수

- **기하/수학 기대값:** UNSUPPORTED 재평가: 원 반지름 x=8−2√6, 중심 (x,6−x), 아래쪽 P=(2,0), Q=(2x−2,0). 무리수 좌표의 exact label/모식도 분리; 임의 근삿값을 정확값으로 가장하지 않으며 엔진 지원 없으면 HOLD.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q19-solution.plan.json` (blob `100dceee7aa97e3fe8370cfda5fcfddddb2970d8`, 현재 `UNSUPPORTED` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q19-solution.svg` (blob `c21739c103c10a5ad16845cf49465cc49c10cce6`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q19-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q19의 `solutionImage` 필드에만 결속.

### F-22 · 복성고 20번 · 해설 슬롯 · P2

- **기하/수학 기대값:** P·Q 가능 인수 조합 A=x²−3x+5, B=x²−3x−3; P(2)<Q(2) 조건에서 k=±√5의 중근 조건 D/4=5−k²을 흐름/수식 패널로 보여 준다.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q20-solution.plan.json` (blob `16744c2113f172cb7f1943d4b5c00eeeb5f3ce8e`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_복성고_1학기_중간_고1_기출/q20-solution.svg` (blob `8e0df74a7a79e151cb710c2f61f00fe104a7d963`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_복성고_1학기_중간_고1_유사/q20-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q20의 `solutionImage` 필드에만 결속.

### F-23 · 팔마고 9번 · 해설 슬롯 · P2

- **기하/수학 기대값:** 두 포물선 y=−x²/2+4와 y=x²−2 및 직사각형 최적 t=2/3: 너비 4/3, 높이 16/3, 최대 둘레 40/3. 문제 SVG는 그대로 두고 해설용 도식만 추가.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_팔마고_1학기_중간_고1_유사_plans/q09-solution.plan.json` (blob `81fde665499cc801425e0b67290e0a616f217f3e`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_팔마고_1학기_중간_고1_기출_c/q9-solution.svg` (blob `aba434958422c4376b648435baf543d78f7b5d1d`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_팔마고_1학기_중간_고1_유사/q09-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q9의 `solutionImage` 필드에만 결속.

### F-24 · 팔마고 18번 · 해설 슬롯 · P2

- **기하/수학 기대값:** t=x²의 두 양의 근 u>v>0에서 x의 네 실근 −√u<−√v<√v<√u와 ad+bc=−(u+v)=−(m²+2); m=3을 대칭 수직선에 표시.
- 기존 유사 plan: `archive/exams/similar/high/h1/1mid/26_팔마고_1학기_중간_고1_유사_plans/q18-solution.plan.json` (blob `e22aa4d36690428302036f51bae4ba7337eb9fd9`, 현재 `EXEMPT` — **렌더 가능한 신규 plan이 아님**). 해당 JSON을 그대로 엔진에 넣지 말고 `AUTHOR_GUIDE.md`로 새 `plan.json` 작성.
- 기출 시각 참고: `archive/assets/images/26_팔마고_1학기_중간_고1_기출_c/q18-solution.svg` (blob `4f20652370e408bb2bfc15bffdccc0577ce42c8a`). 이 자료의 원 숫자·기호와 **유사문항의 값이 달라질 수 있으므로** 원본 SVG/PNG를 무검산 복사하지 않는다.
- 신규 출판 경로 예시: `archive/assets/images/26_팔마고_1학기_중간_고1_유사/q18-solution-svgengine-20261122.svg` (실제 경로는 공식 게시 도구가 확정). 기존 asset 보존, 정확한 q18의 `solutionImage` 필드에만 결속.

## 5. 엔진 미지원 3칸 — 성공 판정 금지

- **F-12 매산여고 19 해설:** 이전 plan의 `UNSUPPORTED`는 이중 포물선이 동일 선종으로 표시되고 점 좌표 라벨이 곡선 밖 상단에 모여 구분되지 않았기 때문이다. 엔진의 그래프 스타일·callout/label 옵션으로 분리해 보고, 실제 PNG에서 함수별 차이·수평선의 교점 수를 확인한다. 해결되지 않으면 근거를 남겨 `ENGINE_SUPPORT_REQUIRED`.
- **F-15 복성고 5 해설:** 이전 `solid-figure-v1` 도식은 `verify_similar_exam` 검증 계약 부재로 게시하지 못했다. 먼저 최신 엔진/검사기가 정식 지원하는지 확인한다. 그림을 자의적 2D 조각으로 바꿔 직육면체의 세 면 대각선 관계를 훼손하지 않는다. 실패하면 필요한 backend/verifier 기능을 기록하고 `ENGINE_SUPPORT_REQUIRED`.
- **F-21 복성고 19 해설:** 이전 `construction-spike-v1`는 정수·분수 좌표만 받아 `8−2√6`를 정확한 점으로 표시하지 못했다. 엔진이 기호 좌표와 렌더 위치를 분리하는 방법을 지원하는지 검사한다. 근사 위치만 사용할 때는 `모식도`임을 명시하고 **정확한 식·좌표는 별도 라벨**로 보존한다. 근사 좌표를 정확값으로 표시해 허위 정밀도를 만들지 않는다. 미지원이면 계속 HOLD.

이 세 항목은 **계획서 작성만으로 곧바로 렌더 가능한 상태가 아니다.** 엔진 확장이나 공식 지원 primitive 추가가 필요하면 별도 엔진 담당자와 협의하고, 미지원 근거 없이 다른 SVG 작성 방식으로 우회하지 않는다.

## 6. Codex 공식 실행 경로와 검증 순서

1. **격리·판본:** 최신 main 기반 작업용 `git worktree`(루트 체크아웃 변경 금지)를 만들고 해당 JS/blob 및 원본 자산 SHA, sourceQid, 기존 유사 plan 경로를 읽는다. 다른 작업 줄의 변경은 보존한다. plan 전용 브랜치에 SVG/JS를 수정하지 않는다.
2. **엔진 복원:** `archive/tools/geometry-equation/ops/claude-batch/restore.sh`로 `.tmp/work/` 엔진을 준비하고, `ops/svg-m1/` 리소스를 `.tmp/svg-m1/`에 복원한다. 플랫폼별 실제 설치 경로(Python/Node/Chromium)는 현재 `HANDOFF_SVG_CODEX.md`에서 확인한다. 엔진 문서의 과거 모델/캠페인 예시는 이번 사용자 범위보다 우선하지 않는다.
3. **각 슬롯 packet:** [실제 JSON 초안 24세트](H1_1MID_20261122_PLAN_JSON_DRAFTS/README.md)의 F-ID별 `item.json`·`plan.json`·`publish.json`을 **먼저 읽어 그대로** 공식 린터에 넣는다. 구형 `EXEMPT/UNSUPPORTED` 기록과 혼동하지 않는다. 거절 코드가 나온 항목만 해당 capability 계약대로 plan을 수정한다. 임시 고유 run 폴더와 새 버전 SHA를 이용해 판본 충돌을 막는다.
4. **사전 린트:** `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json>`. 실패 시 수정하고 PASS 전 렌더하지 않는다.
5. **렌더:** `node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <out-dir>`; `figure-result.json`의 `ARCHIVE_BOUND`와 provenance를 확인한다. PNG는 공식 `node .tmp/svg-m1/svg2png.cjs <figure.svg> <figure.png> 600` 또는 공식 렌더 경로로 만든다. 결함은 plan 수정 → **실제 재렌더**, 미지원은 에러 코드 기록.
6. **수학·눈 검수:** 생성 그림을 실제 PNG로 보고 §4의 점·기울기·곡선·값·교점·음영·개폐·각도·첨자·문장 가독성을 원문 및 해설과 대조한다. P 문제용의 해답 노출 금지. SVG `role=img/title/desc`, 라벨 최소 글씨, size/alt/caption을 확인한다. PNG/3D/두 곡선은 이전 실패 증상도 재확인한다.
7. **독립 QA:** **신규로 추가하는 그림은 A 단독 PASS/FAIL/MISSING 검수**, 기존 SVG를 교체하는 경우에만 **기존 B/신규 A** 비교와 `better=A` 기준을 적용한다(`HANDOFF_SVG_CODEX.md` §6). `UNSUPPORTED`는 PASS가 아니다. SHA-256으로 최종 figure/plan/publish/QA 판본을 결속한다.
8. **정식 게시:** `archive/tools/geometry-equation/ops/svg-m1/pubflow.py`의 현행 `--batch` manifest(`exam/review/rows/triage/camp`)와 replacement의 `replace:true` 규칙을 따른다. 신규 SVG는 고유 경로에 정식 게시하고 구 자산·원본 PNG·기존 46 SVG를 보존한다. 각 JS의 지정 qid `image` 또는 `solutionImage`(필요한 alt/caption/size)만 연결한다. 기존 plan 기록이 EXEMPT인 변경은 해당 문항의 새 공식 plan 기록과 원본 증거를 같이 인계한다.
9. **실제 학생 QA:** 해당 6개 시험지 `archive/engine.html?data=exams/similar/high/h1/1mid/<exam.js>&mode=exam|sol|ans`를 Chrome에서 열고 PC·375px·A4 출력·중요 그림 크기/잘림·표기를 검사한다. Golden/Negative 표본, 변경 문항의 유사 선택지/정답 불변 및 연동 메타·바인딩 규칙에 대한 관련 검사도 정상 실행한다.
10. **Git 인계:** 정식 게시 SVG 최대 24개, 바뀐 시험지 JS 최대 6개, 필요한 판본증거/현행 plan만 수리 브랜치에 커밋한다. 임시 PNG/렌더 로그/스크린샷을 Git에 넣지 않고 공용 Drive 증거 규약을 따른다. PR, main 병합, 운영 배포는 독립된 승인/상태로 기록한다. GIF/새 helper/엔진 코드 변경은 이 캠페인에서 자동으로 하지 않는다.

## 7. 단계별 인수/실패 기준

| 게이트 | 통과 조건 | 실패 처리 |
| --- | --- | --- |
| SOURCE | 6개 JS/qid와 기존 blob SHA 확인; 외부 변경 시 영향 qid 재검수 | `SOURCE_DRIFT`, 판본 갱신 후 진행 |
| MATH | 새 그림이 §4의 원문·정답과 식/좌표/그림 의미에서 일치; 문제용 정답 노출 0 | `CONTENT_OPEN`/시각 FAIL, 본문 불변 우선 |
| ENGINE | 24칸 각각 공식 plan lint, `ARCHIVE_BOUND` figure, provenance | `UNSUPPORTED` + 정확한 옵션/에러, 손 SVG 금지 |
| VISUAL | PNG 전수 24/24, 레이블 겹침 0, 좌표·음영·정확한 도형 의미 유지 | plan 수정·재렌더 |
| INDEPENDENT | 현재 문항과 후보 SHA에 결속된 별도 검수자 PASS + better=A | 해당 ID OPEN |
| BINDING | 지정 24 `image/solutionImage` 연결, 원본과 구 자산 보존, 새로운 missing 0 | 누락 슬롯 OPEN |
| CHROME | exam/sol/ans, PC·375px·A4, 필요 확대/인쇄 판정 | NOT_RUN/FAIL 그대로 보고 |
| GIT | 본인 수리 브랜치만 수정·커밋, 증거 raw/log Git 금지, 강제 push 없음 | 분리·재검수 후 정상 진행 |

- `PLAN_COMMITTED`는 `ENGINE_RENDERED`나 `FINAL_VISUAL_PASS`가 아니다. 24칸 중 하나라도 ENGINE_SUPPORT_REQUIRED/CONTENT_OPEN/NOT_RUN이면 전체 학생 출고 `HOLD` 상태를 유지한다.
- 범위 밖 2025·2023의 h1 1mid 유사 5종 및 이전 h1 2final SVG 문제 6건은 이번 엔진 작업에 포함하지 않는다.

## 8. Codex→GPT 최종 반환 양식

| ID | 대상 JS·qid·P/S | 새 SVG 경로·blob SHA | plan/render `ARCHIVE_BOUND` | 독립 A/B | 375px/A4 | JS 결속 커밋 | 상태 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01~F-24 | 24개 개별 행 채울 것 | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | 원본 불변 | **OPEN** |

검수 완료 후 GPT가 새 SVG 24개를 **실제로 다시 렌더·시각검수**하고, 각 `*_DEEP_AUDIT.md` 및 [통합 보고서](H1_1MID_SIMILAR_BATCH6_VISUAL_QA_20261122.md)의 `IMAGE_PARITY_HOLD_24`를 역할별 실측 판정으로 갱신한다. Codex 작업자는 새 경로/JS blob SHA/중요 실패/재검수 증거를 단일 인계 보고서로 넘긴다.
