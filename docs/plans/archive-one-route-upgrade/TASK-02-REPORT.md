# TASK-02 보고 — 유형 판정 준비 도구

기준 main `b18bf1e25`; 읽기 전용 조사.

## 1. 코드 작성 전 조사

### 1-1. 레지스트리 해시

현재 loadActiveMetaRegistry: **ACTIVE**, errors `[]`. TASK-01 기준 `3e4c440`에서 중간 두 canonical 파일의 실제 hash는 현재와 같고, registry_index의 expected hash만 달랐다. 현재 `96ded37d2` 등록 snapshot이 registry_index를 재생성해 둘이 일치한다. 봉인·정본은 이번 작업에서 수정하지 않았다.

|파일|TASK01 expected|실제 및 현재 expected|
|---|---|---|
|middle1.json|61fe5e236cfc4cf68d5cc17171617f9303c692b3d4caf889800cf5e2b088ad3d|dab255cf0df9d191393e1fe7bc5b72a68eef8e2c94f15ed172a644a4380f4049|
|plane-geometry.json|e31c0102c956599ab5e4a5c761122fcb15c27f67dcae3cd02a3b98f6f01434af|77802a9b81c4e5e5739ed0996de7d6d36153116ee2067728a2d6944fd23472cc|

기대 해시 위치: `archive/data/meta-foundation/canonical/registry_index.json`의 `canonicalSources`. LF 정규화 후 SHA-256으로 비교한다.

middle1.json 최근 파일 이력:
```
4bbcea763 2026-11-16 18:53:57 +0900 archive: bind M2S2 reviewed92 to R9 worker candidate and preserve external E023 scope
a97eb65e5 2026-11-04 17:05:30 +0900 Register Palma 2021 middle-school metadata (#1349)
0b986b921 2026-09-27 13:25:36 +0900 archive(m1): publish urgent R2E archive set
8c737c372 2026-09-25 07:38:22 +0900 promote(meta-m1): close batches 01-16 into Archive2
```

plane-geometry.json 최근 파일 이력:
```
2e07ec4dd 2026-11-16 19:32:29 +0900 archive: rebind R9 to actual registered E023 state and preserve current main
4af0d3e08 2026-11-16 10:01:00 +0000 chore(archive): register main snapshot [skip ci]
4bbcea763 2026-11-16 18:53:57 +0900 archive: bind M2S2 reviewed92 to R9 worker candidate and preserve external E023 scope
ad3d5fd96 2026-11-16 06:44:17 +0000 chore(archive): register main snapshot [skip ci]
4b504e10b 2026-11-16 04:39:02 +0000 chore(archive): register main snapshot [skip ci]
```

registry_index 최근 이력:
```
96ded37d2 2026-11-16 11:11:18 +0000 chore(archive): register main snapshot [skip ci]
4af0d3e08 2026-11-16 10:01:00 +0000 chore(archive): register main snapshot [skip ci]
ad3d5fd96 2026-11-16 06:44:17 +0000 chore(archive): register main snapshot [skip ci]
4b504e10b 2026-11-16 04:39:02 +0000 chore(archive): register main snapshot [skip ci]
e9af62176 2026-11-16 01:27:08 +0000 chore(archive): register main snapshot [skip ci]
```

원인: canonical 변경 commit `4bbcea763`(두 파일), plane-geometry 후속 `2e07ec4dd` 이후 generated registry_index의 갱신 시차. `active-registry.mjs` canonicalSources hash 검증이 이를 탐지하며, `tests/meta-foundation-middle-geometry-runtime.test.js:105–106`과 `tests/archive-main-merge-meta.test.mjs:508–513`은 ACTIVE를 요구한다. CI는 `.github/workflows/ci.yml`에서 PR registration proof 또는 main temporary projection을 먼저 준비한 뒤 tests를 돌리고, `tools/ci/archive-pr-registration-prepare.mjs:69`는 native 요청이 있으면 compile-meta-foundation --write를 수행한다. 따라서 원시 git snapshot과 CI의 임시 재생성 snapshot은 다를 수 있다. 이 조사에서 역사 CI 로그는 조회하지 않았으므로 과거 특정 run이 통과한 이유를 확정하지 않는다. 현재 원시 main은 정상이다. 재발시 선택지: 승인된 등록 writer로 index 재생성, 잘못된 canonical 변경만 승인 복원, 또는 raw checkout 무결성과 prepared projection 무결성을 별도 검사. 이번에는 어느 것도 변경하지 않음.

### 1-2. 유형 목록 규모

ACTIVE PT 434, TPL 1007, ACTIVE binding 행 1104. 분모는 정본 metadata 또는 ACTIVE bindings에 나타난 curriculum/course/unit/sub 조합. PT는 binding된 ACTIVE key의 고유수, TPL은 그 PT 아래 ACTIVE 자식 고유수. binding 미존재 조합은 0 포함. 과목·교육과정 불명은 UNKNOWN으로 보존.

### unit_middle

PT {"n":137,"min":0,"median":0,"max":21}; TPL {"n":137,"min":0,"median":0,"max":62}

|범위|PT|TPL|
|---|---:|---:|
|2022 / 중1 수학 / M1-05|21|62|
|2015 / 중1 수학 / M1-05|18|50|
|2015 / 중3-1 / M3-04|18|31|
|2015 / 중1 수학 / M1-01|16|28|
|2015 / 중2-1 / M2-04|16|16|
|2015 / 중1 수학 / M1-02|15|23|
|2015 / 중1 수학 / M1-04|14|38|
|2022 / 중1 수학 / M1-04|13|28|
|2015 / 중2-2 / M2-05|13|13|
|2015 / 중2 수학 / M2-04|12|39|

### unit_high

PT {"n":179,"min":0,"median":0,"max":25}; TPL {"n":179,"min":0,"median":0,"max":87}

|범위|PT|TPL|
|---|---:|---:|
|2015 / 수학(하) / H15-SB-03|25|87|
|2015 / 수학(하) / H15-SB-04|20|63|
|2022 / 공통수학2 / H22-C2-07|19|71|
|2015 / 수학(하) / H15-SB-05|15|50|
|2015 / 수학(하) / H15-SB-01|14|48|
|2022 / 공통수학2 / H22-C2-05|13|47|
|2015 / 수학(상) / H15-SA-12|13|31|
|2022 / 공통수학1 / H22-C-06|13|26|
|2015 / 수학(하) / H15-SB-02|11|51|
|2022 / 공통수학2 / H22-C2-04|11|29|

### sub_middle

PT {"n":709,"min":0,"median":0,"max":16}; TPL {"n":709,"min":0,"median":0,"max":43}

|범위|PT|TPL|
|---|---:|---:|
|2015 / 중3-1 / M3-04 / M3-04-QUADRATIC_FUNCTION_GRAPH|16|28|
|2015 / 중1 수학 / M1-05 / M1-05-BASIC_FIGURE|14|39|
|2022 / 중1 수학 / M1-05 / M1-05-BASIC_FIGURE|13|36|
|2015 / 중2-2 / M2-05 / M2-05-QUADRILATERAL_PROPERTIES|13|13|
|2022 / 중1 수학 / M1-05 / M1-05-POSITION_RELATION|11|43|
|2022 / 중1 수학 / M1-04 / M1-04-COORDINATE_PLANE|10|25|
|2015 / 중1 수학 / M1-01 / M1-01-PRIME_FACTORIZATION|10|15|
|2015 / 중2 수학 / M2-04 / M2-04-LINEAR_FUNCTION_EQUATION|9|31|
|2015 / 중1 수학 / M1-04 / M1-04-GRAPH_RELATION|9|28|
|2015 / 중1 수학 / M1-02 / M1-02-RATIONAL_NUMBER_OPERATIONS|9|17|

### sub_high

PT {"n":697,"min":0,"median":0,"max":15}; TPL {"n":697,"min":0,"median":0,"max":59}

|범위|PT|TPL|
|---|---:|---:|
|2022 / 공통수학2 / H22-C2-07 / H22-C2-07-FUNCTION_BASIC|15|59|
|2015 / 수학(하) / H15-SB-03 / H15-SB-03-FUNCTION_RELATION|15|58|
|2015 / 수학(하) / H15-SB-03 / H15-SB-03-INVERSE_FUNCTION|13|56|
|2022 / 공통수학2 / H22-C2-05 / H22-C2-05-CORE|13|47|
|2015 / 수학(하) / H15-SB-01 / H15-SB-01-SET_BASIC|13|45|
|2015 / 수학(하) / H15-SB-03 / H15-SB-03-COMPOSITE_FUNCTION|11|40|
|2022 / 공통수학2 / H22-C2-04 / H22-C2-04-CORE|11|29|
|2015 / 수학II / H15-M2-06 / H15-M2-06-DERIVATIVE_APPLICATION|11|24|
|2022 / 공통수학2 / H22-C2-06 / H22-C2-06-CORE|10|49|
|2015 / 수학(하) / H15-SB-04 / H15-SB-04-RATIONAL_BASIC|10|22|

### 연결 행이 없는 단원 조합

