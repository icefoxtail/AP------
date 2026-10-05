# EIE Classroom Dashboard Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect EIE classroom access to owner and teacher dashboards using AP Math-proven patterns while preserving EIE v2 timetable teacher semantics.

**Architecture:** Create `eie/js/utils/eie-classroom-scope.js` as the single source of truth for classroom access. Dashboard, teacher dashboard, and classroom views must call this utility instead of comparing teacher strings directly.

**Tech Stack:** Browser globals, vanilla JavaScript, Node VM regression tests.

---

### Task 1: Scope Contract

**Files:**
- Create: `tests/fixtures/eie-classroom-scope.fixture.js`
- Create: `tests/eie-classroom-scope-contract.test.js`
- Create: `eie/js/utils/eie-classroom-scope.js`
- Modify: `eie/index.html`

- [ ] Add a canonical fixture with homeroom, day teacher, weekday teacher, raw meta, malformed raw meta, admin, inaccessible, and no-today-class cases.
- [ ] Implement `window.EieClassroomScope` with `teacherKey`, `displayTeacherNamesForCell`, `accessTeacherNamesForCell`, `currentSession`, `canUseCell`, `cellsForTeacher`, and `todayCellsForTeacher`.
- [ ] Ensure every teacher comparison goes through `teacherKey`; raw string equality is forbidden.
- [ ] Load the utility before dashboard/classroom/teacher views.

### Task 2: Classroom Entry API

**Files:**
- Modify: `eie/js/views/eie-classroom.js`
- Test: `tests/eie-classroom-entry-api.test.js`

- [ ] Add `openTeacher(name)`, `openCell(cellId)`, and `openTodayForTeacher(name)`.
- [ ] Treat `name` as a display-name string, never an id or object.
- [ ] If `openTodayForTeacher(name)` has no classes for today, open classroom with an empty teacher-filtered state and render a "today classes none" empty state.

### Task 3: Dashboard Wiring

**Files:**
- Modify: `eie/js/views/eie-dashboard.js`
- Modify: `eie/js/views/eie-teacher.js`
- Test: `tests/eie-owner-dashboard-classroom-link.test.js`
- Test: `tests/eie-teacher-dashboard-ap-port.test.js`

- [ ] Replace owner teacher placeholders with AP Math `renderAdminTeacherCards(todayStr)`-style teacher cards.
- [ ] Replace duplicate teacher filtering in `eie-teacher.js` with `EieClassroomScope`.
- [ ] Do not port homework, progress, or makeup tag panels.

### Task 4: Test Naming

**Files:**
- Final test name: `tests/eie-classroom-port.test.js`

- [ ] Keep test coverage but remove `v4` from the final EIE test filename and log text.
