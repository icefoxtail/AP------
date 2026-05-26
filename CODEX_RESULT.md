/goal Academy OS Phase 6 Round 8-4-1: 반 lifecycle 커밋 차단 이슈 초소형 보정

이번 작업은 Round 8-4 반 정보 수정 / 폐반 처리 구현에 대한 ChatGPT 1차 코드검수에서 발견된 커밋 차단 이슈 2개만 보정하는 작업이다.
새 기능 확장, UI 리디자인, DB migration 없이 worker guard와 테스트만 정확히 보강한다.

절대 작업 루트:
C:\Users\USER\Desktop\academy-os-v2

금지 루트 / 금지 기준:
- C:\Users\USER\Desktop\AP------
- C:\Users\USER\RECOVER_WORK\AP------
- C:\Users\USER\RECOVER_WORK
- apmath/index.html
- apmath/js/ui.js
- apmath/js/operations-dashboard.js
- apmath/worker-backup
- APMS 정적 앱 구조
- AP------에서 생성된 작업물

금지 작업:
- 금지 루트 파일을 읽거나 복사하지 마라.
- React Router로 구조를 갈아타지 마라.
- route/menu/mode 구조 변경 금지.
- 운영 홈 기능 변경 금지.
- StudentOperationHub UI 기능 확장 금지.
- Classes 화면 리디자인 금지.
- 반 삭제 기능 구현 금지.
- 미사용 반 삭제 기능 구현 금지.
- 자동 학생 배정 종료 금지.
- 자동 시간표 재편성 금지.
- 반 병합 기능 추가 금지.
- DB migration 추가 금지.
- schema 변경 금지.
- API endpoint 이름 대규모 변경 금지.
- 기존 정상 통과한 Round 8-4 기능을 되돌리지 마라.
- git add / git commit / git push 금지.
- 배포 금지.
- 검수요청서 작성 금지.

0. 작업 전 상태 확인

먼저 아래를 확인하고 CODEX_RESULT.md에 기록한다.

- 현재 작업 디렉터리
- git status --short --untracked-files=all
- git log --oneline -5
- worker/routes/classes.js 존재 여부
- tools/test-phase6-round8-4-class-lifecycle.mjs 존재 여부
- web-react/src/pages/Classes.jsx 존재 여부
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md 존재 여부
- docs/V2_WORKING_RULEBOOK.md 존재 여부

현재 알려진 기존 상태:
- Round 8-4 변경 파일들이 아직 커밋 전이다.
- CODEX_TASK.md는 채팅창 지시 입력으로 dirty 상태일 수 있으나 이번 작업에서 열거나 수정하지 않는다.
- C:\Users\USER\.config\git\ignore permission denied 경고가 표시될 수 있다.
- 기존 dirty/untracked 항목은 임의 복구/삭제하지 않는다.

1. 이번 보정 대상

Round 8-4 1차 검수에서 남은 커밋 차단 이슈는 아래 2개다.

이슈 1. class 생성 API가 status / is_active / is_deleted를 body에서 받아 lifecycle 우회 생성이 가능함
- 현재 POST /classes 생성 로직이 body.status, body.is_active 등을 반영할 수 있다.
- 정책상 lifecycle 변경은 close action으로만 처리해야 한다.
- 생성 API는 항상 운영 중 반으로 생성되어야 한다.

이슈 2. 폐반 반도 API로 PATCH 수정 가능함
- UI에서 폐반 반 수정 버튼을 숨겨도 API 직접 호출로 PATCH /classes/:id가 가능할 수 있다.
- 정책상 폐반 반은 이번 라운드에서 읽기 전용이다.
- 폐반 반 메모 수정 예외도 이번 라운드에서는 구현하지 않는다.

2. 수정 대상 파일

필수 수정:
- worker/routes/classes.js
- tools/test-phase6-round8-4-class-lifecycle.mjs
- CODEX_RESULT.md

필요 시 최소 수정:
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md
- docs/PHASE6_CHANGED_MANIFEST.md
- PROJECT_STATUS.md

원칙적으로 수정하지 말 파일:
- web-react/src/pages/Classes.jsx
- web-react/src/api/classes.js
- web-react/src/api/studentOperationHub.js
- web-react/src/styles/design-system.css
- web-react/src/pages/StudentOperationHub.jsx
- worker/routes/student-operation-hub.js
- worker/index.js

