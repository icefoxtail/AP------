# AP Math 수납·청구 시스템 완성 — Claude Code 실행 지시서 (루프 엔지니어링)

작성일: 2026-07-14  
대상 실행자: Claude Code  
상위 기준: `apmath/plan/AP_MATH_ACADEMY_OPERATIONS_MASTER_PLAN.md` Phase 3  
현재 구현 결과: `CODEX_RESULT_APMATH_BILLING_HARDENING_20260713.md`

---

## 0. Claude Code 시작 명령

새 세션에서는 아래 문장을 그대로 실행 지시로 사용한다.

```text
docs/plans/APMATH_BILLING_COMPLETION_LOOP_DIRECTIVE_20260714.md를 끝까지 읽어라.
git status와 기존 변경을 먼저 확인하고 사용자 변경을 보존하라.
docs/codex/CLAUDE_RESULT_APMATH_BILLING_COMPLETION_20260714.md가 있으면 읽고,
아직 PASS로 기록되지 않은 가장 앞 LOOP 하나만 수행하라.
해당 LOOP의 테스트와 공통 회귀가 모두 초록이 될 때까지 구현↔검증을 반복하라.
운영 D1, 배포, git add/commit/push는 하지 마라.
완료 후 결과 문서에 변경 파일, 금액 불변식 검증 결과, 테스트 결과, 잔여 위험,
NEXT_LOOP을 기록하고 멈춰라.
```

여러 루프를 연속 실행시키려면 마지막 문장을 `PASS한 뒤 다음 LOOP도 같은 방식으로 계속하라`로 바꾼다. 단, 아래 중단 조건이 발생하면 연속 실행을 중단한다.

---

## 1. 목표와 완료 정의

### 1.1 목표

현재의 안전한 수납·환불 기록 기반을 다음 월간 업무가 실제로 끝나는 내부 수납 원장으로 완성한다.

```text
수강료 규칙
→ 월 청구 미리보기
→ 청구 확정
→ 할인·교재비·특강비 조정
→ 납부·부분 납부
→ 미납 관리
→ 환불·이월
→ 일마감·월마감
→ 영수증·교육비 납입증명
→ 원장·집계·학생 360 대조
```

### 1.2 최종 Definition of Done

- 표본 학생 최소 10명으로 한 달치 `청구 → 조정 → 수납 → 부분납부 → 미납 → 환불/이월 → 마감`을 완주한다.
- 학생별 잔액 합계와 전체 `청구액·수납액·환불액·이월액·미수금`의 차이가 모두 0원이다.
- 동일 청구 발행/수납/환불 요청을 두 번 보내도 금액 행이 중복되지 않는다.
- 마감된 기간의 금액 거래는 일반 API로 생성·수정·취소되지 않는다.
- 수납 담당자·환불 승인자·마감 담당자의 서버 권한이 분리된다.
- 운영 D1 적용 전 로컬 D1에서 신규 설치와 기존 DB 업그레이드 시나리오가 모두 통과한다.
- 기존 AP Math 시험·OMR·오답·리포트 및 EIE 기능에 회귀가 없다.
- 운영 배포는 본 계획의 완료로 간주하지 않는다. 별도 승인과 전환 체크리스트가 필요하다.

---

## 2. 현재 기준선

### 2.1 이미 구현되어 보존할 것

- `payment_transactions` 멱등키와 완료 거래 불변성
- 청구 연결 수납의 잔액 초과 및 동시성 방어
- 환불 가능 금액, 학생·청구·원수납 관계 검증
- 수납/환불과 자동 장부/감사 로그의 D1 배치 처리
- 취소 사유·시각 및 연결 장부 동시 취소
- 실제 완료 수납일 기준 `paid_date` 계산
- 자동 생성 장부 직접 수정 차단

### 2.2 확인된 미완성 영역

