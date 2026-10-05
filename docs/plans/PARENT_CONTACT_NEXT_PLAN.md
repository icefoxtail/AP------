# PARENT_CONTACT_NEXT_PLAN

## 1. 현재 상태

`parent-foundation` route와 `parent_contacts`, `parent_contact_consents`, `message_logs`가 존재한다. `student.js`에서 연락처/동의/메시지 이력 일부를 다룬다.

## 2. 최종 목표

학부모 연락처, 수신동의, 발송 후보 preview, message log를 출결/수납/공지/리포트/상담 알림별로 분리한다.

## 3. 절대 금지/보류

- 실제 발송 금지
- 수신동의 전체 기본 노출 금지
- 학생/public 경로에 내부 메모 노출 금지

## 4. Phase 구조

1. 연락처 현황 실사
2. 동의 모델 검수
3. preview 전용 UI
4. message log 조회
5. 실제 발송 전 보안 검수

## 5. 작업 후 업데이트 문서

`PARENT_CONTACT_DOMAIN.md`, `CURRENT_UI_EXPOSURE_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`

