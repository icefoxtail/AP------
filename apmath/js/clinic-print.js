/**
 * AP Math OS [clinic-print.js]
 * 오답 클리닉 출력 센터 1차 구현
 */

const AP_CLINIC_PRINT_STORAGE_KEY = 'AP_CLINIC_PRINT_PAYLOAD';
const AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE = '2026-06-01';
const AP_CLINIC_EXAM_PERIODS = [
    ['all', '전체'], ['1mid', '1학기 중간'], ['1final', '1학기 기말'],
    ['2mid', '2학기 중간'], ['2final', '2학기 기말'], ['other', '기타 시험']
];
const clinicPrintExamPeriodFilters = new Map();
const clinicPrintExamYearFilters = new Map();
const clinicPrintGradeData = new Map();

function clinicPrintGetGradeWindow(classId) {
    const loaded = clinicPrintGradeData.get(String(classId));
    if (loaded?.status === 'ready') return { from: loaded.from, to: loaded.to };
    const to = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const date = new Date(`${to}T00:00:00Z`);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - 1);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
    return { from: date.toISOString().slice(0, 10), to };
}

function clinicPrintGradeDataUnavailable(classId) {
    const status = clinicPrintGradeData.get(String(classId))?.status;
    return status === 'loading' || status === 'error';
}

function clinicPrintIsInGradeWindow(row, classId) {
    const { from, to } = clinicPrintGetGradeWindow(classId);
    const date = String(row.exam_date || row.created_at || row.updated_at || '').slice(0, 10);
    return !!date && date >= from && date <= to;
}

function clinicPrintGetGradeDataMessage(classId) {
    const data = clinicPrintGradeData.get(String(classId));
    if (data?.status === 'loading') return '학년 전체 기록을 불러오는 중입니다.';
    if (data?.status === 'error') return '학년 전체 기록을 불러오지 못했습니다. 다시 불러오기를 눌러 주세요.';
    const { from, to } = clinicPrintGetGradeWindow(classId);
    return `모든 선생님 반 · 최근 1개월 (${from} ~ ${to})`;
}

async function clinicPrintRetryGradeData(classId) {
    const pending = clinicPrintRefreshGradeClinicData(classId);
    clinicPrintUpdateExamList(classId);
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
    await pending;
    clinicPrintUpdateExamList(classId);
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
}

