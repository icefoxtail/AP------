# CODEX_RESULT

## 1. 생성/수정 파일
- 생성:
  - `eie/index.html`
  - `eie/css/eie.css`
  - `eie/js/eie-app.js`
  - `eie/js/eie-state.js`
  - `eie/js/eie-router.js`
  - `eie/js/eie-api.js`
  - `eie/js/views/eie-dashboard.js`
  - `eie/js/views/eie-timetable.js`
  - `eie/js/views/eie-import.js`
  - `eie/js/views/eie-student-seeds.js`
  - `eie/js/utils/eie-normalize.js`
  - `apmath/worker-backup/worker/routes/eie.js`
  - `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`
  - `docs/EIE_FORK_STRUCTURE.md`
  - `docs/EIE_TIMETABLE_DATA_MODEL.md`
- 수정:
  - `apmath/js/dashboard.js`
  - `apmath/worker-backup/worker/index.js`
  - `CODEX_RESULT.md`

## 2. 기존 작업물 확인
- 작업 시작 시 git status:
  - `CODEX_RESULT.md`, `CODEX_TASK.md`, `apmath/index.html`, `apmath/js/core.js`, `apmath/js/dashboard.js`, `apmath/js/ui.js`, `apmath/worker-backup/worker/index.js` 수정 상태
  - `apmath/css/eie.css`, `apmath/js/modules/eie/*`, EIE 문서/route/migration/review-pack 신규 상태
- 이미 존재하던 EIE 관련 파일:
  - `apmath/js/modules/eie/*`
  - `apmath/css/eie.css`
  - `docs/EIE_ONBOARDING_STRUCTURE.md`
  - `docs/EIE_TIMETABLE_CELL_MODEL.md`
  - `apmath/worker-backup/worker/routes/eie.js`
  - `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`
- 기존 AP Math 파일에 들어가 있던 EIE 관련 변경:
  - `apmath/index.html`의 EIE CSS/JS 로드
  - `apmath/js/core.js`의 EIE unit state 및 홈 렌더 분기
  - `apmath/js/ui.js`의 EIE 전환 drawer 및 goHome 분기
  - `apmath/js/dashboard.js`의 EIE 전환 UI
- 살린 작업:
  - EIE 3개 준비 화면, API wrapper, state/router/view 분리, CSS prefix, 데이터 모델 초안
- 이동/분리한 작업:
  - `apmath/js/modules/eie/*`와 `apmath/css/eie.css`를 `eie/` 독립 fork 구조로 재배치
  - 문서를 `docs/EIE_FORK_STRUCTURE.md`, `docs/EIE_TIMETABLE_DATA_MODEL.md`로 정리
- 되돌리거나 범위를 줄인 작업:
  - AP Math index/core/ui에서 EIE 로딩, EIE state, EIE renderer 의존 제거

## 3. 구조 정리 결과
- AP Math 실제 진입 구조:
  - 기존 `apmath/index.html` 유지
  - AP Math 대시보드 상단에 `../eie/index.html`로 이동하는 최소 링크만 추가
- EIE fork 생성 위치:
  - `eie/`
- EIE 전용 JS 구조:
  - `eie/js/eie-app.js`
  - `eie/js/eie-state.js`
  - `eie/js/eie-router.js`
  - `eie/js/eie-api.js`
  - `eie/js/views/*`
  - `eie/js/utils/eie-normalize.js`
- EIE 전용 CSS 구조:
  - `eie/css/eie.css`
  - `eie-` prefix만 사용
- EIE API wrapper/stub:
  - frontend wrapper: `eie/js/eie-api.js`
  - backend stub namespace: `/api/eie/import/latest`, `/api/eie/timetable`, `/api/eie/student-seeds`
- 원장/학원 선택 진입 연결 위치:
  - AP Math: `apmath/js/dashboard.js`의 EIE 링크
  - EIE: `eie/index.html`의 AP Math 링크

## 4. 구현 완료 또는 확인 완료
- AP Math / EIE 이동 구조:
  - AP Math에서 EIE fork로 이동 가능
  - EIE fork에서 AP Math로 복귀 가능
- EIE 홈:
  - `eie/index.html` + dashboard view
- EIE 시간표 준비 화면:
  - `eie/js/views/eie-timetable.js`
