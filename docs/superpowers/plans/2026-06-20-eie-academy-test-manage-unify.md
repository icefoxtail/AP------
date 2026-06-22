# EIE 원내평가 "시험 관리" 통합 지시서

> **For agentic workers (Codex):** 이 문서는 단독 실행 가능한 세부 지시서다. 아래 작업을 순서대로 구현하라. 체크박스(`- [ ]`)로 진행을 추적한다. 작성/검수자는 별도이며, 구현 완료 후 검수를 받는다.

**Goal:** EIE 성적표 → `원내평가` 탭에서 시험을 다루는 진입점이 `+ 시험 추가`(컨트롤 행)와 `시험 고치기`(이번 달 시험 헤더) 둘로 흩어져 의미가 겹치고 사용자가 혼란스럽다. 이를 **단일 `시험 관리` 토글**로 통합하되, **절대 빽빽한 패널로 만들지 않는다.** 데이터 계층(저장 포맷, API)은 바꾸지 않는다.

**대상 파일:**
- `eie/js/views/eie-grade-ledger.js` (핵심 — 렌더 통합 + 상태/핸들러 단순화)
- `eie/css/eie-grade-ledger.css` (관리 모드 칩/아이콘 스타일)
- `tests/eie-grade-ledger-port.test.js` (문자열/동작 단언 갱신)

---

## ⚠️ 최우선 제약: 난잡하게 만들지 말 것

과거 "시험 관리"라는 **무거운 패널**이 있었고 너무 빽빽해서 의도적으로 제거됐다. 현재 테스트가 `시험 관리`/`표시할 시험` 문자열을 **금지**한다(`tests/eie-grade-ledger-port.test.js:77-79`). 이번 작업은 그 결정을 되돌리되 **같은 실수를 반복하지 않는 것이 성패의 핵심이다.**

**금지(난잡함의 원인):**
- 프리셋 시험마다 `[체크박스][이름][방식 라벨][만점][수정][삭제]`처럼 여러 컨트롤을 한 행에 깔지 말 것. (9개 프리셋 × 5요소 = 예전 그 패널)
- 행 단위 별도 목록 위젯(`renderEditList`/`renderManageList` 같은 풀-로우 리스트)을 새로 만들지 말 것.
- 삭제 버튼을 목록/칩에 상시 노출하지 말 것.
- 안내 문장("선택한 시험만 표에 표시됩니다" 류), "표시 적용" 버튼 같은 잉여 UI 금지.

**지향(가벼움):**
- 평소 화면은 지금과 똑같이 **읽기 전용 칩 한 줄**.
- `시험 관리`를 누르면 그 **같은 칩들이 그 자리에서** on/off 토글이 되고, 각 칩에 **작은 ✎ 아이콘 하나**만 붙는다. 레이아웃이 거의 안 변해서 시각적 충격이 없다.
- 추가/수정/삭제는 한 번에 하나씩 뜨는 **인라인 폼**에서만. 삭제는 그 폼 안에만.

---

## 배경: 현재 구조 (변경 전)

원내평가 탭의 시험 관련 UI는 3개 진입점이 겹친다.

1. **`+ 시험 추가`** — `renderAcademyControls()` 컨트롤 행, 월 선택 옆. `openAddTest()`로 생성 폼. (`eie-grade-ledger.js:577`)
2. **`시험 고치기`** — `renderTestSection()`의 "이번 달 시험" 헤더 버튼. `toggleEditList()`로 편집모드 토글. (`eie-grade-ledger.js:928`)
3. **편집모드(`_editListOpen`)가 켜지면** 두 가지가 동시에:
   - 칩이 체크박스로 바뀌어 `testChoiceList()`에서 이번 달 표시 on/off (`toggleTestChoice`). (`eie-grade-ledger.js:930-936`)
   - 그 아래 `renderEditList()` 풀-로우 목록이 떠서 시험별 `수정`. (`eie-grade-ledger.js:944-957`)

문제: "추가"와 "고치기"의 의미가 겹치고, 같은 시험 목록을 **체크박스 칩**과 **편집 행** 두 방식으로 따로 렌더링한다. 상태 변수 3개(`_addFormOpen`, `_editListOpen`, `_editingTestId`)가 얽혀 있다.

---

## 목표 구조 (변경 후) — 토글 칩 1열 + ✎

