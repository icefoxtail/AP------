# CODEX TASK — 리포트센터 진입 통합 · 고급보기 정리 · 평균 전체화 · UX 개선

> 작성일: 2026-07-09
> 지시자: 원장(검수자), 구현: Codex, 검수: Claude
> 대상: `apmath/js/report-center.js`, `apmath/js/student.js`, 관련 테스트. (항목 C가 데이터 부재로 판명될 때만 `apmath/worker-backup/worker/index.js`)
> 원칙: 리포트센터는 단일 통합 입구를 유지한다. 기존 학교시험 분석 드릴다운 흐름을 깨지 않는다. 별도 앱/별도 사이드바를 만들지 않는다.

---

## 0. Current Code Baseline Recheck (2026-07-09 실측)

`main` 브랜치 실제 코드 기준으로 아래를 이미 확인했다. Codex는 착수 전 각 지점을 다시 열어 보고 이 문서와 어긋나면 문서 기준이 아니라 **현재 코드 기준**으로 판단한 뒤, 어긋난 부분을 결과 보고서에 적는다.

- 상단 내부 메뉴: `reportCenterInternalMenuHtml(studentId, activeMenu)` — `report-center.js:1863`
  - `schoolExam` 버튼: `reportCenterNavTo('list', ...); openReportCenterModal(studentId, 'daily', { forceDrilldown: true })`
  - `daily/exam/counsel` 버튼: `openReportCenterModal(studentId, key, { forceAdvanced: true })` — `report-center.js:1869-1871`
- 진입 라우터: `openReportCenterModal(studentId, activeTab='daily', options={})` — `report-center.js:3054`
  - `!forceAdvanced && (forceDrilldown || !advancedMode)` → `reportCenterBuildDrilldownShell(studentId)` (신 드릴다운)
  - 그 외 → `openReportCenterExam / openReportCenterCounsel / openReportCenterDaily` (구 평면 모달)
- 구 평면 모달 셸: `reportCenterBaseShell(studentId, activeTab, bodyHtml)` — `report-center.js:3024` (오늘/평가/상담 3탭)
- `openReportCenterDaily(studentId)` `report-center.js:3066`, `openReportCenterCounsel(studentId)` `report-center.js:7358`, `openReportCenterExam(studentId, selectedSessionId)` `report-center.js:7217`
  - 셋 다 `buildReportContext(studentId).student` 없으면 `toast('학생 정보를 찾을 수 없습니다.', 'warn')` 후 리턴. **이것이 시험 목록 화면에서 오늘/평가/상담 클릭 시 튕기는 원인이다.**
- 고급 보기 토글: `reportCenterAdvancedMode()` / `reportCenterSetAdvancedMode()` — `report-center.js:1811-1827`, `reportCenterAdvancedToggleHtml` `report-center.js:1844`
  - 두 가지 책임을 겸함: (1) 진입 라우팅을 신/구로 전환 (2) 스튜디오 편집/프리미엄 툴바 노출 게이팅. `reportCenterRenderStudioToolbar` `report-center.js:5694`, `reportCenterRenderStudioPanel` `report-center.js:5722`, 테스트 `tests/report-center-advanced-policy.test.mjs`.
- 대시보드/집계 평균 계산:
  - 반 카드/시험 평균: `reportCenterGetGroupClasses(group)` `report-center.js:1442` → `state.db.exam_sessions.score` 로컬 집계 = **담당 선생님 학생만**
  - 전체 응시 정답률: `reportCenterBuildCohortRates(archiveFile)` `report-center.js:1973` → 로컬 세션/오답 = **담당 선생님 학생만**
  - 학생 개별 리포트 `stats.overallAvg`: `buildReportCohortSummary(session)` `report-center.js:217` → 우선 `state.db.report_exam_cohort_stats`(**apmath 전체**), 없으면 `calculateReportAverage(로컬 세션)`(담당 학생) fallback
- 서버 코호트 집계: `buildReportExamCohortStats(env, sessions, ...)` `worker/index.js:713` → `exam_sessions` **전체 테이블**을 `archive_file + 시험연도 + 학년`으로 묶어 세션별 `gradeExamAverage / gradeExamCount / questionStats` 산출. school-exam 세션은 `archive_file + exam_date` 보유하므로 identity 성립.

결론: **개별 학생 리포트의 "전체 평균"은 이미 apmath 전체 기준이나, 리포트센터 대시보드/반 카드/시험 정답률은 담당 선생님 학생만으로 계산된다.** 그리고 그 apmath 전체 값은 이미 `report_exam_cohort_stats`로 내려와 있으므로, 대시보드가 그 값을 읽게만 하면 대부분 프론트만으로 해결된다.

---

## 1. Goals (4개 항목)

- **A. 진입 통합**: 리포트센터 안에서 학생을 미리 안 골라도 오늘/평가/상담 리포트로 들어갈 수 있어야 한다. 미선택 시 토스트로 튕기지 말고, 그 자리에서 학생을 고르는 인라인 선택 화면을 보여준다. 학생 카드에서 들어오면 그 학생 컨텍스트로 리포트가 열린다. (양방향)
- **B. 고급 보기 정리**: 신/구 UI 전환 책임을 제거한다. 진입은 항상 신 드릴다운. 토글은 편집/프리미엄 도구 노출 용도로만 남기고 라벨을 명확히 한다.
- **C. 평균 전체화**: 대시보드/집계에서 "전체" 라벨이 붙는 평균·정답률·응시자 수를 apmath 전체 기준으로 바꾼다. 반 평균은 담당 반 기준으로 유지하되 라벨을 명확히 한다.
- **D. UX 개선**: 평균 라벨 명확화, 카드 상태 배지, "시험지 찾기" 미구현 버튼 처리 등.

각 항목은 독립 커밋/독립 검증이 가능하도록 순서대로 진행한다. A → B → C → D.

---

## 2. Product Decisions

### 2.1 항목 A — 진입 통합

- 상단 4메뉴(`학교시험 분석 / 오늘 리포트 / 평가 리포트 / 상담 리포트`)는 지금처럼 항상 노출한다.
- `학교시험 분석`은 기존 드릴다운(시험 목록 → 반/학생 선택) 그대로 유지한다. **변경 금지.**
- `오늘 리포트 / 평가 리포트 / 상담 리포트` 클릭 동작을 바꾼다:
  - 학생 컨텍스트가 **있으면** 해당 학생의 리포트 본문을 **드릴다운 셸 안에** 렌더한다(별도 평면 모달로 튕기지 않는다).
  - 학생 컨텍스트가 **없으면** 토스트 대신 **인라인 학생 선택 화면**을 렌더한다.
