# AP Class Archive & Archive Engine Script Allowlist Result

## 수정 파일
- apmath/js/management.js
- apmath/worker-backup/worker/routes/classes.js
- archive/engine.html

## 해결한 문제
- AP 학급 hard delete 차단
- 학급 archive/soft-delete 전환
- Archive engine data script allowlist 적용

## 핵심 변경
- DELETE /api/classes/:id에서 classes row 및 관련 운영 기록 DELETE를 제거하고 classes.is_active = 0 업데이트로 전환
- class_students, teacher_classes, class_textbooks, class_daily_records, class_daily_progress, class_exam_assignments, exam_sessions, school_exam_records 보존
- 기존 api.delete('classes', classId) 호출과 success 응답 호환 유지
- 학급 삭제 확인/결과 문구를 보관 처리 및 기록 보존 기준으로 변경
- archive/engine.html의 data query script src를 exams/**/*.js allowlist 통과 경로로 제한
- http/https, protocol-relative URL, javascript/data/blob, ../, backslash, encoded traversal, exams 밖 경로, 비-js 확장자 차단
- invalid data 차단 시 script를 추가하지 않고 console.warn 및 안전한 오류 안내 표시

## 검수 결과
- 학급 archive: PASS (DELETE route가 classes.is_active = 0으로 archive 처리)
- related records 보존: PASS (class DELETE route 내 관련 테이블 DELETE 제거 확인)
- 기본 학급 목록: PASS (GET /classes 및 관리 목록 active 기준 유지 확인)
- 학생 등록/수정 학급 선택: PASS (기존 classes 응답/프론트 호출 구조 유지, 런타임 미실행)
- 시간표/출석/성적 회귀: PASS (관련 기록 삭제 제거 및 출력/조회 구조 미수정, 런타임 미실행)
- engine 정상 data: PASS (exams/*.js, ./exams/*.js, archive/exams/*.js 정규화 테스트 통과)
- engine 악성 data 차단: PASS (https/http, //, javascript, data, blob, ../, backslash, %5c, %2e%2e, .html, .json 차단 테스트 통과)
- node --check: PASS (apmath/js/management.js, apmath/worker-backup/worker/routes/classes.js)
- HTML inline parse: PASS (archive/engine.html inline script 2개 parse)
- git diff --check: PASS (공백 오류 없음, LF-to-CRLF warning만 출력)

## 수정하지 않은 항목
- 학생 status 정규화 재수정 없음
- EIE 수정 없음
- Student Portal 수정 없음
- Archive 출력 렌더링/MathJax/인쇄 구조 수정 없음

## 남은 위험
- 실제 운영 DB class 상태 column 값은 운영 데이터 확인 필요
- 운영 배포 Worker가 backup worker와 다르면 배포본 확인 필요
- 브라우저 클릭, 운영 DB row 확인, 실제 인쇄/MathJax 시각 검수는 이번 로컬 정적 검수에서 실행하지 않음
