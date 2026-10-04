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

- ~~D-01~D-04~~ → **2026-07-14 사용자 승인 완료**: D-01 학생별 기준일 = 등원 시작일에서 자동 도출(별도 설정값 없음, 없는 날짜는 말일 당김), D-02 청구일+1개월, D-03 일할은 케이스별 수동 조정(자동 규칙 없음), D-04 자동 할인 규칙 없음(원장 재량 수동 조정만). LOOP 1 청구 계산기는 등원 시작일에서 기준일을 도출하는 구조로 설계해야 함.
- D-05~D-10은 계속 미결정/기본 비활성.
- 운영 D1 감사 SQL 실행 여부(위 위험 1).

### NEXT_LOOP

**LOOP 1 — 청구 규칙과 결정론적 미리보기** (`helpers/billing-calculation.js` 신규, 미리보기 무쓰기 검증, `tests/apmath-billing-preview.test.js`)

---

## LOOP 1 — 청구 규칙과 결정론적 미리보기

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션, LOOP 0 직후)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: LOOP 0 기록과 동일하게 보존. 이번 루프가 수정한 기존-dirty 파일은 `routes/billing-accounting-foundation.js`(이미 modified 상태였음 — 기존 변경 위에 추가만, 되돌림 없음)뿐.
- 수정 파일:
  - `apmath/worker-backup/worker/helpers/billing-calculation.js` — **신규**, 순수 청구 계산기 (DB 접근 없음)
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — ① `getBillingPreview`를 조회+순수 계산기 위임으로 교체(읽기 전용 유지, 구 응답 표면 `students_count/items_count/total_amount/preview_items` 호환 유지), ② `billing-templates` POST/PATCH/`deactivate` 추가(DELETE 미지원 = 과거 규칙 삭제 금지, 생성·수정·비활성화 감사 로그), ③ 사용처 없어진 `extractPolicyAmount`/`safeJsonParseObject` 제거
  - `tests/apmath-billing-preview.test.js` — **신규**
  - 이 결과 문서
- 신규 migration: **없음** — 기존 스키마(`student_enrollments.start_date/end_date/tuition_amount`, `billing_templates`, `billing_policy_rules`)로 충분. 스키마 변경 없음.

### 구현 요약

1. **승인된 운영 결정 반영** (D-01~D-04, 2026-07-14 승인):
   - `deriveMonthlyBillingDate(start_date, y, m)` — 학생 등원 시작일의 '일'이 매월 청구 기준일. 29~31일은 짧은 달에서 말일로 당김(1/31→2/28→3/31 복귀). 등원 전 달은 null.
   - `computeDueDate(billingDate)` — 청구일 + 1개월(말일 당김, 연 경계 처리).
   - 자동 일할·자동 할인 없음: 미리보기 조정합계는 항상 0, `planned_adjustments: []` (수동 조정은 LOOP 4 흐름).
2. **결정론적 학생별 미리보기** (`calculateBillingPreview`): 같은 입력이면 deep-equal 동일 출력. 학생별로 학생/반/지점, 기본 수강료 항목, 부가 항목(교재비 등), 항목합계·조정합계·최종 청구액(`computeBilledAmount` = LOOP 0 불변식 재사용), 기준일·납부기한, 제외 사유(코드+한글)를 포함.
3. **수강료 결정 우선순위(결정론)**: ① 수강 등록의 학생별 `tuition_amount` → ② 반(class_id) 활성 tuition 템플릿 → ③ 반 미지정 지점 템플릿 → ④ 지점(→all) tuition 정책 규칙. 전부 없으면 `no_tuition_rule`로 제외. 동순위 다중 후보는 id 사전순 + 후보 수를 근거 문자열에 기록.
4. **부가 항목**: 해당 반에 명시적으로 연결된 활성 비-tuition 템플릿만 적용. 지점 공통 비-tuition 템플릿은 자동 적용하지 않음(D-05 미결정 → 기본 비활성).
5. **규칙 버전·스냅샷**: 응답에 `rule_version`(계산기 버전 상수), `snapshot`(입력 소스 건수, 적용된 템플릿 id·정책 rule_key 목록, 적용된 운영 결정 D-01~D-04 명세), 항목별 `basis`(`enrollment:`/`template:`/`policy:` 근거) 포함 — 적용 근거 추적 가능.
6. **규칙 관리 API**: `billing-templates` 생성/수정/비활성화(감사 로그 포함). `policy-rules`는 기존 POST/PATCH/deactivate 존재 확인(중복 구현 안 함). 삭제 API는 어느 쪽에도 없음.

### 금액 불변식 검증

- 10명 fixture 학생별 예상 청구액과 계산 결과 차이 **0원** (계산기 직접 호출과 mock D1 경유 라우트 호출 양쪽): s01 430,000 / s02 410,000 / s03 350,000 / s06 300,000 / s09 0(zero_billed) / s10 780,000(복수 수강 3항목), 합계 2,270,000.
- 미리보기 단계 보존 관계 `청구액 = 항목합계 + 조정합계(0)` 전 학생 성립.
- 미리보기 전후 `payments/payment_items/billing_adjustments` 행 수·합계 변화 **0건** (템플릿 쓰기 API 경유 후에도 금액 테이블 무변화).

### 실행한 명령과 결과

```text
node tests/apmath-billing-preview.test.js                        → PASS (신규: 결정론, D-01/D-02 경계, 중도등록·휴원·시작일없음·규칙없음 제외,
                                                                    0원·음수 clamp, 지점/반 규칙 누출 없음, 무쓰기, 템플릿 CRUD+감사, 403/400/405)
node tests/apmath-billing-model.test.js                          → PASS
node tests/apmath-billing-transaction-hardening.test.js          → PASS
node --check (route / settlement / calculation / index / management) → OK
node tests/apmath-global-surface.test.js                         → PASS
tests/eie-management-*.test.js                                   → PASS
git diff --check                                                 → whitespace 오류 없음
```

- baseline failure: 없음

### 로컬 D1 검증 여부

- node:sqlite in-memory에 전체 schema.sql + hardening migration 적용 후, **mock D1 어댑터로 라우트 핸들러를 실제 호출**해 검증(정적 검사 아님). wrangler 로컬 D1 완주는 LOOP 8. 운영 D1 미접근.

### 미해결 위험

