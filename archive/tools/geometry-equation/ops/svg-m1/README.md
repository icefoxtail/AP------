`mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/`

# svg-m1 — 해설 그림 캠페인 도구 보관함

위 명령을 저장소 루트(`/home/user/AP------`)에서 한 번 실행하면 이 폴더가 `.tmp/svg-m1/`로 복원된다. `.tmp/`는 git에서 제외되므로 도구는 여기에 보관하고, 지시서와 스크립트는 복원 위치의 절대경로 `/home/user/AP------/.tmp/svg-m1/...`를 쓴다.

**먼저 `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`를 끝까지 읽어라.** 작업 방식(메인은 오케스트레이터, 수정·검수는 서로 다른 Sonnet 서브에이전트)과 남은 일 순서가 거기 있다. 이 README는 파일 목록일 뿐이다.

## 여기에 없는 것 (필요하면 다시 만든다)
- `runs/`, `packets/`: 작업 산출물과 문제 묶음. 복원 명령이 빈 폴더로 만든다. packet은 `make-packet.mjs`로 다시 만든다.
- `golden-out/`: 정답지(`ops/golden/itemNN`)의 기준 SVG(`itemNN-solution.svg`). `golden-one.sh`가 `REFDIR`(기본 `.tmp/svg-m1/golden-out`)에서 찾는다. 없으면 정답지 바이트 비교는 기준 트리에서 먼저 렌더해 만든 SVG를 놓고 한다.
- `timing.jsonl`(시험지별 소요 시간 기록, `fixest.py`·`timing-report.py`가 쓴다), `publish-report.json`, `test.png`, 표본 조사 원자료(`surveys/*/survey.json` 등).

## 스크립트 (최상위)
시험지·문제 준비
- `make-packet.mjs`: 시험지 JS를 문제 묶음 JSON으로 만든다. `node make-packet.mjs <시험 js(저장소 기준)> <out.json> [--with-existing]`
- `split-targets.py`: 분류(triage) 결과를 plan 작업자 묶음으로 나눈다. `split-targets.py <triage.json> <prefix> [묶음당 최대=6] [건너뛸 ord,...]`
- `cmp-triage.py`: 분류 JSON을 원장(25_팔마중 2학기 중간 중1)과 견주어 일치 수와 어긋난 문항을 보인다. `python3 cmp-triage.py <triage.json>...`
- `slice.py`: `AUTHOR_GUIDE.md`를 절별로 잘라 `guide-core/plane/solid/stat/graph.md`를 만든다. `slice.py <AUTHOR_GUIDE.md> <출력 폴더>`

그림 렌더·확인
- `svg2png.cjs`: SVG를 PNG로 바꾼다(눈으로 확인용). `node svg2png.cjs <in.svg> <out.png> [css폭=600]`
- `golden-one.sh`: 정답지 항목 하나를 렌더해 기준 SVG와 바이트 비교한다. `golden-one.sh itemNN`. `WT`(렌더할 트리)·`OUT`(결과 폴더)·`REFDIR`(기준 SVG 폴더)를 환경변수로 바꿔 쓴다.
- `golden-one.mjs`: 정답지 항목 여럿을 차례로 렌더한다. `node golden-one.mjs <outDir> <항목 번호...>`. `WT` 환경변수로 트리를 바꾼다.

게시·원장
- `pubflow.py`: PASS한 그림을 게시하는 한 흐름(JS 반영 → 렌더 확인 → 게이트 테스트 → 원장 → 커밋·push). `pubflow.py "<커밋 제목>" "<본문>" <시험>:<review.json>:<rows.json> [...]`
- `publish-exam.py`: 검토 결과와 rows에서 시험지 하나의 게시 rows(`runs/publish-rows-<시험>.json`)를 만든다. pubflow가 부른다.
- `publish.mjs`: 게시 rows의 SVG를 시험지 JS에 넣는다(`solutionImage*` 네 필드와 SVG 복사). `--apply` 없이는 쓰지 않는다. 따옴표 없는 `id:` 키를 쓰는 시험지도 처리한다. pubflow가 부른다.
- `verify-published.mjs`: 게시한 시험지의 해설 페이지(mode=sol)가 오류 없이 열리고 그림이 로드되는지 확인한다. `APMS_ROOT=<트리> node verify-published.mjs <publish-report.json> <out.json>`
- `ledger-upsert.py`: 시험지 마감 원장(`production/exam-figure-ledger.json`)을 spec JSON으로 갱신한다. `ledger-upsert.py <spec.json>`