- middle: `2015|중2 수학|M2-01`, `UNKNOWN|중1 수학|M1-02`, `2015|중2|M2-10`, `2015|중3 수학|M3-03`, `2015|중3|M3-04`, `UNKNOWN|중1 수학|M1-03`, `UNKNOWN|중1 수학|M1-04`, `2022|중2|M2-04`, `UNKNOWN|중2 수학|M2-05`, `UNKNOWN|중학 수학|M1-02`, `2022|중2 수학|M2-04`, `2015|중2 수학|M2-02`, `2015|중2-1|M2-05`, `UNKNOWN|중1|M1-2-GEOM-SOLID-01`, `UNKNOWN|중3 수학|M3-03`, `2015|중3-1|M3-05`, `2015|중2수학|M2-11`, `2015|UNKNOWN|M3-01`, `2015|중3|M3-03`, `UNKNOWN|중2 수학|M2-01`, `UNKNOWN|중1 수학|M1-01`, `2015|중2-2|M2-08`, `2015|중1 수학|M2-05`, `2015|M3|M3-07`, `2015|중2|M2-05`, `2015|중3-2|M3-07`, `2015|중3|M3-01`, `2015|중3|M3-02`, `2015|중2-1|M2-06`, `UNKNOWN|중1|M1-2-GEOM-SOLID-03`, `UNKNOWN|중2 수학|M2-06`, `2015|중2수학|M2-10`, `2015|M3|M3-06`, `UNKNOWN|중3 수학|M3-04`, `2015|중2|M2-07`, `2022|중2 수학|M2-03`, `2022|중2 수학|M2-01`, `UNKNOWN|중2 수학|M2-08`, `2015|수학|M3-06`, `2015|중1 수학|M2-08`, `2015|중2|M2-08`, `2015|중학교 2학년|M2-08`, `2015|중학교 2학년|M2-11`, `2015|UNKNOWN|M3-02`, `2022|중1|M1-08`, `2015|중2-1|M2-08`, `2022|중1|M1-04`, `2022|중1|M1-05`, `2015|중2수학|M2-08`, `2015|중2-2|M2-06`, `2015|중2|M2-06`, `2015|중학교 3학년|M3-01`, `2015|중2-1|M2-03-INEQUALITY`, `2015|중2|M2-11`, `2015|중2수학|M2-09`, `2015|중2-2|M2-04`, `2015|중2-1|M2-07`, `UNKNOWN|중1|M1-08`, `2015|중2|M2-09`, `2022|중2 수학|M1-07`, `2015|중2-1|M2-09`, `2015|중2수학|M2-07`, `UNKNOWN|중1 수학|M2-02`, `2015|중2-2|M2-03`, `2015|중2-2|M2-09`, `UNKNOWN|중2 수학|M2-07`, `2015|중학교 2학년|M2-09`, `2022|공통수학1|M3-04`, `UNKNOWN|중1|M1-2-STAT-05`, `2015|중학교 3학년|M3-03`, `2015|중학교 3학년|M3-02`, `2015|중학교 2학년|M2-10`, `2015|중2 수학|M1-01`, `2022|중2 수학|M1-03`, `UNKNOWN|중1|M1-2-GEOM-SOLID-02`, `2015|수학|M3-05`, `2022|중3 수학|M3-01`, `2015|중2 수학|M1-07`, `2015|중2-1|M2-10`, `2015|중2|M2-04`, `UNKNOWN|중1|M1-2-STAT-03`, `UNKNOWN|중1|M1-07`, `2015|중3 수학|M2-06`, `2022|공통수학1|M1-01`, `UNKNOWN|중1|M1-2-GEOM-SOLID-07`, `UNKNOWN|중1|M1-2-GEOM-SOLID-06`, `UNKNOWN|중1|M1-2-GEOM-SOLID-04`, `UNKNOWN|중1|M1-2-GEOM-SOLID-05`, `2015|중3-1|M3-06`, `UNKNOWN|중1 수학|M1-06`, `2015|수학(상)|M3-01`
- high: `2022|공통수학2|H22-C3-01`, `2022|공통수학1|H22-C1-02`, `2022|공통수학1|H22-C1-01`, `2022|확률과통계|H22-PS-06`, `2022|미적분1|H22-MC1-01`, `2022|기하|H22-GE-04`, `2022|대수|H22-A-03-02`, `2015|대수|H15-M1-08`, `2022|공통수학1|H22-C1-04`, `2022|미적분1|H22-M1-08`, `2022|공통수학2|H22-C3-02`, `2022|대수|H22-AL-03`, `2022|공통수학1|H22-C1-03`, `2015|기하와 벡터|H15-GV-03`, `2015|UNKNOWN|H15-PS-06`, `2022|확률과통계|H22-PS-04`, `2015|기하|H15-GV-08`, `2015|대수|H15-M1-05`, `2015|기하|H15-GV-06`, `2015|미적분|H15-CALC-02`, `2022|대수|H22-AL-01`, `2022|미적분1|H22-MC1-02`, `2015|UNKNOWN|H15-PS-05`, `2022|기하|H22-GE-08`, `2015|UNKNOWN|H15-PS-04`, `UNKNOWN|수학(상)|HIGH1-MOTHER-FINAL`, `2022|대수|H22-AL-02`, `2015|확률과통계|H15-PS-05`, `2015|미적분|H15-CALC-01`, `2022|확률과통계|H22-PS-05`, `2015|기하|H15-GV-04`, `2022|확률과통계|H22-PS-03`, `2015|대수|H15-M1-11`, `2022|확률과통계|H22-PS-01`, `2015|미적분|H15-CALC-04`, `2022|미적분1|H22-M1-06`, `2015|대수|H15-M1-09`, `2022|미적분1|H22-M1-07`, `2015|미적분|H15-CALC-03`, `2015|UNKNOWN|H15-M1-04`, `2015|대수|H15-M1-06`, `2015|기하와 벡터|H15-GV-02`, `2015|기하|H15-GV-05`, `2015|대수|H15-M1-10`, `2022|확률과통계|H22-PS-02`, `2015|미적분|H15-CALC-05`, `2015|기하|H15-GV-09`, `2015|UNKNOWN|H15-M1-03`, `2015|수학Ⅱ|H15-M2-06`, `UNKNOWN|수학(상)|HH15-SA-02`, `2015|수학Ⅰ|H15-M1-01`, `2015|확률과통계|H15-PS-01`, `2015|기하와 벡터|H15-GV-05`, `UNKNOWN|수학(상)|HH15-SA-01`, `2015|기하|H15-GV-01`, `2022|대수|H22-A-03-03`, `2015|확률과통계|H15-PS-04`, `2015|대수|H15-M1-07`, `2022|공통수학1|H22-A-09`, `UNKNOWN|대수|H21-M1-02`, `2015|기하와 벡터|H15-GV-06`, `2015|수학Ⅰ|H15-M1-03`, `2015|수학Ⅰ|H15-M1-05`, `2015|기하와 벡터|H15-GV-01`, `2022|대수|H22-C-11`, `2015|수학Ⅰ|H15-M1-02`, `2015|대수|H15-M1-01`, `2015|UNKNOWN|H15-PS-03`, `2022|대수|H22-A-03-01`, `2015|기하|H15-GV-02`, `2015|수학Ⅰ|H15-M1-04`, `2015|기하|H15-GV-03`, `2015|수학Ⅰ|H15-M1-06`, `2015|대수|H15-M1-02`, `UNKNOWN|대수|HH22-C-02`, `2022|수학(상)|H22-A-01`, `UNKNOWN|수학(상)|HH15-SA-03`, `2022|수학(상)|H22-A-04`, `2015|수학Ⅰ|H15-M1-07`, `2022|대수|H22-C-10`, `2015|미적분|H15-CALC-06`, `2022|공통수학2|H22-C2-SET`, `2015|미적분|H15-CALC-07`, `2015|확률과통계|H15-PS-03`, `2015|기하와 벡터|H15-GV-04`, `UNKNOWN|대수|H21-M1-01`, `2022|공통수학1|H22-C-10`, `2015|수학Ⅱ|H15-M2-05`, `2022|수학I|H15-M1-03`, `2015|기하와 벡터|H15-GV-07`, `2015|수학Ⅱ|H15-M2-09`

마스터 테이블 active 단원 중 어떤 교육과정에도 binding이 없는 키: `H15-CALC-01`, `H15-CALC-02`, `H15-CALC-03`, `H15-CALC-04`, `H15-CALC-05`, `H15-PS`, `H21-M1-01`, `H21-M1-02`, `H22-A-03-01`, `H22-A-03-02`, `H22-A-03-03`, `H22-A-09`, `H22-C-10`, `H22-C-11`, `H22-GE-04`, `H22-GE-08`, `H22-M1-06`, `H22-M1-07`, `H22-M1-08`, `HH15-SA-01`, `HH15-SA-02`, `HH15-SA-03`, `HH22-C-02`, `H_ST_01_01`, `H_ST_01_02`, `H_ST_02_01`, `M1-2-GEOM-SOLID-01`, `M1-2-GEOM-SOLID-02`, `M1-2-GEOM-SOLID-03`, `M1-2-GEOM-SOLID-04`, `M1-2-GEOM-SOLID-05`, `M1-2-GEOM-SOLID-06`, `M1-2-GEOM-SOLID-07`, `M1-2-STAT-01`, `M1-2-STAT-02`, `M1-2-STAT-03`, `M1-2-STAT-04`, `M1-2-STAT-05`, `M3-01-04`, `STAT-01`, `STAT-02`, `UNCLASSIFIED-MIDDLE2`

### 1-3. 대상 규모

정본 28890문항에서 단원키가 있고 PT 또는 TPL이 비었거나, 두 필드 상태/명시 유형 disposition에 hold·pending·unmaterialized가 있는 문항 21649개. missing과 hold는 중복 가능, total은 합집합. no_separate_l4로 TPL 빈 문항도 요구대로 missing에 포함하되 새 TPL 필요 확정은 아님. source/학년/학기는 경로에서 얻고 불명은 unknown 유지.

|학년/학기/출처|합집합|빈칸|보류|둘 다|
|---|---:|---:|---:|---:|
|h1 / 1 / original|1543|578|1179|214|
|h1 / 1 / similar|624|296|624|296|
|h1 / 2 / original|1150|1041|167|58|
|h1 / 2 / similar|335|222|335|222|
|h1 / unknown / types|177|177|177|177|
|h2 / 1 / original|2357|1717|2357|1717|
|h2 / 1 / similar|229|46|229|46|
|h2 / 2 / original|2320|1206|2320|1206|
|h2 / 2 / similar|67|67|67|67|
|h2 / unknown / types|367|367|367|367|
|h3 / 1 / original|13|13|13|13|
|h3 / 1 / similar|22|0|22|0|
|m1 / 1 / similar|585|346|585|346|
|m1 / 2 / original|171|126|169|124|
|m1 / 2 / similar|287|24|287|24|
|m1 / unknown / types|836|836|836|836|
|m2 / 1 / original|1328|1328|1328|1328|
|m2 / 1 / similar|24|24|24|24|
|m2 / 2 / original|1258|1138|1258|1138|
|m2 / unknown / types|314|314|314|314|
|m3 / 1 / original|1997|1982|1997|1982|
|m3 / 1 / similar|239|215|239|215|
|m3 / 2 / original|957|888|957|888|
|m3 / 2 / similar|72|24|72|24|
|m3 / unknown / types|47|47|47|47|
|unknown / unknown / textbooks|4330|2092|4330|2092|

## 2. 변경 범위와 커밋

- 기준 main: `b18bf1e25cbace6c2a9985067ca79cff4e6b8a3c`. 시작과 게시 직전 동일함을 확인.
- 코드 브랜치: `feat/type-judgment-tools-20261116`; 코드 커밋: `eb7a1a1a44e757e5b50aaa09411060a91a5b6766`.
- 계획 브랜치에는 이 보고서만 저장. main 병합·PR 생성·배포·모델 호출 없음.
- 신규: `archive/tools/type-judgment/common.mjs`, `options.mjs`, `check-ledger.mjs`; `tests/archive-type-judgment-tools.test.mjs`, `tests/fixtures/type-judgment/context.mjs`.
- 수정: `tools/run-tests.js` 필수 명령 추가, `docs/agents/metadata.md` 사용법 4줄 추가.
- 레지스트리·정본 메타·크로스워크·봉인·4칸·시험지 원본은 무수정. 임시 JSON·실행 로그는 Git 밖에 보관.

## 3. 원장 스키마

JSON 객체 `{schemaVersion:"type-judgment-ledger-v1", exam:"archive/exams/<경로>.js", entries:[...]}`. unknown 필드는 오류다. 각 문항은 현재 시험지의 1-based `sourceOrdinal`, `questionUid`, `decision`을 반드시 갖는다.

- `PICK`: `problemTypeKey`, `templateKey`, `decisiveStep`, `cue`.
- `NEW_KEY`: `proposedName`, `parentProblemTypeKey`, `definition`, `internalSkeleton`, `decisiveStep`, `cue`. 기존 ACTIVE 부모 PT 아래의 새 TPL 제안이며 실제 키 생성은 안 한다.
- `HOLD`: 비어 있지 않은 `reason`.
- `decisiveStep`은 비어 있지 않은 한 줄. `cue`는 Unicode code point 기준 4~60자, 발문·각 보기·해설 중 한 문자열의 정규화 결과 안에 실제 존재해야 한다.
- UID·순번 일치, 중복·누락 0, ACTIVE·부모·정본 scope·alias를 검사한다. 유효 PICK의 exact binding이 없으면 오류 아닌 `NEEDS_BINDING`; `VALID_PICK`도 등록 승인 아님.
- `NEW_KEY` 이름은 모든 기존 PT/TPL 키·한글 이름·별칭 및 compiled aliases와 NFC/공백제거/소문자 비교. 같은 원장 안 중복 제안 이름도 오류.
- 무결성 실패는 경고를 보존하고 읽기 전용 판정 가능. `--strict`이면 종료1. 일반 구조 오류도 종료1. 구조 검사 결과와 무관하게 `approval:NOT_EVALUATED`.
- `--compare`는 두 원장이 모두 유효하고 같은 시험지일 때만 5개 분류를 집계. PT/TPL 동일 `AGREE`, PT만 동일 `PT_ONLY`, 한쪽 HOLD `ONE_HOLD`, 양쪽 신규 제안 `BOTH_NEW_KEY`, 그 외 `DIFF`.

## 4. 재사용과 조건 출처

