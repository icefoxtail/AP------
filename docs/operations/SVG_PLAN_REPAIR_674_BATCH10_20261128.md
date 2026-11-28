# SVG production plan 실패 674건 — 10배치 수리 실행계획

- 작성일: 2026-11-28
- 저장소: `icefoxtail/AP------`
- 작업 브랜치: `work/plan-repair-batch`
- 기준: 이 브랜치의 생성 기준 `main`; 실제 수리 시작 시 최신 `origin/main` 및 열린 PR과 비교
- 작업 목표: 지정된 실패 `*.plan.json` 674건을 모두 판정하고, 수정 가능한 건은 공식 엔진에서 `ARCHIVE_BOUND`까지 검증하여 별도 PR로 제출
- 병합 정책: 마스터의 별도 승인 전 `main` 직접 병합 금지

> 이 문서 작성은 사용자가 승인한 계획서 추가 작업이다. **실제 수리 단계에서 변경 가능한 기존 파일은 지정된 실패 `*.plan.json`뿐**이다. 이 문서 외의 로그·리포트·렌더 산출물·SVG를 Git에 추가하지 않는다.

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
4. `plan-repair-targets.txt`의 **실제 위치와 내용**을 확보한다. 작성 시점에 브랜치 최상위의 해당 이름은 발견되지 않았다. 목록이 별도 첨부/경로에 있다면 그것을 정본으로 사용한다.
5. 중복·경로 누락·대응되는 시험지 JS 및 item 관계를 확인하고, 유일한 대상이 674건인지 확정한다. 불일치하면 추정 보정하지 말고 차이를 먼저 보고한다.
6. 작업용 출력은 별도 worktree의 무시되는 `.tmp/` 아래에 둔다. 렌더링은 한 번에 하나씩 실행한다.

## 2. 고정 범위와 금지사항

- **수정 가능:** 목록에 있는 실패 `*.plan.json`의 기존 내용만. 승인된 이 실행계획서는 예외적으로 별도 추가.
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
| **합계** | **674** | 최초 제공 수치이며 목록 실측 후 확정 |

오류별 개수는 배치 할당을 의미하지 않는다. 목록의 원래 순서와 경로·동일 계열 오류를 고려해 재현 가능한 순서를 확정하고, 같은 대상이 두 배치에 들어가지 않도록 한다.

## 4. 10배치 분할

| 배치 | 대상 수 | 누적 판정 수 |
|---|---:|---:|
| Batch 01 | 68 | 68 |
| Batch 02 | 68 | 136 |
| Batch 03 | 68 | 204 |
| Batch 04 | 68 | 272 |
| Batch 05 | 67 | 339 |
| Batch 06 | 67 | 406 |
| Batch 07 | 67 | 473 |
| Batch 08 | 67 | 540 |
| Batch 09 | 67 | 607 |
| Batch 10 | 67 | **674** |

Batch 01의 앞 20건을 내부 검증 구간으로 삼아 item 연결 방식, 결과 파일명, 렌더 환경과 주요 수리 패턴을 확인한다. **Batch 01 종료는 68건 모두 판정한 뒤** 선언한다. 다음 배치들은 같은 품질 기준으로 연속 처리한다.

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

- 한 배치의 목록상 67~68건은 모두 `PASS`, `ENGINE_CAPABILITY_PENDING`, `OUT_OF_SCOPE_BLOCKED`, `UNRESOLVED` 등으로 빠짐없이 판정한다.
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
- 변경 추적 파일은 이번 문서와 대상 `*.plan.json` 외에는 없음.
- 10개 배치별 커밋과 원격 브랜치 푸시가 확인됨.
- PR과 최종 성공/보류 집계 제출, **main 미병합 상태에서 승인 대기**.
