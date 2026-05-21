# CURRENT_UI_EXPOSURE_MAP

| 기능 | 현재 UI 노출 | 노출 위치 | 연결 API | foundation만 존재 | 승인 필요 |
|---|---|---|---|---|---|
| 로그인 | 예 | main app | `auth/login`, `logout` | 아니오 | 아니오 |
| 대시보드 | 예 | `dashboard.js` | initial-data, students, attendance/homework | 아니오 | 기존 보존 |
| 반 화면 | 예 | `classroom.js` | attendance, homework, planner, homework-photo, class-daily | 아니오 | 기존 보존 |
| 학생 상세/상담 | 예 | `student.js` | students, consultations, ai | 아니오 | 기존 보존 |
| 학부모 연락처/동의 | 일부 | `student.js` | parent-foundation | 일부 foundation | 확대 노출 승인 필요 |
| 수납/출납 | 제한/확인 필요 | `management.js` foundation modal | billing-accounting-foundation | 예 | 승인 필요 |
| 시간표 | 예 | `timetable.js` | timetable-versions, class-time-slots | 일부 | 기존 문구 보존 |
| 학생 포털 | 예 | `apmath/student/index.html` | student-portal, material-omr | 아니오 | 시험지 직접 열기 금지 |
| 플래너 | 예 | `apmath/planner/index.html`, classroom | planner | 아니오 | SSO 보존 |
| OMR/check | 예 | `check/check.js`, student portal, qr-omr | check-omr, exam-sessions | 아니오 | 제출 완료 수정 금지 |
| archive/mixed engine | 예 | `archive/*.html` | class-exam-assignments, exam-blueprints | 아니오 | MIXED 처리 보존 |
| report AI | 예 | `report.js` | ai/report-analysis | 아니오 | 학부모 문구 주의 |
| 직원 권한/감사 로그 | 숨김/일부 | 확인 필요 | foundation-logs, teachers | 예 | 승인 필요 |
| 홈페이지 관리 | 확인 필요 | `index.html` 등 | 확인 필요 | 확인 필요 | 승인 필요 |