해설 내용 수정
- `apply-patches.py`: 문항 블록 안에서 `old`→`new` 문자열을 바꾼다(old는 블록에 정확히 한 번). `apply-patches.py <시험 js> <content-check.json> <ord,ord,...>`
- `apply-field.py`: 문항 블록의 필드 하나를 통째로 바꾼다(`new` 값만 사용). `apply-field.py <시험 js> <content-check.json> <ord,ord,...>`
- `fix-frac.py`: `$` 없는 자동 수식 줄에서 괄호 없는 `\dfrac`·`\frac`·`\tfrac` 인수에 중괄호를 붙인다. `python3 fix-frac.py <exam.js>...`
- `diag-mathjax.cjs`: Archive 해설 페이지의 MathJax 오류(`mjx-merror`)와 문맥을 모은다. `node diag-mathjax.cjs <data 경로(archive/ 기준)> [mode=sol]`
- `check-text.cjs`: 렌더된 페이지에서 문구가 나오는 곳의 앞뒤 글을 보인다. `node check-text.cjs <data> <mode> <찾을 글>` (첫 줄 usage 주석은 복사 오류)
- `shot-text.cjs`: 그 문구가 든 블록을 스크린샷한다. `node shot-text.cjs <data> <mode> <찾을 글> <out.png>` (첫 줄 usage 주석은 복사 오류)
- `check-qimg.cjs`: 문제 그림 `<img>`가 로드됐는지 확인하고 스크린샷(기본 `qimg.png`)을 찍는다. `node check-qimg.cjs <data> <src에 든 글> [out.png]` (첫 줄 usage 주석은 복사 오류)

엔진 병합
- `resolve-engine-conflicts.py`: cherry-pick 때 자주 나는 충돌을 푼다(`golden.manifest.json` 항목 합집합, `hints.mjs` 새 줄 합집합). 충돌 난 트리에서 실행한다.
- `sm_resolve.py`: `semantic_model.py`의 FIELDS/REQUIRED 충돌 블록을 합집합으로 푼다. `python3 sm_resolve.py <semantic_model.py>`

타이밍
- `fixest.py`: `timing.jsonl`의 최근 추정 항목을 실제 값으로 바꾼다. `fixest.py <시험 일부> <단계> <초> <천토큰>` (`.tmp/svg-m1`에서 실행)
- `timing-report.py`: `timing.jsonl`로 시험지별 합계와 단계별 평균을 낸다.

## 폴더와 문서
- `briefs/`: 서브에이전트 지시서.
  - `triage.md`(+`triage-run.txt` 실행 한 줄): 문항마다 FIGURE/REPLACE/KEEP/EXEMPT/UNSUPPORTED 1차 분류
  - `plan.md`: plan.json 작성과 렌더
  - `review1.md`: 새 그림 독립 검토
  - `review.md`: A/B 블라인드 비교 검토
  - `fixup.md`: FAIL 지적 보정
  - `content-check.md`: 답·해설 검산(읽기 전용)
  - `math-delimit.md`: 해설 `$` 구분자 누락 복구
  - `survey.md`: 남은 학년 표본 조사
  - `merge.md`: 엔진 묶음 cherry-pick 병합 검수와 정답지 전체 회귀
  - `engine-common.md`: 엔진 확장 공통 규칙. `engine-e*.md`는 묶음별 지시서(E1~E37: 평면 라벨·치수선·callout, 좌표 그래프, 입체·전개도, 수직선, 통계, 정규분포, 용기)
- `guide/`: 그림 작성 지침 조각. `guide-core.md`(공통), `guide-plane.md`, `guide-graph.md`, `guide-solid.md`, `guide-stat.md`, `guide-tips.md`(자주 놓치는 기능·함정). 정본은 `production/AUTHOR_GUIDE.md`이고, 이 조각은 캠페인 때 `slice.py` 등으로 만든 사본이라 정본과 어긋날 수 있다. 어긋나면 정본을 따른다.
- `gaps.md`: 엔진 빈틈 기록(묶음별 막힌 문항).
- `data-issues.md`: 원본 시험지 데이터 문제(원문 확인 필요, 이 캠페인에서 고치지 않음).
- `content-queue.md`: 해설 내용 의심 대기열(해당 시험지 차례에 검증).
- `reports/estimate-after-survey.md`: 표본 조사 뒤 남은 시험지·그림 수와 소요 시간 추정.
- `surveys/m3-sample-survey.md`, `surveys/h2-sample-survey.md`: 중3·고2 표본 조사 결과(그림 필요율, 지금 그릴 수 있는 비율).
- `notes/DESIGN-hollow-cylinder-and-frustum-net.txt`: 속이 빈 원기둥·원뿔대 전개도 설계 메모(구현 전).
- `examples/q6-segment-pullout-plan.json`: 선분을 끌어내 크게 그리는 합성 2패널 plan 예시(25_왕운중 2학기 기말 중2 q6). `plan.md`·`fixup.md`·`guide-tips.md`가 이 파일을 가리킨다.
