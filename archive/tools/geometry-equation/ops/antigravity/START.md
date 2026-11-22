# 안티그래비티 작업 지시서: 밤샘 무인 작업 (2026-11-22)

왜 이 문서가 있나: 앞선 일괄 작업은 plan 단계부터 틀렸다. 서로 다른 문항에 같은 더미 그림이 119장 들어갔고, 관찰문이 복사돼 검사도 통과했다.
엔진 통과는 그림이 맞다는 증거가 아니다. 사용자는 자는 중이라 물어볼 수 없다. **묻지 말고 아래 순서대로 끝까지 하고, 안 되는 것은 남기고 넘어간다.**

## 작업 자리

- 읽는 곳: `D:/AP-svg-factory/anti-wt` (명령은 여기서 돌리고, 파일은 고치지 않는다)
- 쓰는 곳: `D:/AP-svg-factory/anti-out/<작업>/<키>/` (여기에만 쓴다)
- 목록: 이 폴더의 `TASKS.json`. `READY`만 한다.

## 순서

### 1. 대량 렌더 (판단 없음, 먼저 끝까지)

`node archive/tools/geometry-equation/ops/antigravity/night-render.mjs`

- 오래 걸린다(약 500장). 끝날 때까지 기다리고, 그동안 다른 렌더를 띄우지 않는다.
- 명령이 시간 제한으로 끊기면 같은 명령을 다시 돌린다. 끝난 시험지는 건너뛴다.
- `멈춤:`이 나오면 환경을 고치거나 우회하지 말고 그 줄을 보고에 남긴 뒤 2로 간다.
- 실패한 plan을 고치지 않는다.

### 2. plan 작성: A1 → A2-1 → A2-2 → A2-3 → A2-4 → A2-5

키마다 이 순서로 한다.

1. `node archive/tools/geometry-equation/ops/antigravity/check-submission.mjs show <작업> <키>`
   문항·정답·해설·요구 사항을 읽는다. 원본 그림(`originalImage`)이 있으면 열어 본다. `oldPlan`이 있으면 그 명령으로 읽는다.
2. 직접 푼 뒤 쓰는 곳에 `note.json`을, 상태가 `PLAN`이면 `plan.json`도 쓴다.

   ```json
   {"status":"PLAN","myAnswer":"②","working":"내가 푼 과정 두세 줄","reason":""}
   ```

   `status`는 `PLAN`, `CONTENT`(문항·정답·해설이 안 맞음), `ENGINE`(엔진이 못 그림) 중 하나다. 뒤의 둘은 `reason`에 무엇이 왜 안 되는지 쓴다.
3. `node archive/tools/geometry-equation/ops/antigravity/check-submission.mjs check <작업> <키>`
   FAIL이면 고쳐서 다시 돌린다. **세 번 FAIL이면 그대로 두고 다음 키로 간다.**
4. PASS면 시험 렌더를 한다.
   `node archive/tools/geometry-equation/ops/antigravity/check-submission.mjs render <작업> <키>`
   나온 PNG를 열어 문항·해설과 대조한다. 틀렸으면 plan을 고쳐 3부터 다시 한다. `FAILED`는 그대로 남기고 다음으로 간다.

## 규칙

1. **한 문항씩 직접 읽고 쓴다.** plan이나 note를 만들어 내는 스크립트, 일괄 치환, 다른 문항 좌표의 재사용을 하지 않는다.
2. **그림에는 그 문항의 값과 이름만 넣는다.** `L1`, `T2` 같은 내부 id가 보이면 안 된다. 직선은 발문대로 `l`, `m`으로 쓴다.
3. **문제 그림에는 푸는 데 필요한 값이 모두 있고 정답은 없다.** 해설 그림에는 보조선·중간 값이 더 있다. 둘이 같으면 안 된다.
4. **관계는 좌표로도 참이어야 한다.** 수직·접선·원 위의 점·중점·길이 비·각도를 좌표로 확인한다.
5. **통과시키려고 내용을 빼거나 이름만 바꾸지 않는다.** 엔진이 못 그리면 `ENGINE`이다.
6. **렌더는 위 두 명령만 쓴다.** SVG·PNG를 직접 만들거나 렌더 스크립트를 새로 짜지 않는다. 동시에 하나만 돌린다.
7. **git 쓰기 금지.** add, commit, push, merge, checkout, worktree, PR, 게시를 하지 않는다.
8. **저장소 파일·검사·지시서·다른 폴더를 고치거나 지우지 않는다.** `.tmp`와 의존성 폴더도 건드리지 않는다. 다른 AI에게 넘기지 않는다.
9. **사실대로 남긴다.** 돌리지 않은 것은 NOT_RUN, 실패는 FAILED다. "정상 배치됨" 같은 복사 문장을 쓰지 않는다.

plan 형식의 정본은 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` 하나다.
안내 수정이 병합되기 전까지 예외 하나: `piecewise-affine`의 `left`·`right`는 `[기울기, 상수항]`이다.

## 끝낼 때

`D:/AP-svg-factory/anti-out/REPORT.md`에 아래만 쓴다.

- 대량 렌더의 마지막 줄 그대로
- 작업마다 `check <작업>`(키 없이)의 출력 전체 그대로
- 렌더해 보고도 틀려서 남긴 키와 이유

검사 PASS와 렌더 성공을 "완료"나 "게시 가능"이라고 쓰지 않는다. 게시 판단은 아침에 Claude 메인이 한다.
