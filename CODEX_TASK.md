````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업명
수납·출납 foundation 노출 보정: 대시보드/관리 메뉴 진입점 숨김 처리

## 1. 작업 전 필수 기준
작업 전 반드시 아래 문서를 처음부터 끝까지 읽고 적용한다.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

반드시 지킬 것:

- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 금지
- 기능 추가 외 기존 문구 정리 금지
- 학생 포털/OMR 기능 변경 금지
- 제출 완료 OMR 수정/재입력/재제출 기능 추가 금지
- 새 API 본문을 `index.js`에 직접 추가 금지
- DB schema/migration 변경 금지
- 배포 실행 금지
- 운영 API smoke test 실행 금지
- git commit 금지
- git push 금지
- `git add .` 금지

## 2. 작업 배경
수납·출납 foundation 1단계-D까지 backend, DB, route, UI foundation은 구현되었다.

하지만 현재 운영 방침은 다음과 같다.

- 수납·출납 foundation은 아직 실제 운영 화면에 공개하지 않는다.
- 원장/관리자 대시보드나 관리 메뉴에 버튼을 꺼내놓지 않는다.
- 기능은 내부에 유지하되, 사용하면서 단계적으로 노출할 때까지 숨김 상태로 둔다.
- backend route와 함수는 유지한다.
- DB schema/migration도 유지한다.
- 프론트 진입 버튼만 숨긴다.

즉, 이번 작업은 기능 삭제가 아니라 **운영 노출 차단**이다.

## 3. 작업 목표
이번 작업 목표는 다음이다.

1. 대시보드 또는 관리 메뉴에 노출된 `수납·출납 foundation` 진입 버튼을 숨긴다.
2. `openBillingAccountingFoundationModal()` 함수와 관련 내부 UI 함수는 삭제하지 않는다.
3. backend `billing-accounting-foundation` route는 삭제하지 않는다.
4. DB schema/migration은 되돌리지 않는다.
5. 원장/관리자 화면의 기존 버튼/카드/문구/배치를 임의로 변경하지 않는다.
6. 수납·출납 foundation 관련 문서에는 “구현 완료, 운영 노출은 숨김” 상태를 반영한다.
7. `CODEX_RESULT.md`를 작성한다.

## 4. 수정 대상 후보
우선 아래 파일만 확인한다.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `apmath/js/dashboard.js`
- `apmath/js/management.js`
- `CODEX_RESULT.md`

필요한 경우 읽기 확인만 한다.

- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/20260516_cashbook_entries_status_is_active.sql`

원칙:

- `index.js` 수정 금지
- route 수정 금지
- schema/migration 수정 금지
- 기능 함수 삭제 금지
- 진입 버튼만 숨김

## 5. 절대 금지
아래는 절대 하지 않는다.

- 수납·출납 foundation backend 삭제 금지
- 수납·출납 foundation 함수 삭제 금지
- `openBillingAccountingFoundationModal()` 삭제 금지
- `billingAccounting...` 계열 함수 삭제 금지
- `billing-accounting-foundation.js` route 삭제 금지
- schema/migration rollback 금지
- 기존 관리자 대시보드 레이아웃 변경 금지
- 기존 관리 메뉴 버튼명 변경 금지
- 기존 관리 메뉴 버튼 순서 임의 변경 금지
- 새 카드 추가 금지
- 학생 포털 수정 금지
- OMR 수정 금지
- 배포 금지
- 운영 smoke 금지
- git commit/push 금지

## 6. 먼저 확인할 명령
프로젝트 루트에서 실행한다.

```powershell
cd "C:\Users\USER\Desktop\AP------"

git status --short

Select-String -Path apmath\js\dashboard.js,apmath\js\management.js -Pattern "수납·출납 foundation|openBillingAccountingFoundationModal|billingAccounting|billing-accounting-foundation" -CaseSensitive:$false

Select-String -Path docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md -Pattern "수납·출납 foundation|billing-accounting-foundation|cashbook|금전" -CaseSensitive:$false
````

## 7. 구현 기준

### 7-1. dashboard.js 보정

`openAdminOperationMenu()` 또는 대시보드/관리 메뉴에서 `수납·출납 foundation` 버튼이 렌더링되고 있으면 숨긴다.

허용 방식:

```js
const SHOW_BILLING_ACCOUNTING_FOUNDATION_ENTRY = false;
```

같은 상수를 함수 내부 또는 적절한 위치에 두고, 버튼 렌더링 조건에 추가한다.

예시:

```js
const isAdmin = String(state?.auth?.role || '') === 'admin';
const showBillingAccountingFoundationEntry = false;

${isAdmin && showBillingAccountingFoundationEntry ? `
<button ...>수납·출납 foundation</button>
` : ''}
```

또는 기존 프로젝트 스타일에 맞춰 더 간단히 버튼 블록 자체를 주석 처리하지 말고 조건 false로 숨긴다.

금지:

* `openAdminOperationMenu()` 전체 변경 금지
* 기존 버튼 순서 변경 금지
* 다른 버튼 삭제 금지
* 기존 문구 변경 금지
* `수납·출납 foundation` 버튼을 다른 이름으로 바꿔서 노출 금지

### 7-2. management.js 보정

`openBillingAccountingFoundationModal()` 함수는 유지한다.

필수:

* admin role 차단은 유지한다.
* 함수는 삭제하지 않는다.
* 내부 UI는 삭제하지 않는다.
* 직접 호출했을 때 admin이 아니면 차단되는 구조 유지한다.

선택:

* admin이라도 일반 UI 버튼에서는 접근할 수 없게만 하면 된다.
* 개발자 콘솔 직접 호출까지 admin에게 막을 필요는 없다.
* 운영 진입점만 숨기면 된다.

금지:

* 함수 삭제 금지
* API 호출 삭제 금지
* 저장/수정/취소 함수 삭제 금지

### 7-3. 문서 보정

`docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`에 현재 상태를 반영한다.

반영 내용:

```text
수납·출납 foundation은 backend/DB/UI foundation 구현은 완료되어 있으나, 운영 화면 진입점은 숨김 상태로 유지한다.
원장/관리자 대시보드 또는 관리 메뉴에 기본 노출하지 않는다.
실제 운영 사용은 별도 승인 후 진입점 노출 단계에서 진행한다.
```

다음 작업 큐에는 아래를 추가한다.

```text
- 수납·출납 foundation 운영 노출 전 수동 테스트 및 진입점 재오픈 판단
```

완료 작업에는 아래를 추가한다.

```text
- 수납·출납 foundation 대시보드/관리 메뉴 노출 숨김 보정
```

## 8. 검증 기준

수정 후 아래만 실행한다.

```powershell
cd "C:\Users\USER\Desktop\AP------"

node --check apmath\js\dashboard.js
node --check apmath\js\management.js
```

route를 수정하지 않았으면 route check는 필수 아님.
그래도 실행해도 된다.

```powershell
node --check apmath\worker-backup\worker\routes\billing-accounting-foundation.js
```

## 9. 실행하지 말 것

아래는 실행하지 않는다.

```powershell
npx wrangler deploy
```

아래도 실행하지 않는다.

* 운영 API smoke test
* 운영 DB migration 적용
* 운영 데이터 생성/수정/취소 테스트
* git commit
* git push

## 10. CODEX_RESULT.md 작성

작업 완료 후 `CODEX_RESULT.md`를 아래 형식으로 작성한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 실제 수정 파일만 기재

## 2. 구현 완료 또는 확인 완료
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 확인 완료
- 수납·출납 foundation 노출 보정 범위 확인 완료
- 대시보드/관리 메뉴의 수납·출납 foundation 진입 버튼 숨김 처리 완료
- openBillingAccountingFoundationModal 함수 삭제 없음 확인
- billingAccounting 계열 함수 삭제 없음 확인
- billing-accounting-foundation backend route 변경 없음 확인
- DB schema/migration 변경 없음 확인
- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어 변경 없음 확인
- 기존 관리자/원장 대시보드 버튼 순서와 문구 임의 변경 없음 확인
- 학생 포털/OMR 흐름 변경 없음 확인
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 업데이트 완료

## 3. 실행 결과
- node --check apmath/js/dashboard.js:
- node --check apmath/js/management.js:
- node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js:
- 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 DB migration 적용 여부: 미실행 - 해당 없음
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상
- git diff --name-only:
- git status --short:

## 4. 결과 요약
- 수납·출납 foundation 기능은 유지하되, 원장/관리자 대시보드 및 관리 메뉴 기본 노출을 숨김 처리했다.
- backend route, DB schema, migration, 내부 관리 함수는 삭제하지 않았다.
- 실제 운영 사용은 별도 승인 후 진입점 재오픈 단계에서 진행하도록 문서에 반영했다.

## 5. 다음 조치
- 사용자가 직접 변경 파일 확인
- 사용자가 직접 필요 시 배포
- 사용자가 직접 원장 계정 관리 메뉴에서 수납·출납 foundation 버튼 미노출 확인
- 사용자가 직접 지정 파일만 git add
- 사용자가 직접 git commit / git push
- 다음 후보: initial-data 분리 여부 분석 또는 수납·출납 foundation 운영 노출 전 수동 테스트
```

## 11. 사용자 직접 실행용 참고 명령

아래 명령은 실행하지 말고 `CODEX_RESULT.md`에 참고로만 적는다.

배포:

```powershell
cd "C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker"
npx wrangler deploy --config wrangler.jsonc
```

커밋 후보:

```powershell
cd "C:\Users\USER\Desktop\AP------"

git status --short

git add apmath\js\dashboard.js
git add apmath\js\management.js
git add docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
git add CODEX_RESULT.md

git commit -m "Hide billing accounting foundation entry"
git push
```

## 12. 최종 자체검수

완료 전 반드시 확인한다.

* docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md를 읽었는가?
* 수납·출납 foundation 진입 버튼만 숨겼는가?
* backend route를 삭제하지 않았는가?
* management.js 내부 함수들을 삭제하지 않았는가?
* DB schema/migration을 되돌리지 않았는가?
* 기존 관리 메뉴 버튼 문구를 바꾸지 않았는가?
* 기존 관리 메뉴 버튼 순서를 임의로 바꾸지 않았는가?
* 학생 포털/OMR을 건드리지 않았는가?
* node --check가 PASS인가?
* 배포를 실행하지 않았는가?
* 운영 smoke를 실행하지 않았는가?
* git commit/push를 실행하지 않았는가?
* CODEX_RESULT.md가 지정 형식으로 작성되었는가?

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