- `active-registry.mjs`: `loadActiveMetaRegistry`, `curriculumForQuestion` 그대로 import. registry index 무결성·ACTIVE maps를 재사용한다.
- `rpm-active-resolver.mjs`: `questionUidForSource` import. `activeCandidateKeysForScope`의 ACTIVE PT/TPL·active ownerPack 조건을 common adapter로 옮겼다(출처 주석).
- `reviewed-exam-registration-v2.mjs`의 비공개 `resolve()`/`resolveUnitOnly()`: exact curriculum/course/unit/sub/PT, pack curricula/standardCourses, curriculum/course alias, master ACTIVE/부모 조건을 common/checker에 옮겼다. courseKey를 단순 버리지 않는다. 독립 리뷰가 발견한 실제 courseKey 불일치 반례를 추가 검증했다.
- `source-delta.mjs`: `normalizeNotation` 직접 import. 별도 수식 정규화기를 만들지 않았다.
- `auto-register-merged-source.mjs`: `loadBank`만 import해 기존 16MiB/VM timeout source reader 재사용. 등록 함수를 호출하지 않는다.
- 최신 출처 제한 해제 §0은 `claude/pt-tpl-unlock` 판본을 읽었다. 기존 production gate는 변경하지 않았다.
- 작업1 함수·브랜치를 복사/수정하지 않았다. 공통 scope/status adapter는 **작업 1 병합 뒤 합칠 것**.

## 5. 실제 실행

`node archive/tools/type-judgment/options.mjs --exam <아래 경로> --out /tmp/<새 파일>.json`

|시험지|문항|PT 최소/중앙/최대|TPL 최소/중앙/최대|상태|
|---|---:|---|---|---|
|`original/middle/m3/1mid/16_경북장흥중_1학기_중간_중3_수학.js`|24|0/0/0|0/0/0|{"INVALID_CANONICAL_SCOPE": 17, "CANDIDATE_EXPANSION": 7}|
|`original/middle/m3/1final/16_가람중_1학기_기말_중3_수학.js`|28|0/0/0|0/0/0|{"INVALID_CANONICAL_SCOPE": 28}|
|`original/high/h1/1mid/19_강남여고_1학기_중간_고1_기출.js`|26|1/3/8|2/6/27|{"EXACT": 26}|

모두 exit0, registryVerified=true. 확장 후보 PT/TPL도 세 시험지 모두 0. **중3 0은 유형이 없다는 뜻이 아니다.** 경북장흥중 17문항·가람중28문항은 정본 sub 키가 master에 없거나 정본 scope가 유효하지 않아 보수적으로 INVALID. 경북장흥중 나머지7문항은 exact 과목 `중3` 바인딩이 없어 확장 후보도 없었다. 예: `M3-01-SQUARE_ROOT_BASIC`은 master에 없음. 임의 alias 치환이나 메타 수정을 하지 않았다.

손으로 만든 고1 강남여고 예시 원장: 1번만 PICK, 나머지25문항 HOLD. 1번 발문·해설을 직접 읽고 다음을 기록했다.

```json
{"sourceOrdinal":1,"decision":"PICK","problemTypeKey":"PT_H1_POLY_IDENTITY_COEFFICIENT","templateKey":"TPL_H1_IDENTITY_COEFFICIENT_COMPARE","decisiveStep":"우변을 전개하고 같은 차수의 계수를 비교하여 a=2, b=4를 얻는다.","cue":"양변을 전개해 같은 차수의 계수를 비교한다."}
```

`node archive/tools/type-judgment/check-ledger.mjs --ledger /tmp/task02-example-ledger-h1.json --strict` 출력 요약:
```json
{"exit":0,"registryVerified":true,"valid":true,"approval":"NOT_EVALUATED","errors":[],"counts":{"VALID_PICK":1,"HOLD":25}}
```

경북장흥중 all-HOLD 시연도 실행했으며 exit1, INVALID17/HOLD7이었다. HOLD라고 잘못된 정본 scope를 숨기지 않는 반례다. 수학적 독립 검수나 정본 등록을 완료했다고 주장하지 않는다.

## 6. 검증과 임의로 정한 것

- 14개 focused tests PASS; source/runner `node --check` PASS; `git diff --check` PASS.
- 실제 binding courseKey 충돌을 독립 검토에서 발견하여 기존 resolve와 동등하게 보완, 회귀 fixture 추가.
- 외부 출력은 부모 디렉터리가 이미 있어야 하며 새 파일만 가능(wx). repo 내부·symlink 경유·다른 Git checkout 내부 출력 거부. 기존 파일 덮어쓰기 금지.
- 인접 단원은 같은 curriculum/course의 binding 단원을 key 자연순으로 정렬한 앞뒤 최대2개. 수학적 인접성 추론이 아니며 `candidateExpansion`으로 분리한다.
- 없는/무효 canonical scope는 INLINE 원문에서 추정하지 않고 INVALID 또는 MISSING_CANONICAL_METADATA.
- 대표 번호표는 해당 필드가 approved 계열인 canonical record만 최대3개, 없으면 빈 배열. 승인 status를 임의 승격하지 않는다.
- NEW_KEY도 근거를 필수로 요구; 이 도구에서 부모 PT 신규 생성은 하지 않는다. 양쪽 HOLD는 일치 증거가 아니므로 DIFF.
- binding 자체가 없거나 HOLD라 부모가 미정인 course alias는 `COURSE_ALIAS_UNVERIFIED` 경고로 보존한다. 기존 binding pack이 alias를 거부하면 오류로 분류한다.
- 한 문장 의미·cue의 수학적 적절성·새 이름의 의미 중복은 사람/독립 검수 대상이다. 여기서 자동 승인하지 않는다.

## 7. NOT_RUN / 비범위

- 전체 `node tools/run-tests.js`: 사용자 지시상 NOT_RUN 허용, 실행하지 않음.
- 역사 CI 원시 로그, UI/브라우저·PDF·수학 전수 검수: NOT_RUN. 본 작업은 offline read-only CLI다.
- 원격 exact-head `eb7a1a1a44e757e5b50aaa09411060a91a5b6766` 조회: commit statuses `[]`, PR-triggered workflow runs `[]`. PR을 만들지 않았으므로 원격 전체 CI PASS라고 주장하지 않는다. push-triggered 전체 실행 목록은 이 조회 범위 밖.
- 원격 branch SHA 및 tree SHA readback 일치 확인. Git 커밋 객체를 API로 생성·게시했으며 로컬 검사 tree `0ad715861b3f117f0a7aae9756b5faabdf300e43`와 원격 tree가 동일하다.

## 수정 반영 — FEEDBACK-02 (2026-11-16)

기준 지시: 계획 브랜치 `ddee90dc5`의 최신 FEEDBACK-02. 진행 중 원격 재조회에서도 본문 동일함을 확인했다. 이전 지시의 exact/loose 병존은 폐기하고 **넓은 후보 하나만** 구현했다. `--pool exact`와 `--pool loose` 모두 지원하지 않는다. `--strict`는 기존 레지스트리 무결성 종료 코드 옵션이며 exact 후보 모드가 아니다.

코드: `1bea581a137a6024077c548990d9a9fff6770e7f`, 기존 `eb7a1a1a44e757e5b50aaa09411060a91a5b6766`의 후속 커밋. 원격 동일 feature 브랜치만 갱신했다. 기존 본문은 당시 결과로 보존하고 이 절이 변경 사항을 설명한다.

### 구현

- 관측된 과목표기 42종, 증거 그룹18개. 도구용 `course-aliases.json`과 재생성기만 추가했고 정본 데이터는 변경하지 않았다. 각 그룹/표기의 문항·binding 증거 수, 단원 키와 경로 학년을 기록한다. 불일치249건, 무효 마스터·모호한 과목 등 미해결1892건은 그룹에서 제외하고 별도 목록으로 보존한다.
- 중등은 실제 학년 증거로 묶고, 고등은 단원 접두만 같다고 다른 과목을 합치지 않는다. H22-A의 공통수학1/수학(상), H22-C의 공통수학2 오기는 별칭에서 제외했다. 수학/공통수학 같은 일반 표기는 실제 관측 단원에만 적용한다. 임의 별칭을 추가하지 않았다.
- 1단계 같은 단원 ACTIVE binding(관측 과목 별칭), 2단계 실제 crosswalk의 동일한 전체 RPM leaf와 부모 표의 명시 legacy 연결, 3단계 앞선 후보가 없을 때 같은 단원의 승인된 유형 필드 사용 기록. 교육과정 대응이 없는 곳은 추정하지 않는다. source-course 증거 없이 다른 과목으로 stage2에 들어가지 못한다.
- 후보별 `EXACT / ALIAS / CROSS_CURRICULUM / USED_IN_UNIT`, 단계와 근거를 표시한다. `ALIAS` 중 단원 전체 확장은 `bindingReason: UNIT_WIDE`로 구별한다. 정확한 소단원 binding이 아닌 경우 모두 재연결 부채이며 기존 원장 검사는 `NEEDS_BINDING`; ACTIVE PT/TPL 및 부모·cue·UID 검사는 유지한다.
- `--stage pt`는 TPL 정의를 제외하고 templateCount만 제공, `--stage tpl --pt <키>`는 실제 후보 PT의 TPL만 반환한다. PT25개 초과는 twoStageRecommended 표시. 정확한 후보의 근거는 실제 exact row를 보존한다.
- `--units <외부 JSON>`은 UID별 단원/소단원만 사용하고 `OVERRIDE`로 표시한다. `--units inline`은 canonical unit/sub가 무효일 때만 JS 인라인으로 바꾸며 `INLINE` 표시. 원장/비교 도구도 동일 옵션을 받는다. ACTIVE master/부모 검사는 계속 적용한다. repo·symlink·다른 checkout 내부 JSON은 거부한다. 원본 metadata/JS는 수정하지 않는다.

### 실제 실행과 세 시험지

데이터 기준: feature의 정본 28,890행, registry ACTIVE, errors `[]`. 최종 읽기 전용 실측 11.973초. 소형 실제 CLI `options.mjs --exam <경북장흥중> --units inline --stage pt --strict --out <외부 새 JSON>` exit0. 아래 PT/TPL 수는 문항별 후보 수의 최소/중앙/최대이며 binding 분포는 문항×후보 합계다.

|시험지|units|문항|PT min/median/max|TPL min/median/max|bindingStatus|
|---|---|---:|---|---|---|
|`original/middle/m3/1mid/16_경북장흥중_1학기_중간_중3_수학.js`|CANONICAL|24|0/0/2|0/0/15|{"ALIAS": 14}|
|`original/middle/m3/1mid/16_경북장흥중_1학기_중간_중3_수학.js`|inline|24|2/8/10|12/30/30|{"ALIAS": 154}|
|`original/middle/m3/1final/16_가람중_1학기_기말_중3_수학.js`|CANONICAL|28|0/0/0|0/0/0|{}|
|`original/middle/m3/1final/16_가람중_1학기_기말_중3_수학.js`|inline|28|10/18/18|12/31/31|{"EXACT": 397, "ALIAS": 67}|
|`original/high/h1/1mid/19_강남여고_1학기_중간_고1_기출.js`|CANONICAL|26|1/7/14|2/11.5/29|{"ALIAS": 32, "CROSS_CURRICULUM": 80, "EXACT": 93}|

중3 canonical의 무효 소단원은 그대로 남는다. 명시 inline을 켰을 때 경북장흥중24/24, 가람중28/28 모두 후보가 생겼다. 단원을 고쳤거나 유형 판정을 완료했다는 뜻이 아니다.

### 원본 중등·고등 유형 공백의 현재 판정 준비 범위

분모: original/middle 및 original/high에서 PT 또는 TPL 값이 없거나 유형 필드 상태가 manual_review_pending/HOLD/UNKNOWN/EVIDENCE_DEBT인 행. 기본 canonical 단원 기준이며 전체 집계에는 inline/외부 override를 강제로 적용하지 않았다. 단계별 문항 수는 한 문항이 여러 단계 후보를 가질 수 있어 서로 겹친다.

