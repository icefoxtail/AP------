````bash
cd /mnt/c/Users/USER/Desktop/AP------
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 0. 작업명

AP Math OS 학생 등록 idempotency 최종 보정 — `以` mojibake 제거 / guard 강화 / 검수팩 누락 보정

## 1. 현재 판정

직전 보정은 대부분 통과했지만 최종 검수에서 아래 3개가 남아 배포 보류 상태다.

1. `apmath/worker-backup/worker/helpers/admin-db.js`에 mojibake 금지 패턴 `以`가 남아 있음
2. `tools/test-student-js-mojibake-guard.mjs`가 bare `以` 단독 패턴을 잡지 못함
3. 검수팩에 `apmath/worker-backup/worker/schema.sql` 및 관련 migration 파일이 빠져 일부 idempotency 테스트를 검수팩 단독으로 재현할 수 없음

이번 작업은 이 3개만 빠르게 보정한다.

## 2. 절대 원칙

- 백엔드 idempotency 로직을 되돌리지 마라.
- 학생 추가 후 `loadData()` 제거 보정을 되돌리지 마라.
- onboarding bootstrap 비동기화 보정을 되돌리지 마라.
- `duplicate_ignored` 시 onboarding 차단 보정을 되돌리지 마라.
- `student_identity_key` 관련 보정을 되돌리지 마라.
- `student.js` 전체를 다시 건드리지 마라. 필요한 경우 확인만 하라.
- UI 문구 변경 금지.
- unrelated file 수정 금지.
- git add, git commit, git push 금지.
- remote DB 수정 금지.

## 3. 반드시 먼저 열어 확인할 파일

작업 전 아래 파일을 실제로 열어 확인하라.

- CODEX_RESULT.md
- apmath/worker-backup/worker/helpers/admin-db.js
- tools/test-student-js-mojibake-guard.mjs
- tools/test-student-create-idempotency.mjs
- apmath/worker-backup/worker/schema.sql
- 직전 student_identity_key migration 파일
- apmath/worker-backup/worker/routes/students.js
- apmath/js/student.js

## 4. 보정 1: `admin-db.js`의 `以` 제거 또는 의도 명시

대상:

- `apmath/worker-backup/worker/helpers/admin-db.js`

현재 검수에서 발견된 문제 예:

