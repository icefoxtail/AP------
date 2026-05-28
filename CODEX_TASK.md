cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK — EIE Round 1 독립 운영 룰북 및 import 모델 문서 확정

## 0. 작업 루트

반드시 아래 프로젝트 루트로 이동한 뒤 작업한다.

cd C:\Users\USER\Desktop\AP------

이 작업은 기존 AP 저장소 안에서 진행한다.
academy-os-v2, SaaS React, web-react 프로젝트는 수정하지 않는다.

## 1. 이번 라운드 목적

이번 Round 1은 코드 구현 라운드가 아니다.
이번 Round 1은 EIE 영어관을 APMS/AP Math 하위가 아닌 독립 운영 앱으로 확정하기 위한 문서 정리 라운드다.

Claude 검토 결과 기준으로 현재 Round 0 구조는 유지한다.

현재 유지할 구조:

- `apmath/`
  - APMS/AP Math 수학 전용 운영 체계
- `eie/`
  - EIE 영어관 독립 운영 앱

이번 라운드에서 할 일은 다음 3가지다.

1. `docs/EIE_WORKING_RULEBOOK.md` 신규 생성
2. `docs/EIE_TIMETABLE_DATA_MODEL.md` 업데이트
3. `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`의 `column_start` / `column_index` 표현 정리

이번 라운드에서는 파서, 업로드, DB 저장, UI 확정 기능을 구현하지 않는다.

## 2. 절대 전제

EIE 영어관은 APMS/AP Math의 하위 모듈이 아니다.
EIE는 왕지에듀 안의 독립 영어관 운영 앱이다.

APMS/AP Math에서 참고 가능한 것은 다음 정도다.

- 정적 배포 방식
- Worker 인증 흐름
- Worker API namespace 분리 방식
- 바닐라 JS 구현 방식
- 화면 구성 감각 일부

공유하면 안 되는 것은 다음이다.

- APMS/AP Math 시간표 구조
- APMS/AP Math 학생/반 구조
- APMS/AP Math OMR/archive/문항/리포트 구조
- APMS/AP Math 수학 운영 기준
- APMS/AP Math localStorage key
- APMS/AP Math 클래스룸/출결/리포트 렌더러

EIE는 독립 룰북과 독립 데이터 모델을 기준으로 확장한다.

## 3. 이번 라운드에서 절대 하지 말 것

아래 작업은 절대 하지 않는다.

1. EIE 파서 구현 금지
2. EIE 파서 JS 앱 연결 금지
3. 실제 영어 엑셀 업로드 구현 금지
4. 최신 시트 감지 구현 금지
5. timetable cell 자동 추출 구현 금지
6. 학생 seed 자동 생성 금지
7. 전화번호 seed 자동 생성 금지
8. EIE students / contacts 테이블 생성 금지
9. EIE classroom_session 테이블 생성 금지
10. EIE student_session_record 테이블 생성 금지
11. D1 원격 DB 적용 금지
12. migration 실제 적용 금지
13. Worker에서 실제 `eie_*` DB 쿼리 작성 금지
14. EIE UI 기능 확장 금지
15. 출석/숙제/교재/리포트/수납/문자/포털 구현 금지
16. APMS/AP Math 원본 기능 수정 금지
17. APMS/AP Math 시간표/학생/출결/리포트/아카이브/OMR 로직 수정 금지
18. `apmath/index.html`, `apmath/js/core.js`, `apmath/js/ui.js`에 EIE 코드 재삽입 금지
19. 기존 APMS/AP Math 메뉴명/버튼명/화면명 임의 변경 금지
20. 개인정보 엑셀 fixture git 포함 금지
21. 개인정보 엑셀 fixture 검수팩 포함 금지
22. 프로젝트 전체 압축 금지
23. git add, git commit, git push 금지
24. 검수요청서 작성 금지

## 4. 작업 전 현재 상태 확인

아래 명령을 실행하고 결과를 CODEX_RESULT.md에 기록한다.

git status --short --untracked-files=all
git diff --stat
git diff --name-only

확인할 것:

- `eie/` 독립 앱 구조가 유지되는지
- `apmath/index.html`에 EIE JS/CSS 직접 로드가 없는지
- `apmath/js/core.js`에 EIE state/render 분기가 없는지
- `apmath/js/ui.js`에 EIE drawer/goHome 분기가 없는지
- `apmath/js/dashboard.js`에는 EIE 이동 링크 정도만 남아 있는지
- `apmath/worker-backup/worker/routes/eie.js`는 stub 상태인지
- 개인정보 엑셀 fixture가 프로젝트에 포함되어 있지 않은지
- 기존 review-pack zip을 다시 압축에 중첩하지 않는지

## 5. 신규 문서 생성 — docs/EIE_WORKING_RULEBOOK.md

`docs/EIE_WORKING_RULEBOOK.md`를 새로 생성한다.

이 문서는 EIE 영어관의 독립 운영 룰북이다.
APMS/AP Math 룰북을 상위 기준으로 삼지 않는다.

반드시 포함할 섹션:

### 5-1. EIE 독립 앱 원칙

내용:

- EIE 영어관은 APMS/AP Math의 하위 모듈이 아니다.
- EIE는 왕지에듀 안의 독립 영어관 운영 앱이다.
- APMS/AP Math의 구현 방식은 참고 가능하지만, 시간표/학생/반/리포트/OMR/archive 구조는 공유하지 않는다.
- EIE 문서 체계는 EIE 전용 문서를 기준으로 한다.

### 5-2. 현재 앱 경계

내용:

- `apmath/`는 APMS/AP Math 수학 전용 운영 체계다.
- `eie/`는 EIE 영어관 독립 운영 앱이다.
- APMS 쪽에는 EIE로 이동하는 최소 링크만 허용한다.
- EIE 상태/라우터/렌더러를 APMS core/ui에 섞지 않는다.

### 5-3. 공유 가능 / 공유 금지 기준

공유 가능:

- 정적 배포 방식
- Worker 인증 흐름
- Worker API namespace 분리 방식
- 바닐라 JS 구현 방식
- 일부 디자인 감각

공유 금지:

- APMS `classes` / `class_students` 중심 구조
- APMS timetable 모델
- APMS classroom 렌더러
- APMS OMR/archive/report/문항 구조
- APMS localStorage key
- APMS 수학 전용 업무 흐름

### 5-4. localStorage 네임스페이스 정책

내용:

- EIE 신규 localStorage key는 `APMATH_*`를 사용하지 않는다.
- EIE 또는 왕지에듀 공통 선택 상태는 `WANGJI_*` 네임스페이스를 사용한다.
- 기존 APMS localStorage key를 임의 변경하지 않는다.

### 5-5. import/session 정책

내용:

- EIE 엑셀 import는 운영 데이터에 바로 반영하지 않는다.
- import 결과는 staging/seed로 먼저 저장한다.
- 같은 `sheet_name + source_month` 조합의 import_session 중복은 기본 차단한다.
- 관리자가 명시적으로 덮어쓰기 선택한 경우에만 재임포트한다.
- status가 `confirmed`인 항목은 재파싱으로 덮어쓰지 않는다.
- whitelist 추가로 재평가할 때도 `needs_review` 대상만 선택 재평가한다.

### 5-6. 개인정보 정책

내용:

- 영어 엑셀 fixture는 git에 포함하지 않는다.
- 영어 엑셀 fixture는 검수팩에 포함하지 않는다.
- 학생명/전화번호 원문을 문서나 CODEX_RESULT에 대량 기재하지 않는다.
- fixture가 필요하면 로컬 전용 `.codex-fixtures/eie/` 같은 위치를 사용하되 압축/커밋 제외한다.

### 5-7. 라운드별 범위

아래 순서로 정리한다.

Round 0:
- EIE 독립 앱 경계 생성
- 준비 화면
- Worker stub

Round 1:
- EIE 독립 운영 룰북 확정
- DATA_MODEL 업데이트
- migration proposal 명칭 정리

Round 2:
- 파서 → Worker 연결
- `POST /api/eie/import`
- import_session 생성
- timetable_cells 저장
- `eie-api.js` 환경 분기
- Worker 인증 패턴 정리

Round 3:
- import 결과 미리보기 UI
- timetable_cells 목록
- needs_review 강조

Round 4:
- 학생 seed 검토/확정 UI
- identity_seeds 목록
- whitelist 관리
- needs_review 재평가

Round 5:
- 학생/연락처/수업배정 확정
- `eie_students`
- `eie_student_contacts`
- `eie_student_schedule_assignments`

Round 6+:
- classroom_session
- 출석/숙제/교재/메모 수업 운영

### 5-8. 라운드별 금지 항목

내용:

- Round 1에서 파서 구현 금지
- Round 1에서 DB 적용 금지
- Round 1에서 students/contacts/classroom 테이블 생성 금지
- Round 2 이전 Worker 실제 DB 쿼리 금지
- Round 5 이전 `eie_students`, `eie_student_contacts` 생성 금지
- Round 6 이전 classroom_session 설계/구현 금지

## 6. 기존 문서 업데이트 — docs/EIE_TIMETABLE_DATA_MODEL.md

`docs/EIE_TIMETABLE_DATA_MODEL.md`를 열어 Claude 검토 결과를 반영한다.

반드시 반영할 내용:

### 6-1. EIE는 APMS 시간표와 다른 체계

내용:

- EIE는 반 중심이 아니다.
- EIE는 학생이 여러 수업 셀에 들어갈 수 있다.
- APMS timetable 모델을 상위 기준으로 삼지 않는다.

### 6-2. timetable_cell 기준

Claude 검토 기준:

- EIE 시간표 기본 단위는 `timetable_cell`
- `timetable_cell`과 `lesson_slot`은 현재 단계에서 같은 개념으로 본다.
- 이름은 `timetable_cell`로 유지한다.

### 6-3. unique 후보

실측/설계 기준:

- `import_session_id + period_label + column_index`
- 같은 교시 같은 선생님 다른 셀도 column_index로 분리한다.
- 같은 수업명 다른 컬럼도 column_index로 분리한다.
- IVY 동일 교시 2셀 케이스도 column_index로 분리 가능하다.

주의:

- 실제 DB 적용은 아직 하지 않는다.
- 이번 라운드에서는 proposal 문서/SQL 정리까지만 한다.

### 6-4. staging 흐름

다음 흐름을 문서화한다.

- `eie_import_sessions`
- `eie_timetable_cells`
- `eie_student_identity_seeds`
- `eie_student_contact_seeds`
- `eie_student_schedule_seeds`
- confirmed 운영 데이터는 Round 5 이후

### 6-5. confirmed 운영 데이터는 나중

아래 테이블은 Round 5 이후 설계 대상으로 명시한다.

- `eie_students`
- `eie_student_contacts`
- `eie_student_schedule_assignments`
- `eie_classroom_sessions`
- `eie_student_session_records`

현재 생성하지 않는다.

### 6-6. matched teacher token 정책

문서에 다음을 기록한다.

- Laura 같은 whitelist 미등록 teacher는 `needs_review`
- whitelist 추가 후 전체 import_session 재파싱이 아니라 `needs_review` 셀만 선택 재평가
- confirmed 셀은 재파싱 대상 제외
- Laura/Zoe처럼 혼합 teacher token은 단일 teacher로 확정하지 않음
- 혼합 teacher token은 `raw_meta_json`에 보존
- 예:
  - `matched_teacher_tokens`
  - `teacher_match_count`
  - `source_row`
- 혼합 teacher 셀은 `needs_review`

### 6-7. 학생/전화번호 정책은 다음 라운드 확정

문서에 다음을 적는다.

- 학생 seed와 전화번호 seed는 Round 4~5에서 확정한다.
- 전화번호가 있어도 바로 `eie_students`에 넣지 않는다.
- seed/review 단계를 거친다.
- 전화번호 없는 학생도 버리지 않는다.
- 동명이인과 가족 연락처 가능성을 고려한다.

## 7. migration proposal 보정

대상:

- `apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`

