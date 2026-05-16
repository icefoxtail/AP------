````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업명
수납·출납 foundation 1단계-E 안정화 보정

## 작업 목적
수납·출납 foundation 1단계-E 작업 후 코드 리뷰에서 확인된 안정성 문제를 보정한다.

이번 작업은 신규 기능 확장이 아니라 안정화 보정이다.

핵심 보정 대상:

1. `normalizeJsonString` JSON 파싱 안정화
2. 환불 합산 기준 정리
3. `total_outstanding` 계산 의도 주석 명확화
4. `COALESCE(branch, 'apmath')` 기존 데이터 호환 의도 주석 명확화
5. 비활성 결제수단/수납 정책 버튼 레이블 `저장` → `활성화` 수정
6. summary 영역의 병렬 조회 실패 허용 보강
7. 모바일에서 summary 3열 고정 그리드가 깨지지 않도록 최소 CSS 보강

이번 작업에서도 수납·출납 foundation 진입점은 계속 숨김 상태로 유지한다.

---

## 반드시 먼저 읽을 문서

작업 전 반드시 아래 문서를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

```text
docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
````

있다면 아래 문서도 함께 읽어라.

```text
docs/WANGJI_OS_ROADMAP.md
docs/WANGJI_OS_STRUCTURE.md
```

---

## 절대 원칙

* 요청받은 안정화 항목만 수정한다.
* 기존 AP Math OS 화면을 깨지 않는다.
* 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어를 임의로 변경하지 않는다.
* 단, 이번 작업에서 명시한 `저장` → `활성화`는 버그성 오표기 수정으로 허용한다.
* “숙제”를 “과제”로 바꾸는 식의 용어 변경 금지.
* 원장/관리자 대시보드에 새 카드, 새 버튼, 새 메뉴를 노출하지 않는다.
* 수납·출납 foundation 진입점은 계속 숨김 상태로 유지한다.
* `showBillingAccountingFoundationEntry = false` 상태를 유지한다.
* 대시보드 또는 관리 메뉴에 수납·출납 버튼을 다시 노출하지 않는다.
* 실제 청구 생성 금지.
* 실제 결제 연동 금지.
* 실제 카드사/카카오페이 연동 금지.
* 실제 알림톡/문자 발송 금지.
* 실제 payments 대량 생성 금지.
* 운영 DB에 테스트 데이터를 생성하는 smoke test 금지.
* 사용자가 명시하지 않았으므로 Worker 배포 금지.
* 사용자가 명시하지 않았으므로 운영 API smoke test 금지.
* 사용자가 명시하지 않았으므로 git add / git commit / git push 금지.
* `git add .` 금지.
* `index.js`에 API 본문을 직접 추가하지 않는다.

---

## 수정 대상 파일

필요한 경우에만 아래 파일을 수정한다.

```text
apmath/worker-backup/worker/routes/billing-accounting-foundation.js
apmath/js/management.js
docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
CODEX_RESULT.md
```

`apmath/js/dashboard.js`는 이번 작업에서 수정하지 않는다.
단, 숨김 상태 확인만 하고 CODEX_RESULT에 기록한다.

---

## 1. backend 안정화: normalizeJsonString

대상 파일:

```text
apmath/worker-backup/worker/routes/billing-accounting-foundation.js
```

현재 문제:

```js
function normalizeJsonString(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'string') {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  }
  return JSON.stringify(value);
}
```

보정 기준:

* 함수 내부에서 JSON.parse / JSON.stringify 예외가 발생해도 Worker 전체가 예기치 않게 500으로 무너지지 않게 한다.
* 호출부에서 try-catch를 이미 하고 있더라도 함수 자체를 안정화한다.
* 잘못된 JSON 문자열은 호출부가 400으로 응답할 수 있도록 명확한 Error를 throw한다.
* 빈 값은 기존처럼 `null`을 반환한다.
* 객체/배열 값도 JSON.stringify 가능 여부를 검증한다.

권장 구현 방향:

```js
function normalizeJsonString(value) {
  if (value === undefined || value === null || value === '') return null;
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed);
    }
    return JSON.stringify(value);
  } catch (e) {
    throw new Error('invalid_json');
  }
}
```

주의:

* 기존 `POST/PATCH billing_policy_rules`의 `value_json must be valid JSON` 400 응답 흐름은 유지한다.
* 응답 문구를 임의로 바꾸지 않는다.

---

## 2. backend 안정화: 환불 합산 기준 정리

대상 함수:

```text
getAccountingSummary
```

현재 문제:

```js
const totalRefunded = toInt(paidRows[0]?.total_refunded, 0) + toInt(refundRows[0]?.total_refunded, 0);
```

문제점:

* `payment_transactions.transaction_type = 'refund'`와 `refund_records`가 같은 환불을 동시에 표현하면 이중 합산될 수 있다.

보정 기준:

* `refund_records`를 환불 기준 원장으로 우선 사용한다.
* `refund_records`에 해당 월 환불 합계가 있으면 그 값을 `total_refunded` 기준으로 사용한다.
* `refund_records`가 0인 경우에만 기존 호환을 위해 `payment_transactions.transaction_type='refund'` 합계를 fallback으로 사용한다.
* 실제 DB에 쓰기 작업은 하지 않는다.
* 계산 기준을 코드 주석으로 남긴다.

권장 구현 방향:

```js
const transactionRefunded = toInt(paidRows[0]?.total_refunded, 0);
const recordedRefunded = toInt(refundRows[0]?.total_refunded, 0);

