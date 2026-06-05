// renderer.js — view-model → HTML string
// window.V3Renderer = { renderAllView, renderDayView }

(function () {
    const U = window.V3Utils;
    const DAYS = ['월', '화', '수', '목', '금'];

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
    }

    // 담당자 이름 2글자 축약
    function shortTeacher(value) {
        var text = U.normalizeKey(value);
        if (!text || text === '미정') return '-';
        var compact = text.replace(/선생님|teacher/ig, '').trim() || text;
        return Array.from(compact).slice(0, 2).join('');
    }

    // 학생 칩 이름 최대 3글자
    function chipName(name) {
        var text = U.normalizeStudentName(name);
        var chars = Array.from(text);
        return chars.length > 3 ? chars.slice(0, 3).join('') : text;
    }

    // 교시 범위 레이블: '4교시' or '4~5교시'
    function periodRangeLabel(block) {
        if (!block.periods || !block.periods.length) return '';
        if (block.periods.length === 1) return block.periods[0].period_label || '';
        var first = block.periods[0].period_label || '';
        var last = block.periods[block.periods.length - 1].period_label || '';
        return first + '~' + last;
    }

    // ── 카드 내부: 교재 행 ───────────────────────────────────────────
    // V2 eie-v2-card-material-row 구조와 동일
    function renderMaterialRow(block) {
        var periodLabel = esc(periodRangeLabel(block));
        var material = esc(block.material || '교재 없음');
        return '<div class="v3-card-material-row">'
            + '<span class="v3-card-period-chip">' + periodLabel + '</span>'
            + '<strong class="v3-card-material-chip">' + material + '</strong>'
            + '</div>';
    }

    // ── 카드 내부: 요일별 담당 그리드 ─────────────────────────────────
    // V2 eie-v2-card-days-row 구조와 동일
    function renderSchedule(block, selectedDay) {
        // head row: 빈칸 + 월화수목금
        var headCells = '<span class="v3-card-period-col"></span>'
            + DAYS.map(function (d) {
                return '<span class="v3-card-day-head">' + esc(d) + '</span>';
            }).join('');

        // body rows: 교시라벨 + 5요일 담당칩
        var bodyRows = block.periods.map(function (period) {
            var dayCells = DAYS.map(function (day) {
                var teachers = (period.day_teachers && period.day_teachers[day]) || [];
                var teacher = teachers[0] || '';
                var key = U.teacherKey(teacher);
                var isPrep = U.normalizeKey(teacher).toUpperCase() === 'PREP';
                var isActive = !!(selectedDay && day === selectedDay);
                var cls = 'v3-card-day-chip';
                if (isPrep) cls += ' is-prep';
                if (isActive) cls += ' is-active';
                var label = teacher ? esc(shortTeacher(teacher)) : '-';
                return '<span class="' + cls + '" data-teacher-key="' + esc(key) + '" title="' + esc(teacher) + '">'
                    + label + '</span>';
            }).join('');

            return '<span class="v3-card-period-col v3-card-period-label">'
                + esc(period.period_label || '')
                + '</span>'
                + dayCells;
        }).join('');

        return '<div class="v3-card-schedule">'
            + '<div class="v3-card-days-grid">'
            + headCells
            + bodyRows
            + '</div>'
            + '</div>';
    }

    // ── 카드 내부: 학생 칩 목록 ─────────────────────────────────────
    // V2 eie-v2-card-students / eie-v2-card-student 구조와 동일
    function renderStudents(students) {
        if (!Array.isArray(students) || !students.length) {
            return '<div class="v3-card-students v3-card-students--empty">학생 없음</div>';
        }
        var sorted = students.slice().sort(function (a, b) {
            var ap = U.isPausedStudent(a) ? 1 : 0;
            var bp = U.isPausedStudent(b) ? 1 : 0;
            if (ap !== bp) return ap - bp;
            return (U.normalizeStudentName(a.name || '')).localeCompare(
                U.normalizeStudentName(b.name || ''), 'ko');
        });
        var chips = sorted.map(function (s) {
            var paused = U.isPausedStudent(s);
            var cls = 'v3-card-student' + (paused ? ' is-paused' : '');
            return '<span class="' + cls + '" title="' + esc(s.name || '') + '">'
                + esc(chipName(s.name || '')) + '</span>';
        }).join('');
        return '<div class="v3-card-students">' + chips + '</div>';
    }

    // ── 블록 카드 ─────────────────────────────────────────────────────
    function renderBlockCard(block, selectedDay) {
        return '<div class="v3-week-card" data-block-id="' + esc(block.block_id) + '">'
            + renderMaterialRow(block)
            + renderSchedule(block, selectedDay || null)
            + renderStudents(block.students)
            + '</div>';
    }

    // ── 슬롯: 카드 1개면 1열, 2개 이상이면 inline 2열 grid ─────────────
    function renderSlot(col, blockList, selectedDay) {
        var cards = (blockList || []).map(function (block) {
            return renderBlockCard(block, selectedDay);
        }).join('');

        var hasMultiple = blockList && blockList.length >= 2;
        var cls = 'v3-teacher-slot' + (hasMultiple ? ' has-multiple-cards' : '');
        var style = hasMultiple
            ? ' style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;align-items:start;"'
            : '';

        return '<div class="' + cls + '" data-teacher-key="' + esc(col.key) + '"' + style + '>'
            + (cards || '<div class="v3-slot-empty"></div>')
            + '</div>';
    }

    // ── 보드 전체 그리드 ─────────────────────────────────────────────
    function renderBoardGrid(columns, rows, selectedDay) {
        // 헤더: 코너 + 선생님 열 헤더들
        var corner = '<div class="v3-board-corner"></div>';
        var colHeaders = columns.map(function (col) {
            return '<div class="v3-teacher-header" data-teacher-key="' + esc(col.key) + '">'
                + esc(col.name) + '</div>';
        }).join('');

        // 교시 row들
        var periodRows = rows.map(function (row) {
            var periodHead = '<div class="v3-period-head">'
                + '<strong>' + esc(row.period_label) + '</strong>'
                + '<span>' + esc(row.start_time) + '~' + esc(row.end_time) + '</span>'
                + '</div>';

            var slots = columns.map(function (col) {
                var blockList = (row.slots && row.slots.get(col.key)) || [];
                return renderSlot(col, blockList, selectedDay);
            }).join('');

            return '<div class="v3-period-row">'
                + periodHead
                + slots
                + '</div>';
        }).join('');

        // grid-template-columns: 교시열 고정 + 선생님열 × N — repeat(calc()) 회피
        var teacherCols = columns.map(function () {
            return 'minmax(var(--v3-teacher-col-min,170px),1fr)';
        }).join(' ');
        var gridCols = 'var(--v3-period-col-width,54px) ' + teacherCols;
        var minWidth = 'calc(var(--v3-period-col-width,54px) + '
            + columns.length + ' * var(--v3-teacher-col-min,170px) + '
            + Math.max(0, columns.length) + ' * 6px)';

        return '<div class="v3-board-grid" style="grid-template-columns:'
            + gridCols + ';min-width:' + minWidth + ';">'
            + corner
            + colHeaders
            + periodRows
            + '</div>';
    }

    // ── 공개 API ─────────────────────────────────────────────────────
    function renderAllView(viewModel) {
        if (!viewModel || !viewModel.rows || !viewModel.columns) {
            return '<div class="v3-empty">시간표 데이터가 없습니다.</div>';
        }
        return '<div class="v3-board"><div class="v3-board-scroll">'
            + renderBoardGrid(viewModel.columns, viewModel.rows, null)
            + '</div></div>';
    }

    function renderDayView(viewModel) {
        if (!viewModel) return '<div class="v3-empty">시간표 데이터가 없습니다.</div>';
        var columns = viewModel.columns || [];
        var rows = viewModel.rows || [];
        var prepBlocks = viewModel.prepBlocks || [];
        var day = viewModel.day || '';

        var mainHtml;
        if (!rows.length && !prepBlocks.length) {
            mainHtml = '<div class="v3-empty">' + esc(day) + '요일 수업이 없습니다.</div>';
        } else {
            mainHtml = '<div class="v3-board"><div class="v3-board-scroll">'
                + renderBoardGrid(columns, rows, day)
                + '</div></div>';
        }

        var prepHtml = '';
        if (prepBlocks.length) {
            var cards = prepBlocks.map(function (block) {
                return renderBlockCard(block, day);
            }).join('');
            prepHtml = '<div class="v3-prep-section">'
                + '<div class="v3-prep-section-title">PREP</div>'
                + '<div class="v3-prep-cards">' + cards + '</div>'
                + '</div>';
        }

        return mainHtml + prepHtml;
    }

    window.V3Renderer = {
        renderAllView: renderAllView,
        renderDayView: renderDayView
    };
})();
