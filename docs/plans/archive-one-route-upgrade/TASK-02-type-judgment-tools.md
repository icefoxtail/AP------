# 작업 2 — 유형(PT/TPL) 판정 준비 도구 (계획서 7-1장)

기준 문서: 같은 폴더 `PLAN.md` 7-1장, `docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md`(브랜치 `claude/pt-tpl-unlock`, PR #2288의 판본에 §0 "유형 출처 제한 해제"가 있다. main에 아직 없으면 그 브랜치에서 읽는다).

## 왜

2026-11-16 사용자 결정으로 유형을 공식 판정기 전용으로 묶지 않게 됐다. 이제 저렴한 모델이 문항·해설을 읽고 유형을 직접 판정한다. 그런데 유형 키가 많아서 전체 목록을 주면 일치율이 떨어진다. **단원이 정해진 문항에 그 단원에서 쓸 수 있는 유형만 보여 주고 고르게** 해야 하고, 받은 답을 기계가 검사할 수 있어야 한다. 이 작업은 그 두 도구를 만든다. 판정 자체(모델 호출)는 이 작업 범위가 아니다.

## 어디에 쓰나

- 코드는 새 브랜치 **`feat/type-judgment-tools-20261116`**(최신 `main`에서 직접 만든다)에만 커밋한다. `main` 병합·PR 생성은 하지 않는다. 강제 push·이력 재작성 금지. 커밋 메시지와 코드에 모델 이름을 적지 않는다. LF.
- 보고는 이 계획 브랜치의 `TASK-02-REPORT.md`.
- 작업 1의 브랜치(`feat/completion-check-20261116`)는 검수 중이니 건드리지 않는다. 필요한 함수가 겹치면 복사하지 말고 보고서에 "작업 1 병합 뒤 합칠 것"으로 적는다.

## 먼저 조사할 것 (보고서 1절, 코드보다 먼저)

1. **레지스트리 해시 불일치의 원인.** 작업 1 보고에 따르면 `loadActiveMetaRegistry`(`archive/tools/meta-foundation/active-registry.mjs`)가 `archive/data/meta-foundation/canonical/concepts/middle1.json`, `plane-geometry.json`의 해시 불일치 때문에 UNAVAILABLE을 반환한다. 최신 `main`에서 재현되는지, 기대 해시가 어디에 적혀 있는지(봉인 다이제스트 파일), 두 파일과 다이제스트 가운데 어느 쪽을 어느 커밋이 바꿨는지(`git log -5 -- <파일>`), main CI의 어떤 검사가 이것을 잡아야 하는데 통과하고 있는지를 적는다. **고치지 않는다**(봉인 관련이라 사용자·관제 결정 사항). 고치는 방법의 선택지만 적는다.
2. **유형 목록의 크기.** 교육과정·과목·단원(`standardUnitKey`)·소단원(`subUnitKey`)별로 연결(binding)된 ACTIVE PT 수와 그 아래 TPL 수의 분포(최소·중앙·최대, 상위 10개 단원). 연결 행이 하나도 없는 단원 목록. 중등과 고등을 나눠서.
3. **대상 규모.** 정본 `archive/data/question_metadata.json`에서 단원 키는 있는데 유형이 없거나 보류인 문항 수를 학년·학기·출처(원본/유사/교과서)별로.

## 만들 것

1. `archive/tools/type-judgment/options.mjs` — 읽기 전용 CLI와 함수.
   - 입력: `--curriculum`, `--course`, `--unit <standardUnitKey>`, `--sub <subUnitKey>`(선택), `--format json|md`
   - 출력: 그 단원에 연결된 ACTIVE PT 목록과 각 PT 아래 ACTIVE TPL 목록. 항목마다 키, 한국어 이름, 정의, `internalSkeleton`(있으면), 대표 문항 번호표 2~3개(정본에서 그 키로 승인된 문항, 있으면).
   - 소단원에 연결 행이 없으면 단원 전체, 단원에도 없으면 같은 과목의 인접 단원을 "후보 확장"으로 따로 표시한다(확장 사실을 출력에 명시).
   - `--exam <시험지 경로>`: 그 시험지의 문항별로 (문항 번호표, 정본 단원·소단원, 위 목록의 참조)를 묶은 판정 일감 JSON을 만든다. 발문·해설 원문은 넣지 않고 경로와 순번만(원문은 판정 쪽이 읽는다). 저장소 안에 쓰지 않는다(`--out`은 저장소 밖만).
   - 레지스트리 해시 검증이 실패한 상태에서도 목록은 낼 수 있게 한다. 단 출력 머리에 "레지스트리 무결성 미확인"을 표시하고 종료 코드는 0, `--strict`면 1.
2. `archive/tools/type-judgment/check-ledger.mjs` — 판정 원장 검사기(읽기 전용).
   - 원장 형식(이 작업에서 정한다, 보고서에 스키마를 적는다): 시험지 경로, 문항별 `questionUid`, `sourceOrdinal`, `decision`(`PICK` | `NEW_KEY` | `HOLD`), `PICK`이면 `problemTypeKey`·`templateKey`, 근거 `decisiveStep`(한 문장)과 `cue`(발문·보기·해설에서 글자 그대로 옮긴 4~60자), `NEW_KEY`이면 제안 이름·부모 PT·정의·풀이 구조, `HOLD`이면 사유.
   - 검사: 번호표·순번이 시험지와 일치, 문항 누락·중복 0, 키가 ACTIVE, TPL의 부모가 그 PT, `cue`가 원문에 실제로 있음(수식 구분 기호 `$`와 공백 차이는 `source-delta.mjs`의 표기 정규화로 허용), 교육과정 연결 행 유무(없으면 오류가 아니라 `NEEDS_BINDING`으로 분류), `NEW_KEY` 이름이 기존 키·별칭과 충돌하지 않음.
   - `--compare <다른 원장>`: 두 원장을 문항별로 대조해 `AGREE`(PT·TPL 같음) / `PT_ONLY`(PT만 같음) / `DIFF` / `ONE_HOLD` / `BOTH_NEW_KEY`로 집계하고 문항 행을 낸다.
3. 테스트 `tests/archive-type-judgment-tools.test.mjs`와 작은 픽스처. `tools/run-tests.js` 필수 명령에 등록.
4. `docs/agents/metadata.md` 맨 아래 사용법 3~4줄(이유 한 줄 포함).

## 규칙

- 읽기 전용. 레지스트리·크로스워크·정본 메타·봉인 문서·4칸 사전을 고치지 않는다.
- 키의 ACTIVE·부모·연결 판정은 기존 함수(`active-registry.mjs`, `reviewed-exam-registration-v2.mjs`의 `resolve()` 1690행 부근, `rpm-active-resolver.mjs`)와 같은 조건을 쓴다. import할 수 없으면 조건을 옮기고 출처를 주석과 보고서에 적는다.
- 새 판정 기준을 지어내지 않는다. 모호하면 보수적으로(통과시키지 않는 쪽) 정하고 보고서 "임의로 정한 것"에 적는다.
- 전체 테스트(`tools/run-tests.js`)는 돌리지 않아도 된다(NOT_RUN으로 적음).

## 완료 기준

- 새 테스트 통과.
- 실제 실행 결과를 보고서에 붙인다: 중3 1학기 시험지 2개와 고1 시험지 1개에 대해 `options.mjs --exam`을 돌려 문항당 선택지 수(PT·TPL)의 분포, 그리고 손으로 만든 예시 원장 1개를 `check-ledger.mjs`로 검사한 출력.

## 보고 형식 (`TASK-02-REPORT.md`)

1절 조사 결과 셋, 커밋 해시, 만든 파일, 원장 스키마, 재사용·옮긴 조건의 출처, 실행 결과, 임의로 정한 것, NOT_RUN.