function clinicPrintEscapeHtml(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function clinicPrintEscapeAttr(value) {
    return clinicPrintEscapeHtml(value).replace(/`/g, '&#96;');
}

function clinicPrintEscapeJsString(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\x27')
        .replace(/"/g, '\\x22')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E')
        .replace(/&/g, '\\x26')
        .replace(/`/g, '\\x60');
}

function clinicPrintClampText(value, maxLength) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function clinicPrintGetTypeLabel(typeMode) {
    if (typeMode === 'unit') return '단원별 오답';
    if (typeMode === 'mostWrong') return '최다오답';
    return '최다빈출 오답';
}

function clinicPrintGetHeaderDefaultTitle(classId) {
    const cls = clinicPrintGetClass(classId);
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const className = cls?.name || '반';
    const gradeName = String(cls?.grade || '').trim() || '학년';
    if (mode === 'class') return `${className} 반별 공통 오답지`;
    if (mode === 'grade') return `${gradeName} 공통 오답지`;
    if (mode === 'type') {
        const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
        const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
        return `${scope === 'grade' ? gradeName : className} ${clinicPrintGetTypeLabel(typeMode)}`;
    }
    return `${className} 학생별 오답 클리닉`;
}

function clinicPrintSetHeaderTitleDirty(dirty = true) {
    const input = document.getElementById('clinic-print-header-title-dirty');
    if (input) input.value = dirty ? '1' : '0';
}

function clinicPrintRefreshHeaderDefault(classId) {
    const titleInput = document.getElementById('clinic-print-header-title');
    const dirty = document.getElementById('clinic-print-header-title-dirty')?.value === '1';
    if (titleInput && !dirty) titleInput.value = clinicPrintGetHeaderDefaultTitle(classId);
}

function clinicPrintGetHeaderOptions(classId) {
    const titleDefault = clinicPrintGetHeaderDefaultTitle(classId);
    const title = clinicPrintClampText(document.getElementById('clinic-print-header-title')?.value || titleDefault, 80) || titleDefault;
    return {
        title,
        metaRight: '',
        subtitle: clinicPrintClampText(document.getElementById('clinic-print-header-subtitle')?.value || '', 120),
        showNameLine: document.getElementById('clinic-print-header-name')?.checked !== false,
        showScoreLine: document.getElementById('clinic-print-header-score')?.checked !== false,
        showDate: document.getElementById('clinic-print-header-date')?.checked === true,
        applyToSolution: document.getElementById('clinic-print-header-sol')?.checked !== false,
        applyToAnswer: document.getElementById('clinic-print-header-ans')?.checked !== false
    };
}

function clinicPrintNormalizeArchiveFile(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    if (/^MIXED:/i.test(raw)) return raw;
    if (/^https?:\/\//i.test(raw)) return raw;
    let path = raw.replace(/^archive\//, '').replace(/^\.\//, '').replace(/^\//, '');
    if (!path.endsWith('.js')) path += '.js';
    if (!/^(exams|assets|data)\//.test(path)) path = `exams/${path}`;
    return path;
}

function clinicPrintGetArchiveDisplayTitle(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    const compact = raw.replace(/^MIXED:/i, '');
    const leaf = compact.split(/[\\/]/).pop() || compact;
    return leaf
        .replace(/\.js(?:\?.*)?$/i, '')
        .replace(/^exams\//i, '')
        .replace(/^archive\//i, '')
        .trim();
}

function clinicPrintGetExamGroupDisplayTitle(group = {}) {
    const archiveTitle = clinicPrintGetArchiveDisplayTitle(group.archiveFile || group.archive_file || '');
    if (archiveTitle) return archiveTitle;
    return `${group.examDate || group.exam_date || ''} ${group.examTitle || group.exam_title || '시험명 없음'}`.trim();
}

function clinicPrintMakeExamKey(examDate, examTitle, archiveFile, questionCount) {
    return [
        String(examDate || ''),
        String(examTitle || ''),
        clinicPrintNormalizeArchiveFile(archiveFile || ''),
        String(questionCount || 0)
    ].join('|');
}

function clinicPrintParseExamKey(key) {
    const parts = String(key || '').split('|');
    return {
        examDate: parts[0] || '',
        examTitle: parts[1] || '',
        archiveFile: parts[2] || '',
        questionCount: Number(parts[3] || 0)
    };
}

function clinicPrintGetClass(classId) {
    return (state.db.classes || []).find(c => String(c.id) === String(classId)) || null;
}

function clinicPrintGetActiveClasses() {
    return (state.db.classes || [])
        .filter(cls => Number(cls.is_active ?? 1) !== 0)
        .sort((a, b) =>
            String(a.grade || '').localeCompare(String(b.grade || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
}

function clinicPrintGetClassStudents(classId) {
    if (typeof apmsGetStudentsForClass === 'function') {
        return apmsGetStudentsForClass(classId)
            .filter(student => String(student.status || '재원') === '재원')
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }

    const ids = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));

    return (state.db.students || [])
        .filter(student => ids.has(String(student.id)) && String(student.status || '재원') === '재원')
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function clinicPrintGetClassGrade(classId) {
    return String(clinicPrintGetClass(classId)?.grade || '').trim();
}

function clinicPrintGetGradeClasses(classId) {
    if (clinicPrintGradeDataUnavailable(classId)) return [];
    const grade = clinicPrintGetClassGrade(classId);
    if (!grade) return [];
    const classes = clinicPrintGradeData.get(String(classId))?.classes || clinicPrintGetActiveClasses();
    return classes.filter(cls => Number(cls.is_active ?? 1) !== 0 &&
        String(cls.grade || '').replace(/\s+/g, '') === grade.replace(/\s+/g, ''));
}

function clinicPrintGetGradeStudents(classId) {
    const classes = clinicPrintGetGradeClasses(classId);
    const byStudent = new Map();
    const loaded = clinicPrintGradeData.get(String(classId));
    const loadedStudents = loaded?.status === 'ready'
        ? new Map(loaded.students.map(student => [String(student.id), student])) : null;

    classes.forEach(cls => {
        const students = loadedStudents
            ? loaded.class_students.filter(row => String(row.class_id) === String(cls.id))
                .map(row => loadedStudents.get(String(row.student_id))).filter(Boolean)
            : clinicPrintGetClassStudents(cls.id);
        students.forEach(student => {
            if (!['재원', 'active'].includes(String(student.status || '재원'))) return;
            const studentId = String(student.id || '');
            if (!studentId || byStudent.has(studentId)) return;
            byStudent.set(studentId, {
                ...student,
                classId: cls.id,
                className: cls.name || '',
                teacherName: cls.teacher_name || ''
            });
        });
    });

    return [...byStudent.values()]
        .sort((a, b) =>
            String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
}

function clinicPrintGetSessionArchiveFile(session) {
    return clinicPrintNormalizeArchiveFile(session?.archive_file || '');
}

function clinicPrintIsOnOrAfterFromDate(value) {
    const date = String(value || '').slice(0, 10);
    if (!date) return true;
    return date >= AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE;
}

function clinicPrintMergeClassAssignments(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    if (!state.db) state.db = {};
    const current = Array.isArray(state.db.class_exam_assignments) ? state.db.class_exam_assignments : [];
    const byKey = new Map(current.map(row => [
        String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`),
        row
    ]));
    rows.forEach(row => {
        const key = String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`);
        byKey.set(key, row);
    });
    state.db.class_exam_assignments = [...byKey.values()];
}

function clinicPrintReplaceClassAssignments(classId, rows) {
    if (!state.db) state.db = {};
    const incoming = Array.isArray(rows) ? rows : [];
    const keep = (state.db.class_exam_assignments || state.db.exam_assignments || [])
        .filter(row => String(row.class_id || '') !== String(classId || ''));
    state.db.class_exam_assignments = [...keep, ...incoming];
}

function clinicPrintMergeClassAssignmentExclusions(rows) {
    if (!Array.isArray(rows)) return;
    if (!state.db) state.db = {};
    const current = Array.isArray(state.db.class_exam_assignment_exclusions) ? state.db.class_exam_assignment_exclusions : [];
    const byKey = new Map(current.map(row => [
        `${row.assignment_id || ''}|${row.student_id || ''}`,
        row
    ]));
    rows.forEach(row => {
        const assignmentId = String(row.assignment_id || '').trim();
        const studentId = String(row.student_id || '').trim();
        if (!assignmentId || !studentId) return;
        byKey.set(`${assignmentId}|${studentId}`, row);
    });
    state.db.class_exam_assignment_exclusions = [...byKey.values()];
}

function clinicPrintReplaceClassAssignmentExclusions(rows) {
    if (!Array.isArray(rows)) return;
    if (!state.db) state.db = {};
    const assignmentIds = new Set(rows.map(row => String(row.assignment_id || '').trim()).filter(Boolean));
    const keep = (state.db.class_exam_assignment_exclusions || [])
        .filter(row => !assignmentIds.has(String(row.assignment_id || '').trim()));
    state.db.class_exam_assignment_exclusions = [...keep, ...rows];
}

function clinicPrintMergeDbRows(tableName, rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    if (!state.db) state.db = {};
    const getKey = row => {
        if (row?.id) return String(row.id);
        if (tableName === 'class_students') return `${row.class_id || ''}|${row.student_id || ''}`;
        if (tableName === 'wrong_answers') return `${row.session_id || ''}|${row.student_id || ''}|${row.question_id || ''}`;
        if (tableName === 'exam_blueprints') return `${row.archive_file || ''}|${row.question_no || ''}`;
        return `${row.session_id || ''}|${row.student_id || ''}|${row.question_id || ''}`;
    };
    const current = Array.isArray(state.db[tableName]) ? state.db[tableName] : [];
    const byKey = new Map(current.map(row => [
        getKey(row),
        row
    ]));
    rows.forEach(row => {
        const key = getKey(row);
        if (!key.replace(/\|/g, '').trim()) return;
        byKey.set(key, row);
    });
    state.db[tableName] = [...byKey.values()];
}

async function clinicPrintRefreshClassAssignments(classId) {
    if (!classId || typeof api === 'undefined' || typeof api.get !== 'function') return false;
    try {
        const res = await api.get(`class-exam-assignments?class=${encodeURIComponent(classId)}`);
        const assignments = res.assignments || res.items || [];
        clinicPrintReplaceClassAssignments(classId, assignments);
        clinicPrintReplaceClassAssignmentExclusions(res.exclusions || []);
        return true;
    } catch (e) {
        console.warn('[clinic-print] class exam assignment refresh failed:', e);
        return false;
    }
}

async function clinicPrintRefreshGradeClinicData(classId) {
    const grade = clinicPrintGetClassGrade(classId);
    const key = String(classId);
    if (!grade || typeof api === 'undefined' || typeof api.get !== 'function') {
        clinicPrintGradeData.set(key, { status: 'error' });
        return false;
    }
    clinicPrintGradeData.delete(key);
    const range = clinicPrintGetGradeWindow(classId);
    clinicPrintGradeData.set(key, { status: 'loading', ...range });
    try {
        const params = new URLSearchParams({
            class: String(classId || ''),
            grade,
            ...range
        });
        const res = await api.get(`exam-sessions/by-grade?${params.toString()}`);
        const tables = ['classes', 'class_students', 'students', 'assignments', 'sessions', 'wrong_answers', 'blueprints', 'exclusions'];
        if (!res || res.success !== true || res.error || !tables.every(name => Array.isArray(res[name]))) {
            throw new Error(res?.error || res?.message || '학년 전체 조회 응답을 확인할 수 없습니다.');
        }
        clinicPrintMergeDbRows('classes', res.classes || []);
        clinicPrintMergeDbRows('class_students', res.class_students || []);
        clinicPrintMergeDbRows('students', res.students || []);
        clinicPrintMergeClassAssignments(res.assignments || []);
        clinicPrintMergeDbRows('exam_sessions', res.sessions || []);
        clinicPrintMergeDbRows('wrong_answers', res.wrong_answers || []);
        clinicPrintMergeDbRows('exam_blueprints', res.blueprints || []);
        clinicPrintMergeClassAssignmentExclusions(res.exclusions || []);
        clinicPrintGradeData.set(key, { ...res, ...range, status: 'ready' });
        return true;
    } catch (e) {
        clinicPrintGradeData.set(key, { ...range, status: 'error', error: String(e?.message || e) });
        console.warn('[clinic-print] grade clinic data refresh failed:', e);
        return false;
    }
}

async function clinicPrintDeleteExamGroup(classId, examKey) {
    const groups = clinicPrintGetClassExamGroups(classId);
    const group = groups.find(row => String(row.examKey || '') === String(examKey || ''));
    if (!group) {
        toast('삭제할 시험을 찾을 수 없습니다.', 'warn');
        return;
    }

    const label = clinicPrintGetExamGroupDisplayTitle(group);
    const submittedCount = Number(group.sessions?.length || 0);
    const detail = submittedCount
        ? `제출 ${submittedCount}명, 오답 ${Number(group.wrongCount || 0)}문항 기록도 함께 삭제됩니다.`
        : '제출 기록이 없어서 출제 기록만 삭제됩니다.';
    if (!confirm(`${label}\n이 시험을 삭제할까요?\n${detail}`)) return;

    try {
        const archiveQuery = group.archiveFile ? `&archive=${encodeURIComponent(group.archiveFile)}` : '';
        const assignmentQuery = group.assignment?.id ? `&assignment=${encodeURIComponent(group.assignment.id)}` : '';
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(group.examTitle || '')}&date=${encodeURIComponent(group.examDate || '')}${archiveQuery}${assignmentQuery}`;
        const res = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        if (res.status === 401 && typeof handleUnauthorizedResponse === 'function') {
            handleUnauthorizedResponse();
            return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            toast(data.message || data.error || '시험 삭제에 실패했습니다.', 'warn');
            return;
        }
        toast('시험 기록을 삭제했습니다.', 'info');
        if (typeof refreshDataOnly === 'function') await refreshDataOnly();
        await openClinicPrintCenter(classId);
    } catch (e) {
        console.warn('[clinic-print] delete exam failed:', e);
        toast('시험 삭제 중 오류가 발생했습니다.', 'error');
    }
}

function clinicPrintIsAssignmentFullyExcluded(classId, assignment, gradeData = null) {
    const assignmentId = String(assignment?.id || '').trim();
    if (!assignmentId) return false;
    const activeIds = gradeData?.status === 'ready' ? new Set(gradeData.students.map(row => String(row.id))) : null;
    const studentIds = activeIds
        ? gradeData.class_students.filter(row => String(row.class_id) === String(classId) && activeIds.has(String(row.student_id))).map(row => String(row.student_id || '')).filter(Boolean)
        : clinicPrintGetClassStudents(classId).map(student => String(student.id || '')).filter(Boolean);
    if (!studentIds.length) return false;
    const excludedIds = new Set((gradeData?.status === 'ready' ? gradeData.exclusions : (state.db.class_exam_assignment_exclusions || []))
        .filter(row => String(row.assignment_id || '') === assignmentId)
        .map(row => String(row.student_id || ''))
        .filter(Boolean));
    return studentIds.every(studentId => excludedIds.has(studentId));
}

function clinicPrintGetClassExamAssignments(classId) {
    return (state.db.class_exam_assignments || state.db.exam_assignments || [])
        .filter(row => String(row.class_id || '') === String(classId || ''))
        .filter(row => !clinicPrintIsAssignmentFullyExcluded(classId, row))
        .filter(row => clinicPrintIsOnOrAfterFromDate(row.exam_date || row.created_at || row.updated_at));
}

function clinicPrintGetGradeExamAssignments(classId) {
    const classIds = new Set(clinicPrintGetGradeClasses(classId).map(cls => String(cls.id)));
    const loaded = clinicPrintGradeData.get(String(classId));
    return (loaded?.status === 'ready' ? loaded.assignments : (state.db.class_exam_assignments || state.db.exam_assignments || []))
        .filter(row => classIds.has(String(row.class_id || '')))
        .filter(row => !clinicPrintIsAssignmentFullyExcluded(row.class_id || '', row, loaded))
        .filter(row => clinicPrintIsInGradeWindow(row, classId));
}

function clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount) {
    const normalizedArchive = clinicPrintNormalizeArchiveFile(archiveFile || '');
    const exactKey = clinicPrintMakeExamKey(examDate, examTitle, normalizedArchive, questionCount);
    if (grouped[exactKey]) return grouped[exactKey];

    if (normalizedArchive) {
        const qCount = Number(questionCount || 0);
        const archiveMatch = Object.values(grouped).find(group => {
            const groupCount = Number(group.questionCount || 0);
            const countsCompatible = !qCount || !groupCount || qCount === groupCount;
            return String(group.examDate || '') === String(examDate || '') &&
                clinicPrintNormalizeArchiveFile(group.archiveFile || '') === normalizedArchive &&
                countsCompatible;
        });
        if (archiveMatch) return archiveMatch;
    }

    return Object.values(grouped).find(group =>
        String(group.examDate || '') === String(examDate || '') &&
        String(group.examTitle || '') === String(examTitle || '') &&
        clinicPrintNormalizeArchiveFile(group.archiveFile || '') === normalizedArchive
    ) || null;
}

function clinicPrintEnsureExamGroup(grouped, source, options = {}) {
    const archiveFile = clinicPrintNormalizeArchiveFile(source.archiveFile || source.archive_file || '');
    const questionCount = Number(source.questionCount || source.question_count || 0);
    const examDate = source.examDate || source.exam_date || '';
    const examTitle = source.examTitle || source.exam_title || '시험명 없음';
    const matched = options.ignoreDate && archiveFile
        ? Object.values(grouped).find(group => group.archiveFile === archiveFile &&
            (!group.questionCount || !questionCount || group.questionCount === questionCount))
        : clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount);
    if (matched) {
        if (options.ignoreDate && String(examDate) > String(matched.examDate)) matched.examDate = examDate;
        if (!matched.archiveFile && archiveFile) matched.archiveFile = archiveFile;
        if (!Number(matched.questionCount || 0) && questionCount) matched.questionCount = questionCount;
        if (source.assignment) {
            matched.assignment = matched.assignment || source.assignment;
            matched.assignments = matched.assignments || [];
            if (!matched.assignments.some(row => String(row.id || '') === String(source.assignment.id || ''))) {
                matched.assignments.push(source.assignment);
            }
        }
        const sourceClassId = String(source.classId || source.assignment?.class_id || source.session?.class_id || '').trim();
        if (sourceClassId && !matched.sourceClassIds.includes(sourceClassId)) matched.sourceClassIds.push(sourceClassId);
        matched.printable = !!matched.archiveFile;
        return matched;
    }

    const key = clinicPrintMakeExamKey(options.ignoreDate ? '' : examDate,
        options.ignoreDate && archiveFile ? '' : examTitle, archiveFile, questionCount);
    grouped[key] = {
        examKey: key,
        examTitle,
        examDate,
        archiveFile,
        questionCount,
        sessions: [],
        wrongCount: 0,
        printable: !!archiveFile,
        assignment: source.assignment || null,
        assignments: source.assignment ? [source.assignment] : [],
        sourceClassIds: [source.classId || source.assignment?.class_id || source.session?.class_id || ''].map(String).filter(Boolean)
    };
    return grouped[key];
}

function clinicPrintGetClassExamGroups(classId, scope = 'class') {
    const isGradeScope = scope === 'grade';
    const studentIds = new Set((isGradeScope ? clinicPrintGetGradeStudents(classId) : clinicPrintGetClassStudents(classId)).map(student => String(student.id)));
    const grouped = {};

    (isGradeScope ? clinicPrintGetGradeExamAssignments(classId) : clinicPrintGetClassExamAssignments(classId)).forEach(assignment => {
        clinicPrintEnsureExamGroup(grouped, {
            examTitle: assignment.exam_title || '',
            examDate: assignment.exam_date || '',
            archiveFile: assignment.archive_file || '',
            questionCount: Number(assignment.question_count || 0),
            assignment,
            classId: assignment.class_id || ''
        }, { ignoreDate: isGradeScope });
    });

    const loaded = clinicPrintGradeData.get(String(classId));
    const sessions = isGradeScope && loaded?.status === 'ready' ? loaded.sessions : (state.db.exam_sessions || []);
    sessions.forEach(session => {
        if (!studentIds.has(String(session.student_id))) return;
        if (isGradeScope ? !clinicPrintIsInGradeWindow(session, classId)
            : !clinicPrintIsOnOrAfterFromDate(session.exam_date || session.created_at || session.updated_at)) return;

        const archiveFile = clinicPrintGetSessionArchiveFile(session);
        const questionCount = Number(session.question_count || 0);
        const group = clinicPrintEnsureExamGroup(grouped, {
            examTitle: session.exam_title || '',
            examDate: session.exam_date || '',
            archiveFile,
            questionCount,
            session,
            classId: session.class_id || ''
        }, { ignoreDate: isGradeScope });

        group.sessions.push(session);
        group.wrongCount += clinicPrintGetWrongIdsBySession(session.id, isGradeScope ? classId : null).length;
    });

    if (isGradeScope) Object.values(grouped).forEach(group => {
        group.sessions = clinicPrintDedupeLatestSessionByStudent(group.sessions);
        group.wrongCount = group.sessions.reduce((total, session) => total + clinicPrintGetWrongIdsBySession(session.id, classId).length, 0);
    });

    return Object.values(grouped)
        .filter(group => group.printable || group.sessions.length > 0)
        .sort((a, b) => String(b.examDate || '').localeCompare(String(a.examDate || '')) || String(b.examTitle || '').localeCompare(String(a.examTitle || ''), 'ko'));
}

function clinicPrintGetSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);

    const sessions = (state.db.exam_sessions || []).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        if (!group.examDate && !clinicPrintIsInGradeWindow(session, classId)) return false;
        const key = clinicPrintMakeExamKey(session.exam_date, session.exam_title, clinicPrintGetSessionArchiveFile(session), Number(session.question_count || 0));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return key === examGroupKey || (
            !!group.archiveFile &&
            (!group.examDate || String(session.exam_date || '') === group.examDate) &&
            String(clinicPrintGetSessionArchiveFile(session) || '') === String(group.archiveFile || '') &&
            countsCompatible
        );
    });
    return group.examDate ? sessions : clinicPrintDedupeLatestSessionByStudent(sessions);
}

function clinicPrintGetGradeSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetGradeStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);
    const groupArchive = clinicPrintNormalizeArchiveFile(group.archiveFile || '');

    const loaded = clinicPrintGradeData.get(String(classId));
    return (loaded?.status === 'ready' ? loaded.sessions : (state.db.exam_sessions || [])).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        if (!clinicPrintIsInGradeWindow(session, classId)) return false;
        const sessionArchive = clinicPrintNormalizeArchiveFile(clinicPrintGetSessionArchiveFile(session));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return !!groupArchive && sessionArchive === groupArchive && countsCompatible;
    });
}

function clinicPrintDedupeLatestSessionByStudent(sessions) {
    const sessionSortValue = session => String(
        session?.updated_at ||
        session?.created_at ||
        session?.submitted_at ||
        session?.completed_at ||
        session?.exam_date ||
        ''
    );
    const sorted = [...(sessions || [])].sort((a, b) =>
        sessionSortValue(b).localeCompare(sessionSortValue(a)) ||
        String(b.id || '').localeCompare(String(a.id || ''))
    );
    const byStudent = new Map();
    sorted.forEach(session => {
        const studentId = String(session.student_id || '');
        if (studentId && !byStudent.has(studentId)) byStudent.set(studentId, session);
    });
    return [...byStudent.values()];
}

function clinicPrintGetWrongIdsBySession(sessionId, gradeClassId = null) {
    const loaded = gradeClassId == null ? null : clinicPrintGradeData.get(String(gradeClassId));
    const rows = loaded?.status === 'ready'
        ? loaded.wrong_answers.filter(row => String(row.session_id) === String(sessionId))
        : typeof apmsGetWrongAnswersForSession === 'function'
        ? apmsGetWrongAnswersForSession(sessionId)
        : (state.db.wrong_answers || []).filter(row => String(row.session_id) === String(sessionId));

    return rows
        .map(row => Number(row.question_id))
        .filter(no => Number.isFinite(no) && no > 0)
        .sort((a, b) => a - b);
}

function clinicPrintFindBlueprint(session, questionNo) {
    const archiveFile = clinicPrintGetSessionArchiveFile(session);
    if (!archiveFile) return null;

    if (typeof apmsGetExamBlueprintByArchiveQuestion === 'function') {
        const direct = apmsGetExamBlueprintByArchiveQuestion(archiveFile, questionNo);
        if (direct) return direct;
    }

    return (state.db.exam_blueprints || []).find(bp => {
        const bpFile = clinicPrintNormalizeArchiveFile(bp.archive_file || '');
        return bpFile === archiveFile && Number(bp.question_no) === Number(questionNo);
    }) || null;
}

// 시험 문항이 가리키는 "원본 아카이브 문항" 식별자.
// 조립/MIXED 시험은 session.archive_file/question_no가 원본과 다를 수 있으므로
// blueprint의 source_archive_file/source_question_no를 우선 보존한다(report.js와 동일 계약).
function clinicPrintGetSourceIdentity(bp, archiveFile, questionNo) {
    const sourceArchiveFile = clinicPrintNormalizeArchiveFile(bp?.source_archive_file || archiveFile || '');
    const sourceQuestionNo = Number(bp?.source_question_no) || Number(questionNo) || 0;
    const sourceQuestionOrdinal = Number(bp?.source_question_ordinal) || null;
    const sourceQuestionUid = String(bp?.source_question_uid || '').trim();
    return { sourceArchiveFile, sourceQuestionNo, sourceQuestionOrdinal, sourceQuestionUid };
}

function clinicPrintGetWrongItemSourceKey(item) {
    const file = clinicPrintNormalizeArchiveFile(item?.sourceArchiveFile || item?.archiveFile || '');
    const ordinal = Number(item?.sourceQuestionOrdinal || 0);
    const no = Number(item?.sourceQuestionNo || item?.questionNo || 0);
    return ordinal > 0 ? `${file}|ordinal:${ordinal}` : `${file}|${no}`;
}

function clinicPrintDedupeWrongItemsBySource(items) {
    const seen = new Set();
    return (items || []).filter(item => {
        const key = clinicPrintGetWrongItemSourceKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, options = {}) {
    const selectedExams = new Set(selectedExamKeys || []);
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const classStudents = clinicPrintGetClassStudents(classId);
    const studentMap = new Map(classStudents.map(student => [String(student.id), student]));
    const rowsByStudent = {};

    selectedExams.forEach(examKey => {
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student || (selectedStudents.size && !selectedStudents.has(studentId))) return;

            const archiveFile = clinicPrintGetSessionArchiveFile(session);
            if (!archiveFile) return;

            const wrongItems = clinicPrintGetWrongIdsBySession(session.id,
                clinicPrintParseExamKey(examKey).examDate ? null : classId).map(questionNo => {
                const bp = clinicPrintFindBlueprint(session, questionNo);
                const { sourceArchiveFile, sourceQuestionNo, sourceQuestionOrdinal, sourceQuestionUid } = clinicPrintGetSourceIdentity(bp, archiveFile, questionNo);
                return {
                    examKey,
                    examTitle: session.exam_title || '',
                    examDate: session.exam_date || '',
                    archiveFile,
                    questionNo,
                    sourceArchiveFile,
                    sourceQuestionNo,
                    sourceQuestionOrdinal,
                    sourceQuestionUid,
                    unitKey: bp?.standard_unit_key || '',
                    unit: bp?.standard_unit || '',
                    course: bp?.standard_course || '',
                    cluster: bp?.concept_cluster_key || ''
                };
            });

            if (!wrongItems.length && options.excludeEmpty !== false) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return Object.values(rowsByStudent)
        .map(row => ({
            ...row,
            wrongItems: clinicPrintDedupeWrongItemsBySource(row.wrongItems.sort((a, b) =>
                String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                Number(a.questionNo) - Number(b.questionNo)
            ))
        }))
        .filter(row => options.excludeEmpty === false || row.wrongItems.length > 0)
        .sort((a, b) => String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko'));
}

function clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, selectedStudentIds) {
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const counts = {};

    (selectedExamKeys || []).forEach(examKey => {
        const studentIds = new Set();
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            if (!studentId || (selectedStudents.size && !selectedStudents.has(studentId))) return;
            studentIds.add(studentId);
        });
        counts[examKey] = studentIds.size;
    });

    return counts;
}

function clinicPrintBuildGradeWrongSource(classId, selectedExamKeys) {
    const gradeStudents = clinicPrintGetGradeStudents(classId);
    const studentMap = new Map(gradeStudents.map(student => [String(student.id), student]));
    const rowsByStudent = {};
    const cohortCounts = {};
    const sourceCohorts = new Map();

    (selectedExamKeys || []).forEach(examKey => {
        const sessions = clinicPrintDedupeLatestSessionByStudent(clinicPrintGetGradeSessionsForExamGroup(classId, examKey));
        cohortCounts[examKey] = sessions.length;

        // 조립 시험 등 서로 다른 문제지가 같은 원문 문항을 공유할 수 있다.
        // 오답이 없는 응시자도 포함해 원문 문항별 응시 학생의 합집합을 센다.
        if (sessions.length) {
            const representative = sessions[0];
            const archiveFile = clinicPrintGetSessionArchiveFile(representative);
            const questionCount = Math.max(clinicPrintParseExamKey(examKey).questionCount,
                ...sessions.map(session => Number(session.question_count || 0)));
            const cohortIds = sessions.map(session => String(session.student_id || '')).filter(id => studentMap.has(id));
            for (let questionNo = 1; questionNo <= questionCount; questionNo++) {
                const bp = clinicPrintFindBlueprint(representative, questionNo);
                const identity = clinicPrintGetSourceIdentity(bp, archiveFile, questionNo);
                const key = clinicPrintGetWrongItemSourceKey({ archiveFile, questionNo, ...identity });
                if (!sourceCohorts.has(key)) sourceCohorts.set(key, new Set());
                for (const id of cohortIds) sourceCohorts.get(key).add(id);
            }
        }

        sessions.forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student) return;

            const archiveFile = clinicPrintGetSessionArchiveFile(session);
            if (!archiveFile) return;

            const wrongItems = clinicPrintGetWrongIdsBySession(session.id, classId).map(questionNo => {
                const bp = clinicPrintFindBlueprint(session, questionNo);
                const { sourceArchiveFile, sourceQuestionNo, sourceQuestionOrdinal, sourceQuestionUid } = clinicPrintGetSourceIdentity(bp, archiveFile, questionNo);
                return {
                    examKey,
                    examTitle: session.exam_title || '',
                    examDate: session.exam_date || '',
                    archiveFile,
                    questionNo,
                    sourceArchiveFile,
                    sourceQuestionNo,
                    sourceQuestionOrdinal,
                    sourceQuestionUid,
                    unitKey: bp?.standard_unit_key || '',
                    unit: bp?.standard_unit || '',
                    course: bp?.standard_course || '',
                    cluster: bp?.concept_cluster_key || ''
                };
            });

            if (!wrongItems.length) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    classId: student.classId || '',
                    className: student.className || '',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return {
        cohortCounts,
        sourceCohorts,
        studentWrongItems: Object.values(rowsByStudent)
            .map(row => ({
                ...row,
                wrongItems: clinicPrintDedupeWrongItemsBySource(row.wrongItems.sort((a, b) =>
                    String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                    String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                    Number(a.questionNo) - Number(b.questionNo)
                ))
            }))
            .sort((a, b) =>
                String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
                String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko')
            )
    };
}

function clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts = {}, sourceCohorts = null) {
    const map = {};

    (studentWrongItems || []).forEach(student => {
        (student.wrongItems || []).forEach(item => {
            const key = clinicPrintGetWrongItemSourceKey(item);
            const totalCount = Number(examCohortCounts[item.examKey] || 0);
            if (!map[key]) {
                map[key] = {
                    itemKey: key,
                    examTitle: item.examTitle || '',
                    examDate: item.examDate || '',
                    examKey: item.examKey || '',
                    archiveFile: clinicPrintNormalizeArchiveFile(item.archiveFile),
                    questionNo: Number(item.questionNo),
                    sourceArchiveFile: clinicPrintNormalizeArchiveFile(item.sourceArchiveFile || item.archiveFile),
                    sourceQuestionNo: Number(item.sourceQuestionNo) || Number(item.questionNo),
                    sourceQuestionOrdinal: item.sourceQuestionOrdinal || null,
                    sourceQuestionUid: item.sourceQuestionUid || '',
                    wrongCount: 0,
                    totalCount,
                    correctRate: null,
                    wrongStudents: [],
                    unitKey: item.unitKey || '',
                    unit: item.unit || '',
                    course: item.course || '',
                    cluster: item.cluster || ''
                };
            }

            if (totalCount && totalCount > Number(map[key].totalCount || 0)) {
                map[key].totalCount = totalCount;
            }

            if (!map[key].wrongStudents.some(row => String(row.studentId) === String(student.studentId))) {
                map[key].wrongStudents.push({
                    studentId: student.studentId,
                    studentName: student.studentName
                });
                map[key].wrongCount += 1;
            }
        });
    });

    return Object.values(map).map(item => {
        const total = sourceCohorts?.has(item.itemKey)
            ? sourceCohorts.get(item.itemKey).size : Number(item.totalCount || 0);
        return {
            ...item,
            totalCount: total,
            correctRate: total ? Math.max(0, Math.min(100, Math.round(((total - Number(item.wrongCount || 0)) / total) * 100))) : null
        };
    }).sort((a, b) => {
        const aRate = a.correctRate !== null ? a.correctRate : -1;
        const bRate = b.correctRate !== null ? b.correctRate : -1;
        return (bRate - aRate) ||
            String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
            Number(a.questionNo) - Number(b.questionNo);
    });
}

function clinicPrintBuildPayload(classId, config) {
    const cls = clinicPrintGetClass(classId);
    const selectedExamKeys = config.selectedExamKeys || [];
    const selectedStudentIds = config.selectedStudentIds || [];
    const mode = config.mode || 'student';
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, { excludeEmpty: true });

    // 반 공통 오답 통계는 배포 대상 선택과 무관하게 반 전체 모집단 기준으로 계산한다.
    // (선택한 학생은 "누구에게 배포할지"만 결정하며, "공통 오답이 무엇인지" 통계는 좁히지 않는다)
    const allClassStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
    const classCohortWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allClassStudentIds, { excludeEmpty: true });
    const classCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, allClassStudentIds);
    const classWrongItems = clinicPrintBuildClassWrongItems(classCohortWrongItems, classCohortCounts);
    const gradeSource = mode === 'grade'
        ? clinicPrintBuildGradeWrongSource(classId, selectedExamKeys)
        : { cohortCounts: {}, studentWrongItems: [] };
    const gradeWrongItems = mode === 'grade'
        ? clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts, gradeSource.sourceCohorts)
        : [];
    const examMap = new Map(clinicPrintGetClassExamGroups(classId, mode === 'grade' ? 'grade' : 'class').map(group => [group.examKey, group]));
    const today = new Date().toLocaleDateString('sv-SE');
    const gradeName = String(cls?.grade || '').trim();

    return {
        version: '1.0',
        mode,
        printTitle: mode === 'grade' ? `${gradeName || '학년'} 오답 클리닉` : `${cls?.name || '반'} 오답 클리닉`,
        classId,
        className: cls?.name || '',
        gradeName,
        range: {
            type: selectedExamKeys.length > 1 ? 'multi_exam' : 'single_exam',
            from: mode === 'grade' ? clinicPrintGetGradeWindow(classId).from : '',
            to: mode === 'grade' ? clinicPrintGetGradeWindow(classId).to : ''
        },
        options: {
            groupByStudent: mode === 'student',
            groupByExam: true,
            dedupeByQuestion: mode === 'class' || mode === 'grade',
            showWrongStudents: true,
            pageBreakByStudent: true,
            includeAnswer: false,
            includeSolution: false,
            includeHomeworkCheckBox: true
        },
        headerOptions: config.headerOptions || null,
        exams: selectedExamKeys.map(key => {
            const group = examMap.get(key) || clinicPrintParseExamKey(key);
            return {
                examKey: key,
                examTitle: group.examTitle || '',
                examDate: group.examDate || '',
                archiveFile: group.archiveFile || '',
                questionCount: Number(group.questionCount || 0)
            };
        }),
        students: studentWrongItems,
        classWrongItems,
        gradeWrongItems,
        createdAt: new Date().toISOString(),
        createdDate: today
    };
}

function clinicPrintOpenEngine(payload) {
    try {
        const payloadJson = JSON.stringify(payload);
        sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
        localStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
    } catch (e) {
        toast('오답지 데이터를 저장하지 못했습니다.', 'error');
        return;
    }

    const engineUrl = new URL('wrong_print_engine.html', window.location.href).toString();
    const win = window.open(engineUrl, '_blank', 'noopener');
    if (!win) {
        toast('팝업 차단을 해제하세요', 'warn');
    }
}

function clinicPrintOpenEngineUrl(url) {
    const absoluteUrl = new URL(url, window.location.href).toString();
    const win = window.open(absoluteUrl, '_blank', 'noopener');
    if (!win) {
        toast('팝업 차단을 해제하세요', 'warn');
    }
}

// 모드/범위와 무관하게 배포 대상은 항상 화면에서 선택한 학생으로만 제한한다.
// (반/학년 전체에 자동 배포되지 않도록 - 통계 모집단과 배포 대상을 분리)
function clinicPrintBuildWrongClinicTargets(classId, payload, selectedStudentIds = []) {
    const mode = payload?.mode || 'student';
    const selected = new Set((selectedStudentIds || []).map(String));
    const isGradeScope = mode === 'grade' || (mode === 'type' && payload.scope === 'grade');

    if (isGradeScope) {
        return clinicPrintGetGradeStudents(classId)
            .filter(student => selected.has(String(student.id)))
            .map(student => ({
                type: 'student',
                student_id: student.id,
                student_name: student.name || '',
                class_id: student.classId || '',
                class_name: student.className || ''
            }));
    }

    return clinicPrintGetClassStudents(classId)
        .filter(student => selected.has(String(student.id)))
        .map(student => ({
            type: 'student',
            student_id: student.id,
            student_name: student.name || '',
            class_id: classId,
            class_name: clinicPrintGetClass(classId)?.name || ''
        }));
}

async function clinicPrintSaveAndOpen(classId, payload, selectedStudentIds = []) {
    const cls = clinicPrintGetClass(classId);
    const targets = clinicPrintBuildWrongClinicTargets(classId, payload, selectedStudentIds);
    const result = await api.post('wrong-clinics', {
        title: payload.headerOptions?.title || payload.printTitle || clinicPrintGetHeaderDefaultTitle(classId),
        mode: payload.mode || 'student',
        source: {
            scope_type: payload.mode === 'grade' || payload.scope === 'grade' ? 'grade' : 'class',
            class_id: classId,
            class_name: cls?.name || '',
            grade: payload.gradeName || cls?.grade || ''
        },
        targets,
        payload
    });
    if (result?.success === false || result?.error || result?.message === 'Forbidden' || !result?.public_set_key) {
        throw new Error(result.message || result.error || '저장형 오답 클리닉 생성 실패');
    }
    const engineUrl = result?.print?.engine_url || `wrong_print_engine.html?set=${encodeURIComponent(result.public_set_key || '')}`;
    clinicPrintOpenEngineUrl(engineUrl);
    toast(`오답 클리닉 저장 완료 · ${Number(result.packet_count || 0)}명`, 'success');
    if (state.ui?.classroomWrongClinicStatus?.[String(classId || '')]) state.ui.classroomWrongClinicStatus[String(classId || '')].loadedAt = 0;
    if (typeof updateClassroomMonthlyStatusBoardDOM === 'function') updateClassroomMonthlyStatusBoardDOM(classId);
    return result;
}

async function clinicPrintOpenStoredOrFallback(classId, payload, selectedStudentIds = []) {
    try {
        await clinicPrintSaveAndOpen(classId, payload, selectedStudentIds);
    } catch (e) {
        console.warn('[clinic-print] stored wrong clinic failed; fallback to storage payload:', e);
        toast('저장형 오답 클리닉 생성 실패. 임시 출력으로 진행합니다.', 'warn');
        clinicPrintOpenEngine(payload);
    }
}

function clinicPrintGetCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

let clinicPrintPreviewPushTimer = null;
let clinicPrintActiveClassId = null;

// 미리보기 헤더 인라인 편집(iframe) → 좌측 입력칸 반영 → 재동기화.
// 리스너는 1회만 등록하고, 대상 반은 clinicPrintActiveClassId 로 추적한다.
if (typeof window !== 'undefined' && !window.__clinicPrintHeaderEditBound) {
    window.__clinicPrintHeaderEditBound = true;
    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;
        const msg = event.data || {};
        if ((msg.type !== 'AP_PRINT_HEADER_EDIT' && msg.type !== 'AP_CLINIC_HEADER_EDIT') || !clinicPrintActiveClassId) return;
        const fieldToId = {
            title: 'clinic-print-header-title',
            subtitle: 'clinic-print-header-subtitle'
        };
        const input = document.getElementById(fieldToId[msg.field] || '');
        if (!input) return;
        input.value = msg.value || '';
        if (msg.field === 'title') clinicPrintSetHeaderTitleDirty(true);
        clinicPrintSchedulePreviewPush(clinicPrintActiveClassId);
    });
}

function clinicPrintGetPreviewEngineMode() {
    const frame = document.getElementById('clinic-print-preview-frame');
    try {
        return frame?.contentDocument?.querySelector('.mode-tab.active')?.dataset?.mode || '';
    } catch (e) {
        return '';
    }
}

function clinicPrintPushPreview(classId) {
    const frame = document.getElementById('clinic-print-preview-frame');
    if (!frame?.contentWindow) return;

    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    let payload = null;
    try {
        payload = mode === 'type'
            ? clinicPrintBuildTypePayload(classId)
            : clinicPrintBuildPayload(classId, {
                selectedExamKeys: clinicPrintGetCheckedValues('clinic-print-exam'),
                selectedStudentIds: clinicPrintGetCheckedValues('clinic-print-student'),
                mode,
                headerOptions: clinicPrintGetHeaderOptions(classId)
            });
    } catch (e) {
        console.warn('[clinic-print] preview payload build failed:', e);
    }

    if (!payload) return;
    const engineMode = clinicPrintGetPreviewEngineMode();
    frame.contentWindow.postMessage({
        type: 'AP_PRINT_PREVIEW',
        payload,
        mode: engineMode || undefined
    }, window.location.origin);
}

function clinicPrintSchedulePreviewPush(classId, delay = 150) {
    clearTimeout(clinicPrintPreviewPushTimer);
    clinicPrintPreviewPushTimer = setTimeout(() => {
        clinicPrintPushPreview(classId);
    }, delay);
}

function clinicPrintSwitchMode(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';

    document.querySelectorAll('#clinic-print-mode-cards .clinic-print-mode-card').forEach(card => {
        const active = card.getAttribute('data-mode') === mode;
        card.classList.toggle('clinic-print-mode-card--active', active);
    });

    const isType = mode === 'type';
    const studentSection = document.getElementById('clinic-print-student-section');
    const typePanel = document.getElementById('clinic-print-type-panel');
    const submitBtn = document.getElementById('clinic-print-submit-btn');
    // 학생 선택 영역은 모드와 무관하게 항상 노출한다(반/학년/유형 모드도 배포 대상을 직접 골라야 함).
    if (studentSection) studentSection.style.display = '';
    if (typePanel) typePanel.style.display = isType ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = '';
    clinicPrintUpdateExamList(classId);
    clinicPrintRefreshHeaderDefault(classId);

    if (isType) clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
    clinicPrintSchedulePreviewPush(classId);
}

// ---- 유형 카드 (최다빈출 / 최다오답 / 단원별) ----

// scope 범위의 dedupe된 공통 오답 문항 목록(정답률·오답수 포함)을 만든다.
// 기존 학생/반/학년 집계 함수를 그대로 재사용한다(신규 마스터 없음).
function clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope) {
    if (scope === 'grade') {
        const gradeSource = clinicPrintBuildGradeWrongSource(classId, selectedExamKeys);
        return clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts, gradeSource.sourceCohorts);
    }
    const allStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: true });
    const examCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, allStudentIds);
    return clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts);
}

// 배포 대상 선택 목록의 모집단(반 또는 학년)을 반환한다.
// mode='student': 개인 오답 콘텐츠라 본인 오답이 없는 학생은 어차피 출력할 게 없으므로 목록에서 제외한다.
// mode='class'/'grade'/'type': 콘텐츠가 "반·학년 공통 오답"이라 그 학생 개인의 오답 유무와 무관하다.
// 본인 오답이 0건이어도 복습용으로 줄 수 있어야 하므로 전체 명단을 보여주고, 오답수는 참고용으로만 표시한다.
function clinicPrintGetDeliveryPoolStudents(classId, selectedExamKeys, scope, mode) {
    if (mode === 'student') {
        const allStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
        return clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: true });
    }
    if (scope === 'grade') {
        const gradeStudents = clinicPrintGetGradeStudents(classId);
        const wrongByStudent = new Map(
            clinicPrintBuildGradeWrongSource(classId, selectedExamKeys).studentWrongItems
                .map(row => [String(row.studentId), row.wrongItems])
        );
        return gradeStudents.map(student => ({
            studentId: student.id,
            studentName: student.name || '이름 없음',
            classId: student.classId || '',
            className: student.className || '',
            wrongItems: wrongByStudent.get(String(student.id)) || []
        }));
    }
    const classStudents = clinicPrintGetClassStudents(classId);
    const allStudentIds = classStudents.map(student => String(student.id));
    const wrongByStudent = new Map(
        clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: false })
            .map(row => [String(row.studentId), row.wrongItems])
    );
    return classStudents.map(student => ({
        studentId: student.id,
        studentName: student.name || '이름 없음',
        wrongItems: wrongByStudent.get(String(student.id)) || []
    }));
}

function clinicPrintGetDeliveryScope(mode) {
    if (mode === 'grade') return 'grade';
    if (mode === 'type') return document.getElementById('clinic-print-type-scope')?.value || 'class';
    return 'class';
}

// 시험 선택이 바뀌면 유형 모드는 문항 미리보기를, 그 외 모드는 학생 목록을 갱신해야 한다.
function clinicPrintOnExamChange(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    if (mode === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
}

// 최다빈출 = 정답률 50% 초과 / 최다오답 = 정답률 50% 이하 (2단계, 유형 카드용).
// 단원별 오답은 3단계: 75%초과 / 50~75% / 50%이하. 둘 다 오답수 내림차순.
function clinicPrintFilterTypeItems(items, rateRule) {
    return (items || [])
        .filter(item => {
            const rate = item.correctRate;
            if (rate === null || rate === undefined) return false;
            if (rateRule === 'gte75') return rate > 75;
            if (rateRule === 'mid5075') return rate > 50 && rate <= 75;
            if (rateRule === 'lte50') return rate <= 50;
            return rateRule === 'gte50' ? rate > 50 : rate <= 50;
        })
        .sort((a, b) =>
            Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
            (rateRule === 'gte50' || rateRule === 'gte75'
                ? Number(b.correctRate || 0) - Number(a.correctRate || 0)
                : Number(a.correctRate || 0) - Number(b.correctRate || 0)) ||
            Number(a.questionNo || 0) - Number(b.questionNo || 0)
        );
}

function clinicPrintBuildTypePayload(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const rateRule = typeMode === 'unit'
        ? clinicPrintTypeState.unitRate
        : (typeMode === 'frequent' ? 'gte50' : 'lt50');
    const sourceItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    let typeItems = clinicPrintFilterTypeItems(sourceItems, rateRule);
    const selectedUnitKeys = typeMode === 'unit' ? [...clinicPrintTypeState.unitSelection] : [];
    const unitOrder = [...selectedUnitKeys];

    if (typeMode === 'unit') {
        const orderIndex = new Map(unitOrder.map((key, idx) => [key, idx]));
        typeItems = typeItems
            .filter(item => orderIndex.has(item.unitKey || '__UNCLASSIFIED__'))
            .sort((a, b) => {
                const ak = a.unitKey || '__UNCLASSIFIED__';
                const bk = b.unitKey || '__UNCLASSIFIED__';
                return (orderIndex.get(ak) - orderIndex.get(bk)) ||
                    Number(b.correctRate || 0) - Number(a.correctRate || 0) ||
                    Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
                    Number(a.questionNo || 0) - Number(b.questionNo || 0);
            });
    }

    const payload = clinicPrintBuildPayload(classId, {
        selectedExamKeys,
        selectedStudentIds: clinicPrintGetClassStudents(classId).map(student => String(student.id)),
        mode: scope === 'grade' ? 'grade' : 'class',
        headerOptions: clinicPrintGetHeaderOptions(classId)
    });
    const cls = clinicPrintGetClass(classId);
    const gradeName = String(cls?.grade || '').trim();
    const typeTitle = typeMode === 'unit'
        ? '단원별 오답'
        : (typeMode === 'frequent' ? '최다빈출 오답' : '최다오답');

    return {
        ...payload,
        mode: 'type',
        typeMode,
        scope,
        rateRule,
        selectedUnitKeys,
        unitOrder,
        typeItems,
        classWrongItems: scope === 'class' ? typeItems : [],
        gradeWrongItems: scope === 'grade' ? typeItems : [],
        printTitle: `${scope === 'grade' ? (gradeName || '학년') : (cls?.name || '반')} ${typeTitle}`
    };
}

function clinicPrintSetTypeScope(classId, scope) {
    const input = document.getElementById('clinic-print-type-scope');
    if (input) input.value = scope;
    document.querySelectorAll('#clinic-print-type-scope-toggle .clinic-print-scope-btn').forEach(btn => {
        const active = btn.getAttribute('data-scope') === scope;
        btn.classList.toggle('clinic-print-scope-btn--active', active);
    });
    clinicPrintUpdateExamList(classId);
    clinicPrintRefreshHeaderDefault(classId);
    clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId); // 범위(반/학년)가 바뀌면 배포 대상 모집단도 바뀐다
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintSetTypeMode(classId, typeMode) {
    const input = document.getElementById('clinic-print-type-mode');
    if (input) input.value = typeMode;
    document.querySelectorAll('#clinic-print-type-cards .clinic-print-type-card').forEach(card => {
        const active = card.getAttribute('data-type-mode') === typeMode;
        card.classList.toggle('clinic-print-type-card--active', active);
    });
    clinicPrintRefreshHeaderDefault(classId);
    clinicPrintRenderTypePanel(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintRenderTypePanel(classId) {
    const root = document.getElementById('clinic-print-type-result');
    const summaryEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';

    const emptyBox = msg => `<div class="clinic-print-empty">${clinicPrintEscapeHtml(msg)}</div>`;

    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        root.innerHTML = emptyBox(clinicPrintGetGradeDataMessage(classId));
        if (summaryEl) summaryEl.textContent = clinicPrintGetGradeDataMessage(classId);
        return;
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = emptyBox('시험을 선택하세요.');
        if (summaryEl) summaryEl.textContent = `${scopeLabel} · 시험 미선택`;
        return;
    }

    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);

    if (typeMode === 'unit') {
        clinicPrintRenderUnitMode(classId, scopeLabel);
        return;
    }

    const rateRule = typeMode === 'frequent' ? 'gte50' : 'lt50';
    const filtered = clinicPrintFilterTypeItems(scopeItems, rateRule);
    const typeLabel = typeMode === 'frequent' ? '최다빈출 (정답률 50% 초과)' : '최다오답 (정답률 50% 이하)';

    if (summaryEl) summaryEl.textContent = `${scopeLabel} · ${typeMode === 'frequent' ? '최다빈출' : '최다오답'} · ${filtered.length}문항`;

    if (!filtered.length) {
        root.innerHTML = `<div class="clinic-print-result"><div class="clinic-print-subtitle">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)}</div>${emptyBox('해당 조건의 오답 문항이 없습니다.')}</div>`;
        return;
    }

    const previewLimit = 12;
    const rows = filtered.slice(0, previewLimit).map(item => {
        const unitText = item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류';
        const rateText = item.correctRate === null || item.correctRate === undefined ? '-' : `${item.correctRate}%`;
        return `
            <div class="clinic-print-preview-row">
                <span class="clinic-print-preview-row__main">
                    <span class="clinic-print-preview-row__title">${clinicPrintEscapeHtml(item.examTitle || '시험')} · ${item.questionNo}번</span>
                    <span class="clinic-print-preview-row__meta">${clinicPrintEscapeHtml(unitText)}</span>
                </span>
                <span class="clinic-print-preview-row__stat">
                    <span class="clinic-print-preview-row__rate">정답률 ${rateText}</span>
                    <span class="clinic-print-preview-row__wrong">오답 ${item.wrongCount}명</span>
                </span>
            </div>
        `;
    }).join('');

    const moreText = filtered.length > previewLimit ? `<div class="clinic-print-more">외 ${filtered.length - previewLimit}문항</div>` : '';

    root.innerHTML = `
        <div class="clinic-print-result">
            <div class="clinic-print-subtitle">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)} · 오답수 많은 순</div>
            ${rows}
            ${moreText}
            <div class="clinic-print-note">오답지 만들기를 누르면 위 조건으로 출력됩니다.</div>
        </div>
    `;
}

// ---- 단원별 오답 드래그 UI (Loop 3) ----

// 유형 패널의 단원 선택/순서 상태. 모달 재생성 시 초기화되며, root 재렌더에는 영향받지 않는다.
const clinicPrintTypeState = { unitSelection: [], unitRate: 'lte50', dragKey: null };

// 과목 prefix 정렬 우선순위. 표준단원키 접두로 마스터 과목 순서를 부여한다(JS아카이브 마스터 테이블 순서 기준).
const CLINIC_COURSE_RANK = {
    'M1': 1, 'M2': 2, 'M3': 3,
    'H22-C': 4, 'H22-C2': 5, 'H22-A': 6, 'H22-M1': 7, 'H22-M2': 8, 'H22-PS': 9, 'H22-GE': 10,
    'H15-SA': 11, 'H15-SB': 12, 'H15-M1': 13, 'H15-M2': 14, 'H15-CALC': 15, 'H15-PS': 16, 'H15-GV': 17
};

// 표준단원키의 숫자 접미(=마스터 Order)와 과목 rank를 추출하는 어댑터.
// 예: "H22-C-06" → { rank:4, num:6 }, "M3-04" → { rank:3, num:4 }
function clinicPrintUnitOrder(unitKey) {
    if (!unitKey) return { rank: 999, num: 999 };
    const parts = String(unitKey).split('-');
    const num = Number(parts[parts.length - 1]);
    const prefix = parts.slice(0, -1).join('-');
    const rank = CLINIC_COURSE_RANK[prefix] != null ? CLINIC_COURSE_RANK[prefix] : 900;
    return { rank, num: Number.isFinite(num) ? num : 999 };
}

function clinicPrintTypeEmptyBox(msg) {
    return `<div class="clinic-print-empty clinic-print-empty--sm">${clinicPrintEscapeHtml(msg)}</div>`;
}

// 현재 범위/정답률 규칙으로 단원 목록을 만든다.
// unitKey 기준으로 그룹핑하고, 마스터 순서로 정렬하며, unitKey 없는 문항은 "기타 / 단원 미분류" 버킷으로 모은다.
function clinicPrintComputeScopeUnits(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    const filtered = clinicPrintFilterTypeItems(scopeItems, clinicPrintTypeState.unitRate);
    const map = new Map();
    filtered.forEach(item => {
        const key = item.unitKey || '__UNCLASSIFIED__';
        if (!map.has(key)) {
            const ord = item.unitKey ? clinicPrintUnitOrder(item.unitKey) : { rank: 999, num: 999 };
            map.set(key, {
                key,
                label: item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류',
                rank: ord.rank,
                num: ord.num,
                count: 0
            });
        }
        map.get(key).count += 1;
    });
    const units = Array.from(map.values()).sort((a, b) =>
        a.rank - b.rank || a.num - b.num || String(a.label).localeCompare(String(b.label), 'ko')
    );
    return { units, totalFiltered: filtered.length };
}

function clinicPrintRenderUnitMode(classId, scopeLabel) {
    const root = document.getElementById('clinic-print-type-result');
    if (!root) return;

    const safeClassId = clinicPrintEscapeJsString(classId);
    const activeCls = rate => rate === clinicPrintTypeState.unitRate ? ' clinic-print-rate-btn--active' : '';
    root.innerHTML = `
        <div class="clinic-print-type-panel">
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">정답률 기준</div>
                <div id="clinic-print-unit-rate-toggle" class="clinic-print-rate-grid">
                    <button type="button" class="clinic-print-rate-btn${activeCls('gte75')}" data-rate="gte75" onclick="clinicPrintSetUnitRate('${safeClassId}','gte75')">최다빈출 (75%초과)</button>
                    <button type="button" class="clinic-print-rate-btn${activeCls('mid5075')}" data-rate="mid5075" onclick="clinicPrintSetUnitRate('${safeClassId}','mid5075')">중간 (50~75%)</button>
                    <button type="button" class="clinic-print-rate-btn${activeCls('lte50')}" data-rate="lte50" onclick="clinicPrintSetUnitRate('${safeClassId}','lte50')">최다오답 (50%이하)</button>
                </div>
            </div>
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">마스터 단원</div>
                <div id="clinic-print-unit-master" class="clinic-print-unit-list clinic-print-unit-list--master"></div>
            </div>
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">출력할 단원 <span class="clinic-print-section-title--soft">(드래그 또는 ↑↓로 순서 변경)</span></div>
                <div id="clinic-print-unit-selected" class="clinic-print-unit-list clinic-print-unit-list--selected"></div>
            </div>
            <div class="clinic-print-note">오답지 만들기를 누르면 선택한 단원 순서대로 출력됩니다.</div>
        </div>
    `;
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintSetUnitRate(classId, rate) {
    clinicPrintTypeState.unitRate = rate;
    document.querySelectorAll('#clinic-print-unit-rate-toggle .clinic-print-rate-btn').forEach(btn => {
        const active = btn.getAttribute('data-rate') === rate;
        btn.classList.toggle('clinic-print-rate-btn--active', active);
    });
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintRenderUnitLists(classId) {
    const masterEl = document.getElementById('clinic-print-unit-master');
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!masterEl || !selEl) return;

    const { units, totalFiltered } = clinicPrintComputeScopeUnits(classId);
    const byKey = new Map(units.map(u => [u.key, u]));

    // 현재 범위/규칙에 더 이상 존재하지 않는 선택 단원은 정리(누락 방지: 존재하는 것만 유지)
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => byKey.has(k));
    const selectedKeys = clinicPrintTypeState.unitSelection;
    const selectedSet = new Set(selectedKeys);
    const available = units.filter(u => !selectedSet.has(u.key));

    const summaryEl = document.getElementById('clinic-print-summary');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';
    const rateLabel = clinicPrintTypeState.unitRate === 'gte75' ? '최다빈출'
        : (clinicPrintTypeState.unitRate === 'mid5075' ? '중간' : '최다오답');
    if (summaryEl) summaryEl.textContent = `${scopeLabel} · 단원별(${rateLabel}) · 선택 ${selectedKeys.length}/${units.length}단원 · ${totalFiltered}문항`;

    masterEl.innerHTML = available.length
        ? available.map(u => {
            const k = clinicPrintEscapeJsString(u.key);
            return `
                <div class="clinic-print-unit-row">
                    <span class="clinic-print-unit-row__main">
                        <span class="clinic-print-unit-row__label">${clinicPrintEscapeHtml(u.label)}</span>
                        <span class="clinic-print-unit-row__count">${u.count}문항</span>
                    </span>
                    <button type="button" class="clinic-print-unit-action clinic-print-unit-action--add" aria-label="추가" onclick="clinicPrintUnitAdd('${clinicPrintEscapeJsString(classId)}','${k}')">+</button>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox(units.length ? '모든 단원을 선택했습니다.' : '해당 조건의 단원이 없습니다.');

    selEl.innerHTML = selectedKeys.length
        ? selectedKeys.map((key, i) => {
            const u = byKey.get(key);
            const k = clinicPrintEscapeJsString(key);
            const cid = clinicPrintEscapeJsString(classId);
            return `
                <div data-unit-row data-key="${clinicPrintEscapeAttr(key)}" class="clinic-print-unit-row clinic-print-unit-row--selected">
                    <span class="clinic-print-unit-handle" title="드래그로 순서 변경">≡</span>
                    <span class="clinic-print-unit-row__main">
                        <span class="clinic-print-unit-row__label">${i + 1}. ${clinicPrintEscapeHtml(u.label)}</span>
                        <span class="clinic-print-unit-row__count">${u.count}문항</span>
                    </span>
                    <span class="clinic-print-unit-actions">
                        <button type="button" class="clinic-print-unit-action" aria-label="위로" ${i === 0 ? 'disabled' : ''} onclick="clinicPrintUnitMove('${cid}',${i},-1)">↑</button>
                        <button type="button" class="clinic-print-unit-action" aria-label="아래로" ${i === selectedKeys.length - 1 ? 'disabled' : ''} onclick="clinicPrintUnitMove('${cid}',${i},1)">↓</button>
                        <button type="button" class="clinic-print-unit-action clinic-print-unit-action--remove" aria-label="제거" onclick="clinicPrintUnitRemove('${cid}','${k}')">×</button>
                    </span>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox('상단 마스터 단원에서 + 로 추가하세요.');

    clinicPrintAttachUnitDnD(classId);
}

function clinicPrintUnitAdd(classId, key) {
    if (!clinicPrintTypeState.unitSelection.includes(key)) clinicPrintTypeState.unitSelection.push(key);
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintUnitRemove(classId, key) {
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => k !== key);
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintUnitMove(classId, index, dir) {
    const arr = clinicPrintTypeState.unitSelection;
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[index];
    arr[index] = arr[j];
    arr[j] = tmp;
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

// 포인터 기반 드래그(마우스·터치·펜 공통). 드래그 중에는 DOM 노드만 이동하고, 놓을 때 순서를 확정한다.
function clinicPrintAttachUnitDnD(classId) {
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!selEl) return;
    selEl.querySelectorAll('[data-unit-row] .clinic-print-unit-handle').forEach(handle => {
        handle.addEventListener('pointerdown', e => {
            e.preventDefault();
            const row = handle.closest('[data-unit-row]');
            if (!row) return;
            row.style.opacity = '0.6';
            handle.style.cursor = 'grabbing';

            const onMove = ev => {
                const rows = Array.from(selEl.querySelectorAll('[data-unit-row]'));
                const after = rows.find(other => {
                    if (other === row) return false;
                    const rect = other.getBoundingClientRect();
                    return ev.clientY < rect.top + rect.height / 2;
                });
                if (after) {
                    if (after.previousElementSibling !== row) selEl.insertBefore(row, after);
                } else if (selEl.lastElementChild !== row) {
                    selEl.appendChild(row);
                }
            };
            const onUp = () => {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                row.style.opacity = '1';
                handle.style.cursor = 'grab';
                clinicPrintTypeState.unitSelection = Array.from(selEl.querySelectorAll('[data-unit-row]'))
                    .map(r => r.getAttribute('data-key'));
                clinicPrintRenderUnitLists(classId);
                clinicPrintSchedulePreviewPush(classId);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    });
}

// 배포 대상 학생 체크리스트. 반/학년/유형 모드 모두 여기서 "실제로 인쇄물을 받을 학생"을 고른다.
// 공통 오답 통계(정답률 등)는 항상 반/학년 전체 모집단 기준으로 별도 계산되며, 이 목록은 배포 범위만 좁힌다.
function clinicPrintUpdateStudentList(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const scope = clinicPrintGetDeliveryScope(mode);
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const root = document.getElementById('clinic-print-student-list');
    const countEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        root.innerHTML = `<div class="clinic-print-empty">${clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId))}</div>`;
        if (countEl) countEl.textContent = clinicPrintGetGradeDataMessage(classId);
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = '<div class="clinic-print-empty">시험을 선택하세요.</div>';
        if (countEl && mode !== 'type') countEl.textContent = '시험을 선택하세요.';
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    const poolItems = clinicPrintGetDeliveryPoolStudents(classId, selectedExamKeys, scope, mode);

    if (countEl && mode !== 'type') {
        const totalWrong = poolItems.reduce((sum, row) => sum + row.wrongItems.length, 0);
        const scopeLabel = mode === 'student'
            ? '오답 학생'
            : (scope === 'grade' ? '학년 전체 학생' : '반 전체 학생');
        countEl.textContent = `선택 시험 ${selectedExamKeys.length}개 · ${scopeLabel} ${poolItems.length}명 · 오답 ${totalWrong}문항`;
    }

    if (!poolItems.length) {
        root.innerHTML = '<div class="clinic-print-empty">선택한 시험에 출력 가능한 오답이 없습니다.</div>';
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    // 시험/범위를 바꿀 때마다 이 목록 전체가 다시 그려지므로, 재렌더 전에 사용자가 직접 해제한 학생을
    // 기억해뒀다가 그대로 유지한다. 그렇지 않으면 exam 체크박스 하나만 건드려도 선택이 전부 초기화된다.
    const previouslyUnchecked = new Set(
        Array.from(root.querySelectorAll('input[name="clinic-print-student"]:not(:checked)')).map(el => el.value)
    );

    root.innerHTML = poolItems.map(row => {
        const checked = previouslyUnchecked.has(String(row.studentId)) ? '' : 'checked';
        return `
        <label class="clinic-print-student-row">
            <span class="clinic-print-student-row__main">
                <input type="checkbox" name="clinic-print-student" value="${clinicPrintEscapeAttr(row.studentId)}" ${checked} onchange="clinicPrintSchedulePreviewPush('${clinicPrintEscapeJsString(classId)}')">
                <span class="clinic-print-student-row__name">${clinicPrintEscapeHtml(row.studentName)}${row.className ? ` · ${clinicPrintEscapeHtml(row.className)}` : ''}</span>
            </span>
            <span class="clinic-print-student-row__count">${row.wrongItems.length}문항</span>
        </label>
    `;
    }).join('');
    clinicPrintSchedulePreviewPush(classId);
}

// "미리보기"는 새 창을 띄우지 않고 우측에 이미 떠 있는 임베드 미리보기 패널(clinic-print-preview-frame)을
// 갱신해서 보여준다. 설정이 바뀔 때마다 이 패널은 어차피 자동 갱신되므로, 이 버튼은 시험/단원/학생 선택이
// 빠졌는지 확인해 안내 토스트를 띄우고, 패널을 최신 상태로 강제 갱신 + 화면에 보이도록 스크롤만 해준다.
function clinicPrintPreview(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';

    if (clinicPrintGetDeliveryScope(mode) === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        toast(clinicPrintGetGradeDataMessage(classId), 'warn');
        return;
    }
    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    if (mode === 'type') {
        const typePayload = clinicPrintBuildTypePayload(classId);
        if (typePayload.typeMode === 'unit' && !(typePayload.unitOrder || []).length) {
            toast('출력할 단원을 선택하세요.', 'warn');
            return;
        }
        if (!(typePayload.typeItems || []).length) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
    } else {
        const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
        if (mode === 'student' && !selectedStudentIds.length) {
            toast('미리볼 학생을 선택하세요.', 'warn');
            return;
        }

        const payload = clinicPrintBuildPayload(classId, {
            selectedExamKeys,
            selectedStudentIds,
            mode,
            headerOptions: clinicPrintGetHeaderOptions(classId)
        });
        const itemCount = mode === 'grade'
            ? payload.gradeWrongItems.length
            : mode === 'class'
            ? payload.classWrongItems.length
            : payload.students.reduce((sum, row) => sum + row.wrongItems.length, 0);

        if (!itemCount) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
    }

    clinicPrintPushPreview(classId);
    document.getElementById('clinic-print-preview-frame')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

async function clinicPrintSubmit(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
    const modeEl = document.querySelector('input[name="clinic-print-mode"]:checked');
    const mode = modeEl?.value || 'student';

    if (clinicPrintGetDeliveryScope(mode) === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        toast(clinicPrintGetGradeDataMessage(classId), 'warn');
        return;
    }

    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    // 모드/범위와 무관하게 출제할 학생은 반드시 직접 선택해야 한다(반·학년 전체 자동 배포 금지).
    if (!selectedStudentIds.length) {
        toast('출제할 학생을 선택하세요.', 'warn');
        return;
    }

    if (mode === 'type') {
        const typePayload = clinicPrintBuildTypePayload(classId);
        if (typePayload.typeMode === 'unit' && !(typePayload.unitOrder || []).length) {
            toast('출력할 단원을 선택하세요.', 'warn');
            return;
        }
        if (!(typePayload.typeItems || []).length) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
        await clinicPrintOpenStoredOrFallback(classId, typePayload, selectedStudentIds);
        return;
    }

    const payload = clinicPrintBuildPayload(classId, {
        selectedExamKeys,
        selectedStudentIds,
        mode,
        headerOptions: clinicPrintGetHeaderOptions(classId)
    });
    const itemCount = mode === 'grade'
        ? payload.gradeWrongItems.length
        : mode === 'class'
        ? payload.classWrongItems.length
        : payload.students.reduce((sum, row) => sum + row.wrongItems.length, 0);

    if (!itemCount) {
        toast('출력 가능한 오답 문항이 없습니다.', 'warn');
        return;
    }

    await clinicPrintOpenStoredOrFallback(classId, payload, selectedStudentIds);
}

function openClinicCenter(classId = '') {
    const hasClassId = !!String(classId || '').trim();
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

    if (!hasClassId) {
        openClinicClassPicker();
        return;
    }

    showModal('클리닉', `
        <div class="clinic-print-menu-grid">
            <button class="btn apms-button apms-button--quiet clinic-print-menu-btn" onclick="if('${safeClassIdForJs}'){ openClinicPrintCenter('${safeClassIdForJs}'); } else { toast('반 화면에서 이용하세요.', 'info'); }">오답</button>
            <button class="btn apms-button apms-button--quiet clinic-print-menu-btn" onclick="clinicPrintOpenSimilarMenu('${safeClassIdForJs}')">유사문항</button>
        </div>
    `);
}

function openClinicClassPicker() {
    const classes = clinicPrintGetActiveClasses();
    const currentClassId = String(state.ui?.currentClassId || '');

    if (!classes.length) {
        toast('선택할 반이 없습니다.', 'warn');
        return;
    }

    const classRows = classes.map(cls => {
        const safeClassId = clinicPrintEscapeJsString(cls.id);
        const selected = String(cls.id) === currentClassId;
        const meta = [cls.grade, cls.teacher_name, cls.schedule_days || cls.day_group, cls.time_label]
            .filter(Boolean)
            .join(' · ');
        return `
            <button type="button" class="btn apms-button apms-button--quiet clinic-print-class-btn${selected ? ' clinic-print-class-btn--current' : ''}" onclick="openClinicCenter('${safeClassId}')">
                <span class="clinic-print-class-btn__name">${clinicPrintEscapeHtml(cls.name || '반 이름 없음')}</span>
                <span class="clinic-print-class-btn__meta">${clinicPrintEscapeHtml(meta || '반 정보 없음')}</span>
            </button>
        `;
    }).join('');

    showModal('클리닉 반 선택', `
        <div class="clinic-print-class-list">
            ${classRows}
        </div>
    `);
}

function clinicPrintOpenSimilarMenu(classId = '') {
    const hasClassId = !!String(classId || '').trim();

    if (hasClassId) {
        if (typeof openClinicSimilarForClass === 'function') {
            openClinicSimilarForClass(classId);
            return;
        }
        if (typeof openClinicBasketForClass === 'function') {
            openClinicBasketForClass(classId);
            return;
        }
        toast('준비 중입니다.', 'info');
        return;
    }

    if (typeof openClinicBasket === 'function') {
        openClinicBasket();
        return;
    }

    toast('준비 중입니다.', 'info');
}

function clinicPrintGetExamListScope() {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    if (mode === 'grade') return 'grade';
    if (mode === 'type') return (document.getElementById('clinic-print-type-scope')?.value || 'class') === 'grade' ? 'grade' : 'class';
    return 'class';
}

function clinicPrintGetExamPeriod(group = {}) {
    // The paper's academic period is independent of the day students submitted OMR.
    const source = [group.archiveFile, group.examTitle].filter(Boolean).join(' ');
    const path = source.match(/(?:^|\/)([12])(mid|final)(?:\/|$)/i);
    if (path) return path[1] + path[2].toLowerCase();
    const semester = source.match(/([12])\s*학기/);
    const kind = /중간/.test(source) ? 'mid' : /기말/.test(source) ? 'final' : '';
    if (semester && kind) return semester[1] + kind;
    for (const assignment of group.assignments || []) {
        try {
            const payload = JSON.parse(assignment.mixed_payload_json || '{}');
            const meta = payload.meta || {};
            const term = String(meta.semester || '').replace(/\D/g, '');
            const exam = String(meta.examType || meta.exam_type || '');
            const type = /^(mid|중간)$/.test(exam) ? 'mid' : /^(final|기말)$/.test(exam) ? 'final' : '';
            if (/^[12]$/.test(term) && type) return term + type;
        } catch (error) { /* Legacy assignments can have no saved paper metadata. */ }
    }
    return 'other';
}

function clinicPrintGetExamPeriodFilter(classId) {
    const key = String(classId);
    if (clinicPrintExamPeriodFilters.has(key)) return clinicPrintExamPeriodFilters.get(key);
    let stored = '';
    try { stored = localStorage.getItem(`AP_CLINIC_EXAM_PERIOD:${key}`) || ''; } catch (error) {}
    const groups = clinicPrintGetClassExamGroups(classId, 'grade');
    const month = new Date().getMonth() + 1;
    const current = month <= 5 ? '1mid' : month <= 7 ? '1final' : month <= 10 ? '2mid' : '2final';
    const value = AP_CLINIC_EXAM_PERIODS.some(([id]) => id === stored) ? stored
        : groups.some(group => clinicPrintGetExamPeriod(group) === current) ? current
        : groups.length ? clinicPrintGetExamPeriod(groups[0]) : 'all';
    clinicPrintExamPeriodFilters.set(key, value);
    return value;
}

function clinicPrintRenderExamPeriodFilters(classId, scope = 'class') {
    const year = clinicPrintGetExamYearFilter(classId);
    const groups = clinicPrintGetClassExamGroups(classId, scope)
        .filter(group => year === 'all' || clinicPrintGetExamYear(group) === year);
    const selected = clinicPrintGetExamPeriodFilter(classId);
    const safeClassId = clinicPrintEscapeJsString(classId);
    return AP_CLINIC_EXAM_PERIODS.map(([period, label]) => {
        const count = groups.filter(group => period === 'all' || clinicPrintGetExamPeriod(group) === period).length;
        if (period === 'other' && !count && selected !== 'other') return '';
        return `<button type="button" class="clinic-print-period-card${selected === period ? ' clinic-print-period-card--active' : ''}" data-exam-period="${period}" aria-pressed="${selected === period}" onclick="clinicPrintSetExamPeriodFilter('${safeClassId}','${period}')"><span>${label}</span><small>${count}개</small></button>`;
    }).join('');
}

function clinicPrintGetExamYear(group = {}) {
    for (const value of [String(group.archiveFile || '').split(/[\\/]/).pop(), group.examTitle]) {
        const match = String(value || '').match(/^(20\d{2}|\d{2})(?=[_\s])/);
        if (match) return match[1].length === 2 ? '20' + match[1] : match[1];
    }
    return String(group.examDate || '').slice(0, 4);
}

function clinicPrintGetExamYearFilter(classId) {
    const key = String(classId);
    if (clinicPrintExamYearFilters.has(key)) return clinicPrintExamYearFilters.get(key);
    let stored = '';
    try { stored = localStorage.getItem(`AP_CLINIC_EXAM_YEAR:${key}`) || ''; } catch (error) {}
    const groups = clinicPrintGetClassExamGroups(classId, 'grade');
    const period = clinicPrintGetExamPeriodFilter(classId);
    const matching = groups.filter(group => period === 'all' || clinicPrintGetExamPeriod(group) === period);
    const years = [...new Set((matching.length ? matching : groups).map(clinicPrintGetExamYear).filter(year => /^20\d{2}$/.test(year)))].sort().reverse();
    const value = stored === 'all' || /^20\d{2}$/.test(stored) ? stored : years[0] || 'all';
    clinicPrintExamYearFilters.set(key, value);
    return value;
}

function clinicPrintRenderExamYearOptions(classId) {
    const selected = clinicPrintGetExamYearFilter(classId);
    const years = [...new Set(clinicPrintGetClassExamGroups(classId, 'grade').map(clinicPrintGetExamYear).filter(year => /^20\d{2}$/.test(year)))].sort().reverse();
    if (selected !== 'all' && !years.includes(selected)) years.unshift(selected);
    return ['all', ...years].map(year => `<option value="${year}"${year === selected ? ' selected' : ''}>${year === 'all' ? '전체 연도' : year + '년'}</option>`).join('');
}

function clinicPrintSetExamYearFilter(classId, year) {
    if (year !== 'all' && !/^20\d{2}$/.test(year)) return;
    clinicPrintExamYearFilters.set(String(classId), year);
    try { localStorage.setItem(`AP_CLINIC_EXAM_YEAR:${classId}`, year); } catch (error) {}
    clinicPrintUpdateExamList(classId);
    clinicPrintOnExamChange(classId);
}

function clinicPrintSetExamPeriodFilter(classId, period) {
    if (!AP_CLINIC_EXAM_PERIODS.some(([id]) => id === period)) return;
    clinicPrintExamPeriodFilters.set(String(classId), period);
    try { localStorage.setItem(`AP_CLINIC_EXAM_PERIOD:${classId}`, period); } catch (error) {}
    clinicPrintUpdateExamList(classId);
    clinicPrintOnExamChange(classId);
}

function clinicPrintRenderExamListHtml(classId, scope = 'class') {
    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        return `<div class="clinic-print-empty">${clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId))}</div>`;
    }
    const period = clinicPrintGetExamPeriodFilter(classId);
    const year = clinicPrintGetExamYearFilter(classId);
    const groups = clinicPrintGetClassExamGroups(classId, scope)
        .filter(group => (period === 'all' || clinicPrintGetExamPeriod(group) === period) && (year === 'all' || clinicPrintGetExamYear(group) === year));
    const printableGroups = groups.filter(group => group.printable);
    const currentClassPrintableGroups = printableGroups.filter(group => (group.sourceClassIds || []).map(String).includes(String(classId)));
    const initialSource = scope === 'grade' ? printableGroups : (currentClassPrintableGroups.length ? currentClassPrintableGroups : printableGroups);
    const groupKeys = new Set(groups.map(group => group.examKey));
    const currentChecked = new Set(clinicPrintGetCheckedValues('clinic-print-exam').filter(key => groupKeys.has(key)));
    const initialKeys = currentChecked.size ? currentChecked : new Set(scope === 'grade'
        ? initialSource.map(group => group.examKey) : (initialSource.length ? [initialSource[0].examKey] : []));
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

    if (!groups.length) return '<div class="clinic-print-empty">선택한 기간의 시험이 없습니다. 다른 기간 또는 전체를 선택하세요.</div>';

    return groups.map(group => {
        const disabled = group.printable ? '' : 'disabled';
        const checked = initialKeys.has(group.examKey) ? 'checked' : '';
        const safeExamKey = clinicPrintEscapeJsString(group.examKey || '');
        const displayTitle = clinicPrintGetExamGroupDisplayTitle(group);
        // 학년 행은 여러 반/날짜를 합친 통계다. 개별 시험 삭제는 반 범위에서 처리한다.
        const currentClassAssignment = scope === 'class' ? (group.assignments || [])
            .find(row => String(row.class_id || '') === String(classId || '') && row.can_manage !== false) : null;
        const deleteDisplay = currentClassAssignment ? '' : ' style="--clinic-print-delete-display:none;"';
        const status = group.printable
            ? `${group.questionCount || '-'}문항 · 제출 ${group.sessions.length}명 · 오답 ${group.wrongCount}문항`
            : '원문 연결 불가';
        const metaCls = group.printable ? 'clinic-print-exam-row__meta' : 'clinic-print-exam-row__meta clinic-print-exam-row__meta--error';
        return `
            <label class="clinic-print-exam-row${group.printable ? '' : ' clinic-print-exam-row--disabled'}"${deleteDisplay}>
                <input type="checkbox" class="clinic-print-exam-row__check" name="clinic-print-exam" value="${clinicPrintEscapeAttr(group.examKey)}" ${checked} ${disabled} onchange="clinicPrintOnExamChange('${safeClassIdForJs}')">
                <span class="clinic-print-exam-row__main">
                    <span class="clinic-print-exam-row__title">${clinicPrintEscapeHtml(displayTitle)}</span>
                    <span class="${metaCls}">${clinicPrintEscapeHtml(status)}</span>
                </span>
                <button type="button" class="btn apms-button apms-button--quiet btn-danger clinic-print-exam-row__delete" title="시험 삭제" onclick="event.preventDefault(); event.stopPropagation(); clinicPrintDeleteExamGroup('${safeClassIdForJs}','${safeExamKey}')">삭제</button>
            </label>
        `;
    }).join('');
}

function clinicPrintUpdateExamList(classId) {
    const root = document.getElementById('clinic-print-exam-list');
    if (!root) return;
    root.innerHTML = clinicPrintRenderExamListHtml(classId, clinicPrintGetExamListScope());
    const gradeWindow = document.getElementById('clinic-print-grade-window');
    if (gradeWindow) {
        gradeWindow.hidden = clinicPrintGetExamListScope() !== 'grade';
        gradeWindow.innerHTML = clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId)) +
            (clinicPrintGradeData.get(String(classId))?.status === 'error'
                ? ` <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintRetryGradeData('${clinicPrintEscapeJsString(classId)}')">다시 불러오기</button>` : '');
    }
    const filters = document.getElementById('clinic-print-exam-period-filters');
    if (filters) filters.innerHTML = clinicPrintRenderExamPeriodFilters(classId, clinicPrintGetExamListScope());
    const year = document.getElementById('clinic-print-exam-year');
    if (year) year.innerHTML = clinicPrintRenderExamYearOptions(classId);
}

async function openClinicPrintCenter(classId, options = {}) {
    clinicPrintActiveClassId = classId;
    clinicPrintTypeState.unitSelection = [];
    clinicPrintTypeState.dragKey = null;
    const cls = clinicPrintGetClass(classId);
    if (!options.skipAssignmentRefresh) {
        await clinicPrintRefreshClassAssignments(classId);
        await clinicPrintRefreshGradeClinicData(classId);
    }
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);
    const examHtml = clinicPrintRenderExamListHtml(classId, 'class');

    showModal('오답 클리닉 출력 센터', `
        <div class="clinic-print-layout">
        <div class="clinic-print-layout__controls">
        <div class="clinic-print-shell">
            <div class="clinic-print-summary-card">
                <div class="clinic-print-summary-card__title">${clinicPrintEscapeHtml(cls?.name || '반')}</div>
                <div id="clinic-print-summary" class="clinic-print-summary-card__meta">선택 시험 0개 · 오답 학생 0명 · 오답 0문항</div>
            </div>

            <section class="clinic-print-section">
                <div class="clinic-print-section-title">출제 기준</div>
                <div id="clinic-print-mode-cards" class="clinic-print-mode-grid">
                    <label class="clinic-print-mode-card clinic-print-mode-card--active" data-mode="student">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="student" checked onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">학생</span>
                        <span class="clinic-print-mode-card__sub">학생별 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="class">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="class" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">반</span>
                        <span class="clinic-print-mode-card__sub">반별 공통 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="grade">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="grade" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">학년</span>
                        <span class="clinic-print-mode-card__sub">학년별 공통 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="type">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="type" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">유형</span>
                        <span class="clinic-print-mode-card__sub">최다빈출·단원별</span>
                    </label>
                </div>
            </section>

            <section class="clinic-print-section">
                <div id="clinic-print-grade-window" class="clinic-print-note" aria-live="polite" hidden></div>
                <div class="clinic-print-period-heading">
                    <div class="clinic-print-section-title">학기별 시험 선택</div>
                    <select id="clinic-print-exam-year" aria-label="시험 연도" onchange="clinicPrintSetExamYearFilter('${safeClassIdForJs}',this.value)">${clinicPrintRenderExamYearOptions(classId)}</select>
                </div>
                <div id="clinic-print-exam-period-filters" class="clinic-print-period-grid" role="group" aria-label="학기별 시험 필터">${clinicPrintRenderExamPeriodFilters(classId, 'class')}</div>
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">시험 목록</div>
                    <button type="button" class="clinic-print-mini-btn" onclick="document.querySelectorAll('input[name=\\'clinic-print-exam\\']:not(:disabled)').forEach(el=>el.checked=true); clinicPrintOnExamChange('${safeClassIdForJs}');">전체 선택</button>
                </div>
                <div id="clinic-print-exam-list" class="clinic-print-exam-list">${examHtml}</div>
            </section>

            <section id="clinic-print-type-panel" class="clinic-print-type-panel" style="display:none;">
                <input type="hidden" id="clinic-print-type-mode" value="frequent">
                <input type="hidden" id="clinic-print-type-scope" value="class">

                <div class="clinic-print-field">
                    <div class="clinic-print-section-title">범위</div>
                    <div id="clinic-print-type-scope-toggle" class="clinic-print-scope-grid">
                        <button type="button" class="clinic-print-scope-btn clinic-print-scope-btn--active" data-scope="class" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','class')">현재 반</button>
                        <button type="button" class="clinic-print-scope-btn" data-scope="grade" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','grade')">같은 학년 전체</button>
                    </div>
                </div>

                <div class="clinic-print-field">
                    <div class="clinic-print-section-title">유형 선택</div>
                    <div id="clinic-print-type-cards" class="clinic-print-type-grid">
                        <button type="button" class="clinic-print-type-card clinic-print-type-card--active" data-type-mode="frequent" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','frequent')">
                            <span class="clinic-print-type-card__title">최다빈출</span>
                            <span class="clinic-print-type-card__sub">정답률 50% 초과<br>반복 오답 문항</span>
                        </button>
                        <button type="button" class="clinic-print-type-card" data-type-mode="mostWrong" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','mostWrong')">
                            <span class="clinic-print-type-card__title">최다오답</span>
                            <span class="clinic-print-type-card__sub">정답률 50% 이하<br>다수 취약 문항</span>
                        </button>
                        <button type="button" class="clinic-print-type-card" data-type-mode="unit" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','unit')">
                            <span class="clinic-print-type-card__title">단원별 오답</span>
                            <span class="clinic-print-type-card__sub">마스터 단원 기준<br>선택 출력</span>
                        </button>
                    </div>
                </div>

                <div id="clinic-print-type-result"></div>
            </section>

            <section id="clinic-print-student-section" class="clinic-print-section">
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">출제할 학생 선택</div>
                    <div class="clinic-print-mini-btn-group">
                        <button type="button" class="clinic-print-mini-btn" onclick="document.querySelectorAll('input[name=\\'clinic-print-student\\']').forEach(el=>el.checked=true); clinicPrintSchedulePreviewPush('${safeClassIdForJs}');">전체 선택</button>
                        <button type="button" class="clinic-print-mini-btn" onclick="document.querySelectorAll('input[name=\\'clinic-print-student\\']').forEach(el=>el.checked=false); clinicPrintSchedulePreviewPush('${safeClassIdForJs}');">전체 해제</button>
                    </div>
                </div>
                <div id="clinic-print-student-list" class="clinic-print-student-list"></div>
            </section>

            <section class="clinic-print-section clinic-print-header-card">
                <input type="hidden" id="clinic-print-header-title-dirty" value="0">
                <div class="clinic-print-section-title">인쇄 설정</div>
                <label class="clinic-print-header-field">
                    <span>제목</span>
                    <input id="clinic-print-header-title" class="clinic-print-header-input" type="text" maxlength="80" value="${clinicPrintEscapeAttr(clinicPrintGetHeaderDefaultTitle(classId))}" oninput="clinicPrintSetHeaderTitleDirty(true)">
                </label>
                <label class="clinic-print-header-field">
                    <span>부제목 <span class="clinic-print-section-title--soft">(비우면 반·시험 자동 입력)</span></span>
                    <input id="clinic-print-header-subtitle" class="clinic-print-header-input" type="text" maxlength="120" placeholder="선택 입력">
                </label>
                <div class="clinic-print-note">제목·보조 문구는 우측 미리보기 헤더를 직접 클릭해서도 수정할 수 있어요. 이름·점수·날짜는 1페이지 헤더에 자동 입력되고, 2페이지부터는 작은 이름표가 붙습니다.</div>
                <div class="clinic-print-header-checks">
                    <label><input id="clinic-print-header-name" type="checkbox" checked> 이름칸</label>
                    <label><input id="clinic-print-header-score" type="checkbox" checked> 점수칸</label>
                    <label><input id="clinic-print-header-date" type="checkbox"> 날짜</label>
                    <label><input id="clinic-print-header-sol" type="checkbox" checked> 해설지 포함</label>
                    <label><input id="clinic-print-header-ans" type="checkbox" checked> 정답표 포함</label>
                </div>
            </section>

            <div class="clinic-print-actions">
                <button id="clinic-print-preview-btn" type="button" class="btn apms-button apms-button--quiet clinic-print-submit" onclick="clinicPrintPreview('${safeClassIdForJs}')">미리보기</button>
                <button id="clinic-print-submit-btn" type="button" class="btn apms-button apms-button--primary btn-primary clinic-print-submit" onclick="clinicPrintSubmit('${safeClassIdForJs}')">출제하기</button>
            </div>
        </div>
        </div>
        <div class="clinic-print-layout__preview" aria-label="출력 미리보기">
            <iframe id="clinic-print-preview-frame" title="출력 미리보기" src="wrong_print_engine.html?preview=1"></iframe>
        </div>
        </div>
    `);

    document.getElementById('modal-content')?.classList.add('clinic-print-fullscreen');
    document.getElementById('clinic-print-preview-frame')?.addEventListener('load', () => {
        clinicPrintSchedulePreviewPush(classId, 0);
    });
    document.querySelectorAll('#clinic-print-header-title, #clinic-print-header-subtitle').forEach(input => {
        input.addEventListener('input', () => clinicPrintSchedulePreviewPush(classId));
    });
    document.querySelectorAll('#clinic-print-header-name, #clinic-print-header-score, #clinic-print-header-date, #clinic-print-header-sol, #clinic-print-header-ans').forEach(input => {
        input.addEventListener('change', () => clinicPrintSchedulePreviewPush(classId));
    });
    setTimeout(() => clinicPrintSwitchMode(classId), 0);
}
