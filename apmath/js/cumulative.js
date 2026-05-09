/**
 * AP Math OS [cumulative.js]
 * 출석부 + 성적표
 * [Attendance] 월간 출석부 / 출석 셀 클릭 저장 / 클래스룸 상태 동기화 / 인디케이터(Dot) 연동
 * [School Exam] 성적표: 기본/성적 정렬, 학년 필터, 평균 규칙, 직전 학기 대비 표시
 */

function getCumulativeClassIdForStudent(studentId) {
    const mapping = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return mapping ? String(mapping.class_id) : '';
}

function getCumulativeClassName(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    return cls ? cls.name : '';
}

function getCumulativeStudent(studentId) {
    return (state.db.students || []).find(s => String(s.id) === String(studentId));
}

function getCumulativeExamTypeLabel(type) {
    const map = { midterm: '중간', final: '기말', performance: '수행', etc: '기타' };
    return map[type] || type || '기타';
}

function getCumulativeGradeRankText(value) {
    const text = String(value || '');
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function normalizeSebTeacherName(name) {
    const t = String(name || '').trim().replace(/\s*선생님\s*$/g, '').toLowerCase();
    if (t === '선생님1' || t === 'teacher1' || t === 't1') return '박준성';
    if (t === '박준성') return '박준성';
    return String(name || '').trim().replace(/\s*선생님\s*$/g, '');
}


var CUMULATIVE_ATTENDANCE_TEACHERS = ['박준성', '정겨운', '정의한'];

function isCumulativeAdminUser() {
    return !!(state && state.auth && (
        state.auth.role === 'admin' ||
        state.auth.id === 't_admin' ||
        state.auth.login_id === 'admin' ||
        state.auth.loginId === 'admin'
    ));
}

function getCumulativeAttendanceTeacherFilter() {
    if (!isCumulativeAdminUser()) return '';
    return normalizeSebTeacherName(state.ui?.attendanceLedgerTeacher || '');
}

function isCumulativeHighClass(cls) {
    return /고1|고2|고3|고등/.test(String(cls?.grade || '') + ' ' + String(cls?.name || ''));
}

function isCumulativeAttendanceClassForTeacher(cls, teacherName) {
    const teacher = normalizeSebTeacherName(teacherName || '');
    if (!teacher) return true;
    return normalizeSebTeacherName(cls?.teacher_name || '') === teacher;
}

function getCumulativeAttendanceFilteredClasses(section = '', teacherName = '') {
    let classes = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const teacher = normalizeSebTeacherName(teacherName || '');

    if (teacher) {
        classes = classes.filter(c => isCumulativeAttendanceClassForTeacher(c, teacher));
    }

    if (section) {
        classes = classes.filter(c => {
            const isHigh = isCumulativeHighClass(c);
            return section === 'high' ? isHigh : !isHigh;
        });
    }

    return classes;
}

function buildCumulativeAttendanceTeacherOptions(selectedTeacher = '') {
    const selected = normalizeSebTeacherName(selectedTeacher || '');
    return '<option value="">전체 선생님</option>' + CUMULATIVE_ATTENDANCE_TEACHERS
        .map(t => `<option value="${apEscapeHtml(t)}"${selected === t ? ' selected' : ''}>${apEscapeHtml(t)}</option>`)
        .join('');
}

function getCumulativeVisibleStudents(filters = {}) {
    let students = (state.db.students || []).filter(s => s.status === '재원');

    if (filters.classId) {
        const ids = (state.db.class_students || [])
            .filter(m => String(m.class_id) === String(filters.classId))
            .map(m => String(m.student_id));
        students = students.filter(s => ids.includes(String(s.id)));
    }

    if (filters.grade) {
        students = students.filter(s => String(s.grade || '').includes(filters.grade));
    }

    return students.sort((a, b) => {
        const gradeDiff = getCumulativeGradeRankText(a.grade) - getCumulativeGradeRankText(b.grade);
        if (gradeDiff !== 0) return gradeDiff;

        const aClass = getCumulativeClassName(getCumulativeClassIdForStudent(a.id));
        const bClass = getCumulativeClassName(getCumulativeClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko', { numeric: true });
        if (classDiff !== 0) return classDiff;

        return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
    });
}

function sortCumulativeClasses(classes = []) {
    return [...classes].sort((a, b) => {
        const gradeDiff = getCumulativeGradeRankText(a.grade || a.name) - getCumulativeGradeRankText(b.grade || b.name);
        if (gradeDiff !== 0) return gradeDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
    });
}

function sortCumulativeStudents(students = []) {
    return [...students].sort((a, b) => {
        const aClass = getCumulativeClassName(getCumulativeClassIdForStudent(a.id));
        const bClass = getCumulativeClassName(getCumulativeClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko', { numeric: true });
        if (classDiff !== 0) return classDiff;

        const gradeDiff = getCumulativeGradeRankText(a.grade) - getCumulativeGradeRankText(b.grade);
        if (gradeDiff !== 0) return gradeDiff;

        return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
    });
}

function getMonthDays(month) {
    const m = String(month || '').trim();
    if (!/^\d{4}-\d{2}$/.test(m)) return [];
    const [year, monthNo] = m.split('-').map(Number);
    const endDay = new Date(year, monthNo, 0).getDate();
    return Array.from({ length: endDay }, (_, idx) => `${m}-${String(idx + 1).padStart(2, '0')}`);
}


function getAttendanceLedgerTodayStr() {
    return typeof getTodayStr === 'function' ? getTodayStr() : new Date().toLocaleDateString('sv-SE');
}

function normalizeAttendanceLedgerDate(value) {
    if (typeof normalizeDateStr === 'function') return normalizeDateStr(value);
    const s = String(value || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function getAttendanceLedgerSelectedDate() {
    const today = getAttendanceLedgerTodayStr();
    const safe = normalizeAttendanceLedgerDate(state.ui?.attendanceLedgerDate || '');
    return safe || today;
}

function setAttendanceLedgerDate(dateStr) {
    const safe = normalizeAttendanceLedgerDate(dateStr) || getAttendanceLedgerTodayStr();
    if (!state.ui) state.ui = {};
    state.ui.attendanceLedgerDate = safe;
    state.ui.attendanceLedgerMonth = safe.slice(0, 7);
}

function mergeAttendanceLedgerDateRecords(date, attendanceRows = [], homeworkRows = []) {
    const d = normalizeAttendanceLedgerDate(date);
    if (!d) return;

    if (!state.db.attendance) state.db.attendance = [];
    if (!state.db.homework) state.db.homework = [];
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};

    const month = d.slice(0, 7);
    if (!state.ui.monthlyAttendanceCache[month]) {
        state.ui.monthlyAttendanceCache[month] = { month, attendance: [], homework: [], academy_schedules: [] };
    }
    const cache = state.ui.monthlyAttendanceCache[month];
    if (!Array.isArray(cache.attendance)) cache.attendance = [];
    if (!Array.isArray(cache.homework)) cache.homework = [];

    const mergeRows = function(target, rows) {
        if (!Array.isArray(target) || !Array.isArray(rows)) return;
        rows.forEach(row => {
            if (!row || String(row.date || '') !== d) return;
            const sid = String(row.student_id || row.studentId || '');
            if (!sid) return;
            const idx = target.findIndex(item => String(item.student_id) === sid && String(item.date || '') === d);
            const nextRow = { ...row, student_id: sid, date: d };
            if (idx > -1) target[idx] = { ...target[idx], ...nextRow };
            else target.push(nextRow);
        });
    };

    mergeRows(state.db.attendance, attendanceRows);
    mergeRows(state.db.homework, homeworkRows);
    mergeRows(cache.attendance, attendanceRows);
    mergeRows(cache.homework, homeworkRows);
}

async function loadAttendanceLedgerDateData(date, force = false) {
    const d = normalizeAttendanceLedgerDate(date);
    if (!d) return false;
    const month = d.slice(0, 7);

    await loadMonthlyAttendance(month, force);

    if (!state.ui) state.ui = {};
    if (!state.ui.attendanceLedgerDateCache) state.ui.attendanceLedgerDateCache = {};
    if (!force && state.ui.attendanceLedgerDateCache[d]) return true;

    try {
        const data = await api.get(`attendance-history?date=${encodeURIComponent(d)}`);
        const attendanceRows = Array.isArray(data.attendance) ? data.attendance : [];
        const homeworkRows = Array.isArray(data.homework) ? data.homework : [];
        mergeAttendanceLedgerDateRecords(d, attendanceRows, homeworkRows);
        state.ui.attendanceLedgerDateCache[d] = true;
        return true;
    } catch (e) {
        console.warn('[loadAttendanceLedgerDateData] failed:', e);
        return false;
    }
}

function scrollAttendanceLedgerToSelectedDate() {
    const date = getAttendanceLedgerSelectedDate();
    const wrap = document.getElementById('att-tbl-wrap');
    const target = document.querySelector(`#att-tbl th[data-date="${date}"]`);
    if (!wrap || !target) return;

    const targetLeft = target.offsetLeft;
    const stickyWidth = document.querySelector('#att-tbl .att-nc')?.offsetWidth || 90;
    wrap.scrollLeft = Math.max(targetLeft - stickyWidth - 12, 0);
}

async function changeAttendanceLedgerDate(dateStr) {
    const safeDate = normalizeAttendanceLedgerDate(dateStr);
    if (!safeDate) {
        toast('날짜를 선택하세요.', 'warn');
        return;
    }

    setAttendanceLedgerDate(safeDate);

    const monthInput = document.getElementById('att-mon');
    if (monthInput) monthInput.value = safeDate.slice(0, 7);

    await loadAttendanceLedgerDateData(safeDate, true);
    renderAttendanceLedgerTable();
}

async function changeAttendanceLedgerMonth(monthStr) {
    const safeMonth = String(monthStr || '').trim();
    if (!/^\d{4}-\d{2}$/.test(safeMonth)) return;

    if (!state.ui) state.ui = {};
    state.ui.attendanceLedgerMonth = safeMonth;

    const selected = normalizeAttendanceLedgerDate(state.ui.attendanceLedgerDate || '');
    if (!selected || selected.slice(0, 7) !== safeMonth) {
        state.ui.attendanceLedgerDate = `${safeMonth}-01`;
    }

    await loadAttendanceLedgerDateData(state.ui.attendanceLedgerDate, true);
    renderAttendanceLedgerTable();
}

async function loadMonthlyAttendance(month, force = false) {
    const safeMonth = String(month || new Date().toLocaleDateString('sv-SE').slice(0, 7)).trim();

    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    if (!force && state.ui.monthlyAttendanceCache[safeMonth]) {
        return state.ui.monthlyAttendanceCache[safeMonth];
    }

    const data = await api.get(`attendance-month?month=${encodeURIComponent(safeMonth)}`);
    const payload = data?.success ? {
        month: safeMonth,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        academy_schedules: Array.isArray(data.academy_schedules) ? data.academy_schedules : []
    } : {
        month: safeMonth,
        attendance: [],
        homework: [],
        academy_schedules: []
    };

    state.ui.monthlyAttendanceCache[safeMonth] = payload;
    return payload;
}

function getMonthlyAttendanceData() {
    const month = state.ui.attendanceLedgerMonth ||
        state.ui.monthlyAttendanceMonth ||
        new Date().toLocaleDateString('sv-SE').slice(0, 7);

    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    return state.ui.monthlyAttendanceCache[month] || {
        month,
        attendance: [],
        homework: [],
        academy_schedules: []
    };
}

function isAttendanceClassDay(studentId, date) {
    const classId = getCumulativeClassIdForStudent(studentId);
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    if (!cls) return false;

    const days = String(cls.schedule_days || '').split(',').map(v => v.trim()).filter(Boolean);
    if (!days.length) return false;

    const day = new Date(date + 'T00:00:00').getDay();
    return days.includes(String(day));
}

function getMonthlyAttendanceStatus(studentId, date) {
    const data = getMonthlyAttendanceData();
    const sid = String(studentId);
    const attendance = (data.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === date);
    const homework = (data.homework || []).find(h => String(h.student_id) === sid && String(h.date || '') === date);

    return {
        attendance: attendance?.status || (isAttendanceClassDay(studentId, date) ? '등원' : ''),
        homework: homework?.status || ''
    };
}

function getMonthlyAttendanceRecord(studentId, date) {
    const data = getMonthlyAttendanceData();
    const sid = String(studentId);
    return (data.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === date) || null;
}

/**
 * [Indicator] 출결 메타 데이터 통합 조회 함수
 */
function getAttendanceMetaForCumulative(studentId, date) {
    const sid = String(studentId);
    const data = getMonthlyAttendanceData();

    // 1. 월간 캐시 우선 조회
    const monthlyRecord = (data.attendance || []).find(a =>
        String(a.student_id) === sid &&
        String(a.date || '') === String(date)
    );

    // 2. 캐시 부재 시 state.db Fallback
    const todayRecord = (state.db.attendance || []).find(a =>
        String(a.student_id) === sid &&
        String(a.date || '') === String(date)
    );

    const record = monthlyRecord || todayRecord || null;
    const status = record?.status || '';

    const tags = String(record?.tags || '')
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);

    const memo = String(record?.memo || '').trim();

    // 3. 상담 데이터 연동 (consultations 매칭)
    const hasConsultation = status === '상담' || (state.db.consultations || []).some(c =>
        String(c.student_id) === sid &&
        String(c.date || '').slice(0, 10) === String(date)
    );

    return {
        record,
        tags,
        memo,
        hasLate: tags.includes('지각') || status === '지각',
        hasMakeup: tags.includes('보강') || status === '보강',
        hasConsultation
    };
}

/**
 * [Indicator] 셀 내부 Dot 인디케이터 렌더링 함수
 */
function renderAttendanceMetaDotsForCumulative(studentId, date) {
    const meta = getAttendanceMetaForCumulative(studentId, date);
    const dots = [];

    // 태그 및 상담 상태별 점 색상 정의
    if (meta.hasLate) dots.push('<span style="width:4px;height:4px;border-radius:999px;background:#f59f00;display:inline-block;"></span>');
    if (meta.hasMakeup) dots.push('<span style="width:4px;height:4px;border-radius:999px;background:var(--primary);display:inline-block;"></span>');
    if (meta.hasConsultation) dots.push('<span style="width:4px;height:4px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>');

    if (!dots.length) return '';

    return `<span style="position:absolute;right:2px;bottom:2px;display:flex;gap:2px;align-items:center;justify-content:flex-end;pointer-events:none;">${dots.join('')}</span>`;
}

function syncMonthlyAttendanceMetaToState(studentId, date, patch = {}) {
    const sid = String(studentId);
    const applyPatch = function(list) {
        if (!Array.isArray(list)) return null;
        let rec = list.find(a => String(a.student_id) === sid && String(a.date || '') === date);
        if (!rec) {
            rec = { student_id: sid, date, status: patch.status || '미기록', tags: '', memo: '' };
            list.push(rec);
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'status')) rec.status = patch.status;
        if (Object.prototype.hasOwnProperty.call(patch, 'tags')) rec.tags = patch.tags;
        if (Object.prototype.hasOwnProperty.call(patch, 'memo')) rec.memo = patch.memo;
        if (Object.prototype.hasOwnProperty.call(patch, 'updated_at')) rec.updated_at = patch.updated_at;
        return rec;
    };

    if (!state.db.attendance) state.db.attendance = [];
    const dbRec = applyPatch(state.db.attendance);

    const month = String(date || '').slice(0, 7);
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    if (state.ui.monthlyAttendanceCache[month]) {
        if (!state.ui.monthlyAttendanceCache[month].attendance) state.ui.monthlyAttendanceCache[month].attendance = [];
        applyPatch(state.ui.monthlyAttendanceCache[month].attendance);
    }

    return dbRec;
}

const HOLIDAYS_2026 = [
    '2026-01-01',
    '2026-02-16', '2026-02-17', '2026-02-18',
    '2026-03-01', '2026-03-02',
    '2026-05-01',
    '2026-05-05',
    '2026-05-24', '2026-05-25',
    '2026-06-06',
    '2026-07-17',
    '2026-08-15', '2026-08-17',
    '2026-09-24', '2026-09-25', '2026-09-26',
    '2026-10-03', '2026-10-05',
    '2026-10-09',
    '2026-12-25'
];

function isFixedHoliday(dateStr) {
    return HOLIDAYS_2026.includes(dateStr);
}

function getMonthlyScheduleBadges(studentId, date) {
    const data = getMonthlyAttendanceData();
    const sid = String(studentId);
    const schedules = (data.academy_schedules || []).filter(s => {
        if (String(s.is_deleted || 0) === '1') return false;
        if (String(s.schedule_date || '') !== date) return false;
        if (s.target_scope === 'student') return String(s.student_id || '') === sid;
        return true;
    });

    const isFixed = isFixedHoliday(date);
    return {
        globalClosed: isFixed || schedules.some(s => s.schedule_type === 'closed' && s.target_scope !== 'student'),
        studentClosed: schedules.some(s => s.schedule_type === 'closed' && s.target_scope === 'student'),
        makeup: schedules.some(s => s.schedule_type === 'makeup' && s.target_scope === 'student'),
        consultation: schedules.some(s => s.schedule_type === 'consultation' && s.target_scope === 'student')
    };
}

function getAttendanceStudentJoinedDate(student) {
    if (!student) return '';

    const raw = String(
        student.join_date ||
        student.joined_at ||
        student.enrolled_at ||
        student.enrollment_date ||
        student.registered_at ||
        student.registration_date ||
        student.created_at ||
        student.createdAt ||
        ''
    ).trim();

    const m = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!m) return '';

    return [m[1], String(m[2]).padStart(2, '0'), String(m[3]).padStart(2, '0')].join('-');
}

function isAttendanceNewStudent(student) {
    const joined = getAttendanceStudentJoinedDate(student);
    if (!joined) return false;
    return joined >= `${new Date().getFullYear()}-06-01`;
}

function isAttendanceLeaveStudent(student) {
    return !!(student && (student.status === '휴원' || String(student.memo || '').includes('#휴원')));
}

function getAttendanceStudentNameStyle(student) {
    if (isAttendanceLeaveStudent(student)) return 'color:#FF8C00;';
    if (isAttendanceNewStudent(student)) return 'color:var(--primary);';
    return 'color:var(--text);';
}

function _attDayName(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
}

function _attDayStyle(dateStr) {
    const day = new Date(dateStr + 'T00:00:00').getDay();
    if (day === 0) return 'color:#e53935;';
    if (day === 6) return 'color:#1565c0;';
    return 'color:var(--secondary);';
}

function goAttendanceHome() {
    closeAttendanceLedger();
    closeSchoolExamLedger();

    if (typeof state !== 'undefined' && state.ui) {
        state.ui.currentClassId = null;
        state.ui.returnView = null;
    }

    if (typeof goHome === 'function') {
        goHome();
        return;
    }

    if (state?.auth?.role === 'admin' && typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
        return;
    }

    if (typeof renderDashboard === 'function') renderDashboard();
}

function closeAttendanceLedger() {
    if (typeof leaveTimetableWideMode === 'function') leaveTimetableWideMode();
}

function openEditStudentFromAttendance(sid) {
    state.ui.returnView = { type: 'attendance' };
    if (typeof openEditStudent === 'function') {
        openEditStudent(sid, { returnTo: { type: 'attendance' } });
    }
}

function openAddStudentFromAttendance(classId) {
    state.ui.returnView = { type: 'attendance' };
    if (typeof openAddStudent === 'function') {
        openAddStudent(classId, { returnTo: { type: 'attendance' } });
    }
}

/**
 * [Rendering] 출석 셀 내용 렌더링 (Status 표시 + Dot 인디케이터 결합)
 */
function renderAttendanceCellContent(studentId, date) {
    const schedule = getMonthlyScheduleBadges(studentId, date);
    const isHol = schedule.globalClosed || schedule.studentClosed;
    const today = new Date().toLocaleDateString('sv-SE');

    if (date > today) return '';

    const meta = getAttendanceMetaForCumulative(studentId, date);
    const status = meta.record?.status || '';
    const isClassDay = isAttendanceClassDay(studentId, date);

    let statusHtml = '';

    if (!isHol && !isClassDay) {
        statusHtml = '<span class="att-sign" style="font-size:12px;font-weight:700;color:var(--border);">-</span>';
    } else if (isHol && (!status || status === '미기록')) {
        statusHtml = '';
    } else if (status === '결석') {
        statusHtml = '<span class="att-sign" style="font-size:14px;font-weight:800;color:#e53935;">×</span>';
    } else if (status === '수업 없음' || status === '미기록') {
        statusHtml = '<span class="att-sign" style="font-size:12px;font-weight:700;color:var(--border);">-</span>';
    } else if (status === '등원' || status === '지각' || status === '보강' || status === '상담') {
        statusHtml = '<span class="att-sign" style="font-size:14px;font-weight:800;color:var(--success);">○</span>';
    } else if (!status && isClassDay) {
        statusHtml = '<span class="att-sign" style="font-size:14px;font-weight:800;color:var(--success);">○</span>';
    } else {
        statusHtml = '<span class="att-sign" style="font-size:12px;font-weight:700;color:var(--border);">-</span>';
    }

    const dots = renderAttendanceMetaDotsForCumulative(studentId, date);
    // Relative wrapper를 통해 absolute dot의 기준점 확보
    return `<span style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:24px;">${statusHtml}${dots}</span>`;
}

function openAttendanceLedger() {
    if (!state.ui.attendanceLedgerDate) {
        setAttendanceLedgerDate(getAttendanceLedgerTodayStr());
    } else if (!state.ui.attendanceLedgerMonth) {
        state.ui.attendanceLedgerMonth = getAttendanceLedgerSelectedDate().slice(0, 7);
    }

    const root = document.getElementById('app-root');
    if (!root) return;

    const isAdmin = isCumulativeAdminUser();
    if (!isAdmin) state.ui.attendanceLedgerTeacher = '';
    if (state.ui.attendanceLedgerSection === undefined || state.ui.attendanceLedgerSection === null) state.ui.attendanceLedgerSection = '';
    if (state.ui.attendanceLedgerClassId === undefined || state.ui.attendanceLedgerClassId === null) state.ui.attendanceLedgerClassId = '';

    const teacherFilter = getCumulativeAttendanceTeacherFilter();
    const sectionFilter = state.ui.attendanceLedgerSection || '';
    let activeClasses = getCumulativeAttendanceFilteredClasses(sectionFilter, teacherFilter);

    if (state.ui.attendanceLedgerClassId && !activeClasses.some(c => String(c.id) === String(state.ui.attendanceLedgerClassId))) {
        state.ui.attendanceLedgerClassId = '';
    }

    const selectedClassId = state.ui.attendanceLedgerClassId || '';
    const classOptions = activeClasses
        .map(c => `<option value="${apEscapeHtml(c.id)}"${String(c.id) === String(selectedClassId) ? ' selected' : ''}>${apEscapeHtml(c.name)}</option>`)
        .join('');

    const teacherHtml = isAdmin
        ? `<select class="att-ctrl" id="att-teacher" onchange="state.ui.attendanceLedgerTeacher=this.value;state.ui.attendanceLedgerClassId='';openAttendanceLedger()">${buildCumulativeAttendanceTeacherOptions(teacherFilter)}</select>`
        : '';
    const selectedDate = getAttendanceLedgerSelectedDate();
    const todayStr = getAttendanceLedgerTodayStr();

    root.innerHTML = `
<style>
#att-main { width: 100%; max-width: 1150px; margin: 0 auto; height: calc(100vh - 56px); display: flex; flex-direction: column; padding: 12px 16px 0; box-sizing: border-box; }
#att-header-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; flex-shrink: 0; }
#att-title { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; white-space: nowrap; }
#att-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.att-ctrl { height: 36px; padding: 0 10px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.att-date-ctrl { min-width: 136px; }
.att-today-btn { color: var(--primary); background: rgba(26,92,255,0.07); border-color: rgba(26,92,255,0.16); font-weight: 800; }
.att-selected-date { background: rgba(26,92,255,0.08) !important; box-shadow: inset 0 0 0 1px rgba(26,92,255,0.16); }
.att-selected-date .att-sign { background: rgba(26,92,255,0.06); }
@media (max-width: 640px) { #att-controls { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .att-ctrl { width: 100%; min-width: 0; } .att-date-ctrl { min-width: 0; } .att-today-btn { padding-left: 8px; padding-right: 8px; } }
#att-legend { font-size: 11px; font-weight: 700; color: var(--secondary); display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; flex-shrink: 0; }
.att-legend-item { display: inline-flex; align-items: center; gap: 4px; min-height: 22px; padding: 2px 7px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); white-space: nowrap; line-height: 1; }
.att-legend-item b { font-size: 12px; font-weight: 800; color: var(--text); line-height: 1; }
.att-legend-dot { display: inline-block; width: 6px; height: 6px; border-radius: 999px; flex: 0 0 auto; box-shadow: 0 0 0 1px rgba(0,0,0,0.04); }
.att-legend-dot.late { background: #f59f00; }
.att-legend-dot.makeup { background: var(--primary); }
.att-legend-dot.consult { background: #7c3aed; }
#att-tbl-wrap { flex: 1; overflow: auto; border: 1px solid var(--border); border-radius: 12px 12px 0 0; background: var(--surface); }
#att-tbl { border-collapse: collapse; width: max-content; }
#att-tbl th, #att-tbl td { border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); text-align: center; }
#att-tbl thead th { position: sticky; top: 0; z-index: 10; background: var(--surface); box-shadow: 0 1px 0 var(--border); padding: 6px 0; }
.att-nc { position: sticky; left: 0; z-index: 11; background: var(--surface); border-right: 2px solid var(--border) !important; text-align: center; }
#att-tbl thead .att-nc { z-index: 12; }
/* Dot 배치 기준점 확보를 위해 relative 추가 */
.att-dc { position: relative; padding: 3px; text-align: center; width: 32px; min-width: 32px; cursor: pointer; user-select: none; }
.att-dc:active { opacity: .7; }
.att-no-class { cursor: default; background: var(--surface); }
.att-grp-row td { background: var(--surface-2); }
.att-grp-nc { position: sticky; left: 0; z-index: 11; background: var(--surface-2); font-size: 12px; font-weight: 800; color: var(--text); padding: 5px 12px; text-align: center; border-right: 2px solid var(--border) !important; }
.att-student-nc { padding: 4px 12px; min-width: 90px; text-align: center; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.att-student-nc:hover { background: var(--surface-2); }
.att-sign { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; }
.att-meta-dot { position: absolute; top: 3px; right: 3px; width: 5px; height: 5px; border-radius: 999px; background: var(--primary); box-shadow: 0 0 0 1px var(--surface); pointer-events: none; }
</style>
<div id="att-main">
  <div id="att-header-row">
    <div id="att-title">출석부</div>
    <div id="att-controls">
      <input type="date" class="att-ctrl att-date-ctrl" id="att-date" value="${apEscapeHtml(selectedDate)}" onchange="changeAttendanceLedgerDate(this.value)" title="출석부 기준일">
      <button type="button" class="att-ctrl att-today-btn" onclick="changeAttendanceLedgerDate('${apEscapeHtml(todayStr)}')">오늘</button>
      <input type="month" class="att-ctrl" id="att-mon" value="${apEscapeHtml(state.ui.attendanceLedgerMonth)}" onchange="changeAttendanceLedgerMonth(this.value)">
      ${teacherHtml}
      <select class="att-ctrl" id="att-sec" onchange="state.ui.attendanceLedgerSection=this.value;state.ui.attendanceLedgerClassId='';openAttendanceLedger()">
        <option value=""${sectionFilter === '' ? ' selected' : ''}>전체 (중/고)</option>
        <option value="middle"${sectionFilter === 'middle' ? ' selected' : ''}>중등부</option>
        <option value="high"${sectionFilter === 'high' ? ' selected' : ''}>고등부</option>
      </select>
      <select class="att-ctrl" id="att-cls" onchange="state.ui.attendanceLedgerClassId=this.value;renderAttendanceLedgerTable()">
        <option value="">전체 반</option>${classOptions}
      </select>
    </div>
  </div>
  <div id="att-legend">
    <span class="att-legend-item"><b>○</b> 등원</span>
    <span class="att-legend-item"><b>×</b> 결석</span>
    <span class="att-legend-item"><b>-</b> 수업 없음</span>
    <span class="att-legend-item"><i class="att-legend-dot late"></i> 지각</span>
    <span class="att-legend-item"><i class="att-legend-dot makeup"></i> 보강</span>
    <span class="att-legend-item"><i class="att-legend-dot consult"></i> 상담</span>
  </div>
  <div id="att-tbl-wrap"><div id="att-tbl-root"></div></div>
</div>`;

    loadAttendanceLedgerDateData(selectedDate, true).then(function() {
        renderAttendanceLedgerTable();
    });
}

function renderAttendanceLedgerTable() {
    const root = document.getElementById('att-tbl-root');
    if (!root) return;

    const month = state.ui.attendanceLedgerMonth || getAttendanceLedgerSelectedDate().slice(0, 7);
    const days = getMonthDays(month);
    const selectedDate = getAttendanceLedgerSelectedDate();
    const classId = state.ui.attendanceLedgerClassId || document.getElementById('att-cls')?.value || '';
    const section = state.ui.attendanceLedgerSection || document.getElementById('att-sec')?.value || '';
    const teacherFilter = getCumulativeAttendanceTeacherFilter();

    let activeClasses = getCumulativeAttendanceFilteredClasses(section, teacherFilter);
    const classAllowed = !classId || activeClasses.some(c => String(c.id) === String(classId));
    const safeClassId = classAllowed ? classId : '';
    if (!classAllowed) state.ui.attendanceLedgerClassId = '';

    const allowedClassIds = new Set(activeClasses.map(c => String(c.id)));
    const students = sortCumulativeStudents(getCumulativeVisibleStudents({ classId: safeClassId }))
        .filter(s => allowedClassIds.has(String(getCumulativeClassIdForStudent(s.id))));

    const grouped = activeClasses
        .filter(c => !safeClassId || String(c.id) === String(safeClassId))
        .map(cls => ({
            cls,
            students: students.filter(s => String(getCumulativeClassIdForStudent(s.id)) === String(cls.id))
        }))
        .filter(g => g.students.length);

    const headerCells = days.map(d => {
        const num = Number(d.slice(-2));
        const dayName = _attDayName(d);
        const style = _attDayStyle(d);
        const selectedClass = d === selectedDate ? ' class="att-selected-date"' : '';
        return `<th${selectedClass} data-date="${apEscapeHtml(d)}" style="width:32px;min-width:32px;${style}"><div style="font-size:11px;font-weight:700;line-height:1.2;text-align:center;">${num}</div><div style="font-size:10px;font-weight:600;line-height:1.2;text-align:center;">${dayName}</div></th>`;
    }).join('');

    const bodyRows = grouped.map(g => {
        const classEmptyCols = days.map(() => '<td></td>').join('');
        const groupRow = `<tr class="att-grp-row"><td class="att-grp-nc">${apEscapeHtml(g.cls.name)}</td>${classEmptyCols}</tr>`;

        const sRows = g.students.map(s => {
            const sid = String(s.id);
            const dateCells = days.map(d => {
                const sched = getMonthlyScheduleBadges(sid, d);
                const isHol = sched.globalClosed || sched.studentClosed;
                const isClassDay = isAttendanceClassDay(sid, d);
                const baseCls = (isHol || isClassDay) ? 'att-dc' : 'att-dc att-no-class';
                const cls = d === selectedDate ? `${baseCls} att-selected-date` : baseCls;
                const click = (isHol || isClassDay) ? `onclick="toggleAttendanceCellStatus('${sid}','${d}')"` : '';
                return `<td class="${cls}" id="att-cell-${sid}-${d}" data-date="${apEscapeHtml(d)}" ${click}>${renderAttendanceCellContent(sid, d)}</td>`;
            }).join('');

            const nameStyle = getAttendanceStudentNameStyle(s);
            return `<tr><td class="att-nc att-student-nc" style="${nameStyle}" onclick="openEditStudentFromAttendance('${sid}')">${apEscapeHtml(s.name)}</td>${dateCells}</tr>`;
        }).join('');

        const emptyCols = days.map(() => '<td></td>').join('');
        const emptyRow = `<tr onclick="openAddStudentFromAttendance('${apEscapeHtml(String(g.cls.id))}')" style="cursor:pointer;" onmouseover="this.style.background='rgba(26,92,255,0.04)'" onmouseout="this.style.background=''"><td class="att-nc att-student-nc" style="color:var(--secondary);text-align:center;font-size:15px;font-weight:800;">+</td>${emptyCols}</tr>`;

        return groupRow + sRows + emptyRow;
    }).join('');

    const empty = `<tr><td colspan="${days.length + 1}" style="padding:40px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;">표시할 학생이 없습니다.</td></tr>`;
    root.innerHTML = `<table id="att-tbl"><thead><tr><th class="att-nc" style="padding:6px 12px;min-width:90px;text-align:center;font-size:11px;font-weight:700;color:var(--secondary);">이름</th>${headerCells}</tr></thead><tbody>${bodyRows || empty}</tbody></table>`;
    requestAnimationFrame(scrollAttendanceLedgerToSelectedDate);
}

async function toggleAttendanceCellStatus(studentId, date) {
    const today = getAttendanceLedgerTodayStr();
    if (date > today) return;

    const sched = getMonthlyScheduleBadges(studentId, date);
    const isHol = sched.globalClosed || sched.studentClosed;
    if (!isHol && !isAttendanceClassDay(studentId, date)) return;

    const data = getMonthlyAttendanceData();
    if (!data.attendance) data.attendance = [];
    if (!state.db.attendance) state.db.attendance = [];

    const sid = String(studentId);
    const monthlyIndex = data.attendance.findIndex(a => String(a.student_id) === sid && String(a.date) === date);
    const dbIndex = state.db.attendance.findIndex(a => String(a.student_id) === sid && String(a.date) === date);
    const monthlyHadRecord = monthlyIndex > -1;
    const dbHadRecord = dbIndex > -1;
    const existing = monthlyHadRecord ? data.attendance[monthlyIndex] : null;
    const dbExisting = dbHadRecord ? state.db.attendance[dbIndex] : null;

    const current = existing?.status || dbExisting?.status || (isHol ? '미기록' : '등원');
    const prevMonthlyRecord = existing ? { ...existing } : null;
    const prevDbRecord = dbExisting ? { ...dbExisting } : null;

    let next;
    if (current === '등원' || current === '지각' || current === '보강' || current === '상담' || current === '미기록' || !current) {
        next = '결석';
    } else if (current === '결석') {
        next = '수업 없음';
    } else {
        next = '등원';
    }

    syncMonthlyAttendanceMetaToState(sid, date, {
        status: next
    });

    const cellEl = document.getElementById(`att-cell-${studentId}-${date}`);
    if (cellEl) cellEl.innerHTML = renderAttendanceCellContent(sid, date);

    try {
        const r = await api.patch('attendance', { studentId, date, status: next });
        if (!r?.success) throw new Error(r?.message || 'fail');

        if (state.ui?.currentClassId && typeof updateStudentRowDOM === 'function') {
            updateStudentRowDOM(sid, state.ui.currentClassId);
        }
    } catch {
        if (monthlyHadRecord && prevMonthlyRecord) {
            const idx = data.attendance.findIndex(a => String(a.student_id) === sid && String(a.date) === date);
            if (idx > -1) data.attendance[idx] = prevMonthlyRecord;
            else data.attendance.push(prevMonthlyRecord);
        } else {
            data.attendance = data.attendance.filter(a => !(String(a.student_id) === sid && String(a.date) === date));
        }

        if (dbHadRecord && prevDbRecord) {
            const idx = state.db.attendance.findIndex(a => String(a.student_id) === sid && String(a.date) === date);
            if (idx > -1) state.db.attendance[idx] = prevDbRecord;
            else state.db.attendance.push(prevDbRecord);
        } else {
            state.db.attendance = state.db.attendance.filter(a => !(String(a.student_id) === sid && String(a.date) === date));
        }

        if (cellEl) cellEl.innerHTML = renderAttendanceCellContent(sid, date);
        if (state.ui?.currentClassId && typeof updateStudentRowDOM === 'function') {
            updateStudentRowDOM(sid, state.ui.currentClassId);
        }
        toast('출석 저장에 실패했습니다.', 'warn');
    }
}

/**
 * [Picker] 월간 출석부용 대상 선택 모달
 */
function openCumulativeAttendanceMetaPicker() {
    toast('출결메모 기능은 사용하지 않습니다.', 'info');
}

/**
 * [Disabled] 출결메모 기능은 출석부 화면에서 사용하지 않는다.
 */
function openCumulativeAttendanceMetaModalFromPicker() {
    toast('출결메모 기능은 사용하지 않습니다.', 'info');
}

var SEB_COLS = [
    { semester: '1학기', examType: 'midterm', key: '1H-mid', label: '중간' },
    { semester: '1학기', examType: 'final', key: '1H-fin', label: '기말' },
    { semester: '2학기', examType: 'midterm', key: '2H-mid', label: '중간' },
    { semester: '2학기', examType: 'final', key: '2H-fin', label: '기말' }
];

function getSebExamRecord(studentId, year, semester, examType, subject) {
    var subj = subject || '수학';
    return (state.db.school_exam_records || []).find(function(r) {
        return String(r.student_id) === String(studentId) &&
            Number(r.exam_year) === Number(year) &&
            String(r.semester || '') === semester &&
            String(r.exam_type || '') === examType &&
            String(r.subject || '') === subj &&
            String(r.is_deleted || 0) !== '1';
    });
}

/* 고등 전용: 해당 학생+연도에 성적이 입력된 과목 목록 반환 (SEB_HIGH_SUBJECTS 순 정렬) */
var SEB_HIGH_SUBJECTS = ['대수', '미적분Ⅰ', '확률과통계', '미적분Ⅱ', '기하'];

function normalizeSebHighSubjectName(subject) {
    var s = String(subject || '').trim();
    if (s === '미적분1') return '미적분Ⅰ';
    if (s === '미적분2') return '미적분Ⅱ';
    if (s === '기하와벡터') return '기하';
    return s;
}

function parseSebHighSubjects(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeSebHighSubjectName).filter(Boolean);
    }
    var raw = String(value || '').trim();
    if (!raw) return [];
    try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(normalizeSebHighSubjectName).filter(Boolean);
    } catch (e) {}
    return raw.split(',').map(normalizeSebHighSubjectName).filter(Boolean);
}

