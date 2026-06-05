// day-view-builder.js — blocks[] → view-model (배치 전용)
// window.V3DayViewBuilder = { buildAllView, buildDayView }

(function () {
    const U = window.V3Utils;

    // block 안의 모든 period에서 해당 요일 담당자 다수결 반환
    function blockDayTeacher(block, day) {
        const teacherCounts = new Map();
        (block.periods || []).forEach(function (period) {
            const teachers = (period.day_teachers && period.day_teachers[day]) || [];
            if (teachers[0]) {
                const t = teachers[0];
                teacherCounts.set(t, (teacherCounts.get(t) || 0) + 1);
            }
        });
        if (!teacherCounts.size) return null;
        const sorted = Array.from(teacherCounts.entries()).sort(function (a, b) { return b[1] - a[1]; });
        return sorted[0][0];
    }

    // PREP 판정: 해당 요일 담당자 중 PREP 포함 여부
    function isPrepOnDay(block, day) {
        return (block.periods || []).some(function (period) {
            const teachers = (period.day_teachers && period.day_teachers[day]) || [];
            return teachers.some(function (t) { return U.normalizeKey(t).toUpperCase() === 'PREP'; });
        });
    }

    // block span row 구조 빌드 헬퍼
    // V3의 row는 개별 period row가 아니라 block이 실제로 차지하는 교시 범위(row span) 기준이다.
    // 예: periods [4, 5] → row label "4~5교시", time "17:10~18:30"
    function sortedPeriodsOf(block) {
        return (block && Array.isArray(block.periods) ? block.periods : [])
            .slice()
            .sort(function (a, b) {
                var ao = Number(a && a.period_order || 0);
                var bo = Number(b && b.period_order || 0);
                if (ao !== bo) return ao - bo;
                return U.normalizeKey(a && a.start_time || '').localeCompare(U.normalizeKey(b && b.start_time || ''));
            });
    }

    function periodLabelNumber(label) {
        var match = U.normalizeKey(label).match(/\d+/);
        return match ? match[0] : '';
    }

    function blockRowLabel(block) {
        var periods = sortedPeriodsOf(block);
        if (!periods.length) return '';
        if (periods.length === 1) return periods[0].period_label || '';
        var first = periods[0].period_label || '';
        var last = periods[periods.length - 1].period_label || '';
        var firstNo = periodLabelNumber(first);
        var lastNo = periodLabelNumber(last);
        if (firstNo && lastNo) return firstNo + '~' + lastNo + '교시';
        return first + '~' + last;
    }

    function blockRowStartTime(block) {
        var direct = U.normalizeTime(block && block.start_time || '');
        if (direct) return direct;
        var periods = sortedPeriodsOf(block);
        return periods.length ? U.normalizeTime(periods[0].start_time || '') : '';
    }

    function blockRowEndTime(block) {
        var direct = U.normalizeTime(block && block.end_time || '');
        if (direct) return direct;
        var periods = sortedPeriodsOf(block);
        return periods.length ? U.normalizeTime(periods[periods.length - 1].end_time || '') : '';
    }

    function blockRowStartOrder(block) {
        var periods = sortedPeriodsOf(block);
        return periods.length ? Number(periods[0].period_order || 0) : 0;
    }

    function blockRowEndOrder(block) {
        var periods = sortedPeriodsOf(block);
        return periods.length ? Number(periods[periods.length - 1].period_order || 0) : blockRowStartOrder(block);
    }

    function blockRowKey(block) {
        return [
            blockRowStartOrder(block),
            blockRowEndOrder(block),
            blockRowStartTime(block),
            blockRowEndTime(block),
            blockRowLabel(block)
        ].join('|');
    }

    function collectBlockRows(blocks) {
        const map = new Map();
        (blocks || []).forEach(function (block) {
            const key = blockRowKey(block);
            if (!map.has(key)) {
                map.set(key, {
                    row_key: key,
                    start_order: blockRowStartOrder(block),
                    end_order: blockRowEndOrder(block),
                    period_label: blockRowLabel(block),
                    start_time: blockRowStartTime(block),
                    end_time: blockRowEndTime(block)
                });
            }
        });
        return Array.from(map.values()).sort(function (a, b) {
            if (a.start_order !== b.start_order) return a.start_order - b.start_order;
            if (a.end_order !== b.end_order) return a.end_order - b.end_order;
            return U.normalizeKey(a.start_time).localeCompare(U.normalizeKey(b.start_time));
        });
    }

    // buildAllView: 전체 보기 (담임 5열 고정)
    function buildAllView(blocks) {
        const columns = U.HOMEROOM_COLUMN_TEACHERS.map(function (name) {
            return { name: name, key: U.teacherKey(name) };
        });

        const rowInfos = collectBlockRows(blocks);

        const rows = rowInfos.map(function (rowInfo) {
            const slots = new Map();
            columns.forEach(function (col) {
                slots.set(col.key, []);
            });

            (blocks || []).forEach(function (block) {
                if (blockRowKey(block) !== rowInfo.row_key) return;
                const colKey = U.teacherKey(block.column_teacher || block.homeroom_teacher || '');
                if (slots.has(colKey)) {
                    slots.get(colKey).push(block);
                }
            });

            return {
                row_key: rowInfo.row_key,
                start_order: rowInfo.start_order,
                end_order: rowInfo.end_order,
                period_label: rowInfo.period_label,
                start_time: rowInfo.start_time,
                end_time: rowInfo.end_time,
                slots: slots
            };
        });

        return { columns: columns, rows: rows };
    }

    // buildDayView: 요일별 보기
    function buildDayView(blocks, day) {
        // 선택 요일에 담당 없는 block 제외, PREP 별도 분리
        const prepBlocks = [];
        const normalBlocks = [];

        (blocks || []).forEach(function (block) {
            if (isPrepOnDay(block, day)) {
                prepBlocks.push(block);
                return;
            }
            const teacher = blockDayTeacher(block, day);
            if (!teacher) return; // 해당 요일 담당 없음
            if (U.normalizeKey(teacher).toUpperCase() === 'PREP') {
                prepBlocks.push(block);
            } else {
                normalBlocks.push(block);
            }
        });

        // columns: 등장하는 선생님, HOMEROOM_COLUMN_TEACHERS 순서 우선
        const teacherSet = new Map(); // key → name
        normalBlocks.forEach(function (block) {
            const teacher = blockDayTeacher(block, day);
            if (!teacher) return;
            const key = U.teacherKey(teacher);
            if (!teacherSet.has(key)) teacherSet.set(key, teacher);
        });

        const columns = [];
        // HOMEROOM_COLUMN_TEACHERS 순서로 먼저
        U.HOMEROOM_COLUMN_TEACHERS.forEach(function (name) {
            const key = U.teacherKey(name);
            if (teacherSet.has(key)) {
                columns.push({ name: name, key: key });
                teacherSet.delete(key);
            }
        });
        // 나머지 이름순
        const remaining = Array.from(teacherSet.entries()).sort(function (a, b) {
            return a[1].localeCompare(b[1], 'ko');
        });
        remaining.forEach(function (entry) {
            columns.push({ name: entry[1], key: entry[0] });
        });

        const rowInfos = collectBlockRows(normalBlocks);

        const rows = rowInfos.map(function (rowInfo) {
            const slots = new Map();
            columns.forEach(function (col) { slots.set(col.key, []); });

            normalBlocks.forEach(function (block) {
                if (blockRowKey(block) !== rowInfo.row_key) return;
                const teacher = blockDayTeacher(block, day);
                if (!teacher) return;
                const colKey = U.teacherKey(teacher);
                if (slots.has(colKey)) {
                    slots.get(colKey).push(block);
                }
            });

            return {
                row_key: rowInfo.row_key,
                start_order: rowInfo.start_order,
                end_order: rowInfo.end_order,
                period_label: rowInfo.period_label,
                start_time: rowInfo.start_time,
                end_time: rowInfo.end_time,
                slots: slots
            };
        });

        return {
            day: day,
            columns: columns,
            rows: rows,
            prepBlocks: prepBlocks
        };
    }

    window.V3DayViewBuilder = {
        buildAllView: buildAllView,
        buildDayView: buildDayView,
        blockDayTeacher: blockDayTeacher
    };
})();