단, 위 파일에 직접적인 회귀가 발견되면 CODEX_RESULT.md에 기록하고 사용자 확인 필요로 남긴다. 이번 작업에서 임의 수정하지 않는다.

3. backend guard 보정

대상:
- worker/routes/classes.js

3-1. class 생성 시 lifecycle field 무시

POST /classes 또는 기존 class create 로직을 확인한다.

필수 정책:
- class 생성 시 status는 항상 active 또는 기존 schema의 운영 중 상태로 저장한다.
- class 생성 시 is_active는 항상 1로 저장한다.
- class 생성 시 is_deleted는 항상 0 또는 기존 create 관례의 정상값으로 저장한다.
- body.status, body.is_active, body.is_deleted, body.closed_at, body.ended_at 등 lifecycle 관련 값은 생성 요청에서 무시한다.
- created_at/updated_at은 기존 관례를 따른다.
- 사용자가 생성 payload에 폐반/비활성 상태를 넣어도 새 반은 운영 중 반으로 생성되어야 한다.

권장 구현:
- create payload를 구성할 때 lifecycle 필드는 body에서 가져오지 않는다.
- 기존 SQL insert에 body.status/body.is_active/body.is_deleted가 들어가 있으면 고정값으로 바꾼다.
- status 컬럼이 있다면 'active' 고정.
- is_active 컬럼이 있다면 1 고정.
- is_deleted 컬럼이 있다면 0 고정.
- closed_at/ended_at/archived_at 컬럼이 있다면 create 시 null 또는 insert 생략.
- 실제 schema에 없는 컬럼을 새로 추가하지 않는다.

주의:
- 기존 class 생성 필드 name/grade/subject/teacher_id 등 정상 필드는 보존한다.
- academy_id 격리와 owner/manager 권한 guard는 유지한다.
- DB migration 금지.

3-2. 폐반 반 PATCH 차단

PATCH /classes/:id 또는 기존 class update 로직을 확인한다.

필수 정책:
- PATCH 전에 해당 class를 academy scope로 조회한다.
- 조회된 class가 폐반 상태이면 수정 차단한다.
- 폐반 판정은 기존 schema/구현에 맞춘다.
  - status === 'closed'
  - 또는 is_active === 0
  - 또는 둘 다
- 응답 문구:
  - 폐반된 반은 수정할 수 없습니다.
- 오류 code 권장:
  - CLASS_CLOSED
- 이번 라운드에서는 폐반 반 메모 수정 예외도 허용하지 않는다.
- PATCH allowlist는 기존 Round 8-4 구현의 name/subject/teacher_id/memo 등 허용 범위를 유지한다.
- PATCH에서 status/is_active/is_deleted 직접 변경 금지는 유지한다.

주의:
- close action 자체는 폐반 처리이므로 유지한다.
- 이미 폐반된 반에 close 요청이 들어오는 기존 처리는 과하게 바꾸지 않는다.
- active 배정 학생 폐반 차단 guard는 유지한다.
- class_students 수강 종료 DELETE 흐름은 StudentOperationHub 기존 기능 보존을 위해 건드리지 않는다.

4. 테스트 보강

대상:
- tools/test-phase6-round8-4-class-lifecycle.mjs

반드시 추가/강화할 검사:

1. class 생성 lifecycle field 무시
- worker/routes/classes.js의 create 로직에서 body.status/body.is_active/body.is_deleted를 직접 insert/update 값으로 쓰지 않는지 검사한다.
- create 로직에 status active 고정 또는 is_active 1 고정 또는 동등한 운영 중 기본값이 있어야 한다.
- body.closed_at/body.ended_at/archived_at 같은 lifecycle field를 create에서 반영하지 않는지 검사한다.

2. 폐반 반 PATCH 차단
- PATCH/update 로직에서 class 상태를 확인하는 guard가 있어야 한다.
- status closed 또는 is_active 0일 때 PATCH를 차단하는 조건이 있어야 한다.
- CLASS_CLOSED 또는 “폐반된 반은 수정할 수 없습니다.” 문구가 있어야 한다.