// refund_records is the canonical refund ledger.
// payment_transactions.transaction_type='refund' is kept as a compatibility fallback
// for older rows that may not yet have a refund_records row.
const totalRefunded = recordedRefunded > 0 ? recordedRefunded : transactionRefunded;
```

주의:

* 기존 응답 필드명 `total_refunded`는 유지한다.
* 새 필드를 무리하게 추가하지 않는다.
* 필요하면 내부 변수만 추가한다.

---

## 3. backend 안정화: total_outstanding 계산 의도 주석

대상:

```js
total_outstanding: Math.max(0, totalBilled - totalPaid + totalRefunded)
```

보정 기준:

* 계산식은 그대로 유지한다.
* 환불 금액을 더하는 이유를 주석으로 명확히 적는다.
* 의도는 “환불 완료 금액은 이미 납부된 금액에서 다시 빠져나간 돈이므로, 미수 계산에서는 다시 청구 잔액으로 돌아온다”는 의미다.
* 주석은 짧고 명확하게 작성한다.
* 응답 구조는 변경하지 않는다.

예시:

```js
// Refunded money leaves the paid balance again, so it increases the remaining outstanding amount.
const totalOutstanding = Math.max(0, totalBilled - totalPaid + totalRefunded);
```

그리고 반환부는 아래처럼 사용한다.

```js
total_outstanding: totalOutstanding,
```

---

## 4. backend 안정화: branch null fallback 주석

대상 함수:

```js
function pushBranchFilter(whereParts, bindings, branch) {
  if (!branch || branch === 'all') return;
  whereParts.push('COALESCE(branch, ?) = ?');
  bindings.push('apmath', branch);
}
```

보정 기준:

* 기존 동작은 유지한다.
* `branch IS NULL`을 AP Math 기존 데이터로 보는 호환 정책임을 주석으로 명확히 적는다.
* SQL을 과하게 바꾸지 않는다.
* 단, 주석 위치는 `pushBranchFilter` 함수 바로 위 또는 함수 내부에 둔다.

예시:

```js
// Legacy AP Math rows may have NULL branch.
// Treat NULL as apmath for filtered accounting reads.
```

---

## 5. frontend 안정화: 비활성 항목 버튼 레이블 수정

대상 파일:

```text
apmath/js/management.js
```

대상 함수:

```text
renderBillingAccountingMethodsTab
renderBillingAccountingPoliciesTab
```

현재 문제:

비활성화된 결제수단/수납 정책의 토글 버튼 레이블이 `저장`으로 표시된다.

현재 형태:

```js
${Number(item.is_active) === 0 ? '저장' : '비활성화'}
```

보정 기준:

* 비활성 상태에서 다시 켜는 버튼은 `활성화`로 표시한다.
* 활성 상태에서 끄는 버튼은 기존처럼 `비활성화`로 유지한다.
* 저장 버튼 자체의 `저장` 문구는 변경하지 않는다.
* toast 문구는 기존 흐름을 크게 바꾸지 않는다.
* 버튼 색상은 기존 스타일 유지.

수정 기준:

```js
${Number(item.is_active) === 0 ? '활성화' : '비활성화'}
```

적용 위치:

* 결제수단 row 버튼
* 수납 정책 row 버튼

---

## 6. frontend 안정화: billingAccountingFetchAll 부분 실패 허용

대상 함수:

```text
billingAccountingFetchAll
```

현재 문제:

`Promise.all` 구조라 하나의 API만 실패해도 전체 조회가 실패한다.

보정 기준:

* `Promise.allSettled`로 변경한다.
* 일부 API가 실패해도 성공한 API 결과는 화면에 반영한다.
* 실패한 API가 있으면 `ui.error`에 간단한 안내를 표시한다.
* 전체가 실패한 경우에도 화면이 깨지지 않고 빈 배열/빈 summary로 유지되게 한다.
* 기존 API 경로는 변경하지 않는다.
* 새 API를 추가하지 않는다.

권장 구현 방향:

1. 요청 목록을 배열로 만든다.

```js
const requests = [
  ['methods', api.get('billing-accounting-foundation/payment-methods?limit=100')],
  ['policies', api.get('billing-accounting-foundation/billing-policy-rules?limit=100')],
  ...
];
```

2. `Promise.allSettled` 결과를 key별로 정리한다.

3. 성공한 것만 반영한다.

예시 구조:

```js
const results = await Promise.allSettled(requests.map(item => item[1]));
const resolved = {};
let failedCount = 0;