```
[평소: 패널 닫힘]
이번 달 시험                                   [시험 관리]
( Vocabulary )  ( Grammar )                  ← 읽기 전용 칩 (현행 동일)

[시험 관리 클릭 → 패널 열림]
이번 달 시험                                   [시험 관리 ✓열림]
[ Monthly ✎] [ Vocabulary ✎] [ Grammar ✎] …  [+ 새 시험]
  └ 칩 본문 클릭 = 이번 달 표시 on/off (채움=on, 외곽선=off)
  └ ✎ 클릭 = 그 시험 인라인 수정 폼 열기
  └ [+ 새 시험] = 빈 생성 폼 열기

  (수정/추가 시 칩 줄 아래에 인라인 폼 1개만 표시)
  ┌ 시험명 [____]  입력방식 [숫자▾]  (만점)  □시험 날짜 넣기
  │ [삭제]                              [취소] [저장]   ← 삭제는 수정 폼에만
  └
```

- **`+ 시험 추가` 버튼 제거** (컨트롤 행에서). 진입점은 `시험 관리` 하나뿐.
- **`시험 고치기` → `시험 관리`** 단일 토글.
- 관리 모드에서 칩은 **같은 칩 자리**에서 토글 버튼이 된다. 새 풀-로우 목록을 만들지 않는다.
- 칩에는 ✎(수정) 아이콘 **하나만**. 방식 라벨/만점/삭제 버튼은 칩에 넣지 않는다.
- 삭제는 `renderTestForm`의 수정 모드 안(이미 존재, `eie-grade-ledger.js:984`)에만.

### 상태 단순화

- 제거: `_addFormOpen`, `_editListOpen`
- 신설: `_manageOpen` (패널 열림 여부), `_formOpen` (새로 만들기 폼 열림 여부)
- 유지: `_editingTestId` (편집 대상 id; 폼이 편집 모드인지 판단)
- 인라인 폼 표시 조건: `_manageOpen && (_formOpen || _editingTestId)`

---

## Task 1 — 렌더 통합 (`eie/js/views/eie-grade-ledger.js`)

- [ ] **1a. 상태 변수 교체** (`eie-grade-ledger.js:51-58` 부근):
  - `var _addFormOpen = false;` → `var _manageOpen = false;`
  - `var _editListOpen = false;` → `var _formOpen = false;`
  - `var _editingTestId = '';` 유지.
- [ ] **1b. 리셋 동기화** (`eie-grade-ledger.js:327-332`): `_addFormOpen = false; _editListOpen = false;` → `_manageOpen = false; _formOpen = false;`. `_editingTestId = '';` 유지.
- [ ] **1c. 컨트롤 행에서 `+ 시험 추가` 제거** (`renderAcademyControls()`, `eie-grade-ledger.js:577`). 아래 줄 삭제:
  ```js
  + (_classId ? '<button type="button" class="eie-grade-add-btn" onclick="EieGradeLedgerView.openAddTest()">+ 시험 추가</button>' : '')
  ```
- [ ] **1d. `renderTestSection()` 재작성** (`eie-grade-ledger.js:920-942`). 같은 칩 줄을 관리 모드에서 토글 칩으로 바꾼다. 목표 형태:
  ```js
  function renderTestSection() {
      if (!_classId) return '';
      var selected = {};
      activeTests().forEach(function (item) { selected[text(item.id)] = true; });
      var choices = _manageOpen ? testChoiceList() : activeTests();
      return '<div class="eie-grade-tests' + (_manageOpen ? ' is-managing' : '') + '">'
          + '<div class="eie-grade-tests-head">'
          + '<span class="eie-grade-tests-title">이번 달 시험</span>'
          + '<button type="button" class="eie-grade-manage-toggle' + (_manageOpen ? ' is-open' : '') + '" onclick="EieGradeLedgerView.toggleManage()">시험 관리</button>'
          + '</div>'
          + '<div class="eie-grade-test-chips">'
          + choices.map(function (item) {
              var id = text(item.id);
              var label = esc(item.title) + (testExamDate(item) ? ' <em>' + esc(formatExamDateLabel(item)) + '</em>' : '');
              if (!_manageOpen) return '<span class="eie-grade-chip is-on">' + label + '</span>';
              var on = !!selected[id];
              return '<span class="eie-grade-chip eie-grade-chip--manage' + (on ? ' is-on' : '') + '">'
                  + '<button type="button" class="eie-grade-chip-toggle" aria-pressed="' + (on ? 'true' : 'false') + '" onclick="EieGradeLedgerView.toggleTestChoice(' + jsArg(id) + ', ' + (on ? 'false' : 'true') + ')">' + label + '</button>'
                  + '<button type="button" class="eie-grade-chip-edit" title="시험 수정" aria-label="시험 수정" onclick="EieGradeLedgerView.editTest(' + jsArg(id) + ')">✎</button>'
                  + '</span>';
          }).join('')
          + (_manageOpen ? '<button type="button" class="eie-grade-add-btn eie-grade-chip-new" onclick="EieGradeLedgerView.openAddTest()">+ 새 시험</button>' : '')
          + '</div>'
          + (_manageOpen && (_formOpen || _editingTestId) ? renderTestForm(_editingTestId ? testById(_editingTestId) : null) : '')
          + '</div>';
  }
  ```
  - 닫힘 칩은 **체크박스 없는 읽기 전용 span** (현행 유지).
  - 관리 칩은 **토글 버튼 + ✎ 두 요소만**. 방식/만점/삭제 텍스트 금지.
  - `toggleTestChoice`의 두 번째 인자는 현재 상태의 반대값을 직접 넘긴다(체크박스가 아니라 버튼이므로 `this.checked` 대신 boolean 리터럴 사용).