3. 기존 Round 8-4 guard 유지
- 반 정보 수정 handler 존재
- close action 존재
- PATCH allowlist 유지
- PATCH에서 status/is_active/is_deleted 직접 변경 금지
- close action에서 active 배정 학생 count 또는 active students 조회 guard 존재
- 배정 학생 잔존 시 폐반 차단 문구 존재
- DELETE route 없음 또는 hard delete 없음
- Classes 화면에 “반 정보 수정”, “폐반 처리”, “폐반 반 보기”, “폐반” 문구 존재
- Classes 화면에 “반 삭제”, “미사용 반 삭제”, “완전 삭제” 사용자 노출 없음
- StudentOperationHub에 반 정보 수정 UI 없음
- 반 이동/반 추가 후보에서 폐반 반 제외 guard 또는 backend 기본 조회 active-only 확인
- APMS/apmath 경로 금지

테스트는 실제 소스를 읽어 검사한다.
CODEX_RESULT만 보고 PASS하면 안 된다.

5. 문서 갱신

수정:
- CODEX_RESULT.md

필요 시 최소 수정:
- docs/PHASE6_ROUND8_4_CLASS_LIFECYCLE_POLICY.md
- docs/PHASE6_CHANGED_MANIFEST.md
- PROJECT_STATUS.md

문서에 반영할 내용:
- Round 8-4-1 lifecycle guard 보강
- 새 반 생성은 항상 운영 중 반으로만 생성
- 폐반 반은 PATCH 수정 불가
- 반 삭제/자동 종료/자동 재편성/반 병합은 여전히 제외

6. 검증 명령

아래 명령을 실행하고 CODEX_RESULT.md에 기록한다.

- node tools/test-phase6-round8-4-class-lifecycle.mjs
- node tools/test-phase6-round8-3-parent-contacts.mjs
- node tools/test-phase6-round7-operations-home.mjs
- node tools/test-phase6-round2-student-hub.mjs
- node --check worker/index.js
- node --check worker/routes/classes.js
- node --check worker/routes/student-operation-hub.js
- npm.cmd run check
- cd web-react; npm.cmd run check
- cd web-react; npm.cmd run build

추가 검색:
- rg "CLASS_CLOSED|폐반된 반은 수정할 수 없습니다" worker/routes/classes.js tools/test-phase6-round8-4-class-lifecycle.mjs
- rg "body\\.status|body\\.is_active|body\\.is_deleted|body\\.closed_at|body\\.ended_at" worker/routes/classes.js
  결과가 있다면 create/update allowlist 맥락인지 lifecycle 우회 반영인지 확인하고 CODEX_RESULT.md에 기록한다.
- rg "반 삭제|미사용 반 삭제|완전 삭제" web-react/src/pages/Classes.jsx worker/routes/classes.js tools/test-phase6-round8-4-class-lifecycle.mjs
  결과가 있다면 테스트 금지 문구인지 실제 UI/route 노출인지 CODEX_RESULT.md에 기록한다.
- git status --short --untracked-files=all
- git diff --name-only

7. CODEX_RESULT.md 작성 형식

# CODEX_RESULT

## 1. 생성/수정 파일
생성/수정 파일을 정확히 구분한다.

## 2. 오염 확인
- 작업 루트가 C:\Users\USER\Desktop\academy-os-v2인지 확인
- AP------ / RECOVER_WORK / apmath 작업물을 사용하지 않았는지 확인
- 기존 dirty 항목은 무엇이었고 이번 작업에서 건드렸는지 여부 기록

## 3. 보정 완료
- class 생성 시 lifecycle field 무시
- 새 반은 항상 운영 중 반으로 생성
- 폐반 반 PATCH 수정 차단
- CLASS_CLOSED 또는 동일 오류 코드/문구 추가
- Round 8-4 테스트 보강

## 4. 보존 확인
- DB migration 없음
- schema 변경 없음
- 반 삭제 기능 없음
- 자동 학생 배정 종료 없음
- 자동 시간표 재편성 없음
- 반 병합 없음
- 수납/청구/장부/환불/이월 정정 기능 없음
- 운영 홈 기능 변경 없음
- StudentOperationHub 기존 청구/수납/상담/연락처/반 처리 흐름 보존
- ParentPaymentLink public route 보존
- API payload key 기존 호환 유지
- AP------ / apmath 파일 미사용

## 5. 실행 결과
검증 명령별 PASS/FAIL 기록.
실패가 있으면 실패 명령, 오류 요약, 수정 여부 기록.

## 6. 결과 요약
짧게 작성.

## 7. 다음 조치
- ChatGPT 1차 재검수용 변경 파일 압축 필요
- 브라우저에서 반 생성 lifecycle field 무시 / 폐반 반 수정 차단 / 폐반 처리 직접 확인 필요
- Pro 검수방 PASS 전 git add / commit / push 금지
- 배포 금지

