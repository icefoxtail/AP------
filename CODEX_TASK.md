# Claude Code Task: APMS 안정화 우선 점검 및 최소 수정

## Goal

이번 작업의 목표는 신규 기능 구현이 아니라 APMS/EIE/Archive의 기존 기능 안정화입니다.

새 기능을 추가하지 말고, 현재 사용 중인 기능이 깨지지 않도록 주요 흐름을 점검하고 필요한 최소 수정만 적용하세요.

## Absolute Scope

Do not add new features.

Do not redesign the UI.

Do not change database schema unless a confirmed bug cannot be fixed otherwise.

Do not refactor large modules.

Do not rename files.

Do not change route structure.

Do not remove existing behavior.

Do not introduce temporary workaround files.

This is a stabilization pass, not a feature pass.

## First Step: Read Before Editing

Before making any code changes, inspect the existing implementation and identify the actual files involved.

Focus areas:

* Authentication / role routing
* Admin dashboard
* Teacher dashboard
* Student detail view
* EIE timetable
* Archive / print flow
* Mobile layout stability

Do not guess.
Confirm the current structure from the repository first.

## Main Problems To Check

### 1. Role / Navigation Stability

Check whether admin and teacher flows are separated correctly.

Verify:

* Admin user enters admin dashboard.
* Teacher user enters teacher dashboard.
* Browser back navigation does not send a teacher into the admin dashboard.
* Dashboard transitions preserve the current role.
* Shared state does not leak between admin and teacher views.

If there is a bug, fix it with the smallest possible change.

### 2. Dashboard Stability

Check the main dashboard flows.

Verify:

* Admin dashboard loads without UI reset loops.
* Teacher dashboard loads without UI reset loops.
* Main buttons continue to work:

  * 출석부
  * 시간표
  * 성적표
  * 관리
* Returning from student detail or subpages does not break the dashboard.
* Empty today schedule / weekly schedule data does not break layout.

### 3. Student Detail Stability

Check student detail entry and return flow.

Verify:

* Student detail opens normally.
* Returning from student detail preserves the previous dashboard context.
* Saving student data does not disappear after reload.
* Withdrawn student visibility is consistent by role.
* Opening student detail does not unnecessarily restart global UI.

### 4. EIE Timetable Stability

Check the EIE timetable rendering.

Known issue to prevent:

* Student names should not become blue cards/chips.
* Student names should not collapse into `...`.
* Student names should render as plain readable text.

Verify:

* Multi-period class cards still span correctly.
* Teacher headers remain aligned.
* Homeroom columns remain aligned.
* Class detail modal saves correctly.
* Day/teacher modal still opens correctly.
* Existing copy/paste/edit timetable behavior still works.

Only fix confirmed timetable rendering issues.
Do not rewrite the timetable engine.

### 5. Archive / Print Stability

Check archive and print flows.

Verify:

* Archive loads after login.
* Exam list loads.
* Exam print works.
* Wrong-answer print works if currently supported.
* QR connection is preserved.
* Print view does not include unnecessary UI controls.
* Student-by-student print output does not visually mix students.

Do not redesign archive pages.
Only fix confirmed breakage.

### 6. Mobile Stability

Check mobile layouts for the main screens.

Verify:

* Buttons do not overflow.
* Cards do not overflow horizontally.
* Close buttons remain accessible.
* Timetable does not become unreadable.
* Bottom action buttons do not cover important content.
* Basic scroll and back behavior is usable.

Do not redesign the mobile UI.
Only correct broken or obviously unstable layout behavior.

## Implementation Rules

Use the smallest safe patch.

Prefer local fixes over global changes.

If a shared utility is causing a bug, confirm every place that utility is used before changing it.

Avoid broad CSS changes that affect unrelated screens.

Avoid changing class names unless absolutely necessary.

Preserve existing naming conventions.

Do not add a new dependency.

Do not add speculative code.

Do not leave console logs unless they already exist for debugging convention.

## Verification Required

After changes, verify at least the following flows manually or with available scripts:

1. Admin login → admin dashboard.
2. Teacher login → teacher dashboard.
3. Teacher dashboard → student detail → back.
4. Admin dashboard → student detail → back.
5. EIE timetable renders student names as plain text.
6. EIE timetable multi-period cards still align.
7. Archive loads after login.
8. Archive print flow still opens.
9. Mobile dashboard does not overflow horizontally.
10. No new feature was added.

## Output Format

When finished, report in this exact format:

```text
RESULT: PASS or FAIL

SUMMARY
- Briefly explain what was checked and what was fixed.

FILES CHANGED
- path/to/file.js
- path/to/file.css

CONFIRMED WORKING
- Admin dashboard:
- Teacher dashboard:
- Student detail:
- EIE timetable:
- Archive:
- Mobile:

BUGS FIXED
- ...

RISKS / NOT FIXED
- ...

NEW FEATURES ADDED
- None
```

If a problem cannot be safely fixed without a larger refactor, do not attempt the refactor.
Report it under `RISKS / NOT FIXED` with the exact reason.
