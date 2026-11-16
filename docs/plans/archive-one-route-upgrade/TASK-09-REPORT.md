# TASK-09 보고: 조회 전용 범위 별칭

## 결과와 범위

- 시작 main: `7dbfe26bfe174d3dab802c4555818c95e788b8dc` (시작 뒤 고정).
- 코드 브랜치: `feat/scope-alias-20261116`.
- 순수 모듈/표/CLI: `ea6252073177a6844e15e172d9e77c61688523e3`.
- 등록기/RPM 연결: `3d54a43418ecaa2d0c88877204dabe16fc219649`.
- 충돌 전체 목록 보고 보완/최종: `6dd71aa531ec0c4eb46733e3fb5ddb334c7b7a0d`.
- 최종 코드 tree: `01c1cbd41715d77f0ed816a5b966f4230bda4322`. 로컬 검증 tree와 원격 API tree가 같다.
- (a) 구현. (b) 위험 검토 후 구현하지 않음. UI 회복 또는 운영 반영 완료를 주장하지 않는다.
- main 병합/PR/운영 메타·레지스트리·크로스워크·봉인·4칸·기존 영수증 수정 없음.

## 구현

`scope-alias.mjs`는 관측 표를 읽는 순수 `canonicalCourse/sameCourse/sameUnit`을 제공한다. 과목·활성 단원·경로의 독립 표를 한 표씩 센다. 동률은 단원→과목→경로 순으로 배치하고 evidence에 기록한다. 충돌 문항도 반환하며, 단원과 경로가 합치면 RESOLVED_BY_UNIT_AND_PATH다. 배치는 등록 승인과 다르다. 알려진 다른 과목·미관측 표기는 조회 권한을 우회하지 않는다. 고등 경로의 학년만으로 과목을 만들지 않는다.

실제 정본 28,890행, compiled binding 1,104행에서 18묶음/43표기를 수집했다. 표에는 표기별 문항·binding 근거 수가 있다. 공식 exact leaf 대응 452행, 공식 단일 부모 대응 23행만 사용한다. 일대다 M22-2-06→RPM22-M2-L1-06/07은 두 후보 모두 제외했다. 같은 이름만으로 새 교육과정 대응을 만들지 않는다. 등록기/RPM 연결은 기존 교육과정·PT·소단원 조건을 그대로 둔다.

EXACT 후보가 하나라도 있으면 기존 경로 그대로다(모호함·owner 불일치도 alias로 덮지 않음). EXACT가 없을 때만 별칭을 조회하며 유일 ACTIVE 후보의 성공에 `bindingMatch: ALIAS`를 추가한다. 원본 row/course와 binding 객체는 수정하지 않는다. TPL→PT, 키 ACTIVE, pack 범위, extension 및 별도 부모 증명 검사는 유지한다.

읽기 전용 CLI: `node archive/tools/meta-os/scope-alias.mjs --report --out /tmp/scope-alias-report.json` (새 파일). 저장소 내부 및 내부로 향하는 symlink 출력·기존 파일 덮어쓰기를 거부한다. 전체 충돌/미관측 목록과 표본, 학교급/학년/학기별 수를 출력한다. 생성기는 명시 실행 때만 관측 데이터를 재생성하며 운영 데이터를 쓰지 않는다.

## 연결 전후 수치

동일한 정본·ACTIVE binding에 대해 조회만 비교했다. 전체 등록 요청 실행 실패나 UI 출제 자격 수가 아니다. PT 없는 17,062행은 조회 분모에서 분리했다.

| 입력 해석 | PT 있는 분모 | EXACT 유지 | 조회 누락 전 | 조회 누락 후 | 별칭 유일 회복 |
|---|---:|---:|---:|---:|---:|
| row의 curriculum 또는 curriculumKey 그대로 |11,828|4,303|7,525|7,519|6|
| 기존 active-registry.curriculumForQuestion 재사용 |11,828|9,362|2,466|2,401|65|

원시 행의 명시 교육과정 부족 7,445건은 실제 실패라고 단정하지 않는다. 기존 consumer 해석에서는 부족 0건이다. 이 기존 함수는 H15/H22 접두와 중학의 명시 과정·출처 연도 규칙을 사용하며 새 추론 규칙은 추가하지 않았다. registrar 자체는 명시 curriculum을 요구하고 RPM은 별도 curriculumContext를 받으므로 두 분모를 섞지 않는다. 별칭 회복은 pack·부모·승인 전체 통과와 동일하지 않다.

기존 consumer 해석별 상세:

