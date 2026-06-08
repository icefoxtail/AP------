# EIE_TIMETABLE_DB_AUDIT_BEFORE_V1

## 1. ?뺤씤???뚯씪

- `eie/js/views/eie-timetable.js`: `EIE_TRUTH_TABLE`, `buildDisplaySessions`, `makeWeeklyCard`, `cardGroupKey`, `buildPeriodGroups`, `buildHomeroomColumns`, `renderTeacherSlots`, `renderBoard`.
- `eie/css/eie.css`: `.eie-v2-board-grid`, `.eie-v2-period-row`, `.eie-v2-teacher-frame-head`, `.eie-v2-teacher-frame-row`, `.eie-v2-teacher-slot`, `.eie-v2-week-card`.
- `workers/wangji-eie-worker/routes/eie.js`: `queryTimetableCells`, `attachCellTeachers`, `ensureScheduleAssignment`, timetable cell/student assignment handlers.
- `workers/wangji-eie-worker/wrangler.jsonc`: D1 binding `DB`, remote DB `wangji-eie-os`.
- `migrations/*.sql`, `workers/wangji-eie-worker/migrations/*.sql`: EIE seed, student assignment, timetable lane migrations.

## 2. ?뺤씤??DB ?뚯씠釉?
remote D1 `wangji-eie-os`?먯꽌 SELECT濡??뺤씤?덈떎.

| table | ?⑸룄 |
|---|---|
| `eie_timetable_cells` | ?쒓컙???먮낯 cell |
| `eie_import_sessions` | seed/manual import session |
| `eie_students` | ?뺤젙 ?숈깮 |
| `eie_student_contacts` | ?숈깮 ?곕씫泥?|
| `eie_student_schedule_assignments` | ?숈깮怨?timetable cell ?곌껐 |
| `eie_timetable_cell_teachers` | timetable cell蹂??좎깮??|
| `eie_student_teachers` | ?숈깮蹂??좎깮??|
| `eie_attendance_records` | 異쒓껐 湲곕줉 |

teacher/homeroom ?꾩슜 留덉뒪???뚯씠釉붿? ?뺤씤?섏? ?딆븯?? ?꾩옱 ?붾㈃? cell??`teacher_name_raw`, `eie_timetable_cell_teachers`, ?꾨줎??怨좎젙 teacher column???ъ슜?쒕떎.

## 3. eie_timetable_cells 而щ읆 援ъ“

| 而щ읆紐?| ?섎? 異붿젙 | V1 ?ъ슜 ?щ? |
|---|---|---|
| `id` | cell id | source 異붿쟻 ?꾩닔 |
| `import_session_id` | import/manual session | ?ъ슜 |
| `source_type` | seed/manual ??| ?ъ슜 |
| `source_import_session_id` | ??import session | ?ъ슜 |
| `day_label` | ?붿씪 | ?꾩옱 ?遺遺?鍮?媛?|
| `period_label` | 援먯떆 ?쇰꺼 | ?ъ슜 |
| `period_order` | 援먯떆 踰덊샇 | 蹂묓빀 ?듭떖 |
| `start_time`, `end_time` | ?쒓컙 | ?뺢퇋?????ъ슜 |
| `class_name_raw` | 諛섎챸/?섏뾽紐?| 蹂묓빀 key |
| `teacher_name_raw` | ?좎깮???댁엫 | column key |
| `room_raw` | 媛뺤쓽??| 蹂댁“ |
| `column_index` | ???묒? column | ?먮낯 異붿쟻 |
| `student_count` | ??cell ?숈깮 ??| 蹂댁“留?媛??|
| `status` | active/archived ??| ?쒖떆 ?꾪꽣 |
| `memo` | 硫붾え | 蹂댁“ |
| `raw_meta_json` | ?먮낯/異붽? 硫뷀? | fallback |
| `slot_lane` | 媛숈? 援먯떆/?좎깮????lane | 10移??뺤옣 ?뚰듃 |
| `created_at`, `updated_at` | 媛먯궗 ?쒓컖 | 蹂댁“ |