```text
if (/중|中|以/.test(text)) return `1${digit}`;
````

요구사항:

1. `以`가 실제 의도된 한자 호환 코드가 아니라면 제거하라.
2. 기본 보정 방향은 아래처럼 바꾸는 것이다.

```text
if (/중|中/.test(text)) return `1${digit}`;
```

3. 만약 `以`가 정말 의도된 입력 호환 코드라고 판단하면 임의로 유지하지 말고, 그 근거를 CODEX_RESULT.md에 명확히 적어라.
4. 단, 이번 검수 기준에서는 `以`가 mojibake 금지 패턴이므로 특별한 근거가 없으면 제거해야 한다.
5. 수정 후 `admin-db.js`에 아래 패턴이 남아 있지 않아야 한다.

   * `以`
   * `泥`
   * `異`
   * `諛`
   * `蹂`
   * `願`
   * `由`
   * `�`
   * `?깅`
   * `?쒖`
   * `?대`

## 5. 보정 2: mojibake guard 테스트 강화

대상:

* `tools/test-student-js-mojibake-guard.mjs`

요구사항:

1. guard 테스트의 금지 패턴에 bare `以`를 반드시 추가하라.
2. 기존 패턴 중 빠진 것이 있으면 아래 최소 목록을 모두 포함하라.

   * `�`
   * `泥`
   * `異`
   * `以`
   * `諛`
   * `蹂`
   * `願`
   * `由`
   * `?쒖`
   * `?깅`
   * `?대`
   * `?숈`
   * `?낅`
   * `?섎`
   * `깅줉`
   * `붽`
   * `쟻`
3. guard 대상 파일에 최소 아래 파일을 포함하라.

   * `apmath/js/student.js`
   * `apmath/js/core.js`
   * `apmath/worker-backup/worker/routes/students.js`
   * `apmath/worker-backup/worker/helpers/admin-db.js`
   * `apmath/worker-backup/worker/index.js`
4. 테스트 실패 시 다음 정보를 출력해야 한다.

   * file path
   * line number
   * matched pattern
   * 해당 line 일부
5. 정상 문구 존재 검사도 유지하라.

   * `등록 중...`
   * `추가`
   * `제적`
   * `학생 등록을 처리 중입니다.`
   * `이미 등록 처리된 학생입니다.`
6. 테스트가 remote DB를 건드리면 안 된다.
7. 단순 문자열 포함 검사만으로 끝내지 말고, 금지 패턴 전수 검사를 반드시 수행하라.

## 6. 보정 3: 검수팩 구성 누락 보정

대상:

* codex-work-review-pack 생성 대상
* CODEX_RESULT.md

요구사항:

1. 이번 최종 검수팩에는 반드시 아래 파일을 포함하라.

   * `apmath/worker-backup/worker/schema.sql`
   * 직전 student_identity_key 관련 migration 파일
   * `apmath/worker-backup/worker/helpers/admin-db.js`
   * `apmath/worker-backup/worker/routes/students.js`
   * `apmath/worker-backup/worker/index.js`
   * `apmath/js/student.js`
   * `apmath/js/core.js`
   * `tools/test-student-js-mojibake-guard.mjs`
   * `tools/test-student-create-idempotency.mjs`
   * `tools/test-student-mutation-lightweight-contract.mjs`
   * `tools/test-student-cleanup-contract.mjs`
   * `tools/audit-student-duplicates.mjs`
   * 업데이트한 docs 파일
   * `CODEX_RESULT.md`
2. 검수팩 단독으로 `tools/test-student-create-idempotency.mjs`의 파일 참조를 이해할 수 있어야 한다.
3. schema 또는 migration을 누락하면 완료로 보지 마라.
4. 프로젝트 전체 압축은 금지한다.
5. 검수팩 경로를 CODEX_RESULT.md에 정확히 기록하라.

## 7. 재확인해야 할 유지 조건

이번 작업 후 아래가 그대로 유지되는지 확인만 하라. 불필요하게 수정하지 마라.

1. `handleAddStudent()` 성공 경로에서 `await loadData()`가 없어야 한다.
2. `handleAddStudent()`는 onboarding bootstrap을 `await`하지 않아야 한다.
3. `duplicate_ignored === true`일 때 onboarding bootstrap이 실행되지 않아야 한다.
4. `POST /api/students`는 `student`, `class_student`, `duplicate_ignored`를 반환해야 한다.
5. `student_identity_key` 기반 중복 방어와 legacy fallback duplicate lookup이 유지되어야 한다.
6. 자동 PIN 충돌 재시도 로직이 유지되어야 한다.
7. `students.js` POST 분기에 unreachable legacy insert 코드가 다시 생기면 안 된다.
8. `student.js` 한글 문구가 다시 깨지면 안 된다.

## 8. 검증 명령

작업 후 아래 명령을 반드시 실행하라.

```text
node --check apmath/worker-backup/worker/helpers/admin-db.js
node --check apmath/worker-backup/worker/routes/students.js
node --check apmath/worker-backup/worker/index.js
node --check apmath/js/student.js
node --check apmath/js/core.js
node --check tools/test-student-js-mojibake-guard.mjs
node --check tools/test-student-create-idempotency.mjs
node --check tools/test-student-mutation-lightweight-contract.mjs
node --check tools/test-student-cleanup-contract.mjs
node --check tools/audit-student-duplicates.mjs
```

테스트 실행:

```text
node tools/test-student-js-mojibake-guard.mjs
node tools/test-student-create-idempotency.mjs
node tools/test-student-mutation-lightweight-contract.mjs
node tools/test-student-cleanup-contract.mjs
node tools/audit-student-duplicates.mjs --help
```

추가로 아래 성격의 전수 검색을 수행하라.

```text
rg "�|泥|異|以|諛|蹂|願|由|\?쒖|\?깅|\?대|깅줉|붽|쟻" apmath/js/student.js apmath/js/core.js apmath/worker-backup/worker/routes/students.js apmath/worker-backup/worker/helpers/admin-db.js apmath/worker-backup/worker/index.js
```

PowerShell/WSL quoting 문제로 `rg`가 어렵다면 `tools/test-student-js-mojibake-guard.mjs`로 동일 결과를 확인하라.

검색 결과가 하나라도 나오면 완료 보고하지 말고 먼저 보정하라.

## 9. 문서 업데이트

필요하면 아래 문서에 짧게만 반영하라.

* `docs/implemented/CURRENT_REGRESSION_RISK_MAP.md`
* `docs/implemented/CURRENT_FRONTEND_MAP.md`

반영 내용:

* mojibake guard가 `admin-db.js`까지 검사하고 bare `以`를 포함하도록 강화됨
* 검수팩에 schema/migration을 포함해 idempotency 테스트 재현성을 보장함

문서 문구를 길게 늘리지 마라.

## 10. CODEX_RESULT.md 작성 형식

작업 완료 후 루트의 CODEX_RESULT.md에 아래 형식으로 작성하라.

# CODEX_RESULT

## 1. 생성/수정 파일

* 생성:
* 수정:

## 2. 구현 완료 또는 확인 완료

* `admin-db.js`의 `以` 제거 또는 근거 처리:
* mojibake guard bare `以` 추가:
* guard 대상 파일 재확인:
* 학생 등록 idempotency 로직 유지 확인:
* 학생 추가 `loadData()` 제거 유지 확인:
* onboarding await 제거 및 duplicate 차단 유지 확인:
* 검수팩 schema/migration 포함:

## 3. 실행 결과

* node --check:
* mojibake guard:
* idempotency 관련 테스트:
* audit script:
* rg/node 전수 검사:
* 실행하지 못한 항목과 이유:

## 4. 결과 요약

* 이번 보정으로 해결된 점:
* 남은 수동 확인:
* 배포 전 주의사항:

## 5. 다음 조치

* 수동 UI 확인 항목:
* 기존 중복 학생 수동 정리 필요 여부:
* identity backfill 적용 필요 여부:
* report_exam_cohort_stats / initial-data 추가 분리 필요 여부:
* 검수팩 경로:

## 11. 자체 검수 및 검수팩 생성

작업 완료 후 바로 보고하지 말고, 먼저 codex-self-audit 스킬을 적용해 자체 검수를 수행하라.

자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증하라.

그 다음 codex-work-review-pack 스킬을 적용해 이번 최종 보정의 변경/신규 파일 중심 검수팩을 생성하라.

프로젝트 전체 압축은 금지한다.

검수팩에는 이번 보정과 검수 재현에 필요한 파일만 포함하라.

반드시 포함:

* `apmath/worker-backup/worker/schema.sql`
* 직전 student_identity_key 관련 migration 파일
* `apmath/worker-backup/worker/helpers/admin-db.js`
* `apmath/worker-backup/worker/routes/students.js`
* `apmath/worker-backup/worker/index.js`
* `apmath/js/student.js`
* `apmath/js/core.js`
* `tools/test-student-js-mojibake-guard.mjs`
* `tools/test-student-create-idempotency.mjs`
* `tools/test-student-mutation-lightweight-contract.mjs`
* `tools/test-student-cleanup-contract.mjs`
* `tools/audit-student-duplicates.mjs`
* 업데이트한 docs
* `CODEX_RESULT.md`

생성된 zip 경로를 CODEX_RESULT.md 마지막에 기록하라.

git add, git commit, git push는 하지 않는다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

cat CODEX_TASK.md

```
```
