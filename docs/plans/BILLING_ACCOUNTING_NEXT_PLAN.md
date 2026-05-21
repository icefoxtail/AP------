# BILLING_ACCOUNTING_NEXT_PLAN

## 1. 현재 상태

DB와 route에는 billing/accounting foundation이 존재한다. `management.js`에 foundation modal 계열 함수가 확인된다.

## 2. 최종 목표

청구 preview, 청구 생성, 납부 거래, 출납 장부, 환불, 이월, 할인/감면, 학부모 결제 링크를 안전하게 분리한다.

## 3. 절대 금지/보류

- 실제 결제 연동 금지
- 실제 문자/알림톡 발송 금지
- 자동 청구 실행 금지
- 수납/출납 UI 기본 노출 금지

## 4. Phase 구조

| Phase | 작업 |
|---|---|
| 1 | 금액 모델과 table 관계 확정 |
| 2 | 청구 preview |
| 3 | 청구 생성 |
| 4 | 납부 거래/출납 장부 |
| 5 | 환불/이월/할인 |
| 6 | 학부모 결제 링크 preview |
| 7 | 보안/무결성 검수 |

## 5. 검증 기준

`payments.total_amount`, `paid_amount`, transactions, cashbook, refund/carryover 합계가 문서화된 규칙과 맞아야 한다.

## 6. 작업 후 업데이트 문서

`BILLING_ACCOUNTING_DOMAIN.md`, `CURRENT_DB_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `CURRENT_API_FLOW_MAP.md`

