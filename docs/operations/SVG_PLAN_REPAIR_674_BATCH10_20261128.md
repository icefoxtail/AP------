# SVG production plan 실패 674건 — 10배치 수리 실행계획

- 작성일: 2026-11-28
- 저장소: `icefoxtail/AP------`
- 작업 브랜치: `work/plan-repair-batch`
- 기준: 공식 대상 목록을 반영한 `main` 커밋 `852f36a7cf865b3c0f4daf47514e651048a62ac2`; 실제 수리 전 최신 `origin/main` 및 열린 PR과 재비교
- 작업 목표: 공식 실패 목록의 674개 항목을 빠짐없이 판정하되, 기존 수정 허용 범위인 `*.plan.json` 551건은 공식 엔진에서 `ARCHIVE_BOUND`까지 검증하여 별도 PR로 제출한다. 나머지 `*.json` 123건은 별도 승인 전 검수·보류한다.
- 병합 정책: 마스터의 별도 승인 전 `main` 직접 병합 금지

> 이 문서와 `docs/operations/svg-plan-repair-batches-20261128/batch-*.txt`는 사용자가 요청한 계획 산출물이다. **실제 수리 단계에서 변경 가능한 기존 파일은 지정된 실패 `*.plan.json`뿐**이다. 작업 로그·렌더 산출물·SVG를 Git에 추가하지 않는다.

## 1. 작업 전 확인과 기준 문서

작업자는 전용 worktree에서 시작한다. 저장소 루트 본 체크아웃에서는 편집·브랜치 전환·커밋하지 않는다.

1. `git fetch origin`, `git worktree list`, 원격 브랜치 및 열린 PR을 확인한다.
2. 이미 존재하는 `work/plan-repair-batch` 브랜치를 사용해 **별도 worktree**를 만든다. 기존 작업물이나 미커밋 변경을 덮어쓰지 않는다.
3. 다음 문서를 실제로 읽고 따른다.
   - `AGENTS.md`
   - `docs/agents/visual-svg.md`
   - `docs/agents/git-evidence.md`
   - `docs/agents/outcome-method-review.md`
   - `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`
   - 범위 판단에 필요하면 `docs/agents/common.md`, 중첩 `AGENTS.md`
