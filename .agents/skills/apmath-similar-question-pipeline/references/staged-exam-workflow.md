# STAGED_EXAM workflow

## 목적

`STAGED_EXAM`은 한 시험지의 문항 전체를 먼저 만든 뒤, 독립 검수와 수정,
최종 독립 검수를 단계별로 끝내는 비용·운영 단순화용 MVP다. 통합 정식
경로에서는 4개의 가중 균형 배치를 사용한다. 문항마다 생성과 검수를
교대로 실행하지 않는다.

22문항을 네 배치로 나누면 일반적인 모델 호출 상한은 다음과 같다.

| 단계 | 호출 단위 | 최대 호출 수 |
| --- | --- | ---: |
| 1차 생성 | 배치 전체 생성 | 4 |
| 1차 독립검수 | 배치 전체 검수 | 4 |
| 수정 | 지적된 배치만 수정 | 4 |
| 2차 독립검수 | 수정 결과 전체 배치 검수 | 4 |

수정이 필요 없는 배치는 수정 단계에서 `SKIPPED`로 통과시킨다. 최종
검수에서 실패한 배치는 자동으로 끝없이 재생성하지 않는다. 기본 경로는
`MANUAL_REVIEW_REQUIRED` 보류다. 다만 사용자가 이미 시작한 전체 시험지를
끝까지 진행하라고 명시한 경우에는 부모가 수정 후보와 독립 재검수 결과를
한 번만 묶는 bounded parent-resolution pass를 실행할 수 있다. 원래
review2 증거는 덮어쓰지 않으며, 같은 결정론적 후보·시각·답·해설·마더
검증을 다시 통과해야 한다. 그 pass 뒤에도 문제가 남으면 그때만 수동
보류로 남긴다.

## 단계 상태

```text
S00_SOURCE_LOCK
  -> S01_PREFLIGHT
  -> S01A_VISUAL_RECON
  -> S02_ROUND1_GENERATION
  -> S03_REVIEW1
  -> S04_REVISION
  -> S05_REVIEW2
  -> S06_MOTHER_SEMANTIC_FINAL
  -> S07_ASSEMBLY
  -> S08_RENDER_REVIEW
  -> S09_PACKAGE
```

`S02`의 모든 배치가 accepted되기 전에는 `S03`을 만들지 않는다. 같은
규칙으로 각 단계의 모든 배치가 끝나기 전에는 다음 단계의 task를 만들지
않는다. 이 reducer 규칙이 이전의 문항별 교대 실행과 중단·재개 혼선을
막는 핵심이다.

## 모델과 입력 블라인드

- 1차 생성과 수정: `gpt-5.6-luna`, `xhigh`.
- 1차·2차 독립검수: `gpt-5.6-luna`, `xhigh`.
- 상태 전이, 답 비교, 해시, 조립, 직렬화, 패키징: 로컬 결정적 CLI.
- Terra/Sol은 자동 경로에 넣지 않는다. 사용자가 별도 수동 검수를
  요청할 때만 frozen 결과를 대상으로 사용한다.

통합 adaptive facade의 기본 배치 정책은 `FOUR_BALANCED` 가중 균형이며,
일반적인 22문항 시험지는 4개 배치로 고정한다. `AUTO`의 작은 연속 배치는
호환성·비교 실행에서만 명시적으로 선택한다. 동시에 실행하는 외부 task는
최대 4개로 제한하고, 숨겨진 queue와 frozen `batchPlan`은 상태 파일에
보존한다. 모델 디스패치 전에 브라우저 스모크 readiness evidence를 기록하며,
readiness가 PASS가 아니면 모델 디스패치를 시작하지 않는다.

생성 task에는 해당 배치의 원문 학생용 payload와 규칙에 필요한 메타데이터만
준다. 시작 시 `source/rule-snapshot.json`도 함께 고정한다. Builder는
`solutionDetail`과 필요한 `solutionVisualSpec`도 함께 반환한다. 시각 의존 문항이
있으면 `S01A_VISUAL_RECON`에서 원본의 local image/SVG를 확인하고
`source/visual/qNNN/`에 복사한다. 이 단계의 PASS는 파일·해시·안전한 경로와
디코딩 가능성만 뜻하며, 원본 의미·위상·브라우저 렌더의 PASS가 아니다.
실제 저장소에서
이 snapshot의 상태가 `READY`가 아니면 모델 task를 만들지 않는다. snapshot의
`readOrder`에 있는 `docs/rules` 원문과 compiled master를 모델이 직접 읽어야
하며, snapshot 자체를 규칙 원문으로 오해하지 않는다.

