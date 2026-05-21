# PARENT_CONTACT_DOMAIN

## A. 정책

- 학부모 연락처, 수신동의, 메시지 로그는 개인정보다.
- 실제 문자/알림톡 발송은 금지한다.
- preview와 send를 분리한다.
- 수신동의 전체 항목은 기본 화면에 펼치지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/student.js`의 parent contact/consent/message history 계열
- route: `routes/parent-foundation.js`
- DB: `parent_contacts`, `parent_contact_consents`, `message_logs`
- UI: 학생 상세에 일부 노출. 메시지/동의 확대 노출은 승인 필요

## C. 데이터/API 흐름

학생 상세에서 parent contacts/consents/messages를 lazy load하고, `parent-foundation` route가 학생별 scope를 확인한 뒤 연락처/동의/message snapshot을 처리한다.

## D. 회귀 위험

- 보호자 전화/동의 정보 과다 노출
- 실제 발송처럼 보이는 버튼 추가
- student/public route에 internal memo 또는 운영자 정보 노출
- consent branch/type 혼선

## E. 추가 계획

연락처 정리, 수신동의, 발송 후보 preview, message_logs를 출결/수납/공지/리포트/상담 알림별로 분리한다. 실제 발송은 별도 승인 후 진행한다.

## F. 작업 후 업데이트 규칙

학부모 연락 변경 시 `CURRENT_UI_EXPOSURE_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`, `PARENT_CONTACT_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