4. 정본 목록은 `archive/tools/geometry-equation/ops/claude-batch/PLAN_REPAIR_TARGETS_20261128.txt`다(PR #3448). **674행, 674개 고유 항목**, 전체 실패 1,765행에 모두 포함됨을 2026-11-28에 확인했다.
5. 배치별 명단은 `docs/operations/svg-plan-repair-batches-20261128/batch-01.txt`부터 `batch-10.txt`까지다. 정본의 원문 행을 그대로 보존했으며, 10개 합계 674개·중복 0개·누락 0개다.
6. 실제 수리 전에 각 경로의 존재·시험지 JS 및 item 연결·현재 오류 재현을 다시 확인한다. 기록과 현행 엔진 결과가 다르면 최신 근거를 우선하고 차이를 보고한다.
7. 작업용 출력은 별도 worktree의 무시되는 `.tmp/` 아래에 둔다. 렌더링은 한 번에 하나씩 실행한다.

## 2. 고정 범위와 금지사항

- **수정 가능:** 목록에 있는 실패 `*.plan.json`의 기존 내용만. 이 실행계획서와 10개 배치 명단은 별도로 승인된 계획 산출물이다.
- **범위 승인 대기:** 공식 목록에 포함된 `qNN-problem.json`·`qNN-solution.json` 등 `*.plan.json`이 아닌 파일 123건. **검수는 가능하나 내용 수정·통과 커밋은 명시적 추가 승인 전 금지**한다.
- **수정 금지:** `archive/tools/geometry-equation/` 엔진 코드, 시험지 JS의 발문·보기·정답·해설, SVG/PNG, 사용자 범위 밖의 plan, 검증 도구·검사 기준.
- 손 SVG 또는 스크립트로 조립한 SVG 금지. 일반 문자열 치환으로 숫자·기하 사실을 추정해서는 안 된다.
- 실제 엔진 기능 미지원은 `ENGINE_CAPABILITY_PENDING`으로 보류 기록한다. 잘못된 값이나 왜곡된 다른 도형으로 통과시키지 않는다.
- 문제 그림에는 정답과 새 풀이 보조선을 노출하지 않는다. 해설 그림에는 학생이 과정을 이해하는 데 필요한 정보를 우선한다.
- lint와 render의 실패를 통과로 바꾸거나 검사 범위를 줄이지 않는다.
- 다른 라인과 파일 충돌이 확인되면 대상 파일의 최신 원격 상태를 비교해 중복 수리를 피한다.

## 3. 대상 오류의 초기 집계

| 분류 | 최초 제공 건수 | 처리 원칙 |
|---|---:|---|
| `FAILED` | 396 | 결과 JSON의 실제 `code/detailFull/hint/fix`로 원인 재분류 |
| `NON_JSON_VALUE` | 130 | 직렬화 불가능 값·비정규 수·필수 필드·계약 확인 |
| `DIMENSION_CROSSES_STROKE` | 29 | 치수선 방향, `planeMarks.callouts`, 오프셋·지시선 확인 |
| `COORDINATE_PANEL_TOO_TALL` | 19 | 높이 한도·선택 가능한 레이아웃·캔버스 조정 |
| `ARCHIVE_INPUT_INVALID` | 16 | plan 원인과 JS/item 원인을 분리; 금지 범위 원인이면 보류 |
| `UNSUPPORTED_OVERVIEW_FAMILY` | 11 | 동등한 지원 표현인지 확인; 불가하면 엔진 미지원 보류 |
| 기타 스키마·라벨 등 | 73 | 실제 오류코드와 정본 계약에 따라 개별 교정 |
| **합계** | **674** | 공식 목록 실측 확정, 551개 `*.plan.json` + 123개 기타 `*.json` |

오류별 개수는 배치 할당을 의미하지 않는다. 현재 확정한 명단은 동일 시험지/그림 그룹 166개를 **배치 간 분리하지 않고**, 형식 오류와 `FAILED`를 앞선 8개 배치에 분산했다. 다른 이름의 `*.json` 123건은 수정 범위를 혼동하지 않도록 마지막 두 배치에 모았다.

## 4. 10배치 분할

| 배치 | 전체 | 수정 허용 `*.plan.json` | 승인 대기 `*.json` | 누적 판정 |
|---|---:|---:|---:|---:|
| [Batch 01](svg-plan-repair-batches-20261128/batch-01.txt) | 68 | 68 | 0 | 68 |
| [Batch 02](svg-plan-repair-batches-20261128/batch-02.txt) | 68 | 68 | 0 | 136 |
| [Batch 03](svg-plan-repair-batches-20261128/batch-03.txt) | 68 | 68 | 0 | 204 |
| [Batch 04](svg-plan-repair-batches-20261128/batch-04.txt) | 68 | 68 | 0 | 272 |
| [Batch 05](svg-plan-repair-batches-20261128/batch-05.txt) | 67 | 67 | 0 | 339 |
| [Batch 06](svg-plan-repair-batches-20261128/batch-06.txt) | 67 | 67 | 0 | 406 |
| [Batch 07](svg-plan-repair-batches-20261128/batch-07.txt) | 67 | 67 | 0 | 473 |
| [Batch 08](svg-plan-repair-batches-20261128/batch-08.txt) | 67 | 67 | 0 | 540 |
| [Batch 09](svg-plan-repair-batches-20261128/batch-09.txt) | 67 | 0 | 67 | 607 |
| [Batch 10](svg-plan-repair-batches-20261128/batch-10.txt) | 67 | 11 | 56 | **674** |
| **합계** | **674** | **551** | **123** | **674** |

Batch 01의 앞 20건을 내부 검증 구간으로 삼아 item 연결 방식, 결과 파일명, 렌더 환경과 주요 수리 패턴을 확인한다. **Batch 01 종료는 68건 모두 판정한 뒤** 선언한다. 다음 배치들은 같은 품질 기준으로 연속 처리한다.

배치 명단의 `#`로 시작하는 여섯 줄은 주석이다. 그 아래의 대괄호 행은 공식 정본의 원문이며 `[<plan 상대경로>/<문항 식별자> | <오류 코드>]` 형식이다. 문항 식별자는 `q17`뿐 아니라 길이가 긴 UID일 수 있으므로 숫자 문항 번호로 임의 변환하지 않는다. 최초 오류코드는 발견 당시의 기록이며 현재 엔진 검증 결과를 대체하지 않는다.

Batch 09는 **수정 허용 파일 0건**이므로 별도 승인이 없다면 범위 밖 검수·보류만 수행한다. Batch 10은 11개 허용 plan만 수리하고 56개는 보류한다. 이에 따라 674개 전수 판정과 674개 수리 완료는 서로 다른 종료 상태다.

## 5. 문항별 표준 수리 절차

1. 대상 plan의 실제 경로·원래 오류코드·연결된 `archive/exams/...js`·문항 번호·문제/해설 축을 확정한다.
2. 해당 JS의 발문·보기·정답·해설과 필요한 원본/기존 그림을 읽는다. 수치·곡선·점·각·보조선·라벨의 정합성을 먼저 판단한다.
3. 기존 plan을 JSON 및 capability 계약에 맞춰 최소 수정한다. `fix`는 자동 정답이 아니라 제안이므로 수학적으로 검토한 후 반영한다.
4. 공식 lint 실행:
   ```bash
   node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json...>
   ```
5. 실제 문항에 대응하는 임시 item JSON을 공식 계약(`sourcePath`, `ordinal`)대로 준비하고 렌더:
   ```bash
   node archive/tools/geometry-equation/production/render-plan.mjs --item <item.json> --plan <plan.json> --out <outDir> --accept-scored 1
   ```
6. 출력 디렉터리의 실제 결과 JSON(`figure-result.json` 또는 해당 실행기의 `<name>-result.json`)에서 `status`, `code`, `detailFull`, `hint`, `fix`, `errors`를 확인한다. 결과가 `FAILED`이면 원인을 수정한 뒤 **다시** lint 및 render를 실행한다.
7. 최종 `status: ARCHIVE_BOUND`이며, 원문 수학 조건 및 문제/해설 축의 표시 내용이 정확한 경우에만 PASS로 분류한다. 단순 파일 생성, JSON 파싱 또는 exit code 0만으로는 PASS가 아니다.
8. 렌더가 불가능하거나 독립 검증을 실행하지 못했으면 `NOT_RUN`/`EVIDENCE_DEBT` 또는 해당 실패 상태를 사실대로 기록한다. `EXEMPT`, `UNSUPPORTED`, `ENGINE_CAPABILITY_PENDING`은 `ARCHIVE_BOUND` 통과 수에 넣지 않는다.

## 6. 배치별 커밋·원격 푸시

- 한 배치의 목록상 67~68건은 모두 `PASS`, `ENGINE_CAPABILITY_PENDING`, `OUT_OF_SCOPE_BLOCKED`, `UNRESOLVED` 등으로 빠짐없이 판정한다. Batch 09~10의 기타 `*.json`은 추가 승인 전 `OUT_OF_SCOPE_BLOCKED`를 유지한다.
- **lint+render+원문 정합성을 모두 통과한 plan만** 해당 배치 커밋에 넣는다. 통과가 0건이면 빈 커밋을 만들지 않는다.
- 스테이징 전에 `git diff --name-only`와 `git diff --cached --name-only`를 확인해 지정된 `*.plan.json` 외 변경이 없음을 검증한다.
- 커밋 메시지 예: `fix(svg-plan): repair batch 01 verified plans`. 배치별 SHA를 기록하고 `work/plan-repair-batch`로 푸시한다.
- Draft PR은 배치 진행 상황을 보여 주기 위해 열 수 있지만, 최종 검수 및 마스터 승인 이전에 `main`으로 병합하거나 자동 병합을 켜지 않는다.
- 다른 라인으로 인해 `main`이 이동하면 차이를 검사하고 안전하게 반영한다. 타인 커밋·미커밋 변경·워크트리를 덮어쓰지 않는다.

## 7. 집계와 인계

매 배치 다음 항목을 보고한다.

```text
Batch NN / 10
대상: N건 | ARCHIVE_BOUND PASS: N건
ENGINE_CAPABILITY_PENDING: N건
OUT_OF_SCOPE_BLOCKED: N건 | UNRESOLVED/NOT_RUN: N건
누적 판정: N/674 | 누적 PASS: N건
주요 수정 오류: ...
보류 항목(파일·문항·코드·이유): ...
lint: N/N PASS | render ARCHIVE_BOUND: N/N PASS
커밋 SHA: ... | 브랜치 push: ... | PR: ...
```

최종 수치가 반드시 맞아야 한다.

```text
전체 대상 674
= ARCHIVE_BOUND 통과
+ ENGINE_CAPABILITY_PENDING
+ OUT_OF_SCOPE_BLOCKED
+ UNRESOLVED/NOT_RUN
```

추가로 배치별 대상 수·실제 수정 파일 수·lint 통과 수·render 통과 수를 구분한다. 보류 목록과 검증 증거는 Git의 새 파일로 남기지 않고 PR 본문/작업 보고 및 허용된 외부 증거 저장소로 전달한다.

## 8. 완료 조건

- 674건의 파일과 원문을 전부 판정하고 누락·중복이 없음.
- 수리 성공분이 모두 공식 lint + 실제 렌더 `ARCHIVE_BOUND` + 수학/시각 정합성을 충족함.
- 실패/미지원 건은 개별 이유와 후속 조치가 기록됨.
- 변경 추적 파일은 이 계획서·10개 배치 명단과 지정된 `*.plan.json` 외에는 없음.
- 10개 배치별 커밋과 원격 브랜치 푸시가 확인됨.
- PR과 최종 성공/보류 집계 제출, **main 미병합 상태에서 승인 대기**.