1. 미리보기 응답이 구 표면 대비 크게 확장됨 — 관리 화면은 아직 이 API를 사용하지 않아(management.js에 billing-preview 호출 없음) UI 영향 없음. LOOP 3에서 신규 필드 기준으로 화면 구성.
2. 한 학생의 복수 수강 기준일이 다른 경우 가장 빠른 기준일로 통합 청구 — 수강별 별도 청구가 필요하면 LOOP 2 확정 설계에서 결정 필요.
3. `student_enrollments.start_date`가 비어 있는 기존 수강은 전부 제외 처리됨 — 운영 데이터에서 start_date 공백 비율 확인 필요(감사 SQL로 조회 가능).
4. `policy-rules`/`billing-templates` 쓰기 API에 아직 역할 분리 없음(admin 전체) — LOOP 5 capability에서 세분화.

### 사용자 결정 필요

- LOOP 1→2 승인 게이트(지시서 §5): **계산 근거 샘플 승인** — 미리보기 응답의 학생별 항목·근거(basis)·기준일 표시 방식이 운영 기대와 맞는지 확인.
- 복수 수강 학생의 청구 통합(현행: 가장 빠른 기준일로 1건) vs 수강별 분리, LOOP 2 전에 확정.

### 보강 (2026-07-14, D-11 반영)

- 사용자 결정 **D-11 승인**: 복수 수강은 **수강(반)별로 청구서를 따로 발행** (학생 단위 통합 없음). 결정표에 추가.
- `billing-calculation.js`: 미리보기 출력을 학생 단위 `students`에서 수강 단위 `invoices`로 변경 — 청구서마다 자기 수강의 기준일·납부기한 유지, 항목이 다른 수강과 섞이지 않음을 테스트로 강제. `totals.invoices_count` 추가(fixture: 청구서 7건/학생 6명, 합계는 동일하게 2,270,000원 차이 0원).
- 재검증: preview/model/hardening 테스트, route·helper 문법, eie-management, `git diff --check` 전부 초록.
- **baseline failure (billing과 무관)**: `node tests/apmath-global-surface.test.js`가 D-11 재검증 시점에 실패. 원인은 다른 세션이 작업 중인 `apmath/js/dashboard-admin.js`의 퇴원 리포트 함수 추가(`openWithdrawalReport` 등, 파일 mtime 2026-07-14 18:54 — 본 세션 도중 외부 수정)와 surface fixture 불일치. 본 루프의 변경 파일(billing route/helpers/tests)은 이 테스트의 입력(dashboard-*.js)과 겹치지 않으며, 동일 명령이 본 루프의 dashboard 무관 시점(직전 실행)에는 통과했음. 해당 파일과 fixture는 다른 작업자의 진행 중 변경이므로 수정하지 않음 — 그쪽 작업 완료 시 fixture 갱신 필요.

### NEXT_LOOP

**LOOP 2 — 월 청구 확정·일괄 생성·중복 방지** (`billing_runs` 확장 migration, 확정 API 멱등성·원자성, `tests/apmath-billing-issuance.test.js`) — D-11(수강별 청구) 기준으로 `payments` 1행 = 수강 1건 설계

---

## LOOP 2 — 월 청구 확정·일괄 생성·중복 방지

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션, LOOP 1 직후)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 계속 보존. 이번 루프가 수정한 기존-dirty 파일은 `routes/billing-accounting-foundation.js`뿐(추가 구현만).
- 수정 파일:
  - `apmath/worker-backup/worker/migrations/20260714_wangji_billing_runs_issuance.sql` — **신규 migration**
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — `computeServerBillingPreview` 분리(미리보기·확정이 같은 계산 사용), `billing-runs` POST(확정) 구현, `insertOrIgnoreStatement`/`isUniqueConstraintError`/`buildBillingRunScopeKey` 헬퍼
  - `tests/apmath-billing-issuance.test.js` — **신규**
  - 이 결과 문서
- 신규 migration: `20260714_wangji_billing_runs_issuance.sql`
  - `billing_runs` + `scope_key, rule_snapshot_json, idempotency_key, confirmed_at, confirmed_by, cancelled_at, cancel_reason`
  - unique: `idempotency_key`(partial), `scope_key WHERE cancelled_at IS NULL`(같은 연월/범위 활성 실행 중복 방지)
  - `payments` + `enrollment_id`, unique `(billing_run_id, enrollment_id)`(D-11 수강별 1건 강제)
  - schema.sql은 기존 컨벤션(20260713과 동일: 신규 설치 = schema.sql + migrations 순서 적용)에 따라 미변경

### 구현 요약

1. **확정 API** `POST billing-accounting-foundation/billing-runs`: 멱등키 필수(400), 연월/지점 범위 검증. 서버가 미리보기를 재계산(클라이언트 합계 완전 불신)해 `rule_snapshot_json`에 규칙 버전·스냅샷·제외 목록·청구서 목록을 저장.
2. **draft/confirmed 경계**: draft = billing-preview(무쓰기), confirmed = `billing_runs` 행 생성 시점. 확정된 `payments`/`payment_items`는 PATCH 경로 자체가 없어(405) 직접 수정 불가 — 금액 변경은 LOOP 4 조정 루프로만.
3. **중복 방지 3중 방어**: ① 같은 멱등키 재요청 = 기존 실행 재개(추가 생성 0) ② 다른 키로 같은 범위 = 사전 조회 + `idx_billing_runs_active_scope` unique로 409 ③ 결정론적 PK(`pay_{run}_{enrollment}`) + `INSERT OR IGNORE` + `(billing_run_id, enrollment_id)` unique.
4. **체크포인트 재개**: run 행이 먼저 커밋되고 발행 batch가 뒤따름. 중간 실패 시 같은 멱등키 재요청이 **저장된 스냅샷 기준**으로 미발행 수강만 채움(이후 수강/규칙 변화가 발행분을 바꾸지 않음). 한 청구서(payment+items)는 반드시 같은 batch에 담아 찢어진 청구(항목 누락) 불가.
5. **확정 후 DB 재계산**: `issued_count/total_amount`를 payments에서 다시 SELECT해 저장(스냅샷 합계 불신). 감사 로그(confirm/resume)에 생성·스킵 건수 기록.

### 금액 불변식 검증