- 인라인 학생 선택 화면 요구:
  - 상단 안내: `리포트를 만들 학생을 먼저 선택하세요.`
  - 검색 입력(이름) + 반 필터로 좁히기.
  - 후보 학생: `state.db.students` 중 담당 반에 속한 재원 학생(기존 리포트센터가 접근 가능한 범위 그대로). 반 소속은 `state.db.class_students`로 판단.
  - 학생 카드 클릭 → 같은 메뉴(daily/exam/counsel)를 그 학생으로 다시 렌더.
  - 빈 상태: `표시할 학생이 없습니다.`
- 학생을 고른 뒤 상단에 `선택: <이름> (반명) · 변경` 형태의 컨텍스트 바를 두고 `변경` 클릭 시 다시 선택 화면으로.
- 학교시험 분석의 학생 상세(L2)에서 이미 `daily/exam/counsel`로 넘어갈 수 있는 진입이 있으면 그 학생 id를 그대로 물고 들어가게 한다.

### 2.2 항목 B — 고급 보기 정리

- `openReportCenterModal`에서 `forceAdvanced`/`advancedMode`로 **구 평면 모달(`reportCenterBaseShell` 3탭)로 라우팅하는 경로를 제거**한다. 진입은 항상 드릴다운 셸(4메뉴)로 간다.
- `reportCenterAdvancedMode()` 플래그 자체는 유지하되 **의미를 "편집·상세 도구 표시"로 한정**한다. 스튜디오 편집/프리미엄 툴바 게이팅(`reportCenterRenderStudioToolbar`, `reportCenterRenderStudioPanel`)은 그대로 이 플래그를 쓴다.
- 라벨 변경: `고급 보기` → `상세 편집 도구`. 툴팁/보조문구: `리포트 문구를 직접 편집하고 프리미엄 분석을 켭니다.`
- `reportCenterBaseShell`는 당장 삭제하지 않는다(다른 참조·테스트가 있음). 다만 주 진입 경로에서는 더 이상 호출하지 않는다. 항목 A에서 daily/exam/counsel 본문을 드릴다운 셸 안에 렌더하도록 옮기므로, baseShell는 레거시로 남고 신규 호출을 추가하지 않는다.
- 토글 상태 변경 시 현재 화면(드릴다운)이 그대로 유지되도록 `onchange` 핸들러를 조정한다. 지금은 `openReportCenterModal(studentId, activeTab)`을 재호출하는데(`report-center.js:1848`), 신 라우팅에 맞게 현재 nav 상태를 보존하며 다시 그리게 한다.

### 2.3 항목 C — 평균 전체화

우선순위: **프론트 우선.** 서버 코호트 값이 이미 존재하므로 그것을 읽는다.

- 신규 helper `reportCenterGetCohortStatForSession(sessionId)` — `state.db.report_exam_cohort_stats`에서 세션 매칭 행을 찾아 `{ gradeExamAverage, gradeExamCount, questionStats }` 반환(없으면 null).
- 신규 helper `reportCenterGetGroupCohortSummary(group)`:
  - 그룹의 세션들에 대응하는 코호트 행을 모아 apmath 전체 평균/응시자 수를 구한다. 같은 시험지+연도+학년이면 세션마다 동일한 코호트 값을 가지므로, 대표값(첫 유효 코호트 행) 또는 학년별로 나뉘면 학년별 값을 합산·표기한다.
  - 코호트 행이 전혀 없으면 `{ source: 'local' }`로 표시하고 기존 로컬 계산을 쓴다.
- 반영 지점:
  - 시험 대시보드 헤더/요약의 "전체 평균", "전체 응시 정답률", 전체 응시자 수(`reportCenterBuildExamDashboard` `report-center.js:2546`, `reportCenterBuildCohortRates` `report-center.js:1973`, 배치 리포트 헤더 `report-center.js:2251`):
    - 코호트 값이 있으면 apmath 전체 값 사용 + 라벨 `학원 전체`.
    - 없으면 로컬 값 사용 + 라벨 `담당 반 기준(전체 집계 준비 중)`.
  - 반 카드(`reportCenterGetGroupClasses`)의 반 평균은 **담당 반 기준 유지**. 단 카드/라벨에 `우리 반 평균`이라고 명시한다.
- **데이터 검증 게이트**: 실제 DB에서 school-exam 세션에 대해 `report_exam_cohort_stats`가 채워지는지 브라우저/네트워크로 확인한다.
  - 채워지면 → 프론트만으로 완료. 워커 변경 없음.
  - 대부분 null이면 → 원인 규명 후 **항목 C-server**(아래 3.C-2)로 넘어가고, 원장에게 "워커 재배포 필요"를 보고한다. 임의로 배포하지 않는다.

### 2.4 항목 D — UX 개선

- 평균 라벨: 위 C에서 정한 `학원 전체` / `우리 반` 라벨을 관련 수치 옆에 작은 배지로 일관 표기.
- 반/학생 카드 상태 배지: 오답 미입력, 리포트 서버 저장본 유무 등 기존 `reportCenterBuildSchoolExamStudentStatusBadges`(`report-center.js:2865`)류를 반/학생 선택 카드에도 요약 노출(과밀 금지, 1~2개만).
- "시험지 찾기" 버튼(`report-center.js:3003`)은 현재 `준비 중` 토스트만 뜬다 → 이번 루프에서는 **버튼을 숨긴다**(주석으로 보존). 별도 기능화는 out of scope.
- 인라인 선택/컨텍스트 바 등 신규 UI는 기존 `.aprc-*` 클래스와 톤을 재사용한다. 새 전역 CSS 남발 금지.

---

## 3. Implementation Tasks

### Task A-1 — 회귀 테스트 먼저 추가

- Create: `tests/report-center-inline-report-entry.test.mjs` (ESM, 기존 `report-center-advanced-policy.test.mjs`와 동일한 vm 로딩 패턴 사용)

검증 계약(정적/함수 계약):

