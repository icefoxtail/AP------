EIE v21 recovery pack

1) inspect_v21_damage_only.js
- Read-only inspection.
- Does not change data.

2) restore_old_cells_only_v21.js
- Restores only old cells archived by v21 marker.
- Does not PATCH/DELETE truth cells.
- Ignores truth cell 404 problem by not touching them.

Run location:
- Real EIE timetable page after login
- Browser DevTools Console
- Paste full JS file content, not the filename
