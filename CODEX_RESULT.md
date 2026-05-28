# CODEX_RESULT

## 1. 생성/수정 파일

- 수정: `eie/js/utils/eie-normalize.js`
- 수정: `eie/js/utils/eie-excel-parser.js`
- 수정: `eie/js/eie-state.js`
- 수정: `eie/js/views/eie-timetable.js`
- 수정: `eie/js/views/eie-student-seeds.js`
- 수정: `eie/css/eie.css`
- 수정: `apmath/worker-backup/worker/routes/eie.js`
- 수정: `docs/EIE_WORKING_RULEBOOK.md`
- 수정: `docs/EIE_TIMETABLE_DATA_MODEL.md`
- 생성/수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- Round 5 학생·전화번호 후보 검토 1차 구현.
- 엑셀 parser가 수업 셀별 `raw_meta_json.student_candidates`, `student_names`, `contact_candidates`, `needs_review_reasons`를 생성하도록 보강.
- 시간표 셀에는 학생 이름 chip만 표시하도록 구현.
- 학생 이름 클릭 시 오른쪽 학생 후보 상세 패널 표시.
- 전화번호는 시간표 셀에 노출하지 않고 학생 후보 상세 패널에서만 표시.
- 동명이인 표시는 같은 정규화 전화번호가 2건 이상인 후보 기준으로 보정.
- v5 보정: 기존 데이터가 `student_candidates` 없이 `student_names`, `students`, `studentSeeds`만 가진 경우에도 chip 클릭 상세 패널이 열리도록 `EieState.findStudentCandidate()` fallback을 추가.
- 학생 후보 검토 화면에서 학생 후보/연락처 후보/확인 필요/전화 없음 요약 및 목록 표시.
- Worker `routes/eie.js`의 student-seeds/contact-seeds/needs-review stub을 `eie_timetable_cells.raw_meta_json` 기반 read-only 응답으로 교체.
- `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments` 정식 테이블/쓰기 API는 만들지 않음.
- import 상세 조회 SQL의 중복 `FROM eie_import_sessions` 오타를 함께 보정.
- EIE Round 4/5 범위 문서를 현재 기준으로 정정.

## 3. 실행 결과

- `node --check eie/js/eie-app.js` PASS
- `node --check eie/js/eie-state.js` PASS
- `node --check eie/js/eie-api.js` PASS
- `node --check eie/js/utils/eie-normalize.js` PASS
- `node --check eie/js/utils/eie-excel-parser.js` PASS
- `node --check eie/js/views/eie-dashboard.js` PASS
- `node --check eie/js/views/eie-import.js` PASS
- `node --check eie/js/views/eie-student-seeds.js` PASS
- `node --check eie/js/views/eie-timetable.js` PASS
- `node --check apmath/worker-backup/worker/routes/eie.js` PASS
- 금지 테이블 생성 문자열 검색 결과: 신규 생성 없음
- EIE route 내 APMS 학생/학부모/반 배정 테이블 INSERT 검색 결과: 신규 INSERT 없음
- 시간표 셀 렌더 영역 전화번호 직접 노출 검색 결과: 상세 패널 표시만 존재

## 4. 결과 요약

Round 5는 새 정식 학생/연락처 테이블 없이 기존 import/timetable cell staging 데이터 안의 raw metadata를 활용하는 후보 검토 단계로 구현했다. 시간표에서는 학생 이름만 빠르게 확인하고, 개인정보 성격의 전화번호는 상세 패널 또는 후보 검토 화면에서만 확인하도록 분리했다. v5에서는 기존 import 데이터 호환을 위해 `student_names` fallback chip 클릭 시에도 상세 후보를 생성해 열 수 있도록 보정했다.

## 5. 다음 조치

- 프로젝트에 패치 적용 후 EIE에서 엑셀 가져오기 또는 기존 import 데이터를 기준으로 시간표 화면 진입.
- `raw_meta_json.student_candidates`가 있는 새 데이터와 `raw_meta_json.student_names`만 있는 기존 데이터 모두에서 학생 chip 클릭 상세 패널이 열리는지 확인.
- 학생 chip 표시, 상세 패널, 전화번호 상세 전용 노출, 같은 전화번호 기준 동명이인/전화 없음/확인 필요 badge를 브라우저에서 확인.
- Round 4 기능인 수업 셀 추가/수정/status/filter/archived 전체 보기/새로고침 유지 여부 확인.
- Worker 배포 전 `/api/initial-data` 회귀 확인은 유지.
- Round 6 또는 별도 확정 라운드 전까지 학생/연락처/수업배정 정식 생성은 계속 금지.