- `state.db.students`에 학생이 있고 studentId 없이 `오늘/평가/상담` 메뉴 본문을 요청하면, 결과 HTML에 **학생 선택 안내 문구**(`리포트를 만들 학생을 먼저 선택하세요`)가 포함되고 `학생 정보를 찾을 수 없습니다` 토스트가 호출되지 않는다.
- studentId를 주면 해당 리포트 본문(예: `report-center-daily-text` 등 기존 id)이 포함된다.
- 신규 helper `reportCenterBuildMenuBody`(또는 채택한 이름)가 전역에 존재한다.

로딩 스케치:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(f => fs.readFileSync(path.join(root, 'apmath/js', f), 'utf8')).join('\n');
let toastCalls = [];
const ctx = {
  state: { db: { students: [{ id: 's1', name: '민준' }], classes: [], class_students: [], exam_sessions: [], wrong_answers: [], report_exam_cohort_stats: [] } },
  window: {}, document: { getElementById: () => null },
  localStorage: { _m: new Map(), getItem(k){return this._m.has(k)?this._m.get(k):null;}, setItem(k,v){this._m.set(k,String(v));}, removeItem(k){this._m.delete(k);} },
  toast: (msg, kind) => toastCalls.push([msg, kind]),
  console, setTimeout, clearTimeout
};
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(source, ctx, { filename: 'apmath/js/report.js' });