8. 자기검증

작업 종료 전 반드시 확인한다.

- 현재 루트가 C:\Users\USER\Desktop\academy-os-v2인지 확인
- AP------ / RECOVER_WORK 파일을 참조하거나 복사하지 않았는지 확인
- apmath 정적 앱 파일을 수정하지 않았는지 확인
- 생성 API에서 status/is_active/is_deleted를 body에서 받아 lifecycle 우회하지 않는지 확인
- 폐반 반 PATCH가 차단되는지 확인
- 반 삭제 버튼/route를 만들지 않았는지 확인
- 폐반 시 배정 학생 자동 종료를 만들지 않았는지 확인
- 기존 Round 8-4 기능을 되돌리지 않았는지 확인
- 테스트가 실제 소스를 읽는지 확인
- CODEX_RESULT.md 외 검수요청서 작성하지 않았는지 확인
- git add / commit / push 하지 않았는지 확인
# CODEX_RESULT - 2026-05-26 Maple Synergy Manual Review Reclassification

## Scope
- Target: `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/*.js`
- Target: `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/*.js`
- Rule: JS `answer` only for directly solvable items; protected fields unchanged.
- Git: no `git add`, no commit, no push.

## Answer Increase
- Before answered count: 1982
- After answered count: 1986
- Net answer increase: 4
- Added direct JS-only answers:
  - `공통수학1_경우의 수` id 38 / displayNo 0038: `30`
  - `공통수학1_경우의 수` id 75 / displayNo 0075: `144`
  - `공통수학1_경우의 수` id 97 / displayNo 0097: `720`
  - `공통수학1_다항식` id 157 / displayNo 0157: `3`

## Reclassification
- Report: `archive/textbook/reports/maple_synergy_manual_review_reclassification_20260526.json`
- `pure_calculation_or_objective_answer_added`: 4
- `image_required`: 686
- `answer_source_remap_required`: 315
- `content_empty`: 10
- `final_hold`: 192
- `direct_solve_uncertain`: not used.

## Verification
- `node --check` on all 7 target JS files: PASS (exit 0, no syntax output)
- Parse scan on all 7 target JS files: PASS
- Protected scan: PASS, protectedViolations = 0
- Verify-only scan after write:
  - files: 7 target JS files
  - answered: 1986
  - remaining missing answer: 1203
  - protectedViolations: 0

## Files Written
- Updated JS answer fields only in:
  - `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js`
  - `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_다항식_문제집대단원_고1.js`
- Generated report:
  - `archive/textbook/reports/maple_synergy_manual_review_reclassification_20260526.json`
- Helper used:
  - `archive/textbook/tools/reclassify-maple-manual-review-answer-only.mjs`

# CODEX_RESULT - 2026-05-26 Maple Synergy Answer Source Crosscheck

## Scope
- Target: `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/*.js`
- Target: `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/*.js`
- Method: full-page crop inventory + quick-answer PDF extraction + existing answer anchor offsets.
- Rule followed: no JS-only direct solving for new fills; `answer` only was changed in workbook JS.
- Git: no `git add`, no commit, no push.

## Source Inventory Checked
- Operating JS files: 7.
- Full page crop source: `generated/review_pack/by_unit_fresh/**/page_full_images/*.png`.
- Question crop source: `generated/review_pack/**`, `generated/work/**` question crop/image candidates.
- Quick answer source: `archive/textbook/22개정_마플시너지_공통수학2_빠른정답.pdf`.
- Answer/solution sources checked in inventory: `*_정답.pdf`, `*_해설.pdf`, `generated/reports/*answer*.json`.
- Reports with source paths:
  - `archive/textbook/reports/maple_synergy_answer_source_inventory.json`
  - `archive/textbook/reports/maple_synergy_missing_answer_worklist.json`
  - `archive/textbook/reports/maple_synergy_answer_source_crosscheck_report.json`

## Answer Increase
- Missing answer before this source-search pass: 1203.
- Missing answer after this source-search pass: 931.
- Net new answers added from sources: 272.
- First pass: 75 answers from quick-answer PDF + full page crop crosscheck.
- Second pass: 197 answers from quick-answer PDF + full page crop crosscheck.
- Source type counts:
  - `answer_source`: 272
  - `solution_lookup`: 0
  - `crop_answer_crosscheck`: 272
  - `direct_solve`: 0
