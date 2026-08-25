# EIE Grade Ledger Screen Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** EIE 대시보드에는 `출석부` 옆에 같은 형태의 `성적표` 클릭 카드 1개만 두고, 클릭 후 들어가는 성적표 화면은 `학교성적`과 `원내평가`를 1차 탭으로 분리해 정리한다.

**Architecture:** 대시보드는 navigation hub 역할만 한다. `성적표` 카드를 클릭하면 `grades` route의 `EieGradeLedgerView`가 열리고, 첫 화면은 성적 입력 도구가 된다. `학교성적` 탭은 AP MATH와 거의 같은 `중등/고등 → 학년/반/정렬 → 1학기/2학기 중간·기말 입력표` 구조를 사용한다. `원내평가` 탭은 EIE 선생님이 시험을 직접 추가한 뒤 필요한 시험만 성적표에 표시하는 구조로 분리하되, 디자인/UX는 학교성적 탭과 다르게 만들지 않고 같은 표, 같은 필터, 같은 저장 흐름을 사용한다.

**Tech Stack:** Browser global JS views, `EieRouter`, `EieApi`, Worker API, CSS in `eie/css/eie.css`, Node contract tests.

---

## Design Direction

### 대시보드 역할

- 대시보드는 입력 화면이 아니다.
- 대시보드에는 `시간표`, `클래스룸`, `출석부`와 같은 quick card 중 하나로 `성적표` 카드만 둔다.
- 대시보드에서 반별 성적 상태 목록, 입력표, 점수 input, 시험 추가 패널을 보여주지 않는다.

### 성적표 화면 역할

- 성적표 화면은 EIE 선생님이 수업 운영 중 사용하는 업무 도구다.
- 첫 화면은 카드식 랜딩이 아니라 바로 입력 가능한 도구 화면이어야 한다.
- 학교성적은 AP MATH와 거의 같은 구조로 둔다. 사용자가 기대한 화면은 학교성적 입력표가 AP MATH처럼 학기/중간/기말 중심으로 정리되는 것이다.
- 원내평가는 학교성적 표와 섞지 않고 별도 탭으로 둔다. 이 탭 안에서 선생님이 시험을 추가하고, 필요한 시험만 표시/입력한다.
- 원내평가는 기능 구조만 EIE용으로 다르고, 디자인은 학교성적과 달라지면 안 된다. 같은 상단 필터, 같은 표 스타일, 같은 입력칸, 같은 저장 버튼 경험을 유지한다.

### EIE 화면 구조

성적표 route는 아래 구조를 갖는다.

```text
성적표
└─ 상단 작업바
   ├─ 제목: 성적표
   ├─ 현재 컨텍스트: 담당 선생님 / 선택 반 / 연월
   ├─ 연도 또는 월 선택
   └─ 전체 저장

└─ 1차 탭
   ├─ 학교성적
   │  ├─ AP MATH와 거의 같은 구조
   │  ├─ 중등 / 고등 전환
   │  ├─ 학년 / 반 / 정렬 필터
   │  └─ 1학기 중간·기말 / 2학기 중간·기말 입력표
   └─ 원내평가
      ├─ 학교성적과 같은 디자인/UX
      ├─ EIE 전용 데이터 구조
      ├─ 반 / 월 필터
      ├─ 시험 추가
      ├─ 시험 표시 여부 선택
      └─ 선택된 시험만 입력표에 표시

└─ 필터바
   ├─ 학교성적: 중등/고등, 학년, 반, 정렬
   └─ 원내평가: 반, 월, 시험 추가, 표시 시험 선택

└─ 입력표
   ├─ 학생명 sticky
   ├─ 헤더 sticky
   ├─ 가로 스크롤
   └─ 반평균/저장 상태
```

### UI 톤

- 과한 마케팅/랜딩 페이지 금지.
- 대시보드 카드 안에 대형 입력표 금지.
- 중첩 카드 금지.
- 학교성적 입력표는 AP MATH 화면과 거의 같은 정보 구조를 유지한다.
- 원내평가는 EIE 운영 흐름에 맞는 별도 탭 구조로 만들되, 시각 디자인과 사용감은 학교성적 탭과 동일하게 유지한다.
- 버튼/필터/저장 상태가 한눈에 들어와야 한다.

