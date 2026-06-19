(function () {
    var _error = '';
    var _notice = '';
    var _selectedId = '';
    var _query = '';
    var _statusFilter = 'active';
    var _gradeFilter = 'all';
    var _teacherFilter = 'all';
    var _tab = 'basic';
    var _mode = 'detail';
    var _saving = false;
    var _loading = false;
    var _returnCtx = null;
    var _teacherRoster = [];
    var _consultationMode = 'list';
    var _editingConsultationId = '';
    var _consultationDraft = null;
    var _pinnedConsultationByStudent = {};
    var _pinnedConsultationFormStudent = '';
    var _examCategory = 'month_end';
    var _examRecordsByStudent = {};
    var _printGrouping = 'grade';
    var _printStatus = 'active_paused';
    var _printIncludeContacts = true;
    var _printIncludeClass = true;
    var _printIncludeMemo = true;
    var _printPanelOpen = false;
    var _gradeReportPeriod = '6';
    var _gradeReportIncludes = { vocab: true, grammar: true, reading: false, listening: false, material: false, month_end: false, free: false };
    var _gradeReportNote = '';
    var _gradeReportPreviewStudentId = '';

    var STUDENT_GRADE_OPTIONS = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'];

    function esc(value) {
        return EieApp.escapeHtml(value == null ? '' : value);
    }

    function jsArg(value) {
        return esc(JSON.stringify(value));
    }

    function state() {
        return EieState.get();
    }

    function db() {
        return state().db || {};
    }

    function ui() {
        return state().ui || {};
    }

    function asArray(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function rowId(row) {
        return text(row && (row.id || row.student_id));
    }

    function displayName(student) {
        return text(student && (student.display_name || student.name || student.student_name_raw || student.normalized_name)) || '이름 미등록';
    }

    function gradeOf(student) {
        return text(student && (student.grade || student.grade_raw));
    }

    function normalizeGrade(value) {
        if (window.EieGradeUtils && typeof EieGradeUtils.normalizeEieGrade === 'function') {
            return EieGradeUtils.normalizeEieGrade(value);
        }
        var raw = text(value).replace(/\s+/g, '');
        var aliases = {
            '초1': '초1',
            '초등1': '초1',
            '초등1학년': '초1',
            '초등학교1': '초1',
            '초등학교1학년': '초1',
            '초2': '초2',
            '초등2': '초2',
            '초등2학년': '초2',
            '초등학교2': '초2',
            '초등학교2학년': '초2',
            '초3': '초3',
            '초등3': '초3',
            '초등3학년': '초3',
            '초등학교3': '초3',
            '초등학교3학년': '초3',
            '초4': '초4',
            '초등4': '초4',
            '초등4학년': '초4',
            '초등학교4': '초4',
            '초등학교4학년': '초4',
            '초5': '초5',
            '초등5': '초5',
            '초등5학년': '초5',
            '초등학교5': '초5',
            '초등학교5학년': '초5',
            '초6': '초6',
            '초등6': '초6',
            '초등6학년': '초6',
            '초등학교6': '초6',
            '초등학교6학년': '초6',
            '중1': '중1',
            '중학교1': '중1',
            '중학교1학년': '중1',
            '중등1': '중1',
            '중등1학년': '중1',
            '중2': '중2',
            '중학교2': '중2',
            '중학교2학년': '중2',
            '중등2': '중2',
            '중등2학년': '중2',
            '중3': '중3',
            '중학교3': '중3',
            '중학교3학년': '중3',
            '중등3': '중3',
            '중등3학년': '중3',
            '고1': '고1',
            '고등1': '고1',
            '고등1학년': '고1',
            '고등학교1': '고1',
            '고등학교1학년': '고1',
            '고2': '고2',
            '고등2': '고2',
            '고등2학년': '고2',
            '고등학교2': '고2',
            '고등학교2학년': '고2',
            '고3': '고3',
            '고등3': '고3',
            '고등3학년': '고3',
            '고등학교3': '고3',
            '고등학교3학년': '고3'
        };
        if (aliases[raw]) return aliases[raw];
        var elementary = raw.match(/^초(?:등|등학교)?([1-6])(?:학년)?$/);
        if (elementary) return '초' + elementary[1];
        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];
        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];
        return /^중[1-3]$|^고[1-3]$/.test(raw) ? raw : '';
    }

    function schoolOf(student) {
        return text(student && (student.school_name || student.school)) || text(rawOf(student).school_name || rawOf(student).school);
    }

    function statusOf(student) {
        var status = text(student && student.status) || 'active';
        return status === 'imported' ? 'active' : status;
    }

    function rawOf(student) {
        var base = student && student.raw && typeof student.raw === 'object' ? student.raw : student;
        var rawMetaValue = base && base.raw_meta_json !== undefined && base.raw_meta_json !== null
            ? base.raw_meta_json
            : student && student.raw_meta_json;
        var parsed = {};
        if (rawMetaValue && typeof rawMetaValue === 'object') {
            parsed = rawMetaValue;
        } else if (rawMetaValue) {
            try {
                var value = JSON.parse(rawMetaValue);
                if (value && typeof value === 'object') parsed = value;
            } catch (error) {
                parsed = {};
            }
        }
        return Object.assign({}, base || {}, parsed);
    }

    function contactsOf(student) {
        var sid = rowId(student);
        var rows = asArray(db().student_contacts).filter(function (contact) {
            return String(contact.student_id || '') === String(sid);
        });
        if (!rows.length && Array.isArray(rawOf(student).contacts)) rows = rawOf(student).contacts;
        return rows;
    }

    function consultationsOf(student) {
        var sid = rowId(student);
        return asArray(db().consultations).filter(function (consultation) {
            return String(consultation.student_id || '') === String(sid);
        }).sort(function (a, b) {
            return text(b.date || b.created_at).localeCompare(text(a.date || a.created_at));
        });
    }

    var EXAM_CATEGORIES = [
        { key: 'month_end', label: '월말평가' },
        { key: 'vocab', label: '단어' },
        { key: 'grammar', label: '문법' },
        { key: 'material', label: '교재' },
        { key: 'reading', label: 'Reading' },
        { key: 'listening', label: 'Listening' },
        { key: 'free', label: '자유기록' }
    ];

    function examCategoryLabel(category) {
        var item = EXAM_CATEGORIES.find(function (row) { return row.key === category; });
        return item ? item.label : '성적';
    }

    function examRecordsOf(student) {
        var sid = rowId(student);
        return asArray(_examRecordsByStudent[sid]).filter(function (row) {
            return String(row.status || 'active') === 'active';
        }).sort(function (a, b) {
            return text(b.exam_date || b.created_at).localeCompare(text(a.exam_date || a.created_at));
        });
    }

    function normalizeExamDate(value) {
        var raw = text(value);
        var match = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        if (!match) return '';
        return [match[1], match[2].padStart(2, '0'), match[3].padStart(2, '0')].join('-');
    }

    function monthKeyOf(value) {
        var date = normalizeExamDate(value);
        return date ? date.slice(0, 7) : '';
    }

    function monthLabel(monthKey) {
        var match = text(monthKey).match(/^(\d{4})-(\d{2})$/);
        return match ? String(Number(match[2])) + '월' : '-';
    }

    function reportPercent(row) {
        if (!row || row.score === undefined || row.score === null || text(row.score) === '') return null;
        var score = Number(row && row.score);
        if (!Number.isFinite(score)) return null;
        var maxScore = Number(row && row.max_score);
        if (Number.isFinite(maxScore) && maxScore > 0) return Math.max(0, Math.min(100, (score / maxScore) * 100));
        return Math.max(0, Math.min(100, score));
    }

    function selectedGradeReportCategories() {
        return Object.keys(_gradeReportIncludes).filter(function (key) { return !!_gradeReportIncludes[key]; });
    }

    function gradeReportRows(student) {
        var selected = selectedGradeReportCategories();
        return examRecordsOf(student).filter(function (row) {
            return selected.indexOf(text(row.category)) !== -1 && reportPercent(row) !== null && monthKeyOf(row.exam_date || row.created_at);
        }).map(function (row) {
            return {
                category: text(row.category),
                title: text(row.title || examCategoryLabel(row.category)),
                examDate: normalizeExamDate(row.exam_date || row.created_at),
                monthKey: monthKeyOf(row.exam_date || row.created_at),
                percent: reportPercent(row),
                score: Number(row.score),
                maxScore: Number(row.max_score)
            };
        });
    }

    function gradeReportMonthKeys(rows) {
        var keys = Array.from(new Set(rows.map(function (row) { return row.monthKey; }).filter(Boolean))).sort();
        if (_gradeReportPeriod === 'all') return keys;
        var count = Number(_gradeReportPeriod || 6);
        return keys.slice(Math.max(0, keys.length - count));
    }

    function buildGradeReportSeries(student) {
        var rows = gradeReportRows(student);
        var months = gradeReportMonthKeys(rows);
        var categories = selectedGradeReportCategories();
        var byCategory = {};
        categories.forEach(function (category) {
            byCategory[category] = months.map(function (month) {
                var inMonth = rows.filter(function (row) { return row.category === category && row.monthKey === month; });
                if (!inMonth.length) return { month: month, average: null, count: 0 };
                var sum = inMonth.reduce(function (total, row) { return total + row.percent; }, 0);
                return { month: month, average: Math.round(sum / inMonth.length), count: inMonth.length };
            });
        });
        return { rows: rows, months: months, categories: categories, byCategory: byCategory };
    }

    function renderReportBars(points, tone) {
        var max = 100;
        return '<div class="eie-grade-report-bars">'
            + points.map(function (point) {
                var height = point.average === null ? 0 : Math.max(4, Math.round((point.average / max) * 100));
                return '<div class="eie-grade-report-bar-cell">'
                    + '<div class="eie-grade-report-bar-track"><span class="is-' + esc(tone) + '" style="height:' + height + '%"></span></div>'
                    + '<strong>' + (point.average === null ? '-' : esc(point.average + '')) + '</strong>'
                    + '<em>' + esc(monthLabel(point.month)) + '</em>'
                    + '</div>';
            }).join('')
            + '</div>';
    }

    function renderGradeReportChart(category, points) {
        var tone = category === 'grammar' ? 'grammar' : category === 'vocab' ? 'vocab' : 'other';
        var latest = points.slice().reverse().find(function (point) { return point.average !== null; });
        var count = points.reduce(function (total, point) { return total + Number(point.count || 0); }, 0);
        return '<section class="eie-grade-report-chart-card">'
            + '<div class="eie-grade-report-chart-head"><div><h4>' + esc(examCategoryLabel(category)) + '</h4><span>월별 평균 흐름</span></div><strong>' + (latest ? esc(latest.average + '점') : '-') + '</strong></div>'
            + renderReportBars(points, tone)
            + '<p>응시 ' + esc(count) + '회 · 점수는 만점 기준 100점 환산으로 표시됩니다.</p>'
            + '</section>';
    }

    function renderGradeReportSummaryTable(series) {
        if (!series.months.length) return '<div class="eie-empty-box">출력할 성적 기록이 없습니다.</div>';
        return '<table class="eie-grade-report-table"><thead><tr><th>월</th>'
            + series.categories.map(function (category) { return '<th>' + esc(examCategoryLabel(category)) + '</th>'; }).join('')
            + '</tr></thead><tbody>'
            + series.months.map(function (month) {
                return '<tr><td>' + esc(monthLabel(month)) + '</td>'
                    + series.categories.map(function (category) {
                        var point = (series.byCategory[category] || []).find(function (row) { return row.month === month; });
                        return '<td>' + (point && point.average !== null ? esc(point.average + '점 / ' + point.count + '회') : '-') + '</td>';
                    }).join('')
                    + '</tr>';
            }).join('')
            + '</tbody></table>';
    }

    function renderGradeReportSheet(student) {
        var series = buildGradeReportSeries(student);
        var periodText = _gradeReportPeriod === 'all' ? '전체 기간' : '최근 ' + _gradeReportPeriod + '개월';
        return '<section id="eie-grade-report-sheet" class="eie-grade-report-sheet" aria-label="학생 누적 성적 리포트">'
            + '<header class="eie-grade-report-header">'
            + '<div><span>EIE 학습 상담 리포트</span><h2>' + esc(displayName(student)) + ' 학생 학습 성장 리포트</h2><p>' + esc([schoolOf(student), gradeOf(student)].filter(Boolean).join(' · ') || '학년 정보 미등록') + '</p></div>'
            + '<dl><div><dt>기간</dt><dd>' + esc(periodText) + '</dd></div><div><dt>출력일</dt><dd>' + esc(todayIso()) + '</dd></div></dl>'
            + '</header>'
            + '<div class="eie-grade-report-guidance"><strong>월별 학습 흐름</strong><p>단어와 문법 성적을 중심으로 최근 학습 흐름을 확인하고 다음 상담 방향을 정리합니다.</p></div>'
            + '<div class="eie-grade-report-chart-grid">'
            + series.categories.map(function (category) { return renderGradeReportChart(category, series.byCategory[category] || []); }).join('')
            + '</div>'
            + '<section class="eie-grade-report-summary"><h3>월별 요약</h3>' + renderGradeReportSummaryTable(series) + '</section>'
            + '<section class="eie-grade-report-consult"><h3>상담 메모</h3><div>' + esc(_gradeReportNote || '상담 시 학생의 강점, 보완할 부분, 가정 학습 안내를 적어 활용합니다.') + '</div></section>'
            + '<footer>본 리포트는 학생의 월별 학습 흐름을 확인하고 다음 학습 방향을 상담하기 위한 자료입니다.</footer>'
            + '</section>';
    }

    function renderGradeReportPanel(student) {
        var sid = rowId(student);
        var opened = _gradeReportPreviewStudentId === sid;
        if (!opened) {
            return '<div class="eie-grade-report-entry"><div><strong>학부모 상담용 누적 성적표</strong><span>단어·문법 월별 그래프와 상담란을 인쇄합니다.</span></div><button type="button" class="eie-primary-button" onclick="EieStudentsView.openGradeReportPreview(' + jsArg(sid) + ')">누적 성적표 인쇄</button></div>';
        }
        var categoryCheck = function (key, label, disabledDefault) {
            return '<label class="eie-grade-report-check"><input type="checkbox" ' + (_gradeReportIncludes[key] ? 'checked ' : '') + 'onchange="EieStudentsView.setGradeReportOption(' + jsArg(key) + ', this.checked)"><span>' + esc(label) + (disabledDefault ? ' 선택' : '') + '</span></label>';
        };
        return '<section class="eie-grade-report-preview">'
            + '<div class="eie-grade-report-toolbar">'
            + '<div><h3>누적 성적표 인쇄</h3><p>출력 전용 화면에는 학생 상담에 필요한 항목만 담습니다.</p></div>'
            + '<div class="eie-grade-report-actions"><button type="button" class="eie-secondary-button" onclick="EieStudentsView.closeGradeReportPreview()">닫기</button><button type="button" class="eie-primary-button" onclick="EieStudentsView.printGradeReport()">인쇄</button></div>'
            + '</div>'
            + '<div class="eie-grade-report-options">'
            + '<label><span>기간</span><select onchange="EieStudentsView.setGradeReportPeriod(this.value)"><option value="3"' + (_gradeReportPeriod === '3' ? ' selected' : '') + '>최근 3개월</option><option value="6"' + (_gradeReportPeriod === '6' ? ' selected' : '') + '>최근 6개월</option><option value="12"' + (_gradeReportPeriod === '12' ? ' selected' : '') + '>최근 12개월</option><option value="all"' + (_gradeReportPeriod === 'all' ? ' selected' : '') + '>전체</option></select></label>'
            + '<div class="eie-grade-report-checks">'
            + categoryCheck('vocab', '단어', false)
            + categoryCheck('grammar', '문법', false)
            + categoryCheck('reading', 'Reading', true)
            + categoryCheck('listening', 'Listening', true)
            + categoryCheck('material', '교재', true)
            + '</div>'
            + '<label class="eie-grade-report-note-field"><span>상담란</span><textarea oninput="EieStudentsView.setGradeReportNote(this.value)" placeholder="잘하고 있는 점, 보완할 점, 가정 학습 안내를 적어주세요.">' + esc(_gradeReportNote) + '</textarea></label>'
            + '</div>'
            + renderGradeReportSheet(student)
            + '</section>';
    }

    function consultationId(row) {
        return text(row && (row.id || row.consultation_id || row.created_at || row.date));
    }

    function consultationDateLabel(value) {
        var raw = text(value);
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(5, 10);
        return raw || '날짜 없음';
    }

    function primaryPhone(student) {
        var raw = rawOf(student);
        var contacts = contactsOf(student);
        var primary = contacts.find(function (contact) { return contact.is_primary || contact.primary; }) || contacts[0] || {};
        return text(student && (student.student_phone || student.phone || student.phone_raw || student.primary_phone || student.normalized_phone))
            || text(raw.student_phone || raw.phone || raw.phone_raw || raw.primary_phone || raw.normalized_phone)
            || text(primary.phone || primary.phone_raw || primary.normalized_phone);
    }

    function memoOf(student) {
        return text(student && student.memo) || text(rawOf(student).memo);
    }

    function metaValue(student, key) {
        var raw = rawOf(student);
        return text(student && student[key]) || text(raw[key]);
    }

    function parentPhoneOf(student) {
        return metaValue(student, 'parent_phone');
    }

    function guardianRelationOf(student) {
        return metaValue(student, 'guardian_relation');
    }

    function addressOf(student) {
        return metaValue(student, 'student_address');
    }

    function vehicleInfoOf(student) {
        return metaValue(student, 'vehicle_info');
    }

    function studentTypeOf(student) {
        return metaValue(student, 'student_type') || '일반';
    }

    function enrollDateOf(student) {
        return metaValue(student, 'enrollment_date') || metaValue(student, 'first_attendance_date') || metaValue(student, 'first_attended_at');
    }

    function dateFromIso(value) {
        var raw = text(value).slice(0, 10);
        var match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return null;
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }

    function isNewStudent(student) {
        var enrollDate = dateFromIso(enrollDateOf(student));
        if (!enrollDate) return false;
        var today = dateFromIso(todayIso());
        if (!today) return false;
        var from = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
        return enrollDate >= from && enrollDate <= today;
    }

    function uniqueNames(rows) {
        var seen = {};
        return asArray(rows).map(text).filter(function (name) {
            var key = name.toLowerCase();
            if (!name || seen[key]) return false;
            seen[key] = true;
            return true;
        }).sort(function (a, b) { return a.localeCompare(b, 'ko'); });
    }

    function teacherNamesOf(student) {
        var raw = rawOf(student);
        var values = [];
        if (Array.isArray(student && student.teacher_names)) values = values.concat(student.teacher_names);
        if (Array.isArray(raw.teacher_names)) values = values.concat(raw.teacher_names);
        if (Array.isArray(raw.teachers)) {
            values = values.concat(raw.teachers.map(function (teacher) {
                return typeof teacher === 'string' ? teacher : teacher && teacher.name;
            }));
        }
        values = values.concat(text(student && (student.teacher_name || student.teacher_name_raw)).split(','));
        values = values.concat(text(raw.teacher_name || raw.teacher_name_raw).split(','));
        return uniqueNames(values);
    }

    function teacherNamesOfCell(cell) {
        var raw = rawOf(cell);
        var values = [];
        if (Array.isArray(cell && cell.teacher_names)) values = values.concat(cell.teacher_names);
        if (Array.isArray(raw.teacher_names)) values = values.concat(raw.teacher_names);
        values = values.concat(text(cell && (cell.teacher_name_raw || cell.teacher_name)).split(','));
        values = values.concat(text(raw.teacher_name_raw || raw.teacher_name).split(','));
        return uniqueNames(values);
    }

    function studentsFromState() {
        return asArray(db().students);
    }

    function timetableCells() {
        return asArray(db().timetable_cells);
    }

    function teacherRoster() {
        var values = _teacherRoster.slice();
        timetableCells().forEach(function (cell) {
            values = values.concat(teacherNamesOfCell(cell));
        });
        studentsFromState().filter(function (student) {
            return statusOf(student) !== 'archived';
        }).forEach(function (student) {
            values = values.concat(teacherNamesOf(student));
        });
        return uniqueNames(values);
    }

    function teacherFilterRoster() {
        var excludedNames = ['원장님', '프랩', 'PREP', '외국인', 'Foreigner'];
        return teacherRoster().filter(function (name) {
            return excludedNames.indexOf(name) === -1;
        });
    }

    async function loadTeacherRoster() {
        if (_teacherRoster.length || !window.EieApi || typeof EieApi.getTeachers !== 'function') return;
        try {
            var result = await EieApi.getTeachers();
            var rows = result.teachers || result.data || [];
            _teacherRoster = uniqueNames(asArray(rows).filter(function (teacher) {
                return text(teacher.role) !== 'disabled';
            }).map(function (teacher) {
                return teacher.name || teacher.display_name || teacher.teacher_name;
            }));
        } catch (err) {
            _teacherRoster = [];
        }
    }

    function classLinksFor(student) {
        var sid = rowId(student);
        var links = asArray(db().class_students).filter(function (link) {
            return String(link.student_id || '') === String(sid) && statusOf(link) !== 'archived';
        });
        var rawAssignments = asArray(rawOf(student).assignments);
        rawAssignments.forEach(function (assignment) {
            var cellId = text(assignment.timetable_cell_id || assignment.class_id || assignment.cell_id);
            var exists = links.some(function (link) {
                return text(link.timetable_cell_id || link.class_id) === cellId;
            });
            if (!exists) links.push({
                id: assignment.id || assignment.assignment_id || cellId,
                student_id: sid,
                class_id: cellId,
                timetable_cell_id: cellId,
                raw: assignment,
                status: assignment.status || 'active'
            });
        });
        return links;
    }

    function cellForLink(link) {
        var cellId = text(link && (link.timetable_cell_id || link.class_id || link.cell_id));
        return timetableCells().find(function (cell) { return String(cell.id || '') === String(cellId); }) || rawOf(link) || {};
    }

    function assignmentsOf(student) {
        return classLinksFor(student).map(function (link) {
            var cell = cellForLink(link);
            var raw = link.raw || {};
            return {
                link: link,
                cell: cell,
                cellId: text(link.timetable_cell_id || link.class_id || cell.id || raw.timetable_cell_id),
                className: text(cell.class_name_raw || cell.class_name || raw.class_name_raw || raw.class_name || raw.name),
                teacherName: teacherNamesOfCell(cell).join(', ') || text(raw.teacher_name_raw || raw.teacher_name),
                teacherNames: teacherNamesOfCell(cell),
                day: text(cell.day_label || raw.day_label),
                period: text(cell.period_label || raw.period_label),
                time: [text(cell.start_time || raw.start_time), text(cell.end_time || raw.end_time)].filter(Boolean).join('~'),
                status: statusOf(link)
            };
        }).filter(function (item) {
            return item.cellId || item.className || item.day || item.period;
        });
    }

    function statusLabel(status) {
        var key = text(status) || 'active';
        if (key === 'active') return '재원';
        if (key === 'paused') return '휴원';
        if (key === 'inactive') return '퇴원';
        if (key === 'needs_review') return '확인 필요';
        return key;
    }

    function statusClass(status) {
        var key = text(status) || 'active';
        if (key === 'active') return 'is-active';
        if (key === 'paused') return 'is-paused';
        if (key === 'inactive' || key === 'withdrawn') return 'is-withdrawn';
        if (key === 'needs_review') return 'is-review';
        if (key === 'archived') return 'is-archived';
        return 'is-muted';
    }

    function renderStatusBadge(status) {
        return '<span class="eie-apms-status ' + statusClass(status) + '">' + esc(statusLabel(status)) + '</span>';
    }

    function matchesQuery(student) {
        var q = _query.toLowerCase();
        if (!q) return true;
        var haystack = [
            displayName(student),
            gradeOf(student),
            schoolOf(student),
            primaryPhone(student),
            memoOf(student),
            teacherNamesOf(student).join(' ')
        ];
        assignmentsOf(student).forEach(function (assignment) {
            haystack.push(assignment.className, assignment.teacherName, assignment.teacherNames.join(' '), assignment.day, assignment.period);
        });
        return haystack.join(' ').toLowerCase().indexOf(q) >= 0;
    }

    function matchesStatus(student) {
        var status = statusOf(student);
        if (status === 'archived') return false;
        if (_statusFilter === 'all') return true;
        if (_statusFilter === 'new') return isNewStudent(student);
        if (_statusFilter === 'active') return status === 'active' || status === '';
        if (_statusFilter === 'inactive') return status === 'inactive' || status === 'withdrawn';
        return status === _statusFilter;
    }

    function matchesGrade(student) {
        if (_gradeFilter === 'all') return true;
        return normalizeGrade(gradeOf(student)) === _gradeFilter;
    }

    function teacherNamesForStudent(student) {
        var values = teacherNamesOf(student);
        if (values.length) return uniqueNames(values);
        assignmentsOf(student).forEach(function (assignment) {
            values = values.concat(assignment.teacherNames || []);
        });
        return uniqueNames(values);
    }

    function matchesTeacher(student) {
        if (_teacherFilter === 'all') return true;
        return teacherNamesForStudent(student).indexOf(_teacherFilter) >= 0;
    }

    function printStatusMatches(student) {
        var status = statusOf(student);
        if (_printStatus === 'all') return true;
        if (_printStatus === 'active') return status === 'active' || status === '';
        if (_printStatus === 'active_paused') return status === 'active' || status === '' || status === 'paused';
        return true;
    }

    function printScopeRows() {
        return studentsFromState()
            .filter(printStatusMatches)
            .filter(matchesGrade)
            .filter(matchesTeacher)
            .filter(matchesQuery)
            .sort(compareStudentsForPrint);
    }

    function visibleStudents() {
        return studentsFromState()
            .filter(matchesStatus)
            .filter(matchesGrade)
            .filter(matchesTeacher)
            .filter(matchesQuery)
            .sort(function (a, b) {
                var statusDiff = (statusOf(a) === 'archived' ? 1 : 0) - (statusOf(b) === 'archived' ? 1 : 0);
                if (statusDiff !== 0) return statusDiff;
                return displayName(a).localeCompare(displayName(b), 'ko');
            });
    }

    function compareStudentsForPrint(a, b) {
        var gradeDiff = STUDENT_GRADE_OPTIONS.indexOf(normalizeGrade(gradeOf(a))) - STUDENT_GRADE_OPTIONS.indexOf(normalizeGrade(gradeOf(b)));
        if (gradeDiff) return gradeDiff;
        return displayName(a).localeCompare(displayName(b), 'ko');
    }

    function studentCountSummary(rows) {
        var list = asArray(rows);
        return {
            total: list.length,
            active: list.filter(function (row) { return statusOf(row) === 'active' || statusOf(row) === ''; }).length,
            paused: list.filter(function (row) { return statusOf(row) === 'paused'; }).length,
            inactive: list.filter(function (row) { return statusOf(row) === 'inactive' || statusOf(row) === 'withdrawn'; }).length,
            review: list.filter(function (row) { return statusOf(row) === 'needs_review'; }).length
        };
    }

    function studentsForGrade(grade, rows) {
        return asArray(rows || studentsFromState()).filter(function (student) {
            return normalizeGrade(gradeOf(student)) === grade;
        });
    }

    function studentsForTeacher(teacherName, rows) {
        var target = text(teacherName);
        return asArray(rows || studentsFromState()).filter(function (student) {
            return teacherNamesForStudent(student).indexOf(target) >= 0;
        });
    }

    function classSummaryOf(student) {
        return assignmentsOf(student).map(function (assignment) {
            return assignment.className;
        }).filter(Boolean).join(', ');
    }

    function scheduleSummaryOf(student) {
        return assignmentsOf(student).map(function (assignment) {
            return [assignment.day, assignment.period].filter(Boolean).join(' ');
        }).filter(Boolean).join(', ');
    }

    function selectedStudent() {
        if (!_selectedId) return null;
        return studentsFromState().find(function (student) {
            return String(rowId(student)) === String(_selectedId);
        }) || null;
    }

    async function loadFoundation(force) {
        if (_loading) return;
        var compat = ui().eieApmsCompat || {};
        var needsLoad = force || !compat.loadedAt || !studentsFromState().length;
        if (!needsLoad) {
            await loadTeacherRoster();
            return;
        }
        _loading = true;
        _error = '';
        try {
            if (window.EieApmsState && typeof EieApmsState.loadFoundation === 'function') {
                var result = await EieApmsState.loadFoundation({ force: !!force });
                if (result && result.success === false && Array.isArray(result.errors) && result.errors.length) {
                    _error = result.errors.map(function (entry) { return entry.error || String(entry); }).join('; ');
                }
            } else {
                var studentsPayload = await EieApi.getStudents();
                var rows = studentsPayload.confirmed_students || studentsPayload.data || studentsPayload.students || [];
                EieState.setStudents(asArray(rows));
                var timetablePayload = await EieApi.getTimetable(null, { status: ['active', 'im' + 'ported', 'needs_review'].join(',') });
                EieState.setTimetableCells(timetablePayload.timetable_cells || timetablePayload.data || []);
            }
            await loadTeacherRoster();
        } catch (err) {
            if (EieApi.isAuthError && EieApi.isAuthError(err) && window.EieApp && typeof EieApp.handleEie401 === 'function') {
                EieApp.handleEie401();
                return;
            }
            _error = err && err.message ? err.message : '학생 목록을 불러오지 못했습니다.';
        } finally {
            _loading = false;
        }
    }

    async function refreshView(force) {
        await loadFoundation(!!force);
        if (_selectedId && !selectedStudent()) {
            _query = _query || _selectedId;
            _selectedId = '';
            _mode = 'detail';
        }
        return EieRouter.open('students');
    }

    async function loadStudentContacts(studentId) {
        var sid = text(studentId);
        if (!sid || !window.EieApi || typeof EieApi.getStudentContacts !== 'function') return;
        try {
            var result = await EieApi.getStudentContacts(sid);
            var rows = result.contacts || result.data || [];
            if (window.EieState && typeof EieState.mergeStudentContacts === 'function') {
                EieState.mergeStudentContacts(sid, rows);
            }
        } catch (err) {
            _error = err && err.message ? err.message : '연락처를 불러오지 못했습니다.';
        }
    }

    async function loadStudentConsultations(studentId) {
        var sid = text(studentId);
        if (!sid || !window.EieApi || typeof EieApi.getConsultations !== 'function') return;
        try {
            var result = await EieApi.getConsultations(sid);
            var rows = result.consultations || result.data || [];
            if (window.EieState && typeof EieState.mergeStudentConsultations === 'function') {
                EieState.mergeStudentConsultations(sid, rows);
            }
        } catch (err) {
            _error = err && err.message ? err.message : '상담을 불러오지 못했습니다.';
        }
    }

    async function loadStudentAttendance(studentId) {
        var sid = text(studentId);
        if (!sid || !window.EieApi || typeof EieApi.getAttendanceRecords !== 'function') return;
        try {
            var result = await EieApi.getAttendanceRecords({ student_id: sid });
            var rows = result.attendance_records || result.attendance || result.data || [];
            if (window.EieState && typeof EieState.mergeStudentAttendance === 'function') {
                EieState.mergeStudentAttendance(sid, rows);
            }
        } catch (err) {
            _error = err && err.message ? err.message : '출석 기록을 불러오지 못했습니다.';
        }
    }

    async function loadStudentExamRecords(studentId) {
        var sid = text(studentId);
        if (!sid || !window.EieApi || typeof EieApi.getExamRecords !== 'function') return;
        try {
            var result = await EieApi.getExamRecords({ student_id: sid });
            _examRecordsByStudent[sid] = result.exam_records || result.data || [];
        } catch (err) {
            _examRecordsByStudent[sid] = _examRecordsByStudent[sid] || [];
            _error = err && err.message ? err.message : '성적표 기록을 불러오지 못했습니다.';
        }
    }

    function renderStatusFilters() {
        var items = [
            ['active', '재원', 'active'],
            ['new', '신입', 'new'],
            ['paused', '휴원', 'paused'],
            ['inactive', '퇴원', 'inactive'],
            ['all', '전체', 'all']
        ];
        return '<div class="eie-apms-status-filter" aria-label="상태 필터">'
            + items.map(function (item) {
                return '<button type="button" class="' + (_statusFilter === item[0] ? 'is-active ' : '') + 'eie-apms-filter-chip is-' + esc(item[2]) + '" onclick="EieStudentsView.setStatusFilter(' + jsArg(item[0]) + ')">' + esc(item[1]) + '</button>';
            }).join('')
            + '</div>';
    }

    function renderFilterControls() {
        var roster = teacherFilterRoster();
        return '<div class="eie-apms-filter-bar">'
            + renderStatusFilters()
            + '<div class="eie-apms-select-filters">'
            + '<label class="eie-apms-soft-select"><span>학년</span><select onchange="EieStudentsView.setGradeFilter(this.value)">'
            + '<option value="all"' + (_gradeFilter === 'all' ? ' selected' : '') + '>전체</option>'
            + STUDENT_GRADE_OPTIONS.map(function (grade) {
                return '<option value="' + esc(grade) + '"' + (_gradeFilter === grade ? ' selected' : '') + '>' + esc(grade) + '</option>';
            }).join('')
            + '</select></label>'
            + '<label class="eie-apms-soft-select"><span>선생님</span><select onchange="EieStudentsView.setTeacherFilter(this.value)">'
            + '<option value="all"' + (_teacherFilter === 'all' ? ' selected' : '') + '>전체</option>'
            + roster.map(function (name) {
                return '<option value="' + esc(name) + '"' + (_teacherFilter === name ? ' selected' : '') + '>' + esc(name) + '</option>';
            }).join('')
            + '</select></label>'
            + '</div>'
            + '</div>';
    }

    function renderSearchToolbar() {
        return '<div class="eie-apms-toolbar">'
            + '<label class="eie-apms-search" aria-label="학생 검색">'
            + '<span aria-hidden="true">⌕</span>'
            + '<input type="search" value="' + esc(_query) + '" placeholder="이름, 학교, 연락처, 수업으로 검색" oninput="EieStudentsView.setQuery(this.value)">'
            + '</label>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.refresh(true)" ' + (_loading ? 'disabled' : '') + '>새로고침</button>'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.startCreate()">+ 신규 등록</button>'
            + '</div>';
    }

    function printStatusLabel() {
        if (_printStatus === 'active') return '재원만';
        if (_printStatus === 'active_paused') return '재원+휴원';
        return '전체 상태';
    }

    function currentFilterLabel() {
        return [
            _gradeFilter !== 'all' ? '학년 ' + _gradeFilter : '',
            _teacherFilter !== 'all' ? '선생님 ' + _teacherFilter : '',
            _query ? '검색 "' + _query + '"' : ''
        ].filter(Boolean).join(' · ') || '전체';
    }

    function printGroups() {
        var rows = printScopeRows();
        if (_printGrouping === 'grade') {
            return STUDENT_GRADE_OPTIONS.map(function (grade) {
                return { title: grade, rows: studentsForGrade(grade, rows) };
            }).filter(function (group) { return group.rows.length > 0 || _gradeFilter === group.title; });
        }
        if (_printGrouping === 'teacher') {
            return teacherRoster().map(function (name) {
                return { title: name + ' 선생님', rows: studentsForTeacher(name, rows) };
            }).filter(function (group) { return group.rows.length > 0 || _teacherFilter === group.title.replace(' 선생님', ''); });
        }
        if (_printGrouping === 'all') return [{ title: '전체 명단', rows: rows }];
        return [{ title: '현재 필터', rows: rows }];
    }

    function printColumnConfig() {
        return {
            grade: _printGrouping !== 'grade',
            teacher: _printGrouping !== 'teacher',
            classInfo: _printIncludeClass,
            contacts: _printIncludeContacts,
            memo: _printIncludeMemo
        };
    }

    function printColumnCount(config) {
        return 5
            + (config.grade ? 1 : 0)
            + (config.teacher ? 1 : 0)
            + (config.classInfo ? 2 : 0)
            + (config.contacts ? 2 : 0)
            + (config.memo ? 1 : 0);
    }

    function renderPrintTable(group) {
        var summary = studentCountSummary(group.rows);
        var config = printColumnConfig();
        return '<section class="eie-student-print-section">'
            + '<h3>' + esc(group.title) + '<span>전체 ' + summary.total + '명 · 재원 ' + summary.active + '명 · 휴원 ' + summary.paused + '명</span></h3>'
            + '<table class="eie-student-print-table">'
            + '<thead><tr>'
            + '<th>No</th><th>학생명</th>'
            + (config.grade ? '<th>학년</th>' : '')
            + '<th>학교</th><th>상태</th>'
            + (config.teacher ? '<th>담당 선생님</th>' : '')
            + (config.classInfo ? '<th>수업/반</th><th>요일/교시</th>' : '')
            + (config.contacts ? '<th>학생 연락처</th><th>학부모 연락처</th>' : '')
            + '<th>등원일</th>'
            + (config.memo ? '<th>메모</th>' : '')
            + '</tr></thead>'
            + '<tbody>'
            + (group.rows.length ? group.rows.map(function (student, index) {
                return '<tr>'
                    + '<td>' + (index + 1) + '</td>'
                    + '<td><strong>' + esc(displayName(student)) + '</strong></td>'
                    + (config.grade ? '<td>' + esc(gradeOf(student)) + '</td>' : '')
                    + '<td>' + esc(schoolOf(student)) + '</td>'
                    + '<td>' + esc(statusLabel(statusOf(student))) + '</td>'
                    + (config.teacher ? '<td>' + esc(teacherNamesForStudent(student).join(', ')) + '</td>' : '')
                    + (config.classInfo ? '<td>' + esc(classSummaryOf(student)) + '</td><td>' + esc(scheduleSummaryOf(student)) + '</td>' : '')
                    + (config.contacts ? '<td>' + esc(primaryPhone(student)) + '</td><td>' + esc(parentPhoneOf(student)) + '</td>' : '')
                    + '<td>' + esc(enrollDateOf(student)) + '</td>'
                    + (config.memo ? '<td class="eie-student-print-memo">' + esc(memoOf(student)) + '</td>' : '')
                    + '</tr>';
            }).join('') : '<tr><td colspan="' + printColumnCount(config) + '" class="is-empty">해당 학생 없음</td></tr>')
            + '</tbody></table>'
            + '</section>';
    }

    function renderPrintSheet() {
        var groups = printGroups();
        var rows = groups.reduce(function (all, group) { return all.concat(group.rows); }, []);
        var summary = studentCountSummary(rows);
        return '<div id="eie-student-print-sheet" class="eie-student-print-sheet">'
            + '<div class="eie-student-print-title">'
            + '<h2>EIE 학생관리 명단</h2>'
            + '<p>출력 방식: ' + esc(_printGrouping) + ' · 상태: ' + esc(printStatusLabel()) + ' · 필터: ' + esc(currentFilterLabel()) + ' · 출력일: ' + todayIso() + '</p>'
            + '</div>'
            + '<div class="eie-student-print-summary-line">'
            + '<span>전체 <strong>' + summary.total + '</strong>명</span>'
            + '<span>재원 <strong>' + summary.active + '</strong>명</span>'
            + '<span>휴원 <strong>' + summary.paused + '</strong>명</span>'
            + '<span>퇴원 <strong>' + summary.inactive + '</strong>명</span>'
            + '<span>확인 필요 <strong>' + summary.review + '</strong>명</span>'
            + '</div>'
            + groups.map(renderPrintTable).join('')
            + '</div>';
    }

    function renderPrintPanel() {
        if (!_printPanelOpen) return '';
        return '<section class="eie-student-print-panel" aria-label="학생 명단 인쇄">'
            + '<div class="eie-student-print-panel-head"><div><h2>인쇄</h2><span>엑셀 워크시트형 명단</span></div><button type="button" class="eie-secondary-button" onclick="EieStudentsView.togglePrintPanel(false)">닫기</button></div>'
            + '<div class="eie-student-print-options">'
            + '<label><span>출력 방식</span><select onchange="EieStudentsView.setPrintOption(\'grouping\', this.value)">'
            + '<option value="grade"' + (_printGrouping === 'grade' ? ' selected' : '') + '>학년별</option>'
            + '<option value="teacher"' + (_printGrouping === 'teacher' ? ' selected' : '') + '>선생님별</option>'
            + '<option value="current"' + (_printGrouping === 'current' ? ' selected' : '') + '>현재 필터</option>'
            + '<option value="all"' + (_printGrouping === 'all' ? ' selected' : '') + '>전체 명단</option>'
            + '</select></label>'
            + '<label><span>상태</span><select onchange="EieStudentsView.setPrintOption(\'status\', this.value)">'
            + '<option value="active_paused"' + (_printStatus === 'active_paused' ? ' selected' : '') + '>재원 + 휴원</option>'
            + '<option value="active"' + (_printStatus === 'active' ? ' selected' : '') + '>재원만</option>'
            + '<option value="all"' + (_printStatus === 'all' ? ' selected' : '') + '>전체</option>'
            + '</select></label>'
            + '<label class="is-check"><input type="checkbox" ' + (_printIncludeContacts ? 'checked ' : '') + 'onchange="EieStudentsView.setPrintOption(\'contacts\', this.checked)"><span>연락처</span></label>'
            + '<label class="is-check"><input type="checkbox" ' + (_printIncludeClass ? 'checked ' : '') + 'onchange="EieStudentsView.setPrintOption(\'class\', this.checked)"><span>수업/반</span></label>'
            + '<label class="is-check"><input type="checkbox" ' + (_printIncludeMemo ? 'checked ' : '') + 'onchange="EieStudentsView.setPrintOption(\'memo\', this.checked)"><span>메모</span></label>'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.printStudents()">인쇄하기</button>'
            + '</div>'
            + renderPrintSheet()
            + '</section>';
    }

    function renderList() {
        var rows = visibleStudents();
        if (!rows.length) {
            return '<div class="eie-empty-box">조건에 맞는 학생이 없습니다.</div>';
        }
        return '<div class="eie-apms-student-list">'
            + rows.map(function (student) {
                var sid = rowId(student);
                var selected = sid && String(sid) === String(_selectedId);
                var phone = primaryPhone(student) || '연락처 미등록';
                var grade = [schoolOf(student), gradeOf(student)].filter(Boolean).join(' ') || '학년 미등록';
                var assignments = assignmentsOf(student);
                var classLabel = assignments[0]
                    ? [assignments[0].className, assignments[0].day, assignments[0].period].filter(Boolean).join(' · ')
                    : '수업 미배정';
                return '<button type="button" class="eie-apms-student-row' + (selected ? ' is-selected' : '') + '" onclick="EieStudentsView.openDetail(' + jsArg(sid) + ')">'
                    + '<span class="eie-apms-student-row-main">'
                    + '<strong>' + esc(displayName(student)) + '</strong>'
                    + renderStatusBadge(statusOf(student))
                    + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(grade) + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(phone) + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(classLabel) + (assignments.length > 1 ? ' 외 ' + (assignments.length - 1) + '개' : '') + '</span>'
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function renderEmptyDetail() {
        return '<aside class="eie-apms-detail-panel is-empty">'
            + '<div class="eie-apms-detail-empty-title">학생을 선택하세요</div>'
            + '<p>왼쪽 목록에서 학생 정보를 확인할 수 있습니다.</p>'
            + '</aside>';
    }

    function renderField(label, value) {
        return '<div class="eie-apms-field"><span>' + esc(label) + '</span><strong>' + esc(value || '미등록') + '</strong></div>';
    }

    function renderTeacherPicker(prefix, student) {
        var roster = teacherRoster();
        var selected = teacherNamesOf(student);
        if (!roster.length && selected.length) roster = selected;
        if (!roster.length) {
            return '<div class="eie-apms-teacher-picker is-wide">'
                + '<div class="eie-apms-form-label">담당 선생님</div>'
                + '<p class="eie-apms-muted">관리에서 선생님 계정을 만들거나 시간표에 선생님을 입력하면 선택 목록이 생깁니다.</p>'
                + '</div>';
        }
        return '<div class="eie-apms-teacher-picker is-wide">'
            + '<div class="eie-apms-form-label">담당 선생님</div>'
            + '<div class="eie-apms-teacher-options">'
            + roster.map(function (name) {
                var checked = selected.indexOf(name) >= 0;
                return '<label class="eie-apms-teacher-option">'
                    + '<input type="checkbox" name="' + prefix + '-teacher" value="' + esc(name) + '"' + (checked ? ' checked' : '') + '>'
                    + '<span>' + esc(name) + '</span>'
                    + '</label>';
            }).join('')
            + '</div>'
            + '</div>';
    }

    function renderGradeSelect(prefix, student) {
        var selected = normalizeGrade(gradeOf(student)) || gradeOf(student);
        var grades = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'];
        return '<label><span>학년</span><select id="' + prefix + '-grade">'
            + '<option value="">선택</option>'
            + grades.map(function (grade) {
                return '<option value="' + esc(grade) + '"' + (selected === grade ? ' selected' : '') + '>' + esc(grade) + '</option>';
            }).join('')
            + '</select></label>';
    }

    function renderStudentTypeSelect(prefix, student) {
        var selected = studentTypeOf(student);
        var types = ['일반', '신입', '재등록', '퇴원'];
        return '<label><span>학생구분</span><select id="' + prefix + '-student-type">'
            + types.map(function (type) {
                return '<option value="' + esc(type) + '"' + (selected === type ? ' selected' : '') + '>' + esc(type) + '</option>';
            }).join('')
            + '</select></label>';
    }

    function renderContacts(student) {
        var phone = primaryPhone(student);
        var contacts = contactsOf(student);
        var sid = rowId(student);
        if (!contacts.length && phone) {
            contacts = [{ id: 'primary', contact_label: '대표 연락처', phone: phone, is_primary: true }];
        }
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>연락처</h3><button type="button" class="eie-secondary-button" onclick="EieStudentsView.createContact(' + jsArg(sid) + ')">추가</button></div>'
            + (contacts.length ? contacts.map(function (contact, index) {
                var label = text(contact.contact_label || contact.label || contact.relation) || (index === 0 ? '대표 연락처' : '연락처');
                var contactPhone = text(contact.phone || contact.phone_raw || contact.normalized_phone) || '미등록';
                var contactId = text(contact.id);
                return '<div class="eie-apms-contact-row">'
                    + '<div><strong>' + esc(label) + '</strong><span>' + (contact.is_primary || index === 0 ? '대표' : '추가') + '</span></div>'
                    + '<div class="eie-apms-inline-actions">'
                    + '<button type="button" onclick="EieStudentsView.copyPhone(' + jsArg(contactPhone) + ')">' + esc(contactPhone) + '</button>'
                    + (contactId && contactId !== 'primary' ? '<button type="button" onclick="EieStudentsView.editContact(' + jsArg(contactId) + ')">수정</button>' : '')
                    + '<button type="button" disabled title="삭제 처리는 준비 중입니다.">삭제 보류</button>'
                    + '</div>'
                    + '</div>';
            }).join('') : '<p class="eie-apms-muted">등록된 연락처가 없습니다. 학생 수정에서 대표 연락처를 저장할 수 있습니다.</p>')
            + '</div>';
    }

    function renderConsultations(student) {
        var sid = rowId(student);
        var rows = consultationsOf(student);
        var form = _consultationMode === 'create' || _consultationMode === 'edit'
            ? renderConsultationForm(sid)
            : '';
        return '<div class="eie-apms-card eie-apms-consultation-panel">'
            + '<div class="eie-apms-section-head"><h3>상담 이력</h3><span>' + esc(String(rows.length)) + '건</span></div>'
            + '<div class="eie-apms-consultation-actions">'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.createConsultation(' + jsArg(sid) + ')">+ 새 상담 기록하기</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.showPreparing(\'상담 흐름 요약\')">상담 흐름 요약</button>'
            + '</div>'
            + form
            + '<div class="eie-apms-consultation-list">'
            + (rows.length ? rows.map(renderConsultationRow).join('') : '<div class="eie-apms-consultation-empty">상담 기록이 없습니다.</div>')
            + '</div>'
            + '</div>';
    }

    function selectedPinnedConsultation(student, explicitId) {
        var sid = rowId(student);
        var rows = consultationsOf(student);
        var requested = text(explicitId);
        var stored = text(_pinnedConsultationByStudent[sid]);
        var selected = rows.find(function (row) { return consultationId(row) === requested; })
            || rows.find(function (row) { return consultationId(row) === stored; })
            || rows[0]
            || null;
        if (selected) _pinnedConsultationByStudent[sid] = consultationId(selected);
        return selected;
    }

    function renderPinnedConsultationPreview(student, consultation) {
        var sid = rowId(student);
        if (!consultation) {
            if (_pinnedConsultationFormStudent === sid) {
                return renderPinnedConsultationCreateForm(sid);
            }
            return '<div class="eie-apms-pinned-consultation-empty">'
                + '<strong>상담 기록 없음</strong>'
                + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.startPinnedConsultation(' + jsArg(sid) + ')">+ 첫 상담 기록하기</button>'
                + '</div>';
        }
        var date = consultationDate(consultation) || '날짜 없음';
        var type = consultationType(consultation);
        var content = text(consultation.content) || '상담 내용이 없습니다.';
        var nextAction = text(consultation.next_action || consultation.nextAction);
        return '<div class="eie-apms-pinned-consultation-preview">'
            + '<div class="eie-apms-consultation-meta"><span>' + esc(date) + '</span><em>' + esc(type) + '</em></div>'
            + '<p>' + esc(content) + '</p>'
            + (nextAction ? '<div class="eie-apms-consultation-next"><strong>후속조치</strong> ' + esc(nextAction) + '</div>' : '<div class="eie-apms-consultation-next is-empty"><strong>후속조치</strong> 다음 조치 없음</div>')
            + '</div>';
    }

    function renderPinnedConsultationCreateForm(sid) {
        return '<div class="eie-apms-pinned-consultation-form">'
            + '<label>상담일<input id="pinned-consultation-date" type="date" value="' + esc(todayIso()) + '"></label>'
            + '<label>유형<select id="pinned-consultation-type">' + renderConsultationTypeOptions('학습') + '</select></label>'
            + '<label class="is-wide">상담 내용<textarea id="pinned-consultation-content" rows="4" placeholder="상담 내용을 입력하세요."></textarea></label>'
            + '<label class="is-wide">후속조치<textarea id="pinned-consultation-next-action" rows="2" placeholder="다음 조치를 입력하세요."></textarea></label>'
            + '<div class="eie-apms-consultation-actions is-wide">'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.savePinnedConsultation(' + jsArg(sid) + ')">저장</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.cancelPinnedConsultation(' + jsArg(sid) + ')">취소</button>'
            + '</div>'
            + '</div>';
    }

    function renderPinnedConsultationCard(student) {
        var sid = rowId(student);
        var rows = consultationsOf(student);
        var recentRows = rows.slice(0, 5);
        var selected = selectedPinnedConsultation(student);
        var selectedId = selected ? consultationId(selected) : '';
        var dateButtons = recentRows.map(function (row) {
            var id = consultationId(row);
            return '<button type="button" class="eie-apms-consult-date-button' + (id === selectedId ? ' is-active' : '') + '" data-eie-consultation-id="' + esc(id) + '" onclick="EieStudentsView.selectPinnedConsultation(' + jsArg(sid) + ', ' + jsArg(id) + ')">' + esc(consultationDateLabel(consultationDate(row))) + '</button>';
        }).join('');
        return '<div class="eie-apms-card eie-apms-pinned-consultation" data-eie-pinned-consultation-student="' + esc(sid) + '">'
            + '<div class="eie-apms-section-head"><h3>최근 상담</h3><button type="button" class="eie-primary-button" onclick="EieStudentsView.createConsultation(' + jsArg(sid) + ')">+ 상담</button></div>'
            + '<div class="eie-apms-pinned-consultation-body" id="eie-pinned-consultation-body-' + esc(sid) + '">'
            + (recentRows.length > 1 ? '<div class="eie-apms-consult-date-row">' + dateButtons + '</div>' : '')
            + renderPinnedConsultationPreview(student, selected)
            + (rows.length ? '<div class="eie-apms-pinned-consultation-footer"><button type="button" class="eie-secondary-button" onclick="EieStudentsView.setTab(\'consultation\')">다른 상담 보기</button></div>' : '')
            + '</div>'
            + '</div>';
        return '<div class="eie-apms-card eie-apms-pinned-consultation" data-eie-pinned-consultation-student="' + esc(sid) + '">'
            + '<div class="eie-apms-section-head"><h3>등원/상담</h3>' + (rows.length ? '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.setTab(\'consultation\')">상담 전체보기</button>' : '') + '</div>'
            + '<div class="eie-apms-pinned-consultation-body" id="eie-pinned-consultation-body-' + esc(sid) + '">'
            + renderPinnedConsultationCreateForm(sid)
            + '<div class="eie-apms-pinned-consultation-list-head">상담목록</div>'
            + '<div class="eie-apms-consultation-list eie-apms-pinned-consultation-list">'
            + (recentRows.length ? recentRows.map(renderPinnedConsultationRow).join('') : '<div class="eie-apms-consultation-empty">상담 기록 없음</div>')
            + '</div>'
            + (!rows.length ? '<div class="eie-apms-pinned-consultation-first">+ 첫 상담 기록하기</div>' : '')
            + '</div>'
            + '</div>';
    }

    function renderConsultationTypeOptions(currentType) {
        var current = text(currentType);
        var types = ['학습', '태도', '성적', '기타'];
        var options = '';
        if (current && types.indexOf(current) < 0) {
            options += '<option value="' + esc(current) + '" selected>' + esc(current) + '</option>';
        }
        return options + types.map(function (type) {
            return '<option value="' + esc(type) + '"' + (current === type ? ' selected' : '') + '>' + esc(type) + '</option>';
        }).join('');
    }

    function currentEditingConsultation() {
        var id = text(_editingConsultationId);
        if (!id) return null;
        return asArray(db().consultations).find(function (row) {
            return String(row.id || '') === String(id);
        }) || null;
    }

    function renderConsultationForm(sid) {
        var editing = _consultationMode === 'edit';
        var current = editing ? currentEditingConsultation() : null;
        var draft = !editing && _consultationDraft && String(_consultationDraft.student_id || '') === String(sid) ? _consultationDraft : null;
        var date = consultationDate(current) || text(draft && draft.date) || todayIso();
        var type = consultationType(current) || text(draft && draft.type);
        var content = current ? text(current.content) : text(draft && draft.content);
        var nextAction = current ? text(current.next_action || current.nextAction) : text(draft && (draft.next_action || draft.nextAction));
        return '<div class="eie-apms-consultation-form">'
            + '<div class="eie-apms-consultation-form-head">'
            + '<strong>' + (editing ? '상담 수정' : '상담 기록 추가') + '</strong>'
            + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.cancelConsultation()">닫기</button>'
            + '</div>'
            + '<div class="eie-apms-consultation-form-grid">'
            + '<label><span>날짜</span><input id="consultation-date" type="date" value="' + esc(date) + '"></label>'
            + '<label><span>유형</span><select id="consultation-type">' + renderConsultationTypeOptions(type) + '</select></label>'
            + '</div>'
            + '<label class="eie-apms-consultation-field"><span>상담 내용</span><textarea id="consultation-content" placeholder="상담 내용을 입력하세요">' + esc(content) + '</textarea></label>'
            + '<label class="eie-apms-consultation-field"><span>조치 사항</span><textarea id="consultation-next-action" placeholder="다음 조치 사항 (선택)">' + esc(nextAction) + '</textarea></label>'
            + '<div class="eie-apms-consultation-ai">'
            + '<strong>상담 요약</strong>'
            + '<p>AI 요약은 준비중입니다. 오늘은 상담 전문과 후속 조치를 저장합니다.</p>'
            + '</div>'
            + '<div class="eie-apms-consultation-save-row">'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.saveConsultation(' + jsArg(sid) + ')" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : (editing ? '수정 완료' : '저장')) + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.cancelConsultation()" ' + (_saving ? 'disabled' : '') + '>취소</button>'
            + '</div>'
            + '</div>';
    }

    function renderConsultationRow(row) {
        var id = text(row.id);
        var date = consultationDate(row) || '-';
        var type = consultationType(row);
        var content = text(row.content) || '내용 없음';
        var nextAction = text(row.next_action || row.nextAction);
        var createdAt = text(row.created_at);
        return '<div class="eie-apms-consultation-row">'
            + '<div class="eie-apms-consultation-main">'
            + '<div class="eie-apms-consultation-meta"><span>' + esc(date) + '</span><em>' + esc(type) + '</em></div>'
            + '<p>' + esc(content) + '</p>'
            + (nextAction ? '<div class="eie-apms-consultation-next"><strong>후속조치</strong> ' + esc(nextAction) + '</div>' : '')
            + (createdAt ? '<small>등록 시각 ' + esc(createdAt) + '</small>' : '')
            + '</div>'
            + '<div class="eie-apms-inline-actions">'
            + (id ? '<button type="button" onclick="EieStudentsView.editConsultation(' + jsArg(id) + ')">수정</button>' : '')
            + (id ? '<button type="button" onclick="EieStudentsView.deleteConsultation(' + jsArg(id) + ')">삭제</button>' : '')
            + '</div>'
            + '</div>';
    }

    function renderPinnedConsultationRow(row) {
        var date = consultationDate(row) || '-';
        var type = consultationType(row);
        var content = text(row.content) || '상담 내용이 없습니다.';
        var nextAction = text(row.next_action || row.nextAction);
        return '<div class="eie-apms-consultation-row eie-apms-pinned-consultation-row">'
            + '<div class="eie-apms-consultation-main">'
            + '<div class="eie-apms-consultation-meta"><span>' + esc(date) + '</span><em>' + esc(type) + '</em></div>'
            + '<p>' + esc(content) + '</p>'
            + (nextAction ? '<div class="eie-apms-consultation-next"><strong>후속조치</strong> ' + esc(nextAction) + '</div>' : '')
            + '</div>'
            + '</div>';
    }

    function renderAssignments(student) {
        var assignments = assignmentsOf(student);
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>수업 배정</h3><span>' + assignments.length + '개</span></div>'
            + (assignments.length ? assignments.map(function (assignment) {
                var title = assignment.className || '수업명 미등록';
                var meta = [assignment.teacherName, assignment.day, assignment.period, assignment.time].filter(Boolean).join(' · ') || '시간표 정보 미등록';
                return '<button type="button" class="eie-apms-assignment-row" onclick="EieStudentsView.openClassroom(' + jsArg(assignment.cellId) + ')">'
                    + '<strong>' + esc(title) + '</strong>'
                    + '<span>' + esc(meta) + '</span>'
                    + '</button>';
            }).join('') : '<p class="eie-apms-muted">배정된 EIE 수업이 없습니다.</p>')
            + '<div class="eie-action-row">'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.openTimetable()">시간표 보기</button>'
            + '</div>'
            + '</div>';
    }

    function renderReadyPanel(kind) {
        var title = kind === 'consultation' ? '상담' : '출결/숙제';
        var body = kind === 'consultation'
            ? '상담 저장 endpoint는 다음 라운드에서 연결합니다. 현재는 APMS와 같은 위치와 문법만 유지합니다.'
            : '출결과 숙제 저장 endpoint는 다음 라운드에서 연결합니다. 지금은 학생별 운영 정보를 읽기 전용으로 정리합니다.';
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>' + esc(title) + '</h3><span>준비중</span></div>'
            + '<p class="eie-apms-muted">' + esc(body) + '</p>'
            + '<button type="button" class="eie-secondary-button" disabled>저장 준비중</button>'
            + '</div>';
    }

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
    }

    function attendanceOf(student) {
        var sid = rowId(student);
        return asArray(db().attendance).filter(function (row) {
            return String(row.student_id || '') === String(sid);
        }).sort(function (a, b) {
            return text(b.date || b.created_at).localeCompare(text(a.date || a.created_at));
        });
    }

    function consultationDate(row) {
        return text(row && (row.date || row.consultation_date || row.created_at)).slice(0, 10);
    }

    function consultationType(row) {
        return text(row && row.type) || '상담';
    }

    function renderAttendancePanel(student) {
        var sid = rowId(student);
        var today = todayIso();
        var rows = attendanceOf(student);
        var todayRecord = rows.find(function (row) {
            return text(row.date || row.attendance_date || row.created_at).slice(0, 10) === today;
        }) || null;
        var status = text(todayRecord && todayRecord.status) || '미정';
        var buttons = ['등원', '결석', '지각', '조퇴'].map(function (next) {
            return '<button type="button" class="' + (status === next ? 'eie-primary-button' : 'eie-secondary-button') + '" onclick="EieStudentsView.saveAttendance(' + jsArg(sid) + ', ' + jsArg(next) + ')">' + esc(next) + '</button>';
        }).join('');
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>출결/숙제</h3><span>오늘 ' + esc(status) + '</span></div>'
            + '<div class="eie-apms-attendance-actions">' + buttons + '</div>'
            + '<p class="eie-apms-muted">숙제 저장은 다음 단계입니다. 오늘은 출석 상태를 EIE 전용 출석부에 저장합니다.</p>'
            + (rows.length ? '<div class="eie-apms-attendance-history">'
                + rows.slice(0, 8).map(function (row) {
                    return '<div class="eie-apms-contact-row"><div><strong>' + esc(text(row.date || row.created_at).slice(0, 10) || '-') + '</strong><span>' + esc(row.memo || '메모 없음') + '</span></div><strong>' + esc(row.status || '-') + '</strong></div>';
                }).join('')
                + '</div>' : '<p class="eie-apms-muted">저장된 출석 기록이 없습니다.</p>')
            + '</div>';
    }

    function renderExamCategoryCards() {
        return '<div class="eie-exam-category-grid" role="tablist" aria-label="성적 유형">'
            + EXAM_CATEGORIES.map(function (item) {
                return '<button type="button" role="tab" aria-selected="' + (_examCategory === item.key ? 'true' : 'false') + '" class="eie-exam-category-card' + (_examCategory === item.key ? ' is-active' : '') + '" onclick="EieStudentsView.setExamCategory(' + jsArg(item.key) + ')">'
                    + '<strong>' + esc(item.label) + '</strong>'
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function renderExamRecordRow(row) {
        var scoreLabel = row.score !== undefined && row.score !== null && row.score !== ''
            ? String(row.score) + (row.max_score !== undefined && row.max_score !== null && row.max_score !== '' ? ' / ' + String(row.max_score) : '')
            : '-';
        return '<div class="eie-exam-record-row">'
            + '<div>'
            + '<strong>' + esc(row.title || examCategoryLabel(row.category)) + '</strong>'
            + '<span>' + esc([row.exam_date, row.level, row.memo].filter(Boolean).join(' · ') || '메모 없음') + '</span>'
            + '</div>'
            + '<div class="eie-exam-record-score">' + esc(scoreLabel) + '</div>'
            + '</div>';
    }

    function renderExamPanel(student) {
        var sid = rowId(student);
        var category = _examCategory || 'month_end';
        var rows = examRecordsOf(student).filter(function (row) {
            return text(row.category) === category;
        });
        var classId = text((assignmentsOf(student)[0] || {}).cellId || (assignmentsOf(student)[0] || {}).cell_id || '');
        return '<div class="eie-apms-card eie-exam-panel" data-eie-exam-category="' + esc(category) + '">'
            + '<div class="eie-apms-section-head eie-exam-panel-head"><h3>' + esc(examCategoryLabel(category)) + '</h3><button type="button" class="eie-secondary-button" onclick="EieStudentsView.openGradeLedger(' + jsArg(sid) + ', ' + jsArg(classId) + ')">성적표 열기</button></div>'
            + '<div class="eie-exam-record-card">'
            + '<div class="eie-exam-card-title"><strong>기록</strong><span>최근 12개</span></div>'
            + '<div class="eie-exam-record-list">'
            + (rows.length ? rows.slice(0, 12).map(renderExamRecordRow).join('') : '<div class="eie-empty-box">저장된 성적표 기록이 없습니다.</div>')
            + '</div>'
            + '</div>'
            + '</div>';
    }

    function renderExamTab(student) {
        return '<div class="eie-exam-tab">'
            + renderGradeReportPanel(student)
            + renderExamCategoryCards()
            + renderExamPanel(student)
            + '</div>';
    }

    function renderBasicTab(student) {
        return '<div class="eie-apms-basic-stack">'
            + '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>기본정보</h3><span>EIE</span></div>'
            + '<div class="eie-apms-field-grid">'
            + renderField('학생명', displayName(student))
            + renderField('학생구분', studentTypeOf(student))
            + renderField('학년', gradeOf(student))
            + renderField('학교', schoolOf(student))
            + renderField('상태', statusLabel(statusOf(student)))
            + renderField('등원일', enrollDateOf(student) || '미등록')
            + renderField('학생 연락처', primaryPhone(student))
            + renderField('학부모 연락처', parentPhoneOf(student))
            + renderField('보호자 관계', guardianRelationOf(student))
            + renderField('주소', addressOf(student))
            + renderField('차량', vehicleInfoOf(student))
            + renderField('담당 선생님', teacherNamesOf(student).join(', '))
            + '</div>'
            + '<div class="eie-apms-note">'
            + '<span>메모</span>'
            + '<p>' + esc(memoOf(student) || '메모가 없습니다.') + '</p>'
            + '</div>'
            + '</div>'
            + renderContacts(student)
            + renderAssignments(student)
            + renderAttendancePanel(student)
            + '</div>';
    }

    function renderTabBody(student) {
        if (_tab === 'grades') return renderExamTab(student);
        if (_tab === 'consultation') return renderConsultations(student);
        return renderBasicTab(student);
    }

    function renderTabButton(tab, label) {
        return '<button type="button" class="eie-apms-tab' + (_tab === tab ? ' is-active' : '') + '" onclick="EieStudentsView.setTab(' + jsArg(tab) + ')">' + esc(label) + '</button>';
    }

    function renderDetailHeader(student) {
        var sid = rowId(student);
        var meta = [
            [schoolOf(student), gradeOf(student)].filter(Boolean).join(' '),
            assignmentsOf(student).length + '개 수업',
            teacherNamesOf(student).join(', ')
        ].filter(Boolean);
        return '<div class="eie-apms-detail-head eie-apms-student-profile-head">'
            + '<div class="eie-apms-student-head-main">'
            + '<div class="eie-apms-student-head-title">'
            + '<h1>' + esc(displayName(student)) + '</h1>'
            + '<span class="eie-apms-student-status-dot ' + statusClass(statusOf(student)) + '"></span>'
            + '<span class="eie-apms-student-status-text ' + statusClass(statusOf(student)) + '">' + esc(statusLabel(statusOf(student))) + '</span>'
            + '</div>'
            + '<div class="eie-apms-student-meta-line">' + (meta.length ? meta.map(function (item) {
                return '<span>' + esc(item) + '</span>';
            }).join('') : '<span>학년 미등록</span>') + '</div>'
            + '</div>'
            + '<div class="eie-apms-student-head-actions">'
            + '<button type="button" class="eie-icon-button eie-apms-detail-edit" onclick="EieStudentsView.startEdit(' + jsArg(sid) + ')">수정</button>'
            + '<button type="button" class="eie-icon-button eie-apms-detail-close" onclick="EieStudentsView.closeDetail()">닫기</button>'
            + '</div>'
            + '</div>';
    }

    function renderDetailTabs() {
        return '<div class="eie-apms-tabs eie-apms-header-tabs">'
            + renderTabButton('basic', '기본')
            + renderTabButton('consultation', '상담')
            + renderTabButton('grades', '성적')
            + '</div>';
    }

    async function renderSharedStudentDetail(student) {
        if (!student) return renderEmptyDetail();
        if (!window.EieTimetableView || typeof EieTimetableView.renderPanelOnlyWithContext !== 'function') {
            return '<aside class="eie-apms-detail-panel is-empty"><div class="eie-apms-detail-empty-title">학생 상세를 불러올 수 없습니다.</div></aside>';
        }
        var assignment = assignmentsOf(student)[0] || {};
        var sid = rowId(student);
        var tab = _tab === 'consultation' ? 'consultation' : (_tab === 'grades' ? 'grades' : 'basic');
        var panel = await EieTimetableView.renderPanelOnlyWithContext({
            route: 'students',
            mountRoute: 'students',
            studentId: sid,
            studentName: displayName(student),
            studentDetailTab: tab,
            cellId: text(assignment.cellId || assignment.cell_id || assignment.timetable_cell_id || '')
        });
        return String(panel || '')
            .replace(/data-eie-v2-student-back/g, 'onclick="EieStudentsView.closeDetail()"')
            .replace(/data-eie-v2-student-edit/g, 'onclick="EieStudentsView.startEdit()"')
            .replace(/data-eie-v2-student-detail-tab="basic"/g, 'onclick="EieStudentsView.setTab(\'basic\')" data-eie-students-borrowed-tab="basic"')
            .replace(/data-eie-v2-student-detail-tab="consultation"/g, 'onclick="EieStudentsView.setTab(\'consultation\')" data-eie-students-borrowed-tab="consultation"')
            .replace(/data-eie-v2-student-detail-tab="grades"/g, 'onclick="EieStudentsView.setTab(\'grades\')" data-eie-students-borrowed-tab="grades"');
    }

    async function renderDetail(student) {
        if (!student) return renderEmptyDetail();
        var sid = rowId(student);
        if (_mode === 'edit') return renderEditForm(student);
        return renderSharedStudentDetail(student);
    }

    function renderCreateForm() {
        return renderStudentForm(null);
    }

    function renderEditForm(student) {
        return renderStudentForm(student);
    }

    function renderStudentForm(student) {
        var isEdit = !!student;
        var sid = isEdit ? rowId(student) : '';
        var prefix = isEdit ? 'edit' : 'create';
        var title = isEdit ? '학생 정보 수정' : '신규 학생 등록';
        var status = isEdit ? statusOf(student) : 'active';
        return '<aside class="eie-apms-detail-panel">'
            + '<div class="eie-apms-detail-head">'
            + '<h2>' + esc(title) + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="' + (isEdit ? 'EieStudentsView.cancelEdit()' : 'EieStudentsView.cancelCreate()') + '">닫기</button>'
            + '</div>'
            + '<div id="eie-student-form-msg"></div>'
            + '<div class="eie-apms-form">'
            + '<label><span>학생명*</span><input id="' + prefix + '-name" type="text" value="' + esc(isEdit ? displayName(student) : '') + '" autocomplete="off"></label>'
            + renderStudentTypeSelect(prefix, student)
            + renderGradeSelect(prefix, student)
            + '<label><span>학교</span><input id="' + prefix + '-school" type="text" value="' + esc(isEdit ? schoolOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>등원일</span><input id="' + prefix + '-enroll-date" type="date" value="' + esc(isEdit ? enrollDateOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>학생 연락처</span><input id="' + prefix + '-phone" type="tel" value="' + esc(isEdit ? primaryPhone(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>학부모 연락처</span><input id="' + prefix + '-parent-phone" type="tel" value="' + esc(isEdit ? parentPhoneOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>보호자 관계</span><input id="' + prefix + '-guardian-relation" type="text" value="' + esc(isEdit ? guardianRelationOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>주소</span><input id="' + prefix + '-address" type="text" value="' + esc(isEdit ? addressOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>차량</span><input id="' + prefix + '-vehicle" type="text" value="' + esc(isEdit ? vehicleInfoOf(student) : '') + '" autocomplete="off"></label>'
            + renderTeacherPicker(prefix, student)
            + '<label><span>상태</span><select id="' + prefix + '-status">'
            + '<option value="active"' + (status === 'active' ? ' selected' : '') + '>재원</option>'
            + '<option value="paused"' + (status === 'paused' ? ' selected' : '') + '>휴원</option>'
            + '<option value="inactive"' + (status === 'inactive' ? ' selected' : '') + '>퇴원</option>'
            + '<option value="needs_review"' + (status === 'needs_review' ? ' selected' : '') + '>확인 필요</option>'
            + '</select></label>'
            + (isEdit ? '<div class="eie-action-row is-wide">'
                + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.setEditStatus(\'paused\')">휴원 입력</button>'
                + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.setEditStatus(\'inactive\')">퇴원 입력</button>'
                + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.setEditStatus(\'active\')">재원 복구</button>'
                + '</div>' : '')
            + '<label class="is-wide"><span>메모</span><textarea id="' + prefix + '-memo">' + esc(isEdit ? memoOf(student) : '') + '</textarea></label>'
            + '<div class="eie-action-row is-wide">'
            + '<button type="button" class="eie-primary-button" onclick="' + (isEdit ? 'EieStudentsView.submitEdit(' + jsArg(sid) + ')' : 'EieStudentsView.submitCreate()') + '" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '저장') + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="' + (isEdit ? 'EieStudentsView.cancelEdit()' : 'EieStudentsView.cancelCreate()') + '">취소</button>'
            + '</div>'
            + '</div>'
            + '</aside>';
    }

    function formPayload(prefix) {
        var name = text(document.getElementById(prefix + '-name') && document.getElementById(prefix + '-name').value);
        var grade = text(document.getElementById(prefix + '-grade') && document.getElementById(prefix + '-grade').value);
        var school = text(document.getElementById(prefix + '-school') && document.getElementById(prefix + '-school').value);
        var enrollDate = text(document.getElementById(prefix + '-enroll-date') && document.getElementById(prefix + '-enroll-date').value);
        var phone = text(document.getElementById(prefix + '-phone') && document.getElementById(prefix + '-phone').value);
        var parentPhone = text(document.getElementById(prefix + '-parent-phone') && document.getElementById(prefix + '-parent-phone').value);
        var guardianRelation = text(document.getElementById(prefix + '-guardian-relation') && document.getElementById(prefix + '-guardian-relation').value);
        var address = text(document.getElementById(prefix + '-address') && document.getElementById(prefix + '-address').value);
        var vehicle = text(document.getElementById(prefix + '-vehicle') && document.getElementById(prefix + '-vehicle').value);
        var studentTypeEl = document.getElementById(prefix + '-student-type');
        var statusEl = document.getElementById(prefix + '-status');
        var memo = text(document.getElementById(prefix + '-memo') && document.getElementById(prefix + '-memo').value);
        var teacherInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="' + prefix + '-teacher"]:checked'));
        var teacherNames = uniqueNames(teacherInputs.map(function (input) { return input.value; }));
        var payload = {
            display_name: name,
            name: name,
            grade: normalizeGrade(grade),
            school_name: school,
            enrollment_date: enrollDate,
            first_attendance_date: enrollDate,
            first_attended_at: enrollDate,
            phone: phone,
            student_phone: phone,
            parent_phone: parentPhone,
            guardian_relation: guardianRelation,
            student_address: address,
            vehicle_info: vehicle,
            student_type: studentTypeEl ? studentTypeEl.value : '일반',
            teacher_names: teacherNames,
            status: statusEl ? statusEl.value : 'active',
            memo: memo
        };
        if (['inactive', 'withdrawn'].includes(payload.status)) payload.withdrawn_at = todayIso();
        if (payload.status === 'active') payload.withdrawn_at = '';
        return payload;
    }

    function showFormError(message) {
        var target = document.getElementById('eie-student-form-msg');
        if (target) target.innerHTML = '<div class="eie-error-box">' + esc(message) + '</div>';
    }

    function normalizeReturnCtx(returnCtx) {
        if (!returnCtx || typeof returnCtx !== 'object') return null;
        var route = text(returnCtx.route || returnCtx.from);
        if (route !== 'timetable') return null;
        return {
            from: 'timetable',
            route: 'timetable',
            selectedDay: text(returnCtx.selectedDay || returnCtx.day),
            sessionId: text(returnCtx.sessionId || returnCtx.session_id),
            cellId: text(returnCtx.cellId || returnCtx.cell_id)
        };
    }

    function setReturnCtx(returnCtx) {
        var normalized = normalizeReturnCtx(returnCtx);
        if (normalized) _returnCtx = normalized;
    }

    function isStudentsRouteActive() {
        return String(window.location && window.location.hash || '').replace(/^#/, '') === 'students';
    }

    async function refreshStudentsView() {
        if (isStudentsRouteActive() && window.EieApp && typeof EieApp.mount === 'function') {
            await EieApp.mount(await window.EieStudentsView.render());
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') await EieRouter.open('students');
    }

    function renderReturnAction() {
        if (!_returnCtx) return '';
        return '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.returnToTimetable()">시간표로 돌아가기</button>';
    }

    async function refreshEieStudentFoundationAfterMutation(row) {
        if (row && row.id && window.EieState && typeof EieState.upsertStudent === 'function') {
            EieState.upsertStudent(row);
        }
        if (window.EieApmsState && typeof EieApmsState.syncStudent === 'function' && row && row.id) {
            EieApmsState.syncStudent(row);
        }
        if (window.EieApmsState && typeof EieApmsState.loadFoundation === 'function') {
            await EieApmsState.loadFoundation({ force: true }).catch(function () { return null; });
        } else {
            await loadFoundation(true);
        }
    }

    async function afterWrite(result, studentId) {
        var row = result && (result.student || result.data);
        if (studentId) _selectedId = String(studentId);
        if (row && row.id) _selectedId = String(row.id);
        _mode = 'detail';
        _notice = '저장했습니다.';
        await refreshEieStudentFoundationAfterMutation(row);
        await EieRouter.open('students');
    }

    window.EieStudentsView = {
        render: async function () {
            await loadFoundation(false);
            var selected = selectedStudent();
            if (_selectedId && !selected) selected = null;
            var panel = _mode === 'create' ? renderCreateForm() : await renderDetail(selected);
            var noticeHtml = _notice ? '<div class="eie-success-box">' + esc(_notice) + '</div>' : '';
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var loadingHtml = _loading ? '<div class="eie-api-note">학생 정보를 불러오는 중입니다.</div>' : '';
            return '<section class="eie-apms-students-screen" aria-labelledby="eie-students-title">'
                + '<div class="eie-apms-page-head">'
                + '<div><h1 id="eie-students-title">학생관리</h1></div>'
                + '</div>'
                + noticeHtml + errorHtml + loadingHtml
                + renderSearchToolbar()
                + renderFilterControls()
                + '<div class="eie-apms-student-layout">'
                + '<div class="eie-apms-list-panel">' + renderList() + '</div>'
                + panel
                + '</div>'
                + '</section>';
        },

        setQuery: function (query, returnCtx) {
            _query = text(query);
            setReturnCtx(returnCtx);
            EieRouter.open('students');
        },

        setStatusFilter: function (status) {
            _statusFilter = text(status) || 'active';
            EieRouter.open('students');
        },

        setGradeFilter: function (grade) {
            _gradeFilter = text(grade) || 'all';
            EieRouter.open('students');
        },

        setTeacherFilter: function (teacherName) {
            _teacherFilter = text(teacherName) || 'all';
            EieRouter.open('students');
        },

        selectGradeCard: function (grade) {
            _gradeFilter = text(grade) || 'all';
            _teacherFilter = 'all';
            EieRouter.open('students');
        },

        selectTeacherCard: function (teacherName) {
            _teacherFilter = text(teacherName) || 'all';
            _gradeFilter = 'all';
            EieRouter.open('students');
        },

        togglePrintPanel: function (forceOpen) {
            _printPanelOpen = typeof forceOpen === 'boolean' ? forceOpen : !_printPanelOpen;
            EieRouter.open('students');
        },

        setPrintOption: function (key, value) {
            if (key === 'grouping') _printGrouping = text(value) || 'grade';
            if (key === 'status') _printStatus = text(value) || 'active_paused';
            if (key === 'contacts') _printIncludeContacts = !!value;
            if (key === 'class') _printIncludeClass = !!value;
            if (key === 'memo') _printIncludeMemo = !!value;
            EieRouter.open('students');
        },

        printStudents: function () {
            document.body.classList.add('eie-printing-students');
            var cleanup = function () {
                document.body.classList.remove('eie-printing-students');
                window.removeEventListener('afterprint', cleanup);
            };
            window.addEventListener('afterprint', cleanup);
            if (window.print) window.print();
            else cleanup();
            setTimeout(cleanup, 1200);
        },

        openGradeReportPreview: async function (studentId) {
            var sid = text(studentId || _selectedId);
            if (!sid) return;
            _selectedId = sid;
            _tab = 'grades';
            _gradeReportPreviewStudentId = sid;
            if (!_examRecordsByStudent[sid]) await loadStudentExamRecords(sid);
            await refreshStudentsView();
        },

        closeGradeReportPreview: function () {
            _gradeReportPreviewStudentId = '';
            refreshStudentsView();
        },

        setGradeReportPeriod: function (period) {
            _gradeReportPeriod = ['3', '6', '12', 'all'].indexOf(text(period)) !== -1 ? text(period) : '6';
            refreshStudentsView();
        },

        setGradeReportOption: function (key, checked) {
            var safeKey = text(key);
            if (Object.prototype.hasOwnProperty.call(_gradeReportIncludes, safeKey)) {
                _gradeReportIncludes[safeKey] = !!checked;
                if (!selectedGradeReportCategories().length) _gradeReportIncludes.grammar = true;
            }
            refreshStudentsView();
        },

        setGradeReportNote: function (value) {
            _gradeReportNote = text(value);
        },

        printGradeReport: function () {
            var sid = text(_gradeReportPreviewStudentId || _selectedId);
            if (!sid) return;
            _gradeReportPreviewStudentId = sid;
            document.body.classList.add('eie-printing-grade-report');
            var cleanup = function () {
                document.body.classList.remove('eie-printing-grade-report');
                window.removeEventListener('afterprint', cleanup);
            };
            window.addEventListener('afterprint', cleanup);
            if (window.print) window.print();
            else cleanup();
            setTimeout(cleanup, 1200);
        },

        openDetail: async function (studentId, returnCtx, tab) {
            setReturnCtx(returnCtx);
            var previousId = _selectedId;
            _selectedId = text(studentId);
            var sid = _selectedId;
            _mode = 'detail';
            _tab = text(tab || (returnCtx && returnCtx.tab)) || _tab || 'basic';
            _notice = '';
            if (previousId !== _selectedId) {
                _consultationMode = 'list';
                _editingConsultationId = '';
                _consultationDraft = null;
                _pinnedConsultationFormStudent = '';
            }
            if (!selectedStudent() && _selectedId) {
                await loadFoundation(true);
                if (!selectedStudent()) _query = _selectedId;
            }
            if (_selectedId && _tab === 'contacts') await loadStudentContacts(_selectedId);
            if (_selectedId && _tab === 'consultation') await loadStudentConsultations(_selectedId);
            if (_selectedId && _tab === 'attendance') await loadStudentAttendance(_selectedId);
            if (_selectedId && _tab === 'grades') await loadStudentExamRecords(_selectedId);
            var opened = refreshStudentsView();
            if (sid && _tab !== 'consultation') {
                loadStudentConsultations(sid).then(function () {
                    if (_selectedId === sid && _mode === 'detail') refreshStudentsView();
                });
            }
            return opened;
        },

        closeDetail: function () {
            _selectedId = '';
            _mode = 'detail';
            refreshStudentsView();
        },

        startCreate: function () {
            _selectedId = '';
            _mode = 'create';
            _notice = '';
            EieRouter.open('students');
        },

        cancelCreate: function () {
            _mode = 'detail';
            EieRouter.open('students');
        },

        submitCreate: async function () {
            if (_saving) return;
            var payload = formPayload('create');
            if (!payload.display_name) return showFormError('학생명은 필수입니다.');
            _saving = true;
            try {
                var result = await EieApi.createStudent(payload);
                await afterWrite(result, result && (result.id || result.student_id));
            } catch (err) {
                showFormError(err && err.message ? err.message : '학생 등록에 실패했습니다.');
            } finally {
                _saving = false;
            }
        },

        startEdit: function (studentId) {
            if (studentId) _selectedId = text(studentId);
            _mode = 'edit';
            _notice = '';
            refreshStudentsView();
        },

        cancelEdit: function () {
            _mode = 'detail';
            refreshStudentsView();
        },

        setEditStatus: function (status) {
            var el = document.getElementById('edit-status');
            if (el) el.value = text(status) || 'active';
        },

        submitEdit: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            var payload = formPayload('edit');
            if (!payload.display_name) return showFormError('학생명은 필수입니다.');
            _saving = true;
            try {
                var result = await EieApi.updateStudent(sid, payload);
                await afterWrite(result, sid);
            } catch (err) {
                showFormError(err && err.message ? err.message : '학생 수정에 실패했습니다.');
            } finally {
                _saving = false;
            }
        },

        updateStatus: async function (studentId, status) {
            if (_saving) return;
            var sid = text(studentId);
            _saving = true;
            try {
                var result = await EieApi.updateStudentStatus(sid, status);
                await afterWrite(result, sid);
            } catch (err) {
                _error = err && err.message ? err.message : '상태 변경에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        archiveStudent: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId);
            if (!window.confirm('이 학생을 숨김 처리할까요? 실제 삭제 없이 목록에서 제외됩니다.')) return;
            _saving = true;
            try {
                var result = await EieApi.deleteStudent(sid);
                await afterWrite(result, sid);
            } catch (err) {
                _error = err && err.message ? err.message : '숨김 처리에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        createContact: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            var phone = text(window.prompt('연락처'));
            if (!sid || !phone) return;
            var label = text(window.prompt('라벨', '학부모')) || '학부모';
            _saving = true;
            try {
                var result = await EieApi.createStudentContact(sid, { student_id: sid, phone: phone, contact_label: label });
                if (EieState.mergeStudentContacts) EieState.mergeStudentContacts(sid, result.contacts || (result.contact ? [result.contact] : (result.data ? [result.data] : [])));
                _notice = '연락처를 저장했습니다.';
                _tab = 'contacts';
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '연락처 저장에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        editContact: async function (contactId) {
            if (_saving) return;
            var id = text(contactId);
            var current = asArray(db().student_contacts).find(function (contact) { return String(contact.id || '') === String(id); });
            if (!current) return;
            var phone = text(window.prompt('연락처', current.phone || current.phone_raw || current.normalized_phone || ''));
            if (!phone) return;
            var label = text(window.prompt('라벨', current.contact_label || current.label || current.relation || '')) || current.contact_label || '';
            _saving = true;
            try {
                var result = await EieApi.updateStudentContact(id, { phone: phone, contact_label: label, memo: current.memo || '' });
                var sid = text(current.student_id || _selectedId);
                if (EieState.mergeStudentContacts) EieState.mergeStudentContacts(sid, result.contacts || (result.contact ? [result.contact] : (result.data ? [result.data] : [])));
                _notice = '연락처를 저장했습니다.';
                _tab = 'contacts';
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '연락처 저장에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        createConsultation: async function (studentId, draft) {
            var sid = text(studentId || _selectedId);
            if (!sid || _saving) return;
            _selectedId = sid;
            _tab = 'consultation';
            _consultationMode = 'create';
            _editingConsultationId = '';
            _consultationDraft = draft && typeof draft === 'object' ? Object.assign({ student_id: sid }, draft) : null;
            _notice = '';
            _error = '';
            await EieRouter.open('students');
        },

        editConsultation: async function (consultationId) {
            var id = text(consultationId);
            var current = asArray(db().consultations).find(function (row) { return String(row.id || '') === String(id); });
            if (!current) return;
            if (_saving) return;
            _selectedId = text(current.student_id || _selectedId);
            _tab = 'consultation';
            _consultationMode = 'edit';
            _editingConsultationId = id;
            _consultationDraft = null;
            _notice = '';
            _error = '';
            await EieRouter.open('students');
        },

        deleteConsultation: async function (consultationId) {
            var id = text(consultationId);
            if (!id || _saving) return;
            var current = asArray(db().consultations).find(function (row) { return String(row.id || '') === String(id); });
            var sid = text((current && current.student_id) || _selectedId);
            if (!sid) return;
            if (!window.EieApi || typeof EieApi.deleteConsultation !== 'function') {
                _error = '상담 삭제 API를 사용할 수 없습니다.';
                await EieRouter.open('students');
                return;
            }
            if (window.confirm && !window.confirm('상담 기록을 삭제하시겠습니까?')) return;
            _saving = true;
            _notice = '';
            _error = '';
            try {
                var result = await EieApi.deleteConsultation(id);
                if (result && Array.isArray(result.consultations) && EieState.mergeStudentConsultations) {
                    EieState.mergeStudentConsultations(sid, result.consultations);
                } else {
                    await loadStudentConsultations(sid);
                }
                if (_editingConsultationId === id) {
                    _consultationMode = 'list';
                    _editingConsultationId = '';
                    _consultationDraft = null;
                }
                if (text(_pinnedConsultationByStudent[sid]) === id) delete _pinnedConsultationByStudent[sid];
                _selectedId = sid;
                _tab = 'consultation';
                _notice = '상담 기록이 삭제되었습니다.';
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '상담 기록 삭제에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        cancelConsultation: async function () {
            _consultationMode = 'list';
            _editingConsultationId = '';
            _consultationDraft = null;
            await EieRouter.open('students');
        },

        saveConsultation: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            var dateEl = document.getElementById('consultation-date');
            var typeEl = document.getElementById('consultation-type');
            var contentEl = document.getElementById('consultation-content');
            var nextActionEl = document.getElementById('consultation-next-action');
            var payload = {
                student_id: sid,
                date: text(dateEl && dateEl.value) || todayIso(),
                type: text(typeEl && typeEl.value) || '상담',
                content: text(contentEl && contentEl.value),
                next_action: text(nextActionEl && nextActionEl.value)
            };
            if (!sid) return;
            if (!payload.content) {
                _error = '상담 내용을 입력하세요';
                await EieRouter.open('students');
                return;
            }
            _saving = true;
            try {
                var result = _consultationMode === 'edit' && _editingConsultationId
                    ? await EieApi.updateConsultation(_editingConsultationId, payload)
                    : await EieApi.createConsultation(payload);
                if (EieState.mergeStudentConsultations) EieState.mergeStudentConsultations(sid, result.consultations || (result.consultation ? [result.consultation] : (result.data ? [result.data] : [])));
                _notice = '상담을 저장했습니다.';
                _tab = 'consultation';
                _consultationMode = 'list';
                _editingConsultationId = '';
                _consultationDraft = null;
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '상담 저장에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        selectPinnedConsultation: function (studentId, consultationId) {
            var sid = text(studentId || _selectedId);
            if (!sid) return;
            _pinnedConsultationFormStudent = '';
            _pinnedConsultationByStudent[sid] = text(consultationId);
            var student = asArray(db().students).find(function (row) {
                return rowId(row) === sid;
            }) || selectedStudent();
            if (!student) return;
            var selected = selectedPinnedConsultation(student, consultationId);
            var target = document.getElementById('eie-pinned-consultation-body-' + sid);
            if (target) target.innerHTML = renderPinnedConsultationPreview(student, selected);
            var wrap = Array.prototype.slice.call(document.querySelectorAll('[data-eie-pinned-consultation-student]')).find(function (node) {
                return text(node.getAttribute('data-eie-pinned-consultation-student')) === sid;
            });
            if (wrap) {
                Array.prototype.slice.call(wrap.querySelectorAll('.eie-apms-consult-date-button')).forEach(function (button) {
                    button.classList.toggle('is-active', text(button.getAttribute('data-eie-consultation-id')) === text(consultationId));
                });
            }
        },

        startPinnedConsultation: function (studentId) {
            var sid = text(studentId || _selectedId);
            if (!sid) return;
            _pinnedConsultationFormStudent = sid;
            EieRouter.open('students');
        },

        cancelPinnedConsultation: function (studentId) {
            var sid = text(studentId || _selectedId);
            if (_pinnedConsultationFormStudent === sid) _pinnedConsultationFormStudent = '';
            EieRouter.open('students');
        },

        savePinnedConsultation: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            if (!sid) return;
            var dateEl = document.getElementById('pinned-consultation-date');
            var typeEl = document.getElementById('pinned-consultation-type');
            var contentEl = document.getElementById('pinned-consultation-content');
            var nextEl = document.getElementById('pinned-consultation-next-action');
            var payload = {
                student_id: sid,
                date: text(dateEl && dateEl.value) || todayIso(),
                type: text(typeEl && typeEl.value) || '학습',
                content: text(contentEl && contentEl.value),
                next_action: text(nextEl && nextEl.value)
            };
            if (!payload.content) {
                _error = '상담 내용을 입력하세요.';
                EieRouter.open('students');
                return;
            }
            _saving = true;
            try {
                var result = await EieApi.createConsultation(payload);
                EieState.mergeStudentConsultations(sid, result.consultations || (result.consultation ? [result.consultation] : (result.data ? [result.data] : [])));
                _pinnedConsultationFormStudent = '';
                _notice = '상담 기록을 저장했습니다.';
                _error = '';
                EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '상담 저장에 실패했습니다.';
                EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        setTab: async function (tab) {
            _tab = text(tab) || 'basic';
            if (_tab !== 'consultation') {
                _consultationMode = 'list';
                _editingConsultationId = '';
            }
            if (_selectedId && _tab === 'contacts') await loadStudentContacts(_selectedId);
            if (_selectedId && _tab === 'consultation') await loadStudentConsultations(_selectedId);
            if (_selectedId && _tab === 'attendance') await loadStudentAttendance(_selectedId);
            if (_selectedId && _tab === 'grades') await loadStudentExamRecords(_selectedId);
            await refreshStudentsView();
        },

        setExamCategory: function (category) {
            if (EXAM_CATEGORIES.some(function (item) { return item.key === category; })) {
                _examCategory = category;
            }
            _tab = 'grades';
            refreshStudentsView();
        },

        openGradeLedger: function (studentId, classId) {
            var sid = text(studentId || _selectedId);
            var student = selectedStudent() || students().find(function (row) { return rowId(row) === sid; }) || {};
            var targetClassId = text(classId) || text((assignmentsOf(student)[0] || {}).cellId || (assignmentsOf(student)[0] || {}).cell_id || '');
            if (window.EieGradeLedgerView && typeof EieGradeLedgerView.openStudent === 'function') {
                EieGradeLedgerView.openStudent({
                    studentId: sid,
                    studentName: displayName(student),
                    classId: targetClassId,
                    mode: 'academy'
                });
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('grades');
        },

        saveExamRecord: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            var category = _examCategory || 'month_end';
            var prefix = 'student-exam-' + category;
            var dateEl = document.getElementById(prefix + '-date');
            var titleEl = document.getElementById(prefix + '-title');
            var scoreEl = document.getElementById(prefix + '-score');
            var maxScoreEl = document.getElementById(prefix + '-max-score');
            var levelEl = document.getElementById(prefix + '-level');
            var memoEl = document.getElementById(prefix + '-memo');
            var payload = {
                student_id: sid,
                category: category,
                exam_date: text(dateEl && dateEl.value) || todayIso(),
                title: text(titleEl && titleEl.value),
                score: text(scoreEl && scoreEl.value),
                max_score: text(maxScoreEl && maxScoreEl.value),
                level: text(levelEl && levelEl.value),
                memo: text(memoEl && memoEl.value),
                payload_json: null
            };
            if (!sid) return;
            _saving = true;
            try {
                var result = await EieApi.createExamRecord(payload);
                _examRecordsByStudent[sid] = result.exam_records || (result.exam_record ? [result.exam_record].concat(_examRecordsByStudent[sid] || []) : result.data || []);
                _notice = '성적표 기록을 저장했습니다.';
                _error = '';
                _tab = 'grades';
                _saving = false;
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '성적표 저장에 실패했습니다.';
                _tab = 'grades';
                _saving = false;
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        showPreparing: function (label) {
            if (typeof window !== 'undefined' && window.alert) window.alert(text(label || '기능') + ' 기능은 준비중입니다.');
        },

        saveAttendance: async function (studentId, status) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            if (!sid) return;
            _saving = true;
            try {
                var result = await EieApi.saveAttendanceRecord({
                    student_id: sid,
                    date: new Date().toLocaleDateString('sv-SE'),
                    status: status
                });
                var rows = result.attendance_records || result.attendance || (result.attendance_record ? [result.attendance_record] : (result.data ? [result.data] : []));
                if (window.EieState && typeof EieState.mergeStudentAttendance === 'function') {
                    EieState.mergeStudentAttendance(sid, rows);
                }
                _notice = '출석을 저장했습니다.';
                _tab = 'attendance';
                await EieRouter.open('students');
            } catch (err) {
                _error = err && err.message ? err.message : '출석 저장에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        openClassroom: function (cellId) {
            if (cellId && window.EieClassroomView && typeof EieClassroomView.openDetail === 'function') {
                EieClassroomView.openDetail(cellId);
                return;
            }
            EieRouter.open('classroom');
        },

        openTimetable: function () {
            EieRouter.open('timetable');
        },

        returnToTimetable: function () {
            if (_returnCtx && _returnCtx.route === 'timetable') {
                if (window.EieTimetableView && typeof EieTimetableView.openWithContext === 'function') {
                    EieTimetableView.openWithContext(_returnCtx);
                    return;
                }
                EieRouter.open('timetable');
                return;
            }
            EieRouter.open('timetable');
        },

        refresh: function (force) {
            return refreshView(force !== false);
        },

        copyPhone: async function (phone) {
            var value = text(phone);
            if (!value) return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(value);
                if (window.toast) window.toast('연락처를 복사했습니다.', 'success');
            } catch (err) {
                if (window.toast) window.toast(value, 'info');
            }
        }
    };
})();