const noStudent = ctx.reportCenterBuildMenuBody('daily', '');
assert.match(noStudent, /먼저 선택/);
const withStudent = ctx.reportCenterBuildMenuBody('daily', 's1');
assert.match(withStudent, /report-center-daily-text/);
console.log('report center inline report entry test passed');
```

Run: `node tests/report-center-inline-report-entry.test.mjs` — 구현 전 FAIL 기대.

### Task A-2 — daily/exam/counsel 본문을 드릴다운 셸 내부로 이동

- Modify: `apmath/js/report-center.js`
- 신규 함수:
  - `reportCenterBuildMenuBody(menu, studentId, options = {})` — menu가 `daily/exam/counsel`일 때 본문 HTML을 반환. studentId 없으면 인라인 선택 화면 반환.
  - `reportCenterBuildReportStudentPicker(menu, options = {})` — 이름 검색 + 반 필터 + 학생 카드. 카드 onclick은 `openReportCenterMenu('<menu>', '<studentId>')`.
  - `reportCenterBuildReportContextBar(menu, studentId)` — `선택: 이름(반) · 변경`.
  - `openReportCenterMenu(menu, studentId = '')` — nav의 menu/studentId를 세팅하고 드릴다운 셸을 다시 그린다.
- 기존 `openReportCenterDaily/Counsel/Exam` 본문 생성 로직은 **본문 HTML 생성 부분만 추출**해 `reportCenterBuildMenuBody`가 재사용하게 한다(기존 함수는 유지하되 내부에서 추출된 빌더를 호출하도록 리팩터). 리스크를 줄이려면 기존 함수의 `body` 문자열 부분을 `reportCenterBuildDailyBody(studentId)` 등으로 분리하고, `reportCenterBuildMenuBody`와 기존 모달이 공용으로 쓴다.
- `reportCenterBuildDrilldownShell(studentId)`(`report-center.js:2986`)를 확장:
  - nav에 `menu`(기본 `schoolExam`) 필드를 추가. `menu === 'schoolExam'`이면 기존 list/exam/student 레벨 렌더 유지.
  - `menu ∈ {daily,exam,counsel}`이면 `reportCenterBuildReportContextBar + reportCenterBuildMenuBody(menu, studentId)`를 본문으로 렌더.
  - 상단 4메뉴 active를 nav.menu로 반영(`reportCenterInternalMenuHtml`의 activeMenu 인자를 nav.menu로).
- `reportCenterInternalMenuHtml`(`report-center.js:1863`) 수정:
  - `daily/exam/counsel` onclick을 `openReportCenterMenu('<key>', '<studentId>')`로 교체(더 이상 `forceAdvanced`로 평면 모달 진입하지 않는다).
  - `schoolExam` onclick은 기존대로 list로 복귀.

### Task B-1 — 진입 라우팅에서 고급/평면 경로 제거 + 라벨 변경

- Modify: `apmath/js/report-center.js`
- `openReportCenterModal(studentId, activeTab, options)`:
  - `forceAdvanced` 분기와 `advancedMode()`로 평면 모달 여는 로직 제거. 항상 드릴다운 셸을 연다. `activeTab`이 daily/exam/counsel면 nav.menu에 반영해 인라인으로 렌더.
  - 하위 호환: 외부(학생상세 등)에서 `openReportCenterModal(sid,'exam')`을 부르면 학교시험/원내평가 규칙에 따라 적절한 화면으로 라우팅(아래 A-3와 연동).
- `reportCenterAdvancedToggleHtml`(`report-center.js:1844`):
  - 라벨 `고급 보기` → `상세 편집 도구`.
  - `onchange`에서 `openReportCenterModal(...)` 재호출 대신, 현재 nav를 보존하며 드릴다운을 다시 그리는 함수(`openReportCenterRefresh()` 등)를 호출.
- `reportCenterRenderStudioToolbar/Panel`의 advanced 게이팅은 **그대로 유지**한다.

### Task B-2 — 고급보기 정책 테스트 갱신

- Modify: `tests/report-center-advanced-policy.test.mjs`
- 유지: advanced on일 때 스튜디오 툴바에 `프리미엄 분석`/`편집`이 보이고, off일 때 안 보인다.
- 변경/삭제: `reportCenterBaseShell(...)`이 진입 경로라는 전제의 단언은 제거하거나, baseShell가 레거시로만 존재함을 반영. 라벨 문자열을 `상세 편집 도구`로 기대하도록 갱신.

### Task A-3 — 학생상세/외부 진입 라우팅 확인

- Modify: `apmath/js/student.js` (필요 시)
- 학생상세에서 리포트로 진입하는 경로(`openStudentReportOutputFromDetail`, `openReportCenterStudentReportBySession` 등 기존 함수)가 신 라우팅과 충돌하지 않는지 확인.
  - archive-backed 세션 → 기존 학교시험 L2 유지.
  - archive-less 세션/일반 리포트 → `openReportCenterMenu('exam', studentId)` 또는 기존 평가 리포트 흐름.
- 이 항목은 **동작 회귀 방지가 목적**이다. 기존 진입이 깨지지 않으면 추가 변경 최소화.

### Task C-1 — 대시보드 평균 전체화 (프론트)

- Modify: `apmath/js/report-center.js`
- 신규: `reportCenterGetCohortStatForSession(sessionId)`, `reportCenterGetGroupCohortSummary(group)` (2.3 참조).
- 반영:
  - `reportCenterBuildExamDashboard`의 "전체" 관련 수치와 `reportCenterBuildCohortRates`, 배치 헤더(`report-center.js:2251`)를 코호트 우선으로.
  - 라벨 배지 `학원 전체` / (fallback) `담당 반 기준`.
  - 반 카드는 `우리 반 평균` 라벨.
- 코호트 questionStats가 있으면 전체 응시 정답률을 그 값으로, 없으면 로컬 + fallback 라벨.

### Task C-2 (조건부) — 서버 코호트 보강

- **C-1 검증에서 school-exam 세션의 코호트가 대부분 채워지면 이 태스크는 스킵한다.**
- 채워지지 않으면 원인 규명:
  - `getReportCohortIdentity`가 school-exam 세션에서 identity를 못 만드는지(archive_file 공백/exam_date 형식), `getReportCohortStudentGrade`가 학년을 못 구하는지 확인.
  - 필요한 최소 보정만 `worker/index.js`에 적용하고, **커밋만 하고 배포는 원장 지시 대기**(메모: apmath 배포 토폴로지 — 커밋만으론 API 라이브 안 됨).
- 배포 전까지 프론트는 fallback 라벨로 안전하게 동작해야 한다.

### Task D-1 — UX 마감

- Modify: `apmath/js/report-center.js`
- "시험지 찾기" 버튼 숨김(주석 보존).
- 반/학생 선택 카드에 상태 배지 1~2개 추가(오답 미입력, 저장본 유무).
- 평균 라벨 배지 일관 적용.

---

## 4. Verification Commands

```bash
node --check apmath/js/report-center.js
node --check apmath/js/student.js
node tests/report-center-inline-report-entry.test.mjs
node tests/report-center-advanced-policy.test.mjs
node tests/report-center-shell.test.mjs
node tests/apmath-report-center-unified-entry.test.mjs
node tests/report-center-student-view.test.mjs
node tests/report-school-exam-counsel.test.mjs
node tools/run-tests.js
```

전역 표면/onclick 회귀가 있으면:

```bash
node tests/apmath-global-surface.test.js
node tests/apmath-onclick-defined.test.js
```

신규 전역 함수(`openReportCenterMenu`, `reportCenterBuildMenuBody`, `openReportCenterRefresh` 등)가 onclick에서 참조되면 surface/onclick fixture를 갱신한다.

### 브라우저 검수 흐름

1. 리포트 센터 진입 → 첫 화면 `학교시험 분석`(변화 없음).
2. 학생 미선택 상태로 `오늘/평가/상담` 클릭 → **토스트 없이** 학생 선택 화면.
3. 학생 선택 → 같은 셸 안에서 해당 리포트 본문 렌더, 상단 `선택: 이름 · 변경`.
4. `변경` → 다시 선택 화면.
5. 학교시험 분석 → 시험지 → 반/학생 흐름 정상(회귀 없음).
6. `상세 편집 도구` 토글 on/off → 스튜디오 편집/프리미엄 노출만 바뀌고 진입 UI는 항상 드릴다운.
7. 시험 대시보드에서 "전체 평균/전체 응시 정답률"이 `학원 전체` 라벨과 함께 apmath 전체 값(코호트 존재 시). 반 카드는 `우리 반 평균`.
8. 네트워크 탭에서 `initial-data` 응답의 `report_exam_cohort_stats`에 해당 세션 행이 있는지 확인 → C-2 필요 여부 판정.

불가 시 결과 문서에 명시:

```text
REAL BROWSER E2E: NOT VERIFIED
Reason:
```

---

## 5. PASS / FAIL

PASS:

- 학생 미선택 상태에서 오늘/평가/상담 클릭이 토스트로 튕기지 않고 인라인 학생 선택으로 이어진다.
- 학생 선택/학생 카드 진입 모두 같은 셸 안에서 리포트 본문이 열린다(양방향).
- 진입 라우팅에서 신/구 UI 전환이 사라지고 항상 드릴다운이다.
- `고급 보기` 라벨이 `상세 편집 도구`로 바뀌고, 이 토글은 편집/프리미엄 노출만 제어한다.
- 시험 대시보드의 "전체" 수치가 코호트 존재 시 apmath 전체 기준이며 라벨이 명확하다. 반 평균은 담당 반 기준 + 명확한 라벨.
- 학교시험 분석 드릴다운(시험→반→학생→일괄출력)이 회귀 없이 동작한다.
- 지정 테스트가 모두 통과한다.

FAIL:

- 오늘/평가/상담이 여전히 `학생 정보를 찾을 수 없습니다` 토스트로 튕긴다.
- 진입 시 구 평면 3탭 모달이 뜬다.
- 고급/상세 토글이 진입 UI 자체를 바꾼다.
- 학교시험 분석 흐름이 깨진다.
- "전체 평균"이 코호트가 있는데도 담당 학생만으로 계산된다.
- 신규 onclick 함수 미정의로 콘솔 에러.

---

---

## Task E — 학교시험 상세 리포트 출력물 레이아웃/정합성 (최우선: 2페이지 레이아웃)

> 배경: `reportCenterBuildSchoolExamDetailedPrintDocument`(`report-center.js:4536`)는 1페이지 요약 카드(`reportCenterBuildSchoolExamPrintSummaryPage` `:4470`) + 2페이지 학부모 텍스트(`reportCenterBuildSchoolExamDetailedParentReport` `:4254`)로 구성된다. 실측 결과 **두 페이지의 완성도가 크게 다르다.**

### E-0 문제 (실측)

- **[치명] 2페이지에 레이아웃이 없다.** 출력 모드에서 `.report-print-view .aprc-counsel-report`가 `padding:0; border:0; background:transparent`로 카드 스타일이 제거된다(`report-center.js:6359`). 섹션은 작은 회색 제목(11.5px, `:6366`) + 문단뿐이라 카드/구분선 없이 글자만 나열된다. 1페이지 카드 그리드(`.aprc-school-card-grid > section` 테두리 `#dbe3ef`·라운드·흰 배경, `:6522`)와 디자인 언어가 완전히 다르다.
- **[버그] "페이지 0"**: 화면 프리뷰에서 `.aprc-school-detail-document::after`의 `counter(page)`가 0으로 찍혀 러닝 푸터가 `AP수학 · 생성일 … · 페이지 0`으로 보인다(`report-center.js:7151`).
- **[버그·핵심] 시험명이 학원명으로 나옴 — 잘못된 필드 참조**: 아카이브 출제 시 **아카이브 파일명이 실제 시험 제목**이며, 반 시험 화면은 이를 `getClassroomExamArchiveDisplayTitle(archive_file)`로 올바르게 표기한다(`classroom-planner.js:194`, 우선순위 `getClassroomExamDisplayTitle` `:206` = archive 제목 → `exam_title` → 폴백). 그러나 **리포트 센터만 신뢰 불가한 `session.exam_title`을 그대로 쓴다**(`report-center.js:1911`, `:4494`, `:4508`). 이번 데이터는 OMR 저장 시 `exam_title`에 "AP수학학원"(학원명/플레이스홀더)이 들어가(`qr-omr.js:660`) 카드 `시험: AP수학학원`, 제목 `AP수학학원 분석 리포트`, 본문 `…AP수학학원에서 100점을 기록`으로 잘못 출력된다. **데이터 부재가 아니라 리포트 센터의 제목 해석 버그다.**
- **[라벨] 평균 스코프 미표기**: 카드 `평균 82점 기준`이 학원 전체(`overallAvg`=코호트)인데 라벨이 없어 오해 소지. Task C의 라벨 정책과 맞춘다.
- **[중복] 문구 반복**: "다음 단원 확장"이 1페이지 핵심진단·담임총평, 2페이지 학습방향·학부모님께에 3~4회 반복된다.
- **[점수바] 만점자 구분 불가**: `reportCenterBuildScoreBar`가 본인 점수를 축 최대로 잡아, 전체(82)/반(88) 두 바가 모두 꽉 차 동일하게 보인다.
- **[톤] 성취 불일치**: 만점 학생에게 `…흔들리지 않도록 준비하겠습니다` 같은 방어적 마무리가 어색.