function isSebSubjectManagedGrade(student) {
    var grade = getSebStudentDisplayGrade(student);
    return grade === '고2' || grade === '고3';
}

function getSebInputId(studentId, colKey, subject) {
    return 'seb-inp-' + String(studentId) + '-' + String(colKey) + '-' + encodeURIComponent(String(subject || '')).replace(/%/g, '_');
}

function sortSebSubjects(subjects) {
    var seen = {};
    var list = [];
    subjects.forEach(function(subject) {
        var s = normalizeSebHighSubjectName(subject);
        if (s && !seen[s]) {
            seen[s] = true;
            list.push(s);
        }
    });
    list.sort(function(a, b) {
        var ai = SEB_HIGH_SUBJECTS.indexOf(a);
        var bi = SEB_HIGH_SUBJECTS.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b, 'ko');
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
    return list;
}

function getSebHighSubjectsForStudent(studentId, year) {
    var student = getCumulativeStudent(studentId);

    if (isSebSubjectManagedGrade(student)) {
        return sortSebSubjects(parseSebHighSubjects(student?.high_subjects));
    }

    var records = (state.db.school_exam_records || []).filter(function(r) {
        return String(r.student_id) === String(studentId) &&
            Number(r.exam_year) === Number(year) &&
            String(r.is_deleted || 0) !== '1' &&
            (r.score !== null && r.score !== undefined && r.score !== '');
    });
    var subjects = records.map(function(r) { return r.subject || ''; });

    if (!subjects.length) {
        var grade = getSebStudentDisplayGrade(student);
        if (grade === '고1') subjects = ['공통수학1'];
    }

    return sortSebSubjects(subjects);
}

/* 고등 여부 판별 */
function isSebHighStudent(student) {
    var cid = getCumulativeClassIdForStudent(student?.id);
    var cls = (state.db.classes || []).find(function(c) { return String(c.id) === String(cid); });
    var text = [student?.grade, student?.school_name, cls?.grade, cls?.name].join(' ');
    return /고1|고2|고3|고등/.test(text);
}

function getSebStudentDisplayGrade(student) {
    const cid = getCumulativeClassIdForStudent(student?.id);
    const cls = (state.db.classes || []).find(c => String(c.id) === String(cid));
    const text = [
        student?.grade,
        student?.school_name,
        student?.name,
        cls?.grade,
        cls?.name
    ].join(' ');
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    return order.find(g => text.includes(g)) || String(student?.grade || '기타');
}

function getSebVisibleStudents() {
    const section = state.ui.schoolExamSection || 'middle';
    const classId = state.ui.schoolExamClassId || '';
    const teacherFilter = state.ui.schoolExamTeacher || '';
    const gradeTab = state.ui.schoolExamGradeTab || '';

    let students = getCumulativeVisibleStudents({ classId });

    if (teacherFilter) {
        const targetTeacher = normalizeSebTeacherName(teacherFilter);
        const tClassIds = (state.db.classes || [])
            .filter(c => normalizeSebTeacherName(c.teacher_name) === targetTeacher)
            .map(c => String(c.id));
        students = students.filter(s => tClassIds.includes(getCumulativeClassIdForStudent(s.id)));
    }

    students = students.filter(s => {
        const cid = getCumulativeClassIdForStudent(s.id);
        const cls = (state.db.classes || []).find(c => String(c.id) === String(cid));
        const text = [
            s.grade,
            s.school_name,
            s.name,
            cls?.grade,
            cls?.name
        ].join(' ');
        const isHigh = /고1|고2|고3|고등/.test(text);
        return section === 'high' ? isHigh : !isHigh;
    });

    if (gradeTab) {
        students = students.filter(s => {
            const cid = getCumulativeClassIdForStudent(s.id);
            const cls = (state.db.classes || []).find(c => String(c.id) === String(cid));
            const gradeText = [
                s.grade,
                cls?.grade,
                cls?.name
            ].join(' ');
            return gradeText.includes(gradeTab);
        });
    }

    return students;
}

function getPrevSebColKey(key) {
    const order = ['1H-mid', '1H-fin', '2H-mid', '2H-fin'];
    const idx = order.indexOf(key);
    return idx > 0 ? order[idx - 1] : null;
}

function getSebScore(studentId, year, colKey, subject) {
    var col = SEB_COLS.find(function(c) { return c.key === colKey; });
    if (!col) return null;

    var rec = getSebExamRecord(studentId, year, col.semester, col.examType, subject || '수학');
    if (!rec || rec.score === null || rec.score === undefined || rec.score === '') return null;

    var score = Number(rec.score);
    return Number.isFinite(score) ? score : null;
}

function calcSebAvg(scores) {
    const valid = scores.filter(s => s !== null && Number.isFinite(s));
    if (!valid.length) return null;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length * 10) / 10;
}

