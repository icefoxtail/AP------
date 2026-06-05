// block-builder.js — cells[] → blocks[] 변환 (판정 전용)
// window.V3BlockBuilder = { buildBlocks }
//
// 핵심 설계:
//  - 같은 반/같은 학생 구성/연속 교시 → 하나의 block으로 병합
//  - block.periods = 교시별 담당 배열 (월화수목금 × N교시)
//  - block.students = 합집합 dedup (카드에 1번만 표시)
//  - 같은 period_order의 다른 요일 셀 = 같은 Period 안에 합산
//  - 연속 교시 셀 = periods 배열에 새 Period 추가

(function () {
    var U = window.V3Utils;
    var DAYS = U.DAY_ORDER.slice(0, 5); // ['월','화','수','목','금']

    // ── 학생 추출 (API 응답 구조 우선순위 순) ─────────────────────────
    function getCellStudents(cell) {
        // 1순위: cell.students (Worker JOIN 응답에서 top-level로 반환)
        var topLevel = Array.isArray(cell && cell.students) ? cell.students : [];
        if (topLevel.length) return normalizeStudentList(topLevel);

        // 2순위: cell.assigned_students
        var assigned = Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : [];
        if (assigned.length) return normalizeStudentList(assigned);

        // 3순위: raw_meta_json 안 여러 키
        var meta = U.getRawMeta(cell);
        var source = Array.isArray(meta.student_candidates) ? meta.student_candidates
            : Array.isArray(meta.student_names) ? meta.student_names
            : Array.isArray(meta.students) ? meta.students
            : Array.isArray(meta.studentSeeds) ? meta.studentSeeds
            : [];
        return normalizeStudentList(source);
    }

    function normalizeStudentList(arr) {
        return arr.map(function (item) {
            if (typeof item === 'string') {
                return { student_id: '', pin: '', name: U.normalizeStudentName(item),
                    grade: '', status: '', student_type: '', memo: '' };
            }
            return {
                student_id: U.normalizeKey((item && (item.student_id || item.confirmed_student_id ||
                    item.matched_student_id || item.canonical_student_id || item.id)) || ''),
                pin:  U.normalizeKey((item && (item.pin || item.pin_code || item.student_pin)) || ''),
                name: U.normalizeStudentName((item && (item.name || item.display_name ||
                    item.student_name_raw || item.studentName)) || ''),
                grade: U.normalizeKey((item && (item.grade_raw || item.grade)) || ''),
                status: U.normalizeKey((item && (item.status || item.match_status)) || ''),
                student_type: U.normalizeKey((item && (item.student_type || item.type)) || ''),
                memo: U.normalizeKey((item && item.memo) || '')
            };
        }).filter(function (s) { return !!s.name; });
    }

    // ── students 합집합 dedup ────────────────────────────────────────
    function mergeStudents(arrays) {
        var map = new Map();
        arrays.forEach(function (arr) {
            arr.forEach(function (s) {
                var key = U.studentStableLaneKey(s);
                if (!key || map.has(key)) return;
                map.set(key, s);
            });
        });
        return Array.from(map.values());
    }

    // ── 담임(homeroom) 추출 — day-specific teacher가 아닌 반 담임 ───────
    // raw_meta_json.homeroom_teacher 우선 → cell.homeroom_teacher
    // → Foreigner 제외한 teacher_name_raw
    // day teacher(요일별 담당자)와 구분해야 같은 반 여러 요일 셀의 groupKey가 일치
    function getCellHomeroomTeacher(cell) {
        var meta = U.getRawMeta(cell);
        var homeroom = U.normalizeKey(
            (cell && cell.homeroom_teacher) || meta.homeroom_teacher || ''
        );
        if (homeroom && !U.isForeignerTeacher(homeroom)) return homeroom;
        // Foreigner/없음 → teacher_name_raw에서 non-Foreigner 추출
        var teacherNames = U.getTeacherNames(cell);
        var nonForeign = teacherNames.filter(function (t) { return !U.isForeignerTeacher(t); });
        return nonForeign[0] || teacherNames[0] || '미정';
    }

    // ── classKey: 학생 구성 OR (교재 + 담임) ─────────────────────────
    // 같은 반의 다른 요일 셀들이 동일한 classKey를 갖도록
    // teacher 키는 homeroom 기준(day teacher가 아님)
    function calcClassKey(cell, students) {
        if (students.length >= 1) {
            var keys = students.map(U.studentStableLaneKey).filter(Boolean).sort();
            return 'students:' + keys.join('|');
        }
        var mKey = U.materialKey(cell);
        var hKey = U.teacherKey(getCellHomeroomTeacher(cell));
        if (mKey) return 'class:' + mKey + '|teacher:' + hKey;
        return 'id:' + U.normalizeKey(cell.id || cell.cell_id || '');
    }

    // ── is_prep 판정 ─────────────────────────────────────────────────
    function isPrep(cell) {
        var meta = U.getRawMeta(cell);
        if (meta && meta.is_prep) return true;
        var text = [cell.class_name_raw, cell.class_name, cell.memo, meta.session_type, meta.type]
            .map(function (v) { return String(v || '').toLowerCase(); }).join(' ');
        return /\bprep\b|프렙/.test(text);
    }

    // ── cell → Period.day_teachers 구성 ─────────────────────────────
    function buildPeriodDayTeachers(cell) {
        var result = {};
        var cellDay = U.normalizeDay(cell.day_label || cell.day_of_week || cell.day || '');
        DAYS.forEach(function (day) {
            var vals = U.dayTeacherValues(cell, day).slice();
            if (cellDay === day) {
                var raw = U.normalizeKey(cell.teacher_name_raw || cell.teacher_name || '');
                if (raw && vals.indexOf(raw) === -1) vals.push(raw);
            }
            result[day] = U.uniqueNames(vals);
        });
        return result;
    }

    function mergeDayTeachers(a, b) {
        var result = {};
        DAYS.forEach(function (day) {
            result[day] = U.uniqueNames((a[day] || []).concat(b[day] || []));
        });
        return result;
    }

    // ── 연속 교시 판정 ────────────────────────────────────────────────
    // prevEndMins/currStartMins 모두 있으면 시간 체크, 없으면 교시 번호만 체크
    function isConsecutivePeriod(prevPeriodOrder, prevEndMins, currPeriodOrder, currStartMins) {
        if (currPeriodOrder - prevPeriodOrder !== 1) return false;
        if (prevEndMins !== null && currStartMins !== null &&
            Number.isFinite(prevEndMins) && Number.isFinite(currStartMins)) {
            return Math.abs(currStartMins - prevEndMins) <= 15;
        }
        return true; // 시간 정보 없으면 교시 번호 연속만으로 판정
    }

    // ── 메인 빌더 ────────────────────────────────────────────────────
    function buildBlocks(cells) {
        if (!Array.isArray(cells)) return [];

        // Step 1: 비활성 셀 제외
        var activeCells = cells.filter(function (cell) {
            var s = U.normalizeKey((cell && cell.status) || '').toLowerCase();
            return s !== 'hidden' && s !== 'archived' && s !== 'inactive';
        });

        // Step 2: PREP 셀 제외
        var nonPrepCells = activeCells.filter(function (cell) { return !isPrep(cell); });

        // Step 3: (period_order ASC, start_time ASC) 정렬
        var sorted = nonPrepCells.slice().sort(function (a, b) {
            var ao = Number(a.period_order || 0);
            var bo = Number(b.period_order || 0);
            if (ao !== bo) return ao - bo;
            var at = U.timeToMinutes(U.normalizeTime(a.start_time || '')) || 0;
            var bt = U.timeToMinutes(U.normalizeTime(b.start_time || '')) || 0;
            return at - bt;
        });

        // Step 4: students, classKey, homeroom 계산
        var annotated = sorted.map(function (cell) {
            var students = getCellStudents(cell);
            var classKey = calcClassKey(cell, students);
            var homeroomTeacher = getCellHomeroomTeacher(cell);
            var slotLane = Number(cell.slot_lane) >= 1 ? Number(cell.slot_lane) : 1;
            var importSession = U.normalizeKey(cell.import_session_id || '');
            var startMins = U.timeToMinutes(U.normalizeTime(cell.start_time || ''));
            var endMins = U.timeToMinutes(U.normalizeTime(cell.end_time || ''));
            var periodOrder = Number(cell.period_order || 0);
            return {
                cell: cell,
                students: students,
                classKey: classKey,
                homeroomTeacher: homeroomTeacher,
                slotLane: slotLane,
                importSession: importSession,
                startMins: startMins,
                endMins: endMins,
                periodOrder: periodOrder
            };
        });

        // groupKey: classKey + homeroom + importSession
        // slot_lane은 병합 기준에서 제외 — 같은 반/같은 학생이면 lane이 달라도 block 1장으로 병합
        function groupKey(item) {
            return item.classKey + '||' + U.teacherKey(item.homeroomTeacher)
                + '||' + item.importSession;
        }

        // Step 5~8: open groups 패턴으로 병합
        // openGroup = { items, maxPeriodOrder, maxEndMins }
        // - 같은 period_order → 같은 Period 안으로 합산 (다른 요일 셀)
        // - 다음 period_order가 연속 → 같은 block에 새 Period 추가
        // - 연속이 아니면 → 현재 open을 블록으로 확정하고 새 open 시작
        var blocks = [];
        var openGroups = new Map();

        annotated.forEach(function (item) {
            var gk = groupKey(item);
            if (openGroups.has(gk)) {
                var open = openGroups.get(gk);

                if (item.periodOrder === open.maxPeriodOrder) {
                    // 같은 교시, 다른 요일 셀 → 같은 Period에 합산
                    open.items.push(item);
                    // endMins는 같은 교시이므로 기존 값 유지(또는 갱신)
                    if (item.endMins !== null && Number.isFinite(item.endMins)) {
                        if (open.maxEndMins === null || item.endMins > open.maxEndMins) {
                            open.maxEndMins = item.endMins;
                        }
                    }
                    return;
                }

                // 다른 교시 → 연속 판정
                if (isConsecutivePeriod(open.maxPeriodOrder, open.maxEndMins,
                                        item.periodOrder, item.startMins)) {
                    open.items.push(item);
                    open.maxPeriodOrder = item.periodOrder;
                    if (item.endMins !== null && Number.isFinite(item.endMins)) {
                        open.maxEndMins = item.endMins;
                    }
                    return;
                }

                // 연속 끊김 → 확정
                blocks.push(finalizeBlock(open.items));
                openGroups.delete(gk);
            }
            // 새 open 시작
            openGroups.set(gk, {
                items: [item],
                maxPeriodOrder: item.periodOrder,
                maxEndMins: item.endMins
            });
        });

        // 남은 open 모두 확정
        openGroups.forEach(function (open) {
            blocks.push(finalizeBlock(open.items));
        });

        // 시작 시간 순 정렬
        blocks.sort(function (a, b) {
            if (a.start_minutes !== null && b.start_minutes !== null) {
                return a.start_minutes - b.start_minutes;
            }
            return 0;
        });

        return blocks;
    }

    // ── block 확정 ───────────────────────────────────────────────────
    function finalizeBlock(items) {
        // students 합집합
        var allStudents = mergeStudents(items.map(function (i) { return i.students; }));

        // 교시별 Period 구성 (같은 period_order 셀들의 day_teachers 합산)
        var periodMap = new Map();
        items.forEach(function (item) {
            var cell = item.cell;
            var pOrder = item.periodOrder;
            var pLabel = U.normalizeKey(cell.period_label || (pOrder + '교시'));
            var startT = U.normalizeTime(cell.start_time || '');
            var endT   = U.normalizeTime(cell.end_time || '');
            // 같은 period_order끼리 같은 pKey로 그룹
            var pKey = String(pOrder) + '|' + pLabel;

            if (!periodMap.has(pKey)) {
                periodMap.set(pKey, {
                    period_order: pOrder,
                    period_label: pLabel,
                    start_time: startT,
                    end_time: endT,
                    day_teachers: buildPeriodDayTeachers(cell),
                    source_cell_ids: [U.normalizeKey(cell.id || cell.cell_id || '')]
                });
            } else {
                var existing = periodMap.get(pKey);
                existing.day_teachers = mergeDayTeachers(existing.day_teachers, buildPeriodDayTeachers(cell));
                var cid = U.normalizeKey(cell.id || cell.cell_id || '');
                if (cid && existing.source_cell_ids.indexOf(cid) === -1) {
                    existing.source_cell_ids.push(cid);
                }
                // 시간 정보 보완 (비어 있으면 채움)
                if (!existing.start_time && startT) existing.start_time = startT;
                if (!existing.end_time && endT) existing.end_time = endT;
            }
        });

        var periods = Array.from(periodMap.values()).sort(function (a, b) {
            return a.period_order - b.period_order;
        });

        var sourceIds = items.map(function (i) {
            return U.normalizeKey(i.cell.id || i.cell.cell_id || '');
        }).filter(Boolean);
        var blockId = sourceIds.slice().sort().join('_').substring(0, 40);

        var allStartMins = items.map(function (i) { return i.startMins; })
            .filter(function (v) { return v !== null && Number.isFinite(v); });
        var allEndMins = items.map(function (i) { return i.endMins; })
            .filter(function (v) { return v !== null && Number.isFinite(v); });
        var startMinutes = allStartMins.length ? Math.min.apply(null, allStartMins) : null;
        var endMinutes   = allEndMins.length   ? Math.max.apply(null, allEndMins)   : null;

        var firstItem = items[0];
        var firstCell = firstItem.cell;

        var status = items.some(function (i) {
            return U.normalizeKey(i.cell.status) === 'needs_review';
        }) ? 'needs_review' : 'active';

        var memo = items.map(function (i) {
            return U.normalizeKey(i.cell.memo || '');
        }).filter(Boolean);
        var uniqueMemo = memo.filter(function (v, idx) { return memo.indexOf(v) === idx; });

        var studentKey = allStudents.map(U.studentStableLaneKey).filter(Boolean).sort().join('|');
        var homeroomTeacher = firstItem.homeroomTeacher;
        var material = U.materialLabel(firstCell);

        return {
            block_id: blockId,
            material: material,
            homeroom_teacher: homeroomTeacher,
            column_teacher: homeroomTeacher,
            students: allStudents,
            student_key: studentKey,
            periods: periods,
            source_cell_ids: sourceIds,
            start_time: startMinutes !== null
                ? U.minutesToTime(startMinutes)
                : U.normalizeTime(firstCell.start_time || ''),
            end_time: endMinutes !== null
                ? U.minutesToTime(endMinutes)
                : U.normalizeTime(firstCell.end_time || ''),
            start_minutes: startMinutes,
            end_minutes: endMinutes,
            memo: uniqueMemo.join(' / '),
            status: status,
            slot_lane: firstItem.slotLane
        };
    }

    window.V3BlockBuilder = { buildBlocks: buildBlocks };
})();