- Full page crop used: 272.
- Question crop used as direct existing path: 0.
- Quick answer used: 272.
- Answer solution crop/report used for fills: 0.
- Solution material used for fills: 0.

## Remaining Manual Review
- Remaining manual review after full source search: 931.
- Remaining reason counts:
  - `answer_source_unreadable`: 909
  - `answer_source_not_found_after_full_search`: 22
- Broad `answer_source_missing` and `direct_solve_uncertain`: not used.
- Remaining details: `archive/textbook/reports/maple_synergy_remaining_manual_review_after_source_search.json`.

## Files Written
- Updated workbook JS answer fields in common2 source-mapped files.
- Generated/updated:
  - `archive/textbook/reports/maple_synergy_answer_source_inventory.json`
  - `archive/textbook/reports/maple_synergy_missing_answer_worklist.json`
  - `archive/textbook/reports/maple_synergy_answer_source_crosscheck_report.json`
  - `archive/textbook/reports/maple_synergy_answer_fill_from_images_and_solutions_report.json`
  - `archive/textbook/reports/maple_synergy_remaining_manual_review_after_source_search.json`
  - `archive/textbook/reports/maple_synergy_answer_protected_scan.json`
  - `archive/textbook/22개정_마플시너지_공통수학1/generated/reports/pipeline_book_summary.json`
  - `archive/textbook/22개정_마플시너지_공통수학2/generated/reports/pipeline_book_summary.json`
- Helper used:
  - `archive/textbook/tools/maple-synergy-answer-source-crosscheck.mjs`

## Verification
- `node --check` on helper script: PASS.
- `node --check` on all 7 target JS files: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 2258, missing 931.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>` scan: 0.
- Broken replacement-character pattern in answer values: 0.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Textbook Pipeline Source Crosscheck Upgrade

## Modified Files
- `archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/04b-question-id-mapping-guard.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/08c-source-inventory.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10c-answer-fill-and-verify.mjs`
- `archive/textbook/tools/textbook-pipeline/lib/source-crosscheck-utils.mjs`
- `archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`

## Pipeline Changes
- Added `08C source-inventory` to oneclick after `08B` and before `09`; production mode includes it.
- Added shared source/crosscheck utility for:
  - `generated/reports/source_inventory_report.json`
  - `generated/reports/question_source_crosscheck_report.json`
  - `generated/reports/answer_source_crosscheck_report.json`
  - `generated/reports/answer_fill_from_sources_report.json`
  - `generated/reports/remaining_manual_review_after_full_source_search.json`
- `04B` now builds source inventory and question source crosscheck when `jsDir` is available.
- `10B` now applies content/choices only when full-page source crosscheck exists; question crop is zoom evidence only.
- `10C` now fills only missing `answer`, requires question source crosscheck before answer-source application, and writes precise remaining reasons.
- `direct_solve` is last resort only when `allowDirectSolveAfterSourceSearch=true`; production no longer falls through to JS solving by default.

## Source/Fallback Coverage
- Source inventory scans operating JS, full page crops, question crops, visual crops, quick answer PDFs/reports, answer PDFs, solution PDFs, answer_solution_crop reports, answer candidate pages, and generated answer/solution reports.
- Answer priority encoded: quick answer -> answer PDF -> solution PDF -> answer_solution_crop -> crop/full-page crosscheck -> generated reports -> direct_solve.
- DisplayNo-only answer evidence is rejected unless full page/question crop source crosscheck succeeds.
- `image_required`-style items are represented through question/full-page/visual crop candidates instead of being left without image search.
- Pipeline summary now receives source metrics including crop counts, source counts, answer source counts, direct solve count, and `remaining_by_precise_reason`.

## Tests
- Command: `node --test archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`
- Result: PASS, 19/19 tests.
- Added coverage for source inventory, no displayNo-only answer fill, quick answer + crop crosscheck answer fill, solution PDF/answer_solution_crop fallback inventory, direct_solve last resort, protected-field preservation, and image/crop re-search.

## Sample Run / Verification
- `node --check` on modified pipeline JS/test files: PASS.
- questionBank parse sample on current Maple Synergy JS: PASS, files 7, total 3189, answered 2258, missing answer 931.
- Current Maple Synergy empty content: 10.
- Current Maple Synergy content image path / `<img>`: 0.
- Current Maple Synergy broken content pattern: 0.
- Current Maple Synergy broken answer pattern: 2 pre-existing values (`??, ??, ??` at common2 set/logic ids 503 and 514); this task did not modify workbook JS.
- String.replace `$` replacement scan: PASS; replacement-safe function form remains in `12d-apply-gemini-formula-patches.mjs`.
- Protected field verification: covered by tests and no workbook JS edits in this task.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Maple Synergy Answer/Solution Source Continuation

## Scope
- Target: remaining missing answers in Maple Synergy Common Math 1/2 workbook JS.
- Allowed JS mutation: `answer` only.
- Protected fields kept unchanged: `content`, `choices`, `id`, `displayNo`, `setKey`, `sourceQuestionNo`, order, metadata, tags, standardUnit, image, solution.
- Git: no `git add`, no commit, no push.

## Sources Opened / Checked
- Quick answer PDF/table: rechecked; remaining common2 quick entries are mostly solution-reference/unreadable tokens.
- Answer PDF: opened and used `archive/textbook/22개정_마플시너지_공통수학1_정답.pdf`.
- Solution PDF: opened `archive/textbook/22개정_마플시너지_공통수학2_해설.pdf`; pypdf text extraction was empty because pages are image/JBIG2-based.
- `answer_solution_crop_report`: opened; no usable applied crop rows.
- `answer_solution_crop` images: 0 usable local crop images found for these remaining rows.
- Generated answer reports opened: 12.
- Full page crops crosschecked for applied rows: 7.

## Answer Increase
- Before: answered 2258, missing 931.
- After: answered 2265, missing 924.
- Newly filled: 7.
- Source type:
  - `answer_pdf`: 7
  - `solution_pdf`: 0
  - `answer_solution_crop`: 0
  - `generated_answer_report`: 0
  - `direct_solve`: 0
- Applied report: `archive/textbook/reports/maple_synergy_answer_fill_from_answer_solution_sources_report.json`.

## Remaining
- Remaining missing answer: 924.
- Remaining reasons:
  - `answer_source_unreadable`: 840
  - `final_hold_after_all_sources_checked`: 84
- Remaining report: `archive/textbook/reports/maple_synergy_remaining_after_answer_solution_source_search.json`.

## Verification
- `node --check` on all 7 target JS files: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 2265, missing 924.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>`: 0.
- Broken content pattern: 0.
- Broken answer pattern: 2 pre-existing values remain in already-answered common2 items; this pass did not modify them.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Maple Synergy RapidOCR Solution Fill