- EIE 원장 가져오기 준비 화면:
  - `eie/js/views/eie-import.js`
- EIE 학생 seed 준비 화면:
  - `eie/js/views/eie-student-seeds.js`
- EIE 데이터 모델 문서:
  - `docs/EIE_TIMETABLE_DATA_MODEL.md`
- 기존 AP Math 흐름 보존:
  - AP Math index/core/ui의 EIE 직접 로딩과 상태 분기를 제거
  - AP Math 학생/시간표/출석/리포트 로직 미수정

## 5. 실행 결과
- node --check:
  - 통과: `apmath/js/core.js`
  - 통과: `apmath/js/dashboard.js`
  - 통과: `apmath/js/ui.js`
  - 통과: `apmath/worker-backup/worker/index.js`
  - 통과: `apmath/worker-backup/worker/routes/eie.js`
  - 통과: `eie/js/eie-app.js`
  - 통과: `eie/js/eie-state.js`
  - 통과: `eie/js/eie-router.js`
  - 통과: `eie/js/eie-api.js`
  - 통과: `eie/js/utils/eie-normalize.js`
  - 통과: `eie/js/views/eie-dashboard.js`
  - 통과: `eie/js/views/eie-timetable.js`
  - 통과: `eie/js/views/eie-import.js`
  - 통과: `eie/js/views/eie-student-seeds.js`
- build/test:
  - 실행 불가: root, `apmath`, `eie`, `apmath/worker-backup/worker` 모두 `package.json` 없음
- 정적 경로 확인:
  - 확인: `eie/index.html`
  - 확인: `eie/css/eie.css`
  - 확인: `eie/js/*` script 경로
  - 확인: `eie/index.html`의 `../apmath/index.html` 링크
- 기타 검증:
  - `apmath/index.html`, `apmath/js/core.js`, `apmath/js/ui.js`에는 EIE 로드/상태/렌더 의존 내용 diff 없음

## 6. 결과 요약
- 이번 보정에서 실제로 동작하는 것:
  - AP Math 대시보드에서 EIE fork로 이동
  - EIE 독립 화면에서 AP Math로 복귀
  - EIE 홈과 3개 준비 화면 표시
  - EIE API wrapper의 stub fallback
  - worker `/api/eie/*` stub route
- stub 또는 다음 라운드로 넘긴 것:
  - 영어 원장 parser
  - 실제 원장 업로드
  - 학생 seed 자동 생성
  - EIE 학생/반 확정
  - 출석, 숙제, 교재, 리포트, 상담, 문자, 결제
- 주의사항:
  - `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`은 proposal only이며 D1에 적용하지 않음
  - `CODEX_TASK.md`는 작업 전부터 수정 상태였고 이번 작업 결과로 대체하지 않음

## 7. 다음 조치
- Round 1에서 할 일:
  - 개인정보 제거된 영어 원장 fixture 확보
  - EIE timetable parser 입출력 계약 확정
  - `eie_timetable_cells` 저장/미리보기 흐름 설계
- 영어 원장 fixture를 삽입할 위치:
  - git에는 포함하지 않는 로컬 전용 fixture 폴더 필요
- EIE 시간표 parser 전 확인할 구조:
  - 요일, 교시, 시간, 선생님, 반명, 학생 영역의 엑셀 좌표 규칙
- AP Math 복사본에서 추가로 제거/격리 처리할 AP Math 전용 기능:
  - 현재 EIE fork에는 AP Math OMR/archive/report/attendance/homework 코드를 복사하지 않음
- 학생 seed/전화번호 seed 구현 전 결정할 정책:
  - 전화번호 정규화
  - 전화번호 없는 학생 candidate key
  - 동명이인 후보 처리

## 8. 자체 검수
- codex-self-audit 결과:
  - EIE frontend는 `eie/`로 분리됨
  - AP Math는 EIE JS/CSS를 로드하지 않음
  - AP Math 전역 state에 EIE unit state를 추가하지 않음
  - AP Math 기능 로직은 변경하지 않음
  - EIE CSS는 AP Math 전역 button/table/body를 수정하지 않음
  - 개인정보 fixture를 추가하지 않음
  - git add/commit/push를 수행하지 않음
