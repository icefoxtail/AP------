# 작업 1 — 완성도 검사 도구 구현 (계획서 3장)

기준 문서: 같은 폴더의 `PLAN.md`(확정 계획서, `DRAFT.md`보다 우선). 이 작업은 PLAN.md 3장 "완성도 검사 도구"의 첫 구현이다.

## 어디에 쓰나

- 코드는 브랜치 **`feat/completion-check-20261116`** 에만 커밋한다(최신 `main`에서 이미 만들어 둠). `main` 병합·PR 생성은 하지 않는다. 강제 push·이력 재작성 금지. 커밋 메시지와 코드에 모델 이름을 적지 않는다. 줄바꿈 LF.
- 끝나면 이 계획 브랜치의 `TASK-01-REPORT.md`에 보고를 쓴다(아래 형식).

## 만들 것

1. `archive/tools/completion/check.mjs` — 읽기 전용 CLI.
   - `--exam <archive/exams/... .js>`(여러 번 가능), `--scope <경로 앞부분, 예: original/middle/m3/1>`, `--all`
   - `--format json|tsv`(기본 tsv 요약 + 문항 행), `--out <저장소 밖 경로>`(저장소 안 경로는 거부), `--require complete`(미완성 문항이 있으면 종료 코드 1)
   - 저장소 안에 어떤 파일도 쓰지 않는다. git은 읽기 명령만.
2. `archive/tools/completion/lib.mjs` — 판정 함수(순수 함수, 파일 입출력 분리).
3. `tests/archive-completion-check.test.mjs` — 작은 픽스처(`tests/fixtures/completion-check/`)로 상태값마다 1건 이상. `tools/run-tests.js`의 필수 명령에 등록.
4. `docs/agents/metadata.md` 맨 아래에 사용법 3줄(이유 한 줄 포함).

## 문항별 판정 칸 (PLAN.md 3장 표 그대로)

| 칸 | 값 |
| --- | --- |
| stem | `OK` / `MISSING` |
| answer | `OK` / `MISSING` |
| solution | `OK` / `MISSING` / `BOILERPLATE`(내용 없는 상투 해설. 판정 문구 목록은 상수로 두고 테스트로 고정: "[JS 기준 풀이]", "행렬 등식은 같은 위치의 성분을" 로 시작하는 해설 등) |
| figure | `NOT_NEEDED` / `OK` / `FILE_MISSING`(참조는 있는데 파일 없음) / `BROKEN_SVG`(XML로 읽히지 않음) |
| unit | `APPROVED` / `RECORDED` / `MISSING` / `LABEL_MISMATCH`(키와 이름이 레지스트리와 다름) |
| difficulty | `APPROVED` / `NUMBER_ONLY`(1~5 정수는 있으나 보조 3칸 불완전) / `MISSING` / `INVALID`(허용 밖 값) |
| type | `APPROVED` / `RECORDED` / `HOLD`(유형 보류로 등록됨) / `MISSING` / `INVALID`(키가 ACTIVE가 아니거나 TPL의 부모 PT 불일치) |
| fourSlot | `REGISTERED` / `WRITTEN`(파일은 있고 등록 인덱스에 없음) / `MISSING` / `STALE`(원문 변경으로 대기) |
| overall | `COMPLETE` / `PENDING_REGISTER` / `IN_PROGRESS` / `BLOCKED` |

- **기존 코드를 재사용한다. 새 판정 기준을 지어내지 않는다.** 시험지 JS 읽기, 번호표(UID), "승인됨" 판정, 난이도 보조 3칸의 허용값, 유형 키·부모 검사, 4칸 등록·STALE 판정은 저장소에 이미 있는 함수를 찾아 import한다. 찾을 곳: `archive/tools/meta-foundation/`(등록기·`source-delta.mjs`·`register-difficulty5.mjs`·`rpm-active-resolver.mjs`), `archive/tools/meta-os/`(있으면), `tools/4slot/`와 `tests/item-4slot-data.test.cjs`, `archive/tools/build-archive2-catalog.mjs`, `archive/archive2-core.js`(화면이 쓰는 난이도 완성 조건), `docs/architecture/JS_Archive_Meta_OS_CURRENT.md` 3장(상태 어휘). import할 수 없는 구조면 같은 조건을 옮기되 출처 파일·행을 주석과 보고서에 적는다.
- 정본 메타는 `archive/data/question_metadata.json`(문항 행에 `sourceArchiveFile`, `sourceOrdinal`, `questionUid`, 각 값과 `fieldStatus`). 시험지 JS의 인라인 값과 정본 값이 다르면 문항 행에 `inlineDiffers` 표시(판정은 정본 기준).
- `overall` 규칙: 내용 4칸(stem·answer·solution·figure)에 결함이 있으면 `BLOCKED`. 내용이 정상이고 메타 4칸이 모두 승인·등록이면 `COMPLETE`. 값은 다 있는데 승인·등록이 남았으면 `PENDING_REGISTER`. 그 밖은 `IN_PROGRESS`.
- 요약: 시험지별·범위 전체의 문항 수, 칸별 값 분포, overall 분포. 칸별 부족 수는 서로 겹친다는 점과 overall의 합이 전체와 같다는 점을 출력 머리에 적는다.
- 수학적 정확성, 그림이 문제와 맞는지는 판정하지 않는다(도구 설명에 명시).

## 완료 기준

- 테스트 통과(`node --test tests/archive-completion-check.test.mjs`), `tools/run-tests.js` 전체는 돌리지 않아도 된다(NOT_RUN으로 적음).
- 실제 실행 2건의 결과를 보고서에 붙인다: `--scope original/middle/m3/1`(중3 1학기)와 `--scope original/middle/m1`(중1). 소요 시간, 문항 수, 칸별 분포.
- 참고 대조값(다른 검수에서 나온 값, 정의가 달라 조금 다를 수 있다. 차이가 크면 원인을 적는다): 중3 1학기 115개 시험지·2,750문항, 난이도 숫자 2,725, 4칸 작성 2,326·등록 1,803. 중1 44개 시험지·1,047문항, 난이도 숫자 1,033, 4칸 등록 860.

## 보고 형식 (`TASK-01-REPORT.md`, 이 계획 브랜치)

커밋 해시, 만든 파일, 재사용한 기존 함수 목록(파일·함수명)과 옮겨 적은 조건의 출처, 실행 결과 2건, 대조값과의 차이와 원인, 확인하지 못한 것(NOT_RUN), 판정이 애매해서 임의로 정한 것.