function buildSebTrendHtml(curr, prev) {
    if (curr === null || prev === null) return '';

    const diff = curr - prev;
    if (diff === 0) return '';

    const color = diff > 0 ? 'var(--success)' : '#e53935';
    const arrow = diff > 0 ? '▲' : '▼';

    return `<div style="font-size:10px;font-weight:700;color:${color};line-height:1.2;margin-top:1px;">${arrow}${Math.abs(diff)}</div>`;
}

function buildSebAvgRow(label, students, year, isGradeAvg) {
    const bg = isGradeAvg ? 'rgba(26,92,255,0.06)' : 'rgba(0,0,0,0.03)';
    const fontSize = isGradeAvg ? '12px' : '11px';

    const cols = SEB_COLS.map((col, i) => {
        const scores = students.map(s => getSebScore(s.id, year, col.key)).filter(s => s !== null);
        const avg = calcSebAvg(scores);
        const borderClass = (i === 0 || i === 2) ? 'seb-border2' : '';
        const text = avg !== null ? avg : '<span style="color:var(--border);font-size:12px;">-</span>';

        return `<td${borderClass ? ` class="${borderClass}"` : ''} style="text-align:center;background:${bg};padding:4px 2px;"><span style="font-size:${fontSize};font-weight:700;color:var(--secondary);">${text}</span></td>`;
    }).join('');

    return `<tr>
        <td class="seb-sticky-g" style="background:${bg};font-size:11px;font-weight:700;color:var(--secondary);"></td>
        <td class="seb-sticky-c" style="background:${bg};font-size:11px;font-weight:700;color:var(--secondary);"></td>
        <td class="seb-sticky-n" style="background:${bg};font-size:${fontSize};font-weight:700;color:var(--secondary);text-align:center;">${label}</td>
        ${cols}
    </tr>`;
}