## Scope
- Continued remaining Maple Synergy Common Math 1/2 missing-answer work after installing PDF/OCR tools.
- Allowed workbook mutation followed: `answer` only.
- Git: no `git add`, no commit, no push.

## Sources Used
- PDF renderer: PyMuPDF.
- OCR engine used: RapidOCR.
- Solution PDF OCR material opened/rendered:
  - `archive/textbook/reports/solution_ocr_target_pages/p002.json`
  - `archive/textbook/reports/solution_ocr_target_pages/p002.png`
  - `archive/textbook/reports/solution_ocr_target_pages/p026.json`
  - `archive/textbook/reports/solution_ocr_target_pages/p026.png`
- Solution OCR pages prepared in this workspace: 17 target JSON pages and 14 sample JSON pages.
- Applied solution pages used for answer fill: 2.
- Full page crop crosschecks used: 2.
- Question crop crosschecks used: 2.
- answer_solution_crop used for newly filled rows: 0.
- Direct solve used: 0.

## Answer Increase
- Before this pass: answered 2265, missing 924.
- After this pass: answered 2267, missing 922.
- Newly filled: 2.
- Source type:
  - `solution_pdf`: 2
  - `answer_solution_crop`: 0
  - `generated_answer_report`: 0
  - `direct_solve`: 0
- Newly filled rows:
  - Common Math 2 / geometry / displayNo `0005`: answer `⑤`, crosschecked from solution OCR final value `BC=sqrt(61)` plus JS choice ⑤ `$\\sqrt{61}$`, question crop, and full page crop.
  - Common Math 2 / geometry / displayNo `0074`: answer `④`, crosschecked from solution OCR page 26 answer token plus question crop and full page crop.

## Reports
- Fill report: `archive/textbook/reports/maple_synergy_answer_fill_from_rapidocr_solution_report.json`.
- Remaining report: `archive/textbook/reports/maple_synergy_remaining_after_rapidocr_solution_search.json`.
- Protected scan: `archive/textbook/reports/maple_synergy_rapidocr_solution_protected_scan.json`.