|학년·학기|유형 공백|후보 ≥1 문항|후보 단계별 문항 수|
|---|---:|---:|---|
|original/high/h1/1final|633|591|{"ALIAS": 564, "EXACT": 574, "CROSS_CURRICULUM": 233}|
|original/high/h1/1mid|956|914|{"EXACT": 904, "ALIAS": 634, "CROSS_CURRICULUM": 614}|
|original/high/h1/2final|367|367|{"ALIAS": 345, "EXACT": 356, "CROSS_CURRICULUM": 12}|
|original/high/h1/2mid|783|763|{"EXACT": 759, "ALIAS": 650, "CROSS_CURRICULUM": 6}|
|original/high/h2/1final|1167|561|{"CROSS_CURRICULUM": 79, "ALIAS": 273, "EXACT": 548}|
|original/high/h2/1mid|1697|1374|{"EXACT": 1260, "CROSS_CURRICULUM": 826, "ALIAS": 877}|
|original/high/h2/2final|844|844|{"EXACT": 840, "ALIAS": 241}|
|original/high/h2/2mid|1476|1396|{"EXACT": 1314, "ALIAS": 426, "CROSS_CURRICULUM": 98, "USED_IN_UNIT": 31}|
|original/high/h3/1final|20|0|{}|
|original/high/h3/1mid|13|8|{"USED_IN_UNIT": 8}|
|original/middle/m1/1final|96|0|{}|
|original/middle/m1/1mid|97|0|{}|
|original/middle/m1/2final|82|82|{"EXACT": 82, "CROSS_CURRICULUM": 39, "ALIAS": 68}|
|original/middle/m1/2mid|89|86|{"ALIAS": 74, "EXACT": 86, "CROSS_CURRICULUM": 85}|
|original/middle/m2/1final|1071|373|{"ALIAS": 372, "EXACT": 296}|
|original/middle/m2/1mid|651|415|{"ALIAS": 400, "EXACT": 39}|
|original/middle/m2/2final|718|582|{"ALIAS": 480, "EXACT": 570}|
|original/middle/m2/2mid|732|527|{"ALIAS": 522, "EXACT": 339}|
|original/middle/m3/1final|1322|727|{"ALIAS": 674, "EXACT": 378}|
|original/middle/m3/1mid|1266|959|{"EXACT": 781, "ALIAS": 779}|
|original/middle/m3/2final|729|495|{"EXACT": 424, "ALIAS": 495}|
|original/middle/m3/2mid|526|410|{"ALIAS": 292, "EXACT": 375}|

합계: 15,335문항 중 11,474문항에 후보 ≥1. 정확 연결만 보여주는 별도 실행 모드는 최신 요청에 따라 제거했으므로 exact/loose 비교 수치는 내지 않는다.

### 무효 소단원과 학년 불일치 (운영 데이터 수정 안 함)

마스터에 없는 소단원 키는 정본 전체를 경로 그룹별로 센다. 아래 키와 개수는 문제를 고친 결과가 아니라 조사 목록이다.