function _sebToggleSortCol() {
    const el = document.getElementById('seb-sort-col');
    const sortEl = document.getElementById('seb-sort');
    if (el && sortEl) el.style.display = sortEl.value === 'score-desc' ? 'block' : 'none';
}

function closeSchoolExamLedger() {
    if (typeof leaveTimetableWideMode === 'function') leaveTimetableWideMode();
}

function openSchoolExamLedger() {
    const currentYear = new Date().getFullYear();
    const isAdmin = !!(state.auth && state.auth.role === 'admin');

    if (!isAdmin) state.ui.schoolExamTeacher = '';
    if (!state.ui.schoolExamYear) state.ui.schoolExamYear = currentYear;
    if (!state.ui.schoolExamSection) state.ui.schoolExamSection = 'middle';
    if (state.ui.schoolExamGradeTab === undefined || state.ui.schoolExamGradeTab === null) state.ui.schoolExamGradeTab = '';
    if (!state.ui.schoolExamClassId) state.ui.schoolExamClassId = '';
    if (!state.ui.schoolExamTeacher) state.ui.schoolExamTeacher = '';
    if (!state.ui.schoolExamSort) state.ui.schoolExamSort = 'default';
    if (!state.ui.schoolExamSortCol) state.ui.schoolExamSortCol = '1H-mid';

    const root = document.getElementById('app-root');
    if (!root) return;

    const section = state.ui.schoolExamSection;
    const gradeTab = state.ui.schoolExamGradeTab || '';
    const sort = state.ui.schoolExamSort;
    const sortCol = state.ui.schoolExamSortCol;
    const year = Number(state.ui.schoolExamYear) || currentYear;
    const teacherFilter = state.ui.schoolExamTeacher;

    const activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const sectionClasses = activeClasses.filter(c => {
        const isHigh = /고1|고2|고3|고등/.test(String(c.grade || '') + ' ' + String(c.name || ''));
        return section === 'high' ? isHigh : !isHigh;
    });

    let filteredClasses = sectionClasses;
    if (teacherFilter) {
        const targetTeacher = normalizeSebTeacherName(teacherFilter);
        filteredClasses = filteredClasses.filter(c => normalizeSebTeacherName(c.teacher_name) === targetTeacher);
    }
    
    if (gradeTab) {
        filteredClasses = filteredClasses.filter(c => String(c.grade || '').includes(gradeTab) || String(c.name || '').includes(gradeTab));
    }

    const gradeOptions = section === 'high' ? ['고1', '고2', '고3'] : ['중1', '중2', '중3'];
    const gradeSelectOptions = '<option value="">전체</option>' + gradeOptions
        .map(g => `<option value="${g}"${gradeTab === g ? ' selected' : ''}>${g}</option>`)
        .join('');

    const classOptions = '<option value="">전체 반</option>' + filteredClasses.map(c => {
        return '<option value="' + apEscapeHtml(c.id) + '"' + (String(c.id) === String(state.ui.schoolExamClassId) ? ' selected' : '') + '>' + apEscapeHtml(c.name) + '</option>';
    }).join('');

    const yearOptions = Array.from({ length: 5 }, function(_, i) {
        return currentYear - 2 + i;
    }).map(function(y) {
        return '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
    }).join('');

    let teacherHtml = '';
    if (isAdmin) {
        const teachers = [];
        const seen = {};

        (state.db.classes || []).forEach(function(c) {
            const t = c.teacher_name || '';
            if (t && !seen[t]) {
                seen[t] = true;
                teachers.push(t);
            }
        });

        teachers.sort();

        const tOpts = '<option value="">전체 선생님</option>' + teachers.map(function(t) {
            return '<option value="' + apEscapeHtml(t) + '"' + (t === teacherFilter ? ' selected' : '') + '>' + apEscapeHtml(t) + '</option>';
        }).join('');

        teacherHtml = `<select class="seb-ctrl" id="seb-teacher" onchange="state.ui.schoolExamTeacher=this.value;state.ui.schoolExamClassId='';openSchoolExamLedger()">${tOpts}</select>`;
    }

    const showSortCol = sort === 'score-desc';

    root.innerHTML = `
<style>
#seb-main { width: 100%; max-width: 850px; margin: 0 auto; height: calc(100vh - 56px); display: flex; flex-direction: column; padding: 16px 16px 0; box-sizing: border-box; }
.seb-ctrl { height: 44px; min-height: 44px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
#seb-body { flex: 1; overflow: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; }
#seb-tbl { border-collapse: collapse; width: 100%; min-width: 100%; table-layout: fixed; background: var(--surface); }
#seb-tbl th {
    position: sticky;
    background: var(--surface);
    font-size: 12px;
    font-weight: 700;
    color: var(--secondary);
    padding: 0 3px;
    text-align: center;
    white-space: nowrap;
    box-shadow: 0 1px 0 var(--border);
}
#seb-tbl thead tr:first-child th {
    top: 0;
    height: 34px;
    min-height: 34px;
    z-index: 4;
}
#seb-tbl thead tr:nth-child(2) th {
    top: 34px;
    height: 34px;
    min-height: 34px;
    z-index: 3;
}
#seb-tbl td { padding: 5px 2px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: center; background: var(--surface); }
.seb-sticky-g { position: sticky; left: 0; background: var(--surface); width: 28px; min-width: 28px; max-width: 28px; font-size: 11px; font-weight: 700; color: var(--secondary); text-align: center; border-right: 1px solid var(--border); }
.seb-sticky-c { position: sticky; left: 28px; background: var(--surface); width: 52px; min-width: 52px; max-width: 52px; font-size: 11px; font-weight: 700; color: var(--primary); text-align: center; border-right: 1px solid var(--border); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.seb-sticky-n { position: sticky; left: 80px; background: var(--surface); width: 64px; min-width: 64px; max-width: 64px; font-size: 13px; font-weight: 700; color: var(--text); padding: 6px 4px; border-right: 1px solid var(--border); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
#seb-tbl thead .seb-sticky-g, #seb-tbl thead .seb-sticky-c, #seb-tbl thead .seb-sticky-n {
    top: 0;
    height: 68px;
    min-height: 68px;
    z-index: 5;
}
.seb-inp { width: 54px; max-width: 100%; height: 38px; padding: 0 4px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 14px; font-weight: 700; text-align: center; font-family: inherit; box-sizing: border-box; }
.seb-inp:focus { outline: none; border-color: var(--primary); background: var(--surface); }
.seb-tab-wrap { display: flex; gap: 4px; background: var(--surface-2); padding: 4px; border-radius: 14px; }
.seb-tab { flex: 1; height: 40px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.seb-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.seb-tab:not(.active) { background: transparent; color: var(--secondary); }
.seb-border2 { border-left: 2px solid rgba(0,0,0,0.08) !important; }
.seb-grade-divider td { border-top: 2px solid rgba(0,0,0,0.08) !important; }
</style>
<div id="seb-main">
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-shrink:0;">
    <div style="font-size:20px;font-weight:700;color:var(--text);letter-spacing:-0.5px;cursor:pointer;white-space:nowrap;" onclick="closeSchoolExamLedger()">성적표</div>
    <div style="display:flex;align-items:center;gap:8px;">
      <select class="seb-ctrl" id="seb-yr" style="width:86px;" onchange="state.ui.schoolExamYear=Number(this.value);renderSchoolExamBatchTable()">${yearOptions}</select>
      <button class="btn" id="seb-save-btn" onclick="saveSchoolExamBatch()" style="height:44px;min-height:44px;padding:0 16px;border-radius:12px;font-size:13px;font-weight:700;background:var(--surface);color:var(--text);border:1px solid var(--border);box-shadow:none;">전체 저장</button>
    </div>
  </div>
  <div class="seb-tab-wrap" style="margin-bottom:10px;flex-shrink:0;">
    <button class="seb-tab ${section === 'middle' ? 'active' : ''}" onclick="state.ui.schoolExamSection='middle';state.ui.schoolExamGradeTab='';state.ui.schoolExamClassId='';openSchoolExamLedger()">중등</button>
    <button class="seb-tab ${section === 'high' ? 'active' : ''}" onclick="state.ui.schoolExamSection='high';state.ui.schoolExamGradeTab='';state.ui.schoolExamClassId='';openSchoolExamLedger()">고등</button>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:10px;flex-shrink:0;flex-wrap:wrap;">
    ${teacherHtml}
    <select class="seb-ctrl" id="seb-grade" style="flex:0.9;" onchange="state.ui.schoolExamGradeTab=this.value;state.ui.schoolExamClassId='';openSchoolExamLedger()">${gradeSelectOptions}</select>
    <select class="seb-ctrl" id="seb-cls" style="flex:1.5;" onchange="state.ui.schoolExamClassId=this.value;renderSchoolExamBatchTable()">${classOptions}</select>
    <select class="seb-ctrl" id="seb-sort" style="flex:0.9;${section === 'high' ? 'display:none;' : ''}" onchange="state.ui.schoolExamSort=this.value;_sebToggleSortCol();renderSchoolExamBatchTable()">
      <option value="default"${sort === 'default' ? ' selected' : ''}>기본</option>
      <option value="score-desc"${sort === 'score-desc' ? ' selected' : ''}>성적</option>
    </select>
    <select class="seb-ctrl" id="seb-sort-col" style="flex:1.2;display:${showSortCol && section !== 'high' ? 'block' : 'none'};" onchange="state.ui.schoolExamSortCol=this.value;renderSchoolExamBatchTable()">
      <option value="1H-mid"${sortCol === '1H-mid' ? ' selected' : ''}>1학기 중간</option>
      <option value="1H-fin"${sortCol === '1H-fin' ? ' selected' : ''}>1학기 기말</option>
      <option value="2H-mid"${sortCol === '2H-mid' ? ' selected' : ''}>2학기 중간</option>
      <option value="2H-fin"${sortCol === '2H-fin' ? ' selected' : ''}>2학기 기말</option>
    </select>
  </div>
  <div id="seb-body"><div id="seb-tbl-root"></div></div>
</div>`;

    renderSchoolExamBatchTable();
}

