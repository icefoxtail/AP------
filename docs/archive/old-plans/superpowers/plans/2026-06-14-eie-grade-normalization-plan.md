# EIE Student Grade Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** EIE 영어 학생 데이터의 `grade` 값을 `중1`~`고3` 표준값으로 정리하고, 성적표의 학년 칸이 실제 학생 학년을 표시하도록 보정한다.

**Architecture:** Add one shared grade normalization helper for EIE frontend views, then route student create/edit, timetable/classroom assigned students, attendance, student list, and grade ledger through that helper. Keep legacy `grade_raw` compatible, but UI and school grade ledger grouping must use normalized `grade` values only. Worker-side create/update should also normalize incoming `grade`/`grade_raw` so saved data gradually becomes consistent.

**Tech Stack:** Browser global JS, EIE view modules, Cloudflare Worker route JS, Node contract tests.

---

## Decision Summary For External Review

### 정책

- EIE 영어도 학생의 학년 값은 `중1`, `중2`, `중3`, `고1`, `고2`, `고3` 중 하나로 저장/표시한다.
- 초등 학년은 이번 성적표 MVP 범위에서 제외한다.
- 성적표의 `학년` 칸에는 `학년` 같은 fallback 문구가 나오면 안 된다.
- 학생 데이터에 학년이 없거나 해석할 수 없으면 성적표에서는 `미등록`으로 표시하고, 중등/고등 필터에는 포함하지 않는다.

### 허용 입력 예시

아래 입력은 표준값으로 정규화한다.

```text
중1, 중 1, 중학교1, 중학교1학년, 중등1, 중등1학년 -> 중1
중2, 중 2, 중학교2, 중학교2학년, 중등2, 중등2학년 -> 중2
중3, 중 3, 중학교3, 중학교3학년, 중등3, 중등3학년 -> 중3
고1, 고 1, 고등1, 고등학교1, 고등학교1학년 -> 고1
고2, 고 2, 고등2, 고등학교2, 고등학교2학년 -> 고2
고3, 고 3, 고등3, 고등학교3, 고등학교3학년 -> 고3
```

### 성적표 표시 기준

```text
학년 | 반  | 이름
중1  | fp3 | 최호성
중1  | fp3 | 김서준
고1  | H1  | 남아인
```

`학년 | fp3 | 최호성`처럼 학년 칸에 fallback 텍스트가 들어가면 실패로 본다.

---

## Design Specification (성적표 입력 화면)

### 디자인 목표

성적표 화면은 관공서 서식처럼 보이면 안 된다. 목표는 선생님이 매일 입력해도 피로하지 않은, 정성껏 만든 장부형 입력 화면이다. 기능적으로는 많은 데이터를 다루지만, 시각적으로는 `지금 어디를 보고 있는지`, `어디에 입력하면 되는지`, `저장할 변경이 있는지`가 즉시 보여야 한다.

### 1. 색상 토큰

- 강조색은 출석부에서 정한 teal `#0F766E`를 그대로 사용한다.
- teal은 활성 탭, focus ring, 저장 필요 상태, 변경사항 배지처럼 의미 있는 강조에만 쓴다.
- 본문, 테이블, 필터, 라벨은 무채색 계열로 통일한다.
- 배경은 과한 틴트 없이 `surface`, `surface-2`, hairline border 중심으로 잡는다.

권장 토큰:

```css
--eie-ledger-accent: #0F766E;
--eie-ledger-text: #111827;
--eie-ledger-muted: #6B7280;
--eie-ledger-line: rgba(17, 24, 39, 0.08);
--eie-ledger-line-strong: rgba(17, 24, 39, 0.16);
--eie-ledger-hover: rgba(15, 118, 110, 0.06);
```

### 2. 탭/토글 통일

`학교성적 / 원내평가` 탭과 `중등 / 고등` 토글은 같은 pill segmented control 패턴을 사용한다.

- 높이: 동일
- radius: 동일
- 활성 상태: teal 배경 + 흰 글자
- 비활성 상태: 투명 배경 + 회색 글자
- hover 상태: 아주 옅은 teal tint

필터 select도 같은 높이와 radius를 사용해서 한 줄의 필터 그룹처럼 보이게 한다. 연도, 학년, 반, 정렬, 월 선택이 서로 다른 부품처럼 보이면 실패다.

### 3. 테이블 경량화

테이블은 박스형 서식이 아니라 장부처럼 보여야 한다.

- 굵은 테두리 사용 금지
- 헤더 아래 한 줄만 명확하게 둔다.
- 행 사이 구분선은 낮은 불투명도의 1px hairline만 사용한다.
- 세로 구분선은 최소화한다.
- 학기 구분선처럼 필요한 경우에만 약간 더 진한 선을 사용한다.
- 반평균/학년평균 행은 배경색으로 과하게 칠하지 않고, 행 위쪽 구분선을 조금 더 진하게 둔다.

글자 무게:

- 이름: `font-weight: 600`
- 학년/반/점수: `font-weight: 400`
- 헤더: `font-weight: 600`
- 미등록/빈 상태: muted color

숫자는 `font-variant-numeric: tabular-nums`를 사용해 세로 정렬감을 만든다.

### 4. 입력 셀 디자인

현재처럼 회색 둥근 박스가 반복되면 skeleton 화면처럼 보인다. 입력칸은 장부에 적어 넣는 느낌으로 낮은 밀도의 형태를 사용한다.

점수 입력:

- 기본: 투명 배경 또는 거의 보이지 않는 1px outline
- hover: 옅은 teal tint
- focus: teal ring 또는 teal underline
- 폭: 좁게
- 정렬: 우측 또는 중앙. 숫자 비교가 중요하면 우측 정렬을 우선한다.
- 숫자: `tabular-nums`

메모 입력:

- 점수 input과 같은 폭을 쓰지 않는다.
- 더 넓은 폭을 사용한다.
- 좌측 정렬한다.
- placeholder는 과하게 설명하지 않는다.

원내평가에서 `점수/만점`은 표 안에 `18/20`을 직접 입력하게 하지 않는다. 시험 설정에서 만점 20을 입력하면 표 헤더에 `/20` 또는 `만점 20`이 표시되고, 학생별 셀에는 `18`, `17`처럼 점수만 입력한다.

예시:

```text
이름   | 월말평가 /100 | 단어시험 /20 | Reading /30 | 메모
김서준 | [ 88 ]        | [ 18 ]       | [ 27 ]      | [        ]
남아인 | [ 91 ]        | [ 17 ]       | [ 25 ]      | [        ]
```

### 5. 원내평가 설정 패널

원내평가 기본 화면의 주인공은 시험 설정이 아니라 표다.

기본 상태:

```text
성적표
[학교성적] [원내평가]

fp3 · 2026년 6월                     [시험 추가] [전체 저장]
총점 150점 · 시험 4개

이름 | 월말평가 /100 | 단어시험 /20 | Reading /30 | 메모
```

`시험 추가`를 눌렀을 때만 설정 패널이 열린다.

패널 열린 상태:

```text
이번 달 시험
[ ] 월말평가  만점 100
[ ] 단어시험  만점 20
[ ] Reading   만점 30
[ ] 메모      점수 제외

새 시험
[시험명] [입력 방식] [만점] [추가] [적용]
```

패널 규칙:

- 기본 닫힘
- 표보다 큰 면적을 차지하지 않음
- 안내 문구는 패널 안에만 둠
- `적용`은 패널 내부에서만 표시
- `전체 저장`은 상단 우측 1개만 표시

### 6. 총점/만점 요약

원내평가는 시험 구성이 자유롭기 때문에 최상단에 요약이 필요하다.

표시 예시:

```text
총점 150점 · 시험 4개
```

계산 규칙:

- `점수`, `점수/만점` 유형의 `maxScore`를 합산한다.
- `메모`는 총점에서 제외한다.
- 만점이 없는 점수형 시험은 기본 100점으로 본다.
- 각 시험 헤더에는 `/100`, `/20`, `/30`처럼 만점을 표시한다.

### 7. 변경사항/저장 UX

하단 중앙의 `전체 저장` 버튼은 제거한다. 저장 버튼은 상단 우측 1개만 사용한다.

변경사항 표시는 플레인 텍스트 대신 작은 배지로 처리한다.

- 변경 0개: 회색 텍스트 또는 숨김에 가깝게 낮은 우선순위
- 변경 1개 이상: teal 배경 pill
- 저장 버튼: 변경 0개일 때 비활성, 변경이 있을 때 teal 배경 활성

역할 구분:

```text
전체 저장 = 학생 점수 저장
시험 추가 = 시험 구성 패널 열기
추가 = 새 시험을 후보에 추가
적용 = 이번 달 표에 표시할 시험 구성 반영
```

### 8. 빈 화면/적은 데이터 밀도

학생이 한 명뿐일 때 표 아래가 크게 비면 미완성처럼 보인다.

- 행 높이를 한 단계 여유 있게 둔다.
- 적은 데이터에서도 장부처럼 보이도록 row rhythm을 유지한다.
- 표 아래 빈 영역에는 매우 옅은 보조 안내를 둘 수 있다.

예시:

```text
학년/반 필터를 조정해 더 많은 학생을 확인하세요.
```

이 문구는 muted tone으로 처리하고, 실제 입력보다 시각적으로 앞서면 안 된다.

### 9. 미등록 학년 표시

학년 정규화 실패 시 성적표 학교성적 표에는 기본적으로 표시하지 않는다. 단, 별도 검토 화면이나 학생 상세에서 `미등록`을 표시해야 할 경우에는 본문 데이터와 같은 톤으로 보이면 안 된다.

- `미등록`: muted color
- font-weight: 400
- 실제 학년 `중1`, `고1`과 시각적으로 구분

### 10. 문구 원칙

- 화면 설명보다 행동 문구를 우선한다.
- 개발자식 단어를 쓰지 않는다.
- 중복 안내문은 제거한다.
- 표 안에서는 학생명, 시험명, 점수만 명확하게 보이게 한다.

사용 문구:

```text
성적표
학교성적
원내평가
전체 저장
저장 중...
저장 완료
저장 실패
시험 추가
이번 달 시험
새 시험
입력 방식
만점
추가
적용
반을 선택하면 입력표가 표시됩니다.
```

삭제/회피 문구:

```text
선택한 시험만 표에 표시됩니다.
변경 0개
컬럼
필드
payload
JSON
설정값
```

---

## File Structure

- Create: `eie/js/utils/eie-grade-utils.js`
  - EIE 전체에서 쓰는 `normalizeEieGrade(value)`, `gradeBand(value)`, `gradeSortValue(value)`를 제공한다.
- Modify: `eie/index.html`
  - `eie-grade-utils.js`를 view 파일들보다 먼저 로드한다.
- Modify: `eie/js/views/eie-grade-ledger.js`
  - `gradeOfStudent()`를 shared helper 기반으로 보정한다.
  - 성적표의 중등/고등 분류와 학년 표시가 표준값만 쓰도록 한다.
  - 학년 미등록 학생은 학교성적 입력표에 섞지 않는다.
- Modify: `eie/js/views/eie-students.js`
  - 학생 목록, 상세, 생성/수정 폼에서 학년 값을 표준값으로 표시/저장한다.
- Modify: `eie/js/views/eie-classroom.js`
  - 클래스룸 학생 편집/추가 학년 select 저장값을 표준화한다.
- Modify: `eie/js/views/eie-timetable.js`
  - 시간표/학생 편집에서 학년 표시와 저장값을 표준화한다.
- Modify: `eie/js/views/eie-attendance.js`
  - 출석부 학년 필터와 학생 표시가 표준값을 쓰도록 한다.
- Modify: `workers/wangji-eie-worker/routes/eie.js`
  - 학생 create/update 요청에서 `grade`/`grade_raw`를 표준값으로 저장한다.
- Modify: `tests/eie-grade-normalization.test.js`
  - shared helper와 성적표 학년 표시 계약을 검증한다.
- Modify: `tests/eie-grade-ledger-port.test.js`
  - 성적표에서 fallback `학년` row가 나오지 않는지 검증한다.
- Modify: `CODEX_RESULT2.md`
  - 구현 결과와 미확인 항목을 기록한다.

---

### Task 1: Add Shared Grade Normalization Tests

**Files:**
- Create: `tests/eie-grade-normalization.test.js`

- [ ] **Step 1: Write helper contract tests**

Create:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const utilPath = path.join(root, 'eie/js/utils/eie-grade-utils.js');
assert(fs.existsSync(utilPath), 'grade utility file should exist');

const code = fs.readFileSync(utilPath, 'utf8');
const context = { window: {} };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context, { filename: 'eie-grade-utils.js' });

const normalize = context.EieGradeUtils.normalizeEieGrade;

[
  ['중1', '중1'],
  ['중 1', '중1'],
  ['중학교1학년', '중1'],
  ['중등2', '중2'],
  ['중학교3', '중3'],
  ['고 1', '고1'],
  ['고등학교1학년', '고1'],
  ['고등2', '고2'],
  ['고등학교3', '고3']
].forEach(([input, expected]) => {
  assert.strictEqual(normalize(input), expected, `${input} should normalize to ${expected}`);
});

['', null, undefined, 'fp3', '영어', '초4', '학년'].forEach(value => {
  assert.strictEqual(normalize(value), '', `${value} should not become a fake grade`);
});

assert.strictEqual(context.EieGradeUtils.gradeBand('중1'), 'middle');
assert.strictEqual(context.EieGradeUtils.gradeBand('고2'), 'high');
assert.strictEqual(context.EieGradeUtils.gradeBand('fp3'), '');

console.log('EIE grade normalization test passed');
```

- [ ] **Step 2: Run and verify failure before helper exists**

Run:

```powershell
node tests/eie-grade-normalization.test.js
```

Expected before implementation: FAIL because `eie/js/utils/eie-grade-utils.js` does not exist.

---

### Task 2: Create Shared EIE Grade Utility

**Files:**
- Create: `eie/js/utils/eie-grade-utils.js`
- Modify: `eie/index.html`
- Test: `tests/eie-grade-normalization.test.js`

- [ ] **Step 1: Create utility**

Create:

```js
(function () {
    function clean(value) {
        return String(value == null ? '' : value).replace(/\s+/g, '').trim();
    }

    function normalizeEieGrade(value) {
        var raw = clean(value);
        if (!raw) return '';

        var aliases = {
            '중1': '중1', '중학교1': '중1', '중학교1학년': '중1', '중등1': '중1', '중등1학년': '중1',
            '중2': '중2', '중학교2': '중2', '중학교2학년': '중2', '중등2': '중2', '중등2학년': '중2',
            '중3': '중3', '중학교3': '중3', '중학교3학년': '중3', '중등3': '중3', '중등3학년': '중3',
            '고1': '고1', '고등1': '고1', '고등1학년': '고1', '고등학교1': '고1', '고등학교1학년': '고1',
            '고2': '고2', '고등2': '고2', '고등2학년': '고2', '고등학교2': '고2', '고등학교2학년': '고2',
            '고3': '고3', '고등3': '고3', '고등3학년': '고3', '고등학교3': '고3', '고등학교3학년': '고3'
        };
        if (aliases[raw]) return aliases[raw];

        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];

        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];

        return '';
    }

    function gradeBand(value) {
        var grade = normalizeEieGrade(value);
        if (/^중[1-3]$/.test(grade)) return 'middle';
        if (/^고[1-3]$/.test(grade)) return 'high';
        return '';
    }

    function gradeSortValue(value) {
        var grade = normalizeEieGrade(value);
        return ['중1', '중2', '중3', '고1', '고2', '고3'].indexOf(grade);
    }

    window.EieGradeUtils = {
        normalizeEieGrade: normalizeEieGrade,
        gradeBand: gradeBand,
        gradeSortValue: gradeSortValue
    };
})();
```

- [ ] **Step 2: Load utility before views**

In `eie/index.html`, load:

```html
<script src="js/utils/eie-grade-utils.js"></script>
```

Place it before `eie/js/views/eie-students.js`, `eie/js/views/eie-classroom.js`, `eie/js/views/eie-timetable.js`, `eie/js/views/eie-attendance.js`, and `eie/js/views/eie-grade-ledger.js`.

- [ ] **Step 3: Verify utility tests**

Run:

```powershell
node tests/eie-grade-normalization.test.js
```

Expected: PASS.

---

### Task 3: Fix Grade Ledger Grade Mapping

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`
- Modify: `tests/eie-grade-ledger-port.test.js`
- Test: `tests/eie-grade-normalization.test.js`

- [ ] **Step 1: Replace local grade fallback**

Change `gradeOfStudent(student)` so it never returns literal `학년`:

```js
function normalizeEieGrade(value) {
    if (window.EieGradeUtils && typeof EieGradeUtils.normalizeEieGrade === 'function') {
        return EieGradeUtils.normalizeEieGrade(value);
    }
    var raw = text(value).replace(/\s+/g, '');
    var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
    if (middle) return '중' + middle[1];
    var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
    if (high) return '고' + high[1];
    return /^중[1-3]$|^고[1-3]$/.test(raw) ? raw : '';
}

function gradeOfStudent(student) {
    var raw = rawOf(student);
    return normalizeEieGrade(student && (student.grade || student.grade_raw))
        || normalizeEieGrade(raw.grade || raw.grade_raw)
        || '';
}
```

- [ ] **Step 2: Exclude unregistered grade from school grade table**

Update `getEieGradeVisibleStudents()`:

```js
students = students.filter(function (student) {
    var grade = gradeOfStudent(student);
    if (!grade) return false;
    return _schoolSection === 'high' ? /^고[1-3]$/.test(grade) : /^중[1-3]$/.test(grade);
});
```

- [ ] **Step 3: Remove fallback group**

Change:

```js
['중1', '중2', '중3', '학년'].forEach(...)
```

to:

```js
['중1', '중2', '중3'].forEach(...)
```

High school should iterate `['고1', '고2', '고3']` or sort by normalized grade, not fallback text.

- [ ] **Step 4: Add ledger contract assertion**

In `tests/eie-grade-ledger-port.test.js`, add:

```js
assert(!ledger.includes("['중1', '중2', '중3', '학년']"), 'school ledger should not group unknown grades under literal 학년');
assert(!ledger.includes("return value || '학년'"), 'school ledger should not display fallback 학년 as a student grade');
```

- [ ] **Step 5: Verify**

Run:

```powershell
node --check eie/js/views/eie-grade-ledger.js
node tests/eie-grade-normalization.test.js
node tests/eie-grade-ledger-port.test.js
```

Expected: all PASS.

---

### Task 4: Standardize Student Create/Edit Grade Inputs

**Files:**
- Modify: `eie/js/views/eie-students.js`
- Modify: `eie/js/views/eie-classroom.js`
- Modify: `eie/js/views/eie-timetable.js`
- Test: `tests/eie-students-click-handlers.test.js`

- [ ] **Step 1: Use shared helper in each view**

Add local bridge where each file currently has its own `normalizeGrade()`:

```js
function normalizeGrade(value) {
    if (window.EieGradeUtils && typeof EieGradeUtils.normalizeEieGrade === 'function') {
        return EieGradeUtils.normalizeEieGrade(value);
    }
    var raw = text(value).replace(/\s+/g, '');
    var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
    if (middle) return '중' + middle[1];
    var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
    if (high) return '고' + high[1];
    return /^중[1-3]$|^고[1-3]$/.test(raw) ? raw : '';
}
```

- [ ] **Step 2: Save normalized grade**

When building student create/update payloads, change:

```js
grade: grade
```

to:

```js
grade: normalizeGrade(grade)
```

If a grade select already restricts values to `중1`~`고3`, this is still harmless and locks the payload contract.

- [ ] **Step 3: Keep selects fixed from 중1 to 고3**

All create/edit grade selects should use exactly:

```js
['중1', '중2', '중3', '고1', '고2', '고3']
```

Do not reintroduce free-text grade inputs for the MVP.

- [ ] **Step 4: Verify**

Run:

```powershell
node --check eie/js/views/eie-students.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-timetable.js
node tests/eie-students-click-handlers.test.js
```

Expected: all PASS.

---

### Task 5: Normalize Worker Student Grade Writes

**Files:**
- Modify: `workers/wangji-eie-worker/routes/eie.js`
- Test: add assertions to `tests/eie-grade-normalization.test.js` or a worker contract test

- [ ] **Step 1: Add worker helper**

Near worker text helpers, add:

```js
function normalizeEieGrade(value) {
  const raw = safeText(value).replace(/\s+/g, '');
  const aliases = {
    중1: '중1', 중학교1: '중1', 중학교1학년: '중1', 중등1: '중1', 중등1학년: '중1',
    중2: '중2', 중학교2: '중2', 중학교2학년: '중2', 중등2: '중2', 중등2학년: '중2',
    중3: '중3', 중학교3: '중3', 중학교3학년: '중3', 중등3: '중3', 중등3학년: '중3',
    고1: '고1', 고등1: '고1', 고등1학년: '고1', 고등학교1: '고1', 고등학교1학년: '고1',
    고2: '고2', 고등2: '고2', 고등2학년: '고2', 고등학교2: '고2', 고등학교2학년: '고2',
    고3: '고3', 고등3: '고3', 고등3학년: '고3', 고등학교3: '고3', 고등학교3학년: '고3'
  };
  if (aliases[raw]) return aliases[raw];
  const middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
  if (middle) return `중${middle[1]}`;
  const high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
  if (high) return `고${high[1]}`;
  return '';
}
```

- [ ] **Step 2: Normalize create payload**

Where student create payload currently writes:

```js
safeText(candidate?.grade_raw)
```

or:

```js
safeText(body.grade || body.grade_raw)
```

use:

```js
normalizeEieGrade(candidate?.grade || candidate?.grade_raw)
```

and:

```js
normalizeEieGrade(body.grade || body.grade_raw)
```

- [ ] **Step 3: Normalize update payload**

Where student update pushes grade binds, use:

```js
binds.push(normalizeEieGrade(body.grade || body.grade_raw));
```

- [ ] **Step 4: Add worker source assertions**

Add test assertions:

```js
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
assert(worker.includes('function normalizeEieGrade'), 'worker should normalize EIE student grade writes');
assert(worker.includes('normalizeEieGrade(body.grade || body.grade_raw)'), 'worker update should normalize grade payloads');
```

- [ ] **Step 5: Verify**

Run:

```powershell
node --check workers/wangji-eie-worker/routes/eie.js
node tests/eie-grade-normalization.test.js
```

Expected: PASS.

---

### Task 6: Regression Verification And Report

**Files:**
- Modify: `CODEX_RESULT2.md`

- [ ] **Step 1: Run syntax checks**

```powershell
node --check eie/js/views/eie-teacher.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-students.js
node --check eie/js/views/eie-timetable.js
node --check eie/js/views/eie-attendance.js
node --check eie/js/views/eie-grade-ledger.js
node --check eie/js/eie-api.js
node --check workers/wangji-eie-worker/routes/eie.js
```

Expected: all exit code 0.

- [ ] **Step 2: Run regression tests**

```powershell
node tests/eie-grade-normalization.test.js
node tests/eie-students-click-handlers.test.js
node tests/eie-teacher-classroom-panel-route.test.js
node tests/eie-classroom-entry-api.test.js
node tests/eie-exam-records-mvp.test.js
node tests/eie-grade-ledger-port.test.js
```

Expected: all PASS.

- [ ] **Step 3: Append result report**

Append:

```markdown
## EIE 학생 학년 표준화 구현 결과

### 정책

### 수정 파일

### 성적표 학년 표시 결과

### 학생 생성/수정 저장 결과

### 테스트 결과

### 미확인 항목
```

- [ ] **Step 4: No commit or push**

```powershell
git status --short
```

Expected: changes visible, no commit or push.

---

## Self-Review

- Spec coverage: `grade` 값을 `중1`~`고3`으로 정리하는 정책, 성적표 표시, 학생 생성/수정 저장, worker 저장 보정, tests are covered.
- Scope guard: 초등 학년, 반 레벨명 자동 추론, DB migration/backfill, 운영 데이터 일괄 보정은 이번 계획에 포함하지 않는다.
- Important external-review point: 기존 데이터 백필은 별도 작업이다. 이번 구현은 새 저장값과 화면 표시/필터 기준을 표준화하고, 기존 row는 런타임 정규화 가능한 범위에서만 보정한다.