---

## File Structure

- Modify: `eie/js/views/eie-teacher.js`
  - 대시보드에서 펼쳐진 성적 입력 UI를 제거한다.
  - quick card 줄에 `성적표` 클릭 카드 1개를 추가한다.
- Modify: `eie/js/views/eie-grade-ledger.js`
  - 독립 성적표 화면의 구조를 EIE용으로 재정리한다.
  - 1차 탭을 `학교성적`과 `원내평가`로 나눈다.
  - `학교성적` 탭은 AP MATH와 거의 같은 학기/중간/기말 입력표 구조를 렌더링한다.
  - `원내평가` 탭은 시험 추가, 시험 표시 선택, 점수 입력표를 렌더링하되 학교성적 탭과 같은 표/필터/저장 UX를 사용한다.
- Modify: `eie/css/eie.css`
  - EIE 디자인 토큰 기반으로 성적표 화면 레이아웃을 정리한다.
- Modify: `tests/eie-grade-ledger-port.test.js`
  - 대시보드 card-only, 독립 route, 학교성적/원내평가 탭 분리, 학교성적 AP MATH식 학기 헤더, 원내평가 시험 선택 구조, 입력 방식 제한, sticky table을 검증한다.
- Modify: `CODEX_RESULT2.md`
  - 구현/미확인 결과를 기록한다.

---

### Task 1: Test The Dashboard Must Be Card-Only

**Files:**
- Modify: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Add dashboard card-only assertions**

```js
assert(teacher.includes('openGradeLedger'), 'teacher dashboard should expose grade ledger card action');
assert(teacher.includes('성적표'), 'teacher dashboard should label the card 성적표');
assert(!teacher.includes('renderGradeInputCard'), 'teacher dashboard should not render expanded grade input/status card');
assert(!teacher.includes('이번 달 원내평가'), 'teacher dashboard should not show expanded academy grade status');
assert(!teacher.includes('학교성적</strong>'), 'teacher dashboard should not show expanded school grade status');
assert(!teacher.includes('eie-teacher-grade-row'), 'teacher dashboard should not render per-class grade rows');
assert(!teacher.includes('eie-grade-inp'), 'teacher dashboard should not contain grade inputs');
```

- [ ] **Step 2: Add grade screen tab and detail-structure assertions**

```js
assert(ledger.includes('학교성적'), 'grade ledger should expose 학교성적 tab');
assert(ledger.includes('원내평가'), 'grade ledger should expose 원내평가 tab');
assert(ledger.includes('1학기'), 'school grade tab should keep AP MATH-style first semester group');
assert(ledger.includes('2학기'), 'school grade tab should keep AP MATH-style second semester group');
assert(ledger.includes('중간'), 'school grade tab should keep midterm columns');
assert(ledger.includes('기말'), 'school grade tab should keep final exam columns');
assert(ledger.includes('시험 추가'), 'academy tab should allow teachers to add tests');
assert(ledger.includes('toggleTestVisible'), 'academy tab should allow choosing which tests are shown');
```

- [ ] **Step 3: Run and verify failure if expanded UI still exists**

Run:

```powershell
node tests/eie-grade-ledger-port.test.js
```

Expected before implementation: FAIL if dashboard still contains expanded grade-card UI or if the grade screen does not separate school/academy details.

---

### Task 2: Replace Dashboard Grade Area With One Quick Card

**Files:**
- Modify: `eie/js/views/eie-teacher.js`

- [ ] **Step 1: Remove expanded grade card render path**

Remove this from dashboard output:

```js
+ renderGradeInputCard()
```

Remove the `renderGradeInputCard()` helper if it is no longer used.

- [ ] **Step 2: Add `성적표` beside `출석부` in shortcut row**

Update `renderShortcutRow()`:

```js
function renderShortcutRow() {
    return '<div class="eie-teacher-quick-cards eie-p-chip-row">'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openTimetable()">시간표</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-save" type="button" onclick="EieTeacherView.openClassroomList()">클래스룸</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openAttendanceLedger()">출석부</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openGradeLedger()">성적표</button>'
        + '</div>';
}
```

- [ ] **Step 3: Make `openGradeLedger()` open standalone grades route**

```js
openGradeLedger: function () {
    if (window.EieGradeLedgerView && typeof EieGradeLedgerView.openLedger === 'function') {
        EieGradeLedgerView.openLedger({
            classId: '',
            mode: 'school',
            teacherName: _teacherName,
            monthKey: new Date().toLocaleDateString('sv-SE').slice(0, 7)
        });
        return;
    }
    if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('grades');
}
```

- [ ] **Step 4: Verify**

Run:

```powershell
node --check eie/js/views/eie-teacher.js
node tests/eie-grade-ledger-port.test.js
node tests/eie-teacher-classroom-panel-route.test.js
```

Expected: all PASS.

---

### Task 3: Restructure The Grade Ledger View For EIE

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`

- [ ] **Step 1: Split render helpers**

Create these helpers if missing:

```js
function renderLedgerHeader() {}
function renderLedgerContextBar() {}
function renderPrimaryTabs() {}
function renderSchoolFilterBar() {}
function renderSchoolGradeTable() {}
function renderAcademyFilterBar() {}
function renderAcademyTestPicker() {}
function renderAcademyGradeTable() {}
function renderLedgerSaveBar(dirtyCount) {}
```

- [ ] **Step 2: Make top-level render read like EIE screen structure**

```js
async function render() {
    await loadFoundation();
    return '<section id="eie-grade-main" class="eie-grade-ledger eie-v2-screen">'
        + '<div class="eie-panel eie-p-panel">'
        + renderLedgerHeader()
        + renderLedgerContextBar()
        + renderPrimaryTabs()
        + (_error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '')
        + (_mode === 'academy' ? renderAcademy() : renderSchool())
        + '</div>'
        + '</section>';
}
```

- [ ] **Step 3: Primary tabs must separate school grades and academy evaluations**

```js
function renderPrimaryTabs() {
    return '<div class="eie-grade-primary-tabs" role="tablist" aria-label="성적표 구분">'
        + '<button type="button" role="tab" class="' + (_mode === 'school' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\\'school\\')">학교성적</button>'
        + '<button type="button" role="tab" class="' + (_mode === 'academy' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\\'academy\\')">원내평가</button>'
        + '</div>';
}
```

- [ ] **Step 4: Header must be EIE work-tool style**

```js
function renderLedgerHeader() {
    return '<div class="eie-grade-head">'
        + '<div><h1 class="eie-grade-title">성적표</h1><p class="eie-grade-subtitle">담당 반 성적을 입력하고 저장합니다.</p></div>'
        + '<div class="eie-grade-head-actions">'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setYear(this.value)">' + yearOptions() + '</select>'
        + '<button type="button" id="eie-grade-save-btn" class="eie-primary-button" onclick="EieGradeLedgerView.saveAll()" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '전체 저장') + '</button>'
        + '</div>'
        + '</div>';
}
```

- [ ] **Step 5: Context bar must be compact**

```js
function renderLedgerContextBar() {
    var selected = getSelectedCell();
    return '<div class="eie-grade-context eie-p-card">'
        + '<span>담당 선생님</span><strong>' + esc(_teacherName || '선생님') + '</strong>'
        + '<span>선택 반</span><strong>' + esc(selected ? classNameOfCell(selected) : '전체 반') + '</strong>'
        + '<span>입력 월</span><strong>' + esc(_monthKey || todayMonthKey()) + '</strong>'
        + '</div>';
}
```

- [ ] **Step 6: Run syntax**

Run:

```powershell
node --check eie/js/views/eie-grade-ledger.js
```

Expected: exit code 0.

---

### Task 4: Build School Grades Like AP MATH And Academy Evaluations With The Same UI

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`

- [ ] **Step 1: School tab should keep the AP MATH-like structure**

