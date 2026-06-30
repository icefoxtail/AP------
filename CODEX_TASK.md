# Claude Code Task: APMS 안정화 2차 — 실제 화면 흐름 검증 및 잔여 FAIL 분류

## Goal

이전 결과는 테스트 환경 일부 복구와 정적 회귀 가드 확인에 그쳤습니다.

이번 작업의 목표는 APMS/EIE/Archive의 실제 사용 흐름을 기준으로 안정화 상태를 확인하고, 남은 FAIL 15개가 실제 화면 문제인지 테스트 계약 drift인지 명확히 분류하는 것입니다.

신규 기능은 추가하지 않습니다.

## Important Correction

Do not mark this task as PASS only because some tests pass.

A PASS is allowed only if actual user-facing flows are verified or each unverified flow is clearly reported as NOT VERIFIED.

Do not change only tests and call the application stabilized.

## Scope

No new features.

No broad redesign.

No DB schema changes.

No route rewrites.

No large refactor.

No deploy.

Only inspect, reproduce, minimally fix confirmed breakage, and report accurately.

## Required Verification

### 1. Real Browser Flow Verification

Run or manually verify the actual app in a browser-like environment.

Check these flows:

1. Admin login → admin dashboard
2. Teacher login → teacher dashboard
3. Teacher dashboard → student detail → back
4. Admin dashboard → student detail → back
5. EIE timetable open
6. EIE class/student click behavior
7. Archive open after login
8. Archive print screen open
9. Mobile-width dashboard check
10. Mobile-width timetable check

If a real browser environment is unavailable, report:

```text
REAL BROWSER E2E: NOT VERIFIED
Reason:
```

Do not replace this with node tests only.

---

## 2. Remaining 15 FAIL Tests Classification

Review every remaining failing test.

For each failing test, classify it into exactly one category:

### Category A — Real user-facing bug

The failing test corresponds to a current visible or functional issue.

Action:

* Fix with the smallest safe app-code change.
* Re-run the related test.
* Report the changed files.

### Category B — Intentional product change / stale test contract

The app behavior is correct, but the test expectation is outdated.

Action:

* Do not silently update the test.
* Explain why the current app behavior is correct.
* Only update the test if the product behavior is already confirmed.

### Category C — Needs design decision

The failure involves UI direction, parity, layout contract, or policy decision.

Action:

* Do not guess.
* Report the exact decision needed.

### Category D — Cannot verify in current environment

The test cannot be responsibly resolved without browser/PDF/manual check.

Action:

* Mark as not verified.
* Explain what exact manual check is needed.

---

## 3. Tests That Must Not Be Blanket-Dismissed

Do not dismiss the following as simply “design contract” without checking actual impact:

* eie-teacher-dashboard-style
* eie-owner-dashboard-ap-parity
* eie-timetable-dual-mode
* eie-timetable-student-profile-ap-parity
* eie-students-click-handlers
* eie-monthly-timetable-snapshot
* apmath-global-surface
* assessment-grade-target-round5-1
* assessment-m1-type-source-integrity

For each one, state:

```text
Test:
Current failure:
Actual screen impact:
Classification:
Fix needed:
```

---

## 4. EIE Timetable Specific Checks

Verify actual EIE timetable screen.

Must check:

* Student names are plain readable text.
* Student names do not appear as blue chips/cards.
* Student names do not collapse into "...".
* Multi-period cards still span correctly.
* Teacher headers align.
* Student/class click handlers still work.
* Teacher filter does not break click behavior.
* Owner/admin view and AP parity are not accidentally broken.

If this is only checked through tests, say so clearly.

---

## 5. Navigation / Role Specific Checks

Verify actual admin/teacher separation.

Must check:

* Teacher does not land in admin dashboard through browser back.
* Admin dashboard does not leak into teacher session.
* Role state is preserved after student detail open/back.
* Shared global state is not reset unnecessarily.

If not checked in a browser, report as NOT VERIFIED.

---

## 6. Archive / Print Specific Checks

Verify actual archive and print flow.

Must check:

* Login-gated archive access works.
* Exam list loads.
* Print screen opens.
* Wrong-answer print flow opens if available.
* Print UI does not show unnecessary buttons.
* No obvious page mixing in student-by-student output.

PDF/page split rendering may be marked NOT VERIFIED only if no browser/PDF environment is available.

---

## Allowed Changes

Allowed:

* Minimal app-code fixes for confirmed user-facing bugs.
* Minimal test update only when the current product behavior is confirmed correct.
* Report-only classification when a design decision is needed.

Not allowed:

* New feature implementation.
* Broad CSS rewrite.
* Large module refactor.
* Route structure changes.
* DB schema changes.
* Silent test expectation regeneration.
* Calling the task PASS without verification.

---

## Required Output Format

Return exactly this structure:

```text
RESULT: PASS / PARTIAL PASS / FAIL

SUMMARY
- ...

REAL BROWSER E2E
- Admin login:
- Teacher login:
- Back navigation:
- Student detail:
- EIE timetable:
- Archive:
- Mobile:
- PDF/print:

FILES CHANGED
- ...

APP CODE CHANGED
- Yes / No
- If yes, list why each app-code change was necessary.

TESTS CHANGED
- Yes / No
- If yes, explain why each test change was valid.

REMAINING FAILURES CLASSIFICATION

1. test name:
   Current failure:
   Actual screen impact:
   Classification: A / B / C / D
   Action taken or needed:

2. test name:
   ...

CONFIRMED WORKING
- ...

BUGS FIXED
- ...

NOT VERIFIED
- ...

RISKS / NOT FIXED
- ...

NEW FEATURES ADDED
- None
```

## PASS Rule

Use PASS only if:

* Actual browser flows were verified, and
* No known user-facing bug remains unresolved inside this task scope, and
* Remaining failures are clearly proven stale tests, intentional product changes, or out-of-scope design decisions.

If browser verification was not performed, the maximum allowed result is PARTIAL PASS.
