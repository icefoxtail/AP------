# CODEX_RESULT_STUDY_MATERIAL_AUDIT

## 1. 점검 파일

- `routes/study-material-wrongs.js`: 루트 기준 없음.
- `apmath/worker-backup/worker/routes/study-material-wrongs.js`: 존재 확인 및 읽음.
- `apmath/js/study-material-wrong.js`: 존재 확인 및 읽음.
- `apmath/student/index.html`: 없음.
- `index.js`: 루트 기준 없음.
- `apmath/worker-backup/worker/index.js`: 존재 확인 및 읽음.
- `schema.sql`: 루트 기준 없음.
- `apmath/worker-backup/worker/schema.sql`: 존재 확인 및 읽음.
- `migrations/`: 루트 기준 없음.
- `apmath/worker-backup/worker/migrations/`: 존재 확인 및 검색함.
- 참고 확인: 루트 `index.html`에는 시험지/자료 출력 화면이 있으나, 요청 대상인 학생 포털 `apmath/student/index.html`은 존재하지 않음.

## 2. 현재 존재 확인

- route 파일 존재 여부:
  - 요청 경로 `routes/study-material-wrongs.js`는 없음.
  - 실제 경로 `apmath/worker-backup/worker/routes/study-material-wrongs.js`는 있음.
  - `handleStudyMaterialWrongs(request, env, teacher, path, url, body)`를 export함.
  - 처리 resource: `study-materials`, `material-unit-ranges`, `material-question-tags`, `class-material-assignments`, `material-omr`, `material-wrongs`, `material-review`.
- index.js 연결 여부:
  - 요청 경로 `index.js`는 없음.
  - 실제 경로 `apmath/worker-backup/worker/index.js`에는 `import { handleStudyMaterialWrongs } from './routes/study-material-wrongs.js';`가 있음.
  - `resource`가 위 7개 resource 중 하나일 때 `handleStudyMaterialWrongs(...)`로 분기함.
  - `/api/study-material-wrongs` 단일 resource 분기는 없음. 현재 구조는 `/api/study-materials`, `/api/material-omr/...`, `/api/material-wrongs/...`처럼 여러 resource로 나뉨.
  - 기존 route 구조와의 명확한 충돌은 검색상 확인되지 않음. 단, requested resource명 `study-material-wrongs`와 실제 resource명 `material-wrongs`가 달라 호출 규격 혼동 가능성이 있음.
- frontend 구현 상태:
  - `apmath/js/study-material-wrong.js` 있음.
  - 교재 등록, 교재 관리, 수정, 삭제 처리 흐름 있음. 삭제는 `PATCH study-materials/{id}`에 `{ status: 'deleted' }`를 보내는 비활성/삭제 처리 방식.
  - 단원 범위 CSV import 및 조회 흐름 있음.
  - 반별 교재 배정 생성 및 조회 흐름 있음.
  - 교사 배치 오답 입력 흐름 있음.
  - 오답 현황 조회 흐름 있음.
  - 학생 직접 수정용 프론트 흐름은 이 파일 안에서는 확인되지 않음. 학생 token 기반 API는 route에 존재하지만 학생 포털 UI 파일이 없음.
  - `localStorage` 또는 mock 데이터 사용은 검색 결과 없음. `window.__apStudyMaterialWrongState`와 `state.db`를 사용하고, API는 `fetch(`${CONFIG.API_BASE}/${path}`)`로 호출함.
  - 화면 문구 기준은 대체로 `교재`임.
  - `수업자료` 문구는 `apmath/js/study-material-wrong.js` 검색 결과 없음.
- student portal 연결 여부:
  - `apmath/student/index.html` 파일 없음.
  - 따라서 학생 포털 내 교재 오답 UI/버튼/링크 존재 여부는 해당 파일 기준 없음.
  - 학생이 시험지 원문/PDF를 직접 여는 흐름, 제출 완료 OMR 수정 금지 흐름과의 충돌, 학생 수정 가능 예외 분리 여부는 해당 파일 기준 확인 불가.