School filters should stay close to the AP MATH school grade screen:

```js
function renderSchoolFilterBar() {
    var grades = _schoolSection === 'high' ? ['고1', '고2', '고3'] : ['중1', '중2', '중3'];
    return '<div class="eie-grade-filterbar">'
        + '<div class="eie-grade-section-tabs">'
        + '<button type="button" class="' + (_schoolSection === 'middle' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setSchoolSection(\\'middle\\')">중등</button>'
        + '<button type="button" class="' + (_schoolSection === 'high' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setSchoolSection(\\'high\\')">고등</button>'
        + '</div>'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setGradeTab(this.value)"><option value="">전체</option>' + gradeOptionsHtml + '</select>'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setClassId(this.value)">' + classOptions() + '</select>'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setSort(this.value)"><option value="default">기본</option><option value="score-desc">점수 높은 순</option></select>'
        + '</div>';
}
```

- [ ] **Step 2: School grade table should expose semester/exam groups**

The school table header must keep the AP MATH-style grouping:

```js
function renderSchoolGradeHeader() {
    return '<thead>'
        + '<tr>'
        + '<th rowspan="2">학년</th>'
        + '<th rowspan="2">반</th>'
        + '<th rowspan="2">이름</th>'
        + '<th colspan="2">1학기</th>'
        + '<th colspan="2">2학기</th>'
        + '</tr>'
        + '<tr>'
        + '<th>중간</th>'
        + '<th>기말</th>'
        + '<th>중간</th>'
        + '<th>기말</th>'
        + '</tr>'
        + '</thead>';
}
```

- [ ] **Step 3: Academy filters must reuse the school grade control style**

Academy filters should not show an all-class editable table, but the controls must look and behave like the school grade filters:

```js
function renderAcademyFilterBar() {
    return '<div class="eie-grade-filterbar">'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setClassId(this.value)">' + classOptions() + '</select>'
        + '<input class="eie-grade-ctrl" type="month" value="' + esc(_monthKey || todayMonthKey()) + '" onchange="EieGradeLedgerView.setMonth(this.value)">'
        + '<button type="button" class="eie-secondary-button" onclick="EieGradeLedgerView.toggleTestPanel()">시험 추가</button>'
        + '</div>';
}
```

- [ ] **Step 4: Academy tab must let teachers choose which tests appear without changing the visual language**

Only selected tests should appear as columns in the academy table. The picker should sit in the same control area as the school filters, not as a visually unrelated card or dashboard widget:

```js
function renderAcademyTestPicker() {
    return '<div class="eie-academy-test-picker">'
        + activeTests().map(function (test) {
            return '<label class="eie-academy-test-chip">'
                + '<input type="checkbox" ' + (test.visible !== false ? 'checked' : '') + ' onchange="EieGradeLedgerView.toggleTestVisible(\\'' + escAttr(test.id) + '\\', this.checked)">'
                + '<span>' + esc(test.name) + '</span>'
                + '</label>';
        }).join('')
        + '</div>';
}
```

- [ ] **Step 5: Ensure academy all-class notice remains**

Keep:

```js
if (!_classId) {
    return renderAcademyFilterBar()
        + '<div class="eie-empty-box">원내평가는 반을 선택한 뒤 입력할 수 있습니다.</div>';
}
```

---

### Task 5: CSS For One Shared AP MATH-Like Grade UI

**Files:**
- Modify: `eie/css/eie.css`

- [ ] **Step 1: Screen shell**

```css
.eie-grade-ledger .eie-panel {
    width: min(100%, 980px);
    margin: 0 auto;
    padding: 22px 18px;
}
```

- [ ] **Step 2: Header and context**

```css
.eie-grade-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 12px;
}

.eie-grade-subtitle {
    margin: 6px 0 0;
    color: var(--eie-muted);
    font-size: 13px;
    font-weight: 700;
}

.eie-grade-context {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto 1fr;
    gap: 8px 10px;
    align-items: center;
    margin-bottom: 12px;
}
```

- [ ] **Step 3: Filter and tabs**