## 4. ?곹깭蹂?cell 媛쒖닔

| status | count |
|---|---:|
| active | 43 |
| archived | 1 |
| hidden | 0 |
| needs_review | 0 |

source 遺꾪룷:

| source_type | source_import_session_id | import_session_id | count |
|---|---|---|---:|
| seed | `eie_seed_2604` | `eie_seed_2604` | 31 |
| manual | NULL | `eie_manual_operation` | 13 |

import session:

| id | file/sheet | source_month | status |
|---|---|---|---|
| `eie_manual_operation` | manual/manual | manual | manual |
| `eie_seed_2604` | `?곸뼱26.04.xlsx` / `26.04` | `2026-04` | seeded |

## 5. 吏꾩쭨 以묐났 ?꾨낫

?뺤쓽: active/needs_review cell 以?諛섎챸, ?좎깮?? ?붿씪, 援먯떆, ?쒖옉/醫낅즺 ?쒓컙, ?뺣젹???숈깮 id 紐⑸줉??紐⑤몢 媛숈? 寃쎌슦.

寃곌낵: 0嫄?

archived源뚯? ?ы븿?대룄 ?숈씪 湲곗? 以묐났? 0嫄댁씠??

?뺤씤??archived row:

| cell_id | 諛섎챸 | ?좎깮??| 援먯떆 | ?쒓컙 | ?먮떒 |
|---|---|---|---|---|---|
| `eie2604_cell_r47_c2` | 以?-3 | Stacy | 5援먯떆 | 5:50~6:30 | ?대? archived 泥섎━??seed row |

寃곕줎: ?꾩옱 ?붾㈃?먯꽌 諛섎났?섏뼱 蹂댁씠????ぉ? ??젣 ??곸씤 DB 以묐났?쇰줈 蹂댁? 留먭퀬, ?곗냽 援먯떆 ?쒖떆 蹂묓빀 ?먮뒗 manual/seed ?쇳빀 ?쒖떆 臾몄젣濡?遺꾨쪟?댁빞 ?쒕떎.

## 6. ?곗냽 援먯떆 蹂묓빀 ?꾨낫

?뺤쓽: active/needs_review cell 以?媛숈? 諛섎챸, 媛숈? ?좎깮?? 媛숈? ?붿씪, ?곗냽 `period_order`??4~5 ?먮뒗 6~7 pair. ?숈깮 紐⑸줉? ?뺣젹??student id 湲곗??쇰줈 鍮꾧탳?덈떎.

