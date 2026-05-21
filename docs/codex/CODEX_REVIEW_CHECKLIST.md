# CODEX_REVIEW_CHECKLIST

- 실제 파일을 열어 확인했는가?
- 미확인 파일을 미검수로 표시했는가?
- import/export 누락이 없는가?
- JS 변경 시 `node --check`를 실행했는가?
- SQL placeholder와 bind 개수가 맞는가?
- API 응답 구조가 기존 frontend와 맞는가?
- auth/session/teacher/admin/student scope가 보존되는가?
- 기존 UI 문구를 바꾸지 않았는가?
- hidden foundation을 승인 없이 노출하지 않았는가?
- student portal/OMR 금지 정책을 어기지 않았는가?
- billing 금액 무결성이 깨지지 않았는가?
- timetable 운영/staging 분리가 유지되는가?