### E-1 (최우선) 2페이지를 1페이지 디자인 시스템으로 통일

- Modify: `apmath/js/report-center.js`의 출력용 CSS(대략 `:6359-6366`)와 `reportCenterBuildSchoolExamDetailedParentReport` 마크업(`:4283-4306`).
- 요구:
  - 출력 모드에서 `.aprc-counsel-report`의 `border:0; background:transparent` 오버라이드를 제거하고, `.aprc-counsel-section`을 **1페이지 카드와 동일 토큰**(테두리 `#dbe3ef`, `border-radius:8px`, `padding:5mm`, 흰 배경, `break-inside:avoid`)의 카드로 만든다.
  - `.aprc-counsel-title`을 카드 `h2`급(14px, `#111827`, 하단 경계선 `1px #cbd5e1`)으로 승격한다.
  - `학부모님께` 섹션은 왼쪽 액센트 바(예: `border-left:3px solid #111827`)와 넉넉한 행간을 준 레터형 카드로 차별화한다.
  - 오답 문항 카드(`.aprc-parent-question-card`)는 카드 내부에서 정렬·간격을 정리한다.
  - 화면 프리뷰(비인쇄)와 실제 인쇄 모두에서 카드가 유지되어야 한다. 인쇄 시 카드가 페이지 경계에서 쪼개지지 않게 한다(메모: 리포트 PDF page-break 최우선).
- 검증: 출력 화면에서 2페이지가 1페이지와 같은 카드 톤을 가진다. `node --check` 및 시각 검수.

### E-2 러닝 푸터 "페이지 0" 삭제

- 근본 원인: `.aprc-school-detail-document::after`(`report-center.js:7150`, `@media print` 내부)가 `position:fixed` 가상요소에서 `counter(page)`를 사용한다. `counter(page)`는 `@page` 여백 박스에서만 정상 동작하므로 fixed 요소에서는 0으로 렌더 → 인쇄/PDF에서 "AP수학 · 생성일 … · 페이지 0"이 찍힌다. 의도된 콘텐츠가 아니라 버그다.
- 조치: **이 `::after` 러닝 푸터 규칙을 삭제한다.** 페이지 번호가 필요하면 별건으로 `@page { @bottom-center { content: ... } }` 방식으로 재구현하되, 이번 태스크에서는 제거만 한다.
- 검증: 인쇄 미리보기/PDF 저장에서 "페이지 0" 문구가 더 이상 나오지 않는다.

### E-3 시험명 해석 버그 수정 (핵심)

- 근본 원인: 리포트 센터가 `session.exam_title`을 직접 쓴다. 이 필드는 OMR 저장 시 임의 문자열(학원명 등)이 들어갈 수 있어 신뢰 불가하다. 실제 시험 제목은 **아카이브 파일명**이며 반 시험 화면은 이미 그것을 쓴다.
- 신규 helper `reportCenterResolveExamDisplayTitle(session)`:
  ```
  getClassroomExamArchiveDisplayTitle(session.archive_file || session.archiveFile)   // 아카이브 제목 우선
    || String(session.exam_title || '').trim()                                        // 다음 exam_title
    || '학교시험'                                                                      // 최후 폴백
  ```
  `getClassroomExamArchiveDisplayTitle`는 `classroom-planner.js:194`의 전역 함수이므로 report-center에서 직접 호출 가능(없을 경우를 대비해 `typeof` 가드).
- 적용 지점(전부 이 helper로 교체):
  - 시험 목록/허브 `title`: `report-center.js:1911`(`reportCenterBuildExamHubList`)
  - 시험 그룹 title: `reportCenterGetSchoolExamGroups` `:1379,1397`
  - 대시보드 헤더 `hub.title`: `:2611`
  - 카드 리포트 제목·`시험` 필드: `:4494`, `:4508`
  - 배치/텍스트 리포트 헤더 및 본문 위치어(`…에서 100점을 기록`): 학원명이 위치어로 들어가지 않도록 문구 소스도 이 helper 기준으로.