function renderSchoolExamBatchTable() {
    var root = document.getElementById('seb-tbl-root');
    if (!root) return;

    var year = Number(state.ui.schoolExamYear) || new Date().getFullYear();
    var sort = state.ui.schoolExamSort || 'default';
    var sortColKey = state.ui.schoolExamSortCol || '1H-mid';
    var gradeTab = state.ui.schoolExamGradeTab || '';
    var classId = state.ui.schoolExamClassId || '';
    var section = state.ui.schoolExamSection || 'middle';
    var students = getSebVisibleStudents();

    if (!students.length) {
        root.innerHTML = '<div style="padding:48px;text-align:center;color:var(--secondary);font-size:14px;font-weight:600;">표시할 학생이 없습니다.</div>';
        return;
    }

    /* ── 고등: 학생×과목 행 ── */
    if (section === 'high') {
        _renderHighExamTable(root, students, year, gradeTab, classId);
        return;
    }

    /* ── 중등: 기존 로직 ── */
    var hRow1 = '<th rowspan="2" class="seb-sticky-g">학년</th>'
        + '<th rowspan="2" class="seb-sticky-c">반</th>'
        + '<th rowspan="2" class="seb-sticky-n">이름</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(26,92,255,0.03);">1학기</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(5,150,105,0.03);">2학기</th>';

    var hRow2 = '<th class="seb-border2" style="background:rgba(26,92,255,0.03);">중간</th>'
        + '<th style="background:rgba(26,92,255,0.03);">기말</th>'
        + '<th class="seb-border2" style="background:rgba(5,150,105,0.03);">중간</th>'
        + '<th style="background:rgba(5,150,105,0.03);">기말</th>';

    var bodyRows = '';
    var gradeOrder = ['중1', '중2', '중3', '고1', '고2', '고3'];
    var byGrade = {};

    students.forEach(function(s) {
        var g = getSebStudentDisplayGrade(s);
        if (!byGrade[g]) byGrade[g] = [];
        byGrade[g].push(s);
    });

    var activeGrades = gradeOrder.filter(function(g) {
        return byGrade[g] && byGrade[g].length;
    });

    gradeOrder.forEach(function(grade) {
        var gradeStudents = byGrade[grade];
        if (!gradeStudents || !gradeStudents.length) return;

        var isFirstGrade = activeGrades[0] === grade;

        if (sort === 'score-desc') {
            gradeStudents = gradeStudents.slice().sort(function(a, b) {
                var sa = getSebScore(a.id, year, sortColKey, '수학');
                var sb = getSebScore(b.id, year, sortColKey, '수학');
                if (sa === null && sb === null) return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
                if (sa === null) return 1;
                if (sb === null) return -1;
                if (sb !== sa) return sb - sa;
                return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
            });

            gradeStudents.forEach(function(s, idx) {
                var gradeText = idx === 0 ? grade : '';
                var dividerClass = idx === 0 && !isFirstGrade ? ' seb-grade-divider' : '';
                var cols = SEB_COLS.map(function(col, ci) {
                    var score = getSebScore(s.id, year, col.key, '수학');
                    var prevKey = getPrevSebColKey(col.key);
                    var prevScore = prevKey ? getSebScore(s.id, year, prevKey, '수학') : null;
                    var trendHtml = buildSebTrendHtml(score, prevScore);
                    var borderClass = (ci === 0 || ci === 2) ? 'seb-border2' : '';
                    var val = score !== null ? score : '';
                    return '<td' + (borderClass ? ' class="' + borderClass + '"' : '') + ' style="text-align:center;padding:4px 2px;"><input type="number" class="seb-inp" id="seb-inp-' + s.id + '-' + col.key + '" value="' + val + '" min="0" max="100">' + trendHtml + '</td>';
                }).join('');
                bodyRows += '<tr class="' + dividerClass + '"><td class="seb-sticky-g" style="font-size:11px;font-weight:700;color:var(--secondary);">' + apEscapeHtml(gradeText) + '</td><td class="seb-sticky-c"></td><td class="seb-sticky-n">' + apEscapeHtml(s.name) + '</td>' + cols + '</tr>';
            });

            bodyRows += buildSebAvgRow(classId ? '평균' : '학년평균', gradeStudents, year, true);
            return;
        }

        var byClass = {};
        var classOrder = [];

        gradeStudents.forEach(function(s) {
            var cid = getCumulativeClassIdForStudent(s.id);
            var cn = getCumulativeClassName(cid) || '미배정';
            if (!byClass[cn]) { byClass[cn] = []; classOrder.push(cn); }
            byClass[cn].push(s);
        });

        classOrder.sort(function(a, b) {
            return String(a || '').localeCompare(String(b || ''), 'ko', { numeric: true });
        });

        var showClassAverage = !gradeTab || !!classId;
        var showGradeAverage = !classId;
        var gradeFirstRow = true;

        classOrder.forEach(function(cn) {
            var clsStudents = (byClass[cn] || []).slice().sort(function(a, b) {
                return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
            });
            var classFirstRow = true;

            clsStudents.forEach(function(s) {
                var isFirstInGrade = gradeFirstRow;
                var isFirstInClass = classFirstRow;
                var gradeText = isFirstInGrade ? grade : '';
                var classText = isFirstInClass ? cn : '';
                var dividerClass = isFirstInGrade && !isFirstGrade ? ' seb-grade-divider' : '';

                gradeFirstRow = false;
                classFirstRow = false;

                var cols = SEB_COLS.map(function(col, ci) {
                    var score = getSebScore(s.id, year, col.key, '수학');
                    var prevKey = getPrevSebColKey(col.key);
                    var prevScore = prevKey ? getSebScore(s.id, year, prevKey, '수학') : null;
                    var trendHtml = buildSebTrendHtml(score, prevScore);
                    var borderClass = (ci === 0 || ci === 2) ? 'seb-border2' : '';
                    var val = score !== null ? score : '';
                    return '<td' + (borderClass ? ' class="' + borderClass + '"' : '') + ' style="text-align:center;padding:4px 2px;"><input type="number" class="seb-inp" id="seb-inp-' + s.id + '-' + col.key + '" value="' + val + '" min="0" max="100">' + trendHtml + '</td>';
                }).join('');

                bodyRows += '<tr class="' + dividerClass + '"><td class="seb-sticky-g" style="font-size:11px;font-weight:700;color:var(--secondary);">' + apEscapeHtml(gradeText) + '</td><td class="seb-sticky-c">' + apEscapeHtml(classText) + '</td><td class="seb-sticky-n">' + apEscapeHtml(s.name) + '</td>' + cols + '</tr>';
            });

            if (showClassAverage) {
                bodyRows += buildSebAvgRow('반평균', clsStudents, year, false);
            }
        });

        if (showGradeAverage) {
            bodyRows += buildSebAvgRow('학년평균', gradeStudents, year, true);
        }
    });

    root.innerHTML = '<table id="seb-tbl"><thead><tr>' + hRow1 + '</tr><tr>' + hRow2 + '</tr></thead><tbody>' + (bodyRows || '<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--secondary);">학생 없음</td></tr>') + '</tbody></table>';
}