| 학교급/학년/학기 | 전체 행 | EXACT | 누락 전 | 누락 후 | 별칭 |
|---|---:|---:|---:|---:|---:|
|UNKNOWN/UNKNOWN/UNKNOWN|8|0|0|0|0|
|high/1/1|3430|2659|81|81|0|
|high/1/2|2265|967|40|40|0|
|high/1/UNKNOWN|177|0|0|0|0|
|high/2/1|3686|1370|85|85|0|
|high/2/2|2968|1638|62|39|23|
|high/2/UNKNOWN|367|0|0|0|0|
|high/3/1|64|0|31|31|0|
|high/UNKNOWN/UNKNOWN|4342|376|1859|1859|0|
|middle/1/1|921|253|126|126|0|
|middle/1/2|1056|832|71|44|27|
|middle/1/UNKNOWN|836|0|0|0|0|
|middle/2/1|1803|59|0|0|0|
|middle/2/2|1624|256|23|23|0|
|middle/2/UNKNOWN|314|0|0|0|0|
|middle/3/1|2991|150|51|51|0|
|middle/3/2|2003|802|34|19|15|
|middle/3/UNKNOWN|35|0|3|3|0|

회복 표본: `qid_v1_267dbac750c1d21a513378c27876d17373e0e6767d638a348a4cac817867cf39`, M1-07, 중1 수학→中1 수학. 원장값은 그대로다.

충돌 217건, UNKNOWN_ALIAS 0건, 배치 불확정 UNRESOLVED 550건이다. 표가 현재 관측으로 생성됐으므로 현재 표기 unknown 0은 당연하며 미래 표기 fixture는 UNKNOWN_ALIAS와 목록 수집을 검증한다. 빈 과목 2,151행도 관측 표에 별도로 센다. 충돌 사례: `qid_v1_00de2f854f7e5c6a12a7cb3d1d6f42c937c25237f167ec82b7cdf92afb01bd98`는 표기 대수/단원 H15-M1-08/고2 경로여서 수학I에 동률 규칙으로 배치하고 CONFLICT를 남긴다. `qid_v1_01b0bc1a508291450f52eed0e633ed44dcddd702a2272358827120085ed5d8d6`는 공통수학1·H22 단원 대 중3 출처가 충돌한다. 어떤 원장도 고치지 않는다.

## 분산된 기존 규칙과 UI 미구현

최소 8개 처리 계열을 확인했다:

| 위치 | 기존 규칙 |
|---|---|
| reviewed-exam-registration-v2:1718 부근 | compactCourse NFC/공백 및 pack 과목 allowlist, exact binding |
| rpm-active-resolver:472 부근 | exact curriculum/unit/subunit/PT/course 및 owner |
| active-registry:139–155 | H15/H22 및 명시 과정/출처연도 기반 curriculum |
| archive2-core:89–100,229–244 | 공백/로마숫자 정리, 학년 및 UI subject 묶음 |
| unit-past-exams-core:356–490 | RPM→identity→단원명→장명→단원키→legacy, 일대다 부모 거부 |
| problem-bank-meta:141–178 | 학년 allowlist와 승인/fingerprint 결속 display projection |
| archive2-canonical:341–347 | 과정·과목 tuple allowlist |
| build-archive2-catalog:165,648–665 | 일부 normalizeCourseIdentity 및 compiled authority 검증 |

archive2-code와 Runtime Responsiveness/Original Source 계약을 읽었다. 공통 분류는 선택풀·스냅샷·출력과 연결되고 실제 10,000문항 규모/500ms 응답 및 Chrome/storage-failure 검증을 요구한다. core 변경은 Worker 재배포 영향도 있어 (b)는 미구현이다.

후속 위치는 unit-past-exams-core:410의 parent 조회 실패 뒤이지만, 기존 다른 fallback 성공도 보존해야 하므로 전체 기존 classifier 종료 뒤 wrapper가 더 안전하다. 공식 부모가 유일할 때만 재조회해야 하며 alias만으로 단원/부모를 만들어서는 안 된다. catalog는 canonical:341–347 또는 problem-bank-meta display projection에서 별도 검토하되 승인·원본 결속을 유지해야 한다.

저장 catalog 28,882행의 course_namespace_invalid는 26,166건이다. assignment_missing/canonical_parent_missing도 각각 26,166이므로 이것을 alias 회복 가능 수라고 부를 수 없다.

UI 추정은 question-index 27,179행을 기존 isInScope/classifyRecord로 읽었다. generalUse/rpmParentResolution 런타임 overlay 전 기준선이며 배포 화면의 최종 미분류 실측이 아니다. 실패 행의 과목만 관측 별칭으로 메모리 사본에 매핑하고 단원·부모·과정은 유지했다.