- `billing-templates`, `payments`, `payment-items`, `billing-adjustments`, `billing-runs`가 대부분 조회 전용이다.
- 월 청구 확정과 일괄 생성 API가 없다.
- 학생·청구 ID를 관리 화면에서 직접 입력한다.
- 이월 기록이 청구 정산에 반영되지 않는다.
- 일·월 집계 테이블은 조회만 있고 생성/마감 흐름이 없다.
- 마감 잠금, 역할별 금액 권한, 증빙 출력, 대사 기능이 없다.
- 관리 화면에 현재 구현과 맞지 않는 과거 안내 문구가 남아 있다.

### 2.3 핵심 파일

- Worker route: `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- 정산 helper: `apmath/worker-backup/worker/helpers/billing-settlement.js`
- Worker entry: `apmath/worker-backup/worker/index.js`
- D1 기준 schema: `apmath/worker-backup/worker/schema.sql`
- D1 migrations: `apmath/worker-backup/worker/migrations/`
- 관리 UI: `apmath/js/management.js`
- 기존 회귀: `tests/apmath-billing-transaction-hardening.test.js`

---

## 3. 절대 규칙

### 3.1 금액 불변식

모든 루프에서 아래 계산을 코드와 테스트가 같은 의미로 사용해야 한다.

```text
청구금액 = max(0, 청구항목 합계 + 활성 조정금액 합계)

완료 유입 = payment + partial_payment + carryover_in
완료 유출 = completed refund + carryover_out
유효수납 = clamp(완료 유입 - 완료 유출, 0, 청구금액)
미수금   = max(청구금액 - 유효수납, 0)

status:
  청구금액 > 0, 유효수납 = 0        → unpaid
  0 < 유효수납 < 청구금액           → partial
  청구금액 > 0, 유효수납 >= 청구금액 → paid
  청구금액 = 0                       → unpaid 또는 별도 void 정책
```

조정금액 부호는 다음으로 고정한다.

- 추가 청구·교재비·특강비: 양수
- 할인·장학·감면·청구 차감: 음수
- 완료 청구의 조정은 원행 수정이 아니라 취소/반대 조정 행으로 남긴다.

### 3.2 원장 불변식

- 완료 금액 행은 삭제하거나 덮어쓰지 않는다. 취소/반대 행과 감사 로그로 정정한다.
- `payments.paid_amount/status/paid_date`는 파생값이다. 거래·환불·이월과 분리해서 임의 수정하지 않는다.
- 프론트 계산값을 신뢰하지 않는다. 금액, 학생, 청구, 지점, 권한, 마감 여부를 Worker에서 재검증한다.
- 복수 테이블에 영향을 주는 금액 작업은 한 D1 `batch()` 안에서 끝낸다.
- 청구 발행, 수납, 환불, 이월에는 각각 서버 멱등키와 DB unique guard가 있어야 한다.
- 외부 거래가 들어오면 `(external_provider, external_transaction_id)` 중복도 DB에서 방어한다.
- 정적 문자열 검사만으로 금액 로직 완료를 선언하지 않는다. 실제 SQL 또는 동작형 mock D1 테스트가 필요하다.

### 3.3 작업·Git·배포 규칙

- 시작 시 `git status --short`와 대상 파일 diff를 확인한다.
- 기존 dirty worktree와 사용자 변경을 보존한다. 관련 없는 파일을 수정하거나 되돌리지 않는다.
- `git reset --hard`, `git checkout --`, 대량 포맷 변경을 금지한다.
- 사용자 지시 없이 `git add`, `git commit`, `git push`, PR 생성, Pages/Worker 배포를 하지 않는다.
- `wrangler ... --remote`, 운영 D1 쓰기, 운영 데이터 수정, 실제 문자/알림톡/PG 호출을 금지한다.
- 마이그레이션은 새 파일로 추가한다. 이미 운영 가능한 과거 마이그레이션을 다시 쓰지 않는다.
- 스키마 변경 시 `schema.sql`의 신규 설치 기준과 migration의 업그레이드 기준을 함께 맞춘다.
- 한 LOOP의 회귀가 빨간 상태에서 다음 LOOP로 넘어가지 않는다.

### 3.4 범위 밖

- 온라인 PG 결제와 웹훅
- 실제 카드단말기/VAN 자동 연동
- 실제 현금영수증 국세청 연동
- 실제 알림톡/SMS 발송
- 급여·세무신고·복식부기 ERP
- 다사업자 범용 SaaS 구조

외부 연동 필드는 준비할 수 있지만 실제 활성화는 내부 원장과 대사 흐름 완료 후 별도 계획으로 진행한다.

---

## 4. 공통 루프 실행 규약

```text
LOOP 1회 =
  1) 계획서와 누적 결과 문서 읽기
  2) git status/diff 및 현재 schema/route/test 탐색
  3) 해당 LOOP의 실패 테스트를 먼저 추가하거나 재현
  4) 허용 파일 안에서 최소 구현
  5) LOOP 전용 테스트 실행
  6) 실패 원인 수정 후 4↔5 반복
  7) 공통 회귀와 문법 검사 실행
  8) DoD와 금액 대조 확인
  9) 결과 문서 갱신 후 NEXT_LOOP 기록