- 발견 후 보정한 문제:
  - AP Math 내부 EIE modules 구조를 별도 fork 구조로 이동
  - 필수 문서명을 `EIE_FORK_STRUCTURE.md`, `EIE_TIMETABLE_DATA_MODEL.md`로 정리
- 남은 위험:
  - 실제 브라우저 렌더링 육안 검증은 수행하지 못함
  - `apmath/index.html`, `apmath/js/core.js`, `apmath/js/ui.js`는 내용 diff는 없지만 작업 중 줄바꿈 상태가 mixed로 감지됨

## 9. 검토팩
- codex-work-review-pack 생성 zip 경로:
  - `docs/review-packs/eie-fork-round0-review-pack-20260528.zip`
- 개인정보 파일 제외 여부:
  - 제외함. 영어 원장 fixture 및 개인정보 파일 없음
- 프로젝트 전체 청소 금지 준수 여부:
  - 준수함. 전체 정리/삭제는 하지 않고 EIE 보정 범위만 작업함

# CODEX_RESULT_APPEND - EIE Round 0 Final Closeout

## 1. 현재 git 상태
- git status:
  - modified: `CODEX_RESULT.md`, `CODEX_TASK.md`, `apmath/index.html`, `apmath/js/core.js`, `apmath/js/dashboard.js`, `apmath/js/ui.js`, `apmath/worker-backup/worker/index.js`
  - untracked: `eie/*`, `apmath/worker-backup/worker/routes/eie.js`, `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`, `docs/EIE_FORK_STRUCTURE.md`, `docs/EIE_TIMETABLE_DATA_MODEL.md`, review-pack zips
- git diff --stat:
  - content diff remains in `CODEX_RESULT.md`, `CODEX_TASK.md`, `apmath/js/dashboard.js`, `apmath/worker-backup/worker/index.js`
  - `apmath/index.html`, `apmath/js/core.js`, `apmath/js/ui.js` are dirty by line-ending state only; content diff is empty
- git diff --name-only:
  - `CODEX_RESULT.md`
  - `CODEX_TASK.md`
  - `apmath/js/dashboard.js`
  - `apmath/worker-backup/worker/index.js`

## 2. Round 0 완료 기준 확인
- EIE fork 구조:
  - PASS. `eie/index.html`, `eie/css/eie.css`, `eie/js/*`, `eie/js/views/*`, `eie/js/utils/eie-normalize.js` exist.
  - EIE does not directly load AP Math JS/CSS.
- AP Math -> EIE 이동 구조:
  - PASS. `apmath/js/dashboard.js` contains only a minimal `../eie/index.html` link.
  - EIE -> AP Math return link exists in `eie/index.html` as `../apmath/index.html`.
- EIE 홈/준비 화면:
  - PASS. Dashboard, English timetable, workbook import, and student seed placeholder screens exist.
  - No attendance, homework, textbook, report, counseling, message, or payment implementation was added.
- AP Math 원본 보존:
  - PASS. `apmath/index.html`, `apmath/js/core.js`, and `apmath/js/ui.js` contain no EIE load/state/render dependency.
  - AP Math student/timetable/attendance/report/archive/OMR logic was not changed.
  - `archive/engine.html` and `archive/mixed_engine.html` exist.
- CSS 오염 방지:
  - PASS. EIE CSS is under `eie/css/eie.css` and is only loaded by `eie/index.html`.
  - EIE CSS uses `eie-` classes for app UI. It has fork-local `body` and `*` base rules, but they are not loaded by AP Math.
- localStorage namespace:
  - PASS. EIE fork does not create localStorage keys.
  - Existing AP Math keys remain unchanged. Docs specify future EIE keys must use `WANGJI_*`.
- Worker/API stub:
  - PASS. `/api/eie/import/latest`, `/api/eie/timetable`, `/api/eie/student-seeds` are Round 0 stubs.
  - `routes/eie.js` contains no `DB.prepare` calls.
- 문서:
  - PASS. `docs/EIE_FORK_STRUCTURE.md` and `docs/EIE_TIMETABLE_DATA_MODEL.md` exist.
  - Docs now state the timetable design is deferred until after Claude review and Round 1.
  - Docs state schedule membership seeds can keep denormalized timetable context fields.

