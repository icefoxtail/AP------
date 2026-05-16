# PROJECT_RULEBOOK_AND_STRUCTURE_MAP

이 문서는 AP Math OS / 왕지교육 프로젝트의 **모든 작업자 공통 룰북 + 전체 구조 지도**다.

Codex, ChatGPT, Gemini, Claude, 사람 작업자는 기능 구현, 검수, 리팩터링, 문서화, 배포 지시를 하기 전에 반드시 이 문서를 먼저 기준으로 삼는다.

이 문서의 원칙은 개별 작업 지시보다 우선한다. 단, 사용자가 특정 작업에서 명시적으로 예외를 허용한 경우에만 그 작업 범위 안에서 예외가 가능하다.

---

# 1. 최상위 작업 원칙

## 1.1 요청 범위 보존

- 요청받은 기능만 수정한다.
- 시키지 않은 기능을 미리 구현하지 않는다.
- 현재 연결되지 않는 함수는 넣지 않는다.
- 추후 쓸 것 같은 코드를 미리 추가하지 않는다.
- 기존 기능을 개선 명목으로 바꾸지 않는다.
- 기존 UI를 예쁘게 다듬지 않는다.
- 기존 버튼 배치, 문구, 흐름을 사용자가 요청 없이 변경하지 않는다.
- 부분 수정 요청이면 해당 부분 외 원문, 기존 코드, 기존 흐름을 보존한다.
- “이왕 하는 김에” 추가하는 작업은 금지한다.
- 작업 범위를 넓혀야 할 경우 먼저 사용자 허락을 받는다.

## 1.2 작업자 기본 실행 범위

기본적으로 Codex, ChatGPT, Gemini, Claude, 사람 작업자는 다음까지만 수행한다.

허용:

- 지정 파일 수정
- 필요한 새 파일 생성
- 로컬 문법 검증
  - 예: `node --check`
  - 예: 수정한 route 파일 단위 문법 확인
- 코드상 정합성 확인
- `CODEX_RESULT.md` 작성

기본 금지:

- `npx wrangler deploy` 실행 금지
- 운영 API smoke test 실행 금지
- `git commit` 실행 금지
- `git push` 실행 금지
- 장시간 전체 탐색 금지
- 지시서에 없는 대량 검수 금지
- 사용자가 명시하지 않은 외부 배포, 운영 데이터 호출, 레포 원격 반영 금지

예외:

- 사용자가 해당 작업에서 명시적으로 “배포까지 해라”, “smoke까지 실행해라”, “커밋/푸시까지 해라”라고 지시한 경우에만 실행할 수 있다.
- 명시 지시가 없으면 배포, 운영 API smoke test, `git commit`, `git push`는 실행하지 않는다.
- 대신 `CODEX_RESULT.md`의 “다음 조치”에 사용자가 직접 실행할 명령만 적는다.

원칙:

- 작업자는 기본적으로 “수정 + 로컬 검증 + 완료 보고”까지만 수행한다.
- 운영 반영은 사용자가 직접 실행한다.
- 이 원칙은 배포 명령 예시, smoke test 예시, git 명령 예시보다 우선한다.

## 1.3 기존 UI 문구·버튼명·화면명 보존

기능 추가 작업이라도 기존 UI 문구는 임의로 변경하지 않는다.

금지:

- 기존 문구 변경 금지
- 기존 버튼명 변경 금지
- 기존 화면명 변경 금지
- 기존 메뉴명 변경 금지
- 기존 탭 이름 변경 금지
- 기존 운영 용어 변경 금지
- 기존 안내문, 토스트, confirm 문구 변경 금지
- 기존 라벨명 변경 금지
- 기존 상태명 변경 금지
- 기존 CSS class명, DOM id를 문구 정리 목적으로 변경 금지
- 기능 구현 중 발견한 용어를 임의로 통일하거나 개선하는 행위 금지

예시:

- “숙제”를 “과제”로 바꾸는 것 금지
- “숙제관리”를 “과제관리”로 바꾸는 것 금지
- “OMR 입력”을 “답안 입력”으로 바꾸는 것 금지
- “제출 완료”를 “완료됨”으로 바꾸는 것 금지
- “원장모드”를 “관리자모드”로 바꾸는 것 금지
- “관리필요학생” 같은 기존 명칭을 임의로 바꾸는 것 금지

허용:

- 사용자가 명시적으로 문구 변경을 요청한 경우
- 새로 추가하는 버튼이나 문구가 필요한 경우
- 단, 새 문구도 기존 운영 용어와 충돌하지 않게 작성해야 한다.

원칙:

- 기능 추가 외 기존 문구·버튼명·화면명·메뉴명·운영 용어를 임의로 변경하지 말 것.
- 사용자가 명시적으로 요청하지 않은 UI 텍스트 변경은 실패로 간주한다.

## 1.4 학생 포털 / OMR 금지 원칙

- 학생이 시험지를 직접 여는 기능은 만들지 않는다.
- 학생은 선생님이 제공한 시험지, QR, OMR 방식으로만 접근한다.
- 학생 포털은 배정 확인과 OMR 입력 연결까지만 허용한다.
- 한 번 제출한 OMR은 학생이 다시 수정하지 못한다.
- 제출 완료 후 “수정하기”, “재입력”, “재제출” 기능을 만들지 않는다.
- OMR 제출 완료 자료는 “제출 완료” 상태만 보여야 한다.
- 학생 포털에서 시험지 원문 열기, 아카이브 직접 열기, 기출 파일 직접 접근 기능을 추가하지 않는다.
- 학생 포털에서 아카이브 원본 파일 경로를 노출하지 않는다.
- 학생에게 시험지 선택권을 주는 기능은 만들지 않는다.

## 1.5 원장/관리자 화면 변경 금지 원칙

원장/관리자 대시보드 기능은 사용자의 명시적 허락 없이 수정·추가하지 않는다.

금지:

- 관리자 카드 추가
- 운영 가시성 요약 카드 추가
- 원장모드 화면 변경
- 관리자 전용 기능 선행 구현
- 관리필요학생 등 기존 관리자 화면 구성 임의 변경
- 관리자 용어 변경
- 관리자 화면에서 기존 카드 삭제 또는 위치 변경

허용:

- 사용자가 명시적으로 요청한 관리자 기능 수정
- 기존 버그 수정 범위 안에서 필요한 최소 수정

## 1.6 브랜드 용어

- “씨매쓰 초등”을 사용한다.
- CMS, 시메스, 씨메스라고 쓰지 않는다.
- “EIE 영어학원”을 사용한다.
- AP Math는 중고등 수학 브랜드로 사용한다.
- 내부 branch 코드는 `apmath`, `cmath`, `eie` 기준을 사용한다.

## 1.7 금전 관련 기능 원칙

수납·출납·결제수단·수납 정책·수납 거래·환불·이월·장부 등 금전 관련 데이터는 조회만으로 끝내지 않는다.

금전 관련 관리 기능은 원칙적으로 아래 흐름을 갖는다.

- 입력
- 수정
- 삭제 또는 비활성화
- 조회

단, 회계 흔적이 필요한 데이터는 물리 삭제하지 않는다.

수납 거래, 환불 기록, 이월 기록, 출납 장부처럼 기록 보존이 필요한 데이터는 삭제 대신 아래 방식 중 하나를 사용한다.

