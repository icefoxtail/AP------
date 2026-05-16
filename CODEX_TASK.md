cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업명
수납·출납 foundation blocked key read-only API 보강

## 작업 목적
`docs/INITIAL_DATA_SPLIT_ANALYSIS.md`의 수납·출납 foundation 1차 분리 준비 평가에서 `blocked`로 남은 key들을 initial-data 밖에서도 조회할 수 있도록 read-only API를 보강한다.

이번 작업은 `/api/initial-data` 실제 축소 작업이 아니다.
이번 작업은 initial-data에서 수납·출납 foundation 데이터를 제거하기 전 필요한 replacement API coverage를 채우는 작업이다.

보강 대상 blocked key:

- billing_templates
- payments
- payment_items
- billing_adjustments
- billing_runs

핵심 목표:

- 기존 `/api/initial-data` 응답 구조는 그대로 유지한다.
- `routes/billing-accounting-foundation.js` 안에 위 key들을 대체할 GET 전용 조회 API를 추가한다.
- 기존 route 스타일, admin 권한 차단, 필터 방식, limit 방어 방식을 따른다.
- `management.js`의 수납·출납 foundation lazy loader가 해당 API를 함께 조회할 수 있도록 최소 보강한다.
- `state.db` 구조는 변경하지 않는다.
- 대시보드/관리 메뉴 노출은 계속 금지한다.

## 반드시 먼저 읽을 문서
작업 전 반드시 아래 문서를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/INITIAL_DATA_SPLIT_ANALYSIS.md

있다면 아래 문서도 함께 읽어라.

- docs/WANGJI_OS_ROADMAP.md
- docs/WANGJI_OS_STRUCTURE.md

문서가 없으면 새로 추정해서 만들지 말고, 현재 레포에 존재하는 문서 기준으로만 작업한다.

## 절대 원칙
- 이번 작업은 blocked key read-only API 보강 작업이다.
- `/api/initial-data` 응답 구조를 아직 줄이지 않는다.
- initial-data에서 수납·출납 foundation key를 삭제하지 않는다.
- initial-data SQL query를 삭제하거나 축소하지 않는다.
- `apmath/worker-backup/worker/index.js`는 수정하지 않는다.
- 새 route 파일을 만들지 않는다.
- 기존 `routes/billing-accounting-foundation.js` 안에서만 API coverage를 보강한다.
- POST/PATCH/DELETE 신규 기능은 만들지 않는다.
- 이번 blocked key는 GET read-only 조회만 추가한다.
- 기존 AP Math OS 화면을 깨지 않는다.
- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어를 임의로 변경하지 않는다.
- “숙제”를 “과제”로 바꾸는 식의 용어 변경 금지.
- 원장/관리자 대시보드에 새 카드, 새 버튼, 새 메뉴를 노출하지 않는다.
- 수납·출납 foundation 진입점은 계속 숨김 상태로 유지한다.
- `showBillingAccountingFoundationEntry = false` 상태를 유지한다.
- 대시보드 또는 관리 메뉴에 수납·출납 버튼을 다시 노출하지 않는다.
- 실제 청구 생성 금지.
- 실제 결제 연동 금지.
- 실제 카드사/카카오페이 연동 금지.
- 실제 알림톡/문자 발송 금지.
- 실제 payments 대량 생성 금지.
- 운영 DB에 테스트 데이터를 생성하는 smoke test 금지.
- DB schema 변경 금지.
- migration 추가 금지.
- 사용자가 명시하지 않았으므로 Worker 배포 금지.
- 사용자가 명시하지 않았으므로 운영 API smoke test 금지.
- 사용자가 명시하지 않았으므로 git add / git commit / git push 금지.
- git add . 금지.

## 현재 기준
`docs/INITIAL_DATA_SPLIT_ANALYSIS.md`의 14장 기준:

ready:
- payment_methods
- billing_policy_rules
- accounting_daily_summaries
- accounting_monthly_summaries

almost ready:
- payment_transactions
- cashbook_entries
- refund_records
- carryover_records