```css
.eie-grade-primary-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
}

.eie-grade-filterbar {
    display: grid;
    grid-template-columns: minmax(160px, 220px) minmax(180px, 1fr) minmax(160px, 220px);
    gap: 8px;
    margin-bottom: 10px;
}

.eie-academy-test-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
}

.eie-academy-test-chip {
    min-height: 36px;
    border: 1px solid var(--eie-border);
    border-radius: 10px;
    background: var(--eie-surface);
}
```

Do not introduce a separate academy-only visual system. The `원내평가` tab may add test selection controls, but it must reuse the same spacing, borders, input sizing, button hierarchy, table header style, sticky columns, and savebar behavior as `학교성적`.

- [ ] **Step 4: Table**

```css
.eie-grade-table-wrap {
    max-height: calc(100vh - 310px);
    overflow: auto;
    border: 1px solid var(--eie-border);
    border-radius: 12px;
    background: var(--eie-surface);
}
```

- [ ] **Step 5: Mobile**

```css
@media (max-width: 720px) {
    .eie-grade-head,
    .eie-grade-head-actions {
        align-items: stretch;
        flex-direction: column;
    }

    .eie-grade-context,
    .eie-grade-filterbar {
        grid-template-columns: 1fr;
    }
}
```

---

### Task 6: Preserve Existing Grade Logic

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`
- Test: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Do not expand input 방식**

Keep only:

```html
<option value="score">점수</option>
<option value="fraction">점수/만점</option>
<option value="memo">메모</option>
```

- [ ] **Step 2: Preserve payload restore and upsert contracts**

Do not remove tests for:

```js
assert(html.includes('value="88"'), 'academy table should restore score from payload_json.test_id');
assert(!html.includes('eie-academy-inp-'), 'academy all-class mode should not render editable score inputs');
```

- [ ] **Step 3: Verify**

Run:

```powershell
node tests/eie-grade-ledger-port.test.js
```

Expected: PASS.

---

### Task 7: Final Verification And Report

**Files:**
- Modify: `CODEX_RESULT2.md`

- [ ] **Step 1: Run syntax checks**

```powershell
node --check eie/js/views/eie-teacher.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-students.js
node --check eie/js/views/eie-grade-ledger.js
node --check eie/js/eie-api.js
node --check workers/wangji-eie-worker/routes/eie.js
```

Expected: all exit code 0.

- [ ] **Step 2: Run regression tests**

```powershell
node tests/eie-students-click-handlers.test.js
node tests/eie-teacher-classroom-panel-route.test.js
node tests/eie-classroom-entry-api.test.js
node tests/eie-exam-records-mvp.test.js
node tests/eie-grade-ledger-port.test.js
```

Expected: all PASS.

- [ ] **Step 3: Append report**

```markdown
## 대시보드 성적표 분리 및 EIE형 화면 재설계 결과

### 수정 파일

### 대시보드 정리 결과

### 성적표 독립 화면 결과

### EIE 화면 구조 반영

### 테스트 결과

### 브라우저 확인 결과

### 미확인 항목
```

- [ ] **Step 4: No commit or push**

```powershell
git status --short
```

Expected: changes are visible, but no commit or push is made.

---

## Self-Review

- Spec coverage: 대시보드 card-only, 출석부 옆 성적표 카드, 독립 route, `학교성적`/`원내평가` 1차 탭, AP MATH식 학교성적 구조, 학교성적과 같은 디자인의 원내평가 시험 추가/표시 구조, 기존 저장 로직 유지, 입력 방식 제한을 모두 포함한다.
- Scope guard: 원장 통계, 그래프, AI 리포트, 클래스룸 대형 입력폼, 학생 상세 전면 개편은 포함하지 않는다.
- Design guard: 학교성적은 AP MATH와 거의 같은 구조를 유지하고, 원내평가는 별도 탭으로 분리하되 학교성적과 다른 디자인 시스템처럼 보이게 만들지 않는다.
- Testability: 대시보드 분리와 독립 성적표 구조는 `tests/eie-grade-ledger-port.test.js`로 검증한다.
