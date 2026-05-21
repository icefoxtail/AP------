# CURRENT_FRONTEND_MAP

## 1. AP Math main

| 파일 | 화면/도메인 | 주요 역할 | 호출 API | 회귀 위험 |
|---|---|---|---|---|
| `apmath/index.html` | APMS shell | CSS/JS 로드, 주요 화면 컨테이너 | 간접 | script 로드 순서 |
| `apmath/app.js` | app bootstrap | 확인 필요 | 확인 필요 | 초기화 |
| `apmath/js/core.js` | config/auth/state/api/initial-data | login, session, api wrapper, sync queue, state.db | `auth/login`, `logout`, `initial-data`, foundation 일부 | 전체 앱 |
| `apmath/js/dashboard.js` | 대시보드/운영/일지/교사 관리 | 위험학생, 일지, 교사 관리, 출결/숙제 quick | students, teachers, attendance, homework, daily-journals | 관리자/선생님 화면 |
| `apmath/js/classroom.js` | 반 화면 | 출결, 숙제, 플래너, 수업일지, 숙제사진 | attendance, homework, homework-photo, planner, class-daily | 선생님 현장 |
| `apmath/js/student.js` | 학생 상세/상담/학부모 | 학생 detail lazy, 상담, 학부모 연락/동의 | students, consultations, parent-foundation, ai | 개인정보 |
| `apmath/js/management.js` | 반/주소록/수납 foundation | 반 관리, PIN, billing accounting modal | classes, billing-accounting-foundation | 숨김 foundation 노출 |
| `apmath/js/timetable.js` | 시간표 | 운영 시간표, draft/version, slot, conflict | timetable-versions, class-time-slots, conflicts, enrollments | 운영/staging 혼선 |
| `apmath/js/report.js` | 리포트/AI | 학부모/학생/상담 리포트, AI 분석, print | ai/report-analysis, consultations, archive fetch | 학부모 문장 |
| `apmath/js/qr-omr.js` | QR/OMR | OMR 세션 생성/제출, archive fetch | exam-sessions | 제출 완료 |
| `apmath/js/cumulative.js` | 월간 출결/성적 | 출결 월간, school exam records | attendance-month, school-exam-records | 성적/출결 |
| `apmath/js/study-material-wrong.js` | 교재 오답 | material OMR/manage/review | material-* | 일반 OMR 정책 혼선 |
| `apmath/js/wangji-foundation.js` | foundation helper | branch/time/conflict helper | 확인 필요 | 공통 helper |

## 2. 학생/외부 접점

| 파일 | 역할 | 호출 API | 저장소/보안 |
|---|---|---|---|
| `apmath/student/index.html` | 학생 포털 | `student-portal/auth`, `student-portal/home`, `student-portal/exams`, `student-portal/omr-submit`, `homework-photo/cancel`, `material-omr/*` | `localStorage`/`sessionStorage`에 session, PLANNER_SID/PIN |
| `apmath/planner/index.html` | 학생 플래너 | `planner-auth`, `planner`, `planner/{id}` | `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}`, `planner_pin_{sid}` |
| `apmath/homework/index.html` | 숙제 사진 제출 | 확인 필요, `homework-photo` 계열 | 학생 링크/PIN 확인 필요 |
| `check/check.js` | OMR check | `check-init`, `check-pin`, `exam-sessions/new` | pending localStorage |
| `archive/engine.html` | archive 출제/배정 | `class-exam-assignments`, `exam-blueprints` | 외부 worker URL 직접 fetch |
| `archive/mixed_engine.html` | mixed engine | `class-exam-assignments`, `exam-blueprints` | MIXED 처리 보존 |

## 3. UI 문구 변경 금지

반 화면, 학생 포털, OMR, 플래너, 시간표, 리포트, 수납 foundation 화면은 기존 문구를 임의 변경하지 않는다. 특히 `숙제`, `OMR`, `제출 완료`, `중등부`, `고등부`, `전체 보기`, `내 반 보기` 같은 현장 용어는 보존한다.