results.forEach((result, index) => {
  const key = requests[index][0];
  if (result.status === 'fulfilled') {
    resolved[key] = result.value;
  } else {
    failedCount += 1;
    resolved[key] = null;
  }
});
```

4. 기존 반영 로직은 resolved 기준으로 안전하게 바꾼다.

```js
ui.methods = Array.isArray(resolved.methods?.payment_methods) ? resolved.methods.payment_methods : [];
```

5. 실패가 일부라도 있으면 안내한다.

```js
if (failedCount > 0) {
  ui.error = '일부 수납·출납 foundation 자료를 불러오지 못했습니다.';
}
```

주의:

* 기존 `ui.error = '수납·출납 foundation 조회 중 오류가 발생했습니다.';` 문구는 전체 예외 catch용으로 유지 가능하다.
* `finally`에서 `ui.loading = false`와 `renderBillingAccountingFoundationModal()` 흐름은 유지한다.

---

## 7. frontend 안정화: summary 3열 고정 그리드 최소 보강

대상 함수:

```text
renderBillingAccountingSummaryTab
```

현재 문제:

summary 영역이 3열 고정이라 좁은 화면에서 깨질 수 있다.

보정 기준:

* 큰 UI 재설계 금지.
* 새 CSS 파일 생성 금지.
* 기존 모달 구조 유지.
* inline style만 최소 보강한다.
* 3열 고정 대신 좁은 화면에서도 자연스럽게 줄바꿈되도록 `repeat(auto-fit,minmax(...))` 또는 유사한 형태로 바꾼다.
* 문구 변경 금지.

적용 후보:

현재:

```html
grid-template-columns:repeat(3,minmax(0,1fr));
```

수정:

```html
grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
```

summary group 카드의 경우:

```html
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
```

상단 조회 컨트롤 3개도 가능하면 다음처럼 바꾼다.

```html
grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
```

주의:

* 기존 색상, 문구, 버튼명, 탭명은 변경하지 않는다.

---

## 8. 문서 업데이트

대상 파일:

```text
docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
```

문서에는 이번 안정화 보정 내용을 짧게 반영한다.

반영할 내용:

```text
- 수납·출납 foundation 1단계-E 안정화 보정 완료 또는 진행 내용
- value_json JSON 안정화
- 환불 집계 기준: refund_records 우선, payment_transactions refund는 호환 fallback
- branch NULL은 기존 AP Math 데이터 호환으로 apmath 처리
- summary 조회는 일부 API 실패 시에도 가능한 데이터 표시
- 수납·출납 foundation 진입점은 계속 숨김 유지
- 실제 청구/결제/발송은 계속 금지
```

주의:

* 문서를 과하게 재작성하지 않는다.
* 기존 룰북 원칙은 변경하지 않는다.
* 완료되지 않은 내용을 완료로 쓰지 않는다.

---

## 9. 검증

수정한 JS 파일에 대해 문법 검증을 실행한다.

필수:

```bash
node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js
node --check apmath/js/management.js
```

확인만 할 경우:

```bash
node --check apmath/js/dashboard.js
```

운영 API smoke test는 실행하지 않는다.
Worker 배포도 실행하지 않는다.
git add / commit / push도 실행하지 않는다.

---

## 10. 완료 보고

작업 완료 후 프로젝트 루트에 `CODEX_RESULT.md`를 작성한다.

반드시 아래 형식을 사용한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 수정/생성한 파일 목록

## 2. 구현 완료 또는 확인 완료
- normalizeJsonString 안정화 여부
- 환불 합산 기준 정리 여부
- total_outstanding 계산 주석 추가 여부
- branch NULL fallback 주석 추가 여부
- 결제수단/수납 정책 버튼 레이블 수정 여부
- billingAccountingFetchAll 부분 실패 허용 보강 여부
- summary grid 모바일 대응 보강 여부
- 수납·출납 foundation 진입점 숨김 유지 여부
- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 여부

## 3. 실행 결과
- node --check 실행 결과
- Worker 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## 4. 결과 요약
- 이번 안정화 보정 요약
- 아직 운영 화면에 노출하지 않았다는 점
- 실제 청구/결제/발송을 실행하지 않았다는 점

## 5. 다음 조치
- 사용자가 직접 확인할 항목
- 필요 시 사용자가 직접 Worker 배포
- 필요 시 사용자가 직접 운영 API smoke test
- 필요 시 사용자가 직접 지정 파일만 git add
- 권장 커밋 메시지
```

완료 보고에는 반드시 아래 항목을 포함한다.

```text
- 기존 문구 변경 여부:
- 기존 버튼명 변경 여부:
- 기존 화면명 변경 여부:
- 기존 메뉴명 변경 여부:
- 기존 운영 용어 변경 여부:
- 수납·출납 foundation 진입점 숨김 유지 여부:
- 실제 청구 생성 여부:
- 실제 결제 연동 여부:
- 실제 알림톡/문자 발송 여부:
- 배포 실행 여부:
- 운영 smoke 실행 여부:
- git commit 실행 여부:
- git push 실행 여부:
```

버튼명 변경 여부에는 다음처럼 명확히 적는다.

```text
기존 버튼명 변경 여부: 버그성 오표기 `저장` 2곳을 `활성화`로 수정. 그 외 기존 버튼명 변경 없음.
```

---

## 최종 출력

터미널 마지막 출력은 아래 문장으로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