## 3. 시간표 설계 보류 확인
- Claude 설계 검토 이후로 남긴 항목:
  - Detailed EIE timetable design.
  - Timetable parser input/output contract.
  - Excel/latest-sheet detection.
  - Student identity seed and schedule membership seed generation rules.
- 이번 Round 0에서 구현하지 않은 항목:
  - timetable parser
  - Excel import/upload
  - latest sheet detection
  - timetable cell auto extraction
  - student seed automation
  - phone-number seed automation
  - EIE student/class confirmation
- 문서 반영 여부:
  - PASS. Deferral language was added to both EIE docs.

## 4. 검증 실행 결과
- node --check:
  - PASS: `apmath/js/dashboard.js`
  - PASS: `apmath/js/core.js`
  - PASS: `apmath/js/ui.js`
  - PASS: `apmath/worker-backup/worker/index.js`
  - PASS: `apmath/worker-backup/worker/routes/eie.js`
  - PASS: `eie/js/eie-app.js`
  - PASS: `eie/js/eie-state.js`
  - PASS: `eie/js/eie-router.js`
  - PASS: `eie/js/eie-api.js`
  - PASS: `eie/js/utils/eie-normalize.js`
  - PASS: `eie/js/views/eie-dashboard.js`
  - PASS: `eie/js/views/eie-timetable.js`
  - PASS: `eie/js/views/eie-import.js`
  - PASS: `eie/js/views/eie-student-seeds.js`
- 정적 경로 확인:
  - PASS: all required `eie/*` paths
  - PASS: `archive/engine.html`
  - PASS: `archive/mixed_engine.html`
- npm test/build:
  - Not run. `package.json` is absent at root, `apmath`, `eie`, and `apmath/worker-backup/worker`.

## 5. 검토팩
- 기존 검토팩 존재 여부:
  - exists: `docs/review-packs/eie-fork-round0-review-pack-20260528.zip`
- 기존 검토팩 사용 가능 여부:
  - Partial. It contains the EIE essentials and not the whole project, but a final closeout pack is regenerated after this append and doc closeout.
- 새로 생성한 검토팩 경로:
  - `docs/review-packs/eie-fork-round0-final-review-pack-20260528.zip`
- 개인정보 파일 제외 여부:
  - PASS. No English workbook fixture or personal-data file included.
- 프로젝트 전체 청소 금지 준수 여부:
  - PASS. No whole-project cleanup was performed.

## 6. 최종 판정
- Round 0 PASS 후보.
- 보정 필요:
  - No Round 0 functional correction remains.
  - Residual caution: `apmath/index.html`, `apmath/js/core.js`, and `apmath/js/ui.js` are marked dirty by line-ending state even though their content diff is empty.

## 7. 다음 라운드로 남긴 내용
- Claude에게 맡길 시간표 설계:
  - EIE timetable structure review and final Round 1 data contract.
- Round 1에서 받을 영어 원장 fixture:
  - Personal-data-redacted workbook fixture only.
- Round 1에서 확인할 원장 구조:
  - day, period, start/end time, teacher, class label, room, student rows, notes, phone columns.
- Round 2에서 구현할 parser 후보:
  - timetable cell extraction parser after Round 1 contract approval.
- 학생 seed/전화번호 seed 정책 확정 필요 항목:
  - normalized phone format
  - candidate key without phone
  - duplicate names
  - schedule membership review states

## 8. 자체 검수
- codex-self-audit 결과:
  - PASS. Round 0 is limited to fork boundary, placeholder screens, docs, stubs, and review pack.
  - PASS. No parser/upload/seed automation was implemented.
  - PASS. No git add/commit/push was run.
- 발견한 문제:
  - Docs were missing explicit Claude deferral, `WANGJI_*` future storage guidance, and denormalized schedule-seed context wording.
- 이번 작업 범위 안에서 보정한 문제:
  - Added only minimal doc wording for the missing Round 0 closeout requirements.
- 다음 라운드로 남긴 위험:
  - Browser visual render was not executed in this closeout.
  - Real workbook shape is still unknown until fixture/Claude review.

## 9. 검토팩 경로
- 최종 검토팩:
  - `docs/review-packs/eie-fork-round0-final-review-pack-20260528.zip`