|경로 그룹|행 수|없는 키 (행 수)|
|---|---:|---|
|original/high/h1/1final|9|`H15-SA-04-COMPLEX_NUMBER` 1; `H15-SA-05-QUADRATIC_EQUATION` 1; `H15-SA-09-COORDINATE_GEOMETRY` 6; `H15-SA-13-QUADRATIC_FUNCTION` 1|
|original/high/h1/1mid|10|`H15-SA-06-HIGHER_EQUATION` 1; `H15-SA-07-SYSTEM_OF_EQUATIONS` 1; `H15-SA-09-ABSOLUTE_INEQUALITY` 2; `H15-SA-09-INEQUALITY_APPLICATION` 1; `H15-SA-09-QUADRATIC_INEQUALITY` 1; `H15-SA-13-EQUATION_FUNCTION_RELATION` 2; `H22-C-04-COMPLEX_QUADRATIC` 2|
|original/high/h1/2mid|20|`HIGH1-MOTHER-FINAL` 20|
|original/middle/m2/1final|407|`M2-01-FINITE_DECIMAL` 5; `M2-01-FRACTION_CALCULATION` 1; `M2-01-FRACTION_CONVERSION` 2; `M2-01-RATIONAL_CONCEPT` 1; `M2-01-RATIONAL_NUMBER_CONCEPT` 1; `M2-01-RATIONAL_PROPERTIES` 1; `M2-01-RECURRING_DECIMAL` 4; `M2-01-RECURRING_DIGIT` 1; `M2-01-RECURRING_PERIOD` 1; `M2-01-RECURRING_REPRESENTATION` 2; `M2-01-RECURRING_TO_FRACTION` 2; `M2-01-TERMINATING_DECIMAL` 2; `M2-01-TERMINATING_UNKNOWN` 1; `M2-02-COMPLEX_SUBSTITUTION` 1; `M2-02-DIGIT_COUNT` 1; `M2-02-EXPANSION_MATCH` 1; `M2-02-EXPONENT_APPLICATION` 1; `M2-02-EXPONENT_BASIC` 1; `M2-02-EXPONENT_DETERMINATION` 1; `M2-02-EXPONENT_EXPANSION` 1; `M2-02-EXPONENT_LAWS` 5; `M2-02-EXPONENT_RULES` 1; `M2-02-EXPRESSION_VALUE` 1; `M2-02-INVERSE_CALCULATION` 1; `M2-02-MONOMIAL_CALCULATION` 2; `M2-02-MONOMIAL_GEOMETRY` 1; `M2-02-POLYNOMIAL_ADD` 1; `M2-02-POLYNOMIAL_ADD_SUB` 1; `M2-02-POLYNOMIAL_ARITHMETIC` 3; `M2-02-POLYNOMIAL_CALCULATION` 3; `M2-02-POLYNOMIAL_COEFFICIENT` 1; `M2-02-POLYNOMIAL_DEGREE` 1; `M2-02-POLYNOMIAL_EXPANSION` 1; `M2-02-POLYNOMIAL_GEOMETRY` 1; `M2-02-POLYNOMIAL_INVERSE` 1; `M2-02-POLYNOMIAL_MUL_DIV` 1; `M2-02-POLYNOMIAL_SUB` 1; `M2-02-POLYNOMIAL_SUBSTITUTION` 1; `M2-02-UNKNOWN_MONOMIAL` 1; `M2-02-VOLUME_APPLICATION` 1; `M2-03-AGE_PROBLEM` 1; `M2-03-BENCH_PROBLEM` 1; `M2-03-DISTANCE_TIME_INEQUALITY` 1; `M2-03-EQUAL_SOLUTIONS` 1; `M2-03-EXPRESSION_RANGE` 1; `M2-03-FRACTION_INEQUALITY_SOLVE` 1; `M2-03-FUSED_APPLICATION` 1; `M2-03-INEQUALITY_APPLICATION` 5; `M2-03-INEQUALITY_COEFFICIENT` 1; `M2-03-INEQUALITY_COEFFICIENT_DETERMINATION` 1; `M2-03-INEQUALITY_COEFFICIENT_GRAPH` 1; `M2-03-INEQUALITY_CONCEPT` 1; `M2-03-INEQUALITY_DEFINITION` 5; `M2-03-INEQUALITY_DIRECTION` 1; `M2-03-INEQUALITY_DOMAIN_SOLUTION` 1; `M2-03-INEQUALITY_EXPRESSION` 1; `M2-03-INEQUALITY_PROPERTIES` 6; `M2-03-INEQUALITY_PROPERTY` 1; `M2-03-INEQUALITY_REAL_LIFE` 1; `M2-03-INEQUALITY_SOLUTION` 3; `M2-03-INEQUALITY_SOLVE` 4; `M2-03-INEQUALITY_STEP_PROVING` 1; `M2-03-INEQUALITY_WORD_PROBLEM` 1; `M2-03-INEQ_PROPERTIES` 1; `M2-03-INTEGER_COUNT` 1; `M2-03-LINEAR_EQUATION_APPLICATION` 1; `M2-03-LINEAR_EQUATION_SYSTEM` 8; `M2-03-LINEAR_INEQUALITY_CONCEPT` 1; `M2-03-LINEAR_INEQUALITY_IDENTIFY` 1; `M2-03-NATURAL_COUNT_PARAM` 1; `M2-03-NO_NATURAL_SOLUTION` 1; `M2-03-REDUCED_FRACTION_CONDITION` 1; `M2-03-SALT_WATER` 1; `M2-03-SENTENCE_TO_INEQUALITY` 1; `M2-03-SOLVE_BASIC_INEQUALITY` 1; `M2-03-SOLVE_INEQUALITY` 14; `M2-03-SOL_NUMBER_LINE` 1; `M2-03-SYSTEM_INEQ_SOL` 1; `M2-03-SYSTEM_NO_SOL` 1; `M2-03-UNKNOWN_COEFF` 1; `M2-03-WORD_PROBLEM_TIME` 1; `M2-04-ADDITION_SUBTRACTION` 1; `M2-04-AGE_APPLICATION` 1; `M2-04-APPLICATIONS_GAMES` 1; `M2-04-APPLICATIONS_SPEED` 1; `M2-04-CALORIE_APPLICATION` 1; `M2-04-COEFFICIENT_SWAPPED` 2; `M2-04-COMMON_SOLUTION` 3; `M2-04-DECIMAL_COEFFICIENTS` 2; `M2-04-DISTANCE_SPEED_TIME` 1; `M2-04-ELIMINATION_METHOD` 1; `M2-04-EQUATION_AND_FUNCTION` 5; `M2-04-EQUATION_SOLUTION` 2; `M2-04-EXPONENT_SYSTEM` 1; `M2-04-FUNCTION_CONCEPT` 2; `M2-04-FUNCTION_DEFINITION` 1; `M2-04-FUNCTION_VALUE` 2; `M2-04-INFINITE_SOLUTIONS` 3; `M2-04-LINEAR_EQUATION_2VAR` 2; `M2-04-LINEAR_EQUATION_SOLUTION` 1; `M2-04-LINEAR_EQUATION_TWO_VARS` 8; `M2-04-LINEAR_EQ_DEF` 4; `M2-04-LINEAR_EQ_SOLUTION` 1; `M2-04-LINEAR_FUNCTION_APPLICATION` 1; `M2-04-LINEAR_FUNCTION_DEFINITION` 1; `M2-04-LINEAR_FUNCTION_GRAPH` 9; `M2-04-LINEAR_FUNCTION_INTERCEPT` 2; `M2-04-LINEAR_FUNCTION_SLOPE` 1; `M2-04-LINEAR_FUNCTION_TRANSLATION` 2; `M2-04-MISREAD_COEFF` 1; `M2-04-NATURAL_NUMBER_SOLUTIONS` 1; `M2-04-NATURAL_SOLUTIONS` 3; `M2-04-POINT_SUBSTITUTION` 1; `M2-04-RATIO_CONDITION` 1; `M2-04-RATIO_PROBLEM` 1; `M2-04-SOLVE_SYSTEM` 29; `M2-04-SOL_INTEGER` 1; `M2-04-SOL_SUBSTITUTION` 1; `M2-04-SPECIAL_CASES` 3; `M2-04-SUBSTITUTION_METHOD` 1; `M2-04-SUM_CONDITION` 1; `M2-04-SYSTEM_AND_GRAPH` 2; `M2-04-SYSTEM_APPLICATION` 10; `M2-04-SYSTEM_BASIC_SOLVE` 1; `M2-04-SYSTEM_COMMON_SOL` 2; `M2-04-SYSTEM_COMPLEX` 1; `M2-04-SYSTEM_COMPLEX_COEFF` 2; `M2-04-SYSTEM_ONE_VARIABLE_GIVEN` 1; `M2-04-SYSTEM_PRICE_APP` 1; `M2-04-SYSTEM_SOL` 1; `M2-04-SYSTEM_SOLUTION_CHECK` 2; `M2-04-SYSTEM_SPECIAL_CASES` 1; `M2-04-SYSTEM_SUBSTITUTION` 1; `M2-04-UNKNOWN_COEFF` 1; `M2-04-VARIABLE_RATIO_SOLVE` 1; `M2-04-WORD_PROBLEM` 3; `M2-04-WORD_PROBLEM_SPEED` 2; `M2-04-WORD_PROBLEM_TICKET` 1; `M2-05-APPLICATIONS_PAGES` 1; `M2-05-AXIS_TRIANGLE_AREA` 1; `M2-05-DEF` 1; `M2-05-EQUATION_FROM_GRAPH` 1; `M2-05-FUNCTION_CONCEPT` 4; `M2-05-FUNCTION_DEF` 1; `M2-05-FUNCTION_VALUE` 4; `M2-05-FUNC_VAL` 2; `M2-05-GEOMETRY_RATIO` 1; `M2-05-GRAPH_ANALYSIS` 1; `M2-05-GRAPH_COEFFICIENTS` 1; `M2-05-GRAPH_DRAWING` 1; `M2-05-GRAPH_EQUATION` 1; `M2-05-GRAPH_PROPERTIES` 5; `M2-05-GRAPH_QUADRANTS` 2; `M2-05-INTERCEPT_CALCULATION` 1; `M2-05-INTERSECT_RECTANGLE` 1; `M2-05-LINEAR_FUNCTION_DEF` 2; `M2-05-LINEAR_FUNCTION_GRAPH` 6; `M2-05-LINEAR_FUNCTION_PROP` 1; `M2-05-LINEAR_FUNC_DEF` 2; `M2-05-LINE_EQUATION` 1; `M2-05-LINE_EQUATION_SUBJ` 1; `M2-05-PARALLEL_AND_POINT` 1; `M2-05-PARALLEL_LINES` 1; `M2-05-PARALLEL_LINE_POINT` 1; `M2-05-PROPERTIES` 2; `M2-05-RATE_APPLICATION` 1; `M2-05-SLOPE_DEF` 3; `M2-05-TRANSLATION` 2; `M2-05-TRANSLATION_BASIC` 1; `M2-05-TRANSLATION_INTERCEPTS` 1; `M2-05-TRIANGLE_AREA` 1; `M2-05-TWO_POINTS_PARAM` 1; `M2-05-WORD_PROBLEM` 1; `M2-05-WORD_PROBLEM_FEE` 1; `M2-06-ADD_SUB_METHOD` 1; `M2-06-APPLICATIONS_DRAINAGE` 1; `M2-06-APPLICATIONS_RACE` 1; `M2-06-AREA_BISECTION` 1; `M2-06-AXIS_PARALLEL_LINES` 4; `M2-06-BOUNDED_AREA` 1; `M2-06-COLLINEAR_POINTS` 2; `M2-06-COMMON_INTERCEPT` 1; `M2-06-CONCURRENT_LINES` 1; `M2-06-DECIMAL_FRACTION` 1; `M2-06-EQUATION_TO_FUNCTION` 3; `M2-06-FIND_LINE_EQ` 1; `M2-06-GRAPH_COEFFICIENTS` 1; `M2-06-GRAPH_COORDS_SUBJ` 1; `M2-06-LINE_SEGMENT_INTERSECT` 1; `M2-06-LINE_SEGMENT_INTERSECTION` 1; `M2-06-NO_SOLUTION` 1; `M2-06-PARALLEL_AXIS_LINE` 1; `M2-06-PARALLEL_LINES` 1; `M2-06-PARALLEL_LINES_NO_SOLUTION` 1; `M2-06-SAME_SOLUTION` 1; `M2-06-SIGN_OF_COEFF` 2; `M2-06-SPECIAL_CASES` 1; `M2-06-SUBSTITUTION` 1; `M2-06-SYSTEM_GRAPH_INTERSECT` 1; `M2-06-SYSTEM_INTERSECTION` 2; `M2-06-SYSTEM_NO_SOLUTION` 1; `M2-06-TRIANGLE_AREA` 3; `M2-06-TWO_SYSTEMS_SAME` 1; `M2-06-WORD_PROBLEM_GRAPH` 1; `M2-07-CALORIE_SUBJ` 1; `M2-07-DIST_SPEED_TIME` 1; `M2-08-FIND_EQ_INTERCEPTS` 1; `M2-08-FLOWCHART_LABYRINTH` 1; `M2-08-FUNC_DEF` 1; `M2-08-ISOSCELES_TRAPEZOID` 1; `M2-08-LINEAR_FUNC_DEF` 1; `M2-08-PARALLELOGRAM_CONDITION` 1; `M2-08-PARALLELOGRAM_DIAGONAL` 1; `M2-08-PARALLELOGRAM_INTERNAL_POINT` 1; `M2-08-PARALLELOGRAM_SIDE` 1; `M2-08-PARALLEL_LINE_AREA` 1; `M2-08-PARALLEL_POINT` 1; `M2-08-PROPERTIES` 1; `M2-08-QUADRILATERAL_RELATION` 1; `M2-08-RECTANGLE_DIAGONAL_ANGLE` 1; `M2-08-RHOMBUS_CONDITION` 1; `M2-08-SLOPE_INTERCEPTS` 1; `M2-08-SQUARE_AREA` 1; `M2-08-TRANSLATION` 1; `M2-08-TRAPEZOID_EQUAL_AREA` 1; `M2-08-VALUE` 1; `M2-09-BISECT_RECTANGLE_SUBJ` 1; `M2-09-EQUATION_GRAPH` 1; `M2-09-PARALLEL_AXIS` 1; `M2-09-POSITIONS_SUBJ` 1; `M2-09-QUADRANT_SIGNS` 1; `M2-09-THREE_LINES_MEET` 1; `M2-10-MOTION_MEET` 1; `M2-10-PRESSURE_DEPTH` 1|
|original/middle/m2/2final|26|`M2-01-RATIONAL_NUMBER_REPEATING_DECIMAL` 2; `M2-08-SIMILARITY` 17; `M2-09-PYTHAGOREAN_THEOREM` 7|
|original/middle/m2/2mid|62|`M2-04-LINEAR_FUNCTION` 2; `M2-05-CIRCUMCENTER_CONST` 1; `M2-05-CIRCUMCENTER_PROP` 2; `M2-05-FOLDED_TAPE` 1; `M2-05-INCENTER_APPLY` 1; `M2-05-INCENTER_AREA` 1; `M2-05-INCENTER_PROP` 1; `M2-05-ISOSCELES_FOLD` 1; `M2-05-ISOSCELES_PROOF` 1; `M2-05-ISOSCELES_PROP` 2; `M2-05-LINEAR_EQUATION_GRAPH` 3; `M2-05-OUT_IN_CENTER` 1; `M2-05-OUT_IN_PERIMETER` 1; `M2-05-OUT_IN_PROP` 1; `M2-05-PARALLELOGRAM_COND` 1; `M2-05-PARALLELOGRAM_PROP` 2; `M2-05-PARALLEL_AREA` 1; `M2-05-PARALLEL_TO_RHOMBUS` 1; `M2-05-QUAD_DIAGONAL` 1; `M2-05-QUAD_PROPERTIES` 1; `M2-05-RHOMBUS_AREA` 1; `M2-05-RIGHT_TRI_CONG` 1; `M2-05-SYSTEM_OF_LINEAR_EQUATIONS_GRAPH` 3; `M2-05-TRI_CONGRUENCE` 1; `M2-06-CIRCUMCENTER_INCENTER` 1; `M2-06-ISOSCELES_TRIANGLE` 2; `M2-06-RIGHT_TRIANGLE_CONGRUENCE` 2; `M2-06-TRIANGLE_CIRCUMCENTER` 2; `M2-06-TRIANGLE_INCENTER` 2; `M2-08-SIMILARITY` 12; `M2-09-CASES_COUNTING` 2; `M2-09-CASES_MULTIPLICATION_RULE` 1; `M2-10-PROBABILITY_ADDITION_RULE` 1; `M2-10-PROBABILITY_DEFINITION_PROPERTIES` 3; `M2-10-PROBABILITY_MULTIPLICATION_RULE` 2|
|original/middle/m3/1final|170|`M3-01-NATURAL_SQUARE_ROOT` 1; `M3-01-RADICAL_ARITHMETIC` 1; `M3-01-SQUARE_ROOT_GEOMETRY` 1; `M3-02-FACTOR_APPLICATION` 1; `M3-02-FACTOR_NUMERICAL` 1; `M3-03-COEFFICIENT_SWAPPED` 1; `M3-03-COMMON_ROOT` 1; `M3-03-COMPLETE_SQUARE_FORM` 1; `M3-03-COMPLETING_SQUARE` 2; `M3-03-COMPLETING_SQUARE_SUBJ` 1; `M3-03-DECIMAL_FRACTION_EQ` 1; `M3-03-DEF` 1; `M3-03-DEFINITION` 1; `M3-03-DISCRIMINANT` 1; `M3-03-DISCRIMINANT_PROBABILITY` 1; `M3-03-DOUBLE_ROOT` 4; `M3-03-DOUBLE_ROOT_PARAM` 1; `M3-03-EVEN_QUAD_FORMULA` 2; `M3-03-FACTORING` 1; `M3-03-GEOMETRIC_APPLICATION` 1; `M3-03-GEOMETRY_APPLICATION` 1; `M3-03-GEOMETRY_SIMILARITY` 1; `M3-03-INVERSE_COEFF_ROOT` 1; `M3-03-PARAMETRIC_ROOTS` 1; `M3-03-PRODUCT_OF_ROOTS` 1; `M3-03-QUADRATIC_DEF` 1; `M3-03-QUADRATIC_FORMULA` 1; `M3-03-QUAD_FORMULA` 3; `M3-03-QUAD_FORMULA_SUBJ` 1; `M3-03-QUAD_QUADRANT_APP` 1; `M3-03-RATIONAL_ROOTS` 2; `M3-03-ROOTS_COEFFICIENTS` 1; `M3-03-ROOTS_GIVEN` 1; `M3-03-ROOTS_RELATION` 1; `M3-03-ROOT_RATIO` 1; `M3-03-ROOT_SUBSTITUTION` 2; `M3-03-SOLUTION_CHECK` 1; `M3-03-SOLVE_FACTORING` 1; `M3-03-SQUARE_ROOT` 1; `M3-03-SQUARE_ROOT_METHOD` 2; `M3-03-SUBSTITUTION_METHOD` 1; `M3-03-SUBSTITUTION_SOLVE` 1; `M3-03-WORD_PROBLEM` 1; `M3-03-WORD_PROBLEM_DISTRIBUTION` 1; `M3-03-WORD_PROBLEM_GEOMETRY` 2; `M3-03-WORD_PROBLEM_GRID` 1; `M3-03-WORD_PROBLEM_MOTION` 1; `M3-03-WORD_PROBLEM_NUMBER` 2; `M3-04-FRAME_AREA` 1; `M3-04-FUNCTION_IDENTIFICATION` 2; `M3-04-FUNCTION_VALUE` 1; `M3-04-GEOMETRY` 1; `M3-04-GEOMETRY_PROBLEM` 1; `M3-04-GOLDEN_TRIANGLE` 1; `M3-04-GRAPH_INTERSECTION` 1; `M3-04-GRAPH_PROPERTIES` 1; `M3-04-GRAPH_TRIANGLE_AREA` 1; `M3-04-GRAPH_WIDTH` 1; `M3-04-INCREASING_INTERVAL` 1; `M3-04-NUMBER_PROBLEM` 1; `M3-04-PARABOLA_AREA_SYMMETRY` 1; `M3-04-QUADRATIC_MAX_MIN` 1; `M3-04-TRANSLATION_POINT` 1; `M3-04-TRANSLATION_PROPERTIES` 1; `M3-04-TRANSLATION_Y_INTERCEPT` 1; `M3-04-VERTEX_FORM` 1; `M3-04-VERTEX_FORM_GRAPH` 1; `M3-04-VERTEX_ON_LINE` 1; `M3-05-AXIS_VERTEX` 1; `M3-05-BASIC_GRAPH_PROPERTIES` 2; `M3-05-COEFFICIENT_GRAPH` 1; `M3-05-COEFF_RELATION_EVAL` 1; `M3-05-DETERMINE_EQUATION` 1; `M3-05-DOUBLE_OPTIMIZATION` 1; `M3-05-EQUATION_FROM_CONDITIONS` 1; `M3-05-EQUATION_FROM_GRAPH` 1; `M3-05-FORM_EQUIVALENCE` 1; `M3-05-FUNCTION_VALUE` 1; `M3-05-FUNC_VAL` 2; `M3-05-GENERAL_FORM_PROPERTIES` 1; `M3-05-GEOMETRIC_MAX_MIN` 2; `M3-05-GEOMETRIC_RATIO_POINT` 1; `M3-05-GRAPH_LENGTH_RATIO` 1; `M3-05-GRAPH_TO_EQUATION` 1; `M3-05-HORIZONTAL_TRANSLATION` 1; `M3-05-INCREASING_INTERVAL` 1; `M3-05-LINE_SEGMENT_MIN` 1; `M3-05-MAX_MIN` 2; `M3-05-MAX_MIN_EVAL` 1; `M3-05-MAX_MIN_SUM` 1; `M3-05-MAX_MIN_UNKNOWN` 1; `M3-05-MAX_QUADRANT_SUBJ` 1; `M3-05-MIN_UNKNOWN` 1; `M3-05-ORIGIN_VERTEX` 2; `M3-05-PARABOLA_WIDTH` 2; `M3-05-POINT_K_DIFF_SUBJ` 1; `M3-05-POINT_ON_GRAPH` 1; `M3-05-PROPERTIES` 3; `M3-05-PROPERTIES_COMPREHENSIVE` 1; `M3-05-QUADRANT_TRAVERSAL` 1; `M3-05-QUADRATIC_FUNC_DEF` 2; `M3-05-QUAD_FUNC_DEF` 2; `M3-05-RATIO_COORDINATES` 1; `M3-05-SIGN_DETERMINATION` 1; `M3-05-SIGN_GRAPH` 1; `M3-05-SIGN_OF_COEFF` 2; `M3-05-STANDARD_FORM` 1; `M3-05-STANDARD_FORM_COMPLETE` 1; `M3-05-STANDARD_FORM_PARAM` 1; `M3-05-STANDARD_TRANSFORM_PARAM` 1; `M3-05-SYMMETRY_POINT_SOLVE` 1; `M3-05-THREE_POINTS_FORMULA` 1; `M3-05-TRANSLATION` 1; `M3-05-TRANSLATION_AMOUNTS` 1; `M3-05-TRANSLATION_BASIC` 1; `M3-05-TRANSLATION_CONGRUENCE` 1; `M3-05-TRANSLATION_MAX` 1; `M3-05-TRANSLATION_POINT_SOLVE` 2; `M3-05-TRANSLATION_POINT_SUBJ` 1; `M3-05-TRAPEZOID_AREA` 1; `M3-05-TRIANGLE_AREA` 2; `M3-05-TRIANGLE_AREA_INTERCEPT` 1; `M3-05-TRIANGLE_AREA_PARAM` 1; `M3-05-TWO_AXIS_TRANSLATION` 2; `M3-05-VALUE` 1; `M3-05-VERTEX_AND_POINT` 2; `M3-05-VERTEX_ON_AXIS` 1; `M3-05-VERTEX_ON_LINE` 1; `M3-05-VERTEX_QUADRANT_CONDITION` 1; `M3-05-WIDTH_COMPARISON` 1; `M3-05-WORD_PROBLEM_PHYSICS` 1; `M3-05-X_INTERCEPT_DISTANCE` 1; `M3-05-X_INTERCEPT_MIN` 1; `M3-06-MAX_MIN_HEIGHT` 1; `M3-07-CENTRAL_TENDENCY` 1; `M3-07-COMPUTE_ALL` 1; `M3-07-CONCEPTS` 1; `M3-07-CONSISTENCY_COMPARISON` 1; `M3-07-LINEAR_TRANSFORM` 1; `M3-07-TABLE_INTERPRETATION` 1; `M3-07-THREE_INTEGERS_VARIANCE` 1; `M3-07-VARIANCE_FROM_CONDITIONS` 1|
|original/middle/m3/1mid|140|`M3-01-01` 1; `M3-01-02` 1; `M3-01-03` 1; `M3-01-04` 1; `M3-01-05` 1; `M3-01-06` 1; `M3-01-08` 1; `M3-01-09` 1; `M3-01-10` 1; `M3-01-11` 1; `M3-01-13` 1; `M3-01-COMPARE` 6; `M3-01-INT_FRAC_PART` 1; `M3-01-IRRATIONAL` 3; `M3-01-RATIONALIZE` 3; `M3-01-REAL_NUMBER_APPROX` 6; `M3-01-REAL_NUM_LINE` 3; `M3-01-ROOT_ADD_SUB` 2; `M3-01-ROOT_CALC` 3; `M3-01-ROOT_GEOMETRY` 2; `M3-01-ROOT_TRANS` 1; `M3-01-SQRT_APPROX` 1; `M3-01-SQRT_DEF` 3; `M3-01-SQRT_GRID` 1; `M3-01-SQRT_PROP` 4; `M3-01-SQRT_TABLE` 3; `M3-01-SQUARE_MAKE` 3; `M3-01-SQUARE_ROOT_BASIC` 3; `M3-01-SQUARE_ROOT_OPERATIONS` 6; `M3-02-07` 1; `M3-02-12` 1; `M3-02-14` 1; `M3-02-15` 1; `M3-02-16` 1; `M3-02-COMMON_FACTOR` 2; `M3-02-EXPAND_APPLY` 2; `M3-02-EXPAND_COEFF` 2; `M3-02-EXPAND_FORMULA` 3; `M3-02-FACTOR_APPLY` 2; `M3-02-FACTOR_CROSS` 4; `M3-02-FACTOR_FORMULA` 1; `M3-02-FACTOR_GEOMETRY` 2; `M3-02-FACTOR_MISTAKE` 1; `M3-02-FACTOR_QUAD` 1; `M3-02-PERFECT_SQUARE` 4; `M3-02-RADICAL_EXPRESSION_OPERATION` 6; `M3-03-17` 1; `M3-03-18` 1; `M3-03-19` 1; `M3-03-20` 1; `M3-03-21` 1; `M3-03-22` 1; `M3-03-23` 1; `M3-03-24` 1; `M3-03-25` 1; `M3-03-26` 1; `M3-03-APPLY` 1; `M3-03-DEF` 1; `M3-03-DOUBLE_ROOT` 1; `M3-03-POLYNOMIAL_MULTIPLICATION_FACTORIZATION` 21; `M3-03-QUADRATIC_EQUATION_BASIC` 2; `M3-03-QUAD_FORMULA` 2; `M3-03-ROOT_GIVEN` 1; `M3-03-SQRT_SOLVE` 1|
|original/middle/m3/2final|25|`RAW-삼각비` 10; `RAW-삼각비의 활용` 3; `RAW-원의 성질` 5; `RAW-원의 접선` 3; `RAW-원주각` 2; `RAW-일차함수` 1; `RAW-정다각형과 원` 1|
|similar/middle/m1/1final|20|`M1-04-COORDINATES_AND_GRAPH` 3; `M1-04-GRAPH_INTERPRETATION` 1; `M1-04-PROPORTION` 16|
|similar/middle/m1/1mid|40|`M1-02-CALCULATION` 36; `M1-02-INTEGER_RATIONAL_OPERATION` 4|
|similar/middle/m1/2mid|17|`M1-06-CIRCLE_SECTOR` 5; `M1-06-PLANE_FIGURE` 9; `M1-07-POLYHEDRON` 1; `M1-08-REPRESENTATIVE_VALUE` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_교재완결_P158-160_20261023_유사50.js|13|`H22-C2-01-ANGLE-BISECTOR` 2; `H22-C2-01-RHOMBUS-DISTANCE` 2; `H22-C2-04-ARC-TRANSLATION-AREA` 3; `H22-C2-04-CIRCLE-TRANSLATION-REFLECTION-TANGENCY` 3; `H22-C2-05-TWO-GRADE-SET-COUNT` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P78-81_20261022_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P82-85_20261022_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P86-89_20261022_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P90-93_20261022_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P94-97_20261023_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P98-101_20261023_유사50.js|50|`H22-C2-04-TRANSFORMATION` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_집합_P102-105_20261023_유사50.js|50|`H22-C2-04-TRANSFORMATION` 15; `H22-C2-05-SET-BASICS` 21; `H22-C2-05-SET-SUBSETS` 14|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P18-21_20261024_유사50.js|50|`H22-C2-06-AM-GM-FRACTION` 12; `H22-C2-06-AM-GM-GEOMETRY` 14; `H22-C2-06-FOCUS-QUANTIFIERS` 12; `H22-C2-06-INEQ-PARAM` 12|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P26-29_20261025_유사50.js|50|`H22-C2-06-ABS-PARAM-SUM` 2; `H22-C2-06-AM-GM-FRACTION-DESCRIPTIVE` 2; `H22-C2-06-AM-GM-GEOMETRY-TRIANGLE` 2; `H22-C2-06-AM-GM-LINE` 2; `H22-C2-06-AM-GM-SQUARE` 2; `H22-C2-06-CONTRAPOSITIVE-DESCRIPTIVE` 2; `H22-C2-06-CONTRAPOSITIVE-PARAM-MIN` 3; `H22-C2-06-CONVERSE-CONTRAPOSITIVE` 3; `H22-C2-06-DECISION-TREE-FLOWCHART` 2; `H22-C2-06-INCLUSION-EVAL` 3; `H22-C2-06-LOGIC-PUZZLE` 3; `H22-C2-06-NECESSARY-NOT-SUFFICIENT` 3; `H22-C2-06-QUADRATIC-QUANTIFIER` 3; `H22-C2-06-QUANTIFIER-RANGE` 3; `H22-C2-06-RANKING-LOGIC` 2; `H22-C2-06-SET-OPERATION-EQUIV` 3; `H22-C2-06-SYLLOGISM-CHAIN` 2; `H22-C2-06-SYLLOGISM-INCLUSION` 2; `H22-C2-06-TRUTH-SET-COUNT` 3; `H22-C2-06-TRUTH-VALUE` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js|50|`H22-C2-P152-Q01` 3; `H22-C2-P152-Q02` 3; `H22-C2-P152-Q03` 3; `H22-C2-P152-Q04` 3; `H22-C2-P152-Q05` 3; `H22-C2-P152-Q06` 3; `H22-C2-P153-Q07` 3; `H22-C2-P153-Q08` 3; `H22-C2-P153-Q09` 3; `H22-C2-P153-Q10` 3; `H22-C2-P153-Q11` 2; `H22-C2-P154-Q12` 2; `H22-C2-P154-Q13` 2; `H22-C2-P154-Q14` 2; `H22-C2-P154-Q15` 2; `H22-C2-P154-Q16` 2; `H22-C2-P155-Q17` 2; `H22-C2-P155-Q18` 2; `H22-C2-P155-Q19` 2; `H22-C2-P155-Q20` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의5회_P156-159_20261023_유사50.js|50|`H22-C2-P156-Q01` 3; `H22-C2-P156-Q02` 3; `H22-C2-P156-Q03` 3; `H22-C2-P156-Q04` 3; `H22-C2-P156-Q05` 3; `H22-C2-P156-Q06` 3; `H22-C2-P157-Q07` 3; `H22-C2-P157-Q08` 3; `H22-C2-P157-Q09` 3; `H22-C2-P157-Q10` 3; `H22-C2-P157-Q11` 2; `H22-C2-P158-Q12` 2; `H22-C2-P158-Q13` 2; `H22-C2-P158-Q14` 2; `H22-C2-P158-Q15` 2; `H22-C2-P158-Q16` 2; `H22-C2-P159-Q17` 2; `H22-C2-P159-Q18` 2; `H22-C2-P159-Q19` 2; `H22-C2-P159-Q20` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_P50-53_20261022_유사50.js|3|`H22-C2-03-COMMON_TANGENT` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js|50|`H22-C3-02-FOCUS-ASYMPTOTE-RECTANGLE-PERIMETER` 4; `H22-C3-02-FOCUS-ASYMPTOTE-RECTANGLE-PERIMETER-COEFF2` 4; `H22-C3-02-FOCUS-AXES-RECTANGLE-OAPB-PERIMETER` 4; `H22-C3-02-FOCUS-DOMAIN-RANGE-BOUNDS` 5; `H22-C3-02-FOCUS-INTERVAL-MAX-MIN-ENDPOINT` 5; `H22-C3-02-FOCUS-INTERVAL-MAX-MIN-NUMERATOR` 5; `H22-C3-02-FOCUS-INVERSE-COMMON-POINT-DIFF` 5; `H22-C3-02-FOCUS-INVERSE-COMMON-POINT-SUM` 5; `H22-C3-02-FOCUS-INVERSE-INTERSECTION-PRODUCT` 5; `H22-C3-02-WHAT-HOW-TRANSLATION-COEFFICIENTS` 4; `H22-C3-02-WHAT-HOW-TRANSLATION-VECTOR` 4|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P106-109_20261023_유사50.js|50|`H22-C2-05-INTERMEDIATE-SUBSETS` 3; `H22-C2-05-SET-EQUALITY` 6; `H22-C2-05-SET-INCLUSION` 3; `H22-C2-05-SET-MEMBERSHIP` 3; `H22-C2-05-SET-OPERATIONS` 29; `H22-C2-05-SET-PARAMETER-INCLUSION` 3; `H22-C2-05-SUBSET-COUNT` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P110-113_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P114-117_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P118-121_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P122-125_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P126-129_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P130-133_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P134-137_20261023_유사50.js|50|`H22-C2-05-SET-OPERATIONS` 50|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50.js|50|`H22-C2-01-LINE-EQUIDISTANT-BISECTOR-AREA` 2; `H22-C2-01-LINE-PERP-PARALLEL` 3; `H22-C2-01-LINE-TRANSLATION-REFLECTION` 2; `H22-C2-05-CIRCLE-CHORD-LINE` 3; `H22-C2-05-CIRCLE-QUARTER-LINES` 3; `H22-C2-05-CIRCLE-TANGENT-SLOPES` 3; `H22-C2-05-CIRCLE-TRANSLATION` 3; `H22-C2-05-EXAM-AND-SET` 3; `H22-C2-05-SET-INCLUSION-EXCLUSION` 2; `H22-C2-05-SET-OPERATIONS` 9; `H22-C2-05-SET-SUBSET-COUNT` 3; `H22-C2-GEOMETRY-P142-Q14` 2; `H22-C2-GEOMETRY-P142-Q16` 2; `H22-C2-GEOMETRY-P143-Q17` 2; `H22-C2-GEOMETRY-P143-Q18` 2; `H22-C2-GEOMETRY-P143-Q20` 2; `H22-C2-SET-P142-Q15` 2; `H22-C2-SET-P143-Q19` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P142-145_20261023_유사50.js|50|`H22-C2-P144-Q01` 3; `H22-C2-P144-Q02` 3; `H22-C2-P144-Q03` 3; `H22-C2-P144-Q04` 3; `H22-C2-P144-Q05` 3; `H22-C2-P144-Q06` 3; `H22-C2-P145-Q07` 3; `H22-C2-P145-Q08` 3; `H22-C2-P145-Q09` 3; `H22-C2-P145-Q10` 3; `H22-C2-P145-Q11` 2; `H22-C2-P146-Q12` 2; `H22-C2-P146-Q13` 2; `H22-C2-P146-Q14` 2; `H22-C2-P146-Q15` 2; `H22-C2-P146-Q16` 2; `H22-C2-P147-Q17` 2; `H22-C2-P147-Q18` 2; `H22-C2-P147-Q19` 2; `H22-C2-P147-Q20` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P146-149_20261023_유사50.js|50|`H22-C2-P148-Q01` 3; `H22-C2-P148-Q02` 3; `H22-C2-P148-Q03` 3; `H22-C2-P148-Q04` 3; `H22-C2-P148-Q05` 3; `H22-C2-P148-Q06` 3; `H22-C2-P149-Q07` 3; `H22-C2-P149-Q08` 3; `H22-C2-P149-Q09` 3; `H22-C2-P149-Q10` 3; `H22-C2-P149-Q11` 2; `H22-C2-P150-Q12` 2; `H22-C2-P150-Q13` 2; `H22-C2-P150-Q14` 2; `H22-C2-P150-Q15` 2; `H22-C2-P150-Q16` 2; `H22-C2-P151-Q17` 2; `H22-C2-P151-Q18` 2; `H22-C2-P151-Q19` 2; `H22-C2-P151-Q20` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P30-33_20261025_유사50.js|50|`H22-C2-06-AMGM-GEOMETRIC-SQUARES` 2; `H22-C2-06-AMGM-PRODUCT-EXPANSION` 2; `H22-C2-06-AMGM-RECIPROCAL-SQUARE` 2; `H22-C2-06-AMGM-SUBSTITUTION-NONNEGATIVE` 2; `H22-C2-06-CONTRAPOSITIVE-QUADRATIC-RAYS` 3; `H22-C2-06-CONVERSE-FALSE-CONTRAPOSITIVE-TRUE` 3; `H22-C2-06-INEQUALITY-PARAM-RANGE` 3; `H22-C2-06-LOGIC-FOUR-PERSON-ALLOCATION` 2; `H22-C2-06-NECESSARY-SUFFICIENT-LOGIC` 2; `H22-C2-06-QUADRATIC-ABS-NESTED-IMPLICATION` 2; `H22-C2-06-QUANTIFIER-NEGATION` 3; `H22-C2-06-QUANTIFIER-QUADRATIC-LINEAR` 2; `H22-C2-06-QUANTIFIER-SET-IMPLICATION` 2; `H22-C2-06-SET-OPERATIONS-EQUIVALENCE` 2; `H22-C2-06-THREE-IMPLICATIONS-SET-LOGIC` 6; `H22-C2-06-TWO-VARIABLE-NECESSARY-SUFFICIENT` 3; `H22-C2-06-VARIANT-IMPLICATION_COUNTEREXAMPLE_REGION` 3; `H22-C2-06-VARIANT-SET_INCLUSION_IMPLICATION_CONTRAPOSITIVE` 3; `H22-C2-06-VARIANT-TRUE_STATEMENT_COUNTEREXAMPLE` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P34-37_20261025_유사50.js|50|`H22-C2-06-MOCK-QUANTIFIERS-QUADRATIC` 9; `H22-C2-06-VARIANT-NECESSARY-QUADRATIC-ROOTSET` 8; `H22-C2-06-VARIANT-PARALLEL-AMGM` 8; `H22-C2-06-VARIANT-PERPENDICULAR-AMGM` 8; `H22-C2-06-VARIANT-QUANTIFIERS-TWO-BRANCHES` 9; `H22-C2-06-VARIANT-SET-INCLUSION-NATURAL-PARAMETERS` 8|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js|50|`H22-C3-01-FOCUS-ABS-ONE-TO-ONE-INTERVAL` 5; `H22-C3-01-FOCUS-ABS-ONE-TO-ONE-RANGE` 5; `H22-C3-01-FOCUS-ABS-ONE-TO-ONE-SLOPE` 5; `H22-C3-01-FOCUS-QUADRATIC-COMPOSITE-COUNT` 5; `H22-C3-01-FOCUS-QUADRATIC-COMPOSITE-ROOTS` 5; `H22-C3-01-FOCUS-QUADRATIC-GRAPH-COMPOSITE-SUM` 5; `H22-C3-01-WHAT-HOW-COMMUTATIVE-COMPOSITION` 5; `H22-C3-01-WHAT-HOW-COMMUTATIVE-SUM` 5; `H22-C3-01-WHAT-HOW-EQUAL-FUNCTIONS` 5; `H22-C3-01-WHAT-HOW-EQUAL-FUNCTIONS-COEFF` 5|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P62-65_20261026_유사50.js|50|`H22-C3-01-COMPOSITE-COMMUTATIVE-MAX-PARAM` 3; `H22-C3-01-COMPOSITE-DISCRETE-GRAPH` 3; `H22-C3-01-COMPOSITE-EQUATION-MIN-VALUE` 2; `H22-C3-01-COMPOSITE-INVERSE-ARROW-DIAGRAM` 3; `H22-C3-01-COMPOSITE-NATURAL-PIECEWISE` 3; `H22-C3-01-COMPOSITE-QUADRATIC-RANGE` 3; `H22-C3-01-CURRENCY-EXCHANGE-FUNCTION` 2; `H22-C3-01-EQUAL-FUNCTIONS-SUBSET-COUNT` 2; `H22-C3-01-FUNCTION-DEFINITION-BOOLEAN` 2; `H22-C3-01-FUNCTIONAL-EQUATION-CAUCHY-EXP` 2; `H22-C3-01-INVERSE-AREA-BETWEEN-CURVES` 3; `H22-C3-01-INVERSE-COMPOSITE-TRACE-GRAPH` 3; `H22-C3-01-INVERSE-SELF-INVOLUTION-LINEAR` 2; `H22-C3-01-ITERATED-COMPOSITE-TENT-MAP` 3; `H22-C3-01-LINEAR-BIJECTION-PARAM-MAX` 2; `H22-C3-01-PIECEWISE-INVERSE-VALUE` 3; `H22-C3-01-RECURSIVE-PIECEWISE-PERIODIC` 3; `H22-C3-01-RESTRICTED-DOMAIN-QUADRATIC-INVERSE` 3; `H22-C3-01-RESTRICTED-LINEAR-RANGE-SLOPE` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P66-69_20261026_유사50.js|50|`H22-C3-01-ABS-LINEAR-INVERSE-EXISTENCE-PARAM` 3; `H22-C3-01-BIJECTION-COMPOSITE-LINEAR-RELATION` 2; `H22-C3-01-COMPOSITE-INVERSE-EXPRESSION-PARAM` 3; `H22-C3-01-COMPOSITE-LINEAR-EQUATIONS-DIFFERENCE` 1; `H22-C3-01-COMPOSITE-LINEAR-EQUATIONS-SUM` 1; `H22-C3-01-COMPOSITE-ROOTS-COUNT-PIECEWISE` 3; `H22-C3-01-CYCLE-INVERSE-COMPOSITION-EVAL` 3; `H22-C3-01-DISCRETE-GRAPH-INVERSE-POWER-SUM` 3; `H22-C3-01-EQUAL-FUNCTIONS-COEFFICIENTS-SQUARES-SUM` 2; `H22-C3-01-FINITE-SET-BIJECTION-DIFFERENCE-RELATION` 3; `H22-C3-01-GRAPH-INJECTION-BIJECTION-COUNT` 2; `H22-C3-01-IDENTITY-CONSTANT-FUNCTION-SUM` 2; `H22-C3-01-INJECTIVE-FUNCTION-EVEN-SUM-COUNT` 2; `H22-C3-01-INJECTIVE-FUNCTION-ODD-SUM-COUNT` 1; `H22-C3-01-INVERSE-CURVES-LINE-SEGMENT-MIN` 3; `H22-C3-01-INVERSE-RELATION-SUBSTITUTION-EVAL` 2; `H22-C3-01-MULTIPLE-INDICATOR-FUNCTION-SUM` 3; `H22-C3-01-PIECEWISE-RESTRICTED-BIJECTION-PARAM` 3; `H22-C3-01-SYMMETRY-PIECEWISE-COMPOSITE-BOOLEAN` 2; `H22-C3-01-TENT-MAP-ITERATED-IDENTITY-SET-SUM` 3; `H22-C3-01-THREE-PIECEWISE-ITERATED-COMPOSITION` 3|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P70-73_20261030_유사50.js|50|`H22-C3-01-MOCK-COMPOSITE-ASSOCIATIVITY-LINEAR` 6; `H22-C3-01-MOCK-COMPOSITE-FIXED-POINT-EQUATION` 6; `H22-C3-01-MOCK-PIECEWISE-CONSTANT-FUNCTION` 6; `H22-C3-01-MOCK-PIECEWISE-QUADRATIC-BIJECTION` 7; `H22-C3-01-VARIANT-COMPOSITE-ASSOCIATIVITY-QUADRATIC` 6; `H22-C3-01-VARIANT-COMPOSITE-FIXED-POINT-SUM` 6; `H22-C3-01-VARIANT-PIECEWISE-BIJECTION-INTEGER-MIN` 7; `H22-C3-01-VARIANT-PIECEWISE-IDENTITY-FUNCTION` 6|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P42-45_20261025_유사50.js|50|`H22-C3-01-ASSOCIATIVE-COMPOSITION` 2; `H22-C3-01-COMMUTATIVE-COMPOSITION` 2; `H22-C3-01-COMPOSITE-ONE-TO-ONE` 2; `H22-C3-01-COMPOSITE-VALUE` 2; `H22-C3-01-COUNT-FUNCTIONS-COND` 3; `H22-C3-01-DEF-FUNCTION` 2; `H22-C3-01-DOMAIN-RANGE` 4; `H22-C3-01-EQUAL-FUNCTIONS` 3; `H22-C3-01-GRAPH-COMPOSITE-TRACE` 2; `H22-C3-01-GRAPH-JUDGMENT` 3; `H22-C3-01-IDENTITY-CONSTANT-FUNCTION` 3; `H22-C3-01-INVERSE-EXISTENCE-QUADRATIC` 2; `H22-C3-01-INVERSE-LINE-PARAM` 2; `H22-C3-01-INVERSE-VALUE-PIECEWISE` 2; `H22-C3-01-ONE-TO-ONE-CORRESPONDENCE` 3; `H22-C3-01-ONE-TO-ONE-INTERVAL-PARAM` 3; `H22-C3-01-PIECEWISE-VALUE` 3; `H22-C3-01-RECURSIVE-COND-VALUE` 3; `H22-C3-01-REPEATED-COMPOSITION-CYCLE` 2; `H22-C3-01-SOLVE-COMPOSITE-EQUATION` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P46-49_20261025_유사50.js|50|`H22-C3-01-ASSOCIATIVE-COMPOSITION-DIRECT` 2; `H22-C3-01-COMMUTATIVE-COMPOSITION-SLOPE` 2; `H22-C3-01-COMPOSITE-INVERSE-COMMUTATIVE` 3; `H22-C3-01-COMPOSITE-ONE-TO-ONE-DEDUCE` 2; `H22-C3-01-COMPOSITE-VALUE-PARITY` 2; `H22-C3-01-DEF-FUNCTION` 3; `H22-C3-01-DOMAIN-RANGE-DIVISORS` 3; `H22-C3-01-EQUAL-FUNCTIONS` 3; `H22-C3-01-FUNCTIONAL-EQ-VALUE` 3; `H22-C3-01-GRAPH-INVERSE-TRACE` 3; `H22-C3-01-GRAPH-JUDGMENT-ONE-TO-ONE` 3; `H22-C3-01-GRAPH-JUDGMENT-VERTICAL` 3; `H22-C3-01-IDENTITY-CONSTANT-ONE-TO-ONE` 2; `H22-C3-01-INVERSE-EXPANSION-VALUE` 3; `H22-C3-01-INVERSE-GRAPH-ENCLOSED-AREA` 3; `H22-C3-01-ODD-FUNCTION-ONE-TO-ONE-COUNT` 2; `H22-C3-01-ONE-TO-ONE-SLOPE-CONDITION` 3; `H22-C3-01-PIECEWISE-VALUE` 3; `H22-C3-01-SOLVE-COMPOSITE-EQ-LINEAR` 2|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P50-53_20261025_유사50.js|50|`H22-C3-01-COMPOSITE-INVERSE-COEFF-RATIO` 3; `H22-C3-01-COMPOSITE-INVERSE-VALUE` 3; `H22-C3-01-FOCUS-COUNT-FUNCTIONS-INVERSE-FIXED` 3; `H22-C3-01-FOCUS-COUNT-FUNCTIONS-PARTIAL-SUM` 3; `H22-C3-01-FOCUS-COUNT-FUNCTIONS-SUM` 3; `H22-C3-01-FOCUS-FINITE-SET-VALUE` 4; `H22-C3-01-FOCUS-IDENTITY-CONSTANT-VALUE` 3; `H22-C3-01-FOCUS-ONE-TO-ONE-COMPOSITION` 3; `H22-C3-01-GRAPH-COMPOSITE-TRACE` 4; `H22-C3-01-GRAPH-INVERSE-TRACE` 4; `H22-C3-01-INVERSE-EXISTENCE-ABS` 3; `H22-C3-01-INVERSE-GRAPH-ENCLOSED-AREA` 3; `H22-C3-01-INVERSE-LINEAR-COEFF` 3; `H22-C3-01-MAPPING-DIAGRAM-INVERSE` 4; `H22-C3-01-REPEATED-COMPOSITION-CYCLE` 4|
|textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P58-61_20261026_유사50.js|50|`H22-C3-01-MOCK-COUNT-FUNCTIONS-SURJECTION` 3; `H22-C3-01-MOCK-DEF-DOMAIN-RANGE` 4; `H22-C3-01-MOCK-EQUAL-FUNCTIONS-SUBSET` 3; `H22-C3-01-MOCK-GRAPH-TRANSLATION-VALUE` 4; `H22-C3-01-MOCK-IDENTITY-PIECEWISE-ROOTS` 3; `H22-C3-01-MOCK-MAPPING-MATRIX-SUM` 4; `H22-C3-01-MOCK-ONE-TO-ONE-CORRESP-QUADRATIC` 3; `H22-C3-01-MOCK-ONE-TO-ONE-QUADRATIC-RANGE` 3; `H22-C3-01-MOCK-RANGE-MAX-MIN-SUM` 4; `H22-C3-01-MOCK-RECURSIVE-PARITY-VALUE` 3; `H22-C3-01-WHAT-HOW-INVERSE-AXIS-PARAM` 4; `H22-C3-01-WHAT-HOW-INVERSE-INTERSECT-DIST` 4; `H22-C3-01-WHAT-HOW-INVERSE-INTERSECT-PARAM` 4; `H22-C3-01-WHAT-HOW-INVERSE-PIECEWISE` 4|

