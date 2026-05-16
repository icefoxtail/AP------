````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업명
왕지교육 수납·출납 foundation 1단계-A

## 1. 작업 전 필수 기준
작업 전 반드시 아래 문서를 처음부터 끝까지 읽고, 그 원칙을 우선 적용한다.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

특히 아래 원칙을 반드시 지킨다.

- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 금지
- 기능 추가 외 기존 문구 정리 금지
- “숙제”를 “과제”로 바꾸는 것 금지
- 원장/관리자 화면은 이번 작업 범위에 명시된 수납·출납 foundation 범위 안에서만 수정
- 학생 포털/OMR 기능 변경 금지
- 제출 완료 OMR 수정/재입력/재제출 기능 추가 금지
- 새 API 본문을 `index.js`에 직접 추가하지 말 것
- 기존 API 수정은 담당 route 파일에서 할 것
- 사용자가 명시하지 않은 배포 실행 금지
- 사용자가 명시하지 않은 운영 API smoke test 실행 금지
- 사용자가 명시하지 않은 git commit 금지
- 사용자가 명시하지 않은 git push 금지
- `git add .` 금지

## 2. 작업자 기본 실행 범위
이번 작업에서 Codex가 실행할 범위는 아래까지만이다.

허용:
- 지정 파일 수정
- 필요한 새 파일 생성
- 로컬 문법 검증
- `CODEX_RESULT.md` 작성

금지:
- `npx wrangler deploy` 실행 금지
- 운영 API smoke test 실행 금지
- `git commit` 실행 금지
- `git push` 실행 금지
- 운영 데이터 생성/삭제/수납 처리 금지

배포, 운영 smoke, commit, push는 사용자가 직접 실행한다.
필요한 명령은 `CODEX_RESULT.md`의 다음 조치에만 적는다.

## 3. 작업 목표
수납·출납 foundation 1단계-A를 구현한다.

이번 단계의 핵심은 “실제 수납 처리”가 아니라, 이미 만들어진 수납·출납 foundation DB와 route를 기반으로 운영 준비용 조회/설정/preview 흐름을 정리하는 것이다.

목표:

1. 기존 수납·출납 foundation route 상태를 확인한다.
2. 기존 DB 테이블과 route endpoint가 맞는지 확인한다.
3. 결제수단 조회/설정 흐름을 안정화한다.
4. 수납 정책 rule 조회/저장 흐름을 안정화한다.
5. 월별/일별 요약 조회 route가 있으면 응답 구조를 확인하고 부족하면 최소 보강한다.
6. 실제 수납 거래 생성, 환불, 이월, 출납장부 반영은 하지 않는다.
7. 프론트에 이미 수납·출납 foundation UI 진입점이 있다면 해당 API 연결을 확인하고 최소 보강한다.
8. 프론트 UI가 아직 없으면 새 UI를 크게 만들지 말고, backend coverage와 문서 업데이트까지만 수행한다.
9. 작업 후 `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`를 업데이트한다.

## 4. 이번 단계에서 허용하는 범위

### 4-1. 허용 API 범위
기존 route 파일 안에서 아래 계열을 확인/보강한다.

- `/api/billing-accounting-foundation/payment-methods`
- `/api/billing-accounting-foundation/billing-policy-rules`
- `/api/billing-accounting-foundation/payment-transactions`
- `/api/billing-accounting-foundation/cashbook-entries`
- `/api/billing-accounting-foundation/refund-records`
- `/api/billing-accounting-foundation/carryover-records`
- `/api/billing-accounting-foundation/daily-summaries`
- `/api/billing-accounting-foundation/monthly-summaries`
- 현재 route에서 실제 사용하는 endpoint명이 다르면 기존 endpoint명을 우선한다.

### 4-2. 허용 DB 테이블
기존 schema 기준 아래 테이블만 확인/사용한다.