# CODEX_RESULT_APPEND - EIE Independent Round 0 Closeout

## 1. EIE 독립 체계 보정
- APMS 하위 모듈 표현 제거:
  - `docs/EIE_FORK_STRUCTURE.md`와 `docs/EIE_TIMETABLE_DATA_MODEL.md`에 EIE가 APMS 하위 모듈이 아니라 Wangji academy umbrella 안의 독립 영어관 운영 앱이라고 명시했다.
- EIE 독립 앱 원칙 반영:
  - AP Math는 구현 방식 참고용이며, EIE가 APMS/AP Math 문서 체계, 시간표 구조, 학생/반 구조를 상위 기준으로 물려받지 않는다고 명시했다.
- APMS 문서/시간표/학생반 구조를 상위 기준으로 읽지 않도록 보정:
  - `source app`, `one AP Math class`, AP Math 원본 기반 화면 문구를 독립 앱/일반 class 표현으로 정리했다.

## 2. 시간표 설계 보류
- Claude 검토 이후 Round 1로 남긴 항목:
  - EIE timetable 상세 설계
  - parser 입력/출력 계약
  - student seed 정책
  - schedule seed 정책
  - candidate_key 정책
  - migration 상세 설계
- Round 0에서 확정하지 않은 항목:
  - parser
  - student seed
  - schedule seed
  - candidate_key
  - migration 상세 설계

## 3. 문구 보정
- "원장 가져오기" 유지 여부:
  - 유지하지 않음.
- "원천 가져오기"로 수정한 파일:
  - `eie/js/views/eie-dashboard.js`
  - `eie/js/views/eie-import.js`
- 추가 보정:
  - EIE dashboard summary에서 AP Math 원본 분리 표현을 독립 영어관 운영 앱 표현으로 바꿈.

## 4. APMS/AP Math 원본 보존 확인
- `apmath/index.html`:
  - EIE JS/CSS 직접 로드 없음.
- `apmath/js/core.js`:
  - EIE state/render 분기 없음.
- `apmath/js/ui.js`:
  - EIE drawer/goHome 분기 없음.
- `apmath/js/dashboard.js`:
  - EIE 이동 링크만 최소로 존재.
- `archive/engine.html`:
  - 존재 확인.
- `archive/mixed_engine.html`:
  - 존재 확인.

## 5. 검증결과
- node --check:
  - PASS: `apmath/js/dashboard.js`
  - PASS: `apmath/js/core.js`
  - PASS: `apmath/js/ui.js`
  - PASS: `apmath/worker-backup/worker/index.js`
  - PASS: `apmath/worker-backup/worker/routes/eie.js`
  - PASS: `eie/js/eie-app.js`
  - PASS: `eie/js/eie-state.js`
  - PASS: `eie/js/eie-router.js`
  - PASS: `eie/js/eie-api.js`
  - PASS: `eie/js/utils/eie-normalize.js`
  - PASS: `eie/js/views/eie-dashboard.js`
  - PASS: `eie/js/views/eie-timetable.js`
  - PASS: `eie/js/views/eie-import.js`
  - PASS: `eie/js/views/eie-student-seeds.js`
- npm test/build:
  - 실행하지 않음. root, `apmath`, `eie`, `apmath/worker-backup/worker`에 `package.json` 없음.

## 6. 검토팩
- 최종 검토팩 경로:
  - `docs/review-packs/eie-round0-independent-closeout-review-pack-20260528.zip`
- 개인정보 파일 제외 여부:
  - 제외함. 영어 원천 fixture 및 개인정보 파일 없음.
- 프로젝트 전체 청소 금지 준수 여부:
  - 준수함.

## 7. 최종 판정
- Round 0 PASS 후보.
- 보정 필요:
  - 없음. 단, `apmath/index.html`, `apmath/js/core.js`, `apmath/js/ui.js`는 내용 diff 없이 line-ending 상태로 dirty 표시가 남아 있다.

# CODEX_RESULT_APPEND - EIE Round 1 Docs and Model Policy