- 확정 후 `SUM(payments.total_amount)` = `SUM(payment_items.amount)` = 미리보기 billed_total = **2,270,000원, 차이 0원** (32건 확장 fixture에서는 11,020,000원 동일 확인).
- 부분 실패 상태에서도 발행된 모든 청구의 `total_amount` = 항목 합계(찢어진 청구 0건).
- 수강별 중복 발행 0건(GROUP BY HAVING 검사), 0원 청구 unpaid 유지(D-06), due_date는 수강별 등원일+1개월(D-02/D-11).

### 실행한 명령과 결과

```text
node tests/apmath-billing-issuance.test.js   → PASS (신규: 멱등 2회=실행1건·생성0건, 같은 범위 다른 키 409,
                                                주입 실패 후 재시작 누락·중복 0건, 서버 재계산 합계 차이 0원,
                                                동시 확정 [201,409], 멱등키 범위 재사용 409, payments/items PATCH 405,
                                                멱등키 누락 400)
node tests/apmath-billing-preview.test.js    → PASS
node tests/apmath-billing-model.test.js      → PASS
node tests/apmath-billing-transaction-hardening.test.js → PASS
node --check (route/settlement/calculation/index/management) → OK
node tests/apmath-global-surface.test.js     → PASS (LOOP 1 보강 때의 baseline failure는 해당 작업자의 fixture 갱신으로 해소 확인)
tests/eie-management-*.test.js               → PASS
git diff --check                             → whitespace 오류 없음
```

### 로컬 D1 검증 여부

- node:sqlite in-memory에 schema.sql + 20260713 + 20260714 migration 순서 적용(업그레이드 경로 포함), mock D1의 batch를 D1과 동일한 트랜잭션 의미(전부 반영/전부 롤백)로 구현해 라우트를 실제 호출. 운영 D1 미접근.

### 미해결 위험

1. **run 취소 API 미구현**: `cancelled_at/cancel_reason` 컬럼과 unique 설계는 완료했으나 취소는 수납·환불 연결 검증이 필요해 LOOP 4(조정·원장 완결)에서 함께 구현. 그 전까지 잘못 확정된 실행은 정정 불가 — 확정 전 미리보기 확인 필수.
2. `rule_snapshot_json`에 전체 청구서 목록 저장 — 학생 수백 명 규모에서 수백 KB 수준(D1 TEXT 한도 내). GET billing-runs 응답이 무거워질 수 있어 LOOP 3에서 목록 조회 시 스냅샷 제외 고려.
3. 확정은 항상 전체 범위(연월×지점) — 학생 일부만 골라 확정하는 기능 없음(요구 시 별도 결정 필요).
4. 재개는 스냅샷 기준이므로 확정 후 등원한 학생은 그 실행에 포함되지 않음 — 의도된 동작이나 운영 안내 필요.

### 사용자 결정 필요

- LOOP 2→3 승인 게이트(지시서 §5): **첫 청구 화면/항목 승인** — 확정 응답·청구서 항목 구성(수강료+교재비, 근거 표기)이 운영 기대와 맞는지.

### NEXT_LOOP

**LOOP 3 — 데스크 실사용 수납·미납 UI** (`apmath/js/management.js` 학생 검색→미납 청구 선택→수납, raw ID 입력 제거, `tests/apmath-billing-management-ui.test.js`)

---

## LOOP 3 — 데스크 실사용 수납·미납 UI

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션, LOOP 2 직후)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 계속 보존. 이번 루프가 수정한 기존-dirty 파일은 `apmath/js/management.js`(이미 modified — 수납 UI 영역만 변경)뿐.
- 수정 파일:
  - `apmath/js/management.js` — 수납 데스크 탭 신설 + 수납 거래 탭 재작성
  - `tests/apmath-billing-management-ui.test.js` — **신규** (vm 샌드박스 동작형 + 정적 검증)
  - 이 결과 문서
- 신규 migration: 없음. 서버 API 변경 없음(기존 조회 API의 student_id 필터로 충분).
- `tests/apmath-global-surface.test.js` fixture: **갱신 불필요** (management.js는 surface 대상 아님, 확인함).

### 구현 요약

1. **수납 데스크 탭(기본 탭)**: 학생 이름/학교/반/전화 검색(재원생만, 디바운스) → 학생 선택 시 해당 학생의 청구·항목·환불·이월을 student_id 필터로 조회 → 미납/부분납부 청구 카드 → 카드에서 "이 청구에 수납" 선택 → 수납 폼. **내부 ID 입력 없음.**
2. **청구 카드**: 연월, 항목 이름, 청구액, 수납액, 환불/이월(이월입금 별도 표기), 남은 금액, 납부기한 + 미납 구분 배지(연체/오늘 마감/기한 전)와 상태 배지(미납/부분납부).
3. **자동 채움·불일치 차단**: `payment_id/student_id/branch`는 선택된 청구·학생에서만 채움(폼에 노출·수정 불가). 금액 입력은 남은 금액 초과 시 클라이언트에서 경고·차단, `transaction_type`은 잔액 대비 자동(부분/완납).
4. **저장 후 갱신**: 전체 모달 refetch 대신 ① 해당 학생 청구 4종 재조회 ② 요약·최근 거래만 재조회. 서버 `PAYMENT_OVER_ALLOCATED`/`PAYMENT_CONCURRENT_CONFLICT` 응답은 서버 메시지를 그대로 표시하고 잔액을 재조회.
5. **미납 필터**: 전체 미납/기한 전/오늘 마감/연체/부분납부 — 순수 함수 `billingCollectDueBucket`/`billingCollectFilterPayments`로 계산(테스트 대상). 완납·잔액 0원 청구는 목록 제외(건수 안내만).
6. **이중 클릭 방지**: 기존 `withBillingAccountingSaveGuard`를 청구 단위 키(`collect:{payment_id}`)로 사용 + `clientRequestId` 멱등키(서버 unique와 이중 방어).
7. **raw 입력·낡은 문구 제거**: 수납 거래 탭의 raw `student_id/payment_id` 생성 폼 전체 삭제 → 최근 거래 확인·메모 수정(prompt, 서버가 금액 수정 거부)·취소 전용으로 재작성, 학생 이름·한글 라벨(수납/부분수납/카드/완료 등) 표시. "실제 수납 등록…연결하지 않습니다" 문구를 현행 동작 설명으로 교체. 모달 제목 '수납·출납 foundation' → '수납·출납 관리'.
8. **모바일(390px)**: 검색 입력 전폭, 필터 칩 flex-wrap, 수납 저장 버튼은 sticky 하단 바(`position:sticky; bottom:0`)로 화면 밖 밀림 방지, 입력 최소 높이 44px.