- [ ] **1e. `renderEditList()` 함수 제거** (`eie-grade-ledger.js:944-957`). 풀-로우 목록은 더 쓰지 않는다. 호출부도 함께 제거(1d에서 이미 빠짐). `renderManageList` 같은 대체 목록을 새로 만들지 말 것.
- [ ] **1f. `renderTestForm()`은 수정 최소** (`eie-grade-ledger.js:965-989`). 그대로 재사용한다. 수정 모드 분기의 `삭제` 버튼(`eie-grade-ledger.js:984`)이 삭제의 유일한 진입점이 된다 — 유지. 폼 제목 분기(`editing ? esc(editTitle)+' 수정' : '시험 추가'`)는 유지.

---

## Task 2 — 핸들러/상태 머신 단순화 (`eie/js/views/eie-grade-ledger.js`)

- [ ] **2a.** 토글 핸들러 교체 (`eie-grade-ledger.js:1106-1108`):
  ```js
  openAddTest: function () { _manageOpen = true; _formOpen = true; _editingTestId = ''; renderAgain(); },
  closeTestForm: function () { _formOpen = false; _editingTestId = ''; renderAgain(); },
  toggleManage: function () { _manageOpen = !_manageOpen; _formOpen = false; _editingTestId = ''; renderAgain(); },
  ```
  `toggleEditList`는 제거. 전역에서 `toggleEditList` 잔존 참조 0건 확인.
- [ ] **2b.** `editTest` (`eie-grade-ledger.js:1133-1137`): `_manageOpen`을 켠 채 폼만 편집 모드로:
  ```js
  editTest: function (id) { _manageOpen = true; _formOpen = false; _editingTestId = text(id); renderAgain(); },
  ```
- [ ] **2c.** `addAcademyTestFromInputs` 성공 끝부분 (`eie-grade-ledger.js:1212`)의 `_addFormOpen = false;` → `_formOpen = false;`. (`_manageOpen`은 유지해 패널을 열어 둠)
- [ ] **2d.** `updateAcademyTestFromInputs` (`eie-grade-ledger.js:1166-1191`): 끝의 `_editingTestId = '';`에 더해 `_formOpen = false;`도 명시. `_manageOpen` 유지.
- [ ] **2e.** `deleteAcademyTest` (`eie-grade-ledger.js:1158-1165`): 그대로. (`_editingTestId` 정리 유지) 삭제 후 폼이 닫히도록 `_formOpen = false;` 추가.
- [ ] **2f.** `toggleTestChoice` (`eie-grade-ledger.js:1109-1122`): **변경 없음.** (인자 boolean을 그대로 받아 처리)
- [ ] **2g.** 공개 API 객체에서 `toggleEditList` 키 → `toggleManage`로 교체. `openAddTest`/`closeTestForm`/`editTest`/`deleteTest`/`saveTestForm`/`toggleTestChoice` 키 유지.

---

## Task 3 — CSS (`eie/css/eie-grade-ledger.css`)

> 목표: 관리 모드에서도 칩 한 줄 레이아웃을 유지하고, 새로운 위젯이 추가된 느낌을 주지 않는다.

- [ ] **3a.** `.eie-grade-edit-toggle` → `.eie-grade-manage-toggle`로 이름 변경(스타일 값 재사용).
- [ ] **3b.** 관리 칩 스타일 신설:
  - `.eie-grade-chip--manage` : 토글 버튼 + ✎를 가로로 묶는 inline-flex, gap 작게.
  - `.eie-grade-chip-toggle` : 칩 본문 버튼. `is-on`이면 채움색, off면 외곽선/흐린 배경으로 "이번 달 미표시" 구분이 한눈에.
  - `.eie-grade-chip-edit` : 아주 작은 아이콘 버튼(예: 18~20px), 평소 흐리게, hover/focus 시 진하게. 칩 본문과 시각적으로 분리.
  - `.eie-grade-chip-new` : `+ 새 시험` — 점선 외곽선의 가벼운 추가 칩 느낌(기존 `.eie-grade-add-btn` 위에 얹어도 됨).
- [ ] **3c.** 제거: `.eie-grade-edit-list`, `.eie-grade-edit-row`, `.eie-grade-edit-name`, `.eie-grade-edit-type` 규칙(풀-로우 목록 폐기). 다른 화면 공유 여부 grep 확인 후 삭제. `.eie-grade-edit-empty`는 이제 미사용이면 함께 제거.
- [ ] **3d.** 접근성: `.eie-grade-chip-toggle`/`.eie-grade-chip-edit`에 명확한 `:focus-visible` 윤곽선.

---

## Task 4 — 테스트 갱신 (`tests/eie-grade-ledger-port.test.js`)

> 정적/동작 단언을 새 설계에 맞춰 갱신하되 **"가볍게 유지" 가드는 보존·강화**한다.

- [ ] **4a. 정적 단언 (`:74-80`, `:103-108`):**
  - `'+ 시험 추가'`(`:75`) → `'+ 새 시험'`으로 교체.
  - `'시험 고치기'`(`:76`) → `'시험 관리'`로 교체.
  - `시험 관리` **금지**(`:77`) → **삭제**(이제 허용).
  - `표시할 시험` 금지(`:78`), 표시-적용 문구 금지(`:79`), 잉여 안내문 금지(`:80`) → **유지**(가벼움 보존).
  - `editTest`/`deleteTest` 존재(`:103`) → 유지.
  - `renderTestForm`/`renderEditList`(`:104`) → `renderEditList` 제거에 맞춰 **`renderTestForm`만 단언**하고, 추가로 `assert(!ledger.includes('renderEditList'), ...)`와 `assert(!ledger.includes('renderManageList'), '관리 모드는 풀-로우 목록 위젯을 새로 만들지 않는다')`로 **풀-로우 목록 부재를 가드**.
  - 옛 패널 금지(`:105`, `eie-grade-test-panel`/`수정할 시험`/`eie-edit-test-select`) → 유지.
  - `eie-grade-test-actions` 금지(`:106`) → 유지.
  - 칩 직접 edit/delete 금지(`:107`) → **의도 변경**. 관리 칩에는 ✎(editTest)가 의도적으로 들어가므로 이 단언은 **"삭제 버튼은 칩에 없다 + 닫힘 칩은 순수 읽기 전용"** 으로 다시 쓴다. 예:
    ```js
    assert(!ledger.includes('eie-grade-chip-delete') && !ledger.includes('deleteTest(' + (/* 칩 컨텍스트 */)), '삭제 버튼은 칩에 노출하지 않는다(수정 폼 안에만)');
    ```
    (정확한 표현은 구현 마크업에 맞춰 잡되, **삭제는 칩/목록에 없고 폼에만** 있다는 점을 검증할 것.)
- [ ] **4b. 동작 단언 (`:267-310`):**
  - `:267-277` 블록: `toggleEditList()` → `toggleManage()`. `eie-grade-edit-list` 참조 단언 제거. 대신 "관리 모드에서 모든 프리셋(Grammar/Listening/Dictation 포함)이 칩으로 보이고, off 시험은 `is-on`이 아님"을 단언. `:275`의 `type="checkbox"` 단언은 토글 버튼 설계이므로 **제거하거나** `aria-pressed`/`eie-grade-chip-toggle` 단언으로 교체. `:276` "삭제 미노출"은 **유지**(관리 칩 줄에 삭제 없음).
  - `:279-289` 편집 폼 블록: `editTest('month_end')` 호출 유지(`editTest`가 `_manageOpen=true` 강제). `Monthly 수정` 폼 단언 유지. `:288` "삭제는 폼 안에" 단언 유지.
  - `:291-299` 추가 폼 블록: `openAddTest()` 호출 유지. 폼 제목 `시험 추가` 단언 유지(폼 제목 미변경). 단 진입은 `+ 새 시험`임을 별도 단언으로 추가해도 됨.
  - `:301-310` `toggleTestChoice` 블록: **변경 없음**(즉시 반영). 단 호출 시그니처(`toggleTestChoice('memo', false)`)는 그대로 유효.
- [ ] **4c. 기본(닫힘) 화면 단언 (`:226-234`):** `:230` `eie-grade-edit-list` 참조 → 제거 또는 `is-managing` 부재 단언으로 교체. `:231` "삭제 미노출" 유지. `:232` "기본 화면에 체크박스 없음" 유지(이제 관리 모드도 체크박스가 아니므로 전체적으로 `type="checkbox"`가 사라짐 — 더 강하게 가드 가능). `:233-234` 유지.
- [ ] **4d.** `_test.addAcademyTestFromInputs`/`saveGradeSheet` 등 내부 API 테스트(`:312-373`) → **변경 없음**(API 유지).

---

## Task 5 — 검증

- [ ] `node tests/eie-grade-ledger-port.test.js` 통과.
- [ ] 전역 grep: `toggleEditList`, `_addFormOpen`, `_editListOpen`, `renderEditList`, `시험 고치기`, `+ 시험 추가` 잔존 0건(문서 제외).
- [ ] 수동 시나리오:
  1. 원내평가 → 반 선택 → 활성 칩만, 버튼은 `시험 관리` 하나(`+ 시험 추가` 없음).
  2. `시험 관리` → **같은 칩 줄**이 토글 칩으로 바뀌고 각 칩에 ✎ 하나, 끝에 `+ 새 시험`. 새 목록 위젯이 추가로 나타나지 않음(레이아웃이 거의 그대로).
  3. 칩 본문 클릭 → on/off 즉시 토글, 표 컬럼 즉시 반영, off 칩은 흐리게.
  4. ✎ 클릭 → 칩 줄 아래 인라인 폼 하나, 저장/취소/삭제 동작. 삭제는 폼 안에만.
  5. `+ 새 시험` → 빈 폼, 추가 후 폼만 닫히고 패널 유지, 새 시험이 켜진 칩으로 등장.
  6. `전체 저장` 정상.

---

## 검수 포커스 (작성/검수자가 특히 볼 부분)

1. **난잡함 회귀 방지** — 관리 모드가 "칩 줄 + ✎ + 새 시험"을 넘어서는 새 위젯(풀-로우 목록, 방식/만점 라벨, 행별 삭제 버튼)을 만들지 않았는지. `renderEditList`/`renderManageList` 부재 확인.
2. **닫힘 화면 청결** — 평소 화면에 체크박스/✎/삭제/폼이 전혀 새어나오지 않는지.
3. **삭제 경로 단일화** — 삭제가 수정 폼 안에만 있는지(칩·목록에 없음).
4. **토글 즉시성** — `toggleTestChoice`가 별도 적용 버튼 없이 즉시 표를 바꾸는지.
5. **옛 참조 청소** — `toggleEditList`/`_addFormOpen`/`_editListOpen`/`renderEditList`/`+ 시험 추가` 잔존 0건.
6. **데이터 무변경** — 저장 포맷/`EieApi`/`saveGradeSheet`/`_sheetDraftTests` 구조 그대로.

---

## 제약 / 가드레일 (반드시)

- 데이터 계층(저장 포맷, `EieApi`, `saveGradeSheet`, `_sheetDraftTests`) **변경 금지**.
- 관리 모드는 **칩 한 줄 + ✎ + `+ 새 시험`**만. 풀-로우 목록·방식 라벨·행별 삭제 금지.
- 금지 문자열(테스트 가드): `표시할 시험`, `표시 적용`/`표에 표시`/`표시 변경`, `선택한 시험만 표에 표시됩니다.`/`체크한 시험만`/`체크하면 아래`, `eie-grade-test-panel`, `수정할 시험`, `eie-edit-test-select`, `eie-grade-test-actions`, `eie-grade-savebar`, `maxScore: 100`.
- `전체 저장` 버튼 정확히 1개.
- 닫힘(평소) 화면: 체크박스·✎·삭제·폼 미노출.
- 삭제는 `renderTestForm` 수정 모드 안에만.
