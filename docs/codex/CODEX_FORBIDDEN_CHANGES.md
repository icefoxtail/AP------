# CODEX_FORBIDDEN_CHANGES

## 공통

- 사용자 지시 없는 코드/UI/DB/route 수정
- 기존 dirty 파일 되돌리기
- 기존 UI 문구/버튼명/화면명 변경
- hidden foundation UI 노출
- `git add`, `git commit`, `git push`, deploy

## 도메인별

| 도메인 | 금지 |
|---|---|
| Student Portal/OMR | 시험지 직접 열기, 제출 완료 수정/재제출 |
| Timetable | draft 작업으로 운영 class row 훼손 |
| Billing | 실결제, 실발송, 자동청구 |
| Parent Contact | 동의 없는 발송, 개인정보/public 노출 |
| Classroom | 선생님 화면에 admin/foundation 기본 노출 |
| Report AI | 내부 시스템 표현 학부모 문장 노출 |
| Staff/Audit | 감사/개인정보 로그 기본 노출 |