### 금액 불변식 검증

- 프론트는 금액을 계산하지 않고 표시만 한다: 남은 금액 = `max(total_amount - paid_amount, 0)`(파생값 그대로), 수납 한도는 서버 가드(`PAYMENT_OVER_ALLOCATED`)가 최종 방어. 저장 후 잔액은 서버 재조회 값으로만 갱신(vm 테스트에서 paid 100,000→300,000/paid 상태 즉시 반영 확인).

### 실행한 명령과 결과

```text
node tests/apmath-billing-management-ui.test.js  → PASS (신규: vm 샌드박스에서 실제 함수 실행 —
    학생 미선택/청구 미선택 저장 차단, 재원생만 검색, 남은 금액 초과 클라이언트 경고(POST 0건),
    정상 저장 payload의 payment/student/branch 자동 결정 + clientRequestId, 저장 후 재조회·상태 즉시 갱신,
    서버 409/400 메시지 표시 + 잔액 재조회, 이중 클릭 POST 1건, 카드 렌더에 연월·항목·기한 표시,
    화면 raw 필드명 0건 / 정적 — raw 입력 제거·낡은 문구 제거·필터 4종·sticky 저장 바)
node tests/apmath-billing-issuance.test.js       → PASS
node tests/apmath-billing-preview.test.js        → PASS
node tests/apmath-billing-model.test.js          → PASS
node tests/apmath-billing-transaction-hardening.test.js → PASS
node --check (route/settlement/calculation/index/management) → OK
node tests/apmath-global-surface.test.js         → PASS
tests/eie-management-*.test.js                   → PASS
git diff --check                                 → whitespace 오류 없음 (LF/CRLF 경고만)
```

- baseline failure: 없음

### 로컬 D1 검증 여부

- 이번 루프는 프론트 전용 — vm 샌드박스에 management.js 전체를 로드하고 api/document/toast를 stub해 동작 검증. 서버 가드는 LOOP 2까지의 mock D1 테스트가 커버. 운영 D1 미접근.
- **실 브라우저 검증 미수행**: 이 화면은 로그인 + 라이브 워커 API가 필요해 배포 금지 규칙상 세션 내 확인 불가. 스테이징/배포 후 데스크에서 수납 1건 실검증 필요(운영 전환 체크리스트 항목).

### 미해결 위험

1. **환불/이월 탭은 여전히 raw ID 입력** — LOOP 4(환불·이월 재설계)에서 수납 데스크와 같은 선택형 UI로 교체 예정. 이번 루프의 raw 입력 제거는 수납 흐름 완료.
2. `billingAccountingTransactionTypeOptions`가 미사용 상태로 남음(기존 hardening 테스트가 소스 패턴을 고정하고 있어 유지). hardening 테스트를 동작형으로 교체할 때 함께 정리.
3. 학생 검색은 `state.db.students`(대시보드 로드 데이터) 기준 — 대시보드 미로드 상태로 모달만 열리는 경로가 생기면 검색이 비게 됨(현 구조상 모달은 대시보드 내에서만 열림).
4. 수납 거래 탭 목록은 최근 20건 고정 — 기간/학생 필터는 LOOP 7 드릴다운에서 확장.

### 사용자 결정 필요

- LOOP 3→4 승인 게이트(지시서 §5): **데스크 사용성 확인** — 배포 가능 시점에 실제 화면에서 학생 검색→수납 1건 흐름 확인. (배포는 별도 승인)

### NEXT_LOOP

**LOOP 4 — 할인·감면·환불·이월 원장 완결** (`billing_adjustments` 상태·멱등키 migration, 조정/이월 전용 API 재설계, carryover_out 정산 반영(LOOP 0 KNOWN GAP 해소), 통합 가용액 guard, `tests/apmath-billing-adjustment-carryover.test.js`)

---

## LOOP 4 — 할인·감면·환불·이월 원장 완결

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션, LOOP 3 직후)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 계속 보존. 수정한 기존-dirty 파일은 route와 management.js뿐(추가 구현만).
- 수정 파일:
  - `apmath/worker-backup/worker/migrations/20260714_wangji_billing_adjustment_carryover_ledger.sql` — **신규 migration**
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — 정산 SQL·환불 가용액·조정 API·이월 API 재설계
  - `apmath/js/management.js` — 데스크 조정 흐름, 이월 취소 사유, 이월 폼 유형/승인자
  - `tests/apmath-billing-adjustment-carryover.test.js` — **신규**
  - `tests/apmath-billing-model.test.js` — B-7 KNOWN GAP을 계약 기대값(partial/100000)으로 교체, drift 감사 쿼리에 carryover_out 반영
  - `docs/plans/APMATH_BILLING_DECISIONS.md` §3 격차 해소 기록
  - 이 결과 문서
- 신규 migration: `billing_adjustments` + status/idempotency_key(unique partial)/cancelled_at/cancel_reason/approved_by/updated_at, `carryover_records` + idempotency_key(unique)/cancelled_at/cancel_reason/approved_by, `payment_transactions.carryover_record_id`(이월 거래↔기록 연결)

### 구현 요약

