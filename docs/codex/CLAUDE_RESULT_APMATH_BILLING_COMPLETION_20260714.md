# CLAUDE_RESULT — AP Math 수납·청구 완성 루프 (2026-07-14 시작)

> **운영 D1에는 아무것도 적용하지 않았다. 배포·커밋·푸시 없음.**
> 지시서: `docs/plans/APMATH_BILLING_COMPLETION_LOOP_DIRECTIVE_20260714.md`

---

## LOOP 0 — 기준선·금액 모델·운영 결정 고정

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 세션 시작 시점의 modified 14개 + untracked 13개 (git status 스냅샷 그대로 보존, 이번 루프에서 되돌리거나 재수정하지 않음). 이 중 이번 루프가 건드린 것은 `apmath/worker-backup/worker/helpers/billing-settlement.js`(untracked, 기존 내용 보존 + 신규 export 추가)뿐.
- 수정 파일:
  - `apmath/worker-backup/worker/helpers/billing-settlement.js` — 기존 함수 무변경, 신규 export 추가: `SETTLEMENT_DEBIT_TYPES`, `toSignedSettlementAmount`, `computeBilledAmount`, `computeBillingInvariant` (지시서 §3.1 금액식의 순수 함수 구현)
  - `docs/plans/APMATH_BILLING_DECISIONS.md` — **신규**, 운영 결정표 D-01~D-10 (전부 미결정/기본 비활성) + 고정 기술 규칙 + 알려진 구현 격차
  - `tests/apmath-billing-model.test.js` — **신규**, 아래 3부 구성
  - 이 결과 문서 — **신규**
- 신규 migration: 없음 (스키마 변경 없음)

### 구현 요약

1. **기준선 목록화 (실제 코드 기준)**
   - 테이블: `billing_templates / payments / payment_items / billing_adjustments / billing_runs / payment_methods / payment_transactions / cashbook_entries / refund_records / carryover_records / billing_policy_rules / accounting_daily·monthly_summaries` + hardening migration의 `billing_audit_logs`, `payment_transactions.idempotency_key(unique partial)`, 취소 컬럼, `cashbook_entries.source_type/refund_record_id`
   - API (`routes/billing-accounting-foundation.js`, admin 전용): 조회 전용 = billing-templates, payments, payment-items, billing-adjustments, billing-runs, daily/monthly-summaries, audit-logs, billing-preview, summary / 쓰기 존재 = payment-methods, policy-rules, transactions(POST/PATCH/cancel), cashbook, refunds, carryovers
   - 소유권·파생값 확정: `payments.paid_amount/status/paid_date`는 파생값(정산 SQL `buildPaymentSettlementUpdateQuery`로만 갱신). 유입 = completed `payment/partial_payment/carryover_in`(payment_transactions), 유출 = completed refund(refund_records) — **carryover_out은 현행 미반영(격차)**. cashbook 자동 행은 `source_type`으로 구분되어 직접 수정 차단.
2. **운영 결정표**: `docs/plans/APMATH_BILLING_DECISIONS.md`에 10개 항목(기준일·납부기한·일할·할인 우선순위·교재비 분류·0원 청구·이월 사유·환불 승인·마감/재오픈·문서 표시정보)을 담당자(원장)/상태(미결정)/기본 비활성 동작과 함께 표로 고정.
3. **금액 불변식의 실행 계약**: 지시서 §3.1 산식을 `computeBillingInvariant`로 구현하고 15개 케이스로 고정 — 정상 완납, 부분납부, 전액환불, 부분환불, 이월 유입, 이월 유출, 할인(음수 조정), 추가 청구(양수 조정), 음수 청구 clamp(0원), 0원 청구=unpaid, 초과 유입 clamp+overflow 보고, 유출>유입 하한 0, 비정상 입력, 보존식(청구금액=유효수납+미수금), 기존 `computePaymentSettlement`와의 의미 일치.
4. **SQL 정산 동작 테스트 골격**: node:sqlite(in-memory)에 **전체 `schema.sql` + `20260713_wangji_billing_transaction_hardening.sql`을 순서 적용**(신규 설치+업그레이드 축소 검증)한 뒤, 라우트가 실제 사용하는 `buildPaymentSettlementUpdateQuery`의 SQL을 그대로 실행해 부분납부→완납(paid_date=실수납일 최댓값)→부분환불→전액환불 복귀, cancelled 제외, carryover_in 인정까지 동작 검증. 정적 문자열 검사 아님.
5. **읽기 전용 감사 SQL** (`AUDIT_QUERIES`, 테스트 파일에 정의·실행 검증): 고아 거래/환불/이월/자동장부, 이월 학생 불일치, 잘못된 상태값, NULL·음수 금액, 중복 외부거래 ID, 정산 drift(paid_amount ≠ 재계산값). 깨끗한 DB에서 0행 + 이상 주입 시 각각 탐지됨을 모두 실행으로 확인. 운영 D1에는 조회로만 복사 실행 가능(이번 루프에서는 운영 D1 미접근 — 규칙 준수).