```

동일 원인의 실패를 세 번 수정해도 해결되지 않으면 우회 구현하지 않는다. 결과 문서에 재현 명령, 오류, 시도한 내용, 필요한 사용자 결정 또는 외부 조건을 기록하고 중단한다.

### 공통 검증 명령

```powershell
node tests/apmath-billing-transaction-hardening.test.js
node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js
node --check apmath/worker-backup/worker/helpers/billing-settlement.js
node --check apmath/worker-backup/worker/index.js
node --check apmath/js/management.js
node tests/apmath-global-surface.test.js
Get-ChildItem tests -Filter 'eie-management-*.test.js' | ForEach-Object { node $_.FullName; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
git diff --check
```

변경 파일과 관계없는 기존 실패가 있으면 먼저 같은 명령을 변경 전 기준에서 재현하고 결과 문서에 `baseline failure`로 분리한다. 결제 변경 때문에 새로 생긴 실패를 기존 실패로 처리하면 안 된다.

---

## LOOP 0 — 기준선·금액 모델·운영 결정 고정

예상 상한: 1~2일  
목표: 구현 전에 데이터 관계와 금액 규칙을 실행 가능한 테스트 계약으로 고정한다.

### 반드시 읽을 파일

- 이 계획서
- `apmath/plan/AP_MATH_ACADEMY_OPERATIONS_MASTER_PLAN.md`의 축 3, Phase 3
- `CODEX_RESULT_APMATH_BILLING_HARDENING_20260713.md`
- 핵심 파일 전부
- `docs/domains/BILLING_ACCOUNTING_DOMAIN.md`
- `docs/implemented/CURRENT_DB_MAP.md`

### 작업

1. 테이블 관계, 상태값, 금액 필드, 현재 API를 실제 코드 기준으로 목록화한다.
2. `payment/payment_items/adjustments/transactions/refunds/carryovers/cashbook`의 소유권과 파생값을 확정한다.
3. 다음 운영 결정을 `docs/plans/APMATH_BILLING_DECISIONS.md`에 표로 만든다.
   - 월 청구 기준일과 납부기한
   - 휴원·중도등록·중도퇴원 일할 계산 여부
   - 형제/장기/장학 할인 우선순위
   - 교재비·특강비 과세/증빙 분류
   - 0원 청구 처리
   - 선수금·이월 허용 사유
   - 환불 승인 권한
   - 마감일과 재오픈 승인자
4. 운영 결정이 없는 항목은 기능을 자동 활성화하지 않도록 `미결정/기본 비활성`으로 기록한다.
5. 금액 불변식 순수 함수 테스트와 SQL 정산 동작 테스트의 골격을 추가한다.
6. 기존 테스트가 정규식 존재 검사에만 의존하는 부분은 동작형 테스트로 교체할 계획을 결과 문서에 기록한다.

### 허용 파일

- `docs/plans/APMATH_BILLING_DECISIONS.md` 신규
- `tests/apmath-billing-model.test.js` 신규
- 필요 시 `apmath/worker-backup/worker/helpers/billing-settlement.js`
- 결과 문서

### DoD

- [ ] 금액 불변식의 정상·부분납부·전액환불·부분환불·이월 유입·이월 유출 케이스가 테스트로 고정됨
- [ ] 운영 결정표에 담당자/상태/기본 비활성 여부가 있음
- [ ] 기존 데이터에서 상태값·NULL·고아 참조를 찾는 읽기 전용 감사 SQL이 있음
- [ ] 공통 회귀 초록

### 중단 조건

기존 운영 데이터가 문서의 금액식과 다르게 계산되면 다음 LOOP로 가지 않는다. 차이 행과 총 차액을 먼저 기록한다.

---

## LOOP 1 — 청구 규칙과 결정론적 미리보기

예상 상한: 3~4일  
목표: 같은 입력은 항상 같은 청구 초안을 만들고, 미리보기는 DB 금액 원장을 변경하지 않는다.

### 작업

1. 활성 수강, 수강료 템플릿, 부가비용, 조정 정책을 입력으로 받는 순수 청구 계산기를 helper로 분리한다.
2. 학생별 미리보기 결과에 다음을 포함한다.
   - 학생/수강/반/지점
   - 기본 수강료 항목
   - 교재비·특강비 등 부가 항목
   - 적용 예정 할인/감면
   - 항목합계, 조정합계, 최종 청구액
   - 제외 또는 계산 불가 사유
3. 계산 기준 스냅샷 또는 규칙 버전을 미리보기 결과에 포함한다.
4. `billing-templates`와 정책 규칙의 생성·수정·비활성화 API를 구현하되 사용 중인 과거 규칙은 삭제하지 않는다.
5. 미리보기 API 호출 전후 금액 테이블 행 수와 합계가 같음을 테스트한다.

### 대상 파일

- `apmath/worker-backup/worker/helpers/billing-calculation.js` 신규
- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- `apmath/worker-backup/worker/schema.sql` 및 신규 migration(필요한 경우)
- `tests/apmath-billing-preview.test.js` 신규
- 결과 문서

### 필수 테스트

- 같은 입력을 두 번 계산하면 deep equal
- 중도등록·휴원·규칙 없음·0원·음수 조정 경계
- 미리보기 전후 `payments/payment_items/adjustments` 변화 0건
- 지점과 수강반이 다른 학생에게 규칙 누출 없음

### DoD

- [ ] 학생 10명 fixture의 예상 청구액과 계산 결과 차이 0원
- [ ] 미리보기가 쓰기를 하지 않음
- [ ] 규칙 버전과 적용 근거를 화면/API에서 추적 가능
- [ ] 공통 회귀 초록

---

## LOOP 2 — 월 청구 확정·일괄 생성·중복 방지

예상 상한: 4~5일  
목표: 승인된 미리보기를 `billing_runs → payments → payment_items → adjustments`로 원자적으로 확정한다.

### 작업

1. `billing_runs`에 최소 `scope_key`, `rule_snapshot_json`, `idempotency_key`, `confirmed_at`, `confirmed_by`, `cancelled_at`, `cancel_reason`을 설계한다.
2. DB 방어를 추가한다.
   - 청구 실행 멱등키 unique
   - `(billing_run_id, student_id)` unique
   - 같은 연월/범위의 활성 청구 실행 중복 방지
3. 확정 API는 클라이언트 합계를 신뢰하지 않고 서버에서 미리보기를 다시 계산한다.
4. 학생별 청구와 항목을 D1 batch 크기에 맞게 생성한다.
5. 부분 실패 시 재실행 가능한 체크포인트를 두고, 이미 생성된 학생을 중복 생성하지 않는다.
6. 확정 후 실행 건수와 금액 합계를 DB에서 다시 계산해 `billing_runs`에 저장한다.
7. 확정된 청구의 금액 항목은 직접 수정하지 않고 조정 루프를 거치게 한다.

### 대상 파일

- Worker route/helper
- `schema.sql`
- 신규 migration
- `tests/apmath-billing-issuance.test.js` 신규
- 결과 문서

### 필수 테스트

- 같은 idempotency key 2회 요청 → 실행 1건, 학생별 청구 1건
- 다른 key로 같은 연월/범위 재발행 → 409
- 중간 batch 실패 후 재시작 → 누락·중복 0건
- 서버 재계산값과 생성된 payment/items 합계 차이 0원
- 두 동시 확정 요청 중 하나만 성공

### DoD

- [ ] 10명 일괄 확정 후 실행 합계와 학생별 합계 차이 0원
- [ ] 재실행·동시 실행 중복 0건
- [ ] 확정 전 draft와 확정 후 confirmed 상태 경계가 서버에서 강제됨
- [ ] 공통 회귀 초록

---

## LOOP 3 — 데스크 실사용 수납·미납 UI

예상 상한: 3~4일  
목표: 운영자가 내부 ID를 몰라도 학생 검색부터 수납 확인까지 완료한다.

### 작업

1. 학생 검색 → 해당 학생의 미납/부분납부 청구 목록 → 청구 선택 흐름을 구현한다.
2. 청구 카드에 연월, 항목, 청구액, 수납액, 환불/이월, 남은 금액, 납부기한을 표시한다.
3. 청구 선택 시 학생·지점·남은 금액을 자동 채우고 임의 불일치 입력을 막는다.
4. 저장 후 전체 모달을 무조건 다시 읽기보다 변경된 청구와 요약을 확실히 갱신한다.
5. 미납 필터를 `기한 전/오늘 마감/연체/부분납부`로 구분한다.
6. 과거 안내 문구와 raw 필드명을 운영자용 한글 문구로 교체한다.
7. 모바일에서도 학생 검색과 저장 버튼이 화면 밖으로 밀리지 않게 한다.

### 대상 파일

- `apmath/js/management.js`
- 필요 시 billing 조회 API
- `tests/apmath-billing-management-ui.test.js` 신규
- `tests/apmath-global-surface.test.js` 기대값 변경이 필요한 경우에만 최소 갱신
- 결과 문서

### 필수 테스트

- 학생 선택 없이 수납 불가
- 청구 선택 후 남은 금액 초과 입력 경고 및 서버 409 처리
- 저장 중 이중 클릭 1건만 생성
- 저장 후 청구 status/paid_amount/remaining 즉시 갱신
- raw `student_id/payment_id` 직접 입력 UI 제거
- 390px 폭에서 주요 제어 접근 가능

### DoD

- [ ] 운영자가 내부 ID 입력 없이 수납 1건 완료
- [ ] 부분납부와 완납 상태가 즉시 정확히 표시됨
- [ ] 오래된 “미연결” 안내 문구 제거
- [ ] 공통 회귀 초록

---

## LOOP 4 — 할인·감면·환불·이월 원장 완결

예상 상한: 4~5일  
목표: 청구 확정 후 금액 변경과 청구 간 금액 이동을 원행 훼손 없이 처리한다.

### 작업

1. `billing_adjustments`에 상태, 멱등키, 취소 사유/시각, 승인자, 감사 로그를 추가한다.
2. 조정 생성/취소 시 `payments.total_amount`와 정산 상태를 같은 batch에서 재계산한다.
3. 완료 청구 항목 직접 수정은 차단하고 조정 행만 허용한다.
4. 이월을 전용 API로 다시 설계한다.
   - 대상 청구와 학생 일치
   - 원청구가 있으면 원청구에서 이동 가능한 금액 검증
   - 대상 청구에는 `carryover_in`, 원청구에는 `carryover_out` 반영
   - 이월 기록, 양쪽 정산, 감사 로그를 한 batch로 처리
   - 취소 시 양쪽 반대 반영
5. 기초 선수금은 일반 이월과 구분하여 `opening_balance` 출처와 이관 승인자를 요구한다.
6. 환불과 이월이 같은 원금에 중복 적용되지 않게 통합 가용액 guard를 둔다.

### 대상 파일

- billing route/helper
- schema와 신규 migration
- 관리 UI
- `tests/apmath-billing-adjustment-carryover.test.js` 신규
- 기존 hardening 테스트
- 결과 문서

### 필수 테스트

- 할인 후 청구액·미수금 감소
- 할인 취소 후 원복
- 추가 청구 후 완납이 부분납부로 복귀
- 이월 시 원청구/대상청구 합계 보존
- 이월 취소 시 양쪽 원복
- 환불+이월 합계가 가용 원금을 넘으면 409
- 동시 이월 요청 하나만 성공

### DoD

- [ ] 조정·환불·이월 후 전체 금액 보존식 차이 0원
- [ ] 완료 원행 직접 수정 경로 0개
- [ ] 고아 이월·학생 불일치·초과 이월 0건
- [ ] 공통 회귀 초록

---

## LOOP 5 — 일마감·월마감·역할별 권한

예상 상한: 4~5일  
목표: 과거 원장을 잠그고 수납·환불·마감 권한을 서버에서 분리한다.

### 작업

1. 기존 teacher/admin 역할 모델을 조사하고 결제 capability를 최소 단위로 매핑한다.
   - billing.read
   - billing.collect
   - billing.adjust
   - billing.refund.request / billing.refund.approve
   - billing.close / billing.reopen
   - billing.audit.read
2. 메뉴 숨김뿐 아니라 모든 금액 API에서 capability를 검사한다.
3. 일마감/월마감 테이블과 상태 흐름 `open → closing → closed → reopened`을 추가한다.
4. 마감 시 청구·수납·환불·이월·장부 합계를 스냅샷하고 불일치면 마감을 거부한다.
5. closed 기간의 생성·수정·취소를 차단한다.
6. 재오픈은 사유, 승인자, 시각, 이전 스냅샷을 남긴다.
7. 한 사람이 수납 입력과 자신의 고액 환불 승인을 동시에 하지 못하도록 최소 승인 규칙을 둔다. 금액 기준은 결정 문서가 승인되기 전 기본 비활성으로 둔다.

### 대상 파일

- auth/permission helper와 billing route
- schema와 신규 migration
- 관리 UI
- `tests/apmath-billing-close-permission.test.js` 신규
- 필요 시 기존 permission 테스트
- 결과 문서

### 필수 테스트

- 수납 권한 사용자는 수납 가능, 환불 승인/마감 불가
- 조회 전용 사용자는 모든 POST/PATCH 403
- closed 월의 수납·환불·조정·이월·장부 변경 전부 423 또는 합의된 오류
- 불일치 금액이 있으면 마감 실패
- 재오픈 사유 누락 실패 및 감사 로그 생성

### DoD

- [ ] UI와 API 권한 행렬 일치
- [ ] closed 기간 우회 변경 경로 0개
- [ ] 마감 스냅샷과 원장 합계 차이 0원
- [ ] 공통 회귀 초록

---

## LOOP 6 — 영수증·교육비 납입증명 내부 출력

예상 상한: 3~4일  
목표: 외부 세무 API 없이 내부 원장 근거의 출력 가능한 증빙을 만든다.

### 선행 조건

- 학원 사업자 표시 정보
- 문서 번호 규칙
- 교육비 납입증명 적용 항목과 제외 항목
- 보호자/학생 표시 범위
- 현재 공식 양식 또는 세무 전문가 확인 필요 여부

법적·세무 요건이 확정되지 않으면 “공식 증명서”로 표시하지 않는다. 내부 납부확인서만 구현하고 결과 문서에 제한을 명시한다.

### 작업

1. 증빙 스냅샷 테이블을 두어 발급 당시 학생명, 항목, 금액, 수납/환불 상태를 보존한다.
2. 문서 번호는 unique하고 재발급 이력을 남긴다.
3. 취소/환불 후 기존 문서를 조용히 덮어쓰지 않고 취소 또는 정정본을 연결한다.
4. 출력 금액은 완료 수납에서 완료 환불·이월 유출과 제외 항목을 반영한다.
5. 브라우저 인쇄/PDF에서 A4 한글 레이아웃을 검증한다.
6. `receipt_sent_at`은 실제 발송 성공 시점 전에는 갱신하지 않는다.

### 대상 파일

- 신규 billing document route/helper
- schema와 신규 migration
- 관리 UI 및 print view
- `tests/apmath-billing-documents.test.js` 신규
- 결과 문서

### 필수 테스트

- 부분납부/환불/재발급/취소 문서 금액
- 문서 번호 중복 방지
- 다른 학생 문서 접근 차단
- 발급 후 원거래 메모 변경에도 스냅샷 유지
- A4 overflow와 빈 필드 처리

### DoD

- [ ] 표본 5건 출력 금액과 원장 차이 0원
- [ ] 재발급·취소·정정 이력 추적 가능
- [ ] 공식성 범위가 화면과 문서에 명확함
- [ ] 공통 회귀 초록

---

## LOOP 7 — 집계·대사·학생 360 연결

예상 상한: 4~5일  
목표: 원장 합계를 운영 화면과 학생 상세에서 같은 숫자로 확인한다.

### 작업

1. 일·월 집계는 원장 SQL을 단일 기준으로 계산하고 summary table에 upsert한다.
2. 마감 스냅샷과 summary를 비교하는 대사 결과를 저장한다.
3. 결제수단별 수납액과 수기 외부거래 ID 중복/누락 목록을 제공한다.
4. 학생 360에 청구·수납·환불·이월·미납 타임라인을 읽기 전용으로 연결한다.
5. 대시보드의 청구액·수납액·환불액·미수금에서 원장 상세로 드릴다운한다.
6. summary 값 자체를 직접 수정하는 API는 만들지 않는다.

### 대상 파일

- billing summary/reconciliation helper와 route
- schema와 신규 migration
- `apmath/js/management.js`
- 학생 상세 관련 기존 파일은 탐색 후 최소 범위만 허용
- `tests/apmath-billing-summary-reconciliation.test.js` 신규
- 학생 상세 회귀 테스트
- 결과 문서

### 필수 테스트

- 원장 SQL, daily summary, monthly summary, dashboard 합계 동일
- 날짜 경계와 지점 필터
- 취소 거래 제외, 환불/이월 유출 포함
- 학생 A가 학생 B 타임라인을 받지 않음
- 중복 외부거래 ID와 미대사 건 표시

### DoD

- [ ] 표본 월 전체 지표 차이 0원
- [ ] 학생별 잔액과 학생 360 표시 차이 0원
- [ ] summary 직접 수정 경로 0개
- [ ] 공통 회귀 초록

---

## LOOP 8 — 로컬 D1 통합 검증·전환 준비

예상 상한: 3~4일  
목표: 배포하지 않고도 신규 설치, 기존 DB 업그레이드, 한 달 업무 사이클을 증명한다.

### 작업

1. workspace 내부 임시 디렉터리에 로컬 D1을 만든다.
2. 신규 설치 시나리오: 최신 `schema.sql` 적용 후 모든 결제 통합 테스트 실행.
3. 업그레이드 시나리오: 사전 schema fixture에 신규 migration을 순서대로 1회 적용.
4. 표본 10명 데이터를 넣고 최종 DoD의 한 달 사이클을 자동화한다.
5. 다음 장애를 주입한다.
   - 청구 확정 중간 실패와 재개
   - 동시 수납
   - 동시 환불/이월
   - 마감 직전 합계 불일치
   - 마감 후 변경 시도
6. 기존 자료 이관 대조 템플릿을 만든다.
   - 학생별 기초 미납
   - 선수금/이월
   - 전체 청구액/수납액/환불액/미수금
7. 검증 후 임시 D1만 안전하게 삭제한다. 운영 D1은 건드리지 않는다.
8. 운영 전환 체크리스트를 작성하되 실행하지 않는다.

### 로컬 명령 예시

실제 database 이름과 migration 순서는 `wrangler.jsonc`와 파일 목록을 확인한 뒤 사용한다.

```powershell
Set-Location apmath/worker-backup/worker
npx wrangler d1 execute ap-math-os --local --persist-to ../../../tmp/apmath-billing-loop-d1 --file ./schema.sql
npm run check
```

`npm run check`의 `wrangler deploy --dry-run`은 실제 배포가 아니어야 한다. 명령이나 설정이 배포를 수행하려는 정황이 있으면 중단한다.

### 산출물

- `tests/apmath-billing-month-cycle.integration.test.js`
- `docs/plans/APMATH_BILLING_MIGRATION_RECONCILIATION_TEMPLATE.md`
- `docs/plans/APMATH_BILLING_OPERATION_CUTOVER_CHECKLIST.md`
- 최종 결과 문서

### DoD

- [ ] 신규 설치와 업그레이드 각각 PASS
- [ ] 10명 한 달 사이클 PASS
- [ ] 학생별·전체 금액 차이 0원
- [ ] 중복 청구·수납·환불·이월 0건
- [ ] 마감 우회 변경 0건
- [ ] 운영 D1/Pages/Worker 변경 0건
- [ ] 임시 검증 데이터 정리 완료

---

## 5. 루프 간 의존성과 승인 게이트

| LOOP | 다음 LOOP 착수 조건 | 사용자 승인 필요 |
|---|---|---|
| 0 | 금액 모델 테스트와 운영 결정표 | 실제 수강료·할인·마감 정책 |
| 1 | 10명 미리보기 차이 0원 | 계산 근거 샘플 승인 |
| 2 | 중복 없는 확정 API | 첫 청구 화면/항목 승인 |
| 3 | 내부 ID 없는 수납 완주 | 데스크 사용성 확인 |
| 4 | 조정·이월 보존식 통과 | 이월/선수금 정책 |
| 5 | 권한·마감 우회 0건 | 역할 매트릭스·재오픈 승인자 |
| 6 | 내부 출력 금액 대조 | 문서 표시정보·공식성 범위 |
| 7 | 원장·집계·학생 360 차이 0원 | KPI/드릴다운 확인 |
| 8 | 전체 통합 PASS | 운영 이관·배포 별도 승인 |

승인되지 않은 정책은 임의로 추정하지 않는다. 데이터 구조와 테스트 fixture까지만 준비하고 실제 자동 적용은 비활성으로 남긴다.

---

## 6. 결과 문서 규격

경로: `docs/codex/CLAUDE_RESULT_APMATH_BILLING_COMPLETION_20260714.md`

각 LOOP 완료 때 아래 형식으로 누적한다.

```markdown
## LOOP N — 제목

- 상태: PASS | BLOCKED | PARTIAL
- 시작/종료 시각:
- 기준 커밋/브랜치:
- 기존 dirty 파일:
- 수정 파일:
- 신규 migration:
- 구현 요약:
- 금액 불변식 검증:
- 실행한 명령과 결과:
- 로컬 D1 검증 여부:
- 회귀 결과:
- 미해결 위험:
- 사용자 결정 필요:
- NEXT_LOOP:
```

테스트를 실행하지 않았으면 `PASS`라고 쓰지 않는다. 정적 코드 존재 검사만 한 경우 `behavior verified`라고 쓰지 않는다. 운영 D1에 적용하지 않았으면 문서 첫머리와 끝에 모두 명시한다.

---

## 7. 최종 운영 전환은 별도 작업

LOOP 8이 PASS해도 다음 작업은 자동 수행하지 않는다.

- 운영 D1 백업
- migration dry-run 결과 검토
- 운영 migration 적용
- Worker 배포
- Pages 배포
- 표본 운영자 계정 권한 확인
- 기존 장부와 병행 운영
- 1일/1주/1개월 금액 대조
- 롤백 또는 보정 분개 결정

운영 전환은 `APMATH_BILLING_OPERATION_CUTOVER_CHECKLIST.md`를 사용자와 확인한 후 별도 승인으로 진행한다.

