(function () {
    var EIE_GRADE_COLS = [
        { semester: '1학기', examType: 'midterm', key: '1H-mid', label: '중간' },
        { semester: '1학기', examType: 'final', key: '1H-fin', label: '기말' },
        { semester: '2학기', examType: 'midterm', key: '2H-mid', label: '중간' },
        { semester: '2학기', examType: 'final', key: '2H-fin', label: '기말' }
    ];

    var DEFAULT_TESTS = [
        { id: 'month_end', title: 'Monthly', scoreType: 'score', maxScore: null },
        { id: 'vocab', title: 'Vocabulary', scoreType: 'score', maxScore: null },
        { id: 'grammar', title: 'Grammar', scoreType: 'score', maxScore: null },
        { id: 'reading', title: 'Reading', scoreType: 'score', maxScore: null },
        { id: 'listening', title: 'Listening', scoreType: 'score', maxScore: null },
        { id: 'speaking', title: 'Speaking', scoreType: 'score', maxScore: null },
        { id: 'writing', title: 'Writing', scoreType: 'score', maxScore: null },
        { id: 'dictation', title: 'Dictation', scoreType: 'score', maxScore: null },
        { id: 'memo', title: 'Memo', scoreType: 'memo', maxScore: null }
    ];

    var TEST_TITLE_ALIASES = {
        '월말평가': 'Monthly',
        '단어시험': 'Vocabulary',
        '문법시험': 'Grammar',
        'Reading Test': 'Reading',
        'Listening Test': 'Listening',
        'Dictation Test': 'Dictation',
        '메모': 'Memo'
    };

    var _cells = [];
    var _students = [];
    var _schoolRows = [];
    var _academyRows = [];
    var _sheets = [];
    var _loaded = false;
    var _error = '';
    var _notice = '';
    var _mode = 'school';
    var _classId = '';
    var _teacherId = '';
    var _teacherName = '';
    var _monthKey = '';
    var _schoolSection = 'middle';
    var _schoolGradeTab = '';
    var _schoolSort = 'default';
    var _schoolSortCol = '1H-mid';
    var _year = new Date().getFullYear();
    var _studentFocusId = '';
    var _studentFocusName = '';
    var _manageOpen = false;
    var _formOpen = false;
    var _saving = false;
    var _schoolDirty = {};
    var _academyDirty = {};
    var _sheetDirty = false;
    var _sheetDraftTests = null;
    var _editingTestId = '';

    function esc(value) {
        if (window.EieApp && typeof EieApp.escapeHtml === 'function') return EieApp.escapeHtml(value == null ? '' : value);
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function jsArg(value) {
        return esc(JSON.stringify(String(value == null ? '' : value)));
    }

    function todayMonthKey() {
        return new Date().toLocaleDateString('sv-SE').slice(0, 7);
    }

    function stateDb() {
        var state = window.EieState && typeof EieState.get === 'function' ? EieState.get() : {};
        return state && state.db ? state.db : {};
    }

    function rowsFrom(payload, names) {
        for (var i = 0; i < names.length; i += 1) {
            if (Array.isArray(payload && payload[names[i]])) return payload[names[i]];
        }
        return Array.isArray(payload && payload.data) ? payload.data : [];
    }

    function rawOf(row) {
        if (row && row.raw && typeof row.raw === 'object') return row.raw;
        var value = row && row.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try {
            var parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function parseJsonObject(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try {
            var parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function recordMeta(row) {
        return Object.assign({}, parseJsonObject(row && row.raw_meta_json), parseJsonObject(row && row.payload_json));
    }

    function displayName(student) {
        return text(student && (student.display_name || student.name || student.student_name_raw || student.normalized_name)) || '-';
    }

    function classNameOfCell(cell) {
        var raw = rawOf(cell);
        return text(cell && (cell.class_name_raw || cell.class_name || cell.name || cell.material))
            || text(raw.class_name_raw || raw.class_name || raw.name || raw.material)
            || '담당 반';
    }

    function normalizeEieGrade(value) {
        if (window.EieGradeUtils && typeof EieGradeUtils.normalizeEieGrade === 'function') {
            return EieGradeUtils.normalizeEieGrade(value);
        }
        var raw = text(value).replace(/\s+/g, '');
        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];
        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];
        return /^중[1-3]$|^고[1-3]$/.test(raw) ? raw : '';
    }

    function gradeOfStudent(student) {
        var raw = rawOf(student);
        return normalizeEieGrade(student && (student.grade || student.grade_raw))
            || normalizeEieGrade(raw.grade || raw.grade_raw)
            || '';
    }

    function isHighStudent(student) {
        var grade = gradeOfStudent(student);
        return /^고[1-3]$/.test(grade);
    }

    function getStudentId(student) {
        return text(student && (student.student_id || student.id || student.eie_student_id));
    }

    function getCellStudents(cell) {
        return Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : [];
    }

    function flattenStudentsFromCells(cells) {
        var map = {};
        (cells || []).forEach(function (cell) {
            getCellStudents(cell).forEach(function (student) {
                var sid = getStudentId(student) || text(student.assignment_id || displayName(student));
                if (!sid || map[sid]) return;
                map[sid] = Object.assign({}, student, {
                    id: getStudentId(student) || sid,
                    class_id: text(cell.id),
                    className: classNameOfCell(cell)
                });
            });
        });
        return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
            return displayName(a).localeCompare(displayName(b), 'ko', { numeric: true });
        });
    }

    function getSelectedCell() {
        if (!_classId) return null;
        return _cells.find(function (cell) { return text(cell && cell.id) === text(_classId); }) || null;
    }

    function getEieGradeExamRecord(studentId, year, semester, examType, subject) {
        var subj = text(subject || 'english') || 'english';
        return (_schoolRows || []).find(function (row) {
            return text(row.student_id || row.studentId) === text(studentId)
                && Number(row.exam_year || row.examYear) === Number(year)
                && text(row.semester) === text(semester)
                && text(row.exam_type || row.examType) === text(examType)
                && text(row.subject || 'english') === subj
                && text(row.status || 'active') !== 'archived';
        }) || null;
    }

    function getEieGradeVisibleStudents() {
        var students = _classId ? flattenStudentsFromCells([getSelectedCell()].filter(Boolean)) : flattenStudentsFromCells(_cells);
        students = students.filter(function (student) {
            var grade = gradeOfStudent(student);
            if (!grade) return false;
            return _schoolSection === 'high' ? /^고[1-3]$/.test(grade) : /^중[1-3]$/.test(grade);
        });
        if (_schoolGradeTab) {
            students = students.filter(function (student) { return gradeOfStudent(student) === _schoolGradeTab; });
        }
        if (_studentFocusId) {
            students = students.filter(function (student) { return getStudentId(student) === _studentFocusId; });
        }
        return students;
    }

    function getAcademyVisibleStudents() {
        var students = _classId ? flattenStudentsFromCells([getSelectedCell()].filter(Boolean)) : flattenStudentsFromCells(_cells);
        if (_studentFocusId) {
            students = students.filter(function (student) { return getStudentId(student) === _studentFocusId; });
        }
        return students;
    }

    function getPrevEieGradeColKey(key) {
        var order = ['1H-mid', '1H-fin', '2H-mid', '2H-fin'];
        var idx = order.indexOf(key);
        return idx > 0 ? order[idx - 1] : null;
    }

    function getEieGradeScore(studentId, year, colKey, subject) {
        var col = EIE_GRADE_COLS.find(function (item) { return item.key === colKey; });
        if (!col) return null;
        var rec = getEieGradeExamRecord(studentId, year, col.semester, col.examType, subject || 'english');
        if (!rec || rec.score === null || rec.score === undefined || rec.score === '') return null;
        var n = Number(rec.score);
        return Number.isFinite(n) ? n : null;
    }

    function calcEieGradeAvg(scores) {
        var valid = (scores || []).filter(function (score) { return score !== null && Number.isFinite(score); });
        if (!valid.length) return null;
        return Math.round(valid.reduce(function (a, b) { return a + b; }, 0) / valid.length * 10) / 10;
    }

    function buildEieGradeTrendHtml(curr, prev) {
        if (curr === null || prev === null) return '';
        var diff = curr - prev;
        if (diff === 0) return '';
        return '<div class="eie-grade-trend ' + (diff > 0 ? 'is-up' : 'is-down') + '">' + (diff > 0 ? '▲' : '▼') + Math.abs(diff) + '</div>';
    }

    function buildEieGradeAvgRow(label, students, year, isGradeAvg) {
        var cols = EIE_GRADE_COLS.map(function (col, i) {
            var scores = students.map(function (student) { return getEieGradeScore(getStudentId(student), year, col.key, 'english'); }).filter(function (score) { return score !== null; });
            var avg = calcEieGradeAvg(scores);
            return '<td class="' + ((i === 0 || i === 2) ? 'eie-grade-border2 ' : '') + 'eie-grade-avg-cell">' + (avg !== null ? esc(avg) : '-') + '</td>';
        }).join('');
        return '<tr class="' + (isGradeAvg ? 'is-grade-avg' : 'is-class-avg') + '">'
            + '<td class="eie-grade-sticky-grade"></td><td class="eie-grade-sticky-class"></td><td class="eie-grade-sticky-name">' + esc(label) + '</td>'
            + cols
            + '</tr>';
    }

    function _eieGradeToggleSortCol() {
        var col = document.getElementById('eie-grade-sort-col');
        var sort = document.getElementById('eie-grade-sort');
        if (col && sort) col.style.display = sort.value === 'score-desc' ? 'block' : 'none';
    }

    function closeEieGradeLedger() {
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
    }

    async function loadFoundation() {
        if (_loaded) return;
        try {
            var db = stateDb();
            _cells = Array.isArray(db.timetable_cells) && db.timetable_cells.length ? db.timetable_cells : [];
            _students = Array.isArray(db.students) ? db.students : [];

            var api = window.EieApi;
            var year = Number(_year) || new Date().getFullYear();
            var monthKey = _monthKey || todayMonthKey();
            var noop = Promise.resolve(null);

            // 진입에 필요한 조회를 직렬이 아닌 병렬로 한 번에 보낸다(왕복 지연 누적 제거).
            var results = await Promise.all([
                (!_cells.length && api && typeof api.getTimetable === 'function')
                    ? api.getTimetable(null, { status: 'active,imported,needs_review' }) : noop,
                (!_students.length && api && typeof api.getStudents === 'function')
                    ? api.getStudents() : noop,
                (api && typeof api.getSchoolGradeRecords === 'function')
                    ? api.getSchoolGradeRecords({ class_id: _classId, exam_year: year }) : noop,
                (api && typeof api.getGradeSheets === 'function')
                    ? api.getGradeSheets({ class_id: _classId, month_key: monthKey, sheet_type: 'academy' }) : noop,
                (api && typeof api.getExamRecords === 'function')
                    ? api.getExamRecords({ timetable_cell_id: _classId, month: monthKey }) : noop
            ]);

            if (results[0]) {
                _cells = rowsFrom(results[0], ['timetable_cells', 'cells']);
                if (window.EieState && typeof EieState.setTimetableCells === 'function') EieState.setTimetableCells(_cells);
            }
            if (results[1]) {
                _students = rowsFrom(results[1], ['students', 'confirmed_students']);
                if (window.EieState && typeof EieState.setStudents === 'function') EieState.setStudents(_students);
            }
            if (results[2]) _schoolRows = rowsFrom(results[2], ['school_grade_records', 'records']);
            if (results[3]) _sheets = rowsFrom(results[3], ['grade_sheets', 'sheets']);
            if (results[4]) _academyRows = rowsFrom(results[4], ['exam_records', 'records']);
            _error = '';
        } catch (error) {
            _error = error && error.message ? error.message : '성적표 정보를 불러오지 못했습니다.';
        } finally {
            _loaded = true;
        }
    }

    function openEieGradeLedger(options) {
        var opts = options || {};
        _classId = text(opts.classId || opts.class_id || _classId);
        _teacherId = text(opts.teacherId || opts.teacher_id || _teacherId);
        _teacherName = text(opts.teacherName || opts.teacher_name || _teacherName);
        _studentFocusId = text(opts.studentId || opts.student_id || opts.focusStudentId || opts.focus_student_id || '');
        _studentFocusName = text(opts.studentName || opts.student_name || opts.focusStudentName || opts.focus_student_name || '');
        _mode = text(opts.mode) === 'academy' ? 'academy' : text(opts.mode) === 'school' ? 'school' : (_mode || 'school');
        _monthKey = text(opts.monthKey || opts.month_key || _monthKey) || todayMonthKey();
        _year = Number(opts.year || _year) || new Date().getFullYear();
        _loaded = false;
        _manageOpen = false;
        _formOpen = false;
        _schoolDirty = {};
        _academyDirty = {};
        _sheetDraftTests = null;
        _editingTestId = '';
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('grades');
    }

    function openStudentGradeLedger(options) {
        var opts = options || {};
        opts.studentId = opts.studentId || opts.student_id || opts.focusStudentId || opts.focus_student_id || '';
        opts.studentName = opts.studentName || opts.student_name || opts.focusStudentName || opts.focus_student_name || '';
        opts.mode = text(opts.mode) || 'academy';
        return openEieGradeLedger(opts);
    }

    function selectedSheet() {
        var classKey = text(_classId);
        var month = _monthKey || todayMonthKey();
        return (_sheets || []).find(function (sheet) {
            return text(sheet.class_id || sheet.classId) === classKey
                && text(sheet.month_key || sheet.monthKey) === month
                && text(sheet.sheet_type || sheet.sheetType || 'academy') === 'academy'
                && text(sheet.status || 'active') !== 'archived';
        }) || null;
    }

    function parseSheetTests(sheet) {
        var value = sheet && (sheet.tests || sheet.items || sheet.columns_json || sheet.items_json);
        if (Array.isArray(value)) return value;
        if (typeof value === 'string' && value) {
            try {
                var parsed = JSON.parse(value);
                if (Array.isArray(parsed)) return parsed;
            } catch (error) {}
        }
        return [];
    }

    function normalizeScoreType(type) {
        var value = text(type);
        if (value === 'fraction') return 'fraction';
        if (value === 'memo') return 'memo';
        return 'score';
    }

    function normalizeExamDate(value) {
        var raw = text(value);
        return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
    }

    function testExamDate(test) {
        return normalizeExamDate(test && (test.examDate || test.exam_date || test.date));
    }

    function normalizeTestTitle(title) {
        var raw = text(title);
        return TEST_TITLE_ALIASES[raw] || raw;
    }

    function formatExamDateLabel(test) {
        var date = testExamDate(test);
        if (!date) return '';
        var parts = date.split('-');
        return Number(parts[1]) + '/' + Number(parts[2]);
    }

    function testIdentity(test) {
        return text(test && test.title).toLowerCase() + '|' + testExamDate(test);
    }

    function slugTestTitle(title) {
        var slug = text(title).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        return slug || 'test';
    }

    function uniqueTestId(tests, title, examDate) {
        var base = slugTestTitle(title) + (examDate ? '_' + examDate.replace(/-/g, '') : '');
        var used = {};
        tests.forEach(function (item) { used[text(item && item.id)] = true; });
        var id = base;
        var i = 2;
        while (used[id]) {
            id = base + '_' + i;
            i += 1;
        }
        return id;
    }

    function maxScoreFromInput(scoreType) {
        if (normalizeScoreType(scoreType) !== 'fraction') return null;
        var max = Number(document.getElementById('eie-new-test-max') && document.getElementById('eie-new-test-max').value);
        return Number.isFinite(max) && max > 0 ? max : null;
    }

    function formDateEnabled() {
        var enable = document.getElementById('eie-new-test-date-enable');
        return !!(enable && enable.checked);
    }

    function formExamDate() {
        if (!formDateEnabled()) return '';
        return normalizeExamDate(document.getElementById('eie-new-test-date') && document.getElementById('eie-new-test-date').value);
    }

    function normalizeTestItem(item) {
        return Object.assign({}, item, {
            title: normalizeTestTitle(item && item.title),
            scoreType: normalizeScoreType(item && item.scoreType),
            examDate: testExamDate(item)
        });
    }

    function fullTestList() {
        if (!_sheetDraftTests) {
            var fromSheet = parseSheetTests(selectedSheet()).map(normalizeTestItem);
            _sheetDraftTests = fromSheet.length ? fromSheet : DEFAULT_TESTS.filter(function (item) {
                return item.id === 'month_end' || item.id === 'vocab' || item.id === 'reading' || item.id === 'memo';
            }).map(normalizeTestItem);
        }
        return _sheetDraftTests;
    }

    function activeTests() {
        var enabled = fullTestList().filter(function (item) { return item && item.enabled !== false; });
        // 메모(텍스트) 시험은 항상 표 제일 뒤로 배치한다. 같은 종류 안에서는 입력 순서를 유지한다.
        return enabled
            .map(function (item, index) { return { item: item, index: index }; })
            .sort(function (a, b) {
                var am = normalizeScoreType(a.item.scoreType) === 'memo' ? 1 : 0;
                var bm = normalizeScoreType(b.item.scoreType) === 'memo' ? 1 : 0;
                return am - bm || a.index - b.index;
            })
            .map(function (entry) { return entry.item; });
    }

    function draftTests() {
        return fullTestList();
    }

    function testById(id) {
        var key = text(id);
        return fullTestList().find(function (item) { return text(item && item.id) === key; }) || null;
    }

    function testChoiceList() {
        var byKey = {};
        var list = [];
        DEFAULT_TESTS.concat(fullTestList()).map(normalizeTestItem).forEach(function (item) {
            if (!item) return;
            var title = text(item.title);
            var id = text(item.id) || title;
            var examDate = testExamDate(item);
            var key = (examDate ? title + '|' + examDate : (id || title)).toLowerCase();
            var titleKey = title.toLowerCase();
            if (!key || byKey[key] || (!examDate && byKey[titleKey])) return;
            byKey[key] = true;
            if (titleKey && !examDate) byKey[titleKey] = true;
            list.push(item);
        });
        return list;
    }

    function classOptions(placeholder) {
        return '<option value="">' + esc(placeholder || '전체 반') + '</option>' + (_cells || []).map(function (cell) {
            return '<option value="' + esc(text(cell.id)) + '"' + (text(cell.id) === _classId ? ' selected' : '') + '>' + esc(classNameOfCell(cell)) + '</option>';
        }).join('');
    }

    function yearOptions() {
        var current = new Date().getFullYear();
        var html = '';
        for (var i = -2; i <= 2; i += 1) {
            var year = current + i;
            html += '<option value="' + year + '"' + (year === Number(_year) ? ' selected' : '') + '>' + year + '</option>';
        }
        return html;
    }

    function currentDirtyCount() {
        if (_mode === 'academy') return Object.keys(_academyDirty).length + (_sheetDirty ? 1 : 0);
        return Object.keys(_schoolDirty).length;
    }

    function renderDirtyBadge() {
        var count = currentDirtyCount();
        if (!count) return '<span id="eie-grade-dirty-badge" class="eie-grade-dirty-badge is-clean">저장됨</span>';
        return '<span id="eie-grade-dirty-badge" class="eie-grade-dirty-badge">' + esc('변경 ' + count + '개') + '</span>';
    }

    function updateDirtyUi() {
        var count = currentDirtyCount();
        var badge = document.getElementById('eie-grade-dirty-badge');
        var save = document.getElementById('eie-grade-save-btn');
        if (badge) {
            badge.className = 'eie-grade-dirty-badge' + (count ? '' : ' is-clean');
            badge.textContent = count ? '변경 ' + count + '개' : '저장됨';
        }
        if (save && !_saving) {
            save.disabled = !count;
            if (count) save.classList.add('is-active');
            else save.classList.remove('is-active');
        }
    }

    function renderHeader() {
        var dirtyCount = currentDirtyCount();
        var focusName = _studentFocusName || '';
        return '<div class="eie-grade-head">'
            + '<button type="button" class="eie-grade-title" onclick="EieGradeLedgerView.closeLedger()">성적표</button>'
            + (focusName || _studentFocusId ? '<span class="eie-grade-focus-chip">개인 · ' + esc(focusName || _studentFocusId) + '</span>' : '')
            + '<div class="eie-grade-head-actions">'
            + renderDirtyBadge()
            + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setYear(this.value)">' + yearOptions() + '</select>'
            + '<button type="button" id="eie-grade-save-btn" class="eie-grade-save-btn' + (dirtyCount ? ' is-active' : '') + '" onclick="EieGradeLedgerView.saveAll()" ' + (_saving || !dirtyCount ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '전체 저장') + '</button>'
            + '</div>'
            + '</div>'
            + '<div class="eie-grade-tabs">'
            + '<button type="button" class="' + (_mode === 'school' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\'school\')">학교성적</button>'
            + '<button type="button" class="' + (_mode === 'academy' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\'academy\')">원내평가</button>'
            + '</div>';
    }

    function renderSchoolControls() {
        var grades = _schoolSection === 'high' ? ['고1', '고2', '고3'] : ['중1', '중2', '중3'];
        return '<div class="eie-grade-controls">'
            + '<div class="eie-grade-section-tabs">'
            + '<button type="button" class="' + (_schoolSection === 'middle' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setSchoolSection(\'middle\')">중등</button>'
            + '<button type="button" class="' + (_schoolSection === 'high' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setSchoolSection(\'high\')">고등</button>'
            + '</div>'
            + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setGradeTab(this.value)">'
            + '<option value="">전체 학년</option>'
            + grades.map(function (grade) { return '<option value="' + grade + '"' + (_schoolGradeTab === grade ? ' selected' : '') + '>' + grade + '</option>'; }).join('')
            + '</select>'
            + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setClassId(this.value)">' + classOptions('전체 반') + '</select>'
            + '<select class="eie-grade-ctrl" id="eie-grade-sort" onchange="EieGradeLedgerView.setSort(this.value)">'
            + '<option value="default"' + (_schoolSort === 'default' ? ' selected' : '') + '>반 순서</option>'
            + '<option value="score-desc"' + (_schoolSort === 'score-desc' ? ' selected' : '') + '>점수 높은 순</option>'
            + '</select>'
            + '<select class="eie-grade-ctrl" id="eie-grade-sort-col" style="display:' + (_schoolSort === 'score-desc' ? 'block' : 'none') + '" onchange="EieGradeLedgerView.setSortCol(this.value)">'
            + EIE_GRADE_COLS.map(function (col) { return '<option value="' + col.key + '"' + (_schoolSortCol === col.key ? ' selected' : '') + '>' + col.semester + ' ' + col.label + '</option>'; }).join('')
            + '</select>'
            + '</div>';
    }

    function renderAcademyControls() {
        return '<div class="eie-grade-controls eie-grade-controls--academy">'
            + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setClassId(this.value)">' + classOptions('반 선택') + '</select>'
            + '<input class="eie-grade-ctrl" type="month" value="' + esc(_monthKey || todayMonthKey()) + '" onchange="EieGradeLedgerView.setMonth(this.value)">'
            + '</div>';
    }

    function _buildEieGradeRow(student, year, gradeText, classText) {
        var sid = getStudentId(student);
        var cols = EIE_GRADE_COLS.map(function (col, i) {
            var record = getEieGradeExamRecord(sid, year, col.semester, col.examType, 'english');
            var score = record && record.score !== null && record.score !== undefined && record.score !== '' ? Number(record.score) : null;
            if (!Number.isFinite(score)) score = null;
            var prevKey = getPrevEieGradeColKey(col.key);
            var prevScore = prevKey ? getEieGradeScore(sid, year, prevKey, 'english') : null;
            var value = score !== null ? score : '';
            var recordId = text(record && record.id);
            return '<td class="' + ((i === 0 || i === 2) ? 'eie-grade-border2 ' : '') + 'eie-grade-score-cell">'
                + '<input type="number" class="eie-grade-inp" id="eie-grade-inp-' + esc(sid) + '-' + esc(col.key) + '" value="' + esc(value) + '" min="0" max="100" oninput="EieGradeLedgerView.markSchoolDirty(' + jsArg(sid + '|' + col.key) + ')">'
                + buildEieGradeTrendHtml(score, prevScore)
                + '<div class="eie-grade-cell-actions">'
                + '<button type="button" class="eie-grade-btn-ghost" onclick="EieGradeLedgerView.updateSchoolGradeRecord(' + jsArg(sid) + ', ' + jsArg(col.key) + ')">수정</button>'
                + (recordId ? '<button type="button" class="eie-grade-btn-ghost is-danger" onclick="EieGradeLedgerView.deleteSchoolGradeRecord(' + jsArg(recordId) + ')">삭제</button>' : '')
                + '</div>'
                + '</td>';
        }).join('');
        return '<tr>'
            + '<td class="eie-grade-sticky-grade">' + esc(gradeText || '') + '</td>'
            + '<td class="eie-grade-sticky-class">' + esc(classText || '') + '</td>'
            + '<td class="eie-grade-sticky-name">' + esc(displayName(student)) + '</td>'
            + cols
            + '</tr>';
    }

    function schoolGradePayloadForCell(studentId, colKey) {
        var student = getEieGradeVisibleStudents().find(function (row) { return getStudentId(row) === text(studentId); });
        var col = EIE_GRADE_COLS.find(function (item) { return item.key === text(colKey); });
        if (!student || !col) return { error: 'school grade target not found' };
        var sid = getStudentId(student);
        var raw = text(document.getElementById('eie-grade-inp-' + sid + '-' + col.key) && document.getElementById('eie-grade-inp-' + sid + '-' + col.key).value);
        var score = raw === '' ? null : Number(raw);
        if (raw !== '' && (!Number.isFinite(score) || score < 0 || score > 100)) return { error: 'score must be 0~100' };
        var existing = getEieGradeExamRecord(sid, Number(_year) || new Date().getFullYear(), col.semester, col.examType, 'english');
        return {
            id: text(existing && existing.id),
            payload: {
                student_id: sid,
                studentId: sid,
                class_id: _classId || student.class_id || '',
                classId: _classId || student.class_id || '',
                teacher_id: _teacherId,
                teacherId: _teacherId,
                school_name: student.school_name || student.school || '',
                grade_level: gradeOfStudent(student),
                exam_year: Number(_year) || new Date().getFullYear(),
                examYear: Number(_year) || new Date().getFullYear(),
                semester: col.semester,
                exam_type: col.examType,
                examType: col.examType,
                subject: 'english',
                score: score,
                max_score: 100,
                status: 'active'
            }
        };
    }

    function renderEieSchoolGradeTable() {
        var students = getEieGradeVisibleStudents();
        var year = Number(_year) || new Date().getFullYear();
        if (_schoolSection === 'high') return _renderEieHighGradeTable(students, year);
        if (_schoolSort === 'score-desc') {
            students = students.slice().sort(function (a, b) {
                var sa = getEieGradeScore(getStudentId(a), year, _schoolSortCol, 'english');
                var sb = getEieGradeScore(getStudentId(b), year, _schoolSortCol, 'english');
                if (sa === null && sb === null) return displayName(a).localeCompare(displayName(b), 'ko', { numeric: true });
                if (sa === null) return 1;
                if (sb === null) return -1;
                return sb - sa || displayName(a).localeCompare(displayName(b), 'ko', { numeric: true });
            });
        }
        var byGrade = {};
        students.forEach(function (student) {
            var grade = gradeOfStudent(student);
            if (!byGrade[grade]) byGrade[grade] = [];
            byGrade[grade].push(student);
        });
        var rows = '';
        ['중1', '중2', '중3'].forEach(function (grade) {
            var group = byGrade[grade];
            if (!group || !group.length) return;
            var byClass = {};
            group.forEach(function (student) {
                var cn = student.className || classNameOfCell(getSelectedCell()) || '담당 반';
                if (!byClass[cn]) byClass[cn] = [];
                byClass[cn].push(student);
            });
            Object.keys(byClass).sort(function (a, b) { return a.localeCompare(b, 'ko', { numeric: true }); }).forEach(function (cn) {
                byClass[cn].forEach(function (student, index) {
                    rows += _buildEieGradeRow(student, year, index === 0 ? grade : '', index === 0 ? cn : '');
                });
                rows += buildEieGradeAvgRow('반평균', byClass[cn], year, false);
            });
            rows += buildEieGradeAvgRow('학년평균', group, year, true);
        });
        return schoolTableShell(rows || emptyRow(7, '선택한 조건에 해당하는 학생이 없습니다.'));
    }

    function _renderEieHighGradeTable(students, year) {
        var rows = students.slice().sort(function (a, b) { return displayName(a).localeCompare(displayName(b), 'ko', { numeric: true }); }).map(function (student, index) {
            return _buildEieGradeRow(student, year, index === 0 ? gradeOfStudent(student) : '', student.className || classNameOfCell(getSelectedCell()));
        }).join('');
        return schoolTableShell(rows || emptyRow(7, '선택한 조건에 해당하는 학생이 없습니다.'));
    }

    function schoolTableShell(rows) {
        return '<div id="eie-grade-body" class="eie-grade-table-wrap">'
            + '<table id="eie-grade-tbl" class="eie-grade-table"><thead>'
            + '<tr><th rowspan="2" class="eie-grade-sticky-grade">학년</th><th rowspan="2" class="eie-grade-sticky-class">반</th><th rowspan="2" class="eie-grade-sticky-name">이름</th>'
            + '<th colspan="2" class="eie-grade-border2 eie-grade-semester-1">1학기</th><th colspan="2" class="eie-grade-border2 eie-grade-semester-2">2학기</th></tr>'
            + '<tr><th class="eie-grade-border2 eie-grade-semester-1">중간</th><th class="eie-grade-semester-1">기말</th><th class="eie-grade-border2 eie-grade-semester-2">중간</th><th class="eie-grade-semester-2">기말</th></tr>'
            + '</thead><tbody>' + rows + '</tbody></table></div>';
    }

    function emptyRow(colspan, message) {
        return '<tr><td colspan="' + colspan + '" class="eie-grade-empty">' + esc(message || '학생이 없습니다.') + '</td></tr>';
    }

    async function saveEieSchoolGradeBatch() {
        if (_saving) return;
        var students = getEieGradeVisibleStudents();
        if (!students.length) {
            _notice = '저장할 내용이 없습니다.';
            return renderAgain();
        }
        var year = Number(_year) || new Date().getFullYear();
        var records = [];
        var hasError = false;
        students.forEach(function (student) {
            var sid = getStudentId(student);
            EIE_GRADE_COLS.forEach(function (col) {
                var el = document.getElementById('eie-grade-inp-' + sid + '-' + col.key);
                var raw = text(el && el.value);
                if (raw) {
                    var n = Number(raw);
                    if (!Number.isFinite(n) || n < 0 || n > 100) hasError = true;
                }
                records.push({
                    student_id: sid,
                    studentId: sid,
                    class_id: _classId || student.class_id || '',
                    classId: _classId || student.class_id || '',
                    teacher_id: _teacherId,
                    teacherId: _teacherId,
                    exam_year: year,
                    examYear: year,
                    semester: col.semester,
                    exam_type: col.examType,
                    examType: col.examType,
                    subject: 'english',
                    score: raw === '' ? null : Number(raw),
                    max_score: 100,
                    status: 'active'
                });
            });
        });
        if (hasError) {
            _notice = '점수는 0~100 사이 숫자로 입력해 주세요.';
            return renderAgain();
        }
        _saving = true;
        renderAgain();
        try {
            await EieApi.batchSchoolGradeRecords({ records: records, examYear: year, subject: 'english' });
            _schoolDirty = {};
            _notice = '저장 완료';
            _loaded = false;
            await loadFoundation();
        } catch (error) {
            _notice = '저장 실패';
        } finally {
            _saving = false;
            renderAgain();
        }
    }

    async function updateEieSchoolGradeRecord(studentId, colKey) {
        if (_saving) return;
        var built = schoolGradePayloadForCell(studentId, colKey);
        if (built.error) {
            _notice = built.error;
            return renderAgain();
        }
        _saving = true;
        renderAgain();
        try {
            if (built.id && EieApi.updateSchoolGradeRecord) {
                await EieApi.updateSchoolGradeRecord(built.id, built.payload);
            } else {
                await EieApi.batchSchoolGradeRecords({
                    records: [built.payload],
                    examYear: built.payload.exam_year,
                    subject: built.payload.subject
                });
            }
            delete _schoolDirty[text(studentId) + '|' + text(colKey)];
            _notice = '개별 성적 저장 완료';
            _loaded = false;
            await loadFoundation();
        } catch (error) {
            _notice = error && error.message ? error.message : '개별 성적 저장 실패';
        } finally {
            _saving = false;
            renderAgain();
        }
    }

    async function deleteEieSchoolGradeRecord(recordId) {
        var id = text(recordId);
        if (!id || _saving) return;
        if (typeof window.confirm === 'function' && !window.confirm('이 학교 성적 기록을 삭제할까요?')) return;
        _saving = true;
        renderAgain();
        try {
            await EieApi.deleteSchoolGradeRecord(id);
            _schoolRows = _schoolRows.filter(function (row) { return text(row && row.id) !== id; });
            _notice = '개별 성적 삭제 완료';
            _loaded = false;
            await loadFoundation();
        } catch (error) {
            _notice = error && error.message ? error.message : '개별 성적 삭제 실패';
        } finally {
            _saving = false;
            renderAgain();
        }
    }

    function recordForTest(studentId, testId) {
        return (_academyRows || []).find(function (row) {
            var meta = recordMeta(row);
            var rowMonth = text(meta.month_key || row.month_key || row.monthKey || text(row.exam_date).slice(0, 7));
            var rowTestId = text(meta.test_id || row.test_id || row.column_id || row.columnId || row.category);
            var rowClassId = text(meta.class_id || row.class_id || row.classId || row.timetable_cell_id || row.cell_id || row.cellId);
            return text(row.student_id || row.studentId) === text(studentId)
                && rowClassId === text(_classId)
                && rowMonth === text(_monthKey || todayMonthKey())
                && rowTestId === text(testId)
                && text(row.status || 'active') !== 'archived';
        }) || null;
    }

    function scoreTypeLabel(type) {
        if (type === 'fraction') return '숫자/만점';
        if (type === 'memo') return '텍스트';
        return '숫자';
    }

    function testMaxScore(test) {
        if (!test || test.scoreType === 'memo') return null;
        var raw = test.maxScore != null && test.maxScore !== '' ? test.maxScore : test.max_score;
        var max = Number(raw);
        return Number.isFinite(max) && max > 0 ? max : null;
    }

    function testMaxLabel(test) {
        var max = testMaxScore(test);
        return max ? '/' + max : '';
    }

    function academyInputValue(record, test) {
        if (!record) return '';
        if (test.scoreType === 'memo') return text(record.memo);
        if (test.scoreType === 'fraction') {
            return text(record.score);
        }
        return text(record.score);
    }

    function academyScorePayload(value, test) {
        var raw = text(value);
        if (test.scoreType === 'memo') return { score: null, maxScore: test.maxScore, memo: raw };
        if (test.scoreType === 'fraction') {
            var parts = raw.split('/').map(text);
            var score = parts[0] === '' ? null : Number(parts[0]);
            var max = parts[1] === undefined || parts[1] === '' ? test.maxScore : Number(parts[1]);
            return {
                score: Number.isFinite(score) ? score : null,
                maxScore: Number.isFinite(max) ? max : null,
                memo: ''
            };
        }
        var n = raw === '' ? null : Number(raw);
        return { score: Number.isFinite(n) ? n : null, maxScore: test.maxScore, memo: '' };
    }

    function recordMaxScore(record) {
        var meta = recordMeta(record);
        var raw = record && record.max_score != null && record.max_score !== '' ? record.max_score
            : record && record.maxScore != null && record.maxScore !== '' ? record.maxScore
            : meta.max_score != null && meta.max_score !== '' ? meta.max_score
            : meta.maxScore;
        var max = Number(raw);
        return Number.isFinite(max) && max > 0 ? max : null;
    }

    function academyMaxScoreForSave(parsed, record) {
        var existingMax = recordMaxScore(record);
        if (existingMax !== null) return existingMax;
        var parsedMax = Number(parsed && parsed.maxScore);
        return Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : null;
    }

    function academyColGroup(tests) {
        var cols = tests.map(function (test) {
            if (test.scoreType === 'memo') return '<col class="eie-grade-col-memo">';
            if (test.scoreType === 'fraction') return '<col class="eie-grade-col-score is-fraction">';
            return '<col class="eie-grade-col-score">';
        }).join('');
        return '<colgroup><col class="eie-grade-col-class"><col class="eie-grade-col-name">' + cols + '</colgroup>';
    }

    function renderAcademyTable() {
        var students = getAcademyVisibleStudents();
        var tests = activeTests();
        var cols = tests.map(function (test) {
            var maxLabel = testMaxLabel(test);
            var dateLabel = formatExamDateLabel(test);
            return '<th>' + esc(test.title) + (dateLabel ? '<span class="eie-grade-date-label">' + esc(dateLabel) + '</span>' : '') + (maxLabel ? '<span class="eie-grade-max-label">' + esc(maxLabel) + '</span>' : '') + '</th>';
        }).join('');
        var rows = students.map(function (student) {
            var sid = getStudentId(student);
            var className = student.className || classNameOfCell(getSelectedCell()) || '담당 반';
            var cells = tests.map(function (test) {
                var rec = recordForTest(sid, test.id);
                var value = academyInputValue(rec, test);
                var type = test.scoreType === 'memo' ? 'text' : 'text';
                var inputClass = 'eie-grade-inp' + (test.scoreType === 'memo' ? ' is-memo' : '');
                return '<td><input type="' + type + '" class="' + inputClass + '" id="eie-academy-inp-' + esc(sid) + '-' + esc(test.id) + '" value="' + esc(value) + '" oninput="EieGradeLedgerView.markAcademyDirty(' + jsArg(sid + '|' + test.id) + ')"></td>';
            }).join('');
            return '<tr><td class="eie-grade-sticky-class">' + esc(className) + '</td><td class="eie-grade-sticky-name">' + esc(displayName(student)) + '</td>' + cells + '</tr>';
        }).join('');
        return '<div class="eie-grade-table-wrap"><table class="eie-grade-table eie-academy-table">' + academyColGroup(tests) + '<thead><tr><th class="eie-grade-sticky-class">반</th><th class="eie-grade-sticky-name">이름</th>' + cols + '</tr></thead><tbody>'
            + (rows || emptyRow(tests.length + 2, '선택한 반에 등록된 학생이 없습니다.'))
            + '</tbody></table></div>';
    }

    function renderTestSection() {
        if (!_classId) return '';
        var selected = {};
        activeTests().forEach(function (item) { selected[text(item.id)] = true; });
        var choices = _manageOpen ? testChoiceList() : activeTests();
        return '<div class="eie-grade-tests' + (_manageOpen ? ' is-managing' : '') + '">'
            + '<div class="eie-grade-tests-head">'
            + '<span class="eie-grade-tests-title">이번 달 시험</span>'
            + '<button type="button" class="eie-grade-manage-toggle' + (_manageOpen ? ' is-open' : '') + '" onclick="EieGradeLedgerView.toggleManage()">시험 관리</button>'
            + '</div>'
            + '<div class="eie-grade-test-chips">'
            + choices.map(function (item) {
                var id = text(item.id);
                var label = esc(item.title) + (testExamDate(item) ? ' <em>' + esc(formatExamDateLabel(item)) + '</em>' : '');
                if (!_manageOpen) return '<span class="eie-grade-chip is-on">' + label + '</span>';
                var on = !!selected[id];
                return '<span class="eie-grade-chip eie-grade-chip--manage' + (on ? ' is-on' : '') + '">'
                    + '<button type="button" class="eie-grade-chip-toggle" aria-pressed="' + (on ? 'true' : 'false') + '" onclick="EieGradeLedgerView.toggleTestChoice(' + jsArg(id) + ', ' + (on ? 'false' : 'true') + ')">' + label + '</button>'
                    + '<button type="button" class="eie-grade-chip-edit" title="시험 수정" aria-label="시험 수정" onclick="EieGradeLedgerView.editTest(' + jsArg(id) + ')">✎</button>'
                    + '</span>';
            }).join('')
            + (_manageOpen ? '<button type="button" class="eie-grade-add-btn eie-grade-chip-new" onclick="EieGradeLedgerView.openAddTest()">+ 새 시험</button>' : '')
            + '</div>'
            + (_manageOpen && (_formOpen || _editingTestId) ? renderTestForm(_editingTestId ? testById(_editingTestId) : null) : '')
            + '</div>';
    }

    function renderDateField(date) {
        var on = !!date;
        return '<label class="eie-grade-date-field"><input type="checkbox" id="eie-new-test-date-enable"' + (on ? ' checked' : '') + ' onchange="EieGradeLedgerView.syncDateUi()"><span>시험 날짜 넣기</span>'
            + '<input type="date" id="eie-new-test-date" value="' + esc(date || ((_monthKey || todayMonthKey()) + '-01')) + '" style="display:' + (on ? 'inline-flex' : 'none') + '"></label>';
    }

    function renderTestForm(editing) {
        var editTitle = editing ? text(editing.title) : '';
        var editType = editing ? normalizeScoreType(editing.scoreType) : 'score';
        var editMax = editing && testMaxScore(editing) !== null ? testMaxScore(editing) : '';
        var editDate = editing ? testExamDate(editing) : '';
        return '<div class="eie-grade-test-form">'
            + '<div class="eie-grade-test-form-title">' + (editing ? esc(editTitle) + ' 수정' : '시험 추가') + '</div>'
            + '<div class="eie-grade-test-fields">'
            + '<label><span>시험명</span><input id="eie-new-test-title" type="text" value="' + esc(editTitle) + '" placeholder="단어 2차"></label>'
            + '<label><span>입력 방식</span><select id="eie-new-test-type" onchange="EieGradeLedgerView.syncTestTypeUi()">'
            + '<option value="score"' + (editType === 'score' ? ' selected' : '') + '>숫자</option>'
            + '<option value="fraction"' + (editType === 'fraction' ? ' selected' : '') + '>숫자/만점</option>'
            + '<option value="memo"' + (editType === 'memo' ? ' selected' : '') + '>텍스트</option>'
            + '</select></label>'
            + '<label id="eie-new-test-max-wrap" style="display:' + (editType === 'fraction' ? 'flex' : 'none') + '"><span>만점</span><input id="eie-new-test-max" type="number" value="' + esc(editMax) + '" placeholder="20"></label>'
            + '</div>'
            + renderDateField(editDate)
            + (editing
                ? '<div class="eie-grade-test-form-actions eie-grade-test-form-actions--edit">'
                    + '<button type="button" class="eie-grade-text-danger" onclick="EieGradeLedgerView.deleteTest(' + jsArg(text(editing.id)) + ')">삭제</button>'
                    + '<span class="eie-grade-test-form-right"><button type="button" class="eie-grade-btn-ghost" onclick="EieGradeLedgerView.closeTestForm()">취소</button><button type="button" class="eie-grade-add-btn" onclick="EieGradeLedgerView.saveTestForm()">저장</button></span>'
                    + '</div>'
                : '<div class="eie-grade-test-form-actions"><button type="button" class="eie-grade-btn-ghost" onclick="EieGradeLedgerView.closeTestForm()">취소</button><button type="button" class="eie-grade-add-btn" onclick="EieGradeLedgerView.saveTestForm()">추가</button></div>')
            + '</div>';
    }

    function renderAcademy() {
        var controls = renderAcademyControls();
        if (!_classId) {
            return '<div class="eie-grade-academy">'
                + '<div class="eie-grade-academy-top">' + controls + '</div>'
                + '<div class="eie-grade-table-wrap"><table class="eie-grade-table eie-academy-table"><tbody><tr><td class="eie-grade-empty">반을 선택해 주세요. 선택한 반의 학생 목록이 여기에 표시됩니다.</td></tr></tbody></table></div>'
                + '</div>';
        }
        return '<div class="eie-grade-academy">'
            + '<div class="eie-grade-academy-top">' + controls + renderTestSection() + '</div>'
            + renderAcademyTable()
            + '</div>';
    }

    function renderSchool() {
        return renderSchoolControls()
            + renderEieSchoolGradeTable();
    }

    function renderAgain() {
        if (window.EieRouter && typeof EieRouter.open === 'function') return EieRouter.open('grades');
    }

    async function saveGradeSheet() {
        var tests = fullTestList();
        var payload = {
            teacher_id: _teacherId,
            class_id: _classId,
            month_key: _monthKey || todayMonthKey(),
            sheet_type: 'academy',
            title: '원내평가',
            tests: tests,
            status: 'active'
        };
        await EieApi.saveGradeSheet(payload);
        _sheetDirty = false;
        _loaded = false;
        await loadFoundation();
    }

    async function saveAcademy() {
        if (_saving) return;
        if (!_classId) {
            _notice = '원내평가는 반을 선택한 뒤 입력할 수 있습니다.';
            return renderAgain();
        }
        _saving = true;
        renderAgain();
        try {
            if (_sheetDirty) await saveGradeSheet();
            var students = getAcademyVisibleStudents();
            var tests = activeTests();
            var records = [];
            students.forEach(function (student) {
                var sid = getStudentId(student);
                tests.forEach(function (test) {
                    var el = document.getElementById('eie-academy-inp-' + sid + '-' + test.id);
                    var value = text(el && el.value);
                    var existing = recordForTest(sid, test.id);
                    var parsed = academyScorePayload(value, test);
                    records.push({
                        student_id: sid,
                        timetable_cell_id: _classId || student.class_id || '',
                        exam_date: testExamDate(test),
                        category: 'free',
                        title: test.title,
                        score: parsed.score,
                        max_score: academyMaxScoreForSave(parsed, existing),
                        memo: parsed.memo,
                        payload_json: JSON.stringify({ class_id: _classId, month_key: _monthKey || todayMonthKey(), test_id: test.id, exam_date: testExamDate(test) }),
                        status: 'active'
                    });
                });
            });
            await EieApi.batchExamRecords({ timetable_cell_id: _classId, exam_date: (_monthKey || todayMonthKey()) + '-01', category: 'free', records: records });
            _academyDirty = {};
            _notice = '저장 완료';
            _loaded = false;
            await loadFoundation();
        } catch (error) {
            _notice = '저장 실패';
        } finally {
            _saving = false;
            renderAgain();
        }
    }

    async function render() {
        await loadFoundation();
        return '<section id="eie-grade-main" class="eie-grade-ledger eie-v2-screen">'
            + '<div class="eie-panel eie-p-panel">'
            + renderHeader()
            + (_error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '')
            + (_mode === 'academy' ? renderAcademy() : renderSchool())
            + '</div>'
            + '</section>';
    }

    window.EieGradeLedgerView = {
        render: render,
        openLedger: openEieGradeLedger,
        openStudent: openStudentGradeLedger,
        closeLedger: closeEieGradeLedger,
        setMode: function (mode) { _mode = mode === 'academy' ? 'academy' : 'school'; _notice = ''; renderAgain(); },
        setYear: function (year) { _year = Number(year) || _year; _loaded = false; renderAgain(); },
        setMonth: function (monthKey) { _monthKey = text(monthKey) || todayMonthKey(); _loaded = false; renderAgain(); },
        setClassId: function (classId) { _classId = text(classId); _loaded = false; renderAgain(); },
        setSchoolSection: function (section) { _schoolSection = section === 'high' ? 'high' : 'middle'; _schoolGradeTab = ''; renderAgain(); },
        setGradeTab: function (grade) { _schoolGradeTab = text(grade); renderAgain(); },
        setSort: function (sort) { _schoolSort = text(sort) || 'default'; _eieGradeToggleSortCol(); renderAgain(); },
        setSortCol: function (key) { _schoolSortCol = text(key) || '1H-mid'; renderAgain(); },
        markSchoolDirty: function (key) { _schoolDirty[text(key)] = true; updateDirtyUi(); },
        markAcademyDirty: function (key) { _academyDirty[text(key)] = true; updateDirtyUi(); },
        updateSchoolGradeRecord: updateEieSchoolGradeRecord,
        deleteSchoolGradeRecord: deleteEieSchoolGradeRecord,
        openAddTest: function () { _manageOpen = true; _formOpen = true; _editingTestId = ''; renderAgain(); },
        closeTestForm: function () { _formOpen = false; _editingTestId = ''; renderAgain(); },
        toggleManage: function () { _manageOpen = !_manageOpen; _formOpen = false; _editingTestId = ''; renderAgain(); },
        toggleTestChoice: function (id, checked) {
            var key = text(id);
            var list = fullTestList().slice();
            var idx = list.findIndex(function (item) { return text(item && item.id) === key; });
            if (idx >= 0) {
                list[idx] = Object.assign({}, list[idx], { enabled: !!checked });
            } else if (checked) {
                var choice = testChoiceList().find(function (item) { return text(item && item.id) === key; });
                if (choice) list.push(Object.assign({}, normalizeTestItem(choice), { enabled: true }));
            }
            _sheetDraftTests = list;
            _sheetDirty = true;
            renderAgain();
        },
        syncTestTypeUi: function () {
            var type = normalizeScoreType(document.getElementById('eie-new-test-type') && document.getElementById('eie-new-test-type').value);
            var maxWrap = document.getElementById('eie-new-test-max-wrap');
            if (maxWrap) maxWrap.style.display = type === 'fraction' ? 'flex' : 'none';
        },
        syncDateUi: function () {
            var enable = document.getElementById('eie-new-test-date-enable');
            var dateInput = document.getElementById('eie-new-test-date');
            if (dateInput) dateInput.style.display = enable && enable.checked ? 'inline-flex' : 'none';
        },
        editTest: function (id) {
            _editingTestId = text(id);
            _formOpen = false;
            _manageOpen = true;
            renderAgain();
        },
        deleteTest: function (id) {
            var item = testById(id);
            var title = text(item && item.title) || '선택한';
            if (typeof window.confirm === 'function' && !window.confirm(title + ' 시험을 삭제하면 입력한 점수도 함께 삭제됩니다. 삭제하시겠습니까?')) return;
            return this._test.deleteAcademyTest(id);
        },
        addTest: function () {
            return this._test.addAcademyTestFromInputs();
        },
        saveTestForm: function () {
            return _editingTestId ? this._test.updateAcademyTestFromInputs(_editingTestId) : this._test.addAcademyTestFromInputs();
        },
        saveAll: function () { return _mode === 'academy' ? saveAcademy() : saveEieSchoolGradeBatch(); },
        saveSchool: saveEieSchoolGradeBatch,
        saveAcademy: saveAcademy,
        _test: {
            activeTests: activeTests,
            saveGradeSheet: saveGradeSheet,
            recordForTest: recordForTest,
            academyScorePayload: academyScorePayload,
            deleteAcademyTest: function (id) {
                var key = text(id);
                if (!key) return;
                _sheetDraftTests = draftTests().filter(function (item) { return text(item && item.id) !== key; });
                if (_editingTestId === key) _editingTestId = '';
                _formOpen = false;
                _sheetDirty = true;
                renderAgain();
            },
            updateAcademyTestFromInputs: function (id) {
                var key = text(id);
                var tests = draftTests().slice();
                var idx = tests.findIndex(function (item) { return text(item && item.id) === key; });
                if (idx < 0) return;
                var title = normalizeTestTitle(document.getElementById('eie-new-test-title') && document.getElementById('eie-new-test-title').value);
                if (!title) return;
                var examDate = formExamDate();
                if (formDateEnabled() && (!examDate || examDate.slice(0, 7) !== (_monthKey || todayMonthKey()))) return;
                var identity = title.toLowerCase() + '|' + examDate;
                var exists = tests.some(function (item) {
                    return text(item && item.id) !== key && testIdentity(item) === identity;
                });
                if (exists) return;
                var scoreType = normalizeScoreType(document.getElementById('eie-new-test-type') && document.getElementById('eie-new-test-type').value);
                tests[idx] = Object.assign({}, tests[idx], {
                    title: title,
                    examDate: examDate,
                    scoreType: scoreType,
                    maxScore: maxScoreFromInput(scoreType)
                });
                _sheetDraftTests = tests;
                _editingTestId = '';
                _formOpen = false;
                _sheetDirty = true;
                renderAgain();
            },
            addAcademyTestFromInputs: function () {
            var title = normalizeTestTitle(document.getElementById('eie-new-test-title') && document.getElementById('eie-new-test-title').value);
            if (!title) return;
            var examDate = formExamDate();
            if (formDateEnabled() && (!examDate || examDate.slice(0, 7) !== (_monthKey || todayMonthKey()))) return;
            var tests = draftTests().slice();
            var exists = tests.some(function (item) {
                return testIdentity(item) === (title.toLowerCase() + '|' + examDate);
            });
            if (exists) return;
            var scoreType = normalizeScoreType(document.getElementById('eie-new-test-type') && document.getElementById('eie-new-test-type').value);
            tests.push({
                id: uniqueTestId(tests, title, examDate),
                title: title,
                examDate: examDate,
                scoreType: scoreType,
                maxScore: maxScoreFromInput(scoreType),
                enabled: true
            });
            _sheetDraftTests = tests;
            _formOpen = false;
            _sheetDirty = true;
            renderAgain();
        },
            EIE_GRADE_COLS: EIE_GRADE_COLS,
            getEieGradeExamRecord: getEieGradeExamRecord,
            getEieGradeVisibleStudents: getEieGradeVisibleStudents,
            getPrevEieGradeColKey: getPrevEieGradeColKey,
            getEieGradeScore: getEieGradeScore,
            calcEieGradeAvg: calcEieGradeAvg,
            buildEieGradeTrendHtml: buildEieGradeTrendHtml,
            buildEieGradeAvgRow: buildEieGradeAvgRow,
            _eieGradeToggleSortCol: _eieGradeToggleSortCol,
            openEieGradeLedger: openEieGradeLedger,
            renderEieSchoolGradeTable: renderEieSchoolGradeTable,
            _renderEieHighGradeTable: _renderEieHighGradeTable,
            _buildEieGradeRow: _buildEieGradeRow,
            saveEieSchoolGradeBatch: saveEieSchoolGradeBatch
        }
    };
})();