## Remaining
- Remaining missing answer: 922.
- Remaining reason count in this pass report:
  - `final_hold_after_all_sources_checked`: 922
- Broad `answer_source_unreadable` rows were not carried forward in this pass report; rows are now listed with checked source categories after OCR/source search.

## Verification
- `node --check` on all 7 target workbook JS files: PASS.
- `node --check archive/textbook/tools/maple-synergy-fill-from-rapidocr-solution.mjs`: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 2267, missing 922.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>`: 0.
- Broken content pattern: 0.
- Broken answer pattern: 2 pre-existing already-answered values remain at common2 ids 503 and 514; this pass did not modify them.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Maple Synergy Common1 Answer PDF OCR

## Correction
- Common Math 1 answer PDF had pypdf text extraction count 0, so I rendered the PDF pages and ran RapidOCR instead of stopping.
- Render/OCR directory: `archive/textbook/reports/common1_answer_pdf_rapidocr_pages`.
- Applied answers only where the answer-table OCR row matched displayNo and question crop/full page crop evidence existed.

## Answer Increase
- Before this Common1 OCR pass: answered 3011, missing 178.
- After this Common1 OCR pass: answered 3065, missing 124.
- Newly filled: 54.
- Newly filled by unit:
  - 합의 법칙과 곱의 법칙: 26
  - 다항식: 3
  - 행렬과 그 연산: 25
- Source type:
  - `answer_pdf_ocr`: 54
  - `direct_solve`: 0

## Remaining
- Remaining missing answer: 124.
- Remaining by unit:
  - 합의 법칙과 곱의 법칙: 16
  - 다항식: 5
  - 행렬과 그 연산: 9
  - 도형의 방정식: 19
  - 집합과 명제: 24
  - 함수와 그래프: 51

## Reports
- Common1 OCR apply report: `archive/textbook/reports/maple_synergy_common1_answer_pdf_ocr_apply_report.json`.
- Common1 OCR candidates: `archive/textbook/reports/maple_synergy_common1_answer_pdf_ocr_candidates.json`.
- Remaining report: `archive/textbook/reports/maple_synergy_remaining_after_common1_answer_pdf_ocr.json`.
- Protected scan: `archive/textbook/reports/maple_synergy_common1_answer_pdf_ocr_protected_scan.json`.

## Verification
- `node --check` on all 7 target workbook JS files: PASS.
- `node --check archive/textbook/tools/maple-synergy-apply-common1-answer-pdf-ocr.mjs`: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 3065, missing 124.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>`: 0.
- Broken content pattern: 0.
- Broken answer pattern: 2 pre-existing already-answered values remain at common2 ids 503 and 514; this pass did not modify them.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Maple Synergy Bulk Answer Recovery

## Correction
- User was right that filling only 22 answers did not justify installing OCR/PDF tools.
- Expanded source use:
  - RapidOCR/PyMuPDF solution OCR pages prepared: 235 expanded pages total after OCRing `p066` through `p300`.
  - Common Math 2 quick answer PDF parsed into `archive/textbook/reports/maple_synergy_common2_quick_answer_entries.json`.
  - Applied only to rows where unit offset, quick answer token, question crop, and full page crop were all available.
- Direct solve remained unused.

## Answer Increase
- Before bulk pass: answered 2303, missing 886.
- After bulk pass: answered 3011, missing 178.
- Newly filled in bulk pass: 708.
- Newly filled by unit:
  - 도형의 방정식: 143
  - 집합과 명제: 201
  - 함수와 그래프: 364
- Newly filled since the complaint: 744.
- Source types:
  - quick answer + full page/question crop crosscheck: 708
  - strict solution OCR circled answer: 14
  - confirmed solution page visual/OCR: 22
  - direct_solve: 0

## Remaining
- Remaining missing answer: 178.
- Remaining by unit:
  - 합의 법칙과 곱의 법칙: 42
  - 다항식: 8
  - 행렬과 그 연산: 34
  - 도형의 방정식: 19
  - 집합과 명제: 24
  - 함수와 그래프: 51
- Common Math 1 answer PDF text extraction returned 0 entries, so those rows still require image/OCR extraction from the answer PDF/crops.