검수팩:
- Gemini/외부 검수용 part01: `eie-round5-student-phone-candidates-review-pack-v5-part01-core-20260528.zip`
- Gemini/외부 검수용 part02: `eie-round5-student-phone-candidates-review-pack-v5-part02-context-20260528.zip`

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

---

# CODEX_RESULT_APPEND - Backdoor Dashboard Modal API Plan

## 생성 문서

* `docs/BACKDOOR_DASHBOARD_MODAL_API_PLAN_20260528.md`

## 읽은 파일

* `CODEX_RESULT.md` — 이전 작업 맥락 확인
* `CLAUDE_CODE_HANDOFF_BACKDOOR_20260528.md` — 파일 없음 (존재하지 않음)
* `apmath/worker-backup/worker/index.js` — initial-data 핸들러 전체 구조 확인
* `apmath/worker-backup/worker/routes/backdoor.js` — 파일 없음 (배포 인스턴스에만 존재)
* `apmath/js/dashboard.js` — 3937줄. 모든 대시보드/모달 함수 확인
* `apmath/js/core.js` — state.db 구조, initial-data load 흐름 확인
* `apmath/js/student.js` — 학생 상세 탭 구조 (출결/숙제/시험/상담/연락처) 확인
* `apmath/js/management.js` — 반 관리, PIN, 수납·출납 foundation 모달 확인

## 확인한 주요 화면/모달 구역

| 구역 | 대표 함수 |
|------|----------|
| 첫 화면 카드/요약 | renderAdminControlCenter, renderAdminStudentOverviewPanel, renderAdminNeedCheckPanel |
| 오늘 운영 | openTodayCloseModal, computeRiskStudents, renderTodoSections |
| 학생 목록/상세 | openAdminStudentList, renderStudentDetail, renderStudentDetailTab |
| 반/수업 목록/상세 | openClassManageModal, renderClass, renderAdminTeacherStudents |
| 시간표 | renderTimetable |
| 출결/숙제 | openAttendanceLedger, openTodayCloseModal |
| 수납/결제 | openBillingAccountingFoundationModal (UI 숨김 상태) |
| 상담/메모 | openAdminConsultationCenter, openAdminStudentConsultationHistory |
| 시험/성적/리포트 | openGlobalExamGradeView, openSchoolExamLedger, openReportPreview |
| 설정/운영자 전용 | openAdminTeacherAccountManage, openAdminPinBatchModal |

## 현재 API로 커버 가능한 영역

* 운영센터 첫 진입 학생 count 카드 → /api/backdoor/overview
* 오늘 결석/숙제 미완료 summary → /api/backdoor/today
* 반 목록 (학급관리) → /api/backdoor/classes
* 학생 목록 (재원/퇴원/학년별) → /api/backdoor/students
* 시간표 전체 뷰 → /api/backdoor/timetable
* 수납 요약 카드 → /api/backdoor/billing-summary
* 전체 검색 → /api/backdoor/search

## 추가 API가 필요한 영역

* 학생 상세 모달 (이름/학교/학년/반. 연락처·PIN 제외)
* 학생 출결·숙제·시험 탭
* 반 상세 (학생 목록, 출결 summary)
* 오늘 운영 상세 (반별 학생 출결 목록)
* 최근 상담 패널 / 학생별 상담 이력
* 일지 주간 현황 (제출 여부만)
* 수납 미납 count / 최근 수납 recent (금액 raw dump 금지)
* 시험/리포트 최근 목록

## 다음 구현 라운드 추천

* Round A: 학생 상세 모달용 read-only detail API → 연락처·PIN 제외
* Round B: 반 상세 모달용 read-only detail API
* Round C: 오늘 운영 모달용 read-only detail API
* Round D: 수납 상세 모달용 summary/detail API (금액 raw dump 금지)
* Round E: 시험/리포트/상담 summary API

## 수정하지 않은 파일

* apmath/js/* — 수정 없음
* apmath/index.html — 수정 없음
* apmath/worker-backup/worker/index.js — 수정 없음
* apmath/worker-backup/worker/routes/backdoor.js — 파일 없음, 수정 없음

## 배포하지 않음

wrangler deploy 실행하지 않음.

## 압축 생성하지 않음

Compress-Archive / zip 생성하지 않음.

## git add/commit/push 하지 않음

git 작업 일체 실행하지 않음.