- 학원명("AP수학학원")은 `AP MATH REPORT` 브랜드/러닝 푸터에만 사용한다. `시험` 값·리포트 제목·본문 위치어에는 절대 넣지 않는다.
- 검증: `exam_title`이 "AP수학학원"이어도 archive_file이 있으면 리포트 제목/`시험` 필드가 아카이브 파일 제목으로 표기된다. 반 시험 화면(`getClassroomExamDisplayTitle`)과 리포트 센터의 시험명이 일치한다.
- 참고(별건, 이번 스코프 밖): OMR 입력에서 `exam_title`에 학원명이 저장되는 경로 자체는 별도 점검 대상. 이번 태스크는 표시(출력) 계층에서 아카이브 제목을 우선하는 것으로 사용자 체감 문제를 해결한다.

### E-4 평균 라벨(Task C 연동)

- 카드 `전체 평균 대비`/`반 평균 대비`와 mini 수치에 `학원 전체` / `우리 반` 라벨을 명시한다. 코호트 부재 시 `담당 반 기준(전체 집계 준비 중)`.

### E-5 (설계) 문구 중복 제거 · 점수바 · 성취별 톤

- 문구: 진단/방향/총평/학부모 문구를 한 소스에서 생성하고 페이지별로 배치만 다르게 해 "다음 단원 확장" 반복을 제거한다. 카드=한 줄 요약, 텍스트=근거·상세로 역할 분리.
- 점수바: 평균 대비를 `0~만점` 단일 축에 평균선 마커 + 내 점수 마커로 표현하거나, 만점/상위 구간에서는 바 대신 `전체 +18 / 반 +12` 배지로 대체해 전체(82)·반(88) 차이가 보이게 한다.
- 톤: 만점/상위/중위/하위 성취 구간별 문구 분기. 만점 학생에게 방어적 마무리를 넣지 않는다(메모: 리포트 문구 톤 — 학원이 책임지고 진행 강조).

### E-6 모든 리포트 카드 인라인 편집 통일

- 배경(실측): 편집 가능 여부가 리포트마다 다르다.
  - **상담 리포트 카드**(`reportCenterBuildSchoolExamCounselReport` `:4615`)만 `수정`/`저장`이 있다. editMode에서 `<textarea data-report-counsel-field>`로 바뀌고 `reportCenterSaveSchoolExamCounselReport`(`:4676`)가 학생별로 서버 저장한다. 고급 보기 없이 동작.
  - **상세 리포트**(`reportCenterBuildSchoolExamDetailedParentReport` `:4254` — 오답 문항 분석/앞으로의 학습 방향/학부모님께)와 **요약 카드**(`reportCenterBuildSchoolExamPrintSummaryPage` `:4470` — 핵심 진단/담임 총평)는 **직접 편집 불가**. AI 재생성/기본 복귀만 가능.
  - 결과: 선생님이 실제 출력하는 문서(요약+상세)는 못 고치고, 고칠 수 있는 상담 리포트는 별도 카드로 분리돼 혼란.
- 목표: **선생님이 화면에서 보는 모든 리포트 카드 문구를 그 자리에서 수정·저장**할 수 있게 한다. "보이는 카드 = 수정하는 카드".
- 구현:
  - 상담 리포트의 `data-report-*-field` + `수정/저장` 패턴을 **상세 리포트·요약 카드에도 확장**한다. 각 편집 필드: 요약 카드(핵심 진단, 담임 총평), 상세 리포트(앞으로의 학습 방향, 학부모님께; 오답 문항 분석은 문항 카드 특성상 텍스트 코멘트 편집 우선).
  - 저장은 상담과 동일하게 **학생별(archive_file + student_id) 서버 저장**(`reportCenterSyncStudentReportToServer`)로 통일하고, `report_type`을 분리(`school_exam_detail` 등)해 상담본과 충돌하지 않게 한다.
  - 우선순위 규칙 유지: 저장된 수정본 > 프리미엄 AI > 기본 뱅크. 저장본이 있으면 재렌더/출력/일괄출력에도 반영된다.
  - 편집 UI는 인쇄물에 나오지 않도록 `no-print`. 편집 버튼/툴바는 화면에서만.
  - 고급 보기(상세 편집 도구) 게이팅과의 관계: 기본 문구 수정은 고급 보기 없이 허용한다(상담과 동일). 고급 보기는 그래프/레이아웃 등 파워 도구에만.
- 검증: 요약·상세·상담 세 리포트 모두에서 문구를 고쳐 저장 → 재열람/출력/일괄출력에 반영되고, 다른 학생 문구를 오염시키지 않는다.

### E-7 학부모 리포트 오답 문항 수동 선별 (학생별)

- 니즈(원장 확정): 학생 실제 오답이 5개여도 학부모에게는 그중 일부(예: 2개)만 보이고 싶다. 나머지는 리포트에서 뺀다. **점수를 바꾸는 게 아니라 표시할 오답 문항만 선생님이 고른다.**
- 현재: `reportCenterSelectParentReportWrongRows(wrongRows, 5)`(`report-center.js:4266`)가 자동으로 최대 5개를 고르고, `omittedWrongCount`로 "나머지 N개 문항은 학원 수업에서 차례로 확인하겠습니다."를 붙인다(`:4294`). 선생님이 개입할 수 없다.
- 구현:
  - 학생 리포트 편집 UI(E-6과 통합)에 **학생의 전체 오답 문항 목록을 체크박스로** 나열한다. 기본 선택은 현재 자동 선별(상위 N개) 또는 전체. 선생님이 체크 해제하면 학부모 리포트 오답 카드에서 제외된다.
  - 저장: 학생별(archive_file + student_id)로 `report_type: 'school_exam_wrong_selection'`, `fields_json: { includedQuestionNos: ["3","7"] }` 형태로 `reportCenterSyncStudentReportToServer`에 영속. 상담/상세 저장본과 충돌하지 않게 타입 분리.
  - 적용: `reportCenterSelectParentReportWrongRows`(및 상세/요약/배치/출력 빌더)가 **저장된 선택이 있으면 그 문항만** 오답 카드로 렌더한다. 저장된 선택이 없으면 기존 자동 동작 유지.
  - "나머지 N개 문항은…" 자동 문구: **수동 선택이 있을 때는 기본적으로 표기하지 않는다**(숨긴 문항 존재를 학부모에게 광고하지 않기 위함). 필요 시 켤 수 있는 옵션으로 둔다.