1. **carryover_out 정산 차감 (LOOP 0 KNOWN GAP 해소)**: `buildPaymentSettlementUpdateQuery`가 완료 유출 = 완료 환불 + carryover_out으로 계산. 유효수납/미수금/상태가 §3.1 계약과 일치.
2. **조정 원장**: `billing-adjustments` POST — 부호 계약 강제(discount/scholarship/waiver/reduction/deduction=음수, charge/extra/textbook/special_lecture/fee/penalty=양수, 그 외 400), 사유 필수, 멱등키 unique. 같은 batch에서 [조건부 조정 삽입 → `total_amount`±금액 → 정산 재계산 → 감사 로그]. **청구금액 0원 미만이 되는 조정은 409로 거부**(delta 방식이 legacy 항목-없는 청구도 안전하게 유지). 원행 수정은 `ADJUSTMENT_READONLY` 400, 취소만 허용(사유 필수, 취소 시 반대 반영+정산 원복, 되돌리면 음수가 되는 취소도 409).
3. **이월 전용 API 재설계**: POST가 한 batch에서 [가용액·수용액 조건부 이월 기록 → carryover_out 거래(원청구) → carryover_in 거래(대상) → 양쪽 정산 → 감사 로그]. 학생 일치(원청구·대상청구 모두), 사유 필수, 멱등키. 취소는 기록+양쪽 거래를 함께 cancelled 처리하고 양쪽 재정산(취소 마커로 원자성). 이월 거래를 수납 취소 API로 한쪽만 취소하는 우회는 `USE_CARRYOVER_CANCEL_FLOW` 400.
4. **통합 가용액 guard**: 원청구 가용액 = 완료 유입 − 완료 환불 − 기존 carryover_out. 환불 POST의 사전 계산과 동시성 guard SQL에도 carryover_out 차감 추가 → **환불+이월이 같은 원금을 중복 소진 불가**. 대상 청구는 남은 금액 초과 유입 차단. 이월 취소는 대상에서 유입분이 이미 환불·재이월로 소진됐으면 409.
5. **기초 선수금(opening_balance)**: 원청구 없이 대상 청구로만, 이관 승인자(approved_by)와 사유 필수. 일반 이월(credit)은 원청구 필수.
6. **UI 최소 보강**: 수납 데스크 청구 카드에 "할인/추가 조정" 흐름(금액 부호로 유형 자동, 사유 필수, 저장 가드+멱등키)과 활성 조정 목록·취소 버튼. 이월 취소에 사유 prompt, 이월 폼에 유형 select(일반/기초 선수금)+승인자 입력, 사유 필수.

### 금액 불변식 검증

- 할인 −50,000 → 청구액 200,000→150,000, 미수금 동일 감소. 취소 → 200,000 원복 (차이 0원).
- 추가 청구 +50,000 → 완납(300,000/300,000)이 partial(300,000/350,000)로, 취소 → paid 원복.
- 이월 150,000 → 원청구 유효수납 300,000→150,000, 대상 +150,000, **양쪽 합 300,000 보존**. 취소 → 양쪽 원복(300,000/0).
- 가용 150,000에서 환불 100,000 후: 이월 60,000 → 409, 환불 60,000 → 400(가용 50,000 반환), 잔여 50,000 이월 → 성공, 원청구 유효수납 0.
- 동시 이월 200,000×2(가용 300,000) → 정확히 1건 성공, carryover_out 합계 200,000.

### 실행한 명령과 결과

```text
node tests/apmath-billing-adjustment-carryover.test.js → PASS (신규: 위 시나리오 전부 + 부호/유형/사유/멱등/승인자 검증,
                                                          원행 수정 400, 우회 취소 400, 취소 conflict 409, 감사 로그 create/cancel)
node tests/apmath-billing-model.test.js               → PASS (B-7 계약 기대값으로 교체 후)
node tests/apmath-billing-issuance.test.js            → PASS
node tests/apmath-billing-preview.test.js             → PASS
node tests/apmath-billing-management-ui.test.js       → PASS
node tests/apmath-billing-transaction-hardening.test.js → PASS
node --check (route/settlement/calculation/index/management) → OK
node tests/apmath-global-surface.test.js              → PASS
tests/eie-management-*.test.js                        → PASS
git diff --check                                      → whitespace 오류 없음
```

- baseline failure: 없음

### 로컬 D1 검증 여부

- node:sqlite in-memory에 schema.sql + 20260713 + 20260714(issuance) + 20260714(adjustment/carryover) migration 순서 적용. mock D1의 run/batch가 D1과 동일하게 `meta.changes`를 반환하고 batch는 트랜잭션(전부/전무)으로 동작 — 조건부 INSERT/UPDATE의 changes=0 → 409 경로를 실제로 검증. 운영 D1 미접근.

### 미해결 위험

1. 환불/이월 탭의 raw payment_id 입력은 유지(학생 select는 미적용) — 서버가 학생·청구 일치와 가용액을 전부 재검증하므로 금액 안전성은 확보. 선택형 UI 전환은 LOOP 7 학생 360 연결 시 함께.
2. 조정 취소 시 `total_amount`가 음수가 되는 조합(양수 조정 취소 전에 음수 조정이 잔액을 소진한 경우)은 409로 차단 — 운영자는 음수 조정을 먼저 취소해야 함(오류 메시지에 안내).
3. `paid_date`는 완납 시 최종 수납일 기준 — carryover_in만으로 완납되면 이월 거래일이 paid_date가 됨(이월 유형도 credit 거래로 집계됨). LOOP 7 집계에서 결제수단 'other'로 표시되는 점 확인 필요.
4. 기존 carryover_records 레거시 행(구 API로 생성, 거래 미연결)은 정산에 반영되지 않음 — LOOP 8 이관 대조 템플릿에서 처리 방침 결정 필요.

### 사용자 결정 필요

- ~~LOOP 4→5 승인 게이트: 이월/선수금 정책(D-07)~~ → **2026-07-14 사용자 승인**: 이월 사유 제한 없음(학부모 사정별 허용), 사유 텍스트 필수 + 감사 기록 방식 유지. 구현 변경 불필요(현행 구현과 일치). LOOP 5 착수 가능.

### NEXT_LOOP

**LOOP 5 — 일마감·월마감·역할별 권한** (billing capability 매핑, 마감 테이블·상태 흐름, closed 기간 차단, `tests/apmath-billing-close-permission.test.js`)

---

## LOOP 5 — 일마감·월마감·역할별 권한

- 상태: **PASS**
- 시작/종료 시각: 2026-07-14 (단일 세션, LOOP 4 직후. D-07 사용자 승인 후 착수)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 계속 보존. 수정한 기존-dirty 파일은 route와 management.js뿐(추가 구현만).
- 수정 파일:
  - `apmath/worker-backup/worker/migrations/20260714_wangji_billing_period_closings.sql` — **신규 migration** (`billing_period_closings`)
  - `apmath/worker-backup/worker/helpers/billing-permissions.js` — **신규**, capability 매핑·조회
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — 권한 게이트 교체, closings API, 모든 금액 쓰기 경로 423 차단, 자기승인 차단 규칙
  - `apmath/js/management.js` — 마감 탭(마감 실행·재오픈 사유 prompt·이력)
  - `tests/apmath-billing-close-permission.test.js` — **신규**
  - `docs/plans/APMATH_BILLING_DECISIONS.md` — D-08/D-09 기본 동작, §3 격차 해소
  - 이 결과 문서
