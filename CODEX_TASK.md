# CODEX_TASK — Phase 1d-BULK-testfix: admin assessment archive 테스트 분리 구조 보정

## 0. 최우선 지시

이번 작업은 제품 코드 수정이 아니다.

이번 작업의 목적은 `Phase 1d-BULK`에서 admin-only 함수군을 `dashboard.js`에서 `dashboard-admin.js`로 이동한 뒤 깨진 테스트 위치 가정을 보정하는 것이다.

현재 실패:

```text
tests/admin-assessment-archive-card.test.js
AssertionError: renderAdminStudentOverviewPanel should exist
```

원인:

```text
기존 테스트가 apmath/js/dashboard.js만 읽고
renderAdminStudentOverviewPanel, adminBuildGradeHoverRows, openAdminLeaveStudentList 등을 찾는다.

하지만 Phase 1d-BULK 이후 해당 admin 함수들은 apmath/js/dashboard-admin.js로 이동했다.
```

이번 작업에서는 운영 JS를 절대 수정하지 않는다.
이번 작업은 테스트 파일 1개 보정 작업이다.

---

## 1. 하위 에이전트 사용 금지

Codex 하위 에이전트 A/B/C/D는 사용하지 않는다.

Codex는 아래만 수행한다.

```text
1. 실제 테스트 파일 확인
2. 테스트가 dashboard 분리 구조를 읽도록 보정
3. 테스트 실행
4. CODEX_RESULT1.md 작성
5. 검수팩 생성 가능 상태로 정리
```

---

## 2. 반드시 먼저 확인할 파일

작업 전 실제 로컬 파일 기준으로 아래를 확인한다.

```text
tests/admin-assessment-archive-card.test.js
apmath/js/dashboard.js
apmath/js/dashboard-admin.js
apmath/js/ui.js
eie/css/eie.css
docs/reports/apmath-phase1-dashboard-admin-bulk-move-result.md
```

`CODEX_RESULT1.md`에 아래를 적는다.

```text
admin assessment 테스트가 기존 dashboard.js 단독 기준인지 확인:
renderAdminStudentOverviewPanel 위치 확인:
adminBuildGradeHoverRows 위치 확인:
openAdminLeaveStudentList 위치 확인:
이번 작업이 테스트 보정인지 확인:
운영 JS 수정 금지 확인:
```

---

## 3. 수정 허용 파일

이번 작업에서 수정 가능한 파일은 아래만 허용한다.

```text
tests/admin-assessment-archive-card.test.js
docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md
CODEX_RESULT1.md
```

---

## 4. 수정 금지 파일

아래 파일은 절대 수정하지 않는다.

```text
apmath/js/dashboard.js
apmath/js/dashboard-admin.js
apmath/js/dashboard-teacher.js
apmath/js/dashboard-assistant-memos.js
apmath/index.html
apmath/js/student.js
apmath/js/student-edit.js
tests/apmath-global-surface.test.js
tests/fixtures/*
eie/*
workers/*
archive/*
migrations/*
```

---

## 5. 보정 방향

현재 테스트는 이런 구조다.

```js
const dashboardPath = path.join(root, 'apmath/js/dashboard.js');
const dashboard = fs.readFileSync(dashboardPath, 'utf8');
```

이제 admin 관련 assertion은 `dashboard-admin.js`도 함께 읽어야 한다.

권장 구조:

```js
const dashboardPath = path.join(root, 'apmath/js/dashboard.js');
const dashboardAdminPath = path.join(root, 'apmath/js/dashboard-admin.js');

const dashboard = fs.readFileSync(dashboardPath, 'utf8');
const dashboardAdmin = fs.readFileSync(dashboardAdminPath, 'utf8');
const dashboardCombined = `${dashboardAdmin}\n${dashboard}`;
```

검사 기준:

```text
1. admin-only 함수 존재 여부는 dashboardAdmin 또는 dashboardCombined에서 검사한다.
2. renderAdminStudentOverviewPanel body 추출은 dashboardAdmin 기준으로 한다.
3. dashboard.js에 남아야 할 공통 helper 검사는 기존 dashboard 기준을 유지할 수 있다.
4. ui.js / eie.css 검사 로직은 그대로 둔다.
```

---

## 6. 반드시 보정해야 하는 assertion

아래 assertion들은 더 이상 `dashboard` 단독 기준이면 안 된다.

```text
renderAdminStudentOverviewPanel should exist
adminBuildGradeHoverRows 존재 검사
ap-admin-mini-metric__hover 검사
renderAdminAssessmentArchiveMetric 검사
ap-admin-assessment-card 검사
진단평가 · 단원평가 · 중간·기말평가 검사
assessment-mvp.html 링크 검사
renderAdminMiniMetric('휴원') 제거 검사
openAdminLeaveStudentList 존재 검사
휴원생 목록 검사
```

권장:

```text
1. renderAdminStudentOverviewPanel body는 dashboardAdmin에서 추출
2. adminBuildGradeHoverRows / openAdminLeaveStudentList / 휴원생 목록은 dashboardCombined 또는 dashboardAdmin에서 검사
3. assessment archive card 관련 문자열은 dashboardAdmin 또는 overviewBody에서 검사
```

---

## 7. 바꾸면 안 되는 것

이번 작업은 테스트의 파일 위치 가정만 바꾼다.

금지:

```text
1. assertion 의미 완화 금지
2. assertion 삭제 금지
3. 테스트 목적 변경 금지
4. "존재해야 함"을 "있으면 좋음"으로 낮추기 금지
5. 제품 코드 수정 금지
6. fixture 수정 금지
```

즉, 테스트는 여전히 아래를 강하게 보장해야 한다.

```text
1. admin overview에 assessment archive card가 존재해야 함
2. assessment archive card label이 가운데 정렬이어야 함
3. helper text가 유지되어야 함
4. assessment-mvp.html 링크가 유지되어야 함
5. 기존 휴원 카드가 첫 화면 metric grid에 남아 있으면 안 됨
6. 휴원생 목록 기능은 다른 경로로 유지되어야 함
7. teacher sidebar의 시험지 보관함 메뉴는 유지되어야 함
8. EIE surface action font weight 기준은 유지되어야 함
```

---

## 8. 테스트 실행

필수 실행:

```bash
node --check tests/admin-assessment-archive-card.test.js
node tests/admin-assessment-archive-card.test.js
node --check apmath/js/dashboard.js
node --check apmath/js/dashboard-admin.js
node tests/apmath-onclick-defined.test.js
```

가능하면 실행:

```bash
node tools/run-tests.js
node tools/smoke-api.mjs
```

현재 기존 이슈로 아래 실패가 남을 수 있다.

```text
apmath-global-surface.test.js: 기존 student surface mismatch
student-portal-omr-review-ui.test.js: 기존 neutral charcoal assertion
eie-exam-records-mvp.test.js: 기존 student detail assertion
```

이 경우 이번 testfix와 무관한 실패로 명시한다.

---

## 9. 결과 보고서 작성

아래 파일을 작성한다.

```text
docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md
```

보고서 내용:

```md
# AP Math Phase 1d-BULK Testfix Result

## 1. 작업 목적
- admin-assessment-archive-card.test.js가 dashboard 분리 구조를 읽도록 보정

## 2. 수정 파일
- tests/admin-assessment-archive-card.test.js
- docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md

## 3. 보정 내용
- dashboard-admin.js 읽기 추가:
- dashboardCombined 도입 여부:
- overviewBody 추출 기준 변경:
- assertion 의미 변경 여부:

## 4. 테스트 결과
- node --check tests/admin-assessment-archive-card.test.js:
- node tests/admin-assessment-archive-card.test.js:
- node --check dashboard.js:
- node --check dashboard-admin.js:
- onclick-defined:
- tools/run-tests.js:
- smoke-api:

## 5. 수정 금지 파일 확인
- 운영 JS 수정 여부:
- fixture 수정 여부:
- EIE/Worker/archive 수정 여부:

## 6. 남은 실패/보류
- student surface mismatch:
- student-portal-omr-review-ui:
- eie-exam-records-mvp:
- browser smoke:

## 7. 다음 작업 권고
- 1d-BULK 완료 가능 여부:
- 다음 정리 후보:
```

---

## 10. CODEX_RESULT1.md 필수 작성

작업 완료 후 루트에 `CODEX_RESULT1.md`를 작성한다.

```md
# CODEX_RESULT1 — Phase 1d-BULK-testfix admin assessment archive 테스트 보정

## 1. 생성/수정 파일
- tests/admin-assessment-archive-card.test.js
- docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md
- CODEX_RESULT1.md

## 2. 보정 내용
- dashboard-admin.js 읽기 추가 여부:
- dashboardCombined 도입 여부:
- overviewBody 추출 기준:
- assertion 의미 변경 여부:

## 3. 수정 금지 파일 확인
- apmath/js/dashboard.js:
- apmath/js/dashboard-admin.js:
- index.html:
- tests/fixtures:
- EIE/Worker/archive:

## 4. 테스트 결과
- node --check tests/admin-assessment-archive-card.test.js:
- node tests/admin-assessment-archive-card.test.js:
- node --check dashboard.js:
- node --check dashboard-admin.js:
- onclick-defined:
- tools/run-tests.js:
- smoke-api:

## 5. git 상태
- git status --short:
- git diff --name-only:
- 이번 작업 관련 파일:
- 기존 dirty 파일:

## 6. 다음 작업
- 1d-BULK 완료 가능 여부:
- 남은 선행 정리:
```

---

## 11. stage / commit 기준

이번 작업에서는 stage하지 않는다.
commit하지 않는다.
push하지 않는다.

나중에 이 작업만 stage한다면 허용 파일은 아래다.

```text
tests/admin-assessment-archive-card.test.js
docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md
```

절대 stage 금지:

```text
apmath/js/dashboard.js
apmath/js/dashboard-admin.js
apmath/js/dashboard-teacher.js
apmath/index.html
tests/fixtures/*
eie/*
workers/*
archive/*
migrations/*
```

---

## 12. 완료 기준

아래를 모두 만족해야 한다.

```text
1. admin-assessment-archive-card.test.js가 dashboard-admin.js를 읽음
2. renderAdminStudentOverviewPanel body 추출이 dashboard-admin.js 기준으로 동작함
3. assertion 의미 완화 없음
4. 운영 JS 수정 없음
5. fixture 수정 없음
6. node tests/admin-assessment-archive-card.test.js PASS
7. node --check dashboard.js PASS
8. node --check dashboard-admin.js PASS
9. onclick-defined PASS
10. CODEX_RESULT1.md 작성
11. 결과 보고서 작성
12. stage/commit/push 없음
```