/* ── 고등 성적표 렌더링 ── */
function _renderHighExamTable(root, students, year, gradeTab, classId) {
    /* 헤더: 학년 | 반 | 이름 | 과목 | 1학기중간 | 1학기기말 | 2학기중간 | 2학기기말 */
    var hRow1 = '<th rowspan="2" class="seb-sticky-g">학년</th>'
        + '<th rowspan="2" class="seb-sticky-c">반</th>'
        + '<th rowspan="2" class="seb-sticky-n">이름</th>'
        + '<th rowspan="2" class="seb-sticky-s" style="position:sticky;left:144px;z-index:2;background:var(--surface);width:80px;min-width:80px;max-width:80px;font-size:11px;font-weight:700;color:var(--secondary);text-align:center;border-right:1px solid var(--border);padding:4px 2px;">과목</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(26,92,255,0.03);">1학기</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(5,150,105,0.03);">2학기</th>';

    var hRow2 = '<th class="seb-border2" style="background:rgba(26,92,255,0.03);">중간</th>'
        + '<th style="background:rgba(26,92,255,0.03);">기말</th>'
        + '<th class="seb-border2" style="background:rgba(5,150,105,0.03);">중간</th>'
        + '<th style="background:rgba(5,150,105,0.03);">기말</th>';

    var gradeOrder = ['고1', '고2', '고3'];
    var byGrade = {};
    students.forEach(function(s) {
        var g = getSebStudentDisplayGrade(s);
        if (!byGrade[g]) byGrade[g] = [];
        byGrade[g].push(s);
    });

    var activeGrades = gradeOrder.filter(function(g) { return byGrade[g] && byGrade[g].length; });
    var bodyRows = '';

    gradeOrder.forEach(function(grade) {
        var gradeStudents = byGrade[grade];
        if (!gradeStudents || !gradeStudents.length) return;

        var isFirstGrade = activeGrades[0] === grade;

        var byClass = {};
        var classOrder = [];
        gradeStudents.forEach(function(s) {
            var cid = getCumulativeClassIdForStudent(s.id);
            var cn = getCumulativeClassName(cid) || '미배정';
            if (!byClass[cn]) { byClass[cn] = []; classOrder.push(cn); }
            byClass[cn].push(s);
        });
        classOrder.sort(function(a, b) { return String(a||'').localeCompare(String(b||''), 'ko', {numeric:true}); });

        var gradeFirstRow = true;

        classOrder.forEach(function(cn) {
            var clsStudents = (byClass[cn]||[]).slice().sort(function(a,b) {
                return String(a.name||'').localeCompare(String(b.name||''), 'ko', {numeric:true});
            });
            var classFirstRow = true;

            clsStudents.forEach(function(s) {
                var subjects = getSebHighSubjectsForStudent(s.id, year);

                /* 과목이 하나도 없어도 1행(과목 미지정 안내)은 보여줌 */
                var rowCount = subjects.length || 1;

                for (var si = 0; si < rowCount; si++) {
                    var subj = subjects[si] || null;
                    var isFirstSubj = si === 0;
                    var isFirstInGrade = gradeFirstRow && isFirstSubj;
                    var isFirstInClass = classFirstRow && isFirstSubj;

                    var gradeText = isFirstInGrade ? grade : '';
                    var classText = isFirstInClass ? cn : '';
                    var dividerClass = isFirstInGrade && !isFirstGrade ? ' seb-grade-divider' : '';

                    if (isFirstSubj) { gradeFirstRow = false; classFirstRow = false; }

                    /* 과목 뱃지 */
                    var subjColor = _sebSubjectColor(subj);
                    var subjCell = subj
                        ? '<span style="display:inline-block;padding:2px 7px;border-radius:6px;font-size:11px;font-weight:700;background:' + subjColor.bg + ';color:' + subjColor.text + ';">' + apEscapeHtml(subj) + '</span>'
                        : '<span style="color:var(--border);font-size:11px;">-</span>';

                    /* 점수 셀 4개 */
                    var scoreCols = SEB_COLS.map(function(col, ci) {
                        var borderClass = (ci === 0 || ci === 2) ? 'seb-border2' : '';
                        if (!subj) {
                            return '<td' + (borderClass ? ' class="' + borderClass + '"' : '') + ' style="text-align:center;padding:4px 2px;"><span style="color:var(--border);">-</span></td>';
                        }
                        var score = getSebScore(s.id, year, col.key, subj);
                        var prevKey = getPrevSebColKey(col.key);
                        var prevScore = prevKey ? getSebScore(s.id, year, prevKey, subj) : null;
                        var trendHtml = buildSebTrendHtml(score, prevScore);
                        var val = score !== null ? score : '';
                        var inpId = getSebInputId(s.id, col.key, subj);
                        return '<td' + (borderClass ? ' class="' + borderClass + '"' : '') + ' style="text-align:center;padding:4px 2px;"><input type="number" class="seb-inp" id="' + apEscapeHtml(inpId) + '" value="' + val + '" min="0" max="100">' + trendHtml + '</td>';
                    }).join('');

                    /* 이름 셀: 첫 과목 행에만, rowspan으로 묶기 */
                    var nameCell = '';
                    var gradeCell = '';
                    var classCell = '';
                    if (isFirstSubj) {
                        var rs = rowCount > 1 ? ' rowspan="' + rowCount + '"' : '';
                        gradeCell = '<td class="seb-sticky-g"' + rs + ' style="font-size:11px;font-weight:700;color:var(--secondary);vertical-align:middle;">' + apEscapeHtml(gradeText) + '</td>';
                        classCell = '<td class="seb-sticky-c"' + rs + ' style="vertical-align:middle;">' + apEscapeHtml(classText) + '</td>';
                        nameCell = '<td class="seb-sticky-n"' + rs + ' style="vertical-align:middle;">' + apEscapeHtml(s.name) + '</td>';
                    }

                    bodyRows += '<tr class="' + dividerClass + '">' + gradeCell + classCell + nameCell
                        + '<td class="seb-sticky-s" style="position:sticky;left:144px;z-index:2;background:var(--surface);text-align:center;padding:4px 6px;border-right:1px solid var(--border);">' + subjCell + '</td>'
                        + scoreCols + '</tr>';
                }
            });
        });
    });

    /* 고등 thead sticky: seb-sticky-s도 z-index 맞춤 */
    root.innerHTML = '<style>#seb-tbl thead .seb-sticky-s{top:0;height:68px;min-height:68px;z-index:6;position:sticky;left:144px;}</style>'
        + '<table id="seb-tbl"><thead><tr>' + hRow1 + '</tr><tr>' + hRow2 + '</tr></thead><tbody>'
        + (bodyRows || '<tr><td colspan="8" style="padding:32px;text-align:center;color:var(--secondary);">학생 없음</td></tr>')
        + '</tbody></table>';
}

