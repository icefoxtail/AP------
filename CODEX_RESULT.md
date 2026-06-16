# Planner Yeolpumta UI Round 1 Correction

## Scope

- DB/API changes: none
- New feature implementation: none
- Existing complete/timer/delete flow removal: none
- Touched files:
  - `apmath/planner/index.html`
  - `apmath/js/classroom-planner.js`

## Changes

- Stabilized mobile plan cards:
  - `.plan-item` wraps on mobile.
  - `.plan-main` keeps the body next to the checkbox.
  - `.planner-action-row` moves to the next line with `calc(100% - 40px)`.
  - Button rows avoid horizontal overflow at mobile width.
- Fixed repeat hint copy:
  - Shows `반복은 YYYY-MM-DD까지만 생성됩니다.` only when `examDate` exists.
  - Shows `시험일을 설정하면 반복 계획 종료일이 자동 적용됩니다.` when unset.
  - Prevents `null` from appearing in the date input and repeat hint.
- Renamed photo-facing UI to snapshot-facing UI:
  - Button: `스냅샷`
  - Toast: `집중 스냅샷 기능은 다음 단계에서 연결합니다.`
  - Badge class: `snapshot`
  - Existing `photo_count` keys remain as backward-compatible data inputs only.
- Hid zero metric badges:
  - `스냅샷`, `질문`, `답변` render only when count is at least 1.
  - Status badges remain visible.
- Lowered delete action hierarchy:
  - Delete button now uses transparent/secondary styling instead of a prominent danger pill.

## Verification

- `node --check apmath/js/classroom-planner.js`: PASS
- Planner inline script syntax check: PASS
- `node tests/apmath-global-surface.test.js`: PASS
- Mobile planner card CSS guard: PASS
- Local browser load:
  - `http://127.0.0.1:8765/apmath/planner/index.html`: no console errors
  - `http://127.0.0.1:8765/apmath/index.html`: no console errors

## Notes

- Real card rendering behind student auth/PIN was not data-click verified in browser.
- The mobile wrap behavior was verified by CSS guard and page load checks.
