# PATCH_RESULT

## EIE PDF material/teacher apply v13

- v12 console paste encoding failure is avoided by using ASCII-safe JavaScript source. Korean strings are encoded as Unicode escapes inside the script.
- Matching now treats PDF afternoon times such as 15:10 and existing EIE 03:10 as the same timetable slot.
- If 0 cards are matched, the script stops without saving.
- Scope remains only material text and weekday teacher data. Student assignments are not touched.

## Check

node --check tools/eie_apply_pdf_material_teachers_20260604.js PASS