| profile | 대상 | classified | review | invalid/ignored | 과목 사본 적용 | 회복 예상 |
|---|---:|---:|---:|---:|---:|---:|
|m1|1047|852|99|96|193|0|
|m2|3384|2044|1340|0|1338|0|
|m3|4708|3869|769|70|817|0|
|h1|4676|4630|46|0|46|0|
|h2|6126|5565|560|1|453|0|
|h3|6126|5565|560|1|453|0|

h2/h3는 같은 통합 scope여서 중복 합산 금지. 모든 분류 결과 변화 0. 예: 중3 가람중16 1학기기말1번은 미지원 단원키, 중2 연향중18 1학기기말1번은 단원키 없음. 과목만 고쳐도 해결되지 않는다. UI downstream 연결은 미해결이다.

## 검증과 독립 검토

- 새 pure assertion suite PASS(관측표·충돌 배치·미관측·고등/중등 오염·공식 cross-curriculum·모호한 분할·불변 입력).
- 새 report 테스트 2/2 PASS(집계/출력경로/덮어쓰기 거부).
- 새 integration 7/7 PASS(EXACT 결과 deep equality, ACTIVE/PT/TPL/pack/소단원 반례, 실제 RPM ALIAS 증거와 재검증).
- 기존 reviewed registrar 618/618 PASS, 기존 RPM resolver 24/24 PASS.
- 초기 RPM 실행은 sparse-checkout에서 docs/rules가 없어 실패했다. 정본 파일 복구 뒤 RPM만 재실행해 24/24 확인. 실패를 숨기거나 기준을 낮추지 않았다.
- 독립 읽기 전용 검토에서 P1 일대다 부모 대응과 P2 학교급 혼합/충돌 카운트 누락 발견. 대응 제한·학교급별 키·명시 전체 카운트를 수정했고 해당 반례 재검토 PASS.
- git diff --check PASS. 전체 suite, Chrome/Worker/배포 검증, 실제 운영 등록·데이터 변경은 NOT_RUN.

## 합칠 곳 / 임의 결정 / 남은 제한

- 작업 2의 `1bea581a137a6024077c548990d9a9fff6770e7f` 관측 alias-evidence 로직을 출발점으로 현재 main 데이터에서 재생성했다. 작업 2 병합 뒤 한 곳으로 합칠 것. feature branch를 base로 하지 않았다.
- 작업 3/4와 겹치는 파일은 reviewed-exam-registration-v2.mjs. 이번 변경은 import 및 기존 resolve 1692–1731 부근(현재 resolveReviewedScope 1693–1750 및 const resolve alias)이다. 재결속/hold 해제 함수에는 변경 없음. 작업 3/4 병합 뒤 resolve 호출·반환 사용과 import를 합칠 것. tools/run-tests.js 신규 항목도 다른 작업과 합쳐야 한다.
- 임의 결정: 독립 근거 동률 UNIT→COURSE→PATH; 조회에서는 모호한 후보를 임의 선택하지 않음; 배치 CONFLICT와 승인 조회 권한을 구분. 새로운 의미 분류나 운영 값 정규화는 하지 않았다.
- 자료 크기/관측 수는 이 시작 main에 대한 값이며 영구 고정 검증치가 아니다. 생성기 재실행은 명시적으로 수행한다.

## 관측 표기 근거 수

같은 문항이 standardCourse/courseKey 두 표기를 가지면 각 표기에 근거로 들어가므로 합산해 문항 분모로 쓰지 않는다.

| 표기 | 문항 근거 | binding 근거 |
|---|---:|---:|
|M1-1|182|0|
|M1-2|500|0|
|M2-1|69|0|
|M2-2|144|0|
|M3|17|0|
|M3-1|375|0|
|M3-2|670|0|
|공통수학|12|0|
|공통수학1|2163|118|
|공통수학2|3548|97|
|기하|422|11|
|기하와 벡터|33|0|
|대수|1458|44|
|미적분|91|0|
|미적분1|194|0|
|미적분I|156|15|
|수학|11|0|
|수학(상)|2131|134|
|수학(하)|1358|144|
|수학I|930|49|
|수학Ⅰ|69|0|
|수학II|1622|47|
|수학Ⅱ|24|0|
|중1|48|0|
|중1 수학|2349|183|
|중2|191|1|
|중2 수학|2340|53|
|중2-1|434|36|
|중2-2|148|13|
|중2수학|26|0|
|중3|243|0|
|중3 수학|3527|36|
|중3-1|379|44|
|중3-2|8|0|
|중학 수학|221|0|
|중학교 2학년|24|0|
|중학교 3학년|22|0|
|중학교 수학 2 (2009 개정 교육과정)|1|0|
|중학교 수학 3 (2009 개정 교육과정)|24|0|
|확률과 통계|2373|74|
|확률과통계|407|0|
|中1 수학|0|5|
|(빈값)|2151|0|