경로와 단원 키 학년 불일치: 83행. 고등 선택과목은 고2/고3 공용 범위를 인정하고 H1 명시 단원과 중등 학년 충돌만 기계 판별한다. 표본10:

- `qid_v1_01b0bc1a508291450f52eed0e633ed44dcddd702a2272358827120085ed5d8d6` / `types/middle/m3/이차방정식_중3_유형_3월모의고사.js#3` / `H22-C-04` / path=M3, unit=H1
- `qid_v1_05219da57f59d9bcd41a8098f3879fd7989080775190e72ae73e8d3dc4fdd34a` / `original/middle/m1/2mid/25_팔마중_2학기_중간_중1_기출.js#17` / `M2-05` / path=M1, unit=M2
- `qid_v1_05e0a4b23f0c7b387c4cb8e407cbfe8a6eadd8ea521562c9fd0ebecff059b812` / `types/middle/m3/이차함수_중3_유형_3월모의고사.js#8` / `H22-C-05` / path=M3, unit=H1
- `qid_v1_08334eac5b9e532bc0a8973726b60f751ea0bb9a5a87d6f12f6dfcf657e13cb4` / `original/middle/m2/1mid/26_동산중_1학기_중간_중2_기출.js#23` / `M1-07` / path=M2, unit=M1
- `qid_v1_08a7bfd0752e4cc3849cf842a70992d6aac1b0206608a51fde906039be09e355` / `original/middle/m3/2mid/19_동산중_2학기_중간_중3_수학.js#20` / `M1-07` / path=M3, unit=M1
- `qid_v1_090b479c36d9d7e93341e28ddb9d1bae040c7aa989b5b42fdaf68ca94131f3bf` / `original/middle/m3/2mid/19_이수중_2학기_중간_중3_수학.js#13` / `M2-07` / path=M3, unit=M2
- `qid_v1_090bcf4556815e3b0e2c509c9c30263a35845d031ffae8fc45d4310323e8fca8` / `original/middle/m3/2mid/19_이수중_2학기_중간_중3_수학.js#9` / `M2-07` / path=M3, unit=M2
- `qid_v1_0cdaa331e87ee5bbf5b23520251ff5f81e385a4305e17de19800ec1b3ca0a020` / `original/middle/m3/2mid/19_이수중_2학기_중간_중3_수학.js#12` / `M2-07` / path=M3, unit=M2
- `qid_v1_0d4243828ae864211f7ad293fd342424baa6c3e5f739054e7923a32d575089e8` / `original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js#19` / `M2-08` / path=M1, unit=M2
- `qid_v1_0fb50cd6de86e5a5b5ffbcd3d3b65f01548598bafefafef4194310a0b74f0512` / `original/middle/m3/2mid/19_동산중_2학기_중간_중3_수학.js#18` / `M1-07` / path=M3, unit=M1