## Reports
- Bulk quick/crop report: `archive/textbook/reports/maple_synergy_quick_answer_crosschecked_bulk_apply_report.json`.
- Bulk remaining report: `archive/textbook/reports/maple_synergy_remaining_after_quick_answer_crosschecked_bulk.json`.
- Bulk protected scan: `archive/textbook/reports/maple_synergy_quick_answer_crosschecked_bulk_protected_scan.json`.
- OCR candidates: `archive/textbook/reports/maple_synergy_solution_ocr_answer_candidates.json`.

## Verification
- `node --check` on all 7 target workbook JS files: PASS.
- `node --check archive/textbook/tools/maple-synergy-apply-quick-answer-crosschecked-bulk.mjs`: PASS.
- `node --check archive/textbook/tools/maple-synergy-apply-strict-solution-ocr-candidates.mjs`: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 3011, missing 178.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>`: 0.
- Broken content pattern: 0.
- Broken answer pattern: 2 pre-existing already-answered values remain at common2 ids 503 and 514; this pass did not modify them.
- `git add` / commit / push: not run.

# CODEX_RESULT - 2026-05-26 Maple Synergy RapidOCR Expansion

## Correction
- The initial RapidOCR pass was too small: only 2 answers. I expanded the actual OCR/search work instead of leaving the install underused.
- Additional solution PDF pages rendered/OCRed: 75 pages (`p066` through `p140`) into `archive/textbook/reports/solution_ocr_expanded_pages`.
- Confirmed by opening solution page images and checking the printed `정답` marker against JS displayNo/question crop/full page crop.

## Answer Increase
- Before this expansion pass: answered 2267, missing 922.
- After first confirmed-page pass: answered 2276, missing 913.
- After expanded OCR confirmed-page pass: answered 2289, missing 900.
- Newly filled after the complaint: 22.
- Source type:
  - `solution_pdf`: 22
  - `answer_solution_crop`: 0
  - `direct_solve`: 0
- Full page crop crosschecks used in confirmed-page reports: 22.
- Question crop crosschecks used in confirmed-page reports: 22.

## Newly Filled Examples
- `0071=①`, `0073=①`, `0077=⑤`, `0124=④`, `0155=④`, `0156=①`, `0158=②`, `0159=③`, `0160=②`.
- Expanded OCR/page-image confirmed: `0162=②`, `0186=①`, `0193=①`, `0210=①`, `0216=①`, `0222=②`, `0224=①`, `0240=③`, `0250=①`, `0267=①`, `0271=②`, `0275=③`, `0327=①`.

## Reports
- Confirmed page fill report: `archive/textbook/reports/maple_synergy_confirmed_solution_page_answer_fill_report.json`.
- Remaining report: `archive/textbook/reports/maple_synergy_remaining_after_confirmed_solution_pages.json`.
- Protected scan: `archive/textbook/reports/maple_synergy_confirmed_solution_page_protected_scan.json`.
- Expanded OCR evidence directory: `archive/textbook/reports/solution_ocr_expanded_pages`.

## Verification
- `node --check` on all 7 target workbook JS files: PASS.
- `node --check archive/textbook/tools/maple-synergy-fill-confirmed-solution-page-answers.mjs`: PASS.
- `node --check archive/textbook/tools/maple-synergy-fill-from-rapidocr-solution.mjs`: PASS.
- questionBank parse: PASS, files 7, total 3189, answered 2289, missing 900.
- Protected scan: PASS, protectedFieldChangeCount 0.
- content image path / `<img>`: 0.
- Broken content pattern: 0.
- Broken answer pattern: 2 pre-existing already-answered values remain at common2 ids 503 and 514; this pass did not modify them.
- `git add` / commit / push: not run.

## 7. 검수팩
- 생성 경로: C:\Users\USER\Downloads\AP------_CODEX_REVIEW_PACK_20260526_152546.zip
- 최신 경로 기록 파일: C:\Users\USER\Downloads\LATEST_CODEX_REVIEW_PACK.txt
- 검수 메시지 파일: C:\Users\USER\Downloads\LATEST_CODEX_REVIEW_MESSAGE.txt
- 포함 기준: git status 기준 변경/신규/rename 파일 + CODEX_RESULT*.md + git status/diff 자료 + 00_READ_ME_FIRST_REVIEW.md + REVIEW_REQUEST.md
- 제외 기준: 민감정보 파일, 민감정보 의심 문자열 파일, 대형 파일, node_modules/.git/dist/build/vendor/backup 계열 폴더
- 생성 시각: 20260526_152546

