# Full CRUD Missing Implementation Result

## 수정 파일
- eie/js/eie-api.js
- eie/js/apms-compat/eie-apms-state.js
- eie/js/views/eie-students.js
- eie/js/views/eie-grade-ledger.js
- apmath/js/student.js
- apmath/js/student-edit.js
- apmath/worker-backup/worker/routes/students.js
- apmath/worker-backup/worker/routes/operations.js
- CODEX_RESULT.md

## 해결한 문제
- EIE 학생 상세 출결 multi-cell 저장
- EIE 학교 성적 개별 수정/삭제 연결
- AP 단일 학생 auto-pin UI 연결
- AP 상담 전체 조회/list route 정리
- EIE confirmed-contacts 정리
- EIE schedule-assignments 정리
- Archive/Assessment local-only 정책 정리

## 핵심 변경
- EIE 학생 상세 출결 카드에 다중 배정 학생용 저장 반 선택값을 추가하고, 저장 payload가 항상 timetable_cell_id를 포함하도록 했다.
- EIE school-grade API wrapper에 개별 PATCH/DELETE를 추가하고 grade ledger 각 시험 칸에서 단건 수정/삭제를 호출하도록 연결했다.
- EIE confirmed-contacts와 schedule-assignments 조회 wrapper를 추가하고 foundation 로딩에 병합해 기존 학생 상세/배정/연락처 흐름에서 사용되도록 했다.
- AP 학생 상세/수정 화면에 단일 PIN 자동생성 버튼을 추가하고 POST /students/:id/auto-pin 결과를 화면 state에 반영했다.
- AP 단일 auto-pin route는 reset=true일 때 기존 PIN을 새 PIN으로 초기화할 수 있게 했다.
- AP consultations GET route가 student_id 없이도 권한 범위 내 최근 상담 목록을 반환하도록 정리했다.

## 구현 완료
- 배정 cell 1개 학생은 기존처럼 자동으로 cell context를 확정한다.
- 배정 cell 여러 개 학생은 학생 상세 출결 카드에서 저장 반을 선택해야 하며, 선택하지 않으면 저장하지 않고 안내한다.
- EIE 학교 성적은 칸 단위로 수정 가능하고, 기존 record가 없으면 기존 batch endpoint에 단건 payload로 생성한다.
- EIE 학교 성적 삭제는 확인창 후 backend soft delete(status archived)를 호출하고 목록을 다시 로드한다.
- AP 단일 PIN 자동생성/초기화는 기존 batch PIN route를 건드리지 않고 단일 route만 호출한다.
- AP 상담 전체 목록은 admin 전체 최근 목록, teacher 담당 반 학생 범위 목록으로 분기한다.
- EIE backend-only confirmed-contacts/schedule-assignments는 새 화면 없이 기존 foundation state에 연결했다.

## 보류/정책 결정 항목
- Archive/Assessment 결과 local-only 저장은 이번 라운드에서 서버 저장 API를 새로 만들지 않았다.
- archive/assessment/assessment-mvp.html, archive/assessment/assessment-analysis.html, archive/engine.html, archive/mixed_engine.html의 출력/분석 임시 payload는 운영 기록 DB 설계가 필요한 영역으로 분류했다.
- 학생별 진단 결과나 장기 보관 점수로 승격할 값은 다음 라운드 저장 API/스키마 후보로 남긴다.
- AP/EIE 보안 PIN/token 저장 정책과 Homework file_id 보안 정책은 이번 범위에서 제외했다.

## 검수 결과
- EIE 학생 상세 출결 multi-cell: PASS - 다중 배정 시 select로 cell 확정, payload에 timetable_cell_id 포함.
- EIE 학교 성적 수정/삭제: PASS - updateSchoolGradeRecord/deleteSchoolGradeRecord wrapper 및 UI 연결.
- AP auto-pin: PASS - 학생 상세/수정 화면에서 단일 auto-pin 호출 및 state 갱신.
- AP 상담 전체 조회: PASS - student_id 없는 GET consultations list route 추가, 권한 범위 분기 유지.
- EIE confirmed-contacts: PASS - wrapper 추가 및 foundation 연락처 state 병합.
- EIE schedule-assignments: PASS - wrapper 추가 및 foundation class_students 병합.
- Archive/Assessment local-only: PASS(policy) - 서버 저장 신규 설계는 보류로 명시.
- node --check: PASS
- git diff --check: PASS

## 수정하지 않은 항목
- 보안 PIN/token 저장 정책
- Homework file_id 보안
- AP 학생 status
- AP 학급 archive
- Archive engine allowlist
- EIE 시간표 레이아웃

## 남은 위험
- EIE school-grade 개별 수정/삭제와 AP consultations 전체 목록은 worker 배포 후 운영 DB에서 권한별 실제 데이터로 확인이 필요하다.
- EIE confirmed-contacts/schedule-assignments 병합은 기존 foundation fallback과 병행되므로, migration 미적용 환경에서는 기존 derived 데이터로 동작한다.
- Archive/Assessment 운영 기록화는 별도 migration/API 설계가 필요하다.