- 취소
- 무효
- 정정
- 비활성화
- 상태값 변경

결제수단과 수납 정책처럼 설정성 데이터는 `is_active = 0` 또는 status 비활성화를 우선한다.

운영 금전 데이터는 데이터 보존과 감사 가능성을 우선한다.

수납·출납 foundation은 관리자 전용 기능으로 유지한다.

- backend/DB/UI foundation 구현은 완료되어 있으나, 운영 화면 진입점은 숨김 상태로 유지한다.
- 원장/관리자 대시보드 또는 관리 메뉴에 기본 노출하지 않는다.
- 실제 운영 사용은 별도 승인 후 진입점 노출 단계에서 진행한다.
- backend는 admin이 아니면 403으로 차단한다.

---

# 2. 프로젝트 전체 구조

## 2.1 큰 구성

| 구분 | 역할 | 주의 |
|---|---|---|
| AP Math 운영센터 | 선생님/원장 운영 화면 | 기존 화면명·버튼명 변경 금지 |
| 학생 포털 | 학생 로그인, 배정 확인, OMR 연결 | 시험지 직접 열기 금지 |
| 플래너 | 학생 개인 플래너 | 학생포털 SSO 흐름 보존 |
| 아카이브/시험지 | 시험지 출력, OMR, 기출 자료 | 원본 기출 노출 정책 주의 |
| Worker API | Cloudflare Worker API | 새 API는 routes 폴더에 작성 |
| D1 DB | 학생, 반, 시험, 숙제, 출결, 수납 foundation | schema/migration 동시 관리 |
| 숙제 사진 확인 | 선생님 숙제 배정, 학생 제출 확인 | “숙제” 용어 유지 |
| 시간표 foundation | 수업 시간대, 충돌 기록 | 중등 90분, 고등 120분 기준 |
| 수납·출납 foundation | 결제/정산 기초 구조 | 실제 운영 기능은 별도 승인 후 진행 |
| 학부모 연락 foundation | 학부모 연락처/메시지 기초 구조 | 개인정보/문자 발송 주의 |

## 2.2 주요 폴더 역할

| 경로 | 역할 | 주의 |
|---|---|---|
| `apmath/` | AP Math 운영 프론트 | UI 문구 임의 변경 금지 |
| `apmath/index.html` | AP Math 운영센터 메인 HTML | 화면명/탭/버튼명 보존 |
| `apmath/js/` | 운영센터 주요 JS | API 호출 위치 많음 |
| `apmath/js/core.js` | 공통 설정, 인증, API helper, 초기 로딩 | `initial-data` 응답 구조 변경 금지 |
| `apmath/js/dashboard.js` | 대시보드/운영센터 핵심 렌더링 | 관리자/원장 화면 무단 변경 금지 |
| `apmath/js/classroom.js` | 교실/반별 수업 운영, 출결/숙제/숙제사진/플래너 일부 | “숙제” 용어 유지 |
| `apmath/js/student.js` | 학생 상세/상담/시험 관련 | 개인정보/PIN 주의 |
| `apmath/js/management.js` | 반/학생 관리 | 반명/학생 상태 흐름 주의 |
| `apmath/js/qr-omr.js` | OMR 입력/QR 관련 | 제출 완료 재수정 금지 |
| `apmath/js/report.js` | 리포트/AI 분석 | 학부모 문구 품질 주의 |
| `apmath/js/schedule.js` | 일정 관리 | 기존 일정 용어 보존 |
| `apmath/js/textbook.js` | 교재/진도 관리 | 기존 수업일지 흐름 보존 |
| `apmath/student/` | 학생 포털 | 시험지 직접 열기 금지 |
| `apmath/student/index.html` | 학생 포털 메인 | OMR 재입력/재제출 금지 |
| `apmath/planner/` | 학생 플래너 | 학생포털 SSO 흐름 보존 |
| `apmath/planner/index.html` | 플래너 메인 | 이름+PIN / student_id+PIN 흐름 보존 |
| `apmath/homework/` | 숙제 사진 제출 학생/공개 페이지 | “숙제” 용어 유지 |
| `apmath/homework/index.html` | 숙제 사진 제출 화면 | 학생 PIN/제출 상태 주의 |
| `apmath/worker-backup/worker/` | Cloudflare Worker | 배포 기준 폴더 |
| `apmath/worker-backup/worker/index.js` | Worker 진입점 | 새 API 본문 추가 금지 |
| `apmath/worker-backup/worker/routes/` | API route 분리 파일 | 새 API는 여기에 생성 |
| `apmath/worker-backup/worker/helpers/` | Worker 공통 helper | 인증/권한 영향 주의 |
| `apmath/worker-backup/worker/migrations/` | D1 migration | schema와 동시 관리 |
| `apmath/worker-backup/worker/schema.sql` | Worker DB 기준 스키마 | migration 누락 금지 |
| `archive/` | 시험지/아카이브 | 원본 기출 노출 정책 주의 |
| `archive/exams/` | 기출/유사/유형별 시험지 JS 데이터 | 원본/유사/심화 구분 주의 |
| `report-ai-proxy/` | 리포트 AI proxy 관련 | Worker와 별도 배포/검증 가능 |
| `docs/` | 기준 문서/룰북 저장 권장 위치 | 큰 작업 후 업데이트 필요 |

---

# 3. Worker 구조 지도

## 3.1 배포 기준