- **점수·정답률·평균·"오답 수"·문항 분석표는 실제값을 유지한다.** 선별은 오직 학부모용 오답 문항 카드 표시에만 영향을 준다. 채점/집계 로직을 절대 바꾸지 않는다. (원장 확인: 실제 5문항 중 2개만 보여도 무방.)
- 범위: 학생이 실제로 틀린 문항 안에서 넣고/빼기만 한다. 학생이 틀리지 않은 문항을 오답으로 "추가"하는 것은 스코프 밖(사실 왜곡 방지).

#### E-7b 오답 카드 요소별 표시 토글 (클릭 on/off)

- 니즈(원장 확정): 카드 전체 포함/제외뿐 아니라, **카드 안에서 요소별로** 켜고 끄고 싶다. 예: "문항 원문(문제)은 숨기고 해석·코멘트만 보이게". 클릭 형태의 on/off.
- 현재 카드 구조(`reportCenterBuildParentWrongQuestionCard` `report-center.js:3872`):
  - ① 헤더(문항 번호·단원·메타: 유형/배점/난도/정답률)
  - ② 해석·코멘트(`aprc-parent-question-comment`, 항상 노출)
  - ③ 문항 원문(`aprc-parent-question-original`: 문제 richContent + 이미지 + 선택지 + 정답)
  - 빌더에 이미 `showContent/showAnswer/showSolution` 옵션이 있으나 호출부에서 하드코딩(`:2917-2919`, `:4270`)돼 선생님이 못 바꾼다.
- 구현:
  - 편집 UI에서 각 오답 문항마다 **클릭 토글 칩**을 제공한다: `[카드 포함] [문항 원문] [정답] [해석·코멘트] [정답률/메타]`. 클릭으로 on/off.
  - 저장: E-7의 `school_exam_wrong_selection`을 문항별 구조로 확장.
    ```json
    { "questions": {
        "3": { "include": true,  "showContent": false, "showAnswer": false, "showComment": true,  "showMeta": true },
        "5": { "include": false },
        "7": { "include": true,  "showContent": true,  "showAnswer": false, "showComment": true }
    } }
    ```
  - 적용: 상세/요약/배치/출력 빌더가 문항별 저장 옵션을 `reportCenterBuildParentWrongQuestionCard(row, detail, { showContent, showAnswer, showComment, showMeta })`로 전달. `include:false`면 카드 자체를 제외. 저장 없으면 기존 기본값(코멘트+원문 노출, 정답 숨김) 유지.
  - 해석·코멘트만 보이는 조합(`showContent:false, showComment:true`)이 깔끔하게 렌더되도록 `aprc-parent-question-*` 레이아웃을 점검한다(빈 원문 영역이 남지 않게).
  - 토글 UI는 `no-print`. 인쇄물에는 최종 선택 결과만 나온다.
- 검증: 한 카드에서 문항 원문 off·해석 on으로 저장 → 학부모 리포트/출력에 그 카드가 해석만 나온다. 문항별로 서로 다른 조합이 독립 적용된다. 저장 없으면 기존 기본값.

- 통합 검증(E-7 전체): 오답 5개 학생에서 2개만 포함 + 그중 1개는 해석만 표시로 저장 → 학부모 상세 리포트/출력/일괄출력에 정확히 반영되고 점수·정답률은 그대로. 다른 학생 선택을 오염시키지 않는다. 선택 없으면 기존 자동 동작.

### E 검증

```bash
node --check apmath/js/report-center.js
node tests/report-school-exam-counsel.test.mjs
node tests/report-center-student-view.test.mjs
```

시각 검수: 상세 리포트 출력 → 1·2페이지가 동일 카드 톤 / "페이지 0" 미노출 / 시험명이 학원명이 아님 / 평균 라벨 명확 / 만점 학생 문구 자연스러움.

### E PASS/FAIL

- PASS: 2페이지가 1페이지와 같은 카드 레이아웃을 가진다. "페이지 0"이 사라진다. 시험명이 학원명으로 표기되지 않는다. 평균에 전체/반 라벨이 붙는다. 카드가 페이지 경계에서 쪼개지지 않는다.
- FAIL: 2페이지가 여전히 테두리 없는 텍스트 나열이다. 인쇄 시 카드가 잘린다. 시험명에 학원명이 그대로 나온다.

---

---

## Task F — 학교시험 분석 시험지 목록: 최근 1개월 학년 그룹 + 과거 검색 + 심플 카드

> 니즈(원장, 목업 v2로 확정): 시험지가 너무 많이 쌓여 보기 나쁘다. **기본은 최근 1개월만 학년별로**, 과거는 검색으로 찾는다. 상태 배지(문항분석/오답입력완료)는 빼고 카드도 심플하게. 응시 수는 학원 전체 기준으로.

### F-0 현재 상태 (실측)

- 데이터: `reportCenterBuildExamHubList()`(`report-center.js:1961`)가 시험지(archive)별 그룹 배열 생성. 각 항목에 `grade`(`reportCenterGetSessionGrade`→`normalizeReportGrade`, `report-center.js:128`), `takers`, `latestDate`, `school`, `reviewCount/blueprintCount`, `wrongEntered` 포함.
- 렌더: `reportCenterRenderExamHubList(studentId)`(`report-center.js:2005`)가 `.aprc-exam-grid` 하나에 전 시험지를 `latestDate desc → title` 평면 렌더 + 카드에 `문항분석/응시/반/오답입력` 칩. 호출부는 list 레벨 한 곳.
- `takers`는 `state.db.exam_sessions` 집계 = **담당 선생님 학생만**(비-admin). 학원 전체 수는 Task C의 `reportCenterGetGroupCohortSummary(group).gradeExamCount`로 얻을 수 있음.
- 지금 "시험지 찾기" 버튼은 주석 처리(Task D, `report-center.js:3314`)됨 → 이번에 **검색 기능으로 부활**시킨다.

### F-1 기본 화면 = 최근 1개월 학년 그룹

- 기간 필터: `exam_date`(없으면 `created_at`) 기준 **오늘로부터 30일 이내** 시험지만 기본 노출.
- 학년 그룹핑:
  - 신규 helper `reportCenterGradeRank(grade)` — 순서 `중1<중2<중3<고1<고2<고3<기타/미지정(맨 뒤)`. 미지정/비정규는 최하위, 그 안에서 라벨 가나다순.
  - 최근 목록을 `grade`로 그룹핑, `reportCenterGradeRank` 순 섹션. 각 섹션 헤더 `중1 · N개`(라벨+시험지 수), 미지정은 `학년 미지정`.
  - 그룹 내부 정렬 `latestDate desc → title`.