| ?꾨낫 | source cell_id 紐⑸줉 | 諛섎챸 | ?좎깮??| 援먯떆 踰붿쐞 | ?쒓컙 | ?숈깮 ?쇱튂 | V1 ?쒖떆 | ??젣 湲덉? |
|---|---|---|---|---|---|---|---|---|
| 1 | `eie2604_cell_r35_c8`, `eie_cell_b3623e80-0096-43ed-9e08-bc885614b7dc` | ?덈퉬以?以묐벑援먯옱) | Stacy/STACY | 4~5 | 5:10~5:50 + 05:50~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 2 | `eie_cell_946c3235-9287-429c-bcd3-90db4bae7998`, `eie2604_cell_r47_c10` | 以?-1 | Zoe | 4~5 | 05:10~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 3 | `eie2604_cell_r35_c6`, `eie_cell_573aaf7b-3716-41c1-adce-f7473443492d` | 以?-2 | IVY | 4~5 | 05:10~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 4 | `eie2604_cell_r35_c4`, `eie_cell_d4585d1b-5714-4098-9df1-1f3b51f04858` | 以?-3 | Zoe | 4~5 | 5:10~5:50 + 05:50~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 5 | `eie_cell_5eb5ca61-b5ff-4367-aacc-79c09a6ec4d1`, `eie2604_cell_r47_c4` | 以?-4 | Carmen | 4~5 | 05:10~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 6 | `eie2604_cell_r35_c2`, `eie_cell_8806ed43-1972-4b72-b830-bb3786d904ee` | 以?-3 | Stacy/STACY | 4~5 | 5:10~5:50 + 05:50~06:30 | same | 4~5援먯떆 移대뱶 | ??|
| 7 | `eie2604_cell_r58_c4`, `eie_cell_594c5ae4-231a-48c9-8d7e-7a1bff937689` | 2-1 | Zoe | 6~7 | 06:30~07:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|
| 8 | `eie2604_cell_r58_c10`, `eie_cell_3f59bab4-9e4c-4887-9506-71ae21834130` | 3-2 | Zoe | 6~7 | 06:30~07:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|
| 9 | `eie2604_cell_r58_c12`, `eie_cell_51c9ffa5-f8ef-41d3-8cc5-5d389b57bcfb` | 以?-5 | Stacy/STACY | 6~7 | 06:30~07:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|
| 10 | `eie2604_cell_r58_c6`, `eie_cell_6f08f6fa-433a-4d7c-9d6b-f422857de49a` | 以?-2 | IVY | 6~7 | 06:30~07:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|
| 11 | `eie2604_cell_r58_c2`, `eie_cell_b0b89466-d577-4dcb-952d-80744a6b806d` | 以?-4 | IVY | 6~7 | 06:30~07:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|
| 12 | `eie2604_cell_r58_c8`, `eie_cell_6f758ccf-9287-41d4-abb1-0d1fa884885f` | 以?-1 | Stacy/STACY | 6~7 | 6:30~7:15 + 19:15~20:00 | same | 6~7援먯떆 移대뱶 | ??|

?붿껌??4媛?蹂꾨룄 ?뺤씤:

| ?붿껌 耳?댁뒪 | ?ㅼ젣 DB ?뺤씤 | ?먮떒 |
|---|---|---|
| 以?-3 4~5援먯떆 | `eie2604_cell_r35_c4` + `eie_cell_d4585d1b-5714-4098-9df1-1f3b51f04858` | 蹂묓빀 ?쒖떆 ??? ??젣 湲덉? |
| 以?-4 4~5援먯떆 | `eie_cell_5eb5ca61-b5ff-4367-aacc-79c09a6ec4d1` + `eie2604_cell_r47_c4` | 蹂묓빀 ?쒖떆 ??? ??젣 湲덉? |
| 2-1 6~7援먯떆 | `eie2604_cell_r58_c4` + `eie_cell_594c5ae4-231a-48c9-8d7e-7a1bff937689` | 蹂묓빀 ?쒖떆 ??? ?쒓컙 ?뺢퇋???꾩슂 |
| 3-2 6~7援먯떆 | `eie2604_cell_r58_c10` + `eie_cell_3f59bab4-9e4c-4887-9506-71ae21834130` | 蹂묓빀 ?쒖떆 ??? ?쒓컙 ?뺢퇋???꾩슂 |

二쇱쓽: 6援먯떆 seed row??`06:30~07:15` ?먮뒗 `6:30~7:15`濡???λ릺???덇퀬, 7援먯떆 manual row??`19:15~20:00`?쇰줈 ??λ릺???덈떎. `period_order` 湲곗??쇰줈??蹂묓빀 媛?ν븯吏留? `end_time = next.start_time` 議곌굔留??곕㈃ 6~7 蹂묓빀???ㅽ뙣?쒕떎.

## 7. ?숈깮 紐⑸줉 ?곌껐 湲곗?

?꾩옱 ?ㅼ젣 ?뺤젙 ?숈깮 紐⑸줉 ?곌껐? `class_title` ?⑥닚 留ㅼ묶???꾨땲??`eie_student_schedule_assignments.timetable_cell_id = eie_timetable_cells.id` 湲곗??대떎.