생성 task에는 추가로 배치 전용 `source/reference-pack/bNN.json`을 제공한다.
전체 `source/reference-pack.json`은 Run 감사용으로 보존한다. 이 팩은
`archive/exams/similar`의 `reviewed_pass`/`auto_high` 샘플 중 현재 문항과
가까운 예시만 최대 3개까지 담고, 답·해설은 제거한다. 참고팩은 변형 방향과
표현 수준을 잡는 자료일 뿐 권위 기준이 아니며, 새 수치와 정답은 반드시
독립적으로 다시 계산한다. 검수 task에는 원문 학생용 payload와 생성된 학생용
payload, 그리고 `*-solution.json`을 준다. 전자의 독립 답 산출에는
answerContract와 해설을 사용하지 않고, 후자의 학생용 해설 검수에는
answerContract와 private plan을 주지 않는다. 검수자는 문항별 독립 답과
`solutionReview`를 포함한 `PASS`/`REVISE`/`FAIL`, 체크 결과, 지적사항을
반환한다.

동일 source/rule/catalogue 조합으로 새 Run을 시작하면
`alive/runtime/context-cache/staged/`의 hash-bound deterministic context를
재사용할 수 있다. 캐시 적중 전에도 source·rule·catalogue·source visual
해시를 확인하며, 적중은 preflight·참고팩 재구성·source visual recon만 줄인다.
source visual browser inspection, 모델 생성, 독립 검수, 마더 검수, 실제
브라우저 렌더와 final closure는 매 Run의 게이트로 계속 남는다.

시각 문항의 Builder는 학생 payload 밖에 `visualSpec`을 반환하고, 해설
도형이 필요한 문항은 별도의 `solutionVisualSpec`을 반환한다. staged CLI가
각 spec을 검증하고 역할별 결정론적 SVG와 `visual-render-report.json`을
만든다. ESSENTIAL은 problem visual을 반드시 제공해야 한다. 원·직선·접선·
접점·공통현·중심·반지름·수선 관계는 solution visual도 반드시 제공한다.
source preflight는 원 관련 요소 힌트를 미리 계산하므로, Builder가 발문을
축약해도 필수 해설 도형 정책을 낮출 수 없다. 원 도형은 중심/라벨 점과
반지름 구성선을 기본으로 하고, 실제로 등장한 직선·접선·현·수직 관계의
구성 및 표식을 추가해야 한다.
시각 PASS에는 후보 asset/spec SHA와 topology, semanticOwnership, labels,
determinism 체크가 함께 있어야 한다. 원본 `image`/`solutionImage`를 학생
payload나 최종 후보에 그대로 재사용하지 않는다.
결정론적 SVG 렌더러는 동일 좌표의 중복 라벨을 한 번만 표시하고, 라벨이
겹칠 때 제한된 안전 위치 후보를 순서대로 적용한다. 모든 후보 위치에서도
겹침이 남으면 자동 보정으로 통과시키지 않고 실패시킨다.
여기서 `visualSpecSha256`는 spec 파일의 raw bytes SHA-256이 아니라 ALIVE의
canonical JSON 해시(`json_sha256`)다. 검수자는 `visual_lane`과 동일한
canonicalization 결과를 `visualAsset.specSha256` 및 render report와 비교하며,
파일의 줄바꿈·공백 차이만으로 REVISE를 판정하지 않는다.
함수·부등식·타원·포물선·쌍곡선·미적분 그래프로 확장할 때는
`visual-quality-floor.md`의 `AUTO_PASS` 조건을 먼저 충족하고 capability
report에 활성화한 뒤 사용한다. 자동 검증이 부족한 도형은 `MANUAL_REVIEW`
또는 `NO_DIAGRAM`으로 남긴다.

