# DIRECTOR_MODE_NEXT_PLAN

## 1. 현재 상태

원장/운영자 기능 후보는 수납, 학생 종합관리, 반이동, 상담, 학부모 연락, 감사 로그, 운영 메모에 흩어져 있다.

## 2. 최종 목표

선생님 현장 화면과 분리된 원장/운영자 화면을 만든다.

## 3. 절대 금지/보류

- 사용자 확인 없는 대시보드 카드/문구 추가 금지
- 원장/admin 기능을 선생님 화면에 섞기 금지
- 실제 청구/발송/결제 진입점 선노출 금지

## 4. Phase 구조

1. 학생 종합관리 허브 정책 확정
2. 수납/반이동/상담/학부모 연락 entry point 설계
3. 타임라인 read-only
4. 권한/감사 로그 검수

## 5. 작업 후 업데이트 문서

`OPERATIONS_CONSULTATION_DOMAIN.md`, `BILLING_ACCOUNTING_DOMAIN.md`, `PARENT_CONTACT_DOMAIN.md`, `CURRENT_UI_EXPOSURE_MAP.md`

