# BILLING_ACCOUNTING_DOMAIN

## A. 정책

- 청구와 실제 돈의 흐름을 분리한다.
- `payments`/`payment_items`는 청구서 계열, `payment_transactions`는 실제 납부 거래, `cashbook_entries`는 출납 장부다.
- 실제 결제 연동, 실제 알림톡/SMS 발송, 자동 청구 실행은 금지한다.
- preview와 실제 실행을 분리한다.
- internal memo, external meta, 금액 정보 노출을 주의한다.

## B. 현재 구현 구조

- frontend: `apmath/js/management.js`에 billing accounting foundation modal 계열 함수 확인
- route: `routes/billing-accounting-foundation.js`, `routes/billing-foundation.js`
- DB: `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs`, `payment_methods`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `billing_policy_rules`, accounting summaries
- UI: 제한/확인 필요. 기본 운영 화면 노출은 승인 필요로 취급한다.

## C. 데이터/API 흐름

management UI가 `billing-accounting-foundation/{subresource}`를 호출하고, route가 각 table을 조회/생성/patch/cancel한다. 실제 PG/은행/알림톡 연동은 확인되지 않았다.

## D. 회귀 위험

- 청구 금액과 납부 거래, 출납 장부 합계 불일치
- 취소/환불/이월 상태 처리 오류
- 학부모/public route에 내부 메모 또는 운영자 전용 정보 노출
- 실제 발송/실결제처럼 보이는 UI 노출

## E. 추가 계획

청구 preview, 청구 생성, 납부 거래, 출납 장부, 환불, 이월, 할인/감면, 학부모 결제 링크를 phase로 나누고, 실결제/실발송은 마지막 승인 단계까지 금지한다.

## F. 작업 후 업데이트 규칙

수납 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `BILLING_ACCOUNTING_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