## 실행 명령

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-start --query "25년 금당고 고1 2학기 중간고사 전체 유사" --variation-mode QUICK --batch-strategy FOUR_BALANCED --batch-count 4 --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-render-readiness --run <run-id> --file <browser-smoke-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-resume --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-dispatch-fail --run <run-id> --task <task-id> --code AGENT_STALE_TIMEOUT --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-heartbeat --run <run-id> --task <task-id> --phase <phase> --progress <0-100> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-dispatch-start --run <run-id> --task <task-id> --external-id <external-agent-id> --route gpt-5.6-luna/xhigh --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-mark-complete --run <run-id> --task <task-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-reconcile --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-correction-start --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-assemble --run <run-id> --title "생성 시험지" --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-record-render --run <run-id> --file <render-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-package --run <run-id> --json
# S09 also creates the mandatory compact external-review ZIP directly in
# alive/runtime/results/; a missing/invalid external ZIP blocks S09 PASS.
# closed-package identity/path normalization (derived package; original Run is preserved)
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py similar-package-canonicalize --input <old-zip> --output <canonical-zip> --source-file <source-js> --display-title "<human title>" --json
# compact original-vs-similar external review package (JS + referenced assets only)
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py similar-package-external-review --input <canonical-zip> --output <external-review-zip> --source-file <original-js> --json
# final fail-closed QA on the final JS/ZIP and the three browser modes
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py final-closure-audit --input <final-zip> --js-path <optional-zip-js-member> --review-ledger <review-ledger.json> --render-evidence <final-render-evidence.json> --external-findings <external-findings.json> --output <final-closure-report.json> --json
# package commands retain only the result surface by default; use --keep-workdir only for debugging
# after deciding that a failed Run will not be recovered:
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py runtime-finalize --runtime-kind adaptive --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py runtime-gc --json
```

Codex가 모델 task를 dispatch할 때는 먼저 해당 task에 대해
`staged-dispatch-start`로 외부 id와 Luna route를 기록한다. agent가 결과를
그 task의 `outputPath`인 `inbox/`에 쓴 뒤 `wait_agent`가 완료를 보고하면,
Codex는 반드시 `adaptive-staged-mark-complete`를 호출하고 나서
`adaptive-staged-reconcile`를
실행한다. completion marker가 없는 DISPATCHED 결과는 아직 쓰는 중인 파일로
간주해 reconcile하지 않는다. 재개 시에는 새 task를 추측하지 말고
`staged-exam-status`의 현재 단계 queue와 manifest를 기준으로 한다.

## 운영 루프

0. 새 Run을 만들기 전에 실제 브라우저 연결, preview server, production
   `archive/engine.html` URL이 열리는지 확인한다. 이 사전점검은 렌더 PASS가
   아니며, 연결이 안 되면 Run을 만들지 않고 외부 blocker로 보고한다.
1. `staged-exam-start`로 source lock과 preflight를 만든다.
2. 현재 단계의 `PENDING` 배치만 최대 네 개 dispatch한다.
3. 완료 agent를 확인하고 닫은 뒤, 각 완료 task에
   `adaptive-staged-mark-complete`를 호출한다.
4. completion marker가 있는 inbox 결과만 `adaptive-staged-reconcile`로
   수용한다.
5. 모든 현재 단계 task가 `ACCEPTED` 또는 `SKIPPED`가 될 때만 다음 단계로
   이동한다.
6. 각 디스패치에는 stale timeout lease를 적용한다. 외부 agent는 시작,
   컨텍스트 로드 완료, 문항별 작성 완료, 최종 artifact 저장 직전에
   `adaptive-staged-heartbeat`를 호출한다. `adaptive-staged-resume`는
   완료 마커를 먼저 reconcile하고, 산출물도 유효한 heartbeat도 없이
   timeout을 넘긴 `DISPATCHED` task만 자동으로 `PENDING`으로 되돌린다.
   heartbeat는 현재 attempt와 task에 귀속되어야 하며, 외부 agent는
   watchdog 판정 전에 닫는다.
7. `agent thread limit reached`가 나오면 새 task를 만들지 말고 완료된
   agent를 정리한 뒤 `adaptive-staged-resume`으로 같은 단계의 queue를
   재계산한다.
8. dispatch timeout과 artifact 오류는 별도 retry counter로 기록한다.
   각각의 bounded budget을 넘으면 해당 Run을 `FAILED`로 남긴다.
   출력 형식만 수정할 수 있는 경우에는 실패 이력을 보존한 채
   adaptive bounded recovery path로 해당 task만 다시 연다. 원본 실패
   evidence는 보존한다.
9. `S05_REVIEW2` 통과 후 마더 해설 품질 게이트가 전 문항을 모아 확인한다.
10. 사용자가 held Run의 계속 진행을 명시했고 `S05_REVIEW2`가 보류된
   경우에는 parent-resolution envelope을 만들고
   `adaptive-staged-correction-start`를 정확히 한 번 실행한다. 모든 batch가
   PASS이고 마더 게이트도 PASS일 때만 다음 단계로 간다. 원본 review2와
   revision evidence는 보존한다.
11. `READY_FOR_ASSEMBLY`에서 전체 시험지를 조립하고, 결과는
   `READY_FOR_MANUAL_REVIEW`로 표시한다.
12. Run이 package 또는 bounded failure로 닫히면 결과 ZIP·요약만
   `alive/runtime/results`에 남긴다. 이 result root는 세션 전달을 위한
   disposable runtime이며 Git에 포함하지 않는다. ZIP을 검사하려고 만든
   압축 해제 폴더도 result root에 남기지 않고 저장소 밖 임시 위치에서
   검사한 뒤 제거·격리한다. package 명령은 기본적으로 이 정리를 수행하며,
   실패 Run은 복구 여부를 먼저 결정한 뒤 `runtime-finalize`를 호출한다.
   활성/보류 Run은 정리하지 않는다. production Archive로 승격하는 것은
   승인된 최종 JS와 참조 SVG/PNG/JPG 자산뿐이다.

## 런 간 품질 폐쇄 게이트

각 Run은 단순한 생산 큐가 아니라 하나의 품질 실험이다. Run이
`READY_FOR_MANUAL_REVIEW`, `DRAFT_PACKAGED`, `RENDERED_PACKAGED`,
`MANUAL_REVIEW_REQUIRED`, `FAILED`, `BLOCKED` 중 하나의 종결 상태에 도달하면
다음 Run을 시작하기 전에 반드시 다음 checkpoint를 닫는다.

1. manifest, inbox/output, 검수·렌더 evidence, 외부 agent 이력을 동결한다.
2. 단계별 PASS/FAIL, 해설·시각자료·브라우저 렌더·패키지 상태, 소요 시간,
   토큰/디스패치 실패, 미해결 지적사항을 짧게 보고한다.
3. 문제를 정답성·교육과정·해설 교육성·시각 충실도·오케스트레이션·비용/
   지연으로 분류한다.
4. 닫힌 Run의 산출물을 고쳐서 통과 처리하지 않고, 별도 변경면에서 엔진·
   스킬을 보완한다. production Archive에는 등록하지 않는다.
5. 관련 fixture·결정론 테스트와 필요한 실제 렌더 evidence를 다시 확인하고,
   보류한 개선은 `DEFERRED`, 결함이 없으면 `NO_CHANGE`로 기록한다.
6. 개선 checkpoint가 PASS로 닫힌 뒤에만 다음 Run을 시작한다.

따라서 실패한 Run 직후 새 Run을 병렬로 밀어붙이지 않는다. 개선이 실제로
검증되기 전에는 품질 향상으로 보고하지 않으며, Run 완료와 production 승격은
서로 다른 상태로 유지한다.

## 산출물과 검수 경계

마더 게이트는 solutionDetail, 학생 이해 검수, 필수 solution visual의
존재·해시·역할을 전 문항에 대해 확인한다. 조립은 구조·답 계약·serializer
round-trip·중복 여부를 결정적으로 확인해 로컬 JS 후보를 만든다. 그러나
이 MVP의 `READY_FOR_MANUAL_REVIEW`는
브라우저 PASS가 아니다. 실제 exam/solution/answer 화면을 확인한 뒤 다음
형식의 evidence를 `staged-exam-record-render`로 기록한다.

```json
{
  "actualBrowser": true,
  "productionEngine": true,
  "modes": {
    "exam": {"verdict": "PASS", "ready": true, "renderError": null, "unrenderedMath": 0, "overflowCount": 0, "badImages": [], "lastQuestion": 22, "lastPageChecked": true},
    "solution": {"verdict": "PASS", "ready": true, "renderError": null, "unrenderedMath": 0, "overflowCount": 0, "badImages": [], "lastQuestion": 22, "lastPageChecked": true, "solutionVisualCoverage": {"requiredOrdinals": [18, 21], "renderedOrdinals": [18, 21], "missingOrdinals": [], "verdict": "PASS"}},
    "answer": {"verdict": "PASS", "ready": true, "renderError": null, "unrenderedMath": 0, "overflowCount": 0, "badImages": [], "lastQuestion": 22, "lastPageChecked": true}
  }
}
```

시각 의존 문항은 원본 asset이 없거나, 원격·data URI·잘못된 형식이면
`S01A_VISUAL_RECON`에서 보류한다. 지원되는 local source visual은
결정론적 SVG lane으로 생성·검증할 수 있지만, `READY_FOR_MANUAL_REVIEW`는
여전히 실제 exam/solution/answer 브라우저 확인 전의 상태다. solution 화면은
필수 해설 도형을 모두 포함하는지 `solutionVisualCoverage`로 함께 확인한다.