- DB schema/migration 존재 여부:
  - 루트 `schema.sql` 및 루트 `migrations/`는 없음.
  - 실제 워커 경로에는 `apmath/worker-backup/worker/schema.sql`와 `apmath/worker-backup/worker/migrations/20260516_study_material_wrongs.sql` 있음.
  - 정확히 같은 후보명 중 `study_materials`는 있음.
  - 후보명과 유사한 테이블로 `material_unit_ranges`, `class_material_assignments`, `student_material_submissions`, `student_material_wrong_answers`, `material_question_tags`가 있음.
  - `study_material_units`, `study_material_class_assignments`, `study_material_wrong_entries`, `study_material_wrong_numbers`, `study_material_wrong_history`라는 정확한 이름의 테이블은 검색 결과 없음.
  - 인덱스는 위 테이블들에 대해 다수 존재함.
  - 현재 실제 워커 schema에는 MVP용 유사 테이블이 이미 있으므로, "요청 후보명 그대로"가 필수라면 migration 필요. 현재 구현명 유지라면 신규 migration 필요 여부는 낮아 보임.

## 3. API/함수/데이터 흐름 요약

- 현재 프론트에서 호출하는 API:
  - `GET study-materials`
  - `GET study-materials?status=deleted`
  - `POST study-materials`
  - `PATCH study-materials/{id}`
  - `GET class-material-assignments`
  - `POST class-material-assignments`
  - `POST material-unit-ranges/import`
  - `GET material-unit-ranges?material_id=...`
  - `GET material-omr/entry-sheet?class_id=...&material_id=...`
  - `POST material-omr/teacher-batch-save`
  - `GET material-wrongs/scope?...`
- 현재 route에서 제공하는 API:
  - `GET/POST/PATCH study-materials`
  - `GET/POST import/PATCH material-unit-ranges`
  - `GET/POST import material-question-tags`
  - `GET/POST/PATCH disable class-material-assignments`
  - `GET material-omr/student-assignments`
  - `GET material-omr/assignment`
  - `POST material-omr/submit`
  - `GET material-omr/entry-sheet`
  - `POST material-omr/teacher-batch-save`
  - `GET material-omr/overview`
  - `GET material-wrongs/scope`
  - `GET material-wrongs/student`
  - `GET material-wrongs`
  - `GET material-review/scope`
  - `GET material-review/student`
- 주요 프론트 함수:
  - 상태/공통: `st`, `h`, `today`, `notify`, `call`, `materialTypeLabel`, `isHiddenMaterial`, `visibleMaterials`, `allManageMaterials`, `injectStyle`
  - 옵션/필터: `activeClasses`, `activeStudents`, `gradeOptions`, `filteredClassRows`, `filteredClassOptions`, `filteredStudentRows`, `filteredStudentOptions`, `materialOptions`
  - 렌더링: `tabs`, `materialSection`, `rangeSection`, `assignSection`, `entryForm`, `renderEntryRows`, `renderWrongNumberPicker`, `viewForm`, `renderViewText`, `renderOutputText`, `manageSection`, `body`, `render`
  - 공개 window 함수: `openStudyMaterialWrongCenter`, `setStudyMaterialWrongTab`, `openStudyMaterialManage`, `saveStudyMaterialManageEdit`, `deleteStudyMaterialManageItem`, `loadStudyMaterialWrongData`, `createStudyMaterial`, `importStudyMaterialRanges`, `loadStudyMaterialRanges`, `createStudyMaterialAssignment`, `loadStudyMaterialAssignments`, `loadStudyMaterialEntrySheet`, `toggleStudyMaterialEntryStatus`, `onStudyMaterialEntryInput`, `openWrongNumberPicker`, `saveStudyMaterialTeacherBatch`, `loadStudyMaterialView`, `showStudyMaterialOutput`
- 현재 DB 테이블 또는 localStorage/mock 사용 여부:
  - DB 유사 테이블: `study_materials`, `material_unit_ranges`, `material_question_tags`, `class_material_assignments`, `student_material_submissions`, `student_material_wrong_answers`.
  - localStorage/mock 사용 없음.

## 4. 누락분

- 필요한데 없는 파일:
  - 요청 경로 기준 `routes/study-material-wrongs.js`, `index.js`, `schema.sql`, `migrations/`, `apmath/student/index.html` 없음.
  - 실제 워커 경로 기준 route/index/schema/migration은 있음.
- 필요한데 없는 route:
  - `/api/study-material-wrongs` 단일 resource route는 없음.
  - 실제 구현은 `/api/material-wrongs` 등 분산 resource 구조.
- 필요한데 없는 DB:
  - 정확한 후보명 기준 `study_material_units`, `study_material_class_assignments`, `study_material_wrong_entries`, `study_material_wrong_numbers`, `study_material_wrong_history` 없음.
  - 유사 구현 테이블은 존재.
  - 별도 history 테이블은 확인되지 않음.
- 필요한데 없는 frontend 연결:
  - 교사용 등록/배정/오답입력/현황 조회는 있음.
  - 학생 직접 입력/수정 UI는 `apmath/js/study-material-wrong.js`에서는 확인되지 않음.