洹쇨굅:

- `eie_student_schedule_assignments` schema??`student_id`, `timetable_cell_id`, `status`, `UNIQUE(student_id, timetable_cell_id)`瑜?媛吏꾨떎.
- worker??`ensureScheduleAssignment`??`student_id + timetable_cell_id` 以묐났??諛⑹??쒕떎.
- V2 ?꾨줎??`getStudents(row)`???곗꽑 `row.assigned_students`瑜??ъ슜?섍퀬, ?놁쓣 ?뚮쭔 `raw_meta_json`???꾨낫 ?숈깮 諛곗뿴??fallback?쇰줈 ?ъ슜?쒕떎.
- assignment row???꾩옱 ?꾨? active 300嫄댁씠??

二쇱쓽:

- manual濡?留뚮뱺 4~7援먯떆 row 以?`student_count = 0`??row媛 ?щ윭 媛??덉?留? assignment join 湲곗? ?숈깮 ?섎뒗 ?뺤긽?대떎.
- ?곕씪??V1? `student_count`瑜??좊ː?섏? 留먭퀬 assignment join ?먮뒗 API??`assigned_students`瑜??ъ슜?댁빞 ?쒕떎.

## 8. ?좎깮??10移?蹂대뱶 媛?μ꽦

?꾩옱 active/needs_review cell??`teacher_name_raw` 遺꾪룷:

| teacher_name_raw | cells |
|---|---:|
| Carmen | 6 |
| IVY | 10 |
| Lily | 5 |
| STACY | 4 |
| Stacy | 7 |
| Zoe | 11 |

?꾩옱 V2 ?붾㈃? `buildHomeroomColumns()`?먯꽌 Carmen / Zoe / IVY / STACY / Lily 5移몄쓣 怨좎젙 諛섑솚?쒕떎. Foreigner/Laura??V2 homeroom column???ы븿?섏? ?딄퀬, truth table???붿씪蹂??좎깮???쒖떆?먮뒗 ?섑??????덈떎.

`slot_lane` 遺꾪룷:

| slot_lane | cells |
|---|---:|
| 1 | 38 |
| 2 | 5 |

?먮떒:

- 10移?蹂대뱶??DB 援ъ“??媛?ν븯?? `slot_lane`???대? ?덇퀬, 2移몄씠 ?꾩슂??異⑸룎 ?뺣낫???쇰? 議댁옱?쒕떎.
- ?꾩옱 ?꾨줎??援ы쁽? 5?댁엫 怨좎젙?대?濡?V1?먯꽌 10移몄쓣 援ы쁽?섎젮硫?`buildHomeroomColumns`瑜?teacher/lane 湲곕컲 column generator濡?諛붽퓭???쒕떎.
- 沅뚯옣 援ъ“: `grid-template-columns: 88px repeat(10, minmax(150px, 1fr))`.
- PC??媛濡??ㅽ겕濡?泥섎━ 媛?? 紐⑤컮?쇱? teacher filter ?먮뒗 媛濡??ㅽ겕濡?以??섎굹瑜?紐낇솗???좏깮?댁빞 ?쒕떎.
- Foreigner/Laura??homeroom column蹂대떎???붿씪蹂??대떦 ?좎깮???쒖떆 ?먮뒗 ?꾪꽣濡??몄텧?섎뒗 ?몄씠 ?꾩옱 ?곗씠??援ъ“? 留욌떎.

## 9. V1 援ы쁽 ???뺣━ ?꾩슂 ??ぉ

