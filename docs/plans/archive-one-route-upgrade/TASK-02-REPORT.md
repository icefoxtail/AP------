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