- 신규 migration: `billing_period_closings` (period_type/period_key/branch unique, status closed↔reopened, snapshot_json, 마감·재오픈 이력)

### 구현 요약

1. **역할별 capability** (`billing-permissions.js`): `billing.read / collect / adjust / refund.request(예약) / refund.approve / close / reopen / audit.read`. admin은 전체 보유, teacher는 기존 `staff_permissions.permission_key`로 부여(신규 테이블 불필요). **메뉴 숨김이 아니라 라우트 진입점에서 sub+method+action → 필요 capability를 계산해 검사**(403 `BILLING_FORBIDDEN` + 필요한 권한 명시). 결제수단·정책·템플릿 등 설정 변경은 admin 전용 유지. 매핑: 수납=collect, 조정·이월·장부=adjust, 환불=refund.approve, 마감·청구확정=close, 재오픈=reopen, 감사로그=audit.read, 조회=read.
2. **일마감/월마감**: `POST closings {period_type: day|month, period_key}` — 상태 흐름 open(행 없음)→closed→reopened→(재마감)closed. 마감 시 원장 스냅샷 저장: 완료 수납/이월입출/환불 합계 + 자동 장부 합계 + (월마감 시) 청구액·건수. **원장↔자동 장부 대사가 어긋나면 409 `CLOSING_MISMATCH`(불일치 내역 포함)로 마감 거부.**
3. **closed 기간 차단(423)**: 수납 생성·취소(거래일), 환불 생성·취소(환불일), 조정 생성·취소(청구 연월), 이월 생성·취소(이월 거래일), 수기 장부 생성·수정·취소(기입일, 날짜 변경 시 새 날짜도), 청구 확정(연월) — 전부 `BILLING_PERIOD_CLOSED` 423. **admin도 우회 불가**(재오픈 필요). 일마감은 해당 일, 월마감은 해당 월 전체를 잠근다.
4. **재오픈**: 사유 필수(400), `billing.reopen` capability 필요, 승인자·시각·사유 기록, 이전 스냅샷은 감사 로그 before로 보존. 재마감 시 새 스냅샷. 감사 로그 close→reopen→reclose 체인 검증.
5. **최소 승인 규칙(기본 비활성)**: 정책 규칙 `refund_self_approval_limit`({amount})이 활성일 때만, 본인이 입력한 수납을 한도 이상 금액으로 본인이 환불 승인하는 것을 403으로 차단. 금액 기준은 D-08 승인 전 규칙 미등록=비활성.
6. **UI**: '마감' 탭 — 월/일 선택 + 기간 입력 + 마감 실행(확인 confirm), 마감 이력 카드(마감자/시각, 재오픈 사유), 재오픈 버튼(사유 prompt).

### 금액 불변식 검증

- 마감 스냅샷 = 원장 재계산: collected 150,000 = 자동 장부 수입 150,000, 월 청구액 300,000 일치 시에만 closed.
- 장부를 5,000원 훼손하면 마감 409 + 불일치(원장 100,000 vs 장부 95,000) 보고, 마감 행 0건.
- 재오픈→정정 수납 20,000→재마감 시 새 스냅샷 170,000.

### 실행한 명령과 결과

```text
node tests/apmath-billing-close-permission.test.js → PASS (신규: capability 매핑 고정, 수납 담당=수납만(환불·마감·조정 403),
                                                     환불 승인자=환불만, 조회 전용=GET 200/모든 POST·PATCH 10종 403, 무권한=조회도 403,
                                                     admin 포함 closed 월의 수납·취소·환불·조정·이월·장부·청구확정 7종 423,
                                                     범위 밖(8월) 정상, 이미 마감 409, 불일치 마감 409+마감 행 0,
                                                     재오픈 권한 403/사유 누락 400/감사 로그 close→reopen→reclose,
                                                     자기승인 규칙 비활성 시 허용·활성 시 한도 이상 403·미만 허용·타 승인자 허용)
결제 테스트 5종(model/preview/issuance/adjustment-carryover/management-ui) → PASS
hardening / --check 6파일 / global-surface / eie-management / git diff --check → 전부 PASS
```

- baseline failure: 없음

### 로컬 D1 검증 여부

- node:sqlite in-memory에 schema.sql + migration 4개 전체 순서 적용(업그레이드 경로), mock D1(meta.changes + 트랜잭션 batch)로 라우트 실제 호출. 운영 D1 미접근.

### 미해결 위험

1. **비-admin 접근 확대**: 기존에는 admin 전용이던 조회가 `billing.read` 부여 시 teacher에게 열림 — staff_permissions에 billing.* 키를 부여하기 전까지는 기존과 동일(teacher 전부 403). 권한 부여 UI는 없음(D1 수기 또는 추후 화면) — 운영 전환 체크리스트 항목.
2. 마감 대사는 자동 장부(source_type 기반)와만 비교 — hardening(20260713) 이전에 만들어진 legacy 수납은 자동 장부가 없어 해당 기간 마감이 항상 불일치로 거부됨. LOOP 8 이관 대조에서 legacy 기간 처리 방침 필요(예: 기초 이월로 정리 후 마감).
3. 조정의 마감 판정은 청구 연월 기준(일마감과는 무관) — 일마감만 한 날에도 그 달 청구의 조정은 가능(의도된 설계: 조정은 월 단위 스냅샷 보호).
4. `staff_permissions.branch`는 미사용(전 지점 공통 권한) — 지점별 권한 분리가 필요해지면 후속.

### 사용자 결정 필요

- D-08 금액 기준 승인선: `refund_self_approval_limit` 규칙(예: {"amount":100000})을 등록할지, 계속 비활성으로 둘지.
- D-09 마감 주기(일마감을 매일 할지, 월마감만 할지)와 재오픈 승인자(누구에게 billing.reopen을 줄지).
- LOOP 5→6 승인 게이트: 역할 매트릭스 확인(현재 capability 매핑이 운영 역할과 맞는지).

### NEXT_LOOP

**LOOP 6 — 영수증·교육비 납입증명 내부 출력** (선행: 사업자 표시 정보·문서 번호 규칙(D-10) — 미결정이면 "내부 납부확인서"만 구현, 증빙 스냅샷 테이블, `tests/apmath-billing-documents.test.js`)

---

## LOOP 6 — 영수증·교육비 납입증명 내부 출력

- 상태: **PASS** (D-10 미결정에 따라 지시서 선행 조건 규칙 적용: "공식 증명서" 미표기, **내부 납부확인서만** 구현)
- 시작/종료 시각: 2026-07-15 (같은 세션, LOOP 5 직후)
- 기준 커밋/브랜치: `aaf22390` / `main`
- 기존 dirty 파일: 계속 보존. 수정한 기존-dirty 파일은 route·management.js·billing-permissions.js뿐(추가 구현만).
- 수정 파일:
  - `apmath/worker-backup/worker/migrations/20260715_wangji_billing_documents.sql` — **신규 migration** (`billing_documents`)
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — `documents` 발급/재발급/취소/조회 API
  - `apmath/worker-backup/worker/helpers/billing-permissions.js` — documents = billing.collect 매핑
  - `apmath/js/management.js` — 데스크 카드 "납부확인서" 버튼 + A4 인쇄 렌더러(`billingDocumentPrintHtml`, 순수 함수) + 인쇄 창
  - `tests/apmath-billing-documents.test.js` — **신규**
  - 이 결과 문서
- 신규 migration: `billing_documents` (document_no unique, snapshot_json, status issued|superseded|cancelled, replaces_document_id, 발급·취소 이력)

### 구현 요약

1. **증빙 스냅샷**: 발급 시 학생명·청구 연월·항목·활성 조정·완료 수납/환불 내역·청구액·유효수납·미수금·발급자를 `snapshot_json`으로 동결. 출력 금액은 발급 시점 원장에서 재계산(완료 수납 − 완료 환불 − 이월 유출, 청구액 한도) — `payments.paid_amount`(파생값)와의 일치를 테스트로 대조.
2. **문서 번호**: 내부 임시 규칙 `INT-YYYYMMDD-####` + DB unique 인덱스. 동시 발급 충돌 시 재시도(최대 5회)로 서로 다른 번호 보장. D-10 확정 시 규칙만 교체하면 됨(주석 명시).
3. **정정 이력**: 재발급은 `replaces_document_id`로 원본을 `superseded` 연결(조용한 덮어쓰기 없음), 취소는 사유 필수 + 스냅샷 보존. 발급 문서의 일반 수정은 `DOCUMENT_READONLY` 400. 감사 로그 issue/reissue/cancel 체인.
4. **접근 차단**: 발급 요청의 student_id가 청구 학생과 다르면 400, 학생 필터 조회는 해당 학생 문서만. capability: 발급·취소 = `billing.collect`(조회 전용 403), 조회 = `billing.read`.
5. **공식성 범위**: 문서 상단·하단에 "내부 확인용 문서 — 공식 증명서(교육비 납입증명 등)가 아닙니다" 명시(테스트로 강제).
6. **`receipt_sent_at` 규칙**: 발급≠발송 — 발급 코드는 `payments.receipt_sent_at`을 건드리지 않음(테스트로 검증). 실제 발송은 Phase 4.
7. **A4 인쇄**: `@page size A4 + margin 18mm`, 한글 폰트 스택, `table-layout:fixed + word-break`(overflow 방지), 빈 필드 '-' 처리, 깨진 스냅샷에도 렌더러 생존. 데스크에서 버튼 1번 → 발급 + 인쇄 창.

### 금액 불변식 검증

- 표본 5건 출력 금액 = 원장 차이 **0원**: 완납 300,000 / 부분납부 100,000 / 환불 반영 200,000 / 이월 유출 반영 150,000 / 미수납 0원 — 각각 문서 금액 = 원장 재계산 = `paid_amount`.
- 발급 후 원거래 메모 변경 → 스냅샷 바이트 단위 불변. 취소 후에도 스냅샷 보존.

### 실행한 명령과 결과

```text
node tests/apmath-billing-documents.test.js → PASS (신규: 표본 5건 원장 대조 0원, 문서 번호 형식·unique·동시 발급 상이,
                                               학생 불일치 400·타 학생 문서 미노출·조회전용 발급 403, 메모 변경에도 스냅샷 유지,
                                               재발급 superseded 연결·수정 금지 400·취소 사유 필수·중복 취소 400·감사 체인,
                                               receipt_sent_at 미갱신, A4 렌더러: 내부 확인용 표기·A4·word-break·빈 필드 '-'·
                                               undefined/null 노출 0·깨진 스냅샷 생존)
결제 테스트 7종 전부 PASS, --check 6파일 OK, global-surface·eie-management·git diff --check PASS
```

- baseline failure: 없음

### 로컬 D1 검증 여부

- node:sqlite in-memory에 schema.sql + migration 5개 전체 순서 적용, mock D1로 라우트 실제 호출. A4 레이아웃은 렌더러 정적·동작 검증(실 브라우저 인쇄 확인은 배포 후 체크리스트 항목). 운영 D1 미접근.

### 미해결 위험

1. **실 브라우저 인쇄 미검증**: A4 규칙은 코드로 강제했으나 실제 Chrome 인쇄 미리보기 확인은 배포 가능 시점에 필요(운영 전환 체크리스트).
2. 문서 번호 규칙이 임시(INT-) — D-10 확정 시 교체. 기존 발급분 번호는 유지(불변).
3. 교육비 납입증명(연간 합산·과세 분류)은 미구현 — D-05(교재비 분류)·D-10 승인 후 별도 문서 유형으로 추가.
4. 문서 목록/재발급 UI 없음(데스크 발급 버튼만) — 문서 이력 화면은 LOOP 7 드릴다운과 함께.

### 사용자 결정 필요

- LOOP 6→7 승인 게이트: **문서 표시정보·공식성 범위(D-10)** — 사업자 등록 정보(학원명·사업자번호·대표자)를 문서에 넣을지, 넣는다면 값 확정. 공식 교육비 납입증명이 필요하면 세무 요건 확인 필요.

### NEXT_LOOP

**LOOP 7 — 집계·대사·학생 360 연결** (일·월 summary upsert, 마감 스냅샷 대사, 학생 360 타임라인 읽기 전용, 대시보드 드릴다운, `tests/apmath-billing-summary-reconciliation.test.js`)

---

## LOOP 7 — 집계·대사·학생 360 연결