blocked:
- billing_templates
- payments
- payment_items
- billing_adjustments
- billing_runs

이번 작업은 blocked 항목만 read-only API coverage를 채우는 것이 목적이다.

## 수정 가능 파일
필요한 경우에만 아래 파일을 수정한다.

- apmath/worker-backup/worker/routes/billing-accounting-foundation.js
- apmath/js/management.js
- docs/INITIAL_DATA_SPLIT_ANALYSIS.md
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- CODEX_RESULT.md

## 수정 금지 파일
아래 파일은 수정하지 않는다.

- apmath/worker-backup/worker/index.js
- apmath/js/core.js
- apmath/js/dashboard.js
- apmath/student/index.html
- apmath/planner/index.html
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/

## 1. route alias 추가 또는 확인
대상 파일:

- apmath/worker-backup/worker/routes/billing-accounting-foundation.js

`normalizeFoundationSub`에서 blocked key API alias를 처리한다.

추가 또는 확인할 alias:

- billing-templates -> billing-templates
- payments -> payments
- payment-items -> payment-items
- billing-adjustments -> billing-adjustments
- billing-runs -> billing-runs

이미 raw sub 그대로 처리 가능하면 별도 alias는 최소화한다.
다만 initial-data key와 URL resource가 헷갈리지 않도록 필요한 경우 아래 alias도 허용한다.

- billing_templates -> billing-templates
- payment_items -> payment-items
- billing_adjustments -> billing-adjustments
- billing_runs -> billing-runs

주의:
- 기존 alias를 삭제하지 않는다.
- 기존 payment-methods, policy-rules, transactions, cashbook, refunds, carryovers, summaries 흐름을 깨지 않는다.

## 2. GET /billing-templates 추가
대상 resource:

- /api/billing-accounting-foundation/billing-templates

GET 전용으로 구현한다.

조회 테이블:

- billing_templates

필터 후보:

- branch
- active 또는 is_active
- template_type
- limit

정렬 후보:

- branch ASC
- template_type ASC
- name ASC
- created_at DESC

응답 예시 형태:

- { success: true, billing_templates: rows }

주의:
- 테이블 컬럼명은 실제 schema.sql 기준으로 확인한다.
- 존재하지 않는 컬럼을 SELECT/WHERE에 넣지 않는다.
- is_active 컬럼이 없으면 active 필터는 적용하지 않는다.
- name/template_type 컬럼이 없으면 실제 컬럼 기준으로 정렬한다.
- schema 확인 없이 추정 SQL 작성 금지.

## 3. GET /payments 추가
대상 resource:

- /api/billing-accounting-foundation/payments

GET 전용으로 구현한다.

조회 테이블:

- payments

필터 후보:

- student_id
- branch
- year
- month
- status
- date_from/date_to 또는 created_at 범위
- limit

응답 예시 형태:

- { success: true, payments: rows }

주의:
- payments에 branch가 직접 없고 payment_items를 통해 branch를 판단해야 하면, 기존 initial-data 쿼리 방식을 참고한다.
- branch 필터가 애매하면 무리하게 잘못된 필터를 만들지 말고 문서에 제한사항을 적는다.
- admin 전용 route이므로 현재 handler 상단 admin 차단을 유지한다.
- 실제 청구 생성은 절대 하지 않는다.

## 4. GET /payment-items 추가
대상 resource:

- /api/billing-accounting-foundation/payment-items

GET 전용으로 구현한다.

조회 테이블:

- payment_items

필터 후보:

- payment_id
- student_id는 직접 컬럼이 없으면 payments join으로만 가능
- branch
- item_type
- limit

응답 예시 형태:

- { success: true, payment_items: rows }

주의:
- payment_items에 student_id가 직접 없으면 payments와 join해야 한다.
- join이 필요하면 기존 payments schema를 확인하고 안전하게 작성한다.
- payment_id 필터는 반드시 지원하는 것을 우선한다.
- 존재하지 않는 컬럼 추정 금지.

## 5. GET /billing-adjustments 추가
대상 resource:

- /api/billing-accounting-foundation/billing-adjustments

GET 전용으로 구현한다.

조회 테이블:

- billing_adjustments

필터 후보:

- payment_id
- student_id는 직접 컬럼이 없으면 payments join으로만 가능
- adjustment_type
- created_at date range
- limit

응답 예시 형태:

- { success: true, billing_adjustments: rows }

주의:
- 실제 조정 생성/수정은 만들지 않는다.
- 조회만 구현한다.
- 컬럼은 schema.sql 기준으로 확인한다.

## 6. GET /billing-runs 추가
대상 resource:

- /api/billing-accounting-foundation/billing-runs

GET 전용으로 구현한다.

조회 테이블:

- billing_runs

필터 후보:

- branch
- year
- month
- status
- limit

응답 예시 형태:

- { success: true, billing_runs: rows }

주의:
- 실행 버튼, 자동 청구 생성, run 생성은 만들지 않는다.
- 조회만 구현한다.

## 7. 공통 필터 helper 재사용
가능하면 기존 helper를 재사용한다.

- parseLimit
- normalizeBranchForAccounting
- pushBranchFilter
- pushDateRangeFilter
- buildWhereClause
- safeAll
- toInt
- normalizeIsoDate

필요하면 read-only 조회용 helper를 작게 추가할 수 있다.

허용 helper 예시:

- hasColumn 관련 동적 introspection은 이번 작업에서 과하면 하지 않는다.
- schema.sql을 기준으로 정적으로 안전한 SQL을 작성한다.
- 단순 query param 정규화 helper는 허용한다.

## 8. management.js lazy loader 보강
대상 파일:

- apmath/js/management.js

현재 `billingAccountingFetchAll()`은 기존 ready/almost ready API를 조회한다.
이번 작업에서 blocked key API가 추가되면 함께 조회하도록 최소 보강한다.

추가 상태 후보:

- ui.billingTemplates
- ui.payments
- ui.paymentItems
- ui.billingAdjustments
- ui.billingRuns

`getBillingAccountingFoundationState()` 기본 상태에 위 배열을 추가한다.

`billingAccountingFetchAll()` 요청 목록에 아래를 추가한다.

- billing-accounting-foundation/billing-templates?limit=100
- billing-accounting-foundation/payments?limit=50
- billing-accounting-foundation/payment-items?limit=100
- billing-accounting-foundation/billing-adjustments?limit=50
- billing-accounting-foundation/billing-runs?limit=50

주의:
- 모달 UI에 새 탭이나 새 버튼을 노출하지 않는다.
- 이번 작업은 lazy loader coverage 확인용 상태 보강이다.
- 데이터를 받아도 화면에 새 섹션을 만들지 않는다.
- 일부 실패 시 기존 allSettled 흐름으로 오류 안내만 표시한다.
- 기존 성공 데이터 유지 흐름을 깨지 않는다.
- state.db에 병합하지 않는다.

## 9. docs/INITIAL_DATA_SPLIT_ANALYSIS.md 업데이트
14장 또는 관련 섹션을 갱신한다.

반영할 내용:

- blocked였던 billing_templates, payments, payment_items, billing_adjustments, billing_runs에 read-only API가 추가되었는지
- replacement API 표의 removal readiness 변경
- management.js lazy loader가 해당 key를 조회할 수 있는지
- 아직 initial-data에서 제거하지 않았다는 점
- 실제 제거 전 남은 검증 항목

readiness 기준:

- API가 있고 management.js lazy loader도 연결되었지만 아직 initial-data 제거 전 수동 검증이 남았으면 almost ready
- API가 있고 사용처가 명확히 모달 내부로 제한되며 제거 전 검증만 남았으면 ready
- API가 부족하거나 join/권한 문제가 남아 있으면 blocked 유지

주의:
- 검증하지 않은 것을 완료로 쓰지 않는다.
- 운영 화면 노출 상태를 바꾸지 않았음을 명시한다.

## 10. docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 업데이트
룰북에 짧게 반영한다.

반영할 내용:

- 수납·출납 foundation blocked key read-only API 보강 진행
- initial-data 실제 축소는 아직 하지 않음
- read-only API와 management.js lazy loader 검증 후 별도 작업에서 initial-data 축소 가능
- dashboard/관리 메뉴 노출은 계속 숨김
- 실제 청구/결제/발송 금지 유지

주의:
- 룰북 전체를 과하게 재작성하지 않는다.
- 기존 금지 원칙을 삭제하지 않는다.
- 기존 수납·출납 foundation 숨김 원칙을 변경하지 않는다.

## 11. 검증
수정한 JS 파일에 대해 문법 검증을 실행한다.

필수:

- node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js
- node --check apmath/js/management.js

dashboard.js는 수정하지 않았더라도 숨김 상태 확인 차원에서 선택적으로 실행 가능:

- node --check apmath/js/dashboard.js

운영 API smoke test는 실행하지 않는다.
Worker 배포도 실행하지 않는다.
git add / commit / push도 실행하지 않는다.

반드시 확인:

- git diff --name-only
- git status --short

허용 변경 파일:

- apmath/worker-backup/worker/routes/billing-accounting-foundation.js
- apmath/js/management.js
- docs/INITIAL_DATA_SPLIT_ANALYSIS.md
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- CODEX_RESULT.md

CODEX_TASK.md가 기존 dirty 상태라면 CODEX_RESULT에 별도 확인 대상으로 적고, 커밋 대상에서는 제외하라.

## 12. 완료 보고
작업 완료 후 프로젝트 루트에 `CODEX_RESULT.md`를 작성한다.

반드시 아래 형식을 사용한다.

# CODEX_RESULT

## 1. 생성/수정 파일
- 생성/수정한 파일 목록

## 2. 구현 완료 또는 확인 완료
- billing_templates read-only API 추가 여부
- payments read-only API 추가 여부
- payment_items read-only API 추가 여부
- billing_adjustments read-only API 추가 여부
- billing_runs read-only API 추가 여부
- management.js lazy loader blocked key 조회 추가 여부
- state.db 구조 유지 여부
- initial-data 응답 구조 유지 여부
- dashboard.js 숨김 상태 유지 여부
- docs/INITIAL_DATA_SPLIT_ANALYSIS.md 업데이트 여부
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 업데이트 여부

## 3. 실행 결과
- node --check 실행 결과
- git diff --name-only 결과
- git status --short 결과
- Worker 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## 4. 결과 요약
- blocked key가 ready/almost ready로 이동했는지
- 아직 initial-data에서 제거하지 않았다는 점
- 실제 initial-data 축소 전 남은 검증
- 운영 화면 노출은 계속 금지라는 점

## 5. 다음 조치
- 사용자가 직접 문서 확인
- 필요 시 다음 단계 initial-data 실제 축소 지시서 작성
- 필요 시 사용자가 직접 지정 파일만 git add
- 권장 커밋 메시지
- 커밋 대상 파일

완료 보고에는 반드시 아래 항목을 포함한다.

- 기존 문구 변경 여부:
- 기존 버튼명 변경 여부:
- 기존 화면명 변경 여부:
- 기존 메뉴명 변경 여부:
- 기존 운영 용어 변경 여부:
- initial-data 응답 구조 변경 여부:
- initial-data SQL query 변경 여부:
- 프론트 로딩 흐름 변경 여부:
- 대시보드/관리 메뉴 노출 변경 여부:
- 수납·출납 foundation 진입점 숨김 유지 여부:
- DB schema 변경 여부:
- migration 추가 여부:
- 실제 청구 생성 여부:
- 실제 결제 연동 여부:
- 실제 알림톡/문자 발송 여부:
- 배포 실행 여부:
- 운영 smoke 실행 여부:
- git commit 실행 여부:
- git push 실행 여부:

## 13. 권장 커밋 메시지
작업 완료 후 사용자가 직접 커밋할 경우 권장 메시지:

Add billing accounting read-only split APIs

## 14. 최종 출력
터미널 마지막 출력은 아래 문장으로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF