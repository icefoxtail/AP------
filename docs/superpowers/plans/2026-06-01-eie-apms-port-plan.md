# EIE APMS Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build EIE quickly by porting APMath UI/UX and frontend flows, changing only domain-specific data adapters, backend endpoints, and the timetable/class assignment model.

**Architecture:** Treat `apmath/` as the source product template. EIE should reuse AP shell, modal, sidebar, dashboard, student, consultation, management, attendance/homework, and reporting patterns through an APMS-compatible `EieState.db`, `EieState.ui`, and `EieApmsApi` adapter. Timetable remains a deliberate exception because EIE has multiple teachers per student and different class/session structure.

**Tech Stack:** Vanilla HTML/CSS/JS, Cloudflare Worker, D1, existing APMS frontend modules, EIE adapter modules under `eie/js/apms-compat/`.

---

## 1. Current Implementation

- EIE app shell exists: `eie/index.html`, `eie/css/eie.css`, `eie/js/eie-app.js`, `eie/js/eie-router.js`.
- EIE auth bridge exists through `shared/js/wangji-owner-auth-bridge.js` and EIE bearer session flow.
- EIE API client exists: `eie/js/eie-api.js`.
- APMS compatibility layer exists but is not yet the only source of truth:
  - `eie/js/apms-compat/eie-apms-state.js`
  - `eie/js/apms-compat/eie-apms-api.js`
  - `eie/js/apms-compat/eie-apms-ui-bridge.js`
- EIE dashboard is now forced toward AP owner dashboard parity:
  - `eie/js/views/eie-dashboard.js`
  - `tests/eie-owner-dashboard-ap-parity.test.js`
- EIE student management has partial APMS parity according to existing docs, but still needs a strict comparison against `apmath/js/student.js`.
- EIE timetable/classroom exist:
  - `eie/js/views/eie-timetable.js`
  - `eie/js/views/eie-timetable-v2.js`
  - `eie/js/views/eie-classroom.js`
- EIE backend exists in `workers/wangji-eie-worker/`, with active support for timetable cells, students, contacts, assignments, and partial consultations.

## 2. Implemented But Different

- Dashboard: previously had EIE-specific status cards. It should stay AP-shaped, with placeholders where data is missing.
- Students: partly ported, but likely still has EIE-local view logic. It must be re-audited against `apmath/js/student.js`.
- Classroom: currently based on EIE timetable cells. This is acceptable only where timetable structure requires it; visual/UX should still copy AP classroom patterns.
- Timetable: intentionally different. Do not force AP timetable structure here.
- Backend: EIE Worker is intentionally separate. Frontend should not call AP endpoints directly; it should call EIE adapter methods with AP-shaped response objects.
- CSS: EIE has lots of EIE-specific CSS. Future work should reduce new UI decisions and add AP class compatibility instead.

## 3. Forward Implementation Plan

### Task 1: Lock The Porting Rule

**Files:**
- Modify: `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`
- Modify: `tests/eie-owner-dashboard-ap-parity.test.js`

- [ ] Add a rule: "APMath is the UI/UX source of truth. EIE may only diverge for timetable/domain data."
- [ ] Add regression tests for key AP class names in every EIE screen that should be AP-shaped.
- [ ] Run: `node tests\eie-owner-dashboard-ap-parity.test.js`

### Task 2: Build AP-to-EIE Feature Matrix

**Files:**
- Create: `docs/EIE_APMS_FEATURE_MATRIX.md`

- [ ] List APMath modules: dashboard, student, classroom, attendance, homework, consultation, parent contact, management, billing, report, OMR, archive, timetable.
- [ ] Mark each as `copy`, `copy-with-adapter`, `defer`, or `custom`.
- [ ] Only `timetable` should be `custom` by default.

### Task 3: Make EIE State AP-Shaped

**Files:**
- Modify: `eie/js/eie-state.js`
- Modify: `eie/js/apms-compat/eie-apms-state.js`
- Test: `tests/eie-apms-state-parity.test.js`

- [ ] Ensure EIE exposes `state.db.students`, `classes`, `class_students`, `attendance`, `homework`, `consultations`, `parent_contacts`, `teachers`.
- [ ] Project EIE timetable cells and assignments into AP-compatible `classes` and `class_students` only where AP UI expects them.
- [ ] Keep raw EIE data under `state.eie` or `EieState.raw` so timetable can remain custom.

### Task 4: Port Student UI From APMath

**Files:**
- Source: `apmath/js/student.js`
- Modify: `eie/js/views/eie-students.js`
- Modify: `eie/js/apms-compat/eie-apms-api.js`
- Test: `tests/eie-student-apms-parity.test.js`

- [ ] Copy AP student list/detail/modal/tab structure.
- [ ] Replace only API calls and domain labels.
- [ ] Keep unavailable AP-only tabs visible as `준비중` or disabled, not redesigned.
- [ ] Connect create/update/status/archive to EIE Worker endpoints.

### Task 5: Port Consultation And Contact Flows

**Files:**
- Source: `apmath/js/student.js`
- Modify: `eie/js/views/eie-students.js`
- Modify: `workers/wangji-eie-worker/routes/eie.js`

- [ ] Use AP consultation card/modal UX.
- [ ] Use AP parent/contact card UX.
- [ ] Connect to EIE contacts and consultations endpoints.
- [ ] If delete/archive schema is missing, show disabled `준비중` actions instead of inventing alternate UI.

### Task 6: Port Classroom UX, Keep EIE Data Model

**Files:**
- Source: `apmath/js/classroom.js`
- Modify: `eie/js/views/eie-classroom.js`
- Modify: `workers/wangji-eie-worker/routes/eie.js`

- [ ] Reuse AP classroom row/card interaction style.
- [ ] Feed rows from EIE timetable cell assignments.
- [ ] Add EIE attendance/homework endpoints shaped like AP responses.
- [ ] Keep the EIE many-teacher/many-session model behind the adapter.

### Task 7: Port Management Shell

**Files:**
- Source: `apmath/js/management.js`
- Modify: `eie/js/views/eie-management.js`

- [ ] Copy AP management modal/list patterns.
- [ ] Enable only EIE-backed features.
- [ ] Leave billing/accounting/report-like areas as `준비중` if backend is absent.

### Task 8: Timetable Remains Custom

**Files:**
- Keep: `eie/js/views/eie-timetable.js`
- Keep: `eie/js/views/eie-timetable-v2.js`
- Modify only adapters/navigation as needed.

- [ ] Do not force AP timetable UI.
- [ ] Maintain EIE-specific teacher/session/student assignment rules.
- [ ] Link timetable names to AP-shaped student detail and classroom views.

## 4. How To Make Another Academy Easily

- Create one academy folder from the APMS template.
- Add one `academy-config.js` with brand name, route prefix, colors, API base, feature flags.
- Add one adapter layer that maps academy backend data to AP-shaped `state.db`.
- Mark each feature as `enabled`, `ready-with-placeholder`, or `custom`.
- Only custom-build the truly different domain. For EIE, that is timetable/class assignment.

## 5. Porting Rule

- Default: copy APMath UI/UX and JS flow.
- Allowed edits: labels, route names, API adapter calls, feature flags, backend payload mapping.
- Not allowed: new dashboard layouts, new card systems, new interaction models, new colors beyond brand background.
- Exception: timetable and its assignment model.