Worker 배포 위치:

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------\apmath\worker-backup\worker"
npx wrangler deploy
```

route 파일이 여러 개로 쪼개져 있어도 배포 방식은 동일하다.

## 3.2 `index.js` 역할

`apmath/worker-backup/worker/index.js`는 API 본문을 새로 넣는 곳이 아니다.

현재 역할:

- 공통 headers
- 공통 helper
- auth
- initial-data
- route import
- route 위임
- OPTIONS 처리
- Not Found 처리
- try/catch 처리
- 일부 legacy AI helper

원칙:

- 새 API 본문은 `index.js`에 직접 추가하지 않는다.
- 새 API는 원칙적으로 `apmath/worker-backup/worker/routes/*.js`에 만든다.
- 기존 API 수정은 담당 route 파일에서 한다.
- route 추가 시 `index.js`에는 import와 위임 조건만 추가한다.
- 위임부에서 스코프에 없는 `teacher` 변수를 넘기지 않는다.
- 필요한 인증은 handler 내부에서 `verifyAuth(request, env)`를 호출한다.
- `teacher is not defined` 재발을 막는다.
- route 분리 후 legacy fallback 본문은 중복으로 남기지 않는다.

## 3.3 route 파일별 담당 영역

실제 파일명은 현재 프로젝트 기준으로 확인해야 한다. 아래 표는 현재 구조의 기준 맵이다.

| Route file | 담당 기능 | 주요 API/resource | 관련 DB | 주의 |
|---|---|---|---|---|
| `routes/auth.js` | 로그인/비밀번호 변경 | `/api/auth/login`, `/api/auth/change-password` | `teachers` | 응답 JSON 구조와 SHA-256 hash 방식 보존 |
| `routes/student-portal.js` | 학생 포털 | `/api/student-portal/*` | `students`, `homework_photo_*` | 시험지 직접 열기 금지, OMR 재수정 금지 |
| `routes/planner.js` | 플래너 | `/api/planner`, `/api/planner-auth`, `/api/planner-auth-by-name` | `students`, `student_plans`, `planner_feedback` | 학생포털 SSO 흐름 보존 |
| `routes/homework-photo.js` | 숙제 사진 확인/배정 | `/api/homework-photo/*`, `DELETE /api/homework-photo/assignments/:id` | `homework_photo_assignments`, `homework_photo_submissions`, `homework_photo_files` | “숙제” 용어 유지, 배정 삭제는 `status='deleted'` soft delete, 제출 완료 흐름 임의 변경 금지 |
| `routes/check-omr.js` | OMR 체크/QR | `/api/check-pin`, `/api/check-init`, `/api/qr-classes` | `students`, `classes`, `exam_sessions` | `teacher is not defined` 재발 금지 |
| `routes/reports-ai.js` | 리포트 AI | `/api/ai/*`, report-ai 계열 | 시험/오답/학생 데이터 | 학부모 문구 품질/금지 표현 유지 |
| `routes/class-daily.js` | 수업일지/교재 진도 | class-daily 계열 | `class_textbooks`, `class_daily_records`, `class_daily_progress` | 기존 수업일지 UI 흐름 보존 |
| `routes/exams.js` | 시험/OMR/오답 | exam 계열 | `exam_sessions`, `wrong_answers`, `questions`, `exam_blueprints`, `class_exam_assignments` | MIXED archive 처리 보존, OMR 재수정 금지 |
| `routes/operations.js` | 상담/운영 메모/일정 | operation 계열 | `consultations`, `operation_memos`, `exam_schedules`, `academy_schedules`, `school_exam_records`, `daily_journals` | 메모 공유 정책 주의 |
| `routes/attendance-homework.js` | 출결/숙제 체크 | attendance/homework 계열 | `attendance`, `homework` | 상태명/버튼명 변경 금지 |
| `routes/students.js` | 학생 관리 | `/api/students/*` | `students`, `class_students` | PIN/개인정보 보안 주의 |
| `routes/classes.js` | 반 관리 | `/api/classes/*`, class-students 계열 | `classes`, `class_students` | 반 구조 변경 주의 |
| `routes/teachers.js` | 선생님/담당반 | teachers 계열 | `teachers`, `teacher_classes` | 권한 범위 주의 |
| `routes/enrollments.js` | 수강 등록 foundation | `/api/enrollments` | `student_enrollments` | AP Math/씨매쓰 초등/EIE 구분 주의 |
| `routes/class-time-slots.js` | 수업 시간대 foundation | `/api/class-time-slots` | `class_time_slots` | 중등 90분, 고등 120분 기준 |
| `routes/timetable-conflicts.js` | 시간표 충돌/예외 | `/api/timetable-conflicts`, `/api/timetable-conflict-overrides` | `timetable_conflict_logs`, `timetable_conflict_overrides` | teacher 충돌 예외 정책 주의 |
| `routes/foundation-sync.js` | foundation 동기화 | `/api/foundation-sync/*` | `foundation_sync_logs`, `student_enrollments`, `class_time_slots` | preview/run 구분 |
| `routes/foundation-logs.js` | audit/privacy 로그 | `/api/foundation-logs/*` | `audit_logs`, `privacy_access_logs` | 개인정보 접근 로그 |
| `routes/billing-foundation.js` | 청구 foundation | `/api/billing-foundation/*` | `billing_templates`, `payments`, `billing_runs` | 실제 운영 기능과 foundation 구분 |
| `routes/billing-accounting-foundation.js` | 수납·출납 foundation | `/api/billing-accounting-foundation/*` | payment/accounting 계열 조회·설정 foundation | admin 전용, `cashbook-entries` POST/PATCH/cancel 지원 |
| `routes/parent-foundation.js` | 학부모 연락 foundation | `/api/parent-foundation/*` | `parent_contacts`, `message_logs` | 연락처/문자 개인정보 주의 |

새 route 파일을 만들면 이 표를 반드시 업데이트한다.

## 3.4 API resource별 위치

| API/resource | 담당 파일 | 상태 | 기본 smoke |
|---|---|---|---|
| `/api/auth/login` | `routes/auth.js` | 분리 완료 | login |
| `/api/auth/change-password` | `routes/auth.js` | 분리 완료 | change-password |
| `/api/initial-data` | `index.js` | 유지 | GET initial-data |
| `/api/students` | `routes/students.js` | 분리 완료 | GET students |
| `/api/classes`, `/api/class-students` | `routes/classes.js` | 분리 완료 | GET classes |
| `/api/teachers`, `/api/teacher-classes` | `routes/teachers.js` | 분리 완료 | GET teachers |
| `/api/attendance*`, `/api/homework*` | `routes/attendance-homework.js` | 분리 완료 | attendance-history |
| `/api/exam-sessions`, `/api/exam-blueprints`, `/api/class-exam-assignments` | `routes/exams.js` | 분리 완료 | exam by class |
| `/api/check-pin`, `/api/check-init`, `/api/qr-classes` | `routes/check-omr.js` | 분리 완료 | qr-classes |
| `/api/homework-photo/*` | `routes/homework-photo.js` | 분리 완료 | assignments, assignment delete |
| `/api/student-portal/*` | `routes/student-portal.js` | 분리 완료 | auth/home |
| `/api/planner*`, `/api/planner-auth*` | `routes/planner.js` | 분리 완료 | planner-auth-by-name |
| `/api/ai/*` | `routes/reports-ai.js` | 분리 완료 | report-analysis |
| `/api/class-textbooks`, `/api/class-daily-records`, `/api/class-daily-progress` | `routes/class-daily.js` | 분리 완료 | class-textbooks |
| `/api/consultations`, `/api/operation-memos`, `/api/exam-schedules`, `/api/academy-schedules`, `/api/school-exam-records`, `/api/daily-journals` | `routes/operations.js` | 분리 완료 | resource별 GET/POST |
| `/api/enrollments` | `routes/enrollments.js` | 분리 완료 | GET enrollments |
| `/api/class-time-slots` | `routes/class-time-slots.js` | 분리 완료 | GET slots |
| `/api/timetable-conflicts`, `/api/timetable-conflict-overrides` | `routes/timetable-conflicts.js` | 분리 완료 | GET conflicts |
| `/api/foundation-sync/*` | `routes/foundation-sync.js` | 분리 완료 | preview |
| `/api/foundation-logs/*` | `routes/foundation-logs.js` | 분리 완료 | logs |
| `/api/billing-foundation/*` | `routes/billing-foundation.js` | 분리 완료 | templates |
| `/api/billing-accounting-foundation/*` | `routes/billing-accounting-foundation.js` | 분리 완료 | payment-methods, billing-policy-rules, payment-transactions |
| `/api/parent-foundation/*` | `routes/parent-foundation.js` | 분리 완료 | contacts/messages |

---

# 4. 프론트 파일별 API 호출 지도

## 4.1 프론트 수정 기본 원칙

프론트 파일을 수정할 때는 먼저 다음을 찾는다.

1. 어느 화면인가?
2. 어느 파일인가?
3. 어느 함수가 버튼을 렌더링하는가?
4. 어느 함수가 API를 호출하는가?
5. 어떤 Worker route가 받는가?
6. 어떤 DB 테이블을 건드리는가?

기능 추가 중에도 기존 문구·버튼명·화면명·메뉴명·운영 용어는 바꾸지 않는다.

## 4.2 주요 프론트 파일별 API 맵

| 프론트 파일 | 주요 역할 | 호출 API | 담당 route | 주의 |
|---|---|---|---|---|
| `apmath/js/core.js` | 공통 설정, 로그인, 초기 데이터, api helper | `/api/auth/login`, `/api/initial-data`, 기타 `api.*` | `index.js`, 각 route | 응답 구조 변경 금지 |
| `apmath/js/dashboard.js` | 대시보드, 선생님/학생/운영 요약, 일지 일부 | `/api/teachers`, `/api/teacher-classes`, `/api/daily-journals`, `/api/students/*`, `/api/attendance`, `/api/homework` | `routes/teachers.js`, `routes/operations.js`, `routes/students.js`, `routes/attendance-homework.js` | 관리자/원장 화면 무단 변경 금지 |
| `apmath/js/classroom.js` | 반별 수업 운영, 출결/숙제, 숙제사진, class-daily, 플래너 overview, 시험 | `/api/attendance-history`, `/api/attendance-month`, `/api/homework-photo/*`, `/api/class-daily-*`, `/api/planner*`, `/api/exam-sessions/*` | attendance-homework, homework-photo, class-daily, planner, exams | “숙제” 용어 유지 |
| `apmath/js/cumulative.js` | 누적 출결/성적 | `/api/attendance-history`, `/api/attendance-month`, `/api/school-exam-records` | attendance-homework, operations | 성적/출결 응답 구조 주의 |
| `apmath/js/management.js` | 반 관리 | `/api/classes`, `/api/class-students` | `routes/classes.js` | 반명/구조 변경 주의 |
| `apmath/js/memo.js` | 운영 메모 | `/api/operation-memos` | `routes/operations.js` | 메모 공유 정책 주의 |
| `apmath/js/qr-omr.js` | OMR 입력/QR | `/api/exam-sessions/bulk-omr`, exam 관련 endpoint | `routes/exams.js`, `routes/check-omr.js` | 제출 완료 후 재수정 금지 |
| `apmath/js/report.js` | 리포트/AI 분석/상담 | `/api/consultations`, `/api/ai/report-analysis`, `/api/ai/student-report` | `routes/operations.js`, `routes/reports-ai.js` | 학부모 문구 품질 주의 |
| `apmath/js/schedule.js` | 시험/학원 일정 | `/api/exam-schedules`, `/api/academy-schedules` | `routes/operations.js` | 일정 용어 보존 |
| `apmath/js/student.js` | 학생 상세/상담/시험 | `/api/students`, `/api/consultations`, `/api/exam-sessions` | students, operations, exams | 개인정보/PIN 주의 |
| `apmath/js/textbook.js` | 교재/진도 | `/api/class-textbooks` | `routes/class-daily.js` | 수업일지 흐름 보존 |
| `apmath/js/management.js` | 수납·출납 foundation 설정/요약 | `/api/billing-accounting-foundation/*` | `routes/billing-accounting-foundation.js` | 운영 진입점 숨김 상태 유지, 실제 수납/환불/이월 처리 금지 |
| `apmath/student/index.html` | 학생 포털 | `/api/student-portal/auth`, `/api/student-portal/home`, `/api/homework-photo/cancel` 등 | student-portal, homework-photo | 시험지 직접 열기 금지 |
| `apmath/planner/index.html` | 플래너 | `/api/planner-auth-by-name`, `/api/planner-auth`, `/api/planner`, `/api/planner/settings` | `routes/planner.js` | SSO/이름+PIN 흐름 보존 |
| `apmath/homework/index.html` | 숙제 사진 제출 | `/api/homework-photo/assignment`, `/api/homework-photo/auth`, `/api/homework-photo/submit`, `/api/homework-photo/cancel` | `routes/homework-photo.js` | 제출 상태/PIN 주의 |

## 4.3 기능별 프론트 진입점 기준

| 기능 | 주요 프론트 위치 | 주요 API | 담당 Worker route | 관련 DB | 주의 |
|---|---|---|---|---|---|
| 운영센터 초기 로딩 | `apmath/js/core.js`, 운영센터 HTML | `GET /api/initial-data` | `index.js` | 대부분의 운영 테이블 | 응답 구조 변경 금지 |
| 학생 관리 | `dashboard.js`, `student.js`, `management.js` | `/api/students/*` | `routes/students.js` | `students`, `class_students` | PIN/개인정보 주의 |
| 반 관리 | `management.js`, `dashboard.js` | `/api/classes/*` | `routes/classes.js` | `classes`, `class_students` | 기존 반명/화면명 보존 |
| 출결/숙제 체크 | `classroom.js`, `dashboard.js`, `cumulative.js` | attendance/homework 계열 | `routes/attendance-homework.js` | `attendance`, `homework` | “숙제” 용어 유지 |
| 시험/OMR/오답 | `qr-omr.js`, `classroom.js`, `student.js` | exam/check-omr 계열 | `routes/exams.js`, `routes/check-omr.js` | `exam_sessions`, `wrong_answers`, `questions` | 제출 완료 재수정 금지 |
| 숙제 사진 확인 | `classroom.js`, `student/index.html`, `homework/index.html` | `/api/homework-photo/*` | `routes/homework-photo.js` | `homework_photo_*` | “숙제”를 “과제”로 바꾸지 말 것 |
| 학생 포털 | `apmath/student/index.html` | `/api/student-portal/*` | `routes/student-portal.js` | `students`, `class_students`, `homework_photo_*` | 시험지 직접 열기 금지 |
| 플래너 | `apmath/planner/index.html`, `classroom.js` | `/api/planner*` | `routes/planner.js` | `student_plans`, `planner_feedback` | SSO 흐름 보존 |
| 리포트/AI | `report.js` | `/api/ai/*`, `/api/consultations` | `routes/reports-ai.js`, `routes/operations.js` | 시험/오답/상담 | 학부모 문구 품질 유지 |
| 수업일지 | `classroom.js`, `textbook.js`, `dashboard.js` | class-daily/daily-journals 계열 | `routes/class-daily.js`, `routes/operations.js` | `class_daily_*`, `daily_journals` | 기존 일지 문구 보존 |
| 시간표 foundation | foundation UI, 시간표 관련 JS | timetable/foundation 계열 | timetable/foundation route | `class_time_slots`, conflict logs | 중등 90분, 고등 120분 |
| 수납·출납 foundation | `dashboard.js` 관리 진입점 숨김, `management.js` 설정/요약 모달 유지 | `/api/billing-accounting-foundation/*` | `routes/billing-accounting-foundation.js` | `payment_methods`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `billing_policy_rules`, `accounting_daily_summaries`, `accounting_monthly_summaries` | 운영 노출 숨김, 실제 수납 처리 금지 |
| 학부모 연락 foundation | 연락/문자 준비 UI | parent-foundation 계열 | `routes/parent-foundation.js` | `parent_contacts`, `message_logs` | 개인정보/문자 발송 주의 |
| 아카이브/시험지 출력 | archive HTML/JS | archive/exam data | 정적 파일 + 일부 Worker 연계 | exam_blueprints 등 | 원본 기출 노출 정책 주의 |

## 4.4 버튼 수정 시 규칙

- 버튼 추가/삭제는 먼저 프론트 파일에서 함수와 렌더링 위치를 찾는다.
- API가 이미 있으면 프론트만 연결한다.
- API가 없으면 Worker route를 먼저 만든다.
- DB 필드가 없으면 migration이 필요한지 판단한다.
- `index.js`에 API 본문을 직접 추가하지 않는다.
- 기능 추가 중 기존 버튼명/문구/화면명을 임의로 바꾸지 않는다.
- 버튼 삭제 작업이라도 기존 주변 문구를 정리하지 않는다.
- 삭제 버튼을 추가할 때도 기존 “숙제” 문구를 “과제”로 바꾸지 않는다.

---

# 5. DB 구조 지도

## 5.1 테이블별 기능 맵

| Table | 기능 | 주요 route | 주요 프론트 | 주의 |
|---|---|---|---|---|
| `teachers` | 선생님 계정 | auth, teachers | 로그인/관리 | 권한 변경 주의 |
| `students` | 학생 기본 정보 | students, student-portal, planner | 운영센터, 학생 포털, 플래너 | `student_pin` 보안 주의 |
| `classes` | 반 정보 | classes, initial-data, timetable | 운영센터 | `time_label` 기준 주의 |
| `teacher_classes` | 선생님-반 매핑 | teachers/classes | 운영센터 | 권한 범위 영향 |
| `class_students` | 반-학생 매핑 | classes/students | 운영센터 | 재원생/숨김/제적 흐름 주의 |
| `attendance` | 출결 | attendance-homework | 출결 UI | 상태명 변경 금지 |
| `homework` | 숙제 체크 | attendance-homework, homework-photo | 숙제 UI | “숙제” 용어 유지 |
| `exam_sessions` | 시험 세션 | exams, reports-ai | 시험/리포트 UI | archive_file 보존 |
| `wrong_answers` | 오답 | exams, reports-ai | 오답/리포트 UI | question_id 의미 유지 |
| `questions` | 문항 메타 | exams/reports | 리포트 | 단원 키 주의 |
| `consultations` | 상담 기록 | operations | 상담 UI | 개인정보 주의 |
| `operation_memos` | 운영 메모 | operations, initial-data | 운영센터 | 메모 공유 정책 주의 |
| `exam_schedules` | 학교 시험 일정 | operations | 일정 UI | 기존 화면명 보존 |
| `academy_schedules` | 학원 일정 | operations | 일정 UI | 공유 범위 주의 |
| `school_exam_records` | 학교 성적 | operations/reports | 성적 UI | 삭제보다 soft delete |
| `exam_blueprints` | 시험 설계도 | exams | OMR/리포트 | MIXED 처리 보존 |
| `class_exam_assignments` | 반 시험 배정 | exams/check-omr | OMR | 학생 시험지 직접 접근 금지 |
| `daily_journals` | 일지 | class-daily/initial-data | 수업일지 | 선생님별 범위 주의 |
| `class_textbooks` | 반 교재 | class-daily | 수업일지 | 상태명 보존 |
| `class_daily_records` | 반 일일 기록 | class-daily | 수업일지 | 기존 흐름 보존 |
| `class_daily_progress` | 진도 기록 | class-daily | 수업일지 | record_id 연결 주의 |
| `homework_photo_assignments` | 숙제 사진 배정 | homework-photo | 숙제관리 UI | `status='deleted'` soft delete, 목록 조회는 deleted 제외, “숙제” 용어 유지 |
| `homework_photo_submissions` | 숙제 사진 제출 상태 | homework-photo, student-portal | 학생 포털/숙제관리 | 제출 완료 흐름 주의 |
| `homework_photo_files` | 숙제 사진 파일 | homework-photo | 숙제관리 | R2/만료 정책 주의 |
| `student_plans` | 플래너 계획 | planner | 플래너 | SSO 흐름 보존 |
| `planner_feedback` | 플래너 피드백 | planner | 플래너 | 학생별 범위 주의 |
| `student_enrollments` | 수강 등록 foundation | foundation | foundation UI | 실제 청구와 구분 |
| `class_time_slots` | 수업 시간대 | timetable foundation | 시간표 | 중등 90분, 고등 120분 |
| `timetable_conflict_logs` | 시간표 충돌 로그 | timetable foundation | 시간표 | teacher 충돌 예외 정책 주의 |
| `timetable_conflict_overrides` | 충돌 예외 | timetable foundation | 시간표 | 예외 사유 기록 |
| `billing_templates` | 청구 템플릿 foundation | billing-foundation | 수납/출납 준비 UI | 실제 청구와 구분 |
| `payments` | 결제/청구 records | billing-foundation | 수납/출납 준비 UI | 실제 운영 전 검수 필요 |
| `payment_items` | 결제 항목 | billing-foundation | 수납/출납 준비 UI | payment 연결 주의 |
| `billing_adjustments` | 청구 조정 | billing-foundation | 수납/출납 준비 UI | 조정 사유 기록 |
| `billing_runs` | 청구 batch | billing-foundation | 수납/출납 준비 UI | 월/branch 기준 |
| `parent_contacts` | 학부모 연락처 foundation | parent-foundation | 학부모 연락 UI | 전화번호 개인정보 주의 |
| `message_logs` | 문자/메시지 로그 | parent-foundation | 학부모 연락 UI | 발송 이력 주의 |
| `student_status_history` | 학생 상태 변경 기록 | foundation | foundation UI | audit 성격 |
| `class_transfer_history` | 반 이동 기록 | foundation | foundation UI | audit 성격 |
| `staff_permissions` | 직원 권한 foundation | foundation | 관리자/권한 UI | 권한 변경 주의 |
| `audit_logs` | 감사 로그 | foundation-logs | 관리자/foundation | privileged action 기록 |
| `privacy_access_logs` | 개인정보 접근 로그 | foundation-logs | 관리자/foundation | 개인정보 접근 추적 |
| `foundation_sync_logs` | foundation sync 로그 | foundation-sync | foundation UI | preview/run 기록 |
| `payment_methods` | 결제 수단 설정 | billing-accounting-foundation | backend foundation coverage | `active` 필터, `sort_order` 정렬, `method_key` 중복 방지 |
| `payment_transactions` | 수납 거래 | billing-accounting-foundation | backend foundation coverage | `student_id/branch/status/date range/limit` 조회 |
| `cashbook_entries` | 출납 장부 | billing-accounting-foundation | backend foundation coverage | `student_id/branch/entry_type/date range/limit` 조회, `status`, `is_active` 기준으로 취소/비활성화 보존 처리 |
| `refund_records` | 환불 기록 | billing-accounting-foundation | backend foundation coverage | `student_id/branch/status/date range/limit` 조회 |
| `carryover_records` | 이월 기록 | billing-accounting-foundation | backend foundation coverage | `student_id/branch/status/created_at date range/limit` 조회 |
| `billing_policy_rules` | 수납 정책 rule | billing-accounting-foundation | backend foundation coverage | `branch/rule_type/active` 조회, `value_json` JSON 문자열 안정화 |
| `accounting_daily_summaries` | 일별 회계 요약 | billing-accounting-foundation | backend foundation coverage | `branch/date range/limit` 조회 전용 |
| `accounting_monthly_summaries` | 월별 회계 요약 | billing-accounting-foundation | backend foundation coverage | `branch/year/month/limit` 조회 전용 |

## 5.2 DB 변경 규칙

- 운영 중인 테이블 필드 의미를 임의로 변경하지 않는다.
- 삭제보다 soft delete를 우선한다.
- 새 테이블은 migration을 만든다.
- `schema.sql`만 수정하고 migration을 누락하지 않는다.
- migration 적용 전 관련 route와 프론트 영향을 확인한다.
- 기존 API 응답 구조 변경이 필요한 DB 변경은 별도 승인 후 진행한다.
- 학생 PIN, 전화번호 등 민감 정보는 문서에 그대로 적지 않는다.
- DB 필드명이 `assignment` 또는 `task` 계열이어도 화면 문구를 “과제”로 바꿔도 된다는 뜻이 아니다.
- 사용자 화면의 기존 “숙제” 문구는 유지한다.
- 금전 데이터는 물리 삭제보다 취소, 무효, 정정, 비활성화, 상태값 변경을 우선한다.
- `cashbook_entries`는 `status`, `is_active` 기준으로 취소/비활성화 보존 처리를 사용한다.

---

# 6. 배포 및 smoke test

이 장의 명령은 **사용자가 직접 실행하기 위한 참고 명령**이다.

작업자는 사용자의 명시 지시가 없는 한 아래 명령을 직접 실행하지 않는다.

- `npx wrangler deploy` 실행 금지
- 운영 API smoke test 실행 금지
- 운영 계정 로그인 smoke 실행 금지
- 실제 운영 데이터 생성/삭제 smoke 실행 금지

작업자는 배포와 smoke가 필요한 경우 `CODEX_RESULT.md`의 “다음 조치”에 사용자가 직접 실행할 명령만 적는다.

## 6.1 Worker 배포

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------\apmath\worker-backup\worker"
npx wrangler deploy
```

## 6.2 기본 인증

```powershell
$pair = "admin:admin1234"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
$basic = [Convert]::ToBase64String($bytes)
```

## 6.3 기본 smoke test

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/initial-data" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/qr-classes" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/homework-photo/assignments?class_id=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/planner-auth-by-name" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"","pin":""}'

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/foundation-sync/preview" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

## 6.4 추가 smoke test

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-time-slots" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/timetable-conflicts" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/payment-methods" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/billing-policy-rules" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/payment-transactions" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/cashbook-entries" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

## 6.5 smoke 해석 기준

- `planner-auth-by-name` 빈 값 테스트는 400/401류 검증 응답이면 PASS다.
- Not Found면 FAIL이다.
- `teacher is not defined`면 FAIL이다.
- `initial-data`는 운영센터 전체 영향이므로 반드시 확인한다.
- 한글이 PowerShell에서 깨져 보여도 JSON 구조와 success/error 기준으로 판단한다.
- public/student/homework 계열 smoke에서는 실제 학생 PIN을 문서나 로그에 남기지 않는다.

## 6.6 작업자 실행 제한

이 장에 명령이 적혀 있어도 작업자가 자동으로 실행하라는 뜻이 아니다.

기본 원칙:

- 사용자가 명시하지 않으면 배포하지 않는다.
- 사용자가 명시하지 않으면 운영 API smoke test를 실행하지 않는다.
- 사용자가 명시하지 않으면 운영 데이터 생성/삭제 테스트를 하지 않는다.
- 사용자가 명시하지 않으면 로그인 성공 smoke처럼 실제 운영 계정을 쓰는 테스트를 하지 않는다.

작업자는 필요한 명령을 `CODEX_RESULT.md`의 “다음 조치”에 정리하고 종료한다.

---

# 7. 작업 후 문서 업데이트 규칙

## 7.1 문서 업데이트가 필수인 경우

다음 중 하나라도 해당하면 문서 업데이트가 필수다.

- 새 폴더 생성
- 새 route 파일 생성
- 새 helper 파일 생성
- 새 API 추가
- 기존 API 경로 변경
- 프론트 버튼/화면 큰 변경
- 기존 UI 문구 변경 요청이 있었던 작업
- 새 DB 테이블 생성
- migration 추가
- 배포 방식 변경
- smoke test 추가/변경
- 운영 정책 변경
- 금지 정책 변경
- 작업 큐의 완료/보류 상태 변경

## 7.2 변경 유형별 업데이트 위치

이 문서는 룰북과 구조 지도를 한 파일로 통합한 기준 문서이므로, 큰 작업 후 이 문서의 관련 섹션을 직접 업데이트한다.

| 변경 유형 | 업데이트할 섹션 |
|---|---|
| 새 route/API | 3장 Worker 구조 지도, 4장 프론트/API 연결 |
| 새 프론트 버튼/화면 | 4장 프론트 파일별 API 호출 지도, 2장 프로젝트 구조 |
| UI 문구 변경 요청 | 1장 UI 문구 보존 원칙, 4장 해당 기능 주의 |
| 새 DB 테이블/migration | 5장 DB 구조 지도 |
| 배포/검증 변경 | 6장 배포 및 smoke test |
| 큰 기능 완료 | 8장 다음 작업 큐 |
| 새 폴더/큰 분류 | 2장 프로젝트 전체 구조 |
| 금지 원칙 추가 | 1장 최상위 작업 원칙, 7장 문서 업데이트 규칙 |

## 7.3 완료 기준

큰 기능, 새 route, 새 폴더, 새 DB 테이블, 새 프론트 진입점이 생긴 작업은 기능 구현이 끝난 뒤 반드시 이 문서를 업데이트한다.

기준 문서가 업데이트되지 않으면 작업은 완료로 보지 않는다.

모든 UI 작업 완료 보고에는 기존 문구·버튼명·화면명·메뉴명·운영 용어를 변경했는지 여부를 적는다.

사용자 요청 없이 변경된 UI 텍스트가 있으면 작업 실패로 본다.

다음 조치에는 사용자가 직접 실행할 항목을 명확히 적는다.

예시:

```md
## 5. 다음 조치
- 사용자가 직접 `npx wrangler deploy`
- 사용자가 직접 운영 API smoke test
- 사용자가 직접 지정 파일만 `git add`
- 사용자가 직접 `git commit`
- 사용자가 직접 `git push`
```

---

# 8. 다음 작업 큐

## 8.1 완료된 큰 작업

현재 기준으로 완료된 큰 작업:

- Worker route 분리
- planner route 분리
- index.js legacy cleanup
- homework-photo route 분리
- student-portal route 분리
- check-omr route 분리
- reports-ai route 분리
- class-daily route 분리
- operations route 분리
- exams route 분리
- attendance/homework route 분리
- students/classes/teachers route 분리
- foundation/time-slot/conflict 계열 구축
- 수납·출납 foundation 0단계
- 수납·출납 foundation 1단계-A
- 수납·출납 foundation 1단계-B
- 수납·출납 foundation 1단계-C
- 수납·출납 foundation 1단계-D
- 수납·출납 foundation 대시보드/관리 메뉴 노출 숨김 보정
- OMR 제출 완료 수정 금지 정책 반영
- 학생 포털 시험지 직접 열기 금지 정책 반영
- 숙제 사진 확인 시스템 기본 구축
- auth route 분리

## 8.2 다음 후보

### 안정화/정리
	
- 출결 작업 완료 후 다음 구조 개선 후보: initial-data 분리 사전 분석
- 목표: 현재 initial-data가 내려주는 DB 테이블/데이터 목록 정리
- 목표: 대시보드 첫 화면에 필요한 데이터와 화면 진입 후 불러와도 되는 데이터 분류
- 목표: 프론트 파일별 사용 데이터 지도 작성
- 목표: 분리 가능한 데이터와 보류할 데이터 구분
- 목표: 1차/2차/3차 분리 순서 작성
- 주의: 바로 구현하지 않는다.
- 주의: 먼저 문서화와 분리 순서 설계부터 진행한다.
- 주의: 기존 화면이 깨지지 않도록 기존 initial-data 응답 구조를 함부로 줄이지 않는다.
- 기준 문서 업데이트 자동 루틴화
- route map 최신성 점검
- student-portal/exams 및 student-portal/omr-submit 실제 route coverage 확인

### 운영 기능

- 수납·출납 foundation 1단계-E: 운영 수동 테스트 결과 반영 및 월별 수납 화면 고도화
- 수납·출납 foundation 운영 노출 전 수동 테스트 및 진입점 재오픈 판단
- 학부모 연락/문자 foundation
- 숙제 사진 관리 UI 개선
- 숙제 제출 현황 개선
- 실제 운영 수납 정책 입력
- 시간표 room_name 입력 후 room conflict 판단

### 보류

- initial-data 직접 분리
- 관리자 대시보드 신규 기능
- 학생 시험지 직접 접근
- 제출 완료 OMR 재수정 기능
- 실제 결제/문자 발송 운영 기능

## 8.3 계속 유지할 금지/주의

- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 금지
- “숙제”를 “과제”로 바꾸는 식의 임의 용어 정리 금지
- 학생이 시험지를 직접 여는 기능 금지
- 학생 포털은 배정 확인과 OMR 입력 연결까지만 허용
- 제출 완료 OMR 수정/재입력/재제출 금지
- 원장/관리자 화면은 명시 허락 없이 변경 금지
- 새 기능 선행 구현 금지
- 연결되지 않는 함수 미리 추가 금지
- 기존 API 응답 구조 임의 변경 금지
- 기존 DB 필드 의미 변경 금지
- `git add .` 금지

---

# 9. Git 작업 기준

- 절대 `git add .` 하지 않는다.
- 작업 파일만 정확히 add한다.
- 기존 dirty 파일은 이번 작업과 무관하면 건드리지 않는다.
- 커밋 전 `git status --short`와 `git diff --name-only`를 확인한다.
- 문서 작업이면 코드 파일이 변경되면 안 된다.
- 코드 작업이면 문서 변경 여부를 완료 보고에 명시한다.
- 작업자는 사용자의 명시 지시가 없는 한 `git commit`을 실행하지 않는다.
- 작업자는 사용자의 명시 지시가 없는 한 `git push`를 실행하지 않는다.
- 작업자는 `CODEX_RESULT.md`에 커밋 대상 파일과 권장 커밋 메시지만 적는다.

## 9.1 사용자가 직접 실행하는 커밋 예시

아래 명령은 사용자가 직접 실행하기 위한 참고 명령이다.
작업자는 사용자의 명시 지시가 없는 한 실행하지 않는다.


```powershell
git status --short
git diff --name-only

git add docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md CODEX_RESULT.md
git commit -m "Document AP Math OS project rulebook and structure map"
git push
```

존재하지 않거나 수정하지 않은 파일은 add하지 않는다.
코드 파일은 문서 작업 커밋에 포함하지 않는다.

## 9.2 작업자 완료 보고에 적을 Git 정보

작업자는 직접 커밋하지 않는 대신 `CODEX_RESULT.md`에 아래를 적는다.

- 커밋 대상 파일
- 권장 커밋 메시지
- `git status --short` 결과
- `git diff --name-only` 결과
- git commit 실행 여부: `미실행 - 사용자 직접 실행 대상`
- git push 실행 여부: `미실행 - 사용자 직접 실행 대상`

---

# 10. 완료 보고 기준

모든 작업 완료 보고는 아래 구조를 따른다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 완료 또는 확인 완료
## 3. 실행 결과
## 4. 결과 요약
## 5. 다음 조치
```

완료 보고에는 항상 아래 항목을 함께 적는다.

- 배포 실행 여부:
- 운영 smoke 실행 여부:
- git commit 실행 여부:
- git push 실행 여부:

기본값은 모두 `미실행 - 사용자 직접 실행 대상`이다.
사용자가 해당 작업에서 명시적으로 지시한 경우에만 `실행`으로 적는다.

큰 작업, 새 route, 새 폴더, 새 DB 테이블, 새 프론트 진입점이 생긴 경우 완료 보고에 문서 업데이트 여부를 반드시 적는다.

UI 관련 작업이면 완료 보고에 아래 항목을 반드시 적는다.

- 기존 문구 변경 여부
- 기존 버튼명 변경 여부
- 기존 화면명 변경 여부
- 기존 메뉴명 변경 여부
- 기존 운영 용어 변경 여부

사용자 요청 없이 변경된 UI 텍스트가 있으면 작업 실패로 본다.

---

# 11. 작업 시작 전 체크리스트

작업자는 실제 수정 전에 아래를 확인한다.

- 이번 작업이 UI 작업인가?
- 기존 문구·버튼명·화면명을 바꾸는가?
- API 작업이면 담당 route 파일이 어디인가?
- 새 API를 index.js에 넣으려는 실수를 하고 있지 않은가?
- DB 변경이 필요한가?
- migration이 필요한가?
- 학생 포털/OMR 금지 원칙에 걸리지 않는가?
- 원장/관리자 화면을 건드리는가?
- 사용자가 명시적으로 허락한 범위인가?
- 작업 후 이 문서의 어떤 섹션을 업데이트해야 하는가?
- 사용자가 명시하지 않았는데 배포를 실행하려고 하지 않았는가?
- 사용자가 명시하지 않았는데 운영 smoke test를 실행하려고 하지 않았는가?
- 사용자가 명시하지 않았는데 git commit/push를 실행하려고 하지 않았는가?

---

# 12. 작업 완료 전 체크리스트

작업자는 완료 전에 아래를 확인한다.

- 요청받은 기능만 수정했는가?
- 기존 UI 문구를 임의로 바꾸지 않았는가?
- 기존 버튼명을 임의로 바꾸지 않았는가?
- 기존 화면명을 임의로 바꾸지 않았는가?
- 기존 메뉴명/탭명을 임의로 바꾸지 않았는가?
- “숙제”를 “과제”로 바꾸는 식의 용어 변경이 없는가?
- 새 API를 index.js에 직접 넣지 않았는가?
- route 위임부에 스코프 없는 변수를 넘기지 않았는가?
- OMR 재수정 경로가 생기지 않았는가?
- 학생 시험지 직접 접근 경로가 생기지 않았는가?
- 원장/관리자 화면을 무단 변경하지 않았는가?
- node --check 또는 해당 로컬 검증을 실행했는가?
- 사용자가 명시하지 않았는데 배포를 실행하지 않았는가?
- 사용자가 명시하지 않았는데 운영 smoke test를 실행하지 않았는가?
- 사용자가 명시하지 않았는데 git commit/push를 실행하지 않았는가?
- 배포와 smoke가 필요한 경우 다음 조치에 사용자 직접 실행 항목으로 적었는가?
- 큰 작업이면 이 문서를 업데이트했는가?
- `git add .` 를 하지 않았는가?

---

# 13. 지식/작업 전달 기준

## 13.1 레포 안에서 작업할 때

Codex 또는 사람 작업자가 같은 레포에서 작업할 때는 이 파일을 레포에 저장해 둔다.

권장 위치:

```text
docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
```

작업 지시서에는 다음 문구를 고정으로 넣는다.

```text
작업 전 반드시 docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

사용자가 명시하지 않은 경우 작업자는 배포, 운영 smoke test, git commit, git push를 실행하지 말고, 수정과 로컬 검증 및 CODEX_RESULT.md 작성까지만 수행하라.
```

## 13.2 다른 AI방 또는 외부 작업자에게 전달할 때

레포 접근이 없는 AI방, Gemini, Claude, 외부 작업자에게는 이 MD 파일 하나만 먼저 제공한다.

작은 기능 작업은 이 문서 + 관련 프론트 파일 + 관련 route 파일만 있으면 대부분 판단 가능하다.

큰 구조 작업은 이 문서 + worker 전체 zip 또는 관련 폴더 zip이 필요하다.

## 13.3 파일 제공 기준

| 작업 유형 | 제공 파일 |
|---|---|
| 작은 UI 버튼/문구 작업 | 이 MD + 관련 프론트 파일 |
| API endpoint 수정 | 이 MD + 관련 route 파일 + 필요 시 index.js |
| DB 변경 | 이 MD + schema.sql + migration 폴더 + 관련 route 파일 |
| Worker 구조 정리 | 이 MD + worker 폴더 전체 zip |
| 아카이브/시험지 작업 | 이 MD + 해당 archive 파일 + 이미지/assets |
| 플래너 작업 | 이 MD + `apmath/planner/index.html` + `routes/planner.js` |
| 학생 포털 작업 | 이 MD + `apmath/student/index.html` + `routes/student-portal.js` |
| 숙제 사진 작업 | 이 MD + 숙제 UI 파일 + `routes/homework-photo.js` |

---

# 2026-05-16 수업자료 오답 MVP 추가

## Route

- `apmath/worker-backup/worker/routes/study-material-wrongs.js`
- 담당 기능: 수업자료 오답
- `index.js`에는 import와 API 위임 조건만 둔다.

## API

- `/api/study-materials`
- `/api/material-unit-ranges`
- `/api/material-question-tags`
- `/api/class-material-assignments`
- `/api/material-omr`
- `/api/material-wrongs`
- `/api/material-review`

## DB Tables

- `study_materials`
- `material_unit_ranges`
- `material_question_tags`
- `class_material_assignments`
- `student_material_submissions`
- `student_material_wrong_answers`

## UI Entry

- 학생 포털: `apmath/student/index.html`의 `수업자료 오답` 섹션에서 배정 확인 및 오답 번호 제출
- 강사용 화면: `apmath/js/study-material-wrong.js`, drawer의 `수업자료 오답` 진입점

## 주의사항

- 학생 포털에서는 수업자료 원문, PDF, archive 경로를 열지 않는다.
- 학생은 제출 후 수업자료 오답을 수정할 수 없다.
- 원장/관리자 대시보드 요약 카드에는 노출하지 않는다.
- 기존 버튼명, 화면명, 운영 용어는 기존 기능에서 변경하지 않는다.

---

# 2026-05-16 수납·출납 foundation 1단계-E 진행

## Route 보강

- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- admin 전용 접근 차단은 유지한다.
- `date_from`, `date_to` query alias를 기존 날짜 필터에 추가한다.
- `branch=all`은 전체 조회로 처리하고, 특정 branch만 필터링한다.
- `accounting-daily-summaries`, `accounting-monthly-summaries` alias를 기존 summary 조회로 연결한다.
- `accounting-summary`는 DB에 summary를 insert/update하지 않고, 기존 `payments`, `payment_items`, `payment_transactions`, `refund_records`, `carryover_records`, `cashbook_entries`를 읽어 계산 결과만 응답한다.
- 계산 응답은 `total_paid`, `total_refunded`, `total_carryover`, `cashbook_income`, `cashbook_expense`, `by_method`, `by_status`, `by_branch` 확인에 사용한다.

## UI 보강

- `apmath/js/management.js`
- 기존 숨김 진입 상태를 유지한 채, 이미 존재하는 `수납·출납 foundation` 모달 내부의 월별 확인 탭만 보강한다.
- 조회 시 `accounting-summary`를 함께 불러와 월별 검산 카드와 결제수단별/상태별/브랜치별 그룹을 표시한다.
- year/month 입력이 비정상 값이면 현재 연월로 되돌려 화면 렌더링이 깨지지 않도록 한다.
- 데이터가 없거나 null/undefined인 경우 빈 상태로 표시한다.

## 계속 유지할 제한

- 대시보드/관리 메뉴에 새 카드, 새 버튼, 새 메뉴를 노출하지 않는다.
- `showBillingAccountingFoundationEntry = false`를 유지한다.
- 실제 청구 생성, 실제 결제 연동, 실제 문자/알림 발송, 실제 payments 데이터 자동 생성은 하지 않는다.
- Worker 배포, 운영 API smoke test, git commit, git push는 사용자가 직접 실행한다.

---

# 2026-05-16 수납·출납 foundation 1단계-E 안정화 보정

## Backend 보정

- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- `normalizeJsonString`은 빈 값은 `null`로 유지하고, 잘못된 JSON 또는 stringify 실패는 `invalid_json` 오류로 명확히 던진다.
- `billing_policy_rules`의 기존 `value_json must be valid JSON` 400 응답 흐름은 유지한다.
- 월별 summary의 환불 집계 기준은 `refund_records`를 우선한다.
- `refund_records` 합계가 없을 때만 기존 행 호환을 위해 `payment_transactions.transaction_type='refund'` 합계를 fallback으로 사용한다.
- `total_outstanding`은 환불 금액이 paid balance에서 빠져나가므로 남은 미수에 다시 더한다는 주석을 코드에 남겼다.
- `branch IS NULL`은 기존 AP Math 데이터 호환을 위해 `apmath`로 처리한다는 주석을 `pushBranchFilter`에 남겼다.

## Frontend 보정

- `apmath/js/management.js`
- 결제수단/수납 정책 목록에서 비활성 row의 토글 버튼 라벨을 `저장`이 아니라 `활성화`로 표시한다.
- `billingAccountingFetchAll`은 `Promise.allSettled`를 사용해 일부 API가 실패해도 성공한 API 결과는 화면에 반영한다.
- 일부 조회 실패 시 간단한 안내만 표시하고, 빈 배열/빈 summary 상태로 모달 렌더링을 유지한다.
- summary 조회 컨트롤, metric 카드, 그룹 카드 grid는 `auto-fit/minmax`로 보정해 좁은 화면에서 줄바꿈되도록 했다.

## 계속 유지할 제한

- `apmath/js/dashboard.js`는 수정하지 않고 `showBillingAccountingFoundationEntry = false` 상태만 확인했다.
- 수납·출납 foundation 진입점은 계속 숨김 상태다.
- 실제 청구 생성, 실제 결제 연동, 실제 문자/알림 발송, 실제 payments 자동 생성은 계속 금지한다.
- Worker 배포, 운영 API smoke test, git commit, git push는 사용자가 직접 실행한다.