- DB DELETE ?꾩슂: ?놁쓬.
- DB hidden/archived 異붽? ?뺣━ ?꾩슂: ?놁쓬. ?대? archived 1嫄대쭔 議댁옱?쒕떎.
- needs_review ?꾨낫: strict duplicate ?놁쓬.
- ?쒓컙 ?뺢퇋?? ?꾩닔. seed??`03:10`, `05:10`, `06:30` ?깆? truth table??`15:10`, `17:10`, `18:30`怨??ㅻⅤ??
- ?좎깮??key ?뺢퇋?? `Stacy`? `STACY`媛 ?쇱옱?쒕떎.
- ?숈깮 紐⑸줉 湲곗?: `student_count`媛 ?꾨땲??assignment join 寃곌낵瑜??ъ슜?댁빞 ?쒕떎.

## 10. 理쒖쥌 ?먯젙

B. DB ?뺣━ ??V1 援ы쁽 媛??

?? ?ш린???꾩슂??DB ?뺣━????젣/?④? ?묒뾽???꾨땲???쒓컙/???뺢퇋??湲곗? ?뺤젙?대떎.

- raw cell? ?좎? 媛??
- ?ㅼ젣 以묐났 row??諛쒓껄?섏? ?딆븯??
- 4~5, 6~7 諛섎났? ??젣 ??곸씠 ?꾨땲??V1 `displaySession` 蹂묓빀 ??곸씠??
- 4~5 蹂묓빀? period/time/student 湲곗??쇰줈 諛붾줈 媛?ν븯??
- 6~7 蹂묓빀? `period_order` 湲곗??쇰줈??媛?ν븯吏留? ????쒓컙??`06:30~07:15` ? `19:15~20:00`?쇰줈 ?쇱옱?섎?濡?truth table 湲곕컲 ?쒓컙 蹂댁젙 ?먮뒗 period_order ?곗꽑 蹂묓빀???꾩슂?섎떎.
- 10移?蹂대뱶??DB??媛?ν븯吏留??꾨줎??column generator ?ъ꽕怨꾧? ?꾩슂?섎떎.

## 11. V1 援ы쁽 ???ъ슜??蹂묓빀 湲곗?

`buildDisplaySessions(rawCells)` 沅뚯옣 湲곗?:

1. raw cell????젣?섏? ?딄퀬 `source_cell_ids`濡?蹂댁〈?쒕떎.
2. ?쒖떆 ???status??`active`, `needs_review`留?湲곕낯?쇰줈 ?쒕떎. `hidden`, `archived`, `inactive`??湲곕낯 ?쒖떆 ?쒖쇅.
3. 媛숈? `class_name_raw`, ?뺢퇋?붾맂 `teacher_name_raw`, 媛숈? `day_label`, 媛숈? ?뺣젹 ?숈깮 id set?대㈃ 蹂묓빀 ?꾨낫濡?蹂몃떎.
4. 蹂묓빀 踰붿쐞???곗꽑 `period_order` ?곗냽?깆쑝濡??먮떒?쒕떎.
5. ?쒓컙? truth table ?먮뒗 period boundary map?쇰줈 蹂댁젙????移대뱶???쒖떆 ?쒓컙???ъ슜?쒕떎.
6. 4~5, 6~7? ?섎굹??display session?쇰줈 留뚮뱾怨?`source_cell_ids`????cell id瑜?紐⑤몢 蹂댁〈?쒕떎.
7. ?숈깮 紐⑸줉? `eie_student_schedule_assignments` join 寃곌낵瑜?湲곗??쇰줈 遺숈씤??
8. `student_count`??蹂댁“ ?뺣낫濡쒕쭔 ?ъ슜?쒕떎.
9. teacher column? `teacherKey()`濡??뺢퇋?뷀븯??display name? ????쒓린濡??뺣━?쒕떎.
10. ??젣/?④?泥섎읆 蹂댁씠??UI ?≪뀡? ?ㅼ젣 DELETE媛 ?꾨땲??`status='archived'`濡?泥섎━?섎뒗 湲곗〈 ?뺤콉???좎??쒕떎.

?대쾲 媛먯궗?먯꽌 DB?먮뒗 蹂寃쎌쓣 媛?섏? ?딆븯??