- 필요한데 없는 student portal 연결:
  - `apmath/student/index.html` 자체가 없어서 학생 포털 연결 확인 불가.
  - route에는 student token 기반 `material-omr/student-assignments`, `material-omr/assignment`, `material-omr/submit`이 존재하나 UI 연결 파일이 없음.

## 5. 위험 지점

- 학생이 시험지 원문/PDF를 직접 열 가능성:
  - 요청 대상 `apmath/student/index.html`이 없어서 학생 포털 기준 확인 불가.
  - 루트 `index.html`에는 시험/자료 출력 화면과 `goEngine` 흐름이 있으나 학생 포털 파일은 아님.
- OMR 제출 완료 수정 금지 원칙과 충돌 가능성:
  - route의 학생 API `POST material-omr/submit`은 기존 제출 row를 다시 갱신하는 구조로 보임. 수업자료/교재 오답의 학생 수정 가능 예외라면 의도일 수 있으나, 일반 OMR 제출 완료 수정 금지 흐름과 분리 표시가 필요함.
- 수업자료 오답 학생 수정 가능 예외 흐름과 충돌 가능성:
  - route에는 학생 token 검증과 학생 제출 API가 있으나, 학생 포털 UI 파일 부재로 예외 흐름이 화면상 분리되어 있는지 확인 불가.
- 기존 교재 문구/버튼/화면명 변경 위험:
  - 현재 프론트 문구는 `교재` 중심이며 `수업자료` 문구는 없음. 이후 `수업자료`로 일괄 변경하면 기존 교재 화면명/버튼명 변경 위험 있음.
- 관리자 화면 수정 필요 여부:
  - 현재 교사용 모달/관리 흐름은 `apmath/js/study-material-wrong.js` 안에 있음. 관리자/원장 화면 직접 수정 필요 여부는 이번 대상 파일만으로는 불명확.

## 6. 다음 구현 분리안

- Task 1: 경로/명명 정리만
  - 요청 경로와 실제 경로 차이 확인.
  - `routes/study-material-wrongs.js`를 루트에 둘지, 기존 `apmath/worker-backup/worker/routes/study-material-wrongs.js`를 표준으로 볼지 결정.
- Task 2: index 연결 검증만
  - `apmath/worker-backup/worker/index.js`
  - `/api/study-material-wrongs` alias가 필요한지, 기존 분산 resource 구조를 유지할지 결정.
- Task 3: frontend 연결만
  - `apmath/js/study-material-wrong.js`
  - 현재 교사용 기능은 유지하고, 학생 직접 입력 화면이 필요한 경우 별도 파일/함수로 분리.
- Task 4: student portal 연결만
  - `apmath/student/index.html`이 실제 운영 파일인지 먼저 확인.
  - 학생 포털 파일이 새로 필요하다면 교재 오답 입력 링크/화면만 추가하고 시험지 원문/PDF 직접 열기 기능은 추가하지 않음.
- Task 5: DB migration만
  - `apmath/worker-backup/worker/migrations/...sql`
  - 기존 유사 테이블 유지 여부와 history 테이블 필요 여부를 결정한 뒤 별도 migration으로 분리.

## 7. 실행 결과

- `git status --short` 결과:
  - ` M CODEX_TASK.md`
  - ` M apmath/js/report.js`
  - `?? CODEX_RESULT_REPORT_BUTTONS.md`
  - `?? CODEX_RESULT_REPORT_LAYOUT.md`
  - 실행 중 git ignore 권한 경고: `unable to access 'C:\Users\USER/.config/git/ignore': Permission denied`
- 읽기 전용 검색 결과 요약:
  - 루트 `routes` 없음.
  - 루트 `index.js` 없음.
  - 루트 `schema.sql` 없음.
  - 루트 `migrations/` 없음.
  - `apmath/worker-backup/worker/routes/study-material-wrongs.js` 있음.
  - `apmath/worker-backup/worker/index.js`에 import 및 resource 분기 있음.
  - `apmath/js/study-material-wrong.js`에 교재 등록/관리/배정/교사 오답 입력/오답 현황 조회 흐름 있음.
  - `apmath/student/index.html` 없음.
  - `apmath/worker-backup/worker/schema.sql`와 `20260516_study_material_wrongs.sql`에 관련 유사 테이블 및 인덱스 있음.

- 코드 수정 여부: 미수정
- DB 수정 여부: 미수정
- 배포 실행 여부: 미실행
- git commit 실행 여부: 미실행
- git push 실행 여부: 미실행