/* 과목별 뱃지 색상 */
function _sebSubjectColor(subj) {
    var map = {
        '공통수학1':     { bg: 'rgba(26,92,255,0.10)', text: '#1746C7' },
        '공통수학2':     { bg: 'rgba(0,184,148,0.10)', text: '#008F72' },
        '대수':         { bg: 'rgba(83,74,183,0.12)', text: '#3C3489' },
        '확률과통계':   { bg: 'rgba(186,117,23,0.13)', text: '#854F0B' },
        '미적분Ⅰ':      { bg: 'rgba(24,95,165,0.12)', text: '#0C447C' },
        '미적분Ⅱ':      { bg: 'rgba(15,110,86,0.12)', text: '#085041' },
        '기하':         { bg: 'rgba(153,53,86,0.12)', text: '#72243E' }
    };
    return map[subj] || { bg: 'rgba(136,135,128,0.13)', text: '#444441' };
}

function _buildSebRow(s, year, gradeText, classText) {
    const cols = SEB_COLS.map(function(col, i) {
        const sid = String(s.id);
        const rec = getSebExamRecord(sid, year, col.semester, col.examType);
        const val = (rec && rec.score !== null && rec.score !== undefined && rec.score !== '') ? rec.score : '';
        const border = (i === 0 || i === 2) ? ' class="seb-border2"' : '';
        return '<td' + border + ' style="text-align:center;"><input type="number" class="seb-inp" id="seb-inp-' + sid + '-' + col.key + '" value="' + val + '" min="0" max="100"></td>';
    }).join('');

    return '<tr><td class="seb-sticky-g">' + apEscapeHtml(gradeText || '') + '</td><td class="seb-sticky-c">' + apEscapeHtml(classText || '') + '</td><td class="seb-sticky-n">' + apEscapeHtml(s.name) + '</td>' + cols + '</tr>';
}

async function saveSchoolExamBatch() {
    var year = Number(state.ui.schoolExamYear) || new Date().getFullYear();
    var section = state.ui.schoolExamSection || 'middle';
    var students = getSebVisibleStudents();

    if (!students.length) return toast('저장할 학생이 없습니다.', 'warn');

    /* ── 고등: 과목별 입력값 수집 ── */
    if (section === 'high') {
        var highRecords = [];
        var hasError = false;

        students.forEach(function(s) {
            var subjects = getSebHighSubjectsForStudent(s.id, year);
            subjects.forEach(function(subj) {
                SEB_COLS.forEach(function(col) {
                    var inpId = getSebInputId(s.id, col.key, subj);
                    var inp = document.getElementById(inpId);
                    if (!inp) return;
                    var v = (inp.value || '').trim();
                    if (v !== '') {
                        var n = Number(v);
                        if (!Number.isFinite(n) || n < 0 || n > 100) {
                            toast(s.name + ' / ' + subj + ': 0~100 사이 숫자여야 합니다.', 'warn');
                            hasError = true;
                            return;
                        }
                    }
                    highRecords.push({ studentId: s.id, subject: subj, semester: col.semester, examType: col.examType, score: v === '' ? null : Number(v) });
                });
            });
        });

        if (hasError) return;

        var btn = document.getElementById('seb-save-btn');
        if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }

        try {
            /* 과목×학기×유형 조합별로 batch 요청 */
            var combos = {};
            highRecords.forEach(function(rec) {
                var key = rec.subject + '|' + rec.semester + '|' + rec.examType;
                if (!combos[key]) combos[key] = { subject: rec.subject, semester: rec.semester, examType: rec.examType, records: [] };
                combos[key].records.push({ studentId: rec.studentId, score: rec.score });
            });

            var keys = Object.keys(combos);
            for (var ki = 0; ki < keys.length; ki++) {
                var combo = combos[keys[ki]];
                await api.post('school-exam-records/batch', {
                    examYear: year,
                    semester: combo.semester,
                    examType: combo.examType,
                    subject: combo.subject,
                    records: combo.records
                });
            }

            toast('저장되었습니다.', 'success');
            await loadData();
            renderSchoolExamBatchTable();
        } catch (e) {
            toast('저장에 실패했습니다.', 'warn');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = '전체 저장'; }
        }
        return;
    }

    /* ── 중등: 기존 로직 (subject='수학' 고정) ── */
    for (var i = 0; i < students.length; i++) {
        for (var j = 0; j < SEB_COLS.length; j++) {
            var inp = document.getElementById('seb-inp-' + students[i].id + '-' + SEB_COLS[j].key);
            if (!inp) continue;
            var val = (inp.value || '').trim();
            if (val !== '') {
                var n = Number(val);
                if (!Number.isFinite(n) || n < 0 || n > 100) {
                    return toast(students[i].name + ': 0~100 사이 숫자여야 합니다.', 'warn');
                }
            }
        }
    }

    var btn2 = document.getElementById('seb-save-btn');
    if (btn2) { btn2.disabled = true; btn2.textContent = '저장 중...'; }

    try {
        for (var ci = 0; ci < SEB_COLS.length; ci++) {
            var col = SEB_COLS[ci];
            var records = students.map(function(s) {
                var inp = document.getElementById('seb-inp-' + s.id + '-' + col.key);
                var v = inp ? (inp.value || '').trim() : '';
                return { studentId: s.id, score: v === '' ? null : Number(v) };
            });

            await api.post('school-exam-records/batch', {
                examYear: year,
                semester: col.semester,
                examType: col.examType,
                subject: '수학',
                records: records
            });
        }

        toast('저장되었습니다.', 'success');
        await loadData();
        renderSchoolExamBatchTable();
    } catch (e) {
        toast('저장에 실패했습니다.', 'warn');
    } finally {
        if (btn2) { btn2.disabled = false; btn2.textContent = '전체 저장'; }
    }
}

