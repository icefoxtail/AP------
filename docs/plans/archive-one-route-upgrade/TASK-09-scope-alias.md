# 작업 9 — 과목·단원 표기 차이를 받아들이는 공용 조회 (사용자 지시 2026-11-16)

## 왜

사용자 지시: "항상 넓은 방식. 모든 문제를 활용 가능하게." "(과목 표기가 제각각인) 이런 것도 다 포용하게 만들면 되지."

작업 2 조사에서, 같은 과목이 정본에 `중2 수학`, `중2-1`, `중2`, `중학교 2학년`, `중2수학`, `M3`, `수학`, 빈 값 등으로 흩어져 있고, 이 표기 차이 때문에 유형 연결 행 조회가 실패해 문항이 "연결 없음"으로 떨어지는 것이 확인됐다. 표기를 한꺼번에 고쳐 쓰는 것(값 정규화)은 봉인·영수증·해시가 얽혀 위험하고 오래 걸린다. 그래서 **읽는 쪽이 표기 차이를 받아들이게** 한다: 데이터는 그대로 두고, 조회할 때 같은 과목·같은 단원으로 알아본다.

## 어디에 쓰나

브랜치 `feat/scope-alias-20261116`(최신 `main`에서), 보고 `TASK-09-REPORT.md`. 작업 2의 수정 요청(`FEEDBACK-02.md` 1절)에서 만든 과목 표기 묶음 표가 있으면 그것을 출발점으로 삼는다(브랜치가 다르면 내용을 옮기고 보고서에 "작업 2 병합 뒤 한 곳으로 합칠 것"을 적는다).

## 먼저 조사할 것 (보고서 1절)

1. 과목·교육과정·단원으로 조회하다가 표기 차이로 실패할 수 있는 곳을 모두 찾는다. 후보: 등록기 `reviewed-exam-registration-v2.mjs`의 `resolve()`(1713~1724행, `compactCourse`와 `courseAliasAllowed`가 이미 일부 별칭을 받는다 — 무엇을 받고 무엇을 못 받는지), `rpm-active-resolver.mjs`, `active-registry.mjs`의 `curriculumForQuestion`·`validateActiveMetaFields`, 카탈로그 빌더 `archive/tools/build-archive2-catalog.mjs`, 화면 쪽 `archive/archive2-canonical.js`·`archive/archive2-core.js`·`archive/unit-past-exams-core.js`(중등 단원 배치는 이름 기반 `classifyRecord`), `archive/problem-bank-meta.js`.
2. 곳마다 지금 쓰는 별칭 처리(공백 제거, `수학_상`↔`수학(상)` 등)를 표로 모은다. 서로 다른 규칙이 몇 가지인지.
3. 정본에서 표기 차이 때문에 실제로 떨어지는 문항 수를 센다: 연결 행 조회 실패, 화면 단원 미분류("단원 미분류" 또는 `review`), 카탈로그에서 과목 불명. 학년·학기별.

## 만들 것

1. `archive/tools/meta-os/scope-alias.mjs` — 공용 모듈(순수 함수 + 데이터 표).
   - `canonicalCourse({curriculum, course, standardUnitKey, sourceArchiveFile})` → `{courseId, grade, semester, curriculum, confidence, evidence}`. 과목 표기, 단원 키 접두(`M2-`, `H22-C-` …), 시험지 경로(`original/middle/m2/1mid/…`)를 근거로 같은 과목을 알아본다.
   - 근거끼리 어긋나면(표기는 중1인데 단원 키는 `M2-`) 조용히 하나를 고르지 않는다: 단원 키와 경로가 일치하면 그쪽을 따르고 `confidence: "RESOLVED_BY_UNIT_AND_PATH"`, 셋이 다 다르면 `confidence: "CONFLICT"`로 표시하되 **문항을 버리지 않고** 가장 근거가 많은 쪽으로 배치한다(사용자 원칙: 활용 가능하게, 다만 표시는 남긴다).
   - `sameCourse(a, b)`, `sameUnit(a, b)`(2015↔2022 대응은 저장소에 이미 있는 표에서만: `archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json`, 크로스워크의 단원 대응).
   - 별칭 표는 실제 데이터에 나타난 표기만 담고 표기마다 근거 문항 수를 적는다. 지어낸 별칭을 넣지 않는다. 처음 보는 표기는 `UNKNOWN_ALIAS`로 돌려주고 목록에 모은다.
2. **읽는 쪽 연결(작게, 하나씩 커밋):**
   - (a) 유형 연결 행 조회: `rpm-active-resolver.mjs`와 등록기 `resolve()`에서 정확히 일치하는 연결 행이 없을 때 공용 모듈로 같은 과목의 행을 찾는다. 찾으면 그 행을 쓰고 결과에 `bindingMatch: "ALIAS"`를 남긴다. 기존에 통과하던 입력의 결과는 바뀌지 않아야 한다(테스트로 고정).
   - (b) 카탈로그 빌더와 화면의 단원 배치: 과목·단원을 못 알아봐 미분류로 떨어지던 문항을 공용 모듈로 다시 조회한다. 화면 파일은 Worker 재배포 대상일 수 있으니 구현 전에 `docs/agents/archive2-code.md`와 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 읽고, 위험하면 (b)는 구현하지 말고 바꿀 곳과 예상 효과(미분류에서 빠져나오는 문항 수)만 보고한다.
3. 읽기 전용 점검 명령 `node archive/tools/meta-os/scope-alias.mjs --report --out <저장소 밖>`: 표기별 문항 수, `CONFLICT`·`UNKNOWN_ALIAS` 목록, 연결 전후 "조회 실패 문항 수" 비교.
4. 테스트와 픽스처, `tools/run-tests.js` 등록.

## 규칙

- 정본 메타·레지스트리·크로스워크의 값을 고쳐 쓰지 않는다. 받아들이는 것은 조회뿐이다.
- 키가 ACTIVE인지, TPL의 상위 PT가 맞는지 같은 검사는 그대로 둔다. 넓히는 것은 "같은 과목·같은 단원으로 알아보는 범위"다.
- 기존에 통과하던 등록 요청·테스트의 결과가 달라지면 안 된다. 달라지는 곳이 있으면 구현을 멈추고 보고한다.
- 등록기는 3,000줄이 넘고 다른 작업(작업 3·4)도 같은 파일을 고친다. `main` 기준으로 최소한만 바꾸고, 겹치는 함수·행을 보고서에 적는다.

## 완료 기준

새 테스트 통과, 기존 통과 입력 무변화 테스트 통과. 보고서에 연결 전후 수치(유형 연결 조회 실패 문항 수, 화면 미분류 문항 수 — (b)를 구현하지 않았으면 예상치), `CONFLICT`·`UNKNOWN_ALIAS` 수와 표본.