### 검증·선택 사항·NOT_RUN

- 신규 및 기존 관련 테스트30/30 PASS. 독립 검토 재확인11/11 PASS, diff --check PASS. 실제 CLI exit0.
- 독립 검토에서 발견한 미관측 과목 교차교육과정 우회, 다른 고등 과목 별칭 혼합, EXACT 근거행 덮어쓰기를 수정하고 회귀로 고정했다.
- 기존 테스트의 인접 단원 임의 확장/과목 별칭 거부 기대는 최신 지시의 단일 넓은 후보/NEEDS_BINDING으로 바꾸었다. PT/TPL ACTIVE·부모·증거·UID·외부 경로 검사는 삭제하거나 완화하지 않았다.
- 3단계의 승인 기준은 기존 대표문항 추출과 같은 `fieldStatus.problemType`의 approved 계열이다. 유형 필드의 승인 증거이며 문항 전체 독립 QA를 의미하지 않는다.
- 현재 같은 단원 소단원 확장에는 주어진 네 종류 중 ALIAS를 쓰되 UNIT_WIDE 근거를 붙였다. 이는 정확 연결/승인으로 승격하지 않는 보수 선택이다.
- 전체 suite, 원격 CI, 브라우저·운영 등록·배포·실제 모델 유형 판정은 NOT_RUN. main 병합/PR 생성/운영 metadata/registry/crosswalk/4칸/봉인/기존 receipt 수정 없음.
- 변경파일: options.mjs/common.mjs/check-ledger.mjs, 새 alias-evidence.mjs/course-aliases.json/generate-course-aliases.mjs/units.mjs, 관련 테스트4개. 모든 출력·판정 실측 JSON은 저장소 밖이며 Git에는 도구/도구용 증거표/테스트만 올렸다.