function openCumulativeOpsModal(mode = 'attendance') {
    if (mode === 'school') openSchoolExamLedger();
    else openAttendanceLedger();
}

function switchCumulativeOpsTab(tab) {
    if (tab === 'school') openSchoolExamLedger();
    else openAttendanceLedger();
}

function getCumulativeRecordKey(record) {
    return [record.exam_year || '', record.semester || '', record.exam_type || '', record.subject || ''].join('|');
}

function getRecentSchoolExamColumns(records, limit = 4) {
    const seen = new Set();
    const columns = [];

    [...records]
        .filter(r => String(r.is_deleted || 0) !== '1')
        .sort((a, b) => {
            const yd = Number(b.exam_year || 0) - Number(a.exam_year || 0);
            if (yd !== 0) return yd;
            return String(b.created_at || '').localeCompare(String(a.created_at || ''));
        })
        .forEach(r => {
            const key = getCumulativeRecordKey(r);
            if (seen.has(key)) return;

            seen.add(key);
            columns.push({
                key,
                examYear: r.exam_year,
                semester: r.semester || '',
                examType: r.exam_type || '',
                subject: r.subject || ''
            });
        });

    return columns.slice(0, limit);
}

function getSchoolExamRecordForCell(records, studentId, column) {
    return records.find(r => String(r.student_id) === String(studentId) && getCumulativeRecordKey(r) === column.key);
}

function renderSchoolExamScoreCell(record) {
    if (!record) return '<span style="color:var(--secondary);font-weight:600;">-</span>';

    const score = record.score;
    const scoreText = score === null || score === undefined || score === '' ? '미응시' : `${score}`;
    const target = record.target_score_snapshot;
    const diff = (score !== null && score !== undefined && score !== '' && target !== null && target !== undefined && target !== '') ? Number(score) - Number(target) : null;
    const diffText = (diff === null || !Number.isFinite(diff)) ? '' : `<div style="font-size:10px;font-weight:600;color:${diff >= 0 ? 'var(--success)' : 'var(--error)'};margin-top:2px;">목표 ${diff >= 0 ? '+' : ''}${diff}</div>`;

    return `<span style="font-size:13px;font-weight:700;color:var(--text);">${scoreText}${diffText}</span>`;
}

function computeSchoolExamTrend(records, studentId) {
    const list = records
        .filter(r => String(r.student_id) === String(studentId) && r.score !== null && r.score !== undefined && r.score !== '')
        .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')));

    if (!list.length) return { avg: '-', trend: '-' };

    const scores = list.map(r => Number(r.score)).filter(Number.isFinite);
    const avg = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : '-';
    const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : null;

    return {
        avg,
        trend: trend === null ? '-' : `${trend >= 0 ? '+' : ''}${trend}`
    };
}

function openSchoolExamRecordModal(recordId, studentId) {
    recordId = recordId || '';
    studentId = studentId || '';
    var record = recordId ? (state.db.school_exam_records || []).find(function(r) { return String(r.id) === String(recordId); }) : null;
    var selectedStudentId = studentId || record?.student_id || '';
    var currentYear = new Date().getFullYear();
    var studentOptions = getCumulativeVisibleStudents({}).map(function(s) {
        return '<option value="' + apEscapeHtml(s.id) + '"' + (String(s.id) === String(selectedStudentId) ? ' selected' : '') + '>' + apEscapeHtml(s.name || '') + (s.school_name ? ' (' + apEscapeHtml(s.school_name) + ')' : '') + '</option>';
    }).join('');
    var student = selectedStudentId ? getCumulativeStudent(selectedStudentId) : null;
    var targetScore = record?.target_score_snapshot ?? student?.target_score ?? '';

    /* 고등 여부 판별 */
    var isHigh = student ? isSebHighStudent(student) : false;
    var curSubject = normalizeSebHighSubjectName(record?.subject || (isHigh ? '대수' : '수학'));

    /* 과목 필드: 고등=선택박스, 중등=텍스트입력 */
    var subjectField = '';
    if (isHigh) {
        var subjOptions = SEB_HIGH_SUBJECTS.map(function(s) {
            return '<option value="' + apEscapeHtml(s) + '"' + (curSubject === s ? ' selected' : '') + '>' + apEscapeHtml(s) + '</option>';
        }).join('');
        subjOptions += '<option value="__custom__"' + (!SEB_HIGH_SUBJECTS.includes(curSubject) && curSubject ? ' selected' : '') + '>직접입력...</option>';
        subjectField = '<select id="ser-subject" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);text-align:left;" onchange="if(this.value===\'__custom__\'){var v=prompt(\'과목명 직접입력\',\'\');if(v){var o=document.createElement(\'option\');o.value=v;o.text=v;this.insertBefore(o,this.lastElementChild);this.value=v;}else{this.value=\'' + apEscapeHtml(SEB_HIGH_SUBJECTS[0]) + '\';}}">'+subjOptions+'</select>';
    } else {
        subjectField = '<input id="ser-subject" class="btn" value="' + apEscapeHtml(curSubject) + '" placeholder="과목" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">';
    }

    showModal(record ? '학교시험 성적 수정' : '학교시험 성적 추가', `
<div style="display:flex;flex-direction:column;gap:10px;">
  <select id="ser-student" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);" onchange="openSchoolExamRecordModal('${recordId}',this.value)"><option value="">학생 선택</option>${studentOptions}</select>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-school" class="btn" value="${apEscapeHtml(record?.school_name || student?.school_name || '')}" placeholder="학교" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <input id="ser-grade" class="btn" value="${apEscapeHtml(record?.grade || student?.grade || '')}" placeholder="학년" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-year" type="number" class="btn" value="${record?.exam_year || currentYear}" placeholder="연도" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <select id="ser-semester" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">${['1학기','2학기'].map(v => `<option value="${v}" ${String(record?.semester || '') === v ? 'selected' : ''}>${v}</option>`).join('')}</select>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <select id="ser-type" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">${[['midterm','중간'],['final','기말'],['performance','수행'],['etc','기타']].map(([v,l]) => `<option value="${v}" ${String(record?.exam_type || 'midterm') === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
    ${subjectField}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-score" type="number" class="btn" value="${record?.score ?? ''}" placeholder="점수/미응시 공란" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <input id="ser-target" type="number" class="btn" value="${targetScore}" placeholder="목표점수" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
  </div>
  <textarea id="ser-memo" class="btn" placeholder="메모" style="height:84px;text-align:left;resize:vertical;font-size:13px;font-weight:500;line-height:1.6;background:var(--surface-2);border:1px solid var(--border);">${apEscapeHtml(record?.memo || '')}</textarea>
  <button class="btn btn-primary" style="width:100%;min-height:48px;font-size:14px;font-weight:700;border-radius:12px;" onclick="saveSchoolExamRecord('${recordId || ''}')">저장</button>
  ${record ? `<button class="btn" style="width:100%;min-height:42px;font-size:13px;font-weight:700;color:var(--error);background:rgba(255,71,87,0.08);border:1px solid rgba(255,71,87,0.16);border-radius:12px;" onclick="deleteSchoolExamRecord('${record.id}')">삭제</button>` : ''}
</div>`);
}

async function saveSchoolExamRecord(recordId) {
    recordId = recordId || '';
    var studentId = document.getElementById('ser-student')?.value || '';
    if (!studentId) return toast('학생을 선택하세요.', 'warn');

    var student = getCumulativeStudent(studentId);
    var rawSubject = document.getElementById('ser-subject')?.value || '';
    /* __custom__ 이 남아있으면 빈 값으로 처리 */
    var subject = (rawSubject === '__custom__' ? '' : rawSubject.trim()) || (isSebHighStudent(student) ? '대수' : '수학');

    var payload = {
        studentId: studentId,
        classId: getCumulativeClassIdForStudent(studentId),
        schoolName: document.getElementById('ser-school')?.value.trim() || student?.school_name || '',
        grade: document.getElementById('ser-grade')?.value.trim() || student?.grade || '',
        examYear: Number(document.getElementById('ser-year')?.value || 0),
        semester: document.getElementById('ser-semester')?.value || '',
        examType: document.getElementById('ser-type')?.value || 'midterm',
        subject: subject,
        score: document.getElementById('ser-score')?.value ?? '',
        targetScoreSnapshot: document.getElementById('ser-target')?.value ?? '',
        memo: document.getElementById('ser-memo')?.value.trim() || ''
    };

    if (!payload.examYear || !payload.examType || !payload.subject) {
        return toast('연도, 시험유형, 과목을 확인하세요.', 'warn');
    }

    var r = recordId
        ? await api.patch('school-exam-records/' + recordId, payload)
        : await api.post('school-exam-records', payload);

    if (r?.success) {
        toast('학교시험 성적이 저장되었습니다.', 'success');
        await loadData();
        closeModal();
        renderSchoolExamBatchTable();
    } else {
        toast(r?.message || '학교시험 성적 저장에 실패했습니다.', 'warn');
    }
}

async function deleteSchoolExamRecord(recordId) {
    if (!recordId) return;
    if (!confirm('학교시험 성적 기록을 삭제할까요?')) return;

    const r = await api.delete('school-exam-records', recordId);

    if (r?.success) {
        toast('학교시험 성적 기록이 삭제되었습니다.', 'info');
        await loadData();
        closeModal();
    } else {
        toast('학교시험 성적 삭제에 실패했습니다.', 'warn');
    }
}