- `payment_methods`
- `payment_transactions`
- `cashbook_entries`
- `refund_records`
- `carryover_records`
- `billing_policy_rules`
- `accounting_daily_summaries`
- `accounting_monthly_summaries`
- 필요 시 기존 `payments`, `payment_items`, `billing_runs`, `billing_templates`는 읽기 확인만 한다.

### 4-3. 허용 구현 수준
- GET 조회
- PATCH/POST 설정 저장
- soft delete 또는 `is_active` 토글
- preview 응답
- summary 조회
- 입력값 validation
- admin 권한 확인
- 기존 route 응답 구조 정리
- docs 업데이트

## 5. 이번 단계에서 금지하는 범위
아래는 절대 하지 않는다.

- 실제 수납 거래 생성 기능 신규 구현 금지
- 실제 결제 완료 처리 금지
- 실제 환불 처리 금지
- 실제 이월 처리 금지
- 실제 cashbook 자동 반영 금지
- 실제 문자/카카오 발송 금지
- 외부 결제사 연동 금지
- DB schema 변경 금지
- migration 추가 금지
- 학생/반/출결/숙제/시험/OMR 기능 변경 금지
- 관리자 대시보드 전체 개편 금지
- 기존 화면명/버튼명/문구 변경 금지
- index.js에 API 본문 추가 금지
- initial-data 구조 변경 금지
- 운영 데이터에 테스트 수납 데이터 생성 금지

## 6. 우선 확인할 파일
프로젝트 루트 기준:

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- `apmath/worker-backup/worker/routes/billing-foundation.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/*`
- `apmath/js/*.js`
- `apmath/index.html`

## 7. 먼저 실행할 확인 명령
프로젝트 루트에서 실행한다.

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------"

git status --short

Get-Content docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md | Select-Object -First 120

node --check apmath\worker-backup\worker\index.js
node --check apmath\worker-backup\worker\routes\billing-accounting-foundation.js
node --check apmath\worker-backup\worker\routes\billing-foundation.js
````

수납·출납 route endpoint를 확인한다.

```powershell
Select-String -Path apmath\worker-backup\worker\routes\billing-accounting-foundation.js -Pattern "payment-methods|payment_transactions|payment-transactions|cashbook|refund|carryover|policy|billing_policy_rules|daily|monthly|method ===|path\[" -CaseSensitive:$false

Select-String -Path apmath\worker-backup\worker\routes\billing-foundation.js -Pattern "billing|payments|payment_items|templates|runs|method ===|path\[" -CaseSensitive:$false
```

프론트 연결 여부를 확인한다.

```powershell
Get-ChildItem apmath -Recurse -Include *.js,*.html | ForEach-Object {
  Select-String -Path $_.FullName -Pattern "billing-accounting-foundation|billing-foundation|payment-methods|payment_transactions|cashbook|refund|carryover|billing_policy_rules|수납|출납|결제|환불|이월" -CaseSensitive:$false -ErrorAction SilentlyContinue
}
```

DB 테이블을 확인한다.

```powershell
Select-String -Path apmath\worker-backup\worker\schema.sql -Pattern "payment_methods|payment_transactions|cashbook_entries|refund_records|carryover_records|billing_policy_rules|accounting_daily_summaries|accounting_monthly_summaries|payments|payment_items|billing_runs|billing_templates" -CaseSensitive:$false
```

## 8. 구현 세부 기준

### 8-1. index.js 위임 확인

`index.js`에는 billing-accounting-foundation 위임만 있어야 한다.

확인할 것:

* `/api/billing-accounting-foundation/*` 요청이 `routes/billing-accounting-foundation.js`로 넘어가는가?
* index.js에 billing-accounting API 본문이 직접 들어 있지 않은가?
* 위임 전에 admin/staff 인증 흐름이 기존 방식대로 유지되는가?
* `teacher is not defined` 위험이 없는가?

index.js는 원칙적으로 수정하지 않는다.
위임 누락 또는 import 누락일 때만 최소 수정한다.