## 1. 현재 git 상태
- git status:
  - modified: `CODEX_RESULT.md`, `CODEX_TASK.md`, `apmath/index.html`, `apmath/js/core.js`, `apmath/js/dashboard.js`, `apmath/js/ui.js`, `apmath/worker-backup/worker/index.js`
  - untracked: EIE app files, EIE docs, EIE route/migration proposal, review-pack zips
  - untracked external review folders observed and left untouched: `claude_eie_structure_files_20260528/`, `claude_eie_structure_review_20260528/`
- git diff --stat:
  - content diff remains in `CODEX_RESULT.md`, `CODEX_TASK.md`, `apmath/js/dashboard.js`, `apmath/worker-backup/worker/index.js`
- git diff --name-only:
  - `CODEX_RESULT.md`
  - `CODEX_TASK.md`
  - `apmath/js/dashboard.js`
  - `apmath/worker-backup/worker/index.js`

## 2. 생성/수정 파일
- 생성:
  - `docs/EIE_WORKING_RULEBOOK.md`
- 수정:
  - `docs/EIE_TIMETABLE_DATA_MODEL.md`
  - `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`
  - `CODEX_RESULT.md`

## 3. EIE_WORKING_RULEBOOK.md 생성
- 독립 앱 원칙:
  - EIE English is an independent English-academy operations app under the Wangji academy umbrella.
  - EIE is not an APMS/AP Math submodule.
- 공유 가능/공유 금지 기준:
  - 공유 가능: static deployment, Worker auth flow, Worker namespace separation, vanilla JS style, quiet UI feel.
  - 공유 금지: APMS `classes`/`class_students`, APMS timetable, APMS classroom headers, APMS OMR/archive/report/problem structures, APMS localStorage keys, APMS math workflows.
- localStorage 정책:
  - EIE must not create new `APMATH_*` keys.
  - Later shared EIE/Wangji state should use `WANGJI_*`.
- import/session 정책:
  - Import results land in staging/seed first.
  - Duplicate `sheet_name + source_month` import sessions are blocked by default.
  - Re-import requires explicit administrator overwrite.
  - Confirmed rows are not overwritten automatically.
  - Whitelist updates re-evaluate selected `needs_review` rows only.
- 개인정보 정책:
  - English workbook fixtures are excluded from git and review packs.
  - Student names, phone numbers, source rows, and workbook excerpts are not copied into docs or result reports.
- 라운드별 범위:
  - Round 0: app boundary, placeholders, Worker stubs.
  - Round 1: rulebook, data model policy, migration proposal naming cleanup.
  - Round 2+: parser/Worker connection and later UI/confirmation phases.
- 라운드별 금지 항목:
  - Round 1 forbids parser implementation, DB application, students/contacts/classroom table creation, and real Worker DB queries.

## 4. EIE_TIMETABLE_DATA_MODEL.md 업데이트
- timetable_cell 기준:
  - Round 1 retains `timetable_cell` as the base timetable unit.
  - `lesson_slot` is treated as the same concept at this stage.
- unique 후보:
  - `import_session_id + period_label + column_index`
  - same-period multi-teacher and multi-column cases are separated by `column_index`.
- staging 흐름:
  - `eie_import_sessions`
  - `eie_timetable_cells`
  - `eie_student_identity_seeds`
  - `eie_student_contact_seeds`
  - `eie_student_schedule_seeds`
- confirmed 운영 데이터 보류:
  - `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`, `eie_classroom_sessions`, `eie_student_session_records` are deferred to Round 5+ and are not created now.
- matched teacher token 정책:
  - Unknown teacher tokens remain `needs_review`.
  - Whitelist updates do not reparse whole sessions.
  - Combined tokens such as `Laura/Zoe` stay raw in `raw_meta_json` and require review.
- 학생/전화번호 정책 보류:
  - Student and phone/contact seed policy is finalized in Round 4 or Round 5.
  - Phone presence does not directly create `eie_students`.
  - Students without phone numbers are not discarded.

## 5. migration proposal 보정
- column_start / column_index 정리:
  - `column_start` and `column_end` were removed from the proposal.
  - `column_index` is now the timetable-cell column discriminator.
- UNIQUE 후보 명시:
  - `UNIQUE(import_session_id, period_label, column_index)`
- proposal only 유지:
  - The SQL file states it is proposal only and must not be applied to D1.