- 상태: **PASS**
- 시작/종료 시각: 2026-07-15
- 기준 커밋/브랜치: `aaf22390` / `main`
- 수정 파일:
  - `apmath/worker-backup/worker/migrations/20260715_wangji_billing_reconciliations.sql` — **신규 migration** (`billing_reconciliations`)
  - `apmath/worker-backup/worker/routes/billing-accounting-foundation.js` — `computeLedgerPeriodTotals`(원장 SQL 단일 기준), daily/monthly-summaries POST(재계산 upsert), `reconciliations` GET/POST, `reconciliation-exceptions` GET, `student-timeline` GET
  - `apmath/worker-backup/worker/helpers/billing-permissions.js` — summary 재계산·대사 = billing.close
  - `apmath/js/management.js` — 대시보드 카드 드릴다운(클릭→원장 탭), 집계 재계산 버튼, 데스크 학생 타임라인 토글(읽기 전용)
  - `tests/apmath-billing-summary-reconciliation.test.js` — **신규**
  - 이 결과 문서
- 신규 migration: `billing_reconciliations` (대사 결과 저장: ledger/summary/snapshot/diff JSON)

### 구현 요약

1. **집계 단일 기준**: 일·월 summary는 `computeLedgerPeriodTotals`(원장 SQL) 결과로만 `ON CONFLICT upsert`. **클라이언트가 보낸 금액 값은 완전히 무시**(테스트: total_paid 999,999,999 보내도 원장 값 저장). PATCH는 405 — summary 직접 수정 경로 0개. 청구액·미수금·할인은 월 개념으로 월 집계에만 채움.
2. **대사**: `POST reconciliations` — 마감된 기간만 가능. 마감 스냅샷 ↔ 원장 재계산 ↔ summary 3자 비교(수납/환불/이월 in·out/청구/미수금), diff 목록과 함께 matched/mismatched 저장. summary 훼손(DB 직접 조작 시뮬레이션)을 정확히 탐지.
3. **예외 목록**: `GET reconciliation-exceptions` — 중복 (external_provider, external_transaction_id), 장부 없는 완료 수납, 원거래 없는 자동 장부(각 100건 한도, 실시간).
4. **학생 360 타임라인**: `GET student-timeline?student_id=` — 청구 발행·수납·부분수납·이월 in/out·환불·문서 발급(취소/대체 표시)을 시간순 병합, 미납 요약(건수/합계) 포함. **읽기 전용(GET 외 405)**, 학생 간 격리 테스트로 강제. UI는 수납 데스크의 '타임라인' 토글로 제공 — `student.js`(학생 상세 화면)는 surface fixture·타 세션 작업과의 충돌을 피해 수정하지 않음(타임라인 API는 학생 상세에서 바로 연결 가능).
5. **드릴다운**: 대시보드 요약 카드(청구/수납/환불/이월/입금/출금) 클릭 → 해당 원장 탭으로 이동. '집계 재계산' 버튼은 현재 연월+오늘 일자를 원장 기준으로 upsert.

### 금액 불변식 검증

- 원장 SQL = monthly summary = daily summary 합 = 대시보드(accounting-summary): 수납 190,000 / 환불 10,000 / 청구 500,000 전 경로 동일, 차이 0원.
- 날짜 경계(7/31 포함·8/1 제외), 지점 필터(apmath 100,000 vs 전체 140,000), 취소 거래 제외(30,000), 이월 유출 반영 검증.
- 학생 타임라인 미수금 230,000 = 원장 파생값.

### 실행한 명령과 결과

```text
node tests/apmath-billing-summary-reconciliation.test.js → PASS (신규)
결제 테스트 9종 + hardening + global-surface + eie-management + node --check + git diff --check → 전부 PASS
```

- baseline failure: 없음

### 미해결 위험

1. 학생 상세(student.js) 화면 내 타임라인 버튼은 미배선 — 데스크 타임라인으로 동일 정보 제공, 학생 상세 연결은 별도 최소 작업.
2. summary 자동 갱신 없음(수동 재계산 버튼/API) — 스케줄 자동화는 운영 결정 후.
3. 대시보드 '이월' 카드는 net 유입 기준(getAccountingSummary 기존 로직) — 상세는 이월 탭에서 in/out 구분.

### NEXT_LOOP

**LOOP 8 — 로컬 D1 통합 검증·전환 준비** + (사용자 지시로 선행 실행) 운영 D1 마이그레이션 적용·워커 배포

---

## 운영 반영 기록 — 2026-07-15 (사용자 지시: "밀린 마이그레이션 순서대로 진행하고 워커배포까지")

1. **사전 확인(읽기 전용)**: 운영 D1(ap-math-os)에 결제 마이그레이션 6개 전부 미적용 상태 확인 (billing_audit_logs 등 신규 테이블 0개, idempotency_key 등 신규 컬럼 0개).
2. **백업**: `wrangler d1 export --remote` → 스크래치패드 `ap-math-os-backup-20260715-pre-billing.sql` (적용 직전 시점).
3. **마이그레이션 적용(순서대로, 전부 성공)**:
   - 20260713_wangji_billing_transaction_hardening.sql (13 queries)
   - 20260714_wangji_billing_runs_issuance.sql (12)
   - 20260714_wangji_billing_adjustment_carryover_ledger.sql (15)
   - 20260714_wangji_billing_period_closings.sql (4)
   - 20260715_wangji_billing_documents.sql (5)
   - 20260715_wangji_billing_reconciliations.sql (3)
   - 사후 검증: 신규 컬럼 4종·신규 테이블 4개 존재 확인.
4. **워커 배포**: `wrangler deploy` → ap-math-os-v2612 업로드·배포 성공 (https://ap-math-os-v2612.js-pdf.workers.dev). 스모크: 무인증 billing API 호출 → 401 (정상 게이트).
5. **주의(기존 이슈, 결제와 무관)**: D1BackupWorkflow의 workflow-level `schedules`가 무료 플랜 제한으로 배포 실패 — 워커 본체와 `triggers.crons`는 정상. 로컬 WangjiD1Backup 스케줄러(05:30)가 백업을 담당하므로 실영향 없음. 유료 플랜 전환 또는 wrangler.jsonc의 workflow schedules 제거 검토.
6. **프론트 미배포**: management.js(수납 데스크·마감·타임라인 UI)는 Pages 배포 전 — git commit+push가 필요하며 사용자 지시 대기. 그 전까지 새 API는 라이브지만 새 화면은 미노출.

---
