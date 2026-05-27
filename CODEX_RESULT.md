# CODEX_RESULT

## 1. 생성/수정 파일

* 생성:
  * 없음
* 수정:
  * `apmath/worker-backup/worker/helpers/admin-db.js`
  * `tools/test-student-js-mojibake-guard.mjs`
  * `tools/test-student-create-idempotency.mjs`
  * `docs/implemented/CURRENT_REGRESSION_RISK_MAP.md`
  * `docs/implemented/CURRENT_FRONTEND_MAP.md`
  * `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

* `admin-db.js`의 `餓` 제거 또는 근거 처리:
  * PIN prefix 판정에서 Windows 출력상 `餓`로 깨져 보이던 `以` fallback을 제거했다.
  * 중등 판정은 `중|中`만 유지한다. `以`는 실제 학년 입력 근거가 아니라 mojibake 잔여로 판단했다.
* mojibake guard bare `餓` 추가:
  * `tools/test-student-js-mojibake-guard.mjs`에 bare `餓` 금지 패턴을 명시했다.
  * 실패 출력에 file path, line number, matched pattern, 해당 line excerpt가 나오도록 강화했다.
* guard 대상 파일 재확인:
  * `student.js`, `core.js`, `routes/students.js`, `helpers/admin-db.js`, `index.js` 5개 파일을 guard 대상으로 유지했다.
* 학생 등록 idempotency 로직 유지 확인:
  * `POST /api/students`는 `student`, `class_student`, `duplicate_ignored` 응답을 유지한다.
  * `student_identity_key`, fallback duplicate lookup, auto PIN retry 로직을 유지한다.
* 학생 추가 `loadData()` 제거 유지 확인:
  * `handleAddStudent()` 성공 경로에는 `await loadData()`가 없다.
* onboarding await 제거 및 duplicate 차단 유지 확인:
  * `handleAddStudent()`는 onboarding bootstrap을 `await`하지 않는다.
  * `duplicate_ignored` 응답에서는 onboarding bootstrap을 실행하지 않는다.
* 검토팩 schema/migration 포함:
  * 검토팩에 `schema.sql`과 `migrations/20260527_student_identity_key.sql`을 포함했다.
  * `tools/test-student-create-idempotency.mjs`가 schema와 migration을 모두 직접 참조해 단독 검토 시 근거가 보이도록 했다.

## 3. 실행 결과

* node --check:
  * `node --check apmath/worker-backup/worker/helpers/admin-db.js`: PASS
  * `node --check apmath/worker-backup/worker/routes/students.js`: PASS
  * `node --check apmath/worker-backup/worker/index.js`: PASS
  * `node --check apmath/js/student.js`: PASS
  * `node --check apmath/js/core.js`: PASS
  * `node --check tools/test-student-js-mojibake-guard.mjs`: PASS
  * `node --check tools/test-student-create-idempotency.mjs`: PASS
  * `node --check tools/test-student-mutation-lightweight-contract.mjs`: PASS
  * `node --check tools/test-student-cleanup-contract.mjs`: PASS
  * `node --check tools/audit-student-duplicates.mjs`: PASS
* mojibake guard:
  * `node tools/test-student-js-mojibake-guard.mjs`: PASS
* idempotency 관련 테스트:
  * `node tools/test-student-create-idempotency.mjs`: PASS
  * `node tools/test-student-mutation-lightweight-contract.mjs`: PASS
  * `node tools/test-student-cleanup-contract.mjs`: PASS
* audit script:
  * `node tools/audit-student-duplicates.mjs --help`: PASS
* rg/node 필수 검색:
  * `rg` 대상 5개 파일에서 금지 mojibake 패턴 매치 없음.
  * 동일 대상 node 수동 스캔도 PASS.
* 실행하지 못한 항목과 이유:
  * remote DB 변경, 기존 중복 학생 자동 병합/삭제, git add/commit/push는 금지 항목이라 실행하지 않았다.

## 4. 결과 요약

* 이번 보정으로 해결한 것:
  * `admin-db.js`에서 `餓`로 보이는 잔여 PIN prefix fallback을 제거했다.
  * guard가 bare `餓`를 명시적으로 잡고 실패 시 해당 줄까지 보여준다.
  * 검토팩에 schema/migration과 이를 참조하는 idempotency 테스트가 포함된다.
* 남은 수동 확인:
  * 브라우저에서 학생 추가/중복 등록/복구 흐름의 실제 UI 체감 확인.
* 배포 전 주의사항:
  * 운영 DB backfill 또는 기존 중복 학생 정리는 이번 작업에 포함하지 않았다.

## 5. 다음 조치

* 수동 UI 확인 항목:
  * 학생 추가 버튼 연타, 동일 학생 재등록, duplicate toast, 신규 학생 추가 후 화면 갱신.
* 기존 중복 학생 수동 정리 필요 여부:
  * `reports/student-duplicate-audit-20260527.json` 기준으로 별도 검토 필요.
* identity backfill 적용 필요 여부:
  * 운영 DB는 별도 승인 후 audit/backfill만 분리 적용 필요.
* report_exam_cohort_stats / initial-data 추가 분리 필요 여부:
  * 이번 범위 밖이며 후속 과제로 유지.
* 검토팩 경로:
  * `reports/student-idempotency-review-pack-20260527.zip`