- D1 미적용 확인:
  - No D1 command was run.
  - Local in-memory SQLite syntax check only was run.

## 6. 화면/문구 확인
- 원장/원천 표현 유지 여부:
  - `원장` forbidden wording was not found in the checked EIE docs/views.
- 원천 가져오기 표현 통일:
  - `eie/js/views/eie-dashboard.js`
  - `eie/js/views/eie-import.js`
- 새 기능 호출 없음:
  - No attendance/homework/textbook/report/counseling/message/payment feature was added to EIE screens.

## 7. Worker/API 확인
- `/api/eie/*` stub 유지:
  - `GET /api/eie/import/latest`
  - `GET /api/eie/timetable`
  - `GET /api/eie/student-seeds`
- 실제 DB query 없음:
  - `apmath/worker-backup/worker/routes/eie.js` contains no `DB.prepare`, `SELECT`, `INSERT`, `UPDATE`, or `DELETE`.
- route 순서 변경 없음:
  - Existing route order was not changed beyond the previously added EIE stub branch.
- verifyAuth 패턴 미수정:
  - Round 2 item. Not modified in Round 1.

## 8. 다음 라운드로 남긴 항목
- Round 2 API_BASE 환경 분기:
  - `eie/js/eie-api.js` still has a hardcoded API_BASE and should be split by environment later.
- Round 2 Worker verifyAuth 패턴 통일:
  - Deferred.
- Round 2 parser Worker 연결:
  - Deferred.
- Round 3 import 미리보기 UI:
  - Deferred.
- Round 4 학생 seed 검토 UI:
  - Deferred.
- Round 5 학생/연락처/수업배정 확정:
  - Deferred.
- Round 6 classroom_session:
  - Deferred.

## 9. 검증결과
- node --check:
  - PASS: `apmath/js/dashboard.js`
  - PASS: `apmath/js/core.js`
  - PASS: `apmath/js/ui.js`
  - PASS: `apmath/worker-backup/worker/index.js`
  - PASS: `apmath/worker-backup/worker/routes/eie.js`
  - PASS: `eie/js/eie-app.js`
  - PASS: `eie/js/eie-state.js`
  - PASS: `eie/js/eie-router.js`
  - PASS: `eie/js/eie-api.js`
  - PASS: `eie/js/utils/eie-normalize.js`
  - PASS: `eie/js/views/eie-dashboard.js`
  - PASS: `eie/js/views/eie-timetable.js`
  - PASS: `eie/js/views/eie-import.js`
  - PASS: `eie/js/views/eie-student-seeds.js`
- SQL proposal 확인:
  - PASS: local in-memory SQLite `executescript` syntax check.
- npm test/build:
  - Not run. `package.json` is absent at root, `apmath`, `eie`, and `apmath/worker-backup/worker`.

## 10. 자체 검수
- codex-self-audit 결과:
  - PASS. Round 1 stayed within docs/model/proposal policy scope.
  - PASS. No parser, upload, seed automation, D1 apply, real `eie_*` Worker query, or EIE UI function expansion was implemented.
  - PASS. No APMS/AP Math source behavior was changed in this round.
- 발견한 문제:
  - `column_start`/`column_end` remained in the proposal and were replaced with `column_index`.
  - `docs/EIE_WORKING_RULEBOOK.md` was missing and was created.
- 이번 라운드에서 보정한 문제:
  - Added EIE independent operations rulebook.
  - Updated data model policy for timetable cells, unique hint, staging flow, teacher token review, and deferred confirmed tables.
  - Cleaned proposal SQL naming and uniqueness hint.
- 다음 라운드로 남긴 위험:
  - Hardcoded frontend `API_BASE`.
  - Worker auth pattern cleanup.
  - Real parser/import/session implementation.

## 11. 검토팩
- 생성한 검토팩 경로:
  - `docs/review-packs/eie-round1-docs-model-policy-review-pack-20260528.zip`
- 개인정보 파일 제외 여부:
  - Excluded. No English workbook fixture or personal-data file included.
- 프로젝트 전체 청소 금지 준수 여부:
  - Complied. Existing untracked Claude review folders and old review zips were not cleaned.

## 12. 최종 판정
- Round 1 PASS 후보.
- 보정 필요:
  - None within this task scope.