### 금액 불변식 검증

- 보존식 `청구금액 = 유효수납 + 미수금` 4개 조합에서 차이 0원.
- SQL 정산 결과와 순수 함수 기대값 차이 0원 (carryover_out 제외 — 아래 KNOWN GAP).
- **KNOWN GAP(실행 테스트로 명시)**: 정산 SQL이 `carryover_out`을 유출로 차감하지 않음. 테스트 B-7이 현행 동작을 명시적 GAP 마커와 함께 고정 — LOOP 4에서 반영 시 기대값을 계약값(partial/100000)으로 교체해야 함. `payments.total_amount`가 항목+조정 합계로 재계산되지 않는 것도 동일하게 LOOP 4 대상.

### 실행한 명령과 결과

```text
node tests/apmath-billing-model.test.js                          → PASS (신규)
node tests/apmath-billing-transaction-hardening.test.js          → PASS
node --check routes/billing-accounting-foundation.js             → OK
node --check helpers/billing-settlement.js                       → OK
node --check index.js / apmath/js/management.js                  → OK
node tests/apmath-global-surface.test.js                         → PASS
tests/eie-management-*.test.js (1건)                             → PASS
git diff --check                                                 → whitespace 오류 없음 (기존 dirty 파일의 LF/CRLF 경고만, 이번 변경과 무관)
```

- baseline failure: 없음 (공통 회귀 전부 초록)

### 로컬 D1 검증 여부

- wrangler 로컬 D1은 사용하지 않음. 대신 node:sqlite in-memory에 전체 schema.sql + hardening migration을 적용해 정산 SQL을 실행 검증(테스트에 상시 포함). wrangler 기반 신규 설치/업그레이드 완주는 LOOP 8 범위.
- 운영 D1: 미접근 (규칙 준수).

### 회귀 결과

- 전부 초록. 기존 hardening 테스트·global surface·eie-management 무변경 통과.

### 미해결 위험

1. **운영 데이터 대조 미수행**: LOOP 0 중단 조건("기존 운영 데이터가 금액식과 다르게 계산되면 중단")은 운영 D1 접근 금지로 이 세션에서 확인 불가. 사용자가 `tests/apmath-billing-model.test.js`의 `AUDIT_QUERIES`를 운영 D1에 **읽기 전용**으로 실행해 0행인지 확인해야 LOOP 0 중단 조건이 완전히 해소됨. (특히 `settlement_drift`, `duplicate_external_transactions`)
2. carryover_out 미차감, 조정 미반영 → LOOP 4 (결정표 §3에 기록).
3. `node:sqlite`는 Node 22에서 experimental (경고만 출력, 동작 안정). Node 메이저 업그레이드 시 재확인.
4. 기존 `apmath-billing-transaction-hardening.test.js`의 라우트 검증부는 정규식 존재 검사 중심 — **교체 계획**: LOOP 2~4에서 각 쓰기 경로(수납 POST 멱등성·초과 가드·환불 한도·취소 역반영)를 이번에 만든 node:sqlite 골격 위에서 동작형(mock D1 batch)으로 재작성하고, 정적 검사는 보조로 강등한다.

### 사용자 결정 필요

- ~~D-01~D-04~~ → **2026-07-14 사용자 승인 완료**: D-01 학생별 기준일(공통 기준일 없음), D-02 청구일+1개월, D-03 일할은 케이스별 수동 조정(자동 규칙 없음), D-04 자동 할인 규칙 없음(원장 재량 수동 조정만). LOOP 1 청구 계산기는 학생별 `billing_anchor_day` 입력 구조로 설계해야 함.
- D-05~D-10은 계속 미결정/기본 비활성.
- 운영 D1 감사 SQL 실행 여부(위 위험 1).

### NEXT_LOOP

**LOOP 1 — 청구 규칙과 결정론적 미리보기** (`helpers/billing-calculation.js` 신규, 미리보기 무쓰기 검증, `tests/apmath-billing-preview.test.js`)

---

> **운영 D1에는 아무것도 적용하지 않았다. 배포·커밋·푸시 없음.**
