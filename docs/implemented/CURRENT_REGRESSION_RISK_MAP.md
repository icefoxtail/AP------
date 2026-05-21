# CURRENT_REGRESSION_RISK_MAP

| 흐름 | 위험 | 검수 기준 |
|---|---|---|
| 로그인/session/logout | 전체 접근 불가, expired session 처리 실패 | `auth/login`, `teacher_sessions`, Bearer header |
| initial-data | 모든 화면 데이터 로딩 실패 | admin/teacher 응답 key 유지 |
| teacher/admin 권한 | 담당반 scope 누락 | `teacher_classes`, `canAccessStudent`, `canAccessClass` |
| classroom | 출결/숙제/플래너/일지 현장 흐름 깨짐 | PC/mobile, 오늘 날짜, 반별 학생 |
| planner SSO | 학생 포털에서 플래너 진입 실패 | `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}` |
| student portal PIN | 학생 로그인/토큰 실패 | `student_token`, X-Student-Token |
| OMR 제출 완료 | 재수정/재제출 노출 | 일반 시험 OMR과 material-omr 정책 분리 |
| archive MIXED | mixed engine 문항 매핑 실패 | `MIXED:{key}` 보존 |
| report AI | 내부 표현이 학부모 문장에 노출 | fallback/provider 결과 정규화 |
| billing | 금액 합계/거래/장부 불일치 | payments vs transactions vs cashbook 구분 |
| timetable | 운영 데이터와 draft/staging 혼선 | `classes` 직접 훼손 금지, version tables 분리 |
| UI 문구 | 현장 용어 변경 | 기존 버튼/화면명/문구 diff 확인 |
| hidden foundation | 승인 없는 UI 노출 | `CURRENT_HIDDEN_FOUNDATION_MAP.md` 대조 |