- 학년 필터 칩(헤더 상단): `전체 N · 중1 n · 중3 n · 고2 n`(최근 1개월 기준 개수). 칩 클릭 시 해당 학년만 노출(클라이언트 필터, 재조회 없음). 기본 `전체` 활성.
- 상단 표시 `최근 1개월` 배지 + 하단 안내: `1개월 이전 시험지 N개는 검색으로 찾을 수 있습니다.`(과거 개수 노출).

### F-2 카드 심플화 (상태 배지 제거)

- 카드에서 **`문항분석`, `오답입력`, `반` 칩과 모든 상태 배지를 제거**한다. (문항분석은 선택적 작업이라 "대기"로 압박 신호를 주지 않는다.)
- 카드 = `시험명`(굵게) + 한 줄 메타 `학교 · 날짜 · 응시 N` + 우측 `›`. 학년은 섹션 헤더에 있으므로 카드에서 제외.
- **응시 N = 학원 전체**: `reportCenterGetGroupCohortSummary(group).gradeExamCount`(코호트) 우선, 없으면 로컬 `takers`로 fallback. 라벨/툴팁으로 `학원 전체` 맥락 제공. (드릴다운은 여전히 담당 학생만 열리는 점은 정상 — 카드 수와 다를 수 있음.)
- onclick(시험 대시보드 진입)·`data-archive-file`은 그대로 유지.

### F-3 과거 검색 (죽은 "시험지 찾기" 부활)

- 검색 UI(목록 상단): `학교·시험명` 키워드 입력 + `연도` 셀렉트 + `월` 셀렉트.
- 검색 활성(키워드/연도/월 중 하나라도 지정) 시:
  - **30일 제한 해제**, 전체 이력 대상으로 검색.
  - 결과는 **학년이 아니라 연/월로 그룹핑**(최신 연·월 우선). 이유: 2027 학년 롤오버로 옛 세션의 `reportCenterGetSessionGrade`(현재 학생 학년 기반)가 어긋날 수 있어, 과거는 날짜 기준이 안전.
  - 헤더 `검색 결과 N개` + `검색 초기화` 버튼(누르면 최근 1개월 기본 화면 복귀).
  - 결과 없음: `조건에 맞는 시험지가 없습니다.`
- 연도/월 옵션은 실제 세션의 `exam_date`에서 동적으로 생성.

### F-4 구현 메모

- 주 변경: `reportCenterRenderExamHubList`를 (a) 최근-그룹 렌더 (b) 검색-결과 렌더로 분기. 검색 상태는 `window.AP_REPORT_HUB_SEARCH = { keyword, year, month }` 같은 경량 상태로 보관하고, 입력/칩 변경 시 `reportCenterRenderExamHubList` 재호출(현재 드릴다운 셸 재렌더 방식과 동일).
- `reportCenterBuildExamHubList()`에 `group.sessions`(또는 각 그룹의 세션 배열)를 노출해 코호트 응시수·검색 필터가 세션 단위로 동작하게 한다(현재는 집계값만 반환).
- 새 전역 CSS 남발 금지, 기존 `.aprc-*`·다크모드 토큰(`var(--text)`, `var(--secondary)`, `var(--border)`) 재사용. 카드 단순화는 기존 `.aprc-exam-card` 변형 또는 신규 경량 클래스.
- 접기(아코디언)는 이번 스코프 제외(최근 1개월이라 길지 않음).

### F 검증

- 신규 테스트(hub 전용 `.mjs` 권장):
  - 최근(오늘±) 세션과 40일 전 세션을 섞어 넣고 기본 렌더에 **최근 것만** 나오고 과거 안내문에 이전 개수가 표기되는지.
  - 최근분이 학년 헤더 `중1→중3→고2` 순으로, 각 헤더 아래 해당 학년만.
  - 카드에 `문항분석/오답입력/반` 칩이 **없고** `응시 N`이 코호트(`gradeExamCount`) 기반인지(코호트 스텁 주입 시 그 값이 나오는지).
  - 검색 상태(연도/월/키워드) 설정 시 30일 밖 과거가 나오고 연/월 그룹으로 묶이는지.
- `node --check apmath/js/report-center.js`, 리포트센터 지정 테스트·surface/onclick guard 유지.

### F PASS/FAIL

- PASS: 기본 화면이 최근 1개월 시험지를 학년 헤더로 구분(중1→고3→미지정), 카드는 `제목·학교·날짜·응시(학원 전체)`만의 심플형, 상태 배지 없음. 과거는 연/월·키워드 검색으로 조회. 카드 진입 회귀 없음.
- FAIL: 과거 시험지가 기본 화면에 계속 쌓여 보인다. 문항분석/오답입력완료 배지가 남아 있다. 응시 수가 담당 학생 기준이다. 검색이 학년으로만 묶여 롤오버 오표기가 노출된다. 카드 진입이 깨진다.

### F Out of scope

- 학교별 2차 그룹핑, 접기 아코디언, 기간(1개월) 사용자 설정 UI, 서버측 검색/페이지네이션 — 이번은 클라이언트 필터/검색까지만.
- 응시수 학원 전체화가 코호트 데이터에 의존하는 부분은 Task C의 데이터 검증(코호트 충전 여부)에 종속. 코호트 미존재 시 로컬 fallback으로 안전 동작.

---

## 6. Out Of Scope

- DB 스키마 변경, 신규 API 엔드포인트 추가(C-2의 최소 보정 제외).
- 워커 배포(원장 지시 대기).
- 리포트 문구/AI 품질 개선.
- 카톡 일괄 발송 실제 전송.
- 리포트센터 파일 분할 리팩터.
- "시험지 찾기" 기능화.

## 7. Notes For Workers

- `report-center.js`는 7,500줄 대형 파일이다. helper 추가와 본문 빌더 추출을 우선하고, 광범위 리팩터는 하지 않는다.
- 기존 `.aprc-*` 클래스/톤과 inline style 패턴을 재사용한다. 새 전역 CSS 남발 금지.
- 항목별 커밋을 분리해 검수와 롤백을 쉽게 한다.
- 각 항목 완료 시 어떤 파일/함수가 바뀌었는지, 코호트 데이터 유무 판정 결과(C 관련)를 결과 보고서에 명시한다.