이번 라운드에서는 migration을 적용하지 않는다.
원격 D1에 실행하지 않는다.
proposal 파일만 명칭을 정리한다.

보정 기준:

1. `eie_timetable_cells`에서 `column_start`가 실질적으로 column_index 역할이라면 혼선을 줄인다.
2. 가능하면 `column_start`를 `column_index`로 명칭 통일한다.
3. 기존 문서와 맞춰 `UNIQUE(import_session_id, period_label, column_index)` 후보를 주석 또는 proposal constraint로 명시한다.
4. 실제 적용이 아니라 proposal only임을 주석으로 명확히 유지한다.
5. `eie_students`, `eie_student_contacts`, `eie_classroom_sessions`, `eie_student_session_records`는 추가하지 않는다.

주의:

- proposal SQL 문법은 깨지면 안 된다.
- 실제 DB 적용 명령은 작성하지 않는다.

## 8. 기존 EIE 화면/문구 확인

아래 파일을 확인한다.

- `eie/js/views/eie-dashboard.js`
- `eie/js/views/eie-import.js`

확인할 것:

- “원장 가져오기”가 남아 있으면 “엑셀 가져오기”로 수정
- “원천 가져오기”가 남아 있으면 “엑셀 가져오기”로 수정
- “영어 원천 fixture”가 남아 있으면 “영어 엑셀 fixture”로 수정
- EIE 화면에서 출석/숙제/교재/리포트/수납/문자/포털을 새로 노출하지 않음

## 9. Worker/API 확인

대상:

- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/eie.js`

확인 기준:

- `/api/eie/import/latest`
- `/api/eie/timetable`
- `/api/eie/student-seeds`

위 route는 아직 stub이어야 한다.

금지:

- 실제 `eie_*` DB query 추가 금지
- `DB.prepare` 추가 금지
- 기존 `/api/*` route 순서 변경 금지
- `verifyAuth` 패턴 임의 수정 금지

`verifyAuth` 패턴 통일은 Round 2에서 처리한다.
이번 Round 1에서 하지 않는다.

## 10. eie-api.js 확인

대상:

- `eie/js/eie-api.js`

확인만 한다.

Claude 지적사항:

- 현재 API_BASE가 하드코딩되어 있다면 Round 2에서 환경 분기를 추가한다.
- 이번 Round 1에서는 기능 수정하지 않는다.
- CODEX_RESULT.md에 Round 2 작업으로 기록한다.

## 11. APMS/AP Math 원본 보존 확인

반드시 확인한다.

- `apmath/index.html`이 EIE JS/CSS를 직접 로드하지 않는다.
- `apmath/js/core.js`에 EIE state/render 분기가 없다.
- `apmath/js/ui.js`에 EIE drawer/goHome 분기가 없다.
- `apmath/js/dashboard.js`에는 EIE 이동 링크 정도만 최소로 남아 있다.
- 기존 APMS/AP Math 학생/시간표/출결/리포트/아카이브/OMR 로직을 수정하지 않았다.
- `archive/engine.html` 파일이 존재한다.
- `archive/mixed_engine.html` 파일이 존재한다.

## 12. 검증 명령

가능한 범위에서 실행한다.

node --check apmath/js/dashboard.js
node --check apmath/js/core.js
node --check apmath/js/ui.js
node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/eie.js
node --check eie/js/eie-app.js
node --check eie/js/eie-state.js
node --check eie/js/eie-router.js
node --check eie/js/eie-api.js
node --check eie/js/utils/eie-normalize.js
node --check eie/js/views/eie-dashboard.js
node --check eie/js/views/eie-timetable.js
node --check eie/js/views/eie-import.js
node --check eie/js/views/eie-student-seeds.js

SQL proposal 파일은 문법 확인 가능한 도구가 있으면 확인한다.
없으면 수동으로 SQL 문법 깨짐 여부를 확인하고 CODEX_RESULT.md에 기록한다.

package.json이 없으면 npm test/build는 실행하지 말고 “package.json 없음으로 실행 불가”라고 기록한다.

## 13. CODEX_RESULT.md 작성 형식

작업 완료 후 CODEX_RESULT.md에 아래 형식으로 append한다.

# CODEX_RESULT_APPEND — EIE Round 1 Docs and Model Policy

## 1. 현재 git 상태
- git status:
- git diff --stat:
- git diff --name-only:

## 2. 생성/수정 파일
- 생성:
- 수정:

## 3. EIE_WORKING_RULEBOOK.md 생성
- 독립 앱 원칙:
- 공유 가능/공유 금지 기준:
- localStorage 정책:
- import/session 정책:
- 개인정보 정책:
- 라운드별 범위:
- 라운드별 금지 항목:

## 4. EIE_TIMETABLE_DATA_MODEL.md 업데이트
- timetable_cell 기준:
- unique 후보:
- staging 흐름:
- confirmed 운영 데이터 보류:
- matched teacher token 정책:
- 학생/전화번호 정책 보류:

## 5. migration proposal 보정
- column_start / column_index 정리:
- UNIQUE 후보 명시:
- proposal only 유지:
- D1 미적용 확인:

## 6. 화면/문구 확인
- 원장/원천 표현 잔존 여부:
- 엑셀 가져오기 표현 통일:
- 새 기능 노출 없음:

## 7. Worker/API 확인
- /api/eie/* stub 유지:
- 실제 DB query 없음:
- route 순서 변경 없음:
- verifyAuth 패턴 미수정:

## 8. 다음 라운드로 넘긴 항목
- Round 2 API_BASE 환경 분기:
- Round 2 Worker verifyAuth 패턴 통일:
- Round 2 파서 Worker 연결:
- Round 3 import 미리보기 UI:
- Round 4 학생 seed 검토 UI:
- Round 5 학생/연락처/수업배정 확정:
- Round 6 classroom_session:

## 9. 검증 결과
- node --check:
- SQL proposal 확인:
- npm test/build:

## 10. 자체 검수
- codex-self-audit 결과:
- 발견한 문제:
- 이번 라운드에서 보정한 문제:
- 다음 라운드로 넘긴 위험:

## 11. 검수팩
- 생성한 검수팩 경로:
- 개인정보 파일 제외 여부:
- 프로젝트 전체 압축 금지 준수 여부:

## 12. 최종 판정
- Round 1 PASS 후보 / 보정 필요:

## 14. 검수팩 생성

이번 라운드 검수팩을 생성한다.

경로:

docs/review-packs/eie-round1-docs-model-policy-review-pack-20260528.zip

포함 대상:

- CODEX_RESULT.md
- docs/EIE_WORKING_RULEBOOK.md
- docs/EIE_FORK_STRUCTURE.md
- docs/EIE_TIMETABLE_DATA_MODEL.md
- apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql
- eie/index.html
- eie/css/eie.css
- eie/js/eie-app.js
- eie/js/eie-state.js
- eie/js/eie-router.js
- eie/js/eie-api.js
- eie/js/views/eie-dashboard.js
- eie/js/views/eie-timetable.js
- eie/js/views/eie-import.js
- eie/js/views/eie-student-seeds.js
- eie/js/utils/eie-normalize.js
- apmath/js/dashboard.js
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/eie.js

포함 금지:

- 영어 엑셀 fixture
- 개인정보 파일
- .git
- node_modules
- dist
- build
- .wrangler
- .codex-fixtures
- 프로젝트 전체 archive/textbook 대형 자료
- 기존 검수팩 zip 중첩

## 15. 마무리 규칙

작업 완료 후 바로 보고하지 말고, 먼저 codex-self-audit 스킬을 적용해 자체 검수를 수행한다.
자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.

그 다음 codex-work-review-pack 스킬을 적용해 이번 작업의 변경/신규 파일 중심 검수팩을 생성한다.
프로젝트 전체 압축은 금지한다.
개인정보가 포함된 영어 엑셀 fixture는 검수팩에 포함하지 않는다.
생성된 zip 경로를 CODEX_RESULT.md 마지막 append 섹션에 기록한다.
git add, git commit, git push는 하지 않는다.
검수요청서는 작성하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.