### 8-2. routes/billing-accounting-foundation.js 확인

이 파일에서 아래 endpoint가 있는지 확인한다.

필수 확인 대상:

```text
GET /api/billing-accounting-foundation/payment-methods
GET /api/billing-accounting-foundation/payment-transactions
GET /api/billing-accounting-foundation/cashbook-entries
GET /api/billing-accounting-foundation/refund-records
GET /api/billing-accounting-foundation/carryover-records
GET /api/billing-accounting-foundation/billing-policy-rules
GET /api/billing-accounting-foundation/daily-summaries
GET /api/billing-accounting-foundation/monthly-summaries
```

있으면 응답 구조와 query filter만 확인한다.
없으면 이번 1단계-A 범위에서 필요한 최소 endpoint만 추가한다.

### 8-3. 결제수단 payment_methods

확인/보강할 기능:

* 전체 결제수단 조회
* active만 조회할 수 있는 필터
* sort_order 기준 정렬
* method_key 중복 방지
* name/category/is_active/sort_order/memo 저장 또는 수정
* 삭제가 필요하면 물리 삭제 금지, `is_active = 0` 우선

금지:

* 운영 결제 처리와 연결 금지
* 외부 PG 연동 금지

### 8-4. 수납 정책 billing_policy_rules

확인/보강할 기능:

* 정책 rule 목록 조회
* branch별 조회
* rule_type별 조회
* rule_key 중복/갱신 흐름 확인
* value_json 저장 시 JSON 문자열 안정화
* is_active 토글
* memo 저장

예상 rule_type 예:

* tuition
* discount
* sibling
* late_fee
* refund
* carryover
* payment_due
* message

주의:

* 실제 운영 정책 계산을 완성하려고 하지 않는다.
* 이번 단계는 입력/저장/조회/preview 기반만 만든다.

### 8-5. 거래/장부/환불/이월 조회

확인/보강할 기능:

* payment_transactions 조회
* cashbook_entries 조회
* refund_records 조회
* carryover_records 조회
* student_id, branch, status, date range filter
* 최신순 정렬
* limit 기본값과 최대값 방어

금지:

* 실제 거래 생성 버튼/흐름 신규 구현 금지
* 실제 장부 자동 생성 금지
* 실제 환불 처리 신규 구현 금지
* 실제 이월 처리 신규 구현 금지

### 8-6. summary 조회

확인/보강할 기능:

* accounting_daily_summaries 조회
* accounting_monthly_summaries 조회
* branch filter
* date/year/month filter
* 최신순 정렬

주의:

* summary 생성 계산 로직은 이번 단계에서 새로 만들지 않는다.
* 이미 route에 preview가 있으면 그대로 보존한다.
* 없으면 조회만 구현한다.

### 8-7. 프론트 연결

프론트에 이미 수납·출납 foundation UI가 있으면 확인한다.

확인할 것:

* 호출 API path가 route와 맞는가?
* 기존 화면명/버튼명/문구가 바뀌지 않았는가?
* 없는 UI를 크게 새로 만들고 있지 않은가?

프론트 UI가 없다면:

* 새 화면을 만들지 않는다.
* route coverage와 docs 업데이트만 한다.
* CODEX_RESULT.md에 “프론트 진입점 없음, UI 신규 구현은 별도 승인 필요”라고 적는다.

## 9. 응답 구조 기준

기존 route에서 사용 중인 응답 구조가 있으면 그것을 따른다.

권장 기본 응답:

조회:

```json
{
  "success": true,
  "items": []
}
```

단건 저장/수정:

```json
{
  "success": true,
  "item": {}
}
```

실패:

```json
{
  "success": false,
  "error": "..."
}
```

주의:

* 기존 route가 `results`, `data`, `payment_methods` 같은 다른 key를 쓰고 있으면 기존 구조를 우선한다.
* 프론트가 이미 기대하는 응답 구조가 있으면 프론트 기준을 우선한다.
* 응답 구조 변경은 최소화한다.

## 10. 권한 기준

수납·출납 foundation은 민감 기능이므로 원칙적으로 admin 또는 staff 권한만 허용한다.

확인할 것:

* 기존 route에서 teacher 권한을 어떻게 처리하는가?
* admin만 허용 중이면 그대로 유지한다.
* staff 허용이 이미 있으면 기존 기준을 따른다.
* 일반 teacher에게 수납·출납 설정 변경 권한을 새로 열지 않는다.

권장:

* GET 조회는 기존 정책 유지
* POST/PATCH 변경은 admin만 허용하거나 기존 route 정책 유지
* 권한 정책을 새로 바꾸지 않는다.

## 11. 문서 업데이트

작업 후 `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`를 업데이트한다.

업데이트할 위치:

### 11-1. 3장 Worker 구조 지도

`routes/billing-accounting-foundation.js` 항목을 실제 endpoint 기준으로 보강한다.

반영할 내용:

* payment-methods
* billing-policy-rules
* payment-transactions
* cashbook-entries
* refund-records
* carryover-records
* daily/monthly summaries
* 실제 수납 처리 금지, foundation 조회/설정 단계임을 명시

### 11-2. 4장 프론트 파일별 API 호출 지도

프론트 연결이 있으면 해당 파일과 함수/API를 기록한다.
프론트 연결이 없으면 “프론트 진입점 없음, backend foundation coverage만 존재”라고 기록한다.

### 11-3. 5장 DB 구조 지도

아래 테이블 설명을 현재 route 기준으로 보강한다.

* `payment_methods`
* `payment_transactions`
* `cashbook_entries`
* `refund_records`
* `carryover_records`
* `billing_policy_rules`
* `accounting_daily_summaries`
* `accounting_monthly_summaries`

### 11-4. 8장 다음 작업 큐

완료된 큰 작업에 아래를 추가한다.

```text
- 수납·출납 foundation 1단계-A
```

운영 기능 후보에서 수납·출납 foundation 1단계-A를 제거하거나 “다음 단계-B”로 바꾼다.

## 12. 로컬 검증

수정 후 아래만 실행한다.

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------"

node --check apmath\worker-backup\worker\index.js
node --check apmath\worker-backup\worker\routes\billing-accounting-foundation.js

Get-ChildItem apmath\worker-backup\worker\routes -Filter *.js | ForEach-Object {
  node --check $_.FullName
}
```

프론트 파일을 수정한 경우에만 해당 JS를 확인한다.

예:

```powershell
node --check apmath\js\dashboard.js
node --check apmath\js\classroom.js
```

HTML 안 script를 수정한 경우에는 무리하게 전체 HTML을 node로 검사하지 말고, 수정한 script 블록만 임시 파일로 추출해 검사하거나 수동 검증한다.

## 13. 실행하지 말 것

이번 작업에서 아래는 실행하지 않는다.

```powershell
npx wrangler deploy
```

운영 API smoke test도 실행하지 않는다.
git commit/push도 실행하지 않는다.

대신 `CODEX_RESULT.md`의 다음 조치에 사용자가 직접 실행할 명령만 적는다.

## 14. CODEX_RESULT.md 작성

작업 완료 후 `CODEX_RESULT.md`를 아래 형식으로 작성한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- apmath/worker-backup/worker/routes/billing-accounting-foundation.js
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- CODEX_RESULT.md

## 2. 구현 완료 또는 확인 완료
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 확인 완료
- 수납·출납 foundation 1단계-A 범위 확인 완료
- routes/billing-accounting-foundation.js endpoint coverage 확인 완료
- payment_methods 조회/설정 흐름 확인 또는 보강 완료
- billing_policy_rules 조회/설정 흐름 확인 또는 보강 완료
- payment_transactions 조회 흐름 확인 또는 보강 완료
- cashbook_entries 조회 흐름 확인 또는 보강 완료
- refund_records 조회 흐름 확인 또는 보강 완료
- carryover_records 조회 흐름 확인 또는 보강 완료
- daily/monthly summaries 조회 흐름 확인 또는 보강 완료
- 실제 수납/환불/이월/장부 자동 반영 기능은 구현하지 않음 확인
- index.js에 API 본문 추가 없음 확인
- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 없음 확인
- 학생 포털/OMR 흐름 변경 없음 확인
- 관리자/원장 화면은 이번 수납·출납 foundation 범위 외 변경 없음 확인
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 업데이트 완료

## 3. 실행 결과
- node --check apmath/worker-backup/worker/index.js:
- node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js:
- routes/*.js node --check:
- 프론트 수정 파일 node --check 또는 수동 검증:
- 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상
- git diff --name-only:
- git status --short:

## 4. 결과 요약
- 수납·출납 foundation 1단계-A로 결제수단, 수납 정책, 거래/장부/환불/이월/요약 조회 기반을 정리했다.
- 실제 운영 수납 처리, 환불 처리, 이월 처리, 장부 자동 반영은 이번 단계에서 구현하지 않았다.
- 기존 Worker route 분리 원칙과 UI 문구 보존 원칙을 유지했다.

## 5. 다음 조치
- 사용자가 직접 변경 파일 확인
- 사용자가 직접 필요 시 `npx wrangler deploy`
- 사용자가 직접 필요 시 운영 API smoke test
- 사용자가 직접 지정 파일만 git add
- 사용자가 직접 git commit / git push
- 다음 후보: 수납·출납 foundation 1단계-B 또는 initial-data 분리 여부 분석
```

실제로 수정하지 않은 파일은 생성/수정 파일 목록에서 제외한다.

## 15. 사용자 직접 실행용 참고 명령

작업자는 아래 명령을 실행하지 말고 `CODEX_RESULT.md`에 참고로만 적는다.

배포:

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------\apmath\worker-backup\worker"
npx wrangler deploy
```

기본 인증:

```powershell
$pair = "admin:admin1234"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
$basic = [Convert]::ToBase64String($bytes)
```

사용자 직접 smoke 후보:

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/payment-methods" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/billing-policy-rules" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/payment-transactions" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/cashbook-entries" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

사용자 직접 커밋 후보:

```powershell
cd "C:\Users\USER\RECOVER_WORK\AP------"

git status --short

git add apmath\worker-backup\worker\routes\billing-accounting-foundation.js
git add docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
git add CODEX_RESULT.md

git commit -m "Implement billing accounting foundation stage 1A"
git push
```

## 16. 최종 자체검수

완료 전 반드시 확인한다.

* docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md를 읽었는가?
* 수납·출납 foundation 1단계-A 범위만 작업했는가?
* 실제 수납 거래 생성 기능을 만들지 않았는가?
* 실제 환불 처리 기능을 만들지 않았는가?
* 실제 이월 처리 기능을 만들지 않았는가?
* 실제 장부 자동 반영 기능을 만들지 않았는가?
* 외부 결제사 연동을 만들지 않았는가?
* index.js에 API 본문을 추가하지 않았는가?
* DB schema/migration을 변경하지 않았는가?
* 기존 UI 문구를 바꾸지 않았는가?
* 기존 버튼명을 바꾸지 않았는가?
* 기존 화면명을 바꾸지 않았는가?
* 학생 포털/OMR을 건드리지 않았는가?
* 관리자/원장 화면을 이번 범위 밖에서 건드리지 않았는가?
* node --check가 PASS인가?
* 배포를 실행하지 않았는가?
* 운영 smoke를 실행하지 않았는가?
* git commit/push를 실행하지 않았는가?
* CODEX_RESULT.md가 지정 형식으로 작성되었는가?

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
